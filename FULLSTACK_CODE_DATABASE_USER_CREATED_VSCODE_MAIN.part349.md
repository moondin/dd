---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 349
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 349 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/languageModelToolsConfirmationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/languageModelToolsConfirmationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickTreeItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../platform/theme/common/colorUtils.js';
import { ConfirmedReason, ToolConfirmKind } from '../common/chatService.js';
import { ILanguageModelToolConfirmationActions, ILanguageModelToolConfirmationContribution, ILanguageModelToolConfirmationContributionQuickTreeItem, ILanguageModelToolConfirmationRef, ILanguageModelToolsConfirmationService } from '../common/languageModelToolsConfirmationService.js';
import { IToolData, ToolDataSource } from '../common/languageModelToolsService.js';

const RUN_WITHOUT_APPROVAL = localize('runWithoutApproval', "without approval");
const CONTINUE_WITHOUT_REVIEWING_RESULTS = localize('continueWithoutReviewingResults', "without reviewing result");


class GenericConfirmStore extends Disposable {
	private _workspaceStore: Lazy<ToolConfirmStore>;
	private _profileStore: Lazy<ToolConfirmStore>;
	private _memoryStore = new Set<string>();

	constructor(
		private readonly _storageKey: string,
		private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._workspaceStore = new Lazy(() => this._register(this._instantiationService.createInstance(ToolConfirmStore, StorageScope.WORKSPACE, this._storageKey)));
		this._profileStore = new Lazy(() => this._register(this._instantiationService.createInstance(ToolConfirmStore, StorageScope.PROFILE, this._storageKey)));
	}

	public setAutoConfirmation(id: string, scope: 'workspace' | 'profile' | 'session' | 'never'): void {
		// Clear from all scopes first
		this._workspaceStore.value.setAutoConfirm(id, false);
		this._profileStore.value.setAutoConfirm(id, false);
		this._memoryStore.delete(id);

		// Set in the appropriate scope
		if (scope === 'workspace') {
			this._workspaceStore.value.setAutoConfirm(id, true);
		} else if (scope === 'profile') {
			this._profileStore.value.setAutoConfirm(id, true);
		} else if (scope === 'session') {
			this._memoryStore.add(id);
		}
	}

	public getAutoConfirmation(id: string): 'workspace' | 'profile' | 'session' | 'never' {
		if (this._workspaceStore.value.getAutoConfirm(id)) {
			return 'workspace';
		}
		if (this._profileStore.value.getAutoConfirm(id)) {
			return 'profile';
		}
		if (this._memoryStore.has(id)) {
			return 'session';
		}
		return 'never';
	}

	public getAutoConfirmationIn(id: string, scope: 'workspace' | 'profile' | 'session'): boolean {
		if (scope === 'workspace') {
			return this._workspaceStore.value.getAutoConfirm(id);
		} else if (scope === 'profile') {
			return this._profileStore.value.getAutoConfirm(id);
		} else {
			return this._memoryStore.has(id);
		}
	}

	public reset(): void {
		this._workspaceStore.value.reset();
		this._profileStore.value.reset();
		this._memoryStore.clear();
	}

	public checkAutoConfirmation(id: string): ConfirmedReason | undefined {
		if (this._workspaceStore.value.getAutoConfirm(id)) {
			return { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' };
		}
		if (this._profileStore.value.getAutoConfirm(id)) {
			return { type: ToolConfirmKind.LmServicePerTool, scope: 'profile' };
		}
		if (this._memoryStore.has(id)) {
			return { type: ToolConfirmKind.LmServicePerTool, scope: 'session' };
		}
		return undefined;
	}

	public getAllConfirmed(): Set<string> {
		const all = new Set<string>();
		for (const key of this._workspaceStore.value.getAll()) {
			all.add(key);
		}
		for (const key of this._profileStore.value.getAll()) {
			all.add(key);
		}
		for (const key of this._memoryStore) {
			all.add(key);
		}
		return all;
	}
}

class ToolConfirmStore extends Disposable {
	private _autoConfirmTools: LRUCache<string, boolean> = new LRUCache<string, boolean>(100);
	private _didChange = false;

	constructor(
		private readonly _scope: StorageScope,
		private readonly _storageKey: string,
		@IStorageService private readonly storageService: IStorageService,
	) {
		super();

		const stored = storageService.getObject<string[]>(this._storageKey, this._scope);
		if (stored) {
			for (const key of stored) {
				this._autoConfirmTools.set(key, true);
			}
		}

		this._register(storageService.onWillSaveState(() => {
			if (this._didChange) {
				this.storageService.store(this._storageKey, [...this._autoConfirmTools.keys()], this._scope, StorageTarget.MACHINE);
				this._didChange = false;
			}
		}));
	}

	public reset() {
		this._autoConfirmTools.clear();
		this._didChange = true;
	}

	public getAutoConfirm(id: string): boolean {
		if (this._autoConfirmTools.get(id)) {
			this._didChange = true;
			return true;
		}

		return false;
	}

	public setAutoConfirm(id: string, autoConfirm: boolean): void {
		if (autoConfirm) {
			this._autoConfirmTools.set(id, true);
		} else {
			this._autoConfirmTools.delete(id);
		}
		this._didChange = true;
	}

	public getAll(): string[] {
		return [...this._autoConfirmTools.keys()];
	}
}

export class LanguageModelToolsConfirmationService extends Disposable implements ILanguageModelToolsConfirmationService {
	declare readonly _serviceBrand: undefined;

	private _preExecutionToolConfirmStore: GenericConfirmStore;
	private _postExecutionToolConfirmStore: GenericConfirmStore;
	private _preExecutionServerConfirmStore: GenericConfirmStore;
	private _postExecutionServerConfirmStore: GenericConfirmStore;

	private _contributions = new Map<string, ILanguageModelToolConfirmationContribution>();

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
	) {
		super();

		this._preExecutionToolConfirmStore = this._register(new GenericConfirmStore('chat/autoconfirm', this._instantiationService));
		this._postExecutionToolConfirmStore = this._register(new GenericConfirmStore('chat/autoconfirm-post', this._instantiationService));
		this._preExecutionServerConfirmStore = this._register(new GenericConfirmStore('chat/servers/autoconfirm', this._instantiationService));
		this._postExecutionServerConfirmStore = this._register(new GenericConfirmStore('chat/servers/autoconfirm-post', this._instantiationService));
	}

	getPreConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		// Check contribution first
		const contribution = this._contributions.get(ref.toolId);
		if (contribution?.getPreConfirmAction) {
			const result = contribution.getPreConfirmAction(ref);
			if (result) {
				return result;
			}
		}

		// If contribution disables default approvals, don't check default stores
		if (contribution && contribution.canUseDefaultApprovals === false) {
			return undefined;
		}

		// Check tool-level confirmation
		const toolResult = this._preExecutionToolConfirmStore.checkAutoConfirmation(ref.toolId);
		if (toolResult) {
			return toolResult;
		}

		// Check server-level confirmation for MCP tools
		if (ref.source.type === 'mcp') {
			const serverResult = this._preExecutionServerConfirmStore.checkAutoConfirmation(ref.source.definitionId);
			if (serverResult) {
				return serverResult;
			}
		}

		return undefined;
	}

	getPostConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		// Check contribution first
		const contribution = this._contributions.get(ref.toolId);
		if (contribution?.getPostConfirmAction) {
			const result = contribution.getPostConfirmAction(ref);
			if (result) {
				return result;
			}
		}

		// If contribution disables default approvals, don't check default stores
		if (contribution && contribution.canUseDefaultApprovals === false) {
			return undefined;
		}

		// Check tool-level confirmation
		const toolResult = this._postExecutionToolConfirmStore.checkAutoConfirmation(ref.toolId);
		if (toolResult) {
			return toolResult;
		}

		// Check server-level confirmation for MCP tools
		if (ref.source.type === 'mcp') {
			const serverResult = this._postExecutionServerConfirmStore.checkAutoConfirmation(ref.source.definitionId);
			if (serverResult) {
				return serverResult;
			}
		}

		return undefined;
	}

	getPreConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		const actions: ILanguageModelToolConfirmationActions[] = [];

		// Add contribution actions first
		const contribution = this._contributions.get(ref.toolId);
		if (contribution?.getPreConfirmActions) {
			actions.push(...contribution.getPreConfirmActions(ref));
		}

		// If contribution disables default approvals, only return contribution actions
		if (contribution && contribution.canUseDefaultApprovals === false) {
			return actions;
		}

		// Add default tool-level actions
		actions.push(
			{
				label: localize('allowSession', 'Allow in this Session'),
				detail: localize('allowSessionTooltip', 'Allow this tool to run in this session without confirmation.'),
				divider: !!actions.length,
				select: async () => {
					this._preExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'session');
					return true;
				}
			},
			{
				label: localize('allowWorkspace', 'Allow in this Workspace'),
				detail: localize('allowWorkspaceTooltip', 'Allow this tool to run in this workspace without confirmation.'),
				select: async () => {
					this._preExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'workspace');
					return true;
				}
			},
			{
				label: localize('allowGlobally', 'Always Allow'),
				detail: localize('allowGloballyTooltip', 'Always allow this tool to run without confirmation.'),
				select: async () => {
					this._preExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'profile');
					return true;
				}
			}
		);

		// Add server-level actions for MCP tools
		if (ref.source.type === 'mcp') {
			const { serverLabel, definitionId } = ref.source;
			actions.push(
				{
					label: localize('allowServerSession', 'Allow Tools from {0} in this Session', serverLabel),
					detail: localize('allowServerSessionTooltip', 'Allow all tools from this server to run in this session without confirmation.'),
					divider: true,
					select: async () => {
						this._preExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'session');
						return true;
					}
				},
				{
					label: localize('allowServerWorkspace', 'Allow Tools from {0} in this Workspace', serverLabel),
					detail: localize('allowServerWorkspaceTooltip', 'Allow all tools from this server to run in this workspace without confirmation.'),
					select: async () => {
						this._preExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'workspace');
						return true;
					}
				},
				{
					label: localize('allowServerGlobally', 'Always Allow Tools from {0}', serverLabel),
					detail: localize('allowServerGloballyTooltip', 'Always allow all tools from this server to run without confirmation.'),
					select: async () => {
						this._preExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'profile');
						return true;
					}
				}
			);
		}

		return actions;
	}

	getPostConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		const actions: ILanguageModelToolConfirmationActions[] = [];

		// Add contribution actions first
		const contribution = this._contributions.get(ref.toolId);
		if (contribution?.getPostConfirmActions) {
			actions.push(...contribution.getPostConfirmActions(ref));
		}

		// If contribution disables default approvals, only return contribution actions
		if (contribution && contribution.canUseDefaultApprovals === false) {
			return actions;
		}

		// Add default tool-level actions
		actions.push(
			{
				label: localize('allowSessionPost', 'Allow Without Review in this Session'),
				detail: localize('allowSessionPostTooltip', 'Allow results from this tool to be sent without confirmation in this session.'),
				divider: !!actions.length,
				select: async () => {
					this._postExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'session');
					return true;
				}
			},
			{
				label: localize('allowWorkspacePost', 'Allow Without Review in this Workspace'),
				detail: localize('allowWorkspacePostTooltip', 'Allow results from this tool to be sent without confirmation in this workspace.'),
				select: async () => {
					this._postExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'workspace');
					return true;
				}
			},
			{
				label: localize('allowGloballyPost', 'Always Allow Without Review'),
				detail: localize('allowGloballyPostTooltip', 'Always allow results from this tool to be sent without confirmation.'),
				select: async () => {
					this._postExecutionToolConfirmStore.setAutoConfirmation(ref.toolId, 'profile');
					return true;
				}
			}
		);

		// Add server-level actions for MCP tools
		if (ref.source.type === 'mcp') {
			const { serverLabel, definitionId } = ref.source;
			actions.push(
				{
					label: localize('allowServerSessionPost', 'Allow Tools from {0} Without Review in this Session', serverLabel),
					detail: localize('allowServerSessionPostTooltip', 'Allow results from all tools from this server to be sent without confirmation in this session.'),
					divider: true,
					select: async () => {
						this._postExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'session');
						return true;
					}
				},
				{
					label: localize('allowServerWorkspacePost', 'Allow Tools from {0} Without Review in this Workspace', serverLabel),
					detail: localize('allowServerWorkspacePostTooltip', 'Allow results from all tools from this server to be sent without confirmation in this workspace.'),
					select: async () => {
						this._postExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'workspace');
						return true;
					}
				},
				{
					label: localize('allowServerGloballyPost', 'Always Allow Tools from {0} Without Review', serverLabel),
					detail: localize('allowServerGloballyPostTooltip', 'Always allow results from all tools from this server to be sent without confirmation.'),
					select: async () => {
						this._postExecutionServerConfirmStore.setAutoConfirmation(definitionId, 'profile');
						return true;
					}
				}
			);
		}

		return actions;
	}

	registerConfirmationContribution(toolName: string, contribution: ILanguageModelToolConfirmationContribution): IDisposable {
		this._contributions.set(toolName, contribution);
		return {
			dispose: () => {
				this._contributions.delete(toolName);
			}
		};
	}

	manageConfirmationPreferences(tools: readonly IToolData[], options?: { defaultScope?: 'workspace' | 'profile' | 'session' }): void {
		interface IToolTreeItem extends IQuickTreeItem {
			type: 'tool' | 'server' | 'tool-pre' | 'tool-post' | 'server-pre' | 'server-post' | 'manage';
			toolId?: string;
			serverId?: string;
			scope?: 'workspace' | 'profile';
		}

		// Helper to track tools under servers
		const trackServerTool = (serverId: string, label: string, toolId: string, serversWithTools: Map<string, { label: string; tools: Set<string> }>) => {
			if (!serversWithTools.has(serverId)) {
				serversWithTools.set(serverId, { label, tools: new Set() });
			}
			serversWithTools.get(serverId)!.tools.add(toolId);
		};

		// Helper to add server tool from source
		const addServerToolFromSource = (source: ToolDataSource, toolId: string, serversWithTools: Map<string, { label: string; tools: Set<string> }>) => {
			if (source.type === 'mcp') {
				trackServerTool(source.definitionId, source.serverLabel || source.label, toolId, serversWithTools);
			} else if (source.type === 'extension') {
				trackServerTool(source.extensionId.value, source.label, toolId, serversWithTools);
			}
		};

		// Determine which tools should be shown
		const relevantTools = new Set<string>();
		const serversWithTools = new Map<string, { label: string; tools: Set<string> }>();

		// Add tools that request approval
		for (const tool of tools) {
			if (tool.canRequestPreApproval || tool.canRequestPostApproval || this._contributions.has(tool.id)) {
				relevantTools.add(tool.id);
				addServerToolFromSource(tool.source, tool.id, serversWithTools);
			}
		}

		// Add tools that have stored approvals (but we can't display them without metadata)
		for (const id of this._preExecutionToolConfirmStore.getAllConfirmed()) {
			if (!relevantTools.has(id)) {
				// Only add if we have the tool data
				const tool = tools.find(t => t.id === id);
				if (tool) {
					relevantTools.add(id);
					addServerToolFromSource(tool.source, id, serversWithTools);
				}
			}
		}
		for (const id of this._postExecutionToolConfirmStore.getAllConfirmed()) {
			if (!relevantTools.has(id)) {
				// Only add if we have the tool data
				const tool = tools.find(t => t.id === id);
				if (tool) {
					relevantTools.add(id);
					addServerToolFromSource(tool.source, id, serversWithTools);
				}
			}
		}

		if (relevantTools.size === 0) {
			return; // Nothing to show
		}

		// Determine initial scope from options
		let currentScope = options?.defaultScope ?? 'workspace';

		// Helper function to build tree items based on current scope
		const buildTreeItems = (): IToolTreeItem[] => {
			const treeItems: IToolTreeItem[] = [];

			// Add server nodes
			for (const [serverId, serverInfo] of serversWithTools) {
				const serverChildren: IToolTreeItem[] = [];

				// Add server-level controls as first children
				const hasAnyPre = Array.from(serverInfo.tools).some(toolId => {
					const tool = tools.find(t => t.id === toolId);
					return tool?.canRequestPreApproval;
				});
				const hasAnyPost = Array.from(serverInfo.tools).some(toolId => {
					const tool = tools.find(t => t.id === toolId);
					return tool?.canRequestPostApproval;
				});

				const serverPreConfirmed = this._preExecutionServerConfirmStore.getAutoConfirmationIn(serverId, currentScope);
				const serverPostConfirmed = this._postExecutionServerConfirmStore.getAutoConfirmationIn(serverId, currentScope);

				// Add individual tools from this server as children
				for (const toolId of serverInfo.tools) {
					const tool = tools.find(t => t.id === toolId);
					if (!tool) {
						continue;
					}

					const toolChildren: IToolTreeItem[] = [];
					const hasPre = !serverPreConfirmed && (tool.canRequestPreApproval || this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope));
					const hasPost = !serverPostConfirmed && (tool.canRequestPostApproval || this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope));

					// Add child items for granular control when both approval types exist
					if (hasPre && hasPost) {
						toolChildren.push({
							type: 'tool-pre',
							toolId: tool.id,
							label: RUN_WITHOUT_APPROVAL,
							checked: this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope)
						});
						toolChildren.push({
							type: 'tool-post',
							toolId: tool.id,
							label: CONTINUE_WITHOUT_REVIEWING_RESULTS,
							checked: this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope)
						});
					}

					// Tool item always has a checkbox
					const preApproval = this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);
					const postApproval = this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);
					let checked: boolean | 'mixed';
					let description: string | undefined;

					if (hasPre && hasPost) {
						// Both: checkbox is mixed if only one is enabled
						checked = preApproval && postApproval ? true : (!preApproval && !postApproval ? false : 'mixed');
					} else if (hasPre) {
						checked = preApproval;
						description = RUN_WITHOUT_APPROVAL;
					} else if (hasPost) {
						checked = postApproval;
						description = CONTINUE_WITHOUT_REVIEWING_RESULTS;
					} else {
						continue;
					}

					serverChildren.push({
						type: 'tool',
						toolId: tool.id,
						label: tool.displayName || tool.id,
						description,
						checked,
						collapsed: true,
						children: toolChildren.length > 0 ? toolChildren : undefined
					});
				}

				serverChildren.sort((a, b) => a.label.localeCompare(b.label));

				if (hasAnyPost) {
					serverChildren.unshift({
						type: 'server-post',
						serverId,
						iconClass: ThemeIcon.asClassName(Codicon.play),
						label: localize('continueWithoutReviewing', "Continue without reviewing any tool results"),
						checked: serverPostConfirmed
					});
				}
				if (hasAnyPre) {
					serverChildren.unshift({
						type: 'server-pre',
						serverId,
						iconClass: ThemeIcon.asClassName(Codicon.play),
						label: localize('runToolsWithoutApproval', "Run any tool without approval"),
						checked: serverPreConfirmed
					});
				}

				// Server node has checkbox to control both pre and post
				const serverHasPre = this._preExecutionServerConfirmStore.getAutoConfirmationIn(serverId, currentScope);
				const serverHasPost = this._postExecutionServerConfirmStore.getAutoConfirmationIn(serverId, currentScope);
				let serverChecked: boolean | 'mixed';
				if (hasAnyPre && hasAnyPost) {
					serverChecked = serverHasPre && serverHasPost ? true : (!serverHasPre && !serverHasPost ? false : 'mixed');
				} else if (hasAnyPre) {
					serverChecked = serverHasPre;
				} else if (hasAnyPost) {
					serverChecked = serverHasPost;
				} else {
					serverChecked = false;
				}

				const existingItem = quickTree.itemTree.find(i => i.serverId === serverId);
				treeItems.push({
					type: 'server',
					serverId,
					label: serverInfo.label,
					checked: serverChecked,
					children: serverChildren,
					collapsed: existingItem ? quickTree.isCollapsed(existingItem) : true,
					pickable: false
				});
			}

			// Add individual tool nodes (only for non-MCP/extension tools)
			const sortedTools = tools.slice().sort((a, b) => a.displayName.localeCompare(b.displayName));
			for (const tool of sortedTools) {
				if (!relevantTools.has(tool.id)) {
					continue;
				}

				// Skip tools that belong to MCP/extension servers (they're shown under server nodes)
				if (tool.source.type === 'mcp' || tool.source.type === 'extension') {
					continue;
				}

				const contributed = this._contributions.get(tool.id);
				const toolChildren: IToolTreeItem[] = [];

				const manageActions = contributed?.getManageActions?.();
				if (manageActions) {
					toolChildren.push(...manageActions.map(action => ({
						type: 'manage' as const,
						...action,
					})));
				}


				let checked: boolean | 'mixed' = false;
				let description: string | undefined;
				let pickable = false;

				if (contributed?.canUseDefaultApprovals !== false) {
					pickable = true;
					const hasPre = tool.canRequestPreApproval || this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);
					const hasPost = tool.canRequestPostApproval || this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);

					// Add child items for granular control when both approval types exist
					if (hasPre && hasPost) {
						toolChildren.push({
							type: 'tool-pre',
							toolId: tool.id,
							label: RUN_WITHOUT_APPROVAL,
							checked: this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope)
						});
						toolChildren.push({
							type: 'tool-post',
							toolId: tool.id,
							label: CONTINUE_WITHOUT_REVIEWING_RESULTS,
							checked: this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope)
						});
					}

					// Tool item always has a checkbox
					const preApproval = this._preExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);
					const postApproval = this._postExecutionToolConfirmStore.getAutoConfirmationIn(tool.id, currentScope);

					if (hasPre && hasPost) {
						// Both: checkbox is mixed if only one is enabled
						checked = preApproval && postApproval ? true : (!preApproval && !postApproval ? false : 'mixed');
					} else if (hasPre) {
						checked = preApproval;
						description = RUN_WITHOUT_APPROVAL;
					} else if (hasPost) {
						checked = postApproval;
						description = CONTINUE_WITHOUT_REVIEWING_RESULTS;
					} else {
						// No approval capabilities - shouldn't happen but handle it
						checked = false;
					}
				}

				treeItems.push({
					type: 'tool',
					toolId: tool.id,
					label: tool.displayName || tool.id,
					description,
					checked,
					pickable,
					collapsed: true,
					children: toolChildren.length > 0 ? toolChildren : undefined
				});
			}

			return treeItems;
		};

		const disposables = new DisposableStore();
		const quickTree = disposables.add(this._quickInputService.createQuickTree<IToolTreeItem>());
		quickTree.ignoreFocusOut = true;
		quickTree.sortByLabel = false;

		// Only show toggle if not in session scope
		if (currentScope !== 'session') {
			const scopeToggle = disposables.add(new Toggle({
				title: localize('workspaceScope', "Configure for this workspace only"),
				icon: Codicon.folder,
				isChecked: currentScope === 'workspace',
				inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
				inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
				inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground)
			}));
			quickTree.toggles = [scopeToggle];
			disposables.add(scopeToggle.onChange(() => {
				currentScope = currentScope === 'workspace' ? 'profile' : 'workspace';
				updatePlaceholder();
				quickTree.setItemTree(buildTreeItems());
			}));
		}

		const updatePlaceholder = () => {
			if (currentScope === 'session') {
				quickTree.placeholder = localize('configureSessionToolApprovals', "Configure session tool approvals");
			} else {
				quickTree.placeholder = currentScope === 'workspace'
					? localize('configureWorkspaceToolApprovals', "Configure workspace tool approvals")
					: localize('configureGlobalToolApprovals', "Configure global tool approvals");
			}
		};
		updatePlaceholder();

		quickTree.setItemTree(buildTreeItems());

		disposables.add(quickTree.onDidChangeCheckboxState(item => {
			const newState = item.checked ? currentScope : 'never';

			if (item.type === 'server' && item.serverId) {
				// Server-level checkbox: update both pre and post based on server capabilities
				const serverInfo = serversWithTools.get(item.serverId);
				if (serverInfo) {
					this._preExecutionServerConfirmStore.setAutoConfirmation(item.serverId, newState);
					this._postExecutionServerConfirmStore.setAutoConfirmation(item.serverId, newState);
				}
			} else if (item.type === 'tool' && item.toolId) {
				const tool = tools.find(t => t.id === item.toolId);
				if (tool?.canRequestPostApproval || newState === 'never') {
					this._postExecutionToolConfirmStore.setAutoConfirmation(item.toolId, newState);
				}
				if (tool?.canRequestPreApproval || newState === 'never') {
					this._preExecutionToolConfirmStore.setAutoConfirmation(item.toolId, newState);
				}
			} else if (item.type === 'tool-pre' && item.toolId) {
				this._preExecutionToolConfirmStore.setAutoConfirmation(item.toolId, newState);
			} else if (item.type === 'tool-post' && item.toolId) {
				this._postExecutionToolConfirmStore.setAutoConfirmation(item.toolId, newState);
			} else if (item.type === 'server-pre' && item.serverId) {
				this._preExecutionServerConfirmStore.setAutoConfirmation(item.serverId, newState);
				quickTree.setItemTree(buildTreeItems());
			} else if (item.type === 'server-post' && item.serverId) {
				this._postExecutionServerConfirmStore.setAutoConfirmation(item.serverId, newState);
				quickTree.setItemTree(buildTreeItems());
			} else if (item.type === 'manage') {
				(item as ILanguageModelToolConfirmationContributionQuickTreeItem).onDidChangeChecked?.(!!item.checked);
			}
		}));

		disposables.add(quickTree.onDidTriggerItemButton(i => {
			if (i.item.type === 'manage') {
				(i.item as ILanguageModelToolConfirmationContributionQuickTreeItem).onDidTriggerItemButton?.(i.button);
			}
		}));

		disposables.add(quickTree.onDidAccept(() => {
			for (const item of quickTree.activeItems) {
				if (item.type === 'manage') {
					(item as ILanguageModelToolConfirmationContributionQuickTreeItem).onDidOpen?.();
				}
			}
			quickTree.hide();
		}));

		disposables.add(quickTree.onDidHide(() => {
			disposables.dispose();
		}));

		quickTree.show();
	}

	public resetToolAutoConfirmation(): void {
		this._preExecutionToolConfirmStore.reset();
		this._postExecutionToolConfirmStore.reset();
		this._preExecutionServerConfirmStore.reset();
		this._postExecutionServerConfirmStore.reset();

		// Reset all contributions
		for (const contribution of this._contributions.values()) {
			contribution.reset?.();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/languageModelToolsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/languageModelToolsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { assertNever } from '../../../../base/common/assert.js';
import { RunOnceScheduler, timeout } from '../../../../base/common/async.js';
import { encodeBase64 } from '../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { arrayEqualsC } from '../../../../base/common/equals.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { CancellationError, isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMarkdownCommandLink, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { combinedDisposable, Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { derived, IObservable, IReader, observableFromEventOpts, ObservableSet } from '../../../../base/common/observable.js';
import Severity from '../../../../base/common/severity.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize, localize2 } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import * as JSONContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IVariableReference } from '../common/chatModes.js';
import { ChatToolInvocation } from '../common/chatProgressTypes/chatToolInvocation.js';
import { ConfirmedReason, IChatService, IChatToolInvocation, ToolConfirmKind } from '../common/chatService.js';
import { ChatRequestToolReferenceEntry, toToolSetVariableEntry, toToolVariableEntry } from '../common/chatVariableEntries.js';
import { ChatConfiguration } from '../common/constants.js';
import { ILanguageModelToolsConfirmationService } from '../common/languageModelToolsConfirmationService.js';
import { CountTokensCallback, createToolSchemaUri, ILanguageModelToolsService, IPreparedToolInvocation, IToolAndToolSetEnablementMap, IToolData, IToolImpl, IToolInvocation, IToolResult, IToolResultInputOutputDetails, SpecedToolAliases, stringifyPromptTsxPart, ToolDataSource, ToolSet, VSCodeToolReference } from '../common/languageModelToolsService.js';
import { getToolConfirmationAlert } from './chatAccessibilityProvider.js';

const jsonSchemaRegistry = Registry.as<JSONContributionRegistry.IJSONContributionRegistry>(JSONContributionRegistry.Extensions.JSONContribution);

interface IToolEntry {
	data: IToolData;
	impl?: IToolImpl;
}

interface ITrackedCall {
	invocation?: ChatToolInvocation;
	store: IDisposable;
}

const enum AutoApproveStorageKeys {
	GlobalAutoApproveOptIn = 'chat.tools.global.autoApprove.optIn'
}

const SkipAutoApproveConfirmationKey = 'vscode.chat.tools.global.autoApprove.testMode';

export const globalAutoApproveDescription = localize2(
	{
		key: 'autoApprove2.markdown',
		comment: [
			'{Locked=\'](https://github.com/features/codespaces)\'}',
			'{Locked=\'](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)\'}',
			'{Locked=\'](https://code.visualstudio.com/docs/copilot/security)\'}',
			'{Locked=\'**\'}',
		]
	},
	'Global auto approve also known as "YOLO mode" disables manual approval completely for _all tools in all workspaces_, allowing the agent to act fully autonomously. This is extremely dangerous and is *never* recommended, even containerized environments like [Codespaces](https://github.com/features/codespaces) and [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) have user keys forwarded into the container that could be compromised.\n\n**This feature disables [critical security protections](https://code.visualstudio.com/docs/copilot/security) and makes it much easier for an attacker to compromise the machine.**'
);

export class LanguageModelToolsService extends Disposable implements ILanguageModelToolsService {
	_serviceBrand: undefined;
	readonly vscodeToolSet: ToolSet;
	readonly executeToolSet: ToolSet;
	readonly readToolSet: ToolSet;

	private readonly _onDidChangeTools = this._register(new Emitter<void>());
	readonly onDidChangeTools = this._onDidChangeTools.event;
	private readonly _onDidPrepareToolCallBecomeUnresponsive = this._register(new Emitter<{ sessionId: string; toolData: IToolData }>());
	readonly onDidPrepareToolCallBecomeUnresponsive = this._onDidPrepareToolCallBecomeUnresponsive.event;

	/** Throttle tools updates because it sends all tools and runs on context key updates */
	private readonly _onDidChangeToolsScheduler = new RunOnceScheduler(() => this._onDidChangeTools.fire(), 750);
	private readonly _tools = new Map<string, IToolEntry>();
	private readonly _toolContextKeys = new Set<string>();
	private readonly _ctxToolsCount: IContextKey<number>;

	private readonly _callsByRequestId = new Map<string, ITrackedCall[]>();

	private readonly _isAgentModeEnabled: IObservable<boolean>;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IChatService private readonly _chatService: IChatService,
		@IDialogService private readonly _dialogService: IDialogService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IStorageService private readonly _storageService: IStorageService,
		@ILanguageModelToolsConfirmationService private readonly _confirmationService: ILanguageModelToolsConfirmationService,
	) {
		super();

		this._isAgentModeEnabled = observableConfigValue(ChatConfiguration.AgentEnabled, true, this._configurationService);

		this._register(this._contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(this._toolContextKeys)) {
				// Not worth it to compute a delta here unless we have many tools changing often
				this._onDidChangeToolsScheduler.schedule();
			}
		}));

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ChatConfiguration.ExtensionToolsEnabled) || e.affectsConfiguration(ChatConfiguration.AgentEnabled)) {
				this._onDidChangeToolsScheduler.schedule();
			}
		}));

		// Clear out warning accepted state if the setting is disabled
		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(ChatConfiguration.GlobalAutoApprove)) {
				if (this._configurationService.getValue(ChatConfiguration.GlobalAutoApprove) !== true) {
					this._storageService.remove(AutoApproveStorageKeys.GlobalAutoApproveOptIn, StorageScope.APPLICATION);
				}
			}
		}));

		this._ctxToolsCount = ChatContextKeys.Tools.toolsCount.bindTo(_contextKeyService);

		// Create the internal VS Code tool set
		this.vscodeToolSet = this._register(this.createToolSet(
			ToolDataSource.Internal,
			'vscode',
			VSCodeToolReference.vscode,
			{
				icon: ThemeIcon.fromId(Codicon.vscode.id),
				description: localize('copilot.toolSet.vscode.description', 'Use VS Code features'),
			}
		));

		// Create the internal Execute tool set
		this.executeToolSet = this._register(this.createToolSet(
			ToolDataSource.Internal,
			'execute',
			SpecedToolAliases.execute,
			{
				icon: ThemeIcon.fromId(Codicon.terminal.id),
				description: localize('copilot.toolSet.execute.description', 'Execute code and applications on your machine'),
			}
		));

		// Create the internal Read tool set
		this.readToolSet = this._register(this.createToolSet(
			ToolDataSource.Internal,
			'read',
			SpecedToolAliases.read,
			{
				icon: ThemeIcon.fromId(Codicon.eye.id),
				description: localize('copilot.toolSet.read.description', 'Read files in your workspace'),
			}
		));
	}

	/**
	 * Returns if the given tool or toolset is permitted in the current context.
	 * When agent mode is enabled, all tools are permitted (no restriction)
	 * When agent mode is disabled only a subset of read-only tools are permitted in agentic-loop contexts.
	 */
	private isPermitted(toolOrToolSet: IToolData | ToolSet, reader?: IReader): boolean {
		const agentModeEnabled = this._isAgentModeEnabled.read(reader);
		if (agentModeEnabled !== false) {
			return true;
		}
		const permittedInternalToolSetIds = [SpecedToolAliases.read, SpecedToolAliases.search, SpecedToolAliases.web];
		if (toolOrToolSet instanceof ToolSet) {
			const permitted = toolOrToolSet.source.type === 'internal' && permittedInternalToolSetIds.includes(toolOrToolSet.referenceName);
			this._logService.trace(`LanguageModelToolsService#isPermitted: ToolSet ${toolOrToolSet.id} (${toolOrToolSet.referenceName}) permitted=${permitted}`);
			return permitted;
		}
		this._logService.trace(`LanguageModelToolsService#isPermitted: Tool ${toolOrToolSet.id} (${toolOrToolSet.toolReferenceName}) permitted=false`);
		return false;
	}

	override dispose(): void {
		super.dispose();

		this._callsByRequestId.forEach(calls => calls.forEach(call => call.store.dispose()));
		this._ctxToolsCount.reset();
	}

	registerToolData(toolData: IToolData): IDisposable {
		if (this._tools.has(toolData.id)) {
			throw new Error(`Tool "${toolData.id}" is already registered.`);
		}

		this._tools.set(toolData.id, { data: toolData });
		this._ctxToolsCount.set(this._tools.size);
		this._onDidChangeToolsScheduler.schedule();

		toolData.when?.keys().forEach(key => this._toolContextKeys.add(key));

		let store: DisposableStore | undefined;
		if (toolData.inputSchema) {
			store = new DisposableStore();
			const schemaUrl = createToolSchemaUri(toolData.id).toString();
			jsonSchemaRegistry.registerSchema(schemaUrl, toolData.inputSchema, store);
			store.add(jsonSchemaRegistry.registerSchemaAssociation(schemaUrl, `/lm/tool/${toolData.id}/tool_input.json`));
		}

		return toDisposable(() => {
			store?.dispose();
			this._tools.delete(toolData.id);
			this._ctxToolsCount.set(this._tools.size);
			this._refreshAllToolContextKeys();
			this._onDidChangeToolsScheduler.schedule();
		});
	}

	flushToolUpdates(): void {
		this._onDidChangeToolsScheduler.flush();
	}

	private _refreshAllToolContextKeys() {
		this._toolContextKeys.clear();
		for (const tool of this._tools.values()) {
			tool.data.when?.keys().forEach(key => this._toolContextKeys.add(key));
		}
	}

	registerToolImplementation(id: string, tool: IToolImpl): IDisposable {
		const entry = this._tools.get(id);
		if (!entry) {
			throw new Error(`Tool "${id}" was not contributed.`);
		}

		if (entry.impl) {
			throw new Error(`Tool "${id}" already has an implementation.`);
		}

		entry.impl = tool;
		return toDisposable(() => {
			entry.impl = undefined;
		});
	}

	registerTool(toolData: IToolData, tool: IToolImpl): IDisposable {
		return combinedDisposable(
			this.registerToolData(toolData),
			this.registerToolImplementation(toolData.id, tool)
		);
	}

	getTools(includeDisabled?: boolean): Iterable<IToolData> {
		const toolDatas = Iterable.map(this._tools.values(), i => i.data);
		const extensionToolsEnabled = this._configurationService.getValue<boolean>(ChatConfiguration.ExtensionToolsEnabled);
		return Iterable.filter(
			toolDatas,
			toolData => {
				const satisfiesWhenClause = includeDisabled || !toolData.when || this._contextKeyService.contextMatchesRules(toolData.when);
				const satisfiesExternalToolCheck = toolData.source.type !== 'extension' || !!extensionToolsEnabled;
				const satisfiesPermittedCheck = includeDisabled || this.isPermitted(toolData);
				return satisfiesWhenClause && satisfiesExternalToolCheck && satisfiesPermittedCheck;
			});
	}

	readonly toolsObservable = observableFromEventOpts<readonly IToolData[], void>({ equalsFn: arrayEqualsC() }, this.onDidChangeTools, () => Array.from(this.getTools()));

	getTool(id: string): IToolData | undefined {
		return this._getToolEntry(id)?.data;
	}

	private _getToolEntry(id: string): IToolEntry | undefined {
		const entry = this._tools.get(id);
		if (entry && (!entry.data.when || this._contextKeyService.contextMatchesRules(entry.data.when))) {
			return entry;
		} else {
			return undefined;
		}
	}

	getToolByName(name: string, includeDisabled?: boolean): IToolData | undefined {
		for (const tool of this.getTools(!!includeDisabled)) {
			if (tool.toolReferenceName === name) {
				return tool;
			}
		}
		return undefined;
	}

	async invokeTool(dto: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult> {
		this._logService.trace(`[LanguageModelToolsService#invokeTool] Invoking tool ${dto.toolId} with parameters ${JSON.stringify(dto.parameters)}`);

		// When invoking a tool, don't validate the "when" clause. An extension may have invoked a tool just as it was becoming disabled, and just let it go through rather than throw and break the chat.
		let tool = this._tools.get(dto.toolId);
		if (!tool) {
			throw new Error(`Tool ${dto.toolId} was not contributed`);
		}

		if (!tool.impl) {
			await this._extensionService.activateByEvent(`onLanguageModelTool:${dto.toolId}`);

			// Extension should activate and register the tool implementation
			tool = this._tools.get(dto.toolId);
			if (!tool?.impl) {
				throw new Error(`Tool ${dto.toolId} does not have an implementation registered.`);
			}
		}

		// Shortcut to write to the model directly here, but could call all the way back to use the real stream.
		let toolInvocation: ChatToolInvocation | undefined;

		let requestId: string | undefined;
		let store: DisposableStore | undefined;
		let toolResult: IToolResult | undefined;
		let prepareTimeWatch: StopWatch | undefined;
		let invocationTimeWatch: StopWatch | undefined;
		let preparedInvocation: IPreparedToolInvocation | undefined;
		try {
			if (dto.context) {
				store = new DisposableStore();
				const model = this._chatService.getSession(dto.context.sessionResource);
				if (!model) {
					throw new Error(`Tool called for unknown chat session`);
				}

				const request = model.getRequests().at(-1)!;
				requestId = request.id;
				dto.modelId = request.modelId;
				dto.userSelectedTools = request.userSelectedTools && { ...request.userSelectedTools };

				// Replace the token with a new token that we can cancel when cancelToolCallsForRequest is called
				if (!this._callsByRequestId.has(requestId)) {
					this._callsByRequestId.set(requestId, []);
				}
				const trackedCall: ITrackedCall = { store };
				this._callsByRequestId.get(requestId)!.push(trackedCall);

				const source = new CancellationTokenSource();
				store.add(toDisposable(() => {
					source.dispose(true);
				}));
				store.add(token.onCancellationRequested(() => {
					IChatToolInvocation.confirmWith(toolInvocation, { type: ToolConfirmKind.Denied });
					source.cancel();
				}));
				store.add(source.token.onCancellationRequested(() => {
					IChatToolInvocation.confirmWith(toolInvocation, { type: ToolConfirmKind.Denied });
				}));
				token = source.token;

				prepareTimeWatch = StopWatch.create(true);
				preparedInvocation = await this.prepareToolInvocation(tool, dto, token);
				prepareTimeWatch.stop();

				toolInvocation = new ChatToolInvocation(preparedInvocation, tool.data, dto.callId, dto.fromSubAgent, dto.parameters);
				trackedCall.invocation = toolInvocation;
				const autoConfirmed = await this.shouldAutoConfirm(tool.data.id, tool.data.runsInWorkspace, tool.data.source, dto.parameters);
				if (autoConfirmed) {
					IChatToolInvocation.confirmWith(toolInvocation, autoConfirmed);
				}

				this._chatService.appendProgress(request, toolInvocation);

				dto.toolSpecificData = toolInvocation?.toolSpecificData;
				if (preparedInvocation?.confirmationMessages?.title) {
					if (!IChatToolInvocation.executionConfirmedOrDenied(toolInvocation) && !autoConfirmed) {
						this.playAccessibilitySignal([toolInvocation]);
					}
					const userConfirmed = await IChatToolInvocation.awaitConfirmation(toolInvocation, token);
					if (userConfirmed.type === ToolConfirmKind.Denied) {
						throw new CancellationError();
					}
					if (userConfirmed.type === ToolConfirmKind.Skipped) {
						toolResult = {
							content: [{
								kind: 'text',
								value: 'The user chose to skip the tool call, they want to proceed without running it'
							}]
						};
						return toolResult;
					}

					if (dto.toolSpecificData?.kind === 'input') {
						dto.parameters = dto.toolSpecificData.rawInput;
						dto.toolSpecificData = undefined;
					}
				}
			} else {
				prepareTimeWatch = StopWatch.create(true);
				preparedInvocation = await this.prepareToolInvocation(tool, dto, token);
				prepareTimeWatch.stop();
				if (preparedInvocation?.confirmationMessages?.title && !(await this.shouldAutoConfirm(tool.data.id, tool.data.runsInWorkspace, tool.data.source, dto.parameters))) {
					const result = await this._dialogService.confirm({ message: renderAsPlaintext(preparedInvocation.confirmationMessages.title), detail: renderAsPlaintext(preparedInvocation.confirmationMessages.message!) });
					if (!result.confirmed) {
						throw new CancellationError();
					}
				}
				dto.toolSpecificData = preparedInvocation?.toolSpecificData;
			}

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			invocationTimeWatch = StopWatch.create(true);
			toolResult = await tool.impl.invoke(dto, countTokens, {
				report: step => {
					toolInvocation?.acceptProgress(step);
				}
			}, token);
			invocationTimeWatch.stop();
			this.ensureToolDetails(dto, toolResult, tool.data);

			if (toolInvocation?.didExecuteTool(toolResult).type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
				const autoConfirmedPost = await this.shouldAutoConfirmPostExecution(tool.data.id, tool.data.runsInWorkspace, tool.data.source, dto.parameters);
				if (autoConfirmedPost) {
					IChatToolInvocation.confirmWith(toolInvocation, autoConfirmedPost);
				}

				const postConfirm = await IChatToolInvocation.awaitPostConfirmation(toolInvocation, token);
				if (postConfirm.type === ToolConfirmKind.Denied) {
					throw new CancellationError();
				}
				if (postConfirm.type === ToolConfirmKind.Skipped) {
					toolResult = {
						content: [{
							kind: 'text',
							value: 'The tool executed but the user chose not to share the results'
						}]
					};
				}
			}

			this._telemetryService.publicLog2<LanguageModelToolInvokedEvent, LanguageModelToolInvokedClassification>(
				'languageModelToolInvoked',
				{
					result: 'success',
					chatSessionId: dto.context?.sessionId,
					toolId: tool.data.id,
					toolExtensionId: tool.data.source.type === 'extension' ? tool.data.source.extensionId.value : undefined,
					toolSourceKind: tool.data.source.type,
					prepareTimeMs: prepareTimeWatch?.elapsed(),
					invocationTimeMs: invocationTimeWatch?.elapsed(),
				});
			return toolResult;
		} catch (err) {
			const result = isCancellationError(err) ? 'userCancelled' : 'error';
			this._telemetryService.publicLog2<LanguageModelToolInvokedEvent, LanguageModelToolInvokedClassification>(
				'languageModelToolInvoked',
				{
					result,
					chatSessionId: dto.context?.sessionId,
					toolId: tool.data.id,
					toolExtensionId: tool.data.source.type === 'extension' ? tool.data.source.extensionId.value : undefined,
					toolSourceKind: tool.data.source.type,
					prepareTimeMs: prepareTimeWatch?.elapsed(),
					invocationTimeMs: invocationTimeWatch?.elapsed(),
				});
			this._logService.error(`[LanguageModelToolsService#invokeTool] Error from tool ${dto.toolId} with parameters ${JSON.stringify(dto.parameters)}:\n${toErrorMessage(err, true)}`);

			toolResult ??= { content: [] };
			toolResult.toolResultError = err instanceof Error ? err.message : String(err);
			if (tool.data.alwaysDisplayInputOutput) {
				toolResult.toolResultDetails = { input: this.formatToolInput(dto), output: [{ type: 'embed', isText: true, value: String(err) }], isError: true };
			}

			throw err;
		} finally {
			toolInvocation?.didExecuteTool(toolResult, true);
			if (store) {
				this.cleanupCallDisposables(requestId, store);
			}
		}
	}

	private async prepareToolInvocation(tool: IToolEntry, dto: IToolInvocation, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		let prepared: IPreparedToolInvocation | undefined;
		if (tool.impl!.prepareToolInvocation) {
			const preparePromise = tool.impl!.prepareToolInvocation({
				parameters: dto.parameters,
				chatRequestId: dto.chatRequestId,
				chatSessionId: dto.context?.sessionId,
				chatInteractionId: dto.chatInteractionId
			}, token);

			const raceResult = await Promise.race([
				timeout(3000, token).then(() => 'timeout'),
				preparePromise
			]);
			if (raceResult === 'timeout') {
				this._onDidPrepareToolCallBecomeUnresponsive.fire({
					sessionId: dto.context?.sessionId ?? '',
					toolData: tool.data
				});
			}

			prepared = await preparePromise;
		}

		const isEligibleForAutoApproval = this.isToolEligibleForAutoApproval(tool.data);

		// Default confirmation messages if tool is not eligible for auto-approval
		if (!isEligibleForAutoApproval && !prepared?.confirmationMessages?.title) {
			if (!prepared) {
				prepared = {};
			}
			const fullReferenceName = getToolFullReferenceName(tool.data);

			// TODO: This should be more detailed per tool.
			prepared.confirmationMessages = {
				...prepared.confirmationMessages,
				title: localize('defaultToolConfirmation.title', 'Confirm tool execution'),
				message: localize('defaultToolConfirmation.message', 'Run the \'{0}\' tool?', fullReferenceName),
				disclaimer: new MarkdownString(localize('defaultToolConfirmation.disclaimer', 'Auto approval for \'{0}\' is restricted via {1}.', getToolFullReferenceName(tool.data), createMarkdownCommandLink({ title: '`' + ChatConfiguration.EligibleForAutoApproval + '`', id: 'workbench.action.openSettings', arguments: [ChatConfiguration.EligibleForAutoApproval] }, false)), { isTrusted: true }),
				allowAutoConfirm: false,
			};
		}

		if (!isEligibleForAutoApproval && prepared?.confirmationMessages?.title) {
			// Always overwrite the disclaimer if not eligible for auto-approval
			prepared.confirmationMessages.disclaimer = new MarkdownString(localize('defaultToolConfirmation.disclaimer', 'Auto approval for \'{0}\' is restricted via {1}.', getToolFullReferenceName(tool.data), createMarkdownCommandLink({ title: '`' + ChatConfiguration.EligibleForAutoApproval + '`', id: 'workbench.action.openSettings', arguments: [ChatConfiguration.EligibleForAutoApproval] }, false)), { isTrusted: true });
		}

		if (prepared?.confirmationMessages?.title) {
			if (prepared.toolSpecificData?.kind !== 'terminal' && prepared.confirmationMessages.allowAutoConfirm !== false) {
				prepared.confirmationMessages.allowAutoConfirm = isEligibleForAutoApproval;
			}

			if (!prepared.toolSpecificData && tool.data.alwaysDisplayInputOutput) {
				prepared.toolSpecificData = {
					kind: 'input',
					rawInput: dto.parameters,
				};
			}
		}

		return prepared;
	}

	private playAccessibilitySignal(toolInvocations: ChatToolInvocation[]): void {
		const autoApproved = this._configurationService.getValue(ChatConfiguration.GlobalAutoApprove);
		if (autoApproved) {
			return;
		}
		const setting: { sound?: 'auto' | 'on' | 'off'; announcement?: 'auto' | 'off' } | undefined = this._configurationService.getValue(AccessibilitySignal.chatUserActionRequired.settingsKey);
		if (!setting) {
			return;
		}
		const soundEnabled = setting.sound === 'on' || (setting.sound === 'auto' && (this._accessibilityService.isScreenReaderOptimized()));
		const announcementEnabled = this._accessibilityService.isScreenReaderOptimized() && setting.announcement === 'auto';
		if (soundEnabled || announcementEnabled) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.chatUserActionRequired, { customAlertMessage: this._instantiationService.invokeFunction(getToolConfirmationAlert, toolInvocations), userGesture: true, modality: !soundEnabled ? 'announcement' : undefined });
		}
	}

	private ensureToolDetails(dto: IToolInvocation, toolResult: IToolResult, toolData: IToolData): void {
		if (!toolResult.toolResultDetails && toolData.alwaysDisplayInputOutput) {
			toolResult.toolResultDetails = {
				input: this.formatToolInput(dto),
				output: this.toolResultToIO(toolResult),
			};
		}
	}

	private formatToolInput(dto: IToolInvocation): string {
		return JSON.stringify(dto.parameters, undefined, 2);
	}

	private toolResultToIO(toolResult: IToolResult): IToolResultInputOutputDetails['output'] {
		return toolResult.content.map(part => {
			if (part.kind === 'text') {
				return { type: 'embed', isText: true, value: part.value };
			} else if (part.kind === 'promptTsx') {
				return { type: 'embed', isText: true, value: stringifyPromptTsxPart(part) };
			} else if (part.kind === 'data') {
				return { type: 'embed', value: encodeBase64(part.value.data), mimeType: part.value.mimeType };
			} else {
				assertNever(part);
			}
		});
	}

	private getEligibleForAutoApprovalSpecialCase(toolData: IToolData): string | undefined {
		if (toolData.id === 'vscode_fetchWebPage_internal') {
			return 'fetch';
		}
		return undefined;
	}

	private isToolEligibleForAutoApproval(toolData: IToolData): boolean {
		const fullReferenceName = this.getEligibleForAutoApprovalSpecialCase(toolData) ?? getToolFullReferenceName(toolData);
		if (toolData.id === 'copilot_fetchWebPage') {
			// Special case, this fetch will call an internal tool 'vscode_fetchWebPage_internal'
			return true;
		}
		const eligibilityConfig = this._configurationService.getValue<Record<string, boolean>>(ChatConfiguration.EligibleForAutoApproval);
		if (eligibilityConfig && typeof eligibilityConfig === 'object' && fullReferenceName) {
			// Direct match
			if (Object.prototype.hasOwnProperty.call(eligibilityConfig, fullReferenceName)) {
				return eligibilityConfig[fullReferenceName];
			}
			// Back compat with legacy names
			if (toolData.legacyToolReferenceFullNames) {
				for (const legacyName of toolData.legacyToolReferenceFullNames) {
					// Check if the full legacy name is in the config
					if (Object.prototype.hasOwnProperty.call(eligibilityConfig, legacyName)) {
						return eligibilityConfig[legacyName];
					}
					// Some tools may be both renamed and namespaced from a toolset, eg: xxx/yyy -> yyy
					if (legacyName.includes('/')) {
						const trimmedLegacyName = legacyName.split('/').pop();
						if (trimmedLegacyName && Object.prototype.hasOwnProperty.call(eligibilityConfig, trimmedLegacyName)) {
							return eligibilityConfig[trimmedLegacyName];
						}
					}
				}
			}
		}
		return true;
	}

	private async shouldAutoConfirm(toolId: string, runsInWorkspace: boolean | undefined, source: ToolDataSource, parameters: unknown): Promise<ConfirmedReason | undefined> {
		const tool = this._tools.get(toolId);
		if (!tool) {
			return undefined;
		}

		if (!this.isToolEligibleForAutoApproval(tool.data)) {
			return undefined;
		}

		const reason = this._confirmationService.getPreConfirmAction({ toolId, source, parameters });
		if (reason) {
			return reason;
		}

		const config = this._configurationService.inspect<boolean | Record<string, boolean>>(ChatConfiguration.GlobalAutoApprove);

		// If we know the tool runs at a global level, only consider the global config.
		// If we know the tool runs at a workspace level, use those specific settings when appropriate.
		let value = config.value ?? config.defaultValue;
		if (typeof runsInWorkspace === 'boolean') {
			value = config.userLocalValue ?? config.applicationValue;
			if (runsInWorkspace) {
				value = config.workspaceValue ?? config.workspaceFolderValue ?? config.userRemoteValue ?? value;
			}
		}

		const autoConfirm = value === true || (typeof value === 'object' && value.hasOwnProperty(toolId) && value[toolId] === true);
		if (autoConfirm) {
			if (await this._checkGlobalAutoApprove()) {
				return { type: ToolConfirmKind.Setting, id: ChatConfiguration.GlobalAutoApprove };
			}
		}

		return undefined;
	}

	private async shouldAutoConfirmPostExecution(toolId: string, runsInWorkspace: boolean | undefined, source: ToolDataSource, parameters: unknown): Promise<ConfirmedReason | undefined> {
		if (this._configurationService.getValue<boolean>(ChatConfiguration.GlobalAutoApprove) && await this._checkGlobalAutoApprove()) {
			return { type: ToolConfirmKind.Setting, id: ChatConfiguration.GlobalAutoApprove };
		}

		return this._confirmationService.getPostConfirmAction({ toolId, source, parameters });
	}

	private async _checkGlobalAutoApprove(): Promise<boolean> {
		const optedIn = this._storageService.getBoolean(AutoApproveStorageKeys.GlobalAutoApproveOptIn, StorageScope.APPLICATION, false);
		if (optedIn) {
			return true;
		}

		if (this._contextKeyService.getContextKeyValue(SkipAutoApproveConfirmationKey) === true) {
			return true;
		}

		const promptResult = await this._dialogService.prompt({
			type: Severity.Warning,
			message: localize('autoApprove2.title', 'Enable global auto approve?'),
			buttons: [
				{
					label: localize('autoApprove2.button.enable', 'Enable'),
					run: () => true
				},
				{
					label: localize('autoApprove2.button.disable', 'Disable'),
					run: () => false
				},
			],
			custom: {
				icon: Codicon.warning,
				disableCloseAction: true,
				markdownDetails: [{
					markdown: new MarkdownString(globalAutoApproveDescription.value),
				}],
			}
		});

		if (promptResult.result !== true) {
			await this._configurationService.updateValue(ChatConfiguration.GlobalAutoApprove, false);
			return false;
		}

		this._storageService.store(AutoApproveStorageKeys.GlobalAutoApproveOptIn, true, StorageScope.APPLICATION, StorageTarget.USER);
		return true;
	}

	private cleanupCallDisposables(requestId: string | undefined, store: DisposableStore): void {
		if (requestId) {
			const disposables = this._callsByRequestId.get(requestId);
			if (disposables) {
				const index = disposables.findIndex(d => d.store === store);
				if (index > -1) {
					disposables.splice(index, 1);
				}
				if (disposables.length === 0) {
					this._callsByRequestId.delete(requestId);
				}
			}
		}

		store.dispose();
	}

	cancelToolCallsForRequest(requestId: string): void {
		const calls = this._callsByRequestId.get(requestId);
		if (calls) {
			calls.forEach(call => call.store.dispose());
			this._callsByRequestId.delete(requestId);
		}
	}

	private static readonly githubMCPServerAliases = ['github/github-mcp-server', 'io.github.github/github-mcp-server', 'github-mcp-server'];
	private static readonly playwrightMCPServerAliases = ['microsoft/playwright-mcp', 'com.microsoft/playwright-mcp'];

	private * getToolSetAliases(toolSet: ToolSet, fullReferenceName: string): Iterable<string> {
		if (fullReferenceName !== toolSet.referenceName) {
			yield toolSet.referenceName; // tool set name without '/*'
		}
		if (toolSet.legacyFullNames) {
			yield* toolSet.legacyFullNames;
		}
		switch (toolSet.referenceName) {
			case 'github':
				for (const alias of LanguageModelToolsService.githubMCPServerAliases) {
					yield alias + '/*';
				}
				break;
			case 'playwright':
				for (const alias of LanguageModelToolsService.playwrightMCPServerAliases) {
					yield alias + '/*';
				}
				break;
			case SpecedToolAliases.execute: // 'execute'
				yield 'shell'; // legacy alias
				break;
			case SpecedToolAliases.agent: // 'agent'
				yield VSCodeToolReference.runSubagent; // prefer the tool set over th old tool name
				yield 'custom-agent'; // legacy alias
				break;
		}
	}

	private * getToolAliases(toolSet: IToolData, fullReferenceName: string): Iterable<string> {
		const referenceName = toolSet.toolReferenceName ?? toolSet.displayName;
		if (fullReferenceName !== referenceName && referenceName !== VSCodeToolReference.runSubagent) {
			yield referenceName; // simple name, without toolset name
		}
		if (toolSet.legacyToolReferenceFullNames) {
			for (const legacyName of toolSet.legacyToolReferenceFullNames) {
				yield legacyName;
				const lastSlashIndex = legacyName.lastIndexOf('/');
				if (lastSlashIndex !== -1) {
					yield legacyName.substring(lastSlashIndex + 1); // it was also known under the simple name
				}
			}
		}
		const slashIndex = fullReferenceName.lastIndexOf('/');
		if (slashIndex !== -1) {
			switch (fullReferenceName.substring(0, slashIndex)) {
				case 'github':
					for (const alias of LanguageModelToolsService.githubMCPServerAliases) {
						yield alias + fullReferenceName.substring(slashIndex);
					}
					break;
				case 'playwright':
					for (const alias of LanguageModelToolsService.playwrightMCPServerAliases) {
						yield alias + fullReferenceName.substring(slashIndex);
					}
					break;
			}
		}
	}

	/**
	 * Create a map that contains all tools and toolsets with their enablement state.
	 * @param fullReferenceNames A list of tool or toolset by their full reference names that are enabled.
	 * @returns A map of tool or toolset instances to their enablement state.
	 */
	toToolAndToolSetEnablementMap(fullReferenceNames: readonly string[], _target: string | undefined): IToolAndToolSetEnablementMap {
		const toolOrToolSetNames = new Set(fullReferenceNames);
		const result = new Map<ToolSet | IToolData, boolean>();
		for (const [tool, fullReferenceName] of this.toolsWithFullReferenceName.get()) {
			if (tool instanceof ToolSet) {
				const enabled = toolOrToolSetNames.has(fullReferenceName) || Iterable.some(this.getToolSetAliases(tool, fullReferenceName), name => toolOrToolSetNames.has(name));
				result.set(tool, enabled);
				if (enabled) {
					for (const memberTool of tool.getTools()) {
						result.set(memberTool, true);
					}
				}
			} else {
				if (!result.has(tool)) { // already set via an enabled toolset
					const enabled = toolOrToolSetNames.has(fullReferenceName)
						|| Iterable.some(this.getToolAliases(tool, fullReferenceName), name => toolOrToolSetNames.has(name))
						|| !!tool.legacyToolReferenceFullNames?.some(toolFullName => {
							// enable tool if just the legacy tool set name is present
							const index = toolFullName.lastIndexOf('/');
							return index !== -1 && toolOrToolSetNames.has(toolFullName.substring(0, index));
						});
					result.set(tool, enabled);
				}
			}
		}

		// also add all user tool sets (not part of the prompt referencable tools)
		for (const toolSet of this._toolSets) {
			if (toolSet.source.type === 'user') {
				const enabled = Iterable.every(toolSet.getTools(), t => result.get(t) === true);
				result.set(toolSet, enabled);
			}
		}
		return result;
	}

	toFullReferenceNames(map: IToolAndToolSetEnablementMap): string[] {
		const result: string[] = [];
		const toolsCoveredByEnabledToolSet = new Set<IToolData>();
		for (const [tool, fullReferenceName] of this.toolsWithFullReferenceName.get()) {
			if (tool instanceof ToolSet) {
				if (map.get(tool)) {
					result.push(fullReferenceName);
					for (const memberTool of tool.getTools()) {
						toolsCoveredByEnabledToolSet.add(memberTool);
					}
				}
			} else {
				if (map.get(tool) && !toolsCoveredByEnabledToolSet.has(tool)) {
					result.push(fullReferenceName);
				}
			}
		}
		return result;
	}

	toToolReferences(variableReferences: readonly IVariableReference[]): ChatRequestToolReferenceEntry[] {
		const toolsOrToolSetByName = new Map<string, ToolSet | IToolData>();
		for (const [tool, fullReferenceName] of this.toolsWithFullReferenceName.get()) {
			toolsOrToolSetByName.set(fullReferenceName, tool);
		}

		const result: ChatRequestToolReferenceEntry[] = [];
		for (const ref of variableReferences) {
			const toolOrToolSet = toolsOrToolSetByName.get(ref.name);
			if (toolOrToolSet) {
				if (toolOrToolSet instanceof ToolSet) {
					result.push(toToolSetVariableEntry(toolOrToolSet, ref.range));
				} else {
					result.push(toToolVariableEntry(toolOrToolSet, ref.range));
				}
			}
		}
		return result;
	}


	private readonly _toolSets = new ObservableSet<ToolSet>();

	readonly toolSets: IObservable<Iterable<ToolSet>> = derived(this, reader => {
		const allToolSets = Array.from(this._toolSets.observable.read(reader));
		return allToolSets.filter(toolSet => this.isPermitted(toolSet, reader));
	});

	getToolSet(id: string): ToolSet | undefined {
		for (const toolSet of this._toolSets) {
			if (toolSet.id === id) {
				return toolSet;
			}
		}
		return undefined;
	}

	getToolSetByName(name: string): ToolSet | undefined {
		for (const toolSet of this._toolSets) {
			if (toolSet.referenceName === name) {
				return toolSet;
			}
		}
		return undefined;
	}

	getSpecedToolSetName(referenceName: string): string {
		if (LanguageModelToolsService.githubMCPServerAliases.includes(referenceName)) {
			return 'github';
		}
		if (LanguageModelToolsService.playwrightMCPServerAliases.includes(referenceName)) {
			return 'playwright';
		}
		return referenceName;
	}

	createToolSet(source: ToolDataSource, id: string, referenceName: string, options?: { icon?: ThemeIcon; description?: string; legacyFullNames?: string[] }): ToolSet & IDisposable {

		const that = this;

		referenceName = this.getSpecedToolSetName(referenceName);

		const result = new class extends ToolSet implements IDisposable {
			dispose(): void {
				if (that._toolSets.has(result)) {
					this._tools.clear();
					that._toolSets.delete(result);
				}

			}
		}(id, referenceName, options?.icon ?? Codicon.tools, source, options?.description, options?.legacyFullNames);

		this._toolSets.add(result);
		return result;
	}

	readonly toolsWithFullReferenceName = derived<[IToolData | ToolSet, string][]>(reader => {
		const result: [IToolData | ToolSet, string][] = [];
		const coveredByToolSets = new Set<IToolData>();
		for (const toolSet of this.toolSets.read(reader)) {
			if (toolSet.source.type !== 'user') {
				result.push([toolSet, getToolSetFullReferenceName(toolSet)]);
				for (const tool of toolSet.getTools()) {
					result.push([tool, getToolFullReferenceName(tool, toolSet)]);
					coveredByToolSets.add(tool);
				}
			}
		}
		for (const tool of this.toolsObservable.read(reader)) {
			if (tool.canBeReferencedInPrompt && !coveredByToolSets.has(tool) && this.isPermitted(tool, reader)) {
				result.push([tool, getToolFullReferenceName(tool)]);
			}
		}
		return result;
	});

	* getFullReferenceNames(): Iterable<string> {
		for (const [, fullReferenceName] of this.toolsWithFullReferenceName.get()) {
			yield fullReferenceName;
		}
	}

	getDeprecatedFullReferenceNames(): Map<string, Set<string>> {
		const result = new Map<string, Set<string>>();
		const knownToolSetNames = new Set<string>();
		const add = (name: string, fullReferenceName: string) => {
			if (name !== fullReferenceName) {
				if (!result.has(name)) {
					result.set(name, new Set<string>());
				}
				result.get(name)!.add(fullReferenceName);
			}
		};

		for (const [tool, _] of this.toolsWithFullReferenceName.get()) {
			if (tool instanceof ToolSet) {
				knownToolSetNames.add(tool.referenceName);
				if (tool.legacyFullNames) {
					for (const legacyName of tool.legacyFullNames) {
						knownToolSetNames.add(legacyName);
					}
				}
			}
		}

		for (const [tool, fullReferenceName] of this.toolsWithFullReferenceName.get()) {
			if (tool instanceof ToolSet) {
				for (const alias of this.getToolSetAliases(tool, fullReferenceName)) {
					add(alias, fullReferenceName);
				}
			} else {
				for (const alias of this.getToolAliases(tool, fullReferenceName)) {
					add(alias, fullReferenceName);
				}
				if (tool.legacyToolReferenceFullNames) {
					for (const legacyName of tool.legacyToolReferenceFullNames) {
						// for any 'orphaned' toolsets (toolsets that no longer exist and
						// do not have an explicit legacy mapping), we should
						// just point them to the list of tools directly
						if (legacyName.includes('/')) {
							const toolSetFullName = legacyName.substring(0, legacyName.lastIndexOf('/'));
							if (!knownToolSetNames.has(toolSetFullName)) {
								add(toolSetFullName, fullReferenceName);
							}
						}
					}
				}
			}
		}
		return result;
	}

	getToolByFullReferenceName(fullReferenceName: string): IToolData | ToolSet | undefined {
		for (const [tool, toolFullReferenceName] of this.toolsWithFullReferenceName.get()) {
			if (fullReferenceName === toolFullReferenceName) {
				return tool;
			}
			const aliases = tool instanceof ToolSet ? this.getToolSetAliases(tool, toolFullReferenceName) : this.getToolAliases(tool, toolFullReferenceName);
			if (Iterable.some(aliases, alias => fullReferenceName === alias)) {
				return tool;
			}
		}
		return undefined;
	}

	getFullReferenceName(tool: IToolData | ToolSet, toolSet?: ToolSet): string {
		if (tool instanceof ToolSet) {
			return getToolSetFullReferenceName(tool);
		}
		return getToolFullReferenceName(tool, toolSet);
	}
}

function getToolFullReferenceName(tool: IToolData, toolSet?: ToolSet) {
	const toolName = tool.toolReferenceName ?? tool.displayName;
	if (toolSet) {
		return `${toolSet.referenceName}/${toolName}`;
	} else if (tool.source.type === 'extension') {
		return `${tool.source.extensionId.value.toLowerCase()}/${toolName}`;
	}
	return toolName;
}

function getToolSetFullReferenceName(toolSet: ToolSet) {
	if (toolSet.source.type === 'mcp') {
		return `${toolSet.referenceName}/*`;
	}
	return toolSet.referenceName;
}


type LanguageModelToolInvokedEvent = {
	result: 'success' | 'error' | 'userCancelled';
	chatSessionId: string | undefined;
	toolId: string;
	toolExtensionId: string | undefined;
	toolSourceKind: string;
	prepareTimeMs?: number;
	invocationTimeMs?: number;
};

type LanguageModelToolInvokedClassification = {
	result: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether invoking the LanguageModelTool resulted in an error.' };
	chatSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat session that the tool was used within, if applicable.' };
	toolId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the tool used.' };
	toolExtensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension that contributed the tool.' };
	toolSourceKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The source (mcp/extension/internal) of the tool.' };
	prepareTimeMs?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time spent in prepareToolInvocation method in milliseconds.' };
	invocationTimeMs?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time spent in tool invoke method in milliseconds.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of language model tools.';
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatAccessibilityActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatAccessibilityActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../../base/browser/ui/aria/aria.js';
import { localize } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { IChatWidgetService } from '../chat.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { isResponseVM } from '../../common/chatViewModel.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../platform/accessibility/common/accessibility.js';

export const ACTION_ID_FOCUS_CHAT_CONFIRMATION = 'workbench.action.chat.focusConfirmation';

class AnnounceChatConfirmationAction extends Action2 {
	constructor() {
		super({
			id: ACTION_ID_FOCUS_CHAT_CONFIRMATION,
			title: { value: localize('focusChatConfirmation', 'Focus Chat Confirmation'), original: 'Focus Chat Confirmation' },
			category: { value: localize('chat.category', 'Chat'), original: 'Chat' },
			precondition: ChatContextKeys.enabled,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyA | KeyMod.Shift,
				when: CONTEXT_ACCESSIBILITY_MODE_ENABLED
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const pendingWidget = chatWidgetService.getAllWidgets().find(widget => widget.viewModel?.model.requestNeedsInput.get());

		if (!pendingWidget) {
			alert(localize('noChatSession', 'No active chat session found.'));
			return;
		}

		const viewModel = pendingWidget.viewModel;
		if (!viewModel) {
			alert(localize('chatNotReady', 'Chat interface not ready.'));
			return;
		}

		// Check for active confirmations in the chat responses
		let firstConfirmationElement: HTMLElement | undefined;

		const lastResponse = viewModel.getItems()[viewModel.getItems().length - 1];
		if (isResponseVM(lastResponse)) {
			// eslint-disable-next-line no-restricted-syntax
			const confirmationWidgets = pendingWidget.domNode.querySelectorAll('.chat-confirmation-widget-container');
			if (confirmationWidgets.length > 0) {
				firstConfirmationElement = confirmationWidgets[0] as HTMLElement;
			}
		}

		if (firstConfirmationElement) {
			firstConfirmationElement.focus();
		} else {
			alert(localize('noConfirmationRequired', 'No chat confirmation required'));
		}
	}
}

export function registerChatAccessibilityActions(): void {
	registerAction2(AnnounceChatConfirmationAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { AccessibleDiffViewerNext } from '../../../../../editor/browser/widget/diffEditor/commands.js';
import { localize } from '../../../../../nls.js';
import { AccessibleContentProvider, AccessibleViewProviderId, AccessibleViewType } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { INLINE_CHAT_ID } from '../../../inlineChat/common/inlineChat.js';
import { TerminalContribCommandId } from '../../../terminal/terminalContribExports.js';
import { ChatContextKeyExprs, ChatContextKeys } from '../../common/chatContextKeys.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../../common/constants.js';
import { FocusAgentSessionsAction } from '../agentSessions/agentSessionsActions.js';
import { IChatWidgetService } from '../chat.js';
import { ChatEditingShowChangesAction, ViewPreviousEditsAction } from '../chatEditing/chatEditingActions.js';

export class PanelChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 107;
	readonly name = 'panelChat';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.and(ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat), ChatContextKeys.inQuickChat.negate(), ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Ask), ContextKeyExpr.or(ChatContextKeys.inChatSession, ChatContextKeys.isResponse, ChatContextKeys.isRequest));
	getProvider(accessor: ServicesAccessor) {
		return getChatAccessibilityHelpProvider(accessor, undefined, 'panelChat');
	}
}

export class QuickChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 107;
	readonly name = 'quickChat';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.and(ChatContextKeys.inQuickChat, ContextKeyExpr.or(ChatContextKeys.inChatSession, ChatContextKeys.isResponse, ChatContextKeys.isRequest));
	getProvider(accessor: ServicesAccessor) {
		return getChatAccessibilityHelpProvider(accessor, undefined, 'quickChat');
	}
}

export class EditsChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 119;
	readonly name = 'editsView';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.and(ChatContextKeyExprs.inEditingMode, ChatContextKeys.inChatInput);
	getProvider(accessor: ServicesAccessor) {
		return getChatAccessibilityHelpProvider(accessor, undefined, 'editsView');
	}
}

export class AgentChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 120;
	readonly name = 'agentView';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.and(ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Agent), ChatContextKeys.inChatInput);
	getProvider(accessor: ServicesAccessor) {
		return getChatAccessibilityHelpProvider(accessor, undefined, 'agentView');
	}
}

export function getAccessibilityHelpText(type: 'panelChat' | 'inlineChat' | 'agentView' | 'quickChat' | 'editsView' | 'agentView', keybindingService: IKeybindingService): string {
	const content = [];
	if (type === 'panelChat' || type === 'quickChat' || type === 'agentView') {
		if (type === 'quickChat') {
			content.push(localize('chat.overview', 'The quick chat view is comprised of an input box and a request/response list. The input box is used to make requests and the list is used to display responses.'));
			content.push(localize('chat.differenceQuick', 'The quick chat view is a transient interface for making and viewing requests, while the panel chat view is a persistent interface that also supports navigating suggested follow-up questions.'));
		} else {
			content.push(localize('chat.differencePanel', 'The chat view is a persistent interface that also supports navigating suggested follow-up questions, while the quick chat view is a transient interface for making and viewing requests.'));
			content.push(localize('workbench.action.chat.newChat', 'To create a new chat session, invoke the New Chat command{0}.', '<keybinding:workbench.action.chat.newChat>'));
			content.push(localize('workbench.action.chat.history', 'To view all chat sessions, invoke the Show Chats command{0}.', '<keybinding:workbench.action.chat.history>'));
			content.push(localize('workbench.action.chat.focusAgentSessionsViewer', 'You can focus the agent sessions list by invoking the Focus Agent Sessions command{0}.', `<keybinding:${FocusAgentSessionsAction.id}>`));
		}
		content.push(localize('chat.requestHistory', 'In the input box, use up and down arrows to navigate your request history. Edit input and use enter or the submit button to run a new request.'));
		content.push(localize('chat.attachments.removal', 'To remove attached contexts, focus an attachment and press Delete or Backspace.'));
		content.push(localize('chat.inspectResponse', 'In the input box, inspect the last response in the accessible view{0}.', '<keybinding:editor.action.accessibleView>'));
		content.push(localize('workbench.action.chat.focus', 'To focus the chat request and response list, invoke the Focus Chat command{0}. This will move focus to the most recent response, which you can then navigate using the up and down arrow keys.', getChatFocusKeybindingLabel(keybindingService, type, 'last')));
		content.push(localize('workbench.action.chat.focusLastFocusedItem', 'To return to the last chat response you focused, invoke the Focus Last Focused Chat Response command{0}.', getChatFocusKeybindingLabel(keybindingService, type, 'lastFocused')));
		content.push(localize('workbench.action.chat.focusInput', 'To focus the input box for chat requests, invoke the Focus Chat Input command{0}.', getChatFocusKeybindingLabel(keybindingService, type, 'input')));
		content.push(localize('chat.progressVerbosity', 'As the chat request is being processed, you will hear verbose progress updates if the request takes more than 4 seconds. This includes information like searched text for <search term> with X results, created file <file_name>, or read file <file path>. This can be disabled with accessibility.verboseChatProgressUpdates.'));
		content.push(localize('chat.announcement', 'Chat responses will be announced as they come in. A response will indicate the number of code blocks, if any, and then the rest of the response.'));
		content.push(localize('workbench.action.chat.nextCodeBlock', 'To focus the next code block within a response, invoke the Chat: Next Code Block command{0}.', '<keybinding:workbench.action.chat.nextCodeBlock>'));
		content.push(localize('workbench.action.chat.nextUserPrompt', 'To navigate to the next user prompt in the conversation, invoke the Next User Prompt command{0}.', '<keybinding:workbench.action.chat.nextUserPrompt>'));
		content.push(localize('workbench.action.chat.previousUserPrompt', 'To navigate to the previous user prompt in the conversation, invoke the Previous User Prompt command{0}.', '<keybinding:workbench.action.chat.previousUserPrompt>'));
		content.push(localize('workbench.action.chat.announceConfirmation', 'To focus pending chat confirmation dialogs, invoke the Focus Chat Confirmation Status command{0}.', '<keybinding:workbench.action.chat.focusConfirmation>'));
		content.push(localize('chat.showHiddenTerminals', 'If there are any hidden chat terminals, you can view them by invoking the View Hidden Chat Terminals command{0}.', '<keybinding:workbench.action.terminal.chat.viewHiddenChatTerminals>'));
		content.push(localize('chat.focusMostRecentTerminal', 'To focus the last chat terminal that ran a tool, invoke the Focus Most Recent Chat Terminal command{0}.', `<keybinding:${TerminalContribCommandId.FocusMostRecentChatTerminal}>`));
		content.push(localize('chat.focusMostRecentTerminalOutput', 'To focus the output from the last chat terminal tool, invoke the Focus Most Recent Chat Terminal Output command{0}.', `<keybinding:${TerminalContribCommandId.FocusMostRecentChatTerminalOutput}>`));
	}
	if (type === 'editsView' || type === 'agentView') {
		if (type === 'agentView') {
			content.push(localize('chatAgent.overview', 'The chat agent view is used to apply edits across files in your workspace, enable running commands in the terminal, and more.'));
		} else {
			content.push(localize('chatEditing.overview', 'The chat editing view is used to apply edits across files.'));
		}
		content.push(localize('chatEditing.format', 'It is comprised of an input box and a file working set (Shift+Tab).'));
		content.push(localize('chatEditing.expectation', 'When a request is made, a progress indicator will play while the edits are being applied.'));
		content.push(localize('chatEditing.review', 'Once the edits are applied, a sound will play to indicate the document has been opened and is ready for review. The sound can be disabled with accessibility.signals.chatEditModifiedFile.'));
		content.push(localize('chatEditing.sections', 'Navigate between edits in the editor with navigate previous{0} and next{1}', '<keybinding:chatEditor.action.navigatePrevious>', '<keybinding:chatEditor.action.navigateNext>'));
		content.push(localize('chatEditing.acceptHunk', 'In the editor, Keep{0}, Undo{1}, or Toggle the Diff{2} for the current Change.', '<keybinding:chatEditor.action.acceptHunk>', '<keybinding:chatEditor.action.undoHunk>', '<keybinding:chatEditor.action.toggleDiff>'));
		content.push(localize('chatEditing.undoKeepSounds', 'Sounds will play when a change is accepted or undone. The sounds can be disabled with accessibility.signals.editsKept and accessibility.signals.editsUndone.'));
		if (type === 'agentView') {
			content.push(localize('chatAgent.userActionRequired', 'An alert will indicate when user action is required. For example, if the agent wants to run something in the terminal, you will hear Action Required: Run Command in Terminal.'));
			content.push(localize('chatAgent.runCommand', 'To take the action, use the accept tool command{0}.', '<keybinding:workbench.action.chat.acceptTool>'));
			content.push(localize('chatAgent.autoApprove', 'To automatically approve tool actions without manual confirmation, set {0} to {1} in your settings.', ChatConfiguration.GlobalAutoApprove, 'true'));
			content.push(localize('chatAgent.acceptTool', 'To accept a tool action, use the Accept Tool Confirmation command{0}.', '<keybinding:workbench.action.chat.acceptTool>'));
			content.push(localize('chatAgent.openEditedFilesSetting', 'By default, when edits are made to files, they will be opened. To change this behavior, set accessibility.openChatEditedFiles to false in your settings.'));
		}
		content.push(localize('chatEditing.helpfulCommands', 'Some helpful commands include:'));
		content.push(localize('workbench.action.chat.undoEdits', '- Undo Edits{0}.', '<keybinding:workbench.action.chat.undoEdits>'));
		content.push(localize('workbench.action.chat.editing.attachFiles', '- Attach Files{0}.', '<keybinding:workbench.action.chat.editing.attachFiles>'));
		content.push(localize('chatEditing.removeFileFromWorkingSet', '- Remove File from Working Set{0}.', '<keybinding:chatEditing.removeFileFromWorkingSet>'));
		content.push(localize('chatEditing.acceptFile', '- Keep{0} and Undo File{1}.', '<keybinding:chatEditing.acceptFile>', '<keybinding:chatEditing.discardFile>'));
		content.push(localize('chatEditing.saveAllFiles', '- Save All Files{0}.', '<keybinding:chatEditing.saveAllFiles>'));
		content.push(localize('chatEditing.acceptAllFiles', '- Keep All Edits{0}.', '<keybinding:chatEditing.acceptAllFiles>'));
		content.push(localize('chatEditing.discardAllFiles', '- Undo All Edits{0}.', '<keybinding:chatEditing.discardAllFiles>'));
		content.push(localize('chatEditing.openFileInDiff', '- Open File in Diff{0}.', '<keybinding:chatEditing.openFileInDiff>'));
		content.push(`- ${ChatEditingShowChangesAction.LABEL}<keybinding:chatEditing.viewChanges>`);
		content.push(`- ${ViewPreviousEditsAction.Label}<keybinding:chatEditing.viewPreviousEdits>`);
	}
	else {
		content.push(localize('inlineChat.overview', "Inline chat occurs within a code editor and takes into account the current selection. It is useful for making changes to the current editor. For example, fixing diagnostics, documenting or refactoring code. Keep in mind that AI generated code may be incorrect."));
		content.push(localize('inlineChat.access', "It can be activated via code actions or directly using the command: Inline Chat: Start Inline Chat{0}.", '<keybinding:inlineChat.start>'));
		content.push(localize('inlineChat.requestHistory', 'In the input box, use Show Previous{0} and Show Next{1} to navigate your request history. Edit input and use enter or the submit button to run a new request.', '<keybinding:history.showPrevious>', '<keybinding:history.showNext>'));
		content.push(localize('inlineChat.inspectResponse', 'In the input box, inspect the response in the accessible view{0}.', '<keybinding:editor.action.accessibleView>'));
		content.push(localize('inlineChat.contextActions', "Context menu actions may run a request prefixed with a /. Type / to discover such ready-made commands."));
		content.push(localize('inlineChat.fix', "If a fix action is invoked, a response will indicate the problem with the current code. A diff editor will be rendered and can be reached by tabbing."));
		content.push(localize('inlineChat.diff', "Once in the diff editor, enter review mode with{0}. Use up and down arrows to navigate lines with the proposed changes.", AccessibleDiffViewerNext.id));
		content.push(localize('inlineChat.toolbar', "Use tab to reach conditional parts like commands, status, message responses and more."));
	}
	content.push(localize('chat.signals', "Accessibility Signals can be changed via settings with a prefix of signals.chat. By default, if a request takes more than 4 seconds, you will hear a sound indicating that progress is still occurring."));
	return content.join('\n');
}

export function getChatAccessibilityHelpProvider(accessor: ServicesAccessor, editor: ICodeEditor | undefined, type: 'panelChat' | 'inlineChat' | 'quickChat' | 'editsView' | 'agentView'): AccessibleContentProvider | undefined {
	const widgetService = accessor.get(IChatWidgetService);
	const keybindingService = accessor.get(IKeybindingService);
	const inputEditor: ICodeEditor | undefined = widgetService.lastFocusedWidget?.inputEditor;

	if (!inputEditor) {
		return;
	}
	const domNode = inputEditor.getDomNode() ?? undefined;
	if (!domNode) {
		return;
	}

	const cachedPosition = inputEditor.getPosition();
	inputEditor.getSupportedActions();
	const helpText = getAccessibilityHelpText(type, keybindingService);
	return new AccessibleContentProvider(
		type === 'panelChat' ? AccessibleViewProviderId.PanelChat : type === 'inlineChat' ? AccessibleViewProviderId.InlineChat : type === 'agentView' ? AccessibleViewProviderId.AgentChat : AccessibleViewProviderId.QuickChat,
		{ type: AccessibleViewType.Help },
		() => helpText,
		() => {
			if (type === 'quickChat' || type === 'editsView' || type === 'agentView' || type === 'panelChat') {
				if (cachedPosition) {
					inputEditor.setPosition(cachedPosition);
				}
				inputEditor.focus();

			} else if (type === 'inlineChat') {
				// TODO@jrieken find a better way for this
				const ctrl = <{ focus(): void } | undefined>editor?.getContribution(INLINE_CHAT_ID);
				ctrl?.focus();

			}
		},
		type === 'inlineChat' ? AccessibilityVerbositySettingId.InlineChat : AccessibilityVerbositySettingId.Chat,
	);
}

// The when clauses for actions may not be true when we invoke the accessible view, so we need to provide the keybinding label manually
// to ensure it's correct
function getChatFocusKeybindingLabel(keybindingService: IKeybindingService, type: 'agentView' | 'panelChat' | 'inlineChat' | 'quickChat', focus?: 'lastFocused' | 'last' | 'input'): string | undefined {
	let kbs;
	const fallback = ' (unassigned keybinding)';
	if (focus === 'input') {
		kbs = keybindingService.lookupKeybindings('workbench.action.chat.focusInput');
	} else if (focus === 'lastFocused') {
		kbs = keybindingService.lookupKeybindings('workbench.chat.action.focusLastFocused');
	} else {
		kbs = keybindingService.lookupKeybindings('chat.action.focus');
	}
	if (!kbs?.length) {
		return fallback;
	}
	let kb;
	if (type === 'agentView' || type === 'panelChat') {
		if (focus !== 'input') {
			kb = kbs.find(kb => kb.getAriaLabel()?.includes('UpArrow'))?.getAriaLabel();
		} else {
			kb = kbs.find(kb => kb.getAriaLabel()?.includes('DownArrow'))?.getAriaLabel();
		}
	} else {
		// Quick chat
		if (focus !== 'input') {
			kb = kbs.find(kb => kb.getAriaLabel()?.includes('DownArrow'))?.getAriaLabel();
		} else {
			kb = kbs.find(kb => kb.getAriaLabel()?.includes('UpArrow'))?.getAriaLabel();
		}
	}
	return !!kb ? ` (${kb})` : fallback;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isAncestorOfActiveElement } from '../../../../../base/browser/dom.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { toAction, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { timeout } from '../../../../../base/common/async.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { safeIntl } from '../../../../../base/common/date.js';
import { Event } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, markAsSingleton } from '../../../../../base/common/lifecycle.js';
import { language } from '../../../../../base/common/platform.js';
import { basename } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { EditorAction2 } from '../../../../../editor/browser/editorExtensions.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IActionViewItemService } from '../../../../../platform/actions/browser/actionViewItemService.js';
import { DropdownWithPrimaryActionViewItem } from '../../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { Action2, ICommandPaletteOptions, MenuId, MenuItemAction, MenuRegistry, registerAction2, SubmenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IsLinuxContext, IsWindowsContext } from '../../../../../platform/contextkey/common/contextkeys.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import product from '../../../../../platform/product/common/product.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ToggleTitleBarConfigAction } from '../../../../browser/parts/titlebar/titlebarActions.js';
import { ActiveEditorContext, IsCompactTitleBarContext } from '../../../../common/contextkeys.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../../common/views.js';
import { ChatEntitlement, IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { AUX_WINDOW_GROUP } from '../../../../services/editor/common/editorService.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, Parts } from '../../../../services/layout/browser/layoutService.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { EXTENSIONS_CATEGORY, IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { SCMHistoryItemChangeRangeContentProvider, ScmHistoryItemChangeRangeUriFields } from '../../../scm/browser/scmHistoryChatContext.js';
import { ISCMService } from '../../../scm/common/scm.js';
import { IChatAgentResult, IChatAgentService } from '../../common/chatAgents.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatModel, IChatResponseModel } from '../../common/chatModel.js';
import { ChatMode, IChatMode, IChatModeService } from '../../common/chatModes.js';
import { IChatService } from '../../common/chatService.js';
import { ISCMHistoryItemChangeRangeVariableEntry, ISCMHistoryItemChangeVariableEntry } from '../../common/chatVariableEntries.js';
import { IChatRequestViewModel, IChatResponseViewModel, isRequestVM } from '../../common/chatViewModel.js';
import { IChatWidgetHistoryService } from '../../common/chatWidgetHistoryService.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../../common/constants.js';
import { ILanguageModelChatSelector, ILanguageModelsService } from '../../common/languageModels.js';
import { CopilotUsageExtensionFeatureId } from '../../common/languageModelStats.js';
import { ILanguageModelToolsConfirmationService } from '../../common/languageModelToolsConfirmationService.js';
import { ILanguageModelToolsService } from '../../common/languageModelToolsService.js';
import { ChatViewId, IChatWidget, IChatWidgetService } from '../chat.js';
import { IChatEditorOptions } from '../chatEditor.js';
import { ChatEditorInput, showClearEditingSessionConfirmation } from '../chatEditorInput.js';
import { convertBufferToScreenshotVariable } from '../contrib/chatScreenshotContext.js';

export const CHAT_CATEGORY = localize2('chat.category', 'Chat');

export const ACTION_ID_NEW_CHAT = `workbench.action.chat.newChat`;
export const ACTION_ID_NEW_EDIT_SESSION = `workbench.action.chat.newEditSession`;
export const ACTION_ID_OPEN_CHAT = 'workbench.action.openChat';
export const CHAT_OPEN_ACTION_ID = 'workbench.action.chat.open';
export const CHAT_SETUP_ACTION_ID = 'workbench.action.chat.triggerSetup';
export const CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID = 'workbench.action.chat.triggerSetupSupportAnonymousAction';
const TOGGLE_CHAT_ACTION_ID = 'workbench.action.chat.toggle';

export interface IChatViewOpenOptions {
	/**
	 * The query for chat.
	 */
	query: string;
	/**
	 * Whether the query is partial and will await more input from the user.
	 */
	isPartialQuery?: boolean;
	/**
	 * A list of tools IDs with `canBeReferencedInPrompt` that will be resolved and attached if they exist.
	 */
	toolIds?: string[];
	/**
	 * Any previous chat requests and responses that should be shown in the chat view.
	 */
	previousRequests?: IChatViewOpenRequestEntry[];
	/**
	 * Whether a screenshot of the focused window should be taken and attached
	 */
	attachScreenshot?: boolean;
	/**
	 * A list of file URIs to attach to the chat as context.
	 */
	attachFiles?: (URI | { uri: URI; range: IRange })[];
	/**
	 * A list of source control history item changes to attach to the chat as context.
	 */
	attachHistoryItemChanges?: { uri: URI; historyItemId: string }[];
	/**
	 * A list of source control history item change ranges to attach to the chat as context.
	 */
	attachHistoryItemChangeRanges?: {
		start: { uri: URI; historyItemId: string };
		end: { uri: URI; historyItemId: string };
	}[];
	/**
	 * The mode ID or name to open the chat in.
	 */
	mode?: ChatModeKind | string;

	/**
	 * The language model selector to use for the chat.
	 * An Error will be thrown if there's no match. If there are multiple
	 * matches, the first match will be used.
	 *
	 * Examples:
	 *
	 * ```
	 * {
	 *   id: 'claude-sonnet-4',
	 *   vendor: 'copilot'
	 * }
	 * ```
	 *
	 * Use `claude-sonnet-4` from any vendor:
	 *
	 * ```
	 * {
	 *   id: 'claude-sonnet-4',
	 * }
	 * ```
	 */
	modelSelector?: ILanguageModelChatSelector;

	/**
	 * Wait to resolve the command until the chat response reaches a terminal state (complete, error, or pending user confirmation, etc.).
	 */
	blockOnResponse?: boolean;
}

export interface IChatViewOpenRequestEntry {
	request: string;
	response: string;
}

export const CHAT_CONFIG_MENU_ID = new MenuId('workbench.chat.menu.config');

const OPEN_CHAT_QUOTA_EXCEEDED_DIALOG = 'workbench.action.chat.openQuotaExceededDialog';

abstract class OpenChatGlobalAction extends Action2 {
	constructor(overrides: Pick<ICommandPaletteOptions, 'keybinding' | 'title' | 'id' | 'menu'>, private readonly mode?: IChatMode) {
		super({
			...overrides,
			icon: Codicon.chatSparkle,
			f1: true,
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.Setup.hidden.negate(),
				ChatContextKeys.Setup.disabled.negate()
			)
		});
	}

	override async run(accessor: ServicesAccessor, opts?: string | IChatViewOpenOptions): Promise<IChatAgentResult & { type?: 'confirmation' } | undefined> {
		opts = typeof opts === 'string' ? { query: opts } : opts;

		const chatService = accessor.get(IChatService);
		const widgetService = accessor.get(IChatWidgetService);
		const toolsService = accessor.get(ILanguageModelToolsService);
		const hostService = accessor.get(IHostService);
		const chatAgentService = accessor.get(IChatAgentService);
		const instaService = accessor.get(IInstantiationService);
		const commandService = accessor.get(ICommandService);
		const chatModeService = accessor.get(IChatModeService);
		const fileService = accessor.get(IFileService);
		const languageModelService = accessor.get(ILanguageModelsService);
		const scmService = accessor.get(ISCMService);

		let chatWidget = widgetService.lastFocusedWidget;
		// When this was invoked to switch to a mode via keybinding, and some chat widget is focused, use that one.
		// Otherwise, open the view.
		if (!this.mode || !chatWidget || !isAncestorOfActiveElement(chatWidget.domNode)) {
			chatWidget = await widgetService.revealWidget();
		}

		if (!chatWidget) {
			return;
		}

		const switchToMode = (opts?.mode ? chatModeService.findModeByName(opts?.mode) : undefined) ?? this.mode;
		if (switchToMode) {
			await this.handleSwitchToMode(switchToMode, chatWidget, instaService, commandService);
		}

		if (opts?.modelSelector) {
			const ids = await languageModelService.selectLanguageModels(opts.modelSelector, false);
			const id = ids.sort().at(0);
			if (!id) {
				throw new Error(`No language models found matching selector: ${JSON.stringify(opts.modelSelector)}.`);
			}

			const model = languageModelService.lookupLanguageModel(id);
			if (!model) {
				throw new Error(`Language model not loaded: ${id}.`);
			}

			chatWidget.input.setCurrentLanguageModel({ metadata: model, identifier: id });
		}

		if (opts?.previousRequests?.length && chatWidget.viewModel) {
			for (const { request, response } of opts.previousRequests) {
				chatService.addCompleteRequest(chatWidget.viewModel.sessionResource, request, undefined, 0, { message: response });
			}
		}
		if (opts?.attachScreenshot) {
			const screenshot = await hostService.getScreenshot();
			if (screenshot) {
				chatWidget.attachmentModel.addContext(convertBufferToScreenshotVariable(screenshot));
			}
		}
		if (opts?.attachFiles) {
			for (const file of opts.attachFiles) {
				const uri = file instanceof URI ? file : file.uri;
				const range = file instanceof URI ? undefined : file.range;

				if (await fileService.exists(uri)) {
					chatWidget.attachmentModel.addFile(uri, range);
				}
			}
		}
		if (opts?.attachHistoryItemChanges) {
			for (const historyItemChange of opts.attachHistoryItemChanges) {
				const repository = scmService.getRepository(URI.file(historyItemChange.uri.path));
				const historyProvider = repository?.provider.historyProvider.get();
				if (!historyProvider) {
					continue;
				}

				const historyItem = await historyProvider.resolveHistoryItem(historyItemChange.historyItemId);
				if (!historyItem) {
					continue;
				}

				chatWidget.attachmentModel.addContext({
					id: historyItemChange.uri.toString(),
					name: `${basename(historyItemChange.uri)}`,
					value: historyItemChange.uri,
					historyItem: historyItem,
					kind: 'scmHistoryItemChange'
				} satisfies ISCMHistoryItemChangeVariableEntry);
			}
		}
		if (opts?.attachHistoryItemChangeRanges) {
			for (const historyItemChangeRange of opts.attachHistoryItemChangeRanges) {
				const repository = scmService.getRepository(URI.file(historyItemChangeRange.end.uri.path));
				const historyProvider = repository?.provider.historyProvider.get();
				if (!repository || !historyProvider) {
					continue;
				}

				const [historyItemStart, historyItemEnd] = await Promise.all([
					historyProvider.resolveHistoryItem(historyItemChangeRange.start.historyItemId),
					historyProvider.resolveHistoryItem(historyItemChangeRange.end.historyItemId),
				]);
				if (!historyItemStart || !historyItemEnd) {
					continue;
				}

				const uri = historyItemChangeRange.end.uri.with({
					scheme: SCMHistoryItemChangeRangeContentProvider.scheme,
					query: JSON.stringify({
						repositoryId: repository.id,
						start: historyItemStart.id,
						end: historyItemChangeRange.end.historyItemId
					} satisfies ScmHistoryItemChangeRangeUriFields)
				});

				chatWidget.attachmentModel.addContext({
					id: uri.toString(),
					name: `${basename(uri)}`,
					value: uri,
					historyItemChangeStart: {
						uri: historyItemChangeRange.start.uri,
						historyItem: historyItemStart
					},
					historyItemChangeEnd: {
						uri: historyItemChangeRange.end.uri,
						historyItem: {
							...historyItemEnd,
							displayId: historyItemChangeRange.end.historyItemId
						}
					},
					kind: 'scmHistoryItemChangeRange'
				} satisfies ISCMHistoryItemChangeRangeVariableEntry);
			}
		}

		let resp: Promise<IChatResponseModel | undefined> | undefined;

		if (opts?.query) {
			chatWidget.setInput(opts.query);

			if (!opts.isPartialQuery) {
				if (!chatWidget.viewModel) {
					await Event.toPromise(chatWidget.onDidChangeViewModel);
				}
				await waitForDefaultAgent(chatAgentService, chatWidget.input.currentModeKind);
				resp = chatWidget.acceptInput();
			}
		}

		if (opts?.toolIds && opts.toolIds.length > 0) {
			for (const toolId of opts.toolIds) {
				const tool = toolsService.getTool(toolId);
				if (tool) {
					chatWidget.attachmentModel.addContext({
						id: tool.id,
						name: tool.displayName,
						fullName: tool.displayName,
						value: undefined,
						icon: ThemeIcon.isThemeIcon(tool.icon) ? tool.icon : undefined,
						kind: 'tool'
					});
				}
			}
		}

		chatWidget.focusInput();

		if (opts?.blockOnResponse) {
			const response = await resp;
			if (response) {
				await new Promise<void>(resolve => {
					const d = response.onDidChange(async () => {
						if (response.isComplete || response.isPendingConfirmation.get()) {
							d.dispose();
							resolve();
						}
					});
				});

				return { ...response.result, type: response.isPendingConfirmation.get() ? 'confirmation' : undefined };
			}
		}

		return undefined;
	}

	private async handleSwitchToMode(switchToMode: IChatMode, chatWidget: IChatWidget, instaService: IInstantiationService, commandService: ICommandService): Promise<void> {
		const currentMode = chatWidget.input.currentModeKind;

		if (switchToMode) {
			const model = chatWidget.viewModel?.model;
			const chatModeCheck = model ? await instaService.invokeFunction(handleModeSwitch, currentMode, switchToMode.kind, model.getRequests().length, model) : { needToClearSession: false };
			if (!chatModeCheck) {
				return;
			}
			chatWidget.input.setChatMode(switchToMode.id);

			if (chatModeCheck.needToClearSession) {
				await commandService.executeCommand(ACTION_ID_NEW_CHAT);
			}
		}
	}
}

async function waitForDefaultAgent(chatAgentService: IChatAgentService, mode: ChatModeKind): Promise<void> {
	const defaultAgent = chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, mode);
	if (defaultAgent) {
		return;
	}

	await Promise.race([
		Event.toPromise(Event.filter(chatAgentService.onDidChangeAgents, () => {
			const defaultAgent = chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, mode);
			return Boolean(defaultAgent);
		})),
		timeout(60_000).then(() => { throw new Error('Timed out waiting for default agent'); })
	]);
}

class PrimaryOpenChatGlobalAction extends OpenChatGlobalAction {
	constructor() {
		super({
			id: CHAT_OPEN_ACTION_ID,
			title: localize2('openChat', "Open Chat"),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyI,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyI
				}
			},
			menu: [{
				id: MenuId.ChatTitleBarMenu,
				group: 'a_open',
				order: 1
			}]
		});
	}
}

export function getOpenChatActionIdForMode(mode: IChatMode): string {
	return `workbench.action.chat.open${mode.name.get()}`;
}

export abstract class ModeOpenChatGlobalAction extends OpenChatGlobalAction {
	constructor(mode: IChatMode, keybinding?: ICommandPaletteOptions['keybinding']) {
		super({
			id: getOpenChatActionIdForMode(mode),
			title: localize2('openChatMode', "Open Chat ({0})", mode.label.get()),
			keybinding
		}, mode);
	}
}

export function registerChatActions() {
	registerAction2(PrimaryOpenChatGlobalAction);
	registerAction2(class extends ModeOpenChatGlobalAction {
		constructor() { super(ChatMode.Ask); }
	});
	registerAction2(class extends ModeOpenChatGlobalAction {
		constructor() {
			super(ChatMode.Agent, {
				when: ContextKeyExpr.has(`config.${ChatConfiguration.AgentEnabled}`),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI,
				linux: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.Shift | KeyCode.KeyI
				}
			},);
		}
	});
	registerAction2(class extends ModeOpenChatGlobalAction {
		constructor() { super(ChatMode.Edit); }
	});

	registerAction2(class ToggleChatAction extends Action2 {
		constructor() {
			super({
				id: TOGGLE_CHAT_ACTION_ID,
				title: localize2('toggleChat', "Toggle Chat"),
				category: CHAT_CATEGORY
			});
		}

		async run(accessor: ServicesAccessor) {
			const layoutService = accessor.get(IWorkbenchLayoutService);
			const viewsService = accessor.get(IViewsService);
			const viewDescriptorService = accessor.get(IViewDescriptorService);
			const widgetService = accessor.get(IChatWidgetService);

			const chatLocation = viewDescriptorService.getViewLocationById(ChatViewId);

			if (viewsService.isViewVisible(ChatViewId)) {
				this.updatePartVisibility(layoutService, chatLocation, false);
			} else {
				this.updatePartVisibility(layoutService, chatLocation, true);
				(await widgetService.revealWidget())?.focusInput();
			}
		}

		private updatePartVisibility(layoutService: IWorkbenchLayoutService, location: ViewContainerLocation | null, visible: boolean): void {
			let part: Parts.PANEL_PART | Parts.SIDEBAR_PART | Parts.AUXILIARYBAR_PART | undefined;
			switch (location) {
				case ViewContainerLocation.Panel:
					part = Parts.PANEL_PART;
					break;
				case ViewContainerLocation.Sidebar:
					part = Parts.SIDEBAR_PART;
					break;
				case ViewContainerLocation.AuxiliaryBar:
					part = Parts.AUXILIARYBAR_PART;
					break;
			}

			if (part) {
				layoutService.setPartHidden(!visible, part);
			}
		}
	});


	registerAction2(class NewChatEditorAction extends Action2 {
		constructor() {
			super({
				id: ACTION_ID_OPEN_CHAT,
				title: localize2('interactiveSession.open', "New Chat Editor"),
				icon: Codicon.plus,
				f1: true,
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					primary: KeyMod.CtrlCmd | KeyCode.KeyN,
					when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inChatEditor)
				},
				menu: [{
					id: MenuId.ChatTitleBarMenu,
					group: 'b_new',
					order: 0
				}, {
					id: MenuId.ChatNewMenu,
					group: '2_new',
					order: 2
				}, {
					id: MenuId.EditorTitle,
					group: 'navigation',
					when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(ChatEditorInput.EditorID), ChatContextKeys.lockedToCodingAgent.negate()),
					order: 1
				}],
			});
		}

		async run(accessor: ServicesAccessor) {
			const widgetService = accessor.get(IChatWidgetService);
			await widgetService.openSession(ChatEditorInput.getNewEditorUri(), undefined, { pinned: true } satisfies IChatEditorOptions);
		}
	});

	registerAction2(class NewChatWindowAction extends Action2 {
		constructor() {
			super({
				id: `workbench.action.newChatWindow`,
				title: localize2('interactiveSession.newChatWindow', "New Chat Window"),
				f1: true,
				category: CHAT_CATEGORY,
				precondition: ChatContextKeys.enabled,
				menu: [{
					id: MenuId.ChatTitleBarMenu,
					group: 'b_new',
					order: 1
				}, {
					id: MenuId.ChatNewMenu,
					group: '2_new',
					order: 3
				}]
			});
		}

		async run(accessor: ServicesAccessor) {
			const widgetService = accessor.get(IChatWidgetService);
			await widgetService.openSession(ChatEditorInput.getNewEditorUri(), AUX_WINDOW_GROUP, { pinned: true, auxiliary: { compact: true, bounds: { width: 640, height: 640 } } } satisfies IChatEditorOptions);
		}
	});

	registerAction2(class ClearChatInputHistoryAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.clearInputHistory',
				title: localize2('interactiveSession.clearHistory.label', "Clear Input History"),
				precondition: ChatContextKeys.enabled,
				category: CHAT_CATEGORY,
				f1: true,
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]) {
			const historyService = accessor.get(IChatWidgetHistoryService);
			historyService.clearHistory();
		}
	});

	registerAction2(class FocusChatAction extends EditorAction2 {
		constructor() {
			super({
				id: 'chat.action.focus',
				title: localize2('actions.interactiveSession.focus', 'Focus Chat List'),
				precondition: ContextKeyExpr.and(ChatContextKeys.inChatInput),
				category: CHAT_CATEGORY,
				keybinding: [
					// On mac, require that the cursor is at the top of the input, to avoid stealing cmd+up to move the cursor to the top
					{
						when: ContextKeyExpr.and(ChatContextKeys.inputCursorAtTop, ChatContextKeys.inQuickChat.negate()),
						primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
						weight: KeybindingWeight.EditorContrib,
					},
					// On win/linux, ctrl+up can always focus the chat list
					{
						when: ContextKeyExpr.and(ContextKeyExpr.or(IsWindowsContext, IsLinuxContext), ChatContextKeys.inQuickChat.negate()),
						primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
						weight: KeybindingWeight.EditorContrib,
					},
					{
						when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inQuickChat),
						primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
						weight: KeybindingWeight.WorkbenchContrib,
					}
				]
			});
		}

		runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
			const editorUri = editor.getModel()?.uri;
			if (editorUri) {
				const widgetService = accessor.get(IChatWidgetService);
				widgetService.getWidgetByInputUri(editorUri)?.focusResponseItem();
			}
		}
	});

	registerAction2(class FocusMostRecentlyFocusedChatAction extends EditorAction2 {
		constructor() {
			super({
				id: 'workbench.chat.action.focusLastFocused',
				title: localize2('actions.interactiveSession.focusLastFocused', 'Focus Last Focused Chat List Item'),
				precondition: ContextKeyExpr.and(ChatContextKeys.inChatInput),
				category: CHAT_CATEGORY,
				keybinding: [
					// On mac, require that the cursor is at the top of the input, to avoid stealing cmd+up to move the cursor to the top
					{
						when: ContextKeyExpr.and(ChatContextKeys.inputCursorAtTop, ChatContextKeys.inQuickChat.negate()),
						primary: KeyMod.CtrlCmd | KeyCode.UpArrow | KeyMod.Shift,
						weight: KeybindingWeight.EditorContrib + 1,
					},
					// On win/linux, ctrl+up can always focus the chat list
					{
						when: ContextKeyExpr.and(ContextKeyExpr.or(IsWindowsContext, IsLinuxContext), ChatContextKeys.inQuickChat.negate()),
						primary: KeyMod.CtrlCmd | KeyCode.UpArrow | KeyMod.Shift,
						weight: KeybindingWeight.EditorContrib + 1,
					},
					{
						when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inQuickChat),
						primary: KeyMod.CtrlCmd | KeyCode.DownArrow | KeyMod.Shift,
						weight: KeybindingWeight.WorkbenchContrib + 1,
					}
				]
			});
		}

		runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
			const editorUri = editor.getModel()?.uri;
			if (editorUri) {
				const widgetService = accessor.get(IChatWidgetService);
				widgetService.getWidgetByInputUri(editorUri)?.focusResponseItem(true);
			}
		}
	});

	registerAction2(class FocusChatInputAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.focusInput',
				title: localize2('interactiveSession.focusInput.label', "Focus Chat Input"),
				f1: false,
				keybinding: [
					{
						primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
						weight: KeybindingWeight.WorkbenchContrib,
						when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inChatInput.negate(), ChatContextKeys.inQuickChat.negate()),
					},
					{
						when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inChatInput.negate(), ChatContextKeys.inQuickChat),
						primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
						weight: KeybindingWeight.WorkbenchContrib,
					}
				]
			});
		}
		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const widgetService = accessor.get(IChatWidgetService);
			widgetService.lastFocusedWidget?.focusInput();
		}
	});

	const nonEnterpriseCopilotUsers = ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.notEquals(`config.${defaultChat.completionsAdvancedSetting}.authProvider`, defaultChat.provider.enterprise.id));
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.manageSettings',
				title: localize2('manageChat', "Manage Chat"),
				category: CHAT_CATEGORY,
				f1: true,
				precondition: ContextKeyExpr.and(
					ContextKeyExpr.or(
						ChatContextKeys.Entitlement.planFree,
						ChatContextKeys.Entitlement.planPro,
						ChatContextKeys.Entitlement.planProPlus
					),
					nonEnterpriseCopilotUsers
				),
				menu: {
					id: MenuId.ChatTitleBarMenu,
					group: 'y_manage',
					order: 1,
					when: nonEnterpriseCopilotUsers
				}
			});
		}

		override async run(accessor: ServicesAccessor): Promise<void> {
			const openerService = accessor.get(IOpenerService);
			openerService.open(URI.parse(defaultChat.manageSettingsUrl));
		}
	});

	registerAction2(class ShowExtensionsUsingCopilot extends Action2 {

		constructor() {
			super({
				id: 'workbench.action.chat.showExtensionsUsingCopilot',
				title: localize2('showCopilotUsageExtensions', "Show Extensions using Copilot"),
				f1: true,
				category: EXTENSIONS_CATEGORY,
				precondition: ChatContextKeys.enabled
			});
		}

		override async run(accessor: ServicesAccessor): Promise<void> {
			const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
			extensionsWorkbenchService.openSearch(`@feature:${CopilotUsageExtensionFeatureId}`);
		}
	});

	registerAction2(class ConfigureCopilotCompletions extends Action2 {

		constructor() {
			super({
				id: 'workbench.action.chat.configureCodeCompletions',
				title: localize2('configureCompletions', "Configure Inline Suggestions..."),
				precondition: ContextKeyExpr.and(
					ChatContextKeys.Setup.installed,
					ChatContextKeys.Setup.disabled.negate(),
					ChatContextKeys.Setup.untrusted.negate()
				),
				menu: {
					id: MenuId.ChatTitleBarMenu,
					group: 'f_completions',
					order: 10,
				}
			});
		}

		override async run(accessor: ServicesAccessor): Promise<void> {
			const commandService = accessor.get(ICommandService);
			commandService.executeCommand(defaultChat.completionsMenuCommand);
		}
	});

	registerAction2(class ShowQuotaExceededDialogAction extends Action2 {

		constructor() {
			super({
				id: OPEN_CHAT_QUOTA_EXCEEDED_DIALOG,
				title: localize('upgradeChat', "Upgrade GitHub Copilot Plan")
			});
		}

		override async run(accessor: ServicesAccessor) {
			const chatEntitlementService = accessor.get(IChatEntitlementService);
			const commandService = accessor.get(ICommandService);
			const dialogService = accessor.get(IDialogService);
			const telemetryService = accessor.get(ITelemetryService);

			let message: string;
			const chatQuotaExceeded = chatEntitlementService.quotas.chat?.percentRemaining === 0;
			const completionsQuotaExceeded = chatEntitlementService.quotas.completions?.percentRemaining === 0;
			if (chatQuotaExceeded && !completionsQuotaExceeded) {
				message = localize('chatQuotaExceeded', "You've reached your monthly chat messages quota. You still have free inline suggestions available.");
			} else if (completionsQuotaExceeded && !chatQuotaExceeded) {
				message = localize('completionsQuotaExceeded', "You've reached your monthly inline suggestions quota. You still have free chat messages available.");
			} else {
				message = localize('chatAndCompletionsQuotaExceeded', "You've reached your monthly chat messages and inline suggestions quota.");
			}

			if (chatEntitlementService.quotas.resetDate) {
				const dateFormatter = chatEntitlementService.quotas.resetDateHasTime ? safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' });
				const quotaResetDate = new Date(chatEntitlementService.quotas.resetDate);
				message = [message, localize('quotaResetDate', "The allowance will reset on {0}.", dateFormatter.value.format(quotaResetDate))].join(' ');
			}

			const free = chatEntitlementService.entitlement === ChatEntitlement.Free;
			const upgradeToPro = free ? localize('upgradeToPro', "Upgrade to GitHub Copilot Pro (your first 30 days are free) for:\n- Unlimited inline suggestions\n- Unlimited chat messages\n- Access to premium models") : undefined;

			await dialogService.prompt({
				type: 'none',
				message: localize('copilotQuotaReached', "GitHub Copilot Quota Reached"),
				cancelButton: {
					label: localize('dismiss', "Dismiss"),
					run: () => { /* noop */ }
				},
				buttons: [
					{
						label: free ? localize('upgradePro', "Upgrade to GitHub Copilot Pro") : localize('upgradePlan', "Upgrade GitHub Copilot Plan"),
						run: () => {
							const commandId = 'workbench.action.chat.upgradePlan';
							telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: commandId, from: 'chat-dialog' });
							commandService.executeCommand(commandId);
						}
					},
				],
				custom: {
					icon: Codicon.copilotWarningLarge,
					markdownDetails: coalesce([
						{ markdown: new MarkdownString(message, true) },
						upgradeToPro ? { markdown: new MarkdownString(upgradeToPro, true) } : undefined
					])
				}
			});
		}
	});

	registerAction2(class ResetTrustedToolsAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.resetTrustedTools',
				title: localize2('resetTrustedTools', "Reset Tool Confirmations"),
				category: CHAT_CATEGORY,
				f1: true,
				precondition: ChatContextKeys.enabled
			});
		}
		override run(accessor: ServicesAccessor): void {
			accessor.get(ILanguageModelToolsConfirmationService).resetToolAutoConfirmation();
			accessor.get(INotificationService).info(localize('resetTrustedToolsSuccess', "Tool confirmation preferences have been reset."));
		}
	});

	registerAction2(class UpdateInstructionsAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.generateInstructions',
				title: localize2('generateInstructions', "Generate Workspace Instructions File"),
				shortTitle: localize2('generateInstructions.short', "Generate Chat Instructions"),
				category: CHAT_CATEGORY,
				icon: Codicon.sparkle,
				f1: true,
				precondition: ChatContextKeys.enabled,
				menu: {
					id: CHAT_CONFIG_MENU_ID,
					when: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.equals('view', ChatViewId)),
					order: 11,
					group: '1_level'
				}
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const commandService = accessor.get(ICommandService);

			// Use chat command to open and send the query
			const query = `Analyze this codebase to generate or update \`.github/copilot-instructions.md\` for guiding AI coding agents.

Focus on discovering the essential knowledge that would help an AI agents be immediately productive in this codebase. Consider aspects like:
- The "big picture" architecture that requires reading multiple files to understand - major components, service boundaries, data flows, and the "why" behind structural decisions
- Critical developer workflows (builds, tests, debugging) especially commands that aren't obvious from file inspection alone
- Project-specific conventions and patterns that differ from common practices
- Integration points, external dependencies, and cross-component communication patterns

Source existing AI conventions from \`**/{.github/copilot-instructions.md,AGENT.md,AGENTS.md,CLAUDE.md,.cursorrules,.windsurfrules,.clinerules,.cursor/rules/**,.windsurf/rules/**,.clinerules/**,README.md}\` (do one glob search).

Guidelines (read more at https://aka.ms/vscode-instructions-docs):
- If \`.github/copilot-instructions.md\` exists, merge intelligently - preserve valuable content while updating outdated sections
- Write concise, actionable instructions (~20-50 lines) using markdown structure
- Include specific examples from the codebase when describing patterns
- Avoid generic advice ("write tests", "handle errors") - focus on THIS project's specific approaches
- Document only discoverable patterns, not aspirational practices
- Reference key files/directories that exemplify important patterns

Update \`.github/copilot-instructions.md\` for the user, then ask for feedback on any unclear or incomplete sections to iterate.`;

			await commandService.executeCommand('workbench.action.chat.open', {
				mode: 'agent',
				query: query,
			});
		}
	});

	registerAction2(class OpenChatFeatureSettingsAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.openFeatureSettings',
				title: localize2('openChatFeatureSettings', "Chat Settings"),
				shortTitle: localize('openChatFeatureSettings.short', "Chat Settings"),
				category: CHAT_CATEGORY,
				f1: true,
				precondition: ChatContextKeys.enabled,
				menu: [{
					id: CHAT_CONFIG_MENU_ID,
					when: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.equals('view', ChatViewId)),
					order: 15,
					group: '3_configure'
				},
				{
					id: MenuId.ChatWelcomeContext,
					group: '2_settings',
					order: 1
				}]
			});
		}

		override async run(accessor: ServicesAccessor): Promise<void> {
			const preferencesService = accessor.get(IPreferencesService);
			preferencesService.openSettings({ query: '@feature:chat ' });
		}
	});

	MenuRegistry.appendMenuItem(MenuId.ViewTitle, {
		submenu: CHAT_CONFIG_MENU_ID,
		title: localize2('config.label', "Configure Chat"),
		group: 'navigation',
		when: ContextKeyExpr.equals('view', ChatViewId),
		icon: Codicon.gear,
		order: 6
	});
}

export function stringifyItem(item: IChatRequestViewModel | IChatResponseViewModel, includeName = true): string {
	if (isRequestVM(item)) {
		return (includeName ? `${item.username}: ` : '') + item.messageText;
	} else {
		return (includeName ? `${item.username}: ` : '') + item.response.toString();
	}
}


// --- Title Bar Chat Controls

const defaultChat = {
	manageSettingsUrl: product.defaultChatAgent?.manageSettingsUrl ?? '',
	provider: product.defaultChatAgent?.provider ?? { enterprise: { id: '' } },
	completionsAdvancedSetting: product.defaultChatAgent?.completionsAdvancedSetting ?? '',
	completionsMenuCommand: product.defaultChatAgent?.completionsMenuCommand ?? '',
};

// Add next to the command center if command center is disabled
MenuRegistry.appendMenuItem(MenuId.CommandCenter, {
	submenu: MenuId.ChatTitleBarMenu,
	title: localize('title4', "Chat"),
	icon: Codicon.chatSparkle,
	when: ContextKeyExpr.and(
		ChatContextKeys.supported,
		ContextKeyExpr.and(
			ChatContextKeys.Setup.hidden.negate(),
			ChatContextKeys.Setup.disabled.negate()
		),
		ContextKeyExpr.has('config.chat.commandCenter.enabled')
	),
	order: 10001 // to the right of command center
});

// Add to the global title bar if command center is disabled
MenuRegistry.appendMenuItem(MenuId.TitleBar, {
	submenu: MenuId.ChatTitleBarMenu,
	title: localize('title4', "Chat"),
	group: 'navigation',
	icon: Codicon.chatSparkle,
	when: ContextKeyExpr.and(
		ChatContextKeys.supported,
		ContextKeyExpr.and(
			ChatContextKeys.Setup.hidden.negate(),
			ChatContextKeys.Setup.disabled.negate()
		),
		ContextKeyExpr.has('config.chat.commandCenter.enabled'),
		ContextKeyExpr.has('config.window.commandCenter').negate(),
	),
	order: 1
});

registerAction2(class ToggleCopilotControl extends ToggleTitleBarConfigAction {
	constructor() {
		super(
			'chat.commandCenter.enabled',
			localize('toggle.chatControl', 'Chat Controls'),
			localize('toggle.chatControlsDescription', "Toggle visibility of the Chat Controls in title bar"), 5,
			ContextKeyExpr.and(
				ContextKeyExpr.and(
					ChatContextKeys.Setup.hidden.negate(),
					ChatContextKeys.Setup.disabled.negate()
				),
				IsCompactTitleBarContext.negate(),
				ChatContextKeys.supported
			)
		);
	}
});

export class CopilotTitleBarMenuRendering extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.copilotTitleBarMenuRendering';

	constructor(
		@IActionViewItemService actionViewItemService: IActionViewItemService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService,
	) {
		super();

		const disposable = actionViewItemService.register(MenuId.CommandCenter, MenuId.ChatTitleBarMenu, (action, options, instantiationService, windowId) => {
			if (!(action instanceof SubmenuItemAction)) {
				return undefined;
			}

			const dropdownAction = toAction({
				id: 'copilot.titleBarMenuRendering.more',
				label: localize('more', "More..."),
				run() { }
			});

			const chatSentiment = chatEntitlementService.sentiment;
			const chatQuotaExceeded = chatEntitlementService.quotas.chat?.percentRemaining === 0;
			const signedOut = chatEntitlementService.entitlement === ChatEntitlement.Unknown;
			const anonymous = chatEntitlementService.anonymous;
			const free = chatEntitlementService.entitlement === ChatEntitlement.Free;

			const isAuxiliaryWindow = windowId !== mainWindow.vscodeWindowId;
			let primaryActionId = isAuxiliaryWindow ? CHAT_OPEN_ACTION_ID : TOGGLE_CHAT_ACTION_ID;
			let primaryActionTitle = isAuxiliaryWindow ? localize('openChat', "Open Chat") : localize('toggleChat', "Toggle Chat");
			let primaryActionIcon = Codicon.chatSparkle;
			if (chatSentiment.installed && !chatSentiment.disabled) {
				if (signedOut && !anonymous) {
					primaryActionId = CHAT_SETUP_ACTION_ID;
					primaryActionTitle = localize('signInToChatSetup', "Sign in to use AI features...");
					primaryActionIcon = Codicon.chatSparkleError;
				} else if (chatQuotaExceeded && free) {
					primaryActionId = OPEN_CHAT_QUOTA_EXCEEDED_DIALOG;
					primaryActionTitle = localize('chatQuotaExceededButton', "GitHub Copilot Free plan chat messages quota reached. Click for details.");
					primaryActionIcon = Codicon.chatSparkleWarning;
				}
			}
			return instantiationService.createInstance(DropdownWithPrimaryActionViewItem, instantiationService.createInstance(MenuItemAction, {
				id: primaryActionId,
				title: primaryActionTitle,
				icon: primaryActionIcon,
			}, undefined, undefined, undefined, undefined), dropdownAction, action.actions, '', { ...options, skipTelemetry: true });
		}, Event.any(
			chatEntitlementService.onDidChangeSentiment,
			chatEntitlementService.onDidChangeQuotaExceeded,
			chatEntitlementService.onDidChangeEntitlement,
			chatEntitlementService.onDidChangeAnonymous
		));

		// Reduces flicker a bit on reload/restart
		markAsSingleton(disposable);
	}
}

/**
 * Returns whether we can continue clearing/switching chat sessions, false to cancel.
 */
export async function handleCurrentEditingSession(model: IChatModel, phrase: string | undefined, dialogService: IDialogService): Promise<boolean> {
	return showClearEditingSessionConfirmation(model, dialogService, { messageOverride: phrase });
}

/**
 * Returns whether we can switch the agent, based on whether the user had to agree to clear the session, false to cancel.
 */
export async function handleModeSwitch(
	accessor: ServicesAccessor,
	fromMode: ChatModeKind,
	toMode: ChatModeKind,
	requestCount: number,
	model: IChatModel | undefined,
): Promise<false | { needToClearSession: boolean }> {
	if (!model?.editingSession || fromMode === toMode) {
		return { needToClearSession: false };
	}

	const configurationService = accessor.get(IConfigurationService);
	const dialogService = accessor.get(IDialogService);
	const needToClearEdits = (!configurationService.getValue(ChatConfiguration.Edits2Enabled) && (fromMode === ChatModeKind.Edit || toMode === ChatModeKind.Edit)) && requestCount > 0;
	if (needToClearEdits) {
		// If not using edits2 and switching into or out of edit mode, ask to discard the session
		const phrase = localize('switchMode.confirmPhrase', "Switching agents will end your current edit session.");

		const currentEdits = model.editingSession.entries.get();
		const undecidedEdits = currentEdits.filter((edit) => edit.state.get() === ModifiedFileEntryState.Modified);
		if (undecidedEdits.length > 0) {
			if (!await handleCurrentEditingSession(model, phrase, dialogService)) {
				return false;
			}

			return { needToClearSession: true };
		} else {
			const confirmation = await dialogService.confirm({
				title: localize('agent.newSession', "Start new session?"),
				message: localize('agent.newSessionMessage', "Changing the agent will end your current edit session. Would you like to change the agent?"),
				primaryButton: localize('agent.newSession.confirm', "Yes"),
				type: 'info'
			});
			if (!confirmation.confirmed) {
				return false;
			}

			return { needToClearSession: true };
		}
	}

	return { needToClearSession: false };
}

export interface IClearEditingSessionConfirmationOptions {
	titleOverride?: string;
	messageOverride?: string;
	isArchiveAction?: boolean;
}


// --- Chat Submenus in various Components

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	submenu: MenuId.ChatTextEditorMenu,
	group: '1_chat',
	order: 5,
	title: localize('generateCode', "Generate Code"),
	when: ContextKeyExpr.and(
		ChatContextKeys.Setup.hidden.negate(),
		ChatContextKeys.Setup.disabled.negate()
	)
});

// --- Chat Default Visibility

registerAction2(class ToggleDefaultVisibilityAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.toggleDefaultVisibility',
			title: localize2('chat.toggleDefaultVisibility.label', "Show View by Default"),
			toggled: ContextKeyExpr.equals('config.workbench.secondarySideBar.defaultVisibility', 'hidden').negate(),
			f1: false,
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('view', ChatViewId),
					ChatContextKeys.panelLocation.isEqualTo(ViewContainerLocation.AuxiliaryBar),
				),
				order: 0,
				group: '5_configure'
			},
		});
	}

	async run(accessor: ServicesAccessor) {
		const configurationService = accessor.get(IConfigurationService);

		const currentValue = configurationService.getValue<'hidden' | unknown>('workbench.secondarySideBar.defaultVisibility');
		configurationService.updateValue('workbench.secondarySideBar.defaultVisibility', currentValue !== 'hidden' ? 'hidden' : 'visible');
	}
});

registerAction2(class EditToolApproval extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.editToolApproval',
			title: localize2('chat.editToolApproval.label', "Manage Tool Approval"),
			metadata: {
				description: localize2('chat.editToolApproval.description', "Edit/manage the tool approval and confirmation preferences for AI chat agents."),
			},
			precondition: ChatContextKeys.enabled,
			f1: true,
			category: CHAT_CATEGORY,
		});
	}

	async run(accessor: ServicesAccessor, scope?: 'workspace' | 'profile' | 'session'): Promise<void> {
		const confirmationService = accessor.get(ILanguageModelToolsConfirmationService);
		const toolsService = accessor.get(ILanguageModelToolsService);
		confirmationService.manageConfirmationPreferences([...toolsService.getTools()], scope ? { defaultScope: scope } : undefined);
	}
});

registerAction2(class ToggleChatViewTitleAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.toggleChatViewTitle',
			title: localize2('chat.toggleChatViewTitle.label', "Show Chat Title"),
			toggled: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewTitleEnabled}`, true),
			menu: {
				id: MenuId.ChatWelcomeContext,
				group: '1_modify',
				order: 2,
				when: ChatContextKeys.inChatEditor.negate()
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const chatViewTitleEnabled = configurationService.getValue<boolean>(ChatConfiguration.ChatViewTitleEnabled);
		await configurationService.updateValue(ChatConfiguration.ChatViewTitleEnabled, !chatViewTitleEnabled);
	}
});

registerAction2(class ToggleChatViewWelcomeAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.toggleChatViewWelcome',
			title: localize2('chat.toggleChatViewWelcome.label', "Show Welcome"),
			category: CHAT_CATEGORY,
			precondition: ChatContextKeys.enabled,
			toggled: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewWelcomeEnabled}`, true),
			menu: {
				id: MenuId.ChatWelcomeContext,
				group: '1_modify',
				order: 3,
				when: ChatContextKeys.inChatEditor.negate()
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const chatViewWelcomeEnabled = configurationService.getValue<boolean>(ChatConfiguration.ChatViewWelcomeEnabled);
		await configurationService.updateValue(ChatConfiguration.ChatViewWelcomeEnabled, !chatViewWelcomeEnabled);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatAgentRecommendationActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatAgentRecommendationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { TimeoutTimer } from '../../../../../base/common/async.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IExtensionGalleryService } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { ICommandService, CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchExtensionManagementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { IChatSessionRecommendation } from '../../../../../base/common/product.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { IChatService } from '../../common/chatService.js';

const INSTALL_CONTEXT_PREFIX = 'chat.installRecommendationAvailable';

export class ChatAgentRecommendation extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.chatAgentRecommendation';

	private readonly availabilityContextKeys = new Map<string, IContextKey<boolean>>();
	private refreshRequestId = 0;

	constructor(
		@IProductService private readonly productService: IProductService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IWorkbenchExtensionManagementService private readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();
		const recommendations = this.productService.chatSessionRecommendations;
		if (!recommendations?.length || !this.extensionGalleryService.isEnabled()) {
			return;
		}

		for (const recommendation of recommendations) {
			this.registerRecommendation(recommendation);
		}

		const refresh = () => this.refreshInstallAvailability();
		this._register(this.extensionManagementService.onProfileAwareDidInstallExtensions(refresh));
		this._register(this.extensionManagementService.onProfileAwareDidUninstallExtension(refresh));
		this._register(this.extensionManagementService.onDidChangeProfile(refresh));

		this.refreshInstallAvailability();
	}

	private registerRecommendation(recommendation: IChatSessionRecommendation): void {
		const extensionKey = ExtensionIdentifier.toKey(recommendation.extensionId);
		const commandId = `chat.installRecommendation.${extensionKey}.${recommendation.name}`;
		const availabilityContextId = `${INSTALL_CONTEXT_PREFIX}.${extensionKey}`;
		const availabilityContext = new RawContextKey<boolean>(availabilityContextId, false).bindTo(this.contextKeyService);
		this.availabilityContextKeys.set(extensionKey, availabilityContext);

		const title = localize2('chat.installRecommendation', "New {0}", recommendation.displayName);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: commandId,
					title,
					tooltip: recommendation.description,
					f1: false,
					category: CHAT_CATEGORY,
					icon: Codicon.extensions,
					menu: [
						{
							id: MenuId.ChatNewMenu,
							group: '4_recommendations',
							when: ContextKeyExpr.equals(availabilityContextId, true)
						}
					]
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const commandService = accessor.get(ICommandService);
				const productService = accessor.get(IProductService);
				const chatService = accessor.get(IChatService);

				const installPreReleaseVersion = productService.quality !== 'stable';
				await commandService.executeCommand('workbench.extensions.installExtension', recommendation.extensionId, {
					installPreReleaseVersion
				});
				await runPostInstallCommand(commandService, chatService, recommendation.postInstallCommand);
			}
		}));
	}

	private refreshInstallAvailability(): void {
		if (!this.availabilityContextKeys.size) {
			return;
		}

		const currentRequest = ++this.refreshRequestId;
		this.extensionManagementService.getInstalled().then(installedExtensions => {
			if (currentRequest !== this.refreshRequestId) {
				return;
			}

			const installed = new Set(installedExtensions.map(ext => ExtensionIdentifier.toKey(ext.identifier.id)));
			for (const [extensionKey, context] of this.availabilityContextKeys) {
				context.set(!installed.has(extensionKey));
			}
		}, () => {
			if (currentRequest !== this.refreshRequestId) {
				return;
			}

			for (const [, context] of this.availabilityContextKeys) {
				context.set(false);
			}
		});
	}
}

async function runPostInstallCommand(commandService: ICommandService, chatService: IChatService, commandId: string | undefined): Promise<void> {
	if (!commandId) {
		return;
	}
	await waitForCommandRegistration(commandId);
	await chatService.activateDefaultAgent(ChatAgentLocation.Chat);
	try {
		await commandService.executeCommand(commandId);
	} catch {
		// Command failed or was cancelled; ignore.
	}
}

function waitForCommandRegistration(commandId: string): Promise<void> {
	if (CommandsRegistry.getCommands().has(commandId)) {
		return Promise.resolve();
	}

	return new Promise<void>(resolve => {
		const timer = new TimeoutTimer();
		const listener = CommandsRegistry.onDidRegisterCommand((id: string) => {
			if (id === commandId) {
				listener.dispose();
				timer.dispose();
				resolve();
			}
		});
		timer.cancelAndSet(() => {
			listener.dispose();
			resolve();
		}, 10_000);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatClear.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatClear.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../base/common/network.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IChatEditorOptions } from '../chatEditor.js';
import { ChatEditorInput } from '../chatEditorInput.js';

export async function clearChatEditor(accessor: ServicesAccessor, chatEditorInput?: ChatEditorInput): Promise<void> {
	const editorService = accessor.get(IEditorService);

	if (!chatEditorInput) {
		const editorInput = editorService.activeEditor;
		chatEditorInput = editorInput instanceof ChatEditorInput ? editorInput : undefined;
	}

	if (chatEditorInput instanceof ChatEditorInput) {
		// If we have a contributed session, make sure we create an untitled session for it.
		// Otherwise create a generic new chat editor.
		const resource = chatEditorInput.sessionResource && chatEditorInput.sessionResource.scheme !== Schemas.vscodeLocalChatSession
			? chatEditorInput.sessionResource.with({ path: `/untitled-${generateUuid()}` })
			: ChatEditorInput.getNewEditorUri();

		// A chat editor can only be open in one group
		const identifier = editorService.findEditors(chatEditorInput.resource)[0];
		await editorService.replaceEditors([{
			editor: chatEditorInput,
			replacement: { resource, options: { pinned: true } satisfies IChatEditorOptions }
		}], identifier.groupId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatCodeblockActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatCodeblockActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableObject } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, markAsSingleton } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { CopyAction } from '../../../../../editor/contrib/clipboard/browser/clipboard.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IActionViewItemService } from '../../../../../platform/actions/browser/actionViewItemService.js';
import { MenuEntryActionViewItem } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, MenuId, MenuItemAction, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IUntitledTextResourceEditorInput } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { accessibleViewInCodeBlock } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { EditDeltaInfo } from '../../../../../editor/common/textModelEditSource.js';
import { reviewEdits } from '../../../inlineChat/browser/inlineChatController.js';
import { ITerminalEditorService, ITerminalGroupService, ITerminalService } from '../../../terminal/browser/terminal.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ChatCopyKind, IChatService } from '../../common/chatService.js';
import { IChatRequestViewModel, IChatResponseViewModel, isRequestVM, isResponseVM } from '../../common/chatViewModel.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { IChatCodeBlockContextProviderService, IChatWidgetService } from '../chat.js';
import { DefaultChatTextEditor, ICodeBlockActionContext, ICodeCompareBlockActionContext } from '../codeBlockPart.js';
import { CHAT_CATEGORY } from './chatActions.js';
import { ApplyCodeBlockOperation, InsertCodeBlockOperation } from './codeBlockOperations.js';

const shellLangIds = [
	'fish',
	'ps1',
	'pwsh',
	'powershell',
	'sh',
	'shellscript',
	'zsh'
];

export interface IChatCodeBlockActionContext extends ICodeBlockActionContext {
	element: IChatResponseViewModel;
}

export function isCodeBlockActionContext(thing: unknown): thing is ICodeBlockActionContext {
	return typeof thing === 'object' && thing !== null && 'code' in thing && 'element' in thing;
}

export function isCodeCompareBlockActionContext(thing: unknown): thing is ICodeCompareBlockActionContext {
	return typeof thing === 'object' && thing !== null && 'element' in thing;
}

function isResponseFiltered(context: ICodeBlockActionContext) {
	return isResponseVM(context.element) && context.element.errorDetails?.responseIsFiltered;
}

abstract class ChatCodeBlockAction extends Action2 {
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		let context = args[0];
		if (!isCodeBlockActionContext(context)) {
			const codeEditorService = accessor.get(ICodeEditorService);
			const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
			if (!editor) {
				return;
			}

			context = getContextFromEditor(editor, accessor);
			if (!isCodeBlockActionContext(context)) {
				return;
			}
		}

		return this.runWithContext(accessor, context);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract runWithContext(accessor: ServicesAccessor, context: ICodeBlockActionContext): any;
}

const APPLY_IN_EDITOR_ID = 'workbench.action.chat.applyInEditor';

export class CodeBlockActionRendering extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.codeBlockActionRendering';

	constructor(
		@IActionViewItemService actionViewItemService: IActionViewItemService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
	) {
		super();

		const disposable = actionViewItemService.register(MenuId.ChatCodeBlock, APPLY_IN_EDITOR_ID, (action, options) => {
			if (!(action instanceof MenuItemAction)) {
				return undefined;
			}
			return instantiationService.createInstance(class extends MenuEntryActionViewItem {
				protected override getTooltip(): string {
					const context = this._context;
					if (isCodeBlockActionContext(context) && context.codemapperUri) {
						const label = labelService.getUriLabel(context.codemapperUri, { relative: true });
						return localize('interactive.applyInEditorWithURL.label', "Apply to {0}", label);
					}
					return super.getTooltip();
				}
				override setActionContext(newContext: unknown): void {
					super.setActionContext(newContext);
					this.updateTooltip();
				}
			}, action, undefined);
		});

		// Reduces flicker a bit on reload/restart
		markAsSingleton(disposable);
	}
}

export function registerChatCodeBlockActions() {
	registerAction2(class CopyCodeBlockAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.copyCodeBlock',
				title: localize2('interactive.copyCodeBlock.label', "Copy"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.copy,
				menu: {
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					order: 30
				}
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const context = args[0];
			if (!isCodeBlockActionContext(context) || isResponseFiltered(context)) {
				return;
			}

			const clipboardService = accessor.get(IClipboardService);
			const aiEditTelemetryService = accessor.get(IAiEditTelemetryService);
			clipboardService.writeText(context.code);

			if (isResponseVM(context.element)) {
				const chatService = accessor.get(IChatService);
				const requestId = context.element.requestId;
				const request = context.element.session.getItems().find(item => item.id === requestId && isRequestVM(item)) as IChatRequestViewModel | undefined;
				chatService.notifyUserAction({
					agentId: context.element.agent?.id,
					command: context.element.slashCommand?.name,
					sessionResource: context.element.sessionResource,
					requestId: context.element.requestId,
					result: context.element.result,
					action: {
						kind: 'copy',
						codeBlockIndex: context.codeBlockIndex,
						copyKind: ChatCopyKind.Toolbar,
						copiedCharacters: context.code.length,
						totalCharacters: context.code.length,
						copiedText: context.code,
						copiedLines: context.code.split('\n').length,
						languageId: context.languageId,
						totalLines: context.code.split('\n').length,
						modelId: request?.modelId ?? ''
					}
				});

				const codeBlockInfo = context.element.model.codeBlockInfos?.at(context.codeBlockIndex);
				aiEditTelemetryService.handleCodeAccepted({
					acceptanceMethod: 'copyButton',
					suggestionId: codeBlockInfo?.suggestionId,
					editDeltaInfo: EditDeltaInfo.fromText(context.code),
					feature: 'sideBarChat',
					languageId: context.languageId,
					modeId: context.element.model.request?.modeInfo?.modeId,
					modelId: request?.modelId,
					presentation: 'codeBlock',
					applyCodeBlockSuggestionId: undefined,
					source: undefined,
				});
			}
		}
	});

	CopyAction?.addImplementation(50000, 'chat-codeblock', (accessor) => {
		// get active code editor
		const editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (!editor) {
			return false;
		}

		const editorModel = editor.getModel();
		if (!editorModel) {
			return false;
		}

		const context = getContextFromEditor(editor, accessor);
		if (!context) {
			return false;
		}

		const noSelection = editor.getSelections()?.length === 1 && editor.getSelection()?.isEmpty();
		const copiedText = noSelection ?
			editorModel.getValue() :
			editor.getSelections()?.reduce((acc, selection) => acc + editorModel.getValueInRange(selection), '') ?? '';
		const totalCharacters = editorModel.getValueLength();

		// Report copy to extensions
		const chatService = accessor.get(IChatService);
		const aiEditTelemetryService = accessor.get(IAiEditTelemetryService);
		const element = context.element as IChatResponseViewModel | undefined;
		if (isResponseVM(element)) {
			const requestId = element.requestId;
			const request = element.session.getItems().find(item => item.id === requestId && isRequestVM(item)) as IChatRequestViewModel | undefined;
			chatService.notifyUserAction({
				agentId: element.agent?.id,
				command: element.slashCommand?.name,
				sessionResource: element.sessionResource,
				requestId: element.requestId,
				result: element.result,
				action: {
					kind: 'copy',
					codeBlockIndex: context.codeBlockIndex,
					copyKind: ChatCopyKind.Action,
					copiedText,
					copiedCharacters: copiedText.length,
					totalCharacters,
					languageId: context.languageId,
					totalLines: context.code.split('\n').length,
					copiedLines: copiedText.split('\n').length,
					modelId: request?.modelId ?? ''
				}
			});

			const codeBlockInfo = element.model.codeBlockInfos?.at(context.codeBlockIndex);
			aiEditTelemetryService.handleCodeAccepted({
				acceptanceMethod: 'copyManual',
				suggestionId: codeBlockInfo?.suggestionId,
				editDeltaInfo: EditDeltaInfo.fromText(copiedText),
				feature: 'sideBarChat',
				languageId: context.languageId,
				modeId: element.model.request?.modeInfo?.modeId,
				modelId: request?.modelId,
				presentation: 'codeBlock',
				applyCodeBlockSuggestionId: undefined,
				source: undefined,
			});
		}

		// Copy full cell if no selection, otherwise fall back on normal editor implementation
		if (noSelection) {
			accessor.get(IClipboardService).writeText(context.code);
			return true;
		}

		return false;
	});

	registerAction2(class SmartApplyInEditorAction extends ChatCodeBlockAction {

		private operation: ApplyCodeBlockOperation | undefined;

		constructor() {
			super({
				id: APPLY_IN_EDITOR_ID,
				title: localize2('interactive.applyInEditor.label', "Apply in Editor"),
				precondition: ChatContextKeys.enabled,
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.gitPullRequestGoToChanges,

				menu: [
					{
						id: MenuId.ChatCodeBlock,
						group: 'navigation',
						when: ContextKeyExpr.and(
							...shellLangIds.map(e => ContextKeyExpr.notEquals(EditorContextKeys.languageId.key, e))
						),
						order: 10
					},
					{
						id: MenuId.ChatCodeBlock,
						when: ContextKeyExpr.or(
							...shellLangIds.map(e => ContextKeyExpr.equals(EditorContextKeys.languageId.key, e))
						)
					},
				],
				keybinding: {
					when: ContextKeyExpr.or(ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inChatInput.negate()), accessibleViewInCodeBlock),
					primary: KeyMod.CtrlCmd | KeyCode.Enter,
					mac: { primary: KeyMod.WinCtrl | KeyCode.Enter },
					weight: KeybindingWeight.ExternalExtension + 1
				},
			});
		}

		override runWithContext(accessor: ServicesAccessor, context: ICodeBlockActionContext) {
			if (!this.operation) {
				this.operation = accessor.get(IInstantiationService).createInstance(ApplyCodeBlockOperation);
			}
			return this.operation.run(context);
		}
	});

	registerAction2(class InsertAtCursorAction extends ChatCodeBlockAction {
		constructor() {
			super({
				id: 'workbench.action.chat.insertCodeBlock',
				title: localize2('interactive.insertCodeBlock.label', "Insert At Cursor"),
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
				icon: Codicon.insert,
				menu: [{
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.location.notEqualsTo(ChatAgentLocation.Terminal)),
					order: 20
				}, {
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					when: ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.location.isEqualTo(ChatAgentLocation.Terminal)),
					isHiddenByDefault: true,
					order: 20
				}],
				keybinding: {
					when: ContextKeyExpr.or(ContextKeyExpr.and(ChatContextKeys.inChatSession, ChatContextKeys.inChatInput.negate()), accessibleViewInCodeBlock),
					primary: KeyMod.CtrlCmd | KeyCode.Enter,
					mac: { primary: KeyMod.WinCtrl | KeyCode.Enter },
					weight: KeybindingWeight.ExternalExtension + 1
				},
			});
		}

		override runWithContext(accessor: ServicesAccessor, context: ICodeBlockActionContext) {
			const operation = accessor.get(IInstantiationService).createInstance(InsertCodeBlockOperation);
			return operation.run(context);
		}
	});

	registerAction2(class InsertIntoNewFileAction extends ChatCodeBlockAction {
		constructor() {
			super({
				id: 'workbench.action.chat.insertIntoNewFile',
				title: localize2('interactive.insertIntoNewFile.label', "Insert into New File"),
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
				icon: Codicon.newFile,
				menu: {
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					isHiddenByDefault: true,
					order: 40,
				}
			});
		}

		override async runWithContext(accessor: ServicesAccessor, context: ICodeBlockActionContext) {
			if (isResponseFiltered(context)) {
				// When run from command palette
				return;
			}

			const editorService = accessor.get(IEditorService);
			const chatService = accessor.get(IChatService);
			const aiEditTelemetryService = accessor.get(IAiEditTelemetryService);

			editorService.openEditor({ contents: context.code, languageId: context.languageId, resource: undefined } satisfies IUntitledTextResourceEditorInput);

			if (isResponseVM(context.element)) {
				const requestId = context.element.requestId;
				const request = context.element.session.getItems().find(item => item.id === requestId && isRequestVM(item)) as IChatRequestViewModel | undefined;
				chatService.notifyUserAction({
					agentId: context.element.agent?.id,
					command: context.element.slashCommand?.name,
					sessionResource: context.element.sessionResource,
					requestId: context.element.requestId,
					result: context.element.result,
					action: {
						kind: 'insert',
						codeBlockIndex: context.codeBlockIndex,
						totalCharacters: context.code.length,
						newFile: true,
						totalLines: context.code.split('\n').length,
						languageId: context.languageId,
						modelId: request?.modelId ?? ''
					}
				});

				const codeBlockInfo = context.element.model.codeBlockInfos?.at(context.codeBlockIndex);

				aiEditTelemetryService.handleCodeAccepted({
					acceptanceMethod: 'insertInNewFile',
					suggestionId: codeBlockInfo?.suggestionId,
					editDeltaInfo: EditDeltaInfo.fromText(context.code),
					feature: 'sideBarChat',
					languageId: context.languageId,
					modeId: context.element.model.request?.modeInfo?.modeId,
					modelId: request?.modelId,
					presentation: 'codeBlock',
					applyCodeBlockSuggestionId: undefined,
					source: undefined,
				});
			}
		}
	});

	registerAction2(class RunInTerminalAction extends ChatCodeBlockAction {
		constructor() {
			super({
				id: 'workbench.action.chat.runInTerminal',
				title: localize2('interactive.runInTerminal.label', "Insert into Terminal"),
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
				icon: Codicon.terminal,
				menu: [{
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					when: ContextKeyExpr.and(
						ChatContextKeys.inChatSession,
						ContextKeyExpr.or(...shellLangIds.map(e => ContextKeyExpr.equals(EditorContextKeys.languageId.key, e)))
					),
				},
				{
					id: MenuId.ChatCodeBlock,
					group: 'navigation',
					isHiddenByDefault: true,
					when: ContextKeyExpr.and(
						ChatContextKeys.inChatSession,
						...shellLangIds.map(e => ContextKeyExpr.notEquals(EditorContextKeys.languageId.key, e))
					)
				}],
				keybinding: [{
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter,
					mac: {
						primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Enter
					},
					weight: KeybindingWeight.EditorContrib,
					when: ContextKeyExpr.or(ChatContextKeys.inChatSession, accessibleViewInCodeBlock),
				}]
			});
		}

		override async runWithContext(accessor: ServicesAccessor, context: ICodeBlockActionContext) {
			if (isResponseFiltered(context)) {
				// When run from command palette
				return;
			}

			const chatService = accessor.get(IChatService);
			const terminalService = accessor.get(ITerminalService);
			const editorService = accessor.get(IEditorService);
			const terminalEditorService = accessor.get(ITerminalEditorService);
			const terminalGroupService = accessor.get(ITerminalGroupService);

			let terminal = await terminalService.getActiveOrCreateInstance();

			// isFeatureTerminal = debug terminal or task terminal
			const unusableTerminal = terminal.xterm?.isStdinDisabled || terminal.shellLaunchConfig.isFeatureTerminal;
			terminal = unusableTerminal ? await terminalService.createTerminal() : terminal;

			terminalService.setActiveInstance(terminal);
			await terminal.focusWhenReady(true);
			if (terminal.target === TerminalLocation.Editor) {
				const existingEditors = editorService.findEditors(terminal.resource);
				terminalEditorService.openEditor(terminal, { viewColumn: existingEditors?.[0].groupId });
			} else {
				terminalGroupService.showPanel(true);
			}

			terminal.runCommand(context.code, false);

			if (isResponseVM(context.element)) {
				chatService.notifyUserAction({
					agentId: context.element.agent?.id,
					command: context.element.slashCommand?.name,
					sessionResource: context.element.sessionResource,
					requestId: context.element.requestId,
					result: context.element.result,
					action: {
						kind: 'runInTerminal',
						codeBlockIndex: context.codeBlockIndex,
						languageId: context.languageId,
					}
				});
			}
		}
	});

	function navigateCodeBlocks(accessor: ServicesAccessor, reverse?: boolean): void {
		const codeEditorService = accessor.get(ICodeEditorService);
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = chatWidgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}

		const editor = codeEditorService.getFocusedCodeEditor();
		const editorUri = editor?.getModel()?.uri;
		const curCodeBlockInfo = editorUri ? widget.getCodeBlockInfoForEditor(editorUri) : undefined;
		const focused = !widget.inputEditor.hasWidgetFocus() && widget.getFocus();
		const focusedResponse = isResponseVM(focused) ? focused : undefined;

		const elementId = curCodeBlockInfo?.elementId;
		const element = elementId ? widget.viewModel?.getItems().find(item => item.id === elementId) : undefined;
		const currentResponse = element ??
			(focusedResponse ?? widget.viewModel?.getItems().reverse().find((item): item is IChatResponseViewModel => isResponseVM(item)));
		if (!currentResponse || !isResponseVM(currentResponse)) {
			return;
		}

		widget.reveal(currentResponse);
		const responseCodeblocks = widget.getCodeBlockInfosForResponse(currentResponse);
		const focusIdx = curCodeBlockInfo ?
			(curCodeBlockInfo.codeBlockIndex + (reverse ? -1 : 1) + responseCodeblocks.length) % responseCodeblocks.length :
			reverse ? responseCodeblocks.length - 1 : 0;

		responseCodeblocks[focusIdx]?.focus();
	}

	registerAction2(class NextCodeBlockAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.nextCodeBlock',
				title: localize2('interactive.nextCodeBlock.label', "Next Code Block"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageDown,
					mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageDown, },
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateCodeBlocks(accessor);
		}
	});

	registerAction2(class PreviousCodeBlockAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.chat.previousCodeBlock',
				title: localize2('interactive.previousCodeBlock.label', "Previous Code Block"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageUp,
					mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageUp, },
					weight: KeybindingWeight.WorkbenchContrib,
					when: ChatContextKeys.inChatSession,
				},
				precondition: ChatContextKeys.enabled,
				f1: true,
				category: CHAT_CATEGORY,
			});
		}

		run(accessor: ServicesAccessor, ...args: unknown[]) {
			navigateCodeBlocks(accessor, true);
		}
	});
}

function getContextFromEditor(editor: ICodeEditor, accessor: ServicesAccessor): ICodeBlockActionContext | undefined {
	const chatWidgetService = accessor.get(IChatWidgetService);
	const chatCodeBlockContextProviderService = accessor.get(IChatCodeBlockContextProviderService);
	const model = editor.getModel();
	if (!model) {
		return;
	}

	const widget = chatWidgetService.lastFocusedWidget;
	const codeBlockInfo = widget?.getCodeBlockInfoForEditor(model.uri);
	if (!codeBlockInfo) {
		for (const provider of chatCodeBlockContextProviderService.providers) {
			const context = provider.getCodeBlockContext(editor);
			if (context) {
				return context;
			}
		}
		return;
	}

	const element = widget?.viewModel?.getItems().find(item => item.id === codeBlockInfo.elementId);
	return {
		element,
		codeBlockIndex: codeBlockInfo.codeBlockIndex,
		code: editor.getValue(),
		languageId: editor.getModel()!.getLanguageId(),
		codemapperUri: codeBlockInfo.codemapperUri,
		chatSessionResource: codeBlockInfo.chatSessionResource,
	};
}

export function registerChatCodeCompareBlockActions() {

	abstract class ChatCompareCodeBlockAction extends Action2 {
		run(accessor: ServicesAccessor, ...args: unknown[]) {
			const context = args[0];
			if (!isCodeCompareBlockActionContext(context)) {
				return;
				// TODO@jrieken derive context
			}

			return this.runWithContext(accessor, context);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		abstract runWithContext(accessor: ServicesAccessor, context: ICodeCompareBlockActionContext): any;
	}

	registerAction2(class ApplyEditsCompareBlockAction extends ChatCompareCodeBlockAction {
		constructor() {
			super({
				id: 'workbench.action.chat.applyCompareEdits',
				title: localize2('interactive.compare.apply', "Apply Edits"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.gitPullRequestGoToChanges,
				precondition: ContextKeyExpr.and(EditorContextKeys.hasChanges, ChatContextKeys.editApplied.negate()),
				menu: {
					id: MenuId.ChatCompareBlock,
					group: 'navigation',
					order: 1,
				}
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async runWithContext(accessor: ServicesAccessor, context: ICodeCompareBlockActionContext): Promise<any> {

			const instaService = accessor.get(IInstantiationService);
			const editorService = accessor.get(ICodeEditorService);

			const item = context.edit;
			const response = context.element;

			if (item.state?.applied) {
				// already applied
				return false;
			}

			if (!response.response.value.includes(item)) {
				// bogous item
				return false;
			}

			const firstEdit = item.edits[0]?.[0];
			if (!firstEdit) {
				return false;
			}
			const textEdits = AsyncIterableObject.fromArray(item.edits);

			const editorToApply = await editorService.openCodeEditor({ resource: item.uri }, null);
			if (editorToApply) {
				editorToApply.revealLineInCenterIfOutsideViewport(firstEdit.range.startLineNumber);
				instaService.invokeFunction(reviewEdits, editorToApply, textEdits, CancellationToken.None, undefined);
				response.setEditApplied(item, 1);
				return true;
			}
			return false;
		}
	});

	registerAction2(class DiscardEditsCompareBlockAction extends ChatCompareCodeBlockAction {
		constructor() {
			super({
				id: 'workbench.action.chat.discardCompareEdits',
				title: localize2('interactive.compare.discard', "Discard Edits"),
				f1: false,
				category: CHAT_CATEGORY,
				icon: Codicon.trash,
				precondition: ContextKeyExpr.and(EditorContextKeys.hasChanges, ChatContextKeys.editApplied.negate()),
				menu: {
					id: MenuId.ChatCompareBlock,
					group: 'navigation',
					order: 2,
				}
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async runWithContext(accessor: ServicesAccessor, context: ICodeCompareBlockActionContext): Promise<any> {
			const instaService = accessor.get(IInstantiationService);
			const editor = instaService.createInstance(DefaultChatTextEditor);
			editor.discard(context.element, context.edit);
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/actions/chatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/chatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isElectron } from '../../../../../base/common/platform.js';
import { dirname } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { UntitledTextEditorInput } from '../../../../services/untitled/common/untitledTextEditorInput.js';
import { FileEditorInput } from '../../../files/browser/editors/fileEditorInput.js';
import { NotebookEditorInput } from '../../../notebook/common/notebookEditorInput.js';
import { IChatContextPickService, IChatContextValueItem, IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPicker } from '../chatContextPickService.js';
import { IChatEditingService } from '../../common/chatEditingService.js';
import { IChatRequestToolEntry, IChatRequestToolSetEntry, IChatRequestVariableEntry, IImageVariableEntry, OmittedState, toToolSetVariableEntry, toToolVariableEntry } from '../../common/chatVariableEntries.js';
import { ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { IChatWidget } from '../chat.js';
import { imageToHash, isImage } from '../chatPasteProviders.js';
import { convertBufferToScreenshotVariable } from '../contrib/chatScreenshotContext.js';
import { ChatInstructionsPickerPick } from '../promptSyntax/attachInstructionsAction.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';


export class ChatContextContributions extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.contextContributions';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IChatContextPickService contextPickService: IChatContextPickService,
	) {
		super();

		// ###############################################################################################
		//
		// Default context picks/values which are "native" to chat. This is NOT the complete list
		// and feature area specific context, like for notebooks, problems, etc, should be contributed
		// by the feature area.
		//
		// ###############################################################################################

		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(ToolsContextPickerPick)));
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(ChatInstructionsPickerPick)));
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(OpenEditorContextValuePick)));
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(RelatedFilesContextPickerPick)));
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(ClipboardImageContextValuePick)));
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(ScreenshotContextValuePick)));
	}
}

class ToolsContextPickerPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';
	readonly label: string = localize('chatContext.tools', 'Tools...');
	readonly icon: ThemeIcon = Codicon.tools;
	readonly ordinal = -500;

	isEnabled(widget: IChatWidget): boolean {
		return !!widget.attachmentCapabilities.supportsToolAttachments;
	}

	asPicker(widget: IChatWidget): IChatContextPicker {

		type Pick = IChatContextPickerPickItem & { toolInfo: { ordinal: number; label: string } };
		const items: Pick[] = [];

		for (const [entry, enabled] of widget.input.selectedToolsModel.entriesMap.get()) {
			if (enabled) {
				if (entry instanceof ToolSet) {
					items.push({
						toolInfo: ToolDataSource.classify(entry.source),
						label: entry.referenceName,
						description: entry.description,
						asAttachment: (): IChatRequestToolSetEntry => toToolSetVariableEntry(entry)
					});
				} else {
					items.push({
						toolInfo: ToolDataSource.classify(entry.source),
						label: entry.toolReferenceName ?? entry.displayName,
						description: entry.userDescription ?? entry.modelDescription,
						asAttachment: (): IChatRequestToolEntry => toToolVariableEntry(entry)
					});
				}
			}
		}

		items.sort((a, b) => {
			let res = a.toolInfo.ordinal - b.toolInfo.ordinal;
			if (res === 0) {
				res = a.toolInfo.label.localeCompare(b.toolInfo.label);
			}
			if (res === 0) {
				res = a.label.localeCompare(b.label);
			}
			return res;
		});

		let lastGroupLabel: string | undefined;
		const picks: (IQuickPickSeparator | Pick)[] = [];

		for (const item of items) {
			if (lastGroupLabel !== item.toolInfo.label) {
				picks.push({ type: 'separator', label: item.toolInfo.label });
				lastGroupLabel = item.toolInfo.label;
			}
			picks.push(item);
		}

		return {
			placeholder: localize('chatContext.tools.placeholder', 'Select a tool'),
			picks: Promise.resolve(picks)
		};
	}


}



class OpenEditorContextValuePick implements IChatContextValueItem {

	readonly type = 'valuePick';
	readonly label: string = localize('chatContext.editors', 'Open Editors');
	readonly icon: ThemeIcon = Codicon.file;
	readonly ordinal = 800;

	constructor(
		@IEditorService private _editorService: IEditorService,
		@ILabelService private _labelService: ILabelService,
	) { }

	isEnabled(): Promise<boolean> | boolean {
		return this._editorService.editors.filter(e => e instanceof FileEditorInput || e instanceof DiffEditorInput || e instanceof UntitledTextEditorInput).length > 0;
	}

	async asAttachment(): Promise<IChatRequestVariableEntry[]> {
		const result: IChatRequestVariableEntry[] = [];
		for (const editor of this._editorService.editors) {
			if (!(editor instanceof FileEditorInput || editor instanceof DiffEditorInput || editor instanceof UntitledTextEditorInput || editor instanceof NotebookEditorInput)) {
				continue;
			}
			const uri = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
			if (!uri) {
				continue;
			}
			result.push({
				kind: 'file',
				id: uri.toString(),
				value: uri,
				name: this._labelService.getUriBasenameLabel(uri),
			});
		}
		return result;
	}

}

class RelatedFilesContextPickerPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';

	readonly label: string = localize('chatContext.relatedFiles', 'Related Files');
	readonly icon: ThemeIcon = Codicon.sparkle;
	readonly ordinal = 300;

	constructor(
		@IChatEditingService private readonly _chatEditingService: IChatEditingService,
		@ILabelService private readonly _labelService: ILabelService,
	) { }

	isEnabled(widget: IChatWidget): boolean {
		return this._chatEditingService.hasRelatedFilesProviders() && (Boolean(widget.getInput()) || widget.attachmentModel.fileAttachments.length > 0);
	}

	asPicker(widget: IChatWidget): IChatContextPicker {

		const picks = (async () => {
			const chatSessionResource = widget.viewModel?.sessionResource;
			if (!chatSessionResource) {
				return [];
			}
			const relatedFiles = await this._chatEditingService.getRelatedFiles(chatSessionResource, widget.getInput(), widget.attachmentModel.fileAttachments, CancellationToken.None);
			if (!relatedFiles) {
				return [];
			}
			const attachments = widget.attachmentModel.getAttachmentIDs();
			return this._chatEditingService.getRelatedFiles(chatSessionResource, widget.getInput(), widget.attachmentModel.fileAttachments, CancellationToken.None)
				.then((files) => (files ?? []).reduce<(IChatContextPickerPickItem | IQuickPickSeparator)[]>((acc, cur) => {
					acc.push({ type: 'separator', label: cur.group });
					for (const file of cur.files) {
						const label = this._labelService.getUriBasenameLabel(file.uri);
						acc.push({
							label: label,
							description: this._labelService.getUriLabel(dirname(file.uri), { relative: true }),
							disabled: attachments.has(file.uri.toString()),
							asAttachment: () => {
								return {
									kind: 'file',
									id: file.uri.toString(),
									value: file.uri,
									name: label,
									omittedState: OmittedState.NotOmitted
								};
							}
						});
					}
					return acc;
				}, []));
		})();

		return {
			placeholder: localize('relatedFiles', 'Add related files to your working set'),
			picks,
		};
	}
}


class ClipboardImageContextValuePick implements IChatContextValueItem {
	readonly type = 'valuePick';
	readonly label = localize('imageFromClipboard', 'Image from Clipboard');
	readonly icon = Codicon.fileMedia;

	constructor(
		@IClipboardService private readonly _clipboardService: IClipboardService,
	) { }

	async isEnabled(widget: IChatWidget) {
		if (!widget.attachmentCapabilities.supportsImageAttachments) {
			return false;
		}
		if (!widget.input.selectedLanguageModel?.metadata.capabilities?.vision) {
			return false;
		}
		const imageData = await this._clipboardService.readImage();
		return isImage(imageData);
	}

	async asAttachment(): Promise<IImageVariableEntry> {
		const fileBuffer = await this._clipboardService.readImage();
		return {
			id: await imageToHash(fileBuffer),
			name: localize('pastedImage', 'Pasted Image'),
			fullName: localize('pastedImage', 'Pasted Image'),
			value: fileBuffer,
			kind: 'image',
		};
	}
}

export class TerminalContext implements IChatContextValueItem {

	readonly type = 'valuePick';
	readonly icon = Codicon.terminal;
	readonly label = localize('terminal', 'Terminal');
	constructor(private readonly _resource: URI, @ITerminalService private readonly _terminalService: ITerminalService) {

	}
	isEnabled(widget: IChatWidget) {
		const terminal = this._terminalService.getInstanceFromResource(this._resource);
		return !!widget.attachmentCapabilities.supportsTerminalAttachments && terminal?.isDisposed === false;
	}
	async asAttachment(widget: IChatWidget): Promise<IChatRequestVariableEntry | undefined> {
		const terminal = this._terminalService.getInstanceFromResource(this._resource);
		if (!terminal) {
			return;
		}
		const params = new URLSearchParams(this._resource.query);
		const command = terminal.capabilities.get(TerminalCapability.CommandDetection)?.commands.find(cmd => cmd.id === params.get('command'));
		if (!command) {
			return;
		}
		const attachment: IChatRequestVariableEntry = {
			kind: 'terminalCommand',
			id: `terminalCommand:${Date.now()}}`,
			value: this.asValue(command),
			name: command.command,
			command: command.command,
			output: command.getOutput(),
			exitCode: command.exitCode,
			resource: this._resource
		};
		const cleanup = new DisposableStore();
		let disposed = false;
		const disposeCleanup = () => {
			if (disposed) {
				return;
			}
			disposed = true;
			cleanup.dispose();
		};
		cleanup.add(widget.attachmentModel.onDidChange(e => {
			if (e.deleted.includes(attachment.id)) {
				disposeCleanup();
			}
		}));
		cleanup.add(terminal.onDisposed(() => {
			widget.attachmentModel.delete(attachment.id);
			widget.refreshParsedInput();
			disposeCleanup();
		}));
		return attachment;
	}

	private asValue(command: ITerminalCommand): string {
		let value = `Command: ${command.command}`;
		const output = command.getOutput();
		if (output) {
			value += `\nOutput:\n${output}`;
		}
		if (typeof command.exitCode === 'number') {
			value += `\nExit Code: ${command.exitCode}`;
		}
		return value;
	}
}

class ScreenshotContextValuePick implements IChatContextValueItem {

	readonly type = 'valuePick';
	readonly icon = Codicon.deviceCamera;
	readonly label = (isElectron
		? localize('chatContext.attachScreenshot.labelElectron.Window', 'Screenshot Window')
		: localize('chatContext.attachScreenshot.labelWeb', 'Screenshot'));

	constructor(
		@IHostService private readonly _hostService: IHostService,
	) { }

	async isEnabled(widget: IChatWidget) {
		return !!widget.attachmentCapabilities.supportsImageAttachments && !!widget.input.selectedLanguageModel?.metadata.capabilities?.vision;
	}

	async asAttachment(): Promise<IChatRequestVariableEntry | undefined> {
		const blob = await this._hostService.getScreenshot();
		return blob && convertBufferToScreenshotVariable(blob);
	}
}
```

--------------------------------------------------------------------------------

````

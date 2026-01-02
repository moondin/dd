---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 466
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 466 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ChatViewId, IChatWidgetService } from '../../../chat/browser/chat.js';
import { ChatContextKeys } from '../../../chat/common/chatContextKeys.js';
import { IChatService } from '../../../chat/common/chatService.js';
import { LocalChatSessionUri } from '../../../chat/common/chatUri.js';
import { ChatAgentLocation, ChatConfiguration } from '../../../chat/common/constants.js';
import { AbstractInline1ChatAction } from '../../../inlineChat/browser/inlineChatActions.js';
import { isDetachedTerminalInstance, ITerminalChatService, ITerminalEditorService, ITerminalGroupService, ITerminalInstance, ITerminalService } from '../../../terminal/browser/terminal.js';
import { registerActiveXtermAction } from '../../../terminal/browser/terminalActions.js';
import { TerminalContextMenuGroup } from '../../../terminal/browser/terminalMenus.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { MENU_TERMINAL_CHAT_WIDGET_STATUS, TerminalChatCommandId, TerminalChatContextKeys } from './terminalChat.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { getIconId } from '../../../terminal/browser/terminalIcon.js';
import { TerminalChatController } from './terminalChatController.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { isString } from '../../../../../base/common/types.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IPreferencesService, IOpenSettingsOptions } from '../../../../services/preferences/common/preferences.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalChatAgentToolsSettingId } from '../../chatAgentTools/common/terminalChatAgentToolsConfiguration.js';

registerActiveXtermAction({
	id: TerminalChatCommandId.Start,
	title: localize2('startChat', 'Open Inline Chat'),
	category: localize2('terminalCategory', "Terminal"),
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.KeyI,
		when: ContextKeyExpr.and(TerminalContextKeys.focusInAny),
		// HACK: Force weight to be higher than the extension contributed keybinding to override it until it gets replaced
		weight: KeybindingWeight.ExternalExtension + 1, // KeybindingWeight.WorkbenchContrib,
	},
	f1: true,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.hasChatAgent
	),
	menu: {
		id: MenuId.TerminalInstanceContext,
		group: TerminalContextMenuGroup.Chat,
		order: 2,
		when: ChatContextKeys.enabled
	},
	run: (_xterm, _accessor, activeInstance, opts?: unknown) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}

		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		if (!contr) {
			return;
		}

		if (opts) {
			function isValidOptionsObject(obj: unknown): obj is { query: string; isPartialQuery?: boolean } {
				return typeof obj === 'object' && obj !== null && 'query' in obj && isString(obj.query);
			}
			opts = isString(opts) ? { query: opts } : opts;
			if (isValidOptionsObject(opts)) {
				contr.updateInput(opts.query, false);
				if (!opts.isPartialQuery) {
					contr.terminalChatWidget?.acceptInput();
				}
			}

		}

		contr.terminalChatWidget?.reveal();
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.Close,
	title: localize2('closeChat', 'Close'),
	category: AbstractInline1ChatAction.category,
	keybinding: {
		primary: KeyCode.Escape,
		when: ContextKeyExpr.and(
			ContextKeyExpr.or(TerminalContextKeys.focus, TerminalChatContextKeys.focused),
			TerminalChatContextKeys.visible
		),
		weight: KeybindingWeight.WorkbenchContrib,
	},
	menu: [{
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 2,
	}],
	icon: Codicon.close,
	f1: true,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		TerminalChatContextKeys.visible,
	),
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.terminalChatWidget?.clear();
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.RunCommand,
	title: localize2('runCommand', 'Run Chat Command'),
	shortTitle: localize2('run', 'Run'),
	category: AbstractInline1ChatAction.category,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
		TerminalChatContextKeys.responseContainsCodeBlock,
		TerminalChatContextKeys.responseContainsMultipleCodeBlocks.negate()
	),
	icon: Codicon.play,
	keybinding: {
		when: TerminalChatContextKeys.requestActive.negate(),
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyCode.Enter,
	},
	menu: {
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 0,
		when: ContextKeyExpr.and(TerminalChatContextKeys.responseContainsCodeBlock, TerminalChatContextKeys.responseContainsMultipleCodeBlocks.negate(), TerminalChatContextKeys.requestActive.negate())
	},
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.terminalChatWidget?.acceptCommand(true);
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.RunFirstCommand,
	title: localize2('runFirstCommand', 'Run First Chat Command'),
	shortTitle: localize2('runFirst', 'Run First'),
	category: AbstractInline1ChatAction.category,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
		TerminalChatContextKeys.responseContainsMultipleCodeBlocks
	),
	icon: Codicon.play,
	keybinding: {
		when: TerminalChatContextKeys.requestActive.negate(),
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyCode.Enter,
	},
	menu: {
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 0,
		when: ContextKeyExpr.and(TerminalChatContextKeys.responseContainsMultipleCodeBlocks, TerminalChatContextKeys.requestActive.negate())
	},
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.terminalChatWidget?.acceptCommand(true);
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.InsertCommand,
	title: localize2('insertCommand', 'Insert Chat Command'),
	shortTitle: localize2('insert', 'Insert'),
	category: AbstractInline1ChatAction.category,
	icon: Codicon.insert,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
		TerminalChatContextKeys.responseContainsCodeBlock,
		TerminalChatContextKeys.responseContainsMultipleCodeBlocks.negate()
	),
	keybinding: {
		when: TerminalChatContextKeys.requestActive.negate(),
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.Alt | KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.Enter | KeyMod.Alt]
	},
	menu: {
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 1,
		when: ContextKeyExpr.and(TerminalChatContextKeys.responseContainsCodeBlock, TerminalChatContextKeys.responseContainsMultipleCodeBlocks.negate(), TerminalChatContextKeys.requestActive.negate())
	},
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.terminalChatWidget?.acceptCommand(false);
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.InsertFirstCommand,
	title: localize2('insertFirstCommand', 'Insert First Chat Command'),
	shortTitle: localize2('insertFirst', 'Insert First'),
	category: AbstractInline1ChatAction.category,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
		TerminalChatContextKeys.responseContainsMultipleCodeBlocks
	),
	keybinding: {
		when: TerminalChatContextKeys.requestActive.negate(),
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.Alt | KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.Enter | KeyMod.Alt]
	},
	menu: {
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 1,
		when: ContextKeyExpr.and(TerminalChatContextKeys.responseContainsMultipleCodeBlocks, TerminalChatContextKeys.requestActive.negate())
	},
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.terminalChatWidget?.acceptCommand(false);
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.RerunRequest,
	title: localize2('chat.rerun.label', "Rerun Request"),
	f1: false,
	icon: Codicon.refresh,
	category: AbstractInline1ChatAction.category,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
	),
	keybinding: {
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyCode.KeyR,
		when: TerminalChatContextKeys.focused
	},
	menu: {
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: '0_main',
		order: 5,
		when: ContextKeyExpr.and(TerminalChatContextKeys.inputHasText.toNegated(), TerminalChatContextKeys.requestActive.negate())
	},
	run: async (_xterm, _accessor, activeInstance) => {
		const chatService = _accessor.get(IChatService);
		const chatWidgetService = _accessor.get(IChatWidgetService);
		const contr = TerminalChatController.activeChatController;
		const model = contr?.terminalChatWidget?.inlineChatWidget.chatWidget.viewModel?.model;
		if (!model) {
			return;
		}

		const lastRequest = model.getRequests().at(-1);
		if (lastRequest) {
			const widget = chatWidgetService.getWidgetBySessionResource(model.sessionResource);
			await chatService.resendRequest(lastRequest, {
				noCommandDetection: false,
				attempt: lastRequest.attempt + 1,
				location: ChatAgentLocation.Terminal,
				userSelectedModelId: widget?.input.currentLanguageModel
			});
		}
	}
});

registerActiveXtermAction({
	id: TerminalChatCommandId.ViewInChat,
	title: localize2('viewInChat', 'View in Chat'),
	category: AbstractInline1ChatAction.category,
	precondition: ContextKeyExpr.and(
		ChatContextKeys.enabled,
		ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
		TerminalChatContextKeys.requestActive.negate(),
	),
	icon: Codicon.chatSparkle,
	menu: [{
		id: MENU_TERMINAL_CHAT_WIDGET_STATUS,
		group: 'zzz',
		order: 1,
		isHiddenByDefault: true,
		when: ContextKeyExpr.and(TerminalChatContextKeys.responseContainsCodeBlock, TerminalChatContextKeys.requestActive.negate()),
	}],
	run: (_xterm, _accessor, activeInstance) => {
		if (isDetachedTerminalInstance(activeInstance)) {
			return;
		}
		const contr = TerminalChatController.activeChatController || TerminalChatController.get(activeInstance);
		contr?.viewInChat();
	}
});

registerAction2(class ShowChatTerminalsAction extends Action2 {
	constructor() {
		super({
			id: TerminalChatCommandId.ViewHiddenChatTerminals,
			title: localize2('viewHiddenChatTerminals', 'View Hidden Chat Terminals'),
			category: localize2('terminalCategory2', 'Terminal'),
			f1: true,
			precondition: ContextKeyExpr.and(TerminalChatContextKeys.hasHiddenChatTerminals, ChatContextKeys.enabled),
			menu: [{
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(TerminalChatContextKeys.hasHiddenChatTerminals, ContextKeyExpr.equals('view', ChatViewId)),
				group: 'terminal',
				order: 0,
				isHiddenByDefault: true
			}]
		});
	}

	run(accessor: ServicesAccessor): void {
		const terminalService = accessor.get(ITerminalService);
		const groupService = accessor.get(ITerminalGroupService);
		const editorService = accessor.get(ITerminalEditorService);
		const terminalChatService = accessor.get(ITerminalChatService);
		const quickInputService = accessor.get(IQuickInputService);
		const instantiationService = accessor.get(IInstantiationService);
		const chatService = accessor.get(IChatService);

		const visible = new Set<ITerminalInstance>([...groupService.instances, ...editorService.instances]);
		const toolInstances = terminalChatService.getToolSessionTerminalInstances();

		if (toolInstances.length === 0) {
			return;
		}

		const all = new Map<number, ITerminalInstance>();

		for (const i of toolInstances) {
			if (!visible.has(i)) {
				all.set(i.instanceId, i);
			}
		}

		const items: IQuickPickItem[] = [];
		interface IItemMeta {
			label: string;
			description: string | undefined;
			detail: string | undefined;
			id: string;
		}
		const lastCommandLocalized = (command: string) => localize2('chatTerminal.lastCommand', 'Last: {0}', command).value;

		const metas: IItemMeta[] = [];
		for (const instance of all.values()) {
			const iconId = instantiationService.invokeFunction(getIconId, instance);
			const label = `$(${iconId}) ${instance.title}`;
			const lastCommand = instance.capabilities.get(TerminalCapability.CommandDetection)?.commands.at(-1)?.command;

			// Get the chat session title
			const chatSessionId = terminalChatService.getChatSessionIdForInstance(instance);
			let chatSessionTitle: string | undefined;
			if (chatSessionId) {
				const sessionUri = LocalChatSessionUri.forSession(chatSessionId);
				// Try to get title from active session first, then fall back to persisted title
				chatSessionTitle = chatService.getSession(sessionUri)?.title || chatService.getPersistedSessionTitle(sessionUri);
			}

			let description: string | undefined;
			if (chatSessionTitle) {
				description = `${chatSessionTitle}`;
			}

			metas.push({
				label,
				description,
				detail: lastCommand ? lastCommandLocalized(lastCommand) : undefined,
				id: String(instance.instanceId),
			});
		}

		for (const m of metas) {
			items.push({
				label: m.label,
				description: m.description,
				detail: m.detail,
				id: m.id
			});
		}

		const qp = quickInputService.createQuickPick<IQuickPickItem>();
		qp.placeholder = localize2('selectChatTerminal', 'Select a chat terminal to show and focus').value;
		qp.items = items;
		qp.canSelectMany = false;
		qp.title = localize2('showChatTerminals.title', 'Chat Terminals').value;
		qp.matchOnDescription = true;
		qp.matchOnDetail = true;
		const qpDisposables = new DisposableStore();
		qpDisposables.add(qp);
		qpDisposables.add(qp.onDidAccept(async () => {
			const sel = qp.selectedItems[0];
			if (sel) {
				const instance = all.get(Number(sel.id));
				if (instance) {
					terminalService.setActiveInstance(instance);
					await terminalService.revealTerminal(instance);
					qp.hide();
					terminalService.focusInstance(instance);
				} else {
					qp.hide();
				}
			} else {
				qp.hide();
			}
		}));
		qpDisposables.add(qp.onDidHide(() => {
			qpDisposables.dispose();
			qp.dispose();
		}));
		qp.show();
	}
});



KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: TerminalChatCommandId.FocusMostRecentChatTerminal,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ChatContextKeys.inChatSession,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyT,
	handler: async (accessor: ServicesAccessor) => {
		const terminalChatService = accessor.get(ITerminalChatService);
		const part = terminalChatService.getMostRecentProgressPart();
		if (!part) {
			return;
		}
		await part.focusTerminal();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: TerminalChatCommandId.FocusMostRecentChatTerminalOutput,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ChatContextKeys.inChatSession,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyO,
	handler: async (accessor: ServicesAccessor) => {
		const terminalChatService = accessor.get(ITerminalChatService);
		const part = terminalChatService.getMostRecentProgressPart();
		if (!part) {
			return;
		}
		await part.toggleOutputFromKeyboard();
	}
});

MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: TerminalChatCommandId.FocusMostRecentChatTerminal,
		title: localize('chat.focusMostRecentTerminal', 'Chat: Focus Most Recent Terminal'),
	},
	when: ChatContextKeys.inChatSession
});

MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: TerminalChatCommandId.FocusMostRecentChatTerminalOutput,
		title: localize('chat.focusMostRecentTerminalOutput', 'Chat: Focus Most Recent Terminal Output'),
	},
	when: ChatContextKeys.inChatSession
});


CommandsRegistry.registerCommand(TerminalChatCommandId.OpenTerminalSettingsLink, async (accessor, scopeRaw: string) => {
	const preferencesService = accessor.get(IPreferencesService);

	if (scopeRaw === 'global') {
		preferencesService.openSettings({
			query: `@id:${ChatConfiguration.GlobalAutoApprove}`
		});
	} else {
		const scope = parseInt(scopeRaw);
		const target = !isNaN(scope) ? scope as ConfigurationTarget : undefined;
		const options: IOpenSettingsOptions = {
			jsonEditor: true,
			revealSetting: {
				key: TerminalChatAgentToolsSettingId.AutoApprove,
			}
		};
		switch (target) {
			case ConfigurationTarget.APPLICATION: preferencesService.openApplicationSettings(options); break;
			case ConfigurationTarget.USER:
			case ConfigurationTarget.USER_LOCAL: preferencesService.openUserSettings(options); break;
			case ConfigurationTarget.USER_REMOTE: preferencesService.openRemoteSettings(options); break;
			case ConfigurationTarget.WORKSPACE:
			case ConfigurationTarget.WORKSPACE_FOLDER: preferencesService.openWorkspaceSettings(options); break;
			default: {
				// Fallback if something goes wrong
				preferencesService.openSettings({
					target: ConfigurationTarget.USER,
					query: `@id:${TerminalChatAgentToolsSettingId.AutoApprove}`,
				});
				break;
			}
		}

	}
});

CommandsRegistry.registerCommand(TerminalChatCommandId.DisableSessionAutoApproval, async (accessor, chatSessionId: string) => {
	const terminalChatService = accessor.get(ITerminalChatService);
	terminalChatService.setChatSessionAutoApproval(chatSessionId, false);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatController.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, type ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatCodeBlockContextProviderService, IChatWidgetService } from '../../../chat/browser/chat.js';
import { IChatService } from '../../../chat/common/chatService.js';
import { isDetachedTerminalInstance, ITerminalContribution, ITerminalInstance, ITerminalService, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { TerminalChatWidget } from './terminalChatWidget.js';
import type { ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import type { IChatModel } from '../../../chat/common/chatModel.js';
import { IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';

export class TerminalChatController extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.chat';

	static get(instance: ITerminalInstance): TerminalChatController | null {
		return instance.getContribution<TerminalChatController>(TerminalChatController.ID);
	}
	/**
	 * The controller for the currently focused chat widget. This is used to track action context since 'active terminals'
	 * are only tracked for non-detached terminal instanecs.
	 */
	static activeChatController?: TerminalChatController;

	/**
	 * The chat widget for the controller, this is lazy as we don't want to instantiate it until
	 * both it's required and xterm is ready.
	 */
	private _terminalChatWidget: Lazy<TerminalChatWidget> | undefined;

	/**
	 * The terminal chat widget for the controller, this will be undefined if xterm is not ready yet (ie. the
	 * terminal is still initializing). This wraps the inline chat widget.
	 */
	get terminalChatWidget(): TerminalChatWidget | undefined { return this._terminalChatWidget?.value; }

	private _lastResponseContent: string | undefined;
	get lastResponseContent(): string | undefined {
		return this._lastResponseContent;
	}

	get scopedContextKeyService(): IContextKeyService {
		return this._terminalChatWidget?.value.inlineChatWidget.scopedContextKeyService ?? this._contextKeyService;
	}

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IChatCodeBlockContextProviderService chatCodeBlockContextProviderService: IChatCodeBlockContextProviderService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();

		this._register(chatEntitlementService.onDidChangeSentiment(() => {
			if (chatEntitlementService.sentiment.hidden) {
				this._terminalChatWidget?.value.clear();
			}
		}));

		this._register(chatCodeBlockContextProviderService.registerProvider({
			getCodeBlockContext: (editor) => {
				if (!editor || !this._terminalChatWidget?.hasValue || !this.hasFocus()) {
					return;
				}
				return {
					element: editor,
					code: editor.getValue(),
					codeBlockIndex: 0,
					languageId: editor.getModel()!.getLanguageId(),
					chatSessionResource: this._terminalChatWidget.value.inlineChatWidget.chatWidget.viewModel?.sessionResource
				};
			}
		}, 'terminal'));
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._terminalChatWidget = new Lazy(() => {
			const chatWidget = this._register(this._instantiationService.createInstance(TerminalChatWidget, this._ctx.instance.domElement!, this._ctx.instance, xterm));
			this._register(chatWidget.focusTracker.onDidFocus(() => {
				TerminalChatController.activeChatController = this;
				if (!isDetachedTerminalInstance(this._ctx.instance)) {
					this._terminalService.setActiveInstance(this._ctx.instance);
				}
			}));
			this._register(chatWidget.focusTracker.onDidBlur(() => {
				TerminalChatController.activeChatController = undefined;
				this._ctx.instance.resetScrollbarVisibility();
			}));
			if (!this._ctx.instance.domElement) {
				throw new Error('FindWidget expected terminal DOM to be initialized');
			}
			return chatWidget;
		});
	}

	private _forcedPlaceholder: string | undefined = undefined;

	private _updatePlaceholder(): void {
		const inlineChatWidget = this._terminalChatWidget?.value.inlineChatWidget;
		if (inlineChatWidget) {
			inlineChatWidget.placeholder = this._getPlaceholderText();
		}
	}

	private _getPlaceholderText(): string {
		return this._forcedPlaceholder ?? '';
	}

	setPlaceholder(text: string): void {
		this._forcedPlaceholder = text;
		this._updatePlaceholder();
	}

	resetPlaceholder(): void {
		this._forcedPlaceholder = undefined;
		this._updatePlaceholder();
	}

	updateInput(text: string, selectAll = true): void {
		const widget = this._terminalChatWidget?.value.inlineChatWidget;
		if (widget) {
			widget.value = text;
			if (selectAll) {
				widget.selectAll();
			}
		}
	}

	focus(): void {
		this._terminalChatWidget?.value.focus();
	}

	hasFocus(): boolean {
		return this._terminalChatWidget?.rawValue?.hasFocus() ?? false;
	}

	async viewInChat(): Promise<void> {
		const chatModel = this.terminalChatWidget?.inlineChatWidget.chatWidget.viewModel?.model;
		if (chatModel) {
			await this._instantiationService.invokeFunction(moveToPanelChat, chatModel);
		}
		this._terminalChatWidget?.rawValue?.hide();
	}
}

async function moveToPanelChat(accessor: ServicesAccessor, model: IChatModel | undefined) {
	const chatService = accessor.get(IChatService);
	const chatWidgetService = accessor.get(IChatWidgetService);

	const widget = await chatWidgetService.revealWidget();

	if (widget && widget.viewModel && model) {
		for (const request of model.getRequests().slice()) {
			await chatService.adoptRequest(widget.viewModel.model.sessionResource, request);
		}
		widget.focusResponseItem();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatEnabler.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatEnabler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IChatAgentService } from '../../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../../chat/common/constants.js';
import { TerminalChatContextKeys } from './terminalChat.js';

export class TerminalChatEnabler {

	static Id = 'terminalChat.enabler';

	private readonly _ctxHasProvider: IContextKey<boolean>;

	private readonly _store = new DisposableStore();

	constructor(
		@IChatAgentService chatAgentService: IChatAgentService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		this._ctxHasProvider = TerminalChatContextKeys.hasChatAgent.bindTo(contextKeyService);
		this._store.add(Event.runAndSubscribe(chatAgentService.onDidChangeAgents, () => {
			const hasTerminalAgent = Boolean(chatAgentService.getDefaultAgent(ChatAgentLocation.Terminal));
			this._ctxHasProvider.set(hasTerminalAgent);
		}));
	}

	dispose() {
		this._ctxHasProvider.reset();
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableMap, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IChatTerminalToolProgressPart, ITerminalChatService, ITerminalInstance, ITerminalService } from '../../../terminal/browser/terminal.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IChatService } from '../../../chat/common/chatService.js';
import { TerminalChatContextKeys } from './terminalChat.js';
import { LocalChatSessionUri } from '../../../chat/common/chatUri.js';
import { isNumber, isString } from '../../../../../base/common/types.js';

const enum StorageKeys {
	ToolSessionMappings = 'terminalChat.toolSessionMappings',
	CommandIdMappings = 'terminalChat.commandIdMappings'
}


/**
 * Used to manage chat tool invocations and the underlying terminal instances they create/use.
 */
export class TerminalChatService extends Disposable implements ITerminalChatService {
	declare _serviceBrand: undefined;

	private readonly _terminalInstancesByToolSessionId = new Map<string, ITerminalInstance>();
	private readonly _toolSessionIdByTerminalInstance = new Map<ITerminalInstance, string>();
	private readonly _chatSessionIdByTerminalInstance = new Map<ITerminalInstance, string>();
	private readonly _terminalInstanceListenersByToolSessionId = this._register(new DisposableMap<string, IDisposable>());
	private readonly _chatSessionListenersByTerminalInstance = this._register(new DisposableMap<ITerminalInstance, IDisposable>());
	private readonly _onDidRegisterTerminalInstanceForToolSession = new Emitter<ITerminalInstance>();
	readonly onDidRegisterTerminalInstanceWithToolSession: Event<ITerminalInstance> = this._onDidRegisterTerminalInstanceForToolSession.event;
	private readonly _activeProgressParts = new Set<IChatTerminalToolProgressPart>();
	private _focusedProgressPart: IChatTerminalToolProgressPart | undefined;
	private _mostRecentProgressPart: IChatTerminalToolProgressPart | undefined;

	/**
	 * Pending mappings restored from storage that have not yet been matched to a live terminal
	 * instance (we match by persistentProcessId when it becomes available after reconnection).
	 * toolSessionId -> persistentProcessId
	 */
	private readonly _pendingRestoredMappings = new Map<string, number>();

	private readonly _hasToolTerminalContext: IContextKey<boolean>;
	private readonly _hasHiddenToolTerminalContext: IContextKey<boolean>;

	/**
	 * Tracks chat session IDs that have auto approval enabled for all commands. This is a temporary
	 * approval that lasts only for the duration of the session.
	 */
	private readonly _sessionAutoApprovalEnabled = new Set<string>();

	constructor(
		@ILogService private readonly _logService: ILogService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IChatService private readonly _chatService: IChatService,
	) {
		super();

		this._hasToolTerminalContext = TerminalChatContextKeys.hasChatTerminals.bindTo(this._contextKeyService);
		this._hasHiddenToolTerminalContext = TerminalChatContextKeys.hasHiddenChatTerminals.bindTo(this._contextKeyService);

		this._restoreFromStorage();
	}

	registerTerminalInstanceWithToolSession(terminalToolSessionId: string | undefined, instance: ITerminalInstance): void {
		if (!terminalToolSessionId) {
			this._logService.warn('Attempted to register a terminal instance with an undefined tool session ID');
			return;
		}
		this._terminalInstancesByToolSessionId.set(terminalToolSessionId, instance);
		this._toolSessionIdByTerminalInstance.set(instance, terminalToolSessionId);
		this._onDidRegisterTerminalInstanceForToolSession.fire(instance);
		this._terminalInstanceListenersByToolSessionId.set(terminalToolSessionId, instance.onDisposed(() => {
			this._terminalInstancesByToolSessionId.delete(terminalToolSessionId);
			this._toolSessionIdByTerminalInstance.delete(instance);
			this._terminalInstanceListenersByToolSessionId.deleteAndDispose(terminalToolSessionId);
			this._persistToStorage();
			this._updateHasToolTerminalContextKeys();
		}));

		this._register(this._chatService.onDidDisposeSession(e => {
			for (const resource of e.sessionResource) {
				if (LocalChatSessionUri.parseLocalSessionId(resource) === terminalToolSessionId) {
					this._terminalInstancesByToolSessionId.delete(terminalToolSessionId);
					this._toolSessionIdByTerminalInstance.delete(instance);
					this._terminalInstanceListenersByToolSessionId.deleteAndDispose(terminalToolSessionId);
					// Clean up session auto approval state
					const sessionId = LocalChatSessionUri.parseLocalSessionId(resource);
					if (sessionId) {
						this._sessionAutoApprovalEnabled.delete(sessionId);
					}
					this._persistToStorage();
					this._updateHasToolTerminalContextKeys();
				}
			}
		}));

		// Update context keys when terminal instances change (including when terminals are created, disposed, revealed, or hidden)
		this._register(this._terminalService.onDidChangeInstances(() => this._updateHasToolTerminalContextKeys()));

		if (isNumber(instance.shellLaunchConfig?.attachPersistentProcess?.id) || isNumber(instance.persistentProcessId)) {
			this._persistToStorage();
		}

		this._updateHasToolTerminalContextKeys();
	}

	async getTerminalInstanceByToolSessionId(terminalToolSessionId: string | undefined): Promise<ITerminalInstance | undefined> {
		await this._terminalService.whenConnected;
		if (!terminalToolSessionId) {
			return undefined;
		}
		if (this._pendingRestoredMappings.has(terminalToolSessionId)) {
			const instance = this._terminalService.instances.find(i => i.shellLaunchConfig.attachPersistentProcess?.id === this._pendingRestoredMappings.get(terminalToolSessionId));
			if (instance) {
				this._tryAdoptRestoredMapping(instance);
				return instance;
			}
		}
		return this._terminalInstancesByToolSessionId.get(terminalToolSessionId);
	}

	getToolSessionTerminalInstances(hiddenOnly?: boolean): readonly ITerminalInstance[] {
		if (hiddenOnly) {
			const foregroundInstances = new Set(this._terminalService.foregroundInstances.map(i => i.instanceId));
			const uniqueInstances = new Set(this._terminalInstancesByToolSessionId.values());
			return Array.from(uniqueInstances).filter(i => !foregroundInstances.has(i.instanceId));
		}
		// Ensure unique instances in case multiple tool sessions map to the same terminal
		return Array.from(new Set(this._terminalInstancesByToolSessionId.values()));
	}

	getToolSessionIdForInstance(instance: ITerminalInstance): string | undefined {
		return this._toolSessionIdByTerminalInstance.get(instance);
	}

	registerTerminalInstanceWithChatSession(chatSessionId: string, instance: ITerminalInstance): void {
		// If already registered with the same session ID, skip to avoid duplicate listeners
		if (this._chatSessionIdByTerminalInstance.get(instance) === chatSessionId) {
			return;
		}

		// Clean up previous listener if the instance was registered with a different session
		this._chatSessionListenersByTerminalInstance.deleteAndDispose(instance);

		this._chatSessionIdByTerminalInstance.set(instance, chatSessionId);
		// Clean up when the instance is disposed
		const disposable = instance.onDisposed(() => {
			this._chatSessionIdByTerminalInstance.delete(instance);
			this._chatSessionListenersByTerminalInstance.deleteAndDispose(instance);
		});
		this._chatSessionListenersByTerminalInstance.set(instance, disposable);
	}

	getChatSessionIdForInstance(instance: ITerminalInstance): string | undefined {
		return this._chatSessionIdByTerminalInstance.get(instance);
	}

	isBackgroundTerminal(terminalToolSessionId?: string): boolean {
		if (!terminalToolSessionId) {
			return false;
		}
		const instance = this._terminalInstancesByToolSessionId.get(terminalToolSessionId);
		if (!instance) {
			return false;
		}
		return this._terminalService.instances.includes(instance) && !this._terminalService.foregroundInstances.includes(instance);
	}

	registerProgressPart(part: IChatTerminalToolProgressPart): IDisposable {
		this._activeProgressParts.add(part);
		if (this._isAfter(part, this._mostRecentProgressPart)) {
			this._mostRecentProgressPart = part;
		}
		return toDisposable(() => {
			this._activeProgressParts.delete(part);
			if (this._focusedProgressPart === part) {
				this._focusedProgressPart = undefined;
			}
			if (this._mostRecentProgressPart === part) {
				this._mostRecentProgressPart = this._getLastActiveProgressPart();
			}
		});
	}

	setFocusedProgressPart(part: IChatTerminalToolProgressPart): void {
		this._focusedProgressPart = part;
	}

	clearFocusedProgressPart(part: IChatTerminalToolProgressPart): void {
		if (this._focusedProgressPart === part) {
			this._focusedProgressPart = undefined;
		}
	}

	getFocusedProgressPart(): IChatTerminalToolProgressPart | undefined {
		return this._focusedProgressPart;
	}

	getMostRecentProgressPart(): IChatTerminalToolProgressPart | undefined {
		if (!this._mostRecentProgressPart || !this._activeProgressParts.has(this._mostRecentProgressPart)) {
			this._mostRecentProgressPart = this._getLastActiveProgressPart();
		}
		return this._mostRecentProgressPart;
	}

	private _getLastActiveProgressPart(): IChatTerminalToolProgressPart | undefined {
		let latest: IChatTerminalToolProgressPart | undefined;
		for (const part of this._activeProgressParts) {
			if (this._isAfter(part, latest)) {
				latest = part;
			}
		}
		return latest;
	}

	private _isAfter(candidate: IChatTerminalToolProgressPart, current: IChatTerminalToolProgressPart | undefined): boolean {
		if (!current) {
			return true;
		}
		if (candidate.elementIndex === current.elementIndex) {
			return candidate.contentIndex >= current.contentIndex;
		}
		return candidate.elementIndex > current.elementIndex;
	}

	private _restoreFromStorage(): void {
		try {
			const raw = this._storageService.get(StorageKeys.ToolSessionMappings, StorageScope.WORKSPACE);
			if (!raw) {
				return;
			}
			const parsed: [string, number][] = JSON.parse(raw);
			for (const [toolSessionId, persistentProcessId] of parsed) {
				if (isString(toolSessionId) && isNumber(persistentProcessId)) {
					this._pendingRestoredMappings.set(toolSessionId, persistentProcessId);
				}
			}
		} catch (err) {
			this._logService.warn('Failed to restore terminal chat tool session mappings', err);
		}
	}

	private _tryAdoptRestoredMapping(instance: ITerminalInstance): void {
		if (this._pendingRestoredMappings.size === 0) {
			return;
		}

		for (const [toolSessionId, persistentProcessId] of this._pendingRestoredMappings) {
			if (persistentProcessId === instance.shellLaunchConfig.attachPersistentProcess?.id) {
				this._terminalInstancesByToolSessionId.set(toolSessionId, instance);
				this._toolSessionIdByTerminalInstance.set(instance, toolSessionId);
				this._onDidRegisterTerminalInstanceForToolSession.fire(instance);
				this._terminalInstanceListenersByToolSessionId.set(toolSessionId, instance.onDisposed(() => {
					this._terminalInstancesByToolSessionId.delete(toolSessionId);
					this._toolSessionIdByTerminalInstance.delete(instance);
					this._terminalInstanceListenersByToolSessionId.deleteAndDispose(toolSessionId);
					this._persistToStorage();
				}));
				this._pendingRestoredMappings.delete(toolSessionId);
				this._persistToStorage();
				break;
			}
		}
	}

	private _persistToStorage(): void {
		this._updateHasToolTerminalContextKeys();
		try {
			const entries: [string, number][] = [];
			for (const [toolSessionId, instance] of this._terminalInstancesByToolSessionId.entries()) {
				// Use the live persistent process id when available, otherwise fall back to the id
				// from the attached process so mappings survive early in the terminal lifecycle.
				const persistentId = isNumber(instance.persistentProcessId)
					? instance.persistentProcessId
					: instance.shellLaunchConfig.attachPersistentProcess?.id;
				const shouldPersist = instance.shouldPersist || instance.shellLaunchConfig.forcePersist;
				if (isNumber(persistentId) && shouldPersist) {
					entries.push([toolSessionId, persistentId]);
				}
			}
			if (entries.length > 0) {
				this._storageService.store(StorageKeys.ToolSessionMappings, JSON.stringify(entries), StorageScope.WORKSPACE, StorageTarget.MACHINE);
			} else {
				this._storageService.remove(StorageKeys.ToolSessionMappings, StorageScope.WORKSPACE);
			}
		} catch (err) {
			this._logService.warn('Failed to persist terminal chat tool session mappings', err);
		}
	}

	private _updateHasToolTerminalContextKeys(): void {
		const toolCount = this._terminalInstancesByToolSessionId.size;
		this._hasToolTerminalContext.set(toolCount > 0);
		const hiddenTerminalCount = this.getToolSessionTerminalInstances(true).length;
		this._hasHiddenToolTerminalContext.set(hiddenTerminalCount > 0);
	}

	setChatSessionAutoApproval(chatSessionId: string, enabled: boolean): void {
		if (enabled) {
			this._sessionAutoApprovalEnabled.add(chatSessionId);
		} else {
			this._sessionAutoApprovalEnabled.delete(chatSessionId);
		}
	}

	hasChatSessionAutoApproval(chatSessionId: string): boolean {
		return this._sessionAutoApprovalEnabled.has(chatSessionId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Dimension, getActiveWindow, IFocusTracker, trackFocus } from '../../../../../base/browser/dom.js';
import { CancelablePromise, createCancelablePromise, DeferredPromise } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, observableValue, type IObservable } from '../../../../../base/common/observable.js';
import { MicrotaskDelay } from '../../../../../base/common/symbols.js';
import { localize } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IChatAcceptInputOptions, IChatWidgetService } from '../../../chat/browser/chat.js';
import { IChatAgentService } from '../../../chat/common/chatAgents.js';
import { IChatResponseModel, isCellTextEditOperationArray } from '../../../chat/common/chatModel.js';
import { ChatMode } from '../../../chat/common/chatModes.js';
import { IChatModelReference, IChatProgress, IChatService } from '../../../chat/common/chatService.js';
import { ChatAgentLocation } from '../../../chat/common/constants.js';
import { InlineChatWidget } from '../../../inlineChat/browser/inlineChatWidget.js';
import { MENU_INLINE_CHAT_WIDGET_SECONDARY } from '../../../inlineChat/common/inlineChat.js';
import { ITerminalInstance, type IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { TerminalStickyScrollContribution } from '../../stickyScroll/browser/terminalStickyScrollContribution.js';
import './media/terminalChatWidget.css';
import { MENU_TERMINAL_CHAT_WIDGET_INPUT_SIDE_TOOLBAR, MENU_TERMINAL_CHAT_WIDGET_STATUS, TerminalChatCommandId, TerminalChatContextKeys } from './terminalChat.js';

const enum Constants {
	HorizontalMargin = 10,
	VerticalMargin = 30,
	/** The right padding of the widget, this should align exactly with that in the editor. */
	RightPadding = 12,
	/** The max allowed height of the widget. */
	MaxHeight = 480,
	/** The max allowed height of the widget as a percentage of the terminal viewport. */
	MaxHeightPercentageOfViewport = 0.75,
}

const enum Message {
	None = 0,
	AcceptSession = 1 << 0,
	CancelSession = 1 << 1,
	PauseSession = 1 << 2,
	CancelRequest = 1 << 3,
	CancelInput = 1 << 4,
	AcceptInput = 1 << 5,
	ReturnInput = 1 << 6,
}

export class TerminalChatWidget extends Disposable {

	private readonly _container: HTMLElement;

	private readonly _onDidHide = this._register(new Emitter<void>());
	readonly onDidHide = this._onDidHide.event;

	private readonly _inlineChatWidget: InlineChatWidget;
	public get inlineChatWidget(): InlineChatWidget { return this._inlineChatWidget; }

	private readonly _focusTracker: IFocusTracker;

	private readonly _focusedContextKey: IContextKey<boolean>;
	private readonly _visibleContextKey: IContextKey<boolean>;

	private readonly _requestActiveContextKey: IContextKey<boolean>;
	private readonly _responseContainsCodeBlockContextKey: IContextKey<boolean>;
	private readonly _responseContainsMulitpleCodeBlocksContextKey: IContextKey<boolean>;

	private _messages = this._store.add(new Emitter<Message>());

	private _viewStateStorageKey = 'terminal-inline-chat-view-state';

	private _lastResponseContent: string | undefined;
	get lastResponseContent(): string | undefined {
		return this._lastResponseContent;
	}

	private _terminalAgentName = 'terminal';

	private readonly _model: MutableDisposable<IChatModelReference> = this._register(new MutableDisposable());

	private _sessionCtor: CancelablePromise<void> | undefined;

	private _currentRequestId: string | undefined;
	private _activeRequestCts?: CancellationTokenSource;

	private readonly _requestInProgress = observableValue(this, false);
	readonly requestInProgress: IObservable<boolean> = this._requestInProgress;

	constructor(
		private readonly _terminalElement: HTMLElement,
		private readonly _instance: ITerminalInstance,
		private readonly _xterm: IXtermTerminal & { raw: RawXtermTerminal },
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatService private readonly _chatService: IChatService,
		@IStorageService private readonly _storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
	) {
		super();

		this._focusedContextKey = TerminalChatContextKeys.focused.bindTo(contextKeyService);
		this._visibleContextKey = TerminalChatContextKeys.visible.bindTo(contextKeyService);
		this._requestActiveContextKey = TerminalChatContextKeys.requestActive.bindTo(contextKeyService);
		this._responseContainsCodeBlockContextKey = TerminalChatContextKeys.responseContainsCodeBlock.bindTo(contextKeyService);
		this._responseContainsMulitpleCodeBlocksContextKey = TerminalChatContextKeys.responseContainsMultipleCodeBlocks.bindTo(contextKeyService);

		this._container = document.createElement('div');
		this._container.classList.add('terminal-inline-chat');
		this._terminalElement.appendChild(this._container);

		this._inlineChatWidget = instantiationService.createInstance(
			InlineChatWidget,
			{
				location: ChatAgentLocation.Terminal,
				resolveData: () => {
					// TODO@meganrogge return something that identifies this terminal
					return undefined;
				}
			},
			{
				statusMenuId: {
					menu: MENU_TERMINAL_CHAT_WIDGET_STATUS,
					options: {
						buttonConfigProvider: action => ({
							showLabel: action.id !== TerminalChatCommandId.RerunRequest,
							showIcon: action.id === TerminalChatCommandId.RerunRequest,
							isSecondary: action.id !== TerminalChatCommandId.RunCommand && action.id !== TerminalChatCommandId.RunFirstCommand
						})
					}
				},
				secondaryMenuId: MENU_INLINE_CHAT_WIDGET_SECONDARY,
				chatWidgetViewOptions: {
					menus: {
						telemetrySource: 'terminal-inline-chat',
						executeToolbar: MenuId.ChatExecute,
						inputSideToolbar: MENU_TERMINAL_CHAT_WIDGET_INPUT_SIDE_TOOLBAR,
					},
					defaultMode: ChatMode.Ask
				}
			},
		);
		this._register(this._inlineChatWidget.chatWidget.onDidChangeViewModel(() => this._saveViewState()));
		this._register(Event.any(
			this._inlineChatWidget.onDidChangeHeight,
			this._instance.onDimensionsChanged,
			this._inlineChatWidget.chatWidget.onDidChangeContentHeight,
			Event.debounce(this._xterm.raw.onCursorMove, () => void 0, MicrotaskDelay),
		)(() => this._relayout()));

		const observer = new ResizeObserver(() => this._relayout());
		observer.observe(this._terminalElement);
		this._register(toDisposable(() => observer.disconnect()));

		this._resetPlaceholder();
		this._container.appendChild(this._inlineChatWidget.domNode);

		this._focusTracker = this._register(trackFocus(this._container));
		this._register(this._focusTracker.onDidFocus(() => this._focusedContextKey.set(true)));
		this._register(this._focusTracker.onDidBlur(() => this._focusedContextKey.set(false)));

		this._register(autorun(r => {
			const isBusy = this._inlineChatWidget.requestInProgress.read(r);
			this._container.classList.toggle('busy', isBusy);

			this._inlineChatWidget.toggleStatus(!!this._inlineChatWidget.responseContent);

			if (isBusy || !this._inlineChatWidget.responseContent) {
				this._responseContainsCodeBlockContextKey.set(false);
				this._responseContainsMulitpleCodeBlocksContextKey.set(false);
			} else {
				Promise.all([
					this._inlineChatWidget.getCodeBlockInfo(0),
					this._inlineChatWidget.getCodeBlockInfo(1)
				]).then(([firstCodeBlock, secondCodeBlock]) => {
					this._responseContainsCodeBlockContextKey.set(!!firstCodeBlock);
					this._responseContainsMulitpleCodeBlocksContextKey.set(!!secondCodeBlock);
					this._inlineChatWidget.updateToolbar(true);
				});
			}
		}));

		this.hide();
	}

	private _dimension?: Dimension;

	private _relayout() {
		if (this._dimension) {
			this._doLayout();
		}
	}

	private _doLayout() {
		const xtermElement = this._xterm.raw!.element;
		if (!xtermElement) {
			return;
		}

		const style = getActiveWindow().getComputedStyle(xtermElement);

		// Calculate width
		const xtermLeftPadding = parseInt(style.paddingLeft);
		const width = xtermElement.clientWidth - xtermLeftPadding - Constants.RightPadding;
		if (width === 0) {
			return;
		}

		// Calculate height
		const terminalViewportHeight = this._getTerminalViewportHeight();
		const widgetAllowedPercentBasedHeight = (terminalViewportHeight ?? 0) * Constants.MaxHeightPercentageOfViewport;
		const height = Math.max(Math.min(Constants.MaxHeight, this._inlineChatWidget.contentHeight, widgetAllowedPercentBasedHeight), this._inlineChatWidget.minHeight);
		if (height === 0) {
			return;
		}

		// Layout
		this._dimension = new Dimension(width, height);
		this._inlineChatWidget.layout(this._dimension);
		this._inlineChatWidget.domNode.style.paddingLeft = `${xtermLeftPadding}px`;
		this._updateXtermViewportPosition();
	}

	private _resetPlaceholder() {
		const defaultAgent = this._chatAgentService.getDefaultAgent(ChatAgentLocation.Terminal);
		this.inlineChatWidget.placeholder = defaultAgent?.description ?? localize('askAboutCommands', 'Ask about commands');
	}

	async reveal(): Promise<void> {
		await this._createSession();
		this._doLayout();
		this._container.classList.remove('hide');
		this._visibleContextKey.set(true);
		this._resetPlaceholder();
		this._inlineChatWidget.focus();
		this._instance.scrollToBottom();
	}

	private _getTerminalCursorTop(): number | undefined {
		const font = this._instance.xterm?.getFont();
		if (!font?.charHeight) {
			return;
		}
		const terminalWrapperHeight = this._getTerminalViewportHeight() ?? 0;
		const cellHeight = font.charHeight * font.lineHeight;
		const topPadding = terminalWrapperHeight - (this._instance.rows * cellHeight);
		const cursorY = (this._instance.xterm?.raw.buffer.active.cursorY ?? 0) + 1;
		return topPadding + cursorY * cellHeight;
	}

	private _updateXtermViewportPosition(): void {
		const top = this._getTerminalCursorTop();
		if (!top) {
			return;
		}
		this._container.style.top = `${top}px`;
		const terminalViewportHeight = this._getTerminalViewportHeight();
		if (!terminalViewportHeight) {
			return;
		}

		const widgetAllowedPercentBasedHeight = terminalViewportHeight * Constants.MaxHeightPercentageOfViewport;
		const height = Math.max(Math.min(Constants.MaxHeight, this._inlineChatWidget.contentHeight, widgetAllowedPercentBasedHeight), this._inlineChatWidget.minHeight);
		if (top > terminalViewportHeight - height && terminalViewportHeight - height > 0) {
			this._setTerminalViewportOffset(top - (terminalViewportHeight - height));
		} else {
			this._setTerminalViewportOffset(undefined);
		}
	}

	private _getTerminalViewportHeight(): number | undefined {
		return this._terminalElement.clientHeight;
	}

	hide(): void {
		this._container.classList.add('hide');
		this._inlineChatWidget.reset();
		this._resetPlaceholder();
		this._inlineChatWidget.updateToolbar(false);
		this._visibleContextKey.set(false);
		this._inlineChatWidget.value = '';
		this._instance.focus();
		this._setTerminalViewportOffset(undefined);
		this._onDidHide.fire();
	}
	private _setTerminalViewportOffset(offset: number | undefined) {
		if (offset === undefined || this._container.classList.contains('hide')) {
			this._terminalElement.style.position = '';
			this._terminalElement.style.bottom = '';
			TerminalStickyScrollContribution.get(this._instance)?.hideUnlock();
		} else {
			this._terminalElement.style.position = 'relative';
			this._terminalElement.style.bottom = `${offset}px`;
			TerminalStickyScrollContribution.get(this._instance)?.hideLock();
		}
	}
	focus(): void {
		this.inlineChatWidget.focus();
	}
	hasFocus(): boolean {
		return this._inlineChatWidget.hasFocus();
	}

	setValue(value?: string) {
		this._inlineChatWidget.value = value ?? '';
	}

	async acceptCommand(shouldExecute: boolean): Promise<void> {
		const code = await this.inlineChatWidget.getCodeBlockInfo(0);
		if (!code) {
			return;
		}
		const value = code.getValue();
		this._instance.runCommand(value, shouldExecute);
		this.clear();
	}

	public get focusTracker(): IFocusTracker {
		return this._focusTracker;
	}

	private async _createSession(): Promise<void> {
		this._sessionCtor = createCancelablePromise<void>(async token => {
			if (!this._model.value) {
				const modelRef = this._chatService.startSession(ChatAgentLocation.Terminal);
				this._model.value = modelRef;
				const model = modelRef.object;
				this._inlineChatWidget.setChatModel(model);
				this._resetPlaceholder();
			}
		});
		this._register(toDisposable(() => this._sessionCtor?.cancel()));
	}

	private _saveViewState() {
		const viewState = this._inlineChatWidget.chatWidget.getViewState();
		if (viewState) {
			this._storageService.store(this._viewStateStorageKey, JSON.stringify(viewState), StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	clear(): void {
		this.cancel();
		this._model.clear();
		this._responseContainsCodeBlockContextKey.reset();
		this._requestActiveContextKey.reset();
		this.hide();
		this.setValue(undefined);
	}

	async acceptInput(query?: string, options?: IChatAcceptInputOptions): Promise<IChatResponseModel | undefined> {
		if (!this._model.value) {
			await this.reveal();
		}
		this._messages.fire(Message.AcceptInput);
		const lastInput = this._inlineChatWidget.value;
		if (!lastInput) {
			return;
		}
		this._activeRequestCts?.cancel();
		this._activeRequestCts = new CancellationTokenSource();
		const store = new DisposableStore();
		this._requestActiveContextKey.set(true);
		const response = await this._inlineChatWidget.chatWidget.acceptInput(lastInput, { isVoiceInput: options?.isVoiceInput });
		this._currentRequestId = response?.requestId;
		const responsePromise = new DeferredPromise<IChatResponseModel | undefined>();
		try {
			this._requestActiveContextKey.set(true);
			if (response) {
				store.add(response.onDidChange(async () => {
					if (response.isCanceled) {
						this._requestActiveContextKey.set(false);
						responsePromise.complete(undefined);
						return;
					}
					if (response.isComplete) {
						this._requestActiveContextKey.set(false);
						this._requestActiveContextKey.set(false);
						const firstCodeBlock = await this._inlineChatWidget.getCodeBlockInfo(0);
						const secondCodeBlock = await this._inlineChatWidget.getCodeBlockInfo(1);
						this._responseContainsCodeBlockContextKey.set(!!firstCodeBlock);
						this._responseContainsMulitpleCodeBlocksContextKey.set(!!secondCodeBlock);
						this._inlineChatWidget.updateToolbar(true);
						responsePromise.complete(response);
					}
				}));
			}
			await responsePromise.p;
			this._lastResponseContent = response?.response.getMarkdown();
			return response;
		} catch {
			this._lastResponseContent = undefined;
			return;
		} finally {
			store.dispose();
		}
	}

	cancel(): void {
		this._sessionCtor?.cancel();
		this._sessionCtor = undefined;
		this._activeRequestCts?.cancel();
		this._requestActiveContextKey.set(false);
		const model = this._inlineChatWidget.getChatModel();
		if (!model?.sessionResource) {
			return;
		}
		this._chatService.cancelCurrentRequestForSession(model?.sessionResource);
	}

	async viewInChat(): Promise<void> {
		const widget = await this._chatWidgetService.revealWidget();
		const currentRequest = this._inlineChatWidget.chatWidget.viewModel?.model.getRequests().find(r => r.id === this._currentRequestId);
		if (!widget || !currentRequest?.response) {
			return;
		}

		const message: IChatProgress[] = [];
		for (const item of currentRequest.response.response.value) {
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

		this._chatService.addCompleteRequest(widget!.viewModel!.sessionResource,
			`@${this._terminalAgentName} ${currentRequest.message.text}`,
			currentRequest.variableData,
			currentRequest.attempt,
			{
				message,
				result: currentRequest.response!.result,
				followups: currentRequest.response!.followups
			});
		widget.focusResponseItem();
		this.hide();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/media/terminalChatWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/media/terminalChatWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .terminal-inline-chat {
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 100;
	height: auto !important;
}

.monaco-workbench .terminal-inline-chat .inline-chat {
	margin-top: 0 !important;
	color: inherit;
	border-radius: unset;
	border: unset;
	box-shadow: unset;
	background: var(--vscode-inlineChat-background);
	position: relative;
	outline: none;

	border-top-style: solid;
	border-bottom-style: solid;
	border-top-color: rgb(0, 122, 204);
	border-bottom-color: rgb(0, 122, 204);
	border-top-width: 1px;
	border-bottom-width: 1px;
}

.monaco-workbench .terminal-inline-chat .interactive-session {
	margin: initial;
}

.monaco-workbench .terminal-inline-chat.hide {
	visibility: hidden;
}

.monaco-workbench .terminal-inline-chat .chatMessageContent .value {
	padding-top: 10px;
}

.monaco-workbench .terminal-inline-chat .inline-chat-input .monaco-editor-background {
	/* Override the global panel rule for monaco backgrounds */
	background-color: var(--vscode-inlineChatInput-background) !important;
}

@property --inline-chat-frame-progress {
	syntax: '<percentage>';
	initial-value: 0%;
	inherits: false;
}

@keyframes shift {
	0% {
		--inline-chat-frame-progress: 0%;
	}

	50% {
		--inline-chat-frame-progress: 100%;
	}

	100% {
		--inline-chat-frame-progress: 0%;
	}
}

.monaco-workbench .terminal-inline-chat.busy .inline-chat {
	--inline-chat-frame-progress: 0%;
	border-image: linear-gradient(90deg, var(--vscode-editorGutter-addedBackground) var(--inline-chat-frame-progress), var(--vscode-button-background)) 1;
	animation: 3s shift linear infinite;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/media/terminalInitialHint.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/media/terminalInitialHint.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .pane-body.integrated-terminal .terminal-initial-hint,
.monaco-workbench .terminal-editor .terminal-initial-hint {
	color: var(--vscode-terminal-initialHintForeground);
}
.monaco-workbench .pane-body.integrated-terminal .terminal-initial-hint a,
.monaco-workbench .terminal-editor .terminal-initial-hint a {
	cursor: pointer;
}

.monaco-workbench .pane-body.integrated-terminal .terminal-initial-hint a,
.monaco-workbench .pane-body.integrated-terminal .terminal-initial-hint .detail,
.monaco-workbench .terminal-editor .terminal-initial-hint a,
.monaco-workbench .terminal-editor .terminal-initial-hint .detail {
	font-style: italic;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/common/terminalInitialHintConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/common/terminalInitialHintConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalInitialHintSettingId {
	Enabled = 'terminal.integrated.initialHint'
}

export const terminalInitialHintConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalInitialHintSettingId.Enabled]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.initialHint', "Controls if the first terminal without input will show a hint about available actions when it is focused."),
		type: 'boolean',
		default: true
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/test/browser/terminalInitialHint.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/test/browser/terminalInitialHint.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ShellIntegrationAddon } from '../../../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { InitialHintAddon } from '../../browser/terminal.initialHint.contribution.js';
import { getActiveDocument } from '../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { strictEqual } from 'assert';
import { ExtensionIdentifier } from '../../../../../../platform/extensions/common/extensions.js';
import { IChatAgent } from '../../../../chat/common/chatAgents.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ChatAgentLocation, ChatModeKind } from '../../../../chat/common/constants.js';

suite('Terminal Initial Hint Addon', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let eventCount = 0;
	let xterm: Terminal;
	let initialHintAddon: InitialHintAddon;
	const onDidChangeAgentsEmitter: Emitter<IChatAgent | undefined> = new Emitter();
	const onDidChangeAgents = onDidChangeAgentsEmitter.event;
	const agent: IChatAgent = {
		id: 'termminal',
		name: 'terminal',
		extensionId: new ExtensionIdentifier('test'),
		extensionVersion: undefined,
		extensionPublisherId: 'test',
		extensionDisplayName: 'test',
		metadata: {},
		slashCommands: [{ name: 'test', description: 'test' }],
		disambiguation: [],
		locations: [ChatAgentLocation.fromRaw('terminal')],
		modes: [ChatModeKind.Ask],
		invoke: async () => { return {}; }
	};
	const editorAgent: IChatAgent = {
		id: 'editor',
		name: 'editor',
		extensionId: new ExtensionIdentifier('test-editor'),
		extensionVersion: undefined,
		extensionPublisherId: 'test-editor',
		extensionDisplayName: 'test-editor',
		metadata: {},
		slashCommands: [{ name: 'test', description: 'test' }],
		locations: [ChatAgentLocation.fromRaw('editor')],
		modes: [ChatModeKind.Ask],
		disambiguation: [],
		invoke: async () => { return {}; }
	};
	setup(async () => {
		const instantiationService = workbenchInstantiationService({}, store);
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor());
		const shellIntegrationAddon = store.add(new ShellIntegrationAddon('', true, undefined, undefined, new NullLogService));
		initialHintAddon = store.add(instantiationService.createInstance(InitialHintAddon, shellIntegrationAddon.capabilities, onDidChangeAgents));
		store.add(initialHintAddon.onDidRequestCreateHint(() => eventCount++));
		const testContainer = document.createElement('div');
		getActiveDocument().body.append(testContainer);
		xterm.open(testContainer);

		xterm.loadAddon(shellIntegrationAddon);
		xterm.loadAddon(initialHintAddon);
	});

	suite('Chat providers', () => {
		test('hint is not shown when there are no chat providers', () => {
			eventCount = 0;
			xterm.focus();
			strictEqual(eventCount, 0);
		});
		test('hint is not shown when there is just an editor agent', () => {
			eventCount = 0;
			onDidChangeAgentsEmitter.fire(editorAgent);
			xterm.focus();
			strictEqual(eventCount, 0);
		});
		test('hint is shown when there is a terminal chat agent', () => {
			eventCount = 0;
			onDidChangeAgentsEmitter.fire(editorAgent);
			xterm.focus();
			strictEqual(eventCount, 0);
			onDidChangeAgentsEmitter.fire(agent);
			strictEqual(eventCount, 1);
		});
		test('hint is not shown again when another terminal chat agent is added if it has already shown', () => {
			eventCount = 0;
			onDidChangeAgentsEmitter.fire(agent);
			xterm.focus();
			strictEqual(eventCount, 1);
			onDidChangeAgentsEmitter.fire(agent);
			strictEqual(eventCount, 1);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/alternativeRecommendation.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/alternativeRecommendation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ILanguageModelToolsService } from '../../../chat/common/languageModelToolsService.js';

let previouslyRecommededInSession = false;

const terminalCommands: { commands: RegExp[]; tags: string[] }[] = [
	{
		commands: [
			new RegExp(/^python3? -m pip install(\b)/),
			new RegExp(/^pip3? install(\b)/),
		],
		tags: ['python environment'],
	},
	{
		commands: [
			new RegExp(/^python3? -m jupyter(\b)/),
			new RegExp(/^python3? -m pip install\b.*jupyter\b.*/),
			new RegExp(/^pip3? install\b.*jupyter\b.*/),
			new RegExp(/^jupyter(\b)/), // jupyter lab, jupyer notebook, jupyter nbconvert, etc.
		],
		tags: ['python environment', 'jupyter environment'],
	}
];

export function getRecommendedToolsOverRunInTerminal(commandLine: string, languageModelToolsService: ILanguageModelToolsService): string | undefined {
	const tools = languageModelToolsService.getTools();
	if (!tools || previouslyRecommededInSession) {
		return;
	}

	const recommendedTools = new Set<string>();
	const messages: string[] = [
		`The terminal command '${commandLine}' was not executed.`,
		`Try using some of the following tools instead of running a Terminal Command (if unable to use one of these tools as an alternative then run the same terminal command again):`,
	];
	for (const terminalCommand of terminalCommands) {
		if (!terminalCommand.commands.some((condition) => condition.test(commandLine))) {
			continue;
		}
		const tagsToSearchFor = terminalCommand.tags;
		Array.from(tools)
			.filter(t => tagsToSearchFor.some(tag => t.tags?.includes(tag)))
			.forEach(tool => {
				recommendedTools.add(tool.id);
			});

	}
	recommendedTools.forEach(toolName => {
		messages.push(`- ${toolName}`);
	});

	if (recommendedTools.size) {
		previouslyRecommededInSession = true;
		return messages.join('  \n');
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/commandLineAutoApprover.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/commandLineAutoApprover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import type { OperatingSystem } from '../../../../../base/common/platform.js';
import { escapeRegExpCharacters, regExpLeadsToEndlessLoop } from '../../../../../base/common/strings.js';
import { isObject } from '../../../../../base/common/types.js';
import { structuralEquals } from '../../../../../base/common/equals.js';
import { ConfigurationTarget, IConfigurationService, type IConfigurationValue } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalChatAgentToolsSettingId } from '../common/terminalChatAgentToolsConfiguration.js';
import { isPowerShell } from './runInTerminalHelpers.js';

export interface IAutoApproveRule {
	regex: RegExp;
	regexCaseInsensitive: RegExp;
	sourceText: string;
	sourceTarget: ConfigurationTarget;
	isDefaultRule: boolean;
}

export interface ICommandApprovalResultWithReason {
	result: ICommandApprovalResult;
	reason: string;
	rule?: IAutoApproveRule;
}

export type ICommandApprovalResult = 'approved' | 'denied' | 'noMatch';

const neverMatchRegex = /(?!.*)/;
const transientEnvVarRegex = /^[A-Z_][A-Z0-9_]*=/i;

export class CommandLineAutoApprover extends Disposable {
	private _denyListRules: IAutoApproveRule[] = [];
	private _allowListRules: IAutoApproveRule[] = [];
	private _allowListCommandLineRules: IAutoApproveRule[] = [];
	private _denyListCommandLineRules: IAutoApproveRule[] = [];

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this.updateConfiguration();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (
				e.affectsConfiguration(TerminalChatAgentToolsSettingId.AutoApprove) ||
				e.affectsConfiguration(TerminalChatAgentToolsSettingId.IgnoreDefaultAutoApproveRules) ||
				e.affectsConfiguration(TerminalChatAgentToolsSettingId.DeprecatedAutoApproveCompatible)
			) {
				this.updateConfiguration();
			}
		}));
	}

	updateConfiguration() {
		let configValue = this._configurationService.getValue(TerminalChatAgentToolsSettingId.AutoApprove);
		const configInspectValue = this._configurationService.inspect(TerminalChatAgentToolsSettingId.AutoApprove);
		const deprecatedValue = this._configurationService.getValue(TerminalChatAgentToolsSettingId.DeprecatedAutoApproveCompatible);
		if (deprecatedValue && typeof deprecatedValue === 'object' && configValue && typeof configValue === 'object') {
			configValue = {
				...configValue,
				...deprecatedValue
			};
		}

		const {
			denyListRules,
			allowListRules,
			allowListCommandLineRules,
			denyListCommandLineRules
		} = this._mapAutoApproveConfigToRules(configValue, configInspectValue);
		this._allowListRules = allowListRules;
		this._denyListRules = denyListRules;
		this._allowListCommandLineRules = allowListCommandLineRules;
		this._denyListCommandLineRules = denyListCommandLineRules;
	}

	isCommandAutoApproved(command: string, shell: string, os: OperatingSystem): ICommandApprovalResultWithReason {
		// Check if the command has a transient environment variable assignment prefix which we
		// always deny for now as it can easily lead to execute other commands
		if (transientEnvVarRegex.test(command)) {
			return {
				result: 'denied',
				reason: `Command '${command}' is denied because it contains transient environment variables`
			};
		}

		// Check the deny list to see if this command requires explicit approval
		for (const rule of this._denyListRules) {
			if (this._commandMatchesRule(rule, command, shell, os)) {
				return {
					result: 'denied',
					rule,
					reason: `Command '${command}' is denied by deny list rule: ${rule.sourceText}`
				};
			}
		}

		// Check the allow list to see if the command is allowed to run without explicit approval
		for (const rule of this._allowListRules) {
			if (this._commandMatchesRule(rule, command, shell, os)) {
				return {
					result: 'approved',
					rule,
					reason: `Command '${command}' is approved by allow list rule: ${rule.sourceText}`
				};
			}
		}

		// TODO: LLM-based auto-approval https://github.com/microsoft/vscode/issues/253267

		// Fallback is always to require approval
		return {
			result: 'noMatch',
			reason: `Command '${command}' has no matching auto approve entries`
		};
	}

	isCommandLineAutoApproved(commandLine: string): ICommandApprovalResultWithReason {
		// Check the deny list first to see if this command line requires explicit approval
		for (const rule of this._denyListCommandLineRules) {
			if (rule.regex.test(commandLine)) {
				return {
					result: 'denied',
					rule,
					reason: `Command line '${commandLine}' is denied by deny list rule: ${rule.sourceText}`
				};
			}
		}

		// Check if the full command line matches any of the allow list command line regexes
		for (const rule of this._allowListCommandLineRules) {
			if (rule.regex.test(commandLine)) {
				return {
					result: 'approved',
					rule,
					reason: `Command line '${commandLine}' is approved by allow list rule: ${rule.sourceText}`
				};
			}
		}
		return {
			result: 'noMatch',
			reason: `Command line '${commandLine}' has no matching auto approve entries`
		};
	}

	private _commandMatchesRule(rule: IAutoApproveRule, command: string, shell: string, os: OperatingSystem): boolean {
		const isPwsh = isPowerShell(shell, os);

		// PowerShell is case insensitive regardless of platform
		if ((isPwsh ? rule.regexCaseInsensitive : rule.regex).test(command)) {
			return true;
		} else if (isPwsh && command.startsWith('(')) {
			// Allow ignoring of the leading ( for PowerShell commands as it's a command pattern to
			// operate on the output of a command. For example `(Get-Content README.md) ...`
			if (rule.regexCaseInsensitive.test(command.slice(1))) {
				return true;
			}
		}
		return false;
	}

	private _mapAutoApproveConfigToRules(config: unknown, configInspectValue: IConfigurationValue<Readonly<unknown>>): {
		denyListRules: IAutoApproveRule[];
		allowListRules: IAutoApproveRule[];
		allowListCommandLineRules: IAutoApproveRule[];
		denyListCommandLineRules: IAutoApproveRule[];
	} {
		if (!config || typeof config !== 'object') {
			return {
				denyListRules: [],
				allowListRules: [],
				allowListCommandLineRules: [],
				denyListCommandLineRules: []
			};
		}

		const denyListRules: IAutoApproveRule[] = [];
		const allowListRules: IAutoApproveRule[] = [];
		const allowListCommandLineRules: IAutoApproveRule[] = [];
		const denyListCommandLineRules: IAutoApproveRule[] = [];

		const ignoreDefaults = this._configurationService.getValue(TerminalChatAgentToolsSettingId.IgnoreDefaultAutoApproveRules) === true;

		for (const [key, value] of Object.entries(config)) {
			const defaultValue = configInspectValue?.default?.value;
			const isDefaultRule = !!(
				isObject(defaultValue) &&
				Object.prototype.hasOwnProperty.call(defaultValue, key) &&
				structuralEquals((defaultValue as Record<string, unknown>)[key], value)
			);
			function checkTarget(inspectValue: Readonly<unknown> | undefined): boolean {
				return (
					isObject(inspectValue) &&
					Object.prototype.hasOwnProperty.call(inspectValue, key) &&
					structuralEquals((inspectValue as Record<string, unknown>)[key], value)
				);
			}
			const sourceTarget = (
				checkTarget(configInspectValue.workspaceFolder) ? ConfigurationTarget.WORKSPACE_FOLDER
					: checkTarget(configInspectValue.workspaceValue) ? ConfigurationTarget.WORKSPACE
						: checkTarget(configInspectValue.userRemoteValue) ? ConfigurationTarget.USER_REMOTE
							: checkTarget(configInspectValue.userLocalValue) ? ConfigurationTarget.USER_LOCAL
								: checkTarget(configInspectValue.userValue) ? ConfigurationTarget.USER
									: checkTarget(configInspectValue.applicationValue) ? ConfigurationTarget.APPLICATION
										: ConfigurationTarget.DEFAULT
			);

			// If default rules are disabled, ignore entries that come from the default config
			if (ignoreDefaults && isDefaultRule && sourceTarget === ConfigurationTarget.DEFAULT) {
				continue;
			}

			if (typeof value === 'boolean') {
				const { regex, regexCaseInsensitive } = this._convertAutoApproveEntryToRegex(key);
				// IMPORTANT: Only true and false are used, null entries need to be ignored
				if (value === true) {
					allowListRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
				} else if (value === false) {
					denyListRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
				}
			} else if (typeof value === 'object' && value !== null) {
				// Handle object format like { approve: true/false, matchCommandLine: true/false }
				const objectValue = value as { approve?: boolean; matchCommandLine?: boolean };
				if (typeof objectValue.approve === 'boolean') {
					const { regex, regexCaseInsensitive } = this._convertAutoApproveEntryToRegex(key);
					if (objectValue.approve === true) {
						if (objectValue.matchCommandLine === true) {
							allowListCommandLineRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
						} else {
							allowListRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
						}
					} else if (objectValue.approve === false) {
						if (objectValue.matchCommandLine === true) {
							denyListCommandLineRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
						} else {
							denyListRules.push({ regex, regexCaseInsensitive, sourceText: key, sourceTarget, isDefaultRule });
						}
					}
				}
			}
		}

		return {
			denyListRules,
			allowListRules,
			allowListCommandLineRules,
			denyListCommandLineRules
		};
	}

	private _convertAutoApproveEntryToRegex(value: string): { regex: RegExp; regexCaseInsensitive: RegExp } {
		const regex = this._doConvertAutoApproveEntryToRegex(value);
		if (regex.flags.includes('i')) {
			return { regex, regexCaseInsensitive: regex };
		}
		return { regex, regexCaseInsensitive: new RegExp(regex.source, regex.flags + 'i') };
	}

	private _doConvertAutoApproveEntryToRegex(value: string): RegExp {
		// If it's wrapped in `/`, it's in regex format and should be converted directly
		// Support all standard JavaScript regex flags: d, g, i, m, s, u, v, y
		const regexMatch = value.match(/^\/(?<pattern>.+)\/(?<flags>[dgimsuvy]*)$/);
		const regexPattern = regexMatch?.groups?.pattern;
		if (regexPattern) {
			let flags = regexMatch.groups?.flags;
			// Remove global flag as it changes how the regex state works which we need to handle
			// internally
			if (flags) {
				flags = flags.replaceAll('g', '');
			}

			// Allow .* as users expect this would match everything
			if (regexPattern === '.*') {
				return new RegExp(regexPattern);

			}

			try {
				const regex = new RegExp(regexPattern, flags || undefined);
				if (regExpLeadsToEndlessLoop(regex)) {
					return neverMatchRegex;
				}

				return regex;
			} catch (error) {
				return neverMatchRegex;
			}
		}

		// The empty string should be ignored, rather than approve everything
		if (value === '') {
			return neverMatchRegex;
		}

		let sanitizedValue: string;

		// Match both path separators it if looks like a path
		if (value.includes('/') || value.includes('\\')) {
			// Replace path separators with placeholders first, apply standard sanitization, then
			// apply special path handling
			let pattern = value.replace(/[/\\]/g, '%%PATH_SEP%%');
			pattern = escapeRegExpCharacters(pattern);
			pattern = pattern.replace(/%%PATH_SEP%%*/g, '[/\\\\]');
			sanitizedValue = `^(?:\\.[/\\\\])?${pattern}`;
		}

		// Escape regex special characters for non-path strings
		else {
			sanitizedValue = escapeRegExpCharacters(value);
		}

		// Regular strings should match the start of the command line and be a word boundary
		return new RegExp(`^${sanitizedValue}\\b`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/outputHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/outputHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';
import { truncateOutputKeepingTail } from './runInTerminalHelpers.js';

const MAX_OUTPUT_LENGTH = 16000;

export function getOutput(instance: ITerminalInstance, startMarker?: IXtermMarker): string {
	if (!instance.xterm || !instance.xterm.raw) {
		return '';
	}
	const buffer = instance.xterm.raw.buffer.active;
	const startLine = Math.max(startMarker?.line ?? 0, 0);
	const endLine = buffer.length;
	const lines: string[] = new Array(endLine - startLine);

	for (let y = startLine; y < endLine; y++) {
		const line = buffer.getLine(y);
		lines[y - startLine] = line ? line.translateToString(true) : '';
	}

	let output = lines.join('\n');
	if (output.length > MAX_OUTPUT_LENGTH) {
		output = truncateOutputKeepingTail(output, MAX_OUTPUT_LENGTH);
	}
	return output;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/runInTerminalHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/runInTerminalHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Separator } from '../../../../../base/common/actions.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { posix as pathPosix, win32 as pathWin32 } from '../../../../../base/common/path.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { escapeRegExpCharacters, removeAnsiEscapeCodes } from '../../../../../base/common/strings.js';
import { localize } from '../../../../../nls.js';
import type { TerminalNewAutoApproveButtonData } from '../../../chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.js';
import type { ToolConfirmationAction } from '../../../chat/common/languageModelToolsService.js';
import type { ICommandApprovalResultWithReason } from './commandLineAutoApprover.js';

export function isPowerShell(envShell: string, os: OperatingSystem): boolean {
	if (os === OperatingSystem.Windows) {
		return /^(?:powershell|pwsh)(?:-preview)?$/i.test(pathWin32.basename(envShell).replace(/\.exe$/i, ''));

	}
	return /^(?:powershell|pwsh)(?:-preview)?$/.test(pathPosix.basename(envShell));
}

export function isWindowsPowerShell(envShell: string): boolean {
	return envShell.endsWith('System32\\WindowsPowerShell\\v1.0\\powershell.exe');
}

export function isZsh(envShell: string, os: OperatingSystem): boolean {
	if (os === OperatingSystem.Windows) {
		return /^zsh(?:\.exe)?$/i.test(pathWin32.basename(envShell));
	}
	return /^zsh$/.test(pathPosix.basename(envShell));
}

export function isFish(envShell: string, os: OperatingSystem): boolean {
	if (os === OperatingSystem.Windows) {
		return /^fish(?:\.exe)?$/i.test(pathWin32.basename(envShell));
	}
	return /^fish$/.test(pathPosix.basename(envShell));
}

// Maximum output length to prevent context overflow
const MAX_OUTPUT_LENGTH = 60000; // ~60KB limit to keep context manageable
export const TRUNCATION_MESSAGE = '\n\n[... PREVIOUS OUTPUT TRUNCATED ...]\n\n';

export function truncateOutputKeepingTail(output: string, maxLength: number): string {
	if (output.length <= maxLength) {
		return output;
	}
	const truncationMessageLength = TRUNCATION_MESSAGE.length;
	if (truncationMessageLength >= maxLength) {
		return TRUNCATION_MESSAGE.slice(TRUNCATION_MESSAGE.length - maxLength);
	}
	const availableLength = maxLength - truncationMessageLength;
	const endPortion = output.slice(-availableLength);
	return TRUNCATION_MESSAGE + endPortion;
}

export function sanitizeTerminalOutput(output: string): string {
	let sanitized = removeAnsiEscapeCodes(output)
		// Trim trailing \r\n characters
		.trimEnd();

	// Truncate if output is too long to prevent context overflow
	if (sanitized.length > MAX_OUTPUT_LENGTH) {
		sanitized = truncateOutputKeepingTail(sanitized, MAX_OUTPUT_LENGTH);
	}

	return sanitized;
}

export function generateAutoApproveActions(commandLine: string, subCommands: string[], autoApproveResult: { subCommandResults: ICommandApprovalResultWithReason[]; commandLineResult: ICommandApprovalResultWithReason }): ToolConfirmationAction[] {
	const actions: ToolConfirmationAction[] = [];

	// We shouldn't offer configuring rules for commands that are explicitly denied since it
	// wouldn't get auto approved with a new rule
	const canCreateAutoApproval = (
		autoApproveResult.subCommandResults.every(e => e.result !== 'denied') &&
		autoApproveResult.commandLineResult.result !== 'denied'
	);
	if (canCreateAutoApproval) {
		const unapprovedSubCommands = subCommands.filter((_, index) => {
			return autoApproveResult.subCommandResults[index].result !== 'approved';
		});

		// Some commands should not be recommended as they are too permissive generally. This only
		// applies to sub-commands, we still want to offer approving of the exact the command line
		// however as it's very specific.
		const neverAutoApproveCommands = new Set([
			// Shell interpreters
			'bash', 'sh', 'zsh', 'fish', 'ksh', 'csh', 'tcsh', 'dash',
			'pwsh', 'powershell', 'powershell.exe', 'cmd', 'cmd.exe',
			// Script interpreters
			'python', 'python3', 'node', 'ruby', 'perl', 'php', 'lua',
			// Direct execution commands
			'eval', 'exec', 'source', 'sudo', 'su', 'doas',
			// Network tools that can download and execute code
			'curl', 'wget', 'invoke-restmethod', 'invoke-webrequest', 'irm', 'iwr',
		]);

		// Commands where we want to suggest the sub-command (eg. `foo bar` instead of `foo`)
		const commandsWithSubcommands = new Set(['git', 'npm', 'npx', 'yarn', 'docker', 'kubectl', 'cargo', 'dotnet', 'mvn', 'gradle']);

		// Commands where we want to suggest the sub-command of a sub-command (eg. `foo bar baz`
		// instead of `foo`)
		const commandsWithSubSubCommands = new Set(['npm run', 'yarn run']);

		// For each unapproved sub-command (within the overall command line), decide whether to
		// suggest new rules for the command, a sub-command, a sub-command of a sub-command or to
		// not suggest at all.
		const subCommandsToSuggest = Array.from(new Set(coalesce(unapprovedSubCommands.map(command => {
			const parts = command.trim().split(/\s+/);
			const baseCommand = parts[0].toLowerCase();
			const baseSubCommand = parts.length > 1 ? `${parts[0]} ${parts[1]}`.toLowerCase() : '';

			// Security check: Never suggest auto-approval for dangerous interpreter commands
			if (neverAutoApproveCommands.has(baseCommand)) {
				return undefined;
			}

			if (commandsWithSubSubCommands.has(baseSubCommand)) {
				if (parts.length >= 3 && !parts[2].startsWith('-')) {
					return `${parts[0]} ${parts[1]} ${parts[2]}`;
				}
				return undefined;
			} else if (commandsWithSubcommands.has(baseCommand)) {
				if (parts.length >= 2 && !parts[1].startsWith('-')) {
					return `${parts[0]} ${parts[1]}`;
				}
				return undefined;
			} else {
				return parts[0];
			}
		}))));

		if (subCommandsToSuggest.length > 0) {
			let subCommandLabel: string;
			if (subCommandsToSuggest.length === 1) {
				subCommandLabel = localize('autoApprove.baseCommandSingle', 'Always Allow Command: {0}', subCommandsToSuggest[0]);
			} else {
				const commandSeparated = subCommandsToSuggest.join(', ');
				subCommandLabel = localize('autoApprove.baseCommand', 'Always Allow Commands: {0}', commandSeparated);
			}

			actions.push({
				label: subCommandLabel,
				data: {
					type: 'newRule',
					rule: subCommandsToSuggest.map(key => ({
						key,
						value: true
					}))
				} satisfies TerminalNewAutoApproveButtonData
			});
		}

		// Allow exact command line, don't do this if it's just the first sub-command's first
		// word or if it's an exact match for special sub-commands
		const firstSubcommandFirstWord = unapprovedSubCommands.length > 0 ? unapprovedSubCommands[0].split(' ')[0] : '';
		if (
			firstSubcommandFirstWord !== commandLine &&
			!commandsWithSubcommands.has(commandLine) &&
			!commandsWithSubSubCommands.has(commandLine)
		) {
			actions.push({
				label: localize('autoApprove.exactCommand', 'Always Allow Exact Command Line'),
				data: {
					type: 'newRule',
					rule: {
						key: `/^${escapeRegExpCharacters(commandLine)}$/`,
						value: {
							approve: true,
							matchCommandLine: true
						}
					}
				} satisfies TerminalNewAutoApproveButtonData
			});
		}
	}

	if (actions.length > 0) {
		actions.push(new Separator());
	}


	// Allow all commands for this session
	actions.push({
		label: localize('allowSession', 'Allow All Commands in this Session'),
		tooltip: localize('allowSessionTooltip', 'Allow this tool to run in this session without confirmation.'),
		data: {
			type: 'sessionApproval'
		} satisfies TerminalNewAutoApproveButtonData
	});

	actions.push(new Separator());

	// Always show configure option
	actions.push({
		label: localize('autoApprove.configure', 'Configure Auto Approve...'),
		data: {
			type: 'configure'
		} satisfies TerminalNewAutoApproveButtonData
	});

	return actions;
}

export function dedupeRules(rules: ICommandApprovalResultWithReason[]): ICommandApprovalResultWithReason[] {
	return rules.filter((result, index, array) => {
		return result.rule && array.findIndex(r => r.rule && r.rule.sourceText === result.rule!.sourceText) === index;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/runInTerminalToolTelemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/runInTerminalToolTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { TelemetryTrustedValue } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import type { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { ShellIntegrationQuality } from './toolTerminalCreator.js';

export class RunInTerminalToolTelemetry {
	constructor(
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
	}

	logPrepare(state: {
		terminalToolSessionId: string | undefined;
		subCommands: string[];
		autoApproveAllowed: 'allowed' | 'needsOptIn' | 'off';
		autoApproveResult: 'approved' | 'denied' | 'manual';
		autoApproveReason: 'subCommand' | 'commandLine' | undefined;
		autoApproveDefault: boolean | undefined;
	}) {
		const subCommandsSanitized = state.subCommands.map(e => {
			const commandName = e.split(' ')[0];
			let sanitizedCommandName = commandName.toLowerCase();
			if (!commandAllowList.has(sanitizedCommandName)) {
				if (/^(?:[A-Z][a-z0-9]+)+(?:-(?:[A-Z][a-z0-9]+))*$/.test(commandName)) {
					sanitizedCommandName = '(unknown:pwsh)';
				} else if (/^[a-z0-9_\-\.\\\/:;]+$/i.test(commandName)) {
					const properties: string[] = [];
					if (/[a-z]/.test(commandName)) {
						properties.push('ascii_lower');
					}
					if (/[A-Z]/.test(commandName)) {
						properties.push('ascii_upper');
					}
					if (/[0-9]/.test(commandName)) {
						properties.push('numeric');
					}
					const chars: string[] = [];
					for (const c of ['.', '-', '_', '/', '\\', ':', ';']) {
						if (commandName.includes(c)) {
							chars.push(c);
						}
					}
					sanitizedCommandName = `(unknown:${properties.join(',')}:${chars.join('')})`;
				} else if (/[^\x00-\x7F]/.test(commandName)) {
					sanitizedCommandName = '(unknown:unicode)';
				} else {
					sanitizedCommandName = '(unknown)';
				}
			}
			return sanitizedCommandName;
		});

		type TelemetryEvent = {
			terminalToolSessionId: string | undefined;

			subCommands: TelemetryTrustedValue<string>;
			autoApproveAllowed: string;
			autoApproveResult: string;
			autoApproveReason: string | undefined;
			autoApproveDefault: boolean | undefined;
		};
		type TelemetryClassification = {
			owner: 'tyriar';
			comment: 'Understanding the auto approve behavior of the runInTerminal tool';

			terminalToolSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The session ID for this particular terminal tool invocation.' };

			subCommands: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A sanitized list of sub-commands that were executed, encoded as a JSON array' };
			autoApproveAllowed: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether auto-approve was allowed when evaluated' };
			autoApproveResult: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the command line was auto-approved' };
			autoApproveReason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason it was auto approved or denied' };
			autoApproveDefault: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the command line was auto approved due to a default rule' };
		};

		this._telemetryService.publicLog2<TelemetryEvent, TelemetryClassification>('toolUse.runInTerminal.prepare', {
			terminalToolSessionId: state.terminalToolSessionId,
			subCommands: new TelemetryTrustedValue(JSON.stringify(subCommandsSanitized)),
			autoApproveAllowed: state.autoApproveAllowed,
			autoApproveResult: state.autoApproveResult,
			autoApproveReason: state.autoApproveReason,
			autoApproveDefault: state.autoApproveDefault,
		});
	}

	logInvoke(instance: ITerminalInstance, state: {
		terminalToolSessionId: string | undefined;
		didUserEditCommand: boolean;
		didToolEditCommand: boolean;
		error: string | undefined;
		isBackground: boolean;
		isNewSession: boolean;
		shellIntegrationQuality: ShellIntegrationQuality;
		outputLineCount: number;
		timingConnectMs: number;
		timingExecuteMs: number;
		pollDurationMs: number | undefined;
		terminalExecutionIdleBeforeTimeout: boolean | undefined;
		exitCode: number | undefined;
		inputUserChars: number;
		inputUserSigint: boolean;
		inputToolManualAcceptCount: number | undefined;
		inputToolManualRejectCount: number | undefined;
		inputToolManualChars: number | undefined;
		inputToolAutoAcceptCount: number | undefined;
		inputToolAutoChars: number | undefined;
		inputToolManualShownCount: number | undefined;
		inputToolFreeFormInputShownCount: number | undefined;
		inputToolFreeFormInputCount: number | undefined;
	}) {
		type TelemetryEvent = {
			terminalSessionId: string;
			terminalToolSessionId: string | undefined;

			result: string;
			strategy: 0 | 1 | 2;
			userEditedCommand: 0 | 1;
			toolEditedCommand: 0 | 1;
			isBackground: 0 | 1;
			isNewSession: 0 | 1;
			outputLineCount: number;
			nonZeroExitCode: -1 | 0 | 1;
			timingConnectMs: number;
			pollDurationMs: number;
			timingExecuteMs: number;
			terminalExecutionIdleBeforeTimeout: boolean;

			inputUserChars: number;
			inputUserSigint: boolean;
			inputToolManualAcceptCount: number;
			inputToolManualRejectCount: number;
			inputToolManualChars: number;
			inputToolManualShownCount: number;
			inputToolFreeFormInputShownCount: number;
			inputToolFreeFormInputCount: number;
		};
		type TelemetryClassification = {
			owner: 'tyriar';
			comment: 'Understanding the usage of the runInTerminal tool';

			terminalSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The session ID of the terminal instance.' };
			terminalToolSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The session ID for this particular terminal tool invocation.' };

			result: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the tool ran successfully, or the type of error' };
			strategy: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'What strategy was used to execute the command (0=none, 1=basic, 2=rich)' };
			userEditedCommand: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the user edited the command' };
			toolEditedCommand: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the tool edited the command' };
			isBackground: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the command is a background command' };
			isNewSession: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether this was the first execution for the terminal session' };
			outputLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'How many lines of output were produced, this is -1 when isBackground is true or if there\'s an error' };
			nonZeroExitCode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the command exited with a non-zero code (-1=error/unknown, 0=zero exit code, 1=non-zero)' };
			timingConnectMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'How long the terminal took to start up and connect to' };
			timingExecuteMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'How long the terminal took to execute the command' };
			pollDurationMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'How long the tool polled for output, this is undefined when isBackground is true or if there\'s an error' };
			terminalExecutionIdleBeforeTimeout: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Indicates whether a terminal became idle before the run-in-terminal tool timed out or was cancelled by the user. This occurs when no data events are received twice consecutively and the model determines, based on terminal output, that the command has completed.' };

			inputUserChars: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of characters the user input manually, a single key stroke could map to several characters. Focus in/out sequences are not counted as part of this' };
			inputUserSigint: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the user input the SIGINT signal' };
			inputToolManualAcceptCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user manually accepted a detected suggestion' };
			inputToolManualRejectCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user manually rejected a detected suggestion' };
			inputToolManualChars: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of characters input by manual acceptance of a suggestion' };
			inputToolManualShownCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user was prompted to manually accept an input suggestion' };
			inputToolFreeFormInputShownCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user was prompted to provide free form input' };
			inputToolFreeFormInputCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user entered free form input after prompting' };
		};
		this._telemetryService.publicLog2<TelemetryEvent, TelemetryClassification>('toolUse.runInTerminal', {
			terminalSessionId: instance.sessionId,
			terminalToolSessionId: state.terminalToolSessionId,

			result: state.error ?? 'success',
			strategy: state.shellIntegrationQuality === ShellIntegrationQuality.Rich ? 2 : state.shellIntegrationQuality === ShellIntegrationQuality.Basic ? 1 : 0,
			userEditedCommand: state.didUserEditCommand ? 1 : 0,
			toolEditedCommand: state.didToolEditCommand ? 1 : 0,
			isBackground: state.isBackground ? 1 : 0,
			isNewSession: state.isNewSession ? 1 : 0,
			outputLineCount: state.outputLineCount,
			nonZeroExitCode: state.exitCode === undefined ? -1 : state.exitCode === 0 ? 0 : 1,
			timingConnectMs: state.timingConnectMs,
			timingExecuteMs: state.timingExecuteMs,
			pollDurationMs: state.pollDurationMs ?? 0,
			terminalExecutionIdleBeforeTimeout: state.terminalExecutionIdleBeforeTimeout ?? false,

			inputUserChars: state.inputUserChars,
			inputUserSigint: state.inputUserSigint,
			inputToolManualAcceptCount: state.inputToolManualAcceptCount ?? 0,
			inputToolManualRejectCount: state.inputToolManualRejectCount ?? 0,
			inputToolManualChars: state.inputToolManualChars ?? 0,
			inputToolManualShownCount: state.inputToolManualShownCount ?? 0,
			inputToolFreeFormInputShownCount: state.inputToolFreeFormInputShownCount ?? 0,
			inputToolFreeFormInputCount: state.inputToolFreeFormInputCount ?? 0,
		});
	}
}


const commandAllowList: ReadonlySet<string> = new Set([
	// Special chars/scripting
	'!',
	'@',
	'#',
	'$',
	'%',
	'^',
	'&',
	'*',
	'(',
	')',
	'~',
	'{',
	'}',
	'<',
	'>',

	// Utils
	'.',
	'7z',
	'alias',
	'assoc',
	'attrib',
	'awk',
	'basename',
	'bg',
	'blkid',
	'bunzip2',
	'bzip2',
	'cat',
	'cd',
	'certutil',
	'chkdsk',
	'chmod',
	'chown',
	'cipher',
	'clear',
	'cls',
	'cmp',
	'column',
	'comm',
	'compact',
	'compress',
	'copy',
	'cp',
	'curl',
	'cut',
	'date',
	'dd',
	'del',
	'df',
	'diff',
	'dig',
	'dir',
	'dirname',
	'diskpart',
	'dism',
	'disown',
	'du',
	'echo',
	'env',
	'erase',
	'eval',
	'expand',
	'export',
	'fc',
	'fdisk',
	'fg',
	'file',
	'find',
	'findstr',
	'fmt',
	'fold',
	'forfiles',
	'format',
	'free',
	'fsck',
	'git',
	'gpupdate',
	'grep',
	'groupadd',
	'groups',
	'gunzip',
	'gzip',
	'hash',
	'head',
	'hexdump',
	'history',
	'host',
	'htop',
	'icacls',
	'id',
	'ifconfig',
	'iostat',
	'ip',
	'ipconfig',
	'iptables',
	'jobs',
	'jq',
	'kill',
	'killall',
	'less',
	'ln',
	'locate',
	'ls',
	'lsblk',
	'lscpu',
	'lsof',
	'man',
	'mkdir',
	'mklink',
	'more',
	'mount',
	'move',
	'mv',
	'nbtstat',
	'nc/netcat',
	'net',
	'netstat',
	'nice',
	'nl',
	'nohup',
	'nslookup',
	'nslookup',
	'od',
	'passwd',
	'paste',
	'pathping',
	'pause',
	'pgrep',
	'ping',
	'pkill',
	'powercfg',
	'pr',
	'printenv',
	'ps',
	'pwd',
	'query',
	'rar',
	'readlink',
	'realpath',
	'reg',
	'rem',
	'ren',
	'rename',
	'renice',
	'rev',
	'rm',
	'rmdir',
	'robocopy',
	'route',
	'rsync',
	'sc',
	'schtasks',
	'scp',
	'sed',
	'seq',
	'set',
	'setx',
	'sfc',
	'shred',
	'shuf',
	'shutdown',
	'sleep',
	'sort',
	'source',
	'split',
	'ss',
	'ssh',
	'stat',
	'strings',
	'su',
	'subst',
	'sudo',
	'systeminfo',
	'tac',
	'tail',
	'tar',
	'tee',
	'telnet',
	'test',
	'time',
	'top',
	'touch',
	'tr',
	'traceroute',
	'tracert',
	'tree',
	'true',
	'truncate',
	'type',
	'type',
	'umask',
	'umount',
	'unalias',
	'uname',
	'uncompress',
	'unexpand',
	'uniq',
	'unlink',
	'unrar',
	'unzip',
	'uptime',
	'useradd',
	'usermod',
	'vmstat',
	'vol',
	'watch',
	'wc',
	'wget',
	'where',
	'whereis',
	'which',
	'who',
	'whoami',
	'wmic',
	'xargs',
	'xcopy',
	'xxd',
	'xz',
	'yes',
	'zcat',
	'zip',
	'zless',
	'zmore',

	// SCM
	'bitbucket',
	'bzr',
	'cvs',
	'gh',
	'git',
	'glab',
	'hg',
	'svn',
	'fossil',
	'p4',

	// Devtools, languages, package manager
	'adb',
	'ansible',
	'apk',
	'apt-get',
	'apt',
	'aws',
	'az',
	'brew',
	'bundle',
	'cargo',
	'choco',
	'clang',
	'cmake',
	'composer',
	'conan',
	'conda',
	'dnf',
	'docker-compose',
	'docker',
	'dotnet',
	'emacs',
	'esbuild',
	'eslint',
	'flatpak',
	'flutter',
	'fnm',
	'g++',
	'gcc',
	'gcloud',
	'go',
	'gradle',
	'helm',
	'java',
	'javac',
	'jest',
	'julia',
	'kotlin',
	'kubectl',
	'lua',
	'make',
	'mocha',
	'mvn',
	'n',
	'nano',
	'node',
	'npm',
	'nvm',
	'pacman',
	'perl',
	'php',
	'phpunit',
	'pip',
	'pipenv',
	'pnpm',
	'pod',
	'podman',
	'poetry',
	'python',
	'r',
	'rollup',
	'ruby',
	'rustc',
	'rustup',
	'snap',
	'swift',
	'terraform',
	'tsc',
	'tslint',
	'vagrant',
	'vcpkg',
	'vi',
	'vim',
	'vite',
	'vitest',
	'webpack',
	'yarn',
	'yum',
	'zypper',

	// AI tools
	'aider',
	'amp',
	'claude',
	'codex',
	'copilot',
	'gemini',
	'toad',
	'q',

	// Misc Windows executables
	'taskkill',
	'taskkill.exe',

	// PowerShell
	'add-content',
	'compare-object',
	'convertfrom-json',
	'convertto-json',
	'copy-item',
	'format-custom',
	'format-list',
	'format-table',
	'format-wide',
	'get-childitem',
	'get-command',
	'get-content',
	'get-date',
	'get-help',
	'get-location',
	'get-process',
	'get-random',
	'get-service',
	'invoke-expression',
	'invoke-restmethod',
	'invoke-webrequest',
	'join-path',
	'measure-command',
	'measure-object',
	'move-item',
	'new-item',
	'out-file',
	'remove-item',
	'restart-computer',
	'select-object',
	'select-string',
	'select-xml',
	'set-acl',
	'set-content',
	'set-itemproperty',
	'sort-object',
	'split-path',
	'start-process',
	'start-sleep',
	'stop-process',
	'test-path',
	'write-host',
	'write-output',

	// PowerShell aliases
	'iex',
	'irm',
	'iwr',
	'rd',
	'ri',
	'sp',
	'spps',
]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/taskHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/taskHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../../base/common/collections.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IMarkerData } from '../../../../../platform/markers/common/markers.js';
import { IToolInvocationContext, ToolProgress } from '../../../chat/common/languageModelToolsService.js';
import { ConfiguringTask, ITaskDependency, Task } from '../../../tasks/common/tasks.js';
import { ITaskService } from '../../../tasks/common/taskService.js';
import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { getOutput } from './outputHelpers.js';
import { OutputMonitor } from './tools/monitoring/outputMonitor.js';
import { IExecution, IPollingResult, OutputMonitorState } from './tools/monitoring/types.js';
import { Event } from '../../../../../base/common/event.js';
import { IReconnectionTaskData } from '../../../tasks/browser/terminalTaskSystem.js';
import { isString } from '../../../../../base/common/types.js';


export function getTaskDefinition(id: string) {
	const idx = id.indexOf(': ');
	const taskType = id.substring(0, idx);
	let taskLabel = idx > 0 ? id.substring(idx + 2) : id;

	if (/^\d+$/.test(taskLabel)) {
		taskLabel = id;
	}

	return { taskLabel, taskType };

}

export function getTaskRepresentation(task: IConfiguredTask | Task): string {
	if ('label' in task && task.label) {
		return task.label;
	} else if ('script' in task && task.script) {
		return task.script;
	} else if ('command' in task && task.command) {
		return isString(task.command) ? task.command : task.command.name?.toString() || '';
	}
	return '';
}

export function getTaskKey(task: Task): string {
	return task.getKey() ?? task.getMapKey();
}

export function tasksMatch(a: Task, b: Task): boolean {
	if (!a || !b) {
		return false;
	}

	if (getTaskKey(a) === getTaskKey(b)) {
		return true;
	}

	if (a.getCommonTaskId?.() === b.getCommonTaskId?.()) {
		return true;
	}

	return a._id === b._id;
}

export async function getTaskForTool(id: string | undefined, taskDefinition: { taskLabel?: string; taskType?: string }, workspaceFolder: string, configurationService: IConfigurationService, taskService: ITaskService, allowParentTask?: boolean): Promise<Task | undefined> {
	let index = 0;
	let task: IConfiguredTask | undefined;
	const workspaceFolderToTaskMap = await taskService.getWorkspaceTasks();
	let configTasks: IConfiguredTask[] = [];
	for (const folder of workspaceFolderToTaskMap.keys()) {
		const tasksConfig = configurationService.getValue('tasks', { resource: URI.parse(folder) }) as { tasks: IConfiguredTask[] } | undefined;
		if (tasksConfig?.tasks) {
			configTasks = configTasks.concat(tasksConfig.tasks);
		}
	}
	for (const configTask of configTasks) {
		if ((!allowParentTask && !configTask.type) || ('hide' in configTask && configTask.hide)) {
			// Skip these as they are not included in the agent prompt and we need to align with
			// the indices used there.
			continue;
		}

		if ((configTask.type && taskDefinition.taskType ? configTask.type === taskDefinition.taskType : true) &&
			((getTaskRepresentation(configTask) === taskDefinition?.taskLabel) || (id === configTask.label))) {
			task = configTask;
			break;
		} else if (!configTask.label && id === `${configTask.type}: ${index}`) {
			task = configTask;
			break;
		}
		index++;
	}
	if (!task) {
		return;
	}

	let tasksForWorkspace;
	const workspaceFolderPath = URI.file(workspaceFolder).path;
	for (const [folder, tasks] of workspaceFolderToTaskMap) {
		if (URI.parse(folder).path === workspaceFolderPath) {
			tasksForWorkspace = tasks;
			break;
		}
	}
	if (!tasksForWorkspace) {
		return;
	}
	const configuringTasks: IStringDictionary<ConfiguringTask> | undefined = tasksForWorkspace.configurations?.byIdentifier;
	const configuredTask: ConfiguringTask | undefined = Object.values(configuringTasks ?? {}).find(t => {
		return t.type === task.type && (t._label === task.label || t._label === `${task.type}: ${getTaskRepresentation(task)}` || t._label === getTaskRepresentation(task));
	});
	let resolvedTask: Task | undefined;
	if (configuredTask) {
		resolvedTask = await taskService.tryResolveTask(configuredTask);
	}
	if (!resolvedTask) {
		const customTasks: Task[] | undefined = tasksForWorkspace.set?.tasks;
		resolvedTask = customTasks?.find(t => task.label === t._label || task.label === t._label);
	}
	return resolvedTask;
}

/**
 * Represents a configured task in the system.
 *
 * This interface is used to define tasks that can be executed within the workspace.
 * It includes optional properties for identifying and describing the task.
 *
 * Properties:
 * - `type`: (optional) The type of the task, which categorizes it (e.g., "build", "test").
 * - `label`: (optional) A user-facing label for the task, typically used for display purposes.
 * - `script`: (optional) A script associated with the task, if applicable.
 * - `command`: (optional) A command associated with the task, if applicable.
 *
 */
export interface IConfiguredTask {
	label?: string;
	type?: string;
	script?: string;
	command?: string;
	args?: string[];
	isBackground?: boolean;
	problemMatcher?: string[];
	group?: string;
}

export async function resolveDependencyTasks(parentTask: Task, workspaceFolder: string, configurationService: IConfigurationService, taskService: ITaskService): Promise<Task[] | undefined> {
	if (!parentTask.configurationProperties?.dependsOn) {
		return undefined;
	}
	const dependencyTasks = await Promise.all(parentTask.configurationProperties.dependsOn.map(async (dep: ITaskDependency) => {
		const depId: string | undefined = isString(dep.task) ? dep.task : dep.task?._key;
		if (!depId) {
			return undefined;
		}
		return await getTaskForTool(depId, { taskLabel: depId }, workspaceFolder, configurationService, taskService);
	}));
	return dependencyTasks.filter((t: Task | undefined): t is Task => t !== undefined);
}

/**
 * Collects output, polling duration, and idle status for all terminals.
 */
export async function collectTerminalResults(
	terminals: ITerminalInstance[],
	task: Task,
	instantiationService: IInstantiationService,
	invocationContext: IToolInvocationContext,
	progress: ToolProgress,
	token: CancellationToken,
	disposableStore: DisposableStore,
	isActive?: (task: Task) => Promise<boolean>,
	dependencyTasks?: Task[],
	taskService?: ITaskService
): Promise<Array<{
	name: string;
	output: string;
	resources?: ILinkLocation[];
	pollDurationMs: number;
	state: OutputMonitorState;
	inputToolManualAcceptCount: number;
	inputToolManualRejectCount: number;
	inputToolManualChars: number;
	inputToolManualShownCount: number;
	inputToolFreeFormInputShownCount: number;
	inputToolFreeFormInputCount: number;
}>> {
	const results: Array<{ state: OutputMonitorState; name: string; output: string; resources?: ILinkLocation[]; pollDurationMs: number; inputToolManualAcceptCount: number; inputToolManualRejectCount: number; inputToolManualChars: number; inputToolAutoAcceptCount: number; inputToolAutoChars: number; inputToolManualShownCount: number; inputToolFreeFormInputCount: number; inputToolFreeFormInputShownCount: number }> = [];
	if (token.isCancellationRequested) {
		return results;
	}

	const commonTaskIdToTaskMap: { [key: string]: Task } = {};
	const taskIdToTaskMap: { [key: string]: Task } = {};
	const taskLabelToTaskMap: { [key: string]: Task } = {};

	for (const dependencyTask of dependencyTasks ?? []) {
		commonTaskIdToTaskMap[dependencyTask.getCommonTaskId()] = dependencyTask;
		taskIdToTaskMap[dependencyTask._id] = dependencyTask;
		taskLabelToTaskMap[dependencyTask._label] = dependencyTask;
	}

	for (const instance of terminals) {
		progress.report({ message: new MarkdownString(`Checking output for \`${instance.shellLaunchConfig.name ?? 'unknown'}\``) });

		let terminalTask = task;

		// For composite tasks, find the actual dependency task running in this terminal
		if (dependencyTasks?.length) {
			// Use reconnection data if possible to match, since the properties here are unique
			const reconnectionData = instance.reconnectionProperties?.data as IReconnectionTaskData | undefined;
			if (reconnectionData) {
				if (reconnectionData.lastTask in commonTaskIdToTaskMap) {
					terminalTask = commonTaskIdToTaskMap[reconnectionData.lastTask];
				} else if (reconnectionData.id in taskIdToTaskMap) {
					terminalTask = taskIdToTaskMap[reconnectionData.id];
				}
			} else {
				// Otherwise, fallback to label matching
				if (instance.shellLaunchConfig.name && instance.shellLaunchConfig.name in taskLabelToTaskMap) {
					terminalTask = taskLabelToTaskMap[instance.shellLaunchConfig.name];
				} else if (instance.title in taskLabelToTaskMap) {
					terminalTask = taskLabelToTaskMap[instance.title];
				}
			}
		}

		const execution: IExecution = {
			getOutput: () => getOutput(instance) ?? '',
			task: terminalTask,
			isActive: isActive ? () => isActive(terminalTask) : undefined,
			instance,
			dependencyTasks,
			sessionId: invocationContext.sessionId
		};

		// For tasks with problem matchers, wait until the task becomes busy before creating the output monitor
		if (terminalTask.configurationProperties.problemMatchers && terminalTask.configurationProperties.problemMatchers.length > 0 && taskService) {
			const maxWaitTime = 1000; // Wait up to 1 second
			const startTime = Date.now();
			while (!token.isCancellationRequested && Date.now() - startTime < maxWaitTime) {
				const busyTasks = await taskService.getBusyTasks();
				if (busyTasks.some(t => tasksMatch(t, terminalTask))) {
					break;
				}
				await timeout(100);
			}
		}

		const outputMonitor = disposableStore.add(instantiationService.createInstance(OutputMonitor, execution, taskProblemPollFn, invocationContext, token, task._label));
		await Event.toPromise(outputMonitor.onDidFinishCommand);
		const pollingResult = outputMonitor.pollingResult;
		results.push({
			name: instance.shellLaunchConfig.name ?? instance.title ?? 'unknown',
			output: pollingResult?.output ?? '',
			pollDurationMs: pollingResult?.pollDurationMs ?? 0,
			resources: pollingResult?.resources,
			state: pollingResult?.state || OutputMonitorState.Idle,
			inputToolManualAcceptCount: outputMonitor.outputMonitorTelemetryCounters.inputToolManualAcceptCount ?? 0,
			inputToolManualRejectCount: outputMonitor.outputMonitorTelemetryCounters.inputToolManualRejectCount ?? 0,
			inputToolManualChars: outputMonitor.outputMonitorTelemetryCounters.inputToolManualChars ?? 0,
			inputToolAutoAcceptCount: outputMonitor.outputMonitorTelemetryCounters.inputToolAutoAcceptCount ?? 0,
			inputToolAutoChars: outputMonitor.outputMonitorTelemetryCounters.inputToolAutoChars ?? 0,
			inputToolManualShownCount: outputMonitor.outputMonitorTelemetryCounters.inputToolManualShownCount ?? 0,
			inputToolFreeFormInputShownCount: outputMonitor.outputMonitorTelemetryCounters.inputToolFreeFormInputShownCount ?? 0,
			inputToolFreeFormInputCount: outputMonitor.outputMonitorTelemetryCounters.inputToolFreeFormInputCount ?? 0,
		});
	}
	return results;
}

export async function taskProblemPollFn(execution: IExecution, token: CancellationToken, taskService: ITaskService): Promise<IPollingResult | undefined> {
	if (token.isCancellationRequested) {
		return;
	}
	if (execution.task) {
		const data: Map<string, { resources: URI[]; markers: IMarkerData[] }> | undefined = taskService.getTaskProblems(execution.instance.instanceId);
		if (data) {
			// Problem matchers exist for this task
			const problemList: string[] = [];
			const resultResources: ILinkLocation[] = [];
			for (const [owner, { resources, markers }] of data.entries()) {
				for (let i = 0; i < markers.length; i++) {
					const uri: URI | undefined = resources[i];
					const marker = markers[i];
					resultResources.push({
						uri,
						range: marker.startLineNumber !== undefined && marker.startColumn !== undefined && marker.endLineNumber !== undefined && marker.endColumn !== undefined
							? new Range(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn)
							: undefined
					});
					const message = marker.message ?? '';
					problemList.push(`Problem: ${message} in ${uri.fsPath} coming from ${owner} starting on line ${marker.startLineNumber}${marker.startColumn ? `, column ${marker.startColumn} and ending on line ${marker.endLineNumber}${marker.endColumn ? `, column ${marker.endColumn}` : ''}` : ''}`);
				}
			}
			if (problemList.length === 0) {
				const lastTenLines = execution.getOutput().split('\n').filter(line => line !== '').slice(-10).join('\n');
				return {
					state: OutputMonitorState.Idle,
					output: `Task completed with output:\n${lastTenLines}`,
				};
			}
			return {
				state: OutputMonitorState.Idle,
				output: problemList.join('\n'),
				resources: resultResources,
			};
		}
	}
	throw new Error('Polling failed');
}

export interface ILinkLocation { uri: URI; range?: Range }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/terminal.chatAgentTools.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/terminal.chatAgentTools.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { isNumber } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { registerWorkbenchContribution2, WorkbenchPhase, type IWorkbenchContribution } from '../../../../common/contributions.js';
import { IChatWidgetService } from '../../../chat/browser/chat.js';
import { ChatContextKeys } from '../../../chat/common/chatContextKeys.js';
import { ILanguageModelToolsService } from '../../../chat/common/languageModelToolsService.js';
import { registerActiveInstanceAction, sharedWhenClause } from '../../../terminal/browser/terminalActions.js';
import { TerminalContextMenuGroup } from '../../../terminal/browser/terminalMenus.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalChatAgentToolsCommandId } from '../common/terminal.chatAgentTools.js';
import { TerminalChatAgentToolsSettingId } from '../common/terminalChatAgentToolsConfiguration.js';
import { GetTerminalLastCommandTool, GetTerminalLastCommandToolData } from './tools/getTerminalLastCommandTool.js';
import { GetTerminalOutputTool, GetTerminalOutputToolData } from './tools/getTerminalOutputTool.js';
import { GetTerminalSelectionTool, GetTerminalSelectionToolData } from './tools/getTerminalSelectionTool.js';
import { ConfirmTerminalCommandTool, ConfirmTerminalCommandToolData } from './tools/runInTerminalConfirmationTool.js';
import { RunInTerminalTool, createRunInTerminalToolData } from './tools/runInTerminalTool.js';
import { CreateAndRunTaskTool, CreateAndRunTaskToolData } from './tools/task/createAndRunTaskTool.js';
import { GetTaskOutputTool, GetTaskOutputToolData } from './tools/task/getTaskOutputTool.js';
import { RunTaskTool, RunTaskToolData } from './tools/task/runTaskTool.js';

class ShellIntegrationTimeoutMigrationContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'terminal.shellIntegrationTimeoutMigration';

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();
		const deprecatedSettingValue = configurationService.getValue<unknown>(TerminalChatAgentToolsSettingId.ShellIntegrationTimeout);
		if (!isNumber(deprecatedSettingValue)) {
			return;
		}
		const newSettingValue = configurationService.getValue<unknown>(TerminalSettingId.ShellIntegrationTimeout);
		if (!isNumber(newSettingValue)) {
			configurationService.updateValue(TerminalSettingId.ShellIntegrationTimeout, deprecatedSettingValue);
		}
	}
}
registerWorkbenchContribution2(ShellIntegrationTimeoutMigrationContribution.ID, ShellIntegrationTimeoutMigrationContribution, WorkbenchPhase.Eventually);

class ChatAgentToolsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'terminal.chatAgentTools';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
	) {
		super();

		// #region Terminal

		const confirmTerminalCommandTool = instantiationService.createInstance(ConfirmTerminalCommandTool);
		this._register(toolsService.registerTool(ConfirmTerminalCommandToolData, confirmTerminalCommandTool));
		const getTerminalOutputTool = instantiationService.createInstance(GetTerminalOutputTool);
		this._register(toolsService.registerTool(GetTerminalOutputToolData, getTerminalOutputTool));
		this._register(toolsService.executeToolSet.addTool(GetTerminalOutputToolData));

		instantiationService.invokeFunction(createRunInTerminalToolData).then(runInTerminalToolData => {
			const runInTerminalTool = instantiationService.createInstance(RunInTerminalTool);
			this._register(toolsService.registerTool(runInTerminalToolData, runInTerminalTool));
			this._register(toolsService.executeToolSet.addTool(runInTerminalToolData));
		});

		const getTerminalSelectionTool = instantiationService.createInstance(GetTerminalSelectionTool);
		this._register(toolsService.registerTool(GetTerminalSelectionToolData, getTerminalSelectionTool));

		const getTerminalLastCommandTool = instantiationService.createInstance(GetTerminalLastCommandTool);
		this._register(toolsService.registerTool(GetTerminalLastCommandToolData, getTerminalLastCommandTool));

		this._register(toolsService.readToolSet.addTool(GetTerminalSelectionToolData));
		this._register(toolsService.readToolSet.addTool(GetTerminalLastCommandToolData));

		// #endregion

		// #region Tasks

		const runTaskTool = instantiationService.createInstance(RunTaskTool);
		this._register(toolsService.registerTool(RunTaskToolData, runTaskTool));

		const getTaskOutputTool = instantiationService.createInstance(GetTaskOutputTool);
		this._register(toolsService.registerTool(GetTaskOutputToolData, getTaskOutputTool));

		const createAndRunTaskTool = instantiationService.createInstance(CreateAndRunTaskTool);
		this._register(toolsService.registerTool(CreateAndRunTaskToolData, createAndRunTaskTool));
		this._register(toolsService.executeToolSet.addTool(RunTaskToolData));
		this._register(toolsService.executeToolSet.addTool(CreateAndRunTaskToolData));
		this._register(toolsService.readToolSet.addTool(GetTaskOutputToolData));

		// #endregion
	}
}
registerWorkbenchContribution2(ChatAgentToolsContribution.ID, ChatAgentToolsContribution, WorkbenchPhase.AfterRestored);

// #endregion Contributions

// #region Actions

registerActiveInstanceAction({
	id: TerminalChatAgentToolsCommandId.ChatAddTerminalSelection,
	title: localize('addTerminalSelection', 'Add Terminal Selection to Chat'),
	precondition: ContextKeyExpr.and(ChatContextKeys.enabled, sharedWhenClause.terminalAvailable),
	menu: [
		{
			id: MenuId.TerminalInstanceContext,
			group: TerminalContextMenuGroup.Chat,
			order: 1,
			when: ContextKeyExpr.and(ChatContextKeys.enabled, TerminalContextKeys.textSelected)
		},
	],
	run: async (activeInstance, _c, accessor) => {
		const chatWidgetService = accessor.get(IChatWidgetService);

		const selection = activeInstance.selection;
		if (!selection) {
			return;
		}

		const chatView = chatWidgetService.lastFocusedWidget ?? await chatWidgetService.revealWidget();
		if (!chatView) {
			return;
		}

		chatView.attachmentModel.addContext({
			id: `terminal-selection-${Date.now()}`,
			kind: 'generic' as const,
			name: localize('terminalSelection', 'Terminal Selection'),
			fullName: localize('terminalSelection', 'Terminal Selection'),
			value: selection,
			icon: Codicon.terminal
		});
		chatView.focusInput();
	}
});

// #endregion Actions
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/toolTerminalCreator.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/toolTerminalCreator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, disposableTimeout, raceTimeout } from '../../../../../base/common/async.js';
import type { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { CancellationError } from '../../../../../base/common/errors.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { hasKey, isNumber, isObject, isString } from '../../../../../base/common/types.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { PromptInputState } from '../../../../../platform/terminal/common/capabilities/commandDetection/promptInputModel.js';
import { ITerminalLogService, ITerminalProfile, TerminalSettingId, type IShellLaunchConfig } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalService, type ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { getShellIntegrationTimeout } from '../../../terminal/common/terminalEnvironment.js';

const enum ShellLaunchType {
	Unknown = 0,
	Default = 1,
	Fallback = 2,
}

export const enum ShellIntegrationQuality {
	None = 'none',
	Basic = 'basic',
	Rich = 'rich',
}

export interface IToolTerminal {
	instance: ITerminalInstance;
	shellIntegrationQuality: ShellIntegrationQuality;
	receivedUserInput?: boolean;
}

export class ToolTerminalCreator {
	/**
	 * The shell preference cached for the lifetime of the window. This allows skipping previous
	 * shell approaches that failed in previous runs to save time.
	 */
	private static _lastSuccessfulShell: ShellLaunchType = ShellLaunchType.Unknown;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
	}

	async createTerminal(shellOrProfile: string | ITerminalProfile, token: CancellationToken): Promise<IToolTerminal> {
		const instance = await this._createCopilotTerminal(shellOrProfile);
		const toolTerminal: IToolTerminal = {
			instance,
			shellIntegrationQuality: ShellIntegrationQuality.None,
		};
		let processReadyTimestamp = 0;

		// Ensure the shell process launches successfully
		const initResult = await Promise.any([
			instance.processReady.then(() => processReadyTimestamp = Date.now()),
			Event.toPromise(instance.onExit),
		]);
		if (!isNumber(initResult) && isObject(initResult) && hasKey(initResult, { message: true })) {
			throw new Error(initResult.message);
		}

		// Wait for shell integration when the fallback case has not been hit or when shell
		// integration injection is enabled. Note that it's possible for the fallback case to happen
		// and then for SI to activate again later in the session.
		const siInjectionEnabled = this._configurationService.getValue(TerminalSettingId.ShellIntegrationEnabled) === true;

		// Get the configurable timeout to wait for shell integration
		const waitTime = getShellIntegrationTimeout(
			this._configurationService,
			siInjectionEnabled,
			instance.hasRemoteAuthority,
			processReadyTimestamp
		);

		if (
			ToolTerminalCreator._lastSuccessfulShell !== ShellLaunchType.Fallback ||
			siInjectionEnabled
		) {
			this._logService.info(`ToolTerminalCreator#createTerminal: Waiting ${waitTime}ms for shell integration`);
			const shellIntegrationQuality = await this._waitForShellIntegration(instance, waitTime);
			if (token.isCancellationRequested) {
				instance.dispose();
				throw new CancellationError();
			}

			// If SI is rich, wait for the prompt state to change. This prevents an issue with pwsh
			// in particular where shell startup can swallow `\r` input events, preventing the
			// command from executing.
			if (shellIntegrationQuality === ShellIntegrationQuality.Rich) {
				const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
				if (commandDetection?.promptInputModel.state === PromptInputState.Unknown) {
					this._logService.info(`ToolTerminalCreator#createTerminal: Waiting up to 2s for PromptInputModel state to change`);
					const didStart = await raceTimeout(Event.toPromise(commandDetection.onCommandStarted), 2000);
					if (!didStart) {
						this._logService.info(`ToolTerminalCreator#createTerminal: PromptInputModel state did not change within timeout`);
					}
				}
			}

			if (shellIntegrationQuality !== ShellIntegrationQuality.None) {
				ToolTerminalCreator._lastSuccessfulShell = ShellLaunchType.Default;
				toolTerminal.shellIntegrationQuality = shellIntegrationQuality;
				return toolTerminal;
			}
		} else {
			this._logService.info(`ToolTerminalCreator#createTerminal: Skipping wait for shell integration - last successful launch type ${ToolTerminalCreator._lastSuccessfulShell}`);
		}

		// Fallback case: No shell integration in default profile
		ToolTerminalCreator._lastSuccessfulShell = ShellLaunchType.Fallback;
		return toolTerminal;
	}

	/**
	 * Synchronously update shell integration quality based on the terminal instance's current
	 * capabilities. This is a defensive change to avoid no shell integration being sticky
	 * https://github.com/microsoft/vscode/issues/260880
	 *
	 * Only upgrade quality just in case.
	 */
	refreshShellIntegrationQuality(toolTerminal: IToolTerminal) {
		const commandDetection = toolTerminal.instance.capabilities.get(TerminalCapability.CommandDetection);
		if (commandDetection) {
			if (
				toolTerminal.shellIntegrationQuality === ShellIntegrationQuality.None ||
				toolTerminal.shellIntegrationQuality === ShellIntegrationQuality.Basic
			) {
				toolTerminal.shellIntegrationQuality = commandDetection.hasRichCommandDetection ? ShellIntegrationQuality.Rich : ShellIntegrationQuality.Basic;
			}
		}
	}

	private _createCopilotTerminal(shellOrProfile: string | ITerminalProfile) {
		const config: IShellLaunchConfig = {
			icon: ThemeIcon.fromId(Codicon.chatSparkle.id),
			hideFromUser: true,
			forcePersist: true,
			env: {
				// Avoid making `git diff` interactive when called from copilot
				GIT_PAGER: 'cat',
			}
		};

		if (isString(shellOrProfile)) {
			config.executable = shellOrProfile;
		} else {
			config.executable = shellOrProfile.path;
			config.args = shellOrProfile.args;
			config.icon = shellOrProfile.icon ?? config.icon;
			config.color = shellOrProfile.color;
			config.env = {
				...config.env,
				...shellOrProfile.env
			};
		}

		return this._terminalService.createTerminal({ config });
	}

	private _waitForShellIntegration(
		instance: ITerminalInstance,
		timeoutMs: number
	): Promise<ShellIntegrationQuality> {
		const store = new DisposableStore();
		const result = new DeferredPromise<ShellIntegrationQuality>();

		const siNoneTimer = store.add(new MutableDisposable());
		siNoneTimer.value = disposableTimeout(() => {
			this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Timed out ${timeoutMs}ms, using no SI`);
			result.complete(ShellIntegrationQuality.None);
		}, timeoutMs);

		if (instance.capabilities.get(TerminalCapability.CommandDetection)?.hasRichCommandDetection) {
			// Rich command detection is available immediately.
			siNoneTimer.clear();
			this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Rich SI available immediately`);
			result.complete(ShellIntegrationQuality.Rich);
		} else {
			const onSetRichCommandDetection = store.add(this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.CommandDetection, e => e.onSetRichCommandDetection));
			store.add(onSetRichCommandDetection.event((e) => {
				if (e.instance !== instance) {
					return;
				}
				siNoneTimer.clear();
				// Rich command detection becomes available some time after the terminal is created.
				this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Rich SI available eventually`);
				result.complete(ShellIntegrationQuality.Rich);
			}));

			const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
			if (commandDetection) {
				siNoneTimer.clear();
				// When SI lights up, allow up to 200ms for the rich command
				// detection sequence to come in before declaring it as basic shell integration.
				store.add(disposableTimeout(() => {
					this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Timed out 200ms, using basic SI`);
					result.complete(ShellIntegrationQuality.Basic);
				}, 200));
			} else {
				store.add(instance.capabilities.onDidAddCommandDetectionCapability(e => {
					siNoneTimer.clear();
					// When command detection lights up, allow up to 200ms for the rich command
					// detection sequence to come in before declaring it as basic shell
					// integration.
					store.add(disposableTimeout(() => {
						this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Timed out 200ms, using basic SI (via listener)`);
						result.complete(ShellIntegrationQuality.Basic);
					}, 200));
				}));
			}
		}

		result.p.finally(() => {
			this._logService.info(`ToolTerminalCreator#_waitForShellIntegration: Promise complete, disposing store`);
			store.dispose();
		});

		return result.p;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/treeSitterCommandParser.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/treeSitterCommandParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Parser, Query, QueryCapture, Tree } from '@vscode/tree-sitter-wasm';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { BugIndicatingError, ErrorNoTelemetry } from '../../../../../base/common/errors.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ITreeSitterLibraryService } from '../../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';

export const enum TreeSitterCommandParserLanguage {
	Bash = 'bash',
	PowerShell = 'powershell',
}

export class TreeSitterCommandParser extends Disposable {
	private readonly _parser: Lazy<Promise<Parser>>;
	private readonly _treeCache = this._register(new TreeCache());

	constructor(
		@ITreeSitterLibraryService private readonly _treeSitterLibraryService: ITreeSitterLibraryService,
	) {
		super();
		this._parser = new Lazy(() => this._treeSitterLibraryService.getParserClass().then(ParserCtor => new ParserCtor()));
	}

	async extractSubCommands(languageId: TreeSitterCommandParserLanguage, commandLine: string): Promise<string[]> {
		const captures = await this._queryTree(languageId, commandLine, '(command) @command');
		return captures.map(e => e.node.text);
	}

	async extractPwshDoubleAmpersandChainOperators(commandLine: string): Promise<QueryCapture[]> {
		const captures = await this._queryTree(TreeSitterCommandParserLanguage.PowerShell, commandLine, [
			'(',
			'  (pipeline',
			'    (pipeline_chain_tail) @double.ampersand)',
			')',
		].join('\n'));
		return captures;
	}

	async getFileWrites(languageId: TreeSitterCommandParserLanguage, commandLine: string): Promise<string[]> {
		let query: string;
		switch (languageId) {
			case TreeSitterCommandParserLanguage.Bash:
				query = [
					'(file_redirect',
					'  destination: [(word) (string (string_content)) (raw_string) (concatenation)] @file)',
				].join('\n');
				break;
			case TreeSitterCommandParserLanguage.PowerShell:
				query = [
					'(redirection',
					'  (redirected_file_name) @file)',
				].join('\n');
				break;
		}
		const captures = await this._queryTree(languageId, commandLine, query);
		return captures.map(e => e.node.text.trim());
	}

	private async _queryTree(languageId: TreeSitterCommandParserLanguage, commandLine: string, querySource: string): Promise<QueryCapture[]> {
		const { tree, query } = await this._doQuery(languageId, commandLine, querySource);
		return query.captures(tree.rootNode);
	}

	private async _doQuery(languageId: TreeSitterCommandParserLanguage, commandLine: string, querySource: string): Promise<{ tree: Tree; query: Query }> {
		const language = await this._treeSitterLibraryService.getLanguagePromise(languageId);
		if (!language) {
			throw new BugIndicatingError('Failed to fetch language grammar');
		}

		let tree = this._treeCache.get(languageId, commandLine);
		if (!tree) {
			const parser = await this._parser.value;
			parser.setLanguage(language);
			const parsedTree = parser.parse(commandLine);
			if (!parsedTree) {
				throw new ErrorNoTelemetry('Failed to parse tree');
			}

			tree = parsedTree;
			this._treeCache.set(languageId, commandLine, tree);
		}

		const query = await this._treeSitterLibraryService.createQuery(language, querySource);
		if (!query) {
			throw new BugIndicatingError('Failed to create tree sitter query');
		}

		return { tree, query };
	}
}

/**
 * Caches trees temporarily to avoid reparsing the same command line multiple
 * times in quick succession.
 */
class TreeCache extends Disposable {
	private readonly _cache = new Map<string, Tree>();
	private readonly _clearScheduler = this._register(new MutableDisposable<RunOnceScheduler>());

	constructor() {
		super();
		this._register(toDisposable(() => this._cache.clear()));
	}

	get(languageId: TreeSitterCommandParserLanguage, commandLine: string): Tree | undefined {
		this._resetClearTimer();
		return this._cache.get(this._getCacheKey(languageId, commandLine));
	}

	set(languageId: TreeSitterCommandParserLanguage, commandLine: string, tree: Tree): void {
		this._resetClearTimer();
		this._cache.set(this._getCacheKey(languageId, commandLine), tree);
	}

	private _getCacheKey(languageId: TreeSitterCommandParserLanguage, commandLine: string): string {
		return `${languageId}:${commandLine}`;
	}

	private _resetClearTimer(): void {
		this._clearScheduler.value = new RunOnceScheduler(() => {
			this._cache.clear();
		}, 10000);
		this._clearScheduler.value.schedule();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/basicExecuteStrategy.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/basicExecuteStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { isNumber } from '../../../../../../base/common/types.js';
import type { ICommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { trackIdleOnPrompt, waitForIdle, type ITerminalExecuteStrategy, type ITerminalExecuteStrategyResult } from './executeStrategy.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';
import { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { createAltBufferPromise, setupRecreatingStartMarker } from './strategyHelpers.js';

/**
 * This strategy is used when shell integration is enabled, but rich command detection was not
 * declared by the shell script. This is the large spectrum between rich command detection and no
 * shell integration, here are some problems that are expected:
 *
 * - `133;C` command executed may not happen.
 * - `633;E` comamnd line reporting will likely not happen, so the command line contained in the
 *   execution start and end events will be of low confidence and chances are it will be wrong.
 * - Execution tracking may be incorrect, particularly when `executeCommand` calls are overlapped,
 *   such as Python activating the environment at the same time as Copilot executing a command. So
 *   the end event for the execution may actually correspond to a different command.
 *
 * This strategy focuses on trying to get the most accurate output given these limitations and
 * unknowns. Basically we cannot fully trust the extension APIs in this case, so polling of the data
 * stream is used to detect idling, and we listen to the terminal's data stream instead of the
 * execution's data stream.
 *
 * This is best effort with the goal being the output is accurate, though it may contain some
 * content above and below the command output, such as prompts or even possibly other command
 * output. We lean on the LLM to be able to differentiate the actual output from prompts and bad
 * output when it's not ideal.
 */
export class BasicExecuteStrategy implements ITerminalExecuteStrategy {
	readonly type = 'basic';
	private readonly _startMarker = new MutableDisposable<IXtermMarker>();

	private readonly _onDidCreateStartMarker = new Emitter<IXtermMarker | undefined>;
	public onDidCreateStartMarker: Event<IXtermMarker | undefined> = this._onDidCreateStartMarker.event;


	constructor(
		private readonly _instance: ITerminalInstance,
		private readonly _hasReceivedUserInput: () => boolean,
		private readonly _commandDetection: ICommandDetectionCapability,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
	}

	async execute(commandLine: string, token: CancellationToken, commandId?: string): Promise<ITerminalExecuteStrategyResult> {
		const store = new DisposableStore();

		try {
			const idlePromptPromise = trackIdleOnPrompt(this._instance, 1000, store);
			const onDone = Promise.race([
				Event.toPromise(this._commandDetection.onCommandFinished, store).then(e => {
					// When shell integration is basic, it means that the end execution event is
					// often misfired since we don't have command line verification. Because of this
					// we make sure the prompt is idle after the end execution event happens.
					this._log('onDone 1 of 2 via end event, waiting for short idle prompt');
					return idlePromptPromise.then(() => {
						this._log('onDone 2 of 2 via short idle prompt');
						return {
							'type': 'success',
							command: e
						} as const;
					});
				}),
				Event.toPromise(token.onCancellationRequested as Event<undefined>, store).then(() => {
					this._log('onDone via cancellation');
				}),
				Event.toPromise(this._instance.onDisposed, store).then(() => {
					this._log('onDone via terminal disposal');
					return { type: 'disposal' } as const;
				}),
				// A longer idle prompt event is used here as a catch all for unexpected cases where
				// the end event doesn't fire for some reason.
				trackIdleOnPrompt(this._instance, 3000, store).then(() => {
					this._log('onDone long idle prompt');
				}),
			]);

			// Ensure xterm is available
			this._log('Waiting for xterm');
			const xterm = await this._instance.xtermReadyPromise;
			if (!xterm) {
				throw new Error('Xterm is not available');
			}
			const alternateBufferPromise = createAltBufferPromise(xterm, store, this._log.bind(this));

			// Wait for the terminal to idle before executing the command
			this._log('Waiting for idle');
			await waitForIdle(this._instance.onData, 1000);

			setupRecreatingStartMarker(
				xterm,
				this._startMarker,
				m => this._onDidCreateStartMarker.fire(m),
				store,
				this._log.bind(this)
			);

			if (this._hasReceivedUserInput()) {
				this._log('Command timed out, sending SIGINT and retrying');
				// Send SIGINT (Ctrl+C)
				await this._instance.sendText('\x03', false);
				await waitForIdle(this._instance.onData, 100);
			}

			// Execute the command
			if (commandId) {
				this._log(`In basic execute strategy: skipping pre-bound command id ${commandId} because basic shell integration executes via sendText`);
			}
			// IMPORTANT: This uses `sendText` not `runCommand` since when basic shell integration
			// is used as it's more common to not recognize the prompt input which would result in
			// ^C being sent and also to return the exit code of 130 when from the shell when that
			// occurs.
			this._log(`Executing command line \`${commandLine}\``);
			this._instance.sendText(commandLine, true);

			// Wait for the next end execution event - note that this may not correspond to the actual
			// execution requested
			this._log('Waiting for done event');
			const onDoneResult = await Promise.race([onDone, alternateBufferPromise.then(() => ({ type: 'alternateBuffer' } as const))]);
			if (onDoneResult && onDoneResult.type === 'disposal') {
				throw new Error('The terminal was closed');
			}
			if (onDoneResult && onDoneResult.type === 'alternateBuffer') {
				this._log('Detected alternate buffer entry, skipping output capture');
				return {
					output: undefined,
					exitCode: undefined,
					error: 'alternateBuffer',
					didEnterAltBuffer: true
				};
			}
			const finishedCommand = onDoneResult && onDoneResult.type === 'success' ? onDoneResult.command : undefined;
			if (finishedCommand) {
				this._log(`Finished command id=${finishedCommand.id ?? 'none'} for requested=${commandId ?? 'none'}`);
			} else if (commandId) {
				this._log(`No finished command surfaced for requested=${commandId}`);
			}

			// Wait for the terminal to idle
			this._log('Waiting for idle');
			await waitForIdle(this._instance.onData, 1000);
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}
			const endMarker = store.add(xterm.raw.registerMarker());

			// Assemble final result
			let output: string | undefined;
			const additionalInformationLines: string[] = [];
			if (finishedCommand) {
				const commandOutput = finishedCommand?.getOutput();
				if (commandOutput !== undefined) {
					this._log('Fetched output via finished command');
					output = commandOutput;
				}
			}
			if (output === undefined) {
				try {
					output = xterm.getContentsAsText(this._startMarker.value, endMarker);
					this._log('Fetched output via markers');
				} catch {
					this._log('Failed to fetch output via markers');
					additionalInformationLines.push('Failed to retrieve command output');
				}
			}

			if (output !== undefined && output.trim().length === 0) {
				additionalInformationLines.push('Command produced no output');
			}

			const exitCode = finishedCommand?.exitCode;
			if (isNumber(exitCode) && exitCode > 0) {
				additionalInformationLines.push(`Command exited with code ${exitCode}`);
			}

			return {
				output,
				additionalInformation: additionalInformationLines.length > 0 ? additionalInformationLines.join('\n') : undefined,
				exitCode,
			};
		} finally {
			store.dispose();
		}
	}

	private _log(message: string) {
		this._logService.debug(`RunInTerminalTool#Basic: ${message}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/executeStrategy.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/executeStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, RunOnceScheduler } from '../../../../../../base/common/async.js';
import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import type { Event } from '../../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import type { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';

export interface ITerminalExecuteStrategy {
	readonly type: 'rich' | 'basic' | 'none';
	/**
	 * Executes a command line and gets a result designed to be passed directly to an LLM. The
	 * result will include information about the exit code.
	 * @param commandLine The command line to execute
	 * @param token Cancellation token
	 * @param commandId Optional predefined command ID to link the command
	 */
	execute(commandLine: string, token: CancellationToken, commandId?: string): Promise<ITerminalExecuteStrategyResult>;

	readonly onDidCreateStartMarker: Event<IXtermMarker | undefined>;
}

export interface ITerminalExecuteStrategyResult {
	output: string | undefined;
	additionalInformation?: string;
	exitCode?: number;
	error?: string;
	didEnterAltBuffer?: boolean;
}

export async function waitForIdle(onData: Event<unknown>, idleDurationMs: number): Promise<void> {
	// This is basically Event.debounce but with an initial event to trigger the debounce
	// immediately
	const store = new DisposableStore();
	const deferred = new DeferredPromise<void>();
	const scheduler = store.add(new RunOnceScheduler(() => deferred.complete(), idleDurationMs));
	store.add(onData(() => scheduler.schedule()));
	scheduler.schedule();
	return deferred.p.finally(() => store.dispose());
}

export interface IPromptDetectionResult {
	/**
	 * Whether a prompt was detected.
	 */
	detected: boolean;
	/**
	 * The reason for logging.
	 */
	reason?: string;
}

/**
 * Detects if the given text content appears to end with a common prompt pattern.
 */
export function detectsCommonPromptPattern(cursorLine: string): IPromptDetectionResult {
	if (cursorLine.trim().length === 0) {
		return { detected: false, reason: 'Content is empty or contains only whitespace' };
	}

	// PowerShell prompt: PS C:\> or similar patterns
	if (/PS\s+[A-Z]:\\.*>\s*$/.test(cursorLine)) {
		return { detected: true, reason: `PowerShell prompt pattern detected: "${cursorLine}"` };
	}

	// Command Prompt: C:\path>
	if (/^[A-Z]:\\.*>\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Command Prompt pattern detected: "${cursorLine}"` };
	}

	// Bash-style prompts ending with $
	if (/\$\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Bash-style prompt pattern detected: "${cursorLine}"` };
	}

	// Root prompts ending with #
	if (/#\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Root prompt pattern detected: "${cursorLine}"` };
	}

	// Python REPL prompt
	if (/^>>>\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Python REPL prompt pattern detected: "${cursorLine}"` };
	}

	// Custom prompts ending with the starship character (\u276f)
	if (/\u276f\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Starship prompt pattern detected: "${cursorLine}"` };
	}

	// Generic prompts ending with common prompt characters
	if (/[>%]\s*$/.test(cursorLine)) {
		return { detected: true, reason: `Generic prompt pattern detected: "${cursorLine}"` };
	}

	return { detected: false, reason: `No common prompt pattern found in last line: "${cursorLine}"` };
}

/**
 * Enhanced version of {@link waitForIdle} that uses prompt detection heuristics. After the terminal
 * idles for the specified period, checks if the terminal's cursor line looks like a common prompt.
 * If not, extends the timeout to give the command more time to complete.
 */
export async function waitForIdleWithPromptHeuristics(
	onData: Event<unknown>,
	instance: ITerminalInstance,
	idlePollIntervalMs: number,
	extendedTimeoutMs: number,
): Promise<IPromptDetectionResult> {
	await waitForIdle(onData, idlePollIntervalMs);

	const xterm = await instance.xtermReadyPromise;
	if (!xterm) {
		return { detected: false, reason: `Xterm not available, using ${idlePollIntervalMs}ms timeout` };
	}
	const startTime = Date.now();

	// Attempt to detect a prompt pattern after idle
	while (Date.now() - startTime < extendedTimeoutMs) {
		try {
			let content = '';
			const buffer = xterm.raw.buffer.active;
			const line = buffer.getLine(buffer.baseY + buffer.cursorY);
			if (line) {
				content = line.translateToString(true);
			}
			const promptResult = detectsCommonPromptPattern(content);
			if (promptResult.detected) {
				return promptResult;
			}
		} catch (error) {
			// Continue polling even if there's an error reading terminal content
		}
		await waitForIdle(onData, Math.min(idlePollIntervalMs, extendedTimeoutMs - (Date.now() - startTime)));
	}

	// Extended timeout reached without detecting a prompt
	try {
		let content = '';
		const buffer = xterm.raw.buffer.active;
		const line = buffer.getLine(buffer.baseY + buffer.cursorY);
		if (line) {
			content = line.translateToString(true) + '\n';
		}
		return { detected: false, reason: `Extended timeout reached without prompt detection. Last line: "${content.trim()}"` };
	} catch (error) {
		return { detected: false, reason: `Extended timeout reached. Error reading terminal content: ${error}` };
	}
}

/**
 * Tracks the terminal for being idle on a prompt input. This must be called before `executeCommand`
 * is called.
 */
export async function trackIdleOnPrompt(
	instance: ITerminalInstance,
	idleDurationMs: number,
	store: DisposableStore,
): Promise<void> {
	const idleOnPrompt = new DeferredPromise<void>();
	const onData = instance.onData;
	const scheduler = store.add(new RunOnceScheduler(() => {
		idleOnPrompt.complete();
	}, idleDurationMs));
	let state: TerminalState = TerminalState.Initial;

	// Fallback in case prompt sequences are not seen but the terminal goes idle.
	const promptFallbackScheduler = store.add(new RunOnceScheduler(() => {
		if (state === TerminalState.Executing || state === TerminalState.PromptAfterExecuting) {
			promptFallbackScheduler.cancel();
			return;
		}
		state = TerminalState.PromptAfterExecuting;
		scheduler.schedule();
	}, 1000));
	// Only schedule when a prompt sequence (A) is seen after an execute sequence (C). This prevents
	// cases where the command is executed before the prompt is written. While not perfect, sitting
	// on an A without a C following shortly after is a very good indicator that the command is done
	// and the terminal is idle. Note that D is treated as a signal for executed since shell
	// integration sometimes lacks the C sequence either due to limitations in the integation or the
	// required hooks aren't available.
	const enum TerminalState {
		Initial,
		Prompt,
		Executing,
		PromptAfterExecuting,
	}
	store.add(onData(e => {
		// Update state
		// p10k fires C as `133;C;`
		const matches = e.matchAll(/(?:\x1b\]|\x9d)[16]33;(?<type>[ACD])(?:;.*)?(?:\x1b\\|\x07|\x9c)/g);
		for (const match of matches) {
			if (match.groups?.type === 'A') {
				if (state === TerminalState.Initial) {
					state = TerminalState.Prompt;
				} else if (state === TerminalState.Executing) {
					state = TerminalState.PromptAfterExecuting;
				}
			} else if (match.groups?.type === 'C' || match.groups?.type === 'D') {
				state = TerminalState.Executing;
			}
		}
		// Re-schedule on every data event as we're tracking data idle
		if (state === TerminalState.PromptAfterExecuting) {
			promptFallbackScheduler.cancel();
			scheduler.schedule();
		} else {
			scheduler.cancel();
			if (state === TerminalState.Initial || state === TerminalState.Prompt) {
				promptFallbackScheduler.schedule();
			} else {
				promptFallbackScheduler.cancel();
			}
		}
	}));
	return idleOnPrompt.p;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/noneExecuteStrategy.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/noneExecuteStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { waitForIdle, waitForIdleWithPromptHeuristics, type ITerminalExecuteStrategy, type ITerminalExecuteStrategyResult } from './executeStrategy.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';
import { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { createAltBufferPromise, setupRecreatingStartMarker } from './strategyHelpers.js';

/**
 * This strategy is used when no shell integration is available. There are very few extension APIs
 * available in this case. This uses similar strategies to the basic integration strategy, but
 * with `sendText` instead of `shellIntegration.executeCommand` and relying on idle events instead
 * of execution events.
 */
export class NoneExecuteStrategy implements ITerminalExecuteStrategy {
	readonly type = 'none';
	private readonly _startMarker = new MutableDisposable<IXtermMarker>();


	private readonly _onDidCreateStartMarker = new Emitter<IXtermMarker | undefined>;
	public onDidCreateStartMarker: Event<IXtermMarker | undefined> = this._onDidCreateStartMarker.event;

	constructor(
		private readonly _instance: ITerminalInstance,
		private readonly _hasReceivedUserInput: () => boolean,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
	}

	async execute(commandLine: string, token: CancellationToken, commandId?: string): Promise<ITerminalExecuteStrategyResult> {
		const store = new DisposableStore();
		try {
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Ensure xterm is available
			this._log('Waiting for xterm');
			const xterm = await this._instance.xtermReadyPromise;
			if (!xterm) {
				throw new Error('Xterm is not available');
			}
			const alternateBufferPromise = createAltBufferPromise(xterm, store, this._log.bind(this));

			// Wait for the terminal to idle before executing the command
			this._log('Waiting for idle');
			await waitForIdle(this._instance.onData, 1000);
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			setupRecreatingStartMarker(
				xterm,
				this._startMarker,
				m => this._onDidCreateStartMarker.fire(m),
				store,
				this._log.bind(this)
			);

			if (this._hasReceivedUserInput()) {
				this._log('Command timed out, sending SIGINT and retrying');
				// Send SIGINT (Ctrl+C)
				await this._instance.sendText('\x03', false);
				await waitForIdle(this._instance.onData, 100);
			}

			// Execute the command
			// IMPORTANT: This uses `sendText` not `runCommand` since when no shell integration
			// is used as sending ctrl+c before a shell is initialized (eg. PSReadLine) can result
			// in failure (https://github.com/microsoft/vscode/issues/258989)
			this._log(`Executing command line \`${commandLine}\``);
			this._instance.sendText(commandLine, true);

			// Assume the command is done when it's idle
			this._log('Waiting for idle with prompt heuristics');
			const promptResultOrAltBuffer = await Promise.race([
				waitForIdleWithPromptHeuristics(this._instance.onData, this._instance, 1000, 10000),
				alternateBufferPromise.then(() => 'alternateBuffer' as const)
			]);
			if (promptResultOrAltBuffer === 'alternateBuffer') {
				this._log('Detected alternate buffer entry, skipping output capture');
				return {
					output: undefined,
					additionalInformation: undefined,
					exitCode: undefined,
					error: 'alternateBuffer',
					didEnterAltBuffer: true,
				};
			}
			const promptResult = promptResultOrAltBuffer;
			this._log(`Prompt detection result: ${promptResult.detected ? 'detected' : 'not detected'} - ${promptResult.reason}`);

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}
			const endMarker = store.add(xterm.raw.registerMarker());

			// Assemble final result - exit code is not available without shell integration
			let output: string | undefined;
			const additionalInformationLines: string[] = [];
			try {
				output = xterm.getContentsAsText(this._startMarker.value, endMarker);
				this._log('Fetched output via markers');
			} catch {
				this._log('Failed to fetch output via markers');
				additionalInformationLines.push('Failed to retrieve command output');
			}
			return {
				output,
				additionalInformation: additionalInformationLines.length > 0 ? additionalInformationLines.join('\n') : undefined,
				exitCode: undefined,
			};
		} finally {
			store.dispose();
		}
	}

	private _log(message: string) {
		this._logService.debug(`RunInTerminalTool#None: ${message}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/richExecuteStrategy.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/richExecuteStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { isNumber } from '../../../../../../base/common/types.js';
import type { ICommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import type { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { trackIdleOnPrompt, type ITerminalExecuteStrategy, type ITerminalExecuteStrategyResult } from './executeStrategy.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';
import { createAltBufferPromise, setupRecreatingStartMarker } from './strategyHelpers.js';

/**
 * This strategy is used when the terminal has rich shell integration/command detection is
 * available, meaning every sequence we rely upon should be exactly where we expect it to be. In
 * particular (`633;`) `A, B, E, C, D` all happen in exactly that order. While things still could go
 * wrong in this state, minimal verification is done in this mode since rich command detection is a
 * strong signal that it's behaving correctly.
 */
export class RichExecuteStrategy implements ITerminalExecuteStrategy {
	readonly type = 'rich';
	private readonly _startMarker = new MutableDisposable<IXtermMarker>();

	private readonly _onDidCreateStartMarker = new Emitter<IXtermMarker | undefined>;
	public onDidCreateStartMarker: Event<IXtermMarker | undefined> = this._onDidCreateStartMarker.event;

	constructor(
		private readonly _instance: ITerminalInstance,
		private readonly _commandDetection: ICommandDetectionCapability,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
	}

	async execute(commandLine: string, token: CancellationToken, commandId?: string): Promise<ITerminalExecuteStrategyResult> {
		const store = new DisposableStore();
		try {
			// Ensure xterm is available
			this._log('Waiting for xterm');
			const xterm = await this._instance.xtermReadyPromise;
			if (!xterm) {
				throw new Error('Xterm is not available');
			}
			const alternateBufferPromise = createAltBufferPromise(xterm, store, this._log.bind(this));

			const onDone = Promise.race([
				Event.toPromise(this._commandDetection.onCommandFinished, store).then(e => {
					this._log('onDone via end event');
					return {
						'type': 'success',
						command: e
					} as const;
				}),
				Event.toPromise(token.onCancellationRequested as Event<undefined>, store).then(() => {
					this._log('onDone via cancellation');
				}),
				Event.toPromise(this._instance.onDisposed, store).then(() => {
					this._log('onDone via terminal disposal');
					return { type: 'disposal' } as const;
				}),
				trackIdleOnPrompt(this._instance, 1000, store).then(() => {
					this._log('onDone via idle prompt');
				}),
			]);

			setupRecreatingStartMarker(
				xterm,
				this._startMarker,
				m => this._onDidCreateStartMarker.fire(m),
				store,
				this._log.bind(this)
			);

			// Execute the command
			this._log(`Executing command line \`${commandLine}\``);
			this._instance.runCommand(commandLine, true, commandId);

			// Wait for the terminal to idle
			this._log('Waiting for done event');
			const onDoneResult = await Promise.race([onDone, alternateBufferPromise.then(() => ({ type: 'alternateBuffer' } as const))]);
			if (onDoneResult && onDoneResult.type === 'disposal') {
				throw new Error('The terminal was closed');
			}
			if (onDoneResult && onDoneResult.type === 'alternateBuffer') {
				this._log('Detected alternate buffer entry, skipping output capture');
				return {
					output: undefined,
					exitCode: undefined,
					error: 'alternateBuffer',
					didEnterAltBuffer: true
				};
			}
			const finishedCommand = onDoneResult && onDoneResult.type === 'success' ? onDoneResult.command : undefined;

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}
			const endMarker = store.add(xterm.raw.registerMarker());

			// Assemble final result
			let output: string | undefined;
			const additionalInformationLines: string[] = [];
			if (finishedCommand) {
				const commandOutput = finishedCommand?.getOutput();
				if (commandOutput !== undefined) {
					this._log('Fetched output via finished command');
					output = commandOutput;
				}
			}
			if (output === undefined) {
				try {
					output = xterm.getContentsAsText(this._startMarker.value, endMarker);
					this._log('Fetched output via markers');
				} catch {
					this._log('Failed to fetch output via markers');
					additionalInformationLines.push('Failed to retrieve command output');
				}
			}

			if (output !== undefined && output.trim().length === 0) {
				additionalInformationLines.push('Command produced no output');
			}

			const exitCode = finishedCommand?.exitCode;
			if (isNumber(exitCode) && exitCode > 0) {
				additionalInformationLines.push(`Command exited with code ${exitCode}`);
			}

			return {
				output,
				additionalInformation: additionalInformationLines.length > 0 ? additionalInformationLines.join('\n') : undefined,
				exitCode,
			};
		} finally {
			store.dispose();
		}
	}

	private _log(message: string) {
		this._logService.debug(`RunInTerminalTool#Rich: ${message}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/strategyHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/executeStrategy/strategyHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../../../base/common/async.js';
import { DisposableStore, MutableDisposable, toDisposable, type IDisposable } from '../../../../../../base/common/lifecycle.js';
import type { IMarker as IXtermMarker } from '@xterm/xterm';

/**
 * Sets up a recreating start marker which is resilient to prompts that clear/re-render (eg. transient
 * or powerlevel10k style prompts). The marker is recreated at the cursor position whenever the
 * existing marker is disposed. The caller is responsible for adding the startMarker to the store.
 */
export function setupRecreatingStartMarker(
	xterm: { raw: { registerMarker(): IXtermMarker | undefined } },
	startMarker: MutableDisposable<IXtermMarker>,
	fire: (marker: IXtermMarker | undefined) => void,
	store: DisposableStore,
	log?: (message: string) => void,
): void {
	const markerListener = new MutableDisposable<IDisposable>();
	const recreateStartMarker = () => {
		if (store.isDisposed) {
			return;
		}
		const marker = xterm.raw.registerMarker();
		startMarker.value = marker ?? undefined;
		fire(marker);
		if (!marker) {
			markerListener.clear();
			return;
		}
		markerListener.value = marker.onDispose(() => {
			log?.('Start marker was disposed, recreating');
			recreateStartMarker();
		});
	};
	recreateStartMarker();
	store.add(toDisposable(() => {
		markerListener.dispose();
		startMarker.clear();
		fire(undefined);
	}));
	store.add(startMarker);
}

export function createAltBufferPromise(
	xterm: { raw: { buffer: { active: unknown; alternate: unknown; onBufferChange: (callback: () => void) => IDisposable } } },
	store: DisposableStore,
	log?: (message: string) => void,
): Promise<void> {
	const deferred = new DeferredPromise<void>();
	const complete = () => {
		if (!deferred.isSettled) {
			log?.('Detected alternate buffer entry');
			deferred.complete();
		}
	};

	if (xterm.raw.buffer.active === xterm.raw.buffer.alternate) {
		complete();
	} else {
		store.add(xterm.raw.buffer.onBufferChange(() => {
			if (xterm.raw.buffer.active === xterm.raw.buffer.alternate) {
				complete();
			}
		}));
	}

	return deferred.p;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalLastCommandTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalLastCommandTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ToolDataSource, type IPreparedToolInvocation, type IToolData, type IToolImpl, type IToolInvocation, type IToolInvocationPreparationContext, type IToolResult, type CountTokensCallback, type ToolProgress } from '../../../../chat/common/languageModelToolsService.js';
import { ITerminalService } from '../../../../terminal/browser/terminal.js';

export const GetTerminalLastCommandToolData: IToolData = {
	id: 'terminal_last_command',
	toolReferenceName: 'terminalLastCommand',
	legacyToolReferenceFullNames: ['runCommands/terminalLastCommand'],
	displayName: localize('terminalLastCommandTool.displayName', 'Get Terminal Last Command'),
	modelDescription: 'Get the last command run in the active terminal.',
	source: ToolDataSource.Internal,
	icon: Codicon.terminal,
};

export class GetTerminalLastCommandTool extends Disposable implements IToolImpl {

	constructor(
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		return {
			invocationMessage: localize('getTerminalLastCommand.progressive', "Getting last terminal command"),
			pastTenseMessage: localize('getTerminalLastCommand.past', "Got last terminal command"),
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const activeInstance = this._terminalService.activeInstance;
		if (!activeInstance) {
			return {
				content: [{
					kind: 'text',
					value: 'No active terminal instance found.'
				}]
			};
		}

		const commandDetection = activeInstance.capabilities.get(TerminalCapability.CommandDetection);
		if (!commandDetection) {
			return {
				content: [{
					kind: 'text',
					value: 'No command detection capability available in the active terminal.'
				}]
			};
		}

		const executingCommand = commandDetection.executingCommand;
		if (executingCommand) {
			const userPrompt: string[] = [];
			userPrompt.push('The following command is currently executing in the terminal:');
			userPrompt.push(executingCommand);

			const cwd = commandDetection.cwd;
			if (cwd) {
				userPrompt.push('It is running in the directory:');
				userPrompt.push(cwd);
			}

			return {
				content: [{
					kind: 'text',
					value: userPrompt.join('\n')
				}]
			};
		}

		const commands = commandDetection.commands;
		if (!commands || commands.length === 0) {
			return {
				content: [{
					kind: 'text',
					value: 'No command has been run in the active terminal.'
				}]
			};
		}

		const lastCommand = commands[commands.length - 1];
		const userPrompt: string[] = [];

		if (lastCommand.command) {
			userPrompt.push('The following is the last command run in the terminal:');
			userPrompt.push(lastCommand.command);
		}

		if (lastCommand.cwd) {
			userPrompt.push('It was run in the directory:');
			userPrompt.push(lastCommand.cwd);
		}

		if (lastCommand.exitCode !== undefined) {
			userPrompt.push(`It exited with code: ${lastCommand.exitCode}`);
		}

		if (lastCommand.hasOutput() && lastCommand.getOutput) {
			const output = lastCommand.getOutput();
			if (output && output.trim().length > 0) {
				userPrompt.push('It has the following output:');
				userPrompt.push(output);
			}
		}

		return {
			content: [{
				kind: 'text',
				value: userPrompt.join('\n')
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalOutputTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalOutputTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { ToolDataSource, type CountTokensCallback, type IPreparedToolInvocation, type IToolData, type IToolImpl, type IToolInvocation, type IToolInvocationPreparationContext, type IToolResult, type ToolProgress } from '../../../../chat/common/languageModelToolsService.js';
import { RunInTerminalTool } from './runInTerminalTool.js';

export const GetTerminalOutputToolData: IToolData = {
	id: 'get_terminal_output',
	toolReferenceName: 'getTerminalOutput',
	legacyToolReferenceFullNames: ['runCommands/getTerminalOutput'],
	displayName: localize('getTerminalOutputTool.displayName', 'Get Terminal Output'),
	modelDescription: 'Get the output of a terminal command previously started with run_in_terminal',
	icon: Codicon.terminal,
	source: ToolDataSource.Internal,
	inputSchema: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				description: 'The ID of the terminal to check.'
			},
		},
		required: [
			'id',
		]
	}
};

export interface IGetTerminalOutputInputParams {
	id: string;
}

export class GetTerminalOutputTool extends Disposable implements IToolImpl {
	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		return {
			invocationMessage: localize('bg.progressive', "Checking background terminal output"),
			pastTenseMessage: localize('bg.past', "Checked background terminal output"),
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as IGetTerminalOutputInputParams;
		return {
			content: [{
				kind: 'text',
				value: `Output of terminal ${args.id}:\n${RunInTerminalTool.getBackgroundOutput(args.id)}`
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalSelectionTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/getTerminalSelectionTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { ToolDataSource, type IPreparedToolInvocation, type IToolData, type IToolImpl, type IToolInvocation, type IToolInvocationPreparationContext, type IToolResult, type CountTokensCallback, type ToolProgress } from '../../../../chat/common/languageModelToolsService.js';
import { ITerminalService } from '../../../../terminal/browser/terminal.js';

export const GetTerminalSelectionToolData: IToolData = {
	id: 'terminal_selection',
	toolReferenceName: 'terminalSelection',
	legacyToolReferenceFullNames: ['runCommands/terminalSelection'],
	displayName: localize('terminalSelectionTool.displayName', 'Get Terminal Selection'),
	modelDescription: 'Get the current selection in the active terminal.',
	source: ToolDataSource.Internal,
	icon: Codicon.terminal,
};

export class GetTerminalSelectionTool extends Disposable implements IToolImpl {

	constructor(
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		return {
			invocationMessage: localize('getTerminalSelection.progressive', "Reading terminal selection"),
			pastTenseMessage: localize('getTerminalSelection.past', "Read terminal selection"),
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const activeInstance = this._terminalService.activeInstance;
		if (!activeInstance) {
			return {
				content: [{
					kind: 'text',
					value: 'No active terminal instance found.'
				}]
			};
		}

		const selection = activeInstance.selection;
		if (!selection) {
			return {
				content: [{
					kind: 'text',
					value: 'No text is currently selected in the active terminal.'
				}]
			};
		}

		return {
			content: [{
				kind: 'text',
				value: `The active terminal's selection:\n${selection}`
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

````

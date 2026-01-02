---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 365
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 365 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/electron-browser/actions/voiceChatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/electron-browser/actions/voiceChatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { RunOnceScheduler, disposableTimeout, raceCancellation } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Color } from '../../../../../base/common/color.js';
import { Event } from '../../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { isNumber } from '../../../../../base/common/types.js';
import { getCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { Action2, IAction2Options, MenuId } from '../../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { Extensions, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { contrastBorder, focusBorder } from '../../../../../platform/theme/common/colorRegistry.js';
import { spinningLoading, syncing } from '../../../../../platform/theme/common/iconRegistry.js';
import { isHighContrast } from '../../../../../platform/theme/common/theme.js';
import { registerThemingParticipant } from '../../../../../platform/theme/common/themeService.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { ACTIVITY_BAR_FOREGROUND } from '../../../../common/theme.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, Parts } from '../../../../services/layout/browser/layoutService.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../../services/statusbar/browser/statusbar.js';
import { AccessibilityVoiceSettingId, SpeechTimeoutDefault, accessibilityConfigurationNodeBase } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { InlineChatController } from '../../../inlineChat/browser/inlineChatController.js';
import { CTX_INLINE_CHAT_FOCUSED, MENU_INLINE_CHAT_WIDGET_SECONDARY } from '../../../inlineChat/common/inlineChat.js';
import { NOTEBOOK_EDITOR_FOCUSED } from '../../../notebook/common/notebookContextKeys.js';
import { CONTEXT_SETTINGS_EDITOR } from '../../../preferences/common/preferences.js';
import { SearchContext } from '../../../search/common/constants.js';
import { TextToSpeechInProgress as GlobalTextToSpeechInProgress, HasSpeechProvider, ISpeechService, KeywordRecognitionStatus, SpeechToTextInProgress, SpeechToTextStatus, TextToSpeechStatus } from '../../../speech/common/speechService.js';
import { CHAT_CATEGORY } from '../../browser/actions/chatActions.js';
import { IChatExecuteActionContext } from '../../browser/actions/chatExecuteActions.js';
import { IChatWidget, IChatWidgetService, IQuickChatService } from '../../browser/chat.js';
import { IChatAgentService } from '../../common/chatAgents.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { KEYWORD_ACTIVIATION_SETTING_ID } from '../../common/chatService.js';
import { ChatResponseViewModel, IChatResponseViewModel, isResponseVM } from '../../common/chatViewModel.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { VoiceChatInProgress as GlobalVoiceChatInProgress, IVoiceChatService } from '../../common/voiceChatService.js';
import './media/voiceChatActions.css';

//#region Speech to Text

type VoiceChatSessionContext = 'view' | 'inline' | 'quick' | 'editor';
const VoiceChatSessionContexts: VoiceChatSessionContext[] = ['view', 'inline', 'quick', 'editor'];

// Global Context Keys (set on global context key service)
const CanVoiceChat = ContextKeyExpr.and(ChatContextKeys.enabled, HasSpeechProvider);
const FocusInChatInput = ContextKeyExpr.or(CTX_INLINE_CHAT_FOCUSED, ChatContextKeys.inChatInput);
const AnyChatRequestInProgress = ChatContextKeys.requestInProgress;

// Scoped Context Keys (set on per-chat-context scoped context key service)
const ScopedVoiceChatGettingReady = new RawContextKey<boolean>('scopedVoiceChatGettingReady', false, { type: 'boolean', description: localize('scopedVoiceChatGettingReady', "True when getting ready for receiving voice input from the microphone for voice chat. This key is only defined scoped, per chat context.") });
const ScopedVoiceChatInProgress = new RawContextKey<VoiceChatSessionContext | undefined>('scopedVoiceChatInProgress', undefined, { type: 'string', description: localize('scopedVoiceChatInProgress', "Defined as a location where voice recording from microphone is in progress for voice chat. This key is only defined scoped, per chat context.") });
const AnyScopedVoiceChatInProgress = ContextKeyExpr.or(...VoiceChatSessionContexts.map(context => ScopedVoiceChatInProgress.isEqualTo(context)));

enum VoiceChatSessionState {
	Stopped = 1,
	GettingReady,
	Started
}

interface IVoiceChatSessionController {

	readonly onDidAcceptInput: Event<unknown>;
	readonly onDidHideInput: Event<unknown>;

	readonly context: VoiceChatSessionContext;
	readonly scopedContextKeyService: IContextKeyService;

	updateState(state: VoiceChatSessionState): void;

	focusInput(): void;
	acceptInput(): Promise<IChatResponseModel | undefined>;
	updateInput(text: string): void;
	getInput(): string;

	setInputPlaceholder(text: string): void;
	clearInputPlaceholder(): void;
}

class VoiceChatSessionControllerFactory {

	static async create(accessor: ServicesAccessor, context: 'view' | 'inline' | 'quick' | 'focused'): Promise<IVoiceChatSessionController | undefined> {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const quickChatService = accessor.get(IQuickChatService);
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const editorService = accessor.get(IEditorService);

		switch (context) {
			case 'focused': {
				const controller = VoiceChatSessionControllerFactory.doCreateForFocusedChat(chatWidgetService, layoutService);
				return controller ?? VoiceChatSessionControllerFactory.create(accessor, 'view'); // fallback to 'view'
			}
			case 'view': {
				const chatWidget = await chatWidgetService.revealWidget();
				if (chatWidget) {
					return VoiceChatSessionControllerFactory.doCreateForChatWidget('view', chatWidget);
				}
				break;
			}
			case 'inline': {
				const activeCodeEditor = getCodeEditor(editorService.activeTextEditorControl);
				if (activeCodeEditor) {
					const inlineChat = InlineChatController.get(activeCodeEditor);
					if (inlineChat) {
						if (!inlineChat.isActive) {
							inlineChat.run();
						}
						return VoiceChatSessionControllerFactory.doCreateForChatWidget('inline', inlineChat.widget.chatWidget);
					}
				}
				break;
			}
			case 'quick': {
				quickChatService.open(); // this will populate focused chat widget in the chat widget service
				return VoiceChatSessionControllerFactory.create(accessor, 'focused');
			}
		}

		return undefined;
	}

	private static doCreateForFocusedChat(chatWidgetService: IChatWidgetService, layoutService: IWorkbenchLayoutService): IVoiceChatSessionController | undefined {
		const chatWidget = chatWidgetService.lastFocusedWidget;
		if (chatWidget?.hasInputFocus()) {

			// Figure out the context of the chat widget by asking
			// layout service for the part that has focus. Unfortunately
			// there is no better way because the widget does not know
			// its location.

			let context: VoiceChatSessionContext;
			if (layoutService.hasFocus(Parts.EDITOR_PART)) {
				context = chatWidget.location === ChatAgentLocation.Chat ? 'editor' : 'inline';
			} else if (
				[Parts.SIDEBAR_PART, Parts.PANEL_PART, Parts.AUXILIARYBAR_PART, Parts.TITLEBAR_PART, Parts.STATUSBAR_PART, Parts.BANNER_PART, Parts.ACTIVITYBAR_PART].some(part => layoutService.hasFocus(part))
			) {
				context = 'view';
			} else {
				context = 'quick';
			}

			return VoiceChatSessionControllerFactory.doCreateForChatWidget(context, chatWidget);
		}

		return undefined;
	}

	private static createChatContextKeyController(contextKeyService: IContextKeyService, context: VoiceChatSessionContext): (state: VoiceChatSessionState) => void {
		const contextVoiceChatGettingReady = ScopedVoiceChatGettingReady.bindTo(contextKeyService);
		const contextVoiceChatInProgress = ScopedVoiceChatInProgress.bindTo(contextKeyService);

		return (state: VoiceChatSessionState) => {
			switch (state) {
				case VoiceChatSessionState.GettingReady:
					contextVoiceChatGettingReady.set(true);
					contextVoiceChatInProgress.reset();
					break;
				case VoiceChatSessionState.Started:
					contextVoiceChatGettingReady.reset();
					contextVoiceChatInProgress.set(context);
					break;
				case VoiceChatSessionState.Stopped:
					contextVoiceChatGettingReady.reset();
					contextVoiceChatInProgress.reset();
					break;
			}
		};
	}

	private static doCreateForChatWidget(context: VoiceChatSessionContext, chatWidget: IChatWidget): IVoiceChatSessionController {
		return {
			context,
			scopedContextKeyService: chatWidget.scopedContextKeyService,
			onDidAcceptInput: chatWidget.onDidAcceptInput,
			onDidHideInput: chatWidget.onDidHide,
			focusInput: () => chatWidget.focusInput(),
			acceptInput: () => chatWidget.acceptInput(undefined, { isVoiceInput: true }),
			updateInput: text => chatWidget.setInput(text),
			getInput: () => chatWidget.getInput(),
			setInputPlaceholder: text => chatWidget.setInputPlaceholder(text),
			clearInputPlaceholder: () => chatWidget.resetInputPlaceholder(),
			updateState: VoiceChatSessionControllerFactory.createChatContextKeyController(chatWidget.scopedContextKeyService, context)
		};
	}
}

interface IVoiceChatSession {
	setTimeoutDisabled(disabled: boolean): void;

	accept(): void;
	stop(): void;
}

interface IActiveVoiceChatSession extends IVoiceChatSession {
	readonly id: number;
	readonly controller: IVoiceChatSessionController;
	readonly disposables: DisposableStore;

	hasRecognizedInput: boolean;
}

class VoiceChatSessions {

	private static instance: VoiceChatSessions | undefined = undefined;
	static getInstance(instantiationService: IInstantiationService): VoiceChatSessions {
		if (!VoiceChatSessions.instance) {
			VoiceChatSessions.instance = instantiationService.createInstance(VoiceChatSessions);
		}

		return VoiceChatSessions.instance;
	}

	private currentVoiceChatSession: IActiveVoiceChatSession | undefined = undefined;
	private voiceChatSessionIds = 0;

	constructor(
		@IVoiceChatService private readonly voiceChatService: IVoiceChatService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) { }

	async start(controller: IVoiceChatSessionController, context?: IChatExecuteActionContext): Promise<IVoiceChatSession> {

		// Stop running text-to-speech or speech-to-text sessions in chats
		this.stop();
		ChatSynthesizerSessions.getInstance(this.instantiationService).stop();

		let disableTimeout = false;

		const sessionId = ++this.voiceChatSessionIds;
		const session: IActiveVoiceChatSession = this.currentVoiceChatSession = {
			id: sessionId,
			controller,
			hasRecognizedInput: false,
			disposables: new DisposableStore(),
			setTimeoutDisabled: (disabled: boolean) => { disableTimeout = disabled; },
			accept: () => this.accept(sessionId),
			stop: () => this.stop(sessionId, controller.context)
		};

		const cts = new CancellationTokenSource();
		session.disposables.add(toDisposable(() => cts.dispose(true)));

		session.disposables.add(controller.onDidAcceptInput(() => this.stop(sessionId, controller.context)));
		session.disposables.add(controller.onDidHideInput(() => this.stop(sessionId, controller.context)));

		controller.focusInput();

		controller.updateState(VoiceChatSessionState.GettingReady);

		const voiceChatSession = await this.voiceChatService.createVoiceChatSession(cts.token, { usesAgents: controller.context !== 'inline', model: context?.widget?.viewModel?.model });

		let inputValue = controller.getInput();

		let voiceChatTimeout = this.configurationService.getValue<number>(AccessibilityVoiceSettingId.SpeechTimeout);
		if (!isNumber(voiceChatTimeout) || voiceChatTimeout < 0) {
			voiceChatTimeout = SpeechTimeoutDefault;
		}

		const acceptTranscriptionScheduler = session.disposables.add(new RunOnceScheduler(() => this.accept(sessionId), voiceChatTimeout));
		session.disposables.add(voiceChatSession.onDidChange(({ status, text, waitingForInput }) => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			switch (status) {
				case SpeechToTextStatus.Started:
					this.onDidSpeechToTextSessionStart(controller, session.disposables);
					break;
				case SpeechToTextStatus.Recognizing:
					if (text) {
						session.hasRecognizedInput = true;
						session.controller.updateInput(inputValue ? [inputValue, text].join(' ') : text);
						if (voiceChatTimeout > 0 && context?.voice?.disableTimeout !== true && !disableTimeout) {
							acceptTranscriptionScheduler.cancel();
						}
					}
					break;
				case SpeechToTextStatus.Recognized:
					if (text) {
						session.hasRecognizedInput = true;
						inputValue = inputValue ? [inputValue, text].join(' ') : text;
						session.controller.updateInput(inputValue);
						if (voiceChatTimeout > 0 && context?.voice?.disableTimeout !== true && !waitingForInput && !disableTimeout) {
							acceptTranscriptionScheduler.schedule();
						}
					}
					break;
				case SpeechToTextStatus.Stopped:
					this.stop(session.id, controller.context);
					break;
			}
		}));

		return session;
	}

	private onDidSpeechToTextSessionStart(controller: IVoiceChatSessionController, disposables: DisposableStore): void {
		controller.updateState(VoiceChatSessionState.Started);

		let dotCount = 0;

		const updatePlaceholder = () => {
			dotCount = (dotCount + 1) % 4;
			controller.setInputPlaceholder(`${localize('listening', "I'm listening")}${'.'.repeat(dotCount)}`);
			placeholderScheduler.schedule();
		};

		const placeholderScheduler = disposables.add(new RunOnceScheduler(updatePlaceholder, 500));
		updatePlaceholder();
	}

	stop(voiceChatSessionId = this.voiceChatSessionIds, context?: VoiceChatSessionContext): void {
		if (
			!this.currentVoiceChatSession ||
			this.voiceChatSessionIds !== voiceChatSessionId ||
			(context && this.currentVoiceChatSession.controller.context !== context)
		) {
			return;
		}

		this.currentVoiceChatSession.controller.clearInputPlaceholder();

		this.currentVoiceChatSession.controller.updateState(VoiceChatSessionState.Stopped);

		this.currentVoiceChatSession.disposables.dispose();
		this.currentVoiceChatSession = undefined;
	}

	async accept(voiceChatSessionId = this.voiceChatSessionIds): Promise<void> {
		if (
			!this.currentVoiceChatSession ||
			this.voiceChatSessionIds !== voiceChatSessionId
		) {
			return;
		}

		if (!this.currentVoiceChatSession.hasRecognizedInput) {
			// If we have an active session but without recognized
			// input, we do not want to just accept the input that
			// was maybe typed before. But we still want to stop the
			// voice session because `acceptInput` would do that.
			this.stop(voiceChatSessionId, this.currentVoiceChatSession.controller.context);
			return;
		}

		const controller = this.currentVoiceChatSession.controller;
		const response = await controller.acceptInput();
		if (!response) {
			return;
		}
		const autoSynthesize = this.configurationService.getValue<'on' | 'off'>(AccessibilityVoiceSettingId.AutoSynthesize);
		if (autoSynthesize === 'on' || (autoSynthesize !== 'off' && !this.accessibilityService.isScreenReaderOptimized())) {
			let context: IVoiceChatSessionController | 'focused';
			if (controller.context === 'inline') {
				// This is ugly, but the lightweight inline chat turns into
				// a different widget as soon as a response comes in, so we fallback to
				// picking up from the focused chat widget
				context = 'focused';
			} else {
				context = controller;
			}
			ChatSynthesizerSessions.getInstance(this.instantiationService).start(this.instantiationService.invokeFunction(accessor => ChatSynthesizerSessionController.create(accessor, context, response)));
		}
	}
}

export const VOICE_KEY_HOLD_THRESHOLD = 500;

async function startVoiceChatWithHoldMode(id: string, accessor: ServicesAccessor, target: 'view' | 'inline' | 'quick' | 'focused', context?: IChatExecuteActionContext): Promise<void> {
	const instantiationService = accessor.get(IInstantiationService);
	const keybindingService = accessor.get(IKeybindingService);

	const holdMode = keybindingService.enableKeybindingHoldMode(id);

	const controller = await VoiceChatSessionControllerFactory.create(accessor, target);
	if (!controller) {
		return;
	}

	const session = await VoiceChatSessions.getInstance(instantiationService).start(controller, context);

	let acceptVoice = false;
	const handle = disposableTimeout(() => {
		acceptVoice = true;
		session?.setTimeoutDisabled(true); // disable accept on timeout when hold mode runs for VOICE_KEY_HOLD_THRESHOLD
	}, VOICE_KEY_HOLD_THRESHOLD);
	await holdMode;
	handle.dispose();

	if (acceptVoice) {
		session.accept();
	}
}

class VoiceChatWithHoldModeAction extends Action2 {

	constructor(desc: Readonly<IAction2Options>, private readonly target: 'view' | 'inline' | 'quick') {
		super(desc);
	}

	run(accessor: ServicesAccessor, context?: IChatExecuteActionContext): Promise<void> {
		return startVoiceChatWithHoldMode(this.desc.id, accessor, this.target, context);
	}
}

export class VoiceChatInChatViewAction extends VoiceChatWithHoldModeAction {

	static readonly ID = 'workbench.action.chat.voiceChatInChatView';

	constructor() {
		super({
			id: VoiceChatInChatViewAction.ID,
			title: localize2('workbench.action.chat.voiceChatInView.label', "Voice Chat in Chat View"),
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(
				CanVoiceChat,
				ChatContextKeys.requestInProgress.negate() // disable when a chat request is in progress
			),
			f1: true
		}, 'view');
	}
}

export class HoldToVoiceChatInChatViewAction extends Action2 {

	static readonly ID = 'workbench.action.chat.holdToVoiceChatInChatView';

	constructor() {
		super({
			id: HoldToVoiceChatInChatViewAction.ID,
			title: localize2('workbench.action.chat.holdToVoiceChatInChatView.label', "Hold to Voice Chat in Chat View"),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(
					CanVoiceChat,
					ChatContextKeys.requestInProgress.negate(), 	// disable when a chat request is in progress
					FocusInChatInput?.negate(),						// when already in chat input, disable this action and prefer to start voice chat directly
					EditorContextKeys.focus.negate(), 				// do not steal the inline-chat keybinding
					NOTEBOOK_EDITOR_FOCUSED.negate(),				// do not steal the notebook keybinding
					SearchContext.SearchViewFocusedKey.negate(),	// do not steal the search keybinding
					CONTEXT_SETTINGS_EDITOR.negate(),				// do not steal the settings editor keybinding
				),
				primary: KeyMod.CtrlCmd | KeyCode.KeyI
			}
		});
	}

	override async run(accessor: ServicesAccessor, context?: IChatExecuteActionContext): Promise<void> {

		// The intent of this action is to provide 2 modes to align with what `Ctrlcmd+I` in inline chat:
		// - if the user press and holds, we start voice chat in the chat view
		// - if the user press and releases quickly enough, we just open the chat view without voice chat

		const instantiationService = accessor.get(IInstantiationService);
		const keybindingService = accessor.get(IKeybindingService);
		const widgetService = accessor.get(IChatWidgetService);

		const holdMode = keybindingService.enableKeybindingHoldMode(HoldToVoiceChatInChatViewAction.ID);

		let session: IVoiceChatSession | undefined;
		const handle = disposableTimeout(async () => {
			const controller = await VoiceChatSessionControllerFactory.create(accessor, 'view');
			if (controller) {
				session = await VoiceChatSessions.getInstance(instantiationService).start(controller, context);
				session.setTimeoutDisabled(true);
			}
		}, VOICE_KEY_HOLD_THRESHOLD);

		(await widgetService.revealWidget())?.focusInput();

		await holdMode;
		handle.dispose();

		if (session) {
			session.accept();
		}
	}
}

export class InlineVoiceChatAction extends VoiceChatWithHoldModeAction {

	static readonly ID = 'workbench.action.chat.inlineVoiceChat';

	constructor() {
		super({
			id: InlineVoiceChatAction.ID,
			title: localize2('workbench.action.chat.inlineVoiceChat', "Inline Voice Chat"),
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(
				CanVoiceChat,
				ActiveEditorContext,
				ChatContextKeys.requestInProgress.negate() // disable when a chat request is in progress
			),
			f1: true
		}, 'inline');
	}
}

export class QuickVoiceChatAction extends VoiceChatWithHoldModeAction {

	static readonly ID = 'workbench.action.chat.quickVoiceChat';

	constructor() {
		super({
			id: QuickVoiceChatAction.ID,
			title: localize2('workbench.action.chat.quickVoiceChat.label', "Quick Voice Chat"),
			category: CHAT_CATEGORY,
			precondition: ContextKeyExpr.and(
				CanVoiceChat,
				ChatContextKeys.requestInProgress.negate() // disable when a chat request is in progress
			),
			f1: true
		}, 'quick');
	}
}

const primaryVoiceActionMenu = (when: ContextKeyExpression | undefined) => {
	return [
		{
			id: MenuId.ChatExecute,
			when: ContextKeyExpr.and(ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat), when),
			group: 'navigation',
			order: 3
		},
		{
			id: MenuId.ChatExecute,
			when: ContextKeyExpr.and(ChatContextKeys.location.isEqualTo(ChatAgentLocation.Chat).negate(), when),
			group: 'navigation',
			order: 2
		}
	];
};

export class StartVoiceChatAction extends Action2 {

	static readonly ID = 'workbench.action.chat.startVoiceChat';

	constructor() {
		super({
			id: StartVoiceChatAction.ID,
			title: localize2('workbench.action.chat.startVoiceChat.label', "Start Voice Chat"),
			category: CHAT_CATEGORY,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(
					FocusInChatInput,					// scope this action to chat input fields only
					EditorContextKeys.focus.negate(), 	// do not steal the editor inline-chat keybinding
					NOTEBOOK_EDITOR_FOCUSED.negate()	// do not steal the notebook inline-chat keybinding
				),
				primary: KeyMod.CtrlCmd | KeyCode.KeyI
			},
			icon: Codicon.mic,
			precondition: ContextKeyExpr.and(
				CanVoiceChat,
				ScopedVoiceChatGettingReady.negate(),	// disable when voice chat is getting ready
				AnyChatRequestInProgress?.negate(),		// disable when any chat request is in progress
				SpeechToTextInProgress.negate()			// disable when speech to text is in progress
			),
			menu: primaryVoiceActionMenu(ContextKeyExpr.and(
				HasSpeechProvider,
				ScopedChatSynthesisInProgress.negate(),	// hide when text to speech is in progress
				AnyScopedVoiceChatInProgress?.negate(),	// hide when voice chat is in progress
			))
		});
	}

	async run(accessor: ServicesAccessor, context?: IChatExecuteActionContext): Promise<void> {
		const widget = context?.widget;
		if (widget) {
			// if we already get a context when the action is executed
			// from a toolbar within the chat widget, then make sure
			// to move focus into the input field so that the controller
			// is properly retrieved
			widget.focusInput();
		}

		return startVoiceChatWithHoldMode(this.desc.id, accessor, 'focused', context);
	}
}

export class StopListeningAction extends Action2 {

	static readonly ID = 'workbench.action.chat.stopListening';

	constructor() {
		super({
			id: StopListeningAction.ID,
			title: localize2('workbench.action.chat.stopListening.label', "Stop Listening"),
			category: CHAT_CATEGORY,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 100,
				primary: KeyCode.Escape,
				when: AnyScopedVoiceChatInProgress
			},
			icon: spinningLoading,
			precondition: GlobalVoiceChatInProgress, // need global context here because of `f1: true`
			menu: primaryVoiceActionMenu(AnyScopedVoiceChatInProgress)
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		VoiceChatSessions.getInstance(accessor.get(IInstantiationService)).stop();
	}
}

export class StopListeningAndSubmitAction extends Action2 {

	static readonly ID = 'workbench.action.chat.stopListeningAndSubmit';

	constructor() {
		super({
			id: StopListeningAndSubmitAction.ID,
			title: localize2('workbench.action.chat.stopListeningAndSubmit.label', "Stop Listening and Submit"),
			category: CHAT_CATEGORY,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(
					FocusInChatInput,
					AnyScopedVoiceChatInProgress
				),
				primary: KeyMod.CtrlCmd | KeyCode.KeyI
			},
			precondition: GlobalVoiceChatInProgress // need global context here because of `f1: true`
		});
	}

	run(accessor: ServicesAccessor): void {
		VoiceChatSessions.getInstance(accessor.get(IInstantiationService)).accept();
	}
}

//#endregion

//#region Text to Speech

const ScopedChatSynthesisInProgress = new RawContextKey<boolean>('scopedChatSynthesisInProgress', false, { type: 'boolean', description: localize('scopedChatSynthesisInProgress', "Defined as a location where voice recording from microphone is in progress for voice chat. This key is only defined scoped, per chat context.") });

interface IChatSynthesizerSessionController {

	readonly onDidHideChat: Event<unknown>;

	readonly contextKeyService: IContextKeyService;
	readonly response: IChatResponseModel;
}

class ChatSynthesizerSessionController {

	static create(accessor: ServicesAccessor, context: IVoiceChatSessionController | 'focused', response: IChatResponseModel): IChatSynthesizerSessionController {
		if (context === 'focused') {
			return ChatSynthesizerSessionController.doCreateForFocusedChat(accessor, response);
		} else {
			return {
				onDidHideChat: context.onDidHideInput,
				contextKeyService: context.scopedContextKeyService,
				response
			};
		}
	}

	private static doCreateForFocusedChat(accessor: ServicesAccessor, response: IChatResponseModel): IChatSynthesizerSessionController {
		const chatWidgetService = accessor.get(IChatWidgetService);
		const contextKeyService = accessor.get(IContextKeyService);
		let chatWidget = chatWidgetService.getWidgetBySessionResource(response.session.sessionResource);
		if (chatWidget?.location === ChatAgentLocation.EditorInline) {
			// workaround for https://github.com/microsoft/vscode/issues/212785
			chatWidget = chatWidgetService.lastFocusedWidget;
		}

		return {
			onDidHideChat: chatWidget?.onDidHide ?? Event.None,
			contextKeyService: chatWidget?.scopedContextKeyService ?? contextKeyService,
			response
		};
	}
}

interface IChatSynthesizerContext {
	readonly ignoreCodeBlocks: boolean;
	insideCodeBlock: boolean;
}

class ChatSynthesizerSessions {

	private static instance: ChatSynthesizerSessions | undefined = undefined;
	static getInstance(instantiationService: IInstantiationService): ChatSynthesizerSessions {
		if (!ChatSynthesizerSessions.instance) {
			ChatSynthesizerSessions.instance = instantiationService.createInstance(ChatSynthesizerSessions);
		}

		return ChatSynthesizerSessions.instance;
	}

	private activeSession: CancellationTokenSource | undefined = undefined;

	constructor(
		@ISpeechService private readonly speechService: ISpeechService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	async start(controller: IChatSynthesizerSessionController): Promise<void> {

		// Stop running text-to-speech or speech-to-text sessions in chats
		this.stop();
		VoiceChatSessions.getInstance(this.instantiationService).stop();

		const activeSession = this.activeSession = new CancellationTokenSource();

		const disposables = new DisposableStore();
		disposables.add(activeSession.token.onCancellationRequested(() => disposables.dispose()));

		const session = await this.speechService.createTextToSpeechSession(activeSession.token, 'chat');

		if (activeSession.token.isCancellationRequested) {
			return;
		}

		disposables.add(controller.onDidHideChat(() => this.stop()));

		const scopedChatToSpeechInProgress = ScopedChatSynthesisInProgress.bindTo(controller.contextKeyService);
		disposables.add(toDisposable(() => scopedChatToSpeechInProgress.reset()));

		disposables.add(session.onDidChange(e => {
			switch (e.status) {
				case TextToSpeechStatus.Started:
					scopedChatToSpeechInProgress.set(true);
					break;
				case TextToSpeechStatus.Stopped:
					scopedChatToSpeechInProgress.reset();
					break;
			}
		}));

		for await (const chunk of this.nextChatResponseChunk(controller.response, activeSession.token)) {
			if (activeSession.token.isCancellationRequested) {
				return;
			}

			await raceCancellation(session.synthesize(chunk), activeSession.token);
		}
	}

	private async *nextChatResponseChunk(response: IChatResponseModel, token: CancellationToken): AsyncIterable<string> {
		const context: IChatSynthesizerContext = {
			ignoreCodeBlocks: this.configurationService.getValue<boolean>(AccessibilityVoiceSettingId.IgnoreCodeBlocks),
			insideCodeBlock: false
		};

		let totalOffset = 0;
		let complete = false;
		do {
			const responseLength = response.response.toString().length;
			const { chunk, offset } = this.parseNextChatResponseChunk(response, totalOffset, context);
			totalOffset = offset;
			complete = response.isComplete;

			if (chunk) {
				yield chunk;
			}

			if (token.isCancellationRequested) {
				return;
			}

			if (!complete && responseLength === response.response.toString().length) {
				await raceCancellation(Event.toPromise(response.onDidChange), token); // wait for the response to change
			}
		} while (!token.isCancellationRequested && !complete);
	}

	private parseNextChatResponseChunk(response: IChatResponseModel, offset: number, context: IChatSynthesizerContext): { readonly chunk: string | undefined; readonly offset: number } {
		let chunk: string | undefined = undefined;

		const text = response.response.toString();

		if (response.isComplete) {
			chunk = text.substring(offset);
			offset = text.length + 1;
		} else {
			const res = parseNextChatResponseChunk(text, offset);
			chunk = res.chunk;
			offset = res.offset;
		}

		if (chunk && context.ignoreCodeBlocks) {
			chunk = this.filterCodeBlocks(chunk, context);
		}

		return {
			chunk: chunk ? renderAsPlaintext({ value: chunk }) : chunk, // convert markdown to plain text
			offset
		};
	}

	private filterCodeBlocks(chunk: string, context: IChatSynthesizerContext): string {
		return chunk.split('\n')
			.filter(line => {
				if (line.trimStart().startsWith('```')) {
					context.insideCodeBlock = !context.insideCodeBlock;
					return false;
				}
				return !context.insideCodeBlock;
			})
			.join('\n');
	}

	stop(): void {
		this.activeSession?.dispose(true);
		this.activeSession = undefined;
	}
}

const sentenceDelimiter = ['.', '!', '?', ':'];
const lineDelimiter = '\n';
const wordDelimiter = ' ';

export function parseNextChatResponseChunk(text: string, offset: number): { readonly chunk: string | undefined; readonly offset: number } {
	let chunk: string | undefined = undefined;

	for (let i = text.length - 1; i >= offset; i--) { // going from end to start to produce largest chunks
		const cur = text[i];
		const next = text[i + 1];
		if (
			sentenceDelimiter.includes(cur) && next === wordDelimiter ||	// end of sentence
			lineDelimiter === cur											// end of line
		) {
			chunk = text.substring(offset, i + 1).trim();
			offset = i + 1;
			break;
		}
	}

	return { chunk, offset };
}

export class ReadChatResponseAloud extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.readChatResponseAloud',
			title: localize2('workbench.action.chat.readChatResponseAloud', "Read Aloud"),
			icon: Codicon.unmute,
			precondition: CanVoiceChat,
			menu: [{
				id: MenuId.ChatMessageFooter,
				when: ContextKeyExpr.and(
					CanVoiceChat,
					ChatContextKeys.isResponse,						// only for responses
					ScopedChatSynthesisInProgress.negate(),	// but not when already in progress
					ChatContextKeys.responseIsFiltered.negate(),		// and not when response is filtered
				),
				group: 'navigation',
				order: -10 // first
			}, {
				id: MENU_INLINE_CHAT_WIDGET_SECONDARY,
				when: ContextKeyExpr.and(
					CanVoiceChat,
					ChatContextKeys.isResponse,						// only for responses
					ScopedChatSynthesisInProgress.negate(),	// but not when already in progress
					ChatContextKeys.responseIsFiltered.negate()		// and not when response is filtered
				),
				group: 'navigation',
				order: -10 // first
			}]
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const instantiationService = accessor.get(IInstantiationService);
		const chatWidgetService = accessor.get(IChatWidgetService);

		let response: IChatResponseViewModel | undefined = undefined;
		if (args.length > 0) {
			const responseArg = args[0];
			if (isResponseVM(responseArg)) {
				response = responseArg;
			}
		} else {
			const chatWidget = chatWidgetService.lastFocusedWidget;
			if (chatWidget) {

				// pick focused response
				const focus = chatWidget.getFocus();
				if (focus instanceof ChatResponseViewModel) {
					response = focus;
				}

				// pick the last response
				else {
					const chatViewModel = chatWidget.viewModel;
					if (chatViewModel) {
						const items = chatViewModel.getItems();
						for (let i = items.length - 1; i >= 0; i--) {
							const item = items[i];
							if (isResponseVM(item)) {
								response = item;
								break;
							}
						}
					}
				}
			}
		}

		if (!response) {
			return;
		}

		const controller = ChatSynthesizerSessionController.create(accessor, 'focused', response.model);
		ChatSynthesizerSessions.getInstance(instantiationService).start(controller);
	}
}

export class StopReadAloud extends Action2 {

	static readonly ID = 'workbench.action.speech.stopReadAloud';

	constructor() {
		super({
			id: StopReadAloud.ID,
			icon: syncing,
			title: localize2('workbench.action.speech.stopReadAloud', "Stop Reading Aloud"),
			f1: true,
			category: CHAT_CATEGORY,
			precondition: GlobalTextToSpeechInProgress, // need global context here because of `f1: true`
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 100,
				primary: KeyCode.Escape,
				when: ScopedChatSynthesisInProgress
			},
			menu: primaryVoiceActionMenu(ScopedChatSynthesisInProgress)
		});
	}

	async run(accessor: ServicesAccessor) {
		ChatSynthesizerSessions.getInstance(accessor.get(IInstantiationService)).stop();
	}
}

export class StopReadChatItemAloud extends Action2 {

	static readonly ID = 'workbench.action.chat.stopReadChatItemAloud';

	constructor() {
		super({
			id: StopReadChatItemAloud.ID,
			icon: Codicon.mute,
			title: localize2('workbench.action.chat.stopReadChatItemAloud', "Stop Reading Aloud"),
			precondition: ScopedChatSynthesisInProgress,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 100,
				primary: KeyCode.Escape,
			},
			menu: [
				{
					id: MenuId.ChatMessageFooter,
					when: ContextKeyExpr.and(
						ScopedChatSynthesisInProgress,		// only when in progress
						ChatContextKeys.isResponse,					// only for responses
						ChatContextKeys.responseIsFiltered.negate()	// but not when response is filtered
					),
					group: 'navigation',
					order: -10 // first
				},
				{
					id: MENU_INLINE_CHAT_WIDGET_SECONDARY,
					when: ContextKeyExpr.and(
						ScopedChatSynthesisInProgress,		// only when in progress
						ChatContextKeys.isResponse,					// only for responses
						ChatContextKeys.responseIsFiltered.negate()	// but not when response is filtered
					),
					group: 'navigation',
					order: -10 // first
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		ChatSynthesizerSessions.getInstance(accessor.get(IInstantiationService)).stop();
	}
}

//#endregion

//#region Keyword Recognition

function supportsKeywordActivation(configurationService: IConfigurationService, speechService: ISpeechService, chatAgentService: IChatAgentService): boolean {
	if (!speechService.hasSpeechProvider || !chatAgentService.getDefaultAgent(ChatAgentLocation.Chat)) {
		return false;
	}

	const value = configurationService.getValue(KEYWORD_ACTIVIATION_SETTING_ID);

	return typeof value === 'string' && value !== KeywordActivationContribution.SETTINGS_VALUE.OFF;
}

export class KeywordActivationContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.keywordActivation';

	static SETTINGS_VALUE = {
		OFF: 'off',
		INLINE_CHAT: 'inlineChat',
		QUICK_CHAT: 'quickChat',
		VIEW_CHAT: 'chatInView',
		CHAT_IN_CONTEXT: 'chatInContext'
	};

	private activeSession: CancellationTokenSource | undefined = undefined;

	constructor(
		@ISpeechService private readonly speechService: ISpeechService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICommandService private readonly commandService: ICommandService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IHostService private readonly hostService: IHostService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
	) {
		super();

		this._register(instantiationService.createInstance(KeywordActivationStatusEntry));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(Event.runAndSubscribe(this.speechService.onDidChangeHasSpeechProvider, () => {
			this.updateConfiguration();
			this.handleKeywordActivation();
		}));

		const onDidAddDefaultAgent = this._register(this.chatAgentService.onDidChangeAgents(() => {
			if (this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat)) {
				this.updateConfiguration();
				this.handleKeywordActivation();

				onDidAddDefaultAgent.dispose();
			}
		}));

		this._register(this.speechService.onDidStartSpeechToTextSession(() => this.handleKeywordActivation()));
		this._register(this.speechService.onDidEndSpeechToTextSession(() => this.handleKeywordActivation()));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(KEYWORD_ACTIVIATION_SETTING_ID)) {
				this.handleKeywordActivation();
			}
		}));
	}

	private updateConfiguration(): void {
		if (!this.speechService.hasSpeechProvider || !this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat)) {
			return; // these settings require a speech and chat provider
		}

		const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		registry.registerConfiguration({
			...accessibilityConfigurationNodeBase,
			properties: {
				[KEYWORD_ACTIVIATION_SETTING_ID]: {
					'type': 'string',
					'enum': [
						KeywordActivationContribution.SETTINGS_VALUE.OFF,
						KeywordActivationContribution.SETTINGS_VALUE.VIEW_CHAT,
						KeywordActivationContribution.SETTINGS_VALUE.QUICK_CHAT,
						KeywordActivationContribution.SETTINGS_VALUE.INLINE_CHAT,
						KeywordActivationContribution.SETTINGS_VALUE.CHAT_IN_CONTEXT
					],
					'enumDescriptions': [
						localize('voice.keywordActivation.off', "Keyword activation is disabled."),
						localize('voice.keywordActivation.chatInView', "Keyword activation is enabled and listening for 'Hey Code' to start a voice chat session in the chat view."),
						localize('voice.keywordActivation.quickChat', "Keyword activation is enabled and listening for 'Hey Code' to start a voice chat session in the quick chat."),
						localize('voice.keywordActivation.inlineChat', "Keyword activation is enabled and listening for 'Hey Code' to start a voice chat session in the active editor if possible."),
						localize('voice.keywordActivation.chatInContext', "Keyword activation is enabled and listening for 'Hey Code' to start a voice chat session in the active editor or view depending on keyboard focus.")
					],
					'description': localize('voice.keywordActivation', "Controls whether the keyword phrase 'Hey Code' is recognized to start a voice chat session. Enabling this will start recording from the microphone but the audio is processed locally and never sent to a server."),
					'default': 'off',
					'tags': ['accessibility']
				}
			}
		});
	}

	private handleKeywordActivation(): void {
		const enabled =
			supportsKeywordActivation(this.configurationService, this.speechService, this.chatAgentService) &&
			!this.speechService.hasActiveSpeechToTextSession;
		if (
			(enabled && this.activeSession) ||
			(!enabled && !this.activeSession)
		) {
			return; // already running or stopped
		}

		// Start keyword activation
		if (enabled) {
			this.enableKeywordActivation();
		}

		// Stop keyword activation
		else {
			this.disableKeywordActivation();
		}
	}

	private async enableKeywordActivation(): Promise<void> {
		const session = this.activeSession = new CancellationTokenSource();
		const result = await this.speechService.recognizeKeyword(session.token);
		if (session.token.isCancellationRequested || session !== this.activeSession) {
			return; // cancelled
		}

		this.activeSession = undefined;

		if (result === KeywordRecognitionStatus.Recognized) {
			if (this.hostService.hasFocus) {
				this.commandService.executeCommand(this.getKeywordCommand());
			}

			// Immediately start another keyboard activation session
			// because we cannot assume that the command we execute
			// will trigger a speech recognition session.

			this.handleKeywordActivation();
		}
	}

	private getKeywordCommand(): string {
		const setting = this.configurationService.getValue(KEYWORD_ACTIVIATION_SETTING_ID);
		switch (setting) {
			case KeywordActivationContribution.SETTINGS_VALUE.INLINE_CHAT:
				return InlineVoiceChatAction.ID;
			case KeywordActivationContribution.SETTINGS_VALUE.QUICK_CHAT:
				return QuickVoiceChatAction.ID;
			case KeywordActivationContribution.SETTINGS_VALUE.CHAT_IN_CONTEXT: {
				const activeCodeEditor = getCodeEditor(this.editorService.activeTextEditorControl);
				if (activeCodeEditor?.hasWidgetFocus()) {
					return InlineVoiceChatAction.ID;
				}
			}
			default:
				return VoiceChatInChatViewAction.ID;
		}
	}

	private disableKeywordActivation(): void {
		this.activeSession?.dispose(true);
		this.activeSession = undefined;
	}

	override dispose(): void {
		this.activeSession?.dispose();

		super.dispose();
	}
}

class KeywordActivationStatusEntry extends Disposable {

	private readonly entry = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	private static STATUS_NAME = localize('keywordActivation.status.name', "Voice Keyword Activation");
	private static STATUS_COMMAND = 'keywordActivation.status.command';
	private static STATUS_ACTIVE = localize('keywordActivation.status.active', "Listening to 'Hey Code'...");
	private static STATUS_INACTIVE = localize('keywordActivation.status.inactive', "Waiting for voice chat to end...");

	constructor(
		@ISpeechService private readonly speechService: ISpeechService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService
	) {
		super();

		this._register(CommandsRegistry.registerCommand(KeywordActivationStatusEntry.STATUS_COMMAND, () => this.commandService.executeCommand('workbench.action.openSettings', KEYWORD_ACTIVIATION_SETTING_ID)));

		this.registerListeners();
		this.updateStatusEntry();
	}

	private registerListeners(): void {
		this._register(this.speechService.onDidStartKeywordRecognition(() => this.updateStatusEntry()));
		this._register(this.speechService.onDidEndKeywordRecognition(() => this.updateStatusEntry()));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(KEYWORD_ACTIVIATION_SETTING_ID)) {
				this.updateStatusEntry();
			}
		}));
	}

	private updateStatusEntry(): void {
		const visible = supportsKeywordActivation(this.configurationService, this.speechService, this.chatAgentService);
		if (visible) {
			if (!this.entry.value) {
				this.createStatusEntry();
			}

			this.updateStatusLabel();
		} else {
			this.entry.clear();
		}
	}

	private createStatusEntry() {
		this.entry.value = this.statusbarService.addEntry(this.getStatusEntryProperties(), 'status.voiceKeywordActivation', StatusbarAlignment.RIGHT, 103);
	}

	private getStatusEntryProperties(): IStatusbarEntry {
		return {
			name: KeywordActivationStatusEntry.STATUS_NAME,
			text: this.speechService.hasActiveKeywordRecognition ? '$(mic-filled)' : '$(mic)',
			tooltip: this.speechService.hasActiveKeywordRecognition ? KeywordActivationStatusEntry.STATUS_ACTIVE : KeywordActivationStatusEntry.STATUS_INACTIVE,
			ariaLabel: this.speechService.hasActiveKeywordRecognition ? KeywordActivationStatusEntry.STATUS_ACTIVE : KeywordActivationStatusEntry.STATUS_INACTIVE,
			command: KeywordActivationStatusEntry.STATUS_COMMAND,
			kind: 'prominent',
			showInAllWindows: true
		};
	}

	private updateStatusLabel(): void {
		this.entry.value?.update(this.getStatusEntryProperties());
	}
}

//#endregion

registerThemingParticipant((theme, collector) => {
	let activeRecordingColor: Color | undefined;
	let activeRecordingDimmedColor: Color | undefined;
	if (!isHighContrast(theme.type)) {
		activeRecordingColor = theme.getColor(ACTIVITY_BAR_FOREGROUND) ?? theme.getColor(focusBorder);
		activeRecordingDimmedColor = activeRecordingColor?.transparent(0.38);
	} else {
		activeRecordingColor = theme.getColor(contrastBorder);
		activeRecordingDimmedColor = theme.getColor(contrastBorder);
	}

	// Show a "microphone" or "pulse" icon when speech-to-text or text-to-speech is in progress that glows via outline.
	collector.addRule(`
		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled),
		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled) {
			color: ${activeRecordingColor};
			outline: 1px solid ${activeRecordingColor};
			outline-offset: -1px;
			animation: pulseAnimation 1s infinite;
			border-radius: 50%;
		}

		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled)::before,
		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled)::before {
			position: absolute;
			outline: 1px solid ${activeRecordingColor};
			outline-offset: 2px;
			border-radius: 50%;
			width: 16px;
			height: 16px;
		}

		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled)::after,
		.monaco-workbench.monaco-enable-motion .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled)::after {
			outline: 2px solid ${activeRecordingColor};
			outline-offset: -1px;
			animation: pulseAnimation 1500ms cubic-bezier(0.75, 0, 0.25, 1) infinite;
		}

		@keyframes pulseAnimation {
			0% {
				outline-width: 2px;
			}
			62% {
				outline-width: 5px;
				outline-color: ${activeRecordingDimmedColor};
			}
			100% {
				outline-width: 2px;
			}
		}
	`);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/electron-browser/actions/media/voiceChatActions.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/electron-browser/actions/media/voiceChatActions.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * Replace "loading" with "microphone" icon.
 */
.monaco-workbench .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled)::before {
	content: var(--vscode-icon-mic-filled-content);
	font-family: var(--vscode-icon-mic-filled-font-family);
}

/*
 * Replace "sync" with "pulse" icon.
 */
.monaco-workbench .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled)::before {
	content: var(--vscode-icon-pulse-content);
	font-family: var(--vscode-icon-pulse-font-family);
}

/*
 * Clear animation styles when reduced motion is enabled.
 */
.monaco-workbench.monaco-reduce-motion .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled),
.monaco-workbench.monaco-reduce-motion .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled) {
	animation: none;
}

/*
 * Replace with "stop" icon when reduced motion is enabled.
 */
.monaco-workbench.monaco-reduce-motion .interactive-input-part .monaco-action-bar .action-label.codicon-sync.codicon-modifier-spin:not(.disabled)::before,
.monaco-workbench.monaco-reduce-motion .interactive-input-part .monaco-action-bar .action-label.codicon-loading.codicon-modifier-spin:not(.disabled)::before {
	content: var(--vscode-icon-debug-stop-content);
	font-family: var(--vscode-icon-debug-stop-font-family);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/electron-browser/tools/fetchPageTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/electron-browser/tools/fetchPageTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../../base/common/assert.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { extname } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IWebContentExtractorService, WebContentExtractResult } from '../../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { detectEncodingFromBuffer } from '../../../../services/textfile/common/encoding.js';
import { ITrustedDomainService } from '../../../url/browser/trustedDomainService.js';
import { IChatService } from '../../common/chatService.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';
import { ChatImageMimeType } from '../../common/languageModels.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, IToolResultDataPart, IToolResultTextPart, ToolDataSource, ToolProgress } from '../../common/languageModelToolsService.js';
import { InternalFetchWebPageToolId } from '../../common/tools/tools.js';

export const FetchWebPageToolData: IToolData = {
	id: InternalFetchWebPageToolId,
	displayName: 'Fetch Web Page',
	canBeReferencedInPrompt: false,
	modelDescription: 'Fetches the main content from a web page. This tool is useful for summarizing or analyzing the content of a webpage.',
	source: ToolDataSource.Internal,
	canRequestPostApproval: true,
	canRequestPreApproval: true,
	inputSchema: {
		type: 'object',
		properties: {
			urls: {
				type: 'array',
				items: {
					type: 'string',
				},
				description: localize('fetchWebPage.urlsDescription', 'An array of URLs to fetch content from.')
			}
		},
		required: ['urls']
	}
};

export interface IFetchWebPageToolParams {
	urls?: string[];
}

type ResultType = string | { type: 'tooldata'; value: IToolResultDataPart } | { type: 'extracted'; value: WebContentExtractResult } | undefined;

export class FetchWebPageTool implements IToolImpl {

	constructor(
		@IWebContentExtractorService private readonly _readerModeService: IWebContentExtractorService,
		@IFileService private readonly _fileService: IFileService,
		@ITrustedDomainService private readonly _trustedDomainService: ITrustedDomainService,
		@IChatService private readonly _chatService: IChatService,
	) { }

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const urls = (invocation.parameters as IFetchWebPageToolParams).urls || [];
		const { webUris, fileUris, invalidUris } = this._parseUris(urls);
		const allValidUris = [...webUris.values(), ...fileUris.values()];

		if (!allValidUris.length && invalidUris.size === 0) {
			return {
				content: [{ kind: 'text', value: localize('fetchWebPage.noValidUrls', 'No valid URLs provided.') }]
			};
		}

		// Get contents from web URIs
		const webContents = webUris.size > 0 ? await this._readerModeService.extract([...webUris.values()]) : [];

		// Get contents from file URIs
		const fileContents: (string | { type: 'tooldata'; value: IToolResultDataPart } | undefined)[] = [];
		const successfulFileUris: URI[] = [];
		for (const uri of fileUris.values()) {
			try {
				const fileContent = await this._fileService.readFile(uri, undefined, token);

				// Check if this is a supported image type first
				const imageMimeType = this._getSupportedImageMimeType(uri);
				if (imageMimeType) {
					// For supported image files, return as IToolResultDataPart
					fileContents.push({
						type: 'tooldata',
						value: {
							kind: 'data',
							value: {
								mimeType: imageMimeType,
								data: fileContent.value
							}
						}
					});
				} else {
					// Check if the content is binary
					const detected = detectEncodingFromBuffer({ buffer: fileContent.value, bytesRead: fileContent.value.byteLength });

					if (detected.seemsBinary) {
						// For binary files, return a message indicating they're not supported
						// We do this for now until the tools that leverage this internal tool can support binary content
						fileContents.push(localize('fetchWebPage.binaryNotSupported', 'Binary files are not supported at the moment.'));
					} else {
						// For text files, convert to string
						fileContents.push(fileContent.value.toString());
					}
				}

				successfulFileUris.push(uri);
			} catch (error) {
				// If file service can't read it, treat as invalid
				fileContents.push(undefined);
			}
		}

		// Build results array in original order
		const results: ResultType[] = [];
		let webIndex = 0;
		let fileIndex = 0;
		for (const url of urls) {
			if (invalidUris.has(url)) {
				results.push(undefined);
			} else if (webUris.has(url)) {
				results.push({ type: 'extracted', value: webContents[webIndex] });
				webIndex++;
			} else if (fileUris.has(url)) {
				results.push(fileContents[fileIndex]);
				fileIndex++;
			} else {
				results.push(undefined);
			}
		}

		// Skip confirming any results if every web content we got was an error or redirect
		let confirmResults: undefined | boolean;
		if (webContents.every(e => e.status === 'error' || e.status === 'redirect')) {
			confirmResults = false;
		}


		// Only include URIs that actually had content successfully fetched
		const actuallyValidUris = [...webUris.values(), ...successfulFileUris];

		return {
			content: this._getPromptPartsForResults(urls, results),
			toolResultDetails: actuallyValidUris,
			confirmResults,
		};
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const { webUris, fileUris, invalidUris } = this._parseUris(context.parameters.urls);

		// Check which file URIs can actually be read
		const validFileUris: URI[] = [];
		const additionalInvalidUrls: string[] = [];
		for (const [originalUrl, uri] of fileUris.entries()) {
			try {
				await this._fileService.stat(uri);
				validFileUris.push(uri);
			} catch (error) {
				// If file service can't stat it, treat as invalid
				additionalInvalidUrls.push(originalUrl);
			}
		}

		const invalid = [...Array.from(invalidUris), ...additionalInvalidUrls];
		const urlsNeedingConfirmation = new ResourceSet([...webUris.values(), ...validFileUris]);

		const pastTenseMessage = invalid.length
			? invalid.length > 1
				// If there are multiple invalid URLs, show them all
				? new MarkdownString(
					localize(
						'fetchWebPage.pastTenseMessage.plural',
						'Fetched {0} resources, but the following were invalid URLs:\n\n{1}\n\n', urlsNeedingConfirmation.size, invalid.map(url => `- ${url}`).join('\n')
					))
				// If there is only one invalid URL, show it
				: new MarkdownString(
					localize(
						'fetchWebPage.pastTenseMessage.singular',
						'Fetched resource, but the following was an invalid URL:\n\n{0}\n\n', invalid[0]
					))
			// No invalid URLs
			: new MarkdownString();

		const invocationMessage = new MarkdownString();
		if (urlsNeedingConfirmation.size > 1) {
			pastTenseMessage.appendMarkdown(localize('fetchWebPage.pastTenseMessageResult.plural', 'Fetched {0} resources', urlsNeedingConfirmation.size));
			invocationMessage.appendMarkdown(localize('fetchWebPage.invocationMessage.plural', 'Fetching {0} resources', urlsNeedingConfirmation.size));
		} else if (urlsNeedingConfirmation.size === 1) {
			const url = Iterable.first(urlsNeedingConfirmation)!.toString(true);
			// If the URL is too long or it's a file url, show it as a link... otherwise, show it as plain text
			if (url.length > 400 || validFileUris.length === 1) {
				pastTenseMessage.appendMarkdown(localize({
					key: 'fetchWebPage.pastTenseMessageResult.singularAsLink',
					comment: [
						// Make sure the link syntax is correct
						'{Locked="]({0})"}',
					]
				}, 'Fetched [resource]({0})', url));
				invocationMessage.appendMarkdown(localize({
					key: 'fetchWebPage.invocationMessage.singularAsLink',
					comment: [
						// Make sure the link syntax is correct
						'{Locked="]({0})"}',
					]
				}, 'Fetching [resource]({0})', url));
			} else {
				pastTenseMessage.appendMarkdown(localize('fetchWebPage.pastTenseMessageResult.singular', 'Fetched {0}', url));
				invocationMessage.appendMarkdown(localize('fetchWebPage.invocationMessage.singular', 'Fetching {0}', url));
			}
		}

		if (context.chatSessionId) {
			const model = this._chatService.getSession(LocalChatSessionUri.forSession(context.chatSessionId));
			const userMessages = model?.getRequests().map(r => r.message.text.toLowerCase());
			for (const uri of urlsNeedingConfirmation) {
				// Normalize to lowercase and remove any trailing slash
				const toToCheck = uri.toString(true).toLowerCase().replace(/\/$/, '');
				if (userMessages?.some(m => m.includes(toToCheck))) {
					urlsNeedingConfirmation.delete(uri);
				}
			}
		}

		const result: IPreparedToolInvocation = { invocationMessage, pastTenseMessage };
		const allDomainsTrusted = Iterable.every(urlsNeedingConfirmation, u => this._trustedDomainService.isValid(u));
		let confirmationTitle: string | undefined;
		let confirmationMessage: string | MarkdownString | undefined;

		if (urlsNeedingConfirmation.size && !allDomainsTrusted) {
			if (urlsNeedingConfirmation.size === 1) {
				confirmationTitle = localize('fetchWebPage.confirmationTitle.singular', 'Fetch web page?');
				confirmationMessage = new MarkdownString(
					Iterable.first(urlsNeedingConfirmation)!.toString(true),
					{ supportThemeIcons: true }
				);
			} else {
				confirmationTitle = localize('fetchWebPage.confirmationTitle.plural', 'Fetch web pages?');
				confirmationMessage = new MarkdownString(
					[...urlsNeedingConfirmation].map(uri => `- ${uri.toString(true)}`).join('\n'),
					{ supportThemeIcons: true }
				);
			}
		}
		result.confirmationMessages = {
			title: confirmationTitle,
			message: confirmationMessage,
			confirmResults: urlsNeedingConfirmation.size > 0,
			allowAutoConfirm: true,
			disclaimer: new MarkdownString('$(info) ' + localize('fetchWebPage.confirmationMessage.plural', 'Web content may contain malicious code or attempt prompt injection attacks.'), { supportThemeIcons: true })
		};
		return result;
	}

	private _parseUris(urls?: string[]): { webUris: Map<string, URI>; fileUris: Map<string, URI>; invalidUris: Set<string> } {
		const webUris = new Map<string, URI>();
		const fileUris = new Map<string, URI>();
		const invalidUris = new Set<string>();

		urls?.forEach(url => {
			try {
				const uriObj = URI.parse(url);
				if (uriObj.scheme === 'http' || uriObj.scheme === 'https') {
					webUris.set(url, uriObj);
				} else {
					// Try to handle other schemes via file service
					fileUris.set(url, uriObj);
				}
			} catch (e) {
				invalidUris.add(url);
			}
		});

		return { webUris, fileUris, invalidUris };
	}

	private _getPromptPartsForResults(urls: string[], results: ResultType[]): (IToolResultTextPart | IToolResultDataPart)[] {
		return results.map((value, i) => {
			const title = results.length > 1 ? localize('fetchWebPage.fetchedFrom', 'Fetched from {0}', urls[i]) : undefined;
			if (!value) {
				return {
					kind: 'text',
					title,
					value: localize('fetchWebPage.invalidUrl', 'Invalid URL')
				};
			} else if (typeof value === 'string') {
				return {
					kind: 'text',
					title,
					value: value
				};
			} else if (value.type === 'tooldata') {
				return { ...value.value, title };
			} else if (value.type === 'extracted') {
				switch (value.value.status) {
					case 'ok':
						return { kind: 'text', title, value: value.value.result };
					case 'redirect':
						return { kind: 'text', title, value: `The webpage has redirected to "${value.value.toURI.toString(true)}". Use the ${InternalFetchWebPageToolId} again to get its contents.` };
					case 'error':
						return { kind: 'text', title, value: `An error occurred retrieving the fetch result: ${value.value.error}` };
					default:
						assertNever(value.value);
				}
			} else {
				throw new Error('unreachable');
			}
		});
	}

	private _getSupportedImageMimeType(uri: URI): ChatImageMimeType | undefined {
		const ext = extname(uri.path).toLowerCase();
		switch (ext) {
			case '.png':
				return ChatImageMimeType.PNG;
			case '.jpg':
			case '.jpeg':
				return ChatImageMimeType.JPEG;
			case '.gif':
				return ChatImageMimeType.GIF;
			case '.webp':
				return ChatImageMimeType.WEBP;
			case '.bmp':
				return ChatImageMimeType.BMP;
			default:
				return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/agentSessionsDataSource.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/agentSessionsDataSource.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AgentSessionsDataSource, AgentSessionListItem, IAgentSessionsFilter } from '../../browser/agentSessions/agentSessionsViewer.js';
import { AgentSessionSection, IAgentSession, IAgentSessionSection, IAgentSessionsModel, isAgentSessionSection } from '../../browser/agentSessions/agentSessionsModel.js';
import { ChatSessionStatus, isSessionInProgressStatus } from '../../common/chatSessionsService.js';
import { ITreeSorter } from '../../../../../base/browser/ui/tree/tree.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';

suite('AgentSessionsDataSource', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const ONE_DAY = 24 * 60 * 60 * 1000;
	const WEEK_THRESHOLD = 7 * ONE_DAY; // 7 days

	function createMockSession(overrides: Partial<{
		id: string;
		status: ChatSessionStatus;
		isArchived: boolean;
		startTime: number;
		endTime: number;
	}> = {}): IAgentSession {
		const now = Date.now();
		return {
			providerType: 'test',
			providerLabel: 'Test',
			resource: URI.parse(`test://session/${overrides.id ?? 'default'}`),
			status: overrides.status ?? ChatSessionStatus.Completed,
			label: `Session ${overrides.id ?? 'default'}`,
			icon: Codicon.terminal,
			timing: {
				startTime: overrides.startTime ?? now,
				endTime: overrides.endTime ?? now,
			},
			isArchived: () => overrides.isArchived ?? false,
			setArchived: () => { },
			isRead: () => true,
			setRead: () => { },
		};
	}

	function createMockModel(sessions: IAgentSession[]): IAgentSessionsModel {
		return {
			sessions,
			getSession: () => undefined,
			onWillResolve: Event.None,
			onDidResolve: Event.None,
			onDidChangeSessions: Event.None,
			resolve: async () => { },
		};
	}

	function createMockFilter(options: {
		groupResults: boolean;
		exclude?: (session: IAgentSession) => boolean;
	}): IAgentSessionsFilter {
		return {
			onDidChange: Event.None,
			groupResults: () => options.groupResults,
			exclude: options.exclude ?? (() => false),
		};
	}

	function createMockSorter(): ITreeSorter<IAgentSession> {
		return {
			compare: (a, b) => {
				// Sort by end time, most recent first
				const aTime = a.timing.endTime || a.timing.startTime;
				const bTime = b.timing.endTime || b.timing.startTime;
				return bTime - aTime;
			}
		};
	}

	function getSectionsFromResult(result: Iterable<AgentSessionListItem>): IAgentSessionSection[] {
		return Array.from(result).filter((item): item is IAgentSessionSection => isAgentSessionSection(item));
	}

	suite('groupSessionsIntoSections', () => {

		test('returns flat list when groupResults is false', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', startTime: now, endTime: now }),
				createMockSession({ id: '2', startTime: now - ONE_DAY, endTime: now - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: false });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));

			// Should be a flat list without sections
			assert.strictEqual(result.length, 2);
			assert.strictEqual(getSectionsFromResult(result).length, 0);
		});

		test('groups active sessions first with header', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.InProgress, startTime: now - ONE_DAY }),
				createMockSession({ id: '3', status: ChatSessionStatus.NeedsInput, startTime: now - 2 * ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));

			// First item should be the In Progress section header
			const firstItem = result[0];
			assert.ok(isAgentSessionSection(firstItem), 'First item should be a section header');
			assert.strictEqual((firstItem as IAgentSessionSection).section, AgentSessionSection.InProgress);
			// Verify the sessions in the section have active status
			const activeSessions = (firstItem as IAgentSessionSection).sessions;
			assert.ok(activeSessions.every(s => isSessionInProgressStatus(s.status) || s.status === ChatSessionStatus.NeedsInput));
		});

		test('adds Today header when there are active sessions', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.InProgress, startTime: now - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));
			const sections = getSectionsFromResult(result);

			// Now all sections have headers, so we expect In Progress and Today sections
			assert.strictEqual(sections.length, 2);
			assert.strictEqual(sections[0].section, AgentSessionSection.InProgress);
			assert.strictEqual(sections[1].section, AgentSessionSection.Today);
		});

		test('adds Today header when there are no active sessions', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.Completed, startTime: now - ONE_DAY, endTime: now - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));
			const sections = getSectionsFromResult(result);

			// Now all sections have headers, so Today section should be present
			assert.strictEqual(sections.filter(s => s.section === AgentSessionSection.Today).length, 1);
		});

		test('adds Older header for sessions older than week threshold', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.Completed, startTime: now - WEEK_THRESHOLD - ONE_DAY, endTime: now - WEEK_THRESHOLD - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));
			const sections = getSectionsFromResult(result);

			assert.strictEqual(sections.filter(s => s.section === AgentSessionSection.Older).length, 1);
		});

		test('adds Archived header for archived sessions', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.Completed, isArchived: true, startTime: now - ONE_DAY, endTime: now - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));
			const sections = getSectionsFromResult(result);

			assert.strictEqual(sections.filter(s => s.section === AgentSessionSection.Archived).length, 1);
		});

		test('archived sessions come after older sessions', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, isArchived: true, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.Completed, startTime: now - WEEK_THRESHOLD - ONE_DAY, endTime: now - WEEK_THRESHOLD - ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));

			const olderIndex = result.findIndex(item => isAgentSessionSection(item) && item.section === AgentSessionSection.Older);
			const archivedIndex = result.findIndex(item => isAgentSessionSection(item) && item.section === AgentSessionSection.Archived);

			assert.ok(olderIndex < archivedIndex, 'Older section should come before Archived section');
		});

		test('correct order: active, today, week, older, archived', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: 'archived', status: ChatSessionStatus.Completed, isArchived: true, startTime: now, endTime: now }),
				createMockSession({ id: 'today', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: 'week', status: ChatSessionStatus.Completed, startTime: now - 3 * ONE_DAY, endTime: now - 3 * ONE_DAY }),
				createMockSession({ id: 'old', status: ChatSessionStatus.Completed, startTime: now - WEEK_THRESHOLD - ONE_DAY, endTime: now - WEEK_THRESHOLD - ONE_DAY }),
				createMockSession({ id: 'active', status: ChatSessionStatus.InProgress, startTime: now }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));

			// All sections now have headers
			// In Progress section
			assert.ok(isAgentSessionSection(result[0]));
			assert.strictEqual((result[0] as IAgentSessionSection).section, AgentSessionSection.InProgress);
			assert.strictEqual((result[0] as IAgentSessionSection).sessions[0].label, 'Session active');

			// Today section
			assert.ok(isAgentSessionSection(result[1]));
			assert.strictEqual((result[1] as IAgentSessionSection).section, AgentSessionSection.Today);
			assert.strictEqual((result[1] as IAgentSessionSection).sessions[0].label, 'Session today');

			// Week section
			assert.ok(isAgentSessionSection(result[2]));
			assert.strictEqual((result[2] as IAgentSessionSection).section, AgentSessionSection.Week);
			assert.strictEqual((result[2] as IAgentSessionSection).sessions[0].label, 'Session week');

			// Older section
			assert.ok(isAgentSessionSection(result[3]));
			assert.strictEqual((result[3] as IAgentSessionSection).section, AgentSessionSection.Older);
			assert.strictEqual((result[3] as IAgentSessionSection).sessions[0].label, 'Session old');

			// Archived section
			assert.ok(isAgentSessionSection(result[4]));
			assert.strictEqual((result[4] as IAgentSessionSection).section, AgentSessionSection.Archived);
			assert.strictEqual((result[4] as IAgentSessionSection).sessions[0].label, 'Session archived');
		});

		test('empty sessions returns empty result', () => {
			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel([]);
			const result = Array.from(dataSource.getChildren(mockModel));

			assert.strictEqual(result.length, 0);
		});

		test('only today sessions produces a Today section header', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: '1', status: ChatSessionStatus.Completed, startTime: now, endTime: now }),
				createMockSession({ id: '2', status: ChatSessionStatus.Completed, startTime: now - 1000, endTime: now - 1000 }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));
			const sections = getSectionsFromResult(result);

			// All sections now have headers, so a Today section should be present
			assert.strictEqual(sections.length, 1);
			assert.strictEqual(sections[0].section, AgentSessionSection.Today);
			assert.strictEqual(sections[0].sessions.length, 2);
		});

		test('sessions are sorted within each group', () => {
			const now = Date.now();
			const sessions = [
				createMockSession({ id: 'old1', status: ChatSessionStatus.Completed, startTime: now - WEEK_THRESHOLD - 2 * ONE_DAY, endTime: now - WEEK_THRESHOLD - 2 * ONE_DAY }),
				createMockSession({ id: 'old2', status: ChatSessionStatus.Completed, startTime: now - WEEK_THRESHOLD - ONE_DAY, endTime: now - WEEK_THRESHOLD - ONE_DAY }),
				createMockSession({ id: 'week1', status: ChatSessionStatus.Completed, startTime: now - 3 * ONE_DAY, endTime: now - 3 * ONE_DAY }),
				createMockSession({ id: 'week2', status: ChatSessionStatus.Completed, startTime: now - 2 * ONE_DAY, endTime: now - 2 * ONE_DAY }),
			];

			const filter = createMockFilter({ groupResults: true });
			const sorter = createMockSorter();
			const dataSource = new AgentSessionsDataSource(filter, sorter);

			const mockModel = createMockModel(sessions);
			const result = Array.from(dataSource.getChildren(mockModel));

			// All sections now have headers
			// Week section should be first and contain sorted sessions
			const weekSection = result.find((item): item is IAgentSessionSection => isAgentSessionSection(item) && item.section === AgentSessionSection.Week);
			assert.ok(weekSection);
			assert.strictEqual(weekSection.sessions[0].label, 'Session week2');
			assert.strictEqual(weekSection.sessions[1].label, 'Session week1');

			// Older section with sorted sessions
			const olderSection = result.find((item): item is IAgentSessionSection => isAgentSessionSection(item) && item.section === AgentSessionSection.Older);
			assert.ok(olderSection);
			assert.strictEqual(olderSection.sessions[0].label, 'Session old2');
			assert.strictEqual(olderSection.sessions[1].label, 'Session old1');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/agentSessionViewModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/agentSessionViewModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AgentSessionsModel, IAgentSession, isAgentSession, isAgentSessionsModel, isLocalAgentSessionItem } from '../../browser/agentSessions/agentSessionsModel.js';
import { AgentSessionsFilter } from '../../browser/agentSessions/agentSessionsFilter.js';
import { ChatSessionStatus, IChatSessionItem, IChatSessionItemProvider, IChatSessionsService, localChatSessionType } from '../../common/chatSessionsService.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';
import { MockChatSessionsService } from '../common/mockChatSessionsService.js';
import { TestLifecycleService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { AgentSessionProviders, getAgentSessionProviderIcon, getAgentSessionProviderName } from '../../browser/agentSessions/agentSessions.js';

suite('Agent Sessions', () => {

	suite('AgentSessionsViewModel', () => {

		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let mockLifecycleService: TestLifecycleService;
		let viewModel: AgentSessionsModel;
		let instantiationService: TestInstantiationService;

		function createViewModel(): AgentSessionsModel {
			return disposables.add(instantiationService.createInstance(
				AgentSessionsModel,
			));
		}

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			mockLifecycleService = disposables.add(new TestLifecycleService());
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
			instantiationService.stub(ILifecycleService, mockLifecycleService);
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should initialize with empty sessions', () => {
			viewModel = createViewModel();

			assert.strictEqual(viewModel.sessions.length, 0);
		});

		test('should resolve sessions from providers', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1', {
							label: 'Test Session 1'
						}),
						makeSimpleSessionItem('session-2', {
							label: 'Test Session 2'
						})
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 2);
				assert.strictEqual(viewModel.sessions[0].resource.toString(), 'test://session-1');
				assert.strictEqual(viewModel.sessions[0].label, 'Test Session 1');
				assert.strictEqual(viewModel.sessions[1].resource.toString(), 'test://session-2');
				assert.strictEqual(viewModel.sessions[1].label, 'Test Session 2');
			});
		});

		test('should resolve sessions from multiple providers', async () => {
			return runWithFakedTimers({}, async () => {
				const provider1: IChatSessionItemProvider = {
					chatSessionType: 'type-1',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				const provider2: IChatSessionItemProvider = {
					chatSessionType: 'type-2',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-2'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider1);
				mockChatSessionsService.registerChatSessionItemProvider(provider2);

				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 2);
				assert.strictEqual(viewModel.sessions[0].resource.toString(), 'test://session-1');
				assert.strictEqual(viewModel.sessions[1].resource.toString(), 'test://session-2');
			});
		});

		test('should fire onWillResolve and onDidResolve events', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => []
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				let willResolveFired = false;
				let didResolveFired = false;

				disposables.add(viewModel.onWillResolve(() => {
					willResolveFired = true;
					assert.strictEqual(didResolveFired, false, 'onDidResolve should not fire before onWillResolve completes');
				}));

				disposables.add(viewModel.onDidResolve(() => {
					didResolveFired = true;
					assert.strictEqual(willResolveFired, true, 'onWillResolve should fire before onDidResolve');
				}));

				await viewModel.resolve(undefined);

				assert.strictEqual(willResolveFired, true, 'onWillResolve should have fired');
				assert.strictEqual(didResolveFired, true, 'onDidResolve should have fired');
			});
		});

		test('should fire onDidChangeSessions event after resolving', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				let sessionsChangedFired = false;
				disposables.add(viewModel.onDidChangeSessions(() => {
					sessionsChangedFired = true;
				}));

				await viewModel.resolve(undefined);

				assert.strictEqual(sessionsChangedFired, true, 'onDidChangeSessions should have fired');
			});
		});

		test('should handle session with all properties', async () => {
			return runWithFakedTimers({}, async () => {
				const startTime = Date.now();
				const endTime = startTime + 1000;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							description: new MarkdownString('**Bold** description'),
							status: ChatSessionStatus.Completed,
							tooltip: 'Session tooltip',
							iconPath: ThemeIcon.fromId('check'),
							timing: { startTime, endTime },
							changes: { files: 1, insertions: 10, deletions: 5, details: [] }
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 1);
				const session = viewModel.sessions[0];
				assert.strictEqual(session.resource.toString(), 'test://session-1');
				assert.strictEqual(session.label, 'Test Session');
				assert.ok(session.description instanceof MarkdownString);
				if (session.description instanceof MarkdownString) {
					assert.strictEqual(session.description.value, '**Bold** description');
				}
				assert.strictEqual(session.status, ChatSessionStatus.Completed);
				assert.strictEqual(session.timing.startTime, startTime);
				assert.strictEqual(session.timing.endTime, endTime);
				assert.deepStrictEqual(session.changes, { files: 1, insertions: 10, deletions: 5 });
			});
		});

		test('should handle resolve with specific provider', async () => {
			return runWithFakedTimers({}, async () => {
				const provider1: IChatSessionItemProvider = {
					chatSessionType: 'type-1',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				const provider2: IChatSessionItemProvider = {
					chatSessionType: 'type-2',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							id: 'session-2',
							resource: URI.parse('test://session-2'),
							label: 'Session 2',
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider1);
				mockChatSessionsService.registerChatSessionItemProvider(provider2);

				viewModel = createViewModel();

				// First resolve all
				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 2);

				// Now resolve only type-1
				await viewModel.resolve('type-1');
				// Should still have both sessions, but only type-1 was re-resolved
				assert.strictEqual(viewModel.sessions.length, 2);
			});
		});

		test('should handle resolve with multiple specific providers', async () => {
			return runWithFakedTimers({}, async () => {
				const provider1: IChatSessionItemProvider = {
					chatSessionType: 'type-1',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				const provider2: IChatSessionItemProvider = {
					chatSessionType: 'type-2',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-2'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider1);
				mockChatSessionsService.registerChatSessionItemProvider(provider2);

				viewModel = createViewModel();

				await viewModel.resolve(['type-1', 'type-2']);

				assert.strictEqual(viewModel.sessions.length, 2);
			});
		});

		test('should respond to onDidChangeItemsProviders event', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				const sessionsChangedPromise = Event.toPromise(viewModel.onDidChangeSessions);

				// Trigger event - this should automatically call resolve
				mockChatSessionsService.fireDidChangeItemsProviders(provider);

				// Wait for the sessions to be resolved
				await sessionsChangedPromise;

				assert.strictEqual(viewModel.sessions.length, 1);
			});
		});

		test('should respond to onDidChangeAvailability event', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				const sessionsChangedPromise = Event.toPromise(viewModel.onDidChangeSessions);

				// Trigger event - this should automatically call resolve
				mockChatSessionsService.fireDidChangeAvailability();

				// Wait for the sessions to be resolved
				await sessionsChangedPromise;

				assert.strictEqual(viewModel.sessions.length, 1);
			});
		});

		test('should respond to onDidChangeSessionItems event', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				const sessionsChangedPromise = Event.toPromise(viewModel.onDidChangeSessions);

				// Trigger event - this should automatically call resolve
				mockChatSessionsService.fireDidChangeSessionItems('test-type');

				// Wait for the sessions to be resolved
				await sessionsChangedPromise;

				assert.strictEqual(viewModel.sessions.length, 1);
			});
		});

		test('should maintain provider reference in session view model', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 1);
				assert.strictEqual(viewModel.sessions[0].providerType, 'test-type');
			});
		});

		test('should handle empty provider results', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => []
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 0);
			});
		});

		test('should handle sessions with different statuses', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							id: 'session-failed',
							resource: URI.parse('test://session-failed'),
							label: 'Failed Session',
							status: ChatSessionStatus.Failed,
							timing: makeNewSessionTiming()
						},
						{
							id: 'session-completed',
							resource: URI.parse('test://session-completed'),
							label: 'Completed Session',
							status: ChatSessionStatus.Completed,
							timing: makeNewSessionTiming()
						},
						{
							id: 'session-inprogress',
							resource: URI.parse('test://session-inprogress'),
							label: 'In Progress Session',
							status: ChatSessionStatus.InProgress,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 3);
				assert.strictEqual(viewModel.sessions[0].status, ChatSessionStatus.Failed);
				assert.strictEqual(viewModel.sessions[1].status, ChatSessionStatus.Completed);
				assert.strictEqual(viewModel.sessions[2].status, ChatSessionStatus.InProgress);
			});
		});

		test('should replace sessions on re-resolve', async () => {
			return runWithFakedTimers({}, async () => {
				let sessionCount = 1;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						const sessions: IChatSessionItem[] = [];
						for (let i = 0; i < sessionCount; i++) {
							sessions.push(makeSimpleSessionItem(`session-${i + 1}`));
						}
						return sessions;
					}
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 1);

				sessionCount = 3;
				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 3);
			});
		});

		test('should handle local agent session type specially', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: localChatSessionType,
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							id: 'local-session',
							resource: LocalChatSessionUri.forSession('local-session'),
							label: 'Local Session',
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 1);
				assert.strictEqual(viewModel.sessions[0].providerType, localChatSessionType);
			});
		});

		test('should correctly construct resource URIs for sessions', async () => {
			return runWithFakedTimers({}, async () => {
				const resource = URI.parse('custom://my-session/path');

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: resource,
							label: 'Test Session',
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				await viewModel.resolve(undefined);

				assert.strictEqual(viewModel.sessions.length, 1);
				assert.strictEqual(viewModel.sessions[0].resource.toString(), resource.toString());
			});
		});

		test('should throttle multiple rapid resolve calls', async () => {
			return runWithFakedTimers({}, async () => {
				let providerCallCount = 0;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						providerCallCount++;
						return [
							makeSimpleSessionItem('session-1'),
						];
					}
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = createViewModel();

				// Make multiple rapid resolve calls
				const resolvePromises = [
					viewModel.resolve(undefined),
					viewModel.resolve(undefined),
					viewModel.resolve(undefined)
				];

				await Promise.all(resolvePromises);

				// Should only call provider once due to throttling
				assert.strictEqual(providerCallCount, 1);
				assert.strictEqual(viewModel.sessions.length, 1);
			});
		});

		test('should preserve sessions from non-resolved providers', async () => {
			return runWithFakedTimers({}, async () => {
				let provider1CallCount = 0;
				let provider2CallCount = 0;

				const provider1: IChatSessionItemProvider = {
					chatSessionType: 'type-1',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						provider1CallCount++;
						return [
							{
								resource: URI.parse('test://session-1'),
								label: `Session 1 (call ${provider1CallCount})`,
								timing: makeNewSessionTiming()
							}
						];
					}
				};

				const provider2: IChatSessionItemProvider = {
					chatSessionType: 'type-2',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						provider2CallCount++;
						return [
							{
								resource: URI.parse('test://session-2'),
								label: `Session 2 (call ${provider2CallCount})`,
								timing: makeNewSessionTiming()
							}
						];
					}
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider1);
				mockChatSessionsService.registerChatSessionItemProvider(provider2);

				viewModel = createViewModel();

				// First resolve all
				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 2);
				assert.strictEqual(provider1CallCount, 1);
				assert.strictEqual(provider2CallCount, 1);
				const originalSession1Label = viewModel.sessions[0].label;

				// Now resolve only type-2
				await viewModel.resolve('type-2');

				// Should still have both sessions
				assert.strictEqual(viewModel.sessions.length, 2);
				// Provider 1 should not be called again
				assert.strictEqual(provider1CallCount, 1);
				// Provider 2 should be called again
				assert.strictEqual(provider2CallCount, 2);
				// Session 1 should be preserved with original label
				assert.strictEqual(viewModel.sessions.find(s => s.resource.toString() === 'test://session-1')?.label, originalSession1Label);
			});
		});

		test('should accumulate providers when resolve is called with different provider types', async () => {
			return runWithFakedTimers({}, async () => {
				let resolveCount = 0;
				const resolvedProviders: (string | undefined)[] = [];

				const provider1: IChatSessionItemProvider = {
					chatSessionType: 'type-1',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						resolveCount++;
						resolvedProviders.push('type-1');
						return [makeSimpleSessionItem('session-1'),];
					}
				};

				const provider2: IChatSessionItemProvider = {
					chatSessionType: 'type-2',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						resolveCount++;
						resolvedProviders.push('type-2');
						return [{
							resource: URI.parse('test://session-2'),
							label: 'Session 2',
							timing: makeNewSessionTiming()
						}];
					}
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider1);
				mockChatSessionsService.registerChatSessionItemProvider(provider2);

				viewModel = createViewModel();

				// Call resolve with different types rapidly - they should accumulate
				const promise1 = viewModel.resolve('type-1');
				const promise2 = viewModel.resolve(['type-2']);

				await Promise.all([promise1, promise2]);

				// Both providers should be resolved
				assert.strictEqual(viewModel.sessions.length, 2);
			});
		});
	});

	suite('AgentSessionsViewModel - Helper Functions', () => {
		const disposables = new DisposableStore();

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('isLocalAgentSessionItem should identify local sessions', () => {
			const localSession: IAgentSession = {
				providerType: localChatSessionType,
				providerLabel: 'Local',
				icon: Codicon.chatSparkle,
				resource: URI.parse('test://local-1'),
				label: 'Local',
				description: 'test',
				timing: makeNewSessionTiming(),
				status: ChatSessionStatus.Completed,
				isArchived: () => false,
				setArchived: archived => { },
				isRead: () => false,
				setRead: read => { }
			};

			const remoteSession: IAgentSession = {
				providerType: 'remote',
				providerLabel: 'Remote',
				icon: Codicon.chatSparkle,
				resource: URI.parse('test://remote-1'),
				label: 'Remote',
				description: 'test',
				timing: makeNewSessionTiming(),
				status: ChatSessionStatus.Completed,
				isArchived: () => false,
				setArchived: archived => { },
				isRead: () => false,
				setRead: read => { }
			};

			assert.strictEqual(isLocalAgentSessionItem(localSession), true);
			assert.strictEqual(isLocalAgentSessionItem(remoteSession), false);
		});

		test('isAgentSession should identify session view models', () => {
			const session: IAgentSession = {
				providerType: 'test',
				providerLabel: 'Local',
				icon: Codicon.chatSparkle,
				resource: URI.parse('test://test-1'),
				label: 'Test',
				description: 'test',
				timing: makeNewSessionTiming(),
				status: ChatSessionStatus.Completed,
				isArchived: () => false,
				setArchived: archived => { },
				isRead: () => false,
				setRead: read => { }
			};

			// Test with a session object
			assert.strictEqual(isAgentSession(session), true);

			// Test with a sessions container - pass as session to see it returns false
			const sessionOrContainer: IAgentSession = session;
			assert.strictEqual(isAgentSession(sessionOrContainer), true);
		});

		test('isAgentSessionsViewModel should identify sessions view models', () => {
			const session: IAgentSession = {
				providerType: 'test',
				providerLabel: 'Local',
				icon: Codicon.chatSparkle,
				resource: URI.parse('test://test-1'),
				label: 'Test',
				description: 'test',
				timing: makeNewSessionTiming(),
				status: ChatSessionStatus.Completed,
				isArchived: () => false,
				setArchived: archived => { },
				isRead: () => false,
				setRead: read => { }
			};

			// Test with actual view model
			const instantiationService = workbenchInstantiationService(undefined, disposables);
			const lifecycleService = disposables.add(new TestLifecycleService());
			instantiationService.stub(IChatSessionsService, new MockChatSessionsService());
			instantiationService.stub(ILifecycleService, lifecycleService);
			const actualViewModel = disposables.add(instantiationService.createInstance(
				AgentSessionsModel,
			));
			assert.strictEqual(isAgentSessionsModel(actualViewModel), true);

			// Test with session object
			assert.strictEqual(isAgentSessionsModel(session), false);
		});
	});

	suite('AgentSessionsFilter', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let instantiationService: TestInstantiationService;

		function createSession(overrides: Partial<IAgentSession> = {}): IAgentSession {
			return {
				providerType: 'test-type',
				providerLabel: 'Test Provider',
				icon: Codicon.chatSparkle,
				resource: URI.parse('test://session'),
				label: 'Test Session',
				timing: makeNewSessionTiming(),
				status: ChatSessionStatus.Completed,
				isArchived: () => false,
				setArchived: () => { },
				isRead: () => false,
				setRead: read => { },
				...overrides
			};
		}

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should initialize with default excludes', () => {
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			// Default: archived sessions should be excluded
			const archivedSession = createSession({
				isArchived: () => true
			});
			const activeSession = createSession({
				isArchived: () => false
			});

			assert.strictEqual(filter.exclude(archivedSession), true);
			assert.strictEqual(filter.exclude(activeSession), false);
		});

		test('should filter out sessions from excluded provider', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session1 = createSession({
				providerType: 'type-1',
				resource: URI.parse('test://session-1')
			});

			const session2 = createSession({
				providerType: 'type-2',
				resource: URI.parse('test://session-2')
			});

			// Initially, no sessions should be filtered by provider
			assert.strictEqual(filter.exclude(session1), false);
			assert.strictEqual(filter.exclude(session2), false);

			// Exclude type-1 by setting it in storage
			const excludes = {
				providers: ['type-1'],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// After excluding type-1, session1 should be filtered but not session2
			assert.strictEqual(filter.exclude(session1), true);
			assert.strictEqual(filter.exclude(session2), false);
		});

		test('should filter out multiple excluded providers', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session1 = createSession({ providerType: 'type-1' });
			const session2 = createSession({ providerType: 'type-2' });
			const session3 = createSession({ providerType: 'type-3' });

			// Exclude type-1 and type-2
			const excludes = {
				providers: ['type-1', 'type-2'],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			assert.strictEqual(filter.exclude(session1), true);
			assert.strictEqual(filter.exclude(session2), true);
			assert.strictEqual(filter.exclude(session3), false);
		});

		test('should filter out archived sessions', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const archivedSession = createSession({
				resource: URI.parse('test://archived-session'),
				isArchived: () => true
			});

			const activeSession = createSession({
				resource: URI.parse('test://active-session'),
				isArchived: () => false
			});

			// By default, archived sessions should be filtered (archived: true in default excludes)
			assert.strictEqual(filter.exclude(archivedSession), true);
			assert.strictEqual(filter.exclude(activeSession), false);

			// Include archived by setting archived to false in storage
			const excludes = {
				providers: [],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// After including archived, both sessions should not be filtered
			assert.strictEqual(filter.exclude(archivedSession), false);
			assert.strictEqual(filter.exclude(activeSession), false);
		});

		test('should filter out sessions with excluded status', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const failedSession = createSession({
				resource: URI.parse('test://failed-session'),
				status: ChatSessionStatus.Failed
			});

			const completedSession = createSession({
				resource: URI.parse('test://completed-session'),
				status: ChatSessionStatus.Completed
			});

			const inProgressSession = createSession({
				resource: URI.parse('test://inprogress-session'),
				status: ChatSessionStatus.InProgress
			});

			// Initially, no sessions should be filtered by status (archived is default exclude)
			assert.strictEqual(filter.exclude(failedSession), false);
			assert.strictEqual(filter.exclude(completedSession), false);
			assert.strictEqual(filter.exclude(inProgressSession), false);

			// Exclude failed status by setting it in storage
			const excludes = {
				providers: [],
				states: [ChatSessionStatus.Failed],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// After excluding failed status, only failedSession should be filtered
			assert.strictEqual(filter.exclude(failedSession), true);
			assert.strictEqual(filter.exclude(completedSession), false);
			assert.strictEqual(filter.exclude(inProgressSession), false);
		});

		test('should filter out multiple excluded statuses', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const failedSession = createSession({ status: ChatSessionStatus.Failed });
			const completedSession = createSession({ status: ChatSessionStatus.Completed });
			const inProgressSession = createSession({ status: ChatSessionStatus.InProgress });

			// Exclude failed and in-progress
			const excludes = {
				providers: [],
				states: [ChatSessionStatus.Failed, ChatSessionStatus.InProgress],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			assert.strictEqual(filter.exclude(failedSession), true);
			assert.strictEqual(filter.exclude(completedSession), false);
			assert.strictEqual(filter.exclude(inProgressSession), true);
		});

		test('should combine multiple filter conditions', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session1 = createSession({
				providerType: 'type-1',
				status: ChatSessionStatus.Failed,
				isArchived: () => true
			});

			const session2 = createSession({
				providerType: 'type-2',
				status: ChatSessionStatus.Completed,
				isArchived: () => false
			});

			// Exclude type-1, failed status, and archived
			const excludes = {
				providers: ['type-1'],
				states: [ChatSessionStatus.Failed],
				archived: true
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// session1 should be excluded for multiple reasons
			assert.strictEqual(filter.exclude(session1), true);
			// session2 should not be excluded
			assert.strictEqual(filter.exclude(session2), false);
		});

		test('should emit onDidChange when excludes are updated', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			let changeEventFired = false;
			disposables.add(filter.onDidChange(() => {
				changeEventFired = true;
			}));

			// Update excludes
			const excludes = {
				providers: ['type-1'],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			assert.strictEqual(changeEventFired, true);
		});

		test('should handle storage updates from other windows', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session = createSession({ providerType: 'type-1' });

			// Initially not excluded
			assert.strictEqual(filter.exclude(session), false);

			// Simulate storage update from another window
			const excludes = {
				providers: ['type-1'],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// Should now be excluded
			assert.strictEqual(filter.exclude(session), true);
		});

		test('should register provider filter actions', () => {
			const provider1: IChatSessionItemProvider = {
				chatSessionType: 'custom-type-1',
				onDidChangeChatSessionItems: Event.None,
				provideChatSessionItems: async () => []
			};

			mockChatSessionsService.registerChatSessionItemProvider(provider1);

			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			// Filter should work with custom provider
			const session = createSession({ providerType: 'custom-type-1' });
			assert.strictEqual(filter.exclude(session), false);
		});

		test('should handle providers registered after filter creation', () => {
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const provider: IChatSessionItemProvider = {
				chatSessionType: 'new-type',
				onDidChangeChatSessionItems: Event.None,
				provideChatSessionItems: async () => []
			};

			// Register provider after filter creation
			mockChatSessionsService.registerChatSessionItemProvider(provider);
			mockChatSessionsService.fireDidChangeItemsProviders(provider);

			// Filter should work with new provider
			const session = createSession({ providerType: 'new-type' });
			assert.strictEqual(filter.exclude(session), false);
		});

		test('should not exclude when all filters are disabled', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session = createSession({
				providerType: 'type-1',
				status: ChatSessionStatus.Failed,
				isArchived: () => true
			});

			// Disable all filters
			const excludes = {
				providers: [],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// Nothing should be excluded
			assert.strictEqual(filter.exclude(session), false);
		});

		test('should handle empty provider list in storage', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session = createSession({ providerType: 'type-1' });

			// Set empty provider list
			const excludes = {
				providers: [],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			assert.strictEqual(filter.exclude(session), false);
		});

		test('should handle different MenuId contexts', () => {
			const storageService = instantiationService.get(IStorageService);

			// Create two filters with different menu IDs
			const filter1 = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const filter2 = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewItemContext }
			));

			const session = createSession({ providerType: 'type-1' });

			// Set excludes only for ViewTitle
			const excludes = {
				providers: ['type-1'],
				states: [],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// filter1 should exclude the session
			assert.strictEqual(filter1.exclude(session), true);
			// filter2 should not exclude the session (different storage key)
			assert.strictEqual(filter2.exclude(session), false);
		});

		test('should handle malformed storage data gracefully', () => {
			const storageService = instantiationService.get(IStorageService);

			// Store malformed JSON
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, 'invalid json', StorageScope.PROFILE, StorageTarget.USER);

			// Filter should still be created with default excludes
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const archivedSession = createSession({ isArchived: () => true });
			// Default behavior: archived should be excluded
			assert.strictEqual(filter.exclude(archivedSession), true);
		});

		test('should prioritize archived check first', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const session = createSession({
				providerType: 'type-1',
				status: ChatSessionStatus.Completed,
				isArchived: () => true
			});

			// Set excludes for provider and status, but include archived
			const excludes = {
				providers: ['type-1'],
				states: [ChatSessionStatus.Completed],
				archived: true
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			// Should be excluded due to archived (checked first)
			assert.strictEqual(filter.exclude(session), true);
		});

		test('should handle all three status types correctly', () => {
			const storageService = instantiationService.get(IStorageService);
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			const completedSession = createSession({ status: ChatSessionStatus.Completed });
			const inProgressSession = createSession({ status: ChatSessionStatus.InProgress });
			const failedSession = createSession({ status: ChatSessionStatus.Failed });

			// Exclude all statuses
			const excludes = {
				providers: [],
				states: [ChatSessionStatus.Completed, ChatSessionStatus.InProgress, ChatSessionStatus.Failed],
				archived: false
			};
			storageService.store(`agentSessions.filterExcludes.${MenuId.ViewTitle.id.toLowerCase()}`, JSON.stringify(excludes), StorageScope.PROFILE, StorageTarget.USER);

			assert.strictEqual(filter.exclude(completedSession), true);
			assert.strictEqual(filter.exclude(inProgressSession), true);
			assert.strictEqual(filter.exclude(failedSession), true);
		});
	});

	suite('AgentSessionsViewModel - Session Archiving', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let instantiationService: TestInstantiationService;
		let viewModel: AgentSessionsModel;

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
			instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should archive and unarchive sessions', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.isArchived(), false);

				// Archive the session
				session.setArchived(true);
				assert.strictEqual(session.isArchived(), true);

				// Unarchive the session
				session.setArchived(false);
				assert.strictEqual(session.isArchived(), false);
			});
		});

		test('should fire onDidChangeSessions when archiving', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				let changeEventFired = false;
				disposables.add(viewModel.onDidChangeSessions(() => {
					changeEventFired = true;
				}));

				session.setArchived(true);
				assert.strictEqual(changeEventFired, true);
			});
		});

		test('should not fire onDidChangeSessions when archiving with same value', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				session.setArchived(true);

				let changeEventFired = false;
				disposables.add(viewModel.onDidChangeSessions(() => {
					changeEventFired = true;
				}));

				// Try to archive again with same value
				session.setArchived(true);
				assert.strictEqual(changeEventFired, false);
			});
		});

		test('should preserve archived state from provider', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							archived: true,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.isArchived(), true);
			});
		});

		test('should override provider archived state with user preference', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							archived: true,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.isArchived(), true);

				// User unarchives
				session.setArchived(false);
				assert.strictEqual(session.isArchived(), false);

				// Re-resolve should preserve user preference
				await viewModel.resolve(undefined);
				const sessionAfterResolve = viewModel.sessions[0];
				assert.strictEqual(sessionAfterResolve.isArchived(), false);
			});
		});
	});

	suite('AgentSessionsViewModel - Session Read State', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let instantiationService: TestInstantiationService;
		let viewModel: AgentSessionsModel;

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
			instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should mark session as read and unread', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];

				// Mark as read
				session.setRead(true);
				assert.strictEqual(session.isRead(), true);

				// Mark as unread
				session.setRead(false);
				assert.strictEqual(session.isRead(), false);
			});
		});

		test('should fire onDidChangeSessions when marking as read', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				session.setRead(false); // ensure it's unread first

				let changeEventFired = false;
				disposables.add(viewModel.onDidChangeSessions(() => {
					changeEventFired = true;
				}));

				session.setRead(true);
				assert.strictEqual(changeEventFired, true);
			});
		});

		test('should not fire onDidChangeSessions when marking as read with same value', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				session.setRead(true);

				let changeEventFired = false;
				disposables.add(viewModel.onDidChangeSessions(() => {
					changeEventFired = true;
				}));

				// Try to mark as read again with same value
				session.setRead(true);
				assert.strictEqual(changeEventFired, false);
			});
		});

		test('should preserve read state after re-resolve', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				session.setRead(true);
				assert.strictEqual(session.isRead(), true);

				// Re-resolve should preserve read state
				await viewModel.resolve(undefined);
				const sessionAfterResolve = viewModel.sessions[0];
				assert.strictEqual(sessionAfterResolve.isRead(), true);
			});
		});

		test('should consider sessions before initial date as read by default', async () => {
			return runWithFakedTimers({}, async () => {
				// Session with timing before the READ_STATE_INITIAL_DATE (December 8, 2025)
				const oldSessionTiming = {
					startTime: Date.UTC(2025, 10 /* November */, 1),
					endTime: Date.UTC(2025, 10 /* November */, 2),
				};

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://old-session'),
							label: 'Old Session',
							timing: oldSessionTiming,
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				// Sessions before the initial date should be considered read
				assert.strictEqual(session.isRead(), true);
			});
		});

		test('should consider sessions after initial date as unread by default', async () => {
			return runWithFakedTimers({}, async () => {
				// Session with timing after the READ_STATE_INITIAL_DATE (December 8, 2025)
				const newSessionTiming = {
					startTime: Date.UTC(2025, 11 /* December */, 10),
					endTime: Date.UTC(2025, 11 /* December */, 11),
				};

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://new-session'),
							label: 'New Session',
							timing: newSessionTiming,
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				// Sessions after the initial date should be considered unread
				assert.strictEqual(session.isRead(), false);
			});
		});

		test('should use endTime for read state comparison when available', async () => {
			return runWithFakedTimers({}, async () => {
				// Session with startTime before initial date but endTime after
				const sessionTiming = {
					startTime: Date.UTC(2025, 10 /* November */, 1),
					endTime: Date.UTC(2025, 11 /* December */, 10),
				};

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-with-endtime'),
							label: 'Session With EndTime',
							timing: sessionTiming,
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				// Should use endTime (December 10) which is after the initial date
				assert.strictEqual(session.isRead(), false);
			});
		});

		test('should use startTime for read state comparison when endTime is not available', async () => {
			return runWithFakedTimers({}, async () => {
				// Session with only startTime before initial date
				const sessionTiming = {
					startTime: Date.UTC(2025, 10 /* November */, 1),
				};

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-no-endtime'),
							label: 'Session Without EndTime',
							timing: sessionTiming,
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				// Should use startTime (November 1) which is before the initial date
				assert.strictEqual(session.isRead(), true);
			});
		});
	});

	suite('AgentSessionsViewModel - State Tracking', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let instantiationService: TestInstantiationService;
		let viewModel: AgentSessionsModel;

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
			instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should track status transitions', async () => {
			return runWithFakedTimers({}, async () => {
				let sessionStatus = ChatSessionStatus.InProgress;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							status: sessionStatus,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions[0].status, ChatSessionStatus.InProgress);

				// Change status
				sessionStatus = ChatSessionStatus.Completed;
				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions[0].status, ChatSessionStatus.Completed);
			});
		});

		test('should track inProgressTime when transitioning to InProgress', async () => {
			return runWithFakedTimers({}, async () => {
				let sessionStatus = ChatSessionStatus.Completed;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							status: sessionStatus,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);
				const session1 = viewModel.sessions[0];
				assert.strictEqual(session1.timing.inProgressTime, undefined);

				// Change to InProgress
				sessionStatus = ChatSessionStatus.InProgress;
				await viewModel.resolve(undefined);
				const session2 = viewModel.sessions[0];
				assert.notStrictEqual(session2.timing.inProgressTime, undefined);
			});
		});

		test('should track finishedOrFailedTime when transitioning from InProgress', async () => {
			return runWithFakedTimers({}, async () => {
				let sessionStatus = ChatSessionStatus.InProgress;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							status: sessionStatus,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);
				const session1 = viewModel.sessions[0];
				assert.strictEqual(session1.timing.finishedOrFailedTime, undefined);

				// Change to Completed
				sessionStatus = ChatSessionStatus.Completed;
				await viewModel.resolve(undefined);
				const session2 = viewModel.sessions[0];
				assert.notStrictEqual(session2.timing.finishedOrFailedTime, undefined);
			});
		});

		test('should clean up state tracking for removed sessions', async () => {
			return runWithFakedTimers({}, async () => {
				let includeSessions = true;

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => {
						if (includeSessions) {
							return [
								makeSimpleSessionItem('session-1'),
							];
						}
						return [];
					}
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 1);

				// Remove sessions
				includeSessions = false;
				await viewModel.resolve(undefined);
				assert.strictEqual(viewModel.sessions.length, 0);
			});
		});
	});

	suite('AgentSessionsViewModel - Provider Icons and Names', () => {
		const disposables = new DisposableStore();

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should return correct name for Local provider', () => {
			const name = getAgentSessionProviderName(AgentSessionProviders.Local);
			assert.ok(name.length > 0);
		});

		test('should return correct name for Background provider', () => {
			const name = getAgentSessionProviderName(AgentSessionProviders.Background);
			assert.ok(name.length > 0);
		});

		test('should return correct name for Cloud provider', () => {
			const name = getAgentSessionProviderName(AgentSessionProviders.Cloud);
			assert.ok(name.length > 0);
		});

		test('should return correct icon for Local provider', () => {
			const icon = getAgentSessionProviderIcon(AgentSessionProviders.Local);
			assert.strictEqual(icon.id, Codicon.vm.id);
		});

		test('should return correct icon for Background provider', () => {
			const icon = getAgentSessionProviderIcon(AgentSessionProviders.Background);
			assert.strictEqual(icon.id, Codicon.worktree.id);
		});

		test('should return correct icon for Cloud provider', () => {
			const icon = getAgentSessionProviderIcon(AgentSessionProviders.Cloud);
			assert.strictEqual(icon.id, Codicon.cloud.id);
		});

		test('should handle Local provider type in model', async () => {
			return runWithFakedTimers({}, async () => {
				const instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
				const mockChatSessionsService = new MockChatSessionsService();
				instantiationService.stub(IChatSessionsService, mockChatSessionsService);
				instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));

				const provider: IChatSessionItemProvider = {
					chatSessionType: AgentSessionProviders.Local,
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				const viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.providerType, AgentSessionProviders.Local);
				assert.strictEqual(session.icon.id, Codicon.vm.id);
				assert.strictEqual(session.providerLabel, getAgentSessionProviderName(AgentSessionProviders.Local));
			});
		});

		test('should handle Background provider type in model', async () => {
			return runWithFakedTimers({}, async () => {
				const instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
				const mockChatSessionsService = new MockChatSessionsService();
				instantiationService.stub(IChatSessionsService, mockChatSessionsService);
				instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));

				const provider: IChatSessionItemProvider = {
					chatSessionType: AgentSessionProviders.Background,
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				const viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.providerType, AgentSessionProviders.Background);
				assert.strictEqual(session.icon.id, Codicon.worktree.id);
				assert.strictEqual(session.providerLabel, getAgentSessionProviderName(AgentSessionProviders.Background));
			});
		});

		test('should handle Cloud provider type in model', async () => {
			return runWithFakedTimers({}, async () => {
				const instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
				const mockChatSessionsService = new MockChatSessionsService();
				instantiationService.stub(IChatSessionsService, mockChatSessionsService);
				instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));

				const provider: IChatSessionItemProvider = {
					chatSessionType: AgentSessionProviders.Cloud,
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				const viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.providerType, AgentSessionProviders.Cloud);
				assert.strictEqual(session.icon.id, Codicon.cloud.id);
				assert.strictEqual(session.providerLabel, getAgentSessionProviderName(AgentSessionProviders.Cloud));
			});
		});

		test('should use custom icon from session item', async () => {
			return runWithFakedTimers({}, async () => {
				const instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
				const mockChatSessionsService = new MockChatSessionsService();
				instantiationService.stub(IChatSessionsService, mockChatSessionsService);
				instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));

				const customIcon = ThemeIcon.fromId('beaker');
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'custom-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						{
							resource: URI.parse('test://session-1'),
							label: 'Test Session',
							iconPath: customIcon,
							timing: makeNewSessionTiming()
						}
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				const viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.icon.id, customIcon.id);
			});
		});

		test('should use default icon for custom provider without iconPath', async () => {
			return runWithFakedTimers({}, async () => {
				const instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
				const mockChatSessionsService = new MockChatSessionsService();
				instantiationService.stub(IChatSessionsService, mockChatSessionsService);
				instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService()));

				const provider: IChatSessionItemProvider = {
					chatSessionType: 'custom-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				const viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				await viewModel.resolve(undefined);

				const session = viewModel.sessions[0];
				assert.strictEqual(session.icon.id, Codicon.terminal.id);
			});
		});
	});

	suite('AgentSessionsViewModel - Cancellation and Lifecycle', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let mockLifecycleService: TestLifecycleService;
		let instantiationService: TestInstantiationService;
		let viewModel: AgentSessionsModel;

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			mockLifecycleService = disposables.add(new TestLifecycleService());
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
			instantiationService.stub(ILifecycleService, mockLifecycleService);
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should not resolve if lifecycle will shutdown', async () => {
			return runWithFakedTimers({}, async () => {
				const provider: IChatSessionItemProvider = {
					chatSessionType: 'test-type',
					onDidChangeChatSessionItems: Event.None,
					provideChatSessionItems: async () => [
						makeSimpleSessionItem('session-1'),
					]
				};

				mockChatSessionsService.registerChatSessionItemProvider(provider);
				viewModel = disposables.add(instantiationService.createInstance(AgentSessionsModel));

				// Set willShutdown to true
				mockLifecycleService.willShutdown = true;

				await viewModel.resolve(undefined);

				// Should not resolve sessions
				assert.strictEqual(viewModel.sessions.length, 0);
			});
		});
	});

	suite('AgentSessionsFilter - Dynamic Provider Registration', () => {
		const disposables = new DisposableStore();
		let mockChatSessionsService: MockChatSessionsService;
		let instantiationService: TestInstantiationService;

		setup(() => {
			mockChatSessionsService = new MockChatSessionsService();
			instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
			instantiationService.stub(IChatSessionsService, mockChatSessionsService);
		});

		teardown(() => {
			disposables.clear();
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		test('should respond to onDidChangeAvailability', () => {
			const filter = disposables.add(instantiationService.createInstance(
				AgentSessionsFilter,
				{ filterMenuId: MenuId.ViewTitle }
			));

			disposables.add(filter.onDidChange(() => {
				// Event handler registered to verify filter responds to availability changes
			}));

			// Trigger availability change
			mockChatSessionsService.fireDidChangeAvailability();

			// Filter should update its actions (internally)
			// We can't directly test action registration but we verified event handling
		});
	});

}); // End of Agent Sessions suite

function makeSimpleSessionItem(id: string, overrides?: Partial<IChatSessionItem>): IChatSessionItem {
	return {
		resource: URI.parse(`test://${id}`),
		label: `Session ${id}`,
		timing: makeNewSessionTiming(),
		...overrides
	};
}

function makeNewSessionTiming(): IChatSessionItem['timing'] {
	return {
		startTime: Date.now(),
	};
}
```

--------------------------------------------------------------------------------

````

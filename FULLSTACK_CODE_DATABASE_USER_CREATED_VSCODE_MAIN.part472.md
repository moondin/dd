---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 472
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 472 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminal.suggest.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminal.suggest.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import * as dom from '../../../../../base/browser/dom.js';
import { AutoOpenBarrier } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { DisposableStore, MutableDisposable, toDisposable, Disposable, DisposableMap } from '../../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { localize2 } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerActiveInstanceAction, registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalSuggestCommandId } from '../common/terminal.suggest.js';
import { terminalSuggestConfigSection, TerminalSuggestSettingId, type ITerminalSuggestConfiguration, registerTerminalSuggestProvidersConfiguration, type ITerminalSuggestProviderInfo } from '../common/terminalSuggestConfiguration.js';
import { ITerminalCompletionService, TerminalCompletionService } from './terminalCompletionService.js';
import { ITerminalContributionService } from '../../../terminal/common/terminalExtensionPoints.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { SuggestAddon } from './terminalSuggestAddon.js';
import { TerminalClipboardContribution } from '../../clipboard/browser/terminal.clipboard.contribution.js';
import { SimpleSuggestContext } from '../../../../services/suggest/browser/simpleSuggestWidget.js';
import { SuggestDetailsClassName } from '../../../../services/suggest/browser/simpleSuggestWidgetDetails.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import './terminalSymbolIcons.js';
import { LspCompletionProviderAddon } from './lspCompletionProviderAddon.js';
import { createTerminalLanguageVirtualUri, LspTerminalModelContentProvider } from './lspTerminalModelContentProvider.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { getTerminalLspSupportedLanguageObj } from './lspTerminalUtil.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';

registerSingleton(ITerminalCompletionService, TerminalCompletionService, InstantiationType.Delayed);

// #region Terminal Contributions

class TerminalSuggestContribution extends DisposableStore implements ITerminalContribution {
	static readonly ID = 'terminal.suggest';

	static get(instance: ITerminalInstance): TerminalSuggestContribution | null {
		return instance.getContribution<TerminalSuggestContribution>(TerminalSuggestContribution.ID);
	}

	private readonly _addon: MutableDisposable<SuggestAddon> = new MutableDisposable();
	private readonly _lspAddons: DisposableMap<string, LspCompletionProviderAddon> = this.add(new DisposableMap());
	private readonly _lspModelProvider: MutableDisposable<LspTerminalModelContentProvider> = new MutableDisposable();
	private readonly _terminalSuggestWidgetVisibleContextKey: IContextKey<boolean>;

	get addon(): SuggestAddon | undefined { return this._addon.value; }
	get lspAddons(): LspCompletionProviderAddon[] { return Array.from(this._lspAddons.values()); }

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalCompletionService private readonly _terminalCompletionService: ITerminalCompletionService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this.add(toDisposable(() => {
			this._addon?.dispose();
			this._lspModelProvider?.value?.dispose();
			this._lspModelProvider?.dispose();
		}));
		this._terminalSuggestWidgetVisibleContextKey = TerminalContextKeys.suggestWidgetVisible.bindTo(this._contextKeyService);
		this.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSuggestSettingId.Enabled)) {
				const completionsEnabled = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection).enabled;
				if (!completionsEnabled) {
					this._addon.clear();
					this._lspAddons.clearAndDisposeAll();
				}
				const xtermRaw = this._ctx.instance.xterm?.raw;
				if (!!xtermRaw && completionsEnabled) {
					this._loadAddons(xtermRaw);
				}
			}
		}));

		// Initialize the dynamic providers configuration manager
		TerminalSuggestProvidersConfigurationManager.initialize(this._instantiationService);

		// Listen for terminal location changes to update the suggest widget container
		this.add(this._ctx.instance.onDidChangeTarget((target) => {
			this._updateContainerForTarget(target);
		}));

		// The terminal view can be reparented (for example when moved into a new view). Ensure the
		// suggest widget follows the terminal's DOM when focus returns to the instance.
		this.add(this._ctx.instance.onDidFocus(() => {
			const xtermRaw = this._ctx.instance.xterm?.raw;
			if (xtermRaw) {
				this._prepareAddonLayout(xtermRaw);
			}
		}));
	}

	xtermOpen(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		const config = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection);
		const enabled = config.enabled;
		if (!enabled) {
			return;
		}
		this._loadAddons(xterm.raw);
		this.add(Event.runAndSubscribe(this._ctx.instance.onDidChangeShellType, async () => {
			this._refreshAddons();
			this._lspModelProvider.value?.shellTypeChanged(this._ctx.instance.shellType);
		}));
	}

	private async _loadLspCompletionAddon(xterm: RawXtermTerminal): Promise<void> {
		let lspTerminalObj = undefined;
		// TODO: Change to always load after settings update for terminal suggest provider
		if (!this._ctx.instance.shellType || !(lspTerminalObj = getTerminalLspSupportedLanguageObj(this._ctx.instance.shellType))) {
			this._lspAddons.clearAndDisposeAll();
			return;
		}

		const virtualTerminalDocumentUri = createTerminalLanguageVirtualUri(this._ctx.instance.instanceId, lspTerminalObj.extension);

		// Load and register the LSP completion providers (one per language server)
		this._lspModelProvider.value = this._instantiationService.createInstance(LspTerminalModelContentProvider, this._ctx.instance.capabilities, this._ctx.instance.instanceId, virtualTerminalDocumentUri, this._ctx.instance.shellType);
		this.add(this._lspModelProvider.value);

		const textVirtualModel = await this._textModelService.createModelReference(virtualTerminalDocumentUri);
		this.add(textVirtualModel);

		const virtualProviders = this._languageFeaturesService.completionProvider.all(textVirtualModel.object.textEditorModel);
		const filteredProviders = virtualProviders.filter(p => p._debugDisplayName !== 'wordbasedCompletions');

		// Iterate through all available providers
		for (const provider of filteredProviders) {
			const lspCompletionProviderAddon = this._instantiationService.createInstance(LspCompletionProviderAddon, provider, textVirtualModel, this._lspModelProvider.value);
			this._lspAddons.set(provider._debugDisplayName, lspCompletionProviderAddon);
			xterm.loadAddon(lspCompletionProviderAddon);
			this.add(this._terminalCompletionService.registerTerminalCompletionProvider(
				'lsp',
				lspCompletionProviderAddon.id,
				lspCompletionProviderAddon,
				...(lspCompletionProviderAddon.triggerCharacters ?? [])
			));
		}
	}

	private _loadAddons(xterm: RawXtermTerminal): void {
		// Don't re-create the addon
		if (this._addon.value) {
			return;
		}

		const addon = this._addon.value = this._instantiationService.createInstance(SuggestAddon, this._ctx.instance.sessionId, this._ctx.instance.shellType, this._ctx.instance.capabilities, this._terminalSuggestWidgetVisibleContextKey);
		xterm.loadAddon(addon);
		this._loadLspCompletionAddon(xterm);

		this._prepareAddonLayout(xterm);

		this.add(dom.addDisposableListener(this._ctx.instance.domElement, dom.EventType.FOCUS_OUT, (e) => {
			const focusedElement = e.relatedTarget as HTMLElement;
			if (focusedElement?.classList.contains(SuggestDetailsClassName)) {
				// Don't hide the suggest widget if the focus is moving to the details
				return;
			}
			addon.hideSuggestWidget(true);
		}));

		this.add(addon.onAcceptedCompletion(async text => {
			this._ctx.instance.focus();
			this._ctx.instance.sendText(text, false);
		}));
		const clipboardContrib = TerminalClipboardContribution.get(this._ctx.instance)!;
		this.add(clipboardContrib.onWillPaste(() => addon.isPasting = true));
		this.add(clipboardContrib.onDidPaste(() => {
			// Delay this slightly as synchronizing the prompt input is debounced
			setTimeout(() => addon.isPasting = false, 100);
		}));
		if (!isWindows) {
			let barrier: AutoOpenBarrier | undefined;
			this.add(addon.onDidReceiveCompletions(() => {
				barrier?.open();
				barrier = undefined;
			}));
		}
	}

	private _refreshAddons(): void {
		const addon = this._addon.value;
		if (!addon) {
			return;
		}
		addon.shellType = this._ctx.instance.shellType;
		if (!this._ctx.instance.xterm?.raw) {
			return;
		}
		// Relies on shell type being set
		this._loadLspCompletionAddon(this._ctx.instance.xterm.raw);
	}

	private _updateContainerForTarget(target: TerminalLocation | undefined): void {
		const addon = this._addon.value;
		if (!addon || !this._ctx.instance.xterm?.raw) {
			return;
		}

		this._prepareAddonLayout(this._ctx.instance.xterm.raw);
	}


	private async _prepareAddonLayout(xterm: RawXtermTerminal): Promise<void> {
		const addon = this._addon.value;
		if (!addon || this.isDisposed) {
			return;
		}

		const xtermElement = xterm.element ?? await this._waitForXtermElement(xterm);
		if (!xtermElement || this.isDisposed || addon !== this._addon.value) {
			return;
		}

		const container = this._resolveAddonContainer(xtermElement);
		addon.setContainerWithOverflow(container);
		// eslint-disable-next-line no-restricted-syntax
		const screenElement = xtermElement.querySelector('.xterm-screen');
		if (dom.isHTMLElement(screenElement)) {
			addon.setScreen(screenElement);
		}
	}

	private async _waitForXtermElement(xterm: RawXtermTerminal): Promise<HTMLElement | undefined> {
		if (xterm.element) {
			return xterm.element;
		}

		await Promise.race([
			Event.toPromise(Event.filter(this._ctx.instance.onDidChangeVisibility, visible => visible)),
			Event.toPromise(this._ctx.instance.onDisposed)
		]);

		if (this.isDisposed || this._ctx.instance.isDisposed) {
			return undefined;
		}

		return xterm.element ?? undefined;
	}

	private _resolveAddonContainer(xtermElement: HTMLElement): HTMLElement {
		if (this._ctx.instance.target === TerminalLocation.Editor) {
			return xtermElement;
		}

		return dom.findParentWithClass(xtermElement, 'panel') ?? xtermElement;
	}
}

registerTerminalContribution(TerminalSuggestContribution.ID, TerminalSuggestContribution);

// #endregion

// #region Actions

registerTerminalAction({
	id: TerminalSuggestCommandId.ConfigureSettings,
	title: localize2('workbench.action.terminal.configureSuggestSettings', 'Configure'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Comma,
		weight: KeybindingWeight.WorkbenchContrib
	},
	menu: {
		id: MenuId.MenubarTerminalSuggestStatusMenu,
		group: 'right',
		order: 1
	},
	run: (c, accessor) => accessor.get(IPreferencesService).openSettings({ query: terminalSuggestConfigSection })
});

registerTerminalAction({
	id: TerminalSuggestCommandId.LearnMore,
	title: localize2('workbench.action.terminal.learnMore', 'Learn More'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	menu: {
		id: MenuId.MenubarTerminalSuggestStatusMenu,
		group: 'center',
		order: 1
	},
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: TerminalContextKeys.suggestWidgetVisible
	},
	run: (c, accessor) => {
		(accessor.get(IOpenerService)).open('https://aka.ms/vscode-terminal-intellisense');
	}
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.TriggerSuggest,
	title: localize2('workbench.action.terminal.triggerSuggest', 'Trigger Suggest'),
	f1: false,
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.Space,
		mac: { primary: KeyMod.WinCtrl | KeyCode.Space },
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: ContextKeyExpr.and(TerminalContextKeys.focus, TerminalContextKeys.suggestWidgetVisible.negate(), ContextKeyExpr.equals(`config.${TerminalSuggestSettingId.Enabled}`, true))
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.requestCompletions(true)
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.ResetWidgetSize,
	title: localize2('workbench.action.terminal.resetSuggestWidgetSize', 'Reset Suggest Widget Size'),
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.resetWidgetSize()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.SelectPrevSuggestion,
	title: localize2('workbench.action.terminal.selectPrevSuggestion', 'Select the Previous Suggestion'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		// Up is bound to other workbench keybindings that this needs to beat
		primary: KeyCode.UpArrow,
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: ContextKeyExpr.or(SimpleSuggestContext.HasNavigated, ContextKeyExpr.equals(`config.${TerminalSuggestSettingId.UpArrowNavigatesHistory}`, false))
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.selectPreviousSuggestion()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.SelectPrevPageSuggestion,
	title: localize2('workbench.action.terminal.selectPrevPageSuggestion', 'Select the Previous Page Suggestion'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		// Up is bound to other workbench keybindings that this needs to beat
		primary: KeyCode.PageUp,
		weight: KeybindingWeight.WorkbenchContrib + 1
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.selectPreviousPageSuggestion()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.SelectNextSuggestion,
	title: localize2('workbench.action.terminal.selectNextSuggestion', 'Select the Next Suggestion'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		// Down is bound to other workbench keybindings that this needs to beat
		primary: KeyCode.DownArrow,
		weight: KeybindingWeight.WorkbenchContrib + 1
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.selectNextSuggestion()
});

registerActiveInstanceAction({
	id: 'terminalSuggestToggleExplainMode',
	title: localize2('workbench.action.terminal.suggestToggleExplainMode', 'Suggest Toggle Explain Modes'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		// Down is bound to other workbench keybindings that this needs to beat
		weight: KeybindingWeight.WorkbenchContrib + 1,
		primary: KeyMod.CtrlCmd | KeyCode.Slash,
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.toggleExplainMode()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.ToggleDetailsFocus,
	title: localize2('workbench.action.terminal.suggestToggleDetailsFocus', 'Suggest Toggle Suggestion Focus'),
	f1: false,
	// HACK: This does not work with a precondition of `TerminalContextKeys.suggestWidgetVisible`, so make sure to not override the editor's keybinding
	precondition: EditorContextKeys.textInputFocus.negate(),
	keybinding: {
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Space,
		mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Space }
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.toggleSuggestionFocus()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.ToggleDetails,
	title: localize2('workbench.action.terminal.suggestToggleDetails', 'Suggest Toggle Details'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.isOpen, TerminalContextKeys.focus, TerminalContextKeys.suggestWidgetVisible, SimpleSuggestContext.HasFocusedSuggestion),
	keybinding: {
		// HACK: Force weight to be higher than that to start terminal chat
		weight: KeybindingWeight.ExternalExtension + 2,
		primary: KeyMod.CtrlCmd | KeyCode.Space,
		secondary: [KeyMod.CtrlCmd | KeyCode.KeyI],
		mac: { primary: KeyMod.WinCtrl | KeyCode.Space, secondary: [KeyMod.CtrlCmd | KeyCode.KeyI] }
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.toggleSuggestionDetails()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.SelectNextPageSuggestion,
	title: localize2('workbench.action.terminal.selectNextPageSuggestion', 'Select the Next Page Suggestion'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		// Down is bound to other workbench keybindings that this needs to beat
		primary: KeyCode.PageDown,
		weight: KeybindingWeight.WorkbenchContrib + 1
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.selectNextPageSuggestion()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.AcceptSelectedSuggestion,
	title: localize2('workbench.action.terminal.acceptSelectedSuggestion', 'Insert'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: [{
		primary: KeyCode.Tab,
		// Tab is bound to other workbench keybindings that this needs to beat
		weight: KeybindingWeight.WorkbenchContrib + 2,
		when: ContextKeyExpr.and(SimpleSuggestContext.HasFocusedSuggestion)
	},
	{
		primary: KeyCode.Enter,
		when: ContextKeyExpr.and(SimpleSuggestContext.HasFocusedSuggestion, ContextKeyExpr.or(ContextKeyExpr.notEquals(`config.${TerminalSuggestSettingId.SelectionMode}`, 'partial'), ContextKeyExpr.or(SimpleSuggestContext.FirstSuggestionFocused.toNegated(), SimpleSuggestContext.HasNavigated))),
		weight: KeybindingWeight.WorkbenchContrib + 1
	}],
	menu: {
		id: MenuId.MenubarTerminalSuggestStatusMenu,
		order: 1,
		group: 'left'
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.acceptSelectedSuggestion()
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.AcceptSelectedSuggestionEnter,
	title: localize2('workbench.action.terminal.acceptSelectedSuggestionEnter', 'Accept Selected Suggestion (Enter)'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		primary: KeyCode.Enter,
		// Enter is bound to other workbench keybindings that this needs to beat
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: ContextKeyExpr.notEquals(`config.${TerminalSuggestSettingId.RunOnEnter}`, 'never'),
	},
	run: async (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.acceptSelectedSuggestion(undefined, true)
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.HideSuggestWidget,
	title: localize2('workbench.action.terminal.hideSuggestWidget', 'Hide Suggest Widget'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding: {
		primary: KeyCode.Escape,
		// Escape is bound to other workbench keybindings that this needs to beat
		weight: KeybindingWeight.WorkbenchContrib + 1
	},
	run: (activeInstance) => TerminalSuggestContribution.get(activeInstance)?.addon?.hideSuggestWidget(true)
});

registerActiveInstanceAction({
	id: TerminalSuggestCommandId.HideSuggestWidgetAndNavigateHistory,
	title: localize2('workbench.action.terminal.hideSuggestWidgetAndNavigateHistory', 'Hide Suggest Widget and Navigate History'),
	f1: false,
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.focus, TerminalContextKeys.isOpen, TerminalContextKeys.suggestWidgetVisible),
	keybinding:
	{
		primary: KeyCode.UpArrow,
		when: ContextKeyExpr.and(SimpleSuggestContext.HasNavigated.negate(), ContextKeyExpr.equals(`config.${TerminalSuggestSettingId.UpArrowNavigatesHistory}`, true)),
		weight: KeybindingWeight.WorkbenchContrib + 2
	},
	run: (activeInstance) => {
		TerminalSuggestContribution.get(activeInstance)?.addon?.hideSuggestWidget(true);
		activeInstance.sendText('\u001b[A', false); // Up arrow
	}
});

// #endregion

// #region Dynamic Providers Configuration

class TerminalSuggestProvidersConfigurationManager extends Disposable {
	private static _instance: TerminalSuggestProvidersConfigurationManager | undefined;

	static initialize(instantiationService: IInstantiationService): void {
		if (!this._instance) {
			this._instance = instantiationService.createInstance(TerminalSuggestProvidersConfigurationManager);
		}
	}

	constructor(
		@ITerminalCompletionService private readonly _terminalCompletionService: ITerminalCompletionService,
		@ITerminalContributionService private readonly _terminalContributionService: ITerminalContributionService
	) {
		super();
		this._register(this._terminalCompletionService.onDidChangeProviders(() => {
			this._updateConfiguration();
		}));
		this._register(this._terminalContributionService.onDidChangeTerminalCompletionProviders(() => {
			this._updateConfiguration();
		}));
		// Initial configuration
		this._updateConfiguration();
	}

	private _updateConfiguration(): void {
		// Add statically declared providers from package.json contributions
		const providers = new Map<string, ITerminalSuggestProviderInfo>();
		this._terminalContributionService.terminalCompletionProviders.forEach(o => providers.set(o.extensionIdentifier, { ...o, id: o.extensionIdentifier }));

		// Add dynamically registered providers (that aren't already declared statically)
		for (const { id } of this._terminalCompletionService.providers) {
			if (id && !providers.has(id)) {
				providers.set(id, { id });
			}
		}

		registerTerminalSuggestProvidersConfiguration(providers);
	}
}

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionItem.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { basename } from '../../../../../base/common/path.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { CompletionItem, CompletionItemKind, CompletionItemProvider } from '../../../../../editor/common/languages.js';
import { ISimpleCompletion, SimpleCompletionItem } from '../../../../services/suggest/browser/simpleCompletionItem.js';

export enum TerminalCompletionItemKind {
	// Extension host kinds
	File = 0,
	Folder = 1,
	Method = 2,
	Alias = 3,
	Argument = 4,
	Option = 5,
	OptionValue = 6,
	Flag = 7,
	SymbolicLinkFile = 8,
	SymbolicLinkFolder = 9,
	Commit = 10,
	Branch = 11,
	Tag = 12,
	Stash = 13,
	Remote = 14,
	PullRequest = 15,
	PullRequestDone = 16,

	// Core-only kinds
	InlineSuggestion = 100,
	InlineSuggestionAlwaysOnTop = 101,
}

// Maps CompletionItemKind from language server based completion to TerminalCompletionItemKind
export function mapLspKindToTerminalKind(lspKind: CompletionItemKind): TerminalCompletionItemKind {
	// TODO: Add more types for different [LSP providers](https://github.com/microsoft/vscode/issues/249480)

	switch (lspKind) {
		case CompletionItemKind.File:
			return TerminalCompletionItemKind.File;
		case CompletionItemKind.Folder:
			return TerminalCompletionItemKind.Folder;
		case CompletionItemKind.Method:
			return TerminalCompletionItemKind.Method;
		case CompletionItemKind.Text:
			return TerminalCompletionItemKind.Argument; // consider adding new type?
		case CompletionItemKind.Variable:
			return TerminalCompletionItemKind.Argument; // ""
		case CompletionItemKind.EnumMember:
			return TerminalCompletionItemKind.OptionValue; // ""
		case CompletionItemKind.Keyword:
			return TerminalCompletionItemKind.Alias;
		default:
			return TerminalCompletionItemKind.Method;
	}
}

export interface ITerminalCompletion extends ISimpleCompletion {
	/**
	 * A custom string that should be input into the terminal when selecting this completion. This
	 * is only required if the label is not what's being input.
	 */
	inputData?: string;

	/**
	 * The kind of terminal completion item.
	 */
	kind?: TerminalCompletionItemKind;

	/**
	 * A flag that can be used to override the kind check and treat this completion as a file when
	 * it comes to sorting. For some pwsh completions come through as methods despite being files,
	 * this makes sure they're sorted correctly.
	 */
	isFileOverride?: boolean;

	/**
	 * Whether the completion is a keyword.
	 */
	isKeyword?: boolean;

	/**
	 * Unresolved completion item from the language server provider/
	 */
	_unresolvedItem?: CompletionItem;

	/**
	 * Provider that can resolve this item
	 */
	_resolveProvider?: CompletionItemProvider;

}

export class TerminalCompletionItem extends SimpleCompletionItem {
	/**
	 * {@link labelLow} without the file extension.
	 */
	labelLowExcludeFileExt: string;

	/**
	 * The lowercase label, when the completion is a file or directory this has  normalized path
	 * separators (/) on Windows and no trailing separator for directories.
	 */
	labelLowNormalizedPath: string;

	/**
	 * The file extension part from {@link labelLow}.
	 */
	fileExtLow: string = '';

	/**
	 * A penalty that applies to completions that are comprised of only punctuation characters or
	 * that applies to files or folders starting with the underscore character.
	 */
	punctuationPenalty: 0 | 1 = 0;

	/**
	 * Completion items details (such as docs) can be lazily resolved when focused.
	 */
	resolveCache?: Promise<void>;

	constructor(
		override readonly completion: ITerminalCompletion
	) {
		super(completion);

		// ensure lower-variants (perf)
		this.labelLowExcludeFileExt = this.labelLow;
		this.labelLowNormalizedPath = this.labelLow;

		// HACK: Treat branch as a path separator, otherwise they get filtered out. Hard code the
		// documentation for now, but this would be better to come in through a `kind`
		// See https://github.com/microsoft/vscode/issues/255864
		if (isFile(completion) || completion.kind === TerminalCompletionItemKind.Branch) {
			if (isWindows) {
				this.labelLow = this.labelLow.replaceAll('/', '\\');
			}
		}

		if (isFile(completion)) {
			// Don't include dotfiles as extensions when sorting
			const extIndex = this.labelLow.lastIndexOf('.');
			if (extIndex > 0) {
				this.labelLowExcludeFileExt = this.labelLow.substring(0, extIndex);
				this.fileExtLow = this.labelLow.substring(extIndex + 1);
			}
		}

		if (isFile(completion) || completion.kind === TerminalCompletionItemKind.Folder) {
			if (isWindows) {
				this.labelLowNormalizedPath = this.labelLow.replaceAll('\\', '/');
			}
			if (completion.kind === TerminalCompletionItemKind.Folder) {
				this.labelLowNormalizedPath = this.labelLowNormalizedPath.replace(/\/$/, '');
			}
		}

		this.punctuationPenalty = shouldPenalizeForPunctuation(this.labelLowExcludeFileExt) ? 1 : 0;
	}

	/**
	 * Resolves the completion item's details lazily when needed.
	 */
	async resolve(token: CancellationToken): Promise<void> {

		if (this.resolveCache) {
			return this.resolveCache;
		}

		const unresolvedItem = this.completion._unresolvedItem;
		const provider = this.completion._resolveProvider;

		if (!unresolvedItem || !provider || !provider.resolveCompletionItem) {
			return;
		}

		this.resolveCache = (async () => {
			try {
				const resolved = await provider.resolveCompletionItem!(unresolvedItem, token);
				if (resolved) {
					// Update the completion with resolved details
					if (resolved.detail) {
						this.completion.detail = resolved.detail;
					}
					if (resolved.documentation) {
						this.completion.documentation = resolved.documentation;
					}
				}
			} catch (error) {
				return;
			}
		})();

		return this.resolveCache;
	}

}

function isFile(completion: ITerminalCompletion): boolean {
	return !!(completion.kind === TerminalCompletionItemKind.File || completion.isFileOverride);
}

function shouldPenalizeForPunctuation(label: string): boolean {
	return basename(label).startsWith('_') || /^[\[\]\{\}\(\)\.,;:!?\/\\\-_@#~*%^=$]+$/.test(label);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows } from '../../../../../base/common/platform.js';
import { count } from '../../../../../base/common/strings.js';
import { isString } from '../../../../../base/common/types.js';
import { SimpleCompletionModel, type LineContext } from '../../../../services/suggest/browser/simpleCompletionModel.js';
import { TerminalCompletionItemKind, type TerminalCompletionItem } from './terminalCompletionItem.js';

export class TerminalCompletionModel extends SimpleCompletionModel<TerminalCompletionItem> {
	constructor(
		items: TerminalCompletionItem[],
		lineContext: LineContext
	) {
		super(items, lineContext, compareCompletionsFn);
	}
}

const compareCompletionsFn = (leadingLineContent: string, a: TerminalCompletionItem, b: TerminalCompletionItem) => {
	// Boost always on top inline completions
	if (a.completion.kind === TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop && a.completion.kind !== b.completion.kind) {
		return -1;
	}
	if (b.completion.kind === TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop && a.completion.kind !== b.completion.kind) {
		return 1;
	}

	// Sort by the score
	let score = b.score[0] - a.score[0];
	if (score !== 0) {
		return score;
	}

	// Boost inline completions
	if (a.completion.kind === TerminalCompletionItemKind.InlineSuggestion && a.completion.kind !== b.completion.kind) {
		return -1;
	}
	if (b.completion.kind === TerminalCompletionItemKind.InlineSuggestion && a.completion.kind !== b.completion.kind) {
		return 1;
	}

	if (a.punctuationPenalty !== b.punctuationPenalty) {
		// Sort by underscore penalty (eg. `__init__/` should be penalized)
		// Sort by punctuation penalty (eg. `;` should be penalized)
		return a.punctuationPenalty - b.punctuationPenalty;
	}

	// Sort files of the same name by extension
	const isArg = leadingLineContent.includes(' ');
	if (!isArg && a.completion.kind === TerminalCompletionItemKind.File && b.completion.kind === TerminalCompletionItemKind.File) {
		// If the file name excluding the extension is different, just do a regular sort
		if (a.labelLowExcludeFileExt !== b.labelLowExcludeFileExt) {
			return a.labelLowExcludeFileExt.localeCompare(b.labelLowExcludeFileExt, undefined, { ignorePunctuation: true });
		}
		// Then by label length ascending (excluding file extension if it's a file)
		score = a.labelLowExcludeFileExt.length - b.labelLowExcludeFileExt.length;
		if (score !== 0) {
			return score;
		}
		// If they're files at the start of the command line, boost extensions depending on the operating system
		score = fileExtScore(b.fileExtLow) - fileExtScore(a.fileExtLow);
		if (score !== 0) {
			return score;
		}
		// Then by file extension length ascending
		score = a.fileExtLow.length - b.fileExtLow.length;
		if (score !== 0) {
			return score;
		}
	}

	// Boost main and master branches for git commands
	// HACK: Currently this just matches leading line content, it should eventually check the
	//       completion type is a branch
	if (a.completion.kind === TerminalCompletionItemKind.Argument && b.completion.kind === TerminalCompletionItemKind.Argument && /^\s*git\b/.test(leadingLineContent)) {
		const aLabel = isString(a.completion.label) ? a.completion.label : a.completion.label.label;
		const bLabel = isString(b.completion.label) ? b.completion.label : b.completion.label.label;
		const aIsMainOrMaster = aLabel === 'main' || aLabel === 'master';
		const bIsMainOrMaster = bLabel === 'main' || bLabel === 'master';

		if (aIsMainOrMaster && !bIsMainOrMaster) {
			return -1;
		}
		if (bIsMainOrMaster && !aIsMainOrMaster) {
			return 1;
		}
	}

	// Sort by more detailed completions
	if (a.completion.kind === TerminalCompletionItemKind.Method && b.completion.kind === TerminalCompletionItemKind.Method) {
		if (!isString(a.completion.label) && a.completion.label.description && !isString(b.completion.label) && b.completion.label.description) {
			score = 0;
		} else if (!isString(a.completion.label) && a.completion.label.description) {
			score = -2;
		} else if (!isString(b.completion.label) && b.completion.label.description) {
			score = 2;
		}
		score += (b.completion.detail ? 1 : 0) + (b.completion.documentation ? 2 : 0) - (a.completion.detail ? 1 : 0) - (a.completion.documentation ? 2 : 0);
		if (score !== 0) {
			return score;
		}
	}

	// Sort by folder depth (eg. `vscode/` should come before `vscode-.../`)
	if (a.completion.kind === TerminalCompletionItemKind.Folder && b.completion.kind === TerminalCompletionItemKind.Folder) {
		if (a.labelLowNormalizedPath && b.labelLowNormalizedPath) {
			// Directories
			// Count depth of path (number of / or \ occurrences)
			score = count(a.labelLowNormalizedPath, '/') - count(b.labelLowNormalizedPath, '/');
			if (score !== 0) {
				return score;
			}

			// Ensure shorter prefixes appear first
			if (b.labelLowNormalizedPath.startsWith(a.labelLowNormalizedPath)) {
				return -1; // `a` is a prefix of `b`, so `a` should come first
			}
			if (a.labelLowNormalizedPath.startsWith(b.labelLowNormalizedPath)) {
				return 1; // `b` is a prefix of `a`, so `b` should come first
			}
		}
	}

	if (a.completion.kind !== b.completion.kind) {
		// Sort by kind
		if ((a.completion.kind === TerminalCompletionItemKind.Method || a.completion.kind === TerminalCompletionItemKind.Alias) && (b.completion.kind !== TerminalCompletionItemKind.Method && b.completion.kind !== TerminalCompletionItemKind.Alias)) {
			return -1; // Methods and aliases should come first
		}
		if ((b.completion.kind === TerminalCompletionItemKind.Method || b.completion.kind === TerminalCompletionItemKind.Alias) && (a.completion.kind !== TerminalCompletionItemKind.Method && a.completion.kind !== TerminalCompletionItemKind.Alias)) {
			return 1; // Methods and aliases should come first
		}
		if (a.completion.kind === TerminalCompletionItemKind.Argument && b.completion.kind !== TerminalCompletionItemKind.Argument) {
			return -1; // Arguments should come before other kinds
		}
		if (b.completion.kind === TerminalCompletionItemKind.Argument && a.completion.kind !== TerminalCompletionItemKind.Argument) {
			return 1; // Arguments should come before other kinds
		}
		if (isResourceKind(a.completion.kind) && !isResourceKind(b.completion.kind)) {
			return 1; // Resources should come last
		}
		if (isResourceKind(b.completion.kind) && !isResourceKind(a.completion.kind)) {
			return -1; // Resources should come last
		}
	}

	// Sort alphabetically, ignoring punctuation causes dot files to be mixed in rather than
	// all at the top
	return a.labelLow.localeCompare(b.labelLow, undefined, { ignorePunctuation: true });
};

const isResourceKind = (kind: TerminalCompletionItemKind | undefined) =>
	kind === TerminalCompletionItemKind.File ||
	kind === TerminalCompletionItemKind.Folder ||
	kind === TerminalCompletionItemKind.SymbolicLinkFile ||
	kind === TerminalCompletionItemKind.SymbolicLinkFolder;

// TODO: This should be based on the process OS, not the local OS
// File score boosts for specific file extensions on Windows. This only applies when the file is the
// _first_ part of the command line.
const fileExtScores = new Map<string, number>(isWindows ? [
	// Windows - .ps1 > .exe > .bat > .cmd. This is the command precedence when running the files
	//           without an extension, tested manually in pwsh v7.4.4
	['ps1', 0.09],
	['exe', 0.08],
	['bat', 0.07],
	['cmd', 0.07],
	['msi', 0.06],
	['com', 0.06],
	// Non-Windows
	['sh', -0.05],
	['bash', -0.05],
	['zsh', -0.05],
	['fish', -0.05],
	['csh', -0.06], // C shell
	['ksh', -0.06], // Korn shell
	// Scripting language files are excluded here as the standard behavior on Windows will just open
	// the file in a text editor, not run the file
] : [
	// Pwsh
	['ps1', 0.05],
	// Windows
	['bat', -0.05],
	['cmd', -0.05],
	['exe', -0.05],
	// Non-Windows
	['sh', 0.05],
	['bash', 0.05],
	['zsh', 0.05],
	['fish', 0.05],
	['csh', 0.04], // C shell
	['ksh', 0.04], // Korn shell
	// Scripting languages
	['py', 0.05], // Python
	['pl', 0.05], // Perl
]);

function fileExtScore(ext: string): number {
	return fileExtScores.get(ext) || 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalCompletionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { basename } from '../../../../../base/common/path.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { FileSystemProviderCapabilities, IFileService } from '../../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { TerminalCapability, type ITerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { GeneralShellType, ITerminalLogService, TerminalShellType, WindowsShellType } from '../../../../../platform/terminal/common/terminal.js';
import { TerminalSuggestSettingId } from '../common/terminalSuggestConfiguration.js';
import { TerminalCompletionItemKind, type ITerminalCompletion } from './terminalCompletionItem.js';
import { env as processEnv } from '../../../../../base/common/process.js';
import type { IProcessEnvironment } from '../../../../../base/common/platform.js';
import { timeout } from '../../../../../base/common/async.js';
import { gitBashToWindowsPath, windowsToGitBashPath } from './terminalGitBashHelpers.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IRelativePattern, match } from '../../../../../base/common/glob.js';
import { isString } from '../../../../../base/common/types.js';

export const ITerminalCompletionService = createDecorator<ITerminalCompletionService>('terminalCompletionService');

/**
 * Represents a collection of {@link CompletionItem completion items} to be presented
 * in the terminal.
 */
export class TerminalCompletionList<ITerminalCompletion> {

	/**
	 * Resources should be shown in the completions list
	 */
	resourceOptions?: TerminalCompletionResourceOptions;

	/**
	 * The completion items.
	 */
	items?: ITerminalCompletion[];

	/**
	 * Creates a new completion list.
	 *
	 * @param items The completion items.
	 * @param isIncomplete The list is not complete.
	 */
	constructor(items?: ITerminalCompletion[], resourceOptions?: TerminalCompletionResourceOptions) {
		this.items = items;
		this.resourceOptions = resourceOptions;
	}
}

export interface TerminalCompletionResourceOptions {
	showFiles?: boolean;
	showDirectories?: boolean;
	globPattern?: string | IRelativePattern;
	cwd: UriComponents;
	pathSeparator: string;
}


export interface ITerminalCompletionProvider {
	id: string;
	shellTypes?: TerminalShellType[];
	provideCompletions(value: string, cursorPosition: number, token: CancellationToken): Promise<ITerminalCompletion[] | TerminalCompletionList<ITerminalCompletion> | undefined>;
	triggerCharacters?: string[];
	isBuiltin?: boolean;
}

export interface ITerminalCompletionService {
	_serviceBrand: undefined;
	readonly providers: IterableIterator<ITerminalCompletionProvider>;
	readonly onDidChangeProviders: Event<void>;
	registerTerminalCompletionProvider(extensionIdentifier: string, id: string, provider: ITerminalCompletionProvider, ...triggerCharacters: string[]): IDisposable;
	provideCompletions(promptValue: string, cursorPosition: number, allowFallbackCompletions: boolean, shellType: TerminalShellType | undefined, capabilities: ITerminalCapabilityStore, token: CancellationToken, triggerCharacter?: boolean, skipExtensionCompletions?: boolean, explicitlyInvoked?: boolean): Promise<ITerminalCompletion[] | undefined>;
}

export class TerminalCompletionService extends Disposable implements ITerminalCompletionService {
	declare _serviceBrand: undefined;
	private readonly _providers: Map</*ext id*/string, Map</*provider id*/string, ITerminalCompletionProvider>> = new Map();

	private readonly _onDidChangeProviders = this._register(new Emitter<void>());
	readonly onDidChangeProviders = this._onDidChangeProviders.event;

	get providers(): IterableIterator<ITerminalCompletionProvider> {
		return this._providersGenerator();
	}

	private *_providersGenerator(): IterableIterator<ITerminalCompletionProvider> {
		for (const providerMap of this._providers.values()) {
			for (const provider of providerMap.values()) {
				yield provider;
			}
		}
	}

	/** Overrides the environment for testing purposes. */
	set processEnv(env: IProcessEnvironment) { this._processEnv = env; }
	private _processEnv = processEnv;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@ILabelService private readonly _labelService: ILabelService,
		@ITerminalLogService private readonly _logService: ITerminalLogService
	) {
		super();
	}

	registerTerminalCompletionProvider(extensionIdentifier: string, id: string, provider: ITerminalCompletionProvider, ...triggerCharacters: string[]): IDisposable {
		let extMap = this._providers.get(extensionIdentifier);
		if (!extMap) {
			extMap = new Map();
			this._providers.set(extensionIdentifier, extMap);
		}
		provider.triggerCharacters = triggerCharacters;
		provider.id = id;
		extMap.set(id, provider);
		this._onDidChangeProviders.fire();
		return toDisposable(() => {
			const extMap = this._providers.get(extensionIdentifier);
			if (extMap) {
				extMap.delete(id);
				if (extMap.size === 0) {
					this._providers.delete(extensionIdentifier);
				}
			}
			this._onDidChangeProviders.fire();
		});
	}

	async provideCompletions(promptValue: string, cursorPosition: number, allowFallbackCompletions: boolean, shellType: TerminalShellType | undefined, capabilities: ITerminalCapabilityStore, token: CancellationToken, triggerCharacter?: boolean, skipExtensionCompletions?: boolean, explicitlyInvoked?: boolean): Promise<ITerminalCompletion[] | undefined> {
		this._logService.trace('TerminalCompletionService#provideCompletions');
		if (!this._providers || !this._providers.values || cursorPosition < 0) {
			return undefined;
		}

		let providers;
		if (triggerCharacter) {
			const providersToRequest: ITerminalCompletionProvider[] = [];
			for (const provider of this.providers) {
				if (!provider.triggerCharacters) {
					continue;
				}
				for (const char of provider.triggerCharacters) {
					if (promptValue.substring(0, cursorPosition)?.endsWith(char)) {
						providersToRequest.push(provider);
						break;
					}
				}
			}
			providers = providersToRequest;
		} else {
			providers = [...this._providers.values()].flatMap(providerMap => [...providerMap.values()]);
		}

		if (skipExtensionCompletions) {
			providers = providers.filter(p => p.isBuiltin);
			return this._collectCompletions(providers, shellType, promptValue, cursorPosition, allowFallbackCompletions, capabilities, token, explicitlyInvoked);
		}

		providers = this._getEnabledProviders(providers);

		if (!providers.length) {
			return;
		}

		return this._collectCompletions(providers, shellType, promptValue, cursorPosition, allowFallbackCompletions, capabilities, token, explicitlyInvoked);
	}

	protected _getEnabledProviders(providers: ITerminalCompletionProvider[]): ITerminalCompletionProvider[] {
		const providerConfig: { [key: string]: boolean } = this._configurationService.getValue(TerminalSuggestSettingId.Providers);
		return providers.filter(p => {
			const providerId = p.id;
			return providerId && (!Object.prototype.hasOwnProperty.call(providerConfig, providerId) || providerConfig[providerId] !== false);
		});
	}

	private async _collectCompletions(providers: ITerminalCompletionProvider[], shellType: TerminalShellType | undefined, promptValue: string, cursorPosition: number, allowFallbackCompletions: boolean, capabilities: ITerminalCapabilityStore, token: CancellationToken, explicitlyInvoked?: boolean): Promise<ITerminalCompletion[] | undefined> {
		this._logService.trace('TerminalCompletionService#_collectCompletions');
		const completionPromises = providers.map(async provider => {
			if (provider.shellTypes && shellType && !provider.shellTypes.includes(shellType)) {
				return undefined;
			}
			const timeoutMs = explicitlyInvoked ? 30000 : 5000;
			let timedOut = false;
			let completions;
			try {
				completions = await Promise.race([
					provider.provideCompletions(promptValue, cursorPosition, token).then(result => {
						this._logService.trace(`TerminalCompletionService#_collectCompletions provider ${provider.id} finished`);
						return result;
					}),
					(async () => { await timeout(timeoutMs); timedOut = true; return undefined; })()
				]);
			} catch (e) {
				this._logService.trace(`[TerminalCompletionService] Exception from provider '${provider.id}':`, e);
				return undefined;
			}
			if (timedOut) {
				this._logService.trace(`[TerminalCompletionService] Provider '${provider.id}' timed out after ${timeoutMs}ms. promptValue='${promptValue}', cursorPosition=${cursorPosition}, explicitlyInvoked=${explicitlyInvoked}`);
				return undefined;
			}
			if (!completions) {
				return undefined;
			}
			const completionItems = Array.isArray(completions) ? completions : completions.items ?? [];
			this._logService.trace(`TerminalCompletionService#_collectCompletions amend ${completionItems.length} completion items`);
			if (shellType === GeneralShellType.PowerShell) {
				for (const completion of completionItems) {
					const start = completion.replacementRange ? completion.replacementRange[0] : 0;
					completion.isFileOverride ??= completion.kind === TerminalCompletionItemKind.Method && start === 0;
				}
			}
			if (provider.isBuiltin) {
				//TODO: why is this needed?
				for (const item of completionItems) {
					item.provider ??= provider.id;
				}
			}
			if (Array.isArray(completions)) {
				return completionItems;
			}
			if (completions.resourceOptions) {
				const resourceCompletions = await this.resolveResources(completions.resourceOptions, promptValue, cursorPosition, `core:path:ext:${provider.id}`, capabilities, shellType);
				this._logService.trace(`TerminalCompletionService#_collectCompletions dedupe`);
				if (resourceCompletions) {
					const labels = new Set(completionItems.map(c => c.label));
					for (const item of resourceCompletions) {
						// Ensure no duplicates such as .
						if (!labels.has(item.label)) {
							completionItems.push(item);
						}
					}
				}
				this._logService.trace(`TerminalCompletionService#_collectCompletions dedupe done`);
			}
			return completionItems;
		});

		const results = await Promise.all(completionPromises);
		this._logService.trace('TerminalCompletionService#_collectCompletions done');
		return results.filter(result => !!result).flat();
	}

	async resolveResources(resourceOptions: TerminalCompletionResourceOptions, promptValue: string, cursorPosition: number, provider: string, capabilities: ITerminalCapabilityStore, shellType?: TerminalShellType): Promise<ITerminalCompletion[] | undefined> {
		this._logService.trace(`TerminalCompletionService#resolveResources`);

		const useWindowsStylePath = resourceOptions.pathSeparator === '\\';
		if (useWindowsStylePath) {
			// for tests, make sure the right path separator is used
			promptValue = promptValue.replaceAll(/[\\/]/g, resourceOptions.pathSeparator);
		}

		// Files requested implies folders requested since the file could be in any folder. We could
		// provide diagnostics when a folder is provided where a file is expected.
		const showDirectories = (resourceOptions.showDirectories || resourceOptions.showFiles) ?? false;
		const showFiles = resourceOptions.showFiles ?? false;
		const globPattern = resourceOptions.globPattern ?? undefined;

		if (!showDirectories && !showFiles) {
			return;
		}

		const resourceCompletions: ITerminalCompletion[] = [];
		const cursorPrefix = promptValue.substring(0, cursorPosition);

		// TODO: Leverage Fig's tokens array here?
		// The last word (or argument). When the cursor is following a space it will be the empty
		// string
		let lastWord = cursorPrefix.endsWith(' ') ? '' : cursorPrefix.split(/(?<!\\) /).at(-1) ?? '';

		// Ignore prefixes in the word that look like setting an environment variable
		const matchEnvVarPrefix = lastWord.match(/^[a-zA-Z_]+=(?<rhs>.+)$/);
		if (matchEnvVarPrefix?.groups?.rhs) {
			lastWord = matchEnvVarPrefix.groups.rhs;
		}

		// Get the nearest folder path from the prefix. This ignores everything after the `/` as
		// they are what triggers changes in the directory.
		let lastSlashIndex: number;
		if (useWindowsStylePath) {
			// TODO: Flesh out escaped path logic, it currently only partially works
			let lastBackslashIndex = -1;
			for (let i = lastWord.length - 1; i >= 0; i--) {
				if (lastWord[i] === '\\') {
					if (i === lastWord.length - 1 || lastWord[i + 1] !== ' ') {
						lastBackslashIndex = i;
						break;
					}
				}
			}
			lastSlashIndex = Math.max(lastBackslashIndex, lastWord.lastIndexOf('/'));
		} else {
			lastSlashIndex = lastWord.lastIndexOf(resourceOptions.pathSeparator);
		}

		// The _complete_ folder of the last word. For example if the last word is `./src/file`,
		// this will be `./src/`. This also always ends in the path separator if it is not the empty
		// string and path separators are normalized on Windows.
		let lastWordFolder = lastSlashIndex === -1 ? '' : lastWord.slice(0, lastSlashIndex + 1);
		if (useWindowsStylePath) {
			lastWordFolder = lastWordFolder.replaceAll('/', '\\');
		}


		// Determine the current folder being shown
		let lastWordFolderResource: URI | string | undefined;
		const lastWordFolderHasDotPrefix = !!lastWordFolder.match(/^\.\.?[\\\/]/);
		const lastWordFolderHasTildePrefix = !!lastWordFolder.match(/^~[\\\/]?/);
		const isAbsolutePath = getIsAbsolutePath(shellType, resourceOptions.pathSeparator, lastWordFolder, useWindowsStylePath);
		const type = lastWordFolderHasTildePrefix ? 'tilde' : isAbsolutePath ? 'absolute' : 'relative';
		const cwd = URI.revive(resourceOptions.cwd);

		switch (type) {
			case 'tilde': {
				const home = this._getHomeDir(useWindowsStylePath, capabilities);
				if (home) {
					lastWordFolderResource = URI.joinPath(URI.file(home), lastWordFolder.slice(1).replaceAll('\\ ', ' '));
				}
				if (!lastWordFolderResource) {
					// Use less strong wording here as it's not as strong of a concept on Windows
					// and could be misleading
					if (lastWord.match(/^~[\\\/]$/)) {
						lastWordFolderResource = useWindowsStylePath ? 'Home directory' : '$HOME';
					}
				}
				break;
			}
			case 'absolute': {
				if (shellType === WindowsShellType.GitBash) {
					lastWordFolderResource = URI.file(gitBashToWindowsPath(lastWordFolder, this._processEnv.SystemDrive));
				} else {
					lastWordFolderResource = URI.file(lastWordFolder.replaceAll('\\ ', ' '));
				}
				break;
			}
			case 'relative': {
				lastWordFolderResource = cwd;
				break;
			}
		}

		// Assemble completions based on the resource of lastWordFolder. Note that on Windows the
		// path separators are normalized to `\`.
		if (!lastWordFolderResource) {
			return undefined;
		}

		// Early exit with basic completion if we don't know the resource
		if (isString(lastWordFolderResource)) {
			resourceCompletions.push({
				label: lastWordFolder,
				provider,
				kind: TerminalCompletionItemKind.Folder,
				detail: lastWordFolderResource,
				replacementRange: [cursorPosition - lastWord.length, cursorPosition]
			});
			return resourceCompletions;
		}

		const stat = await this._fileService.resolve(lastWordFolderResource, { resolveSingleChildDescendants: true });
		if (!stat?.children) {
			return;
		}

		// Add current directory. This should be shown at the top because it will be an exact
		// match and therefore highlight the detail, plus it improves the experience when
		// runOnEnter is used.
		//
		// - (relative) `|`       -> `.`
		//   this does not have the trailing `/` intentionally as it's common to complete the
		//   current working directory and we do not want to complete `./` when `runOnEnter` is
		//   used.
		// - (relative) `./src/|` -> `./src/`
		// - (absolute) `/src/|`  -> `/src/`
		// - (tilde)    `~/|`     -> `~/`
		// - (tilde)    `~/src/|` -> `~/src/`
		this._logService.trace(`TerminalCompletionService#resolveResources cwd`);
		if (showDirectories) {
			let label: string;
			switch (type) {
				case 'tilde': {
					label = lastWordFolder;
					break;
				}
				case 'absolute': {
					label = lastWordFolder;
					break;
				}
				case 'relative': {
					label = '.';
					if (lastWordFolder.length > 0) {
						label = addPathRelativePrefix(lastWordFolder, resourceOptions, lastWordFolderHasDotPrefix);
					}
					break;
				}
			}
			resourceCompletions.push({
				label,
				provider,
				kind: TerminalCompletionItemKind.Folder,
				detail: getFriendlyPath(this._labelService, lastWordFolderResource, resourceOptions.pathSeparator, TerminalCompletionItemKind.Folder, shellType),
				replacementRange: [cursorPosition - lastWord.length, cursorPosition]
			});
		}

		// Add all direct children files or folders
		//
		// - (relative) `cd ./src/`  -> `cd ./src/folder1/`, ...
		// - (absolute) `cd c:/src/` -> `cd c:/src/folder1/`, ...
		// - (tilde)    `cd ~/src/`  -> `cd ~/src/folder1/`, ...
		this._logService.trace(`TerminalCompletionService#resolveResources direct children`);
		await Promise.all(stat.children.map(child => (async () => {
			let kind: TerminalCompletionItemKind | undefined;
			let detail: string | undefined = undefined;
			if (showDirectories && child.isDirectory) {
				if (child.isSymbolicLink) {
					kind = TerminalCompletionItemKind.SymbolicLinkFolder;
				} else {
					kind = TerminalCompletionItemKind.Folder;
				}
			} else if (showFiles && child.isFile) {
				if (child.isSymbolicLink) {
					kind = TerminalCompletionItemKind.SymbolicLinkFile;
				} else {
					kind = TerminalCompletionItemKind.File;
				}
			}
			if (kind === undefined) {
				return;
			}

			let label = lastWordFolder;
			if (label.length > 0 && !label.endsWith(resourceOptions.pathSeparator)) {
				label += resourceOptions.pathSeparator;
			}
			label += child.name;
			if (type === 'relative') {
				label = addPathRelativePrefix(label, resourceOptions, lastWordFolderHasDotPrefix);
			}
			if (child.isDirectory && !label.endsWith(resourceOptions.pathSeparator)) {
				label += resourceOptions.pathSeparator;
			}

			label = escapeTerminalCompletionLabel(label, shellType, resourceOptions.pathSeparator);

			if (child.isFile && globPattern) {
				const filePath = child.resource.fsPath;
				const ignoreCase = !this._fileService.hasCapability(child.resource, FileSystemProviderCapabilities.PathCaseSensitive);
				const matches = match(globPattern, filePath, { ignoreCase });
				if (!matches) {
					return;
				}
			}

			// Try to resolve symlink target for symbolic links
			if (child.isSymbolicLink) {
				try {
					const realpath = await this._fileService.realpath(child.resource);
					if (realpath && !isEqual(child.resource, realpath)) {
						detail = `${getFriendlyPath(this._labelService, child.resource, resourceOptions.pathSeparator, kind, shellType)} -> ${getFriendlyPath(this._labelService, realpath, resourceOptions.pathSeparator, kind, shellType)}`;
					}
				} catch (error) {
					// Ignore errors resolving symlink targets - they may be dangling links
				}
			}

			resourceCompletions.push({
				label,
				provider,
				kind,
				detail: detail ?? getFriendlyPath(this._labelService, child.resource, resourceOptions.pathSeparator, kind, shellType),
				replacementRange: [cursorPosition - lastWord.length, cursorPosition]
			});
		})()));

		// Support $CDPATH specially for the `cd` command only
		//
		// - (relative) `|` -> `/foo/vscode` (CDPATH has /foo which contains vscode folder)
		this._logService.trace(`TerminalCompletionService#resolveResources CDPATH`);
		if (type === 'relative' && showDirectories) {
			if (promptValue.startsWith('cd ')) {
				const config = this._configurationService.getValue(TerminalSuggestSettingId.CdPath);
				if (config === 'absolute' || config === 'relative') {
					const cdPath = this._getEnvVar('CDPATH', capabilities);
					if (cdPath) {
						const cdPathEntries = cdPath.split(useWindowsStylePath ? ';' : ':');
						for (const cdPathEntry of cdPathEntries) {
							try {
								const fileStat = await this._fileService.resolve(URI.file(cdPathEntry), { resolveSingleChildDescendants: true });
								if (fileStat?.children) {
									for (const child of fileStat.children) {
										if (!child.isDirectory) {
											continue;
										}
										const useRelative = config === 'relative';
										const kind = TerminalCompletionItemKind.Folder;
										const label = useRelative
											? basename(child.resource.fsPath)
											: shellType === WindowsShellType.GitBash
												? windowsToGitBashPath(child.resource.fsPath)
												: getFriendlyPath(this._labelService, child.resource, resourceOptions.pathSeparator, kind, shellType);
										const detail = useRelative
											? `CDPATH ${getFriendlyPath(this._labelService, child.resource, resourceOptions.pathSeparator, kind, shellType)}`
											: `CDPATH`;
										resourceCompletions.push({
											label,
											provider,
											kind,
											detail,
											replacementRange: [cursorPosition - lastWord.length, cursorPosition]
										});
									}
								}
							} catch { /* ignore */ }
						}
					}
				}
			}
		}

		// Add parent directory to the bottom of the list because it's not as useful as other suggestions
		//
		// - (relative) `|` -> `../`
		// - (relative) `./src/|` -> `./src/../`
		this._logService.trace(`TerminalCompletionService#resolveResources parent dir`);
		if (type === 'relative' && showDirectories) {
			let label = `..${resourceOptions.pathSeparator}`;
			if (lastWordFolder.length > 0) {
				label = addPathRelativePrefix(lastWordFolder + label, resourceOptions, lastWordFolderHasDotPrefix);
			}
			const parentDir = URI.joinPath(cwd, '..' + resourceOptions.pathSeparator);
			resourceCompletions.push({
				label,
				provider,
				kind: TerminalCompletionItemKind.Folder,
				detail: getFriendlyPath(this._labelService, parentDir, resourceOptions.pathSeparator, TerminalCompletionItemKind.Folder, shellType),
				replacementRange: [cursorPosition - lastWord.length, cursorPosition]
			});
		}

		// Add tilde for home directory for relative paths when there is no path separator in the
		// input.
		//
		// - (relative) `|` -> `~`
		this._logService.trace(`TerminalCompletionService#resolveResources tilde`);
		if (type === 'relative' && !lastWordFolder.match(/[\\\/]/)) {
			let homeResource: URI | string | undefined;
			const home = this._getHomeDir(useWindowsStylePath, capabilities);
			if (home) {
				homeResource = URI.joinPath(URI.file(home), lastWordFolder.slice(1).replaceAll('\\ ', ' '));
			}
			if (!homeResource) {
				// Use less strong wording here as it's not as strong of a concept on Windows
				// and could be misleading
				homeResource = useWindowsStylePath ? 'Home directory' : '$HOME';
			}
			resourceCompletions.push({
				label: '~',
				provider,
				kind: TerminalCompletionItemKind.Folder,
				detail: isString(homeResource) ? homeResource : getFriendlyPath(this._labelService, homeResource, resourceOptions.pathSeparator, TerminalCompletionItemKind.Folder, shellType),
				replacementRange: [cursorPosition - lastWord.length, cursorPosition]
			});
		}

		this._logService.trace(`TerminalCompletionService#resolveResources done`);
		return resourceCompletions;
	}

	private _getEnvVar(key: string, capabilities: ITerminalCapabilityStore): string | undefined {
		const env = capabilities.get(TerminalCapability.ShellEnvDetection)?.env?.value as { [key: string]: string | undefined };
		if (env) {
			return env[key];
		}
		return this._processEnv[key];
	}

	private _getHomeDir(useWindowsStylePath: boolean, capabilities: ITerminalCapabilityStore): string | undefined {
		return useWindowsStylePath ? this._getEnvVar('USERPROFILE', capabilities) : this._getEnvVar('HOME', capabilities);
	}
}

function getFriendlyPath(labelService: ILabelService, uri: URI, pathSeparator: string, kind: TerminalCompletionItemKind, shellType?: TerminalShellType): string {
	let path = labelService.getUriLabel(uri, { noPrefix: true });
	// Normalize line endings for folders
	const sep = shellType === WindowsShellType.GitBash ? '\\' : pathSeparator;
	if (kind === TerminalCompletionItemKind.Folder && !path.endsWith(sep)) {
		path += sep;
	}
	return path;
}

/**
 * Normalize suggestion to add a ./ prefix to the start of the path if there isn't one already. We
 * may want to change this behavior in the future to go with whatever format the user has.
 */
function addPathRelativePrefix(text: string, resourceOptions: Pick<TerminalCompletionResourceOptions, 'pathSeparator'>, lastWordFolderHasDotPrefix: boolean): string {
	if (!lastWordFolderHasDotPrefix) {
		if (text.startsWith(resourceOptions.pathSeparator)) {
			return `.${text}`;
		}
		return `.${resourceOptions.pathSeparator}${text}`;
	}
	return text;
}

/**
 * Escapes special characters in a file/folder label for shell completion.
 * This ensures that characters like [, ], etc. are properly escaped.
 */
export function escapeTerminalCompletionLabel(label: string, shellType: TerminalShellType | undefined, pathSeparator: string): string {
	// Only escape for bash/zsh/fish; PowerShell and cmd have different rules
	if (shellType === undefined || shellType === GeneralShellType.PowerShell || shellType === WindowsShellType.CommandPrompt) {
		return label;
	}
	return label.replace(/[\[\]\(\)'"\\\`\*\?;|&<>]/g, '\\$&');
}

function getIsAbsolutePath(shellType: TerminalShellType | undefined, pathSeparator: string, lastWord: string, useWindowsStylePath: boolean): boolean {
	if (shellType === WindowsShellType.GitBash) {
		return lastWord.startsWith(pathSeparator) || /^[a-zA-Z]:\//.test(lastWord);
	}
	return useWindowsStylePath ? /^[a-zA-Z]:[\\\/]/.test(lastWord) : lastWord.startsWith(pathSeparator);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalGitBashHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalGitBashHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Converts a Git Bash absolute path to a Windows absolute path.
 * Examples:
 *   "/"      => "C:\\"
 *   "/c/"    => "C:\\"
 *   "/c/Users/foo" => "C:\\Users\\foo"
 *   "/d/bar" => "D:\\bar"
 */
export function gitBashToWindowsPath(path: string, driveLetter?: string): string {
	// Dynamically determine the system drive (default to 'C:' if not set)
	const systemDrive = (driveLetter || 'C:').toUpperCase();
	// Handle root "/"
	if (path === '/') {
		return `${systemDrive}\\`;
	}
	const match = path.match(/^\/([a-zA-Z])(\/.*)?$/);
	if (match) {
		const drive = match[1].toUpperCase();
		const rest = match[2] ? match[2].replace(/\//g, '\\') : '\\';
		return `${drive}:${rest}`;
	}
	// Fallback: just replace slashes
	return path.replace(/\//g, '\\');
}

/**
 *
 * @param path A Windows-style absolute path (e.g., "C:\Users\foo").
 * Converts it to a Git Bash-style absolute path (e.g., "/c/Users/foo").
 * @returns The Git Bash-style absolute path.
 */
export function windowsToGitBashPath(path: string): string {
	// Convert Windows path (e.g. C:\Users\foo) to Git Bash path (e.g. /c/Users/foo)
	return path
		.replace(/^[a-zA-Z]:\\/, match => `/${match[0].toLowerCase()}/`)
		.replace(/\\/g, '/');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ITerminalAddon, Terminal } from '@xterm/xterm';
import * as dom from '../../../../../base/browser/dom.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { combinedDisposable, Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { sep } from '../../../../../base/common/path.js';
import { commonPrefixLength } from '../../../../../base/common/strings.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { TerminalCapability, type ITerminalCapabilityStore } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import type { IPromptInputModel, IPromptInputModelState } from '../../../../../platform/terminal/common/capabilities/commandDetection/promptInputModel.js';
import type { IXtermCore } from '../../../terminal/browser/xterm-private.js';
import { TerminalStorageKeys } from '../../../terminal/common/terminalStorageKeys.js';
import { terminalSuggestConfigSection, TerminalSuggestSettingId, type ITerminalSuggestConfiguration } from '../common/terminalSuggestConfiguration.js';
import { LineContext } from '../../../../services/suggest/browser/simpleCompletionModel.js';
import { ISimpleSelectedSuggestion, SimpleSuggestWidget } from '../../../../services/suggest/browser/simpleSuggestWidget.js';
import { ITerminalCompletionService } from './terminalCompletionService.js';
import { TerminalSettingId, TerminalShellType, PosixShellType, WindowsShellType, GeneralShellType, ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { createCancelablePromise, CancelablePromise, IntervalTimer, TimeoutTimer } from '../../../../../base/common/async.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { ISimpleSuggestWidgetFontInfo } from '../../../../services/suggest/browser/simpleSuggestWidgetRenderer.js';
import { ITerminalConfigurationService } from '../../../terminal/browser/terminal.js';
import { GOLDEN_LINE_HEIGHT_RATIO } from '../../../../../editor/common/config/fontInfo.js';
import { TerminalCompletionModel } from './terminalCompletionModel.js';
import { TerminalCompletionItem, TerminalCompletionItemKind, type ITerminalCompletion } from './terminalCompletionItem.js';
import { localize } from '../../../../../nls.js';
import { TerminalSuggestTelemetry } from './terminalSuggestTelemetry.js';
import { terminalSymbolAliasIcon, terminalSymbolArgumentIcon, terminalSymbolEnumMember, terminalSymbolFileIcon, terminalSymbolFlagIcon, terminalSymbolInlineSuggestionIcon, terminalSymbolMethodIcon, terminalSymbolOptionIcon, terminalSymbolFolderIcon, terminalSymbolSymbolicLinkFileIcon, terminalSymbolSymbolicLinkFolderIcon, terminalSymbolCommitIcon, terminalSymbolBranchIcon, terminalSymbolTagIcon, terminalSymbolStashIcon, terminalSymbolRemoteIcon, terminalSymbolPullRequestIcon, terminalSymbolPullRequestDoneIcon, terminalSymbolSymbolTextIcon } from './terminalSymbolIcons.js';
import { TerminalSuggestShownTracker } from './terminalSuggestShownTracker.js';
import { SimpleSuggestDetailsPlacement } from '../../../../services/suggest/browser/simpleSuggestWidgetDetails.js';
import { isString } from '../../../../../base/common/types.js';

export interface ISuggestController {
	isPasting: boolean;
	selectPreviousSuggestion(): void;
	selectPreviousPageSuggestion(): void;
	selectNextSuggestion(): void;
	selectNextPageSuggestion(): void;
	acceptSelectedSuggestion(suggestion?: Pick<ISimpleSelectedSuggestion<TerminalCompletionItem>, 'item' | 'model'>): void;
	hideSuggestWidget(cancelAnyRequests: boolean, wasClosedByUser?: boolean): void;
}

export function isInlineCompletionSupported(shellType: TerminalShellType | undefined): boolean {
	if (!shellType) {
		return false;
	}
	return shellType === PosixShellType.Bash ||
		shellType === PosixShellType.Zsh ||
		shellType === PosixShellType.Fish ||
		shellType === GeneralShellType.PowerShell ||
		shellType === WindowsShellType.GitBash;
}

export class SuggestAddon extends Disposable implements ITerminalAddon, ISuggestController {
	private _terminal?: Terminal;

	private _promptInputModel?: IPromptInputModel;
	private readonly _promptInputModelSubscriptions = this._register(new MutableDisposable());

	private _mostRecentPromptInputState?: IPromptInputModelState;
	private _currentPromptInputState?: IPromptInputModelState;
	private _model?: TerminalCompletionModel;

	private _container?: HTMLElement;
	private _screen?: HTMLElement;
	private _suggestWidget?: SimpleSuggestWidget<TerminalCompletionModel, TerminalCompletionItem>;
	private _cachedFontInfo: ISimpleSuggestWidgetFontInfo | undefined;
	private _enableWidget: boolean = true;
	private _pathSeparator: string = sep;
	private _isFilteringDirectories: boolean = false;

	// TODO: Remove these in favor of prompt input state
	private _leadingLineContent?: string;
	private _cursorIndexDelta: number = 0;
	private _requestedCompletionsIndex: number = 0;

	private _lastUserData?: string;
	static lastAcceptedCompletionTimestamp: number = 0;
	private _lastUserDataTimestamp: number = 0;

	private _cancellationTokenSource: CancellationTokenSource | undefined;

	private _discoverability: TerminalSuggestShownTracker | undefined;

	// Terminal suggest resolution tracking (similar to editor's suggest widget)
	private _currentSuggestionDetails?: CancelablePromise<void>;
	private _focusedItem?: TerminalCompletionItem;
	private _ignoreFocusEvents: boolean = false;
	private _requestCompletionsOnNextSync: boolean = false;

	isPasting: boolean = false;
	shellType: TerminalShellType | undefined;
	private readonly _shellTypeInit: Promise<void>;

	private readonly _onBell = this._register(new Emitter<void>());
	readonly onBell = this._onBell.event;
	private readonly _onAcceptedCompletion = this._register(new Emitter<string>());
	readonly onAcceptedCompletion = this._onAcceptedCompletion.event;
	private readonly _onDidReceiveCompletions = this._register(new Emitter<void>());
	readonly onDidReceiveCompletions = this._onDidReceiveCompletions.event;
	private readonly _onDidFontConfigurationChange = this._register(new Emitter<void>());
	readonly onDidFontConfigurationChange = this._onDidFontConfigurationChange.event;

	private _kindToIconMap = new Map<number, ThemeIcon>([
		[TerminalCompletionItemKind.File, terminalSymbolFileIcon],
		[TerminalCompletionItemKind.Folder, terminalSymbolFolderIcon],
		[TerminalCompletionItemKind.SymbolicLinkFile, terminalSymbolSymbolicLinkFileIcon],
		[TerminalCompletionItemKind.SymbolicLinkFolder, terminalSymbolSymbolicLinkFolderIcon],
		[TerminalCompletionItemKind.Method, terminalSymbolMethodIcon],
		[TerminalCompletionItemKind.Alias, terminalSymbolAliasIcon],
		[TerminalCompletionItemKind.Argument, terminalSymbolArgumentIcon],
		[TerminalCompletionItemKind.Option, terminalSymbolOptionIcon],
		[TerminalCompletionItemKind.OptionValue, terminalSymbolEnumMember],
		[TerminalCompletionItemKind.Flag, terminalSymbolFlagIcon],
		[TerminalCompletionItemKind.Commit, terminalSymbolCommitIcon],
		[TerminalCompletionItemKind.Branch, terminalSymbolBranchIcon],
		[TerminalCompletionItemKind.Tag, terminalSymbolTagIcon],
		[TerminalCompletionItemKind.Stash, terminalSymbolStashIcon],
		[TerminalCompletionItemKind.Remote, terminalSymbolRemoteIcon],
		[TerminalCompletionItemKind.PullRequest, terminalSymbolPullRequestIcon],
		[TerminalCompletionItemKind.PullRequestDone, terminalSymbolPullRequestDoneIcon],
		[TerminalCompletionItemKind.InlineSuggestion, terminalSymbolInlineSuggestionIcon],
		[TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop, terminalSymbolInlineSuggestionIcon],
	]);

	private _kindToKindLabelMap = new Map<number, string>([
		[TerminalCompletionItemKind.File, localize('file', 'File')],
		[TerminalCompletionItemKind.Folder, localize('folder', 'Folder')],
		[TerminalCompletionItemKind.SymbolicLinkFile, localize('symbolicLinkFile', 'Symbolic Link File')],
		[TerminalCompletionItemKind.SymbolicLinkFolder, localize('symbolicLinkFolder', 'Symbolic Link Folder')],
		[TerminalCompletionItemKind.Method, localize('method', 'Method')],
		[TerminalCompletionItemKind.Alias, localize('alias', 'Alias')],
		[TerminalCompletionItemKind.Argument, localize('argument', 'Argument')],
		[TerminalCompletionItemKind.Option, localize('option', 'Option')],
		[TerminalCompletionItemKind.OptionValue, localize('optionValue', 'Option Value')],
		[TerminalCompletionItemKind.Flag, localize('flag', 'Flag')],
		[TerminalCompletionItemKind.Commit, localize('commit', 'Commit')],
		[TerminalCompletionItemKind.Branch, localize('branch', 'Branch')],
		[TerminalCompletionItemKind.Tag, localize('tag', 'Tag')],
		[TerminalCompletionItemKind.Stash, localize('stash', 'Stash')],
		[TerminalCompletionItemKind.Remote, localize('remote', 'Remote')],
		[TerminalCompletionItemKind.PullRequest, localize('pullRequest', 'Pull Request')],
		[TerminalCompletionItemKind.PullRequestDone, localize('pullRequestDone', 'Pull Request (Done)')],
		[TerminalCompletionItemKind.InlineSuggestion, localize('inlineSuggestion', 'Inline Suggestion')],
		[TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop, localize('inlineSuggestionAlwaysOnTop', 'Inline Suggestion')],
	]);

	private readonly _inlineCompletion: ITerminalCompletion = {
		label: '',
		// Right arrow is used to accept the completion. This is a common keybinding in pwsh, zsh
		// and fish.
		inputData: '\x1b[C',
		replacementRange: [0, 0],
		provider: 'core:inlineSuggestion',
		detail: 'Inline suggestion',
		kind: TerminalCompletionItemKind.InlineSuggestion,
		kindLabel: 'Inline suggestion',
		icon: this._kindToIconMap.get(TerminalCompletionItemKind.InlineSuggestion),
	};
	private readonly _inlineCompletionItem = new TerminalCompletionItem(this._inlineCompletion);

	private _shouldSyncWhenReady: boolean = false;
	private _suggestTelemetry: TerminalSuggestTelemetry | undefined;

	private _completionRequestTimestamp: number | undefined;

	constructor(
		private readonly _sessionId: string,
		shellType: TerminalShellType | undefined,
		private readonly _capabilities: ITerminalCapabilityStore,
		private readonly _terminalSuggestWidgetVisibleContextKey: IContextKey<boolean>,
		@ITerminalCompletionService private readonly _terminalCompletionService: ITerminalCompletionService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
		super();

		// Initialize shell type, including a promise that completions can await for that resolves:
		// - immediately if shell type
		// - after a short delay if shell type gets set
		// - after a long delay if it doesn't get set
		this.shellType = shellType;
		if (this.shellType) {
			this._shellTypeInit = Promise.resolve();
		} else {
			const intervalTimer = this._register(new IntervalTimer());
			const timeoutTimer = this._register(new TimeoutTimer());
			this._shellTypeInit = new Promise<void>(r => {
				intervalTimer.cancelAndSet(() => {
					if (this.shellType) {
						r();
					}
				}, 50);
				timeoutTimer.cancelAndSet(r, 5000);
			}).then(() => {
				this._store.delete(intervalTimer);
				this._store.delete(timeoutTimer);
			});
		}

		this._register(Event.runAndSubscribe(this._capabilities.onDidChangeCapabilities, () => {
			const commandDetection = this._capabilities.get(TerminalCapability.CommandDetection);
			if (commandDetection) {
				if (this._promptInputModel !== commandDetection.promptInputModel) {
					this._promptInputModel = commandDetection.promptInputModel;
					this._suggestTelemetry = this._register(this._instantiationService.createInstance(TerminalSuggestTelemetry, commandDetection, this._promptInputModel));
					this._promptInputModelSubscriptions.value = combinedDisposable(
						this._promptInputModel.onDidChangeInput(e => this._sync(e)),
						this._promptInputModel.onDidFinishInput(() => {
							this.hideSuggestWidget(true);
						}),
					);
					if (this._shouldSyncWhenReady) {
						this._sync(this._promptInputModel);
						this._shouldSyncWhenReady = false;
					}
				}
			} else {
				this._promptInputModel = undefined;
			}
		}));
		this._register(this._terminalConfigurationService.onConfigChanged(() => this._cachedFontInfo = undefined));
		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TerminalSuggestSettingId.InlineSuggestion)) {
				const value = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection).inlineSuggestion;
				this._inlineCompletionItem.isInvalid = value === 'off';
				switch (value) {
					case 'alwaysOnTopExceptExactMatch': {
						this._inlineCompletion.kind = TerminalCompletionItemKind.InlineSuggestion;
						break;
					}
					case 'alwaysOnTop':
					default: {
						this._inlineCompletion.kind = TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop;
						break;
					}
				}
				this._model?.forceRefilterAll();
			}
		}));
	}

	activate(xterm: Terminal): void {
		this._terminal = xterm;
		this._register(xterm.onKey(async e => {
			this._lastUserData = e.key;
			this._lastUserDataTimestamp = Date.now();
		}));
		this._register(xterm.onScroll(() => this.hideSuggestWidget(true)));
		this._register(xterm.onResize(() => this._relayoutOnResize()));
	}

	private async _handleCompletionProviders(terminal: Terminal | undefined, token: CancellationToken, explicitlyInvoked?: boolean): Promise<void> {
		this._logService.trace('SuggestAddon#_handleCompletionProviders');

		// Nothing to handle if the terminal is not attached
		if (!terminal?.element || !this._enableWidget || !this._promptInputModel) {
			return;
		}

		// Only show the suggest widget if the terminal is focused
		if (!dom.isAncestorOfActiveElement(terminal.element)) {
			return;
		}

		// Wait for the shell type to initialize. This will wait a short period after launching to
		// allow the shell type to be set if possible. This prevents user requests sometimes getting
		// lost if requested shortly after the terminal is created. Completion providers can still
		// work with undefined shell types such as Pseudoterminal-based extension terminals.
		await this._shellTypeInit;

		let doNotRequestExtensionCompletions = false;
		// Ensure that a key has been pressed since the last accepted completion in order to prevent
		// completions being requested again right after accepting a completion
		if (this._promptInputModel.value !== '' && this._lastUserDataTimestamp < SuggestAddon.lastAcceptedCompletionTimestamp) {
			doNotRequestExtensionCompletions = true;
		}

		this._currentPromptInputState = {
			value: this._promptInputModel.value,
			prefix: this._promptInputModel.prefix,
			suffix: this._promptInputModel.suffix,
			cursorIndex: this._promptInputModel.cursorIndex,
			ghostTextIndex: this._promptInputModel.ghostTextIndex
		};
		this._requestedCompletionsIndex = this._currentPromptInputState.cursorIndex;

		// Show loading indicator before making async completion request (only for explicit invocations)
		if (explicitlyInvoked) {
			const suggestWidget = this._ensureSuggestWidget(terminal);
			const cursorPosition = this._getCursorPosition(terminal);
			if (cursorPosition) {
				suggestWidget.showTriggered(true, cursorPosition);
			}
		}

		const quickSuggestionsConfig = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection).quickSuggestions;
		const allowFallbackCompletions = explicitlyInvoked || quickSuggestionsConfig.unknown === 'on';
		this._logService.trace('SuggestAddon#_handleCompletionProviders provideCompletions');
		// Trim ghost text from the prompt value when requesting completions
		const ghostTextIndex = this._mostRecentPromptInputState?.ghostTextIndex === undefined ? -1 : this._mostRecentPromptInputState?.ghostTextIndex;
		const promptValue = ghostTextIndex > -1 ? this._currentPromptInputState.value.substring(0, ghostTextIndex) : this._currentPromptInputState.value;
		const providedCompletions = await this._terminalCompletionService.provideCompletions(promptValue, this._currentPromptInputState.cursorIndex, allowFallbackCompletions, this.shellType, this._capabilities, token, false, doNotRequestExtensionCompletions, explicitlyInvoked);
		this._logService.trace('SuggestAddon#_handleCompletionProviders provideCompletions done');

		if (token.isCancellationRequested) {
			return;
		}
		this._onDidReceiveCompletions.fire();

		this._cursorIndexDelta = this._promptInputModel.cursorIndex - this._requestedCompletionsIndex;
		this._leadingLineContent = this._promptInputModel.prefix.substring(0, this._requestedCompletionsIndex + this._cursorIndexDelta);

		const completions = providedCompletions?.flat() || [];
		if (!explicitlyInvoked && !completions.length) {
			this.hideSuggestWidget(true);
			return;
		}

		const firstChar = this._leadingLineContent.length === 0 ? '' : this._leadingLineContent[0];
		// This is a TabExpansion2 result
		if (this._leadingLineContent.includes(' ') || firstChar === '[') {
			this._leadingLineContent = this._promptInputModel.prefix;
		}

		let normalizedLeadingLineContent = this._leadingLineContent;

		// If there is a single directory in the completions:
		// - `\` and `/` are normalized such that either can be used
		// - Using `\` or `/` will request new completions. It's important that this only occurs
		//   when a directory is present, if not completions like git branches could be requested
		//   which leads to flickering
		this._isFilteringDirectories = completions.some(e => e.kind === TerminalCompletionItemKind.Folder);
		if (this._isFilteringDirectories) {
			const firstDir = completions.find(e => e.kind === TerminalCompletionItemKind.Folder);
			const textLabel = isString(firstDir?.label) ? firstDir.label : firstDir?.label.label;
			this._pathSeparator = textLabel?.match(/(?<sep>[\\\/])/)?.groups?.sep ?? sep;
			normalizedLeadingLineContent = normalizePathSeparator(normalizedLeadingLineContent, this._pathSeparator);
		}

		// Add any "ghost text" suggestion suggested by the shell. This aligns with behavior of the
		// editor and how it interacts with inline completions. This object is tracked and reused as
		// it may change on input.
		this._refreshInlineCompletion(completions);

		// Add any missing icons based on the completion item kind
		for (const completion of completions) {
			if (!completion.icon) {
				if (completion.kind !== undefined) {
					completion.icon = this._kindToIconMap.get(completion.kind);
					completion.kindLabel = this._kindToKindLabelMap.get(completion.kind);
				} else {
					completion.icon = terminalSymbolSymbolTextIcon;
				}
			}
		}

		const lineContext = new LineContext(normalizedLeadingLineContent, this._cursorIndexDelta);
		const items = completions.filter(c => !!c.label).map(c => new TerminalCompletionItem(c));
		if (isInlineCompletionSupported(this.shellType)) {
			items.push(this._inlineCompletionItem);
		}

		this._logService.trace('TerminalCompletionService#_collectCompletions create model');
		const model = new TerminalCompletionModel(
			items,
			lineContext
		);
		this._logService.trace('TerminalCompletionService#_collectCompletions create model done');

		if (token.isCancellationRequested) {
			this._completionRequestTimestamp = undefined;
			return;
		}

		this._showCompletions(model, explicitlyInvoked);
	}

	setContainerWithOverflow(container: HTMLElement): void {
		const containerChanged = this._container !== container;
		const parentChanged = this._suggestWidget?.element.domNode.parentElement !== container;
		if (!containerChanged && !parentChanged) {
			return;
		}
		this._container = container;
		if (this._suggestWidget) {
			container.appendChild(this._suggestWidget.element.domNode);
		}
	}

	setScreen(screen: HTMLElement): void {
		this._screen = screen;
	}

	toggleExplainMode(): void {
		this._suggestWidget?.toggleExplainMode();
	}

	toggleSuggestionFocus(): void {
		this._suggestWidget?.toggleDetailsFocus();
	}

	toggleSuggestionDetails(): void {
		this._suggestWidget?.toggleDetails();
	}

	resetWidgetSize(): void {
		this._suggestWidget?.resetWidgetSize();
	}

	async requestCompletions(explicitlyInvoked?: boolean): Promise<void> {
		this._logService.trace('SuggestAddon#requestCompletions');
		if (!this._promptInputModel) {
			this._shouldSyncWhenReady = true;
			return;
		}

		if (this.isPasting) {
			return;
		}
		if (this._cancellationTokenSource) {
			this._cancellationTokenSource.cancel();
			this._cancellationTokenSource.dispose();
		}
		this._cancellationTokenSource = new CancellationTokenSource();
		const token = this._cancellationTokenSource.token;

		// Track the time when completions are requested
		this._completionRequestTimestamp = Date.now();

		await this._handleCompletionProviders(this._terminal, token, explicitlyInvoked);

		// If completions are not shown (widget not visible), reset the tracker
		if (!this._terminalSuggestWidgetVisibleContextKey.get()) {
			this._completionRequestTimestamp = undefined;
		}
	}

	private _addPropertiesToInlineCompletionItem(completions: ITerminalCompletion[]): void {
		const inlineCompletionLabel = (isString(this._inlineCompletionItem.completion.label) ? this._inlineCompletionItem.completion.label : this._inlineCompletionItem.completion.label.label).trim();
		const inlineCompletionMatchIndex = completions.findIndex(c => isString(c.label) ? c.label === inlineCompletionLabel : c.label.label === inlineCompletionLabel);
		if (inlineCompletionMatchIndex !== -1) {
			// Remove the existing inline completion item from the completions list
			const richCompletionMatchingInline = completions.splice(inlineCompletionMatchIndex, 1)[0];
			// Apply its properties to the inline completion item
			this._inlineCompletionItem.completion.label = richCompletionMatchingInline.label;
			this._inlineCompletionItem.completion.detail = richCompletionMatchingInline.detail;
			this._inlineCompletionItem.completion.documentation = richCompletionMatchingInline.documentation;
		} else if (this._inlineCompletionItem.completion) {
			this._inlineCompletionItem.completion.detail = undefined;
			this._inlineCompletionItem.completion.documentation = undefined;
		}
	}

	private _requestTriggerCharQuickSuggestCompletions(): boolean {
		if (!this._wasLastInputVerticalArrowKey() && !this._wasLastInputTabKey()) {
			// Only request on trigger character when it's a regular input, or on an arrow if the widget
			// is already visible
			if (!this._wasLastInputIncludedEscape() || this._terminalSuggestWidgetVisibleContextKey.get()) {
				this.requestCompletions();
				return true;
			}
		}
		return false;
	}

	private _checkProviderTriggerCharacters(char: string): boolean {
		for (const provider of this._terminalCompletionService.providers) {
			if (!provider.triggerCharacters) {
				continue;
			}
			for (const triggerChar of provider.triggerCharacters) {
				if (char === triggerChar) {
					return true;
				}
			}
		}
		return false;
	}

	private _wasLastInputRightArrowKey(): boolean {
		return !!this._lastUserData?.match(/^\x1b[\[O]?C$/);
	}

	private _wasLastInputVerticalArrowKey(): boolean {
		return !!this._lastUserData?.match(/^\x1b[\[O]?[A-B]$/);
	}

	/**
	 * Whether the last input included the escape character. Typically this will mean it was more
	 * than just a simple character, such as arrow keys, home, end, etc.
	 */
	private _wasLastInputIncludedEscape(): boolean {
		return !!this._lastUserData?.includes('\x1b');
	}

	private _wasLastInputArrowKey(): boolean {
		// Never request completions if the last key sequence was up or down as the user was likely
		// navigating history
		return !!this._lastUserData?.match(/^\x1b[\[O]?[A-D]$/);
	}

	private _wasLastInputTabKey(): boolean {
		return this._lastUserData === '\t';
	}

	private _sync(promptInputState: IPromptInputModelState): void {
		const config = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection);
		{
			let sent = false;

			// If completions were requested from the addon
			if (this._requestCompletionsOnNextSync) {
				this._requestCompletionsOnNextSync = false;
				sent = this._requestTriggerCharQuickSuggestCompletions();
			}

			// If the cursor moved to the right
			if (!this._mostRecentPromptInputState || promptInputState.cursorIndex > this._mostRecentPromptInputState.cursorIndex) {
				// Quick suggestions - Trigger whenever a new non-whitespace character is used
				if (!this._terminalSuggestWidgetVisibleContextKey.get()) {
					const commandLineHasSpace = promptInputState.prefix.trim().match(/\s/);
					if (
						(!commandLineHasSpace && config.quickSuggestions.commands !== 'off') ||
						(commandLineHasSpace && config.quickSuggestions.arguments !== 'off')
					) {
						if (promptInputState.prefix.match(/[^\s]$/)) {
							sent = this._requestTriggerCharQuickSuggestCompletions();
						}
					}
				}

				// Trigger characters - this happens even if the widget is showing
				if (config.suggestOnTriggerCharacters && !sent) {
					const prefix = promptInputState.prefix;
					if (
						// Only trigger on `-` if it's after a space. This is required to not clear
						// completions when typing the `-` in `git cherry-pick`
						prefix?.match(/\s[\-]$/) ||
						// Only trigger on `\` and `/` if it's a directory. Not doing so causes problems
						// with git branches in particular
						this._isFilteringDirectories && prefix?.match(/[\\\/]$/)
					) {
						sent = this._requestTriggerCharQuickSuggestCompletions();
					}
					if (!sent) {
						for (const provider of this._terminalCompletionService.providers) {
							if (!provider.triggerCharacters) {
								continue;
							}
							for (const char of provider.triggerCharacters) {
								if (prefix?.endsWith(char)) {
									sent = this._requestTriggerCharQuickSuggestCompletions();
									break;
								}
							}
						}
					}
				}
			}

			// If the cursor moved to the left
			if (this._mostRecentPromptInputState && promptInputState.cursorIndex < this._mostRecentPromptInputState.cursorIndex && promptInputState.cursorIndex > 0) {
				// We only want to refresh via trigger characters in this case if the widget is
				// already visible
				if (this._terminalSuggestWidgetVisibleContextKey.get()) {
					// Backspace or left past a trigger character
					if (config.suggestOnTriggerCharacters && !sent && this._mostRecentPromptInputState.cursorIndex > 0) {
						const char = this._mostRecentPromptInputState.value[this._mostRecentPromptInputState.cursorIndex - 1];
						if (
							char && (
								// Only trigger on `\` and `/` if it's a directory. Not doing so causes problems
								// with git branches in particular
								this._isFilteringDirectories && char.match(/[\\\/]$/) ||
								// Check if the character is a trigger character from providers
								this._checkProviderTriggerCharacters(char)
							)
						) {
							sent = this._requestTriggerCharQuickSuggestCompletions();
						}
					}
				}
			}
		}

		// Hide the widget if ghost text was just completed via right arrow
		if (
			this._wasLastInputRightArrowKey() &&
			this._mostRecentPromptInputState?.ghostTextIndex !== -1 &&
			promptInputState.ghostTextIndex === -1 &&
			this._mostRecentPromptInputState?.value === promptInputState.value
		) {
			this.hideSuggestWidget(false);
		}

		this._mostRecentPromptInputState = promptInputState;
		if (!this._promptInputModel || !this._terminal || !this._suggestWidget || this._leadingLineContent === undefined) {
			return;
		}

		const previousPromptInputState = this._currentPromptInputState;
		this._currentPromptInputState = promptInputState;

		// Hide the widget if the latest character was a space
		if (this._currentPromptInputState.cursorIndex > 1 && this._currentPromptInputState.value.at(this._currentPromptInputState.cursorIndex - 1) === ' ') {
			if (!this._wasLastInputArrowKey()) {
				this.hideSuggestWidget(false);
				return;
			}
		}

		// Hide the widget if the cursor moves to the left and invalidates the completions.
		// Originally this was to the left of the initial position that the completions were
		// requested, but since extensions are expected to allow the client-side to filter, they are
		// only invalidated when whitespace is encountered.
		if (this._currentPromptInputState && this._currentPromptInputState.cursorIndex < this._leadingLineContent.length) {
			if (this._currentPromptInputState.cursorIndex <= 0 || previousPromptInputState?.value[this._currentPromptInputState.cursorIndex]?.match(/[\\\/\s]/)) {
				this.hideSuggestWidget(false);
				return;
			}
		}

		if (this._terminalSuggestWidgetVisibleContextKey.get()) {
			this._cursorIndexDelta = this._currentPromptInputState.cursorIndex - (this._requestedCompletionsIndex);
			let normalizedLeadingLineContent = this._currentPromptInputState.value.substring(0, this._requestedCompletionsIndex + this._cursorIndexDelta);
			if (this._isFilteringDirectories) {
				normalizedLeadingLineContent = normalizePathSeparator(normalizedLeadingLineContent, this._pathSeparator);
			}
			const lineContext = new LineContext(normalizedLeadingLineContent, this._cursorIndexDelta);
			this._suggestWidget.setLineContext(lineContext);
		}

		this._refreshInlineCompletion(this._model?.items.map(i => i.completion) || []);

		// Hide and clear model if there are no more items
		if (!this._suggestWidget.hasCompletions()) {
			this.hideSuggestWidget(false);
			return;
		}

		const cursorPosition = this._getCursorPosition(this._terminal);
		if (!cursorPosition) {
			return;
		}
		this._suggestWidget.showSuggestions(0, false, true, cursorPosition);
	}

	private _refreshInlineCompletion(completions: ITerminalCompletion[]): void {
		if (!isInlineCompletionSupported(this.shellType)) {
			// If the shell type is not supported, the inline completion item is invalid
			return;
		}
		const oldIsInvalid = this._inlineCompletionItem.isInvalid;
		if (!this._currentPromptInputState || this._currentPromptInputState.ghostTextIndex === -1) {
			this._inlineCompletionItem.isInvalid = true;
		} else {
			this._inlineCompletionItem.isInvalid = false;
			// Update properties
			const spaceIndex = this._currentPromptInputState.value.lastIndexOf(' ', this._currentPromptInputState.ghostTextIndex - 1);
			const replacementIndex = spaceIndex === -1 ? 0 : spaceIndex + 1;
			const suggestion = this._currentPromptInputState.value.substring(replacementIndex);
			this._inlineCompletion.label = suggestion;
			// Update replacementRange (inclusive start, exclusive end) for replacement
			const end = this._currentPromptInputState.cursorIndex - this._cursorIndexDelta;
			this._inlineCompletion.replacementRange = [replacementIndex, end];
			// Reset the completion item as the object reference must remain the same but its
			// contents will differ across syncs. This is done so we don't need to reassign the
			// model and the slowdown/flickering that could potentially cause.
			this._addPropertiesToInlineCompletionItem(completions);

			const x = new TerminalCompletionItem(this._inlineCompletion);
			this._inlineCompletionItem.idx = x.idx;
			this._inlineCompletionItem.score = x.score;
			this._inlineCompletionItem.labelLow = x.labelLow;
			this._inlineCompletionItem.textLabel = x.textLabel;
			this._inlineCompletionItem.fileExtLow = x.fileExtLow;
			this._inlineCompletionItem.labelLowExcludeFileExt = x.labelLowExcludeFileExt;
			this._inlineCompletionItem.labelLowNormalizedPath = x.labelLowNormalizedPath;
			this._inlineCompletionItem.punctuationPenalty = x.punctuationPenalty;
			this._inlineCompletionItem.word = x.word;
			this._model?.forceRefilterAll();
		}

		// Force a filter all in order to re-evaluate the inline completion
		if (this._inlineCompletionItem.isInvalid !== oldIsInvalid) {
			this._model?.forceRefilterAll();
		}
	}

	private _getTerminalDimensions(): { width: number; height: number } {
		interface XtermWithCore extends Terminal {
			_core: IXtermCore;
		}
		const cssCellDims = (this._terminal as XtermWithCore)._core._renderService.dimensions.css.cell;
		return {
			width: cssCellDims.width,
			height: cssCellDims.height,
		};
	}

	private _getCursorPosition(terminal: Terminal): { top: number; left: number; height: number } | undefined {
		const dimensions = this._getTerminalDimensions();
		if (!dimensions.width || !dimensions.height) {
			return undefined;
		}
		const xtermBox = this._screen!.getBoundingClientRect();
		return {
			left: xtermBox.left + terminal.buffer.active.cursorX * dimensions.width,
			top: xtermBox.top + terminal.buffer.active.cursorY * dimensions.height,
			height: dimensions.height
		};
	}

	private _getFontInfo(): ISimpleSuggestWidgetFontInfo {
		if (this._cachedFontInfo) {
			return this._cachedFontInfo;
		}

		interface XtermWithCore extends Terminal {
			_core: IXtermCore;
		}
		const core = (this._terminal as XtermWithCore)._core;
		const font = this._terminalConfigurationService.getFont(dom.getActiveWindow(), core);
		let lineHeight: number = font.lineHeight;
		const fontSize: number = font.fontSize;
		const fontFamily: string = font.fontFamily;
		const letterSpacing: number = font.letterSpacing;
		const fontWeight: string = this._configurationService.getValue('editor.fontWeight');

		// Unlike editor suggestions, line height in terminal is always multiplied to the font size.
		// Make sure that we still enforce a minimum line height to avoid content from being clipped.
		// See https://github.com/microsoft/vscode/issues/255851
		lineHeight = lineHeight * fontSize;

		// Enforce integer, minimum constraints
		lineHeight = Math.round(lineHeight);
		const minTerminalLineHeight = GOLDEN_LINE_HEIGHT_RATIO * fontSize;
		if (lineHeight < minTerminalLineHeight) {
			lineHeight = minTerminalLineHeight;
		}

		const fontInfo = {
			fontSize,
			lineHeight,
			fontWeight: fontWeight.toString(),
			letterSpacing,
			fontFamily
		};

		this._cachedFontInfo = fontInfo;

		return fontInfo;
	}

	private _getAdvancedExplainModeDetails(): string | undefined {
		return `promptInputModel: ${this._promptInputModel?.getCombinedString()}`;
	}

	private _showCompletions(model: TerminalCompletionModel, explicitlyInvoked?: boolean): void {
		this._logService.trace('SuggestAddon#_showCompletions');
		if (!this._terminal?.element) {
			return;
		}
		const suggestWidget = this._ensureSuggestWidget(this._terminal);

		this._logService.trace('SuggestAddon#_showCompletions setCompletionModel');
		suggestWidget.setCompletionModel(model);

		this._register(suggestWidget.onDidFocus(() => this._terminal?.focus()));
		if (!this._promptInputModel || !explicitlyInvoked && model.items.length === 0) {
			return;
		}
		this._model = model;
		const cursorPosition = this._getCursorPosition(this._terminal);
		if (!cursorPosition) {
			return;
		}
		// Track the time when completions are shown for the first time
		if (this._completionRequestTimestamp !== undefined) {
			const completionLatency = Date.now() - this._completionRequestTimestamp;
			if (this._suggestTelemetry && this._discoverability) {
				const firstShown = this._discoverability.getFirstShown(this.shellType);
				this._discoverability.updateShown();
				this._suggestTelemetry.logCompletionLatency(this._sessionId, completionLatency, firstShown);
			}
			this._completionRequestTimestamp = undefined;
		}
		this._logService.trace('SuggestAddon#_showCompletions suggestWidget.showSuggestions');
		suggestWidget.showSuggestions(0, false, !explicitlyInvoked, cursorPosition);
	}


	private _ensureSuggestWidget(terminal: Terminal): SimpleSuggestWidget<TerminalCompletionModel, TerminalCompletionItem> {
		if (!this._suggestWidget) {
			this._suggestWidget = this._register(this._instantiationService.createInstance(
				SimpleSuggestWidget,
				this._container!,
				this._instantiationService.createInstance(PersistedWidgetSize),
				{
					statusBarMenuId: MenuId.MenubarTerminalSuggestStatusMenu,
					showStatusBarSettingId: TerminalSuggestSettingId.ShowStatusBar,
					selectionModeSettingId: TerminalSuggestSettingId.SelectionMode,
					preventDetailsPlacements: [SimpleSuggestDetailsPlacement.West],
				},
				this._getFontInfo.bind(this),
				this._onDidFontConfigurationChange.event.bind(this),
				this._getAdvancedExplainModeDetails.bind(this)
			)) as unknown as SimpleSuggestWidget<TerminalCompletionModel, TerminalCompletionItem>;
			this._register(this._suggestWidget.onDidSelect(async e => this.acceptSelectedSuggestion(e)));
			this._register(this._suggestWidget.onDidHide(() => this._terminalSuggestWidgetVisibleContextKey.reset()));
			this._register(this._suggestWidget.onDidShow(() => this._terminalSuggestWidgetVisibleContextKey.set(true)));
			this._register(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(TerminalSettingId.FontFamily) || e.affectsConfiguration(TerminalSettingId.FontSize) || e.affectsConfiguration(TerminalSettingId.LineHeight) || e.affectsConfiguration(TerminalSettingId.FontFamily) || e.affectsConfiguration('editor.fontSize') || e.affectsConfiguration('editor.fontFamily')) {
					this._onDidFontConfigurationChange.fire();
				}
			}
			));

			this._register(this._suggestWidget.onDidFocus(async e => {
				if (this._ignoreFocusEvents) {
					return;
				}

				const focusedItem = e.item;
				const focusedIndex = e.index;

				if (focusedItem === this._focusedItem) {
					return;
				}

				// Cancel any previous resolution
				this._currentSuggestionDetails?.cancel();
				this._currentSuggestionDetails = undefined;
				this._focusedItem = focusedItem;

				// Check if the item needs resolution and hasn't been resolved yet
				if (focusedItem && (!focusedItem.completion.documentation || !focusedItem.completion.detail)) {

					this._currentSuggestionDetails = createCancelablePromise(async token => {
						try {
							await focusedItem.resolve(token);
						} catch (error) {
							// Silently fail - the item is still usable without details
							this._logService.warn(`Failed to resolve suggestion details for item ${focusedItem} at index ${focusedIndex}`, error);
						}
					});

					this._currentSuggestionDetails.then(() => {
						// Check if this is still the focused item and it's still in the list
						if (focusedItem !== this._focusedItem || !this._suggestWidget?.list || focusedIndex >= this._suggestWidget.list.length) {
							return;
						}

						// Re-render the specific item to show resolved details (like editor does)
						this._ignoreFocusEvents = true;
						// Use splice to replace the item and trigger re-render
						this._suggestWidget.list.splice(focusedIndex, 1, [focusedItem]);
						this._suggestWidget.list.setFocus([focusedIndex]);
						this._ignoreFocusEvents = false;
					});
				}

			}));

			// eslint-disable-next-line no-restricted-syntax
			const element = this._terminal?.element?.querySelector('.xterm-helper-textarea');
			if (element) {
				this._register(dom.addDisposableListener(dom.getActiveDocument(), 'click', (event) => {
					const target = event.target as HTMLElement;
					if (this._terminal?.element?.contains(target)) {
						this._suggestWidget?.hide();
					}
				}));
			}

			this._register(this._suggestWidget.onDidShow(() => this._updateDiscoverabilityState()));
			this._register(this._suggestWidget.onDidBlurDetails((e) => {
				const elt = e.relatedTarget as HTMLElement;
				if (this._terminal?.element?.contains(elt)) {
					// Do nothing, just the terminal getting focused
					// If there was a mouse click, the suggest widget will be
					// hidden above
					return;
				}
				this._suggestWidget?.hide();
			}));
			this._terminalSuggestWidgetVisibleContextKey.set(false);
		}
		return this._suggestWidget;
	}

	private _updateDiscoverabilityState(): void {
		if (!this._discoverability) {
			this._discoverability = this._register(this._instantiationService.createInstance(TerminalSuggestShownTracker, this.shellType));
		}

		if (!this._suggestWidget || this._discoverability?.done) {
			return;
		}
		this._discoverability?.update(this._suggestWidget.element.domNode);
	}

	resetDiscoverability(): void {
		this._discoverability?.resetState();
	}

	selectPreviousSuggestion(): void {
		this._suggestWidget?.selectPrevious();
	}

	selectPreviousPageSuggestion(): void {
		this._suggestWidget?.selectPreviousPage();
	}

	selectNextSuggestion(): void {
		this._suggestWidget?.selectNext();
	}

	selectNextPageSuggestion(): void {
		this._suggestWidget?.selectNextPage();
	}

	acceptSelectedSuggestion(suggestion?: Pick<ISimpleSelectedSuggestion<TerminalCompletionItem>, 'item' | 'model'>, respectRunOnEnter?: boolean): void {
		if (!suggestion) {
			suggestion = this._suggestWidget?.getFocusedItem();
		}

		const initialPromptInputState = this._mostRecentPromptInputState;
		if (!suggestion?.item || !initialPromptInputState || this._leadingLineContent === undefined || !this._model) {
			this._suggestTelemetry?.acceptCompletion(this._sessionId, undefined, this._mostRecentPromptInputState?.value);
			return;
		}
		SuggestAddon.lastAcceptedCompletionTimestamp = Date.now();
		this._suggestWidget?.hide();

		const currentPromptInputState = this._currentPromptInputState ?? initialPromptInputState;

		// The replacement text is any text after the replacement index for the completions, this
		// includes any text that was there before the completions were requested and any text added
		// since to refine the completion.
		const startIndex = suggestion.item.completion.replacementRange?.[0] ?? currentPromptInputState.cursorIndex;
		const replacementText = currentPromptInputState.value.substring(startIndex, currentPromptInputState.cursorIndex);

		// Right side of replacement text in the same word
		let rightSideReplacementText = '';
		if (
			// The line didn't end with ghost text
			(currentPromptInputState.ghostTextIndex === -1 || currentPromptInputState.ghostTextIndex > currentPromptInputState.cursorIndex) &&
			// There is more than one charatcer
			currentPromptInputState.value.length > currentPromptInputState.cursorIndex + 1 &&
			// THe next character is not a space
			currentPromptInputState.value.at(currentPromptInputState.cursorIndex) !== ' '
		) {
			const spaceIndex = currentPromptInputState.value.substring(currentPromptInputState.cursorIndex, currentPromptInputState.ghostTextIndex === -1 ? undefined : currentPromptInputState.ghostTextIndex).indexOf(' ');
			rightSideReplacementText = currentPromptInputState.value.substring(currentPromptInputState.cursorIndex, spaceIndex === -1 ? undefined : currentPromptInputState.cursorIndex + spaceIndex);
		}

		const completion = suggestion.item.completion;
		let resultSequence = completion.inputData;

		// Use for amend the label if inputData is not defined
		if (resultSequence === undefined) {
			let completionText = isString(completion.label) ? completion.label : completion.label.label;
			if ((completion.kind === TerminalCompletionItemKind.Folder || completion.isFileOverride) && completionText.includes(' ')) {
				// Escape spaces in files or folders so they're valid paths
				completionText = completionText.replaceAll(' ', '\\ ');
			}
			let runOnEnter = false;
			if (respectRunOnEnter) {
				const runOnEnterConfig = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection).runOnEnter;
				switch (runOnEnterConfig) {
					case 'always': {
						runOnEnter = true;
						break;
					}
					case 'exactMatch': {
						runOnEnter = replacementText.toLowerCase() === completionText.toLowerCase();
						break;
					}
					case 'exactMatchIgnoreExtension': {
						runOnEnter = replacementText.toLowerCase() === completionText.toLowerCase();
						if (completion.isFileOverride) {
							runOnEnter ||= replacementText.toLowerCase() === completionText.toLowerCase().replace(/\.[^\.]+$/, '');
						}
						break;
					}
				}
			}

			const commonPrefixLen = commonPrefixLength(replacementText, completionText);
			const commonPrefix = replacementText.substring(replacementText.length - 1 - commonPrefixLen, replacementText.length - 1);
			const completionSuffix = completionText.substring(commonPrefixLen);
			if (currentPromptInputState.suffix.length > 0 && currentPromptInputState.prefix.endsWith(commonPrefix) && currentPromptInputState.suffix.startsWith(completionSuffix)) {
				// Move right to the end of the completion
				resultSequence = '\x1bOC'.repeat(completionText.length - commonPrefixLen);
			} else {
				resultSequence = [
					// Backspace (left) to remove all additional input
					'\x7F'.repeat(replacementText.length - commonPrefixLen),
					// Delete (right) to remove any additional text in the same word
					'\x1b[3~'.repeat(rightSideReplacementText.length),
					// Write the completion
					completionSuffix,
					// Run on enter if needed
					runOnEnter ? '\r' : ''
				].join('');
			}
		}

		// For folders, allow the next completion request to get completions for that folder
		if (completion.kind === TerminalCompletionItemKind.Folder) {
			SuggestAddon.lastAcceptedCompletionTimestamp = 0;
		}

		// Add trailing space if enabled and not a folder or symbolic link folder
		const config = this._configurationService.getValue<ITerminalSuggestConfiguration>(terminalSuggestConfigSection);
		if (config.insertTrailingSpace && completion.kind !== TerminalCompletionItemKind.Folder && completion.kind !== TerminalCompletionItemKind.SymbolicLinkFolder) {
			resultSequence += ' ';
			this._lastUserDataTimestamp = Date.now();
			this._requestCompletionsOnNextSync = true;
		}

		// Send the completion
		this._onAcceptedCompletion.fire(resultSequence);
		this._suggestTelemetry?.acceptCompletion(this._sessionId, completion, this._mostRecentPromptInputState?.value);
		this.hideSuggestWidget(true);
	}

	hideSuggestWidget(cancelAnyRequest: boolean): void {
		this._discoverability?.resetTimer();
		if (cancelAnyRequest) {
			this._cancellationTokenSource?.cancel();
			this._cancellationTokenSource = undefined;
			// Also cancel any pending resolution requests
			this._currentSuggestionDetails?.cancel();
			this._currentSuggestionDetails = undefined;
		}
		this._currentPromptInputState = undefined;
		this._leadingLineContent = undefined;
		this._focusedItem = undefined;
		this._suggestWidget?.hide();
	}

	private _relayoutOnResize(): void {
		if (!this._terminalSuggestWidgetVisibleContextKey.get() || !this._terminal) {
			return;
		}
		const cursorPosition = this._getCursorPosition(this._terminal);
		if (!cursorPosition) {
			this.hideSuggestWidget(true);
			return;
		}
		this._suggestWidget?.relayout(cursorPosition);
	}
}

class PersistedWidgetSize {

	private readonly _key = TerminalStorageKeys.TerminalSuggestSize;

	constructor(
		@IStorageService private readonly _storageService: IStorageService
	) {
	}

	restore(): dom.Dimension | undefined {
		const raw = this._storageService.get(this._key, StorageScope.PROFILE) ?? '';
		try {
			const obj = JSON.parse(raw);
			if (dom.Dimension.is(obj)) {
				return dom.Dimension.lift(obj);
			}
		} catch {
			// ignore
		}
		return undefined;
	}

	store(size: dom.Dimension) {
		this._storageService.store(this._key, JSON.stringify(size), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	reset(): void {
		this._storageService.remove(this._key, StorageScope.PROFILE);
	}
}

export function normalizePathSeparator(path: string, sep: string): string {
	if (sep === '/') {
		return path.replaceAll('\\', '/');
	}
	return path.replaceAll('/', '\\');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestShownTracker.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestShownTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TimeoutTimer } from '../../../../../base/common/async.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { TerminalShellType } from '../../../../../platform/terminal/common/terminal.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';


export const TERMINAL_SUGGEST_DISCOVERABILITY_KEY = 'terminal.suggest.increasedDiscoverability';
export const TERMINAL_SUGGEST_DISCOVERABILITY_COUNT_KEY = 'terminal.suggest.increasedDiscoverabilityCount';
const TERMINAL_SUGGEST_DISCOVERABILITY_MAX_COUNT = 10;
const TERMINAL_SUGGEST_DISCOVERABILITY_MIN_MS = 10000;

interface ITerminalSuggestShownTracker extends IDisposable {
	getFirstShown(shellType: TerminalShellType): { window: boolean; shell: boolean };
	updateShown(): void;
	resetState(): void;
}

export class TerminalSuggestShownTracker extends Disposable implements ITerminalSuggestShownTracker {
	private _done: boolean;
	private _count: number;
	private _timeout: TimeoutTimer | undefined;
	private _start: number | undefined;

	private _firstShownTracker: { shell: Set<TerminalShellType | undefined>; window: boolean } | undefined = undefined;

	constructor(
		private readonly _shellType: TerminalShellType | undefined,
		@IStorageService private readonly _storageService: IStorageService,
		@IExtensionService private readonly _extensionService: IExtensionService

	) {
		super();
		this._done = this._storageService.getBoolean(TERMINAL_SUGGEST_DISCOVERABILITY_KEY, StorageScope.APPLICATION, false);
		this._count = this._storageService.getNumber(TERMINAL_SUGGEST_DISCOVERABILITY_COUNT_KEY, StorageScope.APPLICATION, 0);
		this._register(this._extensionService.onWillStop(() => this._firstShownTracker = undefined));
	}

	get done(): boolean {
		return this._done;
	}

	resetState(): void {
		this._done = false;
		this._count = 0;
		this._start = undefined;
		this._firstShownTracker = undefined;
	}

	resetTimer(): void {
		if (this._timeout) {
			this._timeout.cancel();
			this._timeout = undefined;
		}
		this._start = undefined;
	}

	update(widgetElt: HTMLElement | undefined): void {
		if (this._done) {
			return;
		}
		this._count++;
		this._storageService.store(TERMINAL_SUGGEST_DISCOVERABILITY_COUNT_KEY, this._count, StorageScope.APPLICATION, StorageTarget.USER);
		if (widgetElt && !widgetElt.classList.contains('increased-discoverability')) {
			widgetElt.classList.add('increased-discoverability');
		}
		if (this._count >= TERMINAL_SUGGEST_DISCOVERABILITY_MAX_COUNT) {
			this._setDone(widgetElt);
		} else if (!this._start) {
			this.resetTimer();
			this._start = Date.now();
			this._timeout = this._register(new TimeoutTimer(() => {
				this._setDone(widgetElt);
			}, TERMINAL_SUGGEST_DISCOVERABILITY_MIN_MS));
		}
	}

	private _setDone(widgetElt: HTMLElement | undefined) {
		this._done = true;
		this._storageService.store(TERMINAL_SUGGEST_DISCOVERABILITY_KEY, true, StorageScope.APPLICATION, StorageTarget.USER);
		if (widgetElt) {
			widgetElt.classList.remove('increased-discoverability');
		}
		if (this._timeout) {
			this._timeout.cancel();
			this._timeout = undefined;
		}
		this._start = undefined;
	}

	getFirstShown(shellType: TerminalShellType | undefined): { window: boolean; shell: boolean } {
		if (!this._firstShownTracker) {
			this._firstShownTracker = {
				window: true,
				shell: new Set([shellType])
			};
			return { window: true, shell: true };
		}

		const isFirstForWindow = this._firstShownTracker.window;
		const isFirstForShell = !this._firstShownTracker.shell.has(shellType);

		if (isFirstForWindow || isFirstForShell) {
			this.updateShown();
		}

		return {
			window: isFirstForWindow,
			shell: isFirstForShell
		};
	}

	updateShown(): void {
		if (!this._shellType || !this._firstShownTracker) {
			return;
		}

		this._firstShownTracker.window = false;
		this._firstShownTracker.shell.add(this._shellType);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestTelemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSuggestTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { isString } from '../../../../../base/common/types.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ICommandDetectionCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { IPromptInputModel } from '../../../../../platform/terminal/common/capabilities/commandDetection/promptInputModel.js';
import { ITerminalCompletion, TerminalCompletionItemKind } from './terminalCompletionItem.js';

export class TerminalSuggestTelemetry extends Disposable {
	private _acceptedCompletions: Array<{ label: string; kind?: string; sessionId: string; provider: string }> | undefined;

	private _kindMap = new Map<number, string>([
		[TerminalCompletionItemKind.File, 'File'],
		[TerminalCompletionItemKind.Folder, 'Folder'],
		[TerminalCompletionItemKind.Method, 'Method'],
		[TerminalCompletionItemKind.Alias, 'Alias'],
		[TerminalCompletionItemKind.Argument, 'Argument'],
		[TerminalCompletionItemKind.Option, 'Option'],
		[TerminalCompletionItemKind.OptionValue, 'Option Value'],
		[TerminalCompletionItemKind.Flag, 'Flag'],
		[TerminalCompletionItemKind.InlineSuggestion, 'Inline Suggestion'],
		[TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop, 'Inline Suggestion'],
	]);

	constructor(
		commandDetection: ICommandDetectionCapability,
		private readonly _promptInputModel: IPromptInputModel,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super();
		this._register(commandDetection.onCommandFinished((e) => {
			this._sendTelemetryInfo(false, e.exitCode);
			this._acceptedCompletions = undefined;
		}));
		this._register(this._promptInputModel.onDidInterrupt(() => {
			this._sendTelemetryInfo(true);
			this._acceptedCompletions = undefined;
		}));
	}
	acceptCompletion(sessionId: string, completion: ITerminalCompletion | undefined, commandLine?: string): void {
		if (!completion || !commandLine) {
			this._acceptedCompletions = undefined;
			return;
		}
		this._acceptedCompletions = this._acceptedCompletions || [];
		this._acceptedCompletions.push({ label: isString(completion.label) ? completion.label : completion.label.label, kind: this._kindMap.get(completion.kind!), sessionId, provider: completion.provider });
	}

	/**
	 * Logs the latency (ms) from completion request to completions shown.
	 * @param sessionId The terminal session ID
	 * @param latency The measured latency in ms
	 * @param firstShownFor Object indicating if completions have been shown for window/shell
	 */
	logCompletionLatency(sessionId: string, latency: number, firstShownFor: { window: boolean; shell: boolean }): void {
		this._telemetryService.publicLog2<{
			terminalSessionId: string;
			latency: number;
			firstWindow: boolean;
			firstShell: boolean;
		}, {
			owner: 'meganrogge';
			comment: 'Latency in ms from terminal completion request to completions shown.';
			terminalSessionId: {
				classification: 'SystemMetaData';
				purpose: 'FeatureInsight';
				comment: 'The session ID of the terminal session.';
			};
			latency: {
				classification: 'SystemMetaData';
				purpose: 'PerformanceAndHealth';
				comment: 'The latency in milliseconds.';
			};
			firstWindow: {
				classification: 'SystemMetaData';
				purpose: 'FeatureInsight';
				comment: 'Whether this is the first ever showing of completions in the window.';
			};
			firstShell: {
				classification: 'SystemMetaData';
				purpose: 'FeatureInsight';
				comment: 'Whether this is the first ever showing of completions in the shell.';
			};
		}>('terminal.suggest.completionLatency', {
			terminalSessionId: sessionId,
			latency,
			firstWindow: firstShownFor.window,
			firstShell: firstShownFor.shell
		});
	}


	private _sendTelemetryInfo(fromInterrupt?: boolean, exitCode?: number): void {
		const commandLine = this._promptInputModel?.value;
		for (const completion of this._acceptedCompletions || []) {
			const label = completion?.label;
			const kind = completion?.kind;
			const provider = completion?.provider;

			if (label === undefined || commandLine === undefined || kind === undefined || provider === undefined) {
				return;
			}

			let outcome: string;
			if (fromInterrupt) {
				outcome = CompletionOutcome.Interrupted;
			} else if (commandLine.trim() && commandLine.includes(label)) {
				outcome = CompletionOutcome.Accepted;
			} else if (inputContainsFirstHalfOfLabel(commandLine, label)) {
				outcome = CompletionOutcome.AcceptedWithEdit;
			} else {
				outcome = CompletionOutcome.Deleted;
			}
			this._telemetryService.publicLog2<{
				kind: string | undefined;
				outcome: string;
				exitCode: number | undefined;
				terminalSessionId: string;
				provider: string | undefined;
			}, {
				owner: 'meganrogge';
				comment: 'This data is collected to understand the outcome of a terminal completion acceptance.';
				kind: {
					classification: 'SystemMetaData';
					purpose: 'FeatureInsight';
					comment: 'The completion item\'s kind';
				};
				outcome: {
					classification: 'SystemMetaData';
					purpose: 'FeatureInsight';
					comment: 'The outcome of the accepted completion';
				};
				exitCode: {
					classification: 'SystemMetaData';
					purpose: 'FeatureInsight';
					comment: 'The exit code from the command';
				};
				terminalSessionId: {
					classification: 'SystemMetaData';
					purpose: 'FeatureInsight';
					comment: 'The session ID of the terminal session where the completion was accepted';
				};
				provider: {
					classification: 'SystemMetaData';
					purpose: 'FeatureInsight';
					comment: 'The ID of the provider that supplied the completion';
				};
			}>('terminal.suggest.acceptedCompletion', {
				kind,
				outcome,
				exitCode,
				terminalSessionId: completion.sessionId,
				provider
			});
		}
	}
}

const enum CompletionOutcome {
	Accepted = 'Accepted',
	Deleted = 'Deleted',
	AcceptedWithEdit = 'AcceptedWithEdit',
	Interrupted = 'Interrupted'
}

function inputContainsFirstHalfOfLabel(commandLine: string, label: string): boolean {
	return commandLine.includes(label.substring(0, Math.ceil(label.length / 2)));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSymbolIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/terminalSymbolIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/terminalSymbolIcons.css';
import { SYMBOL_ICON_ENUMERATOR_FOREGROUND, SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND, SYMBOL_ICON_METHOD_FOREGROUND, SYMBOL_ICON_VARIABLE_FOREGROUND, SYMBOL_ICON_FILE_FOREGROUND, SYMBOL_ICON_FOLDER_FOREGROUND } from '../../../../../editor/contrib/symbolIcons/browser/symbolIcons.js';
import { registerColor } from '../../../../../platform/theme/common/colorUtils.js';
import { localize } from '../../../../../nls.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { Codicon } from '../../../../../base/common/codicons.js';

export const TERMINAL_SYMBOL_ICON_FLAG_FOREGROUND = registerColor('terminalSymbolIcon.flagForeground', SYMBOL_ICON_ENUMERATOR_FOREGROUND, localize('terminalSymbolIcon.flagForeground', 'The foreground color for an flag icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_ALIAS_FOREGROUND = registerColor('terminalSymbolIcon.aliasForeground', SYMBOL_ICON_METHOD_FOREGROUND, localize('terminalSymbolIcon.aliasForeground', 'The foreground color for an alias icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_OPTION_VALUE_FOREGROUND = registerColor('terminalSymbolIcon.optionValueForeground', SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND, localize('terminalSymbolIcon.enumMemberForeground', 'The foreground color for an enum member icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_METHOD_FOREGROUND = registerColor('terminalSymbolIcon.methodForeground', SYMBOL_ICON_METHOD_FOREGROUND, localize('terminalSymbolIcon.methodForeground', 'The foreground color for a method icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_ARGUMENT_FOREGROUND = registerColor('terminalSymbolIcon.argumentForeground', SYMBOL_ICON_VARIABLE_FOREGROUND, localize('terminalSymbolIcon.argumentForeground', 'The foreground color for an argument icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_OPTION_FOREGROUND = registerColor('terminalSymbolIcon.optionForeground', SYMBOL_ICON_ENUMERATOR_FOREGROUND, localize('terminalSymbolIcon.optionForeground', 'The foreground color for an option icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_INLINE_SUGGESTION_FOREGROUND = registerColor('terminalSymbolIcon.inlineSuggestionForeground', null, localize('terminalSymbolIcon.inlineSuggestionForeground', 'The foreground color for an inline suggestion icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_FILE_FOREGROUND = registerColor('terminalSymbolIcon.fileForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.fileForeground', 'The foreground color for a file icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_FOLDER_FOREGROUND = registerColor('terminalSymbolIcon.folderForeground', SYMBOL_ICON_FOLDER_FOREGROUND, localize('terminalSymbolIcon.folderForeground', 'The foreground color for a folder icon. These icons will appear in the terminal suggest widget.'));

export const TERMINAL_SYMBOL_ICON_COMMIT_FOREGROUND = registerColor('terminalSymbolIcon.commitForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.commitForeground', 'The foreground color for a commit icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_BRANCH_FOREGROUND = registerColor('terminalSymbolIcon.branchForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.branchForeground', 'The foreground color for a branch icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_TAG_FOREGROUND = registerColor('terminalSymbolIcon.tagForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.tagForeground', 'The foreground color for a tag icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_STASH_FOREGROUND = registerColor('terminalSymbolIcon.stashForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.stashForeground', 'The foreground color for a stash icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_REMOTE_FOREGROUND = registerColor('terminalSymbolIcon.remoteForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.remoteForeground', 'The foreground color for a remote icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_PULL_REQUEST_FOREGROUND = registerColor('terminalSymbolIcon.pullRequestForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.pullRequestForeground', 'The foreground color for a pull request icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_PULL_REQUEST_DONE_FOREGROUND = registerColor('terminalSymbolIcon.pullRequestDoneForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.pullRequestDoneForeground', 'The foreground color for a completed pull request icon. These icons will appear in the terminal suggest widget.'));

export const TERMINAL_SYMBOL_ICON_SYMBOLIC_LINK_FILE_FOREGROUND = registerColor('terminalSymbolIcon.symbolicLinkFileForeground', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.symbolicLinkFileForeground', 'The foreground color for a symbolic link file icon. These icons will appear in the terminal suggest widget.'));
export const TERMINAL_SYMBOL_ICON_SYMBOLIC_LINK_FOLDER_FOREGROUND = registerColor('terminalSymbolIcon.symbolicLinkFolderForeground', SYMBOL_ICON_FOLDER_FOREGROUND, localize('terminalSymbolIcon.symbolicLinkFolderForeground', 'The foreground color for a symbolic link folder icon. These icons will appear in the terminal suggest widget.'));

export const TERMINAL_SYMBOL_ICON_SYMBOL_TEXT_FOREGROUND = registerColor('terminalSymbolIcon.symbolText', SYMBOL_ICON_FILE_FOREGROUND, localize('terminalSymbolIcon.symbolTextForeground', 'The foreground color for a plaintext suggestion. These icons will appear in the terminal suggest widget.'));

export const terminalSymbolFlagIcon = registerIcon('terminal-symbol-flag', Codicon.flag, localize('terminalSymbolFlagIcon', 'Icon for flags in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_FLAG_FOREGROUND);
export const terminalSymbolAliasIcon = registerIcon('terminal-symbol-alias', Codicon.symbolMethod, localize('terminalSymbolAliasIcon', 'Icon for aliases in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_ALIAS_FOREGROUND);
export const terminalSymbolEnumMember = registerIcon('terminal-symbol-option-value', Codicon.symbolEnumMember, localize('terminalSymbolOptionValue', 'Icon for enum members in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_OPTION_VALUE_FOREGROUND);
export const terminalSymbolMethodIcon = registerIcon('terminal-symbol-method', Codicon.symbolMethod, localize('terminalSymbolMethodIcon', 'Icon for methods in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_METHOD_FOREGROUND);
export const terminalSymbolArgumentIcon = registerIcon('terminal-symbol-argument', Codicon.symbolVariable, localize('terminalSymbolArgumentIcon', 'Icon for arguments in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_ARGUMENT_FOREGROUND);
export const terminalSymbolOptionIcon = registerIcon('terminal-symbol-option', Codicon.symbolEnum, localize('terminalSymbolOptionIcon', 'Icon for options in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_OPTION_FOREGROUND);
export const terminalSymbolInlineSuggestionIcon = registerIcon('terminal-symbol-inline-suggestion', Codicon.star, localize('terminalSymbolInlineSuggestionIcon', 'Icon for inline suggestions in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_INLINE_SUGGESTION_FOREGROUND);
export const terminalSymbolFileIcon = registerIcon('terminal-symbol-file', Codicon.symbolFile, localize('terminalSymbolFileIcon', 'Icon for files in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_FILE_FOREGROUND);
export const terminalSymbolFolderIcon = registerIcon('terminal-symbol-folder', Codicon.symbolFolder, localize('terminalSymbolFolderIcon', 'Icon for folders in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_FOLDER_FOREGROUND);

export const terminalSymbolCommitIcon = registerIcon('terminal-symbol-commit', Codicon.gitCommit, localize('terminalSymbolCommitIcon', 'Icon for commits in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_COMMIT_FOREGROUND);
export const terminalSymbolBranchIcon = registerIcon('terminal-symbol-branch', Codicon.gitBranch, localize('terminalSymbolBranchIcon', 'Icon for branches in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_BRANCH_FOREGROUND);
export const terminalSymbolTagIcon = registerIcon('terminal-symbol-tag', Codicon.tag, localize('terminalSymbolTagIcon', 'Icon for tags in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_TAG_FOREGROUND);
export const terminalSymbolStashIcon = registerIcon('terminal-symbol-stash', Codicon.gitStash, localize('terminalSymbolStashIcon', 'Icon for stashes in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_STASH_FOREGROUND);
export const terminalSymbolRemoteIcon = registerIcon('terminal-symbol-remote', Codicon.remote, localize('terminalSymbolRemoteIcon', 'Icon for remotes in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_REMOTE_FOREGROUND);
export const terminalSymbolPullRequestIcon = registerIcon('terminal-symbol-pull-request', Codicon.gitPullRequest, localize('terminalSymbolPullRequestIcon', 'Icon for pull requests in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_PULL_REQUEST_FOREGROUND);
export const terminalSymbolPullRequestDoneIcon = registerIcon('terminal-symbol-pull-request-done', Codicon.gitPullRequestDone, localize('terminalSymbolPullRequestDoneIcon', 'Icon for completed pull requests in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_PULL_REQUEST_DONE_FOREGROUND);

export const terminalSymbolSymbolicLinkFileIcon = registerIcon('terminal-symbol-symbolic-link-file', Codicon.fileSymlinkFile, localize('terminalSymbolSymbolicLinkFileIcon', 'Icon for symbolic link files in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_SYMBOLIC_LINK_FILE_FOREGROUND);
export const terminalSymbolSymbolicLinkFolderIcon = registerIcon('terminal-symbol-symbolic-link-folder', Codicon.fileSymlinkDirectory, localize('terminalSymbolSymbolicLinkFolderIcon', 'Icon for symbolic link folders in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_SYMBOLIC_LINK_FOLDER_FOREGROUND);

export const terminalSymbolSymbolTextIcon = registerIcon('terminal-symbol-symbol-text', Codicon.symbolKey, localize('terminalSymbolSymboTextIcon', 'Icon for plain text suggestions in the terminal suggest widget.'), TERMINAL_SYMBOL_ICON_SYMBOL_TEXT_FOREGROUND);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/media/terminalSymbolIcons.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/media/terminalSymbolIcons.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .codicon.codicon-terminal-symbol-alias,
.monaco-workbench .codicon.codicon-terminal-symbol-alias { color: var(--vscode-terminalSymbolIcon-aliasForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-flag,
.monaco-workbench .codicon.codicon-terminal-symbol-flag { color: var(--vscode-terminalSymbolIcon-flagForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-option-value,
.monaco-workbench .codicon.codicon-terminal-symbol-option-value { color: var(--vscode-terminalSymbolIcon-optionValueForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-method,
.monaco-workbench .codicon.codicon-terminal-symbol-method { color: var(--vscode-terminalSymbolIcon-methodForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-argument,
.monaco-workbench .codicon.codicon-terminal-symbol-argument { color: var(--vscode-terminalSymbolIcon-argumentForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-option,
.monaco-workbench .codicon.codicon-terminal-symbol-option { color: var(--vscode-terminalSymbolIcon-optionForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-inline-suggestion,
.monaco-workbench .codicon.codicon-terminal-symbol-inline-suggestion { color: var(--vscode-terminalSymbolIcon-inlineSuggestionForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-file,
.monaco-workbench .codicon.codicon-terminal-symbol-file { color: var(--vscode-terminalSymbolIcon-fileForeground); }

.monaco-editor .codicon.codicon-terminal-symbol-folder,
.monaco-workbench .codicon.codicon-terminal-symbol-folder { color: var(--vscode-terminalSymbolIcon-folderForeground); }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/common/terminal.suggest.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/common/terminal.suggest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalSuggestCommandId {
	SelectPrevSuggestion = 'workbench.action.terminal.selectPrevSuggestion',
	SelectPrevPageSuggestion = 'workbench.action.terminal.selectPrevPageSuggestion',
	SelectNextSuggestion = 'workbench.action.terminal.selectNextSuggestion',
	SelectNextPageSuggestion = 'workbench.action.terminal.selectNextPageSuggestion',
	AcceptSelectedSuggestion = 'workbench.action.terminal.acceptSelectedSuggestion',
	AcceptSelectedSuggestionEnter = 'workbench.action.terminal.acceptSelectedSuggestionEnter',
	HideSuggestWidget = 'workbench.action.terminal.hideSuggestWidget',
	HideSuggestWidgetAndNavigateHistory = 'workbench.action.terminal.hideSuggestWidgetAndNavigateHistory',
	TriggerSuggest = 'workbench.action.terminal.triggerSuggest',
	ResetWidgetSize = 'workbench.action.terminal.resetSuggestWidgetSize',
	ToggleDetails = 'workbench.action.terminal.suggestToggleDetails',
	ToggleDetailsFocus = 'workbench.action.terminal.suggestToggleDetailsFocus',
	ConfigureSettings = 'workbench.action.terminal.configureSuggestSettings',
	LearnMore = 'workbench.action.terminal.suggestLearnMore',
	ResetDiscoverability = 'workbench.action.terminal.resetDiscoverability'
}

export const defaultTerminalSuggestCommandsToSkipShell = [
	TerminalSuggestCommandId.SelectPrevSuggestion,
	TerminalSuggestCommandId.SelectPrevPageSuggestion,
	TerminalSuggestCommandId.SelectNextSuggestion,
	TerminalSuggestCommandId.SelectNextPageSuggestion,
	TerminalSuggestCommandId.AcceptSelectedSuggestion,
	TerminalSuggestCommandId.AcceptSelectedSuggestionEnter,
	TerminalSuggestCommandId.HideSuggestWidget,
	TerminalSuggestCommandId.TriggerSuggest,
	TerminalSuggestCommandId.ToggleDetails,
	TerminalSuggestCommandId.ToggleDetailsFocus,
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/common/terminalSuggestConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/common/terminalSuggestConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationPropertySchema, IConfigurationNode, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';

export const enum TerminalSuggestSettingId {
	Enabled = 'terminal.integrated.suggest.enabled',
	QuickSuggestions = 'terminal.integrated.suggest.quickSuggestions',
	SuggestOnTriggerCharacters = 'terminal.integrated.suggest.suggestOnTriggerCharacters',
	RunOnEnter = 'terminal.integrated.suggest.runOnEnter',
	WindowsExecutableExtensions = 'terminal.integrated.suggest.windowsExecutableExtensions',
	Providers = 'terminal.integrated.suggest.providers',
	ShowStatusBar = 'terminal.integrated.suggest.showStatusBar',
	CdPath = 'terminal.integrated.suggest.cdPath',
	InlineSuggestion = 'terminal.integrated.suggest.inlineSuggestion',
	UpArrowNavigatesHistory = 'terminal.integrated.suggest.upArrowNavigatesHistory',
	SelectionMode = 'terminal.integrated.suggest.selectionMode',
	InsertTrailingSpace = 'terminal.integrated.suggest.insertTrailingSpace',
}

export const windowsDefaultExecutableExtensions: string[] = [
	'exe',   // Executable file
	'bat',   // Batch file
	'cmd',   // Command script
	'com',   // Command file

	'msi',   // Windows Installer package

	'ps1',   // PowerShell script

	'vbs',   // VBScript file
	'js',    // JScript file
	'jar',   // Java Archive (requires Java runtime)
	'py',    // Python script (requires Python interpreter)
	'rb',    // Ruby script (requires Ruby interpreter)
	'pl',    // Perl script (requires Perl interpreter)
	'sh',    // Shell script (via WSL or third-party tools)
];

export const terminalSuggestConfigSection = 'terminal.integrated.suggest';

export interface ITerminalSuggestConfiguration {
	enabled: boolean;
	quickSuggestions: {
		commands: 'off' | 'on';
		arguments: 'off' | 'on';
		unknown: 'off' | 'on';
	};
	suggestOnTriggerCharacters: boolean;
	runOnEnter: 'never' | 'exactMatch' | 'exactMatchIgnoreExtension' | 'always';
	windowsExecutableExtensions: { [key: string]: boolean };
	providers: { [key: string]: boolean };
	showStatusBar: boolean;
	cdPath: 'off' | 'relative' | 'absolute';
	inlineSuggestion: 'off' | 'alwaysOnTopExceptExactMatch' | 'alwaysOnTop';
	insertTrailingSpace: boolean;
}

export const terminalSuggestConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalSuggestSettingId.Enabled]: {
		restricted: true,
		markdownDescription: localize('suggest.enabled', "Enables terminal IntelliSense suggestions (also known as autocomplete) for supported shells ({0}). This requires {1} to be enabled and working or [manually installed](https://code.visualstudio.com/docs/terminal/shell-integration#_manual-installation-install).", 'Windows PowerShell, PowerShell v7+, zsh, bash, fish', `\`#${TerminalSettingId.ShellIntegrationEnabled}#\``),
		type: 'boolean',
		default: true,
	},
	[TerminalSuggestSettingId.Providers]: {
		restricted: true,
		markdownDescription: localize('suggest.providers', "Providers are enabled by default. Omit them by setting the id of the provider to `false`."),
		type: 'object',
		properties: {},
	},
	[TerminalSuggestSettingId.QuickSuggestions]: {
		restricted: true,
		markdownDescription: localize('suggest.quickSuggestions', "Controls whether suggestions should automatically show up while typing. Also be aware of the {0}-setting which controls if suggestions are triggered by special characters.", `\`#${TerminalSuggestSettingId.SuggestOnTriggerCharacters}#\``),
		type: 'object',
		properties: {
			commands: {
				description: localize('suggest.quickSuggestions.commands', 'Enable quick suggestions for commands, the first word in a command line input.'),
				type: 'string',
				enum: ['off', 'on'],
			},
			arguments: {
				description: localize('suggest.quickSuggestions.arguments', 'Enable quick suggestions for arguments, anything after the first word in a command line input.'),
				type: 'string',
				enum: ['off', 'on'],
			},
			unknown: {
				description: localize('suggest.quickSuggestions.unknown', 'Enable quick suggestions when it\'s unclear what the best suggestion is, if this is on files and folders will be suggested as a fallback.'),
				type: 'string',
				enum: ['off', 'on'],
			},
		},
		default: {
			commands: 'on',
			arguments: 'on',
			unknown: 'off',
		},
	},
	[TerminalSuggestSettingId.SuggestOnTriggerCharacters]: {
		restricted: true,
		markdownDescription: localize('suggest.suggestOnTriggerCharacters', "Controls whether suggestions should automatically show up when typing trigger characters."),
		type: 'boolean',
		default: true,
	},
	[TerminalSuggestSettingId.RunOnEnter]: {
		restricted: true,
		markdownDescription: localize('suggest.runOnEnter', "Controls whether suggestions should run immediately when `Enter` (not `Tab`) is used to accept the result."),
		enum: ['never', 'exactMatch', 'exactMatchIgnoreExtension', 'always'],
		markdownEnumDescriptions: [
			localize('runOnEnter.never', "Never run on `Enter`."),
			localize('runOnEnter.exactMatch', "Run on `Enter` when the suggestion is typed in its entirety."),
			localize('runOnEnter.exactMatchIgnoreExtension', "Run on `Enter` when the suggestion is typed in its entirety or when a file is typed without its extension included."),
			localize('runOnEnter.always', "Always run on `Enter`.")
		],
		default: 'never',
	},
	[TerminalSuggestSettingId.SelectionMode]: {
		markdownDescription: localize('terminal.integrated.selectionMode', "Controls how suggestion selection works in the integrated terminal."),
		type: 'string',
		enum: ['partial', 'always', 'never'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.selectionMode.partial', "Partially select a suggestion when automatically triggering IntelliSense. `Tab` can be used to accept the first suggestion, only after navigating the suggestions via `Down` will `Enter` also accept the active suggestion."),
			localize('terminal.integrated.selectionMode.always', "Always select a suggestion when automatically triggering IntelliSense. `Enter` or `Tab` can be used to accept the first suggestion."),
			localize('terminal.integrated.selectionMode.never', "Never select a suggestion when automatically triggering IntelliSense. The list must be navigated via `Down` before `Enter` or `Tab` can be used to accept the active suggestion."),
		],
		default: 'partial',
	},
	[TerminalSuggestSettingId.WindowsExecutableExtensions]: {
		restricted: true,
		markdownDescription: localize("terminalWindowsExecutableSuggestionSetting", "A set of windows command executable extensions that will be included as suggestions in the terminal.\n\nMany executables are included by default, listed below:\n\n{0}.\n\nTo exclude an extension, set it to `false`\n\n. To include one not in the list, add it and set it to `true`.",
			windowsDefaultExecutableExtensions.sort().map(extension => `- ${extension}`).join('\n'),
		),
		type: 'object',
		default: {},
	},
	[TerminalSuggestSettingId.ShowStatusBar]: {
		restricted: true,
		markdownDescription: localize('suggest.showStatusBar', "Controls whether the terminal suggestions status bar should be shown."),
		type: 'boolean',
		default: true,
	},
	[TerminalSuggestSettingId.CdPath]: {
		restricted: true,
		markdownDescription: localize('suggest.cdPath', "Controls whether to enable $CDPATH support which exposes children of the folders in the $CDPATH variable regardless of the current working directory. $CDPATH is expected to be semi colon-separated on Windows and colon-separated on other platforms."),
		type: 'string',
		enum: ['off', 'relative', 'absolute'],
		markdownEnumDescriptions: [
			localize('suggest.cdPath.off', "Disable the feature."),
			localize('suggest.cdPath.relative', "Enable the feature and use relative paths."),
			localize('suggest.cdPath.absolute', "Enable the feature and use absolute paths. This is useful when the shell doesn't natively support `$CDPATH`."),
		],
		default: 'absolute',
	},
	[TerminalSuggestSettingId.InlineSuggestion]: {
		restricted: true,
		markdownDescription: localize('suggest.inlineSuggestion', "Controls whether the shell's inline suggestion should be detected and how it is scored."),
		type: 'string',
		enum: ['off', 'alwaysOnTopExceptExactMatch', 'alwaysOnTop'],
		markdownEnumDescriptions: [
			localize('suggest.inlineSuggestion.off', "Disable the feature."),
			localize('suggest.inlineSuggestion.alwaysOnTopExceptExactMatch', "Enable the feature and sort the inline suggestion without forcing it to be on top. This means that exact matches will be above the inline suggestion."),
			localize('suggest.inlineSuggestion.alwaysOnTop', "Enable the feature and always put the inline suggestion on top."),
		],
		default: 'alwaysOnTop',
	},
	[TerminalSuggestSettingId.UpArrowNavigatesHistory]: {
		restricted: true,
		markdownDescription: localize('suggest.upArrowNavigatesHistory', "Determines whether the up arrow key navigates the command history when focus is on the first suggestion and navigation has not yet occurred. When set to false, the up arrow will move focus to the last suggestion instead."),
		type: 'boolean',
		default: true,
	},
	[TerminalSuggestSettingId.InsertTrailingSpace]: {
		restricted: true,
		markdownDescription: localize('suggest.insertTrailingSpace', "Controls whether a space is automatically inserted after accepting a suggestion and re-trigger suggestions. Folders and symbolic link folders will never have a trailing space added."),
		type: 'boolean',
		default: false,
	},

};

export interface ITerminalSuggestProviderInfo {
	id: string;
	description?: string;
}

let terminalSuggestProvidersConfiguration: IConfigurationNode | undefined;

export function registerTerminalSuggestProvidersConfiguration(providers?: Map<string, ITerminalSuggestProviderInfo>) {
	const oldProvidersConfiguration = terminalSuggestProvidersConfiguration;

	providers ??= new Map();
	if (!providers.has('lsp')) {
		providers.set('lsp', {
			id: 'lsp',
			description: localize('suggest.provider.lsp.description', 'Show suggestions from language servers.')
		});
	}

	const providersProperties: IStringDictionary<IConfigurationPropertySchema> = {};
	for (const id of Array.from(providers.keys()).sort()) {
		providersProperties[id] = {
			type: 'boolean',
			default: id === 'lsp' ? false : true,
			description:
				providers.get(id)?.description ??
				localize('suggest.provider.title', "Show suggestions from {0}.", id)
		};
	}

	const defaultValue: IStringDictionary<boolean> = {};
	for (const key in providersProperties) {
		defaultValue[key] = providersProperties[key].default as boolean;
	}

	terminalSuggestProvidersConfiguration = {
		id: 'terminalSuggestProviders',
		order: 100,
		title: localize('terminalSuggestProvidersConfigurationTitle', "Terminal Suggest Providers"),
		type: 'object',
		properties: {
			[TerminalSuggestSettingId.Providers]: {
				restricted: true,
				markdownDescription: localize('suggest.providersEnabledByDefault', "Controls which suggestions automatically show up while typing. Suggestion providers are enabled by default."),
				type: 'object',
				properties: providersProperties,
				default: defaultValue,
				tags: ['preview'],
				additionalProperties: false
			}
		}
	};

	const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
	registry.updateConfigurations({
		add: [terminalSuggestProvidersConfiguration],
		remove: oldProvidersConfiguration ? [oldProvidersConfiguration] : []
	});
}

registerTerminalSuggestProvidersConfiguration();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/lspTerminalModelContentProvider.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/lspTerminalModelContentProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { createTerminalLanguageVirtualUri, LspTerminalModelContentProvider } from '../../browser/lspTerminalModelContentProvider.js';
import * as sinon from 'sinon';
import assert from 'assert';
import { URI } from '../../../../../../base/common/uri.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { GeneralShellType } from '../../../../../../platform/terminal/common/terminal.js';
import { ITerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { VSCODE_LSP_TERMINAL_PROMPT_TRACKER } from '../../browser/lspTerminalUtil.js';

suite('LspTerminalModelContentProvider', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let capabilityStore: ITerminalCapabilityStore;
	let textModelService: ITextModelService;
	let modelService: IModelService;
	let mockTextModel: ITextModel;
	let lspTerminalModelContentProvider: LspTerminalModelContentProvider;
	let virtualTerminalDocumentUri: URI;
	let setValueSpy: sinon.SinonStub;
	let getValueSpy: sinon.SinonStub;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		capabilityStore = store.add(new TerminalCapabilityStore());
		virtualTerminalDocumentUri = URI.from({ scheme: 'vscodeTerminal', path: '/terminal1.py' });

		// Create stubs for the mock text model methods
		setValueSpy = sinon.stub();
		getValueSpy = sinon.stub();

		mockTextModel = {
			setValue: setValueSpy,
			getValue: getValueSpy,
			dispose: sinon.stub(),
			isDisposed: sinon.stub().returns(false)
		} as unknown as ITextModel;

		// Create a stub for modelService.getModel
		modelService = {} as IModelService;
		modelService.getModel = sinon.stub().callsFake((uri: URI) => {
			return uri.toString() === virtualTerminalDocumentUri.toString() ? mockTextModel : null;
		});

		// Create stub services for instantiation service
		textModelService = {} as ITextModelService;
		textModelService.registerTextModelContentProvider = sinon.stub().returns({ dispose: sinon.stub() });

		const markerService = {} as IMarkerService;
		markerService.installResourceFilter = sinon.stub().returns({ dispose: sinon.stub() });

		const languageService = {} as ILanguageService;

		// Set up the services in the instantiation service
		instantiationService.stub(IModelService, modelService);
		instantiationService.stub(ITextModelService, textModelService);
		instantiationService.stub(IMarkerService, markerService);
		instantiationService.stub(ILanguageService, languageService);

		// Create the provider instance
		lspTerminalModelContentProvider = store.add(instantiationService.createInstance(
			LspTerminalModelContentProvider,
			capabilityStore,
			1,
			virtualTerminalDocumentUri,
			GeneralShellType.Python
		));
	});

	teardown(() => {
		sinon.restore();
		lspTerminalModelContentProvider?.dispose();
	});

	suite('setContent', () => {

		test('should add delimiter when setting content on empty document', () => {
			getValueSpy.returns('');

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			assert.strictEqual(setValueSpy.args[0][0], VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
		});

		test('should update content with delimiter when document already has content', () => {
			const existingContent = 'previous content\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			getValueSpy.returns(existingContent);

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			const expectedContent = 'previous content\n\nprint("hello")\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			assert.strictEqual(setValueSpy.args[0][0], expectedContent);
		});

		test('should sanitize content when delimiter is in the middle of existing content', () => {
			// Simulating a corrupted state where the delimiter is in the middle
			const existingContent = 'previous content\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER + 'some extra text';
			getValueSpy.returns(existingContent);

			lspTerminalModelContentProvider.setContent('print("hello")');

			assert.strictEqual(setValueSpy.calledOnce, true);
			const expectedContent = 'previous content\n\nprint("hello")\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
			assert.strictEqual(setValueSpy.args[0][0], expectedContent);
		});

		test('Mac, Linux - createTerminalLanguageVirtualUri should return the correct URI', () => {
			const expectedUri = URI.from({ scheme: Schemas.vscodeTerminal, path: '/terminal1.py' });
			const actualUri = createTerminalLanguageVirtualUri(1, 'py');
			assert.strictEqual(actualUri.toString(), expectedUri.toString());
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert, { notStrictEqual, strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TerminalCompletionModel } from '../../browser/terminalCompletionModel.js';
import { LineContext } from '../../../../../services/suggest/browser/simpleCompletionModel.js';
import { TerminalCompletionItem, TerminalCompletionItemKind, type ITerminalCompletion } from '../../browser/terminalCompletionItem.js';
import type { CompletionItemLabel } from '../../../../../services/suggest/browser/simpleCompletionItem.js';

function createItem(options: Partial<ITerminalCompletion>): TerminalCompletionItem {
	return new TerminalCompletionItem({
		...options,
		kind: options.kind ?? TerminalCompletionItemKind.Method,
		label: options.label || 'defaultLabel',
		provider: options.provider || 'defaultProvider',
		replacementRange: options.replacementRange || [0, 1],
	});
}

function createFileItems(...labels: string[]): TerminalCompletionItem[] {
	return labels.map(label => createItem({ label, kind: TerminalCompletionItemKind.File }));
}

function createFileItemsModel(...labels: string[]): TerminalCompletionModel {
	return new TerminalCompletionModel(
		createFileItems(...labels),
		new LineContext('', 0)
	);
}

function createFolderItems(...labels: string[]): TerminalCompletionItem[] {
	return labels.map(label => createItem({ label, kind: TerminalCompletionItemKind.Folder }));
}

function createFolderItemsModel(...labels: string[]): TerminalCompletionModel {
	return new TerminalCompletionModel(
		createFolderItems(...labels),
		new LineContext('', 0)
	);
}

function assertItems(model: TerminalCompletionModel, labels: (string | CompletionItemLabel)[]): void {
	assert.deepStrictEqual(model.items.map(i => i.completion.label), labels);
	assert.strictEqual(model.items.length, labels.length); // sanity check
}

suite('TerminalCompletionModel', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	let model: TerminalCompletionModel;

	test('should handle an empty list', function () {
		model = new TerminalCompletionModel([], new LineContext('', 0));

		assert.strictEqual(model.items.length, 0);
	});

	test('should handle a list with one item', function () {
		model = new TerminalCompletionModel([
			createItem({ label: 'a' }),
		], new LineContext('', 0));

		assert.strictEqual(model.items.length, 1);
		assert.strictEqual(model.items[0].completion.label, 'a');
	});

	test('should sort alphabetically', function () {
		model = new TerminalCompletionModel([
			createItem({ label: 'b' }),
			createItem({ label: 'z' }),
			createItem({ label: 'a' }),
		], new LineContext('', 0));

		assert.strictEqual(model.items.length, 3);
		assert.strictEqual(model.items[0].completion.label, 'a');
		assert.strictEqual(model.items[1].completion.label, 'b');
		assert.strictEqual(model.items[2].completion.label, 'z');
	});

	test('fuzzy matching', () => {
		const initial = [
			'.\\.eslintrc',
			'.\\resources\\',
			'.\\scripts\\',
			'.\\src\\',
		];
		const expected = [
			'.\\scripts\\',
			'.\\src\\',
			'.\\.eslintrc',
			'.\\resources\\',
		];
		model = new TerminalCompletionModel(initial.map(e => (createItem({ label: e }))), new LineContext('s', 0));

		assertItems(model, expected);
	});

	suite('files and folders', () => {
		test('should deprioritize files that start with underscore', function () {
			const initial = ['_a', 'a', 'z'];
			const expected = ['a', 'z', '_a'];
			assertItems(createFileItemsModel(...initial), expected);
			assertItems(createFolderItemsModel(...initial), expected);
		});

		test('should ignore the dot in dotfiles when sorting', function () {
			const initial = ['b', '.a', 'a', '.b'];
			const expected = ['.a', 'a', 'b', '.b'];
			assertItems(createFileItemsModel(...initial), expected);
			assertItems(createFolderItemsModel(...initial), expected);
		});

		test('should handle many files and folders correctly', function () {
			// This is VS Code's root directory with some python items added that have special
			// sorting
			const items = [
				...createFolderItems(
					'__pycache',
					'.build',
					'.configurations',
					'.devcontainer',
					'.eslint-plugin-local',
					'.github',
					'.profile-oss',
					'.vscode',
					'.vscode-test',
					'build',
					'cli',
					'extensions',
					'node_modules',
					'out',
					'remote',
					'resources',
					'scripts',
					'src',
					'test',
				),
				...createFileItems(
					'__init__.py',
					'.editorconfig',
					'.eslint-ignore',
					'.git-blame-ignore-revs',
					'.gitattributes',
					'.gitignore',
					'.lsifrc.json',
					'.mailmap',
					'.mention-bot',
					'.npmrc',
					'.nvmrc',
					'.vscode-test.js',
					'cglicenses.json',
					'cgmanifest.json',
					'CodeQL.yml',
					'CONTRIBUTING.md',
					'eslint.config.js',
					'gulpfile.js',
					'LICENSE.txt',
					'package-lock.json',
					'package.json',
					'product.json',
					'README.md',
					'SECURITY.md',
					'ThirdPartyNotices.txt',
					'tsfmt.json',
				)
			];
			const model = new TerminalCompletionModel(items, new LineContext('', 0));
			assertItems(model, [
				'.build',
				'build',
				'cglicenses.json',
				'cgmanifest.json',
				'cli',
				'CodeQL.yml',
				'.configurations',
				'CONTRIBUTING.md',
				'.devcontainer',
				'.editorconfig',
				'eslint.config.js',
				'.eslint-ignore',
				'.eslint-plugin-local',
				'extensions',
				'.gitattributes',
				'.git-blame-ignore-revs',
				'.github',
				'.gitignore',
				'gulpfile.js',
				'LICENSE.txt',
				'.lsifrc.json',
				'.mailmap',
				'.mention-bot',
				'node_modules',
				'.npmrc',
				'.nvmrc',
				'out',
				'package.json',
				'package-lock.json',
				'product.json',
				'.profile-oss',
				'README.md',
				'remote',
				'resources',
				'scripts',
				'SECURITY.md',
				'src',
				'test',
				'ThirdPartyNotices.txt',
				'tsfmt.json',
				'.vscode',
				'.vscode-test',
				'.vscode-test.js',
				'__init__.py',
				'__pycache',
			]);
		});
	});

	suite('Punctuation', () => {
		test('punctuation chars should be below other methods', function () {
			const items = [
				createItem({ label: 'a' }),
				createItem({ label: 'b' }),
				createItem({ label: ',' }),
				createItem({ label: ';' }),
				createItem({ label: ':' }),
				createItem({ label: 'c' }),
				createItem({ label: '[' }),
				createItem({ label: '...' }),
			];
			model = new TerminalCompletionModel(items, new LineContext('', 0));
			assertItems(model, ['a', 'b', 'c', ',', ';', ':', '[', '...']);
		});
		test('punctuation chars should be below other files', function () {
			const items = [
				createItem({ label: '..' }),
				createItem({ label: '...' }),
				createItem({ label: '../' }),
				createItem({ label: './a/' }),
				createItem({ label: './b/' }),
			];
			model = new TerminalCompletionModel(items, new LineContext('', 0));
			assertItems(model, ['./a/', './b/', '..', '...', '../']);
		});
	});

	suite('inline completions', () => {
		function createItems(kind: TerminalCompletionItemKind.InlineSuggestion | TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop) {
			return [
				...createFolderItems('a', 'c'),
				...createFileItems('b', 'd'),
				new TerminalCompletionItem({
					label: 'ab',
					provider: 'core',
					replacementRange: [0, 0],
					kind
				})
			];
		}
		suite('InlineSuggestion', () => {
			test('should put on top generally', function () {
				const model = new TerminalCompletionModel(createItems(TerminalCompletionItemKind.InlineSuggestion), new LineContext('', 0));
				strictEqual(model.items[0].completion.label, 'ab');
			});
			test('should NOT put on top when there\'s an exact match of another item', function () {
				const model = new TerminalCompletionModel(createItems(TerminalCompletionItemKind.InlineSuggestion), new LineContext('a', 0));
				notStrictEqual(model.items[0].completion.label, 'ab');
				strictEqual(model.items[1].completion.label, 'ab');
			});
		});
		suite('InlineSuggestionAlwaysOnTop', () => {
			test('should put on top generally', function () {
				const model = new TerminalCompletionModel(createItems(TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop), new LineContext('', 0));
				strictEqual(model.items[0].completion.label, 'ab');
			});
			test('should put on top even if there\'s an exact match of another item', function () {
				const model = new TerminalCompletionModel(createItems(TerminalCompletionItemKind.InlineSuggestionAlwaysOnTop), new LineContext('a', 0));
				strictEqual(model.items[0].completion.label, 'ab');
			});
		});
	});


	suite('git branch priority sorting', () => {
		test('should prioritize main and master branches for git commands', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'feature-branch' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'development' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('git checkout ', 0));
			assertItems(model, ['main', 'master', 'development', 'feature-branch']);
		});

		test('should prioritize main and master branches for git switch command', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'feature-branch' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'another-feature' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('git switch ', 0));
			assertItems(model, ['main', 'master', 'another-feature', 'feature-branch']);
		});

		test('should not prioritize main and master for non-git commands', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'feature-branch' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('ls ', 0));
			assertItems(model, ['feature-branch', 'main', 'master']);
		});

		test('should handle git commands with leading whitespace', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'feature-branch' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('  git checkout ', 0));
			assertItems(model, ['main', 'master', 'feature-branch']);
		});

		test('should work with complex label objects', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: { label: 'feature-branch', description: 'Feature branch' } }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: { label: 'master', description: 'Master branch' } }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: { label: 'main', description: 'Main branch' } })
			];
			const model = new TerminalCompletionModel(items, new LineContext('git checkout ', 0));
			assertItems(model, [
				{ label: 'main', description: 'Main branch' },
				{ label: 'master', description: 'Master branch' },
				{ label: 'feature-branch', description: 'Feature branch' },
			]);
		});

		test('should not prioritize branches with similar names', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'mainline' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'masterpiece' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('git checkout ', 0));
			assertItems(model, ['main', 'master', 'mainline', 'masterpiece']);
		});

		test('should prioritize for git branch -d', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'main' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'master' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'dev' })
			];
			const model = new TerminalCompletionModel(items, new LineContext('git branch -d ', 0));
			assertItems(model, ['main', 'master', 'dev']);
		});
	});

	suite('mixed kind sorting', () => {
		test('should sort arguments before flags and options', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.Flag, label: '--verbose' }),
				createItem({ kind: TerminalCompletionItemKind.Option, label: '--config' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'value2' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'value1' }),
				createItem({ kind: TerminalCompletionItemKind.Flag, label: '--all' }),
			];
			const model = new TerminalCompletionModel(items, new LineContext('cmd ', 0));
			assertItems(model, ['value1', 'value2', '--all', '--config', '--verbose']);
		});

		test('should sort by kind hierarchy: methods/aliases, arguments, others, files/folders', () => {
			const items = [
				createItem({ kind: TerminalCompletionItemKind.File, label: 'file.txt' }),
				createItem({ kind: TerminalCompletionItemKind.Flag, label: '--flag' }),
				createItem({ kind: TerminalCompletionItemKind.Argument, label: 'arg' }),
				createItem({ kind: TerminalCompletionItemKind.Method, label: 'method' }),
				createItem({ kind: TerminalCompletionItemKind.Folder, label: 'folder/' }),
				createItem({ kind: TerminalCompletionItemKind.Option, label: '--option' }),
				createItem({ kind: TerminalCompletionItemKind.Alias, label: 'alias' }),
				createItem({ kind: TerminalCompletionItemKind.SymbolicLinkFile, label: 'file2.txt' }),
				createItem({ kind: TerminalCompletionItemKind.SymbolicLinkFolder, label: 'folder2/' }),
			];
			const model = new TerminalCompletionModel(items, new LineContext('', 0));
			assertItems(model, ['alias', 'method', 'arg', '--flag', '--option', 'file2.txt', 'file.txt', 'folder/', 'folder2/']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionService.escaping.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionService.escaping.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escapeTerminalCompletionLabel } from '../../browser/terminalCompletionService.js';
import { GeneralShellType, PosixShellType, TerminalShellType, WindowsShellType } from '../../../../../../platform/terminal/common/terminal.js';
import { strict as assert } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';

suite('escapeTerminalCompletionLabel', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	const shellType: TerminalShellType = PosixShellType.Bash;
	const pathSeparator = '/';
	const cases = [
		{ char: '[', label: '[abc', expected: '\\[abc' },
		{ char: ']', label: 'abc]', expected: 'abc\\]' },
		{ char: '(', label: '(abc', expected: '\\(abc' },
		{ char: ')', label: 'abc)', expected: 'abc\\)' },
		{ char: '\'', label: `'abc`, expected: `\\'abc` },
		{ char: '"', label: '"abc', expected: '\\"abc' },
		{ char: '\\', label: 'abc\\', expected: 'abc\\\\' },
		{ char: '`', label: '`abc', expected: '\\`abc' },
		{ char: '*', label: '*abc', expected: '\\*abc' },
		{ char: '?', label: '?abc', expected: '\\?abc' },
		{ char: ';', label: ';abc', expected: '\\;abc' },
		{ char: '&', label: '&abc', expected: '\\&abc' },
		{ char: '|', label: '|abc', expected: '\\|abc' },
		{ char: '<', label: '<abc', expected: '\\<abc' },
		{ char: '>', label: '>abc', expected: '\\>abc' },
	];

	for (const { char, label, expected } of cases) {
		test(`should escape '${char}' in "${label}"`, () => {
			const result = escapeTerminalCompletionLabel(label, shellType, pathSeparator);
			assert.equal(result, expected);
		});
	}

	test('should not escape when no special chars', () => {
		const result = escapeTerminalCompletionLabel('abc', shellType, pathSeparator);
		assert.equal(result, 'abc');
	});

	test('should not escape for PowerShell', () => {
		const result = escapeTerminalCompletionLabel('[abc', GeneralShellType.PowerShell, pathSeparator);
		assert.equal(result, '[abc');
	});

	test('should not escape for CommandPrompt', () => {
		const result = escapeTerminalCompletionLabel('[abc', WindowsShellType.CommandPrompt, pathSeparator);
		assert.equal(result, '[abc');
	});
});
```

--------------------------------------------------------------------------------

````

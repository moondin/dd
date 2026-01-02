---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 358
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 358 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusDashboard.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusDashboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, EventType, addDisposableListener, EventHelper, disposableWindowInterval, getWindow } from '../../../../../base/browser/dom.js';
import { Gesture, EventType as TouchEventType } from '../../../../../base/browser/touch.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Checkbox } from '../../../../../base/browser/ui/toggle/toggle.js';
import { IAction, toAction, WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification } from '../../../../../base/common/actions.js';
import { cancelOnDispose } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { safeIntl } from '../../../../../base/common/date.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { MutableDisposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { parseLinkedText } from '../../../../../base/common/linkedText.js';
import { language } from '../../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isObject } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { IInlineCompletionsService } from '../../../../../editor/browser/services/inlineCompletionsService.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import * as languages from '../../../../../editor/common/languages.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IHoverService, nativeHoverDelegate } from '../../../../../platform/hover/browser/hover.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { Link } from '../../../../../platform/opener/browser/link.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles, defaultCheckboxStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { DomWidget } from '../../../../../platform/domWidget/browser/domWidget.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { IChatEntitlementService, ChatEntitlementService, ChatEntitlement, IQuotaSnapshot } from '../../../../services/chat/common/chatEntitlementService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { isNewUser, isCompletionsEnabled } from './chatStatus.js';
import { IChatStatusItemService, ChatStatusEntry } from './chatStatusItemService.js';
import product from '../../../../../platform/product/common/product.js';
import { contrastBorder, inputValidationErrorBorder, inputValidationInfoBorder, inputValidationWarningBorder, registerColor, transparent } from '../../../../../platform/theme/common/colorRegistry.js';
import { Color } from '../../../../../base/common/color.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { ChatViewId } from '../chat.js';

const defaultChat = product.defaultChatAgent;

interface ISettingsAccessor {
	readSetting: () => boolean;
	writeSetting: (value: boolean) => Promise<void>;
}
type ChatSettingChangedClassification = {
	owner: 'bpasero';
	comment: 'Provides insight into chat settings changed from the chat status entry.';
	settingIdentifier: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the setting that changed.' };
	settingMode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The optional editor language for which the setting changed.' };
	settingEnablement: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the setting got enabled or disabled.' };
};
type ChatSettingChangedEvent = {
	settingIdentifier: string;
	settingMode?: string;
	settingEnablement: 'enabled' | 'disabled';
};

const gaugeForeground = registerColor('gauge.foreground', {
	dark: inputValidationInfoBorder,
	light: inputValidationInfoBorder,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('gaugeForeground', "Gauge foreground color."));

registerColor('gauge.background', {
	dark: transparent(gaugeForeground, 0.3),
	light: transparent(gaugeForeground, 0.3),
	hcDark: Color.white,
	hcLight: Color.white
}, localize('gaugeBackground', "Gauge background color."));

registerColor('gauge.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('gaugeBorder', "Gauge border color."));

const gaugeWarningForeground = registerColor('gauge.warningForeground', {
	dark: inputValidationWarningBorder,
	light: inputValidationWarningBorder,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('gaugeWarningForeground', "Gauge warning foreground color."));

registerColor('gauge.warningBackground', {
	dark: transparent(gaugeWarningForeground, 0.3),
	light: transparent(gaugeWarningForeground, 0.3),
	hcDark: Color.white,
	hcLight: Color.white
}, localize('gaugeWarningBackground', "Gauge warning background color."));

const gaugeErrorForeground = registerColor('gauge.errorForeground', {
	dark: inputValidationErrorBorder,
	light: inputValidationErrorBorder,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('gaugeErrorForeground', "Gauge error foreground color."));

registerColor('gauge.errorBackground', {
	dark: transparent(gaugeErrorForeground, 0.3),
	light: transparent(gaugeErrorForeground, 0.3),
	hcDark: Color.white,
	hcLight: Color.white
}, localize('gaugeErrorBackground', "Gauge error background color."));

export class ChatStatusDashboard extends DomWidget {

	readonly element = $('div.chat-status-bar-entry-tooltip');

	private readonly dateFormatter = safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' });
	private readonly dateTimeFormatter = safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
	private readonly quotaPercentageFormatter = safeIntl.NumberFormat(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 0 });
	private readonly quotaOverageFormatter = safeIntl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 });

	constructor(
		@IChatEntitlementService private readonly chatEntitlementService: ChatEntitlementService,
		@IChatStatusItemService private readonly chatStatusItemService: IChatStatusItemService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IOpenerService private readonly openerService: IOpenerService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ITextResourceConfigurationService private readonly textResourceConfigurationService: ITextResourceConfigurationService,
		@IInlineCompletionsService private readonly inlineCompletionsService: IInlineCompletionsService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IViewsService private readonly viewService: IViewsService,
	) {
		super();

		this.render();
	}

	private render(): void {
		const token = cancelOnDispose(this._store);

		let needsSeparator = false;
		const addSeparator = (label?: string, action?: IAction) => {
			if (needsSeparator) {
				this.element.appendChild($('hr'));
			}

			if (label || action) {
				this.renderHeader(this.element, this._store, label ?? '', action);
			}

			needsSeparator = true;
		};

		// Quota Indicator
		const { chat: chatQuota, completions: completionsQuota, premiumChat: premiumChatQuota, resetDate, resetDateHasTime } = this.chatEntitlementService.quotas;
		if (chatQuota || completionsQuota || premiumChatQuota) {
			addSeparator(localize('usageTitle', "Copilot Usage"), toAction({
				id: 'workbench.action.manageCopilot',
				label: localize('quotaLabel', "Manage Chat"),
				tooltip: localize('quotaTooltip', "Manage Chat"),
				class: ThemeIcon.asClassName(Codicon.settings),
				run: () => this.runCommandAndClose(() => this.openerService.open(URI.parse(defaultChat.manageSettingsUrl))),
			}));

			const completionsQuotaIndicator = completionsQuota && (completionsQuota.total > 0 || completionsQuota.unlimited) ? this.createQuotaIndicator(this.element, this._store, completionsQuota, localize('completionsLabel', "Inline Suggestions"), false) : undefined;
			const chatQuotaIndicator = chatQuota && (chatQuota.total > 0 || chatQuota.unlimited) ? this.createQuotaIndicator(this.element, this._store, chatQuota, localize('chatsLabel', "Chat messages"), false) : undefined;
			const premiumChatQuotaIndicator = premiumChatQuota && (premiumChatQuota.total > 0 || premiumChatQuota.unlimited) ? this.createQuotaIndicator(this.element, this._store, premiumChatQuota, localize('premiumChatsLabel', "Premium requests"), true) : undefined;

			if (resetDate) {
				this.element.appendChild($('div.description', undefined, localize('limitQuota', "Allowance resets {0}.", resetDateHasTime ? this.dateTimeFormatter.value.format(new Date(resetDate)) : this.dateFormatter.value.format(new Date(resetDate)))));
			}

			if (this.chatEntitlementService.entitlement === ChatEntitlement.Free && (Number(chatQuota?.percentRemaining) <= 25 || Number(completionsQuota?.percentRemaining) <= 25)) {
				const upgradeProButton = this._store.add(new Button(this.element, { ...defaultButtonStyles, hoverDelegate: nativeHoverDelegate, secondary: this.canUseChat() /* use secondary color when chat can still be used */ }));
				upgradeProButton.label = localize('upgradeToCopilotPro', "Upgrade to GitHub Copilot Pro");
				this._store.add(upgradeProButton.onDidClick(() => this.runCommandAndClose('workbench.action.chat.upgradePlan')));
			}

			(async () => {
				await this.chatEntitlementService.update(token);
				if (token.isCancellationRequested) {
					return;
				}

				const { chat: chatQuota, completions: completionsQuota, premiumChat: premiumChatQuota } = this.chatEntitlementService.quotas;
				if (completionsQuota) {
					completionsQuotaIndicator?.(completionsQuota);
				}
				if (chatQuota) {
					chatQuotaIndicator?.(chatQuota);
				}
				if (premiumChatQuota) {
					premiumChatQuotaIndicator?.(premiumChatQuota);
				}
			})();
		}

		// Anonymous Indicator
		else if (this.chatEntitlementService.anonymous && this.chatEntitlementService.sentiment.installed) {
			addSeparator(localize('anonymousTitle', "Copilot Usage"));

			this.createQuotaIndicator(this.element, this._store, localize('quotaLimited', "Limited"), localize('completionsLabel', "Inline Suggestions"), false);
			this.createQuotaIndicator(this.element, this._store, localize('quotaLimited', "Limited"), localize('chatsLabel', "Chat messages"), false);
		}

		// Chat sessions
		{
			const inProgress = this.chatSessionsService.getInProgress();
			if (inProgress.some(item => item.count > 0)) {

				addSeparator(localize('chatAgentSessionsTitle', "Agent Sessions"), toAction({
					id: 'workbench.view.chat.status.sessions',
					label: localize('viewChatSessionsLabel', "View Agent Sessions"),
					tooltip: localize('viewChatSessionsTooltip', "View Agent Sessions"),
					class: ThemeIcon.asClassName(Codicon.eye),
					run: () => {
						this.viewService.openView(ChatViewId, true);
						this.hoverService.hideHover(true);
					}
				}));

				for (const { displayName, count } of inProgress) {
					if (count > 0) {
						const text = localize('inProgressChatSession', "$(loading~spin) {0} in progress", displayName);
						const chatSessionsElement = this.element.appendChild($('div.description'));
						const parts = renderLabelWithIcons(text);
						chatSessionsElement.append(...parts);
					}
				}
			}
		}

		// Contributions
		{
			for (const item of this.chatStatusItemService.getEntries()) {
				addSeparator();

				const itemDisposables = this._store.add(new MutableDisposable());

				let rendered = this.renderContributedChatStatusItem(item);
				itemDisposables.value = rendered.disposables;
				this.element.appendChild(rendered.element);

				this._store.add(this.chatStatusItemService.onDidChange(e => {
					if (e.entry.id === item.id) {
						const previousElement = rendered.element;

						rendered = this.renderContributedChatStatusItem(e.entry);
						itemDisposables.value = rendered.disposables;

						previousElement.replaceWith(rendered.element);
					}
				}));
			}
		}

		// Settings
		{
			const chatSentiment = this.chatEntitlementService.sentiment;
			addSeparator(localize('inlineSuggestions', "Inline Suggestions"), chatSentiment.installed && !chatSentiment.disabled && !chatSentiment.untrusted ? toAction({
				id: 'workbench.action.openChatSettings',
				label: localize('settingsLabel', "Settings"),
				tooltip: localize('settingsTooltip', "Open Settings"),
				class: ThemeIcon.asClassName(Codicon.settingsGear),
				run: () => this.runCommandAndClose(() => this.commandService.executeCommand('workbench.action.openSettings', { query: `@id:${defaultChat.completionsEnablementSetting} @id:${defaultChat.nextEditSuggestionsSetting}` })),
			}) : undefined);

			this.createSettings(this.element, this._store);
		}

		// Model Selection
		{
			const providers = this.languageFeaturesService.inlineCompletionsProvider.allNoModel();
			const provider = providers.find(p => p.modelInfo && p.modelInfo.models.length > 0);

			if (provider) {
				const modelInfo = provider.modelInfo!;
				const currentModel = modelInfo.models.find(m => m.id === modelInfo.currentModelId);

				if (currentModel) {
					const modelContainer = this.element.appendChild($('div.model-selection'));

					modelContainer.appendChild($('span.model-text', undefined, localize('modelLabel', "Model: {0}", currentModel.name)));

					const actionBar = modelContainer.appendChild($('div.model-action-bar'));
					const toolbar = this._store.add(new ActionBar(actionBar, { hoverDelegate: nativeHoverDelegate }));
					toolbar.push([toAction({
						id: 'workbench.action.selectInlineCompletionsModel',
						label: localize('selectModel', "Select Model"),
						tooltip: localize('selectModel', "Select Model"),
						class: ThemeIcon.asClassName(Codicon.gear),
						run: async () => {
							await this.showModelPicker(provider);
						}
					})], { icon: true, label: false });
				}
			}
		}

		// Completions Snooze
		if (this.canUseChat()) {
			const snooze = append(this.element, $('div.snooze-completions'));
			this.createCompletionsSnooze(snooze, localize('settings.snooze', "Snooze"), this._store);
		}

		// New to Chat / Signed out
		{
			const newUser = isNewUser(this.chatEntitlementService);
			const anonymousUser = this.chatEntitlementService.anonymous;
			const disabled = this.chatEntitlementService.sentiment.disabled || this.chatEntitlementService.sentiment.untrusted;
			const signedOut = this.chatEntitlementService.entitlement === ChatEntitlement.Unknown;
			if (newUser || signedOut || disabled) {
				addSeparator();

				let descriptionText: string | MarkdownString;
				let descriptionClass = '.description';
				if (newUser && anonymousUser) {
					descriptionText = new MarkdownString(localize({ key: 'activeDescriptionAnonymous', comment: ['{Locked="]({2})"}', '{Locked="]({3})"}'] }, "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3})", defaultChat.provider.default.name, defaultChat.provider.default.name, defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl), { isTrusted: true });
					descriptionClass = `${descriptionClass}.terms`;
				} else if (newUser) {
					descriptionText = localize('activateDescription', "Set up Copilot to use AI features.");
				} else if (anonymousUser) {
					descriptionText = localize('enableMoreDescription', "Sign in to enable more Copilot AI features.");
				} else if (disabled) {
					descriptionText = localize('enableDescription', "Enable Copilot to use AI features.");
				} else {
					descriptionText = localize('signInDescription', "Sign in to use Copilot AI features.");
				}

				let buttonLabel: string;
				if (newUser) {
					buttonLabel = localize('enableAIFeatures', "Use AI Features");
				} else if (anonymousUser) {
					buttonLabel = localize('enableMoreAIFeatures', "Enable more AI Features");
				} else if (disabled) {
					buttonLabel = localize('enableCopilotButton', "Enable AI Features");
				} else {
					buttonLabel = localize('signInToUseAIFeatures', "Sign in to use AI Features");
				}

				let commandId: string;
				if (newUser && anonymousUser) {
					commandId = 'workbench.action.chat.triggerSetupAnonymousWithoutDialog';
				} else {
					commandId = 'workbench.action.chat.triggerSetup';
				}

				if (typeof descriptionText === 'string') {
					this.element.appendChild($(`div${descriptionClass}`, undefined, descriptionText));
				} else {
					this.element.appendChild($(`div${descriptionClass}`, undefined, this._store.add(this.markdownRendererService.render(descriptionText)).element));
				}

				const button = this._store.add(new Button(this.element, { ...defaultButtonStyles, hoverDelegate: nativeHoverDelegate }));
				button.label = buttonLabel;
				this._store.add(button.onDidClick(() => this.runCommandAndClose(commandId)));
			}
		}
	}

	private canUseChat(): boolean {
		if (!this.chatEntitlementService.sentiment.installed || this.chatEntitlementService.sentiment.disabled || this.chatEntitlementService.sentiment.untrusted) {
			return false; // chat not installed or not enabled
		}

		if (this.chatEntitlementService.entitlement === ChatEntitlement.Unknown || this.chatEntitlementService.entitlement === ChatEntitlement.Available) {
			return this.chatEntitlementService.anonymous; // signed out or not-yet-signed-up users can only use Chat if anonymous access is allowed
		}

		if (this.chatEntitlementService.entitlement === ChatEntitlement.Free && this.chatEntitlementService.quotas.chat?.percentRemaining === 0 && this.chatEntitlementService.quotas.completions?.percentRemaining === 0) {
			return false; // free user with no quota left
		}

		return true;
	}

	private renderHeader(container: HTMLElement, disposables: DisposableStore, label: string, action?: IAction): void {
		const header = container.appendChild($('div.header', undefined, label ?? ''));

		if (action) {
			const toolbar = disposables.add(new ActionBar(header, { hoverDelegate: nativeHoverDelegate }));
			toolbar.push([action], { icon: true, label: false });
		}
	}

	private renderContributedChatStatusItem(item: ChatStatusEntry): { element: HTMLElement; disposables: DisposableStore } {
		const disposables = new DisposableStore();

		const itemElement = $('div.contribution');

		const headerLabel = typeof item.label === 'string' ? item.label : item.label.label;
		const headerLink = typeof item.label === 'string' ? undefined : item.label.link;
		this.renderHeader(itemElement, disposables, headerLabel, headerLink ? toAction({
			id: 'workbench.action.openChatStatusItemLink',
			label: localize('learnMore', "Learn More"),
			tooltip: localize('learnMore', "Learn More"),
			class: ThemeIcon.asClassName(Codicon.linkExternal),
			run: () => this.runCommandAndClose(() => this.openerService.open(URI.parse(headerLink))),
		}) : undefined);

		const itemBody = itemElement.appendChild($('div.body'));

		const description = itemBody.appendChild($('span.description'));
		this.renderTextPlus(description, item.description, disposables);

		if (item.detail) {
			const detail = itemBody.appendChild($('div.detail-item'));
			this.renderTextPlus(detail, item.detail, disposables);
		}

		return { element: itemElement, disposables };
	}

	private renderTextPlus(target: HTMLElement, text: string, store: DisposableStore): void {
		for (const node of parseLinkedText(text).nodes) {
			if (typeof node === 'string') {
				const parts = renderLabelWithIcons(node);
				target.append(...parts);
			} else {
				store.add(new Link(target, node, undefined, this.hoverService, this.openerService));
			}
		}
	}

	private runCommandAndClose(commandOrFn: string | Function, ...args: unknown[]): void {
		if (typeof commandOrFn === 'function') {
			commandOrFn(...args);
		} else {
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: commandOrFn, from: 'chat-status' });
			this.commandService.executeCommand(commandOrFn, ...args);
		}

		this.hoverService.hideHover(true);
	}

	private createQuotaIndicator(container: HTMLElement, disposables: DisposableStore, quota: IQuotaSnapshot | string, label: string, supportsOverage: boolean): (quota: IQuotaSnapshot | string) => void {
		const quotaValue = $('span.quota-value');
		const quotaBit = $('div.quota-bit');
		const overageLabel = $('span.overage-label');

		const quotaIndicator = container.appendChild($('div.quota-indicator', undefined,
			$('div.quota-label', undefined,
				$('span', undefined, label),
				quotaValue
			),
			$('div.quota-bar', undefined,
				quotaBit
			),
			$('div.description', undefined,
				overageLabel
			)
		));

		if (supportsOverage && (this.chatEntitlementService.entitlement === ChatEntitlement.Pro || this.chatEntitlementService.entitlement === ChatEntitlement.ProPlus)) {
			const manageOverageButton = disposables.add(new Button(quotaIndicator, { ...defaultButtonStyles, secondary: true, hoverDelegate: nativeHoverDelegate }));
			manageOverageButton.label = localize('enableAdditionalUsage', "Manage paid premium requests");
			disposables.add(manageOverageButton.onDidClick(() => this.runCommandAndClose(() => this.openerService.open(URI.parse(defaultChat.manageOverageUrl)))));
		}

		const update = (quota: IQuotaSnapshot | string) => {
			quotaIndicator.classList.remove('error');
			quotaIndicator.classList.remove('warning');

			let usedPercentage: number;
			if (typeof quota === 'string' || quota.unlimited) {
				usedPercentage = 0;
			} else {
				usedPercentage = Math.max(0, 100 - quota.percentRemaining);
			}

			if (typeof quota === 'string') {
				quotaValue.textContent = quota;
			} else if (quota.unlimited) {
				quotaValue.textContent = localize('quotaUnlimited', "Included");
			} else if (quota.overageCount) {
				quotaValue.textContent = localize('quotaDisplayWithOverage', "+{0} requests", this.quotaOverageFormatter.value.format(quota.overageCount));
			} else {
				quotaValue.textContent = localize('quotaDisplay', "{0}%", this.quotaPercentageFormatter.value.format(usedPercentage));
			}

			quotaBit.style.width = `${usedPercentage}%`;

			if (usedPercentage >= 90) {
				quotaIndicator.classList.add('error');
			} else if (usedPercentage >= 75) {
				quotaIndicator.classList.add('warning');
			}

			if (supportsOverage) {
				if (typeof quota !== 'string' && quota?.overageEnabled) {
					overageLabel.textContent = localize('additionalUsageEnabled', "Additional paid premium requests enabled.");
				} else {
					overageLabel.textContent = localize('additionalUsageDisabled', "Additional paid premium requests disabled.");
				}
			} else {
				overageLabel.textContent = '';
			}
		};

		update(quota);

		return update;
	}

	private createSettings(container: HTMLElement, disposables: DisposableStore): HTMLElement {
		const modeId = this.editorService.activeTextEditorLanguageId;
		const settings = container.appendChild($('div.settings'));

		// --- Inline Suggestions
		{
			const globalSetting = append(settings, $('div.setting'));
			this.createInlineSuggestionsSetting(globalSetting, localize('settings.codeCompletions.allFiles', "All files"), '*', disposables);

			if (modeId) {
				const languageSetting = append(settings, $('div.setting'));
				this.createInlineSuggestionsSetting(languageSetting, localize('settings.codeCompletions.language', "{0}", this.languageService.getLanguageName(modeId) ?? modeId), modeId, disposables);
			}
		}

		// --- Next edit suggestions
		{
			const setting = append(settings, $('div.setting'));
			this.createNextEditSuggestionsSetting(setting, localize('settings.nextEditSuggestions', "Next edit suggestions"), this.getCompletionsSettingAccessor(modeId), disposables);
		}

		return settings;
	}

	private createSetting(container: HTMLElement, settingIdsToReEvaluate: string[], label: string, accessor: ISettingsAccessor, disposables: DisposableStore): Checkbox {
		const checkbox = disposables.add(new Checkbox(label, Boolean(accessor.readSetting()), { ...defaultCheckboxStyles }));
		container.appendChild(checkbox.domNode);

		const settingLabel = append(container, $('span.setting-label', undefined, label));
		disposables.add(Gesture.addTarget(settingLabel));
		[EventType.CLICK, TouchEventType.Tap].forEach(eventType => {
			disposables.add(addDisposableListener(settingLabel, eventType, e => {
				if (checkbox?.enabled) {
					EventHelper.stop(e, true);

					checkbox.checked = !checkbox.checked;
					accessor.writeSetting(checkbox.checked);
					checkbox.focus();
				}
			}));
		});

		disposables.add(checkbox.onChange(() => {
			accessor.writeSetting(checkbox.checked);
		}));

		disposables.add(this.configurationService.onDidChangeConfiguration(e => {
			if (settingIdsToReEvaluate.some(id => e.affectsConfiguration(id))) {
				checkbox.checked = Boolean(accessor.readSetting());
			}
		}));

		if (!this.canUseChat()) {
			container.classList.add('disabled');
			checkbox.disable();
			checkbox.checked = false;
		}

		return checkbox;
	}

	private createInlineSuggestionsSetting(container: HTMLElement, label: string, modeId: string | undefined, disposables: DisposableStore): void {
		this.createSetting(container, [defaultChat.completionsEnablementSetting], label, this.getCompletionsSettingAccessor(modeId), disposables);
	}

	private getCompletionsSettingAccessor(modeId = '*'): ISettingsAccessor {
		const settingId = defaultChat.completionsEnablementSetting;

		return {
			readSetting: () => isCompletionsEnabled(this.configurationService, modeId),
			writeSetting: (value: boolean) => {
				this.telemetryService.publicLog2<ChatSettingChangedEvent, ChatSettingChangedClassification>('chatStatus.settingChanged', {
					settingIdentifier: settingId,
					settingMode: modeId,
					settingEnablement: value ? 'enabled' : 'disabled'
				});

				let result = this.configurationService.getValue<Record<string, boolean>>(settingId);
				if (!isObject(result)) {
					result = Object.create(null);
				}

				return this.configurationService.updateValue(settingId, { ...result, [modeId]: value });
			}
		};
	}

	private createNextEditSuggestionsSetting(container: HTMLElement, label: string, completionsSettingAccessor: ISettingsAccessor, disposables: DisposableStore): void {
		const nesSettingId = defaultChat.nextEditSuggestionsSetting;
		const completionsSettingId = defaultChat.completionsEnablementSetting;
		const resource = EditorResourceAccessor.getOriginalUri(this.editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });

		const checkbox = this.createSetting(container, [nesSettingId, completionsSettingId], label, {
			readSetting: () => completionsSettingAccessor.readSetting() && this.textResourceConfigurationService.getValue<boolean>(resource, nesSettingId),
			writeSetting: (value: boolean) => {
				this.telemetryService.publicLog2<ChatSettingChangedEvent, ChatSettingChangedClassification>('chatStatus.settingChanged', {
					settingIdentifier: nesSettingId,
					settingEnablement: value ? 'enabled' : 'disabled'
				});

				return this.textResourceConfigurationService.updateValue(resource, nesSettingId, value);
			}
		}, disposables);

		// enablement of NES depends on completions setting
		// so we have to update our checkbox state accordingly
		if (!completionsSettingAccessor.readSetting()) {
			container.classList.add('disabled');
			checkbox.disable();
		}

		disposables.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(completionsSettingId)) {
				if (completionsSettingAccessor.readSetting() && this.canUseChat()) {
					checkbox.enable();
					container.classList.remove('disabled');
				} else {
					checkbox.disable();
					container.classList.add('disabled');
				}
			}
		}));
	}

	private createCompletionsSnooze(container: HTMLElement, label: string, disposables: DisposableStore): void {
		const isEnabled = () => {
			const completionsEnabled = isCompletionsEnabled(this.configurationService);
			const completionsEnabledActiveLanguage = isCompletionsEnabled(this.configurationService, this.editorService.activeTextEditorLanguageId);
			return completionsEnabled || completionsEnabledActiveLanguage;
		};

		const button = disposables.add(new Button(container, { disabled: !isEnabled(), ...defaultButtonStyles, hoverDelegate: nativeHoverDelegate, secondary: true }));

		const timerDisplay = container.appendChild($('span.snooze-label'));

		const actionBar = container.appendChild($('div.snooze-action-bar'));
		const toolbar = disposables.add(new ActionBar(actionBar, { hoverDelegate: nativeHoverDelegate }));
		const cancelAction = toAction({
			id: 'workbench.action.cancelSnoozeStatusBarLink',
			label: localize('cancelSnooze', "Cancel Snooze"),
			run: () => this.inlineCompletionsService.cancelSnooze(),
			class: ThemeIcon.asClassName(Codicon.stopCircle)
		});

		const update = (isEnabled: boolean) => {
			container.classList.toggle('disabled', !isEnabled);
			toolbar.clear();

			const timeLeftMs = this.inlineCompletionsService.snoozeTimeLeft;
			if (!isEnabled || timeLeftMs <= 0) {
				timerDisplay.textContent = localize('completions.snooze5minutesTitle', "Hide suggestions for 5 min");
				timerDisplay.title = '';
				button.label = label;
				button.setTitle(localize('completions.snooze5minutes', "Hide inline suggestions for 5 min"));
				return true;
			}

			const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
			const minutes = Math.floor(timeLeftSeconds / 60);
			const seconds = timeLeftSeconds % 60;

			timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${localize('completions.remainingTime', "remaining")}`;
			timerDisplay.title = localize('completions.snoozeTimeDescription', "Inline suggestions are hidden for the remaining duration");
			button.label = localize('completions.plus5min', "+5 min");
			button.setTitle(localize('completions.snoozeAdditional5minutes', "Snooze additional 5 min"));
			toolbar.push([cancelAction], { icon: true, label: false });

			return false;
		};

		// Update every second if there's time remaining
		const timerDisposables = disposables.add(new DisposableStore());
		function updateIntervalTimer() {
			timerDisposables.clear();
			const enabled = isEnabled();

			if (update(enabled)) {
				return;
			}

			timerDisposables.add(disposableWindowInterval(
				getWindow(container),
				() => update(enabled),
				1000
			));
		}
		updateIntervalTimer();

		disposables.add(button.onDidClick(() => {
			this.inlineCompletionsService.snooze();
			update(isEnabled());
		}));

		disposables.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(defaultChat.completionsEnablementSetting)) {
				button.enabled = isEnabled();
			}
			updateIntervalTimer();
		}));

		disposables.add(this.inlineCompletionsService.onDidChangeIsSnoozing(e => {
			updateIntervalTimer();
		}));
	}

	private async showModelPicker(provider: languages.InlineCompletionsProvider): Promise<void> {
		if (!provider.modelInfo || !provider.setModelId) {
			return;
		}

		const modelInfo = provider.modelInfo;
		const items: IQuickPickItem[] = modelInfo.models.map(model => ({
			id: model.id,
			label: model.name,
			description: model.id === modelInfo.currentModelId ? localize('currentModel.description', "Currently selected") : undefined,
			picked: model.id === modelInfo.currentModelId
		}));

		const selected = await this.quickInputService.pick(items, {
			placeHolder: localize('selectModelFor', "Select a model for {0}", provider.displayName || 'inline completions'),
			canPickMany: false
		});

		if (selected && selected.id && selected.id !== modelInfo.currentModelId) {
			await provider.setModelId(selected.id);
		}

		this.hoverService.hideHover(true);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatStatus.css';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, ShowTooltipCommand, StatusbarAlignment, StatusbarEntryKind } from '../../../../services/statusbar/browser/statusbar.js';
import { ChatEntitlement, ChatEntitlementService, IChatEntitlementService, isProUser } from '../../../../services/chat/common/chatEntitlementService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { getCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IInlineCompletionsService } from '../../../../../editor/browser/services/inlineCompletionsService.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { ChatStatusDashboard } from './chatStatusDashboard.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { disposableWindowInterval } from '../../../../../base/browser/dom.js';
import { isNewUser, isCompletionsEnabled } from './chatStatus.js';
import product from '../../../../../platform/product/common/product.js';

export class ChatStatusBarEntry extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatStatusBarEntry';

	private entry: IStatusbarEntryAccessor | undefined = undefined;

	private readonly activeCodeEditorListener = this._register(new MutableDisposable());

	private runningSessionsCount: number;

	constructor(
		@IChatEntitlementService private readonly chatEntitlementService: ChatEntitlementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInlineCompletionsService private readonly completionsService: IInlineCompletionsService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
	) {
		super();

		this.runningSessionsCount = this.chatSessionsService.getInProgress().reduce((total, item) => total + item.count, 0);

		this.update();

		this.registerListeners();
	}

	private update(): void {
		const sentiment = this.chatEntitlementService.sentiment;
		if (!sentiment.hidden) {
			const props = this.getEntryProps();
			if (this.entry) {
				this.entry.update(props);
			} else {
				this.entry = this.statusbarService.addEntry(props, 'chat.statusBarEntry', StatusbarAlignment.RIGHT, { location: { id: 'status.editor.mode', priority: 100.1 }, alignment: StatusbarAlignment.RIGHT });
			}
		} else {
			this.entry?.dispose();
			this.entry = undefined;
		}
	}

	private registerListeners(): void {
		this._register(this.chatEntitlementService.onDidChangeQuotaExceeded(() => this.update()));
		this._register(this.chatEntitlementService.onDidChangeSentiment(() => this.update()));
		this._register(this.chatEntitlementService.onDidChangeEntitlement(() => this.update()));

		this._register(this.completionsService.onDidChangeIsSnoozing(() => this.update()));

		this._register(this.chatSessionsService.onDidChangeInProgress(() => {
			const oldSessionsCount = this.runningSessionsCount;
			this.runningSessionsCount = this.chatSessionsService.getInProgress().reduce((total, item) => total + item.count, 0);
			if (this.runningSessionsCount !== oldSessionsCount) {
				this.update();
			}
		}));

		this._register(this.editorService.onDidActiveEditorChange(() => this.onDidActiveEditorChange()));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(product.defaultChatAgent.completionsEnablementSetting)) {
				this.update();
			}
		}));
	}

	private onDidActiveEditorChange(): void {
		this.update();

		this.activeCodeEditorListener.clear();

		// Listen to language changes in the active code editor
		const activeCodeEditor = getCodeEditor(this.editorService.activeTextEditorControl);
		if (activeCodeEditor) {
			this.activeCodeEditorListener.value = activeCodeEditor.onDidChangeModelLanguage(() => {
				this.update();
			});
		}
	}

	private getEntryProps(): IStatusbarEntry {
		let text = '$(copilot)';
		let ariaLabel = localize('chatStatusAria', "Copilot status");
		let kind: StatusbarEntryKind | undefined;

		if (isNewUser(this.chatEntitlementService)) {
			const entitlement = this.chatEntitlementService.entitlement;

			// Finish Setup
			if (
				this.chatEntitlementService.sentiment.later ||	// user skipped setup
				entitlement === ChatEntitlement.Available ||	// user is entitled
				isProUser(entitlement) ||						// user is already pro
				entitlement === ChatEntitlement.Free			// user is already free
			) {
				const finishSetup = localize('finishSetup', "Finish Setup");

				text = `$(copilot) ${finishSetup}`;
				ariaLabel = finishSetup;
				kind = 'prominent';
			}
		} else {
			const chatQuotaExceeded = this.chatEntitlementService.quotas.chat?.percentRemaining === 0;
			const completionsQuotaExceeded = this.chatEntitlementService.quotas.completions?.percentRemaining === 0;

			// Disabled
			if (this.chatEntitlementService.sentiment.disabled || this.chatEntitlementService.sentiment.untrusted) {
				text = '$(copilot-unavailable)';
				ariaLabel = localize('copilotDisabledStatus', "Copilot disabled");
			}

			// Sessions in progress
			else if (this.runningSessionsCount > 0) {
				text = '$(copilot-in-progress)';
				if (this.runningSessionsCount > 1) {
					ariaLabel = localize('chatSessionsInProgressStatus', "{0} agent sessions in progress", this.runningSessionsCount);
				} else {
					ariaLabel = localize('chatSessionInProgressStatus', "1 agent session in progress");
				}
			}

			// Signed out
			else if (this.chatEntitlementService.entitlement === ChatEntitlement.Unknown) {
				const signedOutWarning = localize('notSignedIn', "Signed out");

				text = `${this.chatEntitlementService.anonymous ? '$(copilot)' : '$(copilot-not-connected)'} ${signedOutWarning}`;
				ariaLabel = signedOutWarning;
				kind = 'prominent';
			}

			// Free Quota Exceeded
			else if (this.chatEntitlementService.entitlement === ChatEntitlement.Free && (chatQuotaExceeded || completionsQuotaExceeded)) {
				let quotaWarning: string;
				if (chatQuotaExceeded && !completionsQuotaExceeded) {
					quotaWarning = localize('chatQuotaExceededStatus', "Chat quota reached");
				} else if (completionsQuotaExceeded && !chatQuotaExceeded) {
					quotaWarning = localize('completionsQuotaExceededStatus', "Inline suggestions quota reached");
				} else {
					quotaWarning = localize('chatAndCompletionsQuotaExceededStatus', "Quota reached");
				}

				text = `$(copilot-warning) ${quotaWarning}`;
				ariaLabel = quotaWarning;
				kind = 'prominent';
			}

			// Completions Disabled
			else if (this.editorService.activeTextEditorLanguageId && !isCompletionsEnabled(this.configurationService, this.editorService.activeTextEditorLanguageId)) {
				text = '$(copilot-unavailable)';
				ariaLabel = localize('completionsDisabledStatus', "Inline suggestions disabled");
			}

			// Completions Snoozed
			else if (this.completionsService.isSnoozing()) {
				text = '$(copilot-snooze)';
				ariaLabel = localize('completionsSnoozedStatus', "Inline suggestions snoozed");
			}
		}

		const baseResult = {
			name: localize('chatStatus', "Copilot Status"),
			text,
			ariaLabel,
			command: ShowTooltipCommand,
			showInAllWindows: true,
			kind,
			tooltip: {
				element: (token: CancellationToken) => {
					const store = new DisposableStore();
					store.add(token.onCancellationRequested(() => {
						store.dispose();
					}));
					const elem = ChatStatusDashboard.instantiateInContents(this.instantiationService, store);

					// todo@connor4312/@benibenj: workaround for #257923
					store.add(disposableWindowInterval(mainWindow, () => {
						if (!elem.isConnected) {
							store.dispose();
						}
					}, 2000));

					return elem;
				}
			}
		} satisfies IStatusbarEntry;

		return baseResult;
	}

	override dispose(): void {
		super.dispose();

		this.entry?.dispose();
		this.entry = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusItemService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatus/chatStatusItemService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';

export const IChatStatusItemService = createDecorator<IChatStatusItemService>('chatStatusItemService');

export interface IChatStatusItemService {
	readonly _serviceBrand: undefined;

	readonly onDidChange: Event<IChatStatusItemChangeEvent>;

	setOrUpdateEntry(entry: ChatStatusEntry): void;

	deleteEntry(id: string): void;

	getEntries(): Iterable<ChatStatusEntry>;
}

export interface IChatStatusItemChangeEvent {
	readonly entry: ChatStatusEntry;
}

export type ChatStatusEntry = {
	id: string;
	label: string | { label: string; link: string };
	description: string;
	detail: string | undefined;
};

class ChatStatusItemService implements IChatStatusItemService {
	readonly _serviceBrand: undefined;

	private readonly _entries = new Map<string, ChatStatusEntry>();

	private readonly _onDidChange = new Emitter<IChatStatusItemChangeEvent>();
	readonly onDidChange = this._onDidChange.event;

	setOrUpdateEntry(entry: ChatStatusEntry): void {
		const isUpdate = this._entries.has(entry.id);
		this._entries.set(entry.id, entry);
		if (isUpdate) {
			this._onDidChange.fire({ entry });
		}
	}

	deleteEntry(id: string): void {
		this._entries.delete(id);
	}

	getEntries(): Iterable<ChatStatusEntry> {
		return this._entries.values();
	}
}

registerSingleton(IChatStatusItemService, ChatStatusItemService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatus/media/chatStatus.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatus/media/chatStatus.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Overall */

.chat-status-bar-entry-tooltip {
	margin-top: 4px;
	margin-bottom: 4px;
}

.chat-status-bar-entry-tooltip hr {
	margin-top: 8px;
	margin-bottom: 8px;
}

.chat-status-bar-entry-tooltip div.header {
	display: flex;
	align-items: center;
	color: var(--vscode-descriptionForeground);
	margin-bottom: 4px;
	font-weight: 600;
}

.chat-status-bar-entry-tooltip div.header .monaco-action-bar {
	margin-left: auto;
}

.chat-status-bar-entry-tooltip div.description {
	font-size: 11px;
	color: var(--vscode-descriptionForeground);
	display: flex;
	align-items: center;
	gap: 3px;
}

.chat-status-bar-entry-tooltip div.description.terms {
	max-width: 250px;
}

.chat-status-bar-entry-tooltip .monaco-button {
	margin-top: 5px;
	margin-bottom: 5px;
}

/* Setup for New User */

.chat-status-bar-entry-tooltip .setup .chat-feature-container {
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 4px;
}

/* Quota Indicator */

.chat-status-bar-entry-tooltip .quota-indicator {
	margin-bottom: 6px;
}

.chat-status-bar-entry-tooltip .quota-indicator .quota-label {
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 3px;
}

.chat-status-bar-entry-tooltip .quota-indicator .quota-label .quota-value {
	color: var(--vscode-descriptionForeground);
}

.chat-status-bar-entry-tooltip .quota-indicator .quota-bar {
	width: 100%;
	height: 4px;
	background-color: var(--vscode-gauge-background);
	border-radius: 4px;
	border: 1px solid var(--vscode-gauge-border);
	margin: 4px 0;
}

.chat-status-bar-entry-tooltip .quota-indicator .quota-bar .quota-bit {
	height: 100%;
	background-color: var(--vscode-gauge-foreground);
	border-radius: 4px;
}

.chat-status-bar-entry-tooltip .quota-indicator.warning .quota-bar {
	background-color: var(--vscode-gauge-warningBackground);
}

.chat-status-bar-entry-tooltip .quota-indicator.warning .quota-bar .quota-bit {
	background-color: var(--vscode-gauge-warningForeground);
}

.chat-status-bar-entry-tooltip .quota-indicator.error .quota-bar {
	background-color: var(--vscode-gauge-errorBackground);
}

.chat-status-bar-entry-tooltip .quota-indicator.error .quota-bar .quota-bit {
	background-color: var(--vscode-gauge-errorForeground);
}

/* Settings */

.chat-status-bar-entry-tooltip .settings {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.chat-status-bar-entry-tooltip .settings .setting {
	display: flex;
	align-items: center;
}

.chat-status-bar-entry-tooltip .settings .setting .monaco-checkbox {
	height: 14px;
	width: 14px;
	margin-right: 5px;
}

.chat-status-bar-entry-tooltip .settings .setting .setting-label {
	cursor: pointer;
}

.chat-status-bar-entry-tooltip .settings .setting.disabled .setting-label {
	color: var(--vscode-disabledForeground);
}

/* Model Selection */

.chat-status-bar-entry-tooltip .model-selection {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 6px 0 0 0;
}

.chat-status-bar-entry-tooltip .model-selection .model-text {
	flex: 1;
}

.chat-status-bar-entry-tooltip .model-selection .model-action-bar {
	margin-left: auto;
}

.chat-status-bar-entry-tooltip .model-selection .model-action-bar .codicon {
	color: var(--vscode-descriptionForeground);
}

/* Snoozing */

.chat-status-bar-entry-tooltip .snooze-completions {
	margin-top: 1px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	gap: 6px;
}

.chat-status-bar-entry-tooltip .snooze-completions .monaco-button {
	width: fit-content;
	overflow: hidden;
	text-overflow: ellipsis;
	text-wrap: nowrap;
	padding: 2px 8px;
	user-select: none;
	-webkit-user-select: none;
}

.chat-status-bar-entry-tooltip .snooze-completions .snooze-label {
	flex: 1;
	padding-left: 2px;
	color: var(--vscode-descriptionForeground);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-variant-numeric: tabular-nums;
}

.chat-status-bar-entry-tooltip .snooze-completions.disabled .snooze-label {
	color: var(--vscode-disabledForeground);
}

.chat-status-bar-entry-tooltip .snooze-completions .snooze-action-bar {
	margin-left: auto;
}

/* Contributions */

.chat-status-bar-entry-tooltip .contribution .body {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;

	.description,
	.detail-item {
		display: flex;
		align-items: center;
		gap: 3px;
	}

	.detail-item,
	.detail-item a {
		margin-left: auto;
		color: var(--vscode-descriptionForeground);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatDynamicVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatDynamicVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../base/common/arrays.js';
import { IMarkdownString, MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, dispose, isDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { IDecorationOptions } from '../../../../../editor/common/editorCommon.js';
import { Command, isLocation } from '../../../../../editor/common/languages.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IChatRequestVariableValue, IDynamicVariable } from '../../common/chatVariables.js';
import { IChatWidget } from '../chat.js';
import { IChatWidgetContrib } from '../chatWidget.js';

export const dynamicVariableDecorationType = 'chat-dynamic-variable';



export class ChatDynamicVariableModel extends Disposable implements IChatWidgetContrib {
	public static readonly ID = 'chatDynamicVariableModel';

	private _variables: IDynamicVariable[] = [];

	get variables(): ReadonlyArray<IDynamicVariable> {
		return [...this._variables];
	}

	get id() {
		return ChatDynamicVariableModel.ID;
	}

	private decorationData: { id: string; text: string }[] = [];

	constructor(
		private readonly widget: IChatWidget,
		@ILabelService private readonly labelService: ILabelService,
	) {
		super();

		this._register(widget.inputEditor.onDidChangeModelContent(e => {

			const removed: IDynamicVariable[] = [];
			let didChange = false;

			// Don't mutate entries in _variables, since they will be returned from the getter
			this._variables = coalesce(this._variables.map((ref, idx): IDynamicVariable | null => {
				const model = widget.inputEditor.getModel();

				if (!model) {
					removed.push(ref);
					return null;
				}

				const data = this.decorationData[idx];
				const newRange = model.getDecorationRange(data.id);

				if (!newRange) {
					// gone
					removed.push(ref);
					return null;
				}

				const newText = model.getValueInRange(newRange);
				if (newText !== data.text) {

					this.widget.inputEditor.executeEdits(this.id, [{
						range: newRange,
						text: '',
					}]);
					this.widget.refreshParsedInput();

					removed.push(ref);
					return null;
				}

				if (newRange.equalsRange(ref.range)) {
					// all good
					return ref;
				}

				didChange = true;

				return { ...ref, range: newRange };
			}));

			// cleanup disposable variables
			dispose(removed.filter(isDisposable));

			if (didChange || removed.length > 0) {
				this.widget.refreshParsedInput();
			}

			this.updateDecorations();
		}));
	}

	getInputState(contrib: Record<string, unknown>): void {
		contrib[ChatDynamicVariableModel.ID] = this.variables;
	}

	setInputState(contrib: Readonly<Record<string, unknown>>): void {
		let s = contrib[ChatDynamicVariableModel.ID] as unknown[];
		if (!Array.isArray(s)) {
			s = [];
		}

		this.disposeVariables();
		this._variables = [];

		for (const variable of s) {
			if (!isDynamicVariable(variable)) {
				continue;
			}

			this.addReference(variable);
		}
	}

	addReference(ref: IDynamicVariable): void {
		this._variables.push(ref);
		this.updateDecorations();
		this.widget.refreshParsedInput();
	}

	private updateDecorations(): void {

		const decorationIds = this.widget.inputEditor.setDecorationsByType('chat', dynamicVariableDecorationType, this._variables.map((r): IDecorationOptions => ({
			range: r.range,
			hoverMessage: this.getHoverForReference(r)
		})));

		this.decorationData = [];
		for (let i = 0; i < decorationIds.length; i++) {
			this.decorationData.push({
				id: decorationIds[i],
				text: this.widget.inputEditor.getModel()!.getValueInRange(this._variables[i].range)
			});
		}
	}

	private getHoverForReference(ref: IDynamicVariable): IMarkdownString | undefined {
		const value = ref.data;
		if (URI.isUri(value)) {
			return new MarkdownString(this.labelService.getUriLabel(value, { relative: true }));
		} else if (isLocation(value)) {
			const prefix = ref.fullName ? ` ${ref.fullName}` : '';
			const rangeString = `#${value.range.startLineNumber}-${value.range.endLineNumber}`;
			return new MarkdownString(prefix + this.labelService.getUriLabel(value.uri, { relative: true }) + rangeString);
		} else {
			return undefined;
		}
	}

	/**
	 * Dispose all existing variables.
	 */
	private disposeVariables(): void {
		for (const variable of this._variables) {
			if (isDisposable(variable)) {
				variable.dispose();
			}
		}
	}

	public override dispose() {
		this.disposeVariables();
		super.dispose();
	}
}

/**
 * Loose check to filter objects that are obviously missing data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDynamicVariable(obj: any): obj is IDynamicVariable {
	return obj &&
		typeof obj.id === 'string' &&
		Range.isIRange(obj.range) &&
		'data' in obj;
}



export interface IAddDynamicVariableContext {
	id: string;
	widget: IChatWidget;
	range: IRange;
	variableData: IChatRequestVariableValue;
	command?: Command;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAddDynamicVariableContext(context: any): context is IAddDynamicVariableContext {
	return 'widget' in context &&
		'range' in context &&
		'variableData' in context;
}

export class AddDynamicVariableAction extends Action2 {
	static readonly ID = 'workbench.action.chat.addDynamicVariable';

	constructor() {
		super({
			id: AddDynamicVariableAction.ID,
			title: '' // not displayed
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = args[0];
		if (!isAddDynamicVariableContext(context)) {
			return;
		}

		let range = context.range;
		const variableData = context.variableData;

		const doCleanup = () => {
			// Failed, remove the dangling variable prefix
			context.widget.inputEditor.executeEdits('chatInsertDynamicVariableWithArguments', [{ range: context.range, text: `` }]);
		};

		// If this completion item has no command, return it directly
		if (context.command) {
			// Invoke the command on this completion item along with its args and return the result
			const commandService = accessor.get(ICommandService);
			const selection: string | undefined = await commandService.executeCommand(context.command.id, ...(context.command.arguments ?? []));
			if (!selection) {
				doCleanup();
				return;
			}

			// Compute new range and variableData
			const insertText = ':' + selection;
			const insertRange = new Range(range.startLineNumber, range.endColumn, range.endLineNumber, range.endColumn + insertText.length);
			range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn + insertText.length);
			const editor = context.widget.inputEditor;
			const success = editor.executeEdits('chatInsertDynamicVariableWithArguments', [{ range: insertRange, text: insertText + ' ' }]);
			if (!success) {
				doCleanup();
				return;
			}
		}

		context.widget.getContrib<ChatDynamicVariableModel>(ChatDynamicVariableModel.ID)?.addReference({
			id: context.id,
			range: range,
			isFile: true,
			data: variableData
		});
	}
}
registerAction2(AddDynamicVariableAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatImplicitContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatImplicitContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { autorun } from '../../../../../base/common/observable.js';
import { basename, isEqual } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { getCodeEditor, ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { Location } from '../../../../../editor/common/languages.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { EditorsOrder } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { getNotebookEditorFromEditorPane, INotebookEditor } from '../../../notebook/browser/notebookBrowser.js';
import { WebviewEditor } from '../../../webviewPanel/browser/webviewEditor.js';
import { WebviewInput } from '../../../webviewPanel/browser/webviewEditorInput.js';
import { IChatEditingService } from '../../common/chatEditingService.js';
import { IChatService } from '../../common/chatService.js';
import { IChatRequestImplicitVariableEntry, IChatRequestVariableEntry, isStringImplicitContextValue, StringChatContextValue } from '../../common/chatVariableEntries.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { ILanguageModelIgnoredFilesService } from '../../common/ignoredFiles.js';
import { getPromptsTypeForLanguageId } from '../../common/promptSyntax/promptTypes.js';
import { IChatWidget, IChatWidgetService } from '../chat.js';
import { IChatContextService } from '../chatContextService.js';

export class ChatImplicitContextContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'chat.implicitContext';

	private readonly _currentCancelTokenSource: MutableDisposable<CancellationTokenSource>;

	private _implicitContextEnablement: { [mode: string]: string };

	constructor(
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IEditorService private readonly editorService: IEditorService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatService private readonly chatService: IChatService,
		@IChatEditingService private readonly chatEditingService: IChatEditingService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILanguageModelIgnoredFilesService private readonly ignoredFilesService: ILanguageModelIgnoredFilesService,
		@IChatContextService private readonly chatContextService: IChatContextService
	) {
		super();
		this._currentCancelTokenSource = this._register(new MutableDisposable<CancellationTokenSource>());
		this._implicitContextEnablement = this.configurationService.getValue<{ [mode: string]: string }>('chat.implicitContext.enabled');

		const activeEditorDisposables = this._register(new DisposableStore());

		this._register(Event.runAndSubscribe(
			editorService.onDidActiveEditorChange,
			(() => {
				activeEditorDisposables.clear();
				const codeEditor = this.findActiveCodeEditor();
				if (codeEditor) {
					activeEditorDisposables.add(Event.debounce(
						Event.any(
							codeEditor.onDidChangeModel,
							codeEditor.onDidChangeModelLanguage,
							codeEditor.onDidChangeCursorSelection,
							codeEditor.onDidScrollChange),
						() => undefined,
						500)(() => this.updateImplicitContext()));
				}

				const notebookEditor = this.findActiveNotebookEditor();
				if (notebookEditor) {
					const activeCellDisposables = activeEditorDisposables.add(new DisposableStore());
					activeEditorDisposables.add(notebookEditor.onDidChangeActiveCell(() => {
						activeCellDisposables.clear();
						const codeEditor = this.codeEditorService.getActiveCodeEditor();
						if (codeEditor && codeEditor.getModel()?.uri.scheme === Schemas.vscodeNotebookCell) {
							activeCellDisposables.add(Event.debounce(
								Event.any(
									codeEditor.onDidChangeModel,
									codeEditor.onDidChangeCursorSelection,
									codeEditor.onDidScrollChange),
								() => undefined,
								500)(() => this.updateImplicitContext()));
						}
					}));

					activeEditorDisposables.add(Event.debounce(
						Event.any(
							notebookEditor.onDidChangeModel,
							notebookEditor.onDidChangeActiveCell
						),
						() => undefined,
						500)(() => this.updateImplicitContext()));
				}
				const webviewEditor = this.findActiveWebviewEditor();
				if (webviewEditor) {
					activeEditorDisposables.add(Event.debounce((webviewEditor.input as WebviewInput).webview.onMessage, () => undefined, 500)(() => {
						this.updateImplicitContext();
					}));
				}

				this.updateImplicitContext();
			})));
		this._register(autorun((reader) => {
			this.chatEditingService.editingSessionsObs.read(reader);
			this.updateImplicitContext();
		}));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('chat.implicitContext.enabled')) {
				this._implicitContextEnablement = this.configurationService.getValue<{ [mode: string]: string }>('chat.implicitContext.enabled');
				this.updateImplicitContext();
			}
		}));
		this._register(this.chatService.onDidSubmitRequest(({ chatSessionResource }) => {
			const widget = this.chatWidgetService.getWidgetBySessionResource(chatSessionResource);
			if (!widget?.input.implicitContext) {
				return;
			}
			if (this._implicitContextEnablement[widget.location] === 'first' && widget.viewModel?.getItems().length !== 0) {
				widget.input.implicitContext.setValue(undefined, false, undefined);
			}
		}));
		this._register(this.chatWidgetService.onDidAddWidget(async (widget) => {
			await this.updateImplicitContext(widget);
		}));
	}

	private findActiveCodeEditor(): ICodeEditor | undefined {
		const codeEditor = this.codeEditorService.getActiveCodeEditor();
		if (codeEditor) {
			const model = codeEditor.getModel();
			if (model?.uri.scheme === Schemas.vscodeNotebookCell) {
				return undefined;
			}

			if (model) {
				return codeEditor;
			}
		}
		for (const codeOrDiffEditor of this.editorService.getVisibleTextEditorControls(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
			const codeEditor = getCodeEditor(codeOrDiffEditor);
			if (!codeEditor) {
				continue;
			}

			const model = codeEditor.getModel();
			if (model) {
				return codeEditor;
			}
		}
		return undefined;
	}

	private findActiveWebviewEditor(): WebviewEditor | undefined {
		const activeEditorPane = this.editorService.activeEditorPane;
		if (activeEditorPane?.input instanceof WebviewInput) {
			return activeEditorPane as WebviewEditor;
		}
		return undefined;
	}

	private findActiveNotebookEditor(): INotebookEditor | undefined {
		return getNotebookEditorFromEditorPane(this.editorService.activeEditorPane);
	}

	private async updateImplicitContext(updateWidget?: IChatWidget): Promise<void> {
		const cancelTokenSource = this._currentCancelTokenSource.value = new CancellationTokenSource();
		const codeEditor = this.findActiveCodeEditor();
		const model = codeEditor?.getModel();
		const selection = codeEditor?.getSelection();
		let newValue: Location | URI | StringChatContextValue | undefined;
		let isSelection = false;

		let languageId: string | undefined;
		if (model) {
			languageId = model.getLanguageId();
			if (selection && !selection.isEmpty()) {
				newValue = { uri: model.uri, range: selection } satisfies Location;
				isSelection = true;
			} else {
				if (this.configurationService.getValue('chat.implicitContext.suggestedContext')) {
					newValue = model.uri;
				} else {
					const visibleRanges = codeEditor?.getVisibleRanges();
					if (visibleRanges && visibleRanges.length > 0) {
						// Merge visible ranges. Maybe the reference value could actually be an array of Locations?
						// Something like a Location with an array of Ranges?
						let range = visibleRanges[0];
						visibleRanges.slice(1).forEach(r => {
							range = range.plusRange(r);
						});
						newValue = { uri: model.uri, range } satisfies Location;
					} else {
						newValue = model.uri;
					}
				}
			}
		}

		const notebookEditor = this.findActiveNotebookEditor();
		if (notebookEditor) {
			const activeCell = notebookEditor.getActiveCell();
			if (activeCell) {
				const codeEditor = this.codeEditorService.getActiveCodeEditor();
				const selection = codeEditor?.getSelection();
				const visibleRanges = codeEditor?.getVisibleRanges() || [];
				newValue = activeCell.uri;
				if (isEqual(codeEditor?.getModel()?.uri, activeCell.uri)) {
					if (selection && !selection.isEmpty()) {
						newValue = { uri: activeCell.uri, range: selection } satisfies Location;
						isSelection = true;
					} else if (visibleRanges.length > 0) {
						// Merge visible ranges. Maybe the reference value could actually be an array of Locations?
						// Something like a Location with an array of Ranges?
						let range = visibleRanges[0];
						visibleRanges.slice(1).forEach(r => {
							range = range.plusRange(r);
						});
						newValue = { uri: activeCell.uri, range } satisfies Location;
					}
				}
			} else {
				newValue = notebookEditor.textModel?.uri;
			}
		}

		const webviewEditor = this.findActiveWebviewEditor();
		if (webviewEditor?.input?.resource) {
			const webviewContext = await this.chatContextService.contextForResource(webviewEditor.input.resource);
			if (webviewContext) {
				newValue = webviewContext;
			}
		}

		const uri = newValue instanceof URI ? newValue : (isStringImplicitContextValue(newValue) ? undefined : newValue?.uri);
		if (uri && (
			await this.ignoredFilesService.fileIsIgnored(uri, cancelTokenSource.token) ||
			uri.path.endsWith('.copilotmd'))
		) {
			newValue = undefined;
		}

		if (cancelTokenSource.token.isCancellationRequested) {
			return;
		}

		const isPromptFile = languageId && getPromptsTypeForLanguageId(languageId) !== undefined;

		const widgets = updateWidget ? [updateWidget] : [...this.chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat), ...this.chatWidgetService.getWidgetsByLocations(ChatAgentLocation.EditorInline)];
		for (const widget of widgets) {
			if (!widget.input.implicitContext) {
				continue;
			}
			const setting = this._implicitContextEnablement[widget.location];
			const isFirstInteraction = widget.viewModel?.getItems().length === 0;
			if ((setting === 'always' || setting === 'first' && isFirstInteraction) && !isPromptFile) { // disable implicit context for prompt files
				widget.input.implicitContext.setValue(newValue, isSelection, languageId);
			} else {
				widget.input.implicitContext.setValue(undefined, false, undefined);
			}
		}
	}
}

export class ChatImplicitContext extends Disposable implements IChatRequestImplicitVariableEntry {
	get id() {
		if (URI.isUri(this.value)) {
			return 'vscode.implicit.file';
		} else if (isStringImplicitContextValue(this.value)) {
			return 'vscode.implicit.string';
		} else if (this.value) {
			if (this._isSelection) {
				return 'vscode.implicit.selection';
			} else {
				return 'vscode.implicit.viewport';
			}
		} else {
			return 'vscode.implicit';
		}
	}

	get name(): string {
		if (URI.isUri(this.value)) {
			return `file:${basename(this.value)}`;
		} else if (isStringImplicitContextValue(this.value)) {
			return this.value.name;
		} else if (this.value) {
			return `file:${basename(this.value.uri)}`;
		} else {
			return 'implicit';
		}
	}

	readonly kind = 'implicit';

	get modelDescription(): string {
		if (URI.isUri(this.value)) {
			return `User's active file`;
		} else if (isStringImplicitContextValue(this.value)) {
			return this.value.modelDescription ?? `User's active context from ${this.value.name}`;
		} else if (this._isSelection) {
			return `User's active selection`;
		} else {
			return `User's current visible code`;
		}
	}

	readonly isFile = true;

	private _isSelection = false;
	public get isSelection(): boolean {
		return this._isSelection;
	}

	private _onDidChangeValue = this._register(new Emitter<void>());
	readonly onDidChangeValue = this._onDidChangeValue.event;

	private _value: Location | URI | StringChatContextValue | undefined;
	get value() {
		return this._value;
	}

	private _enabled = true;
	get enabled() {
		return this._enabled;
	}

	set enabled(value: boolean) {
		this._enabled = value;
		this._onDidChangeValue.fire();
	}

	private _uri: URI | undefined;
	get uri(): URI | undefined {
		if (isStringImplicitContextValue(this.value)) {
			return this.value.uri;
		}
		return this._uri;
	}

	get icon(): ThemeIcon | undefined {
		if (isStringImplicitContextValue(this.value)) {
			return this.value.icon;
		}
		return undefined;
	}

	setValue(value: Location | URI | StringChatContextValue | undefined, isSelection: boolean, languageId?: string): void {
		if (isStringImplicitContextValue(value)) {
			this._value = value;
		} else {
			this._value = value;
			this._uri = URI.isUri(value) ? value : value?.uri;
		}
		this._isSelection = isSelection;
		this._onDidChangeValue.fire();
	}

	public toBaseEntries(): IChatRequestVariableEntry[] {
		if (!this.value) {
			return [];
		}

		if (isStringImplicitContextValue(this.value)) {
			return [
				{
					kind: 'string',
					id: this.id,
					name: this.name,
					value: this.value.value ?? this.name,
					modelDescription: this.modelDescription,
					icon: this.value.icon,
					uri: this.value.uri
				}
			];
		}

		return [{
			kind: 'file',
			id: this.id,
			name: this.name,
			value: this.value,
			modelDescription: this.modelDescription,
		}];
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatInputCompletions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatInputCompletions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../base/common/arrays.js';
import { raceTimeout } from '../../../../../base/common/async.js';
import { decodeBase64 } from '../../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { isPatternInWord } from '../../../../../base/common/filters.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ICodeEditor, getCodeEditor, isCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IWordAtPosition, getWordAtText } from '../../../../../editor/common/core/wordHelper.js';
import { CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, DocumentSymbol, Location, ProviderResult, SymbolKind, SymbolKinds } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { IOutlineModelService } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { localize } from '../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { FileKind, IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../../common/contributions.js';
import { EditorsOrder } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IHistoryService } from '../../../../services/history/common/history.js';
import { LifecyclePhase } from '../../../../services/lifecycle/common/lifecycle.js';
import { ISearchService } from '../../../../services/search/common/search.js';
import { McpPromptArgumentPick } from '../../../mcp/browser/mcpPromptArgumentPick.js';
import { IMcpPrompt, IMcpPromptMessage, IMcpServer, IMcpService, McpResourceURI } from '../../../mcp/common/mcpTypes.js';
import { searchFilesAndFolders } from '../../../search/browser/searchChatContext.js';
import { IChatAgentData, IChatAgentNameService, IChatAgentService, getFullyQualifiedId } from '../../common/chatAgents.js';
import { IChatEditingService } from '../../common/chatEditingService.js';
import { getAttachableImageExtension } from '../../common/chatModel.js';
import { ChatRequestAgentPart, ChatRequestAgentSubcommandPart, ChatRequestSlashPromptPart, ChatRequestTextPart, ChatRequestToolPart, ChatRequestToolSetPart, chatAgentLeader, chatSubcommandLeader, chatVariableLeader } from '../../common/chatParserTypes.js';
import { IChatSlashCommandService } from '../../common/chatSlashCommands.js';
import { IChatRequestVariableEntry } from '../../common/chatVariableEntries.js';
import { IDynamicVariable } from '../../common/chatVariables.js';
import { ChatAgentLocation, ChatModeKind, isSupportedChatFileScheme } from '../../common/constants.js';
import { ToolSet } from '../../common/languageModelToolsService.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { ChatSubmitAction, IChatExecuteActionContext } from '../actions/chatExecuteActions.js';
import { IChatWidget, IChatWidgetService } from '../chat.js';
import { resizeImage } from '../chatImageUtils.js';
import { ChatDynamicVariableModel } from './chatDynamicVariables.js';

class SlashCommandCompletions extends Disposable {
	constructor(
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatSlashCommandService private readonly chatSlashCommandService: IChatSlashCommandService,
		@IPromptsService private readonly promptsService: IPromptsService,
		@IMcpService mcpService: IMcpService,
	) {
		super();

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'globalSlashCommands',
			triggerCharacters: [chatSubcommandLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, _token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return null;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /\/\w*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const parsedRequest = widget.parsedInput.parts;
				const usedAgent = parsedRequest.find(p => p instanceof ChatRequestAgentPart);
				if (usedAgent) {
					// No (classic) global slash commands when an agent is used
					return;
				}

				const slashCommands = this.chatSlashCommandService.getCommands(widget.location, widget.input.currentModeKind);
				if (!slashCommands) {
					return null;
				}

				return {
					suggestions: slashCommands.map((c, i): CompletionItem => {
						const withSlash = `/${c.command}`;
						return {
							label: withSlash,
							insertText: c.executeImmediately ? '' : `${withSlash} `,
							documentation: c.detail,
							range,
							sortText: c.sortText ?? 'a'.repeat(i + 1),
							kind: CompletionItemKind.Text, // The icons are disabled here anyway,
							command: c.executeImmediately ? { id: ChatSubmitAction.ID, title: withSlash, arguments: [{ widget, inputValue: `${withSlash} ` } satisfies IChatExecuteActionContext] } : undefined,
						};
					})
				};
			}
		}));
		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'globalSlashCommandsAt',
			triggerCharacters: [chatAgentLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, _token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /@\w*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const slashCommands = this.chatSlashCommandService.getCommands(widget.location, widget.input.currentModeKind);
				if (!slashCommands) {
					return null;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				return {
					suggestions: slashCommands.map((c, i): CompletionItem => {
						const withSlash = `${chatSubcommandLeader}${c.command}`;
						return {
							label: withSlash,
							insertText: c.executeImmediately ? '' : `${withSlash} `,
							documentation: c.detail,
							range,
							filterText: `${chatAgentLeader}${c.command}`,
							sortText: c.sortText ?? 'z'.repeat(i + 1),
							kind: CompletionItemKind.Text, // The icons are disabled here anyway,
							command: c.executeImmediately ? { id: ChatSubmitAction.ID, title: withSlash, arguments: [{ widget, inputValue: `${withSlash} ` } satisfies IChatExecuteActionContext] } : undefined,
						};
					})
				};
			}
		}));
		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'promptSlashCommands',
			triggerCharacters: [chatSubcommandLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /\/\w*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const parsedRequest = widget.parsedInput.parts;
				const usedAgent = parsedRequest.find(p => p instanceof ChatRequestAgentPart);
				if (usedAgent) {
					// No (classic) global slash commands when an agent is used
					return;
				}

				const promptCommands = await this.promptsService.getPromptSlashCommands(token);
				if (promptCommands.length === 0) {
					return null;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				return {
					suggestions: promptCommands.map((c, i): CompletionItem => {
						const label = `/${c.name}`;
						const description = c.description;
						return {
							label: { label, description },
							insertText: `${label} `,
							documentation: c.description,
							range,
							sortText: 'a'.repeat(i + 1),
							kind: CompletionItemKind.Text, // The icons are disabled here anyway,
						};
					})
				};
			}
		}));

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'mcpPromptSlashCommands',
			triggerCharacters: [chatSubcommandLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, _token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return null;
				}

				// regex is the opposite of `mcpPromptReplaceSpecialChars` found in `mcpTypes.ts`
				const range = computeCompletionRanges(model, position, /\/[a-z0-9_.-]*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				return {
					suggestions: mcpService.servers.get().flatMap(server => server.prompts.get().map((prompt): CompletionItem => {
						const label = `/mcp.${prompt.id}`;
						return {
							label: { label, description: prompt.description },
							command: {
								id: StartParameterizedPromptAction.ID,
								title: prompt.name,
								arguments: [model, server, prompt, `${label} `],
							},
							insertText: `${label} `,
							range,
							kind: CompletionItemKind.Text,
						};
					}))
				};
			}
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(SlashCommandCompletions, LifecyclePhase.Eventually);

class AgentCompletions extends Disposable {
	constructor(
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IChatAgentNameService private readonly chatAgentNameService: IChatAgentNameService,
	) {
		super();


		const subCommandProvider: CompletionItemProvider = {
			_debugDisplayName: 'chatAgentSubcommand',
			triggerCharacters: [chatSubcommandLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return;
				}

				const range = computeCompletionRanges(model, position, /\/\w*/g);
				if (!range) {
					return;
				}

				const usedAgent = this.getCurrentAgentForWidget(widget);
				if (!usedAgent || usedAgent.command) {
					// Only one allowed
					return;
				}

				return {
					suggestions: usedAgent.agent.slashCommands.map((c, i): CompletionItem => {
						const withSlash = `/${c.name}`;
						return {
							label: withSlash,
							insertText: `${withSlash} `,
							documentation: c.description,
							range,
							kind: CompletionItemKind.Text, // The icons are disabled here anyway
						};
					})
				};
			}
		};
		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, subCommandProvider));

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'chatAgentAndSubcommand',
			triggerCharacters: [chatAgentLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				const viewModel = widget?.viewModel;
				if (!widget || !viewModel) {
					return;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /(@|\/)\w*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const agents = this.chatAgentService.getAgents()
					.filter(a => a.locations.includes(widget.location));

				// When the input is only `/`, items are sorted by sortText.
				// When typing, filterText is used to score and sort.
				// The same list is refiltered/ranked while typing.
				const getFilterText = (agent: IChatAgentData, command: string) => {
					// This is hacking the filter algorithm to make @terminal /explain match worse than @workspace /explain by making its match index later in the string.
					// When I type `/exp`, the workspace one should be sorted over the terminal one.
					const dummyPrefix = agent.id === 'github.copilot.terminalPanel' ? `0000` : ``;
					return `${chatAgentLeader}${dummyPrefix}${agent.name}.${command}`;
				};

				const justAgents: CompletionItem[] = agents
					.filter(a => !a.isDefault)
					.map(agent => {
						const { label: agentLabel, isDupe } = this.getAgentCompletionDetails(agent);
						const detail = agent.description;

						return {
							label: isDupe ?
								{ label: agentLabel, description: agent.description, detail: ` (${agent.publisherDisplayName})` } :
								agentLabel,
							documentation: detail,
							filterText: `${chatAgentLeader}${agent.name}`,
							insertText: `${agentLabel} `,
							range,
							kind: CompletionItemKind.Text,
							sortText: `${chatAgentLeader}${agent.name}`,
							command: { id: AssignSelectedAgentAction.ID, title: AssignSelectedAgentAction.ID, arguments: [{ agent, widget } satisfies AssignSelectedAgentActionArgs] },
						};
					});

				return {
					suggestions: justAgents.concat(
						coalesce(agents.flatMap(agent => agent.slashCommands.map((c, i) => {
							if (agent.isDefault && this.chatAgentService.getDefaultAgent(widget.location, widget.input.currentModeKind)?.id !== agent.id) {
								return;
							}

							const { label: agentLabel, isDupe } = this.getAgentCompletionDetails(agent);
							const label = `${agentLabel} ${chatSubcommandLeader}${c.name}`;
							const item: CompletionItem = {
								label: isDupe ?
									{ label, description: c.description, detail: isDupe ? ` (${agent.publisherDisplayName})` : undefined } :
									label,
								documentation: c.description,
								filterText: getFilterText(agent, c.name),
								commitCharacters: [' '],
								insertText: label + ' ',
								range,
								kind: CompletionItemKind.Text, // The icons are disabled here anyway
								sortText: `x${chatAgentLeader}${agent.name}${c.name}`,
								command: { id: AssignSelectedAgentAction.ID, title: AssignSelectedAgentAction.ID, arguments: [{ agent, widget } satisfies AssignSelectedAgentActionArgs] },
							};

							if (agent.isDefault) {
								// default agent isn't mentioned nor inserted
								const label = `${chatSubcommandLeader}${c.name}`;
								item.label = label;
								item.insertText = `${label} `;
								item.documentation = c.description;
							}

							return item;
						}))))
				};
			}
		}));

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'chatAgentAndSubcommand',
			triggerCharacters: [chatSubcommandLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				const viewModel = widget?.viewModel;
				if (!widget || !viewModel) {
					return;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /(@|\/)\w*/g);
				if (!range) {
					return null;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const agents = this.chatAgentService.getAgents()
					.filter(a => a.locations.includes(widget.location) && a.modes.includes(widget.input.currentModeKind));

				return {
					suggestions: coalesce(agents.flatMap(agent => agent.slashCommands.map((c, i) => {
						if (agent.isDefault && this.chatAgentService.getDefaultAgent(widget.location, widget.input.currentModeKind)?.id !== agent.id) {
							return;
						}

						const { label: agentLabel, isDupe } = this.getAgentCompletionDetails(agent);
						const withSlash = `${chatSubcommandLeader}${c.name}`;
						const extraSortText = agent.id === 'github.copilot.terminalPanel' ? `z` : ``;
						const sortText = `${chatSubcommandLeader}${extraSortText}${agent.name}${c.name}`;
						const item: CompletionItem = {
							label: { label: withSlash, description: agentLabel, detail: isDupe ? ` (${agent.publisherDisplayName})` : undefined },
							commitCharacters: [' '],
							insertText: `${agentLabel} ${withSlash} `,
							documentation: `(${agentLabel}) ${c.description ?? ''}`,
							range,
							kind: CompletionItemKind.Text, // The icons are disabled here anyway
							sortText,
							command: { id: AssignSelectedAgentAction.ID, title: AssignSelectedAgentAction.ID, arguments: [{ agent, widget } satisfies AssignSelectedAgentActionArgs] },
						};

						if (agent.isDefault) {
							// default agent isn't mentioned nor inserted
							const label = `${chatSubcommandLeader}${c.name}`;
							item.label = label;
							item.insertText = `${label} `;
							item.documentation = c.description;
						}

						return item;
					})))
				};
			}
		}));

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'installChatExtensions',
			triggerCharacters: [chatAgentLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				if (!model.getLineContent(1).startsWith(chatAgentLeader)) {
					return;
				}

				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (widget?.location !== ChatAgentLocation.Chat || widget.input.currentModeKind !== ChatModeKind.Ask) {
					return;
				}

				if (widget.lockedAgentId) {
					return null;
				}

				const range = computeCompletionRanges(model, position, /(@|\/)\w*/g);
				if (!range) {
					return;
				}

				if (!isEmptyUpToCompletionWord(model, range)) {
					// No text allowed before the completion
					return;
				}

				const label = localize('installLabel', "Install Chat Extensions...");
				const item: CompletionItem = {
					label,
					insertText: '',
					range,
					kind: CompletionItemKind.Text, // The icons are disabled here anyway
					command: { id: 'workbench.extensions.search', title: '', arguments: ['@tag:chat-participant'] },
					filterText: chatAgentLeader + label,
					sortText: 'zzz'
				};

				return {
					suggestions: [item]
				};
			}
		}));
	}

	private getCurrentAgentForWidget(widget: IChatWidget): { agent: IChatAgentData; command?: string } | undefined {
		if (widget.lockedAgentId) {
			const usedAgent = this.chatAgentService.getAgent(widget.lockedAgentId);
			return usedAgent && { agent: usedAgent };
		}

		const parsedRequest = widget.parsedInput.parts;
		const usedAgentIdx = parsedRequest.findIndex((p): p is ChatRequestAgentPart => p instanceof ChatRequestAgentPart);
		if (usedAgentIdx < 0) {
			return;
		}

		const usedAgent = parsedRequest[usedAgentIdx] as ChatRequestAgentPart;

		const usedOtherCommand = parsedRequest.find(p => p instanceof ChatRequestAgentSubcommandPart || p instanceof ChatRequestSlashPromptPart);
		if (usedOtherCommand) {
			// Only one allowed
			return {
				agent: usedAgent.agent,
				command: usedOtherCommand instanceof ChatRequestAgentSubcommandPart ? usedOtherCommand.command.name : undefined
			};
		}

		for (const partAfterAgent of parsedRequest.slice(usedAgentIdx + 1)) {
			// Could allow text after 'position'
			if (!(partAfterAgent instanceof ChatRequestTextPart) || !partAfterAgent.text.trim().match(/^(\/\w*)?$/)) {
				// No text allowed between agent and subcommand
				return;
			}
		}

		return { agent: usedAgent.agent };
	}

	private getAgentCompletionDetails(agent: IChatAgentData): { label: string; isDupe: boolean } {
		const isAllowed = this.chatAgentNameService.getAgentNameRestriction(agent);
		const agentLabel = `${chatAgentLeader}${isAllowed ? agent.name : getFullyQualifiedId(agent)}`;
		const isDupe = isAllowed && this.chatAgentService.agentHasDupeName(agent.id);
		return { label: agentLabel, isDupe };
	}
}
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(AgentCompletions, LifecyclePhase.Eventually);

interface AssignSelectedAgentActionArgs {
	agent: IChatAgentData;
	widget: IChatWidget;
}

class AssignSelectedAgentAction extends Action2 {
	static readonly ID = 'workbench.action.chat.assignSelectedAgent';

	constructor() {
		super({
			id: AssignSelectedAgentAction.ID,
			title: '' // not displayed
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const arg = args[0] as AssignSelectedAgentActionArgs | undefined;
		if (!arg || !arg.widget || !arg.agent) {
			return;
		}

		if (!arg.agent.modes.includes(arg.widget.input.currentModeKind)) {
			arg.widget.input.setChatMode(arg.agent.modes[0]);
		}

		arg.widget.lastSelectedAgent = arg.agent;
	}
}
registerAction2(AssignSelectedAgentAction);

class StartParameterizedPromptAction extends Action2 {
	static readonly ID = 'workbench.action.chat.startParameterizedPrompt';

	constructor() {
		super({
			id: StartParameterizedPromptAction.ID,
			title: '' // not displayed
		});
	}

	async run(accessor: ServicesAccessor, model: ITextModel, server: IMcpServer, prompt: IMcpPrompt, textToReplace: string) {
		if (!model || !prompt) {
			return;
		}

		const instantiationService = accessor.get(IInstantiationService);
		const notificationService = accessor.get(INotificationService);
		const widgetService = accessor.get(IChatWidgetService);
		const fileService = accessor.get(IFileService);

		const chatWidget = await widgetService.revealWidget(true);
		if (!chatWidget) {
			return;
		}

		const lastPosition = model.getFullModelRange().collapseToEnd();
		const getPromptIndex = () => model.findMatches(textToReplace, true, false, true, null, false)[0];
		const replaceTextWith = (value: string) => model.applyEdits([{
			range: getPromptIndex()?.range || lastPosition,
			text: value,
		}]);

		const store = new DisposableStore();
		const cts = store.add(new CancellationTokenSource());
		store.add(chatWidget.input.startGenerating());

		store.add(model.onDidChangeContent(() => {
			if (getPromptIndex()) {
				cts.cancel(); // cancel if the user deletes their prompt
			}
		}));

		model.changeDecorations(accessor => {
			const id = accessor.addDecoration(lastPosition, {
				description: 'mcp-prompt-spinner',
				showIfCollapsed: true,
				after: {
					content: ' ',
					inlineClassNameAffectsLetterSpacing: true,
					inlineClassName: ThemeIcon.asClassName(ThemeIcon.modify(Codicon.loading, 'spin')) + ' chat-prompt-spinner',
				}
			});
			store.add(toDisposable(() => {
				model.changeDecorations(a => a.removeDecoration(id));
			}));
		});

		const pick = store.add(instantiationService.createInstance(McpPromptArgumentPick, prompt));

		try {
			// start the server if not already running so that it's ready to resolve
			// the prompt instantly when the user finishes picking arguments.
			await server.start();

			const args = await pick.createArgs();
			if (!args) {
				replaceTextWith('');
				return;
			}

			let messages: IMcpPromptMessage[];
			try {
				messages = await prompt.resolve(args, cts.token);
			} catch (e) {
				if (!cts.token.isCancellationRequested) {
					notificationService.error(localize('mcp.prompt.error', "Error resolving prompt: {0}", String(e)));
				}
				replaceTextWith('');
				return;
			}

			const toAttach: IChatRequestVariableEntry[] = [];
			const attachBlob = async (mimeType: string | undefined, contents: string, uriStr?: string, isText = false) => {
				let validURI: URI | undefined;
				if (uriStr) {
					for (const uri of [URI.parse(uriStr), McpResourceURI.fromServer(server.definition, uriStr)]) {
						try {
							validURI ||= await fileService.exists(uri) ? uri : undefined;
						} catch {
							// ignored
						}
					}
				}

				if (isText) {
					if (validURI) {
						toAttach.push({
							id: generateUuid(),
							kind: 'file',
							value: validURI,
							name: basename(validURI),
						});
					} else {
						toAttach.push({
							id: generateUuid(),
							kind: 'generic',
							value: contents,
							name: localize('mcp.prompt.resource', 'Prompt Resource'),
						});
					}
				} else if (mimeType && getAttachableImageExtension(mimeType)) {
					const resized = await resizeImage(contents)
						.catch(() => decodeBase64(contents).buffer);
					chatWidget.attachmentModel.addContext({
						id: generateUuid(),
						name: localize('mcp.prompt.image', 'Prompt Image'),
						fullName: localize('mcp.prompt.image', 'Prompt Image'),
						value: resized,
						kind: 'image',
						references: validURI && [{ reference: validURI, kind: 'reference' }],
					});
				} else if (validURI) {
					toAttach.push({
						id: generateUuid(),
						kind: 'file',
						value: validURI,
						name: basename(validURI),
					});
				} else {
					// not a valid resource/resource URI
				}
			};

			const hasMultipleRoles = messages.some(m => m.role !== messages[0].role);
			let input = '';
			for (const message of messages) {
				switch (message.content.type) {
					case 'text':
						if (input) {
							input += '\n\n';
						}
						if (hasMultipleRoles) {
							input += `--${message.role.toUpperCase()}\n`;
						}

						input += message.content.text;
						break;
					case 'resource':
						if ('text' in message.content.resource) {
							await attachBlob(message.content.resource.mimeType, message.content.resource.text, message.content.resource.uri, true);
						} else {
							await attachBlob(message.content.resource.mimeType, message.content.resource.blob, message.content.resource.uri);
						}
						break;
					case 'image':
					case 'audio':
						await attachBlob(message.content.mimeType, message.content.data);
						break;
				}
			}

			if (toAttach.length) {
				chatWidget.attachmentModel.addContext(...toAttach);
			}
			replaceTextWith(input);
		} finally {
			store.dispose();
		}
	}
}
registerAction2(StartParameterizedPromptAction);


class ReferenceArgument {
	constructor(
		readonly widget: IChatWidget,
		readonly variable: IDynamicVariable
	) { }
}

interface IVariableCompletionsDetails {
	model: ITextModel;
	position: Position;
	context: CompletionContext;
	widget: IChatWidget;
	range: IChatCompletionRangeResult;
}

class BuiltinDynamicCompletions extends Disposable {
	private static readonly addReferenceCommand = '_addReferenceCmd';
	private static readonly VariableNameDef = new RegExp(`${chatVariableLeader}[\\w:-]*`, 'g'); // MUST be using `g`-flag


	constructor(
		@IHistoryService private readonly historyService: IHistoryService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ISearchService private readonly searchService: ISearchService,
		@ILabelService private readonly labelService: ILabelService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatEditingService private readonly _chatEditingService: IChatEditingService,
		@IOutlineModelService private readonly outlineService: IOutlineModelService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		// File/Folder completions in one go and m
		const fileWordPattern = new RegExp(`${chatVariableLeader}[^\\s]*`, 'g');
		this.registerVariableCompletions('fileAndFolder', async ({ widget, range }, token) => {
			if (!widget.supportsFileReferences) {
				return;
			}

			const result: CompletionList = { suggestions: [] };

			// If locked to an agent that doesn't support file attachments, skip
			if (widget.lockedAgentId) {
				const agent = this.chatAgentService.getAgent(widget.lockedAgentId);
				if (agent && !agent.capabilities?.supportsFileAttachments) {
					return result;
				}
			}
			await this.addFileAndFolderEntries(widget, result, range, token);
			return result;

		}, fileWordPattern);

		// Selection completion
		this.registerVariableCompletions('selection', ({ widget, range }, token) => {
			if (!widget.supportsFileReferences) {
				return;
			}

			if (widget.location === ChatAgentLocation.EditorInline) {
				return;
			}

			const active = this.findActiveCodeEditor();
			if (!isCodeEditor(active)) {
				return;
			}

			const currentResource = active.getModel()?.uri;
			const currentSelection = active.getSelection();
			if (!currentSelection || !currentResource || currentSelection.isEmpty()) {
				return;
			}

			const basename = this.labelService.getUriBasenameLabel(currentResource);
			const text = `${chatVariableLeader}file:${basename}:${currentSelection.startLineNumber}-${currentSelection.endLineNumber}`;
			const fullRangeText = `:${currentSelection.startLineNumber}:${currentSelection.startColumn}-${currentSelection.endLineNumber}:${currentSelection.endColumn}`;
			const description = this.labelService.getUriLabel(currentResource, { relative: true }) + fullRangeText;

			const result: CompletionList = { suggestions: [] };
			result.suggestions.push({
				label: { label: `${chatVariableLeader}selection`, description },
				filterText: `${chatVariableLeader}selection`,
				insertText: range.varWord?.endColumn === range.replace.endColumn ? `${text} ` : text,
				range,
				kind: CompletionItemKind.Text,
				sortText: 'z',
				command: {
					id: BuiltinDynamicCompletions.addReferenceCommand, title: '', arguments: [new ReferenceArgument(widget, {
						id: 'vscode.selection',
						isFile: true,
						range: { startLineNumber: range.replace.startLineNumber, startColumn: range.replace.startColumn, endLineNumber: range.replace.endLineNumber, endColumn: range.replace.startColumn + text.length },
						data: { range: currentSelection, uri: currentResource } satisfies Location
					})]
				}
			});
			return result;
		});

		// Symbol completions
		this.registerVariableCompletions('symbol', ({ widget, range, position, model }, token) => {
			if (!widget.supportsFileReferences) {
				return null;
			}

			const result: CompletionList = { suggestions: [] };
			const range2 = computeCompletionRanges(model, position, new RegExp(`${chatVariableLeader}[^\\s]*`, 'g'), true);
			if (range2) {
				this.addSymbolEntries(widget, result, range2, token);
			}

			return result;
		});

		this._register(CommandsRegistry.registerCommand(BuiltinDynamicCompletions.addReferenceCommand, (_services, arg) => {
			assertType(arg instanceof ReferenceArgument);
			return this.cmdAddReference(arg);
		}));
	}

	private findActiveCodeEditor(): ICodeEditor | undefined {
		const codeEditor = this.codeEditorService.getActiveCodeEditor();
		if (codeEditor) {
			const model = codeEditor.getModel();
			if (model?.uri.scheme === Schemas.vscodeNotebookCell) {
				return undefined;
			}

			if (model) {
				return codeEditor;
			}
		}
		for (const codeOrDiffEditor of this.editorService.getVisibleTextEditorControls(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
			const codeEditor = getCodeEditor(codeOrDiffEditor);
			if (!codeEditor) {
				continue;
			}

			const model = codeEditor.getModel();
			if (model) {
				return codeEditor;
			}
		}
		return undefined;
	}

	private registerVariableCompletions(debugName: string, provider: (details: IVariableCompletionsDetails, token: CancellationToken) => ProviderResult<CompletionList>, wordPattern: RegExp = BuiltinDynamicCompletions.VariableNameDef) {
		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: `chatVarCompletions-${debugName}`,
			triggerCharacters: [chatVariableLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget) {
					return;
				}

				const range = computeCompletionRanges(model, position, wordPattern, true);
				if (range) {
					return provider({ model, position, widget, range, context }, token);
				}

				return;
			}
		}));
	}

	private cacheKey?: { key: string; time: number };

	private async addFileAndFolderEntries(widget: IChatWidget, result: CompletionList, info: { insert: Range; replace: Range; varWord: IWordAtPosition | null }, token: CancellationToken) {

		const makeCompletionItem = (resource: URI, kind: FileKind, description?: string, boostPriority?: boolean): CompletionItem => {
			const basename = this.labelService.getUriBasenameLabel(resource);
			const text = `${chatVariableLeader}file:${basename}`;
			const uriLabel = this.labelService.getUriLabel(resource, { relative: true });
			const labelDescription = description
				? localize('fileEntryDescription', '{0} ({1})', uriLabel, description)
				: uriLabel;
			// keep files above other completions
			const sortText = boostPriority ? ' ' : '!';

			return {
				label: { label: basename, description: labelDescription },
				filterText: `${chatVariableLeader}${basename}`,
				insertText: info.varWord?.endColumn === info.replace.endColumn ? `${text} ` : text,
				range: info,
				kind: kind === FileKind.FILE ? CompletionItemKind.File : CompletionItemKind.Folder,
				sortText,
				command: {
					id: BuiltinDynamicCompletions.addReferenceCommand, title: '', arguments: [new ReferenceArgument(widget, {
						id: resource.toString(),
						isFile: kind === FileKind.FILE,
						isDirectory: kind === FileKind.FOLDER,
						range: { startLineNumber: info.replace.startLineNumber, startColumn: info.replace.startColumn, endLineNumber: info.replace.endLineNumber, endColumn: info.replace.startColumn + text.length },
						data: resource
					})]
				}
			};
		};

		let pattern: string | undefined;
		if (info.varWord?.word && info.varWord.word.startsWith(chatVariableLeader)) {
			pattern = info.varWord.word.toLowerCase().slice(1); // remove leading #
		}

		const seen = new ResourceSet();
		const len = result.suggestions.length;

		// HISTORY
		// always take the last N items
		for (const [i, item] of this.historyService.getHistory().entries()) {
			if (!item.resource || seen.has(item.resource) || !this.instantiationService.invokeFunction(accessor => isSupportedChatFileScheme(accessor, item.resource!.scheme))) {
				// ignore editors without a resource
				continue;
			}

			if (pattern) {
				// use pattern if available
				const basename = this.labelService.getUriBasenameLabel(item.resource).toLowerCase();
				if (!isPatternInWord(pattern, 0, pattern.length, basename, 0, basename.length)) {
					continue;
				}
			}

			seen.add(item.resource);
			const newLen = result.suggestions.push(makeCompletionItem(item.resource, FileKind.FILE, i === 0 ? localize('activeFile', 'Active file') : undefined, i === 0));
			if (newLen - len >= 5) {
				break;
			}
		}

		// RELATED FILES
		if (widget.input.currentModeKind !== ChatModeKind.Ask && widget.viewModel && widget.viewModel.model.editingSession) {
			const relatedFiles = (await raceTimeout(this._chatEditingService.getRelatedFiles(widget.viewModel.sessionResource, widget.getInput(), widget.attachmentModel.fileAttachments, token), 200)) ?? [];
			for (const relatedFileGroup of relatedFiles) {
				for (const relatedFile of relatedFileGroup.files) {
					if (!seen.has(relatedFile.uri)) {
						seen.add(relatedFile.uri);
						result.suggestions.push(makeCompletionItem(relatedFile.uri, FileKind.FILE, relatedFile.description));
					}
				}
			}
		}

		// SEARCH
		// use file search when having a pattern
		if (pattern) {

			const cacheKey = this.updateCacheKey();
			const workspaces = this.workspaceContextService.getWorkspace().folders.map(folder => folder.uri);

			for (const workspace of workspaces) {
				const { folders, files } = await searchFilesAndFolders(workspace, pattern, true, token, cacheKey.key, this.configurationService, this.searchService);
				for (const file of files) {
					if (!seen.has(file)) {
						result.suggestions.push(makeCompletionItem(file, FileKind.FILE));
						seen.add(file);
					}
				}
				for (const folder of folders) {
					if (!seen.has(folder)) {
						result.suggestions.push(makeCompletionItem(folder, FileKind.FOLDER));
						seen.add(folder);
					}
				}
			}
		}

		// mark results as incomplete because further typing might yield
		// in more search results
		result.incomplete = true;
	}

	private addSymbolEntries(widget: IChatWidget, result: CompletionList, info: { insert: Range; replace: Range; varWord: IWordAtPosition | null }, token: CancellationToken) {

		const makeSymbolCompletionItem = (symbolItem: { name: string; location: Location; kind: SymbolKind }, pattern: string): CompletionItem => {
			const text = `${chatVariableLeader}sym:${symbolItem.name}`;
			const resource = symbolItem.location.uri;
			const uriLabel = this.labelService.getUriLabel(resource, { relative: true });
			const sortText = pattern ? '{' /* after z */ : '|' /* after { */;

			return {
				label: { label: symbolItem.name, description: uriLabel },
				filterText: `${chatVariableLeader}${symbolItem.name}`,
				insertText: info.varWord?.endColumn === info.replace.endColumn ? `${text} ` : text,
				range: info,
				kind: SymbolKinds.toCompletionKind(symbolItem.kind),
				sortText,
				command: {
					id: BuiltinDynamicCompletions.addReferenceCommand, title: '', arguments: [new ReferenceArgument(widget, {
						id: `vscode.symbol/${JSON.stringify(symbolItem.location)}`,
						fullName: symbolItem.name,
						range: { startLineNumber: info.replace.startLineNumber, startColumn: info.replace.startColumn, endLineNumber: info.replace.endLineNumber, endColumn: info.replace.startColumn + text.length },
						data: symbolItem.location,
						icon: SymbolKinds.toIcon(symbolItem.kind)
					})]
				}
			};
		};

		let pattern: string | undefined;
		if (info.varWord?.word && info.varWord.word.startsWith(chatVariableLeader)) {
			pattern = info.varWord.word.toLowerCase().slice(1); // remove leading #
		}

		const symbolsToAdd: { symbol: DocumentSymbol; uri: URI }[] = [];
		for (const outlineModel of this.outlineService.getCachedModels()) {
			const symbols = outlineModel.asListOfDocumentSymbols();
			for (const symbol of symbols) {
				symbolsToAdd.push({ symbol, uri: outlineModel.uri });
			}
		}

		for (const symbol of symbolsToAdd) {
			result.suggestions.push(makeSymbolCompletionItem({ ...symbol.symbol, location: { uri: symbol.uri, range: symbol.symbol.range } }, pattern ?? ''));
		}

		result.incomplete = !!pattern;
	}

	private updateCacheKey() {
		if (this.cacheKey && Date.now() - this.cacheKey.time > 60000) {
			this.searchService.clearCache(this.cacheKey.key);
			this.cacheKey = undefined;
		}

		if (!this.cacheKey) {
			this.cacheKey = {
				key: generateUuid(),
				time: Date.now()
			};
		}

		this.cacheKey.time = Date.now();

		return this.cacheKey;
	}

	private cmdAddReference(arg: ReferenceArgument) {
		// invoked via the completion command
		arg.widget.getContrib<ChatDynamicVariableModel>(ChatDynamicVariableModel.ID)?.addReference(arg.variable);
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(BuiltinDynamicCompletions, LifecyclePhase.Eventually);

export interface IChatCompletionRangeResult {
	insert: Range;
	replace: Range;
	varWord: IWordAtPosition | null;
}

export function computeCompletionRanges(model: ITextModel, position: Position, reg: RegExp, onlyOnWordStart = false): IChatCompletionRangeResult | undefined {
	const varWord = getWordAtText(position.column, reg, model.getLineContent(position.lineNumber), 0);
	if (!varWord && model.getWordUntilPosition(position).word) {
		// inside a "normal" word
		return;
	}

	if (!varWord && position.column > 1) {
		const textBefore = model.getValueInRange(new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column));
		if (textBefore !== ' ') {
			return;
		}
	}

	if (varWord && onlyOnWordStart) {
		const wordBefore = model.getWordUntilPosition({ lineNumber: position.lineNumber, column: varWord.startColumn });
		if (wordBefore.word) {
			// inside a word
			return;
		}
	}

	let insert: Range;
	let replace: Range;
	if (!varWord) {
		insert = replace = Range.fromPositions(position);
	} else {
		insert = new Range(position.lineNumber, varWord.startColumn, position.lineNumber, position.column);
		replace = new Range(position.lineNumber, varWord.startColumn, position.lineNumber, varWord.endColumn);
	}

	return { insert, replace, varWord };
}

function isEmptyUpToCompletionWord(model: ITextModel, rangeResult: IChatCompletionRangeResult): boolean {
	const startToCompletionWordStart = new Range(1, 1, rangeResult.replace.startLineNumber, rangeResult.replace.startColumn);
	return !!model.getValueInRange(startToCompletionWordStart).match(/^\s*$/);
}

class ToolCompletions extends Disposable {

	private static readonly VariableNameDef = new RegExp(`(?<=^|\\s)${chatVariableLeader}\\w*`, 'g'); // MUST be using `g`-flag

	constructor(
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
	) {
		super();

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'chatVariables',
			triggerCharacters: [chatVariableLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, _token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget) {
					return null;
				}

				// If locked to an agent that doesn't support tool attachments, skip
				if (widget.lockedAgentId) {
					const agent = this.chatAgentService.getAgent(widget.lockedAgentId);
					if (agent && !agent.capabilities?.supportsToolAttachments) {
						return null;
					}
				}

				const range = computeCompletionRanges(model, position, ToolCompletions.VariableNameDef, true);
				if (!range) {
					return null;
				}


				const usedNames = new Set<string>();
				for (const part of widget.parsedInput.parts) {
					if (part instanceof ChatRequestToolPart) {
						usedNames.add(part.toolName);
					} else if (part instanceof ChatRequestToolSetPart) {
						usedNames.add(part.name);
					}
				}

				const suggestions: CompletionItem[] = [];


				const iter = widget.input.selectedToolsModel.entriesMap.get();

				for (const [item, enabled] of iter) {
					if (!enabled) {
						continue;
					}

					let detail: string | undefined;
					let documentation: string | undefined;

					let name: string;
					if (item instanceof ToolSet) {
						detail = item.description;
						name = item.referenceName;

					} else {
						const source = item.source;
						detail = localize('tool_source_completion', "{0}: {1}", source.label, item.displayName);
						name = item.toolReferenceName ?? item.displayName;
						documentation = item.userDescription ?? item.modelDescription;
					}

					if (usedNames.has(name)) {
						continue;
					}

					const withLeader = `${chatVariableLeader}${name}`;
					suggestions.push({
						label: withLeader,
						range,
						detail,
						documentation,
						insertText: withLeader + ' ',
						kind: CompletionItemKind.Tool,
						sortText: 'z',
					});

				}

				return { suggestions };
			}
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ToolCompletions, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatInputEditorContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatInputEditorContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../base/common/observable.js';
import { themeColorFromId } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IDecorationOptions } from '../../../../../editor/common/editorCommon.js';
import { TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { inputPlaceholderForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IChatAgentCommand, IChatAgentData, IChatAgentService } from '../../common/chatAgents.js';
import { chatSlashCommandBackground, chatSlashCommandForeground } from '../../common/chatColors.js';
import { ChatRequestAgentPart, ChatRequestAgentSubcommandPart, ChatRequestDynamicVariablePart, ChatRequestSlashCommandPart, ChatRequestSlashPromptPart, ChatRequestTextPart, ChatRequestToolPart, ChatRequestToolSetPart, IParsedChatRequestPart, chatAgentLeader, chatSubcommandLeader } from '../../common/chatParserTypes.js';
import { ChatRequestParser } from '../../common/chatRequestParser.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { IChatWidget } from '../chat.js';
import { ChatWidget } from '../chatWidget.js';
import { dynamicVariableDecorationType } from './chatDynamicVariables.js';
import { NativeEditContextRegistry } from '../../../../../editor/browser/controller/editContext/native/nativeEditContextRegistry.js';
import { TextAreaEditContextRegistry } from '../../../../../editor/browser/controller/editContext/textArea/textAreaEditContextRegistry.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ThrottledDelayer } from '../../../../../base/common/async.js';

const decorationDescription = 'chat';
const placeholderDecorationType = 'chat-session-detail';
const slashCommandTextDecorationType = 'chat-session-text';
const variableTextDecorationType = 'chat-variable-text';

function agentAndCommandToKey(agent: IChatAgentData, subcommand: string | undefined): string {
	return subcommand ? `${agent.id}__${subcommand}` : agent.id;
}

function isWhitespaceOrPromptPart(p: IParsedChatRequestPart): boolean {
	return (p instanceof ChatRequestTextPart && !p.text.trim().length) || (p instanceof ChatRequestSlashPromptPart);
}

function exactlyOneSpaceAfterPart(parsedRequest: readonly IParsedChatRequestPart[], part: IParsedChatRequestPart): boolean {
	const partIdx = parsedRequest.indexOf(part);
	if (parsedRequest.length > partIdx + 2) {
		return false;
	}

	const nextPart = parsedRequest[partIdx + 1];
	return nextPart && nextPart instanceof ChatRequestTextPart && nextPart.text === ' ';
}

function getRangeForPlaceholder(part: IParsedChatRequestPart) {
	return {
		startLineNumber: part.editorRange.startLineNumber,
		endLineNumber: part.editorRange.endLineNumber,
		startColumn: part.editorRange.endColumn + 1,
		endColumn: 1000
	};
}

class InputEditorDecorations extends Disposable {

	private static readonly UPDATE_DELAY = 200;

	public readonly id = 'inputEditorDecorations';

	private readonly previouslyUsedAgents = new Set<string>();

	private readonly viewModelDisposables = this._register(new MutableDisposable());


	private readonly updateThrottle = this._register(new ThrottledDelayer<void>(InputEditorDecorations.UPDATE_DELAY));

	constructor(
		private readonly widget: IChatWidget,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IThemeService private readonly themeService: IThemeService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@ILabelService private readonly labelService: ILabelService,
		@IPromptsService private readonly promptsService: IPromptsService,
	) {
		super();

		this.registeredDecorationTypes();
		this.triggerInputEditorDecorationsUpdate();
		this._register(this.widget.inputEditor.onDidChangeModelContent(() => this.triggerInputEditorDecorationsUpdate()));
		this._register(this.widget.onDidChangeParsedInput(() => this.triggerInputEditorDecorationsUpdate()));
		this._register(this.widget.onDidChangeViewModel(() => {
			this.registerViewModelListeners();
			this.previouslyUsedAgents.clear();
			this.triggerInputEditorDecorationsUpdate();
		}));
		this._register(this.widget.onDidSubmitAgent((e) => {
			this.previouslyUsedAgents.add(agentAndCommandToKey(e.agent, e.slashCommand?.name));
		}));
		this._register(this.chatAgentService.onDidChangeAgents(() => this.triggerInputEditorDecorationsUpdate()));
		this._register(this.promptsService.onDidChangeSlashCommands(() => this.triggerInputEditorDecorationsUpdate()));
		this._register(autorun(reader => {
			// Watch for changes to the current mode and its properties
			const currentMode = this.widget.input.currentModeObs.read(reader);
			if (currentMode) {
				// Also watch the mode's description to react to any changes
				currentMode.description.read(reader);
			}
			// Trigger decoration update when mode or its properties change
			this.triggerInputEditorDecorationsUpdate();
		}));

		this.registerViewModelListeners();
	}

	private registerViewModelListeners(): void {
		this.viewModelDisposables.value = this.widget.viewModel?.onDidChange(e => {
			if (e?.kind === 'changePlaceholder' || e?.kind === 'initialize') {
				this.triggerInputEditorDecorationsUpdate();
			}
		});
	}

	private registeredDecorationTypes() {
		this._register(this.codeEditorService.registerDecorationType(decorationDescription, placeholderDecorationType, {}));
		this._register(this.codeEditorService.registerDecorationType(decorationDescription, slashCommandTextDecorationType, {
			color: themeColorFromId(chatSlashCommandForeground),
			backgroundColor: themeColorFromId(chatSlashCommandBackground),
			borderRadius: '3px'
		}));
		this._register(this.codeEditorService.registerDecorationType(decorationDescription, variableTextDecorationType, {
			color: themeColorFromId(chatSlashCommandForeground),
			backgroundColor: themeColorFromId(chatSlashCommandBackground),
			borderRadius: '3px'
		}));
		this._register(this.codeEditorService.registerDecorationType(decorationDescription, dynamicVariableDecorationType, {
			color: themeColorFromId(chatSlashCommandForeground),
			backgroundColor: themeColorFromId(chatSlashCommandBackground),
			borderRadius: '3px',
			rangeBehavior: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
		}));
	}

	private getPlaceholderColor(): string | undefined {
		const theme = this.themeService.getColorTheme();
		const transparentForeground = theme.getColor(inputPlaceholderForeground);
		return transparentForeground?.toString();
	}

	private triggerInputEditorDecorationsUpdate(): void {
		// update placeholder decorations immediately, in sync
		this.updateInputPlaceholderDecoration();

		// with a delay, update the rest of the decorations
		this.updateThrottle.trigger(token => this.updateAsyncInputEditorDecorations(token));
	}

	private updateInputPlaceholderDecoration(): void {
		const inputValue = this.widget.inputEditor.getValue();

		const viewModel = this.widget.viewModel;
		if (!viewModel) {
			this.updateAriaPlaceholder(undefined);
			return;
		}

		if (!inputValue) {
			const mode = this.widget.input.currentModeObs.get();
			const placeholder = mode.argumentHint?.get() ?? mode.description.get() ?? '';
			const displayPlaceholder = viewModel.inputPlaceholder || placeholder;

			const decoration: IDecorationOptions[] = [
				{
					range: {
						startLineNumber: 1,
						endLineNumber: 1,
						startColumn: 1,
						endColumn: 1000
					},
					renderOptions: {
						after: {
							contentText: displayPlaceholder,
							color: this.getPlaceholderColor()
						}
					}
				}
			];
			this.updateAriaPlaceholder(displayPlaceholder || undefined);
			this.widget.inputEditor.setDecorationsByType(decorationDescription, placeholderDecorationType, decoration);
			return;
		}

		this.updateAriaPlaceholder(undefined);

		const parsedRequest = this.widget.parsedInput.parts;

		let placeholderDecoration: IDecorationOptions[] | undefined;
		const agentPart = parsedRequest.find((p): p is ChatRequestAgentPart => p instanceof ChatRequestAgentPart);
		const agentSubcommandPart = parsedRequest.find((p): p is ChatRequestAgentSubcommandPart => p instanceof ChatRequestAgentSubcommandPart);

		const onlyAgentAndWhitespace = agentPart && parsedRequest.every(p => p instanceof ChatRequestTextPart && !p.text.trim().length || p instanceof ChatRequestAgentPart);
		if (onlyAgentAndWhitespace) {
			// Agent reference with no other text - show the placeholder
			const isFollowupSlashCommand = this.previouslyUsedAgents.has(agentAndCommandToKey(agentPart.agent, undefined));
			const shouldRenderFollowupPlaceholder = isFollowupSlashCommand && agentPart.agent.metadata.followupPlaceholder;
			if (agentPart.agent.description && exactlyOneSpaceAfterPart(parsedRequest, agentPart)) {
				placeholderDecoration = [{
					range: getRangeForPlaceholder(agentPart),
					renderOptions: {
						after: {
							contentText: shouldRenderFollowupPlaceholder ? agentPart.agent.metadata.followupPlaceholder : agentPart.agent.description,
							color: this.getPlaceholderColor(),
						}
					}
				}];
			}
		}

		const onlyAgentAndAgentCommandAndWhitespace = agentPart && agentSubcommandPart && parsedRequest.every(p => p instanceof ChatRequestTextPart && !p.text.trim().length || p instanceof ChatRequestAgentPart || p instanceof ChatRequestAgentSubcommandPart);
		if (onlyAgentAndAgentCommandAndWhitespace) {
			// Agent reference and subcommand with no other text - show the placeholder
			const isFollowupSlashCommand = this.previouslyUsedAgents.has(agentAndCommandToKey(agentPart.agent, agentSubcommandPart.command.name));
			const shouldRenderFollowupPlaceholder = isFollowupSlashCommand && agentSubcommandPart.command.followupPlaceholder;
			if (agentSubcommandPart?.command.description && exactlyOneSpaceAfterPart(parsedRequest, agentSubcommandPart)) {
				placeholderDecoration = [{
					range: getRangeForPlaceholder(agentSubcommandPart),
					renderOptions: {
						after: {
							contentText: shouldRenderFollowupPlaceholder ? agentSubcommandPart.command.followupPlaceholder : agentSubcommandPart.command.description,
							color: this.getPlaceholderColor(),
						}
					}
				}];
			}
		}

		const onlyAgentCommandAndWhitespace = agentSubcommandPart && parsedRequest.every(p => p instanceof ChatRequestTextPart && !p.text.trim().length || p instanceof ChatRequestAgentSubcommandPart);
		if (onlyAgentCommandAndWhitespace) {
			// Agent subcommand with no other text - show the placeholder
			if (agentSubcommandPart?.command.description && exactlyOneSpaceAfterPart(parsedRequest, agentSubcommandPart)) {
				placeholderDecoration = [{
					range: getRangeForPlaceholder(agentSubcommandPart),
					renderOptions: {
						after: {
							contentText: agentSubcommandPart.command.description,
							color: this.getPlaceholderColor(),
						}
					}
				}];
			}
		}
		this.widget.inputEditor.setDecorationsByType(decorationDescription, placeholderDecorationType, placeholderDecoration ?? []);
	}

	private async updateAsyncInputEditorDecorations(token: CancellationToken): Promise<void> {

		const parsedRequest = this.widget.parsedInput.parts;

		const agentPart = parsedRequest.find((p): p is ChatRequestAgentPart => p instanceof ChatRequestAgentPart);
		const agentSubcommandPart = parsedRequest.find((p): p is ChatRequestAgentSubcommandPart => p instanceof ChatRequestAgentSubcommandPart);
		const slashCommandPart = parsedRequest.find((p): p is ChatRequestSlashCommandPart => p instanceof ChatRequestSlashCommandPart);
		const slashPromptPart = parsedRequest.find((p): p is ChatRequestSlashPromptPart => p instanceof ChatRequestSlashPromptPart);

		// first, fetch all async context
		const promptSlashCommand = slashPromptPart ? await this.promptsService.resolvePromptSlashCommand(slashPromptPart.name, token) : undefined;
		if (token.isCancellationRequested) {
			// a new update came in while we were waiting
			return;
		}

		if (slashPromptPart && promptSlashCommand) {
			const onlyPromptCommandAndWhitespace = slashPromptPart && parsedRequest.every(isWhitespaceOrPromptPart);
			if (onlyPromptCommandAndWhitespace && exactlyOneSpaceAfterPart(parsedRequest, slashPromptPart) && promptSlashCommand) {
				const description = promptSlashCommand.argumentHint ?? promptSlashCommand.description;
				if (description) {
					this.widget.inputEditor.setDecorationsByType(decorationDescription, placeholderDecorationType, [{
						range: getRangeForPlaceholder(slashPromptPart),
						renderOptions: {
							after: {
								contentText: description,
								color: this.getPlaceholderColor(),
							}
						}
					}]);
				}
			}
		}

		const textDecorations: IDecorationOptions[] | undefined = [];
		if (agentPart) {
			textDecorations.push({ range: agentPart.editorRange });
		}
		if (agentSubcommandPart) {
			textDecorations.push({ range: agentSubcommandPart.editorRange, hoverMessage: new MarkdownString(agentSubcommandPart.command.description) });
		}

		if (slashCommandPart) {
			textDecorations.push({ range: slashCommandPart.editorRange });
		}

		if (slashPromptPart && promptSlashCommand) {
			textDecorations.push({ range: slashPromptPart.editorRange });
		}

		this.widget.inputEditor.setDecorationsByType(decorationDescription, slashCommandTextDecorationType, textDecorations);

		const varDecorations: IDecorationOptions[] = [];
		const toolParts = parsedRequest.filter((p): p is ChatRequestToolPart => p instanceof ChatRequestToolPart || p instanceof ChatRequestToolSetPart);
		for (const tool of toolParts) {
			varDecorations.push({ range: tool.editorRange });
		}

		const dynamicVariableParts = parsedRequest.filter((p): p is ChatRequestDynamicVariablePart => p instanceof ChatRequestDynamicVariablePart);

		const isEditingPreviousRequest = !!this.widget.viewModel?.editing;
		if (isEditingPreviousRequest) {
			for (const variable of dynamicVariableParts) {
				varDecorations.push({ range: variable.editorRange, hoverMessage: URI.isUri(variable.data) ? new MarkdownString(this.labelService.getUriLabel(variable.data, { relative: true })) : undefined });
			}
		}

		this.widget.inputEditor.setDecorationsByType(decorationDescription, variableTextDecorationType, varDecorations);
	}

	private updateAriaPlaceholder(value: string | undefined): void {
		const nativeEditContext = NativeEditContextRegistry.get(this.widget.inputEditor.getId());
		if (nativeEditContext) {
			const domNode = nativeEditContext.domNode.domNode;
			if (value && value.trim().length) {
				domNode.setAttribute('aria-placeholder', value);
			} else {
				domNode.removeAttribute('aria-placeholder');
			}
		} else {
			const textAreaEditContext = TextAreaEditContextRegistry.get(this.widget.inputEditor.getId());
			if (textAreaEditContext) {
				const textArea = textAreaEditContext.textArea.domNode;
				if (value && value.trim().length) {
					textArea.setAttribute('aria-placeholder', value);
				} else {
					textArea.removeAttribute('aria-placeholder');
				}
			}
		}
	}
}

class InputEditorSlashCommandMode extends Disposable {
	public readonly id = 'InputEditorSlashCommandMode';

	constructor(
		private readonly widget: IChatWidget
	) {
		super();
		this._register(this.widget.onDidChangeAgent(e => {
			if (e.slashCommand && e.slashCommand.isSticky || !e.slashCommand && e.agent.metadata.isSticky) {
				this.repopulateAgentCommand(e.agent, e.slashCommand);
			}
		}));
		this._register(this.widget.onDidSubmitAgent(e => {
			this.repopulateAgentCommand(e.agent, e.slashCommand);
		}));
	}

	private async repopulateAgentCommand(agent: IChatAgentData, slashCommand: IChatAgentCommand | undefined) {
		// Make sure we don't repopulate if the user already has something in the input
		if (this.widget.inputEditor.getValue().trim()) {
			return;
		}

		let value: string | undefined;
		if (slashCommand && slashCommand.isSticky) {
			value = `${chatAgentLeader}${agent.name} ${chatSubcommandLeader}${slashCommand.name} `;
		} else if (agent.metadata.isSticky) {
			value = `${chatAgentLeader}${agent.name} `;
		}

		if (value) {
			this.widget.inputEditor.setValue(value);
			this.widget.inputEditor.setPosition({ lineNumber: 1, column: value.length + 1 });
		}
	}
}

ChatWidget.CONTRIBS.push(InputEditorDecorations, InputEditorSlashCommandMode);

class ChatTokenDeleter extends Disposable {

	public readonly id = 'chatTokenDeleter';

	constructor(
		private readonly widget: IChatWidget,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		const parser = this.instantiationService.createInstance(ChatRequestParser);
		const inputValue = this.widget.inputEditor.getValue();
		let previousInputValue: string | undefined;
		let previousSelectedAgent: IChatAgentData | undefined;

		// A simple heuristic to delete the previous token when the user presses backspace.
		// The sophisticated way to do this would be to have a parse tree that can be updated incrementally.
		this._register(this.widget.inputEditor.onDidChangeModelContent(e => {
			if (!previousInputValue) {
				previousInputValue = inputValue;
				previousSelectedAgent = this.widget.lastSelectedAgent;
			}

			// Don't try to handle multi-cursor edits right now
			const change = e.changes[0];

			// If this was a simple delete, try to find out whether it was inside a token
			if (!change.text && this.widget.viewModel) {
				const previousParsedValue = parser.parseChatRequest(this.widget.viewModel.sessionResource, previousInputValue, widget.location, { selectedAgent: previousSelectedAgent, mode: this.widget.input.currentModeKind });

				// For dynamic variables, this has to happen in ChatDynamicVariableModel with the other bookkeeping
				const deletableTokens = previousParsedValue.parts.filter(p => p instanceof ChatRequestAgentPart || p instanceof ChatRequestAgentSubcommandPart || p instanceof ChatRequestSlashCommandPart || p instanceof ChatRequestSlashPromptPart || p instanceof ChatRequestToolPart);
				deletableTokens.forEach(token => {
					const deletedRangeOfToken = Range.intersectRanges(token.editorRange, change.range);
					// Part of this token was deleted, or the space after it was deleted, and the deletion range doesn't go off the front of the token, for simpler math
					if (deletedRangeOfToken && Range.compareRangesUsingStarts(token.editorRange, change.range) < 0) {
						// Range.intersectRanges returns an empty range when the deletion happens *exactly* at a boundary.
						// In that case, only treat this as a token-delete when the deleted character was a space.
						if (previousInputValue && Range.isEmpty(deletedRangeOfToken)) {
							const deletedText = previousInputValue.substring(change.rangeOffset, change.rangeOffset + change.rangeLength);
							if (deletedText !== ' ') {
								return;
							}
						}

						// Assume single line tokens
						const length = deletedRangeOfToken.endColumn - deletedRangeOfToken.startColumn;
						const rangeToDelete = new Range(token.editorRange.startLineNumber, token.editorRange.startColumn, token.editorRange.endLineNumber, token.editorRange.endColumn - length);
						this.widget.inputEditor.executeEdits(this.id, [{
							range: rangeToDelete,
							text: '',
						}]);
						this.widget.refreshParsedInput();
					}
				});
			}

			previousInputValue = this.widget.inputEditor.getValue();
			previousSelectedAgent = this.widget.lastSelectedAgent;
		}));
	}
}
ChatWidget.CONTRIBS.push(ChatTokenDeleter);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatInputEditorHover.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatInputEditorHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IModelDecoration } from '../../../../../editor/common/model.js';
import { HoverAnchor, HoverAnchorType, HoverParticipantRegistry, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverPart, IRenderedHoverParts, RenderedHoverParts } from '../../../../../editor/contrib/hover/browser/hoverTypes.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatWidgetService } from '../chat.js';
import { ChatAgentHover, getChatAgentHoverOptions } from '../chatAgentHover.js';
import { ChatEditorHoverWrapper } from './editorHoverWrapper.js';
import { IChatAgentData } from '../../common/chatAgents.js';
import { extractAgentAndCommand } from '../../common/chatParserTypes.js';
import * as nls from '../../../../../nls.js';

export class ChatAgentHoverParticipant implements IEditorHoverParticipant<ChatAgentHoverPart> {

	public readonly hoverOrdinal: number = 1;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@ICommandService private readonly commandService: ICommandService,
	) { }

	public computeSync(anchor: HoverAnchor, _lineDecorations: IModelDecoration[]): ChatAgentHoverPart[] {
		if (!this.editor.hasModel()) {
			return [];
		}

		const widget = this.chatWidgetService.getWidgetByInputUri(this.editor.getModel().uri);
		if (!widget) {
			return [];
		}

		const { agentPart } = extractAgentAndCommand(widget.parsedInput);
		if (!agentPart) {
			return [];
		}

		if (Range.containsPosition(agentPart.editorRange, anchor.range.getStartPosition())) {
			return [new ChatAgentHoverPart(this, Range.lift(agentPart.editorRange), agentPart.agent)];
		}

		return [];
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: ChatAgentHoverPart[]): IRenderedHoverParts<ChatAgentHoverPart> {
		if (!hoverParts.length) {
			return new RenderedHoverParts([]);
		}

		const disposables = new DisposableStore();
		const hover = disposables.add(this.instantiationService.createInstance(ChatAgentHover));
		disposables.add(hover.onDidChangeContents(() => context.onContentsChanged()));
		const hoverPart = hoverParts[0];
		const agent = hoverPart.agent;
		hover.setAgent(agent.id);

		const actions = getChatAgentHoverOptions(() => agent, this.commandService).actions;
		const wrapper = this.instantiationService.createInstance(ChatEditorHoverWrapper, hover.domNode, actions);
		const wrapperNode = wrapper.domNode;
		context.fragment.appendChild(wrapperNode);
		const renderedHoverPart: IRenderedHoverPart<ChatAgentHoverPart> = {
			hoverPart,
			hoverElement: wrapperNode,
			dispose() { disposables.dispose(); }
		};
		return new RenderedHoverParts([renderedHoverPart]);
	}

	public getAccessibleContent(hoverPart: ChatAgentHoverPart): string {
		return nls.localize('hoverAccessibilityChatAgent', 'There is a chat agent hover part here.');

	}
}

export class ChatAgentHoverPart implements IHoverPart {

	constructor(
		public readonly owner: IEditorHoverParticipant<ChatAgentHoverPart>,
		public readonly range: Range,
		public readonly agent: IChatAgentData
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}
}

HoverParticipantRegistry.register(ChatAgentHoverParticipant);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatInputRelatedFilesContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatInputRelatedFilesContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../../../base/common/map.js';
import { autorun } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IChatEditingService, IChatEditingSession } from '../../common/chatEditingService.js';
import { IChatWidget, IChatWidgetService } from '../chat.js';

export class ChatRelatedFilesContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'chat.relatedFilesWorkingSet';

	private readonly chatEditingSessionDisposables = new ResourceMap<DisposableStore>();
	private _currentRelatedFilesRetrievalOperation: Promise<void> | undefined;

	constructor(
		@IChatEditingService private readonly chatEditingService: IChatEditingService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
	) {
		super();

		this._register(autorun((reader) => {
			const sessions = this.chatEditingService.editingSessionsObs.read(reader);
			sessions.forEach(session => {
				const widget = this.chatWidgetService.getWidgetBySessionResource(session.chatSessionResource);
				if (widget && !this.chatEditingSessionDisposables.has(session.chatSessionResource)) {
					this._handleNewEditingSession(session, widget);
				}
			});
		}));
	}

	private _updateRelatedFileSuggestions(currentEditingSession: IChatEditingSession, widget: IChatWidget) {
		if (this._currentRelatedFilesRetrievalOperation) {
			return;
		}

		const workingSetEntries = currentEditingSession.entries.get();
		if (workingSetEntries.length > 0 || widget.attachmentModel.fileAttachments.length === 0) {
			// Do this only for the initial working set state
			return;
		}

		this._currentRelatedFilesRetrievalOperation = this.chatEditingService.getRelatedFiles(currentEditingSession.chatSessionResource, widget.getInput(), widget.attachmentModel.fileAttachments, CancellationToken.None)
			.then((files) => {
				if (!files?.length || !widget.viewModel || !widget.input.relatedFiles) {
					return;
				}

				const currentEditingSession = this.chatEditingService.getEditingSession(widget.viewModel.sessionResource);
				if (!currentEditingSession || currentEditingSession.entries.get().length) {
					return; // Might have disposed while we were calculating
				}

				const existingFiles = new ResourceSet([...widget.attachmentModel.fileAttachments, ...widget.input.relatedFiles.removedFiles]);
				if (!existingFiles.size) {
					return;
				}

				// Pick up to 2 related files
				const newSuggestions = new ResourceMap<string>();
				for (const group of files) {
					for (const file of group.files) {
						if (newSuggestions.size >= 2) {
							break;
						}
						if (existingFiles.has(file.uri)) {
							continue;
						}
						newSuggestions.set(file.uri, localize('relatedFile', "{0} (Suggested)", file.description));
						existingFiles.add(file.uri);
					}
				}

				widget.input.relatedFiles.value = [...newSuggestions.entries()].map(([uri, description]) => ({ uri, description }));
			})
			.finally(() => {
				this._currentRelatedFilesRetrievalOperation = undefined;
			});

	}

	private _handleNewEditingSession(currentEditingSession: IChatEditingSession, widget: IChatWidget) {
		const disposableStore = new DisposableStore();
		disposableStore.add(currentEditingSession.onDidDispose(() => {
			disposableStore.clear();
		}));
		this._updateRelatedFileSuggestions(currentEditingSession, widget);
		const onDebouncedType = Event.debounce(widget.inputEditor.onDidChangeModelContent, () => null, 3000);
		disposableStore.add(onDebouncedType(() => {
			this._updateRelatedFileSuggestions(currentEditingSession, widget);
		}));
		disposableStore.add(widget.attachmentModel.onDidChange(() => {
			this._updateRelatedFileSuggestions(currentEditingSession, widget);
		}));
		disposableStore.add(currentEditingSession.onDidDispose(() => {
			disposableStore.dispose();
		}));
		disposableStore.add(widget.onDidAcceptInput(() => {
			widget.input.relatedFiles?.clear();
			this._updateRelatedFileSuggestions(currentEditingSession, widget);
		}));
		this.chatEditingSessionDisposables.set(currentEditingSession.chatSessionResource, disposableStore);
	}

	override dispose() {
		for (const store of this.chatEditingSessionDisposables.values()) {
			store.dispose();
		}
		super.dispose();
	}
}

export interface IChatRelatedFile {
	uri: URI;
	description: string;
}
export class ChatRelatedFiles extends Disposable {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _removedFiles = new ResourceSet();
	get removedFiles() {
		return this._removedFiles;
	}

	private _value: IChatRelatedFile[] = [];
	get value() {
		return this._value;
	}

	set value(value: IChatRelatedFile[]) {
		this._value = value;
		this._onDidChange.fire();
	}

	remove(uri: URI) {
		this._value = this._value.filter(file => !isEqual(file.uri, uri));
		this._removedFiles.add(uri);
		this._onDidChange.fire();
	}

	clearRemovedFiles() {
		this._removedFiles.clear();
	}

	clear() {
		this._value = [];
		this._removedFiles.clear();
		this._onDidChange.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/chatScreenshotContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/chatScreenshotContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { localize } from '../../../../../nls.js';
import { IChatRequestVariableEntry } from '../../common/chatVariableEntries.js';

export const ScreenshotVariableId = 'screenshot-focused-window';

export function convertBufferToScreenshotVariable(buffer: VSBuffer): IChatRequestVariableEntry {
	return {
		id: ScreenshotVariableId,
		name: localize('screenshot', 'Screenshot'),
		value: buffer.buffer,
		kind: 'image'
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/editorHoverWrapper.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/editorHoverWrapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/editorHoverWrapper.css';
import * as dom from '../../../../../base/browser/dom.js';
import { IHoverAction } from '../../../../../base/browser/ui/hover/hover.js';
import { HoverAction } from '../../../../../base/browser/ui/hover/hoverWidget.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';

const $ = dom.$;
const h = dom.h;

/**
 * This borrows some of HoverWidget so that a chat editor hover can be rendered in the same way as a workbench hover.
 * Maybe it can be reusable in a generic way.
 */
export class ChatEditorHoverWrapper {
	public readonly domNode: HTMLElement;

	constructor(
		hoverContentElement: HTMLElement,
		actions: IHoverAction[] | undefined,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		const hoverElement = h(
			'.chat-editor-hover-wrapper@root',
			[h('.chat-editor-hover-wrapper-content@content')]);
		this.domNode = hoverElement.root;
		hoverElement.content.appendChild(hoverContentElement);

		if (actions && actions.length > 0) {
			const statusBarElement = $('.hover-row.status-bar');
			const actionsElement = $('.actions');
			actions.forEach(action => {
				const keybinding = this.keybindingService.lookupKeybinding(action.commandId);
				const keybindingLabel = keybinding ? keybinding.getLabel() : null;
				HoverAction.render(actionsElement, {
					label: action.label,
					commandId: action.commandId,
					run: e => {
						action.run(e);
					},
					iconClass: action.iconClass
				}, keybindingLabel);
			});
			statusBarElement.appendChild(actionsElement);
			this.domNode.appendChild(statusBarElement);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/contrib/media/editorHoverWrapper.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/contrib/media/editorHoverWrapper.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-editor-hover-wrapper-content {
	padding: 2px 8px;
}
```

--------------------------------------------------------------------------------

````

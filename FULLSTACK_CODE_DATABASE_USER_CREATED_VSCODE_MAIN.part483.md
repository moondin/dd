---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 483
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 483 of 552)

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

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, Dimension, addDisposableListener, append, clearNode, reset } from '../../../../base/browser/dom.js';
import { renderFormattedText } from '../../../../base/browser/formattedTextRenderer.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { coalesce, equals } from '../../../../base/common/arrays.js';
import { Delayer, Throttler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { splitRecentLabel } from '../../../../base/common/labels.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ILink, LinkedText } from '../../../../base/common/linkedText.js';
import { parse } from '../../../../base/common/marshalling.js';
import { Schemas, matchesScheme } from '../../../../base/common/network.js';
import { OS } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import './media/gettingStarted.css';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';
import { firstSessionDateStorageKey, ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { getTelemetryLevel } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { defaultButtonStyles, defaultKeybindingLabelStyles, defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IWindowOpenable } from '../../../../platform/window/common/window.js';
import { IWorkspaceContextService, UNKNOWN_EMPTY_WINDOW_WORKSPACE } from '../../../../platform/workspace/common/workspace.js';
import { IRecentFolder, IRecentWorkspace, IRecentlyOpened, IWorkspacesService, isRecentFolder, isRecentWorkspace } from '../../../../platform/workspaces/common/workspaces.js';
import { OpenRecentAction } from '../../../browser/actions/windowActions.js';
import { OpenFileFolderAction, OpenFolderAction, OpenFolderViaWorkspaceAction } from '../../../browser/actions/workspaceActions.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { WorkbenchStateContext } from '../../../common/contextkeys.js';
import { IEditorOpenContext, IEditorSerializer } from '../../../common/editor.js';
import { IWebviewElement, IWebviewService } from '../../webview/browser/webview.js';
import './gettingStartedColors.js';
import { GettingStartedDetailsRenderer } from './gettingStartedDetailsRenderer.js';
import { gettingStartedCheckedCodicon, gettingStartedUncheckedCodicon } from './gettingStartedIcons.js';
import { GettingStartedEditorOptions, GettingStartedInput } from './gettingStartedInput.js';
import { IResolvedWalkthrough, IResolvedWalkthroughStep, IWalkthroughsService, hiddenEntriesConfigurationKey, parseDescription } from './gettingStartedService.js';
import { RestoreWalkthroughsConfigurationValue, restoreWalkthroughsConfigurationKey } from './startupPage.js';
import { startEntries } from '../common/gettingStartedContent.js';
import { GroupsOrder, IEditorGroup, IEditorGroupsService, preferredSideBySideGroupDirection } from '../../../services/editor/common/editorGroupsService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';
import { GettingStartedIndexList } from './gettingStartedList.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibleViewAction } from '../../accessibility/browser/accessibleViewActions.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';

const SLIDE_TRANSITION_TIME_MS = 250;
const configurationKey = 'workbench.startupEditor';

export const allWalkthroughsHiddenContext = new RawContextKey<boolean>('allWalkthroughsHidden', false);
export const inWelcomeContext = new RawContextKey<boolean>('inWelcome', false);

export interface IWelcomePageStartEntry {
	id: string;
	title: string;
	description: string;
	command: string;
	order: number;
	icon: { type: 'icon'; icon: ThemeIcon };
	when: ContextKeyExpression;
}

const parsedStartEntries: IWelcomePageStartEntry[] = startEntries.map((e, i) => ({
	command: e.content.command,
	description: e.description,
	icon: { type: 'icon', icon: e.icon },
	id: e.id,
	order: i,
	title: e.title,
	when: ContextKeyExpr.deserialize(e.when) ?? ContextKeyExpr.true()
}));

type GettingStartedActionClassification = {
	command: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The command being executed on the getting started page.' };
	walkthroughId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The walkthrough which the command is in' };
	argument: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The arguments being passed to the command' };
	owner: 'lramos15';
	comment: 'Help understand what actions are most commonly taken on the getting started page';
};

type GettingStartedActionEvent = {
	command: string;
	walkthroughId: string | undefined;
	argument: string | undefined;
};

type RecentEntry = (IRecentFolder | IRecentWorkspace) & { id: string };

const REDUCED_MOTION_KEY = 'workbench.welcomePage.preferReducedMotion';
export class GettingStartedPage extends EditorPane {

	public static readonly ID = 'gettingStartedPage';

	private inProgressScroll = Promise.resolve();

	private readonly dispatchListeners: DisposableStore = new DisposableStore();
	private readonly stepDisposables: DisposableStore = new DisposableStore();
	private readonly detailsPageDisposables: DisposableStore = new DisposableStore();
	private readonly mediaDisposables: DisposableStore = new DisposableStore();

	// Ensure that the these are initialized before use.
	// Currently initialized before use in buildCategoriesSlide and scrollToCategory
	private recentlyOpened!: Promise<IRecentlyOpened>;
	private gettingStartedCategories!: IResolvedWalkthrough[];

	private currentWalkthrough: IResolvedWalkthrough | undefined;
	private prevWalkthrough: IResolvedWalkthrough | undefined;

	private categoriesPageScrollbar: DomScrollableElement | undefined;
	private detailsPageScrollbar: DomScrollableElement | undefined;

	private detailsScrollbar: DomScrollableElement | undefined;

	private buildSlideThrottle: Throttler = new Throttler();

	private container: HTMLElement;

	private contextService: IContextKeyService;

	private recentlyOpenedList?: GettingStartedIndexList<RecentEntry>;
	private startList?: GettingStartedIndexList<IWelcomePageStartEntry>;
	private gettingStartedList?: GettingStartedIndexList<IResolvedWalkthrough>;

	private stepsSlide!: HTMLElement;
	private categoriesSlide!: HTMLElement;
	private stepsContent!: HTMLElement;
	private stepMediaComponent!: HTMLElement;
	private webview!: IWebviewElement;

	private layoutMarkdown: (() => void) | undefined;

	private detailsRenderer: GettingStartedDetailsRenderer;

	private readonly categoriesSlideDisposables: DisposableStore;
	private showFeaturedWalkthrough = true;

	get editorInput(): GettingStartedInput | undefined {
		return this._input as GettingStartedInput | undefined;
	}

	constructor(
		group: IEditorGroup,
		@ICommandService private readonly commandService: ICommandService,
		@IProductService private readonly productService: IProductService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IWalkthroughsService private readonly gettingStartedService: IWalkthroughsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IFileService private readonly fileService: IFileService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IWorkbenchThemeService protected override readonly themeService: IWorkbenchThemeService,
		@IStorageService private storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IEditorGroupsService private readonly groupsService: IEditorGroupsService,
		@IContextKeyService contextService: IContextKeyService,
		@IQuickInputService private quickInputService: IQuickInputService,
		@IWorkspacesService private readonly workspacesService: IWorkspacesService,
		@ILabelService private readonly labelService: ILabelService,
		@IHostService private readonly hostService: IHostService,
		@IWebviewService private readonly webviewService: IWebviewService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {

		super(GettingStartedPage.ID, group, telemetryService, themeService, storageService);

		this.container = $('.gettingStartedContainer',
			{
				role: 'document',
				tabindex: 0,
				'aria-label': localize('welcomeAriaLabel', "Overview of how to get up to speed with your editor.")
			});
		this.stepMediaComponent = $('.getting-started-media');
		this.stepMediaComponent.id = generateUuid();

		this.categoriesSlideDisposables = this._register(new DisposableStore());

		this.detailsRenderer = new GettingStartedDetailsRenderer(this.fileService, this.notificationService, this.extensionService, this.languageService);

		this.contextService = this._register(contextService.createScoped(this.container));
		inWelcomeContext.bindTo(this.contextService).set(true);

		this.gettingStartedCategories = this.gettingStartedService.getWalkthroughs();

		this._register(this.dispatchListeners);
		this.buildSlideThrottle = new Throttler();

		const rerender = () => {
			this.gettingStartedCategories = this.gettingStartedService.getWalkthroughs();
			if (this.currentWalkthrough) {
				const existingSteps = this.currentWalkthrough.steps.map(step => step.id);
				const newCategory = this.gettingStartedCategories.find(category => this.currentWalkthrough?.id === category.id);
				if (newCategory) {
					const newSteps = newCategory.steps.map(step => step.id);
					if (!equals(newSteps, existingSteps)) {
						this.buildSlideThrottle.queue(() => this.buildCategoriesSlide());
					}
				}
			} else {
				this.buildSlideThrottle.queue(() => this.buildCategoriesSlide());
			}
		};

		this._register(this.gettingStartedService.onDidAddWalkthrough(rerender));
		this._register(this.gettingStartedService.onDidRemoveWalkthrough(rerender));

		this.recentlyOpened = this.workspacesService.getRecentlyOpened();
		this._register(workspacesService.onDidChangeRecentlyOpened(() => {
			this.recentlyOpened = workspacesService.getRecentlyOpened();
			this.refreshRecentlyOpened();
		}));

		this._register(this.gettingStartedService.onDidChangeWalkthrough(category => {
			const ourCategory = this.gettingStartedCategories.find(c => c.id === category.id);
			if (!ourCategory) { return; }

			ourCategory.title = category.title;
			ourCategory.description = category.description;

			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelectorAll<HTMLDivElement>(`[x-category-title-for="${category.id}"]`).forEach(step => (step as HTMLDivElement).innerText = ourCategory.title);
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelectorAll<HTMLDivElement>(`[x-category-description-for="${category.id}"]`).forEach(step => (step as HTMLDivElement).innerText = ourCategory.description);
		}));

		this._register(this.gettingStartedService.onDidProgressStep(step => {
			const category = this.gettingStartedCategories.find(c => c.id === step.category);
			if (!category) { throw Error('Could not find category with ID: ' + step.category); }
			const ourStep = category.steps.find(_step => _step.id === step.id);
			if (!ourStep) {
				throw Error('Could not find step with ID: ' + step.id);
			}

			const stats = this.getWalkthroughCompletionStats(category);
			if (!ourStep.done && stats.stepsComplete === stats.stepsTotal - 1) {
				this.hideCategory(category.id);
			}

			this._register(this.configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(REDUCED_MOTION_KEY)) {
					this.container.classList.toggle('animatable', this.shouldAnimate());
				}
			}));
			ourStep.done = step.done;

			if (category.id === this.currentWalkthrough?.id) {
				// eslint-disable-next-line no-restricted-syntax
				const badgeelements = assertReturnsDefined(this.window.document.querySelectorAll(`[data-done-step-id="${step.id}"]`));
				badgeelements.forEach(badgeelement => {
					if (step.done) {
						badgeelement.setAttribute('aria-checked', 'true');
						badgeelement.parentElement?.setAttribute('aria-checked', 'true');
						badgeelement.classList.remove(...ThemeIcon.asClassNameArray(gettingStartedUncheckedCodicon));
						badgeelement.classList.add('complete', ...ThemeIcon.asClassNameArray(gettingStartedCheckedCodicon));
						badgeelement.setAttribute('aria-label', localize('stepDone', "Checkbox for Step {0}: Completed", step.title));
					}
					else {
						badgeelement.setAttribute('aria-checked', 'false');
						badgeelement.parentElement?.setAttribute('aria-checked', 'false');
						badgeelement.classList.remove('complete', ...ThemeIcon.asClassNameArray(gettingStartedCheckedCodicon));
						badgeelement.classList.add(...ThemeIcon.asClassNameArray(gettingStartedUncheckedCodicon));
						badgeelement.setAttribute('aria-label', localize('stepNotDone', "Checkbox for Step {0}: Not completed", step.title));
					}
				});
			}
			this.updateCategoryProgress();
		}));

		this._register(this.storageService.onWillSaveState((e) => {
			if (e.reason !== WillSaveStateReason.SHUTDOWN) {
				return;
			}

			if (this.workspaceContextService.getWorkspace().folders.length !== 0) {
				return;
			}

			if (!this.editorInput || !this.currentWalkthrough || !this.editorInput.selectedCategory || !this.editorInput.selectedStep) {
				return;
			}

			const editorPane = this.groupsService.activeGroup.activeEditorPane;
			if (!(editorPane instanceof GettingStartedPage)) {
				return;
			}

			// Save the state of the walkthrough so we can restore it on reload
			const restoreData: RestoreWalkthroughsConfigurationValue = { folder: UNKNOWN_EMPTY_WINDOW_WORKSPACE.id, category: this.editorInput.selectedCategory, step: this.editorInput.selectedStep };
			this.storageService.store(
				restoreWalkthroughsConfigurationKey,
				JSON.stringify(restoreData),
				StorageScope.PROFILE, StorageTarget.MACHINE);
		}));
	}

	// remove when 'workbench.welcomePage.preferReducedMotion' deprecated
	private shouldAnimate() {
		if (this.configurationService.getValue(REDUCED_MOTION_KEY)) {
			return false;
		}
		if (this.accessibilityService.isMotionReduced()) {
			return false;
		}
		return true;
	}

	private getWalkthroughCompletionStats(walkthrough: IResolvedWalkthrough): { stepsComplete: number; stepsTotal: number } {
		const activeSteps = walkthrough.steps.filter(s => this.contextService.contextMatchesRules(s.when));
		return {
			stepsComplete: activeSteps.filter(s => s.done).length,
			stepsTotal: activeSteps.length,
		};
	}

	override async setInput(newInput: GettingStartedInput, options: GettingStartedEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken) {
		await super.setInput(newInput, options, context, token);
		const selectedCategory = options?.selectedCategory ?? newInput.selectedCategory;
		const selectedStep = options?.selectedStep ?? newInput.selectedStep;
		await this.applyInput({ ...options, selectedCategory, selectedStep });
	}

	override async setOptions(options: GettingStartedEditorOptions | undefined): Promise<void> {
		super.setOptions(options);
		if (!this.editorInput) {
			return;
		}

		if (
			this.editorInput.selectedCategory !== options?.selectedCategory ||
			this.editorInput.selectedStep !== options?.selectedStep
		) {
			await this.applyInput(options);
		}
	}

	private async applyInput(options: GettingStartedEditorOptions | undefined): Promise<void> {
		if (!this.editorInput) {
			return;
		}
		this.editorInput.showTelemetryNotice = options?.showTelemetryNotice ?? true;
		this.editorInput.selectedCategory = options?.selectedCategory;
		this.editorInput.selectedStep = options?.selectedStep;

		this.container.classList.remove('animatable');
		await this.buildCategoriesSlide();
		if (this.shouldAnimate()) {
			setTimeout(() => this.container.classList.add('animatable'), 0);
		}
	}

	async makeCategoryVisibleWhenAvailable(categoryID: string, stepId?: string) {
		this.scrollToCategory(categoryID, stepId);
	}

	private registerDispatchListeners() {
		this.dispatchListeners.clear();

		// eslint-disable-next-line no-restricted-syntax
		this.container.querySelectorAll('[x-dispatch]').forEach(element => {
			const dispatch = element.getAttribute('x-dispatch') ?? '';
			let command, argument;
			if (dispatch.startsWith('openLink:https')) {
				[command, argument] = ['openLink', dispatch.replace('openLink:', '')];
			} else {
				[command, argument] = dispatch.split(':');
			}
			if (command) {
				this.dispatchListeners.add(addDisposableListener(element, 'click', (e) => {
					e.stopPropagation();
					this.runDispatchCommand(command, argument);
				}));
				this.dispatchListeners.add(addDisposableListener(element, 'keyup', (e) => {
					const keyboardEvent = new StandardKeyboardEvent(e);
					e.stopPropagation();
					switch (keyboardEvent.keyCode) {
						case KeyCode.Enter:
						case KeyCode.Space:
							this.runDispatchCommand(command, argument);
							return;
					}
				}));
			}
		});
	}

	private async runDispatchCommand(command: string, argument: string) {
		this.commandService.executeCommand('workbench.action.keepEditor');
		this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command, argument, walkthroughId: this.currentWalkthrough?.id });
		switch (command) {
			case 'scrollPrev': {
				this.scrollPrev();
				break;
			}
			case 'skip': {
				this.runSkip();
				break;
			}
			case 'showMoreRecents': {
				this.commandService.executeCommand(OpenRecentAction.ID);
				break;
			}
			case 'seeAllWalkthroughs': {
				await this.openWalkthroughSelector();
				break;
			}
			case 'openFolder': {
				if (this.contextService.contextMatchesRules(ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('workspace')))) {
					this.commandService.executeCommand(OpenFolderViaWorkspaceAction.ID);
				} else {
					this.commandService.executeCommand('workbench.action.files.openFolder');
				}
				break;
			}
			case 'selectCategory': {
				this.scrollToCategory(argument);
				this.gettingStartedService.markWalkthroughOpened(argument);
				break;
			}
			case 'selectStartEntry': {
				const selected = startEntries.find(e => e.id === argument);
				if (selected) {
					this.runStepCommand(selected.content.command);
				} else {
					throw Error('could not find start entry with id: ' + argument);
				}
				break;
			}
			case 'hideCategory': {
				this.hideCategory(argument);
				break;
			}
			// Use selectTask over selectStep to keep telemetry consistant:https://github.com/microsoft/vscode/issues/122256
			case 'selectTask': {
				this.selectStep(argument);
				break;
			}
			case 'toggleStepCompletion': {
				this.toggleStepCompletion(argument);
				break;
			}
			case 'allDone': {
				this.markAllStepsComplete();
				break;
			}
			case 'nextSection': {
				const next = this.currentWalkthrough?.next;
				if (next) {
					this.prevWalkthrough = this.currentWalkthrough;
					this.scrollToCategory(next);
				} else {
					console.error('Error scrolling to next section of', this.currentWalkthrough);
				}
				break;
			}
			case 'openLink': {
				this.openerService.open(argument);
				break;
			}
			default: {
				console.error('Dispatch to', command, argument, 'not defined');
				break;
			}
		}
	}

	private hideCategory(categoryId: string) {
		const selectedCategory = this.gettingStartedCategories.find(category => category.id === categoryId);
		if (!selectedCategory) { throw Error('Could not find category with ID ' + categoryId); }
		this.setHiddenCategories([...this.getHiddenCategories().add(categoryId)]);
		this.gettingStartedList?.rerender();
	}

	private markAllStepsComplete() {
		if (this.currentWalkthrough) {
			this.currentWalkthrough?.steps.forEach(step => {
				if (!step.done) {
					this.gettingStartedService.progressStep(step.id);
				}
			});
			this.hideCategory(this.currentWalkthrough?.id);
			this.scrollPrev();
		} else {
			throw Error('No walkthrough opened');
		}
	}

	private toggleStepCompletion(argument: string) {
		const stepToggle = assertReturnsDefined(this.currentWalkthrough?.steps.find(step => step.id === argument));
		if (stepToggle.done) {
			this.gettingStartedService.deprogressStep(argument);
		} else {
			this.gettingStartedService.progressStep(argument);
		}
	}

	private async openWalkthroughSelector() {
		const selection = await this.quickInputService.pick(this.gettingStartedCategories
			.filter(c => this.contextService.contextMatchesRules(c.when))
			.map(x => ({
				id: x.id,
				label: x.title,
				detail: x.description,
				description: x.source,
			})), { canPickMany: false, matchOnDescription: true, matchOnDetail: true, title: localize('pickWalkthroughs', "Open Walkthrough...") });
		if (selection) {
			this.runDispatchCommand('selectCategory', selection.id);
		}
	}

	private getHiddenCategories(): Set<string> {
		return new Set(JSON.parse(this.storageService.get(hiddenEntriesConfigurationKey, StorageScope.PROFILE, '[]')));
	}

	private setHiddenCategories(hidden: string[]) {
		this.storageService.store(
			hiddenEntriesConfigurationKey,
			JSON.stringify(hidden),
			StorageScope.PROFILE,
			StorageTarget.USER);
	}

	private currentMediaComponent: string | undefined = undefined;
	private currentMediaType: string | undefined = undefined;
	private async buildMediaComponent(stepId: string, forceRebuild: boolean = false) {
		if (!this.currentWalkthrough) {
			throw Error('no walkthrough selected');
		}
		const stepToExpand = assertReturnsDefined(this.currentWalkthrough.steps.find(step => step.id === stepId));

		if (!forceRebuild && this.currentMediaComponent === stepId) { return; }
		this.currentMediaComponent = stepId;

		this.stepDisposables.clear();

		this.stepDisposables.add({
			dispose: () => {
				this.currentMediaComponent = undefined;
			}
		});

		if (this.currentMediaType !== stepToExpand.media.type) {
			this.mediaDisposables.clear();

			this.currentMediaType = stepToExpand.media.type;

			this.mediaDisposables.add(toDisposable(() => {
				this.currentMediaType = undefined;
			}));

			clearNode(this.stepMediaComponent);

			if (stepToExpand.media.type === 'svg') {
				this.webview = this.mediaDisposables.add(this.webviewService.createWebviewElement({ title: undefined, options: { disableServiceWorker: true }, contentOptions: {}, extension: undefined }));
				this.webview.mountTo(this.stepMediaComponent, this.window);
			} else if (stepToExpand.media.type === 'markdown') {
				this.webview = this.mediaDisposables.add(this.webviewService.createWebviewElement({ options: {}, contentOptions: { localResourceRoots: [stepToExpand.media.root], allowScripts: true }, title: '', extension: undefined }));
				this.webview.mountTo(this.stepMediaComponent, this.window);
			} else if (stepToExpand.media.type === 'video') {
				this.webview = this.mediaDisposables.add(this.webviewService.createWebviewElement({ options: {}, contentOptions: { localResourceRoots: [stepToExpand.media.root], allowScripts: true }, title: '', extension: undefined }));
				this.webview.mountTo(this.stepMediaComponent, this.window);
			}
		}

		if (stepToExpand.media.type === 'image') {

			this.stepsContent.classList.add('image');
			this.stepsContent.classList.remove('markdown');
			this.stepsContent.classList.remove('video');

			const media = stepToExpand.media;
			const mediaElement = $<HTMLImageElement>('img');
			clearNode(this.stepMediaComponent);
			this.stepMediaComponent.appendChild(mediaElement);
			mediaElement.setAttribute('alt', media.altText);
			this.updateMediaSourceForColorMode(mediaElement, media.path);

			this.stepDisposables.add(addDisposableListener(this.stepMediaComponent, 'click', () => {
				const hrefs = stepToExpand.description.map(lt => lt.nodes.filter((node): node is ILink => typeof node !== 'string').map(node => node.href)).flat();
				if (hrefs.length === 1) {
					const href = hrefs[0];
					if (href.startsWith('http')) {
						this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'runStepAction', argument: href, walkthroughId: this.currentWalkthrough?.id });
						this.openerService.open(href);
					}
				}
			}));

			this.stepDisposables.add(this.themeService.onDidColorThemeChange(() => this.updateMediaSourceForColorMode(mediaElement, media.path)));

		}
		else if (stepToExpand.media.type === 'svg') {
			this.stepsContent.classList.add('image');
			this.stepsContent.classList.remove('markdown');
			this.stepsContent.classList.remove('video');

			const media = stepToExpand.media;
			this.webview.setHtml(await this.detailsRenderer.renderSVG(media.path));

			let isDisposed = false;
			this.stepDisposables.add(toDisposable(() => { isDisposed = true; }));

			this.stepDisposables.add(this.themeService.onDidColorThemeChange(async () => {
				// Render again since color vars change
				const body = await this.detailsRenderer.renderSVG(media.path);
				if (!isDisposed) { // Make sure we weren't disposed of in the meantime
					this.webview.setHtml(body);
				}
			}));

			this.stepDisposables.add(addDisposableListener(this.stepMediaComponent, 'click', () => {
				const hrefs = stepToExpand.description.map(lt => lt.nodes.filter((node): node is ILink => typeof node !== 'string').map(node => node.href)).flat();
				if (hrefs.length === 1) {
					const href = hrefs[0];
					if (href.startsWith('http')) {
						this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'runStepAction', argument: href, walkthroughId: this.currentWalkthrough?.id });
						this.openerService.open(href);
					}
				}
			}));

			this.stepDisposables.add(this.webview.onDidClickLink(link => {
				if (matchesScheme(link, Schemas.https) || matchesScheme(link, Schemas.http) || (matchesScheme(link, Schemas.command))) {
					this.openerService.open(link, { allowCommands: true });
				}
			}));

		}
		else if (stepToExpand.media.type === 'markdown') {

			this.stepsContent.classList.remove('image');
			this.stepsContent.classList.add('markdown');
			this.stepsContent.classList.remove('video');

			const media = stepToExpand.media;

			const rawHTML = await this.detailsRenderer.renderMarkdown(media.path, media.base);
			this.webview.setHtml(rawHTML);

			const serializedContextKeyExprs = rawHTML.match(/checked-on=\"([^'][^"]*)\"/g)?.map(attr => attr.slice('checked-on="'.length, -1)
				.replace(/&#39;/g, '\'')
				.replace(/&amp;/g, '&'));

			const postTrueKeysMessage = () => {
				const enabledContextKeys = serializedContextKeyExprs?.filter(expr => this.contextService.contextMatchesRules(ContextKeyExpr.deserialize(expr)));
				if (enabledContextKeys) {
					this.webview.postMessage({
						enabledContextKeys
					});
				}
			};

			if (serializedContextKeyExprs) {
				const contextKeyExprs = coalesce(serializedContextKeyExprs.map(expr => ContextKeyExpr.deserialize(expr)));
				const watchingKeys = new Set(contextKeyExprs.flatMap(expr => expr.keys()));

				this.stepDisposables.add(this.contextService.onDidChangeContext(e => {
					if (e.affectsSome(watchingKeys)) { postTrueKeysMessage(); }
				}));
			}

			let isDisposed = false;
			this.stepDisposables.add(toDisposable(() => { isDisposed = true; }));

			this.stepDisposables.add(this.webview.onDidClickLink(link => {
				if (matchesScheme(link, Schemas.https) || matchesScheme(link, Schemas.http) || (matchesScheme(link, Schemas.command))) {
					const toSide = link.startsWith('command:toSide:');
					if (toSide) {
						link = link.replace('command:toSide:', 'command:');
						this.focusSideEditorGroup();
					}
					this.openerService.open(link, { allowCommands: true, openToSide: toSide });
				}
			}));

			if (rawHTML.indexOf('<code>') >= 0) {
				// Render again when Theme changes since syntax highlighting of code blocks may have changed
				this.stepDisposables.add(this.themeService.onDidColorThemeChange(async () => {
					const body = await this.detailsRenderer.renderMarkdown(media.path, media.base);
					if (!isDisposed) { // Make sure we weren't disposed of in the meantime
						this.webview.setHtml(body);
						postTrueKeysMessage();
					}
				}));
			}

			const layoutDelayer = new Delayer(50);

			this.layoutMarkdown = () => {
				layoutDelayer.trigger(() => {
					this.webview.postMessage({ layoutMeNow: true });
				});
			};

			this.stepDisposables.add(layoutDelayer);
			this.stepDisposables.add({ dispose: () => this.layoutMarkdown = undefined });

			postTrueKeysMessage();

			this.stepDisposables.add(this.webview.onMessage(async e => {
				const message: string = e.message as string;
				if (message.startsWith('command:')) {
					this.openerService.open(message, { allowCommands: true });
				} else if (message.startsWith('setTheme:')) {
					const themeId = message.slice('setTheme:'.length);
					const theme = (await this.themeService.getColorThemes()).find(theme => theme.settingsId === themeId);
					if (theme) {
						this.themeService.setColorTheme(theme.id, ConfigurationTarget.USER);
					}
				} else {
					console.error('Unexpected message', message);
				}
			}));
		}
		else if (stepToExpand.media.type === 'video') {
			this.stepsContent.classList.add('video');
			this.stepsContent.classList.remove('markdown');
			this.stepsContent.classList.remove('image');

			const media = stepToExpand.media;

			const themeType = this.themeService.getColorTheme().type;
			const videoPath = media.path[themeType];
			const videoPoster = media.poster ? media.poster[themeType] : undefined;
			const altText = media.altText ? media.altText : localize('videoAltText', "Video for {0}", stepToExpand.title);
			const rawHTML = await this.detailsRenderer.renderVideo(videoPath, videoPoster, altText);
			this.webview.setHtml(rawHTML);

			let isDisposed = false;
			this.stepDisposables.add(toDisposable(() => { isDisposed = true; }));

			this.stepDisposables.add(this.themeService.onDidColorThemeChange(async () => {
				// Render again since color vars change
				const themeType = this.themeService.getColorTheme().type;
				const videoPath = media.path[themeType];
				const videoPoster = media.poster ? media.poster[themeType] : undefined;
				const body = await this.detailsRenderer.renderVideo(videoPath, videoPoster, altText);

				if (!isDisposed) { // Make sure we weren't disposed of in the meantime
					this.webview.setHtml(body);
				}
			}));
		}
	}

	async selectStepLoose(id: string) {
		if (!this.editorInput) {
			return;
		}
		// Allow passing in id with a category appended or with just the id of the step
		if (id.startsWith(`${this.editorInput.selectedCategory}#`)) {
			this.selectStep(id);
		} else {
			const toSelect = this.editorInput.selectedCategory + '#' + id;
			this.selectStep(toSelect);
		}
	}

	private provideScreenReaderUpdate(): string {
		if (this.configurationService.getValue(AccessibilityVerbositySettingId.Walkthrough)) {
			const kbLabel = this.keybindingService.lookupKeybinding(AccessibleViewAction.id)?.getAriaLabel();
			return kbLabel ? localize('acessibleViewHint', "Inspect this in the accessible view ({0}).\n", kbLabel) : localize('acessibleViewHintNoKbOpen', "Inspect this in the accessible view via the command Open Accessible View which is currently not triggerable via keybinding.\n");
		}
		return '';
	}

	private async selectStep(id: string | undefined, delayFocus = true) {
		if (!this.editorInput) {
			return;
		}
		if (id) {
			// eslint-disable-next-line no-restricted-syntax
			let stepElement = this.container.querySelector<HTMLDivElement>(`[data-step-id="${id}"]`);
			if (!stepElement) {
				// Selected an element that is not in-context, just fallback to whatever.
				// eslint-disable-next-line no-restricted-syntax
				stepElement = this.container.querySelector<HTMLDivElement>(`[data-step-id]`);
				if (!stepElement) {
					// No steps around... just ignore.
					return;
				}
				id = assertReturnsDefined(stepElement.getAttribute('data-step-id'));
			}
			// eslint-disable-next-line no-restricted-syntax
			stepElement.parentElement?.querySelectorAll<HTMLElement>('.expanded').forEach(node => {
				if (node.getAttribute('data-step-id') !== id) {
					node.classList.remove('expanded');
					node.setAttribute('aria-expanded', 'false');
					// eslint-disable-next-line no-restricted-syntax
					const codiconElement = node.querySelector('.codicon');
					if (codiconElement) {
						codiconElement.removeAttribute('tabindex');
					}
				}
			});
			setTimeout(() => (stepElement as HTMLElement).focus(), delayFocus && this.shouldAnimate() ? SLIDE_TRANSITION_TIME_MS : 0);

			this.editorInput.selectedStep = id;

			stepElement.classList.add('expanded');
			stepElement.setAttribute('aria-expanded', 'true');
			this.buildMediaComponent(id, true);
			// eslint-disable-next-line no-restricted-syntax
			const codiconElement = stepElement.querySelector('.codicon');
			if (codiconElement) {
				codiconElement.setAttribute('tabindex', '0');
			}
			this.gettingStartedService.progressByEvent('stepSelected:' + id);
			const step = this.currentWalkthrough?.steps?.find(step => step.id === id);
			if (step) {
				stepElement.setAttribute('aria-label', `${this.provideScreenReaderUpdate()} ${step.title}`);
			}
		} else {
			this.editorInput.selectedStep = undefined;
		}

		this.detailsPageScrollbar?.scanDomNode();
		this.detailsScrollbar?.scanDomNode();
	}

	private updateMediaSourceForColorMode(element: HTMLImageElement, sources: { hcDark: URI; hcLight: URI; dark: URI; light: URI }) {
		const themeType = this.themeService.getColorTheme().type;
		const src = sources[themeType].toString(true).replace(/ /g, '%20');
		element.srcset = src.toLowerCase().endsWith('.svg') ? src : (src + ' 1.5x');
	}

	protected createEditor(parent: HTMLElement) {
		if (this.detailsPageScrollbar) { this.detailsPageScrollbar.dispose(); }
		if (this.categoriesPageScrollbar) { this.categoriesPageScrollbar.dispose(); }

		this.categoriesSlide = $('.gettingStartedSlideCategories.gettingStartedSlide');

		const prevButton = $('button.prev-button.button-link', { 'x-dispatch': 'scrollPrev' }, $('span.scroll-button.codicon.codicon-chevron-left'), $('span.moreText', {}, localize('goBack', "Go Back")));
		this.stepsSlide = $('.gettingStartedSlideDetails.gettingStartedSlide', {}, prevButton);

		this.stepsContent = $('.gettingStartedDetailsContent', {});

		this.detailsPageScrollbar = this._register(new DomScrollableElement(this.stepsContent, { className: 'full-height-scrollable', vertical: ScrollbarVisibility.Hidden }));
		this.categoriesPageScrollbar = this._register(new DomScrollableElement(this.categoriesSlide, { className: 'full-height-scrollable categoriesScrollbar', vertical: ScrollbarVisibility.Hidden }));

		this.stepsSlide.appendChild(this.detailsPageScrollbar.getDomNode());

		const gettingStartedPage = $('.gettingStarted', {}, this.categoriesPageScrollbar.getDomNode(), this.stepsSlide);
		this.container.appendChild(gettingStartedPage);

		this.categoriesPageScrollbar.scanDomNode();
		this.detailsPageScrollbar.scanDomNode();

		parent.appendChild(this.container);
	}

	private async buildCategoriesSlide() {

		this.categoriesSlideDisposables.clear();
		const showOnStartupCheckbox = new Toggle({
			icon: Codicon.check,
			actionClassName: 'getting-started-checkbox',
			isChecked: this.configurationService.getValue(configurationKey) === 'welcomePage',
			title: localize('checkboxTitle', "When checked, this page will be shown on startup."),
			...defaultToggleStyles
		});
		showOnStartupCheckbox.domNode.id = 'showOnStartup';
		const showOnStartupLabel = $('label.caption', { for: 'showOnStartup' }, localize('welcomePage.showOnStartup', "Show welcome page on startup"));
		const onShowOnStartupChanged = () => {
			if (showOnStartupCheckbox.checked) {
				this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'showOnStartupChecked', argument: undefined, walkthroughId: this.currentWalkthrough?.id });
				this.configurationService.updateValue(configurationKey, 'welcomePage');
			} else {
				this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'showOnStartupUnchecked', argument: undefined, walkthroughId: this.currentWalkthrough?.id });
				this.configurationService.updateValue(configurationKey, 'none');
			}
		};
		this.categoriesSlideDisposables.add(showOnStartupCheckbox);
		this.categoriesSlideDisposables.add(showOnStartupCheckbox.onChange(() => {
			onShowOnStartupChanged();
		}));
		this.categoriesSlideDisposables.add(addDisposableListener(showOnStartupLabel, 'click', () => {
			showOnStartupCheckbox.checked = !showOnStartupCheckbox.checked;
			onShowOnStartupChanged();
		}));

		const header = $('.header', {},
			$('h1.product-name.caption', {}, this.productService.nameLong),
			$('p.subtitle.description', {}, localize({ key: 'gettingStarted.editingEvolved', comment: ['Shown as subtitle on the Welcome page.'] }, "Editing evolved"))
		);

		const leftColumn = $('.categories-column.categories-column-left', {},);
		const rightColumn = $('.categories-column.categories-column-right', {},);

		const startList = this.buildStartList();
		const recentList = this.buildRecentlyOpenedList();
		const gettingStartedList = this.buildGettingStartedWalkthroughsList();

		const footer = $('.footer', {},
			$('p.showOnStartup', {},
				showOnStartupCheckbox.domNode,
				showOnStartupLabel,
			));

		const layoutLists = () => {
			if (gettingStartedList.itemCount) {
				this.container.classList.remove('noWalkthroughs');
				reset(rightColumn, gettingStartedList.getDomElement());
			}
			else {
				this.container.classList.add('noWalkthroughs');
				reset(rightColumn);
			}
			setTimeout(() => this.categoriesPageScrollbar?.scanDomNode(), 50);
			layoutRecentList();
		};

		const layoutRecentList = () => {
			if (this.container.classList.contains('noWalkthroughs')) {
				recentList.setLimit(10);
				reset(leftColumn, startList.getDomElement());
				reset(rightColumn, recentList.getDomElement());
			} else {
				recentList.setLimit(5);
				reset(leftColumn, startList.getDomElement(), recentList.getDomElement());
			}
		};

		gettingStartedList.onDidChange(layoutLists);
		layoutLists();

		reset(this.categoriesSlide, $('.gettingStartedCategoriesContainer', {}, header, leftColumn, rightColumn, footer,));
		this.categoriesPageScrollbar?.scanDomNode();

		this.updateCategoryProgress();
		this.registerDispatchListeners();

		const editorInput = this.editorInput;
		if (editorInput?.selectedCategory) {
			this.currentWalkthrough = this.gettingStartedCategories.find(category => category.id === editorInput.selectedCategory);

			if (!this.currentWalkthrough) {
				this.gettingStartedCategories = this.gettingStartedService.getWalkthroughs();
				this.currentWalkthrough = this.gettingStartedCategories.find(category => category.id === editorInput.selectedCategory);
				if (this.currentWalkthrough) {
					this.buildCategorySlide(editorInput.selectedCategory, editorInput.selectedStep);
					this.setSlide('details');
					return;
				}
			}
			else {
				this.buildCategorySlide(editorInput.selectedCategory, editorInput.selectedStep);
				this.setSlide('details');
				return;
			}
		}

		if (this.editorInput?.showTelemetryNotice && this.productService.openToWelcomeMainPage) {
			const telemetryNotice = $('p.telemetry-notice');
			this.buildTelemetryFooter(telemetryNotice);
			footer.appendChild(telemetryNotice);
		} else if (!this.productService.openToWelcomeMainPage && this.showFeaturedWalkthrough && this.storageService.isNew(StorageScope.APPLICATION)) {
			const firstSessionDateString = this.storageService.get(firstSessionDateStorageKey, StorageScope.APPLICATION) || new Date().toUTCString();
			const daysSinceFirstSession = ((+new Date()) - (+new Date(firstSessionDateString))) / 1000 / 60 / 60 / 24;
			const fistContentBehaviour = daysSinceFirstSession < 1 ? 'openToFirstCategory' : 'index';

			if (fistContentBehaviour === 'openToFirstCategory') {
				const first = this.gettingStartedCategories.filter(c => !c.when || this.contextService.contextMatchesRules(c.when))[0];
				if (first && this.editorInput) {
					this.currentWalkthrough = first;
					this.editorInput.selectedCategory = this.currentWalkthrough?.id;
					this.editorInput.walkthroughPageTitle = this.currentWalkthrough.walkthroughPageTitle;
					this.buildCategorySlide(this.editorInput.selectedCategory, undefined);
					this.setSlide('details', true /* firstLaunch */);
					return;
				}
			}
		}

		this.setSlide('categories');
	}

	private buildRecentlyOpenedList(): GettingStartedIndexList<RecentEntry> {
		const renderRecent = (recent: RecentEntry) => {
			let fullPath: string;
			let windowOpenable: IWindowOpenable;
			let resourceUri: URI;
			if (isRecentFolder(recent)) {
				windowOpenable = { folderUri: recent.folderUri };
				fullPath = recent.label || this.labelService.getWorkspaceLabel(recent.folderUri, { verbose: Verbosity.LONG });
				resourceUri = recent.folderUri;
			} else {
				fullPath = recent.label || this.labelService.getWorkspaceLabel(recent.workspace, { verbose: Verbosity.LONG });
				windowOpenable = { workspaceUri: recent.workspace.configPath };
				resourceUri = recent.workspace.configPath;
			}

			const { name, parentPath } = splitRecentLabel(fullPath);

			const li = $('li');
			const link = $('button.button-link');

			link.innerText = name;
			link.title = fullPath;
			link.setAttribute('aria-label', localize('welcomePage.openFolderWithPath', "Open folder {0} with path {1}", name, parentPath));
			link.addEventListener('click', e => {
				this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'openRecent', argument: undefined, walkthroughId: this.currentWalkthrough?.id });
				this.hostService.openWindow([windowOpenable], {
					forceNewWindow: e.ctrlKey || e.metaKey,
					remoteAuthority: recent.remoteAuthority || null // local window if remoteAuthority is not set or can not be deducted from the openable
				});
				e.preventDefault();
				e.stopPropagation();
			});
			li.appendChild(link);

			const span = $('span');
			span.classList.add('path');
			span.classList.add('detail');
			span.innerText = parentPath;
			span.title = fullPath;
			li.appendChild(span);

			const deleteButton = $('a.codicon.codicon-close.hide-category-button.recently-opened-delete-button', {
				'tabindex': 0,
				'role': 'button',
				'title': localize('welcomePage.removeRecent', "Remove from Recently Opened"),
				'aria-label': localize('welcomePage.removeRecentAriaLabel', "Remove {0} from Recently Opened", name),
			});
			const handleDelete = async (e: Event) => {
				e.preventDefault();
				e.stopPropagation();
				await this.workspacesService.removeRecentlyOpened([resourceUri]);
			};
			deleteButton.addEventListener('click', handleDelete);
			deleteButton.addEventListener('keydown', async e => {
				const event = new StandardKeyboardEvent(e);
				if (event.keyCode === KeyCode.Enter || event.keyCode === KeyCode.Space) {
					await handleDelete(e);
				}
			});
			li.appendChild(deleteButton);

			return li;
		};

		if (this.recentlyOpenedList) { this.recentlyOpenedList.dispose(); }

		const recentlyOpenedList = this.recentlyOpenedList = new GettingStartedIndexList(
			{
				title: localize('recent', "Recent"),
				klass: 'recently-opened',
				limit: 5,
				empty: $('.empty-recent', {},
					localize('noRecents', "You have no recent folders,"),
					$('button.button-link', { 'x-dispatch': 'openFolder' }, localize('openFolder', "open a folder")),
					localize('toStart', "to start.")),

				more: $('.more', {},
					$('button.button-link',
						{
							'x-dispatch': 'showMoreRecents',
							title: localize('show more recents', "Show All Recent Folders {0}", this.getKeybindingLabel(OpenRecentAction.ID))
						}, localize('showAll', "More..."))),
				renderElement: renderRecent,
				contextService: this.contextService
			});

		recentlyOpenedList.onDidChange(() => this.registerDispatchListeners());
		this.recentlyOpened.then(({ workspaces }) => {
			const workspacesWithID = this.filterRecentlyOpened(workspaces);

			const updateEntries = () => {
				recentlyOpenedList.setEntries(workspacesWithID);
			};

			updateEntries();
			recentlyOpenedList.register(this.labelService.onDidChangeFormatters(() => updateEntries()));
		}).catch(onUnexpectedError);

		return recentlyOpenedList;
	}

	private filterRecentlyOpened(workspaces: (IRecentFolder | IRecentWorkspace)[]): RecentEntry[] {
		return workspaces
			.filter(recent => !this.workspaceContextService.isCurrentWorkspace(isRecentWorkspace(recent) ? recent.workspace : recent.folderUri))
			.map(recent => ({ ...recent, id: isRecentWorkspace(recent) ? recent.workspace.id : recent.folderUri.toString() }));
	}

	private refreshRecentlyOpened(): void {
		if (!this.recentlyOpenedList) {
			return;
		}

		this.recentlyOpened.then(({ workspaces }) => {
			const workspacesWithID = this.filterRecentlyOpened(workspaces);
			this.recentlyOpenedList?.setEntries(workspacesWithID);
		}).catch(onUnexpectedError);
	}

	private buildStartList(): GettingStartedIndexList<IWelcomePageStartEntry> {
		const renderStartEntry = (entry: IWelcomePageStartEntry): HTMLElement =>
			$('li',
				{}, $('button.button-link',
					{
						'x-dispatch': 'selectStartEntry:' + entry.id,
						title: entry.description + ' ' + this.getKeybindingLabel(entry.command),
					},
					this.iconWidgetFor(entry),
					$('span', {}, entry.title)));

		if (this.startList) { this.startList.dispose(); }

		const startList = this.startList = new GettingStartedIndexList(
			{
				title: localize('start', "Start"),
				klass: 'start-container',
				limit: 10,
				renderElement: renderStartEntry,
				rankElement: e => -e.order,
				contextService: this.contextService
			});

		startList.setEntries(parsedStartEntries);
		startList.onDidChange(() => this.registerDispatchListeners());
		return startList;
	}

	private buildGettingStartedWalkthroughsList(): GettingStartedIndexList<IResolvedWalkthrough> {

		const renderGetttingStaredWalkthrough = (category: IResolvedWalkthrough): HTMLElement => {

			const renderNewBadge = (category.newItems || category.newEntry) && !category.isFeatured;
			const newBadge = $('.new-badge', {});
			if (category.newEntry) {
				reset(newBadge, $('.new-category', {}, localize('new', "New")));
			} else if (category.newItems) {
				reset(newBadge, $('.new-items', {}, localize({ key: 'newItems', comment: ['Shown when a list of items has changed based on an update from a remote source'] }, "Updated")));
			}

			const featuredBadge = $('.featured-badge', {});
			const descriptionContent = $('.description-content', {},);

			if (category.isFeatured && this.showFeaturedWalkthrough) {
				reset(featuredBadge, $('.featured', {}, $('span.featured-icon.codicon.codicon-star-full')));
				reset(descriptionContent, ...renderLabelWithIcons(category.description));
			}

			const titleContent = $('h3.category-title.max-lines-3', { 'x-category-title-for': category.id });
			reset(titleContent, ...renderLabelWithIcons(category.title));

			return $('button.getting-started-category' + (category.isFeatured && this.showFeaturedWalkthrough ? '.featured' : ''),
				{
					'x-dispatch': 'selectCategory:' + category.id,
					'title': category.description
				},
				featuredBadge,
				$('.main-content', {},
					this.iconWidgetFor(category),
					titleContent,
					renderNewBadge ? newBadge : $('.no-badge'),
					$('a.codicon.codicon-close.hide-category-button', {
						'tabindex': 0,
						'x-dispatch': 'hideCategory:' + category.id,
						'title': localize('close', "Hide"),
						'role': 'button',
						'aria-label': localize('closeAriaLabel', "Hide"),
					}),
				),
				descriptionContent,
				$('.category-progress', { 'x-data-category-id': category.id, },
					$('.progress-bar-outer', { 'role': 'progressbar' },
						$('.progress-bar-inner'))));
		};

		if (this.gettingStartedList) { this.gettingStartedList.dispose(); }

		const rankWalkthrough = (e: IResolvedWalkthrough) => {
			let rank: number | null = e.order;

			if (e.isFeatured) { rank += 7; }
			if (e.newEntry) { rank += 3; }
			if (e.newItems) { rank += 2; }
			if (e.recencyBonus) { rank += 4 * e.recencyBonus; }

			if (this.getHiddenCategories().has(e.id)) { rank = null; }
			return rank;
		};

		const gettingStartedList = this.gettingStartedList = new GettingStartedIndexList(
			{
				title: localize('walkthroughs', "Walkthroughs"),
				klass: 'getting-started',
				limit: 5,
				footer: $('span.button-link.see-all-walkthroughs', { 'x-dispatch': 'seeAllWalkthroughs', 'tabindex': 0 }, localize('showAll', "More...")),
				renderElement: renderGetttingStaredWalkthrough,
				rankElement: rankWalkthrough,
				contextService: this.contextService,
			});

		gettingStartedList.onDidChange(() => {
			const hidden = this.getHiddenCategories();
			const someWalkthroughsHidden = hidden.size || gettingStartedList.itemCount < this.gettingStartedCategories.filter(c => this.contextService.contextMatchesRules(c.when)).length;
			this.container.classList.toggle('someWalkthroughsHidden', !!someWalkthroughsHidden);
			this.registerDispatchListeners();
			allWalkthroughsHiddenContext.bindTo(this.contextService).set(gettingStartedList.itemCount === 0);
			this.updateCategoryProgress();
		});

		gettingStartedList.setEntries(this.gettingStartedCategories);
		allWalkthroughsHiddenContext.bindTo(this.contextService).set(gettingStartedList.itemCount === 0);

		return gettingStartedList;
	}

	layout(size: Dimension) {
		this.detailsScrollbar?.scanDomNode();

		this.categoriesPageScrollbar?.scanDomNode();
		this.detailsPageScrollbar?.scanDomNode();

		this.startList?.layout(size);
		this.gettingStartedList?.layout(size);
		this.recentlyOpenedList?.layout(size);

		if (this.editorInput?.selectedStep && this.currentMediaType) {
			this.mediaDisposables.clear();
			this.stepDisposables.clear();
			this.buildMediaComponent(this.editorInput.selectedStep);
		}

		this.layoutMarkdown?.();

		this.container.classList.toggle('height-constrained', size.height <= 600);
		this.container.classList.toggle('width-constrained', size.width <= 400);
		this.container.classList.toggle('width-semi-constrained', size.width <= 950);

		this.categoriesPageScrollbar?.scanDomNode();
		this.detailsPageScrollbar?.scanDomNode();
		this.detailsScrollbar?.scanDomNode();
	}

	private updateCategoryProgress() {
		// eslint-disable-next-line no-restricted-syntax
		this.window.document.querySelectorAll('.category-progress').forEach(element => {
			const categoryID = element.getAttribute('x-data-category-id');
			const category = this.gettingStartedCategories.find(c => c.id === categoryID);
			if (!category) { throw Error('Could not find category with ID ' + categoryID); }

			const stats = this.getWalkthroughCompletionStats(category);

			// eslint-disable-next-line no-restricted-syntax
			const bar = assertReturnsDefined(element.querySelector('.progress-bar-inner')) as HTMLDivElement;
			bar.setAttribute('aria-valuemin', '0');
			bar.setAttribute('aria-valuenow', '' + stats.stepsComplete);
			bar.setAttribute('aria-valuemax', '' + stats.stepsTotal);
			const progress = (stats.stepsComplete / stats.stepsTotal) * 100;
			bar.style.width = `${progress}%`;

			(element.parentElement as HTMLElement).classList.toggle('no-progress', stats.stepsComplete === 0);

			if (stats.stepsTotal === stats.stepsComplete) {
				bar.title = localize('gettingStarted.allStepsComplete', "All {0} steps complete!", stats.stepsComplete);
			}
			else {
				bar.title = localize('gettingStarted.someStepsComplete', "{0} of {1} steps complete", stats.stepsComplete, stats.stepsTotal);
			}
		});
	}

	private async scrollToCategory(categoryID: string, stepId?: string) {

		if (!this.gettingStartedCategories.some(c => c.id === categoryID)) {
			this.gettingStartedCategories = this.gettingStartedService.getWalkthroughs();
		}

		const ourCategory = this.gettingStartedCategories.find(c => c.id === categoryID);
		if (!ourCategory) {
			throw Error('Could not find category with ID: ' + categoryID);
		}

		this.inProgressScroll = this.inProgressScroll.then(async () => {
			if (!this.editorInput) {
				return;
			}
			reset(this.stepsContent);
			this.editorInput.selectedCategory = categoryID;
			this.editorInput.selectedStep = stepId;
			this.editorInput.walkthroughPageTitle = ourCategory.walkthroughPageTitle;
			this.currentWalkthrough = ourCategory;
			this.buildCategorySlide(categoryID, stepId);
			this.setSlide('details');
		});
	}

	private iconWidgetFor(category: IResolvedWalkthrough | { icon: { type: 'icon'; icon: ThemeIcon } }) {
		const widget = category.icon.type === 'icon' ? $(ThemeIcon.asCSSSelector(category.icon.icon)) : $('img.category-icon', { src: category.icon.path });
		widget.classList.add('icon-widget');
		return widget;
	}

	private focusSideEditorGroup() {
		const fullSize = this.groupsService.getPart(this.group).contentDimension;
		if (!fullSize || fullSize.width <= 700 || this.container.classList.contains('width-constrained') || this.container.classList.contains('width-semi-constrained')) { return; }
		if (this.groupsService.count === 1) {
			const editorGroupSplitDirection = preferredSideBySideGroupDirection(this.configurationService);
			const sideGroup = this.groupsService.addGroup(this.groupsService.groups[0], editorGroupSplitDirection);
			this.groupsService.activateGroup(sideGroup);
		}

		const nonGettingStartedGroup = this.groupsService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE).find(group => !(group.activeEditor instanceof GettingStartedInput));
		if (nonGettingStartedGroup) {
			this.groupsService.activateGroup(nonGettingStartedGroup);
			nonGettingStartedGroup.focus();
		}
	}
	private runStepCommand(href: string) {

		const isCommand = href.startsWith('command:');
		const toSide = href.startsWith('command:toSide:');
		const command = href.replace(/command:(toSide:)?/, 'command:');

		this.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>('gettingStarted.ActionExecuted', { command: 'runStepAction', argument: href, walkthroughId: this.currentWalkthrough?.id });

		if (toSide) {
			this.focusSideEditorGroup();
		}
		if (isCommand) {
			const commandURI = URI.parse(command);

			// execute as command
			let args = [];
			try {
				args = parse(decodeURIComponent(commandURI.query));
			} catch {
				// ignore and retry
				try {
					args = parse(commandURI.query);
				} catch {
					// ignore error
				}
			}
			if (!Array.isArray(args)) {
				args = [args];
			}

			// If a step is requesting the OpenFolder action to be executed in an empty workspace...
			if ((commandURI.path === OpenFileFolderAction.ID.toString() ||
				commandURI.path === OpenFolderAction.ID.toString()) &&
				this.workspaceContextService.getWorkspace().folders.length === 0) {

				const selectedStepIndex = this.currentWalkthrough?.steps.findIndex(step => step.id === this.editorInput?.selectedStep);

				// and there are a few more steps after this step which are yet to be completed...
				if (selectedStepIndex !== undefined &&
					selectedStepIndex > -1 &&
					this.currentWalkthrough?.steps.slice(selectedStepIndex + 1).some(step => !step.done)) {
					const restoreData: RestoreWalkthroughsConfigurationValue = { folder: UNKNOWN_EMPTY_WINDOW_WORKSPACE.id, category: this.editorInput?.selectedCategory, step: this.editorInput?.selectedStep };

					// save state to restore after reload
					this.storageService.store(
						restoreWalkthroughsConfigurationKey,
						JSON.stringify(restoreData),
						StorageScope.PROFILE, StorageTarget.MACHINE);
				}
			}

			this.commandService.executeCommand(commandURI.path, ...args).then(result => {
				const toOpen = (result as { openFolder?: URI })?.openFolder;
				if (toOpen) {
					if (!URI.isUri(toOpen)) {
						console.warn('Warn: Running walkthrough command', href, 'yielded non-URI `openFolder` result', toOpen, '. It will be disregarded.');
						return;
					}
					const restoreData: RestoreWalkthroughsConfigurationValue = { folder: toOpen.toString(), category: this.editorInput?.selectedCategory, step: this.editorInput?.selectedStep };
					this.storageService.store(
						restoreWalkthroughsConfigurationKey,
						JSON.stringify(restoreData),
						StorageScope.PROFILE, StorageTarget.MACHINE);
					this.hostService.openWindow([{ folderUri: toOpen }]);
				}
			});
		} else {
			this.openerService.open(command, { allowCommands: true });
		}

		if (!isCommand && (href.startsWith('https://') || href.startsWith('http://'))) {
			this.gettingStartedService.progressByEvent('onLink:' + href);
		}
	}

	private buildMarkdownDescription(container: HTMLElement, text: LinkedText[]) {
		while (container.firstChild) { container.firstChild.remove(); }

		for (const linkedText of text) {
			if (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {
				const node = linkedText.nodes[0];
				const buttonContainer = append(container, $('.button-container'));
				const button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });

				const isCommand = node.href.startsWith('command:');
				const command = node.href.replace(/command:(toSide:)?/, 'command:');

				button.label = node.label;
				button.onDidClick(e => {
					e.stopPropagation();
					e.preventDefault();
					this.runStepCommand(node.href);
				}, null, this.detailsPageDisposables);

				if (isCommand) {
					const keybinding = this.getKeyBinding(command);
					if (keybinding) {
						const shortcutMessage = $('span.shortcut-message', {}, localize('gettingStarted.keyboardTip', 'Tip: Use keyboard shortcut '));
						container.appendChild(shortcutMessage);
						const label = new KeybindingLabel(shortcutMessage, OS, { ...defaultKeybindingLabelStyles });
						label.set(keybinding);
						this.detailsPageDisposables.add(label);
					}
				}

				this.detailsPageDisposables.add(button);
			} else {
				const p = append(container, $('p'));
				for (const node of linkedText.nodes) {
					if (typeof node === 'string') {
						const labelWithIcon = renderLabelWithIcons(node);
						for (const element of labelWithIcon) {
							if (typeof element === 'string') {
								p.appendChild(renderFormattedText(element, { renderCodeSegments: true }, $('span')));
							} else {
								p.appendChild(element);
							}
						}
					} else {
						const nodeWithTitle: ILink = matchesScheme(node.href, Schemas.http) || matchesScheme(node.href, Schemas.https) ? { ...node, title: node.href } : node;
						const link = this.instantiationService.createInstance(Link, p, nodeWithTitle, { opener: (href) => this.runStepCommand(href) });
						this.detailsPageDisposables.add(link);
					}
				}
			}
		}
		return container;
	}

	override clearInput() {
		this.stepDisposables.clear();
		super.clearInput();
	}

	private buildCategorySlide(categoryID: string, selectedStep?: string) {
		if (!this.editorInput) {
			return;
		}
		if (this.detailsScrollbar) { this.detailsScrollbar.dispose(); }

		this.extensionService.whenInstalledExtensionsRegistered().then(() => {
			// Remove internal extension id specifier from exposed id's
			this.extensionService.activateByEvent(`onWalkthrough:${categoryID.replace(/[^#]+#/, '')}`);
		});

		this.detailsPageDisposables.clear();
		this.mediaDisposables.clear();

		const category = this.gettingStartedCategories.find(category => category.id === categoryID);
		if (!category) {
			throw Error('could not find category with ID ' + categoryID);
		}

		const descriptionContainer = $('.category-description.description.max-lines-3', { 'x-category-description-for': category.id });
		this.buildMarkdownDescription(descriptionContainer, parseDescription(category.description));

		const categoryDescriptorComponent =
			$('.getting-started-category',
				{},
				$('.category-description-container', {},
					$('h2.category-title.max-lines-3', { 'x-category-title-for': category.id }, ...renderLabelWithIcons(category.title)),
					descriptionContainer));

		const stepListContainer = $('.step-list-container');

		this.detailsPageDisposables.add(addDisposableListener(stepListContainer, 'keydown', (e) => {
			const event = new StandardKeyboardEvent(e);
			const currentStepIndex = () =>
				category.steps.findIndex(e => e.id === this.editorInput?.selectedStep);

			if (event.keyCode === KeyCode.UpArrow) {
				const toExpand = category.steps.filter((step, index) => index < currentStepIndex() && this.contextService.contextMatchesRules(step.when));
				if (toExpand.length) {
					this.selectStep(toExpand[toExpand.length - 1].id, false);
				}
			}
			if (event.keyCode === KeyCode.DownArrow) {
				const toExpand = category.steps.find((step, index) => index > currentStepIndex() && this.contextService.contextMatchesRules(step.when));
				if (toExpand) {
					this.selectStep(toExpand.id, false);
				}
			}
		}));

		let renderedSteps: IResolvedWalkthroughStep[] | undefined = undefined;

		const contextKeysToWatch = new Set(category.steps.flatMap(step => step.when.keys()));

		const buildStepList = () => {

			category.steps.sort((a, b) => a.order - b.order);
			const toRender = category.steps
				.filter(step => this.contextService.contextMatchesRules(step.when));

			if (equals(renderedSteps, toRender, (a, b) => a.id === b.id)) {
				return;
			}

			renderedSteps = toRender;

			reset(stepListContainer, ...renderedSteps
				.map(step => {
					const codicon = $('.codicon' + (step.done ? '.complete' + ThemeIcon.asCSSSelector(gettingStartedCheckedCodicon) : ThemeIcon.asCSSSelector(gettingStartedUncheckedCodicon)),
						{
							'data-done-step-id': step.id,
							'x-dispatch': 'toggleStepCompletion:' + step.id,
							'role': 'checkbox',
							'aria-checked': step.done ? 'true' : 'false',
							'aria-label': step.done
								? localize('stepDone', "Checkbox for Step {0}: Completed", step.title)
								: localize('stepNotDone', "Checkbox for Step {0}: Not completed", step.title),
						});

					const container = $('.step-description-container', { 'x-step-description-for': step.id });
					this.buildMarkdownDescription(container, step.description);

					const stepTitle = $('h3.step-title.max-lines-3', { 'x-step-title-for': step.id });
					reset(stepTitle, ...renderLabelWithIcons(step.title));

					const stepDescription = $('.step-container', {},
						stepTitle,
						container,
					);

					if (step.media.type === 'image') {
						stepDescription.appendChild(
							$('.image-description', { 'aria-label': localize('imageShowing', "Image showing {0}", step.media.altText) }),
						);
					} else if (step.media.type === 'video') {
						stepDescription.appendChild(
							$('.video-description', { 'aria-label': localize('videoShowing', "Video showing {0}", step.media.altText) }),
						);
					}

					return $('button.getting-started-step',
						{
							'x-dispatch': 'selectTask:' + step.id,
							'data-step-id': step.id,
							'aria-expanded': 'false',
							'aria-checked': step.done ? 'true' : 'false',
							'role': 'button',
						},
						codicon,
						stepDescription);
				}));
		};

		buildStepList();

		this.detailsPageDisposables.add(this.contextService.onDidChangeContext(e => {
			if (e.affectsSome(contextKeysToWatch) && this.currentWalkthrough && this.editorInput) {
				buildStepList();
				this.registerDispatchListeners();
				this.selectStep(this.editorInput.selectedStep, false);
			}
		}));

		const showNextCategory = this.gettingStartedCategories.find(_category => _category.id === category.next);

		const stepsContainer = $(
			'.getting-started-detail-container', { 'role': 'list' },
			stepListContainer,
			$('.done-next-container', {},
				$('button.button-link.all-done', { 'x-dispatch': 'allDone' }, $('span.codicon.codicon-check-all'), localize('allDone', "Mark Done")),
				...(showNextCategory
					? [$('button.button-link.next', { 'x-dispatch': 'nextSection' }, localize('nextOne', "Next Section"), $('span.codicon.codicon-arrow-right'))]
					: []),
			)
		);
		this.detailsScrollbar = this._register(new DomScrollableElement(stepsContainer, { className: 'steps-container' }));
		const stepListComponent = this.detailsScrollbar.getDomNode();

		const categoryFooter = $('.getting-started-footer');
		if (this.editorInput.showTelemetryNotice && getTelemetryLevel(this.configurationService) !== TelemetryLevel.NONE && this.productService.enableTelemetry) {
			this.buildTelemetryFooter(categoryFooter);
		}

		reset(this.stepsContent, categoryDescriptorComponent, stepListComponent, this.stepMediaComponent, categoryFooter);

		const toExpand = category.steps.find(step => this.contextService.contextMatchesRules(step.when) && !step.done) ?? category.steps[0];
		this.selectStep(selectedStep ?? toExpand.id, !selectedStep);

		this.detailsScrollbar.scanDomNode();
		this.detailsPageScrollbar?.scanDomNode();

		this.registerDispatchListeners();
	}

	private buildTelemetryFooter(parent: HTMLElement) {
		const privacyStatementCopy = localize('privacy statement', "privacy statement");
		const privacyStatementButton = `[${privacyStatementCopy}](command:workbench.action.openPrivacyStatementUrl)`;

		const optOutCopy = localize('optOut', "opt out");
		const optOutButton = `[${optOutCopy}](command:settings.filterByTelemetry)`;

		const text = localize({ key: 'footer', comment: ['fist substitution is "vs code", second is "privacy statement", third is "opt out".'] },
			"{0} collects usage data. Read our {1} and learn how to {2}.", this.productService.nameShort, privacyStatementButton, optOutButton);

		const renderedContents = this.detailsPageDisposables.add(this.markdownRendererService.render({ value: text, isTrusted: true }));
		parent.append(renderedContents.element);
	}

	private getKeybindingLabel(command: string) {
		command = command.replace(/^command:/, '');
		const label = this.keybindingService.lookupKeybinding(command)?.getLabel();
		if (!label) { return ''; }
		else {
			return `(${label})`;
		}
	}

	private getKeyBinding(command: string) {
		command = command.replace(/^command:/, '');
		return this.keybindingService.lookupKeybinding(command);
	}

	private async scrollPrev() {
		this.inProgressScroll = this.inProgressScroll.then(async () => {
			if (this.prevWalkthrough && this.prevWalkthrough !== this.currentWalkthrough) {
				this.currentWalkthrough = this.prevWalkthrough;
				this.prevWalkthrough = undefined;
				this.makeCategoryVisibleWhenAvailable(this.currentWalkthrough.id);
			} else {
				this.currentWalkthrough = undefined;
				if (this.editorInput) {
					this.editorInput.selectedCategory = undefined;
					this.editorInput.selectedStep = undefined;
					this.editorInput.showTelemetryNotice = false;
					this.editorInput.walkthroughPageTitle = undefined;
				}

				if (this.gettingStartedCategories.length !== this.gettingStartedList?.itemCount) {
					// extensions may have changed in the time since we last displayed the walkthrough list
					// rebuild the list
					this.buildCategoriesSlide();
				}

				this.selectStep(undefined);
				this.setSlide('categories');
				this.container.focus();
			}
		});
	}

	private runSkip() {
		this.commandService.executeCommand('workbench.action.closeActiveEditor');
	}

	escape() {
		if (this.editorInput?.selectedCategory) {
			this.scrollPrev();
		} else {
			this.runSkip();
		}
	}

	private setSlide(toEnable: 'details' | 'categories', firstLaunch: boolean = false) {
		// eslint-disable-next-line no-restricted-syntax
		const slideManager = assertReturnsDefined(this.container.querySelector('.gettingStarted'));
		if (toEnable === 'categories') {
			slideManager.classList.remove('showDetails');
			slideManager.classList.add('showCategories');
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector<HTMLButtonElement>('.prev-button.button-link')!.style.display = 'none';
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideDetails')!.querySelectorAll('button').forEach(button => button.disabled = true);
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideCategories')!.querySelectorAll('button').forEach(button => button.disabled = false);
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideCategories')!.querySelectorAll('input').forEach(button => button.disabled = false);
		} else {
			slideManager.classList.add('showDetails');
			slideManager.classList.remove('showCategories');
			// eslint-disable-next-line no-restricted-syntax
			const prevButton = this.container.querySelector<HTMLButtonElement>('.prev-button.button-link');
			prevButton!.style.display = this.editorInput?.showWelcome || this.prevWalkthrough ? 'block' : 'none';
			// eslint-disable-next-line no-restricted-syntax
			const moreTextElement = prevButton!.querySelector('.moreText');
			moreTextElement!.textContent = firstLaunch ? localize('welcome', "Welcome") : localize('goBack', "Go Back");

			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideDetails')!.querySelectorAll('button').forEach(button => button.disabled = false);
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideCategories')!.querySelectorAll('button').forEach(button => button.disabled = true);
			// eslint-disable-next-line no-restricted-syntax
			this.container.querySelector('.gettingStartedSlideCategories')!.querySelectorAll('input').forEach(button => button.disabled = true);
		}
	}

	override focus() {
		super.focus();

		const active = this.container.ownerDocument.activeElement;

		let parent = this.container.parentElement;
		while (parent && parent !== active) {
			parent = parent.parentElement;
		}

		if (parent) {
			// Only set focus if there is no other focued element outside this chain.
			// This prevents us from stealing back focus from other focused elements such as quick pick due to delayed load.
			this.container.focus();
		}
	}
}

export class GettingStartedInputSerializer implements IEditorSerializer {
	public canSerialize(editorInput: GettingStartedInput): boolean {
		return true;
	}

	public serialize(editorInput: GettingStartedInput): string {
		return JSON.stringify({ selectedCategory: editorInput.selectedCategory, selectedStep: editorInput.selectedStep });
	}

	public deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): GettingStartedInput {

		return instantiationService.invokeFunction(accessor => {
			try {
				const { selectedCategory, selectedStep } = JSON.parse(serializedEditorInput);
				return new GettingStartedInput({ selectedCategory, selectedStep });
			} catch { }
			return new GettingStartedInput({});

		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AccessibleViewType, AccessibleContentProvider, ExtensionContentProvider, IAccessibleViewContentProvider, AccessibleViewProviderId } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { GettingStartedPage, inWelcomeContext } from './gettingStarted.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IResolvedWalkthrough, IResolvedWalkthroughStep, IWalkthroughsService } from './gettingStartedService.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { GettingStartedInput } from './gettingStartedInput.js';
import { localize } from '../../../../nls.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { ILink } from '../../../../base/common/linkedText.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { URI } from '../../../../base/common/uri.js';
import { parse } from '../../../../base/common/marshalling.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';

export class GettingStartedAccessibleView implements IAccessibleViewImplementation {
	readonly type = AccessibleViewType.View;
	readonly priority = 110;
	readonly name = 'walkthroughs';
	readonly when = inWelcomeContext;

	getProvider = (accessor: ServicesAccessor): AccessibleContentProvider | ExtensionContentProvider | undefined => {
		const editorService = accessor.get(IEditorService);
		const editorPane = editorService.activeEditorPane;
		if (!(editorPane instanceof GettingStartedPage)) {
			return;
		}
		const gettingStartedInput = editorPane.input;
		if (!(gettingStartedInput instanceof GettingStartedInput) || !gettingStartedInput.selectedCategory) {
			return;
		}

		const gettingStartedService = accessor.get(IWalkthroughsService);
		const currentWalkthrough = gettingStartedService.getWalkthrough(gettingStartedInput.selectedCategory);
		const currentStepIds = gettingStartedInput.selectedStep;
		if (currentWalkthrough) {

			return new GettingStartedAccessibleProvider(
				accessor.get(IContextKeyService),
				accessor.get(ICommandService),
				accessor.get(IOpenerService),
				editorPane,
				currentWalkthrough,
				currentStepIds);
		}
		return;
	};
}

class GettingStartedAccessibleProvider extends Disposable implements IAccessibleViewContentProvider {

	private _currentStepIndex: number = 0;
	private _activeWalkthroughSteps: IResolvedWalkthroughStep[] = [];

	constructor(
		private contextService: IContextKeyService,
		private commandService: ICommandService,
		private openerService: IOpenerService,
		private readonly _gettingStartedPage: GettingStartedPage,
		private readonly _walkthrough: IResolvedWalkthrough,
		private readonly _focusedStep?: string | undefined,
	) {
		super();
		this._activeWalkthroughSteps = _walkthrough.steps.filter(step => !step.when || this.contextService.contextMatchesRules(step.when));
	}

	readonly id = AccessibleViewProviderId.Walkthrough;
	readonly verbositySettingKey = AccessibilityVerbositySettingId.Walkthrough;
	readonly options = { type: AccessibleViewType.View };

	public get actions(): IAction[] {
		const actions: IAction[] = [];
		const step = this._activeWalkthroughSteps[this._currentStepIndex];
		const nodes = step.description.map(lt => lt.nodes.filter((node): node is ILink => typeof node !== 'string').map(node => ({ href: node.href, label: node.label }))).flat();
		if (nodes.length === 1) {
			const node = nodes[0];

			actions.push(new Action('walthrough.step.action', node.label, ThemeIcon.asClassName(Codicon.run), true, () => {

				const isCommand = node.href.startsWith('command:');
				const command = node.href.replace(/command:(toSide:)?/, 'command:');

				if (isCommand) {
					const commandURI = URI.parse(command);

					let args: unknown[] = [];
					try {
						args = parse(decodeURIComponent(commandURI.query));
					} catch {
						try {
							args = parse(commandURI.query);
						} catch {
							// ignore error
						}
					}
					if (!Array.isArray(args)) {
						args = [args];
					}
					this.commandService.executeCommand(commandURI.path, ...args);
				} else {
					this.openerService.open(command, { allowCommands: true });
				}
			}));
		}
		return actions;
	}

	provideContent(): string {
		if (this._focusedStep) {
			const stepIndex = this._activeWalkthroughSteps.findIndex(step => step.id === this._focusedStep);
			if (stepIndex !== -1) {
				this._currentStepIndex = stepIndex;
			}
		}
		return this._getContent(this._walkthrough, this._activeWalkthroughSteps[this._currentStepIndex], /* includeTitle */true);
	}

	private _getContent(waltkrough: IResolvedWalkthrough, step: IResolvedWalkthroughStep, includeTitle?: boolean): string {

		const description = step.description.map(lt => lt.nodes.filter(node => typeof node === 'string')).join('\n');
		const stepsContent =
			localize('gettingStarted.step', '{0}\n{1}', step.title, description);

		if (includeTitle) {
			return [
				localize('gettingStarted.title', 'Title: {0}', waltkrough.title),
				localize('gettingStarted.description', 'Description: {0}', waltkrough.description),
				stepsContent
			].join('\n');
		}
		else {
			return stepsContent;
		}
	}

	provideNextContent(): string | undefined {
		if (++this._currentStepIndex >= this._activeWalkthroughSteps.length) {
			--this._currentStepIndex;
			return;
		}
		return this._getContent(this._walkthrough, this._activeWalkthroughSteps[this._currentStepIndex]);
	}

	providePreviousContent(): string | undefined {
		if (--this._currentStepIndex < 0) {
			++this._currentStepIndex;
			return;
		}
		return this._getContent(this._walkthrough, this._activeWalkthroughSteps[this._currentStepIndex]);
	}

	onClose(): void {
		if (this._currentStepIndex > -1) {
			const currentStep = this._activeWalkthroughSteps[this._currentStepIndex];
			this._gettingStartedPage.makeCategoryVisibleWhenAvailable(this._walkthrough.id, currentStep.id);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedColors.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { darken, inputBackground, editorWidgetBackground, lighten, registerColor, textLinkForeground, contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { localize } from '../../../../nls.js';

// Seprate from main module to break dependency cycles between welcomePage and gettingStarted.
export const welcomePageBackground = registerColor('welcomePage.background', null, localize('welcomePage.background', 'Background color for the Welcome page.'));

export const welcomePageTileBackground = registerColor('welcomePage.tileBackground', { dark: editorWidgetBackground, light: editorWidgetBackground, hcDark: '#000', hcLight: editorWidgetBackground }, localize('welcomePage.tileBackground', 'Background color for the tiles on the Welcome page.'));
export const welcomePageTileHoverBackground = registerColor('welcomePage.tileHoverBackground', { dark: lighten(editorWidgetBackground, .2), light: darken(editorWidgetBackground, .1), hcDark: null, hcLight: null }, localize('welcomePage.tileHoverBackground', 'Hover background color for the tiles on the Welcome.'));
export const welcomePageTileBorder = registerColor('welcomePage.tileBorder', { dark: '#ffffff1a', light: '#0000001a', hcDark: contrastBorder, hcLight: contrastBorder }, localize('welcomePage.tileBorder', 'Border color for the tiles on the Welcome page.'));


export const welcomePageProgressBackground = registerColor('welcomePage.progress.background', inputBackground, localize('welcomePage.progress.background', 'Foreground color for the Welcome page progress bars.'));
export const welcomePageProgressForeground = registerColor('welcomePage.progress.foreground', textLinkForeground, localize('welcomePage.progress.foreground', 'Background color for the Welcome page progress bars.'));

export const walkthroughStepTitleForeground = registerColor('walkthrough.stepTitle.foreground', { light: '#000000', dark: '#ffffff', hcDark: null, hcLight: null }, localize('walkthrough.stepTitle.foreground', 'Foreground color of the heading of each walkthrough step'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedDetailsRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedDetailsRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { generateUuid } from '../../../../base/common/uuid.js';
import { generateTokensCSSForColorMap } from '../../../../editor/common/languages/supports/tokenization.js';
import { TokenizationRegistry } from '../../../../editor/common/languages.js';
import { DEFAULT_MARKDOWN_STYLES, renderMarkdownDocument } from '../../markdown/browser/markdownDocumentRenderer.js';
import { URI } from '../../../../base/common/uri.js';
import { language } from '../../../../base/common/platform.js';
import { joinPath } from '../../../../base/common/resources.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { asWebviewUri } from '../../webview/common/webview.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { gettingStartedContentRegistry } from '../common/gettingStartedContent.js';


export class GettingStartedDetailsRenderer {
	private mdCache = new ResourceMap<TrustedHTML>();
	private svgCache = new ResourceMap<string>();

	constructor(
		@IFileService private readonly fileService: IFileService,
		@INotificationService private readonly notificationService: INotificationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ILanguageService private readonly languageService: ILanguageService,
	) { }

	async renderMarkdown(path: URI, base: URI): Promise<string> {
		const content = await this.readAndCacheStepMarkdown(path, base);
		const nonce = generateUuid();
		const colorMap = TokenizationRegistry.getColorMap();

		const css = colorMap ? generateTokensCSSForColorMap(colorMap) : '';

		const inDev = document.location.protocol === 'http:';
		const imgSrcCsp = inDev ? 'img-src https: data: http:' : 'img-src https: data:';

		return `<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ${imgSrcCsp}; media-src https:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
				<style nonce="${nonce}">
					${DEFAULT_MARKDOWN_STYLES}
					${css}
					body > img {
						align-self: flex-start;
					}
					body > img[centered] {
						align-self: center;
					}
					body {
						display: flex;
						flex-direction: column;
						padding: 0;
						height: inherit;
					}
					.theme-picker-row {
						display: flex;
						justify-content: center;
						gap: 32px;
					}
					checklist {
						display: flex;
						gap: 32px;
						flex-direction: column;
					}
					checkbox {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin: 5px;
						cursor: pointer;
					}
					checkbox > img {
						margin-bottom: 8px !important;
					}
					checkbox.checked > img {
						box-sizing: border-box;
					}
					checkbox.checked > img {
						outline: 2px solid var(--vscode-focusBorder);
						outline-offset: 4px;
						border-radius: 4px;
					}
					.theme-picker-link {
						margin-top: 16px;
						color: var(--vscode-textLink-foreground);
					}
					blockquote > p:first-child {
						margin-top: 0;
					}
					body > * {
						margin-block-end: 0.25em;
						margin-block-start: 0.25em;
					}
					vertically-centered {
						padding-top: 5px;
						padding-bottom: 5px;
						display: flex;
						justify-content: center;
						flex-direction: column;
					}
					html {
						height: 100%;
						padding-right: 32px;
					}
					h1 {
						font-size: 19.5px;
					}
					h2 {
						font-size: 18.5px;
					}
				</style>
			</head>
			<body>
				<vertically-centered>
					${content}
				</vertically-centered>
			</body>
			<script nonce="${nonce}">
				const vscode = acquireVsCodeApi();

				document.querySelectorAll('[when-checked]').forEach(el => {
					el.addEventListener('click', () => {
						vscode.postMessage(el.getAttribute('when-checked'));
					});
				});

				let ongoingLayout = undefined;
				const doLayout = () => {
					document.querySelectorAll('vertically-centered').forEach(element => {
						element.style.marginTop = Math.max((document.body.clientHeight - element.scrollHeight) * 3/10, 0) + 'px';
					});
					ongoingLayout = undefined;
				};

				const layout = () => {
					if (ongoingLayout) {
						clearTimeout(ongoingLayout);
					}
					ongoingLayout = setTimeout(doLayout, 0);
				};

				layout();

				document.querySelectorAll('img').forEach(element => {
					element.onload = layout;
				})

				window.addEventListener('message', event => {
					if (event.data.layoutMeNow) {
						layout();
					}
					if (event.data.enabledContextKeys) {
						document.querySelectorAll('.checked').forEach(element => element.classList.remove('checked'))
						for (const key of event.data.enabledContextKeys) {
							document.querySelectorAll('[checked-on="' + key + '"]').forEach(element => element.classList.add('checked'))
						}
					}
				});
		</script>
		</html>`;
	}

	async renderSVG(path: URI): Promise<string> {
		const content = await this.readAndCacheSVGFile(path);
		const nonce = generateUuid();
		const colorMap = TokenizationRegistry.getColorMap();

		const css = colorMap ? generateTokensCSSForColorMap(colorMap) : '';
		return `<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'nonce-${nonce}';">
				<style nonce="${nonce}">
					${DEFAULT_MARKDOWN_STYLES}
					${css}
					svg {
						position: fixed;
						height: 100%;
						width: 80%;
						left: 50%;
						top: 50%;
						max-width: 530px;
						min-width: 350px;
						transform: translate(-50%,-50%);
					}
				</style>
			</head>
			<body>
				${content}
			</body>
		</html>`;
	}

	async renderVideo(path: URI, poster?: URI, description?: string): Promise<string> {
		const nonce = generateUuid();

		return `<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; media-src https:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
				<style nonce="${nonce}">
					video {
						max-width: 100%;
						max-height: 100%;
						object-fit: cover;
					}
				</style>
			</head>
			<body>
				<video controls autoplay ${poster ? `poster="${poster.toString(true)}"` : ''} muted ${description ? `aria-label="${description}"` : ''}>
					<source src="${path.toString(true)}" type="video/mp4">
				</video>
			</body>
		</html>`;
	}

	private async readAndCacheSVGFile(path: URI): Promise<string> {
		if (!this.svgCache.has(path)) {
			const contents = await this.readContentsOfPath(path, false);
			this.svgCache.set(path, contents);
		}
		return assertReturnsDefined(this.svgCache.get(path));
	}

	private async readAndCacheStepMarkdown(path: URI, base: URI): Promise<TrustedHTML> {
		if (!this.mdCache.has(path)) {
			const contents = await this.readContentsOfPath(path);
			const markdownContents = await renderMarkdownDocument(transformUris(contents, base), this.extensionService, this.languageService, {
				sanitizerConfig: {
					allowedLinkProtocols: {
						override: '*'
					},
					allowedTags: {
						augment: [
							'select',
							'checkbox',
							'checklist',
						]
					},
					allowedAttributes: {
						augment: [
							'x-dispatch',
							'data-command',
							'when-checked',
							'checked-on',
							'checked',
						]
					},
				}
			});
			this.mdCache.set(path, markdownContents);
		}
		return assertReturnsDefined(this.mdCache.get(path));
	}

	private async readContentsOfPath(path: URI, useModuleId = true): Promise<string> {
		try {
			const moduleId = JSON.parse(path.query).moduleId;
			if (useModuleId && moduleId) {
				const contents = await new Promise<string>((resolve, reject) => {
					const provider = gettingStartedContentRegistry.getProvider(moduleId);
					if (!provider) {
						reject(`Getting started: no provider registered for ${moduleId}`);
					} else {
						resolve(provider());
					}
				});
				return contents;
			}
		} catch { }

		try {
			const localizedPath = path.with({ path: path.path.replace(/\.md$/, `.nls.${language}.md`) });

			const generalizedLocale = language?.replace(/-.*$/, '');
			const generalizedLocalizedPath = path.with({ path: path.path.replace(/\.md$/, `.nls.${generalizedLocale}.md`) });

			const fileExists = (file: URI) => this.fileService
				.stat(file)
				.then((stat) => !!stat.size) // Double check the file actually has content for fileSystemProviders that fake `stat`. #131809
				.catch(() => false);

			const [localizedFileExists, generalizedLocalizedFileExists] = await Promise.all([
				fileExists(localizedPath),
				fileExists(generalizedLocalizedPath),
			]);

			const bytes = await this.fileService.readFile(
				localizedFileExists
					? localizedPath
					: generalizedLocalizedFileExists
						? generalizedLocalizedPath
						: path);

			return bytes.value.toString();
		} catch (e) {
			this.notificationService.error('Error reading markdown document at `' + path + '`: ' + e);
			return '';
		}
	}
}

const transformUri = (src: string, base: URI) => {
	const path = joinPath(base, src);
	return asWebviewUri(path).toString(true);
};

const transformUris = (content: string, base: URI): string => content
	.replace(/src="([^"]*)"/g, (_, src: string) => {
		if (src.startsWith('https://')) { return `src="${src}"`; }
		return `src="${transformUri(src, base)}"`;
	})
	.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (_, title: string, src: string) => {
		if (src.startsWith('https://')) { return `![${title}](${src})`; }
		return `![${title}](${transformUri(src, base)})`;
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IWalkthrough } from '../../../../platform/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';

const titleTranslated = localize('title', "Title");

export const walkthroughsExtensionPoint = ExtensionsRegistry.registerExtensionPoint<IWalkthrough[]>({
	extensionPoint: 'walkthroughs',
	jsonSchema: {
		description: localize('walkthroughs', "Contribute walkthroughs to help users getting started with your extension."),
		type: 'array',
		items: {
			type: 'object',
			required: ['id', 'title', 'description', 'steps'],
			defaultSnippets: [{ body: { 'id': '$1', 'title': '$2', 'description': '$3', 'steps': [] } }],
			properties: {
				id: {
					type: 'string',
					description: localize('walkthroughs.id', "Unique identifier for this walkthrough."),
				},
				title: {
					type: 'string',
					description: localize('walkthroughs.title', "Title of walkthrough.")
				},
				icon: {
					type: 'string',
					description: localize('walkthroughs.icon', "Relative path to the icon of the walkthrough. The path is relative to the extension location. If not specified, the icon defaults to the extension icon if available."),
				},
				description: {
					type: 'string',
					description: localize('walkthroughs.description', "Description of walkthrough.")
				},
				featuredFor: {
					type: 'array',
					description: localize('walkthroughs.featuredFor', "Walkthroughs that match one of these glob patterns appear as 'featured' in workspaces with the specified files. For example, a walkthrough for TypeScript projects might specify `tsconfig.json` here."),
					items: {
						type: 'string'
					},
				},
				when: {
					type: 'string',
					description: localize('walkthroughs.when', "Context key expression to control the visibility of this walkthrough.")
				},
				steps: {
					type: 'array',
					description: localize('walkthroughs.steps', "Steps to complete as part of this walkthrough."),
					items: {
						type: 'object',
						required: ['id', 'title', 'media'],
						defaultSnippets: [{
							body: {
								'id': '$1', 'title': '$2', 'description': '$3',
								'completionEvents': ['$5'],
								'media': {},
							}
						}],
						properties: {
							id: {
								type: 'string',
								description: localize('walkthroughs.steps.id', "Unique identifier for this step. This is used to keep track of which steps have been completed."),
							},
							title: {
								type: 'string',
								description: localize('walkthroughs.steps.title', "Title of step.")
							},
							description: {
								type: 'string',
								description: localize('walkthroughs.steps.description.interpolated', "Description of step. Supports ``preformatted``, __italic__, and **bold** text. Use markdown-style links for commands or external links: {0}, {1}, or {2}. Links on their own line will be rendered as buttons.", `[${titleTranslated}](command:myext.command)`, `[${titleTranslated}](command:toSide:myext.command)`, `[${titleTranslated}](https://aka.ms)`)
							},
							button: {
								deprecationMessage: localize('walkthroughs.steps.button.deprecated.interpolated', "Deprecated. Use markdown links in the description instead, i.e. {0}, {1}, or {2}", `[${titleTranslated}](command:myext.command)`, `[${titleTranslated}](command:toSide:myext.command)`, `[${titleTranslated}](https://aka.ms)`),
							},
							media: {
								type: 'object',
								description: localize('walkthroughs.steps.media', "Media to show alongside this step, either an image or markdown content."),
								oneOf: [
									{
										required: ['image', 'altText'],
										additionalProperties: false,
										properties: {
											path: {
												deprecationMessage: localize('pathDeprecated', "Deprecated. Please use `image` or `markdown` instead")
											},
											image: {
												description: localize('walkthroughs.steps.media.image.path.string', "Path to an image - or object consisting of paths to light, dark, and hc images - relative to extension directory. Depending on context, the image will be displayed from 400px to 800px wide, with similar bounds on height. To support HIDPI displays, the image will be rendered at 1.5x scaling, for example a 900 physical pixels wide image will be displayed as 600 logical pixels wide."),
												oneOf: [
													{
														type: 'string',
													},
													{
														type: 'object',
														required: ['dark', 'light', 'hc', 'hcLight'],
														properties: {
															dark: {
																description: localize('walkthroughs.steps.media.image.path.dark.string', "Path to the image for dark themes, relative to extension directory."),
																type: 'string',
															},
															light: {
																description: localize('walkthroughs.steps.media.image.path.light.string', "Path to the image for light themes, relative to extension directory."),
																type: 'string',
															},
															hc: {
																description: localize('walkthroughs.steps.media.image.path.hc.string', "Path to the image for hc themes, relative to extension directory."),
																type: 'string',
															},
															hcLight: {
																description: localize('walkthroughs.steps.media.image.path.hcLight.string', "Path to the image for hc light themes, relative to extension directory."),
																type: 'string',
															}
														}
													}
												]
											},
											altText: {
												type: 'string',
												description: localize('walkthroughs.steps.media.altText', "Alternate text to display when the image cannot be loaded or in screen readers.")
											}
										}
									},
									{
										required: ['svg', 'altText'],
										additionalProperties: false,
										properties: {
											svg: {
												description: localize('walkthroughs.steps.media.image.path.svg', "Path to an svg, color tokens are supported in variables to support theming to match the workbench."),
												type: 'string',
											},
											altText: {
												type: 'string',
												description: localize('walkthroughs.steps.media.altText', "Alternate text to display when the image cannot be loaded or in screen readers.")
											},
										}
									},
									{
										required: ['markdown'],
										additionalProperties: false,
										properties: {
											path: {
												deprecationMessage: localize('pathDeprecated', "Deprecated. Please use `image` or `markdown` instead")
											},
											markdown: {
												description: localize('walkthroughs.steps.media.markdown.path', "Path to the markdown document, relative to extension directory."),
												type: 'string',
											}
										}
									}
								]
							},
							completionEvents: {
								description: localize('walkthroughs.steps.completionEvents', "Events that should trigger this step to become checked off. If empty or not defined, the step will check off when any of the step's buttons or links are clicked; if the step has no buttons or links it will check on when it is selected."),
								type: 'array',
								items: {
									type: 'string',
									defaultSnippets: [
										{
											label: 'onCommand',
											description: localize('walkthroughs.steps.completionEvents.onCommand', 'Check off step when a given command is executed anywhere in VS Code.'),
											body: 'onCommand:${1:commandId}'
										},
										{
											label: 'onLink',
											description: localize('walkthroughs.steps.completionEvents.onLink', 'Check off step when a given link is opened via a walkthrough step.'),
											body: 'onLink:${2:linkId}'
										},
										{
											label: 'onView',
											description: localize('walkthroughs.steps.completionEvents.onView', 'Check off step when a given view is opened'),
											body: 'onView:${2:viewId}'
										},
										{
											label: 'onSettingChanged',
											description: localize('walkthroughs.steps.completionEvents.onSettingChanged', 'Check off step when a given setting is changed'),
											body: 'onSettingChanged:${2:settingName}'
										},
										{
											label: 'onContext',
											description: localize('walkthroughs.steps.completionEvents.onContext', 'Check off step when a context key expression is true.'),
											body: 'onContext:${2:key}'
										},
										{
											label: 'onExtensionInstalled',
											description: localize('walkthroughs.steps.completionEvents.extensionInstalled', 'Check off step when an extension with the given id is installed. If the extension is already installed, the step will start off checked.'),
											body: 'onExtensionInstalled:${3:extensionId}'
										},
										{
											label: 'onStepSelected',
											description: localize('walkthroughs.steps.completionEvents.stepSelected', 'Check off step as soon as it is selected.'),
											body: 'onStepSelected'
										},
									]
								}
							},
							doneOn: {
								description: localize('walkthroughs.steps.doneOn', "Signal to mark step as complete."),
								deprecationMessage: localize('walkthroughs.steps.doneOn.deprecation', "doneOn is deprecated. By default steps will be checked off when their buttons are clicked, to configure further use completionEvents"),
								type: 'object',
								required: ['command'],
								defaultSnippets: [{ 'body': { command: '$1' } }],
								properties: {
									'command': {
										description: localize('walkthroughs.steps.oneOn.command', "Mark step done when the specified command is executed."),
										type: 'string'
									}
								},
							},
							when: {
								type: 'string',
								description: localize('walkthroughs.steps.when', "Context key expression to control the visibility of this step.")
							}
						}
					}
				}
			}
		}
	},
	activationEventsGenerator: function* (walkthroughContributions) {
		for (const walkthroughContribution of walkthroughContributions) {
			if (walkthroughContribution.id) {
				yield `onWalkthrough:${walkthroughContribution.id}`;
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js'; import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const gettingStartedUncheckedCodicon = registerIcon('getting-started-step-unchecked', Codicon.circleLargeOutline, localize('gettingStartedUnchecked', "Used to represent walkthrough steps which have not been completed"));
export const gettingStartedCheckedCodicon = registerIcon('getting-started-step-checked', Codicon.passFilled, localize('gettingStartedChecked', "Used to represent walkthrough steps which have been completed"));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/gettingStarted.css';
import { localize } from '../../../../nls.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { URI } from '../../../../base/common/uri.js';
import { Schemas } from '../../../../base/common/network.js';
import { IUntypedEditorInput } from '../../../common/editor.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';

export const gettingStartedInputTypeId = 'workbench.editors.gettingStartedInput';

export interface GettingStartedEditorOptions extends IEditorOptions {
	selectedCategory?: string;
	selectedStep?: string;
	showTelemetryNotice?: boolean;
	showWelcome?: boolean;
	walkthroughPageTitle?: string;
	showNewExperience?: boolean;
}

export class GettingStartedInput extends EditorInput {

	static readonly ID = gettingStartedInputTypeId;
	static readonly RESOURCE = URI.from({ scheme: Schemas.walkThrough, authority: 'vscode_getting_started_page' });
	private _selectedCategory: string | undefined;
	private _selectedStep: string | undefined;
	private _showTelemetryNotice: boolean;
	private _showWelcome: boolean;

	private _walkthroughPageTitle: string | undefined;

	override get typeId(): string {
		return GettingStartedInput.ID;
	}

	override get editorId(): string | undefined {
		return this.typeId;
	}

	override toUntyped(): IUntypedEditorInput {
		return {
			resource: GettingStartedInput.RESOURCE,
			options: {
				override: GettingStartedInput.ID,
				pinned: false
			}
		};
	}

	get resource(): URI | undefined {
		return GettingStartedInput.RESOURCE;
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		return other instanceof GettingStartedInput;
	}

	constructor(
		options: GettingStartedEditorOptions) {
		super();
		this._selectedCategory = options.selectedCategory;
		this._selectedStep = options.selectedStep;
		this._showTelemetryNotice = !!options.showTelemetryNotice;
		this._showWelcome = options.showWelcome ?? true;
		this._walkthroughPageTitle = options.walkthroughPageTitle;
	}

	override getName() {
		return this.walkthroughPageTitle ? localize('walkthroughPageTitle', 'Walkthrough: {0}', this.walkthroughPageTitle) : localize('getStarted', "Welcome");
	}

	get selectedCategory() {
		return this._selectedCategory;
	}

	set selectedCategory(selectedCategory: string | undefined) {
		this._selectedCategory = selectedCategory;
		this._onDidChangeLabel.fire();
	}

	get selectedStep() {
		return this._selectedStep;
	}

	set selectedStep(selectedStep: string | undefined) {
		this._selectedStep = selectedStep;
	}

	get showTelemetryNotice(): boolean {
		return this._showTelemetryNotice;
	}

	set showTelemetryNotice(value: boolean) {
		this._showTelemetryNotice = value;
	}

	get showWelcome(): boolean {
		return this._showWelcome;
	}

	set showWelcome(value: boolean) {
		this._showWelcome = value;
	}

	get walkthroughPageTitle(): string | undefined {
		return this._walkthroughPageTitle;
	}

	set walkthroughPageTitle(value: string | undefined) {
		this._walkthroughPageTitle = value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedList.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { $, Dimension } from '../../../../base/browser/dom.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { equals } from '../../../../base/common/arrays.js';

type GettingStartedIndexListOptions<T> = {
	title: string;
	klass: string;
	limit: number;
	empty?: HTMLElement | undefined;
	more?: HTMLElement | undefined;
	footer?: HTMLElement | undefined;
	renderElement: (item: T) => HTMLElement;
	rankElement?: (item: T) => number | null;
	contextService: IContextKeyService;
};

export class GettingStartedIndexList<T extends { id: string; when?: ContextKeyExpression }> extends Disposable {
	private readonly _onDidChangeEntries = new Emitter<void>();
	private readonly onDidChangeEntries: Event<void> = this._onDidChangeEntries.event;

	private domElement: HTMLElement;
	private list: HTMLUListElement;
	private scrollbar: DomScrollableElement;

	private entries: undefined | T[];

	private lastRendered: string[] | undefined;

	public itemCount: number;

	private isDisposed = false;

	private contextService: IContextKeyService;
	private contextKeysToWatch = new Set<string>();

	constructor(
		private options: GettingStartedIndexListOptions<T>
	) {
		super();

		this.contextService = options.contextService;

		this.entries = undefined;

		this.itemCount = 0;
		this.list = $('ul');
		this.scrollbar = this._register(new DomScrollableElement(this.list, {}));
		this._register(this.onDidChangeEntries(() => this.scrollbar.scanDomNode()));
		this.domElement = $('.index-list.' + options.klass, {},
			$('h2', {}, options.title),
			this.scrollbar.getDomNode());

		this._register(this.contextService.onDidChangeContext(e => {
			if (e.affectsSome(this.contextKeysToWatch)) {
				this.rerender();
			}
		}));
	}

	getDomElement() {
		return this.domElement;
	}

	layout(size: Dimension) {
		this.scrollbar.scanDomNode();
	}

	onDidChange(listener: () => void) {
		this._register(this.onDidChangeEntries(listener));
	}

	register(d: IDisposable) { if (this.isDisposed) { d.dispose(); } else { this._register(d); } }

	override dispose() {
		this.isDisposed = true;
		super.dispose();
	}

	setLimit(limit: number) {
		this.options.limit = limit;
		this.setEntries(this.entries);
	}

	rerender() {
		this.setEntries(this.entries);
	}

	setEntries(entries: undefined | T[]) {
		let entryList = entries ?? [];

		this.itemCount = 0;

		const ranker = this.options.rankElement;
		if (ranker) {
			entryList = entryList.filter(e => ranker(e) !== null);
			entryList.sort((a, b) => ranker(b)! - ranker(a)!);
		}

		const activeEntries = entryList.filter(e => !e.when || this.contextService.contextMatchesRules(e.when));
		const limitedEntries = activeEntries.slice(0, this.options.limit);

		const toRender = limitedEntries.map(e => e.id);

		if (this.entries === entries && equals(toRender, this.lastRendered)) { return; }
		this.entries = entries;

		this.contextKeysToWatch.clear();
		entryList.forEach(e => {
			const keys = e.when?.keys();
			keys?.forEach(key => this.contextKeysToWatch.add(key));
		});

		this.lastRendered = toRender;
		this.itemCount = limitedEntries.length;


		while (this.list.firstChild) {
			this.list.firstChild.remove();
		}

		this.itemCount = limitedEntries.length;
		for (const entry of limitedEntries) {
			const rendered = this.options.renderElement(entry);
			this.list.appendChild(rendered);
		}

		if (activeEntries.length > limitedEntries.length && this.options.more) {
			this.list.appendChild(this.options.more);
		}
		else if (entries !== undefined && this.itemCount === 0 && this.options.empty) {
			this.list.appendChild(this.options.empty);
		}
		else if (this.options.footer) {
			this.list.appendChild(this.options.footer);
		}

		this._onDidChangeEntries.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedService.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { joinPath } from '../../../../base/common/resources.js';
import { FileAccess } from '../../../../base/common/network.js';
import { EXTENSION_INSTALL_DEP_PACK_CONTEXT, EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT, IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { walkthroughs } from '../common/gettingStartedContent.js';
import { IWorkbenchAssignmentService } from '../../../services/assignment/common/assignmentService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILink, LinkedText, parseLinkedText } from '../../../../base/common/linkedText.js';
import { walkthroughsExtensionPoint } from './gettingStartedExtensionPoint.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { dirname } from '../../../../base/common/path.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { localize, localize2 } from '../../../../nls.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { checkGlobFileExists } from '../../../services/extensions/common/workspaceContains.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { asWebviewUri } from '../../webview/common/webview.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { extensionDefaultIcon } from '../../../services/extensionManagement/common/extensionsIcons.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { GettingStartedInput } from './gettingStartedInput.js';

export const HasMultipleNewFileEntries = new RawContextKey<boolean>('hasMultipleNewFileEntries', false);

export const IWalkthroughsService = createDecorator<IWalkthroughsService>('walkthroughsService');

export const hiddenEntriesConfigurationKey = 'workbench.welcomePage.hiddenCategories';

export const walkthroughMetadataConfigurationKey = 'workbench.welcomePage.walkthroughMetadata';
export type WalkthroughMetaDataType = Map<string, { firstSeen: number; stepIDs: string[]; manaullyOpened: boolean }>;

const BUILT_IN_SOURCE = localize('builtin', "Built-In");

export interface IWalkthrough {
	id: string;
	title: string;
	description: string;
	order: number;
	source: string;
	isFeatured: boolean;
	next?: string;
	when: ContextKeyExpression;
	steps: IWalkthroughStep[];
	icon:
	| { type: 'icon'; icon: ThemeIcon }
	| { type: 'image'; path: string };
	walkthroughPageTitle: string;
}

export type IWalkthroughLoose = Omit<IWalkthrough, 'steps'> & { steps: (Omit<IWalkthroughStep, 'description'> & { description: string })[] };

export interface IResolvedWalkthrough extends IWalkthrough {
	steps: IResolvedWalkthroughStep[];
	newItems: boolean;
	recencyBonus: number;
	newEntry: boolean;
}

export interface IWalkthroughStep {
	id: string;
	title: string;
	description: LinkedText[];
	category: string;
	when: ContextKeyExpression;
	order: number;
	completionEvents: string[];
	media:
	| { type: 'image'; path: { hcDark: URI; hcLight: URI; light: URI; dark: URI }; altText: string }
	| { type: 'svg'; path: URI; altText: string }
	| { type: 'markdown'; path: URI; base: URI; root: URI }
	| { type: 'video'; path: { hcDark: URI; hcLight: URI; light: URI; dark: URI }; poster?: { hcDark: URI; hcLight: URI; light: URI; dark: URI }; root: URI; altText: string };
}

type StepProgress = { done: boolean };

export interface IResolvedWalkthroughStep extends IWalkthroughStep, StepProgress { }

export interface IWalkthroughsService {
	_serviceBrand: undefined;

	readonly onDidAddWalkthrough: Event<IResolvedWalkthrough>;
	readonly onDidRemoveWalkthrough: Event<string>;
	readonly onDidChangeWalkthrough: Event<IResolvedWalkthrough>;
	readonly onDidProgressStep: Event<IResolvedWalkthroughStep>;

	getWalkthroughs(): IResolvedWalkthrough[];
	getWalkthrough(id: string): IResolvedWalkthrough;

	registerWalkthrough(descriptor: IWalkthroughLoose): void;

	progressByEvent(eventName: string): void;
	progressStep(id: string): void;
	deprogressStep(id: string): void;

	markWalkthroughOpened(id: string): void;
}

// Show walkthrough as "new" for 7 days after first install
const DAYS = 24 * 60 * 60 * 1000;
const NEW_WALKTHROUGH_TIME = 7 * DAYS;

export class WalkthroughsService extends Disposable implements IWalkthroughsService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidAddWalkthrough = new Emitter<IResolvedWalkthrough>();
	readonly onDidAddWalkthrough: Event<IResolvedWalkthrough> = this._onDidAddWalkthrough.event;
	private readonly _onDidRemoveWalkthrough = new Emitter<string>();
	readonly onDidRemoveWalkthrough: Event<string> = this._onDidRemoveWalkthrough.event;
	private readonly _onDidChangeWalkthrough = new Emitter<IResolvedWalkthrough>();
	readonly onDidChangeWalkthrough: Event<IResolvedWalkthrough> = this._onDidChangeWalkthrough.event;
	private readonly _onDidProgressStep = new Emitter<IResolvedWalkthroughStep>();
	readonly onDidProgressStep: Event<IResolvedWalkthroughStep> = this._onDidProgressStep.event;

	private memento: Memento<Record<string, StepProgress | undefined>>;
	private stepProgress: Record<string, StepProgress | undefined>;

	private sessionEvents = new Set<string>();
	private completionListeners = new Map<string, Set<string>>();

	private gettingStartedContributions = new Map<string, IWalkthrough>();
	private steps = new Map<string, IWalkthroughStep>();

	private sessionInstalledExtensions: Set<string> = new Set<string>();

	private categoryVisibilityContextKeys = new Set<string>();
	private stepCompletionContextKeyExpressions = new Set<ContextKeyExpression>();
	private stepCompletionContextKeys = new Set<string>();

	private metadata: WalkthroughMetaDataType;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@ICommandService private readonly commandService: ICommandService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IContextKeyService private readonly contextService: IContextKeyService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IHostService private readonly hostService: IHostService,
		@IViewsService private readonly viewsService: IViewsService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkbenchAssignmentService private readonly tasExperimentService: IWorkbenchAssignmentService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IEditorService private readonly editorService: IEditorService
	) {
		super();

		this.metadata = new Map(
			JSON.parse(
				this.storageService.get(walkthroughMetadataConfigurationKey, StorageScope.PROFILE, '[]')));

		this.memento = new Memento('gettingStartedService', this.storageService);
		this.stepProgress = this.memento.getMemento(StorageScope.PROFILE, StorageTarget.USER);

		this.initCompletionEventListeners();

		HasMultipleNewFileEntries.bindTo(this.contextService).set(false);
		this.registerWalkthroughs();

	}

	private registerWalkthroughs() {

		walkthroughs.forEach(async (category, index) => {

			this._registerWalkthrough({
				...category,
				icon: { type: 'icon', icon: category.icon },
				order: walkthroughs.length - index,
				source: BUILT_IN_SOURCE,
				when: ContextKeyExpr.deserialize(category.when) ?? ContextKeyExpr.true(),
				steps:
					category.content.steps.map((step, index) => {
						return ({
							...step,
							completionEvents: step.completionEvents ?? [],
							description: parseDescription(step.description),
							category: category.id,
							order: index,
							when: ContextKeyExpr.deserialize(step.when) ?? ContextKeyExpr.true(),
							media: step.media.type === 'image'
								? {
									type: 'image',
									altText: step.media.altText,
									path: convertInternalMediaPathsToBrowserURIs(step.media.path)
								}
								: step.media.type === 'svg'
									? {
										type: 'svg',
										altText: step.media.altText,
										path: convertInternalMediaPathToFileURI(step.media.path).with({ query: JSON.stringify({ moduleId: 'vs/workbench/contrib/welcomeGettingStarted/common/media/' + step.media.path }) })
									}
									: step.media.type === 'markdown'
										? {
											type: 'markdown',
											path: convertInternalMediaPathToFileURI(step.media.path).with({ query: JSON.stringify({ moduleId: 'vs/workbench/contrib/welcomeGettingStarted/common/media/' + step.media.path }) }),
											base: FileAccess.asFileUri('vs/workbench/contrib/welcomeGettingStarted/common/media/'),
											root: FileAccess.asFileUri('vs/workbench/contrib/welcomeGettingStarted/common/media/'),
										}
										: {
											type: 'video',
											path: convertRelativeMediaPathsToWebviewURIs(FileAccess.asFileUri('vs/workbench/contrib/welcomeGettingStarted/common/media/'), step.media.path),
											altText: step.media.altText,
											root: FileAccess.asFileUri('vs/workbench/contrib/welcomeGettingStarted/common/media/'),
											poster: step.media.poster ? convertRelativeMediaPathsToWebviewURIs(FileAccess.asFileUri('vs/workbench/contrib/welcomeGettingStarted/common/media/'), step.media.poster) : undefined
										},
						});
					})
			});
		});

		walkthroughsExtensionPoint.setHandler((_, { added, removed }) => {
			added.map(e => this.registerExtensionWalkthroughContributions(e.description));
			removed.map(e => this.unregisterExtensionWalkthroughContributions(e.description));
		});
	}

	private initCompletionEventListeners() {
		this._register(this.commandService.onDidExecuteCommand(command => this.progressByEvent(`onCommand:${command.commandId}`)));

		this.extensionManagementService.getInstalled().then(installed => {
			installed.forEach(ext => this.progressByEvent(`extensionInstalled:${ext.identifier.id.toLowerCase()}`));
		});

		this._register(this.extensionManagementService.onDidInstallExtensions((result) => {

			for (const e of result) {
				const skipWalkthrough = e?.context?.[EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT] || e?.context?.[EXTENSION_INSTALL_DEP_PACK_CONTEXT];
				// If the window had last focus and the install didn't specify to skip the walkthrough
				// Then add it to the sessionInstallExtensions to be opened
				if (!skipWalkthrough) {
					this.sessionInstalledExtensions.add(e.identifier.id.toLowerCase());
				}
				this.progressByEvent(`extensionInstalled:${e.identifier.id.toLowerCase()}`);
			}
		}));

		this._register(this.contextService.onDidChangeContext(event => {
			if (event.affectsSome(this.stepCompletionContextKeys)) {
				this.stepCompletionContextKeyExpressions.forEach(expression => {
					if (event.affectsSome(new Set(expression.keys())) && this.contextService.contextMatchesRules(expression)) {
						this.progressByEvent(`onContext:` + expression.serialize());
					}
				});
			}
		}));

		this._register(this.viewsService.onDidChangeViewVisibility(e => {
			if (e.visible) { this.progressByEvent('onView:' + e.id); }
		}));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			e.affectedKeys.forEach(key => { this.progressByEvent('onSettingChanged:' + key); });
		}));

		if (this.userDataSyncEnablementService.isEnabled()) { this.progressByEvent('onEvent:sync-enabled'); }
		this._register(this.userDataSyncEnablementService.onDidChangeEnablement(() => {
			if (this.userDataSyncEnablementService.isEnabled()) { this.progressByEvent('onEvent:sync-enabled'); }
		}));
	}

	markWalkthroughOpened(id: string) {
		const walkthrough = this.gettingStartedContributions.get(id);
		const prior = this.metadata.get(id);
		if (prior && walkthrough) {
			this.metadata.set(id, { ...prior, manaullyOpened: true, stepIDs: walkthrough.steps.map(s => s.id) });
		}

		this.storageService.store(walkthroughMetadataConfigurationKey, JSON.stringify([...this.metadata.entries()]), StorageScope.PROFILE, StorageTarget.USER);
	}

	private async registerExtensionWalkthroughContributions(extension: IExtensionDescription) {
		const convertExtensionPathToFileURI = (path: string) => path.startsWith('https://')
			? URI.parse(path, true)
			: FileAccess.uriToFileUri(joinPath(extension.extensionLocation, path));

		const convertExtensionRelativePathsToBrowserURIs = (path: string | { hc: string; hcLight?: string; dark: string; light: string }): { hcDark: URI; hcLight: URI; dark: URI; light: URI } => {
			const convertPath = (path: string) => path.startsWith('https://')
				? URI.parse(path, true)
				: FileAccess.uriToBrowserUri(joinPath(extension.extensionLocation, path));

			if (typeof path === 'string') {
				const converted = convertPath(path);
				return { hcDark: converted, hcLight: converted, dark: converted, light: converted };
			} else {
				return {
					hcDark: convertPath(path.hc),
					hcLight: convertPath(path.hcLight ?? path.light),
					light: convertPath(path.light),
					dark: convertPath(path.dark)
				};
			}
		};

		if (!(extension.contributes?.walkthroughs?.length)) {
			return;
		}

		let sectionToOpen: string | undefined;
		let sectionToOpenIndex = Math.min(); // '+Infinity';
		await Promise.all(extension.contributes?.walkthroughs?.map(async (walkthrough, index) => {
			const categoryID = extension.identifier.value + '#' + walkthrough.id;

			const isNewlyInstalled = !this.metadata.get(categoryID);
			if (isNewlyInstalled) {
				this.metadata.set(categoryID, { firstSeen: +new Date(), stepIDs: walkthrough.steps?.map(s => s.id) ?? [], manaullyOpened: false });
			}

			const override = await Promise.race([
				this.tasExperimentService?.getTreatment<string>(`gettingStarted.overrideCategory.${extension.identifier.value + '.' + walkthrough.id}.when`),
				new Promise<string | undefined>(resolve => setTimeout(() => resolve(walkthrough.when), 5000))
			]);

			if (this.sessionInstalledExtensions.has(extension.identifier.value.toLowerCase())
				&& this.contextService.contextMatchesRules(ContextKeyExpr.deserialize(override ?? walkthrough.when) ?? ContextKeyExpr.true())
			) {
				this.sessionInstalledExtensions.delete(extension.identifier.value.toLowerCase());
				if (index < sectionToOpenIndex && isNewlyInstalled) {
					sectionToOpen = categoryID;
					sectionToOpenIndex = index;
				}
			}

			const steps = (walkthrough.steps ?? []).map((step, index) => {
				const description = parseDescription(step.description || '');
				const fullyQualifiedID = extension.identifier.value + '#' + walkthrough.id + '#' + step.id;

				let media: IWalkthroughStep['media'];

				if (!step.media) {
					throw Error('missing media in walkthrough step: ' + walkthrough.id + '@' + step.id);
				}

				if (step.media.image) {
					const altText = step.media.altText;
					if (altText === undefined) {
						console.error('Walkthrough item:', fullyQualifiedID, 'is missing altText for its media element.');
					}
					media = { type: 'image', altText, path: convertExtensionRelativePathsToBrowserURIs(step.media.image) };
				}
				else if (step.media.markdown) {
					media = {
						type: 'markdown',
						path: convertExtensionPathToFileURI(step.media.markdown),
						base: convertExtensionPathToFileURI(dirname(step.media.markdown)),
						root: FileAccess.uriToFileUri(extension.extensionLocation),
					};
				}
				else if (step.media.svg) {
					media = {
						type: 'svg',
						path: convertExtensionPathToFileURI(step.media.svg),
						altText: step.media.svg,
					};
				}
				else if (step.media.video) {
					const baseURI = FileAccess.uriToFileUri(extension.extensionLocation);
					media = {
						type: 'video',
						path: convertRelativeMediaPathsToWebviewURIs(baseURI, step.media.video),
						root: FileAccess.uriToFileUri(extension.extensionLocation),
						altText: step.media.altText,
						poster: step.media.poster ? convertRelativeMediaPathsToWebviewURIs(baseURI, step.media.poster) : undefined
					};
				}

				// Throw error for unknown walkthrough format
				else {
					throw new Error('Unknown walkthrough format detected for ' + fullyQualifiedID);
				}

				return ({
					description,
					media,
					completionEvents: step.completionEvents?.filter(x => typeof x === 'string') ?? [],
					id: fullyQualifiedID,
					title: step.title,
					when: ContextKeyExpr.deserialize(step.when) ?? ContextKeyExpr.true(),
					category: categoryID,
					order: index,
				});
			});

			let isFeatured = false;
			if (walkthrough.featuredFor) {
				const folders = this.workspaceContextService.getWorkspace().folders.map(f => f.uri);
				const token = new CancellationTokenSource();
				setTimeout(() => token.cancel(), 2000);
				isFeatured = await this.instantiationService.invokeFunction(a => checkGlobFileExists(a, folders, walkthrough.featuredFor!, token.token));
			}

			const iconStr = walkthrough.icon ?? extension.icon;
			const walkthoughDescriptor: IWalkthrough = {
				description: walkthrough.description,
				title: walkthrough.title,
				id: categoryID,
				isFeatured,
				source: extension.displayName ?? extension.name,
				order: 0,
				walkthroughPageTitle: extension.displayName ?? extension.name,
				steps,
				icon: iconStr ? {
					type: 'image',
					path: FileAccess.uriToBrowserUri(joinPath(extension.extensionLocation, iconStr)).toString(true)
				} : {
					icon: extensionDefaultIcon,
					type: 'icon'
				},
				when: ContextKeyExpr.deserialize(override ?? walkthrough.when) ?? ContextKeyExpr.true(),
			} as const;

			this._registerWalkthrough(walkthoughDescriptor);

			this._onDidAddWalkthrough.fire(this.resolveWalkthrough(walkthoughDescriptor));
		}));

		this.storageService.store(walkthroughMetadataConfigurationKey, JSON.stringify([...this.metadata.entries()]), StorageScope.PROFILE, StorageTarget.USER);

		const hadLastFoucs = await this.hostService.hadLastFocus();
		if (hadLastFoucs && sectionToOpen && this.configurationService.getValue<string>('workbench.welcomePage.walkthroughs.openOnInstall')) {
			type GettingStartedAutoOpenClassification = {
				owner: 'lramos15';
				comment: 'When a walkthrough is opened upon extension installation';
				id: {
					classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight';
					owner: 'lramos15';
					comment: 'Used to understand what walkthroughs are consulted most frequently';
				};
			};
			type GettingStartedAutoOpenEvent = {
				id: string;
			};
			this.telemetryService.publicLog2<GettingStartedAutoOpenEvent, GettingStartedAutoOpenClassification>('gettingStarted.didAutoOpenWalkthrough', { id: sectionToOpen });
			const activeEditor = this.editorService.activeEditor;
			if (activeEditor instanceof GettingStartedInput) {
				this.commandService.executeCommand('workbench.action.keepEditor');
			}
			this.commandService.executeCommand('workbench.action.openWalkthrough', sectionToOpen, {
				inactive: this.layoutService.hasFocus(Parts.EDITOR_PART) // do not steal the active editor away
			});
		}
	}

	private unregisterExtensionWalkthroughContributions(extension: IExtensionDescription) {
		if (!(extension.contributes?.walkthroughs?.length)) {
			return;
		}

		extension.contributes?.walkthroughs?.forEach(section => {
			const categoryID = extension.identifier.value + '#' + section.id;
			section.steps.forEach(step => {
				const fullyQualifiedID = extension.identifier.value + '#' + section.id + '#' + step.id;
				this.steps.delete(fullyQualifiedID);
			});
			this.gettingStartedContributions.delete(categoryID);
			this._onDidRemoveWalkthrough.fire(categoryID);
		});
	}

	getWalkthrough(id: string): IResolvedWalkthrough {

		const walkthrough = this.gettingStartedContributions.get(id);
		if (!walkthrough) { throw Error('Trying to get unknown walkthrough: ' + id); }
		return this.resolveWalkthrough(walkthrough);
	}

	getWalkthroughs(): IResolvedWalkthrough[] {

		const registeredCategories = [...this.gettingStartedContributions.values()];
		const categoriesWithCompletion = registeredCategories
			.map(category => {
				return {
					...category,
					content: {
						type: 'steps' as const,
						steps: category.steps
					}
				};
			})
			.filter(category => category.content.type !== 'steps' || category.content.steps.length)
			.filter(category => category.id !== 'NewWelcomeExperience')
			.map(category => this.resolveWalkthrough(category));

		return categoriesWithCompletion;
	}

	private resolveWalkthrough(category: IWalkthrough): IResolvedWalkthrough {

		const stepsWithProgress = category.steps.map(step => this.getStepProgress(step));

		const hasOpened = this.metadata.get(category.id)?.manaullyOpened;
		const firstSeenDate = this.metadata.get(category.id)?.firstSeen;
		const isNew = firstSeenDate && firstSeenDate > (+new Date() - NEW_WALKTHROUGH_TIME);

		const lastStepIDs = this.metadata.get(category.id)?.stepIDs;
		const rawCategory = this.gettingStartedContributions.get(category.id);
		if (!rawCategory) { throw Error('Could not find walkthrough with id ' + category.id); }

		const currentStepIds: string[] = rawCategory.steps.map(s => s.id);

		const hasNewSteps = lastStepIDs && (currentStepIds.length !== lastStepIDs.length || currentStepIds.some((id, index) => id !== lastStepIDs[index]));

		let recencyBonus = 0;
		if (firstSeenDate) {
			const currentDate = +new Date();
			const timeSinceFirstSeen = currentDate - firstSeenDate;
			recencyBonus = Math.max(0, (NEW_WALKTHROUGH_TIME - timeSinceFirstSeen) / NEW_WALKTHROUGH_TIME);
		}

		return {
			...category,
			recencyBonus,
			steps: stepsWithProgress,
			newItems: !!hasNewSteps,
			newEntry: !!(isNew && !hasOpened),
		};
	}

	private getStepProgress(step: IWalkthroughStep): IResolvedWalkthroughStep {
		return {
			...step,
			done: false,
			...this.stepProgress[step.id]
		};
	}

	progressStep(id: string) {
		const oldProgress = this.stepProgress[id];
		if (!oldProgress || oldProgress.done !== true) {
			this.stepProgress[id] = { done: true };
			this.memento.saveMemento();
			const step = this.getStep(id);
			if (!step) { throw Error('Tried to progress unknown step'); }

			this._onDidProgressStep.fire(this.getStepProgress(step));
		}
	}

	deprogressStep(id: string) {
		delete this.stepProgress[id];
		this.memento.saveMemento();
		const step = this.getStep(id);
		this._onDidProgressStep.fire(this.getStepProgress(step));
	}

	progressByEvent(event: string): void {
		if (this.sessionEvents.has(event)) { return; }

		this.sessionEvents.add(event);
		this.completionListeners.get(event)?.forEach(id => this.progressStep(id));
	}

	registerWalkthrough(walkthoughDescriptor: IWalkthroughLoose) {
		this._registerWalkthrough({
			...walkthoughDescriptor,
			steps: walkthoughDescriptor.steps.map(step => ({ ...step, description: parseDescription(step.description) }))
		});
	}

	_registerWalkthrough(walkthroughDescriptor: IWalkthrough): void {
		const oldCategory = this.gettingStartedContributions.get(walkthroughDescriptor.id);
		if (oldCategory) {
			console.error(`Skipping attempt to overwrite walkthrough. (${walkthroughDescriptor.id})`);
			return;
		}

		this.gettingStartedContributions.set(walkthroughDescriptor.id, walkthroughDescriptor);

		walkthroughDescriptor.steps.forEach(step => {
			if (this.steps.has(step.id)) { throw Error('Attempting to register step with id ' + step.id + ' twice. Second is dropped.'); }
			this.steps.set(step.id, step);
			step.when.keys().forEach(key => this.categoryVisibilityContextKeys.add(key));
			this.registerDoneListeners(step);
		});

		walkthroughDescriptor.when.keys().forEach(key => this.categoryVisibilityContextKeys.add(key));
	}

	private registerDoneListeners(step: IWalkthroughStep) {
		// eslint-disable-next-line local/code-no-any-casts
		if ((step as any).doneOn) {
			console.error(`wakthrough step`, step, `uses deprecated 'doneOn' property. Adopt 'completionEvents' to silence this warning`);
			return;
		}

		if (!step.completionEvents.length) {
			step.completionEvents = coalesce(
				step.description
					.filter(linkedText => linkedText.nodes.length === 1) // only buttons
					.flatMap(linkedText =>
						linkedText.nodes
							.filter(((node): node is ILink => typeof node !== 'string'))
							.map(({ href }) => {
								if (href.startsWith('command:')) {
									return 'onCommand:' + href.slice('command:'.length, href.includes('?') ? href.indexOf('?') : undefined);
								}
								if (href.startsWith('https://') || href.startsWith('http://')) {
									return 'onLink:' + href;
								}
								return undefined;
							})));
		}

		if (!step.completionEvents.length) {
			step.completionEvents.push('stepSelected');
		}

		for (let event of step.completionEvents) {
			const [_, eventType, argument] = /^([^:]*):?(.*)$/.exec(event) ?? [];

			if (!eventType) {
				console.error(`Unknown completionEvent ${event} when registering step ${step.id}`);
				continue;
			}

			switch (eventType) {
				case 'onLink': case 'onEvent': case 'onView': case 'onSettingChanged':
					break;
				case 'onContext': {
					const expression = ContextKeyExpr.deserialize(argument);
					if (expression) {
						this.stepCompletionContextKeyExpressions.add(expression);
						expression.keys().forEach(key => this.stepCompletionContextKeys.add(key));
						event = eventType + ':' + expression.serialize();
						if (this.contextService.contextMatchesRules(expression)) {
							this.sessionEvents.add(event);
						}
					} else {
						console.error('Unable to parse context key expression:', expression, 'in walkthrough step', step.id);
					}
					break;
				}
				case 'onStepSelected': case 'stepSelected':
					event = 'stepSelected:' + step.id;
					break;
				case 'onCommand':
					event = eventType + ':' + argument.replace(/^toSide:/, '');
					break;
				case 'onExtensionInstalled': case 'extensionInstalled':
					event = 'extensionInstalled:' + argument.toLowerCase();
					break;
				default:
					console.error(`Unknown completionEvent ${event} when registering step ${step.id}`);
					continue;
			}

			this.registerCompletionListener(event, step);
		}
	}

	private registerCompletionListener(event: string, step: IWalkthroughStep) {
		if (!this.completionListeners.has(event)) {
			this.completionListeners.set(event, new Set());
		}
		this.completionListeners.get(event)?.add(step.id);
	}

	private getStep(id: string): IWalkthroughStep {
		const step = this.steps.get(id);
		if (!step) { throw Error('Attempting to access step which does not exist in registry ' + id); }
		return step;
	}
}

export const parseDescription = (desc: string): LinkedText[] => desc.split('\n').filter(x => x).map(text => parseLinkedText(text));

export const convertInternalMediaPathToFileURI = (path: string) => path.startsWith('https://')
	? URI.parse(path, true)
	: FileAccess.asFileUri(`vs/workbench/contrib/welcomeGettingStarted/common/media/${path}`);

const convertInternalMediaPathToBrowserURI = (path: string) => path.startsWith('https://')
	? URI.parse(path, true)
	: FileAccess.asBrowserUri(`vs/workbench/contrib/welcomeGettingStarted/common/media/${path}`);
const convertInternalMediaPathsToBrowserURIs = (path: string | { hc: string; hcLight?: string; dark: string; light: string }): { hcDark: URI; hcLight: URI; dark: URI; light: URI } => {
	if (typeof path === 'string') {
		const converted = convertInternalMediaPathToBrowserURI(path);
		return { hcDark: converted, hcLight: converted, dark: converted, light: converted };
	} else {
		return {
			hcDark: convertInternalMediaPathToBrowserURI(path.hc),
			hcLight: convertInternalMediaPathToBrowserURI(path.hcLight ?? path.light),
			light: convertInternalMediaPathToBrowserURI(path.light),
			dark: convertInternalMediaPathToBrowserURI(path.dark)
		};
	}
};

const convertRelativeMediaPathsToWebviewURIs = (basePath: URI, path: string | { hc: string; hcLight?: string; dark: string; light: string }): { hcDark: URI; hcLight: URI; dark: URI; light: URI } => {
	const convertPath = (path: string) => path.startsWith('https://')
		? URI.parse(path, true)
		: asWebviewUri(joinPath(basePath, path));

	if (typeof path === 'string') {
		const converted = convertPath(path);
		return { hcDark: converted, hcLight: converted, dark: converted, light: converted };
	} else {
		return {
			hcDark: convertPath(path.hc),
			hcLight: convertPath(path.hcLight ?? path.light),
			light: convertPath(path.light),
			dark: convertPath(path.dark)
		};
	}
};


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'resetGettingStartedProgress',
			category: localize2('developer', "Developer"),
			title: localize2('resetWelcomePageWalkthroughProgress', "Reset Welcome Page Walkthrough Progress"),
			f1: true,
			metadata: {
				description: localize2('resetGettingStartedProgressDescription', 'Reset the progress of all Walkthrough steps on the Welcome Page to make them appear as if they are being viewed for the first time, providing a fresh start to the getting started experience.'),
			}
		});
	}

	run(accessor: ServicesAccessor) {
		const gettingStartedService = accessor.get(IWalkthroughsService);
		const storageService = accessor.get(IStorageService);

		storageService.store(
			hiddenEntriesConfigurationKey,
			JSON.stringify([]),
			StorageScope.PROFILE,
			StorageTarget.USER);

		storageService.store(
			walkthroughMetadataConfigurationKey,
			JSON.stringify([]),
			StorageScope.PROFILE,
			StorageTarget.USER);

		const memento = new Memento('gettingStartedService', accessor.get(IStorageService));
		const record = memento.getMemento(StorageScope.PROFILE, StorageTarget.USER);
		for (const key in record) {
			if (Object.prototype.hasOwnProperty.call(record, key)) {
				try {
					gettingStartedService.deprogressStep(key);
				} catch (e) {
					console.error(e);
				}
			}
		}
		memento.saveMemento();
	}
});

registerSingleton(IWalkthroughsService, WalkthroughsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/startupPage.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/startupPage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import * as arrays from '../../../../base/common/arrays.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IWorkspaceContextService, UNKNOWN_EMPTY_WINDOW_WORKSPACE, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILifecycleService, LifecyclePhase, StartupKind } from '../../../services/lifecycle/common/lifecycle.js';
import { Disposable, } from '../../../../base/common/lifecycle.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { GettingStartedEditorOptions, GettingStartedInput, gettingStartedInputTypeId } from './gettingStartedInput.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { getTelemetryLevel } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { localize } from '../../../../nls.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { TerminalCommandId } from '../../terminal/common/terminal.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { AuxiliaryBarMaximizedContext } from '../../../common/contextkeys.js';

export const restoreWalkthroughsConfigurationKey = 'workbench.welcomePage.restorableWalkthroughs';
export type RestoreWalkthroughsConfigurationValue = { folder: string; category?: string; step?: string };

const configurationKey = 'workbench.startupEditor';
const oldConfigurationKey = 'workbench.welcome.enabled';
const telemetryOptOutStorageKey = 'workbench.telemetryOptOutShown';

export class StartupPageEditorResolverContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.startupPageEditorResolver';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorResolverService editorResolverService: IEditorResolverService
	) {
		super();

		this._register(editorResolverService.registerEditor(
			`${GettingStartedInput.RESOURCE.scheme}:/**`,
			{
				id: GettingStartedInput.ID,
				label: localize('welcome.displayName', "Welcome Page"),
				priority: RegisteredEditorPriority.builtin,
			},
			{
				singlePerResource: true,
				canSupportResource: uri => uri.scheme === GettingStartedInput.RESOURCE.scheme,
			},
			{
				createEditorInput: ({ options }) => {
					return {
						editor: this.instantiationService.createInstance(GettingStartedInput, options as GettingStartedEditorOptions),
						options: {
							...options,
							pinned: false
						}
					};
				}
			}
		));
	}
}

export class StartupPageRunnerContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.startupPageRunner';

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@IFileService private readonly fileService: IFileService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IProductService private readonly productService: IProductService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@INotificationService private readonly notificationService: INotificationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
		this.run().then(undefined, onUnexpectedError);
		this._register(this.editorService.onDidCloseEditor((e) => {
			if (e.editor instanceof GettingStartedInput) {
				e.editor.selectedCategory = undefined;
				e.editor.selectedStep = undefined;
			}
		}));
	}

	private async run() {

		// Wait for resolving startup editor until we are restored to reduce startup pressure
		await this.lifecycleService.when(LifecyclePhase.Restored);

		if (AuxiliaryBarMaximizedContext.getValue(this.contextKeyService)) {
			// If the auxiliary bar is maximized, we do not show the welcome page.
			return;
		}

		// Always open Welcome page for first-launch, no matter what is open or which startupEditor is set.
		if (
			this.productService.enableTelemetry
			&& this.productService.showTelemetryOptOut
			&& getTelemetryLevel(this.configurationService) !== TelemetryLevel.NONE
			&& !this.environmentService.skipWelcome
			&& !this.storageService.get(telemetryOptOutStorageKey, StorageScope.PROFILE)
		) {
			this.storageService.store(telemetryOptOutStorageKey, true, StorageScope.PROFILE, StorageTarget.USER);
		}

		if (this.tryOpenWalkthroughForFolder()) {
			return;
		}

		const enabled = isStartupPageEnabled(this.configurationService, this.contextService, this.environmentService, this.logService);
		if (enabled && this.lifecycleService.startupKind !== StartupKind.ReloadedWindow) {

			// Open the welcome even if we opened a set of default editors
			if (!this.editorService.activeEditor || this.layoutService.openedDefaultEditors) {
				const startupEditorSetting = this.configurationService.inspect<string>(configurationKey);

				if (startupEditorSetting.value === 'readme') {
					await this.openReadme();
				} else if (startupEditorSetting.value === 'welcomePage' || startupEditorSetting.value === 'welcomePageInEmptyWorkbench') {
					await this.openGettingStarted(true);
				} else if (startupEditorSetting.value === 'terminal') {
					this.commandService.executeCommand(TerminalCommandId.CreateTerminalEditor);
				}
			}
		}
	}

	private tryOpenWalkthroughForFolder(): boolean {
		const toRestore = this.storageService.get(restoreWalkthroughsConfigurationKey, StorageScope.PROFILE);
		if (!toRestore) {
			return false;
		}
		else {
			const restoreData: RestoreWalkthroughsConfigurationValue = JSON.parse(toRestore);
			const currentWorkspace = this.contextService.getWorkspace();
			if (restoreData.folder === UNKNOWN_EMPTY_WINDOW_WORKSPACE.id || restoreData.folder === currentWorkspace.folders[0].uri.toString()) {
				const options: GettingStartedEditorOptions = { selectedCategory: restoreData.category, selectedStep: restoreData.step, pinned: false };
				this.editorService.openEditor({
					resource: GettingStartedInput.RESOURCE,
					options
				});
				this.storageService.remove(restoreWalkthroughsConfigurationKey, StorageScope.PROFILE);
				return true;
			}
		}
		return false;
	}

	private async openReadme() {
		const readmes = arrays.coalesce(
			await Promise.all(this.contextService.getWorkspace().folders.map(
				async folder => {
					const folderUri = folder.uri;
					const folderStat = await this.fileService.resolve(folderUri).catch(onUnexpectedError);
					const files = folderStat?.children ? folderStat.children.map(child => child.name).sort() : [];
					const file = files.find(file => file.toLowerCase() === 'readme.md') || files.find(file => file.toLowerCase().startsWith('readme'));
					if (file) { return joinPath(folderUri, file); }
					else { return undefined; }
				})));

		if (!this.editorService.activeEditor) {
			if (readmes.length) {
				const isMarkDown = (readme: URI) => readme.path.toLowerCase().endsWith('.md');
				await Promise.all([
					this.commandService.executeCommand('markdown.showPreview', null, readmes.filter(isMarkDown), { locked: true }).catch(error => {
						this.notificationService.error(localize('startupPage.markdownPreviewError', 'Could not open markdown preview: {0}.\n\nPlease make sure the markdown extension is enabled.', error.message));
					}),
					this.editorService.openEditors(readmes.filter(readme => !isMarkDown(readme)).map(readme => ({ resource: readme }))),
				]);
			} else {
				// If no readme is found, default to showing the welcome page.
				await this.openGettingStarted();
			}
		}
	}

	private async openGettingStarted(showTelemetryNotice?: boolean) {
		const startupEditorTypeID = gettingStartedInputTypeId;
		const editor = this.editorService.activeEditor;

		// Ensure that the welcome editor won't get opened more than once
		if (editor?.typeId === startupEditorTypeID || this.editorService.editors.some(e => e.typeId === startupEditorTypeID)) {
			return;
		}

		const options: GettingStartedEditorOptions = editor ? { pinned: false, index: 0, showTelemetryNotice } : { pinned: false, showTelemetryNotice };
		if (startupEditorTypeID === gettingStartedInputTypeId) {
			this.editorService.openEditor({
				resource: GettingStartedInput.RESOURCE,
				options,
			});
		}
	}
}

function isStartupPageEnabled(configurationService: IConfigurationService, contextService: IWorkspaceContextService, environmentService: IWorkbenchEnvironmentService, logService: ILogService) {
	if (environmentService.skipWelcome) {
		return false;
	}

	const startupEditor = configurationService.inspect<string>(configurationKey);
	if (!startupEditor.userValue && !startupEditor.workspaceValue) {
		const welcomeEnabled = configurationService.inspect(oldConfigurationKey);
		if (welcomeEnabled.value !== undefined && welcomeEnabled.value !== null) {
			return welcomeEnabled.value;
		}
	}

	return startupEditor.value === 'welcomePage'
		|| startupEditor.value === 'readme'
		|| (contextService.getWorkbenchState() === WorkbenchState.EMPTY && startupEditor.value === 'welcomePageInEmptyWorkbench')
		|| startupEditor.value === 'terminal';
}
```

--------------------------------------------------------------------------------

````

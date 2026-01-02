---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 407
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 407 of 552)

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

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServersView.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServersView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/mcpServersView.css';
import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IListContextMenuEvent } from '../../../../base/browser/ui/list/list.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMarkdownCommandLink, MarkdownString } from '../../../../base/common/htmlContent.js';
import { combinedDisposable, Disposable, DisposableStore, dispose, IDisposable, isDisposable } from '../../../../base/common/lifecycle.js';
import { DelayedPagedModel, IPagedModel, PagedModel, IterativePagedModel } from '../../../../base/common/paging.js';
import { localize, localize2 } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyDefinedExpr, ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { WorkbenchPagedList } from '../../../../platform/list/browser/listService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { getLocationBasedViewColors } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IViewDescriptorService, IViewsRegistry, ViewContainerLocation, Extensions as ViewExtensions } from '../../../common/views.js';
import { HasInstalledMcpServersContext, IMcpWorkbenchService, InstalledMcpServersViewId, IWorkbenchMcpServer, McpServerContainers, McpServerEnablementState, McpServersGalleryStatusContext } from '../common/mcpTypes.js';
import { DropDownAction, getContextMenuActions, InstallAction, InstallingLabelAction, ManageMcpServerAction, McpServerStatusAction } from './mcpServerActions.js';
import { PublisherWidget, StarredWidget, McpServerIconWidget, McpServerHoverWidget, McpServerScopeBadgeWidget } from './mcpServerWidgets.js';
import { ActionRunner, IAction, Separator } from '../../../../base/common/actions.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { mcpGalleryServiceEnablementConfig, mcpGalleryServiceUrlConfig } from '../../../../platform/mcp/common/mcpManagement.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { DefaultViewsContext, SearchMcpServersContext } from '../../extensions/common/extensions.js';
import { VIEW_CONTAINER } from '../../extensions/browser/extensions.contribution.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { AbstractExtensionsListView } from '../../extensions/browser/extensionsViews.js';
import { ExtensionListRendererOptions } from '../../extensions/browser/extensionsList.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IWorkbenchLayoutService, Position } from '../../../services/layout/browser/layoutService.js';
import { mcpServerIcon } from './mcpServerIcons.js';
import { IPagedRenderer } from '../../../../base/browser/ui/list/listPaging.js';
import { IMcpGalleryManifestService, McpGalleryManifestStatus } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { ProductQualityContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export interface McpServerListViewOptions {
	showWelcome?: boolean;
}

interface IQueryResult {
	model: IPagedModel<IWorkbenchMcpServer>;
	disposables: DisposableStore;
	showWelcomeContent?: boolean;
	readonly onDidChangeModel?: Event<IPagedModel<IWorkbenchMcpServer>>;
}

type Message = {
	readonly text: string;
	readonly severity: Severity;
};

export class McpServersListView extends AbstractExtensionsListView<IWorkbenchMcpServer> {

	private list: WorkbenchPagedList<IWorkbenchMcpServer> | null = null;
	private listContainer: HTMLElement | null = null;
	private welcomeContainer: HTMLElement | null = null;
	private bodyTemplate: {
		messageContainer: HTMLElement;
		messageSeverityIcon: HTMLElement;
		messageBox: HTMLElement;
		mcpServersList: HTMLElement;
	} | undefined;
	private readonly contextMenuActionRunner = this._register(new ActionRunner());
	private input: IQueryResult | undefined;

	constructor(
		private readonly mpcViewOptions: McpServerListViewOptions,
		options: IViewletViewOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IDialogService private readonly dialogService: IDialogService,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@IMcpGalleryManifestService protected readonly mcpGalleryManifestService: IMcpGalleryManifestService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IMarkdownRendererService protected readonly markdownRendererService: IMarkdownRendererService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		// Create welcome container
		this.welcomeContainer = dom.append(container, dom.$('.mcp-welcome-container.hide'));
		this.createWelcomeContent(this.welcomeContainer);

		const messageContainer = dom.append(container, dom.$('.message-container'));
		const messageSeverityIcon = dom.append(messageContainer, dom.$(''));
		const messageBox = dom.append(messageContainer, dom.$('.message'));
		const mcpServersList = dom.$('.mcp-servers-list');

		this.bodyTemplate = {
			mcpServersList,
			messageBox,
			messageContainer,
			messageSeverityIcon
		};

		this.listContainer = dom.append(container, mcpServersList);
		this.list = this._register(this.instantiationService.createInstance(WorkbenchPagedList,
			`${this.id}-MCP-Servers`,
			this.listContainer,
			{
				getHeight() { return 72; },
				getTemplateId: () => McpServerRenderer.templateId,
			},
			[this.instantiationService.createInstance(McpServerRenderer, {
				hoverOptions: {
					position: () => {
						const viewLocation = this.viewDescriptorService.getViewLocationById(this.id);
						if (viewLocation === ViewContainerLocation.Sidebar) {
							return this.layoutService.getSideBarPosition() === Position.LEFT ? HoverPosition.RIGHT : HoverPosition.LEFT;
						}
						if (viewLocation === ViewContainerLocation.AuxiliaryBar) {
							return this.layoutService.getSideBarPosition() === Position.LEFT ? HoverPosition.LEFT : HoverPosition.RIGHT;
						}
						return HoverPosition.RIGHT;
					}
				}
			})],
			{
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel(mcpServer: IWorkbenchMcpServer | null): string {
						return mcpServer?.label ?? '';
					},
					getWidgetAriaLabel(): string {
						return localize('mcp servers', "MCP Servers");
					}
				},
				overrideStyles: getLocationBasedViewColors(this.viewDescriptorService.getViewLocationById(this.id)).listOverrideStyles,
				openOnSingleClick: true,
			}) as WorkbenchPagedList<IWorkbenchMcpServer>);
		this._register(Event.debounce(Event.filter(this.list.onDidOpen, e => e.element !== null), (_, event) => event, 75, true)(options => {
			this.mcpWorkbenchService.open(options.element!, options.editorOptions);
		}));
		this._register(this.list.onContextMenu(e => this.onContextMenu(e), this));

		if (this.input) {
			this.renderInput();
		}
	}

	private async onContextMenu(e: IListContextMenuEvent<IWorkbenchMcpServer>): Promise<void> {
		if (e.element) {
			const disposables = new DisposableStore();
			const mcpServer = e.element ? this.mcpWorkbenchService.local.find(local => local.id === e.element!.id) || e.element
				: e.element;
			const groups: IAction[][] = getContextMenuActions(mcpServer, false, this.instantiationService);
			const actions: IAction[] = [];
			for (const menuActions of groups) {
				for (const menuAction of menuActions) {
					actions.push(menuAction);
					if (isDisposable(menuAction)) {
						disposables.add(menuAction);
					}
				}
				actions.push(new Separator());
			}
			actions.pop();
			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => actions,
				actionRunner: this.contextMenuActionRunner,
				onHide: () => disposables.dispose()
			});
		}
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.list?.layout(height, width);
	}

	async show(query: string): Promise<IPagedModel<IWorkbenchMcpServer>> {
		if (this.input) {
			this.input.disposables.dispose();
			this.input = undefined;
		}

		if (this.mpcViewOptions.showWelcome) {
			this.input = { model: new PagedModel([]), disposables: new DisposableStore(), showWelcomeContent: true };
		} else {
			this.input = await this.query(query.trim());
		}

		this.renderInput();

		if (this.input.onDidChangeModel) {
			this.input.disposables.add(this.input.onDidChangeModel(model => {
				if (!this.input) {
					return;
				}
				this.input.model = model;
				this.renderInput();
			}));
		}

		return this.input.model;
	}

	private renderInput() {
		if (!this.input) {
			return;
		}
		if (this.list) {
			this.list.model = new DelayedPagedModel(this.input.model);
		}
		this.showWelcomeContent(!!this.input.showWelcomeContent);
		if (!this.input.showWelcomeContent) {
			this.updateBody();
		}
	}

	private showWelcomeContent(show: boolean): void {
		this.welcomeContainer?.classList.toggle('hide', !show);
		this.listContainer?.classList.toggle('hide', show);
	}

	private createWelcomeContent(welcomeContainer: HTMLElement): void {
		const welcomeContent = dom.append(welcomeContainer, dom.$('.mcp-welcome-content'));

		const iconContainer = dom.append(welcomeContent, dom.$('.mcp-welcome-icon'));
		const iconElement = dom.append(iconContainer, dom.$('span'));
		iconElement.className = ThemeIcon.asClassName(mcpServerIcon);

		const title = dom.append(welcomeContent, dom.$('.mcp-welcome-title'));
		title.textContent = localize('mcp.welcome.title', "MCP Servers");

		const settingsCommandLink = createMarkdownCommandLink({ id: 'workbench.action.openSettings', arguments: [`@id:${mcpGalleryServiceEnablementConfig}`], title: mcpGalleryServiceEnablementConfig, tooltip: localize('mcp.welcome.settings.tooltip', "Open Settings") }).toString();
		const description = dom.append(welcomeContent, dom.$('.mcp-welcome-description'));
		const markdownResult = this._register(this.markdownRendererService.render(
			new MarkdownString(
				localize('mcp.welcome.descriptionWithLink', "Browse and install [Model Context Protocol (MCP) servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) directly from VS Code to extend agent mode with extra tools for connecting to databases, invoking APIs and performing specialized tasks."),
				{ isTrusted: { enabledCommands: ['workbench.action.openSettings'] } },
			)
				.appendMarkdown('\n\n')
				.appendMarkdown(localize('mcp.gallery.enableDialog.setting', "This feature is currently in preview. You can disable it anytime using the setting {0}.", settingsCommandLink)),
		));
		description.appendChild(markdownResult.element);

		const buttonContainer = dom.append(welcomeContent, dom.$('.mcp-welcome-button-container'));
		const button = this._register(new Button(buttonContainer, {
			title: localize('mcp.welcome.enableGalleryButton', "Enable MCP Servers Marketplace"),
			...defaultButtonStyles
		}));
		button.label = localize('mcp.welcome.enableGalleryButton', "Enable MCP Servers Marketplace");

		this._register(button.onDidClick(async () => {

			const { result } = await this.dialogService.prompt({
				type: 'info',
				message: localize('mcp.gallery.enableDialog.title', "Enable MCP Servers Marketplace?"),
				custom: {
					markdownDetails: [{
						markdown: new MarkdownString(localize('mcp.gallery.enableDialog.setting', "This feature is currently in preview. You can disable it anytime using the setting {0}.", settingsCommandLink), { isTrusted: true })
					}]
				},
				buttons: [
					{ label: localize('mcp.gallery.enableDialog.enable', "Enable"), run: () => true },
					{ label: localize('mcp.gallery.enableDialog.cancel', "Cancel"), run: () => false }
				]
			});

			if (result) {
				await this.configurationService.updateValue(mcpGalleryServiceEnablementConfig, true);
			}
		}));
	}

	private updateBody(message?: Message): void {
		if (this.bodyTemplate) {

			const count = this.input?.model.length ?? 0;
			this.bodyTemplate.mcpServersList.classList.toggle('hidden', count === 0);
			this.bodyTemplate.messageContainer.classList.toggle('hidden', !message && count > 0);

			if (this.isBodyVisible()) {
				if (message) {
					this.bodyTemplate.messageSeverityIcon.className = SeverityIcon.className(message.severity);
					this.bodyTemplate.messageBox.textContent = message.text;
				} else if (count === 0) {
					this.bodyTemplate.messageSeverityIcon.className = '';
					this.bodyTemplate.messageBox.textContent = localize('no extensions found', "No MCP Servers found.");
				}
				if (this.bodyTemplate.messageBox.textContent) {
					alert(this.bodyTemplate.messageBox.textContent);
				}
			}
		}
	}

	private async query(query: string): Promise<IQueryResult> {
		const disposables = new DisposableStore();
		if (query) {
			const servers = await this.mcpWorkbenchService.queryGallery({ text: query.replace('@mcp', '') });
			const model = disposables.add(new IterativePagedModel(servers));
			return { model, disposables };
		}

		const onDidChangeModel = disposables.add(new Emitter<IPagedModel<IWorkbenchMcpServer>>());
		let servers = await this.mcpWorkbenchService.queryLocal();
		disposables.add(Event.debounce(this.mcpWorkbenchService.onChange, () => undefined)(() => {
			const mergedMcpServers = this.mergeChangedMcpServers(servers, [...this.mcpWorkbenchService.local]);
			if (mergedMcpServers) {
				servers = mergedMcpServers;
				onDidChangeModel.fire(new PagedModel(servers));
			}
		}));
		disposables.add(this.mcpWorkbenchService.onReset(() => onDidChangeModel.fire(new PagedModel([...this.mcpWorkbenchService.local]))));
		return { model: new PagedModel(servers), onDidChangeModel: onDidChangeModel.event, disposables };
	}

	private mergeChangedMcpServers(mcpServers: IWorkbenchMcpServer[], newMcpServers: IWorkbenchMcpServer[]): IWorkbenchMcpServer[] | undefined {
		const oldMcpServers = [...mcpServers];
		const findPreviousMcpServerIndex = (from: number): number => {
			let index = -1;
			const previousMcpServerInNew = newMcpServers[from];
			if (previousMcpServerInNew) {
				index = oldMcpServers.findIndex(e => e.id === previousMcpServerInNew.id);
				if (index === -1) {
					return findPreviousMcpServerIndex(from - 1);
				}
			}
			return index;
		};

		let hasChanged: boolean = false;
		for (let index = 0; index < newMcpServers.length; index++) {
			const newMcpServer = newMcpServers[index];
			if (mcpServers.every(r => r.id !== newMcpServer.id)) {
				hasChanged = true;
				mcpServers.splice(findPreviousMcpServerIndex(index - 1) + 1, 0, newMcpServer);
			}
		}

		for (let index = mcpServers.length - 1; index >= 0; index--) {
			const oldMcpServer = mcpServers[index];
			if (newMcpServers.every(r => r.id !== oldMcpServer.id) && newMcpServers.some(r => r.name === oldMcpServer.name)) {
				hasChanged = true;
				mcpServers.splice(index, 1);
			}
		}

		if (!hasChanged) {
			if (mcpServers.length === newMcpServers.length) {
				for (let index = 0; index < newMcpServers.length; index++) {
					if (mcpServers[index]?.id !== newMcpServers[index]?.id) {
						hasChanged = true;
						mcpServers = newMcpServers;
						break;
					}
				}
			}
		}

		return hasChanged ? mcpServers : undefined;
	}
}

interface IMcpServerTemplateData {
	root: HTMLElement;
	element: HTMLElement;
	name: HTMLElement;
	description: HTMLElement;
	starred: HTMLElement;
	mcpServer: IWorkbenchMcpServer | null;
	disposables: IDisposable[];
	mcpServerDisposables: IDisposable[];
	actionbar: ActionBar;
}

class McpServerRenderer implements IPagedRenderer<IWorkbenchMcpServer, IMcpServerTemplateData> {

	static readonly templateId = 'mcpServer';
	readonly templateId = McpServerRenderer.templateId;

	constructor(
		private readonly options: ExtensionListRendererOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@INotificationService private readonly notificationService: INotificationService,
	) { }

	renderTemplate(root: HTMLElement): IMcpServerTemplateData {
		const element = dom.append(root, dom.$('.mcp-server-item.extension-list-item'));
		const iconContainer = dom.append(element, dom.$('.icon-container'));
		const iconWidget = this.instantiationService.createInstance(McpServerIconWidget, iconContainer);
		const details = dom.append(element, dom.$('.details'));
		const headerContainer = dom.append(details, dom.$('.header-container'));
		const header = dom.append(headerContainer, dom.$('.header'));
		const name = dom.append(header, dom.$('span.name'));
		const starred = dom.append(header, dom.$('span.ratings'));
		const description = dom.append(details, dom.$('.description.ellipsis'));
		const footer = dom.append(details, dom.$('.footer'));
		const publisherWidget = this.instantiationService.createInstance(PublisherWidget, dom.append(footer, dom.$('.publisher-container')), true);
		const actionbar = new ActionBar(footer, {
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action instanceof DropDownAction) {
					return action.createActionViewItem(options);
				}
				return undefined;
			},
			focusOnlyEnabledItems: true
		});

		actionbar.setFocusable(false);
		const actionBarListener = actionbar.onDidRun(({ error }) => error && this.notificationService.error(error));
		const mcpServerStatusAction = this.instantiationService.createInstance(McpServerStatusAction);

		const actions = [
			this.instantiationService.createInstance(InstallAction, true),
			this.instantiationService.createInstance(InstallingLabelAction),
			this.instantiationService.createInstance(ManageMcpServerAction, false),
			mcpServerStatusAction
		];

		const widgets = [
			iconWidget,
			publisherWidget,
			this.instantiationService.createInstance(StarredWidget, starred, true),
			this.instantiationService.createInstance(McpServerScopeBadgeWidget, iconContainer),
			this.instantiationService.createInstance(McpServerHoverWidget, { target: root, position: this.options.hoverOptions.position }, mcpServerStatusAction)
		];
		const extensionContainers: McpServerContainers = this.instantiationService.createInstance(McpServerContainers, [...actions, ...widgets]);

		actionbar.push(actions, { icon: true, label: true });
		const disposable = combinedDisposable(...actions, ...widgets, actionbar, actionBarListener, extensionContainers);

		return {
			root, element, name, description, starred, disposables: [disposable], actionbar,
			mcpServerDisposables: [],
			set mcpServer(mcpServer: IWorkbenchMcpServer) {
				extensionContainers.mcpServer = mcpServer;
			}
		};
	}

	renderPlaceholder(index: number, data: IMcpServerTemplateData): void {
		data.element.classList.add('loading');

		data.mcpServerDisposables = dispose(data.mcpServerDisposables);
		data.name.textContent = '';
		data.description.textContent = '';
		data.starred.style.display = 'none';
		data.mcpServer = null;
	}

	renderElement(mcpServer: IWorkbenchMcpServer, index: number, data: IMcpServerTemplateData): void {
		data.element.classList.remove('loading');
		data.mcpServerDisposables = dispose(data.mcpServerDisposables);
		data.root.setAttribute('data-mcp-server-id', mcpServer.id);
		data.name.textContent = mcpServer.label;
		data.description.textContent = mcpServer.description;

		data.starred.style.display = '';
		data.mcpServer = mcpServer;

		const updateEnablement = () => data.root.classList.toggle('disabled', !!mcpServer.runtimeStatus?.state && mcpServer.runtimeStatus.state !== McpServerEnablementState.Enabled);
		updateEnablement();
		data.mcpServerDisposables.push(this.mcpWorkbenchService.onChange(e => {
			if (!e || e.id === mcpServer.id) {
				updateEnablement();
			}
		}));
	}

	disposeElement(mcpServer: IWorkbenchMcpServer, index: number, data: IMcpServerTemplateData): void {
		data.mcpServerDisposables = dispose(data.mcpServerDisposables);
	}

	disposeTemplate(data: IMcpServerTemplateData): void {
		data.mcpServerDisposables = dispose(data.mcpServerDisposables);
		data.disposables = dispose(data.disposables);
	}
}


export class DefaultBrowseMcpServersView extends McpServersListView {

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this._register(this.mcpGalleryManifestService.onDidChangeMcpGalleryManifest(() => this.show()));
	}

	override async show(): Promise<IPagedModel<IWorkbenchMcpServer>> {
		return super.show('@mcp');
	}
}

export class McpServersViewsContribution extends Disposable implements IWorkbenchContribution {

	static ID = 'workbench.mcp.servers.views.contribution';

	constructor() {
		super();

		Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([
			{
				id: InstalledMcpServersViewId,
				name: localize2('mcp-installed', "MCP Servers - Installed"),
				ctorDescriptor: new SyncDescriptor(McpServersListView, [{}]),
				when: ContextKeyExpr.and(DefaultViewsContext, HasInstalledMcpServersContext, ChatContextKeys.Setup.hidden.negate()),
				weight: 40,
				order: 4,
				canToggleVisibility: true
			},
			{
				id: 'workbench.views.mcp.default.marketplace',
				name: localize2('mcp', "MCP Servers"),
				ctorDescriptor: new SyncDescriptor(DefaultBrowseMcpServersView, [{}]),
				when: ContextKeyExpr.and(DefaultViewsContext, HasInstalledMcpServersContext.toNegated(), ChatContextKeys.Setup.hidden.negate(), McpServersGalleryStatusContext.isEqualTo(McpGalleryManifestStatus.Available), ContextKeyExpr.or(ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceUrlConfig}`), ProductQualityContext.notEqualsTo('stable'), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceEnablementConfig}`))),
				weight: 40,
				order: 4,
				canToggleVisibility: true
			},
			{
				id: 'workbench.views.mcp.marketplace',
				name: localize2('mcp', "MCP Servers"),
				ctorDescriptor: new SyncDescriptor(McpServersListView, [{}]),
				when: ContextKeyExpr.and(SearchMcpServersContext, ChatContextKeys.Setup.hidden.negate(), McpServersGalleryStatusContext.isEqualTo(McpGalleryManifestStatus.Available), ContextKeyExpr.or(ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceUrlConfig}`), ProductQualityContext.notEqualsTo('stable'), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceEnablementConfig}`))),
			},
			{
				id: 'workbench.views.mcp.default.welcomeView',
				name: localize2('mcp', "MCP Servers"),
				ctorDescriptor: new SyncDescriptor(DefaultBrowseMcpServersView, [{ showWelcome: true }]),
				when: ContextKeyExpr.and(DefaultViewsContext, HasInstalledMcpServersContext.toNegated(), ChatContextKeys.Setup.hidden.negate(), McpServersGalleryStatusContext.isEqualTo(McpGalleryManifestStatus.Available), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceUrlConfig}`).negate(), ProductQualityContext.isEqualTo('stable'), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceEnablementConfig}`).negate()),
				weight: 40,
				order: 4,
				canToggleVisibility: true
			},
			{
				id: 'workbench.views.mcp.welcomeView',
				name: localize2('mcp', "MCP Servers"),
				ctorDescriptor: new SyncDescriptor(McpServersListView, [{ showWelcome: true }]),
				when: ContextKeyExpr.and(SearchMcpServersContext, ChatContextKeys.Setup.hidden.negate(), McpServersGalleryStatusContext.isEqualTo(McpGalleryManifestStatus.Available), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceUrlConfig}`).negate(), ProductQualityContext.isEqualTo('stable'), ContextKeyDefinedExpr.create(`config.${mcpGalleryServiceEnablementConfig}`).negate()),
			}
		], VIEW_CONTAINER);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServerWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServerWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { verifiedPublisherIcon } from '../../../services/extensionManagement/common/extensionsIcons.js';
import { IMcpServerContainer, IWorkbenchMcpServer, McpServerInstallState } from '../common/mcpTypes.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { McpServerStatusAction } from './mcpServerActions.js';
import { reset } from '../../../../base/browser/dom.js';
import { mcpLicenseIcon, mcpServerIcon, mcpServerRemoteIcon, mcpServerWorkspaceIcon, mcpStarredIcon } from './mcpServerIcons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { ExtensionHoverOptions, ExtensionIconBadge } from '../../extensions/browser/extensionsWidgets.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { LocalMcpServerScope } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { registerColor } from '../../../../platform/theme/common/colorUtils.js';
import { textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export abstract class McpServerWidget extends Disposable implements IMcpServerContainer {
	private _mcpServer: IWorkbenchMcpServer | null = null;
	get mcpServer(): IWorkbenchMcpServer | null { return this._mcpServer; }
	set mcpServer(mcpServer: IWorkbenchMcpServer | null) { this._mcpServer = mcpServer; this.update(); }
	update(): void { this.render(); }
	abstract render(): void;
}

export function onClick(element: HTMLElement, callback: () => void): IDisposable {
	const disposables: DisposableStore = new DisposableStore();
	disposables.add(dom.addDisposableListener(element, dom.EventType.CLICK, dom.finalHandler(callback)));
	disposables.add(dom.addDisposableListener(element, dom.EventType.KEY_UP, e => {
		const keyboardEvent = new StandardKeyboardEvent(e);
		if (keyboardEvent.equals(KeyCode.Space) || keyboardEvent.equals(KeyCode.Enter)) {
			e.preventDefault();
			e.stopPropagation();
			callback();
		}
	}));
	return disposables;
}

export class McpServerIconWidget extends McpServerWidget {

	private readonly iconLoadingDisposable = this._register(new MutableDisposable());
	private readonly element: HTMLElement;
	private readonly iconElement: HTMLImageElement;
	private readonly codiconIconElement: HTMLElement;

	private iconUrl: string | undefined;

	constructor(
		container: HTMLElement,
		@IThemeService private readonly themeService: IThemeService
	) {
		super();
		this.element = dom.append(container, dom.$('.extension-icon'));

		this.iconElement = dom.append(this.element, dom.$('img.icon', { alt: '' }));
		this.iconElement.style.display = 'none';

		this.codiconIconElement = dom.append(this.element, dom.$(ThemeIcon.asCSSSelector(mcpServerIcon)));
		this.codiconIconElement.style.display = 'none';

		this.render();
		this._register(toDisposable(() => this.clear()));
		this._register(this.themeService.onDidColorThemeChange(() => this.render()));
	}

	private clear(): void {
		this.iconUrl = undefined;
		this.iconElement.src = '';
		this.iconElement.style.display = 'none';
		this.codiconIconElement.style.display = 'none';
		this.codiconIconElement.className = ThemeIcon.asClassName(mcpServerIcon);
		this.iconLoadingDisposable.clear();
	}

	render(): void {
		if (!this.mcpServer) {
			this.clear();
			return;
		}

		if (this.mcpServer.icon) {
			const type = this.themeService.getColorTheme().type;
			const iconUrl = isDark(type) ? this.mcpServer.icon.dark : this.mcpServer.icon.light;
			if (this.iconUrl !== iconUrl) {
				this.iconElement.style.display = 'inherit';
				this.codiconIconElement.style.display = 'none';
				this.iconUrl = iconUrl;
				this.iconLoadingDisposable.value = dom.addDisposableListener(this.iconElement, 'error', () => {
					this.iconElement.style.display = 'none';
					this.codiconIconElement.style.display = 'inherit';
				}, { once: true });
				this.iconElement.src = this.iconUrl;
				if (!this.iconElement.complete) {
					this.iconElement.style.visibility = 'hidden';
					this.iconElement.onload = () => this.iconElement.style.visibility = 'inherit';
				} else {
					this.iconElement.style.visibility = 'inherit';
				}
			}
		} else {
			this.iconUrl = undefined;
			this.iconElement.style.display = 'none';
			this.iconElement.src = '';
			this.codiconIconElement.className = this.mcpServer.codicon ? `codicon ${this.mcpServer.codicon}` : ThemeIcon.asClassName(mcpServerIcon);
			this.codiconIconElement.style.display = 'inherit';
			this.iconLoadingDisposable.clear();
		}
	}
}

export class PublisherWidget extends McpServerWidget {

	private element: HTMLElement | undefined;
	private containerHover: IManagedHover | undefined;

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
		@IHoverService private readonly hoverService: IHoverService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();

		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.element?.remove();
		this.disposables.clear();
	}

	render(): void {
		this.clear();
		if (!this.mcpServer?.publisherDisplayName) {
			return;
		}

		this.element = dom.append(this.container, dom.$('.publisher'));
		const publisherDisplayName = dom.$('.publisher-name.ellipsis');
		publisherDisplayName.textContent = this.mcpServer.publisherDisplayName;

		const verifiedPublisher = dom.$('.verified-publisher');
		dom.append(verifiedPublisher, dom.$('span.extension-verified-publisher.clickable'), renderIcon(verifiedPublisherIcon));

		if (this.small) {
			if (this.mcpServer.gallery?.publisherDomain?.verified) {
				dom.append(this.element, verifiedPublisher);
			}
			dom.append(this.element, publisherDisplayName);
		} else {
			this.element.classList.toggle('clickable', !!this.mcpServer.gallery?.publisherUrl);
			this.element.setAttribute('role', 'button');
			this.element.tabIndex = 0;

			this.containerHover = this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, localize('publisher', "Publisher ({0})", this.mcpServer.publisherDisplayName)));
			dom.append(this.element, publisherDisplayName);

			if (this.mcpServer.gallery?.publisherDomain?.verified) {
				dom.append(this.element, verifiedPublisher);
				const publisherDomainLink = URI.parse(this.mcpServer.gallery?.publisherDomain.link);
				verifiedPublisher.tabIndex = 0;
				verifiedPublisher.setAttribute('role', 'button');
				this.containerHover.update(localize('verified publisher', "This publisher has verified ownership of {0}", this.mcpServer.gallery?.publisherDomain.link));
				verifiedPublisher.setAttribute('role', 'link');

				dom.append(verifiedPublisher, dom.$('span.extension-verified-publisher-domain', undefined, publisherDomainLink.authority.startsWith('www.') ? publisherDomainLink.authority.substring(4) : publisherDomainLink.authority));
				this.disposables.add(onClick(verifiedPublisher, () => this.openerService.open(publisherDomainLink)));
			}

			if (this.mcpServer.gallery?.publisherUrl) {
				this.disposables.add(onClick(this.element, () => this.openerService.open(this.mcpServer?.gallery?.publisherUrl!)));
			}
		}

	}

}

export class StarredWidget extends McpServerWidget {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
	) {
		super();
		this.container.classList.add('extension-ratings');
		if (this.small) {
			container.classList.add('small');
		}

		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.container.innerText = '';
		this.disposables.clear();
	}

	render(): void {
		this.clear();

		if (!this.mcpServer?.starsCount) {
			return;
		}

		if (this.small && this.mcpServer.installState !== McpServerInstallState.Uninstalled) {
			return;
		}

		const parent = this.small ? this.container : dom.append(this.container, dom.$('span.rating', { tabIndex: 0 }));
		dom.append(parent, dom.$('span' + ThemeIcon.asCSSSelector(mcpStarredIcon)));

		const ratingCountElement = dom.append(parent, dom.$('span.count', undefined, StarredWidget.getCountLabel(this.mcpServer.starsCount)));
		if (!this.small) {
			ratingCountElement.style.paddingLeft = '3px';
		}
	}

	static getCountLabel(starsCount: number): string {
		if (starsCount > 1000000) {
			return `${Math.floor(starsCount / 100000) / 10}M`;
		} else if (starsCount > 1000) {
			return `${Math.floor(starsCount / 1000)}K`;
		} else {
			return String(starsCount);
		}
	}

}

export class LicenseWidget extends McpServerWidget {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
	) {
		super();
		this.container.classList.add('license');
		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.container.innerText = '';
		this.disposables.clear();
	}

	render(): void {
		this.clear();

		if (!this.mcpServer?.license) {
			return;
		}

		const parent = dom.append(this.container, dom.$('span.license', { tabIndex: 0 }));
		dom.append(parent, dom.$('span' + ThemeIcon.asCSSSelector(mcpLicenseIcon)));

		const licenseElement = dom.append(parent, dom.$('span', undefined, this.mcpServer.license));
		licenseElement.style.paddingLeft = '3px';
	}
}

export class McpServerHoverWidget extends McpServerWidget {

	private readonly hover = this._register(new MutableDisposable<IDisposable>());

	constructor(
		private readonly options: ExtensionHoverOptions,
		private readonly mcpServerStatusAction: McpServerStatusAction,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	render(): void {
		this.hover.value = undefined;
		if (this.mcpServer) {
			this.hover.value = this.hoverService.setupManagedHover({
				delay: this.configurationService.getValue<number>('workbench.hover.delay'),
				showHover: (options, focus) => {
					return this.hoverService.showInstantHover({
						...options,
						additionalClasses: ['extension-hover'],
						position: {
							hoverPosition: this.options.position(),
							forcePosition: true,
						},
						persistence: {
							hideOnKeyDown: true,
						}
					}, focus);
				},
				placement: 'element'
			},
				this.options.target,
				{
					markdown: () => Promise.resolve(this.getHoverMarkdown()),
					markdownNotSupportedFallback: undefined
				},
				{
					appearance: {
						showHoverHint: true
					}
				}
			);
		}
	}

	private getHoverMarkdown(): MarkdownString | undefined {
		if (!this.mcpServer) {
			return undefined;
		}
		const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });

		markdown.appendMarkdown(`**${this.mcpServer.label}**`);
		markdown.appendText(`\n`);

		let addSeparator = false;
		if (this.mcpServer.local?.scope === LocalMcpServerScope.Workspace) {
			markdown.appendMarkdown(`$(${mcpServerWorkspaceIcon.id})&nbsp;`);
			markdown.appendMarkdown(localize('workspace extension', "Workspace MCP Server"));
			addSeparator = true;
		}

		if (this.mcpServer.local?.scope === LocalMcpServerScope.RemoteUser) {
			markdown.appendMarkdown(`$(${mcpServerRemoteIcon.id})&nbsp;`);
			markdown.appendMarkdown(localize('remote user extension', "Remote MCP Server"));
			addSeparator = true;
		}

		if (this.mcpServer.installState === McpServerInstallState.Installed) {
			if (this.mcpServer.starsCount) {
				if (addSeparator) {
					markdown.appendText(`  |  `);
				}
				const starsCountLabel = StarredWidget.getCountLabel(this.mcpServer.starsCount);
				markdown.appendMarkdown(`$(${mcpStarredIcon.id}) ${starsCountLabel}`);
				addSeparator = true;
			}
		}

		if (addSeparator) {
			markdown.appendText(`\n`);
		}

		if (this.mcpServer.description) {
			markdown.appendMarkdown(`${this.mcpServer.description}`);
		}

		const extensionStatus = this.mcpServerStatusAction.status;

		if (extensionStatus.length) {

			markdown.appendMarkdown(`---`);
			markdown.appendText(`\n`);

			for (const status of extensionStatus) {
				if (status.icon) {
					markdown.appendMarkdown(`$(${status.icon.id})&nbsp;`);
				}
				markdown.appendMarkdown(status.message.value);
				markdown.appendText(`\n`);
			}

		}

		return markdown;
	}

}

export class McpServerScopeBadgeWidget extends McpServerWidget {

	private readonly badge = this._register(new MutableDisposable<ExtensionIconBadge>());
	private element: HTMLElement;

	constructor(
		readonly container: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.element = dom.append(this.container, dom.$(''));
		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.badge.value?.element.remove();
		this.badge.clear();
	}

	render(): void {
		this.clear();

		const scope = this.mcpServer?.local?.scope;

		if (!scope || scope === LocalMcpServerScope.User) {
			return;
		}

		let icon: ThemeIcon;
		switch (scope) {
			case LocalMcpServerScope.Workspace: {
				icon = mcpServerWorkspaceIcon;
				break;
			}
			case LocalMcpServerScope.RemoteUser: {
				icon = mcpServerRemoteIcon;
				break;
			}
		}

		this.badge.value = this.instantiationService.createInstance(ExtensionIconBadge, icon, undefined);
		dom.append(this.element, this.badge.value.element);
	}
}

export class McpServerStatusWidget extends McpServerWidget {

	private readonly renderDisposables = this._register(new MutableDisposable());

	private readonly _onDidRender = this._register(new Emitter<void>());
	readonly onDidRender: Event<void> = this._onDidRender.event;

	constructor(
		private readonly container: HTMLElement,
		private readonly extensionStatusAction: McpServerStatusAction,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
		this.render();
		this._register(extensionStatusAction.onDidChangeStatus(() => this.render()));
	}

	render(): void {
		reset(this.container);
		this.renderDisposables.value = undefined;
		const disposables = new DisposableStore();
		this.renderDisposables.value = disposables;
		const extensionStatus = this.extensionStatusAction.status;
		if (extensionStatus.length) {
			const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
			for (let i = 0; i < extensionStatus.length; i++) {
				const status = extensionStatus[i];
				if (status.icon) {
					markdown.appendMarkdown(`$(${status.icon.id})&nbsp;`);
				}
				markdown.appendMarkdown(status.message.value);
				if (i < extensionStatus.length - 1) {
					markdown.appendText(`\n`);
				}
			}
			const rendered = disposables.add(this.markdownRendererService.render(markdown));
			dom.append(this.container, rendered.element);
		}
		this._onDidRender.fire();
	}
}

export const mcpStarredIconColor = registerColor('mcpIcon.starForeground', { light: '#DF6100', dark: '#FF8E00', hcDark: '#FF8E00', hcLight: textLinkForeground }, localize('mcpIconStarForeground', "The icon color for mcp starred."), false);

registerThemingParticipant((theme, collector) => {
	const mcpStarredIconColorValue = theme.getColor(mcpStarredIconColor);
	if (mcpStarredIconColorValue) {
		collector.addRule(`.extension-ratings .codicon-mcp-server-starred { color: ${mcpStarredIconColorValue}; }`);
		collector.addRule(`.monaco-hover.extension-hover .markdown-hover .hover-contents ${ThemeIcon.asCSSSelector(mcpStarredIcon)} { color: ${mcpStarredIconColorValue}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpWorkbenchService.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpWorkbenchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createCommandUri, IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename } from '../../../../base/common/resources.js';
import { Mutable } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IGalleryMcpServer, IMcpGalleryService, IQueryOptions, IInstallableMcpServer, IGalleryMcpServerConfiguration, mcpAccessConfig, McpAccessValue, IAllowedMcpServersService } from '../../../../platform/mcp/common/mcpManagement.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IMcpServerConfiguration, IMcpServerVariable, IMcpStdioServerConfiguration, McpServerType } from '../../../../platform/mcp/common/mcpPlatformTypes.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IURLService } from '../../../../platform/url/common/url.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { MCP_CONFIGURATION_KEY, WORKSPACE_STANDALONE_CONFIGURATIONS } from '../../../services/configuration/common/configuration.js';
import { ACTIVE_GROUP, IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { DidUninstallWorkbenchMcpServerEvent, IWorkbenchLocalMcpServer, IWorkbenchMcpManagementService, IWorkbenchMcpServerInstallResult, IWorkbencMcpServerInstallOptions, LocalMcpServerScope, REMOTE_USER_CONFIG_ID, USER_CONFIG_ID, WORKSPACE_CONFIG_ID, WORKSPACE_FOLDER_CONFIG_ID_PREFIX } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { mcpConfigurationSection } from '../common/mcpConfiguration.js';
import { McpServerInstallData, McpServerInstallClassification } from '../common/mcpServer.js';
import { HasInstalledMcpServersContext, IMcpConfigPath, IMcpService, IMcpWorkbenchService, IWorkbenchMcpServer, McpCollectionSortOrder, McpServerEnablementState, McpServerInstallState, McpServerEnablementStatus, McpServersGalleryStatusContext } from '../common/mcpTypes.js';
import { McpServerEditorInput } from './mcpServerEditorInput.js';
import { IMcpGalleryManifestService } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { IIterativePager, IIterativePage } from '../../../../base/common/paging.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { runOnChange } from '../../../../base/common/observable.js';
import Severity from '../../../../base/common/severity.js';
import { Queue } from '../../../../base/common/async.js';

interface IMcpServerStateProvider<T> {
	(mcpWorkbenchServer: McpWorkbenchServer): T;
}

class McpWorkbenchServer implements IWorkbenchMcpServer {

	constructor(
		private installStateProvider: IMcpServerStateProvider<McpServerInstallState>,
		private runtimeStateProvider: IMcpServerStateProvider<McpServerEnablementStatus | undefined>,
		public local: IWorkbenchLocalMcpServer | undefined,
		public gallery: IGalleryMcpServer | undefined,
		public readonly installable: IInstallableMcpServer | undefined,
		@IMcpGalleryService private readonly mcpGalleryService: IMcpGalleryService,
		@IFileService private readonly fileService: IFileService,
	) {
		this.local = local;
	}

	get id(): string {
		return this.local?.id ?? this.gallery?.name ?? this.installable?.name ?? this.name;
	}

	get name(): string {
		return this.gallery?.name ?? this.local?.name ?? this.installable?.name ?? '';
	}

	get label(): string {
		return this.gallery?.displayName ?? this.local?.displayName ?? this.local?.name ?? this.installable?.name ?? '';
	}

	get icon(): {
		readonly dark: string;
		readonly light: string;
	} | undefined {
		return this.gallery?.icon ?? this.local?.icon;
	}

	get installState(): McpServerInstallState {
		return this.installStateProvider(this);
	}

	get codicon(): string | undefined {
		return this.gallery?.codicon ?? this.local?.codicon;
	}

	get publisherDisplayName(): string | undefined {
		return this.gallery?.publisherDisplayName ?? this.local?.publisherDisplayName ?? this.gallery?.publisher ?? this.local?.publisher;
	}

	get publisherUrl(): string | undefined {
		return this.gallery?.publisherDomain?.link;
	}

	get description(): string {
		return this.gallery?.description ?? this.local?.description ?? '';
	}

	get starsCount(): number {
		return this.gallery?.starsCount ?? 0;
	}

	get license(): string | undefined {
		return this.gallery?.license;
	}

	get repository(): string | undefined {
		return this.gallery?.repositoryUrl;
	}

	get config(): IMcpServerConfiguration | undefined {
		return this.local?.config ?? this.installable?.config;
	}

	get runtimeStatus(): McpServerEnablementStatus | undefined {
		return this.runtimeStateProvider(this);
	}

	get readmeUrl(): URI | undefined {
		return this.local?.readmeUrl ?? (this.gallery?.readmeUrl ? URI.parse(this.gallery.readmeUrl) : undefined);
	}

	async getReadme(token: CancellationToken): Promise<string> {
		if (this.local?.readmeUrl) {
			const content = await this.fileService.readFile(this.local.readmeUrl);
			return content.value.toString();
		}

		if (this.gallery?.readme) {
			return this.gallery.readme;
		}

		if (this.gallery?.readmeUrl) {
			return this.mcpGalleryService.getReadme(this.gallery, token);
		}

		return Promise.reject(new Error('not available'));
	}

	async getManifest(token: CancellationToken): Promise<IGalleryMcpServerConfiguration> {
		if (this.local?.manifest) {
			return this.local.manifest;
		}

		if (this.gallery) {
			return this.gallery.configuration;
		}

		throw new Error('No manifest available');
	}

}

export class McpWorkbenchService extends Disposable implements IMcpWorkbenchService {

	_serviceBrand: undefined;

	private installing: McpWorkbenchServer[] = [];
	private uninstalling: McpWorkbenchServer[] = [];

	private _local: McpWorkbenchServer[] = [];
	get local(): readonly McpWorkbenchServer[] { return [...this._local]; }

	private readonly _onChange = this._register(new Emitter<IWorkbenchMcpServer | undefined>());
	readonly onChange = this._onChange.event;

	private readonly _onReset = this._register(new Emitter<void>());
	readonly onReset = this._onReset.event;

	constructor(
		@IMcpGalleryManifestService mcpGalleryManifestService: IMcpGalleryManifestService,
		@IMcpGalleryService private readonly mcpGalleryService: IMcpGalleryService,
		@IWorkbenchMcpManagementService private readonly mcpManagementService: IWorkbenchMcpManagementService,
		@IEditorService private readonly editorService: IEditorService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILabelService private readonly labelService: ILabelService,
		@IProductService private readonly productService: IProductService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILogService private readonly logService: ILogService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IAllowedMcpServersService private readonly allowedMcpServersService: IAllowedMcpServersService,
		@IMcpService private readonly mcpService: IMcpService,
		@IURLService urlService: IURLService,
	) {
		super();
		this._register(this.mcpManagementService.onDidInstallMcpServersInCurrentProfile(e => this.onDidInstallMcpServers(e)));
		this._register(this.mcpManagementService.onDidUpdateMcpServersInCurrentProfile(e => this.onDidUpdateMcpServers(e)));
		this._register(this.mcpManagementService.onDidUninstallMcpServerInCurrentProfile(e => this.onDidUninstallMcpServer(e)));
		this._register(this.mcpManagementService.onDidChangeProfile(e => this.onDidChangeProfile()));
		this.queryLocal().then(() => {
			if (this._store.isDisposed) {
				return;
			}
			const queue = this._register(new Queue());
			this._register(mcpGalleryManifestService.onDidChangeMcpGalleryManifest(e => queue.queue(() => this.syncInstalledMcpServers())));
			queue.queue(() => this.syncInstalledMcpServers());
		});
		urlService.registerHandler(this);
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(mcpAccessConfig)) {
				this._onChange.fire(undefined);
			}
		}));
		this._register(this.allowedMcpServersService.onDidChangeAllowedMcpServers(() => {
			this._local = this.sort(this._local);
			this._onChange.fire(undefined);
		}));
		this._register(runOnChange(mcpService.servers, () => {
			this._local = this.sort(this._local);
			this._onChange.fire(undefined);
		}));
	}

	private async onDidChangeProfile() {
		await this.queryLocal();
		this._onChange.fire(undefined);
		this._onReset.fire();
	}

	private areSameMcpServers(a: { name: string; scope: LocalMcpServerScope } | undefined, b: { name: string; scope: LocalMcpServerScope } | undefined): boolean {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.name === b.name && a.scope === b.scope;
	}

	private onDidUninstallMcpServer(e: DidUninstallWorkbenchMcpServerEvent) {
		if (e.error) {
			return;
		}
		const uninstalled = this._local.find(server => this.areSameMcpServers(server.local, e));
		if (uninstalled) {
			this._local = this._local.filter(server => server !== uninstalled);
			this._onChange.fire(uninstalled);
		}
	}

	private onDidInstallMcpServers(e: readonly IWorkbenchMcpServerInstallResult[]) {
		const servers: IWorkbenchMcpServer[] = [];
		for (const { local, source, name } of e) {
			let server = this.installing.find(server => server.local && local ? this.areSameMcpServers(server.local, local) : server.name === name);
			this.installing = server ? this.installing.filter(e => e !== server) : this.installing;
			if (local) {
				if (server) {
					server.local = local;
				} else {
					server = this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), local, source, undefined);
				}
				if (!local.galleryUrl) {
					server.gallery = undefined;
				}
				this._local = this._local.filter(server => !this.areSameMcpServers(server.local, local));
				this.addServer(server);
			}
			this._onChange.fire(server);
		}
		if (servers.some(server => server.local?.galleryUrl && !server.gallery)) {
			this.syncInstalledMcpServers();
		}
	}

	private onDidUpdateMcpServers(e: readonly IWorkbenchMcpServerInstallResult[]) {
		for (const result of e) {
			if (!result.local) {
				continue;
			}
			const serverIndex = this._local.findIndex(server => this.areSameMcpServers(server.local, result.local));
			let server: McpWorkbenchServer;
			if (serverIndex !== -1) {
				this._local[serverIndex].local = result.local;
				server = this._local[serverIndex];
			} else {
				server = this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), result.local, result.source, undefined);
				this.addServer(server);
			}
			this._onChange.fire(server);
		}
	}

	private fromGallery(gallery: IGalleryMcpServer): IWorkbenchMcpServer | undefined {
		for (const local of this._local) {
			if (local.name === gallery.name) {
				local.gallery = gallery;
				return local;
			}
		}
		return undefined;
	}

	private async syncInstalledMcpServers(): Promise<void> {
		const infos: { name: string; id?: string }[] = [];

		for (const installed of this.local) {
			if (installed.local?.source !== 'gallery') {
				continue;
			}
			if (installed.local.galleryUrl) {
				infos.push({ name: installed.local.name, id: installed.local.galleryId });
			}
		}

		if (infos.length) {
			const galleryServers = await this.mcpGalleryService.getMcpServersFromGallery(infos);
			await this.syncInstalledMcpServersWithGallery(galleryServers);
		}
	}

	private async syncInstalledMcpServersWithGallery(gallery: IGalleryMcpServer[]): Promise<void> {
		const galleryMap = new Map<string, IGalleryMcpServer>(gallery.map(server => [server.name, server]));
		for (const mcpServer of this.local) {
			if (!mcpServer.local) {
				continue;
			}
			const key = mcpServer.local.name;
			const gallery = key ? galleryMap.get(key) : undefined;

			if (!gallery || gallery.galleryUrl !== mcpServer.local.galleryUrl) {
				if (mcpServer.gallery) {
					mcpServer.gallery = undefined;
					this._onChange.fire(mcpServer);
				}
				continue;
			}

			mcpServer.gallery = gallery;
			if (!mcpServer.local.manifest) {
				mcpServer.local = await this.mcpManagementService.updateMetadata(mcpServer.local, gallery);
			}
			this._onChange.fire(mcpServer);
		}
	}

	async queryGallery(options?: IQueryOptions, token?: CancellationToken): Promise<IIterativePager<IWorkbenchMcpServer>> {
		if (!this.mcpGalleryService.isEnabled()) {
			return {
				firstPage: { items: [], hasMore: false },
				getNextPage: async () => ({ items: [], hasMore: false })
			};
		}
		const pager = await this.mcpGalleryService.query(options, token);

		const mapPage = (page: IIterativePage<IGalleryMcpServer>): IIterativePage<IWorkbenchMcpServer> => ({
			items: page.items.map(gallery => this.fromGallery(gallery) ?? this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), undefined, gallery, undefined)),
			hasMore: page.hasMore
		});

		return {
			firstPage: mapPage(pager.firstPage),
			getNextPage: async (ct) => {
				const nextPage = await pager.getNextPage(ct);
				return mapPage(nextPage);
			}
		};
	}

	async queryLocal(): Promise<IWorkbenchMcpServer[]> {
		const installed = await this.mcpManagementService.getInstalled();
		this._local = this.sort(installed.map(i => {
			const existing = this._local.find(local => local.id === i.id);
			const local = existing ?? this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), undefined, undefined, undefined);
			local.local = i;
			return local;
		}));
		this._onChange.fire(undefined);
		return [...this.local];
	}

	private addServer(server: McpWorkbenchServer): void {
		this._local.push(server);
		this._local = this.sort(this._local);
	}

	private sort(local: McpWorkbenchServer[]): McpWorkbenchServer[] {
		return local.sort((a, b) => {
			if (a.name === b.name) {
				if (!a.runtimeStatus || a.runtimeStatus.state === McpServerEnablementState.Enabled) {
					return -1;
				}
				if (!b.runtimeStatus || b.runtimeStatus.state === McpServerEnablementState.Enabled) {
					return 1;
				}
				return 0;
			}
			return a.name.localeCompare(b.name);
		});
	}

	getEnabledLocalMcpServers(): IWorkbenchLocalMcpServer[] {
		const result = new Map<string, IWorkbenchLocalMcpServer>();
		const userRemote: IWorkbenchLocalMcpServer[] = [];
		const workspace: IWorkbenchLocalMcpServer[] = [];

		for (const server of this.local) {
			const enablementStatus = this.getEnablementStatus(server);
			if (enablementStatus && enablementStatus.state !== McpServerEnablementState.Enabled) {
				continue;
			}

			if (server.local?.scope === LocalMcpServerScope.User) {
				result.set(server.name, server.local);
			} else if (server.local?.scope === LocalMcpServerScope.RemoteUser) {
				userRemote.push(server.local);
			} else if (server.local?.scope === LocalMcpServerScope.Workspace) {
				workspace.push(server.local);
			}
		}

		for (const server of userRemote) {
			const existing = result.get(server.name);
			if (existing) {
				this.logService.warn(localize('overwriting', "Overwriting mcp server '{0}' from {1} with {2}.", server.name, server.mcpResource.path, existing.mcpResource.path));
			}
			result.set(server.name, server);
		}

		for (const server of workspace) {
			const existing = result.get(server.name);
			if (existing) {
				this.logService.warn(localize('overwriting', "Overwriting mcp server '{0}' from {1} with {2}.", server.name, server.mcpResource.path, existing.mcpResource.path));
			}
			result.set(server.name, server);
		}

		return [...result.values()];
	}

	canInstall(mcpServer: IWorkbenchMcpServer): true | IMarkdownString {
		if (!(mcpServer instanceof McpWorkbenchServer)) {
			return new MarkdownString().appendText(localize('not an extension', "The provided object is not an mcp server."));
		}

		if (mcpServer.gallery) {
			const result = this.mcpManagementService.canInstall(mcpServer.gallery);
			if (result === true) {
				return true;
			}

			return result;
		}

		if (mcpServer.installable) {
			const result = this.mcpManagementService.canInstall(mcpServer.installable);
			if (result === true) {
				return true;
			}

			return result;
		}


		return new MarkdownString().appendText(localize('cannot be installed', "Cannot install the '{0}' MCP Server because it is not available in this setup.", mcpServer.label));
	}

	async install(server: IWorkbenchMcpServer, installOptions?: IWorkbencMcpServerInstallOptions): Promise<IWorkbenchMcpServer> {
		if (!(server instanceof McpWorkbenchServer)) {
			throw new Error('Invalid server instance');
		}

		if (server.installable) {
			const installable = server.installable;
			return this.doInstall(server, () => this.mcpManagementService.install(installable, installOptions));
		}

		if (server.gallery) {
			const gallery = server.gallery;
			return this.doInstall(server, () => this.mcpManagementService.installFromGallery(gallery, installOptions));
		}

		throw new Error('No installable server found');
	}

	async uninstall(server: IWorkbenchMcpServer): Promise<void> {
		if (!server.local) {
			throw new Error('Local server is missing');
		}
		await this.mcpManagementService.uninstall(server.local);
	}

	private async doInstall(server: McpWorkbenchServer, installTask: () => Promise<IWorkbenchLocalMcpServer>): Promise<IWorkbenchMcpServer> {
		const source = server.gallery ? 'gallery' : 'local';
		const serverName = server.name;
		// Check for inputs in installable config or if it comes from handleURL with inputs
		const hasInputs = !!(server.installable?.inputs && server.installable.inputs.length > 0);

		this.installing.push(server);
		this._onChange.fire(server);

		try {
			await installTask();
			const result = await this.waitAndGetInstalledMcpServer(server);

			// Track successful installation
			this.telemetryService.publicLog2<McpServerInstallData, McpServerInstallClassification>('mcp/serverInstall', {
				serverName,
				source,
				scope: result.local?.scope ?? 'unknown',
				success: true,
				hasInputs
			});

			return result;
		} catch (error) {
			// Track failed installation
			this.telemetryService.publicLog2<McpServerInstallData, McpServerInstallClassification>('mcp/serverInstall', {
				serverName,
				source,
				scope: 'unknown',
				success: false,
				error: error instanceof Error ? error.message : String(error),
				hasInputs
			});

			throw error;
		} finally {
			if (this.installing.includes(server)) {
				this.installing.splice(this.installing.indexOf(server), 1);
				this._onChange.fire(server);
			}
		}
	}

	private async waitAndGetInstalledMcpServer(server: McpWorkbenchServer): Promise<IWorkbenchMcpServer> {
		let installed = this.local.find(local => local.name === server.name);
		if (!installed) {
			await Event.toPromise(Event.filter(this.onChange, e => !!e && this.local.some(local => local.name === server.name)));
		}
		installed = this.local.find(local => local.name === server.name);
		if (!installed) {
			// This should not happen
			throw new Error('Extension should have been installed');
		}
		return installed;
	}

	getMcpConfigPath(localMcpServer: IWorkbenchLocalMcpServer): IMcpConfigPath | undefined;
	getMcpConfigPath(mcpResource: URI): Promise<IMcpConfigPath | undefined>;
	getMcpConfigPath(arg: URI | IWorkbenchLocalMcpServer): Promise<IMcpConfigPath | undefined> | IMcpConfigPath | undefined {
		if (arg instanceof URI) {
			const mcpResource = arg;
			for (const profile of this.userDataProfilesService.profiles) {
				if (this.uriIdentityService.extUri.isEqual(profile.mcpResource, mcpResource)) {
					return this.getUserMcpConfigPath(mcpResource);
				}
			}

			return this.remoteAgentService.getEnvironment().then(remoteEnvironment => {
				if (remoteEnvironment && this.uriIdentityService.extUri.isEqual(remoteEnvironment.mcpResource, mcpResource)) {
					return this.getRemoteMcpConfigPath(mcpResource);
				}
				return this.getWorkspaceMcpConfigPath(mcpResource);
			});
		}

		if (arg.scope === LocalMcpServerScope.User) {
			return this.getUserMcpConfigPath(arg.mcpResource);
		}

		if (arg.scope === LocalMcpServerScope.Workspace) {
			return this.getWorkspaceMcpConfigPath(arg.mcpResource);
		}

		if (arg.scope === LocalMcpServerScope.RemoteUser) {
			return this.getRemoteMcpConfigPath(arg.mcpResource);
		}

		return undefined;
	}

	private getUserMcpConfigPath(mcpResource: URI): IMcpConfigPath {
		return {
			id: USER_CONFIG_ID,
			key: 'userLocalValue',
			target: ConfigurationTarget.USER_LOCAL,
			label: localize('mcp.configuration.userLocalValue', 'Global in {0}', this.productService.nameShort),
			scope: StorageScope.PROFILE,
			order: McpCollectionSortOrder.User,
			uri: mcpResource,
			section: [],
		};
	}

	private getRemoteMcpConfigPath(mcpResource: URI): IMcpConfigPath {
		return {
			id: REMOTE_USER_CONFIG_ID,
			key: 'userRemoteValue',
			target: ConfigurationTarget.USER_REMOTE,
			label: this.environmentService.remoteAuthority ? this.labelService.getHostLabel(Schemas.vscodeRemote, this.environmentService.remoteAuthority) : 'Remote',
			scope: StorageScope.PROFILE,
			order: McpCollectionSortOrder.User + McpCollectionSortOrder.RemoteBoost,
			remoteAuthority: this.environmentService.remoteAuthority,
			uri: mcpResource,
			section: [],
		};
	}

	private getWorkspaceMcpConfigPath(mcpResource: URI): IMcpConfigPath | undefined {
		const workspace = this.workspaceService.getWorkspace();
		if (workspace.configuration && this.uriIdentityService.extUri.isEqual(workspace.configuration, mcpResource)) {
			return {
				id: WORKSPACE_CONFIG_ID,
				key: 'workspaceValue',
				target: ConfigurationTarget.WORKSPACE,
				label: basename(mcpResource),
				scope: StorageScope.WORKSPACE,
				order: McpCollectionSortOrder.Workspace,
				remoteAuthority: this.environmentService.remoteAuthority,
				uri: mcpResource,
				section: ['settings', mcpConfigurationSection],
			};
		}

		const workspaceFolders = workspace.folders;
		for (let index = 0; index < workspaceFolders.length; index++) {
			const workspaceFolder = workspaceFolders[index];
			if (this.uriIdentityService.extUri.isEqual(this.uriIdentityService.extUri.joinPath(workspaceFolder.uri, WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]), mcpResource)) {
				return {
					id: `${WORKSPACE_FOLDER_CONFIG_ID_PREFIX}${index}`,
					key: 'workspaceFolderValue',
					target: ConfigurationTarget.WORKSPACE_FOLDER,
					label: `${workspaceFolder.name}/.vscode/mcp.json`,
					scope: StorageScope.WORKSPACE,
					remoteAuthority: this.environmentService.remoteAuthority,
					order: McpCollectionSortOrder.WorkspaceFolder,
					uri: mcpResource,
					workspaceFolder,
				};
			}
		}

		return undefined;
	}

	async handleURL(uri: URI): Promise<boolean> {
		if (uri.path === 'mcp/install') {
			return this.handleMcpInstallUri(uri);
		}
		if (uri.path.startsWith('mcp/by-name/')) {
			const mcpServerName = uri.path.substring('mcp/by-name/'.length);
			if (mcpServerName) {
				return this.handleMcpServerByName(mcpServerName);
			}
		}
		if (uri.path.startsWith('mcp/')) {
			const mcpServerUrl = uri.path.substring(4);
			if (mcpServerUrl) {
				return this.handleMcpServerUrl(`${Schemas.https}://${mcpServerUrl}`);
			}
		}
		return false;
	}

	private async handleMcpInstallUri(uri: URI): Promise<boolean> {
		let parsed: IMcpServerConfiguration & { name: string; inputs?: IMcpServerVariable[]; gallery?: boolean };
		try {
			parsed = JSON.parse(decodeURIComponent(uri.query));
		} catch (e) {
			return false;
		}

		try {
			const { name, inputs, gallery, ...config } = parsed;
			if (config.type === undefined) {
				(<Mutable<IMcpServerConfiguration>>config).type = (<IMcpStdioServerConfiguration>parsed).command ? McpServerType.LOCAL : McpServerType.REMOTE;
			}
			this.open(this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), undefined, undefined, { name, config, inputs }));
		} catch (e) {
			// ignore
		}
		return true;
	}

	private async handleMcpServerUrl(url: string): Promise<boolean> {
		try {
			const gallery = await this.mcpGalleryService.getMcpServer(url);
			if (!gallery) {
				this.logService.info(`MCP server '${url}' not found`);
				return true;
			}
			const local = this.local.find(e => e.name === gallery.name) ?? this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), undefined, gallery, undefined);
			this.open(local);
		} catch (e) {
			// ignore
			this.logService.error(e);
		}
		return true;
	}

	private async handleMcpServerByName(name: string): Promise<boolean> {
		try {
			const [gallery] = await this.mcpGalleryService.getMcpServersFromGallery([{ name }]);
			if (!gallery) {
				this.logService.info(`MCP server '${name}' not found`);
				return true;
			}
			const local = this.local.find(e => e.name === gallery.name) ?? this.instantiationService.createInstance(McpWorkbenchServer, e => this.getInstallState(e), e => this.getRuntimeStatus(e), undefined, gallery, undefined);
			this.open(local);
		} catch (e) {
			// ignore
			this.logService.error(e);
		}
		return true;
	}

	async openSearch(searchValue: string, preserveFoucs?: boolean): Promise<void> {
		await this.extensionsWorkbenchService.openSearch(`@mcp ${searchValue}`, preserveFoucs);
	}

	async open(extension: IWorkbenchMcpServer, options?: IEditorOptions): Promise<void> {
		await this.editorService.openEditor(this.instantiationService.createInstance(McpServerEditorInput, extension), options, ACTIVE_GROUP);
	}

	private getInstallState(extension: McpWorkbenchServer): McpServerInstallState {
		if (this.installing.some(i => i.name === extension.name)) {
			return McpServerInstallState.Installing;
		}
		if (this.uninstalling.some(e => e.name === extension.name)) {
			return McpServerInstallState.Uninstalling;
		}
		const local = this.local.find(e => e === extension);
		return local ? McpServerInstallState.Installed : McpServerInstallState.Uninstalled;
	}

	private getRuntimeStatus(mcpServer: McpWorkbenchServer): McpServerEnablementStatus | undefined {
		const enablementStatus = this.getEnablementStatus(mcpServer);

		if (enablementStatus) {
			return enablementStatus;
		}

		if (!this.mcpService.servers.get().find(s => s.definition.id === mcpServer.id)) {
			return { state: McpServerEnablementState.Disabled };
		}

		return undefined;
	}

	private getEnablementStatus(mcpServer: McpWorkbenchServer): McpServerEnablementStatus | undefined {
		if (!mcpServer.local) {
			return undefined;
		}

		const settingsCommandLink = createCommandUri('workbench.action.openSettings', { query: `@id:${mcpAccessConfig}` }).toString();
		const accessValue = this.configurationService.getValue(mcpAccessConfig);

		if (accessValue === McpAccessValue.None) {
			return {
				state: McpServerEnablementState.DisabledByAccess,
				message: {
					severity: Severity.Warning,
					text: new MarkdownString(localize('disabled - all not allowed', "This MCP Server is disabled because MCP servers are configured to be disabled in the Editor. Please check your [settings]({0}).", settingsCommandLink))
				}
			};

		}

		if (accessValue === McpAccessValue.Registry) {
			if (!mcpServer.gallery) {
				return {
					state: McpServerEnablementState.DisabledByAccess,
					message: {
						severity: Severity.Warning,
						text: new MarkdownString(localize('disabled - some not allowed', "This MCP Server is disabled because it is configured to be disabled in the Editor. Please check your [settings]({0}).", settingsCommandLink))
					}
				};
			}

			const remoteUrl = mcpServer.local.config.type === McpServerType.REMOTE && mcpServer.local.config.url;
			if (remoteUrl && !mcpServer.gallery.configuration.remotes?.some(remote => remote.url === remoteUrl)) {
				return {
					state: McpServerEnablementState.DisabledByAccess,
					message: {
						severity: Severity.Warning,
						text: new MarkdownString(localize('disabled - some not allowed', "This MCP Server is disabled because it is configured to be disabled in the Editor. Please check your [settings]({0}).", settingsCommandLink))
					}
				};
			}
		}

		return undefined;
	}

}

export class MCPContextsInitialisation extends Disposable implements IWorkbenchContribution {

	static ID = 'workbench.mcp.contexts.initialisation';

	constructor(
		@IMcpWorkbenchService mcpWorkbenchService: IMcpWorkbenchService,
		@IMcpGalleryManifestService mcpGalleryManifestService: IMcpGalleryManifestService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();

		const mcpServersGalleryStatus = McpServersGalleryStatusContext.bindTo(contextKeyService);
		mcpServersGalleryStatus.set(mcpGalleryManifestService.mcpGalleryManifestStatus);
		this._register(mcpGalleryManifestService.onDidChangeMcpGalleryManifestStatus(status => mcpServersGalleryStatus.set(status)));

		const hasInstalledMcpServersContextKey = HasInstalledMcpServersContext.bindTo(contextKeyService);
		mcpWorkbenchService.queryLocal().finally(() => {
			hasInstalledMcpServersContextKey.set(mcpWorkbenchService.local.length > 0);
			this._register(mcpWorkbenchService.onChange(() => hasInstalledMcpServersContextKey.set(mcpWorkbenchService.local.length > 0)));
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/openPanelChatAndGetWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/openPanelChatAndGetWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceTimeout } from '../../../../base/common/async.js';
import { Event } from '../../../../base/common/event.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ChatViewId, IChatWidget, IChatWidgetService } from '../../chat/browser/chat.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';


export async function openPanelChatAndGetWidget(viewsService: IViewsService, chatService: IChatWidgetService): Promise<IChatWidget | undefined> {
	await viewsService.openView(ChatViewId, true);
	const widgets = chatService.getWidgetsByLocations(ChatAgentLocation.Chat);
	if (widgets.length) {
		return widgets[0];
	}

	const eventPromise = Event.toPromise(Event.filter(chatService.onDidAddWidget, e => e.location === ChatAgentLocation.Chat));

	return await raceTimeout(
		eventPromise,
		10000, // should be enough time for chat to initialize...
		() => eventPromise.cancel()
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/media/mcpServerAction.css]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/media/mcpServerAction.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.mcp-hover-contents {
	margin-top: 4px;
	margin-bottom: 4px;
	max-width: 250px;
	min-width: 200px;
}

.mcp-hover-contents .mcp-hover-divider {
	margin-top: 8px;
	margin-bottom: 8px;
}

.mcp-hover-contents .mcp-hover-setting {
	display: flex;
	align-items: center;
	margin-top: 6px;
}

.mcp-hover-contents .mcp-hover-setting .monaco-checkbox {
	flex-shrink: 0;
}

.mcp-hover-contents .mcp-hover-setting .mcp-hover-setting-label {
	cursor: pointer;
	color: var(--vscode-foreground);
	font-size: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/media/mcpServerEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/media/mcpServerEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.mcp-server-editor {
	.configuration-content {
		padding: 20px;
		box-sizing: border-box;
	}

	.config-section {
		margin-bottom: 15px;
		display: flex;
		align-items: flex-start;
	}

	.config-label {
		font-weight: 600;
		min-width: 80px;
		margin-right: 15px;
	}

	.config-value {
		word-break: break-all;
	}

	.no-config {
		color: var(--vscode-descriptionForeground);
		font-style: italic;
		padding: 20px;
	}

	.manifest-content {
		padding: 20px;
		box-sizing: border-box;

		.manifest-section {
			margin-bottom: 20px;

			.manifest-section-title {
				font-size: 26px;
				display: inline-block;
				margin: 0px;
				font-weight: 600;
				height: 100%;
				box-sizing: border-box;
				padding: 10px;
				padding-left: 0px;
				flex: 1;
				position: relative;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.package-section {

			margin-top: 10px;

			.package-section-title {
				margin-bottom: 5px;
				font-size: 1.4em;
				font-weight: 600;
				border-bottom: 1px solid var(--vscode-panelSection-border);
				padding: 5px;
			}

			.package-details {
				padding-left: 10px;
				.package-detail {
					display: grid;
					grid-template-columns: 200px 1fr;
					gap: 12px;
					align-items: start;
					padding: 8px 0px;
				}

				.package-separator {
					margin-top: 10px;
					border-bottom: 1px solid var(--vscode-panelSection-border);
				}
			}
		}


		.no-manifest {
			font-style: italic;
			padding: 20px;
		}
	}


}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/media/mcpServersView.css]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/media/mcpServersView.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.mcp-welcome-container {
	height: 100%;
	width: 100%;

	&.hide {
		display: none;
	}

	.mcp-welcome-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		padding: 0px 40px;
		text-align: center;
		margin: 20px auto;

		.mcp-welcome-icon {
			.codicon {
				font-size: 48px;
			}
		}

		.mcp-welcome-title {
			font-size: 24px;
			margin-top: 5px;
			font-weight: 500;
			line-height: normal;
		}

		.mcp-welcome-description {
			max-width: 350px;
			padding: 0 20px;
			margin-top: 16px;

			a {
				color: var(--vscode-textLink-foreground);
			}
		}

		.mcp-welcome-button-container {
			margin-top: 16px;
			max-width: 320px;
			width: 100%;
		}

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpCommandIds.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpCommandIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Contains all MCP command IDs used in the workbench.
 */
export const enum McpCommandIds {
	AddConfiguration = 'workbench.mcp.addConfiguration',
	Browse = 'workbench.mcp.browseServers',
	BrowsePage = 'workbench.mcp.browseServersPage',
	BrowseResources = 'workbench.mcp.browseResources',
	ConfigureSamplingModels = 'workbench.mcp.configureSamplingModels',
	EditStoredInput = 'workbench.mcp.editStoredInput',
	InstallFromActivation = 'workbench.mcp.installFromActivation',
	ListServer = 'workbench.mcp.listServer',
	OpenRemoteUserMcp = 'workbench.mcp.openRemoteUserMcpJson',
	OpenUserMcp = 'workbench.mcp.openUserMcpJson',
	OpenWorkspaceFolderMcp = 'workbench.mcp.openWorkspaceFolderMcpJson',
	OpenWorkspaceMcp = 'workbench.mcp.openWorkspaceMcpJson',
	RemoveStoredInput = 'workbench.mcp.removeStoredInput',
	ResetCachedTools = 'workbench.mcp.resetCachedTools',
	ResetTrust = 'workbench.mcp.resetTrust',
	RestartServer = 'workbench.mcp.restartServer',
	ServerOptions = 'workbench.mcp.serverOptions',
	ServerOptionsInConfirmation = 'workbench.mcp.serverOptionsInConfirmation',
	ShowConfiguration = 'workbench.mcp.showConfiguration',
	ShowInstalled = 'workbench.mcp.showInstalledServers',
	ShowOutput = 'workbench.mcp.showOutput',
	SkipCurrentAutostart = 'workbench.mcp.skipAutostart',
	StartPromptForServer = 'workbench.mcp.startPromptForServer',
	StartServer = 'workbench.mcp.startServer',
	StopServer = 'workbench.mcp.stopServer',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpConfigFileUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpConfigFileUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findNodeAtLocation, parseTree as jsonParseTree } from '../../../../base/common/json.js';
import { Location } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';

export const getMcpServerMapping = (opts: {
	model: ITextModel;
	// Path to MCP servers in the config.
	pathToServers: string[];
}): Map<string, Location> => {
	const tree = jsonParseTree(opts.model.getValue());
	const servers = findNodeAtLocation(tree, opts.pathToServers);
	if (!servers || servers.type !== 'object') {
		return new Map();
	}

	const result = new Map<string, Location>();
	for (const node of servers.children || []) {
		if (node.type !== 'property' || node.children?.[0]?.type !== 'string') {
			continue;
		}

		const start = opts.model.getPositionAt(node.offset);
		const end = opts.model.getPositionAt(node.offset + node.length);
		result.set(node.children[0].value, {
			uri: opts.model.uri,
			range: {
				startLineNumber: start.lineNumber,
				startColumn: start.column,
				endLineNumber: end.lineNumber,
				endColumn: end.column,
			}
		});
	}

	return result;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IExtensionManifest, IMcpCollectionContribution } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { mcpSchemaId } from '../../../services/configuration/common/configuration.js';
import { inputsSchema } from '../../../services/configurationResolver/common/configurationResolverSchema.js';
import { Extensions, IExtensionFeaturesRegistry, IExtensionFeatureTableRenderer, IRenderedData, IRowData, ITableData } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { IExtensionPointDescriptor } from '../../../services/extensions/common/extensionsRegistry.js';

const mcpActivationEventPrefix = 'onMcpCollection:';

/**
 * note: `contributedCollectionId` is _not_ the collection ID. The collection
 * ID is formed by passing the contributed ID through `extensionPrefixedIdentifier`
 */
export const mcpActivationEvent = (contributedCollectionId: string) =>
	mcpActivationEventPrefix + contributedCollectionId;

export const enum DiscoverySource {
	ClaudeDesktop = 'claude-desktop',
	Windsurf = 'windsurf',
	CursorGlobal = 'cursor-global',
	CursorWorkspace = 'cursor-workspace',
}

export const allDiscoverySources = Object.keys({
	[DiscoverySource.ClaudeDesktop]: true,
	[DiscoverySource.Windsurf]: true,
	[DiscoverySource.CursorGlobal]: true,
	[DiscoverySource.CursorWorkspace]: true,
} satisfies Record<DiscoverySource, true>) as DiscoverySource[];

export const discoverySourceLabel: Record<DiscoverySource, string> = {
	[DiscoverySource.ClaudeDesktop]: localize('mcp.discovery.source.claude-desktop', "Claude Desktop"),
	[DiscoverySource.Windsurf]: localize('mcp.discovery.source.windsurf', "Windsurf"),
	[DiscoverySource.CursorGlobal]: localize('mcp.discovery.source.cursor-global', "Cursor (Global)"),
	[DiscoverySource.CursorWorkspace]: localize('mcp.discovery.source.cursor-workspace', "Cursor (Workspace)"),
};
export const discoverySourceSettingsLabel: Record<DiscoverySource, string> = {
	[DiscoverySource.ClaudeDesktop]: localize('mcp.discovery.source.claude-desktop.config', "Claude Desktop configuration (`claude_desktop_config.json`)"),
	[DiscoverySource.Windsurf]: localize('mcp.discovery.source.windsurf.config', "Windsurf configurations (`~/.codeium/windsurf/mcp_config.json`)"),
	[DiscoverySource.CursorGlobal]: localize('mcp.discovery.source.cursor-global.config', "Cursor global configuration (`~/.cursor/mcp.json`)"),
	[DiscoverySource.CursorWorkspace]: localize('mcp.discovery.source.cursor-workspace.config', "Cursor workspace configuration (`.cursor/mcp.json`)"),
};

export const mcpConfigurationSection = 'mcp';
export const mcpDiscoverySection = 'chat.mcp.discovery.enabled';
export const mcpServerSamplingSection = 'chat.mcp.serverSampling';

export interface IMcpServerSamplingConfiguration {
	allowedDuringChat?: boolean;
	allowedOutsideChat?: boolean;
	allowedModels?: string[];
}

export const mcpSchemaExampleServers = {
	'mcp-server-time': {
		command: 'python',
		args: ['-m', 'mcp_server_time', '--local-timezone=America/Los_Angeles'],
		env: {},
	}
};

const httpSchemaExamples = {
	'my-mcp-server': {
		url: 'http://localhost:3001/mcp',
		headers: {},
	}
};

const mcpDevModeProps = (stdio: boolean): IJSONSchemaMap => ({
	dev: {
		type: 'object',
		markdownDescription: localize('app.mcp.dev', 'Enabled development mode for the server. When present, the server will be started eagerly and output will be included in its output. Properties inside the `dev` object can configure additional behavior.'),
		examples: [{ watch: 'src/**/*.ts', debug: { type: 'node' } }],
		properties: {
			watch: {
				description: localize('app.mcp.dev.watch', 'A glob pattern or list of glob patterns relative to the workspace folder to watch. The MCP server will be restarted when these files change.'),
				examples: ['src/**/*.ts'],
				oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
			},
			...(stdio && {
				debug: {
					markdownDescription: localize('app.mcp.dev.debug', 'If set, debugs the MCP server using the given runtime as it\'s started.'),
					oneOf: [
						{
							type: 'object',
							required: ['type'],
							properties: {
								type: {
									type: 'string',
									enum: ['node'],
									description: localize('app.mcp.dev.debug.type.node', "Debug the MCP server using Node.js.")
								}
							},
							additionalProperties: false
						},
						{
							type: 'object',
							required: ['type'],
							properties: {
								type: {
									type: 'string',
									enum: ['debugpy'],
									description: localize('app.mcp.dev.debug.type.python', "Debug the MCP server using Python and debugpy.")
								},
								debugpyPath: {
									type: 'string',
									description: localize('app.mcp.dev.debug.debugpyPath', "Path to the debugpy executable.")
								},
							},
							additionalProperties: false
						}
					]
				}
			})
		}
	}
});

export const mcpStdioServerSchema: IJSONSchema = {
	type: 'object',
	additionalProperties: false,
	examples: [mcpSchemaExampleServers['mcp-server-time']],
	properties: {
		type: {
			type: 'string',
			enum: ['stdio'],
			description: localize('app.mcp.json.type', "The type of the server.")
		},
		command: {
			type: 'string',
			description: localize('app.mcp.json.command', "The command to run the server.")
		},
		cwd: {
			type: 'string',
			description: localize('app.mcp.json.cwd', "The working directory for the server command. Defaults to the workspace folder when run in a workspace."),
			examples: ['${workspaceFolder}'],
		},
		args: {
			type: 'array',
			description: localize('app.mcp.args.command', "Arguments passed to the server."),
			items: {
				type: 'string'
			},
		},
		envFile: {
			type: 'string',
			description: localize('app.mcp.envFile.command', "Path to a file containing environment variables for the server."),
			examples: ['${workspaceFolder}/.env'],
		},
		env: {
			description: localize('app.mcp.env.command', "Environment variables passed to the server."),
			additionalProperties: {
				anyOf: [
					{ type: 'null' },
					{ type: 'string' },
					{ type: 'number' },
				]
			}
		},
		...mcpDevModeProps(true),
	}
};

export const mcpServerSchema: IJSONSchema = {
	id: mcpSchemaId,
	type: 'object',
	title: localize('app.mcp.json.title', "Model Context Protocol Servers"),
	allowTrailingCommas: true,
	allowComments: true,
	additionalProperties: false,
	properties: {
		servers: {
			examples: [
				mcpSchemaExampleServers,
				httpSchemaExamples,
			],
			additionalProperties: {
				oneOf: [
					mcpStdioServerSchema, {
						type: 'object',
						additionalProperties: false,
						required: ['url'],
						examples: [httpSchemaExamples['my-mcp-server']],
						properties: {
							type: {
								type: 'string',
								enum: ['http', 'sse'],
								description: localize('app.mcp.json.type', "The type of the server.")
							},
							url: {
								type: 'string',
								format: 'uri',
								pattern: '^https?:\\/\\/.+',
								patternErrorMessage: localize('app.mcp.json.url.pattern', "The URL must start with 'http://' or 'https://'."),
								description: localize('app.mcp.json.url', "The URL of the Streamable HTTP or SSE endpoint.")
							},
							headers: {
								type: 'object',
								description: localize('app.mcp.json.headers', "Additional headers sent to the server."),
								additionalProperties: { type: 'string' },
							},
							...mcpDevModeProps(false),
						}
					},
				]
			}
		},
		inputs: inputsSchema.definitions!.inputs
	}
};

export const mcpContributionPoint: IExtensionPointDescriptor<IMcpCollectionContribution[]> = {
	extensionPoint: 'mcpServerDefinitionProviders',
	activationEventsGenerator: function* (contribs) {
		for (const contrib of contribs) {
			if (contrib.id) {
				yield mcpActivationEvent(contrib.id);
			}
		}
	},
	jsonSchema: {
		description: localize('vscode.extension.contributes.mcp', 'Contributes Model Context Protocol servers. Users of this should also use `vscode.lm.registerMcpServerDefinitionProvider`.'),
		type: 'array',
		defaultSnippets: [{ body: [{ id: '', label: '' }] }],
		items: {
			additionalProperties: false,
			type: 'object',
			defaultSnippets: [{ body: { id: '', label: '' } }],
			properties: {
				id: {
					description: localize('vscode.extension.contributes.mcp.id', "Unique ID for the collection."),
					type: 'string'
				},
				label: {
					description: localize('vscode.extension.contributes.mcp.label', "Display name for the collection."),
					type: 'string'
				},
				when: {
					description: localize('vscode.extension.contributes.mcp.when', "Condition which must be true to enable this collection."),
					type: 'string'
				}
			}
		}
	}
};

class McpServerDefinitionsProviderRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.mcpServerDefinitionProviders && Array.isArray(manifest.contributes.mcpServerDefinitionProviders) && manifest.contributes.mcpServerDefinitionProviders.length > 0;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const mcpServerDefinitionProviders = manifest.contributes?.mcpServerDefinitionProviders ?? [];
		const headers = [localize('id', "ID"), localize('name', "Name")];
		const rows: IRowData[][] = mcpServerDefinitionProviders
			.map(mcpServerDefinitionProvider => {
				return [
					new MarkdownString().appendMarkdown(`\`${mcpServerDefinitionProvider.id}\``),
					mcpServerDefinitionProvider.label
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: mcpConfigurationSection,
	label: localize('mcpServerDefinitionProviders', "MCP Servers"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(McpServerDefinitionsProviderRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IMcpService, LazyCollectionState, McpConnectionState, McpServerCacheState } from './mcpTypes.js';


export namespace McpContextKeys {

	export const serverCount = new RawContextKey<number>('mcp.serverCount', undefined, { type: 'number', description: localize('mcp.serverCount.description', "Context key that has the number of registered MCP servers") });
	export const hasUnknownTools = new RawContextKey<boolean>('mcp.hasUnknownTools', undefined, { type: 'boolean', description: localize('mcp.hasUnknownTools.description', "Indicates whether there are MCP servers with unknown tools.") });
	/**
	 * A context key that indicates whether there are any servers with errors.
	 *
	 * @type {boolean}
	 * @default undefined
	 * @description This key is used to track the presence of servers with errors in the MCP context.
	 */
	export const hasServersWithErrors = new RawContextKey<boolean>('mcp.hasServersWithErrors', undefined, { type: 'boolean', description: localize('mcp.hasServersWithErrors.description', "Indicates whether there are any MCP servers with errors.") });
	export const toolsCount = new RawContextKey<number>('mcp.toolsCount', undefined, { type: 'number', description: localize('mcp.toolsCount.description', "Context key that has the number of registered MCP tools") });
}


export class McpContextKeysController extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.mcp.contextKey';

	constructor(
		@IMcpService mcpService: IMcpService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();

		const ctxServerCount = McpContextKeys.serverCount.bindTo(contextKeyService);
		const ctxToolsCount = McpContextKeys.toolsCount.bindTo(contextKeyService);
		const ctxHasUnknownTools = McpContextKeys.hasUnknownTools.bindTo(contextKeyService);

		this._store.add(bindContextKey(McpContextKeys.hasServersWithErrors, contextKeyService, r => mcpService.servers.read(r).some(c => c.connectionState.read(r).state === McpConnectionState.Kind.Error)));

		this._store.add(autorun(r => {
			const servers = mcpService.servers.read(r);
			const serverTools = servers.map(s => s.tools.read(r));
			ctxServerCount.set(servers.length);
			ctxToolsCount.set(serverTools.reduce((count, tools) => count + tools.length, 0));
			ctxHasUnknownTools.set(mcpService.lazyCollectionState.read(r).state !== LazyCollectionState.AllKnown || servers.some(s => {
				const toolState = s.cacheState.read(r);
				return toolState === McpServerCacheState.Unknown || toolState === McpServerCacheState.Outdated || toolState === McpServerCacheState.RefreshingFromUnknown;
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpDevMode.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpDevMode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals as arraysEqual } from '../../../../base/common/arrays.js';
import { assertNever } from '../../../../base/common/assert.js';
import { Throttler } from '../../../../base/common/async.js';
import * as glob from '../../../../base/common/glob.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { equals as objectsEqual } from '../../../../base/common/objects.js';
import { autorun, autorunDelta, derivedOpts } from '../../../../base/common/observable.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { FileSystemProviderCapabilities, IFileService } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IConfig, IDebugService, IDebugSessionOptions } from '../../debug/common/debug.js';
import { IMcpRegistry } from './mcpRegistryTypes.js';
import { IMcpServer, McpServerDefinition, McpServerLaunch, McpServerTransportType } from './mcpTypes.js';

export class McpDevModeServerAttache extends Disposable {
	constructor(
		server: IMcpServer,
		fwdRef: { lastModeDebugged: boolean },
		@IMcpRegistry registry: IMcpRegistry,
		@IFileService fileService: IFileService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
	) {
		super();

		const workspaceFolder = server.readDefinitions().map(({ collection }) => collection?.presentation?.origin &&
			workspaceContextService.getWorkspaceFolder(collection.presentation?.origin)?.uri);

		const restart = async () => {
			const lastDebugged = fwdRef.lastModeDebugged;
			await server.stop();
			await server.start({ debug: lastDebugged });
		};

		// 1. Auto-start the server, restart if entering debug mode
		let didAutoStart = false;
		this._register(autorun(reader => {
			const defs = server.readDefinitions().read(reader);
			if (!defs.collection || !defs.server || !defs.server.devMode) {
				didAutoStart = false;
				return;
			}

			// don't keep trying to start the server unless it's a new server or devmode is newly turned on
			if (didAutoStart) {
				return;
			}

			const delegates = registry.delegates.read(reader);
			if (!delegates.some(d => d.canStart(defs.collection!, defs.server!))) {
				return;
			}

			server.start();
			didAutoStart = true;
		}));

		const debugMode = server.readDefinitions().map(d => !!d.server?.devMode?.debug);
		this._register(autorunDelta(debugMode, ({ lastValue, newValue }) => {
			if (!!newValue && !objectsEqual(lastValue, newValue)) {
				restart();
			}
		}));

		// 2. Watch for file changes
		const watchObs = derivedOpts<string[] | undefined>({ equalsFn: arraysEqual }, reader => {
			const def = server.readDefinitions().read(reader);
			const watch = def.server?.devMode?.watch;
			return typeof watch === 'string' ? [watch] : watch;
		});

		const restartScheduler = this._register(new Throttler());

		this._register(autorun(reader => {
			const pattern = watchObs.read(reader);
			const wf = workspaceFolder.read(reader);
			if (!pattern || !wf) {
				return;
			}

			const includes = pattern.filter(p => !p.startsWith('!'));
			const excludes = pattern.filter(p => p.startsWith('!')).map(p => p.slice(1));
			reader.store.add(fileService.watch(wf, { includes, excludes, recursive: true }));

			const ignoreCase = !fileService.hasCapability(wf, FileSystemProviderCapabilities.PathCaseSensitive);
			const includeParse = includes.map(p => glob.parse({ base: wf.fsPath, pattern: p }, { ignoreCase }));
			const excludeParse = excludes.map(p => glob.parse({ base: wf.fsPath, pattern: p }, { ignoreCase }));
			reader.store.add(fileService.onDidFilesChange(e => {
				for (const change of [e.rawAdded, e.rawDeleted, e.rawUpdated]) {
					for (const uri of change) {
						if (includeParse.some(i => i(uri.fsPath)) && !excludeParse.some(e => e(uri.fsPath))) {
							restartScheduler.queue(restart);
							break;
						}
					}
				}
			}));
		}));
	}
}

export interface IMcpDevModeDebugging {
	readonly _serviceBrand: undefined;

	transform(definition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch>;
}

export const IMcpDevModeDebugging = createDecorator<IMcpDevModeDebugging>('mcpDevModeDebugging');

const DEBUG_HOST = '127.0.0.1';

export class McpDevModeDebugging implements IMcpDevModeDebugging {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@ICommandService private readonly _commandService: ICommandService,
	) { }

	public async transform(definition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch> {
		if (!definition.devMode?.debug || launch.type !== McpServerTransportType.Stdio) {
			return launch;
		}

		const port = await this.getDebugPort();
		const name = `MCP: ${definition.label}`; // for debugging
		const options: IDebugSessionOptions = { startedByUser: false, suppressDebugView: true };
		const commonConfig: Partial<IConfig> = {
			internalConsoleOptions: 'neverOpen',
			suppressMultipleSessionWarning: true,
		};

		switch (definition.devMode.debug.type) {
			case 'node': {
				if (!/node[0-9]*$/.test(launch.command)) {
					throw new Error(localize('mcp.debug.nodeBinReq', 'MCP server must be launched with the "node" executable to enable debugging, but was launched with "{0}"', launch.command));
				}

				// We intentionally assert types as the DA has additional properties beyong IConfig
				// eslint-disable-next-line local/code-no-dangerous-type-assertions
				this._debugService.startDebugging(undefined, {
					type: 'pwa-node',
					request: 'attach',
					name,
					port,
					host: DEBUG_HOST,
					timeout: 30_000,
					continueOnAttach: true,
					...commonConfig,
				} as IConfig, options);
				return { ...launch, args: [`--inspect-brk=${DEBUG_HOST}:${port}`, ...launch.args] };
			}
			case 'debugpy': {
				if (!/python[0-9.]*$/.test(launch.command)) {
					throw new Error(localize('mcp.debug.pythonBinReq', 'MCP server must be launched with the "python" executable to enable debugging, but was launched with "{0}"', launch.command));
				}

				let command: string | undefined;
				let args = ['--wait-for-client', '--connect', `${DEBUG_HOST}:${port}`, ...launch.args];
				if (definition.devMode.debug.debugpyPath) {
					command = definition.devMode.debug.debugpyPath;
				} else {
					try {
						// The Python debugger exposes a command to get its bundle debugpy module path.  Use that if it's available.
						const debugPyPath = await this._commandService.executeCommand<string | undefined>('python.getDebugpyPackagePath');
						if (debugPyPath) {
							command = launch.command;
							args = [debugPyPath, ...args];
						}
					} catch {
						// ignored, no Python debugger extension installed or an error therein
					}
				}
				if (!command) {
					command = 'debugpy';
				}

				await Promise.race([
					// eslint-disable-next-line local/code-no-dangerous-type-assertions
					this._debugService.startDebugging(undefined, {
						type: 'debugpy',
						name,
						request: 'attach',
						listen: {
							host: DEBUG_HOST,
							port
						},
						...commonConfig,
					} as IConfig, options),
					this.ensureListeningOnPort(port)
				]);

				return { ...launch, command, args };
			}
			default:
				assertNever(definition.devMode.debug, `Unknown debug type ${JSON.stringify(definition.devMode.debug)}`);
		}
	}

	protected ensureListeningOnPort(port: number): Promise<void> {
		return Promise.resolve();
	}

	protected getDebugPort() {
		return Promise.resolve(9230);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getMediaMime } from '../../../../base/common/mime.js';
import { URI } from '../../../../base/common/uri.js';
import { ILogger } from '../../../../platform/log/common/log.js';
import { Dto } from '../../../services/extensions/common/proxyIdentifier.js';
import { IMcpIcons, McpServerLaunch, McpServerTransportType } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';

const mcpAllowableContentTypes: readonly string[] = [
	'image/webp',
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/gif'
];

const enum IconTheme {
	Light,
	Dark,
	Any,
}

interface IIcon {
	/** URI the image can be loaded from */
	src: URI;
	/** Theme for this icon. */
	theme: IconTheme;
	/** Sizes of the icon in ascending order. */
	sizes: { width: number; height: number }[];
}

export type ParsedMcpIcons = IIcon[];
export type StoredMcpIcons = Dto<IIcon>[];


function validateIcon(icon: MCP.Icon, launch: McpServerLaunch, logger: ILogger): URI | undefined {
	const mimeType = icon.mimeType?.toLowerCase() || getMediaMime(icon.src);
	if (!mimeType || !mcpAllowableContentTypes.includes(mimeType)) {
		logger.debug(`Ignoring icon with unsupported mime type: ${icon.src} (${mimeType}), allowed: ${mcpAllowableContentTypes.join(', ')}`);
		return;
	}

	const uri = URI.parse(icon.src);
	if (uri.scheme === 'data') {
		return uri;
	}

	if (uri.scheme === 'https' || uri.scheme === 'http') {
		if (launch.type !== McpServerTransportType.HTTP) {
			logger.debug(`Ignoring icon with HTTP/HTTPS URL: ${icon.src} as the MCP server is not launched with HTTP transport.`);
			return;
		}

		const expectedAuthority = launch.uri.authority.toLowerCase();
		if (uri.authority.toLowerCase() !== expectedAuthority) {
			logger.debug(`Ignoring icon with untrusted authority: ${icon.src}, expected authority: ${expectedAuthority}`);
			return;
		}

		return uri;
	}

	if (uri.scheme === 'file') {
		if (launch.type !== McpServerTransportType.Stdio) {
			logger.debug(`Ignoring icon with file URL: ${icon.src} as the MCP server is not launched as a local process.`);
			return;
		}

		return uri;
	}

	logger.debug(`Ignoring icon with unsupported scheme: ${icon.src}. Allowed: data:, http:, https:, file:`);
	return;
}

export function parseAndValidateMcpIcon(icons: MCP.Icons, launch: McpServerLaunch, logger: ILogger): ParsedMcpIcons {
	const result: ParsedMcpIcons = [];
	for (const icon of icons.icons || []) {
		const uri = validateIcon(icon, launch, logger);
		if (!uri) {
			continue;
		}

		// check for sizes as string for back-compat with early 2025-11-25 drafts
		const sizesArr = typeof icon.sizes === 'string' ? (icon.sizes as string).split(' ') : Array.isArray(icon.sizes) ? icon.sizes : [];
		result.push({
			src: uri,
			theme: icon.theme === 'light' ? IconTheme.Light : icon.theme === 'dark' ? IconTheme.Dark : IconTheme.Any,
			sizes: sizesArr.map(size => {
				const [widthStr, heightStr] = size.toLowerCase().split('x');
				return { width: Number(widthStr) || 0, height: Number(heightStr) || 0 };
			}).sort((a, b) => a.width - b.width)
		});
	}

	result.sort((a, b) => a.sizes[0]?.width - b.sizes[0]?.width);

	return result;
}

export class McpIcons implements IMcpIcons {
	public static fromStored(icons: StoredMcpIcons | undefined) {
		return McpIcons.fromParsed(icons?.map(i => ({ src: URI.revive(i.src), theme: i.theme, sizes: i.sizes })));
	}

	public static fromParsed(icons: ParsedMcpIcons | undefined) {
		return new McpIcons(icons || []);
	}

	protected constructor(private readonly _icons: IIcon[]) { }

	getUrl(size: number): { dark: URI; light?: URI } | undefined {
		const dark = this.getSizeWithTheme(size, IconTheme.Dark);
		if (dark?.theme === IconTheme.Any) {
			return { dark: dark.src };
		}

		const light = this.getSizeWithTheme(size, IconTheme.Light);
		if (!light && !dark) {
			return undefined;
		}

		return { dark: (dark || light)!.src, light: light?.src };
	}

	private getSizeWithTheme(size: number, theme: IconTheme): IIcon | undefined {
		let bestOfAnySize: IIcon | undefined;

		for (const icon of this._icons) {
			if (icon.theme === theme || icon.theme === IconTheme.Any || icon.theme === undefined) { // undefined check for back compat
				bestOfAnySize = icon;

				const matchingSize = icon.sizes.find(s => s.width >= size);
				if (matchingSize) {
					return { ...icon, sizes: [matchingSize] };
				}
			}
		}
		return bestOfAnySize;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpLanguageModelToolContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpLanguageModelToolContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { equals } from '../../../../base/common/objects.js';
import { autorun } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IImageResizeService } from '../../../../platform/imageResize/common/imageResizeService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ChatResponseResource, getAttachableImageExtension } from '../../chat/common/chatModel.js';
import { LanguageModelPartAudience } from '../../chat/common/languageModels.js';
import { CountTokensCallback, ILanguageModelToolsService, IPreparedToolInvocation, IToolConfirmationMessages, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, IToolResultInputOutputDetails, ToolDataSource, ToolProgress, ToolSet } from '../../chat/common/languageModelToolsService.js';
import { IMcpRegistry } from './mcpRegistryTypes.js';
import { IMcpServer, IMcpService, IMcpTool, IMcpToolResourceLinkContents, McpResourceURI, McpToolResourceLinkMimeType } from './mcpTypes.js';
import { mcpServerToSourceData } from './mcpTypesUtils.js';

interface ISyncedToolData {
	toolData: IToolData;
	store: DisposableStore;
}

export class McpLanguageModelToolContribution extends Disposable implements IWorkbenchContribution {

	public static readonly ID = 'workbench.contrib.mcp.languageModelTools';

	constructor(
		@ILanguageModelToolsService private readonly _toolsService: ILanguageModelToolsService,
		@IMcpService mcpService: IMcpService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
	) {
		super();

		type Rec = { source?: ToolDataSource } & IDisposable;

		// Keep tools in sync with the tools service.
		const previous = this._register(new DisposableMap<IMcpServer, Rec>());
		this._register(autorun(reader => {
			const servers = mcpService.servers.read(reader);

			const toDelete = new Set(previous.keys());
			for (const server of servers) {
				const previousRec = previous.get(server);
				if (previousRec) {
					toDelete.delete(server);
					if (!previousRec.source || equals(previousRec.source, mcpServerToSourceData(server, reader))) {
						continue; // same definition, no need to update
					}

					previousRec.dispose();
				}

				const store = new DisposableStore();
				const rec: Rec = { dispose: () => store.dispose() };
				const toolSet = new Lazy(() => {
					const source = rec.source = mcpServerToSourceData(server);
					const referenceName = server.definition.label.toLowerCase().replace(/\s+/g, '-'); // see issue https://github.com/microsoft/vscode/issues/278152
					const toolSet = store.add(this._toolsService.createToolSet(
						source,
						server.definition.id,
						referenceName,
						{
							icon: Codicon.mcp,
							description: localize('mcp.toolset', "{0}: All Tools", server.definition.label)
						}
					));

					return { toolSet, source };
				});

				this._syncTools(server, toolSet, store);
				previous.set(server, rec);
			}

			for (const key of toDelete) {
				previous.deleteAndDispose(key);
			}
		}));
	}

	private _syncTools(server: IMcpServer, collectionData: Lazy<{ toolSet: ToolSet; source: ToolDataSource }>, store: DisposableStore) {
		const tools = new Map</* tool ID */string, ISyncedToolData>();

		const collectionObservable = this._mcpRegistry.collections.map(collections =>
			collections.find(c => c.id === server.collection.id));

		store.add(autorun(reader => {
			const toDelete = new Set(tools.keys());

			// toRegister is deferred until deleting tools that moving a tool between
			// servers (or deleting one instance of a multi-instance server) doesn't cause an error.
			const toRegister: (() => void)[] = [];
			const registerTool = (tool: IMcpTool, toolData: IToolData, store: DisposableStore) => {
				store.add(this._toolsService.registerTool(toolData, this._instantiationService.createInstance(McpToolImplementation, tool, server)));
				store.add(collectionData.value.toolSet.addTool(toolData));
			};

			const collection = collectionObservable.read(reader);
			for (const tool of server.tools.read(reader)) {
				const existing = tools.get(tool.id);
				const icons = tool.icons.getUrl(22);
				const toolData: IToolData = {
					id: tool.id,
					source: collectionData.value.source,
					icon: icons || Codicon.tools,
					// duplicative: https://github.com/modelcontextprotocol/modelcontextprotocol/pull/813
					displayName: tool.definition.annotations?.title || tool.definition.title || tool.definition.name,
					toolReferenceName: tool.referenceName,
					modelDescription: tool.definition.description ?? '',
					userDescription: tool.definition.description ?? '',
					inputSchema: tool.definition.inputSchema,
					canBeReferencedInPrompt: true,
					alwaysDisplayInputOutput: true,
					canRequestPreApproval: !tool.definition.annotations?.readOnlyHint,
					canRequestPostApproval: !!tool.definition.annotations?.openWorldHint,
					runsInWorkspace: collection?.scope === StorageScope.WORKSPACE || !!collection?.remoteAuthority,
					tags: ['mcp'],
				};

				if (existing) {
					if (!equals(existing.toolData, toolData)) {
						existing.toolData = toolData;
						existing.store.clear();
						// We need to re-register both the data and implementation, as the
						// implementation is discarded when the data is removed (#245921)
						registerTool(tool, toolData, existing.store);
					}
					toDelete.delete(tool.id);
				} else {
					const store = new DisposableStore();
					toRegister.push(() => registerTool(tool, toolData, store));
					tools.set(tool.id, { toolData, store });
				}
			}

			for (const id of toDelete) {
				const tool = tools.get(id);
				if (tool) {
					tool.store.dispose();
					tools.delete(id);
				}
			}

			for (const fn of toRegister) {
				fn();
			}

			// Important: flush tool updates when the server is fully registered so that
			// any consuming (e.g. autostarting) requests have the tools available immediately.
			this._toolsService.flushToolUpdates();
		}));

		store.add(toDisposable(() => {
			for (const tool of tools.values()) {
				tool.store.dispose();
			}
		}));
	}
}

class McpToolImplementation implements IToolImpl {
	constructor(
		private readonly _tool: IMcpTool,
		private readonly _server: IMcpServer,
		@IProductService private readonly _productService: IProductService,
		@IFileService private readonly _fileService: IFileService,
		@IImageResizeService private readonly _imageResizeService: IImageResizeService,
	) { }

	async prepareToolInvocation(context: IToolInvocationPreparationContext): Promise<IPreparedToolInvocation> {
		const tool = this._tool;
		const server = this._server;

		const mcpToolWarning = localize(
			'mcp.tool.warning',
			"Note that MCP servers or malicious conversation content may attempt to misuse '{0}' through tools.",
			this._productService.nameShort
		);

		// duplicative: https://github.com/modelcontextprotocol/modelcontextprotocol/pull/813
		const title = tool.definition.annotations?.title || tool.definition.title || ('`' + tool.definition.name + '`');

		const confirm: IToolConfirmationMessages = {};
		if (!tool.definition.annotations?.readOnlyHint) {
			confirm.title = new MarkdownString(localize('msg.title', "Run {0}", title));
			confirm.message = new MarkdownString(tool.definition.description, { supportThemeIcons: true });
			confirm.disclaimer = mcpToolWarning;
			confirm.allowAutoConfirm = true;
		}
		if (tool.definition.annotations?.openWorldHint) {
			confirm.confirmResults = true;
		}

		return {
			confirmationMessages: confirm,
			invocationMessage: new MarkdownString(localize('msg.run', "Running {0}", title)),
			pastTenseMessage: new MarkdownString(localize('msg.ran', "Ran {0} ", title)),
			originMessage: localize('msg.subtitle', "{0} (MCP Server)", server.definition.label),
			toolSpecificData: {
				kind: 'input',
				rawInput: context.parameters
			}
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken) {

		const result: IToolResult = {
			content: []
		};

		const callResult = await this._tool.callWithProgress(invocation.parameters as Record<string, unknown>, progress, { chatRequestId: invocation.chatRequestId, chatSessionId: invocation.context?.sessionId }, token);
		const details: IToolResultInputOutputDetails = {
			input: JSON.stringify(invocation.parameters, undefined, 2),
			output: [],
			isError: callResult.isError === true,
		};

		for (const item of callResult.content) {
			const audience = item.annotations?.audience?.map(a => {
				if (a === 'assistant') {
					return LanguageModelPartAudience.Assistant;
				} else if (a === 'user') {
					return LanguageModelPartAudience.User;
				} else {
					return undefined;
				}
			}).filter(isDefined);

			// Explicit user parts get pushed to progress to show in the status UI
			if (audience?.includes(LanguageModelPartAudience.User)) {
				if (item.type === 'text') {
					progress.report({ message: item.text });
				}
			}

			// Rewrite image resources to images so they are inlined nicely
			const addAsInlineData = async (mimeType: string, value: string, uri?: URI): Promise<VSBuffer | void> => {
				details.output.push({ type: 'embed', mimeType, value, uri, audience });
				if (isForModel) {
					let finalData: VSBuffer;
					try {
						const resized = await this._imageResizeService.resizeImage(decodeBase64(value).buffer, mimeType);
						finalData = VSBuffer.wrap(resized);
					} catch {
						finalData = decodeBase64(value);
					}
					result.content.push({ kind: 'data', value: { mimeType, data: finalData }, audience });
				}
			};

			const addAsLinkedResource = (uri: URI, mimeType?: string) => {
				const json: IMcpToolResourceLinkContents = { uri, underlyingMimeType: mimeType };
				result.content.push({
					kind: 'data',
					audience,
					value: {
						mimeType: McpToolResourceLinkMimeType,
						data: VSBuffer.fromString(JSON.stringify(json)),
					},
				});
			};

			const isForModel = !audience || audience.includes(LanguageModelPartAudience.Assistant);
			if (item.type === 'text') {
				details.output.push({ type: 'embed', isText: true, value: item.text });
				// structured content 'represents the result of the tool call', so take
				// that in place of any textual description when present.
				if (isForModel && !callResult.structuredContent) {
					result.content.push({
						kind: 'text',
						audience,
						value: item.text
					});
				}
			} else if (item.type === 'image' || item.type === 'audio') {
				// default to some image type if not given to hint
				await addAsInlineData(item.mimeType || 'image/png', item.data);
			} else if (item.type === 'resource_link') {
				const uri = McpResourceURI.fromServer(this._server.definition, item.uri);
				details.output.push({
					type: 'ref',
					uri,
					audience,
					mimeType: item.mimeType,
				});

				if (isForModel) {
					if (item.mimeType && getAttachableImageExtension(item.mimeType)) {
						result.content.push({
							kind: 'data',
							audience,
							value: {
								mimeType: item.mimeType,
								data: await this._fileService.readFile(uri).then(f => f.value).catch(() => VSBuffer.alloc(0)),
							}
						});
					} else {
						addAsLinkedResource(uri, item.mimeType);
					}
				}
			} else if (item.type === 'resource') {
				const uri = McpResourceURI.fromServer(this._server.definition, item.resource.uri);
				if (item.resource.mimeType && getAttachableImageExtension(item.resource.mimeType) && 'blob' in item.resource) {
					await addAsInlineData(item.resource.mimeType, item.resource.blob, uri);
				} else {
					details.output.push({
						type: 'embed',
						uri,
						isText: 'text' in item.resource,
						mimeType: item.resource.mimeType,
						value: 'blob' in item.resource ? item.resource.blob : item.resource.text,
						audience,
						asResource: true,
					});

					if (isForModel) {
						const permalink = invocation.context && ChatResponseResource.createUri(invocation.context.sessionResource, invocation.callId, result.content.length, basename(uri));
						addAsLinkedResource(permalink || uri, item.resource.mimeType);
					}
				}
			}
		}

		if (callResult.structuredContent) {
			details.output.push({ type: 'embed', isText: true, value: JSON.stringify(callResult.structuredContent, null, 2), audience: [LanguageModelPartAudience.Assistant] });
			result.content.push({ kind: 'text', value: JSON.stringify(callResult.structuredContent), audience: [LanguageModelPartAudience.Assistant] });
		}

		result.toolResultDetails = details;
		return result;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../base/common/assert.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { derived, IObservable, observableValue, autorunSelfDisposable } from '../../../../base/common/observable.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { mcpAccessConfig, McpAccessValue } from '../../../../platform/mcp/common/mcpManagement.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { ConfigurationResolverExpression, IResolvedValue } from '../../../services/configurationResolver/common/configurationResolverExpression.js';
import { AUX_WINDOW_GROUP, IEditorService } from '../../../services/editor/common/editorService.js';
import { IMcpDevModeDebugging } from './mcpDevMode.js';
import { McpRegistryInputStorage } from './mcpRegistryInputStorage.js';
import { IMcpHostDelegate, IMcpRegistry, IMcpResolveConnectionOptions } from './mcpRegistryTypes.js';
import { McpServerConnection } from './mcpServerConnection.js';
import { IMcpServerConnection, LazyCollectionState, McpCollectionDefinition, McpDefinitionReference, McpServerDefinition, McpServerLaunch, McpServerTrust, McpStartServerInteraction, UserInteractionRequiredError } from './mcpTypes.js';

const notTrustedNonce = '__vscode_not_trusted';

export class McpRegistry extends Disposable implements IMcpRegistry {
	declare public readonly _serviceBrand: undefined;

	private readonly _collections = observableValue<readonly McpCollectionDefinition[]>('collections', []);
	private readonly _delegates = observableValue<readonly IMcpHostDelegate[]>('delegates', []);
	private readonly _mcpAccessValue: IObservable<string>;
	public readonly collections: IObservable<readonly McpCollectionDefinition[]> = derived(reader => {
		if (this._mcpAccessValue.read(reader) === McpAccessValue.None) {
			return [];
		}
		return this._collections.read(reader);
	});

	private readonly _workspaceStorage = new Lazy(() => this._register(this._instantiationService.createInstance(McpRegistryInputStorage, StorageScope.WORKSPACE, StorageTarget.USER)));
	private readonly _profileStorage = new Lazy(() => this._register(this._instantiationService.createInstance(McpRegistryInputStorage, StorageScope.PROFILE, StorageTarget.USER)));

	private readonly _ongoingLazyActivations = observableValue(this, 0);

	public readonly lazyCollectionState = derived(reader => {
		if (this._mcpAccessValue.read(reader) === McpAccessValue.None) {
			return { state: LazyCollectionState.AllKnown, collections: [] };
		}

		if (this._ongoingLazyActivations.read(reader) > 0) {
			return { state: LazyCollectionState.LoadingUnknown, collections: [] };
		}
		const collections = this._collections.read(reader);
		const hasUnknown = collections.some(c => c.lazy && c.lazy.isCached === false);
		return hasUnknown ? { state: LazyCollectionState.HasUnknown, collections: collections.filter(c => c.lazy && c.lazy.isCached === false) } : { state: LazyCollectionState.AllKnown, collections: [] };
	});

	public get delegates(): IObservable<readonly IMcpHostDelegate[]> {
		return this._delegates;
	}

	private readonly _onDidChangeInputs = this._register(new Emitter<void>());
	public readonly onDidChangeInputs = this._onDidChangeInputs.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationResolverService private readonly _configurationResolverService: IConfigurationResolverService,
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IEditorService private readonly _editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ILabelService private readonly _labelService: ILabelService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._mcpAccessValue = observableConfigValue(mcpAccessConfig, McpAccessValue.All, configurationService);
	}

	public registerDelegate(delegate: IMcpHostDelegate): IDisposable {
		const delegates = this._delegates.get().slice();
		delegates.push(delegate);
		delegates.sort((a, b) => b.priority - a.priority);
		this._delegates.set(delegates, undefined);

		return {
			dispose: () => {
				const delegates = this._delegates.get().filter(d => d !== delegate);
				this._delegates.set(delegates, undefined);
			}
		};
	}

	public registerCollection(collection: McpCollectionDefinition): IDisposable {
		const currentCollections = this._collections.get();
		const toReplace = currentCollections.find(c => c.lazy && c.id === collection.id);

		// Incoming collections replace the "lazy" versions. See `ExtensionMcpDiscovery` for an example.
		if (toReplace) {
			this._collections.set(currentCollections.map(c => c === toReplace ? collection : c), undefined);
		} else {
			this._collections.set([...currentCollections, collection]
				.sort((a, b) => (a.presentation?.order || 0) - (b.presentation?.order || 0)), undefined);
		}

		return {
			dispose: () => {
				const currentCollections = this._collections.get();
				this._collections.set(currentCollections.filter(c => c !== collection), undefined);
			}
		};
	}

	public getServerDefinition(collectionRef: McpDefinitionReference, definitionRef: McpDefinitionReference): IObservable<{ server: McpServerDefinition | undefined; collection: McpCollectionDefinition | undefined }> {
		const collectionObs = this._collections.map(cols => cols.find(c => c.id === collectionRef.id));
		return collectionObs.map((collection, reader) => {
			const server = collection?.serverDefinitions.read(reader).find(s => s.id === definitionRef.id);
			return { collection, server };
		});
	}

	public async discoverCollections(): Promise<McpCollectionDefinition[]> {
		const toDiscover = this._collections.get().filter(c => c.lazy && !c.lazy.isCached);

		this._ongoingLazyActivations.set(this._ongoingLazyActivations.get() + 1, undefined);
		await Promise.all(toDiscover.map(c => c.lazy?.load())).finally(() => {
			this._ongoingLazyActivations.set(this._ongoingLazyActivations.get() - 1, undefined);
		});

		const found: McpCollectionDefinition[] = [];
		const current = this._collections.get();
		for (const collection of toDiscover) {
			const rec = current.find(c => c.id === collection.id);
			if (!rec) {
				// ignored
			} else if (rec.lazy) {
				rec.lazy.removed?.(); // did not get replaced by the non-lazy version
			} else {
				found.push(rec);
			}
		}


		return found;
	}

	private _getInputStorage(scope: StorageScope): McpRegistryInputStorage {
		return scope === StorageScope.WORKSPACE ? this._workspaceStorage.value : this._profileStorage.value;
	}

	private _getInputStorageInConfigTarget(configTarget: ConfigurationTarget): McpRegistryInputStorage {
		return this._getInputStorage(
			configTarget === ConfigurationTarget.WORKSPACE || configTarget === ConfigurationTarget.WORKSPACE_FOLDER
				? StorageScope.WORKSPACE
				: StorageScope.PROFILE
		);
	}

	public async clearSavedInputs(scope: StorageScope, inputId?: string) {
		const storage = this._getInputStorage(scope);
		if (inputId) {
			await storage.clear(inputId);
		} else {
			storage.clearAll();
		}

		this._onDidChangeInputs.fire();
	}

	public async editSavedInput(inputId: string, folderData: IWorkspaceFolderData | undefined, configSection: string, target: ConfigurationTarget): Promise<void> {
		const storage = this._getInputStorageInConfigTarget(target);
		const expr = ConfigurationResolverExpression.parse(inputId);

		const stored = await storage.getMap();
		const previous = stored[inputId].value;
		await this._configurationResolverService.resolveWithInteraction(folderData, expr, configSection, previous ? { [inputId.slice(2, -1)]: previous } : {}, target);
		await this._updateStorageWithExpressionInputs(storage, expr);
	}

	public async setSavedInput(inputId: string, target: ConfigurationTarget, value: string): Promise<void> {
		const storage = this._getInputStorageInConfigTarget(target);
		const expr = ConfigurationResolverExpression.parse(inputId);
		for (const unresolved of expr.unresolved()) {
			expr.resolve(unresolved, value);
			break;
		}
		await this._updateStorageWithExpressionInputs(storage, expr);
	}

	public getSavedInputs(scope: StorageScope): Promise<{ [id: string]: IResolvedValue }> {
		return this._getInputStorage(scope).getMap();
	}

	private async _checkTrust(collection: McpCollectionDefinition, definition: McpServerDefinition, {
		trustNonceBearer,
		interaction,
		promptType = 'only-new',
		autoTrustChanges = false,
		errorOnUserInteraction = false,
	}: IMcpResolveConnectionOptions) {
		if (collection.trustBehavior === McpServerTrust.Kind.Trusted) {
			this._logService.trace(`MCP server ${definition.id} is trusted, no trust prompt needed`);
			return true;
		} else if (collection.trustBehavior === McpServerTrust.Kind.TrustedOnNonce) {
			if (definition.cacheNonce === trustNonceBearer.trustedAtNonce) {
				this._logService.trace(`MCP server ${definition.id} is unchanged, no trust prompt needed`);
				return true;
			}

			if (autoTrustChanges) {
				this._logService.trace(`MCP server ${definition.id} is was changed but user explicitly executed`);
				trustNonceBearer.trustedAtNonce = definition.cacheNonce;
				return true;
			}

			if (trustNonceBearer.trustedAtNonce === notTrustedNonce) {
				if (promptType === 'all-untrusted') {
					if (errorOnUserInteraction) {
						throw new UserInteractionRequiredError('serverTrust');
					}
					return this._promptForTrust(definition, collection, interaction, trustNonceBearer);
				} else {
					this._logService.trace(`MCP server ${definition.id} is untrusted, denying trust prompt`);
					return false;
				}
			}

			if (promptType === 'never') {
				this._logService.trace(`MCP server ${definition.id} trust state is unknown, skipping prompt`);
				return false;
			}

			if (errorOnUserInteraction) {
				throw new UserInteractionRequiredError('serverTrust');
			}

			const didTrust = await this._promptForTrust(definition, collection, interaction, trustNonceBearer);
			if (didTrust) {
				return true;
			}
			if (didTrust === undefined) {
				return undefined;
			}

			trustNonceBearer.trustedAtNonce = notTrustedNonce;
			return false;
		} else {
			assertNever(collection.trustBehavior);
		}
	}

	private async _promptForTrust(definition: McpServerDefinition, collection: McpCollectionDefinition, interaction: McpStartServerInteraction | undefined, trustNonceBearer: { trustedAtNonce: string | undefined }): Promise<boolean> {
		interaction ??= new McpStartServerInteraction();
		interaction.participants.set(definition.id, { s: 'waiting', definition, collection });

		const trustedDefinitionIds = await new Promise<string[] | undefined>(resolve => {
			autorunSelfDisposable(reader => {
				const map = interaction.participants.observable.read(reader);
				if (Iterable.some(map.values(), p => p.s === 'unknown')) {
					return; // wait to gather all calls
				}

				reader.dispose();
				interaction.choice ??= this._promptForTrustOpenDialog(
					[...map.values()].map((v) => v.s === 'waiting' ? v : undefined).filter(isDefined),
				);
				resolve(interaction.choice);
			});
		});

		this._logService.trace(`MCP trusted servers:`, trustedDefinitionIds);

		if (trustedDefinitionIds) {
			trustNonceBearer.trustedAtNonce = trustedDefinitionIds.includes(definition.id)
				? definition.cacheNonce
				: notTrustedNonce;
		}

		return !!trustedDefinitionIds?.includes(definition.id);
	}

	/**
	 * Confirms with the user which of the provided definitions should be trusted.
	 * Returns undefined if the user cancelled the flow, or the list of trusted
	 * definition IDs otherwise.
	 */
	protected async _promptForTrustOpenDialog(definitions: { definition: McpServerDefinition; collection: McpCollectionDefinition }[]): Promise<string[] | undefined> {
		function labelFor(r: { definition: McpServerDefinition; collection: McpCollectionDefinition }) {
			const originURI = r.definition.presentation?.origin?.uri || r.collection.presentation?.origin;
			let labelWithOrigin = originURI ? `[\`${r.definition.label}\`](${originURI})` : '`' + r.definition.label + '`';

			if (r.collection.source instanceof ExtensionIdentifier) {
				labelWithOrigin += ` (${localize('trustFromExt', 'from {0}', r.collection.source.value)})`;
			}

			return labelWithOrigin;
		}

		if (definitions.length === 1) {
			const def = definitions[0];
			const originURI = def.definition.presentation?.origin?.uri;

			const { result } = await this._dialogService.prompt(
				{
					message: localize('trustTitleWithOrigin', 'Trust and run MCP server {0}?', def.definition.label),
					custom: {
						icon: Codicon.shield,
						markdownDetails: [{
							markdown: new MarkdownString(localize('mcp.trust.details', 'The MCP server {0} was updated. MCP servers may add context to your chat session and lead to unexpected behavior. Do you want to trust and run this server?', labelFor(def))),
							actionHandler: () => {
								const editor = this._editorService.openEditor({ resource: originURI! }, AUX_WINDOW_GROUP);
								return editor.then(Boolean);
							},
						}]
					},
					buttons: [
						{ label: localize('mcp.trust.yes', 'Trust'), run: () => true },
						{ label: localize('mcp.trust.no', 'Do not trust'), run: () => false }
					],
				},
			);

			return result === undefined ? undefined : (result ? [def.definition.id] : []);
		}

		const list = definitions.map(d => `- ${labelFor(d)}`).join('\n');
		const { result } = await this._dialogService.prompt(
			{
				message: localize('trustTitleWithOriginMulti', 'Trust and run {0} MCP servers?', definitions.length),
				custom: {
					icon: Codicon.shield,
					markdownDetails: [{
						markdown: new MarkdownString(localize('mcp.trust.detailsMulti', 'Several updated MCP servers were discovered:\n\n{0}\n\n MCP servers may add context to your chat session and lead to unexpected behavior. Do you want to trust and run these server?', list)),
						actionHandler: (uri) => {
							const editor = this._editorService.openEditor({ resource: URI.parse(uri) }, AUX_WINDOW_GROUP);
							return editor.then(Boolean);
						},
					}]
				},
				buttons: [
					{ label: localize('mcp.trust.yes', 'Trust'), run: () => 'all' },
					{ label: localize('mcp.trust.pick', 'Pick Trusted'), run: () => 'pick' },
					{ label: localize('mcp.trust.no', 'Do not trust'), run: () => 'none' },
				],
			},
		);

		if (result === undefined) {
			return undefined;
		} else if (result === 'all') {
			return definitions.map(d => d.definition.id);
		} else if (result === 'none') {
			return [];
		}

		type ActionableButton = IQuickInputButton & { action: () => void };
		function isActionableButton(obj: IQuickInputButton): obj is ActionableButton {
			return typeof (obj as ActionableButton).action === 'function';
		}

		const store = new DisposableStore();
		const picker = store.add(this._quickInputService.createQuickPick<IQuickPickItem & { definitonId: string }>({ useSeparators: false }));
		picker.canSelectMany = true;
		picker.items = definitions.map(({ definition, collection }) => {
			const buttons: ActionableButton[] = [];
			if (definition.presentation?.origin) {
				const origin = definition.presentation.origin;
				buttons.push({
					iconClass: 'codicon-go-to-file',
					tooltip: 'Go to Definition',
					action: () => this._editorService.openEditor({ resource: origin.uri, options: { selection: origin.range } })
				});
			}

			return {
				type: 'item',
				label: definition.label,
				definitonId: definition.id,
				description: collection.source instanceof ExtensionIdentifier
					? collection.source.value
					: (definition.presentation?.origin ? this._labelService.getUriLabel(definition.presentation.origin.uri) : undefined),
				picked: false,
				buttons
			};
		});
		picker.placeholder = 'Select MCP servers to trust';
		picker.ignoreFocusOut = true;

		store.add(picker.onDidTriggerItemButton(e => {
			if (isActionableButton(e.button)) {
				e.button.action();
			}
		}));

		return new Promise<string[] | undefined>(resolve => {
			picker.onDidAccept(() => {
				resolve(picker.selectedItems.map(item => item.definitonId));
				picker.hide();
			});
			picker.onDidHide(() => {
				resolve(undefined);
			});
			picker.show();
		}).finally(() => store.dispose());
	}

	private async _updateStorageWithExpressionInputs(inputStorage: McpRegistryInputStorage, expr: ConfigurationResolverExpression<unknown>): Promise<void> {
		const secrets: Record<string, IResolvedValue> = {};
		const inputs: Record<string, IResolvedValue> = {};
		for (const [replacement, resolved] of expr.resolved()) {
			if (resolved.input?.type === 'promptString' && resolved.input.password) {
				secrets[replacement.id] = resolved;
			} else {
				inputs[replacement.id] = resolved;
			}
		}

		inputStorage.setPlainText(inputs);
		await inputStorage.setSecrets(secrets);
		this._onDidChangeInputs.fire();
	}

	private async _replaceVariablesInLaunch(delegate: IMcpHostDelegate, definition: McpServerDefinition, launch: McpServerLaunch, errorOnUserInteraction?: boolean) {
		if (!definition.variableReplacement) {
			return launch;
		}

		const { section, target, folder } = definition.variableReplacement;
		const inputStorage = this._getInputStorageInConfigTarget(target);
		const [previouslyStored, withRemoteFilled] = await Promise.all([
			inputStorage.getMap(),
			delegate.substituteVariables(definition, launch),
		]);

		// pre-fill the variables we already resolved to avoid extra prompting
		const expr = ConfigurationResolverExpression.parse(withRemoteFilled);
		for (const replacement of expr.unresolved()) {
			if (previouslyStored.hasOwnProperty(replacement.id)) {
				expr.resolve(replacement, previouslyStored[replacement.id]);
			}
		}

		// Check if there are still unresolved variables that would require interaction
		if (errorOnUserInteraction) {
			const unresolved = Array.from(expr.unresolved());
			if (unresolved.length > 0) {
				throw new UserInteractionRequiredError('variables');
			}
		}
		// resolve variables requiring user input
		await this._configurationResolverService.resolveWithInteraction(folder, expr, section, undefined, target);

		await this._updateStorageWithExpressionInputs(inputStorage, expr);

		// resolve other non-interactive variables, returning the final object
		return await this._configurationResolverService.resolveAsync(folder, expr);
	}

	public async resolveConnection(opts: IMcpResolveConnectionOptions): Promise<IMcpServerConnection | undefined> {
		const { collectionRef, definitionRef, interaction, logger, debug } = opts;
		let collection = this._collections.get().find(c => c.id === collectionRef.id);
		if (collection?.lazy) {
			await collection.lazy.load();
			collection = this._collections.get().find(c => c.id === collectionRef.id);
		}

		const definition = collection?.serverDefinitions.get().find(s => s.id === definitionRef.id);
		if (!collection || !definition) {
			throw new Error(`Collection or definition not found for ${collectionRef.id} and ${definitionRef.id}`);
		}

		const delegate = this._delegates.get().find(d => d.canStart(collection, definition));
		if (!delegate) {
			throw new Error('No delegate found that can handle the connection');
		}

		const trusted = await this._checkTrust(collection, definition, opts);
		interaction?.participants.set(definition.id, { s: 'resolved' });
		if (!trusted) {
			return undefined;
		}

		let launch: McpServerLaunch | undefined = definition.launch;
		if (collection.resolveServerLanch) {
			launch = await collection.resolveServerLanch(definition);
			if (!launch) {
				return undefined; // interaction cancelled by user
			}
		}

		try {
			launch = await this._replaceVariablesInLaunch(delegate, definition, launch, opts.errorOnUserInteraction);

			if (definition.devMode && debug) {
				launch = await this._instantiationService.invokeFunction(accessor => accessor.get(IMcpDevModeDebugging).transform(definition, launch!));
			}
		} catch (e) {
			if (e instanceof UserInteractionRequiredError) {
				throw e;
			}

			this._notificationService.notify({
				severity: Severity.Error,
				message: localize('mcp.launchError', 'Error starting {0}: {1}', definition.label, String(e)),
				actions: {
					primary: collection.presentation?.origin && [
						{
							id: 'mcp.launchError.openConfig',
							class: undefined,
							enabled: true,
							tooltip: '',
							label: localize('mcp.launchError.openConfig', 'Open Configuration'),
							run: () => this._editorService.openEditor({
								resource: collection.presentation!.origin,
								options: { selection: definition.presentation?.origin?.range }
							}),
						}
					]
				}
			});
			return;
		}

		return this._instantiationService.createInstance(
			McpServerConnection,
			collection,
			definition,
			delegate,
			launch,
			logger,
			opts.errorOnUserInteraction,
			opts.taskManager,
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpRegistryInputStorage.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpRegistryInputStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Sequencer } from '../../../../base/common/async.js';
import { decodeBase64, encodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IResolvedValue } from '../../../services/configurationResolver/common/configurationResolverExpression.js';

const MCP_ENCRYPTION_KEY_NAME = 'mcpEncryptionKey';
const MCP_ENCRYPTION_KEY_ALGORITHM = 'AES-GCM';
const MCP_ENCRYPTION_KEY_LEN = 256;
const MCP_ENCRYPTION_IV_LENGTH = 12; // 96 bits
const MCP_DATA_STORED_VERSION = 1;
const MCP_DATA_STORED_KEY = 'mcpInputs';

interface IStoredData {
	version: number;
	values: Record<string, IResolvedValue>;
	secrets?: { value: string; iv: string }; // base64, encrypted
}

interface IHydratedData extends IStoredData {
	unsealedSecrets?: Record<string, IResolvedValue>;
}

export class McpRegistryInputStorage extends Disposable {
	private static secretSequencer = new Sequencer();
	private readonly _secretsSealerSequencer = new Sequencer();

	private readonly _getEncryptionKey = new Lazy(() => {
		return McpRegistryInputStorage.secretSequencer.queue(async () => {
			const existing = await this._secretStorageService.get(MCP_ENCRYPTION_KEY_NAME);
			if (existing) {
				try {
					const parsed: JsonWebKey = JSON.parse(existing);
					return await crypto.subtle.importKey('jwk', parsed, MCP_ENCRYPTION_KEY_ALGORITHM, false, ['encrypt', 'decrypt']);
				} catch {
					// fall through
				}
			}

			const key = await crypto.subtle.generateKey(
				{ name: MCP_ENCRYPTION_KEY_ALGORITHM, length: MCP_ENCRYPTION_KEY_LEN },
				true,
				['encrypt', 'decrypt'],
			);

			const exported = await crypto.subtle.exportKey('jwk', key);
			await this._secretStorageService.set(MCP_ENCRYPTION_KEY_NAME, JSON.stringify(exported));
			return key;
		});
	});

	private _didChange = false;

	private _record = new Lazy<IHydratedData>(() => {
		const stored = this._storageService.getObject<IStoredData>(MCP_DATA_STORED_KEY, this._scope);
		return stored?.version === MCP_DATA_STORED_VERSION ? { ...stored } : { version: MCP_DATA_STORED_VERSION, values: {} };
	});


	constructor(
		private readonly _scope: StorageScope,
		_target: StorageTarget,
		@IStorageService private readonly _storageService: IStorageService,
		@ISecretStorageService private readonly _secretStorageService: ISecretStorageService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();

		this._register(_storageService.onWillSaveState(() => {
			if (this._didChange) {
				this._storageService.store(MCP_DATA_STORED_KEY, {
					version: MCP_DATA_STORED_VERSION,
					values: this._record.value.values,
					secrets: this._record.value.secrets,
				} satisfies IStoredData, this._scope, _target);
				this._didChange = false;
			}
		}));
	}

	/** Deletes all collection data from storage. */
	public clearAll() {
		this._record.value.values = {};
		this._record.value.secrets = undefined;
		this._record.value.unsealedSecrets = undefined;
		this._didChange = true;
	}

	/** Delete a single collection data from the storage. */
	public async clear(inputKey: string) {
		const secrets = await this._unsealSecrets();
		delete this._record.value.values[inputKey];
		this._didChange = true;

		if (secrets.hasOwnProperty(inputKey)) {
			delete secrets[inputKey];
			await this._sealSecrets();
		}
	}

	/** Gets a mapping of saved input data. */
	public async getMap() {
		const secrets = await this._unsealSecrets();
		return { ...this._record.value.values, ...secrets };
	}

	/** Updates the input data mapping. */
	public async setPlainText(values: Record<string, IResolvedValue>) {
		Object.assign(this._record.value.values, values);
		this._didChange = true;
	}

	/** Updates the input secrets mapping. */
	public async setSecrets(values: Record<string, IResolvedValue>) {
		const unsealed = await this._unsealSecrets();
		Object.assign(unsealed, values);
		await this._sealSecrets();
	}

	private async _sealSecrets() {
		const key = await this._getEncryptionKey.value;
		return this._secretsSealerSequencer.queue(async () => {
			if (!this._record.value.unsealedSecrets || isEmptyObject(this._record.value.unsealedSecrets)) {
				this._record.value.secrets = undefined;
				return;
			}

			const toSeal = JSON.stringify(this._record.value.unsealedSecrets);
			const iv = crypto.getRandomValues(new Uint8Array(MCP_ENCRYPTION_IV_LENGTH));
			const encrypted = await crypto.subtle.encrypt(
				{ name: MCP_ENCRYPTION_KEY_ALGORITHM, iv: iv.buffer },
				key,
				new TextEncoder().encode(toSeal).buffer as ArrayBuffer,
			);

			const enc = encodeBase64(VSBuffer.wrap(new Uint8Array(encrypted)));
			this._record.value.secrets = { iv: encodeBase64(VSBuffer.wrap(iv)), value: enc };
			this._didChange = true;
		});
	}

	private async _unsealSecrets(): Promise<Record<string, IResolvedValue>> {
		if (!this._record.value.secrets) {
			return this._record.value.unsealedSecrets ??= {};
		}

		if (this._record.value.unsealedSecrets) {
			return this._record.value.unsealedSecrets;
		}

		try {
			const key = await this._getEncryptionKey.value;
			const iv = decodeBase64(this._record.value.secrets.iv);
			const encrypted = decodeBase64(this._record.value.secrets.value);

			const decrypted = await crypto.subtle.decrypt(
				{ name: MCP_ENCRYPTION_KEY_ALGORITHM, iv: iv.buffer as Uint8Array<ArrayBuffer> },
				key,
				encrypted.buffer as Uint8Array<ArrayBuffer>,
			);

			const unsealedSecrets = JSON.parse(new TextDecoder().decode(decrypted));
			this._record.value.unsealedSecrets = unsealedSecrets;
			return unsealedSecrets;
		} catch (e) {
			this._logService.warn('Error unsealing MCP secrets', e);
			this._record.value.secrets = undefined;
		}

		return {};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpRegistryTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpRegistryTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogger, LogLevel } from '../../../../platform/log/common/log.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { IResolvedValue } from '../../../services/configurationResolver/common/configurationResolverExpression.js';
import { McpTaskManager } from './mcpTaskManager.js';
import { IMcpServerConnection, LazyCollectionState, McpCollectionDefinition, McpCollectionReference, McpConnectionState, McpDefinitionReference, McpServerDefinition, McpServerLaunch, McpStartServerInteraction } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';

export const IMcpRegistry = createDecorator<IMcpRegistry>('mcpRegistry');

/** Message transport to a single MCP server. */
export interface IMcpMessageTransport extends IDisposable {
	readonly state: IObservable<McpConnectionState>;
	readonly onDidLog: Event<{ level: LogLevel; message: string }>;
	readonly onDidReceiveMessage: Event<MCP.JSONRPCMessage>;
	send(message: MCP.JSONRPCMessage): void;
	stop(): void;
}

export interface IMcpHostDelegate {
	/** Priority for this delegate, delegates are tested in descending priority order */
	readonly priority: number;
	waitForInitialProviderPromises(): Promise<void>;
	canStart(collectionDefinition: McpCollectionDefinition, serverDefinition: McpServerDefinition): boolean;
	substituteVariables(serverDefinition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch>;
	start(collectionDefinition: McpCollectionDefinition, serverDefinition: McpServerDefinition, resolvedLaunch: McpServerLaunch, options?: { errorOnUserInteraction?: boolean }): IMcpMessageTransport;
}

export interface IMcpResolveConnectionOptions {
	logger: ILogger;
	interaction?: McpStartServerInteraction;
	collectionRef: McpCollectionReference;
	definitionRef: McpDefinitionReference;

	/** A reference (on the server) to its last nonce where trust was given. */
	trustNonceBearer: { trustedAtNonce: string | undefined };
	/**
	 * When to trigger the trust prompt.
	 * - only-new: only prompt for servers that are not previously explicitly untrusted (default)
	 * - all-untrusted: prompt for all servers that are not trusted
	 * - never: don't prompt, fail silently when trying to start an untrusted server
	 */
	promptType?: 'only-new' | 'all-untrusted' | 'never';
	/**
	 * Automatically trust if changed. This should ONLY be set for afforances that
	 * ensure the user sees the config before it gets started (e.g. code lenses)
	 */
	autoTrustChanges?: boolean;

	/** If set, try to launch with debugging when dev mode is configured */
	debug?: boolean;

	/** If true, throw an error if any user interaction would be required during startup. */
	errorOnUserInteraction?: boolean;

	/** Shared task manager for server-side MCP tasks (survives reconnections) */
	taskManager: McpTaskManager;
}

export interface IMcpRegistry {
	readonly _serviceBrand: undefined;

	/** Fired when the user provides more inputs when creating a connection. */
	readonly onDidChangeInputs: Event<void>;

	readonly collections: IObservable<readonly McpCollectionDefinition[]>;
	readonly delegates: IObservable<readonly IMcpHostDelegate[]>;
	/** Whether there are new collections that can be resolved with a discover() call */
	readonly lazyCollectionState: IObservable<{ state: LazyCollectionState; collections: McpCollectionDefinition[] }>;

	/** Helper function to observe a definition by its reference. */
	getServerDefinition(collectionRef: McpDefinitionReference, definitionRef: McpDefinitionReference): IObservable<{ server: McpServerDefinition | undefined; collection: McpCollectionDefinition | undefined }>;

	/** Discover new collections, returning newly-discovered ones. */
	discoverCollections(): Promise<McpCollectionDefinition[]>;

	registerDelegate(delegate: IMcpHostDelegate): IDisposable;
	registerCollection(collection: McpCollectionDefinition): IDisposable;

	/** Resets any saved inputs for the input, or globally. */
	clearSavedInputs(scope: StorageScope, inputId?: string): Promise<void>;
	/** Edits a previously-saved input. */
	editSavedInput(inputId: string, folderData: IWorkspaceFolderData | undefined, configSection: string, target: ConfigurationTarget): Promise<void>;
	/** Updates a saved input. */
	setSavedInput(inputId: string, target: ConfigurationTarget, value: string): Promise<void>;
	/** Gets saved inputs from storage. */
	getSavedInputs(scope: StorageScope): Promise<{ [id: string]: IResolvedValue }>;
	/** Creates a connection for the collection and definition. */
	resolveConnection(options: IMcpResolveConnectionOptions): Promise<IMcpServerConnection | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpResourceFilesystem.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpResourceFilesystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sumBy } from '../../../../base/common/arrays.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { decodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenPool, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { autorun } from '../../../../base/common/observable.js';
import { newWriteableStream, ReadableStreamEvents } from '../../../../base/common/stream.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { createFileSystemProviderError, FileChangeType, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileChange, IFileDeleteOptions, IFileOverwriteOptions, IFileReadStreamOptions, IFileService, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IFileWriteOptions, IStat, IWatchOptions } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWebContentExtractorService } from '../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { McpServer } from './mcpServer.js';
import { McpServerRequestHandler } from './mcpServerRequestHandler.js';
import { IMcpService, McpCapability, McpResourceURI } from './mcpTypes.js';
import { canLoadMcpNetworkResourceDirectly } from './mcpTypesUtils.js';
import { MCP } from './modelContextProtocol.js';

const MOMENTARY_CACHE_DURATION = 3000;

interface IReadData {
	contents: (MCP.TextResourceContents | MCP.BlobResourceContents)[];
	resourceURI: URL;
	forSameURI: (MCP.TextResourceContents | MCP.BlobResourceContents)[];
}

export class McpResourceFilesystem extends Disposable implements IWorkbenchContribution,
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileReadStreamCapability {
	/** Defer getting the MCP service since this is a BlockRestore and no need to make it unnecessarily. */
	private readonly _mcpServiceLazy = new Lazy(() => this._instantiationService.invokeFunction(a => a.get(IMcpService)));

	/**
	 * For many file operations we re-read the resources quickly (e.g. stat
	 * before reading the file) and would prefer to avoid spamming the MCP
	 * with multiple reads. This is a very short-duration cache
	 * to solve that.
	 */
	private readonly _momentaryCache = new ResourceMap<{ pool: CancellationTokenPool; promise: Promise<IReadData> }>();

	private get _mcpService() {
		return this._mcpServiceLazy.value;
	}

	public readonly onDidChangeCapabilities = Event.None;

	private readonly _onDidChangeFile = this._register(new Emitter<readonly IFileChange[]>());
	public readonly onDidChangeFile = this._onDidChangeFile.event;

	public readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.None
		| FileSystemProviderCapabilities.Readonly
		| FileSystemProviderCapabilities.PathCaseSensitive
		| FileSystemProviderCapabilities.FileReadStream
		| FileSystemProviderCapabilities.FileAtomicRead
		| FileSystemProviderCapabilities.FileReadWrite;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IFileService private readonly _fileService: IFileService,
		@IWebContentExtractorService private readonly _webContentExtractorService: IWebContentExtractorService,
	) {
		super();
		this._register(this._fileService.registerProvider(McpResourceURI.scheme, this));
	}

	//#region Filesystem API

	public async readFile(resource: URI): Promise<Uint8Array> {
		return this._readFile(resource);
	}

	public readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);

		this._readFile(resource, token).then(
			data => {
				if (opts.position) {
					data = data.slice(opts.position);
				}

				if (opts.length) {
					data = data.slice(0, opts.length);
				}

				stream.end(data);
			},
			err => stream.error(err),
		);

		return stream;
	}

	public watch(uri: URI, _opts: IWatchOptions): IDisposable {
		const { resourceURI, server } = this._decodeURI(uri);
		const cap = server.capabilities.get();
		if (cap !== undefined && !(cap & McpCapability.ResourcesSubscribe)) {
			return Disposable.None;
		}

		server.start();

		const store = new DisposableStore();
		let watchedOnHandler: McpServerRequestHandler | undefined;
		const watchListener = store.add(new MutableDisposable());
		const callCts = store.add(new MutableDisposable<CancellationTokenSource>());
		store.add(autorun(reader => {
			const connection = server.connection.read(reader);
			if (!connection) {
				return;
			}

			const handler = connection.handler.read(reader);
			if (!handler || watchedOnHandler === handler) {
				return;
			}

			callCts.value?.dispose(true);
			callCts.value = new CancellationTokenSource();
			watchedOnHandler = handler;

			const token = callCts.value.token;
			handler.subscribe({ uri: resourceURI.toString() }, token).then(
				() => {
					if (!token.isCancellationRequested) {
						watchListener.value = handler.onDidUpdateResource(e => {
							if (equalsUrlPath(e.params.uri, resourceURI)) {
								this._onDidChangeFile.fire([{ resource: uri, type: FileChangeType.UPDATED }]);
							}
						});
					}
				}, err => {
					handler.logger.warn(`Failed to subscribe to resource changes for ${resourceURI}: ${err}`);
					watchedOnHandler = undefined;
				},
			);
		}));

		return store;
	}

	public async stat(resource: URI): Promise<IStat> {
		const { forSameURI, contents } = await this._readURI(resource);
		if (!contents.length) {
			throw createFileSystemProviderError(`File not found`, FileSystemProviderErrorCode.FileNotFound);
		}

		return {
			ctime: 0,
			mtime: 0,
			size: sumBy(contents, c => contentToBuffer(c).byteLength),
			type: forSameURI.length ? FileType.File : FileType.Directory,
		};
	}

	public async readdir(resource: URI): Promise<[string, FileType][]> {
		const { forSameURI, contents, resourceURI } = await this._readURI(resource);
		if (forSameURI.length > 0) {
			throw createFileSystemProviderError(`File is not a directory`, FileSystemProviderErrorCode.FileNotADirectory);
		}
		const resourcePathParts = resourceURI.pathname.split('/');

		const output = new Map<string, FileType>();
		for (const content of contents) {
			const contentURI = URI.parse(content.uri);
			const contentPathParts = contentURI.path.split('/');

			// Skip contents that are not in the same directory
			if (contentPathParts.length <= resourcePathParts.length || !resourcePathParts.every((part, index) => equalsIgnoreCase(part, contentPathParts[index]))) {
				continue;
			}

			// nested resource in a directory, just emit a directory to output
			else if (contentPathParts.length > resourcePathParts.length + 1) {
				output.set(contentPathParts[resourcePathParts.length], FileType.Directory);
			}

			else {
				// resource in the same directory, emit the file
				const name = contentPathParts[contentPathParts.length - 1];
				output.set(name, contentToBuffer(content).byteLength > 0 ? FileType.File : FileType.Directory);
			}
		}

		return [...output];
	}

	public mkdir(resource: URI): Promise<void> {
		throw createFileSystemProviderError('write is not supported', FileSystemProviderErrorCode.NoPermissions);
	}
	public writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		throw createFileSystemProviderError('write is not supported', FileSystemProviderErrorCode.NoPermissions);
	}
	public delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		throw createFileSystemProviderError('delete is not supported', FileSystemProviderErrorCode.NoPermissions);
	}
	public rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		throw createFileSystemProviderError('rename is not supported', FileSystemProviderErrorCode.NoPermissions);
	}

	//#endregion

	private async _readFile(resource: URI, token?: CancellationToken): Promise<Uint8Array> {
		const { forSameURI, contents } = await this._readURI(resource);

		// MCP does not distinguish between files and directories, and says that
		// servers should just return multiple when 'reading' a directory.
		if (!forSameURI.length) {
			if (!contents.length) {
				throw createFileSystemProviderError(`File not found`, FileSystemProviderErrorCode.FileNotFound);
			} else {
				throw createFileSystemProviderError(`File is a directory`, FileSystemProviderErrorCode.FileIsADirectory);
			}
		}

		return contentToBuffer(forSameURI[0]);
	}

	private _decodeURI(uri: URI) {
		let definitionId: string;
		let resourceURL: URL;
		try {
			({ definitionId, resourceURL } = McpResourceURI.toServer(uri));
		} catch (e) {
			throw createFileSystemProviderError(String(e), FileSystemProviderErrorCode.FileNotFound);
		}

		if (resourceURL.pathname.endsWith('/')) {
			resourceURL.pathname = resourceURL.pathname.slice(0, -1);
		}

		const server = this._mcpService.servers.get().find(s => s.definition.id === definitionId);
		if (!server) {
			throw createFileSystemProviderError(`MCP server ${definitionId} not found`, FileSystemProviderErrorCode.FileNotFound);
		}

		const cap = server.capabilities.get();
		if (cap !== undefined && !(cap & McpCapability.Resources)) {
			throw createFileSystemProviderError(`MCP server ${definitionId} does not support resources`, FileSystemProviderErrorCode.FileNotFound);
		}

		return { definitionId, resourceURI: resourceURL, server };
	}

	private async _readURI(uri: URI, token?: CancellationToken) {
		const cached = this._momentaryCache.get(uri);
		if (cached) {
			cached.pool.add(token || CancellationToken.None);
			return cached.promise;
		}

		const pool = this._store.add(new CancellationTokenPool());
		pool.add(token || CancellationToken.None);

		const promise = this._readURIInner(uri, pool.token);
		this._momentaryCache.set(uri, { pool, promise });

		const disposable = this._store.add(disposableTimeout(() => {
			this._momentaryCache.delete(uri);
			this._store.delete(disposable);
			this._store.delete(pool);
		}, MOMENTARY_CACHE_DURATION));

		return promise;
	}

	private async _readURIInner(uri: URI, token?: CancellationToken): Promise<IReadData> {
		const { resourceURI, server } = this._decodeURI(uri);
		const matchedServer = this._mcpService.servers.get().find(s => s.definition.id === server.definition.id);

		//check for http/https resources and use web content extractor service to fetch the contents.
		if (canLoadMcpNetworkResourceDirectly(resourceURI, matchedServer)) {
			const extractURI = URI.parse(resourceURI.toString());
			const result = (await this._webContentExtractorService.extract([extractURI], { followRedirects: false })).at(0);
			if (result?.status === 'ok') {
				return {
					contents: [{ uri: resourceURI.toString(), text: result.result }],
					resourceURI,
					forSameURI: [{ uri: resourceURI.toString(), text: result.result }]
				};
			}
		}

		const res = await McpServer.callOn(server, r => r.readResource({ uri: resourceURI.toString() }, token), token);
		return {
			contents: res.contents,
			resourceURI,
			forSameURI: res.contents.filter(c => equalsUrlPath(c.uri, resourceURI))
		};
	}
}

function equalsUrlPath(a: string, b: URL): boolean {
	// MCP doesn't specify either way, but underlying systems may can be case-sensitive.
	// It's better to treat case-sensitive paths as case-insensitive than vise-versa.
	return equalsIgnoreCase(new URL(a).pathname, b.pathname);
}

function contentToBuffer(content: MCP.TextResourceContents | MCP.BlobResourceContents): Uint8Array {
	if ('text' in content) {
		return VSBuffer.fromString(content.text).buffer;
	} else if ('blob' in content) {
		return decodeBase64(content.blob).buffer;
	} else {
		throw createFileSystemProviderError('Unknown content type', FileSystemProviderErrorCode.Unknown);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpSamplingLog.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpSamplingLog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { ObservableMemento, observableMemento } from '../../../../platform/observable/common/observableMemento.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IMcpServer } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';

const enum Constants {
	SamplingRetentionDays = 7,
	MsPerDay = 24 * 60 * 60 * 1000,
	SamplingRetentionMs = SamplingRetentionDays * MsPerDay,
	SamplingLastNMessage = 30,
}

export interface ISamplingStoredData {
	// UTC day ordinal of the first bin in the bins
	head: number;
	// Requests per day, max length of `Constants.SamplingRetentionDays`
	bins: number[];
	// Last sampling requests/responses
	lastReqs: { request: MCP.SamplingMessage[]; response: string; at: number; model: string }[];
}

const samplingMemento = observableMemento<ReadonlyMap<string, ISamplingStoredData>>({
	defaultValue: new Map(),
	key: 'mcp.sampling.logs',
	toStorage: v => JSON.stringify(Array.from(v.entries())),
	fromStorage: v => new Map(JSON.parse(v)),
});

export class McpSamplingLog extends Disposable {
	private readonly _logs: { [K in StorageScope]?: ObservableMemento<ReadonlyMap<string, ISamplingStoredData>> } = {};

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
	) {
		super();
	}

	public has(server: IMcpServer): boolean {
		const storage = this._getLogStorageForServer(server);
		return storage.get().has(server.definition.id);
	}

	public get(server: IMcpServer): Readonly<ISamplingStoredData | undefined> {
		const storage = this._getLogStorageForServer(server);
		return storage.get().get(server.definition.id);
	}

	public getAsText(server: IMcpServer): string {
		const storage = this._getLogStorageForServer(server);
		const record = storage.get().get(server.definition.id);
		if (!record) {
			return '';
		}

		const parts: string[] = [];
		const total = record.bins.reduce((sum, value) => sum + value, 0);
		parts.push(localize('mcp.sampling.rpd', '{0} total requests in the last 7 days.', total));

		parts.push(this._formatRecentRequests(record));
		return parts.join('\n');
	}

	private _formatRecentRequests(data: ISamplingStoredData): string {
		if (!data.lastReqs.length) {
			return '\nNo recent requests.';
		}

		const result: string[] = [];
		for (let i = 0; i < data.lastReqs.length; i++) {
			const { request, response, at, model } = data.lastReqs[i];
			result.push(`\n[${i + 1}] ${new Date(at).toISOString()} ${model}`);

			result.push('  Request:');
			for (const msg of request) {
				const role = msg.role.padEnd(9);
				let content = '';
				if ('text' in msg.content && msg.content.type === 'text') {
					content = msg.content.text;
				} else if ('data' in msg.content) {
					content = `[${msg.content.type} data: ${msg.content.mimeType}]`;
				}
				result.push(`    ${role}: ${content}`);
			}
			result.push('  Response:');
			result.push(`    ${response}`);
		}

		return result.join('\n');
	}

	public async add(server: IMcpServer, request: MCP.SamplingMessage[], response: string, model: string) {
		const now = Date.now();
		const utcOrdinal = Math.floor(now / Constants.MsPerDay);
		const storage = this._getLogStorageForServer(server);

		const next = new Map(storage.get());
		let record = next.get(server.definition.id);
		if (!record) {
			record = {
				head: utcOrdinal,
				bins: Array.from({ length: Constants.SamplingRetentionDays }, () => 0),
				lastReqs: [],
			};
		} else {
			// Shift bins back by daysSinceHead, dropping old days
			for (let i = 0; i < (utcOrdinal - record.head) && i < Constants.SamplingRetentionDays; i++) {
				record.bins.pop();
				record.bins.unshift(0);
			}
			record.head = utcOrdinal;
		}

		// Increment the current day's bin (head)
		record.bins[0]++;
		record.lastReqs.unshift({ request, response, at: now, model });
		while (record.lastReqs.length > Constants.SamplingLastNMessage) {
			record.lastReqs.pop();
		}

		next.set(server.definition.id, record);
		storage.set(next, undefined);
	}

	private _getLogStorageForServer(server: IMcpServer) {
		const scope = server.readDefinitions().get().collection?.scope ?? StorageScope.WORKSPACE;
		return this._logs[scope] ??= this._register(samplingMemento(scope, StorageTarget.MACHINE, this._storageService));
	}
}
```

--------------------------------------------------------------------------------

````

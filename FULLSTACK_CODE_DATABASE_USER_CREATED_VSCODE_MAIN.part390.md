---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 390
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 390 of 552)

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

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionsViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionsViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { localize } from '../../../../nls.js';
import { IDisposable, dispose, Disposable, DisposableStore, toDisposable, isDisposable } from '../../../../base/common/lifecycle.js';
import { Action, ActionRunner, IAction, Separator } from '../../../../base/common/actions.js';
import { IExtensionsWorkbenchService, IExtension, IExtensionsViewState } from '../common/extensions.js';
import { Event } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IListService, IWorkbenchPagedListOptions, WorkbenchAsyncDataTree, WorkbenchPagedList } from '../../../../platform/list/browser/listService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { registerThemingParticipant, IColorTheme, ICssStyleCollector } from '../../../../platform/theme/common/themeService.js';
import { IAsyncDataSource, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { IListVirtualDelegate, IListRenderer, IListContextMenuEvent } from '../../../../base/browser/ui/list/list.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { Delegate, Renderer } from './extensionsList.js';
import { listFocusForeground, listFocusBackground, foreground, editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { IListStyles } from '../../../../base/browser/ui/list/listWidget.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IStyleOverride } from '../../../../platform/theme/browser/defaultStyles.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IWorkbenchLayoutService, Position } from '../../../services/layout/browser/layoutService.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ExtensionAction, getContextMenuActions, ManageExtensionAction } from './extensionsActions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { getLocationBasedViewColors } from '../../../browser/parts/views/viewPane.js';
import { DelayedPagedModel, IPagedModel } from '../../../../base/common/paging.js';
import { ExtensionIconWidget } from './extensionsWidgets.js';

function getAriaLabelForExtension(extension: IExtension | null): string {
	if (!extension) {
		return '';
	}
	const publisher = extension.publisherDomain?.verified ? localize('extension.arialabel.verifiedPublisher', "Verified Publisher {0}", extension.publisherDisplayName) : localize('extension.arialabel.publisher', "Publisher {0}", extension.publisherDisplayName);
	const deprecated = extension?.deprecationInfo ? localize('extension.arialabel.deprecated', "Deprecated") : '';
	const rating = extension?.rating ? localize('extension.arialabel.rating', "Rated {0} out of 5 stars by {1} users", extension.rating.toFixed(2), extension.ratingCount) : '';
	return `${extension.displayName}, ${deprecated ? `${deprecated}, ` : ''}${extension.version}, ${publisher}, ${extension.description} ${rating ? `, ${rating}` : ''}`;
}

export class ExtensionsList extends Disposable {

	readonly list: WorkbenchPagedList<IExtension>;
	private readonly contextMenuActionRunner = this._register(new ActionRunner());

	constructor(
		parent: HTMLElement,
		viewId: string,
		options: Partial<IWorkbenchPagedListOptions<IExtension>>,
		extensionsViewState: IExtensionsViewState,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@INotificationService notificationService: INotificationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this._register(this.contextMenuActionRunner.onDidRun(({ error }) => error && notificationService.error(error)));
		const delegate = new Delegate();
		const renderer = instantiationService.createInstance(Renderer, extensionsViewState, {
			hoverOptions: {
				position: () => {
					const viewLocation = viewDescriptorService.getViewLocationById(viewId);
					if (viewLocation === ViewContainerLocation.Sidebar) {
						return layoutService.getSideBarPosition() === Position.LEFT ? HoverPosition.RIGHT : HoverPosition.LEFT;
					}
					if (viewLocation === ViewContainerLocation.AuxiliaryBar) {
						return layoutService.getSideBarPosition() === Position.LEFT ? HoverPosition.LEFT : HoverPosition.RIGHT;
					}
					return HoverPosition.RIGHT;
				}
			}
		});
		this.list = instantiationService.createInstance(WorkbenchPagedList, `${viewId}-Extensions`, parent, delegate, [renderer], {
			multipleSelectionSupport: false,
			setRowLineHeight: false,
			horizontalScrolling: false,
			accessibilityProvider: {
				getAriaLabel(extension: IExtension | null): string {
					return getAriaLabelForExtension(extension);
				},
				getWidgetAriaLabel(): string {
					return localize('extensions', "Extensions");
				}
			},
			overrideStyles: getLocationBasedViewColors(viewDescriptorService.getViewLocationById(viewId)).listOverrideStyles,
			openOnSingleClick: true,
			...options
		}) as WorkbenchPagedList<IExtension>;
		this._register(this.list.onContextMenu(e => this.onContextMenu(e), this));
		this._register(this.list);

		this._register(Event.debounce(Event.filter(this.list.onDidOpen, e => e.element !== null), (_, event) => event, 75, true)(options => {
			this.openExtension(options.element!, { sideByside: options.sideBySide, ...options.editorOptions });
		}));
	}

	setModel(model: IPagedModel<IExtension>) {
		this.list.model = new DelayedPagedModel(model);
	}

	layout(height?: number, width?: number): void {
		this.list.layout(height, width);
	}

	private openExtension(extension: IExtension, options: { sideByside?: boolean; preserveFocus?: boolean; pinned?: boolean }): void {
		extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, extension.identifier))[0] || extension;
		this.extensionsWorkbenchService.open(extension, options);
	}

	private async onContextMenu(e: IListContextMenuEvent<IExtension>): Promise<void> {
		if (e.element) {
			const disposables = new DisposableStore();
			const manageExtensionAction = disposables.add(this.instantiationService.createInstance(ManageExtensionAction));
			const extension = e.element ? this.extensionsWorkbenchService.local.find(local => areSameExtensions(local.identifier, e.element!.identifier) && (!e.element!.server || e.element!.server === local.server)) || e.element
				: e.element;
			manageExtensionAction.extension = extension;
			let groups: IAction[][] = [];
			if (manageExtensionAction.enabled) {
				groups = await manageExtensionAction.getActionGroups();
			} else if (extension) {
				groups = await getContextMenuActions(extension, this.contextKeyService, this.instantiationService);
				groups.forEach(group => group.forEach(extensionAction => {
					if (extensionAction instanceof ExtensionAction) {
						extensionAction.extension = extension;
					}
				}));
			}
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
}

export class ExtensionsGridView extends Disposable {

	readonly element: HTMLElement;
	private readonly renderer: Renderer;
	private readonly delegate: Delegate;
	private readonly disposableStore: DisposableStore;

	constructor(
		parent: HTMLElement,
		delegate: Delegate,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.element = dom.append(parent, dom.$('.extensions-grid-view'));
		this.renderer = this.instantiationService.createInstance(Renderer, { onFocus: Event.None, onBlur: Event.None, filters: {} }, { hoverOptions: { position() { return HoverPosition.BELOW; } } });
		this.delegate = delegate;
		this.disposableStore = this._register(new DisposableStore());
	}

	setExtensions(extensions: IExtension[]): void {
		this.disposableStore.clear();
		extensions.forEach((e, index) => this.renderExtension(e, index));
	}

	private renderExtension(extension: IExtension, index: number): void {
		const extensionContainer = dom.append(this.element, dom.$('.extension-container'));
		extensionContainer.style.height = `${this.delegate.getHeight()}px`;
		extensionContainer.setAttribute('tabindex', '0');

		const template = this.renderer.renderTemplate(extensionContainer);
		this.disposableStore.add(toDisposable(() => this.renderer.disposeTemplate(template)));

		const openExtensionAction = this.instantiationService.createInstance(OpenExtensionAction);
		openExtensionAction.extension = extension;
		template.name.setAttribute('tabindex', '0');

		const handleEvent = (e: StandardMouseEvent | StandardKeyboardEvent) => {
			if (e instanceof StandardKeyboardEvent && e.keyCode !== KeyCode.Enter) {
				return;
			}
			openExtensionAction.run(e.ctrlKey || e.metaKey);
			e.stopPropagation();
			e.preventDefault();
		};

		this.disposableStore.add(dom.addDisposableListener(template.name, dom.EventType.CLICK, (e: MouseEvent) => handleEvent(new StandardMouseEvent(dom.getWindow(template.name), e))));
		this.disposableStore.add(dom.addDisposableListener(template.name, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => handleEvent(new StandardKeyboardEvent(e))));
		this.disposableStore.add(dom.addDisposableListener(extensionContainer, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => handleEvent(new StandardKeyboardEvent(e))));

		this.renderer.renderElement(extension, index, template);
	}
}

interface IExtensionTemplateData {
	name: HTMLElement;
	identifier: HTMLElement;
	author: HTMLElement;
	extensionDisposables: IDisposable[];
	extensionData: IExtensionData;
}

interface IUnknownExtensionTemplateData {
	identifier: HTMLElement;
}

interface IExtensionData {
	extension: IExtension;
	hasChildren: boolean;
	getChildren: () => Promise<IExtensionData[] | null>;
	parent: IExtensionData | null;
}

class AsyncDataSource implements IAsyncDataSource<IExtensionData, any> {

	public hasChildren({ hasChildren }: IExtensionData): boolean {
		return hasChildren;
	}

	public getChildren(extensionData: IExtensionData): Promise<any> {
		return extensionData.getChildren();
	}

}

class VirualDelegate implements IListVirtualDelegate<IExtensionData> {

	public getHeight(element: IExtensionData): number {
		return 62;
	}
	public getTemplateId({ extension }: IExtensionData): string {
		return extension ? ExtensionRenderer.TEMPLATE_ID : UnknownExtensionRenderer.TEMPLATE_ID;
	}
}

class ExtensionRenderer implements IListRenderer<ITreeNode<IExtensionData>, IExtensionTemplateData> {

	static readonly TEMPLATE_ID = 'extension-template';

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
	}

	public get templateId(): string {
		return ExtensionRenderer.TEMPLATE_ID;
	}

	public renderTemplate(container: HTMLElement): IExtensionTemplateData {
		container.classList.add('extension');

		const iconWidget = this.instantiationService.createInstance(ExtensionIconWidget, container);
		const details = dom.append(container, dom.$('.details'));

		const header = dom.append(details, dom.$('.header'));
		const name = dom.append(header, dom.$('span.name'));
		const openExtensionAction = this.instantiationService.createInstance(OpenExtensionAction);
		const extensionDisposables = [dom.addDisposableListener(name, 'click', (e: MouseEvent) => {
			openExtensionAction.run(e.ctrlKey || e.metaKey);
			e.stopPropagation();
			e.preventDefault();
		}), iconWidget, openExtensionAction];
		const identifier = dom.append(header, dom.$('span.identifier'));

		const footer = dom.append(details, dom.$('.footer'));
		const author = dom.append(footer, dom.$('.author'));
		return {
			name,
			identifier,
			author,
			extensionDisposables,
			set extensionData(extensionData: IExtensionData) {
				iconWidget.extension = extensionData.extension;
				openExtensionAction.extension = extensionData.extension;
			}
		};
	}

	public renderElement(node: ITreeNode<IExtensionData>, index: number, data: IExtensionTemplateData): void {
		const extension = node.element.extension;
		data.name.textContent = extension.displayName;
		data.identifier.textContent = extension.identifier.id;
		data.author.textContent = extension.publisherDisplayName;
		data.extensionData = node.element;
	}

	public disposeTemplate(templateData: IExtensionTemplateData): void {
		templateData.extensionDisposables = dispose((<IExtensionTemplateData>templateData).extensionDisposables);
	}
}

class UnknownExtensionRenderer implements IListRenderer<ITreeNode<IExtensionData>, IUnknownExtensionTemplateData> {

	static readonly TEMPLATE_ID = 'unknown-extension-template';

	public get templateId(): string {
		return UnknownExtensionRenderer.TEMPLATE_ID;
	}

	public renderTemplate(container: HTMLElement): IUnknownExtensionTemplateData {
		const messageContainer = dom.append(container, dom.$('div.unknown-extension'));
		dom.append(messageContainer, dom.$('span.error-marker')).textContent = localize('error', "Error");
		dom.append(messageContainer, dom.$('span.message')).textContent = localize('Unknown Extension', "Unknown Extension:");

		const identifier = dom.append(messageContainer, dom.$('span.message'));
		return { identifier };
	}

	public renderElement(node: ITreeNode<IExtensionData>, index: number, data: IUnknownExtensionTemplateData): void {
		data.identifier.textContent = node.element.extension.identifier.id;
	}

	public disposeTemplate(data: IUnknownExtensionTemplateData): void {
	}
}

class OpenExtensionAction extends Action {

	private _extension: IExtension | undefined;

	constructor(@IExtensionsWorkbenchService private readonly extensionsWorkdbenchService: IExtensionsWorkbenchService) {
		super('extensions.action.openExtension', '');
	}

	public set extension(extension: IExtension) {
		this._extension = extension;
	}

	override run(sideByside: boolean): Promise<any> {
		if (this._extension) {
			return this.extensionsWorkdbenchService.open(this._extension, { sideByside });
		}
		return Promise.resolve();
	}
}

export class ExtensionsTree extends WorkbenchAsyncDataTree<IExtensionData, IExtensionData> {

	constructor(
		input: IExtensionData,
		container: HTMLElement,
		overrideStyles: IStyleOverride<IListStyles>,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionsWorkbenchService extensionsWorkdbenchService: IExtensionsWorkbenchService
	) {
		const delegate = new VirualDelegate();
		const dataSource = new AsyncDataSource();
		const renderers = [instantiationService.createInstance(ExtensionRenderer), instantiationService.createInstance(UnknownExtensionRenderer)];
		const identityProvider = {
			getId({ extension, parent }: IExtensionData): string {
				return parent ? this.getId(parent) + '/' + extension.identifier.id : extension.identifier.id;
			}
		};

		super(
			'ExtensionsTree',
			container,
			delegate,
			renderers,
			dataSource,
			{
				indent: 40,
				identityProvider,
				multipleSelectionSupport: false,
				overrideStyles,
				accessibilityProvider: {
					getAriaLabel(extensionData: IExtensionData): string {
						return getAriaLabelForExtension(extensionData.extension);
					},
					getWidgetAriaLabel(): string {
						return localize('extensions', "Extensions");
					}
				}
			},
			instantiationService, contextKeyService, listService, configurationService
		);

		this.setInput(input);

		this.disposables.add(this.onDidChangeSelection(event => {
			if (dom.isKeyboardEvent(event.browserEvent)) {
				extensionsWorkdbenchService.open(event.elements[0].extension, { sideByside: false });
			}
		}));
	}
}

export class ExtensionData implements IExtensionData {

	readonly extension: IExtension;
	readonly parent: IExtensionData | null;
	private readonly getChildrenExtensionIds: (extension: IExtension) => string[];
	private readonly childrenExtensionIds: string[];
	private readonly extensionsWorkbenchService: IExtensionsWorkbenchService;

	constructor(extension: IExtension, parent: IExtensionData | null, getChildrenExtensionIds: (extension: IExtension) => string[], extensionsWorkbenchService: IExtensionsWorkbenchService) {
		this.extension = extension;
		this.parent = parent;
		this.getChildrenExtensionIds = getChildrenExtensionIds;
		this.extensionsWorkbenchService = extensionsWorkbenchService;
		this.childrenExtensionIds = this.getChildrenExtensionIds(extension);
	}

	get hasChildren(): boolean {
		return isNonEmptyArray(this.childrenExtensionIds);
	}

	async getChildren(): Promise<IExtensionData[] | null> {
		if (this.hasChildren) {
			const result: IExtension[] = await getExtensions(this.childrenExtensionIds, this.extensionsWorkbenchService);
			return result.map(extension => new ExtensionData(extension, this, this.getChildrenExtensionIds, this.extensionsWorkbenchService));
		}
		return null;
	}
}

export async function getExtensions(extensions: string[], extensionsWorkbenchService: IExtensionsWorkbenchService): Promise<IExtension[]> {
	const localById = extensionsWorkbenchService.local.reduce((result, e) => { result.set(e.identifier.id.toLowerCase(), e); return result; }, new Map<string, IExtension>());
	const result: IExtension[] = [];
	const toQuery: string[] = [];
	for (const extensionId of extensions) {
		const id = extensionId.toLowerCase();
		const local = localById.get(id);
		if (local) {
			result.push(local);
		} else {
			toQuery.push(id);
		}
	}
	if (toQuery.length) {
		const galleryResult = await extensionsWorkbenchService.getExtensions(toQuery.map(id => ({ id })), CancellationToken.None);
		result.push(...galleryResult);
	}
	return result;
}

registerThemingParticipant((theme: IColorTheme, collector: ICssStyleCollector) => {
	const focusBackground = theme.getColor(listFocusBackground);
	if (focusBackground) {
		collector.addRule(`.extensions-grid-view .extension-container:focus { background-color: ${focusBackground}; outline: none; }`);
	}
	const focusForeground = theme.getColor(listFocusForeground);
	if (focusForeground) {
		collector.addRule(`.extensions-grid-view .extension-container:focus { color: ${focusForeground}; }`);
	}
	const foregroundColor = theme.getColor(foreground);
	const editorBackgroundColor = theme.getColor(editorBackground);
	if (foregroundColor && editorBackgroundColor) {
		const authorForeground = foregroundColor.transparent(.9).makeOpaque(editorBackgroundColor);
		collector.addRule(`.extensions-grid-view .extension-container:not(.disabled) .author { color: ${authorForeground}; }`);
		const disabledExtensionForeground = foregroundColor.transparent(.5).makeOpaque(editorBackgroundColor);
		collector.addRule(`.extensions-grid-view .extension-container.disabled { color: ${disabledExtensionForeground}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionsViewlet.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionsViewlet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/extensionsViewlet.css';
import { localize, localize2 } from '../../../../nls.js';
import { timeout, Delayer } from '../../../../base/common/async.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { createErrorWithActions } from '../../../../base/common/errorMessage.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { Action } from '../../../../base/common/actions.js';
import { append, $, Dimension, hide, show, DragAndDropObserver, trackFocus, addDisposableListener, EventType, clearNode } from '../../../../base/browser/dom.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IExtensionsWorkbenchService, IExtensionsViewPaneContainer, VIEWLET_ID, CloseExtensionDetailsOnViewChangeKey, INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID, WORKSPACE_RECOMMENDATIONS_VIEW_ID, AutoCheckUpdatesConfigurationKey, OUTDATED_EXTENSIONS_VIEW_ID, CONTEXT_HAS_GALLERY, extensionsSearchActionsMenu, AutoRestartConfigurationKey, ExtensionRuntimeActionType, SearchMcpServersContext, DefaultViewsContext, CONTEXT_EXTENSIONS_GALLERY_STATUS } from '../common/extensions.js';
import { InstallLocalExtensionsInRemoteAction, InstallRemoteExtensionsInLocalAction } from './extensionsActions.js';
import { IExtensionManagementService, ILocalExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IWorkbenchExtensionEnablementService, IExtensionManagementServerService, IExtensionManagementServer } from '../../../services/extensionManagement/common/extensionManagement.js';
import { ExtensionsInput } from '../common/extensionsInput.js';
import { ExtensionsListView, EnabledExtensionsView, DisabledExtensionsView, RecommendedExtensionsView, WorkspaceRecommendedExtensionsView, ServerInstalledExtensionsView, DefaultRecommendedExtensionsView, UntrustedWorkspaceUnsupportedExtensionsView, UntrustedWorkspacePartiallySupportedExtensionsView, VirtualWorkspaceUnsupportedExtensionsView, VirtualWorkspacePartiallySupportedExtensionsView, DefaultPopularExtensionsView, DeprecatedExtensionsView, SearchMarketplaceExtensionsView, RecentlyUpdatedExtensionsView, OutdatedExtensionsView, StaticQueryExtensionsView, NONE_CATEGORY, AbstractExtensionsListView } from './extensionsViews.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import Severity from '../../../../base/common/severity.js';
import { IActivityService, IBadge, NumberBadge, WarningBadge } from '../../../services/activity/common/activity.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IViewsRegistry, IViewDescriptor, Extensions, ViewContainer, IViewDescriptorService, IAddedViewDescriptorRef, ViewContainerLocation } from '../../../common/views.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IContextKeyService, ContextKeyExpr, RawContextKey, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService, IPromptChoice, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { Query } from '../common/extensionQuery.js';
import { SuggestEnabledInput } from '../../codeEditor/browser/suggestEnabledInput/suggestEnabledInput.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { EXTENSION_CATEGORIES } from '../../../../platform/extensions/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { SIDE_BAR_DRAG_AND_DROP_BACKGROUND } from '../../../common/theme.js';
import { VirtualWorkspaceContext, WorkbenchStateContext } from '../../../common/contextkeys.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { installLocalInRemoteIcon } from './extensionsIcons.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { IPaneComposite } from '../../../common/panecomposite.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { extractEditorsAndFilesDropData } from '../../../../platform/dnd/browser/dnd.js';
import { extname } from '../../../../base/common/resources.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IExtensionGalleryManifest, IExtensionGalleryManifestService, ExtensionGalleryManifestStatus } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { URI } from '../../../../base/common/uri.js';
import { DEFAULT_ACCOUNT_SIGN_IN_COMMAND } from '../../../services/accounts/common/defaultAccount.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export const ExtensionsSortByContext = new RawContextKey<string>('extensionsSortByValue', '');
export const SearchMarketplaceExtensionsContext = new RawContextKey<boolean>('searchMarketplaceExtensions', false);
export const SearchHasTextContext = new RawContextKey<boolean>('extensionSearchHasText', false);
const InstalledExtensionsContext = new RawContextKey<boolean>('installedExtensions', false);
const SearchInstalledExtensionsContext = new RawContextKey<boolean>('searchInstalledExtensions', false);
const SearchRecentlyUpdatedExtensionsContext = new RawContextKey<boolean>('searchRecentlyUpdatedExtensions', false);
const SearchExtensionUpdatesContext = new RawContextKey<boolean>('searchExtensionUpdates', false);
const SearchOutdatedExtensionsContext = new RawContextKey<boolean>('searchOutdatedExtensions', false);
const SearchEnabledExtensionsContext = new RawContextKey<boolean>('searchEnabledExtensions', false);
const SearchDisabledExtensionsContext = new RawContextKey<boolean>('searchDisabledExtensions', false);
const HasInstalledExtensionsContext = new RawContextKey<boolean>('hasInstalledExtensions', true);
export const BuiltInExtensionsContext = new RawContextKey<boolean>('builtInExtensions', false);
const SearchBuiltInExtensionsContext = new RawContextKey<boolean>('searchBuiltInExtensions', false);
const SearchUnsupportedWorkspaceExtensionsContext = new RawContextKey<boolean>('searchUnsupportedWorkspaceExtensions', false);
const SearchDeprecatedExtensionsContext = new RawContextKey<boolean>('searchDeprecatedExtensions', false);
export const RecommendedExtensionsContext = new RawContextKey<boolean>('recommendedExtensions', false);
const SortByUpdateDateContext = new RawContextKey<boolean>('sortByUpdateDate', false);
export const ExtensionsSearchValueContext = new RawContextKey<string>('extensionsSearchValue', '');

const REMOTE_CATEGORY: ILocalizedString = localize2({ key: 'remote', comment: ['Remote as in remote machine'] }, "Remote");

interface IExtensionsViewletState {
	'query.value'?: string;
}

export class ExtensionsViewletViewsContribution extends Disposable implements IWorkbenchContribution {

	private readonly container: ViewContainer;

	constructor(
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@ILabelService private readonly labelService: ILabelService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();

		this.container = viewDescriptorService.getViewContainerById(VIEWLET_ID)!;
		this.registerViews();
	}

	private registerViews(): void {
		const viewDescriptors: IViewDescriptor[] = [];

		/* Default views */
		viewDescriptors.push(...this.createDefaultExtensionsViewDescriptors());

		/* Search views */
		viewDescriptors.push(...this.createSearchExtensionsViewDescriptors());

		/* Recommendations views */
		viewDescriptors.push(...this.createRecommendedExtensionsViewDescriptors());

		/* Built-in extensions views */
		viewDescriptors.push(...this.createBuiltinExtensionsViewDescriptors());

		/* Trust Required extensions views */
		viewDescriptors.push(...this.createUnsupportedWorkspaceExtensionsViewDescriptors());

		/* Other Local Filtered extensions views */
		viewDescriptors.push(...this.createOtherLocalFilteredExtensionsViewDescriptors());


		viewDescriptors.push({
			id: 'workbench.views.extensions.marketplaceAccess',
			name: localize2('marketPlace', "Marketplace"),
			ctorDescriptor: new SyncDescriptor(class extends ViewPane {
				public override shouldShowWelcome() {
					return true;
				}
			}),
			when: ContextKeyExpr.and(
				ContextKeyExpr.or(
					ContextKeyExpr.has('searchMarketplaceExtensions'), ContextKeyExpr.and(DefaultViewsContext)
				),
				ContextKeyExpr.or(CONTEXT_EXTENSIONS_GALLERY_STATUS.isEqualTo(ExtensionGalleryManifestStatus.RequiresSignIn), CONTEXT_EXTENSIONS_GALLERY_STATUS.isEqualTo(ExtensionGalleryManifestStatus.AccessDenied))
			),
			order: -1,
		});

		const viewRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		viewRegistry.registerViews(viewDescriptors, this.container);

		viewRegistry.registerViewWelcomeContent('workbench.views.extensions.marketplaceAccess', {
			content: localize('sign in', "[Sign in to access Extensions Marketplace]({0})", `command:${DEFAULT_ACCOUNT_SIGN_IN_COMMAND}`),
			when: CONTEXT_EXTENSIONS_GALLERY_STATUS.isEqualTo(ExtensionGalleryManifestStatus.RequiresSignIn)
		});

		viewRegistry.registerViewWelcomeContent('workbench.views.extensions.marketplaceAccess', {
			content: localize('access denied', "Your account does not have access to the Extensions Marketplace. Please contact your administrator."),
			when: CONTEXT_EXTENSIONS_GALLERY_STATUS.isEqualTo(ExtensionGalleryManifestStatus.AccessDenied)
		});
	}

	private createDefaultExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		/*
		 * Default installed extensions views - Shows all user installed extensions.
		 */
		const servers: IExtensionManagementServer[] = [];
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			servers.push(this.extensionManagementServerService.localExtensionManagementServer);
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			servers.push(this.extensionManagementServerService.remoteExtensionManagementServer);
		}
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			servers.push(this.extensionManagementServerService.webExtensionManagementServer);
		}
		const getViewName = (viewTitle: string, server: IExtensionManagementServer): string => {
			return servers.length > 1 ? `${server.label} - ${viewTitle}` : viewTitle;
		};
		let installedWebExtensionsContextChangeEvent = Event.None;
		if (this.extensionManagementServerService.webExtensionManagementServer && this.extensionManagementServerService.remoteExtensionManagementServer) {
			const interestingContextKeys = new Set();
			interestingContextKeys.add('hasInstalledWebExtensions');
			installedWebExtensionsContextChangeEvent = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(interestingContextKeys));
		}
		const serverLabelChangeEvent = Event.any(this.labelService.onDidChangeFormatters, installedWebExtensionsContextChangeEvent);
		for (const server of servers) {
			const getInstalledViewName = (): string => getViewName(localize('installed', "Installed"), server);
			const onDidChangeTitle = Event.map<void, string>(serverLabelChangeEvent, () => getInstalledViewName());
			const id = servers.length > 1 ? `workbench.views.extensions.${server.id}.installed` : `workbench.views.extensions.installed`;
			/* Installed extensions view */
			viewDescriptors.push({
				id,
				get name() {
					return {
						value: getInstalledViewName(),
						original: getViewName('Installed', server)
					};
				},
				weight: 100,
				order: 1,
				when: ContextKeyExpr.and(DefaultViewsContext),
				ctorDescriptor: new SyncDescriptor(ServerInstalledExtensionsView, [{ server, flexibleHeight: true, onDidChangeTitle }]),
				/* Installed extensions views shall not be allowed to hidden when there are more than one server */
				canToggleVisibility: servers.length === 1
			});

			if (server === this.extensionManagementServerService.remoteExtensionManagementServer && this.extensionManagementServerService.localExtensionManagementServer) {
				this._register(registerAction2(class InstallLocalExtensionsInRemoteAction2 extends Action2 {
					constructor() {
						super({
							id: 'workbench.extensions.installLocalExtensions',
							get title() {
								return localize2('select and install local extensions', "Install Local Extensions in '{0}'...", server.label);
							},
							category: REMOTE_CATEGORY,
							icon: installLocalInRemoteIcon,
							f1: true,
							menu: {
								id: MenuId.ViewTitle,
								when: ContextKeyExpr.equals('view', id),
								group: 'navigation',
							}
						});
					}
					run(accessor: ServicesAccessor): Promise<void> {
						return accessor.get(IInstantiationService).createInstance(InstallLocalExtensionsInRemoteAction).run();
					}
				}));
			}
		}

		if (this.extensionManagementServerService.localExtensionManagementServer && this.extensionManagementServerService.remoteExtensionManagementServer) {
			this._register(registerAction2(class InstallRemoteExtensionsInLocalAction2 extends Action2 {
				constructor() {
					super({
						id: 'workbench.extensions.actions.installLocalExtensionsInRemote',
						title: localize2('install remote in local', 'Install Remote Extensions Locally...'),
						category: REMOTE_CATEGORY,
						f1: true
					});
				}
				run(accessor: ServicesAccessor): Promise<void> {
					return accessor.get(IInstantiationService).createInstance(InstallRemoteExtensionsInLocalAction, 'workbench.extensions.actions.installLocalExtensionsInRemote').run();
				}
			}));
		}

		/*
		 * Default popular extensions view
		 * Separate view for popular extensions required as we need to show popular and recommended sections
		 * in the default view when there is no search text, and user has no installed extensions.
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.popular',
			name: localize2('popularExtensions', "Popular"),
			ctorDescriptor: new SyncDescriptor(DefaultPopularExtensionsView, [{ hideBadge: true }]),
			when: ContextKeyExpr.and(DefaultViewsContext, ContextKeyExpr.not('hasInstalledExtensions'), CONTEXT_HAS_GALLERY),
			weight: 60,
			order: 2,
			canToggleVisibility: false
		});

		/*
		 * Default recommended extensions view
		 * When user has installed extensions, this is shown along with the views for enabled & disabled extensions
		 * When user has no installed extensions, this is shown along with the view for popular extensions
		 */
		viewDescriptors.push({
			id: 'extensions.recommendedList',
			name: localize2('recommendedExtensions', "Recommended"),
			ctorDescriptor: new SyncDescriptor(DefaultRecommendedExtensionsView, [{ flexibleHeight: true }]),
			when: ContextKeyExpr.and(DefaultViewsContext, SortByUpdateDateContext.negate(), ContextKeyExpr.not('config.extensions.showRecommendationsOnlyOnDemand'), CONTEXT_HAS_GALLERY),
			weight: 40,
			order: 3,
			canToggleVisibility: true
		});

		/* Installed views shall be default in multi server window  */
		if (servers.length === 1) {
			/*
			 * Default enabled extensions view - Shows all user installed enabled extensions.
			 * Hidden by default
			 */
			viewDescriptors.push({
				id: 'workbench.views.extensions.enabled',
				name: localize2('enabledExtensions', "Enabled"),
				ctorDescriptor: new SyncDescriptor(EnabledExtensionsView, [{}]),
				when: ContextKeyExpr.and(DefaultViewsContext, ContextKeyExpr.has('hasInstalledExtensions')),
				hideByDefault: true,
				weight: 40,
				order: 4,
				canToggleVisibility: true
			});

			/*
			 * Default disabled extensions view - Shows all disabled extensions.
			 * Hidden by default
			 */
			viewDescriptors.push({
				id: 'workbench.views.extensions.disabled',
				name: localize2('disabledExtensions', "Disabled"),
				ctorDescriptor: new SyncDescriptor(DisabledExtensionsView, [{}]),
				when: ContextKeyExpr.and(DefaultViewsContext, ContextKeyExpr.has('hasInstalledExtensions')),
				hideByDefault: true,
				weight: 10,
				order: 5,
				canToggleVisibility: true
			});

		}

		return viewDescriptors;
	}

	private createSearchExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		/*
		 * View used for searching Marketplace
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.marketplace',
			name: localize2('marketPlace', "Marketplace"),
			ctorDescriptor: new SyncDescriptor(SearchMarketplaceExtensionsView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('searchMarketplaceExtensions'), CONTEXT_HAS_GALLERY)
		});

		/*
		 * View used for searching all installed extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchInstalled',
			name: localize2('installed', "Installed"),
			ctorDescriptor: new SyncDescriptor(ExtensionsListView, [{}]),
			when: ContextKeyExpr.or(ContextKeyExpr.has('searchInstalledExtensions'), ContextKeyExpr.has('installedExtensions')),
		});

		/*
		 * View used for searching recently updated extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchRecentlyUpdated',
			name: localize2('recently updated', "Recently Updated"),
			ctorDescriptor: new SyncDescriptor(RecentlyUpdatedExtensionsView, [{}]),
			when: ContextKeyExpr.or(SearchExtensionUpdatesContext, ContextKeyExpr.has('searchRecentlyUpdatedExtensions')),
			order: 2,
		});

		/*
		 * View used for searching enabled extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchEnabled',
			name: localize2('enabled', "Enabled"),
			ctorDescriptor: new SyncDescriptor(ExtensionsListView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('searchEnabledExtensions')),
		});

		/*
		 * View used for searching disabled extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchDisabled',
			name: localize2('disabled', "Disabled"),
			ctorDescriptor: new SyncDescriptor(ExtensionsListView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('searchDisabledExtensions')),
		});

		/*
		 * View used for searching outdated extensions
		 */
		viewDescriptors.push({
			id: OUTDATED_EXTENSIONS_VIEW_ID,
			name: localize2('availableUpdates', "Available Updates"),
			ctorDescriptor: new SyncDescriptor(OutdatedExtensionsView, [{}]),
			when: ContextKeyExpr.or(SearchExtensionUpdatesContext, ContextKeyExpr.has('searchOutdatedExtensions')),
			order: 1,
		});

		/*
		 * View used for searching builtin extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchBuiltin',
			name: localize2('builtin', "Builtin"),
			ctorDescriptor: new SyncDescriptor(ExtensionsListView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('searchBuiltInExtensions')),
		});

		/*
		 * View used for searching workspace unsupported extensions
		 */
		viewDescriptors.push({
			id: 'workbench.views.extensions.searchWorkspaceUnsupported',
			name: localize2('workspaceUnsupported', "Workspace Unsupported"),
			ctorDescriptor: new SyncDescriptor(ExtensionsListView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('searchWorkspaceUnsupportedExtensions')),
		});

		return viewDescriptors;
	}

	private createRecommendedExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		viewDescriptors.push({
			id: WORKSPACE_RECOMMENDATIONS_VIEW_ID,
			name: localize2('workspaceRecommendedExtensions', "Workspace Recommendations"),
			ctorDescriptor: new SyncDescriptor(WorkspaceRecommendedExtensionsView, [{}]),
			when: ContextKeyExpr.and(ContextKeyExpr.has('recommendedExtensions'), WorkbenchStateContext.notEqualsTo('empty')),
			order: 1
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.otherRecommendations',
			name: localize2('otherRecommendedExtensions', "Other Recommendations"),
			ctorDescriptor: new SyncDescriptor(RecommendedExtensionsView, [{}]),
			when: ContextKeyExpr.has('recommendedExtensions'),
			order: 2
		});

		return viewDescriptors;
	}

	private createBuiltinExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		const configuredCategories = ['themes', 'programming languages'];
		const otherCategories = EXTENSION_CATEGORIES.filter(c => !configuredCategories.includes(c.toLowerCase()));
		otherCategories.push(NONE_CATEGORY);
		const otherCategoriesQuery = `${otherCategories.map(c => `category:"${c}"`).join(' ')} ${configuredCategories.map(c => `category:"-${c}"`).join(' ')}`;
		viewDescriptors.push({
			id: 'workbench.views.extensions.builtinFeatureExtensions',
			name: localize2('builtinFeatureExtensions', "Features"),
			ctorDescriptor: new SyncDescriptor(StaticQueryExtensionsView, [{ query: `@builtin ${otherCategoriesQuery}` }]),
			when: ContextKeyExpr.has('builtInExtensions'),
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.builtinThemeExtensions',
			name: localize2('builtInThemesExtensions', "Themes"),
			ctorDescriptor: new SyncDescriptor(StaticQueryExtensionsView, [{ query: `@builtin category:themes` }]),
			when: ContextKeyExpr.has('builtInExtensions'),
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.builtinProgrammingLanguageExtensions',
			name: localize2('builtinProgrammingLanguageExtensions', "Programming Languages"),
			ctorDescriptor: new SyncDescriptor(StaticQueryExtensionsView, [{ query: `@builtin category:"programming languages"` }]),
			when: ContextKeyExpr.has('builtInExtensions'),
		});

		return viewDescriptors;
	}

	private createUnsupportedWorkspaceExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		viewDescriptors.push({
			id: 'workbench.views.extensions.untrustedUnsupportedExtensions',
			name: localize2('untrustedUnsupportedExtensions', "Disabled in Restricted Mode"),
			ctorDescriptor: new SyncDescriptor(UntrustedWorkspaceUnsupportedExtensionsView, [{}]),
			when: ContextKeyExpr.and(SearchUnsupportedWorkspaceExtensionsContext),
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.untrustedPartiallySupportedExtensions',
			name: localize2('untrustedPartiallySupportedExtensions', "Limited in Restricted Mode"),
			ctorDescriptor: new SyncDescriptor(UntrustedWorkspacePartiallySupportedExtensionsView, [{}]),
			when: ContextKeyExpr.and(SearchUnsupportedWorkspaceExtensionsContext),
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.virtualUnsupportedExtensions',
			name: localize2('virtualUnsupportedExtensions', "Disabled in Virtual Workspaces"),
			ctorDescriptor: new SyncDescriptor(VirtualWorkspaceUnsupportedExtensionsView, [{}]),
			when: ContextKeyExpr.and(VirtualWorkspaceContext, SearchUnsupportedWorkspaceExtensionsContext),
		});

		viewDescriptors.push({
			id: 'workbench.views.extensions.virtualPartiallySupportedExtensions',
			name: localize2('virtualPartiallySupportedExtensions', "Limited in Virtual Workspaces"),
			ctorDescriptor: new SyncDescriptor(VirtualWorkspacePartiallySupportedExtensionsView, [{}]),
			when: ContextKeyExpr.and(VirtualWorkspaceContext, SearchUnsupportedWorkspaceExtensionsContext),
		});

		return viewDescriptors;
	}

	private createOtherLocalFilteredExtensionsViewDescriptors(): IViewDescriptor[] {
		const viewDescriptors: IViewDescriptor[] = [];

		viewDescriptors.push({
			id: 'workbench.views.extensions.deprecatedExtensions',
			name: localize2('deprecated', "Deprecated"),
			ctorDescriptor: new SyncDescriptor(DeprecatedExtensionsView, [{}]),
			when: ContextKeyExpr.and(SearchDeprecatedExtensionsContext),
		});

		return viewDescriptors;
	}

}

export class ExtensionsViewPaneContainer extends ViewPaneContainer<IExtensionsViewletState> implements IExtensionsViewPaneContainer {

	private readonly extensionsSearchValueContextKey: IContextKey<string>;
	private readonly defaultViewsContextKey: IContextKey<boolean>;
	private readonly sortByContextKey: IContextKey<string>;
	private readonly searchMarketplaceExtensionsContextKey: IContextKey<boolean>;
	private readonly searchMcpServersContextKey: IContextKey<boolean>;
	private readonly searchHasTextContextKey: IContextKey<boolean>;
	private readonly sortByUpdateDateContextKey: IContextKey<boolean>;
	private readonly installedExtensionsContextKey: IContextKey<boolean>;
	private readonly searchInstalledExtensionsContextKey: IContextKey<boolean>;
	private readonly searchRecentlyUpdatedExtensionsContextKey: IContextKey<boolean>;
	private readonly searchExtensionUpdatesContextKey: IContextKey<boolean>;
	private readonly searchOutdatedExtensionsContextKey: IContextKey<boolean>;
	private readonly searchEnabledExtensionsContextKey: IContextKey<boolean>;
	private readonly searchDisabledExtensionsContextKey: IContextKey<boolean>;
	private readonly hasInstalledExtensionsContextKey: IContextKey<boolean>;
	private readonly builtInExtensionsContextKey: IContextKey<boolean>;
	private readonly searchBuiltInExtensionsContextKey: IContextKey<boolean>;
	private readonly searchWorkspaceUnsupportedExtensionsContextKey: IContextKey<boolean>;
	private readonly searchDeprecatedExtensionsContextKey: IContextKey<boolean>;
	private readonly recommendedExtensionsContextKey: IContextKey<boolean>;

	private searchDelayer: Delayer<void>;
	private root: HTMLElement | undefined;
	private header: HTMLElement | undefined;
	private searchBox: SuggestEnabledInput | undefined;
	private notificationContainer: HTMLElement | undefined;
	private readonly searchViewletState: IExtensionsViewletState;
	private extensionGalleryManifest: IExtensionGalleryManifest | null = null;

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IProgressService private readonly progressService: IProgressService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@INotificationService private readonly notificationService: INotificationService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@ICommandService private readonly commandService: ICommandService,
		@ILogService logService: ILogService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super(VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);

		this.searchDelayer = new Delayer(500);
		this.extensionsSearchValueContextKey = ExtensionsSearchValueContext.bindTo(contextKeyService);
		this.defaultViewsContextKey = DefaultViewsContext.bindTo(contextKeyService);
		this.sortByContextKey = ExtensionsSortByContext.bindTo(contextKeyService);
		this.searchMarketplaceExtensionsContextKey = SearchMarketplaceExtensionsContext.bindTo(contextKeyService);
		this.searchMcpServersContextKey = SearchMcpServersContext.bindTo(contextKeyService);
		this.searchHasTextContextKey = SearchHasTextContext.bindTo(contextKeyService);
		this.sortByUpdateDateContextKey = SortByUpdateDateContext.bindTo(contextKeyService);
		this.installedExtensionsContextKey = InstalledExtensionsContext.bindTo(contextKeyService);
		this.searchInstalledExtensionsContextKey = SearchInstalledExtensionsContext.bindTo(contextKeyService);
		this.searchRecentlyUpdatedExtensionsContextKey = SearchRecentlyUpdatedExtensionsContext.bindTo(contextKeyService);
		this.searchExtensionUpdatesContextKey = SearchExtensionUpdatesContext.bindTo(contextKeyService);
		this.searchWorkspaceUnsupportedExtensionsContextKey = SearchUnsupportedWorkspaceExtensionsContext.bindTo(contextKeyService);
		this.searchDeprecatedExtensionsContextKey = SearchDeprecatedExtensionsContext.bindTo(contextKeyService);
		this.searchOutdatedExtensionsContextKey = SearchOutdatedExtensionsContext.bindTo(contextKeyService);
		this.searchEnabledExtensionsContextKey = SearchEnabledExtensionsContext.bindTo(contextKeyService);
		this.searchDisabledExtensionsContextKey = SearchDisabledExtensionsContext.bindTo(contextKeyService);
		this.hasInstalledExtensionsContextKey = HasInstalledExtensionsContext.bindTo(contextKeyService);
		this.builtInExtensionsContextKey = BuiltInExtensionsContext.bindTo(contextKeyService);
		this.searchBuiltInExtensionsContextKey = SearchBuiltInExtensionsContext.bindTo(contextKeyService);
		this.recommendedExtensionsContextKey = RecommendedExtensionsContext.bindTo(contextKeyService);
		this._register(this.paneCompositeService.onDidPaneCompositeOpen(e => { if (e.viewContainerLocation === ViewContainerLocation.Sidebar) { this.onViewletOpen(e.composite); } }, this));
		this._register(extensionsWorkbenchService.onReset(() => this.refresh()));
		this.searchViewletState = this.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);

		extensionGalleryManifestService.getExtensionGalleryManifest()
			.then(galleryManifest => {
				this.extensionGalleryManifest = galleryManifest;
				this._register(extensionGalleryManifestService.onDidChangeExtensionGalleryManifest(galleryManifest => {
					this.extensionGalleryManifest = galleryManifest;
					this.refresh();
				}));
			});
	}

	get searchValue(): string | undefined {
		return this.searchBox?.getValue();
	}

	override create(parent: HTMLElement): void {
		parent.classList.add('extensions-viewlet');
		this.root = parent;

		const overlay = append(this.root, $('.overlay'));
		const overlayBackgroundColor = this.getColor(SIDE_BAR_DRAG_AND_DROP_BACKGROUND) ?? '';
		overlay.style.backgroundColor = overlayBackgroundColor;
		hide(overlay);

		this.header = append(this.root, $('.header'));
		const placeholder = localize('searchExtensions', "Search Extensions in Marketplace");

		const searchValue = this.searchViewletState['query.value'] ? this.searchViewletState['query.value'] : '';

		const searchContainer = append(this.header, $('.extensions-search-container'));

		this.searchBox = this._register(this.instantiationService.createInstance(SuggestEnabledInput, `${VIEWLET_ID}.searchbox`, searchContainer, {
			triggerCharacters: ['@'],
			sortKey: (item: string) => {
				if (item.indexOf(':') === -1) { return 'a'; }
				else if (/ext:/.test(item) || /id:/.test(item) || /tag:/.test(item)) { return 'b'; }
				else if (/sort:/.test(item)) { return 'c'; }
				else { return 'd'; }
			},
			provideResults: (query: string) => Query.suggestions(query, this.extensionGalleryManifest)
		}, placeholder, 'extensions:searchinput', { placeholderText: placeholder, value: searchValue }));

		this.notificationContainer = append(this.header, $('.notification-container.hidden', { 'tabindex': '0' }));
		this.renderNotificaiton();
		this._register(this.extensionsWorkbenchService.onDidChangeExtensionsNotification(() => this.renderNotificaiton()));

		this.updateInstalledExtensionsContexts();
		if (this.searchBox.getValue()) {
			this.triggerSearch();
		}

		this._register(this.searchBox.onInputDidChange(() => {
			this.sortByContextKey.set(Query.parse(this.searchBox?.getValue() ?? '').sortBy);
			this.triggerSearch();
		}, this));

		this._register(this.searchBox.onShouldFocusResults(() => this.focusListView(), this));

		const controlElement = append(searchContainer, $('.extensions-search-actions-container'));
		this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar, controlElement, extensionsSearchActionsMenu, {
			toolbarOptions: {
				primaryGroup: () => true,
			},
			actionViewItemProvider: (action, options) => createActionViewItem(this.instantiationService, action, options)
		}));

		// Register DragAndDrop support
		this._register(new DragAndDropObserver(this.root, {
			onDragEnter: (e: DragEvent) => {
				if (this.isSupportedDragElement(e)) {
					show(overlay);
				}
			},
			onDragLeave: (e: DragEvent) => {
				if (this.isSupportedDragElement(e)) {
					hide(overlay);
				}
			},
			onDragOver: (e: DragEvent) => {
				if (this.isSupportedDragElement(e)) {
					e.dataTransfer!.dropEffect = 'copy';
				}
			},
			onDrop: async (e: DragEvent) => {
				if (this.isSupportedDragElement(e)) {
					hide(overlay);

					const vsixs = coalesce((await this.instantiationService.invokeFunction(accessor => extractEditorsAndFilesDropData(accessor, e)))
						.map(editor => editor.resource && extname(editor.resource) === '.vsix' ? editor.resource : undefined));

					if (vsixs.length > 0) {
						try {
							// Attempt to install the extension(s)
							await this.commandService.executeCommand(INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID, vsixs);
						}
						catch (err) {
							this.notificationService.error(err);
						}
					}
				}
			}
		}));

		super.create(append(this.root, $('.extensions')));

		const focusTracker = this._register(trackFocus(this.root));
		const isSearchBoxFocused = () => this.searchBox?.inputWidget.hasWidgetFocus();
		this._register(registerNavigableContainer({
			name: 'extensionsView',
			focusNotifiers: [focusTracker],
			focusNextWidget: () => {
				if (isSearchBoxFocused()) {
					this.focusListView();
				}
			},
			focusPreviousWidget: () => {
				if (!isSearchBoxFocused()) {
					this.searchBox?.focus();
				}
			}
		}));
	}

	override focus(): void {
		super.focus();
		this.searchBox?.focus();
	}

	private _dimension: Dimension | undefined;
	override layout(dimension: Dimension): void {
		this._dimension = dimension;
		if (this.root) {
			this.root.classList.toggle('narrow', dimension.width <= 250);
			this.root.classList.toggle('mini', dimension.width <= 200);
		}
		this.searchBox?.layout(new Dimension(dimension.width - 34 - /*padding*/8 - (24 * 2), 20));
		const searchBoxHeight = 20 + 21 /*margin*/;
		const headerHeight = this.header && !!this.notificationContainer?.childNodes.length ? this.notificationContainer.clientHeight + searchBoxHeight + 10 /*margin*/ : searchBoxHeight;
		this.header!.style.height = `${headerHeight}px`;
		super.layout(new Dimension(dimension.width, dimension.height - headerHeight));
	}

	override getOptimalWidth(): number {
		return 400;
	}

	search(value: string): void {
		if (this.searchBox && this.searchBox.getValue() !== value) {
			this.searchBox.setValue(value);
		}
	}

	async refresh(): Promise<void> {
		await this.updateInstalledExtensionsContexts();
		this.doSearch(true);
		if (this.configurationService.getValue(AutoCheckUpdatesConfigurationKey)) {
			this.extensionsWorkbenchService.checkForUpdates();
		}
	}

	private readonly notificationDisposables = this._register(new MutableDisposable<DisposableStore>());
	private renderNotificaiton(): void {
		if (!this.notificationContainer) {
			return;
		}

		clearNode(this.notificationContainer);
		this.notificationDisposables.value = new DisposableStore();
		const status = this.extensionsWorkbenchService.getExtensionsNotification();
		const query = status?.extensions.map(extension => `@id:${extension.identifier.id}`).join(' ');
		if (status && (query === this.searchBox?.getValue() || !this.searchMarketplaceExtensionsContextKey.get())) {
			this.notificationContainer.setAttribute('aria-label', status.message);
			this.notificationContainer.classList.remove('hidden');
			const messageContainer = append(this.notificationContainer, $('.message-container'));
			append(messageContainer, $('span')).className = SeverityIcon.className(status.severity);
			append(messageContainer, $('span.message', undefined, status.message));
			const showAction = append(messageContainer,
				$('span.message-text-action', {
					'tabindex': '0',
					'role': 'button',
					'aria-label': `${status.message}. ${localize('click show', "Click to Show")}`
				}, localize('show', "Show")));
			this.notificationDisposables.value.add(addDisposableListener(showAction, EventType.CLICK, () => this.search(query ?? '')));
			this.notificationDisposables.value.add(addDisposableListener(showAction, EventType.KEY_DOWN, (e: KeyboardEvent) => {
				const standardKeyboardEvent = new StandardKeyboardEvent(e);
				if (standardKeyboardEvent.keyCode === KeyCode.Enter || standardKeyboardEvent.keyCode === KeyCode.Space) {
					this.search(query ?? '');
				}
				standardKeyboardEvent.stopPropagation();
			}));
			const dismissAction = append(this.notificationContainer,
				$(`span.message-action${ThemeIcon.asCSSSelector(Codicon.close)}`, {
					'tabindex': '0',
					'role': 'button',
					'aria-label': localize('dismiss', "Dismiss"),
				}));
			this.notificationDisposables.value.add(this.hoverService.setupDelayedHover(dismissAction, { content: localize('dismiss hover', "Dismiss") }));
			this.notificationDisposables.value.add(addDisposableListener(dismissAction, EventType.CLICK, () => status.dismiss()));
			this.notificationDisposables.value.add(addDisposableListener(dismissAction, EventType.KEY_DOWN, (e: KeyboardEvent) => {
				const standardKeyboardEvent = new StandardKeyboardEvent(e);
				if (standardKeyboardEvent.keyCode === KeyCode.Enter || standardKeyboardEvent.keyCode === KeyCode.Space) {
					status.dismiss();
				}
				standardKeyboardEvent.stopPropagation();
			}));
		} else {
			this.notificationContainer.removeAttribute('aria-label');
			this.notificationContainer.classList.add('hidden');
		}

		if (this._dimension) {
			this.layout(this._dimension);
		}
	}

	private async updateInstalledExtensionsContexts(): Promise<void> {
		const result = await this.extensionsWorkbenchService.queryLocal();
		this.hasInstalledExtensionsContextKey.set(result.some(r => !r.isBuiltin));
	}

	private triggerSearch(): void {
		this.searchDelayer.trigger(() => this.doSearch(), this.searchBox && this.searchBox.getValue() ? 500 : 0).then(undefined, err => this.onError(err));
	}

	private normalizedQuery(): string {
		return this.searchBox
			? this.searchBox.getValue()
				.trim()
				.replace(/@category/g, 'category')
				.replace(/@tag:/g, 'tag:')
				.replace(/@ext:/g, 'ext:')
				.replace(/@featured/g, 'featured')
				.replace(/@popular/g, this.extensionManagementServerService.webExtensionManagementServer && !this.extensionManagementServerService.localExtensionManagementServer && !this.extensionManagementServerService.remoteExtensionManagementServer ? '@web' : '@popular')
			: '';
	}

	protected override saveState(): void {
		const value = this.searchBox ? this.searchBox.getValue() : '';
		if (ExtensionsListView.isLocalExtensionsQuery(value)) {
			this.searchViewletState['query.value'] = value;
		} else {
			this.searchViewletState['query.value'] = '';
		}
		super.saveState();
	}

	private doSearch(refresh?: boolean): Promise<void> {
		const value = this.normalizedQuery();
		this.contextKeyService.bufferChangeEvents(() => {
			const isRecommendedExtensionsQuery = ExtensionsListView.isRecommendedExtensionsQuery(value);
			this.searchHasTextContextKey.set(value.trim() !== '');
			this.extensionsSearchValueContextKey.set(value);
			this.installedExtensionsContextKey.set(ExtensionsListView.isInstalledExtensionsQuery(value));
			this.searchInstalledExtensionsContextKey.set(ExtensionsListView.isSearchInstalledExtensionsQuery(value));
			this.searchRecentlyUpdatedExtensionsContextKey.set(ExtensionsListView.isSearchRecentlyUpdatedQuery(value) && !ExtensionsListView.isSearchExtensionUpdatesQuery(value));
			this.searchOutdatedExtensionsContextKey.set(ExtensionsListView.isOutdatedExtensionsQuery(value) && !ExtensionsListView.isSearchExtensionUpdatesQuery(value));
			this.searchExtensionUpdatesContextKey.set(ExtensionsListView.isSearchExtensionUpdatesQuery(value));
			this.searchEnabledExtensionsContextKey.set(ExtensionsListView.isEnabledExtensionsQuery(value));
			this.searchDisabledExtensionsContextKey.set(ExtensionsListView.isDisabledExtensionsQuery(value));
			this.searchBuiltInExtensionsContextKey.set(ExtensionsListView.isSearchBuiltInExtensionsQuery(value));
			this.searchWorkspaceUnsupportedExtensionsContextKey.set(ExtensionsListView.isSearchWorkspaceUnsupportedExtensionsQuery(value));
			this.searchDeprecatedExtensionsContextKey.set(ExtensionsListView.isSearchDeprecatedExtensionsQuery(value));
			this.builtInExtensionsContextKey.set(ExtensionsListView.isBuiltInExtensionsQuery(value));
			this.recommendedExtensionsContextKey.set(isRecommendedExtensionsQuery);
			this.searchMcpServersContextKey.set(!!value && /@mcp\s?.*/i.test(value));
			this.searchMarketplaceExtensionsContextKey.set(!!value && !ExtensionsListView.isLocalExtensionsQuery(value) && !isRecommendedExtensionsQuery && !this.searchMcpServersContextKey.get());
			this.sortByUpdateDateContextKey.set(ExtensionsListView.isSortUpdateDateQuery(value));
			this.defaultViewsContextKey.set(!value || ExtensionsListView.isSortInstalledExtensionsQuery(value));
		});

		this.renderNotificaiton();

		return this.showExtensionsViews(this.panes);
	}

	protected override onDidAddViewDescriptors(added: IAddedViewDescriptorRef[]): ViewPane[] {
		const addedViews = super.onDidAddViewDescriptors(added);
		this.showExtensionsViews(addedViews);
		return addedViews;
	}

	private async showExtensionsViews(views: ViewPane[]): Promise<void> {
		await this.progress(Promise.all(views.map(async view => {
			if (view instanceof AbstractExtensionsListView) {
				const model = await view.show(this.normalizedQuery());
				this.alertSearchResult(model.length, view.id);
			}
		})));
	}

	private alertSearchResult(count: number, viewId: string): void {
		const view = this.viewContainerModel.visibleViewDescriptors.find(view => view.id === viewId);
		switch (count) {
			case 0:
				break;
			case 1:
				if (view) {
					alert(localize('extensionFoundInSection', "1 extension found in the {0} section.", view.name.value));
				} else {
					alert(localize('extensionFound', "1 extension found."));
				}
				break;
			default:
				if (view) {
					alert(localize('extensionsFoundInSection', "{0} extensions found in the {1} section.", count, view.name.value));
				} else {
					alert(localize('extensionsFound', "{0} extensions found.", count));
				}
				break;
		}
	}

	private getFirstExpandedPane(): ExtensionsListView | undefined {
		for (const pane of this.panes) {
			if (pane.isExpanded() && pane instanceof ExtensionsListView) {
				return pane;
			}
		}
		return undefined;
	}

	private focusListView(): void {
		const pane = this.getFirstExpandedPane();
		if (pane && pane.count() > 0) {
			pane.focus();
		}
	}

	private onViewletOpen(viewlet: IPaneComposite): void {
		if (!viewlet || viewlet.getId() === VIEWLET_ID) {
			return;
		}

		if (this.configurationService.getValue<boolean>(CloseExtensionDetailsOnViewChangeKey)) {
			const promises = this.editorGroupService.groups.map(group => {
				const editors = group.editors.filter(input => input instanceof ExtensionsInput);

				return group.closeEditors(editors);
			});

			Promise.all(promises);
		}
	}

	private progress<T>(promise: Promise<T>): Promise<T> {
		return this.progressService.withProgress({ location: ProgressLocation.Extensions }, () => promise);
	}

	private onError(err: Error): void {
		if (isCancellationError(err)) {
			return;
		}

		const message = err && err.message || '';

		if (/ECONNREFUSED/.test(message)) {
			const error = createErrorWithActions(localize('suggestProxyError', "Marketplace returned 'ECONNREFUSED'. Please check the 'http.proxy' setting."), [
				new Action('open user settings', localize('open user settings', "Open User Settings"), undefined, true, () => this.preferencesService.openUserSettings())
			]);

			this.notificationService.error(error);
			return;
		}

		this.notificationService.error(err);
	}

	private isSupportedDragElement(e: DragEvent): boolean {
		if (e.dataTransfer) {
			const typesLowerCase = e.dataTransfer.types.map(t => t.toLocaleLowerCase());
			return typesLowerCase.indexOf('files') !== -1;
		}

		return false;
	}
}

export class StatusUpdater extends Disposable implements IWorkbenchContribution {

	private readonly badgeHandle = this._register(new MutableDisposable());

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
		this.onServiceChange();
		this._register(Event.any(Event.debounce(extensionsWorkbenchService.onChange, () => undefined, 100, undefined, undefined, undefined, this._store), extensionsWorkbenchService.onDidChangeExtensionsNotification)(this.onServiceChange, this));
	}

	private onServiceChange(): void {
		this.badgeHandle.clear();
		let badge: IBadge | undefined;

		const extensionsNotification = this.extensionsWorkbenchService.getExtensionsNotification();
		if (extensionsNotification) {
			if (extensionsNotification.severity === Severity.Warning) {
				badge = new WarningBadge(() => extensionsNotification.message);
			}
		}

		else {
			const actionRequired = this.configurationService.getValue(AutoRestartConfigurationKey) === true ? [] : this.extensionsWorkbenchService.installed.filter(e => e.runtimeState !== undefined);
			const outdated = this.extensionsWorkbenchService.outdated.reduce((r, e) => r + (this.extensionEnablementService.isEnabled(e.local!) && !actionRequired.includes(e) ? 1 : 0), 0);
			const newBadgeNumber = outdated + actionRequired.length;
			if (newBadgeNumber > 0) {
				let msg = '';
				if (outdated) {
					msg += outdated === 1 ? localize('extensionToUpdate', '{0} requires update', outdated) : localize('extensionsToUpdate', '{0} require update', outdated);
				}
				if (outdated > 0 && actionRequired.length > 0) {
					msg += ', ';
				}
				if (actionRequired.length) {
					msg += actionRequired.length === 1 ? localize('extensionToReload', '{0} requires restart', actionRequired.length) : localize('extensionsToReload', '{0} require restart', actionRequired.length);
				}
				badge = new NumberBadge(newBadgeNumber, () => msg);
			}
		}

		if (badge) {
			this.badgeHandle.value = this.activityService.showViewContainerActivity(VIEWLET_ID, { badge });
		}
	}
}

export class MaliciousExtensionChecker implements IWorkbenchContribution {

	constructor(
		@IExtensionManagementService private readonly extensionsManagementService: IExtensionManagementService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IHostService private readonly hostService: IHostService,
		@ILogService private readonly logService: ILogService,
		@INotificationService private readonly notificationService: INotificationService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		this.loopCheckForMaliciousExtensions();
	}

	private loopCheckForMaliciousExtensions(): void {
		this.checkForMaliciousExtensions()
			.then(() => timeout(1000 * 60 * 5)) // every five minutes
			.then(() => this.loopCheckForMaliciousExtensions());
	}

	private async checkForMaliciousExtensions(): Promise<void> {
		try {
			const maliciousExtensions: [ILocalExtension, string | undefined][] = [];
			let shouldRestartExtensions = false;
			let shouldReloadWindow = false;
			for (const extension of this.extensionsWorkbenchService.installed) {
				if (extension.isMalicious && extension.local) {
					maliciousExtensions.push([extension.local, extension.maliciousInfoLink]);
					shouldRestartExtensions = shouldRestartExtensions || extension.runtimeState?.action === ExtensionRuntimeActionType.RestartExtensions;
					shouldReloadWindow = shouldReloadWindow || extension.runtimeState?.action === ExtensionRuntimeActionType.ReloadWindow;
				}
			}
			if (maliciousExtensions.length) {
				await this.extensionsManagementService.uninstallExtensions(maliciousExtensions.map(e => ({ extension: e[0], options: { remove: true } })));
				for (const [extension, link] of maliciousExtensions) {
					const buttons: IPromptChoice[] = [];
					if (shouldRestartExtensions || shouldReloadWindow) {
						buttons.push({
							label: shouldRestartExtensions ? localize('restartNow', "Restart Extensions") : localize('reloadNow', "Reload Now"),
							run: () => shouldRestartExtensions ? this.extensionsWorkbenchService.updateRunningExtensions() : this.hostService.reload()
						});
					}
					if (link) {
						buttons.push({
							label: localize('learnMore', "Learn More"),
							run: () => this.commandService.executeCommand('vscode.open', URI.parse(link))
						});
					}
					this.notificationService.prompt(
						Severity.Warning,
						localize('malicious warning', "The extension '{0}' was found to be problematic and has been uninstalled", extension.manifest.displayName || extension.identifier.id),
						buttons,
						{
							sticky: true,
							priority: NotificationPriority.URGENT
						}
					);
				}
			}

		} catch (err) {
			this.logService.error(err);
		}
	}
}

export class ExtensionMarketplaceStatusUpdater extends Disposable implements IWorkbenchContribution {

	private readonly badgeHandle = this._register(new MutableDisposable());
	private readonly accountBadgeDisposable = this._register(new MutableDisposable());

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IExtensionGalleryManifestService private readonly extensionGalleryManifestService: IExtensionGalleryManifestService
	) {
		super();
		this.updateBadge();
		this._register(this.extensionGalleryManifestService.onDidChangeExtensionGalleryManifestStatus(() => this.updateBadge()));
	}

	private async updateBadge(): Promise<void> {
		this.badgeHandle.clear();

		const status = this.extensionGalleryManifestService.extensionGalleryManifestStatus;
		let badge: IBadge | undefined;

		switch (status) {
			case ExtensionGalleryManifestStatus.RequiresSignIn:
				badge = new NumberBadge(1, () => localize('signInRequired', "Sign in required to access marketplace"));
				break;
			case ExtensionGalleryManifestStatus.AccessDenied:
				badge = new WarningBadge(() => localize('accessDenied', "Access denied to marketplace"));
				break;
		}

		if (badge) {
			this.badgeHandle.value = this.activityService.showViewContainerActivity(VIEWLET_ID, { badge });
		}

		this.accountBadgeDisposable.clear();
		if (status === ExtensionGalleryManifestStatus.RequiresSignIn) {
			const badge = new NumberBadge(1, () => localize('sign in enterprise marketplace', "Sign in to access Marketplace"));
			this.accountBadgeDisposable.value = this.activityService.showAccountsActivity({ badge });
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionsViews.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionsViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { isCancellationError, getErrorMessage, CancellationError } from '../../../../base/common/errors.js';
import { PagedModel, IPagedModel, DelayedPagedModel, IPager } from '../../../../base/common/paging.js';
import { SortOrder, IQueryOptions as IGalleryQueryOptions, SortBy as GallerySortBy, InstallExtensionInfo, ExtensionGalleryErrorCode, ExtensionGalleryError } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IExtensionManagementServer, IExtensionManagementServerService, EnablementState, IWorkbenchExtensionManagementService, IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { areSameExtensions, getExtensionDependencies } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { append, $ } from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ExtensionResultsListFocused, ExtensionState, IExtension, IExtensionsViewState, IExtensionsWorkbenchService, IWorkspaceRecommendedExtensionsView } from '../common/extensions.js';
import { Query } from '../common/extensionQuery.js';
import { IExtensionService, toExtension } from '../../../services/extensions/common/extensions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { WorkbenchPagedList } from '../../../../platform/list/browser/listService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { ViewPane, IViewPaneOptions, ViewPaneShowActions } from '../../../browser/parts/views/viewPane.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { coalesce, distinct, range } from '../../../../base/common/arrays.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ActionRunner } from '../../../../base/common/actions.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, ExtensionUntrustedWorkspaceSupportType, ExtensionVirtualWorkspaceSupportType, IExtensionDescription, IExtensionIdentifier, isLanguagePackExtension } from '../../../../platform/extensions/common/extensions.js';
import { CancelablePromise, createCancelablePromise, ThrottledDelayer } from '../../../../base/common/async.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionManifestPropertiesService } from '../../../services/extensions/common/extensionManifestPropertiesService.js';
import { isVirtualWorkspace } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { isOfflineError } from '../../../../base/parts/request/common/request.js';
import { defaultCountBadgeStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IExtensionFeatureRenderer, IExtensionFeaturesManagementService, IExtensionFeaturesRegistry } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { URI } from '../../../../base/common/uri.js';
import { isString } from '../../../../base/common/types.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { ExtensionsList } from './extensionsViewer.js';

export const NONE_CATEGORY = 'none';

type Message = {
	readonly text: string;
	readonly severity: Severity;
};

class ExtensionsViewState extends Disposable implements IExtensionsViewState {

	private readonly _onFocus: Emitter<IExtension> = this._register(new Emitter<IExtension>());
	readonly onFocus: Event<IExtension> = this._onFocus.event;

	private readonly _onBlur: Emitter<IExtension> = this._register(new Emitter<IExtension>());
	readonly onBlur: Event<IExtension> = this._onBlur.event;

	private currentlyFocusedItems: IExtension[] = [];

	filters: {
		featureId?: string;
	} = {};

	onFocusChange(extensions: IExtension[]): void {
		this.currentlyFocusedItems.forEach(extension => this._onBlur.fire(extension));
		this.currentlyFocusedItems = extensions;
		this.currentlyFocusedItems.forEach(extension => this._onFocus.fire(extension));
	}
}

export interface ExtensionsListViewOptions {
	server?: IExtensionManagementServer;
	flexibleHeight?: boolean;
	readonly onDidChangeTitle?: Event<string>;
	hideBadge?: boolean;
}

interface IQueryResult {
	model: IPagedModel<IExtension>;
	message?: { text: string; severity: Severity };
	readonly onDidChangeModel?: Event<IPagedModel<IExtension>>;
	readonly disposables: DisposableStore;
}

const enum LocalSortBy {
	UpdateDate = 'UpdateDate',
}

function isLocalSortBy(value: any): value is LocalSortBy {
	switch (value as LocalSortBy) {
		case LocalSortBy.UpdateDate: return true;
	}
}

type SortBy = LocalSortBy | GallerySortBy;
type IQueryOptions = Omit<IGalleryQueryOptions, 'sortBy'> & { sortBy?: SortBy };

export abstract class AbstractExtensionsListView<T> extends ViewPane {
	abstract show(query: string, refresh?: boolean): Promise<IPagedModel<T>>;
}

export class ExtensionsListView extends AbstractExtensionsListView<IExtension> {

	private static RECENT_UPDATE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

	private bodyTemplate: {
		messageContainer: HTMLElement;
		messageSeverityIcon: HTMLElement;
		messageBox: HTMLElement;
		extensionsList: HTMLElement;
	} | undefined;
	private badge: CountBadge | undefined;
	private list: WorkbenchPagedList<IExtension> | null = null;
	private queryRequest: { query: string; request: CancelablePromise<IPagedModel<IExtension>> } | null = null;
	private queryResult: IQueryResult | undefined;
	private extensionsViewState: ExtensionsViewState | undefined;

	private readonly contextMenuActionRunner = this._register(new ActionRunner());

	constructor(
		protected readonly options: ExtensionsListViewOptions,
		viewletViewOptions: IViewletViewOptions,
		@INotificationService protected notificationService: INotificationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IExtensionsWorkbenchService protected extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionRecommendationsService protected extensionRecommendationsService: IExtensionRecommendationsService,
		@ITelemetryService protected readonly telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@IExtensionManagementServerService protected readonly extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IWorkbenchExtensionManagementService protected readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkspaceContextService protected readonly workspaceService: IWorkspaceContextService,
		@IProductService protected readonly productService: IProductService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IStorageService private readonly storageService: IStorageService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService
	) {
		super({
			...(viewletViewOptions as IViewPaneOptions),
			showActions: ViewPaneShowActions.Always,
			maximumBodySize: options.flexibleHeight ? (storageService.getNumber(`${viewletViewOptions.id}.size`, StorageScope.PROFILE, 0) ? undefined : 0) : undefined
		}, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		if (this.options.onDidChangeTitle) {
			this._register(this.options.onDidChangeTitle(title => this.updateTitle(title)));
		}

		this._register(this.contextMenuActionRunner.onDidRun(({ error }) => error && this.notificationService.error(error)));
		this.registerActions();
	}

	protected registerActions(): void { }

	protected override renderHeader(container: HTMLElement): void {
		container.classList.add('extension-view-header');
		super.renderHeader(container);

		if (!this.options.hideBadge) {
			this.badge = this._register(new CountBadge(append(container, $('.count-badge-wrapper')), {}, defaultCountBadgeStyles));
		}
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		const messageContainer = append(container, $('.message-container'));
		const messageSeverityIcon = append(messageContainer, $(''));
		const messageBox = append(messageContainer, $('.message'));
		const extensionsList = append(container, $('.extensions-list'));
		this.extensionsViewState = this._register(new ExtensionsViewState());
		this.list = this._register(this.instantiationService.createInstance(ExtensionsList, extensionsList, this.id, {}, this.extensionsViewState)).list;
		ExtensionResultsListFocused.bindTo(this.list.contextKeyService);
		this._register(this.list.onDidChangeFocus(e => this.extensionsViewState?.onFocusChange(coalesce(e.elements)), this));

		this.bodyTemplate = {
			extensionsList,
			messageBox,
			messageContainer,
			messageSeverityIcon
		};

		if (this.queryResult) {
			this.setModel(this.queryResult.model);
		}
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		if (this.bodyTemplate) {
			this.bodyTemplate.extensionsList.style.height = height + 'px';
		}
		this.list?.layout(height, width);
	}

	async show(query: string, refresh?: boolean): Promise<IPagedModel<IExtension>> {
		if (this.queryRequest) {
			if (!refresh && this.queryRequest.query === query) {
				return this.queryRequest.request;
			}
			this.queryRequest.request.cancel();
			this.queryRequest = null;
		}

		if (this.queryResult) {
			this.queryResult.disposables.dispose();
			this.queryResult = undefined;
			if (this.extensionsViewState) {
				this.extensionsViewState.filters = {};
			}
		}

		const parsedQuery = Query.parse(query);

		const options: IQueryOptions = {
			sortOrder: SortOrder.Default
		};

		switch (parsedQuery.sortBy) {
			case 'installs': options.sortBy = GallerySortBy.InstallCount; break;
			case 'rating': options.sortBy = GallerySortBy.WeightedRating; break;
			case 'name': options.sortBy = GallerySortBy.Title; break;
			case 'publishedDate': options.sortBy = GallerySortBy.PublishedDate; break;
			case 'updateDate': options.sortBy = LocalSortBy.UpdateDate; break;
		}

		const request = createCancelablePromise(async token => {
			try {
				this.queryResult = await this.query(parsedQuery, options, token);
				const model = this.queryResult.model;
				this.setModel(model, this.queryResult.message);
				if (this.queryResult.onDidChangeModel) {
					this.queryResult.disposables.add(this.queryResult.onDidChangeModel(model => {
						if (this.queryResult) {
							this.queryResult.model = model;
							this.updateModel(model);
						}
					}));
				}
				return model;
			} catch (e) {
				const model = new PagedModel([]);
				if (!isCancellationError(e)) {
					this.logService.error(e);
					this.setModel(model, this.getMessage(e));
				}
				return this.list ? this.list.model : model;
			}
		});

		request.finally(() => this.queryRequest = null);
		this.queryRequest = { query, request };
		return request;
	}

	count(): number {
		return this.queryResult?.model.length ?? 0;
	}

	protected showEmptyModel(): Promise<IPagedModel<IExtension>> {
		const emptyModel = new PagedModel([]);
		this.setModel(emptyModel);
		return Promise.resolve(emptyModel);
	}

	private async query(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IQueryResult> {
		const idRegex = /@id:(([a-z0-9A-Z][a-z0-9\-A-Z]*)\.([a-z0-9A-Z][a-z0-9\-A-Z]*))/g;
		const ids: string[] = [];
		let idMatch;
		while ((idMatch = idRegex.exec(query.value)) !== null) {
			const name = idMatch[1];
			ids.push(name);
		}
		if (ids.length) {
			const model = await this.queryByIds(ids, options, token);
			return { model, disposables: new DisposableStore() };
		}

		if (ExtensionsListView.isLocalExtensionsQuery(query.value, query.sortBy)) {
			return this.queryLocal(query, options);
		}

		if (ExtensionsListView.isSearchPopularQuery(query.value)) {
			query.value = query.value.replace('@popular', '');
			options.sortBy = !options.sortBy ? GallerySortBy.InstallCount : options.sortBy;
		}
		else if (ExtensionsListView.isSearchRecentlyPublishedQuery(query.value)) {
			query.value = query.value.replace('@recentlyPublished', '');
			options.sortBy = !options.sortBy ? GallerySortBy.PublishedDate : options.sortBy;
		}

		const galleryQueryOptions: IGalleryQueryOptions = { ...options, sortBy: isLocalSortBy(options.sortBy) ? undefined : options.sortBy };
		return this.queryGallery(query, galleryQueryOptions, token);
	}

	private async queryByIds(ids: string[], options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const idsSet: Set<string> = ids.reduce((result, id) => { result.add(id.toLowerCase()); return result; }, new Set<string>());
		const result = (await this.extensionsWorkbenchService.queryLocal(this.options.server))
			.filter(e => idsSet.has(e.identifier.id.toLowerCase()));

		const galleryIds = result.length ? ids.filter(id => result.every(r => !areSameExtensions(r.identifier, { id }))) : ids;

		if (galleryIds.length) {
			const galleryResult = await this.extensionsWorkbenchService.getExtensions(galleryIds.map(id => ({ id })), { source: 'queryById' }, token);
			result.push(...galleryResult);
		}

		return new PagedModel(result);
	}

	private async queryLocal(query: Query, options: IQueryOptions): Promise<IQueryResult> {
		const local = await this.extensionsWorkbenchService.queryLocal(this.options.server);
		let { extensions, canIncludeInstalledExtensions, description } = await this.filterLocal(local, this.extensionService.extensions, query, options);
		const disposables = new DisposableStore();
		const onDidChangeModel = disposables.add(new Emitter<IPagedModel<IExtension>>());

		if (canIncludeInstalledExtensions) {
			let isDisposed: boolean = false;
			disposables.add(toDisposable(() => isDisposed = true));
			disposables.add(Event.debounce(Event.any(
				Event.filter(this.extensionsWorkbenchService.onChange, e => e?.state === ExtensionState.Installed),
				this.extensionService.onDidChangeExtensions
			), () => undefined)(async () => {
				const local = this.options.server ? this.extensionsWorkbenchService.installed.filter(e => e.server === this.options.server) : this.extensionsWorkbenchService.local;
				const { extensions: newExtensions } = await this.filterLocal(local, this.extensionService.extensions, query, options);
				if (!isDisposed) {
					const mergedExtensions = this.mergeAddedExtensions(extensions, newExtensions);
					if (mergedExtensions) {
						extensions = mergedExtensions;
						onDidChangeModel.fire(new PagedModel(extensions));
					}
				}
			}));
		}

		return {
			model: new PagedModel(extensions),
			message: description ? { text: description, severity: Severity.Info } : undefined,
			onDidChangeModel: onDidChangeModel.event,
			disposables
		};
	}

	private async filterLocal(local: IExtension[], runningExtensions: readonly IExtensionDescription[], query: Query, options: IQueryOptions): Promise<{ extensions: IExtension[]; canIncludeInstalledExtensions: boolean; description?: string }> {
		const value = query.value;
		let extensions: IExtension[] = [];
		let description: string | undefined;
		const includeBuiltin = /@builtin/i.test(value);
		const canIncludeInstalledExtensions = !includeBuiltin;

		if (/@installed/i.test(value)) {
			extensions = this.filterInstalledExtensions(local, runningExtensions, query, options);
		}

		else if (/@outdated/i.test(value)) {
			extensions = this.filterOutdatedExtensions(local, query, options);
		}

		else if (/@disabled/i.test(value)) {
			extensions = this.filterDisabledExtensions(local, runningExtensions, query, options, includeBuiltin);
		}

		else if (/@enabled/i.test(value)) {
			extensions = this.filterEnabledExtensions(local, runningExtensions, query, options, includeBuiltin);
		}

		else if (/@workspaceUnsupported/i.test(value)) {
			extensions = this.filterWorkspaceUnsupportedExtensions(local, query, options);
		}

		else if (/@deprecated/i.test(query.value)) {
			extensions = await this.filterDeprecatedExtensions(local, query, options);
		}

		else if (/@recentlyUpdated/i.test(query.value)) {
			extensions = this.filterRecentlyUpdatedExtensions(local, query, options);
		}

		else if (/@feature:/i.test(query.value)) {
			const result = this.filterExtensionsByFeature(local, query);
			if (result) {
				extensions = result.extensions;
				description = result.description;
			}
		}

		else if (includeBuiltin) {
			extensions = this.filterBuiltinExtensions(local, query, options);
		}

		return { extensions, canIncludeInstalledExtensions, description };
	}

	private filterBuiltinExtensions(local: IExtension[], query: Query, options: IQueryOptions): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);
		value = value.replaceAll(/@builtin/gi, '').replaceAll(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();

		const result = local
			.filter(e => e.isBuiltin && (e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1)
				&& this.filterExtensionByCategory(e, includedCategories, excludedCategories));

		return this.sortExtensions(result, options);
	}

	private filterExtensionByCategory(e: IExtension, includedCategories: string[], excludedCategories: string[]): boolean {
		if (!includedCategories.length && !excludedCategories.length) {
			return true;
		}
		if (e.categories.length) {
			if (excludedCategories.length && e.categories.some(category => excludedCategories.includes(category.toLowerCase()))) {
				return false;
			}
			return e.categories.some(category => includedCategories.includes(category.toLowerCase()));
		} else {
			return includedCategories.includes(NONE_CATEGORY);
		}
	}

	private parseCategories(value: string): { value: string; includedCategories: string[]; excludedCategories: string[] } {
		const includedCategories: string[] = [];
		const excludedCategories: string[] = [];
		value = value.replace(/\bcategory:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, (_, quotedCategory, category) => {
			const entry = (category || quotedCategory || '').toLowerCase();
			if (entry.startsWith('-')) {
				if (excludedCategories.indexOf(entry) === -1) {
					excludedCategories.push(entry);
				}
			} else {
				if (includedCategories.indexOf(entry) === -1) {
					includedCategories.push(entry);
				}
			}
			return '';
		});
		return { value, includedCategories, excludedCategories };
	}

	private filterInstalledExtensions(local: IExtension[], runningExtensions: readonly IExtensionDescription[], query: Query, options: IQueryOptions): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);

		value = value.replace(/@installed/g, '').replace(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();

		const matchingText = (e: IExtension) => (e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1 || e.description.toLowerCase().indexOf(value) > -1)
			&& this.filterExtensionByCategory(e, includedCategories, excludedCategories);
		let result;

		if (options.sortBy !== undefined) {
			result = local.filter(e => !e.isBuiltin && matchingText(e));
			result = this.sortExtensions(result, options);
		} else {
			result = local.filter(e => (!e.isBuiltin || e.outdated || e.runtimeState !== undefined) && matchingText(e));
			const runningExtensionsById = runningExtensions.reduce((result, e) => { result.set(e.identifier.value, e); return result; }, new ExtensionIdentifierMap<IExtensionDescription>());

			const defaultSort = (e1: IExtension, e2: IExtension) => {
				const running1 = runningExtensionsById.get(e1.identifier.id);
				const isE1Running = !!running1 && this.extensionManagementServerService.getExtensionManagementServer(toExtension(running1)) === e1.server;
				const running2 = runningExtensionsById.get(e2.identifier.id);
				const isE2Running = running2 && this.extensionManagementServerService.getExtensionManagementServer(toExtension(running2)) === e2.server;
				if ((isE1Running && isE2Running)) {
					return e1.displayName.localeCompare(e2.displayName);
				}
				const isE1LanguagePackExtension = e1.local && isLanguagePackExtension(e1.local.manifest);
				const isE2LanguagePackExtension = e2.local && isLanguagePackExtension(e2.local.manifest);
				if (!isE1Running && !isE2Running) {
					if (isE1LanguagePackExtension) {
						return -1;
					}
					if (isE2LanguagePackExtension) {
						return 1;
					}
					return e1.displayName.localeCompare(e2.displayName);
				}
				if ((isE1Running && isE2LanguagePackExtension) || (isE2Running && isE1LanguagePackExtension)) {
					return e1.displayName.localeCompare(e2.displayName);
				}
				return isE1Running ? -1 : 1;
			};

			const incompatible: IExtension[] = [];
			const deprecated: IExtension[] = [];
			const outdated: IExtension[] = [];
			const actionRequired: IExtension[] = [];
			const noActionRequired: IExtension[] = [];

			for (const e of result) {
				if (e.enablementState === EnablementState.DisabledByInvalidExtension) {
					incompatible.push(e);
				}
				else if (e.deprecationInfo) {
					deprecated.push(e);
				}
				else if (e.outdated && this.extensionEnablementService.isEnabledEnablementState(e.enablementState)) {
					outdated.push(e);
				}
				else if (e.runtimeState) {
					actionRequired.push(e);
				}
				else {
					noActionRequired.push(e);
				}
			}

			result = [
				...incompatible.sort(defaultSort),
				...deprecated.sort(defaultSort),
				...outdated.sort(defaultSort),
				...actionRequired.sort(defaultSort),
				...noActionRequired.sort(defaultSort)
			];
		}
		return result;
	}

	private filterOutdatedExtensions(local: IExtension[], query: Query, options: IQueryOptions): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);

		value = value.replace(/@outdated/g, '').replace(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();

		const result = local
			.sort((e1, e2) => e1.displayName.localeCompare(e2.displayName))
			.filter(extension => extension.outdated
				&& (extension.name.toLowerCase().indexOf(value) > -1 || extension.displayName.toLowerCase().indexOf(value) > -1)
				&& this.filterExtensionByCategory(extension, includedCategories, excludedCategories));

		return this.sortExtensions(result, options);
	}

	private filterDisabledExtensions(local: IExtension[], runningExtensions: readonly IExtensionDescription[], query: Query, options: IQueryOptions, includeBuiltin: boolean): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);

		value = value.replaceAll(/@disabled|@builtin/gi, '').replaceAll(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();

		if (includeBuiltin) {
			local = local.filter(e => e.isBuiltin);
		}
		const result = local
			.sort((e1, e2) => e1.displayName.localeCompare(e2.displayName))
			.filter(e => runningExtensions.every(r => !areSameExtensions({ id: r.identifier.value, uuid: r.uuid }, e.identifier))
				&& (e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1)
				&& this.filterExtensionByCategory(e, includedCategories, excludedCategories));

		return this.sortExtensions(result, options);
	}

	private filterEnabledExtensions(local: IExtension[], runningExtensions: readonly IExtensionDescription[], query: Query, options: IQueryOptions, includeBuiltin: boolean): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);

		value = value ? value.replaceAll(/@enabled|@builtin/gi, '').replaceAll(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase() : '';

		local = local.filter(e => e.isBuiltin === includeBuiltin);
		const result = local
			.sort((e1, e2) => e1.displayName.localeCompare(e2.displayName))
			.filter(e => runningExtensions.some(r => areSameExtensions({ id: r.identifier.value, uuid: r.uuid }, e.identifier))
				&& (e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1)
				&& this.filterExtensionByCategory(e, includedCategories, excludedCategories));

		return this.sortExtensions(result, options);
	}

	private filterWorkspaceUnsupportedExtensions(local: IExtension[], query: Query, options: IQueryOptions): IExtension[] {
		// shows local extensions which are restricted or disabled in the current workspace because of the extension's capability

		const queryString = query.value; // @sortby is already filtered out

		const match = queryString.match(/^\s*@workspaceUnsupported(?::(untrusted|virtual)(Partial)?)?(?:\s+([^\s]*))?/i);
		if (!match) {
			return [];
		}
		const type = match[1]?.toLowerCase();
		const partial = !!match[2];
		const nameFilter = match[3]?.toLowerCase();

		if (nameFilter) {
			local = local.filter(extension => extension.name.toLowerCase().indexOf(nameFilter) > -1 || extension.displayName.toLowerCase().indexOf(nameFilter) > -1);
		}

		const hasVirtualSupportType = (extension: IExtension, supportType: ExtensionVirtualWorkspaceSupportType) => {
			return extension.local && this.extensionManifestPropertiesService.getExtensionVirtualWorkspaceSupportType(extension.local.manifest) === supportType;
		};

		const hasRestrictedSupportType = (extension: IExtension, supportType: ExtensionUntrustedWorkspaceSupportType) => {
			if (!extension.local) {
				return false;
			}

			const enablementState = this.extensionEnablementService.getEnablementState(extension.local);
			if (enablementState !== EnablementState.EnabledGlobally && enablementState !== EnablementState.EnabledWorkspace &&
				enablementState !== EnablementState.DisabledByTrustRequirement && enablementState !== EnablementState.DisabledByExtensionDependency) {
				return false;
			}

			if (this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(extension.local.manifest) === supportType) {
				return true;
			}

			if (supportType === false) {
				const dependencies = getExtensionDependencies(local.map(ext => ext.local!), extension.local);
				return dependencies.some(ext => this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(ext.manifest) === supportType);
			}

			return false;
		};

		const inVirtualWorkspace = isVirtualWorkspace(this.workspaceService.getWorkspace());
		const inRestrictedWorkspace = !this.workspaceTrustManagementService.isWorkspaceTrusted();

		if (type === 'virtual') {
			// show limited and disabled extensions unless disabled because of a untrusted workspace
			local = local.filter(extension => inVirtualWorkspace && hasVirtualSupportType(extension, partial ? 'limited' : false) && !(inRestrictedWorkspace && hasRestrictedSupportType(extension, false)));
		} else if (type === 'untrusted') {
			// show limited and disabled extensions unless disabled because of a virtual workspace
			local = local.filter(extension => hasRestrictedSupportType(extension, partial ? 'limited' : false) && !(inVirtualWorkspace && hasVirtualSupportType(extension, false)));
		} else {
			// show extensions that are restricted or disabled in the current workspace
			local = local.filter(extension => inVirtualWorkspace && !hasVirtualSupportType(extension, true) || inRestrictedWorkspace && !hasRestrictedSupportType(extension, true));
		}
		return this.sortExtensions(local, options);
	}

	private async filterDeprecatedExtensions(local: IExtension[], query: Query, options: IQueryOptions): Promise<IExtension[]> {
		const value = query.value.replace(/@deprecated/g, '').replace(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();
		const extensionsControlManifest = await this.extensionManagementService.getExtensionsControlManifest();
		const deprecatedExtensionIds = Object.keys(extensionsControlManifest.deprecated);
		local = local.filter(e => deprecatedExtensionIds.includes(e.identifier.id) && (!value || e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1));
		return this.sortExtensions(local, options);
	}

	private filterRecentlyUpdatedExtensions(local: IExtension[], query: Query, options: IQueryOptions): IExtension[] {
		let { value, includedCategories, excludedCategories } = this.parseCategories(query.value);
		const currentTime = Date.now();
		local = local.filter(e => !e.isBuiltin && !e.outdated && e.local?.updated && e.local?.installedTimestamp !== undefined && currentTime - e.local.installedTimestamp < ExtensionsListView.RECENT_UPDATE_DURATION);

		value = value.replace(/@recentlyUpdated/g, '').replace(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase();

		const result = local.filter(e =>
			(e.name.toLowerCase().indexOf(value) > -1 || e.displayName.toLowerCase().indexOf(value) > -1)
			&& this.filterExtensionByCategory(e, includedCategories, excludedCategories));

		options.sortBy = options.sortBy ?? LocalSortBy.UpdateDate;

		return this.sortExtensions(result, options);
	}

	private filterExtensionsByFeature(local: IExtension[], query: Query): { extensions: IExtension[]; description: string } | undefined {
		const value = query.value.replace(/@feature:/g, '').trim();
		const featureId = value.split(' ')[0];
		const feature = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).getExtensionFeature(featureId);
		if (!feature) {
			return undefined;
		}
		if (this.extensionsViewState) {
			this.extensionsViewState.filters.featureId = featureId;
		}
		const renderer = feature.renderer ? this.instantiationService.createInstance<IExtensionFeatureRenderer>(feature.renderer) : undefined;
		try {
			const result: [IExtension, number][] = [];
			for (const e of local) {
				if (!e.local) {
					continue;
				}
				const accessData = this.extensionFeaturesManagementService.getAccessData(new ExtensionIdentifier(e.identifier.id), featureId);
				const shouldRender = renderer?.shouldRender(e.local.manifest);
				if (accessData || shouldRender) {
					result.push([e, accessData?.accessTimes.length ?? 0]);
				}
			}
			return {
				extensions: result.sort(([, a], [, b]) => b - a).map(([e]) => e),
				description: localize('showingExtensionsForFeature', "Extensions using {0} in the last 30 days", feature.label)
			};
		} finally {
			renderer?.dispose();
		}
	}

	private mergeAddedExtensions(extensions: IExtension[], newExtensions: IExtension[]): IExtension[] | undefined {
		const oldExtensions = [...extensions];
		const findPreviousExtensionIndex = (from: number): number => {
			let index = -1;
			const previousExtensionInNew = newExtensions[from];
			if (previousExtensionInNew) {
				index = oldExtensions.findIndex(e => areSameExtensions(e.identifier, previousExtensionInNew.identifier));
				if (index === -1) {
					return findPreviousExtensionIndex(from - 1);
				}
			}
			return index;
		};

		let hasChanged: boolean = false;
		for (let index = 0; index < newExtensions.length; index++) {
			const extension = newExtensions[index];
			if (extensions.every(r => !areSameExtensions(r.identifier, extension.identifier))) {
				hasChanged = true;
				extensions.splice(findPreviousExtensionIndex(index - 1) + 1, 0, extension);
			}
		}

		return hasChanged ? extensions : undefined;
	}

	private async queryGallery(query: Query, options: IGalleryQueryOptions, token: CancellationToken): Promise<IQueryResult> {
		const hasUserDefinedSortOrder = options.sortBy !== undefined;
		if (!hasUserDefinedSortOrder && !query.value.trim()) {
			options.sortBy = GallerySortBy.InstallCount;
		}

		if (this.isRecommendationsQuery(query)) {
			const model = await this.queryRecommendations(query, options, token);
			return { model, disposables: new DisposableStore() };
		}

		const text = query.value;

		if (!text) {
			options.source = 'viewlet';
			const pager = await this.extensionsWorkbenchService.queryGallery(options, token);
			return { model: new PagedModel(pager), disposables: new DisposableStore() };
		}

		if (/\bext:([^\s]+)\b/g.test(text)) {
			options.text = text;
			options.source = 'file-extension-tags';
			const pager = await this.extensionsWorkbenchService.queryGallery(options, token);
			return { model: new PagedModel(pager), disposables: new DisposableStore() };
		}

		options.text = text.substring(0, 350);
		options.source = 'searchText';

		if (hasUserDefinedSortOrder || /\b(category|tag):([^\s]+)\b/gi.test(text) || /\bfeatured(\s+|\b|$)/gi.test(text)) {
			const pager = await this.extensionsWorkbenchService.queryGallery(options, token);
			return { model: new PagedModel(pager), disposables: new DisposableStore() };
		}

		try {
			const [pager, preferredExtensions] = await Promise.all([
				this.extensionsWorkbenchService.queryGallery(options, token),
				this.getPreferredExtensions(options.text.toLowerCase(), token).catch(() => [])
			]);

			const model = preferredExtensions.length ? new PreferredExtensionsPagedModel(preferredExtensions, pager) : new PagedModel(pager);
			return { model, disposables: new DisposableStore() };
		} catch (error) {
			if (isCancellationError(error)) {
				throw error;
			}

			if (!(error instanceof ExtensionGalleryError)) {
				throw error;
			}

			const searchText = options.text.toLowerCase();
			const localExtensions = this.extensionsWorkbenchService.local.filter(e => !e.isBuiltin && (e.name.toLowerCase().indexOf(searchText) > -1 || e.displayName.toLowerCase().indexOf(searchText) > -1 || e.description.toLowerCase().indexOf(searchText) > -1));
			if (localExtensions.length) {
				const message = this.getMessage(error);
				return { model: new PagedModel(localExtensions), disposables: new DisposableStore(), message: { text: localize('showing local extensions only', "{0} Showing local extensions.", message.text), severity: message.severity } };
			}

			throw error;
		}
	}

	private async getPreferredExtensions(searchText: string, token: CancellationToken): Promise<IExtension[]> {
		const preferredExtensions = this.extensionsWorkbenchService.local.filter(e => !e.isBuiltin && (e.name.toLowerCase().indexOf(searchText) > -1 || e.displayName.toLowerCase().indexOf(searchText) > -1 || e.description.toLowerCase().indexOf(searchText) > -1));
		const preferredExtensionUUIDs = new Set<string>();

		if (preferredExtensions.length) {
			// Update gallery data for preferred extensions if they are not yet fetched
			const extesionsToFetch: IExtensionIdentifier[] = [];
			for (const extension of preferredExtensions) {
				if (extension.identifier.uuid) {
					preferredExtensionUUIDs.add(extension.identifier.uuid);
				}
				if (!extension.gallery && extension.identifier.uuid) {
					extesionsToFetch.push(extension.identifier);
				}
			}
			if (extesionsToFetch.length) {
				this.extensionsWorkbenchService.getExtensions(extesionsToFetch, CancellationToken.None).catch(e => null/*ignore error*/);
			}
		}

		const preferredResults: string[] = [];
		try {
			const manifest = await this.extensionManagementService.getExtensionsControlManifest();
			if (Array.isArray(manifest.search)) {
				for (const s of manifest.search) {
					if (s.query && s.query.toLowerCase() === searchText && Array.isArray(s.preferredResults)) {
						preferredResults.push(...s.preferredResults);
						break;
					}
				}
			}
			if (preferredResults.length) {
				const result = await this.extensionsWorkbenchService.getExtensions(preferredResults.map(id => ({ id })), token);
				for (const extension of result) {
					if (extension.identifier.uuid && !preferredExtensionUUIDs.has(extension.identifier.uuid)) {
						preferredExtensions.push(extension);
					}
				}
			}
		} catch (e) {
			this.logService.warn('Failed to get preferred results from the extensions control manifest.', e);
		}

		return preferredExtensions;
	}

	private sortExtensions(extensions: IExtension[], options: IQueryOptions): IExtension[] {
		switch (options.sortBy) {
			case GallerySortBy.InstallCount:
				extensions = extensions.sort((e1, e2) => typeof e2.installCount === 'number' && typeof e1.installCount === 'number' ? e2.installCount - e1.installCount : NaN);
				break;
			case LocalSortBy.UpdateDate:
				extensions = extensions.sort((e1, e2) =>
					typeof e2.local?.installedTimestamp === 'number' && typeof e1.local?.installedTimestamp === 'number' ? e2.local.installedTimestamp - e1.local.installedTimestamp :
						typeof e2.local?.installedTimestamp === 'number' ? 1 :
							typeof e1.local?.installedTimestamp === 'number' ? -1 : NaN);
				break;
			case GallerySortBy.AverageRating:
			case GallerySortBy.WeightedRating:
				extensions = extensions.sort((e1, e2) => typeof e2.rating === 'number' && typeof e1.rating === 'number' ? e2.rating - e1.rating : NaN);
				break;
			default:
				extensions = extensions.sort((e1, e2) => e1.displayName.localeCompare(e2.displayName));
				break;
		}
		if (options.sortOrder === SortOrder.Descending) {
			extensions = extensions.reverse();
		}
		return extensions;
	}

	private isRecommendationsQuery(query: Query): boolean {
		return ExtensionsListView.isWorkspaceRecommendedExtensionsQuery(query.value)
			|| ExtensionsListView.isKeymapsRecommendedExtensionsQuery(query.value)
			|| ExtensionsListView.isLanguageRecommendedExtensionsQuery(query.value)
			|| ExtensionsListView.isExeRecommendedExtensionsQuery(query.value)
			|| ExtensionsListView.isRemoteRecommendedExtensionsQuery(query.value)
			|| /@recommended:all/i.test(query.value)
			|| ExtensionsListView.isSearchRecommendedExtensionsQuery(query.value)
			|| ExtensionsListView.isRecommendedExtensionsQuery(query.value);
	}

	private async queryRecommendations(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		// Workspace recommendations
		if (ExtensionsListView.isWorkspaceRecommendedExtensionsQuery(query.value)) {
			return this.getWorkspaceRecommendationsModel(query, options, token);
		}

		// Keymap recommendations
		if (ExtensionsListView.isKeymapsRecommendedExtensionsQuery(query.value)) {
			return this.getKeymapRecommendationsModel(query, options, token);
		}

		// Language recommendations
		if (ExtensionsListView.isLanguageRecommendedExtensionsQuery(query.value)) {
			return this.getLanguageRecommendationsModel(query, options, token);
		}

		// Exe recommendations
		if (ExtensionsListView.isExeRecommendedExtensionsQuery(query.value)) {
			return this.getExeRecommendationsModel(query, options, token);
		}

		// Remote recommendations
		if (ExtensionsListView.isRemoteRecommendedExtensionsQuery(query.value)) {
			return this.getRemoteRecommendationsModel(query, options, token);
		}

		// All recommendations
		if (/@recommended:all/i.test(query.value)) {
			return this.getAllRecommendationsModel(options, token);
		}

		// Search recommendations
		if (ExtensionsListView.isSearchRecommendedExtensionsQuery(query.value) ||
			(ExtensionsListView.isRecommendedExtensionsQuery(query.value) && options.sortBy !== undefined)) {
			return this.searchRecommendations(query, options, token);
		}

		// Other recommendations
		if (ExtensionsListView.isRecommendedExtensionsQuery(query.value)) {
			return this.getOtherRecommendationsModel(query, options, token);
		}

		return new PagedModel([]);
	}

	protected async getInstallableRecommendations(recommendations: Array<string | URI>, options: IQueryOptions, token: CancellationToken): Promise<IExtension[]> {
		const result: IExtension[] = [];
		if (recommendations.length) {
			const galleryExtensions: string[] = [];
			const resourceExtensions: URI[] = [];
			for (const recommendation of recommendations) {
				if (typeof recommendation === 'string') {
					galleryExtensions.push(recommendation);
				} else {
					resourceExtensions.push(recommendation);
				}
			}
			if (galleryExtensions.length) {
				try {
					const extensions = await this.extensionsWorkbenchService.getExtensions(galleryExtensions.map(id => ({ id })), { source: options.source }, token);
					for (const extension of extensions) {
						if (extension.gallery && !extension.deprecationInfo
							&& await this.extensionManagementService.canInstall(extension.gallery) === true) {
							result.push(extension);
						}
					}
				} catch (error) {
					if (!resourceExtensions.length || !this.isOfflineError(error)) {
						throw error;
					}
				}
			}
			if (resourceExtensions.length) {
				const extensions = await this.extensionsWorkbenchService.getResourceExtensions(resourceExtensions, true);
				for (const extension of extensions) {
					if (await this.extensionsWorkbenchService.canInstall(extension) === true) {
						result.push(extension);
					}
				}
			}
		}
		return result;
	}

	protected async getWorkspaceRecommendations(): Promise<Array<string | URI>> {
		const recommendations = await this.extensionRecommendationsService.getWorkspaceRecommendations();
		const { important } = await this.extensionRecommendationsService.getConfigBasedRecommendations();
		for (const configBasedRecommendation of important) {
			if (!recommendations.find(extensionId => extensionId === configBasedRecommendation)) {
				recommendations.push(configBasedRecommendation);
			}
		}
		return recommendations;
	}

	private async getWorkspaceRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const recommendations = await this.getWorkspaceRecommendations();
		const installableRecommendations = (await this.getInstallableRecommendations(recommendations, { ...options, source: 'recommendations-workspace' }, token));
		return new PagedModel(installableRecommendations);
	}

	private async getKeymapRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const value = query.value.replace(/@recommended:keymaps/g, '').trim().toLowerCase();
		const recommendations = this.extensionRecommendationsService.getKeymapRecommendations();
		const installableRecommendations = (await this.getInstallableRecommendations(recommendations, { ...options, source: 'recommendations-keymaps' }, token))
			.filter(extension => extension.identifier.id.toLowerCase().indexOf(value) > -1);
		return new PagedModel(installableRecommendations);
	}

	private async getLanguageRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const value = query.value.replace(/@recommended:languages/g, '').trim().toLowerCase();
		const recommendations = this.extensionRecommendationsService.getLanguageRecommendations();
		const installableRecommendations = (await this.getInstallableRecommendations(recommendations, { ...options, source: 'recommendations-languages' }, token))
			.filter(extension => extension.identifier.id.toLowerCase().indexOf(value) > -1);
		return new PagedModel(installableRecommendations);
	}

	private async getRemoteRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const value = query.value.replace(/@recommended:remotes/g, '').trim().toLowerCase();
		const recommendations = this.extensionRecommendationsService.getRemoteRecommendations();
		const installableRecommendations = (await this.getInstallableRecommendations(recommendations, { ...options, source: 'recommendations-remotes' }, token))
			.filter(extension => extension.identifier.id.toLowerCase().indexOf(value) > -1);
		return new PagedModel(installableRecommendations);
	}

	private async getExeRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const exe = query.value.replace(/@exe:/g, '').trim().toLowerCase();
		const { important, others } = await this.extensionRecommendationsService.getExeBasedRecommendations(exe.startsWith('"') ? exe.substring(1, exe.length - 1) : exe);
		const installableRecommendations = await this.getInstallableRecommendations([...important, ...others], { ...options, source: 'recommendations-exe' }, token);
		return new PagedModel(installableRecommendations);
	}

	private async getOtherRecommendationsModel(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const otherRecommendations = await this.getOtherRecommendations();
		const installableRecommendations = await this.getInstallableRecommendations(otherRecommendations, { ...options, source: 'recommendations-other', sortBy: undefined }, token);
		const result = coalesce(otherRecommendations.map(id => installableRecommendations.find(i => areSameExtensions(i.identifier, { id }))));
		return new PagedModel(result);
	}

	private async getOtherRecommendations(): Promise<string[]> {
		const local = (await this.extensionsWorkbenchService.queryLocal(this.options.server))
			.map(e => e.identifier.id.toLowerCase());
		const workspaceRecommendations = (await this.getWorkspaceRecommendations())
			.map(extensionId => isString(extensionId) ? extensionId.toLowerCase() : extensionId);

		return distinct(
			(await Promise.all([
				// Order is important
				this.extensionRecommendationsService.getImportantRecommendations(),
				this.extensionRecommendationsService.getFileBasedRecommendations(),
				this.extensionRecommendationsService.getOtherRecommendations()
			])).flat().filter(extensionId => !local.includes(extensionId.toLowerCase()) && !workspaceRecommendations.includes(extensionId.toLowerCase())
			), extensionId => extensionId.toLowerCase());
	}

	// Get All types of recommendations, trimmed to show a max of 8 at any given time
	private async getAllRecommendationsModel(options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const localExtensions = await this.extensionsWorkbenchService.queryLocal(this.options.server);
		const localExtensionIds = localExtensions.map(e => e.identifier.id.toLowerCase());

		const allRecommendations = distinct(
			(await Promise.all([
				// Order is important
				this.getWorkspaceRecommendations(),
				this.extensionRecommendationsService.getImportantRecommendations(),
				this.extensionRecommendationsService.getFileBasedRecommendations(),
				this.extensionRecommendationsService.getOtherRecommendations()
			])).flat().filter(extensionId => {
				if (isString(extensionId)) {
					return !localExtensionIds.includes(extensionId.toLowerCase());
				}
				return !localExtensions.some(localExtension => localExtension.local && this.uriIdentityService.extUri.isEqual(localExtension.local.location, extensionId));
			}));

		const installableRecommendations = await this.getInstallableRecommendations(allRecommendations, { ...options, source: 'recommendations-all', sortBy: undefined }, token);

		const result: IExtension[] = [];
		for (let i = 0; i < installableRecommendations.length && result.length < 8; i++) {
			const recommendation = allRecommendations[i];
			if (isString(recommendation)) {
				const extension = installableRecommendations.find(extension => areSameExtensions(extension.identifier, { id: recommendation }));
				if (extension) {
					result.push(extension);
				}
			} else {
				const extension = installableRecommendations.find(extension => extension.resourceExtension && this.uriIdentityService.extUri.isEqual(extension.resourceExtension.location, recommendation));
				if (extension) {
					result.push(extension);
				}
			}
		}

		return new PagedModel(result);
	}

	private async searchRecommendations(query: Query, options: IQueryOptions, token: CancellationToken): Promise<IPagedModel<IExtension>> {
		const value = query.value.replace(/@recommended/g, '').trim().toLowerCase();
		const recommendations = distinct([...await this.getWorkspaceRecommendations(), ...await this.getOtherRecommendations()]);
		const installableRecommendations = (await this.getInstallableRecommendations(recommendations, { ...options, source: 'recommendations', sortBy: undefined }, token))
			.filter(extension => extension.identifier.id.toLowerCase().indexOf(value) > -1);
		return new PagedModel(this.sortExtensions(installableRecommendations, options));
	}

	private setModel(model: IPagedModel<IExtension>, message?: Message, donotResetScrollTop?: boolean) {
		if (this.list) {
			this.list.model = new DelayedPagedModel(model);
			this.updateBody(message);
			if (!donotResetScrollTop) {
				this.list.scrollTop = 0;
			}
		}
		if (this.badge) {
			this.badge.setCount(this.count());
		}
	}

	private updateModel(model: IPagedModel<IExtension>) {
		if (this.list) {
			this.list.model = new DelayedPagedModel(model);
			this.updateBody();
		}
		if (this.badge) {
			this.badge.setCount(this.count());
		}
	}

	private updateBody(message?: Message): void {
		if (this.bodyTemplate) {

			const count = this.count();
			this.bodyTemplate.extensionsList.classList.toggle('hidden', count === 0);
			this.bodyTemplate.messageContainer.classList.toggle('hidden', !message && count > 0);

			if (this.isBodyVisible()) {
				if (message) {
					this.bodyTemplate.messageSeverityIcon.className = SeverityIcon.className(message.severity);
					this.bodyTemplate.messageBox.textContent = message.text;
				} else if (this.count() === 0) {
					this.bodyTemplate.messageSeverityIcon.className = '';
					this.bodyTemplate.messageBox.textContent = localize('no extensions found', "No extensions found.");
				}
				if (this.bodyTemplate.messageBox.textContent) {
					alert(this.bodyTemplate.messageBox.textContent);
				}
			}
		}

		this.updateSize();
	}

	private getMessage(error: any): Message {
		if (this.isOfflineError(error)) {
			return { text: localize('offline error', "Unable to search the Marketplace when offline, please check your network connection."), severity: Severity.Warning };
		} else {
			return { text: localize('error', "Error while fetching extensions. {0}", getErrorMessage(error)), severity: Severity.Error };
		}
	}

	private isOfflineError(error: Error): boolean {
		if (error instanceof ExtensionGalleryError) {
			return error.code === ExtensionGalleryErrorCode.Offline;
		}
		return isOfflineError(error);
	}

	protected updateSize() {
		if (this.options.flexibleHeight) {
			this.maximumBodySize = this.list?.model.length ? Number.POSITIVE_INFINITY : 0;
			this.storageService.store(`${this.id}.size`, this.list?.model.length || 0, StorageScope.PROFILE, StorageTarget.MACHINE);
		}
	}

	override dispose(): void {
		super.dispose();
		if (this.queryRequest) {
			this.queryRequest.request.cancel();
			this.queryRequest = null;
		}
		if (this.queryResult) {
			this.queryResult.disposables.dispose();
			this.queryResult = undefined;
		}
		this.list = null;
	}

	static isLocalExtensionsQuery(query: string, sortBy?: string): boolean {
		return this.isInstalledExtensionsQuery(query)
			|| this.isSearchInstalledExtensionsQuery(query)
			|| this.isOutdatedExtensionsQuery(query)
			|| this.isEnabledExtensionsQuery(query)
			|| this.isDisabledExtensionsQuery(query)
			|| this.isBuiltInExtensionsQuery(query)
			|| this.isSearchBuiltInExtensionsQuery(query)
			|| this.isBuiltInGroupExtensionsQuery(query)
			|| this.isSearchDeprecatedExtensionsQuery(query)
			|| this.isSearchWorkspaceUnsupportedExtensionsQuery(query)
			|| this.isSearchRecentlyUpdatedQuery(query)
			|| this.isSearchExtensionUpdatesQuery(query)
			|| this.isSortInstalledExtensionsQuery(query, sortBy)
			|| this.isFeatureExtensionsQuery(query);
	}

	static isSearchBuiltInExtensionsQuery(query: string): boolean {
		return /@builtin\s.+|.+\s@builtin/i.test(query);
	}

	static isBuiltInExtensionsQuery(query: string): boolean {
		return /^@builtin$/i.test(query.trim());
	}

	static isBuiltInGroupExtensionsQuery(query: string): boolean {
		return /^@builtin:.+$/i.test(query.trim());
	}

	static isSearchWorkspaceUnsupportedExtensionsQuery(query: string): boolean {
		return /^\s*@workspaceUnsupported(:(untrusted|virtual)(Partial)?)?(\s|$)/i.test(query);
	}

	static isInstalledExtensionsQuery(query: string): boolean {
		return /@installed$/i.test(query);
	}

	static isSearchInstalledExtensionsQuery(query: string): boolean {
		return /@installed\s./i.test(query) || this.isFeatureExtensionsQuery(query);
	}

	static isOutdatedExtensionsQuery(query: string): boolean {
		return /@outdated/i.test(query);
	}

	static isEnabledExtensionsQuery(query: string): boolean {
		return /@enabled/i.test(query) && !/@builtin/i.test(query);
	}

	static isDisabledExtensionsQuery(query: string): boolean {
		return /@disabled/i.test(query) && !/@builtin/i.test(query);
	}

	static isSearchDeprecatedExtensionsQuery(query: string): boolean {
		return /@deprecated\s?.*/i.test(query);
	}

	static isRecommendedExtensionsQuery(query: string): boolean {
		return /^@recommended$/i.test(query.trim());
	}

	static isSearchRecommendedExtensionsQuery(query: string): boolean {
		return /@recommended\s.+/i.test(query);
	}

	static isWorkspaceRecommendedExtensionsQuery(query: string): boolean {
		return /@recommended:workspace/i.test(query);
	}

	static isExeRecommendedExtensionsQuery(query: string): boolean {
		return /@exe:.+/i.test(query);
	}

	static isRemoteRecommendedExtensionsQuery(query: string): boolean {
		return /@recommended:remotes/i.test(query);
	}

	static isKeymapsRecommendedExtensionsQuery(query: string): boolean {
		return /@recommended:keymaps/i.test(query);
	}

	static isLanguageRecommendedExtensionsQuery(query: string): boolean {
		return /@recommended:languages/i.test(query);
	}

	static isSortInstalledExtensionsQuery(query: string, sortBy?: string): boolean {
		return (sortBy !== undefined && sortBy !== '' && query === '') || (!sortBy && /^@sort:\S*$/i.test(query));
	}

	static isSearchPopularQuery(query: string): boolean {
		return /@popular/i.test(query);
	}

	static isSearchRecentlyPublishedQuery(query: string): boolean {
		return /@recentlyPublished/i.test(query);
	}

	static isSearchRecentlyUpdatedQuery(query: string): boolean {
		return /@recentlyUpdated/i.test(query);
	}

	static isSearchExtensionUpdatesQuery(query: string): boolean {
		return /@updates/i.test(query);
	}

	static isSortUpdateDateQuery(query: string): boolean {
		return /@sort:updateDate/i.test(query);
	}

	static isFeatureExtensionsQuery(query: string): boolean {
		return /@feature:/i.test(query);
	}

	override focus(): void {
		super.focus();
		if (!this.list) {
			return;
		}

		if (!(this.list.getFocus().length || this.list.getSelection().length)) {
			this.list.focusNext();
		}
		this.list.domFocus();
	}
}

export class DefaultPopularExtensionsView extends ExtensionsListView {

	override async show(): Promise<IPagedModel<IExtension>> {
		const query = this.extensionManagementServerService.webExtensionManagementServer && !this.extensionManagementServerService.localExtensionManagementServer && !this.extensionManagementServerService.remoteExtensionManagementServer ? '@web' : '';
		return super.show(query);
	}

}

export class ServerInstalledExtensionsView extends ExtensionsListView {

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		query = query ? query : '@installed';
		if (!ExtensionsListView.isLocalExtensionsQuery(query) || ExtensionsListView.isSortInstalledExtensionsQuery(query)) {
			query = query += ' @installed';
		}
		return super.show(query.trim());
	}

}

export class EnabledExtensionsView extends ExtensionsListView {

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		query = query || '@enabled';
		return ExtensionsListView.isEnabledExtensionsQuery(query) ? super.show(query) :
			ExtensionsListView.isSortInstalledExtensionsQuery(query) ? super.show('@enabled ' + query) : this.showEmptyModel();
	}
}

export class DisabledExtensionsView extends ExtensionsListView {

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		query = query || '@disabled';
		return ExtensionsListView.isDisabledExtensionsQuery(query) ? super.show(query) :
			ExtensionsListView.isSortInstalledExtensionsQuery(query) ? super.show('@disabled ' + query) : this.showEmptyModel();
	}
}

export class OutdatedExtensionsView extends ExtensionsListView {

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		query = query ? query : '@outdated';
		if (ExtensionsListView.isSearchExtensionUpdatesQuery(query)) {
			query = query.replace('@updates', '@outdated');
		}
		return super.show(query.trim());
	}

	protected override updateSize() {
		super.updateSize();
		this.setExpanded(this.count() > 0);
	}

}

export class RecentlyUpdatedExtensionsView extends ExtensionsListView {

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		query = query ? query : '@recentlyUpdated';
		if (ExtensionsListView.isSearchExtensionUpdatesQuery(query)) {
			query = query.replace('@updates', '@recentlyUpdated');
		}
		return super.show(query.trim());
	}

}

export interface StaticQueryExtensionsViewOptions extends ExtensionsListViewOptions {
	readonly query: string;
}

export class StaticQueryExtensionsView extends ExtensionsListView {

	constructor(
		protected override readonly options: StaticQueryExtensionsViewOptions,
		viewletViewOptions: IViewletViewOptions,
		@INotificationService notificationService: INotificationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IExtensionService extensionService: IExtensionService,
		@IExtensionsWorkbenchService extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionRecommendationsService extensionRecommendationsService: IExtensionRecommendationsService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IExtensionManagementServerService extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionManifestPropertiesService extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkspaceContextService workspaceService: IWorkspaceContextService,
		@IProductService productService: IProductService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IStorageService storageService: IStorageService,
		@IWorkspaceTrustManagementService workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkbenchExtensionEnablementService extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionFeaturesManagementService extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService
	) {
		super(options, viewletViewOptions, notificationService, keybindingService, contextMenuService, instantiationService, themeService, extensionService,
			extensionsWorkbenchService, extensionRecommendationsService, telemetryService, hoverService, configurationService, contextService, extensionManagementServerService,
			extensionManifestPropertiesService, extensionManagementService, workspaceService, productService, contextKeyService, viewDescriptorService, openerService,
			storageService, workspaceTrustManagementService, extensionEnablementService, extensionFeaturesManagementService,
			uriIdentityService, logService);
	}

	override show(): Promise<IPagedModel<IExtension>> {
		return super.show(this.options.query);
	}
}

function toSpecificWorkspaceUnsupportedQuery(query: string, qualifier: string): string | undefined {
	if (!query) {
		return '@workspaceUnsupported:' + qualifier;
	}
	const match = query.match(new RegExp(`@workspaceUnsupported(:${qualifier})?(\\s|$)`, 'i'));
	if (match) {
		if (!match[1]) {
			return query.replace(/@workspaceUnsupported/gi, '@workspaceUnsupported:' + qualifier);
		}
		return query;
	}
	return undefined;
}


export class UntrustedWorkspaceUnsupportedExtensionsView extends ExtensionsListView {
	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const updatedQuery = toSpecificWorkspaceUnsupportedQuery(query, 'untrusted');
		return updatedQuery ? super.show(updatedQuery) : this.showEmptyModel();
	}
}

export class UntrustedWorkspacePartiallySupportedExtensionsView extends ExtensionsListView {
	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const updatedQuery = toSpecificWorkspaceUnsupportedQuery(query, 'untrustedPartial');
		return updatedQuery ? super.show(updatedQuery) : this.showEmptyModel();
	}
}

export class VirtualWorkspaceUnsupportedExtensionsView extends ExtensionsListView {
	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const updatedQuery = toSpecificWorkspaceUnsupportedQuery(query, 'virtual');
		return updatedQuery ? super.show(updatedQuery) : this.showEmptyModel();
	}
}

export class VirtualWorkspacePartiallySupportedExtensionsView extends ExtensionsListView {
	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const updatedQuery = toSpecificWorkspaceUnsupportedQuery(query, 'virtualPartial');
		return updatedQuery ? super.show(updatedQuery) : this.showEmptyModel();
	}
}

export class DeprecatedExtensionsView extends ExtensionsListView {
	override async show(query: string): Promise<IPagedModel<IExtension>> {
		return ExtensionsListView.isSearchDeprecatedExtensionsQuery(query) ? super.show(query) : this.showEmptyModel();
	}
}

export class SearchMarketplaceExtensionsView extends ExtensionsListView {

	private readonly reportSearchFinishedDelayer = this._register(new ThrottledDelayer(2000));
	private searchWaitPromise: Promise<void> = Promise.resolve();

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const queryPromise = super.show(query);
		this.reportSearchFinishedDelayer.trigger(() => this.reportSearchFinished());
		this.searchWaitPromise = queryPromise.then(null, null);
		return queryPromise;
	}

	private async reportSearchFinished(): Promise<void> {
		await this.searchWaitPromise;
		this.telemetryService.publicLog2('extensionsView:MarketplaceSearchFinished');
	}
}

export class DefaultRecommendedExtensionsView extends ExtensionsListView {
	private readonly recommendedExtensionsQuery = '@recommended:all';

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._register(this.extensionRecommendationsService.onDidChangeRecommendations(() => {
			this.show('');
		}));
	}

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		if (query && query.trim() !== this.recommendedExtensionsQuery) {
			return this.showEmptyModel();
		}
		const model = await super.show(this.recommendedExtensionsQuery);
		if (!this.extensionsWorkbenchService.local.some(e => !e.isBuiltin)) {
			// This is part of popular extensions view. Collapse if no installed extensions.
			this.setExpanded(model.length > 0);
		}
		return model;
	}

}

export class RecommendedExtensionsView extends ExtensionsListView {
	private readonly recommendedExtensionsQuery = '@recommended';

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._register(this.extensionRecommendationsService.onDidChangeRecommendations(() => {
			this.show('');
		}));
	}

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		return (query && query.trim() !== this.recommendedExtensionsQuery) ? this.showEmptyModel() : super.show(this.recommendedExtensionsQuery);
	}
}

export class WorkspaceRecommendedExtensionsView extends ExtensionsListView implements IWorkspaceRecommendedExtensionsView {
	private readonly recommendedExtensionsQuery = '@recommended:workspace';

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._register(this.extensionRecommendationsService.onDidChangeRecommendations(() => this.show(this.recommendedExtensionsQuery)));
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.show(this.recommendedExtensionsQuery)));
	}

	override async show(query: string): Promise<IPagedModel<IExtension>> {
		const shouldShowEmptyView = query && query.trim() !== '@recommended' && query.trim() !== '@recommended:workspace';
		const model = await (shouldShowEmptyView ? this.showEmptyModel() : super.show(this.recommendedExtensionsQuery));
		this.setExpanded(model.length > 0);
		return model;
	}

	private async getInstallableWorkspaceRecommendations(): Promise<IExtension[]> {
		const installed = (await this.extensionsWorkbenchService.queryLocal())
			.filter(l => l.enablementState !== EnablementState.DisabledByExtensionKind); // Filter extensions disabled by kind
		const recommendations = (await this.getWorkspaceRecommendations())
			.filter(recommendation => installed.every(local => isString(recommendation) ? !areSameExtensions({ id: recommendation }, local.identifier) : !this.uriIdentityService.extUri.isEqual(recommendation, local.local?.location)));
		return this.getInstallableRecommendations(recommendations, { source: 'install-all-workspace-recommendations' }, CancellationToken.None);
	}

	async installWorkspaceRecommendations(): Promise<void> {
		const installableRecommendations = await this.getInstallableWorkspaceRecommendations();
		if (installableRecommendations.length) {
			const galleryExtensions: InstallExtensionInfo[] = [];
			const resourceExtensions: IExtension[] = [];
			for (const recommendation of installableRecommendations) {
				if (recommendation.gallery) {
					galleryExtensions.push({ extension: recommendation.gallery, options: {} });
				} else {
					resourceExtensions.push(recommendation);
				}
			}
			await Promise.all([
				this.extensionManagementService.installGalleryExtensions(galleryExtensions),
				...resourceExtensions.map(extension => this.extensionsWorkbenchService.install(extension))
			]);
		} else {
			this.notificationService.notify({
				severity: Severity.Info,
				message: localize('no local extensions', "There are no extensions to install.")
			});
		}
	}

}

export class PreferredExtensionsPagedModel implements IPagedModel<IExtension> {

	private readonly resolved = new Map<number, IExtension>();
	private preferredGalleryExtensions = new Set<string>();
	private resolvedGalleryExtensionsFromQuery: IExtension[] = [];
	private readonly pages: Array<{
		promise: Promise<void> | null;
		cts: CancellationTokenSource | null;
		promiseIndexes: Set<number>;
	}>;

	public readonly length: number;

	get onDidIncrementLength(): Event<number> {
		return Event.None;
	}

	constructor(
		private readonly preferredExtensions: IExtension[],
		private readonly pager: IPager<IExtension>,
	) {
		for (let i = 0; i < this.preferredExtensions.length; i++) {
			this.resolved.set(i, this.preferredExtensions[i]);
		}

		for (const e of preferredExtensions) {
			if (e.identifier.uuid) {
				this.preferredGalleryExtensions.add(e.identifier.uuid);
			}
		}

		// expected that all preferred gallery extensions will be part of the query results
		this.length = (preferredExtensions.length - this.preferredGalleryExtensions.size) + this.pager.total;

		const totalPages = Math.ceil(this.pager.total / this.pager.pageSize);
		this.populateResolvedExtensions(0, this.pager.firstPage);
		this.pages = range(totalPages - 1).map(() => ({
			promise: null,
			cts: null,
			promiseIndexes: new Set<number>(),
		}));
	}

	isResolved(index: number): boolean {
		return this.resolved.has(index);
	}

	get(index: number): IExtension {
		return this.resolved.get(index)!;
	}

	async resolve(index: number, cancellationToken: CancellationToken): Promise<IExtension> {
		if (cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		if (this.isResolved(index)) {
			return this.get(index);
		}

		const indexInPagedModel = index - this.preferredExtensions.length + this.resolvedGalleryExtensionsFromQuery.length;
		const pageIndex = Math.floor(indexInPagedModel / this.pager.pageSize);
		const page = this.pages[pageIndex];

		if (!page.promise) {
			page.cts = new CancellationTokenSource();
			page.promise = this.pager.getPage(pageIndex, page.cts.token)
				.then(extensions => this.populateResolvedExtensions(pageIndex, extensions))
				.catch(e => { page.promise = null; throw e; })
				.finally(() => page.cts = null);
		}

		const listener = cancellationToken.onCancellationRequested(() => {
			if (!page.cts) {
				return;
			}
			page.promiseIndexes.delete(index);
			if (page.promiseIndexes.size === 0) {
				page.cts.cancel();
			}
		});

		page.promiseIndexes.add(index);

		try {
			await page.promise;
		} finally {
			listener.dispose();
		}

		return this.get(index);
	}

	private populateResolvedExtensions(pageIndex: number, extensions: IExtension[]): void {
		let adjustIndexOfNextPagesBy = 0;
		const pageStartIndex = pageIndex * this.pager.pageSize;
		for (let i = 0; i < extensions.length; i++) {
			const e = extensions[i];
			if (e.gallery?.identifier.uuid && this.preferredGalleryExtensions.has(e.gallery.identifier.uuid)) {
				this.resolvedGalleryExtensionsFromQuery.push(e);
				adjustIndexOfNextPagesBy++;
			} else {
				this.resolved.set(this.preferredExtensions.length - this.resolvedGalleryExtensionsFromQuery.length + pageStartIndex + i, e);
			}
		}
		// If this page has preferred gallery extensions, then adjust the index of the next pages
		// by the number of preferred gallery extensions found in this page. Because these preferred extensions
		// are already in the resolved list and since we did not add them now, we need to adjust the indices of the next pages.
		// Skip first page as the preferred extensions are always in the first page
		if (pageIndex !== 0 && adjustIndexOfNextPagesBy) {
			const nextPageStartIndex = (pageIndex + 1) * this.pager.pageSize;
			const indices = [...this.resolved.keys()].sort();
			for (const index of indices) {
				if (index >= nextPageStartIndex) {
					const e = this.resolved.get(index);
					if (e) {
						this.resolved.delete(index);
						this.resolved.set(index - adjustIndexOfNextPagesBy, e);
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionsWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionsWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/extensionsWidgets.css';
import * as semver from '../../../../base/common/semver/semver.js';
import { Disposable, toDisposable, DisposableStore, MutableDisposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { IExtension, IExtensionsWorkbenchService, IExtensionContainer, ExtensionState, ExtensionEditorTab, IExtensionsViewState } from '../common/extensions.js';
import { append, $, reset, addDisposableListener, EventType, finalHandler } from '../../../../base/browser/dom.js';
import * as platform from '../../../../base/common/platform.js';
import { localize } from '../../../../nls.js';
import { IExtensionManagementServerService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionIgnoredRecommendationsService, IExtensionRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { extensionButtonProminentBackground, ExtensionStatusAction } from './extensionsActions.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { EXTENSION_BADGE_BACKGROUND, EXTENSION_BADGE_FOREGROUND } from '../../../common/theme.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { activationTimeIcon, errorIcon, infoIcon, installCountIcon, preReleaseIcon, privateExtensionIcon, ratingIcon, remoteIcon, sponsorIcon, starEmptyIcon, starFullIcon, starHalfIcon, syncIgnoredIcon, warningIcon } from './extensionsIcons.js';
import { registerColor, textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { createCommandUri, MarkdownString } from '../../../../base/common/htmlContent.js';
import { URI } from '../../../../base/common/uri.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import Severity from '../../../../base/common/severity.js';
import { Color } from '../../../../base/common/color.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { defaultCountBadgeStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IExtensionFeaturesManagementService, IExtensionFeaturesRegistry } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { extensionDefaultIcon, extensionVerifiedPublisherIconColor, verifiedPublisherIcon } from '../../../services/extensionManagement/common/extensionsIcons.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExplorerService } from '../../files/browser/files.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { VIEW_ID as EXPLORER_VIEW_ID } from '../../files/common/files.js';
import { IExtensionGalleryManifest, IExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export abstract class ExtensionWidget extends Disposable implements IExtensionContainer {
	private _extension: IExtension | null = null;
	get extension(): IExtension | null { return this._extension; }
	set extension(extension: IExtension | null) { this._extension = extension; this.update(); }
	update(): void { this.render(); }
	abstract render(): void;
}

export function onClick(element: HTMLElement, callback: () => void): IDisposable {
	const disposables: DisposableStore = new DisposableStore();
	disposables.add(addDisposableListener(element, EventType.CLICK, finalHandler(callback)));
	disposables.add(addDisposableListener(element, EventType.KEY_UP, e => {
		const keyboardEvent = new StandardKeyboardEvent(e);
		if (keyboardEvent.equals(KeyCode.Space) || keyboardEvent.equals(KeyCode.Enter)) {
			e.preventDefault();
			e.stopPropagation();
			callback();
		}
	}));
	return disposables;
}

export class ExtensionIconWidget extends ExtensionWidget {

	private readonly iconLoadingDisposable = this._register(new MutableDisposable());
	private readonly element: HTMLElement;
	private readonly iconElement: HTMLImageElement;
	private readonly defaultIconElement: HTMLElement;

	private iconUrl: string | undefined;

	constructor(
		container: HTMLElement,
	) {
		super();
		this.element = append(container, $('.extension-icon'));

		this.iconElement = append(this.element, $('img.icon', { alt: '' }));
		this.iconElement.style.display = 'none';

		this.defaultIconElement = append(this.element, $(ThemeIcon.asCSSSelector(extensionDefaultIcon)));
		this.defaultIconElement.style.display = 'none';

		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.iconUrl = undefined;
		this.iconElement.src = '';
		this.iconElement.style.display = 'none';
		this.defaultIconElement.style.display = 'none';
		this.iconLoadingDisposable.clear();
	}

	render(): void {
		if (!this.extension) {
			this.clear();
			return;
		}

		if (this.extension.iconUrl) {
			if (this.iconUrl !== this.extension.iconUrl) {
				this.iconElement.style.display = 'inherit';
				this.defaultIconElement.style.display = 'none';
				this.iconUrl = this.extension.iconUrl;
				this.iconLoadingDisposable.value = addDisposableListener(this.iconElement, 'error', () => {
					if (this.extension?.iconUrlFallback) {
						this.iconElement.src = this.extension.iconUrlFallback;
					} else {
						this.iconElement.style.display = 'none';
						this.defaultIconElement.style.display = 'inherit';
					}
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
			this.defaultIconElement.style.display = 'inherit';
			this.iconLoadingDisposable.clear();
		}
	}
}

export class InstallCountWidget extends ExtensionWidget {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();
		this.render();

		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.container.innerText = '';
		this.disposables.clear();
	}

	render(): void {
		this.clear();

		if (!this.extension) {
			return;
		}

		if (this.small && this.extension.state !== ExtensionState.Uninstalled) {
			return;
		}

		const installLabel = InstallCountWidget.getInstallLabel(this.extension, this.small);
		if (!installLabel) {
			return;
		}

		const parent = this.small ? this.container : append(this.container, $('span.install', { tabIndex: 0 }));
		append(parent, $('span' + ThemeIcon.asCSSSelector(installCountIcon)));
		const count = append(parent, $('span.count'));
		count.textContent = installLabel;

		if (!this.small) {
			this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.container, localize('install count', "Install count")));
		}
	}

	static getInstallLabel(extension: IExtension, small: boolean): string | undefined {
		const installCount = extension.installCount;

		if (!installCount) {
			return undefined;
		}

		let installLabel: string;

		if (small) {
			if (installCount > 1000000) {
				installLabel = `${Math.floor(installCount / 100000) / 10}M`;
			} else if (installCount > 1000) {
				installLabel = `${Math.floor(installCount / 1000)}K`;
			} else {
				installLabel = String(installCount);
			}
		}
		else {
			installLabel = installCount.toLocaleString(platform.language);
		}

		return installLabel;
	}
}

export class RatingsWidget extends ExtensionWidget {

	private containerHover: IManagedHover | undefined;
	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
		@IHoverService private readonly hoverService: IHoverService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();
		container.classList.add('extension-ratings');

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

		if (!this.extension) {
			return;
		}

		if (this.small && this.extension.state !== ExtensionState.Uninstalled) {
			return;
		}

		if (this.extension.rating === undefined) {
			return;
		}

		if (this.small && !this.extension.ratingCount) {
			return;
		}

		if (!this.extension.url) {
			return;
		}

		const rating = Math.round(this.extension.rating * 2) / 2;
		if (this.small) {
			append(this.container, $('span' + ThemeIcon.asCSSSelector(starFullIcon)));

			const count = append(this.container, $('span.count'));
			count.textContent = String(rating);
		} else {
			const element = append(this.container, $('span.rating.clickable', { tabIndex: 0 }));
			for (let i = 1; i <= 5; i++) {
				if (rating >= i) {
					append(element, $('span' + ThemeIcon.asCSSSelector(starFullIcon)));
				} else if (rating >= i - 0.5) {
					append(element, $('span' + ThemeIcon.asCSSSelector(starHalfIcon)));
				} else {
					append(element, $('span' + ThemeIcon.asCSSSelector(starEmptyIcon)));
				}
			}
			if (this.extension.ratingCount) {
				const ratingCountElemet = append(element, $('span', undefined, ` (${this.extension.ratingCount})`));
				ratingCountElemet.style.paddingLeft = '1px';
			}

			this.containerHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), element, ''));
			this.containerHover.update(localize('ratedLabel', "Average rating: {0} out of 5", rating));
			element.setAttribute('role', 'link');
			if (this.extension.ratingUrl) {
				this.disposables.add(onClick(element, () => this.openerService.open(URI.parse(this.extension!.ratingUrl!))));
			}
		}
	}

}

export class PublisherWidget extends ExtensionWidget {

	private element: HTMLElement | undefined;
	private containerHover: IManagedHover | undefined;

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
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
		if (!this.extension) {
			return;
		}

		if (this.extension.resourceExtension) {
			return;
		}

		if (this.extension.local?.source === 'resource') {
			return;
		}

		this.element = append(this.container, $('.publisher'));
		const publisherDisplayName = $('.publisher-name.ellipsis');
		publisherDisplayName.textContent = this.extension.publisherDisplayName;

		const verifiedPublisher = $('.verified-publisher');
		append(verifiedPublisher, $('span.extension-verified-publisher.clickable'), renderIcon(verifiedPublisherIcon));

		if (this.small) {
			if (this.extension.publisherDomain?.verified) {
				append(this.element, verifiedPublisher);
			}
			append(this.element, publisherDisplayName);
		} else {
			this.element.classList.toggle('clickable', !!this.extension.url);
			this.element.setAttribute('role', 'button');
			this.element.tabIndex = 0;

			this.containerHover = this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, localize('publisher', "Publisher ({0})", this.extension.publisherDisplayName)));
			append(this.element, publisherDisplayName);

			if (this.extension.publisherDomain?.verified) {
				append(this.element, verifiedPublisher);
				const publisherDomainLink = URI.parse(this.extension.publisherDomain.link);
				verifiedPublisher.tabIndex = 0;
				verifiedPublisher.setAttribute('role', 'button');
				this.containerHover.update(localize('verified publisher', "This publisher has verified ownership of {0}", this.extension.publisherDomain.link));
				verifiedPublisher.setAttribute('role', 'link');

				append(verifiedPublisher, $('span.extension-verified-publisher-domain', undefined, publisherDomainLink.authority.startsWith('www.') ? publisherDomainLink.authority.substring(4) : publisherDomainLink.authority));
				this.disposables.add(onClick(verifiedPublisher, () => this.openerService.open(publisherDomainLink)));
			}

			if (this.extension.url) {
				this.disposables.add(onClick(this.element, () => this.extensionsWorkbenchService.openSearch(`publisher:"${this.extension?.publisherDisplayName}"`)));
			}
		}

	}

}

export class SponsorWidget extends ExtensionWidget {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		@IHoverService private readonly hoverService: IHoverService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();
		this.render();
	}

	render(): void {
		reset(this.container);
		this.disposables.clear();
		if (!this.extension?.publisherSponsorLink) {
			return;
		}

		const sponsor = append(this.container, $('span.sponsor.clickable', { tabIndex: 0 }));
		this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), sponsor, this.extension?.publisherSponsorLink.toString() ?? ''));
		sponsor.setAttribute('role', 'link'); // #132645
		const sponsorIconElement = renderIcon(sponsorIcon);
		const label = $('span', undefined, localize('sponsor', "Sponsor"));
		append(sponsor, sponsorIconElement, label);
		this.disposables.add(onClick(sponsor, () => {
			this.openerService.open(this.extension!.publisherSponsorLink!);
		}));
	}
}

export class RecommendationWidget extends ExtensionWidget {

	private element?: HTMLElement;
	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private parent: HTMLElement,
		@IExtensionRecommendationsService private readonly extensionRecommendationsService: IExtensionRecommendationsService
	) {
		super();
		this.render();
		this._register(toDisposable(() => this.clear()));
		this._register(this.extensionRecommendationsService.onDidChangeRecommendations(() => this.render()));
	}

	private clear(): void {
		this.element?.remove();
		this.element = undefined;
		this.disposables.clear();
	}

	render(): void {
		this.clear();
		if (!this.extension || this.extension.state === ExtensionState.Installed || this.extension.deprecationInfo) {
			return;
		}
		const extRecommendations = this.extensionRecommendationsService.getAllRecommendationsWithReason();
		if (extRecommendations[this.extension.identifier.id.toLowerCase()]) {
			this.element = append(this.parent, $('div.extension-bookmark'));
			const recommendation = append(this.element, $('.recommendation'));
			append(recommendation, $('span' + ThemeIcon.asCSSSelector(ratingIcon)));
		}
	}

}

export class PreReleaseBookmarkWidget extends ExtensionWidget {

	private element?: HTMLElement;
	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private parent: HTMLElement,
	) {
		super();
		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.element?.remove();
		this.element = undefined;
		this.disposables.clear();
	}

	render(): void {
		this.clear();
		if (this.extension?.state === ExtensionState.Installed ? this.extension.preRelease : this.extension?.hasPreReleaseVersion) {
			this.element = append(this.parent, $('div.extension-bookmark'));
			const preRelease = append(this.element, $('.pre-release'));
			append(preRelease, $('span' + ThemeIcon.asCSSSelector(preReleaseIcon)));
		}
	}

}

export class RemoteBadgeWidget extends ExtensionWidget {

	private readonly remoteBadge = this._register(new MutableDisposable<ExtensionIconBadge>());

	private element: HTMLElement;

	constructor(
		parent: HTMLElement,
		private readonly tooltip: boolean,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.element = append(parent, $(''));
		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.remoteBadge.value?.element.remove();
		this.remoteBadge.clear();
	}

	render(): void {
		this.clear();
		if (!this.extension || !this.extension.local || !this.extension.server || !(this.extensionManagementServerService.localExtensionManagementServer && this.extensionManagementServerService.remoteExtensionManagementServer) || this.extension.server !== this.extensionManagementServerService.remoteExtensionManagementServer) {
			return;
		}
		let tooltip: string | undefined;
		if (this.tooltip && this.extensionManagementServerService.remoteExtensionManagementServer) {
			tooltip = localize('remote extension title', "Extension in {0}", this.extensionManagementServerService.remoteExtensionManagementServer.label);
		}
		this.remoteBadge.value = this.instantiationService.createInstance(ExtensionIconBadge, remoteIcon, tooltip);
		append(this.element, this.remoteBadge.value.element);
	}
}

export class ExtensionIconBadge extends Disposable {

	readonly element: HTMLElement;
	readonly elementHover: IManagedHover;

	constructor(
		private readonly icon: ThemeIcon,
		private readonly tooltip: string | undefined,
		@IHoverService hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService,
		@IThemeService private readonly themeService: IThemeService,
	) {
		super();
		this.element = $('div.extension-badge.extension-icon-badge');
		this.elementHover = this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, ''));
		this.render();
	}

	private render(): void {
		append(this.element, $('span' + ThemeIcon.asCSSSelector(this.icon)));

		const applyBadgeStyle = () => {
			if (!this.element) {
				return;
			}
			const bgColor = this.themeService.getColorTheme().getColor(EXTENSION_BADGE_BACKGROUND);
			const fgColor = this.themeService.getColorTheme().getColor(EXTENSION_BADGE_FOREGROUND);
			this.element.style.backgroundColor = bgColor ? bgColor.toString() : '';
			this.element.style.color = fgColor ? fgColor.toString() : '';
		};
		applyBadgeStyle();
		this._register(this.themeService.onDidColorThemeChange(() => applyBadgeStyle()));

		if (this.tooltip) {
			const updateTitle = () => {
				if (this.element) {
					this.elementHover.update(this.tooltip);
				}
			};
			this._register(this.labelService.onDidChangeFormatters(() => updateTitle()));
			updateTitle();
		}
	}
}

export class ExtensionPackCountWidget extends ExtensionWidget {

	private element: HTMLElement | undefined;
	private countBadge: CountBadge | undefined;

	constructor(
		private readonly parent: HTMLElement,
	) {
		super();
		this.render();
		this._register(toDisposable(() => this.clear()));
	}

	private clear(): void {
		this.element?.remove();
		this.countBadge?.dispose();
		this.countBadge = undefined;
	}

	render(): void {
		this.clear();
		if (!this.extension || !(this.extension.categories?.some(category => category.toLowerCase() === 'extension packs')) || !this.extension.extensionPack.length) {
			return;
		}
		this.element = append(this.parent, $('.extension-badge.extension-pack-badge'));
		this.countBadge = new CountBadge(this.element, {}, defaultCountBadgeStyles);
		this.countBadge.setCount(this.extension.extensionPack.length);
	}
}

export class ExtensionKindIndicatorWidget extends ExtensionWidget {

	private element: HTMLElement | undefined;
	private extensionGalleryManifest: IExtensionGalleryManifest | null = null;

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly container: HTMLElement,
		private small: boolean,
		@IHoverService private readonly hoverService: IHoverService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IViewsService private readonly viewsService: IViewsService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
	) {
		super();
		this.render();
		this._register(toDisposable(() => this.clear()));
		extensionGalleryManifestService.getExtensionGalleryManifest().then(manifest => {
			if (this._store.isDisposed) {
				return;
			}
			this.extensionGalleryManifest = manifest;
			this.render();
		});
	}

	private clear(): void {
		this.element?.remove();
		this.disposables.clear();
	}

	render(): void {
		this.clear();

		if (!this.extension) {
			return;
		}

		if (this.extension?.private) {
			this.element = append(this.container, $('.extension-kind-indicator'));
			if (!this.small || (this.extensionGalleryManifest?.capabilities.extensions?.includePublicExtensions && this.extensionGalleryManifest?.capabilities.extensions?.includePrivateExtensions)) {
				append(this.element, $('span' + ThemeIcon.asCSSSelector(privateExtensionIcon)));
			}
			if (!this.small) {
				append(this.element, $('span.private-extension-label', undefined, localize('privateExtension', "Private Extension")));
			}
			return;
		}

		if (!this.small) {
			return;
		}

		const location = this.extension.resourceExtension?.location ?? (this.extension.local?.source === 'resource' ? this.extension.local?.location : undefined);
		if (!location) {
			return;
		}

		this.element = append(this.container, $('.extension-kind-indicator'));
		const workspaceFolder = this.contextService.getWorkspaceFolder(location);
		if (workspaceFolder && this.extension.isWorkspaceScoped) {
			this.element.textContent = localize('workspace extension', "Workspace Extension");
			this.element.classList.add('clickable');
			this.element.setAttribute('role', 'button');
			this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, this.uriIdentityService.extUri.relativePath(workspaceFolder.uri, location)));
			this.disposables.add(onClick(this.element, () => {
				this.viewsService.openView(EXPLORER_VIEW_ID, true).then(() => this.explorerService.select(location, true));
			}));
		} else {
			this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, location.path));
			this.element.textContent = localize('local extension', "Local Extension");
		}
	}
}

export class SyncIgnoredWidget extends ExtensionWidget {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private readonly container: HTMLElement,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IHoverService private readonly hoverService: IHoverService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
	) {
		super();
		this._register(Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('settingsSync.ignoredExtensions'))(() => this.render()));
		this._register(userDataSyncEnablementService.onDidChangeEnablement(() => this.update()));
		this.render();
	}

	render(): void {
		this.disposables.clear();
		this.container.innerText = '';

		if (this.extension && this.extension.state === ExtensionState.Installed && this.userDataSyncEnablementService.isEnabled() && this.extensionsWorkbenchService.isExtensionIgnoredToSync(this.extension)) {
			const element = append(this.container, $('span.extension-sync-ignored' + ThemeIcon.asCSSSelector(syncIgnoredIcon)));
			this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), element, localize('syncingore.label', "This extension is ignored during sync.")));
			element.classList.add(...ThemeIcon.asClassNameArray(syncIgnoredIcon));
		}
	}
}

export class ExtensionRuntimeStatusWidget extends ExtensionWidget {

	constructor(
		private readonly extensionViewState: IExtensionsViewState,
		private readonly container: HTMLElement,
		@IExtensionService extensionService: IExtensionService,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
	) {
		super();
		this._register(extensionService.onDidChangeExtensionsStatus(extensions => {
			if (this.extension && extensions.some(e => areSameExtensions({ id: e.value }, this.extension!.identifier))) {
				this.update();
			}
		}));
		this._register(extensionFeaturesManagementService.onDidChangeAccessData(e => {
			if (this.extension && ExtensionIdentifier.equals(this.extension.identifier.id, e.extension)) {
				this.update();
			}
		}));
	}

	render(): void {
		this.container.innerText = '';

		if (!this.extension) {
			return;
		}

		if (this.extensionViewState.filters.featureId && this.extension.state === ExtensionState.Installed) {
			const accessData = this.extensionFeaturesManagementService.getAllAccessDataForExtension(new ExtensionIdentifier(this.extension.identifier.id)).get(this.extensionViewState.filters.featureId);
			const feature = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).getExtensionFeature(this.extensionViewState.filters.featureId);
			if (feature?.icon && accessData) {
				const featureAccessTimeElement = append(this.container, $('span.activationTime'));
				featureAccessTimeElement.textContent = localize('feature access label', "{0} reqs", accessData.accessTimes.length);
				const iconElement = append(this.container, $('span' + ThemeIcon.asCSSSelector(feature.icon)));
				iconElement.style.paddingLeft = '4px';
				return;
			}
		}

		const extensionStatus = this.extensionsWorkbenchService.getExtensionRuntimeStatus(this.extension);
		if (extensionStatus?.activationTimes) {
			const activationTime = extensionStatus.activationTimes.codeLoadingTime + extensionStatus.activationTimes.activateCallTime;
			append(this.container, $('span' + ThemeIcon.asCSSSelector(activationTimeIcon)));
			const activationTimeElement = append(this.container, $('span.activationTime'));
			activationTimeElement.textContent = `${activationTime}ms`;
		}
	}

}

export type ExtensionHoverOptions = {
	position: () => HoverPosition;
	readonly target: HTMLElement;
};

export class ExtensionHoverWidget extends ExtensionWidget {

	private readonly hover = this._register(new MutableDisposable<IDisposable>());

	constructor(
		private readonly options: ExtensionHoverOptions,
		private readonly extensionStatusAction: ExtensionStatusAction,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionRecommendationsService private readonly extensionRecommendationsService: IExtensionRecommendationsService,
		@IThemeService private readonly themeService: IThemeService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
	) {
		super();
	}

	render(): void {
		this.hover.value = undefined;
		if (this.extension) {
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
		if (!this.extension) {
			return undefined;
		}
		const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });

		markdown.appendMarkdown(`**${this.extension.displayName}**`);
		if (semver.valid(this.extension.version)) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">**&nbsp;_v${this.extension.version}${(this.extension.isPreReleaseVersion ? ' (pre-release)' : '')}_**&nbsp;</span>`);
		}
		markdown.appendText(`\n`);

		let addSeparator = false;
		if (this.extension.private) {
			markdown.appendMarkdown(`$(${privateExtensionIcon.id}) ${localize('privateExtension', "Private Extension")}`);
			addSeparator = true;
		}
		if (this.extension.state === ExtensionState.Installed) {
			const installLabel = InstallCountWidget.getInstallLabel(this.extension, true);
			if (installLabel) {
				if (addSeparator) {
					markdown.appendText(`  |  `);
				}
				markdown.appendMarkdown(`$(${installCountIcon.id}) ${installLabel}`);
				addSeparator = true;
			}
			if (this.extension.rating) {
				if (addSeparator) {
					markdown.appendText(`  |  `);
				}
				const rating = Math.round(this.extension.rating * 2) / 2;
				markdown.appendMarkdown(`$(${starFullIcon.id}) [${rating}](${this.extension.url}&ssr=false#review-details)`);
				addSeparator = true;
			}
			if (this.extension.publisherSponsorLink) {
				if (addSeparator) {
					markdown.appendText(`  |  `);
				}
				markdown.appendMarkdown(`$(${sponsorIcon.id}) [${localize('sponsor', "Sponsor")}](${this.extension.publisherSponsorLink})`);
				addSeparator = true;
			}
		}
		if (addSeparator) {
			markdown.appendText(`\n`);
		}

		const location = this.extension.resourceExtension?.location ?? (this.extension.local?.source === 'resource' ? this.extension.local?.location : undefined);
		if (location) {
			if (this.extension.isWorkspaceScoped && this.contextService.isInsideWorkspace(location)) {
				markdown.appendMarkdown(localize('workspace extension', "Workspace Extension"));
			} else {
				markdown.appendMarkdown(localize('local extension', "Local Extension"));
			}
			markdown.appendText(`\n`);
		}

		if (this.extension.description) {
			markdown.appendMarkdown(`${this.extension.description}`);
			markdown.appendText(`\n`);
		}

		if (this.extension.publisherDomain?.verified) {
			const bgColor = this.themeService.getColorTheme().getColor(extensionVerifiedPublisherIconColor);
			const publisherVerifiedTooltip = localize('publisher verified tooltip', "This publisher has verified ownership of {0}", `[${URI.parse(this.extension.publisherDomain.link).authority}](${this.extension.publisherDomain.link})`);
			markdown.appendMarkdown(`<span style="color:${bgColor ? Color.Format.CSS.formatHex(bgColor) : '#ffffff'};">$(${verifiedPublisherIcon.id})</span>&nbsp;${publisherVerifiedTooltip}`);
			markdown.appendText(`\n`);
		}

		if (this.extension.outdated) {
			markdown.appendMarkdown(localize('updateRequired', "Latest version:"));
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">**&nbsp;_v${this.extension.latestVersion}_**&nbsp;</span>`);
			markdown.appendText(`\n`);
		}

		const preReleaseMessage = ExtensionHoverWidget.getPreReleaseMessage(this.extension);
		const extensionRuntimeStatus = this.extensionsWorkbenchService.getExtensionRuntimeStatus(this.extension);
		const extensionFeaturesAccessData = this.extensionFeaturesManagementService.getAllAccessDataForExtension(new ExtensionIdentifier(this.extension.identifier.id));
		const extensionStatus = this.extensionStatusAction.status;
		const runtimeState = this.extension.runtimeState;
		const recommendationMessage = this.getRecommendationMessage(this.extension);

		if (extensionRuntimeStatus || extensionFeaturesAccessData.size || extensionStatus.length || runtimeState || recommendationMessage || preReleaseMessage) {

			markdown.appendMarkdown(`---`);
			markdown.appendText(`\n`);

			if (extensionRuntimeStatus) {
				if (extensionRuntimeStatus.activationTimes) {
					const activationTime = extensionRuntimeStatus.activationTimes.codeLoadingTime + extensionRuntimeStatus.activationTimes.activateCallTime;
					markdown.appendMarkdown(`${localize('activation', "Activation time")}${extensionRuntimeStatus.activationTimes.activationReason.startup ? ` (${localize('startup', "Startup")})` : ''}: \`${activationTime}ms\``);
					markdown.appendText(`\n`);
				}
				if (extensionRuntimeStatus.runtimeErrors.length || extensionRuntimeStatus.messages.length) {
					const hasErrors = extensionRuntimeStatus.runtimeErrors.length || extensionRuntimeStatus.messages.some(message => message.type === Severity.Error);
					const hasWarnings = extensionRuntimeStatus.messages.some(message => message.type === Severity.Warning);
					const errorsLink = extensionRuntimeStatus.runtimeErrors.length ? `[${extensionRuntimeStatus.runtimeErrors.length === 1 ? localize('uncaught error', '1 uncaught error') : localize('uncaught errors', '{0} uncaught errors', extensionRuntimeStatus.runtimeErrors.length)}](${createCommandUri('extension.open', this.extension.identifier.id, ExtensionEditorTab.Features)})` : undefined;
					const messageLink = extensionRuntimeStatus.messages.length ? `[${extensionRuntimeStatus.messages.length === 1 ? localize('message', '1 message') : localize('messages', '{0} messages', extensionRuntimeStatus.messages.length)}](${createCommandUri('extension.open', this.extension.identifier.id, ExtensionEditorTab.Features)})` : undefined;
					markdown.appendMarkdown(`$(${hasErrors ? errorIcon.id : hasWarnings ? warningIcon.id : infoIcon.id}) This extension has reported `);
					if (errorsLink && messageLink) {
						markdown.appendMarkdown(`${errorsLink} and ${messageLink}`);
					} else {
						markdown.appendMarkdown(`${errorsLink || messageLink}`);
					}
					markdown.appendText(`\n`);
				}
			}

			if (extensionFeaturesAccessData.size) {
				const registry = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry);
				for (const [featureId, accessData] of extensionFeaturesAccessData) {
					if (accessData?.accessTimes.length) {
						const feature = registry.getExtensionFeature(featureId);
						if (feature) {
							markdown.appendMarkdown(localize('feature usage label', "{0} usage", feature.label));
							markdown.appendMarkdown(`: [${localize('total', "{0} {1} requests in last 30 days", accessData.accessTimes.length, feature.accessDataLabel ?? feature.label)}](${createCommandUri('extension.open', this.extension.identifier.id, ExtensionEditorTab.Features)})`);
							markdown.appendText(`\n`);
						}
					}
				}
			}

			for (const status of extensionStatus) {
				if (status.icon) {
					markdown.appendMarkdown(`$(${status.icon.id})&nbsp;`);
				}
				markdown.appendMarkdown(status.message.value);
				markdown.appendText(`\n`);
			}

			if (runtimeState) {
				markdown.appendMarkdown(`$(${infoIcon.id})&nbsp;`);
				markdown.appendMarkdown(`${runtimeState.reason}`);
				markdown.appendText(`\n`);
			}

			if (preReleaseMessage) {
				const extensionPreReleaseIcon = this.themeService.getColorTheme().getColor(extensionPreReleaseIconColor);
				markdown.appendMarkdown(`<span style="color:${extensionPreReleaseIcon ? Color.Format.CSS.formatHex(extensionPreReleaseIcon) : '#ffffff'};">$(${preReleaseIcon.id})</span>&nbsp;${preReleaseMessage}`);
				markdown.appendText(`\n`);
			}

			if (recommendationMessage) {
				markdown.appendMarkdown(recommendationMessage);
				markdown.appendText(`\n`);
			}
		}

		return markdown;
	}

	private getRecommendationMessage(extension: IExtension): string | undefined {
		if (extension.state === ExtensionState.Installed) {
			return undefined;
		}
		if (extension.deprecationInfo) {
			return undefined;
		}
		const recommendation = this.extensionRecommendationsService.getAllRecommendationsWithReason()[extension.identifier.id.toLowerCase()];
		if (!recommendation?.reasonText) {
			return undefined;
		}
		const bgColor = this.themeService.getColorTheme().getColor(extensionButtonProminentBackground);
		return `<span style="color:${bgColor ? Color.Format.CSS.formatHex(bgColor) : '#ffffff'};">$(${starEmptyIcon.id})</span>&nbsp;${recommendation.reasonText}`;
	}

	static getPreReleaseMessage(extension: IExtension): string | undefined {
		if (!extension.hasPreReleaseVersion) {
			return undefined;
		}
		if (extension.isBuiltin) {
			return undefined;
		}
		if (extension.isPreReleaseVersion) {
			return undefined;
		}
		if (extension.preRelease) {
			return undefined;
		}
		const preReleaseVersionLink = `[${localize('Show prerelease version', "Pre-Release version")}](${createCommandUri('workbench.extensions.action.showPreReleaseVersion', extension.identifier.id)})`;
		return localize('has prerelease', "This extension has a {0} available", preReleaseVersionLink);
	}

}

export class ExtensionStatusWidget extends ExtensionWidget {

	private readonly renderDisposables = this._register(new MutableDisposable());

	private readonly _onDidRender = this._register(new Emitter<void>());
	readonly onDidRender: Event<void> = this._onDidRender.event;

	constructor(
		private readonly container: HTMLElement,
		private readonly extensionStatusAction: ExtensionStatusAction,
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
			append(this.container, rendered.element);
		}
		this._onDidRender.fire();
	}
}

export class ExtensionRecommendationWidget extends ExtensionWidget {

	private readonly _onDidRender = this._register(new Emitter<void>());
	readonly onDidRender: Event<void> = this._onDidRender.event;

	constructor(
		private readonly container: HTMLElement,
		@IExtensionRecommendationsService private readonly extensionRecommendationsService: IExtensionRecommendationsService,
		@IExtensionIgnoredRecommendationsService private readonly extensionIgnoredRecommendationsService: IExtensionIgnoredRecommendationsService,
	) {
		super();
		this.render();
		this._register(this.extensionRecommendationsService.onDidChangeRecommendations(() => this.render()));
	}

	render(): void {
		reset(this.container);
		const recommendationStatus = this.getRecommendationStatus();
		if (recommendationStatus) {
			if (recommendationStatus.icon) {
				append(this.container, $(`div${ThemeIcon.asCSSSelector(recommendationStatus.icon)}`));
			}
			append(this.container, $(`div.recommendation-text`, undefined, recommendationStatus.message));
		}
		this._onDidRender.fire();
	}

	private getRecommendationStatus(): { icon: ThemeIcon | undefined; message: string } | undefined {
		if (!this.extension
			|| this.extension.deprecationInfo
			|| this.extension.state === ExtensionState.Installed
		) {
			return undefined;
		}
		const extRecommendations = this.extensionRecommendationsService.getAllRecommendationsWithReason();
		if (extRecommendations[this.extension.identifier.id.toLowerCase()]) {
			const reasonText = extRecommendations[this.extension.identifier.id.toLowerCase()].reasonText;
			if (reasonText) {
				return { icon: starEmptyIcon, message: reasonText };
			}
		} else if (this.extensionIgnoredRecommendationsService.globalIgnoredRecommendations.indexOf(this.extension.identifier.id.toLowerCase()) !== -1) {
			return { icon: undefined, message: localize('recommendationHasBeenIgnored', "You have chosen not to receive recommendations for this extension.") };
		}
		return undefined;
	}
}

export const extensionRatingIconColor = registerColor('extensionIcon.starForeground', { light: '#DF6100', dark: '#FF8E00', hcDark: '#FF8E00', hcLight: textLinkForeground }, localize('extensionIconStarForeground', "The icon color for extension ratings."), false);
export const extensionPreReleaseIconColor = registerColor('extensionIcon.preReleaseForeground', { dark: '#1d9271', light: '#1d9271', hcDark: '#1d9271', hcLight: textLinkForeground }, localize('extensionPreReleaseForeground', "The icon color for pre-release extension."), false);
export const extensionSponsorIconColor = registerColor('extensionIcon.sponsorForeground', { light: '#B51E78', dark: '#D758B3', hcDark: null, hcLight: '#B51E78' }, localize('extensionIcon.sponsorForeground', "The icon color for extension sponsor."), false);
export const extensionPrivateBadgeBackground = registerColor('extensionIcon.privateForeground', { dark: '#ffffff60', light: '#00000060', hcDark: '#ffffff60', hcLight: '#00000060' }, localize('extensionIcon.private', "The icon color for private extensions."));

registerThemingParticipant((theme, collector) => {
	const extensionRatingIcon = theme.getColor(extensionRatingIconColor);
	if (extensionRatingIcon) {
		collector.addRule(`.extension-ratings .codicon-extensions-star-full, .extension-ratings .codicon-extensions-star-half { color: ${extensionRatingIcon}; }`);
		collector.addRule(`.monaco-hover.extension-hover .markdown-hover .hover-contents ${ThemeIcon.asCSSSelector(starFullIcon)} { color: ${extensionRatingIcon}; }`);
	}

	const extensionVerifiedPublisherIcon = theme.getColor(extensionVerifiedPublisherIconColor);
	if (extensionVerifiedPublisherIcon) {
		collector.addRule(`${ThemeIcon.asCSSSelector(verifiedPublisherIcon)} { color: ${extensionVerifiedPublisherIcon}; }`);
	}

	collector.addRule(`.monaco-hover.extension-hover .markdown-hover .hover-contents ${ThemeIcon.asCSSSelector(sponsorIcon)} { color: var(--vscode-extensionIcon-sponsorForeground); }`);
	collector.addRule(`.extension-editor > .header > .details > .subtitle .sponsor ${ThemeIcon.asCSSSelector(sponsorIcon)} { color: var(--vscode-extensionIcon-sponsorForeground); }`);

	const privateBadgeBackground = theme.getColor(extensionPrivateBadgeBackground);
	if (privateBadgeBackground) {
		collector.addRule(`.extension-private-badge { color: ${privateBadgeBackground}; }`);
	}
});
```

--------------------------------------------------------------------------------

````

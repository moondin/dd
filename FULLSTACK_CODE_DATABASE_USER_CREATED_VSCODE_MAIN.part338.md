---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 338
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 338 of 552)

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

---[FILE: src/vs/workbench/browser/parts/views/treeView.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/treeView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers, IDragAndDropData } from '../../../../base/browser/dnd.js';
import * as DOM from '../../../../base/browser/dom.js';
import * as cssJs from '../../../../base/browser/cssValue.js';
import { IRenderedMarkdown, renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { ActionBar, IActionViewItemProvider } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ElementsDragAndDropData, ListViewTargetSector } from '../../../../base/browser/ui/list/listView.js';
import { IAsyncDataSource, ITreeContextMenuEvent, ITreeDragAndDrop, ITreeDragOverReaction, ITreeNode, ITreeRenderer, TreeDragOverBubble } from '../../../../base/browser/ui/tree/tree.js';
import { CollapseAllAction } from '../../../../base/browser/ui/tree/treeDefaults.js';
import { ActionRunner, IAction, Separator } from '../../../../base/common/actions.js';
import { timeout } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMatches, FuzzyScore } from '../../../../base/common/filters.js';
import { IMarkdownString, isMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename, dirname } from '../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import './media/views.css';
import { VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { localize } from '../../../../nls.js';
import { createActionViewItem, getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenuService, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKey, IContextKeyChangeEvent, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { FileThemeIcon, FolderThemeIcon, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { fillEditorsDragData } from '../../dnd.js';
import { IResourceLabel, ResourceLabels } from '../../labels.js';
import { API_OPEN_DIFF_EDITOR_COMMAND_ID, API_OPEN_EDITOR_COMMAND_ID } from '../editor/editorCommands.js';
import { getLocationBasedViewColors, IViewPaneOptions, ViewPane } from './viewPane.js';
import { IViewletViewOptions } from './viewsViewlet.js';
import { Extensions, ITreeItem, ITreeItemLabel, ITreeView, ITreeViewDataProvider, ITreeViewDescriptor, ITreeViewDragAndDropController, IViewBadge, IViewDescriptorService, IViewsRegistry, ResolvableTreeItem, TreeCommand, TreeItemCollapsibleState, TreeViewItemHandleArg, TreeViewPaneHandleArg, ViewContainer, ViewContainerLocation } from '../../../common/views.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { CodeDataTransfers, LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { toExternalVSDataTransfer } from '../../../../editor/browser/dataTransfer.js';
import { CheckboxStateHandler, TreeItemCheckbox } from './checkbox.js';
import { setTimeout0 } from '../../../../base/common/platform.js';
import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { TelemetryTrustedValue } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { ITreeViewsDnDService } from '../../../../editor/common/services/treeViewsDndService.js';
import { DraggedTreeItemsIdentifier } from '../../../../editor/common/services/treeViewsDnd.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import type { IManagedHoverTooltipMarkdownString } from '../../../../base/browser/ui/hover/hover.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IAccessibleViewInformationService } from '../../../services/accessibility/common/accessibleViewInformationService.js';
import { Command } from '../../../../editor/common/languages.js';

export class TreeViewPane extends ViewPane {

	protected readonly treeView: ITreeView;
	private _container: HTMLElement | undefined;
	private _actionRunner: MultipleSelectionActionRunner;

	constructor(
		options: IViewletViewOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IHoverService hoverService: IHoverService,
		@IAccessibleViewInformationService accessibleViewService: IAccessibleViewInformationService,
	) {
		super({ ...(options as IViewPaneOptions), titleMenuId: MenuId.ViewTitle, donotForwardArgs: false }, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService, accessibleViewService);
		const { treeView } = (<ITreeViewDescriptor>Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).getView(options.id));
		this.treeView = treeView;
		this._register(this.treeView.onDidChangeActions(() => this.updateActions(), this));
		this._register(this.treeView.onDidChangeTitle((newTitle) => this.updateTitle(newTitle)));
		this._register(this.treeView.onDidChangeDescription((newDescription) => this.updateTitleDescription(newDescription)));
		this._register(toDisposable(() => {
			if (this._container && this.treeView.container && (this._container === this.treeView.container)) {
				this.treeView.setVisibility(false);
			}
		}));
		this._register(this.onDidChangeBodyVisibility(() => this.updateTreeVisibility()));
		this._register(this.treeView.onDidChangeWelcomeState(() => this._onDidChangeViewWelcomeState.fire()));
		if (options.title !== this.treeView.title) {
			this.updateTitle(this.treeView.title);
		}
		if (options.titleDescription !== this.treeView.description) {
			this.updateTitleDescription(this.treeView.description);
		}
		this._actionRunner = this._register(new MultipleSelectionActionRunner(notificationService, () => this.treeView.getSelection()));

		this.updateTreeVisibility();
	}

	override focus(): void {
		super.focus();
		this.treeView.focus();
	}

	protected override renderBody(container: HTMLElement): void {
		this._container = container;
		super.renderBody(container);
		this.renderTreeView(container);
	}

	override shouldShowWelcome(): boolean {
		return ((this.treeView.dataProvider === undefined) || !!this.treeView.dataProvider.isTreeEmpty) && ((this.treeView.message === undefined) || (this.treeView.message === ''));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.layoutTreeView(height, width);
	}

	override getOptimalWidth(): number {
		return this.treeView.getOptimalWidth();
	}

	protected renderTreeView(container: HTMLElement): void {
		this.treeView.show(container);
	}

	protected layoutTreeView(height: number, width: number): void {
		this.treeView.layout(height, width);
	}

	private updateTreeVisibility(): void {
		this.treeView.setVisibility(this.isBodyVisible());
	}

	override getActionRunner() {
		return this._actionRunner;
	}

	override getActionsContext(): TreeViewPaneHandleArg {
		return { $treeViewId: this.id, $focusedTreeItem: true, $selectedTreeItems: true };
	}

}

class Root implements ITreeItem {
	label = { label: 'root' };
	handle = '0';
	parentHandle: string | undefined = undefined;
	collapsibleState = TreeItemCollapsibleState.Expanded;
	children: ITreeItem[] | undefined = undefined;
}

function commandPreconditions(commandId: string): ContextKeyExpression | undefined {
	const command = CommandsRegistry.getCommand(commandId);
	if (command) {
		const commandAction = MenuRegistry.getCommand(command.id);
		return commandAction?.precondition;
	}
	return undefined;
}

function isTreeCommandEnabled(treeCommand: TreeCommand | Command, contextKeyService: IContextKeyService): boolean {
	const commandId: string = (treeCommand as TreeCommand).originalId ? (treeCommand as TreeCommand).originalId! : treeCommand.id;
	const precondition = commandPreconditions(commandId);
	if (precondition) {
		return contextKeyService.contextMatchesRules(precondition);
	}

	return true;
}

interface RenderedMessage { element: HTMLElement; disposables: DisposableStore }

function isRenderedMessageValue(messageValue: string | RenderedMessage | undefined): messageValue is RenderedMessage {
	return !!messageValue && typeof messageValue !== 'string' && !!messageValue.element && !!messageValue.disposables;
}

const noDataProviderMessage = localize('no-dataprovider', "There is no data provider registered that can provide view data.");

export const RawCustomTreeViewContextKey = new RawContextKey<boolean>('customTreeView', false);

class Tree extends WorkbenchAsyncDataTree<ITreeItem, ITreeItem, FuzzyScore> { }

abstract class AbstractTreeView extends Disposable implements ITreeView {

	private isVisible: boolean = false;
	private _hasIconForParentNode = false;
	private _hasIconForLeafNode = false;

	private collapseAllContextKey: RawContextKey<boolean> | undefined;
	private collapseAllContext: IContextKey<boolean> | undefined;
	private collapseAllToggleContextKey: RawContextKey<boolean> | undefined;
	private collapseAllToggleContext: IContextKey<boolean> | undefined;
	private refreshContextKey: RawContextKey<boolean> | undefined;
	private refreshContext: IContextKey<boolean> | undefined;

	private focused: boolean = false;
	private domNode!: HTMLElement;
	private treeContainer: HTMLElement | undefined;
	private _messageValue: string | { element: HTMLElement; disposables: DisposableStore } | undefined;
	private _canSelectMany: boolean = false;
	private _manuallyManageCheckboxes: boolean = false;
	private messageElement: HTMLElement | undefined;
	private tree: Tree | undefined;
	private treeLabels: ResourceLabels | undefined;
	private treeViewDnd: CustomTreeViewDragAndDrop | undefined;
	private _container: HTMLElement | undefined;

	private root: ITreeItem;
	private elementsToRefresh: ITreeItem[] = [];
	private lastSelection: readonly ITreeItem[] = [];
	private lastActive: ITreeItem;

	private readonly _onDidExpandItem: Emitter<ITreeItem> = this._register(new Emitter<ITreeItem>());
	get onDidExpandItem(): Event<ITreeItem> { return this._onDidExpandItem.event; }

	private readonly _onDidCollapseItem: Emitter<ITreeItem> = this._register(new Emitter<ITreeItem>());
	get onDidCollapseItem(): Event<ITreeItem> { return this._onDidCollapseItem.event; }

	private _onDidChangeSelectionAndFocus: Emitter<{ selection: readonly ITreeItem[]; focus: ITreeItem }> = this._register(new Emitter<{ selection: readonly ITreeItem[]; focus: ITreeItem }>());
	get onDidChangeSelectionAndFocus(): Event<{ selection: readonly ITreeItem[]; focus: ITreeItem }> { return this._onDidChangeSelectionAndFocus.event; }

	private readonly _onDidChangeVisibility: Emitter<boolean> = this._register(new Emitter<boolean>());
	get onDidChangeVisibility(): Event<boolean> { return this._onDidChangeVisibility.event; }

	private readonly _onDidChangeActions: Emitter<void> = this._register(new Emitter<void>());
	get onDidChangeActions(): Event<void> { return this._onDidChangeActions.event; }

	private readonly _onDidChangeWelcomeState: Emitter<void> = this._register(new Emitter<void>());
	get onDidChangeWelcomeState(): Event<void> { return this._onDidChangeWelcomeState.event; }

	private readonly _onDidChangeTitle: Emitter<string> = this._register(new Emitter<string>());
	get onDidChangeTitle(): Event<string> { return this._onDidChangeTitle.event; }

	private readonly _onDidChangeDescription: Emitter<string | undefined> = this._register(new Emitter<string | undefined>());
	get onDidChangeDescription(): Event<string | undefined> { return this._onDidChangeDescription.event; }

	private readonly _onDidChangeCheckboxState: Emitter<readonly ITreeItem[]> = this._register(new Emitter<readonly ITreeItem[]>());
	get onDidChangeCheckboxState(): Event<readonly ITreeItem[]> { return this._onDidChangeCheckboxState.event; }

	private readonly _onDidCompleteRefresh: Emitter<void> = this._register(new Emitter<void>());

	constructor(
		readonly id: string,
		private _title: string,
		@IThemeService private readonly themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IProgressService protected readonly progressService: IProgressService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@INotificationService private readonly notificationService: INotificationService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IHoverService private readonly hoverService: IHoverService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IActivityService private readonly activityService: IActivityService,
		@ILogService private readonly logService: ILogService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
		this.root = new Root();
		this.lastActive = this.root;
		// Try not to add anything that could be costly to this constructor. It gets called once per tree view
		// during startup, and anything added here can affect performance.
	}

	private _isInitialized: boolean = false;
	private initialize() {
		if (this._isInitialized) {
			return;
		}
		this._isInitialized = true;

		// Remember when adding to this method that it isn't called until the view is visible, meaning that
		// properties could be set and events could be fired before we're initialized and that this needs to be handled.

		this.contextKeyService.bufferChangeEvents(() => {
			this.initializeShowCollapseAllAction();
			this.initializeCollapseAllToggle();
			this.initializeShowRefreshAction();
		});

		this.treeViewDnd = this.instantiationService.createInstance(CustomTreeViewDragAndDrop, this.id);
		if (this._dragAndDropController) {
			this.treeViewDnd.controller = this._dragAndDropController;
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('explorer.decorations')) {
				this.doRefresh([this.root]); /** soft refresh **/
			}
		}));
		this._register(this.viewDescriptorService.onDidChangeLocation(({ views, from, to }) => {
			if (views.some(v => v.id === this.id)) {
				this.tree?.updateOptions({ overrideStyles: getLocationBasedViewColors(this.viewLocation).listOverrideStyles });
			}
		}));
		this.registerActions();

		this.create();
	}

	get viewContainer(): ViewContainer {
		return this.viewDescriptorService.getViewContainerByViewId(this.id)!;
	}

	get viewLocation(): ViewContainerLocation {
		return this.viewDescriptorService.getViewLocationById(this.id)!;
	}
	private _dragAndDropController: ITreeViewDragAndDropController | undefined;
	get dragAndDropController(): ITreeViewDragAndDropController | undefined {
		return this._dragAndDropController;
	}
	set dragAndDropController(dnd: ITreeViewDragAndDropController | undefined) {
		this._dragAndDropController = dnd;
		if (this.treeViewDnd) {
			this.treeViewDnd.controller = dnd;
		}
	}

	private _dataProvider: ITreeViewDataProvider | undefined;
	get dataProvider(): ITreeViewDataProvider | undefined {
		return this._dataProvider;
	}

	set dataProvider(dataProvider: ITreeViewDataProvider | undefined) {
		if (dataProvider) {
			if (this.visible) {
				this.activate();
			}
			const self = this;
			this._dataProvider = new class implements ITreeViewDataProvider {
				private _isEmpty: boolean = true;
				private _onDidChangeEmpty: Emitter<void> = new Emitter();
				public onDidChangeEmpty: Event<void> = this._onDidChangeEmpty.event;

				get isTreeEmpty(): boolean {
					return this._isEmpty;
				}

				async getChildren(element?: ITreeItem): Promise<ITreeItem[] | undefined> {
					const batches = await this.getChildrenBatch(element ? [element] : undefined);
					return batches?.[0];
				}

				private updateEmptyState(nodes: ITreeItem[], childrenGroups: ITreeItem[][]): void {
					if ((nodes.length === 1) && (nodes[0] instanceof Root)) {
						const oldEmpty = this._isEmpty;
						this._isEmpty = (childrenGroups.length === 0) || (childrenGroups[0].length === 0);
						if (oldEmpty !== this._isEmpty) {
							this._onDidChangeEmpty.fire();
						}
					}
				}

				private findCheckboxesUpdated(nodes: ITreeItem[], childrenGroups: ITreeItem[][]): ITreeItem[] {
					if (childrenGroups.length === 0) {
						return [];
					}
					const checkboxesUpdated: ITreeItem[] = [];

					for (let i = 0; i < nodes.length; i++) {
						const node = nodes[i];
						const children = childrenGroups[i];
						for (const child of children) {
							child.parent = node;
							if (!self.manuallyManageCheckboxes && (node?.checkbox?.isChecked === true) && (child.checkbox?.isChecked === false)) {
								child.checkbox.isChecked = true;
								checkboxesUpdated.push(child);
							}
						}
					}
					return checkboxesUpdated;
				}

				async getChildrenBatch(nodes?: ITreeItem[]): Promise<ITreeItem[][]> {
					let childrenGroups: ITreeItem[][];
					let checkboxesUpdated: ITreeItem[] = [];
					if (nodes?.every((node): node is Required<ITreeItem & { children: ITreeItem[] }> => !!node.children)) {
						childrenGroups = nodes.map(node => node.children);
					} else {
						nodes = nodes ?? [self.root];
						const batchedChildren = await (nodes.length === 1 && nodes[0] instanceof Root ? doGetChildrenOrBatch(dataProvider, undefined) : doGetChildrenOrBatch(dataProvider, nodes));
						for (let i = 0; i < nodes.length; i++) {
							const node = nodes[i];
							node.children = batchedChildren ? batchedChildren[i] : undefined;
						}
						childrenGroups = batchedChildren ?? [];
						checkboxesUpdated = this.findCheckboxesUpdated(nodes, childrenGroups);
					}

					this.updateEmptyState(nodes, childrenGroups);

					if (checkboxesUpdated.length > 0) {
						self._onDidChangeCheckboxState.fire(checkboxesUpdated);
					}
					return childrenGroups;
				}
			};
			if (this._dataProvider.onDidChangeEmpty) {
				this._register(this._dataProvider.onDidChangeEmpty(() => {
					this.updateCollapseAllToggle();
					this._onDidChangeWelcomeState.fire();
				}));
			}
			this.updateMessage();
			this.refresh();
		} else {
			this._dataProvider = undefined;
			this.treeDisposables.clear();
			this.activated = false;
			this.updateMessage();
		}

		this._onDidChangeWelcomeState.fire();
	}

	private _message: string | IMarkdownString | undefined;
	get message(): string | IMarkdownString | undefined {
		return this._message;
	}

	set message(message: string | IMarkdownString | undefined) {
		this._message = message;
		this.updateMessage();
		this._onDidChangeWelcomeState.fire();
	}

	get title(): string {
		return this._title;
	}

	set title(name: string) {
		this._title = name;
		if (this.tree) {
			this.tree.ariaLabel = this._title;
		}
		this._onDidChangeTitle.fire(this._title);
	}

	private _description: string | undefined;
	get description(): string | undefined {
		return this._description;
	}

	set description(description: string | undefined) {
		this._description = description;
		this._onDidChangeDescription.fire(this._description);
	}

	private _badge: IViewBadge | undefined;
	private readonly _activity = this._register(new MutableDisposable<IDisposable>());

	get badge(): IViewBadge | undefined {
		return this._badge;
	}

	set badge(badge: IViewBadge | undefined) {

		if (this._badge?.value === badge?.value &&
			this._badge?.tooltip === badge?.tooltip) {
			return;
		}

		this._badge = badge;
		if (badge) {
			const activity = {
				badge: new NumberBadge(badge.value, () => badge.tooltip),
				priority: 50
			};
			this._activity.value = this.activityService.showViewActivity(this.id, activity);
		} else {
			this._activity.clear();
		}
	}

	get canSelectMany(): boolean {
		return this._canSelectMany;
	}

	set canSelectMany(canSelectMany: boolean) {
		const oldCanSelectMany = this._canSelectMany;
		this._canSelectMany = canSelectMany;
		if (this._canSelectMany !== oldCanSelectMany) {
			this.tree?.updateOptions({ multipleSelectionSupport: this.canSelectMany });
		}
	}

	get manuallyManageCheckboxes(): boolean {
		return this._manuallyManageCheckboxes;
	}

	set manuallyManageCheckboxes(manuallyManageCheckboxes: boolean) {
		this._manuallyManageCheckboxes = manuallyManageCheckboxes;
	}

	get hasIconForParentNode(): boolean {
		return this._hasIconForParentNode;
	}

	get hasIconForLeafNode(): boolean {
		return this._hasIconForLeafNode;
	}

	get visible(): boolean {
		return this.isVisible;
	}

	private initializeShowCollapseAllAction(startingValue: boolean = false) {
		if (!this.collapseAllContext) {
			this.collapseAllContextKey = new RawContextKey<boolean>(`treeView.${this.id}.enableCollapseAll`, startingValue, localize('treeView.enableCollapseAll', "Whether the tree view with id {0} enables collapse all.", this.id));
			this.collapseAllContext = this.collapseAllContextKey.bindTo(this.contextKeyService);
		}
		return true;
	}

	get showCollapseAllAction(): boolean {
		this.initializeShowCollapseAllAction();
		return !!this.collapseAllContext?.get();
	}

	set showCollapseAllAction(showCollapseAllAction: boolean) {
		this.initializeShowCollapseAllAction(showCollapseAllAction);
		this.collapseAllContext?.set(showCollapseAllAction);
	}


	private initializeShowRefreshAction(startingValue: boolean = false) {
		if (!this.refreshContext) {
			this.refreshContextKey = new RawContextKey<boolean>(`treeView.${this.id}.enableRefresh`, startingValue, localize('treeView.enableRefresh', "Whether the tree view with id {0} enables refresh.", this.id));
			this.refreshContext = this.refreshContextKey.bindTo(this.contextKeyService);
		}
	}

	get showRefreshAction(): boolean {
		this.initializeShowRefreshAction();
		return !!this.refreshContext?.get();
	}

	set showRefreshAction(showRefreshAction: boolean) {
		this.initializeShowRefreshAction(showRefreshAction);
		this.refreshContext?.set(showRefreshAction);
	}

	private registerActions() {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.treeView.${that.id}.refresh`,
					title: localize('refresh', "Refresh"),
					menu: {
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', that.id), that.refreshContextKey),
						group: 'navigation',
						order: Number.MAX_SAFE_INTEGER - 1,
					},
					icon: Codicon.refresh
				});
			}
			async run(): Promise<void> {
				return that.refresh();
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.treeView.${that.id}.collapseAll`,
					title: localize('collapseAll', "Collapse All"),
					menu: {
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', that.id), that.collapseAllContextKey),
						group: 'navigation',
						order: Number.MAX_SAFE_INTEGER,
					},
					precondition: that.collapseAllToggleContextKey,
					icon: Codicon.collapseAll
				});
			}
			async run(): Promise<void> {
				if (that.tree) {
					return new CollapseAllAction<ITreeItem, ITreeItem, FuzzyScore>(that.tree, true).run();
				}
			}
		}));
	}

	setVisibility(isVisible: boolean): void {
		// Throughout setVisibility we need to check if the tree view's data provider still exists.
		// This can happen because the `getChildren` call to the extension can return
		// after the tree has been disposed.

		this.initialize();
		isVisible = !!isVisible;
		if (this.isVisible === isVisible) {
			return;
		}

		this.isVisible = isVisible;

		if (this.tree) {
			if (this.isVisible) {
				DOM.show(this.tree.getHTMLElement());
			} else {
				DOM.hide(this.tree.getHTMLElement()); // make sure the tree goes out of the tabindex world by hiding it
			}

			if (this.isVisible && this.elementsToRefresh.length && this.dataProvider) {
				this.doRefresh(this.elementsToRefresh);
				this.elementsToRefresh = [];
			}
		}

		setTimeout0(() => {
			if (this.dataProvider) {
				this._onDidChangeVisibility.fire(this.isVisible);
			}
		});

		if (this.visible) {
			this.activate();
		}
	}

	protected activated: boolean = false;
	protected abstract activate(): void;

	focus(reveal: boolean = true, revealItem?: ITreeItem): void {
		if (this.tree && this.root.children && this.root.children.length > 0) {
			// Make sure the current selected element is revealed
			const element = revealItem ?? this.tree.getSelection()[0];
			if (element && reveal) {
				this.tree.reveal(element, 0.5);
			}

			// Pass Focus to Viewer
			this.tree.domFocus();
		} else if (this.tree && this.treeContainer && !this.treeContainer.classList.contains('hide')) {
			this.tree.domFocus();
		} else {
			this.domNode.focus();
		}
	}

	show(container: HTMLElement): void {
		this._container = container;
		DOM.append(container, this.domNode);
	}

	private create() {
		this.domNode = DOM.$('.tree-explorer-viewlet-tree-view');
		this.messageElement = DOM.append(this.domNode, DOM.$('.message'));
		this.updateMessage();
		this.treeContainer = DOM.append(this.domNode, DOM.$('.customview-tree'));
		this.treeContainer.classList.add('file-icon-themable-tree', 'show-file-icons');
		const focusTracker = this._register(DOM.trackFocus(this.domNode));
		this._register(focusTracker.onDidFocus(() => this.focused = true));
		this._register(focusTracker.onDidBlur(() => this.focused = false));
	}

	private readonly treeDisposables: DisposableStore = this._register(new DisposableStore());
	protected createTree() {
		this.treeDisposables.clear();
		const actionViewItemProvider = createActionViewItem.bind(undefined, this.instantiationService);
		const treeMenus = this.treeDisposables.add(this.instantiationService.createInstance(TreeMenus, this.id));
		this.treeLabels = this.treeDisposables.add(this.instantiationService.createInstance(ResourceLabels, this));
		const dataSource = this.instantiationService.createInstance(TreeDataSource, this, <T>(task: Promise<T>) => this.progressService.withProgress({ location: this.id }, () => task));
		const aligner = this.treeDisposables.add(new Aligner(this.themeService, this.logService));
		const checkboxStateHandler = this.treeDisposables.add(new CheckboxStateHandler());
		const renderer = this.treeDisposables.add(this.instantiationService.createInstance(TreeRenderer, this.id, treeMenus, this.treeLabels, actionViewItemProvider, aligner, checkboxStateHandler, () => this.manuallyManageCheckboxes));
		this.treeDisposables.add(renderer.onDidChangeCheckboxState(e => this._onDidChangeCheckboxState.fire(e)));

		const widgetAriaLabel = this._title;

		this.tree = this.treeDisposables.add(this.instantiationService.createInstance(Tree, this.id, this.treeContainer!, new TreeViewDelegate(), [renderer],
			dataSource, {
			identityProvider: new TreeViewIdentityProvider(),
			accessibilityProvider: {
				getAriaLabel(element: ITreeItem): string | null {
					if (element.accessibilityInformation) {
						return element.accessibilityInformation.label;
					}

					if (isString(element.tooltip)) {
						return element.tooltip;
					} else {
						if (element.resourceUri && !element.label) {
							// The custom tree has no good information on what should be used for the aria label.
							// Allow the tree widget's default aria label to be used.
							return null;
						}
						let buildAriaLabel: string = '';
						if (element.label) {
							const labelText = isMarkdownString(element.label.label) ? element.label.label.value : element.label.label;
							buildAriaLabel += labelText + ' ';
						}
						if (element.description) {
							buildAriaLabel += element.description;
						}
						return buildAriaLabel;
					}
				},
				getRole(element: ITreeItem): AriaRole | undefined {
					return element.accessibilityInformation?.role ?? 'treeitem';
				},
				getWidgetAriaLabel(): string {
					return widgetAriaLabel;
				}
			},
			keyboardNavigationLabelProvider: {
				getKeyboardNavigationLabel: (item: ITreeItem) => {
					if (item.label) {
						return isMarkdownString(item.label.label) ? item.label.label.value : item.label.label;
					}
					return item.resourceUri ? basename(URI.revive(item.resourceUri)) : undefined;
				}
			},
			expandOnlyOnTwistieClick: (e: ITreeItem) => {
				return !!e.command || !!e.checkbox || this.configurationService.getValue<'singleClick' | 'doubleClick'>('workbench.tree.expandMode') === 'doubleClick';
			},
			collapseByDefault: (e: ITreeItem): boolean => {
				return e.collapsibleState !== TreeItemCollapsibleState.Expanded;
			},
			multipleSelectionSupport: this.canSelectMany,
			dnd: this.treeViewDnd,
			overrideStyles: getLocationBasedViewColors(this.viewLocation).listOverrideStyles
		}));

		this.treeDisposables.add(renderer.onDidChangeMenuContext(e => e.forEach(e => this.tree?.rerender(e))));

		this.treeDisposables.add(this.tree);
		treeMenus.setContextKeyService(this.tree.contextKeyService);
		aligner.tree = this.tree;
		const actionRunner = this.treeDisposables.add(new MultipleSelectionActionRunner(this.notificationService, () => this.tree!.getSelection()));
		renderer.actionRunner = actionRunner;

		this.tree.contextKeyService.createKey<boolean>(this.id, true);
		const customTreeKey = RawCustomTreeViewContextKey.bindTo(this.tree.contextKeyService);
		customTreeKey.set(true);
		this.treeDisposables.add(this.tree.onContextMenu(e => this.onContextMenu(treeMenus, e, actionRunner)));

		this.treeDisposables.add(this.tree.onDidChangeSelection(e => {
			this.lastSelection = e.elements;
			this.lastActive = this.tree?.getFocus()[0] ?? this.lastActive;
			this._onDidChangeSelectionAndFocus.fire({ selection: this.lastSelection, focus: this.lastActive });
		}));
		this.treeDisposables.add(this.tree.onDidChangeFocus(e => {
			if (e.elements.length && (e.elements[0] !== this.lastActive)) {
				this.lastActive = e.elements[0];
				this.lastSelection = this.tree?.getSelection() ?? this.lastSelection;
				this._onDidChangeSelectionAndFocus.fire({ selection: this.lastSelection, focus: this.lastActive });
			}
		}));
		this.treeDisposables.add(this.tree.onDidChangeCollapseState(e => {
			if (!e.node.element) {
				return;
			}

			const element: ITreeItem = Array.isArray(e.node.element.element) ? e.node.element.element[0] : e.node.element.element;
			if (e.node.collapsed) {
				this._onDidCollapseItem.fire(element);
			} else {
				this._onDidExpandItem.fire(element);
			}
		}));
		this.tree.setInput(this.root).then(() => this.updateContentAreas());

		this.treeDisposables.add(this.tree.onDidOpen(async (e) => {
			if (!e.browserEvent) {
				return;
			}
			if (e.browserEvent.target && (e.browserEvent.target as HTMLElement).classList.contains(TreeItemCheckbox.checkboxClass)) {
				return;
			}
			const selection = this.tree!.getSelection();
			const command = await this.resolveCommand(selection.length === 1 ? selection[0] : undefined);

			if (command && isTreeCommandEnabled(command, this.contextKeyService)) {
				let args = command.arguments || [];
				if (command.id === API_OPEN_EDITOR_COMMAND_ID || command.id === API_OPEN_DIFF_EDITOR_COMMAND_ID) {
					// Some commands owned by us should receive the
					// `IOpenEvent` as context to open properly
					args = [...args, e];
				}

				try {
					await this.commandService.executeCommand(command.id, ...args);
				} catch (err) {
					this.notificationService.error(err);
				}
			}
		}));

		this.treeDisposables.add(treeMenus.onDidChange((changed) => {
			if (this.tree?.hasNode(changed)) {
				this.tree?.rerender(changed);
			}
		}));
	}

	private async resolveCommand(element: ITreeItem | undefined): Promise<TreeCommand | undefined> {
		let command = element?.command;
		if (element && !command) {
			if ((element instanceof ResolvableTreeItem) && element.hasResolve) {
				await element.resolve(CancellationToken.None);
				command = element.command;
			}
		}
		return command;
	}


	private onContextMenu(treeMenus: TreeMenus, treeEvent: ITreeContextMenuEvent<ITreeItem>, actionRunner: MultipleSelectionActionRunner): void {
		this.hoverService.hideHover();
		const node: ITreeItem | null = treeEvent.element;
		if (node === null) {
			return;
		}
		const event: UIEvent = treeEvent.browserEvent;

		event.preventDefault();
		event.stopPropagation();

		this.tree!.setFocus([node]);
		let selected = this.canSelectMany ? this.getSelection() : [];
		if (!selected.find(item => item.handle === node.handle)) {
			selected = [node];
		}

		const actions = treeMenus.getResourceContextActions(selected);
		if (!actions.length) {
			return;
		}
		this.contextMenuService.showContextMenu({
			getAnchor: () => treeEvent.anchor,

			getActions: () => actions,

			getActionViewItem: (action) => {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel() });
				}
				return undefined;
			},

			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.tree!.domFocus();
				}
			},

			getActionsContext: () => ({ $treeViewId: this.id, $treeItemHandle: node.handle } satisfies TreeViewItemHandleArg),

			actionRunner
		});
	}

	protected updateMessage(): void {
		if (this._message) {
			this.showMessage(this._message);
		} else if (!this.dataProvider) {
			this.showMessage(noDataProviderMessage);
		} else {
			this.hideMessage();
		}
		this.updateContentAreas();
	}

	private processMessage(message: IMarkdownString, disposables: DisposableStore): HTMLElement {
		const lines = message.value.split('\n');
		const result: (IRenderedMarkdown | HTMLElement)[] = [];
		let hasFoundButton = false;
		for (const line of lines) {
			const linkedText = parseLinkedText(line);

			if (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {
				const node = linkedText.nodes[0];
				const buttonContainer = document.createElement('div');
				buttonContainer.classList.add('button-container');
				const button = new Button(buttonContainer, { title: node.title, secondary: hasFoundButton, supportIcons: true, ...defaultButtonStyles });
				button.label = node.label;
				button.onDidClick(_ => {
					this.openerService.open(node.href, { allowCommands: true });
				}, null, disposables);

				const href = URI.parse(node.href);
				if (href.scheme === Schemas.command) {
					const preConditions = commandPreconditions(href.path);
					if (preConditions) {
						button.enabled = this.contextKeyService.contextMatchesRules(preConditions);
						disposables.add(this.contextKeyService.onDidChangeContext(e => {
							if (e.affectsSome(new Set(preConditions.keys()))) {
								button.enabled = this.contextKeyService.contextMatchesRules(preConditions);
							}
						}));
					}
				}

				disposables.add(button);
				hasFoundButton = true;
				result.push(buttonContainer);
			} else {
				hasFoundButton = false;
				const rendered = this.markdownRendererService.render(new MarkdownString(line, { isTrusted: message.isTrusted, supportThemeIcons: message.supportThemeIcons, supportHtml: message.supportHtml }));
				result.push(rendered.element);
				disposables.add(rendered);
			}
		}

		const container = document.createElement('div');
		container.classList.add('rendered-message');
		for (const child of result) {
			if (DOM.isHTMLElement(child)) {
				container.appendChild(child);
			} else {
				container.appendChild(child.element);
			}
		}
		return container;
	}

	private showMessage(message: string | IMarkdownString): void {
		if (isRenderedMessageValue(this._messageValue)) {
			this._messageValue.disposables.dispose();
		}
		if (isMarkdownString(message)) {
			const disposables = new DisposableStore();
			const renderedMessage = this.processMessage(message, disposables);
			this._messageValue = { element: renderedMessage, disposables };
		} else {
			this._messageValue = message;
		}
		if (!this.messageElement) {
			return;
		}
		this.messageElement.classList.remove('hide');
		this.resetMessageElement();
		if (typeof this._messageValue === 'string' && !isFalsyOrWhitespace(this._messageValue)) {
			this.messageElement.textContent = this._messageValue;
		} else if (isRenderedMessageValue(this._messageValue)) {
			this.messageElement.appendChild(this._messageValue.element);
		}
		this.layout(this._height, this._width);
	}

	private hideMessage(): void {
		this.resetMessageElement();
		this.messageElement?.classList.add('hide');
		this.layout(this._height, this._width);
	}

	private resetMessageElement(): void {
		if (this.messageElement) {
			DOM.clearNode(this.messageElement);
		}
	}

	private _height: number = 0;
	private _width: number = 0;
	layout(height: number, width: number) {
		if (height && width && this.messageElement && this.treeContainer) {
			this._height = height;
			this._width = width;
			const treeHeight = height - DOM.getTotalHeight(this.messageElement);
			this.treeContainer.style.height = treeHeight + 'px';
			this.tree?.layout(treeHeight, width);
		}
	}

	getOptimalWidth(): number {
		if (this.tree) {
			const parentNode = this.tree.getHTMLElement();
			// eslint-disable-next-line no-restricted-syntax
			const childNodes = ([] as HTMLElement[]).slice.call(parentNode.querySelectorAll('.outline-item-label > a'));
			return DOM.getLargestChildWidth(parentNode, childNodes);
		}
		return 0;
	}

	private updateCheckboxes(elements: readonly ITreeItem[]): ITreeItem[] {
		return setCascadingCheckboxUpdates(elements);
	}

	async refresh(elements?: readonly ITreeItem[], checkboxes?: readonly ITreeItem[]): Promise<void> {
		if (this.dataProvider && this.tree) {
			if (this.refreshing) {
				await Event.toPromise(this._onDidCompleteRefresh.event);
			}
			if (!elements) {
				elements = [this.root];
				// remove all waiting elements to refresh if root is asked to refresh
				this.elementsToRefresh = [];
			}
			for (const element of elements) {
				element.children = undefined; // reset children
			}
			if (this.isVisible) {
				const affectedElements = this.updateCheckboxes(checkboxes ?? []);
				return this.doRefresh(elements.concat(affectedElements));
			} else {
				if (this.elementsToRefresh.length) {
					const seen: Set<string> = new Set<string>();
					this.elementsToRefresh.forEach(element => seen.add(element.handle));
					for (const element of elements) {
						if (!seen.has(element.handle)) {
							this.elementsToRefresh.push(element);
						}
					}
				} else {
					this.elementsToRefresh.push(...elements);
				}
			}
		}
		return undefined;
	}

	async expand(itemOrItems: ITreeItem | ITreeItem[]): Promise<void> {
		const tree = this.tree;
		if (!tree) {
			return;
		}
		try {
			itemOrItems = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
			for (const element of itemOrItems) {
				await tree.expand(element, false);
			}
		} catch (e) {
			// The extension could have changed the tree during the reveal.
			// Because of that, we ignore errors.
		}
	}

	isCollapsed(item: ITreeItem): boolean {
		return !!this.tree?.isCollapsed(item);
	}

	setSelection(items: ITreeItem[]): void {
		this.tree?.setSelection(items);
	}

	getSelection(): ITreeItem[] {
		return this.tree?.getSelection() ?? [];
	}

	setFocus(item?: ITreeItem): void {
		if (this.tree) {
			if (item) {
				this.focus(true, item);
				this.tree.setFocus([item]);
			} else if (this.tree.getFocus().length === 0) {
				this.tree.setFocus([]);
			}
		}
	}

	async reveal(item: ITreeItem): Promise<void> {
		if (this.tree) {
			return this.tree.reveal(item);
		}
	}

	private refreshing: boolean = false;
	private async doRefresh(elements: readonly ITreeItem[]): Promise<void> {
		const tree = this.tree;
		if (tree && this.visible) {
			this.refreshing = true;
			const oldSelection = tree.getSelection();
			try {
				await Promise.all(elements.map(element => tree.updateChildren(element, true, true)));
			} catch (e) {
				// When multiple calls are made to refresh the tree in quick succession,
				// we can get a "Tree element not found" error. This is expected.
				// Ideally this is fixable, so log instead of ignoring so the error is preserved.
				this.logService.error(e);
			}
			const newSelection = tree.getSelection();
			if (oldSelection.length !== newSelection.length || oldSelection.some((value, index) => value.handle !== newSelection[index].handle)) {
				this.lastSelection = newSelection;
				this._onDidChangeSelectionAndFocus.fire({ selection: this.lastSelection, focus: this.lastActive });
			}
			this.refreshing = false;
			this._onDidCompleteRefresh.fire();
			this.updateContentAreas();
			if (this.focused) {
				this.focus(false);
			}
			this.updateCollapseAllToggle();
		}
	}

	private initializeCollapseAllToggle() {
		if (!this.collapseAllToggleContext) {
			this.collapseAllToggleContextKey = new RawContextKey<boolean>(`treeView.${this.id}.toggleCollapseAll`, false, localize('treeView.toggleCollapseAll', "Whether collapse all is toggled for the tree view with id {0}.", this.id));
			this.collapseAllToggleContext = this.collapseAllToggleContextKey.bindTo(this.contextKeyService);
		}
	}

	private updateCollapseAllToggle() {
		if (this.showCollapseAllAction) {
			this.initializeCollapseAllToggle();
			this.collapseAllToggleContext?.set(!!this.root.children && (this.root.children.length > 0) &&
				this.root.children.some(value => value.collapsibleState !== TreeItemCollapsibleState.None));
		}
	}

	private updateContentAreas(): void {
		const isTreeEmpty = !this.root.children || this.root.children.length === 0;
		// Hide tree container only when there is a message and tree is empty and not refreshing
		if (this._messageValue && isTreeEmpty && !this.refreshing && this.treeContainer) {
			// If there's a dnd controller then hiding the tree prevents it from being dragged into.
			if (!this.dragAndDropController) {
				this.treeContainer.classList.add('hide');
			}
			this.domNode.setAttribute('tabindex', '0');
		} else if (this.treeContainer) {
			this.treeContainer.classList.remove('hide');
			if (this.domNode === DOM.getActiveElement()) {
				this.focus();
			}
			this.domNode.removeAttribute('tabindex');
		}
	}

	get container(): HTMLElement | undefined {
		return this._container;
	}
}

class TreeViewIdentityProvider implements IIdentityProvider<ITreeItem> {
	getId(element: ITreeItem): { toString(): string } {
		return element.handle;
	}
}

class TreeViewDelegate implements IListVirtualDelegate<ITreeItem> {

	getHeight(element: ITreeItem): number {
		return TreeRenderer.ITEM_HEIGHT;
	}

	getTemplateId(element: ITreeItem): string {
		return TreeRenderer.TREE_TEMPLATE_ID;
	}
}

async function doGetChildrenOrBatch(dataProvider: ITreeViewDataProvider, nodes: ITreeItem[] | undefined): Promise<ITreeItem[][] | undefined> {
	if (dataProvider.getChildrenBatch) {
		return dataProvider.getChildrenBatch(nodes);
	} else {
		if (nodes) {
			return Promise.all(nodes.map(node => dataProvider.getChildren(node).then(children => children ?? [])));
		} else {
			return [await dataProvider.getChildren()].filter(children => children !== undefined);
		}
	}
}

class TreeDataSource implements IAsyncDataSource<ITreeItem, ITreeItem> {

	constructor(
		private treeView: ITreeView,
		private withProgress: <T>(task: Promise<T>) => Promise<T>
	) {
	}

	hasChildren(element: ITreeItem): boolean {
		return !!this.treeView.dataProvider && (element.collapsibleState !== TreeItemCollapsibleState.None);
	}

	private batch: ITreeItem[] | undefined;
	private batchPromise: Promise<ITreeItem[][] | undefined> | undefined;
	async getChildren(element: ITreeItem): Promise<ITreeItem[]> {
		const dataProvider = this.treeView.dataProvider;
		if (!dataProvider) {
			return [];
		}
		if (this.batch === undefined) {
			this.batch = [element];
			this.batchPromise = undefined;
		} else {
			this.batch.push(element);
		}
		const indexInBatch = this.batch.length - 1;
		return new Promise<ITreeItem[]>((resolve, reject) => {
			setTimeout(async () => {
				const batch = this.batch;
				this.batch = undefined;
				if (!this.batchPromise) {
					this.batchPromise = this.withProgress(doGetChildrenOrBatch(dataProvider, batch));
				}
				try {
					const result = await this.batchPromise;
					resolve((result && (indexInBatch < result.length)) ? result[indexInBatch] : []);
				} catch (e) {
					if (!(<string>e.message).startsWith('Bad progress location:')) {
						reject(e);
					}
				}
			}, 0);
		});
	}
}

interface ITreeExplorerTemplateData {
	readonly container: HTMLElement;
	readonly resourceLabel: IResourceLabel;
	readonly icon: HTMLElement;
	readonly checkboxContainer: HTMLElement;
	checkbox?: TreeItemCheckbox;
	readonly actionBar: ActionBar;
}

class TreeRenderer extends Disposable implements ITreeRenderer<ITreeItem, FuzzyScore, ITreeExplorerTemplateData> {
	static readonly ITEM_HEIGHT = 22;
	static readonly TREE_TEMPLATE_ID = 'treeExplorer';

	private readonly _onDidChangeCheckboxState: Emitter<readonly ITreeItem[]> = this._register(new Emitter<readonly ITreeItem[]>());
	readonly onDidChangeCheckboxState: Event<readonly ITreeItem[]> = this._onDidChangeCheckboxState.event;

	private _onDidChangeMenuContext: Emitter<readonly ITreeItem[]> = this._register(new Emitter<readonly ITreeItem[]>());
	readonly onDidChangeMenuContext: Event<readonly ITreeItem[]> = this._onDidChangeMenuContext.event;

	private _actionRunner: MultipleSelectionActionRunner | undefined;
	private _hoverDelegate: IHoverDelegate;
	private _hasCheckbox: boolean = false;
	private _renderedElements = new Map<string, { original: ITreeNode<ITreeItem, FuzzyScore>; rendered: ITreeExplorerTemplateData }[]>(); // tree item handle to template data

	constructor(
		private treeViewId: string,
		private menus: TreeMenus,
		private labels: ResourceLabels,
		private actionViewItemProvider: IActionViewItemProvider,
		private aligner: Aligner,
		private checkboxStateHandler: CheckboxStateHandler,
		private readonly manuallyManageCheckboxes: () => boolean,
		@IThemeService private readonly themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILabelService private readonly labelService: ILabelService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IHoverService private readonly hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._hoverDelegate = this._register(instantiationService.createInstance(WorkbenchHoverDelegate, 'mouse', undefined, {}));
		this._register(this.themeService.onDidFileIconThemeChange(() => this.rerender()));
		this._register(this.themeService.onDidColorThemeChange(() => this.rerender()));
		this._register(checkboxStateHandler.onDidChangeCheckboxState(items => {
			this.updateCheckboxes(items);
		}));
		this._register(this.contextKeyService.onDidChangeContext(e => this.onDidChangeContext(e)));
	}

	get templateId(): string {
		return TreeRenderer.TREE_TEMPLATE_ID;
	}

	set actionRunner(actionRunner: MultipleSelectionActionRunner) {
		this._actionRunner = actionRunner;
	}

	renderTemplate(container: HTMLElement): ITreeExplorerTemplateData {
		container.classList.add('custom-view-tree-node-item');

		const checkboxContainer = DOM.append(container, DOM.$(''));
		const resourceLabel = this.labels.create(container, { supportHighlights: true, hoverDelegate: this._hoverDelegate });
		const icon = DOM.prepend(resourceLabel.element, DOM.$('.custom-view-tree-node-item-icon'));
		const actionsContainer = DOM.append(resourceLabel.element, DOM.$('.actions'));
		const actionBar = new ActionBar(actionsContainer, {
			actionViewItemProvider: this.actionViewItemProvider
		});

		return { resourceLabel, icon, checkboxContainer, actionBar, container };
	}

	private getHover(label: string | IMarkdownString | undefined, resource: URI | null, node: ITreeItem): string | IManagedHoverTooltipMarkdownString | undefined {
		if (!(node instanceof ResolvableTreeItem) || !node.hasResolve) {
			if (resource && !node.tooltip) {
				return undefined;
			} else if (node.tooltip === undefined) {
				if (isMarkdownString(label)) {
					return { markdown: label, markdownNotSupportedFallback: label.value };
				} else {
					return label;
				}
			} else if (!isString(node.tooltip)) {
				return { markdown: node.tooltip, markdownNotSupportedFallback: resource ? undefined : renderAsPlaintext(node.tooltip) }; // Passing undefined as the fallback for a resource falls back to the old native hover
			} else if (node.tooltip !== '') {
				return node.tooltip;
			} else {
				return undefined;
			}
		}

		return {
			markdown: typeof node.tooltip === 'string' ? node.tooltip :
				(token: CancellationToken): Promise<IMarkdownString | string | undefined> => {
					return new Promise<IMarkdownString | string | undefined>((resolve) => {
						node.resolve(token).then(() => resolve(node.tooltip));
					});
				},
			markdownNotSupportedFallback: resource ? undefined : (label ? (isMarkdownString(label) ? label.value : label) : '') // Passing undefined as the fallback for a resource falls back to the old native hover
		};
	}

	private processLabel(label: string | IMarkdownString | undefined, matches: { start: number; end: number }[] | undefined): { label: string | undefined; bold?: boolean; italic?: boolean; strikethrough?: boolean; supportIcons?: boolean } {
		if (!isMarkdownString(label)) {
			return { label };
		}

		let text = label.value.trim();
		let bold = false;
		let italic = false;
		let strikethrough = false;

		function moveMatches(offset: number) {
			if (matches) {
				for (const match of matches) {
					match.start -= offset;
					match.end -= offset;
				}
			}
		}

		const syntaxes = [
			{ open: '~~', close: '~~', mark: () => { strikethrough = true; } },
			{ open: '**', close: '**', mark: () => { bold = true; } },
			{ open: '*', close: '*', mark: () => { italic = true; } },
			{ open: '_', close: '_', mark: () => { italic = true; } }
		];

		function checkSyntaxes(): boolean {
			let didChange = false;
			for (const syntax of syntaxes) {
				if (text.startsWith(syntax.open) && text.endsWith(syntax.close)) {
					// If there is a match within the markers, stop processing
					if (matches?.some(match => match.start < syntax.open.length || match.end > text.length - syntax.close.length)) {
						return false;
					}

					syntax.mark();
					text = text.substring(syntax.open.length, text.length - syntax.close.length);
					moveMatches(syntax.open.length);
					didChange = true;
				}
			}
			return didChange;
		}

		// Arbitrary max # of iterations
		for (let i = 0; i < 10; i++) {
			if (!checkSyntaxes()) {
				break;
			}
		}

		return {
			label: text,
			bold,
			italic,
			strikethrough,
			supportIcons: label.supportThemeIcons
		};
	}

	renderElement(element: ITreeNode<ITreeItem, FuzzyScore>, index: number, templateData: ITreeExplorerTemplateData): void {
		const node = element.element;
		const resource = node.resourceUri ? URI.revive(node.resourceUri) : null;
		const treeItemLabel: ITreeItemLabel | undefined = node.label ? node.label : (resource ? { label: basename(resource) } : undefined);
		const description = isString(node.description) ? node.description : resource && node.description === true ? this.labelService.getUriLabel(dirname(resource), { relative: true }) : undefined;
		const labelStr = treeItemLabel ? isMarkdownString(treeItemLabel.label) ? treeItemLabel.label.value : treeItemLabel.label : undefined;
		const matches = (treeItemLabel?.highlights && labelStr) ? treeItemLabel.highlights.map(([start, end]) => {
			if (start < 0) {
				start = labelStr.length + start;
			}
			if (end < 0) {
				end = labelStr.length + end;
			}
			if ((start >= labelStr.length) || (end > labelStr.length)) {
				return ({ start: 0, end: 0 });
			}
			if (start > end) {
				const swap = start;
				start = end;
				end = swap;
			}
			return ({ start, end });
		}) : undefined;
		const { label, bold, italic, strikethrough, supportIcons } = this.processLabel(treeItemLabel?.label, matches);
		const icon = !isDark(this.themeService.getColorTheme().type) ? node.icon : node.iconDark;
		const iconUrl = icon ? URI.revive(icon) : undefined;
		const title = this.getHover(treeItemLabel?.label, resource, node);

		// reset
		templateData.actionBar.clear();
		templateData.icon.style.color = '';

		let commandEnabled = true;
		if (node.command) {
			commandEnabled = isTreeCommandEnabled(node.command, this.contextKeyService);
		}

		this.renderCheckbox(node, templateData);

		if (resource) {
			const fileDecorations = this.configurationService.getValue<{ colors: boolean; badges: boolean }>('explorer.decorations');
			const labelResource = resource ? resource : URI.parse('missing:_icon_resource');
			templateData.resourceLabel.setResource({ name: label, description, resource: labelResource }, {
				fileKind: this.getFileKind(node),
				title,
				hideIcon: this.shouldHideResourceLabelIcon(iconUrl, node.themeIcon),
				fileDecorations,
				extraClasses: ['custom-view-tree-node-item-resourceLabel'],
				matches: matches ? matches : createMatches(element.filterData),
				bold,
				italic,
				strikethrough,
				disabledCommand: !commandEnabled,
				labelEscapeNewLines: true,
				forceLabel: !!node.label,
				supportIcons
			});
		} else {
			templateData.resourceLabel.setResource({ name: label, description }, {
				title,
				hideIcon: true,
				extraClasses: ['custom-view-tree-node-item-resourceLabel'],
				matches: matches ? matches : createMatches(element.filterData),
				bold,
				italic,
				strikethrough,
				disabledCommand: !commandEnabled,
				labelEscapeNewLines: true,
				supportIcons
			});
		}

		if (iconUrl) {
			templateData.icon.className = 'custom-view-tree-node-item-icon';
			templateData.icon.style.backgroundImage = cssJs.asCSSUrl(iconUrl);
		} else {
			let iconClass: string | undefined;
			if (this.shouldShowThemeIcon(!!resource, node.themeIcon)) {
				iconClass = ThemeIcon.asClassName(node.themeIcon);
				if (node.themeIcon.color) {
					templateData.icon.style.color = this.themeService.getColorTheme().getColor(node.themeIcon.color.id)?.toString() ?? '';
				}
			}
			templateData.icon.className = iconClass ? `custom-view-tree-node-item-icon ${iconClass}` : '';
			templateData.icon.style.backgroundImage = '';
		}

		if (!commandEnabled) {
			templateData.icon.className = templateData.icon.className + ' disabled';
			if (templateData.container.parentElement) {
				templateData.container.parentElement.className = templateData.container.parentElement.className + ' disabled';
			}
		}

		templateData.actionBar.context = { $treeViewId: this.treeViewId, $treeItemHandle: node.handle } satisfies TreeViewItemHandleArg;

		const menuActions = this.menus.getResourceActions([node]);
		templateData.actionBar.push(menuActions, { icon: true, label: false });

		if (this._actionRunner) {
			templateData.actionBar.actionRunner = this._actionRunner;
		}
		this.setAlignment(templateData.container, node);
		if (node.parent instanceof Root) {
			if (node.collapsibleState === TreeItemCollapsibleState.None) {
				templateData.container.classList.add('no-twisty');
			} else {
				templateData.container.classList.remove('no-twisty');
			}
		}

		// remember rendered element, an element can be rendered multiple times
		const renderedItems = this._renderedElements.get(element.element.handle) ?? [];
		this._renderedElements.set(element.element.handle, [...renderedItems, { original: element, rendered: templateData }]);
	}

	private rerender() {
		// As we add items to the map during this call we can't directly use the map in the for loop
		// but have to create a copy of the keys first
		const keys = new Set(this._renderedElements.keys());
		for (const key of keys) {
			const values = this._renderedElements.get(key) ?? [];
			for (const value of values) {
				this.disposeElement(value.original, 0, value.rendered);
				this.renderElement(value.original, 0, value.rendered);
			}
		}
	}

	private renderCheckbox(node: ITreeItem, templateData: ITreeExplorerTemplateData) {
		if (node.checkbox) {
			// The first time we find a checkbox we want to rerender the visible tree to adapt the alignment
			if (!this._hasCheckbox) {
				this._hasCheckbox = true;
				this.rerender();
			}
			if (!templateData.checkbox) {
				const checkbox = new TreeItemCheckbox(templateData.checkboxContainer, this.checkboxStateHandler, this._hoverDelegate, this.hoverService);
				templateData.checkbox = checkbox;
			}
			templateData.checkbox.render(node);
		} else if (templateData.checkbox) {
			templateData.checkbox.dispose();
			templateData.checkbox = undefined;
		}
	}

	private setAlignment(container: HTMLElement, treeItem: ITreeItem) {
		container.parentElement!.classList.toggle('align-icon-with-twisty', this.aligner.alignIconWithTwisty(treeItem));
	}

	private shouldHideResourceLabelIcon(iconUrl: URI | undefined, icon: ThemeIcon | undefined): boolean {
		// We always hide the resource label in favor of the iconUrl when it's provided.
		// When `ThemeIcon` is provided, we hide the resource label icon in favor of it only if it's a not a file icon.
		return (!!iconUrl || (!!icon && !this.isFileKindThemeIcon(icon)));
	}

	private shouldShowThemeIcon(hasResource: boolean, icon: ThemeIcon | undefined): icon is ThemeIcon {
		if (!icon) {
			return false;
		}

		// If there's a resource and the icon is a file icon, then the icon (or lack thereof) will already be coming from the
		// icon theme and should use whatever the icon theme has provided.
		return !(hasResource && this.isFileKindThemeIcon(icon));
	}

	private isFileKindThemeIcon(icon: ThemeIcon | undefined): boolean {
		return ThemeIcon.isFile(icon) || ThemeIcon.isFolder(icon);
	}

	private getFileKind(node: ITreeItem): FileKind {
		if (node.themeIcon) {
			switch (node.themeIcon.id) {
				case FileThemeIcon.id:
					return FileKind.FILE;
				case FolderThemeIcon.id:
					return FileKind.FOLDER;
			}
		}
		return node.collapsibleState === TreeItemCollapsibleState.Collapsed || node.collapsibleState === TreeItemCollapsibleState.Expanded ? FileKind.FOLDER : FileKind.FILE;
	}

	private onDidChangeContext(e: IContextKeyChangeEvent) {
		const affectsEntireMenuContexts = e.affectsSome(this.menus.getEntireMenuContexts());

		const items: ITreeItem[] = [];
		for (const [_, elements] of this._renderedElements) {
			for (const element of elements) {
				if (affectsEntireMenuContexts || e.affectsSome(this.menus.getElementOverlayContexts(element.original.element))) {
					items.push(element.original.element);
				}
			}
		}
		if (items.length) {
			this._onDidChangeMenuContext.fire(items);
		}
	}

	private updateCheckboxes(items: ITreeItem[]) {
		let allItems: ITreeItem[] = [];

		if (!this.manuallyManageCheckboxes()) {
			allItems = setCascadingCheckboxUpdates(items);
		} else {
			allItems = items;
		}

		allItems.forEach(item => {
			const renderedItems = this._renderedElements.get(item.handle);
			if (renderedItems) {
				renderedItems.forEach(renderedItems => renderedItems.rendered.checkbox?.render(item));
			}
		});
		this._onDidChangeCheckboxState.fire(allItems);
	}

	disposeElement(resource: ITreeNode<ITreeItem, FuzzyScore>, index: number, templateData: ITreeExplorerTemplateData): void {
		const itemRenders = this._renderedElements.get(resource.element.handle) ?? [];
		const renderedIndex = itemRenders.findIndex(renderedItem => templateData === renderedItem.rendered);

		if (itemRenders.length === 1) {
			this._renderedElements.delete(resource.element.handle);
		} else if (itemRenders.length > 0) {
			itemRenders.splice(renderedIndex, 1);
		}

		templateData.checkbox?.dispose();
		templateData.checkbox = undefined;
	}

	disposeTemplate(templateData: ITreeExplorerTemplateData): void {
		templateData.resourceLabel.dispose();
		templateData.actionBar.dispose();
	}
}

class Aligner extends Disposable {
	private _tree: WorkbenchAsyncDataTree<ITreeItem, ITreeItem, FuzzyScore> | undefined;

	constructor(private themeService: IThemeService, private logService: ILogService) {
		super();
	}

	set tree(tree: WorkbenchAsyncDataTree<ITreeItem, ITreeItem, FuzzyScore>) {
		this._tree = tree;
	}

	public alignIconWithTwisty(treeItem: ITreeItem): boolean {
		if (treeItem.collapsibleState !== TreeItemCollapsibleState.None) {
			return false;
		}
		if (!this.hasIconOrCheckbox(treeItem)) {
			return false;
		}

		if (this._tree) {
			const root = this._tree.getInput();
			let parent: ITreeItem;
			try {
				parent = this._tree.getParentElement(treeItem) || root;
			} catch (error) {
				this.logService.error(`[TreeView] Failed to resolve parent for ${treeItem.handle}`, error);
				return false;
			}
			if (this.hasIconOrCheckbox(parent)) {
				return !!parent.children && parent.children.some(c => c.collapsibleState !== TreeItemCollapsibleState.None && !this.hasIconOrCheckbox(c));
			}
			return !!parent.children && parent.children.every(c => c.collapsibleState === TreeItemCollapsibleState.None || !this.hasIconOrCheckbox(c));
		} else {
			return false;
		}
	}

	private hasIconOrCheckbox(node: ITreeItem): boolean {
		return this.hasIcon(node) || !!node.checkbox;
	}

	private hasIcon(node: ITreeItem): boolean {
		const icon = !isDark(this.themeService.getColorTheme().type) ? node.icon : node.iconDark;
		if (icon) {
			return true;
		}
		if (node.resourceUri || node.themeIcon) {
			const fileIconTheme = this.themeService.getFileIconTheme();
			const isFolder = node.themeIcon ? node.themeIcon.id === FolderThemeIcon.id : node.collapsibleState !== TreeItemCollapsibleState.None;
			if (isFolder) {
				return fileIconTheme.hasFileIcons && fileIconTheme.hasFolderIcons;
			}
			return fileIconTheme.hasFileIcons;
		}
		return false;
	}
}

class MultipleSelectionActionRunner extends ActionRunner {

	constructor(notificationService: INotificationService, private getSelectedResources: (() => ITreeItem[])) {
		super();
		this._register(this.onDidRun(e => {
			if (e.error && !isCancellationError(e.error)) {
				notificationService.error(localize('command-error', 'Error running command {1}: {0}. This is likely caused by the extension that contributes {1}.', e.error.message, e.action.id));
			}
		}));
	}

	protected override async runAction(action: IAction, context: TreeViewItemHandleArg | TreeViewPaneHandleArg): Promise<void> {
		const selection = this.getSelectedResources();
		let selectionHandleArgs: TreeViewItemHandleArg[] | undefined = undefined;
		let actionInSelected: boolean = false;
		if (selection.length > 1) {
			selectionHandleArgs = selection.map(selected => {
				if ((selected.handle === (context as TreeViewItemHandleArg).$treeItemHandle) || (context as TreeViewPaneHandleArg).$selectedTreeItems) {
					actionInSelected = true;
				}
				return { $treeViewId: context.$treeViewId, $treeItemHandle: selected.handle };
			});
		}

		if (!actionInSelected && selectionHandleArgs) {
			selectionHandleArgs = undefined;
		}

		await action.run(context, selectionHandleArgs);
	}
}

class TreeMenus implements IDisposable {
	private contextKeyService: IContextKeyService | undefined;
	private _onDidChange = new Emitter<ITreeItem>();
	public readonly onDidChange = this._onDidChange.event;

	constructor(
		private id: string,
		@IMenuService private readonly menuService: IMenuService
	) { }

	/**
	 * Gets only the actions that apply to all of the given elements.
	 */
	getResourceActions(elements: ITreeItem[]): IAction[] {
		const actions = this.getActions(this.getMenuId(), elements);
		return actions.primary;
	}

	/**
	 * Gets only the actions that apply to all of the given elements.
	 */
	getResourceContextActions(elements: ITreeItem[]): IAction[] {
		return this.getActions(this.getMenuId(), elements).secondary;
	}

	public setContextKeyService(service: IContextKeyService) {
		this.contextKeyService = service;
	}

	private filterNonUniversalActions(groups: Map<string, IAction>[], newActions: IAction[]) {
		const newActionsSet: Set<string> = new Set(newActions.map(a => a.id));
		for (const group of groups) {
			const actions = group.keys();
			for (const action of actions) {
				if (!newActionsSet.has(action)) {
					group.delete(action);
				}
			}
		}
	}

	private buildMenu(groups: Map<string, IAction>[]): IAction[] {
		const result: IAction[] = [];
		for (const group of groups) {
			if (group.size > 0) {
				if (result.length) {
					result.push(new Separator());
				}
				result.push(...group.values());
			}
		}
		return result;
	}

	private createGroups(actions: IAction[]): Map<string, IAction>[] {
		const groups: Map<string, IAction>[] = [];
		let group: Map<string, IAction> = new Map();
		for (const action of actions) {
			if (action instanceof Separator) {
				groups.push(group);
				group = new Map();
			} else {
				group.set(action.id, action);
			}
		}
		groups.push(group);
		return groups;
	}

	public getElementOverlayContexts(element: ITreeItem): Map<string, unknown> {
		return new Map([
			['view', this.id],
			['viewItem', element.contextValue]
		]);
	}

	public getEntireMenuContexts(): ReadonlySet<string> {
		return this.menuService.getMenuContexts(this.getMenuId());
	}

	public getMenuId(): MenuId {
		return MenuId.ViewItemContext;
	}

	private getActions(menuId: MenuId, elements: ITreeItem[]): { primary: IAction[]; secondary: IAction[] } {
		if (!this.contextKeyService) {
			return { primary: [], secondary: [] };
		}

		let primaryGroups: Map<string, IAction>[] = [];
		let secondaryGroups: Map<string, IAction>[] = [];
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			const contextKeyService = this.contextKeyService.createOverlay(this.getElementOverlayContexts(element));

			const menuData = this.menuService.getMenuActions(menuId, contextKeyService, { shouldForwardArgs: true });

			const result = getContextMenuActions(menuData, 'inline');
			if (i === 0) {
				primaryGroups = this.createGroups(result.primary);
				secondaryGroups = this.createGroups(result.secondary);
			} else {
				this.filterNonUniversalActions(primaryGroups, result.primary);
				this.filterNonUniversalActions(secondaryGroups, result.secondary);
			}
		}

		return { primary: this.buildMenu(primaryGroups), secondary: this.buildMenu(secondaryGroups) };
	}

	dispose() {
		this.contextKeyService = undefined;
	}
}

export class CustomTreeView extends AbstractTreeView {

	constructor(
		id: string,
		title: string,
		private readonly extensionId: string,
		@IThemeService themeService: IThemeService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICommandService commandService: ICommandService,
		@IConfigurationService configurationService: IConfigurationService,
		@IProgressService progressService: IProgressService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHoverService hoverService: IHoverService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IActivityService activityService: IActivityService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILogService logService: ILogService,
		@IOpenerService openerService: IOpenerService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		super(id, title, themeService, instantiationService, commandService, configurationService, progressService, contextMenuService, keybindingService, notificationService, viewDescriptorService, hoverService, contextKeyService, activityService, logService, openerService, markdownRendererService);
	}

	protected activate() {
		if (!this.activated) {
			type ExtensionViewTelemetry = {
				extensionId: TelemetryTrustedValue<string>;
				id: string;
			};
			type ExtensionViewTelemetryMeta = {
				extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Id of the extension' };
				id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Id of the view' };
				owner: 'digitarald';
				comment: 'Helps to gain insights on what extension contributed views are most popular';
			};
			this.telemetryService.publicLog2<ExtensionViewTelemetry, ExtensionViewTelemetryMeta>('Extension:ViewActivate', {
				extensionId: new TelemetryTrustedValue(this.extensionId),
				id: this.id,
			});
			this.createTree();
			this.progressService.withProgress({ location: this.id }, () => this.extensionService.activateByEvent(`onView:${this.id}`))
				.then(() => timeout(2000))
				.then(() => {
					this.updateMessage();
				});
			this.activated = true;
		}
	}
}

export class TreeView extends AbstractTreeView {

	protected activate() {
		if (!this.activated) {
			this.createTree();
			this.activated = true;
		}
	}
}

interface TreeDragSourceInfo {
	id: string;
	itemHandles: string[];
}

export class CustomTreeViewDragAndDrop implements ITreeDragAndDrop<ITreeItem> {
	private readonly treeMimeType: string;
	private readonly treeItemsTransfer = LocalSelectionTransfer.getInstance<DraggedTreeItemsIdentifier>();
	private dragCancellationToken: CancellationTokenSource | undefined;

	constructor(
		private readonly treeId: string,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITreeViewsDnDService private readonly treeViewsDragAndDropService: ITreeViewsDnDService,
		@ILogService private readonly logService: ILogService) {
		this.treeMimeType = `application/vnd.code.tree.${treeId.toLowerCase()}`;
	}

	private dndController: ITreeViewDragAndDropController | undefined;
	set controller(controller: ITreeViewDragAndDropController | undefined) {
		this.dndController = controller;
	}

	private handleDragAndLog(dndController: ITreeViewDragAndDropController, itemHandles: string[], uuid: string, dragCancellationToken: CancellationToken): Promise<VSDataTransfer | undefined> {
		return dndController.handleDrag(itemHandles, uuid, dragCancellationToken).then(additionalDataTransfer => {
			if (additionalDataTransfer) {
				const unlistedTypes: string[] = [];
				for (const item of additionalDataTransfer) {
					if ((item[0] !== this.treeMimeType) && (dndController.dragMimeTypes.findIndex(value => value === item[0]) < 0)) {
						unlistedTypes.push(item[0]);
					}
				}
				if (unlistedTypes.length) {
					this.logService.warn(`Drag and drop controller for tree ${this.treeId} adds the following data transfer types but does not declare them in dragMimeTypes: ${unlistedTypes.join(', ')}`);
				}
			}
			return additionalDataTransfer;
		});
	}

	private addExtensionProvidedTransferTypes(originalEvent: DragEvent, itemHandles: string[]) {
		if (!originalEvent.dataTransfer || !this.dndController) {
			return;
		}
		const uuid = generateUuid();

		this.dragCancellationToken = new CancellationTokenSource();
		this.treeViewsDragAndDropService.addDragOperationTransfer(uuid, this.handleDragAndLog(this.dndController, itemHandles, uuid, this.dragCancellationToken.token));
		this.treeItemsTransfer.setData([new DraggedTreeItemsIdentifier(uuid)], DraggedTreeItemsIdentifier.prototype);
		originalEvent.dataTransfer.clearData(Mimes.text);
		if (this.dndController.dragMimeTypes.find((element) => element === Mimes.uriList)) {
			// Add the type that the editor knows
			originalEvent.dataTransfer?.setData(DataTransfers.RESOURCES, '');
		}
		this.dndController.dragMimeTypes.forEach(supportedType => {
			originalEvent.dataTransfer?.setData(supportedType, '');
		});
	}

	private addResourceInfoToTransfer(originalEvent: DragEvent, resources: URI[]) {
		if (resources.length && originalEvent.dataTransfer) {
			// Apply some datatransfer types to allow for dragging the element outside of the application
			this.instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, resources, originalEvent));

			// The only custom data transfer we set from the explorer is a file transfer
			// to be able to DND between multiple code file explorers across windows
			const fileResources = resources.filter(s => s.scheme === Schemas.file).map(r => r.fsPath);
			if (fileResources.length) {
				originalEvent.dataTransfer.setData(CodeDataTransfers.FILES, JSON.stringify(fileResources));
			}
		}
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		if (originalEvent.dataTransfer) {
			const treeItemsData = (data as ElementsDragAndDropData<ITreeItem, ITreeItem[]>).getData();
			const resources: URI[] = [];
			const sourceInfo: TreeDragSourceInfo = {
				id: this.treeId,
				itemHandles: []
			};
			treeItemsData.forEach(item => {
				sourceInfo.itemHandles.push(item.handle);
				if (item.resourceUri) {
					resources.push(URI.revive(item.resourceUri));
				}
			});
			this.addResourceInfoToTransfer(originalEvent, resources);
			this.addExtensionProvidedTransferTypes(originalEvent, sourceInfo.itemHandles);
			originalEvent.dataTransfer.setData(this.treeMimeType,
				JSON.stringify(sourceInfo));
		}
	}

	private debugLog(types: Set<string>) {
		if (types.size) {
			this.logService.debug(`TreeView dragged mime types: ${Array.from(types).join(', ')}`);
		} else {
			this.logService.debug(`TreeView dragged with no supported mime types.`);
		}
	}

	onDragOver(data: IDragAndDropData, targetElement: ITreeItem, targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		const dataTransfer = toExternalVSDataTransfer(originalEvent.dataTransfer!);

		const types = new Set<string>(Array.from(dataTransfer, x => x[0]));

		if (originalEvent.dataTransfer) {
			// Also add uri-list if we have any files. At this stage we can't actually access the file itself though.
			for (const item of originalEvent.dataTransfer.items) {
				if (item.kind === 'file' || item.type === DataTransfers.RESOURCES.toLowerCase()) {
					types.add(Mimes.uriList);
					break;
				}
			}
		}

		this.debugLog(types);

		const dndController = this.dndController;
		if (!dndController || !originalEvent.dataTransfer || (dndController.dropMimeTypes.length === 0)) {
			return false;
		}
		const dragContainersSupportedType = Array.from(types).some((value, index) => {
			if (value === this.treeMimeType) {
				return true;
			} else {
				return dndController.dropMimeTypes.indexOf(value) >= 0;
			}
		});
		if (dragContainersSupportedType) {
			return { accept: true, bubble: TreeDragOverBubble.Down, autoExpand: true };
		}
		return false;
	}

	getDragURI(element: ITreeItem): string | null {
		if (!this.dndController) {
			return null;
		}
		return element.resourceUri ? URI.revive(element.resourceUri).toString() : element.handle;
	}

	getDragLabel?(elements: ITreeItem[]): string | undefined {
		if (!this.dndController) {
			return undefined;
		}
		if (elements.length > 1) {
			return String(elements.length);
		}
		const element = elements[0];
		if (element.label) {
			return isMarkdownString(element.label.label) ? element.label.label.value : element.label.label;
		}
		return element.resourceUri ? this.labelService.getUriLabel(URI.revive(element.resourceUri)) : undefined;
	}

	async drop(data: IDragAndDropData, targetNode: ITreeItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): Promise<void> {
		const dndController = this.dndController;
		if (!originalEvent.dataTransfer || !dndController) {
			return;
		}

		let treeSourceInfo: TreeDragSourceInfo | undefined;
		let willDropUuid: string | undefined;
		if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
			willDropUuid = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype)![0].identifier;
		}

		const originalDataTransfer = toExternalVSDataTransfer(originalEvent.dataTransfer, true);

		const outDataTransfer = new VSDataTransfer();
		for (const [type, item] of originalDataTransfer) {
			if (type === this.treeMimeType || dndController.dropMimeTypes.includes(type) || (item.asFile() && dndController.dropMimeTypes.includes(DataTransfers.FILES.toLowerCase()))) {
				outDataTransfer.append(type, item);
				if (type === this.treeMimeType) {
					try {
						treeSourceInfo = JSON.parse(await item.asString());
					} catch {
						// noop
					}
				}
			}
		}

		const additionalDataTransfer = await this.treeViewsDragAndDropService.removeDragOperationTransfer(willDropUuid);
		if (additionalDataTransfer) {
			for (const [type, item] of additionalDataTransfer) {
				outDataTransfer.append(type, item);
			}
		}
		return dndController.handleDrop(outDataTransfer, targetNode, CancellationToken.None, willDropUuid, treeSourceInfo?.id, treeSourceInfo?.itemHandles);
	}

	onDragEnd(originalEvent: DragEvent): void {
		// Check if the drag was cancelled.
		if (originalEvent.dataTransfer?.dropEffect === 'none') {
			this.dragCancellationToken?.cancel();
		}
	}

	dispose(): void { }
}

function setCascadingCheckboxUpdates(items: readonly ITreeItem[]) {
	const additionalItems: ITreeItem[] = [];

	for (const item of items) {
		if (item.checkbox !== undefined) {

			const checkChildren = (currentItem: ITreeItem) => {
				for (const child of (currentItem.children ?? [])) {
					if ((child.checkbox !== undefined) && (currentItem.checkbox !== undefined) && (child.checkbox.isChecked !== currentItem.checkbox.isChecked)) {
						child.checkbox.isChecked = currentItem.checkbox.isChecked;
						additionalItems.push(child);
						checkChildren(child);
					}
				}
			};
			checkChildren(item);

			const visitedParents: Set<ITreeItem> = new Set();
			const checkParents = (currentItem: ITreeItem) => {
				if (currentItem.parent?.checkbox !== undefined && currentItem.parent.children) {
					if (visitedParents.has(currentItem.parent)) {
						return;
					} else {
						visitedParents.add(currentItem.parent);
					}

					let someUnchecked = false;
					let someChecked = false;
					for (const child of currentItem.parent.children) {
						if (someUnchecked && someChecked) {
							break;
						}
						if (child.checkbox !== undefined) {
							if (child.checkbox.isChecked) {
								someChecked = true;
							} else {
								someUnchecked = true;
							}
						}
					}
					if (someChecked && !someUnchecked && (currentItem.parent.checkbox.isChecked !== true)) {
						currentItem.parent.checkbox.isChecked = true;
						additionalItems.push(currentItem.parent);
						checkParents(currentItem.parent);
					} else if (someUnchecked && (currentItem.parent.checkbox.isChecked !== false)) {
						currentItem.parent.checkbox.isChecked = false;
						additionalItems.push(currentItem.parent);
						checkParents(currentItem.parent);
					}
				}
			};
			checkParents(item);
		}
	}

	return items.concat(additionalItems);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/viewFilter.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/viewFilter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Delayer } from '../../../../base/common/async.js';
import * as DOM from '../../../../base/browser/dom.js';
import { IAction } from '../../../../base/common/actions.js';
import { HistoryInputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { badgeBackground, badgeForeground, contrastBorder, asCssVariable } from '../../../../platform/theme/common/colorRegistry.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ContextScopedHistoryInputBox } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { showHistoryKeybindingHint } from '../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { MenuId, MenuRegistry, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { SubmenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Emitter } from '../../../../base/common/event.js';
import { defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';

const viewFilterMenu = new MenuId('menu.view.filter');
export const viewFilterSubmenu = new MenuId('submenu.view.filter');
MenuRegistry.appendMenuItem(viewFilterMenu, {
	submenu: viewFilterSubmenu,
	title: localize('more filters', "More Filters..."),
	group: 'navigation',
	icon: Codicon.filter,
});

class MoreFiltersActionViewItem extends SubmenuEntryActionViewItem {

	private _checked: boolean = false;
	set checked(checked: boolean) {
		if (this._checked !== checked) {
			this._checked = checked;
			this.updateChecked();
		}
	}

	protected override updateChecked(): void {
		if (this.element) {
			this.element.classList.toggle('checked', this._checked);
		}
	}

	override render(container: HTMLElement): void {
		super.render(container);
		this.updateChecked();
	}
}

export interface IFilterWidgetOptions {
	readonly text?: string;
	readonly placeholder?: string;
	readonly ariaLabel?: string;
	readonly history?: string[];
	readonly focusContextKey?: string;
}

export class FilterWidget extends Widget {

	readonly element: HTMLElement;
	private readonly delayedFilterUpdate: Delayer<void>;
	private readonly filterInputBox: HistoryInputBox;
	private readonly filterBadge: HTMLElement;
	private readonly toolbar: MenuWorkbenchToolBar;
	private readonly focusContextKey: IContextKey<boolean> | undefined;

	private readonly _onDidChangeFilterText = this._register(new Emitter<string>());
	readonly onDidChangeFilterText = this._onDidChangeFilterText.event;

	private readonly _onDidAcceptFilterText = this._register(new Emitter<void>());
	readonly onDidAcceptFilterText = this._onDidAcceptFilterText.event;

	private moreFiltersActionViewItem: MoreFiltersActionViewItem | undefined;
	private isMoreFiltersChecked: boolean = false;
	private lastWidth?: number;

	private readonly focusTracker: DOM.IFocusTracker;
	get onDidFocus() { return this.focusTracker.onDidFocus; }
	get onDidBlur() { return this.focusTracker.onDidBlur; }

	constructor(
		private readonly options: IFilterWidgetOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) {
		super();
		this.delayedFilterUpdate = new Delayer<void>(300);
		this._register(toDisposable(() => this.delayedFilterUpdate.cancel()));

		if (options.focusContextKey) {
			this.focusContextKey = new RawContextKey(options.focusContextKey, false).bindTo(contextKeyService);
		}

		this.element = DOM.$('.viewpane-filter');
		[this.filterInputBox, this.focusTracker] = this.createInput(this.element);
		this._register(this.filterInputBox);
		this._register(this.focusTracker);

		const controlsContainer = DOM.append(this.element, DOM.$('.viewpane-filter-controls'));
		this.filterBadge = this.createBadge(controlsContainer);
		this.toolbar = this._register(this.createToolBar(controlsContainer));

		this.adjustInputBox();
	}

	hasFocus(): boolean {
		return this.filterInputBox.hasFocus();
	}

	focus(): void {
		this.filterInputBox.focus();
	}

	blur(): void {
		this.filterInputBox.blur();
	}

	updateBadge(message: string | undefined): void {
		this.filterBadge.classList.toggle('hidden', !message);
		this.filterBadge.textContent = message || '';
		this.adjustInputBox();
	}

	setFilterText(filterText: string): void {
		this.filterInputBox.value = filterText;
	}

	getFilterText(): string {
		return this.filterInputBox.value;
	}

	getHistory(): string[] {
		return this.filterInputBox.getHistory();
	}

	layout(width: number): void {
		this.element.parentElement?.classList.toggle('grow', width > 700);
		this.element.classList.toggle('small', width < 400);
		this.adjustInputBox();
		this.lastWidth = width;
	}

	relayout() {
		if (this.lastWidth) {
			this.layout(this.lastWidth);
		}
	}

	checkMoreFilters(checked: boolean): void {
		this.isMoreFiltersChecked = checked;
		if (this.moreFiltersActionViewItem) {
			this.moreFiltersActionViewItem.checked = checked;
		}
	}

	private createInput(container: HTMLElement): [ContextScopedHistoryInputBox, DOM.IFocusTracker] {
		const history = this.options.history || [];
		const inputBox = this._register(this.instantiationService.createInstance(ContextScopedHistoryInputBox, container, this.contextViewService, {
			placeholder: this.options.placeholder,
			ariaLabel: this.options.ariaLabel,
			history: new Set(history),
			showHistoryHint: () => showHistoryKeybindingHint(this.keybindingService),
			inputBoxStyles: defaultInputBoxStyles
		}));
		if (this.options.text) {
			inputBox.value = this.options.text;
		}
		this._register(inputBox.onDidChange(filter => this.delayedFilterUpdate.trigger(() => this.onDidInputChange(inputBox))));
		this._register(DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, (e: StandardKeyboardEvent) => this.onInputKeyDown(e)));
		this._register(DOM.addStandardDisposableListener(container, DOM.EventType.KEY_DOWN, (e: StandardKeyboardEvent) => this.handleKeyboardEvent(e)));
		this._register(DOM.addStandardDisposableListener(container, DOM.EventType.KEY_UP, (e: StandardKeyboardEvent) => this.handleKeyboardEvent(e)));
		this._register(DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.CLICK, (e) => {
			e.stopPropagation();
			e.preventDefault();
		}));

		const focusTracker = this._register(DOM.trackFocus(inputBox.inputElement));
		if (this.focusContextKey) {
			this._register(focusTracker.onDidFocus(() => this.focusContextKey!.set(true)));
			this._register(focusTracker.onDidBlur(() => this.focusContextKey!.set(false)));
			this._register(toDisposable(() => this.focusContextKey!.reset()));
		}
		return [inputBox, focusTracker];
	}

	private createBadge(container: HTMLElement): HTMLElement {
		const filterBadge = DOM.append(container, DOM.$('.viewpane-filter-badge.hidden'));
		filterBadge.style.backgroundColor = asCssVariable(badgeBackground);
		filterBadge.style.color = asCssVariable(badgeForeground);
		filterBadge.style.border = `1px solid ${asCssVariable(contrastBorder)}`;
		return filterBadge;
	}

	private createToolBar(container: HTMLElement): MenuWorkbenchToolBar {
		return this.instantiationService.createInstance(MenuWorkbenchToolBar, container, viewFilterMenu,
			{
				hiddenItemStrategy: HiddenItemStrategy.NoHide,
				actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
					if (action instanceof SubmenuItemAction && action.item.submenu.id === viewFilterSubmenu.id) {
						this.moreFiltersActionViewItem = this.instantiationService.createInstance(MoreFiltersActionViewItem, action, options);
						this.moreFiltersActionViewItem.checked = this.isMoreFiltersChecked;
						return this.moreFiltersActionViewItem;
					}
					return undefined;
				}
			});
	}

	private onDidInputChange(inputbox: HistoryInputBox) {
		inputbox.addToHistory();
		this._onDidChangeFilterText.fire(inputbox.value);
	}

	private adjustInputBox(): void {
		this.filterInputBox.inputElement.style.paddingRight = this.element.classList.contains('small') || this.filterBadge.classList.contains('hidden') ? '25px' : '150px';
	}

	// Action toolbar is swallowing some keys for action items which should not be for an input box
	private handleKeyboardEvent(event: StandardKeyboardEvent) {
		if (event.equals(KeyCode.Space)
			|| event.equals(KeyCode.LeftArrow)
			|| event.equals(KeyCode.RightArrow)
			|| event.equals(KeyCode.Home)
			|| event.equals(KeyCode.End)
		) {
			event.stopPropagation();
		}
	}

	private onInputKeyDown(event: StandardKeyboardEvent) {
		let handled = false;
		if (event.equals(KeyCode.Tab) && !this.toolbar.isEmpty()) {
			this.toolbar.focus();
			handled = true;
		}
		if (event.equals(KeyCode.Enter)) {
			this._onDidAcceptFilterText.fire();
			handled = true;
		}
		if (handled) {
			event.stopPropagation();
			event.preventDefault();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/viewMenuActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/viewMenuActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getActionBarActions, PrimaryAndSecondaryActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuId, IMenuActionOptions, IMenuService, IMenu } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService, ViewContainer, ViewContainerLocationToString } from '../../../common/views.js';

export class ViewMenuActions extends Disposable {

	private readonly menu: IMenu;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	constructor(
		readonly menuId: MenuId,
		private readonly contextMenuId: MenuId | undefined,
		private readonly options: IMenuActionOptions | undefined,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
	) {
		super();
		this.menu = this._register(menuService.createMenu(menuId, contextKeyService, { emitEventsForSubmenuChanges: true }));
		this._register(this.menu.onDidChange(() => {
			this.actions = undefined;
			this._onDidChange.fire();
		}));
	}

	private actions: PrimaryAndSecondaryActions | undefined;
	private getActions(): PrimaryAndSecondaryActions {
		if (!this.actions) {
			this.actions = getActionBarActions(this.menu.getActions(this.options));
		}
		return this.actions;
	}

	getPrimaryActions(): IAction[] {
		return this.getActions().primary;
	}

	getSecondaryActions(): IAction[] {
		return this.getActions().secondary;
	}

	getContextMenuActions(): IAction[] {
		if (this.contextMenuId) {
			const menu = this.menuService.getMenuActions(this.contextMenuId, this.contextKeyService, this.options);
			return getActionBarActions(menu).secondary;
		}
		return [];
	}
}

export class ViewContainerMenuActions extends ViewMenuActions {
	constructor(
		element: HTMLElement,
		viewContainer: ViewContainer,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IMenuService menuService: IMenuService,
	) {
		const scopedContextKeyService = contextKeyService.createScoped(element);
		scopedContextKeyService.createKey('viewContainer', viewContainer.id);
		const viewContainerLocationKey = scopedContextKeyService.createKey('viewContainerLocation', ViewContainerLocationToString(viewDescriptorService.getViewContainerLocation(viewContainer)!));
		super(MenuId.ViewContainerTitle, MenuId.ViewContainerTitleContext, { shouldForwardArgs: true, renderShortTitle: true }, scopedContextKeyService, menuService);
		this._register(scopedContextKeyService);
		this._register(Event.filter(viewDescriptorService.onDidChangeContainerLocation, e => e.viewContainer === viewContainer)(() => viewContainerLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewContainerLocation(viewContainer)!))));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/viewPane.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/viewPane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/paneviewlet.css';
import * as nls from '../../../../nls.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { asCssVariable, foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { after, append, $, trackFocus, EventType, addDisposableListener, Dimension, reset, isAncestorOfActiveElement, isActiveElement } from '../../../../base/browser/dom.js';
import { createCSSRule } from '../../../../base/browser/domStylesheets.js';
import { asCssValueWithDefault, asCSSUrl } from '../../../../base/browser/cssValue.js';
import { DisposableMap, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { Action, IAction, IActionRunner } from '../../../../base/common/actions.js';
import { ActionsOrientation, IActionViewItem, prepareActions } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IPaneOptions, Pane, IPaneStyles } from '../../../../base/browser/ui/splitview/paneview.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as ViewContainerExtensions, IView, IViewDescriptorService, ViewContainerLocation, IViewsRegistry, IViewContentDescriptor, defaultViewIcon, ViewContainerLocationToString } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { assertReturnsDefined, PartialExcept } from '../../../../base/common/types.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { MenuId, Action2, IAction2Options, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { Orientation } from '../../../../base/browser/ui/sash/sash.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { AbstractProgressScope, ScopedProgressIndicator } from '../../../services/progress/browser/progressIndicator.js';
import { IProgressIndicator } from '../../../../platform/progress/common/progress.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { URI } from '../../../../base/common/uri.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IDropdownMenuActionViewItemOptions } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { WorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { FilterWidget, IFilterWidgetOptions } from './viewFilter.js';
import { BaseActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { defaultButtonStyles, defaultProgressBarStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IListStyles } from '../../../../base/browser/ui/list/listWidget.js';
import { PANEL_BACKGROUND, PANEL_SECTION_DRAG_AND_DROP_BACKGROUND, PANEL_STICKY_SCROLL_BACKGROUND, PANEL_STICKY_SCROLL_BORDER, PANEL_STICKY_SCROLL_SHADOW, SIDE_BAR_BACKGROUND, SIDE_BAR_DRAG_AND_DROP_BACKGROUND, SIDE_BAR_STICKY_SCROLL_BACKGROUND, SIDE_BAR_STICKY_SCROLL_BORDER, SIDE_BAR_STICKY_SCROLL_SHADOW } from '../../../common/theme.js';
import { IAccessibleViewInformationService } from '../../../services/accessibility/common/accessibleViewInformationService.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { ViewMenuActions } from './viewMenuActions.js';

export enum ViewPaneShowActions {
	/** Show the actions when the view is hovered. This is the default behavior. */
	Default,

	/** Always shows the actions when the view is expanded */
	WhenExpanded,

	/** Always shows the actions */
	Always,
}

export interface IViewPaneOptions extends IPaneOptions {
	readonly id: string;
	readonly showActions?: ViewPaneShowActions;
	readonly titleMenuId?: MenuId;
	readonly donotForwardArgs?: boolean;
	// The title of the container pane when it is merged with the view container
	readonly singleViewPaneContainerTitle?: string;
}

export interface IFilterViewPaneOptions extends IViewPaneOptions {
	filterOptions: IFilterWidgetOptions;
}

export const VIEWPANE_FILTER_ACTION = new Action('viewpane.action.filter');

const viewPaneContainerExpandedIcon = registerIcon('view-pane-container-expanded', Codicon.chevronDown, nls.localize('viewPaneContainerExpandedIcon', 'Icon for an expanded view pane container.'));
const viewPaneContainerCollapsedIcon = registerIcon('view-pane-container-collapsed', Codicon.chevronRight, nls.localize('viewPaneContainerCollapsedIcon', 'Icon for a collapsed view pane container.'));

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);

interface IItem {
	readonly descriptor: IViewContentDescriptor;
	visible: boolean;
}

interface IViewWelcomeDelegate {
	readonly id: string;
	readonly onDidChangeViewWelcomeState: Event<void>;
	shouldShowWelcome(): boolean;
}

class ViewWelcomeController {

	private defaultItem: IItem | undefined;
	private items: IItem[] = [];

	get enabled(): boolean { return this._enabled; }
	private _enabled: boolean = false;
	private element: HTMLElement | undefined;
	private scrollableElement: DomScrollableElement | undefined;

	private readonly disposables = new DisposableStore();
	private readonly enabledDisposables = this.disposables.add(new DisposableStore());
	private readonly renderDisposables = this.disposables.add(new DisposableStore());

	constructor(
		private readonly container: HTMLElement,
		private readonly delegate: IViewWelcomeDelegate,
		@IInstantiationService private instantiationService: IInstantiationService,
		@IOpenerService protected openerService: IOpenerService,
		@IContextKeyService private contextKeyService: IContextKeyService,
		@ILifecycleService lifecycleService: ILifecycleService
	) {
		this.disposables.add(Event.runAndSubscribe(this.delegate.onDidChangeViewWelcomeState, () => this.onDidChangeViewWelcomeState()));
		this.disposables.add(lifecycleService.onWillShutdown(() => this.dispose())); // Fixes https://github.com/microsoft/vscode/issues/208878
	}

	layout(height: number, width: number) {
		if (!this._enabled) {
			return;
		}

		this.element!.style.height = `${height}px`;
		this.element!.style.width = `${width}px`;
		this.element!.classList.toggle('wide', width > 640);
		this.scrollableElement!.scanDomNode();
	}

	focus() {
		if (!this._enabled) {
			return;
		}

		this.element!.focus();
	}

	private onDidChangeViewWelcomeState(): void {
		const enabled = this.delegate.shouldShowWelcome();

		if (this._enabled === enabled) {
			return;
		}

		this._enabled = enabled;

		if (!enabled) {
			this.enabledDisposables.clear();
			return;
		}

		this.container.classList.add('welcome');
		const viewWelcomeContainer = append(this.container, $('.welcome-view'));
		this.element = $('.welcome-view-content', { tabIndex: 0 });
		this.scrollableElement = new DomScrollableElement(this.element, { alwaysConsumeMouseWheel: true, horizontal: ScrollbarVisibility.Hidden, vertical: ScrollbarVisibility.Visible, });
		append(viewWelcomeContainer, this.scrollableElement.getDomNode());

		this.enabledDisposables.add(toDisposable(() => {
			this.container.classList.remove('welcome');
			this.scrollableElement!.dispose();
			viewWelcomeContainer.remove();
			this.scrollableElement = undefined;
			this.element = undefined;
		}));

		this.contextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.enabledDisposables);
		Event.chain(viewsRegistry.onDidChangeViewWelcomeContent, $ => $.filter(id => id === this.delegate.id))
			(this.onDidChangeViewWelcomeContent, this, this.enabledDisposables);
		this.onDidChangeViewWelcomeContent();
	}

	private onDidChangeViewWelcomeContent(): void {
		const descriptors = viewsRegistry.getViewWelcomeContent(this.delegate.id);

		this.items = [];

		for (const descriptor of descriptors) {
			if (descriptor.when === 'default') {
				this.defaultItem = { descriptor, visible: true };
			} else {
				const visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;
				this.items.push({ descriptor, visible });
			}
		}

		this.render();
	}

	private onDidChangeContext(): void {
		let didChange = false;

		for (const item of this.items) {
			if (!item.descriptor.when || item.descriptor.when === 'default') {
				continue;
			}

			const visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);

			if (item.visible === visible) {
				continue;
			}

			item.visible = visible;
			didChange = true;
		}

		if (didChange) {
			this.render();
		}
	}

	private render(): void {
		this.renderDisposables.clear();
		this.element!.textContent = '';

		const contents = this.getContentDescriptors();

		if (contents.length === 0) {
			this.container.classList.remove('welcome');
			this.scrollableElement!.scanDomNode();
			return;
		}

		let buttonsCount = 0;
		for (const { content, precondition, renderSecondaryButtons } of contents) {
			const lines = content.split('\n');

			for (let line of lines) {
				line = line.trim();

				if (!line) {
					continue;
				}

				const linkedText = parseLinkedText(line);

				if (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {
					const node = linkedText.nodes[0];
					const buttonContainer = append(this.element!, $('.button-container'));
					const button = new Button(buttonContainer, { title: node.title, supportIcons: true, secondary: !!(renderSecondaryButtons && buttonsCount > 0), ...defaultButtonStyles, });
					button.label = node.label;
					button.onDidClick(_ => {
						this.openerService.open(node.href, { allowCommands: true });
					}, null, this.renderDisposables);
					this.renderDisposables.add(button);
					buttonsCount++;

					if (precondition) {
						const updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);
						updateEnablement();

						const keys = new Set(precondition.keys());
						const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
						onDidChangeContext(updateEnablement, null, this.renderDisposables);
					}
				} else {
					const p = append(this.element!, $('p'));

					for (const node of linkedText.nodes) {
						if (typeof node === 'string') {
							append(p, ...renderLabelWithIcons(node));
						} else {
							const link = this.renderDisposables.add(this.instantiationService.createInstance(Link, p, node, {}));

							if (precondition && node.href.startsWith('command:')) {
								const updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);
								updateEnablement();

								const keys = new Set(precondition.keys());
								const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
								onDidChangeContext(updateEnablement, null, this.renderDisposables);
							}
						}
					}
				}
			}
		}

		this.container.classList.add('welcome');
		this.scrollableElement!.scanDomNode();
	}

	private getContentDescriptors(): IViewContentDescriptor[] {
		const visibleItems = this.items.filter(v => v.visible);

		if (visibleItems.length === 0 && this.defaultItem) {
			return [this.defaultItem.descriptor];
		}

		return visibleItems.map(v => v.descriptor);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

export abstract class ViewPane extends Pane implements IView {

	private static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';

	private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	private _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur: Event<void> = this._onDidBlur.event;

	private _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;

	protected _onDidChangeTitleArea = this._register(new Emitter<void>());
	readonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;

	protected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());
	readonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;

	private _isVisible: boolean = false;
	readonly id: string;

	private _title: string;
	public get title(): string {
		return this._title;
	}

	private _titleDescription: string | undefined;
	public get titleDescription(): string | undefined {
		return this._titleDescription;
	}

	private _singleViewPaneContainerTitle: string | undefined;
	public get singleViewPaneContainerTitle(): string | undefined {
		return this._singleViewPaneContainerTitle;
	}

	readonly menuActions: ViewMenuActions;

	private progressBar?: ProgressBar;
	private progressIndicator?: IProgressIndicator;

	private toolbar?: WorkbenchToolBar;
	private readonly showActions: ViewPaneShowActions;
	private headerContainer?: HTMLElement;
	private titleContainer?: HTMLElement;
	private titleContainerHover?: IManagedHover;
	private titleDescriptionContainer?: HTMLElement;
	private titleDescriptionContainerHover?: IManagedHover;
	private iconContainer?: HTMLElement;
	private iconContainerHover?: IManagedHover;
	protected twistiesContainer?: HTMLElement;
	private viewWelcomeController?: ViewWelcomeController;

	private readonly headerActionViewItems: DisposableMap<string, IActionViewItem> = this._register(new DisposableMap());

	protected readonly scopedContextKeyService: IContextKeyService;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService protected keybindingService: IKeybindingService,
		@IContextMenuService protected contextMenuService: IContextMenuService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
		@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IOpenerService protected openerService: IOpenerService,
		@IThemeService protected themeService: IThemeService,
		@IHoverService protected readonly hoverService: IHoverService,
		protected readonly accessibleViewInformationService?: IAccessibleViewInformationService
	) {
		super({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });

		this.id = options.id;
		this._title = options.title;
		this._titleDescription = options.titleDescription;
		this._singleViewPaneContainerTitle = options.singleViewPaneContainerTitle;
		this.showActions = options.showActions ?? ViewPaneShowActions.Default;

		this.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this.scopedContextKeyService.createKey('view', this.id);
		const viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));
		this._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));

		const childInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		this.menuActions = this._register(childInstantiationService.createInstance(ViewMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs, renderShortTitle: true }));
		this._register(this.menuActions.onDidChange(() => this.updateActions()));
	}

	override get headerVisible(): boolean {
		return super.headerVisible;
	}

	override set headerVisible(visible: boolean) {
		super.headerVisible = visible;
		this.element.classList.toggle('merged-header', !visible);
	}

	setVisible(visible: boolean): void {
		if (this._isVisible !== visible) {
			this._isVisible = visible;

			if (this.isExpanded()) {
				this._onDidChangeBodyVisibility.fire(visible);
			}
		}
	}

	isVisible(): boolean {
		return this._isVisible;
	}

	isBodyVisible(): boolean {
		return this._isVisible && this.isExpanded();
	}

	override setExpanded(expanded: boolean): boolean {
		const changed = super.setExpanded(expanded);
		if (changed) {
			this._onDidChangeBodyVisibility.fire(expanded);
		}
		this.updateTwistyIcon();
		return changed;
	}

	override render(): void {
		super.render();

		const focusTracker = trackFocus(this.element);
		this._register(focusTracker);
		this._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));
		this._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));
	}

	protected renderHeader(container: HTMLElement): void {
		this.headerContainer = container;

		this.twistiesContainer = append(container, $(`.twisty-container${ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))}`));

		this.renderHeaderTitle(container, this.title);

		const actions = append(container, $('.actions'));
		actions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);
		actions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);
		this.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {
			orientation: ActionsOrientation.HORIZONTAL,
			actionViewItemProvider: (action, options) => {
				const item = this.createActionViewItem(action, options);
				if (item) {
					this.headerActionViewItems.set(item.action.id, item);
				}
				return item;
			},
			ariaLabel: nls.localize('viewToolbarAriaLabel', "{0} actions", this.title),
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			renderDropdownAsChildElement: true,
			actionRunner: this.getActionRunner(),
			resetMenu: this.menuActions.menuId
		});

		this._register(this.toolbar);
		this.setActions();

		this._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));

		const viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);
		if (viewContainerModel) {
			this._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));
		} else {
			console.error(`View container model not found for view ${this.id}`);
		}

		const onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));
		this._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));
		this.updateActionsVisibility();
	}

	protected override updateHeader(): void {
		super.updateHeader();
		this.updateTwistyIcon();
	}

	private updateTwistyIcon(): void {
		if (this.twistiesContainer) {
			this.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!this._expanded)));
			this.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(this._expanded)));
		}
	}

	protected getTwistyIcon(expanded: boolean): ThemeIcon {
		return expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;
	}

	override style(styles: IPaneStyles): void {
		super.style(styles);

		const icon = this.getIcon();
		if (this.iconContainer) {
			const fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));
			if (URI.isUri(icon)) {
				// Apply background color to activity bar item provided with iconUrls
				this.iconContainer.style.backgroundColor = fgColor;
				this.iconContainer.style.color = '';
			} else {
				// Apply foreground color to activity bar items provided with codicons
				this.iconContainer.style.color = fgColor;
				this.iconContainer.style.backgroundColor = '';
			}
		}
	}

	private getIcon(): ThemeIcon | URI {
		return this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;
	}

	protected renderHeaderTitle(container: HTMLElement, title: string): void {
		this.iconContainer = append(container, $('.icon', undefined));
		const icon = this.getIcon();

		let cssClass: string | undefined = undefined;
		if (URI.isUri(icon)) {
			cssClass = `view-${this.id.replace(/[\.\:]/g, '-')}`;
			const iconClass = `.pane-header .icon.${cssClass}`;

			createCSSRule(iconClass, `
				mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				mask-size: 24px;
				-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				-webkit-mask-size: 16px;
			`);
		} else if (ThemeIcon.isThemeIcon(icon)) {
			cssClass = ThemeIcon.asClassName(icon);
		}

		if (cssClass) {
			this.iconContainer.classList.add(...cssClass.split(' '));
		}

		const calculatedTitle = this.calculateTitle(title);
		this.titleContainer = append(container, $('h3.title', {}, calculatedTitle));
		this.titleContainerHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.titleContainer, calculatedTitle));

		if (this._titleDescription) {
			this.setTitleDescription(this._titleDescription);
		}

		this.iconContainerHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.iconContainer, calculatedTitle));
		this.iconContainer.setAttribute('aria-label', this._getAriaLabel(calculatedTitle, this._titleDescription));
	}

	private _getAriaLabel(title: string, description: string | undefined): string {
		const viewHasAccessibilityHelpContent = this.viewDescriptorService.getViewDescriptorById(this.id)?.accessibilityHelpContent;
		const accessibleViewHasShownForView = this.accessibleViewInformationService?.hasShownAccessibleView(this.id);
		if (!viewHasAccessibilityHelpContent || accessibleViewHasShownForView) {
			if (description) {
				return `${title} - ${description}`;
			} else {
				return title;
			}
		}

		return nls.localize('viewAccessibilityHelp', 'Use Alt+F1 for accessibility help {0}', title);
	}

	protected updateTitle(title: string): void {
		const calculatedTitle = this.calculateTitle(title);
		if (this.titleContainer) {
			this.titleContainer.textContent = calculatedTitle;
			this.titleContainerHover?.update(calculatedTitle);
		}

		this.updateAriaHeaderLabel(calculatedTitle, this._titleDescription);

		this._title = title;
		this._onDidChangeTitleArea.fire();
	}

	private updateAriaHeaderLabel(title: string, description: string | undefined) {
		const ariaLabel = this._getAriaLabel(title, description);
		if (this.iconContainer) {
			this.iconContainerHover?.update(title);
			this.iconContainer.setAttribute('aria-label', ariaLabel);
		}
		this.ariaHeaderLabel = this.getAriaHeaderLabel(ariaLabel);
	}

	private setTitleDescription(description: string | undefined) {
		if (this.titleDescriptionContainer) {
			this.titleDescriptionContainer.textContent = description ?? '';
			this.titleDescriptionContainerHover?.update(description ?? '');
		}
		else if (description && this.titleContainer) {
			this.titleDescriptionContainer = after(this.titleContainer, $('span.description', {}, description));
			this.titleDescriptionContainerHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.titleDescriptionContainer, description));
		}
	}

	protected updateTitleDescription(description?: string | undefined): void {
		this.setTitleDescription(description);
		this.updateAriaHeaderLabel(this._title, description);
		this._titleDescription = description;
		this._onDidChangeTitleArea.fire();
	}

	private calculateTitle(title: string): string {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;
		const model = this.viewDescriptorService.getViewContainerModel(viewContainer);
		const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);
		const isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;

		if (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle && title !== viewDescriptor.containerTitle) {
			return `${viewDescriptor.containerTitle}: ${title}`;
		}

		return title;
	}

	protected renderBody(container: HTMLElement): void {
		this.viewWelcomeController = this._register(this.instantiationService.createInstance(ViewWelcomeController, container, this));
	}

	protected layoutBody(height: number, width: number): void {
		this.viewWelcomeController?.layout(height, width);
	}

	onDidScrollRoot() {
		// noop
	}

	getProgressIndicator() {
		if (this.progressBar === undefined) {
			this.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));
			this.progressBar.hide();
		}

		if (this.progressIndicator === undefined) {
			const that = this;
			this.progressIndicator = this._register(new ScopedProgressIndicator(assertReturnsDefined(this.progressBar), this._register(new class extends AbstractProgressScope {
				constructor() {
					super(that.id, that.isBodyVisible());
					this._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));
				}
			}())));
		}
		return this.progressIndicator;
	}

	protected getProgressLocation(): string {
		return this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;
	}

	protected getLocationBasedColors(): IViewPaneLocationColors {
		return getLocationBasedViewColors(this.viewDescriptorService.getViewLocationById(this.id));
	}

	focus(): void {
		if (this.viewWelcomeController?.enabled) {
			this.viewWelcomeController.focus();
		} else if (this.element) {
			this.element.focus();
		}
		if (isActiveElement(this.element) || isAncestorOfActiveElement(this.element)) {
			this._onDidFocus.fire();
		}
	}

	private setActions(): void {
		if (this.toolbar) {
			const primaryActions = [...this.menuActions.getPrimaryActions()];
			if (this.shouldShowFilterInHeader()) {
				primaryActions.unshift(VIEWPANE_FILTER_ACTION);
			}
			this.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));
			this.toolbar.context = this.getActionsContext();
		}
	}

	private updateActionsVisibility(): void {
		if (!this.headerContainer) {
			return;
		}
		const shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');
		this.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);
	}

	protected updateActions(): void {
		this.setActions();
		this._onDidChangeTitleArea.fire();
	}

	createActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === VIEWPANE_FILTER_ACTION.id) {
			const that = this;
			return new class extends BaseActionViewItem {
				constructor() { super(null, action); }
				override setFocusable(): void { /* noop input elements are focusable by default */ }
				override get trapsArrowNavigation(): boolean { return true; }
				override render(container: HTMLElement): void {
					container.classList.add('viewpane-filter-container');
					const filter = that.getFilterWidget()!;
					append(container, filter.element);
					filter.relayout();
				}
			};
		}
		return createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });
	}

	getActionsContext(): unknown {
		return undefined;
	}

	getActionRunner(): IActionRunner | undefined {
		return undefined;
	}

	getOptimalWidth(): number {
		return 0;
	}

	saveState(): void {
		// Subclasses to implement for saving state
	}

	shouldShowWelcome(): boolean {
		return false;
	}

	getFilterWidget(): FilterWidget | undefined {
		return undefined;
	}

	shouldShowFilterInHeader(): boolean {
		return false;
	}
}

export abstract class FilterViewPane extends ViewPane {

	readonly filterWidget: FilterWidget;
	private dimension: Dimension | undefined;
	protected filterContainer: HTMLElement | undefined;

	constructor(
		options: IFilterViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		accessibleViewService?: IAccessibleViewInformationService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService, accessibleViewService);
		const childInstantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		this.filterWidget = this._register(childInstantiationService.createInstance(FilterWidget, options.filterOptions));
		this._register(this.filterWidget.onDidAcceptFilterText(() => this.focusBodyContent()));
	}

	override getFilterWidget(): FilterWidget {
		return this.filterWidget;
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.filterContainer = append(container, $('.viewpane-filter-container'));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);

		this.dimension = new Dimension(width, height);
		const wasFilterShownInHeader = !this.filterContainer?.hasChildNodes();
		const shouldShowFilterInHeader = this.shouldShowFilterInHeader();
		if (wasFilterShownInHeader !== shouldShowFilterInHeader) {
			if (shouldShowFilterInHeader) {
				reset(this.filterContainer!);
			}
			this.updateActions();
			if (!shouldShowFilterInHeader) {
				append(this.filterContainer!, this.filterWidget.element);
			}
		}
		if (!shouldShowFilterInHeader) {
			height = height - 44;
		}
		this.filterWidget.layout(width);
		this.layoutBodyContent(height, width);
	}

	override shouldShowFilterInHeader(): boolean {
		return !(this.dimension && this.dimension.width < 600 && this.dimension.height > 100);
	}

	protected abstract layoutBodyContent(height: number, width: number): void;

	protected focusBodyContent(): void {
		this.focus();
	}
}

export interface IViewPaneLocationColors {
	background: string;
	overlayBackground: string;
	listOverrideStyles: PartialExcept<IListStyles, 'listBackground' | 'treeStickyScrollBackground'>;
}

export function getLocationBasedViewColors(location: ViewContainerLocation | null): IViewPaneLocationColors {
	let background, overlayBackground, stickyScrollBackground, stickyScrollBorder, stickyScrollShadow;

	switch (location) {
		case ViewContainerLocation.Panel:
			background = PANEL_BACKGROUND;
			overlayBackground = PANEL_SECTION_DRAG_AND_DROP_BACKGROUND;
			stickyScrollBackground = PANEL_STICKY_SCROLL_BACKGROUND;
			stickyScrollBorder = PANEL_STICKY_SCROLL_BORDER;
			stickyScrollShadow = PANEL_STICKY_SCROLL_SHADOW;
			break;

		case ViewContainerLocation.Sidebar:
		case ViewContainerLocation.AuxiliaryBar:
		default:
			background = SIDE_BAR_BACKGROUND;
			overlayBackground = SIDE_BAR_DRAG_AND_DROP_BACKGROUND;
			stickyScrollBackground = SIDE_BAR_STICKY_SCROLL_BACKGROUND;
			stickyScrollBorder = SIDE_BAR_STICKY_SCROLL_BORDER;
			stickyScrollShadow = SIDE_BAR_STICKY_SCROLL_SHADOW;
	}

	return {
		background,
		overlayBackground,
		listOverrideStyles: {
			listBackground: background,
			treeStickyScrollBackground: stickyScrollBackground,
			treeStickyScrollBorder: stickyScrollBorder,
			treeStickyScrollShadow: stickyScrollShadow
		}
	};
}

export abstract class ViewAction<T extends IView> extends Action2 {
	override readonly desc: Readonly<IAction2Options> & { viewId: string };
	constructor(desc: Readonly<IAction2Options> & { viewId: string }) {
		super(desc);
		this.desc = desc;
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): unknown {
		const view = accessor.get(IViewsService).getActiveViewWithId(this.desc.viewId);
		if (view) {
			return this.runInView(accessor, <T>view, ...args);
		}
		return undefined;
	}

	abstract runInView(accessor: ServicesAccessor, view: T, ...args: unknown[]): unknown;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/viewPaneContainer.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/viewPaneContainer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, Dimension, DragAndDropObserver, EventType, getWindow, isAncestor } from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { EventType as TouchEventType, Gesture } from '../../../../base/browser/touch.js';
import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IBoundarySashes, Orientation } from '../../../../base/browser/ui/sash/sash.js';
import { IPaneViewOptions, PaneView } from '../../../../base/browser/ui/splitview/paneview.js';
import { IAction } from '../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { combinedDisposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import './media/paneviewlet.css';
import * as nls from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IAction2Options, ISubmenuItem, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { activeContrastBorder, asCssVariable } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { CompositeDragAndDropObserver, toggleDropEffect } from '../../dnd.js';
import { ViewPane } from './viewPane.js';
import { IViewletViewOptions } from './viewsViewlet.js';
import { Component } from '../../../common/component.js';
import { PANEL_SECTION_BORDER, PANEL_SECTION_DRAG_AND_DROP_BACKGROUND, PANEL_SECTION_HEADER_BACKGROUND, PANEL_SECTION_HEADER_BORDER, PANEL_SECTION_HEADER_FOREGROUND, SIDE_BAR_DRAG_AND_DROP_BACKGROUND, SIDE_BAR_SECTION_HEADER_BACKGROUND, SIDE_BAR_SECTION_HEADER_BORDER, SIDE_BAR_SECTION_HEADER_FOREGROUND } from '../../../common/theme.js';
import { IAddedViewDescriptorRef, ICustomViewDescriptor, IView, IViewContainerModel, IViewDescriptor, IViewDescriptorRef, IViewDescriptorService, IViewPaneContainer, ViewContainer, ViewContainerLocation, ViewVisibilityState } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { isHorizontal, IWorkbenchLayoutService, LayoutSettings } from '../../../services/layout/browser/layoutService.js';
import { IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ViewContainerMenuActions } from './viewMenuActions.js';

export const ViewsSubMenu = new MenuId('Views');
MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
	submenu: ViewsSubMenu,
	title: nls.localize('views', "Views"),
	order: 1,
} satisfies ISubmenuItem);

export interface IViewPaneContainerOptions extends IPaneViewOptions {
	mergeViewWithContainerWhenSingleView: boolean;
}

interface IViewPaneItem {
	pane: ViewPane;
	disposable: IDisposable;
}

const enum DropDirection {
	UP,
	DOWN,
	LEFT,
	RIGHT
}

type BoundingRect = { top: number; left: number; bottom: number; right: number };

class ViewPaneDropOverlay extends Themable {

	private static readonly OVERLAY_ID = 'monaco-pane-drop-overlay';

	private container!: HTMLElement;
	private overlay!: HTMLElement;

	private _currentDropOperation: DropDirection | undefined;

	// private currentDropOperation: IDropOperation | undefined;
	private _disposed: boolean | undefined;

	private cleanupOverlayScheduler: RunOnceScheduler;

	get currentDropOperation(): DropDirection | undefined {
		return this._currentDropOperation;
	}

	constructor(
		private paneElement: HTMLElement,
		private orientation: Orientation | undefined,
		private bounds: BoundingRect | undefined,
		protected location: ViewContainerLocation,
		themeService: IThemeService,
	) {
		super(themeService);
		this.cleanupOverlayScheduler = this._register(new RunOnceScheduler(() => this.dispose(), 300));

		this.create();
	}

	get disposed(): boolean {
		return !!this._disposed;
	}

	private create(): void {

		// Container
		this.container = $('div', { id: ViewPaneDropOverlay.OVERLAY_ID });
		this.container.style.top = '0px';

		// Parent
		this.paneElement.appendChild(this.container);
		this.paneElement.classList.add('dragged-over');
		this._register(toDisposable(() => {
			this.container.remove();
			this.paneElement.classList.remove('dragged-over');
		}));

		// Overlay
		this.overlay = $('.pane-overlay-indicator');
		this.container.appendChild(this.overlay);

		// Overlay Event Handling
		this.registerListeners();

		// Styles
		this.updateStyles();
	}

	override updateStyles(): void {

		// Overlay drop background
		this.overlay.style.backgroundColor = this.getColor(this.location === ViewContainerLocation.Panel ? PANEL_SECTION_DRAG_AND_DROP_BACKGROUND : SIDE_BAR_DRAG_AND_DROP_BACKGROUND) || '';

		// Overlay contrast border (if any)
		const activeContrastBorderColor = this.getColor(activeContrastBorder);
		this.overlay.style.outlineColor = activeContrastBorderColor || '';
		this.overlay.style.outlineOffset = activeContrastBorderColor ? '-2px' : '';
		this.overlay.style.outlineStyle = activeContrastBorderColor ? 'dashed' : '';
		this.overlay.style.outlineWidth = activeContrastBorderColor ? '2px' : '';

		this.overlay.style.borderColor = activeContrastBorderColor || '';
		this.overlay.style.borderStyle = 'solid';
		this.overlay.style.borderWidth = '0px';
	}

	private registerListeners(): void {
		this._register(new DragAndDropObserver(this.container, {
			onDragOver: e => {

				// Position overlay
				this.positionOverlay(e.offsetX, e.offsetY);

				// Make sure to stop any running cleanup scheduler to remove the overlay
				if (this.cleanupOverlayScheduler.isScheduled()) {
					this.cleanupOverlayScheduler.cancel();
				}
			},

			onDragLeave: e => this.dispose(),
			onDragEnd: e => this.dispose(),

			onDrop: e => {
				// Dispose overlay
				this.dispose();
			}
		}));

		this._register(addDisposableListener(this.container, EventType.MOUSE_OVER, () => {
			// Under some circumstances we have seen reports where the drop overlay is not being
			// cleaned up and as such the editor area remains under the overlay so that you cannot
			// type into the editor anymore. This seems related to using VMs and DND via host and
			// guest OS, though some users also saw it without VMs.
			// To protect against this issue we always destroy the overlay as soon as we detect a
			// mouse event over it. The delay is used to guarantee we are not interfering with the
			// actual DROP event that can also trigger a mouse over event.
			if (!this.cleanupOverlayScheduler.isScheduled()) {
				this.cleanupOverlayScheduler.schedule();
			}
		}));
	}

	private positionOverlay(mousePosX: number, mousePosY: number): void {
		const paneWidth = this.paneElement.clientWidth;
		const paneHeight = this.paneElement.clientHeight;

		const splitWidthThreshold = paneWidth / 2;
		const splitHeightThreshold = paneHeight / 2;

		let dropDirection: DropDirection | undefined;

		if (this.orientation === Orientation.VERTICAL) {
			if (mousePosY < splitHeightThreshold) {
				dropDirection = DropDirection.UP;
			} else if (mousePosY >= splitHeightThreshold) {
				dropDirection = DropDirection.DOWN;
			}
		} else if (this.orientation === Orientation.HORIZONTAL) {
			if (mousePosX < splitWidthThreshold) {
				dropDirection = DropDirection.LEFT;
			} else if (mousePosX >= splitWidthThreshold) {
				dropDirection = DropDirection.RIGHT;
			}
		}

		// Draw overlay based on split direction
		switch (dropDirection) {
			case DropDirection.UP:
				this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '50%' });
				break;
			case DropDirection.DOWN:
				this.doPositionOverlay({ bottom: '0', left: '0', width: '100%', height: '50%' });
				break;
			case DropDirection.LEFT:
				this.doPositionOverlay({ top: '0', left: '0', width: '50%', height: '100%' });
				break;
			case DropDirection.RIGHT:
				this.doPositionOverlay({ top: '0', right: '0', width: '50%', height: '100%' });
				break;
			default: {
				// const top = this.bounds?.top || 0;
				// const left = this.bounds?.bottom || 0;

				let top = '0';
				let left = '0';
				let width = '100%';
				let height = '100%';
				if (this.bounds) {
					const boundingRect = this.container.getBoundingClientRect();
					top = `${this.bounds.top - boundingRect.top}px`;
					left = `${this.bounds.left - boundingRect.left}px`;
					height = `${this.bounds.bottom - this.bounds.top}px`;
					width = `${this.bounds.right - this.bounds.left}px`;
				}

				this.doPositionOverlay({ top, left, width, height });
			}
		}

		if ((this.orientation === Orientation.VERTICAL && paneHeight <= 25) ||
			(this.orientation === Orientation.HORIZONTAL && paneWidth <= 25)) {
			this.doUpdateOverlayBorder(dropDirection);
		} else {
			this.doUpdateOverlayBorder(undefined);
		}

		// Make sure the overlay is visible now
		this.overlay.style.opacity = '1';

		// Enable transition after a timeout to prevent initial animation
		setTimeout(() => this.overlay.classList.add('overlay-move-transition'), 0);

		// Remember as current split direction
		this._currentDropOperation = dropDirection;
	}

	private doUpdateOverlayBorder(direction: DropDirection | undefined): void {
		this.overlay.style.borderTopWidth = direction === DropDirection.UP ? '2px' : '0px';
		this.overlay.style.borderLeftWidth = direction === DropDirection.LEFT ? '2px' : '0px';
		this.overlay.style.borderBottomWidth = direction === DropDirection.DOWN ? '2px' : '0px';
		this.overlay.style.borderRightWidth = direction === DropDirection.RIGHT ? '2px' : '0px';
	}

	private doPositionOverlay(options: { top?: string; bottom?: string; left?: string; right?: string; width: string; height: string }): void {

		// Container
		this.container.style.height = '100%';

		// Overlay
		this.overlay.style.top = options.top || '';
		this.overlay.style.left = options.left || '';
		this.overlay.style.bottom = options.bottom || '';
		this.overlay.style.right = options.right || '';
		this.overlay.style.width = options.width;
		this.overlay.style.height = options.height;
	}


	contains(element: HTMLElement): boolean {
		return element === this.container || element === this.overlay;
	}

	override dispose(): void {
		super.dispose();

		this._disposed = true;
	}
}

export class ViewPaneContainer<MementoType extends object = object> extends Component<MementoType> implements IViewPaneContainer {

	readonly viewContainer: ViewContainer;
	private lastFocusedPane: ViewPane | undefined;
	private lastMergedCollapsedPane: ViewPane | undefined;
	private paneItems: IViewPaneItem[] = [];
	private paneview?: PaneView;

	private visible: boolean = false;

	private areExtensionsReady: boolean = false;

	private didLayout = false;
	private dimension: Dimension | undefined;
	private _boundarySashes: IBoundarySashes | undefined;

	private readonly visibleViewsCountFromCache: number | undefined;
	private readonly visibleViewsStorageId: string;
	protected readonly viewContainerModel: IViewContainerModel;

	private readonly _onTitleAreaUpdate: Emitter<void> = this._register(new Emitter<void>());
	readonly onTitleAreaUpdate: Event<void> = this._onTitleAreaUpdate.event;

	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private readonly _onDidAddViews = this._register(new Emitter<IView[]>());
	readonly onDidAddViews = this._onDidAddViews.event;

	private readonly _onDidRemoveViews = this._register(new Emitter<IView[]>());
	readonly onDidRemoveViews = this._onDidRemoveViews.event;

	private readonly _onDidChangeViewVisibility = this._register(new Emitter<IView>());
	readonly onDidChangeViewVisibility = this._onDidChangeViewVisibility.event;

	private readonly _onDidFocusView = this._register(new Emitter<IView>());
	readonly onDidFocusView = this._onDidFocusView.event;

	private readonly _onDidBlurView = this._register(new Emitter<IView>());
	readonly onDidBlurView = this._onDidBlurView.event;

	get onDidSashChange(): Event<number> {
		return assertReturnsDefined(this.paneview).onDidSashChange;
	}

	get panes(): ViewPane[] {
		return this.paneItems.map(i => i.pane);
	}

	get views(): IView[] {
		return this.panes;
	}

	get length(): number {
		return this.paneItems.length;
	}

	private _menuActions?: ViewContainerMenuActions;
	get menuActions(): ViewContainerMenuActions | undefined {
		return this._menuActions;
	}

	constructor(
		id: string,
		private options: IViewPaneContainerOptions,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IConfigurationService protected configurationService: IConfigurationService,
		@IWorkbenchLayoutService protected layoutService: IWorkbenchLayoutService,
		@IContextMenuService protected contextMenuService: IContextMenuService,
		@ITelemetryService protected telemetryService: ITelemetryService,
		@IExtensionService protected extensionService: IExtensionService,
		@IThemeService themeService: IThemeService,
		@IStorageService protected storageService: IStorageService,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,
		@ILogService protected readonly logService: ILogService,
	) {

		super(id, themeService, storageService);

		const container = this.viewDescriptorService.getViewContainerById(id);
		if (!container) {
			throw new Error('Could not find container');
		}


		this.viewContainer = container;
		this.visibleViewsStorageId = `${id}.numberOfVisibleViews`;
		this.visibleViewsCountFromCache = this.storageService.getNumber(this.visibleViewsStorageId, StorageScope.WORKSPACE, undefined);
		this.viewContainerModel = this.viewDescriptorService.getViewContainerModel(container);
	}

	create(parent: HTMLElement): void {
		const options = this.options as IPaneViewOptions;
		options.orientation = this.orientation;
		this.paneview = this._register(new PaneView(parent, this.options));

		if (this._boundarySashes) {
			this.paneview.setBoundarySashes(this._boundarySashes);
		}

		this._register(this.paneview.onDidDrop(({ from, to }) => this.movePane(from as ViewPane, to as ViewPane)));
		this._register(this.paneview.onDidScroll(_ => this.onDidScrollPane()));
		this._register(this.paneview.onDidSashReset((index) => this.onDidSashReset(index)));
		this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, (e: MouseEvent) => this.showContextMenu(new StandardMouseEvent(getWindow(parent), e))));
		this._register(Gesture.addTarget(parent));
		this._register(addDisposableListener(parent, TouchEventType.Contextmenu, (e: MouseEvent) => this.showContextMenu(new StandardMouseEvent(getWindow(parent), e))));

		this._menuActions = this._register(this.instantiationService.createInstance(ViewContainerMenuActions, this.paneview.element, this.viewContainer));
		this._register(this._menuActions.onDidChange(() => this.updateTitleArea()));

		let overlay: ViewPaneDropOverlay | undefined;
		const getOverlayBounds: () => BoundingRect = () => {
			const fullSize = parent.getBoundingClientRect();
			const lastPane = this.panes[this.panes.length - 1].element.getBoundingClientRect();
			const top = this.orientation === Orientation.VERTICAL ? lastPane.bottom : fullSize.top;
			const left = this.orientation === Orientation.HORIZONTAL ? lastPane.right : fullSize.left;

			return {
				top,
				bottom: fullSize.bottom,
				left,
				right: fullSize.right,
			};
		};

		const inBounds = (bounds: BoundingRect, pos: { x: number; y: number }) => {
			return pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom;
		};


		let bounds: BoundingRect;

		this._register(CompositeDragAndDropObserver.INSTANCE.registerTarget(parent, {
			onDragEnter: (e) => {
				bounds = getOverlayBounds();
				if (overlay?.disposed) {
					overlay = undefined;
				}

				if (!overlay && inBounds(bounds, e.eventData)) {
					const dropData = e.dragAndDropData.getData();
					if (dropData.type === 'view') {

						const oldViewContainer = this.viewDescriptorService.getViewContainerByViewId(dropData.id);
						const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(dropData.id);

						if (oldViewContainer !== this.viewContainer && (!viewDescriptor || !viewDescriptor.canMoveView || this.viewContainer.rejectAddedViews)) {
							return;
						}

						overlay = new ViewPaneDropOverlay(parent, undefined, bounds, this.viewDescriptorService.getViewContainerLocation(this.viewContainer)!, this.themeService);
					}

					if (dropData.type === 'composite' && dropData.id !== this.viewContainer.id) {
						const container = this.viewDescriptorService.getViewContainerById(dropData.id)!;
						const viewsToMove = this.viewDescriptorService.getViewContainerModel(container).allViewDescriptors;

						if (!viewsToMove.some(v => !v.canMoveView) && viewsToMove.length > 0) {
							overlay = new ViewPaneDropOverlay(parent, undefined, bounds, this.viewDescriptorService.getViewContainerLocation(this.viewContainer)!, this.themeService);
						}
					}
				}
			},
			onDragOver: (e) => {
				if (overlay?.disposed) {
					overlay = undefined;
				}

				if (overlay && !inBounds(bounds, e.eventData)) {
					overlay.dispose();
					overlay = undefined;
				}

				if (inBounds(bounds, e.eventData)) {
					toggleDropEffect(e.eventData.dataTransfer, 'move', overlay !== undefined);
				}
			},
			onDragLeave: (e) => {
				overlay?.dispose();
				overlay = undefined;
			},
			onDrop: (e) => {
				if (overlay) {
					const dropData = e.dragAndDropData.getData();
					const viewsToMove: IViewDescriptor[] = [];

					if (dropData.type === 'composite' && dropData.id !== this.viewContainer.id) {
						const container = this.viewDescriptorService.getViewContainerById(dropData.id)!;
						const allViews = this.viewDescriptorService.getViewContainerModel(container).allViewDescriptors;
						if (!allViews.some(v => !v.canMoveView)) {
							viewsToMove.push(...allViews);
						}
					} else if (dropData.type === 'view') {
						const oldViewContainer = this.viewDescriptorService.getViewContainerByViewId(dropData.id);
						const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(dropData.id);
						if (oldViewContainer !== this.viewContainer && viewDescriptor?.canMoveView) {
							this.viewDescriptorService.moveViewsToContainer([viewDescriptor], this.viewContainer, undefined, 'dnd');
						}
					}

					const paneCount = this.panes.length;

					if (viewsToMove.length > 0) {
						this.viewDescriptorService.moveViewsToContainer(viewsToMove, this.viewContainer, undefined, 'dnd');
					}

					if (paneCount > 0) {
						for (const view of viewsToMove) {
							const paneToMove = this.panes.find(p => p.id === view.id);
							if (paneToMove) {
								this.movePane(paneToMove, this.panes[this.panes.length - 1]);
							}
						}
					}
				}

				overlay?.dispose();
				overlay = undefined;
			}
		}));

		this._register(this.onDidSashChange(() => this.saveViewSizes()));
		this._register(this.viewContainerModel.onDidAddVisibleViewDescriptors(added => this.onDidAddViewDescriptors(added)));
		this._register(this.viewContainerModel.onDidRemoveVisibleViewDescriptors(removed => this.onDidRemoveViewDescriptors(removed)));
		const addedViews: IAddedViewDescriptorRef[] = this.viewContainerModel.visibleViewDescriptors.map((viewDescriptor, index) => {
			const size = this.viewContainerModel.getSize(viewDescriptor.id);
			const collapsed = this.viewContainerModel.isCollapsed(viewDescriptor.id);
			return ({ viewDescriptor, index, size, collapsed });
		});
		if (addedViews.length) {
			this.onDidAddViewDescriptors(addedViews);
		}

		// Update headers after and title contributed views after available, since we read from cache in the beginning to know if the viewlet has single view or not. Ref #29609
		this.extensionService.whenInstalledExtensionsRegistered().then(() => {
			this.areExtensionsReady = true;
			if (this.panes.length) {
				this.updateTitleArea();
				this.updateViewHeaders();
			}
			this._register(this.configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION)) {
					this.updateViewHeaders();
				}
			}));
		});

		this._register(this.viewContainerModel.onDidChangeActiveViewDescriptors(() => this._onTitleAreaUpdate.fire()));
	}

	getTitle(): string {
		const containerTitle = this.viewContainerModel.title;

		if (this.isViewMergedWithContainer()) {
			const singleViewPaneContainerTitle = this.paneItems[0].pane.singleViewPaneContainerTitle;
			if (singleViewPaneContainerTitle) {
				return singleViewPaneContainerTitle;
			}

			const paneItemTitle = this.paneItems[0].pane.title;
			if (containerTitle === paneItemTitle) {
				return paneItemTitle;
			}

			return paneItemTitle ? `${containerTitle}: ${paneItemTitle}` : containerTitle;
		}

		return containerTitle;
	}

	private showContextMenu(event: StandardMouseEvent): void {
		for (const paneItem of this.paneItems) {
			// Do not show context menu if target is coming from inside pane views
			if (isAncestor(event.target, paneItem.pane.element)) {
				return;
			}
		}

		event.stopPropagation();
		event.preventDefault();

		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => this.menuActions?.getContextMenuActions() ?? []
		});
	}

	getActionsContext(): unknown {
		if (this.isViewMergedWithContainer()) {
			return this.panes[0].getActionsContext();
		}
		return undefined;
	}

	getActionViewItem(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		if (this.isViewMergedWithContainer()) {
			return this.paneItems[0].pane.createActionViewItem(action, options);
		}
		return createActionViewItem(this.instantiationService, action, options);
	}

	focus(): void {
		let paneToFocus: ViewPane | undefined = undefined;
		if (this.lastFocusedPane) {
			paneToFocus = this.lastFocusedPane;
		} else if (this.paneItems.length > 0) {
			for (const { pane } of this.paneItems) {
				if (pane.isExpanded()) {
					paneToFocus = pane;
					break;
				}
			}
		}
		if (paneToFocus) {
			paneToFocus.focus();
		}
	}

	private get orientation(): Orientation {
		switch (this.viewDescriptorService.getViewContainerLocation(this.viewContainer)) {
			case ViewContainerLocation.Sidebar:
			case ViewContainerLocation.AuxiliaryBar:
				return Orientation.VERTICAL;
			case ViewContainerLocation.Panel: {
				return isHorizontal(this.layoutService.getPanelPosition()) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
			}
		}

		return Orientation.VERTICAL;
	}

	layout(dimension: Dimension): void {
		if (this.paneview) {
			if (this.paneview.orientation !== this.orientation) {
				this.paneview.flipOrientation(dimension.height, dimension.width);
			}

			this.paneview.layout(dimension.height, dimension.width);
		}

		this.dimension = dimension;
		if (this.didLayout) {
			this.saveViewSizes();
		} else {
			this.didLayout = true;
			this.restoreViewSizes();
		}
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this._boundarySashes = sashes;
		this.paneview?.setBoundarySashes(sashes);
	}

	getOptimalWidth(): number {
		const additionalMargin = 16;
		const optimalWidth = Math.max(...this.panes.map(view => view.getOptimalWidth() || 0));
		return optimalWidth + additionalMargin;
	}

	addPanes(panes: { pane: ViewPane; size: number; index?: number; disposable: IDisposable }[]): void {
		const wasMerged = this.isViewMergedWithContainer();

		for (const { pane, size, index, disposable } of panes) {
			this.addPane(pane, size, disposable, index);
		}

		this.updateViewHeaders();
		if (this.isViewMergedWithContainer() !== wasMerged) {
			this.updateTitleArea();
		}

		this._onDidAddViews.fire(panes.map(({ pane }) => pane));
	}

	setVisible(visible: boolean): void {
		if (this.visible !== !!visible) {
			this.visible = visible;

			this._onDidChangeVisibility.fire(visible);
		}

		this.panes.filter(view => view.isVisible() !== visible)
			.map((view) => view.setVisible(visible));
	}

	isVisible(): boolean {
		return this.visible;
	}

	protected updateTitleArea(): void {
		this._onTitleAreaUpdate.fire();
	}

	protected createView(viewDescriptor: IViewDescriptor, options: IViewletViewOptions): ViewPane {
		return this.instantiationService.createInstance(viewDescriptor.ctorDescriptor.ctor, ...(viewDescriptor.ctorDescriptor.staticArguments || []), options);
	}

	getView(id: string): ViewPane | undefined {
		return this.panes.filter(view => view.id === id)[0];
	}

	private saveViewSizes(): void {
		// Save size only when the layout has happened
		if (this.didLayout) {
			this.viewContainerModel.setSizes(this.panes.map(view => ({ id: view.id, size: this.getPaneSize(view) })));
		}
	}

	private restoreViewSizes(): void {
		// Restore sizes only when the layout has happened
		if (this.didLayout) {
			let initialSizes;
			for (let i = 0; i < this.viewContainerModel.visibleViewDescriptors.length; i++) {
				const pane = this.panes[i];
				const viewDescriptor = this.viewContainerModel.visibleViewDescriptors[i];
				const size = this.viewContainerModel.getSize(viewDescriptor.id);

				if (typeof size === 'number') {
					this.resizePane(pane, size);
				} else {
					initialSizes = initialSizes ? initialSizes : this.computeInitialSizes();
					this.resizePane(pane, initialSizes.get(pane.id) || 200);
				}
			}
		}
	}

	private computeInitialSizes(): Map<string, number> {
		const sizes: Map<string, number> = new Map<string, number>();
		if (this.dimension) {
			const totalWeight = this.viewContainerModel.visibleViewDescriptors.reduce((totalWeight, { weight }) => totalWeight + (weight || 20), 0);
			for (const viewDescriptor of this.viewContainerModel.visibleViewDescriptors) {
				if (this.orientation === Orientation.VERTICAL) {
					sizes.set(viewDescriptor.id, this.dimension.height * (viewDescriptor.weight || 20) / totalWeight);
				} else {
					sizes.set(viewDescriptor.id, this.dimension.width * (viewDescriptor.weight || 20) / totalWeight);
				}
			}
		}
		return sizes;
	}

	protected override saveState(): void {
		this.panes.forEach((view) => view.saveState());
		this.storageService.store(this.visibleViewsStorageId, this.length, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	private onContextMenu(event: StandardMouseEvent, viewPane: ViewPane): void {
		event.stopPropagation();
		event.preventDefault();

		const actions: IAction[] = viewPane.menuActions.getContextMenuActions();

		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => actions
		});
	}

	openView(id: string, focus?: boolean): IView | undefined {
		let view = this.getView(id);
		if (!view) {
			this.toggleViewVisibility(id);
		}
		view = this.getView(id);
		if (view) {
			view.setExpanded(true);
			if (focus) {
				view.focus();
			}
		}
		return view;
	}

	protected onDidAddViewDescriptors(added: IAddedViewDescriptorRef[]): ViewPane[] {
		const panesToAdd: { pane: ViewPane; size: number; index: number; disposable: IDisposable }[] = [];

		for (const { viewDescriptor, collapsed, index, size } of added) {
			const pane = this.createView(viewDescriptor,
				{
					id: viewDescriptor.id,
					title: viewDescriptor.name.value,
					fromExtensionId: (viewDescriptor as Partial<ICustomViewDescriptor>).extensionId,
					expanded: !collapsed,
					singleViewPaneContainerTitle: viewDescriptor.singleViewPaneContainerTitle,
				});

			try {
				pane.render();
			} catch (error) {
				this.logService.error(`Fail to render view ${viewDescriptor.id}`, error);
				continue;
			}
			if (pane.draggableElement) {
				const contextMenuDisposable = addDisposableListener(pane.draggableElement, 'contextmenu', e => {
					e.stopPropagation();
					e.preventDefault();
					this.onContextMenu(new StandardMouseEvent(getWindow(pane.draggableElement), e), pane);
				});

				const collapseDisposable = Event.latch(Event.map(pane.onDidChange, () => !pane.isExpanded()))(collapsed => {
					this.viewContainerModel.setCollapsed(viewDescriptor.id, collapsed);
				});

				panesToAdd.push({ pane, size: size || pane.minimumSize, index, disposable: combinedDisposable(contextMenuDisposable, collapseDisposable) });
			}
		}

		this.addPanes(panesToAdd);
		this.restoreViewSizes();

		const panes: ViewPane[] = [];
		for (const { pane } of panesToAdd) {
			pane.setVisible(this.isVisible());
			panes.push(pane);
		}
		return panes;
	}

	private onDidRemoveViewDescriptors(removed: IViewDescriptorRef[]): void {
		removed = removed.sort((a, b) => b.index - a.index);
		const panesToRemove: ViewPane[] = [];
		for (const { index } of removed) {
			const paneItem = this.paneItems[index];
			if (paneItem) {
				panesToRemove.push(this.paneItems[index].pane);
			}
		}

		if (panesToRemove.length) {
			this.removePanes(panesToRemove);

			for (const pane of panesToRemove) {
				pane.setVisible(false);
			}
		}
	}

	toggleViewVisibility(viewId: string): void {
		// Check if view is active
		if (this.viewContainerModel.activeViewDescriptors.some(viewDescriptor => viewDescriptor.id === viewId)) {
			const visible = !this.viewContainerModel.isVisible(viewId);
			this.viewContainerModel.setVisible(viewId, visible);
		}
	}

	private addPane(pane: ViewPane, size: number, disposable: IDisposable, index = this.paneItems.length - 1): void {
		const onDidFocus = pane.onDidFocus(() => {
			this._onDidFocusView.fire(pane);
			this.lastFocusedPane = pane;
		});
		const onDidBlur = pane.onDidBlur(() => this._onDidBlurView.fire(pane));
		const onDidChangeTitleArea = pane.onDidChangeTitleArea(() => {
			if (this.isViewMergedWithContainer()) {
				this.updateTitleArea();
			}
		});

		const onDidChangeVisibility = pane.onDidChangeBodyVisibility(() => this._onDidChangeViewVisibility.fire(pane));
		const onDidChange = pane.onDidChange(() => {
			if (pane === this.lastFocusedPane && !pane.isExpanded()) {
				this.lastFocusedPane = undefined;
			}
		});

		const isPanel = this.viewDescriptorService.getViewContainerLocation(this.viewContainer) === ViewContainerLocation.Panel;
		pane.style({
			headerForeground: asCssVariable(isPanel ? PANEL_SECTION_HEADER_FOREGROUND : SIDE_BAR_SECTION_HEADER_FOREGROUND),
			headerBackground: asCssVariable(isPanel ? PANEL_SECTION_HEADER_BACKGROUND : SIDE_BAR_SECTION_HEADER_BACKGROUND),
			headerBorder: asCssVariable(isPanel ? PANEL_SECTION_HEADER_BORDER : SIDE_BAR_SECTION_HEADER_BORDER),
			dropBackground: asCssVariable(isPanel ? PANEL_SECTION_DRAG_AND_DROP_BACKGROUND : SIDE_BAR_DRAG_AND_DROP_BACKGROUND),
			leftBorder: isPanel ? asCssVariable(PANEL_SECTION_BORDER) : undefined
		});

		const store = new DisposableStore();
		store.add(disposable);
		store.add(combinedDisposable(pane, onDidFocus, onDidBlur, onDidChangeTitleArea, onDidChange, onDidChangeVisibility));
		const paneItem: IViewPaneItem = { pane, disposable: store };

		this.paneItems.splice(index, 0, paneItem);
		assertReturnsDefined(this.paneview).addPane(pane, size, index);

		let overlay: ViewPaneDropOverlay | undefined;

		if (pane.draggableElement) {
			store.add(CompositeDragAndDropObserver.INSTANCE.registerDraggable(pane.draggableElement, () => { return { type: 'view', id: pane.id }; }, {}));
		}

		store.add(CompositeDragAndDropObserver.INSTANCE.registerTarget(pane.dropTargetElement, {
			onDragEnter: (e) => {
				if (!overlay) {
					const dropData = e.dragAndDropData.getData();
					if (dropData.type === 'view' && dropData.id !== pane.id) {

						const oldViewContainer = this.viewDescriptorService.getViewContainerByViewId(dropData.id);
						const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(dropData.id);

						if (oldViewContainer !== this.viewContainer && (!viewDescriptor || !viewDescriptor.canMoveView || this.viewContainer.rejectAddedViews)) {
							return;
						}

						overlay = new ViewPaneDropOverlay(pane.dropTargetElement, this.orientation ?? Orientation.VERTICAL, undefined, this.viewDescriptorService.getViewContainerLocation(this.viewContainer)!, this.themeService);
					}

					if (dropData.type === 'composite' && dropData.id !== this.viewContainer.id && !this.viewContainer.rejectAddedViews) {
						const container = this.viewDescriptorService.getViewContainerById(dropData.id)!;
						const viewsToMove = this.viewDescriptorService.getViewContainerModel(container).allViewDescriptors;

						if (!viewsToMove.some(v => !v.canMoveView) && viewsToMove.length > 0) {
							overlay = new ViewPaneDropOverlay(pane.dropTargetElement, this.orientation ?? Orientation.VERTICAL, undefined, this.viewDescriptorService.getViewContainerLocation(this.viewContainer)!, this.themeService);
						}
					}
				}
			},
			onDragOver: (e) => {
				toggleDropEffect(e.eventData.dataTransfer, 'move', overlay !== undefined);
			},
			onDragLeave: (e) => {
				overlay?.dispose();
				overlay = undefined;
			},
			onDrop: (e) => {
				if (overlay) {
					const dropData = e.dragAndDropData.getData();
					const viewsToMove: IViewDescriptor[] = [];
					let anchorView: IViewDescriptor | undefined;

					if (dropData.type === 'composite' && dropData.id !== this.viewContainer.id && !this.viewContainer.rejectAddedViews) {
						const container = this.viewDescriptorService.getViewContainerById(dropData.id)!;
						const allViews = this.viewDescriptorService.getViewContainerModel(container).allViewDescriptors;

						if (allViews.length > 0 && !allViews.some(v => !v.canMoveView)) {
							viewsToMove.push(...allViews);
							anchorView = allViews[0];
						}
					} else if (dropData.type === 'view') {
						const oldViewContainer = this.viewDescriptorService.getViewContainerByViewId(dropData.id);
						const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(dropData.id);
						if (oldViewContainer !== this.viewContainer && viewDescriptor && viewDescriptor.canMoveView && !this.viewContainer.rejectAddedViews) {
							viewsToMove.push(viewDescriptor);
						}

						if (viewDescriptor) {
							anchorView = viewDescriptor;
						}
					}

					if (viewsToMove) {
						this.viewDescriptorService.moveViewsToContainer(viewsToMove, this.viewContainer, undefined, 'dnd');
					}

					if (anchorView) {
						if (overlay.currentDropOperation === DropDirection.DOWN ||
							overlay.currentDropOperation === DropDirection.RIGHT) {

							const fromIndex = this.panes.findIndex(p => p.id === anchorView!.id);
							let toIndex = this.panes.findIndex(p => p.id === pane.id);

							if (fromIndex >= 0 && toIndex >= 0) {
								if (fromIndex > toIndex) {
									toIndex++;
								}

								if (toIndex < this.panes.length && toIndex !== fromIndex) {
									this.movePane(this.panes[fromIndex], this.panes[toIndex]);
								}
							}
						}

						if (overlay.currentDropOperation === DropDirection.UP ||
							overlay.currentDropOperation === DropDirection.LEFT) {
							const fromIndex = this.panes.findIndex(p => p.id === anchorView!.id);
							let toIndex = this.panes.findIndex(p => p.id === pane.id);

							if (fromIndex >= 0 && toIndex >= 0) {
								if (fromIndex < toIndex) {
									toIndex--;
								}

								if (toIndex >= 0 && toIndex !== fromIndex) {
									this.movePane(this.panes[fromIndex], this.panes[toIndex]);
								}
							}
						}

						if (viewsToMove.length > 1) {
							viewsToMove.slice(1).forEach(view => {
								let toIndex = this.panes.findIndex(p => p.id === anchorView!.id);
								const fromIndex = this.panes.findIndex(p => p.id === view.id);
								if (fromIndex >= 0 && toIndex >= 0) {
									if (fromIndex > toIndex) {
										toIndex++;
									}

									if (toIndex < this.panes.length && toIndex !== fromIndex) {
										this.movePane(this.panes[fromIndex], this.panes[toIndex]);
										anchorView = view;
									}
								}
							});
						}
					}
				}

				overlay?.dispose();
				overlay = undefined;
			}
		}));
	}

	removePanes(panes: ViewPane[]): void {
		const wasMerged = this.isViewMergedWithContainer();

		panes.forEach(pane => this.removePane(pane));

		this.updateViewHeaders();
		if (wasMerged !== this.isViewMergedWithContainer()) {
			this.updateTitleArea();
		}

		this._onDidRemoveViews.fire(panes);
	}

	private removePane(pane: ViewPane): void {
		const index = this.paneItems.findIndex(i => i.pane === pane);

		if (index === -1) {
			return;
		}

		if (this.lastFocusedPane === pane) {
			this.lastFocusedPane = undefined;
		}

		assertReturnsDefined(this.paneview).removePane(pane);
		const [paneItem] = this.paneItems.splice(index, 1);
		paneItem.disposable.dispose();

	}

	movePane(from: ViewPane, to: ViewPane): void {
		const fromIndex = this.paneItems.findIndex(item => item.pane === from);
		const toIndex = this.paneItems.findIndex(item => item.pane === to);

		const fromViewDescriptor = this.viewContainerModel.visibleViewDescriptors[fromIndex];
		const toViewDescriptor = this.viewContainerModel.visibleViewDescriptors[toIndex];

		if (fromIndex < 0 || fromIndex >= this.paneItems.length) {
			return;
		}

		if (toIndex < 0 || toIndex >= this.paneItems.length) {
			return;
		}

		const [paneItem] = this.paneItems.splice(fromIndex, 1);
		this.paneItems.splice(toIndex, 0, paneItem);

		assertReturnsDefined(this.paneview).movePane(from, to);

		this.viewContainerModel.move(fromViewDescriptor.id, toViewDescriptor.id);

		this.updateTitleArea();
	}

	resizePane(pane: ViewPane, size: number): void {
		assertReturnsDefined(this.paneview).resizePane(pane, size);
	}

	getPaneSize(pane: ViewPane): number {
		return assertReturnsDefined(this.paneview).getPaneSize(pane);
	}

	private updateViewHeaders(): void {
		if (this.isViewMergedWithContainer()) {
			if (this.paneItems[0].pane.isExpanded()) {
				this.lastMergedCollapsedPane = undefined;
			} else {
				this.lastMergedCollapsedPane = this.paneItems[0].pane;
				this.paneItems[0].pane.setExpanded(true);
			}
			this.paneItems[0].pane.headerVisible = false;
			this.paneItems[0].pane.collapsible = true;
		} else {
			if (this.paneItems.length === 1) {
				this.paneItems[0].pane.headerVisible = true;
				if (this.paneItems[0].pane === this.lastMergedCollapsedPane) {
					this.paneItems[0].pane.setExpanded(false);
				}
				this.paneItems[0].pane.collapsible = false;
			} else {
				this.paneItems.forEach(i => {
					i.pane.headerVisible = true;
					i.pane.collapsible = true;
					if (i.pane === this.lastMergedCollapsedPane) {
						i.pane.setExpanded(false);
					}
				});
			}
			this.lastMergedCollapsedPane = undefined;
		}
	}

	isViewMergedWithContainer(): boolean {
		if (!(this.options.mergeViewWithContainerWhenSingleView && this.paneItems.length === 1)) {
			return false;
		}
		if (!this.areExtensionsReady) {
			if (this.visibleViewsCountFromCache === undefined) {
				return this.paneItems[0].pane.isExpanded();
			}
			// Check in cache so that view do not jump. See #29609
			return this.visibleViewsCountFromCache === 1;
		}
		return true;
	}

	private onDidScrollPane() {
		for (const pane of this.panes) {
			pane.onDidScrollRoot();
		}
	}

	private onDidSashReset(index: number) {
		let firstPane = undefined;
		let secondPane = undefined;

		// Deal with collapsed views: to be clever, we split the space taken by the nearest uncollapsed views
		for (let i = index; i >= 0; i--) {
			if (this.paneItems[i].pane?.isVisible() && this.paneItems[i]?.pane.isExpanded()) {
				firstPane = this.paneItems[i].pane;
				break;
			}
		}

		for (let i = index + 1; i < this.paneItems.length; i++) {
			if (this.paneItems[i].pane?.isVisible() && this.paneItems[i]?.pane.isExpanded()) {
				secondPane = this.paneItems[i].pane;
				break;
			}
		}

		if (firstPane && secondPane) {
			const firstPaneSize = this.getPaneSize(firstPane);
			const secondPaneSize = this.getPaneSize(secondPane);

			// Avoid rounding errors and be consistent when resizing
			// The first pane always get half rounded up and the second is half rounded down
			const newFirstPaneSize = Math.ceil((firstPaneSize + secondPaneSize) / 2);
			const newSecondPaneSize = Math.floor((firstPaneSize + secondPaneSize) / 2);

			// Shrink the larger pane first, then grow the smaller pane
			// This prevents interfering with other view sizes
			if (firstPaneSize > secondPaneSize) {
				this.resizePane(firstPane, newFirstPaneSize);
				this.resizePane(secondPane, newSecondPaneSize);
			} else {
				this.resizePane(secondPane, newSecondPaneSize);
				this.resizePane(firstPane, newFirstPaneSize);
			}
		}
	}

	override dispose(): void {
		super.dispose();
		this.paneItems.forEach(i => i.disposable.dispose());
		if (this.paneview) {
			this.paneview.dispose();
		}
	}
}

export abstract class ViewPaneContainerAction<T extends IViewPaneContainer> extends Action2 {
	override readonly desc: Readonly<IAction2Options> & { viewPaneContainerId: string };
	constructor(desc: Readonly<IAction2Options> & { viewPaneContainerId: string }) {
		super(desc);
		this.desc = desc;
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): unknown {
		const viewPaneContainer = accessor.get(IViewsService).getActiveViewPaneContainerWithId(this.desc.viewPaneContainerId);
		if (viewPaneContainer) {
			return this.runInViewPaneContainer(accessor, <T>viewPaneContainer, ...args);
		}
		return undefined;
	}

	abstract runInViewPaneContainer(accessor: ServicesAccessor, viewPaneContainer: T, ...args: unknown[]): unknown;
}

class MoveViewPosition extends Action2 {
	constructor(desc: Readonly<IAction2Options>, private readonly offset: number) {
		super(desc);
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const contextKeyService = accessor.get(IContextKeyService);

		const viewId = FocusedViewContext.getValue(contextKeyService);
		if (viewId === undefined) {
			return;
		}

		const viewContainer = viewDescriptorService.getViewContainerByViewId(viewId)!;
		const model = viewDescriptorService.getViewContainerModel(viewContainer);

		const viewDescriptor = model.visibleViewDescriptors.find(vd => vd.id === viewId)!;
		const currentIndex = model.visibleViewDescriptors.indexOf(viewDescriptor);
		if (currentIndex + this.offset < 0 || currentIndex + this.offset >= model.visibleViewDescriptors.length) {
			return;
		}

		const newPosition = model.visibleViewDescriptors[currentIndex + this.offset];

		model.move(viewDescriptor.id, newPosition.id);
	}
}

registerAction2(
	class MoveViewUp extends MoveViewPosition {
		constructor() {
			super({
				id: 'views.moveViewUp',
				title: nls.localize('viewMoveUp', "Move View Up"),
				keybinding: {
					primary: KeyChord(KeyMod.CtrlCmd + KeyCode.KeyK, KeyCode.UpArrow),
					weight: KeybindingWeight.WorkbenchContrib + 1,
					when: FocusedViewContext.notEqualsTo('')
				}
			}, -1);
		}
	}
);

registerAction2(
	class MoveViewLeft extends MoveViewPosition {
		constructor() {
			super({
				id: 'views.moveViewLeft',
				title: nls.localize('viewMoveLeft', "Move View Left"),
				keybinding: {
					primary: KeyChord(KeyMod.CtrlCmd + KeyCode.KeyK, KeyCode.LeftArrow),
					weight: KeybindingWeight.WorkbenchContrib + 1,
					when: FocusedViewContext.notEqualsTo('')
				}
			}, -1);
		}
	}
);

registerAction2(
	class MoveViewDown extends MoveViewPosition {
		constructor() {
			super({
				id: 'views.moveViewDown',
				title: nls.localize('viewMoveDown', "Move View Down"),
				keybinding: {
					primary: KeyChord(KeyMod.CtrlCmd + KeyCode.KeyK, KeyCode.DownArrow),
					weight: KeybindingWeight.WorkbenchContrib + 1,
					when: FocusedViewContext.notEqualsTo('')
				}
			}, 1);
		}
	}
);

registerAction2(
	class MoveViewRight extends MoveViewPosition {
		constructor() {
			super({
				id: 'views.moveViewRight',
				title: nls.localize('viewMoveRight', "Move View Right"),
				keybinding: {
					primary: KeyChord(KeyMod.CtrlCmd + KeyCode.KeyK, KeyCode.RightArrow),
					weight: KeybindingWeight.WorkbenchContrib + 1,
					when: FocusedViewContext.notEqualsTo('')
				}
			}, 1);
		}
	}
);


registerAction2(class MoveViews extends Action2 {
	constructor() {
		super({
			id: 'vscode.moveViews',
			title: nls.localize('viewsMove', "Move Views"),
		});
	}

	async run(accessor: ServicesAccessor, options: { viewIds: string[]; destinationId: string }): Promise<void> {
		if (!Array.isArray(options?.viewIds) || typeof options?.destinationId !== 'string') {
			return Promise.reject('Invalid arguments');
		}

		const viewDescriptorService = accessor.get(IViewDescriptorService);

		const destination = viewDescriptorService.getViewContainerById(options.destinationId);
		if (!destination) {
			return;
		}

		// FYI, don't use `moveViewsToContainer` in 1 shot, because it expects all views to have the same current location
		for (const viewId of options.viewIds) {
			const viewDescriptor = viewDescriptorService.getViewDescriptorById(viewId);
			if (viewDescriptor?.canMoveView) {
				viewDescriptorService.moveViewsToContainer([viewDescriptor], destination, ViewVisibilityState.Default, this.desc.id);
			}
		}

		await accessor.get(IViewsService).openViewContainer(destination.id, true);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/viewsViewlet.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/views/viewsViewlet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IViewDescriptor, IViewDescriptorService, IAddedViewDescriptorRef, IView } from '../../../common/views.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ViewPaneContainer } from './viewPaneContainer.js';
import { ViewPane, IViewPaneOptions } from './viewPane.js';
import { Event } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export interface IViewletViewOptions extends IViewPaneOptions {
	readonly fromExtensionId?: ExtensionIdentifier;
}

export abstract class FilterViewPaneContainer extends ViewPaneContainer {
	private constantViewDescriptors: Map<string, IViewDescriptor> = new Map();
	private allViews: Map<string, Map<string, IViewDescriptor>> = new Map();
	private filterValue: string[] | undefined;

	constructor(
		viewletId: string,
		onDidChangeFilterValue: Event<string[]>,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {

		super(viewletId, { mergeViewWithContainerWhenSingleView: false }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);
		this._register(onDidChangeFilterValue(newFilterValue => {
			this.filterValue = newFilterValue;
			this.onFilterChanged(newFilterValue);
		}));

		this._register(this.viewContainerModel.onDidChangeActiveViewDescriptors(() => {
			this.updateAllViews(this.viewContainerModel.activeViewDescriptors);
		}));
	}

	private updateAllViews(viewDescriptors: ReadonlyArray<IViewDescriptor>) {
		viewDescriptors.forEach(descriptor => {
			const filterOnValue = this.getFilterOn(descriptor);
			if (!filterOnValue) {
				return;
			}
			if (!this.allViews.has(filterOnValue)) {
				this.allViews.set(filterOnValue, new Map());
			}
			this.allViews.get(filterOnValue)!.set(descriptor.id, descriptor);
			if (this.filterValue && !this.filterValue.includes(filterOnValue) && this.panes.find(pane => pane.id === descriptor.id)) {
				this.viewContainerModel.setVisible(descriptor.id, false);
			}
		});
	}

	protected addConstantViewDescriptors(constantViewDescriptors: IViewDescriptor[]) {
		constantViewDescriptors.forEach(viewDescriptor => this.constantViewDescriptors.set(viewDescriptor.id, viewDescriptor));
	}

	protected abstract getFilterOn(viewDescriptor: IViewDescriptor): string | undefined;

	protected abstract setFilter(viewDescriptor: IViewDescriptor): void;

	private onFilterChanged(newFilterValue: string[]) {
		if (this.allViews.size === 0) {
			this.updateAllViews(this.viewContainerModel.activeViewDescriptors);
		}
		this.getViewsNotForTarget(newFilterValue).forEach(item => this.viewContainerModel.setVisible(item.id, false));
		this.getViewsForTarget(newFilterValue).forEach(item => this.viewContainerModel.setVisible(item.id, true));
	}

	private getViewsForTarget(target: string[]): IViewDescriptor[] {
		const views: IViewDescriptor[] = [];
		for (let i = 0; i < target.length; i++) {
			if (this.allViews.has(target[i])) {
				views.push(...Array.from(this.allViews.get(target[i])!.values()));
			}
		}

		return views;
	}

	private getViewsNotForTarget(target: string[]): IViewDescriptor[] {
		const iterable = this.allViews.keys();
		let key = iterable.next();
		let views: IViewDescriptor[] = [];
		while (!key.done) {
			let isForTarget: boolean = false;
			target.forEach(value => {
				if (key.value === value) {
					isForTarget = true;
				}
			});
			if (!isForTarget) {
				views = views.concat(this.getViewsForTarget([key.value]));
			}

			key = iterable.next();
		}
		return views;
	}

	protected override onDidAddViewDescriptors(added: IAddedViewDescriptorRef[]): ViewPane[] {
		const panes: ViewPane[] = super.onDidAddViewDescriptors(added);
		for (let i = 0; i < added.length; i++) {
			if (this.constantViewDescriptors.has(added[i].viewDescriptor.id)) {
				panes[i].setExpanded(false);
			}
		}
		// Check that allViews is ready
		if (this.allViews.size === 0) {
			this.updateAllViews(this.viewContainerModel.activeViewDescriptors);
		}
		return panes;
	}

	override openView(id: string, focus?: boolean): IView | undefined {
		const result = super.openView(id, focus);
		if (result) {
			const descriptorMap = Array.from(this.allViews.entries()).find(entry => entry[1].has(id));
			if (descriptorMap && !this.filterValue?.includes(descriptorMap[0])) {
				this.setFilter(descriptorMap[1].get(id)!);
			}
		}
		return result;
	}

	abstract override getTitle(): string;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/views/media/paneviewlet.css]---
Location: vscode-main/src/vs/workbench/browser/parts/views/media/paneviewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-pane-view .split-view-view:first-of-type > .pane > .pane-header {
	border-top: none !important; /* less clutter: do not show any border for first views in a pane */
}

.monaco-pane-view .split-view-view:first-of-type > .pane {
	border-left: none !important; /* less clutter: do not show any border for first views in a pane */
}

.monaco-pane-view .pane > .pane-header {
	position: relative;
}

.monaco-pane-view .pane > .pane-header.not-collapsible .twisty-container {
	display: none;
}

.monaco-pane-view .pane > .pane-header.not-collapsible .title {
	margin-left: 8px;
}

.monaco-pane-view .pane > .pane-header > .actions.show-always,
.monaco-pane-view .pane.expanded > .pane-header > .actions.show-expanded {
	display: initial;
}

.monaco-pane-view .pane > .pane-header > .icon {
	display: none;
	width: 16px;
	height: 16px;
}

.monaco-pane-view .pane.pane.horizontal:not(.expanded) > .pane-header > .icon {
	display: inline;
	margin-top: 4px;
}

.monaco-pane-view .pane > .pane-header h3.title {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 11px;
	min-width: 3ch;
	-webkit-margin-before: 0;
	-webkit-margin-after: 0;
}

.monaco-pane-view .pane > .pane-header .description {
	display: block;
	font-weight: normal;
	margin-left: 10px;
	opacity: 0.6;
	overflow: hidden;
	text-overflow: ellipsis;
	text-transform: none;
	white-space: nowrap;
	flex-shrink: 100000;
}

.monaco-pane-view .pane > .pane-header .description .codicon {
	font-size: 9px;
	margin-left: 2px;
}

.monaco-pane-view .pane > .pane-header:not(.expanded) .description {
	display: none;
}

.monaco-pane-view .pane.horizontal:not(.expanded) > .pane-header h3.title,
.monaco-pane-view .pane.horizontal:not(.expanded) > .pane-header .description {
	display: none;
}

.monaco-pane-view .pane .monaco-progress-container {
	position: absolute;
	left: 0;
	top: -2px;
	z-index: 5;
}

.monaco-pane-view .pane:not(.merged-header) .monaco-progress-container {
	top: 20px;
}
```

--------------------------------------------------------------------------------

````

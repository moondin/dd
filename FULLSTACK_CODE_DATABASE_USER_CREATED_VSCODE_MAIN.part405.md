---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 405
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 405 of 552)

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

---[FILE: src/vs/workbench/contrib/markers/browser/markersView.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/markers.css';

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ITableContextMenuEvent, ITableEvent } from '../../../../base/browser/ui/table/table.js';
import { ITreeContextMenuEvent, ITreeElement, ITreeEvent, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { IAction, Separator } from '../../../../base/common/actions.js';
import { groupBy } from '../../../../base/common/arrays.js';
import { Event, Relay } from '../../../../base/common/event.js';
import { IExpression } from '../../../../base/common/glob.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { deepClone } from '../../../../base/common/objects.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { fillInMarkersDragData, MarkerTransferData } from '../../../../platform/dnd/browser/dnd.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResultKind } from '../../../../platform/keybinding/common/keybindingResolver.js';
import { IListService, IOpenEvent, IWorkbenchObjectTreeOptions, WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IOpenerService, withSelection } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { RangeHighlightDecorations } from '../../../browser/codeeditor.js';
import { ResourceListDnDHandler } from '../../../browser/dnd.js';
import { ResourceLabels } from '../../../browser/labels.js';
import { FilterViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { Memento } from '../../../common/memento.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { Markers, MarkersContextKeys, MarkersViewMode } from '../common/markers.js';
import { IMarkersView } from './markers.js';
import { FilterOptions } from './markersFilterOptions.js';
import { compareMarkersByUri, Marker, MarkerChangesEvent, MarkerElement, MarkersModel, MarkerTableItem, RelatedInformation, ResourceMarkers } from './markersModel.js';
import { MarkersTable } from './markersTable.js';
import { Filter, FilterData, MarkerRenderer, MarkersViewModel, MarkersWidgetAccessibilityProvider, RelatedInformationRenderer, ResourceMarkersRenderer, VirtualDelegate } from './markersTreeViewer.js';
import { IMarkersFiltersChangeEvent, MarkersFilters } from './markersViewActions.js';
import Messages from './messages.js';

function createResourceMarkersIterator(resourceMarkers: ResourceMarkers): Iterable<ITreeElement<MarkerElement>> {
	return Iterable.map(resourceMarkers.markers, m => {
		const relatedInformationIt = Iterable.from(m.relatedInformation);
		const children = Iterable.map(relatedInformationIt, r => ({ element: r }));

		return { element: m, children };
	});
}

interface IMarkersPanelState {
	filter?: string;
	filterHistory?: string[];
	showErrors?: boolean;
	showWarnings?: boolean;
	showInfos?: boolean;
	useFilesExclude?: boolean;
	activeFile?: boolean;
	multiline?: boolean;
	viewMode?: MarkersViewMode;
}

export interface IProblemsWidget {
	get contextKeyService(): IContextKeyService;

	get onContextMenu(): Event<ITreeContextMenuEvent<MarkerElement | null>> | Event<ITableContextMenuEvent<MarkerTableItem>>;
	get onDidChangeFocus(): Event<ITreeEvent<MarkerElement | null>> | Event<ITableEvent<MarkerTableItem>>;
	get onDidChangeSelection(): Event<ITreeEvent<MarkerElement | null>> | Event<ITableEvent<MarkerTableItem>>;
	get onDidOpen(): Event<IOpenEvent<MarkerElement | MarkerTableItem | undefined>>;

	collapseMarkers(): void;
	dispose(): void;
	domFocus(): void;
	filterMarkers(resourceMarkers: ResourceMarkers[], filterOptions: FilterOptions): void;
	getFocus(): (MarkerElement | MarkerTableItem | null)[];
	getHTMLElement(): HTMLElement;
	getRelativeTop(location: MarkerElement | MarkerTableItem | null): number | null;
	getSelection(): (MarkerElement | MarkerTableItem | null)[];
	getVisibleItemCount(): number;
	layout(height: number, width: number): void;
	reset(resourceMarkers: ResourceMarkers[]): void;
	revealMarkers(activeResource: ResourceMarkers | null, focus: boolean, lastSelectedRelativeTop: number): void;
	setAriaLabel(label: string): void;
	setMarkerSelection(selection?: Marker[], focus?: Marker[]): void;
	toggleVisibility(hide: boolean): void;
	update(resourceMarkers: ResourceMarkers[]): void;
	updateMarker(marker: Marker): void;
}

export class MarkersView extends FilterViewPane implements IMarkersView {

	private lastSelectedRelativeTop: number = 0;
	private currentActiveResource: URI | null = null;

	private readonly rangeHighlightDecorations: RangeHighlightDecorations;
	private readonly markersModel: MarkersModel;
	private readonly filter: Filter;
	private readonly onVisibleDisposables = this._register(new DisposableStore());

	private widget!: IProblemsWidget;
	private readonly widgetDisposables = this._register(new DisposableStore());
	private widgetContainer!: HTMLElement;
	private widgetIdentityProvider: IIdentityProvider<MarkerElement | MarkerTableItem>;
	private widgetAccessibilityProvider: MarkersWidgetAccessibilityProvider;
	private messageBoxContainer: HTMLElement | undefined;
	private ariaLabelElement: HTMLElement | undefined;
	readonly filters: MarkersFilters;

	private currentHeight = 0;
	private currentWidth = 0;
	private readonly memento: Memento<IMarkersPanelState>;
	private readonly panelState: IMarkersPanelState;

	private cachedFilterStats: { total: number; filtered: number } | undefined = undefined;

	private currentResourceGotAddedToMarkersData: boolean = false;
	private readonly markersViewModel: MarkersViewModel;

	readonly onDidChangeVisibility = this.onDidChangeBodyVisibility;

	constructor(
		options: IViewPaneOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IMarkerService private readonly markerService: IMarkerService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IStorageService storageService: IStorageService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		const memento = new Memento<IMarkersPanelState>(Markers.MARKERS_VIEW_STORAGE_ID, storageService);
		const panelState = memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		super({
			...options,
			filterOptions: {
				ariaLabel: Messages.MARKERS_PANEL_FILTER_ARIA_LABEL,
				placeholder: Messages.MARKERS_PANEL_FILTER_PLACEHOLDER,
				focusContextKey: MarkersContextKeys.MarkerViewFilterFocusContextKey.key,
				text: panelState.filter || '',
				history: panelState.filterHistory || []
			}
		}, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.memento = memento;
		this.panelState = panelState;

		this.markersModel = this._register(instantiationService.createInstance(MarkersModel));
		this.markersViewModel = this._register(instantiationService.createInstance(MarkersViewModel, this.panelState.multiline, this.panelState.viewMode ?? this.getDefaultViewMode()));
		this._register(this.onDidChangeVisibility(visible => this.onDidChangeMarkersViewVisibility(visible)));
		this._register(this.markersViewModel.onDidChangeViewMode(_ => this.onDidChangeViewMode()));

		this.widgetAccessibilityProvider = instantiationService.createInstance(MarkersWidgetAccessibilityProvider);
		this.widgetIdentityProvider = { getId(element: MarkerElement | MarkerTableItem) { return element.id; } };

		this.setCurrentActiveEditor();

		this.filter = new Filter(FilterOptions.EMPTY(uriIdentityService));
		this.rangeHighlightDecorations = this._register(this.instantiationService.createInstance(RangeHighlightDecorations));

		this.filters = this._register(new MarkersFilters({
			filterHistory: this.panelState.filterHistory || [],
			showErrors: this.panelState.showErrors !== false,
			showWarnings: this.panelState.showWarnings !== false,
			showInfos: this.panelState.showInfos !== false,
			excludedFiles: !!this.panelState.useFilesExclude,
			activeFile: !!this.panelState.activeFile,
		}, this.contextKeyService));

		// Update filter, whenever the "files.exclude" setting is changed
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (this.filters.excludedFiles && e.affectsConfiguration('files.exclude')) {
				this.updateFilter();
			}
		}));
	}

	override render(): void {
		super.render();
		this._register(registerNavigableContainer({
			name: 'markersView',
			focusNotifiers: [this, this.filterWidget],
			focusNextWidget: () => {
				if (this.filterWidget.hasFocus()) {
					this.focus();
				}
			},
			focusPreviousWidget: () => {
				if (!this.filterWidget.hasFocus()) {
					this.focusFilter();
				}
			}
		}));
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);

		parent.classList.add('markers-panel');
		this._register(dom.addDisposableListener(parent, 'keydown', e => {
			const event = new StandardKeyboardEvent(e);
			if (!this.keybindingService.mightProducePrintableCharacter(event)) {
				return;
			}
			const result = this.keybindingService.softDispatch(event, event.target);
			if (result.kind === ResultKind.MoreChordsNeeded || result.kind === ResultKind.KbFound) {
				return;
			}
			this.focusFilter();
		}));

		const panelContainer = dom.append(parent, dom.$('.markers-panel-container'));

		this.createArialLabelElement(panelContainer);

		this.createMessageBox(panelContainer);

		this.widgetContainer = dom.append(panelContainer, dom.$('.widget-container'));
		this.createWidget(this.widgetContainer);

		this.updateFilter();
		this.renderContent();
	}

	public getTitle(): string {
		return Messages.MARKERS_PANEL_TITLE_PROBLEMS.value;
	}

	protected layoutBodyContent(height: number = this.currentHeight, width: number = this.currentWidth): void {
		if (this.messageBoxContainer) {
			this.messageBoxContainer.style.height = `${height}px`;
		}
		this.widget.layout(height, width);

		this.currentHeight = height;
		this.currentWidth = width;
	}

	public override focus(): void {
		super.focus();
		if (dom.isActiveElement(this.widget.getHTMLElement())) {
			return;
		}

		if (this.hasNoProblems()) {
			this.messageBoxContainer!.focus();
		} else {
			this.widget.domFocus();
			this.widget.setMarkerSelection();
		}
	}

	public focusFilter(): void {
		this.filterWidget.focus();
	}

	public updateBadge(total: number, filtered: number): void {
		this.filterWidget.updateBadge(total === filtered || total === 0 ? undefined : localize('showing filtered problems', "Showing {0} of {1}", filtered, total));
	}

	public checkMoreFilters(): void {
		this.filterWidget.checkMoreFilters(!this.filters.showErrors || !this.filters.showWarnings || !this.filters.showInfos || this.filters.excludedFiles || this.filters.activeFile);
	}

	public clearFilterText(): void {
		this.filterWidget.setFilterText('');
	}

	public showQuickFixes(marker: Marker): void {
		const viewModel = this.markersViewModel.getViewModel(marker);
		if (viewModel) {
			viewModel.quickFixAction.run();
		}
	}

	public openFileAtElement(element: any, preserveFocus: boolean, sideByside: boolean, pinned: boolean): boolean {
		const { resource, selection } = element instanceof Marker ? { resource: element.resource, selection: element.range } :
			element instanceof RelatedInformation ? { resource: element.raw.resource, selection: element.raw } :
				'marker' in element ? { resource: element.marker.resource, selection: element.marker.range } :
					{ resource: null, selection: null };
		if (resource && selection) {
			this.editorService.openEditor({
				resource,
				options: {
					selection,
					preserveFocus,
					pinned,
					revealIfVisible: true
				},
			}, sideByside ? SIDE_GROUP : ACTIVE_GROUP).then(editor => {
				if (editor && preserveFocus) {
					this.rangeHighlightDecorations.highlightRange({ resource, range: selection }, <ICodeEditor>editor.getControl());
				} else {
					this.rangeHighlightDecorations.removeHighlightRange();
				}
			});
			return true;
		} else {
			this.rangeHighlightDecorations.removeHighlightRange();
		}
		return false;
	}

	private refreshPanel(markerOrChange?: Marker | MarkerChangesEvent): void {
		if (this.isVisible()) {
			const hasSelection = this.widget.getSelection().length > 0;

			if (markerOrChange) {
				if (markerOrChange instanceof Marker) {
					this.widget.updateMarker(markerOrChange);
				} else {
					if (markerOrChange.added.size || markerOrChange.removed.size) {
						// Reset complete widget
						this.resetWidget();
					} else {
						// Update resource
						this.widget.update([...markerOrChange.updated]);
					}
				}
			} else {
				// Reset complete widget
				this.resetWidget();
			}

			if (hasSelection) {
				this.widget.setMarkerSelection();
			}

			this.cachedFilterStats = undefined;
			const { total, filtered } = this.getFilterStats();
			this.toggleVisibility(total === 0 || filtered === 0);
			this.renderMessage();

			this.updateBadge(total, filtered);
			this.checkMoreFilters();
		}
	}

	private onDidChangeViewState(marker?: Marker): void {
		this.refreshPanel(marker);
	}

	private resetWidget(): void {
		this.widget.reset(this.getResourceMarkers());
	}

	private updateFilter() {
		this.filter.options = new FilterOptions(this.filterWidget.getFilterText(), this.getFilesExcludeExpressions(), this.filters.showWarnings, this.filters.showErrors, this.filters.showInfos, this.uriIdentityService);
		this.widget.filterMarkers(this.getResourceMarkers(), this.filter.options);

		this.cachedFilterStats = undefined;
		const { total, filtered } = this.getFilterStats();
		this.toggleVisibility(total === 0 || filtered === 0);
		this.renderMessage();

		this.updateBadge(total, filtered);
		this.checkMoreFilters();
	}

	private getDefaultViewMode(): MarkersViewMode {
		switch (this.configurationService.getValue<string>('problems.defaultViewMode')) {
			case 'table':
				return MarkersViewMode.Table;
			case 'tree':
				return MarkersViewMode.Tree;
			default:
				return MarkersViewMode.Tree;
		}
	}

	private getFilesExcludeExpressions(): { root: URI; expression: IExpression }[] | IExpression {
		if (!this.filters.excludedFiles) {
			return [];
		}

		const workspaceFolders = this.workspaceContextService.getWorkspace().folders;
		return workspaceFolders.length
			? workspaceFolders.map(workspaceFolder => ({ root: workspaceFolder.uri, expression: this.getFilesExclude(workspaceFolder.uri) }))
			: this.getFilesExclude();
	}

	private getFilesExclude(resource?: URI): IExpression {
		return deepClone(this.configurationService.getValue('files.exclude', { resource })) || {};
	}

	private getResourceMarkers(): ResourceMarkers[] {
		if (!this.filters.activeFile) {
			return this.markersModel.resourceMarkers;
		}

		let resourceMarkers: ResourceMarkers[] = [];
		if (this.currentActiveResource) {
			const activeResourceMarkers = this.markersModel.getResourceMarkers(this.currentActiveResource);
			if (activeResourceMarkers) {
				resourceMarkers = [activeResourceMarkers];
			}
		}

		return resourceMarkers;
	}

	private createMessageBox(parent: HTMLElement): void {
		this.messageBoxContainer = dom.append(parent, dom.$('.message-box-container'));
		this.messageBoxContainer.setAttribute('aria-labelledby', 'markers-panel-arialabel');
	}

	private createArialLabelElement(parent: HTMLElement): void {
		this.ariaLabelElement = dom.append(parent, dom.$(''));
		this.ariaLabelElement.setAttribute('id', 'markers-panel-arialabel');
	}

	private createWidget(parent: HTMLElement): void {
		this.widget = this.markersViewModel.viewMode === MarkersViewMode.Table ? this.createTable(parent) : this.createTree(parent);
		this.widgetDisposables.add(this.widget);

		const markerFocusContextKey = MarkersContextKeys.MarkerFocusContextKey.bindTo(this.widget.contextKeyService);
		const relatedInformationFocusContextKey = MarkersContextKeys.RelatedInformationFocusContextKey.bindTo(this.widget.contextKeyService);
		this.widgetDisposables.add(this.widget.onDidChangeFocus(focus => {
			markerFocusContextKey.set(focus.elements.some(e => e instanceof Marker));
			relatedInformationFocusContextKey.set(focus.elements.some(e => e instanceof RelatedInformation));
		}));

		this.widgetDisposables.add(Event.debounce(this.widget.onDidOpen, (last, event) => event, 75, true)(options => {
			this.openFileAtElement(options.element, !!options.editorOptions.preserveFocus, options.sideBySide, !!options.editorOptions.pinned);
		}));

		this.widgetDisposables.add(Event.any<any>(this.widget.onDidChangeSelection, this.widget.onDidChangeFocus)(() => {
			const elements = [...this.widget.getSelection(), ...this.widget.getFocus()];
			for (const element of elements) {
				if (element instanceof Marker) {
					const viewModel = this.markersViewModel.getViewModel(element);
					viewModel?.showLightBulb();
				}
			}
		}));

		this.widgetDisposables.add(this.widget.onContextMenu(this.onContextMenu, this));
		this.widgetDisposables.add(this.widget.onDidChangeSelection(this.onSelected, this));
	}

	private createTable(parent: HTMLElement): IProblemsWidget {
		const table = this.instantiationService.createInstance(MarkersTable,
			dom.append(parent, dom.$('.markers-table-container')),
			this.markersViewModel,
			this.getResourceMarkers(),
			this.filter.options,
			{
				accessibilityProvider: this.widgetAccessibilityProvider,
				dnd: this.instantiationService.createInstance(ResourceListDnDHandler, (element) => {
					if (element instanceof MarkerTableItem) {
						return withSelection(element.resource, element.range);
					}
					return null;
				}),
				horizontalScrolling: false,
				identityProvider: this.widgetIdentityProvider,
				multipleSelectionSupport: true,
				selectionNavigation: true
			},
		);

		return table;
	}

	private createTree(parent: HTMLElement): IProblemsWidget {
		const onDidChangeRenderNodeCount = new Relay<ITreeNode<any, any>>();

		const treeLabels = this.instantiationService.createInstance(ResourceLabels, this);

		const virtualDelegate = new VirtualDelegate(this.markersViewModel);
		const renderers = [
			this.instantiationService.createInstance(ResourceMarkersRenderer, treeLabels, onDidChangeRenderNodeCount.event),
			this.instantiationService.createInstance(MarkerRenderer, this.markersViewModel),
			this.instantiationService.createInstance(RelatedInformationRenderer)
		];

		const tree = this.instantiationService.createInstance(MarkersTree,
			'MarkersView',
			dom.append(parent, dom.$('.tree-container.show-file-icons')),
			virtualDelegate,
			renderers,
			{
				filter: this.filter,
				accessibilityProvider: this.widgetAccessibilityProvider,
				identityProvider: this.widgetIdentityProvider,
				dnd: this.instantiationService.createInstance(MarkersListDnDHandler),
				expandOnlyOnTwistieClick: (e: MarkerElement) => e instanceof Marker && e.relatedInformation.length > 0,
				overrideStyles: this.getLocationBasedColors().listOverrideStyles,
				selectionNavigation: true,
				multipleSelectionSupport: true,
			},
		);

		onDidChangeRenderNodeCount.input = tree.onDidChangeRenderNodeCount;

		return tree;
	}

	collapseAll(): void {
		this.widget.collapseMarkers();
	}

	setMultiline(multiline: boolean): void {
		this.markersViewModel.multiline = multiline;
	}

	setViewMode(viewMode: MarkersViewMode): void {
		this.markersViewModel.viewMode = viewMode;
	}

	private onDidChangeMarkersViewVisibility(visible: boolean): void {
		this.onVisibleDisposables.clear();
		if (visible) {
			for (const disposable of this.reInitialize()) {
				this.onVisibleDisposables.add(disposable);
			}
			this.refreshPanel();
		}
	}

	private reInitialize(): IDisposable[] {
		const disposables = [];

		// Markers Model
		const readMarkers = (resource?: URI) => this.markerService.read({ resource, severities: MarkerSeverity.Error | MarkerSeverity.Warning | MarkerSeverity.Info });
		this.markersModel.setResourceMarkers(groupBy(readMarkers(), compareMarkersByUri).map(group => [group[0].resource, group]));
		disposables.push(Event.debounce<readonly URI[], ResourceMap<URI>>(this.markerService.onMarkerChanged, (resourcesMap, resources) => {
			resourcesMap = resourcesMap || new ResourceMap<URI>();
			resources.forEach(resource => resourcesMap.set(resource, resource));
			return resourcesMap;
		}, 64)(resourcesMap => {
			this.markersModel.setResourceMarkers([...resourcesMap.values()].map(resource => [resource, readMarkers(resource)]));
		}));
		disposables.push(Event.any<MarkerChangesEvent | void>(this.markersModel.onDidChange, this.editorService.onDidActiveEditorChange)(changes => {
			if (changes) {
				this.onDidChangeModel(changes);
			} else {
				this.onActiveEditorChanged();
			}
		}));
		disposables.push(toDisposable(() => this.markersModel.reset()));

		// Markers View Model
		this.markersModel.resourceMarkers.forEach(resourceMarker => resourceMarker.markers.forEach(marker => this.markersViewModel.add(marker)));
		disposables.push(this.markersViewModel.onDidChange(marker => this.onDidChangeViewState(marker)));
		disposables.push(toDisposable(() => this.markersModel.resourceMarkers.forEach(resourceMarker => this.markersViewModel.remove(resourceMarker.resource))));

		// Markers Filters
		disposables.push(this.filters.onDidChange((event: IMarkersFiltersChangeEvent) => {
			if (event.activeFile) {
				this.refreshPanel();
			} else if (event.excludedFiles || event.showWarnings || event.showErrors || event.showInfos) {
				this.updateFilter();
			}
		}));
		disposables.push(this.filterWidget.onDidChangeFilterText(e => this.updateFilter()));
		disposables.push(toDisposable(() => { this.cachedFilterStats = undefined; }));

		disposables.push(toDisposable(() => this.rangeHighlightDecorations.removeHighlightRange()));

		return disposables;
	}

	private onDidChangeModel(change: MarkerChangesEvent): void {
		const resourceMarkers = [...change.added, ...change.removed, ...change.updated];
		const resources: URI[] = [];
		for (const { resource } of resourceMarkers) {
			this.markersViewModel.remove(resource);
			const resourceMarkers = this.markersModel.getResourceMarkers(resource);
			if (resourceMarkers) {
				for (const marker of resourceMarkers.markers) {
					this.markersViewModel.add(marker);
				}
			}
			resources.push(resource);
		}
		this.currentResourceGotAddedToMarkersData = this.currentResourceGotAddedToMarkersData || this.isCurrentResourceGotAddedToMarkersData(resources);
		this.refreshPanel(change);
		this.updateRangeHighlights();
		if (this.currentResourceGotAddedToMarkersData) {
			this.autoReveal();
			this.currentResourceGotAddedToMarkersData = false;
		}
	}

	private onDidChangeViewMode(): void {
		if (this.widgetContainer && this.widget) {
			this.widgetContainer.textContent = '';
			this.widgetDisposables.clear();
		}

		// Save selection
		const selection = new Set<Marker>();
		for (const marker of this.widget.getSelection()) {
			if (marker instanceof ResourceMarkers) {
				marker.markers.forEach(m => selection.add(m));
			} else if (marker instanceof Marker || marker instanceof MarkerTableItem) {
				selection.add(marker);
			}
		}

		// Save focus
		const focus = new Set<Marker>();
		for (const marker of this.widget.getFocus()) {
			if (marker instanceof Marker || marker instanceof MarkerTableItem) {
				focus.add(marker);
			}
		}

		// Create new widget
		this.createWidget(this.widgetContainer);
		this.refreshPanel();

		// Restore selection
		if (selection.size > 0) {
			this.widget.setMarkerSelection(Array.from(selection), Array.from(focus));
			this.widget.domFocus();
		}
	}

	private isCurrentResourceGotAddedToMarkersData(changedResources: URI[]) {
		const currentlyActiveResource = this.currentActiveResource;
		if (!currentlyActiveResource) {
			return false;
		}
		const resourceForCurrentActiveResource = this.getResourceForCurrentActiveResource();
		if (resourceForCurrentActiveResource) {
			return false;
		}
		return changedResources.some(r => r.toString() === currentlyActiveResource.toString());
	}

	private onActiveEditorChanged(): void {
		this.setCurrentActiveEditor();
		if (this.filters.activeFile) {
			this.refreshPanel();
		}
		this.autoReveal();
	}

	private setCurrentActiveEditor(): void {
		const activeEditor = this.editorService.activeEditor;
		this.currentActiveResource = activeEditor ? EditorResourceAccessor.getOriginalUri(activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY }) ?? null : null;
	}

	private onSelected(): void {
		const selection = this.widget.getSelection();
		if (selection && selection.length > 0) {
			this.lastSelectedRelativeTop = this.widget.getRelativeTop(selection[0]) || 0;
		}
	}

	private hasNoProblems(): boolean {
		const { total, filtered } = this.getFilterStats();
		return total === 0 || filtered === 0;
	}

	private renderContent(): void {
		this.cachedFilterStats = undefined;
		this.resetWidget();
		this.toggleVisibility(this.hasNoProblems());
		this.renderMessage();
	}

	private renderMessage(): void {
		if (!this.messageBoxContainer || !this.ariaLabelElement) {
			return;
		}
		dom.clearNode(this.messageBoxContainer);
		const { total, filtered } = this.getFilterStats();

		if (filtered === 0) {
			this.messageBoxContainer.style.display = 'block';
			this.messageBoxContainer.setAttribute('tabIndex', '0');
			if (this.filters.activeFile) {
				this.renderFilterMessageForActiveFile(this.messageBoxContainer);
			} else {
				if (total > 0) {
					this.renderFilteredByFilterMessage(this.messageBoxContainer);
				} else {
					this.renderNoProblemsMessage(this.messageBoxContainer);
				}
			}
		} else {
			this.messageBoxContainer.style.display = 'none';
			if (filtered === total) {
				this.setAriaLabel(localize('No problems filtered', "Showing {0} problems", total));
			} else {
				this.setAriaLabel(localize('problems filtered', "Showing {0} of {1} problems", filtered, total));
			}
			this.messageBoxContainer.removeAttribute('tabIndex');
		}
	}

	private renderFilterMessageForActiveFile(container: HTMLElement): void {
		if (this.currentActiveResource && this.markersModel.getResourceMarkers(this.currentActiveResource)) {
			this.renderFilteredByFilterMessage(container);
		} else {
			this.renderNoProblemsMessageForActiveFile(container);
		}
	}

	private renderFilteredByFilterMessage(container: HTMLElement) {
		const span1 = dom.append(container, dom.$('span'));
		span1.textContent = Messages.MARKERS_PANEL_NO_PROBLEMS_FILTERS;
		const link = dom.append(container, dom.$('a.messageAction'));
		link.textContent = localize('clearFilter', "Clear Filters");
		link.setAttribute('tabIndex', '0');
		const span2 = dom.append(container, dom.$('span'));
		span2.textContent = '.';
		dom.addStandardDisposableListener(link, dom.EventType.CLICK, () => this.clearFilters());
		dom.addStandardDisposableListener(link, dom.EventType.KEY_DOWN, (e: IKeyboardEvent) => {
			if (e.equals(KeyCode.Enter) || e.equals(KeyCode.Space)) {
				this.clearFilters();
				e.stopPropagation();
			}
		});
		this.setAriaLabel(Messages.MARKERS_PANEL_NO_PROBLEMS_FILTERS);
	}

	private renderNoProblemsMessageForActiveFile(container: HTMLElement) {
		const span = dom.append(container, dom.$('span'));
		span.textContent = Messages.MARKERS_PANEL_NO_PROBLEMS_ACTIVE_FILE_BUILT;
		this.setAriaLabel(Messages.MARKERS_PANEL_NO_PROBLEMS_ACTIVE_FILE_BUILT);
	}

	private renderNoProblemsMessage(container: HTMLElement) {
		const span = dom.append(container, dom.$('span'));
		span.textContent = Messages.MARKERS_PANEL_NO_PROBLEMS_BUILT;
		this.setAriaLabel(Messages.MARKERS_PANEL_NO_PROBLEMS_BUILT);
	}

	private setAriaLabel(label: string): void {
		this.widget.setAriaLabel(label);
		this.ariaLabelElement!.setAttribute('aria-label', label);
	}

	private clearFilters(): void {
		this.filterWidget.setFilterText('');
		this.filters.excludedFiles = false;
		this.filters.showErrors = true;
		this.filters.showWarnings = true;
		this.filters.showInfos = true;
	}

	private autoReveal(focus: boolean = false): void {
		// No need to auto reveal if active file filter is on
		if (this.filters.activeFile) {
			return;
		}
		const autoReveal = this.configurationService.getValue<boolean>('problems.autoReveal');
		if (typeof autoReveal === 'boolean' && autoReveal) {
			const currentActiveResource = this.getResourceForCurrentActiveResource();
			this.widget.revealMarkers(currentActiveResource, focus, this.lastSelectedRelativeTop);
		}
	}

	private getResourceForCurrentActiveResource(): ResourceMarkers | null {
		return this.currentActiveResource ? this.markersModel.getResourceMarkers(this.currentActiveResource) : null;
	}

	private updateRangeHighlights() {
		this.rangeHighlightDecorations.removeHighlightRange();
		if (dom.isActiveElement(this.widget.getHTMLElement())) {
			this.highlightCurrentSelectedMarkerRange();
		}
	}

	private highlightCurrentSelectedMarkerRange() {
		const selections = this.widget.getSelection() ?? [];

		if (selections.length !== 1) {
			return;
		}

		const selection = selections[0];

		if (!(selection instanceof Marker)) {
			return;
		}

		this.rangeHighlightDecorations.highlightRange(selection);
	}

	private onContextMenu(e: ITreeContextMenuEvent<MarkerElement | null> | ITableContextMenuEvent<MarkerTableItem>): void {
		const element = e.element;
		if (!element) {
			return;
		}

		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();

		this.contextMenuService.showContextMenu({
			getAnchor: () => e.anchor,
			menuId: MenuId.ProblemsPanelContext,
			contextKeyService: this.widget.contextKeyService,
			getActions: () => this.getMenuActions(element),
			getActionViewItem: (action) => {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel() });
				}
				return undefined;
			},
			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.widget.domFocus();
				}
			}
		});
	}

	private getMenuActions(element: MarkerElement | null): IAction[] {
		const result: IAction[] = [];

		if (element instanceof Marker) {
			const viewModel = this.markersViewModel.getViewModel(element);
			if (viewModel) {
				const quickFixActions = viewModel.quickFixAction.quickFixes;
				if (quickFixActions.length) {
					result.push(...quickFixActions);
					result.push(new Separator());
				}
			}
		}

		return result;
	}

	public getFocusElement(): MarkerElement | undefined {
		return this.widget.getFocus()[0] ?? undefined;
	}

	public getFocusedSelectedElements(): MarkerElement[] | null {
		const focus = this.getFocusElement();
		if (!focus) {
			return null;
		}
		const selection = this.widget.getSelection();
		if (selection.includes(focus)) {
			const result: MarkerElement[] = [];
			for (const selected of selection) {
				if (selected) {
					result.push(selected);
				}
			}
			return result;
		} else {
			return [focus];
		}
	}

	public getAllResourceMarkers(): ResourceMarkers[] {
		return this.markersModel.resourceMarkers;
	}

	getFilterStats(): { total: number; filtered: number } {
		if (!this.cachedFilterStats) {
			this.cachedFilterStats = {
				total: this.markersModel.total,
				filtered: this.widget?.getVisibleItemCount() ?? 0
			};
		}

		return this.cachedFilterStats;
	}

	private toggleVisibility(hide: boolean): void {
		this.widget.toggleVisibility(hide);
		this.layoutBodyContent();
	}

	override saveState(): void {
		this.panelState.filter = this.filterWidget.getFilterText();
		this.panelState.filterHistory = this.filters.filterHistory;
		this.panelState.showErrors = this.filters.showErrors;
		this.panelState.showWarnings = this.filters.showWarnings;
		this.panelState.showInfos = this.filters.showInfos;
		this.panelState.useFilesExclude = this.filters.excludedFiles;
		this.panelState.activeFile = this.filters.activeFile;
		this.panelState.multiline = this.markersViewModel.multiline;
		this.panelState.viewMode = this.markersViewModel.viewMode;

		this.memento.saveMemento();
		super.saveState();
	}

	override dispose() {
		super.dispose();
	}

}

class MarkersTree extends WorkbenchObjectTree<MarkerElement, FilterData> implements IProblemsWidget {

	private readonly visibilityContextKey: IContextKey<boolean>;

	constructor(
		user: string,
		private readonly container: HTMLElement,
		delegate: IListVirtualDelegate<MarkerElement>,
		renderers: ITreeRenderer<MarkerElement, FilterData, any>[],
		options: IWorkbenchObjectTreeOptions<MarkerElement, FilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(user, container, delegate, renderers, options, instantiationService, contextKeyService, listService, configurationService);
		this.visibilityContextKey = MarkersContextKeys.MarkersTreeVisibilityContextKey.bindTo(contextKeyService);
	}

	collapseMarkers(): void {
		this.collapseAll();
		this.setSelection([]);
		this.setFocus([]);
		this.getHTMLElement().focus();
		this.focusFirst();
	}

	filterMarkers(): void {
		this.refilter();
	}

	getVisibleItemCount(): number {
		let filtered = 0;
		const root = this.getNode();

		for (const resourceMarkerNode of root.children) {
			for (const markerNode of resourceMarkerNode.children) {
				if (resourceMarkerNode.visible && markerNode.visible) {
					filtered++;
				}
			}
		}

		return filtered;
	}

	isVisible(): boolean {
		return !this.container.classList.contains('hidden');
	}

	toggleVisibility(hide: boolean): void {
		this.visibilityContextKey.set(!hide);
		this.container.classList.toggle('hidden', hide);
	}

	reset(resourceMarkers: ResourceMarkers[]): void {
		this.setChildren(null, Iterable.map(resourceMarkers, m => ({ element: m, children: createResourceMarkersIterator(m) })));
	}

	revealMarkers(activeResource: ResourceMarkers | null, focus: boolean, lastSelectedRelativeTop: number): void {
		if (activeResource) {
			if (this.hasElement(activeResource)) {
				if (!this.isCollapsed(activeResource) && this.hasSelectedMarkerFor(activeResource)) {
					this.reveal(this.getSelection()[0], lastSelectedRelativeTop);
					if (focus) {
						this.setFocus(this.getSelection());
					}
				} else {
					this.expand(activeResource);
					this.reveal(activeResource, 0);

					if (focus) {
						this.setFocus([activeResource]);
						this.setSelection([activeResource]);
					}
				}
			}
		} else if (focus) {
			this.setSelection([]);
			this.focusFirst();
		}
	}

	setAriaLabel(label: string): void {
		this.ariaLabel = label;
	}

	setMarkerSelection(selection?: Marker[], focus?: Marker[]): void {
		if (this.isVisible()) {
			if (selection && selection.length > 0) {
				this.setSelection(selection.map(m => this.findMarkerNode(m)));

				if (focus && focus.length > 0) {
					this.setFocus(focus.map(f => this.findMarkerNode(f)));
				} else {
					this.setFocus([this.findMarkerNode(selection[0])]);
				}

				this.reveal(this.findMarkerNode(selection[0]));
			} else if (this.getSelection().length === 0) {
				const firstVisibleElement = this.firstVisibleElement;
				const marker = firstVisibleElement ?
					firstVisibleElement instanceof ResourceMarkers ? firstVisibleElement.markers[0] :
						firstVisibleElement instanceof Marker ? firstVisibleElement : undefined
					: undefined;

				if (marker) {
					this.setSelection([marker]);
					this.setFocus([marker]);
					this.reveal(marker);
				}
			}
		}
	}

	update(resourceMarkers: ResourceMarkers[]): void {
		for (const resourceMarker of resourceMarkers) {
			if (this.hasElement(resourceMarker)) {
				this.setChildren(resourceMarker, createResourceMarkersIterator(resourceMarker));
				this.rerender(resourceMarker);
			}
		}
	}

	updateMarker(marker: Marker): void {
		this.rerender(marker);
	}

	private findMarkerNode(marker: Marker) {
		for (const resourceNode of this.getNode().children) {
			for (const markerNode of resourceNode.children) {
				if (markerNode.element instanceof Marker && markerNode.element.marker === marker.marker) {
					return markerNode.element;
				}
			}
		}

		return null;
	}

	private hasSelectedMarkerFor(resource: ResourceMarkers): boolean {
		const selectedElement = this.getSelection();
		if (selectedElement && selectedElement.length > 0) {
			if (selectedElement[0] instanceof Marker) {
				if (resource.has((<Marker>selectedElement[0]).marker.resource)) {
					return true;
				}
			}
		}

		return false;
	}

	override dispose(): void {
		super.dispose();
	}

	override layout(height: number, width: number): void {
		this.container.style.height = `${height}px`;
		super.layout(height, width);
	}
}

class MarkersListDnDHandler extends ResourceListDnDHandler<MarkerElement | MarkerTableItem> {
	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(element => {
			if (element instanceof MarkerTableItem) {
				return withSelection(element.resource, element.range);
			} else if (element instanceof ResourceMarkers) {
				return element.resource;
			} else if (element instanceof Marker) {
				return withSelection(element.resource, element.range);
			} else if (element instanceof RelatedInformation) {
				return withSelection(element.raw.resource, element.raw);
			}
			return null;
		}, instantiationService);
	}

	protected override onWillDragElements(elements: (MarkerElement | MarkerTableItem)[], originalEvent: DragEvent) {
		const data = elements.map((e): MarkerTransferData | undefined => {
			if (e instanceof RelatedInformation || e instanceof Marker) {
				return e.marker;
			}
			if (e instanceof ResourceMarkers) {
				return { uri: e.resource };
			}
			return undefined;
		}).filter(isDefined);

		if (!data.length) {
			return;
		}

		fillInMarkersDragData(data, originalEvent);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersViewActions.css]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersViewActions.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.markers-panel-action-filter > .markers-panel-filter-controls > .monaco-action-bar .action-label.markers-filters.checked {
	border-color: var(--vscode-inputOption-activeBorder);
	color: var(--vscode-inputOption-activeForeground);
	background-color: var(--vscode-inputOption-activeBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersViewActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersViewActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import Messages from './messages.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Marker } from './markersModel.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ActionViewItem, IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { MarkersContextKeys } from '../common/markers.js';
import './markersViewActions.css';

export interface IMarkersFiltersChangeEvent {
	excludedFiles?: boolean;
	showWarnings?: boolean;
	showErrors?: boolean;
	showInfos?: boolean;
	activeFile?: boolean;
}

export interface IMarkersFiltersOptions {
	filterHistory: string[];
	showErrors: boolean;
	showWarnings: boolean;
	showInfos: boolean;
	excludedFiles: boolean;
	activeFile: boolean;
}

export class MarkersFilters extends Disposable {

	private readonly _onDidChange: Emitter<IMarkersFiltersChangeEvent> = this._register(new Emitter<IMarkersFiltersChangeEvent>());
	readonly onDidChange: Event<IMarkersFiltersChangeEvent> = this._onDidChange.event;

	constructor(options: IMarkersFiltersOptions, contextKeyService: IContextKeyService) {
		super();

		this._excludedFiles = MarkersContextKeys.ShowExcludedFilesFilterContextKey.bindTo(contextKeyService);
		this._excludedFiles.set(options.excludedFiles);

		this._activeFile = MarkersContextKeys.ShowActiveFileFilterContextKey.bindTo(contextKeyService);
		this._activeFile.set(options.activeFile);

		this._showWarnings = MarkersContextKeys.ShowWarningsFilterContextKey.bindTo(contextKeyService);
		this._showWarnings.set(options.showWarnings);

		this._showInfos = MarkersContextKeys.ShowInfoFilterContextKey.bindTo(contextKeyService);
		this._showInfos.set(options.showInfos);

		this._showErrors = MarkersContextKeys.ShowErrorsFilterContextKey.bindTo(contextKeyService);
		this._showErrors.set(options.showErrors);

		this.filterHistory = options.filterHistory;
	}

	filterHistory: string[];

	private readonly _excludedFiles: IContextKey<boolean>;
	get excludedFiles(): boolean {
		return !!this._excludedFiles.get();
	}
	set excludedFiles(filesExclude: boolean) {
		if (this._excludedFiles.get() !== filesExclude) {
			this._excludedFiles.set(filesExclude);
			this._onDidChange.fire({ excludedFiles: true });
		}
	}

	private readonly _activeFile: IContextKey<boolean>;
	get activeFile(): boolean {
		return !!this._activeFile.get();
	}
	set activeFile(activeFile: boolean) {
		if (this._activeFile.get() !== activeFile) {
			this._activeFile.set(activeFile);
			this._onDidChange.fire({ activeFile: true });
		}
	}

	private readonly _showWarnings: IContextKey<boolean>;
	get showWarnings(): boolean {
		return !!this._showWarnings.get();
	}
	set showWarnings(showWarnings: boolean) {
		if (this._showWarnings.get() !== showWarnings) {
			this._showWarnings.set(showWarnings);
			this._onDidChange.fire({ showWarnings: true });
		}
	}

	private readonly _showErrors: IContextKey<boolean>;
	get showErrors(): boolean {
		return !!this._showErrors.get();
	}
	set showErrors(showErrors: boolean) {
		if (this._showErrors.get() !== showErrors) {
			this._showErrors.set(showErrors);
			this._onDidChange.fire({ showErrors: true });
		}
	}

	private readonly _showInfos: IContextKey<boolean>;
	get showInfos(): boolean {
		return !!this._showInfos.get();
	}
	set showInfos(showInfos: boolean) {
		if (this._showInfos.get() !== showInfos) {
			this._showInfos.set(showInfos);
			this._onDidChange.fire({ showInfos: true });
		}
	}

}

export class QuickFixAction extends Action {

	public static readonly ID: string = 'workbench.actions.problems.quickfix';
	private static readonly CLASS: string = 'markers-panel-action-quickfix ' + ThemeIcon.asClassName(Codicon.lightBulb);
	private static readonly AUTO_FIX_CLASS: string = QuickFixAction.CLASS + ' autofixable';

	private readonly _onShowQuickFixes = this._register(new Emitter<void>());
	readonly onShowQuickFixes: Event<void> = this._onShowQuickFixes.event;

	private _quickFixes: IAction[] = [];
	get quickFixes(): IAction[] {
		return this._quickFixes;
	}
	set quickFixes(quickFixes: IAction[]) {
		this._quickFixes = quickFixes;
		this.enabled = this._quickFixes.length > 0;
	}

	autoFixable(autofixable: boolean) {
		this.class = autofixable ? QuickFixAction.AUTO_FIX_CLASS : QuickFixAction.CLASS;
	}

	constructor(
		readonly marker: Marker,
	) {
		super(QuickFixAction.ID, Messages.MARKERS_PANEL_ACTION_TOOLTIP_QUICKFIX, QuickFixAction.CLASS, false);
	}

	override run(): Promise<void> {
		this._onShowQuickFixes.fire();
		return Promise.resolve();
	}
}

export class QuickFixActionViewItem extends ActionViewItem {

	constructor(
		action: QuickFixAction,
		options: IActionViewItemOptions,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		super(null, action, { ...options, icon: true, label: false });
	}

	public override onClick(event: DOM.EventLike): void {
		DOM.EventHelper.stop(event, true);
		this.showQuickFixes();
	}

	public showQuickFixes(): void {
		if (!this.element) {
			return;
		}
		if (!this.isEnabled()) {
			return;
		}
		const elementPosition = DOM.getDomNodePagePosition(this.element);
		const quickFixes = (<QuickFixAction>this.action).quickFixes;
		if (quickFixes.length) {
			this.contextMenuService.showContextMenu({
				getAnchor: () => ({ x: elementPosition.left + 10, y: elementPosition.top + elementPosition.height + 4 }),
				getActions: () => quickFixes
			});
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/messages.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/messages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { basename } from '../../../../base/common/resources.js';
import { MarkerSeverity, IRelatedInformation } from '../../../../platform/markers/common/markers.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Marker } from './markersModel.js';

export default class Messages {

	public static MARKERS_PANEL_TOGGLE_LABEL: string = nls.localize('problems.view.toggle.label', "Toggle Problems (Errors, Warnings, Infos)");
	public static MARKERS_PANEL_SHOW_LABEL = nls.localize2('problems.view.focus.label', "Focus Problems (Errors, Warnings, Infos)");

	public static PROBLEMS_PANEL_CONFIGURATION_TITLE: string = nls.localize('problems.panel.configuration.title', "Problems View");
	public static PROBLEMS_PANEL_CONFIGURATION_AUTO_REVEAL: string = nls.localize('problems.panel.configuration.autoreveal', "Controls whether Problems view should automatically reveal files when opening them.");
	public static PROBLEMS_PANEL_CONFIGURATION_VIEW_MODE: string = nls.localize('problems.panel.configuration.viewMode', "Controls the default view mode of the Problems view.");
	public static PROBLEMS_PANEL_CONFIGURATION_SHOW_CURRENT_STATUS: string = nls.localize('problems.panel.configuration.showCurrentInStatus', "When enabled shows the current problem in the status bar.");
	public static PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER: string = nls.localize('problems.panel.configuration.compareOrder', "Controls the order in which problems are navigated.");
	public static PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER_SEVERITY: string = nls.localize('problems.panel.configuration.compareOrder.severity', "Navigate problems ordered by severity");
	public static PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER_POSITION: string = nls.localize('problems.panel.configuration.compareOrder.position', "Navigate problems ordered by position");

	public static MARKERS_PANEL_TITLE_PROBLEMS: ILocalizedString = nls.localize2('markers.panel.title.problems', "Problems");

	public static MARKERS_PANEL_NO_PROBLEMS_BUILT: string = nls.localize('markers.panel.no.problems.build', "No problems have been detected in the workspace.");
	public static MARKERS_PANEL_NO_PROBLEMS_ACTIVE_FILE_BUILT: string = nls.localize('markers.panel.no.problems.activeFile.build', "No problems have been detected in the current file.");
	public static MARKERS_PANEL_NO_PROBLEMS_FILTERS: string = nls.localize('markers.panel.no.problems.filters', "No results found with provided filter criteria.");

	public static MARKERS_PANEL_ACTION_TOOLTIP_MORE_FILTERS: string = nls.localize('markers.panel.action.moreFilters', "More Filters...");
	public static MARKERS_PANEL_FILTER_LABEL_SHOW_ERRORS: string = nls.localize('markers.panel.filter.showErrors', "Show Errors");
	public static MARKERS_PANEL_FILTER_LABEL_SHOW_WARNINGS: string = nls.localize('markers.panel.filter.showWarnings', "Show Warnings");
	public static MARKERS_PANEL_FILTER_LABEL_SHOW_INFOS: string = nls.localize('markers.panel.filter.showInfos', "Show Infos");
	public static MARKERS_PANEL_FILTER_LABEL_EXCLUDED_FILES: string = nls.localize('markers.panel.filter.useFilesExclude', "Hide Excluded Files");
	public static MARKERS_PANEL_FILTER_LABEL_ACTIVE_FILE: string = nls.localize('markers.panel.filter.activeFile', "Show Active File Only");
	public static MARKERS_PANEL_ACTION_TOOLTIP_FILTER: string = nls.localize('markers.panel.action.filter', "Filter Problems");
	public static MARKERS_PANEL_ACTION_TOOLTIP_QUICKFIX: string = nls.localize('markers.panel.action.quickfix', "Show fixes");
	public static MARKERS_PANEL_FILTER_ARIA_LABEL: string = nls.localize('markers.panel.filter.ariaLabel', "Filter Problems");
	public static MARKERS_PANEL_FILTER_PLACEHOLDER: string = nls.localize('markers.panel.filter.placeholder', "Filter (e.g. text, **/*.ts, !**/node_modules/**, @source:ts)");
	public static MARKERS_PANEL_FILTER_ERRORS: string = nls.localize('markers.panel.filter.errors', "errors");
	public static MARKERS_PANEL_FILTER_WARNINGS: string = nls.localize('markers.panel.filter.warnings', "warnings");
	public static MARKERS_PANEL_FILTER_INFOS: string = nls.localize('markers.panel.filter.infos', "infos");

	public static MARKERS_PANEL_SINGLE_ERROR_LABEL: string = nls.localize('markers.panel.single.error.label', "1 Error");
	public static readonly MARKERS_PANEL_MULTIPLE_ERRORS_LABEL = (noOfErrors: number): string => { return nls.localize('markers.panel.multiple.errors.label', "{0} Errors", '' + noOfErrors); };
	public static MARKERS_PANEL_SINGLE_WARNING_LABEL: string = nls.localize('markers.panel.single.warning.label', "1 Warning");
	public static readonly MARKERS_PANEL_MULTIPLE_WARNINGS_LABEL = (noOfWarnings: number): string => { return nls.localize('markers.panel.multiple.warnings.label', "{0} Warnings", '' + noOfWarnings); };
	public static MARKERS_PANEL_SINGLE_INFO_LABEL: string = nls.localize('markers.panel.single.info.label', "1 Info");
	public static readonly MARKERS_PANEL_MULTIPLE_INFOS_LABEL = (noOfInfos: number): string => { return nls.localize('markers.panel.multiple.infos.label', "{0} Infos", '' + noOfInfos); };
	public static MARKERS_PANEL_SINGLE_UNKNOWN_LABEL: string = nls.localize('markers.panel.single.unknown.label', "1 Unknown");
	public static readonly MARKERS_PANEL_MULTIPLE_UNKNOWNS_LABEL = (noOfUnknowns: number): string => { return nls.localize('markers.panel.multiple.unknowns.label', "{0} Unknowns", '' + noOfUnknowns); };

	public static readonly MARKERS_PANEL_AT_LINE_COL_NUMBER = (ln: number, col: number): string => { return nls.localize('markers.panel.at.ln.col.number', "[Ln {0}, Col {1}]", '' + ln, '' + col); };

	public static readonly MARKERS_TREE_ARIA_LABEL_RESOURCE = (noOfProblems: number, fileName: string, folder: string): string => { return nls.localize('problems.tree.aria.label.resource', "{0} problems in file {1} of folder {2}", noOfProblems, fileName, folder); };
	public static readonly MARKERS_TREE_ARIA_LABEL_MARKER = (marker: Marker): string => {
		const relatedInformationMessage = marker.relatedInformation.length ? nls.localize('problems.tree.aria.label.marker.relatedInformation', " This problem has references to {0} locations.", marker.relatedInformation.length) : '';
		switch (marker.marker.severity) {
			case MarkerSeverity.Error:
				return marker.marker.source ? nls.localize('problems.tree.aria.label.error.marker', "Error: {0} at line {1} and character {2}.{3} generated by {4}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage, marker.marker.source)
					: nls.localize('problems.tree.aria.label.error.marker.nosource', "Error: {0} at line {1} and character {2}.{3}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage);
			case MarkerSeverity.Warning:
				return marker.marker.source ? nls.localize('problems.tree.aria.label.warning.marker', "Warning: {0} at line {1} and character {2}.{3} generated by {4}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage, marker.marker.source)
					: nls.localize('problems.tree.aria.label.warning.marker.nosource', "Warning: {0} at line {1} and character {2}.{3}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage, relatedInformationMessage);

			case MarkerSeverity.Info:
				return marker.marker.source ? nls.localize('problems.tree.aria.label.info.marker', "Info: {0} at line {1} and character {2}.{3} generated by {4}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage, marker.marker.source)
					: nls.localize('problems.tree.aria.label.info.marker.nosource', "Info: {0} at line {1} and character {2}.{3}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage);
			default:
				return marker.marker.source ? nls.localize('problems.tree.aria.label.marker', "Problem: {0} at line {1} and character {2}.{3} generated by {4}", marker.marker.source, marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage, marker.marker.source)
					: nls.localize('problems.tree.aria.label.marker.nosource', "Problem: {0} at line {1} and character {2}.{3}", marker.marker.message, marker.marker.startLineNumber, marker.marker.startColumn, relatedInformationMessage);
		}
	};
	public static readonly MARKERS_TREE_ARIA_LABEL_RELATED_INFORMATION = (relatedInformation: IRelatedInformation): string => nls.localize('problems.tree.aria.label.relatedinfo.message', "{0} at line {1} and character {2} in {3}", relatedInformation.message, relatedInformation.startLineNumber, relatedInformation.startColumn, basename(relatedInformation.resource));
	public static SHOW_ERRORS_WARNINGS_ACTION_LABEL: string = nls.localize('errors.warnings.show.label', "Show Errors and Warnings");
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/media/markers.css]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/media/markers.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.markers-panel .markers-panel-container {
	height: 100%;
}

.markers-panel .hide {
	display: none;
}

.markers-panel .markers-panel-container .message-box-container {
	line-height: 22px;
	padding-left: 20px;
}

.markers-panel .markers-panel-container .message-box-container .messageAction {
	margin-left: 4px;
	cursor: pointer;
	text-decoration: underline;
}

.markers-panel  .markers-panel-container .hidden {
	display: none;
}

.markers-panel  .markers-panel-container .codicon.codicon-light-bulb {
	color:  var(--vscode-editorLightBulb-foreground);
}

.markers-panel  .markers-panel-container .codicon.codicon-lightbulb-autofix {
	color:  var(--vscode-editorLightBulbAutoFix-foreground);
}

.markers-panel .markers-panel-container .tree-container.hidden {
	display: none;
	visibility: hidden;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents {
	display: flex;
	line-height: 22px;
	padding-right: 10px;
}

.monaco-workbench.hc-black .markers-panel .markers-panel-container .tree-container .monaco-tl-contents,
.monaco-workbench.hc-light .markers-panel .markers-panel-container .tree-container .monaco-tl-contents {
	line-height: 20px;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-stats {
	display: inline-block;
	margin-left: 10px;
}

.markers-panel:not(.wide) .markers-panel-container .tree-container .monaco-tl-contents .resource-label-container {
	flex: 1;
}

.markers-panel.wide .markers-panel-container .tree-container .monaco-tl-contents .count-badge-wrapper {
	margin-left: 10px;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-message-details-container {
	flex: 1;
	overflow: hidden;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-message-details-container > .marker-message-line {
	overflow: hidden;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-message-details-container > .marker-message-line > .marker-message {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: pre;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-message-details-container > .marker-message-line.details-container {
	display: flex;
}

.markers-panel .markers-panel-container .tree-container .monaco-list:focus .monaco-list-row.focused .monaco-tl-contents .details-container a.monaco-link {
	color: inherit;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .details-container a.monaco-link .monaco-highlighted-label {
	text-decoration: underline;
	text-underline-position: under;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-code:before {
	content: '(';
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-code:after {
	content: ')';
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .details-container .multiline-actions,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .details-container .marker-source,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .details-container .marker-line {
	margin-left: 6px;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-source,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .related-info-resource,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .related-info-resource-separator,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-line,
.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .marker-code {
	opacity: 0.7;
}

.markers-panel .markers-panel-container .tree-container .monaco-tl-contents .highlight {
	font-weight: bold;
}

.markers-panel .monaco-tl-contents .marker-icon {
	height: 22px;
	margin: 0 6px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.markers-panel .monaco-tl-contents .actions .monaco-action-bar {
	display: none;
}

.markers-panel .monaco-list-row:hover .monaco-tl-contents > .marker-icon.quickFix,
.markers-panel .monaco-list-row.selected .monaco-tl-contents > .marker-icon.quickFix,
.markers-panel .monaco-list-row.focused .monaco-tl-contents > .marker-icon.quickFix {
	display: none;
}

.markers-panel .monaco-list-row:hover .monaco-tl-contents .actions .monaco-action-bar,
.markers-panel .monaco-list-row.selected .monaco-tl-contents .actions .monaco-action-bar,
.markers-panel .monaco-list-row.focused .monaco-tl-contents .actions .monaco-action-bar {
	display: block;
}

.markers-panel .monaco-tl-contents .actions,
.markers-panel .monaco-tl-contents .multiline-actions .monaco-action-bar {
	height: 22px;
}

.markers-panel .monaco-tl-contents .actions .action-label,
.markers-panel .monaco-tl-contents .multiline-actions .monaco-action-bar .action-label {
	padding: 2px;
}

.markers-panel .monaco-tl-contents .actions .action-item {
	margin: 0 4px;
}

.markers-panel .monaco-tl-contents .multiline-actions .action-item.disabled,
.markers-panel .monaco-tl-contents .actions .action-item.disabled {
	display: none;
}

/* Table */

.markers-panel .markers-table-container .monaco-table .monaco-table-th {
	display: flex;
	font-weight: 600;
	align-items: center;
	padding-left: 10px;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td {
	display: flex;
	align-items: center;
	padding-left: 10px;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td .highlight {
	font-weight: bold;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .message,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .file,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .source {
	overflow: hidden;
	text-overflow: ellipsis;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .severity {
	display: flex;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row.selected .monaco-table-tr > .monaco-table-td.quickFix > .severity,
.markers-panel .markers-table-container .monaco-table .monaco-list-row.focused .monaco-table-tr > .monaco-table-td.quickFix > .severity,
.markers-panel .markers-table-container .monaco-table .monaco-list-row:hover .monaco-table-tr > .monaco-table-td.quickFix > .severity {
	display: none;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .actions {
	margin-left: -3px;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .actions > .monaco-action-bar .action-item {
	display: none;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row.selected .monaco-table-tr > .monaco-table-td.quickFix > .actions > .monaco-action-bar .action-item,
.markers-panel .markers-table-container .monaco-table .monaco-list-row.focused .monaco-table-tr > .monaco-table-td.quickFix > .actions > .monaco-action-bar .action-item,
.markers-panel .markers-table-container .monaco-table .monaco-list-row:hover .monaco-table-tr > .monaco-table-td.quickFix > .actions > .monaco-action-bar .action-item {
	display: flex;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .monaco-link::before,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .code-label::before {
	content: '(';
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .monaco-link::after,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .code-label::after {
	content: ')';
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .code-label,
.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code > .monaco-link {
	display: none;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code.code-label > .code-label {
	display: inline;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .code.code-link > .monaco-link {
	display: inline;
	text-decoration: underline;
}

.markers-panel .markers-table-container .monaco-table .monaco-list-row .monaco-table-tr > .monaco-table-td > .file > .file-position {
	margin-left: 6px;
	opacity: 0.7;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/common/markers.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/common/markers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const enum MarkersViewMode {
	Table = 'table',
	Tree = 'tree'
}

export namespace Markers {
	export const MARKERS_CONTAINER_ID = 'workbench.panel.markers';
	export const MARKERS_VIEW_ID = 'workbench.panel.markers.view';
	export const MARKERS_VIEW_STORAGE_ID = 'workbench.panel.markers';
	export const MARKER_COPY_ACTION_ID = 'problems.action.copy';
	export const MARKER_COPY_MESSAGE_ACTION_ID = 'problems.action.copyMessage';
	export const RELATED_INFORMATION_COPY_MESSAGE_ACTION_ID = 'problems.action.copyRelatedInformationMessage';
	export const FOCUS_PROBLEMS_FROM_FILTER = 'problems.action.focusProblemsFromFilter';
	export const MARKERS_VIEW_FOCUS_FILTER = 'problems.action.focusFilter';
	export const MARKERS_VIEW_CLEAR_FILTER_TEXT = 'problems.action.clearFilterText';
	export const MARKERS_VIEW_SHOW_MULTILINE_MESSAGE = 'problems.action.showMultilineMessage';
	export const MARKERS_VIEW_SHOW_SINGLELINE_MESSAGE = 'problems.action.showSinglelineMessage';
	export const MARKER_OPEN_ACTION_ID = 'problems.action.open';
	export const MARKER_OPEN_SIDE_ACTION_ID = 'problems.action.openToSide';
	export const MARKER_SHOW_PANEL_ID = 'workbench.action.showErrorsWarnings';
	export const MARKER_SHOW_QUICK_FIX = 'problems.action.showQuickFixes';
	export const TOGGLE_MARKERS_VIEW_ACTION_ID = 'workbench.actions.view.toggleProblems';
}

export namespace MarkersContextKeys {
	export const MarkersViewModeContextKey = new RawContextKey<MarkersViewMode>('problemsViewMode', MarkersViewMode.Tree);
	export const MarkersTreeVisibilityContextKey = new RawContextKey<boolean>('problemsVisibility', false);
	export const MarkerFocusContextKey = new RawContextKey<boolean>('problemFocus', false);
	export const MarkerViewFilterFocusContextKey = new RawContextKey<boolean>('problemsFilterFocus', false);
	export const RelatedInformationFocusContextKey = new RawContextKey<boolean>('relatedInformationFocus', false);
	export const ShowErrorsFilterContextKey = new RawContextKey<boolean>('problems.filter.errors', true);
	export const ShowWarningsFilterContextKey = new RawContextKey<boolean>('problems.filter.warnings', true);
	export const ShowInfoFilterContextKey = new RawContextKey<boolean>('problems.filter.info', true);
	export const ShowActiveFileFilterContextKey = new RawContextKey<boolean>('problems.filter.activeFile', false);
	export const ShowExcludedFilesFilterContextKey = new RawContextKey<boolean>('problems.filter.excludedFiles', true);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/test/browser/markersFilterOptions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/test/browser/markersFilterOptions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FilterOptions } from '../../browser/markersFilterOptions.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('MarkersFilterOptions', () => {

	let instantiationService: TestInstantiationService;
	let uriIdentityService: IUriIdentityService;

	setup(() => {
		instantiationService = new TestInstantiationService();
		const fileService = new FileService(new NullLogService());
		instantiationService.stub(IFileService, fileService);
		uriIdentityService = instantiationService.createInstance(UriIdentityService);
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('source filter', () => {
		const filterOptions = new FilterOptions('@source:ts', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['ts']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('source filter with negation', () => {
		const filterOptions = new FilterOptions('!@source:eslint', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['eslint']);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('multiple source filters', () => {
		const filterOptions = new FilterOptions('@source:eslint @source:ts', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint', 'ts']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('source filter combined with text filter', () => {
		const filterOptions = new FilterOptions('@source:ts error', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['ts']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, 'error');
	});

	test('negated source filter combined with text filter', () => {
		const filterOptions = new FilterOptions('!@source:ts error', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['ts']);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, 'error');
	});

	test('no source filter when not specified', () => {
		const filterOptions = new FilterOptions('some text', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, []);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, 'some text');
	});

	test('source filter case insensitive', () => {
		const filterOptions = new FilterOptions('@SOURCE:TypeScript', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['typescript']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
	});

	test('complex filter with multiple source filters and text', () => {
		const filterOptions = new FilterOptions('text1 @source:eslint @source:ts text2', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint', 'ts']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, 'text1 text2');
	});

	test('source filter at the beginning', () => {
		const filterOptions = new FilterOptions('@source:eslint foo', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('source filter at the end', () => {
		const filterOptions = new FilterOptions('foo @source:eslint', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('source filter in the middle', () => {
		const filterOptions = new FilterOptions('foo @source:eslint bar', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo bar');
	});

	test('source filter with leading spaces', () => {
		const filterOptions = new FilterOptions('  @source:eslint foo', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('source filter with trailing spaces', () => {
		const filterOptions = new FilterOptions('foo @source:eslint  ', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('multiple consecutive source filters', () => {
		const filterOptions = new FilterOptions('@source:eslint @source:ts foo', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint', 'ts']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('only source filter with no text', () => {
		const filterOptions = new FilterOptions('@source:eslint', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('multiple source filters with no text', () => {
		const filterOptions = new FilterOptions('@source:eslint @source:ts', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint', 'ts']);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('negated source filter at different positions', () => {
		const filterOptions = new FilterOptions('foo !@source:eslint bar', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['eslint']);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, []);
		assert.strictEqual(filterOptions.textFilter.text, 'foo bar');
	});

	test('mixed negated and positive source filters', () => {
		const filterOptions = new FilterOptions('@source:eslint !@source:ts foo', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['eslint']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['ts']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('single quoted source with spaces', () => {
		const filterOptions = new FilterOptions('@source:"hello world"', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['hello world']);
		assert.strictEqual(filterOptions.textFilter.text, '');
	});

	test('quoted source combined with text filter', () => {
		const filterOptions = new FilterOptions('@source:"hello world" foo', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['hello world']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo');
	});

	test('mixed quoted and unquoted sources (OR logic)', () => {
		const filterOptions = new FilterOptions('@source:"hello world" @source:eslint @source:ts', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['hello world', 'eslint', 'ts']);
	});

	test('multiple quoted sources (OR logic)', () => {
		const filterOptions = new FilterOptions('@source:"hello world" @source:"foo bar"', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['hello world', 'foo bar']);
	});

	test('quoted source with negation', () => {
		const filterOptions = new FilterOptions('!@source:"hello world"', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['hello world']);
	});

	test('quoted source in the middle of filter', () => {
		const filterOptions = new FilterOptions('foo @source:"hello world" bar', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['hello world']);
		assert.strictEqual(filterOptions.textFilter.text, 'foo bar');
	});

	test('complex filter with quoted and unquoted mixed', () => {
		const filterOptions = new FilterOptions('@source:"TypeScript Compiler" @source:eslint !@source:"My Extension" text', [], true, true, true, uriIdentityService);
		assert.deepStrictEqual(filterOptions.includeSourceFilters, ['typescript compiler', 'eslint']);
		assert.deepStrictEqual(filterOptions.excludeSourceFilters, ['my extension']);
		assert.strictEqual(filterOptions.textFilter.text, 'text');
	});

	test('no filters - always matches', () => {
		const filterOptions = new FilterOptions('foo', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters(undefined), true);
	});

	test('positive filter - exact match only', () => {
		const filterOptions = new FilterOptions('@source:eslint', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('ESLint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('ts'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint-plugin'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('es'), false);
	});

	test('positive filter - no source in marker', () => {
		const filterOptions = new FilterOptions('@source:eslint', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters(undefined), false);
	});

	test('negative filter - excludes exact source', () => {
		const filterOptions = new FilterOptions('!@source:eslint', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('ts'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint-plugin'), true);
	});

	test('negative filter - no source in marker', () => {
		const filterOptions = new FilterOptions('!@source:eslint', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters(undefined), true);
	});

	test('OR logic - multiple @source filters', () => {
		const filterOptions = new FilterOptions('@source:eslint @source:ts', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('ts'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('python'), false);
	});

	test('OR logic with negation', () => {
		const filterOptions = new FilterOptions('@source:eslint @source:ts !@source:error', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('ts'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('error'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('python'), false);
	});

	test('only negative filters - excludes specified sources', () => {
		const filterOptions = new FilterOptions('!@source:eslint !@source:ts', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('ts'), false);
		assert.strictEqual(filterOptions.matchesSourceFilters('python'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters(undefined), true);
	});

	test('case insensitivity', () => {
		const filterOptions = new FilterOptions('@source:ESLint', [], true, true, true, uriIdentityService);
		assert.strictEqual(filterOptions.matchesSourceFilters('eslint'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('ESLINT'), true);
		assert.strictEqual(filterOptions.matchesSourceFilters('EsLiNt'), true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/test/browser/markersModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/test/browser/markersModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IMarker, MarkerSeverity, IRelatedInformation } from '../../../../../platform/markers/common/markers.js';
import { MarkersModel, Marker, ResourceMarkers, RelatedInformation } from '../../browser/markersModel.js';
import { groupBy } from '../../../../../base/common/collections.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

class TestMarkersModel extends MarkersModel {

	constructor(markers: IMarker[]) {
		super();

		const byResource = groupBy(markers, r => r.resource.toString());

		Object.keys(byResource).forEach(key => {
			const markers = byResource[key];
			if (markers) {
				const resource = markers[0].resource;

				this.setResourceMarkers([[resource, markers]]);
			}
		});
	}
}

suite('MarkersModel Test', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('marker ids are unique', function () {
		const marker1 = anErrorWithRange(3);
		const marker2 = anErrorWithRange(3);
		const marker3 = aWarningWithRange(3);
		const marker4 = aWarningWithRange(3);

		const testObject = new TestMarkersModel([marker1, marker2, marker3, marker4]);
		const actuals = testObject.resourceMarkers[0].markers;

		assert.notStrictEqual(actuals[0].id, actuals[1].id);
		assert.notStrictEqual(actuals[0].id, actuals[2].id);
		assert.notStrictEqual(actuals[0].id, actuals[3].id);
		assert.notStrictEqual(actuals[1].id, actuals[2].id);
		assert.notStrictEqual(actuals[1].id, actuals[3].id);
		assert.notStrictEqual(actuals[2].id, actuals[3].id);
	});

	test('sort palces resources with no errors at the end', function () {
		const marker1 = aMarker('a/res1', MarkerSeverity.Warning);
		const marker2 = aMarker('a/res2');
		const marker3 = aMarker('res4');
		const marker4 = aMarker('b/res3');
		const marker5 = aMarker('res4');
		const marker6 = aMarker('c/res2', MarkerSeverity.Info);
		const testObject = new TestMarkersModel([marker1, marker2, marker3, marker4, marker5, marker6]);

		const actuals = testObject.resourceMarkers;

		assert.strictEqual(5, actuals.length);
		assert.ok(compareResource(actuals[0], 'a/res2'));
		assert.ok(compareResource(actuals[1], 'b/res3'));
		assert.ok(compareResource(actuals[2], 'res4'));
		assert.ok(compareResource(actuals[3], 'a/res1'));
		assert.ok(compareResource(actuals[4], 'c/res2'));
	});

	test('sort resources by file path', function () {
		const marker1 = aMarker('a/res1');
		const marker2 = aMarker('a/res2');
		const marker3 = aMarker('res4');
		const marker4 = aMarker('b/res3');
		const marker5 = aMarker('res4');
		const marker6 = aMarker('c/res2');
		const testObject = new TestMarkersModel([marker1, marker2, marker3, marker4, marker5, marker6]);

		const actuals = testObject.resourceMarkers;

		assert.strictEqual(5, actuals.length);
		assert.ok(compareResource(actuals[0], 'a/res1'));
		assert.ok(compareResource(actuals[1], 'a/res2'));
		assert.ok(compareResource(actuals[2], 'b/res3'));
		assert.ok(compareResource(actuals[3], 'c/res2'));
		assert.ok(compareResource(actuals[4], 'res4'));
	});

	test('sort markers by severity, line and column', function () {
		const marker1 = aWarningWithRange(8, 1, 9, 3);
		const marker2 = aWarningWithRange(3);
		const marker3 = anErrorWithRange(8, 1, 9, 3);
		const marker4 = anIgnoreWithRange(5);
		const marker5 = anInfoWithRange(8, 1, 8, 4, 'ab');
		const marker6 = anErrorWithRange(3);
		const marker7 = anErrorWithRange(5);
		const marker8 = anInfoWithRange(5);
		const marker9 = anErrorWithRange(8, 1, 8, 4, 'ab');
		const marker10 = anErrorWithRange(10);
		const marker11 = anErrorWithRange(8, 1, 8, 4, 'ba');
		const marker12 = anIgnoreWithRange(3);
		const marker13 = aWarningWithRange(5);
		const marker14 = anErrorWithRange(4);
		const marker15 = anErrorWithRange(8, 2, 8, 4);
		const testObject = new TestMarkersModel([marker1, marker2, marker3, marker4, marker5, marker6, marker7, marker8, marker9, marker10, marker11, marker12, marker13, marker14, marker15]);

		const actuals = testObject.resourceMarkers[0].markers;

		assert.strictEqual(actuals[0].marker, marker6);
		assert.strictEqual(actuals[1].marker, marker14);
		assert.strictEqual(actuals[2].marker, marker7);
		assert.strictEqual(actuals[3].marker, marker9);
		assert.strictEqual(actuals[4].marker, marker11);
		assert.strictEqual(actuals[5].marker, marker3);
		assert.strictEqual(actuals[6].marker, marker15);
		assert.strictEqual(actuals[7].marker, marker10);
		assert.strictEqual(actuals[8].marker, marker2);
		assert.strictEqual(actuals[9].marker, marker13);
		assert.strictEqual(actuals[10].marker, marker1);
		assert.strictEqual(actuals[11].marker, marker8);
		assert.strictEqual(actuals[12].marker, marker5);
		assert.strictEqual(actuals[13].marker, marker12);
		assert.strictEqual(actuals[14].marker, marker4);
	});

	test('toString()', () => {
		let marker = aMarker('a/res1');
		marker.code = '1234';
		assert.strictEqual(JSON.stringify({ ...marker, resource: marker.resource.path }, null, '\t'), new Marker('1', marker).toString());

		marker = aMarker('a/res2', MarkerSeverity.Warning);
		assert.strictEqual(JSON.stringify({ ...marker, resource: marker.resource.path }, null, '\t'), new Marker('2', marker).toString());

		marker = aMarker('a/res2', MarkerSeverity.Info, 1, 2, 1, 8, 'Info', '');
		assert.strictEqual(JSON.stringify({ ...marker, resource: marker.resource.path }, null, '\t'), new Marker('3', marker).toString());

		marker = aMarker('a/res2', MarkerSeverity.Hint, 1, 2, 1, 8, 'Ignore message', 'Ignore');
		assert.strictEqual(JSON.stringify({ ...marker, resource: marker.resource.path }, null, '\t'), new Marker('4', marker).toString());

		marker = aMarker('a/res2', MarkerSeverity.Warning, 1, 2, 1, 8, 'Warning message', '', [{ startLineNumber: 2, startColumn: 5, endLineNumber: 2, endColumn: 10, message: 'some info', resource: URI.file('a/res3') }]);
		const testObject = new Marker('5', marker, null!);

		// hack
		// eslint-disable-next-line local/code-no-any-casts
		(testObject as any).relatedInformation = marker.relatedInformation!.map(r => new RelatedInformation('6', marker, r));
		assert.strictEqual(JSON.stringify({ ...marker, resource: marker.resource.path, relatedInformation: marker.relatedInformation!.map(r => ({ ...r, resource: r.resource.path })) }, null, '\t'), testObject.toString());
	});

	test('Markers for same-document but different fragment', function () {
		const model = new TestMarkersModel([anErrorWithRange(1)]);

		assert.strictEqual(model.total, 1);

		const document = URI.parse('foo://test/path/file');
		const frag1 = URI.parse('foo://test/path/file#1');
		const frag2 = URI.parse('foo://test/path/file#two');

		model.setResourceMarkers([[document, [{ ...aMarker(), resource: frag1 }, { ...aMarker(), resource: frag2 }]]]);

		assert.strictEqual(model.total, 3);
		const a = model.getResourceMarkers(document);
		const b = model.getResourceMarkers(frag1);
		const c = model.getResourceMarkers(frag2);
		assert.ok(a === b);
		assert.ok(a === c);

		model.setResourceMarkers([[document, [{ ...aMarker(), resource: frag2 }]]]);
		assert.strictEqual(model.total, 2);
	});

	test('Problems are no sorted correctly #99135', function () {
		const model = new TestMarkersModel([]);
		assert.strictEqual(model.total, 0);

		const document = URI.parse('foo://test/path/file');
		const frag1 = URI.parse('foo://test/path/file#1');
		const frag2 = URI.parse('foo://test/path/file#2');

		model.setResourceMarkers([[frag1, [
			{ ...aMarker(), resource: frag1 },
			{ ...aMarker(undefined, MarkerSeverity.Warning), resource: frag1 },
		]]]);

		model.setResourceMarkers([[frag2, [
			{ ...aMarker(), resource: frag2 }
		]]]);

		assert.strictEqual(model.total, 3);
		const markers = model.getResourceMarkers(document)?.markers;
		assert.deepStrictEqual(markers?.map(m => m.marker.severity), [MarkerSeverity.Error, MarkerSeverity.Error, MarkerSeverity.Warning]);
		assert.deepStrictEqual(markers?.map(m => m.marker.resource.toString()), [frag1.toString(), frag2.toString(), frag1.toString()]);
	});

	function compareResource(a: ResourceMarkers, b: string): boolean {
		return a.resource.toString() === URI.file(b).toString();
	}

	function anErrorWithRange(startLineNumber: number = 10,
		startColumn: number = 5,
		endLineNumber: number = startLineNumber + 1,
		endColumn: number = startColumn + 5,
		message: string = 'some message',
	): IMarker {
		return aMarker('some resource', MarkerSeverity.Error, startLineNumber, startColumn, endLineNumber, endColumn, message);
	}

	function aWarningWithRange(startLineNumber: number = 10,
		startColumn: number = 5,
		endLineNumber: number = startLineNumber + 1,
		endColumn: number = startColumn + 5,
		message: string = 'some message',
	): IMarker {
		return aMarker('some resource', MarkerSeverity.Warning, startLineNumber, startColumn, endLineNumber, endColumn, message);
	}

	function anInfoWithRange(startLineNumber: number = 10,
		startColumn: number = 5,
		endLineNumber: number = startLineNumber + 1,
		endColumn: number = startColumn + 5,
		message: string = 'some message',
	): IMarker {
		return aMarker('some resource', MarkerSeverity.Info, startLineNumber, startColumn, endLineNumber, endColumn, message);
	}

	function anIgnoreWithRange(startLineNumber: number = 10,
		startColumn: number = 5,
		endLineNumber: number = startLineNumber + 1,
		endColumn: number = startColumn + 5,
		message: string = 'some message',
	): IMarker {
		return aMarker('some resource', MarkerSeverity.Hint, startLineNumber, startColumn, endLineNumber, endColumn, message);
	}

	function aMarker(resource: string = 'some resource',
		severity: MarkerSeverity = MarkerSeverity.Error,
		startLineNumber: number = 10,
		startColumn: number = 5,
		endLineNumber: number = startLineNumber + 1,
		endColumn: number = startColumn + 5,
		message: string = 'some message',
		source: string = 'tslint',
		relatedInformation?: IRelatedInformation[]
	): IMarker {
		return {
			owner: 'someOwner',
			resource: URI.file(resource),
			severity,
			message,
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			source,
			relatedInformation
		};
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcp.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcp.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import * as jsonContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { mcpAccessConfig, McpAccessValue } from '../../../../platform/mcp/common/mcpManagement.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IConfigurationMigrationRegistry, Extensions as ConfigurationMigrationExtensions, ConfigurationKeyValuePairs } from '../../../common/configuration.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { EditorExtensions } from '../../../common/editor.js';
import { mcpSchemaId } from '../../../services/configuration/common/configuration.js';
import { ExtensionMcpDiscovery } from '../common/discovery/extensionMcpDiscovery.js';
import { InstalledMcpServersDiscovery } from '../common/discovery/installedMcpServersDiscovery.js';
import { mcpDiscoveryRegistry } from '../common/discovery/mcpDiscovery.js';
import { RemoteNativeMpcDiscovery } from '../common/discovery/nativeMcpRemoteDiscovery.js';
import { CursorWorkspaceMcpDiscoveryAdapter } from '../common/discovery/workspaceMcpDiscoveryAdapter.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { mcpServerSchema } from '../common/mcpConfiguration.js';
import { McpContextKeysController } from '../common/mcpContextKeys.js';
import { IMcpDevModeDebugging, McpDevModeDebugging } from '../common/mcpDevMode.js';
import { McpLanguageModelToolContribution } from '../common/mcpLanguageModelToolContribution.js';
import { McpRegistry } from '../common/mcpRegistry.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';
import { McpResourceFilesystem } from '../common/mcpResourceFilesystem.js';
import { McpSamplingService } from '../common/mcpSamplingService.js';
import { McpService } from '../common/mcpService.js';
import { IMcpElicitationService, IMcpSamplingService, IMcpService, IMcpWorkbenchService } from '../common/mcpTypes.js';
import { McpAddContextContribution } from './mcpAddContextContribution.js';
import { AddConfigurationAction, EditStoredInput, ListMcpServerCommand, McpBrowseCommand, McpBrowseResourcesCommand, McpConfigureSamplingModels, McpConfirmationServerOptionsCommand, MCPServerActionRendering, McpServerOptionsCommand, McpSkipCurrentAutostartCommand, McpStartPromptingServerCommand, OpenRemoteUserMcpResourceCommand, OpenUserMcpResourceCommand, OpenWorkspaceFolderMcpResourceCommand, OpenWorkspaceMcpResourceCommand, RemoveStoredInput, ResetMcpCachedTools, ResetMcpTrustCommand, RestartServer, ShowConfiguration, ShowInstalledMcpServersCommand, ShowOutput, StartServer, StopServer } from './mcpCommands.js';
import { McpDiscovery } from './mcpDiscovery.js';
import { McpElicitationService } from './mcpElicitationService.js';
import { McpLanguageFeatures } from './mcpLanguageFeatures.js';
import { McpConfigMigrationContribution } from './mcpMigration.js';
import { McpResourceQuickAccess } from './mcpResourceQuickAccess.js';
import { McpServerEditor } from './mcpServerEditor.js';
import { McpServerEditorInput } from './mcpServerEditorInput.js';
import { McpServersViewsContribution } from './mcpServersView.js';
import { MCPContextsInitialisation, McpWorkbenchService } from './mcpWorkbenchService.js';

registerSingleton(IMcpRegistry, McpRegistry, InstantiationType.Delayed);
registerSingleton(IMcpService, McpService, InstantiationType.Delayed);
registerSingleton(IMcpWorkbenchService, McpWorkbenchService, InstantiationType.Eager);
registerSingleton(IMcpDevModeDebugging, McpDevModeDebugging, InstantiationType.Delayed);
registerSingleton(IMcpSamplingService, McpSamplingService, InstantiationType.Delayed);
registerSingleton(IMcpElicitationService, McpElicitationService, InstantiationType.Delayed);

mcpDiscoveryRegistry.register(new SyncDescriptor(RemoteNativeMpcDiscovery));
mcpDiscoveryRegistry.register(new SyncDescriptor(InstalledMcpServersDiscovery));
mcpDiscoveryRegistry.register(new SyncDescriptor(ExtensionMcpDiscovery));
mcpDiscoveryRegistry.register(new SyncDescriptor(CursorWorkspaceMcpDiscoveryAdapter));

registerWorkbenchContribution2('mcpDiscovery', McpDiscovery, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2('mcpContextKeys', McpContextKeysController, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2('mcpLanguageFeatures', McpLanguageFeatures, WorkbenchPhase.Eventually);
registerWorkbenchContribution2('mcpResourceFilesystem', McpResourceFilesystem, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(McpLanguageModelToolContribution.ID, McpLanguageModelToolContribution, WorkbenchPhase.AfterRestored);

registerAction2(ListMcpServerCommand);
registerAction2(McpServerOptionsCommand);
registerAction2(McpConfirmationServerOptionsCommand);
registerAction2(ResetMcpTrustCommand);
registerAction2(ResetMcpCachedTools);
registerAction2(AddConfigurationAction);
registerAction2(RemoveStoredInput);
registerAction2(EditStoredInput);
registerAction2(StartServer);
registerAction2(StopServer);
registerAction2(ShowOutput);
registerAction2(RestartServer);
registerAction2(ShowConfiguration);
registerAction2(McpBrowseCommand);
registerAction2(OpenUserMcpResourceCommand);
registerAction2(OpenRemoteUserMcpResourceCommand);
registerAction2(OpenWorkspaceMcpResourceCommand);
registerAction2(OpenWorkspaceFolderMcpResourceCommand);
registerAction2(ShowInstalledMcpServersCommand);
registerAction2(McpBrowseResourcesCommand);
registerAction2(McpConfigureSamplingModels);
registerAction2(McpStartPromptingServerCommand);
registerAction2(McpSkipCurrentAutostartCommand);

registerWorkbenchContribution2('mcpActionRendering', MCPServerActionRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2('mcpAddContext', McpAddContextContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(MCPContextsInitialisation.ID, MCPContextsInitialisation, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(McpConfigMigrationContribution.ID, McpConfigMigrationContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(McpServersViewsContribution.ID, McpServersViewsContribution, WorkbenchPhase.AfterRestored);

const jsonRegistry = <jsonContributionRegistry.IJSONContributionRegistry>Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
jsonRegistry.registerSchema(mcpSchemaId, mcpServerSchema);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		McpServerEditor,
		McpServerEditor.ID,
		localize('mcpServer', "MCP Server")
	),
	[
		new SyncDescriptor(McpServerEditorInput)
	]);

Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
	ctor: McpResourceQuickAccess,
	prefix: McpResourceQuickAccess.PREFIX,
	placeholder: localize('mcp.quickaccess.placeholder', "Filter to an MCP resource"),
	helpEntries: [{
		description: localize('mcp.quickaccess.add', "MCP Server Resources"),
		commandId: McpCommandIds.AddConfiguration
	}]
});


Registry.as<IConfigurationMigrationRegistry>(ConfigurationMigrationExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'chat.mcp.enabled',
		migrateFn: (value, accessor) => {
			const result: ConfigurationKeyValuePairs = [['chat.mcp.enabled', { value: undefined }]];
			if (value === true) {
				result.push([mcpAccessConfig, { value: McpAccessValue.All }]);
			}
			if (value === false) {
				result.push([mcpAccessConfig, { value: McpAccessValue.None }]);
			}
			return result;
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpAddContextContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpAddContextContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived } from '../../../../base/common/observable.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ChatContextPick, IChatContextPickService } from '../../chat/browser/chatContextPickService.js';
import { IMcpService, McpCapability } from '../common/mcpTypes.js';
import { McpResourcePickHelper } from './mcpResourceQuickAccess.js';

export class McpAddContextContribution extends Disposable implements IWorkbenchContribution {
	private readonly _addContextMenu = this._register(new MutableDisposable());
	constructor(
		@IChatContextPickService private readonly _chatContextPickService: IChatContextPickService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IMcpService mcpService: IMcpService
	) {
		super();

		const hasServersWithResources = derived(reader => {
			let enabled = false;
			for (const server of mcpService.servers.read(reader)) {
				const cap = server.capabilities.read(undefined);
				if (cap === undefined) {
					enabled = true; // until we know more
				} else if (cap & McpCapability.Resources) {
					enabled = true;
					break;
				}
			}

			return enabled;
		});

		this._register(autorun(reader => {
			const enabled = hasServersWithResources.read(reader);
			if (enabled && !this._addContextMenu.value) {
				this._registerAddContextMenu();
			} else {
				this._addContextMenu.clear();
			}
		}));
	}

	private _registerAddContextMenu() {
		this._addContextMenu.value = this._chatContextPickService.registerChatContextItem({
			type: 'pickerPick',
			label: localize('mcp.addContext', "MCP Resources..."),
			icon: Codicon.mcp,
			isEnabled(widget) {
				return !!widget.attachmentCapabilities.supportsMCPAttachments;
			},
			asPicker: () => {
				const helper = this._instantiationService.createInstance(McpResourcePickHelper);
				return {
					placeholder: localize('mcp.addContext.placeholder', "Select MCP Resource..."),
					picks: (_query, token) => this._getResourcePicks(token, helper),
					goBack: () => {
						return helper.navigateBack();
					},
					dispose: () => {
						helper.dispose();
					}
				};
			},
		});
	}

	private _getResourcePicks(token: CancellationToken, helper: McpResourcePickHelper) {
		const picksObservable = helper.getPicks(token);

		return derived(this, reader => {

			const pickItems = picksObservable.read(reader);
			const picks: ChatContextPick[] = [];

			for (const [server, resources] of pickItems.picks) {
				if (resources.length === 0) {
					continue;
				}
				picks.push(McpResourcePickHelper.sep(server));
				for (const resource of resources) {
					picks.push({
						...McpResourcePickHelper.item(resource),
						asAttachment: () => helper.toAttachment(resource, server)
					});
				}
			}
			return { picks, busy: pickItems.isBusy };
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, disposableWindowInterval, EventType } from '../../../../base/browser/dom.js';
import { renderMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { IManagedHoverTooltipHTMLElement } from '../../../../base/browser/ui/hover/hover.js';
import { Checkbox } from '../../../../base/browser/ui/toggle/toggle.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { assertNever } from '../../../../base/common/assert.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { groupBy } from '../../../../base/common/collections.js';
import { Event } from '../../../../base/common/event.js';
import { createMarkdownCommandLink, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, derivedObservableWithCache, observableValue } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { Range } from '../../../../editor/common/core/range.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { ILocalizedString, localize, localize2 } from '../../../../nls.js';
import { IActionViewItemService } from '../../../../platform/actions/browser/actionViewItemService.js';
import { MenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { mcpAutoStartConfig, McpAutoStartValue } from '../../../../platform/mcp/common/mcpManagement.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { defaultCheckboxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { spinningLoading } from '../../../../platform/theme/common/iconRegistry.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { PICK_WORKSPACE_FOLDER_COMMAND_ID } from '../../../browser/actions/workspaceCommands.js';
import { ActiveEditorContext, RemoteNameContext, ResourceContextKey, WorkbenchStateContext, WorkspaceFolderCountContext } from '../../../common/contextkeys.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IAccountQuery, IAuthenticationQueryService } from '../../../services/authentication/common/authenticationQuery.js';
import { MCP_CONFIGURATION_KEY, WORKSPACE_STANDALONE_CONFIGURATIONS } from '../../../services/configuration/common/configuration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IRemoteUserDataProfilesService } from '../../../services/userDataProfile/common/remoteUserDataProfiles.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { CHAT_CONFIG_MENU_ID } from '../../chat/browser/actions/chatActions.js';
import { ChatViewId, IChatWidgetService } from '../../chat/browser/chat.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { IChatElicitationRequest, IChatToolInvocation } from '../../chat/common/chatService.js';
import { ChatModeKind } from '../../chat/common/constants.js';
import { ILanguageModelsService } from '../../chat/common/languageModels.js';
import { ILanguageModelToolsService } from '../../chat/common/languageModelToolsService.js';
import { VIEW_CONTAINER } from '../../extensions/browser/extensions.contribution.js';
import { extensionsFilterSubMenu, IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { TEXT_FILE_EDITOR_ID } from '../../files/common/files.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { McpContextKeys } from '../common/mcpContextKeys.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';
import { HasInstalledMcpServersContext, IMcpSamplingService, IMcpServer, IMcpServerStartOpts, IMcpService, InstalledMcpServersViewId, LazyCollectionState, McpCapability, McpCollectionDefinition, McpConnectionState, McpDefinitionReference, mcpPromptPrefix, McpServerCacheState, McpStartServerInteraction } from '../common/mcpTypes.js';
import { McpAddConfigurationCommand } from './mcpCommandsAddConfiguration.js';
import { McpResourceQuickAccess, McpResourceQuickPick } from './mcpResourceQuickAccess.js';
import './media/mcpServerAction.css';
import { openPanelChatAndGetWidget } from './openPanelChatAndGetWidget.js';

// acroynms do not get localized
const category: ILocalizedString = {
	original: 'MCP',
	value: 'MCP',
};

export class ListMcpServerCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ListServer,
			title: localize2('mcp.list', 'List Servers'),
			icon: Codicon.server,
			category,
			f1: true,
			precondition: ChatContextKeys.Setup.hidden.negate(),
			menu: [{
				when: ContextKeyExpr.and(
					ContextKeyExpr.or(
						ContextKeyExpr.and(ContextKeyExpr.equals(`config.${mcpAutoStartConfig}`, McpAutoStartValue.Never), McpContextKeys.hasUnknownTools),
						McpContextKeys.hasServersWithErrors,
					),
					ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Agent),
					ChatContextKeys.lockedToCodingAgent.negate(),
					ChatContextKeys.Setup.hidden.negate(),
				),
				id: MenuId.ChatInput,
				group: 'navigation',
				order: 101,
			}],
		});
	}

	override async run(accessor: ServicesAccessor) {
		const mcpService = accessor.get(IMcpService);
		const commandService = accessor.get(ICommandService);
		const quickInput = accessor.get(IQuickInputService);

		type ItemType = { id: string } & IQuickPickItem;

		const store = new DisposableStore();
		const pick = quickInput.createQuickPick<ItemType>({ useSeparators: true });
		pick.placeholder = localize('mcp.selectServer', 'Select an MCP Server');

		mcpService.activateCollections();

		store.add(pick);

		store.add(autorun(reader => {
			const servers = groupBy(mcpService.servers.read(reader).slice().sort((a, b) => (a.collection.presentation?.order || 0) - (b.collection.presentation?.order || 0)), s => s.collection.id);
			const firstRun = pick.items.length === 0;
			pick.items = [
				{ id: '$add', label: localize('mcp.addServer', 'Add Server'), description: localize('mcp.addServer.description', 'Add a new server configuration'), alwaysShow: true, iconClass: ThemeIcon.asClassName(Codicon.add) },
				...Object.values(servers).filter(s => s!.length).flatMap((servers): (ItemType | IQuickPickSeparator)[] => [
					{ type: 'separator', label: servers![0].collection.label, id: servers![0].collection.id },
					...servers!.map(server => ({
						id: server.definition.id,
						label: server.definition.label,
						description: McpConnectionState.toString(server.connectionState.read(reader)),
					})),
				]),
			];

			if (firstRun && pick.items.length > 3) {
				pick.activeItems = pick.items.slice(2, 3) as ItemType[]; // select the first server by default
			}
		}));


		const picked = await new Promise<ItemType | undefined>(resolve => {
			store.add(pick.onDidAccept(() => {
				resolve(pick.activeItems[0]);
			}));
			store.add(pick.onDidHide(() => {
				resolve(undefined);
			}));
			pick.show();
		});

		store.dispose();

		if (!picked) {
			// no-op
		} else if (picked.id === '$add') {
			commandService.executeCommand(McpCommandIds.AddConfiguration);
		} else {
			commandService.executeCommand(McpCommandIds.ServerOptions, picked.id);
		}
	}
}

interface ActionItem extends IQuickPickItem {
	action: 'start' | 'stop' | 'restart' | 'showOutput' | 'config' | 'configSampling' | 'samplingLog' | 'resources';
}

interface AuthActionItem extends IQuickPickItem {
	action: 'disconnect' | 'signout';
	accountQuery: IAccountQuery;
}

export class McpConfirmationServerOptionsCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ServerOptionsInConfirmation,
			title: localize2('mcp.options', 'Server Options'),
			category,
			icon: Codicon.settingsGear,
			f1: false,
			menu: [{
				id: MenuId.ChatConfirmationMenu,
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('chatConfirmationPartSource', 'mcp'),
					ContextKeyExpr.or(
						ContextKeyExpr.equals('chatConfirmationPartType', 'chatToolConfirmation'),
						ContextKeyExpr.equals('chatConfirmationPartType', 'elicitation'),
					),
				),
				group: 'navigation'
			}],
		});
	}

	override async run(accessor: ServicesAccessor, arg: IChatToolInvocation | IChatElicitationRequest): Promise<void> {
		const toolsService = accessor.get(ILanguageModelToolsService);
		if (arg.kind === 'toolInvocation') {
			const tool = toolsService.getTool(arg.toolId);
			if (tool?.source.type === 'mcp') {
				accessor.get(ICommandService).executeCommand(McpCommandIds.ServerOptions, tool.source.definitionId);
			}
		} else if (arg.kind === 'elicitation2') {
			if (arg.source?.type === 'mcp') {
				accessor.get(ICommandService).executeCommand(McpCommandIds.ServerOptions, arg.source.definitionId);
			}
		} else {
			assertNever(arg);
		}
	}
}

export class McpServerOptionsCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ServerOptions,
			title: localize2('mcp.options', 'Server Options'),
			category,
			f1: false,
		});
	}

	override async run(accessor: ServicesAccessor, id: string): Promise<void> {
		const mcpService = accessor.get(IMcpService);
		const quickInputService = accessor.get(IQuickInputService);
		const mcpRegistry = accessor.get(IMcpRegistry);
		const editorService = accessor.get(IEditorService);
		const commandService = accessor.get(ICommandService);
		const samplingService = accessor.get(IMcpSamplingService);
		const authenticationQueryService = accessor.get(IAuthenticationQueryService);
		const authenticationService = accessor.get(IAuthenticationService);
		const server = mcpService.servers.get().find(s => s.definition.id === id);
		if (!server) {
			return;
		}

		const collection = mcpRegistry.collections.get().find(c => c.id === server.collection.id);
		const serverDefinition = collection?.serverDefinitions.get().find(s => s.id === server.definition.id);

		const items: (ActionItem | AuthActionItem | IQuickPickSeparator)[] = [];
		const serverState = server.connectionState.get();

		items.push({ type: 'separator', label: localize('mcp.actions.status', 'Status') });

		// Only show start when server is stopped or in error state
		if (McpConnectionState.canBeStarted(serverState.state)) {
			items.push({
				label: localize('mcp.start', 'Start Server'),
				action: 'start'
			});
		} else {
			items.push({
				label: localize('mcp.stop', 'Stop Server'),
				action: 'stop'
			});
			items.push({
				label: localize('mcp.restart', 'Restart Server'),
				action: 'restart'
			});
		}

		items.push(...this._getAuthActions(authenticationQueryService, server.definition.id));

		const configTarget = serverDefinition?.presentation?.origin || collection?.presentation?.origin;
		if (configTarget) {
			items.push({
				label: localize('mcp.config', 'Show Configuration'),
				action: 'config',
			});
		}

		items.push({
			label: localize('mcp.showOutput', 'Show Output'),
			action: 'showOutput'
		});

		items.push(
			{ type: 'separator', label: localize('mcp.actions.sampling', 'Sampling') },
			{
				label: localize('mcp.configAccess', 'Configure Model Access'),
				description: localize('mcp.showOutput.description', 'Set the models the server can use via MCP sampling'),
				action: 'configSampling'
			},
		);


		if (samplingService.hasLogs(server)) {
			items.push({
				label: localize('mcp.samplingLog', 'Show Sampling Requests'),
				description: localize('mcp.samplingLog.description', 'Show the sampling requests for this server'),
				action: 'samplingLog',
			});
		}

		const capabilities = server.capabilities.get();
		if (capabilities === undefined || (capabilities & McpCapability.Resources)) {
			items.push({ type: 'separator', label: localize('mcp.actions.resources', 'Resources') });
			items.push({
				label: localize('mcp.resources', 'Browse Resources'),
				action: 'resources',
			});
		}

		const pick = await quickInputService.pick(items, {
			placeHolder: localize('mcp.selectAction', 'Select action for \'{0}\'', server.definition.label),
		});

		if (!pick) {
			return;
		}

		switch (pick.action) {
			case 'start':
				await server.start({ promptType: 'all-untrusted' });
				server.showOutput();
				break;
			case 'stop':
				await server.stop();
				break;
			case 'restart':
				await server.stop();
				await server.start({ promptType: 'all-untrusted' });
				break;
			case 'disconnect':
				await server.stop();
				await this._handleAuth(authenticationService, pick.accountQuery, server.definition, false);
				break;
			case 'signout':
				await server.stop();
				await this._handleAuth(authenticationService, pick.accountQuery, server.definition, true);
				break;
			case 'showOutput':
				server.showOutput();
				break;
			case 'config':
				editorService.openEditor({
					resource: URI.isUri(configTarget) ? configTarget : configTarget!.uri,
					options: { selection: URI.isUri(configTarget) ? undefined : configTarget!.range }
				});
				break;
			case 'configSampling':
				return commandService.executeCommand(McpCommandIds.ConfigureSamplingModels, server);
			case 'resources':
				return commandService.executeCommand(McpCommandIds.BrowseResources, server);
			case 'samplingLog':
				editorService.openEditor({
					resource: undefined,
					contents: samplingService.getLogText(server),
					label: localize('mcp.samplingLog.title', 'MCP Sampling: {0}', server.definition.label),
				});
				break;
			default:
				assertNever(pick);
		}
	}

	private _getAuthActions(
		authenticationQueryService: IAuthenticationQueryService,
		serverId: string
	): AuthActionItem[] {
		const result: AuthActionItem[] = [];
		// Really, this should only ever have one entry.
		for (const [providerId, accountName] of authenticationQueryService.mcpServer(serverId).getAllAccountPreferences()) {

			const accountQuery = authenticationQueryService.provider(providerId).account(accountName);
			if (!accountQuery.mcpServer(serverId).isAccessAllowed()) {
				continue; // skip accounts that are not allowed
			}
			// If there are multiple allowed servers/extensions, other things are using this provider
			// so we show a disconnect action, otherwise we show a sign out action.
			if (accountQuery.entities().getEntityCount().total > 1) {
				result.push({
					action: 'disconnect',
					label: localize('mcp.disconnect', 'Disconnect Account'),
					description: `(${accountName})`,
					accountQuery
				});
			} else {
				result.push({
					action: 'signout',
					label: localize('mcp.signOut', 'Sign Out'),
					description: `(${accountName})`,
					accountQuery
				});
			}
		}
		return result;
	}

	private async _handleAuth(
		authenticationService: IAuthenticationService,
		accountQuery: IAccountQuery,
		definition: McpDefinitionReference,
		signOut: boolean
	) {
		const { providerId, accountName } = accountQuery;
		accountQuery.mcpServer(definition.id).setAccessAllowed(false, definition.label);
		if (signOut) {
			const accounts = await authenticationService.getAccounts(providerId);
			const account = accounts.find(a => a.label === accountName);
			if (account) {
				const sessions = await authenticationService.getSessions(providerId, undefined, { account });
				for (const session of sessions) {
					await authenticationService.removeSession(providerId, session.id);
				}
			}
		}
	}
}

export class MCPServerActionRendering extends Disposable implements IWorkbenchContribution {
	constructor(
		@IActionViewItemService actionViewItemService: IActionViewItemService,
		@IMcpService mcpService: IMcpService,
		@IInstantiationService instaService: IInstantiationService,
		@ICommandService commandService: ICommandService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();

		const hoverIsOpen = observableValue(this, false);
		const config = observableConfigValue(mcpAutoStartConfig, McpAutoStartValue.NewAndOutdated, configurationService);

		const enum DisplayedState {
			None,
			NewTools,
			Error,
			Refreshing,
		}

		type DisplayedStateT = {
			state: DisplayedState;
			servers: (IMcpServer | McpCollectionDefinition)[];
		};

		function isServer(s: IMcpServer | McpCollectionDefinition): s is IMcpServer {
			return typeof (s as IMcpServer).start === 'function';
		}

		const displayedStateCurrent = derived((reader): DisplayedStateT => {
			const servers = mcpService.servers.read(reader);
			const serversPerState: (IMcpServer | McpCollectionDefinition)[][] = [];
			for (const server of servers) {
				let thisState = DisplayedState.None;
				switch (server.cacheState.read(reader)) {
					case McpServerCacheState.Unknown:
					case McpServerCacheState.Outdated:
						thisState = server.connectionState.read(reader).state === McpConnectionState.Kind.Error ? DisplayedState.Error : DisplayedState.NewTools;
						break;
					case McpServerCacheState.RefreshingFromUnknown:
						thisState = DisplayedState.Refreshing;
						break;
					default:
						thisState = server.connectionState.read(reader).state === McpConnectionState.Kind.Error ? DisplayedState.Error : DisplayedState.None;
						break;
				}

				serversPerState[thisState] ??= [];
				serversPerState[thisState].push(server);
			}

			const unknownServerStates = mcpService.lazyCollectionState.read(reader);
			if (unknownServerStates.state === LazyCollectionState.LoadingUnknown) {
				serversPerState[DisplayedState.Refreshing] ??= [];
				serversPerState[DisplayedState.Refreshing].push(...unknownServerStates.collections);
			} else if (unknownServerStates.state === LazyCollectionState.HasUnknown) {
				serversPerState[DisplayedState.NewTools] ??= [];
				serversPerState[DisplayedState.NewTools].push(...unknownServerStates.collections);
			}

			let maxState = (serversPerState.length - 1) as DisplayedState;
			if (maxState === DisplayedState.NewTools && config.read(reader) !== McpAutoStartValue.Never) {
				maxState = DisplayedState.None;
			}

			return { state: maxState, servers: serversPerState[maxState] || [] };
		});

		// avoid hiding the hover if a state changes while it's open:
		const displayedState = derivedObservableWithCache<DisplayedStateT>(this, (reader, last) => {
			if (last && hoverIsOpen.read(reader)) {
				return last;
			} else {
				return displayedStateCurrent.read(reader);
			}
		});

		const actionItemState = displayedState.map(s => s.state);

		this._store.add(actionViewItemService.register(MenuId.ChatInput, McpCommandIds.ListServer, (action, options) => {
			if (!(action instanceof MenuItemAction)) {
				return undefined;
			}

			return instaService.createInstance(class extends MenuEntryActionViewItem {

				override render(container: HTMLElement): void {

					super.render(container);
					container.classList.add('chat-mcp');
					container.style.position = 'relative';

					const stateIndicator = container.appendChild($('.chat-mcp-state-indicator'));
					stateIndicator.style.display = 'none';

					this._register(autorun(r => {
						const displayed = displayedState.read(r);
						const { state } = displayed;
						this.updateTooltip();


						stateIndicator.ariaLabel = this.getLabelForState(displayed);
						stateIndicator.className = 'chat-mcp-state-indicator';
						if (state === DisplayedState.NewTools) {
							stateIndicator.style.display = 'block';
							stateIndicator.classList.add('chat-mcp-state-new', ...ThemeIcon.asClassNameArray(Codicon.refresh));
						} else if (state === DisplayedState.Error) {
							stateIndicator.style.display = 'block';
							stateIndicator.classList.add('chat-mcp-state-error', ...ThemeIcon.asClassNameArray(Codicon.warning));
						} else if (state === DisplayedState.Refreshing) {
							stateIndicator.style.display = 'block';
							stateIndicator.classList.add('chat-mcp-state-refreshing', ...ThemeIcon.asClassNameArray(spinningLoading));
						} else {
							stateIndicator.style.display = 'none';
						}
					}));
				}

				override async onClick(e: MouseEvent): Promise<void> {
					e.preventDefault();
					e.stopPropagation();

					const { state, servers } = displayedStateCurrent.get();
					if (state === DisplayedState.NewTools) {
						const interaction = new McpStartServerInteraction();
						servers.filter(isServer).forEach(server => server.stop().then(() => server.start({ interaction })));
						mcpService.activateCollections();
					} else if (state === DisplayedState.Refreshing) {
						findLast(servers, isServer)?.showOutput();
					} else if (state === DisplayedState.Error) {
						const server = findLast(servers, isServer);
						if (server) {
							await server.showOutput(true);
							commandService.executeCommand(McpCommandIds.ServerOptions, server.definition.id);
						}
					} else {
						commandService.executeCommand(McpCommandIds.ListServer);
					}
				}

				protected override getTooltip(): string {
					return this.getLabelForState() || super.getTooltip();
				}

				protected override getHoverContents({ state, servers } = displayedStateCurrent.get()): string | undefined | IManagedHoverTooltipHTMLElement {
					const link = (s: IMcpServer) => createMarkdownCommandLink({
						title: s.definition.label,
						id: McpCommandIds.ServerOptions,
						arguments: [s.definition.id],
					});

					const single = servers.length === 1;
					const names = servers.map(s => isServer(s) ? link(s) : '`' + s.label + '`').map(l => single ? l : `- ${l}`).join('\n');
					let markdown: MarkdownString;
					if (state === DisplayedState.NewTools) {
						markdown = new MarkdownString(single
							? localize('mcp.newTools.md.single', "MCP server {0} has been updated and may have new tools available.", names)
							: localize('mcp.newTools.md.multi', "MCP servers have been updated and may have new tools available:\n\n{0}", names)
						);
					} else if (state === DisplayedState.Error) {
						markdown = new MarkdownString(single
							? localize('mcp.err.md.single', "MCP server {0} was unable to start successfully.", names)
							: localize('mcp.err.md.multi', "Multiple MCP servers were unable to start successfully:\n\n{0}", names)
						);
					} else {
						return this.getLabelForState() || undefined;
					}

					return {
						element: (token): HTMLElement => {
							hoverIsOpen.set(true, undefined);

							const store = new DisposableStore();
							store.add(toDisposable(() => hoverIsOpen.set(false, undefined)));
							store.add(token.onCancellationRequested(() => {
								store.dispose();
							}));

							// todo@connor4312/@benibenj: workaround for #257923
							store.add(disposableWindowInterval(mainWindow, () => {
								if (!container.isConnected) {
									store.dispose();
								}
							}, 2000));

							const container = $('div.mcp-hover-contents');

							// Render markdown content
							markdown.isTrusted = true;
							const markdownResult = store.add(renderMarkdown(markdown));
							container.appendChild(markdownResult.element);

							// Add divider
							const divider = $('hr.mcp-hover-divider');
							container.appendChild(divider);

							// Add checkbox for mcpAutoStartConfig setting
							const checkboxContainer = $('div.mcp-hover-setting');
							const settingLabelStr = localize('mcp.autoStart', "Automatically start MCP servers when sending a chat message");

							const checkbox = store.add(new Checkbox(
								settingLabelStr,
								config.get() !== McpAutoStartValue.Never,
								{ ...defaultCheckboxStyles }
							));

							checkboxContainer.appendChild(checkbox.domNode);

							// Add label next to checkbox
							const settingLabel = $('span.mcp-hover-setting-label', undefined, settingLabelStr);
							checkboxContainer.appendChild(settingLabel);

							const onChange = () => {
								const newValue = checkbox.checked ? McpAutoStartValue.NewAndOutdated : McpAutoStartValue.Never;
								configurationService.updateValue(mcpAutoStartConfig, newValue);
							};

							store.add(checkbox.onChange(onChange));

							store.add(addDisposableListener(settingLabel, EventType.CLICK, () => {
								checkbox.checked = !checkbox.checked;
								onChange();
							}));
							container.appendChild(checkboxContainer);

							return container;
						},
					};
				}

				private getLabelForState({ state, servers } = displayedStateCurrent.get()) {
					if (state === DisplayedState.NewTools) {
						return localize('mcp.newTools', "New tools available ({0})", servers.length || 1);
					} else if (state === DisplayedState.Error) {
						return localize('mcp.toolError', "Error loading {0} tool(s)", servers.length || 1);
					} else if (state === DisplayedState.Refreshing) {
						return localize('mcp.toolRefresh', "Discovering tools...");
					} else {
						return null;
					}
				}
			}, action, { ...options, keybindingNotRenderedWithLabel: true });

		}, Event.fromObservableLight(actionItemState)));
	}
}

export class ResetMcpTrustCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ResetTrust,
			title: localize2('mcp.resetTrust', "Reset Trust"),
			category,
			f1: true,
			precondition: ContextKeyExpr.and(McpContextKeys.toolsCount.greater(0), ChatContextKeys.Setup.hidden.negate()),
		});
	}

	run(accessor: ServicesAccessor): void {
		const mcpService = accessor.get(IMcpService);
		mcpService.resetTrust();
	}
}


export class ResetMcpCachedTools extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ResetCachedTools,
			title: localize2('mcp.resetCachedTools', "Reset Cached Tools"),
			category,
			f1: true,
			precondition: ContextKeyExpr.and(McpContextKeys.toolsCount.greater(0), ChatContextKeys.Setup.hidden.negate()),
		});
	}

	run(accessor: ServicesAccessor): void {
		const mcpService = accessor.get(IMcpService);
		mcpService.resetCaches();
	}
}

export class AddConfigurationAction extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.AddConfiguration,
			title: localize2('mcp.addConfiguration', "Add Server..."),
			metadata: {
				description: localize2('mcp.addConfiguration.description', "Installs a new Model Context protocol to the mcp.json settings"),
			},
			category,
			f1: true,
			precondition: ChatContextKeys.Setup.hidden.negate(),
			menu: {
				id: MenuId.EditorContent,
				when: ContextKeyExpr.and(
					ContextKeyExpr.regex(ResourceContextKey.Path.key, /\.vscode[/\\]mcp\.json$/),
					ActiveEditorContext.isEqualTo(TEXT_FILE_EDITOR_ID),
					ChatContextKeys.Setup.hidden.negate(),
				)
			}
		});
	}

	async run(accessor: ServicesAccessor, configUri?: string): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const workspaceService = accessor.get(IWorkspaceContextService);
		const target = configUri ? workspaceService.getWorkspaceFolder(URI.parse(configUri)) : undefined;
		return instantiationService.createInstance(McpAddConfigurationCommand, target ?? undefined).run();
	}
}


export class RemoveStoredInput extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.RemoveStoredInput,
			title: localize2('mcp.resetCachedTools', "Reset Cached Tools"),
			category,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, scope: StorageScope, id?: string): void {
		accessor.get(IMcpRegistry).clearSavedInputs(scope, id);
	}
}

export class EditStoredInput extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.EditStoredInput,
			title: localize2('mcp.editStoredInput', "Edit Stored Input"),
			category,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, inputId: string, uri: URI | undefined, configSection: string, target: ConfigurationTarget): void {
		const workspaceFolder = uri && accessor.get(IWorkspaceContextService).getWorkspaceFolder(uri);
		accessor.get(IMcpRegistry).editSavedInput(inputId, workspaceFolder || undefined, configSection, target);
	}
}

export class ShowConfiguration extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ShowConfiguration,
			title: localize2('mcp.command.showConfiguration', "Show Configuration"),
			category,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, collectionId: string, serverId: string): void {
		const collection = accessor.get(IMcpRegistry).collections.get().find(c => c.id === collectionId);
		if (!collection) {
			return;
		}

		const server = collection?.serverDefinitions.get().find(s => s.id === serverId);
		const editorService = accessor.get(IEditorService);
		if (server?.presentation?.origin) {
			editorService.openEditor({
				resource: server.presentation.origin.uri,
				options: { selection: server.presentation.origin.range }
			});
		} else if (collection.presentation?.origin) {
			editorService.openEditor({
				resource: collection.presentation.origin,
			});
		}
	}
}

export class ShowOutput extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ShowOutput,
			title: localize2('mcp.command.showOutput', "Show Output"),
			category,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, serverId: string): void {
		accessor.get(IMcpService).servers.get().find(s => s.definition.id === serverId)?.showOutput();
	}
}

export class RestartServer extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.RestartServer,
			title: localize2('mcp.command.restartServer', "Restart Server"),
			category,
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, serverId: string, opts?: IMcpServerStartOpts) {
		const s = accessor.get(IMcpService).servers.get().find(s => s.definition.id === serverId);
		s?.showOutput();
		await s?.stop();
		await s?.start({ promptType: 'all-untrusted', ...opts });
	}
}

export class StartServer extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.StartServer,
			title: localize2('mcp.command.startServer', "Start Server"),
			category,
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, serverId: string, opts?: IMcpServerStartOpts) {
		const s = accessor.get(IMcpService).servers.get().find(s => s.definition.id === serverId);
		await s?.start({ promptType: 'all-untrusted', ...opts });
	}
}

export class StopServer extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.StopServer,
			title: localize2('mcp.command.stopServer', "Stop Server"),
			category,
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, serverId: string) {
		const s = accessor.get(IMcpService).servers.get().find(s => s.definition.id === serverId);
		await s?.stop();
	}
}

export class McpBrowseCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.Browse,
			title: localize2('mcp.command.browse', "MCP Servers"),
			tooltip: localize2('mcp.command.browse.tooltip', "Browse MCP Servers"),
			category,
			icon: Codicon.search,
			precondition: ChatContextKeys.Setup.hidden.negate(),
			menu: [{
				id: extensionsFilterSubMenu,
				group: '1_predefined',
				order: 1,
				when: ChatContextKeys.Setup.hidden.negate(),
			}, {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', InstalledMcpServersViewId), ChatContextKeys.Setup.hidden.negate()),
				group: 'navigation',
			}],
		});
	}

	async run(accessor: ServicesAccessor) {
		accessor.get(IExtensionsWorkbenchService).openSearch('@mcp ');
	}
}

MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: McpCommandIds.Browse,
		title: localize2('mcp.command.browse.mcp', "Browse MCP Servers"),
		category,
		precondition: ChatContextKeys.Setup.hidden.negate(),
	},
});

export class ShowInstalledMcpServersCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ShowInstalled,
			title: localize2('mcp.command.show.installed', "Show Installed Servers"),
			category,
			precondition: ContextKeyExpr.and(HasInstalledMcpServersContext, ChatContextKeys.Setup.hidden.negate()),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const view = await viewsService.openView(InstalledMcpServersViewId, true);
		if (!view) {
			await viewsService.openViewContainer(VIEW_CONTAINER.id);
			await viewsService.openView(InstalledMcpServersViewId, true);
		}
	}
}

MenuRegistry.appendMenuItem(CHAT_CONFIG_MENU_ID, {
	command: {
		id: McpCommandIds.ShowInstalled,
		title: localize2('mcp.servers', "MCP Servers")
	},
	when: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.equals('view', ChatViewId)),
	order: 10,
	group: '2_level'
});

abstract class OpenMcpResourceCommand extends Action2 {
	protected abstract getURI(accessor: ServicesAccessor): Promise<URI>;

	async run(accessor: ServicesAccessor) {
		const fileService = accessor.get(IFileService);
		const editorService = accessor.get(IEditorService);
		const resource = await this.getURI(accessor);
		if (!(await fileService.exists(resource))) {
			await fileService.createFile(resource, VSBuffer.fromString(JSON.stringify({ servers: {} }, null, '\t')));
		}
		await editorService.openEditor({ resource });
	}
}

export class OpenUserMcpResourceCommand extends OpenMcpResourceCommand {
	constructor() {
		super({
			id: McpCommandIds.OpenUserMcp,
			title: localize2('mcp.command.openUserMcp', "Open User Configuration"),
			category,
			f1: true,
			precondition: ChatContextKeys.Setup.hidden.negate(),
		});
	}

	protected override getURI(accessor: ServicesAccessor): Promise<URI> {
		const userDataProfileService = accessor.get(IUserDataProfileService);
		return Promise.resolve(userDataProfileService.currentProfile.mcpResource);
	}
}

export class OpenRemoteUserMcpResourceCommand extends OpenMcpResourceCommand {
	constructor() {
		super({
			id: McpCommandIds.OpenRemoteUserMcp,
			title: localize2('mcp.command.openRemoteUserMcp', "Open Remote User Configuration"),
			category,
			f1: true,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.Setup.hidden.negate(),
				RemoteNameContext.notEqualsTo('')
			)
		});
	}

	protected override async getURI(accessor: ServicesAccessor): Promise<URI> {
		const userDataProfileService = accessor.get(IUserDataProfileService);
		const remoteUserDataProfileService = accessor.get(IRemoteUserDataProfilesService);
		const remoteProfile = await remoteUserDataProfileService.getRemoteProfile(userDataProfileService.currentProfile);
		return remoteProfile.mcpResource;
	}
}

export class OpenWorkspaceFolderMcpResourceCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.OpenWorkspaceFolderMcp,
			title: localize2('mcp.command.openWorkspaceFolderMcp', "Open Workspace Folder MCP Configuration"),
			category,
			f1: true,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.Setup.hidden.negate(),
				WorkspaceFolderCountContext.notEqualsTo(0)
			)
		});
	}

	async run(accessor: ServicesAccessor) {
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const commandService = accessor.get(ICommandService);
		const editorService = accessor.get(IEditorService);
		const workspaceFolders = workspaceContextService.getWorkspace().folders;
		const workspaceFolder = workspaceFolders.length === 1 ? workspaceFolders[0] : await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID);
		if (workspaceFolder) {
			await editorService.openEditor({ resource: workspaceFolder.toResource(WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]) });
		}
	}
}

export class OpenWorkspaceMcpResourceCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.OpenWorkspaceMcp,
			title: localize2('mcp.command.openWorkspaceMcp', "Open Workspace MCP Configuration"),
			category,
			f1: true,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.Setup.hidden.negate(),
				WorkbenchStateContext.isEqualTo('workspace')
			)
		});
	}

	async run(accessor: ServicesAccessor) {
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const editorService = accessor.get(IEditorService);
		const workspaceConfiguration = workspaceContextService.getWorkspace().configuration;
		if (workspaceConfiguration) {
			await editorService.openEditor({ resource: workspaceConfiguration });
		}
	}
}

export class McpBrowseResourcesCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.BrowseResources,
			title: localize2('mcp.browseResources', "Browse Resources..."),
			category,
			precondition: ContextKeyExpr.and(McpContextKeys.serverCount.greater(0), ChatContextKeys.Setup.hidden.negate()),
			f1: true,
		});
	}

	run(accessor: ServicesAccessor, server?: IMcpServer): void {
		if (server) {
			accessor.get(IInstantiationService).createInstance(McpResourceQuickPick, server).pick();
		} else {
			accessor.get(IQuickInputService).quickAccess.show(McpResourceQuickAccess.PREFIX);
		}
	}
}

export class McpConfigureSamplingModels extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.ConfigureSamplingModels,
			title: localize2('mcp.configureSamplingModels', "Configure SamplingModel"),
			category,
		});
	}

	async run(accessor: ServicesAccessor, server: IMcpServer): Promise<number> {
		const quickInputService = accessor.get(IQuickInputService);
		const lmService = accessor.get(ILanguageModelsService);
		const mcpSampling = accessor.get(IMcpSamplingService);

		const existingIds = new Set(mcpSampling.getConfig(server).allowedModels);
		const allItems: IQuickPickItem[] = lmService.getLanguageModelIds().map(id => {
			const model = lmService.lookupLanguageModel(id)!;
			if (!model.isUserSelectable) {
				return undefined;
			}
			return {
				label: model.name,
				description: model.tooltip,
				id,
				picked: existingIds.size ? existingIds.has(id) : model.isDefault,
			};
		}).filter(isDefined);

		allItems.sort((a, b) => (b.picked ? 1 : 0) - (a.picked ? 1 : 0) || a.label.localeCompare(b.label));

		// do the quickpick selection
		const picked = await quickInputService.pick(allItems, {
			placeHolder: localize('mcp.configureSamplingModels.ph', 'Pick the models {0} can access via MCP sampling', server.definition.label),
			canPickMany: true,
		});

		if (picked) {
			await mcpSampling.updateConfig(server, c => c.allowedModels = picked.map(p => p.id!));
		}

		return picked?.length || 0;
	}
}

export class McpStartPromptingServerCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.StartPromptForServer,
			title: localize2('mcp.startPromptingServer', "Start Prompting Server"),
			category,
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, server: IMcpServer): Promise<void> {
		const widget = await openPanelChatAndGetWidget(accessor.get(IViewsService), accessor.get(IChatWidgetService));
		if (!widget) {
			return;
		}

		const editor = widget.inputEditor;
		const model = editor.getModel();
		if (!model) {
			return;
		}

		const range = (editor.getSelection() || model.getFullModelRange()).collapseToEnd();
		const text = mcpPromptPrefix(server.definition) + '.';

		model.applyEdits([{ range, text }]);
		editor.setSelection(Range.fromPositions(range.getEndPosition().delta(0, text.length)));
		widget.focusInput();
		SuggestController.get(editor)?.triggerSuggest();
	}
}

export class McpSkipCurrentAutostartCommand extends Action2 {
	constructor() {
		super({
			id: McpCommandIds.SkipCurrentAutostart,
			title: localize2('mcp.skipCurrentAutostart', "Skip Current Autostart"),
			category,
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IMcpService).cancelAutostart();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpCommandsAddConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpCommandsAddConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mapFindFirst } from '../../../../base/common/arraysFind.js';
import { assertNever } from '../../../../base/common/assert.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { parse as parseJsonc } from '../../../../base/common/jsonc.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { autorun } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IMcpRemoteServerConfiguration, IMcpServerConfiguration, IMcpServerVariable, IMcpStdioServerConfiguration, McpServerType } from '../../../../platform/mcp/common/mcpPlatformTypes.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isWorkspaceFolder, IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IWorkbenchMcpManagementService } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { allDiscoverySources, DiscoverySource, mcpDiscoverySection, mcpStdioServerSchema } from '../common/mcpConfiguration.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';
import { IMcpService, McpConnectionState } from '../common/mcpTypes.js';

export const enum AddConfigurationType {
	Stdio,
	HTTP,

	NpmPackage,
	PipPackage,
	NuGetPackage,
	DockerImage,
}

type AssistedConfigurationType = AddConfigurationType.NpmPackage | AddConfigurationType.PipPackage | AddConfigurationType.NuGetPackage | AddConfigurationType.DockerImage;

export const AssistedTypes = {
	[AddConfigurationType.NpmPackage]: {
		title: localize('mcp.npm.title', "Enter NPM Package Name"),
		placeholder: localize('mcp.npm.placeholder', "Package name (e.g., @org/package)"),
		pickLabel: localize('mcp.serverType.npm', "NPM Package"),
		pickDescription: localize('mcp.serverType.npm.description', "Install from an NPM package name"),
		enabledConfigKey: null, // always enabled
	},
	[AddConfigurationType.PipPackage]: {
		title: localize('mcp.pip.title', "Enter Pip Package Name"),
		placeholder: localize('mcp.pip.placeholder', "Package name (e.g., package-name)"),
		pickLabel: localize('mcp.serverType.pip', "Pip Package"),
		pickDescription: localize('mcp.serverType.pip.description', "Install from a Pip package name"),
		enabledConfigKey: null, // always enabled
	},
	[AddConfigurationType.NuGetPackage]: {
		title: localize('mcp.nuget.title', "Enter NuGet Package Name"),
		placeholder: localize('mcp.nuget.placeholder', "Package name (e.g., Package.Name)"),
		pickLabel: localize('mcp.serverType.nuget', "NuGet Package"),
		pickDescription: localize('mcp.serverType.nuget.description', "Install from a NuGet package name"),
		enabledConfigKey: 'chat.mcp.assisted.nuget.enabled',
	},
	[AddConfigurationType.DockerImage]: {
		title: localize('mcp.docker.title', "Enter Docker Image Name"),
		placeholder: localize('mcp.docker.placeholder', "Image name (e.g., mcp/imagename)"),
		pickLabel: localize('mcp.serverType.docker', "Docker Image"),
		pickDescription: localize('mcp.serverType.docker.description', "Install from a Docker image"),
		enabledConfigKey: null, // always enabled
	},
};

const enum AddConfigurationCopilotCommand {
	/** Returns whether MCP enhanced setup is enabled. */
	IsSupported = 'github.copilot.chat.mcp.setup.check',

	/** Takes an npm/pip package name, validates its owner. */
	ValidatePackage = 'github.copilot.chat.mcp.setup.validatePackage',

	/** Returns the resolved MCP configuration. */
	StartFlow = 'github.copilot.chat.mcp.setup.flow',
}

type ValidatePackageResult =
	{ state: 'ok'; publisher: string; name?: string; version?: string }
	| { state: 'error'; error: string; helpUri?: string; helpUriLabel?: string };

type AddServerData = {
	packageType: string;
};
type AddServerClassification = {
	owner: 'digitarald';
	comment: 'Generic details for adding a new MCP server';
	packageType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of MCP server package' };
};
type AddServerCompletedData = {
	packageType: string;
	serverType: string | undefined;
	target: string;
};
type AddServerCompletedClassification = {
	owner: 'digitarald';
	comment: 'Generic details for successfully adding model-assisted MCP server';
	packageType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of MCP server package' };
	serverType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of MCP server' };
	target: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The target of the MCP server configuration' };
};

type AssistedServerConfiguration = {
	type?: 'assisted';
	name?: string;
	server: Omit<IMcpStdioServerConfiguration, 'type'>;
	inputs?: IMcpServerVariable[];
	inputValues?: Record<string, string>;
} | {
	type: 'mapped';
	name?: string;
	server: Omit<IMcpStdioServerConfiguration, 'type'>;
	inputs?: IMcpServerVariable[];
};

export class McpAddConfigurationCommand {
	constructor(
		private readonly workspaceFolder: IWorkspaceFolder | undefined,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IWorkbenchMcpManagementService private readonly _mcpManagementService: IWorkbenchMcpManagementService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ICommandService private readonly _commandService: ICommandService,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IEditorService private readonly _editorService: IEditorService,
		@IFileService private readonly _fileService: IFileService,
		@INotificationService private readonly _notificationService: INotificationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IMcpService private readonly _mcpService: IMcpService,
		@ILabelService private readonly _label: ILabelService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) { }

	private async getServerType(): Promise<AddConfigurationType | undefined> {
		type TItem = { kind: AddConfigurationType | 'browse' | 'discovery' } & IQuickPickItem;
		const items: QuickPickInput<TItem>[] = [
			{ kind: AddConfigurationType.Stdio, label: localize('mcp.serverType.command', "Command (stdio)"), description: localize('mcp.serverType.command.description', "Run a local command that implements the MCP protocol") },
			{ kind: AddConfigurationType.HTTP, label: localize('mcp.serverType.http', "HTTP (HTTP or Server-Sent Events)"), description: localize('mcp.serverType.http.description', "Connect to a remote HTTP server that implements the MCP protocol") }
		];

		let aiSupported: boolean | undefined;
		try {
			aiSupported = await this._commandService.executeCommand<boolean>(AddConfigurationCopilotCommand.IsSupported);
		} catch {
			// ignored
		}

		if (aiSupported) {
			items.unshift({ type: 'separator', label: localize('mcp.serverType.manual', "Manual Install") });

			const elligableTypes = Object.entries(AssistedTypes).map(([type, { pickLabel, pickDescription, enabledConfigKey }]) => {
				if (enabledConfigKey) {
					const enabled = this._configurationService.getValue<boolean>(enabledConfigKey) ?? false;
					if (!enabled) {
						return;
					}
				}
				return {
					kind: Number(type) as AddConfigurationType,
					label: pickLabel,
					description: pickDescription,
				};
			}).filter(x => !!x);

			items.push(
				{ type: 'separator', label: localize('mcp.serverType.copilot', "Model-Assisted") },
				...elligableTypes
			);
		}

		items.push({ type: 'separator' });

		const discovery = this._configurationService.getValue<{ [K in DiscoverySource]: boolean }>(mcpDiscoverySection);
		if (discovery && typeof discovery === 'object' && allDiscoverySources.some(d => !discovery[d])) {
			items.push({
				kind: 'discovery',
				label: localize('mcp.servers.discovery', "Add from another application..."),
			});
		}

		items.push({
			kind: 'browse',
			label: localize('mcp.servers.browse', "Browse MCP Servers..."),
		});

		const result = await this._quickInputService.pick<TItem>(items, {
			placeHolder: localize('mcp.serverType.placeholder', "Choose the type of MCP server to add"),
		});

		if (result?.kind === 'browse') {
			this._commandService.executeCommand(McpCommandIds.Browse);
			return undefined;
		}

		if (result?.kind === 'discovery') {
			this._commandService.executeCommand('workbench.action.openSettings', mcpDiscoverySection);
			return undefined;
		}

		return result?.kind;
	}

	private async getStdioConfig(): Promise<IMcpStdioServerConfiguration | undefined> {
		const command = await this._quickInputService.input({
			title: localize('mcp.command.title', "Enter Command"),
			placeHolder: localize('mcp.command.placeholder', "Command to run (with optional arguments)"),
			ignoreFocusLost: true,
		});

		if (!command) {
			return undefined;
		}

		this._telemetryService.publicLog2<AddServerData, AddServerClassification>('mcp.addserver', {
			packageType: 'stdio'
		});

		// Split command into command and args, handling quotes
		const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g)!;
		return {
			type: McpServerType.LOCAL,
			command: parts[0].replace(/"/g, ''),

			args: parts.slice(1).map(arg => arg.replace(/"/g, ''))
		};
	}

	private async getSSEConfig(): Promise<IMcpRemoteServerConfiguration | undefined> {
		const url = await this._quickInputService.input({
			title: localize('mcp.url.title', "Enter Server URL"),
			placeHolder: localize('mcp.url.placeholder', "URL of the MCP server (e.g., http://localhost:3000)"),
			ignoreFocusLost: true,
		});

		if (!url) {
			return undefined;
		}

		this._telemetryService.publicLog2<AddServerData, AddServerClassification>('mcp.addserver', {
			packageType: 'sse'
		});

		return { url, type: McpServerType.REMOTE };
	}

	private async getServerId(suggestion = `my-mcp-server-${generateUuid().split('-')[0]}`): Promise<string | undefined> {
		const id = await this._quickInputService.input({
			title: localize('mcp.serverId.title', "Enter Server ID"),
			placeHolder: localize('mcp.serverId.placeholder', "Unique identifier for this server"),
			value: suggestion,
			ignoreFocusLost: true,
		});

		return id;
	}

	private async getConfigurationTarget(): Promise<ConfigurationTarget | IWorkspaceFolder | undefined> {
		const options: (IQuickPickItem & { target?: ConfigurationTarget | IWorkspaceFolder })[] = [
			{ target: ConfigurationTarget.USER_LOCAL, label: localize('mcp.target.user', "Global"), description: localize('mcp.target.user.description', "Available in all workspaces, runs locally") }
		];

		const raLabel = this._environmentService.remoteAuthority && this._label.getHostLabel(Schemas.vscodeRemote, this._environmentService.remoteAuthority);
		if (raLabel) {
			options.push({ target: ConfigurationTarget.USER_REMOTE, label: localize('mcp.target.remote', "Remote"), description: localize('mcp.target..remote.description', "Available on this remote machine, runs on {0}", raLabel) });
		}

		const workbenchState = this._workspaceService.getWorkbenchState();
		if (workbenchState !== WorkbenchState.EMPTY) {
			const target = workbenchState === WorkbenchState.FOLDER ? this._workspaceService.getWorkspace().folders[0] : ConfigurationTarget.WORKSPACE;
			if (this._environmentService.remoteAuthority) {
				options.push({ target, label: localize('mcp.target.workspace', "Workspace"), description: localize('mcp.target.workspace.description.remote', "Available in this workspace, runs on {0}", raLabel) });
			} else {
				options.push({ target, label: localize('mcp.target.workspace', "Workspace"), description: localize('mcp.target.workspace.description', "Available in this workspace, runs locally") });
			}
		}

		if (options.length === 1) {
			return options[0].target;
		}

		const targetPick = await this._quickInputService.pick(options, {
			title: localize('mcp.target.title', "Add MCP Server"),
			placeHolder: localize('mcp.target.placeholder', "Select the configuration target")
		});

		return targetPick?.target;
	}

	private async getAssistedConfig(type: AssistedConfigurationType): Promise<{ name?: string; server: Omit<IMcpStdioServerConfiguration, 'type'>; inputs?: IMcpServerVariable[]; inputValues?: Record<string, string> } | undefined> {
		const packageName = await this._quickInputService.input({
			ignoreFocusLost: true,
			title: AssistedTypes[type].title,
			placeHolder: AssistedTypes[type].placeholder,
		});

		if (!packageName) {
			return undefined;
		}

		const enum LoadAction {
			Retry = 'retry',
			Cancel = 'cancel',
			Allow = 'allow',
			OpenUri = 'openUri',
		}

		const loadingQuickPickStore = new DisposableStore();
		const loadingQuickPick = loadingQuickPickStore.add(this._quickInputService.createQuickPick<IQuickPickItem & { id: LoadAction; helpUri?: URI }>());
		loadingQuickPick.title = localize('mcp.loading.title', "Loading package details...");
		loadingQuickPick.busy = true;
		loadingQuickPick.ignoreFocusOut = true;

		const packageType = this.getPackageType(type);

		this._telemetryService.publicLog2<AddServerData, AddServerClassification>('mcp.addserver', {
			packageType: packageType!
		});

		this._commandService.executeCommand<ValidatePackageResult>(
			AddConfigurationCopilotCommand.ValidatePackage,
			{
				type: packageType,
				name: packageName,
				targetConfig: {
					...mcpStdioServerSchema,
					properties: {
						...mcpStdioServerSchema.properties,
						name: {
							type: 'string',
							description: 'Suggested name of the server, alphanumeric and hyphen only',
						}
					},
					required: [...(mcpStdioServerSchema.required || []), 'name'],
				},
			}
		).then(result => {
			if (!result || result.state === 'error') {
				loadingQuickPick.title = result?.error || 'Unknown error loading package';

				const items: Array<IQuickPickItem & { id: LoadAction; helpUri?: URI }> = [];

				if (result?.helpUri) {
					items.push({
						id: LoadAction.OpenUri,
						label: result.helpUriLabel ?? localize('mcp.error.openHelpUri', 'Open help URL'),
						helpUri: URI.parse(result.helpUri),
					});
				}

				items.push(
					{ id: LoadAction.Retry, label: localize('mcp.error.retry', 'Try a different package') },
					{ id: LoadAction.Cancel, label: localize('cancel', 'Cancel') },
				);

				loadingQuickPick.items = items;
			} else {
				loadingQuickPick.title = localize(
					'mcp.confirmPublish', 'Install {0}{1} from {2}?',
					result.name ?? packageName,
					result.version ? `@${result.version}` : '',
					result.publisher);
				loadingQuickPick.items = [
					{ id: LoadAction.Allow, label: localize('allow', "Allow") },
					{ id: LoadAction.Cancel, label: localize('cancel', 'Cancel') }
				];
			}
			loadingQuickPick.busy = false;
		});

		const loadingAction = await new Promise<{ id: LoadAction; helpUri?: URI } | undefined>(resolve => {
			loadingQuickPick.onDidAccept(() => resolve(loadingQuickPick.selectedItems[0]));
			loadingQuickPick.onDidHide(() => resolve(undefined));
			loadingQuickPick.show();
		}).finally(() => loadingQuickPick.dispose());

		switch (loadingAction?.id) {
			case LoadAction.Retry:
				return this.getAssistedConfig(type);
			case LoadAction.OpenUri:
				if (loadingAction.helpUri) { this._openerService.open(loadingAction.helpUri); }
				return undefined;
			case LoadAction.Allow:
				break;
			case LoadAction.Cancel:
			default:
				return undefined;
		}

		const config = await this._commandService.executeCommand<AssistedServerConfiguration>(
			AddConfigurationCopilotCommand.StartFlow,
			{
				name: packageName,
				type: packageType
			}
		);

		if (config?.type === 'mapped') {
			return {
				name: config.name,
				server: config.server,
				inputs: config.inputs,
			};
		} else if (config?.type === 'assisted' || !config?.type) {
			return config;
		} else {
			assertNever(config?.type);
		}
	}

	/** Shows the location of a server config once it's discovered. */
	private showOnceDiscovered(name: string) {
		const store = new DisposableStore();
		store.add(autorun(reader => {
			const colls = this._mcpRegistry.collections.read(reader);
			const servers = this._mcpService.servers.read(reader);
			const match = mapFindFirst(colls, collection => mapFindFirst(collection.serverDefinitions.read(reader),
				server => server.label === name ? { server, collection } : undefined));
			const server = match && servers.find(s => s.definition.id === match.server.id);


			if (match && server) {
				if (match.collection.presentation?.origin) {
					this._editorService.openEditor({
						resource: match.collection.presentation.origin,
						options: {
							selection: match.server.presentation?.origin?.range,
							preserveFocus: true,
						}
					});
				} else {
					this._commandService.executeCommand(McpCommandIds.ServerOptions, name);
				}

				server.start({ promptType: 'all-untrusted' }).then(state => {
					if (state.state === McpConnectionState.Kind.Error) {
						server.showOutput();
					}
				});

				store.dispose();
			}
		}));

		store.add(disposableTimeout(() => store.dispose(), 5000));
	}

	public async run(): Promise<void> {
		// Step 1: Choose server type
		const serverType = await this.getServerType();
		if (serverType === undefined) {
			return;
		}

		// Step 2: Get server details based on type
		let config: IMcpServerConfiguration | undefined;
		let suggestedName: string | undefined;
		let inputs: IMcpServerVariable[] | undefined;
		let inputValues: Record<string, string> | undefined;
		switch (serverType) {
			case AddConfigurationType.Stdio:
				config = await this.getStdioConfig();
				break;
			case AddConfigurationType.HTTP:
				config = await this.getSSEConfig();
				break;
			case AddConfigurationType.NpmPackage:
			case AddConfigurationType.PipPackage:
			case AddConfigurationType.NuGetPackage:
			case AddConfigurationType.DockerImage: {
				const r = await this.getAssistedConfig(serverType);
				config = r?.server ? { ...r.server, type: McpServerType.LOCAL } : undefined;
				suggestedName = r?.name;
				inputs = r?.inputs;
				inputValues = r?.inputValues;
				break;
			}
			default:
				assertNever(serverType);
		}

		if (!config) {
			return;
		}

		// Step 3: Get server ID
		const name = await this.getServerId(suggestedName);
		if (!name) {
			return;
		}

		// Step 4: Choose configuration target if no configUri provided
		let target: ConfigurationTarget | IWorkspaceFolder | undefined = this.workspaceFolder;
		if (!target) {
			target = await this.getConfigurationTarget();
			if (!target) {
				return;
			}
		}

		await this._mcpManagementService.install({ name, config, inputs }, { target });

		if (inputValues) {
			for (const [key, value] of Object.entries(inputValues)) {
				await this._mcpRegistry.setSavedInput(key, (isWorkspaceFolder(target) ? ConfigurationTarget.WORKSPACE_FOLDER : target) ?? ConfigurationTarget.WORKSPACE, value);
			}
		}

		const packageType = this.getPackageType(serverType);
		if (packageType) {
			this._telemetryService.publicLog2<AddServerCompletedData, AddServerCompletedClassification>('mcp.addserver.completed', {
				packageType,
				serverType: config.type,
				target: target === ConfigurationTarget.WORKSPACE ? 'workspace' : 'user'
			});
		}

		this.showOnceDiscovered(name);
	}

	public async pickForUrlHandler(resource: URI, showIsPrimary = false): Promise<void> {
		const name = decodeURIComponent(basename(resource)).replace(/\.json$/, '');
		const placeHolder = localize('install.title', 'Install MCP server {0}', name);

		const items: IQuickPickItem[] = [
			{ id: 'install', label: localize('install.start', 'Install Server') },
			{ id: 'show', label: localize('install.show', 'Show Configuration', name) },
			{ id: 'rename', label: localize('install.rename', 'Rename "{0}"', name) },
			{ id: 'cancel', label: localize('cancel', 'Cancel') },
		];
		if (showIsPrimary) {
			[items[0], items[1]] = [items[1], items[0]];
		}

		const pick = await this._quickInputService.pick(items, { placeHolder, ignoreFocusLost: true });
		const getEditors = () => this._editorService.findEditors(resource);

		switch (pick?.id) {
			case 'show':
				await this._editorService.openEditor({ resource });
				break;
			case 'install':
				await this._editorService.save(getEditors());
				try {
					const contents = await this._fileService.readFile(resource);
					const { inputs, ...config }: IMcpServerConfiguration & { inputs?: IMcpServerVariable[] } = parseJsonc(contents.value.toString());
					await this._mcpManagementService.install({ name, config, inputs });
					this._editorService.closeEditors(getEditors());
					this.showOnceDiscovered(name);
				} catch (e) {
					this._notificationService.error(localize('install.error', 'Error installing MCP server {0}: {1}', name, e.message));
					await this._editorService.openEditor({ resource });
				}
				break;
			case 'rename': {
				const newName = await this._quickInputService.input({ placeHolder: localize('install.newName', 'Enter new name'), value: name });
				if (newName) {
					const newURI = resource.with({ path: `/${encodeURIComponent(newName)}.json` });
					await this._editorService.save(getEditors());
					await this._fileService.move(resource, newURI);
					return this.pickForUrlHandler(newURI, showIsPrimary);
				}
				break;
			}
		}
	}

	private getPackageType(serverType: AddConfigurationType): string | undefined {
		switch (serverType) {
			case AddConfigurationType.NpmPackage:
				return 'npm';
			case AddConfigurationType.PipPackage:
				return 'pip';
			case AddConfigurationType.NuGetPackage:
				return 'nuget';
			case AddConfigurationType.DockerImage:
				return 'docker';
			case AddConfigurationType.Stdio:
				return 'stdio';
			case AddConfigurationType.HTTP:
				return 'sse';
			default:
				return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { mcpAccessConfig, McpAccessValue } from '../../../../platform/mcp/common/mcpManagement.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { mcpDiscoveryRegistry } from '../common/discovery/mcpDiscovery.js';

export class McpDiscovery extends Disposable implements IWorkbenchContribution {
	public static readonly ID = 'workbench.contrib.mcp.discovery';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();

		const mcpAccessValue = observableConfigValue(mcpAccessConfig, McpAccessValue.All, configurationService);
		const store = this._register(new DisposableStore());

		this._register(autorun(reader => {
			store.clear();
			const value = mcpAccessValue.read(reader);
			if (value === McpAccessValue.None) {
				return;
			}
			for (const descriptor of mcpDiscoveryRegistry.getAll()) {
				const mcpDiscovery = instantiationService.createInstance(descriptor);
				if (value === McpAccessValue.Registry && !mcpDiscovery.fromGallery) {
					mcpDiscovery.dispose();
					continue;
				}
				store.add(mcpDiscovery);
				mcpDiscovery.start();
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

````

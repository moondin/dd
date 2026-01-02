---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 278
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 278 of 552)

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

---[FILE: src/vs/platform/list/browser/listService.ts]---
Location: vscode-main/src/vs/platform/list/browser/listService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isActiveElement, isKeyboardEvent } from '../../../base/browser/dom.js';
import { IContextViewProvider } from '../../../base/browser/ui/contextview/contextview.js';
import { IListMouseEvent, IListRenderer, IListTouchEvent, IListVirtualDelegate } from '../../../base/browser/ui/list/list.js';
import { IPagedListOptions, IPagedRenderer, PagedList } from '../../../base/browser/ui/list/listPaging.js';
import { IKeyboardNavigationEventFilter, IListAccessibilityProvider, IListOptions, IListOptionsUpdate, IListStyles, IMultipleSelectionController, isSelectionRangeChangeEvent, isSelectionSingleChangeEvent, List, TypeNavigationMode } from '../../../base/browser/ui/list/listWidget.js';
import { ITableColumn, ITableRenderer, ITableVirtualDelegate } from '../../../base/browser/ui/table/table.js';
import { ITableOptions, ITableOptionsUpdate, ITableStyles, Table } from '../../../base/browser/ui/table/tableWidget.js';
import { IAbstractTreeOptions, IAbstractTreeOptionsUpdate, RenderIndentGuides, TreeFindMatchType, TreeFindMode } from '../../../base/browser/ui/tree/abstractTree.js';
import { AsyncDataTree, CompressibleAsyncDataTree, IAsyncDataTreeNode, IAsyncDataTreeOptions, IAsyncDataTreeOptionsUpdate, ICompressibleAsyncDataTreeOptions, ICompressibleAsyncDataTreeOptionsUpdate, ITreeCompressionDelegate } from '../../../base/browser/ui/tree/asyncDataTree.js';
import { DataTree, IDataTreeOptions } from '../../../base/browser/ui/tree/dataTree.js';
import { CompressibleObjectTree, ICompressibleObjectTreeOptions, ICompressibleObjectTreeOptionsUpdate, ICompressibleTreeRenderer, IObjectTreeOptions, ObjectTree } from '../../../base/browser/ui/tree/objectTree.js';
import { IAsyncDataSource, IDataSource, ITreeEvent, ITreeRenderer } from '../../../base/browser/ui/tree/tree.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { combinedDisposable, Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, IScopedContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';
import { InputFocusedContextKey } from '../../contextkey/common/contextkeys.js';
import { IContextViewService } from '../../contextview/browser/contextView.js';
import { IEditorOptions } from '../../editor/common/editor.js';
import { createDecorator, IInstantiationService, ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ResultKind } from '../../keybinding/common/keybindingResolver.js';
import { Registry } from '../../registry/common/platform.js';
import { defaultFindWidgetStyles, defaultListStyles, getListStyles, IStyleOverride } from '../../theme/browser/defaultStyles.js';

export type ListWidget = List<any> | PagedList<any> | ObjectTree<any, any> | DataTree<any, any, any> | AsyncDataTree<any, any, any> | Table<any>;
export type WorkbenchListWidget = WorkbenchList<any> | WorkbenchPagedList<any> | WorkbenchObjectTree<any, any> | WorkbenchCompressibleObjectTree<any, any> | WorkbenchDataTree<any, any, any> | WorkbenchAsyncDataTree<any, any, any> | WorkbenchCompressibleAsyncDataTree<any, any, any> | WorkbenchTable<any>;

export const IListService = createDecorator<IListService>('listService');

export interface IListService {

	readonly _serviceBrand: undefined;

	/**
	 * Returns the currently focused list widget if any.
	 */
	readonly lastFocusedList: WorkbenchListWidget | undefined;
}

interface IRegisteredList {
	widget: WorkbenchListWidget;
	extraContextKeys?: (IContextKey<boolean>)[];
}

export class ListService implements IListService {

	declare readonly _serviceBrand: undefined;

	private readonly disposables = new DisposableStore();
	private lists: IRegisteredList[] = [];
	private _lastFocusedWidget: WorkbenchListWidget | undefined = undefined;

	get lastFocusedList(): WorkbenchListWidget | undefined {
		return this._lastFocusedWidget;
	}

	constructor() { }

	private setLastFocusedList(widget: WorkbenchListWidget | undefined): void {
		if (widget === this._lastFocusedWidget) {
			return;
		}

		this._lastFocusedWidget?.getHTMLElement().classList.remove('last-focused');
		this._lastFocusedWidget = widget;
		this._lastFocusedWidget?.getHTMLElement().classList.add('last-focused');
	}

	register(widget: WorkbenchListWidget, extraContextKeys?: (IContextKey<boolean>)[]): IDisposable {
		if (this.lists.some(l => l.widget === widget)) {
			throw new Error('Cannot register the same widget multiple times');
		}

		// Keep in our lists list
		const registeredList: IRegisteredList = { widget, extraContextKeys };
		this.lists.push(registeredList);

		// Check for currently being focused
		if (isActiveElement(widget.getHTMLElement())) {
			this.setLastFocusedList(widget);
		}

		return combinedDisposable(
			widget.onDidFocus(() => this.setLastFocusedList(widget)),
			toDisposable(() => this.lists.splice(this.lists.indexOf(registeredList), 1)),
			widget.onDidDispose(() => {
				this.lists = this.lists.filter(l => l !== registeredList);
				if (this._lastFocusedWidget === widget) {
					this.setLastFocusedList(undefined);
				}
			})
		);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

export const RawWorkbenchListScrollAtBoundaryContextKey = new RawContextKey<'none' | 'top' | 'bottom' | 'both'>('listScrollAtBoundary', 'none');
export const WorkbenchListScrollAtTopContextKey = ContextKeyExpr.or(
	RawWorkbenchListScrollAtBoundaryContextKey.isEqualTo('top'),
	RawWorkbenchListScrollAtBoundaryContextKey.isEqualTo('both'));
export const WorkbenchListScrollAtBottomContextKey = ContextKeyExpr.or(
	RawWorkbenchListScrollAtBoundaryContextKey.isEqualTo('bottom'),
	RawWorkbenchListScrollAtBoundaryContextKey.isEqualTo('both'));

export const RawWorkbenchListFocusContextKey = new RawContextKey<boolean>('listFocus', true);
export const WorkbenchTreeStickyScrollFocused = new RawContextKey<boolean>('treestickyScrollFocused', false);
export const WorkbenchListSupportsMultiSelectContextKey = new RawContextKey<boolean>('listSupportsMultiselect', true);
export const WorkbenchListFocusContextKey = ContextKeyExpr.and(RawWorkbenchListFocusContextKey, ContextKeyExpr.not(InputFocusedContextKey), WorkbenchTreeStickyScrollFocused.negate());
export const WorkbenchListHasSelectionOrFocus = new RawContextKey<boolean>('listHasSelectionOrFocus', false);
export const WorkbenchListDoubleSelection = new RawContextKey<boolean>('listDoubleSelection', false);
export const WorkbenchListMultiSelection = new RawContextKey<boolean>('listMultiSelection', false);
export const WorkbenchListSelectionNavigation = new RawContextKey<boolean>('listSelectionNavigation', false);
export const WorkbenchListSupportsFind = new RawContextKey<boolean>('listSupportsFind', true);
export const WorkbenchTreeElementCanCollapse = new RawContextKey<boolean>('treeElementCanCollapse', false);
export const WorkbenchTreeElementHasParent = new RawContextKey<boolean>('treeElementHasParent', false);
export const WorkbenchTreeElementCanExpand = new RawContextKey<boolean>('treeElementCanExpand', false);
export const WorkbenchTreeElementHasChild = new RawContextKey<boolean>('treeElementHasChild', false);
export const WorkbenchTreeFindOpen = new RawContextKey<boolean>('treeFindOpen', false);
const WorkbenchListTypeNavigationModeKey = 'listTypeNavigationMode';

/**
 * @deprecated in favor of WorkbenchListTypeNavigationModeKey
 */
const WorkbenchListAutomaticKeyboardNavigationLegacyKey = 'listAutomaticKeyboardNavigation';

function createScopedContextKeyService(contextKeyService: IContextKeyService, widget: ListWidget): IScopedContextKeyService {
	const result = contextKeyService.createScoped(widget.getHTMLElement());
	RawWorkbenchListFocusContextKey.bindTo(result);
	return result;
}

// Note: We must declare IScrollObservarable as the arithmetic of concrete classes,
// instead of object type like { onDidScroll: Event<any>; ... }. The latter will not mark
// those properties as referenced during tree-shaking, causing them to be shaked away.
type IScrollObservarable = Exclude<WorkbenchListWidget, WorkbenchPagedList<any>> | List<any>;

function createScrollObserver(contextKeyService: IContextKeyService, widget: IScrollObservarable): IDisposable {
	const listScrollAt = RawWorkbenchListScrollAtBoundaryContextKey.bindTo(contextKeyService);
	const update = () => {
		const atTop = widget.scrollTop === 0;

		// We need a threshold `1` since scrollHeight is rounded.
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
		const atBottom = widget.scrollHeight - widget.renderHeight - widget.scrollTop < 1;
		if (atTop && atBottom) {
			listScrollAt.set('both');
		} else if (atTop) {
			listScrollAt.set('top');
		} else if (atBottom) {
			listScrollAt.set('bottom');
		} else {
			listScrollAt.set('none');
		}
	};
	update();
	return widget.onDidScroll(update);
}

const multiSelectModifierSettingKey = 'workbench.list.multiSelectModifier';
const openModeSettingKey = 'workbench.list.openMode';
const horizontalScrollingKey = 'workbench.list.horizontalScrolling';
const defaultFindModeSettingKey = 'workbench.list.defaultFindMode';
const typeNavigationModeSettingKey = 'workbench.list.typeNavigationMode';
/** @deprecated in favor of `workbench.list.defaultFindMode` and `workbench.list.typeNavigationMode` */
const keyboardNavigationSettingKey = 'workbench.list.keyboardNavigation';
const scrollByPageKey = 'workbench.list.scrollByPage';
const defaultFindMatchTypeSettingKey = 'workbench.list.defaultFindMatchType';
const treeIndentKey = 'workbench.tree.indent';
const treeRenderIndentGuidesKey = 'workbench.tree.renderIndentGuides';
const listSmoothScrolling = 'workbench.list.smoothScrolling';
const mouseWheelScrollSensitivityKey = 'workbench.list.mouseWheelScrollSensitivity';
const fastScrollSensitivityKey = 'workbench.list.fastScrollSensitivity';
const treeExpandMode = 'workbench.tree.expandMode';
const treeStickyScroll = 'workbench.tree.enableStickyScroll';
const treeStickyScrollMaxElements = 'workbench.tree.stickyScrollMaxItemCount';

function useAltAsMultipleSelectionModifier(configurationService: IConfigurationService): boolean {
	return configurationService.getValue(multiSelectModifierSettingKey) === 'alt';
}

class MultipleSelectionController<T> extends Disposable implements IMultipleSelectionController<T> {
	private useAltAsMultipleSelectionModifier: boolean;

	constructor(private configurationService: IConfigurationService) {
		super();

		this.useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
				this.useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(this.configurationService);
			}
		}));
	}

	isSelectionSingleChangeEvent(event: IListMouseEvent<T> | IListTouchEvent<T>): boolean {
		if (this.useAltAsMultipleSelectionModifier) {
			return event.browserEvent.altKey;
		}

		return isSelectionSingleChangeEvent(event);
	}

	isSelectionRangeChangeEvent(event: IListMouseEvent<T> | IListTouchEvent<T>): boolean {
		return isSelectionRangeChangeEvent(event);
	}
}

function toWorkbenchListOptions<T>(
	accessor: ServicesAccessor,
	options: IListOptions<T>,
): [IListOptions<T>, IDisposable] {
	const configurationService = accessor.get(IConfigurationService);
	const keybindingService = accessor.get(IKeybindingService);

	const disposables = new DisposableStore();
	const result: IListOptions<T> = {
		...options,
		keyboardNavigationDelegate: { mightProducePrintableCharacter(e) { return keybindingService.mightProducePrintableCharacter(e); } },
		smoothScrolling: Boolean(configurationService.getValue(listSmoothScrolling)),
		mouseWheelScrollSensitivity: configurationService.getValue<number>(mouseWheelScrollSensitivityKey),
		fastScrollSensitivity: configurationService.getValue<number>(fastScrollSensitivityKey),
		multipleSelectionController: options.multipleSelectionController ?? disposables.add(new MultipleSelectionController(configurationService)),
		keyboardNavigationEventFilter: createKeyboardNavigationEventFilter(keybindingService),
		scrollByPage: Boolean(configurationService.getValue(scrollByPageKey))
	};

	return [result, disposables];
}

export interface IWorkbenchListOptionsUpdate extends IListOptionsUpdate {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
}

export interface IWorkbenchListOptions<T> extends IWorkbenchListOptionsUpdate, IResourceNavigatorOptions, IListOptions<T> {
	readonly selectionNavigation?: boolean;
}

export class WorkbenchList<T> extends List<T> {

	readonly contextKeyService: IScopedContextKeyService;
	private listSupportsMultiSelect: IContextKey<boolean>;
	private listHasSelectionOrFocus: IContextKey<boolean>;
	private listDoubleSelection: IContextKey<boolean>;
	private listMultiSelection: IContextKey<boolean>;
	private horizontalScrolling: boolean | undefined;
	private _useAltAsMultipleSelectionModifier: boolean;
	private navigator: ListResourceNavigator<T>;
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.navigator.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: IListRenderer<T, any>[],
		options: IWorkbenchListOptions<T>,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		const horizontalScrolling = typeof options.horizontalScrolling !== 'undefined' ? options.horizontalScrolling : Boolean(configurationService.getValue(horizontalScrollingKey));
		const [workbenchListOptions, workbenchListOptionsDisposable] = instantiationService.invokeFunction(toWorkbenchListOptions, options);

		super(user, container, delegate, renderers,
			{
				keyboardSupport: false,
				...workbenchListOptions,
				horizontalScrolling,
			}
		);

		this.disposables.add(workbenchListOptionsDisposable);

		this.contextKeyService = createScopedContextKeyService(contextKeyService, this);

		this.disposables.add(createScrollObserver(this.contextKeyService, this));

		this.listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(this.contextKeyService);
		this.listSupportsMultiSelect.set(options.multipleSelectionSupport !== false);

		const listSelectionNavigation = WorkbenchListSelectionNavigation.bindTo(this.contextKeyService);
		listSelectionNavigation.set(Boolean(options.selectionNavigation));

		this.listHasSelectionOrFocus = WorkbenchListHasSelectionOrFocus.bindTo(this.contextKeyService);
		this.listDoubleSelection = WorkbenchListDoubleSelection.bindTo(this.contextKeyService);
		this.listMultiSelection = WorkbenchListMultiSelection.bindTo(this.contextKeyService);
		this.horizontalScrolling = options.horizontalScrolling;

		this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);

		this.disposables.add(this.contextKeyService);
		this.disposables.add((listService as ListService).register(this));

		this.updateStyles(options.overrideStyles);

		this.disposables.add(this.onDidChangeSelection(() => {
			const selection = this.getSelection();
			const focus = this.getFocus();

			this.contextKeyService.bufferChangeEvents(() => {
				this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
				this.listMultiSelection.set(selection.length > 1);
				this.listDoubleSelection.set(selection.length === 2);
			});
		}));
		this.disposables.add(this.onDidChangeFocus(() => {
			const selection = this.getSelection();
			const focus = this.getFocus();

			this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
		}));
		this.disposables.add(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
				this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
			}

			let options: IListOptionsUpdate = {};

			if (e.affectsConfiguration(horizontalScrollingKey) && this.horizontalScrolling === undefined) {
				const horizontalScrolling = Boolean(configurationService.getValue(horizontalScrollingKey));
				options = { ...options, horizontalScrolling };
			}
			if (e.affectsConfiguration(scrollByPageKey)) {
				const scrollByPage = Boolean(configurationService.getValue(scrollByPageKey));
				options = { ...options, scrollByPage };
			}
			if (e.affectsConfiguration(listSmoothScrolling)) {
				const smoothScrolling = Boolean(configurationService.getValue(listSmoothScrolling));
				options = { ...options, smoothScrolling };
			}
			if (e.affectsConfiguration(mouseWheelScrollSensitivityKey)) {
				const mouseWheelScrollSensitivity = configurationService.getValue<number>(mouseWheelScrollSensitivityKey);
				options = { ...options, mouseWheelScrollSensitivity };
			}
			if (e.affectsConfiguration(fastScrollSensitivityKey)) {
				const fastScrollSensitivity = configurationService.getValue<number>(fastScrollSensitivityKey);
				options = { ...options, fastScrollSensitivity };
			}
			if (Object.keys(options).length > 0) {
				this.updateOptions(options);
			}
		}));

		this.navigator = new ListResourceNavigator(this, { configurationService, ...options });
		this.disposables.add(this.navigator);
	}

	override updateOptions(options: IWorkbenchListOptionsUpdate): void {
		super.updateOptions(options);

		if (options.overrideStyles !== undefined) {
			this.updateStyles(options.overrideStyles);
		}

		if (options.multipleSelectionSupport !== undefined) {
			this.listSupportsMultiSelect.set(!!options.multipleSelectionSupport);
		}
	}

	private updateStyles(styles: IStyleOverride<IListStyles> | undefined): void {
		this.style(styles ? getListStyles(styles) : defaultListStyles);
	}

	get useAltAsMultipleSelectionModifier(): boolean {
		return this._useAltAsMultipleSelectionModifier;
	}
}

export interface IWorkbenchPagedListOptions<T> extends IWorkbenchListOptionsUpdate, IResourceNavigatorOptions, IPagedListOptions<T> {
	readonly selectionNavigation?: boolean;
}

export class WorkbenchPagedList<T> extends PagedList<T> {

	readonly contextKeyService: IScopedContextKeyService;
	private readonly disposables: DisposableStore;
	private listSupportsMultiSelect: IContextKey<boolean>;
	private _useAltAsMultipleSelectionModifier: boolean;
	private horizontalScrolling: boolean | undefined;
	private navigator: ListResourceNavigator<T>;
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.navigator.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<number>,
		renderers: IPagedRenderer<T, any>[],
		options: IWorkbenchPagedListOptions<T>,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		const horizontalScrolling = typeof options.horizontalScrolling !== 'undefined' ? options.horizontalScrolling : Boolean(configurationService.getValue(horizontalScrollingKey));
		const [workbenchListOptions, workbenchListOptionsDisposable] = instantiationService.invokeFunction(toWorkbenchListOptions, options);
		super(user, container, delegate, renderers,
			{
				keyboardSupport: false,
				...workbenchListOptions,
				horizontalScrolling,
			}
		);

		this.disposables = new DisposableStore();
		this.disposables.add(workbenchListOptionsDisposable);

		this.contextKeyService = createScopedContextKeyService(contextKeyService, this);

		this.disposables.add(createScrollObserver(this.contextKeyService, this.widget));

		this.horizontalScrolling = options.horizontalScrolling;

		this.listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(this.contextKeyService);
		this.listSupportsMultiSelect.set(options.multipleSelectionSupport !== false);

		const listSelectionNavigation = WorkbenchListSelectionNavigation.bindTo(this.contextKeyService);
		listSelectionNavigation.set(Boolean(options.selectionNavigation));

		this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);

		this.disposables.add(this.contextKeyService);
		this.disposables.add((listService as ListService).register(this));

		this.updateStyles(options.overrideStyles);

		this.disposables.add(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
				this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
			}

			let options: IListOptionsUpdate = {};

			if (e.affectsConfiguration(horizontalScrollingKey) && this.horizontalScrolling === undefined) {
				const horizontalScrolling = Boolean(configurationService.getValue(horizontalScrollingKey));
				options = { ...options, horizontalScrolling };
			}
			if (e.affectsConfiguration(scrollByPageKey)) {
				const scrollByPage = Boolean(configurationService.getValue(scrollByPageKey));
				options = { ...options, scrollByPage };
			}
			if (e.affectsConfiguration(listSmoothScrolling)) {
				const smoothScrolling = Boolean(configurationService.getValue(listSmoothScrolling));
				options = { ...options, smoothScrolling };
			}
			if (e.affectsConfiguration(mouseWheelScrollSensitivityKey)) {
				const mouseWheelScrollSensitivity = configurationService.getValue<number>(mouseWheelScrollSensitivityKey);
				options = { ...options, mouseWheelScrollSensitivity };
			}
			if (e.affectsConfiguration(fastScrollSensitivityKey)) {
				const fastScrollSensitivity = configurationService.getValue<number>(fastScrollSensitivityKey);
				options = { ...options, fastScrollSensitivity };
			}
			if (Object.keys(options).length > 0) {
				this.updateOptions(options);
			}
		}));

		this.navigator = new ListResourceNavigator(this, { configurationService, ...options });
		this.disposables.add(this.navigator);
	}

	override updateOptions(options: IWorkbenchListOptionsUpdate): void {
		super.updateOptions(options);

		if (options.overrideStyles !== undefined) {
			this.updateStyles(options.overrideStyles);
		}

		if (options.multipleSelectionSupport !== undefined) {
			this.listSupportsMultiSelect.set(!!options.multipleSelectionSupport);
		}
	}

	private updateStyles(styles: IStyleOverride<IListStyles> | undefined): void {
		this.style(styles ? getListStyles(styles) : defaultListStyles);
	}

	get useAltAsMultipleSelectionModifier(): boolean {
		return this._useAltAsMultipleSelectionModifier;
	}

	override dispose(): void {
		this.disposables.dispose();
		super.dispose();
	}
}

export interface IWorkbenchTableOptionsUpdate extends ITableOptionsUpdate {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
}

export interface IWorkbenchTableOptions<T> extends IWorkbenchTableOptionsUpdate, IResourceNavigatorOptions, ITableOptions<T> {
	readonly selectionNavigation?: boolean;
}

export class WorkbenchTable<TRow> extends Table<TRow> {

	readonly contextKeyService: IScopedContextKeyService;
	private listSupportsMultiSelect: IContextKey<boolean>;
	private listHasSelectionOrFocus: IContextKey<boolean>;
	private listDoubleSelection: IContextKey<boolean>;
	private listMultiSelection: IContextKey<boolean>;
	private horizontalScrolling: boolean | undefined;
	private _useAltAsMultipleSelectionModifier: boolean;
	private navigator: TableResourceNavigator<TRow>;
	get onDidOpen(): Event<IOpenEvent<TRow | undefined>> { return this.navigator.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: ITableVirtualDelegate<TRow>,
		columns: ITableColumn<TRow, any>[],
		renderers: ITableRenderer<TRow, any>[],
		options: IWorkbenchTableOptions<TRow>,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		const horizontalScrolling = typeof options.horizontalScrolling !== 'undefined' ? options.horizontalScrolling : Boolean(configurationService.getValue(horizontalScrollingKey));
		const [workbenchListOptions, workbenchListOptionsDisposable] = instantiationService.invokeFunction(toWorkbenchListOptions, options);

		super(user, container, delegate, columns, renderers,
			{
				keyboardSupport: false,
				...workbenchListOptions,
				horizontalScrolling,
			}
		);

		this.disposables.add(workbenchListOptionsDisposable);

		this.contextKeyService = createScopedContextKeyService(contextKeyService, this);

		this.disposables.add(createScrollObserver(this.contextKeyService, this));

		this.listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(this.contextKeyService);
		this.listSupportsMultiSelect.set(options.multipleSelectionSupport !== false);

		const listSelectionNavigation = WorkbenchListSelectionNavigation.bindTo(this.contextKeyService);
		listSelectionNavigation.set(Boolean(options.selectionNavigation));

		this.listHasSelectionOrFocus = WorkbenchListHasSelectionOrFocus.bindTo(this.contextKeyService);
		this.listDoubleSelection = WorkbenchListDoubleSelection.bindTo(this.contextKeyService);
		this.listMultiSelection = WorkbenchListMultiSelection.bindTo(this.contextKeyService);
		this.horizontalScrolling = options.horizontalScrolling;

		this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);

		this.disposables.add(this.contextKeyService);
		this.disposables.add((listService as ListService).register(this));

		this.updateStyles(options.overrideStyles);

		this.disposables.add(this.onDidChangeSelection(() => {
			const selection = this.getSelection();
			const focus = this.getFocus();

			this.contextKeyService.bufferChangeEvents(() => {
				this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
				this.listMultiSelection.set(selection.length > 1);
				this.listDoubleSelection.set(selection.length === 2);
			});
		}));
		this.disposables.add(this.onDidChangeFocus(() => {
			const selection = this.getSelection();
			const focus = this.getFocus();

			this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
		}));
		this.disposables.add(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
				this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
			}

			let options: IListOptionsUpdate = {};

			if (e.affectsConfiguration(horizontalScrollingKey) && this.horizontalScrolling === undefined) {
				const horizontalScrolling = Boolean(configurationService.getValue(horizontalScrollingKey));
				options = { ...options, horizontalScrolling };
			}
			if (e.affectsConfiguration(scrollByPageKey)) {
				const scrollByPage = Boolean(configurationService.getValue(scrollByPageKey));
				options = { ...options, scrollByPage };
			}
			if (e.affectsConfiguration(listSmoothScrolling)) {
				const smoothScrolling = Boolean(configurationService.getValue(listSmoothScrolling));
				options = { ...options, smoothScrolling };
			}
			if (e.affectsConfiguration(mouseWheelScrollSensitivityKey)) {
				const mouseWheelScrollSensitivity = configurationService.getValue<number>(mouseWheelScrollSensitivityKey);
				options = { ...options, mouseWheelScrollSensitivity };
			}
			if (e.affectsConfiguration(fastScrollSensitivityKey)) {
				const fastScrollSensitivity = configurationService.getValue<number>(fastScrollSensitivityKey);
				options = { ...options, fastScrollSensitivity };
			}
			if (Object.keys(options).length > 0) {
				this.updateOptions(options);
			}
		}));

		this.navigator = new TableResourceNavigator(this, { configurationService, ...options });
		this.disposables.add(this.navigator);
	}

	override updateOptions(options: IWorkbenchTableOptionsUpdate): void {
		super.updateOptions(options);

		if (options.overrideStyles !== undefined) {
			this.updateStyles(options.overrideStyles);
		}

		if (options.multipleSelectionSupport !== undefined) {
			this.listSupportsMultiSelect.set(!!options.multipleSelectionSupport);
		}
	}

	private updateStyles(styles: IStyleOverride<ITableStyles> | undefined): void {
		this.style(styles ? getListStyles(styles) : defaultListStyles);
	}

	get useAltAsMultipleSelectionModifier(): boolean {
		return this._useAltAsMultipleSelectionModifier;
	}

	override dispose(): void {
		this.disposables.dispose();
		super.dispose();
	}
}

export interface IOpenEvent<T> {
	editorOptions: IEditorOptions;
	sideBySide: boolean;
	element: T;
	browserEvent?: UIEvent;
}

export interface IResourceNavigatorOptions {
	readonly configurationService?: IConfigurationService;
	readonly openOnSingleClick?: boolean;
}

export interface SelectionKeyboardEvent extends KeyboardEvent {
	preserveFocus?: boolean;
	pinned?: boolean;
	__forceEvent?: boolean;
}

export function getSelectionKeyboardEvent(typeArg = 'keydown', preserveFocus?: boolean, pinned?: boolean): SelectionKeyboardEvent {
	const e = new KeyboardEvent(typeArg);
	(<SelectionKeyboardEvent>e).preserveFocus = preserveFocus;
	(<SelectionKeyboardEvent>e).pinned = pinned;
	(<SelectionKeyboardEvent>e).__forceEvent = true;

	return e;
}

abstract class ResourceNavigator<T> extends Disposable {

	private openOnSingleClick: boolean;

	private readonly _onDidOpen = this._register(new Emitter<IOpenEvent<T | undefined>>());
	readonly onDidOpen: Event<IOpenEvent<T | undefined>> = this._onDidOpen.event;

	constructor(
		protected readonly widget: ListWidget,
		options?: IResourceNavigatorOptions
	) {
		super();

		this._register(Event.filter(this.widget.onDidChangeSelection, e => isKeyboardEvent(e.browserEvent))(e => this.onSelectionFromKeyboard(e)));
		this._register(this.widget.onPointer((e: { browserEvent: MouseEvent; element: T | undefined }) => this.onPointer(e.element, e.browserEvent)));
		this._register(this.widget.onMouseDblClick((e: { browserEvent: MouseEvent; element: T | undefined }) => this.onMouseDblClick(e.element, e.browserEvent)));

		if (typeof options?.openOnSingleClick !== 'boolean' && options?.configurationService) {
			this.openOnSingleClick = options?.configurationService.getValue(openModeSettingKey) !== 'doubleClick';
			this._register(options?.configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(openModeSettingKey)) {
					this.openOnSingleClick = options?.configurationService!.getValue(openModeSettingKey) !== 'doubleClick';
				}
			}));
		} else {
			this.openOnSingleClick = options?.openOnSingleClick ?? true;
		}
	}

	private onSelectionFromKeyboard(event: ITreeEvent<any>): void {
		if (event.elements.length !== 1) {
			return;
		}

		const selectionKeyboardEvent = event.browserEvent as SelectionKeyboardEvent;
		const preserveFocus = typeof selectionKeyboardEvent.preserveFocus === 'boolean' ? selectionKeyboardEvent.preserveFocus : true;
		const pinned = typeof selectionKeyboardEvent.pinned === 'boolean' ? selectionKeyboardEvent.pinned : !preserveFocus;
		const sideBySide = false;

		this._open(this.getSelectedElement(), preserveFocus, pinned, sideBySide, event.browserEvent);
	}

	private onPointer(element: T | undefined, browserEvent: MouseEvent): void {
		if (!this.openOnSingleClick) {
			return;
		}

		const isDoubleClick = browserEvent.detail === 2;

		if (isDoubleClick) {
			return;
		}

		const isMiddleClick = browserEvent.button === 1;
		const preserveFocus = true;
		const pinned = isMiddleClick;
		const sideBySide = browserEvent.ctrlKey || browserEvent.metaKey || browserEvent.altKey;

		this._open(element, preserveFocus, pinned, sideBySide, browserEvent);
	}

	private onMouseDblClick(element: T | undefined, browserEvent?: MouseEvent): void {
		if (!browserEvent) {
			return;
		}

		// copied from AbstractTree
		const target = browserEvent.target as HTMLElement;
		const onTwistie = target.classList.contains('monaco-tl-twistie')
			|| (target.classList.contains('monaco-icon-label') && target.classList.contains('folder-icon') && browserEvent.offsetX < 16);

		if (onTwistie) {
			return;
		}

		const preserveFocus = false;
		const pinned = true;
		const sideBySide = (browserEvent.ctrlKey || browserEvent.metaKey || browserEvent.altKey);

		this._open(element, preserveFocus, pinned, sideBySide, browserEvent);
	}

	private _open(element: T | undefined, preserveFocus: boolean, pinned: boolean, sideBySide: boolean, browserEvent?: UIEvent): void {
		if (!element) {
			return;
		}

		this._onDidOpen.fire({
			editorOptions: {
				preserveFocus,
				pinned,
				revealIfVisible: true
			},
			sideBySide,
			element,
			browserEvent
		});
	}

	abstract getSelectedElement(): T | undefined;
}

class ListResourceNavigator<T> extends ResourceNavigator<T> {

	protected override readonly widget: List<T> | PagedList<T>;

	constructor(
		widget: List<T> | PagedList<T>,
		options: IResourceNavigatorOptions
	) {
		super(widget, options);
		this.widget = widget;
	}

	getSelectedElement(): T | undefined {
		return this.widget.getSelectedElements()[0];
	}
}

class TableResourceNavigator<TRow> extends ResourceNavigator<TRow> {

	protected declare readonly widget: Table<TRow>;

	constructor(
		widget: Table<TRow>,
		options: IResourceNavigatorOptions
	) {
		super(widget, options);
	}

	getSelectedElement(): TRow | undefined {
		return this.widget.getSelectedElements()[0];
	}
}

class TreeResourceNavigator<T, TFilterData> extends ResourceNavigator<T> {

	protected declare readonly widget: ObjectTree<T, TFilterData> | CompressibleObjectTree<T, TFilterData> | DataTree<any, T, TFilterData> | AsyncDataTree<any, T, TFilterData> | CompressibleAsyncDataTree<any, T, TFilterData>;

	constructor(
		widget: ObjectTree<T, TFilterData> | CompressibleObjectTree<T, TFilterData> | DataTree<any, T, TFilterData> | AsyncDataTree<any, T, TFilterData> | CompressibleAsyncDataTree<any, T, TFilterData>,
		options: IResourceNavigatorOptions
	) {
		super(widget, options);
	}

	getSelectedElement(): T | undefined {
		return this.widget.getSelection()[0] ?? undefined;
	}
}

function createKeyboardNavigationEventFilter(keybindingService: IKeybindingService): IKeyboardNavigationEventFilter {
	let inMultiChord = false;

	return event => {
		if (event.toKeyCodeChord().isModifierKey()) {
			return false;
		}

		if (inMultiChord) {
			inMultiChord = false;
			return false;
		}

		const result = keybindingService.softDispatch(event, event.target);

		if (result.kind === ResultKind.MoreChordsNeeded) {
			inMultiChord = true;
			return false;
		}

		inMultiChord = false;
		return result.kind === ResultKind.NoMatchingKb;
	};
}

export interface IWorkbenchObjectTreeOptions<T, TFilterData> extends IObjectTreeOptions<T, TFilterData>, IResourceNavigatorOptions {
	readonly accessibilityProvider: IListAccessibilityProvider<T>;
	readonly overrideStyles?: IStyleOverride<IListStyles>;
	readonly selectionNavigation?: boolean;
	readonly scrollToActiveElement?: boolean;
}

export class WorkbenchObjectTree<T extends NonNullable<any>, TFilterData = void> extends ObjectTree<T, TFilterData> {

	private internals: WorkbenchTreeInternals<any, T, TFilterData>;
	get contextKeyService(): IContextKeyService { return this.internals.contextKeyService; }
	get useAltAsMultipleSelectionModifier(): boolean { return this.internals.useAltAsMultipleSelectionModifier; }
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.internals.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, any>[],
		options: IWorkbenchObjectTreeOptions<T, TFilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		// eslint-disable-next-line local/code-no-any-casts
		const { options: treeOptions, getTypeNavigationMode, disposable } = instantiationService.invokeFunction(workbenchTreeDataPreamble, options as any);
		super(user, container, delegate, renderers, treeOptions);
		this.disposables.add(disposable);
		this.internals = new WorkbenchTreeInternals(this, options, getTypeNavigationMode, options.overrideStyles, contextKeyService, listService, configurationService);
		this.disposables.add(this.internals);
	}

	override updateOptions(options: IAbstractTreeOptionsUpdate<T | null>): void {
		super.updateOptions(options);
		this.internals.updateOptions(options);
	}
}

export interface IWorkbenchCompressibleObjectTreeOptionsUpdate<T> extends ICompressibleObjectTreeOptionsUpdate<T> {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
}

export interface IWorkbenchCompressibleObjectTreeOptions<T, TFilterData> extends IWorkbenchCompressibleObjectTreeOptionsUpdate<T>, ICompressibleObjectTreeOptions<T, TFilterData>, IResourceNavigatorOptions {
	readonly accessibilityProvider: IListAccessibilityProvider<T>;
	readonly selectionNavigation?: boolean;
}

export class WorkbenchCompressibleObjectTree<T extends NonNullable<any>, TFilterData = void> extends CompressibleObjectTree<T, TFilterData> {

	private internals: WorkbenchTreeInternals<any, T, TFilterData>;
	get contextKeyService(): IContextKeyService { return this.internals.contextKeyService; }
	get useAltAsMultipleSelectionModifier(): boolean { return this.internals.useAltAsMultipleSelectionModifier; }
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.internals.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ICompressibleTreeRenderer<T, TFilterData, any>[],
		options: IWorkbenchCompressibleObjectTreeOptions<T, TFilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		// eslint-disable-next-line local/code-no-any-casts
		const { options: treeOptions, getTypeNavigationMode, disposable } = instantiationService.invokeFunction(workbenchTreeDataPreamble, options as any);
		super(user, container, delegate, renderers, treeOptions);
		this.disposables.add(disposable);
		this.internals = new WorkbenchTreeInternals(this, options, getTypeNavigationMode, options.overrideStyles, contextKeyService, listService, configurationService);
		this.disposables.add(this.internals);
	}

	override updateOptions(options: IWorkbenchCompressibleObjectTreeOptionsUpdate<T | null> = {}): void {
		super.updateOptions(options);

		if (options.overrideStyles) {
			this.internals.updateStyleOverrides(options.overrideStyles);
		}

		this.internals.updateOptions(options);
	}
}

export interface IWorkbenchDataTreeOptionsUpdate<T> extends IAbstractTreeOptionsUpdate<T> {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
}

export interface IWorkbenchDataTreeOptions<T, TFilterData> extends IWorkbenchDataTreeOptionsUpdate<T>, IDataTreeOptions<T, TFilterData>, IResourceNavigatorOptions {
	readonly accessibilityProvider: IListAccessibilityProvider<T>;
	readonly selectionNavigation?: boolean;
}

export class WorkbenchDataTree<TInput, T, TFilterData = void> extends DataTree<TInput, T, TFilterData> {

	private internals: WorkbenchTreeInternals<TInput, T, TFilterData>;
	get contextKeyService(): IContextKeyService { return this.internals.contextKeyService; }
	get useAltAsMultipleSelectionModifier(): boolean { return this.internals.useAltAsMultipleSelectionModifier; }
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.internals.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, any>[],
		dataSource: IDataSource<TInput, T>,
		options: IWorkbenchDataTreeOptions<T, TFilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		// eslint-disable-next-line local/code-no-any-casts
		const { options: treeOptions, getTypeNavigationMode, disposable } = instantiationService.invokeFunction(workbenchTreeDataPreamble, options as any);
		super(user, container, delegate, renderers, dataSource, treeOptions);
		this.disposables.add(disposable);
		this.internals = new WorkbenchTreeInternals(this, options, getTypeNavigationMode, options.overrideStyles, contextKeyService, listService, configurationService);
		this.disposables.add(this.internals);
	}

	override updateOptions(options: IWorkbenchDataTreeOptionsUpdate<T | null> = {}): void {
		super.updateOptions(options);

		if (options.overrideStyles !== undefined) {
			this.internals.updateStyleOverrides(options.overrideStyles);
		}

		this.internals.updateOptions(options);
	}
}

export interface IWorkbenchAsyncDataTreeOptionsUpdate<T> extends IAsyncDataTreeOptionsUpdate<T> {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
}

export interface IWorkbenchAsyncDataTreeOptions<T, TFilterData> extends IWorkbenchAsyncDataTreeOptionsUpdate<T>, IAsyncDataTreeOptions<T, TFilterData>, IResourceNavigatorOptions {
	readonly accessibilityProvider: IListAccessibilityProvider<T>;
	readonly selectionNavigation?: boolean;
}

export class WorkbenchAsyncDataTree<TInput, T, TFilterData = void> extends AsyncDataTree<TInput, T, TFilterData> {

	private internals: WorkbenchTreeInternals<TInput, T, TFilterData>;
	get contextKeyService(): IContextKeyService { return this.internals.contextKeyService; }
	get useAltAsMultipleSelectionModifier(): boolean { return this.internals.useAltAsMultipleSelectionModifier; }
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.internals.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, any>[],
		dataSource: IAsyncDataSource<TInput, T>,
		options: IWorkbenchAsyncDataTreeOptions<T, TFilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		// eslint-disable-next-line local/code-no-any-casts
		const { options: treeOptions, getTypeNavigationMode, disposable } = instantiationService.invokeFunction(workbenchTreeDataPreamble, options as any);
		super(user, container, delegate, renderers, dataSource, treeOptions);
		this.disposables.add(disposable);
		this.internals = new WorkbenchTreeInternals(this, options, getTypeNavigationMode, options.overrideStyles, contextKeyService, listService, configurationService);
		this.disposables.add(this.internals);
	}

	override updateOptions(options: IWorkbenchAsyncDataTreeOptionsUpdate<IAsyncDataTreeNode<TInput, T> | null> = {}): void {
		super.updateOptions(options);

		if (options.overrideStyles) {
			this.internals.updateStyleOverrides(options.overrideStyles);
		}

		this.internals.updateOptions(options);
	}
}

export interface IWorkbenchCompressibleAsyncDataTreeOptions<T, TFilterData> extends ICompressibleAsyncDataTreeOptions<T, TFilterData>, IResourceNavigatorOptions {
	readonly accessibilityProvider: IListAccessibilityProvider<T>;
	readonly overrideStyles?: IStyleOverride<IListStyles>;
	readonly selectionNavigation?: boolean;
}

export class WorkbenchCompressibleAsyncDataTree<TInput, T, TFilterData = void> extends CompressibleAsyncDataTree<TInput, T, TFilterData> {

	private internals: WorkbenchTreeInternals<TInput, T, TFilterData>;
	get contextKeyService(): IContextKeyService { return this.internals.contextKeyService; }
	get useAltAsMultipleSelectionModifier(): boolean { return this.internals.useAltAsMultipleSelectionModifier; }
	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.internals.onDidOpen; }

	constructor(
		user: string,
		container: HTMLElement,
		virtualDelegate: IListVirtualDelegate<T>,
		compressionDelegate: ITreeCompressionDelegate<T>,
		renderers: ICompressibleTreeRenderer<T, TFilterData, any>[],
		dataSource: IAsyncDataSource<TInput, T>,
		options: IWorkbenchCompressibleAsyncDataTreeOptions<T, TFilterData>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		// eslint-disable-next-line local/code-no-any-casts
		const { options: treeOptions, getTypeNavigationMode, disposable } = instantiationService.invokeFunction(workbenchTreeDataPreamble, options as any);
		super(user, container, virtualDelegate, compressionDelegate, renderers, dataSource, treeOptions);
		this.disposables.add(disposable);
		this.internals = new WorkbenchTreeInternals(this, options, getTypeNavigationMode, options.overrideStyles, contextKeyService, listService, configurationService);
		this.disposables.add(this.internals);
	}

	override updateOptions(options: ICompressibleAsyncDataTreeOptionsUpdate<IAsyncDataTreeNode<TInput, T> | null>): void {
		super.updateOptions(options);
		this.internals.updateOptions(options);
	}
}

function getDefaultTreeFindMode(configurationService: IConfigurationService) {
	const value = configurationService.getValue<'highlight' | 'filter'>(defaultFindModeSettingKey);

	if (value === 'highlight') {
		return TreeFindMode.Highlight;
	} else if (value === 'filter') {
		return TreeFindMode.Filter;
	}

	const deprecatedValue = configurationService.getValue<'simple' | 'highlight' | 'filter'>(keyboardNavigationSettingKey);

	if (deprecatedValue === 'simple' || deprecatedValue === 'highlight') {
		return TreeFindMode.Highlight;
	} else if (deprecatedValue === 'filter') {
		return TreeFindMode.Filter;
	}

	return undefined;
}

function getDefaultTreeFindMatchType(configurationService: IConfigurationService) {
	const value = configurationService.getValue<'fuzzy' | 'contiguous'>(defaultFindMatchTypeSettingKey);

	if (value === 'fuzzy') {
		return TreeFindMatchType.Fuzzy;
	} else if (value === 'contiguous') {
		return TreeFindMatchType.Contiguous;
	}
	return undefined;
}

function workbenchTreeDataPreamble<T, TFilterData, TOptions extends IAbstractTreeOptions<T, TFilterData> | IAsyncDataTreeOptions<T, TFilterData>>(
	accessor: ServicesAccessor,
	options: TOptions,
): { options: TOptions; getTypeNavigationMode: () => TypeNavigationMode | undefined; disposable: IDisposable } {
	const configurationService = accessor.get(IConfigurationService);
	const contextViewService = accessor.get(IContextViewService);
	const contextKeyService = accessor.get(IContextKeyService);
	const instantiationService = accessor.get(IInstantiationService);

	const getTypeNavigationMode = () => {
		// give priority to the context key value to specify a value
		const modeString = contextKeyService.getContextKeyValue<'automatic' | 'trigger'>(WorkbenchListTypeNavigationModeKey);

		if (modeString === 'automatic') {
			return TypeNavigationMode.Automatic;
		} else if (modeString === 'trigger') {
			return TypeNavigationMode.Trigger;
		}

		// also check the deprecated context key to set the mode to 'trigger'
		const modeBoolean = contextKeyService.getContextKeyValue<boolean>(WorkbenchListAutomaticKeyboardNavigationLegacyKey);

		if (modeBoolean === false) {
			return TypeNavigationMode.Trigger;
		}

		// finally, check the setting
		const configString = configurationService.getValue<'automatic' | 'trigger'>(typeNavigationModeSettingKey);

		if (configString === 'automatic') {
			return TypeNavigationMode.Automatic;
		} else if (configString === 'trigger') {
			return TypeNavigationMode.Trigger;
		}

		return undefined;
	};

	const horizontalScrolling = options.horizontalScrolling !== undefined ? options.horizontalScrolling : Boolean(configurationService.getValue(horizontalScrollingKey));
	const [workbenchListOptions, disposable] = instantiationService.invokeFunction(toWorkbenchListOptions, options);
	const paddingBottom = options.paddingBottom;
	const renderIndentGuides = options.renderIndentGuides !== undefined ? options.renderIndentGuides : configurationService.getValue<RenderIndentGuides>(treeRenderIndentGuidesKey);

	return {
		getTypeNavigationMode,
		disposable,
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		options: {
			// ...options, // TODO@Joao why is this not splatted here?
			keyboardSupport: false,
			...workbenchListOptions,
			indent: typeof configurationService.getValue(treeIndentKey) === 'number' ? configurationService.getValue(treeIndentKey) : undefined,
			renderIndentGuides,
			smoothScrolling: Boolean(configurationService.getValue(listSmoothScrolling)),
			defaultFindMode: options.defaultFindMode ?? getDefaultTreeFindMode(configurationService),
			defaultFindMatchType: options.defaultFindMatchType ?? getDefaultTreeFindMatchType(configurationService),
			horizontalScrolling,
			scrollByPage: Boolean(configurationService.getValue(scrollByPageKey)),
			paddingBottom: paddingBottom,
			hideTwistiesOfChildlessElements: options.hideTwistiesOfChildlessElements,
			expandOnlyOnTwistieClick: options.expandOnlyOnTwistieClick ?? (configurationService.getValue<'singleClick' | 'doubleClick'>(treeExpandMode) === 'doubleClick'),
			contextViewProvider: contextViewService as IContextViewProvider,
			findWidgetStyles: defaultFindWidgetStyles,
			enableStickyScroll: Boolean(configurationService.getValue(treeStickyScroll)),
			stickyScrollMaxItemCount: Number(configurationService.getValue(treeStickyScrollMaxElements)),
		} as TOptions
	};
}

interface IWorkbenchTreeInternalsOptionsUpdate {
	readonly multipleSelectionSupport?: boolean;
}

class WorkbenchTreeInternals<TInput, T, TFilterData> {

	readonly contextKeyService: IScopedContextKeyService;
	private listSupportsMultiSelect: IContextKey<boolean>;
	private listSupportFindWidget: IContextKey<boolean>;
	private hasSelectionOrFocus: IContextKey<boolean>;
	private hasDoubleSelection: IContextKey<boolean>;
	private hasMultiSelection: IContextKey<boolean>;
	private treeElementCanCollapse: IContextKey<boolean>;
	private treeElementHasParent: IContextKey<boolean>;
	private treeElementCanExpand: IContextKey<boolean>;
	private treeElementHasChild: IContextKey<boolean>;
	private treeFindOpen: IContextKey<boolean>;
	private treeStickyScrollFocused: IContextKey<boolean>;
	private _useAltAsMultipleSelectionModifier: boolean;
	private disposables: IDisposable[] = [];

	private navigator: TreeResourceNavigator<T, TFilterData>;

	get onDidOpen(): Event<IOpenEvent<T | undefined>> { return this.navigator.onDidOpen; }

	constructor(
		private tree: WorkbenchObjectTree<T, TFilterData> | WorkbenchCompressibleObjectTree<T, TFilterData> | WorkbenchDataTree<TInput, T, TFilterData> | WorkbenchAsyncDataTree<TInput, T, TFilterData> | WorkbenchCompressibleAsyncDataTree<TInput, T, TFilterData>,
		options: IWorkbenchObjectTreeOptions<T, TFilterData> | IWorkbenchCompressibleObjectTreeOptions<T, TFilterData> | IWorkbenchDataTreeOptions<T, TFilterData> | IWorkbenchAsyncDataTreeOptions<T, TFilterData> | IWorkbenchCompressibleAsyncDataTreeOptions<T, TFilterData>,
		getTypeNavigationMode: () => TypeNavigationMode | undefined,
		overrideStyles: IStyleOverride<IListStyles> | undefined,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		this.contextKeyService = createScopedContextKeyService(contextKeyService, tree);

		this.disposables.push(createScrollObserver(this.contextKeyService, tree));

		this.listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(this.contextKeyService);
		this.listSupportsMultiSelect.set(options.multipleSelectionSupport !== false);

		const listSelectionNavigation = WorkbenchListSelectionNavigation.bindTo(this.contextKeyService);
		listSelectionNavigation.set(Boolean(options.selectionNavigation));

		this.listSupportFindWidget = WorkbenchListSupportsFind.bindTo(this.contextKeyService);
		this.listSupportFindWidget.set(options.findWidgetEnabled ?? true);

		this.hasSelectionOrFocus = WorkbenchListHasSelectionOrFocus.bindTo(this.contextKeyService);
		this.hasDoubleSelection = WorkbenchListDoubleSelection.bindTo(this.contextKeyService);
		this.hasMultiSelection = WorkbenchListMultiSelection.bindTo(this.contextKeyService);

		this.treeElementCanCollapse = WorkbenchTreeElementCanCollapse.bindTo(this.contextKeyService);
		this.treeElementHasParent = WorkbenchTreeElementHasParent.bindTo(this.contextKeyService);
		this.treeElementCanExpand = WorkbenchTreeElementCanExpand.bindTo(this.contextKeyService);
		this.treeElementHasChild = WorkbenchTreeElementHasChild.bindTo(this.contextKeyService);

		this.treeFindOpen = WorkbenchTreeFindOpen.bindTo(this.contextKeyService);
		this.treeStickyScrollFocused = WorkbenchTreeStickyScrollFocused.bindTo(this.contextKeyService);

		this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);

		this.updateStyleOverrides(overrideStyles);

		const updateCollapseContextKeys = () => {
			const focus = tree.getFocus()[0];

			if (!focus) {
				return;
			}

			const node = tree.getNode(focus);
			this.treeElementCanCollapse.set(node.collapsible && !node.collapsed);
			this.treeElementHasParent.set(!!tree.getParentElement(focus));
			this.treeElementCanExpand.set(node.collapsible && node.collapsed);
			this.treeElementHasChild.set(!!tree.getFirstElementChild(focus));
		};

		const interestingContextKeys = new Set();
		interestingContextKeys.add(WorkbenchListTypeNavigationModeKey);
		interestingContextKeys.add(WorkbenchListAutomaticKeyboardNavigationLegacyKey);

		this.disposables.push(
			this.contextKeyService,
			(listService as ListService).register(tree),
			tree.onDidChangeSelection(() => {
				const selection = tree.getSelection();
				const focus = tree.getFocus();

				this.contextKeyService.bufferChangeEvents(() => {
					this.hasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
					this.hasMultiSelection.set(selection.length > 1);
					this.hasDoubleSelection.set(selection.length === 2);
				});
			}),
			tree.onDidChangeFocus(() => {
				const selection = tree.getSelection();
				const focus = tree.getFocus();

				this.hasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
				updateCollapseContextKeys();
			}),
			tree.onDidChangeCollapseState(updateCollapseContextKeys),
			tree.onDidChangeModel(updateCollapseContextKeys),
			tree.onDidChangeFindOpenState(enabled => this.treeFindOpen.set(enabled)),
			tree.onDidChangeStickyScrollFocused(focused => this.treeStickyScrollFocused.set(focused)),
			configurationService.onDidChangeConfiguration(e => {
				let newOptions: IAbstractTreeOptionsUpdate<unknown> = {};
				if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
					this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
				}
				if (e.affectsConfiguration(treeIndentKey)) {
					const indent = configurationService.getValue<number>(treeIndentKey);
					newOptions = { ...newOptions, indent };
				}
				if (e.affectsConfiguration(treeRenderIndentGuidesKey) && options.renderIndentGuides === undefined) {
					const renderIndentGuides = configurationService.getValue<RenderIndentGuides>(treeRenderIndentGuidesKey);
					newOptions = { ...newOptions, renderIndentGuides };
				}
				if (e.affectsConfiguration(listSmoothScrolling)) {
					const smoothScrolling = Boolean(configurationService.getValue(listSmoothScrolling));
					newOptions = { ...newOptions, smoothScrolling };
				}
				if (e.affectsConfiguration(defaultFindModeSettingKey) || e.affectsConfiguration(keyboardNavigationSettingKey)) {
					const defaultFindMode = getDefaultTreeFindMode(configurationService);
					newOptions = { ...newOptions, defaultFindMode };
				}
				if (e.affectsConfiguration(typeNavigationModeSettingKey) || e.affectsConfiguration(keyboardNavigationSettingKey)) {
					const typeNavigationMode = getTypeNavigationMode();
					newOptions = { ...newOptions, typeNavigationMode };
				}
				if (e.affectsConfiguration(defaultFindMatchTypeSettingKey)) {
					const defaultFindMatchType = getDefaultTreeFindMatchType(configurationService);
					newOptions = { ...newOptions, defaultFindMatchType };
				}
				if (e.affectsConfiguration(horizontalScrollingKey) && options.horizontalScrolling === undefined) {
					const horizontalScrolling = Boolean(configurationService.getValue(horizontalScrollingKey));
					newOptions = { ...newOptions, horizontalScrolling };
				}
				if (e.affectsConfiguration(scrollByPageKey)) {
					const scrollByPage = Boolean(configurationService.getValue(scrollByPageKey));
					newOptions = { ...newOptions, scrollByPage };
				}
				if (e.affectsConfiguration(treeExpandMode) && options.expandOnlyOnTwistieClick === undefined) {
					newOptions = { ...newOptions, expandOnlyOnTwistieClick: configurationService.getValue<'singleClick' | 'doubleClick'>(treeExpandMode) === 'doubleClick' };
				}
				if (e.affectsConfiguration(treeStickyScroll)) {
					const enableStickyScroll = configurationService.getValue<boolean>(treeStickyScroll);
					newOptions = { ...newOptions, enableStickyScroll };
				}
				if (e.affectsConfiguration(treeStickyScrollMaxElements)) {
					const stickyScrollMaxItemCount = Math.max(1, configurationService.getValue<number>(treeStickyScrollMaxElements));
					newOptions = { ...newOptions, stickyScrollMaxItemCount };
				}
				if (e.affectsConfiguration(mouseWheelScrollSensitivityKey)) {
					const mouseWheelScrollSensitivity = configurationService.getValue<number>(mouseWheelScrollSensitivityKey);
					newOptions = { ...newOptions, mouseWheelScrollSensitivity };
				}
				if (e.affectsConfiguration(fastScrollSensitivityKey)) {
					const fastScrollSensitivity = configurationService.getValue<number>(fastScrollSensitivityKey);
					newOptions = { ...newOptions, fastScrollSensitivity };
				}
				if (Object.keys(newOptions).length > 0) {
					tree.updateOptions(newOptions);
				}
			}),
			this.contextKeyService.onDidChangeContext(e => {
				if (e.affectsSome(interestingContextKeys)) {
					tree.updateOptions({ typeNavigationMode: getTypeNavigationMode() });
				}
			})
		);

		this.navigator = new TreeResourceNavigator(tree, { configurationService, ...options });
		this.disposables.push(this.navigator);
	}

	get useAltAsMultipleSelectionModifier(): boolean {
		return this._useAltAsMultipleSelectionModifier;
	}

	updateOptions(options: IWorkbenchTreeInternalsOptionsUpdate): void {
		if (options.multipleSelectionSupport !== undefined) {
			this.listSupportsMultiSelect.set(!!options.multipleSelectionSupport);
		}
	}

	updateStyleOverrides(overrideStyles?: IStyleOverride<IListStyles>): void {
		this.tree.style(overrideStyles ? getListStyles(overrideStyles) : defaultListStyles);
	}

	dispose(): void {
		this.disposables = dispose(this.disposables);
	}
}

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

configurationRegistry.registerConfiguration({
	id: 'workbench',
	order: 7,
	title: localize('workbenchConfigurationTitle', "Workbench"),
	type: 'object',
	properties: {
		[multiSelectModifierSettingKey]: {
			type: 'string',
			enum: ['ctrlCmd', 'alt'],
			markdownEnumDescriptions: [
				localize('multiSelectModifier.ctrlCmd', "Maps to `Control` on Windows and Linux and to `Command` on macOS."),
				localize('multiSelectModifier.alt', "Maps to `Alt` on Windows and Linux and to `Option` on macOS.")
			],
			default: 'ctrlCmd',
			description: localize({
				key: 'multiSelectModifier',
				comment: [
					'- `ctrlCmd` refers to a value the setting can take and should not be localized.',
					'- `Control` and `Command` refer to the modifier keys Ctrl or Cmd on the keyboard and can be localized.'
				]
			}, "The modifier to be used to add an item in trees and lists to a multi-selection with the mouse (for example in the explorer, open editors and scm view). The 'Open to Side' mouse gestures - if supported - will adapt such that they do not conflict with the multiselect modifier.")
		},
		[openModeSettingKey]: {
			type: 'string',
			enum: ['singleClick', 'doubleClick'],
			default: 'singleClick',
			description: localize({
				key: 'openModeModifier',
				comment: ['`singleClick` and `doubleClick` refers to a value the setting can take and should not be localized.']
			}, "Controls how to open items in trees and lists using the mouse (if supported). Note that some trees and lists might choose to ignore this setting if it is not applicable.")
		},
		[horizontalScrollingKey]: {
			type: 'boolean',
			default: false,
			description: localize('horizontalScrolling setting', "Controls whether lists and trees support horizontal scrolling in the workbench. Warning: turning on this setting has a performance implication.")
		},
		[scrollByPageKey]: {
			type: 'boolean',
			default: false,
			description: localize('list.scrollByPage', "Controls whether clicks in the scrollbar scroll page by page.")
		},
		[treeIndentKey]: {
			type: 'number',
			default: 8,
			minimum: 4,
			maximum: 40,
			description: localize('tree indent setting', "Controls tree indentation in pixels.")
		},
		[treeRenderIndentGuidesKey]: {
			type: 'string',
			enum: ['none', 'onHover', 'always'],
			default: 'onHover',
			description: localize('render tree indent guides', "Controls whether the tree should render indent guides.")
		},
		[listSmoothScrolling]: {
			type: 'boolean',
			default: false,
			description: localize('list smoothScrolling setting', "Controls whether lists and trees have smooth scrolling."),
		},
		[mouseWheelScrollSensitivityKey]: {
			type: 'number',
			default: 1,
			markdownDescription: localize('Mouse Wheel Scroll Sensitivity', "A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.")
		},
		[fastScrollSensitivityKey]: {
			type: 'number',
			default: 5,
			markdownDescription: localize('Fast Scroll Sensitivity', "Scrolling speed multiplier when pressing `Alt`.")
		},
		[defaultFindModeSettingKey]: {
			type: 'string',
			enum: ['highlight', 'filter'],
			enumDescriptions: [
				localize('defaultFindModeSettingKey.highlight', "Highlight elements when searching. Further up and down navigation will traverse only the highlighted elements."),
				localize('defaultFindModeSettingKey.filter', "Filter elements when searching.")
			],
			default: 'highlight',
			description: localize('defaultFindModeSettingKey', "Controls the default find mode for lists and trees in the workbench.")
		},
		[keyboardNavigationSettingKey]: {
			type: 'string',
			enum: ['simple', 'highlight', 'filter'],
			enumDescriptions: [
				localize('keyboardNavigationSettingKey.simple', "Simple keyboard navigation focuses elements which match the keyboard input. Matching is done only on prefixes."),
				localize('keyboardNavigationSettingKey.highlight', "Highlight keyboard navigation highlights elements which match the keyboard input. Further up and down navigation will traverse only the highlighted elements."),
				localize('keyboardNavigationSettingKey.filter', "Filter keyboard navigation will filter out and hide all the elements which do not match the keyboard input.")
			],
			default: 'highlight',
			description: localize('keyboardNavigationSettingKey', "Controls the keyboard navigation style for lists and trees in the workbench. Can be simple, highlight and filter."),
			deprecated: true,
			deprecationMessage: localize('keyboardNavigationSettingKeyDeprecated', "Please use 'workbench.list.defaultFindMode' and	'workbench.list.typeNavigationMode' instead.")
		},
		[defaultFindMatchTypeSettingKey]: {
			type: 'string',
			enum: ['fuzzy', 'contiguous'],
			enumDescriptions: [
				localize('defaultFindMatchTypeSettingKey.fuzzy', "Use fuzzy matching when searching."),
				localize('defaultFindMatchTypeSettingKey.contiguous', "Use contiguous matching when searching.")
			],
			default: 'fuzzy',
			description: localize('defaultFindMatchTypeSettingKey', "Controls the type of matching used when searching lists and trees in the workbench.")
		},
		[treeExpandMode]: {
			type: 'string',
			enum: ['singleClick', 'doubleClick'],
			default: 'singleClick',
			description: localize('expand mode', "Controls how tree folders are expanded when clicking the folder names. Note that some trees and lists might choose to ignore this setting if it is not applicable."),
		},
		[treeStickyScroll]: {
			type: 'boolean',
			default: true,
			description: localize('sticky scroll', "Controls whether sticky scrolling is enabled in trees."),
		},
		[treeStickyScrollMaxElements]: {
			type: 'number',
			minimum: 1,
			default: 7,
			markdownDescription: localize('sticky scroll maximum items', "Controls the number of sticky elements displayed in the tree when {0} is enabled.", '`#workbench.tree.enableStickyScroll#`'),
		},
		[typeNavigationModeSettingKey]: {
			type: 'string',
			enum: ['automatic', 'trigger'],
			default: 'automatic',
			markdownDescription: localize('typeNavigationMode2', "Controls how type navigation works in lists and trees in the workbench. When set to `trigger`, type navigation begins once the `list.triggerTypeNavigation` command is run."),
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/browser/log.ts]---
Location: vscode-main/src/vs/platform/log/browser/log.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../base/browser/window.js';
import { relativePath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { AdapterLogger, DEFAULT_LOG_LEVEL, ILogger, LogLevel } from '../common/log.js';

export interface IAutomatedWindow {
	codeAutomationLog(type: string, args: any[]): void;
	codeAutomationExit(code: number, logs: Array<ILogFile>): void;
}

export interface ILogFile {
	readonly relativePath: string;
	readonly contents: string;
}

/**
 * Only used in browser contexts where the log files are not stored on disk
 * but in IndexedDB. A method to get all logs with their contents so that
 * CI automation can persist them.
 */
export async function getLogs(fileService: IFileService, environmentService: IEnvironmentService): Promise<ILogFile[]> {
	const result: ILogFile[] = [];

	await doGetLogs(fileService, result, environmentService.logsHome, environmentService.logsHome);

	return result;
}

async function doGetLogs(fileService: IFileService, logs: ILogFile[], curFolder: URI, logsHome: URI): Promise<void> {
	const stat = await fileService.resolve(curFolder);

	for (const { resource, isDirectory } of stat.children || []) {
		if (isDirectory) {
			await doGetLogs(fileService, logs, resource, logsHome);
		} else {
			const contents = (await fileService.readFile(resource)).value.toString();
			if (contents) {
				const path = relativePath(logsHome, resource);
				if (path) {
					logs.push({ relativePath: path, contents });
				}
			}
		}
	}
}

function logLevelToString(level: LogLevel): string {
	switch (level) {
		case LogLevel.Trace: return 'trace';
		case LogLevel.Debug: return 'debug';
		case LogLevel.Info: return 'info';
		case LogLevel.Warning: return 'warn';
		case LogLevel.Error: return 'error';
	}
	return 'info';
}

/**
 * A logger that is used when VSCode is running in the web with
 * an automation such as playwright. We expect a global codeAutomationLog
 * to be defined that we can use to log to.
 */
export class ConsoleLogInAutomationLogger extends AdapterLogger implements ILogger {

	declare codeAutomationLog: any;

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super({ log: (level, args) => this.consoleLog(logLevelToString(level), args) }, logLevel);
	}

	private consoleLog(type: string, args: any[]): void {
		const automatedWindow = mainWindow as unknown as IAutomatedWindow;
		if (typeof automatedWindow.codeAutomationLog === 'function') {
			try {
				automatedWindow.codeAutomationLog(type, args);
			} catch (err) {
				// see https://github.com/microsoft/vscode-test-web/issues/69
				console.error('Problems writing to codeAutomationLog', err);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/common/bufferLog.ts]---
Location: vscode-main/src/vs/platform/log/common/bufferLog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MutableDisposable } from '../../../base/common/lifecycle.js';
import { AbstractMessageLogger, DEFAULT_LOG_LEVEL, ILogger, log, LogLevel } from './log.js';

interface ILog {
	level: LogLevel;
	message: string;
}

export class BufferLogger extends AbstractMessageLogger {

	declare readonly _serviceBrand: undefined;
	private buffer: ILog[] = [];
	private _logger: ILogger | undefined = undefined;
	private readonly _logLevelDisposable = this._register(new MutableDisposable());

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
	}

	set logger(logger: ILogger) {
		this._logger = logger;
		this.setLevel(logger.getLevel());
		this._logLevelDisposable.value = logger.onDidChangeLogLevel(this.setLevel, this);

		for (const { level, message } of this.buffer) {
			log(logger, level, message);
		}

		this.buffer = [];
	}

	protected log(level: LogLevel, message: string): void {
		if (this._logger) {
			log(this._logger, level, message);
		} else if (this.getLevel() <= level) {
			this.buffer.push({ level, message });
		}
	}

	override dispose(): void {
		this._logger?.dispose();
		super.dispose();
	}

	override flush(): void {
		this._logger?.flush();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/common/fileLog.ts]---
Location: vscode-main/src/vs/platform/log/common/fileLog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { basename, dirname, joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ByteSize, FileOperationError, FileOperationResult, IFileService, whenProviderRegistered } from '../../files/common/files.js';
import { BufferLogger } from './bufferLog.js';
import { AbstractLoggerService, AbstractMessageLogger, ILogger, ILoggerOptions, ILoggerService, LogLevel } from './log.js';

const MAX_FILE_SIZE = 5 * ByteSize.MB;

class FileLogger extends AbstractMessageLogger implements ILogger {

	private readonly initializePromise: Promise<void>;
	private readonly flushDelayer: ThrottledDelayer<void>;
	private backupIndex: number = 1;
	private buffer: string = '';

	constructor(
		private readonly resource: URI,
		level: LogLevel,
		private readonly donotUseFormatters: boolean,
		@IFileService private readonly fileService: IFileService
	) {
		super();
		this.setLevel(level);
		this.flushDelayer = new ThrottledDelayer<void>(100 /* buffer saves over a short time */);
		this.initializePromise = this.initialize();
	}

	override async flush(): Promise<void> {
		if (!this.buffer) {
			return;
		}
		await this.initializePromise;
		let content = await this.loadContent();
		if (content.length > MAX_FILE_SIZE) {
			await this.fileService.writeFile(this.getBackupResource(), VSBuffer.fromString(content));
			content = '';
		}
		if (this.buffer) {
			content += this.buffer;
			this.buffer = '';
			await this.fileService.writeFile(this.resource, VSBuffer.fromString(content));
		}
	}

	private async initialize(): Promise<void> {
		try {
			await this.fileService.createFile(this.resource);
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_MODIFIED_SINCE) {
				throw error;
			}
		}
	}

	protected log(level: LogLevel, message: string): void {
		if (this.donotUseFormatters) {
			this.buffer += message;
		} else {
			this.buffer += `${this.getCurrentTimestamp()} [${this.stringifyLogLevel(level)}] ${message}\n`;
		}
		this.flushDelayer.trigger(() => this.flush());
	}

	private getCurrentTimestamp(): string {
		const toTwoDigits = (v: number) => v < 10 ? `0${v}` : v;
		const toThreeDigits = (v: number) => v < 10 ? `00${v}` : v < 100 ? `0${v}` : v;
		const currentTime = new Date();
		return `${currentTime.getFullYear()}-${toTwoDigits(currentTime.getMonth() + 1)}-${toTwoDigits(currentTime.getDate())} ${toTwoDigits(currentTime.getHours())}:${toTwoDigits(currentTime.getMinutes())}:${toTwoDigits(currentTime.getSeconds())}.${toThreeDigits(currentTime.getMilliseconds())}`;
	}

	private getBackupResource(): URI {
		this.backupIndex = this.backupIndex > 5 ? 1 : this.backupIndex;
		return joinPath(dirname(this.resource), `${basename(this.resource)}_${this.backupIndex++}`);
	}

	private async loadContent(): Promise<string> {
		try {
			const content = await this.fileService.readFile(this.resource);
			return content.value.toString();
		} catch (e) {
			return '';
		}
	}

	private stringifyLogLevel(level: LogLevel): string {
		switch (level) {
			case LogLevel.Debug: return 'debug';
			case LogLevel.Error: return 'error';
			case LogLevel.Info: return 'info';
			case LogLevel.Trace: return 'trace';
			case LogLevel.Warning: return 'warning';
		}
		return '';
	}

}

export class FileLoggerService extends AbstractLoggerService implements ILoggerService {

	constructor(
		logLevel: LogLevel,
		logsHome: URI,
		private readonly fileService: IFileService,
	) {
		super(logLevel, logsHome);
	}

	protected doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		const logger = new BufferLogger(logLevel);
		whenProviderRegistered(resource, this.fileService).then(() => logger.logger = new FileLogger(resource, logger.getLevel(), !!options?.donotUseFormatters, this.fileService));
		return logger;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/common/log.ts]---
Location: vscode-main/src/vs/platform/log/common/log.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { isWindows } from '../../../base/common/platform.js';
import { joinPath } from '../../../base/common/resources.js';
import { Mutable, isNumber, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { ILocalizedString } from '../../action/common/action.js';
import { RawContextKey } from '../../contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const ILogService = createDecorator<ILogService>('logService');
export const ILoggerService = createDecorator<ILoggerService>('loggerService');

function now(): string {
	return new Date().toISOString();
}

export function isLogLevel(thing: unknown): thing is LogLevel {
	return isNumber(thing);
}

export enum LogLevel {
	Off,
	Trace,
	Debug,
	Info,
	Warning,
	Error
}

export const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Info;

export interface ILogger extends IDisposable {
	readonly onDidChangeLogLevel: Event<LogLevel>;
	getLevel(): LogLevel;
	setLevel(level: LogLevel): void;

	trace(message: string, ...args: unknown[]): void;
	debug(message: string, ...args: unknown[]): void;
	info(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string | Error, ...args: unknown[]): void;

	/**
	 * An operation to flush the contents. Can be synchronous.
	 */
	flush(): void;
}

export function canLog(loggerLevel: LogLevel, messageLevel: LogLevel): boolean {
	return loggerLevel !== LogLevel.Off && loggerLevel <= messageLevel;
}

export function log(logger: ILogger, level: LogLevel, message: string): void {
	switch (level) {
		case LogLevel.Trace: logger.trace(message); break;
		case LogLevel.Debug: logger.debug(message); break;
		case LogLevel.Info: logger.info(message); break;
		case LogLevel.Warning: logger.warn(message); break;
		case LogLevel.Error: logger.error(message); break;
		case LogLevel.Off: /* do nothing */ break;
		default: throw new Error(`Invalid log level ${level}`);
	}
}

function format(args: any, verbose: boolean = false): string {
	let result = '';

	for (let i = 0; i < args.length; i++) {
		let a = args[i];

		if (a instanceof Error) {
			a = toErrorMessage(a, verbose);
		}

		if (typeof a === 'object') {
			try {
				a = JSON.stringify(a);
			} catch (e) { }
		}

		result += (i > 0 ? ' ' : '') + a;
	}

	return result;
}

export type LoggerGroup = {
	readonly id: string;
	readonly name: string;
};

export interface ILogService extends ILogger {
	readonly _serviceBrand: undefined;
}

export interface ILoggerOptions {

	/**
	 * Id of the logger.
	 */
	id?: string;

	/**
	 * Name of the logger.
	 */
	name?: string;

	/**
	 * Do not create rotating files if max size exceeds.
	 */
	donotRotate?: boolean;

	/**
	 * Do not use formatters.
	 */
	donotUseFormatters?: boolean;

	/**
	 * When to log. Set to `always` to log always.
	 */
	logLevel?: 'always' | LogLevel;

	/**
	 * Whether the log should be hidden from the user.
	 */
	hidden?: boolean;

	/**
	 * Condition which must be true to show this logger
	 */
	when?: string;

	/**
	 * Id of the extension that created this logger.
	 */
	extensionId?: string;

	/**
	 * Group of the logger.
	 */
	group?: LoggerGroup;
}

export interface ILoggerResource {
	readonly resource: URI;
	readonly id: string;
	readonly name?: string;
	readonly logLevel?: LogLevel;
	readonly hidden?: boolean;
	readonly when?: string;
	readonly extensionId?: string;
	readonly group?: LoggerGroup;
}

export type DidChangeLoggersEvent = {
	readonly added: Iterable<ILoggerResource>;
	readonly removed: Iterable<ILoggerResource>;
};

export interface ILoggerService {

	readonly _serviceBrand: undefined;

	/**
	 * Creates a logger for the given resource, or gets one if it already exists.
	 *
	 * This will also register the logger with the logger service.
	 */
	createLogger(resource: URI, options?: ILoggerOptions): ILogger;

	/**
	 * Creates a logger with the given id in the logs folder, or gets one if it already exists.
	 *
	 * This will also register the logger with the logger service.
	 */
	createLogger(id: string, options?: Omit<ILoggerOptions, 'id'>): ILogger;

	/**
	 * Gets an existing logger, if any.
	 */
	getLogger(resourceOrId: URI | string): ILogger | undefined;

	/**
	 * An event which fires when the log level of a logger has changed
	 */
	readonly onDidChangeLogLevel: Event<LogLevel | [URI, LogLevel]>;

	/**
	 * Set default log level.
	 */
	setLogLevel(level: LogLevel): void;

	/**
	 * Set log level for a logger.
	 */
	setLogLevel(resource: URI, level: LogLevel): void;

	/**
	 * Get log level for a logger or the default log level.
	 */
	getLogLevel(resource?: URI): LogLevel;

	/**
	 * An event which fires when the visibility of a logger has changed
	 */
	readonly onDidChangeVisibility: Event<[URI, boolean]>;

	/**
	 * Set the visibility of a logger.
	 */
	setVisibility(resourceOrId: URI | string, visible: boolean): void;

	/**
	 * An event which fires when the logger resources are changed
	 */
	readonly onDidChangeLoggers: Event<DidChangeLoggersEvent>;

	/**
	 * Register a logger with the logger service.
	 *
	 * Note that this will not create a logger, but only register it.
	 *
	 * Use `createLogger` to create a logger and register it.
	 *
	 * Use it when you want to register a logger that is not created by the logger service.
	 */
	registerLogger(resource: ILoggerResource): void;

	/**
	 * Deregister the logger for the given resource.
	 */
	deregisterLogger(idOrResource: URI | string): void;

	/**
	 * Get all registered loggers
	 */
	getRegisteredLoggers(): Iterable<ILoggerResource>;

	/**
	 * Get the registered logger for the given resource.
	 */
	getRegisteredLogger(resource: URI): ILoggerResource | undefined;
}

export abstract class AbstractLogger extends Disposable implements ILogger {

	private level: LogLevel = DEFAULT_LOG_LEVEL;
	private readonly _onDidChangeLogLevel: Emitter<LogLevel> = this._register(new Emitter<LogLevel>());
	get onDidChangeLogLevel(): Event<LogLevel> { return this._onDidChangeLogLevel.event; }

	setLevel(level: LogLevel): void {
		if (this.level !== level) {
			this.level = level;
			this._onDidChangeLogLevel.fire(this.level);
		}
	}

	getLevel(): LogLevel {
		return this.level;
	}

	protected checkLogLevel(level: LogLevel): boolean {
		return canLog(this.level, level);
	}

	protected canLog(level: LogLevel): boolean {
		if (this._store.isDisposed) {
			return false;
		}
		return this.checkLogLevel(level);
	}

	abstract trace(message: string, ...args: unknown[]): void;
	abstract debug(message: string, ...args: unknown[]): void;
	abstract info(message: string, ...args: unknown[]): void;
	abstract warn(message: string, ...args: unknown[]): void;
	abstract error(message: string | Error, ...args: unknown[]): void;
	abstract flush(): void;
}

export abstract class AbstractMessageLogger extends AbstractLogger implements ILogger {

	constructor(private readonly logAlways?: boolean) {
		super();
	}

	protected override checkLogLevel(level: LogLevel): boolean {
		return this.logAlways || super.checkLogLevel(level);
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			this.log(LogLevel.Trace, format([message, ...args], true));
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			this.log(LogLevel.Debug, format([message, ...args]));
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			this.log(LogLevel.Info, format([message, ...args]));
		}
	}

	warn(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			this.log(LogLevel.Warning, format([message, ...args]));
		}
	}

	error(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			if (message instanceof Error) {
				const array = Array.prototype.slice.call(arguments);
				array[0] = message.stack;
				this.log(LogLevel.Error, format(array));
			} else {
				this.log(LogLevel.Error, format([message, ...args]));
			}
		}
	}

	flush(): void { }

	protected abstract log(level: LogLevel, message: string): void;
}


export class ConsoleMainLogger extends AbstractLogger implements ILogger {

	private useColors: boolean;

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
		this.useColors = !isWindows;
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	warn(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			if (this.useColors) {
				console.warn(`\x1b[93m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.warn(`[main ${now()}]`, message, ...args);
			}
		}
	}

	error(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			if (this.useColors) {
				console.error(`\x1b[91m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.error(`[main ${now()}]`, message, ...args);
			}
		}
	}

	flush(): void {
		// noop
	}

}

export class ConsoleLogger extends AbstractLogger implements ILogger {

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL, private readonly useColors: boolean = true) {
		super();
		this.setLevel(logLevel);
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			if (this.useColors) {
				console.log('%cTRACE', 'color: #888', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			if (this.useColors) {
				console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			if (this.useColors) {
				console.log('%c INFO', 'color: #33f', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	warn(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			if (this.useColors) {
				console.warn('%c WARN', 'color: #993', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	error(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			if (this.useColors) {
				console.error('%c  ERR', 'color: #f33', message, ...args);
			} else {
				console.error(message, ...args);
			}
		}
	}


	flush(): void {
		// noop
	}
}

export class AdapterLogger extends AbstractLogger implements ILogger {

	constructor(private readonly adapter: { log: (logLevel: LogLevel, args: any[]) => void }, logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			this.adapter.log(LogLevel.Trace, [this.extractMessage(message), ...args]);
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			this.adapter.log(LogLevel.Debug, [this.extractMessage(message), ...args]);
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			this.adapter.log(LogLevel.Info, [this.extractMessage(message), ...args]);
		}
	}

	warn(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			this.adapter.log(LogLevel.Warning, [this.extractMessage(message), ...args]);
		}
	}

	error(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			this.adapter.log(LogLevel.Error, [this.extractMessage(message), ...args]);
		}
	}

	private extractMessage(msg: string | Error): string {
		if (typeof msg === 'string') {
			return msg;
		}

		return toErrorMessage(msg, this.canLog(LogLevel.Trace));
	}

	flush(): void {
		// noop
	}
}

export class MultiplexLogger extends AbstractLogger implements ILogger {

	constructor(private readonly loggers: ReadonlyArray<ILogger>) {
		super();
		if (loggers.length) {
			this.setLevel(loggers[0].getLevel());
		}
	}

	override setLevel(level: LogLevel): void {
		for (const logger of this.loggers) {
			logger.setLevel(level);
		}
		super.setLevel(level);
	}

	trace(message: string, ...args: unknown[]): void {
		for (const logger of this.loggers) {
			logger.trace(message, ...args);
		}
	}

	debug(message: string, ...args: unknown[]): void {
		for (const logger of this.loggers) {
			logger.debug(message, ...args);
		}
	}

	info(message: string, ...args: unknown[]): void {
		for (const logger of this.loggers) {
			logger.info(message, ...args);
		}
	}

	warn(message: string, ...args: unknown[]): void {
		for (const logger of this.loggers) {
			logger.warn(message, ...args);
		}
	}

	error(message: string | Error, ...args: unknown[]): void {
		for (const logger of this.loggers) {
			logger.error(message, ...args);
		}
	}

	flush(): void {
		for (const logger of this.loggers) {
			logger.flush();
		}
	}

	override dispose(): void {
		for (const logger of this.loggers) {
			logger.dispose();
		}
		super.dispose();
	}
}

type LoggerEntry = { logger: ILogger | undefined; info: Mutable<ILoggerResource> };

export abstract class AbstractLoggerService extends Disposable implements ILoggerService {

	declare readonly _serviceBrand: undefined;

	private readonly _loggers = new ResourceMap<LoggerEntry>();

	private _onDidChangeLoggers = this._register(new Emitter<{ added: ILoggerResource[]; removed: ILoggerResource[] }>);
	readonly onDidChangeLoggers = this._onDidChangeLoggers.event;

	private _onDidChangeLogLevel = this._register(new Emitter<LogLevel | [URI, LogLevel]>);
	readonly onDidChangeLogLevel = this._onDidChangeLogLevel.event;

	private _onDidChangeVisibility = this._register(new Emitter<[URI, boolean]>);
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	constructor(
		protected logLevel: LogLevel,
		private readonly logsHome: URI,
		loggerResources?: Iterable<ILoggerResource>,
	) {
		super();
		if (loggerResources) {
			for (const loggerResource of loggerResources) {
				this._loggers.set(loggerResource.resource, { logger: undefined, info: loggerResource });
			}
		}
	}

	private getLoggerEntry(resourceOrId: URI | string): LoggerEntry | undefined {
		if (isString(resourceOrId)) {
			return [...this._loggers.values()].find(logger => logger.info.id === resourceOrId);
		}
		return this._loggers.get(resourceOrId);
	}

	getLogger(resourceOrId: URI | string): ILogger | undefined {
		return this.getLoggerEntry(resourceOrId)?.logger;
	}

	createLogger(idOrResource: URI | string, options?: ILoggerOptions): ILogger {
		const resource = this.toResource(idOrResource);
		const id = isString(idOrResource) ? idOrResource : (options?.id ?? hash(resource.toString()).toString(16));
		let logger = this._loggers.get(resource)?.logger;
		const logLevel = options?.logLevel === 'always' ? LogLevel.Trace : options?.logLevel;
		if (!logger) {
			logger = this.doCreateLogger(resource, logLevel ?? this.getLogLevel(resource) ?? this.logLevel, { ...options, id });
		}
		const loggerEntry: LoggerEntry = {
			logger,
			info: {
				resource,
				id,
				logLevel,
				name: options?.name,
				hidden: options?.hidden,
				group: options?.group,
				extensionId: options?.extensionId,
				when: options?.when
			}
		};
		this.registerLogger(loggerEntry.info);
		// TODO: @sandy081 Remove this once registerLogger can take ILogger
		this._loggers.set(resource, loggerEntry);
		return logger;
	}

	protected toResource(idOrResource: string | URI): URI {
		return isString(idOrResource) ? joinPath(this.logsHome, `${idOrResource.replace(/[\\/:\*\?"<>\|]/g, '')}.log`) : idOrResource;
	}

	setLogLevel(logLevel: LogLevel): void;
	setLogLevel(resource: URI, logLevel: LogLevel): void;
	setLogLevel(arg1: any, arg2?: any): void {
		if (URI.isUri(arg1)) {
			const resource = arg1;
			const logLevel = arg2;
			const logger = this._loggers.get(resource);
			if (logger && logLevel !== logger.info.logLevel) {
				logger.info.logLevel = logLevel === this.logLevel ? undefined : logLevel;
				logger.logger?.setLevel(logLevel);
				this._loggers.set(logger.info.resource, logger);
				this._onDidChangeLogLevel.fire([resource, logLevel]);
			}
		} else {
			this.logLevel = arg1;
			for (const [resource, logger] of this._loggers.entries()) {
				if (this._loggers.get(resource)?.info.logLevel === undefined) {
					logger.logger?.setLevel(this.logLevel);
				}
			}
			this._onDidChangeLogLevel.fire(this.logLevel);
		}
	}

	setVisibility(resourceOrId: URI | string, visibility: boolean): void {
		const logger = this.getLoggerEntry(resourceOrId);
		if (logger && visibility !== !logger.info.hidden) {
			logger.info.hidden = !visibility;
			this._loggers.set(logger.info.resource, logger);
			this._onDidChangeVisibility.fire([logger.info.resource, visibility]);
		}
	}

	getLogLevel(resource?: URI): LogLevel {
		let logLevel;
		if (resource) {
			logLevel = this._loggers.get(resource)?.info.logLevel;
		}
		return logLevel ?? this.logLevel;
	}

	registerLogger(resource: ILoggerResource): void {
		const existing = this._loggers.get(resource.resource);
		if (existing) {
			if (existing.info.hidden !== resource.hidden) {
				this.setVisibility(resource.resource, !resource.hidden);
			}
		} else {
			this._loggers.set(resource.resource, { info: resource, logger: undefined });
			this._onDidChangeLoggers.fire({ added: [resource], removed: [] });
		}
	}

	deregisterLogger(idOrResource: URI | string): void {
		const resource = this.toResource(idOrResource);
		const existing = this._loggers.get(resource);
		if (existing) {
			if (existing.logger) {
				existing.logger.dispose();
			}
			this._loggers.delete(resource);
			this._onDidChangeLoggers.fire({ added: [], removed: [existing.info] });
		}
	}

	*getRegisteredLoggers(): Iterable<ILoggerResource> {
		for (const entry of this._loggers.values()) {
			yield entry.info;
		}
	}

	getRegisteredLogger(resource: URI): ILoggerResource | undefined {
		return this._loggers.get(resource)?.info;
	}

	override dispose(): void {
		this._loggers.forEach(logger => logger.logger?.dispose());
		this._loggers.clear();
		super.dispose();
	}

	protected abstract doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger;
}

export class NullLogger implements ILogger {
	readonly onDidChangeLogLevel: Event<LogLevel> = new Emitter<LogLevel>().event;
	setLevel(level: LogLevel): void { }
	getLevel(): LogLevel { return LogLevel.Info; }
	trace(message: string, ...args: unknown[]): void { }
	debug(message: string, ...args: unknown[]): void { }
	info(message: string, ...args: unknown[]): void { }
	warn(message: string, ...args: unknown[]): void { }
	error(message: string | Error, ...args: unknown[]): void { }
	critical(message: string | Error, ...args: unknown[]): void { }
	dispose(): void { }
	flush(): void { }
}

export class NullLogService extends NullLogger implements ILogService {
	declare readonly _serviceBrand: undefined;
}

export class NullLoggerService extends AbstractLoggerService {
	constructor() {
		super(LogLevel.Off, URI.parse('log:///log'));
	}
	protected override doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		return new NullLogger();
	}
}

export function getLogLevel(environmentService: IEnvironmentService): LogLevel {
	if (environmentService.verbose) {
		return LogLevel.Trace;
	}
	if (typeof environmentService.logLevel === 'string') {
		const logLevel = parseLogLevel(environmentService.logLevel.toLowerCase());
		if (logLevel !== undefined) {
			return logLevel;
		}
	}
	return DEFAULT_LOG_LEVEL;
}

export function LogLevelToString(logLevel: LogLevel): string {
	switch (logLevel) {
		case LogLevel.Trace: return 'trace';
		case LogLevel.Debug: return 'debug';
		case LogLevel.Info: return 'info';
		case LogLevel.Warning: return 'warn';
		case LogLevel.Error: return 'error';
		case LogLevel.Off: return 'off';
	}
}

export function LogLevelToLocalizedString(logLevel: LogLevel): ILocalizedString {
	switch (logLevel) {
		case LogLevel.Trace: return { original: 'Trace', value: nls.localize('trace', "Trace") };
		case LogLevel.Debug: return { original: 'Debug', value: nls.localize('debug', "Debug") };
		case LogLevel.Info: return { original: 'Info', value: nls.localize('info', "Info") };
		case LogLevel.Warning: return { original: 'Warning', value: nls.localize('warn', "Warning") };
		case LogLevel.Error: return { original: 'Error', value: nls.localize('error', "Error") };
		case LogLevel.Off: return { original: 'Off', value: nls.localize('off', "Off") };
	}
}

export function parseLogLevel(logLevel: string): LogLevel | undefined {
	switch (logLevel) {
		case 'trace':
			return LogLevel.Trace;
		case 'debug':
			return LogLevel.Debug;
		case 'info':
			return LogLevel.Info;
		case 'warn':
			return LogLevel.Warning;
		case 'error':
			return LogLevel.Error;
		case 'critical':
			return LogLevel.Error;
		case 'off':
			return LogLevel.Off;
	}
	return undefined;
}

// Contexts
export const CONTEXT_LOG_LEVEL = new RawContextKey<string>('logLevel', LogLevelToString(LogLevel.Info));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/common/logIpc.ts]---
Location: vscode-main/src/vs/platform/log/common/logIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { Event } from '../../../base/common/event.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { AbstractLoggerService, AbstractMessageLogger, AdapterLogger, DidChangeLoggersEvent, ILogger, ILoggerOptions, ILoggerResource, ILoggerService, isLogLevel, LogLevel } from './log.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';

export class LoggerChannelClient extends AbstractLoggerService implements ILoggerService {

	constructor(private readonly windowId: number | undefined, logLevel: LogLevel, logsHome: URI, loggers: ILoggerResource[], private readonly channel: IChannel) {
		super(logLevel, logsHome, loggers);
		this._register(channel.listen<LogLevel | [URI, LogLevel]>('onDidChangeLogLevel', windowId)(arg => {
			if (isLogLevel(arg)) {
				super.setLogLevel(arg);
			} else {
				super.setLogLevel(URI.revive(arg[0]), arg[1]);
			}
		}));
		this._register(channel.listen<[URI, boolean]>('onDidChangeVisibility', windowId)(([resource, visibility]) => super.setVisibility(URI.revive(resource), visibility)));
		this._register(channel.listen<DidChangeLoggersEvent>('onDidChangeLoggers', windowId)(({ added, removed }) => {
			for (const loggerResource of added) {
				super.registerLogger({ ...loggerResource, resource: URI.revive(loggerResource.resource) });
			}
			for (const loggerResource of removed) {
				super.deregisterLogger(loggerResource.resource);
			}
		}));
	}

	createConsoleMainLogger(): ILogger {
		return new AdapterLogger({
			log: (level: LogLevel, args: any[]) => {
				this.channel.call('consoleLog', [level, args]);
			}
		});
	}

	override registerLogger(logger: ILoggerResource): void {
		super.registerLogger(logger);
		this.channel.call('registerLogger', [logger, this.windowId]);
	}

	override deregisterLogger(resource: URI): void {
		super.deregisterLogger(resource);
		this.channel.call('deregisterLogger', [resource, this.windowId]);
	}

	override setLogLevel(logLevel: LogLevel): void;
	override setLogLevel(resource: URI, logLevel: LogLevel): void;
	override setLogLevel(arg1: any, arg2?: any): void {
		super.setLogLevel(arg1, arg2);
		this.channel.call('setLogLevel', [arg1, arg2]);
	}

	override setVisibility(resourceOrId: URI | string, visibility: boolean): void {
		super.setVisibility(resourceOrId, visibility);
		this.channel.call('setVisibility', [this.toResource(resourceOrId), visibility]);
	}

	protected doCreateLogger(file: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		return new Logger(this.channel, file, logLevel, options, this.windowId);
	}

	public static setLogLevel(channel: IChannel, level: LogLevel): Promise<void>;
	public static setLogLevel(channel: IChannel, resource: URI, level: LogLevel): Promise<void>;
	public static setLogLevel(channel: IChannel, arg1: any, arg2?: any): Promise<void> {
		return channel.call('setLogLevel', [arg1, arg2]);
	}

}

class Logger extends AbstractMessageLogger {

	private isLoggerCreated: boolean = false;
	private buffer: [LogLevel, string][] = [];

	constructor(
		private readonly channel: IChannel,
		private readonly file: URI,
		logLevel: LogLevel,
		loggerOptions?: ILoggerOptions,
		windowId?: number | undefined
	) {
		super(loggerOptions?.logLevel === 'always');
		this.setLevel(logLevel);
		this.channel.call('createLogger', [file, loggerOptions, windowId])
			.then(() => {
				this.doLog(this.buffer);
				this.isLoggerCreated = true;
			});
	}

	protected log(level: LogLevel, message: string) {
		const messages: [LogLevel, string][] = [[level, message]];
		if (this.isLoggerCreated) {
			this.doLog(messages);
		} else {
			this.buffer.push(...messages);
		}
	}

	private doLog(messages: [LogLevel, string][]) {
		this.channel.call('log', [this.file, messages]);
	}
}

export class LoggerChannel implements IServerChannel {

	constructor(private readonly loggerService: ILoggerService, private getUriTransformer: (requestContext: any) => IURITransformer) { }

	listen(context: any, event: string): Event<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (event) {
			case 'onDidChangeLoggers': return Event.map<DidChangeLoggersEvent, DidChangeLoggersEvent>(this.loggerService.onDidChangeLoggers, (e) =>
			({
				added: [...e.added].map(logger => this.transformLogger(logger, uriTransformer)),
				removed: [...e.removed].map(logger => this.transformLogger(logger, uriTransformer)),
			}));
			case 'onDidChangeVisibility': return Event.map<[URI, boolean], [URI, boolean]>(this.loggerService.onDidChangeVisibility, e => [uriTransformer.transformOutgoingURI(e[0]), e[1]]);
			case 'onDidChangeLogLevel': return Event.map<LogLevel | [URI, LogLevel], LogLevel | [URI, LogLevel]>(this.loggerService.onDidChangeLogLevel, e => isLogLevel(e) ? e : [uriTransformer.transformOutgoingURI(e[0]), e[1]]);
		}
		throw new Error(`Event not found: ${event}`);
	}

	async call(context: any, command: string, arg?: any): Promise<any> {
		const uriTransformer: IURITransformer | null = this.getUriTransformer(context);
		switch (command) {
			case 'setLogLevel': return isLogLevel(arg[0]) ? this.loggerService.setLogLevel(arg[0]) : this.loggerService.setLogLevel(URI.revive(uriTransformer.transformIncoming(arg[0][0])), arg[0][1]);
			case 'getRegisteredLoggers': return Promise.resolve([...this.loggerService.getRegisteredLoggers()].map(logger => this.transformLogger(logger, uriTransformer)));
		}

		throw new Error(`Call not found: ${command}`);
	}

	private transformLogger(logger: ILoggerResource, transformer: IURITransformer): ILoggerResource {
		return {
			...logger,
			resource: transformer.transformOutgoingURI(logger.resource)
		};
	}

}

export class RemoteLoggerChannelClient extends Disposable {

	constructor(loggerService: ILoggerService, channel: IChannel) {
		super();

		channel.call('setLogLevel', [loggerService.getLogLevel()]);
		this._register(loggerService.onDidChangeLogLevel(arg => channel.call('setLogLevel', [arg])));

		channel.call<ILoggerResource[]>('getRegisteredLoggers').then(loggers => {
			for (const loggerResource of loggers) {
				loggerService.registerLogger({ ...loggerResource, resource: URI.revive(loggerResource.resource) });
			}
		});

		this._register(channel.listen<[URI, boolean]>('onDidChangeVisibility')(([resource, visibility]) => loggerService.setVisibility(URI.revive(resource), visibility)));

		this._register(channel.listen<DidChangeLoggersEvent>('onDidChangeLoggers')(({ added, removed }) => {
			for (const loggerResource of added) {
				loggerService.registerLogger({ ...loggerResource, resource: URI.revive(loggerResource.resource) });
			}
			for (const loggerResource of removed) {
				loggerService.deregisterLogger(loggerResource.resource);
			}
		}));

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/common/logService.ts]---
Location: vscode-main/src/vs/platform/log/common/logService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { Event } from '../../../base/common/event.js';
import { ILogger, ILogService, LogLevel, MultiplexLogger } from './log.js';

export class LogService extends Disposable implements ILogService {

	declare readonly _serviceBrand: undefined;

	private readonly logger: ILogger;

	constructor(primaryLogger: ILogger, otherLoggers: ILogger[] = []) {
		super();
		this.logger = new MultiplexLogger([primaryLogger, ...otherLoggers]);
		this._register(primaryLogger.onDidChangeLogLevel(level => this.setLevel(level)));
	}

	get onDidChangeLogLevel(): Event<LogLevel> {
		return this.logger.onDidChangeLogLevel;
	}

	setLevel(level: LogLevel): void {
		this.logger.setLevel(level);
	}

	getLevel(): LogLevel {
		return this.logger.getLevel();
	}

	trace(message: string, ...args: unknown[]): void {
		this.logger.trace(message, ...args);
	}

	debug(message: string, ...args: unknown[]): void {
		this.logger.debug(message, ...args);
	}

	info(message: string, ...args: unknown[]): void {
		this.logger.info(message, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.logger.warn(message, ...args);
	}

	error(message: string | Error, ...args: unknown[]): void {
		this.logger.error(message, ...args);
	}

	flush(): void {
		this.logger.flush();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/electron-main/loggerService.ts]---
Location: vscode-main/src/vs/platform/log/electron-main/loggerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResourceMap } from '../../../base/common/map.js';
import { URI } from '../../../base/common/uri.js';
import { Event } from '../../../base/common/event.js';
import { refineServiceDecorator } from '../../instantiation/common/instantiation.js';
import { DidChangeLoggersEvent, ILogger, ILoggerOptions, ILoggerResource, ILoggerService, LogLevel, isLogLevel } from '../common/log.js';
import { LoggerService } from '../node/loggerService.js';

export const ILoggerMainService = refineServiceDecorator<ILoggerService, ILoggerMainService>(ILoggerService);

export interface ILoggerMainService extends ILoggerService {

	getOnDidChangeLogLevelEvent(windowId: number): Event<LogLevel | [URI, LogLevel]>;

	getOnDidChangeVisibilityEvent(windowId: number): Event<[URI, boolean]>;

	getOnDidChangeLoggersEvent(windowId: number): Event<DidChangeLoggersEvent>;

	createLogger(resource: URI, options?: ILoggerOptions, windowId?: number): ILogger;

	createLogger(id: string, options?: Omit<ILoggerOptions, 'id'>, windowId?: number): ILogger;

	registerLogger(resource: ILoggerResource, windowId?: number): void;

	getGlobalLoggers(): ILoggerResource[];

	deregisterLoggers(windowId: number): void;

}

export class LoggerMainService extends LoggerService implements ILoggerMainService {

	private readonly loggerResourcesByWindow = new ResourceMap<number>();

	override createLogger(idOrResource: URI | string, options?: ILoggerOptions, windowId?: number): ILogger {
		if (windowId !== undefined) {
			this.loggerResourcesByWindow.set(this.toResource(idOrResource), windowId);
		}
		try {
			return super.createLogger(idOrResource, options);
		} catch (error) {
			this.loggerResourcesByWindow.delete(this.toResource(idOrResource));
			throw error;
		}
	}

	override registerLogger(resource: ILoggerResource, windowId?: number): void {
		if (windowId !== undefined) {
			this.loggerResourcesByWindow.set(resource.resource, windowId);
		}
		super.registerLogger(resource);
	}

	override deregisterLogger(resource: URI): void {
		this.loggerResourcesByWindow.delete(resource);
		super.deregisterLogger(resource);
	}

	getGlobalLoggers(): ILoggerResource[] {
		const resources: ILoggerResource[] = [];
		for (const resource of super.getRegisteredLoggers()) {
			if (!this.loggerResourcesByWindow.has(resource.resource)) {
				resources.push(resource);
			}
		}
		return resources;
	}

	getOnDidChangeLogLevelEvent(windowId: number): Event<LogLevel | [URI, LogLevel]> {
		return Event.filter(this.onDidChangeLogLevel, arg => isLogLevel(arg) || this.isInterestedLoggerResource(arg[0], windowId));
	}

	getOnDidChangeVisibilityEvent(windowId: number): Event<[URI, boolean]> {
		return Event.filter(this.onDidChangeVisibility, ([resource]) => this.isInterestedLoggerResource(resource, windowId));
	}

	getOnDidChangeLoggersEvent(windowId: number): Event<DidChangeLoggersEvent> {
		return Event.filter(
			Event.map(this.onDidChangeLoggers, e => {
				const r = {
					added: [...e.added].filter(loggerResource => this.isInterestedLoggerResource(loggerResource.resource, windowId)),
					removed: [...e.removed].filter(loggerResource => this.isInterestedLoggerResource(loggerResource.resource, windowId)),
				};
				return r;
			}), e => e.added.length > 0 || e.removed.length > 0);
	}

	deregisterLoggers(windowId: number): void {
		for (const [resource, resourceWindow] of this.loggerResourcesByWindow) {
			if (resourceWindow === windowId) {
				this.deregisterLogger(resource);
			}
		}
	}

	private isInterestedLoggerResource(resource: URI, windowId: number | undefined): boolean {
		const loggerWindowId = this.loggerResourcesByWindow.get(resource);
		return loggerWindowId === undefined || loggerWindowId === windowId;
	}

	override dispose(): void {
		super.dispose();
		this.loggerResourcesByWindow.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/electron-main/logIpc.ts]---
Location: vscode-main/src/vs/platform/log/electron-main/logIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { ResourceMap } from '../../../base/common/map.js';
import { URI } from '../../../base/common/uri.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogger, ILoggerOptions, isLogLevel, log, LogLevel } from '../common/log.js';
import { ILoggerMainService } from './loggerService.js';

export class LoggerChannel implements IServerChannel {

	private readonly loggers = new ResourceMap<ILogger>();

	constructor(private readonly loggerService: ILoggerMainService) { }

	listen(_: unknown, event: string, windowId?: number): Event<any> {
		switch (event) {
			case 'onDidChangeLoggers': return windowId ? this.loggerService.getOnDidChangeLoggersEvent(windowId) : this.loggerService.onDidChangeLoggers;
			case 'onDidChangeLogLevel': return windowId ? this.loggerService.getOnDidChangeLogLevelEvent(windowId) : this.loggerService.onDidChangeLogLevel;
			case 'onDidChangeVisibility': return windowId ? this.loggerService.getOnDidChangeVisibilityEvent(windowId) : this.loggerService.onDidChangeVisibility;
		}
		throw new Error(`Event not found: ${event}`);
	}

	async call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'createLogger': this.createLogger(URI.revive(arg[0]), arg[1], arg[2]); return;
			case 'log': return this.log(URI.revive(arg[0]), arg[1]);
			case 'consoleLog': return this.consoleLog(arg[0], arg[1]);
			case 'setLogLevel': return isLogLevel(arg[0]) ? this.loggerService.setLogLevel(arg[0]) : this.loggerService.setLogLevel(URI.revive(arg[0]), arg[1]);
			case 'setVisibility': return this.loggerService.setVisibility(URI.revive(arg[0]), arg[1]);
			case 'registerLogger': return this.loggerService.registerLogger({ ...arg[0], resource: URI.revive(arg[0].resource) }, arg[1]);
			case 'deregisterLogger': return this.loggerService.deregisterLogger(URI.revive(arg[0]));
		}

		throw new Error(`Call not found: ${command}`);
	}

	private createLogger(file: URI, options: ILoggerOptions, windowId: number | undefined): void {
		this.loggers.set(file, this.loggerService.createLogger(file, options, windowId));
	}

	private consoleLog(level: LogLevel, args: any[]): void {
		let consoleFn = console.log;

		switch (level) {
			case LogLevel.Error:
				consoleFn = console.error;
				break;
			case LogLevel.Warning:
				consoleFn = console.warn;
				break;
			case LogLevel.Info:
				consoleFn = console.info;
				break;
		}

		consoleFn.call(console, ...args);
	}

	private log(file: URI, messages: [LogLevel, string][]): void {
		const logger = this.loggers.get(file);
		if (!logger) {
			throw new Error('Create the logger before logging');
		}
		for (const [level, message] of messages) {
			log(logger, level, message);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/node/loggerService.ts]---
Location: vscode-main/src/vs/platform/log/node/loggerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { AbstractLoggerService, ILogger, ILoggerOptions, ILoggerService, LogLevel } from '../common/log.js';
import { SpdLogLogger } from './spdlogLog.js';

export class LoggerService extends AbstractLoggerService implements ILoggerService {

	protected doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		return new SpdLogLogger(generateUuid(), resource.fsPath, !options?.donotRotate, !!options?.donotUseFormatters, logLevel);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/log/node/spdlogLog.ts]---
Location: vscode-main/src/vs/platform/log/node/spdlogLog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as spdlog from '@vscode/spdlog';
import { ByteSize } from '../../files/common/files.js';
import { AbstractMessageLogger, ILogger, LogLevel } from '../common/log.js';

enum SpdLogLevel {
	Trace,
	Debug,
	Info,
	Warning,
	Error,
	Critical,
	Off
}

async function createSpdLogLogger(name: string, logfilePath: string, filesize: number, filecount: number, donotUseFormatters: boolean): Promise<spdlog.Logger | null> {
	// Do not crash if spdlog cannot be loaded
	try {
		const _spdlog = await import('@vscode/spdlog');
		_spdlog.setFlushOn(SpdLogLevel.Trace);
		const logger = await _spdlog.createAsyncRotatingLogger(name, logfilePath, filesize, filecount);
		if (donotUseFormatters) {
			logger.clearFormatters();
		} else {
			logger.setPattern('%Y-%m-%d %H:%M:%S.%e [%l] %v');
		}
		return logger;
	} catch (e) {
		console.error(e);
	}
	return null;
}

interface ILog {
	level: LogLevel;
	message: string;
}

function log(logger: spdlog.Logger, level: LogLevel, message: string): void {
	switch (level) {
		case LogLevel.Trace: logger.trace(message); break;
		case LogLevel.Debug: logger.debug(message); break;
		case LogLevel.Info: logger.info(message); break;
		case LogLevel.Warning: logger.warn(message); break;
		case LogLevel.Error: logger.error(message); break;
		case LogLevel.Off: /* do nothing */ break;
		default: throw new Error(`Invalid log level ${level}`);
	}
}

function setLogLevel(logger: spdlog.Logger, level: LogLevel): void {
	switch (level) {
		case LogLevel.Trace: logger.setLevel(SpdLogLevel.Trace); break;
		case LogLevel.Debug: logger.setLevel(SpdLogLevel.Debug); break;
		case LogLevel.Info: logger.setLevel(SpdLogLevel.Info); break;
		case LogLevel.Warning: logger.setLevel(SpdLogLevel.Warning); break;
		case LogLevel.Error: logger.setLevel(SpdLogLevel.Error); break;
		case LogLevel.Off: logger.setLevel(SpdLogLevel.Off); break;
		default: throw new Error(`Invalid log level ${level}`);
	}
}

export class SpdLogLogger extends AbstractMessageLogger implements ILogger {

	private buffer: ILog[] = [];
	private readonly _loggerCreationPromise: Promise<void>;
	private _logger: spdlog.Logger | undefined;

	constructor(
		name: string,
		filepath: string,
		rotating: boolean,
		donotUseFormatters: boolean,
		level: LogLevel,
	) {
		super();
		this.setLevel(level);
		this._loggerCreationPromise = this._createSpdLogLogger(name, filepath, rotating, donotUseFormatters);
		this._register(this.onDidChangeLogLevel(level => {
			if (this._logger) {
				setLogLevel(this._logger, level);
			}
		}));
	}

	private async _createSpdLogLogger(name: string, filepath: string, rotating: boolean, donotUseFormatters: boolean): Promise<void> {
		const filecount = rotating ? 6 : 1;
		const filesize = (30 / filecount) * ByteSize.MB;
		const logger = await createSpdLogLogger(name, filepath, filesize, filecount, donotUseFormatters);
		if (logger) {
			this._logger = logger;
			setLogLevel(this._logger, this.getLevel());
			for (const { level, message } of this.buffer) {
				log(this._logger, level, message);
			}
			this.buffer = [];
		}
	}

	protected log(level: LogLevel, message: string): void {
		if (this._logger) {
			log(this._logger, level, message);
		} else if (this.getLevel() <= level) {
			this.buffer.push({ level, message });
		}
	}

	override flush(): void {
		if (this._logger) {
			this.flushLogger();
		} else {
			this._loggerCreationPromise.then(() => this.flushLogger());
		}
	}

	override dispose(): void {
		if (this._logger) {
			this.disposeLogger();
		} else {
			this._loggerCreationPromise.then(() => this.disposeLogger());
		}
		super.dispose();
	}

	private flushLogger(): void {
		if (this._logger) {
			this._logger.flush();
		}
	}

	private disposeLogger(): void {
		if (this._logger) {
			this._logger.drop();
			this._logger = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/markdown/browser/markdownRenderer.ts]---
Location: vscode-main/src/vs/platform/markdown/browser/markdownRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRenderedMarkdown, MarkdownRenderOptions, renderMarkdown } from '../../../base/browser/markdownRenderer.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { IMarkdownString, MarkdownStringTrustedOptions } from '../../../base/common/htmlContent.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IOpenerService } from '../../opener/common/opener.js';

/**
 * Renders markdown to HTML.
 *
 * This interface allows a upper level component to pass a custom markdown renderer to sub-components.
 *
 * If you want to render markdown content in a standard way, prefer using the {@linkcode IMarkdownRendererService}.
 */
export interface IMarkdownRenderer {
	render(markdown: IMarkdownString, options?: MarkdownRenderOptions, outElement?: HTMLElement): IRenderedMarkdown;
}

export interface IMarkdownRendererExtraOptions {
	/**
	 * The context in which the markdown is being rendered.
	 */
	readonly context?: unknown;
}

export interface IMarkdownCodeBlockRenderer {
	renderCodeBlock(languageAlias: string | undefined, value: string, options: IMarkdownRendererExtraOptions): Promise<HTMLElement>;
}


export const IMarkdownRendererService = createDecorator<IMarkdownRendererService>('markdownRendererService');

/**
 * Service that renders markdown content in a standard manner.
 *
 * Unlike the lower-level {@linkcode renderMarkdown} function, this includes built-in support for features such as syntax
 * highlighting of code blocks and link handling.
 *
 * This service should be preferred for rendering markdown in most cases.
 */
export interface IMarkdownRendererService extends IMarkdownRenderer {
	readonly _serviceBrand: undefined;

	render(markdown: IMarkdownString, options?: MarkdownRenderOptions & IMarkdownRendererExtraOptions, outElement?: HTMLElement): IRenderedMarkdown;

	setDefaultCodeBlockRenderer(renderer: IMarkdownCodeBlockRenderer): void;
}


export class MarkdownRendererService implements IMarkdownRendererService {
	declare readonly _serviceBrand: undefined;

	private _defaultCodeBlockRenderer: IMarkdownCodeBlockRenderer | undefined;

	constructor(
		@IOpenerService private readonly _openerService: IOpenerService,
	) { }

	render(markdown: IMarkdownString, options?: MarkdownRenderOptions & IMarkdownRendererExtraOptions, outElement?: HTMLElement): IRenderedMarkdown {
		const resolvedOptions = { ...options };

		if (!resolvedOptions.actionHandler) {
			resolvedOptions.actionHandler = (link, mdStr) => {
				return openLinkFromMarkdown(this._openerService, link, mdStr.isTrusted);
			};
		}

		if (!resolvedOptions.codeBlockRenderer) {
			resolvedOptions.codeBlockRenderer = (alias, value) => {
				return this._defaultCodeBlockRenderer?.renderCodeBlock(alias, value, resolvedOptions ?? {}) ?? Promise.resolve(document.createElement('span'));
			};
		}

		const rendered = renderMarkdown(markdown, resolvedOptions, outElement);
		rendered.element.classList.add('rendered-markdown');
		return rendered;
	}

	setDefaultCodeBlockRenderer(renderer: IMarkdownCodeBlockRenderer): void {
		this._defaultCodeBlockRenderer = renderer;
	}
}

export async function openLinkFromMarkdown(openerService: IOpenerService, link: string, isTrusted: boolean | MarkdownStringTrustedOptions | undefined, skipValidation?: boolean): Promise<boolean> {
	try {
		return await openerService.open(link, {
			fromUserGesture: true,
			allowContributedOpeners: true,
			allowCommands: toAllowCommandsOption(isTrusted),
			skipValidation
		});
	} catch (e) {
		onUnexpectedError(e);
		return false;
	}
}

function toAllowCommandsOption(isTrusted: boolean | MarkdownStringTrustedOptions | undefined): boolean | readonly string[] {
	if (isTrusted === true) {
		return true; // Allow all commands
	}

	if (isTrusted && Array.isArray(isTrusted.enabledCommands)) {
		return isTrusted.enabledCommands; // Allow subset of commands
	}

	return false; // Block commands
}

registerSingleton(IMarkdownRendererService, MarkdownRendererService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/markers/common/markers.ts]---
Location: vscode-main/src/vs/platform/markers/common/markers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export interface IMarkerReadOptions {
	owner?: string;
	resource?: URI;
	severities?: number;
	take?: number;
	ignoreResourceFilters?: boolean;
}

export interface IMarkerService {
	readonly _serviceBrand: undefined;

	getStatistics(): MarkerStatistics;

	changeOne(owner: string, resource: URI, markers: IMarkerData[]): void;

	changeAll(owner: string, data: IResourceMarker[]): void;

	remove(owner: string, resources: URI[]): void;

	read(filter?: IMarkerReadOptions): IMarker[];

	installResourceFilter(resource: URI, reason: string): IDisposable;

	readonly onMarkerChanged: Event<readonly URI[]>;
}

/**
 *
 */
export interface IRelatedInformation {
	resource: URI;
	message: string;
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
}

export const enum MarkerTag {
	Unnecessary = 1,
	Deprecated = 2
}

export enum MarkerSeverity {
	Hint = 1,
	Info = 2,
	Warning = 4,
	Error = 8,
}

export namespace MarkerSeverity {

	export function compare(a: MarkerSeverity, b: MarkerSeverity): number {
		return b - a;
	}

	const _displayStrings: { [value: number]: string } = Object.create(null);
	_displayStrings[MarkerSeverity.Error] = localize('sev.error', "Error");
	_displayStrings[MarkerSeverity.Warning] = localize('sev.warning', "Warning");
	_displayStrings[MarkerSeverity.Info] = localize('sev.info', "Info");

	export function toString(a: MarkerSeverity): string {
		return _displayStrings[a] || '';
	}

	const _displayStringsPlural: { [value: number]: string } = Object.create(null);
	_displayStringsPlural[MarkerSeverity.Error] = localize('sev.errors', "Errors");
	_displayStringsPlural[MarkerSeverity.Warning] = localize('sev.warnings', "Warnings");
	_displayStringsPlural[MarkerSeverity.Info] = localize('sev.infos', "Infos");

	export function toStringPlural(a: MarkerSeverity): string {
		return _displayStringsPlural[a] || '';
	}

	export function fromSeverity(severity: Severity): MarkerSeverity {
		switch (severity) {
			case Severity.Error: return MarkerSeverity.Error;
			case Severity.Warning: return MarkerSeverity.Warning;
			case Severity.Info: return MarkerSeverity.Info;
			case Severity.Ignore: return MarkerSeverity.Hint;
		}
	}

	export function toSeverity(severity: MarkerSeverity): Severity {
		switch (severity) {
			case MarkerSeverity.Error: return Severity.Error;
			case MarkerSeverity.Warning: return Severity.Warning;
			case MarkerSeverity.Info: return Severity.Info;
			case MarkerSeverity.Hint: return Severity.Ignore;
		}
	}
}

/**
 * A structure defining a problem/warning/etc.
 */
export interface IMarkerData {
	code?: string | { value: string; target: URI };
	severity: MarkerSeverity;
	message: string;
	source?: string;
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	modelVersionId?: number;
	relatedInformation?: IRelatedInformation[];
	tags?: MarkerTag[];
	origin?: string | undefined;
}

export interface IResourceMarker {
	resource: URI;
	marker: IMarkerData;
}

export interface IMarker {
	owner: string;
	resource: URI;
	severity: MarkerSeverity;
	code?: string | { value: string; target: URI };
	message: string;
	source?: string;
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	modelVersionId?: number;
	relatedInformation?: IRelatedInformation[];
	tags?: MarkerTag[];
	origin?: string | undefined;
}

export interface MarkerStatistics {
	errors: number;
	warnings: number;
	infos: number;
	unknowns: number;
}

export namespace IMarkerData {
	const emptyString = '';
	export function makeKey(markerData: IMarkerData): string {
		return makeKeyOptionalMessage(markerData, true);
	}

	export function makeKeyOptionalMessage(markerData: IMarkerData, useMessage: boolean): string {
		const result: string[] = [emptyString];
		if (markerData.source) {
			result.push(markerData.source.replace('¦', '\\¦'));
		} else {
			result.push(emptyString);
		}
		if (markerData.code) {
			if (typeof markerData.code === 'string') {
				result.push(markerData.code.replace('¦', '\\¦'));
			} else {
				result.push(markerData.code.value.replace('¦', '\\¦'));
			}
		} else {
			result.push(emptyString);
		}
		if (markerData.severity !== undefined && markerData.severity !== null) {
			result.push(MarkerSeverity.toString(markerData.severity));
		} else {
			result.push(emptyString);
		}

		// Modifed to not include the message as part of the marker key to work around
		// https://github.com/microsoft/vscode/issues/77475
		if (markerData.message && useMessage) {
			result.push(markerData.message.replace('¦', '\\¦'));
		} else {
			result.push(emptyString);
		}
		if (markerData.startLineNumber !== undefined && markerData.startLineNumber !== null) {
			result.push(markerData.startLineNumber.toString());
		} else {
			result.push(emptyString);
		}
		if (markerData.startColumn !== undefined && markerData.startColumn !== null) {
			result.push(markerData.startColumn.toString());
		} else {
			result.push(emptyString);
		}
		if (markerData.endLineNumber !== undefined && markerData.endLineNumber !== null) {
			result.push(markerData.endLineNumber.toString());
		} else {
			result.push(emptyString);
		}
		if (markerData.endColumn !== undefined && markerData.endColumn !== null) {
			result.push(markerData.endColumn.toString());
		} else {
			result.push(emptyString);
		}
		result.push(emptyString);
		return result.join('¦');
	}
}

export const IMarkerService = createDecorator<IMarkerService>('markerService');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/markers/common/markerService.ts]---
Location: vscode-main/src/vs/platform/markers/common/markerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFalsyOrEmpty, isNonEmptyArray } from '../../../base/common/arrays.js';
import { MicrotaskEmitter } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../base/common/map.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IMarker, IMarkerData, IMarkerReadOptions, IMarkerService, IResourceMarker, MarkerSeverity, MarkerStatistics } from './markers.js';

export const unsupportedSchemas = new Set([
	Schemas.inMemory,
	Schemas.vscodeSourceControl,
	Schemas.walkThrough,
	Schemas.walkThroughSnippet,
	Schemas.vscodeChatCodeBlock,
	Schemas.vscodeTerminal
]);

class DoubleResourceMap<V> {

	private _byResource = new ResourceMap<Map<string, V>>();
	private _byOwner = new Map<string, ResourceMap<V>>();

	set(resource: URI, owner: string, value: V) {
		let ownerMap = this._byResource.get(resource);
		if (!ownerMap) {
			ownerMap = new Map();
			this._byResource.set(resource, ownerMap);
		}
		ownerMap.set(owner, value);

		let resourceMap = this._byOwner.get(owner);
		if (!resourceMap) {
			resourceMap = new ResourceMap();
			this._byOwner.set(owner, resourceMap);
		}
		resourceMap.set(resource, value);
	}

	get(resource: URI, owner: string): V | undefined {
		const ownerMap = this._byResource.get(resource);
		return ownerMap?.get(owner);
	}

	delete(resource: URI, owner: string): boolean {
		let removedA = false;
		let removedB = false;
		const ownerMap = this._byResource.get(resource);
		if (ownerMap) {
			removedA = ownerMap.delete(owner);
		}
		const resourceMap = this._byOwner.get(owner);
		if (resourceMap) {
			removedB = resourceMap.delete(resource);
		}
		if (removedA !== removedB) {
			throw new Error('illegal state');
		}
		return removedA && removedB;
	}

	values(key?: URI | string): Iterable<V> {
		if (typeof key === 'string') {
			return this._byOwner.get(key)?.values() ?? Iterable.empty();
		}
		if (URI.isUri(key)) {
			return this._byResource.get(key)?.values() ?? Iterable.empty();
		}

		return Iterable.map(Iterable.concat(...this._byOwner.values()), map => map[1]);
	}
}

class MarkerStats implements MarkerStatistics {

	errors: number = 0;
	infos: number = 0;
	warnings: number = 0;
	unknowns: number = 0;

	private readonly _data = new ResourceMap<MarkerStatistics>();
	private readonly _service: IMarkerService;
	private readonly _subscription: IDisposable;

	constructor(service: IMarkerService) {
		this._service = service;
		this._subscription = service.onMarkerChanged(this._update, this);
	}

	dispose(): void {
		this._subscription.dispose();
	}

	private _update(resources: readonly URI[]): void {
		for (const resource of resources) {
			const oldStats = this._data.get(resource);
			if (oldStats) {
				this._substract(oldStats);
			}
			const newStats = this._resourceStats(resource);
			this._add(newStats);
			this._data.set(resource, newStats);
		}
	}

	private _resourceStats(resource: URI): MarkerStatistics {
		const result: MarkerStatistics = { errors: 0, warnings: 0, infos: 0, unknowns: 0 };

		// TODO this is a hack
		if (unsupportedSchemas.has(resource.scheme)) {
			return result;
		}

		for (const { severity } of this._service.read({ resource })) {
			if (severity === MarkerSeverity.Error) {
				result.errors += 1;
			} else if (severity === MarkerSeverity.Warning) {
				result.warnings += 1;
			} else if (severity === MarkerSeverity.Info) {
				result.infos += 1;
			} else {
				result.unknowns += 1;
			}
		}

		return result;
	}

	private _substract(op: MarkerStatistics) {
		this.errors -= op.errors;
		this.warnings -= op.warnings;
		this.infos -= op.infos;
		this.unknowns -= op.unknowns;
	}

	private _add(op: MarkerStatistics) {
		this.errors += op.errors;
		this.warnings += op.warnings;
		this.infos += op.infos;
		this.unknowns += op.unknowns;
	}
}

export class MarkerService implements IMarkerService {

	declare readonly _serviceBrand: undefined;

	private readonly _onMarkerChanged = new MicrotaskEmitter<readonly URI[]>({
		merge: MarkerService._merge
	});

	readonly onMarkerChanged = this._onMarkerChanged.event;

	private readonly _data = new DoubleResourceMap<IMarker[]>();
	private readonly _stats = new MarkerStats(this);
	private readonly _filteredResources = new ResourceMap<string[]>();

	dispose(): void {
		this._stats.dispose();
		this._onMarkerChanged.dispose();
	}

	getStatistics(): MarkerStatistics {
		return this._stats;
	}

	remove(owner: string, resources: URI[]): void {
		for (const resource of resources || []) {
			this.changeOne(owner, resource, []);
		}
	}

	changeOne(owner: string, resource: URI, markerData: IMarkerData[]): void {

		if (isFalsyOrEmpty(markerData)) {
			// remove marker for this (owner,resource)-tuple
			const removed = this._data.delete(resource, owner);
			if (removed) {
				this._onMarkerChanged.fire([resource]);
			}

		} else {
			// insert marker for this (owner,resource)-tuple
			const markers: IMarker[] = [];
			for (const data of markerData) {
				const marker = MarkerService._toMarker(owner, resource, data);
				if (marker) {
					markers.push(marker);
				}
			}
			this._data.set(resource, owner, markers);
			this._onMarkerChanged.fire([resource]);
		}
	}

	installResourceFilter(resource: URI, reason: string): IDisposable {
		let reasons = this._filteredResources.get(resource);

		if (!reasons) {
			reasons = [];
			this._filteredResources.set(resource, reasons);
		}
		reasons.push(reason);
		this._onMarkerChanged.fire([resource]);

		return toDisposable(() => {
			const reasons = this._filteredResources.get(resource);
			if (!reasons) {
				return;
			}
			const reasonIndex = reasons.indexOf(reason);
			if (reasonIndex !== -1) {
				reasons.splice(reasonIndex, 1);
				if (reasons.length === 0) {
					this._filteredResources.delete(resource);
				}
				this._onMarkerChanged.fire([resource]);
			}
		});
	}

	private static _toMarker(owner: string, resource: URI, data: IMarkerData): IMarker | undefined {
		let {
			code, severity,
			message, source,
			startLineNumber, startColumn, endLineNumber, endColumn,
			relatedInformation,
			modelVersionId,
			tags, origin
		} = data;

		if (!message) {
			return undefined;
		}

		// santize data
		startLineNumber = startLineNumber > 0 ? startLineNumber : 1;
		startColumn = startColumn > 0 ? startColumn : 1;
		endLineNumber = endLineNumber >= startLineNumber ? endLineNumber : startLineNumber;
		endColumn = endColumn > 0 ? endColumn : startColumn;

		return {
			resource,
			owner,
			code,
			severity,
			message,
			source,
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			relatedInformation,
			modelVersionId,
			tags,
			origin
		};
	}

	changeAll(owner: string, data: IResourceMarker[]): void {
		const changes: URI[] = [];

		// remove old marker
		const existing = this._data.values(owner);
		if (existing) {
			for (const data of existing) {
				const first = Iterable.first(data);
				if (first) {
					changes.push(first.resource);
					this._data.delete(first.resource, owner);
				}
			}
		}

		// add new markers
		if (isNonEmptyArray(data)) {

			// group by resource
			const groups = new ResourceMap<IMarker[]>();
			for (const { resource, marker: markerData } of data) {
				const marker = MarkerService._toMarker(owner, resource, markerData);
				if (!marker) {
					// filter bad markers
					continue;
				}
				const array = groups.get(resource);
				if (!array) {
					groups.set(resource, [marker]);
					changes.push(resource);
				} else {
					array.push(marker);
				}
			}

			// insert all
			for (const [resource, value] of groups) {
				this._data.set(resource, owner, value);
			}
		}

		if (changes.length > 0) {
			this._onMarkerChanged.fire(changes);
		}
	}

	/**
	 * Creates an information marker for filtered resources
	 */
	private _createFilteredMarker(resource: URI, reasons: string[]): IMarker {
		const message = reasons.length === 1
			? localize('filtered', "Problems are paused because: \"{0}\"", reasons[0])
			: localize('filtered.network', "Problems are paused because: \"{0}\" and {1} more", reasons[0], reasons.length - 1);

		return {
			owner: 'markersFilter',
			resource,
			severity: MarkerSeverity.Info,
			message,
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: 1,
			endColumn: 1,
		};
	}

	read(filter: IMarkerReadOptions = Object.create(null)): IMarker[] {

		let { owner, resource, severities, take } = filter;

		if (!take || take < 0) {
			take = -1;
		}

		if (owner && resource) {
			// exactly one owner AND resource
			const reasons = !filter.ignoreResourceFilters ? this._filteredResources.get(resource) : undefined;
			if (reasons?.length) {
				const infoMarker = this._createFilteredMarker(resource, reasons);
				return [infoMarker];
			}

			const data = this._data.get(resource, owner);
			if (!data) {
				return [];
			}

			const result: IMarker[] = [];
			for (const marker of data) {
				if (take > 0 && result.length === take) {
					break;
				}
				const reasons = !filter.ignoreResourceFilters ? this._filteredResources.get(resource) : undefined;
				if (reasons?.length) {
					result.push(this._createFilteredMarker(resource, reasons));

				} else if (MarkerService._accept(marker, severities)) {
					result.push(marker);
				}
			}
			return result;

		} else {
			// of one resource OR owner
			const iterable = !owner && !resource
				? this._data.values()
				: this._data.values(resource ?? owner!);

			const result: IMarker[] = [];
			const filtered = new ResourceSet();

			for (const markers of iterable) {
				for (const data of markers) {
					if (filtered.has(data.resource)) {
						continue;
					}
					if (take > 0 && result.length === take) {
						break;
					}
					const reasons = !filter.ignoreResourceFilters ? this._filteredResources.get(data.resource) : undefined;
					if (reasons?.length) {
						result.push(this._createFilteredMarker(data.resource, reasons));
						filtered.add(data.resource);

					} else if (MarkerService._accept(data, severities)) {
						result.push(data);
					}
				}
			}
			return result;
		}
	}

	private static _accept(marker: IMarker, severities?: number): boolean {
		return severities === undefined || (severities & marker.severity) === marker.severity;
	}

	// --- event debounce logic

	private static _merge(all: (readonly URI[])[]): URI[] {
		const set = new ResourceMap<boolean>();
		for (const array of all) {
			for (const item of array) {
				set.set(item, true);
			}
		}
		return Array.from(set.keys());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/markers/test/common/markerService.test.ts]---
Location: vscode-main/src/vs/platform/markers/test/common/markerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IMarkerData, MarkerSeverity } from '../../common/markers.js';
import * as markerService from '../../common/markerService.js';

function randomMarkerData(severity = MarkerSeverity.Error): IMarkerData {
	return {
		severity,
		message: Math.random().toString(16),
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: 1,
		endColumn: 1
	};
}

suite('Marker Service', () => {

	let service: markerService.MarkerService;

	teardown(function () {
		service.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('query', () => {

		service = new markerService.MarkerService();

		service.changeAll('far', [{
			resource: URI.parse('file:///c/test/file.cs'),
			marker: randomMarkerData(MarkerSeverity.Error)
		}]);

		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);
		assert.strictEqual(service.read({ resource: URI.parse('file:///c/test/file.cs') }).length, 1);
		assert.strictEqual(service.read({ owner: 'far', resource: URI.parse('file:///c/test/file.cs') }).length, 1);


		service.changeAll('boo', [{
			resource: URI.parse('file:///c/test/file.cs'),
			marker: randomMarkerData(MarkerSeverity.Warning)
		}]);

		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 1);

		assert.strictEqual(service.read({ severities: MarkerSeverity.Error }).length, 1);
		assert.strictEqual(service.read({ severities: MarkerSeverity.Warning }).length, 1);
		assert.strictEqual(service.read({ severities: MarkerSeverity.Hint }).length, 0);
		assert.strictEqual(service.read({ severities: MarkerSeverity.Error | MarkerSeverity.Warning }).length, 2);

	});


	test('changeOne override', () => {

		service = new markerService.MarkerService();
		service.changeOne('far', URI.parse('file:///path/only.cs'), [randomMarkerData()]);
		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);

		service.changeOne('boo', URI.parse('file:///path/only.cs'), [randomMarkerData()]);
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 1);

		service.changeOne('far', URI.parse('file:///path/only.cs'), [randomMarkerData(), randomMarkerData()]);
		assert.strictEqual(service.read({ owner: 'far' }).length, 2);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 1);

	});

	test('changeOne/All clears', () => {

		service = new markerService.MarkerService();
		service.changeOne('far', URI.parse('file:///path/only.cs'), [randomMarkerData()]);
		service.changeOne('boo', URI.parse('file:///path/only.cs'), [randomMarkerData()]);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 1);
		assert.strictEqual(service.read().length, 2);

		service.changeOne('far', URI.parse('file:///path/only.cs'), []);
		assert.strictEqual(service.read({ owner: 'far' }).length, 0);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 1);
		assert.strictEqual(service.read().length, 1);

		service.changeAll('boo', []);
		assert.strictEqual(service.read({ owner: 'far' }).length, 0);
		assert.strictEqual(service.read({ owner: 'boo' }).length, 0);
		assert.strictEqual(service.read().length, 0);
	});

	test('changeAll sends event for cleared', () => {

		service = new markerService.MarkerService();
		service.changeAll('far', [{
			resource: URI.parse('file:///d/path'),
			marker: randomMarkerData()
		}, {
			resource: URI.parse('file:///d/path'),
			marker: randomMarkerData()
		}]);

		assert.strictEqual(service.read({ owner: 'far' }).length, 2);

		const d = service.onMarkerChanged(changedResources => {
			assert.strictEqual(changedResources.length, 1);
			changedResources.forEach(u => assert.strictEqual(u.toString(), 'file:///d/path'));
			assert.strictEqual(service.read({ owner: 'far' }).length, 0);
		});

		service.changeAll('far', []);

		d.dispose();
	});

	test('changeAll merges', () => {
		service = new markerService.MarkerService();

		service.changeAll('far', [{
			resource: URI.parse('file:///c/test/file.cs'),
			marker: randomMarkerData()
		}, {
			resource: URI.parse('file:///c/test/file.cs'),
			marker: randomMarkerData()
		}]);

		assert.strictEqual(service.read({ owner: 'far' }).length, 2);
	});

	test('changeAll must not break integrety, issue #12635', () => {
		service = new markerService.MarkerService();

		service.changeAll('far', [{
			resource: URI.parse('scheme:path1'),
			marker: randomMarkerData()
		}, {
			resource: URI.parse('scheme:path2'),
			marker: randomMarkerData()
		}]);

		service.changeAll('boo', [{
			resource: URI.parse('scheme:path1'),
			marker: randomMarkerData()
		}]);

		service.changeAll('far', [{
			resource: URI.parse('scheme:path1'),
			marker: randomMarkerData()
		}, {
			resource: URI.parse('scheme:path2'),
			marker: randomMarkerData()
		}]);

		assert.strictEqual(service.read({ owner: 'far' }).length, 2);
		assert.strictEqual(service.read({ resource: URI.parse('scheme:path1') }).length, 2);
	});

	test('invalid marker data', () => {

		const data = randomMarkerData();
		service = new markerService.MarkerService();

		data.message = undefined!;
		service.changeOne('far', URI.parse('some:uri/path'), [data]);
		assert.strictEqual(service.read({ owner: 'far' }).length, 0);

		data.message = null!;
		service.changeOne('far', URI.parse('some:uri/path'), [data]);
		assert.strictEqual(service.read({ owner: 'far' }).length, 0);

		data.message = 'null';
		service.changeOne('far', URI.parse('some:uri/path'), [data]);
		assert.strictEqual(service.read({ owner: 'far' }).length, 1);
	});

	test('MapMap#remove returns bad values, https://github.com/microsoft/vscode/issues/13548', () => {
		service = new markerService.MarkerService();

		service.changeOne('o', URI.parse('some:uri/1'), [randomMarkerData()]);
		service.changeOne('o', URI.parse('some:uri/2'), []);

	});

	test('Error code of zero in markers get removed, #31275', function () {
		const data = <IMarkerData>{
			code: '0',
			startLineNumber: 1,
			startColumn: 2,
			endLineNumber: 1,
			endColumn: 5,
			message: 'test',
			severity: 0 as MarkerSeverity,
			source: 'me'
		};
		service = new markerService.MarkerService();

		service.changeOne('far', URI.parse('some:thing'), [data]);
		const marker = service.read({ resource: URI.parse('some:thing') });

		assert.strictEqual(marker.length, 1);
		assert.strictEqual(marker[0].code, '0');
	});

	test('modelVersionId is preserved on IMarker when present in IMarkerData', () => {
		service = new markerService.MarkerService();
		const resource = URI.parse('file:///path/file.ts');

		// Test with modelVersionId present
		const dataWithVersion: IMarkerData = {
			...randomMarkerData(),
			modelVersionId: 42
		};
		service.changeOne('owner', resource, [dataWithVersion]);

		const markersWithVersion = service.read({ resource });
		assert.strictEqual(markersWithVersion.length, 1);
		assert.strictEqual(markersWithVersion[0].modelVersionId, 42);

		// Test without modelVersionId (should be undefined)
		const dataWithoutVersion: IMarkerData = randomMarkerData();
		service.changeOne('owner', resource, [dataWithoutVersion]);

		const markersWithoutVersion = service.read({ resource });
		assert.strictEqual(markersWithoutVersion.length, 1);
		assert.strictEqual(markersWithoutVersion[0].modelVersionId, undefined);
	});

	test('resource filter hides markers for the filtered resource', () => {
		service = new markerService.MarkerService();
		const resource1 = URI.parse('file:///path/file1.cs');
		const resource2 = URI.parse('file:///path/file2.cs');

		// Add markers to both resources
		service.changeOne('owner1', resource1, [randomMarkerData()]);
		service.changeOne('owner1', resource2, [randomMarkerData()]);

		// Verify both resources have markers
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ resource: resource1 }).length, 1);
		assert.strictEqual(service.read({ resource: resource2 }).length, 1);

		// Install filter for resource1
		const filter = service.installResourceFilter(resource1, 'Test filter');

		// Verify resource1 markers are filtered out, but have 1 info marker instead
		assert.strictEqual(service.read().length, 2); // 1 real + 1 info
		assert.strictEqual(service.read({ resource: resource1 }).length, 1); // 1 info
		assert.strictEqual(service.read({ resource: resource2 }).length, 1);

		// Dispose filter
		filter.dispose();

		// Verify resource1 markers are visible again
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ resource: resource1 }).length, 1);
		assert.strictEqual(service.read({ resource: resource2 }).length, 1);
	});

	test('resource filter hides markers for the filtered resource UNLESS explicit read', () => {
		service = new markerService.MarkerService();
		const resource1 = URI.parse('file:///path/file1.cs');
		const resource2 = URI.parse('file:///path/file2.cs');

		// Add markers to both resources
		service.changeOne('owner1', resource1, [randomMarkerData()]);
		service.changeOne('owner1', resource2, [randomMarkerData()]);

		// Verify both resources have markers
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ resource: resource1 }).length, 1);
		assert.strictEqual(service.read({ resource: resource2 }).length, 1);

		// Install filter for resource1
		const filter = service.installResourceFilter(resource1, 'Test filter');

		// Verify resource1 markers are filtered out, but have 1 info marker instead
		assert.strictEqual(service.read().length, 2); // 1 real + 1 info
		assert.strictEqual(service.read({ resource: resource1 }).length, 1); // 1 info
		assert.strictEqual(service.read({ resource: resource2 }).length, 1);

		// Verify resource1 markers are visible again
		assert.strictEqual(service.read({ ignoreResourceFilters: true }).length, 2);
		assert.strictEqual(service.read({ resource: resource1, ignoreResourceFilters: true }).length, 1);
		assert.strictEqual(service.read({ resource: resource1, ignoreResourceFilters: true })[0].severity, MarkerSeverity.Error);
		assert.strictEqual(service.read({ resource: resource2, ignoreResourceFilters: true }).length, 1);
		assert.strictEqual(service.read({ resource: resource2, ignoreResourceFilters: true })[0].severity, MarkerSeverity.Error);

		// Dispose filter
		filter.dispose();
	});

	test('resource filter affects all filter combinations', () => {
		service = new markerService.MarkerService();
		const resource = URI.parse('file:///path/file.cs');

		service.changeOne('owner1', resource, [randomMarkerData(MarkerSeverity.Error)]);
		service.changeOne('owner2', resource, [randomMarkerData(MarkerSeverity.Warning)]);

		// Verify initial state
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ resource }).length, 2);
		assert.strictEqual(service.read({ owner: 'owner1' }).length, 1);
		assert.strictEqual(service.read({ owner: 'owner2' }).length, 1);
		assert.strictEqual(service.read({ owner: 'owner1', resource }).length, 1);
		assert.strictEqual(service.read({ severities: MarkerSeverity.Error }).length, 1);
		assert.strictEqual(service.read({ severities: MarkerSeverity.Warning }).length, 1);

		// Install filter
		const filter = service.installResourceFilter(resource, 'Filter reason');

		// Verify information marker is shown for resource queries
		assert.strictEqual(service.read().length, 1); // 1 info marker
		assert.strictEqual(service.read({ resource }).length, 1); // 1 info marker
		assert.strictEqual(service.read({ owner: 'owner1' }).length, 1); // 1 info marker
		assert.strictEqual(service.read({ owner: 'owner2' }).length, 1); // 1 info marker

		// Verify owner+resource query returns an info marker for filtered resources
		const ownerResourceMarkers = service.read({ owner: 'owner1', resource });
		assert.strictEqual(ownerResourceMarkers.length, 1);
		assert.strictEqual(ownerResourceMarkers[0].severity, MarkerSeverity.Info);
		assert.strictEqual(ownerResourceMarkers[0].owner, 'markersFilter');

		assert.strictEqual(service.read({ severities: MarkerSeverity.Error }).length, 1); // 1 info marker
		assert.strictEqual(service.read({ severities: MarkerSeverity.Warning }).length, 1); // 1 info marker
		assert.strictEqual(service.read({ severities: MarkerSeverity.Info }).length, 1); // Our info marker

		// Remove filter and verify markers are visible again
		filter.dispose();
		assert.strictEqual(service.read().length, 2);
	});

	test('multiple filters for same resource are handled correctly', () => {
		service = new markerService.MarkerService();
		const resource = URI.parse('file:///path/file.cs');

		// Add marker to resource
		service.changeOne('owner1', resource, [randomMarkerData()]);

		// Verify resource has markers
		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ resource }).length, 1);

		// Install two filters for the same resource
		const filter1 = service.installResourceFilter(resource, 'First filter');
		const filter2 = service.installResourceFilter(resource, 'Second filter');

		// Verify resource markers are filtered out but info marker is shown
		assert.strictEqual(service.read().length, 1); // 1 info marker
		assert.strictEqual(service.read({ resource }).length, 1); // 1 info marker

		// Dispose only one filter
		filter1.dispose();

		// Verify resource markers are still filtered out because one filter remains
		assert.strictEqual(service.read().length, 1); // still 1 info marker
		assert.strictEqual(service.read({ resource }).length, 1); // still 1 info marker

		// Dispose the second filter
		filter2.dispose();

		// Now all filters are gone, so markers should be visible again
		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ resource }).length, 1);
	});

	test('resource filter with reason shows info marker when markers are filtered', () => {
		service = new markerService.MarkerService();
		const resource = URI.parse('file:///path/file.cs');

		// Add error and warning to the resource
		service.changeOne('owner1', resource, [
			randomMarkerData(MarkerSeverity.Error),
			randomMarkerData(MarkerSeverity.Warning)
		]);

		// Verify initial state
		assert.strictEqual(service.read().length, 2);
		assert.strictEqual(service.read({ resource }).length, 2);

		// Apply a filter with reason
		const filterReason = 'Test filter reason';
		const filter = service.installResourceFilter(resource, filterReason);

		// Verify that we get a single info marker with our reason
		const markers = service.read({ resource });
		assert.strictEqual(markers.length, 1);
		assert.strictEqual(markers[0].severity, MarkerSeverity.Info);
		assert.ok(markers[0].message.includes(filterReason));

		// Remove filter and verify the original markers are back
		filter.dispose();
		assert.strictEqual(service.read({ resource }).length, 2);
	});

	test('reading all markers shows info marker for filtered resources', () => {
		service = new markerService.MarkerService();
		const resource1 = URI.parse('file:///path/file1.cs');
		const resource2 = URI.parse('file:///path/file2.cs');

		// Add markers to both resources
		service.changeOne('owner1', resource1, [randomMarkerData()]);
		service.changeOne('owner1', resource2, [randomMarkerData()]);

		// Verify initial state
		assert.strictEqual(service.read().length, 2);

		// Filter one resource with a reason
		const filterReason = 'Resource is being edited';
		const filter = service.installResourceFilter(resource1, filterReason);

		// Read all markers
		const allMarkers = service.read();

		// Should have 2 markers - one real marker and one info marker
		assert.strictEqual(allMarkers.length, 2);

		// Find the info marker
		const infoMarker = allMarkers.find(marker =>
			marker.owner === 'markersFilter' &&
			marker.severity === MarkerSeverity.Info
		);

		// Verify the info marker
		assert.ok(infoMarker);
		assert.strictEqual(infoMarker?.resource.toString(), resource1.toString());
		assert.ok(infoMarker?.message.includes(filterReason));

		// Remove filter
		filter.dispose();
	});

	test('out of order filter disposal works correctly', () => {
		service = new markerService.MarkerService();
		const resource = URI.parse('file:///path/file.cs');

		// Add marker to resource
		service.changeOne('owner1', resource, [randomMarkerData()]);

		// Verify resource has markers
		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ resource }).length, 1);

		// Install three filters for the same resource
		const filter1 = service.installResourceFilter(resource, 'First filter');
		const filter2 = service.installResourceFilter(resource, 'Second filter');
		const filter3 = service.installResourceFilter(resource, 'Third filter');

		// Verify resource markers are filtered out but info marker is shown
		assert.strictEqual(service.read().length, 1); // 1 info marker
		assert.strictEqual(service.read({ resource }).length, 1); // 1 info marker

		// Dispose filters in a different order than they were created
		filter2.dispose();  // Remove the second filter first

		// Verify resource markers are still filtered out with 2 filters remaining
		assert.strictEqual(service.read().length, 1); // still 1 info marker
		assert.strictEqual(service.read({ resource }).length, 1); // still 1 info marker

		// Check if message contains the correct count of filters
		const markers = service.read({ resource });
		assert.ok(markers[0].message.includes('Problems are paused because'));

		// Remove remaining filters in any order
		filter3.dispose();
		filter1.dispose();

		// Now all filters are gone, so markers should be visible again
		assert.strictEqual(service.read().length, 1);
		assert.strictEqual(service.read({ resource }).length, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/allowedMcpServersService.ts]---
Location: vscode-main/src/vs/platform/mcp/common/allowedMcpServersService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import * as nls from '../../../nls.js';
import { createCommandUri, IMarkdownString, MarkdownString } from '../../../base/common/htmlContent.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { Emitter } from '../../../base/common/event.js';
import { IAllowedMcpServersService, IGalleryMcpServer, IInstallableMcpServer, ILocalMcpServer, mcpAccessConfig, McpAccessValue } from './mcpManagement.js';

export class AllowedMcpServersService extends Disposable implements IAllowedMcpServersService {

	_serviceBrand: undefined;

	private _onDidChangeAllowedMcpServers = this._register(new Emitter<void>());
	readonly onDidChangeAllowedMcpServers = this._onDidChangeAllowedMcpServers.event;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(mcpAccessConfig)) {
				this._onDidChangeAllowedMcpServers.fire();
			}
		}));
	}

	isAllowed(mcpServer: IGalleryMcpServer | ILocalMcpServer | IInstallableMcpServer): true | IMarkdownString {
		if (this.configurationService.getValue(mcpAccessConfig) !== McpAccessValue.None) {
			return true;
		}

		const settingsCommandLink = createCommandUri('workbench.action.openSettings', { query: `@id:${mcpAccessConfig}` }).toString();
		return new MarkdownString(nls.localize('mcp servers are not allowed', "Model Context Protocol servers are disabled in the Editor. Please check your [settings]({0}).", settingsCommandLink));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpGalleryManifest.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpGalleryManifest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const enum McpGalleryResourceType {
	McpServersQueryService = 'McpServersQueryService',
	McpServerWebUri = 'McpServerWebUriTemplate',
	McpServerVersionUri = 'McpServerVersionUriTemplate',
	McpServerIdUri = 'McpServerIdUriTemplate',
	McpServerLatestVersionUri = 'McpServerLatestVersionUriTemplate',
	McpServerNamedResourceUri = 'McpServerNamedResourceUriTemplate',
	PublisherUriTemplate = 'PublisherUriTemplate',
	ContactSupportUri = 'ContactSupportUri',
	PrivacyPolicyUri = 'PrivacyPolicyUri',
	TermsOfServiceUri = 'TermsOfServiceUri',
	ReportUri = 'ReportUri',
}

export type McpGalleryManifestResource = {
	readonly id: string;
	readonly type: string;
};

export interface IMcpGalleryManifest {
	readonly version: string;
	readonly url: string;
	readonly resources: readonly McpGalleryManifestResource[];
}

export const enum McpGalleryManifestStatus {
	Available = 'available',
	Unavailable = 'unavailable'
}

export const IMcpGalleryManifestService = createDecorator<IMcpGalleryManifestService>('IMcpGalleryManifestService');

export interface IMcpGalleryManifestService {
	readonly _serviceBrand: undefined;

	readonly mcpGalleryManifestStatus: McpGalleryManifestStatus;
	readonly onDidChangeMcpGalleryManifestStatus: Event<McpGalleryManifestStatus>;
	readonly onDidChangeMcpGalleryManifest: Event<IMcpGalleryManifest | null>;
	getMcpGalleryManifest(): Promise<IMcpGalleryManifest | null>;
}

export function getMcpGalleryManifestResourceUri(manifest: IMcpGalleryManifest, type: string): string | undefined {
	const [name, version] = type.split('/');
	for (const resource of manifest.resources) {
		const [r, v] = resource.type.split('/');
		if (r !== name) {
			continue;
		}
		if (!version || v === version) {
			return resource.id;
		}
		break;
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpGalleryManifestService.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpGalleryManifestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IRequestService, isSuccess } from '../../request/common/request.js';
import { McpGalleryResourceType, IMcpGalleryManifest, IMcpGalleryManifestService, McpGalleryManifestStatus } from './mcpGalleryManifest.js';

const SUPPORTED_VERSIONS = [
	'v0.1',
	'v0',
];

export class McpGalleryManifestService extends Disposable implements IMcpGalleryManifestService {

	readonly _serviceBrand: undefined;
	readonly onDidChangeMcpGalleryManifest = Event.None;
	readonly onDidChangeMcpGalleryManifestStatus = Event.None;

	private readonly versionByUrl = new Map<string, Promise<string>>();

	get mcpGalleryManifestStatus(): McpGalleryManifestStatus {
		return !!this.productService.mcpGallery?.serviceUrl ? McpGalleryManifestStatus.Available : McpGalleryManifestStatus.Unavailable;
	}

	constructor(
		@IProductService private readonly productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService protected readonly logService: ILogService,
	) {
		super();
	}

	async getMcpGalleryManifest(): Promise<IMcpGalleryManifest | null> {
		if (!this.productService.mcpGallery) {
			return null;
		}
		return this.createMcpGalleryManifest(this.productService.mcpGallery.serviceUrl, SUPPORTED_VERSIONS[0]);
	}

	protected async createMcpGalleryManifest(url: string, version?: string): Promise<IMcpGalleryManifest> {
		url = url.endsWith('/') ? url.slice(0, -1) : url;

		if (!version) {
			let versionPromise = this.versionByUrl.get(url);
			if (!versionPromise) {
				this.versionByUrl.set(url, versionPromise = this.getVersion(url));
			}
			version = await versionPromise;
		}

		const isProductGalleryUrl = this.productService.mcpGallery?.serviceUrl === url;
		const serversUrl = `${url}/${version}/servers`;
		const resources = [
			{
				id: serversUrl,
				type: McpGalleryResourceType.McpServersQueryService
			},
			{
				id: `${serversUrl}/{name}/versions/{version}`,
				type: McpGalleryResourceType.McpServerVersionUri
			},
			{
				id: `${serversUrl}/{name}/versions/latest`,
				type: McpGalleryResourceType.McpServerLatestVersionUri
			}
		];

		if (isProductGalleryUrl) {
			resources.push({
				id: `${serversUrl}/by-name/{name}`,
				type: McpGalleryResourceType.McpServerNamedResourceUri
			});
			resources.push({
				id: this.productService.mcpGallery.itemWebUrl,
				type: McpGalleryResourceType.McpServerWebUri
			});
			resources.push({
				id: this.productService.mcpGallery.publisherUrl,
				type: McpGalleryResourceType.PublisherUriTemplate
			});
			resources.push({
				id: this.productService.mcpGallery.supportUrl,
				type: McpGalleryResourceType.ContactSupportUri
			});
			resources.push({
				id: this.productService.mcpGallery.supportUrl,
				type: McpGalleryResourceType.ContactSupportUri
			});
			resources.push({
				id: this.productService.mcpGallery.privacyPolicyUrl,
				type: McpGalleryResourceType.PrivacyPolicyUri
			});
			resources.push({
				id: this.productService.mcpGallery.termsOfServiceUrl,
				type: McpGalleryResourceType.TermsOfServiceUri
			});
			resources.push({
				id: this.productService.mcpGallery.reportUrl,
				type: McpGalleryResourceType.ReportUri
			});
		}

		if (version === 'v0') {
			resources.push({
				id: `${serversUrl}/{id}`,
				type: McpGalleryResourceType.McpServerIdUri
			});
		}

		return {
			version,
			url,
			resources
		};
	}

	private async getVersion(url: string): Promise<string> {
		for (const version of SUPPORTED_VERSIONS) {
			if (await this.checkVersion(url, version)) {
				return version;
			}
		}
		return SUPPORTED_VERSIONS[0];
	}

	private async checkVersion(url: string, version: string): Promise<boolean> {
		try {
			const context = await this.requestService.request({
				type: 'GET',
				url: `${url}/${version}/servers?limit=1`,
			}, CancellationToken.None);
			if (isSuccess(context)) {
				return true;
			}
			this.logService.info(`The service at ${url} does not support version ${version}. Service returned status ${context.res.statusCode}.`);
		} catch (error) {
			this.logService.error(error);
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpGalleryManifestServiceIpc.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpGalleryManifestServiceIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IChannelServer } from '../../../base/parts/ipc/common/ipc.js';
import { IMcpGalleryManifest, IMcpGalleryManifestService, McpGalleryManifestStatus } from './mcpGalleryManifest.js';

export class McpGalleryManifestIPCService extends Disposable implements IMcpGalleryManifestService {

	declare readonly _serviceBrand: undefined;

	private _onDidChangeMcpGalleryManifest = this._register(new Emitter<IMcpGalleryManifest | null>());
	readonly onDidChangeMcpGalleryManifest = this._onDidChangeMcpGalleryManifest.event;

	private _onDidChangeMcpGalleryManifestStatus = this._register(new Emitter<McpGalleryManifestStatus>());
	readonly onDidChangeMcpGalleryManifestStatus = this._onDidChangeMcpGalleryManifestStatus.event;

	private _mcpGalleryManifest: IMcpGalleryManifest | null | undefined;
	private readonly barrier = new Barrier();

	get mcpGalleryManifestStatus(): McpGalleryManifestStatus {
		return this._mcpGalleryManifest ? McpGalleryManifestStatus.Available : McpGalleryManifestStatus.Unavailable;
	}

	constructor(server: IChannelServer<unknown>) {
		super();
		server.registerChannel('mcpGalleryManifest', {
			listen: () => Event.None,
			call: async <T>(context: unknown, command: string, args?: unknown): Promise<T> => {
				switch (command) {
					case 'setMcpGalleryManifest': {
						const manifest = Array.isArray(args) ? args[0] as IMcpGalleryManifest | null : null;
						return Promise.resolve(this.setMcpGalleryManifest(manifest)) as T;
					}
				}
				throw new Error('Invalid call');
			}
		});
	}

	async getMcpGalleryManifest(): Promise<IMcpGalleryManifest | null> {
		await this.barrier.wait();
		return this._mcpGalleryManifest ?? null;
	}

	private setMcpGalleryManifest(manifest: IMcpGalleryManifest | null): void {
		this._mcpGalleryManifest = manifest;
		this._onDidChangeMcpGalleryManifest.fire(manifest);
		this._onDidChangeMcpGalleryManifestStatus.fire(this.mcpGalleryManifestStatus);
		this.barrier.open();
	}

}
```

--------------------------------------------------------------------------------

````

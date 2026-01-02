---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 538
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 538 of 552)

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

---[FILE: src/vs/workbench/services/views/browser/viewDescriptorService.ts]---
Location: vscode-main/src/vs/workbench/services/views/browser/viewDescriptorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ViewContainerLocation, IViewDescriptorService, ViewContainer, IViewsRegistry, IViewContainersRegistry, IViewDescriptor, Extensions as ViewExtensions, ViewVisibilityState, defaultViewIcon, ViewContainerLocationToString, VIEWS_LOG_ID, VIEWS_LOG_NAME } from '../../../common/views.js';
import { IContextKey, RawContextKey, IContextKeyService, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { toDisposable, DisposableStore, Disposable, IDisposable, DisposableMap } from '../../../../base/common/lifecycle.js';
import { ViewPaneContainer, ViewPaneContainerAction, ViewsSubMenu } from '../../../browser/parts/views/viewPaneContainer.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { getViewsStateStorageId, ViewContainerModel } from '../common/viewContainerModel.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { localize, localize2 } from '../../../../nls.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { IViewsService } from '../common/viewsService.js';
import { windowLogGroup } from '../../log/common/logConstants.js';

interface IViewsCustomizations {
	viewContainerLocations: IStringDictionary<ViewContainerLocation>;
	viewLocations: IStringDictionary<string>;
	viewContainerBadgeEnablementStates: IStringDictionary<boolean>;
}

function getViewContainerStorageId(viewContainerId: string): string { return `${viewContainerId}.state`; }

export class ViewDescriptorService extends Disposable implements IViewDescriptorService {

	declare readonly _serviceBrand: undefined;

	private static readonly VIEWS_CUSTOMIZATIONS = 'views.customizations';
	private static readonly COMMON_CONTAINER_ID_PREFIX = 'workbench.views.service';

	private readonly _onDidChangeContainer: Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._register(new Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>());
	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._onDidChangeContainer.event;

	private readonly _onDidChangeLocation: Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }> = this._register(new Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>());
	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }> = this._onDidChangeLocation.event;

	private readonly _onDidChangeContainerLocation: Emitter<{ viewContainer: ViewContainer; from: ViewContainerLocation; to: ViewContainerLocation }> = this._register(new Emitter<{ viewContainer: ViewContainer; from: ViewContainerLocation; to: ViewContainerLocation }>());
	readonly onDidChangeContainerLocation: Event<{ viewContainer: ViewContainer; from: ViewContainerLocation; to: ViewContainerLocation }> = this._onDidChangeContainerLocation.event;

	private readonly viewContainerModels = this._register(new DisposableMap<ViewContainer, { viewContainerModel: ViewContainerModel; disposables: DisposableStore } & IDisposable>());
	private readonly viewsVisibilityActionDisposables = this._register(new DisposableMap<ViewContainer, IDisposable>());
	private canRegisterViewsVisibilityActions: boolean = false;
	private readonly activeViewContextKeys: Map<string, IContextKey<boolean>>;
	private readonly movableViewContextKeys: Map<string, IContextKey<boolean>>;
	private readonly defaultViewLocationContextKeys: Map<string, IContextKey<boolean>>;
	private readonly defaultViewContainerLocationContextKeys: Map<string, IContextKey<boolean>>;

	private readonly viewsRegistry: IViewsRegistry;
	private readonly viewContainersRegistry: IViewContainersRegistry;

	private viewContainersCustomLocations: Map<string, ViewContainerLocation>;
	private viewDescriptorsCustomLocations: Map<string, string>;
	private viewContainerBadgeEnablementStates: Map<string, boolean>;

	private readonly _onDidChangeViewContainers = this._register(new Emitter<{ added: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }>; removed: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }> }>());
	readonly onDidChangeViewContainers = this._onDidChangeViewContainers.event;
	get viewContainers(): ReadonlyArray<ViewContainer> { return this.viewContainersRegistry.all; }

	private readonly logger: Lazy<ILogger>;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILoggerService loggerService: ILoggerService,
	) {
		super();

		this.logger = new Lazy(() => loggerService.createLogger(VIEWS_LOG_ID, { name: VIEWS_LOG_NAME, group: windowLogGroup }));

		this.activeViewContextKeys = new Map<string, IContextKey<boolean>>();
		this.movableViewContextKeys = new Map<string, IContextKey<boolean>>();
		this.defaultViewLocationContextKeys = new Map<string, IContextKey<boolean>>();
		this.defaultViewContainerLocationContextKeys = new Map<string, IContextKey<boolean>>();

		this.viewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry);
		this.viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);

		this.migrateToViewsCustomizationsStorage();
		this.viewContainersCustomLocations = new Map<string, ViewContainerLocation>(Object.entries(this.viewCustomizations.viewContainerLocations));
		this.viewDescriptorsCustomLocations = new Map<string, string>(Object.entries(this.viewCustomizations.viewLocations));
		this.viewContainerBadgeEnablementStates = new Map<string, boolean>(Object.entries(this.viewCustomizations.viewContainerBadgeEnablementStates));

		// Register all containers that were registered before this ctor
		this.viewContainers.forEach(viewContainer => this.onDidRegisterViewContainer(viewContainer));

		this._register(this.viewsRegistry.onViewsRegistered(views => this.onDidRegisterViews(views)));
		this._register(this.viewsRegistry.onViewsDeregistered(({ views, viewContainer }) => this.onDidDeregisterViews(views, viewContainer)));

		this._register(this.viewsRegistry.onDidChangeContainer(({ views, from, to }) => this.onDidChangeDefaultContainer(views, from, to)));

		this._register(this.viewContainersRegistry.onDidRegister(({ viewContainer }) => {
			this.onDidRegisterViewContainer(viewContainer);
			this._onDidChangeViewContainers.fire({ added: [{ container: viewContainer, location: this.getViewContainerLocation(viewContainer) }], removed: [] });
		}));

		this._register(this.viewContainersRegistry.onDidDeregister(({ viewContainer, viewContainerLocation }) => {
			this.onDidDeregisterViewContainer(viewContainer);
			this._onDidChangeViewContainers.fire({ removed: [{ container: viewContainer, location: viewContainerLocation }], added: [] });
		}));

		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, ViewDescriptorService.VIEWS_CUSTOMIZATIONS, this._store)(() => this.onDidStorageChange()));

		this.extensionService.whenInstalledExtensionsRegistered().then(() => this.whenExtensionsRegistered());

	}

	private migrateToViewsCustomizationsStorage(): void {
		if (this.storageService.get(ViewDescriptorService.VIEWS_CUSTOMIZATIONS, StorageScope.PROFILE)) {
			return;
		}

		const viewContainerLocationsValue = this.storageService.get('views.cachedViewContainerLocations', StorageScope.PROFILE);
		const viewDescriptorLocationsValue = this.storageService.get('views.cachedViewPositions', StorageScope.PROFILE);
		if (!viewContainerLocationsValue && !viewDescriptorLocationsValue) {
			return;
		}

		const viewContainerLocations: [string, ViewContainerLocation][] = viewContainerLocationsValue ? JSON.parse(viewContainerLocationsValue) : [];
		const viewDescriptorLocations: [string, { containerId: string }][] = viewDescriptorLocationsValue ? JSON.parse(viewDescriptorLocationsValue) : [];
		const viewsCustomizations: IViewsCustomizations = {
			viewContainerLocations: viewContainerLocations.reduce<IStringDictionary<ViewContainerLocation>>((result, [id, location]) => { result[id] = location; return result; }, {}),
			viewLocations: viewDescriptorLocations.reduce<IStringDictionary<string>>((result, [id, { containerId }]) => { result[id] = containerId; return result; }, {}),
			viewContainerBadgeEnablementStates: {}
		};
		this.storageService.store(ViewDescriptorService.VIEWS_CUSTOMIZATIONS, JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);
		this.storageService.remove('views.cachedViewContainerLocations', StorageScope.PROFILE);
		this.storageService.remove('views.cachedViewPositions', StorageScope.PROFILE);
	}

	private registerGroupedViews(groupedViews: Map<string, IViewDescriptor[]>): void {
		for (const [containerId, views] of groupedViews.entries()) {
			const viewContainer = this.viewContainersRegistry.get(containerId);

			// The container has not been registered yet
			if (!viewContainer || !this.viewContainerModels.has(viewContainer)) {
				// Register if the container is a genarated container
				if (this.isGeneratedContainerId(containerId)) {
					const viewContainerLocation = this.viewContainersCustomLocations.get(containerId);
					if (viewContainerLocation !== undefined) {
						this.registerGeneratedViewContainer(viewContainerLocation, containerId);
					}
				}
				// Registration of the container handles registration of its views
				continue;
			}

			// Filter out views that have already been added to the view container model
			// This is needed when statically-registered views are moved to
			// other statically registered containers as they will both try to add on startup
			const viewsToAdd = views.filter(view => this.getViewContainerModel(viewContainer).allViewDescriptors.filter(vd => vd.id === view.id).length === 0);
			this.addViews(viewContainer, viewsToAdd);
		}
	}

	private deregisterGroupedViews(groupedViews: Map<string, IViewDescriptor[]>): void {
		for (const [viewContainerId, views] of groupedViews.entries()) {
			const viewContainer = this.viewContainersRegistry.get(viewContainerId);

			// The container has not been registered yet
			if (!viewContainer || !this.viewContainerModels.has(viewContainer)) {
				continue;
			}

			this.removeViews(viewContainer, views);
		}
	}

	private moveOrphanViewsToDefaultLocation(): void {
		for (const [viewId, containerId] of this.viewDescriptorsCustomLocations.entries()) {
			// check if the view container exists
			if (this.viewContainersRegistry.get(containerId)) {
				continue;
			}

			// check if view has been registered to default location
			const viewContainer = this.viewsRegistry.getViewContainer(viewId);
			const viewDescriptor = this.getViewDescriptorById(viewId);
			if (viewContainer && viewDescriptor) {
				this.addViews(viewContainer, [viewDescriptor]);
			}
		}
	}

	whenExtensionsRegistered(): void {

		// Handle those views whose custom parent view container does not exist anymore
		// May be the extension contributing this view container is no longer installed
		// Or the parent view container is generated and no longer available.
		this.moveOrphanViewsToDefaultLocation();

		// Clean up empty generated view containers
		for (const viewContainerId of [...this.viewContainersCustomLocations.keys()]) {
			this.cleanUpGeneratedViewContainer(viewContainerId);
		}

		// Save updated view customizations after cleanup
		this.saveViewCustomizations();

		// Register visibility actions for all views
		for (const [key, value] of this.viewContainerModels) {
			this.registerViewsVisibilityActions(key, value);
		}
		this.canRegisterViewsVisibilityActions = true;
	}

	private onDidRegisterViews(views: { views: IViewDescriptor[]; viewContainer: ViewContainer }[]): void {
		this.contextKeyService.bufferChangeEvents(() => {
			views.forEach(({ views, viewContainer }) => {
				// When views are registered, we need to regroup them based on the customizations
				const regroupedViews = this.regroupViews(viewContainer.id, views);

				// Once they are grouped, try registering them which occurs
				// if the container has already been registered within this service
				// or we can generate the container from the source view id
				this.registerGroupedViews(regroupedViews);

				views.forEach(viewDescriptor => this.getOrCreateMovableViewContextKey(viewDescriptor).set(!!viewDescriptor.canMoveView));
			});
		});
	}

	private isGeneratedContainerId(id: string): boolean {
		return id.startsWith(ViewDescriptorService.COMMON_CONTAINER_ID_PREFIX);
	}

	private onDidDeregisterViews(views: IViewDescriptor[], viewContainer: ViewContainer): void {
		// When views are registered, we need to regroup them based on the customizations
		const regroupedViews = this.regroupViews(viewContainer.id, views);
		this.deregisterGroupedViews(regroupedViews);
		this.contextKeyService.bufferChangeEvents(() => {
			views.forEach(viewDescriptor => this.getOrCreateMovableViewContextKey(viewDescriptor).set(false));
		});
	}

	private regroupViews(containerId: string, views: IViewDescriptor[]): Map<string, IViewDescriptor[]> {
		const viewsByContainer = new Map<string, IViewDescriptor[]>();

		for (const viewDescriptor of views) {
			const correctContainerId = this.viewDescriptorsCustomLocations.get(viewDescriptor.id) ?? containerId;
			let containerViews = viewsByContainer.get(correctContainerId);
			if (!containerViews) {
				viewsByContainer.set(correctContainerId, containerViews = []);
			}
			containerViews.push(viewDescriptor);
		}

		return viewsByContainer;
	}

	getViewDescriptorById(viewId: string): IViewDescriptor | null {
		return this.viewsRegistry.getView(viewId);
	}

	getViewLocationById(viewId: string): ViewContainerLocation | null {
		const container = this.getViewContainerByViewId(viewId);
		if (container === null) {
			return null;
		}

		return this.getViewContainerLocation(container);
	}

	getViewContainerByViewId(viewId: string): ViewContainer | null {
		const containerId = this.viewDescriptorsCustomLocations.get(viewId);

		return containerId ?
			this.viewContainersRegistry.get(containerId) ?? null :
			this.getDefaultContainerById(viewId);
	}

	getViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation {
		return this.viewContainersCustomLocations.get(viewContainer.id) ?? this.getDefaultViewContainerLocation(viewContainer);
	}

	getDefaultViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation {
		return this.viewContainersRegistry.getViewContainerLocation(viewContainer);
	}

	getDefaultContainerById(viewId: string): ViewContainer | null {
		return this.viewsRegistry.getViewContainer(viewId) ?? null;
	}

	getViewContainerModel(container: ViewContainer): ViewContainerModel {
		return this.getOrRegisterViewContainerModel(container);
	}

	getViewContainerById(id: string): ViewContainer | null {
		return this.viewContainersRegistry.get(id) || null;
	}

	getViewContainersByLocation(location: ViewContainerLocation): ViewContainer[] {
		return this.viewContainers.filter(v => this.getViewContainerLocation(v) === location);
	}

	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined {
		return this.viewContainersRegistry.getDefaultViewContainer(location);
	}

	moveViewContainerToLocation(viewContainer: ViewContainer, location: ViewContainerLocation, requestedIndex?: number, reason?: string): void {
		this.logger.value.trace(`moveViewContainerToLocation: viewContainer:${viewContainer.id} location:${location} reason:${reason}`);
		this.moveViewContainerToLocationWithoutSaving(viewContainer, location, requestedIndex);
		this.saveViewCustomizations();
	}

	getViewContainerBadgeEnablementState(id: string): boolean {
		return this.viewContainerBadgeEnablementStates.get(id) ?? true;
	}

	setViewContainerBadgeEnablementState(id: string, badgesEnabled: boolean): void {
		this.viewContainerBadgeEnablementStates.set(id, badgesEnabled);
		this.saveViewCustomizations();
	}

	moveViewToLocation(view: IViewDescriptor, location: ViewContainerLocation, reason?: string): void {
		this.logger.value.trace(`moveViewToLocation: view:${view.id} location:${location} reason:${reason}`);
		const container = this.registerGeneratedViewContainer(location);
		this.moveViewsToContainer([view], container);
	}

	moveViewsToContainer(views: IViewDescriptor[], viewContainer: ViewContainer, visibilityState?: ViewVisibilityState, reason?: string): void {
		if (!views.length) {
			return;
		}

		this.logger.value.trace(`moveViewsToContainer: views:${views.map(view => view.id).join(',')} viewContainer:${viewContainer.id} reason:${reason}`);

		const from = this.getViewContainerByViewId(views[0].id);
		const to = viewContainer;

		if (from && to && from !== to) {
			// Move views
			this.moveViewsWithoutSaving(views, from, to, visibilityState);
			this.cleanUpGeneratedViewContainer(from.id);

			// Save new locations
			this.saveViewCustomizations();

			// Log to telemetry
			this.reportMovedViews(views, from, to);
		}
	}

	reset(): void {
		for (const viewContainer of this.viewContainers) {
			const viewContainerModel = this.getViewContainerModel(viewContainer);

			for (const viewDescriptor of viewContainerModel.allViewDescriptors) {
				const defaultContainer = this.getDefaultContainerById(viewDescriptor.id);
				const currentContainer = this.getViewContainerByViewId(viewDescriptor.id);
				if (currentContainer && defaultContainer && currentContainer !== defaultContainer) {
					this.moveViewsWithoutSaving([viewDescriptor], currentContainer, defaultContainer);
				}
			}

			const defaultContainerLocation = this.getDefaultViewContainerLocation(viewContainer);
			const currentContainerLocation = this.getViewContainerLocation(viewContainer);
			if (defaultContainerLocation !== null && currentContainerLocation !== defaultContainerLocation) {
				this.moveViewContainerToLocationWithoutSaving(viewContainer, defaultContainerLocation);
			}

			this.cleanUpGeneratedViewContainer(viewContainer.id);
		}

		this.viewContainersCustomLocations.clear();
		this.viewDescriptorsCustomLocations.clear();
		this.saveViewCustomizations();
	}

	isViewContainerRemovedPermanently(viewContainerId: string): boolean {
		return this.isGeneratedContainerId(viewContainerId) && !this.viewContainersCustomLocations.has(viewContainerId);
	}

	private onDidChangeDefaultContainer(views: IViewDescriptor[], from: ViewContainer, to: ViewContainer): void {
		const viewsToMove = views.filter(view =>
			!this.viewDescriptorsCustomLocations.has(view.id) // Move views which are not already moved
			|| (!this.viewContainers.includes(from) && this.viewDescriptorsCustomLocations.get(view.id) === from.id) // Move views which are moved from a removed container
		);
		if (viewsToMove.length) {
			this.moveViewsWithoutSaving(viewsToMove, from, to);
		}
	}

	private reportMovedViews(views: IViewDescriptor[], from: ViewContainer, to: ViewContainer): void {
		const containerToString = (container: ViewContainer): string => {
			if (container.id.startsWith(ViewDescriptorService.COMMON_CONTAINER_ID_PREFIX)) {
				return 'custom';
			}

			if (!container.extensionId) {
				return container.id;
			}

			return 'extension';
		};

		const oldLocation = this.getViewContainerLocation(from);
		const newLocation = this.getViewContainerLocation(to);
		const viewCount = views.length;
		const fromContainer = containerToString(from);
		const toContainer = containerToString(to);
		const fromLocation = oldLocation === ViewContainerLocation.Panel ? 'panel' : 'sidebar';
		const toLocation = newLocation === ViewContainerLocation.Panel ? 'panel' : 'sidebar';

		interface ViewDescriptorServiceMoveViewsEvent {
			viewCount: number;
			fromContainer: string;
			toContainer: string;
			fromLocation: string;
			toLocation: string;
		}

		type ViewDescriptorServiceMoveViewsClassification = {
			owner: 'benibenj';
			comment: 'Logged when views are moved from one view container to another';
			viewCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of views moved' };
			fromContainer: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The starting view container of the moved views' };
			toContainer: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The destination view container of the moved views' };
			fromLocation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The location of the starting view container. e.g. Primary Side Bar' };
			toLocation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The location of the destination view container. e.g. Panel' };
		};

		this.telemetryService.publicLog2<ViewDescriptorServiceMoveViewsEvent, ViewDescriptorServiceMoveViewsClassification>('viewDescriptorService.moveViews', { viewCount, fromContainer, toContainer, fromLocation, toLocation });
	}

	private moveViewsWithoutSaving(views: IViewDescriptor[], from: ViewContainer, to: ViewContainer, visibilityState: ViewVisibilityState = ViewVisibilityState.Expand): void {
		this.removeViews(from, views);
		this.addViews(to, views, visibilityState);

		const oldLocation = this.getViewContainerLocation(from);
		const newLocation = this.getViewContainerLocation(to);

		if (oldLocation !== newLocation) {
			this._onDidChangeLocation.fire({ views, from: oldLocation, to: newLocation });
		}

		this._onDidChangeContainer.fire({ views, from, to });
	}

	private moveViewContainerToLocationWithoutSaving(viewContainer: ViewContainer, location: ViewContainerLocation, requestedIndex?: number): void {
		const from = this.getViewContainerLocation(viewContainer);
		const to = location;
		if (from !== to) {
			const isGeneratedViewContainer = this.isGeneratedContainerId(viewContainer.id);
			const isDefaultViewContainerLocation = to === this.getDefaultViewContainerLocation(viewContainer);
			if (isGeneratedViewContainer || !isDefaultViewContainerLocation) {
				this.viewContainersCustomLocations.set(viewContainer.id, to);
			} else {
				this.viewContainersCustomLocations.delete(viewContainer.id);
			}
			this.getOrCreateDefaultViewContainerLocationContextKey(viewContainer).set(isGeneratedViewContainer || isDefaultViewContainerLocation);

			viewContainer.requestedIndex = requestedIndex;
			this._onDidChangeContainerLocation.fire({ viewContainer, from, to });

			const views = this.getViewsByContainer(viewContainer);
			this._onDidChangeLocation.fire({ views, from, to });
		}
	}

	private cleanUpGeneratedViewContainer(viewContainerId: string): void {
		// Skip if container is not generated
		if (!this.isGeneratedContainerId(viewContainerId)) {
			return;
		}

		// Skip if container has views registered
		const viewContainer = this.getViewContainerById(viewContainerId);
		if (viewContainer && this.getViewContainerModel(viewContainer)?.allViewDescriptors.length) {
			return;
		}

		// Skip if container has moved views
		if ([...this.viewDescriptorsCustomLocations.values()].includes(viewContainerId)) {
			return;
		}

		// Deregister the container
		if (viewContainer) {
			this.viewContainersRegistry.deregisterViewContainer(viewContainer);
		}

		this.viewContainersCustomLocations.delete(viewContainerId);
		this.viewContainerBadgeEnablementStates.delete(viewContainerId);

		// Clean up caches of container
		this.storageService.remove(getViewsStateStorageId(viewContainer?.storageId || getViewContainerStorageId(viewContainerId)), StorageScope.PROFILE);
	}

	private registerGeneratedViewContainer(location: ViewContainerLocation, existingId?: string): ViewContainer {
		const id = existingId || this.generateContainerId(location);

		const container = this.viewContainersRegistry.registerViewContainer({
			id,
			ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [id, { mergeViewWithContainerWhenSingleView: true }]),
			title: { value: localize('user', "User View Container"), original: 'User View Container' }, // having a placeholder title - this should not be shown anywhere
			icon: location === ViewContainerLocation.Sidebar ? defaultViewIcon : undefined,
			storageId: getViewContainerStorageId(id),
			hideIfEmpty: true
		}, location, { doNotRegisterOpenCommand: true });

		if (this.viewContainersCustomLocations.get(container.id) !== location) {
			this.viewContainersCustomLocations.set(container.id, location);
		}

		this.getOrCreateDefaultViewContainerLocationContextKey(container).set(true);

		return container;
	}

	private onDidStorageChange(): void {
		if (JSON.stringify(this.viewCustomizations) !== this.getStoredViewCustomizationsValue() /* This checks if current window changed the value or not */) {
			this.onDidViewCustomizationsStorageChange();
		}
	}

	private onDidViewCustomizationsStorageChange(): void {
		this._viewCustomizations = undefined;

		const newViewContainerCustomizations = new Map<string, ViewContainerLocation>(Object.entries(this.viewCustomizations.viewContainerLocations));
		const newViewDescriptorCustomizations = new Map<string, string>(Object.entries(this.viewCustomizations.viewLocations));
		const viewContainersToMove: [ViewContainer, ViewContainerLocation][] = [];
		const viewsToMove: { views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }[] = [];

		for (const [containerId, location] of newViewContainerCustomizations.entries()) {
			const container = this.getViewContainerById(containerId);
			if (container) {
				if (location !== this.getViewContainerLocation(container)) {
					viewContainersToMove.push([container, location]);
				}
			}
			// If the container is generated and not registered, we register it now
			else if (this.isGeneratedContainerId(containerId)) {
				this.registerGeneratedViewContainer(location, containerId);
			}
		}

		for (const viewContainer of this.viewContainers) {
			if (!newViewContainerCustomizations.has(viewContainer.id)) {
				const currentLocation = this.getViewContainerLocation(viewContainer);
				const defaultLocation = this.getDefaultViewContainerLocation(viewContainer);
				if (currentLocation !== defaultLocation) {
					viewContainersToMove.push([viewContainer, defaultLocation]);
				}
			}
		}

		for (const [viewId, viewContainerId] of newViewDescriptorCustomizations.entries()) {
			const viewDescriptor = this.getViewDescriptorById(viewId);
			if (viewDescriptor) {
				const prevViewContainer = this.getViewContainerByViewId(viewId);
				const newViewContainer = this.viewContainersRegistry.get(viewContainerId);
				if (prevViewContainer && newViewContainer && newViewContainer !== prevViewContainer) {
					viewsToMove.push({ views: [viewDescriptor], from: prevViewContainer, to: newViewContainer });
				}
			}
		}

		// If a value is not present in the cache, it must be reset to default
		for (const viewContainer of this.viewContainers) {
			const viewContainerModel = this.getViewContainerModel(viewContainer);
			for (const viewDescriptor of viewContainerModel.allViewDescriptors) {
				if (!newViewDescriptorCustomizations.has(viewDescriptor.id)) {
					const currentContainer = this.getViewContainerByViewId(viewDescriptor.id);
					const defaultContainer = this.getDefaultContainerById(viewDescriptor.id);
					if (currentContainer && defaultContainer && currentContainer !== defaultContainer) {
						viewsToMove.push({ views: [viewDescriptor], from: currentContainer, to: defaultContainer });
					}
				}
			}
		}

		// Execute View Container Movements
		for (const [container, location] of viewContainersToMove) {
			this.moveViewContainerToLocationWithoutSaving(container, location);
		}
		// Execute View Movements
		for (const { views, from, to } of viewsToMove) {
			this.moveViewsWithoutSaving(views, from, to, ViewVisibilityState.Default);
		}

		this.viewContainersCustomLocations = newViewContainerCustomizations;
		this.viewDescriptorsCustomLocations = newViewDescriptorCustomizations;
	}

	// Generated Container Id Format
	// {Common Prefix}.{Location}.{Uniqueness Id}
	// Old Format (deprecated)
	// {Common Prefix}.{Uniqueness Id}.{Source View Id}
	private generateContainerId(location: ViewContainerLocation): string {
		return `${ViewDescriptorService.COMMON_CONTAINER_ID_PREFIX}.${ViewContainerLocationToString(location)}.${generateUuid()}`;
	}

	private saveViewCustomizations(): void {
		const viewCustomizations: IViewsCustomizations = { viewContainerLocations: {}, viewLocations: {}, viewContainerBadgeEnablementStates: {} };

		for (const [containerId, location] of this.viewContainersCustomLocations) {
			const container = this.getViewContainerById(containerId);
			// Skip if the view container is not a generated container and in default location
			if (container && !this.isGeneratedContainerId(containerId) && location === this.getDefaultViewContainerLocation(container)) {
				continue;
			}
			viewCustomizations.viewContainerLocations[containerId] = location;
		}

		for (const [viewId, viewContainerId] of this.viewDescriptorsCustomLocations) {
			const viewContainer = this.getViewContainerById(viewContainerId);
			if (viewContainer) {
				const defaultContainer = this.getDefaultContainerById(viewId);
				// Skip if the view is at default location
				// https://github.com/microsoft/vscode/issues/90414
				if (defaultContainer?.id === viewContainer.id) {
					continue;
				}
			}
			viewCustomizations.viewLocations[viewId] = viewContainerId;
		}

		// Loop through viewContainerBadgeEnablementStates and save only the ones that are disabled
		for (const [viewContainerId, badgeEnablementState] of this.viewContainerBadgeEnablementStates) {
			if (badgeEnablementState === false) {
				viewCustomizations.viewContainerBadgeEnablementStates[viewContainerId] = badgeEnablementState;
			}
		}
		this.viewCustomizations = viewCustomizations;
	}

	private _viewCustomizations: IViewsCustomizations | undefined;
	private get viewCustomizations(): IViewsCustomizations {
		if (!this._viewCustomizations) {
			this._viewCustomizations = JSON.parse(this.getStoredViewCustomizationsValue()) as IViewsCustomizations;
			this._viewCustomizations.viewContainerLocations = this._viewCustomizations.viewContainerLocations ?? {};
			this._viewCustomizations.viewLocations = this._viewCustomizations.viewLocations ?? {};
			this._viewCustomizations.viewContainerBadgeEnablementStates = this._viewCustomizations.viewContainerBadgeEnablementStates ?? {};
		}
		return this._viewCustomizations;
	}

	private set viewCustomizations(viewCustomizations: IViewsCustomizations) {
		const value = JSON.stringify(viewCustomizations);
		if (JSON.stringify(this.viewCustomizations) !== value) {
			this._viewCustomizations = viewCustomizations;
			this.setStoredViewCustomizationsValue(value);
		}
	}

	private getStoredViewCustomizationsValue(): string {
		return this.storageService.get(ViewDescriptorService.VIEWS_CUSTOMIZATIONS, StorageScope.PROFILE, '{}');
	}

	private setStoredViewCustomizationsValue(value: string): void {
		this.storageService.store(ViewDescriptorService.VIEWS_CUSTOMIZATIONS, value, StorageScope.PROFILE, StorageTarget.USER);
	}

	private getViewsByContainer(viewContainer: ViewContainer): IViewDescriptor[] {
		const result = this.viewsRegistry.getViews(viewContainer).filter(viewDescriptor => {
			const viewDescriptorViewContainerId = this.viewDescriptorsCustomLocations.get(viewDescriptor.id) ?? viewContainer.id;
			return viewDescriptorViewContainerId === viewContainer.id;
		});

		for (const [viewId, viewContainerId] of this.viewDescriptorsCustomLocations.entries()) {
			if (viewContainerId !== viewContainer.id) {
				continue;
			}

			if (this.viewsRegistry.getViewContainer(viewId) === viewContainer) {
				continue;
			}

			const viewDescriptor = this.getViewDescriptorById(viewId);
			if (viewDescriptor) {
				result.push(viewDescriptor);
			}
		}

		return result;
	}

	private onDidRegisterViewContainer(viewContainer: ViewContainer): void {
		const defaultLocation = this.isGeneratedContainerId(viewContainer.id) ? true : this.getViewContainerLocation(viewContainer) === this.getDefaultViewContainerLocation(viewContainer);
		this.getOrCreateDefaultViewContainerLocationContextKey(viewContainer).set(defaultLocation);
		this.getOrRegisterViewContainerModel(viewContainer);
	}

	private getOrRegisterViewContainerModel(viewContainer: ViewContainer): ViewContainerModel {
		let viewContainerModel = this.viewContainerModels.get(viewContainer)?.viewContainerModel;

		if (!viewContainerModel) {
			const disposables = new DisposableStore();
			viewContainerModel = disposables.add(this.instantiationService.createInstance(ViewContainerModel, viewContainer));

			this.onDidChangeActiveViews({ added: viewContainerModel.activeViewDescriptors, removed: [] });
			viewContainerModel.onDidChangeActiveViewDescriptors(changed => this.onDidChangeActiveViews(changed), this, disposables);

			this.onDidChangeVisibleViews({ added: [...viewContainerModel.visibleViewDescriptors], removed: [] });
			viewContainerModel.onDidAddVisibleViewDescriptors(added => this.onDidChangeVisibleViews({ added: added.map(({ viewDescriptor }) => viewDescriptor), removed: [] }), this, disposables);
			viewContainerModel.onDidRemoveVisibleViewDescriptors(removed => this.onDidChangeVisibleViews({ added: [], removed: removed.map(({ viewDescriptor }) => viewDescriptor) }), this, disposables);

			disposables.add(toDisposable(() => this.viewsVisibilityActionDisposables.deleteAndDispose(viewContainer)));

			disposables.add(this.registerResetViewContainerAction(viewContainer));

			const value = { viewContainerModel: viewContainerModel, disposables, dispose: () => disposables.dispose() };
			this.viewContainerModels.set(viewContainer, value);

			// Register all views that were statically registered to this container
			// Potentially, this is registering something that was handled by another container
			// addViews() handles this by filtering views that are already registered
			this.onDidRegisterViews([{ views: this.viewsRegistry.getViews(viewContainer), viewContainer }]);

			// Add views that were registered prior to this view container
			const viewsToRegister = this.getViewsByContainer(viewContainer).filter(view => this.getDefaultContainerById(view.id) !== viewContainer);
			if (viewsToRegister.length) {
				this.addViews(viewContainer, viewsToRegister);
				this.contextKeyService.bufferChangeEvents(() => {
					viewsToRegister.forEach(viewDescriptor => this.getOrCreateMovableViewContextKey(viewDescriptor).set(!!viewDescriptor.canMoveView));
				});
			}

			if (this.canRegisterViewsVisibilityActions) {
				this.registerViewsVisibilityActions(viewContainer, value);
			}
		}

		return viewContainerModel;
	}

	private onDidDeregisterViewContainer(viewContainer: ViewContainer): void {
		this.viewContainerModels.deleteAndDispose(viewContainer);
		this.viewsVisibilityActionDisposables.deleteAndDispose(viewContainer);
	}

	private onDidChangeActiveViews({ added, removed }: { added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }): void {
		this.contextKeyService.bufferChangeEvents(() => {
			added.forEach(viewDescriptor => this.getOrCreateActiveViewContextKey(viewDescriptor).set(true));
			removed.forEach(viewDescriptor => this.getOrCreateActiveViewContextKey(viewDescriptor).set(false));
		});
	}

	private onDidChangeVisibleViews({ added, removed }: { added: IViewDescriptor[]; removed: IViewDescriptor[] }): void {
		this.contextKeyService.bufferChangeEvents(() => {
			added.forEach(viewDescriptor => this.getOrCreateVisibleViewContextKey(viewDescriptor).set(true));
			removed.forEach(viewDescriptor => this.getOrCreateVisibleViewContextKey(viewDescriptor).set(false));
		});
	}

	private registerViewsVisibilityActions(viewContainer: ViewContainer, { viewContainerModel, disposables }: { viewContainerModel: ViewContainerModel; disposables: DisposableStore }): void {
		this.viewsVisibilityActionDisposables.deleteAndDispose(viewContainer);
		this.viewsVisibilityActionDisposables.set(viewContainer, this.registerViewsVisibilityActionsForContainer(viewContainerModel));
		disposables.add(Event.any(
			viewContainerModel.onDidChangeActiveViewDescriptors,
			viewContainerModel.onDidAddVisibleViewDescriptors,
			viewContainerModel.onDidRemoveVisibleViewDescriptors,
			viewContainerModel.onDidMoveVisibleViewDescriptors
		)(e => {
			this.viewsVisibilityActionDisposables.deleteAndDispose(viewContainer);
			this.viewsVisibilityActionDisposables.set(viewContainer, this.registerViewsVisibilityActionsForContainer(viewContainerModel));
		}));
	}

	private registerViewsVisibilityActionsForContainer(viewContainerModel: ViewContainerModel): IDisposable {
		const disposables = new DisposableStore();
		viewContainerModel.activeViewDescriptors.forEach((viewDescriptor, index) => {
			if (!viewDescriptor.remoteAuthority) {
				disposables.add(registerAction2(class extends ViewPaneContainerAction<ViewPaneContainer> {
					constructor() {
						super({
							id: `${viewDescriptor.id}.toggleVisibility`,
							viewPaneContainerId: viewContainerModel.viewContainer.id,
							precondition: viewDescriptor.canToggleVisibility && (!viewContainerModel.isVisible(viewDescriptor.id) || viewContainerModel.visibleViewDescriptors.length > 1) ? ContextKeyExpr.true() : ContextKeyExpr.false(),
							toggled: ContextKeyExpr.has(`${viewDescriptor.id}.visible`),
							title: viewDescriptor.name,
							metadata: {
								description: localize2('toggleVisibilityDescription', 'Toggles the visibility of the {0} view if the view container it is located in is visible', viewDescriptor.name.value)
							},
							menu: [{
								id: ViewsSubMenu,
								when: ContextKeyExpr.equals('viewContainer', viewContainerModel.viewContainer.id),
								order: index,
							}, {
								id: MenuId.ViewContainerTitleContext,
								when: ContextKeyExpr.equals('viewContainer', viewContainerModel.viewContainer.id),
								order: index,
								group: '1_toggleVisibility'
							}, {
								id: MenuId.ViewTitleContext,
								when: ContextKeyExpr.or(...viewContainerModel.visibleViewDescriptors.map(v => ContextKeyExpr.equals('view', v.id))),
								order: index,
								group: '2_toggleVisibility'
							}]
						});
					}
					async runInViewPaneContainer(serviceAccessor: ServicesAccessor, viewPaneContainer: ViewPaneContainer): Promise<void> {
						viewPaneContainer.toggleViewVisibility(viewDescriptor.id);
					}
				}));
				disposables.add(registerAction2(class extends ViewPaneContainerAction<ViewPaneContainer> {
					constructor() {
						super({
							id: `${viewDescriptor.id}.removeView`,
							viewPaneContainerId: viewContainerModel.viewContainer.id,
							title: localize('hideView', "Hide '{0}'", viewDescriptor.name.value),
							metadata: {
								description: localize2('hideViewDescription', 'Hides the {0} view if it is visible and the view container it is located in is visible', viewDescriptor.name.value)
							},
							precondition: viewDescriptor.canToggleVisibility && (!viewContainerModel.isVisible(viewDescriptor.id) || viewContainerModel.visibleViewDescriptors.length > 1) ? ContextKeyExpr.true() : ContextKeyExpr.false(),
							menu: [{
								id: MenuId.ViewTitleContext,
								when: ContextKeyExpr.and(
									ContextKeyExpr.equals('view', viewDescriptor.id),
									ContextKeyExpr.has(`${viewDescriptor.id}.visible`),
								),
								group: '1_hide',
								order: 1
							}]
						});
					}
					async runInViewPaneContainer(serviceAccessor: ServicesAccessor, viewPaneContainer: ViewPaneContainer): Promise<void> {
						if (viewPaneContainer.getView(viewDescriptor.id)?.isVisible()) {
							viewPaneContainer.toggleViewVisibility(viewDescriptor.id);
						}
					}
				}));
			}
		});
		return disposables;
	}

	private registerResetViewContainerAction(viewContainer: ViewContainer): IDisposable {
		const that = this;
		return registerAction2(class ResetViewLocationAction extends Action2 {
			constructor() {
				super({
					id: `${viewContainer.id}.resetViewContainerLocation`,
					title: localize2('resetViewLocation', "Reset Location"),
					menu: [{
						id: MenuId.ViewContainerTitleContext,
						group: '1_viewActions',
						when: ContextKeyExpr.or(
							ContextKeyExpr.and(
								ContextKeyExpr.equals('viewContainer', viewContainer.id),
								ContextKeyExpr.equals(`${viewContainer.id}.defaultViewContainerLocation`, false)
							)
						)
					}],
				});
			}
			run(accessor: ServicesAccessor) {
				that.moveViewContainerToLocation(viewContainer, that.getDefaultViewContainerLocation(viewContainer), undefined, this.desc.id);
				accessor.get(IViewsService).openViewContainer(viewContainer.id, true);
			}
		});
	}

	private addViews(container: ViewContainer, views: IViewDescriptor[], visibilityState: ViewVisibilityState = ViewVisibilityState.Default): void {
		this.contextKeyService.bufferChangeEvents(() => {
			views.forEach(view => {
				const isDefaultContainer = this.getDefaultContainerById(view.id) === container;
				this.getOrCreateDefaultViewLocationContextKey(view).set(isDefaultContainer);
				if (isDefaultContainer) {
					this.viewDescriptorsCustomLocations.delete(view.id);
				} else {
					this.viewDescriptorsCustomLocations.set(view.id, container.id);
				}
			});
		});

		this.getViewContainerModel(container).add(views.map(view => {
			return {
				viewDescriptor: view,
				collapsed: visibilityState === ViewVisibilityState.Default ? undefined : false,
				visible: visibilityState === ViewVisibilityState.Default ? undefined : true
			};
		}));
	}

	private removeViews(container: ViewContainer, views: IViewDescriptor[]): void {
		// Set view default location keys to false
		this.contextKeyService.bufferChangeEvents(() => {
			views.forEach(view => {
				if (this.viewDescriptorsCustomLocations.get(view.id) === container.id) {
					this.viewDescriptorsCustomLocations.delete(view.id);
				}
				this.getOrCreateDefaultViewLocationContextKey(view).set(false);
			});
		});

		// Remove the views
		this.getViewContainerModel(container).remove(views);
	}

	private getOrCreateActiveViewContextKey(viewDescriptor: IViewDescriptor): IContextKey<boolean> {
		const activeContextKeyId = `${viewDescriptor.id}.active`;
		let contextKey = this.activeViewContextKeys.get(activeContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(activeContextKeyId, false).bindTo(this.contextKeyService);
			this.activeViewContextKeys.set(activeContextKeyId, contextKey);
		}
		return contextKey;
	}

	private getOrCreateVisibleViewContextKey(viewDescriptor: IViewDescriptor): IContextKey<boolean> {
		const activeContextKeyId = `${viewDescriptor.id}.visible`;
		let contextKey = this.activeViewContextKeys.get(activeContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(activeContextKeyId, false).bindTo(this.contextKeyService);
			this.activeViewContextKeys.set(activeContextKeyId, contextKey);
		}
		return contextKey;
	}

	private getOrCreateMovableViewContextKey(viewDescriptor: IViewDescriptor): IContextKey<boolean> {
		const movableViewContextKeyId = `${viewDescriptor.id}.canMove`;
		let contextKey = this.movableViewContextKeys.get(movableViewContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(movableViewContextKeyId, false).bindTo(this.contextKeyService);
			this.movableViewContextKeys.set(movableViewContextKeyId, contextKey);
		}
		return contextKey;
	}

	private getOrCreateDefaultViewLocationContextKey(viewDescriptor: IViewDescriptor): IContextKey<boolean> {
		const defaultViewLocationContextKeyId = `${viewDescriptor.id}.defaultViewLocation`;
		let contextKey = this.defaultViewLocationContextKeys.get(defaultViewLocationContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(defaultViewLocationContextKeyId, false).bindTo(this.contextKeyService);
			this.defaultViewLocationContextKeys.set(defaultViewLocationContextKeyId, contextKey);
		}
		return contextKey;
	}

	private getOrCreateDefaultViewContainerLocationContextKey(viewContainer: ViewContainer): IContextKey<boolean> {
		const defaultViewContainerLocationContextKeyId = `${viewContainer.id}.defaultViewContainerLocation`;
		let contextKey = this.defaultViewContainerLocationContextKeys.get(defaultViewContainerLocationContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(defaultViewContainerLocationContextKeyId, false).bindTo(this.contextKeyService);
			this.defaultViewContainerLocationContextKeys.set(defaultViewContainerLocationContextKeyId, contextKey);
		}
		return contextKey;
	}
}

registerSingleton(IViewDescriptorService, ViewDescriptorService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/views/browser/viewsService.ts]---
Location: vscode-main/src/vs/workbench/services/views/browser/viewsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable, toDisposable, DisposableStore, DisposableMap } from '../../../../base/common/lifecycle.js';
import { IViewDescriptorService, ViewContainer, IViewDescriptor, IView, ViewContainerLocation, IViewPaneContainer } from '../../../common/views.js';
import { FocusedViewContext, getVisbileViewContextKey } from '../../../common/contextkeys.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { isString } from '../../../../base/common/types.js';
import { MenuId, registerAction2, Action2, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { localize, localize2 } from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IPaneComposite } from '../../../common/panecomposite.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { PaneCompositeDescriptor, PaneCompositeRegistry, Extensions as PaneCompositeExtensions, PaneComposite } from '../../../browser/panecomposite.js';
import { IWorkbenchLayoutService, Parts } from '../../layout/browser/layoutService.js';
import { URI } from '../../../../base/common/uri.js';
import { IProgressIndicator } from '../../../../platform/progress/common/progress.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IEditorGroupsService } from '../../editor/common/editorGroupsService.js';
import { FilterViewPaneContainer } from '../../../browser/parts/views/viewsViewlet.js';
import { IPaneCompositePartService } from '../../panecomposite/browser/panecomposite.js';
import { ICommandActionTitle, ILocalizedString } from '../../../../platform/action/common/action.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IViewsService } from '../common/viewsService.js';

export class ViewsService extends Disposable implements IViewsService {

	declare readonly _serviceBrand: undefined;

	private readonly viewDisposable: Map<IViewDescriptor, IDisposable>;
	private readonly viewPaneContainers: Map<string, ViewPaneContainer>;

	private readonly _onDidChangeViewVisibility: Emitter<{ id: string; visible: boolean }> = this._register(new Emitter<{ id: string; visible: boolean }>());
	readonly onDidChangeViewVisibility: Event<{ id: string; visible: boolean }> = this._onDidChangeViewVisibility.event;

	private readonly _onDidChangeViewContainerVisibility = this._register(new Emitter<{ id: string; visible: boolean; location: ViewContainerLocation }>());
	readonly onDidChangeViewContainerVisibility = this._onDidChangeViewContainerVisibility.event;

	private readonly _onDidChangeFocusedView = this._register(new Emitter<void>());
	readonly onDidChangeFocusedView = this._onDidChangeFocusedView.event;

	private readonly viewContainerDisposables = this._register(new DisposableMap());
	private readonly enabledViewContainersContextKeys: Map<string, IContextKey<boolean>>;
	private readonly visibleViewContextKeys: Map<string, IContextKey<boolean>>;
	private readonly focusedViewContextKey: IContextKey<string>;

	constructor(
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IEditorService private readonly editorService: IEditorService
	) {
		super();

		this.viewDisposable = new Map<IViewDescriptor, IDisposable>();
		this.enabledViewContainersContextKeys = new Map<string, IContextKey<boolean>>();
		this.visibleViewContextKeys = new Map<string, IContextKey<boolean>>();
		this.viewPaneContainers = new Map<string, ViewPaneContainer>();

		this._register(toDisposable(() => {
			this.viewDisposable.forEach(disposable => disposable.dispose());
			this.viewDisposable.clear();
		}));

		this.viewDescriptorService.viewContainers.forEach(viewContainer => this.onDidRegisterViewContainer(viewContainer, this.viewDescriptorService.getViewContainerLocation(viewContainer)!));
		this._register(this.viewDescriptorService.onDidChangeViewContainers(({ added, removed }) => this.onDidChangeContainers(added, removed)));
		this._register(this.viewDescriptorService.onDidChangeContainerLocation(({ viewContainer, from, to }) => this.onDidChangeContainerLocation(viewContainer, from, to)));

		// View Container Visibility
		this._register(this.paneCompositeService.onDidPaneCompositeOpen(e => this._onDidChangeViewContainerVisibility.fire({ id: e.composite.getId(), visible: true, location: e.viewContainerLocation })));
		this._register(this.paneCompositeService.onDidPaneCompositeClose(e => this._onDidChangeViewContainerVisibility.fire({ id: e.composite.getId(), visible: false, location: e.viewContainerLocation })));

		this.focusedViewContextKey = FocusedViewContext.bindTo(contextKeyService);
	}

	private onViewsAdded(added: IView[]): void {
		for (const view of added) {
			this.onViewsVisibilityChanged(view, view.isBodyVisible());
		}
	}

	private onViewsVisibilityChanged(view: IView, visible: boolean): void {
		this.getOrCreateActiveViewContextKey(view).set(visible);
		this._onDidChangeViewVisibility.fire({ id: view.id, visible: visible });
	}

	private onViewsRemoved(removed: IView[]): void {
		for (const view of removed) {
			this.onViewsVisibilityChanged(view, false);
		}
	}

	private getOrCreateActiveViewContextKey(view: IView): IContextKey<boolean> {
		const visibleContextKeyId = getVisbileViewContextKey(view.id);
		let contextKey = this.visibleViewContextKeys.get(visibleContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(visibleContextKeyId, false).bindTo(this.contextKeyService);
			this.visibleViewContextKeys.set(visibleContextKeyId, contextKey);
		}
		return contextKey;
	}

	private onDidChangeContainers(added: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }>, removed: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }>): void {
		for (const { container, location } of removed) {
			this.onDidDeregisterViewContainer(container, location);
		}
		for (const { container, location } of added) {
			this.onDidRegisterViewContainer(container, location);
		}
	}

	private onDidRegisterViewContainer(viewContainer: ViewContainer, viewContainerLocation: ViewContainerLocation): void {
		this.registerPaneComposite(viewContainer, viewContainerLocation);
		const disposables = new DisposableStore();

		const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
		this.onViewDescriptorsAdded(viewContainerModel.allViewDescriptors, viewContainer);
		disposables.add(viewContainerModel.onDidChangeAllViewDescriptors(({ added, removed }) => {
			this.onViewDescriptorsAdded(added, viewContainer);
			this.onViewDescriptorsRemoved(removed);
		}));
		this.updateViewContainerEnablementContextKey(viewContainer);
		disposables.add(viewContainerModel.onDidChangeActiveViewDescriptors(() => this.updateViewContainerEnablementContextKey(viewContainer)));
		disposables.add(this.registerOpenViewContainerAction(viewContainer));

		this.viewContainerDisposables.set(viewContainer.id, disposables);
	}

	private onDidDeregisterViewContainer(viewContainer: ViewContainer, viewContainerLocation: ViewContainerLocation): void {
		this.deregisterPaneComposite(viewContainer, viewContainerLocation);
		this.viewContainerDisposables.deleteAndDispose(viewContainer.id);
	}

	private onDidChangeContainerLocation(viewContainer: ViewContainer, from: ViewContainerLocation, to: ViewContainerLocation): void {
		this.deregisterPaneComposite(viewContainer, from);
		this.registerPaneComposite(viewContainer, to);

		// Open view container if part is visible and there is only one view container in location
		if (
			this.layoutService.isVisible(getPartByLocation(to)) &&
			this.viewDescriptorService.getViewContainersByLocation(to).filter(vc => this.isViewContainerActive(vc.id)).length === 1
		) {
			this.openViewContainer(viewContainer.id);
		}
	}

	private onViewDescriptorsAdded(views: ReadonlyArray<IViewDescriptor>, container: ViewContainer): void {
		const location = this.viewDescriptorService.getViewContainerLocation(container);
		if (location === null) {
			return;
		}

		for (const viewDescriptor of views) {
			const disposables = new DisposableStore();
			disposables.add(this.registerOpenViewAction(viewDescriptor));
			disposables.add(this.registerFocusViewAction(viewDescriptor, container.title));
			disposables.add(this.registerResetViewLocationAction(viewDescriptor));
			this.viewDisposable.set(viewDescriptor, disposables);
		}
	}

	private onViewDescriptorsRemoved(views: ReadonlyArray<IViewDescriptor>): void {
		for (const view of views) {
			const disposable = this.viewDisposable.get(view);
			if (disposable) {
				disposable.dispose();
				this.viewDisposable.delete(view);
			}
		}
	}

	private updateViewContainerEnablementContextKey(viewContainer: ViewContainer): void {
		let contextKey = this.enabledViewContainersContextKeys.get(viewContainer.id);
		if (!contextKey) {
			contextKey = this.contextKeyService.createKey(getEnabledViewContainerContextKey(viewContainer.id), false);
			this.enabledViewContainersContextKeys.set(viewContainer.id, contextKey);
		}
		contextKey.set(!(viewContainer.hideIfEmpty && this.viewDescriptorService.getViewContainerModel(viewContainer).activeViewDescriptors.length === 0));
	}

	private async openComposite(compositeId: string, location: ViewContainerLocation, focus?: boolean): Promise<IPaneComposite | undefined> {
		return this.paneCompositeService.openPaneComposite(compositeId, location, focus);
	}

	private getComposite(compositeId: string, location: ViewContainerLocation): { id: string; name: string } | undefined {
		return this.paneCompositeService.getPaneComposite(compositeId, location);
	}

	// One view container can be visible at a time in a location
	isViewContainerVisible(id: string): boolean {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (!viewContainer) {
			return false;
		}

		const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
		if (viewContainerLocation === null) {
			return false;
		}

		return this.paneCompositeService.getActivePaneComposite(viewContainerLocation)?.getId() === id;
	}

	// Multiple view containers can be active/inactive at a time in a location
	isViewContainerActive(id: string): boolean {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (!viewContainer) {
			return false;
		}

		if (!viewContainer.hideIfEmpty) {
			return true;
		}

		return this.viewDescriptorService.getViewContainerModel(viewContainer).activeViewDescriptors.length > 0;
	}

	getVisibleViewContainer(location: ViewContainerLocation): ViewContainer | null {
		const viewContainerId = this.paneCompositeService.getActivePaneComposite(location)?.getId();
		return viewContainerId ? this.viewDescriptorService.getViewContainerById(viewContainerId) : null;
	}

	getActiveViewPaneContainerWithId(viewContainerId: string): IViewPaneContainer | null {
		const viewContainer = this.viewDescriptorService.getViewContainerById(viewContainerId);
		return viewContainer ? this.getActiveViewPaneContainer(viewContainer) : null;
	}

	async openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null> {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (viewContainer) {
			const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
			if (viewContainerLocation !== null) {
				const paneComposite = await this.paneCompositeService.openPaneComposite(id, viewContainerLocation, focus);
				return paneComposite || null;
			}
		}

		return null;
	}

	async closeViewContainer(id: string): Promise<void> {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (viewContainer) {
			const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
			const isActive = viewContainerLocation !== null && this.paneCompositeService.getActivePaneComposite(viewContainerLocation);
			if (viewContainerLocation !== null) {
				return isActive ? this.layoutService.setPartHidden(true, getPartByLocation(viewContainerLocation)) : undefined;
			}
		}
	}

	isViewVisible(id: string): boolean {
		const activeView = this.getActiveViewWithId(id);
		return activeView?.isBodyVisible() || false;
	}

	getActiveViewWithId<T extends IView>(id: string): T | null {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(id);
		if (viewContainer) {
			const activeViewPaneContainer = this.getActiveViewPaneContainer(viewContainer);
			if (activeViewPaneContainer) {
				return activeViewPaneContainer.getView(id) as T;
			}
		}
		return null;
	}

	getViewWithId<T extends IView>(id: string): T | null {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(id);
		if (viewContainer) {
			const viewPaneContainer: IViewPaneContainer | undefined = this.viewPaneContainers.get(viewContainer.id);
			if (viewPaneContainer) {
				return viewPaneContainer.getView(id) as T;
			}
		}
		return null;
	}

	getFocusedView(): IViewDescriptor | null {
		const viewId: string = this.contextKeyService.getContextKeyValue(FocusedViewContext.key) ?? '';
		return this.viewDescriptorService.getViewDescriptorById(viewId.toString());
	}

	getFocusedViewName(): string {
		const textEditorFocused = this.editorService.activeTextEditorControl?.hasTextFocus() ? localize('editor', "Text Editor") : undefined;
		return this.getFocusedView()?.name?.value ?? textEditorFocused ?? '';
	}

	async openView<T extends IView>(id: string, focus?: boolean): Promise<T | null> {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(id);
		if (!viewContainer) {
			return null;
		}

		if (!this.viewDescriptorService.getViewContainerModel(viewContainer).activeViewDescriptors.some(viewDescriptor => viewDescriptor.id === id)) {
			return null;
		}

		const location = this.viewDescriptorService.getViewContainerLocation(viewContainer);
		const compositeDescriptor = this.getComposite(viewContainer.id, location!);
		if (compositeDescriptor) {
			const paneComposite = await this.openComposite(compositeDescriptor.id, location!) as IPaneComposite | undefined;
			if (paneComposite?.openView) {
				return paneComposite.openView<T>(id, focus) || null;
			} else if (focus) {
				paneComposite?.focus();
			}
		}

		return null;
	}

	closeView(id: string): void {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(id);
		if (viewContainer) {
			const activeViewPaneContainer = this.getActiveViewPaneContainer(viewContainer);
			if (activeViewPaneContainer) {
				const view = activeViewPaneContainer.getView(id);
				if (view) {
					if (activeViewPaneContainer.views.length === 1) {
						const location = this.viewDescriptorService.getViewContainerLocation(viewContainer);
						if (location === ViewContainerLocation.Sidebar) {
							this.layoutService.setPartHidden(true, Parts.SIDEBAR_PART);
						} else if (location === ViewContainerLocation.Panel || location === ViewContainerLocation.AuxiliaryBar) {
							this.paneCompositeService.hideActivePaneComposite(location);
						}

						// The blur event doesn't fire on WebKit when the focused element is hidden,
						// so the context key needs to be forced here too otherwise a view may still
						// think it's showing, breaking toggle commands.
						if (this.focusedViewContextKey.get() === id) {
							this.focusedViewContextKey.reset();
						}
					} else {
						view.setExpanded(false);
					}
				}
			}
		}
	}

	private getActiveViewPaneContainer(viewContainer: ViewContainer): IViewPaneContainer | null {
		const location = this.viewDescriptorService.getViewContainerLocation(viewContainer);
		if (location === null) {
			return null;
		}

		const activePaneComposite = this.paneCompositeService.getActivePaneComposite(location);
		if (activePaneComposite?.getId() === viewContainer.id) {
			return activePaneComposite.getViewPaneContainer() || null;
		}

		return null;
	}

	getViewProgressIndicator(viewId: string): IProgressIndicator | undefined {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(viewId);
		if (!viewContainer) {
			return undefined;
		}

		const viewPaneContainer = this.viewPaneContainers.get(viewContainer.id);
		if (!viewPaneContainer) {
			return undefined;
		}

		const view = viewPaneContainer.getView(viewId);
		if (!view) {
			return undefined;
		}

		if (viewPaneContainer.isViewMergedWithContainer()) {
			return this.getViewContainerProgressIndicator(viewContainer);
		}

		return view.getProgressIndicator();
	}

	private getViewContainerProgressIndicator(viewContainer: ViewContainer): IProgressIndicator | undefined {
		const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
		if (viewContainerLocation === null) {
			return undefined;
		}

		return this.paneCompositeService.getProgressIndicator(viewContainer.id, viewContainerLocation);
	}

	private registerOpenViewContainerAction(viewContainer: ViewContainer): IDisposable {
		const disposables = new DisposableStore();
		if (viewContainer.openCommandActionDescriptor) {
			const { id, mnemonicTitle, keybindings, order } = viewContainer.openCommandActionDescriptor ?? { id: viewContainer.id };
			const title = viewContainer.openCommandActionDescriptor.title ?? viewContainer.title;
			const that = this;
			disposables.add(registerAction2(class OpenViewContainerAction extends Action2 {
				constructor() {
					super({
						id,
						get title(): ICommandActionTitle {
							const viewContainerLocation = that.viewDescriptorService.getViewContainerLocation(viewContainer);
							const localizedTitle = typeof title === 'string' ? title : title.value;
							const originalTitle = typeof title === 'string' ? title : title.original;
							if (viewContainerLocation === ViewContainerLocation.Sidebar) {
								return { value: localize('show view', "Show {0}", localizedTitle), original: `Show ${originalTitle}` };
							} else {
								return { value: localize('toggle view', "Toggle {0}", localizedTitle), original: `Toggle ${originalTitle}` };
							}
						},
						category: Categories.View,
						precondition: ContextKeyExpr.has(getEnabledViewContainerContextKey(viewContainer.id)),
						keybinding: keybindings ? { ...keybindings, weight: KeybindingWeight.WorkbenchContrib } : undefined,
						f1: true
					});
				}
				public async run(serviceAccessor: ServicesAccessor): Promise<void> {
					const editorGroupService = serviceAccessor.get(IEditorGroupsService);
					const viewDescriptorService = serviceAccessor.get(IViewDescriptorService);
					const layoutService = serviceAccessor.get(IWorkbenchLayoutService);
					const viewsService = serviceAccessor.get(IViewsService);
					const viewContainerLocation = viewDescriptorService.getViewContainerLocation(viewContainer);
					switch (viewContainerLocation) {
						case ViewContainerLocation.AuxiliaryBar:
						case ViewContainerLocation.Sidebar: {
							const part = viewContainerLocation === ViewContainerLocation.Sidebar ? Parts.SIDEBAR_PART : Parts.AUXILIARYBAR_PART;
							if (!viewsService.isViewContainerVisible(viewContainer.id) || !layoutService.hasFocus(part)) {
								await viewsService.openViewContainer(viewContainer.id, true);
							} else {
								editorGroupService.activeGroup.focus();
							}
							break;
						}
						case ViewContainerLocation.Panel:
							if (!viewsService.isViewContainerVisible(viewContainer.id) || !layoutService.hasFocus(Parts.PANEL_PART)) {
								await viewsService.openViewContainer(viewContainer.id, true);
							} else {
								viewsService.closeViewContainer(viewContainer.id);
							}
							break;
					}
				}
			}));

			if (mnemonicTitle) {
				const defaultLocation = this.viewDescriptorService.getDefaultViewContainerLocation(viewContainer);
				disposables.add(MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
					command: {
						id,
						title: mnemonicTitle,
					},
					group: defaultLocation === ViewContainerLocation.Sidebar ? '3_sidebar' : defaultLocation === ViewContainerLocation.AuxiliaryBar ? '4_auxbar' : '5_panel',
					when: ContextKeyExpr.has(getEnabledViewContainerContextKey(viewContainer.id)),
					order: order ?? Number.MAX_VALUE
				}));
			}
		}

		return disposables;
	}

	private registerOpenViewAction(viewDescriptor: IViewDescriptor): IDisposable {
		const disposables = new DisposableStore();
		const title = viewDescriptor.openCommandActionDescriptor?.title ?? viewDescriptor.name;
		const commandId = viewDescriptor.openCommandActionDescriptor?.id ?? `${viewDescriptor.id}.open`;
		const that = this;
		disposables.add(registerAction2(class OpenViewAction extends Action2 {
			constructor() {
				super({
					id: commandId,
					get title(): ICommandActionTitle {
						const viewContainerLocation = that.viewDescriptorService.getViewLocationById(viewDescriptor.id);
						const localizedTitle = typeof title === 'string' ? title : title.value;
						const originalTitle = typeof title === 'string' ? title : title.original;
						if (viewContainerLocation === ViewContainerLocation.Sidebar) {
							return { value: localize('show view', "Show {0}", localizedTitle), original: `Show ${originalTitle}` };
						} else {
							return { value: localize('toggle view', "Toggle {0}", localizedTitle), original: `Toggle ${originalTitle}` };
						}
					},
					category: Categories.View,
					precondition: ContextKeyExpr.has(`${viewDescriptor.id}.active`),
					keybinding: viewDescriptor.openCommandActionDescriptor?.keybindings ? { ...viewDescriptor.openCommandActionDescriptor.keybindings, weight: KeybindingWeight.WorkbenchContrib } : undefined,
					f1: viewDescriptor.openCommandActionDescriptor ? true : undefined,
					metadata: {
						description: localize('open view', "Opens view {0}", viewDescriptor.name.value),
						args: [
							{
								name: 'options',
								schema: {
									type: 'object',
									properties: {
										'preserveFocus': {
											type: 'boolean',
											default: false,
											description: localize('preserveFocus', "Whether to preserve the existing focus when opening the view.")
										}
									},
								}
							}
						]
					}
				});
			}
			public async run(serviceAccessor: ServicesAccessor, options?: { preserveFocus?: boolean }): Promise<void> {
				const editorGroupService = serviceAccessor.get(IEditorGroupsService);
				const viewDescriptorService = serviceAccessor.get(IViewDescriptorService);
				const layoutService = serviceAccessor.get(IWorkbenchLayoutService);
				const viewsService = serviceAccessor.get(IViewsService);
				const contextKeyService = serviceAccessor.get(IContextKeyService);

				const focusedViewId = FocusedViewContext.getValue(contextKeyService);
				if (focusedViewId === viewDescriptor.id && !options?.preserveFocus) {

					const viewLocation = viewDescriptorService.getViewLocationById(viewDescriptor.id);
					if (viewDescriptorService.getViewLocationById(viewDescriptor.id) === ViewContainerLocation.Sidebar) {
						// focus the editor if the view is focused and in the side bar
						editorGroupService.activeGroup.focus();
					} else if (viewLocation !== null) {
						// otherwise hide the part where the view lives if focused
						layoutService.setPartHidden(true, getPartByLocation(viewLocation));
					}
				} else {
					await viewsService.openView(viewDescriptor.id, !options?.preserveFocus);
				}
			}
		}));

		if (viewDescriptor.openCommandActionDescriptor?.mnemonicTitle) {
			const defaultViewContainer = this.viewDescriptorService.getDefaultContainerById(viewDescriptor.id);
			if (defaultViewContainer) {
				const defaultLocation = this.viewDescriptorService.getDefaultViewContainerLocation(defaultViewContainer);
				disposables.add(MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
					command: {
						id: commandId,
						title: viewDescriptor.openCommandActionDescriptor.mnemonicTitle,
					},
					group: defaultLocation === ViewContainerLocation.Sidebar ? '3_sidebar' : defaultLocation === ViewContainerLocation.AuxiliaryBar ? '4_auxbar' : '5_panel',
					when: ContextKeyExpr.has(`${viewDescriptor.id}.active`),
					order: viewDescriptor.openCommandActionDescriptor.order ?? Number.MAX_VALUE
				}));
			}
		}
		return disposables;
	}

	private registerFocusViewAction(viewDescriptor: IViewDescriptor, category?: string | ILocalizedString): IDisposable {
		return registerAction2(class FocusViewAction extends Action2 {
			constructor() {
				const title = localize2({ key: 'focus view', comment: ['{0} indicates the name of the view to be focused.'] }, "Focus on {0} View", viewDescriptor.name.value);
				super({
					id: viewDescriptor.focusCommand ? viewDescriptor.focusCommand.id : `${viewDescriptor.id}.focus`,
					title,
					category,
					menu: [{
						id: MenuId.CommandPalette,
						when: viewDescriptor.when,
					}],
					keybinding: {
						when: ContextKeyExpr.has(`${viewDescriptor.id}.active`),
						weight: KeybindingWeight.WorkbenchContrib,
						primary: viewDescriptor.focusCommand?.keybindings?.primary,
						secondary: viewDescriptor.focusCommand?.keybindings?.secondary,
						linux: viewDescriptor.focusCommand?.keybindings?.linux,
						mac: viewDescriptor.focusCommand?.keybindings?.mac,
						win: viewDescriptor.focusCommand?.keybindings?.win
					},
					metadata: {
						description: title.value,
						args: [
							{
								name: 'focusOptions',
								description: 'Focus Options',
								schema: {
									type: 'object',
									properties: {
										'preserveFocus': {
											type: 'boolean',
											default: false
										}
									},
								}
							}
						]
					}
				});
			}
			run(accessor: ServicesAccessor, options?: { preserveFocus?: boolean }): void {
				accessor.get(IViewsService).openView(viewDescriptor.id, !options?.preserveFocus);
			}
		});
	}

	private registerResetViewLocationAction(viewDescriptor: IViewDescriptor): IDisposable {
		return registerAction2(class ResetViewLocationAction extends Action2 {
			constructor() {
				super({
					id: `${viewDescriptor.id}.resetViewLocation`,
					title: localize2('resetViewLocation', "Reset Location"),
					menu: [{
						id: MenuId.ViewTitleContext,
						when: ContextKeyExpr.or(
							ContextKeyExpr.and(
								ContextKeyExpr.equals('view', viewDescriptor.id),
								ContextKeyExpr.equals(`${viewDescriptor.id}.defaultViewLocation`, false)
							)
						),
						group: '1_hide',
						order: 2
					}],
				});
			}
			run(accessor: ServicesAccessor): void {
				const viewDescriptorService = accessor.get(IViewDescriptorService);
				const defaultContainer = viewDescriptorService.getDefaultContainerById(viewDescriptor.id)!;
				const containerModel = viewDescriptorService.getViewContainerModel(defaultContainer)!;

				// The default container is hidden so we should try to reset its location first
				if (defaultContainer.hideIfEmpty && containerModel.visibleViewDescriptors.length === 0) {
					const defaultLocation = viewDescriptorService.getDefaultViewContainerLocation(defaultContainer)!;
					viewDescriptorService.moveViewContainerToLocation(defaultContainer, defaultLocation, undefined, this.desc.id);
				}

				viewDescriptorService.moveViewsToContainer([viewDescriptor], defaultContainer, undefined, this.desc.id);
				accessor.get(IViewsService).openView(viewDescriptor.id, true);
			}
		});
	}

	private registerPaneComposite(viewContainer: ViewContainer, viewContainerLocation: ViewContainerLocation): void {
		const that = this;
		class PaneContainer extends PaneComposite {
			constructor(
				@ITelemetryService telemetryService: ITelemetryService,
				@IWorkspaceContextService contextService: IWorkspaceContextService,
				@IStorageService storageService: IStorageService,
				@IInstantiationService instantiationService: IInstantiationService,
				@IThemeService themeService: IThemeService,
				@IContextMenuService contextMenuService: IContextMenuService,
				@IExtensionService extensionService: IExtensionService,
			) {
				super(viewContainer.id, telemetryService, storageService, instantiationService, themeService, contextMenuService, extensionService, contextService);
			}

			protected createViewPaneContainer(element: HTMLElement): ViewPaneContainer {
				const viewPaneContainerDisposables = this._register(new DisposableStore());

				// Use composite's instantiation service to get the editor progress service for any editors instantiated within the composite
				const viewPaneContainer = that.createViewPaneContainer(element, viewContainer, viewContainerLocation, viewPaneContainerDisposables, this.instantiationService);

				// Only updateTitleArea for non-filter views: microsoft/vscode-remote-release#3676
				if (!(viewPaneContainer instanceof FilterViewPaneContainer)) {
					viewPaneContainerDisposables.add(Event.any(viewPaneContainer.onDidAddViews, viewPaneContainer.onDidRemoveViews, viewPaneContainer.onTitleAreaUpdate)(() => {
						// Update title area since there is no better way to update secondary actions
						this.updateTitleArea();
					}));
				}

				return viewPaneContainer;
			}
		}

		Registry.as<PaneCompositeRegistry>(getPaneCompositeExtension(viewContainerLocation)).registerPaneComposite(PaneCompositeDescriptor.create(
			PaneContainer,
			viewContainer.id,
			typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.value,
			isString(viewContainer.icon) ? viewContainer.icon : undefined,
			viewContainer.order,
			viewContainer.requestedIndex,
			viewContainer.icon instanceof URI ? viewContainer.icon : undefined
		));
	}

	private deregisterPaneComposite(viewContainer: ViewContainer, viewContainerLocation: ViewContainerLocation): void {
		Registry.as<PaneCompositeRegistry>(getPaneCompositeExtension(viewContainerLocation)).deregisterPaneComposite(viewContainer.id);
	}

	private createViewPaneContainer(element: HTMLElement, viewContainer: ViewContainer, viewContainerLocation: ViewContainerLocation, disposables: DisposableStore, instantiationService: IInstantiationService): ViewPaneContainer {
		const viewPaneContainer: ViewPaneContainer = instantiationService.createInstance(viewContainer.ctorDescriptor.ctor, ...(viewContainer.ctorDescriptor.staticArguments || []));

		this.viewPaneContainers.set(viewPaneContainer.getId(), viewPaneContainer);
		disposables.add(toDisposable(() => this.viewPaneContainers.delete(viewPaneContainer.getId())));
		disposables.add(viewPaneContainer.onDidAddViews(views => this.onViewsAdded(views)));
		disposables.add(viewPaneContainer.onDidChangeViewVisibility(view => this.onViewsVisibilityChanged(view, view.isBodyVisible())));
		disposables.add(viewPaneContainer.onDidRemoveViews(views => this.onViewsRemoved(views)));
		disposables.add(viewPaneContainer.onDidFocusView(view => {
			if (this.focusedViewContextKey.get() !== view.id) {
				this.focusedViewContextKey.set(view.id);
				this._onDidChangeFocusedView.fire();
			}
		}));
		disposables.add(viewPaneContainer.onDidBlurView(view => {
			if (this.focusedViewContextKey.get() === view.id) {
				this.focusedViewContextKey.reset();
				this._onDidChangeFocusedView.fire();
			}
		}));

		return viewPaneContainer;
	}
}

function getEnabledViewContainerContextKey(viewContainerId: string): string { return `viewContainer.${viewContainerId}.enabled`; }

function getPaneCompositeExtension(viewContainerLocation: ViewContainerLocation): string {
	switch (viewContainerLocation) {
		case ViewContainerLocation.AuxiliaryBar:
			return PaneCompositeExtensions.Auxiliary;
		case ViewContainerLocation.Panel:
			return PaneCompositeExtensions.Panels;
		case ViewContainerLocation.Sidebar:
		default:
			return PaneCompositeExtensions.Viewlets;
	}
}

export function getPartByLocation(viewContainerLocation: ViewContainerLocation): Parts.AUXILIARYBAR_PART | Parts.SIDEBAR_PART | Parts.PANEL_PART {
	switch (viewContainerLocation) {
		case ViewContainerLocation.AuxiliaryBar:
			return Parts.AUXILIARYBAR_PART;
		case ViewContainerLocation.Panel:
			return Parts.PANEL_PART;
		case ViewContainerLocation.Sidebar:
		default:
			return Parts.SIDEBAR_PART;
	}
}

registerSingleton(IViewsService, ViewsService, InstantiationType.Eager /* Eager because it registers viewlets and panels in the constructor which are required during workbench layout */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/views/common/viewContainerModel.ts]---
Location: vscode-main/src/vs/workbench/services/views/common/viewContainerModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ViewContainer, IViewsRegistry, IViewDescriptor, Extensions as ViewExtensions, IViewContainerModel, IAddedViewDescriptorRef, IViewDescriptorRef, IAddedViewDescriptorState, defaultViewIcon, VIEWS_LOG_ID, VIEWS_LOG_NAME } from '../../../common/views.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { coalesce, move } from '../../../../base/common/arrays.js';
import { isUndefined, isUndefinedOrNull } from '../../../../base/common/types.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { CounterSet } from '../../../../base/common/map.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { windowLogGroup } from '../../log/common/logConstants.js';

export function getViewsStateStorageId(viewContainerStorageId: string): string { return `${viewContainerStorageId}.hidden`; }

interface IStoredWorkspaceViewState {
	collapsed: boolean;
	isHidden: boolean;
	size?: number;
	order?: number;
}

interface IStoredGlobalViewState {
	id: string;
	isHidden: boolean;
	order?: number;
}

interface IViewDescriptorState {
	visibleGlobal: boolean | undefined;
	visibleWorkspace: boolean | undefined;
	collapsed: boolean | undefined;
	active: boolean;
	order?: number;
	size?: number;
}

class ViewDescriptorsState extends Disposable {

	private readonly workspaceViewsStateStorageId: string;
	private readonly globalViewsStateStorageId: string;
	private readonly state: Map<string, IViewDescriptorState>;

	private _onDidChangeStoredState = this._register(new Emitter<{ id: string; visible: boolean }[]>());
	readonly onDidChangeStoredState = this._onDidChangeStoredState.event;

	private readonly logger: Lazy<ILogger>;

	constructor(
		viewContainerStorageId: string,
		private readonly viewContainerName: string,
		@IStorageService private readonly storageService: IStorageService,
		@ILoggerService loggerService: ILoggerService,
	) {
		super();

		this.logger = new Lazy(() => loggerService.createLogger(VIEWS_LOG_ID, { name: VIEWS_LOG_NAME, group: windowLogGroup }));

		this.globalViewsStateStorageId = getViewsStateStorageId(viewContainerStorageId);
		this.workspaceViewsStateStorageId = viewContainerStorageId;
		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, this.globalViewsStateStorageId, this._store)(() => this.onDidStorageChange()));

		this.state = this.initialize();

	}

	set(id: string, state: IViewDescriptorState): void {
		this.state.set(id, state);
	}

	get(id: string): IViewDescriptorState | undefined {
		return this.state.get(id);
	}

	updateState(viewDescriptors: ReadonlyArray<IViewDescriptor>): void {
		this.updateWorkspaceState(viewDescriptors);
		this.updateGlobalState(viewDescriptors);
	}

	private updateWorkspaceState(viewDescriptors: ReadonlyArray<IViewDescriptor>): void {
		const storedViewsStates = this.getStoredWorkspaceState();
		for (const viewDescriptor of viewDescriptors) {
			const viewState = this.get(viewDescriptor.id);
			if (viewState) {
				storedViewsStates[viewDescriptor.id] = {
					collapsed: !!viewState.collapsed,
					isHidden: !viewState.visibleWorkspace,
					size: viewState.size,
					order: viewDescriptor.workspace && viewState ? viewState.order : undefined
				};
			}
		}

		if (Object.keys(storedViewsStates).length > 0) {
			this.storageService.store(this.workspaceViewsStateStorageId, JSON.stringify(storedViewsStates), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(this.workspaceViewsStateStorageId, StorageScope.WORKSPACE);
		}
	}

	private updateGlobalState(viewDescriptors: ReadonlyArray<IViewDescriptor>): void {
		const storedGlobalState = this.getStoredGlobalState();
		for (const viewDescriptor of viewDescriptors) {
			const state = this.get(viewDescriptor.id);
			storedGlobalState.set(viewDescriptor.id, {
				id: viewDescriptor.id,
				isHidden: state && viewDescriptor.canToggleVisibility ? !state.visibleGlobal : false,
				order: !viewDescriptor.workspace && state ? state.order : undefined
			});
		}
		this.setStoredGlobalState(storedGlobalState);
	}

	private onDidStorageChange(): void {
		if (this.globalViewsStatesValue !== this.getStoredGlobalViewsStatesValue() /* This checks if current window changed the value or not */) {
			this._globalViewsStatesValue = undefined;
			const storedViewsVisibilityStates = this.getStoredGlobalState();
			const storedWorkspaceViewsStates = this.getStoredWorkspaceState();
			const changedStates: { id: string; visible: boolean }[] = [];
			for (const [id, storedState] of storedViewsVisibilityStates) {
				const state = this.get(id);
				if (state) {
					if (state.visibleGlobal !== !storedState.isHidden) {
						if (!storedState.isHidden) {
							this.logger.value.trace(`View visibility state changed: ${id} is now visible`, this.viewContainerName);
						}
						changedStates.push({ id, visible: !storedState.isHidden });
					}
				} else {
					const workspaceViewState: IStoredWorkspaceViewState | undefined = storedWorkspaceViewsStates[id];
					this.set(id, {
						active: false,
						visibleGlobal: !storedState.isHidden,
						visibleWorkspace: isUndefined(workspaceViewState?.isHidden) ? undefined : !workspaceViewState?.isHidden,
						collapsed: workspaceViewState?.collapsed,
						order: workspaceViewState?.order,
						size: workspaceViewState?.size,
					});
				}
			}
			if (changedStates.length) {
				this._onDidChangeStoredState.fire(changedStates);
				// Update the in memory state after firing the event
				// so that the views can update their state accordingly
				for (const changedState of changedStates) {
					const state = this.get(changedState.id);
					if (state) {
						state.visibleGlobal = changedState.visible;
					}
				}
			}
		}
	}

	private initialize(): Map<string, IViewDescriptorState> {
		const viewStates = new Map<string, IViewDescriptorState>();
		const workspaceViewsStates = this.getStoredWorkspaceState();
		for (const id of Object.keys(workspaceViewsStates)) {
			const workspaceViewState = workspaceViewsStates[id];
			viewStates.set(id, {
				active: false,
				visibleGlobal: undefined,
				visibleWorkspace: isUndefined(workspaceViewState.isHidden) ? undefined : !workspaceViewState.isHidden,
				collapsed: workspaceViewState.collapsed,
				order: workspaceViewState.order,
				size: workspaceViewState.size,
			});
		}

		// Migrate to `viewletStateStorageId`
		const value = this.storageService.get(this.globalViewsStateStorageId, StorageScope.WORKSPACE, '[]');
		const { state: workspaceVisibilityStates } = this.parseStoredGlobalState(value);
		if (workspaceVisibilityStates.size > 0) {
			for (const { id, isHidden } of workspaceVisibilityStates.values()) {
				const viewState = viewStates.get(id);
				// Not migrated to `viewletStateStorageId`
				if (viewState) {
					if (isUndefined(viewState.visibleWorkspace)) {
						viewState.visibleWorkspace = !isHidden;
					}
				} else {
					viewStates.set(id, {
						active: false,
						collapsed: undefined,
						visibleGlobal: undefined,
						visibleWorkspace: !isHidden,
					});
				}
			}
			this.storageService.remove(this.globalViewsStateStorageId, StorageScope.WORKSPACE);
		}

		const { state, hasDuplicates } = this.parseStoredGlobalState(this.globalViewsStatesValue);
		if (hasDuplicates) {
			this.setStoredGlobalState(state);
		}
		for (const { id, isHidden, order } of state.values()) {
			const viewState = viewStates.get(id);
			if (viewState) {
				viewState.visibleGlobal = !isHidden;
				if (!isUndefined(order)) {
					viewState.order = order;
				}
			} else {
				viewStates.set(id, {
					active: false,
					visibleGlobal: !isHidden,
					order,
					collapsed: undefined,
					visibleWorkspace: undefined,
				});
			}
		}
		return viewStates;
	}

	private getStoredWorkspaceState(): IStringDictionary<IStoredWorkspaceViewState> {
		return JSON.parse(this.storageService.get(this.workspaceViewsStateStorageId, StorageScope.WORKSPACE, '{}'));
	}

	private getStoredGlobalState(): Map<string, IStoredGlobalViewState> {
		return this.parseStoredGlobalState(this.globalViewsStatesValue).state;
	}

	private setStoredGlobalState(storedGlobalState: Map<string, IStoredGlobalViewState>): void {
		this.globalViewsStatesValue = JSON.stringify([...storedGlobalState.values()]);
	}

	private parseStoredGlobalState(value: string): { state: Map<string, IStoredGlobalViewState>; hasDuplicates: boolean } {
		const storedValue: Array<string | IStoredGlobalViewState> = JSON.parse(value);
		let hasDuplicates = false;
		const state = storedValue.reduce((result, storedState) => {
			if (typeof storedState === 'string' /* migration */) {
				hasDuplicates = hasDuplicates || result.has(storedState);
				result.set(storedState, { id: storedState, isHidden: true });
			} else {
				hasDuplicates = hasDuplicates || result.has(storedState.id);
				result.set(storedState.id, storedState);
			}
			return result;
		}, new Map<string, IStoredGlobalViewState>());
		return { state, hasDuplicates };
	}

	private _globalViewsStatesValue: string | undefined;
	private get globalViewsStatesValue(): string {
		if (!this._globalViewsStatesValue) {
			this._globalViewsStatesValue = this.getStoredGlobalViewsStatesValue();
		}

		return this._globalViewsStatesValue;
	}

	private set globalViewsStatesValue(globalViewsStatesValue: string) {
		if (this.globalViewsStatesValue !== globalViewsStatesValue) {
			this._globalViewsStatesValue = globalViewsStatesValue;
			this.setStoredGlobalViewsStatesValue(globalViewsStatesValue);
		}
	}

	private getStoredGlobalViewsStatesValue(): string {
		return this.storageService.get(this.globalViewsStateStorageId, StorageScope.PROFILE, '[]');
	}

	private setStoredGlobalViewsStatesValue(value: string): void {
		this.storageService.store(this.globalViewsStateStorageId, value, StorageScope.PROFILE, StorageTarget.USER);
	}

}

interface IViewDescriptorItem {
	viewDescriptor: IViewDescriptor;
	state: IViewDescriptorState;
}

export class ViewContainerModel extends Disposable implements IViewContainerModel {

	private readonly contextKeys = new CounterSet<string>();
	private viewDescriptorItems: IViewDescriptorItem[] = [];
	private viewDescriptorsState: ViewDescriptorsState;

	// Container Info
	private _title!: string;
	get title(): string { return this._title; }

	private _icon: URI | ThemeIcon | undefined;
	get icon(): URI | ThemeIcon | undefined { return this._icon; }

	private _keybindingId: string | undefined;
	get keybindingId(): string | undefined { return this._keybindingId; }

	private _onDidChangeContainerInfo = this._register(new Emitter<{ title?: boolean; icon?: boolean; keybindingId?: boolean }>());
	readonly onDidChangeContainerInfo = this._onDidChangeContainerInfo.event;

	// All View Descriptors
	get allViewDescriptors(): ReadonlyArray<IViewDescriptor> { return this.viewDescriptorItems.map(item => item.viewDescriptor); }
	private _onDidChangeAllViewDescriptors = this._register(new Emitter<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>());
	readonly onDidChangeAllViewDescriptors = this._onDidChangeAllViewDescriptors.event;

	// Active View Descriptors
	get activeViewDescriptors(): ReadonlyArray<IViewDescriptor> { return this.viewDescriptorItems.filter(item => item.state.active).map(item => item.viewDescriptor); }
	private _onDidChangeActiveViewDescriptors = this._register(new Emitter<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>());
	readonly onDidChangeActiveViewDescriptors = this._onDidChangeActiveViewDescriptors.event;

	// Visible View Descriptors
	get visibleViewDescriptors(): ReadonlyArray<IViewDescriptor> { return this.viewDescriptorItems.filter(item => this.isViewDescriptorVisible(item)).map(item => item.viewDescriptor); }

	private _onDidAddVisibleViewDescriptors = this._register(new Emitter<IAddedViewDescriptorRef[]>());
	readonly onDidAddVisibleViewDescriptors: Event<IAddedViewDescriptorRef[]> = this._onDidAddVisibleViewDescriptors.event;

	private _onDidRemoveVisibleViewDescriptors = this._register(new Emitter<IViewDescriptorRef[]>());
	readonly onDidRemoveVisibleViewDescriptors: Event<IViewDescriptorRef[]> = this._onDidRemoveVisibleViewDescriptors.event;

	private _onDidMoveVisibleViewDescriptors = this._register(new Emitter<{ from: IViewDescriptorRef; to: IViewDescriptorRef }>());
	readonly onDidMoveVisibleViewDescriptors: Event<{ from: IViewDescriptorRef; to: IViewDescriptorRef }> = this._onDidMoveVisibleViewDescriptors.event;

	private readonly logger: Lazy<ILogger>;

	constructor(
		readonly viewContainer: ViewContainer,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ILoggerService loggerService: ILoggerService,
	) {
		super();

		this.logger = new Lazy(() => loggerService.createLogger(VIEWS_LOG_ID, { name: VIEWS_LOG_NAME, group: windowLogGroup }));

		this._register(Event.filter(contextKeyService.onDidChangeContext, e => e.affectsSome(this.contextKeys))(() => this.onDidChangeContext()));
		this.viewDescriptorsState = this._register(instantiationService.createInstance(ViewDescriptorsState, viewContainer.storageId || `${viewContainer.id}.state`, typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.original));
		this._register(this.viewDescriptorsState.onDidChangeStoredState(items => this.updateVisibility(items)));

		this.updateContainerInfo();
	}

	private updateContainerInfo(): void {
		/* Use default container info if one of the visible view descriptors belongs to the current container by default */
		const useDefaultContainerInfo = this.viewContainer.alwaysUseContainerInfo || this.visibleViewDescriptors.length === 0 || this.visibleViewDescriptors.some(v => Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).getViewContainer(v.id) === this.viewContainer);
		const title = useDefaultContainerInfo ? (typeof this.viewContainer.title === 'string' ? this.viewContainer.title : this.viewContainer.title.value) : this.visibleViewDescriptors[0]?.containerTitle || this.visibleViewDescriptors[0]?.name?.value || '';
		let titleChanged: boolean = false;
		if (this._title !== title) {
			this._title = title;
			titleChanged = true;
		}

		const icon = useDefaultContainerInfo ? this.viewContainer.icon : this.visibleViewDescriptors[0]?.containerIcon || defaultViewIcon;
		let iconChanged: boolean = false;
		if (!this.isEqualIcon(icon)) {
			this._icon = icon;
			iconChanged = true;
		}

		const keybindingId = this.viewContainer.openCommandActionDescriptor?.id ?? this.activeViewDescriptors.find(v => v.openCommandActionDescriptor)?.openCommandActionDescriptor?.id;
		let keybindingIdChanged: boolean = false;
		if (this._keybindingId !== keybindingId) {
			this._keybindingId = keybindingId;
			keybindingIdChanged = true;
		}

		if (titleChanged || iconChanged || keybindingIdChanged) {
			this._onDidChangeContainerInfo.fire({ title: titleChanged, icon: iconChanged, keybindingId: keybindingIdChanged });
		}
	}

	private isEqualIcon(icon: URI | ThemeIcon | undefined): boolean {
		if (URI.isUri(icon)) {
			return URI.isUri(this._icon) && isEqual(icon, this._icon);
		} else if (ThemeIcon.isThemeIcon(icon)) {
			return ThemeIcon.isThemeIcon(this._icon) && ThemeIcon.isEqual(icon, this._icon);
		}
		return icon === this._icon;
	}

	isVisible(id: string): boolean {
		const viewDescriptorItem = this.viewDescriptorItems.find(v => v.viewDescriptor.id === id);
		if (!viewDescriptorItem) {
			throw new Error(`Unknown view ${id}`);
		}
		return this.isViewDescriptorVisible(viewDescriptorItem);
	}

	setVisible(id: string, visible: boolean): void {
		this.updateVisibility([{ id, visible }]);
	}

	private updateVisibility(viewDescriptors: { id: string; visible: boolean }[]): void {
		// First: Update and remove the view descriptors which are asked to be hidden
		const viewDescriptorItemsToHide = coalesce(viewDescriptors.filter(({ visible }) => !visible)
			.map(({ id }) => this.findAndIgnoreIfNotFound(id)));
		const removed: IViewDescriptorRef[] = [];
		for (const { viewDescriptorItem, visibleIndex } of viewDescriptorItemsToHide) {
			if (this.updateViewDescriptorItemVisibility(viewDescriptorItem, false)) {
				removed.push({ viewDescriptor: viewDescriptorItem.viewDescriptor, index: visibleIndex });
			}
		}
		if (removed.length) {
			this.broadCastRemovedVisibleViewDescriptors(removed);
		}

		// Second: Update and add the view descriptors which are asked to be shown
		const added: IAddedViewDescriptorRef[] = [];
		for (const { id, visible } of viewDescriptors) {
			if (!visible) {
				continue;
			}
			const foundViewDescriptor = this.findAndIgnoreIfNotFound(id);
			if (!foundViewDescriptor) {
				continue;
			}
			const { viewDescriptorItem, visibleIndex } = foundViewDescriptor;
			if (this.updateViewDescriptorItemVisibility(viewDescriptorItem, true)) {
				added.push({ index: visibleIndex, viewDescriptor: viewDescriptorItem.viewDescriptor, size: viewDescriptorItem.state.size, collapsed: !!viewDescriptorItem.state.collapsed });
			}
		}
		if (added.length) {
			this.broadCastAddedVisibleViewDescriptors(added);
		}
	}

	private updateViewDescriptorItemVisibility(viewDescriptorItem: IViewDescriptorItem, visible: boolean): boolean {
		if (!viewDescriptorItem.viewDescriptor.canToggleVisibility) {
			return false;
		}
		if (this.isViewDescriptorVisibleWhenActive(viewDescriptorItem) === visible) {
			return false;
		}

		// update visibility
		if (viewDescriptorItem.viewDescriptor.workspace) {
			viewDescriptorItem.state.visibleWorkspace = visible;
		} else {
			viewDescriptorItem.state.visibleGlobal = visible;
			if (visible) {
				this.logger.value.trace(`Showing view ${viewDescriptorItem.viewDescriptor.id} in the container ${this.viewContainer.id}`);
			}
		}

		// return `true` only if visibility is changed
		return this.isViewDescriptorVisible(viewDescriptorItem) === visible;
	}

	isCollapsed(id: string): boolean {
		return !!this.find(id).viewDescriptorItem.state.collapsed;
	}

	setCollapsed(id: string, collapsed: boolean): void {
		const { viewDescriptorItem } = this.find(id);
		if (viewDescriptorItem.state.collapsed !== collapsed) {
			viewDescriptorItem.state.collapsed = collapsed;
		}
		this.viewDescriptorsState.updateState(this.allViewDescriptors);
	}

	getSize(id: string): number | undefined {
		return this.find(id).viewDescriptorItem.state.size;
	}

	setSizes(newSizes: readonly { id: string; size: number }[]): void {
		for (const { id, size } of newSizes) {
			const { viewDescriptorItem } = this.find(id);
			if (viewDescriptorItem.state.size !== size) {
				viewDescriptorItem.state.size = size;
			}
		}
		this.viewDescriptorsState.updateState(this.allViewDescriptors);
	}

	move(from: string, to: string): void {
		const fromIndex = this.viewDescriptorItems.findIndex(v => v.viewDescriptor.id === from);
		const toIndex = this.viewDescriptorItems.findIndex(v => v.viewDescriptor.id === to);

		const fromViewDescriptor = this.viewDescriptorItems[fromIndex];
		const toViewDescriptor = this.viewDescriptorItems[toIndex];

		move(this.viewDescriptorItems, fromIndex, toIndex);

		for (let index = 0; index < this.viewDescriptorItems.length; index++) {
			this.viewDescriptorItems[index].state.order = index;
		}

		this.broadCastMovedViewDescriptors({ index: fromIndex, viewDescriptor: fromViewDescriptor.viewDescriptor }, { index: toIndex, viewDescriptor: toViewDescriptor.viewDescriptor });
	}

	add(addedViewDescriptorStates: IAddedViewDescriptorState[]): void {
		const addedItems: IViewDescriptorItem[] = [];
		for (const addedViewDescriptorState of addedViewDescriptorStates) {
			const viewDescriptor = addedViewDescriptorState.viewDescriptor;

			if (viewDescriptor.when) {
				for (const key of viewDescriptor.when.keys()) {
					this.contextKeys.add(key);
				}
			}

			let state = this.viewDescriptorsState.get(viewDescriptor.id);
			if (state) {
				// set defaults if not set
				if (viewDescriptor.workspace) {
					state.visibleWorkspace = isUndefinedOrNull(addedViewDescriptorState.visible) ? (isUndefinedOrNull(state.visibleWorkspace) ? !viewDescriptor.hideByDefault : state.visibleWorkspace) : addedViewDescriptorState.visible;
				} else {
					const isVisible = state.visibleGlobal;
					state.visibleGlobal = isUndefinedOrNull(addedViewDescriptorState.visible) ? (isUndefinedOrNull(state.visibleGlobal) ? !viewDescriptor.hideByDefault : state.visibleGlobal) : addedViewDescriptorState.visible;
					if (state.visibleGlobal && !isVisible) {
						this.logger.value.trace(`Added view ${viewDescriptor.id} in the container ${this.viewContainer.id} and showing it.`, `${isVisible}`, `${viewDescriptor.hideByDefault}`, `${addedViewDescriptorState.visible}`);
					}
				}
				state.collapsed = isUndefinedOrNull(addedViewDescriptorState.collapsed) ? (isUndefinedOrNull(state.collapsed) ? !!viewDescriptor.collapsed : state.collapsed) : addedViewDescriptorState.collapsed;
			} else {
				state = {
					active: false,
					visibleGlobal: isUndefinedOrNull(addedViewDescriptorState.visible) ? !viewDescriptor.hideByDefault : addedViewDescriptorState.visible,
					visibleWorkspace: isUndefinedOrNull(addedViewDescriptorState.visible) ? !viewDescriptor.hideByDefault : addedViewDescriptorState.visible,
					collapsed: isUndefinedOrNull(addedViewDescriptorState.collapsed) ? !!viewDescriptor.collapsed : addedViewDescriptorState.collapsed,
				};
			}
			this.viewDescriptorsState.set(viewDescriptor.id, state);
			state.active = this.contextKeyService.contextMatchesRules(viewDescriptor.when);
			addedItems.push({ viewDescriptor, state });
		}
		this.viewDescriptorItems.push(...addedItems);
		this.viewDescriptorItems.sort(this.compareViewDescriptors.bind(this));
		this._onDidChangeAllViewDescriptors.fire({ added: addedItems.map(({ viewDescriptor }) => viewDescriptor), removed: [] });

		const addedActiveItems: { viewDescriptorItem: IViewDescriptorItem; visible: boolean }[] = [];
		for (const viewDescriptorItem of addedItems) {
			if (viewDescriptorItem.state.active) {
				addedActiveItems.push({ viewDescriptorItem, visible: this.isViewDescriptorVisible(viewDescriptorItem) });
			}
		}
		if (addedActiveItems.length) {
			this._onDidChangeActiveViewDescriptors.fire(({ added: addedActiveItems.map(({ viewDescriptorItem }) => viewDescriptorItem.viewDescriptor), removed: [] }));
		}

		const addedVisibleDescriptors: IAddedViewDescriptorRef[] = [];
		for (const { viewDescriptorItem, visible } of addedActiveItems) {
			if (visible && this.isViewDescriptorVisible(viewDescriptorItem)) {
				const { visibleIndex } = this.find(viewDescriptorItem.viewDescriptor.id);
				addedVisibleDescriptors.push({ index: visibleIndex, viewDescriptor: viewDescriptorItem.viewDescriptor, size: viewDescriptorItem.state.size, collapsed: !!viewDescriptorItem.state.collapsed });
			}
		}
		this.broadCastAddedVisibleViewDescriptors(addedVisibleDescriptors);
	}

	remove(viewDescriptors: IViewDescriptor[]): void {
		const removed: IViewDescriptor[] = [];
		const removedItems: IViewDescriptorItem[] = [];
		const removedActiveDescriptors: IViewDescriptor[] = [];
		const removedVisibleDescriptors: IViewDescriptorRef[] = [];

		for (const viewDescriptor of viewDescriptors) {
			if (viewDescriptor.when) {
				for (const key of viewDescriptor.when.keys()) {
					this.contextKeys.delete(key);
				}
			}
			const index = this.viewDescriptorItems.findIndex(i => i.viewDescriptor.id === viewDescriptor.id);
			if (index !== -1) {
				removed.push(viewDescriptor);
				const viewDescriptorItem = this.viewDescriptorItems[index];
				if (viewDescriptorItem.state.active) {
					removedActiveDescriptors.push(viewDescriptorItem.viewDescriptor);
				}
				if (this.isViewDescriptorVisible(viewDescriptorItem)) {
					const { visibleIndex } = this.find(viewDescriptorItem.viewDescriptor.id);
					removedVisibleDescriptors.push({ index: visibleIndex, viewDescriptor: viewDescriptorItem.viewDescriptor });
				}
				removedItems.push(viewDescriptorItem);
			}
		}

		// update state
		removedItems.forEach(item => this.viewDescriptorItems.splice(this.viewDescriptorItems.indexOf(item), 1));

		this.broadCastRemovedVisibleViewDescriptors(removedVisibleDescriptors);
		if (removedActiveDescriptors.length) {
			this._onDidChangeActiveViewDescriptors.fire(({ added: [], removed: removedActiveDescriptors }));
		}
		if (removed.length) {
			this._onDidChangeAllViewDescriptors.fire({ added: [], removed });
		}
	}

	private onDidChangeContext(): void {
		const addedActiveItems: { item: IViewDescriptorItem; visibleWhenActive: boolean }[] = [];
		const removedActiveItems: IViewDescriptorItem[] = [];

		for (const item of this.viewDescriptorItems) {
			const wasActive = item.state.active;
			const isActive = this.contextKeyService.contextMatchesRules(item.viewDescriptor.when);
			if (wasActive !== isActive) {
				if (isActive) {
					addedActiveItems.push({ item, visibleWhenActive: this.isViewDescriptorVisibleWhenActive(item) });
				} else {
					removedActiveItems.push(item);
				}
			}
		}

		const removedVisibleDescriptors: IViewDescriptorRef[] = [];
		for (const item of removedActiveItems) {
			if (this.isViewDescriptorVisible(item)) {
				const { visibleIndex } = this.find(item.viewDescriptor.id);
				removedVisibleDescriptors.push({ index: visibleIndex, viewDescriptor: item.viewDescriptor });
			}
		}

		// Update the State
		removedActiveItems.forEach(item => item.state.active = false);
		addedActiveItems.forEach(({ item }) => item.state.active = true);

		this.broadCastRemovedVisibleViewDescriptors(removedVisibleDescriptors);

		if (addedActiveItems.length || removedActiveItems.length) {
			this._onDidChangeActiveViewDescriptors.fire(({ added: addedActiveItems.map(({ item }) => item.viewDescriptor), removed: removedActiveItems.map(item => item.viewDescriptor) }));
		}

		const addedVisibleDescriptors: IAddedViewDescriptorRef[] = [];
		for (const { item, visibleWhenActive } of addedActiveItems) {
			if (visibleWhenActive && this.isViewDescriptorVisible(item)) {
				const { visibleIndex } = this.find(item.viewDescriptor.id);
				addedVisibleDescriptors.push({ index: visibleIndex, viewDescriptor: item.viewDescriptor, size: item.state.size, collapsed: !!item.state.collapsed });
			}
		}
		this.broadCastAddedVisibleViewDescriptors(addedVisibleDescriptors);
	}

	private broadCastAddedVisibleViewDescriptors(added: IAddedViewDescriptorRef[]): void {
		if (added.length) {
			this._onDidAddVisibleViewDescriptors.fire(added.sort((a, b) => a.index - b.index));
			this.updateState(`Added views:${added.map(v => v.viewDescriptor.id).join(',')} in ${this.viewContainer.id}`);
		}
	}

	private broadCastRemovedVisibleViewDescriptors(removed: IViewDescriptorRef[]): void {
		if (removed.length) {
			this._onDidRemoveVisibleViewDescriptors.fire(removed.sort((a, b) => b.index - a.index));
			this.updateState(`Removed views:${removed.map(v => v.viewDescriptor.id).join(',')} from ${this.viewContainer.id}`);
		}
	}

	private broadCastMovedViewDescriptors(from: IViewDescriptorRef, to: IViewDescriptorRef): void {
		this._onDidMoveVisibleViewDescriptors.fire({ from, to });
		this.updateState(`Moved view ${from.viewDescriptor.id} to ${to.viewDescriptor.id} in ${this.viewContainer.id}`);
	}

	private updateState(reason: string): void {
		this.logger.value.trace(reason);
		this.viewDescriptorsState.updateState(this.allViewDescriptors);
		this.updateContainerInfo();
	}

	private isViewDescriptorVisible(viewDescriptorItem: IViewDescriptorItem): boolean {
		if (!viewDescriptorItem.state.active) {
			return false;
		}
		return this.isViewDescriptorVisibleWhenActive(viewDescriptorItem);
	}

	private isViewDescriptorVisibleWhenActive(viewDescriptorItem: IViewDescriptorItem): boolean {
		if (viewDescriptorItem.viewDescriptor.workspace) {
			return !!viewDescriptorItem.state.visibleWorkspace;
		}
		return !!viewDescriptorItem.state.visibleGlobal;
	}

	private find(id: string): { index: number; visibleIndex: number; viewDescriptorItem: IViewDescriptorItem } {
		const result = this.findAndIgnoreIfNotFound(id);
		if (result) {
			return result;
		}
		throw new Error(`view descriptor ${id} not found`);
	}

	private findAndIgnoreIfNotFound(id: string): { index: number; visibleIndex: number; viewDescriptorItem: IViewDescriptorItem } | undefined {
		for (let i = 0, visibleIndex = 0; i < this.viewDescriptorItems.length; i++) {
			const viewDescriptorItem = this.viewDescriptorItems[i];
			if (viewDescriptorItem.viewDescriptor.id === id) {
				return { index: i, visibleIndex, viewDescriptorItem: viewDescriptorItem };
			}
			if (this.isViewDescriptorVisible(viewDescriptorItem)) {
				visibleIndex++;
			}
		}
		return undefined;
	}

	private compareViewDescriptors(a: IViewDescriptorItem, b: IViewDescriptorItem): number {
		if (a.viewDescriptor.id === b.viewDescriptor.id) {
			return 0;
		}

		return (this.getViewOrder(a) - this.getViewOrder(b)) || this.getGroupOrderResult(a.viewDescriptor, b.viewDescriptor);
	}

	private getViewOrder(viewDescriptorItem: IViewDescriptorItem): number {
		const viewOrder = typeof viewDescriptorItem.state.order === 'number' ? viewDescriptorItem.state.order : viewDescriptorItem.viewDescriptor.order;
		return typeof viewOrder === 'number' ? viewOrder : Number.MAX_VALUE;
	}

	private getGroupOrderResult(a: IViewDescriptor, b: IViewDescriptor) {
		if (!a.group || !b.group) {
			return 0;
		}

		if (a.group === b.group) {
			return 0;
		}

		return a.group < b.group ? -1 : 1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/views/common/viewsService.ts]---
Location: vscode-main/src/vs/workbench/services/views/common/viewsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgressIndicator } from '../../../../platform/progress/common/progress.js';
import { IPaneComposite } from '../../../common/panecomposite.js';
import { IView, IViewDescriptor, IViewPaneContainer, ViewContainer, ViewContainerLocation } from '../../../common/views.js';

export const IViewsService = createDecorator<IViewsService>('viewsService');
export interface IViewsService {

	readonly _serviceBrand: undefined;

	// View Container APIs
	readonly onDidChangeViewContainerVisibility: Event<{ id: string; visible: boolean; location: ViewContainerLocation }>;
	isViewContainerVisible(id: string): boolean;
	isViewContainerActive(id: string): boolean;
	openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null>;
	closeViewContainer(id: string): void;
	getVisibleViewContainer(location: ViewContainerLocation): ViewContainer | null;
	getActiveViewPaneContainerWithId(viewContainerId: string): IViewPaneContainer | null;
	getFocusedView(): IViewDescriptor | null;
	getFocusedViewName(): string;

	// View APIs
	readonly onDidChangeViewVisibility: Event<{ id: string; visible: boolean }>;
	readonly onDidChangeFocusedView: Event<void>;
	isViewVisible(id: string): boolean;
	openView<T extends IView>(id: string, focus?: boolean): Promise<T | null>;
	closeView(id: string): void;
	getActiveViewWithId<T extends IView>(id: string): T | null;
	getViewWithId<T extends IView>(id: string): T | null;
	getViewProgressIndicator(id: string): IProgressIndicator | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/views/test/browser/viewContainerModel.test.ts]---
Location: vscode-main/src/vs/workbench/services/views/test/browser/viewContainerModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import assert from 'assert';
import * as sinon from 'sinon';
import { IViewsRegistry, IViewDescriptor, IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, IViewContainerModel, IViewDescriptorService, ViewContainer } from '../../../../common/views.js';
import { IDisposable, dispose } from '../../../../../base/common/lifecycle.js';
import { move } from '../../../../../base/common/arrays.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { ViewDescriptorService } from '../../browser/viewDescriptorService.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { Event } from '../../../../../base/common/event.js';
import { getViewsStateStorageId } from '../../common/viewContainerModel.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const ViewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const ViewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);

class ViewDescriptorSequence {

	readonly elements: IViewDescriptor[];
	private disposables: IDisposable[] = [];

	constructor(model: IViewContainerModel) {
		this.elements = [...model.visibleViewDescriptors];
		model.onDidAddVisibleViewDescriptors(added => added.forEach(({ viewDescriptor, index }) => this.elements.splice(index, 0, viewDescriptor)), null, this.disposables);
		model.onDidRemoveVisibleViewDescriptors(removed => removed.sort((a, b) => b.index - a.index).forEach(({ index }) => this.elements.splice(index, 1)), null, this.disposables);
		model.onDidMoveVisibleViewDescriptors(({ from, to }) => move(this.elements, from.index, to.index), null, this.disposables);
	}

	dispose() {
		this.disposables = dispose(this.disposables);
	}
}

suite('ViewContainerModel', () => {

	let container: ViewContainer;
	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();
	let contextKeyService: IContextKeyService;
	let viewDescriptorService: IViewDescriptorService;
	let storageService: IStorageService;

	setup(() => {
		const instantiationService: TestInstantiationService = workbenchInstantiationService(undefined, disposableStore);
		contextKeyService = disposableStore.add(instantiationService.createInstance(ContextKeyService));
		instantiationService.stub(IContextKeyService, contextKeyService);
		storageService = instantiationService.get(IStorageService);
		viewDescriptorService = disposableStore.add(instantiationService.createInstance(ViewDescriptorService));
	});

	teardown(() => {
		ViewsRegistry.deregisterViews(ViewsRegistry.getViews(container), container);
		ViewContainerRegistry.deregisterViewContainer(container);
	});

	test('empty model', function () {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
	});

	test('register/unregister', () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1')
		};

		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 1);
		assert.strictEqual(target.elements.length, 1);
		assert.deepStrictEqual(testObject.visibleViewDescriptors[0], viewDescriptor);
		assert.deepStrictEqual(target.elements[0], viewDescriptor);

		ViewsRegistry.deregisterViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);
	});

	test('when contexts', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true)
		};

		ViewsRegistry.registerViews([viewDescriptor], container);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should not appear since context isnt in');
		assert.strictEqual(target.elements.length, 0);

		const key = contextKeyService.createKey<boolean>('showview1', false);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should still not appear since showview1 isnt true');
		assert.strictEqual(target.elements.length, 0);

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 1, 'view should appear');
		assert.strictEqual(target.elements.length, 1);
		assert.deepStrictEqual(testObject.visibleViewDescriptors[0], viewDescriptor);
		assert.strictEqual(target.elements[0], viewDescriptor);

		key.set(false);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should disappear');
		assert.strictEqual(target.elements.length, 0);

		ViewsRegistry.deregisterViews([viewDescriptor], container);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should not be there anymore');
		assert.strictEqual(target.elements.length, 0);

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should not be there anymore');
		assert.strictEqual(target.elements.length, 0);
	}));

	test('when contexts - multiple', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const view1: IViewDescriptor = { id: 'view1', ctorDescriptor: null!, name: nls.localize2('Test View 1', 'Test View 1') };
		const view2: IViewDescriptor = { id: 'view2', ctorDescriptor: null!, name: nls.localize2('Test View 2', 'Test View 2'), when: ContextKeyExpr.equals('showview2', true) };

		ViewsRegistry.registerViews([view1, view2], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1], 'only view1 should be visible');
		assert.deepStrictEqual(target.elements, [view1], 'only view1 should be visible');

		const key = contextKeyService.createKey<boolean>('showview2', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1], 'still only view1 should be visible');
		assert.deepStrictEqual(target.elements, [view1], 'still only view1 should be visible');

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2], 'both views should be visible');
		assert.deepStrictEqual(target.elements, [view1, view2], 'both views should be visible');

		ViewsRegistry.deregisterViews([view1, view2], container);
	}));

	test('when contexts - multiple 2', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const view1: IViewDescriptor = { id: 'view1', ctorDescriptor: null!, name: nls.localize2('Test View 1', 'Test View 1'), when: ContextKeyExpr.equals('showview1', true) };
		const view2: IViewDescriptor = { id: 'view2', ctorDescriptor: null!, name: nls.localize2('Test View 2', 'Test View 2') };

		ViewsRegistry.registerViews([view1, view2], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2], 'only view2 should be visible');
		assert.deepStrictEqual(target.elements, [view2], 'only view2 should be visible');

		const key = contextKeyService.createKey<boolean>('showview1', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2], 'still only view2 should be visible');
		assert.deepStrictEqual(target.elements, [view2], 'still only view2 should be visible');

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2], 'both views should be visible');
		assert.deepStrictEqual(target.elements, [view1, view2], 'both views should be visible');

		ViewsRegistry.deregisterViews([view1, view2], container);
	}));

	test('setVisible', () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const view1: IViewDescriptor = { id: 'view1', ctorDescriptor: null!, name: nls.localize2('Test View 1', 'Test View 1'), canToggleVisibility: true };
		const view2: IViewDescriptor = { id: 'view2', ctorDescriptor: null!, name: nls.localize2('Test View 2', 'Test View 2'), canToggleVisibility: true };
		const view3: IViewDescriptor = { id: 'view3', ctorDescriptor: null!, name: nls.localize2('Test View 3', 'Test View 3'), canToggleVisibility: true };

		ViewsRegistry.registerViews([view1, view2, view3], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2, view3]);
		assert.deepStrictEqual(target.elements, [view1, view2, view3]);

		testObject.setVisible('view2', true);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2, view3], 'nothing should happen');
		assert.deepStrictEqual(target.elements, [view1, view2, view3]);

		testObject.setVisible('view2', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view3], 'view2 should hide');
		assert.deepStrictEqual(target.elements, [view1, view3]);

		testObject.setVisible('view1', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view3], 'view1 should hide');
		assert.deepStrictEqual(target.elements, [view3]);

		testObject.setVisible('view3', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [], 'view3 shoud hide');
		assert.deepStrictEqual(target.elements, []);

		testObject.setVisible('view1', true);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1], 'view1 should show');
		assert.deepStrictEqual(target.elements, [view1]);

		testObject.setVisible('view3', true);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view3], 'view3 should show');
		assert.deepStrictEqual(target.elements, [view1, view3]);

		testObject.setVisible('view2', true);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2, view3], 'view2 should show');
		assert.deepStrictEqual(target.elements, [view1, view2, view3]);

		ViewsRegistry.deregisterViews([view1, view2, view3], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, []);
		assert.deepStrictEqual(target.elements, []);
	});

	test('move', () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const view1: IViewDescriptor = { id: 'view1', ctorDescriptor: null!, name: nls.localize2('Test View 1', 'Test View 1') };
		const view2: IViewDescriptor = { id: 'view2', ctorDescriptor: null!, name: nls.localize2('Test View 2', 'Test View 2') };
		const view3: IViewDescriptor = { id: 'view3', ctorDescriptor: null!, name: nls.localize2('Test View 3', 'Test View 3') };

		ViewsRegistry.registerViews([view1, view2, view3], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2, view3], 'model views should be OK');
		assert.deepStrictEqual(target.elements, [view1, view2, view3], 'sql views should be OK');

		testObject.move('view3', 'view1');
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view3, view1, view2], 'view3 should go to the front');
		assert.deepStrictEqual(target.elements, [view3, view1, view2]);

		testObject.move('view1', 'view2');
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view3, view2, view1], 'view1 should go to the end');
		assert.deepStrictEqual(target.elements, [view3, view2, view1]);

		testObject.move('view1', 'view3');
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view3, view2], 'view1 should go to the front');
		assert.deepStrictEqual(target.elements, [view1, view3, view2]);

		testObject.move('view2', 'view3');
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view1, view2, view3], 'view2 should go to the middle');
		assert.deepStrictEqual(target.elements, [view1, view2, view3]);
	});

	test('view states', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storageService.store(`${container.id}.state.hidden`, JSON.stringify([{ id: 'view1', isHidden: true }]), StorageScope.PROFILE, StorageTarget.MACHINE);
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1')
		};

		ViewsRegistry.registerViews([viewDescriptor], container);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should not appear since it was set not visible in view state');
		assert.strictEqual(target.elements.length, 0);
	}));

	test('view states and when contexts', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storageService.store(`${container.id}.state.hidden`, JSON.stringify([{ id: 'view1', isHidden: true }]), StorageScope.PROFILE, StorageTarget.MACHINE);
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true)
		};

		ViewsRegistry.registerViews([viewDescriptor], container);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should not appear since context isnt in');
		assert.strictEqual(target.elements.length, 0);

		const key = contextKeyService.createKey<boolean>('showview1', false);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should still not appear since showview1 isnt true');
		assert.strictEqual(target.elements.length, 0);

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should still not appear since it was set not visible in view state');
		assert.strictEqual(target.elements.length, 0);
	}));

	test('view states and when contexts multiple views', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storageService.store(`${container.id}.state.hidden`, JSON.stringify([{ id: 'view1', isHidden: true }]), StorageScope.PROFILE, StorageTarget.MACHINE);
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const view1: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview', true)
		};
		const view2: IViewDescriptor = {
			id: 'view2',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 2', 'Test View 2'),
		};
		const view3: IViewDescriptor = {
			id: 'view3',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 3', 'Test View 3'),
			when: ContextKeyExpr.equals('showview', true)
		};

		ViewsRegistry.registerViews([view1, view2, view3], container);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2], 'Only view2 should be visible');
		assert.deepStrictEqual(target.elements, [view2]);

		const key = contextKeyService.createKey<boolean>('showview', false);
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2], 'Only view2 should be visible');
		assert.deepStrictEqual(target.elements, [view2]);

		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2, view3], 'view3 should be visible');
		assert.deepStrictEqual(target.elements, [view2, view3]);

		key.set(false);
		await new Promise(c => setTimeout(c, 30));
		assert.deepStrictEqual(testObject.visibleViewDescriptors, [view2], 'Only view2 should be visible');
		assert.deepStrictEqual(target.elements, [view2]);
	}));

	test('remove event is not triggered if view was hidden and removed', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		ViewsRegistry.registerViews([viewDescriptor], container);

		const key = contextKeyService.createKey<boolean>('showview1', true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(testObject.visibleViewDescriptors.length, 1, 'view should appear after context is set');
		assert.strictEqual(target.elements.length, 1);

		testObject.setVisible('view1', false);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0, 'view should disappear after setting visibility to false');
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidRemoveVisibleViewDescriptors(targetEvent));
		key.set(false);
		await new Promise(c => setTimeout(c, 30));
		assert.ok(!targetEvent.called, 'remove event should not be called since it is already hidden');
	}));

	test('add event is not triggered if view was set visible (when visible) and not active', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		const key = contextKeyService.createKey<boolean>('showview1', true);
		key.set(false);
		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(targetEvent));
		testObject.setVisible('view1', true);
		assert.ok(!targetEvent.called, 'add event should not be called since it is already visible');
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);
	}));

	test('remove event is not triggered if view was hidden and not active', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		const key = contextKeyService.createKey<boolean>('showview1', true);
		key.set(false);
		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(targetEvent));
		testObject.setVisible('view1', false);
		assert.ok(!targetEvent.called, 'add event should not be called since it is disabled');
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);
	}));

	test('add event is not triggered if view was set visible (when not visible) and not active', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		const key = contextKeyService.createKey<boolean>('showview1', true);
		key.set(false);
		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		testObject.setVisible('view1', false);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(targetEvent));
		testObject.setVisible('view1', true);
		assert.ok(!targetEvent.called, 'add event should not be called since it is disabled');
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);
	}));

	test('added view descriptors are in ascending order in the event', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));

		ViewsRegistry.registerViews([{
			id: 'view5',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 5', 'Test View 5'),
			canToggleVisibility: true,
			order: 5
		}, {
			id: 'view2',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 2', 'Test View 2'),
			canToggleVisibility: true,
			order: 2
		}], container);

		assert.strictEqual(target.elements.length, 2);
		assert.strictEqual(target.elements[0].id, 'view2');
		assert.strictEqual(target.elements[1].id, 'view5');

		ViewsRegistry.registerViews([{
			id: 'view4',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 4', 'Test View 4'),
			canToggleVisibility: true,
			order: 4
		}, {
			id: 'view3',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 3', 'Test View 3'),
			canToggleVisibility: true,
			order: 3
		}, {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true,
			order: 1
		}], container);

		assert.strictEqual(target.elements.length, 5);
		assert.strictEqual(target.elements[0].id, 'view1');
		assert.strictEqual(target.elements[1].id, 'view2');
		assert.strictEqual(target.elements[2].id, 'view3');
		assert.strictEqual(target.elements[3].id, 'view4');
		assert.strictEqual(target.elements[4].id, 'view5');
	}));

	test('add event is triggered only once when view is set visible while it is set active', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		const key = contextKeyService.createKey<boolean>('showview1', true);
		key.set(false);
		ViewsRegistry.registerViews([viewDescriptor], container);
		testObject.setVisible('view1', false);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(targetEvent));
		disposableStore.add(Event.once(testObject.onDidChangeActiveViewDescriptors)(() => testObject.setVisible('view1', true)));
		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(targetEvent.callCount, 1);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 1);
		assert.strictEqual(target.elements.length, 1);
		assert.strictEqual(target.elements[0].id, 'view1');
	}));

	test('add event is not triggered only when view is set hidden while it is set active', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			when: ContextKeyExpr.equals('showview1', true),
			canToggleVisibility: true
		};

		const key = contextKeyService.createKey<boolean>('showview1', true);
		key.set(false);
		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);

		const targetEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(targetEvent));
		disposableStore.add(Event.once(testObject.onDidChangeActiveViewDescriptors)(() => testObject.setVisible('view1', false)));
		key.set(true);
		await new Promise(c => setTimeout(c, 30));
		assert.strictEqual(targetEvent.callCount, 0);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
		assert.strictEqual(target.elements.length, 0);
	}));

	test('#142087: view descriptor visibility is not reset', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true
		};

		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor.id,
			isHidden: true,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.isVisible(viewDescriptor.id), false);
		assert.strictEqual(testObject.activeViewDescriptors[0].id, viewDescriptor.id);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
	}));

	test('remove event is triggered properly if multiple views are hidden at the same time', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor1: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true
		};
		const viewDescriptor2: IViewDescriptor = {
			id: 'view2',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 2', 'Test View 2'),
			canToggleVisibility: true
		};
		const viewDescriptor3: IViewDescriptor = {
			id: 'view3',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 3', 'Test View 3'),
			canToggleVisibility: true
		};

		ViewsRegistry.registerViews([viewDescriptor1, viewDescriptor2, viewDescriptor3], container);

		const remomveEvent = sinon.spy();
		disposableStore.add(testObject.onDidRemoveVisibleViewDescriptors(remomveEvent));

		const addEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(addEvent));

		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor1.id,
			isHidden: false,
			order: undefined
		}, {
			id: viewDescriptor2.id,
			isHidden: true,
			order: undefined
		}, {
			id: viewDescriptor3.id,
			isHidden: true,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		assert.ok(!addEvent.called, 'add event should not be called');
		assert.ok(remomveEvent.calledOnce, 'remove event should be called');
		assert.deepStrictEqual(remomveEvent.args[0][0], [{
			viewDescriptor: viewDescriptor3,
			index: 2
		}, {
			viewDescriptor: viewDescriptor2,
			index: 1
		}]);
		assert.strictEqual(target.elements.length, 1);
		assert.strictEqual(target.elements[0].id, viewDescriptor1.id);
	}));

	test('add event is triggered properly if multiple views are hidden at the same time', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor1: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true
		};
		const viewDescriptor2: IViewDescriptor = {
			id: 'view2',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 2', 'Test View 2'),
			canToggleVisibility: true
		};
		const viewDescriptor3: IViewDescriptor = {
			id: 'view3',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 3', 'Test View 3'),
			canToggleVisibility: true
		};

		ViewsRegistry.registerViews([viewDescriptor1, viewDescriptor2, viewDescriptor3], container);
		testObject.setVisible(viewDescriptor1.id, false);
		testObject.setVisible(viewDescriptor3.id, false);

		const removeEvent = sinon.spy();
		disposableStore.add(testObject.onDidRemoveVisibleViewDescriptors(removeEvent));

		const addEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(addEvent));

		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor1.id,
			isHidden: false,
			order: undefined
		}, {
			id: viewDescriptor2.id,
			isHidden: false,
			order: undefined
		}, {
			id: viewDescriptor3.id,
			isHidden: false,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		assert.ok(!removeEvent.called, 'remove event should not be called');

		assert.ok(addEvent.calledOnce, 'add event should be called once');
		assert.deepStrictEqual(addEvent.args[0][0], [{
			viewDescriptor: viewDescriptor1,
			index: 0,
			collapsed: false,
			size: undefined
		}, {
			viewDescriptor: viewDescriptor3,
			index: 2,
			collapsed: false,
			size: undefined
		}]);

		assert.strictEqual(target.elements.length, 3);
		assert.strictEqual(target.elements[0].id, viewDescriptor1.id);
		assert.strictEqual(target.elements[1].id, viewDescriptor2.id);
		assert.strictEqual(target.elements[2].id, viewDescriptor3.id);
	}));

	test('add and remove events are triggered properly if multiple views are hidden and added at the same time', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const testObject = viewDescriptorService.getViewContainerModel(container);
		const target = disposableStore.add(new ViewDescriptorSequence(testObject));
		const viewDescriptor1: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true
		};
		const viewDescriptor2: IViewDescriptor = {
			id: 'view2',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 2', 'Test View 2'),
			canToggleVisibility: true
		};
		const viewDescriptor3: IViewDescriptor = {
			id: 'view3',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 3', 'Test View 3'),
			canToggleVisibility: true
		};
		const viewDescriptor4: IViewDescriptor = {
			id: 'view4',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 4', 'Test View 4'),
			canToggleVisibility: true
		};

		ViewsRegistry.registerViews([viewDescriptor1, viewDescriptor2, viewDescriptor3, viewDescriptor4], container);
		testObject.setVisible(viewDescriptor1.id, false);

		const removeEvent = sinon.spy();
		disposableStore.add(testObject.onDidRemoveVisibleViewDescriptors(removeEvent));

		const addEvent = sinon.spy();
		disposableStore.add(testObject.onDidAddVisibleViewDescriptors(addEvent));

		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor1.id,
			isHidden: false,
			order: undefined
		}, {
			id: viewDescriptor2.id,
			isHidden: true,
			order: undefined
		}, {
			id: viewDescriptor3.id,
			isHidden: false,
			order: undefined
		}, {
			id: viewDescriptor4.id,
			isHidden: true,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		assert.ok(removeEvent.calledOnce, 'remove event should be called once');
		assert.deepStrictEqual(removeEvent.args[0][0], [{
			viewDescriptor: viewDescriptor4,
			index: 2
		}, {
			viewDescriptor: viewDescriptor2,
			index: 0
		}]);

		assert.ok(addEvent.calledOnce, 'add event should be called once');
		assert.deepStrictEqual(addEvent.args[0][0], [{
			viewDescriptor: viewDescriptor1,
			index: 0,
			collapsed: false,
			size: undefined
		}]);
		assert.strictEqual(target.elements.length, 2);
		assert.strictEqual(target.elements[0].id, viewDescriptor1.id);
		assert.strictEqual(target.elements[1].id, viewDescriptor3.id);
	}));

	test('newly added view descriptor is hidden if it was toggled hidden in storage before adding', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		// eslint-disable-next-line local/code-no-any-casts
		container = ViewContainerRegistry.registerViewContainer({ id: 'test', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const viewDescriptor: IViewDescriptor = {
			id: 'view1',
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			canToggleVisibility: true
		};
		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor.id,
			isHidden: false,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		const testObject = viewDescriptorService.getViewContainerModel(container);

		storageService.store(getViewsStateStorageId('test.state'), JSON.stringify([{
			id: viewDescriptor.id,
			isHidden: true,
			order: undefined
		}]), StorageScope.PROFILE, StorageTarget.USER);

		ViewsRegistry.registerViews([viewDescriptor], container);

		assert.strictEqual(testObject.isVisible(viewDescriptor.id), false);
		assert.strictEqual(testObject.activeViewDescriptors[0].id, viewDescriptor.id);
		assert.strictEqual(testObject.visibleViewDescriptors.length, 0);
	}));

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/views/test/browser/viewDescriptorService.test.ts]---
Location: vscode-main/src/vs/workbench/services/views/test/browser/viewDescriptorService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import assert from 'assert';
import { IViewsRegistry, IViewDescriptor, IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, ViewContainer, ViewContainerLocationToString } from '../../../../common/views.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ViewDescriptorService } from '../../browser/viewDescriptorService.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { compare } from '../../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const ViewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);
const ViewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const viewContainerIdPrefix = 'testViewContainer';
// eslint-disable-next-line local/code-no-any-casts
const sidebarContainer = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
// eslint-disable-next-line local/code-no-any-casts
const panelContainer = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Panel);

suite('ViewDescriptorService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;

	setup(() => {
		disposables.add(instantiationService = workbenchInstantiationService(undefined, disposables));
		instantiationService.stub(IContextKeyService, disposables.add(instantiationService.createInstance(ContextKeyService)));
	});

	teardown(() => {
		for (const viewContainer of ViewContainersRegistry.all) {
			if (viewContainer.id.startsWith(viewContainerIdPrefix)) {
				ViewsRegistry.deregisterViews(ViewsRegistry.getViews(viewContainer), viewContainer);
			}
		}
	});

	function aViewDescriptorService(): ViewDescriptorService {
		return disposables.add(instantiationService.createInstance(ViewDescriptorService));
	}

	test('Empty Containers', function () {
		const testObject = aViewDescriptorService();
		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		const panelViews = testObject.getViewContainerModel(panelContainer);
		assert.strictEqual(sidebarViews.allViewDescriptors.length, 0, 'The sidebar container should have no views yet.');
		assert.strictEqual(panelViews.allViewDescriptors.length, 0, 'The panel container should have no views yet.');
	});

	test('Register/Deregister', () => {
		const testObject = aViewDescriptorService();
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(2), panelContainer);

		let sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		let panelViews = testObject.getViewContainerModel(panelContainer);

		assert.strictEqual(sidebarViews.activeViewDescriptors.length, 2, 'Sidebar should have 2 views');
		assert.strictEqual(panelViews.activeViewDescriptors.length, 1, 'Panel should have 1 view');

		ViewsRegistry.deregisterViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.deregisterViews(viewDescriptors.slice(2), panelContainer);

		sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		panelViews = testObject.getViewContainerModel(panelContainer);

		assert.strictEqual(sidebarViews.activeViewDescriptors.length, 0, 'Sidebar should have no views');
		assert.strictEqual(panelViews.activeViewDescriptors.length, 0, 'Panel should have no views');
	});

	test('move views to existing containers', async function () {
		const testObject = aViewDescriptorService();
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(2), panelContainer);

		testObject.moveViewsToContainer(viewDescriptors.slice(2), sidebarContainer);
		testObject.moveViewsToContainer(viewDescriptors.slice(0, 2), panelContainer);

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		const panelViews = testObject.getViewContainerModel(panelContainer);

		assert.strictEqual(sidebarViews.activeViewDescriptors.length, 1, 'Sidebar should have 2 views');
		assert.strictEqual(panelViews.activeViewDescriptors.length, 2, 'Panel should have 1 view');

		assert.notStrictEqual(sidebarViews.activeViewDescriptors.indexOf(viewDescriptors[2]), -1, `Sidebar should have ${viewDescriptors[2].name.value}`);
		assert.notStrictEqual(panelViews.activeViewDescriptors.indexOf(viewDescriptors[0]), -1, `Panel should have ${viewDescriptors[0].name.value}`);
		assert.notStrictEqual(panelViews.activeViewDescriptors.indexOf(viewDescriptors[1]), -1, `Panel should have ${viewDescriptors[1].name.value}`);
	});

	test('move views to generated containers', async function () {
		const testObject = aViewDescriptorService();
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(2), panelContainer);

		testObject.moveViewToLocation(viewDescriptors[0], ViewContainerLocation.Panel);
		testObject.moveViewToLocation(viewDescriptors[2], ViewContainerLocation.Sidebar);

		let sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		let panelViews = testObject.getViewContainerModel(panelContainer);

		assert.strictEqual(sidebarViews.activeViewDescriptors.length, 1, 'Sidebar container should have 1 view');
		assert.strictEqual(panelViews.activeViewDescriptors.length, 0, 'Panel container should have no views');

		const generatedPanel = assertReturnsDefined(testObject.getViewContainerByViewId(viewDescriptors[0].id));
		const generatedSidebar = assertReturnsDefined(testObject.getViewContainerByViewId(viewDescriptors[2].id));

		assert.strictEqual(testObject.getViewContainerLocation(generatedPanel), ViewContainerLocation.Panel, 'Generated Panel should be in located in the panel');
		assert.strictEqual(testObject.getViewContainerLocation(generatedSidebar), ViewContainerLocation.Sidebar, 'Generated Sidebar should be in located in the sidebar');

		assert.strictEqual(testObject.getViewContainerLocation(generatedPanel), testObject.getViewLocationById(viewDescriptors[0].id), 'Panel view location and container location should match');
		assert.strictEqual(testObject.getViewContainerLocation(generatedSidebar), testObject.getViewLocationById(viewDescriptors[2].id), 'Sidebar view location and container location should match');

		assert.strictEqual(testObject.getDefaultContainerById(viewDescriptors[2].id), panelContainer, `${viewDescriptors[2].name.value} has wrong default container`);
		assert.strictEqual(testObject.getDefaultContainerById(viewDescriptors[0].id), sidebarContainer, `${viewDescriptors[0].name.value} has wrong default container`);

		testObject.moveViewToLocation(viewDescriptors[0], ViewContainerLocation.Sidebar);
		testObject.moveViewToLocation(viewDescriptors[2], ViewContainerLocation.Panel);

		sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		panelViews = testObject.getViewContainerModel(panelContainer);

		assert.strictEqual(sidebarViews.activeViewDescriptors.length, 1, 'Sidebar should have 2 views');
		assert.strictEqual(panelViews.activeViewDescriptors.length, 0, 'Panel should have 1 view');

		assert.strictEqual(testObject.getViewLocationById(viewDescriptors[0].id), ViewContainerLocation.Sidebar, 'View should be located in the sidebar');
		assert.strictEqual(testObject.getViewLocationById(viewDescriptors[2].id), ViewContainerLocation.Panel, 'View should be located in the panel');
	});

	test('move view events', async function () {
		const testObject = aViewDescriptorService();
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			}
		];

		let expectedSequence = '';
		let actualSequence = '';

		const containerMoveString = (view: IViewDescriptor, from: ViewContainer, to: ViewContainer) => {
			return `Moved ${view.id} from ${from.id} to ${to.id}\n`;
		};

		const locationMoveString = (view: IViewDescriptor, from: ViewContainerLocation, to: ViewContainerLocation) => {
			return `Moved ${view.id} from ${from === ViewContainerLocation.Sidebar ? 'Sidebar' : 'Panel'} to ${to === ViewContainerLocation.Sidebar ? 'Sidebar' : 'Panel'}\n`;
		};
		disposables.add(testObject.onDidChangeContainer(({ views, from, to }) => {
			views.forEach(view => {
				actualSequence += containerMoveString(view, from, to);
			});
		}));

		disposables.add(testObject.onDidChangeLocation(({ views, from, to }) => {
			views.forEach(view => {
				actualSequence += locationMoveString(view, from, to);
			});
		}));

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(2), panelContainer);

		expectedSequence += locationMoveString(viewDescriptors[0], ViewContainerLocation.Sidebar, ViewContainerLocation.Panel);
		testObject.moveViewToLocation(viewDescriptors[0], ViewContainerLocation.Panel);
		expectedSequence += containerMoveString(viewDescriptors[0], sidebarContainer, testObject.getViewContainerByViewId(viewDescriptors[0].id)!);

		expectedSequence += locationMoveString(viewDescriptors[2], ViewContainerLocation.Panel, ViewContainerLocation.Sidebar);
		testObject.moveViewToLocation(viewDescriptors[2], ViewContainerLocation.Sidebar);
		expectedSequence += containerMoveString(viewDescriptors[2], panelContainer, testObject.getViewContainerByViewId(viewDescriptors[2].id)!);

		expectedSequence += locationMoveString(viewDescriptors[0], ViewContainerLocation.Panel, ViewContainerLocation.Sidebar);
		expectedSequence += containerMoveString(viewDescriptors[0], testObject.getViewContainerByViewId(viewDescriptors[0].id)!, sidebarContainer);
		testObject.moveViewsToContainer([viewDescriptors[0]], sidebarContainer);

		expectedSequence += locationMoveString(viewDescriptors[2], ViewContainerLocation.Sidebar, ViewContainerLocation.Panel);
		expectedSequence += containerMoveString(viewDescriptors[2], testObject.getViewContainerByViewId(viewDescriptors[2].id)!, panelContainer);
		testObject.moveViewsToContainer([viewDescriptors[2]], panelContainer);

		expectedSequence += locationMoveString(viewDescriptors[0], ViewContainerLocation.Sidebar, ViewContainerLocation.Panel);
		expectedSequence += containerMoveString(viewDescriptors[0], sidebarContainer, panelContainer);
		testObject.moveViewsToContainer([viewDescriptors[0]], panelContainer);

		expectedSequence += locationMoveString(viewDescriptors[2], ViewContainerLocation.Panel, ViewContainerLocation.Sidebar);
		expectedSequence += containerMoveString(viewDescriptors[2], panelContainer, sidebarContainer);
		testObject.moveViewsToContainer([viewDescriptors[2]], sidebarContainer);

		expectedSequence += locationMoveString(viewDescriptors[1], ViewContainerLocation.Sidebar, ViewContainerLocation.Panel);
		expectedSequence += locationMoveString(viewDescriptors[2], ViewContainerLocation.Sidebar, ViewContainerLocation.Panel);
		expectedSequence += containerMoveString(viewDescriptors[1], sidebarContainer, panelContainer);
		expectedSequence += containerMoveString(viewDescriptors[2], sidebarContainer, panelContainer);
		testObject.moveViewsToContainer([viewDescriptors[1], viewDescriptors[2]], panelContainer);

		assert.strictEqual(actualSequence, expectedSequence, 'Event sequence not matching expected sequence');
	});

	test('reset', async function () {
		const testObject = aViewDescriptorService();
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true,
				order: 1
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true,
				order: 2
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true,
				order: 3
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 2), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(2), panelContainer);

		testObject.moveViewToLocation(viewDescriptors[0], ViewContainerLocation.Panel);
		testObject.moveViewsToContainer([viewDescriptors[1]], panelContainer);
		testObject.moveViewToLocation(viewDescriptors[2], ViewContainerLocation.Sidebar);

		const generatedPanel = assertReturnsDefined(testObject.getViewContainerByViewId(viewDescriptors[0].id));
		const generatedSidebar = assertReturnsDefined(testObject.getViewContainerByViewId(viewDescriptors[2].id));

		testObject.reset();

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view1', 'view2']);
		const panelViews = testObject.getViewContainerModel(panelContainer);
		assert.deepStrictEqual(panelViews.allViewDescriptors.map(v => v.id), ['view3']);

		const actual = JSON.parse(instantiationService.get(IStorageService).get('views.customizations', StorageScope.PROFILE)!);
		assert.deepStrictEqual(actual, { viewContainerLocations: {}, viewLocations: {}, viewContainerBadgeEnablementStates: {} });

		assert.deepStrictEqual(testObject.getViewContainerById(generatedPanel.id), null);
		assert.deepStrictEqual(testObject.getViewContainerById(generatedSidebar.id), null);
	});

	test('initialize with custom locations', async function () {
		const storageService = instantiationService.get(IStorageService);
		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer1 = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const generateViewContainer1 = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.Sidebar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainer1]: ViewContainerLocation.Sidebar,
				[viewContainer1.id]: ViewContainerLocation.AuxiliaryBar
			},
			viewLocations: {
				'view1': generateViewContainer1
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			},
			{
				id: 'view4',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 4', 'Test View 4'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 3), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(3), viewContainer1);

		const testObject = aViewDescriptorService();

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view2', 'view3']);

		const generatedViewContainerViews = testObject.getViewContainerModel(testObject.getViewContainerById(generateViewContainer1)!);
		assert.deepStrictEqual(generatedViewContainerViews.allViewDescriptors.map(v => v.id), ['view1']);

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer1);
		assert.deepStrictEqual(testObject.getViewContainerLocation(viewContainer1), ViewContainerLocation.AuxiliaryBar);
		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view4']);
	});

	test('storage change', async function () {
		const testObject = aViewDescriptorService();

		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer1 = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const generateViewContainer1 = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.Sidebar)}.${generateUuid()}`;

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			},
			{
				id: 'view4',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 4', 'Test View 4'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 3), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(3), viewContainer1);

		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainer1]: ViewContainerLocation.Sidebar,
				[viewContainer1.id]: ViewContainerLocation.AuxiliaryBar
			},
			viewLocations: {
				'view1': generateViewContainer1
			}
		};
		instantiationService.get(IStorageService).store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view2', 'view3']);

		const generatedViewContainerViews = testObject.getViewContainerModel(testObject.getViewContainerById(generateViewContainer1)!);
		assert.deepStrictEqual(generatedViewContainerViews.allViewDescriptors.map(v => v.id), ['view1']);

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer1);
		assert.deepStrictEqual(testObject.getViewContainerLocation(viewContainer1), ViewContainerLocation.AuxiliaryBar);
		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view4']);
	});

	test('orphan views', async function () {
		const storageService = instantiationService.get(IStorageService);
		const viewsCustomizations = {
			viewContainerLocations: {},
			viewLocations: {
				'view1': `${viewContainerIdPrefix}-${generateUuid()}`
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true,
				order: 1
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true,
				order: 2
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true,
				order: 3
			}
		];

		ViewsRegistry.registerViews(viewDescriptors, sidebarContainer);

		const testObject = aViewDescriptorService();

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view2', 'view3']);

		testObject.whenExtensionsRegistered();
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view1', 'view2', 'view3']);
	});

	test('orphan view containers', async function () {
		const storageService = instantiationService.get(IStorageService);
		const generatedViewContainerId = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.Sidebar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generatedViewContainerId]: ViewContainerLocation.Sidebar
			},
			viewLocations: {}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true,
				order: 1
			}
		];

		ViewsRegistry.registerViews(viewDescriptors, sidebarContainer);

		const testObject = aViewDescriptorService();
		testObject.whenExtensionsRegistered();

		assert.deepStrictEqual(testObject.getViewContainerById(generatedViewContainerId), null);
		assert.deepStrictEqual(testObject.isViewContainerRemovedPermanently(generatedViewContainerId), true);

		const actual = JSON.parse(storageService.get('views.customizations', StorageScope.PROFILE)!);
		assert.deepStrictEqual(actual, { viewContainerLocations: {}, viewLocations: {}, viewContainerBadgeEnablementStates: {} });
	});

	test('custom locations take precedence when default view container of views change', async function () {
		const storageService = instantiationService.get(IStorageService);
		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer1 = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const generateViewContainer1 = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.Sidebar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainer1]: ViewContainerLocation.Sidebar,
				[viewContainer1.id]: ViewContainerLocation.AuxiliaryBar
			},
			viewLocations: {
				'view1': generateViewContainer1
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			},
			{
				id: 'view3',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 3', 'Test View 3'),
				canMoveView: true
			},
			{
				id: 'view4',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 4', 'Test View 4'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors.slice(0, 3), sidebarContainer);
		ViewsRegistry.registerViews(viewDescriptors.slice(3), viewContainer1);

		const testObject = aViewDescriptorService();
		ViewsRegistry.moveViews([viewDescriptors[0], viewDescriptors[1]], panelContainer);

		const sidebarViews = testObject.getViewContainerModel(sidebarContainer);
		assert.deepStrictEqual(sidebarViews.allViewDescriptors.map(v => v.id), ['view3']);

		const panelViews = testObject.getViewContainerModel(panelContainer);
		assert.deepStrictEqual(panelViews.allViewDescriptors.map(v => v.id), ['view2']);

		const generatedViewContainerViews = testObject.getViewContainerModel(testObject.getViewContainerById(generateViewContainer1)!);
		assert.deepStrictEqual(generatedViewContainerViews.allViewDescriptors.map(v => v.id), ['view1']);

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer1);
		assert.deepStrictEqual(testObject.getViewContainerLocation(viewContainer1), ViewContainerLocation.AuxiliaryBar);
		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view4']);
	});

	test('view containers with not existing views are not removed from customizations', async function () {
		const storageService = instantiationService.get(IStorageService);
		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer1 = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const generateViewContainer1 = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.Sidebar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainer1]: ViewContainerLocation.Sidebar,
				[viewContainer1.id]: ViewContainerLocation.AuxiliaryBar
			},
			viewLocations: {
				'view5': generateViewContainer1
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			}
		];

		ViewsRegistry.registerViews(viewDescriptors, viewContainer1);

		const testObject = aViewDescriptorService();
		testObject.whenExtensionsRegistered();

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer1);
		assert.deepStrictEqual(testObject.getViewContainerLocation(viewContainer1), ViewContainerLocation.AuxiliaryBar);
		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view1']);

		const actual = JSON.parse(storageService.get('views.customizations', StorageScope.PROFILE)!);
		assert.deepStrictEqual(actual, viewsCustomizations);
	});

	test('storage change also updates locations even if views do not exists and views are registered later', async function () {
		const storageService = instantiationService.get(IStorageService);
		const testObject = aViewDescriptorService();

		const generateViewContainerId = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainerId]: ViewContainerLocation.AuxiliaryBar,
			},
			viewLocations: {
				'view1': generateViewContainerId
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			}
		];
		ViewsRegistry.registerViews(viewDescriptors, viewContainer);

		testObject.whenExtensionsRegistered();

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer);
		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view2']);

		const generateViewContainer = testObject.getViewContainerById(generateViewContainerId)!;
		assert.deepStrictEqual(testObject.getViewContainerLocation(generateViewContainer), ViewContainerLocation.AuxiliaryBar);
		const generatedViewContainerModel = testObject.getViewContainerModel(generateViewContainer);
		assert.deepStrictEqual(generatedViewContainerModel.allViewDescriptors.map(v => v.id), ['view1']);
	});

	test('storage change move views and retain visibility state', async function () {
		const storageService = instantiationService.get(IStorageService);
		const testObject = aViewDescriptorService();

		// eslint-disable-next-line local/code-no-any-casts
		const viewContainer = ViewContainersRegistry.registerViewContainer({ id: `${viewContainerIdPrefix}-${generateUuid()}`, title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const viewDescriptors: IViewDescriptor[] = [
			{
				id: 'view1',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 1', 'Test View 1'),
				canMoveView: true,
				canToggleVisibility: true
			},
			{
				id: 'view2',
				ctorDescriptor: null!,
				name: nls.localize2('Test View 2', 'Test View 2'),
				canMoveView: true
			}
		];
		ViewsRegistry.registerViews(viewDescriptors, viewContainer);

		testObject.whenExtensionsRegistered();

		const viewContainer1Views = testObject.getViewContainerModel(viewContainer);
		viewContainer1Views.setVisible('view1', false);

		const generateViewContainerId = `workbench.views.service.${ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar)}.${generateUuid()}`;
		const viewsCustomizations = {
			viewContainerLocations: {
				[generateViewContainerId]: ViewContainerLocation.AuxiliaryBar,
			},
			viewLocations: {
				'view1': generateViewContainerId
			}
		};
		storageService.store('views.customizations', JSON.stringify(viewsCustomizations), StorageScope.PROFILE, StorageTarget.USER);

		const generateViewContainer = testObject.getViewContainerById(generateViewContainerId)!;
		const generatedViewContainerModel = testObject.getViewContainerModel(generateViewContainer);

		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id), ['view2']);
		assert.deepStrictEqual(testObject.getViewContainerLocation(generateViewContainer), ViewContainerLocation.AuxiliaryBar);
		assert.deepStrictEqual(generatedViewContainerModel.allViewDescriptors.map(v => v.id), ['view1']);

		storageService.store('views.customizations', JSON.stringify({}), StorageScope.PROFILE, StorageTarget.USER);

		assert.deepStrictEqual(viewContainer1Views.allViewDescriptors.map(v => v.id).sort((a, b) => compare(a, b)), ['view1', 'view2']);
		assert.deepStrictEqual(viewContainer1Views.visibleViewDescriptors.map(v => v.id), ['view2']);
		assert.deepStrictEqual(generatedViewContainerModel.allViewDescriptors.map(v => v.id), []);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/browser/workingCopyBackupService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/browser/workingCopyBackupService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { WorkingCopyBackupService } from '../common/workingCopyBackupService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkingCopyBackupService } from '../common/workingCopyBackup.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { BrowserWorkingCopyBackupTracker } from './workingCopyBackupTracker.js';

export class BrowserWorkingCopyBackupService extends WorkingCopyBackupService {

	constructor(
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService
	) {
		super(joinPath(environmentService.userRoamingDataHome, 'Backups', contextService.getWorkspace().id), fileService, logService);
	}
}

// Register Service
registerSingleton(IWorkingCopyBackupService, BrowserWorkingCopyBackupService, InstantiationType.Eager);

// Register Backup Tracker
registerWorkbenchContribution2(BrowserWorkingCopyBackupTracker.ID, BrowserWorkingCopyBackupTracker, WorkbenchPhase.BlockStartup);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/browser/workingCopyBackupTracker.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/browser/workingCopyBackupTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkingCopyBackupService } from '../common/workingCopyBackup.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyService } from '../common/workingCopyService.js';
import { ILifecycleService, ShutdownReason } from '../../lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { WorkingCopyBackupTracker } from '../common/workingCopyBackupTracker.js';
import { IWorkingCopyEditorService } from '../common/workingCopyEditorService.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IEditorGroupsService } from '../../editor/common/editorGroupsService.js';

export class BrowserWorkingCopyBackupTracker extends WorkingCopyBackupTracker implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.browserWorkingCopyBackupTracker';

	constructor(
		@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@ILogService logService: ILogService,
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService
	) {
		super(workingCopyBackupService, workingCopyService, logService, lifecycleService, filesConfigurationService, workingCopyEditorService, editorService, editorGroupService);
	}

	protected onFinalBeforeShutdown(reason: ShutdownReason): boolean {

		// Web: we cannot perform long running in the shutdown phase
		// As such we need to check sync if there are any modified working
		// copies that have not been backed up yet and then prevent the
		// shutdown if that is the case.

		const modifiedWorkingCopies = this.workingCopyService.modifiedWorkingCopies;
		if (!modifiedWorkingCopies.length) {
			return false; // nothing modified: no veto
		}

		if (!this.filesConfigurationService.isHotExitEnabled) {
			return true; // modified without backup: veto
		}

		for (const modifiedWorkingCopy of modifiedWorkingCopies) {
			if (!this.workingCopyBackupService.hasBackupSync(modifiedWorkingCopy, this.getContentVersion(modifiedWorkingCopy))) {
				this.logService.warn('Unload veto: pending backups');

				return true; // modified without backup: veto
			}
		}

		return false; // modified and backed up: no veto
	}
}
```

--------------------------------------------------------------------------------

````

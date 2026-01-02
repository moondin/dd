---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 524
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 524 of 552)

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

---[FILE: src/vs/workbench/services/notification/common/notificationService.ts]---
Location: vscode-main/src/vs/workbench/services/notification/common/notificationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { INotificationService, INotification, INotificationHandle, Severity, NotificationMessage, INotificationActions, IPromptChoice, IPromptOptions, IStatusMessageOptions, NoOpNotification, NeverShowAgainScope, NotificationsFilter, INeverShowAgainOptions, INotificationSource, INotificationSourceFilter, isNotificationSource, IStatusHandle } from '../../../../platform/notification/common/notification.js';
import { NotificationsModel, ChoiceAction, NotificationChangeType } from '../../../common/notifications.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IAction, Action } from '../../../../base/common/actions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export class NotificationService extends Disposable implements INotificationService {

	declare readonly _serviceBrand: undefined;

	readonly model = this._register(new NotificationsModel());

	constructor(
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.mapSourceToFilter = (() => {
			const map = new Map<string, INotificationSourceFilter>();

			for (const sourceFilter of this.storageService.getObject<INotificationSourceFilter[]>(NotificationService.PER_SOURCE_FILTER_SETTINGS_KEY, StorageScope.APPLICATION, [])) {
				map.set(sourceFilter.id, sourceFilter);
			}

			return map;
		})();

		this.globalFilterEnabled = this.storageService.getBoolean(NotificationService.GLOBAL_FILTER_SETTINGS_KEY, StorageScope.APPLICATION, false);

		this.updateFilters();
		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.model.onDidChangeNotification(e => {
			switch (e.kind) {
				case NotificationChangeType.ADD: {
					const source = typeof e.item.sourceId === 'string' && typeof e.item.source === 'string' ? { id: e.item.sourceId, label: e.item.source } : e.item.source;

					// Make sure to track sources for notifications by registering
					// them with our do not disturb system which is backed by storage

					if (isNotificationSource(source)) {
						if (!this.mapSourceToFilter.has(source.id)) {
							this.setFilter({ ...source, filter: NotificationsFilter.OFF });
						} else {
							this.updateSourceFilter(source);
						}
					}

					break;
				}
			}
		}));
	}

	//#region Filters

	private static readonly GLOBAL_FILTER_SETTINGS_KEY = 'notifications.doNotDisturbMode';
	private static readonly PER_SOURCE_FILTER_SETTINGS_KEY = 'notifications.perSourceDoNotDisturbMode';

	private readonly _onDidChangeFilter = this._register(new Emitter<void>());
	readonly onDidChangeFilter = this._onDidChangeFilter.event;

	private globalFilterEnabled: boolean;

	private readonly mapSourceToFilter: Map<string /** source id */, INotificationSourceFilter>;

	setFilter(filter: NotificationsFilter | INotificationSourceFilter): void {
		if (typeof filter === 'number') {
			if (this.globalFilterEnabled === (filter === NotificationsFilter.ERROR)) {
				return; // no change
			}

			// Store into model and persist
			this.globalFilterEnabled = filter === NotificationsFilter.ERROR;
			this.storageService.store(NotificationService.GLOBAL_FILTER_SETTINGS_KEY, this.globalFilterEnabled, StorageScope.APPLICATION, StorageTarget.MACHINE);

			// Update model
			this.updateFilters();

			// Events
			this._onDidChangeFilter.fire();
		} else {
			const existing = this.mapSourceToFilter.get(filter.id);
			if (existing?.filter === filter.filter && existing.label === filter.label) {
				return; // no change
			}

			// Store into model and persist
			this.mapSourceToFilter.set(filter.id, { id: filter.id, label: filter.label, filter: filter.filter });
			this.saveSourceFilters();

			// Update model
			this.updateFilters();
		}
	}

	getFilter(source?: INotificationSource): NotificationsFilter {
		if (source) {
			return this.mapSourceToFilter.get(source.id)?.filter ?? NotificationsFilter.OFF;
		}

		return this.globalFilterEnabled ? NotificationsFilter.ERROR : NotificationsFilter.OFF;
	}

	private updateSourceFilter(source: INotificationSource): void {
		const existing = this.mapSourceToFilter.get(source.id);
		if (!existing) {
			return; // nothing to do
		}

		// Store into model and persist
		if (existing.label !== source.label) {
			this.mapSourceToFilter.set(source.id, { id: source.id, label: source.label, filter: existing.filter });
			this.saveSourceFilters();
		}
	}

	private saveSourceFilters(): void {
		this.storageService.store(NotificationService.PER_SOURCE_FILTER_SETTINGS_KEY, JSON.stringify([...this.mapSourceToFilter.values()]), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	getFilters(): INotificationSourceFilter[] {
		return [...this.mapSourceToFilter.values()];
	}

	private updateFilters(): void {
		this.model.setFilter({
			global: this.globalFilterEnabled ? NotificationsFilter.ERROR : NotificationsFilter.OFF,
			sources: new Map([...this.mapSourceToFilter.values()].map(source => [source.id, source.filter]))
		});
	}

	removeFilter(sourceId: string): void {
		if (this.mapSourceToFilter.delete(sourceId)) {

			// Persist
			this.saveSourceFilters();

			// Update model
			this.updateFilters();
		}
	}

	//#endregion

	info(message: NotificationMessage | NotificationMessage[]): void {
		if (Array.isArray(message)) {
			for (const messageEntry of message) {
				this.info(messageEntry);
			}

			return;
		}

		this.model.addNotification({ severity: Severity.Info, message });
	}

	warn(message: NotificationMessage | NotificationMessage[]): void {
		if (Array.isArray(message)) {
			for (const messageEntry of message) {
				this.warn(messageEntry);
			}

			return;
		}

		this.model.addNotification({ severity: Severity.Warning, message });
	}

	error(message: NotificationMessage | NotificationMessage[]): void {
		if (Array.isArray(message)) {
			for (const messageEntry of message) {
				this.error(messageEntry);
			}

			return;
		}

		this.model.addNotification({ severity: Severity.Error, message });
	}

	notify(notification: INotification): INotificationHandle {
		const toDispose = new DisposableStore();

		// Handle neverShowAgain option accordingly

		if (notification.neverShowAgain) {
			const scope = this.toStorageScope(notification.neverShowAgain);
			const id = notification.neverShowAgain.id;

			// If the user already picked to not show the notification
			// again, we return with a no-op notification here
			if (this.storageService.getBoolean(id, scope)) {
				return new NoOpNotification();
			}

			const neverShowAgainAction = toDispose.add(new Action(
				'workbench.notification.neverShowAgain',
				localize('neverShowAgain', "Don't Show Again"),
				undefined, true, async () => {

					// Close notification
					handle.close();

					// Remember choice
					this.storageService.store(id, true, scope, StorageTarget.USER);
				}));

			// Insert as primary or secondary action
			const actions = {
				primary: notification.actions?.primary || [],
				secondary: notification.actions?.secondary || []
			};
			if (!notification.neverShowAgain.isSecondary) {
				actions.primary = [neverShowAgainAction, ...actions.primary]; // action comes first
			} else {
				actions.secondary = [...actions.secondary, neverShowAgainAction]; // actions comes last
			}

			notification.actions = actions;
		}

		// Show notification
		const handle = this.model.addNotification(notification);

		// Cleanup when notification gets disposed
		Event.once(handle.onDidClose)(() => toDispose.dispose());

		return handle;
	}

	private toStorageScope(options: INeverShowAgainOptions): StorageScope {
		switch (options.scope) {
			case NeverShowAgainScope.APPLICATION:
				return StorageScope.APPLICATION;
			case NeverShowAgainScope.PROFILE:
				return StorageScope.PROFILE;
			case NeverShowAgainScope.WORKSPACE:
				return StorageScope.WORKSPACE;
			default:
				return StorageScope.APPLICATION;
		}
	}

	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {

		// Handle neverShowAgain option accordingly
		if (options?.neverShowAgain) {
			const scope = this.toStorageScope(options.neverShowAgain);
			const id = options.neverShowAgain.id;

			// If the user already picked to not show the notification
			// again, we return with a no-op notification here
			if (this.storageService.getBoolean(id, scope)) {
				return new NoOpNotification();
			}

			const neverShowAgainChoice = {
				label: localize('neverShowAgain', "Don't Show Again"),
				run: () => this.storageService.store(id, true, scope, StorageTarget.USER),
				isSecondary: options.neverShowAgain.isSecondary
			};

			// Insert as primary or secondary action
			if (!options.neverShowAgain.isSecondary) {
				choices = [neverShowAgainChoice, ...choices]; // action comes first
			} else {
				choices = [...choices, neverShowAgainChoice]; // actions comes last
			}
		}

		let choiceClicked = false;
		const toDispose = new DisposableStore();


		// Convert choices into primary/secondary actions
		const primaryActions: IAction[] = [];
		const secondaryActions: IAction[] = [];
		choices.forEach((choice, index) => {
			const action = new ChoiceAction(`workbench.dialog.choice.${index}`, choice);
			if (!choice.isSecondary) {
				primaryActions.push(action);
			} else {
				secondaryActions.push(action);
			}

			// React to action being clicked
			toDispose.add(action.onDidRun(() => {
				choiceClicked = true;

				// Close notification unless we are told to keep open
				if (!choice.keepOpen) {
					handle.close();
				}
			}));

			toDispose.add(action);
		});

		// Show notification with actions
		const actions: INotificationActions = { primary: primaryActions, secondary: secondaryActions };
		const handle = this.notify({ severity, message, actions, sticky: options?.sticky, priority: options?.priority });

		Event.once(handle.onDidClose)(() => {

			// Cleanup when notification gets disposed
			toDispose.dispose();

			// Indicate cancellation to the outside if no action was executed
			if (options && typeof options.onCancel === 'function' && !choiceClicked) {
				options.onCancel();
			}
		});

		return handle;
	}

	status(message: NotificationMessage, options?: IStatusMessageOptions): IStatusHandle {
		return this.model.showStatusMessage(message, options);
	}
}

registerSingleton(INotificationService, NotificationService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/outline/browser/outline.ts]---
Location: vscode-main/src/vs/workbench/services/outline/browser/outline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IDataSource, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchDataTreeOptions } from '../../../../platform/list/browser/listService.js';
import { IEditorPane } from '../../../common/editor.js';

export const IOutlineService = createDecorator<IOutlineService>('IOutlineService');

export const enum OutlineTarget {
	OutlinePane = 1,
	Breadcrumbs = 2,
	QuickPick = 4
}

export interface IOutlineService {
	_serviceBrand: undefined;
	readonly onDidChange: Event<void>;
	canCreateOutline(editor: IEditorPane): boolean;
	createOutline(editor: IEditorPane, target: OutlineTarget, token: CancellationToken): Promise<IOutline<any> | undefined>;
	registerOutlineCreator(creator: IOutlineCreator<any, any>): IDisposable;
}

export interface IOutlineCreator<P extends IEditorPane, E> {
	matches(candidate: IEditorPane): candidate is P;
	createOutline(editor: P, target: OutlineTarget, token: CancellationToken): Promise<IOutline<E> | undefined>;
}

export interface IBreadcrumbsOutlineElement<E> {
	readonly element: E;
	readonly label: string;
}

export interface IBreadcrumbsDataSource<E> {
	getBreadcrumbElements(): readonly IBreadcrumbsOutlineElement<E>[];
}

export interface IOutlineComparator<E> {
	compareByPosition(a: E, b: E): number;
	compareByType(a: E, b: E): number;
	compareByName(a: E, b: E): number;
}

export interface IQuickPickOutlineElement<E> {
	readonly element: E;
	readonly label: string;
	readonly iconClasses?: string[];
	readonly ariaLabel?: string;
	readonly description?: string;
}

export interface IQuickPickDataSource<E> {
	getQuickPickElements(): IQuickPickOutlineElement<E>[];
}

export interface IOutlineListConfig<E> {
	readonly breadcrumbsDataSource: IBreadcrumbsDataSource<E>;
	readonly treeDataSource: IDataSource<IOutline<E>, E>;
	readonly delegate: IListVirtualDelegate<E>;
	readonly renderers: ITreeRenderer<E, FuzzyScore, any>[];
	readonly comparator: IOutlineComparator<E>;
	readonly options: IWorkbenchDataTreeOptions<E, FuzzyScore>;
	readonly quickPickDataSource: IQuickPickDataSource<E>;
}

export interface OutlineChangeEvent {
	affectOnlyActiveElement?: true;
}

export interface IOutline<E> {

	readonly uri: URI | undefined;

	readonly config: IOutlineListConfig<E>;
	readonly outlineKind: string;

	readonly isEmpty: boolean;
	readonly activeElement: E | undefined;
	readonly onDidChange: Event<OutlineChangeEvent>;

	reveal(entry: E, options: IEditorOptions, sideBySide: boolean, select: boolean): Promise<void> | void;
	preview(entry: E): IDisposable;
	captureViewState(): IDisposable;
	dispose(): void;
}


export const enum OutlineConfigKeys {
	'icons' = 'outline.icons',
	'collapseItems' = 'outline.collapseItems',
	'problemsEnabled' = 'outline.problems.enabled',
	'problemsColors' = 'outline.problems.colors',
	'problemsBadges' = 'outline.problems.badges'
}

export const enum OutlineConfigCollapseItemsValues {
	Collapsed = 'alwaysCollapse',
	Expanded = 'alwaysExpand'
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/outline/browser/outlineService.ts]---
Location: vscode-main/src/vs/workbench/services/outline/browser/outlineService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IEditorPane } from '../../../common/editor.js';
import { IOutline, IOutlineCreator, IOutlineService, OutlineTarget } from './outline.js';
import { Event, Emitter } from '../../../../base/common/event.js';

class OutlineService implements IOutlineService {

	declare _serviceBrand: undefined;

	private readonly _factories = new LinkedList<IOutlineCreator<any, any>>();

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	canCreateOutline(pane: IEditorPane): boolean {
		for (const factory of this._factories) {
			if (factory.matches(pane)) {
				return true;
			}
		}
		return false;
	}

	async createOutline(pane: IEditorPane, target: OutlineTarget, token: CancellationToken): Promise<IOutline<any> | undefined> {
		for (const factory of this._factories) {
			if (factory.matches(pane)) {
				return await factory.createOutline(pane, target, token);
			}
		}
		return undefined;
	}

	registerOutlineCreator(creator: IOutlineCreator<any, any>): IDisposable {
		const rm = this._factories.push(creator);
		this._onDidChange.fire();
		return toDisposable(() => {
			rm();
			this._onDidChange.fire();
		});
	}
}


registerSingleton(IOutlineService, OutlineService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/output/common/delayedLogChannel.ts]---
Location: vscode-main/src/vs/workbench/services/output/common/delayedLogChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger, ILoggerService, log, LogLevel } from '../../../../platform/log/common/log.js';
import { URI } from '../../../../base/common/uri.js';

export class DelayedLogChannel {

	private readonly logger: ILogger;

	constructor(
		id: string, name: string, private readonly file: URI,
		@ILoggerService private readonly loggerService: ILoggerService,
	) {
		this.logger = loggerService.createLogger(file, { name, id, hidden: true });
	}

	log(level: LogLevel, message: string): void {
		this.loggerService.setVisibility(this.file, true);
		log(this.logger, level, message);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/output/common/output.ts]---
Location: vscode-main/src/vs/workbench/services/output/common/output.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { LogLevel } from '../../../../platform/log/common/log.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

/**
 * Mime type used by the output editor.
 */
export const OUTPUT_MIME = 'text/x-code-output';

/**
 * Id used by the output editor.
 */
export const OUTPUT_MODE_ID = 'Log';

/**
 * Mime type used by the log output editor.
 */
export const LOG_MIME = 'text/x-code-log-output';

/**
 * Id used by the log output editor.
 */
export const LOG_MODE_ID = 'log';

/**
 * Output view id
 */
export const OUTPUT_VIEW_ID = 'workbench.panel.output';

export const CONTEXT_IN_OUTPUT = new RawContextKey<boolean>('inOutput', false);
export const CONTEXT_ACTIVE_FILE_OUTPUT = new RawContextKey<boolean>('activeLogOutput', false);
export const CONTEXT_ACTIVE_LOG_FILE_OUTPUT = new RawContextKey<boolean>('activeLogOutput.isLog', false);
export const CONTEXT_ACTIVE_OUTPUT_LEVEL_SETTABLE = new RawContextKey<boolean>('activeLogOutput.levelSettable', false);
export const CONTEXT_ACTIVE_OUTPUT_LEVEL = new RawContextKey<string>('activeLogOutput.level', '');
export const CONTEXT_ACTIVE_OUTPUT_LEVEL_IS_DEFAULT = new RawContextKey<boolean>('activeLogOutput.levelIsDefault', false);
export const CONTEXT_OUTPUT_SCROLL_LOCK = new RawContextKey<boolean>(`outputView.scrollLock`, false);
export const ACTIVE_OUTPUT_CHANNEL_CONTEXT = new RawContextKey<string>('activeOutputChannel', '');
export const SHOW_TRACE_FILTER_CONTEXT = new RawContextKey<boolean>('output.filter.trace', true);
export const SHOW_DEBUG_FILTER_CONTEXT = new RawContextKey<boolean>('output.filter.debug', true);
export const SHOW_INFO_FILTER_CONTEXT = new RawContextKey<boolean>('output.filter.info', true);
export const SHOW_WARNING_FILTER_CONTEXT = new RawContextKey<boolean>('output.filter.warning', true);
export const SHOW_ERROR_FILTER_CONTEXT = new RawContextKey<boolean>('output.filter.error', true);
export const OUTPUT_FILTER_FOCUS_CONTEXT = new RawContextKey<boolean>('outputFilterFocus', false);
export const HIDE_CATEGORY_FILTER_CONTEXT = new RawContextKey<string>('output.filter.categories', '');

export interface IOutputViewFilters {
	readonly onDidChange: Event<void>;
	text: string;
	readonly includePatterns: string[];
	readonly excludePatterns: string[];
	trace: boolean;
	debug: boolean;
	info: boolean;
	warning: boolean;
	error: boolean;
	categories: string;
	toggleCategory(category: string): void;
	hasCategory(category: string): boolean;
}

export const IOutputService = createDecorator<IOutputService>('outputService');

/**
 * The output service to manage output from the various processes running.
 */
export interface IOutputService {
	readonly _serviceBrand: undefined;

	/**
	 *  Output view filters.
	 */
	readonly filters: IOutputViewFilters;

	/**
	 * Given the channel id returns the output channel instance.
	 * Channel should be first registered via OutputChannelRegistry.
	 */
	getChannel(id: string): IOutputChannel | undefined;

	/**
	 * Given the channel id returns the registered output channel descriptor.
	 */
	getChannelDescriptor(id: string): IOutputChannelDescriptor | undefined;

	/**
	 * Returns an array of all known output channels descriptors.
	 */
	getChannelDescriptors(): IOutputChannelDescriptor[];

	/**
	 * Returns the currently active channel.
	 * Only one channel can be active at a given moment.
	 */
	getActiveChannel(): IOutputChannel | undefined;

	/**
	 * Show the channel with the passed id.
	 */
	showChannel(id: string, preserveFocus?: boolean): Promise<void>;

	/**
	 * Allows to register on active output channel change.
	 */
	readonly onActiveOutputChannel: Event<string>;

	/**
	 * Register a compound log channel with the given channels.
	 */
	registerCompoundLogChannel(channels: IOutputChannelDescriptor[]): string;

	/**
	 * Save the logs to a file.
	 */
	saveOutputAs(outputPath?: URI, ...channels: IOutputChannelDescriptor[]): Promise<void>;

	/**
	 * Checks if the log level can be set for the given channel.
	 * @param channel
	 */
	canSetLogLevel(channel: IOutputChannelDescriptor): boolean;

	/**
	 * Returns the log level for the given channel.
	 * @param channel
	 */
	getLogLevel(channel: IOutputChannelDescriptor): LogLevel | undefined;

	/**
	 * Sets the log level for the given channel.
	 * @param channel
	 * @param logLevel
	 */
	setLogLevel(channel: IOutputChannelDescriptor, logLevel: LogLevel): void;
}

export enum OutputChannelUpdateMode {
	Append = 1,
	Replace,
	Clear
}

export interface ILogEntry {
	readonly range: Range;
	readonly timestamp: number;
	readonly timestampRange: Range;
	readonly logLevel: LogLevel;
	readonly logLevelRange: Range;
	readonly category: string | undefined;
}

export interface IOutputChannel {

	/**
	 * Identifier of the output channel.
	 */
	readonly id: string;

	/**
	 * Label of the output channel to be displayed to the user.
	 */
	readonly label: string;

	/**
	 * URI of the output channel.
	 */
	readonly uri: URI;

	/**
	 * Log entries of the output channel.
	 */
	getLogEntries(): readonly ILogEntry[];

	/**
	 * Appends output to the channel.
	 */
	append(output: string): void;

	/**
	 * Clears all received output for this channel.
	 */
	clear(): void;

	/**
	 * Replaces the content of the channel with given output
	 */
	replace(output: string): void;

	/**
	 * Update the channel.
	 */
	update(mode: OutputChannelUpdateMode.Append): void;
	update(mode: OutputChannelUpdateMode, till: number): void;

	/**
	 * Disposes the output channel.
	 */
	dispose(): void;
}

export const Extensions = {
	OutputChannels: 'workbench.contributions.outputChannels'
};

export interface IOutputChannelDescriptor {
	id: string;
	label: string;
	log: boolean;
	languageId?: string;
	source?: IOutputContentSource | ReadonlyArray<IOutputContentSource>;
	extensionId?: string;
	user?: boolean;
}

export interface ISingleSourceOutputChannelDescriptor extends IOutputChannelDescriptor {
	source: IOutputContentSource;
}

export interface IMultiSourceOutputChannelDescriptor extends IOutputChannelDescriptor {
	source: ReadonlyArray<IOutputContentSource>;
}

export function isSingleSourceOutputChannelDescriptor(descriptor: IOutputChannelDescriptor): descriptor is ISingleSourceOutputChannelDescriptor {
	return !!descriptor.source && !Array.isArray(descriptor.source);
}

export function isMultiSourceOutputChannelDescriptor(descriptor: IOutputChannelDescriptor): descriptor is IMultiSourceOutputChannelDescriptor {
	return Array.isArray(descriptor.source);
}

export interface IOutputContentSource {
	readonly name?: string;
	readonly resource: URI;
}

export interface IOutputChannelRegistry {

	readonly onDidRegisterChannel: Event<string>;
	readonly onDidRemoveChannel: Event<IOutputChannelDescriptor>;
	readonly onDidUpdateChannelSources: Event<IMultiSourceOutputChannelDescriptor>;

	/**
	 * Make an output channel known to the output world.
	 */
	registerChannel(descriptor: IOutputChannelDescriptor): void;

	/**
	 * Update the files for the given output channel.
	 */
	updateChannelSources(id: string, sources: IOutputContentSource[]): void;

	/**
	 * Returns the list of channels known to the output world.
	 */
	getChannels(): IOutputChannelDescriptor[];

	/**
	 * Returns the channel with the passed id.
	 */
	getChannel(id: string): IOutputChannelDescriptor | undefined;

	/**
	 * Remove the output channel with the passed id.
	 */
	removeChannel(id: string): void;
}

class OutputChannelRegistry extends Disposable implements IOutputChannelRegistry {
	private channels = new Map<string, IOutputChannelDescriptor>();

	private readonly _onDidRegisterChannel = this._register(new Emitter<string>());
	readonly onDidRegisterChannel = this._onDidRegisterChannel.event;

	private readonly _onDidRemoveChannel = this._register(new Emitter<IOutputChannelDescriptor>());
	readonly onDidRemoveChannel = this._onDidRemoveChannel.event;

	private readonly _onDidUpdateChannelFiles = this._register(new Emitter<IMultiSourceOutputChannelDescriptor>());
	readonly onDidUpdateChannelSources = this._onDidUpdateChannelFiles.event;

	public registerChannel(descriptor: IOutputChannelDescriptor): void {
		if (!this.channels.has(descriptor.id)) {
			this.channels.set(descriptor.id, descriptor);
			this._onDidRegisterChannel.fire(descriptor.id);
		}
	}

	public getChannels(): IOutputChannelDescriptor[] {
		const result: IOutputChannelDescriptor[] = [];
		this.channels.forEach(value => result.push(value));
		return result;
	}

	public getChannel(id: string): IOutputChannelDescriptor | undefined {
		return this.channels.get(id);
	}

	public updateChannelSources(id: string, sources: IOutputContentSource[]): void {
		const channel = this.channels.get(id);
		if (channel && isMultiSourceOutputChannelDescriptor(channel)) {
			channel.source = sources;
			this._onDidUpdateChannelFiles.fire(channel);
		}
	}

	public removeChannel(id: string): void {
		const channel = this.channels.get(id);
		if (channel) {
			this.channels.delete(id);
			this._onDidRemoveChannel.fire(channel);
		}
	}
}

Registry.add(Extensions.OutputChannels, new OutputChannelRegistry());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/panecomposite/browser/panecomposite.ts]---
Location: vscode-main/src/vs/workbench/services/panecomposite/browser/panecomposite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { PaneCompositeDescriptor } from '../../../browser/panecomposite.js';
import { IProgressIndicator } from '../../../../platform/progress/common/progress.js';
import { IPaneComposite } from '../../../common/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';

export const IPaneCompositePartService = createDecorator<IPaneCompositePartService>('paneCompositePartService');

export interface IPaneCompositePartService {

	readonly _serviceBrand: undefined;

	readonly onDidPaneCompositeOpen: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;
	readonly onDidPaneCompositeClose: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;

	/**
	 * Opens a viewlet with the given identifier and pass keyboard focus to it if specified.
	 */
	openPaneComposite(id: string | undefined, viewContainerLocation: ViewContainerLocation, focus?: boolean): Promise<IPaneComposite | undefined>;

	/**
	 * Returns the current active viewlet if any.
	 */
	getActivePaneComposite(viewContainerLocation: ViewContainerLocation): IPaneComposite | undefined;

	/**
	 * Returns the viewlet by id.
	 */
	getPaneComposite(id: string, viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor | undefined;

	/**
	 * Returns all enabled viewlets
	 */
	getPaneComposites(viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor[];

	/**
	 * Returns id of pinned view containers following the visual order.
	 */
	getPinnedPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[];

	/**
	 * Returns id of visible view containers following the visual order.
	 */
	getVisiblePaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[];

	/**
	 * Returns id of all view containers following visual order.
	 */
	getPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[];

	/**
	 * Returns the progress indicator for the side bar.
	 */
	getProgressIndicator(id: string, viewContainerLocation: ViewContainerLocation): IProgressIndicator | undefined;

	/**
	 * Hide the active viewlet.
	 */
	hideActivePaneComposite(viewContainerLocation: ViewContainerLocation): void;

	/**
	 * Return the last active viewlet id.
	 */
	getLastActivePaneCompositeId(viewContainerLocation: ViewContainerLocation): string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/path/browser/pathService.ts]---
Location: vscode-main/src/vs/workbench/services/path/browser/pathService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IPathService, AbstractPathService } from '../common/pathService.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { dirname } from '../../../../base/common/resources.js';

export class BrowserPathService extends AbstractPathService {

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService contextService: IWorkspaceContextService
	) {
		super(
			guessLocalUserHome(environmentService, contextService),
			remoteAgentService,
			environmentService,
			contextService
		);
	}
}

function guessLocalUserHome(environmentService: IWorkbenchEnvironmentService, contextService: IWorkspaceContextService): URI {

	// In web we do not really have the concept of a "local" user home
	// but we still require it in many places as a fallback. As such,
	// we have to come up with a synthetic location derived from the
	// environment.

	const workspace = contextService.getWorkspace();

	const firstFolder = workspace.folders.at(0);
	if (firstFolder) {
		return firstFolder.uri;
	}

	if (workspace.configuration) {
		return dirname(workspace.configuration);
	}

	// This is not ideal because with a user home location of `/`, all paths
	// will potentially appear with `~/...`, but at this point we really do
	// not have any other good alternative.

	return URI.from({
		scheme: AbstractPathService.findDefaultUriScheme(environmentService, contextService),
		authority: environmentService.remoteAuthority,
		path: '/'
	});
}

registerSingleton(IPathService, BrowserPathService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/path/common/pathService.ts]---
Location: vscode-main/src/vs/workbench/services/path/common/pathService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isValidBasename } from '../../../../base/common/extpath.js';
import { Schemas } from '../../../../base/common/network.js';
import { IPath, win32, posix } from '../../../../base/common/path.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { getVirtualWorkspaceScheme } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';

export const IPathService = createDecorator<IPathService>('pathService');

/**
 * Provides access to path related properties that will match the
 * environment. If the environment is connected to a remote, the
 * path properties will match that of the remotes operating system.
 */
export interface IPathService {

	readonly _serviceBrand: undefined;

	/**
	 * The correct path library to use for the target environment. If
	 * the environment is connected to a remote, this will be the
	 * path library of the remote file system. Otherwise it will be
	 * the local file system's path library depending on the OS.
	 */
	readonly path: Promise<IPath>;

	/**
	 * Determines the best default URI scheme for the current workspace.
	 * It uses information about whether we're running remote, in browser,
	 * or native combined with information about the current workspace to
	 * find the best default scheme.
	 */
	readonly defaultUriScheme: string;

	/**
	 * Converts the given path to a file URI to use for the target
	 * environment. If the environment is connected to a remote, it
	 * will use the path separators according to the remote file
	 * system. Otherwise it will use the local file system's path
	 * separators.
	 */
	fileURI(path: string): Promise<URI>;

	/**
	 * Resolves the user-home directory for the target environment.
	 * If the envrionment is connected to a remote, this will be the
	 * remote's user home directory, otherwise the local one unless
	 * `preferLocal` is set to `true`.
	 */
	userHome(options: { preferLocal: true }): URI;
	userHome(options?: { preferLocal: boolean }): Promise<URI>;

	/**
	 * Figures out if the provided resource has a valid file name
	 * for the operating system the file is saved to.
	 *
	 * Note: this currently only supports `file` and `vscode-file`
	 * protocols where we know the limits of the file systems behind
	 * these OS. Other remotes are not supported and this method
	 * will always return `true` for them.
	 */
	hasValidBasename(resource: URI, basename?: string): Promise<boolean>;
	hasValidBasename(resource: URI, os: OperatingSystem, basename?: string): boolean;

	/**
	 * @deprecated use `userHome` instead.
	 */
	readonly resolvedUserHome: URI | undefined;
}

export abstract class AbstractPathService implements IPathService {

	declare readonly _serviceBrand: undefined;

	private resolveOS: Promise<OperatingSystem>;

	private resolveUserHome: Promise<URI>;
	private maybeUnresolvedUserHome: URI | undefined;

	constructor(
		private localUserHome: URI,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private contextService: IWorkspaceContextService
	) {

		// OS
		this.resolveOS = (async () => {
			const env = await this.remoteAgentService.getEnvironment();

			return env?.os || OS;
		})();

		// User Home
		this.resolveUserHome = (async () => {
			const env = await this.remoteAgentService.getEnvironment();
			const userHome = this.maybeUnresolvedUserHome = env?.userHome ?? localUserHome;

			return userHome;
		})();
	}

	hasValidBasename(resource: URI, basename?: string): Promise<boolean>;
	hasValidBasename(resource: URI, os: OperatingSystem, basename?: string): boolean;
	hasValidBasename(resource: URI, arg2?: string | OperatingSystem, basename?: string): boolean | Promise<boolean> {

		// async version
		if (typeof arg2 === 'string' || typeof arg2 === 'undefined') {
			return this.resolveOS.then(os => this.doHasValidBasename(resource, os, arg2));
		}

		// sync version
		return this.doHasValidBasename(resource, arg2, basename);
	}

	private doHasValidBasename(resource: URI, os: OperatingSystem, name?: string): boolean {

		// Our `isValidBasename` method only works with our
		// standard schemes for files on disk, either locally
		// or remote.
		if (resource.scheme === Schemas.file || resource.scheme === Schemas.vscodeRemote) {
			return isValidBasename(name ?? basename(resource), os === OperatingSystem.Windows);
		}

		return true;
	}

	get defaultUriScheme(): string {
		return AbstractPathService.findDefaultUriScheme(this.environmentService, this.contextService);
	}

	static findDefaultUriScheme(environmentService: IWorkbenchEnvironmentService, contextService: IWorkspaceContextService): string {
		if (environmentService.remoteAuthority) {
			return Schemas.vscodeRemote;
		}

		const virtualWorkspace = getVirtualWorkspaceScheme(contextService.getWorkspace());
		if (virtualWorkspace) {
			return virtualWorkspace;
		}

		const firstFolder = contextService.getWorkspace().folders[0];
		if (firstFolder) {
			return firstFolder.uri.scheme;
		}

		const configuration = contextService.getWorkspace().configuration;
		if (configuration) {
			return configuration.scheme;
		}

		return Schemas.file;
	}

	userHome(options?: { preferLocal: boolean }): Promise<URI>;
	userHome(options: { preferLocal: true }): URI;
	userHome(options?: { preferLocal: boolean }): Promise<URI> | URI {
		return options?.preferLocal ? this.localUserHome : this.resolveUserHome;
	}

	get resolvedUserHome(): URI | undefined {
		return this.maybeUnresolvedUserHome;
	}

	get path(): Promise<IPath> {
		return this.resolveOS.then(os => {
			return os === OperatingSystem.Windows ?
				win32 :
				posix;
		});
	}

	async fileURI(_path: string): Promise<URI> {
		let authority = '';

		// normalize to fwd-slashes on windows,
		// on other systems bwd-slashes are valid
		// filename character, eg /f\oo/ba\r.txt
		const os = await this.resolveOS;
		if (os === OperatingSystem.Windows) {
			_path = _path.replace(/\\/g, '/');
		}

		// check for authority as used in UNC shares
		// or use the path as given
		if (_path[0] === '/' && _path[1] === '/') {
			const idx = _path.indexOf('/', 2);
			if (idx === -1) {
				authority = _path.substring(2);
				_path = '/';
			} else {
				authority = _path.substring(2, idx);
				_path = _path.substring(idx) || '/';
			}
		}

		return URI.from({
			scheme: Schemas.file,
			authority,
			path: _path,
			query: '',
			fragment: ''
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/path/electron-browser/pathService.ts]---
Location: vscode-main/src/vs/workbench/services/path/electron-browser/pathService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IPathService, AbstractPathService } from '../common/pathService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';

export class NativePathService extends AbstractPathService {

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IWorkspaceContextService contextService: IWorkspaceContextService
	) {
		super(environmentService.userHome, remoteAgentService, environmentService, contextService);
	}
}

registerSingleton(IPathService, NativePathService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/policies/common/accountPolicyService.ts]---
Location: vscode-main/src/vs/workbench/services/policies/common/accountPolicyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { IDefaultAccount } from '../../../../base/common/defaultAccount.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractPolicyService, IPolicyService, PolicyDefinition } from '../../../../platform/policy/common/policy.js';
import { IDefaultAccountService } from '../../../../platform/defaultAccount/common/defaultAccount.js';


export class AccountPolicyService extends AbstractPolicyService implements IPolicyService {

	private account: IDefaultAccount | null = null;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IDefaultAccountService private readonly defaultAccountService: IDefaultAccountService
	) {
		super();

		this.defaultAccountService.getDefaultAccount()
			.then(account => {
				this.account = account;
				this._updatePolicyDefinitions(this.policyDefinitions);
				this._register(this.defaultAccountService.onDidChangeDefaultAccount(account => {
					this.account = account;
					this._updatePolicyDefinitions(this.policyDefinitions);
				}));
			});
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		this.logService.trace(`AccountPolicyService#_updatePolicyDefinitions: Got ${Object.keys(policyDefinitions).length} policy definitions`);
		const updated: string[] = [];

		for (const key in policyDefinitions) {
			const policy = policyDefinitions[key];
			const policyValue = this.account && policy.value ? policy.value(this.account) : undefined;
			if (policyValue !== undefined) {
				if (this.policies.get(key) !== policyValue) {
					this.policies.set(key, policyValue);
					updated.push(key);
				}
			} else {
				if (this.policies.delete(key)) {
					updated.push(key);
				}
			}
		}

		if (updated.length) {
			this._onDidChange.fire(updated);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/policies/common/multiplexPolicyService.ts]---
Location: vscode-main/src/vs/workbench/services/policies/common/multiplexPolicyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Event } from '../../../../base/common/event.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractPolicyService, IPolicyService, PolicyDefinition, PolicyValue } from '../../../../platform/policy/common/policy.js';

export class MultiplexPolicyService extends AbstractPolicyService implements IPolicyService {

	constructor(
		private readonly policyServices: ReadonlyArray<IPolicyService>,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		this.updatePolicies();
		this._register(Event.any(...this.policyServices.map(service => service.onDidChange))(names => {
			this.updatePolicies();
			this._onDidChange.fire(names);
		}));
	}

	override async updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<IStringDictionary<PolicyValue>> {
		await this._updatePolicyDefinitions(policyDefinitions);
		return Iterable.reduce(this.policies.entries(), (r, [name, value]) => ({ ...r, [name]: value }), {});
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		await Promise.all(this.policyServices.map(service => service.updatePolicyDefinitions(policyDefinitions)));
		this.updatePolicies();
	}

	private updatePolicies(): void {
		this.policies.clear();
		const updated: string[] = [];
		for (const service of this.policyServices) {
			const definitions = service.policyDefinitions;
			for (const name in definitions) {
				const value = service.getPolicyValue(name);
				this.policyDefinitions[name] = definitions[name];
				if (value !== undefined) {
					updated.push(name);
					this.policies.set(name, value);
				}
			}
		}

		// Check that no results have overlapping keys
		const changed = new Set<string>();
		for (const key of updated) {
			if (changed.has(key)) {
				this.logService.warn(`MultiplexPolicyService#_updatePolicyDefinitions - Found overlapping keys in policy services: ${key}`);
			}
			changed.add(key);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/policies/test/common/accountPolicyService.test.ts]---
Location: vscode-main/src/vs/workbench/services/policies/test/common/accountPolicyService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IDefaultAccountService } from '../../../../../platform/defaultAccount/common/defaultAccount.js';
import { DefaultAccountService } from '../../../accounts/common/defaultAccount.js';
import { AccountPolicyService } from '../../common/accountPolicyService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationNode, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { DefaultConfiguration, PolicyConfiguration } from '../../../../../platform/configuration/common/configurations.js';
import { IDefaultAccount } from '../../../../../base/common/defaultAccount.js';
import { PolicyCategory } from '../../../../../base/common/policy.js';

const BASE_DEFAULT_ACCOUNT: IDefaultAccount = {
	enterprise: false,
	sessionId: 'abc123',
};

suite('AccountPolicyService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let policyService: AccountPolicyService;
	let defaultAccountService: IDefaultAccountService;
	let policyConfiguration: PolicyConfiguration;
	const logService = new NullLogService();

	const policyConfigurationNode: IConfigurationNode = {
		'id': 'policyConfiguration',
		'order': 1,
		'title': 'a',
		'type': 'object',
		'properties': {
			'setting.A': {
				'type': 'string',
				'default': 'defaultValueA',
				policy: {
					name: 'PolicySettingA',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } }
				}
			},
			'setting.B': {
				'type': 'string',
				'default': 'defaultValueB',
				policy: {
					name: 'PolicySettingB',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? 'policyValueB' : undefined,
				}
			},
			'setting.C': {
				'type': 'array',
				'default': ['defaultValueC1', 'defaultValueC2'],
				policy: {
					name: 'PolicySettingC',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? JSON.stringify(['policyValueC1', 'policyValueC2']) : undefined,
				}
			},
			'setting.D': {
				'type': 'boolean',
				'default': true,
				policy: {
					name: 'PolicySettingD',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? false : undefined,
				}
			},
			'setting.E': {
				'type': 'boolean',
				'default': true,
			}
		}
	};


	suiteSetup(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(policyConfigurationNode));
	suiteTeardown(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).deregisterConfigurations([policyConfigurationNode]));

	setup(async () => {
		const defaultConfiguration = disposables.add(new DefaultConfiguration(new NullLogService()));
		await defaultConfiguration.initialize();

		defaultAccountService = disposables.add(new DefaultAccountService());
		policyService = disposables.add(new AccountPolicyService(logService, defaultAccountService));
		policyConfiguration = disposables.add(new PolicyConfiguration(defaultConfiguration, policyService, new NullLogService()));

	});

	async function assertDefaultBehavior(defaultAccount: IDefaultAccount) {
		defaultAccountService.setDefaultAccount(defaultAccount);

		await policyConfiguration.initialize();

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			// No policy is set
			assert.strictEqual(A, undefined);
			assert.strictEqual(B, undefined);
			assert.strictEqual(C, undefined);
			assert.strictEqual(D, undefined);
		}

		{
			const B = policyConfiguration.configurationModel.getValue('setting.B');
			const C = policyConfiguration.configurationModel.getValue('setting.C');
			const D = policyConfiguration.configurationModel.getValue('setting.D');

			assert.strictEqual(B, undefined);
			assert.deepStrictEqual(C, undefined);
			assert.strictEqual(D, undefined);
		}
	}


	test('should initialize with default account', async () => {
		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT };
		await assertDefaultBehavior(defaultAccount);
	});

	test('should initialize with default account and preview features enabled', async () => {
		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT, chat_preview_features_enabled: true };
		await assertDefaultBehavior(defaultAccount);
	});

	test('should initialize with default account and preview features disabled', async () => {
		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT, chat_preview_features_enabled: false };
		defaultAccountService.setDefaultAccount(defaultAccount);

		await policyConfiguration.initialize();
		const actualConfigurationModel = policyConfiguration.configurationModel;

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			assert.strictEqual(A, undefined); // Not tagged with chat preview tags
			assert.strictEqual(B, 'policyValueB');
			assert.strictEqual(C, JSON.stringify(['policyValueC1', 'policyValueC2']));
			assert.strictEqual(D, false);
		}

		{
			const B = actualConfigurationModel.getValue('setting.B');
			const C = actualConfigurationModel.getValue('setting.C');
			const D = actualConfigurationModel.getValue('setting.D');

			assert.strictEqual(B, 'policyValueB');
			assert.deepStrictEqual(C, ['policyValueC1', 'policyValueC2']);
			assert.strictEqual(D, false);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/policies/test/common/multiplexPolicyService.test.ts]---
Location: vscode-main/src/vs/workbench/services/policies/test/common/multiplexPolicyService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IDefaultAccountService } from '../../../../../platform/defaultAccount/common/defaultAccount.js';
import { DefaultAccountService } from '../../../accounts/common/defaultAccount.js';
import { AccountPolicyService } from '../../common/accountPolicyService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationNode, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { DefaultConfiguration, PolicyConfiguration } from '../../../../../platform/configuration/common/configurations.js';
import { MultiplexPolicyService } from '../../common/multiplexPolicyService.js';
import { FilePolicyService } from '../../../../../platform/policy/common/filePolicyService.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { IDefaultAccount } from '../../../../../base/common/defaultAccount.js';
import { PolicyCategory } from '../../../../../base/common/policy.js';

const BASE_DEFAULT_ACCOUNT: IDefaultAccount = {
	enterprise: false,
	sessionId: 'abc123',
};

suite('MultiplexPolicyService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let policyService: MultiplexPolicyService;
	let fileService: IFileService;
	let defaultAccountService: IDefaultAccountService;
	let policyConfiguration: PolicyConfiguration;
	const logService = new NullLogService();

	const policyFile = URI.file('policyFile').with({ scheme: 'vscode-tests' });
	const policyConfigurationNode: IConfigurationNode = {
		'id': 'policyConfiguration',
		'order': 1,
		'title': 'a',
		'type': 'object',
		'properties': {
			'setting.A': {
				'type': 'string',
				'default': 'defaultValueA',
				policy: {
					name: 'PolicySettingA',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } }
				}
			},
			'setting.B': {
				'type': 'string',
				'default': 'defaultValueB',
				policy: {
					name: 'PolicySettingB',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? 'policyValueB' : undefined,
				}
			},
			'setting.C': {
				'type': 'array',
				'default': ['defaultValueC1', 'defaultValueC2'],
				policy: {
					name: 'PolicySettingC',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? JSON.stringify(['policyValueC1', 'policyValueC2']) : undefined,
				}
			},
			'setting.D': {
				'type': 'boolean',
				'default': true,
				policy: {
					name: 'PolicySettingD',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' } },
					value: account => account.chat_preview_features_enabled === false ? false : undefined,
				}
			},
			'setting.E': {
				'type': 'boolean',
				'default': true,
			}
		}
	};


	suiteSetup(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(policyConfigurationNode));
	suiteTeardown(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).deregisterConfigurations([policyConfigurationNode]));

	setup(async () => {
		const defaultConfiguration = disposables.add(new DefaultConfiguration(new NullLogService()));
		await defaultConfiguration.initialize();

		fileService = disposables.add(new FileService(new NullLogService()));
		const diskFileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(policyFile.scheme, diskFileSystemProvider));

		defaultAccountService = disposables.add(new DefaultAccountService());
		policyService = disposables.add(new MultiplexPolicyService([
			disposables.add(new FilePolicyService(policyFile, fileService, new NullLogService())),
			disposables.add(new AccountPolicyService(logService, defaultAccountService)),
		], logService));
		policyConfiguration = disposables.add(new PolicyConfiguration(defaultConfiguration, policyService, new NullLogService()));
	});

	async function clear() {
		// Reset
		defaultAccountService.setDefaultAccount({ ...BASE_DEFAULT_ACCOUNT });
		await fileService.writeFile(policyFile,
			VSBuffer.fromString(
				JSON.stringify({})
			)
		);
	}

	test('no policy', async () => {
		await clear();

		await policyConfiguration.initialize();

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			// No policy is set
			assert.strictEqual(A, undefined);
			assert.strictEqual(B, undefined);
			assert.strictEqual(C, undefined);
			assert.strictEqual(D, undefined);
		}

		{
			const A = policyConfiguration.configurationModel.getValue('setting.A');
			const B = policyConfiguration.configurationModel.getValue('setting.B');
			const C = policyConfiguration.configurationModel.getValue('setting.C');
			const D = policyConfiguration.configurationModel.getValue('setting.D');
			const E = policyConfiguration.configurationModel.getValue('setting.E');

			assert.strictEqual(A, undefined);
			assert.strictEqual(B, undefined);
			assert.deepStrictEqual(C, undefined);
			assert.strictEqual(D, undefined);
			assert.strictEqual(E, undefined);
		}
	});

	test('policy from file only', async () => {
		await clear();

		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT };
		defaultAccountService.setDefaultAccount(defaultAccount);

		await fileService.writeFile(policyFile,
			VSBuffer.fromString(
				JSON.stringify({ 'PolicySettingA': 'policyValueA' })
			)
		);

		await policyConfiguration.initialize();

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			assert.strictEqual(A, 'policyValueA');
			assert.strictEqual(B, undefined);
			assert.strictEqual(C, undefined);
			assert.strictEqual(D, undefined);
		}

		{
			const A = policyConfiguration.configurationModel.getValue('setting.A');
			const B = policyConfiguration.configurationModel.getValue('setting.B');
			const C = policyConfiguration.configurationModel.getValue('setting.C');
			const D = policyConfiguration.configurationModel.getValue('setting.D');
			const E = policyConfiguration.configurationModel.getValue('setting.E');

			assert.strictEqual(A, 'policyValueA');
			assert.strictEqual(B, undefined);
			assert.deepStrictEqual(C, undefined);
			assert.strictEqual(D, undefined);
			assert.strictEqual(E, undefined);
		}
	});

	test('policy from default account only', async () => {
		await clear();

		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT, chat_preview_features_enabled: false };
		defaultAccountService.setDefaultAccount(defaultAccount);

		await fileService.writeFile(policyFile,
			VSBuffer.fromString(
				JSON.stringify({})
			)
		);

		await policyConfiguration.initialize();
		const actualConfigurationModel = policyConfiguration.configurationModel;

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			assert.strictEqual(A, undefined); // Not tagged with preview tags
			assert.strictEqual(B, 'policyValueB');
			assert.strictEqual(C, JSON.stringify(['policyValueC1', 'policyValueC2']));
			assert.strictEqual(D, false);
		}

		{
			const A = policyConfiguration.configurationModel.getValue('setting.A');
			const B = actualConfigurationModel.getValue('setting.B');
			const C = actualConfigurationModel.getValue('setting.C');
			const D = actualConfigurationModel.getValue('setting.D');

			assert.strictEqual(A, undefined);
			assert.strictEqual(B, 'policyValueB');
			assert.deepStrictEqual(C, ['policyValueC1', 'policyValueC2']);
			assert.strictEqual(D, false);
		}
	});

	test('policy from file and default account', async () => {
		await clear();

		const defaultAccount = { ...BASE_DEFAULT_ACCOUNT, chat_preview_features_enabled: false };
		defaultAccountService.setDefaultAccount(defaultAccount);

		await fileService.writeFile(policyFile,
			VSBuffer.fromString(
				JSON.stringify({ 'PolicySettingA': 'policyValueA' })
			)
		);

		await policyConfiguration.initialize();
		const actualConfigurationModel = policyConfiguration.configurationModel;

		{
			const A = policyService.getPolicyValue('PolicySettingA');
			const B = policyService.getPolicyValue('PolicySettingB');
			const C = policyService.getPolicyValue('PolicySettingC');
			const D = policyService.getPolicyValue('PolicySettingD');

			assert.strictEqual(A, 'policyValueA');
			assert.strictEqual(B, 'policyValueB');
			assert.strictEqual(C, JSON.stringify(['policyValueC1', 'policyValueC2']));
			assert.strictEqual(D, false);
		}

		{
			const A = actualConfigurationModel.getValue('setting.A');
			const B = actualConfigurationModel.getValue('setting.B');
			const C = actualConfigurationModel.getValue('setting.C');
			const D = actualConfigurationModel.getValue('setting.D');

			assert.strictEqual(A, 'policyValueA');
			assert.strictEqual(B, 'policyValueB');
			assert.deepStrictEqual(C, ['policyValueC1', 'policyValueC2']);
			assert.strictEqual(D, false);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/browser/keybindingsEditorInput.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/browser/keybindingsEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { OS } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import * as nls from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { KeybindingsEditorModel } from './keybindingsEditorModel.js';

export interface IKeybindingsEditorSearchOptions {
	searchValue: string;
	recordKeybindings: boolean;
	sortByPrecedence: boolean;
}

const KeybindingsEditorIcon = registerIcon('keybindings-editor-label-icon', Codicon.keyboard, nls.localize('keybindingsEditorLabelIcon', 'Icon of the keybindings editor label.'));

export class KeybindingsEditorInput extends EditorInput {

	static readonly ID: string = 'workbench.input.keybindings';
	readonly keybindingsModel: KeybindingsEditorModel;

	searchOptions: IKeybindingsEditorSearchOptions | null = null;

	readonly resource = undefined;

	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		super();

		this.keybindingsModel = instantiationService.createInstance(KeybindingsEditorModel, OS);
	}

	override get typeId(): string {
		return KeybindingsEditorInput.ID;
	}

	override getName(): string {
		return nls.localize('keybindingsInputName', "Keyboard Shortcuts");
	}

	override getIcon(): ThemeIcon {
		return KeybindingsEditorIcon;
	}

	override async resolve(): Promise<KeybindingsEditorModel> {
		return this.keybindingsModel;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return otherInput instanceof KeybindingsEditorInput;
	}

	override dispose(): void {
		this.keybindingsModel.dispose();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { distinct, coalesce } from '../../../../base/common/arrays.js';
import * as strings from '../../../../base/common/strings.js';
import { OperatingSystem, Language } from '../../../../base/common/platform.js';
import { IMatch, IFilter, or, matchesCamelCase, matchesWords, matchesBaseContiguousSubString, matchesContiguousSubString } from '../../../../base/common/filters.js';
import { ResolvedKeybinding, ResolvedChord } from '../../../../base/common/keybindings.js';
import { AriaLabelProvider, UserSettingsLabelProvider, UILabelProvider, ModifierLabels as ModLabels } from '../../../../base/common/keybindingLabels.js';
import { MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybindingItem } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { getAllUnboundCommands } from '../../keybinding/browser/unboundCommands.js';
import { IKeybindingItemEntry, KeybindingMatches, KeybindingMatch, IKeybindingItem } from '../common/preferences.js';
import { ICommandAction, ILocalizedString } from '../../../../platform/action/common/action.js';
import { isEmptyObject, isString } from '../../../../base/common/types.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

export const KEYBINDING_ENTRY_TEMPLATE_ID = 'keybinding.entry.template';

const SOURCE_SYSTEM = localize('default', "System");
const SOURCE_EXTENSION = localize('extension', "Extension");
const SOURCE_USER = localize('user', "User");

interface ModifierLabels {
	ui: ModLabels;
	aria: ModLabels;
	user: ModLabels;
}

export function createKeybindingCommandQuery(commandId: string, when?: string): string {
	const whenPart = when ? ` +when:${when}` : '';
	return `@command:${commandId}${whenPart}`;
}

const wordFilter = or(matchesBaseContiguousSubString, matchesWords);
const COMMAND_REGEX = /@command:\s*([^\+]+)/i;
const WHEN_REGEX = /\+when:\s*(.+)/i;
const SOURCE_REGEX = /@source:\s*(user|default|system|extension)/i;
const EXTENSION_REGEX = /@ext:\s*((".+")|([^\s]+))/i;
const KEYBINDING_REGEX = /@keybinding:\s*((\".+\")|(\S+))/i;

export class KeybindingsEditorModel extends EditorModel {

	private _keybindingItems: IKeybindingItem[];
	private _keybindingItemsSortedByPrecedence: IKeybindingItem[];
	private modifierLabels: ModifierLabels;

	constructor(
		os: OperatingSystem,
		@IKeybindingService private readonly keybindingsService: IKeybindingService,
		@IExtensionService private readonly extensionService: IExtensionService,
	) {
		super();
		this._keybindingItems = [];
		this._keybindingItemsSortedByPrecedence = [];
		this.modifierLabels = {
			ui: UILabelProvider.modifierLabels[os],
			aria: AriaLabelProvider.modifierLabels[os],
			user: UserSettingsLabelProvider.modifierLabels[os]
		};
	}

	fetch(searchValue: string, sortByPrecedence: boolean = false): IKeybindingItemEntry[] {
		let keybindingItems = sortByPrecedence ? this._keybindingItemsSortedByPrecedence : this._keybindingItems;

		// @command:COMMAND_ID
		const commandIdMatches = COMMAND_REGEX.exec(searchValue);
		if (commandIdMatches && commandIdMatches[1]) {
			const command = commandIdMatches[1].trim();
			let filteredKeybindingItems = keybindingItems.filter(k => k.command === command);

			// +when:WHEN_EXPRESSION
			if (filteredKeybindingItems.length) {
				const whenMatches = WHEN_REGEX.exec(searchValue);
				if (whenMatches && whenMatches[1]) {
					const whenValue = whenMatches[1].trim();
					filteredKeybindingItems = this.filterByWhen(filteredKeybindingItems, command, whenValue);
				}
			}

			return filteredKeybindingItems.map((keybindingItem): IKeybindingItemEntry => ({ id: KeybindingsEditorModel.getId(keybindingItem), keybindingItem, templateId: KEYBINDING_ENTRY_TEMPLATE_ID }));
		}

		// @source:SOURCE
		if (SOURCE_REGEX.test(searchValue)) {
			keybindingItems = this.filterBySource(keybindingItems, searchValue);
			searchValue = searchValue.replace(SOURCE_REGEX, '');
		} else {
			// @ext:EXTENSION_ID
			const extensionMatches = EXTENSION_REGEX.exec(searchValue);
			if (extensionMatches && (extensionMatches[2] || extensionMatches[3])) {
				const extensionId = extensionMatches[2] ? extensionMatches[2].substring(1, extensionMatches[2].length - 1) : extensionMatches[3];
				keybindingItems = this.filterByExtension(keybindingItems, extensionId);
				searchValue = searchValue.replace(EXTENSION_REGEX, '');
			} else {
				// @keybinding:KEYBINDING
				const keybindingMatches = KEYBINDING_REGEX.exec(searchValue);
				if (keybindingMatches && (keybindingMatches[2] || keybindingMatches[3])) {
					searchValue = keybindingMatches[2] || `"${keybindingMatches[3]}"`;
				}
			}
		}

		searchValue = searchValue.trim();
		if (!searchValue) {
			return keybindingItems.map((keybindingItem): IKeybindingItemEntry => ({ id: KeybindingsEditorModel.getId(keybindingItem), keybindingItem, templateId: KEYBINDING_ENTRY_TEMPLATE_ID }));
		}

		return this.filterByText(keybindingItems, searchValue);
	}

	private filterBySource(keybindingItems: IKeybindingItem[], searchValue: string): IKeybindingItem[] {
		if (/@source:\s*default/i.test(searchValue) || /@source:\s*system/i.test(searchValue)) {
			return keybindingItems.filter(k => k.source === SOURCE_SYSTEM);
		}
		if (/@source:\s*user/i.test(searchValue)) {
			return keybindingItems.filter(k => k.source === SOURCE_USER);
		}
		if (/@source:\s*extension/i.test(searchValue)) {
			return keybindingItems.filter(k => !isString(k.source) || k.source === SOURCE_EXTENSION);
		}
		return keybindingItems;
	}

	private filterByExtension(keybindingItems: IKeybindingItem[], extension: string): IKeybindingItem[] {
		extension = extension.toLowerCase().trim();
		return keybindingItems.filter(k => !isString(k.source) && (ExtensionIdentifier.equals(k.source.identifier, extension) || k.source.displayName?.toLowerCase() === extension.toLowerCase()));
	}

	private filterByText(keybindingItems: IKeybindingItem[], searchValue: string): IKeybindingItemEntry[] {
		const quoteAtFirstChar = searchValue.charAt(0) === '"';
		const quoteAtLastChar = searchValue.charAt(searchValue.length - 1) === '"';
		const completeMatch = quoteAtFirstChar && quoteAtLastChar;
		if (quoteAtFirstChar) {
			searchValue = searchValue.substring(1);
		}
		if (quoteAtLastChar) {
			searchValue = searchValue.substring(0, searchValue.length - 1);
		}
		searchValue = searchValue.trim();

		const result: IKeybindingItemEntry[] = [];
		const words = searchValue.split(' ');
		const keybindingWords = this.splitKeybindingWords(words);
		for (const keybindingItem of keybindingItems) {
			const keybindingMatches = new KeybindingItemMatches(this.modifierLabels, keybindingItem, searchValue, words, keybindingWords, completeMatch);
			if (keybindingMatches.commandIdMatches
				|| keybindingMatches.commandLabelMatches
				|| keybindingMatches.commandDefaultLabelMatches
				|| keybindingMatches.sourceMatches
				|| keybindingMatches.whenMatches
				|| keybindingMatches.keybindingMatches
				|| keybindingMatches.extensionIdMatches
				|| keybindingMatches.extensionLabelMatches
			) {
				result.push({
					id: KeybindingsEditorModel.getId(keybindingItem),
					templateId: KEYBINDING_ENTRY_TEMPLATE_ID,
					commandLabelMatches: keybindingMatches.commandLabelMatches || undefined,
					commandDefaultLabelMatches: keybindingMatches.commandDefaultLabelMatches || undefined,
					keybindingItem,
					keybindingMatches: keybindingMatches.keybindingMatches || undefined,
					commandIdMatches: keybindingMatches.commandIdMatches || undefined,
					sourceMatches: keybindingMatches.sourceMatches || undefined,
					whenMatches: keybindingMatches.whenMatches || undefined,
					extensionIdMatches: keybindingMatches.extensionIdMatches || undefined,
					extensionLabelMatches: keybindingMatches.extensionLabelMatches || undefined
				});
			}
		}
		return result;
	}

	private filterByWhen(keybindingItems: IKeybindingItem[], command: string, when: string): IKeybindingItem[] {
		if (keybindingItems.length === 0) {
			return [];
		}

		// Check if a keybinding with the same command id and when clause exists
		const keybindingItemsWithWhen = keybindingItems.filter(k => k.when === when);
		if (keybindingItemsWithWhen.length) {
			return keybindingItemsWithWhen;
		}

		// Create a new entry with the when clause which does not live in the model
		// We can reuse some of the properties from the same command with different when clause
		const commandLabel = keybindingItems[0].commandLabel;

		const keybindingItem = new ResolvedKeybindingItem(undefined, command, null, ContextKeyExpr.deserialize(when), false, null, false);
		const actionLabels = new Map([[command, commandLabel]]);
		return [KeybindingsEditorModel.toKeybindingEntry(command, keybindingItem, actionLabels, this.getExtensionsMapping())];
	}

	private splitKeybindingWords(wordsSeparatedBySpaces: string[]): string[] {
		const result: string[] = [];
		for (const word of wordsSeparatedBySpaces) {
			result.push(...coalesce(word.split('+')));
		}
		return result;
	}

	override async resolve(actionLabels = new Map<string, string>()): Promise<void> {
		const extensions = this.getExtensionsMapping();

		this._keybindingItemsSortedByPrecedence = [];
		const boundCommands: Map<string, boolean> = new Map<string, boolean>();
		for (const keybinding of this.keybindingsService.getKeybindings()) {
			if (keybinding.command) { // Skip keybindings without commands
				this._keybindingItemsSortedByPrecedence.push(KeybindingsEditorModel.toKeybindingEntry(keybinding.command, keybinding, actionLabels, extensions));
				boundCommands.set(keybinding.command, true);
			}
		}

		const commandsWithDefaultKeybindings = this.keybindingsService.getDefaultKeybindings().map(keybinding => keybinding.command);
		for (const command of getAllUnboundCommands(boundCommands)) {
			const keybindingItem = new ResolvedKeybindingItem(undefined, command, null, undefined, commandsWithDefaultKeybindings.indexOf(command) === -1, null, false);
			this._keybindingItemsSortedByPrecedence.push(KeybindingsEditorModel.toKeybindingEntry(command, keybindingItem, actionLabels, extensions));
		}
		this._keybindingItemsSortedByPrecedence = distinct(this._keybindingItemsSortedByPrecedence, keybindingItem => KeybindingsEditorModel.getId(keybindingItem));
		this._keybindingItems = this._keybindingItemsSortedByPrecedence.slice(0).sort((a, b) => KeybindingsEditorModel.compareKeybindingData(a, b));

		return super.resolve();
	}

	private static getId(keybindingItem: IKeybindingItem): string {
		return keybindingItem.command + (keybindingItem?.keybinding?.getAriaLabel() ?? '') + keybindingItem.when + (isString(keybindingItem.source) ? keybindingItem.source : keybindingItem.source.identifier.value);
	}

	private getExtensionsMapping(): ExtensionIdentifierMap<IExtensionDescription> {
		const extensions = new ExtensionIdentifierMap<IExtensionDescription>();
		for (const extension of this.extensionService.extensions) {
			extensions.set(extension.identifier, extension);
		}
		return extensions;
	}

	private static compareKeybindingData(a: IKeybindingItem, b: IKeybindingItem): number {
		if (a.keybinding && !b.keybinding) {
			return -1;
		}
		if (b.keybinding && !a.keybinding) {
			return 1;
		}
		if (a.commandLabel && !b.commandLabel) {
			return -1;
		}
		if (b.commandLabel && !a.commandLabel) {
			return 1;
		}
		if (a.commandLabel && b.commandLabel) {
			if (a.commandLabel !== b.commandLabel) {
				return a.commandLabel.localeCompare(b.commandLabel);
			}
		}
		if (a.command === b.command) {
			return a.keybindingItem.isDefault ? 1 : -1;
		}
		return a.command.localeCompare(b.command);
	}

	private static toKeybindingEntry(command: string, keybindingItem: ResolvedKeybindingItem, actions: Map<string, string>, extensions: ExtensionIdentifierMap<IExtensionDescription>): IKeybindingItem {
		const menuCommand = MenuRegistry.getCommand(command);
		const editorActionLabel = actions.get(command);
		let source: string | IExtensionDescription = SOURCE_USER;
		if (keybindingItem.isDefault) {
			const extensionId = keybindingItem.extensionId ?? (keybindingItem.resolvedKeybinding ? undefined : menuCommand?.source?.id);
			source = extensionId ? extensions.get(extensionId) ?? SOURCE_EXTENSION : SOURCE_SYSTEM;
		}
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return <IKeybindingItem>{
			keybinding: keybindingItem.resolvedKeybinding,
			keybindingItem,
			command,
			commandLabel: KeybindingsEditorModel.getCommandLabel(menuCommand, editorActionLabel),
			commandDefaultLabel: KeybindingsEditorModel.getCommandDefaultLabel(menuCommand),
			when: keybindingItem.when ? keybindingItem.when.serialize() : '',
			source

		};
	}

	private static getCommandDefaultLabel(menuCommand: ICommandAction | undefined): string | null {
		if (!Language.isDefaultVariant()) {
			if (menuCommand && menuCommand.title && (<ILocalizedString>menuCommand.title).original) {
				const category: string | undefined = menuCommand.category ? (<ILocalizedString>menuCommand.category).original : undefined;
				const title = (<ILocalizedString>menuCommand.title).original;
				return category ? localize('cat.title', "{0}: {1}", category, title) : title;
			}
		}
		return null;
	}

	private static getCommandLabel(menuCommand: ICommandAction | undefined, editorActionLabel: string | undefined): string {
		if (menuCommand) {
			const category: string | undefined = menuCommand.category ? typeof menuCommand.category === 'string' ? menuCommand.category : menuCommand.category.value : undefined;
			const title = typeof menuCommand.title === 'string' ? menuCommand.title : menuCommand.title.value;
			return category ? localize('cat.title', "{0}: {1}", category, title) : title;
		}

		if (editorActionLabel) {
			return editorActionLabel;
		}

		return '';
	}
}

class KeybindingItemMatches {

	readonly commandIdMatches: IMatch[] | null = null;
	readonly commandLabelMatches: IMatch[] | null = null;
	readonly commandDefaultLabelMatches: IMatch[] | null = null;
	readonly sourceMatches: IMatch[] | null = null;
	readonly whenMatches: IMatch[] | null = null;
	readonly keybindingMatches: KeybindingMatches | null = null;
	readonly extensionIdMatches: IMatch[] | null = null;
	readonly extensionLabelMatches: IMatch[] | null = null;

	constructor(private modifierLabels: ModifierLabels, keybindingItem: IKeybindingItem, searchValue: string, words: string[], keybindingWords: string[], completeMatch: boolean) {
		if (!completeMatch) {
			this.commandIdMatches = this.matches(searchValue, keybindingItem.command, or(matchesWords, matchesCamelCase), words);
			this.commandLabelMatches = keybindingItem.commandLabel ? this.matches(searchValue, keybindingItem.commandLabel, (word, wordToMatchAgainst) => matchesWords(word, keybindingItem.commandLabel, true), words) : null;
			this.commandDefaultLabelMatches = keybindingItem.commandDefaultLabel ? this.matches(searchValue, keybindingItem.commandDefaultLabel, (word, wordToMatchAgainst) => matchesWords(word, keybindingItem.commandDefaultLabel, true), words) : null;
			this.whenMatches = keybindingItem.when ? this.matches(null, keybindingItem.when, or(matchesWords, matchesCamelCase), words) : null;
			if (isString(keybindingItem.source)) {
				this.sourceMatches = this.matches(searchValue, keybindingItem.source, (word, wordToMatchAgainst) => matchesWords(word, keybindingItem.source as string, true), words);
			} else {
				this.extensionLabelMatches = keybindingItem.source.displayName ? this.matches(searchValue, keybindingItem.source.displayName, (word, wordToMatchAgainst) => matchesWords(word, keybindingItem.commandLabel, true), words) : null;
			}
		}
		this.keybindingMatches = keybindingItem.keybinding ? this.matchesKeybinding(keybindingItem.keybinding, searchValue, keybindingWords, completeMatch) : null;
	}

	private matches(searchValue: string | null, wordToMatchAgainst: string, wordMatchesFilter: IFilter, words: string[]): IMatch[] | null {
		let matches = searchValue ? wordFilter(searchValue, wordToMatchAgainst) : null;
		if (!matches) {
			matches = this.matchesWords(words, wordToMatchAgainst, wordMatchesFilter);
		}
		if (matches) {
			matches = this.filterAndSort(matches);
		}
		return matches;
	}

	private matchesWords(words: string[], wordToMatchAgainst: string, wordMatchesFilter: IFilter): IMatch[] | null {
		let matches: IMatch[] | null = [];
		for (const word of words) {
			const wordMatches = wordMatchesFilter(word, wordToMatchAgainst);
			if (wordMatches) {
				matches = [...(matches || []), ...wordMatches];
			} else {
				matches = null;
				break;
			}
		}
		return matches;
	}

	private filterAndSort(matches: IMatch[]): IMatch[] {
		return distinct(matches, (a => a.start + '.' + a.end)).filter(match => !matches.some(m => !(m.start === match.start && m.end === match.end) && (m.start <= match.start && m.end >= match.end))).sort((a, b) => a.start - b.start);
	}

	private matchesKeybinding(keybinding: ResolvedKeybinding, searchValue: string, words: string[], completeMatch: boolean): KeybindingMatches | null {
		const [firstPart, chordPart] = keybinding.getChords();

		const userSettingsLabel = keybinding.getUserSettingsLabel();
		const ariaLabel = keybinding.getAriaLabel();
		const label = keybinding.getLabel();
		if ((userSettingsLabel && strings.compareIgnoreCase(searchValue, userSettingsLabel) === 0)
			|| (ariaLabel && strings.compareIgnoreCase(searchValue, ariaLabel) === 0)
			|| (label && strings.compareIgnoreCase(searchValue, label) === 0)) {
			return {
				firstPart: this.createCompleteMatch(firstPart),
				chordPart: this.createCompleteMatch(chordPart)
			};
		}

		const firstPartMatch: KeybindingMatch = {};
		let chordPartMatch: KeybindingMatch = {};

		const matchedWords: number[] = [];
		const firstPartMatchedWords: number[] = [];
		let chordPartMatchedWords: number[] = [];
		let matchFirstPart = true;
		for (let index = 0; index < words.length; index++) {
			const word = words[index];
			let firstPartMatched = false;
			let chordPartMatched = false;

			matchFirstPart = matchFirstPart && !firstPartMatch.keyCode;
			let matchChordPart = !chordPartMatch.keyCode;

			if (matchFirstPart) {
				firstPartMatched = this.matchPart(firstPart, firstPartMatch, word, completeMatch);
				if (firstPartMatch.keyCode) {
					for (const cordPartMatchedWordIndex of chordPartMatchedWords) {
						if (firstPartMatchedWords.indexOf(cordPartMatchedWordIndex) === -1) {
							matchedWords.splice(matchedWords.indexOf(cordPartMatchedWordIndex), 1);
						}
					}
					chordPartMatch = {};
					chordPartMatchedWords = [];
					matchChordPart = false;
				}
			}

			if (matchChordPart) {
				chordPartMatched = this.matchPart(chordPart, chordPartMatch, word, completeMatch);
			}

			if (firstPartMatched) {
				firstPartMatchedWords.push(index);
			}
			if (chordPartMatched) {
				chordPartMatchedWords.push(index);
			}
			if (firstPartMatched || chordPartMatched) {
				matchedWords.push(index);
			}

			matchFirstPart = matchFirstPart && this.isModifier(word);
		}
		if (matchedWords.length !== words.length) {
			return null;
		}
		if (completeMatch) {
			if (!this.isCompleteMatch(firstPart, firstPartMatch)) {
				return null;
			}
			if (!isEmptyObject(chordPartMatch) && !this.isCompleteMatch(chordPart, chordPartMatch)) {
				return null;
			}
		}
		return this.hasAnyMatch(firstPartMatch) || this.hasAnyMatch(chordPartMatch) ? { firstPart: firstPartMatch, chordPart: chordPartMatch } : null;
	}

	private matchPart(chord: ResolvedChord | null, match: KeybindingMatch, word: string, completeMatch: boolean): boolean {
		let matched = false;
		if (this.matchesMetaModifier(chord, word)) {
			matched = true;
			match.metaKey = true;
		}
		if (this.matchesCtrlModifier(chord, word)) {
			matched = true;
			match.ctrlKey = true;
		}
		if (this.matchesShiftModifier(chord, word)) {
			matched = true;
			match.shiftKey = true;
		}
		if (this.matchesAltModifier(chord, word)) {
			matched = true;
			match.altKey = true;
		}
		if (this.matchesKeyCode(chord, word, completeMatch)) {
			match.keyCode = true;
			matched = true;
		}
		return matched;
	}

	private matchesKeyCode(chord: ResolvedChord | null, word: string, completeMatch: boolean): boolean {
		if (!chord) {
			return false;
		}
		const ariaLabel: string = chord.keyAriaLabel || '';
		if (completeMatch || ariaLabel.length === 1 || word.length === 1) {
			if (strings.compareIgnoreCase(ariaLabel, word) === 0) {
				return true;
			}
		} else {
			if (matchesContiguousSubString(word, ariaLabel)) {
				return true;
			}
		}
		return false;
	}

	private matchesMetaModifier(chord: ResolvedChord | null, word: string): boolean {
		if (!chord) {
			return false;
		}
		if (!chord.metaKey) {
			return false;
		}
		return this.wordMatchesMetaModifier(word);
	}

	private matchesCtrlModifier(chord: ResolvedChord | null, word: string): boolean {
		if (!chord) {
			return false;
		}
		if (!chord.ctrlKey) {
			return false;
		}
		return this.wordMatchesCtrlModifier(word);
	}

	private matchesShiftModifier(chord: ResolvedChord | null, word: string): boolean {
		if (!chord) {
			return false;
		}
		if (!chord.shiftKey) {
			return false;
		}
		return this.wordMatchesShiftModifier(word);
	}

	private matchesAltModifier(chord: ResolvedChord | null, word: string): boolean {
		if (!chord) {
			return false;
		}
		if (!chord.altKey) {
			return false;
		}
		return this.wordMatchesAltModifier(word);
	}

	private hasAnyMatch(keybindingMatch: KeybindingMatch): boolean {
		return !!keybindingMatch.altKey ||
			!!keybindingMatch.ctrlKey ||
			!!keybindingMatch.metaKey ||
			!!keybindingMatch.shiftKey ||
			!!keybindingMatch.keyCode;
	}

	private isCompleteMatch(chord: ResolvedChord | null, match: KeybindingMatch): boolean {
		if (!chord) {
			return true;
		}
		if (!match.keyCode) {
			return false;
		}
		if (chord.metaKey && !match.metaKey) {
			return false;
		}
		if (chord.altKey && !match.altKey) {
			return false;
		}
		if (chord.ctrlKey && !match.ctrlKey) {
			return false;
		}
		if (chord.shiftKey && !match.shiftKey) {
			return false;
		}
		return true;
	}

	private createCompleteMatch(chord: ResolvedChord | null): KeybindingMatch {
		const match: KeybindingMatch = {};
		if (chord) {
			match.keyCode = true;
			if (chord.metaKey) {
				match.metaKey = true;
			}
			if (chord.altKey) {
				match.altKey = true;
			}
			if (chord.ctrlKey) {
				match.ctrlKey = true;
			}
			if (chord.shiftKey) {
				match.shiftKey = true;
			}
		}
		return match;
	}

	private isModifier(word: string): boolean {
		if (this.wordMatchesAltModifier(word)) {
			return true;
		}
		if (this.wordMatchesCtrlModifier(word)) {
			return true;
		}
		if (this.wordMatchesMetaModifier(word)) {
			return true;
		}
		if (this.wordMatchesShiftModifier(word)) {
			return true;
		}
		return false;
	}

	private wordMatchesAltModifier(word: string): boolean {
		if (strings.equalsIgnoreCase(this.modifierLabels.ui.altKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.aria.altKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.user.altKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(localize('option', "option"), word)) {
			return true;
		}
		return false;
	}

	private wordMatchesCtrlModifier(word: string): boolean {
		if (strings.equalsIgnoreCase(this.modifierLabels.ui.ctrlKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.aria.ctrlKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.user.ctrlKey, word)) {
			return true;
		}
		return false;
	}

	private wordMatchesMetaModifier(word: string): boolean {
		if (strings.equalsIgnoreCase(this.modifierLabels.ui.metaKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.aria.metaKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.user.metaKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(localize('meta', "meta"), word)) {
			return true;
		}
		return false;
	}

	private wordMatchesShiftModifier(word: string): boolean {
		if (strings.equalsIgnoreCase(this.modifierLabels.ui.shiftKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.aria.shiftKey, word)) {
			return true;
		}
		if (strings.equalsIgnoreCase(this.modifierLabels.user.shiftKey, word)) {
			return true;
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/browser/preferencesService.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/browser/preferencesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getErrorMessage } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { parse } from '../../../../base/common/json.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import * as network from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { CoreEditingCommands } from '../../../../editor/browser/coreCommands.js';
import { getCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions, getDefaultValue, IConfigurationRegistry, OVERRIDE_PROPERTY_REGEX } from '../../../../platform/configuration/common/configurationRegistry.js';
import { FileOperationError, FileOperationResult } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { DEFAULT_EDITOR_ASSOCIATION, IEditorPane } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { GroupDirection, IEditorGroup, IEditorGroupsService } from '../../editor/common/editorGroupsService.js';
import { IEditorService, SIDE_GROUP } from '../../editor/common/editorService.js';
import { KeybindingsEditorInput } from './keybindingsEditorInput.js';
import { DEFAULT_SETTINGS_EDITOR_SETTING, FOLDER_SETTINGS_PATH, IKeybindingsEditorPane, IOpenKeybindingsEditorOptions, IOpenSettingsOptions, IPreferencesEditorModel, IPreferencesService, ISetting, ISettingsEditorOptions, ISettingsGroup, SETTINGS_AUTHORITY, USE_SPLIT_JSON_SETTING, validateSettingsEditorOptions } from '../common/preferences.js';
import { PreferencesEditorInput, SettingsEditor2Input } from '../common/preferencesEditorInput.js';
import { defaultKeybindingsContents, DefaultKeybindingsEditorModel, DefaultRawSettingsEditorModel, DefaultSettings, DefaultSettingsEditorModel, Settings2EditorModel, SettingsEditorModel, WorkspaceConfigurationEditorModel } from '../common/preferencesModels.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { ITextEditorService } from '../../textfile/common/textEditorService.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { isObject } from '../../../../base/common/types.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { isEqual } from '../../../../base/common/resources.js';
import { IURLService } from '../../../../platform/url/common/url.js';
import { compareIgnoreCase } from '../../../../base/common/strings.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { findGroup } from '../../editor/common/editorGroupFinder.js';

const emptyEditableSettingsContent = '{\n}';

export class PreferencesService extends Disposable implements IPreferencesService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDispose = this._register(new Emitter<void>());

	private readonly _onDidDefaultSettingsContentChanged = this._register(new Emitter<URI>());
	readonly onDidDefaultSettingsContentChanged = this._onDidDefaultSettingsContentChanged.event;

	private _defaultUserSettingsContentModel: DefaultSettings | undefined;
	private _defaultWorkspaceSettingsContentModel: DefaultSettings | undefined;
	private _defaultFolderSettingsContentModel: DefaultSettings | undefined;

	private _defaultRawSettingsEditorModel: DefaultRawSettingsEditorModel | undefined;

	private readonly _requestedDefaultSettings = new ResourceSet();

	private _settingsGroups: ISettingsGroup[] | undefined = undefined;
	private _cachedSettingsEditor2Input: SettingsEditor2Input | undefined = undefined;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IModelService modelService: IModelService,
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
		@ILabelService private readonly labelService: ILabelService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@ITextEditorService private readonly textEditorService: ITextEditorService,
		@IURLService urlService: IURLService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProgressService private readonly progressService: IProgressService
	) {
		super();
		// The default keybindings.json updates based on keyboard layouts, so here we make sure
		// if a model has been given out we update it accordingly.
		this._register(keybindingService.onDidUpdateKeybindings(() => {
			const model = modelService.getModel(this.defaultKeybindingsResource);
			if (!model) {
				// model has not been given out => nothing to do
				return;
			}
			modelService.updateModel(model, defaultKeybindingsContents(keybindingService));
		}));

		this._register(urlService.registerHandler(this));
	}

	readonly defaultKeybindingsResource = URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/keybindings.json' });
	private readonly defaultSettingsRawResource = URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/defaultSettings.json' });

	get userSettingsResource(): URI {
		return this.userDataProfileService.currentProfile.settingsResource;
	}

	get workspaceSettingsResource(): URI | null {
		if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return null;
		}
		const workspace = this.contextService.getWorkspace();
		return workspace.configuration || workspace.folders[0].toResource(FOLDER_SETTINGS_PATH);
	}

	private createOrGetCachedSettingsEditor2Input(): SettingsEditor2Input {
		if (!this._cachedSettingsEditor2Input || this._cachedSettingsEditor2Input.isDisposed()) {
			// Recreate the input if the user never opened the Settings editor,
			// or if they closed it and want to reopen it.
			this._cachedSettingsEditor2Input = new SettingsEditor2Input(this);
		}
		return this._cachedSettingsEditor2Input;
	}

	getFolderSettingsResource(resource: URI): URI | null {
		const folder = this.contextService.getWorkspaceFolder(resource);
		return folder ? folder.toResource(FOLDER_SETTINGS_PATH) : null;
	}

	hasDefaultSettingsContent(uri: URI): boolean {
		return this.isDefaultSettingsResource(uri) || isEqual(uri, this.defaultSettingsRawResource) || isEqual(uri, this.defaultKeybindingsResource);
	}

	getDefaultSettingsContent(uri: URI): string | undefined {
		if (this.isDefaultSettingsResource(uri)) {
			// We opened a split json editor in this case,
			// and this half shows the default settings.

			const target = this.getConfigurationTargetFromDefaultSettingsResource(uri);
			const defaultSettings = this.getDefaultSettings(target);

			if (!this._requestedDefaultSettings.has(uri)) {
				this._register(defaultSettings.onDidChange(() => this._onDidDefaultSettingsContentChanged.fire(uri)));
				this._requestedDefaultSettings.add(uri);
			}
			return defaultSettings.getContentWithoutMostCommonlyUsed(true);
		}

		if (isEqual(uri, this.defaultSettingsRawResource)) {
			if (!this._defaultRawSettingsEditorModel) {
				this._defaultRawSettingsEditorModel = this._register(this.instantiationService.createInstance(DefaultRawSettingsEditorModel, this.getDefaultSettings(ConfigurationTarget.USER_LOCAL)));
				this._register(this._defaultRawSettingsEditorModel.onDidContentChanged(() => this._onDidDefaultSettingsContentChanged.fire(uri)));
			}
			return this._defaultRawSettingsEditorModel.content;
		}

		if (isEqual(uri, this.defaultKeybindingsResource)) {
			const defaultKeybindingsEditorModel = this.instantiationService.createInstance(DefaultKeybindingsEditorModel, uri);
			return defaultKeybindingsEditorModel.content;
		}

		return undefined;
	}

	public async createPreferencesEditorModel(uri: URI): Promise<IPreferencesEditorModel<ISetting> | null> {
		if (this.isDefaultSettingsResource(uri)) {
			return this.createDefaultSettingsEditorModel(uri);
		}

		if (this.userSettingsResource.toString() === uri.toString() || this.userDataProfilesService.defaultProfile.settingsResource.toString() === uri.toString()) {
			return this.createEditableSettingsEditorModel(ConfigurationTarget.USER_LOCAL, uri);
		}

		const workspaceSettingsUri = await this.getEditableSettingsURI(ConfigurationTarget.WORKSPACE);
		if (workspaceSettingsUri && workspaceSettingsUri.toString() === uri.toString()) {
			return this.createEditableSettingsEditorModel(ConfigurationTarget.WORKSPACE, workspaceSettingsUri);
		}

		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			const settingsUri = await this.getEditableSettingsURI(ConfigurationTarget.WORKSPACE_FOLDER, uri);
			if (settingsUri && settingsUri.toString() === uri.toString()) {
				return this.createEditableSettingsEditorModel(ConfigurationTarget.WORKSPACE_FOLDER, uri);
			}
		}

		const remoteEnvironment = await this.remoteAgentService.getEnvironment();
		const remoteSettingsUri = remoteEnvironment ? remoteEnvironment.settingsPath : null;
		if (remoteSettingsUri && remoteSettingsUri.toString() === uri.toString()) {
			return this.createEditableSettingsEditorModel(ConfigurationTarget.USER_REMOTE, uri);
		}

		return null;
	}

	openRawDefaultSettings(): Promise<IEditorPane | undefined> {
		return this.editorService.openEditor({ resource: this.defaultSettingsRawResource });
	}

	openRawUserSettings(): Promise<IEditorPane | undefined> {
		return this.editorService.openEditor({ resource: this.userSettingsResource });
	}

	private shouldOpenJsonByDefault(): boolean {
		return this.configurationService.getValue('workbench.settings.editor') === 'json';
	}

	async openPreferences(): Promise<void> {
		await this.editorGroupService.activeGroup.openEditor(this.instantiationService.createInstance(PreferencesEditorInput));
	}

	openSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		options = {
			...options,
			target: ConfigurationTarget.USER_LOCAL,
		};
		if (options.query) {
			options.jsonEditor = false;
		}

		return this.open(this.userSettingsResource, options);
	}

	openLanguageSpecificSettings(languageId: string, options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		if (this.shouldOpenJsonByDefault()) {
			options.query = undefined;
			options.revealSetting = { key: `[${languageId}]`, edit: true };
		} else {
			options.query = `@lang:${languageId}${options.query ? ` ${options.query}` : ''}`;
		}
		options.target = options.target ?? ConfigurationTarget.USER_LOCAL;

		return this.open(this.userSettingsResource, options);
	}

	private open(settingsResource: URI, options: IOpenSettingsOptions): Promise<IEditorPane | undefined> {
		options = {
			...options,
			jsonEditor: options.jsonEditor ?? this.shouldOpenJsonByDefault()
		};

		return options.jsonEditor ?
			this.openSettingsJson(settingsResource, options) :
			this.openSettings2(options);
	}

	private async openSettings2(options: IOpenSettingsOptions): Promise<IEditorPane | undefined> {
		const input = this.createOrGetCachedSettingsEditor2Input();
		options = {
			...options,
			focusSearch: true
		};
		const group = await this.getEditorGroupFromOptions(options);
		return group.openEditor(input, validateSettingsEditorOptions(options));
	}

	openApplicationSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		options = {
			...options,
			target: ConfigurationTarget.USER_LOCAL,
		};
		return this.open(this.userDataProfilesService.defaultProfile.settingsResource, options);
	}

	openUserSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		options = {
			...options,
			target: ConfigurationTarget.USER_LOCAL,
		};
		return this.open(this.userSettingsResource, options);
	}

	async openRemoteSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		const environment = await this.remoteAgentService.getEnvironment();
		if (environment) {
			options = {
				...options,
				target: ConfigurationTarget.USER_REMOTE,
			};

			this.open(environment.settingsPath, options);
		}
		return undefined;
	}

	openWorkspaceSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		if (!this.workspaceSettingsResource) {
			this.notificationService.info(nls.localize('openFolderFirst', "Open a folder or workspace first to create workspace or folder settings."));
			return Promise.reject(null);
		}

		options = {
			...options,
			target: ConfigurationTarget.WORKSPACE
		};
		return this.open(this.workspaceSettingsResource, options);
	}

	async openFolderSettings(options: IOpenSettingsOptions = {}): Promise<IEditorPane | undefined> {
		options = {
			...options,
			target: ConfigurationTarget.WORKSPACE_FOLDER
		};

		if (!options.folderUri) {
			throw new Error(`Missing folder URI`);
		}

		const folderSettingsUri = await this.getEditableSettingsURI(ConfigurationTarget.WORKSPACE_FOLDER, options.folderUri);
		if (!folderSettingsUri) {
			throw new Error(`Invalid folder URI - ${options.folderUri.toString()}`);
		}

		return this.open(folderSettingsUri, options);
	}

	async openGlobalKeybindingSettings(textual: boolean, options?: IOpenKeybindingsEditorOptions): Promise<void> {
		options = { pinned: true, revealIfOpened: true, ...options };
		if (textual) {
			const emptyContents = '// ' + nls.localize('emptyKeybindingsHeader', "Place your key bindings in this file to override the defaults") + '\n[\n]';
			const editableKeybindings = this.userDataProfileService.currentProfile.keybindingsResource;
			const openDefaultKeybindings = !!this.configurationService.getValue('workbench.settings.openDefaultKeybindings');

			// Create as needed and open in editor
			await this.createIfNotExists(editableKeybindings, emptyContents);
			if (openDefaultKeybindings) {
				const sourceGroupId = options.groupId ?? this.editorGroupService.activeGroup.id;
				const sideEditorGroup = this.editorGroupService.addGroup(sourceGroupId, GroupDirection.RIGHT);
				await Promise.all([
					this.editorService.openEditor({ resource: this.defaultKeybindingsResource, options: { pinned: true, preserveFocus: true, revealIfOpened: true, override: DEFAULT_EDITOR_ASSOCIATION.id }, label: nls.localize('defaultKeybindings', "Default Keybindings"), description: '' }, sourceGroupId),
					this.editorService.openEditor({ resource: editableKeybindings, options }, sideEditorGroup.id)
				]);
			} else {
				await this.editorService.openEditor({ resource: editableKeybindings, options }, options.groupId);
			}

		} else {
			const editor = (await this.editorService.openEditor(this.instantiationService.createInstance(KeybindingsEditorInput), { ...options }, options.groupId)) as IKeybindingsEditorPane;
			if (options.query) {
				editor.search(options.query);
			}
		}

	}

	openDefaultKeybindingsFile(): Promise<IEditorPane | undefined> {
		return this.editorService.openEditor({ resource: this.defaultKeybindingsResource, label: nls.localize('defaultKeybindings', "Default Keybindings") });
	}

	private async getEditorGroupFromOptions(options: IOpenSettingsOptions): Promise<IEditorGroup> {
		let group = options?.groupId !== undefined ? this.editorGroupService.getGroup(options.groupId) ?? this.editorGroupService.activeGroup : this.editorGroupService.activeGroup;
		if (options.openToSide) {
			group = (await this.instantiationService.invokeFunction(findGroup, {}, SIDE_GROUP))[0];
		}
		return group;
	}

	private async openSettingsJson(resource: URI, options: IOpenSettingsOptions): Promise<IEditorPane | undefined> {
		const group = await this.getEditorGroupFromOptions(options);
		const editor = await this.doOpenSettingsJson(resource, options, group);
		if (editor && options?.revealSetting) {
			await this.revealSetting(options.revealSetting.key, !!options.revealSetting.edit, editor, resource);
		}
		return editor;
	}

	private async doOpenSettingsJson(resource: URI, options: ISettingsEditorOptions, group: IEditorGroup): Promise<IEditorPane | undefined> {
		const openSplitJSON = !!this.configurationService.getValue(USE_SPLIT_JSON_SETTING);
		const openDefaultSettings = !!this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING);
		if (openSplitJSON || openDefaultSettings) {
			return this.doOpenSplitJSON(resource, options, group);
		}

		const configurationTarget = options?.target ?? ConfigurationTarget.USER;
		const editableSettingsEditorInput = await this.getOrCreateEditableSettingsEditorInput(configurationTarget, resource);
		options = { ...options, pinned: true };
		return await group.openEditor(editableSettingsEditorInput, { ...validateSettingsEditorOptions(options) });
	}

	private async doOpenSplitJSON(resource: URI, options: ISettingsEditorOptions = {}, group: IEditorGroup,): Promise<IEditorPane | undefined> {
		const configurationTarget = options.target ?? ConfigurationTarget.USER;
		await this.createSettingsIfNotExists(configurationTarget, resource);
		const preferencesEditorInput = this.createSplitJsonEditorInput(configurationTarget, resource);
		options = { ...options, pinned: true };
		return group.openEditor(preferencesEditorInput, validateSettingsEditorOptions(options));
	}

	public createSplitJsonEditorInput(configurationTarget: ConfigurationTarget, resource: URI): EditorInput {
		const editableSettingsEditorInput = this.textEditorService.createTextEditor({ resource });
		const defaultPreferencesEditorInput = this.textEditorService.createTextEditor({ resource: this.getDefaultSettingsResource(configurationTarget) });
		return this.instantiationService.createInstance(SideBySideEditorInput, editableSettingsEditorInput.getName(), undefined, defaultPreferencesEditorInput, editableSettingsEditorInput);
	}

	public createSettings2EditorModel(): Settings2EditorModel {
		return this.instantiationService.createInstance(Settings2EditorModel, this.getDefaultSettings(ConfigurationTarget.USER_LOCAL));
	}

	private getConfigurationTargetFromDefaultSettingsResource(uri: URI) {
		return this.isDefaultWorkspaceSettingsResource(uri) ?
			ConfigurationTarget.WORKSPACE :
			this.isDefaultFolderSettingsResource(uri) ?
				ConfigurationTarget.WORKSPACE_FOLDER :
				ConfigurationTarget.USER_LOCAL;
	}

	private isDefaultSettingsResource(uri: URI): boolean {
		return this.isDefaultUserSettingsResource(uri) || this.isDefaultWorkspaceSettingsResource(uri) || this.isDefaultFolderSettingsResource(uri);
	}

	private isDefaultUserSettingsResource(uri: URI): boolean {
		return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?settings\.json$/);
	}

	private isDefaultWorkspaceSettingsResource(uri: URI): boolean {
		return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?workspaceSettings\.json$/);
	}

	private isDefaultFolderSettingsResource(uri: URI): boolean {
		return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?resourceSettings\.json$/);
	}

	private getDefaultSettingsResource(configurationTarget: ConfigurationTarget): URI {
		switch (configurationTarget) {
			case ConfigurationTarget.WORKSPACE:
				return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: `/workspaceSettings.json` });
			case ConfigurationTarget.WORKSPACE_FOLDER:
				return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: `/resourceSettings.json` });
		}
		return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: `/settings.json` });
	}

	private async getOrCreateEditableSettingsEditorInput(target: ConfigurationTarget, resource: URI): Promise<EditorInput> {
		await this.createSettingsIfNotExists(target, resource);
		return this.textEditorService.createTextEditor({ resource });
	}

	private async createEditableSettingsEditorModel(configurationTarget: ConfigurationTarget, settingsUri: URI): Promise<SettingsEditorModel> {
		const workspace = this.contextService.getWorkspace();
		if (workspace.configuration && workspace.configuration.toString() === settingsUri.toString()) {
			const reference = await this.textModelResolverService.createModelReference(settingsUri);
			return this.instantiationService.createInstance(WorkspaceConfigurationEditorModel, reference, configurationTarget);
		}

		const reference = await this.textModelResolverService.createModelReference(settingsUri);
		return this.instantiationService.createInstance(SettingsEditorModel, reference, configurationTarget);
	}

	private async createDefaultSettingsEditorModel(defaultSettingsUri: URI): Promise<DefaultSettingsEditorModel> {
		const reference = await this.textModelResolverService.createModelReference(defaultSettingsUri);
		const target = this.getConfigurationTargetFromDefaultSettingsResource(defaultSettingsUri);
		return this.instantiationService.createInstance(DefaultSettingsEditorModel, defaultSettingsUri, reference, this.getDefaultSettings(target));
	}

	private getDefaultSettings(target: ConfigurationTarget): DefaultSettings {
		if (target === ConfigurationTarget.WORKSPACE) {
			this._defaultWorkspaceSettingsContentModel ??= this._register(new DefaultSettings(this.getMostCommonlyUsedSettings(), target, this.configurationService));
			return this._defaultWorkspaceSettingsContentModel;
		}
		if (target === ConfigurationTarget.WORKSPACE_FOLDER) {
			this._defaultFolderSettingsContentModel ??= this._register(new DefaultSettings(this.getMostCommonlyUsedSettings(), target, this.configurationService));
			return this._defaultFolderSettingsContentModel;
		}
		this._defaultUserSettingsContentModel ??= this._register(new DefaultSettings(this.getMostCommonlyUsedSettings(), target, this.configurationService));
		return this._defaultUserSettingsContentModel;
	}

	public async getEditableSettingsURI(configurationTarget: ConfigurationTarget, resource?: URI): Promise<URI | null> {
		switch (configurationTarget) {
			case ConfigurationTarget.APPLICATION:
				return this.userDataProfilesService.defaultProfile.settingsResource;
			case ConfigurationTarget.USER:
			case ConfigurationTarget.USER_LOCAL:
				return this.userSettingsResource;
			case ConfigurationTarget.USER_REMOTE: {
				const remoteEnvironment = await this.remoteAgentService.getEnvironment();
				return remoteEnvironment ? remoteEnvironment.settingsPath : null;
			}
			case ConfigurationTarget.WORKSPACE:
				return this.workspaceSettingsResource;
			case ConfigurationTarget.WORKSPACE_FOLDER:
				if (resource) {
					return this.getFolderSettingsResource(resource);
				}
		}
		return null;
	}

	private async createSettingsIfNotExists(target: ConfigurationTarget, resource: URI): Promise<void> {
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE && target === ConfigurationTarget.WORKSPACE) {
			const workspaceConfig = this.contextService.getWorkspace().configuration;
			if (!workspaceConfig) {
				return;
			}

			const content = await this.textFileService.read(workspaceConfig);
			if (Object.keys(parse(content.value)).indexOf('settings') === -1) {
				await this.jsonEditingService.write(resource, [{ path: ['settings'], value: {} }], true);
			}
			return undefined;
		}

		await this.createIfNotExists(resource, emptyEditableSettingsContent);
	}

	private async createIfNotExists(resource: URI, contents: string): Promise<void> {
		try {
			await this.textFileService.read(resource, { acceptTextOnly: true });
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				try {
					await this.textFileService.write(resource, contents);
					return;
				} catch (error2) {
					throw new Error(nls.localize('fail.createSettings', "Unable to create '{0}' ({1}).", this.labelService.getUriLabel(resource, { relative: true }), getErrorMessage(error2)));
				}
			} else {
				throw error;
			}

		}
	}

	private getMostCommonlyUsedSettings(): string[] {
		return [
			'files.autoSave',
			'editor.fontSize',
			'editor.fontFamily',
			'editor.tabSize',
			'editor.renderWhitespace',
			'editor.cursorStyle',
			'editor.multiCursorModifier',
			'editor.insertSpaces',
			'editor.wordWrap',
			'files.exclude',
			'files.associations',
			'workbench.editor.enablePreview'
		];
	}

	private async revealSetting(settingKey: string, edit: boolean, editor: IEditorPane, settingsResource: URI): Promise<void> {
		const codeEditor = editor ? getCodeEditor(editor.getControl()) : null;
		if (!codeEditor) {
			return;
		}
		const settingsModel = await this.createPreferencesEditorModel(settingsResource);
		if (!settingsModel) {
			return;
		}
		const position = await this.getPositionToReveal(settingKey, edit, settingsModel, codeEditor);
		if (position) {
			codeEditor.setPosition(position);
			codeEditor.revealPositionNearTop(position);
			codeEditor.focus();
			if (edit) {
				SuggestController.get(codeEditor)?.triggerSuggest();
			}
		}
	}

	private async getPositionToReveal(settingKey: string, edit: boolean, settingsModel: IPreferencesEditorModel<ISetting>, codeEditor: ICodeEditor): Promise<IPosition | null> {
		const model = codeEditor.getModel();
		if (!model) {
			return null;
		}
		const schema = Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationProperties()[settingKey];
		const isOverrideProperty = OVERRIDE_PROPERTY_REGEX.test(settingKey);
		if (!schema && !isOverrideProperty) {
			return null;
		}

		let position = null;
		const type = schema?.type ?? 'object' /* Type not defined or is an Override Identifier */;
		let setting = settingsModel.getPreference(settingKey);
		if (!setting && edit) {
			let defaultValue = (type === 'object' || type === 'array') ? this.configurationService.inspect(settingKey).defaultValue : getDefaultValue(type);
			defaultValue = defaultValue === undefined && isOverrideProperty ? {} : defaultValue;
			if (defaultValue !== undefined) {
				const key = settingsModel instanceof WorkspaceConfigurationEditorModel ? ['settings', settingKey] : [settingKey];
				await this.jsonEditingService.write(settingsModel.uri!, [{ path: key, value: defaultValue }], false);
				setting = settingsModel.getPreference(settingKey);
			}
		}

		if (setting) {
			if (edit) {
				if (isObject(setting.value) || Array.isArray(setting.value)) {
					position = { lineNumber: setting.valueRange.startLineNumber, column: setting.valueRange.startColumn + 1 };
					codeEditor.setPosition(position);
					await this.instantiationService.invokeFunction(accessor => {
						return CoreEditingCommands.LineBreakInsert.runEditorCommand(accessor, codeEditor, null);
					});
					position = { lineNumber: position.lineNumber + 1, column: model.getLineMaxColumn(position.lineNumber + 1) };
					const firstNonWhiteSpaceColumn = model.getLineFirstNonWhitespaceColumn(position.lineNumber);
					if (firstNonWhiteSpaceColumn) {
						// Line has some text. Insert another new line.
						codeEditor.setPosition({ lineNumber: position.lineNumber, column: firstNonWhiteSpaceColumn });
						await this.instantiationService.invokeFunction(accessor => {
							return CoreEditingCommands.LineBreakInsert.runEditorCommand(accessor, codeEditor, null);
						});
						position = { lineNumber: position.lineNumber, column: model.getLineMaxColumn(position.lineNumber) };
					}
				} else {
					position = { lineNumber: setting.valueRange.startLineNumber, column: setting.valueRange.endColumn };
				}
			} else {
				position = { lineNumber: setting.keyRange.startLineNumber, column: setting.keyRange.startColumn };
			}
		}

		return position;
	}

	getSetting(settingId: string): ISetting | undefined {
		if (!this._settingsGroups) {
			const defaultSettings = this.getDefaultSettings(ConfigurationTarget.USER);
			const defaultsChangedDisposable: MutableDisposable<IDisposable> = this._register(new MutableDisposable());
			defaultsChangedDisposable.value = defaultSettings.onDidChange(() => {
				this._settingsGroups = undefined;
				defaultsChangedDisposable.clear();
			});
			this._settingsGroups = defaultSettings.getSettingsGroups();
		}

		for (const group of this._settingsGroups) {
			for (const section of group.sections) {
				for (const setting of section.settings) {
					if (compareIgnoreCase(setting.key, settingId) === 0) {
						return setting;
					}
				}
			}
		}
		return undefined;
	}

	/**
	 * Should be of the format:
	 * 	code://settings/settingName
	 * Examples:
	 * 	code://settings/files.autoSave
	 *
	 */
	async handleURL(uri: URI): Promise<boolean> {
		if (compareIgnoreCase(uri.authority, SETTINGS_AUTHORITY) !== 0) {
			return false;
		}

		const settingInfo = uri.path.split('/').filter(part => !!part);
		const settingId = ((settingInfo.length > 0) ? settingInfo[0] : undefined);
		if (!settingId) {
			this.openSettings();
			return true;
		}

		let setting = this.getSetting(settingId);

		if (!setting && this.extensionService.extensions.length === 0) {
			// wait for extension points to be processed
			await this.progressService.withProgress({ location: ProgressLocation.Window }, () => Event.toPromise(this.extensionService.onDidRegisterExtensions));
			setting = this.getSetting(settingId);
		}

		const openSettingsOptions: IOpenSettingsOptions = {};
		if (setting) {
			openSettingsOptions.query = settingId;
		}

		this.openSettings(openSettingsOptions);
		return true;
	}

	public override dispose(): void {
		if (this._cachedSettingsEditor2Input && !this._cachedSettingsEditor2Input.isDisposed()) {
			this._cachedSettingsEditor2Input.dispose();
		}
		this._onDispose.fire();
		super.dispose();
	}
}

registerSingleton(IPreferencesService, PreferencesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/common/preferences.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/common/preferences.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { Event } from '../../../../base/common/event.js';
import { IMatch } from '../../../../base/common/filters.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationDefaultValueSource, ConfigurationScope, EditPresentationTypes, IExtensionInfo } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ResolvedKeybindingItem } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { DEFAULT_EDITOR_ASSOCIATION, IEditorPane } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { Settings2EditorModel } from './preferencesModels.js';

export enum SettingValueType {
	Null = 'null',
	Enum = 'enum',
	String = 'string',
	MultilineString = 'multiline-string',
	Integer = 'integer',
	Number = 'number',
	Boolean = 'boolean',
	Array = 'array',
	Exclude = 'exclude',
	Include = 'include',
	Complex = 'complex',
	NullableInteger = 'nullable-integer',
	NullableNumber = 'nullable-number',
	Object = 'object',
	BooleanObject = 'boolean-object',
	LanguageTag = 'language-tag',
	ExtensionToggle = 'extension-toggle',
	ComplexObject = 'complex-object',
}

export interface ISettingsGroup {
	id: string;
	range: IRange;
	title: string;
	titleRange: IRange;
	sections: ISettingsSection[];
	order?: number;
	extensionInfo?: IExtensionInfo;
}

export interface ISettingsSection {
	title?: string;
	settings: ISetting[];
}

export interface ISetting {
	range: IRange;
	key: string;
	keyRange: IRange;
	value: any;
	valueRange: IRange;
	description: string[];
	descriptionIsMarkdown?: boolean;
	descriptionRanges: IRange[];
	overrides?: ISetting[];
	overrideOf?: ISetting;
	deprecationMessage?: string;
	deprecationMessageIsMarkdown?: boolean;

	scope?: ConfigurationScope;
	type?: string | string[];
	order?: number;
	arrayItemType?: string;
	objectProperties?: IJSONSchemaMap;
	objectPatternProperties?: IJSONSchemaMap;
	objectAdditionalProperties?: boolean | IJSONSchema;
	enum?: string[];
	enumDescriptions?: string[];
	enumDescriptionsAreMarkdown?: boolean;
	uniqueItems?: boolean;
	tags?: string[];
	disallowSyncIgnore?: boolean;
	restricted?: boolean;
	extensionInfo?: IExtensionInfo;
	validator?: (value: any) => string | null;
	enumItemLabels?: string[];
	editPresentation?: EditPresentationTypes;
	nonLanguageSpecificDefaultValueSource?: ConfigurationDefaultValueSource;
	isLanguageTagSetting?: boolean;
	categoryLabel?: string;

	// Internal properties
	allKeysAreBoolean?: boolean;
	displayExtensionId?: string;
	title?: string;
	extensionGroupTitle?: string;
	internalOrder?: number;
}

export interface IExtensionSetting extends ISetting {
	extensionName?: string;
	extensionPublisher?: string;
}

export interface ISearchResult {
	filterMatches: ISettingMatch[];
	exactMatch: boolean;
	metadata?: IFilterMetadata;
}

export interface ISearchResultGroup {
	id: string;
	label: string;
	result: ISearchResult;
	order: number;
}

export interface IFilterResult {
	query?: string;
	filteredGroups: ISettingsGroup[];
	allGroups: ISettingsGroup[];
	matches: IRange[];
	metadata?: IStringDictionary<IFilterMetadata>;
	exactMatch?: boolean;
}

/**
 * The ways a setting could match a query,
 * sorted in increasing order of relevance.
 */
export enum SettingMatchType {
	None = 0,
	LanguageTagSettingMatch = 1 << 0,
	RemoteMatch = 1 << 1,
	NonContiguousQueryInSettingId = 1 << 2,
	DescriptionOrValueMatch = 1 << 3,
	NonContiguousWordsInSettingsLabel = 1 << 4,
	ContiguousWordsInSettingsLabel = 1 << 5,
	ContiguousQueryInSettingId = 1 << 6,
	AllWordsInSettingsLabel = 1 << 7,
	ExactMatch = 1 << 8,
}
export const SettingKeyMatchTypes = (SettingMatchType.AllWordsInSettingsLabel
	| SettingMatchType.ContiguousWordsInSettingsLabel
	| SettingMatchType.NonContiguousWordsInSettingsLabel
	| SettingMatchType.NonContiguousQueryInSettingId
	| SettingMatchType.ContiguousQueryInSettingId);

export interface ISettingMatch {
	setting: ISetting;
	matches: IRange[] | null;
	matchType: SettingMatchType;
	keyMatchScore: number;
	score: number;
	providerName?: string;
}

export interface IScoredResults {
	[key: string]: IRemoteSetting;
}

export interface IRemoteSetting {
	score: number;
	key: string;
	id: string;
	defaultValue: string;
	description: string;
	packageId: string;
	extensionName?: string;
	extensionPublisher?: string;
}

export interface IFilterMetadata {
	requestUrl: string;
	requestBody: string;
	timestamp: number;
	duration: number;
	scoredResults: IScoredResults;

	/** The number of requests made, since requests are split by number of filters */
	requestCount?: number;

	/** The name of the server that actually served the request */
	context: string;
}

export interface IPreferencesEditorModel<T> {
	uri?: URI;
	getPreference(key: string): T | undefined;
	dispose(): void;
}

export type IGroupFilter = (group: ISettingsGroup) => boolean | null;
export type ISettingMatcher = (setting: ISetting, group: ISettingsGroup) => { matches: IRange[]; matchType: SettingMatchType; keyMatchScore: number; score: number } | null;

export interface ISettingsEditorModel extends IPreferencesEditorModel<ISetting> {
	readonly onDidChangeGroups: Event<void>;
	settingsGroups: ISettingsGroup[];
	filterSettings(filter: string, groupFilter: IGroupFilter, settingMatcher: ISettingMatcher): ISettingMatch[];
	updateResultGroup(id: string, resultGroup: ISearchResultGroup | undefined): IFilterResult | undefined;
}

export interface ISettingsEditorOptions extends IEditorOptions {
	target?: ConfigurationTarget;
	folderUri?: URI;
	query?: string;
	/**
	 * Only works when opening the json settings file. Use `query` for settings editor.
	 */
	revealSetting?: {
		key: string;
		edit?: boolean;
	};
	focusSearch?: boolean;
}

export interface IOpenSettingsOptions extends ISettingsEditorOptions {
	jsonEditor?: boolean;
	openToSide?: boolean;
	groupId?: number;
}

export function validateSettingsEditorOptions(options: ISettingsEditorOptions): ISettingsEditorOptions {
	return {
		// Inherit provided options
		...options,

		// Enforce some options for settings specifically
		override: DEFAULT_EDITOR_ASSOCIATION.id,
		pinned: true
	};
}

export interface IKeybindingsEditorModel<T> extends IPreferencesEditorModel<T> {
}

export interface IKeybindingsEditorOptions extends IEditorOptions {
	query?: string;
}

export interface IOpenKeybindingsEditorOptions extends IKeybindingsEditorOptions {
	groupId?: number;
}

export const IPreferencesService = createDecorator<IPreferencesService>('preferencesService');

export interface IPreferencesService {
	readonly _serviceBrand: undefined;

	readonly onDidDefaultSettingsContentChanged: Event<URI>;

	userSettingsResource: URI;
	workspaceSettingsResource: URI | null;
	getFolderSettingsResource(resource: URI): URI | null;

	createPreferencesEditorModel(uri: URI): Promise<IPreferencesEditorModel<ISetting> | null>;
	getDefaultSettingsContent(uri: URI): string | undefined;
	hasDefaultSettingsContent(uri: URI): boolean;
	createSettings2EditorModel(): Settings2EditorModel; // TODO

	openPreferences(): Promise<void>;

	openRawDefaultSettings(): Promise<IEditorPane | undefined>;
	openSettings(options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	openApplicationSettings(options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	openUserSettings(options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	openRemoteSettings(options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	openWorkspaceSettings(options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	openFolderSettings(options: IOpenSettingsOptions & { folderUri: IOpenSettingsOptions['folderUri'] }): Promise<IEditorPane | undefined>;
	openGlobalKeybindingSettings(textual: boolean, options?: IOpenKeybindingsEditorOptions): Promise<void>;
	openDefaultKeybindingsFile(): Promise<IEditorPane | undefined>;
	openLanguageSpecificSettings(languageId: string, options?: IOpenSettingsOptions): Promise<IEditorPane | undefined>;
	getEditableSettingsURI(configurationTarget: ConfigurationTarget, resource?: URI): Promise<URI | null>;
	getSetting(settingId: string): ISetting | undefined;

	createSplitJsonEditorInput(configurationTarget: ConfigurationTarget, resource: URI): EditorInput;
}

export interface KeybindingMatch {
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	keyCode?: boolean;
}

export interface KeybindingMatches {
	firstPart: KeybindingMatch;
	chordPart: KeybindingMatch;
}

export interface IKeybindingItemEntry {
	id: string;
	templateId: string;
	keybindingItem: IKeybindingItem;
	commandIdMatches?: IMatch[];
	commandLabelMatches?: IMatch[];
	commandDefaultLabelMatches?: IMatch[];
	sourceMatches?: IMatch[];
	extensionIdMatches?: IMatch[];
	extensionLabelMatches?: IMatch[];
	whenMatches?: IMatch[];
	keybindingMatches?: KeybindingMatches;
}

export interface IKeybindingItem {
	keybinding: ResolvedKeybinding;
	keybindingItem: ResolvedKeybindingItem;
	commandLabel: string;
	commandDefaultLabel: string;
	command: string;
	source: string | IExtensionDescription;
	when: string;
}

export interface IKeybindingsEditorPane extends IEditorPane {

	readonly activeKeybindingEntry: IKeybindingItemEntry | null;
	readonly onDefineWhenExpression: Event<IKeybindingItemEntry>;
	readonly onLayout: Event<void>;

	search(filter: string): void;
	focusSearch(): void;
	clearSearchResults(): void;
	focusKeybindings(): void;
	recordSearchKeys(): void;
	toggleSortByPrecedence(): void;
	selectKeybinding(keybindingEntry: IKeybindingItemEntry): void;
	defineKeybinding(keybindingEntry: IKeybindingItemEntry, add: boolean): Promise<void>;
	defineWhenExpression(keybindingEntry: IKeybindingItemEntry): void;
	updateKeybinding(keybindingEntry: IKeybindingItemEntry, key: string, when: string | undefined): Promise<any>;
	removeKeybinding(keybindingEntry: IKeybindingItemEntry): Promise<any>;
	resetKeybinding(keybindingEntry: IKeybindingItemEntry): Promise<any>;
	copyKeybinding(keybindingEntry: IKeybindingItemEntry): Promise<void>;
	copyKeybindingCommand(keybindingEntry: IKeybindingItemEntry): Promise<void>;
	showSimilarKeybindings(keybindingEntry: IKeybindingItemEntry): void;
}

export const DEFINE_KEYBINDING_EDITOR_CONTRIB_ID = 'editor.contrib.defineKeybinding';
export interface IDefineKeybindingEditorContribution extends IEditorContribution {
	showDefineKeybindingWidget(): void;
}

export const FOLDER_SETTINGS_PATH = '.vscode/settings.json';
export const DEFAULT_SETTINGS_EDITOR_SETTING = 'workbench.settings.openDefaultSettings';
export const USE_SPLIT_JSON_SETTING = 'workbench.settings.useSplitJSON';
export const ALWAYS_SHOW_ADVANCED_SETTINGS_SETTING = 'workbench.settings.alwaysShowAdvancedSettings';

export const SETTINGS_AUTHORITY = 'settings';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/common/preferencesEditorInput.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/common/preferencesEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Schemas } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IPreferencesService } from './preferences.js';
import { Settings2EditorModel } from './preferencesModels.js';

const SettingsEditorIcon = registerIcon('settings-editor-label-icon', Codicon.settings, nls.localize('settingsEditorLabelIcon', 'Icon of the settings editor label.'));

export class SettingsEditor2Input extends EditorInput {

	static readonly ID: string = 'workbench.input.settings2';
	private readonly _settingsModel: Settings2EditorModel;

	readonly resource: URI = URI.from({
		scheme: Schemas.vscodeSettings,
		path: `settingseditor`
	});

	constructor(
		@IPreferencesService _preferencesService: IPreferencesService,
	) {
		super();

		this._settingsModel = _preferencesService.createSettings2EditorModel();
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(otherInput) || otherInput instanceof SettingsEditor2Input;
	}

	override get typeId(): string {
		return SettingsEditor2Input.ID;
	}

	override getName(): string {
		return nls.localize('settingsEditor2InputName', "Settings");
	}

	override getIcon(): ThemeIcon {
		return SettingsEditorIcon;
	}

	override async resolve(): Promise<Settings2EditorModel> {
		return this._settingsModel;
	}

	override dispose(): void {
		this._settingsModel.dispose();

		super.dispose();
	}
}

const PreferencesEditorIcon = registerIcon('preferences-editor-label-icon', Codicon.settings, nls.localize('preferencesEditorLabelIcon', 'Icon of the preferences editor label.'));

export class PreferencesEditorInput extends EditorInput {

	static readonly ID: string = 'workbench.input.preferences';

	readonly resource: URI = URI.from({
		scheme: Schemas.vscodeSettings,
		path: `preferenceseditor`
	});

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(otherInput) || otherInput instanceof PreferencesEditorInput;
	}

	override get typeId(): string {
		return PreferencesEditorInput.ID;
	}

	override getName(): string {
		return nls.localize('preferencesEditorInputName', "Preferences");
	}

	override getIcon(): ThemeIcon {
		return PreferencesEditorIcon;
	}

	override async resolve(): Promise<null> {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/common/preferencesModels.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/common/preferencesModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { JSONVisitor, visit } from '../../../../base/common/json.js';
import { Disposable, IReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { ITextEditorModel } from '../../../../editor/common/services/resolverService.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationDefaultValueSource, ConfigurationScope, Extensions, IConfigurationNode, IConfigurationRegistry, IRegisteredConfigurationPropertySchema, OVERRIDE_PROPERTY_REGEX } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { IFilterMetadata, IFilterResult, IGroupFilter, IKeybindingsEditorModel, ISearchResultGroup, ISetting, ISettingMatch, ISettingMatcher, ISettingsEditorModel, ISettingsGroup, SettingMatchType } from './preferences.js';
import { FOLDER_SCOPES, WORKSPACE_SCOPES } from '../../configuration/common/configuration.js';
import { createValidator } from './preferencesValidation.js';

export const nullRange: IRange = { startLineNumber: -1, startColumn: -1, endLineNumber: -1, endColumn: -1 };
function isNullRange(range: IRange): boolean { return range.startLineNumber === -1 && range.startColumn === -1 && range.endLineNumber === -1 && range.endColumn === -1; }

abstract class AbstractSettingsModel extends EditorModel {

	protected _currentResultGroups = new Map<string, ISearchResultGroup>();

	updateResultGroup(id: string, resultGroup: ISearchResultGroup | undefined): IFilterResult | undefined {
		if (resultGroup) {
			this._currentResultGroups.set(id, resultGroup);
		} else {
			this._currentResultGroups.delete(id);
		}

		this.removeDuplicateResults();
		return this.update();
	}

	/**
	 * Remove duplicates between result groups, preferring results in earlier groups
	 */
	private removeDuplicateResults(): void {
		const settingKeys = new Set<string>();
		[...this._currentResultGroups.keys()]
			.sort((a, b) => this._currentResultGroups.get(a)!.order - this._currentResultGroups.get(b)!.order)
			.forEach(groupId => {
				const group = this._currentResultGroups.get(groupId)!;
				group.result.filterMatches = group.result.filterMatches.filter(s => !settingKeys.has(s.setting.key));
				group.result.filterMatches.forEach(s => settingKeys.add(s.setting.key));
			});
	}

	filterSettings(filter: string, groupFilter: IGroupFilter, settingMatcher: ISettingMatcher): ISettingMatch[] {
		const allGroups = this.filterGroups;

		const filterMatches: ISettingMatch[] = [];
		for (const group of allGroups) {
			const groupMatched = groupFilter(group);
			for (const section of group.sections) {
				for (const setting of section.settings) {
					const settingMatchResult = settingMatcher(setting, group);

					if (groupMatched || settingMatchResult) {
						filterMatches.push({
							setting,
							matches: settingMatchResult && settingMatchResult.matches,
							matchType: settingMatchResult?.matchType ?? SettingMatchType.None,
							keyMatchScore: settingMatchResult?.keyMatchScore ?? 0,
							score: settingMatchResult?.score ?? 0
						});
					}
				}
			}
		}

		return filterMatches;
	}

	getPreference(key: string): ISetting | undefined {
		for (const group of this.settingsGroups) {
			for (const section of group.sections) {
				for (const setting of section.settings) {
					if (key === setting.key) {
						return setting;
					}
				}
			}
		}

		return undefined;
	}

	protected collectMetadata(groups: ISearchResultGroup[]): IStringDictionary<IFilterMetadata> | null {
		const metadata = Object.create(null);
		let hasMetadata = false;
		groups.forEach(g => {
			if (g.result.metadata) {
				metadata[g.id] = g.result.metadata;
				hasMetadata = true;
			}
		});

		return hasMetadata ? metadata : null;
	}


	protected get filterGroups(): ISettingsGroup[] {
		return this.settingsGroups;
	}

	abstract settingsGroups: ISettingsGroup[];

	protected abstract update(): IFilterResult | undefined;
}

export class SettingsEditorModel extends AbstractSettingsModel implements ISettingsEditorModel {

	private _settingsGroups: ISettingsGroup[] | undefined;
	protected settingsModel: ITextModel;

	private readonly _onDidChangeGroups: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeGroups: Event<void> = this._onDidChangeGroups.event;

	constructor(reference: IReference<ITextEditorModel>, private _configurationTarget: ConfigurationTarget) {
		super();
		this.settingsModel = reference.object.textEditorModel!;
		this._register(this.onWillDispose(() => reference.dispose()));
		this._register(this.settingsModel.onDidChangeContent(() => {
			this._settingsGroups = undefined;
			this._onDidChangeGroups.fire();
		}));
	}

	get uri(): URI {
		return this.settingsModel.uri;
	}

	get configurationTarget(): ConfigurationTarget {
		return this._configurationTarget;
	}

	get settingsGroups(): ISettingsGroup[] {
		if (!this._settingsGroups) {
			this.parse();
		}
		return this._settingsGroups!;
	}

	get content(): string {
		return this.settingsModel.getValue();
	}

	protected isSettingsProperty(property: string, previousParents: string[]): boolean {
		return previousParents.length === 0; // Settings is root
	}

	protected parse(): void {
		this._settingsGroups = parse(this.settingsModel, (property: string, previousParents: string[]): boolean => this.isSettingsProperty(property, previousParents));
	}

	protected update(): IFilterResult | undefined {
		const resultGroups = [...this._currentResultGroups.values()];
		if (!resultGroups.length) {
			return undefined;
		}

		// Transform resultGroups into IFilterResult - ISetting ranges are already correct here
		const filteredSettings: ISetting[] = [];
		const matches: IRange[] = [];
		resultGroups.forEach(group => {
			group.result.filterMatches.forEach(filterMatch => {
				filteredSettings.push(filterMatch.setting);
				if (filterMatch.matches) {
					matches.push(...filterMatch.matches);
				}
			});
		});

		let filteredGroup: ISettingsGroup | undefined;
		const modelGroup = this.settingsGroups[0]; // Editable model has one or zero groups
		if (modelGroup) {
			filteredGroup = {
				id: modelGroup.id,
				range: modelGroup.range,
				sections: [{
					settings: filteredSettings
				}],
				title: modelGroup.title,
				titleRange: modelGroup.titleRange,
				order: modelGroup.order,
				extensionInfo: modelGroup.extensionInfo
			};
		}

		const metadata = this.collectMetadata(resultGroups);
		return {
			allGroups: this.settingsGroups,
			filteredGroups: filteredGroup ? [filteredGroup] : [],
			matches,
			metadata: metadata ?? undefined
		};
	}
}

export class Settings2EditorModel extends AbstractSettingsModel implements ISettingsEditorModel {
	private readonly _onDidChangeGroups: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeGroups: Event<void> = this._onDidChangeGroups.event;

	private additionalGroups: ISettingsGroup[] = [];
	private dirty = false;

	constructor(
		private _defaultSettings: DefaultSettings,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.source === ConfigurationTarget.DEFAULT) {
				this.dirty = true;
				this._onDidChangeGroups.fire();
			}
		}));
		this._register(Registry.as<IConfigurationRegistry>(Extensions.Configuration).onDidSchemaChange(e => {
			this.dirty = true;
			this._onDidChangeGroups.fire();
		}));
	}

	/** Doesn't include the "Commonly Used" group */
	protected override get filterGroups(): ISettingsGroup[] {
		return this.settingsGroups.slice(1);
	}

	get settingsGroups(): ISettingsGroup[] {
		const groups = this._defaultSettings.getSettingsGroups(this.dirty);
		this.dirty = false;
		return [...groups, ...this.additionalGroups];
	}

	/** For programmatically added groups outside of registered configurations */
	setAdditionalGroups(groups: ISettingsGroup[]) {
		this.additionalGroups = groups;
	}

	protected update(): IFilterResult {
		throw new Error('Not supported');
	}
}

function parse(model: ITextModel, isSettingsProperty: (currentProperty: string, previousParents: string[]) => boolean): ISettingsGroup[] {
	const settings: ISetting[] = [];
	let overrideSetting: ISetting | null = null;

	let currentProperty: string | null = null;
	let currentParent: any = [];
	const previousParents: any[] = [];
	let settingsPropertyIndex: number = -1;
	const range = {
		startLineNumber: 0,
		startColumn: 0,
		endLineNumber: 0,
		endColumn: 0
	};

	function onValue(value: any, offset: number, length: number) {
		if (Array.isArray(currentParent)) {
			(<any[]>currentParent).push(value);
		} else if (currentProperty) {
			currentParent[currentProperty] = value;
		}
		if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
			// settings value started
			const setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting!.overrides![overrideSetting!.overrides!.length - 1];
			if (setting) {
				const valueStartPosition = model.getPositionAt(offset);
				const valueEndPosition = model.getPositionAt(offset + length);
				setting.value = value;
				setting.valueRange = {
					startLineNumber: valueStartPosition.lineNumber,
					startColumn: valueStartPosition.column,
					endLineNumber: valueEndPosition.lineNumber,
					endColumn: valueEndPosition.column
				};
				setting.range = Object.assign(setting.range, {
					endLineNumber: valueEndPosition.lineNumber,
					endColumn: valueEndPosition.column
				});
			}
		}
	}
	const visitor: JSONVisitor = {
		onObjectBegin: (offset: number, length: number) => {
			if (isSettingsProperty(currentProperty!, previousParents)) {
				// Settings started
				settingsPropertyIndex = previousParents.length;
				const position = model.getPositionAt(offset);
				range.startLineNumber = position.lineNumber;
				range.startColumn = position.column;
			}
			const object = {};
			onValue(object, offset, length);
			currentParent = object;
			currentProperty = null;
			previousParents.push(currentParent);
		},
		onObjectProperty: (name: string, offset: number, length: number) => {
			currentProperty = name;
			if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
				// setting started
				const settingStartPosition = model.getPositionAt(offset);
				const setting: ISetting = {
					description: [],
					descriptionIsMarkdown: false,
					key: name,
					keyRange: {
						startLineNumber: settingStartPosition.lineNumber,
						startColumn: settingStartPosition.column + 1,
						endLineNumber: settingStartPosition.lineNumber,
						endColumn: settingStartPosition.column + length
					},
					range: {
						startLineNumber: settingStartPosition.lineNumber,
						startColumn: settingStartPosition.column,
						endLineNumber: 0,
						endColumn: 0
					},
					value: null,
					valueRange: nullRange,
					descriptionRanges: [],
					overrides: [],
					overrideOf: overrideSetting ?? undefined,
				};
				if (previousParents.length === settingsPropertyIndex + 1) {
					settings.push(setting);
					if (OVERRIDE_PROPERTY_REGEX.test(name)) {
						overrideSetting = setting;
					}
				} else {
					overrideSetting!.overrides!.push(setting);
				}
			}
		},
		onObjectEnd: (offset: number, length: number) => {
			currentParent = previousParents.pop();
			if (settingsPropertyIndex !== -1 && (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null))) {
				// setting ended
				const setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting!.overrides![overrideSetting!.overrides!.length - 1];
				if (setting) {
					const valueEndPosition = model.getPositionAt(offset + length);
					setting.valueRange = Object.assign(setting.valueRange, {
						endLineNumber: valueEndPosition.lineNumber,
						endColumn: valueEndPosition.column
					});
					setting.range = Object.assign(setting.range, {
						endLineNumber: valueEndPosition.lineNumber,
						endColumn: valueEndPosition.column
					});
				}

				if (previousParents.length === settingsPropertyIndex + 1) {
					overrideSetting = null;
				}
			}
			if (previousParents.length === settingsPropertyIndex) {
				// settings ended
				const position = model.getPositionAt(offset);
				range.endLineNumber = position.lineNumber;
				range.endColumn = position.column;
				settingsPropertyIndex = -1;
			}
		},
		onArrayBegin: (offset: number, length: number) => {
			const array: any[] = [];
			onValue(array, offset, length);
			previousParents.push(currentParent);
			currentParent = array;
			currentProperty = null;
		},
		onArrayEnd: (offset: number, length: number) => {
			currentParent = previousParents.pop();
			if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
				// setting value ended
				const setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting!.overrides![overrideSetting!.overrides!.length - 1];
				if (setting) {
					const valueEndPosition = model.getPositionAt(offset + length);
					setting.valueRange = Object.assign(setting.valueRange, {
						endLineNumber: valueEndPosition.lineNumber,
						endColumn: valueEndPosition.column
					});
					setting.range = Object.assign(setting.range, {
						endLineNumber: valueEndPosition.lineNumber,
						endColumn: valueEndPosition.column
					});
				}
			}
		},
		onLiteralValue: onValue,
		onError: (error) => {
			const setting = settings[settings.length - 1];
			if (setting && (isNullRange(setting.range) || isNullRange(setting.keyRange) || isNullRange(setting.valueRange))) {
				settings.pop();
			}
		}
	};
	if (!model.isDisposed()) {
		visit(model.getValue(), visitor);
	}
	return settings.length > 0 ? [{
		id: model.isDisposed() ? '' : model.id,
		sections: [
			{
				settings
			}
		],
		title: '',
		titleRange: nullRange,
		range
	} satisfies ISettingsGroup] : [];
}

export class WorkspaceConfigurationEditorModel extends SettingsEditorModel {

	private _configurationGroups: ISettingsGroup[] = [];

	get configurationGroups(): ISettingsGroup[] {
		return this._configurationGroups;
	}

	protected override parse(): void {
		super.parse();
		this._configurationGroups = parse(this.settingsModel, (property: string, previousParents: string[]): boolean => previousParents.length === 0);
	}

	protected override isSettingsProperty(property: string, previousParents: string[]): boolean {
		return property === 'settings' && previousParents.length === 1;
	}

}

export class DefaultSettings extends Disposable {

	private _allSettingsGroups: ISettingsGroup[] | undefined;
	private _content: string | undefined;
	private _contentWithoutMostCommonlyUsed: string | undefined;
	private _settingsByName = new Map<string, ISetting>();

	private readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(
		private _mostCommonlyUsedSettingsKeys: string[],
		readonly target: ConfigurationTarget,
		readonly configurationService: IConfigurationService
	) {
		super();
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.source === ConfigurationTarget.DEFAULT) {
				this.reset();
				this._onDidChange.fire();
			}
		}));
	}

	getContent(forceUpdate = false): string {
		if (!this._content || forceUpdate) {
			this.initialize();
		}

		return this._content!;
	}

	getContentWithoutMostCommonlyUsed(forceUpdate = false): string {
		if (!this._contentWithoutMostCommonlyUsed || forceUpdate) {
			this.initialize();
		}

		return this._contentWithoutMostCommonlyUsed!;
	}

	getSettingsGroups(forceUpdate = false): ISettingsGroup[] {
		if (!this._allSettingsGroups || forceUpdate) {
			this.initialize();
		}

		return this._allSettingsGroups!;
	}

	private initialize(): void {
		this._allSettingsGroups = this.parse();
		this._content = this.toContent(this._allSettingsGroups, 0);
		this._contentWithoutMostCommonlyUsed = this.toContent(this._allSettingsGroups, 1);
	}

	private reset(): void {
		this._content = undefined;
		this._contentWithoutMostCommonlyUsed = undefined;
		this._allSettingsGroups = undefined;
	}

	private parse(): ISettingsGroup[] {
		const settingsGroups = this.getRegisteredGroups();
		this.initAllSettingsMap(settingsGroups);
		const mostCommonlyUsed = this.getMostCommonlyUsedSettings();
		return [mostCommonlyUsed, ...settingsGroups];
	}

	getRegisteredGroups(): ISettingsGroup[] {
		const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		const allConfigurations: IStringDictionary<IRegisteredConfigurationPropertySchema> = { ...registry.getConfigurationProperties() };
		const excludedConfigurations = registry.getExcludedConfigurationProperties();

		for (const policyKey of this.configurationService.keys().policy ?? []) {
			const policyConfiguration = excludedConfigurations[policyKey];
			if (policyConfiguration) {
				allConfigurations[policyKey] = policyConfiguration;
			}
		}

		const groups = this.removeEmptySettingsGroups(this.parseProperties(allConfigurations).sort(this.compareGroups));
		return this.sortGroups(groups);
	}

	private sortGroups(groups: ISettingsGroup[]): ISettingsGroup[] {
		groups.forEach(group => {
			group.sections.forEach(section => {
				section.settings.sort((a, b) => a.key.localeCompare(b.key));
			});
		});

		return groups;
	}

	private initAllSettingsMap(allSettingsGroups: ISettingsGroup[]): void {
		this._settingsByName = new Map<string, ISetting>();
		for (const group of allSettingsGroups) {
			for (const section of group.sections) {
				for (const setting of section.settings) {
					this._settingsByName.set(setting.key, setting);
				}
			}
		}
	}

	private getMostCommonlyUsedSettings(): ISettingsGroup {
		const settings = coalesce(this._mostCommonlyUsedSettingsKeys.map(key => {
			const setting = this._settingsByName.get(key);
			if (setting) {
				return {
					description: setting.description,
					key: setting.key,
					value: setting.value,
					keyRange: nullRange,
					range: nullRange,
					valueRange: nullRange,
					overrides: [],
					scope: ConfigurationScope.RESOURCE,
					type: setting.type,
					enum: setting.enum,
					enumDescriptions: setting.enumDescriptions,
					descriptionRanges: []
				} satisfies ISetting;
			}
			return null;
		}));

		return {
			id: 'mostCommonlyUsed',
			range: nullRange,
			title: nls.localize('commonlyUsed', "Commonly Used"),
			titleRange: nullRange,
			sections: [
				{
					settings
				}
			]
		} satisfies ISettingsGroup;
	}

	private parseProperties(properties: IStringDictionary<IRegisteredConfigurationPropertySchema>): ISettingsGroup[] {
		const result: ISettingsGroup[] = [];
		const byTitle = new Map<string, ISettingsGroup[]>();
		const byId = new Map<string, ISettingsGroup[]>();
		for (const [key, property] of Object.entries(properties)) {
			if (!property.section) {
				continue;
			}

			let settingsGroup: ISettingsGroup | undefined;

			if (property.section.title) {
				const groups = byTitle.get(property.section.title);
				if (groups) {
					const extensionId = property.section.extensionInfo?.id;
					settingsGroup = groups.find(g => g.extensionInfo?.id === extensionId);
				}
			}

			if (!settingsGroup && property.section.id) {
				const groups = byId.get(property.section.id);
				if (groups) {
					const extensionId = property.section.extensionInfo?.id;
					settingsGroup = groups.find(g => g.extensionInfo?.id === extensionId && !g.title);
				}
				if (settingsGroup && !settingsGroup?.title && property.section.title) {
					settingsGroup.title = property.section.title;
					const byTitleGroups = byTitle.get(property.section.title);
					if (byTitleGroups) {
						byTitleGroups.push(settingsGroup);
					} else {
						byTitle.set(property.section.title, [settingsGroup]);
					}
				}
			}

			if (!settingsGroup) {
				settingsGroup = { sections: [{ title: property.section.title, settings: [] }], id: property.section.id || '', title: property.section.title ?? '', titleRange: nullRange, order: property.section.order, range: nullRange, extensionInfo: property.source };
				result.push(settingsGroup);
				if (property.section.title) {
					const byTitleGroups = byTitle.get(property.section.title);
					if (byTitleGroups) {
						byTitleGroups.push(settingsGroup);
					} else {
						byTitle.set(property.section.title, [settingsGroup]);
					}
				}
				if (property.section.id) {
					const byIdGroups = byId.get(property.section.id);
					if (byIdGroups) {
						byIdGroups.push(settingsGroup);
					} else {
						byId.set(property.section.id, [settingsGroup]);
					}
				}
			}

			const setting = this.parseSetting(key, property);
			if (setting) {
				settingsGroup.sections[0].settings.push(setting);
			}
		}
		return result;
	}

	private removeEmptySettingsGroups(settingsGroups: ISettingsGroup[]): ISettingsGroup[] {
		const result: ISettingsGroup[] = [];
		for (const settingsGroup of settingsGroups) {
			settingsGroup.sections = settingsGroup.sections.filter(section => section.settings.length > 0);
			if (settingsGroup.sections.length) {
				result.push(settingsGroup);
			}
		}
		return result;
	}

	private parseSetting(key: string, prop: IRegisteredConfigurationPropertySchema): ISetting | undefined {
		if (!this.matchesScope(prop)) {
			return undefined;
		}

		const value = prop.default;
		let description = (prop.markdownDescription || prop.description || '');
		if (typeof description !== 'string') {
			description = '';
		}
		const descriptionLines = description.split('\n');
		const overrides = OVERRIDE_PROPERTY_REGEX.test(key) ? this.parseOverrideSettings(prop.default) : [];
		let listItemType: string | undefined;
		if (prop.type === 'array' && prop.items && !Array.isArray(prop.items) && prop.items.type) {
			if (prop.items.enum) {
				listItemType = 'enum';
			} else if (!Array.isArray(prop.items.type)) {
				listItemType = prop.items.type;
			}
		}

		const objectProperties = prop.type === 'object' ? prop.properties : undefined;
		const objectPatternProperties = prop.type === 'object' ? prop.patternProperties : undefined;
		const objectAdditionalProperties = prop.type === 'object' ? prop.additionalProperties : undefined;

		let enumToUse = prop.enum;
		let enumDescriptions = prop.markdownEnumDescriptions ?? prop.enumDescriptions;
		let enumDescriptionsAreMarkdown = !!prop.markdownEnumDescriptions;
		if (listItemType === 'enum' && !Array.isArray(prop.items)) {
			enumToUse = prop.items!.enum;
			enumDescriptions = prop.items!.markdownEnumDescriptions ?? prop.items!.enumDescriptions;
			enumDescriptionsAreMarkdown = !!prop.items!.markdownEnumDescriptions;
		}

		let allKeysAreBoolean = false;
		if (prop.type === 'object' && !prop.additionalProperties && prop.properties && Object.keys(prop.properties).length) {
			allKeysAreBoolean = Object.keys(prop.properties).every(key => {
				return prop.properties![key].type === 'boolean';
			});
		}

		let isLanguageTagSetting = false;
		if (OVERRIDE_PROPERTY_REGEX.test(key)) {
			isLanguageTagSetting = true;
		}

		let defaultValueSource: ConfigurationDefaultValueSource | undefined;
		if (!isLanguageTagSetting) {
			const registeredConfigurationProp = prop as IRegisteredConfigurationPropertySchema;
			if (registeredConfigurationProp && registeredConfigurationProp.defaultValueSource) {
				defaultValueSource = registeredConfigurationProp.defaultValueSource;
			}
		}

		if (!enumToUse && (prop.enumItemLabels || enumDescriptions || enumDescriptionsAreMarkdown)) {
			console.error(`The setting ${key} has enum-related fields, but doesn't have an enum field. This setting may render improperly in the Settings editor.`);
		}

		return {
			key,
			value,
			description: descriptionLines,
			descriptionIsMarkdown: !!prop.markdownDescription,
			range: nullRange,
			keyRange: nullRange,
			valueRange: nullRange,
			descriptionRanges: [],
			overrides,
			scope: prop.scope,
			type: prop.type,
			arrayItemType: listItemType,
			objectProperties,
			objectPatternProperties,
			objectAdditionalProperties,
			enum: enumToUse,
			enumDescriptions: enumDescriptions,
			enumDescriptionsAreMarkdown: enumDescriptionsAreMarkdown,
			enumItemLabels: prop.enumItemLabels,
			uniqueItems: prop.uniqueItems,
			tags: prop.tags,
			disallowSyncIgnore: prop.disallowSyncIgnore,
			restricted: prop.restricted,
			extensionInfo: prop.source,
			deprecationMessage: prop.markdownDeprecationMessage || prop.deprecationMessage,
			deprecationMessageIsMarkdown: !!prop.markdownDeprecationMessage,
			validator: createValidator(prop),
			allKeysAreBoolean,
			editPresentation: prop.editPresentation,
			order: prop.order,
			nonLanguageSpecificDefaultValueSource: defaultValueSource,
			isLanguageTagSetting,
			categoryLabel: prop.source?.id === prop.section?.id ? prop.title : prop.section?.id
		};
	}

	private parseOverrideSettings(overrideSettings: any): ISetting[] {
		return Object.keys(overrideSettings).map((key) => ({
			key,
			value: overrideSettings[key],
			description: [],
			descriptionIsMarkdown: false,
			range: nullRange,
			keyRange: nullRange,
			valueRange: nullRange,
			descriptionRanges: [],
			overrides: []
		}));
	}

	private matchesScope(property: IConfigurationNode): boolean {
		if (!property.scope) {
			return true;
		}
		if (this.target === ConfigurationTarget.WORKSPACE_FOLDER) {
			return FOLDER_SCOPES.indexOf(property.scope) !== -1;
		}
		if (this.target === ConfigurationTarget.WORKSPACE) {
			return WORKSPACE_SCOPES.indexOf(property.scope) !== -1;
		}
		return true;
	}

	private compareGroups(c1: ISettingsGroup, c2: ISettingsGroup): number {
		if (typeof c1?.order !== 'number') {
			return 1;
		}
		if (typeof c2?.order !== 'number') {
			return -1;
		}
		if (c1.order === c2.order) {
			const title1 = c1.title || '';
			const title2 = c2.title || '';
			return title1.localeCompare(title2);
		}
		return c1.order - c2.order;
	}

	private toContent(settingsGroups: ISettingsGroup[], startIndex: number): string {
		const builder = new SettingsContentBuilder();
		for (let i = startIndex; i < settingsGroups.length; i++) {
			builder.pushGroup(settingsGroups[i], i === startIndex, i === settingsGroups.length - 1);
		}
		return builder.getContent();
	}

}

export class DefaultSettingsEditorModel extends AbstractSettingsModel implements ISettingsEditorModel {

	private _model: ITextModel;

	private readonly _onDidChangeGroups: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeGroups: Event<void> = this._onDidChangeGroups.event;

	constructor(
		private _uri: URI,
		reference: IReference<ITextEditorModel>,
		private readonly defaultSettings: DefaultSettings
	) {
		super();

		this._register(defaultSettings.onDidChange(() => this._onDidChangeGroups.fire()));
		this._model = reference.object.textEditorModel!;
		this._register(this.onWillDispose(() => reference.dispose()));
	}

	get uri(): URI {
		return this._uri;
	}

	get target(): ConfigurationTarget {
		return this.defaultSettings.target;
	}

	get settingsGroups(): ISettingsGroup[] {
		return this.defaultSettings.getSettingsGroups();
	}

	protected override get filterGroups(): ISettingsGroup[] {
		// Don't look at "commonly used" for filter
		return this.settingsGroups.slice(1);
	}

	protected update(): IFilterResult | undefined {
		if (this._model.isDisposed()) {
			return undefined;
		}

		// Grab current result groups, only render non-empty groups
		const resultGroups = [...this._currentResultGroups.values()]
			.sort((a, b) => a.order - b.order);
		const nonEmptyResultGroups = resultGroups.filter(group => group.result.filterMatches.length);

		const startLine = this.settingsGroups.at(-1)!.range.endLineNumber + 2;
		const { settingsGroups: filteredGroups, matches } = this.writeResultGroups(nonEmptyResultGroups, startLine);

		const metadata = this.collectMetadata(resultGroups);
		return resultGroups.length ?
			{
				allGroups: this.settingsGroups,
				filteredGroups,
				matches,
				metadata: metadata ?? undefined
			} :
			undefined;
	}

	/**
	 * Translate the ISearchResultGroups to text, and write it to the editor model
	 */
	private writeResultGroups(groups: ISearchResultGroup[], startLine: number): { matches: IRange[]; settingsGroups: ISettingsGroup[] } {
		const contentBuilderOffset = startLine - 1;
		const builder = new SettingsContentBuilder(contentBuilderOffset);

		const settingsGroups: ISettingsGroup[] = [];
		const matches: IRange[] = [];
		if (groups.length) {
			builder.pushLine(',');
			groups.forEach(resultGroup => {
				const settingsGroup = this.getGroup(resultGroup);
				settingsGroups.push(settingsGroup);
				matches.push(...this.writeSettingsGroupToBuilder(builder, settingsGroup, resultGroup.result.filterMatches));
			});
		}

		// note: 1-indexed line numbers here
		const groupContent = builder.getContent() + '\n';
		const groupEndLine = this._model.getLineCount();
		const cursorPosition = new Selection(startLine, 1, startLine, 1);
		const edit: ISingleEditOperation = {
			text: groupContent,
			forceMoveMarkers: true,
			range: new Range(startLine, 1, groupEndLine, 1)
		};

		this._model.pushEditOperations([cursorPosition], [edit], () => [cursorPosition]);

		// Force tokenization now - otherwise it may be slightly delayed, causing a flash of white text
		const tokenizeTo = Math.min(startLine + 60, this._model.getLineCount());
		this._model.tokenization.forceTokenization(tokenizeTo);

		return { matches, settingsGroups };
	}

	private writeSettingsGroupToBuilder(builder: SettingsContentBuilder, settingsGroup: ISettingsGroup, filterMatches: ISettingMatch[]): IRange[] {
		filterMatches = filterMatches
			.map(filteredMatch => {
				// Fix match ranges to offset from setting start line
				return {
					setting: filteredMatch.setting,
					score: filteredMatch.score,
					matchType: filteredMatch.matchType,
					keyMatchScore: filteredMatch.keyMatchScore,
					matches: filteredMatch.matches && filteredMatch.matches.map(match => {
						return new Range(
							match.startLineNumber - filteredMatch.setting.range.startLineNumber,
							match.startColumn,
							match.endLineNumber - filteredMatch.setting.range.startLineNumber,
							match.endColumn);
					})
				};
			});

		builder.pushGroup(settingsGroup);

		// builder has rewritten settings ranges, fix match ranges
		const fixedMatches = filterMatches
			.map(m => m.matches || [])
			.flatMap((settingMatches, i) => {
				const setting = settingsGroup.sections[0].settings[i];
				return settingMatches.map(range => {
					return new Range(
						range.startLineNumber + setting.range.startLineNumber,
						range.startColumn,
						range.endLineNumber + setting.range.startLineNumber,
						range.endColumn);
				});
			});

		return fixedMatches;
	}

	private copySetting(setting: ISetting): ISetting {
		return {
			description: setting.description,
			scope: setting.scope,
			type: setting.type,
			enum: setting.enum,
			enumDescriptions: setting.enumDescriptions,
			key: setting.key,
			value: setting.value,
			range: setting.range,
			overrides: [],
			overrideOf: setting.overrideOf,
			tags: setting.tags,
			deprecationMessage: setting.deprecationMessage,
			keyRange: nullRange,
			valueRange: nullRange,
			descriptionIsMarkdown: undefined,
			descriptionRanges: []
		};
	}

	override getPreference(key: string): ISetting | undefined {
		for (const group of this.settingsGroups) {
			for (const section of group.sections) {
				for (const setting of section.settings) {
					if (setting.key === key) {
						return setting;
					}
				}
			}
		}
		return undefined;
	}

	private getGroup(resultGroup: ISearchResultGroup): ISettingsGroup {
		return {
			id: resultGroup.id,
			range: nullRange,
			title: resultGroup.label,
			titleRange: nullRange,
			sections: [
				{
					settings: resultGroup.result.filterMatches.map(m => this.copySetting(m.setting))
				}
			]
		};
	}
}

class SettingsContentBuilder {
	private _contentByLines: string[];

	private get lineCountWithOffset(): number {
		return this._contentByLines.length + this._rangeOffset;
	}

	private get lastLine(): string {
		return this._contentByLines[this._contentByLines.length - 1] || '';
	}

	constructor(private _rangeOffset = 0) {
		this._contentByLines = [];
	}

	pushLine(...lineText: string[]): void {
		this._contentByLines.push(...lineText);
	}

	pushGroup(settingsGroups: ISettingsGroup, isFirst?: boolean, isLast?: boolean): void {
		this._contentByLines.push(isFirst ? '[{' : '{');
		const lastSetting = this._pushGroup(settingsGroups, '  ');

		if (lastSetting) {
			// Strip the comma from the last setting
			const lineIdx = lastSetting.range.endLineNumber - this._rangeOffset;
			const content = this._contentByLines[lineIdx - 2];
			this._contentByLines[lineIdx - 2] = content.substring(0, content.length - 1);
		}

		this._contentByLines.push(isLast ? '}]' : '},');
	}

	protected _pushGroup(group: ISettingsGroup, indent: string): ISetting | null {
		let lastSetting: ISetting | null = null;
		const groupStart = this.lineCountWithOffset + 1;
		for (const section of group.sections) {
			if (section.title) {
				this.addDescription([section.title], indent, this._contentByLines);
			}

			if (section.settings.length) {
				for (const setting of section.settings) {
					this.pushSetting(setting, indent);
					lastSetting = setting;
				}
			}

		}
		group.range = { startLineNumber: groupStart, startColumn: 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length };
		return lastSetting;
	}

	getContent(): string {
		return this._contentByLines.join('\n');
	}

	private pushSetting(setting: ISetting, indent: string): void {
		const settingStart = this.lineCountWithOffset + 1;

		this.pushSettingDescription(setting, indent);

		let preValueContent = indent;
		const keyString = JSON.stringify(setting.key);
		preValueContent += keyString;
		setting.keyRange = { startLineNumber: this.lineCountWithOffset + 1, startColumn: preValueContent.indexOf(setting.key) + 1, endLineNumber: this.lineCountWithOffset + 1, endColumn: setting.key.length };

		preValueContent += ': ';
		const valueStart = this.lineCountWithOffset + 1;
		this.pushValue(setting, preValueContent, indent);

		setting.valueRange = { startLineNumber: valueStart, startColumn: preValueContent.length + 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length + 1 };
		this._contentByLines[this._contentByLines.length - 1] += ',';
		this._contentByLines.push('');
		setting.range = { startLineNumber: settingStart, startColumn: 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length };
	}

	private pushSettingDescription(setting: ISetting, indent: string): void {
		const fixSettingLink = (line: string) => line.replace(/`#(.*)#`/g, (match, settingName) => `\`${settingName}\``);

		setting.descriptionRanges = [];
		const descriptionPreValue = indent + '// ';
		const deprecationMessageLines = setting.deprecationMessage?.split(/\n/g) ?? [];
		for (let line of [...deprecationMessageLines, ...setting.description]) {
			line = fixSettingLink(line);

			this._contentByLines.push(descriptionPreValue + line);
			setting.descriptionRanges.push({ startLineNumber: this.lineCountWithOffset, startColumn: this.lastLine.indexOf(line) + 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length });
		}

		if (setting.enum && setting.enumDescriptions?.some(desc => !!desc)) {
			setting.enumDescriptions.forEach((desc, i) => {
				const displayEnum = escapeInvisibleChars(String(setting.enum![i]));
				const line = desc ?
					`${displayEnum}: ${fixSettingLink(desc)}` :
					displayEnum;

				const lines = line.split(/\n/g);
				lines[0] = ' - ' + lines[0];
				this._contentByLines.push(...lines.map(l => `${indent}// ${l}`));

				setting.descriptionRanges.push({ startLineNumber: this.lineCountWithOffset, startColumn: this.lastLine.indexOf(line) + 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length });
			});
		}
	}

	private pushValue(setting: ISetting, preValueConent: string, indent: string): void {
		const valueString = JSON.stringify(setting.value, null, indent);
		if (valueString && (typeof setting.value === 'object')) {
			if (setting.overrides && setting.overrides.length) {
				this._contentByLines.push(preValueConent + ' {');
				for (const subSetting of setting.overrides) {
					this.pushSetting(subSetting, indent + indent);
					this._contentByLines.pop();
				}
				const lastSetting = setting.overrides[setting.overrides.length - 1];
				const content = this._contentByLines[lastSetting.range.endLineNumber - 2];
				this._contentByLines[lastSetting.range.endLineNumber - 2] = content.substring(0, content.length - 1);
				this._contentByLines.push(indent + '}');
			} else {
				const mulitLineValue = valueString.split('\n');
				this._contentByLines.push(preValueConent + mulitLineValue[0]);
				for (let i = 1; i < mulitLineValue.length; i++) {
					this._contentByLines.push(indent + mulitLineValue[i]);
				}
			}
		} else {
			this._contentByLines.push(preValueConent + valueString);
		}
	}

	private addDescription(description: string[], indent: string, result: string[]) {
		for (const line of description) {
			result.push(indent + '// ' + line);
		}
	}
}

class RawSettingsContentBuilder extends SettingsContentBuilder {

	constructor(private indent: string = '\t') {
		super(0);
	}

	override pushGroup(settingsGroups: ISettingsGroup): void {
		this._pushGroup(settingsGroups, this.indent);
	}

}

export class DefaultRawSettingsEditorModel extends Disposable {

	private _content: string | null = null;

	private readonly _onDidContentChanged = this._register(new Emitter<void>());
	readonly onDidContentChanged = this._onDidContentChanged.event;

	constructor(private defaultSettings: DefaultSettings) {
		super();
		this._register(defaultSettings.onDidChange(() => {
			this._content = null;
			this._onDidContentChanged.fire();
		}));
	}

	get content(): string {
		if (this._content === null) {
			const builder = new RawSettingsContentBuilder();
			builder.pushLine('{');
			for (const settingsGroup of this.defaultSettings.getRegisteredGroups()) {
				builder.pushGroup(settingsGroup);
			}
			builder.pushLine('}');
			this._content = builder.getContent();
		}
		return this._content;
	}
}

function escapeInvisibleChars(enumValue: string): string {
	return enumValue && enumValue
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r');
}

export function defaultKeybindingsContents(keybindingService: IKeybindingService): string {
	const defaultsHeader = '// ' + nls.localize('defaultKeybindingsHeader', "Override key bindings by placing them into your key bindings file.");
	return defaultsHeader + '\n' + keybindingService.getDefaultKeybindingsContent();
}

export class DefaultKeybindingsEditorModel implements IKeybindingsEditorModel<any> {

	private _content: string | undefined;

	constructor(private _uri: URI,
		@IKeybindingService private readonly keybindingService: IKeybindingService) {
	}

	get uri(): URI {
		return this._uri;
	}

	get content(): string {
		if (!this._content) {
			this._content = defaultKeybindingsContents(this.keybindingService);
		}
		return this._content;
	}

	getPreference(): any {
		return null;
	}

	dispose(): void {
		// Not disposable
	}
}
```

--------------------------------------------------------------------------------

````

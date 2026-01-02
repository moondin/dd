---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 339
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 339 of 552)

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

---[FILE: src/vs/workbench/browser/parts/views/media/views.css]---
Location: vscode-main/src/vs/workbench/browser/parts/views/media/views.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* File icons in trees */

.file-icon-themable-tree.align-icons-and-twisties .monaco-tl-twistie:not(.force-twistie):not(.collapsible),
.file-icon-themable-tree .align-icon-with-twisty .monaco-tl-twistie:not(.force-twistie):not(.collapsible),
.file-icon-themable-tree.hide-arrows .monaco-tl-twistie:not(.force-twistie),
.file-icon-themable-tree .monaco-tl-twistie.force-no-twistie {
	background-image: none !important;
	width: 0 !important;
	padding-right: 0 !important;
	visibility: hidden;
}

/* Misc */

.file-icon-themable-tree .monaco-list-row .content .monaco-highlighted-label .highlight,
.pane-body .monaco-tl-contents .monaco-highlighted-label .highlight {
	color: unset !important;
	background-color: var(--vscode-list-filterMatchBackground);
	outline: 1px dotted var(--vscode-list-filterMatchBorder);
	outline-offset: -1px;
}

.monaco-workbench .tree-explorer-viewlet-tree-view {
	height: 100%;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message {
	display: flex;
	padding: 4px 12px 4px 18px;
	user-select: text;
	-webkit-user-select: text;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message p {
	margin-top: 0px;
	margin-bottom: 0px;
	padding-bottom: 4px;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message ul {
	padding-left: 24px;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message p > a {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message .rendered-message {
	width: 100%;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message .button-container {
	width: 100%;
	max-width: 300px;
	margin: auto;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .message .button-container:not(:last-child) {
	padding-bottom: 8px;
}
.monaco-workbench .tree-explorer-viewlet-tree-view .message.hide {
	display: none;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .customview-tree {
	height: 100%;
}

.monaco-workbench .tree-explorer-viewlet-tree-view .customview-tree.hide {
	display: none;
}

.monaco-workbench .pane > .pane-body > .welcome-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.monaco-workbench .pane > .pane-body:not(.welcome) > .welcome-view,
.monaco-workbench .pane > .pane-body.welcome > :not(.welcome-view) {
	display: none;
}

.monaco-workbench .pane > .pane-body .welcome-view-content {
	display: flex;
	flex-direction: column;
	padding: 0 20px 1em 20px;
	box-sizing: border-box;
	align-items: center;
}

.monaco-workbench .pane > .pane-body .welcome-view-content > .button-container {
	width: 100%;
	max-width: 300px;
}

.monaco-workbench.monaco-enable-motion .pane > .pane-body .welcome-view-content > .button-container {
	transition: 0.2s max-width ease-out;
}

.monaco-workbench .pane > .pane-body .welcome-view-content.wide > .button-container {
	max-width: 100%;
}

.monaco-workbench .pane > .pane-body .welcome-view-content > .button-container > .monaco-button {
	max-width: 300px;
}

.monaco-workbench .pane > .pane-body .tree-explorer-viewlet-tree-view > .message .button-container > .monaco-button span,
.monaco-workbench .pane > .pane-body .tree-explorer-viewlet-tree-view > .message .button-container > .monaco-button span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .pane > .pane-body .welcome-view-content > p {
	width: 100%;
}

.monaco-workbench .pane > .pane-body .welcome-view-content > * {
	margin-block-start: 1em;
	margin-block-end: 0;
	margin-inline-start: 0px;
	margin-inline-end: 0px;
}

.monaco-workbench .pane > .pane-body .welcome-view-content > p .codicon[class*='codicon-'] {
	font-size: 13px;
	line-height: 1.4em;
	vertical-align: bottom;
}

.customview-tree .monaco-list-row .monaco-tl-contents.align-icon-with-twisty::before {
	display: none;
}

.customview-tree .monaco-list-row .monaco-tl-contents:not(.align-icon-with-twisty)::before {
	display: inline-block;
}

.customview-tree .monaco-list .monaco-list-row {
	padding-right: 12px;
	padding-left: 0px;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item {
	display: flex;
	height: 22px;
	line-height: 22px;
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
	flex-wrap: nowrap;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item.no-twisty {
	padding-left: 3px;
}

.customview-tree .monaco-list .monaco-list-row.selected .custom-view-tree-node-item .custom-view-tree-node-item-checkbox {
	background-color: var(--vscode-checkbox-selectBackground);
	border: 1px solid var(--vscode-checkbox-selectBorder);
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-checkbox {
	width: 16px;
	height: 16px;
	margin: 3px 6px 3px 0px;
	padding: 0px;
	border: 1px solid var(--vscode-checkbox-border);
	opacity: 1;
	background-color: var(--vscode-checkbox-background);
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-checkbox.codicon {
	font-size: 13px;
	line-height: 15px;
}
.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .monaco-inputbox {
	line-height: normal;
	flex: 1;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-resourceLabel {
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-resourceLabel .monaco-highlighted-label .codicon {
	position: relative;
	top: 2px;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .monaco-icon-label-container::after {
	content: '';
	display: block;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item > .custom-view-tree-node-item-icon,
.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item > .custom-view-tree-node-item-resourceLabel > .custom-view-tree-node-item-icon {
	background-size: 16px;
	background-position: left center;
	background-repeat: no-repeat;
	padding-right: 6px;
	width: 16px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item > .custom-view-tree-node-item-resourceLabel > .custom-view-tree-node-item-icon.disabled {
	opacity: 0.6;
}
/* makes spinning icons square */
.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item > .custom-view-tree-node-item-resourceLabel > .custom-view-tree-node-item-icon.codicon.codicon-modifier-spin {
	padding-left: 6px;
	margin-left: -6px;
}

.customview-tree .monaco-list .monaco-list-row.selected .custom-view-tree-node-item > .custom-view-tree-node-item-resourceLabel > .custom-view-tree-node-item-icon.codicon {
	color: currentColor !important;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-resourceLabel .monaco-icon-label-container > .monaco-icon-name-container {
	flex: 1;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .custom-view-tree-node-item-resourceLabel::after {
	padding-right: 0px;
	margin-right: 4px;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .actions {
	display: none;
}

.customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .actions .action-label {
	padding: 2px;
}

.customview-tree .monaco-list .monaco-list-row:hover .custom-view-tree-node-item .actions,
.customview-tree .monaco-list .monaco-list-row.selected .custom-view-tree-node-item .actions,
.customview-tree .monaco-list .monaco-list-row.focused .custom-view-tree-node-item .actions {
	display: block;
}

/* filter view pane */

.monaco-workbench .auxiliarybar.pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .action-item.viewpane-filter-container {
	max-width: inherit;
}

.viewpane-filter-container {
	cursor: default;
	display: flex;
}

.viewpane-filter-container.grow {
	flex: 1;
}

.viewpane-filter-container > .viewpane-filter {
	display: flex;
	align-items: center;
	flex: 1;
	position: relative;
}

.viewpane-filter-container > .viewpane-filter .monaco-inputbox {
	height: 24px;
	font-size: 12px;
	flex: 1;
}

.pane-header .viewpane-filter-container > .viewpane-filter .monaco-inputbox .monaco-inputbox {
	height: 20px;
	line-height: 18px;
}

.monaco-workbench.vs .viewpane-filter-container > .viewpane-filter .monaco-inputbox {
	height: 25px;
}

.viewpane-filter-container > .viewpane-filter > .viewpane-filter-controls {
	position: absolute;
	top: 0px;
	bottom: 0;
	right: 0px;
	display: flex;
	align-items: center;
}

.viewpane-filter-container > .viewpane-filter > .viewpane-filter-controls > .viewpane-filter-badge {
	margin: 4px 2px 4px 0px;
	padding: 0px 8px;
	border-radius: 2px;
}

.viewpane-filter > .viewpane-filter-controls > .viewpane-filter-badge.hidden,
.viewpane-filter.small > .viewpane-filter-controls > .viewpane-filter-badge {
	display: none;
}

.panel > .title .monaco-action-bar .action-item.viewpane-filter-container {
	max-width: 200px;
	min-width: 150px;
	margin-right: 10px;
}

.panel > .title .monaco-action-bar .action-item.viewpane-filter-container:active,
.panel > .title .monaco-action-bar .action-item.viewpane-filter-container:focus-within {
	max-width: 400px;
}

.pane-body .viewpane-filter-container:not(:empty) {
	flex: 1;
	margin: 10px 20px;
	height: initial;
}

.pane-body .viewpane-filter-container > .viewpane-filter > .viewpane-filter-controls .monaco-action-bar .action-item {
	margin-right: 4px;
}

.viewpane-filter > .viewpane-filter-controls .monaco-action-bar .action-label.codicon.codicon-filter.checked {
	border-color: var(--vscode-inputOption-activeBorder);
	color: var(--vscode-inputOption-activeForeground);
	background-color: var(--vscode-inputOption-activeBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/activity.ts]---
Location: vscode-main/src/vs/workbench/common/activity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const GLOBAL_ACTIVITY_ID = 'workbench.actions.manage';
export const ACCOUNTS_ACTIVITY_ID = 'workbench.actions.accounts';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/comments.ts]---
Location: vscode-main/src/vs/workbench/common/comments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarshalledId } from '../../base/common/marshallingIds.js';
import { CommentThread } from '../../editor/common/languages.js';

export interface MarshalledCommentThread {
	$mid: MarshalledId.CommentThread;
	commentControlHandle: number;
	commentThreadHandle: number;
}

export interface MarshalledCommentThreadInternal extends MarshalledCommentThread {
	thread: CommentThread;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/component.ts]---
Location: vscode-main/src/vs/workbench/common/component.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Memento } from './memento.js';
import { IThemeService, Themable } from '../../platform/theme/common/themeService.js';
import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { DisposableStore } from '../../base/common/lifecycle.js';
import { Event } from '../../base/common/event.js';

export class Component<MementoType extends object = object> extends Themable {

	private readonly memento: Memento<MementoType>;

	constructor(
		private readonly id: string,
		themeService: IThemeService,
		storageService: IStorageService
	) {
		super(themeService);

		this.memento = new Memento(this.id, storageService);

		this._register(storageService.onWillSaveState(() => {

			// Ask the component to persist state into the memento
			this.saveState();

			// Then save the memento into storage
			this.memento.saveMemento();
		}));
	}

	getId(): string {
		return this.id;
	}

	protected getMemento(scope: StorageScope, target: StorageTarget): Partial<MementoType> {
		return this.memento.getMemento(scope, target);
	}

	protected reloadMemento(scope: StorageScope): void {
		this.memento.reloadMemento(scope);
	}

	protected onDidChangeMementoValue(scope: StorageScope, disposables: DisposableStore): Event<IStorageValueChangeEvent> {
		return this.memento.onDidChangeValue(scope, disposables);
	}

	protected saveState(): void {
		// Subclasses to implement for storing state
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/composite.ts]---
Location: vscode-main/src/vs/workbench/common/composite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../base/common/event.js';

export interface IComposite {

	/**
	 * An event when the composite gained focus.
	 */
	readonly onDidFocus: Event<void>;

	/**
	 * An event when the composite lost focus.
	 */
	readonly onDidBlur: Event<void>;

	/**
	 * Returns true if the composite has focus.
	 */
	hasFocus(): boolean;

	/**
	 * Returns the unique identifier of this composite.
	 */
	getId(): string;

	/**
	 * Returns the name of this composite to show in the title area.
	 */
	getTitle(): string | undefined;

	/**
	 * Returns the underlying control of this composite.
	 */
	getControl(): ICompositeControl | undefined;

	/**
	 * Asks the underlying control to focus.
	 */
	focus(): void;
}

/**
 * Marker interface for the composite control
 */
export interface ICompositeControl { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/configuration.ts]---
Location: vscode-main/src/vs/workbench/common/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { ConfigurationScope, IConfigurationNode, IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from './contributions.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../platform/workspace/common/workspace.js';
import { ConfigurationTarget, IConfigurationService, IConfigurationValue, IInspectValue } from '../../platform/configuration/common/configuration.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { Emitter } from '../../base/common/event.js';
import { IRemoteAgentService } from '../services/remote/common/remoteAgentService.js';
import { OperatingSystem, isWindows } from '../../base/common/platform.js';
import { URI } from '../../base/common/uri.js';
import { equals } from '../../base/common/objects.js';
import { DeferredPromise } from '../../base/common/async.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';

export const applicationConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	'id': 'application',
	'order': 100,
	'title': localize('applicationConfigurationTitle', "Application"),
	'type': 'object'
});

export const workbenchConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	'id': 'workbench',
	'order': 7,
	'title': localize('workbenchConfigurationTitle', "Workbench"),
	'type': 'object',
});

export const securityConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	'id': 'security',
	'scope': ConfigurationScope.APPLICATION,
	'title': localize('securityConfigurationTitle', "Security"),
	'type': 'object',
	'order': 7
});

export const problemsConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	'id': 'problems',
	'title': localize('problemsConfigurationTitle', "Problems"),
	'type': 'object',
	'order': 101
});

export const windowConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	'id': 'window',
	'order': 8,
	'title': localize('windowConfigurationTitle', "Window"),
	'type': 'object',
});

export const Extensions = {
	ConfigurationMigration: 'base.contributions.configuration.migration'
};

type ConfigurationValue = { value: unknown | undefined /* Remove */ };
export type ConfigurationKeyValuePairs = [string, ConfigurationValue][];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigurationMigrationFn = (value: any, valueAccessor: (key: string) => any) => ConfigurationValue | ConfigurationKeyValuePairs | Promise<ConfigurationValue | ConfigurationKeyValuePairs>;
export type ConfigurationMigration = { key: string; migrateFn: ConfigurationMigrationFn };

export interface IConfigurationMigrationRegistry {
	registerConfigurationMigrations(configurationMigrations: ConfigurationMigration[]): void;
}

class ConfigurationMigrationRegistry implements IConfigurationMigrationRegistry {

	readonly migrations: ConfigurationMigration[] = [];

	private readonly _onDidRegisterConfigurationMigrations = new Emitter<ConfigurationMigration[]>();
	readonly onDidRegisterConfigurationMigration = this._onDidRegisterConfigurationMigrations.event;

	registerConfigurationMigrations(configurationMigrations: ConfigurationMigration[]): void {
		this.migrations.push(...configurationMigrations);
	}

}

const configurationMigrationRegistry = new ConfigurationMigrationRegistry();
Registry.add(Extensions.ConfigurationMigration, configurationMigrationRegistry);

export class ConfigurationMigrationWorkbenchContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.configurationMigration';

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
	) {
		super();
		this._register(this.workspaceService.onDidChangeWorkspaceFolders(async (e) => {
			for (const folder of e.added) {
				await this.migrateConfigurationsForFolder(folder, configurationMigrationRegistry.migrations);
			}
		}));
		this.migrateConfigurations(configurationMigrationRegistry.migrations);
		this._register(configurationMigrationRegistry.onDidRegisterConfigurationMigration(migration => this.migrateConfigurations(migration)));
	}

	private async migrateConfigurations(migrations: ConfigurationMigration[]): Promise<void> {
		await this.migrateConfigurationsForFolder(undefined, migrations);
		for (const folder of this.workspaceService.getWorkspace().folders) {
			await this.migrateConfigurationsForFolder(folder, migrations);
		}
	}

	private async migrateConfigurationsForFolder(folder: IWorkspaceFolder | undefined, migrations: ConfigurationMigration[]): Promise<void> {
		await Promise.all([migrations.map(migration => this.migrateConfigurationsForFolderAndOverride(migration, folder?.uri))]);
	}

	private async migrateConfigurationsForFolderAndOverride(migration: ConfigurationMigration, resource?: URI): Promise<void> {
		const inspectData = this.configurationService.inspect(migration.key, { resource });

		const targetPairs: [keyof IConfigurationValue<unknown>, ConfigurationTarget][] = this.workspaceService.getWorkbenchState() === WorkbenchState.WORKSPACE ? [
			['user', ConfigurationTarget.USER],
			['userLocal', ConfigurationTarget.USER_LOCAL],
			['userRemote', ConfigurationTarget.USER_REMOTE],
			['workspace', ConfigurationTarget.WORKSPACE],
			['workspaceFolder', ConfigurationTarget.WORKSPACE_FOLDER],
		] : [
			['user', ConfigurationTarget.USER],
			['userLocal', ConfigurationTarget.USER_LOCAL],
			['userRemote', ConfigurationTarget.USER_REMOTE],
			['workspace', ConfigurationTarget.WORKSPACE],
		];
		for (const [dataKey, target] of targetPairs) {
			const inspectValue = inspectData[dataKey] as IInspectValue<unknown> | undefined;
			if (!inspectValue) {
				continue;
			}

			const migrationValues: [[string, ConfigurationValue], string[]][] = [];

			if (inspectValue.value !== undefined) {
				const keyValuePairs = await this.runMigration(migration, dataKey, inspectValue.value, resource, undefined);
				for (const keyValuePair of keyValuePairs ?? []) {
					migrationValues.push([keyValuePair, []]);
				}
			}

			for (const { identifiers, value } of inspectValue.overrides ?? []) {
				if (value !== undefined) {
					const keyValuePairs = await this.runMigration(migration, dataKey, value, resource, identifiers);
					for (const keyValuePair of keyValuePairs ?? []) {
						migrationValues.push([keyValuePair, identifiers]);
					}
				}
			}

			if (migrationValues.length) {
				// apply migrations
				await Promise.allSettled(migrationValues.map(async ([[key, value], overrideIdentifiers]) =>
					this.configurationService.updateValue(key, value.value, { resource, overrideIdentifiers }, target)));
			}
		}
	}

	private async runMigration(migration: ConfigurationMigration, dataKey: keyof IConfigurationValue<unknown>, value: unknown, resource: URI | undefined, overrideIdentifiers: string[] | undefined): Promise<ConfigurationKeyValuePairs | undefined> {
		const valueAccessor = (key: string) => {
			const inspectData = this.configurationService.inspect(key, { resource });
			const inspectValue = inspectData[dataKey] as IInspectValue<unknown> | undefined;
			if (!inspectValue) {
				return undefined;
			}
			if (!overrideIdentifiers) {
				return inspectValue.value;
			}
			return inspectValue.overrides?.find(({ identifiers }) => equals(identifiers, overrideIdentifiers))?.value;
		};
		const result = await migration.migrateFn(value, valueAccessor);
		return Array.isArray(result) ? result : [[migration.key, result]];
	}
}

export class DynamicWorkbenchSecurityConfiguration extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dynamicWorkbenchSecurityConfiguration';

	private readonly _ready = new DeferredPromise<void>();
	readonly ready = this._ready.p;

	constructor(
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService
	) {
		super();

		this.create();
	}

	private async create(): Promise<void> {
		try {
			await this.doCreate();
		} finally {
			this._ready.complete();
		}
	}

	private async doCreate(): Promise<void> {
		if (!isWindows) {
			const remoteEnvironment = await this.remoteAgentService.getEnvironment();
			if (remoteEnvironment?.os !== OperatingSystem.Windows) {
				return;
			}
		}

		// Windows: UNC allow list security configuration
		const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		registry.registerConfiguration({
			...securityConfigurationNodeBase,
			'properties': {
				'security.allowedUNCHosts': {
					'type': 'array',
					'items': {
						'type': 'string',
						'pattern': '^[^\\\\]+$',
						'patternErrorMessage': localize('security.allowedUNCHosts.patternErrorMessage', 'UNC host names must not contain backslashes.')
					},
					'default': [],
					'markdownDescription': localize('security.allowedUNCHosts', 'A set of UNC host names (without leading or trailing backslash, for example `192.168.0.1` or `my-server`) to allow without user confirmation. If a UNC host is being accessed that is not allowed via this setting or has not been acknowledged via user confirmation, an error will occur and the operation stopped. A restart is required when changing this setting. Find out more about this setting at https://aka.ms/vscode-windows-unc.'),
					'scope': ConfigurationScope.APPLICATION_MACHINE
				},
				'security.restrictUNCAccess': {
					'type': 'boolean',
					'default': true,
					'markdownDescription': localize('security.restrictUNCAccess', 'If enabled, only allows access to UNC host names that are allowed by the `#security.allowedUNCHosts#` setting or after user confirmation. Find out more about this setting at https://aka.ms/vscode-windows-unc.'),
					'scope': ConfigurationScope.APPLICATION_MACHINE
				}
			}
		});
	}
}

export const CONFIG_NEW_WINDOW_PROFILE = 'window.newWindowProfile';

export class DynamicWindowConfiguration extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dynamicWindowConfiguration';

	private configurationNode: IConfigurationNode | undefined;
	private newWindowProfile: IUserDataProfile | undefined;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this.registerNewWindowProfileConfiguration();
		this._register(this.userDataProfilesService.onDidChangeProfiles((e) => this.registerNewWindowProfileConfiguration()));

		this.setNewWindowProfile();
		this.checkAndResetNewWindowProfileConfig();

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.source !== ConfigurationTarget.DEFAULT && e.affectsConfiguration(CONFIG_NEW_WINDOW_PROFILE)) {
				this.setNewWindowProfile();
			}
		}));
		this._register(this.userDataProfilesService.onDidChangeProfiles(() => this.checkAndResetNewWindowProfileConfig()));
	}

	private registerNewWindowProfileConfiguration(): void {
		const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		const configurationNode: IConfigurationNode = {
			...windowConfigurationNodeBase,
			'properties': {
				[CONFIG_NEW_WINDOW_PROFILE]: {
					'type': ['string', 'null'],
					'default': null,
					'enum': [...this.userDataProfilesService.profiles.map(profile => profile.name), null],
					'enumItemLabels': [...this.userDataProfilesService.profiles.map(() => ''), localize('active window', "Active Window")],
					'description': localize('newWindowProfile', "Specifies the profile to use when opening a new window. If a profile name is provided, the new window will use that profile. If no profile name is provided, the new window will use the profile of the active window or the Default profile if no active window exists."),
					'scope': ConfigurationScope.APPLICATION,
				}
			}
		};
		if (this.configurationNode) {
			registry.updateConfigurations({ add: [configurationNode], remove: [this.configurationNode] });
		} else {
			registry.registerConfiguration(configurationNode);
		}
		this.configurationNode = configurationNode;
	}

	private setNewWindowProfile(): void {
		const newWindowProfileName = this.configurationService.getValue(CONFIG_NEW_WINDOW_PROFILE);
		this.newWindowProfile = newWindowProfileName ? this.userDataProfilesService.profiles.find(profile => profile.name === newWindowProfileName) : undefined;
	}

	private checkAndResetNewWindowProfileConfig(): void {
		const newWindowProfileName = this.configurationService.getValue(CONFIG_NEW_WINDOW_PROFILE);
		if (!newWindowProfileName) {
			return;
		}
		const profile = this.newWindowProfile ? this.userDataProfilesService.profiles.find(profile => profile.id === this.newWindowProfile!.id) : undefined;
		if (newWindowProfileName === profile?.name) {
			return;
		}
		this.configurationService.updateValue(CONFIG_NEW_WINDOW_PROFILE, profile?.name);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/contextkeys.ts]---
Location: vscode-main/src/vs/workbench/common/contextkeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../base/common/lifecycle.js';
import { URI } from '../../base/common/uri.js';
import { localize } from '../../nls.js';
import { IContextKeyService, IContextKey, RawContextKey } from '../../platform/contextkey/common/contextkey.js';
import { basename, dirname, extname, isEqual } from '../../base/common/resources.js';
import { ILanguageService } from '../../editor/common/languages/language.js';
import { IFileService } from '../../platform/files/common/files.js';
import { IModelService } from '../../editor/common/services/model.js';
import { Schemas } from '../../base/common/network.js';
import { EditorInput } from './editor/editorInput.js';
import { IEditorResolverService } from '../services/editor/common/editorResolverService.js';
import { DEFAULT_EDITOR_ASSOCIATION } from './editor.js';
import { DiffEditorInput } from './editor/diffEditorInput.js';

//#region < --- Workbench --- >

export const WorkbenchStateContext = new RawContextKey<string>('workbenchState', undefined, { type: 'string', description: localize('workbenchState', "The kind of workspace opened in the window, either 'empty' (no workspace), 'folder' (single folder) or 'workspace' (multi-root workspace)") });
export const WorkspaceFolderCountContext = new RawContextKey<number>('workspaceFolderCount', 0, localize('workspaceFolderCount', "The number of root folders in the workspace"));

export const OpenFolderWorkspaceSupportContext = new RawContextKey<boolean>('openFolderWorkspaceSupport', true, true);
export const EnterMultiRootWorkspaceSupportContext = new RawContextKey<boolean>('enterMultiRootWorkspaceSupport', true, true);
export const EmptyWorkspaceSupportContext = new RawContextKey<boolean>('emptyWorkspaceSupport', true, true);

export const DirtyWorkingCopiesContext = new RawContextKey<boolean>('dirtyWorkingCopies', false, localize('dirtyWorkingCopies', "Whether there are any working copies with unsaved changes"));

export const RemoteNameContext = new RawContextKey<string>('remoteName', '', localize('remoteName', "The name of the remote the window is connected to or an empty string if not connected to any remote"));

export const VirtualWorkspaceContext = new RawContextKey<string>('virtualWorkspace', '', localize('virtualWorkspace', "The scheme of the current workspace is from a virtual file system or an empty string."));
export const TemporaryWorkspaceContext = new RawContextKey<boolean>('temporaryWorkspace', false, localize('temporaryWorkspace', "The scheme of the current workspace is from a temporary file system."));

export const HasWebFileSystemAccess = new RawContextKey<boolean>('hasWebFileSystemAccess', false, true); // Support for FileSystemAccess web APIs (https://wicg.github.io/file-system-access)

export const EmbedderIdentifierContext = new RawContextKey<string | undefined>('embedderIdentifier', undefined, localize('embedderIdentifier', 'The identifier of the embedder according to the product service, if one is defined'));

export const InAutomationContext = new RawContextKey<boolean>('inAutomation', false, localize('inAutomation', "Whether VS Code is running under automation/smoke test"));

//#endregion

//#region < --- Window --- >

export const IsMainWindowFullscreenContext = new RawContextKey<boolean>('isFullscreen', false, localize('isFullscreen', "Whether the main window is in fullscreen mode"));
export const IsAuxiliaryWindowFocusedContext = new RawContextKey<boolean>('isAuxiliaryWindowFocusedContext', false, localize('isAuxiliaryWindowFocusedContext', "Whether an auxiliary window is focused"));

export const IsWindowAlwaysOnTopContext = new RawContextKey<boolean>('isWindowAlwaysOnTop', false, localize('isWindowAlwaysOnTop', "Whether the window is always on top"));

export const IsAuxiliaryWindowContext = new RawContextKey<boolean>('isAuxiliaryWindow', false, localize('isAuxiliaryWindow', "Window is an auxiliary window"));


//#endregion


//#region < --- Editor --- >

// Editor State Context Keys
export const ActiveEditorDirtyContext = new RawContextKey<boolean>('activeEditorIsDirty', false, localize('activeEditorIsDirty', "Whether the active editor has unsaved changes"));
export const ActiveEditorPinnedContext = new RawContextKey<boolean>('activeEditorIsNotPreview', false, localize('activeEditorIsNotPreview', "Whether the active editor is not in preview mode"));
export const ActiveEditorFirstInGroupContext = new RawContextKey<boolean>('activeEditorIsFirstInGroup', false, localize('activeEditorIsFirstInGroup', "Whether the active editor is the first one in its group"));
export const ActiveEditorLastInGroupContext = new RawContextKey<boolean>('activeEditorIsLastInGroup', false, localize('activeEditorIsLastInGroup', "Whether the active editor is the last one in its group"));
export const ActiveEditorStickyContext = new RawContextKey<boolean>('activeEditorIsPinned', false, localize('activeEditorIsPinned', "Whether the active editor is pinned"));
export const ActiveEditorReadonlyContext = new RawContextKey<boolean>('activeEditorIsReadonly', false, localize('activeEditorIsReadonly', "Whether the active editor is read-only"));
export const ActiveCompareEditorCanSwapContext = new RawContextKey<boolean>('activeCompareEditorCanSwap', false, localize('activeCompareEditorCanSwap', "Whether the active compare editor can swap sides"));
export const ActiveEditorCanToggleReadonlyContext = new RawContextKey<boolean>('activeEditorCanToggleReadonly', true, localize('activeEditorCanToggleReadonly', "Whether the active editor can toggle between being read-only or writeable"));
export const ActiveEditorCanRevertContext = new RawContextKey<boolean>('activeEditorCanRevert', false, localize('activeEditorCanRevert', "Whether the active editor can revert"));
export const ActiveEditorCanSplitInGroupContext = new RawContextKey<boolean>('activeEditorCanSplitInGroup', true);

// Editor Kind Context Keys
export const ActiveEditorContext = new RawContextKey<string | null>('activeEditor', null, { type: 'string', description: localize('activeEditor', "The identifier of the active editor") });
export const ActiveEditorAvailableEditorIdsContext = new RawContextKey<string>('activeEditorAvailableEditorIds', '', localize('activeEditorAvailableEditorIds', "The available editor identifiers that are usable for the active editor"));
export const TextCompareEditorVisibleContext = new RawContextKey<boolean>('textCompareEditorVisible', false, localize('textCompareEditorVisible', "Whether a text compare editor is visible"));
export const TextCompareEditorActiveContext = new RawContextKey<boolean>('textCompareEditorActive', false, localize('textCompareEditorActive', "Whether a text compare editor is active"));
export const SideBySideEditorActiveContext = new RawContextKey<boolean>('sideBySideEditorActive', false, localize('sideBySideEditorActive', "Whether a side by side editor is active"));

// Editor Group Context Keys
export const EditorGroupEditorsCountContext = new RawContextKey<number>('groupEditorsCount', 0, localize('groupEditorsCount', "The number of opened editor groups"));
export const ActiveEditorGroupEmptyContext = new RawContextKey<boolean>('activeEditorGroupEmpty', false, localize('activeEditorGroupEmpty', "Whether the active editor group is empty"));
export const ActiveEditorGroupIndexContext = new RawContextKey<number>('activeEditorGroupIndex', 0, localize('activeEditorGroupIndex', "The index of the active editor group"));
export const ActiveEditorGroupLastContext = new RawContextKey<boolean>('activeEditorGroupLast', false, localize('activeEditorGroupLast', "Whether the active editor group is the last group"));
export const ActiveEditorGroupLockedContext = new RawContextKey<boolean>('activeEditorGroupLocked', false, localize('activeEditorGroupLocked', "Whether the active editor group is locked"));
export const MultipleEditorGroupsContext = new RawContextKey<boolean>('multipleEditorGroups', false, localize('multipleEditorGroups', "Whether there are multiple editor groups opened"));
export const SingleEditorGroupsContext = MultipleEditorGroupsContext.toNegated();
export const MultipleEditorsSelectedInGroupContext = new RawContextKey<boolean>('multipleEditorsSelectedInGroup', false, localize('multipleEditorsSelectedInGroup', "Whether multiple editors have been selected in an editor group"));
export const TwoEditorsSelectedInGroupContext = new RawContextKey<boolean>('twoEditorsSelectedInGroup', false, localize('twoEditorsSelectedInGroup', "Whether exactly two editors have been selected in an editor group"));
export const SelectedEditorsInGroupFileOrUntitledResourceContextKey = new RawContextKey<boolean>('SelectedEditorsInGroupFileOrUntitledResourceContextKey', true, localize('SelectedEditorsInGroupFileOrUntitledResourceContextKey', "Whether all selected editors in a group have a file or untitled resource associated"));

// Editor Part Context Keys
export const EditorPartMultipleEditorGroupsContext = new RawContextKey<boolean>('editorPartMultipleEditorGroups', false, localize('editorPartMultipleEditorGroups', "Whether there are multiple editor groups opened in an editor part"));
export const EditorPartSingleEditorGroupsContext = EditorPartMultipleEditorGroupsContext.toNegated();
export const EditorPartMaximizedEditorGroupContext = new RawContextKey<boolean>('editorPartMaximizedEditorGroup', false, localize('editorPartEditorGroupMaximized', "Editor Part has a maximized group"));

// Editor Layout Context Keys
export const EditorsVisibleContext = new RawContextKey<boolean>('editorIsOpen', false, localize('editorIsOpen', "Whether an editor is open"));
export const InEditorZenModeContext = new RawContextKey<boolean>('inZenMode', false, localize('inZenMode', "Whether Zen mode is enabled"));
export const IsMainEditorCenteredLayoutContext = new RawContextKey<boolean>('isCenteredLayout', false, localize('isMainEditorCenteredLayout', "Whether centered layout is enabled for the main editor"));
export const SplitEditorsVertically = new RawContextKey<boolean>('splitEditorsVertically', false, localize('splitEditorsVertically', "Whether editors split vertically"));
export const MainEditorAreaVisibleContext = new RawContextKey<boolean>('mainEditorAreaVisible', true, localize('mainEditorAreaVisible', "Whether the editor area in the main window is visible"));
export const EditorTabsVisibleContext = new RawContextKey<boolean>('editorTabsVisible', true, localize('editorTabsVisible', "Whether editor tabs are visible"));

//#endregion


//#region < --- Side Bar --- >

export const SideBarVisibleContext = new RawContextKey<boolean>('sideBarVisible', false, localize('sideBarVisible', "Whether the sidebar is visible"));
export const SidebarFocusContext = new RawContextKey<boolean>('sideBarFocus', false, localize('sideBarFocus', "Whether the sidebar has keyboard focus"));
export const ActiveViewletContext = new RawContextKey<string>('activeViewlet', '', localize('activeViewlet', "The identifier of the active viewlet"));

//#endregion


//#region < --- Status Bar --- >

export const StatusBarFocused = new RawContextKey<boolean>('statusBarFocused', false, localize('statusBarFocused', "Whether the status bar has keyboard focus"));

//#endregion

//#region < --- Title Bar --- >

export const TitleBarStyleContext = new RawContextKey<string>('titleBarStyle', 'custom', localize('titleBarStyle', "Style of the window title bar"));
export const TitleBarVisibleContext = new RawContextKey<boolean>('titleBarVisible', false, localize('titleBarVisible', "Whether the title bar is visible"));
export const IsCompactTitleBarContext = new RawContextKey<boolean>('isCompactTitleBar', false, localize('isCompactTitleBar', "Title bar is in compact mode"));

//#endregion


//#region < --- Banner --- >

export const BannerFocused = new RawContextKey<boolean>('bannerFocused', false, localize('bannerFocused', "Whether the banner has keyboard focus"));

//#endregion


//#region < --- Notifications --- >

export const NotificationFocusedContext = new RawContextKey<boolean>('notificationFocus', true, localize('notificationFocus', "Whether a notification has keyboard focus"));
export const NotificationsCenterVisibleContext = new RawContextKey<boolean>('notificationCenterVisible', false, localize('notificationCenterVisible', "Whether the notifications center is visible"));
export const NotificationsToastsVisibleContext = new RawContextKey<boolean>('notificationToastsVisible', false, localize('notificationToastsVisible', "Whether a notification toast is visible"));

//#endregion


//#region < --- Auxiliary Bar --- >

export const ActiveAuxiliaryContext = new RawContextKey<string>('activeAuxiliary', '', localize('activeAuxiliary', "The identifier of the active auxiliary panel"));
export const AuxiliaryBarFocusContext = new RawContextKey<boolean>('auxiliaryBarFocus', false, localize('auxiliaryBarFocus', "Whether the auxiliary bar has keyboard focus"));
export const AuxiliaryBarVisibleContext = new RawContextKey<boolean>('auxiliaryBarVisible', false, localize('auxiliaryBarVisible', "Whether the auxiliary bar is visible"));
export const AuxiliaryBarMaximizedContext = new RawContextKey<boolean>('auxiliaryBarMaximized', false, localize('auxiliaryBarMaximized', "Whether the auxiliary bar is maximized"));

//#endregion


//#region < --- Panel --- >

export const ActivePanelContext = new RawContextKey<string>('activePanel', '', localize('activePanel', "The identifier of the active panel"));
export const PanelFocusContext = new RawContextKey<boolean>('panelFocus', false, localize('panelFocus', "Whether the panel has keyboard focus"));
export const PanelPositionContext = new RawContextKey<string>('panelPosition', 'bottom', localize('panelPosition', "The position of the panel, always 'bottom'"));
export const PanelAlignmentContext = new RawContextKey<string>('panelAlignment', 'center', localize('panelAlignment', "The alignment of the panel, either 'center', 'left', 'right' or 'justify'"));
export const PanelVisibleContext = new RawContextKey<boolean>('panelVisible', false, localize('panelVisible', "Whether the panel is visible"));
export const PanelMaximizedContext = new RawContextKey<boolean>('panelMaximized', false, localize('panelMaximized', "Whether the panel is maximized"));

//#endregion


//#region < --- Views --- >

export const FocusedViewContext = new RawContextKey<string>('focusedView', '', localize('focusedView', "The identifier of the view that has keyboard focus"));
export function getVisbileViewContextKey(viewId: string): string { return `view.${viewId}.visible`; }

//#endregion


//#region < --- Resources --- >

export class ResourceContextKey {

	// NOTE: DO NOT CHANGE THE DEFAULT VALUE TO ANYTHING BUT
	// UNDEFINED! IT IS IMPORTANT THAT DEFAULTS ARE INHERITED
	// FROM THE PARENT CONTEXT AND ONLY UNDEFINED DOES THIS

	static readonly Scheme = new RawContextKey<string>('resourceScheme', undefined, { type: 'string', description: localize('resourceScheme', "The scheme of the resource") });
	static readonly Filename = new RawContextKey<string>('resourceFilename', undefined, { type: 'string', description: localize('resourceFilename', "The file name of the resource") });
	static readonly Dirname = new RawContextKey<string>('resourceDirname', undefined, { type: 'string', description: localize('resourceDirname', "The folder name the resource is contained in") });
	static readonly Path = new RawContextKey<string>('resourcePath', undefined, { type: 'string', description: localize('resourcePath', "The full path of the resource") });
	static readonly LangId = new RawContextKey<string>('resourceLangId', undefined, { type: 'string', description: localize('resourceLangId', "The language identifier of the resource") });
	static readonly Resource = new RawContextKey<string>('resource', undefined, { type: 'URI', description: localize('resource', "The full value of the resource including scheme and path") });
	static readonly Extension = new RawContextKey<string>('resourceExtname', undefined, { type: 'string', description: localize('resourceExtname', "The extension name of the resource") });
	static readonly HasResource = new RawContextKey<boolean>('resourceSet', undefined, { type: 'boolean', description: localize('resourceSet', "Whether a resource is present or not") });
	static readonly IsFileSystemResource = new RawContextKey<boolean>('isFileSystemResource', undefined, { type: 'boolean', description: localize('isFileSystemResource', "Whether the resource is backed by a file system provider") });

	private readonly _disposables = new DisposableStore();

	private _value: URI | undefined;
	private readonly _resourceKey: IContextKey<string | null>;
	private readonly _schemeKey: IContextKey<string | null>;
	private readonly _filenameKey: IContextKey<string | null>;
	private readonly _dirnameKey: IContextKey<string | null>;
	private readonly _pathKey: IContextKey<string | null>;
	private readonly _langIdKey: IContextKey<string | null>;
	private readonly _extensionKey: IContextKey<string | null>;
	private readonly _hasResource: IContextKey<boolean>;
	private readonly _isFileSystemResource: IContextKey<boolean>;

	constructor(
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IFileService private readonly _fileService: IFileService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IModelService private readonly _modelService: IModelService
	) {
		this._schemeKey = ResourceContextKey.Scheme.bindTo(this._contextKeyService);
		this._filenameKey = ResourceContextKey.Filename.bindTo(this._contextKeyService);
		this._dirnameKey = ResourceContextKey.Dirname.bindTo(this._contextKeyService);
		this._pathKey = ResourceContextKey.Path.bindTo(this._contextKeyService);
		this._langIdKey = ResourceContextKey.LangId.bindTo(this._contextKeyService);
		this._resourceKey = ResourceContextKey.Resource.bindTo(this._contextKeyService);
		this._extensionKey = ResourceContextKey.Extension.bindTo(this._contextKeyService);
		this._hasResource = ResourceContextKey.HasResource.bindTo(this._contextKeyService);
		this._isFileSystemResource = ResourceContextKey.IsFileSystemResource.bindTo(this._contextKeyService);

		this._disposables.add(_fileService.onDidChangeFileSystemProviderRegistrations(() => {
			const resource = this.get();
			this._isFileSystemResource.set(Boolean(resource && _fileService.hasProvider(resource)));
		}));

		this._disposables.add(_modelService.onModelAdded(model => {
			if (isEqual(model.uri, this.get())) {
				this._setLangId();
			}
		}));
		this._disposables.add(_modelService.onModelLanguageChanged(e => {
			if (isEqual(e.model.uri, this.get())) {
				this._setLangId();
			}
		}));
	}

	dispose(): void {
		this._disposables.dispose();
	}

	private _setLangId(): void {
		const value = this.get();
		if (!value) {
			this._langIdKey.set(null);
			return;
		}
		const langId = this._modelService.getModel(value)?.getLanguageId() ?? this._languageService.guessLanguageIdByFilepathOrFirstLine(value);
		this._langIdKey.set(langId);
	}

	set(value: URI | null | undefined) {
		value = value ?? undefined;
		if (isEqual(this._value, value)) {
			return;
		}
		this._value = value;
		this._contextKeyService.bufferChangeEvents(() => {
			this._resourceKey.set(value ? value.toString() : null);
			this._schemeKey.set(value ? value.scheme : null);
			this._filenameKey.set(value ? basename(value) : null);
			this._dirnameKey.set(value ? this.uriToPath(dirname(value)) : null);
			this._pathKey.set(value ? this.uriToPath(value) : null);
			this._setLangId();
			this._extensionKey.set(value ? extname(value) : null);
			this._hasResource.set(Boolean(value));
			this._isFileSystemResource.set(value ? this._fileService.hasProvider(value) : false);
		});
	}

	private uriToPath(uri: URI): string {
		if (uri.scheme === Schemas.file) {
			return uri.fsPath;
		}

		return uri.path;
	}

	reset(): void {
		this._value = undefined;
		this._contextKeyService.bufferChangeEvents(() => {
			this._resourceKey.reset();
			this._schemeKey.reset();
			this._filenameKey.reset();
			this._dirnameKey.reset();
			this._pathKey.reset();
			this._langIdKey.reset();
			this._extensionKey.reset();
			this._hasResource.reset();
			this._isFileSystemResource.reset();
		});
	}

	get(): URI | undefined {
		return this._value;
	}
}

//#endregion

export function applyAvailableEditorIds(contextKey: IContextKey<string>, editor: EditorInput | undefined | null, editorResolverService: IEditorResolverService): void {
	if (!editor) {
		contextKey.set('');
		return;
	}

	const editors = getAvailableEditorIds(editor, editorResolverService);
	contextKey.set(editors.join(','));
}

function getAvailableEditorIds(editor: EditorInput, editorResolverService: IEditorResolverService): string[] {
	// Non text editor untitled files cannot be easily serialized between
	// extensions so instead we disable this context key to prevent common
	// commands that act on the active editor.
	if (editor.resource?.scheme === Schemas.untitled && editor.editorId !== DEFAULT_EDITOR_ASSOCIATION.id) {
		return [];
	}

	// Diff editors. The original and modified resources of a diff editor
	// *should* be the same, but calculate the set intersection just to be safe.
	if (editor instanceof DiffEditorInput) {
		const original = getAvailableEditorIds(editor.original, editorResolverService);
		const modified = new Set(getAvailableEditorIds(editor.modified, editorResolverService));
		return original.filter(editor => modified.has(editor));
	}

	// Normal editors.
	if (editor.resource) {
		return editorResolverService.getEditors(editor.resource).map(editor => editor.id);
	}

	return [];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/contributions.ts]---
Location: vscode-main/src/vs/workbench/common/contributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService, IConstructorSignature, ServicesAccessor, BrandedService } from '../../platform/instantiation/common/instantiation.js';
import { ILifecycleService, LifecyclePhase } from '../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IdleDeadline, DeferredPromise, runWhenGlobalIdle } from '../../base/common/async.js';
import { mark } from '../../base/common/performance.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IEnvironmentService } from '../../platform/environment/common/environment.js';
import { getOrSet } from '../../base/common/map.js';
import { Disposable, DisposableStore, isDisposable } from '../../base/common/lifecycle.js';
import { IEditorPaneService } from '../services/editor/common/editorPaneService.js';

/**
 * A workbench contribution that will be loaded when the workbench starts and disposed when the workbench shuts down.
 */
export interface IWorkbenchContribution {
	// Marker Interface
}

export namespace Extensions {
	/**
	 * @deprecated use `registerWorkbenchContribution2` instead.
	 */
	export const Workbench = 'workbench.contributions.kind';
}

export const enum WorkbenchPhase {

	/**
	 * The first phase signals that we are about to startup getting ready.
	 *
	 * Note: doing work in this phase blocks an editor from showing to
	 * the user, so please rather consider to use the other types, preferable
	 * `Lazy` to only instantiate the contribution when really needed.
	 */
	BlockStartup = LifecyclePhase.Starting,

	/**
	 * Services are ready and the window is about to restore its UI state.
	 *
	 * Note: doing work in this phase blocks an editor from showing to
	 * the user, so please rather consider to use the other types, preferable
	 * `Lazy` to only instantiate the contribution when really needed.
	 */
	BlockRestore = LifecyclePhase.Ready,

	/**
	 * Views, panels and editors have restored. Editors are given a bit of
	 * time to restore their contents.
	 */
	AfterRestored = LifecyclePhase.Restored,

	/**
	 * The last phase after views, panels and editors have restored and
	 * some time has passed (2-5 seconds).
	 */
	Eventually = LifecyclePhase.Eventually
}

/**
 * A workbenchch contribution that will only be instantiated
 * when calling `getWorkbenchContribution`.
 */
export interface ILazyWorkbenchContributionInstantiation {
	readonly lazy: true;
}

/**
 * A workbench contribution that will be instantiated when the
 * corresponding editor is being created.
 */
export interface IOnEditorWorkbenchContributionInstantiation {
	readonly editorTypeId: string;
}

function isOnEditorWorkbenchContributionInstantiation(obj: unknown): obj is IOnEditorWorkbenchContributionInstantiation {
	const candidate = obj as IOnEditorWorkbenchContributionInstantiation | undefined;
	return !!candidate && typeof candidate.editorTypeId === 'string';
}

export type WorkbenchContributionInstantiation = WorkbenchPhase | ILazyWorkbenchContributionInstantiation | IOnEditorWorkbenchContributionInstantiation;

function toWorkbenchPhase(phase: LifecyclePhase.Restored | LifecyclePhase.Eventually): WorkbenchPhase.AfterRestored | WorkbenchPhase.Eventually {
	switch (phase) {
		case LifecyclePhase.Restored:
			return WorkbenchPhase.AfterRestored;
		case LifecyclePhase.Eventually:
			return WorkbenchPhase.Eventually;
	}
}

function toLifecyclePhase(instantiation: WorkbenchPhase): LifecyclePhase {
	switch (instantiation) {
		case WorkbenchPhase.BlockStartup:
			return LifecyclePhase.Starting;
		case WorkbenchPhase.BlockRestore:
			return LifecyclePhase.Ready;
		case WorkbenchPhase.AfterRestored:
			return LifecyclePhase.Restored;
		case WorkbenchPhase.Eventually:
			return LifecyclePhase.Eventually;
	}
}

type IWorkbenchContributionSignature<Service extends BrandedService[]> = new (...services: Service) => IWorkbenchContribution;

export interface IWorkbenchContributionsRegistry {

	/**
	 * @deprecated use `registerWorkbenchContribution2` instead.
	 */
	registerWorkbenchContribution<Services extends BrandedService[]>(contribution: IWorkbenchContributionSignature<Services>, phase: LifecyclePhase.Restored | LifecyclePhase.Eventually): void;

	/**
	 * Starts the registry by providing the required services.
	 */
	start(accessor: ServicesAccessor): void;

	/**
	 * A promise that resolves when all contributions up to the `Restored`
	 * phase have been instantiated.
	 */
	readonly whenRestored: Promise<void>;

	/**
	 * Provides access to the instantiation times of all contributions by
	 * lifecycle phase.
	 */
	readonly timings: Map<LifecyclePhase, Array<[string /* ID */, number /* Creation Time */]>>;
}

interface IWorkbenchContributionRegistration {
	readonly id: string | undefined;
	readonly ctor: IConstructorSignature<IWorkbenchContribution>;
}

export class WorkbenchContributionsRegistry extends Disposable implements IWorkbenchContributionsRegistry {

	static readonly INSTANCE = new WorkbenchContributionsRegistry();

	private static readonly BLOCK_BEFORE_RESTORE_WARN_THRESHOLD = 20;
	private static readonly BLOCK_AFTER_RESTORE_WARN_THRESHOLD = 100;

	private instantiationService: IInstantiationService | undefined;
	private lifecycleService: ILifecycleService | undefined;
	private logService: ILogService | undefined;
	private environmentService: IEnvironmentService | undefined;
	private editorPaneService: IEditorPaneService | undefined;

	private readonly contributionsByPhase = new Map<LifecyclePhase, IWorkbenchContributionRegistration[]>();
	private readonly contributionsByEditor = new Map<string, IWorkbenchContributionRegistration[]>();
	private readonly contributionsById = new Map<string, IWorkbenchContributionRegistration>();

	private readonly instancesById = new Map<string, IWorkbenchContribution>();
	private readonly instanceDisposables = this._register(new DisposableStore());

	private readonly timingsByPhase = new Map<LifecyclePhase, Array<[string /* ID */, number /* Creation Time */]>>();
	get timings() { return this.timingsByPhase; }

	private readonly pendingRestoredContributions = new DeferredPromise<void>();
	readonly whenRestored = this.pendingRestoredContributions.p;

	registerWorkbenchContribution2(id: string, ctor: IConstructorSignature<IWorkbenchContribution>, phase: WorkbenchPhase.BlockStartup | WorkbenchPhase.BlockRestore): void;
	registerWorkbenchContribution2(id: string | undefined, ctor: IConstructorSignature<IWorkbenchContribution>, phase: WorkbenchPhase.AfterRestored | WorkbenchPhase.Eventually): void;
	registerWorkbenchContribution2(id: string, ctor: IConstructorSignature<IWorkbenchContribution>, lazy: ILazyWorkbenchContributionInstantiation): void;
	registerWorkbenchContribution2(id: string, ctor: IConstructorSignature<IWorkbenchContribution>, onEditor: IOnEditorWorkbenchContributionInstantiation): void;
	registerWorkbenchContribution2(id: string | undefined, ctor: IConstructorSignature<IWorkbenchContribution>, instantiation: WorkbenchContributionInstantiation): void {
		const contribution: IWorkbenchContributionRegistration = { id, ctor };

		// Instantiate directly if we already have a matching instantiation condition
		if (
			this.instantiationService && this.lifecycleService && this.logService && this.environmentService && this.editorPaneService &&
			(
				(typeof instantiation === 'number' && this.lifecycleService.phase >= instantiation) ||
				(typeof id === 'string' && isOnEditorWorkbenchContributionInstantiation(instantiation) && this.editorPaneService.didInstantiateEditorPane(instantiation.editorTypeId))
			)
		) {
			this.safeCreateContribution(this.instantiationService, this.logService, this.environmentService, contribution, typeof instantiation === 'number' ? toLifecyclePhase(instantiation) : this.lifecycleService.phase);
		}

		// Otherwise keep contributions by instantiation kind for later instantiation
		else {

			// by phase
			if (typeof instantiation === 'number') {
				getOrSet(this.contributionsByPhase, toLifecyclePhase(instantiation), []).push(contribution);
			}

			if (typeof id === 'string') {

				// by id
				if (!this.contributionsById.has(id)) {
					this.contributionsById.set(id, contribution);
				} else {
					console.error(`IWorkbenchContributionsRegistry#registerWorkbenchContribution(): Can't register multiple contributions with same id '${id}'`);
				}

				// by editor
				if (isOnEditorWorkbenchContributionInstantiation(instantiation)) {
					getOrSet(this.contributionsByEditor, instantiation.editorTypeId, []).push(contribution);
				}
			}
		}
	}

	registerWorkbenchContribution(ctor: IConstructorSignature<IWorkbenchContribution>, phase: LifecyclePhase.Restored | LifecyclePhase.Eventually): void {
		this.registerWorkbenchContribution2(undefined, ctor, toWorkbenchPhase(phase));
	}

	getWorkbenchContribution<T extends IWorkbenchContribution>(id: string): T {
		if (this.instancesById.has(id)) {
			return this.instancesById.get(id) as T;
		}

		const instantiationService = this.instantiationService;
		const lifecycleService = this.lifecycleService;
		const logService = this.logService;
		const environmentService = this.environmentService;
		if (!instantiationService || !lifecycleService || !logService || !environmentService) {
			throw new Error(`IWorkbenchContributionsRegistry#getContribution('${id}'): cannot be called before registry started`);
		}

		const contribution = this.contributionsById.get(id);
		if (!contribution) {
			throw new Error(`IWorkbenchContributionsRegistry#getContribution('${id}'): contribution with that identifier is unknown.`);
		}

		if (lifecycleService.phase < LifecyclePhase.Restored) {
			logService.warn(`IWorkbenchContributionsRegistry#getContribution('${id}'): contribution instantiated before LifecyclePhase.Restored!`);
		}

		this.safeCreateContribution(instantiationService, logService, environmentService, contribution, lifecycleService.phase);

		const instance = this.instancesById.get(id);
		if (!instance) {
			throw new Error(`IWorkbenchContributionsRegistry#getContribution('${id}'): failed to create contribution.`);
		}

		return instance as T;
	}

	start(accessor: ServicesAccessor): void {
		const instantiationService = this.instantiationService = accessor.get(IInstantiationService);
		const lifecycleService = this.lifecycleService = accessor.get(ILifecycleService);
		const logService = this.logService = accessor.get(ILogService);
		const environmentService = this.environmentService = accessor.get(IEnvironmentService);
		const editorPaneService = this.editorPaneService = accessor.get(IEditorPaneService);

		// Dispose contributions on shutdown
		this._register(lifecycleService.onDidShutdown(() => {
			this.instanceDisposables.clear();
		}));

		// Instantiate contributions by phase when they are ready
		for (const phase of [LifecyclePhase.Starting, LifecyclePhase.Ready, LifecyclePhase.Restored, LifecyclePhase.Eventually]) {
			this.instantiateByPhase(instantiationService, lifecycleService, logService, environmentService, phase);
		}

		// Instantiate contributions by editor when they are created or have been
		for (const editorTypeId of this.contributionsByEditor.keys()) {
			if (editorPaneService.didInstantiateEditorPane(editorTypeId)) {
				this.onEditor(editorTypeId, instantiationService, lifecycleService, logService, environmentService);
			}
		}
		this._register(editorPaneService.onWillInstantiateEditorPane(e => this.onEditor(e.typeId, instantiationService, lifecycleService, logService, environmentService)));
	}

	private onEditor(editorTypeId: string, instantiationService: IInstantiationService, lifecycleService: ILifecycleService, logService: ILogService, environmentService: IEnvironmentService): void {
		const contributions = this.contributionsByEditor.get(editorTypeId);
		if (contributions) {
			this.contributionsByEditor.delete(editorTypeId);

			for (const contribution of contributions) {
				this.safeCreateContribution(instantiationService, logService, environmentService, contribution, lifecycleService.phase);
			}
		}
	}

	private instantiateByPhase(instantiationService: IInstantiationService, lifecycleService: ILifecycleService, logService: ILogService, environmentService: IEnvironmentService, phase: LifecyclePhase): void {

		// Instantiate contributions directly when phase is already reached
		if (lifecycleService.phase >= phase) {
			this.doInstantiateByPhase(instantiationService, logService, environmentService, phase);
		}

		// Otherwise wait for phase to be reached
		else {
			lifecycleService.when(phase).then(() => this.doInstantiateByPhase(instantiationService, logService, environmentService, phase));
		}
	}

	private async doInstantiateByPhase(instantiationService: IInstantiationService, logService: ILogService, environmentService: IEnvironmentService, phase: LifecyclePhase): Promise<void> {
		const contributions = this.contributionsByPhase.get(phase);
		if (contributions) {
			this.contributionsByPhase.delete(phase);

			switch (phase) {
				case LifecyclePhase.Starting:
				case LifecyclePhase.Ready: {

					// instantiate everything synchronously and blocking
					// measure the time it takes as perf marks for diagnosis

					mark(`code/willCreateWorkbenchContributions/${phase}`);

					for (const contribution of contributions) {
						this.safeCreateContribution(instantiationService, logService, environmentService, contribution, phase);
					}

					mark(`code/didCreateWorkbenchContributions/${phase}`);

					break;
				}

				case LifecyclePhase.Restored:
				case LifecyclePhase.Eventually: {

					// for the Restored/Eventually-phase we instantiate contributions
					// only when idle. this might take a few idle-busy-cycles but will
					// finish within the timeouts
					// given that, we must ensure to await the contributions from the
					// Restored-phase before we instantiate the Eventually-phase

					if (phase === LifecyclePhase.Eventually) {
						await this.pendingRestoredContributions.p;
					}

					this.doInstantiateWhenIdle(contributions, instantiationService, logService, environmentService, phase);

					break;
				}
			}
		}
	}

	private doInstantiateWhenIdle(contributions: IWorkbenchContributionRegistration[], instantiationService: IInstantiationService, logService: ILogService, environmentService: IEnvironmentService, phase: LifecyclePhase): void {
		mark(`code/willCreateWorkbenchContributions/${phase}`);

		let i = 0;
		const forcedTimeout = phase === LifecyclePhase.Eventually ? 3000 : 500;

		const instantiateSome = (idle: IdleDeadline) => {
			while (i < contributions.length) {
				const contribution = contributions[i++];
				this.safeCreateContribution(instantiationService, logService, environmentService, contribution, phase);
				if (idle.timeRemaining() < 1) {
					// time is up -> reschedule
					runWhenGlobalIdle(instantiateSome, forcedTimeout);
					break;
				}
			}

			if (i === contributions.length) {
				mark(`code/didCreateWorkbenchContributions/${phase}`);

				if (phase === LifecyclePhase.Restored) {
					this.pendingRestoredContributions.complete();
				}
			}
		};

		runWhenGlobalIdle(instantiateSome, forcedTimeout);
	}

	private safeCreateContribution(instantiationService: IInstantiationService, logService: ILogService, environmentService: IEnvironmentService, contribution: IWorkbenchContributionRegistration, phase: LifecyclePhase): void {
		if (typeof contribution.id === 'string' && this.instancesById.has(contribution.id)) {
			return;
		}

		const now = Date.now();

		try {
			if (typeof contribution.id === 'string') {
				mark(`code/willCreateWorkbenchContribution/${phase}/${contribution.id}`);
			}

			const instance = instantiationService.createInstance(contribution.ctor);
			if (typeof contribution.id === 'string') {
				this.instancesById.set(contribution.id, instance);
				this.contributionsById.delete(contribution.id);
			}
			if (isDisposable(instance)) {
				this.instanceDisposables.add(instance);
			}
		} catch (error) {
			logService.error(`Unable to create workbench contribution '${contribution.id ?? contribution.ctor.name}'.`, error);
		} finally {
			if (typeof contribution.id === 'string') {
				mark(`code/didCreateWorkbenchContribution/${phase}/${contribution.id}`);
			}
		}

		if (typeof contribution.id === 'string' || !environmentService.isBuilt /* only log out of sources where we have good ctor names */) {
			const time = Date.now() - now;
			if (time > (phase < LifecyclePhase.Restored ? WorkbenchContributionsRegistry.BLOCK_BEFORE_RESTORE_WARN_THRESHOLD : WorkbenchContributionsRegistry.BLOCK_AFTER_RESTORE_WARN_THRESHOLD)) {
				logService.warn(`Creation of workbench contribution '${contribution.id ?? contribution.ctor.name}' took ${time}ms.`);
			}

			if (typeof contribution.id === 'string') {
				let timingsForPhase = this.timingsByPhase.get(phase);
				if (!timingsForPhase) {
					timingsForPhase = [];
					this.timingsByPhase.set(phase, timingsForPhase);
				}

				timingsForPhase.push([contribution.id, time]);
			}
		}
	}
}

/**
 * Register a workbench contribution that will be instantiated
 * based on the `instantiation` property.
 */
export const registerWorkbenchContribution2 = WorkbenchContributionsRegistry.INSTANCE.registerWorkbenchContribution2.bind(WorkbenchContributionsRegistry.INSTANCE) as {
	<Services extends BrandedService[]>(id: string, ctor: IWorkbenchContributionSignature<Services>, instantiation: WorkbenchContributionInstantiation): void;
};

/**
 * Provides access to a workbench contribution with a specific identifier.
 * The contribution is created if not yet done.
 *
 * Note: will throw an error if
 * - called too early before the registry has started
 * - no contribution is known for the given identifier
 */
export const getWorkbenchContribution = WorkbenchContributionsRegistry.INSTANCE.getWorkbenchContribution.bind(WorkbenchContributionsRegistry.INSTANCE);

Registry.add(Extensions.Workbench, WorkbenchContributionsRegistry.INSTANCE);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/dialogs.ts]---
Location: vscode-main/src/vs/workbench/common/dialogs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../base/common/async.js';
import { Event, Emitter } from '../../base/common/event.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { IDialogArgs, IDialogResult } from '../../platform/dialogs/common/dialogs.js';

export interface IDialogViewItem {
	readonly args: IDialogArgs;

	close(result?: IDialogResult | Error): void;
}

export interface IDialogHandle {
	readonly item: IDialogViewItem;
	readonly result: Promise<IDialogResult | undefined>;
}

export interface IDialogsModel {

	readonly onWillShowDialog: Event<void>;
	readonly onDidShowDialog: Event<void>;

	readonly dialogs: IDialogViewItem[];

	show(dialog: IDialogArgs): IDialogHandle;
}

export class DialogsModel extends Disposable implements IDialogsModel {

	readonly dialogs: IDialogViewItem[] = [];

	private readonly _onWillShowDialog = this._register(new Emitter<void>());
	readonly onWillShowDialog = this._onWillShowDialog.event;

	private readonly _onDidShowDialog = this._register(new Emitter<void>());
	readonly onDidShowDialog = this._onDidShowDialog.event;

	show(dialog: IDialogArgs): IDialogHandle {
		const promise = new DeferredPromise<IDialogResult | undefined>();

		const item: IDialogViewItem = {
			args: dialog,
			close: result => {
				this.dialogs.splice(0, 1);
				if (result instanceof Error) {
					promise.error(result);
				} else {
					promise.complete(result);
				}
				this._onDidShowDialog.fire();
			}
		};

		this.dialogs.push(item);
		this._onWillShowDialog.fire();

		return {
			item,
			result: promise.p
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor.ts]---
Location: vscode-main/src/vs/workbench/common/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { Event } from '../../base/common/event.js';
import { DeepRequiredNonNullable, assertReturnsDefined } from '../../base/common/types.js';
import { URI } from '../../base/common/uri.js';
import { Disposable, IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { ICodeEditorViewState, IDiffEditor, IDiffEditorViewState, IEditor, IEditorViewState } from '../../editor/common/editorCommon.js';
import { IEditorOptions, IResourceEditorInput, ITextResourceEditorInput, IBaseTextResourceEditorInput, IBaseUntypedEditorInput, ITextEditorOptions } from '../../platform/editor/common/editor.js';
import type { EditorInput } from './editor/editorInput.js';
import { IInstantiationService, IConstructorSignature, ServicesAccessor, BrandedService } from '../../platform/instantiation/common/instantiation.js';
import { IContextKeyService } from '../../platform/contextkey/common/contextkey.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IEncodingSupport, ILanguageSupport } from '../services/textfile/common/textfiles.js';
import { IEditorGroup } from '../services/editor/common/editorGroupsService.js';
import { ICompositeControl, IComposite } from './composite.js';
import { FileType, IFileReadLimits, IFileService } from '../../platform/files/common/files.js';
import { IPathData } from '../../platform/window/common/window.js';
import { IExtUri } from '../../base/common/resources.js';
import { Schemas } from '../../base/common/network.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IErrorWithActions, createErrorWithActions, isErrorWithActions } from '../../base/common/errorMessage.js';
import { IAction, toAction } from '../../base/common/actions.js';
import Severity from '../../base/common/severity.js';
import { IPreferencesService } from '../services/preferences/common/preferences.js';
import { IReadonlyEditorGroupModel } from './editor/editorGroupModel.js';

// Static values for editor contributions
export const EditorExtensions = {
	EditorPane: 'workbench.contributions.editors',
	EditorFactory: 'workbench.contributions.editor.inputFactories'
};

// Static information regarding the text editor
export const DEFAULT_EDITOR_ASSOCIATION = {
	id: 'default',
	displayName: localize('promptOpenWith.defaultEditor.displayName', "Text Editor"),
	providerDisplayName: localize('builtinProviderDisplayName', "Built-in")
};

/**
 * Side by side editor id.
 */
export const SIDE_BY_SIDE_EDITOR_ID = 'workbench.editor.sidebysideEditor';

/**
 * Text diff editor id.
 */
export const TEXT_DIFF_EDITOR_ID = 'workbench.editors.textDiffEditor';

/**
 * Binary diff editor id.
 */
export const BINARY_DIFF_EDITOR_ID = 'workbench.editors.binaryResourceDiffEditor';

export interface IEditorDescriptor<T extends IEditorPane> {

	/**
	 * The unique type identifier of the editor. All instances
	 * of the same `IEditorPane` should have the same type
	 * identifier.
	 */
	readonly typeId: string;

	/**
	 * The display name of the editor.
	 */
	readonly name: string;

	/**
	 * Instantiates the editor pane using the provided services.
	 */
	instantiate(instantiationService: IInstantiationService, group: IEditorGroup): T;

	/**
	 * Whether the descriptor is for the provided editor pane.
	 */
	describes(editorPane: T): boolean;
}

/**
 * The editor pane is the container for workbench editors.
 */
export interface IEditorPane extends IComposite {

	/**
	 * An event to notify when the `IEditorControl` in this
	 * editor pane changes.
	 *
	 * This can be used for editor panes that are a compound
	 * of multiple editor controls to signal that the active
	 * editor control has changed when the user clicks around.
	 */
	readonly onDidChangeControl: Event<void>;

	/**
	 * An optional event to notify when the selection inside the editor
	 * pane changed in case the editor has a selection concept.
	 *
	 * For example, in a text editor pane, the selection changes whenever
	 * the cursor is set to a new location.
	 */
	readonly onDidChangeSelection?: Event<IEditorPaneSelectionChangeEvent>;

	/**
	 * An optional event to notify when the editor inside the pane scrolled
	 */
	readonly onDidChangeScroll?: Event<void>;

	/**
	 * The assigned input of this editor.
	 */
	readonly input: EditorInput | undefined;

	/**
	 * The assigned options of the editor.
	 */
	readonly options: IEditorOptions | undefined;

	/**
	 * The assigned group this editor is showing in.
	 */
	readonly group: IEditorGroup;

	/**
	 * The minimum width of this editor.
	 */
	readonly minimumWidth: number;

	/**
	 * The maximum width of this editor.
	 */
	readonly maximumWidth: number;

	/**
	 * The minimum height of this editor.
	 */
	readonly minimumHeight: number;

	/**
	 * The maximum height of this editor.
	 */
	readonly maximumHeight: number;

	/**
	 * An event to notify whenever minimum/maximum width/height changes.
	 */
	readonly onDidChangeSizeConstraints: Event<{ width: number; height: number } | undefined>;

	/**
	 * The context key service for this editor. Should be overridden by
	 * editors that have their own ScopedContextKeyService
	 */
	readonly scopedContextKeyService: IContextKeyService | undefined;

	/**
	 * Returns the underlying control of this editor. Callers need to cast
	 * the control to a specific instance as needed, e.g. by using the
	 * `isCodeEditor` helper method to access the text code editor.
	 *
	 * Use the `onDidChangeControl` event to track whenever the control
	 * changes.
	 */
	getControl(): IEditorControl | undefined;

	/**
	 * Returns the current view state of the editor if any.
	 *
	 * This method is optional to override for the editor pane
	 * and should only be overridden when the pane can deal with
	 * `IEditorOptions.viewState` to be applied when opening.
	 */
	getViewState(): object | undefined;

	/**
	 * An optional method to return the current selection in
	 * the editor pane in case the editor pane has a selection
	 * concept.
	 *
	 * Clients of this method will typically react to the
	 * `onDidChangeSelection` event to receive the current
	 * selection as needed.
	 */
	getSelection?(): IEditorPaneSelection | undefined;

	/**
	 * An optional method to return the current scroll position
	 * of an editor inside the pane.
	 *
	 * Clients of this method will typically react to the
	 * `onDidChangeScroll` event to receive the current
	 * scroll position as needed.
	 */
	getScrollPosition?(): IEditorPaneScrollPosition;

	/**
	 * An optional method to set the current scroll position
	 * of an editor inside the pane.
	 */
	setScrollPosition?(scrollPosition: IEditorPaneScrollPosition): void;

	/**
	 * Finds out if this editor is visible or not.
	 */
	isVisible(): boolean;
}

export interface IEditorPaneSelectionChangeEvent {

	/**
	 * More details for how the selection was made.
	 */
	reason: EditorPaneSelectionChangeReason;
}

export const enum EditorPaneSelectionChangeReason {

	/**
	 * The selection was changed as a result of a programmatic
	 * method invocation.
	 *
	 * For a text editor pane, this for example can be a selection
	 * being restored from previous view state automatically.
	 */
	PROGRAMMATIC = 1,

	/**
	 * The selection was changed by the user.
	 *
	 * This typically means the user changed the selection
	 * with mouse or keyboard.
	 */
	USER,

	/**
	 * The selection was changed as a result of editing in
	 * the editor pane.
	 *
	 * For a text editor pane, this for example can be typing
	 * in the text of the editor pane.
	 */
	EDIT,

	/**
	 * The selection was changed as a result of a navigation
	 * action.
	 *
	 * For a text editor pane, this for example can be a result
	 * of selecting an entry from a text outline view.
	 */
	NAVIGATION,

	/**
	 * The selection was changed as a result of a jump action
	 * from within the editor pane.
	 *
	 * For a text editor pane, this for example can be a result
	 * of invoking "Go to definition" from a symbol.
	 */
	JUMP
}

export interface IEditorPaneSelection {

	/**
	 * Asks to compare this selection to another selection.
	 */
	compare(otherSelection: IEditorPaneSelection): EditorPaneSelectionCompareResult;

	/**
	 * Asks to massage the provided `options` in a way
	 * that the selection can be restored when the editor
	 * is opened again.
	 *
	 * For a text editor this means to apply the selected
	 * line and column as text editor options.
	 */
	restore(options: IEditorOptions): IEditorOptions;

	/**
	 * Only used for logging to print more info about the selection.
	 */
	log?(): string;
}

export const enum EditorPaneSelectionCompareResult {

	/**
	 * The selections are identical.
	 */
	IDENTICAL = 1,

	/**
	 * The selections are similar.
	 *
	 * For a text editor this can mean that the one
	 * selection is in close proximity to the other
	 * selection.
	 *
	 * Upstream clients may decide in this case to
	 * not treat the selection different from the
	 * previous one because it is not distinct enough.
	 */
	SIMILAR = 2,

	/**
	 * The selections are entirely different.
	 */
	DIFFERENT = 3
}

export interface IEditorPaneWithSelection extends IEditorPane {

	readonly onDidChangeSelection: Event<IEditorPaneSelectionChangeEvent>;

	getSelection(): IEditorPaneSelection | undefined;
}

export function isEditorPaneWithSelection(editorPane: IEditorPane | undefined): editorPane is IEditorPaneWithSelection {
	const candidate = editorPane as IEditorPaneWithSelection | undefined;

	return !!candidate && typeof candidate.getSelection === 'function' && !!candidate.onDidChangeSelection;
}

export interface IEditorPaneWithScrolling extends IEditorPane {

	readonly onDidChangeScroll: Event<void>;

	getScrollPosition(): IEditorPaneScrollPosition;

	setScrollPosition(position: IEditorPaneScrollPosition): void;
}

export function isEditorPaneWithScrolling(editorPane: IEditorPane | undefined): editorPane is IEditorPaneWithScrolling {
	const candidate = editorPane as IEditorPaneWithScrolling | undefined;

	return !!candidate && typeof candidate.getScrollPosition === 'function' && typeof candidate.setScrollPosition === 'function' && !!candidate.onDidChangeScroll;
}

/**
 * Scroll position of a pane
 */
export interface IEditorPaneScrollPosition {
	readonly scrollTop: number;
	readonly scrollLeft?: number;
}

/**
 * Try to retrieve the view state for the editor pane that
 * has the provided editor input opened, if at all.
 *
 * This method will return `undefined` if the editor input
 * is not visible in any of the opened editor panes.
 */
export function findViewStateForEditor(input: EditorInput, group: GroupIdentifier, editorService: IEditorService): object | undefined {
	for (const editorPane of editorService.visibleEditorPanes) {
		if (editorPane.group.id === group && input.matches(editorPane.input)) {
			return editorPane.getViewState();
		}
	}

	return undefined;
}

/**
 * Overrides `IEditorPane` where `input` and `group` are known to be set.
 */
export interface IVisibleEditorPane extends IEditorPane {
	readonly input: EditorInput;
}

/**
 * The text editor pane is the container for workbench text editors.
 */
export interface ITextEditorPane extends IEditorPane {

	/**
	 * Returns the underlying text editor widget of this editor.
	 */
	getControl(): IEditor | undefined;
}

/**
 * The text editor pane is the container for workbench text diff editors.
 */
export interface ITextDiffEditorPane extends IEditorPane {

	/**
	 * Returns the underlying text diff editor widget of this editor.
	 */
	getControl(): IDiffEditor | undefined;
}

/**
 * Marker interface for the control inside an editor pane. Callers
 * have to cast the control to work with it, e.g. via methods
 * such as `isCodeEditor(control)`.
 */
export interface IEditorControl extends ICompositeControl { }

export interface IFileEditorFactory {

	/**
	 * The type identifier of the file editor.
	 */
	typeId: string;

	/**
	 * Creates new editor capable of showing files.
	 */
	createFileEditor(resource: URI, preferredResource: URI | undefined, preferredName: string | undefined, preferredDescription: string | undefined, preferredEncoding: string | undefined, preferredLanguageId: string | undefined, preferredContents: string | undefined, instantiationService: IInstantiationService): IFileEditorInput;

	/**
	 * Check if the provided object is a file editor.
	 */
	isFileEditor(obj: unknown): obj is IFileEditorInput;
}

export interface IEditorFactoryRegistry {

	/**
	 * Registers the file editor factory to use for file editors.
	 */
	registerFileEditorFactory(factory: IFileEditorFactory): void;

	/**
	 * Returns the file editor factory to use for file editors.
	 */
	getFileEditorFactory(): IFileEditorFactory;

	/**
	 * Registers a editor serializer for the given editor to the registry.
	 * An editor serializer is capable of serializing and deserializing editor
	 * from string data.
	 *
	 * @param editorTypeId the type identifier of the editor
	 * @param serializer the editor serializer for serialization/deserialization
	 */
	registerEditorSerializer<Services extends BrandedService[]>(editorTypeId: string, ctor: { new(...Services: Services): IEditorSerializer }): IDisposable;

	/**
	 * Returns the editor serializer for the given editor.
	 */
	getEditorSerializer(editor: EditorInput): IEditorSerializer | undefined;
	getEditorSerializer(editorTypeId: string): IEditorSerializer | undefined;

	/**
	 * Starts the registry by providing the required services.
	 */
	start(accessor: ServicesAccessor): void;
}

export interface IEditorSerializer {

	/**
	 * Determines whether the given editor can be serialized by the serializer.
	 */
	canSerialize(editor: EditorInput): boolean;

	/**
	 * Returns a string representation of the provided editor that contains enough information
	 * to deserialize back to the original editor from the deserialize() method.
	 */
	serialize(editor: EditorInput): string | undefined;

	/**
	 * Returns an editor from the provided serialized form of the editor. This form matches
	 * the value returned from the serialize() method.
	 */
	deserialize(instantiationService: IInstantiationService, serializedEditor: string): EditorInput | undefined;
}

export interface IUntitledTextResourceEditorInput extends IBaseTextResourceEditorInput {

	/**
	 * Optional resource for the untitled editor. Depending on the value, the editor:
	 * - should get a unique name if `undefined` (for example `Untitled-1`)
	 * - should use the resource directly if the scheme is `untitled:`
	 * - should change the scheme to `untitled:` otherwise and assume an associated path
	 *
	 * Untitled editors with associated path behave slightly different from other untitled
	 * editors:
	 * - they are dirty right when opening
	 * - they will not ask for a file path when saving but use the associated path
	 */
	readonly resource: URI | undefined;
}

/**
 * A resource side by side editor input shows 2 editors side by side but
 * without highlighting any differences.
 *
 * Note: both sides will be resolved as editor individually. As such, it is
 * possible to show 2 different editors side by side.
 *
 * @see {@link IResourceDiffEditorInput} for a variant that compares 2 editors.
 */
export interface IResourceSideBySideEditorInput extends IBaseUntypedEditorInput {

	/**
	 * The right hand side editor to open inside a side-by-side editor.
	 */
	readonly primary: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;

	/**
	 * The left hand side editor to open inside a side-by-side editor.
	 */
	readonly secondary: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;
}

/**
 * A resource diff editor input compares 2 editors side by side
 * highlighting the differences.
 *
 * Note: both sides must be resolvable to the same editor, or
 * a text based presentation will be used as fallback.
 */
export interface IResourceDiffEditorInput extends IBaseUntypedEditorInput {

	/**
	 * The left hand side editor to open inside a diff editor.
	 */
	readonly original: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;

	/**
	 * The right hand side editor to open inside a diff editor.
	 */
	readonly modified: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;
}

export interface ITextResourceDiffEditorInput extends IBaseTextResourceEditorInput {

	/**
	 * The left hand side text editor to open inside a diff editor.
	 */
	readonly original: Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;

	/**
	 * The right hand side text editor to open inside a diff editor.
	 */
	readonly modified: Omit<ITextResourceEditorInput, 'options'> | Omit<IUntitledTextResourceEditorInput, 'options'>;
}

/**
 * A resource list diff editor input compares multiple resources side by side
 * highlighting the differences.
 */
export interface IResourceMultiDiffEditorInput extends IBaseUntypedEditorInput {
	/**
	 * A unique identifier of this multi diff editor input.
	 * If a second multi diff editor with the same uri is opened, the existing one is revealed instead (even if the resources list is different!).
	 */
	readonly multiDiffSource?: URI;

	/**
	 * The list of resources to compare.
	 * If not set, the resources are dynamically derived from the {@link multiDiffSource}.
	 */
	readonly resources?: IMultiDiffEditorResource[];

	/**
	 * Whether the editor should be serialized and stored for subsequent sessions.
	 */
	readonly isTransient?: boolean;
}

export interface IMultiDiffEditorResource extends IResourceDiffEditorInput {
	readonly goToFileResource?: URI;
}
export type IResourceMergeEditorInputSide = (Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'>) & { detail?: string };

/**
 * A resource merge editor input compares multiple editors
 * highlighting the differences for merging.
 *
 * Note: all sides must be resolvable to the same editor, or
 * a text based presentation will be used as fallback.
 */
export interface IResourceMergeEditorInput extends IBaseUntypedEditorInput {

	/**
	 * The one changed version of the file.
	 */
	readonly input1: IResourceMergeEditorInputSide;

	/**
	 * The second changed version of the file.
	 */
	readonly input2: IResourceMergeEditorInputSide;

	/**
	 * The base common ancestor of the file to merge.
	 */
	readonly base: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'>;

	/**
	 * The resulting output of the merge.
	 */
	readonly result: Omit<IResourceEditorInput, 'options'> | Omit<ITextResourceEditorInput, 'options'>;
}

export function isResourceEditorInput(editor: unknown): editor is IResourceEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	const candidate = editor as IResourceEditorInput | undefined;

	return URI.isUri(candidate?.resource);
}

export function isResourceDiffEditorInput(editor: unknown): editor is IResourceDiffEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	const candidate = editor as IResourceDiffEditorInput | undefined;

	return candidate?.original !== undefined && candidate.modified !== undefined;
}

export function isResourceMultiDiffEditorInput(editor: unknown): editor is IResourceMultiDiffEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	const candidate = editor as IResourceMultiDiffEditorInput | undefined;
	if (!candidate) {
		return false;
	}
	if (candidate.resources && !Array.isArray(candidate.resources)) {
		return false;
	}

	return !!candidate.resources || !!candidate.multiDiffSource;
}

export function isResourceSideBySideEditorInput(editor: unknown): editor is IResourceSideBySideEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	if (isResourceDiffEditorInput(editor)) {
		return false; // make sure to not accidentally match on diff editors
	}

	const candidate = editor as IResourceSideBySideEditorInput | undefined;

	return candidate?.primary !== undefined && candidate.secondary !== undefined;
}

export function isUntitledResourceEditorInput(editor: unknown): editor is IUntitledTextResourceEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	const candidate = editor as IUntitledTextResourceEditorInput | undefined;
	if (!candidate) {
		return false;
	}

	return candidate.resource === undefined || candidate.resource.scheme === Schemas.untitled || candidate.forceUntitled === true;
}

export function isResourceMergeEditorInput(editor: unknown): editor is IResourceMergeEditorInput {
	if (isEditorInput(editor)) {
		return false; // make sure to not accidentally match on typed editor inputs
	}

	const candidate = editor as IResourceMergeEditorInput | undefined;

	return URI.isUri(candidate?.base?.resource) && URI.isUri(candidate?.input1?.resource) && URI.isUri(candidate?.input2?.resource) && URI.isUri(candidate?.result?.resource);
}

export const enum Verbosity {
	SHORT,
	MEDIUM,
	LONG
}

export const enum SaveReason {

	/**
	 * Explicit user gesture.
	 */
	EXPLICIT = 1,

	/**
	 * Auto save after a timeout.
	 */
	AUTO = 2,

	/**
	 * Auto save after editor focus change.
	 */
	FOCUS_CHANGE = 3,

	/**
	 * Auto save after window change.
	 */
	WINDOW_CHANGE = 4
}

export type SaveSource = string;

interface ISaveSourceDescriptor {
	source: SaveSource;
	label: string;
}

class SaveSourceFactory {

	private readonly mapIdToSaveSource = new Map<SaveSource, ISaveSourceDescriptor>();

	/**
	 * Registers a `SaveSource` with an identifier and label
	 * to the registry so that it can be used in save operations.
	 */
	registerSource(id: string, label: string): SaveSource {
		let sourceDescriptor = this.mapIdToSaveSource.get(id);
		if (!sourceDescriptor) {
			sourceDescriptor = { source: id, label };
			this.mapIdToSaveSource.set(id, sourceDescriptor);
		}

		return sourceDescriptor.source;
	}

	getSourceLabel(source: SaveSource): string {
		return this.mapIdToSaveSource.get(source)?.label ?? source;
	}
}

export const SaveSourceRegistry = new SaveSourceFactory();

export interface ISaveOptions {

	/**
	 * An indicator how the save operation was triggered.
	 */
	reason?: SaveReason;

	/**
	 * An indicator about the source of the save operation.
	 *
	 * Must use `SaveSourceRegistry.registerSource()` to obtain.
	 */
	readonly source?: SaveSource;

	/**
	 * Forces to save the contents of the working copy
	 * again even if the working copy is not dirty.
	 */
	readonly force?: boolean;

	/**
	 * Instructs the save operation to skip any save participants.
	 */
	readonly skipSaveParticipants?: boolean;

	/**
	 * A hint as to which file systems should be available for saving.
	 */
	readonly availableFileSystems?: string[];
}

export interface IRevertOptions {

	/**
	 * Forces to load the contents of the working copy
	 * again even if the working copy is not dirty.
	 */
	readonly force?: boolean;

	/**
	 * A soft revert will clear dirty state of a working copy
	 * but will not attempt to load it from its persisted state.
	 *
	 * This option may be used in scenarios where an editor is
	 * closed and where we do not require to load the contents.
	 */
	readonly soft?: boolean;
}

export interface IMoveResult {
	editor: EditorInput | IUntypedEditorInput;
	options?: IEditorOptions;
}

export const enum EditorInputCapabilities {

	/**
	 * Signals no specific capability for the input.
	 */
	None = 0,

	/**
	 * Signals that the input is readonly.
	 */
	Readonly = 1 << 1,

	/**
	 * Signals that the input is untitled.
	 */
	Untitled = 1 << 2,

	/**
	 * Signals that the input can only be shown in one group
	 * and not be split into multiple groups.
	 */
	Singleton = 1 << 3,

	/**
	 * Signals that the input requires workspace trust.
	 */
	RequiresTrust = 1 << 4,

	/**
	 * Signals that the editor can split into 2 in the same
	 * editor group.
	 */
	CanSplitInGroup = 1 << 5,

	/**
	 * Signals that the editor wants its description to be
	 * visible when presented to the user. By default, a UI
	 * component may decide to hide the description portion
	 * for brevity.
	 */
	ForceDescription = 1 << 6,

	/**
	 * Signals that the editor supports dropping into the
	 * editor by holding shift.
	 */
	CanDropIntoEditor = 1 << 7,

	/**
	 * Signals that the editor is composed of multiple editors
	 * within.
	 */
	MultipleEditors = 1 << 8,

	/**
	 * Signals that the editor cannot be in a dirty state
	 * and may still have unsaved changes
	 */
	Scratchpad = 1 << 9
}

export type IUntypedEditorInput = IResourceEditorInput | ITextResourceEditorInput | IUntitledTextResourceEditorInput | IResourceDiffEditorInput | IResourceMultiDiffEditorInput | IResourceSideBySideEditorInput | IResourceMergeEditorInput;

export abstract class AbstractEditorInput extends Disposable {
	// Marker class for implementing `isEditorInput`
}

export function isEditorInput(editor: unknown): editor is EditorInput {
	return editor instanceof AbstractEditorInput;
}

export interface EditorInputWithPreferredResource {

	/**
	 * An editor may provide an additional preferred resource alongside
	 * the `resource` property. While the `resource` property serves as
	 * unique identifier of the editor that should be used whenever we
	 * compare to other editors, the `preferredResource` should be used
	 * in places where e.g. the resource is shown to the user.
	 *
	 * For example: on Windows and macOS, the same URI with different
	 * casing may point to the same file. The editor may chose to
	 * "normalize" the URIs so that only one editor opens for different
	 * URIs. But when displaying the editor label to the user, the
	 * preferred URI should be used.
	 *
	 * Not all editors have a `preferredResource`. The `EditorResourceAccessor`
	 * utility can be used to always get the right resource without having
	 * to do instanceof checks.
	 */
	readonly preferredResource: URI;
}

function isEditorInputWithPreferredResource(editor: unknown): editor is EditorInputWithPreferredResource {
	const candidate = editor as EditorInputWithPreferredResource | undefined;

	return URI.isUri(candidate?.preferredResource);
}

export interface ISideBySideEditorInput extends EditorInput {

	/**
	 * The primary editor input is shown on the right hand side.
	 */
	primary: EditorInput;

	/**
	 * The secondary editor input is shown on the left hand side.
	 */
	secondary: EditorInput;
}

export function isSideBySideEditorInput(editor: unknown): editor is ISideBySideEditorInput {
	const candidate = editor as ISideBySideEditorInput | undefined;

	return isEditorInput(candidate?.primary) && isEditorInput(candidate?.secondary);
}

export interface IDiffEditorInput extends EditorInput {

	/**
	 * The modified (primary) editor input is shown on the right hand side.
	 */
	modified: EditorInput;

	/**
	 * The original (secondary) editor input is shown on the left hand side.
	 */
	original: EditorInput;
}

export function isDiffEditorInput(editor: unknown): editor is IDiffEditorInput {
	const candidate = editor as IDiffEditorInput | undefined;

	return isEditorInput(candidate?.modified) && isEditorInput(candidate?.original);
}

export interface IUntypedFileEditorInput extends ITextResourceEditorInput {

	/**
	 * A marker to create a `IFileEditorInput` from this untyped input.
	 */
	forceFile: true;
}

/**
 * This is a tagging interface to declare an editor input being capable of dealing with files. It is only used in the editor registry
 * to register this kind of input to the platform.
 */
export interface IFileEditorInput extends EditorInput, IEncodingSupport, ILanguageSupport, EditorInputWithPreferredResource {

	/**
	 * Gets the resource this file input is about. This will always be the
	 * canonical form of the resource, so it may differ from the original
	 * resource that was provided to create the input. Use `preferredResource`
	 * for the form as it was created.
	 */
	readonly resource: URI;

	/**
	 * Sets the preferred resource to use for this file input.
	 */
	setPreferredResource(preferredResource: URI): void;

	/**
	 * Sets the preferred name to use for this file input.
	 *
	 * Note: for certain file schemes the input may decide to ignore this
	 * name and use our standard naming. Specifically for schemes we own,
	 * we do not let others override the name.
	 */
	setPreferredName(name: string): void;

	/**
	 * Sets the preferred description to use for this file input.
	 *
	 * Note: for certain file schemes the input may decide to ignore this
	 * description and use our standard naming. Specifically for schemes we own,
	 * we do not let others override the description.
	 */
	setPreferredDescription(description: string): void;

	/**
	 * Sets the preferred encoding to use for this file input.
	 */
	setPreferredEncoding(encoding: string): void;

	/**
	 * Sets the preferred language id to use for this file input.
	 */
	setPreferredLanguageId(languageId: string): void;

	/**
	 * Sets the preferred contents to use for this file input.
	 */
	setPreferredContents(contents: string): void;

	/**
	 * Forces this file input to open as binary instead of text.
	 */
	setForceOpenAsBinary(): void;

	/**
	 * Figure out if the file input has been resolved or not.
	 */
	isResolved(): boolean;
}

export interface IFileLimitedEditorInputOptions extends IEditorOptions {

	/**
	 * If provided, the size of the file will be checked against the limits
	 * and an error will be thrown if any limit is exceeded.
	 */
	readonly limits?: IFileReadLimits;
}

export interface IFileEditorInputOptions extends ITextEditorOptions, IFileLimitedEditorInputOptions { }

export function createTooLargeFileError(group: IEditorGroup, input: EditorInput, options: IEditorOptions | undefined, message: string, preferencesService: IPreferencesService): Error {
	return createEditorOpenError(message, [
		toAction({
			id: 'workbench.action.openLargeFile', label: localize('openLargeFile', "Open Anyway"), run: () => {
				const fileEditorOptions: IFileEditorInputOptions = {
					...options,
					limits: {
						size: Number.MAX_VALUE
					}
				};

				group.openEditor(input, fileEditorOptions);
			}
		}),
		toAction({
			id: 'workbench.action.configureEditorLargeFileConfirmation', label: localize('configureEditorLargeFileConfirmation', "Configure Limit"), run: () => {
				return preferencesService.openUserSettings({ query: 'workbench.editorLargeFileConfirmation' });
			}
		}),
	], {
		forceMessage: true,
		forceSeverity: Severity.Warning
	});
}

export interface EditorInputWithOptions {
	editor: EditorInput;
	options?: IEditorOptions;
}

export interface EditorInputWithOptionsAndGroup extends EditorInputWithOptions {
	group: IEditorGroup;
}

export function isEditorInputWithOptions(editor: unknown): editor is EditorInputWithOptions {
	const candidate = editor as EditorInputWithOptions | undefined;

	return isEditorInput(candidate?.editor);
}

export function isEditorInputWithOptionsAndGroup(editor: unknown): editor is EditorInputWithOptionsAndGroup {
	const candidate = editor as EditorInputWithOptionsAndGroup | undefined;

	return isEditorInputWithOptions(editor) && candidate?.group !== undefined;
}

/**
 * Context passed into `EditorPane#setInput` to give additional
 * context information around why the editor was opened.
 */
export interface IEditorOpenContext {

	/**
	 * An indicator if the editor input is new for the group the editor is in.
	 * An editor is new for a group if it was not part of the group before and
	 * otherwise was already opened in the group and just became the active editor.
	 *
	 * This hint can e.g. be used to decide whether to restore view state or not.
	 */
	newInGroup?: boolean;
}

export interface IEditorIdentifier {
	groupId: GroupIdentifier;
	editor: EditorInput;
}

export function isEditorIdentifier(identifier: unknown): identifier is IEditorIdentifier {
	const candidate = identifier as IEditorIdentifier | undefined;

	return typeof candidate?.groupId === 'number' && isEditorInput(candidate.editor);
}

/**
 * The editor commands context is used for editor commands (e.g. in the editor title)
 * and we must ensure that the context is serializable because it potentially travels
 * to the extension host!
 */
export interface IEditorCommandsContext {
	groupId: GroupIdentifier;
	editorIndex?: number;

	preserveFocus?: boolean;
}

export function isEditorCommandsContext(context: unknown): context is IEditorCommandsContext {
	const candidate = context as IEditorCommandsContext | undefined;

	return typeof candidate?.groupId === 'number';
}

/**
 * More information around why an editor was closed in the model.
 */
export enum EditorCloseContext {

	/**
	 * No specific context for closing (e.g. explicit user gesture).
	 */
	UNKNOWN,

	/**
	 * The editor closed because it was replaced with another editor.
	 * This can either happen via explicit replace call or when an
	 * editor is in preview mode and another editor opens.
	 */
	REPLACE,

	/**
	 * The editor closed as a result of moving it to another group.
	 */
	MOVE,

	/**
	 * The editor closed because another editor turned into preview
	 * and this used to be the preview editor before.
	 */
	UNPIN
}

export interface IEditorCloseEvent extends IEditorIdentifier {

	/**
	 * More information around why the editor was closed.
	 */
	readonly context: EditorCloseContext;

	/**
	 * The index of the editor before closing.
	 */
	readonly index: number;

	/**
	 * Whether the editor was sticky or not.
	 */
	readonly sticky: boolean;
}

export interface IActiveEditorChangeEvent {

	/**
	 * The new active editor or `undefined` if the group is empty.
	 */
	editor: EditorInput | undefined;
}

export interface IEditorWillMoveEvent extends IEditorIdentifier {

	/**
	 * The target group of the move operation.
	 */
	readonly target: GroupIdentifier;
}

export interface IEditorWillOpenEvent extends IEditorIdentifier { }

export interface IWillInstantiateEditorPaneEvent {

	/**
	 * @see {@link IEditorDescriptor.typeId}
	 */
	readonly typeId: string;
}

export type GroupIdentifier = number;

export const enum GroupModelChangeKind {

	/* Group Changes */
	GROUP_ACTIVE,
	GROUP_INDEX,
	GROUP_LABEL,
	GROUP_LOCKED,

	/* Editors Change */
	EDITORS_SELECTION,

	/* Editor Changes */
	EDITOR_OPEN,
	EDITOR_CLOSE,
	EDITOR_MOVE,
	EDITOR_ACTIVE,
	EDITOR_LABEL,
	EDITOR_CAPABILITIES,
	EDITOR_PIN,
	EDITOR_TRANSIENT,
	EDITOR_STICKY,
	EDITOR_DIRTY,
	EDITOR_WILL_DISPOSE
}

export interface IWorkbenchEditorConfiguration {
	workbench?: {
		editor?: IEditorPartConfiguration;
		iconTheme?: string;
	};
}

interface IEditorPartLimitConfiguration {
	enabled?: boolean;
	excludeDirty?: boolean;
	value?: number;
	perEditorGroup?: boolean;
}

export interface IEditorPartLimitOptions extends Required<IEditorPartLimitConfiguration> { }

interface IEditorPartDecorationsConfiguration {
	badges?: boolean;
	colors?: boolean;
}

export interface IEditorPartDecorationOptions extends Required<IEditorPartDecorationsConfiguration> { }

interface IEditorPartConfiguration {
	showTabs?: 'multiple' | 'single' | 'none';
	wrapTabs?: boolean;
	scrollToSwitchTabs?: boolean;
	highlightModifiedTabs?: boolean;
	tabActionLocation?: 'left' | 'right';
	tabActionCloseVisibility?: boolean;
	tabActionUnpinVisibility?: boolean;
	showTabIndex?: boolean;
	alwaysShowEditorActions?: boolean;
	tabSizing?: 'fit' | 'shrink' | 'fixed';
	tabSizingFixedMinWidth?: number;
	tabSizingFixedMaxWidth?: number;
	pinnedTabSizing?: 'normal' | 'compact' | 'shrink';
	pinnedTabsOnSeparateRow?: boolean;
	tabHeight?: 'default' | 'compact';
	preventPinnedEditorClose?: PreventPinnedEditorClose;
	titleScrollbarSizing?: 'default' | 'large';
	titleScrollbarVisibility?: 'auto' | 'visible' | 'hidden';
	focusRecentEditorAfterClose?: boolean;
	showIcons?: boolean;
	enablePreview?: boolean;
	enablePreviewFromQuickOpen?: boolean;
	enablePreviewFromCodeNavigation?: boolean;
	closeOnFileDelete?: boolean;
	openPositioning?: 'left' | 'right' | 'first' | 'last';
	openSideBySideDirection?: 'right' | 'down';
	closeEmptyGroups?: boolean;
	autoLockGroups?: Set<string>;
	revealIfOpen?: boolean;
	swipeToNavigate?: boolean;
	mouseBackForwardToNavigate?: boolean;
	labelFormat?: 'default' | 'short' | 'medium' | 'long';
	restoreViewState?: boolean;
	splitInGroupLayout?: 'vertical' | 'horizontal';
	splitSizing?: 'auto' | 'split' | 'distribute';
	splitOnDragAndDrop?: boolean;
	dragToOpenWindow?: boolean;
	centeredLayoutFixedWidth?: boolean;
	doubleClickTabToToggleEditorGroupSizes?: 'maximize' | 'expand' | 'off';
	editorActionsLocation?: 'default' | 'titleBar' | 'hidden';
	limit?: IEditorPartLimitConfiguration;
	decorations?: IEditorPartDecorationsConfiguration;
}

export interface IEditorPartOptions extends DeepRequiredNonNullable<IEditorPartConfiguration> {
	hasIcons: boolean;
}

export interface IEditorPartOptionsChangeEvent {
	oldPartOptions: IEditorPartOptions;
	newPartOptions: IEditorPartOptions;
}

export enum SideBySideEditor {
	PRIMARY = 1,
	SECONDARY = 2,
	BOTH = 3,
	ANY = 4
}

export interface IFindEditorOptions {

	/**
	 * Whether to consider any or both side by side editor as matching.
	 * By default, side by side editors will not be considered
	 * as matching, even if the editor is opened in one of the sides.
	 */
	supportSideBySide?: SideBySideEditor.PRIMARY | SideBySideEditor.SECONDARY | SideBySideEditor.ANY;

	/**
	 * The order in which to consider editors for finding.
	 */
	order?: EditorsOrder;
}

export interface IMatchEditorOptions {

	/**
	 * Whether to consider a side by side editor as matching.
	 * By default, side by side editors will not be considered
	 * as matching, even if the editor is opened in one of the sides.
	 */
	supportSideBySide?: SideBySideEditor.ANY | SideBySideEditor.BOTH;

	/**
	 * Only consider an editor to match when the
	 * `candidate === editor` but not when
	 * `candidate.matches(editor)`.
	 */
	strictEquals?: boolean;
}

export interface IEditorResourceAccessorOptions {

	/**
	 * Allows to access the `resource(s)` of side by side editors. If not
	 * specified, a `resource` for a side by side editor will always be
	 * `undefined`.
	 */
	supportSideBySide?: SideBySideEditor;

	/**
	 * Allows to filter the scheme to consider. A resource scheme that does
	 * not match a filter will not be considered.
	 */
	filterByScheme?: string | string[];
}

class EditorResourceAccessorImpl {

	/**
	 * The original URI of an editor is the URI that was used originally to open
	 * the editor and should be used whenever the URI is presented to the user,
	 * e.g. as a label together with utility methods such as `ResourceLabel` or
	 * `ILabelService` that can turn this original URI into the best form for
	 * presenting.
	 *
	 * In contrast, the canonical URI (#getCanonicalUri) may be different and should
	 * be used whenever the URI is used to e.g. compare with other editors or when
	 * caching certain data based on the URI.
	 *
	 * For example: on Windows and macOS, the same file URI with different casing may
	 * point to the same file. The editor may chose to "normalize" the URI into a canonical
	 * form so that only one editor opens for same file URIs with different casing. As
	 * such, the original URI and the canonical URI can be different.
	 */
	getOriginalUri(editor: EditorInput | IUntypedEditorInput | undefined | null): URI | undefined;
	getOriginalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options: IEditorResourceAccessorOptions & { supportSideBySide?: SideBySideEditor.PRIMARY | SideBySideEditor.SECONDARY | SideBySideEditor.ANY }): URI | undefined;
	getOriginalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options: IEditorResourceAccessorOptions & { supportSideBySide: SideBySideEditor.BOTH }): URI | { primary?: URI; secondary?: URI } | undefined;
	getOriginalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options?: IEditorResourceAccessorOptions): URI | { primary?: URI; secondary?: URI } | undefined;
	getOriginalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options?: IEditorResourceAccessorOptions): URI | { primary?: URI; secondary?: URI } | undefined {
		if (!editor) {
			return undefined;
		}

		// Merge editors are handled with `merged` result editor
		if (isResourceMergeEditorInput(editor)) {
			return EditorResourceAccessor.getOriginalUri(editor.result, options);
		}

		// Optionally support side-by-side editors
		if (options?.supportSideBySide) {
			const { primary, secondary } = this.getSideEditors(editor);
			if (primary && secondary) {
				if (options?.supportSideBySide === SideBySideEditor.BOTH) {
					return {
						primary: this.getOriginalUri(primary, { filterByScheme: options.filterByScheme }),
						secondary: this.getOriginalUri(secondary, { filterByScheme: options.filterByScheme })
					};
				} else if (options?.supportSideBySide === SideBySideEditor.ANY) {
					return this.getOriginalUri(primary, { filterByScheme: options.filterByScheme }) ?? this.getOriginalUri(secondary, { filterByScheme: options.filterByScheme });
				}

				editor = options.supportSideBySide === SideBySideEditor.PRIMARY ? primary : secondary;
			}
		}

		if (isResourceDiffEditorInput(editor) || isResourceMultiDiffEditorInput(editor) || isResourceSideBySideEditorInput(editor) || isResourceMergeEditorInput(editor)) {
			return undefined;
		}

		// Original URI is the `preferredResource` of an editor if any
		const originalResource = isEditorInputWithPreferredResource(editor) ? editor.preferredResource : editor.resource;
		if (!originalResource || !options?.filterByScheme) {
			return originalResource;
		}

		return this.filterUri(originalResource, options.filterByScheme);
	}

	private getSideEditors(editor: EditorInput | IUntypedEditorInput): { primary: EditorInput | IUntypedEditorInput | undefined; secondary: EditorInput | IUntypedEditorInput | undefined } {
		if (isSideBySideEditorInput(editor) || isResourceSideBySideEditorInput(editor)) {
			return { primary: editor.primary, secondary: editor.secondary };
		}

		if (isDiffEditorInput(editor) || isResourceDiffEditorInput(editor)) {
			return { primary: editor.modified, secondary: editor.original };
		}

		return { primary: undefined, secondary: undefined };
	}

	/**
	 * The canonical URI of an editor is the true unique identifier of the editor
	 * and should be used whenever the URI is used e.g. to compare with other
	 * editors or when caching certain data based on the URI.
	 *
	 * In contrast, the original URI (#getOriginalUri) may be different and should
	 * be used whenever the URI is presented to the user, e.g. as a label.
	 *
	 * For example: on Windows and macOS, the same file URI with different casing may
	 * point to the same file. The editor may chose to "normalize" the URI into a canonical
	 * form so that only one editor opens for same file URIs with different casing. As
	 * such, the original URI and the canonical URI can be different.
	 */
	getCanonicalUri(editor: EditorInput | IUntypedEditorInput | undefined | null): URI | undefined;
	getCanonicalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options: IEditorResourceAccessorOptions & { supportSideBySide?: SideBySideEditor.PRIMARY | SideBySideEditor.SECONDARY | SideBySideEditor.ANY }): URI | undefined;
	getCanonicalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options: IEditorResourceAccessorOptions & { supportSideBySide: SideBySideEditor.BOTH }): URI | { primary?: URI; secondary?: URI } | undefined;
	getCanonicalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options?: IEditorResourceAccessorOptions): URI | { primary?: URI; secondary?: URI } | undefined;
	getCanonicalUri(editor: EditorInput | IUntypedEditorInput | undefined | null, options?: IEditorResourceAccessorOptions): URI | { primary?: URI; secondary?: URI } | undefined {
		if (!editor) {
			return undefined;
		}

		// Merge editors are handled with `merged` result editor
		if (isResourceMergeEditorInput(editor)) {
			return EditorResourceAccessor.getCanonicalUri(editor.result, options);
		}

		// Optionally support side-by-side editors
		if (options?.supportSideBySide) {
			const { primary, secondary } = this.getSideEditors(editor);
			if (primary && secondary) {
				if (options?.supportSideBySide === SideBySideEditor.BOTH) {
					return {
						primary: this.getCanonicalUri(primary, { filterByScheme: options.filterByScheme }),
						secondary: this.getCanonicalUri(secondary, { filterByScheme: options.filterByScheme })
					};
				} else if (options?.supportSideBySide === SideBySideEditor.ANY) {
					return this.getCanonicalUri(primary, { filterByScheme: options.filterByScheme }) ?? this.getCanonicalUri(secondary, { filterByScheme: options.filterByScheme });
				}

				editor = options.supportSideBySide === SideBySideEditor.PRIMARY ? primary : secondary;
			}
		}

		if (isResourceDiffEditorInput(editor) || isResourceMultiDiffEditorInput(editor) || isResourceSideBySideEditorInput(editor) || isResourceMergeEditorInput(editor)) {
			return undefined;
		}

		// Canonical URI is the `resource` of an editor
		const canonicalResource = editor.resource;
		if (!canonicalResource || !options?.filterByScheme) {
			return canonicalResource;
		}

		return this.filterUri(canonicalResource, options.filterByScheme);
	}

	private filterUri(resource: URI, filter: string | string[]): URI | undefined {

		// Multiple scheme filter
		if (Array.isArray(filter)) {
			if (filter.some(scheme => resource.scheme === scheme)) {
				return resource;
			}
		}

		// Single scheme filter
		else {
			if (filter === resource.scheme) {
				return resource;
			}
		}

		return undefined;
	}
}

export type PreventPinnedEditorClose = 'keyboardAndMouse' | 'keyboard' | 'mouse' | 'never' | undefined;

export enum EditorCloseMethod {
	UNKNOWN,
	KEYBOARD,
	MOUSE
}

export function preventEditorClose(group: IEditorGroup | IReadonlyEditorGroupModel, editor: EditorInput, method: EditorCloseMethod, configuration: IEditorPartConfiguration): boolean {
	if (!group.isSticky(editor)) {
		return false; // only interested in sticky editors
	}

	switch (configuration.preventPinnedEditorClose) {
		case 'keyboardAndMouse': return method === EditorCloseMethod.MOUSE || method === EditorCloseMethod.KEYBOARD;
		case 'mouse': return method === EditorCloseMethod.MOUSE;
		case 'keyboard': return method === EditorCloseMethod.KEYBOARD;
	}

	return false;
}

export const EditorResourceAccessor = new EditorResourceAccessorImpl();

export const enum CloseDirection {
	LEFT,
	RIGHT
}

export interface IEditorMemento<T> {

	saveEditorState(group: IEditorGroup, resource: URI, state: T): void;
	saveEditorState(group: IEditorGroup, editor: EditorInput, state: T): void;

	loadEditorState(group: IEditorGroup, resource: URI): T | undefined;
	loadEditorState(group: IEditorGroup, editor: EditorInput): T | undefined;

	clearEditorState(resource: URI, group?: IEditorGroup): void;
	clearEditorState(editor: EditorInput, group?: IEditorGroup): void;

	clearEditorStateOnDispose(resource: URI, editor: EditorInput): void;

	moveEditorState(source: URI, target: URI, comparer: IExtUri): void;
}

class EditorFactoryRegistry implements IEditorFactoryRegistry {
	private instantiationService: IInstantiationService | undefined;

	private fileEditorFactory: IFileEditorFactory | undefined;

	private readonly editorSerializerConstructors = new Map<string /* Type ID */, IConstructorSignature<IEditorSerializer>>();
	private readonly editorSerializerInstances = new Map<string /* Type ID */, IEditorSerializer>();

	start(accessor: ServicesAccessor): void {
		const instantiationService = this.instantiationService = accessor.get(IInstantiationService);

		for (const [key, ctor] of this.editorSerializerConstructors) {
			this.createEditorSerializer(key, ctor, instantiationService);
		}

		this.editorSerializerConstructors.clear();
	}

	private createEditorSerializer(editorTypeId: string, ctor: IConstructorSignature<IEditorSerializer>, instantiationService: IInstantiationService): void {
		const instance = instantiationService.createInstance(ctor);
		this.editorSerializerInstances.set(editorTypeId, instance);
	}

	registerFileEditorFactory(factory: IFileEditorFactory): void {
		if (this.fileEditorFactory) {
			throw new Error('Can only register one file editor factory.');
		}

		this.fileEditorFactory = factory;
	}

	getFileEditorFactory(): IFileEditorFactory {
		return assertReturnsDefined(this.fileEditorFactory);
	}

	registerEditorSerializer(editorTypeId: string, ctor: IConstructorSignature<IEditorSerializer>): IDisposable {
		if (this.editorSerializerConstructors.has(editorTypeId) || this.editorSerializerInstances.has(editorTypeId)) {
			throw new Error(`A editor serializer with type ID '${editorTypeId}' was already registered.`);
		}

		if (!this.instantiationService) {
			this.editorSerializerConstructors.set(editorTypeId, ctor);
		} else {
			this.createEditorSerializer(editorTypeId, ctor, this.instantiationService);
		}

		return toDisposable(() => {
			this.editorSerializerConstructors.delete(editorTypeId);
			this.editorSerializerInstances.delete(editorTypeId);
		});
	}

	getEditorSerializer(editor: EditorInput): IEditorSerializer | undefined;
	getEditorSerializer(editorTypeId: string): IEditorSerializer | undefined;
	getEditorSerializer(arg1: string | EditorInput): IEditorSerializer | undefined {
		return this.editorSerializerInstances.get(typeof arg1 === 'string' ? arg1 : arg1.typeId);
	}
}

Registry.add(EditorExtensions.EditorFactory, new EditorFactoryRegistry());

export async function pathsToEditors(paths: IPathData[] | undefined, fileService: IFileService, logService: ILogService): Promise<ReadonlyArray<IResourceEditorInput | IUntitledTextResourceEditorInput | undefined>> {
	if (!paths?.length) {
		return [];
	}

	return await Promise.all(paths.map(async path => {
		const resource = URI.revive(path.fileUri);
		if (!resource) {
			logService.info('Cannot resolve the path because it is not valid.', path);
			return undefined;
		}

		const canHandleResource = await fileService.canHandleResource(resource);
		if (!canHandleResource) {
			logService.info('Cannot resolve the path because it cannot be handled', path);
			return undefined;
		}

		let exists = path.exists;
		let type = path.type;
		if (typeof exists !== 'boolean' || typeof type !== 'number') {
			try {
				type = (await fileService.stat(resource)).isDirectory ? FileType.Directory : FileType.Unknown;
				exists = true;
			} catch (error) {
				logService.error(error);
				exists = false;
			}
		}

		if (!exists && path.openOnlyIfExists) {
			logService.info('Cannot resolve the path because it does not exist', path);
			return undefined;
		}

		if (type === FileType.Directory) {
			logService.info('Cannot resolve the path because it is a directory', path);
			return undefined;
		}

		const options: IEditorOptions = {
			...path.options,
			pinned: true
		};

		if (!exists) {
			return { resource, options, forceUntitled: true };
		}

		return { resource, options };
	}));
}

export const enum EditorsOrder {

	/**
	 * Editors sorted by most recent activity (most recent active first)
	 */
	MOST_RECENTLY_ACTIVE,

	/**
	 * Editors sorted by sequential order
	 */
	SEQUENTIAL
}

export function isTextEditorViewState(candidate: unknown): candidate is IEditorViewState {
	const viewState = candidate as IEditorViewState | undefined;
	if (!viewState) {
		return false;
	}

	const diffEditorViewState = viewState as IDiffEditorViewState;
	if (diffEditorViewState.modified) {
		return isTextEditorViewState(diffEditorViewState.modified);
	}

	const codeEditorViewState = viewState as ICodeEditorViewState;

	return !!(codeEditorViewState.contributionsState && codeEditorViewState.viewState && Array.isArray(codeEditorViewState.cursorState));
}

export interface IEditorOpenErrorOptions {

	/**
	 * If set to true, the message will be taken
	 * from the error message entirely and not be
	 * composed with more text.
	 */
	forceMessage?: boolean;

	/**
	 * If set, will override the severity of the error.
	 */
	forceSeverity?: Severity;

	/**
	 * If set to true, the error may be shown in a dialog
	 * to the user if the editor opening was triggered by
	 * user action. Otherwise and by default, the error will
	 * be shown as place holder in the editor area.
	 */
	allowDialog?: boolean;
}

export interface IEditorOpenError extends IErrorWithActions, IEditorOpenErrorOptions { }

export function isEditorOpenError(obj: unknown): obj is IEditorOpenError {
	return isErrorWithActions(obj);
}

export function createEditorOpenError(messageOrError: string | Error, actions: IAction[], options?: IEditorOpenErrorOptions): IEditorOpenError {
	const error: IEditorOpenError = createErrorWithActions(messageOrError, actions);

	error.forceMessage = options?.forceMessage;
	error.forceSeverity = options?.forceSeverity;
	error.allowDialog = options?.allowDialog;

	return error;
}

export interface IToolbarActions {
	readonly primary: IAction[];
	readonly secondary: IAction[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/memento.ts]---
Location: vscode-main/src/vs/workbench/common/memento.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { isEmptyObject } from '../../base/common/types.js';
import { onUnexpectedError } from '../../base/common/errors.js';
import { DisposableStore } from '../../base/common/lifecycle.js';
import { Event } from '../../base/common/event.js';

export class Memento<T extends object> {

	private static readonly applicationMementos = new Map<string, ScopedMemento<unknown>>();
	private static readonly profileMementos = new Map<string, ScopedMemento<unknown>>();
	private static readonly workspaceMementos = new Map<string, ScopedMemento<unknown>>();

	private static readonly COMMON_PREFIX = 'memento/';

	private readonly id: string;

	constructor(id: string, private storageService: IStorageService) {
		this.id = Memento.COMMON_PREFIX + id;
	}

	getMemento(scope: StorageScope, target: StorageTarget): Partial<T> {
		switch (scope) {
			case StorageScope.WORKSPACE: {
				let workspaceMemento = Memento.workspaceMementos.get(this.id);
				if (!workspaceMemento) {
					workspaceMemento = new ScopedMemento(this.id, scope, target, this.storageService);
					Memento.workspaceMementos.set(this.id, workspaceMemento);
				}

				return workspaceMemento.getMemento();
			}

			case StorageScope.PROFILE: {
				let profileMemento = Memento.profileMementos.get(this.id);
				if (!profileMemento) {
					profileMemento = new ScopedMemento(this.id, scope, target, this.storageService);
					Memento.profileMementos.set(this.id, profileMemento);
				}

				return profileMemento.getMemento();
			}

			case StorageScope.APPLICATION: {
				let applicationMemento = Memento.applicationMementos.get(this.id);
				if (!applicationMemento) {
					applicationMemento = new ScopedMemento(this.id, scope, target, this.storageService);
					Memento.applicationMementos.set(this.id, applicationMemento);
				}

				return applicationMemento.getMemento();
			}
		}
	}

	onDidChangeValue(scope: StorageScope, disposables: DisposableStore): Event<IStorageValueChangeEvent> {
		return this.storageService.onDidChangeValue(scope, this.id, disposables);
	}

	saveMemento(): void {
		Memento.workspaceMementos.get(this.id)?.save();
		Memento.profileMementos.get(this.id)?.save();
		Memento.applicationMementos.get(this.id)?.save();
	}

	reloadMemento(scope: StorageScope): void {
		let memento: ScopedMemento<unknown> | undefined;
		switch (scope) {
			case StorageScope.APPLICATION:
				memento = Memento.applicationMementos.get(this.id);
				break;
			case StorageScope.PROFILE:
				memento = Memento.profileMementos.get(this.id);
				break;
			case StorageScope.WORKSPACE:
				memento = Memento.workspaceMementos.get(this.id);
				break;
		}

		memento?.reload();
	}

	static clear(scope: StorageScope): void {
		switch (scope) {
			case StorageScope.WORKSPACE:
				Memento.workspaceMementos.clear();
				break;
			case StorageScope.PROFILE:
				Memento.profileMementos.clear();
				break;
			case StorageScope.APPLICATION:
				Memento.applicationMementos.clear();
				break;
		}
	}
}

class ScopedMemento<T> {

	private mementoObj: Partial<T>;

	constructor(private id: string, private scope: StorageScope, private target: StorageTarget, private storageService: IStorageService) {
		this.mementoObj = this.doLoad();
	}

	private doLoad(): Partial<T> {
		try {
			return this.storageService.getObject(this.id, this.scope, {});
		} catch (error) {
			// Seeing reports from users unable to open editors
			// from memento parsing exceptions. Log the contents
			// to diagnose further
			// https://github.com/microsoft/vscode/issues/102251
			onUnexpectedError(`[memento]: failed to parse contents: ${error} (id: ${this.id}, scope: ${this.scope}, contents: ${this.storageService.get(this.id, this.scope)})`);
		}

		return {};
	}

	getMemento(): Partial<T> {
		return this.mementoObj;
	}

	reload(): void {

		// Clear old
		for (const name of Object.getOwnPropertyNames(this.mementoObj)) {
			delete this.mementoObj[name as keyof Partial<T>];
		}

		// Assign new
		Object.assign(this.mementoObj, this.doLoad());
	}

	save(): void {
		if (!isEmptyObject(this.mementoObj)) {
			this.storageService.store(this.id, this.mementoObj, this.scope, this.target);
		} else {
			this.storageService.remove(this.id, this.scope);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/notifications.ts]---
Location: vscode-main/src/vs/workbench/common/notifications.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotification, INotificationHandle, INotificationActions, INotificationProgress, NoOpNotification, Severity, NotificationMessage, IPromptChoice, IStatusMessageOptions, NotificationsFilter, INotificationProgressProperties, IPromptChoiceWithMenu, NotificationPriority, INotificationSource, isNotificationSource, IStatusHandle } from '../../platform/notification/common/notification.js';
import { toErrorMessage, isErrorWithActions } from '../../base/common/errorMessage.js';
import { Event, Emitter } from '../../base/common/event.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { isCancellationError } from '../../base/common/errors.js';
import { Action } from '../../base/common/actions.js';
import { equals } from '../../base/common/arrays.js';
import { parseLinkedText, LinkedText } from '../../base/common/linkedText.js';
import { mapsStrictEqualIgnoreOrder } from '../../base/common/map.js';

export interface INotificationsModel {

	//#region Notifications as Toasts/Center

	readonly notifications: INotificationViewItem[];

	readonly onDidChangeNotification: Event<INotificationChangeEvent>;
	readonly onDidChangeFilter: Event<Partial<INotificationsFilter>>;

	addNotification(notification: INotification): INotificationHandle;

	setFilter(filter: Partial<INotificationsFilter>): void;

	//#endregion


	//#region Notifications as Status

	readonly statusMessage: IStatusMessageViewItem | undefined;

	readonly onDidChangeStatusMessage: Event<IStatusMessageChangeEvent>;

	showStatusMessage(message: NotificationMessage, options?: IStatusMessageOptions): IStatusHandle;

	//#endregion
}

export const enum NotificationChangeType {

	/**
	 * A notification was added.
	 */
	ADD,

	/**
	 * A notification changed. Check `detail` property
	 * on the event for additional information.
	 */
	CHANGE,

	/**
	 * A notification expanded or collapsed.
	 */
	EXPAND_COLLAPSE,

	/**
	 * A notification was removed.
	 */
	REMOVE
}

export interface INotificationChangeEvent {

	/**
	 * The index this notification has in the list of notifications.
	 */
	index: number;

	/**
	 * The notification this change is about.
	 */
	item: INotificationViewItem;

	/**
	 * The kind of notification change.
	 */
	kind: NotificationChangeType;

	/**
	 * Additional detail about the item change. Only applies to
	 * `NotificationChangeType.CHANGE`.
	 */
	detail?: NotificationViewItemContentChangeKind;
}

export const enum StatusMessageChangeType {
	ADD,
	REMOVE
}

export interface IStatusMessageViewItem {
	message: string;
	options?: IStatusMessageOptions;
}

export interface IStatusMessageChangeEvent {

	/**
	 * The status message item this change is about.
	 */
	item: IStatusMessageViewItem;

	/**
	 * The kind of status message change.
	 */
	kind: StatusMessageChangeType;
}

export class NotificationHandle extends Disposable implements INotificationHandle {

	private readonly _onDidClose = this._register(new Emitter<void>());
	readonly onDidClose = this._onDidClose.event;

	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	constructor(private readonly item: INotificationViewItem, private readonly onClose: (item: INotificationViewItem) => void) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Visibility
		this._register(this.item.onDidChangeVisibility(visible => this._onDidChangeVisibility.fire(visible)));

		// Closing
		Event.once(this.item.onDidClose)(() => {
			this._onDidClose.fire();

			this.dispose();
		});
	}

	get progress(): INotificationProgress {
		return this.item.progress;
	}

	updateSeverity(severity: Severity): void {
		this.item.updateSeverity(severity);
	}

	updateMessage(message: NotificationMessage): void {
		this.item.updateMessage(message);
	}

	updateActions(actions?: INotificationActions): void {
		this.item.updateActions(actions);
	}

	close(): void {
		this.onClose(this.item);

		this.dispose();
	}
}

export interface INotificationsFilter {
	readonly global: NotificationsFilter;
	readonly sources: Map<string, NotificationsFilter>;
}

export class NotificationsModel extends Disposable implements INotificationsModel {

	private static readonly NO_OP_NOTIFICATION = new NoOpNotification();

	private readonly _onDidChangeNotification = this._register(new Emitter<INotificationChangeEvent>());
	readonly onDidChangeNotification = this._onDidChangeNotification.event;

	private readonly _onDidChangeStatusMessage = this._register(new Emitter<IStatusMessageChangeEvent>());
	readonly onDidChangeStatusMessage = this._onDidChangeStatusMessage.event;

	private readonly _onDidChangeFilter = this._register(new Emitter<Partial<INotificationsFilter>>());
	readonly onDidChangeFilter = this._onDidChangeFilter.event;

	private readonly _notifications: INotificationViewItem[] = [];
	get notifications(): INotificationViewItem[] { return this._notifications; }

	private _statusMessage: IStatusMessageViewItem | undefined;
	get statusMessage(): IStatusMessageViewItem | undefined { return this._statusMessage; }

	private readonly filter = {
		global: NotificationsFilter.OFF,
		sources: new Map<string, NotificationsFilter>()
	};

	setFilter(filter: Partial<INotificationsFilter>): void {
		let globalChanged = false;
		if (typeof filter.global === 'number') {
			globalChanged = this.filter.global !== filter.global;
			this.filter.global = filter.global;
		}

		let sourcesChanged = false;
		if (filter.sources) {
			sourcesChanged = !mapsStrictEqualIgnoreOrder(this.filter.sources, filter.sources);
			this.filter.sources = filter.sources;
		}

		if (globalChanged || sourcesChanged) {
			this._onDidChangeFilter.fire({
				global: globalChanged ? filter.global : undefined,
				sources: sourcesChanged ? filter.sources : undefined
			});
		}
	}

	addNotification(notification: INotification): INotificationHandle {
		const item = this.createViewItem(notification);
		if (!item) {
			return NotificationsModel.NO_OP_NOTIFICATION; // return early if this is a no-op
		}

		// Deduplicate
		const duplicate = this.findNotification(item);
		duplicate?.close();

		// Add to list as first entry
		this._notifications.splice(0, 0, item);

		// Events
		this._onDidChangeNotification.fire({ item, index: 0, kind: NotificationChangeType.ADD });

		// Wrap into handle
		return new NotificationHandle(item, item => this.onClose(item));
	}

	private onClose(item: INotificationViewItem): void {
		const liveItem = this.findNotification(item);
		if (liveItem && liveItem !== item) {
			liveItem.close(); // item could have been replaced with another one, make sure to close the live item
		} else {
			item.close(); // otherwise just close the item that was passed in
		}
	}

	private findNotification(item: INotificationViewItem): INotificationViewItem | undefined {
		return this._notifications.find(notification => notification.equals(item));
	}

	private createViewItem(notification: INotification): INotificationViewItem | undefined {
		const item = NotificationViewItem.create(notification, this.filter);
		if (!item) {
			return undefined;
		}

		// Item Events
		const fireNotificationChangeEvent = (kind: NotificationChangeType, detail?: NotificationViewItemContentChangeKind) => {
			const index = this._notifications.indexOf(item);
			if (index >= 0) {
				this._onDidChangeNotification.fire({ item, index, kind, detail });
			}
		};

		const itemExpansionChangeListener = item.onDidChangeExpansion(() => fireNotificationChangeEvent(NotificationChangeType.EXPAND_COLLAPSE));
		const itemContentChangeListener = item.onDidChangeContent(e => fireNotificationChangeEvent(NotificationChangeType.CHANGE, e.kind));

		Event.once(item.onDidClose)(() => {
			itemExpansionChangeListener.dispose();
			itemContentChangeListener.dispose();

			const index = this._notifications.indexOf(item);
			if (index >= 0) {
				this._notifications.splice(index, 1);
				this._onDidChangeNotification.fire({ item, index, kind: NotificationChangeType.REMOVE });
			}
		});

		return item;
	}

	showStatusMessage(message: NotificationMessage, options?: IStatusMessageOptions): IStatusHandle {
		const item = StatusMessageViewItem.create(message, options);
		if (!item) {
			return { close: () => { } };
		}

		this._statusMessage = item;
		this._onDidChangeStatusMessage.fire({ kind: StatusMessageChangeType.ADD, item });

		return {
			close: () => {
				if (this._statusMessage === item) {
					this._statusMessage = undefined;
					this._onDidChangeStatusMessage.fire({ kind: StatusMessageChangeType.REMOVE, item });
				}
			}
		};
	}
}

export interface INotificationViewItem {
	readonly id: string | undefined;
	readonly severity: Severity;
	readonly sticky: boolean;
	readonly priority: NotificationPriority;
	readonly message: INotificationMessage;
	readonly source: string | undefined;
	readonly sourceId: string | undefined;
	readonly actions: INotificationActions | undefined;
	readonly progress: INotificationViewItemProgress;

	readonly expanded: boolean;
	readonly visible: boolean;
	readonly canCollapse: boolean;
	readonly hasProgress: boolean;

	readonly onDidChangeExpansion: Event<void>;
	readonly onDidChangeVisibility: Event<boolean>;
	readonly onDidChangeContent: Event<INotificationViewItemContentChangeEvent>;
	readonly onDidClose: Event<void>;

	expand(): void;
	collapse(skipEvents?: boolean): void;
	toggle(): void;

	updateSeverity(severity: Severity): void;
	updateMessage(message: NotificationMessage): void;
	updateActions(actions?: INotificationActions): void;

	updateVisibility(visible: boolean): void;

	close(): void;

	equals(item: INotificationViewItem): boolean;
}

export function isNotificationViewItem(obj: unknown): obj is INotificationViewItem {
	return obj instanceof NotificationViewItem;
}

export const enum NotificationViewItemContentChangeKind {
	SEVERITY,
	MESSAGE,
	ACTIONS,
	PROGRESS
}

export interface INotificationViewItemContentChangeEvent {
	kind: NotificationViewItemContentChangeKind;
}

export interface INotificationViewItemProgressState {
	infinite?: boolean;
	total?: number;
	worked?: number;
	done?: boolean;
}

export interface INotificationViewItemProgress extends INotificationProgress {
	readonly state: INotificationViewItemProgressState;

	dispose(): void;
}

export class NotificationViewItemProgress extends Disposable implements INotificationViewItemProgress {
	private readonly _state: INotificationViewItemProgressState;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	constructor() {
		super();

		this._state = Object.create(null);
	}

	get state(): INotificationViewItemProgressState {
		return this._state;
	}

	infinite(): void {
		if (this._state.infinite) {
			return;
		}

		this._state.infinite = true;

		this._state.total = undefined;
		this._state.worked = undefined;
		this._state.done = undefined;

		this._onDidChange.fire();
	}

	done(): void {
		if (this._state.done) {
			return;
		}

		this._state.done = true;

		this._state.infinite = undefined;
		this._state.total = undefined;
		this._state.worked = undefined;

		this._onDidChange.fire();
	}

	total(value: number): void {
		if (this._state.total === value) {
			return;
		}

		this._state.total = value;

		this._state.infinite = undefined;
		this._state.done = undefined;

		this._onDidChange.fire();
	}

	worked(value: number): void {
		if (typeof this._state.worked === 'number') {
			this._state.worked += value;
		} else {
			this._state.worked = value;
		}

		this._state.infinite = undefined;
		this._state.done = undefined;

		this._onDidChange.fire();
	}
}

export interface IMessageLink {
	href: string;
	name: string;
	title: string;
	offset: number;
	length: number;
}

export interface INotificationMessage {
	raw: string;
	original: NotificationMessage;
	linkedText: LinkedText;
}

export class NotificationViewItem extends Disposable implements INotificationViewItem {

	private static readonly MAX_MESSAGE_LENGTH = 1000;

	private _expanded: boolean | undefined;
	private _visible: boolean = false;

	private _actions: INotificationActions | undefined;
	private _progress: NotificationViewItemProgress | undefined;

	private readonly _onDidChangeExpansion = this._register(new Emitter<void>());
	readonly onDidChangeExpansion = this._onDidChangeExpansion.event;

	private readonly _onDidClose = this._register(new Emitter<void>());
	readonly onDidClose = this._onDidClose.event;

	private readonly _onDidChangeContent = this._register(new Emitter<INotificationViewItemContentChangeEvent>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	static create(notification: INotification, filter: INotificationsFilter): INotificationViewItem | undefined {
		if (!notification?.message || isCancellationError(notification.message)) {
			return undefined; // we need a message to show
		}

		let severity: Severity;
		if (typeof notification.severity === 'number') {
			severity = notification.severity;
		} else {
			severity = Severity.Info;
		}

		const message = NotificationViewItem.parseNotificationMessage(notification.message);
		if (!message) {
			return undefined; // we need a message to show
		}

		let actions: INotificationActions | undefined;
		if (notification.actions) {
			actions = notification.actions;
		} else if (isErrorWithActions(notification.message)) {
			actions = { primary: notification.message.actions };
		}

		let priority = notification.priority ?? NotificationPriority.DEFAULT;
		if ((priority === NotificationPriority.DEFAULT || priority === NotificationPriority.OPTIONAL) && severity !== Severity.Error) {
			if (filter.global === NotificationsFilter.ERROR) {
				priority = NotificationPriority.SILENT; // filtered globally
			} else if (isNotificationSource(notification.source) && filter.sources.get(notification.source.id) === NotificationsFilter.ERROR) {
				priority = NotificationPriority.SILENT; // filtered by source
			}
		}

		return new NotificationViewItem(notification.id, severity, notification.sticky, priority, message, notification.source, notification.progress, actions);
	}

	private static parseNotificationMessage(input: NotificationMessage): INotificationMessage | undefined {
		let message: string | undefined;
		if (input instanceof Error) {
			message = toErrorMessage(input, false);
		} else if (typeof input === 'string') {
			message = input;
		}

		if (!message) {
			return undefined; // we need a message to show
		}

		const raw = message;

		// Make sure message is in the limits
		if (message.length > NotificationViewItem.MAX_MESSAGE_LENGTH) {
			message = `${message.substr(0, NotificationViewItem.MAX_MESSAGE_LENGTH)}...`;
		}

		// Remove newlines from messages as we do not support that and it makes link parsing hard
		message = message.replace(/(\r\n|\n|\r)/gm, ' ').trim();

		// Parse Links
		const linkedText = parseLinkedText(message);

		return { raw, linkedText, original: input };
	}

	private constructor(
		readonly id: string | undefined,
		private _severity: Severity,
		private _sticky: boolean | undefined,
		private _priority: NotificationPriority,
		private _message: INotificationMessage,
		private _source: string | INotificationSource | undefined,
		progress: INotificationProgressProperties | undefined,
		actions?: INotificationActions
	) {
		super();

		if (progress) {
			this.setProgress(progress);
		}

		this.setActions(actions);
	}

	private setProgress(progress: INotificationProgressProperties): void {
		if (progress.infinite) {
			this.progress.infinite();
		} else if (progress.total) {
			this.progress.total(progress.total);

			if (progress.worked) {
				this.progress.worked(progress.worked);
			}
		}
	}

	private setActions(actions: INotificationActions = { primary: [], secondary: [] }): void {
		this._actions = {
			primary: Array.isArray(actions.primary) ? actions.primary : [],
			secondary: Array.isArray(actions.secondary) ? actions.secondary : []
		};

		this._expanded = actions.primary && actions.primary.length > 0;
	}

	get canCollapse(): boolean {
		return !this.hasActions;
	}

	get expanded(): boolean {
		return !!this._expanded;
	}

	get severity(): Severity {
		return this._severity;
	}

	get sticky(): boolean {
		if (this._sticky) {
			return true; // explicitly sticky
		}

		const hasActions = this.hasActions;
		if (
			(hasActions && this._severity === Severity.Error) || // notification errors with actions are sticky
			(!hasActions && this._expanded) ||					 // notifications that got expanded are sticky
			(this._progress && !this._progress.state.done)		 // notifications with running progress are sticky
		) {
			return true;
		}

		return false; // not sticky
	}

	get priority(): NotificationPriority {
		return this._priority;
	}

	private get hasActions(): boolean {
		if (!this._actions) {
			return false;
		}

		if (!this._actions.primary) {
			return false;
		}

		return this._actions.primary.length > 0;
	}

	get hasProgress(): boolean {
		return !!this._progress;
	}

	get progress(): INotificationViewItemProgress {
		if (!this._progress) {
			this._progress = this._register(new NotificationViewItemProgress());
			this._register(this._progress.onDidChange(() => this._onDidChangeContent.fire({ kind: NotificationViewItemContentChangeKind.PROGRESS })));
		}

		return this._progress;
	}

	get message(): INotificationMessage {
		return this._message;
	}

	get source(): string | undefined {
		return typeof this._source === 'string' ? this._source : (this._source ? this._source.label : undefined);
	}

	get sourceId(): string | undefined {
		return (this._source && typeof this._source !== 'string' && 'id' in this._source) ? this._source.id : undefined;
	}

	get actions(): INotificationActions | undefined {
		return this._actions;
	}

	get visible(): boolean {
		return this._visible;
	}

	updateSeverity(severity: Severity): void {
		if (severity === this._severity) {
			return;
		}

		this._severity = severity;
		this._onDidChangeContent.fire({ kind: NotificationViewItemContentChangeKind.SEVERITY });
	}

	updateMessage(input: NotificationMessage): void {
		const message = NotificationViewItem.parseNotificationMessage(input);
		if (!message || message.raw === this._message.raw) {
			return;
		}

		this._message = message;
		this._onDidChangeContent.fire({ kind: NotificationViewItemContentChangeKind.MESSAGE });
	}

	updateActions(actions?: INotificationActions): void {
		this.setActions(actions);
		this._onDidChangeContent.fire({ kind: NotificationViewItemContentChangeKind.ACTIONS });
	}

	updateVisibility(visible: boolean): void {
		if (this._visible !== visible) {
			this._visible = visible;

			this._onDidChangeVisibility.fire(visible);
		}
	}

	expand(): void {
		if (this._expanded || !this.canCollapse) {
			return;
		}

		this._expanded = true;
		this._onDidChangeExpansion.fire();
	}

	collapse(skipEvents?: boolean): void {
		if (!this._expanded || !this.canCollapse) {
			return;
		}

		this._expanded = false;

		if (!skipEvents) {
			this._onDidChangeExpansion.fire();
		}
	}

	toggle(): void {
		if (this._expanded) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	close(): void {
		this._onDidClose.fire();

		this.dispose();
	}

	equals(other: INotificationViewItem): boolean {
		if (this.hasProgress || other.hasProgress) {
			return false;
		}

		if (typeof this.id === 'string' || typeof other.id === 'string') {
			return this.id === other.id;
		}

		if (typeof this._source === 'object') {
			if (this._source.label !== other.source || this._source.id !== other.sourceId) {
				return false;
			}
		} else if (this._source !== other.source) {
			return false;
		}

		if (this._message.raw !== other.message.raw) {
			return false;
		}

		const primaryActions = this._actions?.primary || [];
		const otherPrimaryActions = other.actions?.primary || [];
		return equals(primaryActions, otherPrimaryActions, (action, otherAction) => (action.id + action.label) === (otherAction.id + otherAction.label));
	}
}

export class ChoiceAction extends Action {

	private readonly _onDidRun = this._register(new Emitter<void>());
	readonly onDidRun = this._onDidRun.event;

	private readonly _keepOpen: boolean;
	private readonly _menu: ChoiceAction[] | undefined;

	constructor(id: string, choice: IPromptChoice) {
		super(id, choice.label, undefined, true, async () => {

			// Pass to runner
			choice.run();

			// Emit Event
			this._onDidRun.fire();
		});

		this._keepOpen = !!choice.keepOpen;
		this._menu = !choice.isSecondary && (<IPromptChoiceWithMenu>choice).menu ? (<IPromptChoiceWithMenu>choice).menu.map((c, index) => new ChoiceAction(`${id}.${index}`, c)) : undefined;
	}

	get menu(): ChoiceAction[] | undefined {
		return this._menu;
	}

	get keepOpen(): boolean {
		return this._keepOpen;
	}
}

class StatusMessageViewItem {

	static create(notification: NotificationMessage, options?: IStatusMessageOptions): IStatusMessageViewItem | undefined {
		if (!notification || isCancellationError(notification)) {
			return undefined; // we need a message to show
		}

		let message: string | undefined;
		if (notification instanceof Error) {
			message = toErrorMessage(notification, false);
		} else if (typeof notification === 'string') {
			message = notification;
		}

		if (!message) {
			return undefined; // we need a message to show
		}

		return { message, options };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/panecomposite.ts]---
Location: vscode-main/src/vs/workbench/common/panecomposite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IView, IViewPaneContainer } from './views.js';
import { IComposite } from './composite.js';

export interface IPaneComposite extends IComposite {

	/**
	 * Returns the minimal width needed to avoid any content horizontal truncation
	 */
	getOptimalWidth(): number | undefined;

	openView<T extends IView>(id: string, focus?: boolean): T | undefined;
	getViewPaneContainer(): IViewPaneContainer | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/resources.ts]---
Location: vscode-main/src/vs/workbench/common/resources.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../base/common/uri.js';
import { equals } from '../../base/common/objects.js';
import { isAbsolute } from '../../base/common/path.js';
import { Emitter } from '../../base/common/event.js';
import { relativePath } from '../../base/common/resources.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { ParsedExpression, IExpression, parse } from '../../base/common/glob.js';
import { IWorkspaceContextService } from '../../platform/workspace/common/workspace.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../platform/configuration/common/configuration.js';
import { Schemas } from '../../base/common/network.js';
import { ResourceSet } from '../../base/common/map.js';
import { getDriveLetter } from '../../base/common/extpath.js';

interface IConfiguredExpression {
	readonly expression: IExpression;
	readonly hasAbsolutePath: boolean;
}

export class ResourceGlobMatcher extends Disposable {

	private static readonly NO_FOLDER = null;

	private readonly _onExpressionChange = this._register(new Emitter<void>());
	readonly onExpressionChange = this._onExpressionChange.event;

	private readonly mapFolderToParsedExpression = new Map<string | null, ParsedExpression>();
	private readonly mapFolderToConfiguredExpression = new Map<string | null, IConfiguredExpression>();

	constructor(
		private getExpression: (folder?: URI) => IExpression | undefined,
		private shouldUpdate: (event: IConfigurationChangeEvent) => boolean,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this.updateExpressions(false);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (this.shouldUpdate(e)) {
				this.updateExpressions(true);
			}
		}));

		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.updateExpressions(true)));
	}

	private updateExpressions(fromEvent: boolean): void {
		let changed = false;

		// Add expressions per workspaces that got added
		for (const folder of this.contextService.getWorkspace().folders) {
			const folderUriStr = folder.uri.toString();

			const newExpression = this.doGetExpression(folder.uri);
			const currentExpression = this.mapFolderToConfiguredExpression.get(folderUriStr);

			if (newExpression) {
				if (!currentExpression || !equals(currentExpression.expression, newExpression.expression)) {
					changed = true;

					this.mapFolderToParsedExpression.set(folderUriStr, parse(newExpression.expression));
					this.mapFolderToConfiguredExpression.set(folderUriStr, newExpression);
				}
			} else {
				if (currentExpression) {
					changed = true;

					this.mapFolderToParsedExpression.delete(folderUriStr);
					this.mapFolderToConfiguredExpression.delete(folderUriStr);
				}
			}
		}

		// Remove expressions per workspace no longer present
		const foldersMap = new ResourceSet(this.contextService.getWorkspace().folders.map(folder => folder.uri));
		for (const [folder] of this.mapFolderToConfiguredExpression) {
			if (folder === ResourceGlobMatcher.NO_FOLDER) {
				continue; // always keep this one
			}

			if (!foldersMap.has(URI.parse(folder))) {
				this.mapFolderToParsedExpression.delete(folder);
				this.mapFolderToConfiguredExpression.delete(folder);

				changed = true;
			}
		}

		// Always set for resources outside workspace as well
		const globalNewExpression = this.doGetExpression(undefined);
		const globalCurrentExpression = this.mapFolderToConfiguredExpression.get(ResourceGlobMatcher.NO_FOLDER);
		if (globalNewExpression) {
			if (!globalCurrentExpression || !equals(globalCurrentExpression.expression, globalNewExpression.expression)) {
				changed = true;

				this.mapFolderToParsedExpression.set(ResourceGlobMatcher.NO_FOLDER, parse(globalNewExpression.expression));
				this.mapFolderToConfiguredExpression.set(ResourceGlobMatcher.NO_FOLDER, globalNewExpression);
			}
		} else {
			if (globalCurrentExpression) {
				changed = true;

				this.mapFolderToParsedExpression.delete(ResourceGlobMatcher.NO_FOLDER);
				this.mapFolderToConfiguredExpression.delete(ResourceGlobMatcher.NO_FOLDER);
			}
		}

		if (fromEvent && changed) {
			this._onExpressionChange.fire();
		}
	}

	private doGetExpression(resource: URI | undefined): IConfiguredExpression | undefined {
		const expression = this.getExpression(resource);
		if (!expression) {
			return undefined;
		}

		const keys = Object.keys(expression);
		if (keys.length === 0) {
			return undefined;
		}

		let hasAbsolutePath = false;

		// Check the expression for absolute paths/globs
		// and specifically for Windows, make sure the
		// drive letter is lowercased, because we later
		// check with `URI.fsPath` which is always putting
		// the drive letter lowercased.

		const massagedExpression: IExpression = Object.create(null);
		for (const key of keys) {
			if (!hasAbsolutePath) {
				hasAbsolutePath = isAbsolute(key);
			}

			let massagedKey = key;

			const driveLetter = getDriveLetter(massagedKey, true /* probe for windows */);
			if (driveLetter) {
				const driveLetterLower = driveLetter.toLowerCase();
				if (driveLetter !== driveLetter.toLowerCase()) {
					massagedKey = `${driveLetterLower}${massagedKey.substring(1)}`;
				}
			}

			massagedExpression[massagedKey] = expression[key];
		}

		return {
			expression: massagedExpression,
			hasAbsolutePath
		};
	}

	matches(
		resource: URI,
		hasSibling?: (name: string) => boolean
	): boolean {
		if (this.mapFolderToParsedExpression.size === 0) {
			return false; // return early: no expression for this matcher
		}

		const folder = this.contextService.getWorkspaceFolder(resource);
		let expressionForFolder: ParsedExpression | undefined;
		let expressionConfigForFolder: IConfiguredExpression | undefined;
		if (folder && this.mapFolderToParsedExpression.has(folder.uri.toString())) {
			expressionForFolder = this.mapFolderToParsedExpression.get(folder.uri.toString());
			expressionConfigForFolder = this.mapFolderToConfiguredExpression.get(folder.uri.toString());
		} else {
			expressionForFolder = this.mapFolderToParsedExpression.get(ResourceGlobMatcher.NO_FOLDER);
			expressionConfigForFolder = this.mapFolderToConfiguredExpression.get(ResourceGlobMatcher.NO_FOLDER);
		}

		if (!expressionForFolder) {
			return false; // return early: no expression for this resource
		}

		// If the resource if from a workspace, convert its absolute path to a relative
		// path so that glob patterns have a higher probability to match. For example
		// a glob pattern of "src/**" will not match on an absolute path "/folder/src/file.txt"
		// but can match on "src/file.txt"

		let resourcePathToMatch: string | undefined;
		if (folder) {
			resourcePathToMatch = relativePath(folder.uri, resource);
		} else {
			resourcePathToMatch = this.uriToPath(resource);
		}

		if (typeof resourcePathToMatch === 'string' && !!expressionForFolder(resourcePathToMatch, undefined, hasSibling)) {
			return true;
		}

		// If the configured expression has an absolute path, we also check for absolute paths
		// to match, otherwise we potentially miss out on matches. We only do that if we previously
		// matched on the relative path.

		if (resourcePathToMatch !== this.uriToPath(resource) && expressionConfigForFolder?.hasAbsolutePath) {
			return !!expressionForFolder(this.uriToPath(resource), undefined, hasSibling);
		}

		return false;
	}

	private uriToPath(uri: URI): string {
		if (uri.scheme === Schemas.file) {
			return uri.fsPath;
		}

		return uri.path;
	}
}
```

--------------------------------------------------------------------------------

````

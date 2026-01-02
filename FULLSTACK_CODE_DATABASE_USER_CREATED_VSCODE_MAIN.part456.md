---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 456
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 456 of 552)

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

---[FILE: src/vs/workbench/contrib/tasks/common/tasks.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/tasks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as Types from '../../../../base/common/types.js';
import * as resources from '../../../../base/common/resources.js';
import { IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import * as Objects from '../../../../base/common/objects.js';
import { UriComponents, URI } from '../../../../base/common/uri.js';

import { ProblemMatcher } from './problemMatcher.js';
import { IWorkspaceFolder, IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { RawContextKey, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { TaskDefinitionRegistry } from './taskDefinitionRegistry.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { TerminalExitReason } from '../../../../platform/terminal/common/terminal.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';



export const USER_TASKS_GROUP_KEY = 'settings';

export const TASK_RUNNING_STATE = new RawContextKey<boolean>('taskRunning', false, nls.localize('tasks.taskRunningContext', "Whether a task is currently running."));
/** Whether the active terminal is a task terminal. */
export const TASK_TERMINAL_ACTIVE = new RawContextKey<boolean>('taskTerminalActive', false, nls.localize('taskTerminalActive', "Whether the active terminal is a task terminal."));
export const TASKS_CATEGORY = nls.localize2('tasksCategory', "Tasks");

export enum ShellQuoting {
	/**
	 * Use character escaping.
	 */
	Escape = 1,

	/**
	 * Use strong quoting
	 */
	Strong = 2,

	/**
	 * Use weak quoting.
	 */
	Weak = 3,
}

export const CUSTOMIZED_TASK_TYPE = '$customized';

export namespace ShellQuoting {
	export function from(this: void, value: string): ShellQuoting {
		if (!value) {
			return ShellQuoting.Strong;
		}
		switch (value.toLowerCase()) {
			case 'escape':
				return ShellQuoting.Escape;
			case 'strong':
				return ShellQuoting.Strong;
			case 'weak':
				return ShellQuoting.Weak;
			default:
				return ShellQuoting.Strong;
		}
	}
}

export interface IShellQuotingOptions {
	/**
	 * The character used to do character escaping.
	 */
	escape?: string | {
		escapeChar: string;
		charsToEscape: string;
	};

	/**
	 * The character used for string quoting.
	 */
	strong?: string;

	/**
	 * The character used for weak quoting.
	 */
	weak?: string;
}

export interface IShellConfiguration {
	/**
	 * The shell executable.
	 */
	executable?: string;

	/**
	 * The arguments to be passed to the shell executable.
	 */
	args?: string[];

	/**
	 * Which kind of quotes the shell supports.
	 */
	quoting?: IShellQuotingOptions;
}

export interface CommandOptions {

	/**
	 * The shell to use if the task is a shell command.
	 */
	shell?: IShellConfiguration;

	/**
	 * The current working directory of the executed program or shell.
	 * If omitted VSCode's current workspace root is used.
	 */
	cwd?: string;

	/**
	 * The environment of the executed program or shell. If omitted
	 * the parent process' environment is used.
	 */
	env?: { [key: string]: string };
}

export namespace CommandOptions {
	export const defaults: CommandOptions = { cwd: '${workspaceFolder}' };
}

export enum RevealKind {
	/**
	 * Always brings the terminal to front if the task is executed.
	 */
	Always = 1,

	/**
	 * Only brings the terminal to front if a problem is detected executing the task
	 * e.g. the task couldn't be started,
	 * the task ended with an exit code other than zero,
	 * or the problem matcher found an error.
	 */
	Silent = 2,

	/**
	 * The terminal never comes to front when the task is executed.
	 */
	Never = 3
}

export namespace RevealKind {
	export function fromString(this: void, value: string): RevealKind {
		switch (value.toLowerCase()) {
			case 'always':
				return RevealKind.Always;
			case 'silent':
				return RevealKind.Silent;
			case 'never':
				return RevealKind.Never;
			default:
				return RevealKind.Always;
		}
	}
}

export enum RevealProblemKind {
	/**
	 * Never reveals the problems panel when this task is executed.
	 */
	Never = 1,


	/**
	 * Only reveals the problems panel if a problem is found.
	 */
	OnProblem = 2,

	/**
	 * Never reveals the problems panel when this task is executed.
	 */
	Always = 3
}

export namespace RevealProblemKind {
	export function fromString(this: void, value: string): RevealProblemKind {
		switch (value.toLowerCase()) {
			case 'always':
				return RevealProblemKind.Always;
			case 'never':
				return RevealProblemKind.Never;
			case 'onproblem':
				return RevealProblemKind.OnProblem;
			default:
				return RevealProblemKind.OnProblem;
		}
	}
}

export enum PanelKind {

	/**
	 * Shares a panel with other tasks. This is the default.
	 */
	Shared = 1,

	/**
	 * Uses a dedicated panel for this tasks. The panel is not
	 * shared with other tasks.
	 */
	Dedicated = 2,

	/**
	 * Creates a new panel whenever this task is executed.
	 */
	New = 3
}

export namespace PanelKind {
	export function fromString(value: string): PanelKind {
		switch (value.toLowerCase()) {
			case 'shared':
				return PanelKind.Shared;
			case 'dedicated':
				return PanelKind.Dedicated;
			case 'new':
				return PanelKind.New;
			default:
				return PanelKind.Shared;
		}
	}
}

export interface IPresentationOptions {
	/**
	 * Controls whether the task output is reveal in the user interface.
	 * Defaults to `RevealKind.Always`.
	 */
	reveal: RevealKind;

	/**
	 * Controls whether the problems pane is revealed when running this task or not.
	 * Defaults to `RevealProblemKind.Never`.
	 */
	revealProblems: RevealProblemKind;

	/**
	 * Controls whether the command associated with the task is echoed
	 * in the user interface.
	 */
	echo: boolean;

	/**
	 * Controls whether the panel showing the task output is taking focus.
	 */
	focus: boolean;

	/**
	 * Controls if the task panel is used for this task only (dedicated),
	 * shared between tasks (shared) or if a new panel is created on
	 * every task execution (new). Defaults to `TaskInstanceKind.Shared`
	 */
	panel: PanelKind;

	/**
	 * Controls whether to show the "Terminal will be reused by tasks, press any key to close it" message.
	 */
	showReuseMessage: boolean;

	/**
	 * Controls whether to clear the terminal before executing the task.
	 */
	clear: boolean;

	/**
	 * Controls whether the task is executed in a specific terminal group using split panes.
	 */
	group?: string;

	/**
	 * Controls whether the terminal that the task runs in is closed when the task completes.
	 */
	close?: boolean;

	/**
	 * Controls whether to preserve the task name in the terminal after task completion.
	 */
	preserveTerminalName?: boolean;
}

export namespace PresentationOptions {
	export const defaults: IPresentationOptions = {
		echo: true, reveal: RevealKind.Always, revealProblems: RevealProblemKind.Never, focus: false, panel: PanelKind.Shared, showReuseMessage: true, clear: false, preserveTerminalName: false
	};
}

export enum RuntimeType {
	Shell = 1,
	Process = 2,
	CustomExecution = 3
}

export namespace RuntimeType {
	export function fromString(value: string): RuntimeType {
		switch (value.toLowerCase()) {
			case 'shell':
				return RuntimeType.Shell;
			case 'process':
				return RuntimeType.Process;
			case 'customExecution':
				return RuntimeType.CustomExecution;
			default:
				return RuntimeType.Process;
		}
	}
	export function toString(value: RuntimeType): string {
		switch (value) {
			case RuntimeType.Shell: return 'shell';
			case RuntimeType.Process: return 'process';
			case RuntimeType.CustomExecution: return 'customExecution';
			default: return 'process';
		}
	}
}

export interface IQuotedString {
	value: string;
	quoting: ShellQuoting;
}

export type CommandString = string | IQuotedString;

export namespace CommandString {
	export function value(value: CommandString): string {
		if (Types.isString(value)) {
			return value;
		} else {
			return value.value;
		}
	}
}

export interface ICommandConfiguration {

	/**
	 * The task type
	 */
	runtime?: RuntimeType;

	/**
	 * The command to execute
	 */
	name?: CommandString;

	/**
	 * Additional command options.
	 */
	options?: CommandOptions;

	/**
	 * Command arguments.
	 */
	args?: CommandString[];

	/**
	 * The task selector if needed.
	 */
	taskSelector?: string;

	/**
	 * Whether to suppress the task name when merging global args
	 *
	 */
	suppressTaskName?: boolean;

	/**
	 * Describes how the task is presented in the UI.
	 */
	presentation?: IPresentationOptions;
}

export namespace TaskGroup {
	export const Clean: TaskGroup = { _id: 'clean', isDefault: false };

	export const Build: TaskGroup = { _id: 'build', isDefault: false };

	export const Rebuild: TaskGroup = { _id: 'rebuild', isDefault: false };

	export const Test: TaskGroup = { _id: 'test', isDefault: false };

	export function is(value: any): value is string {
		return value === Clean._id || value === Build._id || value === Rebuild._id || value === Test._id;
	}

	export function from(value: string | TaskGroup | undefined): TaskGroup | undefined {
		if (value === undefined) {
			return undefined;
		} else if (Types.isString(value)) {
			if (is(value)) {
				return { _id: value, isDefault: false };
			}
			return undefined;
		} else {
			return value;
		}
	}
}

export interface TaskGroup {
	_id: string;
	isDefault?: boolean | string;
}

export const enum TaskScope {
	Global = 1,
	Workspace = 2,
	Folder = 3
}

export namespace TaskSourceKind {
	export const Workspace: 'workspace' = 'workspace';
	export const Extension: 'extension' = 'extension';
	export const InMemory: 'inMemory' = 'inMemory';
	export const WorkspaceFile: 'workspaceFile' = 'workspaceFile';
	export const User: 'user' = 'user';

	export function toConfigurationTarget(kind: string): ConfigurationTarget {
		switch (kind) {
			case TaskSourceKind.User: return ConfigurationTarget.USER;
			case TaskSourceKind.WorkspaceFile: return ConfigurationTarget.WORKSPACE;
			default: return ConfigurationTarget.WORKSPACE_FOLDER;
		}
	}
}

export interface ITaskSourceConfigElement {
	workspaceFolder?: IWorkspaceFolder;
	workspace?: IWorkspace;
	file: string;
	index: number;
	element: any;
}

export interface ITaskConfig {
	label: string;
	task?: CommandString;
	type?: string;
	command?: string | CommandString;
	args?: string[] | CommandString[];
	presentation?: IPresentationOptions;
	isBackground?: boolean;
	problemMatcher?: Types.SingleOrMany<string>;
	group?: string | TaskGroup;
}

interface IBaseTaskSource {
	readonly kind: string;
	readonly label: string;
}

export interface IWorkspaceTaskSource extends IBaseTaskSource {
	readonly kind: 'workspace';
	readonly config: ITaskSourceConfigElement;
	readonly customizes?: KeyedTaskIdentifier;
}

export interface IExtensionTaskSource extends IBaseTaskSource {
	readonly kind: 'extension';
	readonly extension?: string;
	readonly scope: TaskScope;
	readonly workspaceFolder: IWorkspaceFolder | undefined;
}

export interface IExtensionTaskSourceTransfer {
	__workspaceFolder: UriComponents;
	__definition: { type: string;[name: string]: any };
}

export interface IInMemoryTaskSource extends IBaseTaskSource {
	readonly kind: 'inMemory';
}

export interface IUserTaskSource extends IBaseTaskSource {
	readonly kind: 'user';
	readonly config: ITaskSourceConfigElement;
	readonly customizes?: KeyedTaskIdentifier;
}

export interface WorkspaceFileTaskSource extends IBaseTaskSource {
	readonly kind: 'workspaceFile';
	readonly config: ITaskSourceConfigElement;
	readonly customizes?: KeyedTaskIdentifier;
}

export type TaskSource = IWorkspaceTaskSource | IExtensionTaskSource | IInMemoryTaskSource | IUserTaskSource | WorkspaceFileTaskSource;
export type FileBasedTaskSource = IWorkspaceTaskSource | IUserTaskSource | WorkspaceFileTaskSource;
export interface ITaskIdentifier {
	type: string;
	[name: string]: any;
}

export interface KeyedTaskIdentifier extends ITaskIdentifier {
	_key: string;
}

export interface ITaskDependency {
	uri: URI | string;
	task: string | KeyedTaskIdentifier | undefined;
}

export const enum DependsOrder {
	parallel = 'parallel',
	sequence = 'sequence'
}

export interface IConfigurationProperties {

	/**
	 * The task's name
	 */
	name?: string;

	/**
	 * The task's name
	 */
	identifier?: string;

	/**
	 * The task's group;
	 */
	group?: string | TaskGroup;

	/**
	 * The presentation options
	 */
	presentation?: IPresentationOptions;

	/**
	 * The command options;
	 */
	options?: CommandOptions;

	/**
	 * Whether the task is a background task or not.
	 */
	isBackground?: boolean;

	/**
	 * Whether the task should prompt on close for confirmation if running.
	 */
	promptOnClose?: boolean;

	/**
	 * The other tasks this task depends on.
	 */
	dependsOn?: ITaskDependency[];

	/**
	 * The order the dependsOn tasks should be executed in.
	 */
	dependsOrder?: DependsOrder;

	/**
	 * A description of the task.
	 */
	detail?: string;

	/**
	 * The problem watchers to use for this task
	 */
	problemMatchers?: Array<string | ProblemMatcher>;

	/**
	 * The icon for this task in the terminal tabs list
	 */
	icon?: { id?: string; color?: string };

	/**
	 * Do not show this task in the run task quickpick
	 */
	hide?: boolean;
}

export enum RunOnOptions {
	default = 1,
	folderOpen = 2
}

export const enum InstancePolicy {
	terminateNewest = 'terminateNewest',
	terminateOldest = 'terminateOldest',
	prompt = 'prompt',
	warn = 'warn',
	silent = 'silent'
}

export interface IRunOptions {
	reevaluateOnRerun?: boolean;
	runOn?: RunOnOptions;
	instanceLimit?: number;
	instancePolicy?: InstancePolicy;
}

export namespace RunOptions {
	export const defaults: IRunOptions = { reevaluateOnRerun: true, runOn: RunOnOptions.default, instanceLimit: 1, instancePolicy: InstancePolicy.prompt };
}

export abstract class CommonTask {

	/**
	 * The task's internal id
	 */
	readonly _id: string;

	/**
	 * The cached label.
	 */
	_label: string = '';

	type?: string;

	runOptions: IRunOptions;

	configurationProperties: IConfigurationProperties;

	_source: IBaseTaskSource;

	private _taskLoadMessages: string[] | undefined;

	protected constructor(id: string, label: string | undefined, type: string | undefined, runOptions: IRunOptions,
		configurationProperties: IConfigurationProperties, source: IBaseTaskSource) {
		this._id = id;
		if (label) {
			this._label = label;
		}
		if (type) {
			this.type = type;
		}
		this.runOptions = runOptions;
		this.configurationProperties = configurationProperties;
		this._source = source;
	}

	public getDefinition(useSource?: boolean): KeyedTaskIdentifier | undefined {
		return undefined;
	}

	public getMapKey(): string {
		return this._id;
	}

	public getKey(): string | undefined {
		return undefined;
	}

	protected abstract getFolderId(): string | undefined;

	public getCommonTaskId(): string {
		interface IRecentTaskKey {
			folder: string | undefined;
			id: string;
		}

		const key: IRecentTaskKey = { folder: this.getFolderId(), id: this._id };
		return JSON.stringify(key);
	}

	public clone(): Task {
		// eslint-disable-next-line local/code-no-any-casts
		return this.fromObject(Object.assign({}, <any>this));
	}

	protected abstract fromObject(object: any): Task;

	public getWorkspaceFolder(): IWorkspaceFolder | undefined {
		return undefined;
	}

	public getWorkspaceFileName(): string | undefined {
		return undefined;
	}

	public getTelemetryKind(): string {
		return 'unknown';
	}

	public matches(key: string | KeyedTaskIdentifier | undefined, compareId: boolean = false): boolean {
		if (key === undefined) {
			return false;
		}
		if (Types.isString(key)) {
			return key === this._label || key === this.configurationProperties.identifier || (compareId && key === this._id);
		}
		const identifier = this.getDefinition(true);
		return identifier !== undefined && identifier._key === key._key;
	}

	public getQualifiedLabel(): string {
		const workspaceFolder = this.getWorkspaceFolder();
		if (workspaceFolder) {
			return `${this._label} (${workspaceFolder.name})`;
		} else {
			return this._label;
		}
	}

	public getTaskExecution(): ITaskExecution {
		const result: ITaskExecution = {
			id: this._id,
			// eslint-disable-next-line local/code-no-any-casts
			task: <any>this
		};
		return result;
	}

	public addTaskLoadMessages(messages: string[] | undefined) {
		if (this._taskLoadMessages === undefined) {
			this._taskLoadMessages = [];
		}
		if (messages) {
			this._taskLoadMessages = this._taskLoadMessages.concat(messages);
		}
	}

	get taskLoadMessages(): string[] | undefined {
		return this._taskLoadMessages;
	}
}

/**
 * For tasks of type shell or process, this is created upon parse
 * of the tasks.json or workspace file.
 * For ContributedTasks of all other types, this is the result of
 * resolving a ConfiguringTask.
 */
export class CustomTask extends CommonTask {

	declare type: '$customized'; // CUSTOMIZED_TASK_TYPE

	instance: number | undefined;

	/**
	 * Indicated the source of the task (e.g. tasks.json or extension)
	 */
	override _source: FileBasedTaskSource;

	hasDefinedMatchers: boolean;

	/**
	 * The command configuration
	 */
	command: ICommandConfiguration = {};

	public constructor(id: string, source: FileBasedTaskSource, label: string, type: string, command: ICommandConfiguration | undefined,
		hasDefinedMatchers: boolean, runOptions: IRunOptions, configurationProperties: IConfigurationProperties) {
		super(id, label, undefined, runOptions, configurationProperties, source);
		this._source = source;
		this.hasDefinedMatchers = hasDefinedMatchers;
		if (command) {
			this.command = command;
		}
	}

	public override clone(): CustomTask {
		return new CustomTask(this._id, this._source, this._label, this.type, this.command, this.hasDefinedMatchers, this.runOptions, this.configurationProperties);
	}

	public customizes(): KeyedTaskIdentifier | undefined {
		if (this._source && this._source.customizes) {
			return this._source.customizes;
		}
		return undefined;
	}

	public override getDefinition(useSource: boolean = false): KeyedTaskIdentifier {
		if (useSource && this._source.customizes !== undefined) {
			return this._source.customizes;
		} else {
			let type: string;
			const commandRuntime = this.command ? this.command.runtime : undefined;
			switch (commandRuntime) {
				case RuntimeType.Shell:
					type = 'shell';
					break;

				case RuntimeType.Process:
					type = 'process';
					break;

				case RuntimeType.CustomExecution:
					type = 'customExecution';
					break;

				case undefined:
					type = '$composite';
					break;

				default:
					throw new Error('Unexpected task runtime');
			}

			const result: KeyedTaskIdentifier = {
				type,
				_key: this._id,
				id: this._id
			};
			return result;
		}
	}

	public static is(value: any): value is CustomTask {
		return value instanceof CustomTask;
	}

	public override getMapKey(): string {
		const workspaceFolder = this._source.config.workspaceFolder;
		return workspaceFolder ? `${workspaceFolder.uri.toString()}|${this._id}|${this.instance}` : `${this._id}|${this.instance}`;
	}

	protected getFolderId(): string | undefined {
		return this._source.kind === TaskSourceKind.User ? USER_TASKS_GROUP_KEY : this._source.config.workspaceFolder?.uri.toString();
	}

	public override getCommonTaskId(): string {
		return this._source.customizes ? super.getCommonTaskId() : (this.getKey() ?? super.getCommonTaskId());
	}

	/**
	 * @returns A key representing the task
	 */
	public override getKey(): string | undefined {
		interface ICustomKey {
			type: string;
			folder: string;
			id: string;
		}
		const workspaceFolder = this.getFolderId();
		if (!workspaceFolder) {
			return undefined;
		}
		let id: string = this.configurationProperties.identifier!;
		if (this._source.kind !== TaskSourceKind.Workspace) {
			id += this._source.kind;
		}
		const key: ICustomKey = { type: CUSTOMIZED_TASK_TYPE, folder: workspaceFolder, id };
		return JSON.stringify(key);
	}

	public override getWorkspaceFolder(): IWorkspaceFolder | undefined {
		return this._source.config.workspaceFolder;
	}

	public override getWorkspaceFileName(): string | undefined {
		return (this._source.config.workspace && this._source.config.workspace.configuration) ? resources.basename(this._source.config.workspace.configuration) : undefined;
	}

	public override getTelemetryKind(): string {
		if (this._source.customizes) {
			return 'workspace>extension';
		} else {
			return 'workspace';
		}
	}

	protected fromObject(object: CustomTask): CustomTask {
		return new CustomTask(object._id, object._source, object._label, object.type, object.command, object.hasDefinedMatchers, object.runOptions, object.configurationProperties);
	}
}

/**
 * After a contributed task has been parsed, but before
 * the task has been resolved via the extension, its properties
 * are stored in this
 */
export class ConfiguringTask extends CommonTask {

	/**
	 * Indicated the source of the task (e.g. tasks.json or extension)
	 */
	override _source: FileBasedTaskSource;

	configures: KeyedTaskIdentifier;

	public constructor(id: string, source: FileBasedTaskSource, label: string | undefined, type: string | undefined,
		configures: KeyedTaskIdentifier, runOptions: IRunOptions, configurationProperties: IConfigurationProperties) {
		super(id, label, type, runOptions, configurationProperties, source);
		this._source = source;
		this.configures = configures;
	}

	public static is(value: any): value is ConfiguringTask {
		return value instanceof ConfiguringTask;
	}

	protected fromObject(object: any): Task {
		return object;
	}

	public override getDefinition(): KeyedTaskIdentifier {
		return this.configures;
	}

	public override getWorkspaceFileName(): string | undefined {
		return (this._source.config.workspace && this._source.config.workspace.configuration) ? resources.basename(this._source.config.workspace.configuration) : undefined;
	}

	public override getWorkspaceFolder(): IWorkspaceFolder | undefined {
		return this._source.config.workspaceFolder;
	}

	protected getFolderId(): string | undefined {
		return this._source.kind === TaskSourceKind.User ? USER_TASKS_GROUP_KEY : this._source.config.workspaceFolder?.uri.toString();
	}

	public override getKey(): string | undefined {
		interface ICustomKey {
			type: string;
			folder: string;
			id: string;
		}
		const workspaceFolder = this.getFolderId();
		if (!workspaceFolder) {
			return undefined;
		}
		let id: string = this.configurationProperties.identifier!;
		if (this._source.kind !== TaskSourceKind.Workspace) {
			id += this._source.kind;
		}
		const key: ICustomKey = { type: CUSTOMIZED_TASK_TYPE, folder: workspaceFolder, id };
		return JSON.stringify(key);
	}
}

/**
 * A task from an extension created via resolveTask or provideTask
 */
export class ContributedTask extends CommonTask {

	/**
	 * Indicated the source of the task (e.g. tasks.json or extension)
	 * Set in the super constructor
	 */
	declare _source: IExtensionTaskSource;

	instance: number | undefined;

	defines: KeyedTaskIdentifier;

	hasDefinedMatchers: boolean;

	/**
	 * The command configuration
	 */
	command: ICommandConfiguration;

	/**
	 * The icon for the task
	 */
	icon: { id?: string; color?: string } | undefined;

	/**
	 * Don't show the task in the run task quickpick
	 */
	hide?: boolean;

	public constructor(id: string, source: IExtensionTaskSource, label: string, type: string | undefined, defines: KeyedTaskIdentifier,
		command: ICommandConfiguration, hasDefinedMatchers: boolean, runOptions: IRunOptions,
		configurationProperties: IConfigurationProperties) {
		super(id, label, type, runOptions, configurationProperties, source);
		this.defines = defines;
		this.hasDefinedMatchers = hasDefinedMatchers;
		this.command = command;
		this.icon = configurationProperties.icon;
		this.hide = configurationProperties.hide;
	}

	public override clone(): ContributedTask {
		return new ContributedTask(this._id, this._source, this._label, this.type, this.defines, this.command, this.hasDefinedMatchers, this.runOptions, this.configurationProperties);
	}

	public override getDefinition(): KeyedTaskIdentifier {
		return this.defines;
	}

	public static is(value: any): value is ContributedTask {
		return value instanceof ContributedTask;
	}

	public override getMapKey(): string {
		const workspaceFolder = this._source.workspaceFolder;
		return workspaceFolder
			? `${this._source.scope.toString()}|${workspaceFolder.uri.toString()}|${this._id}|${this.instance}`
			: `${this._source.scope.toString()}|${this._id}|${this.instance}`;
	}

	protected getFolderId(): string | undefined {
		if (this._source.scope === TaskScope.Folder && this._source.workspaceFolder) {
			return this._source.workspaceFolder.uri.toString();
		}
		return undefined;
	}

	public override getKey(): string | undefined {
		interface IContributedKey {
			type: string;
			scope: number;
			folder?: string;
			id: string;
		}

		const key: IContributedKey = { type: 'contributed', scope: this._source.scope, id: this._id };
		key.folder = this.getFolderId();
		return JSON.stringify(key);
	}

	public override getWorkspaceFolder(): IWorkspaceFolder | undefined {
		return this._source.workspaceFolder;
	}

	public override getTelemetryKind(): string {
		return 'extension';
	}

	protected fromObject(object: ContributedTask): ContributedTask {
		return new ContributedTask(object._id, object._source, object._label, object.type, object.defines, object.command, object.hasDefinedMatchers, object.runOptions, object.configurationProperties);
	}
}

export class InMemoryTask extends CommonTask {
	/**
	 * Indicated the source of the task (e.g. tasks.json or extension)
	 */
	override _source: IInMemoryTaskSource;

	instance: number | undefined;

	declare type: 'inMemory';

	public constructor(id: string, source: IInMemoryTaskSource, label: string, type: string,
		runOptions: IRunOptions, configurationProperties: IConfigurationProperties) {
		super(id, label, type, runOptions, configurationProperties, source);
		this._source = source;
	}

	public override clone(): InMemoryTask {
		return new InMemoryTask(this._id, this._source, this._label, this.type, this.runOptions, this.configurationProperties);
	}

	public static is(value: any): value is InMemoryTask {
		return value instanceof InMemoryTask;
	}

	public override getTelemetryKind(): string {
		return 'composite';
	}

	public override getMapKey(): string {
		return `${this._id}|${this.instance}`;
	}

	protected getFolderId(): undefined {
		return undefined;
	}

	protected fromObject(object: InMemoryTask): InMemoryTask {
		return new InMemoryTask(object._id, object._source, object._label, object.type, object.runOptions, object.configurationProperties);
	}
}

export type Task = CustomTask | ContributedTask | InMemoryTask;

export interface ITaskExecution {
	id: string;
	task: Task;
}

export enum ExecutionEngine {
	Process = 1,
	Terminal = 2
}

export namespace ExecutionEngine {
	export const _default: ExecutionEngine = ExecutionEngine.Terminal;
}

export const enum JsonSchemaVersion {
	V0_1_0 = 1,
	V2_0_0 = 2
}

export interface ITaskSet {
	tasks: Task[];
	extension?: IExtensionDescription;
}

export interface ITaskDefinition {
	extensionId: string;
	taskType: string;
	required: string[];
	properties: IJSONSchemaMap;
	when?: ContextKeyExpression;
}

export class TaskSorter {

	private _order: Map<string, number> = new Map();

	constructor(workspaceFolders: IWorkspaceFolder[]) {
		for (let i = 0; i < workspaceFolders.length; i++) {
			this._order.set(workspaceFolders[i].uri.toString(), i);
		}
	}

	public compare(a: Task | ConfiguringTask, b: Task | ConfiguringTask): number {
		const aw = a.getWorkspaceFolder();
		const bw = b.getWorkspaceFolder();
		if (aw && bw) {
			let ai = this._order.get(aw.uri.toString());
			ai = ai === undefined ? 0 : ai + 1;
			let bi = this._order.get(bw.uri.toString());
			bi = bi === undefined ? 0 : bi + 1;
			if (ai === bi) {
				return a._label.localeCompare(b._label);
			} else {
				return ai - bi;
			}
		} else if (!aw && bw) {
			return -1;
		} else if (aw && !bw) {
			return +1;
		} else {
			return 0;
		}
	}
}



export const enum TaskRunType {
	SingleRun = 'singleRun',
	Background = 'background'
}

export interface ITaskChangedEvent {
	kind: TaskEventKind.Changed;
}



export enum TaskEventKind {
	/** Indicates that a task's properties or configuration have changed */
	Changed = 'changed',

	/** Indicates that a task has begun executing */
	ProcessStarted = 'processStarted',

	/** Indicates that a task process has completed */
	ProcessEnded = 'processEnded',

	/** Indicates that a task was terminated, either by user action or by the system */
	Terminated = 'terminated',

	/** Indicates that a task has started running */
	Start = 'start',

	/** Indicates that a task has acquired all needed input/variables to execute */
	AcquiredInput = 'acquiredInput',

	/** Indicates that a dependent task has started */
	DependsOnStarted = 'dependsOnStarted',

	/** Indicates that a task is actively running/processing */
	Active = 'active',

	/** Indicates that a task is paused/waiting but not complete */
	Inactive = 'inactive',

	/** Indicates that a task has completed fully */
	End = 'end',

	/** Indicates that a task's problem matcher has started */
	ProblemMatcherStarted = 'problemMatcherStarted',

	/** Indicates that a task's problem matcher has ended */
	ProblemMatcherEnded = 'problemMatcherEnded',

	/** Indicates that a task's problem matcher has found errors */
	ProblemMatcherFoundErrors = 'problemMatcherFoundErrors'
}

interface ITaskCommon {
	taskId: string;
	runType: TaskRunType;
	taskName: string | undefined;
	group: string | TaskGroup | undefined;
	__task: Task;
}

export interface ITaskProcessStartedEvent extends ITaskCommon {
	kind: TaskEventKind.ProcessStarted;
	terminalId: number;
	processId: number;
}

export interface ITaskProcessEndedEvent extends ITaskCommon {
	kind: TaskEventKind.ProcessEnded;
	terminalId: number | undefined;
	exitCode?: number;
	durationMs?: number;
}

export interface ITaskInactiveEvent extends ITaskCommon {
	kind: TaskEventKind.Inactive;
	terminalId: number | undefined;
	durationMs: number | undefined;
}

export interface ITaskTerminatedEvent extends ITaskCommon {
	kind: TaskEventKind.Terminated;
	terminalId: number;
	exitReason: TerminalExitReason | undefined;
}

export interface ITaskStartedEvent extends ITaskCommon {
	kind: TaskEventKind.Start;
	terminalId: number;
	resolvedVariables: Map<string, string>;
}

export interface ITaskProblemMatcherEndedEvent extends ITaskCommon {
	kind: TaskEventKind.ProblemMatcherEnded;
	hasErrors: boolean;
}

export interface ITaskGeneralEvent extends ITaskCommon {
	kind: TaskEventKind.AcquiredInput | TaskEventKind.DependsOnStarted | TaskEventKind.Active | TaskEventKind.Inactive | TaskEventKind.End | TaskEventKind.ProblemMatcherStarted | TaskEventKind.ProblemMatcherFoundErrors;
	terminalId: number | undefined;
}

export type ITaskEvent =
	| ITaskChangedEvent
	| ITaskProcessStartedEvent
	| ITaskProcessEndedEvent
	| ITaskTerminatedEvent
	| ITaskStartedEvent
	| ITaskGeneralEvent
	| ITaskProblemMatcherEndedEvent;

export const enum TaskRunSource {
	System,
	User,
	FolderOpen,
	ConfigurationChange,
	Reconnect,
	ChatAgent
}

export namespace TaskEvent {
	function common(task: Task): ITaskCommon {
		return {
			taskId: task._id,
			taskName: task.configurationProperties.name,
			runType: task.configurationProperties.isBackground ? TaskRunType.Background : TaskRunType.SingleRun,
			group: task.configurationProperties.group,
			__task: task,
		};
	}

	export function start(task: Task, terminalId: number, resolvedVariables: Map<string, string>): ITaskStartedEvent {
		return {
			...common(task),
			kind: TaskEventKind.Start,
			terminalId,
			resolvedVariables,
		};
	}

	export function processStarted(task: Task, terminalId: number, processId: number): ITaskProcessStartedEvent {
		return {
			...common(task),
			kind: TaskEventKind.ProcessStarted,
			terminalId,
			processId,
		};
	}
	export function processEnded(task: Task, terminalId: number | undefined, exitCode: number | undefined, durationMs?: number): ITaskProcessEndedEvent {
		return {
			...common(task),
			kind: TaskEventKind.ProcessEnded,
			terminalId,
			exitCode,
			durationMs,
		};
	}

	export function inactive(task: Task, terminalId?: number, durationMs?: number): ITaskInactiveEvent {
		return {
			...common(task),
			kind: TaskEventKind.Inactive,
			terminalId,
			durationMs,
		};
	}

	export function terminated(task: Task, terminalId: number, exitReason: TerminalExitReason | undefined): ITaskTerminatedEvent {
		return {
			...common(task),
			kind: TaskEventKind.Terminated,
			exitReason,
			terminalId,
		};
	}

	export function general(kind: TaskEventKind.AcquiredInput | TaskEventKind.DependsOnStarted | TaskEventKind.Active | TaskEventKind.Inactive | TaskEventKind.End | TaskEventKind.ProblemMatcherStarted | TaskEventKind.ProblemMatcherFoundErrors, task: Task, terminalId?: number): ITaskGeneralEvent {
		return {
			...common(task),
			kind,
			terminalId,
		};
	}

	export function problemMatcherEnded(task: Task, hasErrors: boolean, terminalId?: number): ITaskProblemMatcherEndedEvent {
		return {
			...common(task),
			kind: TaskEventKind.ProblemMatcherEnded,
			hasErrors,
		};
	}

	export function changed(): ITaskChangedEvent {
		return { kind: TaskEventKind.Changed };
	}
}

export namespace KeyedTaskIdentifier {
	function sortedStringify(literal: any): string {
		const keys = Object.keys(literal).sort();
		let result: string = '';
		for (const key of keys) {
			let stringified = literal[key];
			if (stringified instanceof Object) {
				stringified = sortedStringify(stringified);
			} else if (typeof stringified === 'string') {
				stringified = stringified.replace(/,/g, ',,');
			}
			result += key + ',' + stringified + ',';
		}
		return result;
	}
	export function create(value: ITaskIdentifier): KeyedTaskIdentifier {
		const resultKey = sortedStringify(value);
		const result = { _key: resultKey, type: value.taskType };
		Object.assign(result, value);
		return result;
	}
}

export const enum TaskSettingId {
	AutoDetect = 'task.autoDetect',
	SaveBeforeRun = 'task.saveBeforeRun',
	ShowDecorations = 'task.showDecorations',
	ProblemMatchersNeverPrompt = 'task.problemMatchers.neverPrompt',
	SlowProviderWarning = 'task.slowProviderWarning',
	QuickOpenHistory = 'task.quickOpen.history',
	QuickOpenDetail = 'task.quickOpen.detail',
	QuickOpenSkip = 'task.quickOpen.skip',
	QuickOpenShowAll = 'task.quickOpen.showAll',
	AllowAutomaticTasks = 'task.allowAutomaticTasks',
	Reconnection = 'task.reconnection',
	VerboseLogging = 'task.verboseLogging',
	NotifyWindowOnTaskCompletion = 'task.notifyWindowOnTaskCompletion'
}

export const enum TasksSchemaProperties {
	Tasks = 'tasks',
	SuppressTaskName = 'tasks.suppressTaskName',
	Windows = 'tasks.windows',
	Osx = 'tasks.osx',
	Linux = 'tasks.linux',
	ShowOutput = 'tasks.showOutput',
	IsShellCommand = 'tasks.isShellCommand',
	ServiceTestSetting = 'tasks.service.testSetting',
}

export namespace TaskDefinition {
	export function createTaskIdentifier(external: ITaskIdentifier, reporter: { error(message: string): void }): KeyedTaskIdentifier | undefined {
		const definition = TaskDefinitionRegistry.get(external.type);
		if (definition === undefined) {
			// We have no task definition so we can't sanitize the literal. Take it as is
			const copy = Objects.deepClone(external);
			delete copy._key;
			return KeyedTaskIdentifier.create(copy);
		}

		const literal: { type: string;[name: string]: any } = Object.create(null);
		literal.type = definition.taskType;
		const required: Set<string> = new Set();
		definition.required.forEach(element => required.add(element));

		const properties = definition.properties;
		for (const property of Object.keys(properties)) {
			const value = external[property];
			if (value !== undefined && value !== null) {
				literal[property] = value;
			} else if (required.has(property)) {
				const schema = properties[property];
				if (schema.default !== undefined) {
					literal[property] = Objects.deepClone(schema.default);
				} else {
					switch (schema.type) {
						case 'boolean':
							literal[property] = false;
							break;
						case 'number':
						case 'integer':
							literal[property] = 0;
							break;
						case 'string':
							literal[property] = '';
							break;
						default:
							reporter.error(nls.localize(
								'TaskDefinition.missingRequiredProperty',
								'Error: the task identifier \'{0}\' is missing the required property \'{1}\'. The task identifier will be ignored.', JSON.stringify(external, undefined, 0), property
							));
							return undefined;
					}
				}
			}
		}
		return KeyedTaskIdentifier.create(literal);
	}
}

export const rerunTaskIcon = registerIcon('rerun-task', Codicon.refresh, nls.localize('rerunTaskIcon', 'View icon of the rerun task.'));
export const RerunForActiveTerminalCommandId = 'workbench.action.tasks.rerunForActiveTerminal';
export const RerunAllRunningTasksCommandId = 'workbench.action.tasks.rerunAllRunningTasks';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/taskService.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/taskService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkspaceFolder, IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { Task, ContributedTask, CustomTask, ITaskSet, TaskSorter, ITaskEvent, ITaskIdentifier, ConfiguringTask, TaskRunSource } from './tasks.js';
import { ITaskSummary, ITaskTerminateResponse, ITaskSystemInfo } from './taskSystem.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { RawContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { URI } from '../../../../base/common/uri.js';
import { IMarkerData } from '../../../../platform/markers/common/markers.js';
import type { SingleOrMany } from '../../../../base/common/types.js';
export type { ITaskSummary, Task, ITaskTerminateResponse as TaskTerminateResponse };
export const CustomExecutionSupportedContext = new RawContextKey<boolean>('customExecutionSupported', false, nls.localize('tasks.customExecutionSupported', "Whether CustomExecution tasks are supported. Consider using in the when clause of a \'taskDefinition\' contribution."));
export const ShellExecutionSupportedContext = new RawContextKey<boolean>('shellExecutionSupported', false, nls.localize('tasks.shellExecutionSupported', "Whether ShellExecution tasks are supported. Consider using in the when clause of a \'taskDefinition\' contribution."));
export const TaskCommandsRegistered = new RawContextKey<boolean>('taskCommandsRegistered', false, nls.localize('tasks.taskCommandsRegistered', "Whether the task commands have been registered yet"));
export const ProcessExecutionSupportedContext = new RawContextKey<boolean>('processExecutionSupported', false, nls.localize('tasks.processExecutionSupported', "Whether ProcessExecution tasks are supported. Consider using in the when clause of a \'taskDefinition\' contribution."));
export const ServerlessWebContext = new RawContextKey<boolean>('serverlessWebContext', false, nls.localize('tasks.serverlessWebContext', "True when in the web with no remote authority."));
export const TasksAvailableContext = new RawContextKey<boolean>('tasksAvailable', false, nls.localize('tasks.tasksAvailable', "Whether any tasks are available in the workspace."));
export const TaskExecutionSupportedContext = ContextKeyExpr.or(ContextKeyExpr.and(ShellExecutionSupportedContext, ProcessExecutionSupportedContext), CustomExecutionSupportedContext);

export const ITaskService = createDecorator<ITaskService>('taskService');

export interface ITaskProvider {
	provideTasks(validTypes: IStringDictionary<boolean>): Promise<ITaskSet>;
	resolveTask(task: ConfiguringTask): Promise<ContributedTask | undefined>;
}

export interface IProblemMatcherRunOptions {
	attachProblemMatcher?: boolean;
}

export interface ICustomizationProperties {
	group?: string | { kind?: string; isDefault?: boolean };
	problemMatcher?: SingleOrMany<string>;
	isBackground?: boolean;
	color?: string;
	icon?: string;
}

export interface ITaskFilter {
	version?: string;
	type?: string;
	task?: string;
}

interface IWorkspaceTaskResult {
	set: ITaskSet | undefined;
	configurations: {
		byIdentifier: IStringDictionary<ConfiguringTask>;
	} | undefined;
	hasErrors: boolean;
}

export interface IWorkspaceFolderTaskResult extends IWorkspaceTaskResult {
	workspaceFolder: IWorkspaceFolder;
}

export interface ITaskService {
	readonly _serviceBrand: undefined;
	readonly onDidStateChange: Event<ITaskEvent>;
	/** Fired when task providers are registered or unregistered */
	readonly onDidChangeTaskProviders: Event<void>;
	isReconnected: boolean;
	readonly onDidReconnectToTasks: Event<void>;
	supportsMultipleTaskExecutions: boolean;

	configureAction(): Action;
	run(task: Task | undefined, options?: IProblemMatcherRunOptions, runSource?: TaskRunSource): Promise<ITaskSummary | undefined>;
	inTerminal(): boolean;
	getActiveTasks(): Promise<Task[]>;
	getBusyTasks(): Promise<Task[]>;
	terminate(task: Task): Promise<ITaskTerminateResponse>;
	tasks(filter?: ITaskFilter): Promise<Task[]>;
	rerun(terminalInstanceId: number): void;
	/**
	 * Gets tasks currently known to the task system. Unlike {@link tasks},
	 * this does not activate extensions or prompt for workspace trust.
	 */
	getKnownTasks(filter?: ITaskFilter): Promise<Task[]>;
	taskTypes(): string[];
	getWorkspaceTasks(runSource?: TaskRunSource): Promise<Map<string, IWorkspaceFolderTaskResult>>;
	getSavedTasks(type: 'persistent' | 'historical'): Promise<(Task | ConfiguringTask)[]>;
	removeRecentlyUsedTask(taskRecentlyUsedKey: string): void;
	getTerminalsForTasks(tasks: SingleOrMany<Task>): URI[] | undefined;
	getTaskProblems(instanceId: number): Map<string, { resources: URI[]; markers: IMarkerData[] }> | undefined;
	/**
	 * @param alias The task's name, label or defined identifier.
	 */
	getTask(workspaceFolder: IWorkspace | IWorkspaceFolder | string, alias: string | ITaskIdentifier, compareId?: boolean): Promise<Task | undefined>;
	tryResolveTask(configuringTask: ConfiguringTask): Promise<Task | undefined>;
	createSorter(): TaskSorter;

	getTaskDescription(task: Task | ConfiguringTask): string | undefined;
	customize(task: ContributedTask | CustomTask | ConfiguringTask, properties?: {}, openConfig?: boolean): Promise<void>;
	openConfig(task: CustomTask | ConfiguringTask | undefined): Promise<boolean>;

	registerTaskProvider(taskProvider: ITaskProvider, type: string): IDisposable;

	registerTaskSystem(scheme: string, taskSystemInfo: ITaskSystemInfo): void;
	readonly onDidChangeTaskSystemInfo: Event<void>;
	readonly onDidChangeTaskConfig: Event<void>;
	readonly hasTaskSystemInfo: boolean;
	registerSupportedExecutions(custom?: boolean, shell?: boolean, process?: boolean): void;

	extensionCallbackTaskComplete(task: Task, result: number | undefined): Promise<void>;
}

export interface ITaskTerminalStatus {
	terminalId: number;
	status: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/taskSystem.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/taskSystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import Severity from '../../../../base/common/severity.js';
import { TerminateResponse } from '../../../../base/common/processes.js';
import { Event } from '../../../../base/common/event.js';
import { Platform } from '../../../../base/common/platform.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { Task, ITaskEvent, KeyedTaskIdentifier } from './tasks.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';

import { IShellLaunchConfig } from '../../../../platform/terminal/common/terminal.js';
import { IMarkerData } from '../../../../platform/markers/common/markers.js';
import type { SingleOrMany } from '../../../../base/common/types.js';

export const enum TaskErrors {
	NotConfigured,
	RunningTask,
	NoBuildTask,
	NoTestTask,
	ConfigValidationError,
	TaskNotFound,
	NoValidTaskRunner,
	UnknownError
}

export class VerifiedTask {
	readonly task: Task;
	readonly resolver: ITaskResolver;
	readonly trigger: string;
	resolvedVariables?: IResolvedVariables;
	systemInfo?: ITaskSystemInfo;
	workspaceFolder?: IWorkspaceFolder;
	shellLaunchConfig?: IShellLaunchConfig;

	constructor(task: Task, resolver: ITaskResolver, trigger: string) {
		this.task = task;
		this.resolver = resolver;
		this.trigger = trigger;
	}

	public verify(): boolean {
		let verified = false;
		if (this.trigger && this.resolvedVariables && this.workspaceFolder && (this.shellLaunchConfig !== undefined)) {
			verified = true;
		}
		return verified;
	}

	public getVerifiedTask(): { task: Task; resolver: ITaskResolver; trigger: string; resolvedVariables: IResolvedVariables; systemInfo: ITaskSystemInfo; workspaceFolder: IWorkspaceFolder; shellLaunchConfig: IShellLaunchConfig } {
		if (this.verify()) {
			return { task: this.task, resolver: this.resolver, trigger: this.trigger, resolvedVariables: this.resolvedVariables!, systemInfo: this.systemInfo!, workspaceFolder: this.workspaceFolder!, shellLaunchConfig: this.shellLaunchConfig! };
		} else {
			throw new Error('VerifiedTask was not checked. verify must be checked before getVerifiedTask.');
		}
	}
}

export class TaskError {
	public severity: Severity;
	public message: string;
	public code: TaskErrors;

	constructor(severity: Severity, message: string, code: TaskErrors) {
		this.severity = severity;
		this.message = message;
		this.code = code;
	}
}

export namespace Triggers {
	export const shortcut: string = 'shortcut';
	export const command: string = 'command';
	export const reconnect: string = 'reconnect';
}

export interface ITaskSummary {
	/**
	 * Exit code of the process.
	 */
	exitCode?: number;
}

export const enum TaskExecuteKind {
	Started = 1,
	Active = 2
}

export interface ITaskExecuteResult {
	kind: TaskExecuteKind;
	promise: Promise<ITaskSummary>;
	task: Task;
	started?: {
		restartOnFileChanges?: string;
	};
	active?: {
		same: boolean;
		background: boolean;
	};
}

export interface ITaskResolver {
	resolve(uri: URI | string, identifier: string | KeyedTaskIdentifier | undefined): Promise<Task | undefined>;
}

export interface ITaskTerminateResponse extends TerminateResponse {
	task: Task | undefined;
}

export interface IResolveSet {
	process?: {
		name: string;
		cwd?: string;
		path?: string;
	};
	variables: Set<string>;
}

export interface IResolvedVariables {
	process?: string;
	variables: Map<string, string>;
}

export interface ITaskSystemInfo {
	platform: Platform;
	context: any;
	uriProvider: (this: void, path: string) => URI;
	resolveVariables(workspaceFolder: IWorkspaceFolder, toResolve: IResolveSet, target: ConfigurationTarget): Promise<IResolvedVariables | undefined>;
	findExecutable(command: string, cwd?: string, paths?: string[]): Promise<string | undefined>;
}

export interface ITaskSystemInfoResolver {
	(workspaceFolder: IWorkspaceFolder | undefined): ITaskSystemInfo | undefined;
}

export interface ITaskSystem {
	readonly onDidStateChange: Event<ITaskEvent>;
	reconnect(task: Task, resolver: ITaskResolver): ITaskExecuteResult;
	run(task: Task, resolver: ITaskResolver): ITaskExecuteResult;
	rerun(): ITaskExecuteResult | undefined;
	isActive(): Promise<boolean>;
	isActiveSync(): boolean;
	getActiveTasks(): Task[];
	getLastInstance(task: Task): Task | undefined;
	getBusyTasks(): Task[];
	canAutoTerminate(): boolean;
	terminate(task: Task): Promise<ITaskTerminateResponse>;
	terminateAll(): Promise<ITaskTerminateResponse[]>;
	revealTask(task: Task): boolean;
	customExecutionComplete(task: Task, result: number): Promise<void>;
	isTaskVisible(task: Task): boolean;
	getTaskForTerminal(instanceId: number): Promise<Task | undefined>;
	getTerminalsForTasks(tasks: SingleOrMany<Task>): URI[] | undefined;
	getTaskProblems(instanceId: number): Map<string, { resources: URI[]; markers: IMarkerData[] }> | undefined;
	getFirstInstance(task: Task): Task | undefined;
	get lastTask(): VerifiedTask | undefined;
	set lastTask(task: VerifiedTask);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/taskTemplates.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/taskTemplates.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import { IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';

export interface ITaskEntry extends IQuickPickItem {
	sort?: string;
	autoDetect: boolean;
	content: string;
}

const dotnetBuild: ITaskEntry = {
	id: 'dotnetCore',
	label: '.NET Core',
	sort: 'NET Core',
	autoDetect: false,
	description: nls.localize('dotnetCore', 'Executes .NET Core build command'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "2.0.0",',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"label": "build",',
		'\t\t\t"command": "dotnet",',
		'\t\t\t"type": "shell",',
		'\t\t\t"args": [',
		'\t\t\t\t"build",',
		'\t\t\t\t// Ask dotnet build to generate full paths for file names.',
		'\t\t\t\t"/property:GenerateFullPaths=true",',
		'\t\t\t\t// Do not generate summary otherwise it leads to duplicate errors in Problems panel',
		'\t\t\t\t"/consoleloggerparameters:NoSummary"',
		'\t\t\t],',
		'\t\t\t"group": "build",',
		'\t\t\t"presentation": {',
		'\t\t\t\t"reveal": "silent"',
		'\t\t\t},',
		'\t\t\t"problemMatcher": "$msCompile"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const msbuild: ITaskEntry = {
	id: 'msbuild',
	label: 'MSBuild',
	autoDetect: false,
	description: nls.localize('msbuild', 'Executes the build target'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "2.0.0",',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"label": "build",',
		'\t\t\t"type": "shell",',
		'\t\t\t"command": "msbuild",',
		'\t\t\t"args": [',
		'\t\t\t\t// Ask msbuild to generate full paths for file names.',
		'\t\t\t\t"/property:GenerateFullPaths=true",',
		'\t\t\t\t"/t:build",',
		'\t\t\t\t// Do not generate summary otherwise it leads to duplicate errors in Problems panel',
		'\t\t\t\t"/consoleloggerparameters:NoSummary"',
		'\t\t\t],',
		'\t\t\t"group": "build",',
		'\t\t\t"presentation": {',
		'\t\t\t\t// Reveal the output only if unrecognized errors occur.',
		'\t\t\t\t"reveal": "silent"',
		'\t\t\t},',
		'\t\t\t// Use the standard MS compiler pattern to detect errors, warnings and infos',
		'\t\t\t"problemMatcher": "$msCompile"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const command: ITaskEntry = {
	id: 'externalCommand',
	label: 'Others',
	autoDetect: false,
	description: nls.localize('externalCommand', 'Example to run an arbitrary external command'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "2.0.0",',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"label": "echo",',
		'\t\t\t"type": "shell",',
		'\t\t\t"command": "echo Hello"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const maven: ITaskEntry = {
	id: 'maven',
	label: 'maven',
	sort: 'MVN',
	autoDetect: false,
	description: nls.localize('Maven', 'Executes common maven commands'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "2.0.0",',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"label": "verify",',
		'\t\t\t"type": "shell",',
		'\t\t\t"command": "mvn -B verify",',
		'\t\t\t"group": "build"',
		'\t\t},',
		'\t\t{',
		'\t\t\t"label": "test",',
		'\t\t\t"type": "shell",',
		'\t\t\t"command": "mvn -B test",',
		'\t\t\t"group": "test"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

let _templates: ITaskEntry[] | null = null;
export function getTemplates(): ITaskEntry[] {
	if (!_templates) {
		_templates = [dotnetBuild, msbuild, maven].sort((a, b) => {
			return (a.sort || a.label).localeCompare(b.sort || b.label);
		});
		_templates.push(command);
	}
	return _templates;
}


/** Version 1.0 templates
 *
const gulp: TaskEntry = {
	id: 'gulp',
	label: 'Gulp',
	autoDetect: true,
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "gulp",',
		'\t"isShellCommand": true,',
		'\t"args": ["--no-color"],',
		'\t"showOutput": "always"',
		'}'
	].join('\n')
};

const grunt: TaskEntry = {
	id: 'grunt',
	label: 'Grunt',
	autoDetect: true,
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "grunt",',
		'\t"isShellCommand": true,',
		'\t"args": ["--no-color"],',
		'\t"showOutput": "always"',
		'}'
	].join('\n')
};

const npm: TaskEntry = {
	id: 'npm',
	label: 'npm',
	sort: 'NPM',
	autoDetect: false,
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "npm",',
		'\t"isShellCommand": true,',
		'\t"showOutput": "always",',
		'\t"suppressTaskName": true,',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"taskName": "install",',
		'\t\t\t"args": ["install"]',
		'\t\t},',
		'\t\t{',
		'\t\t\t"taskName": "update",',
		'\t\t\t"args": ["update"]',
		'\t\t},',
		'\t\t{',
		'\t\t\t"taskName": "test",',
		'\t\t\t"args": ["run", "test"]',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const tscConfig: TaskEntry = {
	id: 'tsc.config',
	label: 'TypeScript - tsconfig.json',
	autoDetect: false,
	description: nls.localize('tsc.config', 'Compiles a TypeScript project'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "tsc",',
		'\t"isShellCommand": true,',
		'\t"args": ["-p", "."],',
		'\t"showOutput": "silent",',
		'\t"problemMatcher": "$tsc"',
		'}'
	].join('\n')
};

const tscWatch: TaskEntry = {
	id: 'tsc.watch',
	label: 'TypeScript - Watch Mode',
	autoDetect: false,
	description: nls.localize('tsc.watch', 'Compiles a TypeScript project in watch mode'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "tsc",',
		'\t"isShellCommand": true,',
		'\t"args": ["-w", "-p", "."],',
		'\t"showOutput": "silent",',
		'\t"isBackground": true,',
		'\t"problemMatcher": "$tsc-watch"',
		'}'
	].join('\n')
};

const dotnetBuild: TaskEntry = {
	id: 'dotnetCore',
	label: '.NET Core',
	sort: 'NET Core',
	autoDetect: false,
	description: nls.localize('dotnetCore', 'Executes .NET Core build command'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "dotnet",',
		'\t"isShellCommand": true,',
		'\t"args": [],',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"taskName": "build",',
		'\t\t\t"args": [ ],',
		'\t\t\t"isBuildCommand": true,',
		'\t\t\t"showOutput": "silent",',
		'\t\t\t"problemMatcher": "$msCompile"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const msbuild: TaskEntry = {
	id: 'msbuild',
	label: 'MSBuild',
	autoDetect: false,
	description: nls.localize('msbuild', 'Executes the build target'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "msbuild",',
		'\t"args": [',
		'\t\t// Ask msbuild to generate full paths for file names.',
		'\t\t"/property:GenerateFullPaths=true"',
		'\t],',
		'\t"taskSelector": "/t:",',
		'\t"showOutput": "silent",',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"taskName": "build",',
		'\t\t\t// Show the output window only if unrecognized errors occur.',
		'\t\t\t"showOutput": "silent",',
		'\t\t\t// Use the standard MS compiler pattern to detect errors, warnings and infos',
		'\t\t\t"problemMatcher": "$msCompile"',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

const command: TaskEntry = {
	id: 'externalCommand',
	label: 'Others',
	autoDetect: false,
	description: nls.localize('externalCommand', 'Example to run an arbitrary external command'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "echo",',
		'\t"isShellCommand": true,',
		'\t"args": ["Hello World"],',
		'\t"showOutput": "always"',
		'}'
	].join('\n')
};

const maven: TaskEntry = {
	id: 'maven',
	label: 'maven',
	sort: 'MVN',
	autoDetect: false,
	description: nls.localize('Maven', 'Executes common maven commands'),
	content: [
		'{',
		'\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
		'\t// for the documentation about the tasks.json format',
		'\t"version": "0.1.0",',
		'\t"command": "mvn",',
		'\t"isShellCommand": true,',
		'\t"showOutput": "always",',
		'\t"suppressTaskName": true,',
		'\t"tasks": [',
		'\t\t{',
		'\t\t\t"taskName": "verify",',
		'\t\t\t"args": ["-B", "verify"],',
		'\t\t\t"isBuildCommand": true',
		'\t\t},',
		'\t\t{',
		'\t\t\t"taskName": "test",',
		'\t\t\t"args": ["-B", "test"],',
		'\t\t\t"isTestCommand": true',
		'\t\t}',
		'\t]',
		'}'
	].join('\n')
};

export let templates: TaskEntry[] = [gulp, grunt, tscConfig, tscWatch, dotnetBuild, msbuild, npm, maven].sort((a, b) => {
	return (a.sort || a.label).localeCompare(b.sort || b.label);
});
templates.push(command);
*/
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/electron-browser/taskService.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/electron-browser/taskService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as semver from '../../../../base/common/semver/semver.js';
import { IWorkspaceFolder, IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ITaskSystem } from '../common/taskSystem.js';
import { ExecutionEngine } from '../common/tasks.js';
import * as TaskConfig from '../common/taskConfiguration.js';
import { AbstractTaskService } from '../browser/abstractTaskService.js';
import { ITaskFilter, ITaskService } from '../common/taskService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { TerminalTaskSystem } from '../browser/terminalTaskSystem.js';
import { IConfirmationResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { TerminateResponseCode } from '../../../../base/common/processes.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { ITerminalGroupService, ITerminalService } from '../../terminal/browser/terminal.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IWorkspaceTrustManagementService, IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { ITerminalProfileResolverService } from '../../terminal/common/terminal.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IChatService } from '../../chat/common/chatService.js';
import { IChatAgentService } from '../../chat/common/chatAgents.js';
import { IHostService } from '../../../services/host/browser/host.js';

interface IWorkspaceFolderConfigurationResult {
	workspaceFolder: IWorkspaceFolder;
	config: TaskConfig.IExternalTaskRunnerConfiguration | undefined;
	hasErrors: boolean;
}

export class TaskService extends AbstractTaskService {
	constructor(@IConfigurationService configurationService: IConfigurationService,
		@IMarkerService markerService: IMarkerService,
		@IOutputService outputService: IOutputService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@IViewsService viewsService: IViewsService,
		@ICommandService commandService: ICommandService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ITextFileService textFileService: ITextFileService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IModelService modelService: IModelService,
		@IExtensionService extensionService: IExtensionService,
		@IQuickInputService quickInputService: IQuickInputService,
		@IConfigurationResolverService configurationResolverService: IConfigurationResolverService,
		@ITerminalService terminalService: ITerminalService,
		@ITerminalGroupService terminalGroupService: ITerminalGroupService,
		@IStorageService storageService: IStorageService,
		@IProgressService progressService: IProgressService,
		@IOpenerService openerService: IOpenerService,
		@IDialogService dialogService: IDialogService,
		@INotificationService notificationService: INotificationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@ITerminalProfileResolverService terminalProfileResolverService: ITerminalProfileResolverService,
		@IPathService pathService: IPathService,
		@ITextModelService textModelResolverService: ITextModelService,
		@IPreferencesService preferencesService: IPreferencesService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IWorkspaceTrustRequestService workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IWorkspaceTrustManagementService workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@ILogService logService: ILogService,
		@IThemeService themeService: IThemeService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IAccessibilitySignalService accessibilitySignalService: IAccessibilitySignalService,
		@IChatService _chatService: IChatService,
		@IChatAgentService _chatAgentService: IChatAgentService,
		@IHostService _hostService: IHostService
	) {
		super(configurationService,
			markerService,
			outputService,
			paneCompositeService,
			viewsService,
			commandService,
			editorService,
			fileService,
			contextService,
			telemetryService,
			textFileService,
			modelService,
			extensionService,
			quickInputService,
			configurationResolverService,
			terminalService,
			terminalGroupService,
			storageService,
			progressService,
			openerService,
			dialogService,
			notificationService,
			contextKeyService,
			environmentService,
			terminalProfileResolverService,
			pathService,
			textModelResolverService,
			preferencesService,
			viewDescriptorService,
			workspaceTrustRequestService,
			workspaceTrustManagementService,
			logService,
			themeService,
			lifecycleService,
			remoteAgentService,
			instantiationService,
			_chatService,
			_chatAgentService,
			_hostService
		);
		this._register(lifecycleService.onBeforeShutdown(event => event.veto(this.beforeShutdown(), 'veto.tasks')));
	}

	protected _getTaskSystem(): ITaskSystem {
		if (this._taskSystem) {
			return this._taskSystem;
		}
		const taskSystem = this._createTerminalTaskSystem();
		this._taskSystem = taskSystem;
		this._taskSystemListeners =
			[
				this._taskSystem.onDidStateChange((event) => {
					this._taskRunningState.set(this._taskSystem!.isActiveSync());
					this._onDidStateChange.fire(event);
				})
			];
		return this._taskSystem;
	}

	protected _computeLegacyConfiguration(workspaceFolder: IWorkspaceFolder): Promise<IWorkspaceFolderConfigurationResult> {
		const { config, hasParseErrors } = this._getConfiguration(workspaceFolder);
		if (hasParseErrors) {
			return Promise.resolve({ workspaceFolder: workspaceFolder, hasErrors: true, config: undefined });
		}
		if (config) {
			return Promise.resolve({ workspaceFolder, config, hasErrors: false });
		} else {
			return Promise.resolve({ workspaceFolder: workspaceFolder, hasErrors: true, config: undefined });
		}
	}

	protected _versionAndEngineCompatible(filter?: ITaskFilter): boolean {
		const range = filter && filter.version ? filter.version : undefined;
		const engine = this.executionEngine;

		return (range === undefined) || ((semver.satisfies('0.1.0', range) && engine === ExecutionEngine.Process) || (semver.satisfies('2.0.0', range) && engine === ExecutionEngine.Terminal));
	}

	public beforeShutdown(): boolean | Promise<boolean> {
		if (!this._taskSystem) {
			return false;
		}
		if (!this._taskSystem.isActiveSync()) {
			return false;
		}
		// The terminal service kills all terminal on shutdown. So there
		// is nothing we can do to prevent this here.
		if (this._taskSystem instanceof TerminalTaskSystem) {
			return false;
		}

		let terminatePromise: Promise<IConfirmationResult>;
		if (this._taskSystem.canAutoTerminate()) {
			terminatePromise = Promise.resolve({ confirmed: true });
		} else {
			terminatePromise = this._dialogService.confirm({
				message: nls.localize('TaskSystem.runningTask', 'There is a task running. Do you want to terminate it?'),
				primaryButton: nls.localize({ key: 'TaskSystem.terminateTask', comment: ['&& denotes a mnemonic'] }, "&&Terminate Task")
			});
		}

		return terminatePromise.then(res => {
			if (res.confirmed) {
				return this._taskSystem!.terminateAll().then((responses) => {
					let success = true;
					let code: number | undefined = undefined;
					for (const response of responses) {
						success = success && response.success;
						// We only have a code in the old output runner which only has one task
						// So we can use the first code.
						if (code === undefined && response.code !== undefined) {
							code = response.code;
						}
					}
					if (success) {
						this._taskSystem = undefined;
						this._disposeTaskSystemListeners();
						return false; // no veto
					} else if (code && code === TerminateResponseCode.ProcessNotFound) {
						return this._dialogService.confirm({
							message: nls.localize('TaskSystem.noProcess', 'The launched task doesn\'t exist anymore. If the task spawned background processes exiting VS Code might result in orphaned processes. To avoid this start the last background process with a wait flag.'),
							primaryButton: nls.localize({ key: 'TaskSystem.exitAnyways', comment: ['&& denotes a mnemonic'] }, "&&Exit Anyways"),
							type: 'info'
						}).then(res => !res.confirmed);
					}
					return true; // veto
				}, (err) => {
					return true; // veto
				});
			}

			return true; // veto
		});
	}
}

registerSingleton(ITaskService, TaskService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/test/browser/taskTerminalStatus.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/test/browser/taskTerminalStatus.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok } from 'assert';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ACTIVE_TASK_STATUS, FAILED_TASK_STATUS, SUCCEEDED_TASK_STATUS, TaskTerminalStatus } from '../../browser/taskTerminalStatus.js';
import { AbstractProblemCollector } from '../../common/problemCollectors.js';
import { CommonTask, ITaskEvent, TaskEventKind, TaskRunType } from '../../common/tasks.js';
import { ITaskService, Task } from '../../common/taskService.js';
import { ITerminalInstance } from '../../../terminal/browser/terminal.js';
import { ITerminalStatusList, TerminalStatusList } from '../../../terminal/browser/terminalStatusList.js';
import { ITerminalStatus } from '../../../terminal/common/terminal.js';
import { IMarker } from '../../../../../platform/markers/common/markers.js';

class TestTaskService implements Partial<ITaskService> {
	private readonly _onDidStateChange: Emitter<ITaskEvent> = new Emitter();
	public get onDidStateChange(): Event<ITaskEvent> {
		return this._onDidStateChange.event;
	}
	public triggerStateChange(event: Partial<ITaskEvent>): void {
		this._onDidStateChange.fire(event as ITaskEvent);
	}
}

class TestaccessibilitySignalService implements Partial<IAccessibilitySignalService> {
	async playSignal(cue: AccessibilitySignal): Promise<void> {
		return;
	}
}

class TestTerminal extends Disposable implements Partial<ITerminalInstance> {
	statusList: TerminalStatusList = this._register(new TerminalStatusList(new TestConfigurationService()));
	constructor() {
		super();
	}
	override dispose(): void {
		super.dispose();
	}
}

class TestTask extends CommonTask {

	constructor() {
		super('test', undefined, undefined, {}, {}, { kind: '', label: '' });
	}

	protected getFolderId(): string | undefined {
		throw new Error('Method not implemented.');
	}
	protected fromObject(object: any): Task {
		throw new Error('Method not implemented.');
	}
}

class TestProblemCollector extends Disposable implements Partial<AbstractProblemCollector> {
	protected readonly _onDidFindFirstMatch = new Emitter<void>();
	readonly onDidFindFirstMatch = this._onDidFindFirstMatch.event;
	protected readonly _onDidFindErrors = new Emitter<IMarker[]>();
	readonly onDidFindErrors = this._onDidFindErrors.event;
	protected readonly _onDidRequestInvalidateLastMarker = new Emitter<void>();
	readonly onDidRequestInvalidateLastMarker = this._onDidRequestInvalidateLastMarker.event;
}

suite('Task Terminal Status', () => {
	let instantiationService: TestInstantiationService;
	let taskService: TestTaskService;
	let taskTerminalStatus: TaskTerminalStatus;
	let testTerminal: ITerminalInstance;
	let testTask: Task;
	let problemCollector: AbstractProblemCollector;
	let accessibilitySignalService: TestaccessibilitySignalService;
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	setup(() => {
		instantiationService = store.add(new TestInstantiationService());
		taskService = new TestTaskService();
		accessibilitySignalService = new TestaccessibilitySignalService();
		// eslint-disable-next-line local/code-no-any-casts
		taskTerminalStatus = store.add(new TaskTerminalStatus(taskService as any, accessibilitySignalService as any));
		// eslint-disable-next-line local/code-no-any-casts
		testTerminal = store.add(instantiationService.createInstance(TestTerminal) as any);
		testTask = instantiationService.createInstance(TestTask) as unknown as Task;
		// eslint-disable-next-line local/code-no-any-casts
		problemCollector = store.add(instantiationService.createInstance(TestProblemCollector) as any);
	});
	test('Should add failed status when there is an exit code on task end', async () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.End });
		await poll<void>(async () => Promise.resolve(), () => testTerminal?.statusList.primary?.id === FAILED_TASK_STATUS.id, 'terminal status should be updated');
	});
	test('Should add active status when a non-background task is run for a second time in the same terminal', () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.SingleRun });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
	});
	test('Should drop status when a background task exits', async () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.Background });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessEnded, exitCode: 0 });
		await poll<void>(async () => Promise.resolve(), () => testTerminal?.statusList.statuses?.includes(SUCCEEDED_TASK_STATUS) === false, 'terminal should have dropped status');
	});
	test('Should add succeeded status when a non-background task exits', () => {
		taskTerminalStatus.addTerminal(testTask, testTerminal, problemCollector);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessStarted, runType: TaskRunType.SingleRun });
		assertStatus(testTerminal.statusList, ACTIVE_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.Inactive });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
		taskService.triggerStateChange({ kind: TaskEventKind.ProcessEnded, exitCode: 0 });
		assertStatus(testTerminal.statusList, SUCCEEDED_TASK_STATUS);
	});
});

function assertStatus(actual: ITerminalStatusList, expected: ITerminalStatus): void {
	ok(actual.statuses.length === 1, '# of statuses');
	ok(actual.primary?.id === expected.id, 'ID');
	ok(actual.primary?.severity === expected.severity, 'Severity');
}

async function poll<T>(
	fn: () => Thenable<T>,
	acceptFn: (result: T) => boolean,
	timeoutMessage: string,
	retryCount: number = 200,
	retryInterval: number = 10 // millis
): Promise<T> {
	let trial = 1;
	let lastError: string = '';

	while (true) {
		if (trial > retryCount) {
			throw new Error(`Timeout: ${timeoutMessage} after ${(retryCount * retryInterval) / 1000} seconds.\r${lastError}`);
		}

		let result;
		try {
			result = await fn();
			if (acceptFn(result)) {
				return result;
			} else {
				lastError = 'Did not pass accept function';
			}
		} catch (e: any) {
			lastError = Array.isArray(e.stack) ? e.stack.join('\n') : e.stack;
		}

		await new Promise(resolve => setTimeout(resolve, retryInterval));
		trial++;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/test/common/problemMatcher.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/test/common/problemMatcher.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as matchers from '../../common/problemMatcher.js';

import assert from 'assert';
import { ValidationState, IProblemReporter, ValidationStatus } from '../../../../../base/common/parsers.js';
import { MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

class ProblemReporter implements IProblemReporter {
	private _validationStatus: ValidationStatus;
	private _messages: string[];

	constructor() {
		this._validationStatus = new ValidationStatus();
		this._messages = [];
	}

	public info(message: string): void {
		this._messages.push(message);
		this._validationStatus.state = ValidationState.Info;
	}

	public warn(message: string): void {
		this._messages.push(message);
		this._validationStatus.state = ValidationState.Warning;
	}

	public error(message: string): void {
		this._messages.push(message);
		this._validationStatus.state = ValidationState.Error;
	}

	public fatal(message: string): void {
		this._messages.push(message);
		this._validationStatus.state = ValidationState.Fatal;
	}

	public hasMessage(message: string): boolean {
		return this._messages.indexOf(message) !== null;
	}
	public get messages(): string[] {
		return this._messages;
	}
	public get state(): ValidationState {
		return this._validationStatus.state;
	}

	public isOK(): boolean {
		return this._validationStatus.isOK();
	}

	public get status(): ValidationStatus {
		return this._validationStatus;
	}
}

suite('ProblemPatternParser', () => {
	let reporter: ProblemReporter;
	let parser: matchers.ProblemPatternParser;
	const testRegexp = new RegExp('test');

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		reporter = new ProblemReporter();
		parser = new matchers.ProblemPatternParser(reporter);
	});

	suite('single-pattern definitions', () => {
		test('parses a pattern defined by only a regexp', () => {
			const problemPattern: matchers.Config.IProblemPattern = {
				regexp: 'test'
			};
			const parsed = parser.parse(problemPattern);
			assert(reporter.isOK());
			assert.deepStrictEqual(parsed, {
				regexp: testRegexp,
				kind: matchers.ProblemLocationKind.Location,
				file: 1,
				line: 2,
				character: 3,
				message: 0
			});
		});
		test('does not sets defaults for line and character if kind is File', () => {
			const problemPattern: matchers.Config.IProblemPattern = {
				regexp: 'test',
				kind: 'file'
			};
			const parsed = parser.parse(problemPattern);
			assert.deepStrictEqual(parsed, {
				regexp: testRegexp,
				kind: matchers.ProblemLocationKind.File,
				file: 1,
				message: 0
			});
		});
	});

	suite('multi-pattern definitions', () => {
		test('defines a pattern based on regexp and property fields, with file/line location', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3, line: 4, column: 5, message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert(reporter.isOK());
			assert.deepStrictEqual(parsed,
				[{
					regexp: testRegexp,
					kind: matchers.ProblemLocationKind.Location,
					file: 3,
					line: 4,
					character: 5,
					message: 6
				}]
			);
		});
		test('defines a pattern bsaed on regexp and property fields, with location', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3, location: 4, message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert(reporter.isOK());
			assert.deepStrictEqual(parsed,
				[{
					regexp: testRegexp,
					kind: matchers.ProblemLocationKind.Location,
					file: 3,
					location: 4,
					message: 6
				}]
			);
		});
		test('accepts a pattern that provides the fields from multiple entries', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3 },
				{ regexp: 'test1', line: 4 },
				{ regexp: 'test2', column: 5 },
				{ regexp: 'test3', message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert(reporter.isOK());
			assert.deepStrictEqual(parsed, [
				{ regexp: testRegexp, kind: matchers.ProblemLocationKind.Location, file: 3 },
				{ regexp: new RegExp('test1'), line: 4 },
				{ regexp: new RegExp('test2'), character: 5 },
				{ regexp: new RegExp('test3'), message: 6 }
			]);
		});
		test('forbids setting the loop flag outside of the last element in the array', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3, loop: true },
				{ regexp: 'test1', line: 4 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The loop property is only supported on the last line matcher.'));
		});
		test('forbids setting the kind outside of the first element of the array', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3 },
				{ regexp: 'test1', kind: 'file', line: 4 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. The kind property must be provided only in the first element'));
		});

		test('kind: Location requires a regexp', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ file: 0, line: 1, column: 20, message: 0 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is missing a regular expression.'));
		});
		test('kind: Location requires a regexp on every entry', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 3 },
				{ line: 4 },
				{ regexp: 'test2', column: 5 },
				{ regexp: 'test3', message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is missing a regular expression.'));
		});
		test('kind: Location requires a message', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 0, line: 1, column: 20 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must have at least have a file and a message.'));
		});

		test('kind: Location requires a file', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', line: 1, column: 20, message: 0 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must either have kind: "file" or have a line or location match group.'));
		});

		test('kind: Location requires either a line or location', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 1, column: 20, message: 0 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must either have kind: "file" or have a line or location match group.'));
		});

		test('kind: File accepts a regexp, file and message', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', file: 2, kind: 'file', message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert(reporter.isOK());
			assert.deepStrictEqual(parsed,
				[{
					regexp: testRegexp,
					kind: matchers.ProblemLocationKind.File,
					file: 2,
					message: 6
				}]
			);
		});

		test('kind: File requires a file', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', kind: 'file', message: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must have at least have a file and a message.'));
		});

		test('kind: File requires a message', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [
				{ regexp: 'test', kind: 'file', file: 6 }
			];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must have at least have a file and a message.'));
		});

		test('empty pattern array should be handled gracefully', () => {
			const problemPattern: matchers.Config.MultiLineProblemPattern = [];
			const parsed = parser.parse(problemPattern);
			assert.strictEqual(null, parsed);
			assert.strictEqual(ValidationState.Error, reporter.state);
			assert(reporter.hasMessage('The problem pattern is invalid. It must contain at least one pattern.'));
		});
	});
});

suite('ProblemPatternRegistry - msCompile', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('matches lines with leading whitespace', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = '    /workspace/app.cs(5,10): error CS1001: Sample message';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'CS1001');
		assert.strictEqual(marker.message, 'Sample message');
	});

	test('matches lines without diagnostic code', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = '/workspace/app.cs(3,7): warning : Message without code';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, undefined);
		assert.strictEqual(marker.message, 'Message without code');
	});

	test('matches lines without location information', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = 'Main.cs: warning CS0168: The variable \'x\' is declared but never used';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'CS0168');
		assert.strictEqual(marker.message, 'The variable \'x\' is declared but never used');
		assert.strictEqual(marker.severity, MarkerSeverity.Warning);
	});

	test('matches lines with build prefixes and fatal errors', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = '  1>c:/workspace/app.cs(12): fatal error C1002: Fatal diagnostics';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'C1002');
		assert.strictEqual(marker.message, 'Fatal diagnostics');
		assert.strictEqual(marker.severity, MarkerSeverity.Error);
	});

	test('matches info diagnostics with codes', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = '2>/workspace/app.cs(20,5): info INF1001: Informational diagnostics';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'INF1001');
		assert.strictEqual(marker.message, 'Informational diagnostics');
		assert.strictEqual(marker.severity, MarkerSeverity.Info);
	});

	test('matches lines with subcategory prefixes', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = 'Main.cs(17,20): subcategory warning CS0168: The variable \'x\' is declared but never used';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'CS0168');
		assert.strictEqual(marker.message, 'The variable \'x\' is declared but never used');
		assert.strictEqual(marker.severity, MarkerSeverity.Warning);
	});

	test('matches complex diagnostics with all qualifiers', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = '  12>c:/workspace/Main.cs(42,7,43,2): subcategory fatal error CS9999: Complex diagnostics';
		const result = matcher.handle([line]);
		assert.ok(result.match);
		const marker = result.match!.marker;
		assert.strictEqual(marker.code, 'CS9999');
		assert.strictEqual(marker.message, 'Complex diagnostics');
		assert.strictEqual(marker.severity, MarkerSeverity.Error);
		assert.strictEqual(marker.startLineNumber, 42);
		assert.strictEqual(marker.startColumn, 7);
		assert.strictEqual(marker.endLineNumber, 43);
		assert.strictEqual(marker.endColumn, 2);
	});

	test('ignores diagnostics without origin', () => {
		const matcher = matchers.createLineMatcher({
			owner: 'msCompile',
			applyTo: matchers.ApplyToKind.allDocuments,
			fileLocation: matchers.FileLocationKind.Absolute,
			pattern: matchers.ProblemPatternRegistry.get('msCompile')
		});
		const line = 'warning: The variable \'x\' is declared but never used';
		const result = matcher.handle([line]);
		assert.strictEqual(result.match, null);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/test/common/taskConfiguration.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/test/common/taskConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../../base/common/uri.js';
import assert from 'assert';
import Severity from '../../../../../base/common/severity.js';
import * as UUID from '../../../../../base/common/uuid.js';

import * as Types from '../../../../../base/common/types.js';
import * as Platform from '../../../../../base/common/platform.js';
import { ValidationStatus } from '../../../../../base/common/parsers.js';
import { ProblemMatcher, FileLocationKind, IProblemPattern, ApplyToKind, INamedProblemMatcher } from '../../common/problemMatcher.js';
import { WorkspaceFolder, IWorkspace } from '../../../../../platform/workspace/common/workspace.js';

import * as Tasks from '../../common/tasks.js';
import { parse, IParseResult, IProblemReporter, IExternalTaskRunnerConfiguration, ICustomTask, TaskConfigSource, IParseContext, ProblemMatcherConverter, IGlobals, ITaskParseResult, UUIDMap, TaskParser } from '../../common/taskConfiguration.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IContext } from '../../../../../platform/contextkey/common/contextkey.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITaskDefinitionRegistry } from '../../common/taskDefinitionRegistry.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const workspaceFolder: WorkspaceFolder = new WorkspaceFolder({
	uri: URI.file('/workspace/folderOne'),
	name: 'folderOne',
	index: 0
});

const workspace: IWorkspace = new Workspace('id', [workspaceFolder]);

class ProblemReporter implements IProblemReporter {

	private _validationStatus: ValidationStatus = new ValidationStatus();

	public receivedMessage: boolean = false;
	public lastMessage: string | undefined = undefined;

	public info(message: string): void {
		this.log(message);
	}

	public warn(message: string): void {
		this.log(message);
	}

	public error(message: string): void {
		this.log(message);
	}

	public fatal(message: string): void {
		this.log(message);
	}

	public get status(): ValidationStatus {
		return this._validationStatus;
	}

	private log(message: string): void {
		this.receivedMessage = true;
		this.lastMessage = message;
	}

	public clearMessage(): void {
		this.lastMessage = undefined;
	}
}

class ConfigurationBuilder {

	public result: Tasks.Task[];
	private builders: CustomTaskBuilder[];

	constructor() {
		this.result = [];
		this.builders = [];
	}

	public task(name: string, command: string): CustomTaskBuilder {
		const builder = new CustomTaskBuilder(this, name, command);
		this.builders.push(builder);
		this.result.push(builder.result);
		return builder;
	}

	public done(): void {
		for (const builder of this.builders) {
			builder.done();
		}
	}
}

class PresentationBuilder {

	public result: Tasks.IPresentationOptions;

	constructor(public parent: CommandConfigurationBuilder) {
		this.result = { echo: false, reveal: Tasks.RevealKind.Always, revealProblems: Tasks.RevealProblemKind.Never, focus: false, panel: Tasks.PanelKind.Shared, showReuseMessage: true, clear: false, close: false };
	}

	public echo(value: boolean): PresentationBuilder {
		this.result.echo = value;
		return this;
	}

	public reveal(value: Tasks.RevealKind): PresentationBuilder {
		this.result.reveal = value;
		return this;
	}

	public focus(value: boolean): PresentationBuilder {
		this.result.focus = value;
		return this;
	}

	public instance(value: Tasks.PanelKind): PresentationBuilder {
		this.result.panel = value;
		return this;
	}

	public showReuseMessage(value: boolean): PresentationBuilder {
		this.result.showReuseMessage = value;
		return this;
	}

	public close(value: boolean): PresentationBuilder {
		this.result.close = value;
		return this;
	}

	public done(): void {
	}
}

class CommandConfigurationBuilder {
	public result: Tasks.ICommandConfiguration;

	private presentationBuilder: PresentationBuilder;

	constructor(public parent: CustomTaskBuilder, command: string) {
		this.presentationBuilder = new PresentationBuilder(this);
		this.result = {
			name: command,
			runtime: Tasks.RuntimeType.Process,
			args: [],
			options: {
				cwd: '${workspaceFolder}'
			},
			presentation: this.presentationBuilder.result,
			suppressTaskName: false
		};
	}

	public name(value: string): CommandConfigurationBuilder {
		this.result.name = value;
		return this;
	}

	public runtime(value: Tasks.RuntimeType): CommandConfigurationBuilder {
		this.result.runtime = value;
		return this;
	}

	public args(value: string[]): CommandConfigurationBuilder {
		this.result.args = value;
		return this;
	}

	public options(value: Tasks.CommandOptions): CommandConfigurationBuilder {
		this.result.options = value;
		return this;
	}

	public taskSelector(value: string): CommandConfigurationBuilder {
		this.result.taskSelector = value;
		return this;
	}

	public suppressTaskName(value: boolean): CommandConfigurationBuilder {
		this.result.suppressTaskName = value;
		return this;
	}

	public presentation(): PresentationBuilder {
		return this.presentationBuilder;
	}

	public done(taskName: string): void {
		this.result.args = this.result.args!.map(arg => arg === '$name' ? taskName : arg);
		this.presentationBuilder.done();
	}
}

class CustomTaskBuilder {

	public result: Tasks.CustomTask;
	private commandBuilder: CommandConfigurationBuilder;

	constructor(public parent: ConfigurationBuilder, name: string, command: string) {
		this.commandBuilder = new CommandConfigurationBuilder(this, command);
		this.result = new Tasks.CustomTask(
			name,
			{ kind: Tasks.TaskSourceKind.Workspace, label: 'workspace', config: { workspaceFolder: workspaceFolder, element: undefined, index: -1, file: '.vscode/tasks.json' } },
			name,
			Tasks.CUSTOMIZED_TASK_TYPE,
			this.commandBuilder.result,
			false,
			{ reevaluateOnRerun: true },
			{
				identifier: name,
				name: name,
				isBackground: false,
				promptOnClose: true,
				problemMatchers: [],
			}
		);
	}

	public identifier(value: string): CustomTaskBuilder {
		this.result.configurationProperties.identifier = value;
		return this;
	}

	public group(value: string | Tasks.TaskGroup): CustomTaskBuilder {
		this.result.configurationProperties.group = value;
		return this;
	}

	public isBackground(value: boolean): CustomTaskBuilder {
		this.result.configurationProperties.isBackground = value;
		return this;
	}

	public promptOnClose(value: boolean): CustomTaskBuilder {
		this.result.configurationProperties.promptOnClose = value;
		return this;
	}

	public problemMatcher(): ProblemMatcherBuilder {
		const builder = new ProblemMatcherBuilder(this);
		this.result.configurationProperties.problemMatchers!.push(builder.result);
		return builder;
	}

	public command(): CommandConfigurationBuilder {
		return this.commandBuilder;
	}

	public done(): void {
		this.commandBuilder.done(this.result.configurationProperties.name!);
	}
}

class ProblemMatcherBuilder {

	public static readonly DEFAULT_UUID = UUID.generateUuid();

	public result: ProblemMatcher;

	constructor(public parent: CustomTaskBuilder) {
		this.result = {
			owner: ProblemMatcherBuilder.DEFAULT_UUID,
			applyTo: ApplyToKind.allDocuments,
			severity: undefined,
			fileLocation: FileLocationKind.Relative,
			filePrefix: '${workspaceFolder}',
			pattern: undefined!
		};
	}

	public owner(value: string): ProblemMatcherBuilder {
		this.result.owner = value;
		return this;
	}

	public applyTo(value: ApplyToKind): ProblemMatcherBuilder {
		this.result.applyTo = value;
		return this;
	}

	public severity(value: Severity): ProblemMatcherBuilder {
		this.result.severity = value;
		return this;
	}

	public fileLocation(value: FileLocationKind): ProblemMatcherBuilder {
		this.result.fileLocation = value;
		return this;
	}

	public filePrefix(value: string): ProblemMatcherBuilder {
		this.result.filePrefix = value;
		return this;
	}

	public pattern(regExp: RegExp): PatternBuilder {
		const builder = new PatternBuilder(this, regExp);
		if (!this.result.pattern) {
			this.result.pattern = builder.result;
		}
		return builder;
	}
}

class PatternBuilder {
	public result: IProblemPattern;

	constructor(public parent: ProblemMatcherBuilder, regExp: RegExp) {
		this.result = {
			regexp: regExp,
			file: 1,
			message: 0,
			line: 2,
			character: 3
		};
	}

	public file(value: number): PatternBuilder {
		this.result.file = value;
		return this;
	}

	public message(value: number): PatternBuilder {
		this.result.message = value;
		return this;
	}

	public location(value: number): PatternBuilder {
		this.result.location = value;
		return this;
	}

	public line(value: number): PatternBuilder {
		this.result.line = value;
		return this;
	}

	public character(value: number): PatternBuilder {
		this.result.character = value;
		return this;
	}

	public endLine(value: number): PatternBuilder {
		this.result.endLine = value;
		return this;
	}

	public endCharacter(value: number): PatternBuilder {
		this.result.endCharacter = value;
		return this;
	}

	public code(value: number): PatternBuilder {
		this.result.code = value;
		return this;
	}

	public severity(value: number): PatternBuilder {
		this.result.severity = value;
		return this;
	}

	public loop(value: boolean): PatternBuilder {
		this.result.loop = value;
		return this;
	}
}

class TasksMockContextKeyService extends MockContextKeyService {
	public override getContext(domNode: HTMLElement): IContext {
		return {
			getValue: <T>(_key: string) => {
				return <T><unknown>true;
			}
		};
	}
}

function testDefaultProblemMatcher(external: IExternalTaskRunnerConfiguration, resolved: number) {
	const reporter = new ProblemReporter();
	const result = parse(workspaceFolder, workspace, Platform.platform, external, reporter, TaskConfigSource.TasksJson, new TasksMockContextKeyService());
	assert.ok(!reporter.receivedMessage);
	assert.strictEqual(result.custom.length, 1);
	const task = result.custom[0];
	assert.ok(task);
	assert.strictEqual(task.configurationProperties.problemMatchers!.length, resolved);
}

function testConfiguration(external: IExternalTaskRunnerConfiguration, builder: ConfigurationBuilder): void {
	builder.done();
	const reporter = new ProblemReporter();
	const result = parse(workspaceFolder, workspace, Platform.platform, external, reporter, TaskConfigSource.TasksJson, new TasksMockContextKeyService());
	if (reporter.receivedMessage) {
		assert.ok(false, reporter.lastMessage);
	}
	assertConfiguration(result, builder.result);
}

class TaskGroupMap {
	private _store: { [key: string]: Tasks.Task[] };

	constructor() {
		this._store = Object.create(null);
	}

	public add(group: string, task: Tasks.Task): void {
		let tasks = this._store[group];
		if (!tasks) {
			tasks = [];
			this._store[group] = tasks;
		}
		tasks.push(task);
	}

	public static assert(actual: TaskGroupMap, expected: TaskGroupMap): void {
		const actualKeys = Object.keys(actual._store);
		const expectedKeys = Object.keys(expected._store);
		if (actualKeys.length === 0 && expectedKeys.length === 0) {
			return;
		}
		assert.strictEqual(actualKeys.length, expectedKeys.length);
		actualKeys.forEach(key => assert.ok(expected._store[key]));
		expectedKeys.forEach(key => actual._store[key]);
		actualKeys.forEach((key) => {
			const actualTasks = actual._store[key];
			const expectedTasks = expected._store[key];
			assert.strictEqual(actualTasks.length, expectedTasks.length);
			if (actualTasks.length === 1) {
				assert.strictEqual(actualTasks[0].configurationProperties.name, expectedTasks[0].configurationProperties.name);
				return;
			}
			const expectedTaskMap: { [key: string]: boolean } = Object.create(null);
			expectedTasks.forEach(task => expectedTaskMap[task.configurationProperties.name!] = true);
			actualTasks.forEach(task => delete expectedTaskMap[task.configurationProperties.name!]);
			assert.strictEqual(Object.keys(expectedTaskMap).length, 0);
		});
	}
}

function assertConfiguration(result: IParseResult, expected: Tasks.Task[]): void {
	assert.ok(result.validationStatus.isOK());
	const actual = result.custom;
	assert.strictEqual(typeof actual, typeof expected);
	if (!actual) {
		return;
	}

	// We can't compare Ids since the parser uses UUID which are random
	// So create a new map using the name.
	const actualTasks: { [key: string]: Tasks.Task } = Object.create(null);
	const actualId2Name: { [key: string]: string } = Object.create(null);
	const actualTaskGroups = new TaskGroupMap();
	actual.forEach(task => {
		assert.ok(!actualTasks[task.configurationProperties.name!]);
		actualTasks[task.configurationProperties.name!] = task;
		actualId2Name[task._id] = task.configurationProperties.name!;

		const taskId = Tasks.TaskGroup.from(task.configurationProperties.group)?._id;
		if (taskId) {
			actualTaskGroups.add(taskId, task);
		}
	});
	const expectedTasks: { [key: string]: Tasks.Task } = Object.create(null);
	const expectedTaskGroup = new TaskGroupMap();
	expected.forEach(task => {
		assert.ok(!expectedTasks[task.configurationProperties.name!]);
		expectedTasks[task.configurationProperties.name!] = task;
		const taskId = Tasks.TaskGroup.from(task.configurationProperties.group)?._id;
		if (taskId) {
			expectedTaskGroup.add(taskId, task);
		}
	});
	const actualKeys = Object.keys(actualTasks);
	assert.strictEqual(actualKeys.length, expected.length);
	actualKeys.forEach((key) => {
		const actualTask = actualTasks[key];
		const expectedTask = expectedTasks[key];
		assert.ok(expectedTask);
		assertTask(actualTask, expectedTask);
	});
	TaskGroupMap.assert(actualTaskGroups, expectedTaskGroup);
}

function assertTask(actual: Tasks.Task, expected: Tasks.Task) {
	assert.ok(actual._id);
	assert.strictEqual(actual.configurationProperties.name, expected.configurationProperties.name, 'name');
	if (!Tasks.InMemoryTask.is(actual) && !Tasks.InMemoryTask.is(expected)) {
		assertCommandConfiguration(actual.command, expected.command);
	}
	assert.strictEqual(actual.configurationProperties.isBackground, expected.configurationProperties.isBackground, 'isBackground');
	assert.strictEqual(typeof actual.configurationProperties.problemMatchers, typeof expected.configurationProperties.problemMatchers);
	assert.strictEqual(actual.configurationProperties.promptOnClose, expected.configurationProperties.promptOnClose, 'promptOnClose');
	assert.strictEqual(typeof actual.configurationProperties.group, typeof expected.configurationProperties.group, `group types unequal`);

	if (actual.configurationProperties.problemMatchers && expected.configurationProperties.problemMatchers) {
		assert.strictEqual(actual.configurationProperties.problemMatchers.length, expected.configurationProperties.problemMatchers.length);
		for (let i = 0; i < actual.configurationProperties.problemMatchers.length; i++) {
			assertProblemMatcher(actual.configurationProperties.problemMatchers[i], expected.configurationProperties.problemMatchers[i]);
		}
	}

	if (actual.configurationProperties.group && expected.configurationProperties.group) {
		if (Types.isString(actual.configurationProperties.group)) {
			assert.strictEqual(actual.configurationProperties.group, expected.configurationProperties.group);
		} else {
			assertGroup(actual.configurationProperties.group as Tasks.TaskGroup, expected.configurationProperties.group as Tasks.TaskGroup);
		}
	}
}

function assertCommandConfiguration(actual: Tasks.ICommandConfiguration, expected: Tasks.ICommandConfiguration) {
	assert.strictEqual(typeof actual, typeof expected);
	if (actual && expected) {
		assertPresentation(actual.presentation!, expected.presentation!);
		assert.strictEqual(actual.name, expected.name, 'name');
		assert.strictEqual(actual.runtime, expected.runtime, 'runtime type');
		assert.strictEqual(actual.suppressTaskName, expected.suppressTaskName, 'suppressTaskName');
		assert.strictEqual(actual.taskSelector, expected.taskSelector, 'taskSelector');
		assert.deepStrictEqual(actual.args, expected.args, 'args');
		assert.strictEqual(typeof actual.options, typeof expected.options);
		if (actual.options && expected.options) {
			assert.strictEqual(actual.options.cwd, expected.options.cwd, 'cwd');
			assert.strictEqual(typeof actual.options.env, typeof expected.options.env, 'env');
			if (actual.options.env && expected.options.env) {
				assert.deepStrictEqual(actual.options.env, expected.options.env, 'env');
			}
		}
	}
}

function assertGroup(actual: Tasks.TaskGroup, expected: Tasks.TaskGroup) {
	assert.strictEqual(typeof actual, typeof expected);
	if (actual && expected) {
		assert.strictEqual(actual._id, expected._id, `group ids unequal. actual: ${actual._id} expected ${expected._id}`);
		assert.strictEqual(actual.isDefault, expected.isDefault, `group defaults unequal. actual: ${actual.isDefault} expected ${expected.isDefault}`);
	}
}

function assertPresentation(actual: Tasks.IPresentationOptions, expected: Tasks.IPresentationOptions) {
	assert.strictEqual(typeof actual, typeof expected);
	if (actual && expected) {
		assert.strictEqual(actual.echo, expected.echo);
		assert.strictEqual(actual.reveal, expected.reveal);
	}
}

function assertProblemMatcher(actual: string | ProblemMatcher, expected: string | ProblemMatcher) {
	assert.strictEqual(typeof actual, typeof expected);
	if (typeof actual === 'string' && typeof expected === 'string') {
		assert.strictEqual(actual, expected, 'Problem matcher references are different');
		return;
	}
	if (typeof actual !== 'string' && typeof expected !== 'string') {
		if (expected.owner === ProblemMatcherBuilder.DEFAULT_UUID) {
			assert.ok(UUID.isUUID(actual.owner), 'Owner must be a UUID');
		} else {
			assert.strictEqual(actual.owner, expected.owner);
		}
		assert.strictEqual(actual.applyTo, expected.applyTo);
		assert.strictEqual(actual.severity, expected.severity);
		assert.strictEqual(actual.fileLocation, expected.fileLocation);
		assert.strictEqual(actual.filePrefix, expected.filePrefix);
		if (actual.pattern && expected.pattern) {
			assertProblemPatterns(actual.pattern, expected.pattern);
		}
	}
}

function assertProblemPatterns(actual: Types.SingleOrMany<IProblemPattern>, expected: Types.SingleOrMany<IProblemPattern>) {
	assert.strictEqual(typeof actual, typeof expected);
	if (Array.isArray(actual)) {
		const actuals = <IProblemPattern[]>actual;
		const expecteds = <IProblemPattern[]>expected;
		assert.strictEqual(actuals.length, expecteds.length);
		for (let i = 0; i < actuals.length; i++) {
			assertProblemPattern(actuals[i], expecteds[i]);
		}
	} else {
		assertProblemPattern(<IProblemPattern>actual, <IProblemPattern>expected);
	}
}

function assertProblemPattern(actual: IProblemPattern, expected: IProblemPattern) {
	assert.strictEqual(actual.regexp.toString(), expected.regexp.toString());
	assert.strictEqual(actual.file, expected.file);
	assert.strictEqual(actual.message, expected.message);
	if (typeof expected.location !== 'undefined') {
		assert.strictEqual(actual.location, expected.location);
	} else {
		assert.strictEqual(actual.line, expected.line);
		assert.strictEqual(actual.character, expected.character);
		assert.strictEqual(actual.endLine, expected.endLine);
		assert.strictEqual(actual.endCharacter, expected.endCharacter);
	}
	assert.strictEqual(actual.code, expected.code);
	assert.strictEqual(actual.severity, expected.severity);
	assert.strictEqual(actual.loop, expected.loop);
}

suite('Tasks version 0.1.0', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('tasks: all default', () => {
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc'
			}, builder);
	});

	test('tasks: global isShellCommand', () => {
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				isShellCommand: true
			},
			builder);
	});

	test('tasks: global show output silent', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			presentation().reveal(Tasks.RevealKind.Silent);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				showOutput: 'silent'
			},
			builder
		);
	});

	test('tasks: global promptOnClose default', () => {
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				promptOnClose: true
			},
			builder
		);
	});

	test('tasks: global promptOnClose', () => {
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			promptOnClose(false).
			command().suppressTaskName(true);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				promptOnClose: false
			},
			builder
		);
	});

	test('tasks: global promptOnClose default watching', () => {
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			isBackground(true).
			promptOnClose(false).
			command().suppressTaskName(true);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				isWatching: true
			},
			builder
		);
	});

	test('tasks: global show output never', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			presentation().reveal(Tasks.RevealKind.Never);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				showOutput: 'never'
			},
			builder
		);
	});

	test('tasks: global echo Command', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			presentation().
			echo(true);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				echoCommand: true
			},
			builder
		);
	});

	test('tasks: global args', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			args(['--p']);
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				args: [
					'--p'
				]
			},
			builder
		);
	});

	test('tasks: options - cwd', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			options({
				cwd: 'myPath'
			});
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				options: {
					cwd: 'myPath'
				}
			},
			builder
		);
	});

	test('tasks: options - env', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			options({ cwd: '${workspaceFolder}', env: { key: 'value' } });
		testConfiguration(
			{
				version: '0.1.0',
				command: 'tsc',
				options: {
					env: {
						key: 'value'
					}
				}
			},
			builder
		);
	});

	test('tasks: os windows', () => {
		const name: string = Platform.isWindows ? 'tsc.win' : 'tsc';
		const builder = new ConfigurationBuilder();
		builder.
			task(name, name).
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			windows: {
				command: 'tsc.win'
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: os windows & global isShellCommand', () => {
		const name: string = Platform.isWindows ? 'tsc.win' : 'tsc';
		const builder = new ConfigurationBuilder();
		builder.
			task(name, name).
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			isShellCommand: true,
			windows: {
				command: 'tsc.win'
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: os mac', () => {
		const name: string = Platform.isMacintosh ? 'tsc.osx' : 'tsc';
		const builder = new ConfigurationBuilder();
		builder.
			task(name, name).
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			osx: {
				command: 'tsc.osx'
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: os linux', () => {
		const name: string = Platform.isLinux ? 'tsc.linux' : 'tsc';
		const builder = new ConfigurationBuilder();
		builder.
			task(name, name).
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			linux: {
				command: 'tsc.linux'
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: overwrite showOutput', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			presentation().reveal(Platform.isWindows ? Tasks.RevealKind.Always : Tasks.RevealKind.Never);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			showOutput: 'never',
			windows: {
				showOutput: 'always'
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: overwrite echo Command', () => {
		const builder = new ConfigurationBuilder();
		builder.
			task('tsc', 'tsc').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			presentation().
			echo(Platform.isWindows ? false : true);
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			echoCommand: true,
			windows: {
				echoCommand: false
			}
		};
		testConfiguration(external, builder);
	});

	test('tasks: global problemMatcher one', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			problemMatcher: '$msCompile'
		};
		testDefaultProblemMatcher(external, 1);
	});

	test('tasks: global problemMatcher two', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			problemMatcher: ['$eslint-compact', '$msCompile']
		};
		testDefaultProblemMatcher(external, 2);
	});

	test('tasks: task definition', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: build task', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					isBuildCommand: true
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').group(Tasks.TaskGroup.Build).command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: default build task', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'build'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('build', 'tsc').group(Tasks.TaskGroup.Build).command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: test task', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					isTestCommand: true
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').group(Tasks.TaskGroup.Test).command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: default test task', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'test'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('test', 'tsc').group(Tasks.TaskGroup.Test).command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: task with values', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'test',
					showOutput: 'never',
					echoCommand: true,
					args: ['--p'],
					isWatching: true
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('test', 'tsc').
			group(Tasks.TaskGroup.Test).
			isBackground(true).
			promptOnClose(false).
			command().args(['$name', '--p']).
			presentation().
			echo(true).reveal(Tasks.RevealKind.Never);

		testConfiguration(external, builder);
	});

	test('tasks: task inherits global values', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			showOutput: 'never',
			echoCommand: true,
			tasks: [
				{
					taskName: 'test'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('test', 'tsc').
			group(Tasks.TaskGroup.Test).
			command().args(['$name']).presentation().
			echo(true).reveal(Tasks.RevealKind.Never);

		testConfiguration(external, builder);
	});

	test('tasks: problem matcher default', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						pattern: {
							regexp: 'abc'
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().pattern(/abc/);
		testConfiguration(external, builder);
	});

	test('tasks: problem matcher .* regular expression', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						pattern: {
							regexp: '.*'
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().pattern(/.*/);
		testConfiguration(external, builder);
	});

	test('tasks: problem matcher owner, applyTo, severity and fileLocation', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						owner: 'myOwner',
						applyTo: 'closedDocuments',
						severity: 'warning',
						fileLocation: 'absolute',
						pattern: {
							regexp: 'abc'
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().
			owner('myOwner').
			applyTo(ApplyToKind.closedDocuments).
			severity(Severity.Warning).
			fileLocation(FileLocationKind.Absolute).
			filePrefix(undefined!).
			pattern(/abc/);
		testConfiguration(external, builder);
	});

	test('tasks: problem matcher fileLocation and filePrefix', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						fileLocation: ['relative', 'myPath'],
						pattern: {
							regexp: 'abc'
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().
			fileLocation(FileLocationKind.Relative).
			filePrefix('myPath').
			pattern(/abc/);
		testConfiguration(external, builder);
	});

	test('tasks: problem pattern location', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						pattern: {
							regexp: 'abc',
							file: 10,
							message: 11,
							location: 12,
							severity: 13,
							code: 14
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().
			pattern(/abc/).file(10).message(11).location(12).severity(13).code(14);
		testConfiguration(external, builder);
	});

	test('tasks: problem pattern line & column', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					problemMatcher: {
						pattern: {
							regexp: 'abc',
							file: 10,
							message: 11,
							line: 12,
							column: 13,
							endLine: 14,
							endColumn: 15,
							severity: 16,
							code: 17
						}
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().args(['$name']).parent.
			problemMatcher().
			pattern(/abc/).file(10).message(11).
			line(12).character(13).endLine(14).endCharacter(15).
			severity(16).code(17);
		testConfiguration(external, builder);
	});

	test('tasks: prompt on close default', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			promptOnClose(true).
			command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: prompt on close watching', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					isWatching: true
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			isBackground(true).promptOnClose(false).
			command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: prompt on close set', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskName',
					promptOnClose: false
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			promptOnClose(false).
			command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: task selector set', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			taskSelector: '/t:',
			tasks: [
				{
					taskName: 'taskName',
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().
			taskSelector('/t:').
			args(['/t:taskName']);
		testConfiguration(external, builder);
	});

	test('tasks: suppress task name set', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			suppressTaskName: false,
			tasks: [
				{
					taskName: 'taskName',
					suppressTaskName: true
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().suppressTaskName(true);
		testConfiguration(external, builder);
	});

	test('tasks: suppress task name inherit', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			suppressTaskName: true,
			tasks: [
				{
					taskName: 'taskName'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskName', 'tsc').
			command().suppressTaskName(true);
		testConfiguration(external, builder);
	});

	test('tasks: two tasks', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskNameOne'
				},
				{
					taskName: 'taskNameTwo'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').
			command().args(['$name']);
		builder.task('taskNameTwo', 'tsc').
			command().args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: with command', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'taskNameOne',
					command: 'tsc'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().suppressTaskName(true);
		testConfiguration(external, builder);
	});

	test('tasks: two tasks with command', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'taskNameOne',
					command: 'tsc'
				},
				{
					taskName: 'taskNameTwo',
					command: 'dir'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().suppressTaskName(true);
		builder.task('taskNameTwo', 'dir').command().suppressTaskName(true);
		testConfiguration(external, builder);
	});

	test('tasks: with command and args', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'taskNameOne',
					command: 'tsc',
					isShellCommand: true,
					args: ['arg'],
					options: {
						cwd: 'cwd',
						env: {
							env: 'env'
						}
					}
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).args(['arg']).options({ cwd: 'cwd', env: { env: 'env' } });
		testConfiguration(external, builder);
	});

	test('tasks: with command os specific', () => {
		const name: string = Platform.isWindows ? 'tsc.win' : 'tsc';
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'taskNameOne',
					command: 'tsc',
					windows: {
						command: 'tsc.win'
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', name).command().suppressTaskName(true);
		testConfiguration(external, builder);
	});

	test('tasks: with Windows specific args', () => {
		const args: string[] = Platform.isWindows ? ['arg1', 'arg2'] : ['arg1'];
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'tsc',
					command: 'tsc',
					args: ['arg1'],
					windows: {
						args: ['arg2']
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').command().suppressTaskName(true).args(args);
		testConfiguration(external, builder);
	});

	test('tasks: with Linux specific args', () => {
		const args: string[] = Platform.isLinux ? ['arg1', 'arg2'] : ['arg1'];
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			tasks: [
				{
					taskName: 'tsc',
					command: 'tsc',
					args: ['arg1'],
					linux: {
						args: ['arg2']
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('tsc', 'tsc').command().suppressTaskName(true).args(args);
		testConfiguration(external, builder);
	});

	test('tasks: global command and task command properties', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			tasks: [
				{
					taskName: 'taskNameOne',
					isShellCommand: true,
				} as ICustomTask
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().runtime(Tasks.RuntimeType.Shell).args(['$name']);
		testConfiguration(external, builder);
	});

	test('tasks: global and tasks args', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			args: ['global'],
			tasks: [
				{
					taskName: 'taskNameOne',
					args: ['local']
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().args(['global', '$name', 'local']);
		testConfiguration(external, builder);
	});

	test('tasks: global and tasks args with task selector', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			command: 'tsc',
			args: ['global'],
			taskSelector: '/t:',
			tasks: [
				{
					taskName: 'taskNameOne',
					args: ['local']
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('taskNameOne', 'tsc').command().taskSelector('/t:').args(['global', '/t:taskNameOne', 'local']);
		testConfiguration(external, builder);
	});
});

suite('Tasks version 2.0.0', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test.skip('Build workspace task', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			tasks: [
				{
					taskName: 'dir',
					command: 'dir',
					type: 'shell',
					group: 'build'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('dir', 'dir').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test('Global group none', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			command: 'dir',
			type: 'shell',
			group: 'none'
		};
		const builder = new ConfigurationBuilder();
		builder.task('dir', 'dir').
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test.skip('Global group build', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			command: 'dir',
			type: 'shell',
			group: 'build'
		};
		const builder = new ConfigurationBuilder();
		builder.task('dir', 'dir').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test.skip('Global group default build', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			command: 'dir',
			type: 'shell',
			group: { kind: 'build', isDefault: true }
		};
		const builder = new ConfigurationBuilder();
		const taskGroup = Tasks.TaskGroup.Build;
		taskGroup.isDefault = true;
		builder.task('dir', 'dir').
			group(taskGroup).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test('Local group none', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			tasks: [
				{
					taskName: 'dir',
					command: 'dir',
					type: 'shell',
					group: 'none'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('dir', 'dir').
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test.skip('Local group build', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			tasks: [
				{
					taskName: 'dir',
					command: 'dir',
					type: 'shell',
					group: 'build'
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('dir', 'dir').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test.skip('Local group default build', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			tasks: [
				{
					taskName: 'dir',
					command: 'dir',
					type: 'shell',
					group: { kind: 'build', isDefault: true }
				}
			]
		};
		const builder = new ConfigurationBuilder();
		const taskGroup = Tasks.TaskGroup.Build;
		taskGroup.isDefault = true;
		builder.task('dir', 'dir').
			group(taskGroup).
			command().suppressTaskName(true).
			runtime(Tasks.RuntimeType.Shell).
			presentation().echo(true);
		testConfiguration(external, builder);
	});
	test('Arg overwrite', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '2.0.0',
			tasks: [
				{
					label: 'echo',
					type: 'shell',
					command: 'echo',
					args: [
						'global'
					],
					windows: {
						args: [
							'windows'
						]
					},
					linux: {
						args: [
							'linux'
						]
					},
					osx: {
						args: [
							'osx'
						]
					}
				}
			]
		};
		const builder = new ConfigurationBuilder();
		if (Platform.isWindows) {
			builder.task('echo', 'echo').
				command().suppressTaskName(true).args(['windows']).
				runtime(Tasks.RuntimeType.Shell).
				presentation().echo(true);
			testConfiguration(external, builder);
		} else if (Platform.isLinux) {
			builder.task('echo', 'echo').
				command().suppressTaskName(true).args(['linux']).
				runtime(Tasks.RuntimeType.Shell).
				presentation().echo(true);
			testConfiguration(external, builder);
		} else if (Platform.isMacintosh) {
			builder.task('echo', 'echo').
				command().suppressTaskName(true).args(['osx']).
				runtime(Tasks.RuntimeType.Shell).
				presentation().echo(true);
			testConfiguration(external, builder);
		}
	});
});

suite('Bugs / regression tests', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	(Platform.isLinux ? test.skip : test)('Bug 19548', () => {
		const external: IExternalTaskRunnerConfiguration = {
			version: '0.1.0',
			windows: {
				command: 'powershell',
				options: {
					cwd: '${workspaceFolder}'
				},
				tasks: [
					{
						taskName: 'composeForDebug',
						suppressTaskName: true,
						args: [
							'-ExecutionPolicy',
							'RemoteSigned',
							'.\\dockerTask.ps1',
							'-ComposeForDebug',
							'-Environment',
							'debug'
						],
						isBuildCommand: false,
						showOutput: 'always',
						echoCommand: true
					} as ICustomTask
				]
			},
			osx: {
				command: '/bin/bash',
				options: {
					cwd: '${workspaceFolder}'
				},
				tasks: [
					{
						taskName: 'composeForDebug',
						suppressTaskName: true,
						args: [
							'-c',
							'./dockerTask.sh composeForDebug debug'
						],
						isBuildCommand: false,
						showOutput: 'always'
					} as ICustomTask
				]
			}
		};
		const builder = new ConfigurationBuilder();
		if (Platform.isWindows) {
			builder.task('composeForDebug', 'powershell').
				command().suppressTaskName(true).
				args(['-ExecutionPolicy', 'RemoteSigned', '.\\dockerTask.ps1', '-ComposeForDebug', '-Environment', 'debug']).
				options({ cwd: '${workspaceFolder}' }).
				presentation().echo(true).reveal(Tasks.RevealKind.Always);
			testConfiguration(external, builder);
		} else if (Platform.isMacintosh) {
			builder.task('composeForDebug', '/bin/bash').
				command().suppressTaskName(true).
				args(['-c', './dockerTask.sh composeForDebug debug']).
				options({ cwd: '${workspaceFolder}' }).
				presentation().reveal(Tasks.RevealKind.Always);
			testConfiguration(external, builder);
		}
	});

	test('Bug 28489', () => {
		const external = {
			version: '0.1.0',
			command: '',
			isShellCommand: true,
			args: [''],
			showOutput: 'always',
			'tasks': [
				{
					taskName: 'build',
					command: 'bash',
					args: [
						'build.sh'
					]
				}
			]
		};
		const builder = new ConfigurationBuilder();
		builder.task('build', 'bash').
			group(Tasks.TaskGroup.Build).
			command().suppressTaskName(true).
			args(['build.sh']).
			runtime(Tasks.RuntimeType.Shell);
		testConfiguration(external, builder);
	});
});

class TestNamedProblemMatcher implements Partial<ProblemMatcher> {
}

class TestParseContext implements Partial<IParseContext> {
}

class TestTaskDefinitionRegistry implements Partial<ITaskDefinitionRegistry> {
	private _task: Tasks.ITaskDefinition | undefined;
	public get(key: string): Tasks.ITaskDefinition {
		return this._task!;
	}
	public set(task: Tasks.ITaskDefinition) {
		this._task = task;
	}
}

suite('Task configuration conversions', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const globals = {} as IGlobals;
	const taskConfigSource = {} as TaskConfigSource;
	const TaskDefinitionRegistry = new TestTaskDefinitionRegistry();
	let instantiationService: TestInstantiationService;
	let parseContext: IParseContext;
	let namedProblemMatcher: INamedProblemMatcher;
	let problemReporter: ProblemReporter;
	setup(() => {
		instantiationService = new TestInstantiationService();
		namedProblemMatcher = instantiationService.createInstance(TestNamedProblemMatcher);
		namedProblemMatcher.name = 'real';
		namedProblemMatcher.label = 'real label';
		problemReporter = new ProblemReporter();
		parseContext = instantiationService.createInstance(TestParseContext);
		parseContext.problemReporter = problemReporter;
		parseContext.namedProblemMatchers = { 'real': namedProblemMatcher };
		parseContext.uuidMap = new UUIDMap();
	});
	teardown(() => {
		instantiationService.dispose();
	});
	suite('ProblemMatcherConverter.from', () => {
		test('returns [] and an error for an unknown problem matcher', () => {
			const result = (ProblemMatcherConverter.from('$fake', parseContext));
			assert.deepEqual(result.value, []);
			assert.strictEqual(result.errors?.length, 1);
		});
		test('returns config for a known problem matcher', () => {
			const result = (ProblemMatcherConverter.from('$real', parseContext));
			assert.strictEqual(result.errors?.length, 0);
			assert.deepEqual(result.value, [{ 'label': 'real label' }]);
		});
		test('returns config for a known problem matcher including applyTo', () => {
			namedProblemMatcher.applyTo = ApplyToKind.closedDocuments;
			const result = (ProblemMatcherConverter.from('$real', parseContext));
			assert.strictEqual(result.errors?.length, 0);
			assert.deepEqual(result.value, [{ 'label': 'real label', 'applyTo': ApplyToKind.closedDocuments }]);
		});
	});
	suite('TaskParser.from', () => {
		suite('CustomTask', () => {
			suite('incomplete config reports an appropriate error for missing', () => {
				test('name', () => {
					const result = TaskParser.from([{} as ICustomTask], globals, parseContext, taskConfigSource);
					assertTaskParseResult(result, undefined, problemReporter, 'Error: a task must provide a label property');
				});
				test('command', () => {
					const result = TaskParser.from([{ taskName: 'task' } as ICustomTask], globals, parseContext, taskConfigSource);
					assertTaskParseResult(result, undefined, problemReporter, `Error: the task 'task' doesn't define a command`);
				});
			});
			test('returns expected result', () => {
				const expected = [
					{ taskName: 'task', command: 'echo test' } as ICustomTask,
					{ taskName: 'task 2', command: 'echo test' } as ICustomTask
				];
				const result = TaskParser.from(expected, globals, parseContext, taskConfigSource);
				assertTaskParseResult(result, { custom: expected }, problemReporter, undefined);
			});
		});
		suite('ConfiguredTask', () => {
			test('returns expected result', () => {
				const expected = [{ taskName: 'task', command: 'echo test', type: 'any', label: 'task' }, { taskName: 'task 2', command: 'echo test', type: 'any', label: 'task 2' }];
				TaskDefinitionRegistry.set({ extensionId: 'registered', taskType: 'any', properties: {} } as Tasks.ITaskDefinition);
				const result = TaskParser.from(expected, globals, parseContext, taskConfigSource, TaskDefinitionRegistry);
				assertTaskParseResult(result, { configured: expected }, problemReporter, undefined);
			});
		});
	});
});

function assertTaskParseResult(actual: ITaskParseResult, expected: ITestTaskParseResult | undefined, problemReporter: ProblemReporter, expectedMessage?: string): void {
	if (expectedMessage === undefined) {
		assert.strictEqual(problemReporter.lastMessage, undefined);
	} else {
		assert.ok(problemReporter.lastMessage?.includes(expectedMessage));
	}

	assert.deepEqual(actual.custom.length, expected?.custom?.length || 0);
	assert.deepEqual(actual.configured.length, expected?.configured?.length || 0);

	let index = 0;
	if (expected?.configured) {
		for (const taskParseResult of expected?.configured) {
			assert.strictEqual(actual.configured[index]._label, taskParseResult.label);
			index++;
		}
	}
	index = 0;
	if (expected?.custom) {
		for (const taskParseResult of expected?.custom) {
			assert.strictEqual(actual.custom[index]._label, taskParseResult.taskName);
			index++;
		}
	}
	problemReporter.clearMessage();
}

interface ITestTaskParseResult {
	custom?: Partial<ICustomTask>[];
	configured?: Partial<ITestConfiguringTask>[];
}

interface ITestConfiguringTask extends Partial<Tasks.ConfiguringTask> {
	label: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/telemetry/browser/telemetry.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/telemetry/browser/telemetry.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase, ILifecycleService, StartupKind } from '../../../services/lifecycle/common/lifecycle.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { language } from '../../../../base/common/platform.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import ErrorTelemetry from '../../../../platform/telemetry/browser/errorTelemetry.js';
import { supportsTelemetry, TelemetryLogGroup, telemetryLogId, TelemetryTrustedValue } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { ConfigurationTarget, ConfigurationTargetToString, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITextFileService, ITextFileSaveEvent, ITextFileResolveEvent } from '../../../services/textfile/common/textfiles.js';
import { extname, basename, isEqual, isEqualOrParent } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { Schemas } from '../../../../base/common/network.js';
import { getMimeTypes } from '../../../../editor/common/services/languagesAssociations.js';
import { hash } from '../../../../base/common/hash.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { isBoolean, isNumber, isString } from '../../../../base/common/types.js';
import { LayoutSettings } from '../../../services/layout/browser/layoutService.js';
import { AutoRestartConfigurationKey, AutoUpdateConfigurationKey } from '../../extensions/common/extensions.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { ILoggerResource, ILoggerService, LogLevel } from '../../../../platform/log/common/log.js';
import { VerifyExtensionSignatureConfigKey } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { TerminalContribSettingId } from '../../terminal/terminalContribExports.js';

type TelemetryData = {
	mimeType: TelemetryTrustedValue<string>;
	ext: string;
	path: number;
	reason?: number;
	allowlistedjson?: string;
};

type FileTelemetryDataFragment = {
	mimeType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language type of the file (for example XML).' };
	ext: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The file extension of the file (for example xml).' };
	path: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The path of the file as a hash.' };
	reason?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason why a file is read or written. Allows to e.g. distinguish auto save from normal save.' };
	allowlistedjson?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the file but only if it matches some well known file names such as package.json or tsconfig.json.' };
};

export class TelemetryContribution extends Disposable implements IWorkbenchContribution {

	private static ALLOWLIST_JSON = ['package.json', 'package-lock.json', 'tsconfig.json', 'jsconfig.json', 'bower.json', '.eslintrc.json', 'tslint.json', 'composer.json'];
	private static ALLOWLIST_WORKSPACE_JSON = ['settings.json', 'extensions.json', 'tasks.json', 'launch.json'];

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IEditorService editorService: IEditorService,
		@IKeybindingService keybindingsService: IKeybindingService,
		@IWorkbenchThemeService themeService: IWorkbenchThemeService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@IProductService productService: IProductService,
		@ILoggerService private readonly loggerService: ILoggerService,
		@IOutputService private readonly outputService: IOutputService,
		@ITextFileService textFileService: ITextFileService
	) {
		super();

		const { filesToOpenOrCreate, filesToDiff, filesToMerge } = environmentService;
		const activeViewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);

		type WindowSizeFragment = {
			innerHeight: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The height of the current window.' };
			innerWidth: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The width of the current window.' };
			outerHeight: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The height of the current window with all decoration removed.' };
			outerWidth: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The width of the current window with all decoration removed.' };
			owner: 'bpasero';
			comment: 'The size of the window.';
		};

		type WorkspaceLoadClassification = {
			owner: 'bpasero';
			emptyWorkbench: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a folder or workspace is opened or not.' };
			windowSize: WindowSizeFragment;
			'workbench.filesToOpenOrCreate': { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of files that should open or be created.' };
			'workbench.filesToDiff': { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of files that should be compared.' };
			'workbench.filesToMerge': { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of files that should be merged.' };
			customKeybindingsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of custom keybindings' };
			theme: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The current theme of the window.' };
			language: { classification: 'SystemMetaData'; purpose: 'BusinessInsight'; comment: 'The display language of the window.' };
			pinnedViewlets: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifiers of views that are pinned.' };
			restoredViewlet?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the view that is restored.' };
			restoredEditors: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of editors that restored.' };
			startupKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How the window was opened, e.g via reload or not.' };
			comment: 'Metadata around the workspace that is being loaded into a window.';
		};

		type WorkspaceLoadEvent = {
			windowSize: { innerHeight: number; innerWidth: number; outerHeight: number; outerWidth: number };
			emptyWorkbench: boolean;
			'workbench.filesToOpenOrCreate': number;
			'workbench.filesToDiff': number;
			'workbench.filesToMerge': number;
			customKeybindingsCount: number;
			theme: string;
			language: string;
			pinnedViewlets: string[];
			restoredViewlet?: string;
			restoredEditors: number;
			startupKind: StartupKind;
		};

		telemetryService.publicLog2<WorkspaceLoadEvent, WorkspaceLoadClassification>('workspaceLoad', {
			windowSize: { innerHeight: mainWindow.innerHeight, innerWidth: mainWindow.innerWidth, outerHeight: mainWindow.outerHeight, outerWidth: mainWindow.outerWidth },
			emptyWorkbench: contextService.getWorkbenchState() === WorkbenchState.EMPTY,
			'workbench.filesToOpenOrCreate': filesToOpenOrCreate && filesToOpenOrCreate.length || 0,
			'workbench.filesToDiff': filesToDiff && filesToDiff.length || 0,
			'workbench.filesToMerge': filesToMerge && filesToMerge.length || 0,
			customKeybindingsCount: keybindingsService.customKeybindingsCount(),
			theme: themeService.getColorTheme().id,
			language,
			pinnedViewlets: paneCompositeService.getPinnedPaneCompositeIds(ViewContainerLocation.Sidebar),
			restoredViewlet: activeViewlet ? activeViewlet.getId() : undefined,
			restoredEditors: editorService.visibleEditors.length,
			startupKind: lifecycleService.startupKind
		});

		// Error Telemetry
		this._register(new ErrorTelemetry(telemetryService));

		//  Files Telemetry
		this._register(textFileService.files.onDidResolve(e => this.onTextFileModelResolved(e)));
		this._register(textFileService.files.onDidSave(e => this.onTextFileModelSaved(e)));

		// Lifecycle
		this._register(lifecycleService.onDidShutdown(() => this.dispose()));

		if (supportsTelemetry(productService, environmentService)) {
			this.handleTelemetryOutputVisibility();
		}
	}

	private onTextFileModelResolved(e: ITextFileResolveEvent): void {
		const settingsType = this.getTypeIfSettings(e.model.resource);
		if (!settingsType) {
			type FileGetClassification = {
				owner: 'isidorn';
				comment: 'Track when a file was read, for example from an editor.';
			} & FileTelemetryDataFragment;

			this.telemetryService.publicLog2<TelemetryData, FileGetClassification>('fileGet', this.getTelemetryData(e.model.resource, e.reason));
		}
	}

	private onTextFileModelSaved(e: ITextFileSaveEvent): void {
		const settingsType = this.getTypeIfSettings(e.model.resource);
		if (!settingsType) {
			type FilePutClassfication = {
				owner: 'isidorn';
				comment: 'Track when a file was written to, for example from an editor.';
			} & FileTelemetryDataFragment;
			this.telemetryService.publicLog2<TelemetryData, FilePutClassfication>('filePUT', this.getTelemetryData(e.model.resource, e.reason));
		}
	}

	private getTypeIfSettings(resource: URI): string {
		if (extname(resource) !== '.json') {
			return '';
		}

		// Check for global settings file
		if (isEqual(resource, this.userDataProfileService.currentProfile.settingsResource)) {
			return 'global-settings';
		}

		// Check for keybindings file
		if (isEqual(resource, this.userDataProfileService.currentProfile.keybindingsResource)) {
			return 'keybindings';
		}

		// Check for snippets
		if (isEqualOrParent(resource, this.userDataProfileService.currentProfile.snippetsHome)) {
			return 'snippets';
		}

		// Check for workspace settings file
		const folders = this.contextService.getWorkspace().folders;
		for (const folder of folders) {
			if (isEqualOrParent(resource, folder.toResource('.vscode'))) {
				const filename = basename(resource);
				if (TelemetryContribution.ALLOWLIST_WORKSPACE_JSON.indexOf(filename) > -1) {
					return `.vscode/${filename}`;
				}
			}
		}

		return '';
	}

	private getTelemetryData(resource: URI, reason?: number): TelemetryData {
		let ext = extname(resource);
		// Remove query parameters from the resource extension
		const queryStringLocation = ext.indexOf('?');
		ext = queryStringLocation !== -1 ? ext.substr(0, queryStringLocation) : ext;
		const fileName = basename(resource);
		const path = resource.scheme === Schemas.file ? resource.fsPath : resource.path;
		const telemetryData = {
			mimeType: new TelemetryTrustedValue(getMimeTypes(resource).join(', ')),
			ext,
			path: hash(path),
			reason,
			allowlistedjson: undefined as string | undefined
		};

		if (ext === '.json' && TelemetryContribution.ALLOWLIST_JSON.indexOf(fileName) > -1) {
			telemetryData['allowlistedjson'] = fileName;
		}

		return telemetryData;
	}

	private async handleTelemetryOutputVisibility(): Promise<void> {
		const that = this;

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.showTelemetry',
					title: localize2('showTelemetry', "Show Telemetry"),
					category: Categories.Developer,
					f1: true
				});
			}
			async run(): Promise<void> {
				for (const logger of that.loggerService.getRegisteredLoggers()) {
					if (logger.group?.id === TelemetryLogGroup.id) {
						that.loggerService.setLogLevel(logger.resource, LogLevel.Trace);
						that.loggerService.setVisibility(logger.resource, true);
					}
				}
				that.outputService.showChannel(TelemetryLogGroup.id);
			}
		}));

		if (![...this.loggerService.getRegisteredLoggers()].find(logger => logger.id === telemetryLogId)) {
			await Event.toPromise(Event.filter(this.loggerService.onDidChangeLoggers, e => [...e.added].some(logger => logger.id === telemetryLogId)));
		}

		let showTelemetry = false;
		for (const logger of this.loggerService.getRegisteredLoggers()) {
			if (logger.id === telemetryLogId) {
				showTelemetry = this.loggerService.getLogLevel() === LogLevel.Trace || !logger.hidden;
				if (showTelemetry) {
					this.loggerService.setVisibility(logger.id, true);
				}
				break;
			}
		}
		if (showTelemetry) {
			const showExtensionTelemetry = (loggers: Iterable<ILoggerResource>) => {
				for (const logger of loggers) {
					if (logger.group?.id === TelemetryLogGroup.id) {
						that.loggerService.setLogLevel(logger.resource, LogLevel.Trace);
						this.loggerService.setVisibility(logger.id, true);
					}
				}
			};
			showExtensionTelemetry(this.loggerService.getRegisteredLoggers());
			this._register(this.loggerService.onDidChangeLoggers(e => showExtensionTelemetry(e.added)));
		}
	}
}

class ConfigurationTelemetryContribution extends Disposable implements IWorkbenchContribution {

	private readonly configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();

		const { user, workspace } = configurationService.keys();
		for (const setting of user) {
			this.reportTelemetry(setting, ConfigurationTarget.USER_LOCAL);
		}
		for (const setting of workspace) {
			this.reportTelemetry(setting, ConfigurationTarget.WORKSPACE);
		}
	}

	/**
	 * Report value of a setting only if it is an enum, boolean, or number or an array of those.
	 */
	private getValueToReport(key: string, target: ConfigurationTarget.USER_LOCAL | ConfigurationTarget.WORKSPACE): string | undefined {
		const inpsectData = this.configurationService.inspect(key);
		const value = target === ConfigurationTarget.USER_LOCAL ? inpsectData.user?.value : inpsectData.workspace?.value;
		if (isNumber(value) || isBoolean(value)) {
			return value.toString();
		}

		const schema = this.configurationRegistry.getConfigurationProperties()[key];
		if (isString(value)) {
			if (schema?.enum?.includes(value)) {
				return value;
			}
			return undefined;
		}
		if (Array.isArray(value)) {
			if (value.every(v => isNumber(v) || isBoolean(v) || (isString(v) && schema?.enum?.includes(v)))) {
				return JSON.stringify(value);
			}
		}
		return undefined;
	}

	private reportTelemetry(key: string, target: ConfigurationTarget.USER_LOCAL | ConfigurationTarget.WORKSPACE): void {
		type UpdatedSettingEvent = {
			settingValue: string | undefined;
			source: string;
		};
		const source = ConfigurationTargetToString(target);

		switch (key) {

			case LayoutSettings.ACTIVITY_BAR_LOCATION:
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'sandy081';
					comment: 'This is used to know where activity bar is shown in the workbench.';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('workbench.activityBar.location', { settingValue: this.getValueToReport(key, target), source });
				return;

			case AutoUpdateConfigurationKey:
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'sandy081';
					comment: 'This is used to know if extensions are getting auto updated or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('extensions.autoUpdate', { settingValue: this.getValueToReport(key, target), source });
				return;

			case 'editor.stickyScroll.enabled':
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'aiday-mar';
					comment: 'This is used to know if editor sticky scroll is enabled or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('editor.stickyScroll.enabled', { settingValue: this.getValueToReport(key, target), source });
				return;

			case 'typescript.experimental.expandableHover':
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'aiday-mar';
					comment: 'This is used to know if the TypeScript expandbale hover is enabled or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('typescript.experimental.expandableHover', { settingValue: this.getValueToReport(key, target), source });
				return;

			case 'window.titleBarStyle':
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'benibenj';
					comment: 'This is used to know if window title bar style is set to custom or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('window.titleBarStyle', { settingValue: this.getValueToReport(key, target), source });
				return;

			case 'workbench.secondarySideBar.defaultVisibility':
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'bpasero';
					comment: 'This is used to know if secondary side bar is visible or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('workbench.secondarySideBar.defaultVisibility', { settingValue: this.getValueToReport(key, target), source });
				return;

			case VerifyExtensionSignatureConfigKey:
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'sandy081';
					comment: 'This is used to know if extensions signature verification is enabled or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('extensions.verifySignature', { settingValue: this.getValueToReport(key, target), source });
				return;

			case 'window.newWindowProfile':
				{
					const valueToReport = this.getValueToReport(key, target);
					const settingValue =
						valueToReport === null ? 'null'
							: valueToReport === this.userDataProfilesService.defaultProfile.name
								? 'default'
								: 'custom';
					this.telemetryService.publicLog2<UpdatedSettingEvent, {
						owner: 'sandy081';
						comment: 'This is used to know the new window profile that is being used';
						settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'if the profile is default or not' };
						source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
					}>('window.newWindowProfile', { settingValue, source });
					return;
				}

			case AutoRestartConfigurationKey:
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'sandy081';
					comment: 'This is used to know if extensions are getting auto restarted or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('extensions.autoRestart', { settingValue: this.getValueToReport(key, target), source });
				return;
			case TerminalContribSettingId.OutputLocation:
				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'meganrogge';
					comment: 'This is used to know the output location for chat terminals';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('terminal.integrated.chatAgentTools.outputLocation', { settingValue: this.getValueToReport(key, target), source });
				return;
			case TerminalContribSettingId.SuggestEnabled:

				this.telemetryService.publicLog2<UpdatedSettingEvent, {
					owner: 'meganrogge';
					comment: 'This is used to know if terminal suggestions are enabled or not';
					settingValue: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'value of the setting' };
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source of the setting' };
				}>('terminal.integrated.suggest.enabled', { settingValue: this.getValueToReport(key, target), source });
				return;
		}
	}

}

const workbenchContributionRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchContributionRegistry.registerWorkbenchContribution(TelemetryContribution, LifecyclePhase.Restored);
workbenchContributionRegistry.registerWorkbenchContribution(ConfigurationTelemetryContribution, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/terminal.all.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/terminal.all.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Primary workbench contribution
import './browser/terminal.contribution.js';

// Misc extensions to the workbench contribution
import './common/environmentVariable.contribution.js';
import './common/terminalExtensionPoints.contribution.js';
import './browser/terminalView.js';

// Terminal contributions - Standalone extensions to the terminal, these cannot be imported from the
// primary workbench contribution)
import '../terminalContrib/accessibility/browser/terminal.accessibility.contribution.js';
import '../terminalContrib/autoReplies/browser/terminal.autoReplies.contribution.js';
import '../terminalContrib/chatAgentTools/browser/terminal.chatAgentTools.contribution.js';
import '../terminalContrib/developer/browser/terminal.developer.contribution.js';
import '../terminalContrib/environmentChanges/browser/terminal.environmentChanges.contribution.js';
import '../terminalContrib/find/browser/terminal.find.contribution.js';
import '../terminalContrib/chat/browser/terminal.chat.contribution.js';
import '../terminalContrib/commandGuide/browser/terminal.commandGuide.contribution.js';
import '../terminalContrib/history/browser/terminal.history.contribution.js';
import '../terminalContrib/links/browser/terminal.links.contribution.js';
import '../terminalContrib/zoom/browser/terminal.zoom.contribution.js';
import '../terminalContrib/stickyScroll/browser/terminal.stickyScroll.contribution.js';
import '../terminalContrib/quickAccess/browser/terminal.quickAccess.contribution.js';
import '../terminalContrib/quickFix/browser/terminal.quickFix.contribution.js';
import '../terminalContrib/typeAhead/browser/terminal.typeAhead.contribution.js';
import '../terminalContrib/sendSequence/browser/terminal.sendSequence.contribution.js';
import '../terminalContrib/sendSignal/browser/terminal.sendSignal.contribution.js';
import '../terminalContrib/suggest/browser/terminal.suggest.contribution.js';
import '../terminalContrib/chat/browser/terminal.initialHint.contribution.js';
import '../terminalContrib/wslRecommendation/browser/terminal.wslRecommendation.contribution.js';
import '../terminalContrib/voice/browser/terminal.voice.contribution.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/terminalContribExports.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/terminalContribExports.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IConfigurationNode } from '../../../platform/configuration/common/configurationRegistry.js';
import { TerminalAccessibilityCommandId, defaultTerminalAccessibilityCommandsToSkipShell } from '../terminalContrib/accessibility/common/terminal.accessibility.js';
import { terminalAccessibilityConfiguration } from '../terminalContrib/accessibility/common/terminalAccessibilityConfiguration.js';
import { terminalAutoRepliesConfiguration } from '../terminalContrib/autoReplies/common/terminalAutoRepliesConfiguration.js';
import { TerminalChatCommandId, TerminalChatContextKeyStrings } from '../terminalContrib/chat/browser/terminalChat.js';
import { terminalInitialHintConfiguration } from '../terminalContrib/chat/common/terminalInitialHintConfiguration.js';
import { terminalChatAgentToolsConfiguration, TerminalChatAgentToolsSettingId } from '../terminalContrib/chatAgentTools/common/terminalChatAgentToolsConfiguration.js';
import { terminalCommandGuideConfiguration } from '../terminalContrib/commandGuide/common/terminalCommandGuideConfiguration.js';
import { TerminalDeveloperCommandId } from '../terminalContrib/developer/common/terminal.developer.js';
import { defaultTerminalFindCommandToSkipShell } from '../terminalContrib/find/common/terminal.find.js';
import { defaultTerminalHistoryCommandsToSkipShell, terminalHistoryConfiguration } from '../terminalContrib/history/common/terminal.history.js';
import { TerminalStickyScrollSettingId, terminalStickyScrollConfiguration } from '../terminalContrib/stickyScroll/common/terminalStickyScrollConfiguration.js';
import { defaultTerminalSuggestCommandsToSkipShell } from '../terminalContrib/suggest/common/terminal.suggest.js';
import { TerminalSuggestSettingId, terminalSuggestConfiguration } from '../terminalContrib/suggest/common/terminalSuggestConfiguration.js';
import { terminalTypeAheadConfiguration } from '../terminalContrib/typeAhead/common/terminalTypeAheadConfiguration.js';
import { terminalZoomConfiguration } from '../terminalContrib/zoom/common/terminal.zoom.js';

// HACK: Export some commands from `terminalContrib/` that are depended upon elsewhere. These are
// soft layer breakers between `terminal/` and `terminalContrib/` but there are difficulties in
// removing the dependency. These are explicitly defined here to avoid an eslint line override.
export const enum TerminalContribCommandId {
	A11yFocusAccessibleBuffer = TerminalAccessibilityCommandId.FocusAccessibleBuffer,
	DeveloperRestartPtyHost = TerminalDeveloperCommandId.RestartPtyHost,
	OpenTerminalSettingsLink = TerminalChatCommandId.OpenTerminalSettingsLink,
	DisableSessionAutoApproval = TerminalChatCommandId.DisableSessionAutoApproval,
	FocusMostRecentChatTerminalOutput = TerminalChatCommandId.FocusMostRecentChatTerminalOutput,
	FocusMostRecentChatTerminal = TerminalChatCommandId.FocusMostRecentChatTerminal,
	ToggleChatTerminalOutput = TerminalChatCommandId.ToggleChatTerminalOutput,
	FocusChatInstanceAction = TerminalChatCommandId.FocusChatInstanceAction,
}

// HACK: Export some settings from `terminalContrib/` that are depended upon elsewhere. These are
// soft layer breakers between `terminal/` and `terminalContrib/` but there are difficulties in
// removing the dependency. These are explicitly defined here to avoid an eslint line override.
export const enum TerminalContribSettingId {
	StickyScrollEnabled = TerminalStickyScrollSettingId.Enabled,
	SuggestEnabled = TerminalSuggestSettingId.Enabled,
	AutoApprove = TerminalChatAgentToolsSettingId.AutoApprove,
	EnableAutoApprove = TerminalChatAgentToolsSettingId.EnableAutoApprove,
	ShellIntegrationTimeout = TerminalChatAgentToolsSettingId.ShellIntegrationTimeout,
	OutputLocation = TerminalChatAgentToolsSettingId.OutputLocation
}

// HACK: Export some context key strings from `terminalContrib/` that are depended upon elsewhere.
// These are soft layer breakers between `terminal/` and `terminalContrib/` but there are
// difficulties in removing the dependency. These are explicitly defined here to avoid an eslint
// line override.
export const enum TerminalContribContextKeyStrings {
	ChatHasTerminals = TerminalChatContextKeyStrings.ChatHasTerminals,
	ChatHasHiddenTerminals = TerminalChatContextKeyStrings.ChatHasHiddenTerminals,
}

// Export configuration schemes from terminalContrib - this is an exception to the eslint rule since
// they need to be declared at part of the rest of the terminal configuration
export const terminalContribConfiguration: IConfigurationNode['properties'] = {
	...terminalAccessibilityConfiguration,
	...terminalAutoRepliesConfiguration,
	...terminalChatAgentToolsConfiguration,
	...terminalInitialHintConfiguration,
	...terminalCommandGuideConfiguration,
	...terminalHistoryConfiguration,
	...terminalStickyScrollConfiguration,
	...terminalSuggestConfiguration,
	...terminalTypeAheadConfiguration,
	...terminalZoomConfiguration,
};

// Export commands to skip shell from terminalContrib - this is an exception to the eslint rule
// since they need to be included in the terminal module
export const defaultTerminalContribCommandsToSkipShell = [
	...defaultTerminalAccessibilityCommandsToSkipShell,
	...defaultTerminalFindCommandToSkipShell,
	...defaultTerminalHistoryCommandsToSkipShell,
	...defaultTerminalSuggestCommandsToSkipShell,
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/browser/baseTerminalBackend.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/baseTerminalBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isNumber, isObject } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { ICrossVersionSerializedTerminalState, IPtyHostController, ISerializedTerminalState, ITerminalLogService } from '../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { TerminalContribCommandId } from '../terminalContribExports.js';

export abstract class BaseTerminalBackend extends Disposable {
	private _isPtyHostUnresponsive: boolean = false;

	get isResponsive(): boolean { return !this._isPtyHostUnresponsive; }

	protected readonly _onPtyHostConnected = this._register(new Emitter<void>());
	readonly onPtyHostConnected = this._onPtyHostConnected.event;
	protected readonly _onPtyHostRestart = this._register(new Emitter<void>());
	readonly onPtyHostRestart = this._onPtyHostRestart.event;
	protected readonly _onPtyHostUnresponsive = this._register(new Emitter<void>());
	readonly onPtyHostUnresponsive = this._onPtyHostUnresponsive.event;
	protected readonly _onPtyHostResponsive = this._register(new Emitter<void>());
	readonly onPtyHostResponsive = this._onPtyHostResponsive.event;

	constructor(
		private readonly _ptyHostController: IPtyHostController,
		protected readonly _logService: ITerminalLogService,
		historyService: IHistoryService,
		configurationResolverService: IConfigurationResolverService,
		statusBarService: IStatusbarService,
		protected readonly _workspaceContextService: IWorkspaceContextService
	) {
		super();

		let unresponsiveStatusBarEntry: IStatusbarEntry;
		let statusBarAccessor: IStatusbarEntryAccessor;
		let hasStarted = false;

		// Attach pty host listeners
		this._register(this._ptyHostController.onPtyHostExit(() => {
			this._logService.error(`The terminal's pty host process exited, the connection to all terminal processes was lost`);
		}));
		this._register(this.onPtyHostConnected(() => hasStarted = true));
		this._register(this._ptyHostController.onPtyHostStart(() => {
			this._logService.debug(`The terminal's pty host process is starting`);
			// Only fire the _restart_ event after it has started
			if (hasStarted) {
				this._logService.trace('IPtyHostController#onPtyHostRestart');
				this._onPtyHostRestart.fire();
			}
			statusBarAccessor?.dispose();
			this._isPtyHostUnresponsive = false;
		}));
		this._register(this._ptyHostController.onPtyHostUnresponsive(() => {
			statusBarAccessor?.dispose();
			if (!unresponsiveStatusBarEntry) {
				unresponsiveStatusBarEntry = {
					name: localize('ptyHostStatus', 'Pty Host Status'),
					text: `$(debug-disconnect) ${localize('ptyHostStatus.short', 'Pty Host')}`,
					tooltip: localize('nonResponsivePtyHost', "The connection to the terminal's pty host process is unresponsive, terminals may stop working. Click to manually restart the pty host."),
					ariaLabel: localize('ptyHostStatus.ariaLabel', 'Pty Host is unresponsive'),
					command: TerminalContribCommandId.DeveloperRestartPtyHost,
					kind: 'warning'
				};
			}
			statusBarAccessor = statusBarService.addEntry(unresponsiveStatusBarEntry, 'ptyHostStatus', StatusbarAlignment.LEFT);
			this._isPtyHostUnresponsive = true;
			this._onPtyHostUnresponsive.fire();
		}));
		this._register(this._ptyHostController.onPtyHostResponsive(() => {
			if (!this._isPtyHostUnresponsive) {
				return;
			}
			this._logService.info('The pty host became responsive again');
			statusBarAccessor?.dispose();
			this._isPtyHostUnresponsive = false;
			this._onPtyHostResponsive.fire();
		}));
		this._register(this._ptyHostController.onPtyHostRequestResolveVariables(async e => {
			// Only answer requests for this workspace
			if (e.workspaceId !== this._workspaceContextService.getWorkspace().id) {
				return;
			}
			const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot(Schemas.file);
			const lastActiveWorkspaceRoot = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
			const resolveCalls: Promise<string>[] = e.originalText.map(t => {
				return configurationResolverService.resolveAsync(lastActiveWorkspaceRoot, t);
			});
			const result = await Promise.all(resolveCalls);
			this._ptyHostController.acceptPtyHostResolvedVariables(e.requestId, result);
		}));
	}

	restartPtyHost(): void {
		this._ptyHostController.restartPtyHost();
	}

	protected _deserializeTerminalState(serializedState: string | undefined): ISerializedTerminalState[] | undefined {
		if (serializedState === undefined) {
			return undefined;
		}
		const crossVersionState = JSON.parse(serializedState) as unknown;
		if (!isCrossVersionSerializedTerminalState(crossVersionState)) {
			this._logService.warn('Could not revive serialized processes, wrong format', crossVersionState);
			return undefined;
		}
		if (crossVersionState.version !== 1) {
			this._logService.warn(`Could not revive serialized processes, wrong version "${crossVersionState.version}"`, crossVersionState);
			return undefined;
		}
		return crossVersionState.state as ISerializedTerminalState[];
	}

	protected _getWorkspaceId(): string {
		return this._workspaceContextService.getWorkspace().id;
	}
}

function isCrossVersionSerializedTerminalState(obj: unknown): obj is ICrossVersionSerializedTerminalState {
	return (
		isObject(obj) &&
		'version' in obj && isNumber(obj.version) &&
		'state' in obj && Array.isArray(obj.state)
	);
}
```

--------------------------------------------------------------------------------

````

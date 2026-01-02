---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 454
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 454 of 552)

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

---[FILE: src/vs/workbench/contrib/tasks/browser/task.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/task.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { MenuRegistry, MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';

import { ProblemMatcherRegistry } from '../common/problemMatcher.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';

import * as jsonContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

import { StatusbarAlignment, IStatusbarService, IStatusbarEntryAccessor, IStatusbarEntry } from '../../../services/statusbar/browser/statusbar.js';

import { IOutputChannelRegistry, Extensions as OutputExt } from '../../../services/output/common/output.js';

import { ITaskEvent, TaskGroup, TaskSettingId, TASKS_CATEGORY, TASK_RUNNING_STATE, TASK_TERMINAL_ACTIVE, TaskEventKind, rerunTaskIcon, RerunForActiveTerminalCommandId, RerunAllRunningTasksCommandId } from '../common/tasks.js';
import { ITaskService, TaskCommandsRegistered, TaskExecutionSupportedContext } from '../common/taskService.js';

import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { RunAutomaticTasks, ManageAutomaticTaskRunning } from './runAutomaticTasks.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import schemaVersion1 from '../common/jsonSchema_v1.js';
import schemaVersion2, { updateProblemMatchers, updateTaskDefinitions } from '../common/jsonSchema_v2.js';
import { AbstractTaskService, ConfigureTaskAction } from './abstractTaskService.js';
import { tasksSchemaId } from '../../../services/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { WorkbenchStateContext } from '../../../common/contextkeys.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { TasksQuickAccessProvider } from './tasksQuickAccess.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { TaskDefinitionRegistry } from '../common/taskDefinitionRegistry.js';
import { TerminalMenuBarGroup } from '../../terminal/browser/terminalMenus.js';
import { isString } from '../../../../base/common/types.js';
import { promiseWithResolvers } from '../../../../base/common/async.js';

import { TerminalContextKeys } from '../../terminal/common/terminalContextKey.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ITerminalInstance, ITerminalService } from '../../terminal/browser/terminal.js';

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(RunAutomaticTasks, LifecyclePhase.Eventually);

registerAction2(ManageAutomaticTaskRunning);
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: ManageAutomaticTaskRunning.ID,
		title: ManageAutomaticTaskRunning.LABEL,
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});

export class TaskStatusBarContributions extends Disposable implements IWorkbenchContribution {
	private _runningTasksStatusItem: IStatusbarEntryAccessor | undefined;
	private _activeTasksCount: number = 0;

	constructor(
		@ITaskService private readonly _taskService: ITaskService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@IProgressService private readonly _progressService: IProgressService
	) {
		super();
		this._registerListeners();
	}

	private _registerListeners(): void {
		let promise: Promise<void> | undefined = undefined;
		let resolve: (value?: void | Thenable<void>) => void;
		this._register(this._taskService.onDidStateChange(event => {
			if (event.kind === TaskEventKind.Changed) {
				this._updateRunningTasksStatus();
			}

			if (!this._ignoreEventForUpdateRunningTasksCount(event)) {
				switch (event.kind) {
					case TaskEventKind.Active:
						this._activeTasksCount++;
						if (this._activeTasksCount === 1) {
							if (!promise) {
								({ promise, resolve } = promiseWithResolvers<void>());
							}
						}
						break;
					case TaskEventKind.Inactive:
						// Since the exiting of the sub process is communicated async we can't order inactive and terminate events.
						// So try to treat them accordingly.
						if (this._activeTasksCount > 0) {
							this._activeTasksCount--;
							if (this._activeTasksCount === 0) {
								if (promise && resolve) {
									resolve!();
								}
							}
						}
						break;
					case TaskEventKind.Terminated:
						if (this._activeTasksCount !== 0) {
							this._activeTasksCount = 0;
							if (promise && resolve) {
								resolve!();
							}
						}
						break;
				}
			}

			if (promise && (event.kind === TaskEventKind.Active) && (this._activeTasksCount === 1)) {
				this._progressService.withProgress({ location: ProgressLocation.Window, command: 'workbench.action.tasks.showTasks' }, progress => {
					progress.report({ message: nls.localize('building', 'Building...') });
					return promise!;
				}).then(() => {
					promise = undefined;
				});
			}
		}));
	}

	private async _updateRunningTasksStatus(): Promise<void> {
		const tasks = await this._taskService.getActiveTasks();
		if (tasks.length === 0) {
			if (this._runningTasksStatusItem) {
				this._runningTasksStatusItem.dispose();
				this._runningTasksStatusItem = undefined;
			}
		} else {
			const itemProps: IStatusbarEntry = {
				name: nls.localize('status.runningTasks', "Running Tasks"),
				text: `$(tools) ${tasks.length}`,
				ariaLabel: nls.localize('numberOfRunningTasks', "{0} running tasks", tasks.length),
				tooltip: nls.localize('runningTasks', "Show Running Tasks"),
				command: 'workbench.action.tasks.showTasks',
			};

			if (!this._runningTasksStatusItem) {
				this._runningTasksStatusItem = this._statusbarService.addEntry(itemProps, 'status.runningTasks', StatusbarAlignment.LEFT, { location: { id: 'status.problems', priority: 50 }, alignment: StatusbarAlignment.RIGHT });
			} else {
				this._runningTasksStatusItem.update(itemProps);
			}
		}
	}

	private _ignoreEventForUpdateRunningTasksCount(event: ITaskEvent): boolean {
		if (!this._taskService.inTerminal() || event.kind === TaskEventKind.Changed) {
			return false;
		}

		if ((isString(event.group) ? event.group : event.group?._id) !== TaskGroup.Build._id) {
			return true;
		}

		return event.__task.configurationProperties.problemMatchers === undefined || event.__task.configurationProperties.problemMatchers.length === 0;
	}
}

workbenchRegistry.registerWorkbenchContribution(TaskStatusBarContributions, LifecyclePhase.Restored);

MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Run,
	command: {
		id: 'workbench.action.tasks.runTask',
		title: nls.localize({ key: 'miRunTask', comment: ['&& denotes a mnemonic'] }, "&&Run Task...")
	},
	order: 1,
	when: TaskExecutionSupportedContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Run,
	command: {
		id: 'workbench.action.tasks.build',
		title: nls.localize({ key: 'miBuildTask', comment: ['&& denotes a mnemonic'] }, "Run &&Build Task...")
	},
	order: 2,
	when: TaskExecutionSupportedContext
});

// Manage Tasks
MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Manage,
	command: {
		precondition: TASK_RUNNING_STATE,
		id: 'workbench.action.tasks.showTasks',
		title: nls.localize({ key: 'miRunningTask', comment: ['&& denotes a mnemonic'] }, "Show Runnin&&g Tasks...")
	},
	order: 1,
	when: TaskExecutionSupportedContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Manage,
	command: {
		precondition: TASK_RUNNING_STATE,
		id: 'workbench.action.tasks.restartTask',
		title: nls.localize({ key: 'miRestartTask', comment: ['&& denotes a mnemonic'] }, "R&&estart Running Task...")
	},
	order: 2,
	when: TaskExecutionSupportedContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Manage,
	command: {
		precondition: TASK_RUNNING_STATE,
		id: 'workbench.action.tasks.terminate',
		title: nls.localize({ key: 'miTerminateTask', comment: ['&& denotes a mnemonic'] }, "&&Terminate Task...")
	},
	order: 3,
	when: TaskExecutionSupportedContext
});

// Configure Tasks
MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Configure,
	command: {
		id: 'workbench.action.tasks.configureTaskRunner',
		title: nls.localize({ key: 'miConfigureTask', comment: ['&& denotes a mnemonic'] }, "&&Configure Tasks...")
	},
	order: 1,
	when: TaskExecutionSupportedContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarTerminalMenu, {
	group: TerminalMenuBarGroup.Configure,
	command: {
		id: 'workbench.action.tasks.configureDefaultBuildTask',
		title: nls.localize({ key: 'miConfigureBuildTask', comment: ['&& denotes a mnemonic'] }, "Configure De&&fault Build Task...")
	},
	order: 2,
	when: TaskExecutionSupportedContext
});


MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.openWorkspaceFileTasks',
		title: nls.localize2('workbench.action.tasks.openWorkspaceFileTasks', "Open Workspace Tasks"),
		category: TASKS_CATEGORY
	},
	when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('workspace'), TaskExecutionSupportedContext)
});

MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: ConfigureTaskAction.ID,
		title: ConfigureTaskAction.TEXT,
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.showLog',
		title: nls.localize2('ShowLogAction.label', "Show Task Log"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.runTask',
		title: nls.localize2('RunTaskAction.label', "Run Task"),
		category: TASKS_CATEGORY
	}
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.reRunTask',
		title: nls.localize2('ReRunTaskAction.label', "Rerun Last Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.restartTask',
		title: nls.localize2('RestartTaskAction.label', "Restart Running Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: RerunAllRunningTasksCommandId,
		title: nls.localize2('RerunAllRunningTasksAction.label', "Rerun All Running Tasks"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.showTasks',
		title: nls.localize2('ShowTasksAction.label', "Show Running Tasks"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.terminate',
		title: nls.localize2('TerminateAction.label', "Terminate Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.build',
		title: nls.localize2('BuildAction.label', "Run Build Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.test',
		title: nls.localize2('TestAction.label', "Run Test Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.configureDefaultBuildTask',
		title: nls.localize2('ConfigureDefaultBuildTask.label', "Configure Default Build Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.configureDefaultTestTask',
		title: nls.localize2('ConfigureDefaultTestTask.label', "Configure Default Test Task"),
		category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: 'workbench.action.tasks.openUserTasks',
		title: nls.localize2('workbench.action.tasks.openUserTasks', "Open User Tasks"), category: TASKS_CATEGORY
	},
	when: TaskExecutionSupportedContext
});

class UserTasksGlobalActionContribution extends Disposable implements IWorkbenchContribution {

	constructor() {
		super();
		this.registerActions();
	}

	private registerActions() {
		const id = 'workbench.action.tasks.openUserTasks';
		const title = nls.localize('tasks', "Tasks");
		this._register(MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			command: {
				id,
				title
			},
			when: TaskExecutionSupportedContext,
			group: '2_configuration',
			order: 6
		}));
		this._register(MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
			command: {
				id,
				title
			},
			when: TaskExecutionSupportedContext,
			group: '2_configuration',
			order: 6
		}));
	}
}
workbenchRegistry.registerWorkbenchContribution(UserTasksGlobalActionContribution, LifecyclePhase.Restored);

// MenuRegistry.addCommand( { id: 'workbench.action.tasks.rebuild', title: nls.localize('RebuildAction.label', 'Run Rebuild Task'), category: tasksCategory });
// MenuRegistry.addCommand( { id: 'workbench.action.tasks.clean', title: nls.localize('CleanAction.label', 'Run Clean Task'), category: tasksCategory });

KeybindingsRegistry.registerKeybindingRule({
	id: 'workbench.action.tasks.build',
	weight: KeybindingWeight.WorkbenchContrib,
	when: TaskCommandsRegistered,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyB
});

// Tasks Output channel. Register it before using it in Task Service.
const outputChannelRegistry = Registry.as<IOutputChannelRegistry>(OutputExt.OutputChannels);
outputChannelRegistry.registerChannel({ id: AbstractTaskService.OutputChannelId, label: AbstractTaskService.OutputChannelLabel, log: false });


// Register Quick Access
const quickAccessRegistry = (Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess));
const tasksPickerContextKey = 'inTasksPicker';

quickAccessRegistry.registerQuickAccessProvider({
	ctor: TasksQuickAccessProvider,
	prefix: TasksQuickAccessProvider.PREFIX,
	contextKey: tasksPickerContextKey,
	placeholder: nls.localize('tasksQuickAccessPlaceholder', "Type the name of a task to run."),
	helpEntries: [{ description: nls.localize('tasksQuickAccessHelp', "Run Task"), commandCenterOrder: 60 }]
});

// tasks.json validation
const schema: IJSONSchema = {
	id: tasksSchemaId,
	description: 'Task definition file',
	type: 'object',
	allowTrailingCommas: true,
	allowComments: true,
	default: {
		version: '2.0.0',
		tasks: [
			{
				label: 'My Task',
				command: 'echo hello',
				type: 'shell',
				args: [],
				problemMatcher: ['$tsc'],
				presentation: {
					reveal: 'always'
				},
				group: 'build'
			}
		]
	}
};

schema.definitions = {
	...schemaVersion1.definitions,
	...schemaVersion2.definitions,
};
schema.oneOf = [...(schemaVersion2.oneOf || []), ...(schemaVersion1.oneOf || [])];

const jsonRegistry = <jsonContributionRegistry.IJSONContributionRegistry>Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
jsonRegistry.registerSchema(tasksSchemaId, schema);

export class TaskRegistryContribution extends Disposable implements IWorkbenchContribution {
	static ID = 'taskRegistryContribution';
	constructor() {
		super();

		this._register(ProblemMatcherRegistry.onMatcherChanged(() => {
			updateProblemMatchers();
			jsonRegistry.notifySchemaChanged(tasksSchemaId);
		}));

		this._register(TaskDefinitionRegistry.onDefinitionsChanged(() => {
			updateTaskDefinitions();
			jsonRegistry.notifySchemaChanged(tasksSchemaId);
		}));
	}
}
registerWorkbenchContribution2(TaskRegistryContribution.ID, TaskRegistryContribution, WorkbenchPhase.AfterRestored);


const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'task',
	order: 100,
	title: nls.localize('tasksConfigurationTitle', "Tasks"),
	type: 'object',
	properties: {
		[TaskSettingId.ProblemMatchersNeverPrompt]: {
			markdownDescription: nls.localize('task.problemMatchers.neverPrompt', "Configures whether to show the problem matcher prompt when running a task. Set to `true` to never prompt, or use a dictionary of task types to turn off prompting only for specific task types."),
			'oneOf': [
				{
					type: 'boolean',
					markdownDescription: nls.localize('task.problemMatchers.neverPrompt.boolean', 'Sets problem matcher prompting behavior for all tasks.')
				},
				{
					type: 'object',
					patternProperties: {
						'.*': {
							type: 'boolean'
						}
					},
					markdownDescription: nls.localize('task.problemMatchers.neverPrompt.array', 'An object containing task type-boolean pairs to never prompt for problem matchers on.'),
					default: {
						'shell': true
					}
				}
			],
			default: false
		},
		[TaskSettingId.AutoDetect]: {
			markdownDescription: nls.localize('task.autoDetect', "Controls enablement of `provideTasks` for all task provider extension. If the Tasks: Run Task command is slow, disabling auto detect for task providers may help. Individual extensions may also provide settings that disable auto detection."),
			type: 'string',
			enum: ['on', 'off'],
			default: 'on'
		},
		[TaskSettingId.SlowProviderWarning]: {
			markdownDescription: nls.localize('task.slowProviderWarning', "Configures whether a warning is shown when a provider is slow"),
			'oneOf': [
				{
					type: 'boolean',
					markdownDescription: nls.localize('task.slowProviderWarning.boolean', 'Sets the slow provider warning for all tasks.')
				},
				{
					type: 'array',
					items: {
						type: 'string',
						markdownDescription: nls.localize('task.slowProviderWarning.array', 'An array of task types to never show the slow provider warning.')
					}
				}
			],
			default: true
		},
		[TaskSettingId.QuickOpenHistory]: {
			markdownDescription: nls.localize('task.quickOpen.history', "Controls the number of recent items tracked in task quick open dialog."),
			type: 'number',
			default: 30, minimum: 0, maximum: 30
		},
		[TaskSettingId.QuickOpenDetail]: {
			markdownDescription: nls.localize('task.quickOpen.detail', "Controls whether to show the task detail for tasks that have a detail in task quick picks, such as Run Task."),
			type: 'boolean',
			default: true
		},
		[TaskSettingId.QuickOpenSkip]: {
			type: 'boolean',
			description: nls.localize('task.quickOpen.skip', "Controls whether the task quick pick is skipped when there is only one task to pick from."),
			default: false
		},
		[TaskSettingId.QuickOpenShowAll]: {
			type: 'boolean',
			description: nls.localize('task.quickOpen.showAll', "Causes the Tasks: Run Task command to use the slower \"show all\" behavior instead of the faster two level picker where tasks are grouped by provider."),
			default: false
		},
		[TaskSettingId.AllowAutomaticTasks]: {
			type: 'string',
			enum: ['on', 'off'],
			enumDescriptions: [
				nls.localize('task.allowAutomaticTasks.on', "Always"),
				nls.localize('task.allowAutomaticTasks.off', "Never"),
			],
			description: nls.localize('task.allowAutomaticTasks', "Enable automatic tasks - note that tasks won't run in an untrusted workspace."),
			default: 'on',
			restricted: true
		},
		[TaskSettingId.Reconnection]: {
			type: 'boolean',
			description: nls.localize('task.reconnection', "On window reload, reconnect to tasks that have problem matchers."),
			default: true
		},
		[TaskSettingId.SaveBeforeRun]: {
			markdownDescription: nls.localize(
				'task.saveBeforeRun',
				'Save all dirty editors before running a task.'
			),
			type: 'string',
			enum: ['always', 'never', 'prompt'],
			enumDescriptions: [
				nls.localize('task.saveBeforeRun.always', 'Always saves all editors before running.'),
				nls.localize('task.saveBeforeRun.never', 'Never saves editors before running.'),
				nls.localize('task.SaveBeforeRun.prompt', 'Prompts whether to save editors before running.'),
			],
			default: 'always',
		},
		[TaskSettingId.NotifyWindowOnTaskCompletion]: {
			type: 'integer',
			markdownDescription: nls.localize('task.NotifyWindowOnTaskCompletion', 'Controls the minimum task runtime in milliseconds before showing an OS notification when the task finishes while the window is not in focus. Set to -1 to disable notifications. Set to 0 to always show notifications. This includes a window badge as well as notification toast.'),
			default: 60000,
			minimum: -1
		},
		[TaskSettingId.VerboseLogging]: {
			type: 'boolean',
			description: nls.localize('task.verboseLogging', "Enable verbose logging for tasks."),
			default: false
		},
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: RerunForActiveTerminalCommandId,
			icon: rerunTaskIcon,
			title: nls.localize2('workbench.action.tasks.rerunForActiveTerminal', 'Rerun Task'),
			precondition: TASK_TERMINAL_ACTIVE,
			menu: [{ id: MenuId.TerminalInstanceContext, when: TASK_TERMINAL_ACTIVE }],
			keybinding: {
				when: TerminalContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyR,
				mac: {
					primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyR
				},
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}
	async run(accessor: ServicesAccessor, args: any): Promise<void> {
		const terminalService = accessor.get(ITerminalService);
		const taskSystem = accessor.get(ITaskService);
		const instance = args as ITerminalInstance ?? terminalService.activeInstance;
		if (instance) {
			await taskSystem.rerun(instance.instanceId);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/taskProblemMonitor.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/taskProblemMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap, DisposableStore } from '../../../../base/common/lifecycle.js';
import { AbstractProblemCollector } from '../common/problemCollectors.js';
import { ITerminalInstance } from '../../terminal/browser/terminal.js';
import { URI } from '../../../../base/common/uri.js';
import { IMarkerData, MarkerSeverity, IMarker as ITaskMarker } from '../../../../platform/markers/common/markers.js';

interface ITerminalMarkerData {
	readonly resources: Map<string, URI>;
	readonly markers: Map<string, Map<string, IMarkerData>>;
}

export class TaskProblemMonitor extends Disposable {

	private readonly terminalMarkerMap: Map<number, ITerminalMarkerData> = new Map();
	private readonly terminalDisposables = new DisposableMap<number>();

	constructor() {
		super();
	}

	addTerminal(terminal: ITerminalInstance, problemMatcher: AbstractProblemCollector) {
		this.terminalMarkerMap.set(terminal.instanceId, {
			resources: new Map<string, URI>(),
			markers: new Map<string, Map<string, IMarkerData>>()
		});

		const store = new DisposableStore();
		this.terminalDisposables.set(terminal.instanceId, store);

		store.add(terminal.onDisposed(() => {
			this.terminalMarkerMap.delete(terminal.instanceId);
			this.terminalDisposables.deleteAndDispose(terminal.instanceId);
		}));

		store.add(problemMatcher.onDidFindErrors((markers: ITaskMarker[]) => {
			const markerData = this.terminalMarkerMap.get(terminal.instanceId);
			if (markerData) {
				// Clear existing markers for a new set, otherwise older compilation
				// issues will be included
				markerData.markers.clear();
				markerData.resources.clear();

				for (const marker of markers) {
					if (marker.severity === MarkerSeverity.Error) {
						markerData.resources.set(marker.resource.toString(), marker.resource);
						const markersForOwner = markerData.markers.get(marker.owner);
						let markerMap = markersForOwner;
						if (!markerMap) {
							markerMap = new Map();
							markerData.markers.set(marker.owner, markerMap);
						}
						markerMap.set(marker.resource.toString(), marker);
						this.terminalMarkerMap.set(terminal.instanceId, markerData);
					}
				}
			}
		}));
		store.add(problemMatcher.onDidRequestInvalidateLastMarker(() => {
			const markerData = this.terminalMarkerMap.get(terminal.instanceId);
			markerData?.markers.clear();
			markerData?.resources.clear();
			this.terminalMarkerMap.set(terminal.instanceId, {
				resources: new Map<string, URI>(),
				markers: new Map<string, Map<string, IMarkerData>>()
			});
		}));
	}

	/**
	 * Gets the task problems for a specific terminal instance
	 * @param instanceId The terminal instance ID
	 * @returns Map of problem matchers to their resources and marker data, or undefined if no problems found
	 */
	public getTaskProblems(instanceId: number): Map<string, { resources: URI[]; markers: IMarkerData[] }> | undefined {
		const markerData = this.terminalMarkerMap.get(instanceId);
		if (!markerData) {
			return undefined;
		} else if (markerData.markers.size === 0) {
			return new Map();
		}

		const result = new Map<string, { resources: URI[]; markers: IMarkerData[] }>();
		for (const [owner, markersMap] of markerData.markers) {
			const resources: URI[] = [];
			const markers: IMarkerData[] = [];
			for (const [resource, marker] of markersMap) {
				resources.push(markerData.resources.get(resource)!);
				markers.push(marker);
			}
			result.set(owner, { resources, markers });
		}
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/taskQuickPick.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/taskQuickPick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as Objects from '../../../../base/common/objects.js';
import { Task, ContributedTask, CustomTask, ConfiguringTask, TaskSorter, KeyedTaskIdentifier } from '../common/tasks.js';
import { IWorkspace, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import * as Types from '../../../../base/common/types.js';
import { ITaskService, IWorkspaceFolderTaskResult } from '../common/taskService.js';
import { IQuickPickItem, QuickPickInput, IQuickPick, IQuickInputButton, IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { getColorClass, createColorStyleElement } from '../../terminal/browser/terminalIcon.js';
import { TaskQuickPickEntryType } from './abstractTaskService.js';
import { showWithPinnedItems } from '../../../../platform/quickinput/browser/quickPickPin.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export const QUICKOPEN_DETAIL_CONFIG = 'task.quickOpen.detail';
export const QUICKOPEN_SKIP_CONFIG = 'task.quickOpen.skip';
export function isWorkspaceFolder(folder: IWorkspace | IWorkspaceFolder): folder is IWorkspaceFolder {
	return 'uri' in folder;
}

export interface ITaskQuickPickEntry extends IQuickPickItem {
	task: Task | undefined | null;
}

export interface ITaskTwoLevelQuickPickEntry extends IQuickPickItem {
	task: Task | ConfiguringTask | string | undefined | null;
	settingType?: string;
}

const SHOW_ALL: string = nls.localize('taskQuickPick.showAll', "Show All Tasks...");

export const configureTaskIcon = registerIcon('tasks-list-configure', Codicon.gear, nls.localize('configureTaskIcon', 'Configuration icon in the tasks selection list.'));
const removeTaskIcon = registerIcon('tasks-remove', Codicon.close, nls.localize('removeTaskIcon', 'Icon for remove in the tasks selection list.'));

const runTaskStorageKey = 'runTaskStorageKey';

export class TaskQuickPick extends Disposable {
	private _sorter: TaskSorter;
	private _topLevelEntries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[] | undefined;
	constructor(
		@ITaskService private _taskService: ITaskService,
		@IConfigurationService private _configurationService: IConfigurationService,
		@IQuickInputService private _quickInputService: IQuickInputService,
		@INotificationService private _notificationService: INotificationService,
		@IThemeService private _themeService: IThemeService,
		@IDialogService private _dialogService: IDialogService,
		@IStorageService private _storageService: IStorageService) {
		super();
		this._sorter = this._taskService.createSorter();
	}

	private _showDetail(): boolean {
		// Ensure invalid values get converted into boolean values
		return !!this._configurationService.getValue(QUICKOPEN_DETAIL_CONFIG);
	}

	private _guessTaskLabel(task: Task | ConfiguringTask): string {
		if (task._label) {
			return task._label;
		}
		if (ConfiguringTask.is(task)) {
			let label: string = task.configures.type;
			const configures: Partial<KeyedTaskIdentifier> = Objects.deepClone(task.configures);
			delete configures['_key'];
			delete configures['type'];
			Object.keys(configures).forEach(key => label += `: ${configures[key]}`);
			return label;
		}
		return '';
	}

	public static getTaskLabelWithIcon(task: Task | ConfiguringTask, labelGuess?: string): string {
		const label = labelGuess || task._label;
		const icon = task.configurationProperties.icon;
		if (!icon) {
			return `${label}`;
		}
		return icon.id ? `$(${icon.id}) ${label}` : `$(${Codicon.tools.id}) ${label}`;
	}

	public static applyColorStyles(task: Task | ConfiguringTask, entry: TaskQuickPickEntryType | ITaskTwoLevelQuickPickEntry, themeService: IThemeService): IDisposable | undefined {
		if (task.configurationProperties.icon?.color) {
			const colorTheme = themeService.getColorTheme();
			const disposable = createColorStyleElement(colorTheme);
			entry.iconClasses = [getColorClass(task.configurationProperties.icon.color)];
			return disposable;
		}
		return;
	}

	private _createTaskEntry(task: Task | ConfiguringTask, extraButtons: IQuickInputButton[] = []): ITaskTwoLevelQuickPickEntry {
		const buttons: IQuickInputButton[] = [
			{ iconClass: ThemeIcon.asClassName(configureTaskIcon), tooltip: nls.localize('configureTask', "Configure Task") },
			...extraButtons
		];
		const entry: ITaskTwoLevelQuickPickEntry = { label: TaskQuickPick.getTaskLabelWithIcon(task, this._guessTaskLabel(task)), description: this._taskService.getTaskDescription(task), task, detail: this._showDetail() ? task.configurationProperties.detail : undefined, buttons };
		const disposable = TaskQuickPick.applyColorStyles(task, entry, this._themeService);
		if (disposable) {
			this._register(disposable);
		}
		return entry;
	}

	private _createEntriesForGroup(entries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[], tasks: (Task | ConfiguringTask)[],
		groupLabel: string, extraButtons: IQuickInputButton[] = []) {
		entries.push({ type: 'separator', label: groupLabel });
		tasks.forEach(task => {
			if (!task.configurationProperties.hide) {
				entries.push(this._createTaskEntry(task, extraButtons));
			}
		});
	}

	private _createTypeEntries(entries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[], types: string[]) {
		entries.push({ type: 'separator', label: nls.localize('contributedTasks', "contributed") });
		types.forEach(type => {
			entries.push({ label: `$(folder) ${type}`, task: type, ariaLabel: nls.localize('taskType', "All {0} tasks", type) });
		});
		entries.push({ label: SHOW_ALL, task: SHOW_ALL, alwaysShow: true });
	}

	private _handleFolderTaskResult(result: Map<string, IWorkspaceFolderTaskResult>): (Task | ConfiguringTask)[] {
		const tasks: (Task | ConfiguringTask)[] = [];
		Array.from(result).forEach(([key, folderTasks]) => {
			if (folderTasks.set) {
				tasks.push(...folderTasks.set.tasks);
			}
			if (folderTasks.configurations) {
				for (const configuration in folderTasks.configurations.byIdentifier) {
					tasks.push(folderTasks.configurations.byIdentifier[configuration]);
				}
			}
		});
		return tasks;
	}

	private _dedupeConfiguredAndRecent(recentTasks: (Task | ConfiguringTask)[], configuredTasks: (Task | ConfiguringTask)[]): { configuredTasks: (Task | ConfiguringTask)[]; recentTasks: (Task | ConfiguringTask)[] } {
		let dedupedConfiguredTasks: (Task | ConfiguringTask)[] = [];
		const foundRecentTasks: boolean[] = Array(recentTasks.length).fill(false);
		for (let j = 0; j < configuredTasks.length; j++) {
			const workspaceFolder = configuredTasks[j].getWorkspaceFolder()?.uri.toString();
			const definition = configuredTasks[j].getDefinition()?._key;
			const type = configuredTasks[j].type;
			const label = configuredTasks[j]._label;
			const recentKey = configuredTasks[j].getKey();
			const findIndex = recentTasks.findIndex((value) => {
				return (workspaceFolder && definition && value.getWorkspaceFolder()?.uri.toString() === workspaceFolder
					&& ((value.getDefinition()?._key === definition) || (value.type === type && value._label === label)))
					|| (recentKey && value.getKey() === recentKey);
			});
			if (findIndex === -1) {
				dedupedConfiguredTasks.push(configuredTasks[j]);
			} else {
				recentTasks[findIndex] = configuredTasks[j];
				foundRecentTasks[findIndex] = true;
			}
		}
		dedupedConfiguredTasks = dedupedConfiguredTasks.sort((a, b) => this._sorter.compare(a, b));
		const prunedRecentTasks: (Task | ConfiguringTask)[] = [];
		for (let i = 0; i < recentTasks.length; i++) {
			if (foundRecentTasks[i] || ConfiguringTask.is(recentTasks[i])) {
				prunedRecentTasks.push(recentTasks[i]);
			}
		}
		return { configuredTasks: dedupedConfiguredTasks, recentTasks: prunedRecentTasks };
	}

	public async getTopLevelEntries(defaultEntry?: ITaskQuickPickEntry): Promise<{ entries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[]; isSingleConfigured?: Task | ConfiguringTask }> {
		if (this._topLevelEntries !== undefined) {
			return { entries: this._topLevelEntries };
		}
		let recentTasks: (Task | ConfiguringTask)[] = (await this._taskService.getSavedTasks('historical')).reverse();
		const configuredTasks: (Task | ConfiguringTask)[] = this._handleFolderTaskResult(await this._taskService.getWorkspaceTasks());
		const extensionTaskTypes = this._taskService.taskTypes();
		this._topLevelEntries = [];
		// Dedupe will update recent tasks if they've changed in tasks.json.
		const dedupeAndPrune = this._dedupeConfiguredAndRecent(recentTasks, configuredTasks);
		const dedupedConfiguredTasks: (Task | ConfiguringTask)[] = dedupeAndPrune.configuredTasks;
		recentTasks = dedupeAndPrune.recentTasks;
		if (recentTasks.length > 0) {
			const removeRecentButton: IQuickInputButton = {
				iconClass: ThemeIcon.asClassName(removeTaskIcon),
				tooltip: nls.localize('removeRecent', 'Remove Recently Used Task')
			};
			this._createEntriesForGroup(this._topLevelEntries, recentTasks, nls.localize('recentlyUsed', 'recently used'), [removeRecentButton]);
		}
		if (configuredTasks.length > 0) {
			if (dedupedConfiguredTasks.length > 0) {
				this._createEntriesForGroup(this._topLevelEntries, dedupedConfiguredTasks, nls.localize('configured', 'configured'));
			}
		}

		if (defaultEntry && (configuredTasks.length === 0)) {
			this._topLevelEntries.push({ type: 'separator', label: nls.localize('configured', 'configured') });
			this._topLevelEntries.push(defaultEntry);
		}

		if (extensionTaskTypes.length > 0) {
			this._createTypeEntries(this._topLevelEntries, extensionTaskTypes);
		}
		return { entries: this._topLevelEntries, isSingleConfigured: configuredTasks.length === 1 ? configuredTasks[0] : undefined };
	}

	public async handleSettingOption(selectedType: string) {
		const { confirmed } = await this._dialogService.confirm({
			type: Severity.Warning,
			message: nls.localize('TaskQuickPick.changeSettingDetails',
				"Task detection for {0} tasks causes files in any workspace you open to be run as code. Enabling {0} task detection is a user setting and will apply to any workspace you open. \n\n Do you want to enable {0} task detection for all workspaces?", selectedType),
			cancelButton: nls.localize('TaskQuickPick.changeSettingNo', "No")
		});
		if (confirmed) {
			await this._configurationService.updateValue(`${selectedType}.autoDetect`, 'on');
			await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
			return this.show(nls.localize('TaskService.pickRunTask', 'Select the task to run'), undefined, selectedType);
		}
		return undefined;
	}

	public async show(placeHolder: string, defaultEntry?: ITaskQuickPickEntry, startAtType?: string, name?: string): Promise<Task | undefined | null> {
		const disposables = new DisposableStore();
		const picker = disposables.add(this._quickInputService.createQuickPick<ITaskTwoLevelQuickPickEntry>({ useSeparators: true }));
		picker.placeholder = placeHolder;
		picker.matchOnDescription = true;
		picker.ignoreFocusOut = false;
		disposables.add(picker.onDidTriggerItemButton(async (context) => {
			const task = context.item.task;
			if (context.button.iconClass === ThemeIcon.asClassName(removeTaskIcon)) {
				const key = (task && !Types.isString(task)) ? task.getKey() : undefined;
				if (key) {
					this._taskService.removeRecentlyUsedTask(key);
				}
				const indexToRemove = picker.items.indexOf(context.item);
				if (indexToRemove >= 0) {
					picker.items = [...picker.items.slice(0, indexToRemove), ...picker.items.slice(indexToRemove + 1)];
				}
			} else if (context.button.iconClass === ThemeIcon.asClassName(configureTaskIcon)) {
				this._quickInputService.cancel();
				if (ContributedTask.is(task)) {
					this._taskService.customize(task, undefined, true);
				} else if (CustomTask.is(task) || ConfiguringTask.is(task)) {
					let canOpenConfig: boolean = false;
					try {
						canOpenConfig = await this._taskService.openConfig(task);
					} catch (e) {
						// do nothing.
					}
					if (!canOpenConfig) {
						this._taskService.customize(task, undefined, true);
					}
				}
			}
		}));
		if (name) {
			picker.value = name;
		}
		let firstLevelTask: Task | ConfiguringTask | string | undefined | null = startAtType;
		if (!firstLevelTask) {
			// First show recent tasks configured tasks. Other tasks will be available at a second level
			const topLevelEntriesResult = await this.getTopLevelEntries(defaultEntry);
			if (topLevelEntriesResult.isSingleConfigured && this._configurationService.getValue<boolean>(QUICKOPEN_SKIP_CONFIG)) {
				disposables.dispose();
				return this._toTask(topLevelEntriesResult.isSingleConfigured);
			}
			const taskQuickPickEntries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[] = topLevelEntriesResult.entries;
			firstLevelTask = await this._doPickerFirstLevel(picker, taskQuickPickEntries, disposables);
		}
		do {
			if (Types.isString(firstLevelTask)) {
				if (name) {
					await this._doPickerFirstLevel(picker, (await this.getTopLevelEntries(defaultEntry)).entries, disposables);
					disposables.dispose();
					return undefined;
				}
				const selectedEntry = await this.doPickerSecondLevel(picker, disposables, firstLevelTask);
				// Proceed to second level of quick pick
				if (selectedEntry && !selectedEntry.settingType && selectedEntry.task === null) {
					// The user has chosen to go back to the first level
					picker.value = '';
					firstLevelTask = await this._doPickerFirstLevel(picker, (await this.getTopLevelEntries(defaultEntry)).entries, disposables);
				} else if (selectedEntry && Types.isString(selectedEntry.settingType)) {
					disposables.dispose();
					return this.handleSettingOption(selectedEntry.settingType);
				} else {
					disposables.dispose();
					return (selectedEntry?.task && !Types.isString(selectedEntry?.task)) ? this._toTask(selectedEntry?.task) : undefined;
				}
			} else if (firstLevelTask) {
				disposables.dispose();
				return this._toTask(firstLevelTask);
			} else {
				disposables.dispose();
				return firstLevelTask;
			}
		} while (1);
		return;
	}



	private async _doPickerFirstLevel(picker: IQuickPick<ITaskTwoLevelQuickPickEntry, { useSeparators: true }>, taskQuickPickEntries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[], disposables: DisposableStore): Promise<Task | ConfiguringTask | string | null | undefined> {
		picker.items = taskQuickPickEntries;
		disposables.add(showWithPinnedItems(this._storageService, runTaskStorageKey, picker, true));
		const firstLevelPickerResult = await new Promise<ITaskTwoLevelQuickPickEntry | undefined | null>(resolve => {
			disposables.add(Event.once(picker.onDidAccept)(async () => {
				resolve(picker.selectedItems ? picker.selectedItems[0] : undefined);
			}));
		});
		return firstLevelPickerResult?.task;
	}

	public async doPickerSecondLevel(picker: IQuickPick<ITaskTwoLevelQuickPickEntry, { useSeparators: true }>, disposables: DisposableStore, type: string, name?: string) {
		picker.busy = true;
		if (type === SHOW_ALL) {
			const items = (await this._taskService.tasks()).filter(t => !t.configurationProperties.hide).sort((a, b) => this._sorter.compare(a, b)).map(task => this._createTaskEntry(task));
			items.push(...TaskQuickPick.allSettingEntries(this._configurationService));
			picker.items = items;
		} else {
			picker.value = name || '';
			picker.items = await this._getEntriesForProvider(type);
		}
		await picker.show();
		picker.busy = false;
		const secondLevelPickerResult = await new Promise<ITaskTwoLevelQuickPickEntry | undefined | null>(resolve => {
			disposables.add(Event.once(picker.onDidAccept)(async () => {
				resolve(picker.selectedItems ? picker.selectedItems[0] : undefined);
			}));
		});
		return secondLevelPickerResult;
	}

	public static allSettingEntries(configurationService: IConfigurationService): (ITaskTwoLevelQuickPickEntry & { settingType: string })[] {
		const entries: (ITaskTwoLevelQuickPickEntry & { settingType: string })[] = [];
		const gruntEntry = TaskQuickPick.getSettingEntry(configurationService, 'grunt');
		if (gruntEntry) {
			entries.push(gruntEntry);
		}
		const gulpEntry = TaskQuickPick.getSettingEntry(configurationService, 'gulp');
		if (gulpEntry) {
			entries.push(gulpEntry);
		}
		const jakeEntry = TaskQuickPick.getSettingEntry(configurationService, 'jake');
		if (jakeEntry) {
			entries.push(jakeEntry);
		}
		return entries;
	}

	public static getSettingEntry(configurationService: IConfigurationService, type: string): (ITaskTwoLevelQuickPickEntry & { settingType: string }) | undefined {
		if (configurationService.getValue(`${type}.autoDetect`) === 'off') {
			return {
				label: nls.localize('TaskQuickPick.changeSettingsOptions', "$(gear) {0} task detection is turned off. Enable {1} task detection...",
					type[0].toUpperCase() + type.slice(1), type),
				task: null,
				settingType: type,
				alwaysShow: true
			};
		}
		return undefined;
	}

	private async _getEntriesForProvider(type: string): Promise<QuickPickInput<ITaskTwoLevelQuickPickEntry>[]> {
		const tasks = (await this._taskService.tasks({ type })).sort((a, b) => this._sorter.compare(a, b));
		let taskQuickPickEntries: QuickPickInput<ITaskTwoLevelQuickPickEntry>[] = [];
		if (tasks.length > 0) {
			for (const task of tasks) {
				if (!task.configurationProperties.hide) {
					taskQuickPickEntries.push(this._createTaskEntry(task));
				}
			}
			taskQuickPickEntries.push({
				type: 'separator'
			}, {
				label: nls.localize('TaskQuickPick.goBack', 'Go back ↩'),
				task: null,
				alwaysShow: true
			});
		} else {
			taskQuickPickEntries = [{
				label: nls.localize('TaskQuickPick.noTasksForType', 'No {0} tasks found. Go back ↩', type),
				task: null,
				alwaysShow: true
			}];
		}

		const settingEntry = TaskQuickPick.getSettingEntry(this._configurationService, type);
		if (settingEntry) {
			taskQuickPickEntries.push(settingEntry);
		}
		return taskQuickPickEntries;
	}

	private async _toTask(task: Task | ConfiguringTask): Promise<Task | undefined> {
		if (!ConfiguringTask.is(task)) {
			return task;
		}

		const resolvedTask = await this._taskService.tryResolveTask(task);

		if (!resolvedTask) {
			this._notificationService.error(nls.localize('noProviderForTask', "There is no task provider registered for tasks of type \"{0}\".", task.type));
		}
		return resolvedTask;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/taskService.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/taskService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ITaskSystem } from '../common/taskSystem.js';
import { ExecutionEngine } from '../common/tasks.js';
import { AbstractTaskService, IWorkspaceFolderConfigurationResult } from './abstractTaskService.js';
import { ITaskFilter, ITaskService } from '../common/taskService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class TaskService extends AbstractTaskService {
	private static readonly ProcessTaskSystemSupportMessage = nls.localize('taskService.processTaskSystem', 'Process task system is not support in the web.');

	protected _getTaskSystem(): ITaskSystem {
		if (this._taskSystem) {
			return this._taskSystem;
		}
		if (this.executionEngine !== ExecutionEngine.Terminal) {
			throw new Error(TaskService.ProcessTaskSystemSupportMessage);
		}
		this._taskSystem = this._createTerminalTaskSystem();
		this._taskSystemListeners =
			[
				this._taskSystem.onDidStateChange((event) => {
					this._taskRunningState.set(this._taskSystem!.isActiveSync());
					this._onDidStateChange.fire(event);
				}),
			];
		return this._taskSystem;
	}

	protected _computeLegacyConfiguration(workspaceFolder: IWorkspaceFolder): Promise<IWorkspaceFolderConfigurationResult> {
		throw new Error(TaskService.ProcessTaskSystemSupportMessage);
	}

	protected _versionAndEngineCompatible(filter?: ITaskFilter): boolean {
		return this.executionEngine === ExecutionEngine.Terminal;
	}
}

registerSingleton(ITaskService, TaskService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/tasksQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/tasksQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IQuickPickSeparator, IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IPickerQuickAccessItem, PickerQuickAccessProvider, TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ITaskService, Task } from '../common/taskService.js';
import { CustomTask, ContributedTask, ConfiguringTask } from '../common/tasks.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { TaskQuickPick, ITaskTwoLevelQuickPickEntry } from './taskQuickPick.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { isString } from '../../../../base/common/types.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class TasksQuickAccessProvider extends PickerQuickAccessProvider<IPickerQuickAccessItem> {

	static PREFIX = 'task ';

	constructor(
		@IExtensionService extensionService: IExtensionService,
		@ITaskService private _taskService: ITaskService,
		@IConfigurationService private _configurationService: IConfigurationService,
		@IQuickInputService private _quickInputService: IQuickInputService,
		@INotificationService private _notificationService: INotificationService,
		@IDialogService private _dialogService: IDialogService,
		@IThemeService private _themeService: IThemeService,
		@IStorageService private _storageService: IStorageService
	) {
		super(TasksQuickAccessProvider.PREFIX, {
			noResultsPick: {
				label: localize('noTaskResults', "No matching tasks")
			}
		});
	}

	protected async _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): Promise<Array<IPickerQuickAccessItem | IQuickPickSeparator>> {
		if (token.isCancellationRequested) {
			return [];
		}

		const taskQuickPick = new TaskQuickPick(this._taskService, this._configurationService, this._quickInputService, this._notificationService, this._themeService, this._dialogService, this._storageService);
		const topLevelPicks = await taskQuickPick.getTopLevelEntries();
		const taskPicks: Array<IPickerQuickAccessItem | IQuickPickSeparator> = [];

		for (const entry of topLevelPicks.entries) {
			const highlights = matchesFuzzy(filter, entry.label!);
			if (!highlights) {
				continue;
			}

			if (entry.type === 'separator') {
				taskPicks.push(entry);
			}

			const task: Task | ConfiguringTask | string = (<ITaskTwoLevelQuickPickEntry>entry).task!;
			const quickAccessEntry: IPickerQuickAccessItem = <ITaskTwoLevelQuickPickEntry>entry;
			quickAccessEntry.highlights = { label: highlights };
			quickAccessEntry.trigger = (index) => {
				if ((index === 1) && (quickAccessEntry.buttons?.length === 2)) {
					const key = (task && !isString(task)) ? task.getKey() : undefined;
					if (key) {
						this._taskService.removeRecentlyUsedTask(key);
					}
					return TriggerAction.REFRESH_PICKER;
				} else {
					if (ContributedTask.is(task)) {
						this._taskService.customize(task, undefined, true);
					} else if (CustomTask.is(task)) {
						this._taskService.openConfig(task);
					}
					return TriggerAction.CLOSE_PICKER;
				}
			};
			quickAccessEntry.accept = async () => {
				if (isString(task)) {
					// switch to quick pick and show second level
					const showResult = await taskQuickPick.show(localize('TaskService.pickRunTask', 'Select the task to run'), undefined, task);
					if (showResult) {
						this._taskService.run(showResult, { attachProblemMatcher: true });
					}
				} else {
					this._taskService.run(await this._toTask(task), { attachProblemMatcher: true });
				}
			};

			taskPicks.push(quickAccessEntry);
		}
		return taskPicks;
	}

	private async _toTask(task: Task | ConfiguringTask): Promise<Task | undefined> {
		if (!ConfiguringTask.is(task)) {
			return task;
		}

		return this._taskService.tryResolveTask(task);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/taskTerminalStatus.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/taskTerminalStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { AbstractProblemCollector, StartStopProblemCollector } from '../common/problemCollectors.js';
import { ITaskGeneralEvent, ITaskProcessEndedEvent, ITaskProcessStartedEvent, TaskEventKind, TaskRunType } from '../common/tasks.js';
import { ITaskService, Task } from '../common/taskService.js';
import { ITerminalInstance } from '../../terminal/browser/terminal.js';
import { MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { spinningLoading } from '../../../../platform/theme/common/iconRegistry.js';
import type { IMarker } from '@xterm/xterm';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ITerminalStatus } from '../../terminal/common/terminal.js';

interface ITerminalData {
	terminal: ITerminalInstance;
	task: Task;
	status: ITerminalStatus;
	problemMatcher: AbstractProblemCollector;
	taskRunEnded: boolean;
	disposeListener?: MutableDisposable<IDisposable>;
}

const TASK_TERMINAL_STATUS_ID = 'task_terminal_status';
export const ACTIVE_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: spinningLoading, severity: Severity.Info, tooltip: nls.localize('taskTerminalStatus.active', "Task is running") };
export const SUCCEEDED_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.check, severity: Severity.Info, tooltip: nls.localize('taskTerminalStatus.succeeded', "Task succeeded") };
const SUCCEEDED_INACTIVE_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.check, severity: Severity.Info, tooltip: nls.localize('taskTerminalStatus.succeededInactive', "Task succeeded and waiting...") };
export const FAILED_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.error, severity: Severity.Error, tooltip: nls.localize('taskTerminalStatus.errors', "Task has errors") };
const FAILED_INACTIVE_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.error, severity: Severity.Error, tooltip: nls.localize('taskTerminalStatus.errorsInactive', "Task has errors and is waiting...") };
const WARNING_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.warning, severity: Severity.Warning, tooltip: nls.localize('taskTerminalStatus.warnings', "Task has warnings") };
const WARNING_INACTIVE_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.warning, severity: Severity.Warning, tooltip: nls.localize('taskTerminalStatus.warningsInactive', "Task has warnings and is waiting...") };
const INFO_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.info, severity: Severity.Info, tooltip: nls.localize('taskTerminalStatus.infos', "Task has infos") };
const INFO_INACTIVE_TASK_STATUS: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, icon: Codicon.info, severity: Severity.Info, tooltip: nls.localize('taskTerminalStatus.infosInactive', "Task has infos and is waiting...") };

export class TaskTerminalStatus extends Disposable {
	private terminalMap: Map<number, ITerminalData> = new Map();
	private _marker: IMarker | undefined;
	constructor(@ITaskService taskService: ITaskService, @IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService) {
		super();
		this._register(taskService.onDidStateChange((event) => {
			switch (event.kind) {
				case TaskEventKind.ProcessStarted:
				case TaskEventKind.Active: this.eventActive(event); break;
				case TaskEventKind.Inactive: this.eventInactive(event); break;
				case TaskEventKind.ProcessEnded: this.eventEnd(event); break;
			}
		}));
		this._register(toDisposable(() => {
			for (const terminalData of this.terminalMap.values()) {
				terminalData.disposeListener?.dispose();
			}
			this.terminalMap.clear();
		}));
	}

	addTerminal(task: Task, terminal: ITerminalInstance, problemMatcher: AbstractProblemCollector) {
		const status: ITerminalStatus = { id: TASK_TERMINAL_STATUS_ID, severity: Severity.Info };
		terminal.statusList.add(status);
		this._register(problemMatcher.onDidFindFirstMatch(() => {
			this._marker = terminal.registerMarker();
			if (this._marker) {
				this._register(this._marker);
			}
		}));
		this._register(problemMatcher.onDidFindErrors(() => {
			if (this._marker) {
				terminal.addBufferMarker({ marker: this._marker, hoverMessage: nls.localize('task.watchFirstError', "Beginning of detected errors for this run"), disableCommandStorage: true });
			}
		}));
		this._register(problemMatcher.onDidRequestInvalidateLastMarker(() => {
			this._marker?.dispose();
			this._marker = undefined;
		}));

		this.terminalMap.set(terminal.instanceId, { terminal, task, status, problemMatcher, taskRunEnded: false });
	}

	private terminalFromEvent(event: { terminalId: number | undefined }): ITerminalData | undefined {
		if (!('terminalId' in event) || !event.terminalId) {
			return undefined;
		}
		return this.terminalMap.get(event.terminalId);
	}

	private eventEnd(event: ITaskProcessEndedEvent) {
		const terminalData = this.terminalFromEvent(event);
		if (!terminalData) {
			return;
		}
		terminalData.taskRunEnded = true;
		terminalData.terminal.statusList.remove(terminalData.status);
		if ((event.exitCode === 0) && (!terminalData.problemMatcher.maxMarkerSeverity || terminalData.problemMatcher.maxMarkerSeverity < MarkerSeverity.Warning)) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.taskCompleted);
			if (terminalData.task.configurationProperties.isBackground) {
				for (const status of terminalData.terminal.statusList.statuses) {
					terminalData.terminal.statusList.remove(status);
				}
			} else {
				terminalData.terminal.statusList.add(SUCCEEDED_TASK_STATUS);
			}
		} else if (event.exitCode || (terminalData.problemMatcher.maxMarkerSeverity !== undefined && terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Error)) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.taskFailed);
			terminalData.terminal.statusList.add(FAILED_TASK_STATUS);
		} else if (terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Warning) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.taskFailed);
			terminalData.terminal.statusList.add(WARNING_TASK_STATUS);
		} else if (terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Info) {
			terminalData.terminal.statusList.add(INFO_TASK_STATUS);
		}
	}

	private eventInactive(event: ITaskGeneralEvent) {
		const terminalData = this.terminalFromEvent(event);
		if (!terminalData || !terminalData.problemMatcher || terminalData.taskRunEnded) {
			return;
		}
		terminalData.terminal.statusList.remove(terminalData.status);
		if (terminalData.problemMatcher.numberOfMatches === 0) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.taskCompleted);
			terminalData.terminal.statusList.add(SUCCEEDED_INACTIVE_TASK_STATUS);
		} else if (terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Error) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.taskFailed);
			terminalData.terminal.statusList.add(FAILED_INACTIVE_TASK_STATUS);
		} else if (terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Warning) {
			terminalData.terminal.statusList.add(WARNING_INACTIVE_TASK_STATUS);
		} else if (terminalData.problemMatcher.maxMarkerSeverity === MarkerSeverity.Info) {
			terminalData.terminal.statusList.add(INFO_INACTIVE_TASK_STATUS);
		}
	}

	private eventActive(event: ITaskGeneralEvent | ITaskProcessStartedEvent) {
		const terminalData = this.terminalFromEvent(event);
		if (!terminalData) {
			return;
		}
		if (!terminalData.disposeListener) {
			terminalData.disposeListener = this._register(new MutableDisposable());
			terminalData.disposeListener.value = terminalData.terminal.onDisposed(() => {
				if (!event.terminalId) {
					return;
				}
				this.terminalMap.delete(event.terminalId);
				terminalData.disposeListener?.dispose();
			});
		}
		terminalData.taskRunEnded = false;
		terminalData.terminal.statusList.remove(terminalData.status);
		// We don't want to show an infinite status for a background task that doesn't have a problem matcher.
		if ((terminalData.problemMatcher instanceof StartStopProblemCollector) || (terminalData.problemMatcher?.problemMatchers.length > 0) || event.runType === TaskRunType.SingleRun) {
			terminalData.terminal.statusList.add(ACTIVE_TASK_STATUS);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/browser/terminalTaskSystem.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/browser/terminalTaskSystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../base/common/arrays.js';
import * as Async from '../../../../base/common/async.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isUNC } from '../../../../base/common/extpath.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedMap, Touch } from '../../../../base/common/map.js';
import * as Objects from '../../../../base/common/objects.js';
import * as path from '../../../../base/common/path.js';
import * as Platform from '../../../../base/common/platform.js';
import * as resources from '../../../../base/common/resources.js';
import Severity from '../../../../base/common/severity.js';
import * as Types from '../../../../base/common/types.js';
import * as nls from '../../../../nls.js';

import { IModelService } from '../../../../editor/common/services/model.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IMarkerData, IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { Markers } from '../../markers/common/markers.js';
import { ProblemMatcher, ProblemMatcherRegistry /*, ProblemPattern, getResource */ } from '../common/problemMatcher.js';

import { Codicon } from '../../../../base/common/codicons.js';
import { Schemas } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IShellLaunchConfig, WaitOnExitValue } from '../../../../platform/terminal/common/terminal.js';
import { formatMessageForTerminal } from '../../../../platform/terminal/common/terminalStrings.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { TaskTerminalStatus } from './taskTerminalStatus.js';
import { ProblemCollectorEventKind, ProblemHandlingStrategy, StartStopProblemCollector, WatchingProblemCollector } from '../common/problemCollectors.js';
import { GroupKind } from '../common/taskConfiguration.js';
import { IResolveSet, IResolvedVariables, ITaskExecuteResult, ITaskResolver, ITaskSummary, ITaskSystem, ITaskSystemInfo, ITaskSystemInfoResolver, ITaskTerminateResponse, TaskError, TaskErrors, TaskExecuteKind, Triggers, VerifiedTask } from '../common/taskSystem.js';
import { CommandOptions, CommandString, ContributedTask, CustomTask, DependsOrder, ICommandConfiguration, IConfigurationProperties, IExtensionTaskSource, IPresentationOptions, IShellConfiguration, IShellQuotingOptions, ITaskEvent, InMemoryTask, PanelKind, RerunForActiveTerminalCommandId, RevealKind, RevealProblemKind, RuntimeType, ShellQuoting, TASK_TERMINAL_ACTIVE, Task, TaskEvent, TaskEventKind, TaskScope, TaskSourceKind, rerunTaskIcon } from '../common/tasks.js';
import { ITerminalGroupService, ITerminalInstance, ITerminalService } from '../../terminal/browser/terminal.js';
import { VSCodeOscProperty, VSCodeOscPt, VSCodeSequence } from '../../terminal/browser/terminalEscapeSequences.js';
import { TerminalProcessExtHostProxy } from '../../terminal/browser/terminalProcessExtHostProxy.js';
import { ITerminalProfileResolverService, TERMINAL_VIEW_ID } from '../../terminal/common/terminal.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { TaskProblemMonitor } from './taskProblemMonitor.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { serializeVSCodeOscMessage } from '../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';

interface ITerminalData {
	terminal: ITerminalInstance;
	lastTask: string;
	group?: string;
	shellIntegrationNonce?: string;
}

interface IInstanceCount {
	count: number;
}

interface IActiveTerminalData {
	terminal?: ITerminalInstance;
	task: Task;
	promise: Promise<ITaskSummary>;
	state?: TaskEventKind;
	count: IInstanceCount;
}

export interface IReconnectionTaskData {
	label: string;
	id: string;
	lastTask: string;
	group?: string;
	shellIntegrationNonce?: string;
}

const TaskTerminalType = 'Task';

class VariableResolver {
	private static _regex = /\$\{(.*?)\}/g;
	constructor(public workspaceFolder: IWorkspaceFolder | undefined, public taskSystemInfo: ITaskSystemInfo | undefined, public readonly values: Map<string, string>, private _service: IConfigurationResolverService | undefined) {
	}
	async resolve(value: string): Promise<string> {
		const replacers: Promise<string>[] = [];
		value.replace(VariableResolver._regex, (match, ...args) => {
			replacers.push(this._replacer(match, args));
			return match;
		});
		const resolvedReplacers = await Promise.all(replacers);
		return value.replace(VariableResolver._regex, () => resolvedReplacers.shift()!);

	}

	private async _replacer(match: string, args: string[]): Promise<string> {
		// Strip out the ${} because the map contains them variables without those characters.
		const result = this.values.get(match.substring(2, match.length - 1));
		if ((result !== undefined) && (result !== null)) {
			return result;
		}
		if (this._service) {
			return this._service.resolveAsync(this.workspaceFolder, match);
		}
		return match;
	}
}


export class TerminalTaskSystem extends Disposable implements ITaskSystem {

	public static TelemetryEventName: string = 'taskService';

	private static readonly ProcessVarName = '__process__';

	private static _shellQuotes: IStringDictionary<IShellQuotingOptions> = {
		'cmd': {
			strong: '"'
		},
		'powershell': {
			escape: {
				escapeChar: '`',
				charsToEscape: ' "\'()'
			},
			strong: '\'',
			weak: '"'
		},
		'bash': {
			escape: {
				escapeChar: '\\',
				charsToEscape: ' "\''
			},
			strong: '\'',
			weak: '"'
		},
		'zsh': {
			escape: {
				escapeChar: '\\',
				charsToEscape: ' "\''
			},
			strong: '\'',
			weak: '"'
		}
	};

	private static _osShellQuotes: IStringDictionary<IShellQuotingOptions> = {
		'Linux': TerminalTaskSystem._shellQuotes['bash'],
		'Mac': TerminalTaskSystem._shellQuotes['bash'],
		'Windows': TerminalTaskSystem._shellQuotes['powershell']
	};

	private _activeTasks: IStringDictionary<IActiveTerminalData>;
	private _busyTasks: IStringDictionary<Task>;
	private _taskErrors: IStringDictionary<boolean>; // Tracks which tasks had errors from problem matchers
	private _taskDependencies: IStringDictionary<string[]>; // Tracks which tasks depend on which other tasks
	private _terminals: IStringDictionary<ITerminalData>;
	private _idleTaskTerminals: LinkedMap<string, string>;
	private _sameTaskTerminals: IStringDictionary<string>;
	private _taskSystemInfoResolver: ITaskSystemInfoResolver;
	private _lastTask: VerifiedTask | undefined;
	// Should always be set in run
	private _currentTask!: VerifiedTask;
	private _isRerun: boolean = false;
	private _previousPanelId: string | undefined;
	private _previousTerminalInstance: ITerminalInstance | undefined;
	private _terminalStatusManager: TaskTerminalStatus;
	private _taskProblemMonitor: TaskProblemMonitor;
	private _terminalCreationQueue: Promise<ITerminalInstance | void> = Promise.resolve();
	private _hasReconnected: boolean = false;
	private readonly _onDidStateChange: Emitter<ITaskEvent>;
	private _terminalTabActions = [{ id: RerunForActiveTerminalCommandId, label: nls.localize('rerunTask', 'Rerun Task'), icon: rerunTaskIcon }];
	private _taskTerminalActive: IContextKey<boolean>;
	private readonly _taskStartTimes = new Map<number, number>();

	taskShellIntegrationStartSequence(cwd: string | URI | undefined): string {
		return (
			VSCodeSequence(VSCodeOscPt.Property, `${VSCodeOscProperty.HasRichCommandDetection}=True`) +
			VSCodeSequence(VSCodeOscPt.PromptStart) +
			VSCodeSequence(VSCodeOscPt.Property, `${VSCodeOscProperty.Task}=True`) +
			(cwd
				? VSCodeSequence(VSCodeOscPt.Property, `${VSCodeOscProperty.Cwd}=${typeof cwd === 'string' ? cwd : cwd.fsPath}`)
				: ''
			) +
			VSCodeSequence(VSCodeOscPt.CommandStart)
		);
	}
	getTaskShellIntegrationOutputSequence(commandLineInfo: { commandLine: string; nonce: string } | undefined): string {
		return (
			(commandLineInfo
				? VSCodeSequence(VSCodeOscPt.CommandLine, `${serializeVSCodeOscMessage(commandLineInfo.commandLine)};${commandLineInfo.nonce}`)
				: ''
			) +
			VSCodeSequence(VSCodeOscPt.CommandExecuted)
		);
	}

	constructor(
		private _terminalService: ITerminalService,
		private _terminalGroupService: ITerminalGroupService,
		private _outputService: IOutputService,
		private _paneCompositeService: IPaneCompositePartService,
		private _viewsService: IViewsService,
		private _markerService: IMarkerService,
		private _modelService: IModelService,
		private _configurationResolverService: IConfigurationResolverService,
		private _contextService: IWorkspaceContextService,
		private _environmentService: IWorkbenchEnvironmentService,
		private _outputChannelId: string,
		private _fileService: IFileService,
		private _terminalProfileResolverService: ITerminalProfileResolverService,
		private _pathService: IPathService,
		private _viewDescriptorService: IViewDescriptorService,
		private _logService: ILogService,
		private _notificationService: INotificationService,
		contextKeyService: IContextKeyService,
		instantiationService: IInstantiationService,
		taskSystemInfoResolver: ITaskSystemInfoResolver,
		private _taskLookup: (taskKey: string) => Promise<Task | undefined>,
	) {
		super();

		this._activeTasks = Object.create(null);
		this._busyTasks = Object.create(null);
		this._taskErrors = Object.create(null);
		this._taskDependencies = Object.create(null);
		this._terminals = Object.create(null);
		this._idleTaskTerminals = new LinkedMap<string, string>();
		this._sameTaskTerminals = Object.create(null);
		this._onDidStateChange = new Emitter();
		this._taskSystemInfoResolver = taskSystemInfoResolver;
		this._register(this._terminalStatusManager = instantiationService.createInstance(TaskTerminalStatus));
		this._register(this._taskProblemMonitor = instantiationService.createInstance(TaskProblemMonitor));
		this._taskTerminalActive = TASK_TERMINAL_ACTIVE.bindTo(contextKeyService);
		this._register(this._terminalService.onDidChangeActiveInstance((e) => this._taskTerminalActive.set(e?.shellLaunchConfig.type === 'Task')));
	}

	public get onDidStateChange(): Event<ITaskEvent> {
		return this._onDidStateChange.event;
	}

	private _log(value: string): void {
		this._appendOutput(value + '\n');
	}

	protected _showOutput(): void {
		this._outputService.showChannel(this._outputChannelId, true);
	}

	public reconnect(task: Task, resolver: ITaskResolver): ITaskExecuteResult {
		this._reconnectToTerminals();
		return this.run(task, resolver, Triggers.reconnect);
	}

	public run(task: Task, resolver: ITaskResolver, trigger: string = Triggers.command): ITaskExecuteResult {
		task = task.clone(); // A small amount of task state is stored in the task (instance) and tasks passed in to run may have that set already.
		const instances = InMemoryTask.is(task) || this._isTaskEmpty(task) ? [] : this._getInstances(task);
		const validInstance = instances.length < ((task.runOptions && task.runOptions.instanceLimit) ?? 1);
		const instance = instances[0]?.count?.count ?? 0;
		this._currentTask = new VerifiedTask(task, resolver, trigger);
		if (instance > 0) {
			task.instance = instance;
		}
		if (!validInstance) {
			const terminalData = instances[instances.length - 1];
			this._lastTask = this._currentTask;
			return { kind: TaskExecuteKind.Active, task: terminalData.task, active: { same: true, background: task.configurationProperties.isBackground! }, promise: terminalData.promise };
		}

		try {
			const executeResult = { kind: TaskExecuteKind.Started, task, started: {}, promise: this._executeTask(task, resolver, trigger, new Set(), new Map(), undefined) };
			executeResult.promise.then(summary => {
				this._lastTask = this._currentTask;
			});
			return executeResult;
		} catch (error) {
			if (error instanceof TaskError) {
				throw error;
			} else if (error instanceof Error) {
				this._log(error.message);
				throw new TaskError(Severity.Error, error.message, TaskErrors.UnknownError);
			} else {
				this._log(error.toString());
				throw new TaskError(Severity.Error, nls.localize('TerminalTaskSystem.unknownError', 'A unknown error has occurred while executing a task. See task output log for details.'), TaskErrors.UnknownError);
			}
		}
	}

	getTerminalsForTasks(tasks: Types.SingleOrMany<Task>): URI[] | undefined {
		const results: URI[] = [];
		for (const t of asArray(tasks)) {
			for (const key in this._terminals) {
				const value = this._terminals[key];
				if (value.lastTask === t.getMapKey()) {
					results.push(value.terminal.resource);
				}
			}
		}
		return results.length > 0 ? results : undefined;
	}

	public getTaskProblems(instanceId: number): Map<string, { resources: URI[]; markers: IMarkerData[] }> | undefined {
		return this._taskProblemMonitor.getTaskProblems(instanceId);
	}

	public rerun(): ITaskExecuteResult | undefined {
		if (this._lastTask && this._lastTask.verify()) {
			if ((this._lastTask.task.runOptions.reevaluateOnRerun !== undefined) && !this._lastTask.task.runOptions.reevaluateOnRerun) {
				this._isRerun = true;
			}
			const result = this.run(this._lastTask.task, this._lastTask.resolver);
			result.promise.then(summary => {
				this._isRerun = false;
			});
			return result;
		} else {
			return undefined;
		}
	}

	get lastTask(): VerifiedTask | undefined {
		return this._lastTask;
	}

	set lastTask(task: VerifiedTask | undefined) {
		this._lastTask = task;
	}

	private _showTaskLoadErrors(task: Task) {
		if (task.taskLoadMessages && task.taskLoadMessages.length > 0) {
			task.taskLoadMessages.forEach(loadMessage => {
				this._log(loadMessage + '\n');
			});
			const openOutput = 'Show Output';
			this._notificationService.prompt(Severity.Warning,
				nls.localize('TerminalTaskSystem.taskLoadReporting', "There are issues with task \"{0}\". See the output for more details.",
					task._label), [{
						label: openOutput,
						run: () => this._showOutput()
					}]);
		}
	}

	public isTaskVisible(task: Task): boolean {
		const terminalData = this._activeTasks[task.getMapKey()];
		if (!terminalData?.terminal) {
			return false;
		}
		const activeTerminalInstance = this._terminalService.activeInstance;
		const isPanelShowingTerminal = !!this._viewsService.getActiveViewWithId(TERMINAL_VIEW_ID);
		return isPanelShowingTerminal && (activeTerminalInstance?.instanceId === terminalData.terminal.instanceId);
	}


	public revealTask(task: Task): boolean {
		const terminalData = this._activeTasks[task.getMapKey()];
		if (!terminalData?.terminal) {
			return false;
		}
		const isTerminalInPanel: boolean = this._viewDescriptorService.getViewLocationById(TERMINAL_VIEW_ID) === ViewContainerLocation.Panel;
		if (isTerminalInPanel && this.isTaskVisible(task)) {
			if (this._previousPanelId) {
				if (this._previousTerminalInstance) {
					this._terminalService.setActiveInstance(this._previousTerminalInstance);
				}
				this._paneCompositeService.openPaneComposite(this._previousPanelId, ViewContainerLocation.Panel);
			} else {
				this._paneCompositeService.hideActivePaneComposite(ViewContainerLocation.Panel);
			}
			this._previousPanelId = undefined;
			this._previousTerminalInstance = undefined;
		} else {
			if (isTerminalInPanel) {
				this._previousPanelId = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel)?.getId();
				if (this._previousPanelId === TERMINAL_VIEW_ID) {
					this._previousTerminalInstance = this._terminalService.activeInstance ?? undefined;
				}
			}
			this._terminalService.setActiveInstance(terminalData.terminal);
			if (CustomTask.is(task) || ContributedTask.is(task)) {
				this._terminalGroupService.showPanel(task.command.presentation!.focus);
			}
		}
		return true;
	}

	public isActive(): Promise<boolean> {
		return Promise.resolve(this.isActiveSync());
	}

	public isActiveSync(): boolean {
		return Object.values(this._activeTasks).some(value => !!value.terminal);
	}

	public canAutoTerminate(): boolean {
		return Object.values(this._activeTasks).every(value => !value.task.configurationProperties.promptOnClose);
	}

	public getActiveTasks(): Task[] {
		return Object.values(this._activeTasks).flatMap(value => value.terminal ? value.task : []);
	}

	public getLastInstance(task: Task): Task | undefined {
		const recentKey = task.getKey();
		return Object.values(this._activeTasks).reverse().find(
			(value) => recentKey && recentKey === value.task.getKey())?.task;
	}

	public getFirstInstance(task: Task): Task | undefined {
		const recentKey = task.getKey();
		for (const task of this.getActiveTasks()) {
			if (recentKey && recentKey === task.getKey()) {
				return task;
			}
		}
		return undefined;
	}

	public getBusyTasks(): Task[] {
		return Object.keys(this._busyTasks).map(key => this._busyTasks[key]);
	}

	public customExecutionComplete(task: Task, result: number): Promise<void> {
		const activeTerminal = this._activeTasks[task.getMapKey()];
		if (!activeTerminal?.terminal) {
			return Promise.reject(new Error('Expected to have a terminal for a custom execution task'));
		}

		return new Promise<void>((resolve) => {
			// activeTerminal.terminal.rendererExit(result);
			resolve();
		});
	}

	private _getInstances(task: Task): IActiveTerminalData[] {
		const recentKey = task.getKey();
		return Object.values(this._activeTasks).filter(
			(value) => recentKey && recentKey === value.task.getKey());
	}

	private _removeFromActiveTasks(task: Task | string): void {
		const key = typeof task === 'string' ? task : task.getMapKey();
		const taskToRemove = this._activeTasks[key];
		if (!taskToRemove) {
			return;
		}
		delete this._activeTasks[key];
	}

	private _fireTaskEvent(event: ITaskEvent) {
		if (event.kind !== TaskEventKind.Changed && event.kind !== TaskEventKind.ProblemMatcherEnded && event.kind !== TaskEventKind.ProblemMatcherStarted) {
			const activeTask = this._activeTasks[event.__task.getMapKey()];
			if (activeTask) {
				activeTask.state = event.kind;
			}
		}
		this._onDidStateChange.fire(event);
	}

	public terminate(task: Task): Promise<ITaskTerminateResponse> {
		const activeTerminal = this._activeTasks[task.getMapKey()];
		if (!activeTerminal) {
			return Promise.resolve<ITaskTerminateResponse>({ success: false, task: undefined });
		}
		const terminal = activeTerminal.terminal;
		if (!terminal) {
			return Promise.resolve<ITaskTerminateResponse>({ success: false, task: undefined });
		}
		return new Promise<ITaskTerminateResponse>((resolve, reject) => {
			this._register(terminal.onDisposed(terminal => {
				this._fireTaskEvent(TaskEvent.terminated(task, terminal.instanceId, terminal.exitReason));
			}));
			const onExit = terminal.onExit(() => {
				const task = activeTerminal.task;
				try {
					onExit.dispose();
					this._fireTaskEvent(TaskEvent.terminated(task, terminal.instanceId, terminal.exitReason));
				} catch (error) {
					// Do nothing.
				}
				resolve({ success: true, task: task });
			});
			terminal.dispose();
		});
	}

	public terminateAll(): Promise<ITaskTerminateResponse[]> {
		const promises: Promise<ITaskTerminateResponse>[] = [];
		for (const [key, terminalData] of Object.entries(this._activeTasks)) {
			const terminal = terminalData?.terminal;
			if (terminal) {
				promises.push(new Promise<ITaskTerminateResponse>((resolve, reject) => {
					const onExit = terminal.onExit(() => {
						const task = terminalData.task;
						try {
							onExit.dispose();
							this._fireTaskEvent(TaskEvent.terminated(task, terminal.instanceId, terminal.exitReason));
						} catch (error) {
							// Do nothing.
						}
						if (this._activeTasks[key] === terminalData) {
							delete this._activeTasks[key];
						}
						resolve({ success: true, task: terminalData.task });
					});
				}));
				terminal.dispose();
			}
		}
		return Promise.all<ITaskTerminateResponse>(promises);
	}

	private _showDependencyCycleMessage(task: Task) {
		this._log(nls.localize('dependencyCycle',
			'There is a dependency cycle. See task "{0}".',
			task._label
		));
		this._showOutput();
	}

	private _executeTask(task: Task, resolver: ITaskResolver, trigger: string, liveDependencies: Set<string>, encounteredTasks: Map<string, Promise<ITaskSummary>>, alreadyResolved?: Map<string, string>): Promise<ITaskSummary> {
		this._showTaskLoadErrors(task);

		const mapKey = task.getMapKey();

		// It's important that we add this task's entry to _activeTasks before
		// any of the code in the then runs (see #180541 and #180578). Wrapping
		// it in Promise.resolve().then() ensures that.
		const promise = Promise.resolve().then(async () => {
			alreadyResolved = alreadyResolved ?? new Map<string, string>();
			const promises: Promise<ITaskSummary>[] = [];
			if (task.configurationProperties.dependsOn) {
				const nextLiveDependencies = new Set(liveDependencies).add(task.getCommonTaskId());
				for (const dependency of task.configurationProperties.dependsOn) {
					const dependencyTask = await resolver.resolve(dependency.uri, dependency.task);
					if (dependencyTask) {
						this._adoptConfigurationForDependencyTask(dependencyTask, task);

						// Track the dependency relationship
						const taskMapKey = task.getMapKey();
						const dependencyMapKey = dependencyTask.getMapKey();
						if (!this._taskDependencies[taskMapKey]) {
							this._taskDependencies[taskMapKey] = [];
						}
						if (!this._taskDependencies[taskMapKey].includes(dependencyMapKey)) {
							this._taskDependencies[taskMapKey].push(dependencyMapKey);
						}
						let taskResult;
						const commonKey = dependencyTask.getCommonTaskId();
						if (nextLiveDependencies.has(commonKey)) {
							this._showDependencyCycleMessage(dependencyTask);
							taskResult = Promise.resolve<ITaskSummary>({});
						} else {
							taskResult = encounteredTasks.get(commonKey);
							if (!taskResult) {
								const activeTask = this._activeTasks[dependencyTask.getMapKey()] ?? this._getInstances(dependencyTask).pop();
								taskResult = activeTask && this._getDependencyPromise(activeTask);
							}
						}
						if (!taskResult) {
							this._fireTaskEvent(TaskEvent.general(TaskEventKind.DependsOnStarted, task));
							taskResult = this._executeDependencyTask(dependencyTask, resolver, trigger, nextLiveDependencies, encounteredTasks, alreadyResolved);
						}
						encounteredTasks.set(commonKey, taskResult);
						promises.push(taskResult);
						if (task.configurationProperties.dependsOrder === DependsOrder.sequence) {
							const promiseResult = await taskResult;
							if (promiseResult.exitCode !== 0) {
								break;
							}
						}
					} else {
						this._log(nls.localize('dependencyFailed',
							'Couldn\'t resolve dependent task \'{0}\' in workspace folder \'{1}\'',
							Types.isString(dependency.task) ? dependency.task : JSON.stringify(dependency.task, undefined, 0),
							dependency.uri.toString()
						));
						this._showOutput();
					}
				}
			}

			return Promise.all(promises).then((summaries): Async.MaybePromise<ITaskSummary> => {
				for (const summary of summaries) {
					if (summary.exitCode !== 0) {
						return { exitCode: summary.exitCode };
					}
				}
				if ((ContributedTask.is(task) || CustomTask.is(task)) && (task.command)) {
					if (this._isRerun) {
						return this._reexecuteCommand(task, trigger, alreadyResolved!);
					} else {
						return this._executeCommand(task, trigger, alreadyResolved!);
					}
				}
				return { exitCode: 0 };
			});
		}).finally(() => {
			delete this._activeTasks[mapKey];
		});
		const lastInstance = this._getInstances(task).pop();
		const count = lastInstance?.count ?? { count: 0 };
		count.count++;
		const activeTask = { task, promise, count };
		this._activeTasks[mapKey] = activeTask;
		return promise;
	}

	private _createInactiveDependencyPromise(task: Task): Promise<ITaskSummary> {
		return new Promise<ITaskSummary>(resolve => {
			const taskInactiveDisposable = this.onDidStateChange(taskEvent => {
				if ((taskEvent.kind === TaskEventKind.Inactive) && (taskEvent.__task === task)) {
					taskInactiveDisposable.dispose();
					resolve({ exitCode: 0 });
				}
			});
		});
	}

	private _taskHasErrors(task: Task): boolean {
		const taskMapKey = task.getMapKey();

		// Check if this task itself had errors
		if (this._taskErrors[taskMapKey]) {
			return true;
		}

		// Check if any tracked dependencies had errors
		const dependencies = this._taskDependencies[taskMapKey];
		if (dependencies) {
			for (const dependencyMapKey of dependencies) {
				if (this._taskErrors[dependencyMapKey]) {
					return true;
				}
			}
		}

		return false;
	}

	private _cleanupTaskTracking(task: Task): void {
		const taskMapKey = task.getMapKey();
		delete this._taskErrors[taskMapKey];
		delete this._taskDependencies[taskMapKey];
	}

	private _adoptConfigurationForDependencyTask(dependencyTask: Task, task: Task): void {
		if (dependencyTask.configurationProperties.icon) {
			dependencyTask.configurationProperties.icon.id ||= task.configurationProperties.icon?.id;
			dependencyTask.configurationProperties.icon.color ||= task.configurationProperties.icon?.color;
		} else {
			dependencyTask.configurationProperties.icon = task.configurationProperties.icon;
		}
	}

	private async _getDependencyPromise(task: IActiveTerminalData): Promise<ITaskSummary> {
		if (!task.task.configurationProperties.isBackground) {
			return task.promise;
		}
		if (!task.task.configurationProperties.problemMatchers || task.task.configurationProperties.problemMatchers.length === 0) {
			return task.promise;
		}
		if (task.state === TaskEventKind.Inactive) {
			return { exitCode: 0 };
		}
		return this._createInactiveDependencyPromise(task.task);
	}

	private async _executeDependencyTask(task: Task, resolver: ITaskResolver, trigger: string, liveDependencies: Set<string>, encounteredTasks: Map<string, Promise<ITaskSummary>>, alreadyResolved?: Map<string, string>): Promise<ITaskSummary> {
		// If the task is a background task with a watching problem matcher, we don't wait for the whole task to finish,
		// just for the problem matcher to go inactive.
		if (!task.configurationProperties.isBackground) {
			return this._executeTask(task, resolver, trigger, liveDependencies, encounteredTasks, alreadyResolved);
		}

		const inactivePromise = this._createInactiveDependencyPromise(task);
		return Promise.race([inactivePromise, this._executeTask(task, resolver, trigger, liveDependencies, encounteredTasks, alreadyResolved)]);
	}

	private async _resolveAndFindExecutable(systemInfo: ITaskSystemInfo | undefined, workspaceFolder: IWorkspaceFolder | undefined, task: CustomTask | ContributedTask, cwd: string | undefined, envPath: string | undefined): Promise<string> {
		const command = await this._configurationResolverService.resolveAsync(workspaceFolder, CommandString.value(task.command.name!));
		cwd = cwd ? await this._configurationResolverService.resolveAsync(workspaceFolder, cwd) : undefined;
		const delimiter = (await this._pathService.path).delimiter;
		const paths = envPath ? await Promise.all(envPath.split(delimiter).map(p => this._configurationResolverService.resolveAsync(workspaceFolder, p))) : undefined;
		const foundExecutable = await systemInfo?.findExecutable(command, cwd, paths);
		if (foundExecutable) {
			return foundExecutable;
		}
		if (path.isAbsolute(command)) {
			return command;
		}
		return path.join(cwd ?? '', command);
	}

	private _findUnresolvedVariables(variables: Set<string>, alreadyResolved: Map<string, string>): Set<string> {
		if (alreadyResolved.size === 0) {
			return variables;
		}
		const unresolved = new Set<string>();
		for (const variable of variables) {
			if (!alreadyResolved.has(variable.substring(2, variable.length - 1))) {
				unresolved.add(variable);
			}
		}
		return unresolved;
	}

	private _mergeMaps(mergeInto: Map<string, string>, mergeFrom: Map<string, string>) {
		for (const entry of mergeFrom) {
			if (!mergeInto.has(entry[0])) {
				mergeInto.set(entry[0], entry[1]);
			}
		}
	}

	private async _acquireInput(taskSystemInfo: ITaskSystemInfo | undefined, workspaceFolder: IWorkspaceFolder | undefined, task: CustomTask | ContributedTask, variables: Set<string>, alreadyResolved: Map<string, string>): Promise<IResolvedVariables | undefined> {
		const resolved = await this._resolveVariablesFromSet(taskSystemInfo, workspaceFolder, task, variables, alreadyResolved);
		this._fireTaskEvent(TaskEvent.general(TaskEventKind.AcquiredInput, task));
		return resolved;
	}

	private _resolveVariablesFromSet(taskSystemInfo: ITaskSystemInfo | undefined, workspaceFolder: IWorkspaceFolder | undefined, task: CustomTask | ContributedTask, variables: Set<string>, alreadyResolved: Map<string, string>): Promise<IResolvedVariables | undefined> {
		const isProcess = task.command && task.command.runtime === RuntimeType.Process;
		const options = task.command && task.command.options ? task.command.options : undefined;
		const cwd = options ? options.cwd : undefined;
		let envPath: string | undefined = undefined;
		if (options && options.env) {
			for (const key of Object.keys(options.env)) {
				if (key.toLowerCase() === 'path') {
					if (Types.isString(options.env[key])) {
						envPath = options.env[key];
					}
					break;
				}
			}
		}
		const unresolved = this._findUnresolvedVariables(variables, alreadyResolved);
		let resolvedVariables: Promise<IResolvedVariables | undefined>;
		if (taskSystemInfo && workspaceFolder) {
			const resolveSet: IResolveSet = {
				variables: unresolved
			};

			if (taskSystemInfo.platform === Platform.Platform.Windows && isProcess) {
				resolveSet.process = { name: CommandString.value(task.command.name!) };
				if (cwd) {
					resolveSet.process.cwd = cwd;
				}
				if (envPath) {
					resolveSet.process.path = envPath;
				}
			}
			resolvedVariables = taskSystemInfo.resolveVariables(workspaceFolder, resolveSet, TaskSourceKind.toConfigurationTarget(task._source.kind)).then(async (resolved) => {
				if (!resolved) {
					return undefined;
				}

				this._mergeMaps(alreadyResolved, resolved.variables);
				resolved.variables = new Map(alreadyResolved);
				if (isProcess) {
					let process = CommandString.value(task.command.name!);
					if (taskSystemInfo.platform === Platform.Platform.Windows) {
						process = await this._resolveAndFindExecutable(taskSystemInfo, workspaceFolder, task, cwd, envPath);
					}
					resolved.variables.set(TerminalTaskSystem.ProcessVarName, process);
				}
				return resolved;
			});
			return resolvedVariables;
		} else {
			const variablesArray = new Array<string>();
			unresolved.forEach(variable => variablesArray.push(variable));

			return new Promise<IResolvedVariables | undefined>((resolve, reject) => {
				this._configurationResolverService.resolveWithInteraction(workspaceFolder, variablesArray, 'tasks', undefined, TaskSourceKind.toConfigurationTarget(task._source.kind)).then(async (resolvedVariablesMap: Map<string, string> | undefined) => {
					if (resolvedVariablesMap) {
						this._mergeMaps(alreadyResolved, resolvedVariablesMap);
						resolvedVariablesMap = new Map(alreadyResolved);
						if (isProcess) {
							let processVarValue: string;
							if (Platform.isWindows) {
								processVarValue = await this._resolveAndFindExecutable(taskSystemInfo, workspaceFolder, task, cwd, envPath);
							} else {
								processVarValue = await this._configurationResolverService.resolveAsync(workspaceFolder, CommandString.value(task.command.name!));
							}
							resolvedVariablesMap.set(TerminalTaskSystem.ProcessVarName, processVarValue);
						}
						const resolvedVariablesResult: IResolvedVariables = {
							variables: resolvedVariablesMap,
						};
						resolve(resolvedVariablesResult);
					} else {
						resolve(undefined);
					}
				}, reason => {
					reject(reason);
				});
			});
		}
	}

	private _executeCommand(task: CustomTask | ContributedTask, trigger: string, alreadyResolved: Map<string, string>): Promise<ITaskSummary> {
		const taskWorkspaceFolder = task.getWorkspaceFolder();
		let workspaceFolder: IWorkspaceFolder | undefined;
		if (taskWorkspaceFolder) {
			workspaceFolder = this._currentTask.workspaceFolder = taskWorkspaceFolder;
		} else {
			const folders = this._contextService.getWorkspace().folders;
			workspaceFolder = folders.length > 0 ? folders[0] : undefined;
		}
		const systemInfo: ITaskSystemInfo | undefined = this._currentTask.systemInfo = this._taskSystemInfoResolver(workspaceFolder);

		const variables = new Set<string>();
		this._collectTaskVariables(variables, task);
		const resolvedVariables = this._acquireInput(systemInfo, workspaceFolder, task, variables, alreadyResolved);

		return resolvedVariables.then((resolvedVariables) => {
			if (resolvedVariables && !this._isTaskEmpty(task)) {
				this._currentTask.resolvedVariables = resolvedVariables;
				return this._executeInTerminal(task, trigger, new VariableResolver(workspaceFolder, systemInfo, resolvedVariables.variables, this._configurationResolverService), workspaceFolder);
			} else {
				// Allows the taskExecutions array to be updated in the extension host
				this._fireTaskEvent(TaskEvent.general(TaskEventKind.End, task));
				return Promise.resolve({ exitCode: 0 });
			}
		}, reason => {
			return Promise.reject(reason);
		});
	}

	private _isTaskEmpty(task: CustomTask | ContributedTask): boolean {
		const isCustomExecution = (task.command.runtime === RuntimeType.CustomExecution);
		return !((task.command !== undefined) && task.command.runtime && (isCustomExecution || (task.command.name !== undefined)));
	}

	private _reexecuteCommand(task: CustomTask | ContributedTask, trigger: string, alreadyResolved: Map<string, string>): Promise<ITaskSummary> {
		const lastTask = this._lastTask;
		if (!lastTask) {
			return Promise.reject(new Error('No task previously run'));
		}
		const workspaceFolder = this._currentTask.workspaceFolder = lastTask.workspaceFolder;
		const variables = new Set<string>();
		this._collectTaskVariables(variables, task);

		// Check that the task hasn't changed to include new variables
		let hasAllVariables = true;
		variables.forEach(value => {
			if (value.substring(2, value.length - 1) in lastTask.getVerifiedTask().resolvedVariables) {
				hasAllVariables = false;
			}
		});

		if (!hasAllVariables) {
			return this._acquireInput(lastTask.getVerifiedTask().systemInfo, lastTask.getVerifiedTask().workspaceFolder, task, variables, alreadyResolved).then((resolvedVariables) => {
				if (!resolvedVariables) {
					// Allows the taskExecutions array to be updated in the extension host
					this._fireTaskEvent(TaskEvent.general(TaskEventKind.End, task));
					return { exitCode: 0 };
				}
				this._currentTask.resolvedVariables = resolvedVariables;
				return this._executeInTerminal(task, trigger, new VariableResolver(lastTask.getVerifiedTask().workspaceFolder, lastTask.getVerifiedTask().systemInfo, resolvedVariables.variables, this._configurationResolverService), workspaceFolder);
			}, reason => {
				return Promise.reject(reason);
			});
		} else {
			this._currentTask.resolvedVariables = lastTask.getVerifiedTask().resolvedVariables;
			return this._executeInTerminal(task, trigger, new VariableResolver(lastTask.getVerifiedTask().workspaceFolder, lastTask.getVerifiedTask().systemInfo, lastTask.getVerifiedTask().resolvedVariables.variables, this._configurationResolverService), workspaceFolder);
		}
	}

	private async _executeInTerminal(task: CustomTask | ContributedTask, trigger: string, resolver: VariableResolver, workspaceFolder: IWorkspaceFolder | undefined): Promise<ITaskSummary> {
		let terminal: ITerminalInstance | undefined = undefined;
		let error: TaskError | undefined = undefined;
		let promise: Promise<ITaskSummary> | undefined = undefined;
		if (task.configurationProperties.isBackground) {
			const problemMatchers = await this._resolveMatchers(resolver, task.configurationProperties.problemMatchers);
			const watchingProblemMatcher = new WatchingProblemCollector(problemMatchers, this._markerService, this._modelService, this._fileService);
			if ((problemMatchers.length > 0) && !watchingProblemMatcher.isWatching()) {
				this._appendOutput(nls.localize('TerminalTaskSystem.nonWatchingMatcher', 'Task {0} is a background task but uses a problem matcher without a background pattern', task._label));
				this._showOutput();
			}
			const toDispose = new DisposableStore();
			let eventCounter: number = 0;
			const mapKey = task.getMapKey();
			toDispose.add(watchingProblemMatcher.onDidStateChange((event) => {
				if (event.kind === ProblemCollectorEventKind.BackgroundProcessingBegins) {
					eventCounter++;
					this._busyTasks[mapKey] = task;
					this._fireTaskEvent(TaskEvent.general(TaskEventKind.Active, task, terminal?.instanceId));
				} else if (event.kind === ProblemCollectorEventKind.BackgroundProcessingEnds) {
					eventCounter--;
					if (this._busyTasks[mapKey]) {
						delete this._busyTasks[mapKey];
					}
					this._fireTaskEvent(TaskEvent.inactive(task, terminal?.instanceId, this._takeTaskDuration(terminal?.instanceId)));
					if (eventCounter === 0) {
						if ((watchingProblemMatcher.numberOfMatches > 0) && watchingProblemMatcher.maxMarkerSeverity &&
							(watchingProblemMatcher.maxMarkerSeverity >= MarkerSeverity.Error)) {
							this._taskErrors[task.getMapKey()] = true;
							this._fireTaskEvent(TaskEvent.general(TaskEventKind.ProblemMatcherFoundErrors, task, terminal?.instanceId));
							const reveal = task.command.presentation!.reveal;
							const revealProblems = task.command.presentation!.revealProblems;
							if (revealProblems === RevealProblemKind.OnProblem) {
								this._viewsService.openView(Markers.MARKERS_VIEW_ID, true);
							} else if (reveal === RevealKind.Silent) {
								this._terminalService.setActiveInstance(terminal!);
								this._terminalGroupService.showPanel(false);
							}
						} else {
							this._fireTaskEvent(TaskEvent.problemMatcherEnded(task, this._taskHasErrors(task), terminal?.instanceId));
						}
					}
				}
			}));
			watchingProblemMatcher.aboutToStart();
			let delayer: Async.Delayer<void> | undefined = undefined;
			[terminal, error] = await this._createTerminal(task, resolver, workspaceFolder);

			if (error) {
				return Promise.reject(new Error((<TaskError>error).message));
			}
			if (!terminal) {
				return Promise.reject(new Error(`Failed to create terminal for task ${task._label}`));
			}
			this._terminalStatusManager.addTerminal(task, terminal, watchingProblemMatcher);
			this._taskProblemMonitor.addTerminal(terminal, watchingProblemMatcher);
			let processStartedSignaled = false;
			terminal.processReady.then(() => {
				if (!processStartedSignaled) {
					this._fireTaskEvent(TaskEvent.processStarted(task, terminal!.instanceId, terminal!.processId!));
					processStartedSignaled = true;
				}
			}, (_error) => {
				this._logService.error('Task terminal process never got ready');
			});
			this._taskStartTimes.set(terminal.instanceId, Date.now());
			this._fireTaskEvent(TaskEvent.start(task, terminal.instanceId, resolver.values));
			let onData: IDisposable | undefined;
			if (problemMatchers.length) {
				// this._fireTaskEvent(TaskEvent.general(TaskEventKind.ProblemMatcherStarted, task, terminal.instanceId));
				// prevent https://github.com/microsoft/vscode/issues/174511 from happening
				onData = terminal.onLineData((line) => {
					watchingProblemMatcher.processLine(line);
					if (!delayer) {
						delayer = new Async.Delayer(3000);
					}
					delayer.trigger(() => {
						watchingProblemMatcher.forceDelivery();
						delayer = undefined;
					});
				});
			}

			promise = new Promise<ITaskSummary>((resolve, reject) => {
				const onExit = terminal!.onExit((terminalLaunchResult) => {
					const exitCode = typeof terminalLaunchResult === 'number' ? terminalLaunchResult : terminalLaunchResult?.code;
					onData?.dispose();
					onExit.dispose();
					const key = task.getMapKey();
					if (this._busyTasks[mapKey]) {
						delete this._busyTasks[mapKey];
					}
					this._removeFromActiveTasks(task);
					this._fireTaskEvent(TaskEvent.changed());
					if (terminalLaunchResult !== undefined) {
						// Only keep a reference to the terminal if it is not being disposed.
						switch (task.command.presentation!.panel) {
							case PanelKind.Dedicated:
								this._sameTaskTerminals[key] = terminal!.instanceId.toString();
								break;
							case PanelKind.Shared:
								this._idleTaskTerminals.set(key, terminal!.instanceId.toString(), Touch.AsOld);
								break;
						}
					}
					const reveal = task.command.presentation!.reveal;
					if ((reveal === RevealKind.Silent) && ((exitCode !== 0) || (watchingProblemMatcher.numberOfMatches > 0) && watchingProblemMatcher.maxMarkerSeverity &&
						(watchingProblemMatcher.maxMarkerSeverity >= MarkerSeverity.Error))) {
						try {
							this._terminalService.setActiveInstance(terminal!);
							this._terminalGroupService.showPanel(false);
						} catch (e) {
							// If the terminal has already been disposed, then setting the active instance will fail. #99828
							// There is nothing else to do here.
						}
					}
					watchingProblemMatcher.done();
					watchingProblemMatcher.dispose();
					if (!processStartedSignaled) {
						this._fireTaskEvent(TaskEvent.processStarted(task, terminal!.instanceId, terminal!.processId!));
						processStartedSignaled = true;
					}
					const durationMs = this._takeTaskDuration(terminal!.instanceId);
					this._fireTaskEvent(TaskEvent.processEnded(task, terminal!.instanceId, exitCode, durationMs));

					for (let i = 0; i < eventCounter; i++) {
						this._fireTaskEvent(TaskEvent.inactive(task, terminal!.instanceId));
					}
					eventCounter = 0;
					this._fireTaskEvent(TaskEvent.general(TaskEventKind.End, task));
					toDispose.dispose();
					resolve({ exitCode: exitCode ?? undefined });
				});
			});
			if (trigger === Triggers.reconnect && !!terminal.xterm) {
				const bufferLines = [];
				const bufferReverseIterator = terminal.xterm.getBufferReverseIterator();
				const startRegex = new RegExp(watchingProblemMatcher.beginPatterns.map(pattern => pattern.source).join('|'));
				for (const nextLine of bufferReverseIterator) {
					bufferLines.push(nextLine);
					if (startRegex.test(nextLine)) {
						break;
					}
				}
				let delayer: Async.Delayer<void> | undefined = undefined;
				for (let i = bufferLines.length - 1; i >= 0; i--) {
					watchingProblemMatcher.processLine(bufferLines[i]);
					if (!delayer) {
						delayer = new Async.Delayer(3000);
					}
					delayer.trigger(() => {
						watchingProblemMatcher.forceDelivery();
						delayer = undefined;
					});
				}
			}
		} else {
			[terminal, error] = await this._createTerminal(task, resolver, workspaceFolder);

			if (error) {
				return Promise.reject(new Error((<TaskError>error).message));
			}
			if (!terminal) {
				return Promise.reject(new Error(`Failed to create terminal for task ${task._label}`));
			}

			this._taskStartTimes.set(terminal.instanceId, Date.now());
			this._fireTaskEvent(TaskEvent.start(task, terminal.instanceId, resolver.values));
			const mapKey = task.getMapKey();
			this._busyTasks[mapKey] = task;
			this._fireTaskEvent(TaskEvent.general(TaskEventKind.Active, task, terminal.instanceId));

			const problemMatchers = await this._resolveMatchers(resolver, task.configurationProperties.problemMatchers);
			const startStopProblemMatcher = new StartStopProblemCollector(problemMatchers, this._markerService, this._modelService, ProblemHandlingStrategy.Clean, this._fileService);
			this._terminalStatusManager.addTerminal(task, terminal, startStopProblemMatcher);
			this._taskProblemMonitor.addTerminal(terminal, startStopProblemMatcher);
			this._register(startStopProblemMatcher.onDidStateChange((event) => {
				if (event.kind === ProblemCollectorEventKind.BackgroundProcessingBegins) {
					this._fireTaskEvent(TaskEvent.general(TaskEventKind.ProblemMatcherStarted, task, terminal?.instanceId));
				} else if (event.kind === ProblemCollectorEventKind.BackgroundProcessingEnds) {
					if (startStopProblemMatcher.numberOfMatches && startStopProblemMatcher.maxMarkerSeverity && startStopProblemMatcher.maxMarkerSeverity >= MarkerSeverity.Error) {
						this._taskErrors[task.getMapKey()] = true;
						this._fireTaskEvent(TaskEvent.general(TaskEventKind.ProblemMatcherFoundErrors, task, terminal?.instanceId));
					} else {
						this._fireTaskEvent(TaskEvent.problemMatcherEnded(task, this._taskHasErrors(task), terminal?.instanceId));
					}
				}
			}));
			let processStartedSignaled = false;
			terminal.processReady.then(() => {
				if (!processStartedSignaled) {
					this._fireTaskEvent(TaskEvent.processStarted(task, terminal!.instanceId, terminal!.processId!));
					processStartedSignaled = true;
				}
			}, (_error) => {
				// The process never got ready. Need to think how to handle this.
			});

			const onData = terminal.onLineData((line) => {
				startStopProblemMatcher.processLine(line);
			});
			promise = new Promise<ITaskSummary>((resolve, reject) => {
				const onExit = terminal!.onExit((terminalLaunchResult) => {
					const exitCode = typeof terminalLaunchResult === 'number' ? terminalLaunchResult : terminalLaunchResult?.code;
					onExit.dispose();
					const key = task.getMapKey();
					this._removeFromActiveTasks(task);
					this._fireTaskEvent(TaskEvent.changed());
					if (terminalLaunchResult !== undefined) {
						// Only keep a reference to the terminal if it is not being disposed.
						switch (task.command.presentation!.panel) {
							case PanelKind.Dedicated:
								this._sameTaskTerminals[key] = terminal!.instanceId.toString();
								break;
							case PanelKind.Shared:
								this._idleTaskTerminals.set(key, terminal!.instanceId.toString(), Touch.AsOld);
								break;
						}
					}
					const reveal = task.command.presentation!.reveal;
					const revealProblems = task.command.presentation!.revealProblems;
					const revealProblemPanel = terminal && (revealProblems === RevealProblemKind.OnProblem) && (startStopProblemMatcher.numberOfMatches > 0);
					if (revealProblemPanel) {
						this._viewsService.openView(Markers.MARKERS_VIEW_ID);
					} else if (terminal && (reveal === RevealKind.Silent) && ((exitCode !== 0) || (startStopProblemMatcher.numberOfMatches > 0) && startStopProblemMatcher.maxMarkerSeverity &&
						(startStopProblemMatcher.maxMarkerSeverity >= MarkerSeverity.Error))) {
						try {
							this._terminalService.setActiveInstance(terminal);
							this._terminalGroupService.showPanel(false);
						} catch (e) {
							// If the terminal has already been disposed, then setting the active instance will fail. #99828
							// There is nothing else to do here.
						}
					}
					// Hack to work around #92868 until terminal is fixed.
					setTimeout(() => {
						onData.dispose();
						startStopProblemMatcher.done();
						startStopProblemMatcher.dispose();
					}, 100);
					if (!processStartedSignaled && terminal) {
						this._fireTaskEvent(TaskEvent.processStarted(task, terminal.instanceId, terminal.processId!));
						processStartedSignaled = true;
					}

					const durationMs = this._takeTaskDuration(terminal?.instanceId);
					this._fireTaskEvent(TaskEvent.processEnded(task, terminal?.instanceId, exitCode ?? undefined, durationMs));
					if (this._busyTasks[mapKey]) {
						delete this._busyTasks[mapKey];
					}
					this._fireTaskEvent(TaskEvent.inactive(task, terminal?.instanceId, durationMs));
					if (startStopProblemMatcher.numberOfMatches && startStopProblemMatcher.maxMarkerSeverity && startStopProblemMatcher.maxMarkerSeverity >= MarkerSeverity.Error) {
						this._taskErrors[task.getMapKey()] = true;
						this._fireTaskEvent(TaskEvent.general(TaskEventKind.ProblemMatcherFoundErrors, task, terminal?.instanceId));
					} else {
						this._fireTaskEvent(TaskEvent.problemMatcherEnded(task, this._taskHasErrors(task), terminal?.instanceId));
					}
					this._fireTaskEvent(TaskEvent.general(TaskEventKind.End, task, terminal?.instanceId));
					this._cleanupTaskTracking(task);
					resolve({ exitCode: exitCode ?? undefined });
				});
			});
		}

		const showProblemPanel = task.command.presentation && (task.command.presentation.revealProblems === RevealProblemKind.Always);
		if (showProblemPanel) {
			this._viewsService.openView(Markers.MARKERS_VIEW_ID);
		} else if (task.command.presentation && (task.command.presentation.focus || task.command.presentation.reveal === RevealKind.Always)) {
			this._terminalService.setActiveInstance(terminal);
			await this._terminalService.revealTerminal(terminal);
			if (task.command.presentation.focus) {
				this._terminalService.focusInstance(terminal);
			}
		}
		if (this._activeTasks[task.getMapKey()]) {
			this._activeTasks[task.getMapKey()].terminal = terminal;
		} else {
			this._logService.warn('No active tasks found for the terminal.');
		}
		this._fireTaskEvent(TaskEvent.changed());
		return promise;
	}

	private _takeTaskDuration(terminalId: number | undefined): number | undefined {
		if (terminalId === undefined) {
			return undefined;
		}
		const startTime = this._taskStartTimes.get(terminalId);
		if (startTime === undefined) {
			return undefined;
		}
		this._taskStartTimes.delete(terminalId);
		return Date.now() - startTime;
	}

	private _createTerminalName(task: CustomTask | ContributedTask): string {
		const needsFolderQualification = this._contextService.getWorkbenchState() === WorkbenchState.WORKSPACE;
		return needsFolderQualification ? task.getQualifiedLabel() : (task.configurationProperties.name || '');
	}

	private async _createShellLaunchConfig(task: CustomTask | ContributedTask, workspaceFolder: IWorkspaceFolder | undefined, variableResolver: VariableResolver, platform: Platform.Platform, options: CommandOptions, command: CommandString, args: CommandString[], waitOnExit: WaitOnExitValue, presentationOptions: IPresentationOptions): Promise<IShellLaunchConfig | undefined> {
		let shellLaunchConfig: IShellLaunchConfig;
		const isShellCommand = task.command.runtime === RuntimeType.Shell;
		const needsFolderQualification = this._contextService.getWorkbenchState() === WorkbenchState.WORKSPACE;
		const terminalName = this._createTerminalName(task);
		const type = TaskTerminalType;
		const originalCommand = task.command.name;
		let cwd: string | URI | undefined;
		if (options.cwd) {
			cwd = options.cwd;
			if (!path.isAbsolute(cwd)) {
				if (workspaceFolder && (workspaceFolder.uri.scheme === Schemas.file)) {
					cwd = path.join(workspaceFolder.uri.fsPath, cwd);
				}
			}
			// This must be normalized to the OS
			cwd = isUNC(cwd) ? cwd : resources.toLocalResource(URI.from({ scheme: Schemas.file, path: cwd }), this._environmentService.remoteAuthority, this._pathService.defaultUriScheme);
		}
		if (isShellCommand) {
			let os: Platform.OperatingSystem;
			switch (platform) {
				case Platform.Platform.Windows: os = Platform.OperatingSystem.Windows; break;
				case Platform.Platform.Mac: os = Platform.OperatingSystem.Macintosh; break;
				case Platform.Platform.Linux:
				default: os = Platform.OperatingSystem.Linux; break;
			}
			const defaultProfile = await this._terminalProfileResolverService.getDefaultProfile({
				allowAutomationShell: true,
				os,
				remoteAuthority: this._environmentService.remoteAuthority
			});
			let icon: URI | ThemeIcon | { light: URI; dark: URI } | undefined;
			if (task.configurationProperties.icon?.id) {
				icon = ThemeIcon.fromId(task.configurationProperties.icon.id);
			} else {
				const taskGroupKind = task.configurationProperties.group ? GroupKind.to(task.configurationProperties.group) : undefined;
				const kindId = typeof taskGroupKind === 'string' ? taskGroupKind : taskGroupKind?.kind;
				icon = kindId === 'test' ? ThemeIcon.fromId(Codicon.beaker.id) : defaultProfile.icon;
			}
			shellLaunchConfig = {
				name: terminalName,
				type,
				executable: defaultProfile.path,
				args: defaultProfile.args,
				env: { ...defaultProfile.env },
				icon,
				color: task.configurationProperties.icon?.color || undefined,
				waitOnExit
			};
			let shellSpecified: boolean = false;
			const shellOptions: IShellConfiguration | undefined = task.command.options && task.command.options.shell;
			if (shellOptions) {
				if (shellOptions.executable) {
					// Clear out the args so that we don't end up with mismatched args.
					if (shellOptions.executable !== shellLaunchConfig.executable) {
						shellLaunchConfig.args = undefined;
					}
					shellLaunchConfig.executable = await this._resolveVariable(variableResolver, shellOptions.executable);
					shellSpecified = true;
				}
				if (shellOptions.args) {
					shellLaunchConfig.args = await this._resolveVariables(variableResolver, shellOptions.args.slice());
				}
			}
			if (shellLaunchConfig.args === undefined) {
				shellLaunchConfig.args = [];
			}
			const shellArgs = Array.isArray(shellLaunchConfig.args) ? <string[]>shellLaunchConfig.args.slice(0) : [shellLaunchConfig.args];
			const toAdd: string[] = [];
			const basename = path.posix.basename((await this._pathService.fileURI(shellLaunchConfig.executable!)).path).toLowerCase();
			const commandLine = this._buildShellCommandLine(platform, basename, shellOptions, command, originalCommand, args);
			let windowsShellArgs: boolean = false;
			if (platform === Platform.Platform.Windows) {
				windowsShellArgs = true;
				// If we don't have a cwd, then the terminal uses the home dir.
				const userHome = await this._pathService.userHome();
				if (basename === 'cmd.exe' && ((options.cwd && isUNC(options.cwd)) || (!options.cwd && isUNC(userHome.fsPath)))) {
					return undefined;
				}
				if ((basename === 'powershell.exe') || (basename === 'pwsh.exe')) {
					if (!shellSpecified) {
						toAdd.push('-Command');
					}
				} else if ((basename === 'bash.exe') || (basename === 'zsh.exe')) {
					windowsShellArgs = false;
					if (!shellSpecified) {
						toAdd.push('-c');
					}
				} else if (basename === 'wsl.exe') {
					if (!shellSpecified) {
						toAdd.push('-e');
					}
				} else if (basename === 'nu.exe') {
					if (!shellSpecified) {
						toAdd.push('-c');
					}
				} else {
					if (!shellSpecified) {
						toAdd.push('/d', '/c');
					}
				}
			} else {
				if (!shellSpecified) {
					// Under Mac remove -l to not start it as a login shell.
					if (platform === Platform.Platform.Mac) {
						// Background on -l on osx https://github.com/microsoft/vscode/issues/107563
						// TODO: Handle by pulling the default terminal profile?
						// const osxShellArgs = this._configurationService.inspect(TerminalSettingId.ShellArgsMacOs);
						// if ((osxShellArgs.user === undefined) && (osxShellArgs.userLocal === undefined) && (osxShellArgs.userLocalValue === undefined)
						// 	&& (osxShellArgs.userRemote === undefined) && (osxShellArgs.userRemoteValue === undefined)
						// 	&& (osxShellArgs.userValue === undefined) && (osxShellArgs.workspace === undefined)
						// 	&& (osxShellArgs.workspaceFolder === undefined) && (osxShellArgs.workspaceFolderValue === undefined)
						// 	&& (osxShellArgs.workspaceValue === undefined)) {
						// 	const index = shellArgs.indexOf('-l');
						// 	if (index !== -1) {
						// 		shellArgs.splice(index, 1);
						// 	}
						// }
					}
					toAdd.push('-c');
				}
			}
			const combinedShellArgs = this._addAllArgument(toAdd, shellArgs);
			combinedShellArgs.push(commandLine);
			shellLaunchConfig.shellIntegrationNonce = generateUuid();
			const commandLineInfo = {
				commandLine,
				nonce: shellLaunchConfig.shellIntegrationNonce
			};
			shellLaunchConfig.args = windowsShellArgs ? combinedShellArgs.join(' ') : combinedShellArgs;
			if (task.command.presentation && task.command.presentation.echo) {
				if (needsFolderQualification && workspaceFolder) {
					const folder = cwd && typeof cwd === 'object' && 'path' in cwd ? path.basename(cwd.path) : workspaceFolder.name;
					shellLaunchConfig.initialText = this.taskShellIntegrationStartSequence(cwd) + formatMessageForTerminal(nls.localize({
						key: 'task.executingInFolder',
						comment: ['The workspace folder the task is running in', 'The task command line or label']

					}, 'Executing task in folder {0}: {1}', folder, commandLine), { excludeLeadingNewLine: true }) + this.getTaskShellIntegrationOutputSequence(commandLineInfo);
				} else {
					shellLaunchConfig.initialText = this.taskShellIntegrationStartSequence(cwd) + formatMessageForTerminal(nls.localize({
						key: 'task.executing.shellIntegration',
						comment: ['The task command line or label']
					}, 'Executing task: {0}', commandLine), { excludeLeadingNewLine: true }) + this.getTaskShellIntegrationOutputSequence(commandLineInfo);
				}
			} else {
				shellLaunchConfig.initialText = {
					text: this.taskShellIntegrationStartSequence(cwd) + this.getTaskShellIntegrationOutputSequence(commandLineInfo),
					trailingNewLine: false
				};
			}
		} else {
			const commandExecutable = (task.command.runtime !== RuntimeType.CustomExecution) ? CommandString.value(command) : undefined;
			const executable = !isShellCommand
				? await this._resolveVariable(variableResolver, await this._resolveVariable(variableResolver, '${' + TerminalTaskSystem.ProcessVarName + '}'))
				: commandExecutable;

			// When we have a process task there is no need to quote arguments. So we go ahead and take the string value.
			shellLaunchConfig = {
				name: terminalName,
				type,
				icon: task.configurationProperties.icon?.id ? ThemeIcon.fromId(task.configurationProperties.icon.id) : undefined,
				color: task.configurationProperties.icon?.color || undefined,
				executable: executable,
				args: args.map(a => Types.isString(a) ? a : a.value),
				waitOnExit
			};
			if (task.command.presentation && task.command.presentation.echo) {
				const getArgsToEcho = (args: Types.SingleOrMany<string> | undefined): string => {
					if (!args || args.length === 0) {
						return '';
					}
					if (Types.isString(args)) {
						return args;
					}
					return args.join(' ');
				};
				if (needsFolderQualification && workspaceFolder) {
					shellLaunchConfig.initialText = this.taskShellIntegrationStartSequence(cwd) + formatMessageForTerminal(nls.localize({
						key: 'task.executingInFolder',
						comment: ['The workspace folder the task is running in', 'The task command line or label']
					}, 'Executing task in folder {0}: {1}', workspaceFolder.name, `${shellLaunchConfig.executable} ${getArgsToEcho(shellLaunchConfig.args)}`), { excludeLeadingNewLine: true }) + this.getTaskShellIntegrationOutputSequence(undefined);
				} else {
					shellLaunchConfig.initialText = this.taskShellIntegrationStartSequence(cwd) + formatMessageForTerminal(nls.localize({
						key: 'task.executing.shell-integration',
						comment: ['The task command line or label']
					}, 'Executing task: {0}', `${shellLaunchConfig.executable} ${getArgsToEcho(shellLaunchConfig.args)}`), { excludeLeadingNewLine: true }) + this.getTaskShellIntegrationOutputSequence(undefined);
				}
			} else {
				shellLaunchConfig.initialText = {
					text: this.taskShellIntegrationStartSequence(cwd) + this.getTaskShellIntegrationOutputSequence(undefined),
					trailingNewLine: false
				};
			}
		}

		if (cwd) {
			shellLaunchConfig.cwd = cwd;
		}
		if (options.env) {
			if (shellLaunchConfig.env) {
				shellLaunchConfig.env = { ...shellLaunchConfig.env, ...options.env };
			} else {
				shellLaunchConfig.env = options.env;
			}
		}
		shellLaunchConfig.isFeatureTerminal = true;
		shellLaunchConfig.useShellEnvironment = true;
		shellLaunchConfig.tabActions = this._terminalTabActions;
		return shellLaunchConfig;
	}

	private _addAllArgument(shellCommandArgs: string[], configuredShellArgs: string[]): string[] {
		const combinedShellArgs: string[] = Objects.deepClone(configuredShellArgs);
		shellCommandArgs.forEach(element => {
			const shouldAddShellCommandArg = configuredShellArgs.every((arg, index) => {
				if ((arg.toLowerCase() === element) && (configuredShellArgs.length > index + 1)) {
					// We can still add the argument, but only if not all of the following arguments begin with "-".
					return !configuredShellArgs.slice(index + 1).every(testArg => testArg.startsWith('-'));
				} else {
					return arg.toLowerCase() !== element;
				}
			});
			if (shouldAddShellCommandArg) {
				combinedShellArgs.push(element);
			}
		});
		return combinedShellArgs;
	}

	private async _reconnectToTerminal(task: Task): Promise<ITerminalInstance | undefined> {
		const reconnectedInstances = this._terminalService.instances.filter(e => e.reconnectionProperties?.ownerId === TaskTerminalType);
		return reconnectedInstances.find(e => getReconnectionData(e)?.lastTask === task.getCommonTaskId());
	}

	private async _doCreateTerminal(task: Task, group: string | undefined, launchConfigs: IShellLaunchConfig): Promise<ITerminalInstance> {
		const reconnectedTerminal = await this._reconnectToTerminal(task);
		const onDisposed = (terminal: ITerminalInstance) => this._fireTaskEvent(TaskEvent.terminated(task, terminal.instanceId, terminal.exitReason));
		if (reconnectedTerminal) {
			if ('command' in task && task.command.presentation) {
				reconnectedTerminal.waitOnExit = getWaitOnExitValue(task.command.presentation, task.configurationProperties);
			}
			this._register(reconnectedTerminal.onDisposed(onDisposed));
			this._logService.trace('reconnected to task and terminal', task._id);
			return reconnectedTerminal;
		}
		if (group) {
			// Try to find an existing terminal to split.
			// Even if an existing terminal is found, the split can fail if the terminal width is too small.
			for (const terminal of Object.values(this._terminals)) {
				if (terminal.group === group) {
					this._logService.trace(`Found terminal to split for group ${group}`);
					const originalInstance = terminal.terminal;
					const result = await this._terminalService.createTerminal({ location: { parentTerminal: originalInstance }, config: launchConfigs });
					this._register(result.onDisposed(onDisposed));
					if (result) {
						return result;
					}
				}
			}
			this._logService.trace(`No terminal found to split for group ${group}`);
		}
		// Either no group is used, no terminal with the group exists or splitting an existing terminal failed.
		const createdTerminal = await this._terminalService.createTerminal({ config: launchConfigs });
		this._register(createdTerminal.onDisposed(onDisposed));
		return createdTerminal;
	}

	private _reconnectToTerminals(): void {
		if (this._hasReconnected) {
			this._logService.trace(`Already reconnected to terminals, so returning`);
			return;
		}
		const reconnectedInstances = this._terminalService.instances.filter(e => e.reconnectionProperties?.ownerId === TaskTerminalType);
		this._logService.trace(`Attempting reconnection of ${reconnectedInstances.length} terminals`);
		if (!reconnectedInstances.length) {
			this._logService.trace(`No terminals to reconnect to so returning`);
		} else {
			for (const terminal of reconnectedInstances) {
				const data = getReconnectionData(terminal) as IReconnectionTaskData | undefined;
				if (data) {
					const terminalData = { lastTask: data.lastTask, group: data.group, terminal, shellIntegrationNonce: data.shellIntegrationNonce };
					this._terminals[terminal.instanceId] = terminalData;
					this._logService.trace('Reconnecting to task terminal', terminalData.lastTask, terminal.instanceId);
				}
			}
		}
		this._hasReconnected = true;
	}

	private _deleteTaskAndTerminal(terminal: ITerminalInstance, terminalData: ITerminalData): void {
		delete this._terminals[terminal.instanceId];
		delete this._sameTaskTerminals[terminalData.lastTask];
		this._idleTaskTerminals.delete(terminalData.lastTask);
		// Delete the task now as a work around for cases when the onExit isn't fired.
		// This can happen if the terminal wasn't shutdown with an "immediate" flag and is expected.
		// For correct terminal re-use, the task needs to be deleted immediately.
		// Note that this shouldn't be a problem anymore since user initiated terminal kills are now immediate.
		const mapKey = terminalData.lastTask;
		this._removeFromActiveTasks(mapKey);
		if (this._busyTasks[mapKey]) {
			delete this._busyTasks[mapKey];
		}
	}

	private async _createTerminal(task: CustomTask | ContributedTask, resolver: VariableResolver, workspaceFolder: IWorkspaceFolder | undefined): Promise<[ITerminalInstance | undefined, TaskError | undefined]> {
		const platform = resolver.taskSystemInfo ? resolver.taskSystemInfo.platform : Platform.platform;
		const options = await this._resolveOptions(resolver, task.command.options);
		const presentationOptions = task.command.presentation;

		if (!presentationOptions) {
			throw new Error('Task presentation options should not be undefined here.');
		}
		const waitOnExit = getWaitOnExitValue(presentationOptions, task.configurationProperties);

		let command: CommandString | undefined;
		let args: CommandString[] | undefined;
		let launchConfigs: IShellLaunchConfig | undefined;

		if (task.command.runtime === RuntimeType.CustomExecution) {
			this._currentTask.shellLaunchConfig = launchConfigs = {
				customPtyImplementation: (id, cols, rows) => new TerminalProcessExtHostProxy(id, cols, rows, this._terminalService),
				waitOnExit,
				name: this._createTerminalName(task),
				initialText: task.command.presentation && task.command.presentation.echo ? formatMessageForTerminal(nls.localize({
					key: 'task.executing',
					comment: ['The task command line or label']
				}, 'Executing task: {0}', task._label), { excludeLeadingNewLine: true }) : undefined,
				isFeatureTerminal: true,
				icon: task.configurationProperties.icon?.id ? ThemeIcon.fromId(task.configurationProperties.icon.id) : undefined,
				color: task.configurationProperties.icon?.color || undefined,
			};
		} else {
			const resolvedResult: { command: CommandString; args: CommandString[] } = await this._resolveCommandAndArgs(resolver, task.command);
			command = resolvedResult.command;
			args = resolvedResult.args;

			this._currentTask.shellLaunchConfig = launchConfigs = await this._createShellLaunchConfig(task, workspaceFolder, resolver, platform, options, command, args, waitOnExit, presentationOptions);
			if (launchConfigs === undefined) {
				return [undefined, new TaskError(Severity.Error, nls.localize('TerminalTaskSystem', 'Can\'t execute a shell command on an UNC drive using cmd.exe.'), TaskErrors.UnknownError)];
			}
		}
		const prefersSameTerminal = presentationOptions.panel === PanelKind.Dedicated;
		const allowsSharedTerminal = presentationOptions.panel === PanelKind.Shared;
		const group = presentationOptions.group;

		const taskKey = task.getMapKey();
		let terminalToReuse: ITerminalData | undefined;
		if (prefersSameTerminal) {
			const terminalId = this._sameTaskTerminals[taskKey];
			if (terminalId) {
				terminalToReuse = this._terminals[terminalId];
				delete this._sameTaskTerminals[taskKey];
			}
		} else if (allowsSharedTerminal) {
			// Always allow to reuse the terminal previously used by the same task.
			let terminalId = this._idleTaskTerminals.remove(taskKey);
			if (!terminalId) {
				// There is no idle terminal which was used by the same task.
				// Search for any idle terminal used previously by a task of the same group
				// (or, if the task has no group, a terminal used by a task without group).
				for (const taskId of this._idleTaskTerminals.keys()) {
					const idleTerminalId = this._idleTaskTerminals.get(taskId)!;
					if (idleTerminalId && this._terminals[idleTerminalId] && this._terminals[idleTerminalId].group === group) {
						terminalId = this._idleTaskTerminals.remove(taskId);
						break;
					}
				}
			}
			if (terminalId) {
				terminalToReuse = this._terminals[terminalId];
			}
		}
		if (terminalToReuse) {
			if (!launchConfigs) {
				throw new Error('Task shell launch configuration should not be undefined here.');
			}

			terminalToReuse.terminal.scrollToBottom();
			if (task.configurationProperties.isBackground) {
				launchConfigs.reconnectionProperties = { ownerId: TaskTerminalType, data: { lastTask: task.getCommonTaskId(), group, label: task._label, id: task._id } };
			}
			// HACK: Rewrite the nonce in initialText only for reused terminals, this ensures the
			// command line sequence reports the correct nonce and becomes trusted as a result.
			if (terminalToReuse.shellIntegrationNonce) {
				if (Types.isString(launchConfigs.initialText) && launchConfigs.shellIntegrationNonce) {
					launchConfigs.initialText = launchConfigs.initialText.replace(launchConfigs.shellIntegrationNonce, terminalToReuse.shellIntegrationNonce);
				}
			}
			await terminalToReuse.terminal.reuseTerminal(launchConfigs);

			if (task.command.presentation && task.command.presentation.clear) {
				terminalToReuse.terminal.clearBuffer();
			}
			this._terminals[terminalToReuse.terminal.instanceId.toString()].lastTask = taskKey;
			return [terminalToReuse.terminal, undefined];
		}

		this._terminalCreationQueue = this._terminalCreationQueue.then(() => this._doCreateTerminal(task, group, launchConfigs));
		const terminal: ITerminalInstance = (await this._terminalCreationQueue)!;
		if (task.configurationProperties.isBackground) {
			terminal.shellLaunchConfig.reconnectionProperties = { ownerId: TaskTerminalType, data: { lastTask: task.getCommonTaskId(), group, label: task._label, id: task._id } };
		}
		const terminalKey = terminal.instanceId.toString();
		const terminalData = { terminal: terminal, lastTask: taskKey, group, shellIntegrationNonce: terminal.shellLaunchConfig.shellIntegrationNonce };
		const onDisposedListener = this._register(terminal.onDisposed(() => {
			this._deleteTaskAndTerminal(terminal, terminalData);
			onDisposedListener.dispose();
		}));
		this._terminals[terminalKey] = terminalData;
		terminal.shellLaunchConfig.tabActions = this._terminalTabActions;
		return [terminal, undefined];
	}

	private _buildShellCommandLine(platform: Platform.Platform, shellExecutable: string, shellOptions: IShellConfiguration | undefined, command: CommandString, originalCommand: CommandString | undefined, args: CommandString[]): string {
		const basename = path.parse(shellExecutable).name.toLowerCase();
		const shellQuoteOptions = this._getQuotingOptions(basename, shellOptions, platform);

		function needsQuotes(value: string): boolean {
			if (value.length >= 2) {
				const first = value[0] === shellQuoteOptions.strong ? shellQuoteOptions.strong : value[0] === shellQuoteOptions.weak ? shellQuoteOptions.weak : undefined;
				if (first === value[value.length - 1]) {
					return false;
				}
			}
			let quote: string | undefined;
			for (let i = 0; i < value.length; i++) {
				// We found the end quote.
				const ch = value[i];
				if (ch === quote) {
					quote = undefined;
				} else if (quote !== undefined) {
					// skip the character. We are quoted.
					continue;
				} else if (ch === shellQuoteOptions.escape) {
					// Skip the next character
					i++;
				} else if (ch === shellQuoteOptions.strong || ch === shellQuoteOptions.weak) {
					quote = ch;
				} else if (ch === ' ') {
					return true;
				}
			}
			return false;
		}

		function quote(value: string, kind: ShellQuoting): [string, boolean] {
			if (kind === ShellQuoting.Strong && shellQuoteOptions.strong) {
				return [shellQuoteOptions.strong + value + shellQuoteOptions.strong, true];
			} else if (kind === ShellQuoting.Weak && shellQuoteOptions.weak) {
				return [shellQuoteOptions.weak + value + shellQuoteOptions.weak, true];
			} else if (kind === ShellQuoting.Escape && shellQuoteOptions.escape) {
				if (Types.isString(shellQuoteOptions.escape)) {
					return [value.replace(/ /g, shellQuoteOptions.escape + ' '), true];
				} else {
					const buffer: string[] = [];
					for (const ch of shellQuoteOptions.escape.charsToEscape) {
						buffer.push(`\\${ch}`);
					}
					const regexp: RegExp = new RegExp('[' + buffer.join(',') + ']', 'g');
					const escapeChar = shellQuoteOptions.escape.escapeChar;
					return [value.replace(regexp, (match) => escapeChar + match), true];
				}
			}
			return [value, false];
		}

		function quoteIfNecessary(value: CommandString): [string, boolean] {
			if (Types.isString(value)) {
				if (needsQuotes(value)) {
					return quote(value, ShellQuoting.Strong);
				} else {
					return [value, false];
				}
			} else {
				return quote(value.value, value.quoting);
			}
		}

		// If we have no args and the command is a string then use the command to stay backwards compatible with the old command line
		// model. To allow variable resolving with spaces we do continue if the resolved value is different than the original one
		// and the resolved one needs quoting.
		if ((!args || args.length === 0) && Types.isString(command) && (command === originalCommand as string || needsQuotes(originalCommand as string))) {
			return command;
		}

		const result: string[] = [];
		let commandQuoted = false;
		let argQuoted = false;
		let value: string;
		let quoted: boolean;
		[value, quoted] = quoteIfNecessary(command);
		result.push(value);
		commandQuoted = quoted;
		for (const arg of args) {
			[value, quoted] = quoteIfNecessary(arg);
			result.push(value);
			argQuoted = argQuoted || quoted;
		}

		let commandLine = result.join(' ');
		// There are special rules quoted command line in cmd.exe
		if (platform === Platform.Platform.Windows) {
			if (basename === 'cmd' && commandQuoted && argQuoted) {
				commandLine = '"' + commandLine + '"';
			} else if ((basename === 'powershell' || basename === 'pwsh') && commandQuoted) {
				commandLine = '& ' + commandLine;
			}
		}

		return commandLine;
	}

	private _getQuotingOptions(shellBasename: string, shellOptions: IShellConfiguration | undefined, platform: Platform.Platform): IShellQuotingOptions {
		if (shellOptions && shellOptions.quoting) {
			return shellOptions.quoting;
		}
		return TerminalTaskSystem._shellQuotes[shellBasename] || TerminalTaskSystem._osShellQuotes[Platform.PlatformToString(platform)];
	}

	private _collectTaskVariables(variables: Set<string>, task: CustomTask | ContributedTask): void {
		if (task.command && task.command.name) {
			this._collectCommandVariables(variables, task.command, task);
		}
		this._collectMatcherVariables(variables, task.configurationProperties.problemMatchers);

		if (task.command.runtime === RuntimeType.CustomExecution && (CustomTask.is(task) || ContributedTask.is(task))) {
			let definition: any;
			if (CustomTask.is(task)) {
				definition = task._source.config.element;
			} else {
				definition = Objects.deepClone(task.defines);
				delete definition._key;
				delete definition.type;
			}
			this._collectDefinitionVariables(variables, definition);
		}
	}

	private _collectDefinitionVariables(variables: Set<string>, definition: any): void {
		if (Types.isString(definition)) {
			this._collectVariables(variables, definition);
		} else if (Array.isArray(definition)) {
			definition.forEach((element: any) => this._collectDefinitionVariables(variables, element));
		} else if (Types.isObject(definition)) {
			for (const key in definition) {
				this._collectDefinitionVariables(variables, definition[key]);
			}
		}
	}

	private _collectCommandVariables(variables: Set<string>, command: ICommandConfiguration, task: CustomTask | ContributedTask): void {
		// The custom execution should have everything it needs already as it provided
		// the callback.
		if (command.runtime === RuntimeType.CustomExecution) {
			return;
		}

		if (command.name === undefined) {
			throw new Error('Command name should never be undefined here.');
		}
		this._collectVariables(variables, command.name);
		command.args?.forEach(arg => this._collectVariables(variables, arg));
		// Try to get a scope.
		const scope = (<IExtensionTaskSource>task._source).scope;
		if (scope !== TaskScope.Global) {
			variables.add('${workspaceFolder}');
		}
		if (command.options) {
			const options = command.options;
			if (options.cwd) {
				this._collectVariables(variables, options.cwd);
			}
			const optionsEnv = options.env;
			if (optionsEnv) {
				Object.keys(optionsEnv).forEach((key) => {
					const value: any = optionsEnv[key];
					if (Types.isString(value)) {
						this._collectVariables(variables, value);
					}
				});
			}
			if (options.shell) {
				if (options.shell.executable) {
					this._collectVariables(variables, options.shell.executable);
				}
				options.shell.args?.forEach(arg => this._collectVariables(variables, arg));
			}
		}
	}

	private _collectMatcherVariables(variables: Set<string>, values: Array<string | ProblemMatcher> | undefined): void {
		if (values === undefined || values === null || values.length === 0) {
			return;
		}
		values.forEach((value) => {
			let matcher: ProblemMatcher;
			if (Types.isString(value)) {
				if (value[0] === '$') {
					matcher = ProblemMatcherRegistry.get(value.substring(1));
				} else {
					matcher = ProblemMatcherRegistry.get(value);
				}
			} else {
				matcher = value;
			}
			if (matcher && matcher.filePrefix) {
				if (Types.isString(matcher.filePrefix)) {
					this._collectVariables(variables, matcher.filePrefix);
				} else {
					for (const fp of [...asArray(matcher.filePrefix.include || []), ...asArray(matcher.filePrefix.exclude || [])]) {
						this._collectVariables(variables, fp);
					}
				}
			}
		});
	}

	private _collectVariables(variables: Set<string>, value: string | CommandString): void {
		const string: string = Types.isString(value) ? value : value.value;
		const r = /\$\{(.*?)\}/g;
		let matches: RegExpExecArray | null;
		do {
			matches = r.exec(string);
			if (matches) {
				variables.add(matches[0]);
			}
		} while (matches);
	}

	private async _resolveCommandAndArgs(resolver: VariableResolver, commandConfig: ICommandConfiguration): Promise<{ command: CommandString; args: CommandString[] }> {
		// First we need to use the command args:
		let args: CommandString[] = commandConfig.args ? commandConfig.args.slice() : [];
		args = await this._resolveVariables(resolver, args);
		const command: CommandString = await this._resolveVariable(resolver, commandConfig.name);
		return { command, args };
	}

	private async _resolveVariables(resolver: VariableResolver, value: string[]): Promise<string[]>;
	private async _resolveVariables(resolver: VariableResolver, value: CommandString[]): Promise<CommandString[]>;
	private async _resolveVariables(resolver: VariableResolver, value: CommandString[]): Promise<CommandString[]> {
		return Promise.all(value.map(s => this._resolveVariable(resolver, s)));
	}

	private async _resolveMatchers(resolver: VariableResolver, values: Array<string | ProblemMatcher> | undefined): Promise<ProblemMatcher[]> {
		if (values === undefined || values === null || values.length === 0) {
			return [];
		}
		const result: ProblemMatcher[] = [];
		for (const value of values) {
			let matcher: ProblemMatcher;
			if (Types.isString(value)) {
				if (value[0] === '$') {
					matcher = ProblemMatcherRegistry.get(value.substring(1));
				} else {
					matcher = ProblemMatcherRegistry.get(value);
				}
			} else {
				matcher = value;
			}
			if (!matcher) {
				this._appendOutput(nls.localize('unknownProblemMatcher', 'Problem matcher {0} can\'t be resolved. The matcher will be ignored'));
				continue;
			}
			const taskSystemInfo: ITaskSystemInfo | undefined = resolver.taskSystemInfo;
			const hasFilePrefix = matcher.filePrefix !== undefined;
			const hasUriProvider = taskSystemInfo !== undefined && taskSystemInfo.uriProvider !== undefined;
			if (!hasFilePrefix && !hasUriProvider) {
				result.push(matcher);
			} else {
				const copy = Objects.deepClone(matcher);
				if (hasUriProvider && (taskSystemInfo !== undefined)) {
					copy.uriProvider = taskSystemInfo.uriProvider;
				}
				if (hasFilePrefix) {
					const filePrefix = copy.filePrefix;
					if (Types.isString(filePrefix)) {
						copy.filePrefix = await this._resolveVariable(resolver, filePrefix);
					} else if (filePrefix !== undefined) {
						if (filePrefix.include) {
							filePrefix.include = Array.isArray(filePrefix.include)
								? await Promise.all(filePrefix.include.map(x => this._resolveVariable(resolver, x)))
								: await this._resolveVariable(resolver, filePrefix.include);
						}
						if (filePrefix.exclude) {
							filePrefix.exclude = Array.isArray(filePrefix.exclude)
								? await Promise.all(filePrefix.exclude.map(x => this._resolveVariable(resolver, x)))
								: await this._resolveVariable(resolver, filePrefix.exclude);
						}
					}
				}
				result.push(copy);
			}
		}
		return result;
	}

	private async _resolveVariable(resolver: VariableResolver, value: string | undefined): Promise<string>;
	private async _resolveVariable(resolver: VariableResolver, value: CommandString | undefined): Promise<CommandString>;
	private async _resolveVariable(resolver: VariableResolver, value: CommandString | undefined): Promise<CommandString> {
		// TODO@Dirk Task.getWorkspaceFolder should return a WorkspaceFolder that is defined in workspace.ts
		if (Types.isString(value)) {
			return resolver.resolve(value);
		} else if (value !== undefined) {
			return {
				value: await resolver.resolve(value.value),
				quoting: value.quoting
			};
		} else { // This should never happen
			throw new Error('Should never try to resolve undefined.');
		}
	}

	private async _resolveOptions(resolver: VariableResolver, options: CommandOptions | undefined): Promise<CommandOptions> {
		if (options === undefined || options === null) {
			let cwd: string | undefined;
			try {
				cwd = await this._resolveVariable(resolver, '${workspaceFolder}');
			} catch (e) {
				// No workspace
			}
			return { cwd };
		}
		const result: CommandOptions = Types.isString(options.cwd)
			? { cwd: await this._resolveVariable(resolver, options.cwd) }
			: { cwd: await this._resolveVariable(resolver, '${workspaceFolder}') };
		if (options.env) {
			result.env = Object.create(null);
			for (const key of Object.keys(options.env)) {
				const value: any = options.env[key];
				if (Types.isString(value)) {
					result.env![key] = await this._resolveVariable(resolver, value);
				} else {
					result.env![key] = value.toString();
				}
			}
		}
		return result;
	}

	static WellKnownCommands: IStringDictionary<boolean> = {
		'ant': true,
		'cmake': true,
		'eslint': true,
		'gradle': true,
		'grunt': true,
		'gulp': true,
		'jake': true,
		'jenkins': true,
		'jshint': true,
		'make': true,
		'maven': true,
		'msbuild': true,
		'msc': true,
		'nmake': true,
		'npm': true,
		'rake': true,
		'tsc': true,
		'xbuild': true
	};

	public getSanitizedCommand(cmd: string): string {
		let result = cmd.toLowerCase();
		const index = result.lastIndexOf(path.sep);
		if (index !== -1) {
			result = result.substring(index + 1);
		}
		if (TerminalTaskSystem.WellKnownCommands[result]) {
			return result;
		}
		return 'other';
	}

	public async getTaskForTerminal(instanceId: number): Promise<Task | undefined> {
		// First check if there's an active task for this terminal
		for (const key in this._activeTasks) {
			const activeTask = this._activeTasks[key];
			if (activeTask.terminal?.instanceId === instanceId) {
				return activeTask.task;
			}
		}
		// If no active task, check the terminals map for the last task that ran in this terminal
		const terminalData = this._terminals[instanceId.toString()];
		if (terminalData?.lastTask) {
			// Look up the task using the callback provided by the task service
			return await this._taskLookup(terminalData.lastTask);
		}
		return undefined;
	}

	private _appendOutput(output: string): void {
		const outputChannel = this._outputService.getChannel(this._outputChannelId);
		outputChannel?.append(output);
	}
}

function getWaitOnExitValue(presentationOptions: IPresentationOptions, configurationProperties: IConfigurationProperties) {
	if ((presentationOptions.close === undefined) || (presentationOptions.close === false)) {
		if ((presentationOptions.reveal !== RevealKind.Never) || !configurationProperties.isBackground || (presentationOptions.close === false)) {
			if (presentationOptions.panel === PanelKind.New) {
				return taskShellIntegrationWaitOnExitSequence(nls.localize('closeTerminal', 'Press any key to close the terminal.'));
			} else if (presentationOptions.showReuseMessage) {
				return taskShellIntegrationWaitOnExitSequence(nls.localize('reuseTerminal', 'Terminal will be reused by tasks, press any key to close it.'));
			} else {
				return true;
			}
		}
	}
	return !presentationOptions.close;
}

function taskShellIntegrationWaitOnExitSequence(message: string): (exitCode: number) => string {
	return (exitCode) => {
		return `${VSCodeSequence(VSCodeOscPt.CommandFinished, exitCode.toString())}${message}`;
	};
}

function getReconnectionData(terminal: ITerminalInstance): IReconnectionTaskData | undefined {
	return terminal.shellLaunchConfig.attachPersistentProcess?.reconnectionProperties?.data as IReconnectionTaskData | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/jsonSchemaCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/jsonSchemaCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

import { Schemas } from './problemMatcher.js';

const schema: IJSONSchema = {
	definitions: {
		showOutputType: {
			type: 'string',
			enum: ['always', 'silent', 'never']
		},
		options: {
			type: 'object',
			description: nls.localize('JsonSchema.options', 'Additional command options'),
			properties: {
				cwd: {
					type: 'string',
					description: nls.localize('JsonSchema.options.cwd', 'The current working directory of the executed program or script. If omitted Code\'s current workspace root is used.')
				},
				env: {
					type: 'object',
					additionalProperties: {
						type: 'string'
					},
					description: nls.localize('JsonSchema.options.env', 'The environment of the executed program or shell. If omitted the parent process\' environment is used.')
				}
			},
			additionalProperties: {
				type: ['string', 'array', 'object']
			}
		},
		problemMatcherType: {
			oneOf: [
				{
					type: 'string',
					errorMessage: nls.localize('JsonSchema.tasks.matcherError', 'Unrecognized problem matcher. Is the extension that contributes this problem matcher installed?')
				},
				Schemas.LegacyProblemMatcher,
				{
					type: 'array',
					items: {
						anyOf: [
							{
								type: 'string',
								errorMessage: nls.localize('JsonSchema.tasks.matcherError', 'Unrecognized problem matcher. Is the extension that contributes this problem matcher installed?')
							},
							Schemas.LegacyProblemMatcher
						]
					}
				}
			]
		},
		shellConfiguration: {
			type: 'object',
			additionalProperties: false,
			description: nls.localize('JsonSchema.shellConfiguration', 'Configures the shell to be used.'),
			properties: {
				executable: {
					type: 'string',
					description: nls.localize('JsonSchema.shell.executable', 'The shell to be used.')
				},
				args: {
					type: 'array',
					description: nls.localize('JsonSchema.shell.args', 'The shell arguments.'),
					items: {
						type: 'string'
					}
				}
			}
		},
		commandConfiguration: {
			type: 'object',
			additionalProperties: false,
			properties: {
				command: {
					type: 'string',
					description: nls.localize('JsonSchema.command', 'The command to be executed. Can be an external program or a shell command.')
				},
				args: {
					type: 'array',
					description: nls.localize('JsonSchema.tasks.args', 'Arguments passed to the command when this task is invoked.'),
					items: {
						type: 'string'
					}
				},
				options: {
					$ref: '#/definitions/options'
				}
			}
		},
		taskDescription: {
			type: 'object',
			required: ['taskName'],
			additionalProperties: false,
			properties: {
				taskName: {
					type: 'string',
					description: nls.localize('JsonSchema.tasks.taskName', "The task's name")
				},
				command: {
					type: 'string',
					description: nls.localize('JsonSchema.command', 'The command to be executed. Can be an external program or a shell command.')
				},
				args: {
					type: 'array',
					description: nls.localize('JsonSchema.tasks.args', 'Arguments passed to the command when this task is invoked.'),
					items: {
						type: 'string'
					}
				},
				options: {
					$ref: '#/definitions/options'
				},
				windows: {
					anyOf: [
						{
							$ref: '#/definitions/commandConfiguration',
							description: nls.localize('JsonSchema.tasks.windows', 'Windows specific command configuration'),
						},
						{
							properties: {
								problemMatcher: {
									$ref: '#/definitions/problemMatcherType',
									description: nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
								}
							}
						}
					]
				},
				osx: {
					anyOf: [
						{
							$ref: '#/definitions/commandConfiguration',
							description: nls.localize('JsonSchema.tasks.mac', 'Mac specific command configuration')
						},
						{
							properties: {
								problemMatcher: {
									$ref: '#/definitions/problemMatcherType',
									description: nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
								}
							}
						}
					]
				},
				linux: {
					anyOf: [
						{
							$ref: '#/definitions/commandConfiguration',
							description: nls.localize('JsonSchema.tasks.linux', 'Linux specific command configuration')
						},
						{
							properties: {
								problemMatcher: {
									$ref: '#/definitions/problemMatcherType',
									description: nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
								}
							}
						}
					]
				},
				suppressTaskName: {
					type: 'boolean',
					description: nls.localize('JsonSchema.tasks.suppressTaskName', 'Controls whether the task name is added as an argument to the command. If omitted the globally defined value is used.'),
					default: true
				},
				showOutput: {
					$ref: '#/definitions/showOutputType',
					description: nls.localize('JsonSchema.tasks.showOutput', 'Controls whether the output of the running task is shown or not. If omitted the globally defined value is used.')
				},
				echoCommand: {
					type: 'boolean',
					description: nls.localize('JsonSchema.echoCommand', 'Controls whether the executed command is echoed to the output. Default is false.'),
					default: true
				},
				isWatching: {
					type: 'boolean',
					deprecationMessage: nls.localize('JsonSchema.tasks.watching.deprecation', 'Deprecated. Use isBackground instead.'),
					description: nls.localize('JsonSchema.tasks.watching', 'Whether the executed task is kept alive and is watching the file system.'),
					default: true
				},
				isBackground: {
					type: 'boolean',
					description: nls.localize('JsonSchema.tasks.background', 'Whether the executed task is kept alive and is running in the background.'),
					default: true
				},
				promptOnClose: {
					type: 'boolean',
					description: nls.localize('JsonSchema.tasks.promptOnClose', 'Whether the user is prompted when VS Code closes with a running task.'),
					default: false
				},
				isBuildCommand: {
					type: 'boolean',
					description: nls.localize('JsonSchema.tasks.build', 'Maps this task to Code\'s default build command.'),
					default: true
				},
				isTestCommand: {
					type: 'boolean',
					description: nls.localize('JsonSchema.tasks.test', 'Maps this task to Code\'s default test command.'),
					default: true
				},
				problemMatcher: {
					$ref: '#/definitions/problemMatcherType',
					description: nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
				}
			}
		},
		taskRunnerConfiguration: {
			type: 'object',
			required: [],
			properties: {
				command: {
					type: 'string',
					description: nls.localize('JsonSchema.command', 'The command to be executed. Can be an external program or a shell command.')
				},
				args: {
					type: 'array',
					description: nls.localize('JsonSchema.args', 'Additional arguments passed to the command.'),
					items: {
						type: 'string'
					}
				},
				options: {
					$ref: '#/definitions/options'
				},
				showOutput: {
					$ref: '#/definitions/showOutputType',
					description: nls.localize('JsonSchema.showOutput', 'Controls whether the output of the running task is shown or not. If omitted \'always\' is used.')
				},
				isWatching: {
					type: 'boolean',
					deprecationMessage: nls.localize('JsonSchema.watching.deprecation', 'Deprecated. Use isBackground instead.'),
					description: nls.localize('JsonSchema.watching', 'Whether the executed task is kept alive and is watching the file system.'),
					default: true
				},
				isBackground: {
					type: 'boolean',
					description: nls.localize('JsonSchema.background', 'Whether the executed task is kept alive and is running in the background.'),
					default: true
				},
				promptOnClose: {
					type: 'boolean',
					description: nls.localize('JsonSchema.promptOnClose', 'Whether the user is prompted when VS Code closes with a running background task.'),
					default: false
				},
				echoCommand: {
					type: 'boolean',
					description: nls.localize('JsonSchema.echoCommand', 'Controls whether the executed command is echoed to the output. Default is false.'),
					default: true
				},
				suppressTaskName: {
					type: 'boolean',
					description: nls.localize('JsonSchema.suppressTaskName', 'Controls whether the task name is added as an argument to the command. Default is false.'),
					default: true
				},
				taskSelector: {
					type: 'string',
					description: nls.localize('JsonSchema.taskSelector', 'Prefix to indicate that an argument is task.')
				},
				problemMatcher: {
					$ref: '#/definitions/problemMatcherType',
					description: nls.localize('JsonSchema.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
				},
				tasks: {
					type: 'array',
					description: nls.localize('JsonSchema.tasks', 'The task configurations. Usually these are enrichments of task already defined in the external task runner.'),
					items: {
						type: 'object',
						$ref: '#/definitions/taskDescription'
					}
				}
			}
		}
	}
};

export default schema;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/jsonSchema_v1.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/jsonSchema_v1.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as Objects from '../../../../base/common/objects.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

import { ProblemMatcherRegistry } from './problemMatcher.js';

import commonSchema from './jsonSchemaCommon.js';

const schema: IJSONSchema = {
	oneOf: [
		{
			allOf: [
				{
					type: 'object',
					required: ['version'],
					properties: {
						version: {
							type: 'string',
							enum: ['0.1.0'],
							deprecationMessage: nls.localize('JsonSchema.version.deprecated', 'Task version 0.1.0 is deprecated. Please use 2.0.0'),
							description: nls.localize('JsonSchema.version', 'The config\'s version number')
						},
						_runner: {
							deprecationMessage: nls.localize('JsonSchema._runner', 'The runner has graduated. Use the official runner property')
						},
						runner: {
							type: 'string',
							enum: ['process', 'terminal'],
							default: 'process',
							description: nls.localize('JsonSchema.runner', 'Defines whether the task is executed as a process and the output is shown in the output window or inside the terminal.')
						},
						windows: {
							$ref: '#/definitions/taskRunnerConfiguration',
							description: nls.localize('JsonSchema.windows', 'Windows specific command configuration')
						},
						osx: {
							$ref: '#/definitions/taskRunnerConfiguration',
							description: nls.localize('JsonSchema.mac', 'Mac specific command configuration')
						},
						linux: {
							$ref: '#/definitions/taskRunnerConfiguration',
							description: nls.localize('JsonSchema.linux', 'Linux specific command configuration')
						}
					}
				},
				{
					$ref: '#/definitions/taskRunnerConfiguration'
				}
			]
		}
	]
};

const shellCommand: IJSONSchema = {
	type: 'boolean',
	default: true,
	description: nls.localize('JsonSchema.shell', 'Specifies whether the command is a shell command or an external program. Defaults to false if omitted.')
};

schema.definitions = Objects.deepClone(commonSchema.definitions);
const definitions = schema.definitions!;
definitions['commandConfiguration']['properties']!['isShellCommand'] = Objects.deepClone(shellCommand);
definitions['taskDescription']['properties']!['isShellCommand'] = Objects.deepClone(shellCommand);
definitions['taskRunnerConfiguration']['properties']!['isShellCommand'] = Objects.deepClone(shellCommand);

Object.getOwnPropertyNames(definitions).forEach(key => {
	const newKey = key + '1';
	definitions[newKey] = definitions[key];
	delete definitions[key];
});

function fixReferences(literal: any) {
	if (Array.isArray(literal)) {
		literal.forEach(fixReferences);
	} else if (typeof literal === 'object') {
		if (literal['$ref']) {
			literal['$ref'] = literal['$ref'] + '1';
		}
		Object.getOwnPropertyNames(literal).forEach(property => {
			const value = literal[property];
			if (Array.isArray(value) || typeof value === 'object') {
				fixReferences(value);
			}
		});
	}
}
fixReferences(schema);

ProblemMatcherRegistry.onReady().then(() => {
	try {
		const matcherIds = ProblemMatcherRegistry.keys().map(key => '$' + key);
		definitions.problemMatcherType1.oneOf![0].enum = matcherIds;
		(definitions.problemMatcherType1.oneOf![2].items as IJSONSchema).anyOf![1].enum = matcherIds;
	} catch (err) {
		console.log('Installing problem matcher ids failed');
	}
});

export default schema;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/jsonSchema_v2.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/jsonSchema_v2.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as Objects from '../../../../base/common/objects.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';

import commonSchema from './jsonSchemaCommon.js';

import { ProblemMatcherRegistry } from './problemMatcher.js';
import { TaskDefinitionRegistry } from './taskDefinitionRegistry.js';
import * as ConfigurationResolverUtils from '../../../services/configurationResolver/common/configurationResolverUtils.js';
import { inputsSchema } from '../../../services/configurationResolver/common/configurationResolverSchema.js';
import { getAllCodicons } from '../../../../base/common/codicons.js';

function fixReferences(literal: any) {
	if (Array.isArray(literal)) {
		literal.forEach(fixReferences);
	} else if (typeof literal === 'object') {
		if (literal['$ref']) {
			literal['$ref'] = literal['$ref'] + '2';
		}
		Object.getOwnPropertyNames(literal).forEach(property => {
			const value = literal[property];
			if (Array.isArray(value) || typeof value === 'object') {
				fixReferences(value);
			}
		});
	}
}

const shellCommand: IJSONSchema = {
	anyOf: [
		{
			type: 'boolean',
			default: true,
			description: nls.localize('JsonSchema.shell', 'Specifies whether the command is a shell command or an external program. Defaults to false if omitted.')
		},
		{
			$ref: '#/definitions/shellConfiguration'
		}
	],
	deprecationMessage: nls.localize('JsonSchema.tasks.isShellCommand.deprecated', 'The property isShellCommand is deprecated. Use the type property of the task and the shell property in the options instead. See also the 1.14 release notes.')
};


const hide: IJSONSchema = {
	type: 'boolean',
	description: nls.localize('JsonSchema.hide', 'Hide this task from the run task quick pick'),
	default: true
};

const taskIdentifier: IJSONSchema = {
	type: 'object',
	additionalProperties: true,
	properties: {
		type: {
			type: 'string',
			description: nls.localize('JsonSchema.tasks.dependsOn.identifier', 'The task identifier.')
		}
	}
};

const dependsOn: IJSONSchema = {
	anyOf: [
		{
			type: 'string',
			description: nls.localize('JsonSchema.tasks.dependsOn.string', 'Another task this task depends on.')
		},
		taskIdentifier,
		{
			type: 'array',
			description: nls.localize('JsonSchema.tasks.dependsOn.array', 'The other tasks this task depends on.'),
			items: {
				anyOf: [
					{
						type: 'string',
					},
					taskIdentifier
				]
			}
		}
	],
	description: nls.localize('JsonSchema.tasks.dependsOn', 'Either a string representing another task or an array of other tasks that this task depends on.')
};

const dependsOrder: IJSONSchema = {
	type: 'string',
	enum: ['parallel', 'sequence'],
	enumDescriptions: [
		nls.localize('JsonSchema.tasks.dependsOrder.parallel', 'Run all dependsOn tasks in parallel.'),
		nls.localize('JsonSchema.tasks.dependsOrder.sequence', 'Run all dependsOn tasks in sequence.'),
	],
	default: 'parallel',
	description: nls.localize('JsonSchema.tasks.dependsOrder', 'Determines the order of the dependsOn tasks for this task. Note that this property is not recursive.')
};

const detail: IJSONSchema = {
	type: 'string',
	description: nls.localize('JsonSchema.tasks.detail', 'An optional description of a task that shows in the Run Task quick pick as a detail.')
};

const icon: IJSONSchema = {
	type: 'object',
	description: nls.localize('JsonSchema.tasks.icon', 'An optional icon for the task'),
	properties: {
		id: {
			description: nls.localize('JsonSchema.tasks.icon.id', 'An optional codicon ID to use'),
			type: ['string', 'null'],
			enum: Array.from(getAllCodicons(), icon => icon.id),
			markdownEnumDescriptions: Array.from(getAllCodicons(), icon => `$(${icon.id})`),
		},
		color: {
			description: nls.localize('JsonSchema.tasks.icon.color', 'An optional color of the icon'),
			type: ['string', 'null'],
			enum: [
				'terminal.ansiBlack',
				'terminal.ansiRed',
				'terminal.ansiGreen',
				'terminal.ansiYellow',
				'terminal.ansiBlue',
				'terminal.ansiMagenta',
				'terminal.ansiCyan',
				'terminal.ansiWhite'
			],
		},
	}
};

const presentation: IJSONSchema = {
	type: 'object',
	default: {
		echo: true,
		reveal: 'always',
		focus: false,
		panel: 'shared',
		showReuseMessage: true,
		clear: false,
	},
	description: nls.localize('JsonSchema.tasks.presentation', 'Configures the panel that is used to present the task\'s output and reads its input.'),
	additionalProperties: false,
	properties: {
		echo: {
			type: 'boolean',
			default: true,
			description: nls.localize('JsonSchema.tasks.presentation.echo', 'Controls whether the executed command is echoed to the panel. Default is true.')
		},
		focus: {
			type: 'boolean',
			default: false,
			description: nls.localize('JsonSchema.tasks.presentation.focus', 'Controls whether the panel takes focus. Default is false. If set to true the panel is revealed as well.')
		},
		revealProblems: {
			type: 'string',
			enum: ['always', 'onProblem', 'never'],
			enumDescriptions: [
				nls.localize('JsonSchema.tasks.presentation.revealProblems.always', 'Always reveals the problems panel when this task is executed.'),
				nls.localize('JsonSchema.tasks.presentation.revealProblems.onProblem', 'Only reveals the problems panel if a problem is found.'),
				nls.localize('JsonSchema.tasks.presentation.revealProblems.never', 'Never reveals the problems panel when this task is executed.'),
			],
			default: 'never',
			description: nls.localize('JsonSchema.tasks.presentation.revealProblems', 'Controls whether the problems panel is revealed when running this task or not. Takes precedence over option \"reveal\". Default is \"never\".')
		},
		reveal: {
			type: 'string',
			enum: ['always', 'silent', 'never'],
			enumDescriptions: [
				nls.localize('JsonSchema.tasks.presentation.reveal.always', 'Always reveals the terminal when this task is executed.'),
				nls.localize('JsonSchema.tasks.presentation.reveal.silent', 'Only reveals the terminal if the task exits with an error or the problem matcher finds an error.'),
				nls.localize('JsonSchema.tasks.presentation.reveal.never', 'Never reveals the terminal when this task is executed.'),
			],
			default: 'always',
			description: nls.localize('JsonSchema.tasks.presentation.reveal', 'Controls whether the terminal running the task is revealed or not. May be overridden by option \"revealProblems\". Default is \"always\".')
		},
		panel: {
			type: 'string',
			enum: ['shared', 'dedicated', 'new'],
			default: 'shared',
			description: nls.localize('JsonSchema.tasks.presentation.instance', 'Controls if the panel is shared between tasks, dedicated to this task or a new one is created on every run.')
		},
		showReuseMessage: {
			type: 'boolean',
			default: true,
			description: nls.localize('JsonSchema.tasks.presentation.showReuseMessage', 'Controls whether to show the `Terminal will be reused by tasks, press any key to close it` message.')
		},
		clear: {
			type: 'boolean',
			default: false,
			description: nls.localize('JsonSchema.tasks.presentation.clear', 'Controls whether the terminal is cleared before executing the task.')
		},
		group: {
			type: 'string',
			description: nls.localize('JsonSchema.tasks.presentation.group', 'Controls whether the task is executed in a specific terminal group using split panes.')
		},
		close: {
			type: 'boolean',
			description: nls.localize('JsonSchema.tasks.presentation.close', 'Controls whether the terminal the task runs in is closed when the task exits.')
		},
		preserveTerminalName: {
			type: 'boolean',
			default: false,
			description: nls.localize('JsonSchema.tasks.presentation.preserveTerminalName', 'Controls whether to preserve the task name in the terminal after task completion.')
		}
	}
};

const terminal: IJSONSchema = Objects.deepClone(presentation);
terminal.deprecationMessage = nls.localize('JsonSchema.tasks.terminal', 'The terminal property is deprecated. Use presentation instead');

const groupStrings: IJSONSchema = {
	type: 'string',
	enum: [
		'build',
		'test',
		'none'
	],
	enumDescriptions: [
		nls.localize('JsonSchema.tasks.group.build', 'Marks the task as a build task accessible through the \'Run Build Task\' command.'),
		nls.localize('JsonSchema.tasks.group.test', 'Marks the task as a test task accessible through the \'Run Test Task\' command.'),
		nls.localize('JsonSchema.tasks.group.none', 'Assigns the task to no group')
	],
	description: nls.localize('JsonSchema.tasks.group.kind', 'The task\'s execution group.')
};

const group: IJSONSchema = {
	oneOf: [
		groupStrings,
		{
			type: 'object',
			properties: {
				kind: groupStrings,
				isDefault: {
					type: ['boolean', 'string'],
					default: false,
					description: nls.localize('JsonSchema.tasks.group.isDefault', 'Defines if this task is the default task in the group, or a glob to match the file which should trigger this task.')
				}
			}
		},
	],
	defaultSnippets: [
		{
			body: { kind: 'build', isDefault: true },
			description: nls.localize('JsonSchema.tasks.group.defaultBuild', 'Marks the task as the default build task.')
		},
		{
			body: { kind: 'test', isDefault: true },
			description: nls.localize('JsonSchema.tasks.group.defaultTest', 'Marks the task as the default test task.')
		}
	],
	description: nls.localize('JsonSchema.tasks.group', 'Defines to which execution group this task belongs to. It supports "build" to add it to the build group and "test" to add it to the test group.')
};

const taskType: IJSONSchema = {
	type: 'string',
	enum: ['shell'],
	default: 'process',
	description: nls.localize('JsonSchema.tasks.type', 'Defines whether the task is run as a process or as a command inside a shell.')
};

const command: IJSONSchema = {
	oneOf: [
		{
			oneOf: [
				{
					type: 'string'
				},
				{
					type: 'array',
					items: {
						type: 'string'
					},
					description: nls.localize('JsonSchema.commandArray', 'The shell command to be executed. Array items will be joined using a space character')
				}
			]
		},
		{
			type: 'object',
			required: ['value', 'quoting'],
			properties: {
				value: {
					oneOf: [
						{
							type: 'string'
						},
						{
							type: 'array',
							items: {
								type: 'string'
							},
							description: nls.localize('JsonSchema.commandArray', 'The shell command to be executed. Array items will be joined using a space character')
						}
					],
					description: nls.localize('JsonSchema.command.quotedString.value', 'The actual command value')
				},
				quoting: {
					type: 'string',
					enum: ['escape', 'strong', 'weak'],
					enumDescriptions: [
						nls.localize('JsonSchema.tasks.quoting.escape', 'Escapes characters using the shell\'s escape character (e.g. ` under PowerShell and \\ under bash).'),
						nls.localize('JsonSchema.tasks.quoting.strong', 'Quotes the argument using the shell\'s strong quote character (e.g. \' under PowerShell and bash).'),
						nls.localize('JsonSchema.tasks.quoting.weak', 'Quotes the argument using the shell\'s weak quote character (e.g. " under PowerShell and bash).'),
					],
					default: 'strong',
					description: nls.localize('JsonSchema.command.quotesString.quote', 'How the command value should be quoted.')
				}
			}

		}
	],
	description: nls.localize('JsonSchema.command', 'The command to be executed. Can be an external program or a shell command.')
};

const args: IJSONSchema = {
	type: 'array',
	items: {
		oneOf: [
			{
				type: 'string',
			},
			{
				type: 'object',
				required: ['value', 'quoting'],
				properties: {
					value: {
						type: 'string',
						description: nls.localize('JsonSchema.args.quotedString.value', 'The actual argument value')
					},
					quoting: {
						type: 'string',
						enum: ['escape', 'strong', 'weak'],
						enumDescriptions: [
							nls.localize('JsonSchema.tasks.quoting.escape', 'Escapes characters using the shell\'s escape character (e.g. ` under PowerShell and \\ under bash).'),
							nls.localize('JsonSchema.tasks.quoting.strong', 'Quotes the argument using the shell\'s strong quote character (e.g. \' under PowerShell and bash).'),
							nls.localize('JsonSchema.tasks.quoting.weak', 'Quotes the argument using the shell\'s weak quote character (e.g. " under PowerShell and bash).'),
						],
						default: 'strong',
						description: nls.localize('JsonSchema.args.quotesString.quote', 'How the argument value should be quoted.')
					}
				}

			}
		]
	},
	description: nls.localize('JsonSchema.tasks.args', 'Arguments passed to the command when this task is invoked.')
};

const label: IJSONSchema = {
	type: 'string',
	description: nls.localize('JsonSchema.tasks.label', "The task's user interface label")
};

const version: IJSONSchema = {
	type: 'string',
	enum: ['2.0.0'],
	description: nls.localize('JsonSchema.version', 'The config\'s version number.')
};

const identifier: IJSONSchema = {
	type: 'string',
	description: nls.localize('JsonSchema.tasks.identifier', 'A user defined identifier to reference the task in launch.json or a dependsOn clause.'),
	deprecationMessage: nls.localize('JsonSchema.tasks.identifier.deprecated', 'User defined identifiers are deprecated. For custom task use the name as a reference and for tasks provided by extensions use their defined task identifier.')
};

const runOptions: IJSONSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		reevaluateOnRerun: {
			type: 'boolean',
			description: nls.localize('JsonSchema.tasks.reevaluateOnRerun', 'Whether to reevaluate task variables on rerun.'),
			default: true
		},
		runOn: {
			type: 'string',
			enum: ['default', 'folderOpen'],
			description: nls.localize('JsonSchema.tasks.runOn', 'Configures when the task should be run. If set to folderOpen, then the task will be run automatically when the folder is opened.'),
			default: 'default'
		},
		instanceLimit: {
			type: 'number',
			description: nls.localize('JsonSchema.tasks.instanceLimit', 'The number of instances of the task that are allowed to run simultaneously.'),
			default: 1
		},
		instancePolicy: {
			type: 'string',
			enum: ['terminateNewest', 'terminateOldest', 'prompt', 'warn', 'silent'],
			enumDescriptions: [
				nls.localize('JsonSchema.tasks.instancePolicy.terminateNewest', 'Terminates the newest instance.'),
				nls.localize('JsonSchema.tasks.instancePolicy.terminateOldest', 'Terminates the oldest instance.'),
				nls.localize('JsonSchema.tasks.instancePolicy.prompt', 'Asks which instance to terminate.'),
				nls.localize('JsonSchema.tasks.instancePolicy.warn', 'Does nothing but warns that the instance limit has been reached.'),
				nls.localize('JsonSchema.tasks.instancePolicy.silent', 'Does nothing.'),
			],
			description: nls.localize('JsonSchema.tasks.instancePolicy', 'Policy to apply when instance limit is reached.'),
			default: 'prompt'
		}
	},
	description: nls.localize('JsonSchema.tasks.runOptions', 'The task\'s run related options')
};

const commonSchemaDefinitions = commonSchema.definitions!;
const options: IJSONSchema = Objects.deepClone(commonSchemaDefinitions.options);
const optionsProperties = options.properties!;
optionsProperties.shell = Objects.deepClone(commonSchemaDefinitions.shellConfiguration);

const taskConfiguration: IJSONSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		label: {
			type: 'string',
			description: nls.localize('JsonSchema.tasks.taskLabel', "The task's label")
		},
		taskName: {
			type: 'string',
			description: nls.localize('JsonSchema.tasks.taskName', 'The task\'s name'),
			deprecationMessage: nls.localize('JsonSchema.tasks.taskName.deprecated', 'The task\'s name property is deprecated. Use the label property instead.')
		},
		identifier: Objects.deepClone(identifier),
		group: Objects.deepClone(group),
		isBackground: {
			type: 'boolean',
			description: nls.localize('JsonSchema.tasks.background', 'Whether the executed task is kept alive and is running in the background.'),
			default: true
		},
		promptOnClose: {
			type: 'boolean',
			description: nls.localize('JsonSchema.tasks.promptOnClose', 'Whether the user is prompted when VS Code closes with a running task.'),
			default: false
		},
		presentation: Objects.deepClone(presentation),
		icon: Objects.deepClone(icon),
		hide: Objects.deepClone(hide),
		options: options,
		problemMatcher: {
			$ref: '#/definitions/problemMatcherType',
			description: nls.localize('JsonSchema.tasks.matchers', 'The problem matcher(s) to use. Can either be a string or a problem matcher definition or an array of strings and problem matchers.')
		},
		runOptions: Objects.deepClone(runOptions),
		dependsOn: Objects.deepClone(dependsOn),
		dependsOrder: Objects.deepClone(dependsOrder),
		detail: Objects.deepClone(detail),
	}
};

const taskDefinitions: IJSONSchema[] = [];
TaskDefinitionRegistry.onReady().then(() => {
	updateTaskDefinitions();
});

export function updateTaskDefinitions() {
	for (const taskType of TaskDefinitionRegistry.all()) {
		// Check that we haven't already added this task type
		if (taskDefinitions.find(schema => {
			return schema.properties?.type?.enum?.find ? schema.properties?.type.enum.find(element => element === taskType.taskType) : undefined;
		})) {
			continue;
		}

		const schema: IJSONSchema = Objects.deepClone(taskConfiguration);
		const schemaProperties = schema.properties!;
		// Since we do this after the schema is assigned we need to patch the refs.
		schemaProperties.type = {
			type: 'string',
			description: nls.localize('JsonSchema.customizations.customizes.type', 'The task type to customize'),
			enum: [taskType.taskType]
		};
		if (taskType.required) {
			schema.required = taskType.required.slice();
		} else {
			schema.required = [];
		}
		// Customized tasks require that the task type be set.
		schema.required.push('type');
		if (taskType.properties) {
			for (const key of Object.keys(taskType.properties)) {
				const property = taskType.properties[key];
				schemaProperties[key] = Objects.deepClone(property);
			}
		}
		fixReferences(schema);
		taskDefinitions.push(schema);
	}
}

const customize = Objects.deepClone(taskConfiguration);
customize.properties!.customize = {
	type: 'string',
	deprecationMessage: nls.localize('JsonSchema.tasks.customize.deprecated', 'The customize property is deprecated. See the 1.14 release notes on how to migrate to the new task customization approach')
};
if (!customize.required) {
	customize.required = [];
}
customize.required.push('customize');
taskDefinitions.push(customize);

const definitions = Objects.deepClone(commonSchemaDefinitions);
const taskDescription: IJSONSchema = definitions.taskDescription;
taskDescription.required = ['label'];
const taskDescriptionProperties = taskDescription.properties!;
taskDescriptionProperties.label = Objects.deepClone(label);
taskDescriptionProperties.command = Objects.deepClone(command);
taskDescriptionProperties.args = Objects.deepClone(args);
taskDescriptionProperties.isShellCommand = Objects.deepClone(shellCommand);
taskDescriptionProperties.dependsOn = dependsOn;
taskDescriptionProperties.hide = Objects.deepClone(hide);
taskDescriptionProperties.dependsOrder = dependsOrder;
taskDescriptionProperties.identifier = Objects.deepClone(identifier);
taskDescriptionProperties.type = Objects.deepClone(taskType);
taskDescriptionProperties.presentation = Objects.deepClone(presentation);
taskDescriptionProperties.terminal = terminal;
taskDescriptionProperties.icon = Objects.deepClone(icon);
taskDescriptionProperties.group = Objects.deepClone(group);
taskDescriptionProperties.runOptions = Objects.deepClone(runOptions);
taskDescriptionProperties.detail = detail;
taskDescriptionProperties.taskName.deprecationMessage = nls.localize(
	'JsonSchema.tasks.taskName.deprecated',
	'The task\'s name property is deprecated. Use the label property instead.'
);
// Clone the taskDescription for process task before setting a default to prevent two defaults #115281
const processTask = Objects.deepClone(taskDescription);
taskDescription.default = {
	label: 'My Task',
	type: 'shell',
	command: 'echo Hello',
	problemMatcher: []
};
definitions.showOutputType.deprecationMessage = nls.localize(
	'JsonSchema.tasks.showOutput.deprecated',
	'The property showOutput is deprecated. Use the reveal property inside the presentation property instead. See also the 1.14 release notes.'
);
taskDescriptionProperties.echoCommand.deprecationMessage = nls.localize(
	'JsonSchema.tasks.echoCommand.deprecated',
	'The property echoCommand is deprecated. Use the echo property inside the presentation property instead. See also the 1.14 release notes.'
);
taskDescriptionProperties.suppressTaskName.deprecationMessage = nls.localize(
	'JsonSchema.tasks.suppressTaskName.deprecated',
	'The property suppressTaskName is deprecated. Inline the command with its arguments into the task instead. See also the 1.14 release notes.'
);
taskDescriptionProperties.isBuildCommand.deprecationMessage = nls.localize(
	'JsonSchema.tasks.isBuildCommand.deprecated',
	'The property isBuildCommand is deprecated. Use the group property instead. See also the 1.14 release notes.'
);
taskDescriptionProperties.isTestCommand.deprecationMessage = nls.localize(
	'JsonSchema.tasks.isTestCommand.deprecated',
	'The property isTestCommand is deprecated. Use the group property instead. See also the 1.14 release notes.'
);

// Process tasks are almost identical schema-wise to shell tasks, but they are required to have a command
processTask.properties!.type = {
	type: 'string',
	enum: ['process'],
	default: 'process',
	description: nls.localize('JsonSchema.tasks.type', 'Defines whether the task is run as a process or as a command inside a shell.')
};
processTask.required!.push('command');
processTask.required!.push('type');

taskDefinitions.push(processTask);

taskDefinitions.push({
	$ref: '#/definitions/taskDescription'
});

const definitionsTaskRunnerConfigurationProperties = definitions.taskRunnerConfiguration.properties!;
const tasks = definitionsTaskRunnerConfigurationProperties.tasks;
tasks.items = {
	oneOf: taskDefinitions
};

definitionsTaskRunnerConfigurationProperties.inputs = inputsSchema.definitions!.inputs;

definitions.commandConfiguration.properties!.isShellCommand = Objects.deepClone(shellCommand);
definitions.commandConfiguration.properties!.args = Objects.deepClone(args);
definitions.options.properties!.shell = {
	$ref: '#/definitions/shellConfiguration'
};

definitionsTaskRunnerConfigurationProperties.isShellCommand = Objects.deepClone(shellCommand);
definitionsTaskRunnerConfigurationProperties.type = Objects.deepClone(taskType);
definitionsTaskRunnerConfigurationProperties.group = Objects.deepClone(group);
definitionsTaskRunnerConfigurationProperties.presentation = Objects.deepClone(presentation);
definitionsTaskRunnerConfigurationProperties.suppressTaskName.deprecationMessage = nls.localize(
	'JsonSchema.tasks.suppressTaskName.deprecated',
	'The property suppressTaskName is deprecated. Inline the command with its arguments into the task instead. See also the 1.14 release notes.'
);
definitionsTaskRunnerConfigurationProperties.taskSelector.deprecationMessage = nls.localize(
	'JsonSchema.tasks.taskSelector.deprecated',
	'The property taskSelector is deprecated. Inline the command with its arguments into the task instead. See also the 1.14 release notes.'
);

const osSpecificTaskRunnerConfiguration = Objects.deepClone(definitions.taskRunnerConfiguration);
delete osSpecificTaskRunnerConfiguration.properties!.tasks;
osSpecificTaskRunnerConfiguration.additionalProperties = false;
definitions.osSpecificTaskRunnerConfiguration = osSpecificTaskRunnerConfiguration;
definitionsTaskRunnerConfigurationProperties.version = Objects.deepClone(version);

const schema: IJSONSchema = {
	oneOf: [
		{
			'allOf': [
				{
					type: 'object',
					required: ['version'],
					properties: {
						version: Objects.deepClone(version),
						windows: {
							'$ref': '#/definitions/osSpecificTaskRunnerConfiguration',
							'description': nls.localize('JsonSchema.windows', 'Windows specific command configuration')
						},
						osx: {
							'$ref': '#/definitions/osSpecificTaskRunnerConfiguration',
							'description': nls.localize('JsonSchema.mac', 'Mac specific command configuration')
						},
						linux: {
							'$ref': '#/definitions/osSpecificTaskRunnerConfiguration',
							'description': nls.localize('JsonSchema.linux', 'Linux specific command configuration')
						}
					}
				},
				{
					$ref: '#/definitions/taskRunnerConfiguration'
				}
			]
		}
	]
};

schema.definitions = definitions;

function deprecatedVariableMessage(schemaMap: IJSONSchemaMap, property: string) {
	const mapAtProperty = schemaMap[property].properties!;
	if (mapAtProperty) {
		Object.keys(mapAtProperty).forEach(name => {
			deprecatedVariableMessage(mapAtProperty, name);
		});
	} else {
		ConfigurationResolverUtils.applyDeprecatedVariableMessage(schemaMap[property]);
	}
}

Object.getOwnPropertyNames(definitions).forEach(key => {
	const newKey = key + '2';
	definitions[newKey] = definitions[key];
	delete definitions[key];
	deprecatedVariableMessage(definitions, newKey);
});
fixReferences(schema);

export function updateProblemMatchers() {
	try {
		const matcherIds = ProblemMatcherRegistry.keys().map(key => '$' + key);
		definitions.problemMatcherType2.oneOf![0].enum = matcherIds;
		(definitions.problemMatcherType2.oneOf![2].items as IJSONSchema).anyOf![0].enum = matcherIds;
	} catch (err) {
		console.log('Installing problem matcher ids failed');
	}
}

ProblemMatcherRegistry.onReady().then(() => {
	updateProblemMatchers();
});

export default schema;
```

--------------------------------------------------------------------------------

````

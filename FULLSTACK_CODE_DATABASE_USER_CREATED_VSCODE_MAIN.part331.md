---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 331
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 331 of 552)

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

---[FILE: src/vs/workbench/browser/parts/editor/editorCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Schemas, matchesScheme } from '../../../../base/common/network.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { isNumber, isObject, isString, isUndefined } from '../../../../base/common/types.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandHandler, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorResolution, IEditorOptions, IResourceEditorInput, ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService, IOpenEvent } from '../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ActiveGroupEditorsByMostRecentlyUsedQuickAccess } from './editorQuickAccess.js';
import { SideBySideEditor } from './sideBySideEditor.js';
import { TextDiffEditor } from './textDiffEditor.js';
import { ActiveEditorCanSplitInGroupContext, ActiveEditorGroupEmptyContext, ActiveEditorGroupLockedContext, ActiveEditorStickyContext, MultipleEditorGroupsContext, SideBySideEditorActiveContext, TextCompareEditorActiveContext } from '../../../common/contextkeys.js';
import { CloseDirection, EditorInputCapabilities, EditorsOrder, IResourceDiffEditorInput, IUntitledTextResourceEditorInput, isEditorInputWithOptionsAndGroup } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { EditorGroupColumn, columnToEditorGroup } from '../../../services/editor/common/editorGroupColumn.js';
import { EditorGroupLayout, GroupDirection, GroupLocation, GroupsOrder, IEditorGroup, IEditorGroupsService, IEditorReplacement, preferredSideBySideGroupDirection } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { IUntitledTextEditorService } from '../../../services/untitled/common/untitledTextEditorService.js';
import { DIFF_FOCUS_OTHER_SIDE, DIFF_FOCUS_PRIMARY_SIDE, DIFF_FOCUS_SECONDARY_SIDE, registerDiffEditorCommands } from './diffEditorCommands.js';
import { IResolvedEditorCommandsContext, resolveCommandsContext } from './editorCommandsContext.js';
import { prepareMoveCopyEditors } from './editor.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IMultiDiffEditorOptions } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js';

export const CLOSE_SAVED_EDITORS_COMMAND_ID = 'workbench.action.closeUnmodifiedEditors';
export const CLOSE_EDITORS_IN_GROUP_COMMAND_ID = 'workbench.action.closeEditorsInGroup';
export const CLOSE_EDITORS_AND_GROUP_COMMAND_ID = 'workbench.action.closeEditorsAndGroup';
export const CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID = 'workbench.action.closeEditorsToTheRight';
export const CLOSE_EDITOR_COMMAND_ID = 'workbench.action.closeActiveEditor';
export const CLOSE_PINNED_EDITOR_COMMAND_ID = 'workbench.action.closeActivePinnedEditor';
export const CLOSE_EDITOR_GROUP_COMMAND_ID = 'workbench.action.closeGroup';
export const CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID = 'workbench.action.closeOtherEditors';

export const MOVE_ACTIVE_EDITOR_COMMAND_ID = 'moveActiveEditor';
export const COPY_ACTIVE_EDITOR_COMMAND_ID = 'copyActiveEditor';
export const LAYOUT_EDITOR_GROUPS_COMMAND_ID = 'layoutEditorGroups';
export const KEEP_EDITOR_COMMAND_ID = 'workbench.action.keepEditor';
export const TOGGLE_KEEP_EDITORS_COMMAND_ID = 'workbench.action.toggleKeepEditors';
export const TOGGLE_LOCK_GROUP_COMMAND_ID = 'workbench.action.toggleEditorGroupLock';
export const LOCK_GROUP_COMMAND_ID = 'workbench.action.lockEditorGroup';
export const UNLOCK_GROUP_COMMAND_ID = 'workbench.action.unlockEditorGroup';
export const SHOW_EDITORS_IN_GROUP = 'workbench.action.showEditorsInGroup';
export const REOPEN_WITH_COMMAND_ID = 'workbench.action.reopenWithEditor';
export const REOPEN_ACTIVE_EDITOR_WITH_COMMAND_ID = 'reopenActiveEditorWith';

export const PIN_EDITOR_COMMAND_ID = 'workbench.action.pinEditor';
export const UNPIN_EDITOR_COMMAND_ID = 'workbench.action.unpinEditor';

export const SPLIT_EDITOR = 'workbench.action.splitEditor';
export const SPLIT_EDITOR_UP = 'workbench.action.splitEditorUp';
export const SPLIT_EDITOR_DOWN = 'workbench.action.splitEditorDown';
export const SPLIT_EDITOR_LEFT = 'workbench.action.splitEditorLeft';
export const SPLIT_EDITOR_RIGHT = 'workbench.action.splitEditorRight';

export const MOVE_EDITOR_INTO_ABOVE_GROUP = 'workbench.action.moveEditorToAboveGroup';
export const MOVE_EDITOR_INTO_BELOW_GROUP = 'workbench.action.moveEditorToBelowGroup';
export const MOVE_EDITOR_INTO_LEFT_GROUP = 'workbench.action.moveEditorToLeftGroup';
export const MOVE_EDITOR_INTO_RIGHT_GROUP = 'workbench.action.moveEditorToRightGroup';

export const TOGGLE_MAXIMIZE_EDITOR_GROUP = 'workbench.action.toggleMaximizeEditorGroup';

export const SPLIT_EDITOR_IN_GROUP = 'workbench.action.splitEditorInGroup';
export const TOGGLE_SPLIT_EDITOR_IN_GROUP = 'workbench.action.toggleSplitEditorInGroup';
export const JOIN_EDITOR_IN_GROUP = 'workbench.action.joinEditorInGroup';
export const TOGGLE_SPLIT_EDITOR_IN_GROUP_LAYOUT = 'workbench.action.toggleSplitEditorInGroupLayout';

export const FOCUS_FIRST_SIDE_EDITOR = 'workbench.action.focusFirstSideEditor';
export const FOCUS_SECOND_SIDE_EDITOR = 'workbench.action.focusSecondSideEditor';
export const FOCUS_OTHER_SIDE_EDITOR = 'workbench.action.focusOtherSideEditor';

export const FOCUS_LEFT_GROUP_WITHOUT_WRAP_COMMAND_ID = 'workbench.action.focusLeftGroupWithoutWrap';
export const FOCUS_RIGHT_GROUP_WITHOUT_WRAP_COMMAND_ID = 'workbench.action.focusRightGroupWithoutWrap';
export const FOCUS_ABOVE_GROUP_WITHOUT_WRAP_COMMAND_ID = 'workbench.action.focusAboveGroupWithoutWrap';
export const FOCUS_BELOW_GROUP_WITHOUT_WRAP_COMMAND_ID = 'workbench.action.focusBelowGroupWithoutWrap';

export const OPEN_EDITOR_AT_INDEX_COMMAND_ID = 'workbench.action.openEditorAtIndex';

export const MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID = 'workbench.action.moveEditorToNewWindow';
export const COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID = 'workbench.action.copyEditorToNewWindow';

export const MOVE_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID = 'workbench.action.moveEditorGroupToNewWindow';
export const COPY_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID = 'workbench.action.copyEditorGroupToNewWindow';

export const NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID = 'workbench.action.newEmptyEditorWindow';

export const API_OPEN_EDITOR_COMMAND_ID = '_workbench.open';
export const API_OPEN_DIFF_EDITOR_COMMAND_ID = '_workbench.diff';
export const API_OPEN_WITH_EDITOR_COMMAND_ID = '_workbench.openWith';

export const EDITOR_CORE_NAVIGATION_COMMANDS = [
	SPLIT_EDITOR,
	CLOSE_EDITOR_COMMAND_ID,
	UNPIN_EDITOR_COMMAND_ID,
	UNLOCK_GROUP_COMMAND_ID,
	TOGGLE_MAXIMIZE_EDITOR_GROUP
];

export interface SelectedEditorsMoveCopyArguments {
	to?: 'first' | 'last' | 'left' | 'right' | 'up' | 'down' | 'center' | 'position' | 'previous' | 'next';
	by?: 'tab' | 'group';
	value?: number;
}

const isSelectedEditorsMoveCopyArg = function (arg: SelectedEditorsMoveCopyArguments): boolean {
	if (!isObject(arg)) {
		return false;
	}

	if (!isString(arg.to)) {
		return false;
	}

	if (!isUndefined(arg.by) && !isString(arg.by)) {
		return false;
	}

	if (!isUndefined(arg.value) && !isNumber(arg.value)) {
		return false;
	}

	return true;
};

function registerActiveEditorMoveCopyCommand(): void {

	const moveCopyJSONSchema: IJSONSchema = {
		'type': 'object',
		'required': ['to'],
		'properties': {
			'to': {
				'type': 'string',
				'enum': ['left', 'right']
			},
			'by': {
				'type': 'string',
				'enum': ['tab', 'group']
			},
			'value': {
				'type': 'number'
			}
		}
	};

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: MOVE_ACTIVE_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: EditorContextKeys.editorTextFocus,
		primary: 0,
		handler: (accessor, args) => moveCopySelectedEditors(true, args as SelectedEditorsMoveCopyArguments | undefined, accessor),
		metadata: {
			description: localize('editorCommand.activeEditorMove.description', "Move the active editor by tabs or groups"),
			args: [
				{
					name: localize('editorCommand.activeEditorMove.arg.name', "Active editor move argument"),
					description: localize('editorCommand.activeEditorMove.arg.description', "Argument Properties:\n\t* 'to': String value providing where to move.\n\t* 'by': String value providing the unit for move (by tab or by group).\n\t* 'value': Number value providing how many positions or an absolute position to move."),
					constraint: isSelectedEditorsMoveCopyArg,
					schema: moveCopyJSONSchema
				}
			]
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: COPY_ACTIVE_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: EditorContextKeys.editorTextFocus,
		primary: 0,
		handler: (accessor, args) => moveCopySelectedEditors(false, args as SelectedEditorsMoveCopyArguments | undefined, accessor),
		metadata: {
			description: localize('editorCommand.activeEditorCopy.description', "Copy the active editor by groups"),
			args: [
				{
					name: localize('editorCommand.activeEditorCopy.arg.name', "Active editor copy argument"),
					description: localize('editorCommand.activeEditorCopy.arg.description', "Argument Properties:\n\t* 'to': String value providing where to copy.\n\t* 'value': Number value providing how many positions or an absolute position to copy."),
					constraint: isSelectedEditorsMoveCopyArg,
					schema: moveCopyJSONSchema
				}
			]
		}
	});

	function moveCopySelectedEditors(isMove: boolean, args: SelectedEditorsMoveCopyArguments = Object.create(null), accessor: ServicesAccessor): void {
		args.to = args.to || 'right';
		args.by = args.by || 'tab';
		args.value = typeof args.value === 'number' ? args.value : 1;

		const activeGroup = accessor.get(IEditorGroupsService).activeGroup;
		const selectedEditors = activeGroup.selectedEditors;
		if (selectedEditors.length > 0) {
			switch (args.by) {
				case 'tab':
					if (isMove) {
						return moveTabs(args, activeGroup, selectedEditors);
					}
					break;
				case 'group':
					return moveCopyActiveEditorToGroup(isMove, args, activeGroup, selectedEditors, accessor);
			}
		}
	}

	function moveTabs(args: SelectedEditorsMoveCopyArguments, group: IEditorGroup, editors: EditorInput[]): void {
		const to = args.to;
		if (to === 'first' || to === 'right') {
			editors = [...editors].reverse();
		} else if (to === 'position' && (args.value ?? 1) < group.getIndexOfEditor(editors[0])) {
			editors = [...editors].reverse();
		}

		for (const editor of editors) {
			moveTab(args, group, editor);
		}
	}

	function moveTab(args: SelectedEditorsMoveCopyArguments, group: IEditorGroup, editor: EditorInput): void {
		let index = group.getIndexOfEditor(editor);
		switch (args.to) {
			case 'first':
				index = 0;
				break;
			case 'last':
				index = group.count - 1;
				break;
			case 'left':
				index = index - (args.value ?? 1);
				break;
			case 'right':
				index = index + (args.value ?? 1);
				break;
			case 'center':
				index = Math.round(group.count / 2) - 1;
				break;
			case 'position':
				index = (args.value ?? 1) - 1;
				break;
		}

		index = index < 0 ? 0 : index >= group.count ? group.count - 1 : index;
		group.moveEditor(editor, group, { index });
	}

	function moveCopyActiveEditorToGroup(isMove: boolean, args: SelectedEditorsMoveCopyArguments, sourceGroup: IEditorGroup, editors: EditorInput[], accessor: ServicesAccessor): void {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const configurationService = accessor.get(IConfigurationService);

		let targetGroup: IEditorGroup | undefined;

		switch (args.to) {
			case 'left':
				targetGroup = editorGroupsService.findGroup({ direction: GroupDirection.LEFT }, sourceGroup);
				if (!targetGroup) {
					targetGroup = editorGroupsService.addGroup(sourceGroup, GroupDirection.LEFT);
				}
				break;
			case 'right':
				targetGroup = editorGroupsService.findGroup({ direction: GroupDirection.RIGHT }, sourceGroup);
				if (!targetGroup) {
					targetGroup = editorGroupsService.addGroup(sourceGroup, GroupDirection.RIGHT);
				}
				break;
			case 'up':
				targetGroup = editorGroupsService.findGroup({ direction: GroupDirection.UP }, sourceGroup);
				if (!targetGroup) {
					targetGroup = editorGroupsService.addGroup(sourceGroup, GroupDirection.UP);
				}
				break;
			case 'down':
				targetGroup = editorGroupsService.findGroup({ direction: GroupDirection.DOWN }, sourceGroup);
				if (!targetGroup) {
					targetGroup = editorGroupsService.addGroup(sourceGroup, GroupDirection.DOWN);
				}
				break;
			case 'first':
				targetGroup = editorGroupsService.findGroup({ location: GroupLocation.FIRST }, sourceGroup);
				break;
			case 'last':
				targetGroup = editorGroupsService.findGroup({ location: GroupLocation.LAST }, sourceGroup);
				break;
			case 'previous':
				targetGroup = editorGroupsService.findGroup({ location: GroupLocation.PREVIOUS }, sourceGroup);
				if (!targetGroup) {
					const oppositeDirection = preferredSideBySideGroupDirection(configurationService) === GroupDirection.RIGHT ? GroupDirection.LEFT : GroupDirection.UP;
					targetGroup = editorGroupsService.addGroup(sourceGroup, oppositeDirection);
				}
				break;
			case 'next':
				targetGroup = editorGroupsService.findGroup({ location: GroupLocation.NEXT }, sourceGroup);
				if (!targetGroup) {
					targetGroup = editorGroupsService.addGroup(sourceGroup, preferredSideBySideGroupDirection(configurationService));
				}
				break;
			case 'center':
				targetGroup = editorGroupsService.getGroups(GroupsOrder.GRID_APPEARANCE)[(editorGroupsService.count / 2) - 1];
				break;
			case 'position':
				targetGroup = editorGroupsService.getGroups(GroupsOrder.GRID_APPEARANCE)[(args.value ?? 1) - 1];
				break;
		}

		if (targetGroup) {
			const editorsWithOptions = prepareMoveCopyEditors(sourceGroup, editors);
			if (isMove) {
				sourceGroup.moveEditors(editorsWithOptions, targetGroup);
			} else if (sourceGroup.id !== targetGroup.id) {
				sourceGroup.copyEditors(editorsWithOptions, targetGroup);
			}

			targetGroup.focus();
		}
	}
}

function registerEditorGroupsLayoutCommands(): void {

	function applyEditorLayout(accessor: ServicesAccessor, layout: EditorGroupLayout): void {
		if (!layout || typeof layout !== 'object') {
			return;
		}

		const editorGroupsService = accessor.get(IEditorGroupsService);
		editorGroupsService.applyLayout(layout);
	}

	CommandsRegistry.registerCommand(LAYOUT_EDITOR_GROUPS_COMMAND_ID, (accessor: ServicesAccessor, args: EditorGroupLayout) => {
		applyEditorLayout(accessor, args);
	});

	// API Commands
	CommandsRegistry.registerCommand({
		id: 'vscode.setEditorLayout',
		handler: (accessor: ServicesAccessor, args: EditorGroupLayout) => applyEditorLayout(accessor, args),
		metadata: {
			'description': `Set the editor layout. Editor layout is represented as a tree of groups in which the first group is the root group of the layout.
					The orientation of the first group is 0 (horizontal) by default unless specified otherwise. The other orientations are 1 (vertical).
					The orientation of subsequent groups is the opposite of the orientation of the group that contains it.
					Here are some examples: A layout representing 1 row and 2 columns: { orientation: 0, groups: [{}, {}] }.
					A layout representing 3 rows and 1 column: { orientation: 1, groups: [{}, {}, {}] }.
					A layout representing 3 rows and 1 column in which the second row has 2 columns: { orientation: 1, groups: [{}, { groups: [{}, {}] }, {}] }
					`,
			args: [{
				name: 'args',
				schema: {
					'type': 'object',
					'required': ['groups'],
					'properties': {
						'orientation': {
							'type': 'number',
							'default': 0,
							'description': `The orientation of the root group in the layout. 0 for horizontal, 1 for vertical.`,
							'enum': [0, 1],
							'enumDescriptions': [
								localize('editorGroupLayout.horizontal', "Horizontal"),
								localize('editorGroupLayout.vertical', "Vertical")
							],
						},
						'groups': {
							'$ref': '#/definitions/editorGroupsSchema',
							'default': [{}, {}]
						}
					}
				}
			}]
		}
	});

	CommandsRegistry.registerCommand({
		id: 'vscode.getEditorLayout',
		handler: (accessor: ServicesAccessor) => {
			const editorGroupsService = accessor.get(IEditorGroupsService);

			return editorGroupsService.getLayout();
		},
		metadata: {
			description: 'Get Editor Layout',
			args: [],
			returns: 'An editor layout object, in the same format as vscode.setEditorLayout'
		}
	});
}

function registerOpenEditorAPICommands(): void {

	function mixinContext(context: IOpenEvent<unknown> | undefined, options: ITextEditorOptions | undefined, column: EditorGroupColumn | undefined): [ITextEditorOptions | undefined, EditorGroupColumn | undefined] {
		if (!context) {
			return [options, column];
		}

		return [
			{ ...context.editorOptions, ...(options ?? Object.create(null)) },
			context.sideBySide ? SIDE_GROUP : column
		];
	}

	// partial, renderer-side API command to open editor only supporting
	// arguments that do not need to be converted from the extension host
	// complements https://github.com/microsoft/vscode/blob/2b164efb0e6a5de3826bff62683eaeafe032284f/src/vs/workbench/api/common/extHostApiCommands.ts#L373
	CommandsRegistry.registerCommand({
		id: 'vscode.open',
		handler: (accessor, arg) => {
			accessor.get(ICommandService).executeCommand(API_OPEN_EDITOR_COMMAND_ID, arg);
		},
		metadata: {
			description: 'Opens the provided resource in the editor.',
			args: [{ name: 'Uri' }]
		}
	});

	CommandsRegistry.registerCommand(API_OPEN_EDITOR_COMMAND_ID, async function (accessor: ServicesAccessor, resourceArg: UriComponents | string, columnAndOptions?: [EditorGroupColumn?, ITextEditorOptions?], label?: string, context?: IOpenEvent<unknown>) {
		const editorService = accessor.get(IEditorService);
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const openerService = accessor.get(IOpenerService);
		const pathService = accessor.get(IPathService);
		const configurationService = accessor.get(IConfigurationService);
		const untitledTextEditorService = accessor.get(IUntitledTextEditorService);

		const resourceOrString = typeof resourceArg === 'string' ? resourceArg : URI.from(resourceArg, true);
		const [columnArg, optionsArg] = columnAndOptions ?? [];

		// use editor options or editor view column or resource scheme
		// as a hint to use the editor service for opening directly
		if (optionsArg || typeof columnArg === 'number' || matchesScheme(resourceOrString, Schemas.untitled)) {
			const [options, column] = mixinContext(context, optionsArg, columnArg);
			const resource = URI.isUri(resourceOrString) ? resourceOrString : URI.parse(resourceOrString);

			let input: IResourceEditorInput | IUntitledTextResourceEditorInput;
			if (untitledTextEditorService.isUntitledWithAssociatedResource(resource)) {
				// special case for untitled: we are getting a resource with meaningful
				// path from an extension to use for the untitled editor. as such, we
				// have to assume it as an associated resource to use when saving. we
				// do so by setting the `forceUntitled: true` and changing the scheme
				// to a file based one. the untitled editor service takes care to
				// associate the path properly then.
				input = { resource: resource.with({ scheme: pathService.defaultUriScheme }), forceUntitled: true, options, label };
			} else {
				// use any other resource as is
				input = { resource, options, label };
			}

			await editorService.openEditor(input, columnToEditorGroup(editorGroupsService, configurationService, column));
		}

		// do not allow to execute commands from here
		else if (matchesScheme(resourceOrString, Schemas.command)) {
			return;
		}

		// finally, delegate to opener service
		else {
			await openerService.open(resourceOrString, { openToSide: context?.sideBySide, editorOptions: context?.editorOptions });
		}
	});

	// partial, renderer-side API command to open diff editor only supporting
	// arguments that do not need to be converted from the extension host
	// complements https://github.com/microsoft/vscode/blob/2b164efb0e6a5de3826bff62683eaeafe032284f/src/vs/workbench/api/common/extHostApiCommands.ts#L397
	CommandsRegistry.registerCommand({
		id: 'vscode.diff',
		handler: (accessor, left, right, label) => {
			accessor.get(ICommandService).executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, left, right, label);
		},
		metadata: {
			description: 'Opens the provided resources in the diff editor to compare their contents.',
			args: [
				{ name: 'left', description: 'Left-hand side resource of the diff editor' },
				{ name: 'right', description: 'Right-hand side resource of the diff editor' },
				{ name: 'title', description: 'Human readable title for the diff editor' },
			]
		}
	});

	CommandsRegistry.registerCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, async function (accessor: ServicesAccessor, originalResource: UriComponents, modifiedResource: UriComponents, labelAndOrDescription?: string | { label: string; description: string }, columnAndOptions?: [EditorGroupColumn?, ITextEditorOptions?], context?: IOpenEvent<unknown>) {
		const editorService = accessor.get(IEditorService);
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const configurationService = accessor.get(IConfigurationService);

		const [columnArg, optionsArg] = columnAndOptions ?? [];
		const [options, column] = mixinContext(context, optionsArg, columnArg);

		let label: string | undefined = undefined;
		let description: string | undefined = undefined;
		if (typeof labelAndOrDescription === 'string') {
			label = labelAndOrDescription;
		} else if (labelAndOrDescription) {
			label = labelAndOrDescription.label;
			description = labelAndOrDescription.description;
		}

		await editorService.openEditor({
			original: { resource: URI.from(originalResource, true) },
			modified: { resource: URI.from(modifiedResource, true) },
			label,
			description,
			options
		}, columnToEditorGroup(editorGroupsService, configurationService, column));
	});

	CommandsRegistry.registerCommand(API_OPEN_WITH_EDITOR_COMMAND_ID, async (accessor: ServicesAccessor, resource: UriComponents, id: string, columnAndOptions?: [EditorGroupColumn?, ITextEditorOptions?]) => {
		const editorService = accessor.get(IEditorService);
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const configurationService = accessor.get(IConfigurationService);

		const [columnArg, optionsArg] = columnAndOptions ?? [];

		await editorService.openEditor({ resource: URI.from(resource, true), options: { pinned: true, ...optionsArg, override: id } }, columnToEditorGroup(editorGroupsService, configurationService, columnArg));
	});

	// partial, renderer-side API command to open diff editor only supporting
	// arguments that do not need to be converted from the extension host
	// complements https://github.com/microsoft/vscode/blob/2b164efb0e6a5de3826bff62683eaeafe032284f/src/vs/workbench/api/common/extHostApiCommands.ts#L397
	CommandsRegistry.registerCommand({
		id: 'vscode.changes',
		handler: (accessor, title: string, resources: [UriComponents, UriComponents?, UriComponents?][]) => {
			accessor.get(ICommandService).executeCommand('_workbench.changes', title, resources);
		},
		metadata: {
			description: 'Opens a list of resources in the changes editor to compare their contents.',
			args: [
				{ name: 'title', description: 'Human readable title for the diff editor' },
				{ name: 'resources', description: 'List of resources to open in the changes editor' }
			]
		}
	});

	CommandsRegistry.registerCommand('_workbench.changes', async (accessor: ServicesAccessor, title: string, resources: [UriComponents, UriComponents?, UriComponents?][]) => {
		const editorService = accessor.get(IEditorService);

		const editor: (IResourceDiffEditorInput & { resource: URI })[] = [];
		for (const [label, original, modified] of resources) {
			editor.push({
				resource: URI.revive(label),
				original: { resource: URI.revive(original) },
				modified: { resource: URI.revive(modified) },
			});
		}

		await editorService.openEditor({ resources: editor, label: title });
	});

	CommandsRegistry.registerCommand('_workbench.openMultiDiffEditor', async (accessor: ServicesAccessor, options: OpenMultiFileDiffEditorOptions) => {
		const editorService = accessor.get(IEditorService);

		const resources = options.resources?.map(r => ({ original: { resource: URI.revive(r.originalUri) }, modified: { resource: URI.revive(r.modifiedUri) } }));

		const revealUri = options.reveal?.modifiedUri ? URI.revive(options.reveal.modifiedUri) : undefined;
		const revealResource = revealUri && resources ? resources.find(r => isEqual(r.modified.resource, revealUri)) : undefined;
		if (options.reveal && !revealResource) {
			console.error('Reveal resource not found');
		}

		const multiDiffEditorOptions: IMultiDiffEditorOptions = {
			viewState: revealResource ? {
				revealData: {
					resource: {
						original: revealResource.original.resource,
						modified: revealResource.modified.resource,
					},
					range: options.reveal?.range,
				}
			} : undefined
		};

		await editorService.openEditor({
			multiDiffSource: options.multiDiffSourceUri ? URI.revive(options.multiDiffSourceUri) : undefined,
			resources,
			label: options.title,
			options: multiDiffEditorOptions,
		});
	});
}

interface OpenMultiFileDiffEditorOptions {
	title: string;
	multiDiffSourceUri?: UriComponents;
	resources?: { originalUri: UriComponents; modifiedUri: UriComponents }[];
	reveal?: {
		modifiedUri: UriComponents;
		range?: IRange;
	};
}

function registerOpenEditorAtIndexCommands(): void {
	const openEditorAtIndex: ICommandHandler = (accessor: ServicesAccessor, editorIndex: unknown): void => {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane && typeof editorIndex === 'number') {
			const editor = activeEditorPane.group.getEditorByIndex(editorIndex);
			if (editor) {
				editorService.openEditor(editor);
			}
		}
	};

	// This command takes in the editor index number to open as an argument
	CommandsRegistry.registerCommand({
		id: OPEN_EDITOR_AT_INDEX_COMMAND_ID,
		handler: openEditorAtIndex
	});

	// Keybindings to focus a specific index in the tab folder if tabs are enabled
	for (let i = 0; i < 9; i++) {
		const editorIndex = i;
		const visibleIndex = i + 1;

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: OPEN_EDITOR_AT_INDEX_COMMAND_ID + visibleIndex,
			weight: KeybindingWeight.WorkbenchContrib,
			when: undefined,
			primary: KeyMod.Alt | toKeyCode(visibleIndex),
			mac: { primary: KeyMod.WinCtrl | toKeyCode(visibleIndex) },
			handler: accessor => openEditorAtIndex(accessor, editorIndex)
		});
	}

	function toKeyCode(index: number): KeyCode {
		switch (index) {
			case 0: return KeyCode.Digit0;
			case 1: return KeyCode.Digit1;
			case 2: return KeyCode.Digit2;
			case 3: return KeyCode.Digit3;
			case 4: return KeyCode.Digit4;
			case 5: return KeyCode.Digit5;
			case 6: return KeyCode.Digit6;
			case 7: return KeyCode.Digit7;
			case 8: return KeyCode.Digit8;
			case 9: return KeyCode.Digit9;
		}

		throw new Error('invalid index');
	}
}

function registerFocusEditorGroupAtIndexCommands(): void {

	// Keybindings to focus a specific group (2-8) in the editor area
	for (let groupIndex = 1; groupIndex < 8; groupIndex++) {
		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: toCommandId(groupIndex),
			weight: KeybindingWeight.WorkbenchContrib,
			when: undefined,
			primary: KeyMod.CtrlCmd | toKeyCode(groupIndex),
			handler: accessor => {
				const editorGroupsService = accessor.get(IEditorGroupsService);
				const configurationService = accessor.get(IConfigurationService);

				// To keep backwards compatibility (pre-grid), allow to focus a group
				// that does not exist as long as it is the next group after the last
				// opened group. Otherwise we return.
				if (groupIndex > editorGroupsService.count) {
					return;
				}

				// Group exists: just focus
				const groups = editorGroupsService.getGroups(GroupsOrder.GRID_APPEARANCE);
				if (groups[groupIndex]) {
					return groups[groupIndex].focus();
				}

				// Group does not exist: create new by splitting the active one of the last group
				const direction = preferredSideBySideGroupDirection(configurationService);
				const lastGroup = editorGroupsService.findGroup({ location: GroupLocation.LAST });
				if (!lastGroup) {
					return;
				}

				const newGroup = editorGroupsService.addGroup(lastGroup, direction);

				// Focus
				newGroup.focus();
			}
		});
	}

	function toCommandId(index: number): string {
		switch (index) {
			case 1: return 'workbench.action.focusSecondEditorGroup';
			case 2: return 'workbench.action.focusThirdEditorGroup';
			case 3: return 'workbench.action.focusFourthEditorGroup';
			case 4: return 'workbench.action.focusFifthEditorGroup';
			case 5: return 'workbench.action.focusSixthEditorGroup';
			case 6: return 'workbench.action.focusSeventhEditorGroup';
			case 7: return 'workbench.action.focusEighthEditorGroup';
		}

		throw new Error('Invalid index');
	}

	function toKeyCode(index: number): KeyCode {
		switch (index) {
			case 1: return KeyCode.Digit2;
			case 2: return KeyCode.Digit3;
			case 3: return KeyCode.Digit4;
			case 4: return KeyCode.Digit5;
			case 5: return KeyCode.Digit6;
			case 6: return KeyCode.Digit7;
			case 7: return KeyCode.Digit8;
		}

		throw new Error('Invalid index');
	}
}

export function splitEditor(editorGroupsService: IEditorGroupsService, direction: GroupDirection, resolvedContext: IResolvedEditorCommandsContext): void {
	if (!resolvedContext.groupedEditors.length) {
		return;
	}

	// Only support splitting from one source group
	const { group, editors } = resolvedContext.groupedEditors[0];
	const preserveFocus = resolvedContext.preserveFocus;
	const newGroup = editorGroupsService.addGroup(group, direction);

	for (const editorToCopy of editors) {
		// Split editor (if it can be split)
		if (editorToCopy && !editorToCopy.hasCapability(EditorInputCapabilities.Singleton)) {
			group.copyEditor(editorToCopy, newGroup, { preserveFocus });
		}
	}

	// Focus
	newGroup.focus();
}

function registerSplitEditorCommands() {
	[
		{ id: SPLIT_EDITOR_UP, direction: GroupDirection.UP },
		{ id: SPLIT_EDITOR_DOWN, direction: GroupDirection.DOWN },
		{ id: SPLIT_EDITOR_LEFT, direction: GroupDirection.LEFT },
		{ id: SPLIT_EDITOR_RIGHT, direction: GroupDirection.RIGHT }
	].forEach(({ id, direction }) => {
		CommandsRegistry.registerCommand(id, function (accessor, ...args) {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			splitEditor(accessor.get(IEditorGroupsService), direction, resolvedContext);
		});
	});
}

function registerCloseEditorCommands() {

	// A special handler for "Close Editor" depending on context
	// - keybindining: do not close sticky editors, rather open the next non-sticky editor
	// - menu: always close editor, even sticky ones
	function closeEditorHandler(accessor: ServicesAccessor, forceCloseStickyEditors: boolean, ...args: unknown[]): Promise<unknown> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);

		let keepStickyEditors: boolean | undefined = undefined;
		if (forceCloseStickyEditors) {
			keepStickyEditors = false; // explicitly close sticky editors
		} else if (args.length) {
			keepStickyEditors = false; // we have a context, as such this command was used e.g. from the tab context menu
		} else {
			keepStickyEditors = editorGroupsService.partOptions.preventPinnedEditorClose === 'keyboard' || editorGroupsService.partOptions.preventPinnedEditorClose === 'keyboardAndMouse'; // respect setting otherwise
		}

		// Skip over sticky editor and select next if we are configured to do so
		if (keepStickyEditors) {
			const activeGroup = editorGroupsService.activeGroup;
			const activeEditor = activeGroup.activeEditor;

			if (activeEditor && activeGroup.isSticky(activeEditor)) {

				// Open next recently active in same group
				const nextNonStickyEditorInGroup = activeGroup.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true })[0];
				if (nextNonStickyEditorInGroup) {
					return activeGroup.openEditor(nextNonStickyEditorInGroup);
				}

				// Open next recently active across all groups
				const nextNonStickyEditorInAllGroups = editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, { excludeSticky: true })[0];
				if (nextNonStickyEditorInAllGroups) {
					return Promise.resolve(editorGroupsService.getGroup(nextNonStickyEditorInAllGroups.groupId)?.openEditor(nextNonStickyEditorInAllGroups.editor));
				}
			}
		}

		// With context: proceed to close editors as instructed
		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
		const preserveFocus = resolvedContext.preserveFocus;

		return Promise.all(resolvedContext.groupedEditors.map(async ({ group, editors }) => {
			const editorsToClose = editors.filter(editor => !keepStickyEditors || !group.isSticky(editor));
			await group.closeEditors(editorsToClose, { preserveFocus });
		}));
	}

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: KeyMod.CtrlCmd | KeyCode.KeyW,
		win: { primary: KeyMod.CtrlCmd | KeyCode.F4, secondary: [KeyMod.CtrlCmd | KeyCode.KeyW] },
		handler: (accessor, ...args: unknown[]) => {
			return closeEditorHandler(accessor, false, ...args);
		}
	});

	CommandsRegistry.registerCommand(CLOSE_PINNED_EDITOR_COMMAND_ID, (accessor, ...args: unknown[]) => {
		return closeEditorHandler(accessor, true /* force close pinned editors */, ...args);
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyW),
		handler: (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			return Promise.all(resolvedContext.groupedEditors.map(async ({ group }) => {
				await group.closeAllEditors({ excludeSticky: true });
			}));
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_EDITOR_GROUP_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(ActiveEditorGroupEmptyContext, MultipleEditorGroupsContext),
		primary: KeyMod.CtrlCmd | KeyCode.KeyW,
		win: { primary: KeyMod.CtrlCmd | KeyCode.F4, secondary: [KeyMod.CtrlCmd | KeyCode.KeyW] },
		handler: (accessor, ...args: unknown[]) => {
			const editorGroupsService = accessor.get(IEditorGroupsService);
			const commandsContext = resolveCommandsContext(args, accessor.get(IEditorService), editorGroupsService, accessor.get(IListService));

			if (commandsContext.groupedEditors.length) {
				editorGroupsService.removeGroup(commandsContext.groupedEditors[0].group);
			}
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_SAVED_EDITORS_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyU),
		handler: (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			return Promise.all(resolvedContext.groupedEditors.map(async ({ group }) => {
				await group.closeEditors({ savedOnly: true, excludeSticky: true }, { preserveFocus: resolvedContext.preserveFocus });
			}));
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyT },
		handler: (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));

			return Promise.all(resolvedContext.groupedEditors.map(async ({ group, editors }) => {
				const editorsToClose = group.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: true }).filter(editor => !editors.includes(editor));

				for (const editorToKeep of editors) {
					if (editorToKeep) {
						group.pinEditor(editorToKeep);
					}
				}

				await group.closeEditors(editorsToClose, { preserveFocus: resolvedContext.preserveFocus });
			}));
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: async (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			if (resolvedContext.groupedEditors.length) {
				const { group, editors } = resolvedContext.groupedEditors[0];
				if (group.activeEditor) {
					group.pinEditor(group.activeEditor);
				}

				await group.closeEditors({ direction: CloseDirection.RIGHT, except: editors[0], excludeSticky: true }, { preserveFocus: resolvedContext.preserveFocus });
			}
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: REOPEN_WITH_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args: unknown[]) => {
			return reopenEditorWith(accessor, EditorResolution.PICK, ...args);
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: REOPEN_ACTIVE_EDITOR_WITH_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, override?: string, ...args: unknown[]) => {
			return reopenEditorWith(accessor, override ?? EditorResolution.PICK, ...args);
		}
	});

	async function reopenEditorWith(accessor: ServicesAccessor, editorOverride: string | EditorResolution, ...args: unknown[]) {
		const editorService = accessor.get(IEditorService);
		const editorResolverService = accessor.get(IEditorResolverService);
		const telemetryService = accessor.get(ITelemetryService);

		const resolvedContext = resolveCommandsContext(args, editorService, accessor.get(IEditorGroupsService), accessor.get(IListService));
		const editorReplacements = new Map<IEditorGroup, IEditorReplacement[]>();

		for (const { group, editors } of resolvedContext.groupedEditors) {
			for (const editor of editors) {
				const untypedEditor = editor.toUntyped();
				if (!untypedEditor) {
					return; // Resolver can only resolve untyped editors
				}

				untypedEditor.options = { ...editorService.activeEditorPane?.options, override: editorOverride };
				const resolvedEditor = await editorResolverService.resolveEditor(untypedEditor, group);
				if (!isEditorInputWithOptionsAndGroup(resolvedEditor)) {
					return;
				}

				let editorReplacementsInGroup = editorReplacements.get(group);
				if (!editorReplacementsInGroup) {
					editorReplacementsInGroup = [];
					editorReplacements.set(group, editorReplacementsInGroup);
				}

				editorReplacementsInGroup.push({
					editor: editor,
					replacement: resolvedEditor.editor,
					forceReplaceDirty: editor.resource?.scheme === Schemas.untitled,
					options: resolvedEditor.options
				});

				// Telemetry
				type WorkbenchEditorReopenClassification = {
					owner: 'rebornix';
					comment: 'Identify how a document is reopened';
					scheme: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'File system provider scheme for the resource' };
					ext: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'File extension for the resource' };
					from: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The editor view type the resource is switched from' };
					to: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The editor view type the resource is switched to' };
				};

				type WorkbenchEditorReopenEvent = {
					scheme: string;
					ext: string;
					from: string;
					to: string;
				};

				telemetryService.publicLog2<WorkbenchEditorReopenEvent, WorkbenchEditorReopenClassification>('workbenchEditorReopen', {
					scheme: editor.resource?.scheme ?? '',
					ext: editor.resource ? extname(editor.resource) : '',
					from: editor.editorId ?? '',
					to: resolvedEditor.editor.editorId ?? ''
				});
			}
		}

		// Replace editor with resolved one and make active
		for (const [group, replacements] of editorReplacements) {
			await group.replaceEditors(replacements);
			await group.openEditor(replacements[0].replacement);
		}
	}

	CommandsRegistry.registerCommand(CLOSE_EDITORS_AND_GROUP_COMMAND_ID, async (accessor: ServicesAccessor, ...args: unknown[]) => {
		const editorGroupsService = accessor.get(IEditorGroupsService);

		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), editorGroupsService, accessor.get(IListService));
		if (resolvedContext.groupedEditors.length) {
			const { group } = resolvedContext.groupedEditors[0];
			await group.closeAllEditors();

			if (group.count === 0 && editorGroupsService.getGroup(group.id) /* could be gone by now */) {
				editorGroupsService.removeGroup(group); // only remove group if it is now empty
			}
		}
	});
}

function registerFocusEditorGroupWihoutWrapCommands(): void {

	const commands = [
		{
			id: FOCUS_LEFT_GROUP_WITHOUT_WRAP_COMMAND_ID,
			direction: GroupDirection.LEFT
		},
		{
			id: FOCUS_RIGHT_GROUP_WITHOUT_WRAP_COMMAND_ID,
			direction: GroupDirection.RIGHT
		},
		{
			id: FOCUS_ABOVE_GROUP_WITHOUT_WRAP_COMMAND_ID,
			direction: GroupDirection.UP,
		},
		{
			id: FOCUS_BELOW_GROUP_WITHOUT_WRAP_COMMAND_ID,
			direction: GroupDirection.DOWN
		}
	];

	for (const command of commands) {
		CommandsRegistry.registerCommand(command.id, async (accessor: ServicesAccessor) => {
			const editorGroupsService = accessor.get(IEditorGroupsService);

			const group = editorGroupsService.findGroup({ direction: command.direction }, editorGroupsService.activeGroup, false) ?? editorGroupsService.activeGroup;
			group.focus();
		});
	}
}

function registerSplitEditorInGroupCommands(): void {

	async function splitEditorInGroup(accessor: ServicesAccessor, resolvedContext: IResolvedEditorCommandsContext): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);

		if (!resolvedContext.groupedEditors.length) {
			return;
		}

		const { group, editors } = resolvedContext.groupedEditors[0];
		const editor = editors[0];
		if (!editor) {
			return;
		}

		await group.replaceEditors([{
			editor,
			replacement: instantiationService.createInstance(SideBySideEditorInput, undefined, undefined, editor, editor),
			forceReplaceDirty: true
		}]);
	}

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: SPLIT_EDITOR_IN_GROUP,
				title: localize2('splitEditorInGroup', 'Split Editor in Group'),
				category: Categories.View,
				precondition: ActiveEditorCanSplitInGroupContext,
				f1: true,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					when: ActiveEditorCanSplitInGroupContext,
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backslash)
				}
			});
		}
		run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			return splitEditorInGroup(accessor, resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService)));
		}
	});

	async function joinEditorInGroup(resolvedContext: IResolvedEditorCommandsContext): Promise<void> {
		if (!resolvedContext.groupedEditors.length) {
			return;
		}

		const { group, editors } = resolvedContext.groupedEditors[0];
		const editor = editors[0];
		if (!editor) {
			return;
		}

		if (!(editor instanceof SideBySideEditorInput)) {
			return;
		}

		let options: IEditorOptions | undefined = undefined;
		const activeEditorPane = group.activeEditorPane;
		if (activeEditorPane instanceof SideBySideEditor && group.activeEditor === editor) {
			for (const pane of [activeEditorPane.getPrimaryEditorPane(), activeEditorPane.getSecondaryEditorPane()]) {
				if (pane?.hasFocus()) {
					options = { viewState: pane.getViewState() };
					break;
				}
			}
		}

		await group.replaceEditors([{
			editor,
			replacement: editor.primary,
			options
		}]);
	}

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: JOIN_EDITOR_IN_GROUP,
				title: localize2('joinEditorInGroup', 'Join Editor in Group'),
				category: Categories.View,
				precondition: SideBySideEditorActiveContext,
				f1: true,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					when: SideBySideEditorActiveContext,
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backslash)
				}
			});
		}
		run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			return joinEditorInGroup(resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService)));
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: TOGGLE_SPLIT_EDITOR_IN_GROUP,
				title: localize2('toggleJoinEditorInGroup', 'Toggle Split Editor in Group'),
				category: Categories.View,
				precondition: ContextKeyExpr.or(ActiveEditorCanSplitInGroupContext, SideBySideEditorActiveContext),
				f1: true
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			if (!resolvedContext.groupedEditors.length) {
				return;
			}

			const { editors } = resolvedContext.groupedEditors[0];

			if (editors[0] instanceof SideBySideEditorInput) {
				await joinEditorInGroup(resolvedContext);
			} else if (editors[0]) {
				await splitEditorInGroup(accessor, resolvedContext);
			}
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: TOGGLE_SPLIT_EDITOR_IN_GROUP_LAYOUT,
				title: localize2('toggleSplitEditorInGroupLayout', 'Toggle Layout of Split Editor in Group'),
				category: Categories.View,
				precondition: SideBySideEditorActiveContext,
				f1: true
			});
		}
		async run(accessor: ServicesAccessor): Promise<void> {
			const configurationService = accessor.get(IConfigurationService);
			const currentSetting = configurationService.getValue<unknown>(SideBySideEditor.SIDE_BY_SIDE_LAYOUT_SETTING);

			let newSetting: 'vertical' | 'horizontal';
			if (currentSetting !== 'horizontal') {
				newSetting = 'horizontal';
			} else {
				newSetting = 'vertical';
			}

			return configurationService.updateValue(SideBySideEditor.SIDE_BY_SIDE_LAYOUT_SETTING, newSetting);
		}
	});
}

function registerFocusSideEditorsCommands(): void {

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: FOCUS_FIRST_SIDE_EDITOR,
				title: localize2('focusLeftSideEditor', 'Focus First Side in Active Editor'),
				category: Categories.View,
				precondition: ContextKeyExpr.or(SideBySideEditorActiveContext, TextCompareEditorActiveContext),
				f1: true
			});
		}
		async run(accessor: ServicesAccessor): Promise<void> {
			const editorService = accessor.get(IEditorService);
			const commandService = accessor.get(ICommandService);

			const activeEditorPane = editorService.activeEditorPane;
			if (activeEditorPane instanceof SideBySideEditor) {
				activeEditorPane.getSecondaryEditorPane()?.focus();
			} else if (activeEditorPane instanceof TextDiffEditor) {
				await commandService.executeCommand(DIFF_FOCUS_SECONDARY_SIDE);
			}
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: FOCUS_SECOND_SIDE_EDITOR,
				title: localize2('focusRightSideEditor', 'Focus Second Side in Active Editor'),
				category: Categories.View,
				precondition: ContextKeyExpr.or(SideBySideEditorActiveContext, TextCompareEditorActiveContext),
				f1: true
			});
		}
		async run(accessor: ServicesAccessor): Promise<void> {
			const editorService = accessor.get(IEditorService);
			const commandService = accessor.get(ICommandService);

			const activeEditorPane = editorService.activeEditorPane;
			if (activeEditorPane instanceof SideBySideEditor) {
				activeEditorPane.getPrimaryEditorPane()?.focus();
			} else if (activeEditorPane instanceof TextDiffEditor) {
				await commandService.executeCommand(DIFF_FOCUS_PRIMARY_SIDE);
			}
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: FOCUS_OTHER_SIDE_EDITOR,
				title: localize2('focusOtherSideEditor', 'Focus Other Side in Active Editor'),
				category: Categories.View,
				precondition: ContextKeyExpr.or(SideBySideEditorActiveContext, TextCompareEditorActiveContext),
				f1: true
			});
		}
		async run(accessor: ServicesAccessor): Promise<void> {
			const editorService = accessor.get(IEditorService);
			const commandService = accessor.get(ICommandService);

			const activeEditorPane = editorService.activeEditorPane;
			if (activeEditorPane instanceof SideBySideEditor) {
				if (activeEditorPane.getPrimaryEditorPane()?.hasFocus()) {
					activeEditorPane.getSecondaryEditorPane()?.focus();
				} else {
					activeEditorPane.getPrimaryEditorPane()?.focus();
				}
			} else if (activeEditorPane instanceof TextDiffEditor) {
				await commandService.executeCommand(DIFF_FOCUS_OTHER_SIDE);
			}
		}
	});
}

function registerOtherEditorCommands(): void {

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: KEEP_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.Enter),
		handler: async (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			for (const { group, editors } of resolvedContext.groupedEditors) {
				for (const editor of editors) {
					group.pinEditor(editor);
				}
			}
		}
	});

	CommandsRegistry.registerCommand({
		id: TOGGLE_KEEP_EDITORS_COMMAND_ID,
		handler: accessor => {
			const configurationService = accessor.get(IConfigurationService);

			const currentSetting = configurationService.getValue('workbench.editor.enablePreview');
			const newSetting = currentSetting !== true;
			configurationService.updateValue('workbench.editor.enablePreview', newSetting);
		}
	});

	function setEditorGroupLock(accessor: ServicesAccessor, locked: boolean | undefined, ...args: unknown[]): void {
		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
		const group = resolvedContext.groupedEditors[0]?.group;
		group?.lock(locked ?? !group.isLocked);
	}

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: TOGGLE_LOCK_GROUP_COMMAND_ID,
				title: localize2('toggleEditorGroupLock', 'Toggle Editor Group Lock'),
				category: Categories.View,
				f1: true
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			setEditorGroupLock(accessor, undefined, ...args);
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: LOCK_GROUP_COMMAND_ID,
				title: localize2('lockEditorGroup', 'Lock Editor Group'),
				category: Categories.View,
				precondition: ActiveEditorGroupLockedContext.toNegated(),
				f1: true
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			setEditorGroupLock(accessor, true, ...args);
		}
	});

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: UNLOCK_GROUP_COMMAND_ID,
				title: localize2('unlockEditorGroup', 'Unlock Editor Group'),
				precondition: ActiveEditorGroupLockedContext,
				category: Categories.View,
				f1: true
			});
		}
		async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
			setEditorGroupLock(accessor, false, ...args);
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: PIN_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ActiveEditorStickyContext.toNegated(),
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.Shift | KeyCode.Enter),
		handler: async (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			for (const { group, editors } of resolvedContext.groupedEditors) {
				for (const editor of editors) {
					group.stickEditor(editor);
				}
			}
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: UNPIN_EDITOR_COMMAND_ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ActiveEditorStickyContext,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.Shift | KeyCode.Enter),
		handler: async (accessor, ...args: unknown[]) => {
			const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
			for (const { group, editors } of resolvedContext.groupedEditors) {
				for (const editor of editors) {
					group.unstickEditor(editor);
				}
			}
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: SHOW_EDITORS_IN_GROUP,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args: unknown[]) => {
			const editorGroupsService = accessor.get(IEditorGroupsService);
			const quickInputService = accessor.get(IQuickInputService);

			const commandsContext = resolveCommandsContext(args, accessor.get(IEditorService), editorGroupsService, accessor.get(IListService));
			const group = commandsContext.groupedEditors[0]?.group;
			if (group) {
				editorGroupsService.activateGroup(group); // we need the group to be active
			}

			return quickInputService.quickAccess.show(ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX);
		}
	});
}

export function setup(): void {
	registerActiveEditorMoveCopyCommand();
	registerEditorGroupsLayoutCommands();
	registerDiffEditorCommands();
	registerOpenEditorAPICommands();
	registerOpenEditorAtIndexCommands();
	registerCloseEditorCommands();
	registerOtherEditorCommands();
	registerSplitEditorInGroupCommands();
	registerFocusSideEditorsCommands();
	registerFocusEditorGroupAtIndexCommands();
	registerSplitEditorCommands();
	registerFocusEditorGroupWihoutWrapCommands();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorCommandsContext.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorCommandsContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveElement } from '../../../../base/browser/dom.js';
import { List } from '../../../../base/browser/ui/list/listWidget.js';
import { URI } from '../../../../base/common/uri.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { IEditorCommandsContext, isEditorCommandsContext, IEditorIdentifier, isEditorIdentifier } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService, isEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export interface IResolvedEditorCommandsContext {
	readonly groupedEditors: {
		readonly group: IEditorGroup;
		readonly editors: EditorInput[];
	}[];
	readonly preserveFocus: boolean;
}

export function resolveCommandsContext(commandArgs: unknown[], editorService: IEditorService, editorGroupsService: IEditorGroupsService, listService: IListService): IResolvedEditorCommandsContext {

	const commandContext = getCommandsContext(commandArgs, editorService, editorGroupsService, listService);
	const preserveFocus = commandContext.length ? commandContext[0].preserveFocus || false : false;
	const resolvedContext: IResolvedEditorCommandsContext = { groupedEditors: [], preserveFocus };

	for (const editorContext of commandContext) {
		const groupAndEditor = getEditorAndGroupFromContext(editorContext, editorGroupsService);
		if (!groupAndEditor) {
			continue;
		}

		const { group, editor } = groupAndEditor;

		// Find group context if already added
		let groupContext = undefined;
		for (const targetGroupContext of resolvedContext.groupedEditors) {
			if (targetGroupContext.group.id === group.id) {
				groupContext = targetGroupContext;
				break;
			}
		}

		// Otherwise add new group context
		if (!groupContext) {
			groupContext = { group, editors: [] };
			resolvedContext.groupedEditors.push(groupContext);
		}

		// Add editor to group context
		if (editor) {
			groupContext.editors.push(editor);
		}
	}

	return resolvedContext;
}

function getCommandsContext(commandArgs: unknown[], editorService: IEditorService, editorGroupsService: IEditorGroupsService, listService: IListService): IEditorCommandsContext[] {
	// Figure out if command is executed from a list
	const list = listService.lastFocusedList;
	let isListAction = list instanceof List && list.getHTMLElement() === getActiveElement();

	// Get editor context for which the command was triggered
	let editorContext = getEditorContextFromCommandArgs(commandArgs, isListAction, editorService, editorGroupsService, listService);

	// If the editor context can not be determind use the active editor
	if (!editorContext) {
		const activeGroup = editorGroupsService.activeGroup;
		const activeEditor = activeGroup.activeEditor;
		editorContext = { groupId: activeGroup.id, editorIndex: activeEditor ? activeGroup.getIndexOfEditor(activeEditor) : undefined };
		isListAction = false;
	}

	const multiEditorContext = getMultiSelectContext(editorContext, isListAction, editorService, editorGroupsService, listService);

	// Make sure the command context is the first one in the list
	return moveCurrentEditorContextToFront(editorContext, multiEditorContext);
}

function moveCurrentEditorContextToFront(editorContext: IEditorCommandsContext, multiEditorContext: IEditorCommandsContext[]): IEditorCommandsContext[] {
	if (multiEditorContext.length <= 1) {
		return multiEditorContext;
	}

	const editorContextIndex = multiEditorContext.findIndex(context =>
		context.groupId === editorContext.groupId &&
		context.editorIndex === editorContext.editorIndex
	);

	if (editorContextIndex !== -1) {
		multiEditorContext.splice(editorContextIndex, 1);
		multiEditorContext.unshift(editorContext);
	} else if (editorContext.editorIndex === undefined) {
		multiEditorContext.unshift(editorContext);
	} else {
		throw new Error('Editor context not found in multi editor context');
	}

	return multiEditorContext;
}

function getEditorContextFromCommandArgs(commandArgs: unknown[], isListAction: boolean, editorService: IEditorService, editorGroupsService: IEditorGroupsService, listService: IListService): IEditorCommandsContext | undefined {
	// We only know how to extraxt the command context from URI and IEditorCommandsContext arguments
	const filteredArgs = commandArgs.filter(arg => isEditorCommandsContext(arg) || URI.isUri(arg));

	// If the command arguments contain an editor context, use it
	for (const arg of filteredArgs) {
		if (isEditorCommandsContext(arg)) {
			return arg;
		}
	}

	// Otherwise, try to find the editor group by the URI of the resource
	for (const uri of filteredArgs as URI[]) {
		const editorIdentifiers = editorService.findEditors(uri);
		if (editorIdentifiers.length) {
			const editorIdentifier = editorIdentifiers[0];
			const group = editorGroupsService.getGroup(editorIdentifier.groupId);
			return { groupId: editorIdentifier.groupId, editorIndex: group?.getIndexOfEditor(editorIdentifier.editor) };
		}
	}

	// If there is no context in the arguments, try to find the context from the focused list
	// if the action was executed from a list
	if (isListAction) {
		const list = listService.lastFocusedList as List<unknown>;
		for (const focusedElement of list.getFocusedElements()) {
			if (isGroupOrEditor(focusedElement)) {
				return groupOrEditorToEditorContext(focusedElement, undefined, editorGroupsService);
			}
		}
	}

	return undefined;
}

function getMultiSelectContext(editorContext: IEditorCommandsContext, isListAction: boolean, editorService: IEditorService, editorGroupsService: IEditorGroupsService, listService: IListService): IEditorCommandsContext[] {

	// If the action was executed from a list, return all selected editors
	if (isListAction) {
		const list = listService.lastFocusedList as List<unknown>;
		const selection = list.getSelectedElements().filter(isGroupOrEditor);

		if (selection.length > 1) {
			return selection.map(e => groupOrEditorToEditorContext(e, editorContext.preserveFocus, editorGroupsService));
		}

		if (selection.length === 0) {
			// TODO@benibenj workaround for https://github.com/microsoft/vscode/issues/224050
			// Explainer: the `isListAction` flag can be a false positive in certain cases because
			// it will be `true` if the active element is a `List` even if it is part of the editor
			// area. The workaround here is to fallback to `isListAction: false` if the list is not
			// having any editor or group selected.
			return getMultiSelectContext(editorContext, false, editorService, editorGroupsService, listService);
		}
	}
	// Check editors selected in the group (tabs)
	else {
		const group = editorGroupsService.getGroup(editorContext.groupId);
		const editor = editorContext.editorIndex !== undefined ? group?.getEditorByIndex(editorContext.editorIndex) : group?.activeEditor;
		// If the editor is selected, return all selected editors otherwise only use the editors context
		if (group && editor && group.isSelected(editor)) {
			return group.selectedEditors.map(editor => groupOrEditorToEditorContext({ editor, groupId: group.id }, editorContext.preserveFocus, editorGroupsService));
		}
	}

	// Otherwise go with passed in context
	return [editorContext];
}

function groupOrEditorToEditorContext(element: IEditorIdentifier | IEditorGroup, preserveFocus: boolean | undefined, editorGroupsService: IEditorGroupsService): IEditorCommandsContext {
	if (isEditorGroup(element)) {
		return { groupId: element.id, editorIndex: undefined, preserveFocus };
	}

	const group = editorGroupsService.getGroup(element.groupId);

	return { groupId: element.groupId, editorIndex: group ? group.getIndexOfEditor(element.editor) : -1, preserveFocus };
}

function isGroupOrEditor(element: unknown): element is IEditorIdentifier | IEditorGroup {
	return isEditorGroup(element) || isEditorIdentifier(element);
}

function getEditorAndGroupFromContext(commandContext: IEditorCommandsContext, editorGroupsService: IEditorGroupsService): { group: IEditorGroup; editor: EditorInput | undefined } | undefined {
	const group = editorGroupsService.getGroup(commandContext.groupId);
	if (!group) {
		return undefined;
	}

	if (commandContext.editorIndex === undefined) {
		return { group, editor: undefined };
	}

	const editor = group.getEditorByIndex(commandContext.editorIndex);
	return { group, editor };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorConfiguration.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, IConfigurationNode, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { IEditorResolverService, RegisteredEditorInfo, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { Event } from '../../../../base/common/event.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { ByteSize, getLargeFileConfirmationLimit } from '../../../../platform/files/common/files.js';

export class DynamicEditorConfigurations extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dynamicEditorConfigurations';

	private static readonly AUTO_LOCK_DEFAULT_ENABLED = new Set<string>([
		'terminalEditor',
		'mainThreadWebview-simpleBrowser.view',
		'mainThreadWebview-browserPreview',
		'workbench.editor.processExplorer'
	]);

	private static readonly AUTO_LOCK_EXTRA_EDITORS: RegisteredEditorInfo[] = [

		// List some editor input identifiers that are not
		// registered yet via the editor resolver infrastructure

		{
			id: 'workbench.input.interactive',
			label: localize('interactiveWindow', 'Interactive Window'),
			priority: RegisteredEditorPriority.builtin
		},
		{
			id: 'mainThreadWebview-markdown.preview',
			label: localize('markdownPreview', "Markdown Preview"),
			priority: RegisteredEditorPriority.builtin
		},
		{
			id: 'mainThreadWebview-simpleBrowser.view',
			label: localize('simpleBrowser', "Simple Browser"),
			priority: RegisteredEditorPriority.builtin
		},
		{
			id: 'mainThreadWebview-browserPreview',
			label: localize('livePreview', "Live Preview"),
			priority: RegisteredEditorPriority.builtin
		}
	];

	private static readonly AUTO_LOCK_REMOVE_EDITORS = new Set<string>([

		// List some editor types that the above `AUTO_LOCK_EXTRA_EDITORS`
		// already covers to avoid duplicates.

		'vscode-interactive-input',
		'interactive',
		'vscode.markdown.preview.editor'
	]);

	private readonly configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

	private autoLockConfigurationNode: IConfigurationNode | undefined;
	private defaultBinaryEditorConfigurationNode: IConfigurationNode | undefined;
	private editorAssociationsConfigurationNode: IConfigurationNode | undefined;
	private editorLargeFileConfirmationConfigurationNode: IConfigurationNode | undefined;

	constructor(
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IExtensionService extensionService: IExtensionService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService
	) {
		super();

		// Editor configurations are getting updated very aggressively
		// (atleast 20 times) while the extensions are getting registered.
		// As such push out the dynamic configuration until after extensions
		// are registered.
		(async () => {
			await extensionService.whenInstalledExtensionsRegistered();

			this.updateDynamicEditorConfigurations();
			this.registerListeners();
		})();
	}

	private registerListeners(): void {

		// Registered editors (debounced to reduce perf overhead)
		this._register(Event.debounce(this.editorResolverService.onDidChangeEditorRegistrations, (_, e) => e)(() => this.updateDynamicEditorConfigurations()));
	}

	private updateDynamicEditorConfigurations(): void {
		const lockableEditors = [...this.editorResolverService.getEditors(), ...DynamicEditorConfigurations.AUTO_LOCK_EXTRA_EDITORS].filter(e => !DynamicEditorConfigurations.AUTO_LOCK_REMOVE_EDITORS.has(e.id));
		const binaryEditorCandidates = this.editorResolverService.getEditors().filter(e => e.priority !== RegisteredEditorPriority.exclusive).map(e => e.id);

		// Build config from registered editors
		const autoLockGroupConfiguration: IJSONSchemaMap = Object.create(null);
		for (const editor of lockableEditors) {
			autoLockGroupConfiguration[editor.id] = {
				type: 'boolean',
				default: DynamicEditorConfigurations.AUTO_LOCK_DEFAULT_ENABLED.has(editor.id),
				description: editor.label
			};
		}

		// Build default config too
		const defaultAutoLockGroupConfiguration = Object.create(null);
		for (const editor of lockableEditors) {
			defaultAutoLockGroupConfiguration[editor.id] = DynamicEditorConfigurations.AUTO_LOCK_DEFAULT_ENABLED.has(editor.id);
		}

		// Register setting for auto locking groups
		const oldAutoLockConfigurationNode = this.autoLockConfigurationNode;
		this.autoLockConfigurationNode = {
			...workbenchConfigurationNodeBase,
			properties: {
				'workbench.editor.autoLockGroups': {
					type: 'object',
					description: localize('workbench.editor.autoLockGroups', "If an editor matching one of the listed types is opened as the first in an editor group and more than one group is open, the group is automatically locked. Locked groups will only be used for opening editors when explicitly chosen by a user gesture (for example drag and drop), but not by default. Consequently, the active editor in a locked group is less likely to be replaced accidentally with a different editor."),
					properties: autoLockGroupConfiguration,
					default: defaultAutoLockGroupConfiguration,
					additionalProperties: false
				}
			}
		};

		// Registers setting for default binary editors
		const oldDefaultBinaryEditorConfigurationNode = this.defaultBinaryEditorConfigurationNode;
		this.defaultBinaryEditorConfigurationNode = {
			...workbenchConfigurationNodeBase,
			properties: {
				'workbench.editor.defaultBinaryEditor': {
					type: 'string',
					default: '',
					// This allows for intellisense autocompletion
					enum: [...binaryEditorCandidates, ''],
					description: localize('workbench.editor.defaultBinaryEditor', "The default editor for files detected as binary. If undefined, the user will be presented with a picker."),
				}
			}
		};

		// Registers setting for editorAssociations
		const oldEditorAssociationsConfigurationNode = this.editorAssociationsConfigurationNode;
		this.editorAssociationsConfigurationNode = {
			...workbenchConfigurationNodeBase,
			properties: {
				'workbench.editorAssociations': {
					type: 'object',
					markdownDescription: localize('editor.editorAssociations', "Configure [glob patterns](https://aka.ms/vscode-glob-patterns) to editors (for example `\"*.hex\": \"hexEditor.hexedit\"`). These have precedence over the default behavior."),
					patternProperties: {
						'.*': {
							type: 'string',
							enum: binaryEditorCandidates,
						}
					}
				}
			}
		};

		// Registers setting for large file confirmation based on environment
		const oldEditorLargeFileConfirmationConfigurationNode = this.editorLargeFileConfirmationConfigurationNode;
		this.editorLargeFileConfirmationConfigurationNode = {
			...workbenchConfigurationNodeBase,
			properties: {
				'workbench.editorLargeFileConfirmation': {
					type: 'number',
					default: getLargeFileConfirmationLimit(this.environmentService.remoteAuthority) / ByteSize.MB,
					minimum: 1,
					scope: ConfigurationScope.RESOURCE,
					markdownDescription: localize('editorLargeFileSizeConfirmation', "Controls the minimum size of a file in MB before asking for confirmation when opening in the editor. Note that this setting may not apply to all editor types and environments."),
				}
			}
		};

		this.configurationRegistry.updateConfigurations({
			add: [
				this.autoLockConfigurationNode,
				this.defaultBinaryEditorConfigurationNode,
				this.editorAssociationsConfigurationNode,
				this.editorLargeFileConfirmationConfigurationNode
			],
			remove: coalesce([
				oldAutoLockConfigurationNode,
				oldDefaultBinaryEditorConfigurationNode,
				oldEditorAssociationsConfigurationNode,
				oldEditorLargeFileConfirmationConfigurationNode
			])
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorDropTarget.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorDropTarget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/editordroptarget.css';
import { DataTransfers } from '../../../../base/browser/dnd.js';
import { $, addDisposableListener, DragAndDropObserver, EventHelper, EventType, getWindow, isAncestor } from '../../../../base/browser/dom.js';
import { renderFormattedText } from '../../../../base/browser/formattedTextRenderer.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh, isWeb } from '../../../../base/common/platform.js';
import { assertReturnsAllDefined, assertReturnsDefined } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { activeContrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { isTemporaryWorkspace, IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { CodeDataTransfers, containsDragType, Extensions as DragAndDropExtensions, IDragAndDropContributionRegistry, LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { DraggedEditorGroupIdentifier, DraggedEditorIdentifier, extractTreeDropData, ResourcesDropHandler } from '../../dnd.js';
import { IEditorGroupView, prepareMoveCopyEditors } from './editor.js';
import { EditorInputCapabilities, IEditorIdentifier, IUntypedEditorInput } from '../../../common/editor.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND, EDITOR_DROP_INTO_PROMPT_BACKGROUND, EDITOR_DROP_INTO_PROMPT_BORDER, EDITOR_DROP_INTO_PROMPT_FOREGROUND } from '../../../common/theme.js';
import { GroupDirection, IEditorDropTargetDelegate, IEditorGroup, IEditorGroupsService, IMergeGroupOptions, MergeGroupMode } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ITreeViewsDnDService } from '../../../../editor/common/services/treeViewsDndService.js';
import { DraggedTreeItemsIdentifier } from '../../../../editor/common/services/treeViewsDnd.js';

interface IDropOperation {
	splitDirection?: GroupDirection;
}

function isDropIntoEditorEnabledGlobally(configurationService: IConfigurationService) {
	return configurationService.getValue<boolean>('editor.dropIntoEditor.enabled');
}

function isDragIntoEditorEvent(e: DragEvent): boolean {
	return e.shiftKey;
}

class DropOverlay extends Themable {

	private static readonly OVERLAY_ID = 'monaco-workbench-editor-drop-overlay';

	private container: HTMLElement | undefined;
	private overlay: HTMLElement | undefined;
	private dropIntoPromptElement?: HTMLSpanElement;

	private currentDropOperation: IDropOperation | undefined;

	private _disposed: boolean | undefined;
	get disposed(): boolean { return !!this._disposed; }

	private cleanupOverlayScheduler: RunOnceScheduler;

	private readonly editorTransfer = LocalSelectionTransfer.getInstance<DraggedEditorIdentifier>();
	private readonly groupTransfer = LocalSelectionTransfer.getInstance<DraggedEditorGroupIdentifier>();
	private readonly treeItemsTransfer = LocalSelectionTransfer.getInstance<DraggedTreeItemsIdentifier>();

	private readonly enableDropIntoEditor: boolean;

	constructor(
		private readonly groupView: IEditorGroupView,
		@IThemeService themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@ITreeViewsDnDService private readonly treeViewsDragAndDropService: ITreeViewsDnDService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService
	) {
		super(themeService);

		this.cleanupOverlayScheduler = this._register(new RunOnceScheduler(() => this.dispose(), 300));

		this.enableDropIntoEditor = isDropIntoEditorEnabledGlobally(this.configurationService) && this.isDropIntoActiveEditorEnabled();

		this.create();
	}

	private create(): void {
		const overlayOffsetHeight = this.getOverlayOffsetHeight();

		// Container
		const container = this.container = $('div', { id: DropOverlay.OVERLAY_ID });
		container.style.top = `${overlayOffsetHeight}px`;

		// Parent
		this.groupView.element.appendChild(container);
		this.groupView.element.classList.add('dragged-over');
		this._register(toDisposable(() => {
			container.remove();
			this.groupView.element.classList.remove('dragged-over');
		}));

		// Overlay
		this.overlay = $('.editor-group-overlay-indicator');
		container.appendChild(this.overlay);

		if (this.enableDropIntoEditor) {
			this.dropIntoPromptElement = renderFormattedText(localize('dropIntoEditorPrompt', "Hold __{0}__ to drop into editor", isMacintosh ? '⇧' : 'Shift'), {});
			this.dropIntoPromptElement.classList.add('editor-group-overlay-drop-into-prompt');
			this.overlay.appendChild(this.dropIntoPromptElement);
		}

		// Overlay Event Handling
		this.registerListeners(container);

		// Styles
		this.updateStyles();
	}

	override updateStyles(): void {
		const overlay = assertReturnsDefined(this.overlay);

		// Overlay drop background
		overlay.style.backgroundColor = this.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND) || '';

		// Overlay contrast border (if any)
		const activeContrastBorderColor = this.getColor(activeContrastBorder);
		overlay.style.outlineColor = activeContrastBorderColor || '';
		overlay.style.outlineOffset = activeContrastBorderColor ? '-2px' : '';
		overlay.style.outlineStyle = activeContrastBorderColor ? 'dashed' : '';
		overlay.style.outlineWidth = activeContrastBorderColor ? '2px' : '';

		if (this.dropIntoPromptElement) {
			this.dropIntoPromptElement.style.backgroundColor = this.getColor(EDITOR_DROP_INTO_PROMPT_BACKGROUND) ?? '';
			this.dropIntoPromptElement.style.color = this.getColor(EDITOR_DROP_INTO_PROMPT_FOREGROUND) ?? '';

			const borderColor = this.getColor(EDITOR_DROP_INTO_PROMPT_BORDER);
			if (borderColor) {
				this.dropIntoPromptElement.style.borderWidth = '1px';
				this.dropIntoPromptElement.style.borderStyle = 'solid';
				this.dropIntoPromptElement.style.borderColor = borderColor;
			} else {
				this.dropIntoPromptElement.style.borderWidth = '0';
			}
		}
	}

	private registerListeners(container: HTMLElement): void {
		this._register(new DragAndDropObserver(container, {
			onDragOver: e => {
				if (this.enableDropIntoEditor && isDragIntoEditorEvent(e)) {
					this.dispose();
					return;
				}

				const isDraggingGroup = this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype);
				const isDraggingEditor = this.editorTransfer.hasData(DraggedEditorIdentifier.prototype);

				// Update the dropEffect to "copy" if there is no local data to be dragged because
				// in that case we can only copy the data into and not move it from its source
				if (!isDraggingEditor && !isDraggingGroup && e.dataTransfer) {
					e.dataTransfer.dropEffect = 'copy';
				}

				// Find out if operation is valid
				let isCopy = true;
				if (isDraggingGroup) {
					isCopy = this.isCopyOperation(e);
				} else if (isDraggingEditor) {
					const data = this.editorTransfer.getData(DraggedEditorIdentifier.prototype);
					if (Array.isArray(data) && data.length > 0) {
						isCopy = this.isCopyOperation(e, data[0].identifier);
					}
				}

				if (!isCopy) {
					const sourceGroupView = this.findSourceGroupView();
					if (sourceGroupView === this.groupView) {
						if (isDraggingGroup || (isDraggingEditor && sourceGroupView.count < 2)) {
							this.hideOverlay();
							return; // do not allow to drop group/editor on itself if this results in an empty group
						}
					}
				}

				// Position overlay and conditionally enable or disable
				// editor group splitting support based on setting and
				// keymodifiers used.
				let splitOnDragAndDrop = !!this.editorGroupService.partOptions.splitOnDragAndDrop;
				if (this.isToggleSplitOperation(e)) {
					splitOnDragAndDrop = !splitOnDragAndDrop;
				}
				this.positionOverlay(e.offsetX, e.offsetY, isDraggingGroup, splitOnDragAndDrop);

				// Make sure to stop any running cleanup scheduler to remove the overlay
				if (this.cleanupOverlayScheduler.isScheduled()) {
					this.cleanupOverlayScheduler.cancel();
				}
			},

			onDragLeave: e => this.dispose(),
			onDragEnd: e => this.dispose(),

			onDrop: e => {
				EventHelper.stop(e, true);

				// Dispose overlay
				this.dispose();

				// Handle drop if we have a valid operation
				if (this.currentDropOperation) {
					this.handleDrop(e, this.currentDropOperation.splitDirection);
				}
			}
		}));

		this._register(addDisposableListener(container, EventType.MOUSE_OVER, () => {
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

	private isDropIntoActiveEditorEnabled(): boolean {
		return !!this.groupView.activeEditor?.hasCapability(EditorInputCapabilities.CanDropIntoEditor);
	}

	private findSourceGroupView(): IEditorGroup | undefined {

		// Check for group transfer
		if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
			const data = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				return this.editorGroupService.getGroup(data[0].identifier);
			}
		}

		// Check for editor transfer
		else if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
			const data = this.editorTransfer.getData(DraggedEditorIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				return this.editorGroupService.getGroup(data[0].identifier.groupId);
			}
		}

		return undefined;
	}

	private async handleDrop(event: DragEvent, splitDirection?: GroupDirection): Promise<void> {

		// Determine target group
		const ensureTargetGroup = () => {
			let targetGroup: IEditorGroup;
			if (typeof splitDirection === 'number') {
				targetGroup = this.editorGroupService.addGroup(this.groupView, splitDirection);
			} else {
				targetGroup = this.groupView;
			}

			return targetGroup;
		};

		// Check for group transfer
		if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
			const data = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const sourceGroup = this.editorGroupService.getGroup(data[0].identifier);
				if (sourceGroup) {
					if (typeof splitDirection !== 'number' && sourceGroup === this.groupView) {
						return;
					}

					// Split to new group
					let targetGroup: IEditorGroup | undefined;
					if (typeof splitDirection === 'number') {
						if (this.isCopyOperation(event)) {
							targetGroup = this.editorGroupService.copyGroup(sourceGroup, this.groupView, splitDirection);
						} else {
							targetGroup = this.editorGroupService.moveGroup(sourceGroup, this.groupView, splitDirection);
						}
					}

					// Merge into existing group
					else {
						let mergeGroupOptions: IMergeGroupOptions | undefined = undefined;
						if (this.isCopyOperation(event)) {
							mergeGroupOptions = { mode: MergeGroupMode.COPY_EDITORS };
						}

						this.editorGroupService.mergeGroup(sourceGroup, this.groupView, mergeGroupOptions);
					}

					if (targetGroup) {
						this.editorGroupService.activateGroup(targetGroup);
					}
				}

				this.groupTransfer.clearData(DraggedEditorGroupIdentifier.prototype);
			}
		}

		// Check for editor transfer
		else if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
			const data = this.editorTransfer.getData(DraggedEditorIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const draggedEditors = data;
				const firstDraggedEditor = data[0].identifier;

				const sourceGroup = this.editorGroupService.getGroup(firstDraggedEditor.groupId);
				if (sourceGroup) {
					const copyEditor = this.isCopyOperation(event, firstDraggedEditor);
					let targetGroup: IEditorGroup | undefined = undefined;

					// Optimization: if we move the last editor of an editor group
					// and we are configured to close empty editor groups, we can
					// rather move the entire editor group according to the direction
					if (this.editorGroupService.partOptions.closeEmptyGroups && sourceGroup.count === 1 && typeof splitDirection === 'number' && !copyEditor) {
						targetGroup = this.editorGroupService.moveGroup(sourceGroup, this.groupView, splitDirection);
					}

					// In any other case do a normal move/copy operation
					else {
						targetGroup = ensureTargetGroup();
						if (sourceGroup === targetGroup) {
							return;
						}

						const editorsWithOptions = prepareMoveCopyEditors(this.groupView, draggedEditors.map(editor => editor.identifier.editor));
						if (!copyEditor) {
							sourceGroup.moveEditors(editorsWithOptions, targetGroup);
						} else {
							sourceGroup.copyEditors(editorsWithOptions, targetGroup);
						}
					}

					// Ensure target has focus
					targetGroup.focus();
				}

				this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);
			}
		}

		// Check for tree items
		else if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
			const data = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype);
			if (Array.isArray(data) && data.length > 0) {
				const editors: IUntypedEditorInput[] = [];
				for (const id of data) {
					const dataTransferItem = await this.treeViewsDragAndDropService.removeDragOperationTransfer(id.identifier);
					if (dataTransferItem) {
						const treeDropData = await extractTreeDropData(dataTransferItem);
						editors.push(...treeDropData.map(editor => ({ ...editor, options: { ...editor.options, pinned: true } })));
					}
				}
				if (editors.length) {
					this.editorService.openEditors(editors, ensureTargetGroup(), { validateTrust: true });
				}
			}

			this.treeItemsTransfer.clearData(DraggedTreeItemsIdentifier.prototype);
		}

		// Check for URI transfer
		else {
			const dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: !isWeb || isTemporaryWorkspace(this.contextService.getWorkspace()) });
			dropHandler.handleDrop(event, getWindow(this.groupView.element), () => ensureTargetGroup(), targetGroup => targetGroup?.focus());
		}
	}

	private isCopyOperation(e: DragEvent, draggedEditor?: IEditorIdentifier): boolean {
		if (draggedEditor?.editor.hasCapability(EditorInputCapabilities.Singleton)) {
			return false; // Singleton editors cannot be split
		}

		return (e.ctrlKey && !isMacintosh) || (e.altKey && isMacintosh);
	}

	private isToggleSplitOperation(e: DragEvent): boolean {
		return (e.altKey && !isMacintosh) || (e.shiftKey && isMacintosh);
	}

	private positionOverlay(mousePosX: number, mousePosY: number, isDraggingGroup: boolean, enableSplitting: boolean): void {
		const preferSplitVertically = this.editorGroupService.partOptions.openSideBySideDirection === 'right';

		const editorControlWidth = this.groupView.element.clientWidth;
		const editorControlHeight = this.groupView.element.clientHeight - this.getOverlayOffsetHeight();

		let edgeWidthThresholdFactor: number;
		let edgeHeightThresholdFactor: number;
		if (enableSplitting) {
			if (isDraggingGroup) {
				edgeWidthThresholdFactor = preferSplitVertically ? 0.3 : 0.1; // give larger threshold when dragging group depending on preferred split direction
			} else {
				edgeWidthThresholdFactor = 0.1; // 10% threshold to split if dragging editors
			}

			if (isDraggingGroup) {
				edgeHeightThresholdFactor = preferSplitVertically ? 0.1 : 0.3; // give larger threshold when dragging group depending on preferred split direction
			} else {
				edgeHeightThresholdFactor = 0.1; // 10% threshold to split if dragging editors
			}
		} else {
			edgeWidthThresholdFactor = 0;
			edgeHeightThresholdFactor = 0;
		}

		const edgeWidthThreshold = editorControlWidth * edgeWidthThresholdFactor;
		const edgeHeightThreshold = editorControlHeight * edgeHeightThresholdFactor;

		const splitWidthThreshold = editorControlWidth / 3;		// offer to split left/right at 33%
		const splitHeightThreshold = editorControlHeight / 3;	// offer to split up/down at 33%

		// No split if mouse is above certain threshold in the center of the view
		let splitDirection: GroupDirection | undefined;
		if (
			mousePosX > edgeWidthThreshold && mousePosX < editorControlWidth - edgeWidthThreshold &&
			mousePosY > edgeHeightThreshold && mousePosY < editorControlHeight - edgeHeightThreshold
		) {
			splitDirection = undefined;
		}

		// Offer to split otherwise
		else {

			// User prefers to split vertically: offer a larger hitzone
			// for this direction like so:
			// ----------------------------------------------
			// |		|		SPLIT UP		|			|
			// | SPLIT 	|-----------------------|	SPLIT	|
			// |		|		  MERGE			|			|
			// | LEFT	|-----------------------|	RIGHT	|
			// |		|		SPLIT DOWN		|			|
			// ----------------------------------------------
			if (preferSplitVertically) {
				if (mousePosX < splitWidthThreshold) {
					splitDirection = GroupDirection.LEFT;
				} else if (mousePosX > splitWidthThreshold * 2) {
					splitDirection = GroupDirection.RIGHT;
				} else if (mousePosY < editorControlHeight / 2) {
					splitDirection = GroupDirection.UP;
				} else {
					splitDirection = GroupDirection.DOWN;
				}
			}

			// User prefers to split horizontally: offer a larger hitzone
			// for this direction like so:
			// ----------------------------------------------
			// |				SPLIT UP					|
			// |--------------------------------------------|
			// |  SPLIT LEFT  |	   MERGE	|  SPLIT RIGHT  |
			// |--------------------------------------------|
			// |				SPLIT DOWN					|
			// ----------------------------------------------
			else {
				if (mousePosY < splitHeightThreshold) {
					splitDirection = GroupDirection.UP;
				} else if (mousePosY > splitHeightThreshold * 2) {
					splitDirection = GroupDirection.DOWN;
				} else if (mousePosX < editorControlWidth / 2) {
					splitDirection = GroupDirection.LEFT;
				} else {
					splitDirection = GroupDirection.RIGHT;
				}
			}
		}

		// Draw overlay based on split direction
		switch (splitDirection) {
			case GroupDirection.UP:
				this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '50%' });
				this.toggleDropIntoPrompt(false);
				break;
			case GroupDirection.DOWN:
				this.doPositionOverlay({ top: '50%', left: '0', width: '100%', height: '50%' });
				this.toggleDropIntoPrompt(false);
				break;
			case GroupDirection.LEFT:
				this.doPositionOverlay({ top: '0', left: '0', width: '50%', height: '100%' });
				this.toggleDropIntoPrompt(false);
				break;
			case GroupDirection.RIGHT:
				this.doPositionOverlay({ top: '0', left: '50%', width: '50%', height: '100%' });
				this.toggleDropIntoPrompt(false);
				break;
			default:
				this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '100%' });
				this.toggleDropIntoPrompt(true);
		}

		// Make sure the overlay is visible now
		const overlay = assertReturnsDefined(this.overlay);
		overlay.style.opacity = '1';

		// Enable transition after a timeout to prevent initial animation
		setTimeout(() => overlay.classList.add('overlay-move-transition'), 0);

		// Remember as current split direction
		this.currentDropOperation = { splitDirection };
	}

	private doPositionOverlay(options: { top: string; left: string; width: string; height: string }): void {
		const [container, overlay] = assertReturnsAllDefined(this.container, this.overlay);

		// Container
		const offsetHeight = this.getOverlayOffsetHeight();
		if (offsetHeight) {
			container.style.height = `calc(100% - ${offsetHeight}px)`;
		} else {
			container.style.height = '100%';
		}

		// Overlay
		overlay.style.top = options.top;
		overlay.style.left = options.left;
		overlay.style.width = options.width;
		overlay.style.height = options.height;
	}

	private getOverlayOffsetHeight(): number {

		// With tabs and opened editors: use the area below tabs as drop target
		if (!this.groupView.isEmpty && this.editorGroupService.partOptions.showTabs === 'multiple') {
			return this.groupView.titleHeight.offset;
		}

		// Without tabs or empty group: use entire editor area as drop target
		return 0;
	}

	private hideOverlay(): void {
		const overlay = assertReturnsDefined(this.overlay);

		// Reset overlay
		this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '100%' });
		overlay.style.opacity = '0';
		overlay.classList.remove('overlay-move-transition');

		// Reset current operation
		this.currentDropOperation = undefined;
	}

	private toggleDropIntoPrompt(showing: boolean) {
		if (!this.dropIntoPromptElement) {
			return;
		}
		this.dropIntoPromptElement.style.opacity = showing ? '1' : '0';
	}

	contains(element: HTMLElement): boolean {
		return element === this.container || element === this.overlay;
	}

	override dispose(): void {
		super.dispose();

		this._disposed = true;
	}
}

export class EditorDropTarget extends Themable {

	private _overlay?: DropOverlay;

	private counter = 0;

	private readonly editorTransfer = LocalSelectionTransfer.getInstance<DraggedEditorIdentifier>();
	private readonly groupTransfer = LocalSelectionTransfer.getInstance<DraggedEditorGroupIdentifier>();

	constructor(
		private readonly container: HTMLElement,
		private readonly delegate: IEditorDropTargetDelegate,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(themeService);

		this.registerListeners();
	}

	private get overlay(): DropOverlay | undefined {
		if (this._overlay && !this._overlay.disposed) {
			return this._overlay;
		}

		return undefined;
	}

	private registerListeners(): void {
		this._register(addDisposableListener(this.container, EventType.DRAG_ENTER, e => this.onDragEnter(e)));
		this._register(addDisposableListener(this.container, EventType.DRAG_LEAVE, () => this.onDragLeave()));
		for (const target of [this.container, getWindow(this.container)]) {
			this._register(addDisposableListener(target, EventType.DRAG_END, () => this.onDragEnd()));
		}
	}

	private onDragEnter(event: DragEvent): void {
		if (isDropIntoEditorEnabledGlobally(this.configurationService) && isDragIntoEditorEvent(event)) {
			return;
		}

		this.counter++;

		// Validate transfer
		if (
			!this.editorTransfer.hasData(DraggedEditorIdentifier.prototype) &&
			!this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype) &&
			event.dataTransfer
		) {
			const dndContributions = Registry.as<IDragAndDropContributionRegistry>(DragAndDropExtensions.DragAndDropContribution).getAll();
			const dndContributionKeys = Array.from(dndContributions).map(e => e.dataFormatKey);
			if (!containsDragType(event, DataTransfers.FILES, CodeDataTransfers.FILES, DataTransfers.RESOURCES, CodeDataTransfers.EDITORS, ...dndContributionKeys)) { // see https://github.com/microsoft/vscode/issues/25789
				event.dataTransfer.dropEffect = 'none';
				return; // unsupported transfer
			}
		}

		// Signal DND start
		this.updateContainer(true);

		const target = event.target as HTMLElement;
		if (target) {

			// Somehow we managed to move the mouse quickly out of the current overlay, so destroy it
			if (this.overlay && !this.overlay.contains(target)) {
				this.disposeOverlay();
			}

			// Create overlay over target
			if (!this.overlay) {
				const targetGroupView = this.findTargetGroupView(target);
				if (targetGroupView) {
					this._overlay = this.instantiationService.createInstance(DropOverlay, targetGroupView);
				}
			}
		}
	}

	private onDragLeave(): void {
		this.counter--;

		if (this.counter === 0) {
			this.updateContainer(false);
		}
	}

	private onDragEnd(): void {
		this.counter = 0;

		this.updateContainer(false);
		this.disposeOverlay();
	}

	private findTargetGroupView(child: HTMLElement): IEditorGroupView | undefined {
		const groups = this.editorGroupService.groups as IEditorGroupView[];

		return groups.find(groupView => isAncestor(child, groupView.element) || this.delegate.containsGroup?.(groupView));
	}

	private updateContainer(isDraggedOver: boolean): void {
		this.container.classList.toggle('dragged-over', isDraggedOver);
	}

	override dispose(): void {
		super.dispose();

		this.disposeOverlay();
	}

	private disposeOverlay(): void {
		if (this.overlay) {
			this.overlay.dispose();
			this._overlay = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorGroupView.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorGroupView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/editorgroupview.css';
import { EditorGroupModel, IEditorOpenOptions, IGroupModelChangeEvent, ISerializedEditorGroupModel, isGroupEditorCloseEvent, isGroupEditorOpenEvent, isSerializedEditorGroupModel } from '../../../common/editor/editorGroupModel.js';
import { GroupIdentifier, CloseDirection, IEditorCloseEvent, IEditorPane, SaveReason, IEditorPartOptionsChangeEvent, EditorsOrder, IVisibleEditorPane, EditorResourceAccessor, EditorInputCapabilities, IUntypedEditorInput, DEFAULT_EDITOR_ASSOCIATION, SideBySideEditor, EditorCloseContext, IEditorWillMoveEvent, IEditorWillOpenEvent, IMatchEditorOptions, GroupModelChangeKind, IActiveEditorChangeEvent, IFindEditorOptions, TEXT_DIFF_EDITOR_ID } from '../../../common/editor.js';
import { ActiveEditorGroupLockedContext, ActiveEditorDirtyContext, EditorGroupEditorsCountContext, ActiveEditorStickyContext, ActiveEditorPinnedContext, ActiveEditorLastInGroupContext, ActiveEditorFirstInGroupContext, ResourceContextKey, applyAvailableEditorIds, ActiveEditorAvailableEditorIdsContext, ActiveEditorCanSplitInGroupContext, SideBySideEditorActiveContext, TextCompareEditorVisibleContext, TextCompareEditorActiveContext, ActiveEditorContext, ActiveEditorReadonlyContext, ActiveEditorCanRevertContext, ActiveEditorCanToggleReadonlyContext, ActiveCompareEditorCanSwapContext, MultipleEditorsSelectedInGroupContext, TwoEditorsSelectedInGroupContext, SelectedEditorsInGroupFileOrUntitledResourceContextKey } from '../../../common/contextkeys.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { Emitter, Event, Relay } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Dimension, trackFocus, addDisposableListener, EventType, EventHelper, findParentWithClass, isAncestor, IDomNodePagePosition, isMouseEvent, isActiveElement, getWindow, getActiveElement, $ } from '../../../../base/browser/dom.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { editorBackground, contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { EDITOR_GROUP_HEADER_TABS_BACKGROUND, EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND, EDITOR_GROUP_EMPTY_BACKGROUND, EDITOR_GROUP_HEADER_BORDER } from '../../../common/theme.js';
import { ICloseEditorsFilter, GroupsOrder, ICloseEditorOptions, ICloseAllEditorsOptions, IEditorReplacement, IActiveEditorActions } from '../../../services/editor/common/editorGroupsService.js';
import { EditorPanes } from './editorPanes.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { EditorProgressIndicator } from '../../../services/progress/browser/progressIndicator.js';
import { localize } from '../../../../nls.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ITelemetryData, ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { DeferredPromise, Promises, RunOnceWorker } from '../../../../base/common/async.js';
import { EventType as TouchEventType, GestureEvent } from '../../../../base/browser/touch.js';
import { IEditorGroupsView, IEditorGroupView, fillActiveEditorViewState, EditorServiceImpl, IEditorGroupTitleHeight, IInternalEditorOpenOptions, IInternalMoveCopyOptions, IInternalEditorCloseOptions, IInternalEditorTitleControlOptions, IEditorPartsView, IEditorGroupViewOptions } from './editor.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { SubmenuAction } from '../../../../base/common/actions.js';
import { IMenuChangeEvent, IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { getActionBarActions, PrimaryAndSecondaryActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { hash } from '../../../../base/common/hash.js';
import { getMimeTypes } from '../../../../editor/common/services/languagesAssociations.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { Schemas } from '../../../../base/common/network.js';
import { EditorActivation, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IFileDialogService, ConfirmResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFilesConfigurationService, AutoSaveMode } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { URI } from '../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isLinux, isMacintosh, isNative, isWindows } from '../../../../base/common/platform.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { TelemetryTrustedValue } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { defaultProgressBarStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { EditorGroupWatermark } from './editorGroupWatermark.js';
import { EditorTitleControl } from './editorTitleControl.js';
import { EditorPane } from './editorPane.js';
import { IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { FileSystemProviderCapabilities, IFileService } from '../../../../platform/files/common/files.js';

export class EditorGroupView extends Themable implements IEditorGroupView {

	//#region factory

	static createNew(editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupsLabel: string, groupIndex: number, instantiationService: IInstantiationService, options?: IEditorGroupViewOptions): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, null, editorPartsView, groupsView, groupsLabel, groupIndex, options);
	}

	static createFromSerialized(serialized: ISerializedEditorGroupModel, editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupsLabel: string, groupIndex: number, instantiationService: IInstantiationService, options?: IEditorGroupViewOptions): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, serialized, editorPartsView, groupsView, groupsLabel, groupIndex, options);
	}

	static createCopy(copyFrom: IEditorGroupView, editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupsLabel: string, groupIndex: number, instantiationService: IInstantiationService, options?: IEditorGroupViewOptions): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, copyFrom, editorPartsView, groupsView, groupsLabel, groupIndex, options);
	}

	//#endregion

	/**
	 * Access to the context key service scoped to this editor group.
	 */
	readonly scopedContextKeyService: IContextKeyService;

	//#region events

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	private readonly _onDidModelChange = this._register(new Emitter<IGroupModelChangeEvent>());
	readonly onDidModelChange = this._onDidModelChange.event;

	private readonly _onDidActiveEditorChange = this._register(new Emitter<IActiveEditorChangeEvent>());
	readonly onDidActiveEditorChange = this._onDidActiveEditorChange.event;

	private readonly _onDidOpenEditorFail = this._register(new Emitter<EditorInput>());
	readonly onDidOpenEditorFail = this._onDidOpenEditorFail.event;

	private readonly _onWillCloseEditor = this._register(new Emitter<IEditorCloseEvent>());
	readonly onWillCloseEditor = this._onWillCloseEditor.event;

	private readonly _onDidCloseEditor = this._register(new Emitter<IEditorCloseEvent>());
	readonly onDidCloseEditor = this._onDidCloseEditor.event;

	private readonly _onWillMoveEditor = this._register(new Emitter<IEditorWillMoveEvent>());
	readonly onWillMoveEditor = this._onWillMoveEditor.event;

	private readonly _onWillOpenEditor = this._register(new Emitter<IEditorWillOpenEvent>());
	readonly onWillOpenEditor = this._onWillOpenEditor.event;

	//#endregion

	private readonly model: EditorGroupModel;

	private active: boolean | undefined;
	private lastLayout: IDomNodePagePosition | undefined;

	private readonly scopedInstantiationService: IInstantiationService;

	private readonly resourceContext: ResourceContextKey;

	private readonly titleContainer: HTMLElement;
	private readonly titleControl: EditorTitleControl;

	private readonly progressBar: ProgressBar;

	private readonly editorContainer: HTMLElement;
	private readonly editorPane: EditorPanes;

	private readonly disposedEditorsWorker = this._register(new RunOnceWorker<EditorInput>(editors => this.handleDisposedEditors(editors), 0));

	private readonly mapEditorToPendingConfirmation = new Map<EditorInput, Promise<boolean>>();

	private readonly containerToolBarMenuDisposable = this._register(new MutableDisposable());

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;

	constructor(
		from: IEditorGroupView | ISerializedEditorGroupModel | null,
		private readonly editorPartsView: IEditorPartsView,
		readonly groupsView: IEditorGroupsView,
		private groupsLabel: string,
		private _index: number,
		options: IEditorGroupViewOptions | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IEditorService private readonly editorService: EditorServiceImpl,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IHostService private readonly hostService: IHostService,
		@IDialogService private readonly dialogService: IDialogService,
		@IFileService private readonly fileService: IFileService
	) {
		super(themeService);

		if (from instanceof EditorGroupView) {
			this.model = this._register(from.model.clone());
		} else if (isSerializedEditorGroupModel(from)) {
			this.model = this._register(instantiationService.createInstance(EditorGroupModel, from));
		} else {
			this.model = this._register(instantiationService.createInstance(EditorGroupModel, undefined));
		}

		//#region create()
		{
			// Scoped context key service
			this.scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.element));

			// Container
			this.element.classList.add(...coalesce(['editor-group-container', this.model.isLocked ? 'locked' : undefined]));

			// Container listeners
			this.registerContainerListeners();

			// Container toolbar
			this.createContainerToolbar();

			// Container context menu
			this.createContainerContextMenu();

			// Watermark & shortcuts
			this._register(this.instantiationService.createInstance(EditorGroupWatermark, this.element));

			// Progress bar
			this.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));
			this.progressBar.hide();

			// Scoped instantiation service
			this.scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection(
				[IContextKeyService, this.scopedContextKeyService],
				[IEditorProgressService, this._register(new EditorProgressIndicator(this.progressBar, this))]
			)));

			// Context keys
			this.resourceContext = this._register(this.scopedInstantiationService.createInstance(ResourceContextKey));
			this.handleGroupContextKeys();

			// Title container
			this.titleContainer = $('.title');
			this.element.appendChild(this.titleContainer);

			// Title control
			this.titleControl = this._register(this.scopedInstantiationService.createInstance(EditorTitleControl, this.titleContainer, this.editorPartsView, this.groupsView, this, this.model));

			// Editor container
			this.editorContainer = $('.editor-container');
			this.element.appendChild(this.editorContainer);

			// Editor pane
			this.editorPane = this._register(this.scopedInstantiationService.createInstance(EditorPanes, this.element, this.editorContainer, this));
			this._onDidChange.input = this.editorPane.onDidChangeSizeConstraints;

			// Track Focus
			this.doTrackFocus();

			// Update containers
			this.updateTitleContainer();
			this.updateContainer();

			// Update styles
			this.updateStyles();
		}
		//#endregion

		// Restore editors if provided
		const restoreEditorsPromise = this.restoreEditors(from, options) ?? Promise.resolve();

		// Signal restored once editors have restored
		restoreEditorsPromise.finally(() => {
			this.whenRestoredPromise.complete();
		});

		// Register Listeners
		this.registerListeners();
	}

	private handleGroupContextKeys(): void {
		const groupActiveEditorDirtyContext = this.editorPartsView.bind(ActiveEditorDirtyContext, this);
		const groupActiveEditorPinnedContext = this.editorPartsView.bind(ActiveEditorPinnedContext, this);
		const groupActiveEditorFirstContext = this.editorPartsView.bind(ActiveEditorFirstInGroupContext, this);
		const groupActiveEditorLastContext = this.editorPartsView.bind(ActiveEditorLastInGroupContext, this);
		const groupActiveEditorStickyContext = this.editorPartsView.bind(ActiveEditorStickyContext, this);
		const groupEditorsCountContext = this.editorPartsView.bind(EditorGroupEditorsCountContext, this);
		const groupLockedContext = this.editorPartsView.bind(ActiveEditorGroupLockedContext, this);

		const multipleEditorsSelectedContext = MultipleEditorsSelectedInGroupContext.bindTo(this.scopedContextKeyService);
		const twoEditorsSelectedContext = TwoEditorsSelectedInGroupContext.bindTo(this.scopedContextKeyService);
		const selectedEditorsHaveFileOrUntitledResourceContext = SelectedEditorsInGroupFileOrUntitledResourceContextKey.bindTo(this.scopedContextKeyService);

		const groupActiveEditorContext = this.editorPartsView.bind(ActiveEditorContext, this);
		const groupActiveEditorIsReadonly = this.editorPartsView.bind(ActiveEditorReadonlyContext, this);
		const groupActiveEditorCanRevert = this.editorPartsView.bind(ActiveEditorCanRevertContext, this);
		const groupActiveEditorCanToggleReadonly = this.editorPartsView.bind(ActiveEditorCanToggleReadonlyContext, this);
		const groupActiveCompareEditorCanSwap = this.editorPartsView.bind(ActiveCompareEditorCanSwapContext, this);
		const groupTextCompareEditorVisibleContext = this.editorPartsView.bind(TextCompareEditorVisibleContext, this);
		const groupTextCompareEditorActiveContext = this.editorPartsView.bind(TextCompareEditorActiveContext, this);

		const groupActiveEditorAvailableEditorIds = this.editorPartsView.bind(ActiveEditorAvailableEditorIdsContext, this);
		const groupActiveEditorCanSplitInGroupContext = this.editorPartsView.bind(ActiveEditorCanSplitInGroupContext, this);
		const groupActiveEditorIsSideBySideEditorContext = this.editorPartsView.bind(SideBySideEditorActiveContext, this);

		const activeEditorListener = this._register(new MutableDisposable());

		const observeActiveEditor = () => {
			activeEditorListener.clear();

			this.scopedContextKeyService.bufferChangeEvents(() => {
				const activeEditor = this.activeEditor;
				const activeEditorPane = this.activeEditorPane;

				this.resourceContext.set(EditorResourceAccessor.getOriginalUri(activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY }));

				applyAvailableEditorIds(groupActiveEditorAvailableEditorIds, activeEditor, this.editorResolverService);

				if (activeEditor) {
					groupActiveEditorCanSplitInGroupContext.set(activeEditor.hasCapability(EditorInputCapabilities.CanSplitInGroup));
					groupActiveEditorIsSideBySideEditorContext.set(activeEditor.typeId === SideBySideEditorInput.ID);

					groupActiveEditorDirtyContext.set(activeEditor.isDirty() && !activeEditor.isSaving());
					activeEditorListener.value = activeEditor.onDidChangeDirty(() => {
						groupActiveEditorDirtyContext.set(activeEditor.isDirty() && !activeEditor.isSaving());
					});
				} else {
					groupActiveEditorCanSplitInGroupContext.set(false);
					groupActiveEditorIsSideBySideEditorContext.set(false);
					groupActiveEditorDirtyContext.set(false);
				}

				if (activeEditorPane) {
					groupActiveEditorContext.set(activeEditorPane.getId());
					groupActiveEditorCanRevert.set(!activeEditorPane.input.hasCapability(EditorInputCapabilities.Untitled));
					groupActiveEditorIsReadonly.set(!!activeEditorPane.input.isReadonly());

					const primaryEditorResource = EditorResourceAccessor.getOriginalUri(activeEditorPane.input, { supportSideBySide: SideBySideEditor.PRIMARY });
					const secondaryEditorResource = EditorResourceAccessor.getOriginalUri(activeEditorPane.input, { supportSideBySide: SideBySideEditor.SECONDARY });
					groupActiveCompareEditorCanSwap.set(activeEditorPane.input instanceof DiffEditorInput && !activeEditorPane.input.original.isReadonly() && !!primaryEditorResource && (this.fileService.hasProvider(primaryEditorResource) || primaryEditorResource.scheme === Schemas.untitled) && !!secondaryEditorResource && (this.fileService.hasProvider(secondaryEditorResource) || secondaryEditorResource.scheme === Schemas.untitled));
					groupActiveEditorCanToggleReadonly.set(!!primaryEditorResource && this.fileService.hasProvider(primaryEditorResource) && !this.fileService.hasCapability(primaryEditorResource, FileSystemProviderCapabilities.Readonly));

					const activePaneDiffEditor = activeEditorPane?.getId() === TEXT_DIFF_EDITOR_ID;
					groupTextCompareEditorActiveContext.set(activePaneDiffEditor);
					groupTextCompareEditorVisibleContext.set(activePaneDiffEditor);
				} else {
					groupActiveEditorContext.reset();
					groupActiveEditorCanRevert.reset();
					groupActiveEditorIsReadonly.reset();
					groupActiveCompareEditorCanSwap.reset();
					groupActiveEditorCanToggleReadonly.reset();
				}
			});
		};

		// Update group contexts based on group changes
		const updateGroupContextKeys = (e: IGroupModelChangeEvent) => {
			switch (e.kind) {
				case GroupModelChangeKind.GROUP_LOCKED:
					groupLockedContext.set(this.isLocked);
					break;
				case GroupModelChangeKind.EDITOR_ACTIVE:
					groupActiveEditorFirstContext.set(this.model.isFirst(this.model.activeEditor));
					groupActiveEditorLastContext.set(this.model.isLast(this.model.activeEditor));
					groupActiveEditorPinnedContext.set(this.model.activeEditor ? this.model.isPinned(this.model.activeEditor) : false);
					groupActiveEditorStickyContext.set(this.model.activeEditor ? this.model.isSticky(this.model.activeEditor) : false);
					break;
				case GroupModelChangeKind.EDITOR_CLOSE:
					groupActiveEditorPinnedContext.set(this.model.activeEditor ? this.model.isPinned(this.model.activeEditor) : false);
					groupActiveEditorStickyContext.set(this.model.activeEditor ? this.model.isSticky(this.model.activeEditor) : false);
					break;
				case GroupModelChangeKind.EDITOR_OPEN:
				case GroupModelChangeKind.EDITOR_MOVE:
					groupActiveEditorFirstContext.set(this.model.isFirst(this.model.activeEditor));
					groupActiveEditorLastContext.set(this.model.isLast(this.model.activeEditor));
					break;
				case GroupModelChangeKind.EDITOR_PIN:
					if (e.editor && e.editor === this.model.activeEditor) {
						groupActiveEditorPinnedContext.set(this.model.isPinned(this.model.activeEditor));
					}
					break;
				case GroupModelChangeKind.EDITOR_STICKY:
					if (e.editor && e.editor === this.model.activeEditor) {
						groupActiveEditorStickyContext.set(this.model.isSticky(this.model.activeEditor));
					}
					break;
				case GroupModelChangeKind.EDITORS_SELECTION:
					multipleEditorsSelectedContext.set(this.model.selectedEditors.length > 1);
					twoEditorsSelectedContext.set(this.model.selectedEditors.length === 2);
					selectedEditorsHaveFileOrUntitledResourceContext.set(this.model.selectedEditors.every(e => e.resource && (this.fileService.hasProvider(e.resource) || e.resource.scheme === Schemas.untitled)));
					break;
			}

			// Group editors count context
			groupEditorsCountContext.set(this.count);
		};

		this._register(this.onDidModelChange(e => updateGroupContextKeys(e)));

		// Track the active editor and update context key that reflects
		// the dirty state of this editor
		this._register(this.onDidActiveEditorChange(() => observeActiveEditor()));

		// Update context keys on startup
		observeActiveEditor();
		updateGroupContextKeys({ kind: GroupModelChangeKind.EDITOR_ACTIVE });
		updateGroupContextKeys({ kind: GroupModelChangeKind.GROUP_LOCKED });
	}

	private registerContainerListeners(): void {

		// Open new file via doubleclick on empty container
		this._register(addDisposableListener(this.element, EventType.DBLCLICK, e => {
			if (this.isEmpty) {
				EventHelper.stop(e);

				this.editorService.openEditor({
					resource: undefined,
					options: {
						pinned: true,
						override: DEFAULT_EDITOR_ASSOCIATION.id
					}
				}, this.id);
			}
		}));

		// Close empty editor group via middle mouse click
		this._register(addDisposableListener(this.element, EventType.AUXCLICK, e => {
			if (this.isEmpty && e.button === 1 /* Middle Button */) {
				EventHelper.stop(e, true);

				this.groupsView.removeGroup(this);
			}
		}));
	}

	private createContainerToolbar(): void {

		// Toolbar Container
		const toolbarContainer = $('.editor-group-container-toolbar');
		this.element.appendChild(toolbarContainer);

		// Toolbar
		const containerToolbar = this._register(new ActionBar(toolbarContainer, {
			ariaLabel: localize('ariaLabelGroupActions', "Empty editor group actions"),
			highlightToggledItems: true
		}));

		// Toolbar actions
		const containerToolbarMenu = this._register(this.menuService.createMenu(MenuId.EmptyEditorGroup, this.scopedContextKeyService));
		const updateContainerToolbar = () => {

			// Clear old actions
			this.containerToolBarMenuDisposable.value = toDisposable(() => containerToolbar.clear());

			// Create new actions
			const actions = getActionBarActions(
				containerToolbarMenu.getActions({ arg: { groupId: this.id }, shouldForwardArgs: true }),
				'navigation'
			);

			for (const action of [...actions.primary, ...actions.secondary]) {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				containerToolbar.push(action, { icon: true, label: false, keybinding: keybinding?.getLabel() });
			}
		};
		updateContainerToolbar();
		this._register(containerToolbarMenu.onDidChange(updateContainerToolbar));
	}

	private createContainerContextMenu(): void {
		this._register(addDisposableListener(this.element, EventType.CONTEXT_MENU, e => this.onShowContainerContextMenu(e)));
		this._register(addDisposableListener(this.element, TouchEventType.Contextmenu, () => this.onShowContainerContextMenu()));
	}

	private onShowContainerContextMenu(e?: MouseEvent): void {
		if (!this.isEmpty) {
			return; // only for empty editor groups
		}

		// Find target anchor
		let anchor: HTMLElement | StandardMouseEvent = this.element;
		if (e) {
			anchor = new StandardMouseEvent(getWindow(this.element), e);
		}

		// Show it
		this.contextMenuService.showContextMenu({
			menuId: MenuId.EmptyEditorGroupContext,
			contextKeyService: this.contextKeyService,
			getAnchor: () => anchor,
			onHide: () => this.focus()
		});
	}

	private doTrackFocus(): void {

		// Container
		const containerFocusTracker = this._register(trackFocus(this.element));
		this._register(containerFocusTracker.onDidFocus(() => {
			if (this.isEmpty) {
				this._onDidFocus.fire(); // only when empty to prevent duplicate events from `editorPane.onDidFocus`
			}
		}));

		// Title Container
		const handleTitleClickOrTouch = (e: MouseEvent | GestureEvent): void => {
			let target: HTMLElement;
			if (isMouseEvent(e)) {
				if (e.button !== 0 /* middle/right mouse button */ || (isMacintosh && e.ctrlKey /* macOS context menu */)) {
					return undefined;
				}

				target = e.target as HTMLElement;
			} else {
				target = (e as GestureEvent).initialTarget as HTMLElement;
			}

			if (findParentWithClass(target, 'monaco-action-bar', this.titleContainer) ||
				findParentWithClass(target, 'monaco-breadcrumb-item', this.titleContainer)
			) {
				return; // not when clicking on actions or breadcrumbs
			}

			// timeout to keep focus in editor after mouse up
			setTimeout(() => {
				this.focus();
			});
		};

		this._register(addDisposableListener(this.titleContainer, EventType.MOUSE_DOWN, e => handleTitleClickOrTouch(e)));
		this._register(addDisposableListener(this.titleContainer, TouchEventType.Tap, e => handleTitleClickOrTouch(e)));

		// Editor pane
		this._register(this.editorPane.onDidFocus(() => {
			this._onDidFocus.fire();
		}));
	}

	private updateContainer(): void {

		// Empty Container: add some empty container attributes
		if (this.isEmpty) {
			this.element.classList.add('empty');
			this.element.tabIndex = 0;
			this.element.setAttribute('aria-label', localize('emptyEditorGroup', "{0} (empty)", this.ariaLabel));
		}

		// Non-Empty Container: revert empty container attributes
		else {
			this.element.classList.remove('empty');
			this.element.removeAttribute('tabIndex');
			this.element.removeAttribute('aria-label');
		}

		// Update styles
		this.updateStyles();
	}

	private updateTitleContainer(): void {
		this.titleContainer.classList.toggle('tabs', this.groupsView.partOptions.showTabs === 'multiple');
		this.titleContainer.classList.toggle('show-file-icons', this.groupsView.partOptions.showIcons);
	}

	private restoreEditors(from: IEditorGroupView | ISerializedEditorGroupModel | null, groupViewOptions?: IEditorGroupViewOptions): Promise<void> | undefined {
		if (this.count === 0) {
			return; // nothing to show
		}

		// Determine editor options
		let options: IEditorOptions;
		if (from instanceof EditorGroupView) {
			options = fillActiveEditorViewState(from); // if we copy from another group, ensure to copy its active editor viewstate
		} else {
			options = Object.create(null);
		}

		const activeEditor = this.model.activeEditor;
		if (!activeEditor) {
			return;
		}

		options.pinned = this.model.isPinned(activeEditor);	// preserve pinned state
		options.sticky = this.model.isSticky(activeEditor);	// preserve sticky state
		options.preserveFocus = true;						// handle focus after editor is restored

		const internalOptions: IInternalEditorOpenOptions = {
			preserveWindowOrder: true,						// handle window order after editor is restored
			skipTitleUpdate: true,							// update the title later for all editors at once
		};

		const activeElement = getActiveElement();

		// Show active editor (intentionally not using async to keep
		// `restoreEditors` from executing in same stack)
		const result = this.doShowEditor(activeEditor, { active: true, isNew: false /* restored */ }, options, internalOptions).then(() => {

			// Set focused now if this is the active group and focus has
			// not changed meanwhile. This prevents focus from being
			// stolen accidentally on startup when the user already
			// clicked somewhere.

			if (this.groupsView.activeGroup === this && activeElement && isActiveElement(activeElement) && !groupViewOptions?.preserveFocus) {
				this.focus();
			}
		});

		// Restore editors in title control
		this.titleControl.openEditors(this.editors);

		return result;
	}

	//#region event handling

	private registerListeners(): void {

		// Model Events
		this._register(this.model.onDidModelChange(e => this.onDidGroupModelChange(e)));

		// Option Changes
		this._register(this.groupsView.onDidChangeEditorPartOptions(e => this.onDidChangeEditorPartOptions(e)));

		// Visibility
		this._register(this.groupsView.onDidVisibilityChange(e => this.onDidVisibilityChange(e)));

		// Focus
		this._register(this.onDidFocus(() => this.onDidGainFocus()));
	}

	private onDidGroupModelChange(e: IGroupModelChangeEvent): void {

		// Re-emit to outside
		this._onDidModelChange.fire(e);

		// Handle within

		switch (e.kind) {
			case GroupModelChangeKind.GROUP_LOCKED:
				this.element.classList.toggle('locked', this.isLocked);
				break;
			case GroupModelChangeKind.EDITORS_SELECTION:
				this.onDidChangeEditorSelection();
				break;
		}

		if (!e.editor) {
			return;
		}

		switch (e.kind) {
			case GroupModelChangeKind.EDITOR_OPEN:
				if (isGroupEditorOpenEvent(e)) {
					this.onDidOpenEditor(e.editor, e.editorIndex);
				}
				break;
			case GroupModelChangeKind.EDITOR_CLOSE:
				if (isGroupEditorCloseEvent(e)) {
					this.handleOnDidCloseEditor(e.editor, e.editorIndex, e.context, e.sticky);
				}
				break;
			case GroupModelChangeKind.EDITOR_WILL_DISPOSE:
				this.onWillDisposeEditor(e.editor);
				break;
			case GroupModelChangeKind.EDITOR_DIRTY:
				this.onDidChangeEditorDirty(e.editor);
				break;
			case GroupModelChangeKind.EDITOR_TRANSIENT:
				this.onDidChangeEditorTransient(e.editor);
				break;
			case GroupModelChangeKind.EDITOR_LABEL:
				this.onDidChangeEditorLabel(e.editor);
				break;
		}
	}

	private onDidOpenEditor(editor: EditorInput, editorIndex: number): void {

		/* __GDPR__
			"editorOpened" : {
				"owner": "isidorn",
				"${include}": [
					"${EditorTelemetryDescriptor}"
				]
			}
		*/
		this.telemetryService.publicLog('editorOpened', this.toEditorTelemetryDescriptor(editor));

		// Update container
		this.updateContainer();
	}

	private handleOnDidCloseEditor(editor: EditorInput, editorIndex: number, context: EditorCloseContext, sticky: boolean): void {

		// Before close
		this._onWillCloseEditor.fire({ groupId: this.id, editor, context, index: editorIndex, sticky });

		// Handle event
		const editorsToClose: EditorInput[] = [editor];

		// Include both sides of side by side editors when being closed
		if (editor instanceof SideBySideEditorInput) {
			editorsToClose.push(editor.primary, editor.secondary);
		}

		// For each editor to close, we call dispose() to free up any resources.
		// However, certain editors might be shared across multiple editor groups
		// (including being visible in side by side / diff editors) and as such we
		// only dispose when they are not opened elsewhere.
		for (const editor of editorsToClose) {
			if (this.canDispose(editor)) {
				editor.dispose();
			}
		}

		// Update container
		this.updateContainer();

		// Event
		this._onDidCloseEditor.fire({ groupId: this.id, editor, context, index: editorIndex, sticky });
	}

	private canDispose(editor: EditorInput): boolean {
		for (const groupView of this.editorPartsView.groups) {
			if (groupView instanceof EditorGroupView && groupView.model.contains(editor, {
				strictEquals: true,						// only if this input is not shared across editor groups
				supportSideBySide: SideBySideEditor.ANY // include any side of an opened side by side editor
			})) {
				return false;
			}
		}

		return true;
	}

	private toResourceTelemetryDescriptor(resource: URI): object | undefined {
		if (!resource) {
			return undefined;
		}

		const path = resource ? resource.scheme === Schemas.file ? resource.fsPath : resource.path : undefined;
		if (!path) {
			return undefined;
		}

		// Remove query parameters from the resource extension
		let resourceExt = extname(resource);
		const queryStringLocation = resourceExt.indexOf('?');
		resourceExt = queryStringLocation !== -1 ? resourceExt.substr(0, queryStringLocation) : resourceExt;

		return {
			mimeType: new TelemetryTrustedValue(getMimeTypes(resource).join(', ')),
			scheme: resource.scheme,
			ext: resourceExt,
			path: hash(path)
		};
	}

	private toEditorTelemetryDescriptor(editor: EditorInput): ITelemetryData {
		const descriptor = editor.getTelemetryDescriptor();

		const resource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.BOTH });
		if (URI.isUri(resource)) {
			descriptor['resource'] = this.toResourceTelemetryDescriptor(resource);

			/* __GDPR__FRAGMENT__
				"EditorTelemetryDescriptor" : {
					"resource": { "${inline}": [ "${URIDescriptor}" ] }
				}
			*/
			return descriptor;
		} else if (resource) {
			if (resource.primary) {
				descriptor['resource'] = this.toResourceTelemetryDescriptor(resource.primary);
			}
			if (resource.secondary) {
				descriptor['resourceSecondary'] = this.toResourceTelemetryDescriptor(resource.secondary);
			}
			/* __GDPR__FRAGMENT__
				"EditorTelemetryDescriptor" : {
					"resource": { "${inline}": [ "${URIDescriptor}" ] },
					"resourceSecondary": { "${inline}": [ "${URIDescriptor}" ] }
				}
			*/
			return descriptor;
		}

		return descriptor;
	}

	private onWillDisposeEditor(editor: EditorInput): void {

		// To prevent race conditions, we handle disposed editors in our worker with a timeout
		// because it can happen that an input is being disposed with the intent to replace
		// it with some other input right after.
		this.disposedEditorsWorker.work(editor);
	}

	private handleDisposedEditors(disposedEditors: EditorInput[]): void {

		// Split between visible and hidden editors
		let activeEditor: EditorInput | undefined;
		const inactiveEditors: EditorInput[] = [];
		for (const disposedEditor of disposedEditors) {
			const editorFindResult = this.model.findEditor(disposedEditor);
			if (!editorFindResult) {
				continue; // not part of the model anymore
			}

			const editor = editorFindResult[0];
			if (!editor.isDisposed()) {
				continue; // editor got reopened meanwhile
			}

			if (this.model.isActive(editor)) {
				activeEditor = editor;
			} else {
				inactiveEditors.push(editor);
			}
		}

		// Close all inactive editors first to prevent UI flicker
		for (const inactiveEditor of inactiveEditors) {
			this.doCloseEditor(inactiveEditor, true);
		}

		// Close active one last
		if (activeEditor) {
			this.doCloseEditor(activeEditor, true);
		}
	}

	private onDidChangeEditorPartOptions(event: IEditorPartOptionsChangeEvent): void {

		// Title container
		this.updateTitleContainer();

		// Title control
		this.titleControl.updateOptions(event.oldPartOptions, event.newPartOptions);

		// Title control switch between singleEditorTabs, multiEditorTabs and multiRowEditorTabs
		if (
			event.oldPartOptions.showTabs !== event.newPartOptions.showTabs ||
			event.oldPartOptions.tabHeight !== event.newPartOptions.tabHeight ||
			(event.oldPartOptions.showTabs === 'multiple' && event.oldPartOptions.pinnedTabsOnSeparateRow !== event.newPartOptions.pinnedTabsOnSeparateRow)
		) {

			// Re-layout
			this.relayout();

			// Ensure to show active editor if any
			if (this.model.activeEditor) {
				this.titleControl.openEditors(this.model.getEditors(EditorsOrder.SEQUENTIAL));
			}
		}

		// Styles
		this.updateStyles();

		// Pin preview editor once user disables preview
		if (event.oldPartOptions.enablePreview && !event.newPartOptions.enablePreview) {
			if (this.model.previewEditor) {
				this.pinEditor(this.model.previewEditor);
			}
		}
	}

	private onDidChangeEditorDirty(editor: EditorInput): void {

		// Always show dirty editors pinned
		this.pinEditor(editor);

		// Forward to title control
		this.titleControl.updateEditorDirty(editor);
	}

	private onDidChangeEditorTransient(editor: EditorInput): void {
		const transient = this.model.isTransient(editor);

		// Transient state overrides the `enablePreview` setting,
		// so when an editor leaves the transient state, we have
		// to ensure its preview state is also cleared.
		if (!transient && !this.groupsView.partOptions.enablePreview) {
			this.pinEditor(editor);
		}
	}

	private onDidChangeEditorLabel(editor: EditorInput): void {

		// Forward to title control
		this.titleControl.updateEditorLabel(editor);
	}

	private onDidChangeEditorSelection(): void {

		// Forward to title control
		this.titleControl.updateEditorSelections();
	}

	private onDidVisibilityChange(visible: boolean): void {

		// Forward to active editor pane
		this.editorPane.setVisible(visible);
	}

	private onDidGainFocus(): void {
		if (this.activeEditor) {

			// We aggressively clear the transient state of editors
			// as soon as the group gains focus. This is to ensure
			// that the transient state is not staying around when
			// the user interacts with the editor.

			this.model.setTransient(this.activeEditor, false);
		}
	}

	//#endregion

	//#region IEditorGroupView

	get index(): number {
		return this._index;
	}

	get label(): string {
		if (this.groupsLabel) {
			return localize('groupLabelLong', "{0}: Group {1}", this.groupsLabel, this._index + 1);
		}

		return localize('groupLabel', "Group {0}", this._index + 1);
	}

	get ariaLabel(): string {
		if (this.groupsLabel) {
			return localize('groupAriaLabelLong', "{0}: Editor Group {1}", this.groupsLabel, this._index + 1);
		}

		return localize('groupAriaLabel', "Editor Group {0}", this._index + 1);
	}

	private _disposed = false;
	get disposed(): boolean {
		return this._disposed;
	}

	get isEmpty(): boolean {
		return this.count === 0;
	}

	get titleHeight(): IEditorGroupTitleHeight {
		return this.titleControl.getHeight();
	}

	notifyIndexChanged(newIndex: number): void {
		if (this._index !== newIndex) {
			this._index = newIndex;
			this.model.setIndex(newIndex);
		}
	}

	notifyLabelChanged(newLabel: string): void {
		if (this.groupsLabel !== newLabel) {
			this.groupsLabel = newLabel;
			this.model.setLabel(newLabel);
		}
	}

	setActive(isActive: boolean): void {
		this.active = isActive;

		// Clear selection when group no longer active
		if (!isActive && this.activeEditor && this.selectedEditors.length > 1) {
			this.setSelection(this.activeEditor, []);
		}

		// Update container
		this.element.classList.toggle('active', isActive);
		this.element.classList.toggle('inactive', !isActive);

		// Update title control
		this.titleControl.setActive(isActive);

		// Update styles
		this.updateStyles();

		// Update model
		this.model.setActive(undefined /* entire group got active */);
	}

	//#endregion

	//#region basics()

	get id(): GroupIdentifier {
		return this.model.id;
	}

	get windowId(): number {
		return this.groupsView.windowId;
	}

	get editors(): EditorInput[] {
		return this.model.getEditors(EditorsOrder.SEQUENTIAL);
	}

	get count(): number {
		return this.model.count;
	}

	get stickyCount(): number {
		return this.model.stickyCount;
	}

	get activeEditorPane(): IVisibleEditorPane | undefined {
		return this.editorPane ? this.editorPane.activeEditorPane ?? undefined : undefined;
	}

	get activeEditor(): EditorInput | null {
		return this.model.activeEditor;
	}

	get selectedEditors(): EditorInput[] {
		return this.model.selectedEditors;
	}

	get previewEditor(): EditorInput | null {
		return this.model.previewEditor;
	}

	isPinned(editorOrIndex: EditorInput | number): boolean {
		return this.model.isPinned(editorOrIndex);
	}

	isSticky(editorOrIndex: EditorInput | number): boolean {
		return this.model.isSticky(editorOrIndex);
	}

	isSelected(editor: EditorInput): boolean {
		return this.model.isSelected(editor);
	}

	isTransient(editorOrIndex: EditorInput | number): boolean {
		return this.model.isTransient(editorOrIndex);
	}

	isActive(editor: EditorInput | IUntypedEditorInput): boolean {
		return this.model.isActive(editor);
	}

	async setSelection(activeSelectedEditor: EditorInput, inactiveSelectedEditors: EditorInput[]): Promise<void> {
		if (!this.isActive(activeSelectedEditor)) {
			// The active selected editor is not yet opened, so we go
			// through `openEditor` to show it. We pass the inactive
			// selection as internal options
			await this.openEditor(activeSelectedEditor, { activation: EditorActivation.ACTIVATE }, { inactiveSelection: inactiveSelectedEditors });
		} else {
			this.model.setSelection(activeSelectedEditor, inactiveSelectedEditors);
		}
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean {
		return this.model.contains(candidate, options);
	}

	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[] {
		return this.model.getEditors(order, options);
	}

	findEditors(resource: URI, options?: IFindEditorOptions): EditorInput[] {
		const canonicalResource = this.uriIdentityService.asCanonicalUri(resource);
		return this.getEditors(options?.order ?? EditorsOrder.SEQUENTIAL).filter(editor => {
			if (editor.resource && isEqual(editor.resource, canonicalResource)) {
				return true;
			}

			// Support side by side editor primary side if specified
			if (options?.supportSideBySide === SideBySideEditor.PRIMARY || options?.supportSideBySide === SideBySideEditor.ANY) {
				const primaryResource = EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
				if (primaryResource && isEqual(primaryResource, canonicalResource)) {
					return true;
				}
			}

			// Support side by side editor secondary side if specified
			if (options?.supportSideBySide === SideBySideEditor.SECONDARY || options?.supportSideBySide === SideBySideEditor.ANY) {
				const secondaryResource = EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.SECONDARY });
				if (secondaryResource && isEqual(secondaryResource, canonicalResource)) {
					return true;
				}
			}

			return false;
		});
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return this.model.getEditorByIndex(index);
	}

	getIndexOfEditor(editor: EditorInput): number {
		return this.model.indexOf(editor);
	}

	isFirst(editor: EditorInput): boolean {
		return this.model.isFirst(editor);
	}

	isLast(editor: EditorInput): boolean {
		return this.model.isLast(editor);
	}

	focus(): void {

		// Pass focus to editor panes
		if (this.activeEditorPane) {
			this.activeEditorPane.focus();
		} else {
			this.element.focus();
		}

		// Event
		this._onDidFocus.fire();
	}

	pinEditor(candidate: EditorInput | undefined = this.activeEditor || undefined): void {
		if (candidate && !this.model.isPinned(candidate)) {

			// Update model
			const editor = this.model.pin(candidate);

			// Forward to title control
			if (editor) {
				this.titleControl.pinEditor(editor);
			}
		}
	}

	stickEditor(candidate: EditorInput | undefined = this.activeEditor || undefined): void {
		this.doStickEditor(candidate, true);
	}

	unstickEditor(candidate: EditorInput | undefined = this.activeEditor || undefined): void {
		this.doStickEditor(candidate, false);
	}

	private doStickEditor(candidate: EditorInput | undefined, sticky: boolean): void {
		if (candidate && this.model.isSticky(candidate) !== sticky) {
			const oldIndexOfEditor = this.getIndexOfEditor(candidate);

			// Update model
			const editor = sticky ? this.model.stick(candidate) : this.model.unstick(candidate);
			if (!editor) {
				return;
			}

			// If the index of the editor changed, we need to forward this to
			// title control and also make sure to emit this as an event
			const newIndexOfEditor = this.getIndexOfEditor(editor);
			if (newIndexOfEditor !== oldIndexOfEditor) {
				this.titleControl.moveEditor(editor, oldIndexOfEditor, newIndexOfEditor, true);
			}

			// Forward sticky state to title control
			if (sticky) {
				this.titleControl.stickEditor(editor);
			} else {
				this.titleControl.unstickEditor(editor);
			}
		}
	}

	//#endregion

	//#region openEditor()

	async openEditor(editor: EditorInput, options?: IEditorOptions, internalOptions?: IInternalEditorOpenOptions): Promise<IEditorPane | undefined> {
		return this.doOpenEditor(editor, options, {
			// Appply given internal open options
			...internalOptions,
			// Allow to match on a side-by-side editor when same
			// editor is opened on both sides. In that case we
			// do not want to open a new editor but reuse that one.
			supportSideBySide: SideBySideEditor.BOTH
		});
	}

	private async doOpenEditor(editor: EditorInput, options?: IEditorOptions, internalOptions?: IInternalEditorOpenOptions): Promise<IEditorPane | undefined> {

		// Guard against invalid editors. Disposed editors
		// should never open because they emit no events
		// e.g. to indicate dirty changes.
		if (!editor || editor.isDisposed()) {
			return;
		}

		// Fire the event letting everyone know we are about to open an editor
		this._onWillOpenEditor.fire({ editor, groupId: this.id });

		// Determine options
		const pinned = options?.sticky
			|| (!this.groupsView.partOptions.enablePreview && !options?.transient)
			|| editor.isDirty()
			|| (options?.pinned ?? typeof options?.index === 'number' /* unless specified, prefer to pin when opening with index */)
			|| (typeof options?.index === 'number' && this.model.isSticky(options.index))
			|| editor.hasCapability(EditorInputCapabilities.Scratchpad);
		const openEditorOptions: IEditorOpenOptions = {
			index: options ? options.index : undefined,
			pinned,
			sticky: options?.sticky || (typeof options?.index === 'number' && this.model.isSticky(options.index)),
			transient: !!options?.transient,
			inactiveSelection: internalOptions?.inactiveSelection,
			active: this.count === 0 || !options?.inactive,
			supportSideBySide: internalOptions?.supportSideBySide
		};

		if (!openEditorOptions.active && !openEditorOptions.pinned && this.model.activeEditor && !this.model.isPinned(this.model.activeEditor)) {
			// Special case: we are to open an editor inactive and not pinned, but the current active
			// editor is also not pinned, which means it will get replaced with this one. As such,
			// the editor can only be active.
			openEditorOptions.active = true;
		}

		let activateGroup = false;
		let restoreGroup = false;

		if (options?.activation === EditorActivation.ACTIVATE) {
			// Respect option to force activate an editor group.
			activateGroup = true;
		} else if (options?.activation === EditorActivation.RESTORE) {
			// Respect option to force restore an editor group.
			restoreGroup = true;
		} else if (options?.activation === EditorActivation.PRESERVE) {
			// Respect option to preserve active editor group.
			activateGroup = false;
			restoreGroup = false;
		} else if (openEditorOptions.active) {
			// Finally, we only activate/restore an editor which is
			// opening as active editor.
			// If preserveFocus is enabled, we only restore but never
			// activate the group.
			activateGroup = !options?.preserveFocus;
			restoreGroup = !activateGroup;
		}

		// Actually move the editor if a specific index is provided and we figure
		// out that the editor is already opened at a different index. This
		// ensures the right set of events are fired to the outside.
		if (typeof openEditorOptions.index === 'number') {
			const indexOfEditor = this.model.indexOf(editor);
			if (indexOfEditor !== -1 && indexOfEditor !== openEditorOptions.index) {
				this.doMoveEditorInsideGroup(editor, openEditorOptions);
			}
		}

		// Update model and make sure to continue to use the editor we get from
		// the model. It is possible that the editor was already opened and we
		// want to ensure that we use the existing instance in that case.
		const { editor: openedEditor, isNew } = this.model.openEditor(editor, openEditorOptions);

		// Conditionally lock the group
		if (
			isNew &&								// only if this editor was new for the group
			this.count === 1 &&						// only when this editor was the first editor in the group
			this.editorPartsView.groups.length > 1 	// only allow auto locking if more than 1 group is opened
		) {
			// only when the editor identifier is configured as such
			if (openedEditor.editorId && this.groupsView.partOptions.autoLockGroups?.has(openedEditor.editorId)) {
				this.lock(true);
			}
		}

		// Show editor
		const showEditorResult = this.doShowEditor(openedEditor, { active: !!openEditorOptions.active, isNew }, options, internalOptions);

		// Finally make sure the group is active or restored as instructed
		if (activateGroup) {
			this.groupsView.activateGroup(this);
		} else if (restoreGroup) {
			this.groupsView.restoreGroup(this);
		}

		return showEditorResult;
	}

	private doShowEditor(editor: EditorInput, context: { active: boolean; isNew: boolean }, options?: IEditorOptions, internalOptions?: IInternalEditorOpenOptions): Promise<IEditorPane | undefined> {

		// Show in editor control if the active editor changed
		let openEditorPromise: Promise<IEditorPane | undefined>;
		if (context.active) {
			openEditorPromise = (async () => {
				const { pane, changed, cancelled, error } = await this.editorPane.openEditor(editor, options, internalOptions, { newInGroup: context.isNew });

				// Return early if the operation was cancelled by another operation
				if (cancelled) {
					return undefined;
				}

				// Editor change event
				if (changed) {
					this._onDidActiveEditorChange.fire({ editor });
				}

				// Indicate error as an event but do not bubble them up
				if (error) {
					this._onDidOpenEditorFail.fire(editor);
				}

				// Without an editor pane, recover by closing the active editor
				// (if the input is still the active one)
				if (!pane && this.activeEditor === editor) {
					this.doCloseEditor(editor, options?.preserveFocus, { fromError: true });
				}

				return pane;
			})();
		} else {
			openEditorPromise = Promise.resolve(undefined); // inactive: return undefined as result to signal this
		}

		// Show in title control after editor control because some actions depend on it
		// but respect the internal options in case title control updates should skip.
		if (!internalOptions?.skipTitleUpdate) {
			this.titleControl.openEditor(editor, internalOptions);
		}

		return openEditorPromise;
	}

	//#endregion

	//#region openEditors()

	async openEditors(editors: { editor: EditorInput; options?: IEditorOptions }[]): Promise<IEditorPane | undefined> {

		// Guard against invalid editors. Disposed editors
		// should never open because they emit no events
		// e.g. to indicate dirty changes.
		const editorsToOpen = coalesce(editors).filter(({ editor }) => !editor.isDisposed());

		// Use the first editor as active editor
		const firstEditor = editorsToOpen.at(0);
		if (!firstEditor) {
			return;
		}

		const openEditorsOptions: IInternalEditorOpenOptions = {
			// Allow to match on a side-by-side editor when same
			// editor is opened on both sides. In that case we
			// do not want to open a new editor but reuse that one.
			supportSideBySide: SideBySideEditor.BOTH
		};

		await this.doOpenEditor(firstEditor.editor, firstEditor.options, openEditorsOptions);

		// Open the other ones inactive
		const inactiveEditors = editorsToOpen.slice(1);
		const startingIndex = this.getIndexOfEditor(firstEditor.editor) + 1;
		await Promises.settled(inactiveEditors.map(({ editor, options }, index) => {
			return this.doOpenEditor(editor, {
				...options,
				inactive: true,
				pinned: true,
				index: startingIndex + index
			}, {
				...openEditorsOptions,
				// optimization: update the title control later
				// https://github.com/microsoft/vscode/issues/130634
				skipTitleUpdate: true
			});
		}));

		// Update the title control all at once with all editors
		this.titleControl.openEditors(inactiveEditors.map(({ editor }) => editor));

		// Opening many editors at once can put any editor to be
		// the active one depending on options. As such, we simply
		// return the active editor pane after this operation.
		return this.editorPane.activeEditorPane ?? undefined;
	}

	//#endregion

	//#region moveEditor()

	moveEditors(editors: { editor: EditorInput; options?: IEditorOptions }[], target: EditorGroupView): boolean {

		// Optimization: knowing that we move many editors, we
		// delay the title update to a later point for this group
		// through a method that allows for bulk updates but only
		// when moving to a different group where many editors
		// are more likely to occur.
		const internalOptions: IInternalMoveCopyOptions = {
			skipTitleUpdate: this !== target
		};

		let moveFailed = false;

		const movedEditors = new Set<EditorInput>();
		for (const { editor, options } of editors) {
			if (this.moveEditor(editor, target, options, internalOptions)) {
				movedEditors.add(editor);
			} else {
				moveFailed = true;
			}
		}

		// Update the title control all at once with all editors
		// in source and target if the title update was skipped
		if (internalOptions.skipTitleUpdate) {
			target.titleControl.openEditors(Array.from(movedEditors));
			this.titleControl.closeEditors(Array.from(movedEditors));
		}

		return !moveFailed;
	}

	moveEditor(editor: EditorInput, target: EditorGroupView, options?: IEditorOptions, internalOptions?: IInternalMoveCopyOptions): boolean {

		// Move within same group
		if (this === target) {
			this.doMoveEditorInsideGroup(editor, options);
			return true;
		}

		// Move across groups
		else {
			return this.doMoveOrCopyEditorAcrossGroups(editor, target, options, { ...internalOptions, keepCopy: false });
		}
	}

	private doMoveEditorInsideGroup(candidate: EditorInput, options?: IEditorOpenOptions): void {
		const moveToIndex = options ? options.index : undefined;
		if (typeof moveToIndex !== 'number') {
			return; // do nothing if we move into same group without index
		}

		// Update model and make sure to continue to use the editor we get from
		// the model. It is possible that the editor was already opened and we
		// want to ensure that we use the existing instance in that case.
		const currentIndex = this.model.indexOf(candidate);
		const editor = this.model.getEditorByIndex(currentIndex);
		if (!editor) {
			return;
		}

		// Move when index has actually changed
		if (currentIndex !== moveToIndex) {
			const oldStickyCount = this.model.stickyCount;

			// Update model
			this.model.moveEditor(editor, moveToIndex);
			this.model.pin(editor);

			// Forward to title control
			this.titleControl.moveEditor(editor, currentIndex, moveToIndex, oldStickyCount !== this.model.stickyCount);
			this.titleControl.pinEditor(editor);
		}

		// Support the option to stick the editor even if it is moved.
		// It is important that we call this method after we have moved
		// the editor because the result of moving the editor could have
		// caused a change in sticky state.
		if (options?.sticky) {
			this.stickEditor(editor);
		}
	}

	private doMoveOrCopyEditorAcrossGroups(editor: EditorInput, target: EditorGroupView, openOptions?: IEditorOpenOptions, internalOptions?: IInternalMoveCopyOptions): boolean {
		const keepCopy = internalOptions?.keepCopy;

		// Validate that we can move
		if (!keepCopy || editor.hasCapability(EditorInputCapabilities.Singleton) /* singleton editors will always move */) {
			const canMoveVeto = editor.canMove(this.id, target.id);
			if (typeof canMoveVeto === 'string') {
				this.dialogService.error(canMoveVeto, localize('moveErrorDetails', "Try saving or reverting the editor first and then try again."));

				return false;
			}
		}

		// When moving/copying an editor, try to preserve as much view state as possible
		// by checking for the editor to be a text editor and creating the options accordingly
		// if so
		const options = fillActiveEditorViewState(this, editor, {
			...openOptions,
			pinned: true, 																// always pin moved editor
			sticky: openOptions?.sticky ?? (!keepCopy && this.model.isSticky(editor))	// preserve sticky state only if editor is moved or explicitly wanted (https://github.com/microsoft/vscode/issues/99035)
		});

		// Indicate will move event
		if (!keepCopy) {
			this._onWillMoveEditor.fire({
				groupId: this.id,
				editor,
				target: target.id
			});
		}

		// A move to another group is an open first...
		target.doOpenEditor(keepCopy ? editor.copy() : editor, options, internalOptions);

		// ...and a close afterwards (unless we copy)
		if (!keepCopy) {
			this.doCloseEditor(editor, true /* do not focus next one behind if any */, { ...internalOptions, context: EditorCloseContext.MOVE });
		}

		return true;
	}

	//#endregion

	//#region copyEditor()

	copyEditors(editors: { editor: EditorInput; options?: IEditorOptions }[], target: EditorGroupView): void {

		// Optimization: knowing that we move many editors, we
		// delay the title update to a later point for this group
		// through a method that allows for bulk updates but only
		// when moving to a different group where many editors
		// are more likely to occur.
		const internalOptions: IInternalMoveCopyOptions = {
			skipTitleUpdate: this !== target
		};

		for (const { editor, options } of editors) {
			this.copyEditor(editor, target, options, internalOptions);
		}

		// Update the title control all at once with all editors
		// in target if the title update was skipped
		if (internalOptions.skipTitleUpdate) {
			const copiedEditors = editors.map(({ editor }) => editor);
			target.titleControl.openEditors(copiedEditors);
		}
	}

	copyEditor(editor: EditorInput, target: EditorGroupView, options?: IEditorOptions, internalOptions?: IInternalEditorTitleControlOptions): void {

		// Move within same group because we do not support to show the same editor
		// multiple times in the same group
		if (this === target) {
			this.doMoveEditorInsideGroup(editor, options);
		}

		// Copy across groups
		else {
			this.doMoveOrCopyEditorAcrossGroups(editor, target, options, { ...internalOptions, keepCopy: true });
		}
	}

	//#endregion

	//#region closeEditor()

	async closeEditor(editor: EditorInput | undefined = this.activeEditor || undefined, options?: ICloseEditorOptions): Promise<boolean> {
		return this.doCloseEditorWithConfirmationHandling(editor, options);
	}

	private async doCloseEditorWithConfirmationHandling(editor: EditorInput | undefined = this.activeEditor || undefined, options?: ICloseEditorOptions, internalOptions?: IInternalEditorCloseOptions): Promise<boolean> {
		if (!editor) {
			return false;
		}

		// Check for confirmation and veto
		const veto = await this.handleCloseConfirmation([editor]);
		if (veto) {
			return false;
		}

		// Do close
		this.doCloseEditor(editor, options?.preserveFocus, internalOptions);

		return true;
	}

	private doCloseEditor(editor: EditorInput, preserveFocus = (this.groupsView.activeGroup !== this), internalOptions?: IInternalEditorCloseOptions): void {

		// Forward to title control unless skipped via internal options
		if (!internalOptions?.skipTitleUpdate) {
			this.titleControl.beforeCloseEditor(editor);
		}

		// Closing the active editor of the group is a bit more work
		if (this.model.isActive(editor)) {
			this.doCloseActiveEditor(preserveFocus, internalOptions);
		}

		// Closing inactive editor is just a model update
		else {
			this.doCloseInactiveEditor(editor, internalOptions);
		}

		// Forward to title control unless skipped via internal options
		if (!internalOptions?.skipTitleUpdate) {
			this.titleControl.closeEditor(editor);
		}
	}

	private doCloseActiveEditor(preserveFocus = (this.groupsView.activeGroup !== this), internalOptions?: IInternalEditorCloseOptions): void {
		const editorToClose = this.activeEditor;
		const restoreFocus = !preserveFocus && this.shouldRestoreFocus(this.element);

		// Optimization: if we are about to close the last editor in this group and settings
		// are configured to close the group since it will be empty, we first set the last
		// active group as empty before closing the editor. This reduces the amount of editor
		// change events that this operation emits and will reduce flicker. Without this
		// optimization, this group (if active) would first trigger a active editor change
		// event because it became empty, only to then trigger another one when the next
		// group gets active.
		const closeEmptyGroup = this.groupsView.partOptions.closeEmptyGroups;
		if (closeEmptyGroup && this.active && this.count === 1) {
			const mostRecentlyActiveGroups = this.groupsView.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
			const nextActiveGroup = mostRecentlyActiveGroups[1]; // [0] will be the current one, so take [1]
			if (nextActiveGroup) {
				if (restoreFocus) {
					nextActiveGroup.focus();
				} else {
					this.groupsView.activateGroup(nextActiveGroup, true);
				}
			}
		}

		// Update model
		if (editorToClose) {
			this.model.closeEditor(editorToClose, internalOptions?.context);
		}

		// Open next active if there are more to show
		const nextActiveEditor = this.model.activeEditor;
		if (nextActiveEditor) {
			let activation: EditorActivation | undefined = undefined;
			if (preserveFocus && this.groupsView.activeGroup !== this) {
				// If we are opening the next editor in an inactive group
				// without focussing it, ensure we preserve the editor
				// group sizes in case that group is minimized.
				// https://github.com/microsoft/vscode/issues/117686
				activation = EditorActivation.PRESERVE;
			}

			const options: IEditorOptions = {
				preserveFocus,
				activation,
				// When closing an editor due to an error we can end up in a loop where we continue closing
				// editors that fail to open (e.g. when the file no longer exists). We do not want to show
				// repeated errors in this case to the user. As such, if we open the next editor and we are
				// in a scope of a previous editor failing, we silence the input errors until the editor is
				// opened by setting ignoreError: true.
				ignoreError: internalOptions?.fromError
			};

			const internalEditorOpenOptions: IInternalEditorOpenOptions = {
				// When closing an editor, we reveal the next one in the group.
				// However, this can be a result of moving an editor to another
				// window so we explicitly disable window reordering in this case.
				preserveWindowOrder: true
			};

			this.doOpenEditor(nextActiveEditor, options, internalEditorOpenOptions);
		}

		// Otherwise we are empty, so clear from editor control and send event
		else {

			// Forward to editor pane
			if (editorToClose) {
				this.editorPane.closeEditor(editorToClose);
			}

			// Restore focus to group container as needed unless group gets closed
			if (restoreFocus && !closeEmptyGroup) {
				this.focus();
			}

			// Events
			this._onDidActiveEditorChange.fire({ editor: undefined });

			// Remove empty group if we should
			if (closeEmptyGroup) {
				this.groupsView.removeGroup(this, preserveFocus);
			}
		}
	}

	private shouldRestoreFocus(target: Element): boolean {
		const activeElement = getActiveElement();
		if (activeElement === target.ownerDocument.body) {
			return true; // always restore focus if nothing is focused currently
		}

		// otherwise check for the active element being an ancestor of the target
		return isAncestor(activeElement, target);
	}

	private doCloseInactiveEditor(editor: EditorInput, internalOptions?: IInternalEditorCloseOptions): void {

		// Update model
		this.model.closeEditor(editor, internalOptions?.context);
	}

	private async handleCloseConfirmation(editors: EditorInput[]): Promise<boolean /* veto */> {
		if (!editors.length) {
			return false; // no veto
		}

		const editor = editors.shift()!;

		// To prevent multiple confirmation dialogs from showing up one after the other
		// we check if a pending confirmation is currently showing and if so, join that
		let handleCloseConfirmationPromise = this.mapEditorToPendingConfirmation.get(editor);
		if (!handleCloseConfirmationPromise) {
			handleCloseConfirmationPromise = this.doHandleCloseConfirmation(editor);
			this.mapEditorToPendingConfirmation.set(editor, handleCloseConfirmationPromise);
		}

		let veto: boolean;
		try {
			veto = await handleCloseConfirmationPromise;
		} finally {
			this.mapEditorToPendingConfirmation.delete(editor);
		}

		// Return for the first veto we got
		if (veto) {
			return veto;
		}

		// Otherwise continue with the remainders
		return this.handleCloseConfirmation(editors);
	}

	private async doHandleCloseConfirmation(editor: EditorInput, options?: { skipAutoSave: boolean }): Promise<boolean /* veto */> {
		if (!this.shouldConfirmClose(editor)) {
			return false; // no veto
		}

		if (editor instanceof SideBySideEditorInput && this.model.contains(editor.primary)) {
			return false; // primary-side of editor is still opened somewhere else
		}

		// Note: we explicitly decide to ask for confirm if closing a normal editor even
		// if it is opened in a side-by-side editor in the group. This decision is made
		// because it may be less obvious that one side of a side by side editor is dirty
		// and can still be changed.
		// The only exception is when the same editor is opened on both sides of a side
		// by side editor (https://github.com/microsoft/vscode/issues/138442)

		if (this.editorPartsView.groups.some(groupView => {
			if (groupView === this) {
				return false; // skip (we already handled our group above)
			}

			const otherGroup = groupView;
			if (otherGroup.contains(editor, { supportSideBySide: SideBySideEditor.BOTH })) {
				return true; // exact editor still opened (either single, or split-in-group)
			}

			if (editor instanceof SideBySideEditorInput && otherGroup.contains(editor.primary)) {
				return true; // primary side of side by side editor still opened
			}

			return false;
		})) {
			return false; // editor is still editable somewhere else
		}

		// In some cases trigger save before opening the dialog depending
		// on auto-save configuration.
		// However, make sure to respect `skipAutoSave` option in case the automated
		// save fails which would result in the editor never closing.
		// Also, we only do this if no custom confirmation handling is implemented.
		let confirmation = ConfirmResult.CANCEL;
		let saveReason = SaveReason.EXPLICIT;
		let autoSave = false;
		if (!editor.hasCapability(EditorInputCapabilities.Untitled) && !options?.skipAutoSave && !editor.closeHandler) {

			// Auto-save on focus change: save, because a dialog would steal focus
			// (see https://github.com/microsoft/vscode/issues/108752)
			if (this.filesConfigurationService.getAutoSaveMode(editor).mode === AutoSaveMode.ON_FOCUS_CHANGE) {
				autoSave = true;
				confirmation = ConfirmResult.SAVE;
				saveReason = SaveReason.FOCUS_CHANGE;
			}

			// Auto-save on window change: save, because on Windows and Linux, a
			// native dialog triggers the window focus change
			// (see https://github.com/microsoft/vscode/issues/134250)
			else if ((isNative && (isWindows || isLinux)) && this.filesConfigurationService.getAutoSaveMode(editor).mode === AutoSaveMode.ON_WINDOW_CHANGE) {
				autoSave = true;
				confirmation = ConfirmResult.SAVE;
				saveReason = SaveReason.WINDOW_CHANGE;
			}
		}

		// No auto-save on focus change or custom confirmation handler: ask user
		if (!autoSave) {

			// Switch to editor that we want to handle for confirmation unless showing already
			if (!this.activeEditor?.matches(editor)) {
				await this.doOpenEditor(editor);
			}

			// Ensure our window has focus since we are about to show a dialog
			await this.hostService.focus(getWindow(this.element));

			// Let editor handle confirmation if implemented
			let handlerDidError = false;
			if (typeof editor.closeHandler?.confirm === 'function') {
				try {
					confirmation = await editor.closeHandler.confirm([{ editor, groupId: this.id }]);
				} catch (e) {
					this.logService.error(e);
					handlerDidError = true;
				}
			}

			// Show a file specific confirmation if there is no handler or it errored
			if (typeof editor.closeHandler?.confirm !== 'function' || handlerDidError) {
				let name: string;
				if (editor instanceof SideBySideEditorInput) {
					name = editor.primary.getName(); // prefer shorter names by using primary's name in this case
				} else {
					name = editor.getName();
				}

				confirmation = await this.fileDialogService.showSaveConfirm([name]);
			}
		}

		// It could be that the editor's choice of confirmation has changed
		// given the check for confirmation is long running, so we check
		// again to see if anything needs to happen before closing for good.
		// This can happen for example if `autoSave: onFocusChange` is configured
		// so that the save happens when the dialog opens.
		// However, we only do this unless a custom confirm handler is installed
		// that may not be fit to be asked a second time right after.
		if (!editor.closeHandler && !this.shouldConfirmClose(editor)) {
			return confirmation === ConfirmResult.CANCEL;
		}

		// Otherwise, handle accordingly
		switch (confirmation) {
			case ConfirmResult.SAVE: {
				const result = await editor.save(this.id, { reason: saveReason });
				if (!result && autoSave) {
					// Save failed and we need to signal this back to the user, so
					// we handle the dirty editor again but this time ensuring to
					// show the confirm dialog
					// (see https://github.com/microsoft/vscode/issues/108752)
					return this.doHandleCloseConfirmation(editor, { skipAutoSave: true });
				}

				return editor.isDirty(); // veto if still dirty
			}
			case ConfirmResult.DONT_SAVE:
				try {

					// first try a normal revert where the contents of the editor are restored
					await editor.revert(this.id);

					return editor.isDirty(); // veto if still dirty
				} catch (error) {
					this.logService.error(error);

					// if that fails, since we are about to close the editor, we accept that
					// the editor cannot be reverted and instead do a soft revert that just
					// enables us to close the editor. With this, a user can always close a
					// dirty editor even when reverting fails.

					await editor.revert(this.id, { soft: true });

					return editor.isDirty(); // veto if still dirty
				}
			case ConfirmResult.CANCEL:
				return true; // veto
		}
	}

	private shouldConfirmClose(editor: EditorInput): boolean {
		if (editor.closeHandler) {
			try {
				return editor.closeHandler.showConfirm(); // custom handling of confirmation on close
			} catch (error) {
				this.logService.error(error);
			}
		}

		return editor.isDirty() && !editor.isSaving(); // editor must be dirty and not saving
	}

	//#endregion

	//#region closeEditors()

	async closeEditors(args: EditorInput[] | ICloseEditorsFilter, options?: ICloseEditorOptions): Promise<boolean> {
		if (this.isEmpty) {
			return true;
		}

		const editors = this.doGetEditorsToClose(args);

		// Check for confirmation and veto
		const veto = await this.handleCloseConfirmation(editors.slice(0));
		if (veto) {
			return false;
		}

		// Do close
		this.doCloseEditors(editors, options);

		return true;
	}

	private doGetEditorsToClose(args: EditorInput[] | ICloseEditorsFilter): EditorInput[] {
		if (Array.isArray(args)) {
			return args;
		}

		const filter = args;
		const hasDirection = typeof filter.direction === 'number';

		let editorsToClose = this.model.getEditors(hasDirection ? EditorsOrder.SEQUENTIAL : EditorsOrder.MOST_RECENTLY_ACTIVE, filter); // in MRU order only if direction is not specified

		// Filter: saved or saving only
		if (filter.savedOnly) {
			editorsToClose = editorsToClose.filter(editor => !editor.isDirty() || editor.isSaving());
		}

		// Filter: direction (left / right)
		else if (hasDirection && filter.except) {
			editorsToClose = (filter.direction === CloseDirection.LEFT) ?
				editorsToClose.slice(0, this.model.indexOf(filter.except, editorsToClose)) :
				editorsToClose.slice(this.model.indexOf(filter.except, editorsToClose) + 1);
		}

		// Filter: except
		else if (filter.except) {
			editorsToClose = editorsToClose.filter(editor => filter.except && !editor.matches(filter.except));
		}

		return editorsToClose;
	}

	private doCloseEditors(editors: EditorInput[], options?: ICloseEditorOptions): void {

		// Close all inactive editors first
		let closeActiveEditor = false;
		for (const editor of editors) {
			if (!this.isActive(editor)) {
				this.doCloseInactiveEditor(editor);
			} else {
				closeActiveEditor = true;
			}
		}

		// Close active editor last if contained in editors list to close
		if (closeActiveEditor) {
			this.doCloseActiveEditor(options?.preserveFocus);
		}

		// Forward to title control
		if (editors.length) {
			this.titleControl.closeEditors(editors);
		}
	}

	//#endregion

	//#region closeAllEditors()

	closeAllEditors(options: { excludeConfirming: true }): boolean;
	closeAllEditors(options?: ICloseAllEditorsOptions): Promise<boolean>;
	closeAllEditors(options?: ICloseAllEditorsOptions): boolean | Promise<boolean> {
		if (this.isEmpty) {

			// If the group is empty and the request is to close all editors, we still close
			// the editor group is the related setting to close empty groups is enabled for
			// a convenient way of removing empty editor groups for the user.
			if (this.groupsView.partOptions.closeEmptyGroups) {
				this.groupsView.removeGroup(this);
			}

			return true;
		}

		// We can go ahead and close "sync" when we exclude confirming editors
		if (options?.excludeConfirming) {
			this.doCloseAllEditors(options);
			return true;
		}

		// Otherwise go through potential confirmation "async"
		return this.handleCloseConfirmation(this.model.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE, options)).then(veto => {
			if (veto) {
				return false;
			}

			this.doCloseAllEditors(options);
			return true;
		});
	}

	private doCloseAllEditors(options?: ICloseAllEditorsOptions): void {
		let editors = this.model.getEditors(EditorsOrder.SEQUENTIAL, options);
		if (options?.excludeConfirming) {
			editors = editors.filter(editor => !this.shouldConfirmClose(editor));
		}

		// Close all inactive editors first
		const editorsToClose: EditorInput[] = [];
		for (const editor of editors) {
			if (!this.isActive(editor)) {
				this.doCloseInactiveEditor(editor);
			}

			editorsToClose.push(editor);
		}

		// Close active editor last (unless we skip it, e.g. because it is sticky)
		if (this.activeEditor && editorsToClose.includes(this.activeEditor)) {
			this.doCloseActiveEditor();
		}

		// Forward to title control
		if (editorsToClose.length) {
			this.titleControl.closeEditors(editorsToClose);
		}
	}

	//#endregion

	//#region replaceEditors()

	async replaceEditors(editors: EditorReplacement[]): Promise<void> {

		// Extract active vs. inactive replacements
		let activeReplacement: EditorReplacement | undefined;
		const inactiveReplacements: EditorReplacement[] = [];
		for (let { editor, replacement, forceReplaceDirty, options } of editors) {
			const index = this.getIndexOfEditor(editor);
			if (index >= 0) {
				const isActiveEditor = this.isActive(editor);

				// make sure we respect the index of the editor to replace
				if (options) {
					options.index = index;
				} else {
					options = { index };
				}

				options.inactive = !isActiveEditor;
				options.pinned = options.pinned ?? true; // unless specified, prefer to pin upon replace

				const editorToReplace = { editor, replacement, forceReplaceDirty, options };
				if (isActiveEditor) {
					activeReplacement = editorToReplace;
				} else {
					inactiveReplacements.push(editorToReplace);
				}
			}
		}

		// Handle inactive first
		for (const { editor, replacement, forceReplaceDirty, options } of inactiveReplacements) {

			// Open inactive editor
			await this.doOpenEditor(replacement, options);

			// Close replaced inactive editor unless they match
			if (!editor.matches(replacement)) {
				let closed = false;
				if (forceReplaceDirty) {
					this.doCloseEditor(editor, true, { context: EditorCloseContext.REPLACE });
					closed = true;
				} else {
					closed = await this.doCloseEditorWithConfirmationHandling(editor, { preserveFocus: true }, { context: EditorCloseContext.REPLACE });
				}

				if (!closed) {
					return; // canceled
				}
			}
		}

		// Handle active last
		if (activeReplacement) {

			// Open replacement as active editor
			const openEditorResult = this.doOpenEditor(activeReplacement.replacement, activeReplacement.options);

			// Close replaced active editor unless they match
			if (!activeReplacement.editor.matches(activeReplacement.replacement)) {
				if (activeReplacement.forceReplaceDirty) {
					this.doCloseEditor(activeReplacement.editor, true, { context: EditorCloseContext.REPLACE });
				} else {
					await this.doCloseEditorWithConfirmationHandling(activeReplacement.editor, { preserveFocus: true }, { context: EditorCloseContext.REPLACE });
				}
			}

			await openEditorResult;
		}
	}

	//#endregion

	//#region Locking

	get isLocked(): boolean {
		return this.model.isLocked;
	}

	lock(locked: boolean): void {
		this.model.lock(locked);
	}

	//#endregion

	//#region Editor Actions

	createEditorActions(disposables: DisposableStore, menuId = MenuId.EditorTitle): IActiveEditorActions {
		let actions: PrimaryAndSecondaryActions = { primary: [], secondary: [] };
		let onDidChange: Event<IMenuChangeEvent | void> | undefined;

		// Editor actions require the editor control to be there, so we retrieve it via service
		const activeEditorPane = this.activeEditorPane;
		if (activeEditorPane instanceof EditorPane) {
			const editorScopedContextKeyService = activeEditorPane.scopedContextKeyService ?? this.scopedContextKeyService;
			const editorTitleMenu = disposables.add(this.menuService.createMenu(menuId, editorScopedContextKeyService, { emitEventsForSubmenuChanges: true, eventDebounceDelay: 0 }));
			onDidChange = editorTitleMenu.onDidChange;

			const shouldInlineGroup = (action: SubmenuAction, group: string) => group === 'navigation' && action.actions.length <= 1;

			actions = getActionBarActions(
				editorTitleMenu.getActions({ arg: this.resourceContext.get(), shouldForwardArgs: true }),
				'navigation',
				shouldInlineGroup
			);
		} else {
			// If there is no active pane in the group (it's the last group and it's empty)
			// Trigger the change event when the active editor changes
			const onDidChangeEmitter = disposables.add(new Emitter<void>());
			onDidChange = onDidChangeEmitter.event;
			disposables.add(this.onDidActiveEditorChange(() => onDidChangeEmitter.fire()));
		}

		return { actions, onDidChange };
	}

	//#endregion

	//#region Themable

	override updateStyles(): void {
		const isEmpty = this.isEmpty;

		// Container
		if (isEmpty) {
			this.element.style.backgroundColor = this.getColor(EDITOR_GROUP_EMPTY_BACKGROUND) || '';
		} else {
			this.element.style.backgroundColor = '';
		}

		// Title control
		const borderColor = this.getColor(EDITOR_GROUP_HEADER_BORDER) || this.getColor(contrastBorder);
		if (!isEmpty && borderColor) {
			this.titleContainer.classList.add('title-border-bottom');
			this.titleContainer.style.setProperty('--title-border-bottom-color', borderColor);
		} else {
			this.titleContainer.classList.remove('title-border-bottom');
			this.titleContainer.style.removeProperty('--title-border-bottom-color');
		}

		const { showTabs } = this.groupsView.partOptions;
		this.titleContainer.style.backgroundColor = this.getColor(showTabs === 'multiple' ? EDITOR_GROUP_HEADER_TABS_BACKGROUND : EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND) || '';

		// Editor container
		this.editorContainer.style.backgroundColor = this.getColor(editorBackground) || '';
	}

	//#endregion

	//#region ISerializableView

	readonly element: HTMLElement = $('div');

	get minimumWidth(): number { return this.editorPane.minimumWidth; }
	get minimumHeight(): number { return this.editorPane.minimumHeight; }
	get maximumWidth(): number { return this.editorPane.maximumWidth; }
	get maximumHeight(): number { return this.editorPane.maximumHeight; }

	get proportionalLayout(): boolean {
		if (!this.lastLayout) {
			return true;
		}

		return !(this.lastLayout.width === this.minimumWidth || this.lastLayout.height === this.minimumHeight);
	}

	private _onDidChange = this._register(new Relay<{ width: number; height: number } | undefined>());
	readonly onDidChange = this._onDidChange.event;

	layout(width: number, height: number, top: number, left: number): void {
		this.lastLayout = { width, height, top, left };
		this.element.classList.toggle('max-height-478px', height <= 478);

		// Layout the title control first to receive the size it occupies
		const titleControlSize = this.titleControl.layout({
			container: new Dimension(width, height),
			available: new Dimension(width, height - this.editorPane.minimumHeight)
		});

		// Update progress bar location
		this.progressBar.getContainer().style.top = `${Math.max(this.titleHeight.offset - 2, 0)}px`;

		// Pass the container width and remaining height to the editor layout
		const editorHeight = Math.max(0, height - titleControlSize.height);
		this.editorContainer.style.height = `${editorHeight}px`;
		this.editorPane.layout({ width, height: editorHeight, top: top + titleControlSize.height, left });
	}

	relayout(): void {
		if (this.lastLayout) {
			const { width, height, top, left } = this.lastLayout;
			this.layout(width, height, top, left);
		}
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this.editorPane.setBoundarySashes(sashes);
	}

	toJSON(): ISerializedEditorGroupModel {
		return this.model.serialize();
	}

	//#endregion

	override dispose(): void {
		this._disposed = true;

		this._onWillDispose.fire();

		super.dispose();
	}
}

export interface EditorReplacement extends IEditorReplacement {
	readonly editor: EditorInput;
	readonly replacement: EditorInput;
	readonly options?: IEditorOptions;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorGroupWatermark.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorGroupWatermark.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, clearNode, h } from '../../../../base/browser/dom.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { coalesce, shuffle } from '../../../../base/common/arrays.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { isMacintosh, isWeb, OS } from '../../../../base/common/platform.js';
import { localize } from '../../../../nls.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';
import { defaultKeybindingLabelStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';

interface WatermarkEntry {
	readonly id: string;
	readonly text: string;
	readonly when?: {
		native?: ContextKeyExpression;
		web?: ContextKeyExpression;
	};
}

const showChatContextKey = ContextKeyExpr.and(ContextKeyExpr.equals('chatSetupHidden', false), ContextKeyExpr.equals('chatSetupDisabled', false));

const openChat: WatermarkEntry = { text: localize('watermark.openChat', "Open Chat"), id: 'workbench.action.chat.open', when: { native: showChatContextKey, web: showChatContextKey } };
const showCommands: WatermarkEntry = { text: localize('watermark.showCommands', "Show All Commands"), id: 'workbench.action.showCommands' };
const gotoFile: WatermarkEntry = { text: localize('watermark.quickAccess', "Go to File"), id: 'workbench.action.quickOpen' };
const openFile: WatermarkEntry = { text: localize('watermark.openFile', "Open File"), id: 'workbench.action.files.openFile' };
const openFolder: WatermarkEntry = { text: localize('watermark.openFolder', "Open Folder"), id: 'workbench.action.files.openFolder' };
const openFileOrFolder: WatermarkEntry = { text: localize('watermark.openFileFolder', "Open File or Folder"), id: 'workbench.action.files.openFileFolder' };
const openRecent: WatermarkEntry = { text: localize('watermark.openRecent', "Open Recent"), id: 'workbench.action.openRecent' };
const newUntitledFile: WatermarkEntry = { text: localize('watermark.newUntitledFile', "New Untitled Text File"), id: 'workbench.action.files.newUntitledFile' };
const findInFiles: WatermarkEntry = { text: localize('watermark.findInFiles', "Find in Files"), id: 'workbench.action.findInFiles' };
const toggleTerminal: WatermarkEntry = { text: localize({ key: 'watermark.toggleTerminal', comment: ['toggle is a verb here'] }, "Toggle Terminal"), id: 'workbench.action.terminal.toggleTerminal', when: { web: ContextKeyExpr.equals('terminalProcessSupported', true) } };
const startDebugging: WatermarkEntry = { text: localize('watermark.startDebugging', "Start Debugging"), id: 'workbench.action.debug.start', when: { web: ContextKeyExpr.equals('terminalProcessSupported', true) } };
const openSettings: WatermarkEntry = { text: localize('watermark.openSettings', "Open Settings"), id: 'workbench.action.openSettings' };

const baseEntries: WatermarkEntry[] = [
	openChat,
	showCommands,
];

const emptyWindowEntries: WatermarkEntry[] = coalesce([
	...baseEntries,
	...(isMacintosh && !isWeb ? [openFileOrFolder] : [openFile, openFolder]),
	openRecent,
	isMacintosh && !isWeb ? newUntitledFile : undefined, // fill in one more on macOS to get to 5 entries
]);

const workspaceEntries: WatermarkEntry[] = [
	...baseEntries,
];

const otherEntries: WatermarkEntry[] = [
	gotoFile,
	findInFiles,
	startDebugging,
	toggleTerminal,
	openSettings,
];

export class EditorGroupWatermark extends Disposable {

	private static readonly CACHED_WHEN = 'editorGroupWatermark.whenConditions';
	private static readonly SETTINGS_KEY = 'workbench.tips.enabled';
	private static readonly MINIMUM_ENTRIES = 3;

	private readonly cachedWhen: { [when: string]: boolean };

	private readonly shortcuts: HTMLElement;
	private readonly transientDisposables = this._register(new DisposableStore());
	private readonly keybindingLabels = this._register(new DisposableStore());

	private enabled = false;
	private workbenchState: WorkbenchState;

	constructor(
		container: HTMLElement,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.cachedWhen = this.storageService.getObject(EditorGroupWatermark.CACHED_WHEN, StorageScope.PROFILE, Object.create(null));
		this.workbenchState = this.contextService.getWorkbenchState();

		const elements = h('.editor-group-watermark', [
			h('.watermark-container', [
				h('.letterpress'),
				h('.shortcuts@shortcuts'),
			])
		]);

		append(container, elements.root);
		this.shortcuts = elements.shortcuts;

		this.registerListeners();

		this.render();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (
				e.affectsConfiguration(EditorGroupWatermark.SETTINGS_KEY) &&
				this.enabled !== this.configurationService.getValue<boolean>(EditorGroupWatermark.SETTINGS_KEY)
			) {
				this.render();
			}
		}));

		this._register(this.contextService.onDidChangeWorkbenchState(workbenchState => {
			if (this.workbenchState !== workbenchState) {
				this.workbenchState = workbenchState;
				this.render();
			}
		}));

		this._register(this.storageService.onWillSaveState(e => {
			if (e.reason === WillSaveStateReason.SHUTDOWN) {
				const entries = [...emptyWindowEntries, ...workspaceEntries, ...otherEntries];
				for (const entry of entries) {
					const when = isWeb ? entry.when?.web : entry.when?.native;
					if (when) {
						this.cachedWhen[entry.id] = this.contextKeyService.contextMatchesRules(when);
					}
				}

				this.storageService.store(EditorGroupWatermark.CACHED_WHEN, JSON.stringify(this.cachedWhen), StorageScope.PROFILE, StorageTarget.MACHINE);
			}
		}));
	}

	private render(): void {
		this.enabled = this.configurationService.getValue<boolean>(EditorGroupWatermark.SETTINGS_KEY);

		clearNode(this.shortcuts);
		this.transientDisposables.clear();

		if (!this.enabled) {
			return;
		}

		const entries = this.filterEntries(this.workbenchState !== WorkbenchState.EMPTY ? workspaceEntries : emptyWindowEntries);
		if (entries.length < EditorGroupWatermark.MINIMUM_ENTRIES) {
			const additionalEntries = this.filterEntries(otherEntries);
			shuffle(additionalEntries);
			entries.push(...additionalEntries.slice(0, EditorGroupWatermark.MINIMUM_ENTRIES - entries.length));
		}

		const box = append(this.shortcuts, $('.watermark-box'));

		const update = () => {
			clearNode(box);
			this.keybindingLabels.clear();

			for (const entry of entries) {
				const keys = this.keybindingService.lookupKeybinding(entry.id);
				if (!keys) {
					continue;
				}

				const dl = append(box, $('dl'));
				const dt = append(dl, $('dt'));
				dt.textContent = entry.text;

				const dd = append(dl, $('dd'));

				const label = this.keybindingLabels.add(new KeybindingLabel(dd, OS, { renderUnboundKeybindings: true, ...defaultKeybindingLabelStyles }));
				label.set(keys);
			}
		};

		update();
		this.transientDisposables.add(this.keybindingService.onDidUpdateKeybindings(update));
	}

	private filterEntries(entries: WatermarkEntry[]): WatermarkEntry[] {
		const filteredEntries = entries
			.filter(entry => {
				if (this.cachedWhen[entry.id]) {
					return true; // cached from previous session
				}

				const contextKey = isWeb ? entry.when?.web : entry.when?.native;
				return !contextKey /* works without context */ || this.contextKeyService.contextMatchesRules(contextKey);
			})
			.filter(entry => !!CommandsRegistry.getCommand(entry.id))
			.filter(entry => !!this.keybindingService.lookupKeybinding(entry.id));

		return filteredEntries;
	}
}
```

--------------------------------------------------------------------------------

````

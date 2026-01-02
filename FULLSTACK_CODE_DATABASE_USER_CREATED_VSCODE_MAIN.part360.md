---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 360
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 360 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/askForPromptSourceFolder.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/askForPromptSourceFolder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extUri, isEqual } from '../../../../../../base/common/resources.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../../../nls.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { PROMPT_DOCUMENTATION_URL, PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { IPickOptions, IQuickInputService, IQuickPickItem } from '../../../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { IPromptPath, IPromptsService, PromptsStorage } from '../../../common/promptSyntax/service/promptsService.js';


interface IFolderQuickPickItem extends IQuickPickItem {
	readonly folder: IPromptPath;
}

/**
 * Asks the user for a specific prompt folder, if multiple folders provided.
 */
export async function askForPromptSourceFolder(
	accessor: ServicesAccessor,
	type: PromptsType,
	existingFolder?: URI | undefined,
	isMove: boolean = false,
): Promise<IPromptPath | undefined> {
	const quickInputService = accessor.get(IQuickInputService);
	const promptsService = accessor.get(IPromptsService);
	const labelService = accessor.get(ILabelService);
	const workspaceService = accessor.get(IWorkspaceContextService);

	// get prompts source folders based on the prompt type
	const folders = promptsService.getSourceFolders(type);

	// if no source folders found, show 'learn more' dialog
	// note! this is a temporary solution and must be replaced with a dialog to select
	//       a custom folder path, or switch to a different prompt type
	if (folders.length === 0) {
		await showNoFoldersDialog(accessor, type);
		return;
	}

	const pickOptions: IPickOptions<IFolderQuickPickItem> = {
		placeHolder: existingFolder ? getPlaceholderStringforMove(type, isMove) : getPlaceholderStringforNew(type),
		canPickMany: false,
		matchOnDescription: true,
	};

	// create list of source folder locations
	const foldersList = folders.map<IFolderQuickPickItem>(folder => {
		const uri = folder.uri;
		const detail = (existingFolder && isEqual(uri, existingFolder)) ? localize('current.folder', "Current Location") : undefined;
		if (folder.storage !== PromptsStorage.local) {
			return {
				type: 'item',
				label: promptsService.getPromptLocationLabel(folder),
				detail,
				tooltip: labelService.getUriLabel(uri),
				folder
			};
		}

		const { folders } = workspaceService.getWorkspace();
		const isMultirootWorkspace = (folders.length > 1);

		const firstFolder = folders[0];

		// if multi-root or empty workspace, or source folder `uri` does not point to
		// the root folder of a single-root workspace, return the default label and description
		if (isMultirootWorkspace || !firstFolder || !extUri.isEqual(firstFolder.uri, uri)) {
			return {
				type: 'item',
				label: labelService.getUriLabel(uri, { relative: true }),
				detail,
				tooltip: labelService.getUriLabel(uri),
				folder,
			};
		}

		// if source folder points to the root of this single-root workspace,
		// use appropriate label and description strings to prevent confusion
		return {
			type: 'item',
			label: localize(
				'commands.prompts.create.source-folder.current-workspace',
				"Current Workspace",
			),
			detail,
			tooltip: labelService.getUriLabel(uri),
			folder,
		};
	});

	const answer = await quickInputService.pick(foldersList, pickOptions);
	if (!answer) {
		return;
	}

	return answer.folder;
}

function getPlaceholderStringforNew(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return localize('workbench.command.instructions.create.location.placeholder', "Select a location to create the instructions file");
		case PromptsType.prompt:
			return localize('workbench.command.prompt.create.location.placeholder', "Select a location to create the prompt file");
		case PromptsType.agent:
			return localize('workbench.command.agent.create.location.placeholder', "Select a location to create the agent file");
		default:
			throw new Error('Unknown prompt type');
	}
}

function getPlaceholderStringforMove(type: PromptsType, isMove: boolean): string {
	if (isMove) {
		switch (type) {
			case PromptsType.instructions:
				return localize('instructions.move.location.placeholder', "Select a location to move the instructions file to");
			case PromptsType.prompt:
				return localize('prompt.move.location.placeholder', "Select a location to move the prompt file to");
			case PromptsType.agent:
				return localize('agent.move.location.placeholder', "Select a location to move the agent file to");
			default:
				throw new Error('Unknown prompt type');
		}
	}
	switch (type) {
		case PromptsType.instructions:
			return localize('instructions.copy.location.placeholder', "Select a location to copy the instructions file to");
		case PromptsType.prompt:
			return localize('prompt.copy.location.placeholder', "Select a location to copy the prompt file to");
		case PromptsType.agent:
			return localize('agent.copy.location.placeholder', "Select a location to copy the agent file to");
		default:
			throw new Error('Unknown prompt type');
	}
}

/**
 * Shows a dialog to the user when no prompt source folders are found.
 *
 * Note! this is a temporary solution and must be replaced with a dialog to select
 *       a custom folder path, or switch to a different prompt type
 */
async function showNoFoldersDialog(accessor: ServicesAccessor, type: PromptsType): Promise<void> {
	const quickInputService = accessor.get(IQuickInputService);
	const openerService = accessor.get(IOpenerService);

	const docsQuickPick: IQuickPickItem & { value: URI } = {
		type: 'item',
		label: getLearnLabel(type),
		description: PROMPT_DOCUMENTATION_URL,
		tooltip: PROMPT_DOCUMENTATION_URL,
		value: URI.parse(PROMPT_DOCUMENTATION_URL),
	};

	const result = await quickInputService.pick(
		[docsQuickPick],
		{
			placeHolder: getMissingSourceFolderString(type),
			canPickMany: false,
		});

	if (result) {
		await openerService.open(result.value);
	}
}

function getLearnLabel(type: PromptsType): string {
	switch (type) {
		case PromptsType.prompt:
			return localize('commands.prompts.create.ask-folder.empty.docs-label', 'Learn how to configure reusable prompts');
		case PromptsType.instructions:
			return localize('commands.instructions.create.ask-folder.empty.docs-label', 'Learn how to configure reusable instructions');
		case PromptsType.agent:
			return localize('commands.agent.create.ask-folder.empty.docs-label', 'Learn how to configure custom agents');
		default:
			throw new Error('Unknown prompt type');
	}
}

function getMissingSourceFolderString(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return localize('commands.instructions.create.ask-folder.empty.placeholder', 'No instruction source folders found.');
		case PromptsType.prompt:
			return localize('commands.prompts.create.ask-folder.empty.placeholder', 'No prompt source folders found.');
		case PromptsType.agent:
			return localize('commands.agent.create.ask-folder.empty.placeholder', 'No agent source folders found.');
		default:
			throw new Error('Unknown prompt type');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/promptFilePickers.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/promptFilePickers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../nls.js';
import { URI } from '../../../../../../base/common/uri.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { IPromptPath, IPromptsService, PromptsStorage } from '../../../common/promptSyntax/service/promptsService.js';
import { dirname, extUri, joinPath } from '../../../../../../base/common/resources.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { IDialogService } from '../../../../../../platform/dialogs/common/dialogs.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { getCleanPromptName } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptsType, INSTRUCTIONS_DOCUMENTATION_URL, AGENT_DOCUMENTATION_URL, PROMPT_DOCUMENTATION_URL } from '../../../common/promptSyntax/promptTypes.js';
import { NEW_PROMPT_COMMAND_ID, NEW_INSTRUCTIONS_COMMAND_ID, NEW_AGENT_COMMAND_ID } from '../newPromptFileActions.js';
import { IKeyMods, IQuickInputButton, IQuickInputService, IQuickPick, IQuickPickItem, IQuickPickItemButtonEvent, IQuickPickSeparator } from '../../../../../../platform/quickinput/common/quickInput.js';
import { askForPromptFileName } from './askForPromptName.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { askForPromptSourceFolder } from './askForPromptSourceFolder.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { PromptsConfig } from '../../../common/promptSyntax/config/config.js';
import { PromptFileRewriter } from '../promptFileRewriter.js';

/**
 * Options for the {@link askToSelectInstructions} function.
 */
export interface ISelectOptions {

	/**
	 * The text shows as placeholder in the selection dialog.
	 */
	readonly placeholder: string;

	/**
	 * Prompt resource `URI` to attach to the chat input, if any.
	 * If provided the resource will be pre-selected in the prompt picker dialog,
	 * otherwise the dialog will show the prompts list without any pre-selection.
	 */
	readonly resource?: URI;

	readonly type: PromptsType;

	readonly optionNew?: boolean;
	readonly optionEdit?: boolean;
	readonly optionDelete?: boolean;
	readonly optionRename?: boolean;
	readonly optionCopy?: boolean;
	readonly optionVisibility?: boolean;
}

export interface ISelectPromptResult {
	/**
	 * The selected prompt file.
	 */
	readonly promptFile: URI;

	/**
	 * The key modifiers that were pressed when the prompt was selected.
	 */
	readonly keyMods: IKeyMods;
}

/**
 * Button that opens the documentation.
 */
function newHelpButton(type: PromptsType): IQuickInputButton & { helpURI: URI } {
	const iconClass = ThemeIcon.asClassName(Codicon.question);
	switch (type) {
		case PromptsType.prompt:
			return {
				tooltip: localize('help.prompt', "Show help on prompt files"),
				helpURI: URI.parse(PROMPT_DOCUMENTATION_URL),
				iconClass
			};
		case PromptsType.instructions:
			return {
				tooltip: localize('help.instructions', "Show help on instruction files"),
				helpURI: URI.parse(INSTRUCTIONS_DOCUMENTATION_URL),
				iconClass
			};
		case PromptsType.agent:
			return {
				tooltip: localize('help.agent', "Show help on custom agent files"),
				helpURI: URI.parse(AGENT_DOCUMENTATION_URL),
				iconClass
			};
	}
}

function isHelpButton(button: IQuickInputButton): button is IQuickInputButton & { helpURI: URI } {
	return (<{ helpURI: URI }>button).helpURI !== undefined;
}

interface IPromptPickerQuickPickItem extends IQuickPickItem {

	type: 'item';

	/**
	 * The URI of the prompt file.
	 */
	promptFileUri?: URI;

	/**
	 * The command ID to execute when this item is selected.
	 */
	commandId?: string;
}

function isPromptFileItem(item: IPromptPickerQuickPickItem | IQuickPickSeparator): item is IPromptPickerQuickPickItem & { promptFileUri: URI } {
	return item.type === 'item' && !!item.promptFileUri;
}

type IPromptQuickPick = IQuickPick<IPromptPickerQuickPickItem, { useSeparators: true }>;

/**
 * A quick pick item that starts the 'New Prompt File' command.
 */
const NEW_PROMPT_FILE_OPTION: IPromptPickerQuickPickItem = {
	type: 'item',
	label: `$(plus) ${localize(
		'commands.new-promptfile.select-dialog.label',
		'New prompt file...'
	)}`,
	pickable: false,
	alwaysShow: true,
	buttons: [newHelpButton(PromptsType.prompt)],
	commandId: NEW_PROMPT_COMMAND_ID,
};

/**
 * A quick pick item that starts the 'New Instructions File' command.
 */
const NEW_INSTRUCTIONS_FILE_OPTION: IPromptPickerQuickPickItem = {
	type: 'item',
	label: `$(plus) ${localize(
		'commands.new-instructionsfile.select-dialog.label',
		'New instruction file...',
	)}`,
	pickable: false,
	alwaysShow: true,
	buttons: [newHelpButton(PromptsType.instructions)],
	commandId: NEW_INSTRUCTIONS_COMMAND_ID,
};

/**
 * A quick pick item that starts the 'Update Instructions' command.
 */
const UPDATE_INSTRUCTIONS_OPTION: IPromptPickerQuickPickItem = {
	type: 'item',
	label: `$(refresh) ${localize(
		'commands.update-instructions.select-dialog.label',
		'Generate agent instructions...',
	)}`,
	pickable: false,
	alwaysShow: true,
	buttons: [newHelpButton(PromptsType.instructions)],
	commandId: 'workbench.action.chat.generateInstructions',
};

/**
 * A quick pick item that starts the 'New Agent File' command.
 */
const NEW_AGENT_FILE_OPTION: IPromptPickerQuickPickItem = {
	type: 'item',
	label: `$(plus) ${localize(
		'commands.new-agentfile.select-dialog.label',
		'Create new custom agent...',
	)}`,
	pickable: false,
	alwaysShow: true,
	buttons: [newHelpButton(PromptsType.agent)],
	commandId: NEW_AGENT_COMMAND_ID,
};

/**
 * Button that opens a prompt file in the editor.
 */
const EDIT_BUTTON: IQuickInputButton = {
	tooltip: localize('open', "Open in Editor"),
	iconClass: ThemeIcon.asClassName(Codicon.fileCode),
};

/**
 * Button that deletes a prompt file.
 */
const DELETE_BUTTON: IQuickInputButton = {
	tooltip: localize('delete', "Delete"),
	iconClass: ThemeIcon.asClassName(Codicon.trash),
};

/**
 * Button that renames a prompt file.
 */
const RENAME_BUTTON: IQuickInputButton = {
	tooltip: localize('rename', "Move and/or Rename"),
	iconClass: ThemeIcon.asClassName(Codicon.replace),
};

/**
 * Button that copies a prompt file.
 */
const COPY_BUTTON: IQuickInputButton = {
	tooltip: localize('makeACopy', "Make a Copy"),
	iconClass: ThemeIcon.asClassName(Codicon.copy),
};

/**
 * Button that sets a prompt file to be visible.
 */
const MAKE_VISIBLE_BUTTON: IQuickInputButton = {
	tooltip: localize('makeVisible', "Hidden from chat view agent picker. Click to show."),
	iconClass: ThemeIcon.asClassName(Codicon.eyeClosed),
	alwaysVisible: true,
};

/**
 * Button that sets a prompt file to be invisible.
 */
const MAKE_INVISIBLE_BUTTON: IQuickInputButton = {
	tooltip: localize('makeInvisible', "Hide from agent picker"),
	iconClass: ThemeIcon.asClassName(Codicon.eyeClosed),
};

export class PromptFilePickers {
	constructor(
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IFileService private readonly _fileService: IFileService,
		@IDialogService private readonly _dialogService: IDialogService,
		@ICommandService private readonly _commandService: ICommandService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IPromptsService private readonly _promptsService: IPromptsService,
		@ILabelService private readonly _labelService: ILabelService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
	}

	/**
	 * Shows the prompt file selection dialog to the user that allows to run a prompt file(s).
	 *
	 * If {@link ISelectOptions.resource resource} is provided, the dialog will have
	 * the resource pre-selected in the prompts list.
	 */
	async selectPromptFile(options: ISelectOptions): Promise<ISelectPromptResult | undefined> {

		const cts = new CancellationTokenSource();
		const quickPick: IPromptQuickPick = this._quickInputService.createQuickPick<IPromptPickerQuickPickItem>({ useSeparators: true });
		quickPick.busy = true;
		quickPick.placeholder = localize('searching', 'Searching file system...');

		try {
			const fileOptions = await this._createPromptPickItems(options, cts.token);
			const activeItem = options.resource && fileOptions.find(f => f.type === 'item' && extUri.isEqual(f.promptFileUri, options.resource)) as IPromptPickerQuickPickItem | undefined;
			if (activeItem) {
				quickPick.activeItems = [activeItem];
			}
			quickPick.placeholder = options.placeholder;
			quickPick.matchOnDescription = true;
			quickPick.items = fileOptions;
		} finally {
			quickPick.busy = false;
		}

		return new Promise<ISelectPromptResult | undefined>(resolve => {
			const disposables = new DisposableStore();

			let isResolved = false;
			let isClosed = false;

			disposables.add(quickPick);
			disposables.add(cts);

			const refreshItems = async () => {
				const active = quickPick.activeItems;
				const newItems = await this._createPromptPickItems(options, CancellationToken.None);
				quickPick.items = newItems;
				quickPick.activeItems = active;
			};

			// handle the prompt `accept` event
			disposables.add(quickPick.onDidAccept(async () => {
				const { selectedItems } = quickPick;
				const { keyMods } = quickPick;

				const selectedItem = selectedItems[0];
				if (isPromptFileItem(selectedItem)) {
					resolve({ promptFile: selectedItem.promptFileUri, keyMods: { ...keyMods } });
					isResolved = true;
				} else {
					if (selectedItem.commandId) {
						await this._commandService.executeCommand(selectedItem.commandId);
						return;
					}
				}

				quickPick.hide();
			}));

			// handle the `button click` event on a list item (edit, delete, etc.)
			disposables.add(quickPick.onDidTriggerItemButton(async e => {
				const shouldRefresh = await this._handleButtonClick(quickPick, e, options);
				if (!isClosed && shouldRefresh) {
					await refreshItems();
				}
			}));

			disposables.add(quickPick.onDidHide(() => {
				if (!quickPick.ignoreFocusOut) {
					disposables.dispose();
					isClosed = true;
					if (!isResolved) {
						resolve(undefined);
						isResolved = true;
					}
				}
			}));

			// finally, reveal the dialog
			quickPick.show();
		});
	}


	private async _createPromptPickItems(options: ISelectOptions, token: CancellationToken): Promise<(IPromptPickerQuickPickItem | IQuickPickSeparator)[]> {
		const buttons: IQuickInputButton[] = [];
		if (options.optionEdit !== false) {
			buttons.push(EDIT_BUTTON);
		}
		if (options.optionCopy !== false) {
			buttons.push(COPY_BUTTON);
		}
		if (options.optionRename !== false) {
			buttons.push(RENAME_BUTTON);
		}
		if (options.optionDelete !== false) {
			buttons.push(DELETE_BUTTON);
		}
		const result: (IPromptPickerQuickPickItem | IQuickPickSeparator)[] = [];
		if (options.optionNew !== false) {
			result.push(...this._getNewItems(options.type));
		}

		let getVisibility: (p: IPromptPath) => boolean | undefined = () => undefined;
		if (options.optionVisibility) {
			const disabled = this._promptsService.getDisabledPromptFiles(options.type);
			getVisibility = p => !disabled.has(p.uri);
		}

		const locals = await this._promptsService.listPromptFilesForStorage(options.type, PromptsStorage.local, token);
		if (locals.length) {
			result.push({ type: 'separator', label: localize('separator.workspace', "Workspace") });
			result.push(...await Promise.all(locals.map(l => this._createPromptPickItem(l, buttons, getVisibility(l), token))));
		}

		// Agent instruction files (copilot-instructions.md and AGENTS.md) are added here and not included in the output of
		// listPromptFilesForStorage() because that function only handles *.instructions.md files (under `.github/instructions/`, etc.)
		let agentInstructionFiles: IPromptPath[] = [];
		if (options.type === PromptsType.instructions) {
			const useNestedAgentMD = this._configurationService.getValue(PromptsConfig.USE_NESTED_AGENT_MD);
			const agentInstructionUris = [
				...await this._promptsService.listCopilotInstructionsMDs(token),
				...await this._promptsService.listAgentMDs(token, !!useNestedAgentMD)
			];
			agentInstructionFiles = agentInstructionUris.map(uri => {
				const folderName = this._labelService.getUriLabel(dirname(uri), { relative: true });
				// Don't show the folder path for files under .github folder (namely, copilot-instructions.md) since that is only defined once per repo.
				const shouldShowFolderPath = folderName?.toLowerCase() !== '.github';
				return {
					uri,
					description: shouldShowFolderPath ? folderName : undefined,
					storage: PromptsStorage.local,
					type: options.type
				} satisfies IPromptPath;
			});
		}
		if (agentInstructionFiles.length) {
			const agentButtons = buttons.filter(b => b !== RENAME_BUTTON);
			result.push({ type: 'separator', label: localize('separator.workspace-agent-instructions', "Agent Instructions") });
			result.push(...await Promise.all(agentInstructionFiles.map(l => this._createPromptPickItem(l, agentButtons, getVisibility(l), token))));
		}

		const exts = await this._promptsService.listPromptFilesForStorage(options.type, PromptsStorage.extension, token);
		if (exts.length) {
			result.push({ type: 'separator', label: localize('separator.extensions', "Extensions") });
			const extButtons: IQuickInputButton[] = [];
			if (options.optionEdit !== false) {
				extButtons.push(EDIT_BUTTON);
			}
			if (options.optionCopy !== false) {
				extButtons.push(COPY_BUTTON);
			}
			result.push(...await Promise.all(exts.map(e => this._createPromptPickItem(e, extButtons, getVisibility(e), token))));
		}
		const users = await this._promptsService.listPromptFilesForStorage(options.type, PromptsStorage.user, token);
		if (users.length) {
			result.push({ type: 'separator', label: localize('separator.user', "User Data") });
			result.push(...await Promise.all(users.map(u => this._createPromptPickItem(u, buttons, getVisibility(u), token))));
		}
		return result;
	}

	private _getNewItems(type: PromptsType): IPromptPickerQuickPickItem[] {
		switch (type) {
			case PromptsType.prompt:
				return [NEW_PROMPT_FILE_OPTION];
			case PromptsType.instructions:
				return [NEW_INSTRUCTIONS_FILE_OPTION, UPDATE_INSTRUCTIONS_OPTION];
			case PromptsType.agent:
				return [NEW_AGENT_FILE_OPTION];
			default:
				throw new Error(`Unknown prompt type '${type}'.`);
		}
	}

	private async _createPromptPickItem(promptFile: IPromptPath, buttons: IQuickInputButton[] | undefined, visibility: boolean | undefined, token: CancellationToken): Promise<IPromptPickerQuickPickItem> {
		const parsedPromptFile = await this._promptsService.parseNew(promptFile.uri, token).catch(() => undefined);
		let promptName = parsedPromptFile?.header?.name ?? promptFile.name ?? getCleanPromptName(promptFile.uri);
		const promptDescription = parsedPromptFile?.header?.description ?? promptFile.description;

		let tooltip: string | undefined;

		switch (promptFile.storage) {
			case PromptsStorage.extension:
				tooltip = promptFile.extension.displayName ?? promptFile.extension.id;
				break;
			case PromptsStorage.local:
				tooltip = this._labelService.getUriLabel(dirname(promptFile.uri), { relative: true });
				break;
			case PromptsStorage.user:
				tooltip = undefined;
				break;
		}
		let iconClass: string | undefined;
		if (visibility === false) {
			buttons = (buttons ?? []).concat(MAKE_VISIBLE_BUTTON);
			promptName = localize('hiddenLabelInfo', "{0} (hidden)", promptName);
			tooltip = localize('hiddenInAgentPicker', "Hidden from chat view agent picker");
		} else if (visibility === true) {
			buttons = (buttons ?? []).concat(MAKE_INVISIBLE_BUTTON);
		}
		return {
			id: promptFile.uri.toString(),
			type: 'item',
			label: promptName,
			description: promptDescription,
			iconClass,
			tooltip,
			promptFileUri: promptFile.uri,
			buttons,
		} satisfies IPromptPickerQuickPickItem;
	}


	private async keepQuickPickOpen<T>(quickPick: IPromptQuickPick, work: () => Promise<T>): Promise<T> {
		const previousIgnoreFocusOut = quickPick.ignoreFocusOut;
		quickPick.ignoreFocusOut = true;
		try {
			return await work();
		} finally {
			quickPick.ignoreFocusOut = previousIgnoreFocusOut;
			quickPick.show();
		}
	}

	private async _handleButtonClick(quickPick: IPromptQuickPick, context: IQuickPickItemButtonEvent<IPromptPickerQuickPickItem>, options: ISelectOptions): Promise<boolean> {
		const { item, button } = context;
		if (!isPromptFileItem(item)) {
			if (isHelpButton(button)) {
				await this._openerService.open(button.helpURI);
				return false;
			}
			throw new Error(`Unknown button '${JSON.stringify(button)}'.`);
		}
		const value = item.promptFileUri;

		// `edit` button was pressed, open the prompt file in editor
		if (button === EDIT_BUTTON) {
			await this._openerService.open(value);
			return false;
		}

		// `copy` button was pressed, make a copy of the prompt file, open the copy in editor
		if (button === RENAME_BUTTON || button === COPY_BUTTON) {
			return await this.keepQuickPickOpen(quickPick, async () => {
				const currentFolder = dirname(value);
				const isMove = button === RENAME_BUTTON && quickPick.keyMods.ctrlCmd;
				const newFolder = await this._instaService.invokeFunction(askForPromptSourceFolder, options.type, currentFolder, isMove);
				if (!newFolder) {
					return false;
				}
				const newName = await this._instaService.invokeFunction(askForPromptFileName, options.type, newFolder.uri, item.label);
				if (!newName) {
					return false;
				}
				const newFile = joinPath(newFolder.uri, newName);
				if (isMove) {
					await this._fileService.move(value, newFile);
				} else {
					await this._fileService.copy(value, newFile);
				}

				await this._openerService.open(newFile);
				await this._instaService.createInstance(PromptFileRewriter).openAndRewriteName(newFile, getCleanPromptName(newFile), CancellationToken.None);

				return true;
			});
		}

		// `delete` button was pressed, delete the prompt file
		if (button === DELETE_BUTTON) {
			// don't close the main prompt selection dialog by the confirmation dialog
			return await this.keepQuickPickOpen(quickPick, async () => {

				const filename = getCleanPromptName(value);
				const message = localize('commands.prompts.use.select-dialog.delete-prompt.confirm.message', "Are you sure you want to delete '{0}'?", filename);
				const { confirmed } = await this._dialogService.confirm({ message });
				// if prompt deletion was not confirmed, nothing to do
				if (!confirmed) {
					return false;
				}

				// prompt deletion was confirmed so delete the prompt file
				await this._fileService.del(value);
				return true;
			});

		}

		if (button === MAKE_VISIBLE_BUTTON || button === MAKE_INVISIBLE_BUTTON) {
			const disabled = this._promptsService.getDisabledPromptFiles(options.type);
			if (button === MAKE_VISIBLE_BUTTON) {
				disabled.delete(value);
			} else {
				disabled.add(value);
			}
			this._promptsService.setDisabledPromptFiles(options.type, disabled);
			return true;
		}

		throw new Error(`Unknown button '${JSON.stringify(button)}'.`);
	}

	// --- Enablement Configuration -------------------------------------------------------

	/**
	 * Shows a multi-select (checkbox) quick pick to configure which prompt files of the given
	 * type are enabled. Currently only used for agent prompt files.
	 */
	async managePromptFiles(type: PromptsType, placeholder: string): Promise<boolean> {
		const cts = new CancellationTokenSource();
		const quickPick: IPromptQuickPick = this._quickInputService.createQuickPick<IPromptPickerQuickPickItem>({ useSeparators: true });
		quickPick.placeholder = placeholder;
		quickPick.canSelectMany = true;
		quickPick.matchOnDescription = true;
		quickPick.sortByLabel = false;
		quickPick.busy = true;

		const options: ISelectOptions = {
			placeholder: '',
			type,
			optionNew: true,
			optionEdit: true,
			optionDelete: true,
			optionRename: true,
			optionCopy: true,
			optionVisibility: false
		};

		try {
			const items = await this._createPromptPickItems(options, cts.token);
			quickPick.items = items;
		} finally {
			quickPick.busy = false;
		}

		return new Promise<boolean>(resolve => {
			const disposables = new DisposableStore();
			disposables.add(quickPick);
			disposables.add(cts);

			let isClosed = false;
			let isResolved = false;

			const refreshItems = async () => {
				const active = quickPick.activeItems;
				const newItems = await this._createPromptPickItems(options, CancellationToken.None);
				quickPick.items = newItems;
				quickPick.activeItems = active;
			};

			disposables.add(quickPick.onDidAccept(async () => {
				const clickedItem = quickPick.activeItems;
				if (clickedItem.length === 1 && clickedItem[0].commandId) {
					const commandId = clickedItem[0].commandId;
					await this.keepQuickPickOpen(quickPick, async () => {
						await this._commandService.executeCommand(commandId);
					});
					if (!isClosed) {
						await refreshItems();
					}
					return;
				}
				isResolved = true;
				resolve(true);
				quickPick.hide();
			}));

			disposables.add(quickPick.onDidTriggerItemButton(async e => {
				const shouldRefresh = await this._handleButtonClick(quickPick, e, options);
				if (!isClosed && shouldRefresh) {
					await refreshItems();
				}
			}));

			disposables.add(quickPick.onDidHide(() => {
				if (!quickPick.ignoreFocusOut) {
					disposables.dispose();
					isClosed = true;
					if (!isResolved) {
						resolve(false);
						isResolved = true;
					}
				}
			}));

			quickPick.show();
		});
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/tools/toolSetsContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/tools/toolSetsContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFalsyOrEmpty } from '../../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { observableFromEvent, observableSignalFromEvent, autorun, transaction } from '../../../../../base/common/observable.js';
import { basename, joinPath } from '../../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { assertType, isObject } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { ILifecycleService, LifecyclePhase } from '../../../../services/lifecycle/common/lifecycle.js';
import { IUserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfile.js';
import { CHAT_CATEGORY, CHAT_CONFIG_MENU_ID } from '../actions/chatActions.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { IRawToolSetContribution } from '../../common/tools/languageModelToolsContribution.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { Codicon, getAllCodicons } from '../../../../../base/common/codicons.js';
import { isValidBasename } from '../../../../../base/common/extpath.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { parse } from '../../../../../base/common/jsonc.js';
import { IJSONSchema } from '../../../../../base/common/jsonSchema.js';
import * as JSONContributionRegistry from '../../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ChatViewId } from '../chat.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';


const toolEnumValues: string[] = [];
const toolEnumDescriptions: string[] = [];

const toolSetSchemaId = 'vscode://schemas/toolsets';
const toolSetsSchema: IJSONSchema = {
	id: toolSetSchemaId,
	allowComments: true,
	allowTrailingCommas: true,
	defaultSnippets: [{
		label: localize('schema.default', "Empty tool set"),
		body: { '${1:toolSetName}': { 'tools': ['${2:someTool}', '${3:anotherTool}'], 'description': '${4:description}', 'icon': '${5:tools}' } }
	}],
	type: 'object',
	description: localize('toolsetSchema.json', 'User tool sets configuration'),

	additionalProperties: {
		type: 'object',
		required: ['tools'],
		additionalProperties: false,
		properties: {
			tools: {
				description: localize('schema.tools', "A list of tools or tool sets to include in this tool set. Cannot be empty and must reference tools the way they are referenced in prompts."),
				type: 'array',
				minItems: 1,
				items: {
					type: 'string',
					enum: toolEnumValues,
					enumDescriptions: toolEnumDescriptions,
				}
			},
			icon: {
				description: localize('schema.icon', 'Icon to use for this tool set in the UI. Uses the "\\$(name)"-syntax, like "\\$(zap)"'),
				type: 'string',
				enum: Array.from(getAllCodicons(), icon => icon.id),
				markdownEnumDescriptions: Array.from(getAllCodicons(), icon => `$(${icon.id})`),
			},
			description: {
				description: localize('schema.description', "A short description of this tool set."),
				type: 'string'
			},
		},
	}
};

const reg = Registry.as<JSONContributionRegistry.IJSONContributionRegistry>(JSONContributionRegistry.Extensions.JSONContribution);


abstract class RawToolSetsShape {

	static readonly suffix = '.toolsets.jsonc';

	static isToolSetFileName(uri: URI): boolean {
		return basename(uri).endsWith(RawToolSetsShape.suffix);
	}

	static from(data: unknown, logService: ILogService) {
		if (!isObject(data)) {
			throw new Error(`Invalid tool set data`);
		}

		const map = new Map<string, Exclude<IRawToolSetContribution, 'name'>>();

		for (const [name, value] of Object.entries(data as RawToolSetsShape)) {

			if (isFalsyOrWhitespace(name)) {
				logService.error(`Tool set name cannot be empty`);
			}
			if (isFalsyOrEmpty(value.tools)) {
				logService.error(`Tool set '${name}' cannot have an empty tools array`);
			}

			map.set(name, {
				name,
				tools: value.tools,
				description: value.description,
				icon: value.icon,
			});
		}

		return new class extends RawToolSetsShape { }(map);
	}

	entries: ReadonlyMap<string, Exclude<IRawToolSetContribution, 'name'>>;

	private constructor(entries: Map<string, Exclude<IRawToolSetContribution, 'name'>>) {
		this.entries = Object.freeze(new Map(entries));
	}
}

export class UserToolSetsContributions extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.userToolSets';

	constructor(
		@IExtensionService extensionService: IExtensionService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService,
		@IFileService private readonly _fileService: IFileService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		Promise.allSettled([
			extensionService.whenInstalledExtensionsRegistered,
			lifecycleService.when(LifecyclePhase.Restored)
		]).then(() => this._initToolSets());

		const toolsObs = observableFromEvent(this, _languageModelToolsService.onDidChangeTools, () => Array.from(_languageModelToolsService.getTools()));
		const store = this._store.add(new DisposableStore());

		this._store.add(autorun(r => {
			const tools = toolsObs.read(r);
			const toolSets = this._languageModelToolsService.toolSets.read(r);


			type ToolDesc = {
				name: string;
				sourceLabel: string;
				sourceOrdinal: number;
				description?: string;
			};

			const data: ToolDesc[] = [];
			for (const tool of tools) {
				if (tool.canBeReferencedInPrompt) {
					data.push({
						name: tool.toolReferenceName ?? tool.displayName,
						sourceLabel: ToolDataSource.classify(tool.source).label,
						sourceOrdinal: ToolDataSource.classify(tool.source).ordinal,
						description: tool.userDescription ?? tool.modelDescription
					});
				}
			}
			for (const toolSet of toolSets) {
				data.push({
					name: toolSet.referenceName,
					sourceLabel: ToolDataSource.classify(toolSet.source).label,
					sourceOrdinal: ToolDataSource.classify(toolSet.source).ordinal,
					description: toolSet.description
				});
			}

			toolEnumValues.length = 0;
			toolEnumDescriptions.length = 0;

			data.sort((a, b) => {
				if (a.sourceOrdinal !== b.sourceOrdinal) {
					return a.sourceOrdinal - b.sourceOrdinal;
				}
				if (a.sourceLabel !== b.sourceLabel) {
					return a.sourceLabel.localeCompare(b.sourceLabel);
				}
				return a.name.localeCompare(b.name);
			});

			for (const item of data) {
				toolEnumValues.push(item.name);
				toolEnumDescriptions.push(localize('tool.description', "{1} ({0})\n\n{2}", item.sourceLabel, item.name, item.description));
			}

			store.clear(); // reset old schema
			reg.registerSchema(toolSetSchemaId, toolSetsSchema, store);
		}));

	}

	private _initToolSets(): void {

		const promptFolder = observableFromEvent(this, this._userDataProfileService.onDidChangeCurrentProfile, () => this._userDataProfileService.currentProfile.promptsHome);

		const toolsSig = observableSignalFromEvent(this, this._languageModelToolsService.onDidChangeTools);
		const fileEventSig = observableSignalFromEvent(this, Event.filter(this._fileService.onDidFilesChange, e => e.affects(promptFolder.get())));

		const store = this._store.add(new DisposableStore());

		const getFilesInFolder = async (folder: URI) => {
			try {
				return (await this._fileService.resolve(folder)).children ?? [];
			} catch (err) {
				return []; // folder does not exist or cannot be read
			}
		};

		this._store.add(autorun(async r => {

			store.clear();

			toolsSig.read(r); // SIGNALS
			fileEventSig.read(r);

			const uri = promptFolder.read(r);

			const cts = new CancellationTokenSource();
			store.add(toDisposable(() => cts.dispose(true)));

			const entries = await getFilesInFolder(uri);

			if (cts.token.isCancellationRequested) {
				return;
			}

			for (const entry of entries) {

				if (!entry.isFile || !RawToolSetsShape.isToolSetFileName(entry.resource)) {
					// not interesting
					continue;
				}

				// watch this file
				store.add(this._fileService.watch(entry.resource));

				let data: RawToolSetsShape | undefined;
				try {
					const content = await this._fileService.readFile(entry.resource, undefined, cts.token);
					const rawObj = parse(content.value.toString());
					data = RawToolSetsShape.from(rawObj, this._logService);

				} catch (err) {
					this._logService.error(`Error reading tool set file ${entry.resource.toString()}:`, err);
					continue;
				}

				if (cts.token.isCancellationRequested) {
					return;
				}

				for (const [name, value] of data.entries) {

					const tools: IToolData[] = [];
					const toolSets: ToolSet[] = [];
					value.tools.forEach(name => {
						const tool = this._languageModelToolsService.getToolByName(name);
						if (tool) {
							tools.push(tool);
							return;
						}
						const toolSet = this._languageModelToolsService.getToolSetByName(name);
						if (toolSet) {
							toolSets.push(toolSet);
							return;
						}
					});

					if (tools.length === 0 && toolSets.length === 0) {
						// NO tools in this set
						continue;
					}

					const toolset = this._languageModelToolsService.createToolSet(
						{ type: 'user', file: entry.resource, label: basename(entry.resource) },
						`user/${entry.resource.toString()}/${name}`,
						name,
						{
							// toolReferenceName: value.referenceName,
							icon: value.icon ? ThemeIcon.fromId(value.icon) : undefined,
							description: value.description
						}
					);

					transaction(tx => {
						store.add(toolset);
						tools.forEach(tool => store.add(toolset.addTool(tool, tx)));
						toolSets.forEach(toolSet => store.add(toolset.addToolSet(toolSet, tx)));
					});
				}
			}
		}));
	}
}

// ---- actions

export class ConfigureToolSets extends Action2 {

	static readonly ID = 'chat.configureToolSets';

	constructor() {
		super({
			id: ConfigureToolSets.ID,
			title: localize2('chat.configureToolSets', 'Configure Tool Sets...'),
			shortTitle: localize('chat.configureToolSets.short', "Tool Sets"),
			category: CHAT_CATEGORY,
			f1: true,
			precondition: ContextKeyExpr.and(ChatContextKeys.enabled, ChatContextKeys.Tools.toolsCount.greater(0)),
			menu: {
				id: CHAT_CONFIG_MENU_ID,
				when: ContextKeyExpr.equals('view', ChatViewId),
				order: 11,
				group: '2_level'
			},
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {

		const toolsService = accessor.get(ILanguageModelToolsService);
		const quickInputService = accessor.get(IQuickInputService);
		const editorService = accessor.get(IEditorService);
		const userDataProfileService = accessor.get(IUserDataProfileService);
		const fileService = accessor.get(IFileService);
		const textFileService = accessor.get(ITextFileService);

		const picks: ((IQuickPickItem & { toolset?: ToolSet }) | IQuickPickSeparator)[] = [];

		picks.push({
			label: localize('chat.configureToolSets.add', 'Create new tool sets file...'),
			alwaysShow: true,
			iconClass: ThemeIcon.asClassName(Codicon.plus)
		});

		for (const toolSet of toolsService.toolSets.get()) {
			if (toolSet.source.type !== 'user') {
				continue;
			}

			picks.push({
				label: toolSet.referenceName,
				toolset: toolSet,
				tooltip: toolSet.description,
				iconClass: ThemeIcon.asClassName(toolSet.icon)
			});
		}

		const pick = await quickInputService.pick(picks, {
			canPickMany: false,
			placeHolder: localize('chat.configureToolSets.placeholder', 'Select a tool set to configure'),
		});

		if (!pick) {
			return; // user cancelled
		}

		let resource: URI | undefined;

		if (!pick.toolset) {

			const name = await quickInputService.input({
				placeHolder: localize('input.placeholder', "Type tool sets file name"),
				validateInput: async (input) => {
					if (!input) {
						return localize('bad_name1', "Invalid file name");
					}
					if (!isValidBasename(input)) {
						return localize('bad_name2', "'{0}' is not a valid file name", input);
					}
					return undefined;
				}
			});

			if (isFalsyOrWhitespace(name)) {
				return; // user cancelled
			}

			resource = joinPath(userDataProfileService.currentProfile.promptsHome, `${name}${RawToolSetsShape.suffix}`);

			if (!await fileService.exists(resource)) {
				await textFileService.write(resource, [
					'// Place your tool sets here...',
					'// Example:',
					'// {',
					'// \t"toolSetName": {',
					'// \t\t"tools": [',
					'// \t\t\t"someTool",',
					'// \t\t\t"anotherTool"',
					'// \t\t],',
					'// \t\t"description": "description",',
					'// \t\t"icon": "tools"',
					'// \t}',
					'// }',
				].join('\n'));
			}

		} else {
			assertType(pick.toolset.source.type === 'user');
			resource = pick.toolset.source.file;
		}

		await editorService.openEditor({ resource, options: { pinned: true } });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewsWelcome.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewsWelcome.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';

export const enum ChatViewsWelcomeExtensions {
	ChatViewsWelcomeRegistry = 'workbench.registry.chat.viewsWelcome',
}

export interface IChatViewsWelcomeDescriptor {
	readonly icon?: ThemeIcon;
	readonly title: string;
	readonly content: IMarkdownString;
	readonly when: ContextKeyExpression;
}

export interface IChatViewsWelcomeContributionRegistry {
	readonly onDidChange: Event<void>;
	get(): ReadonlyArray<IChatViewsWelcomeDescriptor>;
	register(descriptor: IChatViewsWelcomeDescriptor): void;
}

class ChatViewsWelcomeContributionRegistry extends Disposable implements IChatViewsWelcomeContributionRegistry {
	private readonly descriptors: IChatViewsWelcomeDescriptor[] = [];
	private readonly _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	public register(descriptor: IChatViewsWelcomeDescriptor): void {
		this.descriptors.push(descriptor);
		this._onDidChange.fire();
	}

	public get(): ReadonlyArray<IChatViewsWelcomeDescriptor> {
		return this.descriptors;
	}
}

export const chatViewsWelcomeRegistry = new ChatViewsWelcomeContributionRegistry();
Registry.add(ChatViewsWelcomeExtensions.ChatViewsWelcomeRegistry, chatViewsWelcomeRegistry);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewsWelcomeHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewsWelcomeHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../../base/common/jsonSchema.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { checkProposedApiEnabled } from '../../../../services/extensions/common/extensions.js';
import * as extensionsRegistry from '../../../../services/extensions/common/extensionsRegistry.js';
import { ChatViewsWelcomeExtensions, IChatViewsWelcomeContributionRegistry, IChatViewsWelcomeDescriptor } from './chatViewsWelcome.js';


const chatViewsWelcomeJsonSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['icon', 'title', 'contents', 'when'],
	properties: {
		icon: {
			type: 'string',
			description: localize('chatViewsWelcome.icon', 'The icon for the welcome message.'),
		},
		title: {
			type: 'string',
			description: localize('chatViewsWelcome.title', 'The title of the welcome message.'),
		},
		content: {
			type: 'string',
			description: localize('chatViewsWelcome.content', 'The content of the welcome message. The first command link will be rendered as a button.'),
		},
		when: {
			type: 'string',
			description: localize('chatViewsWelcome.when', 'Condition when the welcome message is shown.'),
		}
	}
} as const satisfies IJSONSchema;

type IRawChatViewsWelcomeContribution = TypeFromJsonSchema<typeof chatViewsWelcomeJsonSchema>;

const chatViewsWelcomeExtensionPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<IRawChatViewsWelcomeContribution[]>({
	extensionPoint: 'chatViewsWelcome',
	jsonSchema: {
		description: localize('vscode.extension.contributes.chatViewsWelcome', 'Contributes a welcome message to a chat view'),
		type: 'array',
		items: chatViewsWelcomeJsonSchema,
	},
});

export class ChatViewsWelcomeHandler implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatViewsWelcomeHandler';

	constructor(
		@ILogService private readonly logService: ILogService,
	) {
		chatViewsWelcomeExtensionPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				for (const providerDescriptor of extension.value) {
					checkProposedApiEnabled(extension.description, 'chatParticipantPrivate');

					const when = ContextKeyExpr.deserialize(providerDescriptor.when);
					if (!when) {
						this.logService.error(`Could not deserialize 'when' clause for chatViewsWelcome contribution: ${providerDescriptor.when}`);
						continue;
					}

					const descriptor: IChatViewsWelcomeDescriptor = {
						...providerDescriptor,
						when,
						icon: ThemeIcon.fromString(providerDescriptor.icon),
						content: new MarkdownString(providerDescriptor.content, { isTrusted: true }), // private API with command links
					};
					Registry.as<IChatViewsWelcomeContributionRegistry>(ChatViewsWelcomeExtensions.ChatViewsWelcomeRegistry).register(descriptor);
				}
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewWelcomeController.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/viewsWelcome/chatViewWelcomeController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asCSSUrl } from '../../../../../base/browser/cssValue.js';
import * as dom from '../../../../../base/browser/dom.js';
import { createCSSRule } from '../../../../../base/browser/domStylesheets.js';
import { StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { IRenderedMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { renderIcon } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Action, IAction } from '../../../../../base/common/actions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';
import { StringSHA1 } from '../../../../../base/common/hash.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IObservable, ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { IChatWidgetService } from '../chat.js';
import { chatViewsWelcomeRegistry, IChatViewsWelcomeDescriptor } from './chatViewsWelcome.js';

const $ = dom.$;

export interface IViewWelcomeDelegate {
	readonly onDidChangeViewWelcomeState: Event<void>;
	shouldShowWelcome(): boolean;
}

export class ChatViewWelcomeController extends Disposable {
	private element: HTMLElement | undefined;

	private enabled = false;
	private readonly enabledDisposables = this._register(new DisposableStore());
	private readonly renderDisposables = this._register(new DisposableStore());

	private readonly _isShowingWelcome: ISettableObservable<boolean> = observableValue(this, false);
	public get isShowingWelcome(): IObservable<boolean> {
		return this._isShowingWelcome;
	}

	constructor(
		private readonly container: HTMLElement,
		private readonly delegate: IViewWelcomeDelegate,
		private readonly location: ChatAgentLocation,
		@IContextKeyService private contextKeyService: IContextKeyService,
		@IInstantiationService private instantiationService: IInstantiationService,
	) {
		super();

		this.element = dom.append(this.container, dom.$('.chat-view-welcome'));
		this._register(Event.runAndSubscribe(
			delegate.onDidChangeViewWelcomeState,
			() => this.update()));
		this._register(chatViewsWelcomeRegistry.onDidChange(() => this.update(true)));
	}

	private update(force?: boolean): void {
		const enabled = this.delegate.shouldShowWelcome();
		if (this.enabled === enabled && !force) {
			return;
		}

		this.enabled = enabled;
		this.enabledDisposables.clear();

		if (!enabled) {
			this.container.classList.toggle('chat-view-welcome-visible', false);
			this.renderDisposables.clear();
			this._isShowingWelcome.set(false, undefined);
			return;
		}

		const descriptors = chatViewsWelcomeRegistry.get();
		if (descriptors.length) {
			this.render(descriptors);

			const descriptorKeys: Set<string> = new Set(descriptors.flatMap(d => d.when.keys()));
			this.enabledDisposables.add(this.contextKeyService.onDidChangeContext(e => {
				if (e.affectsSome(descriptorKeys)) {
					this.render(descriptors);
				}
			}));
		}
	}

	private render(descriptors: ReadonlyArray<IChatViewsWelcomeDescriptor>): void {
		this.renderDisposables.clear();
		dom.clearNode(this.element!);

		const matchingDescriptors = descriptors.filter(descriptor => this.contextKeyService.contextMatchesRules(descriptor.when));
		const enabledDescriptor = matchingDescriptors.at(0);
		if (enabledDescriptor) {
			const content: IChatViewWelcomeContent = {
				icon: enabledDescriptor.icon,
				title: enabledDescriptor.title,
				message: enabledDescriptor.content
			};
			const welcomeView = this.renderDisposables.add(this.instantiationService.createInstance(ChatViewWelcomePart, content, { firstLinkToButton: true, location: this.location }));
			this.element!.appendChild(welcomeView.element);
			this.container.classList.toggle('chat-view-welcome-visible', true);
			this._isShowingWelcome.set(true, undefined);
		} else {
			this.container.classList.toggle('chat-view-welcome-visible', false);
			this._isShowingWelcome.set(false, undefined);
		}
	}
}

export interface IChatViewWelcomeContent {
	readonly icon?: ThemeIcon | URI;
	readonly title: string;
	readonly message: IMarkdownString;
	readonly additionalMessage?: string | IMarkdownString;
	tips?: IMarkdownString;
	readonly inputPart?: HTMLElement;
	readonly suggestedPrompts?: readonly IChatSuggestedPrompts[];
	readonly useLargeIcon?: boolean;
}

export interface IChatSuggestedPrompts {
	readonly icon?: ThemeIcon;
	readonly label: string;
	readonly description?: string;
	readonly prompt: string;
	readonly uri?: URI;
}

export interface IChatViewWelcomeRenderOptions {
	readonly firstLinkToButton?: boolean;
	readonly location: ChatAgentLocation;
	readonly isWidgetAgentWelcomeViewContent?: boolean;
}

export class ChatViewWelcomePart extends Disposable {
	public readonly element: HTMLElement;

	constructor(
		public readonly content: IChatViewWelcomeContent,
		options: IChatViewWelcomeRenderOptions | undefined,
		@IOpenerService private openerService: IOpenerService,
		@ILogService private logService: ILogService,
		@IChatWidgetService private chatWidgetService: IChatWidgetService,
		@ITelemetryService private telemetryService: ITelemetryService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		super();

		this.element = dom.$('.chat-welcome-view');

		try {

			// Icon
			const icon = dom.append(this.element, $('.chat-welcome-view-icon'));
			if (content.useLargeIcon) {
				icon.classList.add('large-icon');
			}
			if (content.icon) {
				if (ThemeIcon.isThemeIcon(content.icon)) {
					const iconElement = renderIcon(content.icon);
					icon.appendChild(iconElement);
				} else if (URI.isUri(content.icon)) {
					const cssUrl = asCSSUrl(content.icon);
					const hash = new StringSHA1();
					hash.update(cssUrl);
					const iconId = `chat-welcome-icon-${hash.digest()}`;
					const iconClass = `.chat-welcome-view-icon.${iconId}`;

					createCSSRule(iconClass, `
					mask: ${cssUrl} no-repeat 50% 50%;
					-webkit-mask: ${cssUrl} no-repeat 50% 50%;
					background-color: var(--vscode-icon-foreground);
				`);
					icon.classList.add(iconId, 'custom-icon');
				}
			}
			const title = dom.append(this.element, $('.chat-welcome-view-title'));
			title.textContent = content.title;

			const message = dom.append(this.element, $('.chat-welcome-view-message'));

			const messageResult = this.renderMarkdownMessageContent(content.message, options);
			dom.append(message, messageResult.element);

			// Additional message
			if (content.additionalMessage) {
				const disclaimers = dom.append(this.element, $('.chat-welcome-view-disclaimer'));
				if (typeof content.additionalMessage === 'string') {
					disclaimers.textContent = content.additionalMessage;
				} else {
					const additionalMessageResult = this.renderMarkdownMessageContent(content.additionalMessage, options);
					disclaimers.appendChild(additionalMessageResult.element);
				}
			}

			// Render suggested prompts for both new user and regular modes
			if (content.suggestedPrompts && content.suggestedPrompts.length) {
				const suggestedPromptsContainer = dom.append(this.element, $('.chat-welcome-view-suggested-prompts'));
				const titleElement = dom.append(suggestedPromptsContainer, $('.chat-welcome-view-suggested-prompts-title'));
				titleElement.textContent = localize('chatWidget.suggestedActions', 'Suggested Actions');

				for (const prompt of content.suggestedPrompts) {
					const promptElement = dom.append(suggestedPromptsContainer, $('.chat-welcome-view-suggested-prompt'));
					// Make the prompt element keyboard accessible
					promptElement.setAttribute('role', 'button');
					promptElement.setAttribute('tabindex', '0');
					const promptAriaLabel = prompt.description
						? localize('suggestedPromptAriaLabelWithDescription', 'Suggested prompt: {0}, {1}', prompt.label, prompt.description)
						: localize('suggestedPromptAriaLabel', 'Suggested prompt: {0}', prompt.label);
					promptElement.setAttribute('aria-label', promptAriaLabel);
					const titleElement = dom.append(promptElement, $('.chat-welcome-view-suggested-prompt-title'));
					titleElement.textContent = prompt.label;
					const tooltip = localize('runPromptTitle', "Suggested prompt: {0}", prompt.prompt);
					promptElement.title = tooltip;
					titleElement.title = tooltip;
					if (prompt.description) {
						const descriptionElement = dom.append(promptElement, $('.chat-welcome-view-suggested-prompt-description'));
						descriptionElement.textContent = prompt.description;
						descriptionElement.title = prompt.description;
					}
					const executePrompt = () => {
						type SuggestedPromptClickEvent = { suggestedPrompt: string };

						type SuggestedPromptClickData = {
							owner: 'bhavyaus';
							comment: 'Event used to gain insights into when suggested prompts are clicked.';
							suggestedPrompt: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The suggested prompt clicked.' };
						};

						this.telemetryService.publicLog2<SuggestedPromptClickEvent, SuggestedPromptClickData>('chat.clickedSuggestedPrompt', {
							suggestedPrompt: prompt.prompt,
						});

						if (!this.chatWidgetService.lastFocusedWidget) {
							const widgets = this.chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat);
							if (widgets.length) {
								widgets[0].setInput(prompt.prompt);
							}
						} else {
							this.chatWidgetService.lastFocusedWidget.setInput(prompt.prompt);
						}
					};
					// Add context menu handler
					this._register(dom.addDisposableListener(promptElement, dom.EventType.CONTEXT_MENU, (e: MouseEvent) => {
						e.preventDefault();
						e.stopImmediatePropagation();

						const actions = this.getPromptContextMenuActions(prompt);

						this.contextMenuService.showContextMenu({
							getAnchor: () => ({ x: e.clientX, y: e.clientY }),
							getActions: () => actions,
						});
					}));
					// Add click handler
					this._register(dom.addDisposableListener(promptElement, dom.EventType.CLICK, executePrompt));
					// Add keyboard handler
					this._register(dom.addDisposableListener(promptElement, dom.EventType.KEY_DOWN, (e) => {
						const event = new StandardKeyboardEvent(e);
						if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
							e.preventDefault();
							e.stopPropagation();
							executePrompt();
						}
						else if (event.equals(KeyCode.F10) && event.shiftKey) {
							e.preventDefault();
							e.stopPropagation();
							const actions = this.getPromptContextMenuActions(prompt);
							this.contextMenuService.showContextMenu({
								getAnchor: () => promptElement,
								getActions: () => actions,
							});
						}
					}));
				}
			}

			// Tips
			if (content.tips) {
				const tips = dom.append(this.element, $('.chat-welcome-view-tips'));
				const tipsResult = this._register(this.markdownRendererService.render(content.tips));
				tips.appendChild(tipsResult.element);
			}
		} catch (err) {
			this.logService.error('Failed to render chat view welcome content', err);
		}
	}

	private getPromptContextMenuActions(prompt: IChatSuggestedPrompts): IAction[] {
		const actions: IAction[] = [];
		if (prompt.uri) {
			const uri = prompt.uri;
			actions.push(new Action(
				'chat.editPromptFile',
				localize('editPromptFile', "Edit Prompt File"),
				ThemeIcon.asClassName(Codicon.goToFile),
				true,
				async () => {
					try {
						await this.openerService.open(uri);
					} catch (error) {
						this.logService.error('Failed to open prompt file:', error);
					}
				}
			));
		}
		return actions;
	}

	public needsRerender(content: IChatViewWelcomeContent): boolean {
		// Heuristic based on content that changes between states
		return !!(
			this.content.title !== content.title ||
			this.content.message.value !== content.message.value ||
			this.content.additionalMessage !== content.additionalMessage ||
			this.content.tips?.value !== content.tips?.value ||
			this.content.suggestedPrompts?.length !== content.suggestedPrompts?.length ||
			this.content.suggestedPrompts?.some((prompt, index) => {
				const incoming = content.suggestedPrompts?.[index];
				return incoming?.label !== prompt.label || incoming?.description !== prompt.description;
			}));
	}

	private renderMarkdownMessageContent(content: IMarkdownString, options: IChatViewWelcomeRenderOptions | undefined): IRenderedMarkdown {
		const messageResult = this._register(this.markdownRendererService.render(content));
		// eslint-disable-next-line no-restricted-syntax
		const firstLink = options?.firstLinkToButton ? messageResult.element.querySelector('a') : undefined;
		if (firstLink) {
			const target = firstLink.getAttribute('data-href');
			const button = this._register(new Button(firstLink.parentElement!, defaultButtonStyles));
			button.label = firstLink.textContent ?? '';
			if (target) {
				this._register(button.onDidClick(() => {
					this.openerService.open(target, { allowCommands: true });
				}));
			}
			firstLink.replaceWith(button.element);
		}
		return messageResult;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/annotations.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/annotations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { findLastIdx } from '../../../../base/common/arraysFind.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IChatProgressRenderableResponseContent, IChatProgressResponseContent, appendMarkdownString, canMergeMarkdownStrings } from './chatModel.js';
import { IChatAgentVulnerabilityDetails, IChatMarkdownContent } from './chatService.js';

export const contentRefUrl = 'http://_vscodecontentref_'; // must be lowercase for URI

export function annotateSpecialMarkdownContent(response: Iterable<IChatProgressResponseContent>): IChatProgressRenderableResponseContent[] {
	let refIdPool = 0;

	const result: IChatProgressRenderableResponseContent[] = [];
	for (const item of response) {
		const previousItemIndex = findLastIdx(result, p => p.kind !== 'textEditGroup' && p.kind !== 'undoStop');
		const previousItem = result[previousItemIndex];
		if (item.kind === 'inlineReference') {
			let label: string | undefined = item.name;
			if (!label) {
				if (URI.isUri(item.inlineReference)) {
					label = basename(item.inlineReference);
				} else if ('name' in item.inlineReference) {
					label = item.inlineReference.name;
				} else {
					label = basename(item.inlineReference.uri);
				}
			}

			const refId = refIdPool++;
			const printUri = URI.parse(contentRefUrl).with({ path: String(refId) });
			const markdownText = `[${label}](${printUri.toString()})`;

			const annotationMetadata = { [refId]: item };

			if (previousItem?.kind === 'markdownContent') {
				const merged = appendMarkdownString(previousItem.content, new MarkdownString(markdownText));
				result[previousItemIndex] = { ...previousItem, content: merged, inlineReferences: { ...annotationMetadata, ...(previousItem.inlineReferences || {}) } };
			} else {
				result.push({ content: new MarkdownString(markdownText), inlineReferences: annotationMetadata, kind: 'markdownContent' });
			}
		} else if (item.kind === 'markdownContent' && previousItem?.kind === 'markdownContent' && canMergeMarkdownStrings(previousItem.content, item.content)) {
			const merged = appendMarkdownString(previousItem.content, item.content);
			result[previousItemIndex] = { ...previousItem, content: merged };
		} else if (item.kind === 'markdownVuln') {
			const vulnText = encodeURIComponent(JSON.stringify(item.vulnerabilities));
			const markdownText = `<vscode_annotation details='${vulnText}'>${item.content.value}</vscode_annotation>`;
			if (previousItem?.kind === 'markdownContent') {
				// Since this is inside a codeblock, it needs to be merged into the previous markdown content.
				const merged = appendMarkdownString(previousItem.content, new MarkdownString(markdownText));
				result[previousItemIndex] = { ...previousItem, content: merged };
			} else {
				result.push({ content: new MarkdownString(markdownText), kind: 'markdownContent' });
			}
		} else if (item.kind === 'codeblockUri') {
			if (previousItem?.kind === 'markdownContent') {
				const isEditText = item.isEdit ? ` isEdit` : '';
				const markdownText = `<vscode_codeblock_uri${isEditText}>${item.uri.toString()}</vscode_codeblock_uri>`;
				const merged = appendMarkdownString(previousItem.content, new MarkdownString(markdownText));
				// delete the previous and append to ensure that we don't reorder the edit before the undo stop containing it
				result.splice(previousItemIndex, 1);
				result.push({ ...previousItem, content: merged });
			}
		} else {
			result.push(item);
		}
	}

	return result;
}

export interface IMarkdownVulnerability {
	readonly title: string;
	readonly description: string;
	readonly range: IRange;
}

export function annotateVulnerabilitiesInText(response: ReadonlyArray<IChatProgressResponseContent>): readonly IChatMarkdownContent[] {
	const result: IChatMarkdownContent[] = [];
	for (const item of response) {
		const previousItem = result[result.length - 1];
		if (item.kind === 'markdownContent') {
			if (previousItem?.kind === 'markdownContent') {
				result[result.length - 1] = { content: new MarkdownString(previousItem.content.value + item.content.value, { isTrusted: previousItem.content.isTrusted }), kind: 'markdownContent' };
			} else {
				result.push(item);
			}
		} else if (item.kind === 'markdownVuln') {
			const vulnText = encodeURIComponent(JSON.stringify(item.vulnerabilities));
			const markdownText = `<vscode_annotation details='${vulnText}'>${item.content.value}</vscode_annotation>`;
			if (previousItem?.kind === 'markdownContent') {
				result[result.length - 1] = { content: new MarkdownString(previousItem.content.value + markdownText, { isTrusted: previousItem.content.isTrusted }), kind: 'markdownContent' };
			} else {
				result.push({ content: new MarkdownString(markdownText), kind: 'markdownContent' });
			}
		}
	}

	return result;
}

export function extractCodeblockUrisFromText(text: string): { uri: URI; isEdit?: boolean; textWithoutResult: string } | undefined {
	const match = /<vscode_codeblock_uri( isEdit)?>(.*?)<\/vscode_codeblock_uri>/ms.exec(text);
	if (match) {
		const [all, isEdit, uriString] = match;
		if (uriString) {
			const result = URI.parse(uriString);
			const textWithoutResult = text.substring(0, match.index) + text.substring(match.index + all.length);
			return { uri: result, textWithoutResult, isEdit: !!isEdit };
		}
	}
	return undefined;
}

export function extractVulnerabilitiesFromText(text: string): { newText: string; vulnerabilities: IMarkdownVulnerability[] } {
	const vulnerabilities: IMarkdownVulnerability[] = [];
	let newText = text;
	let match: RegExpExecArray | null;
	while ((match = /<vscode_annotation details='(.*?)'>(.*?)<\/vscode_annotation>/ms.exec(newText)) !== null) {
		const [full, details, content] = match;
		const start = match.index;
		const textBefore = newText.substring(0, start);
		const linesBefore = textBefore.split('\n').length - 1;
		const linesInside = content.split('\n').length - 1;

		const previousNewlineIdx = textBefore.lastIndexOf('\n');
		const startColumn = start - (previousNewlineIdx + 1) + 1;
		const endPreviousNewlineIdx = (textBefore + content).lastIndexOf('\n');
		const endColumn = start + content.length - (endPreviousNewlineIdx + 1) + 1;

		try {
			const vulnDetails: IChatAgentVulnerabilityDetails[] = JSON.parse(decodeURIComponent(details));
			vulnDetails.forEach(({ title, description }) => vulnerabilities.push({
				title, description, range: { startLineNumber: linesBefore + 1, startColumn, endLineNumber: linesBefore + linesInside + 1, endColumn }
			}));
		} catch (err) {
			// Something went wrong with encoding this text, just ignore it
		}
		newText = newText.substring(0, start) + content + newText.substring(start + full.length);
	}

	return { newText, vulnerabilities };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chat.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResourceSet } from '../../../../base/common/map.js';
import { chatEditingSessionIsReady } from './chatEditingService.js';
import { IChatModel } from './chatModel.js';
import type { IChatSessionStats, IChatTerminalToolInvocationData, ILegacyChatTerminalToolInvocationData } from './chatService.js';
import { ChatModeKind } from './constants.js';

export function checkModeOption(mode: ChatModeKind, option: boolean | ((mode: ChatModeKind) => boolean) | undefined): boolean | undefined {
	if (option === undefined) {
		return undefined;
	}
	if (typeof option === 'function') {
		return option(mode);
	}
	return option;
}

/**
 * @deprecated This is the old API shape, we should support this for a while before removing it so
 * we don't break existing chats
 */
export function migrateLegacyTerminalToolSpecificData(data: IChatTerminalToolInvocationData | ILegacyChatTerminalToolInvocationData): IChatTerminalToolInvocationData {
	if ('command' in data) {
		data = {
			kind: 'terminal',
			commandLine: {
				original: data.command,
				toolEdited: undefined,
				userEdited: undefined
			},
			language: data.language
		} satisfies IChatTerminalToolInvocationData;
	}
	return data;
}

export async function awaitStatsForSession(model: IChatModel): Promise<IChatSessionStats | undefined> {
	if (!model.editingSession) {
		return undefined;
	}

	await chatEditingSessionIsReady(model.editingSession);
	await Promise.all(model.editingSession.entries.get().map(entry => entry.getDiffInfo?.()));

	const diffs = model.editingSession.entries.get();
	const reduceResult = diffs.reduce((acc, diff) => {
		acc.fileUris.add(diff.originalURI);
		acc.added += diff.linesAdded?.get() ?? 0;
		acc.removed += diff.linesRemoved?.get() ?? 0;
		return acc;
	}, { fileUris: new ResourceSet(), added: 0, removed: 0 });

	if (reduceResult.fileUris.size > 0 && (reduceResult.added > 0 || reduceResult.removed > 0)) {
		return {
			fileCount: reduceResult.fileUris.size,
			added: reduceResult.added,
			removed: reduceResult.removed
		};
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { URI } from '../../../../base/common/uri.js';

export interface IChatViewTitleActionContext {
	readonly $mid: MarshalledId.ChatViewContext;
	readonly sessionResource: URI;
}

export function isChatViewTitleActionContext(obj: unknown): obj is IChatViewTitleActionContext {
	return !!obj &&
		URI.isUri((obj as IChatViewTitleActionContext).sessionResource)
		&& (obj as IChatViewTitleActionContext).$mid === MarshalledId.ChatViewContext;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatAgents.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatAgents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLast } from '../../../../base/common/arraysFind.js';
import { timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { revive, Revived } from '../../../../base/common/marshalling.js';
import { IObservable, observableValue } from '../../../../base/common/observable.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Command } from '../../../../editor/common/languages.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asJson, IRequestService } from '../../../../platform/request/common/request.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ChatContextKeys } from './chatContextKeys.js';
import { IChatAgentEditedFileEvent, IChatProgressHistoryResponseContent, IChatRequestModeInstructions, IChatRequestVariableData, ISerializableChatAgentData } from './chatModel.js';
import { IRawChatCommandContribution } from './chatParticipantContribTypes.js';
import { IChatFollowup, IChatLocationData, IChatProgress, IChatResponseErrorDetails, IChatTaskDto } from './chatService.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from './constants.js';

//#region agent service, commands etc

export interface IChatAgentHistoryEntry {
	request: IChatAgentRequest;
	response: ReadonlyArray<IChatProgressHistoryResponseContent | IChatTaskDto>;
	result: IChatAgentResult;
}

export interface IChatAgentAttachmentCapabilities {
	supportsFileAttachments?: boolean;
	supportsToolAttachments?: boolean;
	supportsMCPAttachments?: boolean;
	supportsImageAttachments?: boolean;
	supportsSearchResultAttachments?: boolean;
	supportsInstructionAttachments?: boolean;
	supportsSourceControlAttachments?: boolean;
	supportsProblemAttachments?: boolean;
	supportsSymbolAttachments?: boolean;
	supportsTerminalAttachments?: boolean;
}

export interface IChatAgentData {
	id: string;
	name: string;
	fullName?: string;
	description?: string;
	/** This is string, not ContextKeyExpression, because dealing with serializing/deserializing is hard and need a better pattern for this */
	when?: string;
	extensionId: ExtensionIdentifier;
	extensionVersion: string | undefined;
	extensionPublisherId: string;
	/** This is the extension publisher id, or, in the case of a dynamically registered participant (remote agent), whatever publisher name we have for it */
	publisherDisplayName?: string;
	extensionDisplayName: string;
	/** The agent invoked when no agent is specified */
	isDefault?: boolean;
	/** This agent is not contributed in package.json, but is registered dynamically */
	isDynamic?: boolean;
	/** This agent is contributed from core and not from an extension */
	isCore?: boolean;
	canAccessPreviousChatHistory?: boolean;
	metadata: IChatAgentMetadata;
	slashCommands: IChatAgentCommand[];
	locations: ChatAgentLocation[];
	/** This is only relevant for isDefault agents. Others should have all modes available. */
	modes: ChatModeKind[];
	disambiguation: { category: string; description: string; examples: string[] }[];
	capabilities?: IChatAgentAttachmentCapabilities;
}

export interface IChatWelcomeMessageContent {
	icon: ThemeIcon;
	title: string;
	message: IMarkdownString;
}

export interface IChatAgentImplementation {
	invoke(request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult>;
	setRequestTools?(requestId: string, tools: UserSelectedTools): void;
	provideFollowups?(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]>;
	provideChatTitle?: (history: IChatAgentHistoryEntry[], token: CancellationToken) => Promise<string | undefined>;
	provideChatSummary?: (history: IChatAgentHistoryEntry[], token: CancellationToken) => Promise<string | undefined>;
}

export interface IChatParticipantDetectionResult {
	participant: string;
	command?: string;
}

export interface IChatParticipantMetadata {
	participant: string;
	command?: string;
	disambiguation: { category: string; description: string; examples: string[] }[];
}

export interface IChatParticipantDetectionProvider {
	provideParticipantDetection(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation; participants: IChatParticipantMetadata[] }, token: CancellationToken): Promise<IChatParticipantDetectionResult | null | undefined>;
}

export type IChatAgent = IChatAgentData & IChatAgentImplementation;

export interface IChatAgentCommand extends IRawChatCommandContribution {
	followupPlaceholder?: string;
}

export interface IChatAgentMetadata {
	helpTextPrefix?: string | IMarkdownString;
	helpTextPostfix?: string | IMarkdownString;
	icon?: URI;
	iconDark?: URI;
	themeIcon?: ThemeIcon;
	sampleRequest?: string;
	supportIssueReporting?: boolean;
	followupPlaceholder?: string;
	isSticky?: boolean;
	additionalWelcomeMessage?: string | IMarkdownString;
}

export type UserSelectedTools = Record<string, boolean>;


export interface IChatAgentRequest {
	sessionResource: URI;
	requestId: string;
	agentId: string;
	command?: string;
	message: string;
	attempt?: number;
	enableCommandDetection?: boolean;
	isParticipantDetected?: boolean;
	variables: IChatRequestVariableData;
	location: ChatAgentLocation;
	locationData?: Revived<IChatLocationData>;
	acceptedConfirmationData?: unknown[];
	rejectedConfirmationData?: unknown[];
	userSelectedModelId?: string;
	userSelectedTools?: UserSelectedTools;
	modeInstructions?: IChatRequestModeInstructions;
	editedFileEvents?: IChatAgentEditedFileEvent[];
	isSubagent?: boolean;

}

export interface IChatQuestion {
	readonly prompt: string;
	readonly participant?: string;
	readonly command?: string;
}

export interface IChatAgentResultTimings {
	firstProgress?: number;
	totalElapsed: number;
}

export interface IChatAgentResult {
	errorDetails?: IChatResponseErrorDetails;
	timings?: IChatAgentResultTimings;
	/** Extra properties that the agent can use to identify a result */
	readonly metadata?: { readonly [key: string]: unknown };
	readonly details?: string;
	nextQuestion?: IChatQuestion;
}

export const IChatAgentService = createDecorator<IChatAgentService>('chatAgentService');

interface IChatAgentEntry {
	data: IChatAgentData;
	impl?: IChatAgentImplementation;
}

export interface IChatAgentCompletionItem {
	id: string;
	name?: string;
	fullName?: string;
	icon?: ThemeIcon;
	value: unknown;
	command?: Command;
}

export interface IChatAgentService {
	_serviceBrand: undefined;
	/**
	 * undefined when an agent was removed
	 */
	readonly onDidChangeAgents: Event<IChatAgent | undefined>;
	readonly hasToolsAgent: boolean;
	registerAgent(id: string, data: IChatAgentData): IDisposable;
	registerAgentImplementation(id: string, agent: IChatAgentImplementation): IDisposable;
	registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable;
	registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>): IDisposable;
	getAgentCompletionItems(id: string, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]>;
	registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider): IDisposable;
	detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined>;
	hasChatParticipantDetectionProviders(): boolean;
	invokeAgent(agent: string, request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult>;
	setRequestTools(agent: string, requestId: string, tools: UserSelectedTools): void;
	getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]>;
	getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined>;
	getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined>;
	getAgent(id: string, includeDisabled?: boolean): IChatAgentData | undefined;
	getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined;
	getAgents(): IChatAgentData[];
	getActivatedAgents(): Array<IChatAgent>;
	getAgentsByName(name: string): IChatAgentData[];
	agentHasDupeName(id: string): boolean;

	/**
	 * Get the default agent (only if activated)
	 */
	getDefaultAgent(location: ChatAgentLocation, mode?: ChatModeKind): IChatAgent | undefined;

	/**
	 * Get the default agent data that has been contributed (may not be activated yet)
	 */
	getContributedDefaultAgent(location: ChatAgentLocation): IChatAgentData | undefined;
	updateAgent(id: string, updateMetadata: IChatAgentMetadata): void;
}

export class ChatAgentService extends Disposable implements IChatAgentService {

	public static readonly AGENT_LEADER = '@';

	declare _serviceBrand: undefined;

	private _agents = new Map<string, IChatAgentEntry>();

	private readonly _onDidChangeAgents = new Emitter<IChatAgent | undefined>();
	readonly onDidChangeAgents: Event<IChatAgent | undefined> = this._onDidChangeAgents.event;

	private readonly _agentsContextKeys = new Set<string>();
	private readonly _hasDefaultAgent: IContextKey<boolean>;
	private readonly _extensionAgentRegistered: IContextKey<boolean>;
	private readonly _defaultAgentRegistered: IContextKey<boolean>;
	private _hasToolsAgent = false;

	private _chatParticipantDetectionProviders = new Map<number, IChatParticipantDetectionProvider>();

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._hasDefaultAgent = ChatContextKeys.enabled.bindTo(this.contextKeyService);
		this._extensionAgentRegistered = ChatContextKeys.extensionParticipantRegistered.bindTo(this.contextKeyService);
		this._defaultAgentRegistered = ChatContextKeys.panelParticipantRegistered.bindTo(this.contextKeyService);
		this._register(contextKeyService.onDidChangeContext((e) => {
			if (e.affectsSome(this._agentsContextKeys)) {
				this._updateContextKeys();
			}
		}));
	}

	registerAgent(id: string, data: IChatAgentData): IDisposable {
		const existingAgent = this.getAgent(id);
		if (existingAgent) {
			throw new Error(`Agent already registered: ${JSON.stringify(id)}`);
		}

		const that = this;
		const commands = data.slashCommands;
		data = {
			...data,
			get slashCommands() {
				return commands.filter(c => !c.when || that.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(c.when)));
			}
		};
		const entry = { data };
		this._agents.set(id, entry);
		this._updateAgentsContextKeys();
		this._updateContextKeys();
		this._onDidChangeAgents.fire(undefined);

		return toDisposable(() => {
			this._agents.delete(id);
			this._updateAgentsContextKeys();
			this._updateContextKeys();
			this._onDidChangeAgents.fire(undefined);
		});
	}

	private _updateAgentsContextKeys(): void {
		// Update the set of context keys used by all agents
		this._agentsContextKeys.clear();
		for (const agent of this._agents.values()) {
			if (agent.data.when) {
				const expr = ContextKeyExpr.deserialize(agent.data.when);
				for (const key of expr?.keys() || []) {
					this._agentsContextKeys.add(key);
				}
			}
		}
	}

	private _updateContextKeys(): void {
		let extensionAgentRegistered = false;
		let defaultAgentRegistered = false;
		let toolsAgentRegistered = false;
		for (const agent of this.getAgents()) {
			if (agent.isDefault) {
				if (!agent.isCore) {
					extensionAgentRegistered = true;
				}
				if (agent.id === 'chat.setup' || agent.id === 'github.copilot.editsAgent') {
					// TODO@roblourens firing the event below probably isn't necessary but leave it alone for now
					toolsAgentRegistered = true;
				} else {
					defaultAgentRegistered = true;
				}
			}
		}
		this._defaultAgentRegistered.set(defaultAgentRegistered);
		this._extensionAgentRegistered.set(extensionAgentRegistered);
		if (toolsAgentRegistered !== this._hasToolsAgent) {
			this._hasToolsAgent = toolsAgentRegistered;
			this._onDidChangeAgents.fire(this.getDefaultAgent(ChatAgentLocation.Chat, ChatModeKind.Agent));
		}
	}

	registerAgentImplementation(id: string, agentImpl: IChatAgentImplementation): IDisposable {
		const entry = this._agents.get(id);
		if (!entry) {
			throw new Error(`Unknown agent: ${JSON.stringify(id)}`);
		}

		if (entry.impl) {
			throw new Error(`Agent already has implementation: ${JSON.stringify(id)}`);
		}

		if (entry.data.isDefault) {
			this._hasDefaultAgent.set(true);
		}

		entry.impl = agentImpl;
		this._onDidChangeAgents.fire(new MergedChatAgent(entry.data, agentImpl));

		return toDisposable(() => {
			entry.impl = undefined;
			this._onDidChangeAgents.fire(undefined);

			if (entry.data.isDefault) {
				this._hasDefaultAgent.set(Iterable.some(this._agents.values(), agent => agent.data.isDefault));
			}
		});
	}

	registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable {
		data.isDynamic = true;
		const agent = { data, impl: agentImpl };
		this._agents.set(data.id, agent);
		this._onDidChangeAgents.fire(new MergedChatAgent(data, agentImpl));

		return toDisposable(() => {
			this._agents.delete(data.id);
			this._onDidChangeAgents.fire(undefined);
		});
	}

	private _agentCompletionProviders = new Map<string, (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>>();

	registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>) {
		this._agentCompletionProviders.set(id, provider);
		return {
			dispose: () => { this._agentCompletionProviders.delete(id); }
		};
	}

	async getAgentCompletionItems(id: string, query: string, token: CancellationToken) {
		return await this._agentCompletionProviders.get(id)?.(query, token) ?? [];
	}

	updateAgent(id: string, updateMetadata: IChatAgentMetadata): void {
		const agent = this._agents.get(id);
		if (!agent?.impl) {
			throw new Error(`No activated agent with id ${JSON.stringify(id)} registered`);
		}
		agent.data.metadata = { ...agent.data.metadata, ...updateMetadata };
		this._onDidChangeAgents.fire(new MergedChatAgent(agent.data, agent.impl));
	}

	getDefaultAgent(location: ChatAgentLocation, mode: ChatModeKind = ChatModeKind.Ask): IChatAgent | undefined {
		return this._preferExtensionAgent(this.getActivatedAgents().filter(a => {
			if (mode && !a.modes.includes(mode)) {
				return false;
			}

			return !!a.isDefault && a.locations.includes(location);
		}));
	}

	public get hasToolsAgent(): boolean {
		// The chat participant enablement is just based on this setting. Don't wait for the extension to be loaded.
		return !!this.configurationService.getValue(ChatConfiguration.AgentEnabled);
	}

	getContributedDefaultAgent(location: ChatAgentLocation): IChatAgentData | undefined {
		return this._preferExtensionAgent(this.getAgents().filter(a => !!a.isDefault && a.locations.includes(location)));
	}

	private _preferExtensionAgent<T extends IChatAgentData>(agents: T[]): T | undefined {
		// We potentially have multiple agents on the same location,
		// contributed from core and from extensions.
		// This method will prefer the last extensions provided agent
		// falling back to the last core agent if no extension agent is found.
		return findLast(agents, agent => !agent.isCore) ?? agents.at(-1);
	}

	getAgent(id: string, includeDisabled = false): IChatAgentData | undefined {
		if (!this._agentIsEnabled(id) && !includeDisabled) {
			return;
		}

		return this._agents.get(id)?.data;
	}

	private _agentIsEnabled(idOrAgent: string | IChatAgentEntry): boolean {
		const entry = typeof idOrAgent === 'string' ? this._agents.get(idOrAgent) : idOrAgent;
		return !entry?.data.when || this.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(entry.data.when));
	}

	getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined {
		const agent = Iterable.find(this._agents.values(), a => getFullyQualifiedId(a.data) === id)?.data;
		if (agent && !this._agentIsEnabled(agent.id)) {
			return;
		}

		return agent;
	}

	/**
	 * Returns all agent datas that exist- static registered and dynamic ones.
	 */
	getAgents(): IChatAgentData[] {
		return Array.from(this._agents.values())
			.map(entry => entry.data)
			.filter(a => this._agentIsEnabled(a.id));
	}

	getActivatedAgents(): IChatAgent[] {
		return Array.from(this._agents.values())
			.filter(a => !!a.impl)
			.filter(a => this._agentIsEnabled(a.data.id))
			.map(a => new MergedChatAgent(a.data, a.impl!));
	}

	getAgentsByName(name: string): IChatAgentData[] {
		return this._preferExtensionAgents(this.getAgents().filter(a => a.name === name));
	}

	private _preferExtensionAgents<T extends IChatAgentData>(agents: T[]): T[] {
		// We potentially have multiple agents on the same location,
		// contributed from core and from extensions.
		// This method will prefer the extensions provided agents
		// falling back to the original agents array extension agent is found.
		const extensionAgents = agents.filter(a => !a.isCore);
		return extensionAgents.length > 0 ? extensionAgents : agents;
	}

	agentHasDupeName(id: string): boolean {
		const agent = this.getAgent(id);
		if (!agent) {
			return false;
		}

		return this.getAgentsByName(agent.name)
			.filter(a => a.extensionId.value !== agent.extensionId.value).length > 0;
	}

	async invokeAgent(id: string, request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> {
		const data = this._agents.get(id);
		if (!data?.impl) {
			throw new Error(`No activated agent with id "${id}"`);
		}

		return await data.impl.invoke(request, progress, history, token);
	}

	setRequestTools(id: string, requestId: string, tools: UserSelectedTools): void {
		const data = this._agents.get(id);
		if (!data?.impl) {
			throw new Error(`No activated agent with id "${id}"`);
		}

		data.impl.setRequestTools?.(requestId, tools);
	}

	async getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideFollowups) {
			return [];
		}

		return data.impl.provideFollowups(request, result, history, token);
	}

	async getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideChatTitle) {
			return undefined;
		}

		return data.impl.provideChatTitle(history, token);
	}

	async getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> {
		const data = this._agents.get(id);
		if (!data?.impl?.provideChatSummary) {
			return undefined;
		}

		return data.impl.provideChatSummary(history, token);
	}

	registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider) {
		this._chatParticipantDetectionProviders.set(handle, provider);
		return toDisposable(() => {
			this._chatParticipantDetectionProviders.delete(handle);
		});
	}

	hasChatParticipantDetectionProviders() {
		return this._chatParticipantDetectionProviders.size > 0;
	}

	async detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined> {
		// TODO@joyceerhl should we have a selector to be able to narrow down which provider to use
		const provider = Iterable.first(this._chatParticipantDetectionProviders.values());
		if (!provider) {
			return;
		}

		const participants = this.getAgents().reduce<IChatParticipantMetadata[]>((acc, a) => {
			if (a.locations.includes(options.location)) {
				acc.push({ participant: a.id, disambiguation: a.disambiguation ?? [] });
				for (const command of a.slashCommands) {
					acc.push({ participant: a.id, command: command.name, disambiguation: command.disambiguation ?? [] });
				}
			}
			return acc;
		}, []);

		const result = await provider.provideParticipantDetection(request, history, { ...options, participants }, token);
		if (!result) {
			return;
		}

		const agent = this.getAgent(result.participant);
		if (!agent) {
			// Couldn't find a participant matching the participant detection result
			return;
		}

		if (!result.command) {
			return { agent };
		}

		const command = agent?.slashCommands.find(c => c.name === result.command);
		if (!command) {
			// Couldn't find a slash command matching the participant detection result
			return;
		}

		return { agent, command };
	}
}

export class MergedChatAgent implements IChatAgent {
	constructor(
		private readonly data: IChatAgentData,
		private readonly impl: IChatAgentImplementation
	) { }
	when?: string | undefined;
	publisherDisplayName?: string | undefined;
	isDynamic?: boolean | undefined;

	get id(): string { return this.data.id; }
	get name(): string { return this.data.name ?? ''; }
	get fullName(): string { return this.data.fullName ?? ''; }
	get description(): string { return this.data.description ?? ''; }
	get extensionId(): ExtensionIdentifier { return this.data.extensionId; }
	get extensionVersion(): string | undefined { return this.data.extensionVersion; }
	get extensionPublisherId(): string { return this.data.extensionPublisherId; }
	get extensionPublisherDisplayName() { return this.data.publisherDisplayName; }
	get extensionDisplayName(): string { return this.data.extensionDisplayName; }
	get isDefault(): boolean | undefined { return this.data.isDefault; }
	get isCore(): boolean | undefined { return this.data.isCore; }
	get metadata(): IChatAgentMetadata { return this.data.metadata; }
	get slashCommands(): IChatAgentCommand[] { return this.data.slashCommands; }
	get locations(): ChatAgentLocation[] { return this.data.locations; }
	get modes(): ChatModeKind[] { return this.data.modes; }
	get disambiguation(): { category: string; description: string; examples: string[] }[] { return this.data.disambiguation; }

	async invoke(request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> {
		return this.impl.invoke(request, progress, history, token);
	}

	setRequestTools(requestId: string, tools: UserSelectedTools): void {
		this.impl.setRequestTools?.(requestId, tools);
	}

	async provideFollowups(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
		if (this.impl.provideFollowups) {
			return this.impl.provideFollowups(request, result, history, token);
		}

		return [];
	}

	toJSON(): IChatAgentData {
		return this.data;
	}
}

export const IChatAgentNameService = createDecorator<IChatAgentNameService>('chatAgentNameService');

type IChatParticipantRegistry = { [name: string]: string[] };

interface IChatParticipantRegistryResponse {
	readonly version: number;
	readonly restrictedChatParticipants: IChatParticipantRegistry;
}

export interface IChatAgentNameService {
	_serviceBrand: undefined;
	getAgentNameRestriction(chatAgentData: IChatAgentData): boolean;
}

export class ChatAgentNameService implements IChatAgentNameService {

	private static readonly StorageKey = 'chat.participantNameRegistry';

	declare _serviceBrand: undefined;

	private readonly url!: string;
	private registry = observableValue<IChatParticipantRegistry>(this, Object.create(null));
	private disposed = false;

	constructor(
		@IProductService productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService
	) {
		if (!productService.chatParticipantRegistry) {
			return;
		}

		this.url = productService.chatParticipantRegistry;

		const raw = storageService.get(ChatAgentNameService.StorageKey, StorageScope.APPLICATION);

		try {
			this.registry.set(JSON.parse(raw ?? '{}'), undefined);
		} catch (err) {
			storageService.remove(ChatAgentNameService.StorageKey, StorageScope.APPLICATION);
		}

		this.refresh();
	}

	private refresh(): void {
		if (this.disposed) {
			return;
		}

		this.update()
			.catch(err => this.logService.warn('Failed to fetch chat participant registry', err))
			.then(() => timeout(5 * 60 * 1000)) // every 5 minutes
			.then(() => this.refresh());
	}

	private async update(): Promise<void> {
		const context = await this.requestService.request({ type: 'GET', url: this.url }, CancellationToken.None);

		if (context.res.statusCode !== 200) {
			throw new Error('Could not get extensions report.');
		}

		const result = await asJson<IChatParticipantRegistryResponse>(context);

		if (!result || result.version !== 1) {
			throw new Error('Unexpected chat participant registry response.');
		}

		const registry = result.restrictedChatParticipants;
		this.registry.set(registry, undefined);
		this.storageService.store(ChatAgentNameService.StorageKey, JSON.stringify(registry), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	/**
	 * Returns true if the agent is allowed to use this name
	 */
	getAgentNameRestriction(chatAgentData: IChatAgentData): boolean {
		if (chatAgentData.isCore) {
			return true; // core agents are always allowed to use any name
		}

		// TODO would like to use observables here but nothing uses it downstream and I'm not sure how to combine these two
		const nameAllowed = this.checkAgentNameRestriction(chatAgentData.name, chatAgentData).get();
		const fullNameAllowed = !chatAgentData.fullName || this.checkAgentNameRestriction(chatAgentData.fullName.replace(/\s/g, ''), chatAgentData).get();
		return nameAllowed && fullNameAllowed;
	}

	private checkAgentNameRestriction(name: string, chatAgentData: IChatAgentData): IObservable<boolean> {
		// Registry is a map of name to an array of extension publisher IDs or extension IDs that are allowed to use it.
		// Look up the list of extensions that are allowed to use this name
		const allowList = this.registry.map<string[] | undefined>(registry => registry[name.toLowerCase()]);
		return allowList.map(allowList => {
			if (!allowList) {
				return true;
			}

			return allowList.some(id => equalsIgnoreCase(id, id.includes('.') ? chatAgentData.extensionId.value : chatAgentData.extensionPublisherId));
		});
	}

	dispose() {
		this.disposed = true;
	}
}

export function getFullyQualifiedId(chatAgentData: IChatAgentData): string {
	return `${chatAgentData.extensionId.value}.${chatAgentData.id}`;
}

/**
 * There was a period where serialized chat agent data used 'id' instead of 'name'.
 * Don't copy this pattern, serialized data going forward should be versioned with strict interfaces.
 */
interface IOldSerializedChatAgentData extends Omit<ISerializableChatAgentData, 'name'> {
	id: string;
	extensionPublisher?: string;
}

export function reviveSerializedAgent(raw: ISerializableChatAgentData | IOldSerializedChatAgentData): IChatAgentData {
	const normalized: ISerializableChatAgentData = 'name' in raw ?
		raw :
		{
			...raw,
			name: raw.id,
		};

	// Fill in required fields that may be missing from old data
	if (!normalized.extensionPublisherId) {
		normalized.extensionPublisherId = (raw as IOldSerializedChatAgentData).extensionPublisher ?? '';
	}

	if (!normalized.extensionDisplayName) {
		normalized.extensionDisplayName = '';
	}

	if (!normalized.extensionId) {
		normalized.extensionId = new ExtensionIdentifier('');
	}

	return revive(normalized);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatCodeMapperService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatCodeMapperService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';

export interface ICodeMapperResponse {
	textEdit: (resource: URI, textEdit: TextEdit[]) => void;
	notebookEdit: (resource: URI, edit: ICellEditOperation[]) => void;
}

export interface ICodeMapperCodeBlock {
	readonly code: string;
	readonly resource: URI;
	readonly markdownBeforeBlock?: string;
}

export interface ICodeMapperRequest {
	readonly codeBlocks: ICodeMapperCodeBlock[];
	readonly chatRequestId?: string;
	readonly chatRequestModel?: string;
	readonly chatSessionResource?: URI;
	readonly location?: string;
}

export interface ICodeMapperResult {
	readonly errorMessage?: string;
}

export interface ICodeMapperProvider {
	readonly displayName: string;
	mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken): Promise<ICodeMapperResult | undefined>;
}

export const ICodeMapperService = createDecorator<ICodeMapperService>('codeMapperService');

export interface ICodeMapperService {
	readonly _serviceBrand: undefined;
	readonly providers: ICodeMapperProvider[];
	registerCodeMapperProvider(handle: number, provider: ICodeMapperProvider): IDisposable;
	mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken): Promise<ICodeMapperResult | undefined>;
}

export class CodeMapperService implements ICodeMapperService {
	_serviceBrand: undefined;

	public readonly providers: ICodeMapperProvider[] = [];

	registerCodeMapperProvider(handle: number, provider: ICodeMapperProvider): IDisposable {
		this.providers.push(provider);
		return {
			dispose: () => {
				const index = this.providers.indexOf(provider);
				if (index >= 0) {
					this.providers.splice(index, 1);
				}
			}
		};
	}

	async mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken) {
		for (const provider of this.providers) {
			const result = await provider.mapCode(request, response, token);
			if (token.isCancellationRequested) {
				return undefined;
			}
			return result;
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatColors.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color, RGBA } from '../../../../base/common/color.js';
import { localize } from '../../../../nls.js';
import { badgeBackground, badgeForeground, contrastBorder, editorBackground, editorSelectionBackground, editorWidgetBackground, foreground, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';

export const chatRequestBorder = registerColor(
	'chat.requestBorder',
	{ dark: new Color(new RGBA(255, 255, 255, 0.10)), light: new Color(new RGBA(0, 0, 0, 0.10)), hcDark: contrastBorder, hcLight: contrastBorder, },
	localize('chat.requestBorder', 'The border color of a chat request.')
);

export const chatRequestBackground = registerColor(
	'chat.requestBackground',
	{ dark: transparent(editorBackground, 0.62), light: transparent(editorBackground, 0.62), hcDark: editorWidgetBackground, hcLight: null },
	localize('chat.requestBackground', 'The background color of a chat request.')
);

export const chatSlashCommandBackground = registerColor(
	'chat.slashCommandBackground',
	{ dark: '#26477866', light: '#adceff7a', hcDark: Color.white, hcLight: badgeBackground },
	localize('chat.slashCommandBackground', 'The background color of a chat slash command.')
);

export const chatSlashCommandForeground = registerColor(
	'chat.slashCommandForeground',
	{ dark: '#85b6ff', light: '#26569e', hcDark: Color.black, hcLight: badgeForeground },
	localize('chat.slashCommandForeground', 'The foreground color of a chat slash command.')
);

export const chatAvatarBackground = registerColor(
	'chat.avatarBackground',
	{ dark: '#1f1f1f', light: '#f2f2f2', hcDark: Color.black, hcLight: Color.white, },
	localize('chat.avatarBackground', 'The background color of a chat avatar.')
);

export const chatAvatarForeground = registerColor(
	'chat.avatarForeground',
	foreground,
	localize('chat.avatarForeground', 'The foreground color of a chat avatar.')
);

export const chatEditedFileForeground = registerColor(
	'chat.editedFileForeground',
	{
		light: '#895503',
		dark: '#E2C08D',
		hcDark: '#E2C08D',
		hcLight: '#895503'
	},
	localize('chat.editedFileForeground', 'The foreground color of a chat edited file in the edited file list.')
);

export const chatRequestCodeBorder = registerColor('chat.requestCodeBorder', { dark: '#004972B8', light: '#0e639c40', hcDark: null, hcLight: null }, localize('chat.requestCodeBorder', 'Border color of code blocks within the chat request bubble.'), true);

export const chatRequestBubbleBackground = registerColor('chat.requestBubbleBackground', { light: transparent(editorSelectionBackground, 0.3), dark: transparent(editorSelectionBackground, 0.3), hcDark: null, hcLight: null }, localize('chat.requestBubbleBackground', "Background color of the chat request bubble."), true);

export const chatRequestBubbleHoverBackground = registerColor('chat.requestBubbleHoverBackground', { dark: transparent(editorSelectionBackground, 0.6), light: transparent(editorSelectionBackground, 0.6), hcDark: null, hcLight: null }, localize('chat.requestBubbleHoverBackground', 'Background color of the chat request bubble on hover.'), true);

export const chatCheckpointSeparator = registerColor('chat.checkpointSeparator',
	{ dark: '#585858', light: '#a9a9a9', hcDark: '#a9a9a9', hcLight: '#a5a5a5' },
	localize('chatCheckpointSeparator', "Chat checkpoint separator color."));

export const chatLinesAddedForeground = registerColor(
	'chat.linesAddedForeground',
	{ dark: '#54B054', light: '#107C10', hcDark: '#54B054', hcLight: '#107C10' },
	localize('chat.linesAddedForeground', 'Foreground color of lines added in chat code block pill.'), true);

export const chatLinesRemovedForeground = registerColor(
	'chat.linesRemovedForeground',
	{ dark: '#FC6A6A', light: '#BC2F32', hcDark: '#F48771', hcLight: '#B5200D' },
	localize('chat.linesRemovedForeground', 'Foreground color of lines removed in chat code block pill.'), true);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';

export interface IChatContextItem {
	icon: ThemeIcon;
	label: string;
	modelDescription?: string;
	handle: number;
	value?: string;
}

export interface IChatContextSupport {
	supportsResource: boolean;
	supportsResolve: boolean;
}

export interface IChatContextProvider {
	provideChatContext(options: {}, token: CancellationToken): Promise<IChatContextItem[]>;
	provideChatContextForResource?(resource: URI, withValue: boolean, token: CancellationToken): Promise<IChatContextItem | undefined>;
	resolveChatContext?(context: IChatContextItem, token: CancellationToken): Promise<IChatContextItem>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { RemoteNameContext } from '../../../common/contextkeys.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { ChatEntitlementContextKeys } from '../../../services/chat/common/chatEntitlementService.js';
import { ChatAgentLocation, ChatModeKind } from './constants.js';

export namespace ChatContextKeys {
	export const responseVote = new RawContextKey<string>('chatSessionResponseVote', '', { type: 'string', description: localize('interactiveSessionResponseVote', "When the response has been voted up, is set to 'up'. When voted down, is set to 'down'. Otherwise an empty string.") });
	export const responseDetectedAgentCommand = new RawContextKey<boolean>('chatSessionResponseDetectedAgentOrCommand', false, { type: 'boolean', description: localize('chatSessionResponseDetectedAgentOrCommand', "When the agent or command was automatically detected") });
	export const responseSupportsIssueReporting = new RawContextKey<boolean>('chatResponseSupportsIssueReporting', false, { type: 'boolean', description: localize('chatResponseSupportsIssueReporting', "True when the current chat response supports issue reporting.") });
	export const responseIsFiltered = new RawContextKey<boolean>('chatSessionResponseFiltered', false, { type: 'boolean', description: localize('chatResponseFiltered', "True when the chat response was filtered out by the server.") });
	export const responseHasError = new RawContextKey<boolean>('chatSessionResponseError', false, { type: 'boolean', description: localize('chatResponseErrored', "True when the chat response resulted in an error.") });
	export const requestInProgress = new RawContextKey<boolean>('chatSessionRequestInProgress', false, { type: 'boolean', description: localize('interactiveSessionRequestInProgress', "True when the current request is still in progress.") });
	export const currentlyEditing = new RawContextKey<boolean>('chatSessionCurrentlyEditing', false, { type: 'boolean', description: localize('interactiveSessionCurrentlyEditing', "True when the current request is being edited.") });
	export const currentlyEditingInput = new RawContextKey<boolean>('chatSessionCurrentlyEditingInput', false, { type: 'boolean', description: localize('interactiveSessionCurrentlyEditingInput', "True when the current request input at the bottom is being edited.") });

	export const isResponse = new RawContextKey<boolean>('chatResponse', false, { type: 'boolean', description: localize('chatResponse', "The chat item is a response.") });
	export const isRequest = new RawContextKey<boolean>('chatRequest', false, { type: 'boolean', description: localize('chatRequest', "The chat item is a request") });
	export const itemId = new RawContextKey<string>('chatItemId', '', { type: 'string', description: localize('chatItemId', "The id of the chat item.") });
	export const lastItemId = new RawContextKey<string[]>('chatLastItemId', [], { type: 'string', description: localize('chatLastItemId', "The id of the last chat item.") });

	export const editApplied = new RawContextKey<boolean>('chatEditApplied', false, { type: 'boolean', description: localize('chatEditApplied', "True when the chat text edits have been applied.") });

	export const inputHasText = new RawContextKey<boolean>('chatInputHasText', false, { type: 'boolean', description: localize('interactiveInputHasText', "True when the chat input has text.") });
	export const inputHasFocus = new RawContextKey<boolean>('chatInputHasFocus', false, { type: 'boolean', description: localize('interactiveInputHasFocus', "True when the chat input has focus.") });
	export const inChatInput = new RawContextKey<boolean>('inChatInput', false, { type: 'boolean', description: localize('inInteractiveInput', "True when focus is in the chat input, false otherwise.") });
	export const inChatSession = new RawContextKey<boolean>('inChat', false, { type: 'boolean', description: localize('inChat', "True when focus is in the chat widget, false otherwise.") });
	export const inChatEditor = new RawContextKey<boolean>('inChatEditor', false, { type: 'boolean', description: localize('inChatEditor', "Whether focus is in a chat editor.") });
	export const inChatTerminalToolOutput = new RawContextKey<boolean>('inChatTerminalToolOutput', false, { type: 'boolean', description: localize('inChatTerminalToolOutput', "True when focus is in the chat terminal output region.") });
	export const chatModeKind = new RawContextKey<ChatModeKind>('chatAgentKind', ChatModeKind.Ask, { type: 'string', description: localize('agentKind', "The 'kind' of the current agent.") });
	export const chatToolCount = new RawContextKey<number>('chatToolCount', 0, { type: 'number', description: localize('chatToolCount', "The number of tools available in the current agent.") });
	export const chatToolGroupingThreshold = new RawContextKey<number>('chat.toolGroupingThreshold', 0, { type: 'number', description: localize('chatToolGroupingThreshold', "The number of tools at which we start doing virtual grouping.") });

	export const supported = ContextKeyExpr.or(IsWebContext.negate(), RemoteNameContext.notEqualsTo(''), ContextKeyExpr.has('config.chat.experimental.serverlessWebEnabled'));
	export const enabled = new RawContextKey<boolean>('chatIsEnabled', false, { type: 'boolean', description: localize('chatIsEnabled', "True when chat is enabled because a default chat participant is activated with an implementation.") });

	/**
	 * True when the chat widget is locked to the coding agent session.
	 */
	export const lockedToCodingAgent = new RawContextKey<boolean>('lockedToCodingAgent', false, { type: 'boolean', description: localize('lockedToCodingAgent', "True when the chat widget is locked to the coding agent session.") });
	export const agentSupportsAttachments = new RawContextKey<boolean>('agentSupportsAttachments', false, { type: 'boolean', description: localize('agentSupportsAttachments', "True when the chat agent supports attachments.") });
	export const withinEditSessionDiff = new RawContextKey<boolean>('withinEditSessionDiff', false, { type: 'boolean', description: localize('withinEditSessionDiff', "True when the chat widget dispatches to the edit session chat.") });
	export const filePartOfEditSession = new RawContextKey<boolean>('filePartOfEditSession', false, { type: 'boolean', description: localize('filePartOfEditSession', "True when the chat widget is within a file with an edit session.") });

	export const extensionParticipantRegistered = new RawContextKey<boolean>('chatPanelExtensionParticipantRegistered', false, { type: 'boolean', description: localize('chatPanelExtensionParticipantRegistered', "True when a default chat participant is registered for the panel from an extension.") });
	export const panelParticipantRegistered = new RawContextKey<boolean>('chatPanelParticipantRegistered', false, { type: 'boolean', description: localize('chatParticipantRegistered', "True when a default chat participant is registered for the panel.") });
	export const chatEditingCanUndo = new RawContextKey<boolean>('chatEditingCanUndo', false, { type: 'boolean', description: localize('chatEditingCanUndo', "True when it is possible to undo an interaction in the editing panel.") });
	export const chatEditingCanRedo = new RawContextKey<boolean>('chatEditingCanRedo', false, { type: 'boolean', description: localize('chatEditingCanRedo', "True when it is possible to redo an interaction in the editing panel.") });
	export const languageModelsAreUserSelectable = new RawContextKey<boolean>('chatModelsAreUserSelectable', false, { type: 'boolean', description: localize('chatModelsAreUserSelectable', "True when the chat model can be selected manually by the user.") });
	export const chatSessionHasModels = new RawContextKey<boolean>('chatSessionHasModels', false, { type: 'boolean', description: localize('chatSessionHasModels', "True when the chat is in a contributed chat session that has available 'models' to display.") });
	export const extensionInvalid = new RawContextKey<boolean>('chatExtensionInvalid', false, { type: 'boolean', description: localize('chatExtensionInvalid', "True when the installed chat extension is invalid and needs to be updated.") });
	export const inputCursorAtTop = new RawContextKey<boolean>('chatCursorAtTop', false);
	export const inputHasAgent = new RawContextKey<boolean>('chatInputHasAgent', false);
	export const location = new RawContextKey<ChatAgentLocation>('chatLocation', undefined);
	export const inQuickChat = new RawContextKey<boolean>('quickChatHasFocus', false, { type: 'boolean', description: localize('inQuickChat', "True when the quick chat UI has focus, false otherwise.") });
	export const hasFileAttachments = new RawContextKey<boolean>('chatHasFileAttachments', false, { type: 'boolean', description: localize('chatHasFileAttachments', "True when the chat has file attachments.") });
	export const chatSessionIsEmpty = new RawContextKey<boolean>('chatSessionIsEmpty', true, { type: 'boolean', description: localize('chatSessionIsEmpty', "True when the current chat session has no requests.") });

	export const remoteJobCreating = new RawContextKey<boolean>('chatRemoteJobCreating', false, { type: 'boolean', description: localize('chatRemoteJobCreating', "True when a remote coding agent job is being created.") });
	export const hasRemoteCodingAgent = new RawContextKey<boolean>('hasRemoteCodingAgent', false, localize('hasRemoteCodingAgent', "Whether any remote coding agent is available"));
	export const hasCanDelegateProviders = new RawContextKey<boolean>('chatHasCanDelegateProviders', false, { type: 'boolean', description: localize('chatHasCanDelegateProviders', "True when there are chat session providers with delegation support available.") });
	export const enableRemoteCodingAgentPromptFileOverlay = new RawContextKey<boolean>('enableRemoteCodingAgentPromptFileOverlay', false, localize('enableRemoteCodingAgentPromptFileOverlay', "Whether the remote coding agent prompt file overlay feature is enabled"));
	/** Used by the extension to skip the quit confirmation when #new wants to open a new folder */
	export const skipChatRequestInProgressMessage = new RawContextKey<boolean>('chatSkipRequestInProgressMessage', false, { type: 'boolean', description: localize('chatSkipRequestInProgressMessage', "True when the chat request in progress message should be skipped.") });

	// Re-exported from chat entitlement service
	export const Setup = ChatEntitlementContextKeys.Setup;
	export const Entitlement = ChatEntitlementContextKeys.Entitlement;
	export const chatQuotaExceeded = ChatEntitlementContextKeys.chatQuotaExceeded;
	export const completionsQuotaExceeded = ChatEntitlementContextKeys.completionsQuotaExceeded;

	export const Editing = {
		hasToolConfirmation: new RawContextKey<boolean>('chatHasToolConfirmation', false, { type: 'boolean', description: localize('chatEditingHasToolConfirmation', "True when a tool confirmation is present.") }),
		hasElicitationRequest: new RawContextKey<boolean>('chatHasElicitationRequest', false, { type: 'boolean', description: localize('chatEditingHasElicitationRequest', "True when a chat elicitation request is pending.") }),
	};

	export const Tools = {
		toolsCount: new RawContextKey<number>('toolsCount', 0, { type: 'number', description: localize('toolsCount', "The count of tools available in the chat.") })
	};

	export const Modes = {
		hasCustomChatModes: new RawContextKey<boolean>('chatHasCustomAgents', false, { type: 'boolean', description: localize('chatHasAgents', "True when the chat has custom agents available.") }),
		agentModeDisabledByPolicy: new RawContextKey<boolean>('chatAgentModeDisabledByPolicy', false, { type: 'boolean', description: localize('chatAgentModeDisabledByPolicy', "True when agent mode is disabled by organization policy.") }),
	};

	export const panelLocation = new RawContextKey<ViewContainerLocation>('chatPanelLocation', undefined, { type: 'number', description: localize('chatPanelLocation', "The location of the chat panel.") });

	export const agentSessionsViewerFocused = new RawContextKey<boolean>('agentSessionsViewerFocused', true, { type: 'boolean', description: localize('agentSessionsViewerFocused', "If the agent sessions view in the chat view is focused.") });
	export const agentSessionsViewerLimited = new RawContextKey<boolean>('agentSessionsViewerLimited', undefined, { type: 'boolean', description: localize('agentSessionsViewerLimited', "If the agent sessions view in the chat view is limited to show recent sessions only.") });
	export const agentSessionsViewerOrientation = new RawContextKey<number>('agentSessionsViewerOrientation', undefined, { type: 'number', description: localize('agentSessionsViewerOrientation', "Orientation of the agent sessions view in the chat view.") });
	export const agentSessionsViewerPosition = new RawContextKey<number>('agentSessionsViewerPosition', undefined, { type: 'number', description: localize('agentSessionsViewerPosition', "Position of the agent sessions view in the chat view.") });
	export const agentSessionsViewerVisible = new RawContextKey<boolean>('agentSessionsViewerVisible', undefined, { type: 'boolean', description: localize('agentSessionsViewerVisible', "Visibility of the agent sessions view in the chat view.") });
	export const agentSessionType = new RawContextKey<string>('chatSessionType', '', { type: 'string', description: localize('agentSessionType', "The type of the current agent session item.") });
	export const agentSessionSection = new RawContextKey<string>('agentSessionSection', '', { type: 'string', description: localize('agentSessionSection', "The section of the current agent session section item.") });
	export const isArchivedAgentSession = new RawContextKey<boolean>('agentSessionIsArchived', false, { type: 'boolean', description: localize('agentSessionIsArchived', "True when the agent session item is archived.") });
	export const isReadAgentSession = new RawContextKey<boolean>('agentSessionIsRead', false, { type: 'boolean', description: localize('agentSessionIsRead', "True when the agent session item is read.") });
	export const hasAgentSessionChanges = new RawContextKey<boolean>('agentSessionHasChanges', false, { type: 'boolean', description: localize('agentSessionHasChanges', "True when the current agent session item has changes.") });

	export const isKatexMathElement = new RawContextKey<boolean>('chatIsKatexMathElement', false, { type: 'boolean', description: localize('chatIsKatexMathElement', "True when focusing a KaTeX math element.") });
}

export namespace ChatContextKeyExprs {
	export const inEditingMode = ContextKeyExpr.or(
		ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Edit),
		ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Agent),
	);

	/**
	 * Context expression that indicates when the welcome/setup view should be shown
	 */
	export const chatSetupTriggerContext = ContextKeyExpr.or(
		ChatContextKeys.Setup.installed.negate(),
		ChatContextKeys.Entitlement.canSignUp
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatEditingService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeHex, encodeHex, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { autorunSelfDisposable, IObservable, IReader } from '../../../../base/common/observable.js';
import { hasKey } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IDocumentDiff } from '../../../../editor/common/diff/documentDiffProvider.js';
import { Location, TextEdit } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { EditSuggestionId } from '../../../../editor/common/textModelEditSource.js';
import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorPane } from '../../../common/editor.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';
import { IChatAgentResult } from './chatAgents.js';
import { ChatModel, IChatRequestDisablement, IChatResponseModel } from './chatModel.js';
import { IChatMultiDiffData, IChatProgress } from './chatService.js';

export const IChatEditingService = createDecorator<IChatEditingService>('chatEditingService');

export interface IChatEditingService {

	_serviceBrand: undefined;

	startOrContinueGlobalEditingSession(chatModel: ChatModel): IChatEditingSession;

	getEditingSession(chatSessionResource: URI): IChatEditingSession | undefined;

	/**
	 * All editing sessions, sorted by recency, e.g the last created session comes first.
	 */
	readonly editingSessionsObs: IObservable<readonly IChatEditingSession[]>;

	/**
	 * Creates a new short lived editing session
	 */
	createEditingSession(chatModel: ChatModel): IChatEditingSession;

	/**
	 * Creates an editing session with state transferred from the provided session.
	 */
	transferEditingSession(chatModel: ChatModel, session: IChatEditingSession): IChatEditingSession;

	//#region related files

	hasRelatedFilesProviders(): boolean;
	registerRelatedFilesProvider(handle: number, provider: IChatRelatedFilesProvider): IDisposable;
	getRelatedFiles(chatSessionResource: URI, prompt: string, files: URI[], token: CancellationToken): Promise<{ group: string; files: IChatRelatedFile[] }[] | undefined>;

	//#endregion
}

export interface IChatRequestDraft {
	readonly prompt: string;
	readonly files: readonly URI[];
}

export interface IChatRelatedFileProviderMetadata {
	readonly description: string;
}

export interface IChatRelatedFile {
	readonly uri: URI;
	readonly description: string;
}

export interface IChatRelatedFilesProvider {
	readonly description: string;
	provideRelatedFiles(chatRequest: IChatRequestDraft, token: CancellationToken): Promise<IChatRelatedFile[] | undefined>;
}

export interface WorkingSetDisplayMetadata {
	state: ModifiedFileEntryState;
	description?: string;
}

export interface IStreamingEdits {
	pushText(edits: TextEdit[], isLastEdits: boolean): void;
	pushNotebookCellText(cell: URI, edits: TextEdit[], isLastEdits: boolean): void;
	pushNotebook(edits: ICellEditOperation[], isLastEdits: boolean): void;
	/** Marks edits as done, idempotent */
	complete(): void;
}

export interface IModifiedEntryTelemetryInfo {
	readonly agentId: string | undefined;
	readonly command: string | undefined;
	readonly sessionResource: URI;
	readonly requestId: string;
	readonly result: IChatAgentResult | undefined;
	readonly modelId: string | undefined;
	readonly modeId: 'ask' | 'edit' | 'agent' | 'custom' | 'applyCodeBlock' | undefined;
	readonly applyCodeBlockSuggestionId: EditSuggestionId | undefined;
	readonly feature: 'sideBarChat' | 'inlineChat' | undefined;
}

export interface ISnapshotEntry {
	readonly resource: URI;
	readonly languageId: string;
	readonly snapshotUri: URI;
	readonly original: string;
	readonly current: string;
	readonly state: ModifiedFileEntryState;
	telemetryInfo: IModifiedEntryTelemetryInfo;
}

export interface IChatEditingSession extends IDisposable {
	readonly isGlobalEditingSession: boolean;
	readonly chatSessionResource: URI;
	readonly onDidDispose: Event<void>;
	readonly state: IObservable<ChatEditingSessionState>;
	readonly entries: IObservable<readonly IModifiedFileEntry[]>;
	/** Requests disabled by undo/redo in the session */
	readonly requestDisablement: IObservable<IChatRequestDisablement[]>;

	show(previousChanges?: boolean): Promise<void>;
	accept(...uris: URI[]): Promise<void>;
	reject(...uris: URI[]): Promise<void>;
	getEntry(uri: URI): IModifiedFileEntry | undefined;
	readEntry(uri: URI, reader: IReader): IModifiedFileEntry | undefined;

	restoreSnapshot(requestId: string, stopId: string | undefined): Promise<void>;

	/**
	 * Marks all edits to the given resources as agent edits until
	 * {@link stopExternalEdits} is called with the same ID. This is used for
	 * agents that make changes on-disk rather than streaming edits through the
	 * chat session.
	 */
	startExternalEdits(responseModel: IChatResponseModel, operationId: number, resources: URI[], undoStopId: string): Promise<IChatProgress[]>;
	stopExternalEdits(responseModel: IChatResponseModel, operationId: number): Promise<IChatProgress[]>;

	/**
	 * Gets the snapshot URI of a file at the request and _after_ changes made in the undo stop.
	 * @param uri File in the workspace
	 */
	getSnapshotUri(requestId: string, uri: URI, stopId: string | undefined): URI | undefined;

	getSnapshotContents(requestId: string, uri: URI, stopId: string | undefined): Promise<VSBuffer | undefined>;
	getSnapshotModel(requestId: string, undoStop: string | undefined, snapshotUri: URI): Promise<ITextModel | null>;

	/**
	 * Will lead to this object getting disposed
	 */
	stop(clearState?: boolean): Promise<void>;

	/**
	 * Starts making edits to the resource.
	 * @param resource URI that's being edited
	 * @param responseModel The response model making the edits
	 * @param inUndoStop The undo stop the edits will be grouped in
	 */
	startStreamingEdits(resource: URI, responseModel: IChatResponseModel, inUndoStop: string | undefined): IStreamingEdits;

	/**
	 * Gets the document diff of a change made to a URI between one undo stop and
	 * the next one.
	 * @returns The observable or undefined if there is no diff between the stops.
	 */
	getEntryDiffBetweenStops(uri: URI, requestId: string | undefined, stopId: string | undefined): IObservable<IEditSessionEntryDiff | undefined> | undefined;

	/**
	 * Gets the document diff of a change made to a URI between one request to another one.
	 * @returns The observable or undefined if there is no diff between the requests.
	 */
	getEntryDiffBetweenRequests(uri: URI, startRequestIs: string, stopRequestId: string): IObservable<IEditSessionEntryDiff | undefined>;

	/**
	 * Gets the diff of each file modified in this session, comparing the initial
	 * baseline to the current state.
	 */
	getDiffsForFilesInSession(): IObservable<readonly IEditSessionEntryDiff[]>;

	/**
	 * Gets the diff of each file modified in the request.
	 */
	getDiffsForFilesInRequest(requestId: string): IObservable<readonly IEditSessionEntryDiff[]>;

	/**
	 * Whether there are any edits made in the given request.
	 */
	hasEditsInRequest(requestId: string, reader?: IReader): boolean;

	/**
	 * Gets the aggregated diff stats for all files modified in this session.
	 */
	getDiffForSession(): IObservable<IEditSessionDiffStats>;

	readonly canUndo: IObservable<boolean>;
	readonly canRedo: IObservable<boolean>;
	undoInteraction(): Promise<void>;
	redoInteraction(): Promise<void>;
}

export function chatEditingSessionIsReady(session: IChatEditingSession): Promise<void> {
	return new Promise<void>(resolve => {
		autorunSelfDisposable(reader => {
			const state = session.state.read(reader);
			if (state !== ChatEditingSessionState.Initial) {
				reader.dispose();
				resolve();
			}
		});
	});
}

export function editEntriesToMultiDiffData(entriesObs: IObservable<readonly IEditSessionEntryDiff[]>): IChatMultiDiffData {
	return {
		kind: 'multiDiffData',
		collapsed: true,
		multiDiffData: entriesObs.map(entries => ({
			title: localize('chatMultidiff.autoGenerated', 'Changes to {0} files', entries.length),
			resources: entries.map(entry => ({
				originalUri: entry.originalURI,
				modifiedUri: entry.modifiedURI,
				goToFileUri: entry.modifiedURI,
				added: entry.added,
				removed: entry.removed,
			}))
		})),
	};
}

export function awaitCompleteChatEditingDiff(diff: IObservable<IEditSessionEntryDiff>, token?: CancellationToken): Promise<IEditSessionEntryDiff>;
export function awaitCompleteChatEditingDiff(diff: IObservable<readonly IEditSessionEntryDiff[]>, token?: CancellationToken): Promise<readonly IEditSessionEntryDiff[]>;
export function awaitCompleteChatEditingDiff(diff: IObservable<readonly IEditSessionEntryDiff[] | IEditSessionEntryDiff>, token?: CancellationToken): Promise<readonly IEditSessionEntryDiff[] | IEditSessionEntryDiff> {
	return new Promise<readonly IEditSessionEntryDiff[] | IEditSessionEntryDiff>((resolve, reject) => {
		autorunSelfDisposable(reader => {
			if (token) {
				if (token.isCancellationRequested) {
					reader.dispose();
					return reject(new CancellationError());
				}
				reader.store.add(token.onCancellationRequested(() => {
					reader.dispose();
					reject(new CancellationError());
				}));
			}

			const current = diff.read(reader);
			if (current instanceof Array) {
				if (!current.some(c => c.isBusy)) {
					reader.dispose();
					resolve(current);
				}
			} else if (!current.isBusy) {
				reader.dispose();
				resolve(current);
			}
		});
	});
}

export interface IEditSessionDiffStats {
	/** Added data (e.g. line numbers) to show in the UI */
	added: number;
	/** Removed data (e.g. line numbers) to show in the UI */
	removed: number;
}

export interface IEditSessionEntryDiff extends IEditSessionDiffStats {
	/** LHS and RHS of a diff editor, if opened: */
	originalURI: URI;
	modifiedURI: URI;

	/** Diff state information: */
	quitEarly: boolean;
	identical: boolean;

	/** True if nothing else will be added to this diff. */
	isFinal: boolean;

	/** True if the diff is currently being computed or updated. */
	isBusy: boolean;
}

export function emptySessionEntryDiff(originalURI: URI, modifiedURI: URI): IEditSessionEntryDiff {
	return {
		originalURI,
		modifiedURI,
		added: 0,
		removed: 0,
		quitEarly: false,
		identical: false,
		isFinal: false,
		isBusy: false,
	};
}

export const enum ModifiedFileEntryState {
	Modified,
	Accepted,
	Rejected,
}

/**
 * Represents a part of a change
 */
export interface IModifiedFileEntryChangeHunk {
	accept(): Promise<boolean>;
	reject(): Promise<boolean>;
}

export interface IModifiedFileEntryEditorIntegration extends IDisposable {

	/**
	 * The index of a change
	 */
	currentIndex: IObservable<number>;

	/**
	 * Reveal the first (`true`) or last (`false`) change
	 */
	reveal(firstOrLast: boolean, preserveFocus?: boolean): void;

	/**
	 * Go to next change and increate `currentIndex`
	 * @param wrap When at the last, start over again or not
	 * @returns If it went next
	 */
	next(wrap: boolean): boolean;

	/**
	 * @see `next`
	 */
	previous(wrap: boolean): boolean;

	/**
	 * Enable the accessible diff viewer for this editor
	 */
	enableAccessibleDiffView(): void;

	/**
	 * Accept the change given or the nearest
	 * @param change An opaque change object
	 */
	acceptNearestChange(change?: IModifiedFileEntryChangeHunk): Promise<void>;

	/**
	 * @see `acceptNearestChange`
	 */
	rejectNearestChange(change?: IModifiedFileEntryChangeHunk): Promise<void>;

	/**
	 * Toggle between diff-editor and normal editor
	 * @param change An opaque change object
	 * @param show Optional boolean to control if the diff should show
	 */
	toggleDiff(change: IModifiedFileEntryChangeHunk | undefined, show?: boolean): Promise<void>;
}

export interface IModifiedFileEntry {
	readonly entryId: string;
	readonly originalURI: URI;
	readonly modifiedURI: URI;

	readonly lastModifyingRequestId: string;

	readonly state: IObservable<ModifiedFileEntryState>;
	readonly isCurrentlyBeingModifiedBy: IObservable<{ responseModel: IChatResponseModel; undoStopId: string | undefined } | undefined>;
	readonly lastModifyingResponse: IObservable<IChatResponseModel | undefined>;
	readonly rewriteRatio: IObservable<number>;

	readonly waitsForLastEdits: IObservable<boolean>;

	accept(): Promise<void>;
	reject(): Promise<void>;

	reviewMode: IObservable<boolean>;
	autoAcceptController: IObservable<{ total: number; remaining: number; cancel(): void } | undefined>;
	enableReviewModeUntilSettled(): void;

	/**
	 * Number of changes for this file
	 */
	readonly changesCount: IObservable<number>;

	/**
	 * Diff information for this entry
	 */
	readonly diffInfo?: IObservable<IDocumentDiff>;

	/**
	 * Number of lines added in this entry.
	 */
	readonly linesAdded?: IObservable<number>;

	/**
	 * Number of lines removed in this entry
	 */
	readonly linesRemoved?: IObservable<number>;

	getEditorIntegration(editor: IEditorPane): IModifiedFileEntryEditorIntegration;
	hasModificationAt(location: Location): boolean;
	/**
	 * Gets the document diff info, waiting for any ongoing promises to flush.
	 */
	getDiffInfo?(): Promise<IDocumentDiff>;
}

export interface IChatEditingSessionStream {
	textEdits(resource: URI, textEdits: TextEdit[], isLastEdits: boolean, responseModel: IChatResponseModel): void;
	notebookEdits(resource: URI, edits: ICellEditOperation[], isLastEdits: boolean, responseModel: IChatResponseModel): void;
}

export const enum ChatEditingSessionState {
	Initial = 0,
	StreamingEdits = 1,
	Idle = 2,
	Disposed = 3
}

export const CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME = 'chat-editing-multi-diff-source';

export const chatEditingWidgetFileStateContextKey = new RawContextKey<ModifiedFileEntryState>('chatEditingWidgetFileState', undefined, localize('chatEditingWidgetFileState', "The current state of the file in the chat editing widget"));
export const chatEditingAgentSupportsReadonlyReferencesContextKey = new RawContextKey<boolean>('chatEditingAgentSupportsReadonlyReferences', undefined, localize('chatEditingAgentSupportsReadonlyReferences', "Whether the chat editing agent supports readonly references (temporary)"));
export const decidedChatEditingResourceContextKey = new RawContextKey<string[]>('decidedChatEditingResource', []);
export const chatEditingResourceContextKey = new RawContextKey<string | undefined>('chatEditingResource', undefined);
export const inChatEditingSessionContextKey = new RawContextKey<boolean | undefined>('inChatEditingSession', undefined);
export const hasUndecidedChatEditingResourceContextKey = new RawContextKey<boolean | undefined>('hasUndecidedChatEditingResource', false);
export const hasAppliedChatEditsContextKey = new RawContextKey<boolean | undefined>('hasAppliedChatEdits', false);
export const applyingChatEditsFailedContextKey = new RawContextKey<boolean | undefined>('applyingChatEditsFailed', false);

export const chatEditingMaxFileAssignmentName = 'chatEditingSessionFileLimit';
export const defaultChatEditingMaxFileLimit = 10;

export const enum ChatEditKind {
	Created,
	Modified,
}

export interface IChatEditingActionContext {
	// The chat session that this editing session is associated with
	sessionResource: URI;
}

export function isChatEditingActionContext(thing: unknown): thing is IChatEditingActionContext {
	return typeof thing === 'object' && !!thing && hasKey(thing, { sessionResource: true });
}

export function getMultiDiffSourceUri(session: IChatEditingSession, showPreviousChanges?: boolean): URI {
	return URI.from({
		scheme: CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME,
		authority: encodeHex(VSBuffer.fromString(session.chatSessionResource.toString())),
		query: showPreviousChanges ? 'previous' : undefined,
	});
}

export function parseChatMultiDiffUri(uri: URI): { chatSessionResource: URI; showPreviousChanges: boolean } {
	const chatSessionResource = URI.parse(decodeHex(uri.authority).toString());
	const showPreviousChanges = uri.query === 'previous';

	return { chatSessionResource, showPreviousChanges };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatLayoutService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatLayoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable } from '../../../../base/common/observable.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IChatLayoutService = createDecorator<IChatLayoutService>('chatLayoutService');

export interface IChatLayoutService {
	readonly _serviceBrand: undefined;

	readonly fontFamily: IObservable<string | null>;
	readonly fontSize: IObservable<number>;
}
```

--------------------------------------------------------------------------------

````

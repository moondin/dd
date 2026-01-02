---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 397
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 397 of 552)

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

---[FILE: src/vs/workbench/contrib/files/browser/files.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/files.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { sep } from '../../../../base/common/path.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IFileEditorInput, IEditorFactoryRegistry, EditorExtensions } from '../../../common/editor.js';
import { AutoSaveConfiguration, HotExitConfiguration, FILES_EXCLUDE_CONFIG, FILES_ASSOCIATIONS_CONFIG, FILES_READONLY_INCLUDE_CONFIG, FILES_READONLY_EXCLUDE_CONFIG, FILES_READONLY_FROM_PERMISSIONS_CONFIG } from '../../../../platform/files/common/files.js';
import { SortOrder, LexicographicOptions, FILE_EDITOR_INPUT_ID, BINARY_TEXT_FILE_MODE, UndoConfirmLevel, IFilesConfiguration } from '../common/files.js';
import { TextFileEditorTracker } from './editors/textFileEditorTracker.js';
import { TextFileSaveErrorHandler } from './editors/textFileSaveErrorHandler.js';
import { FileEditorInput } from './editors/fileEditorInput.js';
import { BinaryFileEditor } from './editors/binaryFileEditor.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { isNative, isWeb, isWindows } from '../../../../base/common/platform.js';
import { ExplorerViewletViewsContribution } from './explorerViewlet.js';
import { IEditorPaneRegistry, EditorPaneDescriptor } from '../../../browser/editor.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ExplorerService, UNDO_REDO_SOURCE } from './explorerService.js';
import { GUESSABLE_ENCODINGS, SUPPORTED_ENCODINGS } from '../../../services/textfile/common/encoding.js';
import { Schemas } from '../../../../base/common/network.js';
import { WorkspaceWatcher } from './workspaceWatcher.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';
import { DirtyFilesIndicator } from '../common/dirtyFilesIndicator.js';
import { UndoCommand, RedoCommand } from '../../../../editor/browser/editorExtensions.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IExplorerService } from './files.js';
import { FileEditorInputSerializer, FileEditorWorkingCopyEditorHandler } from './editors/fileEditorHandler.js';
import { ModesRegistry } from '../../../../editor/common/languages/modesRegistry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TextFileEditor } from './editors/textFileEditor.js';

class FileUriLabelContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.fileUriLabel';

	constructor(@ILabelService labelService: ILabelService) {
		labelService.registerFormatter({
			scheme: Schemas.file,
			formatting: {
				label: '${authority}${path}',
				separator: sep,
				tildify: !isWindows,
				normalizeDriveLetter: isWindows,
				authorityPrefix: sep + sep,
				workspaceSuffix: ''
			}
		});
	}
}

registerSingleton(IExplorerService, ExplorerService, InstantiationType.Delayed);

// Register file editors

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		TextFileEditor,
		TextFileEditor.ID,
		nls.localize('textFileEditor', "Text File Editor")
	),
	[
		new SyncDescriptor(FileEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		BinaryFileEditor,
		BinaryFileEditor.ID,
		nls.localize('binaryFileEditor', "Binary File Editor")
	),
	[
		new SyncDescriptor(FileEditorInput)
	]
);

// Register default file input factory
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerFileEditorFactory({

	typeId: FILE_EDITOR_INPUT_ID,

	createFileEditor: (resource, preferredResource, preferredName, preferredDescription, preferredEncoding, preferredLanguageId, preferredContents, instantiationService): IFileEditorInput => {
		return instantiationService.createInstance(FileEditorInput, resource, preferredResource, preferredName, preferredDescription, preferredEncoding, preferredLanguageId, preferredContents);
	},

	isFileEditor: (obj): obj is IFileEditorInput => {
		return obj instanceof FileEditorInput;
	}
});

// Register Editor Input Serializer & Handler
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(FILE_EDITOR_INPUT_ID, FileEditorInputSerializer);
registerWorkbenchContribution2(FileEditorWorkingCopyEditorHandler.ID, FileEditorWorkingCopyEditorHandler, WorkbenchPhase.BlockRestore);

// Register Explorer views
registerWorkbenchContribution2(ExplorerViewletViewsContribution.ID, ExplorerViewletViewsContribution, WorkbenchPhase.BlockStartup);

// Register Text File Editor Tracker
registerWorkbenchContribution2(TextFileEditorTracker.ID, TextFileEditorTracker, WorkbenchPhase.BlockStartup);

// Register Text File Save Error Handler
registerWorkbenchContribution2(TextFileSaveErrorHandler.ID, TextFileSaveErrorHandler, WorkbenchPhase.BlockStartup);

// Register uri display for file uris
registerWorkbenchContribution2(FileUriLabelContribution.ID, FileUriLabelContribution, WorkbenchPhase.BlockStartup);

// Register Workspace Watcher
registerWorkbenchContribution2(WorkspaceWatcher.ID, WorkspaceWatcher, WorkbenchPhase.AfterRestored);

// Register Dirty Files Indicator
registerWorkbenchContribution2(DirtyFilesIndicator.ID, DirtyFilesIndicator, WorkbenchPhase.BlockStartup);

// Configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

const hotExitConfiguration: IConfigurationPropertySchema = isNative ?
	{
		'type': 'string',
		'scope': ConfigurationScope.APPLICATION,
		'enum': [HotExitConfiguration.OFF, HotExitConfiguration.ON_EXIT, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE],
		'default': HotExitConfiguration.ON_EXIT,
		'markdownEnumDescriptions': [
			nls.localize('hotExit.off', 'Disable hot exit. A prompt will show when attempting to close a window with editors that have unsaved changes.'),
			nls.localize('hotExit.onExit', 'Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu). All windows without folders opened will be restored upon next launch. A list of previously opened windows with unsaved files can be accessed via `File > Open Recent > More...`'),
			nls.localize('hotExit.onExitAndWindowClose', 'Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu), and also for any window with a folder opened regardless of whether it\'s the last window. All windows without folders opened will be restored upon next launch. A list of previously opened windows with unsaved files can be accessed via `File > Open Recent > More...`')
		],
		'markdownDescription': nls.localize('hotExit', "[Hot Exit](https://aka.ms/vscode-hot-exit) controls whether unsaved files are remembered between sessions, allowing the save prompt when exiting the editor to be skipped.", HotExitConfiguration.ON_EXIT, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE)
	} : {
		'type': 'string',
		'scope': ConfigurationScope.APPLICATION,
		'enum': [HotExitConfiguration.OFF, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE],
		'default': HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE,
		'markdownEnumDescriptions': [
			nls.localize('hotExit.off', 'Disable hot exit. A prompt will show when attempting to close a window with editors that have unsaved changes.'),
			nls.localize('hotExit.onExitAndWindowCloseBrowser', 'Hot exit will be triggered when the browser quits or the window or tab is closed.')
		],
		'markdownDescription': nls.localize('hotExit', "[Hot Exit](https://aka.ms/vscode-hot-exit) controls whether unsaved files are remembered between sessions, allowing the save prompt when exiting the editor to be skipped.", HotExitConfiguration.ON_EXIT, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE)
	};

configurationRegistry.registerConfiguration({
	'id': 'files',
	'order': 9,
	'title': nls.localize('filesConfigurationTitle', "Files"),
	'type': 'object',
	'properties': {
		[FILES_EXCLUDE_CONFIG]: {
			'type': 'object',
			'markdownDescription': nls.localize('exclude', "Configure [glob patterns](https://aka.ms/vscode-glob-patterns) for excluding files and folders. For example, the File Explorer decides which files and folders to show or hide based on this setting. Refer to the `#search.exclude#` setting to define search-specific excludes. Refer to the `#explorer.excludeGitIgnore#` setting for ignoring files based on your `.gitignore`."),
			'default': {
				...{ '**/.git': true, '**/.svn': true, '**/.hg': true, '**/.DS_Store': true, '**/Thumbs.db': true },
				...(isWeb ? { '**/*.crswap': true /* filter out swap files used for local file access */ } : undefined)
			},
			'scope': ConfigurationScope.RESOURCE,
			'additionalProperties': {
				'anyOf': [
					{
						'type': 'boolean',
						'enum': [true, false],
						'enumDescriptions': [nls.localize('trueDescription', "Enable the pattern."), nls.localize('falseDescription', "Disable the pattern.")],
						'description': nls.localize('files.exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
					},
					{
						'type': 'object',
						'properties': {
							'when': {
								'type': 'string', // expression ({ "**/*.js": { "when": "$(basename).js" } })
								'pattern': '\\w*\\$\\(basename\\)\\w*',
								'default': '$(basename).ext',
								'markdownDescription': nls.localize({ key: 'files.exclude.when', comment: ['\\$(basename) should not be translated'] }, "Additional check on the siblings of a matching file. Use \\$(basename) as variable for the matching file name.")
							}
						}
					}
				]
			}
		},
		[FILES_ASSOCIATIONS_CONFIG]: {
			'type': 'object',
			'markdownDescription': nls.localize('associations', "Configure [glob patterns](https://aka.ms/vscode-glob-patterns) of file associations to languages (for example `\"*.extension\": \"html\"`). Patterns will match on the absolute path of a file if they contain a path separator and will match on the name of the file otherwise. These have precedence over the default associations of the languages installed."),
			'additionalProperties': {
				'type': 'string'
			}
		},
		'files.encoding': {
			'type': 'string',
			'enum': Object.keys(SUPPORTED_ENCODINGS),
			'default': 'utf8',
			'description': nls.localize('encoding', "The default character set encoding to use when reading and writing files. This setting can also be configured per language."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE,
			'enumDescriptions': Object.keys(SUPPORTED_ENCODINGS).map(key => SUPPORTED_ENCODINGS[key].labelLong),
			'enumItemLabels': Object.keys(SUPPORTED_ENCODINGS).map(key => SUPPORTED_ENCODINGS[key].labelLong)
		},
		'files.autoGuessEncoding': {
			'type': 'boolean',
			'default': false,
			'markdownDescription': nls.localize('autoGuessEncoding', "When enabled, the editor will attempt to guess the character set encoding when opening files. This setting can also be configured per language. Note, this setting is not respected by text search. Only {0} is respected.", '`#files.encoding#`'),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.candidateGuessEncodings': {
			'type': 'array',
			'items': {
				'type': 'string',
				'enum': Object.keys(GUESSABLE_ENCODINGS),
				'enumDescriptions': Object.keys(GUESSABLE_ENCODINGS).map(key => GUESSABLE_ENCODINGS[key].labelLong)
			},
			'default': [],
			'markdownDescription': nls.localize('candidateGuessEncodings', "List of character set encodings that the editor should attempt to guess in the order they are listed. In case it cannot be determined, {0} is respected", '`#files.encoding#`'),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.eol': {
			'type': 'string',
			'enum': [
				'\n',
				'\r\n',
				'auto'
			],
			'enumDescriptions': [
				nls.localize('eol.LF', "LF"),
				nls.localize('eol.CRLF', "CRLF"),
				nls.localize('eol.auto', "Uses operating system specific end of line character.")
			],
			'default': 'auto',
			'description': nls.localize('eol', "The default end of line character."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.enableTrash': {
			'type': 'boolean',
			'default': true,
			'description': nls.localize('useTrash', "Moves files/folders to the OS trash (recycle bin on Windows) when deleting. Disabling this will delete files/folders permanently.")
		},
		'files.trimTrailingWhitespace': {
			'type': 'boolean',
			'default': false,
			'description': nls.localize('trimTrailingWhitespace', "When enabled, will trim trailing whitespace when saving a file."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.trimTrailingWhitespaceInRegexAndStrings': {
			'type': 'boolean',
			'default': true,
			'description': nls.localize('trimTrailingWhitespaceInRegexAndStrings', "When enabled, trailing whitespace will be removed from multiline strings and regexes will be removed on save or when executing 'editor.action.trimTrailingWhitespace'. This can cause whitespace to not be trimmed from lines when there isn't up-to-date token information."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.insertFinalNewline': {
			'type': 'boolean',
			'default': false,
			'description': nls.localize('insertFinalNewline', "When enabled, insert a final new line at the end of the file when saving it."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.trimFinalNewlines': {
			'type': 'boolean',
			'default': false,
			'description': nls.localize('trimFinalNewlines', "When enabled, will trim all new lines after the final new line at the end of the file when saving it."),
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
		},
		'files.autoSave': {
			'type': 'string',
			'enum': [AutoSaveConfiguration.OFF, AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE],
			'markdownEnumDescriptions': [
				nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.off' }, "An editor with changes is never automatically saved."),
				nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.afterDelay' }, "An editor with changes is automatically saved after the configured `#files.autoSaveDelay#`."),
				nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.onFocusChange' }, "An editor with changes is automatically saved when the editor loses focus."),
				nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.onWindowChange' }, "An editor with changes is automatically saved when the window loses focus.")
			],
			'default': isWeb ? AutoSaveConfiguration.AFTER_DELAY : AutoSaveConfiguration.OFF,
			'markdownDescription': nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'autoSave' }, "Controls [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors that have unsaved changes.", AutoSaveConfiguration.OFF, AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE, AutoSaveConfiguration.AFTER_DELAY),
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.autoSaveDelay': {
			'type': 'number',
			'default': 1000,
			'minimum': 0,
			'markdownDescription': nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'autoSaveDelay' }, "Controls the delay in milliseconds after which an editor with unsaved changes is saved automatically. Only applies when `#files.autoSave#` is set to `{0}`.", AutoSaveConfiguration.AFTER_DELAY),
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.autoSaveWorkspaceFilesOnly': {
			'type': 'boolean',
			'default': false,
			'markdownDescription': nls.localize('autoSaveWorkspaceFilesOnly', "When enabled, will limit [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors to files that are inside the opened workspace. Only applies when {0} is enabled.", '`#files.autoSave#`'),
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.autoSaveWhenNoErrors': {
			'type': 'boolean',
			'default': false,
			'markdownDescription': nls.localize('autoSaveWhenNoErrors', "When enabled, will limit [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors to files that have no errors reported in them at the time the auto save is triggered. Only applies when {0} is enabled.", '`#files.autoSave#`'),
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.watcherExclude': {
			'type': 'object',
			'patternProperties': {
				'.*': { 'type': 'boolean' }
			},
			'default': { '**/.git/objects/**': true, '**/.git/subtree-cache/**': true, '**/.hg/store/**': true },
			'markdownDescription': nls.localize('watcherExclude', "Configure paths or [glob patterns](https://aka.ms/vscode-glob-patterns) to exclude from file watching. Paths can either be relative to the watched folder or absolute. Glob patterns are matched relative from the watched folder. When you experience the file watcher process consuming a lot of CPU, make sure to exclude large folders that are of less interest (such as build output folders)."),
			'scope': ConfigurationScope.RESOURCE
		},
		'files.watcherInclude': {
			'type': 'array',
			'items': {
				'type': 'string'
			},
			'default': [],
			'description': nls.localize('watcherInclude', "Configure extra paths to watch for changes inside the workspace. By default, all workspace folders will be watched recursively, except for folders that are symbolic links. You can explicitly add absolute or relative paths to support watching folders that are symbolic links. Relative paths will be resolved to an absolute path using the currently opened workspace."),
			'scope': ConfigurationScope.RESOURCE
		},
		'files.hotExit': hotExitConfiguration,
		'files.defaultLanguage': {
			'type': 'string',
			'markdownDescription': nls.localize('defaultLanguage', "The default language identifier that is assigned to new files. If configured to `${activeEditorLanguage}`, will use the language identifier of the currently active text editor if any.")
		},
		[FILES_READONLY_INCLUDE_CONFIG]: {
			'type': 'object',
			'patternProperties': {
				'.*': { 'type': 'boolean' }
			},
			'default': {},
			'markdownDescription': nls.localize('filesReadonlyInclude', "Configure paths or [glob patterns](https://aka.ms/vscode-glob-patterns) to mark as read-only. Glob patterns are always evaluated relative to the path of the workspace folder unless they are absolute paths. You can exclude matching paths via the `#files.readonlyExclude#` setting. Files from readonly file system providers will always be read-only independent of this setting."),
			'scope': ConfigurationScope.RESOURCE
		},
		[FILES_READONLY_EXCLUDE_CONFIG]: {
			'type': 'object',
			'patternProperties': {
				'.*': { 'type': 'boolean' }
			},
			'default': {},
			'markdownDescription': nls.localize('filesReadonlyExclude', "Configure paths or [glob patterns](https://aka.ms/vscode-glob-patterns) to exclude from being marked as read-only if they match as a result of the `#files.readonlyInclude#` setting. Glob patterns are always evaluated relative to the path of the workspace folder unless they are absolute paths. Files from readonly file system providers will always be read-only independent of this setting."),
			'scope': ConfigurationScope.RESOURCE
		},
		[FILES_READONLY_FROM_PERMISSIONS_CONFIG]: {
			'type': 'boolean',
			'markdownDescription': nls.localize('filesReadonlyFromPermissions', "Marks files as read-only when their file permissions indicate as such. This can be overridden via `#files.readonlyInclude#` and `#files.readonlyExclude#` settings."),
			'default': false
		},
		'files.restoreUndoStack': {
			'type': 'boolean',
			'description': nls.localize('files.restoreUndoStack', "Restore the undo stack when a file is reopened."),
			'default': true
		},
		'files.saveConflictResolution': {
			'type': 'string',
			'enum': [
				'askUser',
				'overwriteFileOnDisk'
			],
			'enumDescriptions': [
				nls.localize('askUser', "Will refuse to save and ask for resolving the save conflict manually."),
				nls.localize('overwriteFileOnDisk', "Will resolve the save conflict by overwriting the file on disk with the changes in the editor.")
			],
			'description': nls.localize('files.saveConflictResolution', "A save conflict can occur when a file is saved to disk that was changed by another program in the meantime. To prevent data loss, the user is asked to compare the changes in the editor with the version on disk. This setting should only be changed if you frequently encounter save conflict errors and may result in data loss if used without caution."),
			'default': 'askUser',
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'files.dialog.defaultPath': {
			'type': 'string',
			'pattern': '^((\\/|\\\\\\\\|[a-zA-Z]:\\\\).*)?$', // slash OR UNC-root OR drive-root OR undefined
			'patternErrorMessage': nls.localize('defaultPathErrorMessage', "Default path for file dialogs must be an absolute path (e.g. C:\\\\myFolder or /myFolder)."),
			'description': nls.localize('fileDialogDefaultPath', "Default path for file dialogs, overriding user's home path. Only used in the absence of a context-specific path, such as most recently opened file or folder."),
			'scope': ConfigurationScope.MACHINE
		},
		'files.simpleDialog.enable': {
			'type': 'boolean',
			'description': nls.localize('files.simpleDialog.enable', "Enables the simple file dialog for opening and saving files and folders. The simple file dialog replaces the system file dialog when enabled."),
			'default': false
		},
		'files.participants.timeout': {
			type: 'number',
			default: 60000,
			markdownDescription: nls.localize('files.participants.timeout', "Timeout in milliseconds after which file participants for create, rename, and delete are cancelled. Use `0` to disable participants."),
		}
	}
});

configurationRegistry.registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		'editor.formatOnSave': {
			'type': 'boolean',
			'markdownDescription': nls.localize('formatOnSave', "Format a file on save. A formatter must be available and the editor must not be shutting down. When {0} is set to `afterDelay`, the file will only be formatted when saved explicitly.", '`#files.autoSave#`'),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE,
		},
		'editor.formatOnSaveMode': {
			'type': 'string',
			'default': 'file',
			'enum': [
				'file',
				'modifications',
				'modificationsIfAvailable'
			],
			'enumDescriptions': [
				nls.localize({ key: 'everything', comment: ['This is the description of an option'] }, "Format the whole file."),
				nls.localize({ key: 'modification', comment: ['This is the description of an option'] }, "Format modifications. Requires source control and a formatter that supports 'Format Selection'."),
				nls.localize({ key: 'modificationIfAvailable', comment: ['This is the description of an option'] }, "Will attempt to format modifications only (requires source control and a formatter that supports 'Format Selection'). If source control can't be used, then the whole file will be formatted."),
			],
			'markdownDescription': nls.localize('formatOnSaveMode', "Controls if format on save formats the whole file or only modifications. Only applies when `#editor.formatOnSave#` is enabled."),
			'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE,
		},
	}
});

configurationRegistry.registerConfiguration({
	'id': 'explorer',
	'order': 10,
	'title': nls.localize('explorerConfigurationTitle', "File Explorer"),
	'type': 'object',
	'properties': {
		'explorer.openEditors.visible': {
			'type': 'number',
			'description': nls.localize({ key: 'openEditorsVisible', comment: ['Open is an adjective'] }, "The initial maximum number of editors shown in the Open Editors pane. Exceeding this limit will show a scroll bar and allow resizing the pane to display more items."),
			'default': 9,
			'minimum': 1
		},
		'explorer.openEditors.minVisible': {
			'type': 'number',
			'description': nls.localize({ key: 'openEditorsVisibleMin', comment: ['Open is an adjective'] }, "The minimum number of editor slots pre-allocated in the Open Editors pane. If set to 0 the Open Editors pane will dynamically resize based on the number of editors."),
			'default': 0,
			'minimum': 0
		},
		'explorer.openEditors.sortOrder': {
			'type': 'string',
			'enum': ['editorOrder', 'alphabetical', 'fullPath'],
			'description': nls.localize({ key: 'openEditorsSortOrder', comment: ['Open is an adjective'] }, "Controls the sorting order of editors in the Open Editors pane."),
			'enumDescriptions': [
				nls.localize('sortOrder.editorOrder', 'Editors are ordered in the same order editor tabs are shown.'),
				nls.localize('sortOrder.alphabetical', 'Editors are ordered alphabetically by tab name inside each editor group.'),
				nls.localize('sortOrder.fullPath', 'Editors are ordered alphabetically by full path inside each editor group.')
			],
			'default': 'editorOrder'
		},
		'explorer.autoReveal': {
			'type': ['boolean', 'string'],
			'enum': [true, false, 'focusNoScroll'],
			'default': true,
			'enumDescriptions': [
				nls.localize('autoReveal.on', 'Files will be revealed and selected.'),
				nls.localize('autoReveal.off', 'Files will not be revealed and selected.'),
				nls.localize('autoReveal.focusNoScroll', 'Files will not be scrolled into view, but will still be focused.'),
			],
			'description': nls.localize('autoReveal', "Controls whether the Explorer should automatically reveal and select files when opening them.")
		},
		'explorer.autoRevealExclude': {
			'type': 'object',
			'markdownDescription': nls.localize('autoRevealExclude', "Configure paths or [glob patterns](https://aka.ms/vscode-glob-patterns) for excluding files and folders from being revealed and selected in the Explorer when they are opened. Glob patterns are always evaluated relative to the path of the workspace folder unless they are absolute paths."),
			'default': { '**/node_modules': true, '**/bower_components': true },
			'additionalProperties': {
				'anyOf': [
					{
						'type': 'boolean',
						'description': nls.localize('explorer.autoRevealExclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
					},
					{
						type: 'object',
						properties: {
							when: {
								type: 'string', // expression ({ "**/*.js": { "when": "$(basename).js" } })
								pattern: '\\w*\\$\\(basename\\)\\w*',
								default: '$(basename).ext',
								description: nls.localize('explorer.autoRevealExclude.when', 'Additional check on the siblings of a matching file. Use $(basename) as variable for the matching file name.')
							}
						}
					}
				]
			}
		},
		'explorer.enableDragAndDrop': {
			'type': 'boolean',
			'description': nls.localize('enableDragAndDrop', "Controls whether the Explorer should allow to move files and folders via drag and drop. This setting only effects drag and drop from inside the Explorer."),
			'default': true
		},
		'explorer.confirmDragAndDrop': {
			'type': 'boolean',
			'description': nls.localize('confirmDragAndDrop', "Controls whether the Explorer should ask for confirmation to move files and folders via drag and drop."),
			'default': true
		},
		'explorer.confirmPasteNative': {
			'type': 'boolean',
			'description': nls.localize('confirmPasteNative', "Controls whether the Explorer should ask for confirmation when pasting native files and folders."),
			'default': true
		},
		'explorer.confirmDelete': {
			'type': 'boolean',
			'description': nls.localize('confirmDelete', "Controls whether the Explorer should ask for confirmation when deleting a file via the trash."),
			'default': true
		},
		'explorer.enableUndo': {
			'type': 'boolean',
			'description': nls.localize('enableUndo', "Controls whether the Explorer should support undoing file and folder operations."),
			'default': true
		},
		'explorer.confirmUndo': {
			'type': 'string',
			'enum': [UndoConfirmLevel.Verbose, UndoConfirmLevel.Default, UndoConfirmLevel.Light],
			'description': nls.localize('confirmUndo', "Controls whether the Explorer should ask for confirmation when undoing."),
			'default': UndoConfirmLevel.Default,
			'enumDescriptions': [
				nls.localize('enableUndo.verbose', 'Explorer will prompt before all undo operations.'),
				nls.localize('enableUndo.default', 'Explorer will prompt before destructive undo operations.'),
				nls.localize('enableUndo.light', 'Explorer will not prompt before undo operations when focused.'),
			],
		},
		'explorer.expandSingleFolderWorkspaces': {
			'type': 'boolean',
			'description': nls.localize('expandSingleFolderWorkspaces', "Controls whether the Explorer should expand multi-root workspaces containing only one folder during initialization"),
			'default': true
		},
		'explorer.sortOrder': {
			'type': 'string',
			'enum': [SortOrder.Default, SortOrder.Mixed, SortOrder.FilesFirst, SortOrder.Type, SortOrder.Modified, SortOrder.FoldersNestsFiles],
			'default': SortOrder.Default,
			'enumDescriptions': [
				nls.localize('sortOrder.default', 'Files and folders are sorted by their names. Folders are displayed before files.'),
				nls.localize('sortOrder.mixed', 'Files and folders are sorted by their names. Files are interwoven with folders.'),
				nls.localize('sortOrder.filesFirst', 'Files and folders are sorted by their names. Files are displayed before folders.'),
				nls.localize('sortOrder.type', 'Files and folders are grouped by extension type then sorted by their names. Folders are displayed before files.'),
				nls.localize('sortOrder.modified', 'Files and folders are sorted by last modified date in descending order. Folders are displayed before files.'),
				nls.localize('sortOrder.foldersNestsFiles', 'Files and folders are sorted by their names. Folders are displayed before files. Files with nested children are displayed before other files.')
			],
			'markdownDescription': nls.localize('sortOrder', "Controls the property-based sorting of files and folders in the Explorer. When `#explorer.fileNesting.enabled#` is enabled, also controls sorting of nested files.")
		},
		'explorer.sortOrderLexicographicOptions': {
			'type': 'string',
			'enum': [LexicographicOptions.Default, LexicographicOptions.Upper, LexicographicOptions.Lower, LexicographicOptions.Unicode],
			'default': LexicographicOptions.Default,
			'enumDescriptions': [
				nls.localize('sortOrderLexicographicOptions.default', 'Uppercase and lowercase names are mixed together.'),
				nls.localize('sortOrderLexicographicOptions.upper', 'Uppercase names are grouped together before lowercase names.'),
				nls.localize('sortOrderLexicographicOptions.lower', 'Lowercase names are grouped together before uppercase names.'),
				nls.localize('sortOrderLexicographicOptions.unicode', 'Names are sorted in Unicode order.')
			],
			'description': nls.localize('sortOrderLexicographicOptions', "Controls the lexicographic sorting of file and folder names in the Explorer.")
		},
		'explorer.sortOrderReverse': {
			'type': 'boolean',
			'description': nls.localize('sortOrderReverse', "Controls whether the file and folder sort order, should be reversed."),
			'default': false,
		},
		'explorer.decorations.colors': {
			type: 'boolean',
			description: nls.localize('explorer.decorations.colors', "Controls whether file decorations should use colors."),
			default: true
		},
		'explorer.decorations.badges': {
			type: 'boolean',
			description: nls.localize('explorer.decorations.badges', "Controls whether file decorations should use badges."),
			default: true
		},
		'explorer.incrementalNaming': {
			'type': 'string',
			enum: ['simple', 'smart', 'disabled'],
			enumDescriptions: [
				nls.localize('simple', "Appends the word \"copy\" at the end of the duplicated name potentially followed by a number."),
				nls.localize('smart', "Adds a number at the end of the duplicated name. If some number is already part of the name, tries to increase that number."),
				nls.localize('disabled', "Disables incremental naming. If two files with the same name exist you will be prompted to overwrite the existing file.")
			],
			description: nls.localize('explorer.incrementalNaming', "Controls which naming strategy to use when giving a new name to a duplicated Explorer item on paste."),
			default: 'simple'
		},
		'explorer.autoOpenDroppedFile': {
			'type': 'boolean',
			'description': nls.localize('autoOpenDroppedFile', "Controls whether the Explorer should automatically open a file when it is dropped into the explorer"),
			'default': true
		},
		'explorer.compactFolders': {
			'type': 'boolean',
			'description': nls.localize('compressSingleChildFolders', "Controls whether the Explorer should render folders in a compact form. In such a form, single child folders will be compressed in a combined tree element. Useful for Java package structures, for example."),
			'default': true
		},
		'explorer.copyRelativePathSeparator': {
			'type': 'string',
			'enum': [
				'/',
				'\\',
				'auto'
			],
			'enumDescriptions': [
				nls.localize('copyRelativePathSeparator.slash', "Use slash as path separation character."),
				nls.localize('copyRelativePathSeparator.backslash', "Use backslash as path separation character."),
				nls.localize('copyRelativePathSeparator.auto', "Uses operating system specific path separation character."),
			],
			'description': nls.localize('copyRelativePathSeparator', "The path separation character used when copying relative file paths."),
			'default': 'auto'
		},
		'explorer.copyPathSeparator': {
			'type': 'string',
			'enum': [
				'/',
				'\\',
				'auto'
			],
			'enumDescriptions': [
				nls.localize('copyPathSeparator.slash', "Use slash as path separation character."),
				nls.localize('copyPathSeparator.backslash', "Use backslash as path separation character."),
				nls.localize('copyPathSeparator.auto', "Uses operating system specific path separation character."),
			],
			'description': nls.localize('copyPathSeparator', "The path separation character used when copying file paths."),
			'default': 'auto'
		},
		'explorer.excludeGitIgnore': {
			type: 'boolean',
			markdownDescription: nls.localize('excludeGitignore', "Controls whether entries in .gitignore should be parsed and excluded from the Explorer. Similar to {0}.", '`#files.exclude#`'),
			default: false,
			scope: ConfigurationScope.RESOURCE
		},
		'explorer.fileNesting.enabled': {
			'type': 'boolean',
			scope: ConfigurationScope.RESOURCE,
			'markdownDescription': nls.localize('fileNestingEnabled', "Controls whether file nesting is enabled in the Explorer. File nesting allows for related files in a directory to be visually grouped together under a single parent file."),
			'default': false,
		},
		'explorer.fileNesting.expand': {
			'type': 'boolean',
			'markdownDescription': nls.localize('fileNestingExpand', "Controls whether file nests are automatically expanded. {0} must be set for this to take effect.", '`#explorer.fileNesting.enabled#`'),
			'default': true,
		},
		'explorer.fileNesting.patterns': {
			'type': 'object',
			scope: ConfigurationScope.RESOURCE,
			'markdownDescription': nls.localize('fileNestingPatterns', "Controls nesting of files in the Explorer. {0} must be set for this to take effect. Each __Item__ represents a parent pattern and may contain a single `*` character that matches any string. Each __Value__ represents a comma separated list of the child patterns that should be shown nested under a given parent. Child patterns may contain several special tokens:\n- `${capture}`: Matches the resolved value of the `*` from the parent pattern\n- `${basename}`: Matches the parent file's basename, the `file` in `file.ts`\n- `${extname}`: Matches the parent file's extension, the `ts` in `file.ts`\n- `${dirname}`: Matches the parent file's directory name, the `src` in `src/file.ts`\n- `*`:  Matches any string, may only be used once per child pattern", '`#explorer.fileNesting.enabled#`'),
			patternProperties: {
				'^[^*]*\\*?[^*]*$': {
					markdownDescription: nls.localize('fileNesting.description', "Each key pattern may contain a single `*` character which will match any string."),
					type: 'string',
					pattern: '^([^,*]*\\*?[^,*]*)(, ?[^,*]*\\*?[^,*]*)*$',
				}
			},
			additionalProperties: false,
			'default': {
				'*.ts': '${capture}.js',
				'*.js': '${capture}.js.map, ${capture}.min.js, ${capture}.d.ts',
				'*.jsx': '${capture}.js',
				'*.tsx': '${capture}.ts',
				'tsconfig.json': 'tsconfig.*.json',
				'package.json': 'package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb, bun.lock',
			}
		}
	}
});

UndoCommand.addImplementation(110, 'explorer', (accessor: ServicesAccessor) => {
	const undoRedoService = accessor.get(IUndoRedoService);
	const explorerService = accessor.get(IExplorerService);
	const configurationService = accessor.get(IConfigurationService);

	const explorerCanUndo = configurationService.getValue<IFilesConfiguration>().explorer.enableUndo;
	if (explorerService.hasViewFocus() && undoRedoService.canUndo(UNDO_REDO_SOURCE) && explorerCanUndo) {
		undoRedoService.undo(UNDO_REDO_SOURCE);
		return true;
	}

	return false;
});

RedoCommand.addImplementation(110, 'explorer', (accessor: ServicesAccessor) => {
	const undoRedoService = accessor.get(IUndoRedoService);
	const explorerService = accessor.get(IExplorerService);
	const configurationService = accessor.get(IConfigurationService);

	const explorerCanUndo = configurationService.getValue<IFilesConfiguration>().explorer.enableUndo;
	if (explorerService.hasViewFocus() && undoRedoService.canRedo(UNDO_REDO_SOURCE) && explorerCanUndo) {
		undoRedoService.redo(UNDO_REDO_SOURCE);
		return true;
	}

	return false;
});

ModesRegistry.registerLanguage({
	id: BINARY_TEXT_FILE_MODE,
	aliases: ['Binary'],
	mimetypes: ['text/x-code-binary']
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/files.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/files.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { OpenEditor, ISortOrderConfiguration } from '../common/files.js';
import { EditorResourceAccessor, SideBySideEditor, IEditorIdentifier } from '../../../common/editor.js';
import { List } from '../../../../base/browser/ui/list/listWidget.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ExplorerItem } from '../common/explorerModel.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { AsyncDataTree } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditableData } from '../../../common/views.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ResourceFileEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { isActiveElement } from '../../../../base/browser/dom.js';

export interface IExplorerService {
	readonly _serviceBrand: undefined;
	readonly roots: ExplorerItem[];
	readonly sortOrderConfiguration: ISortOrderConfiguration;

	getContext(respectMultiSelection: boolean, ignoreNestedChildren?: boolean): ExplorerItem[];
	hasViewFocus(): boolean;
	setEditable(stat: ExplorerItem, data: IEditableData | null): Promise<void>;
	getEditable(): { stat: ExplorerItem; data: IEditableData } | undefined;
	getEditableData(stat: ExplorerItem): IEditableData | undefined;
	// If undefined is passed checks if any element is currently being edited.
	isEditable(stat: ExplorerItem | undefined): boolean;
	findClosest(resource: URI): ExplorerItem | null;
	findClosestRoot(resource: URI): ExplorerItem | null;
	refresh(): Promise<void>;
	setToCopy(stats: ExplorerItem[], cut: boolean): Promise<void>;
	isCut(stat: ExplorerItem): boolean;
	applyBulkEdit(edit: ResourceFileEdit[], options: { undoLabel: string; progressLabel: string; confirmBeforeUndo?: boolean; progressLocation?: ProgressLocation.Explorer | ProgressLocation.Window }): Promise<void>;

	/**
	 * Selects and reveal the file element provided by the given resource if its found in the explorer.
	 * Will try to resolve the path in case the explorer is not yet expanded to the file yet.
	 */
	select(resource: URI, reveal?: boolean | string): Promise<void>;

	registerView(contextAndRefreshProvider: IExplorerView): void;
}

export const IExplorerService = createDecorator<IExplorerService>('explorerService');

export interface IExplorerView {
	autoReveal: boolean | 'force' | 'focusNoScroll';
	getContext(respectMultiSelection: boolean): ExplorerItem[];
	refresh(recursive: boolean, item?: ExplorerItem, cancelEditing?: boolean): Promise<void>;
	selectResource(resource: URI | undefined, reveal?: boolean | string, retry?: number): Promise<void>;
	setTreeInput(): Promise<void>;
	itemsCopied(tats: ExplorerItem[], cut: boolean, previousCut: ExplorerItem[] | undefined): void;
	setEditable(stat: ExplorerItem, isEditing: boolean): Promise<void>;
	isItemVisible(item: ExplorerItem): boolean;
	isItemCollapsed(item: ExplorerItem): boolean;
	hasFocus(): boolean;
	getFocus(): ExplorerItem[];
	focusNext(): void;
	focusLast(): void;
	hasPhantomElements(): boolean;
}

function getFocus(listService: IListService): unknown | undefined {
	const list = listService.lastFocusedList;
	const element = list?.getHTMLElement();
	if (element && isActiveElement(element)) {
		let focus: unknown;
		if (list instanceof List) {
			const focused = list.getFocusedElements();
			if (focused.length) {
				focus = focused[0];
			}
		} else if (list instanceof AsyncDataTree) {
			const focused = list.getFocus();
			if (focused.length) {
				focus = focused[0];
			}
		}

		return focus;
	}

	return undefined;
}

// Commands can get executed from a command palette, from a context menu or from some list using a keybinding
// To cover all these cases we need to properly compute the resource on which the command is being executed
export function getResourceForCommand(commandArg: unknown, editorService: IEditorService, listService: IListService): URI | undefined {
	if (URI.isUri(commandArg)) {
		return commandArg;
	}

	const focus = getFocus(listService);
	if (focus instanceof ExplorerItem) {
		return focus.resource;
	} else if (focus instanceof OpenEditor) {
		return focus.getResource();
	}

	return EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
}

export function getMultiSelectedResources(commandArg: unknown, listService: IListService, editorSerice: IEditorService, editorGroupService: IEditorGroupsService, explorerService: IExplorerService): Array<URI> {
	const list = listService.lastFocusedList;
	const element = list?.getHTMLElement();
	if (element && isActiveElement(element)) {
		// Explorer
		if (list instanceof AsyncDataTree && list.getFocus().every(item => item instanceof ExplorerItem)) {
			// Explorer
			const context = explorerService.getContext(true, true);
			if (context.length) {
				return context.map(c => c.resource);
			}
		}

		// Open editors view
		if (list instanceof List) {
			const selection = coalesce(list.getSelectedElements().filter(s => s instanceof OpenEditor).map((oe: OpenEditor) => oe.getResource()));
			const focusedElements = list.getFocusedElements();
			const focus = focusedElements.length ? focusedElements[0] : undefined;
			let mainUriStr: string | undefined = undefined;
			if (URI.isUri(commandArg)) {
				mainUriStr = commandArg.toString();
			} else if (focus instanceof OpenEditor) {
				const focusedResource = focus.getResource();
				mainUriStr = focusedResource ? focusedResource.toString() : undefined;
			}
			// We only respect the selection if it contains the main element.
			const mainIndex = selection.findIndex(s => s.toString() === mainUriStr);
			if (mainIndex !== -1) {
				// Move the main resource to the front of the selection.
				const mainResource = selection[mainIndex];
				selection.splice(mainIndex, 1);
				selection.unshift(mainResource);
				return selection;
			}
		}
	}

	// Check for tabs multiselect
	const activeGroup = editorGroupService.activeGroup;
	const selection = activeGroup.selectedEditors;
	if (selection.length > 1 && URI.isUri(commandArg)) {
		// If the resource is part of the tabs selection, return all selected tabs/resources.
		// It's possible that multiple tabs are selected but the action was applied to a resource that is not part of the selection.
		const mainEditorSelectionIndex = selection.findIndex(e => e.matches({ resource: commandArg }));
		if (mainEditorSelectionIndex !== -1) {
			const mainEditor = selection[mainEditorSelectionIndex];
			selection.splice(mainEditorSelectionIndex, 1);
			selection.unshift(mainEditor);
			return selection.map(editor => EditorResourceAccessor.getOriginalUri(editor)).filter(uri => !!uri);
		}
	}

	const result = getResourceForCommand(commandArg, editorSerice, listService);
	return result ? [result] : [];
}

export function getOpenEditorsViewMultiSelection(accessor: ServicesAccessor): Array<IEditorIdentifier> | undefined {
	const list = accessor.get(IListService).lastFocusedList;
	const element = list?.getHTMLElement();
	if (element && isActiveElement(element)) {
		// Open editors view
		if (list instanceof List) {
			const selection = coalesce(list.getSelectedElements().filter(s => s instanceof OpenEditor));
			const focusedElements = list.getFocusedElements();
			const focus = focusedElements.length ? focusedElements[0] : undefined;
			let mainEditor: IEditorIdentifier | undefined = undefined;
			if (focus instanceof OpenEditor) {
				mainEditor = focus;
			}
			// We only respect the selection if it contains the main element.
			if (selection.some(s => s === mainEditor)) {
				return selection;
			}
			return mainEditor ? [mainEditor] : undefined;
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/workspaceWatcher.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/workspaceWatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IDisposable, Disposable, dispose, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IFileService, IFilesConfiguration } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService, IWorkspaceFolder, IWorkspaceFoldersChangeEvent } from '../../../../platform/workspace/common/workspace.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { INotificationService, Severity, NeverShowAgainScope, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { isAbsolute } from '../../../../base/common/path.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';

export class WorkspaceWatcher extends Disposable {

	static readonly ID = 'workbench.contrib.workspaceWatcher';

	private readonly watchedWorkspaces = new ResourceMap<IDisposable>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@INotificationService private readonly notificationService: INotificationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IHostService private readonly hostService: IHostService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		super();

		this.registerListeners();

		this.refresh();
	}

	private registerListeners(): void {
		this._register(this.contextService.onDidChangeWorkspaceFolders(e => this.onDidChangeWorkspaceFolders(e)));
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.onDidChangeWorkbenchState()));
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onDidChangeConfiguration(e)));
		this._register(this.fileService.onDidWatchError(error => this.onDidWatchError(error)));
	}

	private onDidChangeWorkspaceFolders(e: IWorkspaceFoldersChangeEvent): void {

		// Removed workspace: Unwatch
		for (const removed of e.removed) {
			this.unwatchWorkspace(removed);
		}

		// Added workspace: Watch
		for (const added of e.added) {
			this.watchWorkspace(added);
		}
	}

	private onDidChangeWorkbenchState(): void {
		this.refresh();
	}

	private onDidChangeConfiguration(e: IConfigurationChangeEvent): void {
		if (e.affectsConfiguration('files.watcherExclude') || e.affectsConfiguration('files.watcherInclude')) {
			this.refresh();
		}
	}

	private onDidWatchError(error: Error): void {
		const msg = error.toString();
		let reason: 'ENOSPC' | 'EUNKNOWN' | 'ETERM' | undefined = undefined;

		// Detect if we run into ENOSPC issues
		if (msg.indexOf('ENOSPC') >= 0) {
			reason = 'ENOSPC';

			this.notificationService.prompt(
				Severity.Warning,
				localize('enospcError', "Unable to watch for file changes. Please follow the instructions link to resolve this issue."),
				[{
					label: localize('learnMore', "Instructions"),
					run: () => this.openerService.open(URI.parse('https://go.microsoft.com/fwlink/?linkid=867693'))
				}],
				{
					sticky: true,
					neverShowAgain: { id: 'ignoreEnospcError', isSecondary: true, scope: NeverShowAgainScope.WORKSPACE }
				}
			);
		}

		// Detect when the watcher throws an error unexpectedly
		else if (msg.indexOf('EUNKNOWN') >= 0) {
			reason = 'EUNKNOWN';

			this.notificationService.prompt(
				Severity.Warning,
				localize('eshutdownError', "File changes watcher stopped unexpectedly. A reload of the window may enable the watcher again unless the workspace cannot be watched for file changes."),
				[{
					label: localize('reload', "Reload"),
					run: () => this.hostService.reload()
				}],
				{
					sticky: true,
					priority: NotificationPriority.SILENT // reduce potential spam since we don't really know how often this fires
				}
			);
		}

		// Detect unexpected termination
		else if (msg.indexOf('ETERM') >= 0) {
			reason = 'ETERM';
		}

		// Log telemetry if we gathered a reason (logging it from the renderer
		// allows us to investigate this situation in context of experiments)
		if (reason) {
			type WatchErrorClassification = {
				owner: 'bpasero';
				comment: 'An event that fires when a watcher errors';
				reason: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The watcher error reason.' };
			};
			type WatchErrorEvent = {
				reason: string;
			};
			this.telemetryService.publicLog2<WatchErrorEvent, WatchErrorClassification>('fileWatcherError', { reason });
		}
	}

	private watchWorkspace(workspace: IWorkspaceFolder): void {

		// Compute the watcher exclude rules from configuration
		const excludes: string[] = [];
		const config = this.configurationService.getValue<IFilesConfiguration>({ resource: workspace.uri });
		if (config.files?.watcherExclude) {
			for (const key in config.files.watcherExclude) {
				if (key && config.files.watcherExclude[key] === true) {
					excludes.push(key);
				}
			}
		}

		const pathsToWatch = new ResourceMap<URI>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));

		// Add the workspace as path to watch
		pathsToWatch.set(workspace.uri, workspace.uri);

		// Compute additional includes from configuration
		if (config.files?.watcherInclude) {
			for (const includePath of config.files.watcherInclude) {
				if (!includePath) {
					continue;
				}

				// Absolute: verify a child of the workspace
				if (isAbsolute(includePath)) {
					const candidate = URI.file(includePath).with({ scheme: workspace.uri.scheme });
					if (this.uriIdentityService.extUri.isEqualOrParent(candidate, workspace.uri)) {
						pathsToWatch.set(candidate, candidate);
					}
				}

				// Relative: join against workspace folder
				else {
					const candidate = workspace.toResource(includePath);
					pathsToWatch.set(candidate, candidate);
				}
			}
		}

		// Watch all paths as instructed
		const disposables = new DisposableStore();
		for (const [, pathToWatch] of pathsToWatch) {
			disposables.add(this.fileService.watch(pathToWatch, { recursive: true, excludes }));
		}
		this.watchedWorkspaces.set(workspace.uri, disposables);
	}

	private unwatchWorkspace(workspace: IWorkspaceFolder): void {
		if (this.watchedWorkspaces.has(workspace.uri)) {
			dispose(this.watchedWorkspaces.get(workspace.uri));
			this.watchedWorkspaces.delete(workspace.uri);
		}
	}

	private refresh(): void {

		// Unwatch all first
		this.unwatchWorkspaces();

		// Watch each workspace folder
		for (const folder of this.contextService.getWorkspace().folders) {
			this.watchWorkspace(folder);
		}
	}

	private unwatchWorkspaces(): void {
		for (const [, disposable] of this.watchedWorkspaces) {
			disposable.dispose();
		}
		this.watchedWorkspaces.clear();
	}

	override dispose(): void {
		super.dispose();

		this.unwatchWorkspaces();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/binaryFileEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/binaryFileEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { BaseBinaryResourceEditor } from '../../../../browser/parts/editor/binaryEditor.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { FileEditorInput } from './fileEditorInput.js';
import { BINARY_FILE_EDITOR_ID, BINARY_TEXT_FILE_MODE } from '../../common/files.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { EditorResolution, IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IEditorResolverService, ResolvedStatus, ResolvedEditor } from '../../../../services/editor/common/editorResolverService.js';
import { isEditorInputWithOptions } from '../../../../common/editor.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';

/**
 * An implementation of editor for binary files that cannot be displayed.
 */
export class BinaryFileEditor extends BaseBinaryResourceEditor {

	static readonly ID = BINARY_FILE_EDITOR_ID;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IStorageService storageService: IStorageService
	) {
		super(
			BinaryFileEditor.ID,
			group,
			{
				openInternal: (input, options) => this.openInternal(input, options)
			},
			telemetryService,
			themeService,
			storageService
		);
	}

	private async openInternal(input: EditorInput, options: IEditorOptions | undefined): Promise<void> {
		if (input instanceof FileEditorInput && this.group.activeEditor) {

			// We operate on the active editor here to support re-opening
			// diff editors where `input` may just be one side of the
			// diff editor.
			// Since `openInternal` can only ever be selected from the
			// active editor of the group, this is a safe assumption.
			// (https://github.com/microsoft/vscode/issues/124222)
			const activeEditor = this.group.activeEditor;
			const untypedActiveEditor = activeEditor?.toUntyped();
			if (!untypedActiveEditor) {
				return; // we need untyped editor support
			}

			// Try to let the user pick an editor
			let resolvedEditor: ResolvedEditor | undefined = await this.editorResolverService.resolveEditor({
				...untypedActiveEditor,
				options: {
					...options,
					override: EditorResolution.PICK
				}
			}, this.group);

			if (resolvedEditor === ResolvedStatus.NONE) {
				resolvedEditor = undefined;
			} else if (resolvedEditor === ResolvedStatus.ABORT) {
				return;
			}

			// If the result if a file editor, the user indicated to open
			// the binary file as text. As such we adjust the input for that.
			if (isEditorInputWithOptions(resolvedEditor)) {
				for (const editor of resolvedEditor.editor instanceof DiffEditorInput ? [resolvedEditor.editor.original, resolvedEditor.editor.modified] : [resolvedEditor.editor]) {
					if (editor instanceof FileEditorInput) {
						editor.setForceOpenAsText();
						editor.setPreferredLanguageId(BINARY_TEXT_FILE_MODE); // https://github.com/microsoft/vscode/issues/131076
					}
				}
			}

			// Replace the active editor with the picked one
			await this.group.replaceEditors([{
				editor: activeEditor,
				replacement: resolvedEditor?.editor ?? input,
				options: {
					...resolvedEditor?.options ?? options
				}
			}]);
		}
	}

	override getTitle(): string {
		return this.input ? this.input.getName() : localize('binaryFileEditor', "Binary File Viewer");
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/fileEditorHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/fileEditorHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IEditorSerializer } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { ITextEditorService } from '../../../../services/textfile/common/textEditorService.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IWorkingCopyIdentifier, NO_TYPE_ID } from '../../../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../../services/workingCopy/common/workingCopyEditorService.js';
import { FileEditorInput } from './fileEditorInput.js';
import { IFileService } from '../../../../../platform/files/common/files.js';

interface ISerializedFileEditorInput {
	resourceJSON: UriComponents;
	preferredResourceJSON?: UriComponents;
	name?: string;
	description?: string;
	encoding?: string;
	modeId?: string; // should be `languageId` but is kept for backwards compatibility
}

export class FileEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(editorInput: EditorInput): string {
		const fileEditorInput = editorInput as FileEditorInput;
		const resource = fileEditorInput.resource;
		const preferredResource = fileEditorInput.preferredResource;
		const serializedFileEditorInput: ISerializedFileEditorInput = {
			resourceJSON: resource.toJSON(),
			preferredResourceJSON: isEqual(resource, preferredResource) ? undefined : preferredResource, // only storing preferredResource if it differs from the resource
			name: fileEditorInput.getPreferredName(),
			description: fileEditorInput.getPreferredDescription(),
			encoding: fileEditorInput.getEncoding(),
			modeId: fileEditorInput.getPreferredLanguageId() // only using the preferred user associated language here if available to not store redundant data
		};

		return JSON.stringify(serializedFileEditorInput);
	}

	deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): FileEditorInput {
		return instantiationService.invokeFunction(accessor => {
			const serializedFileEditorInput: ISerializedFileEditorInput = JSON.parse(serializedEditorInput);
			const resource = URI.revive(serializedFileEditorInput.resourceJSON);
			const preferredResource = URI.revive(serializedFileEditorInput.preferredResourceJSON);
			const name = serializedFileEditorInput.name;
			const description = serializedFileEditorInput.description;
			const encoding = serializedFileEditorInput.encoding;
			const languageId = serializedFileEditorInput.modeId;

			const fileEditorInput = accessor.get(ITextEditorService).createTextEditor({ resource, label: name, description, encoding, languageId, forceFile: true }) as FileEditorInput;
			if (preferredResource) {
				fileEditorInput.setPreferredResource(preferredResource);
			}

			return fileEditorInput;
		});
	}
}

export class FileEditorWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.fileEditorWorkingCopyEditorHandler';

	constructor(
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
		@ITextEditorService private readonly textEditorService: ITextEditorService,
		@IFileService private readonly fileService: IFileService
	) {
		super();

		this._register(workingCopyEditorService.registerHandler(this));
	}

	handles(workingCopy: IWorkingCopyIdentifier): boolean | Promise<boolean> {
		return workingCopy.typeId === NO_TYPE_ID && this.fileService.canHandleResource(workingCopy.resource);
	}

	private handlesSync(workingCopy: IWorkingCopyIdentifier): boolean {
		return workingCopy.typeId === NO_TYPE_ID && this.fileService.hasProvider(workingCopy.resource);
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handlesSync(workingCopy)) {
			return false;
		}

		// Naturally it would make sense here to check for `instanceof FileEditorInput`
		// but because some custom editors also leverage text file based working copies
		// we need to do a weaker check by only comparing for the resource

		return isEqual(workingCopy.resource, editor.resource);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		return this.textEditorService.createTextEditor({ resource: workingCopy.resource, forceFile: true });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/fileEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/fileEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { IFileEditorInput, Verbosity, GroupIdentifier, IMoveResult, EditorInputCapabilities, IEditorDescriptor, IEditorPane, IUntypedEditorInput, DEFAULT_EDITOR_ASSOCIATION, IUntypedFileEditorInput, findViewStateForEditor, isResourceEditorInput, IFileEditorInputOptions } from '../../../../common/editor.js';
import { EditorInput, IUntypedEditorOptions } from '../../../../common/editor/editorInput.js';
import { AbstractTextResourceEditorInput } from '../../../../common/editor/textResourceEditorInput.js';
import { ITextResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ITextFileService, TextFileEditorModelState, TextFileResolveReason, TextFileOperationError, TextFileOperationResult, ITextFileEditorModel, EncodingMode } from '../../../../services/textfile/common/textfiles.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IReference, dispose, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { FILE_EDITOR_INPUT_ID, TEXT_FILE_EDITOR_ID, BINARY_FILE_EDITOR_ID } from '../../common/files.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { Event } from '../../../../../base/common/event.js';
import { Schemas } from '../../../../../base/common/network.js';
import { createTextBufferFactory } from '../../../../../editor/common/model/textModel.js';
import { IPathService } from '../../../../services/path/common/pathService.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { ICustomEditorLabelService } from '../../../../services/editor/common/customEditorLabelService.js';

const enum ForceOpenAs {
	None,
	Text,
	Binary
}

/**
 * A file editor input is the input type for the file editor of file system resources.
 */
export class FileEditorInput extends AbstractTextResourceEditorInput implements IFileEditorInput {

	override get typeId(): string {
		return FILE_EDITOR_INPUT_ID;
	}

	override get editorId(): string | undefined {
		return DEFAULT_EDITOR_ASSOCIATION.id;
	}

	override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.CanSplitInGroup;

		if (this.model) {
			if (this.model.isReadonly()) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		} else {
			if (this.fileService.hasProvider(this.resource)) {
				if (this.filesConfigurationService.isReadonly(this.resource)) {
					capabilities |= EditorInputCapabilities.Readonly;
				}
			} else {
				capabilities |= EditorInputCapabilities.Untitled;
			}
		}

		if (!(capabilities & EditorInputCapabilities.Readonly)) {
			capabilities |= EditorInputCapabilities.CanDropIntoEditor;
		}

		return capabilities;
	}

	private preferredName: string | undefined;
	private preferredDescription: string | undefined;
	private preferredEncoding: string | undefined;
	private preferredLanguageId: string | undefined;
	private preferredContents: string | undefined;

	private forceOpenAs: ForceOpenAs = ForceOpenAs.None;

	private model: ITextFileEditorModel | undefined = undefined;
	private cachedTextFileModelReference: IReference<ITextFileEditorModel> | undefined = undefined;

	private readonly modelListeners = this._register(new DisposableStore());

	constructor(
		resource: URI,
		preferredResource: URI | undefined,
		preferredName: string | undefined,
		preferredDescription: string | undefined,
		preferredEncoding: string | undefined,
		preferredLanguageId: string | undefined,
		preferredContents: string | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextFileService textFileService: ITextFileService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@IEditorService editorService: IEditorService,
		@IPathService private readonly pathService: IPathService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
	) {
		super(resource, preferredResource, editorService, textFileService, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);

		this.model = this.textFileService.files.get(resource);

		if (preferredName) {
			this.setPreferredName(preferredName);
		}

		if (preferredDescription) {
			this.setPreferredDescription(preferredDescription);
		}

		if (preferredEncoding) {
			this.setPreferredEncoding(preferredEncoding);
		}

		if (preferredLanguageId) {
			this.setPreferredLanguageId(preferredLanguageId);
		}

		if (typeof preferredContents === 'string') {
			this.setPreferredContents(preferredContents);
		}

		// Attach to model that matches our resource once created
		this._register(this.textFileService.files.onDidCreate(model => this.onDidCreateTextFileModel(model)));

		// If a file model already exists, make sure to wire it in
		if (this.model) {
			this.registerModelListeners(this.model);
		}
	}

	private onDidCreateTextFileModel(model: ITextFileEditorModel): void {

		// Once the text file model is created, we keep it inside
		// the input to be able to implement some methods properly
		if (isEqual(model.resource, this.resource)) {
			this.model = model;

			this.registerModelListeners(model);
		}
	}

	private registerModelListeners(model: ITextFileEditorModel): void {

		// Clear any old
		this.modelListeners.clear();

		// re-emit some events from the model
		this.modelListeners.add(model.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
		this.modelListeners.add(model.onDidChangeReadonly(() => this._onDidChangeCapabilities.fire()));

		// important: treat save errors as potential dirty change because
		// a file that is in save conflict or error will report dirty even
		// if auto save is turned on.
		this.modelListeners.add(model.onDidSaveError(() => this._onDidChangeDirty.fire()));

		// remove model association once it gets disposed
		this.modelListeners.add(Event.once(model.onWillDispose)(() => {
			this.modelListeners.clear();
			this.model = undefined;
		}));
	}

	override getName(): string {
		return this.preferredName || super.getName();
	}

	setPreferredName(name: string): void {
		if (!this.allowLabelOverride()) {
			return; // block for specific schemes we consider to be owning
		}

		if (this.preferredName !== name) {
			this.preferredName = name;

			this._onDidChangeLabel.fire();
		}
	}

	private allowLabelOverride(): boolean {
		return this.resource.scheme !== this.pathService.defaultUriScheme &&
			this.resource.scheme !== Schemas.vscodeUserData &&
			this.resource.scheme !== Schemas.file &&
			this.resource.scheme !== Schemas.vscodeRemote;
	}

	getPreferredName(): string | undefined {
		return this.preferredName;
	}

	override isReadonly(): boolean | IMarkdownString {
		return this.model ? this.model.isReadonly() : this.filesConfigurationService.isReadonly(this.resource);
	}

	override getDescription(verbosity?: Verbosity): string | undefined {
		return this.preferredDescription || super.getDescription(verbosity);
	}

	setPreferredDescription(description: string): void {
		if (!this.allowLabelOverride()) {
			return; // block for specific schemes we consider to be owning
		}

		if (this.preferredDescription !== description) {
			this.preferredDescription = description;

			this._onDidChangeLabel.fire();
		}
	}

	getPreferredDescription(): string | undefined {
		return this.preferredDescription;
	}

	override getTitle(verbosity?: Verbosity): string {
		let title = super.getTitle(verbosity);

		const preferredTitle = this.getPreferredTitle();
		if (preferredTitle) {
			title = `${preferredTitle} (${title})`;
		}

		return title;
	}

	protected getPreferredTitle(): string | undefined {
		if (this.preferredName && this.preferredDescription) {
			return `${this.preferredName} ${this.preferredDescription}`;
		}

		if (this.preferredName || this.preferredDescription) {
			return this.preferredName ?? this.preferredDescription;
		}

		return undefined;
	}

	getEncoding(): string | undefined {
		if (this.model) {
			return this.model.getEncoding();
		}

		return this.preferredEncoding;
	}

	getPreferredEncoding(): string | undefined {
		return this.preferredEncoding;
	}

	async setEncoding(encoding: string, mode: EncodingMode): Promise<void> {
		this.setPreferredEncoding(encoding);

		return this.model?.setEncoding(encoding, mode);
	}

	setPreferredEncoding(encoding: string): void {
		this.preferredEncoding = encoding;

		// encoding is a good hint to open the file as text
		this.setForceOpenAsText();
	}

	getLanguageId(): string | undefined {
		if (this.model) {
			return this.model.getLanguageId();
		}

		return this.preferredLanguageId;
	}

	getPreferredLanguageId(): string | undefined {
		return this.preferredLanguageId;
	}

	setLanguageId(languageId: string, source?: string): void {
		this.setPreferredLanguageId(languageId);

		this.model?.setLanguageId(languageId, source);
	}

	setPreferredLanguageId(languageId: string): void {
		this.preferredLanguageId = languageId;

		// languages are a good hint to open the file as text
		this.setForceOpenAsText();
	}

	setPreferredContents(contents: string): void {
		this.preferredContents = contents;

		// contents is a good hint to open the file as text
		this.setForceOpenAsText();
	}

	setForceOpenAsText(): void {
		this.forceOpenAs = ForceOpenAs.Text;
	}

	setForceOpenAsBinary(): void {
		this.forceOpenAs = ForceOpenAs.Binary;
	}

	override isDirty(): boolean {
		return !!(this.model?.isDirty());
	}

	override isSaving(): boolean {
		if (this.model?.hasState(TextFileEditorModelState.SAVED) || this.model?.hasState(TextFileEditorModelState.CONFLICT) || this.model?.hasState(TextFileEditorModelState.ERROR)) {
			return false; // require the model to be dirty and not in conflict or error state
		}

		// Note: currently not checking for ModelState.PENDING_SAVE for a reason
		// because we currently miss an event for this state change on editors
		// and it could result in bad UX where an editor can be closed even though
		// it shows up as dirty and has not finished saving yet.

		if (this.filesConfigurationService.hasShortAutoSaveDelay(this)) {
			return true; // a short auto save is configured, treat this as being saved
		}

		return super.isSaving();
	}

	override prefersEditorPane<T extends IEditorDescriptor<IEditorPane>>(editorPanes: T[]): T | undefined {
		if (this.forceOpenAs === ForceOpenAs.Binary) {
			return editorPanes.find(editorPane => editorPane.typeId === BINARY_FILE_EDITOR_ID);
		}

		return editorPanes.find(editorPane => editorPane.typeId === TEXT_FILE_EDITOR_ID);
	}

	override resolve(options?: IFileEditorInputOptions): Promise<ITextFileEditorModel | BinaryEditorModel> {

		// Resolve as binary
		if (this.forceOpenAs === ForceOpenAs.Binary) {
			return this.doResolveAsBinary();
		}

		// Resolve as text
		return this.doResolveAsText(options);
	}

	private async doResolveAsText(options?: IFileEditorInputOptions): Promise<ITextFileEditorModel | BinaryEditorModel> {
		try {

			// Unset preferred contents after having applied it once
			// to prevent this property to stick. We still want future
			// `resolve` calls to fetch the contents from disk.
			const preferredContents = this.preferredContents;
			this.preferredContents = undefined;

			// Resolve resource via text file service and only allow
			// to open binary files if we are instructed so
			await this.textFileService.files.resolve(this.resource, {
				languageId: this.preferredLanguageId,
				encoding: this.preferredEncoding,
				contents: typeof preferredContents === 'string' ? createTextBufferFactory(preferredContents) : undefined,
				reload: { async: true }, // trigger a reload of the model if it exists already but do not wait to show the model
				allowBinary: this.forceOpenAs === ForceOpenAs.Text,
				reason: TextFileResolveReason.EDITOR,
				limits: this.ensureLimits(options)
			});

			// This is a bit ugly, because we first resolve the model and then resolve a model reference. the reason being that binary
			// or very large files do not resolve to a text file model but should be opened as binary files without text. First calling into
			// resolve() ensures we are not creating model references for these kind of resources.
			// In addition we have a bit of payload to take into account (encoding, reload) that the text resolver does not handle yet.
			if (!this.cachedTextFileModelReference) {
				this.cachedTextFileModelReference = await this.textModelService.createModelReference(this.resource) as IReference<ITextFileEditorModel>;
			}

			const model = this.cachedTextFileModelReference.object;

			// It is possible that this input was disposed before the model
			// finished resolving. As such, we need to make sure to dispose
			// the model reference to not leak it.
			if (this.isDisposed()) {
				this.disposeModelReference();
			}

			return model;
		} catch (error) {

			// Handle binary files with binary model
			if ((<TextFileOperationError>error).textFileOperationResult === TextFileOperationResult.FILE_IS_BINARY) {
				return this.doResolveAsBinary();
			}

			// Bubble any other error up
			throw error;
		}
	}

	private async doResolveAsBinary(): Promise<BinaryEditorModel> {
		const model = this.instantiationService.createInstance(BinaryEditorModel, this.preferredResource, this.getName());
		await model.resolve();

		return model;
	}

	isResolved(): boolean {
		return !!this.model;
	}

	override async rename(group: GroupIdentifier, target: URI): Promise<IMoveResult> {
		return {
			editor: {
				resource: target,
				encoding: this.getEncoding(),
				options: {
					viewState: findViewStateForEditor(this, group, this.editorService)
				}
			}
		};
	}

	override toUntyped(options?: IUntypedEditorOptions): ITextResourceEditorInput {
		const untypedInput: IUntypedFileEditorInput = {
			resource: this.preferredResource,
			forceFile: true,
			options: {
				override: this.editorId
			}
		};

		if (typeof options?.preserveViewState === 'number') {
			untypedInput.encoding = this.getEncoding();
			untypedInput.languageId = this.getLanguageId();
			untypedInput.contents = (() => {
				const model = this.textFileService.files.get(this.resource);
				if (model?.isDirty() && !model.textEditorModel.isTooLargeForHeapOperation()) {
					return model.textEditorModel.getValue(); // only if dirty and not too large
				}

				return undefined;
			})();

			untypedInput.options = {
				...untypedInput.options,
				viewState: findViewStateForEditor(this, options.preserveViewState, this.editorService)
			};
		}

		return untypedInput;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof FileEditorInput) {
			return isEqual(otherInput.resource, this.resource);
		}

		if (isResourceEditorInput(otherInput)) {
			return super.matches(otherInput);
		}

		return false;
	}

	override dispose(): void {

		// Model
		this.model = undefined;

		// Model reference
		this.disposeModelReference();

		super.dispose();
	}

	private disposeModelReference(): void {
		dispose(this.cachedTextFileModelReference);
		this.cachedTextFileModelReference = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/textFileEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/textFileEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { mark } from '../../../../../base/common/performance.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';
import { IPathService } from '../../../../services/path/common/pathService.js';
import { IAction, toAction } from '../../../../../base/common/actions.js';
import { VIEWLET_ID, TEXT_FILE_EDITOR_ID, BINARY_TEXT_FILE_MODE } from '../../common/files.js';
import { ITextFileService, TextFileOperationError, TextFileOperationResult } from '../../../../services/textfile/common/textfiles.js';
import { AbstractTextCodeEditor } from '../../../../browser/parts/editor/textCodeEditor.js';
import { IEditorOpenContext, isTextEditorViewState, DEFAULT_EDITOR_ASSOCIATION, createEditorOpenError, IFileEditorInputOptions, createTooLargeFileError } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { applyTextEditorOptions } from '../../../../common/editor/editorOptions.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { FileEditorInput } from './fileEditorInput.js';
import { FileOperationError, FileOperationResult, FileChangesEvent, IFileService, FileOperationEvent, FileOperation, ByteSize, TooLargeFileOperationError } from '../../../../../platform/files/common/files.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ICodeEditorViewState, ScrollType } from '../../../../../editor/common/editorCommon.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { EditorActivation, ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExplorerService } from '../files.js';
import { IPaneCompositePartService } from '../../../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../../common/views.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';

/**
 * An implementation of editor for file system resources.
 */
export class TextFileEditor extends AbstractTextCodeEditor<ICodeEditorViewState> {

	static readonly ID = TEXT_FILE_EDITOR_ID;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IFileService fileService: IFileService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IEditorService editorService: IEditorService,
		@IThemeService themeService: IThemeService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IPathService private readonly pathService: IPathService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IPreferencesService protected readonly preferencesService: IPreferencesService,
		@IHostService private readonly hostService: IHostService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService
	) {
		super(TextFileEditor.ID, group, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorService, editorGroupService, fileService);

		// Clear view state for deleted files
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));

		// Move view state for moved files
		this._register(this.fileService.onDidRunOperation(e => this.onDidRunOperation(e)));
	}

	private onDidFilesChange(e: FileChangesEvent): void {
		for (const resource of e.rawDeleted) {
			this.clearEditorViewState(resource);
		}
	}

	private onDidRunOperation(e: FileOperationEvent): void {
		if (e.operation === FileOperation.MOVE && e.target) {
			this.moveEditorViewState(e.resource, e.target.resource, this.uriIdentityService.extUri);
		}
	}

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return localize('textFileEditor', "Text File Editor");
	}

	override get input(): FileEditorInput | undefined {
		return this._input as FileEditorInput;
	}

	override async setInput(input: FileEditorInput, options: IFileEditorInputOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		mark('code/willSetInputToTextFileEditor');

		// Set input and resolve
		await super.setInput(input, options, context, token);
		try {
			const resolvedModel = await input.resolve(options);

			// Check for cancellation
			if (token.isCancellationRequested) {
				return;
			}

			// There is a special case where the text editor has to handle binary
			// file editor input: if a binary file has been resolved and cached
			// before, it maybe an actual instance of BinaryEditorModel. In this
			// case our text editor has to open this model using the binary editor.
			// We return early in this case.

			if (resolvedModel instanceof BinaryEditorModel) {
				return this.openAsBinary(input, options);
			}

			const textFileModel = resolvedModel;

			// Editor
			const control = assertReturnsDefined(this.editorControl);
			control.setModel(textFileModel.textEditorModel);

			// Restore view state (unless provided by options)
			if (!isTextEditorViewState(options?.viewState)) {
				const editorViewState = this.loadEditorViewState(input, context);
				if (editorViewState) {
					if (options?.selection) {
						editorViewState.cursorState = []; // prevent duplicate selections via options
					}

					control.restoreViewState(editorViewState);
				}
			}

			// Apply options to editor if any
			if (options) {
				applyTextEditorOptions(options, control, ScrollType.Immediate);
			}

			// Since the resolved model provides information about being readonly
			// or not, we apply it here to the editor even though the editor input
			// was already asked for being readonly or not. The rationale is that
			// a resolved model might have more specific information about being
			// readonly or not that the input did not have.
			control.updateOptions(this.getReadonlyConfiguration(textFileModel.isReadonly()));

			if (control.handleInitialized) {
				control.handleInitialized();
			}
		} catch (error) {
			await this.handleSetInputError(error, input, options);
		}

		mark('code/didSetInputToTextFileEditor');
	}

	protected async handleSetInputError(error: Error, input: FileEditorInput, options: ITextEditorOptions | undefined): Promise<void> {

		// Handle case where content appears to be binary
		if ((<TextFileOperationError>error).textFileOperationResult === TextFileOperationResult.FILE_IS_BINARY) {
			return this.openAsBinary(input, options);
		}

		// Handle case where we were asked to open a folder
		if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_IS_DIRECTORY) {
			const actions: IAction[] = [];

			actions.push(toAction({
				id: 'workbench.files.action.openFolder', label: localize('openFolder', "Open Folder"), run: async () => {
					return this.hostService.openWindow([{ folderUri: input.resource }], { forceNewWindow: true });
				}
			}));

			if (this.contextService.isInsideWorkspace(input.preferredResource)) {
				actions.push(toAction({
					id: 'workbench.files.action.reveal', label: localize('reveal', "Reveal Folder"), run: async () => {
						await this.paneCompositeService.openPaneComposite(VIEWLET_ID, ViewContainerLocation.Sidebar, true);

						return this.explorerService.select(input.preferredResource, true);
					}
				}));
			}

			throw createEditorOpenError(localize('fileIsDirectory', "The file is not displayed in the text editor because it is a directory."), actions, { forceMessage: true });
		}

		// Handle case where a file is too large to open without confirmation
		if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_TOO_LARGE) {
			let message: string;
			if (error instanceof TooLargeFileOperationError) {
				message = localize('fileTooLargeForHeapErrorWithSize', "The file is not displayed in the text editor because it is very large ({0}).", ByteSize.formatSize(error.size));
			} else {
				message = localize('fileTooLargeForHeapErrorWithoutSize', "The file is not displayed in the text editor because it is very large.");
			}

			throw createTooLargeFileError(this.group, input, options, message, this.preferencesService);
		}

		// Offer to create a file from the error if we have a file not found and the name is valid and not readonly
		if (
			(<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND &&
			!this.filesConfigurationService.isReadonly(input.preferredResource) &&
			await this.pathService.hasValidBasename(input.preferredResource)
		) {
			const fileNotFoundError = createEditorOpenError(new FileOperationError(localize('unavailableResourceErrorEditorText', "The editor could not be opened because the file was not found."), FileOperationResult.FILE_NOT_FOUND), [
				toAction({
					id: 'workbench.files.action.createMissingFile', label: localize('createFile', "Create File"), run: async () => {
						await this.textFileService.create([{ resource: input.preferredResource }]);

						return this.editorService.openEditor({
							resource: input.preferredResource,
							options: {
								pinned: true // new file gets pinned by default
							}
						});
					}
				})
			], {

				// Support the flow of directly pressing `Enter` on the dialog to
				// create the file on the go. This is nice when for example following
				// a link to a file that does not exist to scaffold it quickly.

				allowDialog: true
			});

			throw fileNotFoundError;
		}

		// Otherwise make sure the error bubbles up
		throw error;
	}

	private openAsBinary(input: FileEditorInput, options: ITextEditorOptions | undefined): void {
		const defaultBinaryEditor = this.configurationService.getValue<string | undefined>('workbench.editor.defaultBinaryEditor');

		const editorOptions = {
			...options,
			// Make sure to not steal away the currently active group
			// because we are triggering another openEditor() call
			// and do not control the initial intent that resulted
			// in us now opening as binary.
			activation: EditorActivation.PRESERVE
		};

		// Check configuration and determine whether we open the binary
		// file input in a different editor or going through the same
		// editor.
		// Going through the same editor is debt, and a better solution
		// would be to introduce a real editor for the binary case
		// and avoid enforcing binary or text on the file editor input.

		if (defaultBinaryEditor && defaultBinaryEditor !== '' && defaultBinaryEditor !== DEFAULT_EDITOR_ASSOCIATION.id) {
			this.doOpenAsBinaryInDifferentEditor(this.group, defaultBinaryEditor, input, editorOptions);
		} else {
			this.doOpenAsBinaryInSameEditor(this.group, defaultBinaryEditor, input, editorOptions);
		}
	}

	private doOpenAsBinaryInDifferentEditor(group: IEditorGroup, editorId: string | undefined, editor: FileEditorInput, editorOptions: ITextEditorOptions): void {
		this.editorService.replaceEditors([{
			editor,
			replacement: { resource: editor.resource, options: { ...editorOptions, override: editorId } }
		}], group);
	}

	private doOpenAsBinaryInSameEditor(group: IEditorGroup, editorId: string | undefined, editor: FileEditorInput, editorOptions: ITextEditorOptions): void {

		// Open binary as text
		if (editorId === DEFAULT_EDITOR_ASSOCIATION.id) {
			editor.setForceOpenAsText();
			editor.setPreferredLanguageId(BINARY_TEXT_FILE_MODE); // https://github.com/microsoft/vscode/issues/131076

			editorOptions = { ...editorOptions, forceReload: true }; // Same pane and same input, must force reload to clear cached state
		}

		// Open as binary
		else {
			editor.setForceOpenAsBinary();
		}

		group.openEditor(editor, editorOptions);
	}

	override clearInput(): void {
		super.clearInput();

		// Clear Model
		this.editorControl?.setModel(null);
	}

	protected override createEditorControl(parent: HTMLElement, initialOptions: ICodeEditorOptions): void {
		mark('code/willCreateTextFileEditorControl');

		super.createEditorControl(parent, initialOptions);

		mark('code/didCreateTextFileEditorControl');
	}

	protected override tracksEditorViewState(input: EditorInput): boolean {
		return input instanceof FileEditorInput;
	}

	protected override tracksDisposedEditorViewState(): boolean {
		return true; // track view state even for disposed editors
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/textFileEditorTracker.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/textFileEditorTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextFileService, TextFileEditorModelState } from '../../../../services/textfile/common/textfiles.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { distinct, coalesce } from '../../../../../base/common/arrays.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { RunOnceWorker } from '../../../../../base/common/async.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { FILE_EDITOR_INPUT_ID } from '../../common/files.js';
import { Schemas } from '../../../../../base/common/network.js';
import { UntitledTextEditorInput } from '../../../../services/untitled/common/untitledTextEditorInput.js';
import { IWorkingCopyEditorService } from '../../../../services/workingCopy/common/workingCopyEditorService.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../../common/editor.js';

export class TextFileEditorTracker extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.textFileEditorTracker';

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IHostService private readonly hostService: IHostService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyEditorService private readonly workingCopyEditorService: IWorkingCopyEditorService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Ensure dirty text file and untitled models are always opened as editors
		this._register(this.textFileService.files.onDidChangeDirty(model => this.ensureDirtyFilesAreOpenedWorker.work(model.resource)));
		this._register(this.textFileService.files.onDidSaveError(model => this.ensureDirtyFilesAreOpenedWorker.work(model.resource)));
		this._register(this.textFileService.untitled.onDidChangeDirty(model => this.ensureDirtyFilesAreOpenedWorker.work(model.resource)));

		// Update visible text file editors when focus is gained
		this._register(this.hostService.onDidChangeFocus(hasFocus => hasFocus ? this.reloadVisibleTextFileEditors() : undefined));

		// Lifecycle
		this._register(this.lifecycleService.onDidShutdown(() => this.dispose()));
	}

	//#region Text File: Ensure every dirty text and untitled file is opened in an editor

	private readonly ensureDirtyFilesAreOpenedWorker = this._register(new RunOnceWorker<URI>(units => this.ensureDirtyTextFilesAreOpened(units), this.getDirtyTextFileTrackerDelay()));

	protected getDirtyTextFileTrackerDelay(): number {
		return 800; // encapsulated in a method for tests to override
	}

	private ensureDirtyTextFilesAreOpened(resources: URI[]): void {
		this.doEnsureDirtyTextFilesAreOpened(distinct(resources.filter(resource => {
			if (!this.textFileService.isDirty(resource)) {
				return false; // resource must be dirty
			}

			const fileModel = this.textFileService.files.get(resource);
			if (fileModel?.hasState(TextFileEditorModelState.PENDING_SAVE)) {
				return false; // resource must not be pending to save
			}

			if (resource.scheme !== Schemas.untitled && !fileModel?.hasState(TextFileEditorModelState.ERROR) && this.filesConfigurationService.hasShortAutoSaveDelay(resource)) {
				// leave models auto saved after short delay unless
				// the save resulted in an error and not for untitled
				// that are not auto-saved anyway
				return false;
			}

			if (this.editorService.isOpened({ resource, typeId: resource.scheme === Schemas.untitled ? UntitledTextEditorInput.ID : FILE_EDITOR_INPUT_ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id })) {
				return false; // model must not be opened already as file (fast check via editor type)
			}

			const model = fileModel ?? this.textFileService.untitled.get(resource);
			if (model && this.workingCopyEditorService.findEditor(model)) {
				return false; // model must not be opened already as file (slower check via working copy)
			}

			return true;
		}), resource => resource.toString()));
	}

	private doEnsureDirtyTextFilesAreOpened(resources: URI[]): void {
		if (!resources.length) {
			return;
		}

		this.editorService.openEditors(resources.map(resource => ({
			resource,
			options: { inactive: true, pinned: true, preserveFocus: true }
		})));
	}

	//#endregion

	//#region Window Focus Change: Update visible code editors when focus is gained that have a known text file model

	private reloadVisibleTextFileEditors(): void {
		// the window got focus and we use this as a hint that files might have been changed outside
		// of this window. since file events can be unreliable, we queue a load for models that
		// are visible in any editor. since this is a fast operation in the case nothing has changed,
		// we tolerate the additional work.
		distinct(
			coalesce(this.codeEditorService.listCodeEditors()
				.map(codeEditor => {
					const resource = codeEditor.getModel()?.uri;
					if (!resource) {
						return undefined;
					}

					const model = this.textFileService.files.get(resource);
					if (!model || model.isDirty() || !model.isResolved()) {
						return undefined;
					}

					return model;
				})),
			model => model.resource.toString()
		).forEach(model => this.textFileService.files.resolve(model.resource, { reload: { async: true } }));
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/editors/textFileSaveErrorHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/editors/textFileSaveErrorHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { basename, isEqual } from '../../../../../base/common/resources.js';
import { Action } from '../../../../../base/common/actions.js';
import { URI } from '../../../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IWriteFileOptions } from '../../../../../platform/files/common/files.js';
import { ITextFileService, ISaveErrorHandler, ITextFileEditorModel, ITextFileSaveAsOptions, ITextFileSaveOptions } from '../../../../services/textfile/common/textfiles.js';
import { ServicesAccessor, IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IDisposable, dispose, Disposable } from '../../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { TextFileContentProvider } from '../../common/files.js';
import { FileEditorInput } from './fileEditorInput.js';
import { SAVE_FILE_AS_LABEL } from '../fileConstants.js';
import { INotificationService, INotificationHandle, INotificationActions, Severity } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { Event } from '../../../../../base/common/event.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IEditorIdentifier, SaveReason, SideBySideEditor } from '../../../../common/editor.js';
import { hash } from '../../../../../base/common/hash.js';

export const CONFLICT_RESOLUTION_CONTEXT = 'saveConflictResolutionContext';
export const CONFLICT_RESOLUTION_SCHEME = 'conflictResolution';

const LEARN_MORE_DIRTY_WRITE_IGNORE_KEY = 'learnMoreDirtyWriteError';

const conflictEditorHelp = localize('userGuide', "Use the actions in the editor tool bar to either undo your changes or overwrite the content of the file with your changes.");

// A handler for text file save error happening with conflict resolution actions
export class TextFileSaveErrorHandler extends Disposable implements ISaveErrorHandler, IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.textFileSaveErrorHandler';

	private readonly messages = new ResourceMap<INotificationHandle>();
	private readonly conflictResolutionContext: IContextKey<boolean>;
	private activeConflictResolutionResource: URI | undefined = undefined;

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IEditorService private readonly editorService: IEditorService,
		@ITextModelService textModelService: ITextModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.conflictResolutionContext = new RawContextKey<boolean>(CONFLICT_RESOLUTION_CONTEXT, false, true).bindTo(contextKeyService);

		const provider = this._register(instantiationService.createInstance(TextFileContentProvider));
		this._register(textModelService.registerTextModelContentProvider(CONFLICT_RESOLUTION_SCHEME, provider));

		// Set as save error handler to service for text files
		this.textFileService.files.saveErrorHandler = this;

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.textFileService.files.onDidSave(e => this.onFileSavedOrReverted(e.model.resource)));
		this._register(this.textFileService.files.onDidRevert(model => this.onFileSavedOrReverted(model.resource)));
		this._register(this.editorService.onDidActiveEditorChange(() => this.onActiveEditorChanged()));
	}

	private onActiveEditorChanged(): void {
		let isActiveEditorSaveConflictResolution = false;
		let activeConflictResolutionResource: URI | undefined;

		const activeInput = this.editorService.activeEditor;
		if (activeInput instanceof DiffEditorInput) {
			const resource = activeInput.original.resource;
			if (resource?.scheme === CONFLICT_RESOLUTION_SCHEME) {
				isActiveEditorSaveConflictResolution = true;
				activeConflictResolutionResource = activeInput.modified.resource;
			}
		}

		this.conflictResolutionContext.set(isActiveEditorSaveConflictResolution);
		this.activeConflictResolutionResource = activeConflictResolutionResource;
	}

	private onFileSavedOrReverted(resource: URI): void {
		const messageHandle = this.messages.get(resource);
		if (messageHandle) {
			messageHandle.close();
			this.messages.delete(resource);
		}
	}

	onSaveError(error: unknown, model: ITextFileEditorModel, options: ITextFileSaveOptions): void {
		const fileOperationError = error as FileOperationError;
		const resource = model.resource;

		let message: string;
		const primaryActions: Action[] = [];
		const secondaryActions: Action[] = [];

		// Dirty write prevention
		if (fileOperationError.fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE) {

			// If the user tried to save from the opened conflict editor, show its message again
			if (this.activeConflictResolutionResource && isEqual(this.activeConflictResolutionResource, model.resource)) {
				if (this.storageService.getBoolean(LEARN_MORE_DIRTY_WRITE_IGNORE_KEY, StorageScope.APPLICATION)) {
					return; // return if this message is ignored
				}

				message = conflictEditorHelp;

				primaryActions.push(this.instantiationService.createInstance(ResolveConflictLearnMoreAction));
				secondaryActions.push(this.instantiationService.createInstance(DoNotShowResolveConflictLearnMoreAction));
			}

			// Otherwise show the message that will lead the user into the save conflict editor.
			else {
				message = localize('staleSaveError', "Failed to save '{0}': The content of the file is newer. Please compare your version with the file contents or overwrite the content of the file with your changes.", basename(resource));

				primaryActions.push(this.instantiationService.createInstance(ResolveSaveConflictAction, model));
				primaryActions.push(this.instantiationService.createInstance(SaveModelIgnoreModifiedSinceAction, model, options));

				secondaryActions.push(this.instantiationService.createInstance(ConfigureSaveConflictAction));
			}
		}

		// Any other save error
		else {
			const isWriteLocked = fileOperationError.fileOperationResult === FileOperationResult.FILE_WRITE_LOCKED;
			const triedToUnlock = isWriteLocked && (fileOperationError.options as IWriteFileOptions | undefined)?.unlock;
			const isPermissionDenied = fileOperationError.fileOperationResult === FileOperationResult.FILE_PERMISSION_DENIED;
			const canSaveElevated = resource.scheme === Schemas.file; // currently only supported for local schemes (https://github.com/microsoft/vscode/issues/48659)

			// Save Elevated
			if (canSaveElevated && (isPermissionDenied || triedToUnlock)) {
				primaryActions.push(this.instantiationService.createInstance(SaveModelElevatedAction, model, options, !!triedToUnlock));
			}

			// Unlock
			else if (isWriteLocked) {
				primaryActions.push(this.instantiationService.createInstance(UnlockModelAction, model, options));
			}

			// Retry
			else {
				primaryActions.push(this.instantiationService.createInstance(RetrySaveModelAction, model, options));
			}

			// Save As
			primaryActions.push(this.instantiationService.createInstance(SaveModelAsAction, model));

			// Revert
			primaryActions.push(this.instantiationService.createInstance(RevertModelAction, model));

			// Message
			if (isWriteLocked) {
				if (triedToUnlock && canSaveElevated) {
					message = isWindows ? localize('readonlySaveErrorAdmin', "Failed to save '{0}': File is read-only. Select 'Overwrite as Admin' to retry as administrator.", basename(resource)) : localize('readonlySaveErrorSudo', "Failed to save '{0}': File is read-only. Select 'Overwrite as Sudo' to retry as superuser.", basename(resource));
				} else {
					message = localize('readonlySaveError', "Failed to save '{0}': File is read-only. Select 'Overwrite' to attempt to make it writeable.", basename(resource));
				}
			} else if (canSaveElevated && isPermissionDenied) {
				message = isWindows ? localize('permissionDeniedSaveError', "Failed to save '{0}': Insufficient permissions. Select 'Retry as Admin' to retry as administrator.", basename(resource)) : localize('permissionDeniedSaveErrorSudo', "Failed to save '{0}': Insufficient permissions. Select 'Retry as Sudo' to retry as superuser.", basename(resource));
			} else {
				message = localize({ key: 'genericSaveError', comment: ['{0} is the resource that failed to save and {1} the error message'] }, "Failed to save '{0}': {1}", basename(resource), toErrorMessage(error, false));
			}
		}

		// Show message and keep function to hide in case the file gets saved/reverted
		const actions: INotificationActions = { primary: primaryActions, secondary: secondaryActions };
		const handle = this.notificationService.notify({
			id: `${hash(model.resource.toString())}`, // unique per model (https://github.com/microsoft/vscode/issues/121539)
			severity: Severity.Error,
			message,
			actions
		});
		Event.once(handle.onDidClose)(() => { dispose(primaryActions); dispose(secondaryActions); });
		this.messages.set(model.resource, handle);
	}

	override dispose(): void {
		super.dispose();

		this.messages.clear();
	}
}

const pendingResolveSaveConflictMessages: INotificationHandle[] = [];
function clearPendingResolveSaveConflictMessages(): void {
	while (pendingResolveSaveConflictMessages.length > 0) {
		const item = pendingResolveSaveConflictMessages.pop();
		item?.close();
	}
}

class ResolveConflictLearnMoreAction extends Action {

	constructor(
		@IOpenerService private readonly openerService: IOpenerService
	) {
		super('workbench.files.action.resolveConflictLearnMore', localize('learnMore', "Learn More"));
	}

	override async run(): Promise<void> {
		await this.openerService.open(URI.parse('https://go.microsoft.com/fwlink/?linkid=868264'));
	}
}

class DoNotShowResolveConflictLearnMoreAction extends Action {

	constructor(
		@IStorageService private readonly storageService: IStorageService
	) {
		super('workbench.files.action.resolveConflictLearnMoreDoNotShowAgain', localize('dontShowAgain', "Don't Show Again"));
	}

	override async run(notification: IDisposable): Promise<void> {

		// Remember this as application state
		this.storageService.store(LEARN_MORE_DIRTY_WRITE_IGNORE_KEY, true, StorageScope.APPLICATION, StorageTarget.USER);

		// Hide notification
		notification.dispose();
	}
}

class ResolveSaveConflictAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		@IEditorService private readonly editorService: IEditorService,
		@INotificationService private readonly notificationService: INotificationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IProductService private readonly productService: IProductService
	) {
		super('workbench.files.action.resolveConflict', localize('compareChanges', "Compare"));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			const resource = this.model.resource;
			const name = basename(resource);
			const editorLabel = localize('saveConflictDiffLabel', "{0} (in file) ↔ {1} (in {2}) - Resolve save conflict", name, name, this.productService.nameLong);

			await TextFileContentProvider.open(resource, CONFLICT_RESOLUTION_SCHEME, editorLabel, this.editorService, { pinned: true });

			// Show additional help how to resolve the save conflict
			const actions = { primary: [this.instantiationService.createInstance(ResolveConflictLearnMoreAction)] };
			const handle = this.notificationService.notify({
				id: `${hash(resource.toString())}`, // unique per model
				severity: Severity.Info,
				message: conflictEditorHelp,
				actions,
				neverShowAgain: { id: LEARN_MORE_DIRTY_WRITE_IGNORE_KEY, isSecondary: true }
			});
			Event.once(handle.onDidClose)(() => dispose(actions.primary));
			pendingResolveSaveConflictMessages.push(handle);
		}
	}
}

class SaveModelElevatedAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		private options: ITextFileSaveOptions,
		private triedToUnlock: boolean
	) {
		super('workbench.files.action.saveModelElevated', triedToUnlock ? isWindows ? localize('overwriteElevated', "Overwrite as Admin...") : localize('overwriteElevatedSudo', "Overwrite as Sudo...") : isWindows ? localize('saveElevated', "Retry as Admin...") : localize('saveElevatedSudo', "Retry as Sudo..."));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			await this.model.save({
				...this.options,
				writeElevated: true,
				writeUnlock: this.triedToUnlock,
				reason: SaveReason.EXPLICIT
			});
		}
	}
}

class RetrySaveModelAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		private options: ITextFileSaveOptions
	) {
		super('workbench.files.action.saveModel', localize('retry', "Retry"));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			await this.model.save({ ...this.options, reason: SaveReason.EXPLICIT });
		}
	}
}

class RevertModelAction extends Action {

	constructor(
		private model: ITextFileEditorModel
	) {
		super('workbench.files.action.revertModel', localize('revert', "Revert"));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			await this.model.revert();
		}
	}
}

class SaveModelAsAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		@IEditorService private editorService: IEditorService
	) {
		super('workbench.files.action.saveModelAs', SAVE_FILE_AS_LABEL.value);
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			const editor = this.findEditor();
			if (editor) {
				await this.editorService.save(editor, { saveAs: true, reason: SaveReason.EXPLICIT });
			}
		}
	}

	private findEditor(): IEditorIdentifier | undefined {
		let preferredMatchingEditor: IEditorIdentifier | undefined;

		const editors = this.editorService.findEditors(this.model.resource, { supportSideBySide: SideBySideEditor.PRIMARY });
		for (const identifier of editors) {
			if (identifier.editor instanceof FileEditorInput) {
				// We prefer a `FileEditorInput` for "Save As", but it is possible
				// that a custom editor is leveraging the text file model and as
				// such we need to fallback to any other editor having the resource
				// opened for running the save.
				preferredMatchingEditor = identifier;
				break;
			} else if (!preferredMatchingEditor) {
				preferredMatchingEditor = identifier;
			}
		}

		return preferredMatchingEditor;
	}
}

class UnlockModelAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		private options: ITextFileSaveOptions
	) {
		super('workbench.files.action.unlock', localize('overwrite', "Overwrite"));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			await this.model.save({ ...this.options, writeUnlock: true, reason: SaveReason.EXPLICIT });
		}
	}
}

class SaveModelIgnoreModifiedSinceAction extends Action {

	constructor(
		private model: ITextFileEditorModel,
		private options: ITextFileSaveOptions
	) {
		super('workbench.files.action.saveIgnoreModifiedSince', localize('overwrite', "Overwrite"));
	}

	override async run(): Promise<void> {
		if (!this.model.isDisposed()) {
			await this.model.save({ ...this.options, ignoreModifiedSince: true, reason: SaveReason.EXPLICIT });
		}
	}
}

class ConfigureSaveConflictAction extends Action {

	constructor(
		@IPreferencesService private readonly preferencesService: IPreferencesService
	) {
		super('workbench.files.action.configureSaveConflict', localize('configure', "Configure"));
	}

	override async run(): Promise<void> {
		this.preferencesService.openSettings({ query: 'files.saveConflictResolution' });
	}
}

export const acceptLocalChangesCommand = (accessor: ServicesAccessor, resource: unknown) => {
	return acceptOrRevertLocalChangesCommand(accessor, resource, true);
};

export const revertLocalChangesCommand = (accessor: ServicesAccessor, resource: unknown) => {
	return acceptOrRevertLocalChangesCommand(accessor, resource, false);
};

async function acceptOrRevertLocalChangesCommand(accessor: ServicesAccessor, resource: unknown, accept: boolean) {
	const editorService = accessor.get(IEditorService);

	if (!URI.isUri(resource)) {
		return;
	}

	const editorPane = editorService.activeEditorPane;
	if (!editorPane) {
		return;
	}

	const editor = editorPane.input;
	const group = editorPane.group;

	// Hide any previously shown message about how to use these actions
	clearPendingResolveSaveConflictMessages();

	// Accept or revert
	if (accept) {
		const options: ITextFileSaveAsOptions = { ignoreModifiedSince: true, reason: SaveReason.EXPLICIT };
		await editorService.save({ editor, groupId: group.id }, options);
	} else {
		await editorService.revert({ editor, groupId: group.id });
	}

	// Reopen original editor
	await editorService.openEditor({ resource }, group);

	// Clean up
	return group.closeEditor(editor);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/media/explorerviewlet.css]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/media/explorerviewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* --- Explorer viewlet --- */
.explorer-folders-view,
.explorer-folders-view {
	height: 100%;
}

.explorer-folders-view .explorer-folders-view.highlight .monaco-list .explorer-item:not(.explorer-item-edited),
.explorer-folders-view .explorer-folders-view.highlight .monaco-list .monaco-tl-twistie {
	opacity: 0.3;
}

.explorer-folders-view .explorer-item,
.explorer-folders-view .editor-group {
	height: 22px;
	line-height: 22px;
}

.explorer-folders-view .explorer-item {
	display: flex; /* this helps showing the overflow ellipsis (...) even though we use display:inline-block for the labels */
	flex-wrap: nowrap;
}

.explorer-folders-view .explorer-item > a,
.explorer-folders-view .editor-group {
	text-overflow: ellipsis;
	overflow: hidden;
}

.explorer-folders-view .explorer-item,
.explorer-folders-view .explorer-item .monaco-inputbox {
	flex: 1;
}

.explorer-folders-view .explorer-item.cut {
	opacity: 0.5;
}

.explorer-folders-view .explorer-item.explorer-item-edited .label-name {
	flex: 0; /* do not steal space when label is hidden because we are in edit mode */
}

.explorer-folders-view .explorer-item.nonexistent-root {
	opacity: 0.5;
}

.explorer-folders-view .explorer-item .monaco-inputbox {
	width: 100%;
	line-height: normal;
}

.explorer-folders-view .monaco-list-row .explorer-item .monaco-count-badge {
	margin-left: 5px;
	display: none;
}

.explorer-folders-view .monaco-list-row[aria-expanded="false"] .explorer-item.highlight-badge .monaco-count-badge {
	display: inline-block;
}

.explorer-folders-view .explorer-item .monaco-icon-name-container.multiple > .label-name > .monaco-highlighted-label {
	border-radius: 3px;
}

.explorer-folders-view .explorer-item .monaco-icon-name-container.multiple > .label-name:hover > .monaco-highlighted-label,
.explorer-folders-view .monaco-list .monaco-list-row.focused .explorer-item .monaco-icon-name-container.multiple > .label-name.active > .monaco-highlighted-label {
	text-decoration: underline;
}

.explorer-folders-view .explorer-item .monaco-icon-name-container.multiple > .label-name.drop-target > .monaco-highlighted-label {
	background-color: var(--vscode-list-dropBackground);
}

.explorer-folders-view .explorer-item.align-nest-icon-with-parent-icon {
	margin-left: var(--vscode-explorer-align-offset-margin-left);
}

.monaco-workbench.linux .explorer-folders-view .explorer-item .monaco-inputbox,
.monaco-workbench.mac .explorer-folders-view .explorer-item .monaco-inputbox {
	height: 22px;
}

.monaco-workbench .explorer-folders-view .explorer-item .monaco-inputbox > .ibwrapper > .input {
	padding: 0;
	height: 20px;
}

/* High Contrast Theming */
.monaco-workbench.hc-black .explorer-folders-view .explorer-item,
.monaco-workbench.hc-light .explorer-folders-view .explorer-item {
	line-height: 20px;
}

.monaco-workbench .explorer-folders-view .explorer-item .monaco-inputbox input[type="text"] {
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
	opacity: 1;
}

.monaco-workbench.context-menu-visible .explorer-folders-view.highlight .monaco-list-row {
	outline: none !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/views/emptyView.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/emptyView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { IViewletViewOptions } from '../../../../browser/parts/views/viewsViewlet.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { isTemporaryWorkspace, IWorkspaceContextService, WorkbenchState } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ViewPane } from '../../../../browser/parts/views/viewPane.js';
import { ResourcesDropHandler } from '../../../../browser/dnd.js';
import { listDropOverBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { isWeb } from '../../../../../base/common/platform.js';
import { DragAndDropObserver, getWindow } from '../../../../../base/browser/dom.js';
import { ILocalizedString } from '../../../../../platform/action/common/action.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';

export class EmptyView extends ViewPane {

	static readonly ID: string = 'workbench.explorer.emptyView';
	static readonly NAME: ILocalizedString = nls.localize2('noWorkspace', "No Folder Opened");
	private _disposed: boolean = false;

	constructor(
		options: IViewletViewOptions,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILabelService private labelService: ILabelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this._register(this.contextService.onDidChangeWorkbenchState(() => this.refreshTitle()));
		this._register(this.labelService.onDidChangeFormatters(() => this.refreshTitle()));
	}

	override shouldShowWelcome(): boolean {
		return true;
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._register(new DragAndDropObserver(container, {
			onDrop: e => {
				container.style.backgroundColor = '';
				const dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: !isWeb || isTemporaryWorkspace(this.contextService.getWorkspace()) });
				dropHandler.handleDrop(e, getWindow(container));
			},
			onDragEnter: () => {
				const color = this.themeService.getColorTheme().getColor(listDropOverBackground);
				container.style.backgroundColor = color ? color.toString() : '';
			},
			onDragEnd: () => {
				container.style.backgroundColor = '';
			},
			onDragLeave: () => {
				container.style.backgroundColor = '';
			},
			onDragOver: e => {
				if (e.dataTransfer) {
					e.dataTransfer.dropEffect = 'copy';
				}
			}
		}));

		this.refreshTitle();
	}

	private refreshTitle(): void {
		if (this._disposed) {
			return;
		}

		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			this.updateTitle(EmptyView.NAME.value);
		} else {
			this.updateTitle(this.title);
		}
	}

	override dispose(): void {
		this._disposed = true;
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/views/explorerDecorationsProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/explorerDecorationsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../../base/common/event.js';
import { localize } from '../../../../../nls.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IDecorationsProvider, IDecorationData } from '../../../../services/decorations/common/decorations.js';
import { listInvalidItemForeground, listDeemphasizedForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { explorerRootErrorEmitter } from './explorerViewer.js';
import { ExplorerItem } from '../../common/explorerModel.js';
import { IExplorerService } from '../files.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';

export function provideDecorations(fileStat: ExplorerItem): IDecorationData | undefined {
	if (fileStat.isRoot && fileStat.error) {
		return {
			tooltip: localize('canNotResolve', "Unable to resolve workspace folder ({0})", toErrorMessage(fileStat.error)),
			letter: '!',
			color: listInvalidItemForeground,
		};
	}
	if (fileStat.isSymbolicLink) {
		return {
			tooltip: localize('symbolicLlink', "Symbolic Link"),
			letter: '\u2937'
		};
	}
	if (fileStat.isUnknown) {
		return {
			tooltip: localize('unknown', "Unknown File Type"),
			letter: '?'
		};
	}
	if (fileStat.isExcluded) {
		return {
			color: listDeemphasizedForeground,
		};
	}

	return undefined;
}

export class ExplorerDecorationsProvider implements IDecorationsProvider {
	readonly label: string = localize('label', "Explorer");
	private readonly _onDidChange = new Emitter<URI[]>();
	private readonly toDispose = new DisposableStore();

	constructor(
		@IExplorerService private explorerService: IExplorerService,
		@IWorkspaceContextService contextService: IWorkspaceContextService
	) {
		this.toDispose.add(this._onDidChange);
		this.toDispose.add(contextService.onDidChangeWorkspaceFolders(e => {
			this._onDidChange.fire(e.changed.concat(e.added).map(wf => wf.uri));
		}));
		this.toDispose.add(explorerRootErrorEmitter.event((resource => {
			this._onDidChange.fire([resource]);
		})));
	}

	get onDidChange(): Event<URI[]> {
		return this._onDidChange.event;
	}

	async provideDecorations(resource: URI): Promise<IDecorationData | undefined> {
		const fileStat = this.explorerService.findClosest(resource);
		if (!fileStat) {
			throw new Error('ExplorerItem not found');
		}

		return provideDecorations(fileStat);
	}

	dispose(): void {
		this.toDispose.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/views/explorerView.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/explorerView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { URI } from '../../../../../base/common/uri.js';
import * as perf from '../../../../../base/common/performance.js';
import { WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification } from '../../../../../base/common/actions.js';
import { memoize } from '../../../../../base/common/decorators.js';
import { IFilesConfiguration, ExplorerFolderContext, FilesExplorerFocusedContext, ExplorerFocusedContext, ExplorerRootContext, ExplorerResourceReadonlyContext, ExplorerResourceCut, ExplorerResourceMoveableToTrash, ExplorerCompressedFocusContext, ExplorerCompressedFirstFocusContext, ExplorerCompressedLastFocusContext, ExplorerResourceAvailableEditorIdsContext, VIEW_ID, ExplorerResourceWritableContext, ViewHasSomeCollapsibleRootItemContext, FoldersViewVisibleContext, ExplorerResourceParentReadOnlyContext, ExplorerFindProviderActive } from '../../common/files.js';
import { FileCopiedContext, NEW_FILE_COMMAND_ID, NEW_FOLDER_COMMAND_ID } from '../fileActions.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { IWorkbenchLayoutService } from '../../../../services/layout/browser/layoutService.js';
import { ExplorerDecorationsProvider } from './explorerDecorationsProvider.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IProgressService, ProgressLocation } from '../../../../../platform/progress/common/progress.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IContextKeyService, IContextKey, ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { IDecorationsService } from '../../../../services/decorations/common/decorations.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { DelayedDragHandler } from '../../../../../base/browser/dnd.js';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../../../services/editor/common/editorService.js';
import { IViewPaneOptions, ViewPane } from '../../../../browser/parts/views/viewPane.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ExplorerDelegate, ExplorerDataSource, FilesRenderer, ICompressedNavigationController, FilesFilter, FileSorter, FileDragAndDrop, ExplorerCompressionDelegate, isCompressedFolderName, ExplorerFindProvider } from './explorerViewer.js';
import { IThemeService, IFileIconTheme } from '../../../../../platform/theme/common/themeService.js';
import { IWorkbenchThemeService } from '../../../../services/themes/common/workbenchThemeService.js';
import { ITreeContextMenuEvent, TreeVisibility } from '../../../../../base/browser/ui/tree/tree.js';
import { MenuId, Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ExplorerItem, NewExplorerItem } from '../../common/explorerModel.js';
import { ResourceLabels } from '../../../../browser/labels.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IAsyncDataTreeViewState } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IFileService, FileSystemProviderCapabilities } from '../../../../../platform/files/common/files.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { Event } from '../../../../../base/common/event.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { IExplorerService, IExplorerView } from '../files.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IEditorResolverService } from '../../../../services/editor/common/editorResolverService.js';
import { EditorOpenSource } from '../../../../../platform/editor/common/editor.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { AbstractTreePart } from '../../../../../base/browser/ui/tree/abstractTree.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';


function hasExpandedRootChild(tree: WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>, treeInput: ExplorerItem[]): boolean {
	for (const folder of treeInput) {
		if (tree.hasNode(folder) && !tree.isCollapsed(folder)) {
			for (const [, child] of folder.children.entries()) {
				if (tree.hasNode(child) && tree.isCollapsible(child) && !tree.isCollapsed(child)) {
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * Whether or not any of the nodes in the tree are expanded
 */
function hasExpandedNode(tree: WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>, treeInput: ExplorerItem[]): boolean {
	for (const folder of treeInput) {
		if (tree.hasNode(folder) && !tree.isCollapsed(folder)) {
			return true;
		}
	}
	return false;
}

const identityProvider = {
	getId: (stat: ExplorerItem) => {
		if (stat instanceof NewExplorerItem) {
			return `new:${stat.getId()}`;
		}

		return stat.getId();
	}
};

export function getContext(focus: ExplorerItem[], selection: ExplorerItem[], respectMultiSelection: boolean,
	compressedNavigationControllerProvider: { getCompressedNavigationController(stat: ExplorerItem): ICompressedNavigationController[] | undefined }): ExplorerItem[] {

	let focusedStat: ExplorerItem | undefined;
	focusedStat = focus.length ? focus[0] : undefined;

	// If we are respecting multi-select and we have a multi-selection we ignore focus as we want to act on the selection
	if (respectMultiSelection && selection.length > 1) {
		focusedStat = undefined;
	}

	const compressedNavigationControllers = focusedStat && compressedNavigationControllerProvider.getCompressedNavigationController(focusedStat);
	const compressedNavigationController = compressedNavigationControllers?.length ? compressedNavigationControllers[0] : undefined;
	focusedStat = compressedNavigationController ? compressedNavigationController.current : focusedStat;

	const selectedStats: ExplorerItem[] = [];

	for (const stat of selection) {
		const controllers = compressedNavigationControllerProvider.getCompressedNavigationController(stat);
		const controller = controllers?.at(0);
		if (controller && focusedStat && controller === compressedNavigationController) {
			if (stat === focusedStat) {
				selectedStats.push(stat);
			}
			// Ignore stats which are selected but are part of the same compact node as the focused stat
			continue;
		}

		if (controller) {
			selectedStats.push(...controller.items);
		} else {
			selectedStats.push(stat);
		}
	}
	if (!focusedStat) {
		if (respectMultiSelection) {
			return selectedStats;
		} else {
			return [];
		}
	}

	if (respectMultiSelection && selectedStats.indexOf(focusedStat) >= 0) {
		return selectedStats;
	}

	return [focusedStat];
}

export interface IExplorerViewContainerDelegate {
	willOpenElement(event?: UIEvent): void;
	didOpenElement(event?: UIEvent): void;
}

export interface IExplorerViewPaneOptions extends IViewPaneOptions {
	delegate: IExplorerViewContainerDelegate;
}

export class ExplorerView extends ViewPane implements IExplorerView {
	static readonly TREE_VIEW_STATE_STORAGE_KEY: string = 'workbench.explorer.treeViewState';

	private tree!: WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>;
	private filter!: FilesFilter;
	private findProvider!: ExplorerFindProvider;

	private resourceContext: ResourceContextKey;
	private folderContext: IContextKey<boolean>;
	private parentReadonlyContext: IContextKey<boolean>;
	private readonlyContext: IContextKey<boolean>;
	private availableEditorIdsContext: IContextKey<string>;

	private rootContext: IContextKey<boolean>;
	private resourceMoveableToTrash: IContextKey<boolean>;

	private renderer!: FilesRenderer;

	private treeContainer!: HTMLElement;
	private container!: HTMLElement;
	private compressedFocusContext: IContextKey<boolean>;
	private compressedFocusFirstContext: IContextKey<boolean>;
	private compressedFocusLastContext: IContextKey<boolean>;

	private viewHasSomeCollapsibleRootItem: IContextKey<boolean>;
	private viewVisibleContextKey: IContextKey<boolean>;

	private setTreeInputPromise: Promise<void> | undefined;
	private horizontalScrolling: boolean | undefined;

	private dragHandler!: DelayedDragHandler;
	private _autoReveal: boolean | 'force' | 'focusNoScroll' = false;
	private decorationsProvider: ExplorerDecorationsProvider | undefined;
	private readonly delegate: IExplorerViewContainerDelegate | undefined;

	override get singleViewPaneContainerTitle(): string {
		return this.name;
	}

	constructor(
		options: IExplorerViewPaneOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IProgressService private readonly progressService: IProgressService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IDecorationsService private readonly decorationService: IDecorationsService,
		@ILabelService private readonly labelService: ILabelService,
		@IThemeService themeService: IWorkbenchThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IStorageService private readonly storageService: IStorageService,
		@IClipboardService private clipboardService: IClipboardService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ICommandService private readonly commandService: ICommandService,
		@IOpenerService openerService: IOpenerService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.delegate = options.delegate;
		this.resourceContext = instantiationService.createInstance(ResourceContextKey);
		this._register(this.resourceContext);

		this.parentReadonlyContext = ExplorerResourceParentReadOnlyContext.bindTo(contextKeyService);
		this.folderContext = ExplorerFolderContext.bindTo(contextKeyService);
		this.readonlyContext = ExplorerResourceReadonlyContext.bindTo(contextKeyService);
		this.availableEditorIdsContext = ExplorerResourceAvailableEditorIdsContext.bindTo(contextKeyService);
		this.rootContext = ExplorerRootContext.bindTo(contextKeyService);
		this.resourceMoveableToTrash = ExplorerResourceMoveableToTrash.bindTo(contextKeyService);
		this.compressedFocusContext = ExplorerCompressedFocusContext.bindTo(contextKeyService);
		this.compressedFocusFirstContext = ExplorerCompressedFirstFocusContext.bindTo(contextKeyService);
		this.compressedFocusLastContext = ExplorerCompressedLastFocusContext.bindTo(contextKeyService);
		this.viewHasSomeCollapsibleRootItem = ViewHasSomeCollapsibleRootItemContext.bindTo(contextKeyService);
		this.viewVisibleContextKey = FoldersViewVisibleContext.bindTo(contextKeyService);


		this.explorerService.registerView(this);
	}

	get autoReveal() {
		return this._autoReveal;
	}

	set autoReveal(autoReveal: boolean | 'force' | 'focusNoScroll') {
		this._autoReveal = autoReveal;
	}

	get name(): string {
		return this.labelService.getWorkspaceLabel(this.contextService.getWorkspace());
	}

	override get title(): string {
		return this.name;
	}

	override set title(_: string) {
		// noop
	}

	override setVisible(visible: boolean): void {
		this.viewVisibleContextKey.set(visible);
		super.setVisible(visible);
	}

	@memoize private get fileCopiedContextKey(): IContextKey<boolean> {
		return FileCopiedContext.bindTo(this.contextKeyService);
	}

	@memoize private get resourceCutContextKey(): IContextKey<boolean> {
		return ExplorerResourceCut.bindTo(this.contextKeyService);
	}

	// Split view methods

	protected override renderHeader(container: HTMLElement): void {
		super.renderHeader(container);

		// Expand on drag over
		this.dragHandler = new DelayedDragHandler(container, () => this.setExpanded(true));

		// eslint-disable-next-line no-restricted-syntax
		const titleElement = container.querySelector('.title') as HTMLElement;
		const setHeader = () => {
			titleElement.textContent = this.name;
			this.updateTitle(this.name);
			this.ariaHeaderLabel = nls.localize('explorerSection', "Explorer Section: {0}", this.name);
			titleElement.setAttribute('aria-label', this.ariaHeaderLabel);
		};

		this._register(this.contextService.onDidChangeWorkspaceName(setHeader));
		this._register(this.labelService.onDidChangeFormatters(setHeader));
		setHeader();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.layout(height, width);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.container = container;
		this.treeContainer = DOM.append(container, DOM.$('.explorer-folders-view'));

		this.createTree(this.treeContainer);

		this._register(this.labelService.onDidChangeFormatters(() => {
			this._onDidChangeTitleArea.fire();
		}));

		// Update configuration
		this.onConfigurationUpdated(undefined);

		// When the explorer viewer is loaded, listen to changes to the editor input
		this._register(this.editorService.onDidActiveEditorChange(() => {
			this.selectActiveFile();
		}));

		// Also handle configuration updates
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));

		this._register(this.onDidChangeBodyVisibility(async visible => {
			if (visible) {
				// Always refresh explorer when it becomes visible to compensate for missing file events #126817
				await this.setTreeInput();
				// Update the collapse / expand  button state
				this.updateAnyCollapsedContext();
				// Find resource to focus from active editor input if set
				this.selectActiveFile(true);
			}
		}));

		// Support for paste of files into explorer
		this._register(DOM.addDisposableListener(DOM.getWindow(this.container), DOM.EventType.PASTE, async event => {
			if (!this.hasFocus() || this.readonlyContext.get()) {
				return;
			}
			if (event.clipboardData?.files?.length) {
				await this.commandService.executeCommand('filesExplorer.paste', event.clipboardData?.files);
			}
		}));
	}

	override focus(): void {
		super.focus();
		this.tree.domFocus();

		if (this.tree.getFocusedPart() === AbstractTreePart.Tree) {
			const focused = this.tree.getFocus();
			if (focused.length === 1 && this._autoReveal) {
				this.tree.reveal(focused[0], 0.5);
			}
		}
	}

	hasFocus(): boolean {
		return DOM.isAncestorOfActiveElement(this.container);
	}

	getFocus(): ExplorerItem[] {
		return this.tree.getFocus();
	}

	focusNext(): void {
		this.tree.focusNext();
	}

	focusLast(): void {
		this.tree.focusLast();
	}

	getContext(respectMultiSelection: boolean): ExplorerItem[] {
		const focusedItems = this.tree.getFocusedPart() === AbstractTreePart.StickyScroll ?
			this.tree.getStickyScrollFocus() :
			this.tree.getFocus();
		return getContext(focusedItems, this.tree.getSelection(), respectMultiSelection, this.renderer);
	}

	isItemVisible(item: ExplorerItem): boolean {
		// If filter is undefined it means the tree hasn't been rendered yet, so nothing is visible
		if (!this.filter) {
			return false;
		}
		return this.filter.filter(item, TreeVisibility.Visible);
	}

	isItemCollapsed(item: ExplorerItem): boolean {
		return this.tree.isCollapsed(item);
	}

	async setEditable(stat: ExplorerItem, isEditing: boolean): Promise<void> {
		if (isEditing) {
			this.horizontalScrolling = this.tree.options.horizontalScrolling;

			if (this.horizontalScrolling) {
				this.tree.updateOptions({ horizontalScrolling: false });
			}

			await this.tree.expand(stat.parent!);
		} else {
			if (this.horizontalScrolling !== undefined) {
				this.tree.updateOptions({ horizontalScrolling: this.horizontalScrolling });
			}

			this.horizontalScrolling = undefined;
			this.treeContainer.classList.remove('highlight');
		}

		await this.refresh(false, stat.parent, false);

		if (isEditing) {
			this.treeContainer.classList.add('highlight');
			this.tree.reveal(stat);
		} else {
			this.tree.domFocus();
		}
	}

	private async selectActiveFile(reveal = this._autoReveal): Promise<void> {
		if (this._autoReveal) {
			const activeFile = EditorResourceAccessor.getCanonicalUri(this.editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });

			if (activeFile) {
				const focus = this.tree.getFocus();
				const selection = this.tree.getSelection();
				if (focus.length === 1 && this.uriIdentityService.extUri.isEqual(focus[0].resource, activeFile) && selection.length === 1 && this.uriIdentityService.extUri.isEqual(selection[0].resource, activeFile)) {
					// No action needed, active file is already focused and selected
					return;
				}
				return this.explorerService.select(activeFile, reveal);
			}
		}
	}

	private createTree(container: HTMLElement): void {
		this.filter = this.instantiationService.createInstance(FilesFilter);
		this._register(this.filter);
		this._register(this.filter.onDidChange(() => this.refresh(true)));
		const explorerLabels = this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this.onDidChangeBodyVisibility });
		this._register(explorerLabels);

		this.findProvider = this.instantiationService.createInstance(ExplorerFindProvider, this.filter, () => this.tree);

		const updateWidth = (stat: ExplorerItem) => this.tree.updateWidth(stat);
		this.renderer = this.instantiationService.createInstance(FilesRenderer, container, explorerLabels, this.findProvider.highlightTree, updateWidth);
		this._register(this.renderer);

		this._register(createFileIconThemableTreeContainerScope(container, this.themeService));

		const isCompressionEnabled = () => this.configurationService.getValue<boolean>('explorer.compactFolders');

		const getFileNestingSettings = (item?: ExplorerItem) => this.configurationService.getValue<IFilesConfiguration>({ resource: item?.root.resource }).explorer.fileNesting;

		this.tree = this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>, 'FileExplorer', container, new ExplorerDelegate(), new ExplorerCompressionDelegate(), [this.renderer],
			this.instantiationService.createInstance(ExplorerDataSource, this.filter, this.findProvider), {
			compressionEnabled: isCompressionEnabled(),
			accessibilityProvider: this.renderer,
			identityProvider,
			keyboardNavigationLabelProvider: {
				getKeyboardNavigationLabel: (stat: ExplorerItem) => {
					if (this.explorerService.isEditable(stat)) {
						return undefined;
					}

					return stat.name;
				},
				getCompressedNodeKeyboardNavigationLabel: (stats: ExplorerItem[]) => {
					if (stats.some(stat => this.explorerService.isEditable(stat))) {
						return undefined;
					}

					return stats.map(stat => stat.name).join('/');
				}
			},
			multipleSelectionSupport: true,
			filter: this.filter,
			sorter: this.instantiationService.createInstance(FileSorter),
			dnd: this.instantiationService.createInstance(FileDragAndDrop, (item) => this.isItemCollapsed(item)),
			collapseByDefault: (e) => {
				if (e instanceof ExplorerItem) {
					if (e.hasNests && getFileNestingSettings(e).expand) {
						return false;
					}
					if (this.findProvider.isShowingFilterResults()) {
						return false;
					}
				}
				return true;
			},
			autoExpandSingleChildren: true,
			expandOnlyOnTwistieClick: (e: unknown) => {
				if (e instanceof ExplorerItem) {
					if (e.hasNests) {
						return true;
					}
					else if (this.configurationService.getValue<'singleClick' | 'doubleClick'>('workbench.tree.expandMode') === 'doubleClick') {
						return true;
					}
				}
				return false;
			},
			paddingBottom: ExplorerDelegate.ITEM_HEIGHT,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles,
			findProvider: this.findProvider,
		});
		this._register(this.tree);
		this._register(this.themeService.onDidColorThemeChange(() => this.tree.rerender()));

		// Bind configuration
		const onDidChangeCompressionConfiguration = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('explorer.compactFolders'));
		this._register(onDidChangeCompressionConfiguration(_ => this.tree.updateOptions({ compressionEnabled: isCompressionEnabled() })));

		// Bind context keys
		FilesExplorerFocusedContext.bindTo(this.tree.contextKeyService);
		ExplorerFocusedContext.bindTo(this.tree.contextKeyService);

		// Update resource context based on focused element
		this._register(this.tree.onDidChangeFocus(e => this.onFocusChanged(e.elements)));
		this.onFocusChanged([]);
		// Open when selecting via keyboard
		this._register(this.tree.onDidOpen(async e => {
			const element = e.element;
			if (!element) {
				return;
			}
			// Do not react if the user is expanding selection via keyboard.
			// Check if the item was previously also selected, if yes the user is simply expanding / collapsing current selection #66589.
			const shiftDown = DOM.isKeyboardEvent(e.browserEvent) && e.browserEvent.shiftKey;
			if (!shiftDown) {
				if (element.isDirectory || this.explorerService.isEditable(undefined)) {
					// Do not react if user is clicking on explorer items while some are being edited #70276
					// Do not react if clicking on directories
					return;
				}
				this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'explorer' });
				try {
					this.delegate?.willOpenElement(e.browserEvent);
					await this.editorService.openEditor({ resource: element.resource, options: { preserveFocus: e.editorOptions.preserveFocus, pinned: e.editorOptions.pinned, source: EditorOpenSource.USER } }, e.sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
				} finally {
					this.delegate?.didOpenElement();
				}
			}
		}));

		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		this._register(this.tree.onDidScroll(async e => {
			const editable = this.explorerService.getEditable();
			if (e.scrollTopChanged && editable && this.tree.getRelativeTop(editable.stat) === null) {
				await editable.data.onFinish('', false);
			}
		}));

		this._register(this.tree.onDidChangeCollapseState(e => {
			const element = e.node.element?.element;
			if (element) {
				const navigationControllers = this.renderer.getCompressedNavigationController(Array.isArray(element) ? element[0] : element);
				navigationControllers?.forEach(controller => controller.updateCollapsed(e.node.collapsed));
			}
			// Update showing expand / collapse button
			this.updateAnyCollapsedContext();
		}));

		this.updateAnyCollapsedContext();

		this._register(this.tree.onMouseDblClick(e => {
			// If empty space is clicked, and not scrolling by page enabled #173261
			const scrollingByPage = this.configurationService.getValue<boolean>('workbench.list.scrollByPage');
			if (e.element === null && !scrollingByPage) {
				// click in empty area -> create a new file #116676
				this.commandService.executeCommand(NEW_FILE_COMMAND_ID);
			}
		}));

		// save view state
		this._register(this.storageService.onWillSaveState(() => {
			this.storeTreeViewState();
		}));
	}

	// React on events

	private onConfigurationUpdated(event: IConfigurationChangeEvent | undefined): void {
		if (!event || event.affectsConfiguration('explorer.autoReveal')) {
			const configuration = this.configurationService.getValue<IFilesConfiguration>();
			this._autoReveal = configuration?.explorer?.autoReveal;
		}

		// Push down config updates to components of viewer
		if (event && (event.affectsConfiguration('explorer.decorations.colors') || event.affectsConfiguration('explorer.decorations.badges'))) {
			this.refresh(true);
		}
	}

	private storeTreeViewState() {
		this.storageService.store(ExplorerView.TREE_VIEW_STATE_STORAGE_KEY, JSON.stringify(this.tree.getViewState()), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	private setContextKeys(stat: ExplorerItem | null | undefined): void {
		const folders = this.contextService.getWorkspace().folders;
		const resource = stat ? stat.resource : folders[folders.length - 1].uri;
		stat = stat || this.explorerService.findClosest(resource);
		this.resourceContext.set(resource);
		this.folderContext.set(!!stat && stat.isDirectory);
		this.readonlyContext.set(!!stat && !!stat.isReadonly);
		this.parentReadonlyContext.set(Boolean(stat?.parent?.isReadonly));
		this.rootContext.set(!!stat && stat.isRoot);

		if (resource) {
			const overrides = resource ? this.editorResolverService.getEditors(resource).map(editor => editor.id) : [];
			this.availableEditorIdsContext.set(overrides.join(','));
		} else {
			this.availableEditorIdsContext.reset();
		}
	}

	private async onContextMenu(e: ITreeContextMenuEvent<ExplorerItem>): Promise<void> {
		if (DOM.isEditableElement(e.browserEvent.target as HTMLElement)) {
			return;
		}

		const stat = e.element;
		let anchor = e.anchor;

		// Adjust for compressed folders (except when mouse is used)
		if (DOM.isHTMLElement(anchor)) {
			if (stat) {
				const controllers = this.renderer.getCompressedNavigationController(stat);

				if (controllers && controllers.length > 0) {
					if (DOM.isKeyboardEvent(e.browserEvent) || isCompressedFolderName(e.browserEvent.target)) {
						anchor = controllers[0].labels[controllers[0].index];
					} else {
						controllers.forEach(controller => controller.last());
					}
				}
			}
		}

		// update dynamic contexts
		this.fileCopiedContextKey.set(await this.clipboardService.hasResources());
		this.setContextKeys(stat);

		const selection = this.tree.getSelection();

		const roots = this.explorerService.roots; // If the click is outside of the elements pass the root resource if there is only one root. If there are multiple roots pass empty object.
		let arg: URI | {};
		if (stat instanceof ExplorerItem) {
			const compressedControllers = this.renderer.getCompressedNavigationController(stat);
			arg = compressedControllers?.length ? compressedControllers[0].current.resource : stat.resource;
		} else {
			arg = roots.length === 1 ? roots[0].resource : {};
		}

		this.contextMenuService.showContextMenu({
			menuId: MenuId.ExplorerContext,
			menuActionOptions: { arg, shouldForwardArgs: true },
			contextKeyService: this.tree.contextKeyService,
			getAnchor: () => anchor,
			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.tree.domFocus();
				}
			},
			getActionsContext: () => stat && selection && selection.indexOf(stat) >= 0
				? selection.map((fs: ExplorerItem) => fs.resource)
				: stat instanceof ExplorerItem ? [stat.resource] : []
		});
	}

	private onFocusChanged(elements: readonly ExplorerItem[]): void {
		const stat = elements.at(0);
		this.setContextKeys(stat);

		if (stat) {
			const enableTrash = Boolean(this.configurationService.getValue<IFilesConfiguration>().files?.enableTrash);
			const hasCapability = this.fileService.hasCapability(stat.resource, FileSystemProviderCapabilities.Trash);
			this.resourceMoveableToTrash.set(enableTrash && hasCapability);
		} else {
			this.resourceMoveableToTrash.reset();
		}

		const compressedNavigationControllers = stat && this.renderer.getCompressedNavigationController(stat);

		if (!compressedNavigationControllers) {
			this.compressedFocusContext.set(false);
			return;
		}

		this.compressedFocusContext.set(true);
		compressedNavigationControllers.forEach(controller => {
			this.updateCompressedNavigationContextKeys(controller);
		});
	}

	// General methods

	/**
	 * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
	 * If the item is passed we refresh only that level of the tree, otherwise we do a full refresh.
	 */
	refresh(recursive: boolean, item?: ExplorerItem, cancelEditing: boolean = true): Promise<void> {
		if (!this.tree || !this.isBodyVisible() || (item && !this.tree.hasNode(item)) || (this.findProvider?.isShowingFilterResults() && recursive)) {
			// Tree node doesn't exist yet, when it becomes visible we will refresh
			return Promise.resolve(undefined);
		}

		if (cancelEditing && this.explorerService.isEditable(undefined)) {
			this.tree.domFocus();
		}

		const toRefresh = item || this.tree.getInput();
		return this.tree.updateChildren(toRefresh, recursive, !!item);
	}

	override getOptimalWidth(): number {
		const parentNode = this.tree.getHTMLElement();
		// eslint-disable-next-line no-restricted-syntax
		const childNodes = ([] as HTMLElement[]).slice.call(parentNode.querySelectorAll('.explorer-item .label-name')); // select all file labels

		return DOM.getLargestChildWidth(parentNode, childNodes);
	}

	async setTreeInput(): Promise<void> {
		if (!this.isBodyVisible()) {
			return Promise.resolve(undefined);
		}

		// Wait for the last execution to complete before executing
		if (this.setTreeInputPromise) {
			await this.setTreeInputPromise;
		}

		const initialInputSetup = !this.tree.getInput();
		if (initialInputSetup) {
			perf.mark('code/willResolveExplorer');
		}
		const roots = this.explorerService.roots;
		let input: ExplorerItem | ExplorerItem[] = roots[0];
		if (this.contextService.getWorkbenchState() !== WorkbenchState.FOLDER || roots[0].error) {
			// Display roots only when multi folder workspace
			input = roots;
		}

		let viewState: IAsyncDataTreeViewState | undefined;
		if (this.tree?.getInput()) {
			viewState = this.tree.getViewState();
		} else {
			const rawViewState = this.storageService.get(ExplorerView.TREE_VIEW_STATE_STORAGE_KEY, StorageScope.WORKSPACE);
			if (rawViewState) {
				viewState = JSON.parse(rawViewState);
			}
		}

		const previousInput = this.tree.getInput();
		const promise = this.setTreeInputPromise = this.tree.setInput(input, viewState).then(async () => {
			if (Array.isArray(input)) {
				if (!viewState || previousInput instanceof ExplorerItem) {
					// There is no view state for this workspace (we transitioned from a folder workspace?), expand up to five roots.
					// If there are many roots in a workspace, expanding them all would can cause performance issues #176226
					for (let i = 0; i < Math.min(input.length, 5); i++) {
						try {
							await this.tree.expand(input[i]);
						} catch (e) { }
					}
				}
				// Reloaded or transitioned from an empty workspace, but only have a single folder in the workspace.
				if (!previousInput && input.length === 1 && this.configurationService.getValue<IFilesConfiguration>().explorer.expandSingleFolderWorkspaces) {
					await this.tree.expand(input[0]).catch(() => { });
				}
				if (Array.isArray(previousInput)) {
					const previousRoots = new ResourceMap<true>();
					previousInput.forEach(previousRoot => previousRoots.set(previousRoot.resource, true));

					// Roots added to the explorer -> expand them.
					await Promise.all(input.map(async item => {
						if (!previousRoots.has(item.resource)) {
							try {
								await this.tree.expand(item);
							} catch (e) { }
						}
					}));
				}
			}
			if (initialInputSetup) {
				perf.mark('code/didResolveExplorer');
			}
		});

		this.progressService.withProgress({
			location: ProgressLocation.Explorer,
			delay: this.layoutService.isRestored() ? 800 : 1500 // reduce progress visibility when still restoring
		}, _progress => promise);

		await promise;
		if (!this.decorationsProvider) {
			this.decorationsProvider = new ExplorerDecorationsProvider(this.explorerService, this.contextService);
			this._register(this.decorationService.registerDecorationsProvider(this.decorationsProvider));
		}
	}

	public async selectResource(resource: URI | undefined, reveal = this._autoReveal, retry = 0): Promise<void> {
		// do no retry more than once to prevent infinite loops in cases of inconsistent model
		if (retry === 2) {
			return;
		}

		if (!resource || !this.isBodyVisible()) {
			return;
		}

		// If something is refreshing the explorer, we must await it or else a selection race condition can occur
		if (this.setTreeInputPromise) {
			await this.setTreeInputPromise;
		}

		// Expand all stats in the parent chain.
		let item: ExplorerItem | null = this.explorerService.findClosestRoot(resource);

		while (item && item.resource.toString() !== resource.toString()) {
			try {
				await this.tree.expand(item);
			} catch (e) {
				return this.selectResource(resource, reveal, retry + 1);
			}
			if (!item.children.size) {
				item = null;
			} else {
				for (const child of item.children.values()) {
					if (this.uriIdentityService.extUri.isEqualOrParent(resource, child.resource)) {
						item = child;
						break;
					}
					item = null;
				}
			}
		}

		if (item) {
			if (item === this.tree.getInput()) {
				this.tree.setFocus([]);
				this.tree.setSelection([]);
				return;
			}

			try {
				// We must expand the nest to have it be populated in the tree
				if (item.nestedParent) {
					await this.tree.expand(item.nestedParent);
				}

				if ((reveal === true || reveal === 'force') && this.tree.getRelativeTop(item) === null) {
					// Don't scroll to the item if it's already visible, or if set not to.
					this.tree.reveal(item, 0.5);
				}

				this.tree.setFocus([item]);
				this.tree.setSelection([item]);
			} catch (e) {
				// Element might not be in the tree, try again and silently fail
				return this.selectResource(resource, reveal, retry + 1);
			}
		}
	}

	itemsCopied(stats: ExplorerItem[], cut: boolean, previousCut: ExplorerItem[] | undefined): void {
		this.fileCopiedContextKey.set(stats.length > 0);
		this.resourceCutContextKey.set(cut && stats.length > 0);
		previousCut?.forEach(item => this.tree.rerender(item));
		if (cut) {
			stats.forEach(s => this.tree.rerender(s));
		}
	}

	expandAll(): void {
		if (this.explorerService.isEditable(undefined)) {
			this.tree.domFocus();
		}

		this.tree.expandAll();
	}

	collapseAll(): void {
		if (this.explorerService.isEditable(undefined)) {
			this.tree.domFocus();
		}

		const treeInput = this.tree.getInput();
		if (Array.isArray(treeInput)) {
			if (hasExpandedRootChild(this.tree, treeInput)) {
				treeInput.forEach(folder => {
					folder.children.forEach(child => this.tree.hasNode(child) && this.tree.collapse(child, true));
				});

				return;
			}
		}

		this.tree.collapseAll();
	}

	previousCompressedStat(): void {
		const focused = this.tree.getFocus();
		if (!focused.length) {
			return;
		}

		const compressedNavigationControllers = this.renderer.getCompressedNavigationController(focused[0])!;
		compressedNavigationControllers.forEach(controller => {
			controller.previous();
			this.updateCompressedNavigationContextKeys(controller);
		});
	}

	nextCompressedStat(): void {
		const focused = this.tree.getFocus();
		if (!focused.length) {
			return;
		}

		const compressedNavigationControllers = this.renderer.getCompressedNavigationController(focused[0])!;
		compressedNavigationControllers.forEach(controller => {
			controller.next();
			this.updateCompressedNavigationContextKeys(controller);
		});
	}

	firstCompressedStat(): void {
		const focused = this.tree.getFocus();
		if (!focused.length) {
			return;
		}

		const compressedNavigationControllers = this.renderer.getCompressedNavigationController(focused[0])!;
		compressedNavigationControllers.forEach(controller => {
			controller.first();
			this.updateCompressedNavigationContextKeys(controller);
		});
	}

	lastCompressedStat(): void {
		const focused = this.tree.getFocus();
		if (!focused.length) {
			return;
		}

		const compressedNavigationControllers = this.renderer.getCompressedNavigationController(focused[0])!;
		compressedNavigationControllers.forEach(controller => {
			controller.last();
			this.updateCompressedNavigationContextKeys(controller);
		});
	}

	private updateCompressedNavigationContextKeys(controller: ICompressedNavigationController): void {
		this.compressedFocusFirstContext.set(controller.index === 0);
		this.compressedFocusLastContext.set(controller.index === controller.count - 1);
	}

	private updateAnyCollapsedContext(): void {
		const treeInput = this.tree.getInput();
		if (treeInput === undefined) {
			return;
		}
		const treeInputArray = Array.isArray(treeInput) ? treeInput : Array.from(treeInput.children.values());
		// Has collapsible root when anything is expanded
		this.viewHasSomeCollapsibleRootItem.set(hasExpandedNode(this.tree, treeInputArray));
		// synchronize state to cache
		this.storeTreeViewState();
	}

	hasPhantomElements(): boolean {
		return !!this.findProvider?.isShowingFilterResults();
	}

	override dispose(): void {
		this.dragHandler?.dispose();
		super.dispose();
	}
}

export function createFileIconThemableTreeContainerScope(container: HTMLElement, themeService: IThemeService): IDisposable {
	container.classList.add('file-icon-themable-tree');
	container.classList.add('show-file-icons');

	const onDidChangeFileIconTheme = (theme: IFileIconTheme) => {
		container.classList.toggle('align-icons-and-twisties', theme.hasFileIcons && !theme.hasFolderIcons);
		container.classList.toggle('hide-arrows', theme.hidesExplorerArrows === true);
	};

	onDidChangeFileIconTheme(themeService.getFileIconTheme());
	return themeService.onDidFileIconThemeChange(onDidChangeFileIconTheme);
}

const CanCreateContext = ContextKeyExpr.or(
	// Folder: can create unless readonly
	ContextKeyExpr.and(ExplorerFolderContext, ExplorerResourceWritableContext),
	// File: can create unless parent is readonly
	ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ExplorerResourceParentReadOnlyContext.toNegated())
);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.files.action.createFileFromExplorer',
			title: nls.localize('createNewFile', "New File..."),
			f1: false,
			icon: Codicon.newFile,
			precondition: CanCreateContext,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', VIEW_ID),
				order: 10
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand(NEW_FILE_COMMAND_ID);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.files.action.createFolderFromExplorer',
			title: nls.localize('createNewFolder', "New Folder..."),
			f1: false,
			icon: Codicon.newFolder,
			precondition: CanCreateContext,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', VIEW_ID),
				order: 20
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand(NEW_FOLDER_COMMAND_ID);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.files.action.refreshFilesExplorer',
			title: nls.localize2('refreshExplorer', "Refresh Explorer"),
			f1: true,
			icon: Codicon.refresh,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', VIEW_ID),
				order: 30,
			},
			metadata: {
				description: nls.localize2('refreshExplorerMetadata', "Forces a refresh of the Explorer.")
			},
			precondition: ExplorerFindProviderActive.negate()
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const explorerService = accessor.get(IExplorerService);
		await viewsService.openView(VIEW_ID);
		await explorerService.refresh();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.files.action.collapseExplorerFolders',
			title: nls.localize2('collapseExplorerFolders', "Collapse Folders in Explorer"),
			f1: true,
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', VIEW_ID),
				order: 40
			},
			metadata: {
				description: nls.localize2('collapseExplorerFoldersMetadata', "Folds all folders in the Explorer.")
			}
		});
	}

	run(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const view = viewsService.getViewWithId(VIEW_ID);
		if (view !== null) {
			const explorerView = view as ExplorerView;
			explorerView.collapseAll();
		}
	}
});
```

--------------------------------------------------------------------------------

````

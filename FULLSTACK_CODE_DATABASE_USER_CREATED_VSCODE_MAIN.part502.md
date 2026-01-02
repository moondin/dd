---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 502
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 502 of 552)

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

---[FILE: src/vs/workbench/services/dialogs/browser/simpleFileDialog.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/browser/simpleFileDialog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as resources from '../../../../base/common/resources.js';
import * as objects from '../../../../base/common/objects.js';
import { IFileService, IFileStat, FileKind, IFileStatWithPartialMetadata } from '../../../../platform/files/common/files.js';
import { IQuickInputService, IQuickPickItem, IQuickPick, ItemActivation } from '../../../../platform/quickinput/common/quickInput.js';
import { URI } from '../../../../base/common/uri.js';
import { isWindows, OperatingSystem } from '../../../../base/common/platform.js';
import { ISaveDialogOptions, IOpenDialogOptions, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { Schemas } from '../../../../base/common/network.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IContextKeyService, IContextKey, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { equalsIgnoreCase, format, startsWithIgnoreCase } from '../../../../base/common/strings.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { isValidBasename } from '../../../../base/common/extpath.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { createCancelablePromise, CancelablePromise } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ICommandHandler } from '../../../../platform/commands/common/commands.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { SaveReason } from '../../../common/editor.js';
import { IPathService } from '../../path/common/pathService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { getActiveDocument } from '../../../../base/browser/dom.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export namespace OpenLocalFileCommand {
	export const ID = 'workbench.action.files.openLocalFile';
	export const LABEL = nls.localize('openLocalFile', "Open Local File...");
	export function handler(): ICommandHandler {
		return accessor => {
			const dialogService = accessor.get(IFileDialogService);
			return dialogService.pickFileAndOpen({ forceNewWindow: false, availableFileSystems: [Schemas.file] });
		};
	}
}

export namespace SaveLocalFileCommand {
	export const ID = 'workbench.action.files.saveLocalFile';
	export const LABEL = nls.localize('saveLocalFile', "Save Local File...");
	export function handler(): ICommandHandler {
		return accessor => {
			const editorService = accessor.get(IEditorService);
			const activeEditorPane = editorService.activeEditorPane;
			if (activeEditorPane) {
				return editorService.save({ groupId: activeEditorPane.group.id, editor: activeEditorPane.input }, { saveAs: true, availableFileSystems: [Schemas.file], reason: SaveReason.EXPLICIT });
			}

			return Promise.resolve(undefined);
		};
	}
}

export namespace OpenLocalFolderCommand {
	export const ID = 'workbench.action.files.openLocalFolder';
	export const LABEL = nls.localize('openLocalFolder', "Open Local Folder...");
	export function handler(): ICommandHandler {
		return accessor => {
			const dialogService = accessor.get(IFileDialogService);
			return dialogService.pickFolderAndOpen({ forceNewWindow: false, availableFileSystems: [Schemas.file] });
		};
	}
}

export namespace OpenLocalFileFolderCommand {
	export const ID = 'workbench.action.files.openLocalFileFolder';
	export const LABEL = nls.localize('openLocalFileFolder', "Open Local...");
	export function handler(): ICommandHandler {
		return accessor => {
			const dialogService = accessor.get(IFileDialogService);
			return dialogService.pickFileFolderAndOpen({ forceNewWindow: false, availableFileSystems: [Schemas.file] });
		};
	}
}

interface FileQuickPickItem extends IQuickPickItem {
	uri: URI;
	isFolder: boolean;
}

enum UpdateResult {
	Updated,
	UpdatedWithTrailing,
	Updating,
	NotUpdated,
	InvalidPath
}

export const RemoteFileDialogContext = new RawContextKey<boolean>('remoteFileDialogVisible', false);

export interface ISimpleFileDialog extends IDisposable {
	showOpenDialog(options: IOpenDialogOptions): Promise<URI | undefined>;
	showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined>;
}

export class SimpleFileDialog extends Disposable implements ISimpleFileDialog {
	private options!: IOpenDialogOptions;
	private currentFolder!: URI;
	private filePickBox!: IQuickPick<FileQuickPickItem>;
	private hidden: boolean = false;
	private allowFileSelection: boolean = true;
	private allowFolderSelection: boolean = false;
	private remoteAuthority: string | undefined;
	private requiresTrailing: boolean = false;
	private trailing: string | undefined;
	protected scheme: string;
	private contextKey: IContextKey<boolean>;
	private userEnteredPathSegment: string = '';
	private autoCompletePathSegment: string = '';
	private activeItem: FileQuickPickItem | undefined;
	private userHome!: URI;
	private trueHome!: URI;
	private isWindows: boolean = false;
	private badPath: string | undefined;
	private remoteAgentEnvironment: IRemoteAgentEnvironment | null | undefined;
	private separator: string = '/';
	private readonly onBusyChangeEmitter = this._register(new Emitter<boolean>());
	private updatingPromise: CancelablePromise<boolean> | undefined;

	private _showDotFiles: boolean = true;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ILabelService private readonly labelService: ILabelService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@INotificationService private readonly notificationService: INotificationService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IPathService protected readonly pathService: IPathService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();
		this.remoteAuthority = this.environmentService.remoteAuthority;
		this.contextKey = RemoteFileDialogContext.bindTo(contextKeyService);
		this.scheme = this.pathService.defaultUriScheme;

		this.getShowDotFiles();
		const disposableStore = this._register(new DisposableStore());
		disposableStore.add(this.storageService.onDidChangeValue(StorageScope.WORKSPACE, 'remoteFileDialog.showDotFiles', disposableStore)(async _ => {
			this.getShowDotFiles();
			this.setButtons();
			const startingValue = this.filePickBox.value;
			const folderValue = this.pathFromUri(this.currentFolder, true);
			this.filePickBox.value = folderValue;
			await this.tryUpdateItems(folderValue, this.currentFolder, true);
			this.filePickBox.value = startingValue;
		}));
	}

	private setShowDotFiles(showDotFiles: boolean) {
		this.storageService.store('remoteFileDialog.showDotFiles', showDotFiles, StorageScope.WORKSPACE, StorageTarget.USER);
	}

	private getShowDotFiles() {
		this._showDotFiles = this.storageService.getBoolean('remoteFileDialog.showDotFiles', StorageScope.WORKSPACE, true);
	}

	set busy(busy: boolean) {
		if (this.filePickBox.busy !== busy) {
			this.filePickBox.busy = busy;
			this.onBusyChangeEmitter.fire(busy);
		}
	}

	get busy(): boolean {
		return this.filePickBox.busy;
	}

	public async showOpenDialog(options: IOpenDialogOptions = {}): Promise<URI | undefined> {
		this.scheme = this.getScheme(options.availableFileSystems, options.defaultUri);
		this.userHome = await this.getUserHome();
		this.trueHome = await this.getUserHome(true);
		const newOptions = this.getOptions(options);
		if (!newOptions) {
			return Promise.resolve(undefined);
		}
		this.options = newOptions;
		return this.pickResource();
	}

	public async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
		this.scheme = this.getScheme(options.availableFileSystems, options.defaultUri);
		this.userHome = await this.getUserHome();
		this.trueHome = await this.getUserHome(true);
		this.requiresTrailing = true;
		const newOptions = this.getOptions(options, true);
		if (!newOptions) {
			return Promise.resolve(undefined);
		}
		this.options = newOptions;
		this.options.canSelectFolders = true;
		this.options.canSelectFiles = true;

		return new Promise<URI | undefined>((resolve) => {
			this.pickResource(true).then(folderUri => {
				resolve(folderUri);
			});
		});
	}

	private getOptions(options: ISaveDialogOptions | IOpenDialogOptions, isSave: boolean = false): IOpenDialogOptions | undefined {
		let defaultUri: URI | undefined = undefined;
		let filename: string | undefined = undefined;
		if (options.defaultUri) {
			defaultUri = (this.scheme === options.defaultUri.scheme) ? options.defaultUri : undefined;
			filename = isSave ? resources.basename(options.defaultUri) : undefined;
		}
		if (!defaultUri) {
			defaultUri = this.userHome;
			if (filename) {
				defaultUri = resources.joinPath(defaultUri, filename);
			}
		}
		if ((this.scheme !== Schemas.file) && !this.fileService.hasProvider(defaultUri)) {
			this.notificationService.info(nls.localize('remoteFileDialog.notConnectedToRemote', 'File system provider for {0} is not available.', defaultUri.toString()));
			return undefined;
		}
		const newOptions: IOpenDialogOptions = objects.deepClone(options);
		newOptions.defaultUri = defaultUri;
		return newOptions;
	}

	private remoteUriFrom(path: string, hintUri?: URI): URI {
		if (!path.startsWith('\\\\')) {
			path = path.replace(/\\/g, '/');
		}
		const uri: URI = this.scheme === Schemas.file ? URI.file(path) : URI.from({ scheme: this.scheme, path, query: hintUri?.query, fragment: hintUri?.fragment });
		// If the default scheme is file, then we don't care about the remote authority or the hint authority
		const authority = (uri.scheme === Schemas.file) ? undefined : (this.remoteAuthority ?? hintUri?.authority);
		return resources.toLocalResource(uri, authority,
			// If there is a remote authority, then we should use the system's default URI as the local scheme.
			// If there is *no* remote authority, then we should use the default scheme for this dialog as that is already local.
			authority ? this.pathService.defaultUriScheme : uri.scheme);
	}

	private getScheme(available: readonly string[] | undefined, defaultUri: URI | undefined): string {
		if (available && available.length > 0) {
			if (defaultUri && (available.indexOf(defaultUri.scheme) >= 0)) {
				return defaultUri.scheme;
			}
			return available[0];
		} else if (defaultUri) {
			return defaultUri.scheme;
		}
		return Schemas.file;
	}

	private async getRemoteAgentEnvironment(): Promise<IRemoteAgentEnvironment | null> {
		if (this.remoteAgentEnvironment === undefined) {
			this.remoteAgentEnvironment = await this.remoteAgentService.getEnvironment();
		}
		return this.remoteAgentEnvironment;
	}

	protected getUserHome(trueHome = false): Promise<URI> {
		return trueHome
			? this.pathService.userHome({ preferLocal: this.scheme === Schemas.file })
			: this.fileDialogService.preferredHome(this.scheme);
	}

	private async pickResource(isSave: boolean = false): Promise<URI | undefined> {
		this.allowFolderSelection = !!this.options.canSelectFolders;
		this.allowFileSelection = !!this.options.canSelectFiles;
		this.separator = this.labelService.getSeparator(this.scheme, this.remoteAuthority);
		this.hidden = false;
		this.isWindows = await this.checkIsWindowsOS();
		let homedir: URI = this.options.defaultUri ? this.options.defaultUri : this.workspaceContextService.getWorkspace().folders[0].uri;
		let stat: IFileStatWithPartialMetadata | undefined;
		const ext: string = resources.extname(homedir);
		if (this.options.defaultUri) {
			try {
				stat = await this.fileService.stat(this.options.defaultUri);
			} catch (e) {
				// The file or folder doesn't exist
			}
			if (!stat || !stat.isDirectory) {
				homedir = resources.dirname(this.options.defaultUri);
				this.trailing = resources.basename(this.options.defaultUri);
			}
		}

		return new Promise<URI | undefined>((resolve) => {
			this.filePickBox = this._register(this.quickInputService.createQuickPick<FileQuickPickItem>());
			this.busy = true;
			this.filePickBox.matchOnLabel = false;
			this.filePickBox.sortByLabel = false;
			this.filePickBox.ignoreFocusOut = true;
			this.filePickBox.placeholder = nls.localize('remoteFileDialog.placeholder', "Folder path");
			this.filePickBox.ok = true;
			this.filePickBox.okLabel = typeof this.options.openLabel === 'string' ? this.options.openLabel : this.options.openLabel?.withoutMnemonic;
			if ((this.scheme !== Schemas.file) && this.options && this.options.availableFileSystems && (this.options.availableFileSystems.length > 1) && (this.options.availableFileSystems.indexOf(Schemas.file) > -1)) {
				this.filePickBox.customButton = true;
				this.filePickBox.customLabel = nls.localize('remoteFileDialog.local', 'Show Local');
				this.filePickBox.customButtonSecondary = true;
				let action;
				if (isSave) {
					action = SaveLocalFileCommand;
				} else {
					action = this.allowFileSelection ? (this.allowFolderSelection ? OpenLocalFileFolderCommand : OpenLocalFileCommand) : OpenLocalFolderCommand;
				}
				const keybinding = this.keybindingService.lookupKeybinding(action.ID);
				if (keybinding) {
					const label = keybinding.getLabel();
					if (label) {
						this.filePickBox.customHover = format('{0} ({1})', action.LABEL, label);
					}
				}
			}

			this.setButtons();
			this._register(this.filePickBox.onDidTriggerButton(e => {
				this.setShowDotFiles(!this._showDotFiles);
			}));

			let isResolving: number = 0;
			let isAcceptHandled = false;
			this.currentFolder = resources.dirname(homedir);
			this.userEnteredPathSegment = '';
			this.autoCompletePathSegment = '';

			this.filePickBox.title = this.options.title;
			this.filePickBox.value = this.pathFromUri(this.currentFolder, true);
			this.filePickBox.valueSelection = [this.filePickBox.value.length, this.filePickBox.value.length];

			const doResolve = (uri: URI | undefined) => {
				if (uri) {
					uri = resources.addTrailingPathSeparator(uri, this.separator); // Ensures that c: is c:/ since this comes from user input and can be incorrect.
					// To be consistent, we should never have a trailing path separator on directories (or anything else). Will not remove from c:/.
					uri = resources.removeTrailingPathSeparator(uri);
				}
				resolve(uri);
				this.contextKey.set(false);
				this.dispose();
			};

			this._register(this.filePickBox.onDidCustom(() => {
				if (isAcceptHandled || this.busy) {
					return;
				}

				isAcceptHandled = true;
				isResolving++;
				if (this.options.availableFileSystems && (this.options.availableFileSystems.length > 1)) {
					this.options.availableFileSystems = this.options.availableFileSystems.slice(1);
				}
				this.filePickBox.hide();
				if (isSave) {
					return this.fileDialogService.showSaveDialog(this.options).then(result => {
						doResolve(result);
					});
				} else {
					return this.fileDialogService.showOpenDialog(this.options).then(result => {
						doResolve(result ? result[0] : undefined);
					});
				}
			}));

			const handleAccept = () => {
				if (this.busy) {
					// Save the accept until the file picker is not busy.
					this.onBusyChangeEmitter.event((busy: boolean) => {
						if (!busy) {
							handleAccept();
						}
					});
					return;
				} else if (isAcceptHandled) {
					return;
				}

				isAcceptHandled = true;
				isResolving++;
				this.onDidAccept().then(resolveValue => {
					if (resolveValue) {
						this.filePickBox.hide();
						doResolve(resolveValue);
					} else if (this.hidden) {
						doResolve(undefined);
					} else {
						isResolving--;
						isAcceptHandled = false;
					}
				});
			};

			this._register(this.filePickBox.onDidAccept(_ => {
				handleAccept();
			}));

			this._register(this.filePickBox.onDidChangeActive(i => {
				isAcceptHandled = false;
				// update input box to match the first selected item
				if ((i.length === 1) && this.isSelectionChangeFromUser()) {
					this.filePickBox.validationMessage = undefined;
					const userPath = this.constructFullUserPath();
					if (!equalsIgnoreCase(this.filePickBox.value.substring(0, userPath.length), userPath)) {
						this.filePickBox.valueSelection = [0, this.filePickBox.value.length];
						this.insertText(userPath, userPath);
					}
					this.setAutoComplete(userPath, this.userEnteredPathSegment, i[0], true);
				}
			}));

			this._register(this.filePickBox.onDidChangeValue(async value => {
				return this.handleValueChange(value);
			}));
			this._register(this.filePickBox.onDidHide(() => {
				this.hidden = true;
				if (isResolving === 0) {
					doResolve(undefined);
				}
			}));

			this.filePickBox.show();
			this.contextKey.set(true);
			this.updateItems(homedir, true, this.trailing).then(() => {
				if (this.trailing) {
					this.filePickBox.valueSelection = [this.filePickBox.value.length - this.trailing.length, this.filePickBox.value.length - ext.length];
				} else {
					this.filePickBox.valueSelection = [this.filePickBox.value.length, this.filePickBox.value.length];
				}
				this.busy = false;
			});
		});
	}

	public override dispose(): void {
		super.dispose();
	}

	private async handleValueChange(value: string) {
		try {
			// onDidChangeValue can also be triggered by the auto complete, so if it looks like the auto complete, don't do anything
			if (this.isValueChangeFromUser()) {
				// If the user has just entered more bad path, don't change anything
				if (!equalsIgnoreCase(value, this.constructFullUserPath()) && (!this.isBadSubpath(value) || this.canTildaEscapeHatch(value))) {
					this.filePickBox.validationMessage = undefined;
					const filePickBoxUri = this.filePickBoxValue();
					let updated: UpdateResult = UpdateResult.NotUpdated;
					if (!resources.extUriIgnorePathCase.isEqual(this.currentFolder, filePickBoxUri)) {
						updated = await this.tryUpdateItems(value, filePickBoxUri);
					}
					if ((updated === UpdateResult.NotUpdated) || (updated === UpdateResult.UpdatedWithTrailing)) {
						this.setActiveItems(value);
					}
				} else {
					this.filePickBox.activeItems = [];
					this.userEnteredPathSegment = '';
				}
			}
		} catch {
			// Since any text can be entered in the input box, there is potential for error causing input. If this happens, do nothing.
		}
	}

	private setButtons() {
		this.filePickBox.buttons = [{
			iconClass: this._showDotFiles ? ThemeIcon.asClassName(Codicon.eye) : ThemeIcon.asClassName(Codicon.eyeClosed),
			tooltip: this._showDotFiles ? nls.localize('remoteFileDialog.hideDotFiles', "Hide dot files") : nls.localize('remoteFileDialog.showDotFiles', "Show dot files"),
			alwaysVisible: true
		}];
	}

	private isBadSubpath(value: string) {
		return this.badPath && (value.length > this.badPath.length) && equalsIgnoreCase(value.substring(0, this.badPath.length), this.badPath);
	}

	private isValueChangeFromUser(): boolean {
		if (equalsIgnoreCase(this.filePickBox.value, this.pathAppend(this.currentFolder, this.userEnteredPathSegment + this.autoCompletePathSegment))) {
			return false;
		}
		return true;
	}

	private isSelectionChangeFromUser(): boolean {
		if (this.activeItem === (this.filePickBox.activeItems ? this.filePickBox.activeItems[0] : undefined)) {
			return false;
		}
		return true;
	}

	private constructFullUserPath(): string {
		const currentFolderPath = this.pathFromUri(this.currentFolder);
		if (equalsIgnoreCase(this.filePickBox.value.substr(0, this.userEnteredPathSegment.length), this.userEnteredPathSegment)) {
			if (equalsIgnoreCase(this.filePickBox.value.substr(0, currentFolderPath.length), currentFolderPath)) {
				return currentFolderPath;
			} else {
				return this.userEnteredPathSegment;
			}
		} else {
			return this.pathAppend(this.currentFolder, this.userEnteredPathSegment);
		}
	}

	private filePickBoxValue(): URI {
		// The file pick box can't render everything, so we use the current folder to create the uri so that it is an existing path.
		const directUri = this.remoteUriFrom(this.filePickBox.value.trimRight(), this.currentFolder);
		const currentPath = this.pathFromUri(this.currentFolder);
		if (equalsIgnoreCase(this.filePickBox.value, currentPath)) {
			return this.currentFolder;
		}
		const currentDisplayUri = this.remoteUriFrom(currentPath, this.currentFolder);
		const relativePath = resources.relativePath(currentDisplayUri, directUri);
		const isSameRoot = (this.filePickBox.value.length > 1 && currentPath.length > 1) ? equalsIgnoreCase(this.filePickBox.value.substr(0, 2), currentPath.substr(0, 2)) : false;
		if (relativePath && isSameRoot) {
			let path = resources.joinPath(this.currentFolder, relativePath);
			const directBasename = resources.basename(directUri);
			if ((directBasename === '.') || (directBasename === '..')) {
				path = this.remoteUriFrom(this.pathAppend(path, directBasename), this.currentFolder);
			}
			return resources.hasTrailingPathSeparator(directUri) ? resources.addTrailingPathSeparator(path) : path;
		} else {
			return directUri;
		}
	}

	private async onDidAccept(): Promise<URI | undefined> {
		this.busy = true;
		if (!this.updatingPromise && this.filePickBox.activeItems.length === 1) {
			const item = this.filePickBox.selectedItems[0];
			if (item.isFolder) {
				if (this.trailing) {
					await this.updateItems(item.uri, true, this.trailing);
				} else {
					// When possible, cause the update to happen by modifying the input box.
					// This allows all input box updates to happen first, and uses the same code path as the user typing.
					const newPath = this.pathFromUri(item.uri);
					if (startsWithIgnoreCase(newPath, this.filePickBox.value) && (equalsIgnoreCase(item.label, resources.basename(item.uri)))) {
						this.filePickBox.valueSelection = [this.pathFromUri(this.currentFolder).length, this.filePickBox.value.length];
						this.insertText(newPath, this.basenameWithTrailingSlash(item.uri));
					} else if ((item.label === '..') && startsWithIgnoreCase(this.filePickBox.value, newPath)) {
						this.filePickBox.valueSelection = [newPath.length, this.filePickBox.value.length];
						this.insertText(newPath, '');
					} else {
						await this.updateItems(item.uri, true);
					}
				}
				this.filePickBox.busy = false;
				return;
			}
		} else if (!this.updatingPromise) {
			// If the items have updated, don't try to resolve
			if ((await this.tryUpdateItems(this.filePickBox.value, this.filePickBoxValue())) !== UpdateResult.NotUpdated) {
				this.filePickBox.busy = false;
				return;
			}
		}

		let resolveValue: URI | undefined;
		// Find resolve value
		if (this.filePickBox.activeItems.length === 0) {
			resolveValue = this.filePickBoxValue();
		} else if (this.filePickBox.activeItems.length === 1) {
			resolveValue = this.filePickBox.selectedItems[0].uri;
		}
		if (resolveValue) {
			resolveValue = this.addPostfix(resolveValue);
		}
		if (await this.validate(resolveValue)) {
			this.busy = false;
			return resolveValue;
		}
		this.busy = false;
		return undefined;
	}

	private root(value: URI) {
		let lastDir = value;
		let dir = resources.dirname(value);
		while (!resources.isEqual(lastDir, dir)) {
			lastDir = dir;
			dir = resources.dirname(dir);
		}
		return dir;
	}

	private canTildaEscapeHatch(value: string): boolean {
		return !!(value.endsWith('~') && this.isBadSubpath(value));
	}

	private tildaReplace(value: string): URI {
		const home = this.trueHome;
		if ((value.length > 0) && (value[0] === '~')) {
			return resources.joinPath(home, value.substring(1));
		} else if (this.canTildaEscapeHatch(value)) {
			return home;
		}
		return this.remoteUriFrom(value);
	}

	private tryAddTrailingSeparatorToDirectory(uri: URI, stat: IFileStatWithPartialMetadata): URI {
		if (stat.isDirectory) {
			// At this point we know it's a directory and can add the trailing path separator
			if (!this.endsWithSlash(uri.path)) {
				return resources.addTrailingPathSeparator(uri);
			}
		}
		return uri;
	}

	private async tryUpdateItems(value: string, valueUri: URI, reset: boolean = false): Promise<UpdateResult> {
		if ((value.length > 0) && ((value[0] === '~') || this.canTildaEscapeHatch(value))) {
			const newDir = this.tildaReplace(value);
			return await this.updateItems(newDir, true) ? UpdateResult.UpdatedWithTrailing : UpdateResult.Updated;
		} else if (value === '\\') {
			valueUri = this.root(this.currentFolder);
			value = this.pathFromUri(valueUri);
			return await this.updateItems(valueUri, true) ? UpdateResult.UpdatedWithTrailing : UpdateResult.Updated;
		} else {
			const newFolderIsOldFolder = resources.extUriIgnorePathCase.isEqual(this.currentFolder, valueUri);
			const newFolderIsSubFolder = resources.extUriIgnorePathCase.isEqual(this.currentFolder, resources.dirname(valueUri));
			const newFolderIsParent = resources.extUriIgnorePathCase.isEqualOrParent(this.currentFolder, resources.dirname(valueUri));
			const newFolderIsUnrelated = !newFolderIsParent && !newFolderIsSubFolder;
			if ((!newFolderIsOldFolder && (this.endsWithSlash(value) || newFolderIsParent || newFolderIsUnrelated)) || reset) {
				let stat: IFileStatWithPartialMetadata | undefined;
				try {
					stat = await this.fileService.stat(valueUri);
				} catch (e) {
					// do nothing
				}
				if (stat?.isDirectory && (resources.basename(valueUri) !== '.') && this.endsWithSlash(value)) {
					valueUri = this.tryAddTrailingSeparatorToDirectory(valueUri, stat);
					return await this.updateItems(valueUri) ? UpdateResult.UpdatedWithTrailing : UpdateResult.Updated;
				} else if (this.endsWithSlash(value)) {
					// The input box contains a path that doesn't exist on the system.
					this.filePickBox.validationMessage = nls.localize('remoteFileDialog.badPath', 'The path does not exist. Use ~ to go to your home directory.');
					// Save this bad path. It can take too long to a stat on every user entered character, but once a user enters a bad path they are likely
					// to keep typing more bad path. We can compare against this bad path and see if the user entered path starts with it.
					this.badPath = value;
					return UpdateResult.InvalidPath;
				} else {
					let inputUriDirname = resources.dirname(valueUri);
					const currentFolderWithoutSep = resources.removeTrailingPathSeparator(resources.addTrailingPathSeparator(this.currentFolder));
					const inputUriDirnameWithoutSep = resources.removeTrailingPathSeparator(resources.addTrailingPathSeparator(inputUriDirname));
					if (!resources.extUriIgnorePathCase.isEqual(currentFolderWithoutSep, inputUriDirnameWithoutSep)
						&& (!/^[a-zA-Z]:$/.test(this.filePickBox.value)
							|| !equalsIgnoreCase(this.pathFromUri(this.currentFolder).substring(0, this.filePickBox.value.length), this.filePickBox.value))) {
						let statWithoutTrailing: IFileStatWithPartialMetadata | undefined;
						try {
							statWithoutTrailing = await this.fileService.stat(inputUriDirname);
						} catch (e) {
							// do nothing
						}
						if (statWithoutTrailing?.isDirectory) {
							this.badPath = undefined;
							inputUriDirname = this.tryAddTrailingSeparatorToDirectory(inputUriDirname, statWithoutTrailing);
							return await this.updateItems(inputUriDirname, false, resources.basename(valueUri)) ? UpdateResult.UpdatedWithTrailing : UpdateResult.Updated;
						}
					}
				}
			}
		}
		this.badPath = undefined;
		return UpdateResult.NotUpdated;
	}

	private tryUpdateTrailing(value: URI) {
		const ext = resources.extname(value);
		if (this.trailing && ext) {
			this.trailing = resources.basename(value);
		}
	}

	private setActiveItems(value: string) {
		value = this.pathFromUri(this.tildaReplace(value));
		const asUri = this.remoteUriFrom(value);
		const inputBasename = resources.basename(asUri);
		const userPath = this.constructFullUserPath();
		// Make sure that the folder whose children we are currently viewing matches the path in the input
		const pathsEqual = equalsIgnoreCase(userPath, value.substring(0, userPath.length)) ||
			equalsIgnoreCase(value, userPath.substring(0, value.length));
		if (pathsEqual) {
			let hasMatch = false;
			for (let i = 0; i < this.filePickBox.items.length; i++) {
				const item = <FileQuickPickItem>this.filePickBox.items[i];
				if (this.setAutoComplete(value, inputBasename, item)) {
					hasMatch = true;
					break;
				}
			}
			if (!hasMatch) {
				const userBasename = inputBasename.length >= 2 ? userPath.substring(userPath.length - inputBasename.length + 2) : '';
				this.userEnteredPathSegment = (userBasename === inputBasename) ? inputBasename : '';
				this.autoCompletePathSegment = '';
				this.filePickBox.activeItems = [];
				this.tryUpdateTrailing(asUri);
			}
		} else {
			this.userEnteredPathSegment = inputBasename;
			this.autoCompletePathSegment = '';
			this.filePickBox.activeItems = [];
			this.tryUpdateTrailing(asUri);
		}
	}

	private setAutoComplete(startingValue: string, startingBasename: string, quickPickItem: FileQuickPickItem, force: boolean = false): boolean {
		if (this.busy) {
			// We're in the middle of something else. Doing an auto complete now can result jumbled or incorrect autocompletes.
			this.userEnteredPathSegment = startingBasename;
			this.autoCompletePathSegment = '';
			return false;
		}
		const itemBasename = quickPickItem.label;
		// Either force the autocomplete, or the old value should be one smaller than the new value and match the new value.
		if (itemBasename === '..') {
			// Don't match on the up directory item ever.
			this.userEnteredPathSegment = '';
			this.autoCompletePathSegment = '';
			this.activeItem = quickPickItem;
			if (force) {
				// clear any selected text
				getActiveDocument().execCommand('insertText', false, '');
			}
			return false;
		} else if (!force && (itemBasename.length >= startingBasename.length) && equalsIgnoreCase(itemBasename.substr(0, startingBasename.length), startingBasename)) {
			this.userEnteredPathSegment = startingBasename;
			this.activeItem = quickPickItem;
			// Changing the active items will trigger the onDidActiveItemsChanged. Clear the autocomplete first, then set it after.
			this.autoCompletePathSegment = '';
			if (quickPickItem.isFolder || !this.trailing) {
				this.filePickBox.activeItems = [quickPickItem];
			} else {
				this.filePickBox.activeItems = [];
			}
			return true;
		} else if (force && (!equalsIgnoreCase(this.basenameWithTrailingSlash(quickPickItem.uri), (this.userEnteredPathSegment + this.autoCompletePathSegment)))) {
			this.userEnteredPathSegment = '';
			if (!this.accessibilityService.isScreenReaderOptimized()) {
				this.autoCompletePathSegment = this.trimTrailingSlash(itemBasename);
			}
			this.activeItem = quickPickItem;
			if (!this.accessibilityService.isScreenReaderOptimized()) {
				this.filePickBox.valueSelection = [this.pathFromUri(this.currentFolder, true).length, this.filePickBox.value.length];
				// use insert text to preserve undo buffer
				this.insertText(this.pathAppend(this.currentFolder, this.autoCompletePathSegment), this.autoCompletePathSegment);
				this.filePickBox.valueSelection = [this.filePickBox.value.length - this.autoCompletePathSegment.length, this.filePickBox.value.length];
			}
			return true;
		} else {
			this.userEnteredPathSegment = startingBasename;
			this.autoCompletePathSegment = '';
			return false;
		}
	}

	private insertText(wholeValue: string, insertText: string) {
		if (this.filePickBox.inputHasFocus()) {
			getActiveDocument().execCommand('insertText', false, insertText);
			if (this.filePickBox.value !== wholeValue) {
				this.filePickBox.value = wholeValue;
				this.handleValueChange(wholeValue);
			}
		} else {
			this.filePickBox.value = wholeValue;
			this.handleValueChange(wholeValue);
		}
	}

	private addPostfix(uri: URI): URI {
		let result = uri;
		if (this.requiresTrailing && this.options.filters && this.options.filters.length > 0 && !resources.hasTrailingPathSeparator(uri)) {
			// Make sure that the suffix is added. If the user deleted it, we automatically add it here
			let hasExt: boolean = false;
			const currentExt = resources.extname(uri).substr(1);
			for (let i = 0; i < this.options.filters.length; i++) {
				for (let j = 0; j < this.options.filters[i].extensions.length; j++) {
					if ((this.options.filters[i].extensions[j] === '*') || (this.options.filters[i].extensions[j] === currentExt)) {
						hasExt = true;
						break;
					}
				}
				if (hasExt) {
					break;
				}
			}
			if (!hasExt) {
				result = resources.joinPath(resources.dirname(uri), resources.basename(uri) + '.' + this.options.filters[0].extensions[0]);
			}
		}
		return result;
	}

	private trimTrailingSlash(path: string): string {
		return ((path.length > 1) && this.endsWithSlash(path)) ? path.substr(0, path.length - 1) : path;
	}

	private yesNoPrompt(uri: URI, message: string): Promise<boolean> {
		interface YesNoItem extends IQuickPickItem {
			value: boolean;
		}
		const disposableStore = new DisposableStore();
		const prompt = disposableStore.add(this.quickInputService.createQuickPick<YesNoItem>());
		prompt.title = message;
		prompt.ignoreFocusOut = true;
		prompt.ok = true;
		prompt.customButton = true;
		prompt.customLabel = nls.localize('remoteFileDialog.cancel', 'Cancel');
		prompt.customButtonSecondary = true;
		prompt.value = this.pathFromUri(uri);

		let isResolving = false;
		return new Promise<boolean>(resolve => {
			disposableStore.add(prompt.onDidAccept(() => {
				isResolving = true;
				prompt.hide();
				resolve(true);
			}));
			disposableStore.add(prompt.onDidHide(() => {
				if (!isResolving) {
					resolve(false);
				}
				this.filePickBox.show();
				this.hidden = false;
				disposableStore.dispose();
			}));
			disposableStore.add(prompt.onDidChangeValue(() => {
				prompt.hide();
			}));
			disposableStore.add(prompt.onDidCustom(() => {
				prompt.hide();
			}));
			prompt.show();
		});
	}

	private async validate(uri: URI | undefined): Promise<boolean> {
		if (uri === undefined) {
			this.filePickBox.validationMessage = nls.localize('remoteFileDialog.invalidPath', 'Please enter a valid path.');
			return Promise.resolve(false);
		}

		let stat: IFileStatWithPartialMetadata | undefined;
		let statDirname: IFileStatWithPartialMetadata | undefined;
		try {
			statDirname = await this.fileService.stat(resources.dirname(uri));
			stat = await this.fileService.stat(uri);
		} catch (e) {
			// do nothing
		}

		if (this.requiresTrailing) { // save
			if (stat?.isDirectory) {
				// Can't do this
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateFolder', 'The folder already exists. Please use a new file name.');
				return Promise.resolve(false);
			} else if (stat) {
				// Replacing a file.
				// Show a yes/no prompt
				const message = nls.localize('remoteFileDialog.validateExisting', '{0} already exists. Are you sure you want to overwrite it?', resources.basename(uri));
				return this.yesNoPrompt(uri, message);
			} else if (!(isValidBasename(resources.basename(uri), this.isWindows))) {
				// Filename not allowed
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateBadFilename', 'Please enter a valid file name.');
				return Promise.resolve(false);
			} else if (!statDirname) {
				// Folder to save in doesn't exist
				const message = nls.localize('remoteFileDialog.validateCreateDirectory', 'The folder {0} does not exist. Would you like to create it?', resources.basename(resources.dirname(uri)));
				return this.yesNoPrompt(uri, message);
			} else if (!statDirname.isDirectory) {
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateNonexistentDir', 'Please enter a path that exists.');
				return Promise.resolve(false);
			} else if (statDirname.readonly) {
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateReadonlyFolder', 'This folder cannot be used as a save destination. Please choose another folder');
				return Promise.resolve(false);
			}
		} else { // open
			if (!stat) {
				// File or folder doesn't exist
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateNonexistentDir', 'Please enter a path that exists.');
				return Promise.resolve(false);
			} else if (uri.path === '/' && this.isWindows) {
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.windowsDriveLetter', 'Please start the path with a drive letter.');
				return Promise.resolve(false);
			} else if (stat.isDirectory && !this.allowFolderSelection) {
				// Folder selected when folder selection not permitted
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateFileOnly', 'Please select a file.');
				return Promise.resolve(false);
			} else if (!stat.isDirectory && !this.allowFileSelection) {
				// File selected when file selection not permitted
				this.filePickBox.validationMessage = nls.localize('remoteFileDialog.validateFolderOnly', 'Please select a folder.');
				return Promise.resolve(false);
			}
		}
		return Promise.resolve(true);
	}

	// Returns true if there is a file at the end of the URI.
	private async updateItems(newFolder: URI, force: boolean = false, trailing?: string): Promise<boolean> {
		this.busy = true;
		this.autoCompletePathSegment = '';
		const wasDotDot = trailing === '..';
		trailing = wasDotDot ? undefined : trailing;
		const isSave = !!trailing;
		let result = false;

		const updatingPromise = createCancelablePromise(async token => {
			let folderStat: IFileStat | undefined;
			try {
				folderStat = await this.fileService.resolve(newFolder);
				if (!folderStat.isDirectory) {
					trailing = resources.basename(newFolder);
					newFolder = resources.dirname(newFolder);
					folderStat = undefined;
					result = true;
				}
			} catch (e) {
				// The file/directory doesn't exist
			}
			const newValue = trailing ? this.pathAppend(newFolder, trailing) : this.pathFromUri(newFolder, true);
			this.currentFolder = this.endsWithSlash(newFolder.path) ? newFolder : resources.addTrailingPathSeparator(newFolder, this.separator);
			this.userEnteredPathSegment = trailing ? trailing : '';

			return this.createItems(folderStat, this.currentFolder, token).then(items => {
				if (token.isCancellationRequested) {
					this.busy = false;
					return false;
				}

				this.filePickBox.itemActivation = ItemActivation.NONE;
				this.filePickBox.items = items;

				// the user might have continued typing while we were updating. Only update the input box if it doesn't match the directory.
				if (!equalsIgnoreCase(this.filePickBox.value, newValue) && (force || wasDotDot)) {
					this.filePickBox.valueSelection = [0, this.filePickBox.value.length];
					this.insertText(newValue, newValue);
				}
				if (force && trailing && isSave) {
					// Keep the cursor position in front of the save as name.
					this.filePickBox.valueSelection = [this.filePickBox.value.length - trailing.length, this.filePickBox.value.length - trailing.length];
				} else if (!trailing) {
					// If there is trailing, we don't move the cursor. If there is no trailing, cursor goes at the end.
					this.filePickBox.valueSelection = [this.filePickBox.value.length, this.filePickBox.value.length];
				}
				this.busy = false;
				this.updatingPromise = undefined;
				return result;
			});
		});

		if (this.updatingPromise !== undefined) {
			this.updatingPromise.cancel();
		}
		this.updatingPromise = updatingPromise;

		return updatingPromise;
	}

	private pathFromUri(uri: URI, endWithSeparator: boolean = false): string {
		let result: string = normalizeDriveLetter(uri.fsPath, this.isWindows).replace(/\n/g, '');
		if (this.separator === '/') {
			result = result.replace(/\\/g, this.separator);
		} else {
			result = result.replace(/\//g, this.separator);
		}
		if (endWithSeparator && !this.endsWithSlash(result)) {
			result = result + this.separator;
		}
		return result;
	}

	private pathAppend(uri: URI, additional: string): string {
		if ((additional === '..') || (additional === '.')) {
			const basePath = this.pathFromUri(uri, true);
			return basePath + additional;
		} else {
			return this.pathFromUri(resources.joinPath(uri, additional));
		}
	}

	private async checkIsWindowsOS(): Promise<boolean> {
		let isWindowsOS = isWindows;
		const env = await this.getRemoteAgentEnvironment();
		if (env) {
			isWindowsOS = env.os === OperatingSystem.Windows;
		}
		return isWindowsOS;
	}

	private endsWithSlash(s: string) {
		return /[\/\\]$/.test(s);
	}

	private basenameWithTrailingSlash(fullPath: URI): string {
		const child = this.pathFromUri(fullPath, true);
		const parent = this.pathFromUri(resources.dirname(fullPath), true);
		return child.substring(parent.length);
	}

	private async createBackItem(currFolder: URI): Promise<FileQuickPickItem | undefined> {
		const fileRepresentationCurr = this.currentFolder.with({ scheme: Schemas.file, authority: '' });
		const fileRepresentationParent = resources.dirname(fileRepresentationCurr);
		if (!resources.isEqual(fileRepresentationCurr, fileRepresentationParent)) {
			const parentFolder = resources.dirname(currFolder);
			if (await this.fileService.exists(parentFolder)) {
				return { label: '..', uri: resources.addTrailingPathSeparator(parentFolder, this.separator), isFolder: true };
			}
		}
		return undefined;
	}

	private async createItems(folder: IFileStat | undefined, currentFolder: URI, token: CancellationToken): Promise<FileQuickPickItem[]> {
		const result: FileQuickPickItem[] = [];

		const backDir = await this.createBackItem(currentFolder);
		try {
			if (!folder) {
				folder = await this.fileService.resolve(currentFolder);
			}
			const filteredChildren = this._showDotFiles ? folder.children : folder.children?.filter(child => !child.name.startsWith('.'));
			const items = filteredChildren ? await Promise.all(filteredChildren.map(child => this.createItem(child, currentFolder, token))) : [];
			for (const item of items) {
				if (item) {
					result.push(item);
				}
			}
		} catch (e) {
			// ignore
			console.log(e);
		}
		if (token.isCancellationRequested) {
			return [];
		}
		const sorted = result.sort((i1, i2) => {
			if (i1.isFolder !== i2.isFolder) {
				return i1.isFolder ? -1 : 1;
			}
			const trimmed1 = this.endsWithSlash(i1.label) ? i1.label.substr(0, i1.label.length - 1) : i1.label;
			const trimmed2 = this.endsWithSlash(i2.label) ? i2.label.substr(0, i2.label.length - 1) : i2.label;
			return trimmed1.localeCompare(trimmed2);
		});

		if (backDir) {
			sorted.unshift(backDir);
		}
		return sorted;
	}

	private filterFile(file: URI): boolean {
		if (this.options.filters) {
			for (let i = 0; i < this.options.filters.length; i++) {
				for (let j = 0; j < this.options.filters[i].extensions.length; j++) {
					const testExt = this.options.filters[i].extensions[j];
					if ((testExt === '*') || (file.path.endsWith('.' + testExt))) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	}

	private async createItem(stat: IFileStat, parent: URI, token: CancellationToken): Promise<FileQuickPickItem | undefined> {
		if (token.isCancellationRequested) {
			return undefined;
		}
		let fullPath = resources.joinPath(parent, stat.name);
		if (stat.isDirectory) {
			const filename = resources.basename(fullPath);
			fullPath = resources.addTrailingPathSeparator(fullPath, this.separator);
			return { label: filename, uri: fullPath, isFolder: true, iconClasses: getIconClasses(this.modelService, this.languageService, fullPath || undefined, FileKind.FOLDER) };
		} else if (!stat.isDirectory && this.allowFileSelection && this.filterFile(fullPath)) {
			return { label: stat.name, uri: fullPath, isFolder: false, iconClasses: getIconClasses(this.modelService, this.languageService, fullPath || undefined) };
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dialogs/common/dialogService.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/common/dialogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../../base/common/severity.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IAsyncPromptResult, IAsyncPromptResultWithCancel, IConfirmation, IConfirmationResult, IDialogService, IInput, IInputResult, IPrompt, IPromptResult, IPromptResultWithCancel, IPromptWithCustomCancel, IPromptWithDefaultCancel } from '../../../../platform/dialogs/common/dialogs.js';
import { DialogsModel } from '../../../common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class DialogService extends Disposable implements IDialogService {

	declare readonly _serviceBrand: undefined;

	readonly model = this._register(new DialogsModel());

	readonly onWillShowDialog = this.model.onWillShowDialog;

	readonly onDidShowDialog = this.model.onDidShowDialog;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super();
	}

	private skipDialogs(): boolean {
		if (this.environmentService.enableSmokeTestDriver) {
			this.logService.warn('DialogService: Dialog requested during smoke test.');
		}
		// integration tests
		return this.environmentService.isExtensionDevelopment && !!this.environmentService.extensionTestsLocationURI;
	}

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		if (this.skipDialogs()) {
			this.logService.trace('DialogService: refused to show confirmation dialog in tests.');

			return { confirmed: true };
		}

		const handle = this.model.show({ confirmArgs: { confirmation } });

		return await handle.result as IConfirmationResult;
	}

	prompt<T>(prompt: IPromptWithCustomCancel<T>): Promise<IPromptResultWithCancel<T>>;
	prompt<T>(prompt: IPromptWithDefaultCancel<T>): Promise<IPromptResult<T>>;
	prompt<T>(prompt: IPrompt<T>): Promise<IPromptResult<T>>;
	async prompt<T>(prompt: IPrompt<T> | IPromptWithCustomCancel<T> | IPromptWithDefaultCancel<T>): Promise<IPromptResult<T> | IPromptResultWithCancel<T>> {
		if (this.skipDialogs()) {
			throw new Error(`DialogService: refused to show dialog in tests. Contents: ${prompt.message}`);
		}

		const handle = this.model.show({ promptArgs: { prompt } });

		const dialogResult = await handle.result as IAsyncPromptResult<T> | IAsyncPromptResultWithCancel<T>;

		return {
			result: await dialogResult.result,
			checkboxChecked: dialogResult.checkboxChecked
		};
	}

	async input(input: IInput): Promise<IInputResult> {
		if (this.skipDialogs()) {
			throw new Error('DialogService: refused to show input dialog in tests.');
		}

		const handle = this.model.show({ inputArgs: { input } });

		return await handle.result as IInputResult;
	}

	async info(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Info, message, detail });
	}

	async warn(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Warning, message, detail });
	}

	async error(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Error, message, detail });
	}

	async about(): Promise<void> {
		if (this.skipDialogs()) {
			throw new Error('DialogService: refused to show about dialog in tests.');
		}

		const handle = this.model.show({});
		await handle.result;
	}
}

registerSingleton(IDialogService, DialogService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dialogs/electron-browser/fileDialogService.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/electron-browser/fileDialogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SaveDialogOptions, OpenDialogOptions } from '../../../../base/parts/sandbox/common/electronTypes.js';
import { IHostService } from '../../host/browser/host.js';
import { IPickAndOpenOptions, ISaveDialogOptions, IOpenDialogOptions, IFileDialogService, IDialogService, INativeOpenDialogOptions } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IHistoryService } from '../../history/common/history.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { INativeHostOptions, INativeHostService } from '../../../../platform/native/common/native.js';
import { AbstractFileDialogService } from '../browser/abstractFileDialogService.js';
import { Schemas } from '../../../../base/common/network.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IPathService } from '../../path/common/pathService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';

export class FileDialogService extends AbstractFileDialogService implements IFileDialogService {

	constructor(
		@IHostService hostService: IHostService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IHistoryService historyService: IHistoryService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IFileService fileService: IFileService,
		@IOpenerService openerService: IOpenerService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IDialogService dialogService: IDialogService,
		@ILanguageService languageService: ILanguageService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@ILabelService labelService: ILabelService,
		@IPathService pathService: IPathService,
		@ICommandService commandService: ICommandService,
		@IEditorService editorService: IEditorService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ILogService logService: ILogService
	) {
		super(hostService, contextService, historyService, environmentService, instantiationService,
			configurationService, fileService, openerService, dialogService, languageService, workspacesService, labelService, pathService, commandService, editorService, codeEditorService, logService);
	}

	private toNativeOpenDialogOptions(options: IPickAndOpenOptions): INativeOpenDialogOptions {
		return {
			forceNewWindow: options.forceNewWindow,
			telemetryExtraData: options.telemetryExtraData,
			defaultPath: options.defaultUri?.fsPath
		};
	}

	private shouldUseSimplified(schema: string): { useSimplified: boolean; isSetting: boolean } {
		const setting = (this.configurationService.getValue('files.simpleDialog.enable') === true);
		const newWindowSetting = (this.configurationService.getValue('window.openFilesInNewWindow') === 'on');
		return {
			// - Only real files can be shown in the native file picker
			// - If the simple file dialog is enabled
			// - driver automation (like smoke tests) can use the simple file dialog but not native
			useSimplified: ((schema !== Schemas.file) && (schema !== Schemas.vscodeUserData)) || setting || !!this.environmentService.enableSmokeTestDriver,
			isSetting: newWindowSetting
		};
	}

	async pickFileFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFilePath(schema);
		}

		const shouldUseSimplified = this.shouldUseSimplified(schema);
		if (shouldUseSimplified.useSimplified) {
			return this.pickFileFolderAndOpenSimplified(schema, options, shouldUseSimplified.isSetting);
		}
		return this.nativeHostService.pickFileFolderAndOpen(this.toNativeOpenDialogOptions(options));
	}

	async pickFileAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFilePath(schema);
		}

		const shouldUseSimplified = this.shouldUseSimplified(schema);
		if (shouldUseSimplified.useSimplified) {
			return this.pickFileAndOpenSimplified(schema, options, shouldUseSimplified.isSetting);
		}
		return this.nativeHostService.pickFileAndOpen(this.toNativeOpenDialogOptions(options));
	}

	async pickFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFolderPath(schema);
		}

		if (this.shouldUseSimplified(schema).useSimplified) {
			return this.pickFolderAndOpenSimplified(schema, options);
		}
		return this.nativeHostService.pickFolderAndOpen(this.toNativeOpenDialogOptions(options));
	}

	async pickWorkspaceAndOpen(options: IPickAndOpenOptions): Promise<void> {
		options.availableFileSystems = this.getWorkspaceAvailableFileSystems(options);
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultWorkspacePath(schema);
		}

		if (this.shouldUseSimplified(schema).useSimplified) {
			return this.pickWorkspaceAndOpenSimplified(schema, options);
		}
		return this.nativeHostService.pickWorkspaceAndOpen(this.toNativeOpenDialogOptions(options));
	}

	async pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined> {
		const schema = this.getFileSystemSchema({ defaultUri, availableFileSystems });
		const options = this.getPickFileToSaveDialogOptions(defaultUri, availableFileSystems);
		if (this.shouldUseSimplified(schema).useSimplified) {
			return this.pickFileToSaveSimplified(schema, options);
		} else {
			const result = await this.nativeHostService.showSaveDialog(this.toNativeSaveDialogOptions(options));
			if (result && !result.canceled && result.filePath) {
				const uri = URI.file(result.filePath);

				this.addFileToRecentlyOpened(uri);

				return uri;
			}
		}
		return;
	}

	private toNativeSaveDialogOptions(options: ISaveDialogOptions): SaveDialogOptions & INativeHostOptions {
		options.defaultUri = options.defaultUri ? URI.file(options.defaultUri.path) : undefined;
		return {
			defaultPath: options.defaultUri?.fsPath,
			buttonLabel: typeof options.saveLabel === 'string' ? options.saveLabel : options.saveLabel?.withMnemonic,
			filters: options.filters,
			title: options.title,
			targetWindowId: getActiveWindow().vscodeWindowId
		};
	}

	async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
		const schema = this.getFileSystemSchema(options);
		if (this.shouldUseSimplified(schema).useSimplified) {
			return this.showSaveDialogSimplified(schema, options);
		}

		const result = await this.nativeHostService.showSaveDialog(this.toNativeSaveDialogOptions(options));
		if (result && !result.canceled && result.filePath) {
			return URI.file(result.filePath);
		}

		return;
	}

	async showOpenDialog(options: IOpenDialogOptions): Promise<URI[] | undefined> {
		const schema = this.getFileSystemSchema(options);
		if (this.shouldUseSimplified(schema).useSimplified) {
			return this.showOpenDialogSimplified(schema, options);
		}

		const newOptions: OpenDialogOptions & { properties: string[] } & INativeHostOptions = {
			title: options.title,
			defaultPath: options.defaultUri?.fsPath,
			buttonLabel: typeof options.openLabel === 'string' ? options.openLabel : options.openLabel?.withMnemonic,
			filters: options.filters,
			properties: [],
			targetWindowId: getActiveWindow().vscodeWindowId
		};

		newOptions.properties.push('createDirectory');

		if (options.canSelectFiles) {
			newOptions.properties.push('openFile');
		}

		if (options.canSelectFolders) {
			newOptions.properties.push('openDirectory');
		}

		if (options.canSelectMany) {
			newOptions.properties.push('multiSelections');
		}

		const result = await this.nativeHostService.showOpenDialog(newOptions);
		return result && Array.isArray(result.filePaths) && result.filePaths.length > 0 ? result.filePaths.map(URI.file) : undefined;
	}
}

registerSingleton(IFileDialogService, FileDialogService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dialogs/test/electron-browser/fileDialogService.test.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/test/electron-browser/fileDialogService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService, IFileDialogService, IOpenDialogOptions, ISaveDialogOptions } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../../platform/native/common/native.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkspacesService } from '../../../../../platform/workspaces/common/workspaces.js';
import { ISimpleFileDialog } from '../../browser/simpleFileDialog.js';
import { FileDialogService } from '../../electron-browser/fileDialogService.js';
import { IEditorService } from '../../../editor/common/editorService.js';
import { BrowserWorkbenchEnvironmentService } from '../../../environment/browser/environmentService.js';
import { IWorkbenchEnvironmentService } from '../../../environment/common/environmentService.js';
import { IHistoryService } from '../../../history/common/history.js';
import { IHostService } from '../../../host/browser/host.js';
import { IPathService } from '../../../path/common/pathService.js';
import { BrowserWorkspaceEditingService } from '../../../workspaces/browser/workspaceEditingService.js';
import { IWorkspaceEditingService } from '../../../workspaces/common/workspaceEditing.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

class TestFileDialogService extends FileDialogService {
	constructor(
		private simple: ISimpleFileDialog,
		@IHostService hostService: IHostService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IHistoryService historyService: IHistoryService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IFileService fileService: IFileService,
		@IOpenerService openerService: IOpenerService,
		@INativeHostService nativeHostService: INativeHostService,
		@IDialogService dialogService: IDialogService,
		@ILanguageService languageService: ILanguageService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@ILabelService labelService: ILabelService,
		@IPathService pathService: IPathService,
		@ICommandService commandService: ICommandService,
		@IEditorService editorService: IEditorService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ILogService logService: ILogService
	) {
		super(hostService, contextService, historyService, environmentService, instantiationService, configurationService, fileService,
			openerService, nativeHostService, dialogService, languageService, workspacesService, labelService, pathService, commandService, editorService, codeEditorService, logService);
	}

	protected override getSimpleFileDialog() {
		if (this.simple) {
			return this.simple;
		} else {
			return super.getSimpleFileDialog();
		}
	}
}

suite('FileDialogService', function () {

	let instantiationService: TestInstantiationService;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const testFile: URI = URI.file('/test/file');

	setup(async function () {
		disposables.add(instantiationService = workbenchInstantiationService(undefined, disposables));
		const configurationService = new TestConfigurationService();
		await configurationService.setUserConfiguration('files', { simpleDialog: { enable: true } });
		instantiationService.stub(IConfigurationService, configurationService);

	});

	test('Local - open/save workspaces availableFilesystems', async function () {
		class TestSimpleFileDialog implements ISimpleFileDialog {
			async showOpenDialog(options: IOpenDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 1);
				assert.strictEqual(options.availableFileSystems[0], Schemas.file);
				return testFile;
			}
			async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 1);
				assert.strictEqual(options.availableFileSystems[0], Schemas.file);
				return testFile;
			}
			dispose(): void { }
		}

		const dialogService = instantiationService.createInstance(TestFileDialogService, new TestSimpleFileDialog());
		instantiationService.set(IFileDialogService, dialogService);
		const workspaceService: IWorkspaceEditingService = disposables.add(instantiationService.createInstance(BrowserWorkspaceEditingService));
		assert.strictEqual((await workspaceService.pickNewWorkspacePath())?.path.startsWith(testFile.path), true);
		assert.strictEqual(await dialogService.pickWorkspaceAndOpen({}), undefined);
	});

	test('Virtual - open/save workspaces availableFilesystems', async function () {
		class TestSimpleFileDialog {
			async showOpenDialog(options: IOpenDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 1);
				assert.strictEqual(options.availableFileSystems[0], Schemas.file);
				return testFile;
			}
			async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 1);
				assert.strictEqual(options.availableFileSystems[0], Schemas.file);
				return testFile;
			}
			dispose(): void { }
		}

		instantiationService.stub(IPathService, new class {
			defaultUriScheme: string = 'vscode-virtual-test';
			userHome = async () => URI.file('/user/home');
		} as IPathService);
		const dialogService = instantiationService.createInstance(TestFileDialogService, new TestSimpleFileDialog());
		instantiationService.set(IFileDialogService, dialogService);
		const workspaceService: IWorkspaceEditingService = disposables.add(instantiationService.createInstance(BrowserWorkspaceEditingService));
		assert.strictEqual((await workspaceService.pickNewWorkspacePath())?.path.startsWith(testFile.path), true);
		assert.strictEqual(await dialogService.pickWorkspaceAndOpen({}), undefined);
	});

	test('Remote - open/save workspaces availableFilesystems', async function () {
		class TestSimpleFileDialog implements ISimpleFileDialog {
			async showOpenDialog(options: IOpenDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 2);
				assert.strictEqual(options.availableFileSystems[0], Schemas.vscodeRemote);
				assert.strictEqual(options.availableFileSystems[1], Schemas.file);
				return testFile;
			}
			async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
				assert.strictEqual(options.availableFileSystems?.length, 2);
				assert.strictEqual(options.availableFileSystems[0], Schemas.vscodeRemote);
				assert.strictEqual(options.availableFileSystems[1], Schemas.file);
				return testFile;
			}
			dispose(): void { }
		}

		instantiationService.set(IWorkbenchEnvironmentService, new class extends mock<BrowserWorkbenchEnvironmentService>() {
			override get remoteAuthority() {
				return 'testRemote';
			}
		});
		instantiationService.stub(IPathService, new class {
			defaultUriScheme: string = Schemas.vscodeRemote;
			userHome = async () => URI.file('/user/home');
		} as IPathService);
		const dialogService = instantiationService.createInstance(TestFileDialogService, new TestSimpleFileDialog());
		instantiationService.set(IFileDialogService, dialogService);
		const workspaceService: IWorkspaceEditingService = disposables.add(instantiationService.createInstance(BrowserWorkspaceEditingService));
		assert.strictEqual((await workspaceService.pickNewWorkspacePath())?.path.startsWith(testFile.path), true);
		assert.strictEqual(await dialogService.pickWorkspaceAndOpen({}), undefined);
	});

	test('Remote - filters default files/folders to RA (#195938)', async function () {
		class TestSimpleFileDialog implements ISimpleFileDialog {
			async showOpenDialog(): Promise<URI | undefined> {
				return testFile;
			}
			async showSaveDialog(): Promise<URI | undefined> {
				return testFile;
			}
			dispose(): void { }
		}
		instantiationService.set(IWorkbenchEnvironmentService, new class extends mock<BrowserWorkbenchEnvironmentService>() {
			override get remoteAuthority() {
				return 'testRemote';
			}
		});
		instantiationService.stub(IPathService, new class {
			defaultUriScheme: string = Schemas.vscodeRemote;
			userHome = async () => URI.file('/user/home');
		} as IPathService);


		const dialogService = instantiationService.createInstance(TestFileDialogService, new TestSimpleFileDialog());
		const historyService = instantiationService.get(IHistoryService);
		const getLastActiveWorkspaceRoot = sinon.spy(historyService, 'getLastActiveWorkspaceRoot');
		const getLastActiveFile = sinon.spy(historyService, 'getLastActiveFile');

		await dialogService.defaultFilePath();
		assert.deepStrictEqual(getLastActiveFile.args, [[Schemas.vscodeRemote, 'testRemote']]);
		assert.deepStrictEqual(getLastActiveWorkspaceRoot.args, [[Schemas.vscodeRemote, 'testRemote']]);

		await dialogService.defaultFolderPath();
		assert.deepStrictEqual(getLastActiveWorkspaceRoot.args[1], [Schemas.vscodeRemote, 'testRemote']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/driver/browser/driver.ts]---
Location: vscode-main/src/vs/workbench/services/driver/browser/driver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getClientArea, getTopLeftOffset, isHTMLDivElement, isHTMLTextAreaElement } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { language, locale } from '../../../../base/common/platform.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import localizedStrings from '../../../../platform/languagePacks/common/localizedStrings.js';
import { ILogFile, getLogs } from '../../../../platform/log/browser/log.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IWindowDriver, IElement, ILocaleInfo, ILocalizedStrings } from '../common/driver.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import type { Terminal as XtermTerminal } from '@xterm/xterm';

export class BrowserWindowDriver implements IWindowDriver {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ILogService private readonly logService: ILogService
	) {
	}

	async getLogs(): Promise<ILogFile[]> {
		return getLogs(this.fileService, this.environmentService);
	}

	async whenWorkbenchRestored(): Promise<void> {
		this.logService.info('[driver] Waiting for restored lifecycle phase...');
		await this.lifecycleService.when(LifecyclePhase.Restored);
		this.logService.info('[driver] Restored lifecycle phase reached. Waiting for contributions...');
		await Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).whenRestored;
		this.logService.info('[driver] Workbench contributions created.');
	}

	async setValue(selector: string, text: string): Promise<void> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			return Promise.reject(new Error(`Element not found: ${selector}`));
		}

		const inputElement = element as HTMLInputElement;
		inputElement.value = text;

		const event = new Event('input', { bubbles: true, cancelable: true });
		inputElement.dispatchEvent(event);
	}

	async isActiveElement(selector: string): Promise<boolean> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (element !== mainWindow.document.activeElement) {
			const chain: string[] = [];
			let el = mainWindow.document.activeElement;

			while (el) {
				const tagName = el.tagName;
				const id = el.id ? `#${el.id}` : '';
				const classes = coalesce(el.className.split(/\s+/g).map(c => c.trim())).map(c => `.${c}`).join('');
				chain.unshift(`${tagName}${id}${classes}`);

				el = el.parentElement;
			}

			throw new Error(`Active element not found. Current active element is '${chain.join(' > ')}'. Looking for ${selector}`);
		}

		return true;
	}

	async getElements(selector: string, recursive: boolean): Promise<IElement[]> {
		// eslint-disable-next-line no-restricted-syntax
		const query = mainWindow.document.querySelectorAll(selector);
		const result: IElement[] = [];
		for (let i = 0; i < query.length; i++) {
			const element = query.item(i);
			result.push(this.serializeElement(element, recursive));
		}

		return result;
	}

	private serializeElement(element: Element, recursive: boolean): IElement {
		const attributes = Object.create(null);

		for (let j = 0; j < element.attributes.length; j++) {
			const attr = element.attributes.item(j);
			if (attr) {
				attributes[attr.name] = attr.value;
			}
		}

		const children: IElement[] = [];

		if (recursive) {
			for (let i = 0; i < element.children.length; i++) {
				const child = element.children.item(i);
				if (child) {
					children.push(this.serializeElement(child, true));
				}
			}
		}

		const { left, top } = getTopLeftOffset(element as HTMLElement);

		return {
			tagName: element.tagName,
			className: element.className,
			textContent: element.textContent || '',
			attributes,
			children,
			left,
			top
		};
	}

	async getElementXY(selector: string, xoffset?: number, yoffset?: number): Promise<{ x: number; y: number }> {
		const offset = typeof xoffset === 'number' && typeof yoffset === 'number' ? { x: xoffset, y: yoffset } : undefined;
		return this._getElementXY(selector, offset);
	}

	async typeInEditor(selector: string, text: string): Promise<void> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			throw new Error(`Editor not found: ${selector}`);
		}
		if (isHTMLDivElement(element)) {
			// Edit context is enabled
			const editContext = element.editContext;
			if (!editContext) {
				throw new Error(`Edit context not found: ${selector}`);
			}
			const selectionStart = editContext.selectionStart;
			const selectionEnd = editContext.selectionEnd;
			const event = new TextUpdateEvent('textupdate', {
				updateRangeStart: selectionStart,
				updateRangeEnd: selectionEnd,
				text,
				selectionStart: selectionStart + text.length,
				selectionEnd: selectionStart + text.length,
				compositionStart: 0,
				compositionEnd: 0
			});
			editContext.dispatchEvent(event);
		} else if (isHTMLTextAreaElement(element)) {
			const start = element.selectionStart;
			const newStart = start + text.length;
			const value = element.value;
			const newValue = value.substr(0, start) + text + value.substr(start);

			element.value = newValue;
			element.setSelectionRange(newStart, newStart);

			const event = new Event('input', { 'bubbles': true, 'cancelable': true });
			element.dispatchEvent(event);
		}
	}

	async getEditorSelection(selector: string): Promise<{ selectionStart: number; selectionEnd: number }> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);
		if (!element) {
			throw new Error(`Editor not found: ${selector}`);
		}
		if (isHTMLDivElement(element)) {
			const editContext = element.editContext;
			if (!editContext) {
				throw new Error(`Edit context not found: ${selector}`);
			}
			return { selectionStart: editContext.selectionStart, selectionEnd: editContext.selectionEnd };
		} else if (isHTMLTextAreaElement(element)) {
			return { selectionStart: element.selectionStart, selectionEnd: element.selectionEnd };
		} else {
			throw new Error(`Unknown type of element: ${selector}`);
		}
	}

	async getTerminalBuffer(selector: string): Promise<string[]> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			throw new Error(`Terminal not found: ${selector}`);
		}

		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		const xterm = (element as any).xterm;

		if (!xterm) {
			throw new Error(`Xterm not found: ${selector}`);
		}

		const lines: string[] = [];
		for (let i = 0; i < xterm.buffer.active.length; i++) {
			lines.push(xterm.buffer.active.getLine(i)!.translateToString(true));
		}

		return lines;
	}

	async writeInTerminal(selector: string, text: string): Promise<void> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}

		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		const xterm = (element as any).xterm as (XtermTerminal | undefined);

		if (!xterm) {
			throw new Error(`Xterm not found: ${selector}`);
		}

		xterm.input(text);
	}

	getLocaleInfo(): Promise<ILocaleInfo> {
		return Promise.resolve({
			language: language,
			locale: locale
		});
	}

	getLocalizedStrings(): Promise<ILocalizedStrings> {
		return Promise.resolve({
			open: localizedStrings.open,
			close: localizedStrings.close,
			find: localizedStrings.find
		});
	}

	protected async _getElementXY(selector: string, offset?: { x: number; y: number }): Promise<{ x: number; y: number }> {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.querySelector(selector);

		if (!element) {
			return Promise.reject(new Error(`Element not found: ${selector}`));
		}

		const { left, top } = getTopLeftOffset(element as HTMLElement);
		const { width, height } = getClientArea(element as HTMLElement);
		let x: number, y: number;

		if (offset) {
			x = left + offset.x;
			y = top + offset.y;
		} else {
			x = left + (width / 2);
			y = top + (height / 2);
		}

		x = Math.round(x);
		y = Math.round(y);

		return { x, y };
	}
}

export function registerWindowDriver(instantiationService: IInstantiationService): void {
	Object.assign(mainWindow, { driver: instantiationService.createInstance(BrowserWindowDriver) });
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/driver/common/driver.ts]---
Location: vscode-main/src/vs/workbench/services/driver/common/driver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// !! Do not remove the following START and END markers, they are parsed by the smoketest build

//*START
export interface IElement {
	readonly tagName: string;
	readonly className: string;
	readonly textContent: string;
	readonly attributes: { [name: string]: string };
	readonly children: IElement[];
	readonly top: number;
	readonly left: number;
}

export interface ILocaleInfo {
	readonly language: string;
	readonly locale?: string;
}

export interface ILocalizedStrings {
	readonly open: string;
	readonly close: string;
	readonly find: string;
}

export interface ILogFile {
	readonly relativePath: string;
	readonly contents: string;
}

export interface IWindowDriver {
	setValue(selector: string, text: string): Promise<void>;
	isActiveElement(selector: string): Promise<boolean>;
	getElements(selector: string, recursive: boolean): Promise<IElement[]>;
	getElementXY(selector: string, xoffset?: number, yoffset?: number): Promise<{ x: number; y: number }>;
	typeInEditor(selector: string, text: string): Promise<void>;
	getEditorSelection(selector: string): Promise<{ selectionStart: number; selectionEnd: number }>;
	getTerminalBuffer(selector: string): Promise<string[]>;
	writeInTerminal(selector: string, text: string): Promise<void>;
	getLocaleInfo(): Promise<ILocaleInfo>;
	getLocalizedStrings(): Promise<ILocalizedStrings>;
	getLogs(): Promise<ILogFile[]>;
	whenWorkbenchRestored(): Promise<void>;
}
//*END
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/browser/codeEditorService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/browser/codeEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor, isCodeEditor, isDiffEditor, isCompositeEditor, getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { AbstractCodeEditorService } from '../../../../editor/browser/services/abstractCodeEditorService.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkbenchEditorConfiguration } from '../../../common/editor.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../common/editorService.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { isEqual } from '../../../../base/common/resources.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { applyTextEditorOptions } from '../../../common/editor/editorOptions.js';

export class CodeEditorService extends AbstractCodeEditorService {

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super(themeService);

		this._register(this.registerCodeEditorOpenHandler(this.doOpenCodeEditor.bind(this)));
		this._register(this.registerCodeEditorOpenHandler(this.doOpenCodeEditorFromDiff.bind(this)));
	}

	getActiveCodeEditor(): ICodeEditor | null {
		const activeTextEditorControl = this.editorService.activeTextEditorControl;
		if (isCodeEditor(activeTextEditorControl)) {
			return activeTextEditorControl;
		}

		if (isDiffEditor(activeTextEditorControl)) {
			return activeTextEditorControl.getModifiedEditor();
		}

		const activeControl = this.editorService.activeEditorPane?.getControl();
		if (isCompositeEditor(activeControl) && isCodeEditor(activeControl.activeCodeEditor)) {
			return activeControl.activeCodeEditor;
		}

		return null;
	}

	private async doOpenCodeEditorFromDiff(input: IResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null> {

		// Special case: If the active editor is a diff editor and the request to open originates and
		// targets the modified side of it, we just apply the request there to prevent opening the modified
		// side as separate editor.
		const activeTextEditorControl = this.editorService.activeTextEditorControl;
		if (
			!sideBySide &&																// we need the current active group to be the target
			isDiffEditor(activeTextEditorControl) && 									// we only support this for active text diff editors
			input.options &&															// we need options to apply
			input.resource &&															// we need a request resource to compare with
			source === activeTextEditorControl.getModifiedEditor() && 					// we need the source of this request to be the modified side of the diff editor
			activeTextEditorControl.getModel() &&										// we need a target model to compare with
			isEqual(input.resource, activeTextEditorControl.getModel()?.modified.uri) 	// we need the input resources to match with modified side
		) {
			const targetEditor = activeTextEditorControl.getModifiedEditor();

			applyTextEditorOptions(input.options, targetEditor, ScrollType.Smooth);

			return targetEditor;
		}

		return null;
	}

	// Open using our normal editor service
	private async doOpenCodeEditor(input: IResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null> {

		// Special case: we want to detect the request to open an editor that
		// is different from the current one to decide whether the current editor
		// should be pinned or not. This ensures that the source of a navigation
		// is not being replaced by the target. An example is "Goto definition"
		// that otherwise would replace the editor everytime the user navigates.
		const enablePreviewFromCodeNavigation = this.configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor?.enablePreviewFromCodeNavigation;
		if (
			!enablePreviewFromCodeNavigation &&              	// we only need to do this if the configuration requires it
			source &&											// we need to know the origin of the navigation
			!input.options?.pinned &&							// we only need to look at preview editors that open
			!sideBySide &&										// we only need to care if editor opens in same group
			!isEqual(source.getModel()?.uri, input.resource)	// we only need to do this if the editor is about to change
		) {
			for (const visiblePane of this.editorService.visibleEditorPanes) {
				if (getCodeEditor(visiblePane.getControl()) === source) {
					visiblePane.group.pinEditor();
					break;
				}
			}
		}

		// Open as editor
		const control = await this.editorService.openEditor(input, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
		if (control) {
			const widget = control.getControl();
			if (isCodeEditor(widget)) {
				return widget;
			}

			if (isCompositeEditor(widget) && isCodeEditor(widget.activeCodeEditor)) {
				return widget.activeCodeEditor;
			}
		}

		return null;
	}
}

registerSingleton(ICodeEditorService, CodeEditorService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/browser/editorPaneService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/browser/editorPaneService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorPaneService } from '../common/editorPaneService.js';
import { EditorPaneDescriptor } from '../../../browser/editor.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class EditorPaneService implements IEditorPaneService {

	declare readonly _serviceBrand: undefined;

	readonly onWillInstantiateEditorPane = EditorPaneDescriptor.onWillInstantiateEditorPane;

	didInstantiateEditorPane(typeId: string): boolean {
		return EditorPaneDescriptor.didInstantiateEditorPane(typeId);
	}
}

registerSingleton(IEditorPaneService, EditorPaneService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/browser/editorResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/browser/editorResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { distinct, insert } from '../../../../base/common/arrays.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { basename, extname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { EditorActivation, EditorResolution, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorResourceAccessor, EditorInputWithOptions, IResourceSideBySideEditorInput, isEditorInputWithOptions, isEditorInputWithOptionsAndGroup, isResourceDiffEditorInput, isResourceSideBySideEditorInput, isUntitledResourceEditorInput, isResourceMergeEditorInput, IUntypedEditorInput, SideBySideEditor, isResourceMultiDiffEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../common/editorGroupsService.js';
import { Schemas } from '../../../../base/common/network.js';
import { RegisteredEditorInfo, RegisteredEditorPriority, RegisteredEditorOptions, EditorAssociation, EditorAssociations, editorsAssociationsSettingId, globMatchesResource, IEditorResolverService, priorityToRank, ResolvedEditor, ResolvedStatus, EditorInputFactoryObject } from '../common/editorResolverService.js';
import { QuickPickItem, IKeyMods, IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { localize } from '../../../../nls.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { findGroup } from '../common/editorGroupFinder.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { PreferredGroup } from '../common/editorService.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { PauseableEmitter } from '../../../../base/common/event.js';

interface RegisteredEditor {
	globPattern: string | glob.IRelativePattern;
	editorInfo: RegisteredEditorInfo;
	options?: RegisteredEditorOptions;
	editorFactoryObject: EditorInputFactoryObject;
}

type RegisteredEditors = Array<RegisteredEditor>;

export class EditorResolverService extends Disposable implements IEditorResolverService {
	readonly _serviceBrand: undefined;

	// Events
	private readonly _onDidChangeEditorRegistrations = this._register(new PauseableEmitter<void>());
	readonly onDidChangeEditorRegistrations = this._onDidChangeEditorRegistrations.event;

	// Constants
	private static readonly configureDefaultID = 'promptOpenWith.configureDefault';
	private static readonly cacheStorageID = 'editorOverrideService.cache';
	private static readonly conflictingDefaultsStorageID = 'editorOverrideService.conflictingDefaults';

	// Data Stores
	private _editors: Map<string | glob.IRelativePattern, Map<string, RegisteredEditors>> = new Map<string | glob.IRelativePattern, Map<string, RegisteredEditors>>();
	private _flattenedEditors: Map<string | glob.IRelativePattern, RegisteredEditors> = new Map();
	private _shouldReFlattenEditors = true;
	private cache: Set<string> | undefined;

	constructor(
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		// Read in the cache on statup
		this.cache = new Set<string>(JSON.parse(this.storageService.get(EditorResolverService.cacheStorageID, StorageScope.PROFILE, JSON.stringify([]))));
		this.storageService.remove(EditorResolverService.cacheStorageID, StorageScope.PROFILE);

		this._register(this.storageService.onWillSaveState(() => {
			// We want to store the glob patterns we would activate on, this allows us to know if we need to await the ext host on startup for opening a resource
			this.cacheEditors();
		}));

		// When extensions have registered we no longer need the cache
		this._register(this.extensionService.onDidRegisterExtensions(() => {
			this.cache = undefined;
		}));
	}

	private resolveUntypedInputAndGroup(editor: IUntypedEditorInput, preferredGroup: PreferredGroup | undefined): Promise<[IUntypedEditorInput, IEditorGroup, EditorActivation | undefined] | undefined> | [IUntypedEditorInput, IEditorGroup, EditorActivation | undefined] | undefined {
		const untypedEditor = editor;

		// Use the untyped editor to find a group
		const findGroupResult = this.instantiationService.invokeFunction(findGroup, untypedEditor, preferredGroup);
		if (findGroupResult instanceof Promise) {
			return findGroupResult.then(([group, activation]) => [untypedEditor, group, activation]);
		} else {
			const [group, activation] = findGroupResult;
			return [untypedEditor, group, activation];
		}
	}

	async resolveEditor(editor: IUntypedEditorInput, preferredGroup: PreferredGroup | undefined): Promise<ResolvedEditor> {
		// Update the flattened editors
		this._flattenedEditors = this._flattenEditorsMap();

		// Special case: side by side editors requires us to
		// independently resolve both sides and then build
		// a side by side editor with the result
		if (isResourceSideBySideEditorInput(editor)) {
			return this.doResolveSideBySideEditor(editor, preferredGroup);
		}

		let resolvedUntypedAndGroup: [IUntypedEditorInput, IEditorGroup, EditorActivation | undefined] | undefined;
		const resolvedUntypedAndGroupResult = this.resolveUntypedInputAndGroup(editor, preferredGroup);
		if (resolvedUntypedAndGroupResult instanceof Promise) {
			resolvedUntypedAndGroup = await resolvedUntypedAndGroupResult;
		} else {
			resolvedUntypedAndGroup = resolvedUntypedAndGroupResult;
		}

		if (!resolvedUntypedAndGroup) {
			return ResolvedStatus.NONE;
		}
		// Get the resolved untyped editor, group, and activation
		const [untypedEditor, group, activation] = resolvedUntypedAndGroup;
		if (activation) {
			untypedEditor.options = { ...untypedEditor.options, activation };
		}

		let resource = EditorResourceAccessor.getCanonicalUri(untypedEditor, { supportSideBySide: SideBySideEditor.PRIMARY });

		// If it was resolved before we await for the extensions to activate and then proceed with resolution or else the backing extensions won't be registered
		if (this.cache && resource && this.resourceMatchesCache(resource)) {
			await this.extensionService.whenInstalledExtensionsRegistered();
		}

		// Undefined resource -> untilted. Other malformed URI's are unresolvable
		if (resource === undefined) {
			resource = URI.from({ scheme: Schemas.untitled });
		} else if (resource.scheme === undefined || resource === null) {
			return ResolvedStatus.NONE;
		}

		if (untypedEditor.options?.override === EditorResolution.PICK) {
			const picked = await this.doPickEditor(untypedEditor);
			// If the picker was cancelled we will stop resolving the editor
			if (!picked) {
				return ResolvedStatus.ABORT;
			}
			// Populate the options with the new ones
			untypedEditor.options = picked;
		}

		// Resolved the editor ID as much as possible, now find a given editor (cast here is ok because we resolve down to a string above)
		let { editor: selectedEditor, conflictingDefault } = this.getEditor(resource, untypedEditor.options?.override as (string | EditorResolution.EXCLUSIVE_ONLY | undefined));
		// If no editor was found and this was a typed editor or an editor with an explicit override we could not resolve it
		if (!selectedEditor && (untypedEditor.options?.override || isEditorInputWithOptions(editor))) {
			return ResolvedStatus.NONE;
		} else if (!selectedEditor) {
			// Simple untyped editors that we could not resolve will be resolved to the default editor
			const resolvedEditor = this.getEditor(resource, DEFAULT_EDITOR_ASSOCIATION.id);
			selectedEditor = resolvedEditor?.editor;
			conflictingDefault = resolvedEditor?.conflictingDefault;
			if (!selectedEditor) {
				return ResolvedStatus.NONE;
			}
		}

		// In the special case of diff editors we do some more work to determine the correct editor for both sides
		if (isResourceDiffEditorInput(untypedEditor) && untypedEditor.options?.override === undefined) {
			let resource2 = EditorResourceAccessor.getCanonicalUri(untypedEditor, { supportSideBySide: SideBySideEditor.SECONDARY });
			if (!resource2) {
				resource2 = URI.from({ scheme: Schemas.untitled });
			}
			const { editor: selectedEditor2 } = this.getEditor(resource2, undefined);
			if (!selectedEditor2 || selectedEditor.editorInfo.id !== selectedEditor2.editorInfo.id) {
				const { editor: selectedDiff, conflictingDefault: conflictingDefaultDiff } = this.getEditor(resource, DEFAULT_EDITOR_ASSOCIATION.id);
				selectedEditor = selectedDiff;
				conflictingDefault = conflictingDefaultDiff;
			}
			if (!selectedEditor) {
				return ResolvedStatus.NONE;
			}
		}

		// If no override we take the selected editor id so that matches works with the isActive check
		untypedEditor.options = { override: selectedEditor.editorInfo.id, ...untypedEditor.options };

		// Check if diff can be created based on prescene of factory function
		if (selectedEditor.editorFactoryObject.createDiffEditorInput === undefined && isResourceDiffEditorInput(untypedEditor)) {
			return ResolvedStatus.NONE;
		}

		const input = await this.doResolveEditor(untypedEditor, group, selectedEditor);
		if (conflictingDefault && input) {
			// Show the conflicting default dialog
			await this.doHandleConflictingDefaults(resource, selectedEditor.editorInfo.label, untypedEditor, input.editor, group);
		}

		if (input) {
			if (input.editor.editorId !== selectedEditor.editorInfo.id) {
				this.logService.warn(`Editor ID Mismatch: ${input.editor.editorId} !== ${selectedEditor.editorInfo.id}. This will cause bugs. Please ensure editorInput.editorId matches the registered id`);
			}
			return { ...input, group };
		}
		return ResolvedStatus.ABORT;
	}

	private async doResolveSideBySideEditor(editor: IResourceSideBySideEditorInput, preferredGroup: PreferredGroup | undefined): Promise<ResolvedEditor> {
		const primaryResolvedEditor = await this.resolveEditor(editor.primary, preferredGroup);
		if (!isEditorInputWithOptionsAndGroup(primaryResolvedEditor)) {
			return ResolvedStatus.NONE;
		}
		const secondaryResolvedEditor = await this.resolveEditor(editor.secondary, primaryResolvedEditor.group ?? preferredGroup);
		if (!isEditorInputWithOptionsAndGroup(secondaryResolvedEditor)) {
			return ResolvedStatus.NONE;
		}
		return {
			group: primaryResolvedEditor.group ?? secondaryResolvedEditor.group,
			editor: this.instantiationService.createInstance(SideBySideEditorInput, editor.label, editor.description, secondaryResolvedEditor.editor, primaryResolvedEditor.editor),
			options: editor.options
		};
	}

	bufferChangeEvents(callback: Function): void {
		this._onDidChangeEditorRegistrations.pause();
		try {
			callback();
		} finally {
			this._onDidChangeEditorRegistrations.resume();
		}
	}

	registerEditor(
		globPattern: string | glob.IRelativePattern,
		editorInfo: RegisteredEditorInfo,
		options: RegisteredEditorOptions,
		editorFactoryObject: EditorInputFactoryObject
	): IDisposable {
		let registeredEditor = this._editors.get(globPattern);
		if (registeredEditor === undefined) {
			registeredEditor = new Map<string, RegisteredEditors>();
			this._editors.set(globPattern, registeredEditor);
		}

		let editorsWithId = registeredEditor.get(editorInfo.id);
		if (editorsWithId === undefined) {
			editorsWithId = [];
		}
		const remove = insert(editorsWithId, {
			globPattern,
			editorInfo,
			options,
			editorFactoryObject
		});
		registeredEditor.set(editorInfo.id, editorsWithId);
		this._shouldReFlattenEditors = true;
		this._onDidChangeEditorRegistrations.fire();
		return toDisposable(() => {
			remove();
			if (editorsWithId && editorsWithId.length === 0) {
				registeredEditor?.delete(editorInfo.id);
			}
			this._shouldReFlattenEditors = true;
			this._onDidChangeEditorRegistrations.fire();
		});
	}

	getAssociationsForResource(resource: URI): EditorAssociations {
		const associations = this.getAllUserAssociations();
		let matchingAssociations = associations.filter(association => association.filenamePattern && globMatchesResource(association.filenamePattern, resource));
		// Sort matching associations based on glob length as a longer glob will be more specific
		matchingAssociations = matchingAssociations.sort((a, b) => (b.filenamePattern?.length ?? 0) - (a.filenamePattern?.length ?? 0));
		const allEditors: RegisteredEditors = this._registeredEditors;
		// Ensure that the settings are valid editors
		return matchingAssociations.filter(association => allEditors.find(c => c.editorInfo.id === association.viewType));
	}

	getAllUserAssociations(): EditorAssociations {
		const inspectedEditorAssociations = this.configurationService.inspect<{ [fileNamePattern: string]: string }>(editorsAssociationsSettingId) || {};
		const defaultAssociations = inspectedEditorAssociations.defaultValue ?? {};
		const workspaceAssociations = inspectedEditorAssociations.workspaceValue ?? {};
		const userAssociations = inspectedEditorAssociations.userValue ?? {};
		const rawAssociations: { [fileNamePattern: string]: string } = { ...workspaceAssociations };
		// We want to apply the default associations and user associations on top of the workspace associations but ignore duplicate keys.
		for (const [key, value] of Object.entries({ ...defaultAssociations, ...userAssociations })) {
			if (rawAssociations[key] === undefined) {
				rawAssociations[key] = value;
			}
		}
		const associations = [];
		for (const [key, value] of Object.entries(rawAssociations)) {
			const association: EditorAssociation = {
				filenamePattern: key,
				viewType: value
			};
			associations.push(association);
		}
		return associations;
	}

	/**
	 * Given the nested nature of the editors map, we merge factories of the same glob and id to make it flat
	 * and easier to work with
	 */
	private _flattenEditorsMap() {
		// If we shouldn't be re-flattening (due to lack of update) then return early
		if (!this._shouldReFlattenEditors) {
			return this._flattenedEditors;
		}
		this._shouldReFlattenEditors = false;
		const editors = new Map<string | glob.IRelativePattern, RegisteredEditors>();
		for (const [glob, value] of this._editors) {
			const registeredEditors: RegisteredEditors = [];
			for (const editors of value.values()) {
				let registeredEditor: RegisteredEditor | undefined = undefined;
				// Merge all editors with the same id and glob pattern together
				for (const editor of editors) {
					if (!registeredEditor) {
						registeredEditor = {
							editorInfo: editor.editorInfo,
							globPattern: editor.globPattern,
							options: {},
							editorFactoryObject: {}
						};
					}
					// Merge options and factories
					registeredEditor.options = { ...registeredEditor.options, ...editor.options };
					registeredEditor.editorFactoryObject = { ...registeredEditor.editorFactoryObject, ...editor.editorFactoryObject };
				}
				if (registeredEditor) {
					registeredEditors.push(registeredEditor);
				}
			}
			editors.set(glob, registeredEditors);
		}
		return editors;
	}

	/**
	 * Returns all editors as an array. Possible to contain duplicates
	 */
	private get _registeredEditors(): RegisteredEditors {
		return Array.from(this._flattenedEditors.values()).flat();
	}

	updateUserAssociations(globPattern: string, editorID: string): void {
		const newAssociation: EditorAssociation = { viewType: editorID, filenamePattern: globPattern };
		const currentAssociations = this.getAllUserAssociations();
		const newSettingObject = Object.create(null);
		// Form the new setting object including the newest associations
		for (const association of [...currentAssociations, newAssociation]) {
			if (association.filenamePattern) {
				newSettingObject[association.filenamePattern] = association.viewType;
			}
		}
		this.configurationService.updateValue(editorsAssociationsSettingId, newSettingObject);
	}

	private findMatchingEditors(resource: URI): RegisteredEditor[] {
		// The user setting should be respected even if the editor doesn't specify that resource in package.json
		const userSettings = this.getAssociationsForResource(resource);
		const matchingEditors: RegisteredEditor[] = [];
		// Then all glob patterns
		for (const [key, editors] of this._flattenedEditors) {
			for (const editor of editors) {
				const foundInSettings = userSettings.find(setting => setting.viewType === editor.editorInfo.id);
				if ((foundInSettings && editor.editorInfo.priority !== RegisteredEditorPriority.exclusive) || globMatchesResource(key, resource)) {
					matchingEditors.push(editor);
				}
			}
		}
		// Return the editors sorted by their priority
		return matchingEditors.sort((a, b) => {
			// Very crude if priorities match longer glob wins as longer globs are normally more specific
			if (priorityToRank(b.editorInfo.priority) === priorityToRank(a.editorInfo.priority) && typeof b.globPattern === 'string' && typeof a.globPattern === 'string') {
				return b.globPattern.length - a.globPattern.length;
			}
			return priorityToRank(b.editorInfo.priority) - priorityToRank(a.editorInfo.priority);
		});
	}

	public getEditors(resource?: URI): RegisteredEditorInfo[] {
		this._flattenedEditors = this._flattenEditorsMap();

		// By resource
		if (URI.isUri(resource)) {
			const editors = this.findMatchingEditors(resource);
			if (editors.find(e => e.editorInfo.priority === RegisteredEditorPriority.exclusive)) {
				return [];
			}
			return editors.map(editor => editor.editorInfo);
		}

		// All
		return distinct(this._registeredEditors.map(editor => editor.editorInfo), editor => editor.id);
	}

	/**
	 * Given a resource and an editorId selects the best possible editor
	 * @returns The editor and whether there was another default which conflicted with it
	 */
	private getEditor(resource: URI, editorId: string | EditorResolution.EXCLUSIVE_ONLY | undefined): { editor: RegisteredEditor | undefined; conflictingDefault: boolean } {

		const findMatchingEditor = (editors: RegisteredEditors, viewType: string) => {
			return editors.find((editor) => {
				if (editor.options?.canSupportResource !== undefined) {
					return editor.editorInfo.id === viewType && editor.options.canSupportResource(resource);
				}
				return editor.editorInfo.id === viewType;
			});
		};

		if (editorId && editorId !== EditorResolution.EXCLUSIVE_ONLY) {
			// Specific id passed in doesn't have to match the resource, it can be anything
			const registeredEditors = this._registeredEditors;
			return {
				editor: findMatchingEditor(registeredEditors, editorId),
				conflictingDefault: false
			};
		}

		const editors = this.findMatchingEditors(resource);

		const associationsFromSetting = this.getAssociationsForResource(resource);
		// We only want minPriority+ if no user defined setting is found, else we won't resolve an editor
		const minPriority = editorId === EditorResolution.EXCLUSIVE_ONLY ? RegisteredEditorPriority.exclusive : RegisteredEditorPriority.builtin;
		let possibleEditors = editors.filter(editor => priorityToRank(editor.editorInfo.priority) >= priorityToRank(minPriority) && editor.editorInfo.id !== DEFAULT_EDITOR_ASSOCIATION.id);
		if (possibleEditors.length === 0) {
			return {
				editor: associationsFromSetting[0] && minPriority !== RegisteredEditorPriority.exclusive ? findMatchingEditor(editors, associationsFromSetting[0].viewType) : undefined,
				conflictingDefault: false
			};
		}
		// If the editor is exclusive we use that, else use the user setting, else we check canSupportResource, else take the viewtype of first possible editor
		const selectedViewType = possibleEditors[0].editorInfo.priority === RegisteredEditorPriority.exclusive ?
			possibleEditors[0].editorInfo.id :
			associationsFromSetting[0]?.viewType ||
			(possibleEditors.find(editor => (!editor.options?.canSupportResource || editor.options.canSupportResource(resource)))?.editorInfo.id) ||
			possibleEditors[0].editorInfo.id;

		let conflictingDefault = false;

		// Filter out exclusive before we check for conflicts as exclusive editors cannot be manually chosen
		// similar to above, need to check canSupportResource if nothing is exclusive
		possibleEditors = possibleEditors
			.filter(editor => editor.editorInfo.priority !== RegisteredEditorPriority.exclusive)
			.filter(editor => !editor.options?.canSupportResource || editor.options.canSupportResource(resource));
		if (associationsFromSetting.length === 0 && possibleEditors.length > 1) {
			conflictingDefault = true;
		}

		return {
			editor: findMatchingEditor(editors, selectedViewType),
			conflictingDefault
		};
	}

	private async doResolveEditor(editor: IUntypedEditorInput, group: IEditorGroup, selectedEditor: RegisteredEditor): Promise<EditorInputWithOptions | undefined> {
		let options = editor.options;
		const resource = EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });
		// If no activation option is provided, populate it.
		if (options && typeof options.activation === 'undefined') {
			options = { ...options, activation: options.preserveFocus ? EditorActivation.RESTORE : undefined };
		}

		// If it's a merge editor we trigger the create merge editor input
		if (isResourceMergeEditorInput(editor)) {
			if (!selectedEditor.editorFactoryObject.createMergeEditorInput) {
				return;
			}
			const inputWithOptions = await selectedEditor.editorFactoryObject.createMergeEditorInput(editor, group);
			return { editor: inputWithOptions.editor, options: inputWithOptions.options ?? options };
		}

		// If it's a diff editor we trigger the create diff editor input
		if (isResourceDiffEditorInput(editor)) {
			if (!selectedEditor.editorFactoryObject.createDiffEditorInput) {
				return;
			}
			const inputWithOptions = await selectedEditor.editorFactoryObject.createDiffEditorInput(editor, group);
			return { editor: inputWithOptions.editor, options: inputWithOptions.options ?? options };
		}

		// If it's a diff list editor we trigger the create diff list editor input
		if (isResourceMultiDiffEditorInput(editor)) {
			if (!selectedEditor.editorFactoryObject.createMultiDiffEditorInput) {
				return;
			}
			const inputWithOptions = await selectedEditor.editorFactoryObject.createMultiDiffEditorInput(editor, group);
			return { editor: inputWithOptions.editor, options: inputWithOptions.options ?? options };
		}

		if (isResourceSideBySideEditorInput(editor)) {
			throw new Error(`Untyped side by side editor input not supported here.`);
		}

		if (isUntitledResourceEditorInput(editor)) {
			if (!selectedEditor.editorFactoryObject.createUntitledEditorInput) {
				return;
			}
			const inputWithOptions = await selectedEditor.editorFactoryObject.createUntitledEditorInput(editor, group);
			return { editor: inputWithOptions.editor, options: inputWithOptions.options ?? options };
		}

		// Should no longer have an undefined resource so lets throw an error if that's somehow the case
		if (resource === undefined) {
			throw new Error(`Undefined resource on non untitled editor input.`);
		}

		// If the editor states it can only be opened once per resource we must close all existing ones except one and move the new one into the group
		const singleEditorPerResource = typeof selectedEditor.options?.singlePerResource === 'function' ? selectedEditor.options.singlePerResource() : selectedEditor.options?.singlePerResource;
		if (singleEditorPerResource) {
			const existingEditors = this.findExistingEditorsForResource(resource, selectedEditor.editorInfo.id);
			if (existingEditors.length) {
				const editor = await this.moveExistingEditorForResource(existingEditors, group);
				if (editor) {
					return { editor, options };
				} else {
					return; // failed to move
				}
			}
		}

		// If no factory is above, return flow back to caller letting them know we could not resolve it
		if (!selectedEditor.editorFactoryObject.createEditorInput) {
			return;
		}

		// Respect options passed back
		const inputWithOptions = await selectedEditor.editorFactoryObject.createEditorInput(editor, group);
		options = inputWithOptions.options ?? options;
		const input = inputWithOptions.editor;

		return { editor: input, options };
	}

	/**
	 * Moves the first existing editor for a resource to the target group unless already opened there.
	 * Additionally will close any other editors that are open for that resource and viewtype besides the first one found
	 * @param resource The resource of the editor
	 * @param viewType the viewtype of the editor
	 * @param targetGroup The group to move it to
	 * @returns The moved editor input or `undefined` if the editor could not be moved
	 */
	private async moveExistingEditorForResource(
		existingEditorsForResource: Array<{ editor: EditorInput; group: IEditorGroup }>,
		targetGroup: IEditorGroup,
	): Promise<EditorInput | undefined> {
		const editorToUse = existingEditorsForResource[0];

		// We should only have one editor but if there are multiple we close the others
		for (const { editor, group } of existingEditorsForResource) {
			if (editor !== editorToUse.editor) {
				const closed = await group.closeEditor(editor);
				if (!closed) {
					return;
				}
			}
		}

		// Move the editor already opened to the target group
		if (targetGroup.id !== editorToUse.group.id) {
			const moved = editorToUse.group.moveEditor(editorToUse.editor, targetGroup);
			if (!moved) {
				return;
			}
		}

		return editorToUse.editor;
	}

	/**
	 * Given a resource and an editorId, returns all editors open for that resource and editorId.
	 * @param resource The resource specified
	 * @param editorId The editorID
	 * @returns A list of editors
	 */
	private findExistingEditorsForResource(
		resource: URI,
		editorId: string,
	): Array<{ editor: EditorInput; group: IEditorGroup }> {
		const out: Array<{ editor: EditorInput; group: IEditorGroup }> = [];
		const orderedGroups = distinct([
			...this.editorGroupService.groups,
		]);

		for (const group of orderedGroups) {
			for (const editor of group.editors) {
				if (isEqual(editor.resource, resource) && editor.editorId === editorId) {
					out.push({ editor, group });
				}
			}
		}
		return out;
	}

	private async doHandleConflictingDefaults(resource: URI, editorName: string, untypedInput: IUntypedEditorInput, currentEditor: EditorInput, group: IEditorGroup) {
		type StoredChoice = {
			[key: string]: string[];
		};
		const editors = this.findMatchingEditors(resource);
		const storedChoices: StoredChoice = JSON.parse(this.storageService.get(EditorResolverService.conflictingDefaultsStorageID, StorageScope.PROFILE, '{}'));
		const globForResource = `*${extname(resource)}`;
		// Writes to the storage service that a choice has been made for the currently installed editors
		const writeCurrentEditorsToStorage = () => {
			storedChoices[globForResource] = [];
			editors.forEach(editor => storedChoices[globForResource].push(editor.editorInfo.id));
			this.storageService.store(EditorResolverService.conflictingDefaultsStorageID, JSON.stringify(storedChoices), StorageScope.PROFILE, StorageTarget.MACHINE);
		};

		// If the user has already made a choice for this editor we don't want to ask them again
		if (storedChoices[globForResource]?.find(editorID => editorID === currentEditor.editorId)) {
			return;
		}

		const handle = this.notificationService.prompt(Severity.Warning,
			localize('editorResolver.conflictingDefaults', 'There are multiple default editors available for the resource.'),
			[{
				label: localize('editorResolver.configureDefault', 'Configure Default'),
				run: async () => {
					// Show the picker and tell it to update the setting to whatever the user selected
					const picked = await this.doPickEditor(untypedInput, true);
					if (!picked) {
						return;
					}
					untypedInput.options = picked;
					const replacementEditor = await this.resolveEditor(untypedInput, group);
					if (replacementEditor === ResolvedStatus.ABORT || replacementEditor === ResolvedStatus.NONE) {
						return;
					}
					// Replace the current editor with the picked one
					group.replaceEditors([
						{
							editor: currentEditor,
							replacement: replacementEditor.editor,
							options: replacementEditor.options ?? picked,
						}
					]);
				}
			},
			{
				label: localize('editorResolver.keepDefault', 'Keep {0}', editorName),
				run: writeCurrentEditorsToStorage
			}
			]);
		// If the user pressed X we assume they want to keep the current editor as default
		const onCloseListener = handle.onDidClose(() => {
			writeCurrentEditorsToStorage();
			onCloseListener.dispose();
		});
	}

	private mapEditorsToQuickPickEntry(resource: URI, showDefaultPicker?: boolean) {
		const currentEditor = this.editorGroupService.activeGroup.findEditors(resource).at(0);
		// If untitled, we want all registered editors
		let registeredEditors = resource.scheme === Schemas.untitled ? this._registeredEditors.filter(e => e.editorInfo.priority !== RegisteredEditorPriority.exclusive) : this.findMatchingEditors(resource);
		// We don't want duplicate Id entries
		registeredEditors = distinct(registeredEditors, c => c.editorInfo.id);
		const defaultSetting = this.getAssociationsForResource(resource)[0]?.viewType;
		// Not the most efficient way to do this, but we want to ensure the text editor is at the top of the quickpick
		registeredEditors = registeredEditors.sort((a, b) => {
			if (a.editorInfo.id === DEFAULT_EDITOR_ASSOCIATION.id) {
				return -1;
			} else if (b.editorInfo.id === DEFAULT_EDITOR_ASSOCIATION.id) {
				return 1;
			} else {
				return priorityToRank(b.editorInfo.priority) - priorityToRank(a.editorInfo.priority);
			}
		});
		const quickPickEntries: Array<QuickPickItem> = [];
		const currentlyActiveLabel = localize('promptOpenWith.currentlyActive', "Active");
		const currentDefaultLabel = localize('promptOpenWith.currentDefault', "Default");
		const currentDefaultAndActiveLabel = localize('promptOpenWith.currentDefaultAndActive', "Active and Default");
		// Default order = setting -> highest priority -> text
		let defaultViewType = defaultSetting;
		if (!defaultViewType && registeredEditors.length > 2 && registeredEditors[1]?.editorInfo.priority !== RegisteredEditorPriority.option) {
			defaultViewType = registeredEditors[1]?.editorInfo.id;
		}
		if (!defaultViewType) {
			defaultViewType = DEFAULT_EDITOR_ASSOCIATION.id;
		}
		// Map the editors to quickpick entries
		registeredEditors.forEach(editor => {
			const currentViewType = currentEditor?.editorId ?? DEFAULT_EDITOR_ASSOCIATION.id;
			const isActive = currentEditor ? editor.editorInfo.id === currentViewType : false;
			const isDefault = editor.editorInfo.id === defaultViewType;
			const quickPickEntry: IQuickPickItem = {
				id: editor.editorInfo.id,
				label: editor.editorInfo.label,
				description: isActive && isDefault ? currentDefaultAndActiveLabel : isActive ? currentlyActiveLabel : isDefault ? currentDefaultLabel : undefined,
				detail: editor.editorInfo.detail ?? editor.editorInfo.priority,
			};
			quickPickEntries.push(quickPickEntry);
		});
		if (!showDefaultPicker && extname(resource) !== '') {
			const separator: IQuickPickSeparator = { type: 'separator' };
			quickPickEntries.push(separator);
			const configureDefaultEntry = {
				id: EditorResolverService.configureDefaultID,
				label: localize('promptOpenWith.configureDefault', "Configure default editor for '{0}'...", `*${extname(resource)}`),
			};
			quickPickEntries.push(configureDefaultEntry);
		}
		return quickPickEntries;
	}

	private async doPickEditor(editor: IUntypedEditorInput, showDefaultPicker?: boolean): Promise<IEditorOptions | undefined> {

		type EditorPick = {
			readonly item: IQuickPickItem;
			readonly keyMods?: IKeyMods;
			readonly openInBackground: boolean;
		};

		let resource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });

		if (resource === undefined) {
			resource = URI.from({ scheme: Schemas.untitled });
		}

		// Get all the editors for the resource as quickpick entries
		const editorPicks = this.mapEditorsToQuickPickEntry(resource, showDefaultPicker);

		// Create the editor picker
		const disposables = new DisposableStore();
		const editorPicker = disposables.add(this.quickInputService.createQuickPick<IQuickPickItem>({ useSeparators: true }));
		const placeHolderMessage = showDefaultPicker ?
			localize('promptOpenWith.updateDefaultPlaceHolder', "Select new default editor for '{0}'", `*${extname(resource)}`) :
			localize('promptOpenWith.placeHolder', "Select editor for '{0}'", basename(resource));
		editorPicker.placeholder = placeHolderMessage;
		editorPicker.canAcceptInBackground = true;
		editorPicker.items = editorPicks;
		const firstItem = editorPicker.items.find(item => item.type === 'item') as IQuickPickItem | undefined;
		if (firstItem) {
			editorPicker.selectedItems = [firstItem];
		}

		// Prompt the user to select an editor
		const picked: EditorPick | undefined = await new Promise<EditorPick | undefined>(resolve => {
			disposables.add(editorPicker.onDidAccept(e => {
				let result: EditorPick | undefined = undefined;

				if (editorPicker.selectedItems.length === 1) {
					result = {
						item: editorPicker.selectedItems[0],
						keyMods: editorPicker.keyMods,
						openInBackground: e.inBackground
					};
				}

				// If asked to always update the setting then update it even if the gear isn't clicked
				if (resource && showDefaultPicker && result?.item.id) {
					this.updateUserAssociations(`*${extname(resource)}`, result.item.id,);
				}

				resolve(result);
			}));

			disposables.add(editorPicker.onDidHide(() => {
				disposables.dispose();
				resolve(undefined);
			}));

			disposables.add(editorPicker.onDidTriggerItemButton(e => {

				// Trigger opening and close picker
				resolve({ item: e.item, openInBackground: false });

				// Persist setting
				if (resource && e.item?.id) {
					this.updateUserAssociations(`*${extname(resource)}`, e.item.id,);
				}
			}));

			editorPicker.show();
		});

		// Close picker
		editorPicker.dispose();

		// If the user picked an editor, look at how the picker was
		// used (e.g. modifier keys, open in background) and create the
		// options and group to use accordingly
		if (picked) {

			// If the user selected to configure default we trigger this picker again and tell it to show the default picker
			if (picked.item.id === EditorResolverService.configureDefaultID) {
				return this.doPickEditor(editor, true);
			}

			// Figure out options
			const targetOptions: IEditorOptions = {
				...editor.options,
				override: picked.item.id,
				preserveFocus: picked.openInBackground || editor.options?.preserveFocus,
			};

			return targetOptions;
		}

		return undefined;
	}

	private cacheEditors() {
		// Create a set to store glob patterns
		const cacheStorage: Set<string> = new Set<string>();

		// Store just the relative pattern pieces without any path info
		for (const [globPattern, contribPoint] of this._flattenedEditors) {
			const nonOptional = !!contribPoint.find(c => c.editorInfo.priority !== RegisteredEditorPriority.option && c.editorInfo.id !== DEFAULT_EDITOR_ASSOCIATION.id);
			// Don't keep a cache of the optional ones as those wouldn't be opened on start anyways
			if (!nonOptional) {
				continue;
			}
			if (glob.isRelativePattern(globPattern)) {
				cacheStorage.add(`${globPattern.pattern}`);
			} else {
				cacheStorage.add(globPattern);
			}
		}

		// Also store the users settings as those would have to activate on startup as well
		const userAssociations = this.getAllUserAssociations();
		for (const association of userAssociations) {
			if (association.filenamePattern) {
				cacheStorage.add(association.filenamePattern);
			}
		}
		this.storageService.store(EditorResolverService.cacheStorageID, JSON.stringify(Array.from(cacheStorage)), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	private resourceMatchesCache(resource: URI): boolean {
		if (!this.cache) {
			return false;
		}

		for (const cacheEntry of this.cache) {
			if (globMatchesResource(cacheEntry, resource)) {
				return true;
			}
		}
		return false;
	}
}

registerSingleton(IEditorResolverService, EditorResolverService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/browser/editorService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/browser/editorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IResourceEditorInput, IEditorOptions, EditorActivation, IResourceEditorInputIdentifier, ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { SideBySideEditor, IEditorPane, GroupIdentifier, IUntitledTextResourceEditorInput, IResourceDiffEditorInput, EditorInputWithOptions, isEditorInputWithOptions, IEditorIdentifier, IEditorCloseEvent, ITextDiffEditorPane, IRevertOptions, SaveReason, EditorsOrder, IWorkbenchEditorConfiguration, EditorResourceAccessor, IVisibleEditorPane, EditorInputCapabilities, isResourceDiffEditorInput, IUntypedEditorInput, isResourceEditorInput, isEditorInput, isEditorInputWithOptionsAndGroup, IFindEditorOptions, isResourceMergeEditorInput, IEditorWillOpenEvent, IEditorControl, ITextResourceDiffEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { ResourceMap, ResourceSet } from '../../../../base/common/map.js';
import { IFileService, FileOperationEvent, FileOperation, FileChangesEvent, FileChangeType } from '../../../../platform/files/common/files.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { joinPath } from '../../../../base/common/resources.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { SideBySideEditor as SideBySideEditorPane } from '../../../browser/parts/editor/sideBySideEditor.js';
import { IEditorGroupsService, IEditorGroup, GroupsOrder, IEditorReplacement, isEditorReplacement, ICloseEditorOptions, IEditorGroupsContainer } from '../common/editorGroupsService.js';
import { IUntypedEditorReplacement, IEditorService, ISaveEditorsOptions, ISaveAllEditorsOptions, IRevertAllEditorsOptions, IBaseSaveRevertAllEditorOptions, IOpenEditorsOptions, PreferredGroup, isPreferredGroup, IEditorsChangeEvent, ISaveEditorsResult } from '../common/editorService.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Disposable, IDisposable, dispose, DisposableStore } from '../../../../base/common/lifecycle.js';
import { coalesce, distinct } from '../../../../base/common/arrays.js';
import { isCodeEditor, isDiffEditor, ICodeEditor, IDiffEditor, isCompositeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorGroupView, EditorServiceImpl } from '../../../browser/parts/editor/editor.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { isUndefined } from '../../../../base/common/types.js';
import { EditorsObserver } from '../../../browser/parts/editor/editorsObserver.js';
import { Promises, timeout } from '../../../../base/common/async.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { indexOfPath } from '../../../../base/common/extpath.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IEditorResolverService, ResolvedStatus } from '../common/editorResolverService.js';
import { IWorkspaceTrustRequestService, WorkspaceTrustUriResponse } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IHostService } from '../../host/browser/host.js';
import { findGroup } from '../common/editorGroupFinder.js';
import { ITextEditorService } from '../../textfile/common/textEditorService.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';

export class EditorService extends Disposable implements EditorServiceImpl {

	declare readonly _serviceBrand: undefined;

	//#region events

	private readonly _onDidActiveEditorChange = this._register(new Emitter<void>());
	readonly onDidActiveEditorChange = this._onDidActiveEditorChange.event;

	private readonly _onDidVisibleEditorsChange = this._register(new Emitter<void>());
	readonly onDidVisibleEditorsChange = this._onDidVisibleEditorsChange.event;

	private readonly _onDidEditorsChange = this._register(new Emitter<IEditorsChangeEvent>());
	readonly onDidEditorsChange = this._onDidEditorsChange.event;

	private readonly _onWillOpenEditor = this._register(new Emitter<IEditorWillOpenEvent>());
	readonly onWillOpenEditor = this._onWillOpenEditor.event;

	private readonly _onDidCloseEditor = this._register(new Emitter<IEditorCloseEvent>());
	readonly onDidCloseEditor = this._onDidCloseEditor.event;

	private readonly _onDidOpenEditorFail = this._register(new Emitter<IEditorIdentifier>());
	readonly onDidOpenEditorFail = this._onDidOpenEditorFail.event;

	private readonly _onDidMostRecentlyActiveEditorsChange = this._register(new Emitter<void>());
	readonly onDidMostRecentlyActiveEditorsChange = this._onDidMostRecentlyActiveEditorsChange.event;

	//#endregion

	private readonly editorGroupsContainer: IEditorGroupsContainer;

	constructor(
		editorGroupsContainer: IEditorGroupsContainer | undefined,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IHostService private readonly hostService: IHostService,
		@ITextEditorService private readonly textEditorService: ITextEditorService
	) {
		super();

		this.editorGroupsContainer = editorGroupsContainer ?? editorGroupService;
		this.editorsObserver = this._register(this.instantiationService.createInstance(EditorsObserver, this.editorGroupsContainer));

		this.onConfigurationUpdated();

		this.registerListeners();
	}

	createScoped(editorGroupsContainer: IEditorGroupsContainer, disposables: DisposableStore): IEditorService {
		return disposables.add(new EditorService(editorGroupsContainer, this.editorGroupService, this.instantiationService, this.fileService, this.configurationService, this.contextService, this.uriIdentityService, this.editorResolverService, this.workspaceTrustRequestService, this.hostService, this.textEditorService));
	}

	private registerListeners(): void {

		// Editor & group changes
		if (this.editorGroupsContainer === this.editorGroupService.mainPart || this.editorGroupsContainer === this.editorGroupService) {
			this.editorGroupService.whenReady.then(() => this.onEditorGroupsReady());
		} else {
			this.onEditorGroupsReady();
		}
		this._register(this.editorGroupsContainer.onDidChangeActiveGroup(group => this.handleActiveEditorChange(group)));
		this._register(this.editorGroupsContainer.onDidAddGroup(group => this.registerGroupListeners(group as IEditorGroupView)));
		this._register(this.editorsObserver.onDidMostRecentlyActiveEditorsChange(() => this._onDidMostRecentlyActiveEditorsChange.fire()));

		// Out of workspace file watchers
		this._register(this.onDidVisibleEditorsChange(() => this.handleVisibleEditorsChange()));

		// File changes & operations
		// Note: there is some duplication with the two file event handlers- Since we cannot always rely on the disk events
		// carrying all necessary data in all environments, we also use the file operation events to make sure operations are handled.
		// In any case there is no guarantee if the local event is fired first or the disk one. Thus, code must handle the case
		// that the event ordering is random as well as might not carry all information needed.
		this._register(this.fileService.onDidRunOperation(e => this.onDidRunFileOperation(e)));
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));

		// Configuration
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));
	}

	//#region Editor & group event handlers

	private lastActiveEditor: EditorInput | undefined = undefined;

	private onEditorGroupsReady(): void {

		// Register listeners to each opened group
		for (const group of this.editorGroupsContainer.groups) {
			this.registerGroupListeners(group as IEditorGroupView);
		}

		// Fire initial set of editor events if there is an active editor
		if (this.activeEditor) {
			this.doHandleActiveEditorChangeEvent();
			this._onDidVisibleEditorsChange.fire();
		}
	}

	private handleActiveEditorChange(group: IEditorGroup): void {
		if (group !== this.editorGroupsContainer.activeGroup) {
			return; // ignore if not the active group
		}

		if (!this.lastActiveEditor && !group.activeEditor) {
			return; // ignore if we still have no active editor
		}

		this.doHandleActiveEditorChangeEvent();
	}

	private doHandleActiveEditorChangeEvent(): void {

		// Remember as last active
		const activeGroup = this.editorGroupsContainer.activeGroup;
		this.lastActiveEditor = activeGroup.activeEditor ?? undefined;

		// Fire event to outside parties
		this._onDidActiveEditorChange.fire();
	}

	private registerGroupListeners(group: IEditorGroupView): void {
		const groupDisposables = new DisposableStore();

		groupDisposables.add(group.onDidModelChange(e => {
			this._onDidEditorsChange.fire({ groupId: group.id, event: e });
		}));

		groupDisposables.add(group.onDidActiveEditorChange(() => {
			this.handleActiveEditorChange(group);
			this._onDidVisibleEditorsChange.fire();
		}));

		groupDisposables.add(group.onWillOpenEditor(e => {
			this._onWillOpenEditor.fire(e);
		}));

		groupDisposables.add(group.onDidCloseEditor(e => {
			this._onDidCloseEditor.fire(e);
		}));

		groupDisposables.add(group.onDidOpenEditorFail(editor => {
			this._onDidOpenEditorFail.fire({ editor, groupId: group.id });
		}));

		Event.once(group.onWillDispose)(() => {
			dispose(groupDisposables);
		});
	}

	//#endregion

	//#region Visible Editors Change: Install file watchers for out of workspace resources that became visible

	private readonly activeOutOfWorkspaceWatchers = new ResourceMap<IDisposable>();

	private handleVisibleEditorsChange(): void {
		const visibleOutOfWorkspaceResources = new ResourceSet();

		for (const editor of this.visibleEditors) {
			const resources = distinct(coalesce([
				EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY }),
				EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.SECONDARY })
			]), resource => resource.toString());

			for (const resource of resources) {
				if (this.fileService.hasProvider(resource) && !this.contextService.isInsideWorkspace(resource)) {
					visibleOutOfWorkspaceResources.add(resource);
				}
			}
		}

		// Handle no longer visible out of workspace resources
		for (const resource of this.activeOutOfWorkspaceWatchers.keys()) {
			if (!visibleOutOfWorkspaceResources.has(resource)) {
				dispose(this.activeOutOfWorkspaceWatchers.get(resource));
				this.activeOutOfWorkspaceWatchers.delete(resource);
			}
		}

		// Handle newly visible out of workspace resources
		for (const resource of visibleOutOfWorkspaceResources.keys()) {
			if (!this.activeOutOfWorkspaceWatchers.get(resource)) {
				const disposable = this.fileService.watch(resource);
				this.activeOutOfWorkspaceWatchers.set(resource, disposable);
			}
		}
	}

	//#endregion

	//#region File Changes: Move & Deletes to move or close opend editors

	private async onDidRunFileOperation(e: FileOperationEvent): Promise<void> {

		// Handle moves specially when file is opened
		if (e.isOperation(FileOperation.MOVE)) {
			this.handleMovedFile(e.resource, e.target.resource);
		}

		// Handle deletes
		if (e.isOperation(FileOperation.DELETE) || e.isOperation(FileOperation.MOVE)) {
			this.handleDeletedFile(e.resource, false, e.target ? e.target.resource : undefined);
		}
	}

	private onDidFilesChange(e: FileChangesEvent): void {
		if (e.gotDeleted()) {
			this.handleDeletedFile(e, true);
		}
	}

	private async handleMovedFile(source: URI, target: URI): Promise<void> {
		for (const group of this.editorGroupsContainer.groups) {
			const replacements: (IUntypedEditorReplacement | IEditorReplacement)[] = [];

			for (const editor of group.editors) {
				const resource = editor.resource;
				if (!resource || !this.uriIdentityService.extUri.isEqualOrParent(resource, source)) {
					continue; // not matching our resource
				}

				// Determine new resulting target resource
				let targetResource: URI;
				if (this.uriIdentityService.extUri.isEqual(source, resource)) {
					targetResource = target; // file got moved
				} else {
					const index = indexOfPath(resource.path, source.path, this.uriIdentityService.extUri.ignorePathCasing(resource));
					targetResource = joinPath(target, resource.path.substr(index + source.path.length + 1)); // parent folder got moved
				}

				// Delegate rename() to editor instance
				const moveResult = await editor.rename(group.id, targetResource);
				if (!moveResult) {
					return; // not target - ignore
				}

				const optionOverrides = {
					preserveFocus: true,
					pinned: group.isPinned(editor),
					sticky: group.isSticky(editor),
					index: group.getIndexOfEditor(editor),
					inactive: !group.isActive(editor)
				};

				// Construct a replacement with our extra options mixed in
				if (isEditorInput(moveResult.editor)) {
					replacements.push({
						editor,
						replacement: moveResult.editor,
						options: {
							...moveResult.options,
							...optionOverrides
						}
					});
				} else {
					replacements.push({
						editor,
						replacement: {
							...moveResult.editor,
							options: {
								...moveResult.editor.options,
								...optionOverrides
							}
						}
					});
				}
			}

			// Apply replacements
			if (replacements.length) {
				this.replaceEditors(replacements, group);
			}
		}
	}

	private closeOnFileDelete = false;

	private onConfigurationUpdated(e?: IConfigurationChangeEvent): void {
		if (e && !e.affectsConfiguration('workbench.editor.closeOnFileDelete')) {
			return;
		}

		const configuration = this.configurationService.getValue<IWorkbenchEditorConfiguration>();
		if (typeof configuration.workbench?.editor?.closeOnFileDelete === 'boolean') {
			this.closeOnFileDelete = configuration.workbench.editor.closeOnFileDelete;
		} else {
			this.closeOnFileDelete = false; // default
		}
	}

	private handleDeletedFile(arg1: URI | FileChangesEvent, isExternal: boolean, movedTo?: URI): void {
		for (const editor of this.getAllNonDirtyEditors({ includeUntitled: false, supportSideBySide: true })) {
			(async () => {
				const resource = editor.resource;
				if (!resource) {
					return;
				}

				// Handle deletes in opened editors depending on:
				// - we close any editor when `closeOnFileDelete: true`
				// - we close any editor when the delete occurred from within VSCode
				if (this.closeOnFileDelete || !isExternal) {

					// Do NOT close any opened editor that matches the resource path (either equal or being parent) of the
					// resource we move to (movedTo). Otherwise we would close a resource that has been renamed to the same
					// path but different casing.
					if (movedTo && this.uriIdentityService.extUri.isEqualOrParent(resource, movedTo)) {
						return;
					}

					let matches = false;
					if (arg1 instanceof FileChangesEvent) {
						matches = arg1.contains(resource, FileChangeType.DELETED);
					} else {
						matches = this.uriIdentityService.extUri.isEqualOrParent(resource, arg1);
					}

					if (!matches) {
						return;
					}

					// We have received reports of users seeing delete events even though the file still
					// exists (network shares issue: https://github.com/microsoft/vscode/issues/13665).
					// Since we do not want to close an editor without reason, we have to check if the
					// file is really gone and not just a faulty file event.
					// This only applies to external file events, so we need to check for the isExternal
					// flag.
					let exists = false;
					if (isExternal && this.fileService.hasProvider(resource)) {
						await timeout(100);
						exists = await this.fileService.exists(resource);
					}

					if (!exists && !editor.isDisposed()) {
						editor.dispose();
					}
				}
			})();
		}
	}

	private getAllNonDirtyEditors(options: { includeUntitled: boolean; supportSideBySide: boolean }): EditorInput[] {
		const editors: EditorInput[] = [];

		function conditionallyAddEditor(editor: EditorInput): void {
			if (editor.hasCapability(EditorInputCapabilities.Untitled) && !options.includeUntitled) {
				return;
			}

			if (editor.isDirty()) {
				return;
			}

			editors.push(editor);
		}

		for (const editor of this.editors) {
			if (options.supportSideBySide && editor instanceof SideBySideEditorInput) {
				conditionallyAddEditor(editor.primary);
				conditionallyAddEditor(editor.secondary);
			} else {
				conditionallyAddEditor(editor);
			}
		}

		return editors;
	}

	//#endregion

	//#region Editor accessors

	private readonly editorsObserver: EditorsObserver;

	get activeEditorPane(): IVisibleEditorPane | undefined {
		return this.editorGroupsContainer.activeGroup?.activeEditorPane;
	}

	get activeTextEditorControl(): ICodeEditor | IDiffEditor | undefined {
		const activeEditorPane = this.activeEditorPane;
		if (activeEditorPane) {
			const activeControl = activeEditorPane.getControl();
			if (isCodeEditor(activeControl) || isDiffEditor(activeControl)) {
				return activeControl;
			}
			if (isCompositeEditor(activeControl) && isCodeEditor(activeControl.activeCodeEditor)) {
				return activeControl.activeCodeEditor;
			}
		}

		return undefined;
	}

	get activeTextEditorLanguageId(): string | undefined {
		let activeCodeEditor: ICodeEditor | undefined = undefined;

		const activeTextEditorControl = this.activeTextEditorControl;
		if (isDiffEditor(activeTextEditorControl)) {
			activeCodeEditor = activeTextEditorControl.getModifiedEditor();
		} else {
			activeCodeEditor = activeTextEditorControl;
		}

		return activeCodeEditor?.getModel()?.getLanguageId();
	}

	get count(): number {
		return this.editorsObserver.count;
	}

	get editors(): EditorInput[] {
		return this.getEditors(EditorsOrder.SEQUENTIAL).map(({ editor }) => editor);
	}

	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): IEditorIdentifier[] {
		switch (order) {

			// MRU
			case EditorsOrder.MOST_RECENTLY_ACTIVE:
				if (options?.excludeSticky) {
					return this.editorsObserver.editors.filter(({ groupId, editor }) => !this.editorGroupsContainer.getGroup(groupId)?.isSticky(editor));
				}

				return this.editorsObserver.editors;

			// Sequential
			case EditorsOrder.SEQUENTIAL: {
				const editors: IEditorIdentifier[] = [];

				for (const group of this.editorGroupsContainer.getGroups(GroupsOrder.GRID_APPEARANCE)) {
					editors.push(...group.getEditors(EditorsOrder.SEQUENTIAL, options).map(editor => ({ editor, groupId: group.id })));
				}

				return editors;
			}
		}
	}

	get activeEditor(): EditorInput | undefined {
		const activeGroup = this.editorGroupsContainer.activeGroup;

		return activeGroup ? activeGroup.activeEditor ?? undefined : undefined;
	}

	get visibleEditorPanes(): IVisibleEditorPane[] {
		return coalesce(this.editorGroupsContainer.groups.map(group => group.activeEditorPane));
	}

	get visibleTextEditorControls(): Array<ICodeEditor | IDiffEditor> {
		return this.doGetVisibleTextEditorControls(this.visibleEditorPanes);
	}

	private doGetVisibleTextEditorControls(editorPanes: IVisibleEditorPane[]): Array<ICodeEditor | IDiffEditor> {
		const visibleTextEditorControls: Array<ICodeEditor | IDiffEditor> = [];
		for (const editorPane of editorPanes) {
			const controls: Array<IEditorControl | undefined> = [];
			if (editorPane instanceof SideBySideEditorPane) {
				controls.push(editorPane.getPrimaryEditorPane()?.getControl());
				controls.push(editorPane.getSecondaryEditorPane()?.getControl());
			} else {
				controls.push(editorPane.getControl());
			}

			for (const control of controls) {
				if (isCodeEditor(control) || isDiffEditor(control)) {
					visibleTextEditorControls.push(control);
				}
			}
		}

		return visibleTextEditorControls;
	}

	getVisibleTextEditorControls(order: EditorsOrder): readonly (ICodeEditor | IDiffEditor)[] {
		return this.doGetVisibleTextEditorControls(coalesce(this.editorGroupsContainer.getGroups(order === EditorsOrder.SEQUENTIAL ? GroupsOrder.GRID_APPEARANCE : GroupsOrder.MOST_RECENTLY_ACTIVE).map(group => group.activeEditorPane)));
	}

	get visibleEditors(): EditorInput[] {
		return coalesce(this.editorGroupsContainer.groups.map(group => group.activeEditor));
	}

	//#endregion

	//#region openEditor()

	openEditor(editor: EditorInput, options?: IEditorOptions, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: IUntypedEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: IResourceEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: ITextResourceEditorInput | IUntitledTextResourceEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: ITextResourceDiffEditorInput, group?: PreferredGroup): Promise<ITextDiffEditorPane | undefined>;
	openEditor(editor: IResourceDiffEditorInput, group?: PreferredGroup): Promise<ITextDiffEditorPane | undefined>;
	openEditor(editor: EditorInput | IUntypedEditorInput, optionsOrPreferredGroup?: IEditorOptions | PreferredGroup, preferredGroup?: PreferredGroup): Promise<IEditorPane | undefined>;
	async openEditor(editor: EditorInput | IUntypedEditorInput, optionsOrPreferredGroup?: IEditorOptions | PreferredGroup, preferredGroup?: PreferredGroup): Promise<IEditorPane | undefined> {
		let typedEditor: EditorInput | undefined = undefined;
		let options = isEditorInput(editor) ? optionsOrPreferredGroup as IEditorOptions : editor.options;
		let group: IEditorGroup | undefined = undefined;

		if (isPreferredGroup(optionsOrPreferredGroup)) {
			preferredGroup = optionsOrPreferredGroup;
		}

		// Resolve override unless disabled
		if (!isEditorInput(editor)) {
			const resolvedEditor = await this.editorResolverService.resolveEditor(editor, preferredGroup);

			if (resolvedEditor === ResolvedStatus.ABORT) {
				return; // skip editor if override is aborted
			}

			// We resolved an editor to use
			if (isEditorInputWithOptionsAndGroup(resolvedEditor)) {
				typedEditor = resolvedEditor.editor;
				options = resolvedEditor.options;
				group = resolvedEditor.group;
			}
		}

		// Override is disabled or did not apply: fallback to default
		if (!typedEditor) {
			typedEditor = isEditorInput(editor) ? editor : await this.textEditorService.resolveTextEditor(editor);
		}

		// If group still isn't defined because of a disabled override we resolve it
		if (!group) {
			let activation: EditorActivation | undefined = undefined;
			const findGroupResult = this.instantiationService.invokeFunction(findGroup, { editor: typedEditor, options }, preferredGroup);
			if (findGroupResult instanceof Promise) {
				([group, activation] = await findGroupResult);
			} else {
				([group, activation] = findGroupResult);
			}

			// Mixin editor group activation if returned
			if (activation) {
				options = { ...options, activation };
			}
		}

		return group.openEditor(typedEditor, options);
	}

	//#endregion

	//#region openEditors()

	openEditors(editors: EditorInputWithOptions[], group?: PreferredGroup, options?: IOpenEditorsOptions): Promise<IEditorPane[]>;
	openEditors(editors: IUntypedEditorInput[], group?: PreferredGroup, options?: IOpenEditorsOptions): Promise<IEditorPane[]>;
	openEditors(editors: Array<EditorInputWithOptions | IUntypedEditorInput>, group?: PreferredGroup, options?: IOpenEditorsOptions): Promise<IEditorPane[]>;
	async openEditors(editors: Array<EditorInputWithOptions | IUntypedEditorInput>, preferredGroup?: PreferredGroup, options?: IOpenEditorsOptions): Promise<IEditorPane[]> {

		// Pass all editors to trust service to determine if
		// we should proceed with opening the editors if we
		// are asked to validate trust.
		if (options?.validateTrust) {
			const editorsTrusted = await this.handleWorkspaceTrust(editors);
			if (!editorsTrusted) {
				return [];
			}
		}

		// Find target groups for editors to open
		const mapGroupToTypedEditors = new Map<IEditorGroup, Array<EditorInputWithOptions>>();
		for (const editor of editors) {
			let typedEditor: EditorInputWithOptions | undefined = undefined;
			let group: IEditorGroup | undefined = undefined;

			// Resolve override unless disabled
			if (!isEditorInputWithOptions(editor)) {
				const resolvedEditor = await this.editorResolverService.resolveEditor(editor, preferredGroup);

				if (resolvedEditor === ResolvedStatus.ABORT) {
					continue; // skip editor if override is aborted
				}

				// We resolved an editor to use
				if (isEditorInputWithOptionsAndGroup(resolvedEditor)) {
					typedEditor = resolvedEditor;
					group = resolvedEditor.group;
				}
			}

			// Override is disabled or did not apply: fallback to default
			if (!typedEditor) {
				typedEditor = isEditorInputWithOptions(editor) ? editor : { editor: await this.textEditorService.resolveTextEditor(editor), options: editor.options };
			}

			// If group still isn't defined because of a disabled override we resolve it
			if (!group) {
				const findGroupResult = this.instantiationService.invokeFunction(findGroup, typedEditor, preferredGroup);
				if (findGroupResult instanceof Promise) {
					([group] = await findGroupResult);
				} else {
					([group] = findGroupResult);
				}
			}

			// Update map of groups to editors
			let targetGroupEditors = mapGroupToTypedEditors.get(group);
			if (!targetGroupEditors) {
				targetGroupEditors = [];
				mapGroupToTypedEditors.set(group, targetGroupEditors);
			}

			targetGroupEditors.push(typedEditor);
		}

		// Open in target groups
		const result: Promise<IEditorPane | undefined>[] = [];
		for (const [group, editors] of mapGroupToTypedEditors) {
			result.push(group.openEditors(editors));
		}

		return coalesce(await Promises.settled(result));
	}

	private async handleWorkspaceTrust(editors: Array<EditorInputWithOptions | IUntypedEditorInput>): Promise<boolean> {
		const { resources, diffMode, mergeMode } = this.extractEditorResources(editors);

		const trustResult = await this.workspaceTrustRequestService.requestOpenFilesTrust(resources);
		switch (trustResult) {
			case WorkspaceTrustUriResponse.Open:
				return true;
			case WorkspaceTrustUriResponse.OpenInNewWindow:
				await this.hostService.openWindow(resources.map(resource => ({ fileUri: resource })), { forceNewWindow: true, diffMode, mergeMode });
				return false;
			case WorkspaceTrustUriResponse.Cancel:
				return false;
		}
	}

	private extractEditorResources(editors: Array<EditorInputWithOptions | IUntypedEditorInput>): { resources: URI[]; diffMode?: boolean; mergeMode?: boolean } {
		const resources = new ResourceSet();
		let diffMode = false;
		let mergeMode = false;

		for (const editor of editors) {

			// Typed Editor
			if (isEditorInputWithOptions(editor)) {
				const resource = EditorResourceAccessor.getOriginalUri(editor.editor, { supportSideBySide: SideBySideEditor.BOTH });
				if (URI.isUri(resource)) {
					resources.add(resource);
				} else if (resource) {
					if (resource.primary) {
						resources.add(resource.primary);
					}

					if (resource.secondary) {
						resources.add(resource.secondary);
					}

					diffMode = editor.editor instanceof DiffEditorInput;
				}
			}

			// Untyped editor
			else {
				if (isResourceMergeEditorInput(editor)) {
					if (URI.isUri(editor.input1)) {
						resources.add(editor.input1.resource);
					}

					if (URI.isUri(editor.input2)) {
						resources.add(editor.input2.resource);
					}

					if (URI.isUri(editor.base)) {
						resources.add(editor.base.resource);
					}

					if (URI.isUri(editor.result)) {
						resources.add(editor.result.resource);
					}

					mergeMode = true;
				} if (isResourceDiffEditorInput(editor)) {
					if (URI.isUri(editor.original.resource)) {
						resources.add(editor.original.resource);
					}

					if (URI.isUri(editor.modified.resource)) {
						resources.add(editor.modified.resource);
					}

					diffMode = true;
				} else if (isResourceEditorInput(editor)) {
					resources.add(editor.resource);
				}
			}
		}

		return {
			resources: Array.from(resources.keys()),
			diffMode,
			mergeMode
		};
	}

	//#endregion

	//#region isOpened() / isVisible()

	isOpened(editor: IResourceEditorInputIdentifier): boolean {
		return this.editorsObserver.hasEditor({
			resource: this.uriIdentityService.asCanonicalUri(editor.resource),
			typeId: editor.typeId,
			editorId: editor.editorId
		});
	}

	isVisible(editor: EditorInput): boolean {
		for (const group of this.editorGroupsContainer.groups) {
			if (group.activeEditor?.matches(editor)) {
				return true;
			}
		}

		return false;
	}

	//#endregion

	//#region closeEditor()

	async closeEditor({ editor, groupId }: IEditorIdentifier, options?: ICloseEditorOptions): Promise<void> {
		const group = this.editorGroupsContainer.getGroup(groupId);

		await group?.closeEditor(editor, options);
	}

	//#endregion

	//#region closeEditors()

	async closeEditors(editors: IEditorIdentifier[], options?: ICloseEditorOptions): Promise<void> {
		const mapGroupToEditors = new Map<IEditorGroup, EditorInput[]>();

		for (const { editor, groupId } of editors) {
			const group = this.editorGroupsContainer.getGroup(groupId);
			if (!group) {
				continue;
			}

			let editors = mapGroupToEditors.get(group);
			if (!editors) {
				editors = [];
				mapGroupToEditors.set(group, editors);
			}

			editors.push(editor);
		}

		for (const [group, editors] of mapGroupToEditors) {
			await group.closeEditors(editors, options);
		}
	}

	//#endregion

	//#region findEditors()

	findEditors(resource: URI, options?: IFindEditorOptions): readonly IEditorIdentifier[];
	findEditors(editor: IResourceEditorInputIdentifier, options?: IFindEditorOptions): readonly IEditorIdentifier[];
	findEditors(resource: URI, options: IFindEditorOptions | undefined, group: IEditorGroup | GroupIdentifier): readonly EditorInput[];
	findEditors(editor: IResourceEditorInputIdentifier, options: IFindEditorOptions | undefined, group: IEditorGroup | GroupIdentifier): EditorInput | undefined;
	findEditors(arg1: URI | IResourceEditorInputIdentifier, options: IFindEditorOptions | undefined, arg2?: IEditorGroup | GroupIdentifier): readonly IEditorIdentifier[] | readonly EditorInput[] | EditorInput | undefined;
	findEditors(arg1: URI | IResourceEditorInputIdentifier, options: IFindEditorOptions | undefined, arg2?: IEditorGroup | GroupIdentifier): readonly IEditorIdentifier[] | readonly EditorInput[] | EditorInput | undefined {
		const resource = URI.isUri(arg1) ? arg1 : arg1.resource;
		const typeId = URI.isUri(arg1) ? undefined : arg1.typeId;

		// Do a quick check for the resource via the editor observer
		// which is a very efficient way to find an editor by resource.
		// However, we can only do that unless we are asked to find an
		// editor on the secondary side of a side by side editor, because
		// the editor observer provides fast lookups only for primary
		// editors.
		if (options?.supportSideBySide !== SideBySideEditor.ANY && options?.supportSideBySide !== SideBySideEditor.SECONDARY) {
			if (!this.editorsObserver.hasEditors(resource)) {
				if (URI.isUri(arg1) || isUndefined(arg2)) {
					return [];
				}

				return undefined;
			}
		}

		// Search only in specific group
		if (!isUndefined(arg2)) {
			const targetGroup = typeof arg2 === 'number' ? this.editorGroupsContainer.getGroup(arg2) : arg2;

			// Resource provided: result is an array
			if (URI.isUri(arg1)) {
				if (!targetGroup) {
					return [];
				}

				return targetGroup.findEditors(resource, options);
			}

			// Editor identifier provided, result is single
			else {
				if (!targetGroup) {
					return undefined;
				}

				const editors = targetGroup.findEditors(resource, options);
				for (const editor of editors) {
					if (editor.typeId === typeId) {
						return editor;
					}
				}

				return undefined;
			}
		}

		// Search across all groups in MRU order
		else {
			const result: IEditorIdentifier[] = [];

			for (const group of this.editorGroupsContainer.getGroups(options?.order === EditorsOrder.SEQUENTIAL ? GroupsOrder.GRID_APPEARANCE : GroupsOrder.MOST_RECENTLY_ACTIVE)) {
				const editors: EditorInput[] = [];

				// Resource provided: result is an array
				if (URI.isUri(arg1)) {
					editors.push(...this.findEditors(arg1, options, group));
				}

				// Editor identifier provided, result is single
				else {
					const editor = this.findEditors(arg1, options, group);
					if (editor) {
						editors.push(editor);
					}
				}

				result.push(...editors.map(editor => ({ editor, groupId: group.id })));
			}

			return result;
		}
	}

	//#endregion

	//#region replaceEditors()

	async replaceEditors(replacements: IUntypedEditorReplacement[], group: IEditorGroup | GroupIdentifier): Promise<void>;
	async replaceEditors(replacements: IEditorReplacement[], group: IEditorGroup | GroupIdentifier): Promise<void>;
	async replaceEditors(replacements: Array<IEditorReplacement | IUntypedEditorReplacement>, group: IEditorGroup | GroupIdentifier): Promise<void> {
		const targetGroup = typeof group === 'number' ? this.editorGroupsContainer.getGroup(group) : group;

		// Convert all replacements to typed editors unless already
		// typed and handle overrides properly.
		const typedReplacements: IEditorReplacement[] = [];
		for (const replacement of replacements) {
			let typedReplacement: IEditorReplacement | undefined = undefined;

			// Resolve override unless disabled
			if (!isEditorInput(replacement.replacement)) {
				const resolvedEditor = await this.editorResolverService.resolveEditor(
					replacement.replacement,
					targetGroup
				);

				if (resolvedEditor === ResolvedStatus.ABORT) {
					continue; // skip editor if override is aborted
				}

				// We resolved an editor to use
				if (isEditorInputWithOptionsAndGroup(resolvedEditor)) {
					typedReplacement = {
						editor: replacement.editor,
						replacement: resolvedEditor.editor,
						options: resolvedEditor.options,
						forceReplaceDirty: replacement.forceReplaceDirty
					};
				}
			}

			// Override is disabled or did not apply: fallback to default
			if (!typedReplacement) {
				typedReplacement = {
					editor: replacement.editor,
					replacement: isEditorReplacement(replacement) ? replacement.replacement : await this.textEditorService.resolveTextEditor(replacement.replacement),
					options: isEditorReplacement(replacement) ? replacement.options : replacement.replacement.options,
					forceReplaceDirty: replacement.forceReplaceDirty
				};
			}

			typedReplacements.push(typedReplacement);
		}

		return targetGroup?.replaceEditors(typedReplacements);
	}

	//#endregion

	//#region save/revert

	async save(editors: IEditorIdentifier | IEditorIdentifier[], options?: ISaveEditorsOptions): Promise<ISaveEditorsResult> {

		// Convert to array
		if (!Array.isArray(editors)) {
			editors = [editors];
		}

		// Make sure to not save the same editor multiple times
		// by using the `matches()` method to find duplicates
		const uniqueEditors = this.getUniqueEditors(editors);

		// Split editors up into a bucket that is saved in parallel
		// and sequentially. Unless "Save As", all non-untitled editors
		// can be saved in parallel to speed up the operation. Remaining
		// editors are potentially bringing up some UI and thus run
		// sequentially.
		const editorsToSaveParallel: IEditorIdentifier[] = [];
		const editorsToSaveSequentially: IEditorIdentifier[] = [];
		if (options?.saveAs) {
			editorsToSaveSequentially.push(...uniqueEditors);
		} else {
			for (const { groupId, editor } of uniqueEditors) {
				if (editor.hasCapability(EditorInputCapabilities.Untitled)) {
					editorsToSaveSequentially.push({ groupId, editor });
				} else {
					editorsToSaveParallel.push({ groupId, editor });
				}
			}
		}

		// Editors to save in parallel
		const saveResults = await Promises.settled(editorsToSaveParallel.map(({ groupId, editor }) => {

			// Use save as a hint to pin the editor if used explicitly
			if (options?.reason === SaveReason.EXPLICIT) {
				this.editorGroupsContainer.getGroup(groupId)?.pinEditor(editor);
			}

			// Save
			return editor.save(groupId, options);
		}));

		// Editors to save sequentially
		for (const { groupId, editor } of editorsToSaveSequentially) {
			if (editor.isDisposed()) {
				continue; // might have been disposed from the save already
			}

			// Preserve view state by opening the editor first if the editor
			// is untitled or we "Save As". This also allows the user to review
			// the contents of the editor before making a decision.
			const editorPane = await this.openEditor(editor, groupId);
			const editorOptions: IEditorOptions = {
				pinned: true,
				viewState: editorPane?.getViewState()
			};

			const result = options?.saveAs ? await editor.saveAs(groupId, options) : await editor.save(groupId, options);
			saveResults.push(result);

			if (!result) {
				break; // failed or cancelled, abort
			}

			// Replace editor preserving viewstate (either across all groups or
			// only selected group) if the resulting editor is different from the
			// current one.
			if (!editor.matches(result)) {
				const targetGroups = editor.hasCapability(EditorInputCapabilities.Untitled) ? this.editorGroupsContainer.groups.map(group => group.id) /* untitled replaces across all groups */ : [groupId];
				for (const targetGroup of targetGroups) {
					if (result instanceof EditorInput) {
						await this.replaceEditors([{ editor, replacement: result, options: editorOptions }], targetGroup);
					} else {
						await this.replaceEditors([{ editor, replacement: { ...result, options: editorOptions } }], targetGroup);
					}
				}
			}
		}
		return {
			success: saveResults.every(result => !!result),
			editors: coalesce(saveResults)
		};
	}

	saveAll(options?: ISaveAllEditorsOptions): Promise<ISaveEditorsResult> {
		return this.save(this.getAllModifiedEditors(options), options);
	}

	async revert(editors: IEditorIdentifier | IEditorIdentifier[], options?: IRevertOptions): Promise<boolean> {

		// Convert to array
		if (!Array.isArray(editors)) {
			editors = [editors];
		}

		// Make sure to not revert the same editor multiple times
		// by using the `matches()` method to find duplicates
		const uniqueEditors = this.getUniqueEditors(editors);

		await Promises.settled(uniqueEditors.map(async ({ groupId, editor }) => {

			// Use revert as a hint to pin the editor
			this.editorGroupsContainer.getGroup(groupId)?.pinEditor(editor);

			return editor.revert(groupId, options);
		}));

		return !uniqueEditors.some(({ editor }) => editor.isDirty());
	}

	async revertAll(options?: IRevertAllEditorsOptions): Promise<boolean> {
		return this.revert(this.getAllModifiedEditors(options), options);
	}

	private getAllModifiedEditors(options?: IBaseSaveRevertAllEditorOptions): IEditorIdentifier[] {
		const editors: IEditorIdentifier[] = [];

		for (const group of this.editorGroupsContainer.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			for (const editor of group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
				if (!editor.isModified()) {
					continue;
				}

				if ((typeof options?.includeUntitled === 'boolean' || !options?.includeUntitled?.includeScratchpad)
					&& editor.hasCapability(EditorInputCapabilities.Scratchpad)) {
					continue;
				}

				if (!options?.includeUntitled && editor.hasCapability(EditorInputCapabilities.Untitled)) {
					continue;
				}

				if (options?.excludeSticky && group.isSticky(editor)) {
					continue;
				}

				editors.push({ groupId: group.id, editor });
			}
		}

		return editors;
	}

	private getUniqueEditors(editors: IEditorIdentifier[]): IEditorIdentifier[] {
		const uniqueEditors: IEditorIdentifier[] = [];
		for (const { editor, groupId } of editors) {
			if (uniqueEditors.some(uniqueEditor => uniqueEditor.editor.matches(editor))) {
				continue;
			}

			uniqueEditors.push({ editor, groupId });
		}

		return uniqueEditors;
	}

	//#endregion

	override dispose(): void {
		super.dispose();

		// Dispose remaining watchers if any
		this.activeOutOfWorkspaceWatchers.forEach(disposable => dispose(disposable));
		this.activeOutOfWorkspaceWatchers.clear();
	}
}

registerSingleton(IEditorService, new SyncDescriptor(EditorService, [undefined], false));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/customEditorLabelService.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/customEditorLabelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { ParsedPattern, parse as parseGlob } from '../../../../base/common/glob.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isAbsolute, parse as parsePath, ParsedPath, dirname } from '../../../../base/common/path.js';
import { dirname as resourceDirname, relativePath as getRelativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { MRUCache } from '../../../../base/common/map.js';

interface ICustomEditorLabelObject {
	readonly [key: string]: string;
}

interface ICustomEditorLabelPattern {
	readonly pattern: string;
	readonly template: string;

	readonly isAbsolutePath: boolean;
	readonly parsedPattern: ParsedPattern;
}

export class CustomEditorLabelService extends Disposable implements ICustomEditorLabelService {

	readonly _serviceBrand: undefined;

	static readonly SETTING_ID_PATTERNS = 'workbench.editor.customLabels.patterns';
	static readonly SETTING_ID_ENABLED = 'workbench.editor.customLabels.enabled';

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private patterns: ICustomEditorLabelPattern[] = [];
	private enabled = true;

	private cache = new MRUCache<string, string | null>(1000);

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
	) {
		super();

		this.storeEnablementState();
		this.storeCustomPatterns();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			// Cache the enabled state
			if (e.affectsConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED)) {
				const oldEnablement = this.enabled;
				this.storeEnablementState();
				if (oldEnablement !== this.enabled && this.patterns.length > 0) {
					this._onDidChange.fire();
				}
			}

			// Cache the patterns
			else if (e.affectsConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS)) {
				this.cache.clear();
				this.storeCustomPatterns();
				this._onDidChange.fire();
			}
		}));
	}

	private storeEnablementState(): void {
		this.enabled = this.configurationService.getValue<boolean>(CustomEditorLabelService.SETTING_ID_ENABLED);
	}

	private _templateRegexValidation = /[a-zA-Z0-9]/;
	private storeCustomPatterns(): void {
		this.patterns = [];
		const customLabelPatterns = this.configurationService.getValue<ICustomEditorLabelObject>(CustomEditorLabelService.SETTING_ID_PATTERNS);
		for (const pattern in customLabelPatterns) {
			const template = customLabelPatterns[pattern];

			if (!this._templateRegexValidation.test(template)) {
				continue;
			}

			const isAbsolutePath = isAbsolute(pattern);
			const parsedPattern = parseGlob(pattern, { ignoreCase: true });

			this.patterns.push({ pattern, template, isAbsolutePath, parsedPattern });
		}

		this.patterns.sort((a, b) => this.patternWeight(b.pattern) - this.patternWeight(a.pattern));
	}

	private patternWeight(pattern: string): number {
		let weight = 0;
		for (const fragment of pattern.split('/')) {
			if (fragment === '**') {
				weight += 1;
			} else if (fragment === '*') {
				weight += 10;
			} else if (fragment.includes('*') || fragment.includes('?')) {
				weight += 50;
			} else if (fragment !== '') {
				weight += 100;
			}
		}

		return weight;
	}

	getName(resource: URI): string | undefined {
		if (!this.enabled || this.patterns.length === 0) {
			return undefined;
		}

		const key = resource.toString();
		const cached = this.cache.get(key);
		if (cached !== undefined) {
			return cached ?? undefined;
		}

		const result = this.applyPatterns(resource);
		this.cache.set(key, result ?? null);

		return result;
	}

	private applyPatterns(resource: URI): string | undefined {
		const root = this.workspaceContextService.getWorkspaceFolder(resource);
		let relativePath: string | undefined;

		for (const pattern of this.patterns) {
			let relevantPath: string;
			if (root && !pattern.isAbsolutePath) {
				if (!relativePath) {
					relativePath = getRelativePath(resourceDirname(root.uri), resource) ?? resource.path;
				}
				relevantPath = relativePath;
			} else {
				relevantPath = resource.path;
			}

			if (pattern.parsedPattern(relevantPath)) {
				return this.applyTemplate(pattern.template, resource, relevantPath);
			}
		}

		return undefined;
	}

	private readonly _parsedTemplateExpression = /\$\{(dirname|filename|extname|extname\((?<extnameN>[-+]?\d+)\)|dirname\((?<dirnameN>[-+]?\d+)\))\}/g;
	private readonly _filenameCaptureExpression = /(?<filename>^\.*[^.]*)/;
	private applyTemplate(template: string, resource: URI, relevantPath: string): string {
		let parsedPath: undefined | ParsedPath;
		return template.replace(this._parsedTemplateExpression, (match: string, variable: string, ...args: unknown[]) => {
			parsedPath = parsedPath ?? parsePath(resource.path);
			// named group matches
			const { dirnameN = '0', extnameN = '0' } = args.pop() as { dirnameN?: string; extnameN?: string };

			if (variable === 'filename') {
				const { filename } = this._filenameCaptureExpression.exec(parsedPath.base)?.groups ?? {};
				if (filename) {
					return filename;
				}
			} else if (variable === 'extname') {
				const extension = this.getExtnames(parsedPath.base);
				if (extension) {
					return extension;
				}
			} else if (variable.startsWith('extname')) {
				const n = parseInt(extnameN);
				const nthExtname = this.getNthExtname(parsedPath.base, n);
				if (nthExtname) {
					return nthExtname;
				}
			} else if (variable.startsWith('dirname')) {
				const n = parseInt(dirnameN);
				const nthDir = this.getNthDirname(dirname(relevantPath), n);
				if (nthDir) {
					return nthDir;
				}
			}

			return match;
		});
	}

	private removeLeadingDot(path: string): string {
		let withoutLeadingDot = path;
		while (withoutLeadingDot.startsWith('.')) {
			withoutLeadingDot = withoutLeadingDot.slice(1);
		}
		return withoutLeadingDot;
	}

	private getNthDirname(path: string, n: number): string | undefined {
		// grand-parent/parent/filename.ext1.ext2 -> [grand-parent, parent]
		path = path.startsWith('/') ? path.slice(1) : path;
		const pathFragments = path.split('/');

		return this.getNthFragment(pathFragments, n);
	}

	private getExtnames(fullFileName: string): string {
		return this.removeLeadingDot(fullFileName).split('.').slice(1).join('.');
	}

	private getNthExtname(fullFileName: string, n: number): string | undefined {
		// file.ext1.ext2.ext3 -> [file, ext1, ext2, ext3]
		const extensionNameFragments = this.removeLeadingDot(fullFileName).split('.');
		extensionNameFragments.shift(); // remove the first element which is the file name

		return this.getNthFragment(extensionNameFragments, n);
	}

	private getNthFragment(fragments: string[], n: number): string | undefined {
		const length = fragments.length;

		let nth;
		if (n < 0) {
			nth = Math.abs(n) - 1;
		} else {
			nth = length - n - 1;
		}

		const nthFragment = fragments[nth];
		if (nthFragment === undefined || nthFragment === '') {
			return undefined;
		}
		return nthFragment;
	}
}

export const ICustomEditorLabelService = createDecorator<ICustomEditorLabelService>('ICustomEditorLabelService');

export interface ICustomEditorLabelService {
	readonly _serviceBrand: undefined;
	readonly onDidChange: Event<void>;
	getName(resource: URI): string | undefined;
}

registerSingleton(ICustomEditorLabelService, CustomEditorLabelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/editorGroupColumn.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorGroupColumn.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { GroupIdentifier } from '../../../common/editor.js';
import { IEditorGroupsService, GroupsOrder, IEditorGroup, preferredSideBySideGroupDirection } from './editorGroupsService.js';
import { ACTIVE_GROUP, ACTIVE_GROUP_TYPE, AUX_WINDOW_GROUP, SIDE_GROUP, SIDE_GROUP_TYPE } from './editorService.js';

/**
 * A way to address editor groups through a column based system
 * where `0` is the first column. Will fallback to `SIDE_GROUP`
 * in case the column is invalid.
 */
export type EditorGroupColumn = number;

export function columnToEditorGroup(editorGroupService: IEditorGroupsService, configurationService: IConfigurationService, column = ACTIVE_GROUP): GroupIdentifier | ACTIVE_GROUP_TYPE | SIDE_GROUP_TYPE {
	if (column === ACTIVE_GROUP || column === SIDE_GROUP || column === AUX_WINDOW_GROUP) {
		return column; // return early for when column is well known
	}

	let groupInColumn = editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE)[column];

	// If a column is asked for that does not exist, we create up to 9 columns in accordance
	// to what `ViewColumn` provides and otherwise fallback to `SIDE_GROUP`.

	if (!groupInColumn && column < 9) {
		for (let i = 0; i <= column; i++) {
			const editorGroups = editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE);
			if (!editorGroups[i]) {
				editorGroupService.addGroup(editorGroups[i - 1], preferredSideBySideGroupDirection(configurationService));
			}
		}

		groupInColumn = editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE)[column];
	}

	return groupInColumn?.id ?? SIDE_GROUP; // finally open to the side when group not found
}

export function editorGroupToColumn(editorGroupService: IEditorGroupsService, editorGroup: IEditorGroup | GroupIdentifier): EditorGroupColumn {
	const group = (typeof editorGroup === 'number') ? editorGroupService.getGroup(editorGroup) : editorGroup;

	return editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE).indexOf(group ?? editorGroupService.activeGroup);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/editor/common/editorGroupFinder.ts]---
Location: vscode-main/src/vs/workbench/services/editor/common/editorGroupFinder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { EditorActivation } from '../../../../platform/editor/common/editor.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorInputWithOptions, isEditorInputWithOptions, IUntypedEditorInput, isEditorInput, EditorInputCapabilities } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, GroupsOrder, preferredSideBySideGroupDirection, IEditorGroupsService } from './editorGroupsService.js';
import { AUX_WINDOW_GROUP, AUX_WINDOW_GROUP_TYPE, PreferredGroup, SIDE_GROUP } from './editorService.js';

/**
 * Finds the target `IEditorGroup` given the instructions provided
 * that is best for the editor and matches the preferred group if
 * possible.
 */
export function findGroup(accessor: ServicesAccessor, editor: IUntypedEditorInput, preferredGroup: Exclude<PreferredGroup, AUX_WINDOW_GROUP_TYPE> | undefined): [IEditorGroup, EditorActivation | undefined];
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions, preferredGroup: Exclude<PreferredGroup, AUX_WINDOW_GROUP_TYPE> | undefined): [IEditorGroup, EditorActivation | undefined];
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: Exclude<PreferredGroup, AUX_WINDOW_GROUP_TYPE> | undefined): [IEditorGroup, EditorActivation | undefined];
export function findGroup(accessor: ServicesAccessor, editor: IUntypedEditorInput, preferredGroup: AUX_WINDOW_GROUP_TYPE): Promise<[IEditorGroup, EditorActivation | undefined]>;
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions, preferredGroup: AUX_WINDOW_GROUP_TYPE): Promise<[IEditorGroup, EditorActivation | undefined]>;
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: AUX_WINDOW_GROUP_TYPE): Promise<[IEditorGroup, EditorActivation | undefined]>;
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: PreferredGroup | undefined): Promise<[IEditorGroup, EditorActivation | undefined]> | [IEditorGroup, EditorActivation | undefined];
export function findGroup(accessor: ServicesAccessor, editor: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: PreferredGroup | undefined): Promise<[IEditorGroup, EditorActivation | undefined]> | [IEditorGroup, EditorActivation | undefined] {
	const editorGroupService = accessor.get(IEditorGroupsService);
	const configurationService = accessor.get(IConfigurationService);

	const group = doFindGroup(editor, preferredGroup, editorGroupService, configurationService);
	if (group instanceof Promise) {
		return group.then(group => handleGroupActivation(group, editor, preferredGroup, editorGroupService));
	}

	return handleGroupActivation(group, editor, preferredGroup, editorGroupService);
}

function handleGroupActivation(group: IEditorGroup, editor: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: PreferredGroup | undefined, editorGroupService: IEditorGroupsService): [IEditorGroup, EditorActivation | undefined] {

	// Resolve editor activation strategy
	let activation: EditorActivation | undefined = undefined;
	if (
		editorGroupService.activeGroup !== group && 		// only if target group is not already active
		editor.options && !editor.options.inactive &&		// never for inactive editors
		editor.options.preserveFocus &&						// only if preserveFocus
		typeof editor.options.activation !== 'number' &&	// only if activation is not already defined (either true or false)
		preferredGroup !== SIDE_GROUP						// never for the SIDE_GROUP
	) {
		// If the resolved group is not the active one, we typically
		// want the group to become active. There are a few cases
		// where we stay away from encorcing this, e.g. if the caller
		// is already providing `activation`.
		//
		// Specifically for historic reasons we do not activate a
		// group is it is opened as `SIDE_GROUP` with `preserveFocus:true`.
		// repeated Alt-clicking of files in the explorer always open
		// into the same side group and not cause a group to be created each time.
		activation = EditorActivation.ACTIVATE;
	}

	return [group, activation];
}

function doFindGroup(input: EditorInputWithOptions | IUntypedEditorInput, preferredGroup: PreferredGroup | undefined, editorGroupService: IEditorGroupsService, configurationService: IConfigurationService): Promise<IEditorGroup> | IEditorGroup {
	let group: Promise<IEditorGroup> | IEditorGroup | undefined;
	const editor = isEditorInputWithOptions(input) ? input.editor : input;
	const options = input.options;

	// Group: Instance of Group
	if (preferredGroup && typeof preferredGroup !== 'number') {
		group = preferredGroup;
	}

	// Group: Specific Group
	else if (typeof preferredGroup === 'number' && preferredGroup >= 0) {
		group = editorGroupService.getGroup(preferredGroup);
	}

	// Group: Side by Side
	else if (preferredGroup === SIDE_GROUP) {
		const direction = preferredSideBySideGroupDirection(configurationService);

		let candidateGroup = editorGroupService.findGroup({ direction });
		if (!candidateGroup || isGroupLockedForEditor(candidateGroup, editor)) {
			// Create new group either when the candidate group
			// is locked or was not found in the direction
			candidateGroup = editorGroupService.addGroup(editorGroupService.activeGroup, direction);
		}

		group = candidateGroup;
	}

	// Group: Aux Window
	else if (preferredGroup === AUX_WINDOW_GROUP) {
		group = editorGroupService.createAuxiliaryEditorPart({
			bounds: options?.auxiliary?.bounds,
			compact: options?.auxiliary?.compact,
			alwaysOnTop: options?.auxiliary?.alwaysOnTop
		}).then(group => group.activeGroup);
	}

	// Group: Unspecified without a specific index to open
	else if (!options || typeof options.index !== 'number') {
		const groupsByLastActive = editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);

		// Respect option to reveal an editor if it is already visible in any group
		if (options?.revealIfVisible) {
			for (const lastActiveGroup of groupsByLastActive) {
				if (isActive(lastActiveGroup, editor)) {
					group = lastActiveGroup;
					break;
				}
			}
		}

		// Respect option to reveal an editor if it is open (not necessarily visible)
		// Still prefer to reveal an editor in a group where the editor is active though.
		// We also try to reveal an editor if it has the `Singleton` capability which
		// indicates that the same editor cannot be opened across groups.
		if (!group) {
			if (options?.revealIfOpened || configurationService.getValue<boolean>('workbench.editor.revealIfOpen') || (isEditorInput(editor) && editor.hasCapability(EditorInputCapabilities.Singleton))) {
				let groupWithInputActive: IEditorGroup | undefined = undefined;
				let groupWithInputOpened: IEditorGroup | undefined = undefined;

				for (const group of groupsByLastActive) {
					if (isOpened(group, editor)) {
						if (!groupWithInputOpened) {
							groupWithInputOpened = group;
						}

						if (!groupWithInputActive && group.isActive(editor)) {
							groupWithInputActive = group;
						}
					}

					if (groupWithInputOpened && groupWithInputActive) {
						break; // we found all groups we wanted
					}
				}

				// Prefer a target group where the input is visible
				group = groupWithInputActive || groupWithInputOpened;
			}
		}
	}

	// Fallback to active group if target not valid but avoid
	// locked editor groups unless editor is already opened there
	if (!group) {
		let candidateGroup = editorGroupService.activeGroup;

		// Locked group: find the next non-locked group
		// going up the neigbours of the group or create
		// a new group otherwise
		if (isGroupLockedForEditor(candidateGroup, editor)) {
			for (const group of editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
				if (isGroupLockedForEditor(group, editor)) {
					continue;
				}

				candidateGroup = group;
				break;
			}

			if (isGroupLockedForEditor(candidateGroup, editor)) {
				// Group is still locked, so we have to create a new
				// group to the side of the candidate group
				group = editorGroupService.addGroup(candidateGroup, preferredSideBySideGroupDirection(configurationService));
			} else {
				group = candidateGroup;
			}
		}

		// Non-locked group: take as is
		else {
			group = candidateGroup;
		}
	}

	return group;
}

function isGroupLockedForEditor(group: IEditorGroup, editor: EditorInput | IUntypedEditorInput): boolean {
	if (!group.isLocked) {
		// only relevant for locked editor groups
		return false;
	}

	if (isOpened(group, editor)) {
		// special case: the locked group contains
		// the provided editor. in that case we do not want
		// to open the editor in any different group.
		return false;
	}

	// group is locked for this editor
	return true;
}

function isActive(group: IEditorGroup, editor: EditorInput | IUntypedEditorInput): boolean {
	if (!group.activeEditor) {
		return false;
	}

	return group.activeEditor.matches(editor);
}

function isOpened(group: IEditorGroup, editor: EditorInput | IUntypedEditorInput): boolean {
	for (const typedEditor of group.editors) {
		if (typedEditor.matches(editor)) {
			return true;
		}
	}

	return false;
}
```

--------------------------------------------------------------------------------

````

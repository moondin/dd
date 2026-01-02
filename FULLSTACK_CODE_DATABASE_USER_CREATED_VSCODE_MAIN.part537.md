---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 537
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 537 of 552)

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

---[FILE: src/vs/workbench/services/userDataProfile/browser/userDataProfileImportExportService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/userDataProfileImportExportService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/userDataProfileView.css';
import { localize } from '../../../../nls.js';
import { isMarkdownString } from '../../../../base/common/htmlContent.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Emitter } from '../../../../base/common/event.js';
import { IUserDataProfileImportExportService, PROFILE_FILTER, PROFILE_EXTENSION, IUserDataProfileContentHandler, IUserDataProfileService, IProfileResourceTreeItem, PROFILES_CATEGORY, IUserDataProfileManagementService, ISaveProfileResult, IProfileImportOptions, PROFILE_URL_AUTHORITY, toUserDataProfileUri, IUserDataProfileCreateOptions, isProfileURL, PROFILE_URL_AUTHORITY_PREFIX } from '../common/userDataProfile.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IDialogService, IFileDialogService, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { ITreeItem, ITreeViewDataProvider } from '../../../common/views.js';
import { IUserDataProfile, IUserDataProfileOptions, IUserDataProfilesService, ProfileResourceType, ProfileResourceTypeFlags } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { SettingsResource, SettingsResourceTreeItem } from './settingsResource.js';
import { KeybindingsResource, KeybindingsResourceTreeItem } from './keybindingsResource.js';
import { SnippetsResource, SnippetsResourceTreeItem } from './snippetsResource.js';
import { TasksResource, TasksResourceTreeItem } from './tasksResource.js';
import { ExtensionsResource, ExtensionsResourceExportTreeItem, ExtensionsResourceTreeItem } from './extensionsResource.js';
import { GlobalStateResource, GlobalStateResourceExportTreeItem, GlobalStateResourceTreeItem } from './globalStateResource.js';
import { InMemoryFileSystemProvider } from '../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IQuickInputService, QuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { joinPath } from '../../../../base/common/resources.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { Schemas } from '../../../../base/common/network.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import Severity from '../../../../base/common/severity.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { asText, IRequestService } from '../../../../platform/request/common/request.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Mutable, isUndefined } from '../../../../base/common/types.js';
import { CancelablePromise, createCancelablePromise } from '../../../../base/common/async.js';

interface IUserDataProfileTemplate {
	readonly name: string;
	readonly icon?: string;
	readonly settings?: string;
	readonly keybindings?: string;
	readonly tasks?: string;
	readonly snippets?: string;
	readonly globalState?: string;
	readonly extensions?: string;
}

function isUserDataProfileTemplate(thing: unknown): thing is IUserDataProfileTemplate {
	const candidate = thing as IUserDataProfileTemplate | undefined;

	return !!(candidate && typeof candidate === 'object'
		&& (candidate.name && typeof candidate.name === 'string')
		&& (isUndefined(candidate.icon) || typeof candidate.icon === 'string')
		&& (isUndefined(candidate.settings) || typeof candidate.settings === 'string')
		&& (isUndefined(candidate.globalState) || typeof candidate.globalState === 'string')
		&& (isUndefined(candidate.extensions) || typeof candidate.extensions === 'string'));
}

export class UserDataProfileImportExportService extends Disposable implements IUserDataProfileImportExportService {

	readonly _serviceBrand: undefined;

	private profileContentHandlers = new Map<string, IUserDataProfileContentHandler>();

	private readonly fileUserDataProfileContentHandler: FileUserDataProfileContentHandler;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfileManagementService private readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IProgressService private readonly progressService: IProgressService,
		@IDialogService private readonly dialogService: IDialogService,
		@IClipboardService private readonly clipboardService: IClipboardService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IRequestService private readonly requestService: IRequestService,
		@IProductService private readonly productService: IProductService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();
		this.registerProfileContentHandler(Schemas.file, this.fileUserDataProfileContentHandler = instantiationService.createInstance(FileUserDataProfileContentHandler));
	}

	registerProfileContentHandler(id: string, profileContentHandler: IUserDataProfileContentHandler): IDisposable {
		if (this.profileContentHandlers.has(id)) {
			throw new Error(`Profile content handler with id '${id}' already registered.`);
		}
		this.profileContentHandlers.set(id, profileContentHandler);
		return toDisposable(() => this.unregisterProfileContentHandler(id));
	}

	unregisterProfileContentHandler(id: string): void {
		this.profileContentHandlers.delete(id);
	}

	async createFromProfile(from: IUserDataProfile, options: IUserDataProfileCreateOptions, token: CancellationToken): Promise<IUserDataProfile | undefined> {
		const disposables = new DisposableStore();
		let creationPromise: CancelablePromise<void>;
		disposables.add(token.onCancellationRequested(() => creationPromise.cancel()));
		let profile: IUserDataProfile | undefined;
		return this.progressService.withProgress({
			location: ProgressLocation.Notification,
			delay: 500,
			sticky: true,
			cancellable: true,
		}, async progress => {
			const reportProgress = (message: string) => progress.report({ message: localize('create from profile', "Create Profile: {0}", message) });
			creationPromise = createCancelablePromise(async token => {
				const userDataProfilesExportState = disposables.add(this.instantiationService.createInstance(UserDataProfileExportState, from, { ...options?.resourceTypeFlags, extensions: false }));
				const profileTemplate = await userDataProfilesExportState.getProfileTemplate(options.name ?? from.name, options?.icon);
				profile = await this.getProfileToImport({ ...profileTemplate, name: options.name ?? profileTemplate.name }, !!options.transient, options);
				if (!profile) {
					return;
				}
				if (token.isCancellationRequested) {
					return;
				}
				await this.applyProfileTemplate(profileTemplate, profile, options, reportProgress, token);
			});
			try {
				await creationPromise;
				if (profile && (options?.resourceTypeFlags?.extensions ?? true)) {
					reportProgress(localize('installing extensions', "Installing Extensions..."));
					await this.instantiationService.createInstance(ExtensionsResource).copy(from, profile, false);
				}
			} catch (error) {
				if (profile) {
					await this.userDataProfilesService.removeProfile(profile);
					profile = undefined;
				}
			}
			return profile;

		}, () => creationPromise.cancel()).finally(() => disposables.dispose());
	}

	async createProfileFromTemplate(profileTemplate: IUserDataProfileTemplate, options: IUserDataProfileCreateOptions, token: CancellationToken): Promise<IUserDataProfile | undefined> {
		const disposables = new DisposableStore();
		let creationPromise: CancelablePromise<void>;
		disposables.add(token.onCancellationRequested(() => creationPromise.cancel()));
		let profile: IUserDataProfile | undefined;
		return this.progressService.withProgress({
			location: ProgressLocation.Notification,
			delay: 500,
			sticky: true,
			cancellable: true,
		}, async progress => {
			const reportProgress = (message: string) => progress.report({ message: localize('create from profile', "Create Profile: {0}", message) });
			creationPromise = createCancelablePromise(async token => {
				profile = await this.getProfileToImport({ ...profileTemplate, name: options.name ?? profileTemplate.name }, !!options.transient, options);
				if (!profile) {
					return;
				}
				if (token.isCancellationRequested) {
					return;
				}
				await this.applyProfileTemplate(profileTemplate, profile, options, reportProgress, token);
			});
			try {
				await creationPromise;
			} catch (error) {
				if (profile) {
					await this.userDataProfilesService.removeProfile(profile);
					profile = undefined;
				}
			}
			return profile;
		}, () => creationPromise.cancel()).finally(() => disposables.dispose());
	}

	private async applyProfileTemplate(profileTemplate: IUserDataProfileTemplate, profile: IUserDataProfile, options: IUserDataProfileCreateOptions, reportProgress: (message: string) => void, token: CancellationToken): Promise<void> {
		if (profileTemplate.settings && (options.resourceTypeFlags?.settings ?? true) && !profile.useDefaultFlags?.settings) {
			reportProgress(localize('creating settings', "Creating Settings..."));
			await this.instantiationService.createInstance(SettingsResource).apply(profileTemplate.settings, profile);
		}
		if (token.isCancellationRequested) {
			return;
		}
		if (profileTemplate.keybindings && (options.resourceTypeFlags?.keybindings ?? true) && !profile.useDefaultFlags?.keybindings) {
			reportProgress(localize('create keybindings', "Creating Keyboard Shortcuts..."));
			await this.instantiationService.createInstance(KeybindingsResource).apply(profileTemplate.keybindings, profile);
		}
		if (token.isCancellationRequested) {
			return;
		}
		if (profileTemplate.tasks && (options.resourceTypeFlags?.tasks ?? true) && !profile.useDefaultFlags?.tasks) {
			reportProgress(localize('create tasks', "Creating Tasks..."));
			await this.instantiationService.createInstance(TasksResource).apply(profileTemplate.tasks, profile);
		}
		if (token.isCancellationRequested) {
			return;
		}
		if (profileTemplate.snippets && (options.resourceTypeFlags?.snippets ?? true) && !profile.useDefaultFlags?.snippets) {
			reportProgress(localize('create snippets', "Creating Snippets..."));
			await this.instantiationService.createInstance(SnippetsResource).apply(profileTemplate.snippets, profile);
		}
		if (token.isCancellationRequested) {
			return;
		}
		if (profileTemplate.globalState && !profile.useDefaultFlags?.globalState) {
			reportProgress(localize('applying global state', "Applying UI State..."));
			await this.instantiationService.createInstance(GlobalStateResource).apply(profileTemplate.globalState, profile);
		}
		if (token.isCancellationRequested) {
			return;
		}
		if (profileTemplate.extensions && (options.resourceTypeFlags?.extensions ?? true) && !profile.useDefaultFlags?.extensions) {
			reportProgress(localize('installing extensions', "Installing Extensions..."));
			await this.instantiationService.createInstance(ExtensionsResource).apply(profileTemplate.extensions, profile, reportProgress, token);
		}
	}

	async exportProfile(profile: IUserDataProfile, exportFlags?: ProfileResourceTypeFlags): Promise<void> {
		const disposables = new DisposableStore();
		try {
			const userDataProfilesExportState = disposables.add(this.instantiationService.createInstance(UserDataProfileExportState, profile, exportFlags));
			await this.doExportProfile(userDataProfilesExportState, ProgressLocation.Notification);
		} finally {
			disposables.dispose();
		}
	}

	async createTroubleshootProfile(): Promise<void> {
		const userDataProfilesExportState = this.instantiationService.createInstance(UserDataProfileExportState, this.userDataProfileService.currentProfile, undefined);
		try {
			const profileTemplate = await userDataProfilesExportState.getProfileTemplate(localize('troubleshoot issue', "Troubleshoot Issue"), undefined);
			await this.progressService.withProgress({
				location: ProgressLocation.Notification,
				delay: 1000,
				sticky: true,
			}, async progress => {
				const reportProgress = (message: string) => progress.report({ message: localize('troubleshoot profile progress', "Setting up Troubleshoot Profile: {0}", message) });
				const profile = await this.doCreateProfile(profileTemplate, true, false, { useDefaultFlags: this.userDataProfileService.currentProfile.useDefaultFlags }, reportProgress);
				if (profile) {
					reportProgress(localize('progress extensions', "Applying Extensions..."));
					await this.instantiationService.createInstance(ExtensionsResource).copy(this.userDataProfileService.currentProfile, profile, true);

					reportProgress(localize('switching profile', "Switching Profile..."));
					await this.userDataProfileManagementService.switchProfile(profile);
				}
			});
		} finally {
			userDataProfilesExportState.dispose();
		}
	}

	private async doExportProfile(userDataProfilesExportState: UserDataProfileExportState, location: ProgressLocation | string): Promise<void> {
		const profile = await userDataProfilesExportState.getProfileToExport();
		if (!profile) {
			return;
		}

		const disposables = new DisposableStore();

		try {
			await this.progressService.withProgress({
				location,
				title: localize('profiles.exporting', "{0}: Exporting...", PROFILES_CATEGORY.value),
			}, async progress => {
				const id = await this.pickProfileContentHandler(profile.name);
				if (!id) {
					return;
				}
				const profileContentHandler = this.profileContentHandlers.get(id);
				if (!profileContentHandler) {
					return;
				}
				const saveResult = await profileContentHandler.saveProfile(profile.name.replace('/', '-'), JSON.stringify(profile), CancellationToken.None);
				if (!saveResult) {
					return;
				}
				const message = localize('export success', "Profile '{0}' was exported successfully.", profile.name);
				if (profileContentHandler.extensionId) {
					const buttons: IPromptButton<void>[] = [];
					const link = this.productService.webUrl ? `${this.productService.webUrl}/${PROFILE_URL_AUTHORITY}/${id}/${saveResult.id}` : toUserDataProfileUri(`/${id}/${saveResult.id}`, this.productService).toString();
					buttons.push({
						label: localize({ key: 'copy', comment: ['&& denotes a mnemonic'] }, "&&Copy Link"),
						run: () => this.clipboardService.writeText(link)
					});
					if (this.productService.webUrl) {
						buttons.push({
							label: localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, "&&Open Link"),
							run: async () => {
								await this.openerService.open(link);
							}
						});
					} else {
						buttons.push({
							label: localize({ key: 'open in', comment: ['&& denotes a mnemonic'] }, "&&Open in {0}", profileContentHandler.name),
							run: async () => {
								await this.openerService.open(saveResult.link.toString());
							}
						});
					}
					await this.dialogService.prompt({
						type: Severity.Info,
						message,
						buttons,
						cancelButton: localize('close', "Close")
					});
				} else {
					await this.dialogService.info(message);
				}
			});
		} finally {
			disposables.dispose();
		}
	}

	async resolveProfileTemplate(uri: URI, options?: IProfileImportOptions): Promise<IUserDataProfileTemplate | null> {
		const profileContent = await this.resolveProfileContent(uri);
		if (profileContent === null) {
			return null;
		}

		let profileTemplate: Mutable<IUserDataProfileTemplate>;

		try {
			profileTemplate = JSON.parse(profileContent);
		} catch (error) {
			throw new Error(localize('invalid profile content', "This profile is not valid."));
		}

		if (!isUserDataProfileTemplate(profileTemplate)) {
			throw new Error(localize('invalid profile content', "This profile is not valid."));
		}

		if (options?.name) {
			profileTemplate.name = options.name;
		}

		if (options?.icon) {
			profileTemplate.icon = options.icon;
		}

		if (options?.resourceTypeFlags?.settings === false) {
			profileTemplate.settings = undefined;
		}

		if (options?.resourceTypeFlags?.keybindings === false) {
			profileTemplate.keybindings = undefined;
		}

		if (options?.resourceTypeFlags?.snippets === false) {
			profileTemplate.snippets = undefined;
		}

		if (options?.resourceTypeFlags?.tasks === false) {
			profileTemplate.tasks = undefined;
		}

		if (options?.resourceTypeFlags?.globalState === false) {
			profileTemplate.globalState = undefined;
		}

		if (options?.resourceTypeFlags?.extensions === false) {
			profileTemplate.extensions = undefined;
		}

		return profileTemplate;
	}

	private async doCreateProfile(profileTemplate: IUserDataProfileTemplate, temporaryProfile: boolean, extensions: boolean, options: IUserDataProfileOptions | undefined, progress: (message: string) => void): Promise<IUserDataProfile | undefined> {
		const profile = await this.getProfileToImport(profileTemplate, temporaryProfile, options);
		if (!profile) {
			return undefined;
		}

		if (profileTemplate.settings && !profile.useDefaultFlags?.settings) {
			progress(localize('progress settings', "Applying Settings..."));
			await this.instantiationService.createInstance(SettingsResource).apply(profileTemplate.settings, profile);
		}
		if (profileTemplate.keybindings && !profile.useDefaultFlags?.keybindings) {
			progress(localize('progress keybindings', "Applying Keyboard Shortcuts..."));
			await this.instantiationService.createInstance(KeybindingsResource).apply(profileTemplate.keybindings, profile);
		}
		if (profileTemplate.tasks && !profile.useDefaultFlags?.tasks) {
			progress(localize('progress tasks', "Applying Tasks..."));
			await this.instantiationService.createInstance(TasksResource).apply(profileTemplate.tasks, profile);
		}
		if (profileTemplate.snippets && !profile.useDefaultFlags?.snippets) {
			progress(localize('progress snippets', "Applying Snippets..."));
			await this.instantiationService.createInstance(SnippetsResource).apply(profileTemplate.snippets, profile);
		}
		if (profileTemplate.globalState && !profile.useDefaultFlags?.globalState) {
			progress(localize('progress global state', "Applying State..."));
			await this.instantiationService.createInstance(GlobalStateResource).apply(profileTemplate.globalState, profile);
		}
		if (profileTemplate.extensions && extensions && !profile.useDefaultFlags?.extensions) {
			progress(localize('progress extensions', "Applying Extensions..."));
			await this.instantiationService.createInstance(ExtensionsResource).apply(profileTemplate.extensions, profile);
		}

		return profile;
	}

	private async resolveProfileContent(resource: URI): Promise<string | null> {
		if (await this.fileUserDataProfileContentHandler.canHandle(resource)) {
			return this.fileUserDataProfileContentHandler.readProfile(resource, CancellationToken.None);
		}

		if (isProfileURL(resource)) {
			let handlerId: string, idOrUri: string | URI;
			if (resource.authority === PROFILE_URL_AUTHORITY) {
				idOrUri = this.uriIdentityService.extUri.basename(resource);
				handlerId = this.uriIdentityService.extUri.basename(this.uriIdentityService.extUri.dirname(resource));
			} else {
				handlerId = resource.authority.substring(PROFILE_URL_AUTHORITY_PREFIX.length);
				idOrUri = URI.parse(resource.path.substring(1));
			}
			await this.extensionService.activateByEvent(`onProfile:${handlerId}`);
			const profileContentHandler = this.profileContentHandlers.get(handlerId);
			if (profileContentHandler) {
				return profileContentHandler.readProfile(idOrUri, CancellationToken.None);
			}
		}

		await this.extensionService.activateByEvent('onProfile');
		for (const profileContentHandler of this.profileContentHandlers.values()) {
			const content = await profileContentHandler.readProfile(resource, CancellationToken.None);
			if (content !== null) {
				return content;
			}
		}

		const context = await this.requestService.request({ type: 'GET', url: resource.toString(true) }, CancellationToken.None);
		if (context.res.statusCode === 200) {
			return await asText(context);
		} else {
			const message = await asText(context);
			throw new Error(`Failed to get profile from URL: ${resource.toString()}. Status code: ${context.res.statusCode}. Message: ${message}`);
		}
	}

	private async pickProfileContentHandler(name: string): Promise<string | undefined> {
		await this.extensionService.activateByEvent('onProfile');
		if (this.profileContentHandlers.size === 1) {
			return this.profileContentHandlers.keys().next().value;
		}
		const options: QuickPickItem[] = [];
		for (const [id, profileContentHandler] of this.profileContentHandlers) {
			options.push({ id, label: profileContentHandler.name, description: profileContentHandler.description });
		}
		const result = await this.quickInputService.pick(options.reverse(),
			{
				title: localize('select profile content handler', "Export '{0}' profile as...", name),
				hideInput: true
			});
		return result?.id;
	}

	private async getProfileToImport(profileTemplate: IUserDataProfileTemplate, temp: boolean, options: IUserDataProfileOptions | undefined): Promise<IUserDataProfile | undefined> {
		const profileName = profileTemplate.name;
		const profile = this.userDataProfilesService.profiles.find(p => p.name === profileName);
		if (profile) {
			if (temp) {
				return this.userDataProfilesService.createNamedProfile(`${profileName} ${this.getProfileNameIndex(profileName)}`, { ...options, transient: temp });
			}
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Info,
				message: localize('profile already exists', "Profile with name '{0}' already exists. Do you want to replace its contents?", profileName),
				primaryButton: localize({ key: 'overwrite', comment: ['&& denotes a mnemonic'] }, "&&Replace")
			});
			if (!confirmed) {
				return undefined;
			}
			return profile.isDefault ? profile : this.userDataProfilesService.updateProfile(profile, options);
		} else {
			return this.userDataProfilesService.createNamedProfile(profileName, { ...options, transient: temp });
		}
	}

	private getProfileNameIndex(name: string): number {
		const nameRegEx = new RegExp(`${escapeRegExpCharacters(name)}\\s(\\d+)`);
		let nameIndex = 0;
		for (const profile of this.userDataProfilesService.profiles) {
			const matches = nameRegEx.exec(profile.name);
			const index = matches ? parseInt(matches[1]) : 0;
			nameIndex = index > nameIndex ? index : nameIndex;
		}
		return nameIndex + 1;
	}

}

class FileUserDataProfileContentHandler implements IUserDataProfileContentHandler {

	readonly name = localize('local', "Local");
	readonly description = localize('file', "file");

	constructor(
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileService private readonly fileService: IFileService,
		@IProductService private readonly productService: IProductService,
		@ITextFileService private readonly textFileService: ITextFileService,
	) { }

	async saveProfile(name: string, content: string, token: CancellationToken): Promise<ISaveProfileResult | null> {
		const link = await this.fileDialogService.showSaveDialog({
			title: localize('export profile dialog', "Save Profile"),
			filters: PROFILE_FILTER,
			defaultUri: this.uriIdentityService.extUri.joinPath(await this.fileDialogService.defaultFilePath(), `${name}.${PROFILE_EXTENSION}`),
		});
		if (!link) {
			return null;
		}
		await this.textFileService.create([{ resource: link, value: content, options: { overwrite: true } }]);
		return { link, id: link.toString() };
	}

	async canHandle(uri: URI): Promise<boolean> {
		return uri.scheme !== Schemas.http && uri.scheme !== Schemas.https && uri.scheme !== this.productService.urlProtocol && await this.fileService.canHandleResource(uri);
	}

	async readProfile(uri: URI, token: CancellationToken): Promise<string | null> {
		if (await this.canHandle(uri)) {
			return (await this.fileService.readFile(uri, undefined, token)).value.toString();
		}
		return null;
	}

	async selectProfile(): Promise<URI | null> {
		const profileLocation = await this.fileDialogService.showOpenDialog({
			canSelectFolders: false,
			canSelectFiles: true,
			canSelectMany: false,
			filters: PROFILE_FILTER,
			title: localize('select profile', "Select Profile"),
		});
		return profileLocation ? profileLocation[0] : null;
	}

}

const USER_DATA_PROFILE_EXPORT_SCHEME = 'userdataprofileexport';
const USER_DATA_PROFILE_EXPORT_PREVIEW_SCHEME = 'userdataprofileexportpreview';

abstract class UserDataProfileImportExportState extends Disposable implements ITreeViewDataProvider {

	private readonly _onDidChangeRoots = this._register(new Emitter<void>());
	readonly onDidChangeRoots = this._onDidChangeRoots.event;

	constructor(
		@IQuickInputService protected readonly quickInputService: IQuickInputService,
	) {
		super();
	}

	async getChildren(element?: ITreeItem): Promise<ITreeItem[] | undefined> {
		if (element) {
			const children = await (<IProfileResourceTreeItem>element).getChildren();
			if (children) {
				for (const child of children) {
					if (child.parent.checkbox && child.checkbox) {
						child.checkbox.isChecked = child.parent.checkbox.isChecked && child.checkbox.isChecked;
					}
				}
			}
			return children;
		} else {
			this.rootsPromise = undefined;
			this._onDidChangeRoots.fire();
			return this.getRoots();
		}
	}

	private roots: IProfileResourceTreeItem[] = [];
	private rootsPromise: Promise<IProfileResourceTreeItem[]> | undefined;
	getRoots(): Promise<IProfileResourceTreeItem[]> {
		if (!this.rootsPromise) {
			this.rootsPromise = (async () => {
				this.roots = await this.fetchRoots();
				for (const root of this.roots) {
					const labelText = isMarkdownString(root.label.label) ? root.label.label.value : root.label.label;
					root.checkbox = {
						isChecked: !root.isFromDefaultProfile(),
						tooltip: localize('select', "Select {0}", labelText),
						accessibilityInformation: {
							label: localize('select', "Select {0}", labelText),
						}
					};
					if (root.isFromDefaultProfile()) {
						root.description = localize('from default', "From Default Profile");
					}
				}
				return this.roots;
			})();
		}
		return this.rootsPromise;
	}

	isEnabled(resourceType?: ProfileResourceType): boolean {
		if (resourceType !== undefined) {
			return this.roots.some(root => root.type === resourceType && this.isSelected(root));
		}
		return this.roots.some(root => this.isSelected(root));
	}

	async getProfileTemplate(name: string, icon: string | undefined): Promise<IUserDataProfileTemplate> {
		const roots = await this.getRoots();
		let settings: string | undefined;
		let keybindings: string | undefined;
		let tasks: string | undefined;
		let snippets: string | undefined;
		let extensions: string | undefined;
		let globalState: string | undefined;
		for (const root of roots) {
			if (!this.isSelected(root)) {
				continue;
			}
			if (root instanceof SettingsResourceTreeItem) {
				settings = await root.getContent();
			} else if (root instanceof KeybindingsResourceTreeItem) {
				keybindings = await root.getContent();
			} else if (root instanceof TasksResourceTreeItem) {
				tasks = await root.getContent();
			} else if (root instanceof SnippetsResourceTreeItem) {
				snippets = await root.getContent();
			} else if (root instanceof ExtensionsResourceTreeItem) {
				extensions = await root.getContent();
			} else if (root instanceof GlobalStateResourceTreeItem) {
				globalState = await root.getContent();
			}
		}

		return {
			name,
			icon,
			settings,
			keybindings,
			tasks,
			snippets,
			extensions,
			globalState
		};
	}

	private isSelected(treeItem: IProfileResourceTreeItem): boolean {
		if (treeItem.checkbox) {
			return treeItem.checkbox.isChecked || !!treeItem.children?.some(child => child.checkbox?.isChecked);
		}
		return true;
	}

	protected abstract fetchRoots(): Promise<IProfileResourceTreeItem[]>;
}

class UserDataProfileExportState extends UserDataProfileImportExportState {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		readonly profile: IUserDataProfile,
		private readonly exportFlags: ProfileResourceTypeFlags | undefined,
		@IQuickInputService quickInputService: IQuickInputService,
		@IFileService private readonly fileService: IFileService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(quickInputService);
	}

	protected async fetchRoots(): Promise<IProfileResourceTreeItem[]> {
		this.disposables.clear();
		this.disposables.add(this.fileService.registerProvider(USER_DATA_PROFILE_EXPORT_SCHEME, this._register(new InMemoryFileSystemProvider())));
		const previewFileSystemProvider = this._register(new InMemoryFileSystemProvider());
		this.disposables.add(this.fileService.registerProvider(USER_DATA_PROFILE_EXPORT_PREVIEW_SCHEME, previewFileSystemProvider));
		const roots: IProfileResourceTreeItem[] = [];
		const exportPreviewProfle = this.createExportPreviewProfile(this.profile);

		if (this.exportFlags?.settings ?? true) {
			const settingsResource = this.instantiationService.createInstance(SettingsResource);
			const settingsContent = await settingsResource.getContent(this.profile);
			await settingsResource.apply(settingsContent, exportPreviewProfle);
			const settingsResourceTreeItem = this.instantiationService.createInstance(SettingsResourceTreeItem, exportPreviewProfle);
			if (await settingsResourceTreeItem.hasContent()) {
				roots.push(settingsResourceTreeItem);
			}
		}

		if (this.exportFlags?.keybindings ?? true) {
			const keybindingsResource = this.instantiationService.createInstance(KeybindingsResource);
			const keybindingsContent = await keybindingsResource.getContent(this.profile);
			await keybindingsResource.apply(keybindingsContent, exportPreviewProfle);
			const keybindingsResourceTreeItem = this.instantiationService.createInstance(KeybindingsResourceTreeItem, exportPreviewProfle);
			if (await keybindingsResourceTreeItem.hasContent()) {
				roots.push(keybindingsResourceTreeItem);
			}
		}

		if (this.exportFlags?.snippets ?? true) {
			const snippetsResource = this.instantiationService.createInstance(SnippetsResource);
			const snippetsContent = await snippetsResource.getContent(this.profile);
			await snippetsResource.apply(snippetsContent, exportPreviewProfle);
			const snippetsResourceTreeItem = this.instantiationService.createInstance(SnippetsResourceTreeItem, exportPreviewProfle);
			if (await snippetsResourceTreeItem.hasContent()) {
				roots.push(snippetsResourceTreeItem);
			}
		}

		if (this.exportFlags?.tasks ?? true) {
			const tasksResource = this.instantiationService.createInstance(TasksResource);
			const tasksContent = await tasksResource.getContent(this.profile);
			await tasksResource.apply(tasksContent, exportPreviewProfle);
			const tasksResourceTreeItem = this.instantiationService.createInstance(TasksResourceTreeItem, exportPreviewProfle);
			if (await tasksResourceTreeItem.hasContent()) {
				roots.push(tasksResourceTreeItem);
			}
		}

		if (this.exportFlags?.globalState ?? true) {
			const globalStateResource = joinPath(exportPreviewProfle.globalStorageHome, 'globalState.json').with({ scheme: USER_DATA_PROFILE_EXPORT_PREVIEW_SCHEME });
			const globalStateResourceTreeItem = this.instantiationService.createInstance(GlobalStateResourceExportTreeItem, exportPreviewProfle, globalStateResource);
			const content = await globalStateResourceTreeItem.getContent();
			if (content) {
				await this.fileService.writeFile(globalStateResource, VSBuffer.fromString(JSON.stringify(JSON.parse(content), null, '\t')));
				roots.push(globalStateResourceTreeItem);
			}
		}

		if (this.exportFlags?.extensions ?? true) {
			const extensionsResourceTreeItem = this.instantiationService.createInstance(ExtensionsResourceExportTreeItem, exportPreviewProfle);
			if (await extensionsResourceTreeItem.hasContent()) {
				roots.push(extensionsResourceTreeItem);
			}
		}

		previewFileSystemProvider.setReadOnly(true);

		return roots;
	}

	private createExportPreviewProfile(profile: IUserDataProfile): IUserDataProfile {
		return {
			id: profile.id,
			name: profile.name,
			location: profile.location,
			isDefault: profile.isDefault,
			icon: profile.icon,
			globalStorageHome: profile.globalStorageHome,
			settingsResource: profile.settingsResource.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			keybindingsResource: profile.keybindingsResource.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			tasksResource: profile.tasksResource.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			mcpResource: profile.mcpResource.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			snippetsHome: profile.snippetsHome.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			promptsHome: profile.promptsHome.with({ scheme: USER_DATA_PROFILE_EXPORT_SCHEME }),
			extensionsResource: profile.extensionsResource,
			cacheHome: profile.cacheHome,
			useDefaultFlags: profile.useDefaultFlags,
			isTransient: profile.isTransient
		};
	}

	async getProfileToExport(): Promise<IUserDataProfileTemplate | null> {
		let name: string | undefined = this.profile.name;
		if (this.profile.isDefault) {
			name = await this.quickInputService.input({
				placeHolder: localize('export profile name', "Name the profile"),
				title: localize('export profile title', "Export Profile"),
				async validateInput(input) {
					if (!input.trim()) {
						return localize('profile name required', "Profile name must be provided.");
					}
					return undefined;
				},
			});
			if (!name) {
				return null;
			}
		}

		return super.getProfileTemplate(name, this.profile.icon);
	}

}

registerSingleton(IUserDataProfileImportExportService, UserDataProfileImportExportService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/userDataProfileInit.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/userDataProfileInit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Barrier, Promises } from '../../../../base/common/async.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataInitializer } from '../../userData/browser/userDataInit.js';
import { IProfileResourceInitializer, IUserDataProfileService, IUserDataProfileTemplate } from '../common/userDataProfile.js';
import { SettingsResourceInitializer } from './settingsResource.js';
import { GlobalStateResourceInitializer } from './globalStateResource.js';
import { KeybindingsResourceInitializer } from './keybindingsResource.js';
import { TasksResourceInitializer } from './tasksResource.js';
import { SnippetsResourceInitializer } from './snippetsResource.js';
import { McpResourceInitializer } from './mcpProfileResource.js';
import { ExtensionsResourceInitializer } from './extensionsResource.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { isString } from '../../../../base/common/types.js';
import { IRequestService, asJson } from '../../../../platform/request/common/request.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';

export class UserDataProfileInitializer implements IUserDataInitializer {

	_serviceBrand: undefined;

	private readonly initialized: ProfileResourceType[] = [];
	private readonly initializationFinished = new Barrier();

	constructor(
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IRequestService private readonly requestService: IRequestService,
	) {
	}

	async whenInitializationFinished(): Promise<void> {
		await this.initializationFinished.wait();
	}

	async requiresInitialization(): Promise<boolean> {
		if (!this.environmentService.options?.profile?.contents) {
			return false;
		}
		if (!this.storageService.isNew(StorageScope.PROFILE)) {
			return false;
		}
		return true;
	}

	async initializeRequiredResources(): Promise<void> {
		this.logService.trace(`UserDataProfileInitializer#initializeRequiredResources`);
		const promises = [];
		const profileTemplate = await this.getProfileTemplate();
		if (profileTemplate?.settings) {
			promises.push(this.initialize(new SettingsResourceInitializer(this.userDataProfileService, this.fileService, this.logService), profileTemplate.settings, ProfileResourceType.Settings));
		}
		if (profileTemplate?.globalState) {
			promises.push(this.initialize(new GlobalStateResourceInitializer(this.storageService), profileTemplate.globalState, ProfileResourceType.GlobalState));
		}
		await Promise.all(promises);
	}

	async initializeOtherResources(instantiationService: IInstantiationService): Promise<void> {
		try {
			this.logService.trace(`UserDataProfileInitializer#initializeOtherResources`);
			const promises = [];
			const profileTemplate = await this.getProfileTemplate();
			if (profileTemplate?.keybindings) {
				promises.push(this.initialize(new KeybindingsResourceInitializer(this.userDataProfileService, this.fileService, this.logService), profileTemplate.keybindings, ProfileResourceType.Keybindings));
			}
			if (profileTemplate?.tasks) {
				promises.push(this.initialize(new TasksResourceInitializer(this.userDataProfileService, this.fileService, this.logService), profileTemplate.tasks, ProfileResourceType.Tasks));
			}
			if (profileTemplate?.mcp) {
				promises.push(this.initialize(new McpResourceInitializer(this.userDataProfileService, this.fileService, this.logService), profileTemplate.mcp, ProfileResourceType.Mcp));
			}
			if (profileTemplate?.snippets) {
				promises.push(this.initialize(new SnippetsResourceInitializer(this.userDataProfileService, this.fileService, this.uriIdentityService), profileTemplate.snippets, ProfileResourceType.Snippets));
			}
			promises.push(this.initializeInstalledExtensions(instantiationService));
			await Promises.settled(promises);
		} finally {
			this.initializationFinished.open();
		}
	}

	private initializeInstalledExtensionsPromise: Promise<void> | undefined;
	async initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void> {
		if (!this.initializeInstalledExtensionsPromise) {
			const profileTemplate = await this.getProfileTemplate();
			if (profileTemplate?.extensions) {
				this.initializeInstalledExtensionsPromise = this.initialize(instantiationService.createInstance(ExtensionsResourceInitializer), profileTemplate.extensions, ProfileResourceType.Extensions);
			} else {
				this.initializeInstalledExtensionsPromise = Promise.resolve();
			}

		}
		return this.initializeInstalledExtensionsPromise;
	}

	private profileTemplatePromise: Promise<IUserDataProfileTemplate | null> | undefined;
	private getProfileTemplate(): Promise<IUserDataProfileTemplate | null> {
		if (!this.profileTemplatePromise) {
			this.profileTemplatePromise = this.doGetProfileTemplate();
		}
		return this.profileTemplatePromise;
	}

	private async doGetProfileTemplate(): Promise<IUserDataProfileTemplate | null> {
		if (!this.environmentService.options?.profile?.contents) {
			return null;
		}
		if (isString(this.environmentService.options.profile.contents)) {
			try {
				return JSON.parse(this.environmentService.options.profile.contents);
			} catch (error) {
				this.logService.error(error);
				return null;
			}
		}
		try {
			const url = URI.revive(this.environmentService.options.profile.contents).toString(true);
			const context = await this.requestService.request({ type: 'GET', url }, CancellationToken.None);
			if (context.res.statusCode === 200) {
				return await asJson(context);
			} else {
				this.logService.warn(`UserDataProfileInitializer: Failed to get profile from URL: ${url}. Status code: ${context.res.statusCode}.`);
			}
		} catch (error) {
			this.logService.error(error);
		}
		return null;
	}

	private async initialize(initializer: IProfileResourceInitializer, content: string, profileResource: ProfileResourceType): Promise<void> {
		try {
			if (this.initialized.includes(profileResource)) {
				this.logService.info(`UserDataProfileInitializer: ${profileResource} initialized already.`);
				return;
			}
			this.initialized.push(profileResource);
			this.logService.trace(`UserDataProfileInitializer: Initializing ${profileResource}`);
			await initializer.initialize(content);
			this.logService.info(`UserDataProfileInitializer: Initialized ${profileResource}`);
		} catch (error) {
			this.logService.info(`UserDataProfileInitializer: Error while initializing ${profileResource}`);
			this.logService.error(error);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/userDataProfileManagement.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/userDataProfileManagement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { equals } from '../../../../base/common/objects.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IRequestService, asJson } from '../../../../platform/request/common/request.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfileOptions, IUserDataProfilesService, IUserDataProfileUpdateOptions } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { isEmptyWorkspaceIdentifier, IWorkspaceContextService, toWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { CONFIG_NEW_WINDOW_PROFILE } from '../../../common/configuration.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IHostService } from '../../host/browser/host.js';
import { DidChangeUserDataProfileEvent, IProfileTemplateInfo, IUserDataProfileManagementService, IUserDataProfileService } from '../common/userDataProfile.js';

export class UserDataProfileManagementService extends Disposable implements IUserDataProfileManagementService {
	readonly _serviceBrand: undefined;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IHostService private readonly hostService: IHostService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IProductService private readonly productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this._register(userDataProfileService.onDidChangeCurrentProfile(e => this.onDidChangeCurrentProfile(e)));
		this._register(userDataProfilesService.onDidChangeProfiles(e => {
			if (e.removed.some(profile => profile.id === this.userDataProfileService.currentProfile.id)) {
				const profileToUse = this.getProfileToUseForCurrentWorkspace();
				this.switchProfile(profileToUse);
				this.changeCurrentProfile(profileToUse, localize('reload message when removed', "The current profile has been removed. Please reload to switch back to default profile"));
				return;
			}

			const updatedCurrentProfile = e.updated.find(p => this.userDataProfileService.currentProfile.id === p.id);
			if (updatedCurrentProfile) {
				const profileToUse = this.getProfileToUseForCurrentWorkspace();
				if (profileToUse?.id !== updatedCurrentProfile.id) {
					this.switchProfile(profileToUse);
					this.changeCurrentProfile(profileToUse, localize('reload message when switched', "The current workspace has been removed from the current profile. Please reload to switch back to the updated profile"));
				} else {
					this.changeCurrentProfile(updatedCurrentProfile, localize('reload message when updated', "The current profile has been updated. Please reload to switch back to the updated profile"));
				}
			}
		}));
	}

	private async onDidChangeCurrentProfile(e: DidChangeUserDataProfileEvent): Promise<void> {
		if (e.previous.isTransient) {
			await this.userDataProfilesService.cleanUpTransientProfiles();
		}
	}

	private getWorkspaceUri(): URI | undefined {
		const workspace = this.workspaceContextService.getWorkspace();
		return workspace.configuration ?? workspace.folders[0]?.uri;
	}

	private getProfileToUseForCurrentWorkspace(): IUserDataProfile {
		const workspaceUri = this.getWorkspaceUri();
		if (workspaceUri) {
			const profileForWorkspace = this.userDataProfilesService.profiles.find(profile => profile.workspaces?.some(ws => this.uriIdentityService.extUri.isEqual(ws, workspaceUri)));
			if (profileForWorkspace) {
				return profileForWorkspace;
			}
		} else {
			// If no workspace is open, use the current profile
			const currentProfile = this.userDataProfilesService.profiles.find(profile => profile.id === this.userDataProfileService.currentProfile.id);
			if (currentProfile) {
				return currentProfile;
			}
		}
		return this.getDefaultProfileToUse();
	}

	public getDefaultProfileToUse(): IUserDataProfile {
		const newWindowProfileConfigValue = this.configurationService.getValue(CONFIG_NEW_WINDOW_PROFILE);
		if (newWindowProfileConfigValue) {
			const newWindowProfile = this.userDataProfilesService.profiles.find(profile => profile.name === newWindowProfileConfigValue);
			if (newWindowProfile) {
				return newWindowProfile;
			}
		}
		return this.userDataProfilesService.defaultProfile;
	}

	async createProfile(name: string, options?: IUserDataProfileOptions): Promise<IUserDataProfile> {
		return this.userDataProfilesService.createNamedProfile(name, options);
	}

	async createAndEnterProfile(name: string, options?: IUserDataProfileOptions): Promise<IUserDataProfile> {
		const profile = await this.userDataProfilesService.createNamedProfile(name, options, toWorkspaceIdentifier(this.workspaceContextService.getWorkspace()));
		await this.changeCurrentProfile(profile);
		return profile;
	}

	async createAndEnterTransientProfile(): Promise<IUserDataProfile> {
		const profile = await this.userDataProfilesService.createTransientProfile(toWorkspaceIdentifier(this.workspaceContextService.getWorkspace()));
		await this.changeCurrentProfile(profile);
		return profile;
	}

	async updateProfile(profile: IUserDataProfile, updateOptions: IUserDataProfileUpdateOptions): Promise<IUserDataProfile> {
		if (!this.userDataProfilesService.profiles.some(p => p.id === profile.id)) {
			throw new Error(`Profile ${profile.name} does not exist`);
		}
		if (profile.isDefault) {
			throw new Error(localize('cannotRenameDefaultProfile', "Cannot rename the default profile"));
		}
		const updatedProfile = await this.userDataProfilesService.updateProfile(profile, updateOptions);
		return updatedProfile;
	}

	async removeProfile(profile: IUserDataProfile): Promise<void> {
		if (!this.userDataProfilesService.profiles.some(p => p.id === profile.id)) {
			throw new Error(`Profile ${profile.name} does not exist`);
		}
		if (profile.isDefault) {
			throw new Error(localize('cannotDeleteDefaultProfile', "Cannot delete the default profile"));
		}
		await this.userDataProfilesService.removeProfile(profile);
	}

	async switchProfile(profile: IUserDataProfile): Promise<void> {
		if (!this.userDataProfilesService.profiles.some(p => p.id === profile.id)) {
			throw new Error(`Profile ${profile.name} does not exist`);
		}
		if (this.userDataProfileService.currentProfile.id === profile.id) {
			return;
		}
		const workspaceUri = this.getWorkspaceUri();
		if (workspaceUri && profile.workspaces?.some(ws => this.uriIdentityService.extUri.isEqual(ws, workspaceUri))) {
			return;
		}
		const workspaceIdentifier = toWorkspaceIdentifier(this.workspaceContextService.getWorkspace());
		await this.userDataProfilesService.setProfileForWorkspace(workspaceIdentifier, profile);
		if (isEmptyWorkspaceIdentifier(workspaceIdentifier)) {
			await this.changeCurrentProfile(profile);
		}
	}

	async getBuiltinProfileTemplates(): Promise<IProfileTemplateInfo[]> {
		if (this.productService.profileTemplatesUrl) {
			try {
				const context = await this.requestService.request({ type: 'GET', url: this.productService.profileTemplatesUrl }, CancellationToken.None);
				if (context.res.statusCode === 200) {
					return (await asJson<IProfileTemplateInfo[]>(context)) || [];
				} else {
					this.logService.error('Could not get profile templates.', context.res.statusCode);
				}
			} catch (error) {
				this.logService.error(error);
			}
		}
		return [];
	}

	private async changeCurrentProfile(profile: IUserDataProfile, reloadMessage?: string): Promise<void> {
		const isRemoteWindow = !!this.environmentService.remoteAuthority;

		const shouldRestartExtensionHosts = this.userDataProfileService.currentProfile.id !== profile.id || !equals(this.userDataProfileService.currentProfile.useDefaultFlags, profile.useDefaultFlags);

		if (shouldRestartExtensionHosts) {
			if (!isRemoteWindow) {
				if (!(await this.extensionService.stopExtensionHosts(localize('switch profile', "Switching to a profile")))) {
					// If extension host did not stop, do not switch profile
					if (this.userDataProfilesService.profiles.some(p => p.id === this.userDataProfileService.currentProfile.id)) {
						await this.userDataProfilesService.setProfileForWorkspace(toWorkspaceIdentifier(this.workspaceContextService.getWorkspace()), this.userDataProfileService.currentProfile);
					}
					throw new CancellationError();
				}
			}
		}

		// In a remote window update current profile before reloading so that data is preserved from current profile if asked to preserve
		await this.userDataProfileService.updateCurrentProfile(profile);

		if (shouldRestartExtensionHosts) {
			if (isRemoteWindow) {
				const { confirmed } = await this.dialogService.confirm({
					message: reloadMessage ?? localize('reload message', "Switching a profile requires reloading VS Code."),
					primaryButton: localize('reload button', "&&Reload"),
				});
				if (confirmed) {
					await this.hostService.reload();
				}
			} else {
				await this.extensionService.startExtensionHosts();
			}
		}
	}
}

registerSingleton(IUserDataProfileManagementService, UserDataProfileManagementService, InstantiationType.Eager /* Eager because it updates the current window profile by listening to profiles changes */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/userDataProfileStorageService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/userDataProfileStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IStorageDatabase } from '../../../../base/parts/storage/common/storage.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractUserDataProfileStorageService, IProfileStorageChanges, IUserDataProfileStorageService } from '../../../../platform/userDataProfile/common/userDataProfileStorageService.js';
import { IProfileStorageValueChangeEvent, isProfileUsingDefaultStorage, IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IndexedDBStorageDatabase } from '../../storage/browser/storageService.js';
import { IUserDataProfileService } from '../common/userDataProfile.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export class UserDataProfileStorageService extends AbstractUserDataProfileStorageService implements IUserDataProfileStorageService {

	private readonly _onDidChange = this._register(new Emitter<IProfileStorageChanges>());
	readonly onDidChange: Event<IProfileStorageChanges> = this._onDidChange.event;

	constructor(
		@IStorageService storageService: IStorageService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@ILogService private readonly logService: ILogService,
	) {
		super(true, storageService);
		const disposables = this._register(new DisposableStore());
		this._register(Event.filter(storageService.onDidChangeTarget, e => e.scope === StorageScope.PROFILE, disposables)(() => this.onDidChangeStorageTargetInCurrentProfile()));
		this._register(storageService.onDidChangeValue(StorageScope.PROFILE, undefined, disposables)(e => this.onDidChangeStorageValueInCurrentProfile(e)));
	}

	private onDidChangeStorageTargetInCurrentProfile(): void {
		// Not broadcasting changes to other windows/tabs as it is not required in web.
		// Revisit if needed in future.
		this._onDidChange.fire({ targetChanges: [this.userDataProfileService.currentProfile], valueChanges: [] });
	}

	private onDidChangeStorageValueInCurrentProfile(e: IProfileStorageValueChangeEvent): void {
		// Not broadcasting changes to other windows/tabs as it is not required in web
		// Revisit if needed in future.
		this._onDidChange.fire({ targetChanges: [], valueChanges: [{ profile: this.userDataProfileService.currentProfile, changes: [e] }] });
	}

	protected createStorageDatabase(profile: IUserDataProfile): Promise<IStorageDatabase> {
		return isProfileUsingDefaultStorage(profile) ? IndexedDBStorageDatabase.createApplicationStorage(this.logService) : IndexedDBStorageDatabase.createProfileStorage(profile, this.logService);
	}
}

registerSingleton(IUserDataProfileStorageService, UserDataProfileStorageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/media/userDataProfileView.css]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/media/userDataProfileView.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.profile-view-tree-container .customview-tree .monaco-list .monaco-list-row .custom-view-tree-node-item .actions {
	display: inherit;
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container {
	display: flex;
	padding: 13px 20px 0px 20px;
	box-sizing: border-box;
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container p {
	margin-block-start: 0em;
	margin-block-end: 0em;
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container a {
	color: var(--vscode-textLink-foreground)
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container a:hover {
	text-decoration: underline;
	color: var(--vscode-textLink-activeForeground)
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container a:active {
	color: var(--vscode-textLink-activeForeground)
}

.monaco-workbench .pane > .pane-body > .profile-view-message-container.hide {
	display: none;
}

.monaco-workbench .pane > .pane-body > .profile-view-buttons-container {
	display: flex;
	flex-direction: column;
	padding: 13px 20px;
	box-sizing: border-box;
}

.monaco-workbench .pane > .pane-body > .profile-view-buttons-container > .monaco-button,
.monaco-workbench .pane > .pane-body > .profile-view-buttons-container > .monaco-button-dropdown {
	margin-block-start: 13px;
	margin-inline-start: 0px;
	margin-inline-end: 0px;
	max-width: 260px;
	margin-left: auto;
	margin-right: auto;
}

.monaco-workbench .pane > .pane-body > .profile-view-buttons-container > .monaco-button-dropdown {
	width: 100%;
}

.monaco-workbench .pane > .pane-body > .profile-view-buttons-container > .monaco-button-dropdown > .monaco-dropdown-button {
	display: flex;
	align-items: center;
	padding: 0 4px;
}

.profile-edit-widget {
	padding: 4px 6px 0px 11px;
}

.profile-edit-widget > .profile-icon-container {
	display: flex;
	margin-bottom: 8px;
}

.profile-edit-widget > .profile-icon-container > .profile-icon {
	cursor: pointer;
	padding: 3px;
	border-radius: 5px;
}

.profile-edit-widget > .profile-icon-container > .profile-icon.codicon{
	font-size: 18px;
}

.profile-edit-widget > .profile-icon-container > .profile-icon:hover {
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
	outline-offset: -1px;
	background-color: var(--vscode-toolbar-hoverBackground);
}

.profile-edit-widget > .profile-type-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
}

.profile-edit-widget > .profile-icon-container > .profile-icon-label,
.profile-edit-widget > .profile-type-container > .profile-type-create-label {
	width: 90px;
	display: inline-flex;
	align-items: center;
}

.profile-edit-widget > .profile-icon-container:only-child > .profile-icon-label {
	width: 45px;
}

.profile-edit-widget > .profile-icon-container > .profile-icon-id {
	display: inline-flex;
	align-items: center;
	margin-left: 5px;
	opacity: .8;
	font-size: 0.9em;
}

.profile-edit-widget > .profile-type-container > .profile-type-select-container {
	overflow: hidden;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.profile-edit-widget > .profile-type-container > .profile-type-select-container > .monaco-select-box {
	cursor: pointer;
	line-height: 17px;
	padding: 2px 23px 2px 8px;
	border-radius: 2px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/common/remoteUserDataProfiles.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/common/remoteUserDataProfiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { DidChangeProfilesEvent, IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUserDataProfileService } from './userDataProfile.js';
import { distinct } from '../../../../base/common/arrays.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { UserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfileIpc.js';
import { ErrorNoTelemetry } from '../../../../base/common/errors.js';

const associatedRemoteProfilesKey = 'associatedRemoteProfiles';

export const IRemoteUserDataProfilesService = createDecorator<IRemoteUserDataProfilesService>('IRemoteUserDataProfilesService');
export interface IRemoteUserDataProfilesService {
	readonly _serviceBrand: undefined;
	getRemoteProfiles(): Promise<readonly IUserDataProfile[]>;
	getRemoteProfile(localProfile: IUserDataProfile): Promise<IUserDataProfile>;
}

class RemoteUserDataProfilesService extends Disposable implements IRemoteUserDataProfilesService {

	readonly _serviceBrand: undefined;

	private readonly initPromise: Promise<void>;

	private remoteUserDataProfilesService: IUserDataProfilesService | undefined;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.initPromise = this.init();
	}

	private async init(): Promise<void> {
		const connection = this.remoteAgentService.getConnection();
		if (!connection) {
			return;
		}

		const environment = await this.remoteAgentService.getEnvironment();
		if (!environment) {
			return;
		}

		this.remoteUserDataProfilesService = new UserDataProfilesService(environment.profiles.all, environment.profiles.home, connection.getChannel('userDataProfiles'));
		this._register(this.userDataProfilesService.onDidChangeProfiles(e => this.onDidChangeLocalProfiles(e)));

		// Associate current local profile with remote profile
		const remoteProfile = await this.getAssociatedRemoteProfile(this.userDataProfileService.currentProfile, this.remoteUserDataProfilesService);
		if (!remoteProfile.isDefault) {
			this.setAssociatedRemoteProfiles([...this.getAssociatedRemoteProfiles(), remoteProfile.id]);
		}

		this.cleanUp();
	}

	private async onDidChangeLocalProfiles(e: DidChangeProfilesEvent): Promise<void> {
		for (const profile of e.removed) {
			const remoteProfile = this.remoteUserDataProfilesService?.profiles.find(p => p.id === profile.id);
			if (remoteProfile) {
				await this.remoteUserDataProfilesService?.removeProfile(remoteProfile);
			}
		}
	}

	async getRemoteProfiles(): Promise<readonly IUserDataProfile[]> {
		await this.initPromise;

		if (!this.remoteUserDataProfilesService) {
			throw new ErrorNoTelemetry('Remote profiles service not available in the current window');
		}

		return this.remoteUserDataProfilesService.profiles;
	}

	async getRemoteProfile(localProfile: IUserDataProfile): Promise<IUserDataProfile> {
		await this.initPromise;

		if (!this.remoteUserDataProfilesService) {
			throw new ErrorNoTelemetry('Remote profiles service not available in the current window');
		}

		return this.getAssociatedRemoteProfile(localProfile, this.remoteUserDataProfilesService);
	}

	private async getAssociatedRemoteProfile(localProfile: IUserDataProfile, remoteUserDataProfilesService: IUserDataProfilesService): Promise<IUserDataProfile> {
		// If the local profile is the default profile, return the remote default profile
		if (localProfile.isDefault) {
			return remoteUserDataProfilesService.defaultProfile;
		}

		let profile = remoteUserDataProfilesService.profiles.find(p => p.id === localProfile.id);
		if (!profile) {
			profile = await remoteUserDataProfilesService.createProfile(localProfile.id, localProfile.name, {
				transient: localProfile.isTransient,
				useDefaultFlags: localProfile.useDefaultFlags,
			});
			this.setAssociatedRemoteProfiles([...this.getAssociatedRemoteProfiles(), this.userDataProfileService.currentProfile.id]);
		}
		return profile;
	}

	private getAssociatedRemoteProfiles(): string[] {
		if (this.environmentService.remoteAuthority) {
			const remotes = this.parseAssociatedRemoteProfiles();
			return remotes[this.environmentService.remoteAuthority] ?? [];
		}
		return [];
	}

	private setAssociatedRemoteProfiles(profiles: string[]): void {
		if (this.environmentService.remoteAuthority) {
			const remotes = this.parseAssociatedRemoteProfiles();
			profiles = distinct(profiles);
			if (profiles.length) {
				remotes[this.environmentService.remoteAuthority] = profiles;
			} else {
				delete remotes[this.environmentService.remoteAuthority];
			}
			if (Object.keys(remotes).length) {
				this.storageService.store(associatedRemoteProfilesKey, JSON.stringify(remotes), StorageScope.APPLICATION, StorageTarget.MACHINE);
			} else {
				this.storageService.remove(associatedRemoteProfilesKey, StorageScope.APPLICATION);
			}
		}
	}

	private parseAssociatedRemoteProfiles(): IStringDictionary<string[]> {
		if (this.environmentService.remoteAuthority) {
			const value = this.storageService.get(associatedRemoteProfilesKey, StorageScope.APPLICATION);
			try {
				return value ? JSON.parse(value) : {};
			} catch (error) {
				this.logService.error(error);
			}
		}
		return {};
	}

	private async cleanUp(): Promise<void> {
		const associatedRemoteProfiles: string[] = [];
		for (const profileId of this.getAssociatedRemoteProfiles()) {
			const remoteProfile = this.remoteUserDataProfilesService?.profiles.find(p => p.id === profileId);
			if (!remoteProfile) {
				continue;
			}
			const localProfile = this.userDataProfilesService.profiles.find(p => p.id === profileId);
			if (localProfile) {
				if (localProfile.name !== remoteProfile.name) {
					await this.remoteUserDataProfilesService?.updateProfile(remoteProfile, { name: localProfile.name });
				}
				associatedRemoteProfiles.push(profileId);
				continue;
			}
			if (remoteProfile) {
				// Cleanup remote profiles those are not available locally
				await this.remoteUserDataProfilesService?.removeProfile(remoteProfile);
			}
		}
		this.setAssociatedRemoteProfiles(associatedRemoteProfiles);
	}

}

registerSingleton(IRemoteUserDataProfilesService, RemoteUserDataProfilesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/common/userDataProfile.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/common/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isUndefined } from '../../../../base/common/types.js';
import { Event } from '../../../../base/common/event.js';
import { localize, localize2 } from '../../../../nls.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataProfile, IUserDataProfileOptions, IUserDataProfileUpdateOptions, ProfileResourceType, ProfileResourceTypeFlags } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { URI } from '../../../../base/common/uri.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ITreeItem, ITreeItemLabel } from '../../../common/views.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export interface DidChangeUserDataProfileEvent {
	readonly previous: IUserDataProfile;
	readonly profile: IUserDataProfile;
	join(promise: Promise<void>): void;
}

export const IUserDataProfileService = createDecorator<IUserDataProfileService>('IUserDataProfileService');
export interface IUserDataProfileService {
	readonly _serviceBrand: undefined;
	readonly currentProfile: IUserDataProfile;
	readonly onDidChangeCurrentProfile: Event<DidChangeUserDataProfileEvent>;
	updateCurrentProfile(currentProfile: IUserDataProfile): Promise<void>;
}

export interface IProfileTemplateInfo {
	readonly name: string;
	readonly url: string;
}

export const IUserDataProfileManagementService = createDecorator<IUserDataProfileManagementService>('IUserDataProfileManagementService');
export interface IUserDataProfileManagementService {
	readonly _serviceBrand: undefined;

	createProfile(name: string, options?: IUserDataProfileOptions): Promise<IUserDataProfile>;
	createAndEnterProfile(name: string, options?: IUserDataProfileOptions): Promise<IUserDataProfile>;
	createAndEnterTransientProfile(): Promise<IUserDataProfile>;
	removeProfile(profile: IUserDataProfile): Promise<void>;
	updateProfile(profile: IUserDataProfile, updateOptions: IUserDataProfileUpdateOptions): Promise<IUserDataProfile>;
	switchProfile(profile: IUserDataProfile): Promise<void>;
	getBuiltinProfileTemplates(): Promise<IProfileTemplateInfo[]>;
	getDefaultProfileToUse(): IUserDataProfile;
}

export interface IUserDataProfileTemplate {
	readonly name: string;
	readonly icon?: string;
	readonly settings?: string;
	readonly keybindings?: string;
	readonly tasks?: string;
	readonly snippets?: string;
	readonly globalState?: string;
	readonly extensions?: string;
	readonly mcp?: string;
}

export function isUserDataProfileTemplate(thing: unknown): thing is IUserDataProfileTemplate {
	const candidate = thing as IUserDataProfileTemplate | undefined;

	return !!(candidate && typeof candidate === 'object'
		&& (isUndefined(candidate.settings) || typeof candidate.settings === 'string')
		&& (isUndefined(candidate.globalState) || typeof candidate.globalState === 'string')
		&& (isUndefined(candidate.extensions) || typeof candidate.extensions === 'string')
		&& (isUndefined(candidate.mcp) || typeof candidate.mcp === 'string'));
}

export const PROFILE_URL_AUTHORITY = 'profile';
export function toUserDataProfileUri(path: string, productService: IProductService): URI {
	return URI.from({
		scheme: productService.urlProtocol,
		authority: PROFILE_URL_AUTHORITY,
		path: path.startsWith('/') ? path : `/${path}`
	});
}

export const PROFILE_URL_AUTHORITY_PREFIX = 'profile-';
export function isProfileURL(uri: URI): boolean {
	return uri.authority === PROFILE_URL_AUTHORITY || new RegExp(`^${PROFILE_URL_AUTHORITY_PREFIX}`).test(uri.authority);
}

export interface IUserDataProfileCreateOptions extends IUserDataProfileOptions {
	readonly name?: string;
	readonly resourceTypeFlags?: ProfileResourceTypeFlags;
}

export interface IProfileImportOptions extends IUserDataProfileCreateOptions {
	readonly name?: string;
	readonly icon?: string;
	readonly mode?: 'apply';
}

export const IUserDataProfileImportExportService = createDecorator<IUserDataProfileImportExportService>('IUserDataProfileImportExportService');
export interface IUserDataProfileImportExportService {
	readonly _serviceBrand: undefined;

	registerProfileContentHandler(id: string, profileContentHandler: IUserDataProfileContentHandler): IDisposable;
	unregisterProfileContentHandler(id: string): void;

	resolveProfileTemplate(uri: URI): Promise<IUserDataProfileTemplate | null>;
	exportProfile(profile: IUserDataProfile, exportFlags?: ProfileResourceTypeFlags): Promise<void>;
	createFromProfile(from: IUserDataProfile, options: IUserDataProfileCreateOptions, token: CancellationToken): Promise<IUserDataProfile | undefined>;
	createProfileFromTemplate(profileTemplate: IUserDataProfileTemplate, options: IUserDataProfileCreateOptions, token: CancellationToken): Promise<IUserDataProfile | undefined>;
	createTroubleshootProfile(): Promise<void>;
}

export interface IProfileResourceInitializer {
	initialize(content: string): Promise<void>;
}

export interface IProfileResource {
	getContent(profile: IUserDataProfile): Promise<string>;
	apply(content: string, profile: IUserDataProfile): Promise<void>;
}

export interface IProfileResourceTreeItem extends ITreeItem {
	readonly type: ProfileResourceType;
	readonly label: ITreeItemLabel;
	isFromDefaultProfile(): boolean;
	getChildren(): Promise<IProfileResourceChildTreeItem[] | undefined>;
	getContent(): Promise<string>;
}

export interface IProfileResourceChildTreeItem extends ITreeItem {
	parent: IProfileResourceTreeItem;
}

export interface ISaveProfileResult {
	readonly id: string;
	readonly link: URI;
}

export interface IUserDataProfileContentHandler {
	readonly name: string;
	readonly description?: string;
	readonly extensionId?: string;
	saveProfile(name: string, content: string, token: CancellationToken): Promise<ISaveProfileResult | null>;
	readProfile(idOrUri: string | URI, token: CancellationToken): Promise<string | null>;
}

export const defaultUserDataProfileIcon = registerIcon('defaultProfile-icon', Codicon.settings, localize('defaultProfileIcon', 'Icon for Default Profile.'));

export const PROFILES_TITLE = localize2('profiles', 'Profiles');
export const PROFILES_CATEGORY = { ...PROFILES_TITLE };
export const PROFILE_EXTENSION = 'code-profile';
export const PROFILE_FILTER = [{ name: localize('profile', "Profile"), extensions: [PROFILE_EXTENSION] }];
export const CURRENT_PROFILE_CONTEXT = new RawContextKey<string>('currentProfile', '');
export const IS_CURRENT_PROFILE_TRANSIENT_CONTEXT = new RawContextKey<boolean>('isCurrentProfileTransient', false);
export const HAS_PROFILES_CONTEXT = new RawContextKey<boolean>('hasProfiles', false);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/common/userDataProfileIcons.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/common/userDataProfileIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const DEFAULT_ICON = registerIcon('settings-view-bar-icon', Codicon.settingsGear, localize('settingsViewBarIcon', "Settings icon in the view bar."));

export const ICONS = [

	/* Default */
	DEFAULT_ICON,

	/* hardware/devices */
	Codicon.vm,
	Codicon.server,
	Codicon.recordKeys,
	Codicon.deviceMobile,
	Codicon.watch,
	Codicon.vr,
	Codicon.piano,

	/* languages */
	Codicon.ruby,
	Codicon.code,
	Codicon.coffee,
	Codicon.snake,

	/* project types */
	Codicon.project,
	Codicon.window,
	Codicon.library,
	Codicon.extensions,
	Codicon.terminal,
	Codicon.terminalDebian,
	Codicon.terminalLinux,
	Codicon.terminalUbuntu,
	Codicon.beaker,
	Codicon.package,
	Codicon.cloud,
	Codicon.book,
	Codicon.globe,
	Codicon.database,
	Codicon.notebook,
	Codicon.robot,
	Codicon.game,
	Codicon.chip,
	Codicon.music,
	Codicon.remoteExplorer,
	Codicon.github,
	Codicon.azure,
	Codicon.vscode,
	Codicon.copilot,

	/* misc */
	Codicon.gift,
	Codicon.send,
	Codicon.bookmark,
	Codicon.briefcase,
	Codicon.megaphone,
	Codicon.comment,
	Codicon.telescope,
	Codicon.creditCard,
	Codicon.map,
	Codicon.deviceCameraVideo,
	Codicon.unmute,
	Codicon.law,
	Codicon.graphLine,
	Codicon.heart,
	Codicon.home,
	Codicon.inbox,
	Codicon.mortarBoard,
	Codicon.rocket,
	Codicon.magnet,
	Codicon.lock,
	Codicon.milestone,
	Codicon.tag,
	Codicon.pulse,
	Codicon.radioTower,
	Codicon.smiley,
	Codicon.zap,
	Codicon.squirrel,
	Codicon.symbolColor,
	Codicon.mail,
	Codicon.key,
	Codicon.pieChart,
	Codicon.organization,
	Codicon.preview,
	Codicon.wand,
	Codicon.starEmpty,
	Codicon.lightbulb,
	Codicon.symbolRuler,
	Codicon.dashboard,
	Codicon.calendar,
	Codicon.shield,
	Codicon.verified,
	Codicon.debug,
	Codicon.flame,
	Codicon.compass,
	Codicon.paintcan,
	Codicon.archive,
	Codicon.mic,
	Codicon.jersey,

];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/common/userDataProfileService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/common/userDataProfileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../../base/common/async.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { equals } from '../../../../base/common/objects.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { DidChangeUserDataProfileEvent, IUserDataProfileService } from './userDataProfile.js';

export class UserDataProfileService extends Disposable implements IUserDataProfileService {

	readonly _serviceBrand: undefined;

	private readonly _onDidChangeCurrentProfile = this._register(new Emitter<DidChangeUserDataProfileEvent>());
	readonly onDidChangeCurrentProfile = this._onDidChangeCurrentProfile.event;

	private _currentProfile: IUserDataProfile;
	get currentProfile(): IUserDataProfile { return this._currentProfile; }

	constructor(
		currentProfile: IUserDataProfile
	) {
		super();
		this._currentProfile = currentProfile;
	}

	async updateCurrentProfile(userDataProfile: IUserDataProfile): Promise<void> {
		if (equals(this._currentProfile, userDataProfile)) {
			return;
		}
		const previous = this._currentProfile;
		this._currentProfile = userDataProfile;
		const joiners: Promise<void>[] = [];
		this._onDidChangeCurrentProfile.fire({
			previous,
			profile: userDataProfile,
			join(promise) {
				joiners.push(promise);
			}
		});
		await Promises.settled(joiners);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/browser/userDataSyncEnablementService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/browser/userDataSyncEnablementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUserDataSyncEnablementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { UserDataSyncEnablementService as BaseUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSyncEnablementService.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';

export class UserDataSyncEnablementService extends BaseUserDataSyncEnablementService implements IUserDataSyncEnablementService {

	protected get workbenchEnvironmentService(): IBrowserWorkbenchEnvironmentService { return <IBrowserWorkbenchEnvironmentService>this.environmentService; }

	override getResourceSyncStateVersion(resource: SyncResource): string | undefined {
		return resource === SyncResource.Extensions ? this.workbenchEnvironmentService.options?.settingsSyncOptions?.extensionsSyncStateVersion : undefined;
	}

}

registerSingleton(IUserDataSyncEnablementService, UserDataSyncEnablementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/browser/userDataSyncInit.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/browser/userDataSyncInit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { AbstractExtensionsInitializer, IExtensionsInitializerPreviewResult } from '../../../../platform/userDataSync/common/extensionsSync.js';
import { GlobalStateInitializer, UserDataSyncStoreTypeSynchronizer } from '../../../../platform/userDataSync/common/globalStateSync.js';
import { KeybindingsInitializer } from '../../../../platform/userDataSync/common/keybindingsSync.js';
import { SettingsInitializer } from '../../../../platform/userDataSync/common/settingsSync.js';
import { SnippetsInitializer } from '../../../../platform/userDataSync/common/snippetsSync.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { UserDataSyncStoreClient } from '../../../../platform/userDataSync/common/userDataSyncStoreService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { IRemoteUserData, IUserData, IUserDataSyncResourceInitializer, IUserDataSyncLogService, IUserDataSyncStoreManagementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { AuthenticationSessionInfo, getCurrentAuthenticationSessionInfo } from '../../authentication/browser/authenticationService.js';
import { getSyncAreaLabel } from '../common/userDataSync.js';
import { isWeb } from '../../../../base/common/platform.js';
import { Barrier, Promises } from '../../../../base/common/async.js';
import { EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT, IExtensionGalleryService, IExtensionManagementService, IGlobalExtensionEnablementService, ILocalExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IExtensionService, toExtensionDescription } from '../../extensions/common/extensions.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IIgnoredExtensionsManagementService } from '../../../../platform/userDataSync/common/ignoredExtensions.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExtensionStorageService } from '../../../../platform/extensionManagement/common/extensionStorage.js';
import { TasksInitializer } from '../../../../platform/userDataSync/common/tasksSync.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IUserDataInitializer } from '../../userData/browser/userDataInit.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';

export class UserDataSyncInitializer implements IUserDataInitializer {

	_serviceBrand: undefined;

	private readonly initialized: SyncResource[] = [];
	private readonly initializationFinished = new Barrier();
	private globalStateUserData: IUserData | null = null;

	constructor(
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IFileService private readonly fileService: IFileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IStorageService private readonly storageService: IStorageService,
		@IProductService private readonly productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService private readonly logService: ILogService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		this.createUserDataSyncStoreClient().then(userDataSyncStoreClient => {
			if (!userDataSyncStoreClient) {
				this.initializationFinished.open();
			}
		});
	}

	private _userDataSyncStoreClientPromise: Promise<UserDataSyncStoreClient | undefined> | undefined;
	private createUserDataSyncStoreClient(): Promise<UserDataSyncStoreClient | undefined> {
		if (!this._userDataSyncStoreClientPromise) {
			this._userDataSyncStoreClientPromise = (async (): Promise<UserDataSyncStoreClient | undefined> => {
				try {
					if (!isWeb) {
						this.logService.trace(`Skipping initializing user data in desktop`);
						return;
					}

					if (!this.storageService.isNew(StorageScope.APPLICATION)) {
						this.logService.trace(`Skipping initializing user data as application was opened before`);
						return;
					}

					if (!this.storageService.isNew(StorageScope.WORKSPACE)) {
						this.logService.trace(`Skipping initializing user data as workspace was opened before`);
						return;
					}

					if (this.environmentService.options?.settingsSyncOptions?.authenticationProvider && !this.environmentService.options.settingsSyncOptions.enabled) {
						this.logService.trace(`Skipping initializing user data as settings sync is disabled`);
						return;
					}

					let authenticationSession;
					try {
						authenticationSession = await getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService);
					} catch (error) {
						this.logService.error(error);
					}
					if (!authenticationSession) {
						this.logService.trace(`Skipping initializing user data as authentication session is not set`);
						return;
					}

					await this.initializeUserDataSyncStore(authenticationSession);

					const userDataSyncStore = this.userDataSyncStoreManagementService.userDataSyncStore;
					if (!userDataSyncStore) {
						this.logService.trace(`Skipping initializing user data as sync service is not provided`);
						return;
					}

					const userDataSyncStoreClient = new UserDataSyncStoreClient(userDataSyncStore.url, this.productService, this.requestService, this.logService, this.environmentService, this.fileService, this.storageService);
					userDataSyncStoreClient.setAuthToken(authenticationSession.accessToken, authenticationSession.providerId);

					const manifest = await userDataSyncStoreClient.manifest(null);
					if (manifest === null) {
						userDataSyncStoreClient.dispose();
						this.logService.trace(`Skipping initializing user data as there is no data`);
						return;
					}

					this.logService.info(`Using settings sync service ${userDataSyncStore.url.toString()} for initialization`);
					return userDataSyncStoreClient;

				} catch (error) {
					this.logService.error(error);
					return;
				}
			})();
		}

		return this._userDataSyncStoreClientPromise;
	}

	private async initializeUserDataSyncStore(authenticationSession: AuthenticationSessionInfo): Promise<void> {
		const userDataSyncStore = this.userDataSyncStoreManagementService.userDataSyncStore;
		if (!userDataSyncStore?.canSwitch) {
			return;
		}

		const disposables = new DisposableStore();
		try {
			const userDataSyncStoreClient = disposables.add(new UserDataSyncStoreClient(userDataSyncStore.url, this.productService, this.requestService, this.logService, this.environmentService, this.fileService, this.storageService));
			userDataSyncStoreClient.setAuthToken(authenticationSession.accessToken, authenticationSession.providerId);

			// Cache global state data for global state initialization
			this.globalStateUserData = await userDataSyncStoreClient.readResource(SyncResource.GlobalState, null);

			if (this.globalStateUserData) {
				const userDataSyncStoreType = new UserDataSyncStoreTypeSynchronizer(userDataSyncStoreClient, this.storageService, this.environmentService, this.fileService, this.logService).getSyncStoreType(this.globalStateUserData);
				if (userDataSyncStoreType) {
					await this.userDataSyncStoreManagementService.switch(userDataSyncStoreType);

					// Unset cached global state data if urls are changed
					if (!isEqual(userDataSyncStore.url, this.userDataSyncStoreManagementService.userDataSyncStore?.url)) {
						this.logService.info('Switched settings sync store');
						this.globalStateUserData = null;
					}
				}
			}
		} finally {
			disposables.dispose();
		}
	}

	async whenInitializationFinished(): Promise<void> {
		await this.initializationFinished.wait();
	}

	async requiresInitialization(): Promise<boolean> {
		this.logService.trace(`UserDataInitializationService#requiresInitialization`);
		const userDataSyncStoreClient = await this.createUserDataSyncStoreClient();
		return !!userDataSyncStoreClient;
	}

	async initializeRequiredResources(): Promise<void> {
		this.logService.trace(`UserDataInitializationService#initializeRequiredResources`);
		return this.initialize([SyncResource.Settings, SyncResource.GlobalState]);
	}

	async initializeOtherResources(instantiationService: IInstantiationService): Promise<void> {
		try {
			this.logService.trace(`UserDataInitializationService#initializeOtherResources`);
			await Promise.allSettled([this.initialize([SyncResource.Keybindings, SyncResource.Snippets, SyncResource.Tasks]), this.initializeExtensions(instantiationService)]);
		} finally {
			this.initializationFinished.open();
		}
	}

	private async initializeExtensions(instantiationService: IInstantiationService): Promise<void> {
		try {
			await Promise.all([this.initializeInstalledExtensions(instantiationService), this.initializeNewExtensions(instantiationService)]);
		} finally {
			this.initialized.push(SyncResource.Extensions);
		}
	}

	private initializeInstalledExtensionsPromise: Promise<void> | undefined;
	async initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void> {
		if (!this.initializeInstalledExtensionsPromise) {
			this.initializeInstalledExtensionsPromise = (async () => {
				this.logService.trace(`UserDataInitializationService#initializeInstalledExtensions`);
				const extensionsPreviewInitializer = await this.getExtensionsPreviewInitializer(instantiationService);
				if (extensionsPreviewInitializer) {
					await instantiationService.createInstance(InstalledExtensionsInitializer, extensionsPreviewInitializer).initialize();
				}
			})();
		}
		return this.initializeInstalledExtensionsPromise;
	}

	private initializeNewExtensionsPromise: Promise<void> | undefined;
	private async initializeNewExtensions(instantiationService: IInstantiationService): Promise<void> {
		if (!this.initializeNewExtensionsPromise) {
			this.initializeNewExtensionsPromise = (async () => {
				this.logService.trace(`UserDataInitializationService#initializeNewExtensions`);
				const extensionsPreviewInitializer = await this.getExtensionsPreviewInitializer(instantiationService);
				if (extensionsPreviewInitializer) {
					await instantiationService.createInstance(NewExtensionsInitializer, extensionsPreviewInitializer).initialize();
				}
			})();
		}
		return this.initializeNewExtensionsPromise;
	}

	private extensionsPreviewInitializerPromise: Promise<ExtensionsPreviewInitializer | null> | undefined;
	private getExtensionsPreviewInitializer(instantiationService: IInstantiationService): Promise<ExtensionsPreviewInitializer | null> {
		if (!this.extensionsPreviewInitializerPromise) {
			this.extensionsPreviewInitializerPromise = (async () => {
				const userDataSyncStoreClient = await this.createUserDataSyncStoreClient();
				if (!userDataSyncStoreClient) {
					return null;
				}
				const userData = await userDataSyncStoreClient.readResource(SyncResource.Extensions, null);
				return instantiationService.createInstance(ExtensionsPreviewInitializer, userData);
			})();
		}
		return this.extensionsPreviewInitializerPromise;
	}

	private async initialize(syncResources: SyncResource[]): Promise<void> {
		const userDataSyncStoreClient = await this.createUserDataSyncStoreClient();
		if (!userDataSyncStoreClient) {
			return;
		}

		await Promises.settled(syncResources.map(async syncResource => {
			try {
				if (this.initialized.includes(syncResource)) {
					this.logService.info(`${getSyncAreaLabel(syncResource)} initialized already.`);
					return;
				}
				this.initialized.push(syncResource);
				this.logService.trace(`Initializing ${getSyncAreaLabel(syncResource)}`);
				const initializer = this.createSyncResourceInitializer(syncResource);
				const userData = await userDataSyncStoreClient.readResource(syncResource, syncResource === SyncResource.GlobalState ? this.globalStateUserData : null);
				await initializer.initialize(userData);
				this.logService.info(`Initialized ${getSyncAreaLabel(syncResource)}`);
			} catch (error) {
				this.logService.info(`Error while initializing ${getSyncAreaLabel(syncResource)}`);
				this.logService.error(error);
			}
		}));
	}

	private createSyncResourceInitializer(syncResource: SyncResource): IUserDataSyncResourceInitializer {
		switch (syncResource) {
			case SyncResource.Settings: return new SettingsInitializer(this.fileService, this.userDataProfilesService, this.environmentService, this.logService, this.storageService, this.uriIdentityService);
			case SyncResource.Keybindings: return new KeybindingsInitializer(this.fileService, this.userDataProfilesService, this.environmentService, this.logService, this.storageService, this.uriIdentityService);
			case SyncResource.Tasks: return new TasksInitializer(this.fileService, this.userDataProfilesService, this.environmentService, this.logService, this.storageService, this.uriIdentityService);
			case SyncResource.Snippets: return new SnippetsInitializer(this.fileService, this.userDataProfilesService, this.environmentService, this.logService, this.storageService, this.uriIdentityService);
			case SyncResource.GlobalState: return new GlobalStateInitializer(this.storageService, this.fileService, this.userDataProfilesService, this.environmentService, this.logService, this.uriIdentityService);
		}
		throw new Error(`Cannot create initializer for ${syncResource}`);
	}

}

class ExtensionsPreviewInitializer extends AbstractExtensionsInitializer {

	private previewPromise: Promise<IExtensionsInitializerPreviewResult | null> | undefined;
	private preview: IExtensionsInitializerPreviewResult | null = null;

	constructor(
		private readonly extensionsData: IUserData,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IIgnoredExtensionsManagementService ignoredExtensionsManagementService: IIgnoredExtensionsManagementService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(extensionManagementService, ignoredExtensionsManagementService, fileService, userDataProfilesService, environmentService, logService, storageService, uriIdentityService);
	}

	getPreview(): Promise<IExtensionsInitializerPreviewResult | null> {
		if (!this.previewPromise) {
			this.previewPromise = super.initialize(this.extensionsData).then(() => this.preview);
		}
		return this.previewPromise;
	}

	override initialize(): Promise<void> {
		throw new Error('should not be called directly');
	}

	protected override async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const remoteExtensions = await this.parseExtensions(remoteUserData);
		if (!remoteExtensions) {
			this.logService.info('Skipping initializing extensions because remote extensions does not exist.');
			return;
		}
		const installedExtensions = await this.extensionManagementService.getInstalled();
		this.preview = this.generatePreview(remoteExtensions, installedExtensions);
	}
}

class InstalledExtensionsInitializer implements IUserDataSyncResourceInitializer {

	constructor(
		private readonly extensionsPreviewInitializer: ExtensionsPreviewInitializer,
		@IGlobalExtensionEnablementService private readonly extensionEnablementService: IGlobalExtensionEnablementService,
		@IExtensionStorageService private readonly extensionStorageService: IExtensionStorageService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
	) {
	}

	async initialize(): Promise<void> {
		const preview = await this.extensionsPreviewInitializer.getPreview();
		if (!preview) {
			return;
		}

		// 1. Initialise already installed extensions state
		for (const installedExtension of preview.installedExtensions) {
			const syncExtension = preview.remoteExtensions.find(({ identifier }) => areSameExtensions(identifier, installedExtension.identifier));
			if (syncExtension?.state) {
				const extensionState = this.extensionStorageService.getExtensionState(installedExtension, true) || {};
				Object.keys(syncExtension.state).forEach(key => extensionState[key] = syncExtension.state![key]);
				this.extensionStorageService.setExtensionState(installedExtension, extensionState, true);
			}
		}

		// 2. Initialise extensions enablement
		if (preview.disabledExtensions.length) {
			for (const identifier of preview.disabledExtensions) {
				this.logService.trace(`Disabling extension...`, identifier.id);
				await this.extensionEnablementService.disableExtension(identifier);
				this.logService.info(`Disabling extension`, identifier.id);
			}
		}
	}
}

class NewExtensionsInitializer implements IUserDataSyncResourceInitializer {

	constructor(
		private readonly extensionsPreviewInitializer: ExtensionsPreviewInitializer,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IExtensionStorageService private readonly extensionStorageService: IExtensionStorageService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
	) {
	}

	async initialize(): Promise<void> {
		const preview = await this.extensionsPreviewInitializer.getPreview();
		if (!preview) {
			return;
		}

		const newlyEnabledExtensions: ILocalExtension[] = [];
		const targetPlatform = await this.extensionManagementService.getTargetPlatform();
		const galleryExtensions = await this.galleryService.getExtensions(preview.newExtensions, { targetPlatform, compatible: true }, CancellationToken.None);
		for (const galleryExtension of galleryExtensions) {
			try {
				const extensionToSync = preview.remoteExtensions.find(({ identifier }) => areSameExtensions(identifier, galleryExtension.identifier));
				if (!extensionToSync) {
					continue;
				}
				if (extensionToSync.state) {
					this.extensionStorageService.setExtensionState(galleryExtension, extensionToSync.state, true);
				}
				this.logService.trace(`Installing extension...`, galleryExtension.identifier.id);
				const local = await this.extensionManagementService.installFromGallery(galleryExtension, {
					isMachineScoped: false, /* set isMachineScoped to prevent install and sync dialog in web */
					donotIncludePackAndDependencies: true,
					installGivenVersion: !!extensionToSync.version,
					installPreReleaseVersion: extensionToSync.preRelease,
					context: { [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true }
				});
				if (!preview.disabledExtensions.some(identifier => areSameExtensions(identifier, galleryExtension.identifier))) {
					newlyEnabledExtensions.push(local);
				}
				this.logService.info(`Installed extension.`, galleryExtension.identifier.id);
			} catch (error) {
				this.logService.error(error);
			}
		}

		const canEnabledExtensions = newlyEnabledExtensions.filter(e => this.extensionService.canAddExtension(toExtensionDescription(e)));
		if (!(await this.areExtensionsRunning(canEnabledExtensions))) {
			await new Promise<void>((c, e) => {
				const disposable = this.extensionService.onDidChangeExtensions(async () => {
					try {
						if (await this.areExtensionsRunning(canEnabledExtensions)) {
							disposable.dispose();
							c();
						}
					} catch (error) {
						e(error);
					}
				});
			});
		}
	}

	private async areExtensionsRunning(extensions: ILocalExtension[]): Promise<boolean> {
		await this.extensionService.whenInstalledExtensionsRegistered();
		const runningExtensions = this.extensionService.extensions;
		return extensions.every(e => runningExtensions.some(r => areSameExtensions({ id: r.identifier.value }, e.identifier)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/browser/userDataSyncWorkbenchService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/browser/userDataSyncWorkbenchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUserDataSyncService, IAuthenticationProvider, isAuthenticationProvider, IUserDataAutoSyncService, IUserDataSyncStoreManagementService, SyncStatus, IUserDataSyncEnablementService, IUserDataSyncResource, IResourcePreview, USER_DATA_SYNC_SCHEME, USER_DATA_SYNC_LOG_ID, } from '../../../../platform/userDataSync/common/userDataSync.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUserDataSyncWorkbenchService, IUserDataSyncAccount, AccountStatus, CONTEXT_SYNC_ENABLEMENT, CONTEXT_SYNC_STATE, CONTEXT_ACCOUNT_STATE, SHOW_SYNC_LOG_COMMAND_ID, CONTEXT_ENABLE_ACTIVITY_VIEWS, SYNC_VIEW_CONTAINER_ID, SYNC_TITLE, SYNC_CONFLICTS_VIEW_ID, CONTEXT_ENABLE_SYNC_CONFLICTS_VIEW, CONTEXT_HAS_CONFLICTS, IUserDataSyncConflictsView, getSyncAreaLabel } from '../common/userDataSync.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { getCurrentAuthenticationSessionInfo } from '../../authentication/browser/authenticationService.js';
import { AuthenticationSession, AuthenticationSessionsChangeEvent, IAuthenticationService } from '../../authentication/common/authentication.js';
import { IUserDataSyncAccountService } from '../../../../platform/userDataSync/common/userDataSyncAccount.js';
import { IQuickInputService, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { localize } from '../../../../nls.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { URI } from '../../../../base/common/uri.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../views/common/viewsService.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { UserDataSyncStoreClient } from '../../../../platform/userDataSync/common/userDataSyncStoreService.js';
import { UserDataSyncStoreTypeSynchronizer } from '../../../../platform/userDataSync/common/globalStateSync.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isDiffEditorInput } from '../../../common/editor.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IUserDataInitializationService } from '../../userData/browser/userDataInit.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { IUserDataSyncMachinesService } from '../../../../platform/userDataSync/common/userDataSyncMachines.js';
import { equals } from '../../../../base/common/arrays.js';
import { env } from '../../../../base/common/process.js';

type AccountQuickPickItem = { label: string; authenticationProvider: IAuthenticationProvider; account?: UserDataSyncAccount; description?: string };

class UserDataSyncAccount implements IUserDataSyncAccount {

	constructor(readonly authenticationProviderId: string, private readonly session: AuthenticationSession) { }

	get sessionId(): string { return this.session.id; }
	get accountName(): string { return this.session.account.label; }
	get accountId(): string { return this.session.account.id; }
	get token(): string { return this.session.idToken || this.session.accessToken; }
}

type MergeEditorInput = { base: URI; input1: { uri: URI }; input2: { uri: URI }; result: URI };
export function isMergeEditorInput(editor: unknown): editor is MergeEditorInput {
	const candidate = editor as MergeEditorInput;
	return URI.isUri(candidate?.base) && URI.isUri(candidate?.input1?.uri) && URI.isUri(candidate?.input2?.uri) && URI.isUri(candidate?.result);
}

export class UserDataSyncWorkbenchService extends Disposable implements IUserDataSyncWorkbenchService {

	_serviceBrand: undefined;

	private static DONOT_USE_WORKBENCH_SESSION_STORAGE_KEY = 'userDataSyncAccount.donotUseWorkbenchSession';
	private static CACHED_AUTHENTICATION_PROVIDER_KEY = 'userDataSyncAccountProvider';
	private static CACHED_SESSION_STORAGE_KEY = 'userDataSyncAccountPreference';

	get enabled() { return !!this.userDataSyncStoreManagementService.userDataSyncStore; }

	private _authenticationProviders: IAuthenticationProvider[] = [];
	get authenticationProviders() { return this._authenticationProviders; }

	private _accountStatus: AccountStatus = AccountStatus.Uninitialized;
	get accountStatus(): AccountStatus { return this._accountStatus; }
	private readonly _onDidChangeAccountStatus = this._register(new Emitter<AccountStatus>());
	readonly onDidChangeAccountStatus = this._onDidChangeAccountStatus.event;

	private readonly _onDidTurnOnSync = this._register(new Emitter<void>());
	readonly onDidTurnOnSync = this._onDidTurnOnSync.event;

	private _current: UserDataSyncAccount | undefined;
	get current(): UserDataSyncAccount | undefined { return this._current; }

	private readonly syncEnablementContext: IContextKey<boolean>;
	private readonly syncStatusContext: IContextKey<string>;
	private readonly accountStatusContext: IContextKey<string>;
	private readonly enableConflictsViewContext: IContextKey<boolean>;
	private readonly hasConflicts: IContextKey<boolean>;
	private readonly activityViewsEnablementContext: IContextKey<boolean>;

	private turnOnSyncCancellationToken: CancellationTokenSource | undefined = undefined;

	constructor(
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IUserDataSyncAccountService private readonly userDataSyncAccountService: IUserDataSyncAccountService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IStorageService private readonly storageService: IStorageService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataAutoSyncService private readonly userDataAutoSyncService: IUserDataAutoSyncService,
		@ILogService private readonly logService: ILogService,
		@IProductService private readonly productService: IProductService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@INotificationService private readonly notificationService: INotificationService,
		@IProgressService private readonly progressService: IProgressService,
		@IDialogService private readonly dialogService: IDialogService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewsService private readonly viewsService: IViewsService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IUserDataInitializationService private readonly userDataInitializationService: IUserDataInitializationService,
		@IFileService private readonly fileService: IFileService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IUserDataSyncMachinesService private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
	) {
		super();
		this.syncEnablementContext = CONTEXT_SYNC_ENABLEMENT.bindTo(contextKeyService);
		this.syncStatusContext = CONTEXT_SYNC_STATE.bindTo(contextKeyService);
		this.accountStatusContext = CONTEXT_ACCOUNT_STATE.bindTo(contextKeyService);
		this.activityViewsEnablementContext = CONTEXT_ENABLE_ACTIVITY_VIEWS.bindTo(contextKeyService);
		this.hasConflicts = CONTEXT_HAS_CONFLICTS.bindTo(contextKeyService);
		this.enableConflictsViewContext = CONTEXT_ENABLE_SYNC_CONFLICTS_VIEW.bindTo(contextKeyService);

		if (this.userDataSyncStoreManagementService.userDataSyncStore) {
			this.syncStatusContext.set(this.userDataSyncService.status);
			this._register(userDataSyncService.onDidChangeStatus(status => this.syncStatusContext.set(status)));
			this.syncEnablementContext.set(userDataSyncEnablementService.isEnabled());
			this._register(userDataSyncEnablementService.onDidChangeEnablement(enabled => this.syncEnablementContext.set(enabled)));

			this.waitAndInitialize();
		}
	}

	private updateAuthenticationProviders(): boolean {
		const oldValue = this._authenticationProviders;
		this._authenticationProviders = (this.userDataSyncStoreManagementService.userDataSyncStore?.authenticationProviders || []).filter(({ id }) => this.authenticationService.declaredProviders.some(provider => provider.id === id));
		this.logService.trace('Settings Sync: Authentication providers updated', this._authenticationProviders.map(({ id }) => id));
		return equals(oldValue, this._authenticationProviders, (a, b) => a.id === b.id);
	}

	private isSupportedAuthenticationProviderId(authenticationProviderId: string): boolean {
		return this.authenticationProviders.some(({ id }) => id === authenticationProviderId);
	}

	private async waitAndInitialize(): Promise<void> {
		try {
			/* wait */
			await Promise.all([this.extensionService.whenInstalledExtensionsRegistered(), this.userDataInitializationService.whenInitializationFinished()]);

			/* initialize */
			await this.initialize();
		} catch (error) {
			// Do not log if the current window is running extension tests
			if (!this.environmentService.extensionTestsLocationURI) {
				this.logService.error(error);
			}
		}
	}

	private async initialize(): Promise<void> {
		if (isWeb) {
			const authenticationSession = await getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService);
			if (this.currentSessionId === undefined && authenticationSession?.id) {
				if (this.environmentService.options?.settingsSyncOptions?.authenticationProvider && this.environmentService.options.settingsSyncOptions.enabled) {
					this.currentSessionId = authenticationSession.id;
				}

				// Backward compatibility
				else if (this.useWorkbenchSessionId) {
					this.currentSessionId = authenticationSession.id;
				}
				this.useWorkbenchSessionId = false;
			}
		}

		const initPromise = this.update('initialize');
		this._register(this.authenticationService.onDidChangeDeclaredProviders(() => {
			if (this.updateAuthenticationProviders()) {
				// Trigger update only after the initialization is done
				initPromise.finally(() => this.update('declared authentication providers changed'));
			}
		}));
		await initPromise;

		this._register(Event.filter(
			Event.any(
				this.authenticationService.onDidRegisterAuthenticationProvider,
				this.authenticationService.onDidUnregisterAuthenticationProvider,
			), info => this.isSupportedAuthenticationProviderId(info.id))(() => this.update('authentication provider change')));

		this._register(Event.filter(this.userDataSyncAccountService.onTokenFailed, isSuccessive => !isSuccessive)(() => this.update('token failure')));

		this._register(Event.filter(this.authenticationService.onDidChangeSessions, e => this.isSupportedAuthenticationProviderId(e.providerId))(({ event }) => this.onDidChangeSessions(event)));
		this._register(this.storageService.onDidChangeValue(StorageScope.APPLICATION, UserDataSyncWorkbenchService.CACHED_SESSION_STORAGE_KEY, this._store)(() => this.onDidChangeStorage()));
		this._register(Event.filter(this.userDataSyncAccountService.onTokenFailed, bailout => bailout)(() => this.onDidAuthFailure()));
		this.hasConflicts.set(this.userDataSyncService.conflicts.length > 0);
		this._register(this.userDataSyncService.onDidChangeConflicts(conflicts => {
			this.hasConflicts.set(conflicts.length > 0);
			if (!conflicts.length) {
				this.enableConflictsViewContext.reset();
			}
			// Close merge editors with no conflicts
			this.editorService.editors.filter(input => {
				const remoteResource = isDiffEditorInput(input) ? input.original.resource : isMergeEditorInput(input) ? input.input1.uri : undefined;
				if (remoteResource?.scheme !== USER_DATA_SYNC_SCHEME) {
					return false;
				}
				return !this.userDataSyncService.conflicts.some(({ conflicts }) => conflicts.some(({ previewResource }) => this.uriIdentityService.extUri.isEqual(previewResource, input.resource)));
			}).forEach(input => input.dispose());
		}));
	}

	private async update(reason: string): Promise<void> {
		this.logService.trace(`Settings Sync: Updating due to ${reason}`);

		this.updateAuthenticationProviders();
		await this.updateCurrentAccount();

		if (this._current) {
			this.currentAuthenticationProviderId = this._current.authenticationProviderId;
		}

		await this.updateToken(this._current);
		this.updateAccountStatus(this._current ? AccountStatus.Available : AccountStatus.Unavailable);
	}

	private async updateCurrentAccount(): Promise<void> {
		this.logService.trace('Settings Sync: Updating the current account');
		const currentSessionId = this.currentSessionId;
		const currentAuthenticationProviderId = this.currentAuthenticationProviderId;
		if (currentSessionId) {
			const authenticationProviders = currentAuthenticationProviderId ? this.authenticationProviders.filter(({ id }) => id === currentAuthenticationProviderId) : this.authenticationProviders;
			for (const { id, scopes } of authenticationProviders) {
				const sessions = (await this.authenticationService.getSessions(id, scopes)) || [];
				for (const session of sessions) {
					if (session.id === currentSessionId) {
						this._current = new UserDataSyncAccount(id, session);
						this.logService.trace('Settings Sync: Updated the current account', this._current.accountName);
						return;
					}
				}
			}
		}
		this._current = undefined;
	}

	private async updateToken(current: UserDataSyncAccount | undefined): Promise<void> {
		let value: { token: string; authenticationProviderId: string } | undefined = undefined;
		if (current) {
			try {
				const token = current.token;
				value = { token, authenticationProviderId: current.authenticationProviderId };
			} catch (e) {
				this.logService.error(e);
			}
		}
		await this.userDataSyncAccountService.updateAccount(value);
	}

	private updateAccountStatus(accountStatus: AccountStatus): void {
		this.logService.trace(`Settings Sync: Updating the account status to ${accountStatus}`);
		if (this._accountStatus !== accountStatus) {
			const previous = this._accountStatus;
			const logMsg = `Settings Sync: Account status changed from ${previous} to ${accountStatus}`;
			if (env.VSCODE_DEV) {
				this.logService.trace(logMsg);
			} else {
				this.logService.info(logMsg);
			}

			this._accountStatus = accountStatus;
			this.accountStatusContext.set(accountStatus);
			this._onDidChangeAccountStatus.fire(accountStatus);
		}
	}

	async turnOn(): Promise<void> {
		if (!this.authenticationProviders.length) {
			throw new Error(localize('no authentication providers', "Settings sync cannot be turned on because there are no authentication providers available."));
		}
		if (this.userDataSyncEnablementService.isEnabled()) {
			return;
		}
		if (this.userDataSyncService.status !== SyncStatus.Idle) {
			throw new Error('Cannot turn on sync while syncing');
		}

		const picked = await this.pick();
		if (!picked) {
			throw new CancellationError();
		}

		// User did not pick an account or login failed
		if (this.accountStatus !== AccountStatus.Available) {
			throw new Error(localize('no account', "No account available"));
		}

		const turnOnSyncCancellationToken = this.turnOnSyncCancellationToken = new CancellationTokenSource();
		const disposable = isWeb ? Disposable.None : this.lifecycleService.onBeforeShutdown(e => e.veto((async () => {
			const { confirmed } = await this.dialogService.confirm({
				type: 'warning',
				message: localize('sync in progress', "Settings Sync is being turned on. Would you like to cancel it?"),
				title: localize('settings sync', "Settings Sync"),
				primaryButton: localize({ key: 'yes', comment: ['&& denotes a mnemonic'] }, "&&Yes"),
				cancelButton: localize('no', "No")
			});
			if (confirmed) {
				turnOnSyncCancellationToken.cancel();
			}
			return !confirmed;
		})(), 'veto.settingsSync'));
		try {
			await this.doTurnOnSync(turnOnSyncCancellationToken.token);
		} finally {
			disposable.dispose();
			this.turnOnSyncCancellationToken = undefined;
		}
		await this.userDataAutoSyncService.turnOn();

		if (this.userDataSyncStoreManagementService.userDataSyncStore?.canSwitch) {
			await this.synchroniseUserDataSyncStoreType();
		}

		this.currentAuthenticationProviderId = this.current?.authenticationProviderId;
		if (this.environmentService.options?.settingsSyncOptions?.enablementHandler && this.currentAuthenticationProviderId) {
			this.environmentService.options.settingsSyncOptions.enablementHandler(true, this.currentAuthenticationProviderId);
		}

		this.notificationService.info(localize('sync turned on', "{0} is turned on", SYNC_TITLE.value));
		this._onDidTurnOnSync.fire();
	}

	async turnoff(everywhere: boolean): Promise<void> {
		if (this.userDataSyncEnablementService.isEnabled()) {
			await this.userDataAutoSyncService.turnOff(everywhere);
			if (this.environmentService.options?.settingsSyncOptions?.enablementHandler && this.currentAuthenticationProviderId) {
				this.environmentService.options.settingsSyncOptions.enablementHandler(false, this.currentAuthenticationProviderId);
			}
		}
		if (this.turnOnSyncCancellationToken) {
			this.turnOnSyncCancellationToken.cancel();
		}
	}

	async synchroniseUserDataSyncStoreType(): Promise<void> {
		if (!this.userDataSyncAccountService.account) {
			throw new Error('Cannot update because you are signed out from settings sync. Please sign in and try again.');
		}
		if (!isWeb || !this.userDataSyncStoreManagementService.userDataSyncStore) {
			// Not supported
			return;
		}

		const userDataSyncStoreUrl = this.userDataSyncStoreManagementService.userDataSyncStore.type === 'insiders' ? this.userDataSyncStoreManagementService.userDataSyncStore.stableUrl : this.userDataSyncStoreManagementService.userDataSyncStore.insidersUrl;
		const userDataSyncStoreClient = this.instantiationService.createInstance(UserDataSyncStoreClient, userDataSyncStoreUrl);
		userDataSyncStoreClient.setAuthToken(this.userDataSyncAccountService.account.token, this.userDataSyncAccountService.account.authenticationProviderId);
		await this.instantiationService.createInstance(UserDataSyncStoreTypeSynchronizer, userDataSyncStoreClient).sync(this.userDataSyncStoreManagementService.userDataSyncStore.type);
	}

	syncNow(): Promise<void> {
		return this.userDataAutoSyncService.triggerSync(['Sync Now'], { immediately: true, disableCache: true });
	}

	private async doTurnOnSync(token: CancellationToken): Promise<void> {
		const disposables = new DisposableStore();
		const manualSyncTask = await this.userDataSyncService.createManualSyncTask();
		try {
			await this.progressService.withProgress({
				location: ProgressLocation.Window,
				title: SYNC_TITLE.value,
				command: SHOW_SYNC_LOG_COMMAND_ID,
				delay: 500,
			}, async progress => {
				progress.report({ message: localize('turning on', "Turning on...") });
				disposables.add(this.userDataSyncService.onDidChangeStatus(status => {
					if (status === SyncStatus.HasConflicts) {
						progress.report({ message: localize('resolving conflicts', "Resolving conflicts...") });
					} else {
						progress.report({ message: localize('syncing...', "Turning on...") });
					}
				}));
				await manualSyncTask.merge();
				if (this.userDataSyncService.status === SyncStatus.HasConflicts) {
					await this.handleConflictsWhileTurningOn(token);
				}
				await manualSyncTask.apply();
			});
		} catch (error) {
			await manualSyncTask.stop();
			throw error;
		} finally {
			disposables.dispose();
		}
	}

	private async handleConflictsWhileTurningOn(token: CancellationToken): Promise<void> {
		const conflicts = this.userDataSyncService.conflicts;
		const andSeparator = localize('and', ' and ');
		let conflictsText = '';
		for (let i = 0; i < conflicts.length; i++) {
			if (i === conflicts.length - 1 && i !== 0) {
				conflictsText += andSeparator;
			} else if (i !== 0) {
				conflictsText += ', ';
			}
			conflictsText += getSyncAreaLabel(conflicts[i].syncResource);
		}
		const singleConflictResource = conflicts.length === 1 ? getSyncAreaLabel(conflicts[0].syncResource) : undefined;
		await this.dialogService.prompt({
			type: Severity.Warning,
			message: localize('conflicts detected', "Conflicts Detected in {0}", conflictsText),
			detail: localize('resolve', "Please resolve conflicts to turn on..."),
			buttons: [
				{
					label: localize({ key: 'show conflicts', comment: ['&& denotes a mnemonic'] }, "&&Show Conflicts"),
					run: async () => {
						const waitUntilConflictsAreResolvedPromise = raceCancellationError(Event.toPromise(Event.filter(this.userDataSyncService.onDidChangeConflicts, conficts => conficts.length === 0)), token);
						await this.showConflicts(this.userDataSyncService.conflicts[0]?.conflicts[0]);
						await waitUntilConflictsAreResolvedPromise;
					}
				},
				{
					label: singleConflictResource ? localize({ key: 'replace local single', comment: ['&& denotes a mnemonic'] }, "Accept &&Remote {0}", singleConflictResource) : localize({ key: 'replace local', comment: ['&& denotes a mnemonic'] }, "Accept &&Remote"),
					run: async () => this.replace(true)
				},
				{
					label: singleConflictResource ? localize({ key: 'replace remote single', comment: ['&& denotes a mnemonic'] }, "Accept &&Local {0}", singleConflictResource) : localize({ key: 'replace remote', comment: ['&& denotes a mnemonic'] }, "Accept &&Local"),
					run: () => this.replace(false)
				},
			],
			cancelButton: {
				run: () => {
					throw new CancellationError();
				}
			}
		});
	}

	private async replace(local: boolean): Promise<void> {
		for (const conflict of this.userDataSyncService.conflicts) {
			for (const preview of conflict.conflicts) {
				await this.accept({ syncResource: conflict.syncResource, profile: conflict.profile }, local ? preview.remoteResource : preview.localResource, undefined, { force: true });
			}
		}
	}

	async accept(resource: IUserDataSyncResource, conflictResource: URI, content: string | null | undefined, apply: boolean | { force: boolean }): Promise<void> {
		return this.userDataSyncService.accept(resource, conflictResource, content, apply);
	}

	async showConflicts(conflictToOpen?: IResourcePreview): Promise<void> {
		if (!this.userDataSyncService.conflicts.length) {
			return;
		}
		this.enableConflictsViewContext.set(true);
		const view = await this.viewsService.openView<IUserDataSyncConflictsView>(SYNC_CONFLICTS_VIEW_ID);
		if (view && conflictToOpen) {
			await view.open(conflictToOpen);
		}
	}

	async resetSyncedData(): Promise<void> {
		const { confirmed } = await this.dialogService.confirm({
			type: 'info',
			message: localize('reset', "This will clear your data in the cloud and stop sync on all your devices."),
			title: localize('reset title', "Clear"),
			primaryButton: localize({ key: 'resetButton', comment: ['&& denotes a mnemonic'] }, "&&Reset"),
		});
		if (confirmed) {
			await this.userDataSyncService.resetRemote();
		}
	}

	async getAllLogResources(): Promise<URI[]> {
		const logsFolders: URI[] = [];
		const stat = await this.fileService.resolve(this.uriIdentityService.extUri.dirname(this.environmentService.logsHome));
		if (stat.children) {
			logsFolders.push(...stat.children
				.filter(stat => stat.isDirectory && /^\d{8}T\d{6}$/.test(stat.name))
				.sort()
				.reverse()
				.map(d => d.resource));
		}
		const result: URI[] = [];
		for (const logFolder of logsFolders) {
			const folderStat = await this.fileService.resolve(logFolder);
			const childStat = folderStat.children?.find(stat => this.uriIdentityService.extUri.basename(stat.resource).startsWith(`${USER_DATA_SYNC_LOG_ID}.`));
			if (childStat) {
				result.push(childStat.resource);
			}
		}
		return result;
	}

	async showSyncActivity(): Promise<void> {
		this.activityViewsEnablementContext.set(true);
		await this.waitForActiveSyncViews();
		await this.viewsService.openViewContainer(SYNC_VIEW_CONTAINER_ID);
	}

	async downloadSyncActivity(): Promise<URI | undefined> {
		const result = await this.fileDialogService.showOpenDialog({
			title: localize('download sync activity dialog title', "Select folder to download Settings Sync activity"),
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: localize('download sync activity dialog open label', "Save"),
		});

		if (!result?.[0]) {
			return;
		}

		return this.progressService.withProgress({ location: ProgressLocation.Window }, async () => {
			const machines = await this.userDataSyncMachinesService.getMachines();
			const currentMachine = machines.find(m => m.isCurrent);
			const name = (currentMachine ? currentMachine.name + ' - ' : '') + 'Settings Sync Activity';
			const stat = await this.fileService.resolve(result[0]);

			const nameRegEx = new RegExp(`${escapeRegExpCharacters(name)}\\s(\\d+)`);
			const indexes: number[] = [];
			for (const child of stat.children ?? []) {
				if (child.name === name) {
					indexes.push(0);
				} else {
					const matches = nameRegEx.exec(child.name);
					if (matches) {
						indexes.push(parseInt(matches[1]));
					}
				}
			}
			indexes.sort((a, b) => a - b);

			const folder = this.uriIdentityService.extUri.joinPath(result[0], indexes[0] !== 0 ? name : `${name} ${indexes[indexes.length - 1] + 1}`);
			await Promise.all([
				this.userDataSyncService.saveRemoteActivityData(this.uriIdentityService.extUri.joinPath(folder, 'remoteActivity.json')),
				(async () => {
					const logResources = await this.getAllLogResources();
					await Promise.all(logResources.map(async logResource => this.fileService.copy(logResource, this.uriIdentityService.extUri.joinPath(folder, 'logs', `${this.uriIdentityService.extUri.basename(this.uriIdentityService.extUri.dirname(logResource))}.log`))));
				})(),
				this.fileService.copy(this.environmentService.userDataSyncHome, this.uriIdentityService.extUri.joinPath(folder, 'localActivity')),
			]);
			return folder;
		});
	}

	private async waitForActiveSyncViews(): Promise<void> {
		const viewContainer = this.viewDescriptorService.getViewContainerById(SYNC_VIEW_CONTAINER_ID);
		if (viewContainer) {
			const model = this.viewDescriptorService.getViewContainerModel(viewContainer);
			if (!model.activeViewDescriptors.length) {
				await Event.toPromise(Event.filter(model.onDidChangeActiveViewDescriptors, e => model.activeViewDescriptors.length > 0));
			}
		}
	}

	async signIn(): Promise<void> {
		const currentAuthenticationProviderId = this.currentAuthenticationProviderId;
		const authenticationProvider = currentAuthenticationProviderId ? this.authenticationProviders.find(p => p.id === currentAuthenticationProviderId) : undefined;
		if (authenticationProvider) {
			await this.doSignIn(authenticationProvider);
		} else {
			if (!this.authenticationProviders.length) {
				throw new Error(localize('no authentication providers during signin', "Cannot sign in because there are no authentication providers available."));
			}
			await this.pick();
		}
	}

	private async pick(): Promise<boolean> {
		const result = await this.doPick();
		if (!result) {
			return false;
		}
		await this.doSignIn(result);
		return true;
	}

	private async doPick(): Promise<UserDataSyncAccount | IAuthenticationProvider | undefined> {
		if (this.authenticationProviders.length === 0) {
			return undefined;
		}

		const authenticationProviders = [...this.authenticationProviders].sort(({ id }) => id === this.currentAuthenticationProviderId ? -1 : 1);
		const allAccounts = new Map<string, UserDataSyncAccount[]>();

		if (authenticationProviders.length === 1) {
			const accounts = await this.getAccounts(authenticationProviders[0].id, authenticationProviders[0].scopes);
			if (accounts.length) {
				allAccounts.set(authenticationProviders[0].id, accounts);
			} else {
				// Single auth provider and no accounts
				return authenticationProviders[0];
			}
		}

		let result: UserDataSyncAccount | IAuthenticationProvider | undefined;
		const disposables: DisposableStore = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick<AccountQuickPickItem>({ useSeparators: true }));

		const promise = new Promise<UserDataSyncAccount | IAuthenticationProvider | undefined>(c => {
			disposables.add(quickPick.onDidHide(() => {
				disposables.dispose();
				c(result);
			}));
		});

		quickPick.title = SYNC_TITLE.value;
		quickPick.ok = false;
		quickPick.ignoreFocusOut = true;
		quickPick.placeholder = localize('choose account placeholder', "Select an account to sign in");
		quickPick.show();

		if (authenticationProviders.length > 1) {
			quickPick.busy = true;
			for (const { id, scopes } of authenticationProviders) {
				const accounts = await this.getAccounts(id, scopes);
				if (accounts.length) {
					allAccounts.set(id, accounts);
				}
			}
			quickPick.busy = false;
		}

		quickPick.items = this.createQuickpickItems(authenticationProviders, allAccounts);
		disposables.add(quickPick.onDidAccept(() => {
			result = quickPick.selectedItems[0]?.account ? quickPick.selectedItems[0]?.account : quickPick.selectedItems[0]?.authenticationProvider;
			quickPick.hide();
		}));

		return promise;
	}

	private async getAccounts(authenticationProviderId: string, scopes: string[]): Promise<UserDataSyncAccount[]> {
		const accounts: Map<string, UserDataSyncAccount> = new Map<string, UserDataSyncAccount>();
		let currentAccount: UserDataSyncAccount | null = null;

		const sessions = await this.authenticationService.getSessions(authenticationProviderId, scopes) || [];
		for (const session of sessions) {
			const account: UserDataSyncAccount = new UserDataSyncAccount(authenticationProviderId, session);
			accounts.set(account.accountId, account);
			if (account.sessionId === this.currentSessionId) {
				currentAccount = account;
			}
		}

		if (currentAccount) {
			// Always use current account if available
			accounts.set(currentAccount.accountId, currentAccount);
		}

		return currentAccount ? [...accounts.values()] : [...accounts.values()].sort(({ sessionId }) => sessionId === this.currentSessionId ? -1 : 1);
	}

	private createQuickpickItems(authenticationProviders: IAuthenticationProvider[], allAccounts: Map<string, UserDataSyncAccount[]>): (AccountQuickPickItem | IQuickPickSeparator)[] {
		const quickPickItems: (AccountQuickPickItem | IQuickPickSeparator)[] = [];

		// Signed in Accounts
		if (allAccounts.size) {
			quickPickItems.push({ type: 'separator', label: localize('signed in', "Signed in") });
			for (const authenticationProvider of authenticationProviders) {
				const accounts = (allAccounts.get(authenticationProvider.id) || []).sort(({ sessionId }) => sessionId === this.currentSessionId ? -1 : 1);
				const providerName = this.authenticationService.getProvider(authenticationProvider.id).label;
				for (const account of accounts) {
					quickPickItems.push({
						label: `${account.accountName} (${providerName})`,
						description: account.sessionId === this.current?.sessionId ? localize('last used', "Last Used with Sync") : undefined,
						account,
						authenticationProvider,
					});
				}
			}
			quickPickItems.push({ type: 'separator', label: localize('others', "Others") });
		}

		// Account Providers
		for (const authenticationProvider of authenticationProviders) {
			const provider = this.authenticationService.getProvider(authenticationProvider.id);
			if (!allAccounts.has(authenticationProvider.id) || provider.supportsMultipleAccounts) {
				const providerName = provider.label;
				quickPickItems.push({ label: localize('sign in using account', "Sign in with {0}", providerName), authenticationProvider });
			}
		}

		return quickPickItems;
	}

	private async doSignIn(accountOrAuthProvider: UserDataSyncAccount | IAuthenticationProvider): Promise<void> {
		let sessionId: string;
		if (isAuthenticationProvider(accountOrAuthProvider)) {
			if (this.environmentService.options?.settingsSyncOptions?.authenticationProvider?.id === accountOrAuthProvider.id) {
				sessionId = await this.environmentService.options?.settingsSyncOptions?.authenticationProvider?.signIn();
			} else {
				sessionId = (await this.authenticationService.createSession(accountOrAuthProvider.id, accountOrAuthProvider.scopes)).id;
			}
			this.currentAuthenticationProviderId = accountOrAuthProvider.id;
		} else {
			if (this.environmentService.options?.settingsSyncOptions?.authenticationProvider?.id === accountOrAuthProvider.authenticationProviderId) {
				sessionId = await this.environmentService.options?.settingsSyncOptions?.authenticationProvider?.signIn();
			} else {
				sessionId = accountOrAuthProvider.sessionId;
			}
			this.currentAuthenticationProviderId = accountOrAuthProvider.authenticationProviderId;
		}
		this.currentSessionId = sessionId;
		await this.update('sign in');
	}

	private async onDidAuthFailure(): Promise<void> {
		this.currentSessionId = undefined;
		await this.update('auth failure');
	}

	private onDidChangeSessions(e: AuthenticationSessionsChangeEvent): void {
		if (this.currentSessionId && e.removed?.find(session => session.id === this.currentSessionId)) {
			this.currentSessionId = undefined;
		}
		this.update('change in sessions');
	}

	private onDidChangeStorage(): void {
		if (this.currentSessionId !== this.getStoredCachedSessionId() /* This checks if current window changed the value or not */) {
			this._cachedCurrentSessionId = null;
			this.update('change in storage');
		}
	}

	private _cachedCurrentAuthenticationProviderId: string | undefined | null = null;
	private get currentAuthenticationProviderId(): string | undefined {
		if (this._cachedCurrentAuthenticationProviderId === null) {
			this._cachedCurrentAuthenticationProviderId = this.storageService.get(UserDataSyncWorkbenchService.CACHED_AUTHENTICATION_PROVIDER_KEY, StorageScope.APPLICATION);
		}
		return this._cachedCurrentAuthenticationProviderId;
	}

	private set currentAuthenticationProviderId(currentAuthenticationProviderId: string | undefined) {
		if (this._cachedCurrentAuthenticationProviderId !== currentAuthenticationProviderId) {
			this._cachedCurrentAuthenticationProviderId = currentAuthenticationProviderId;
			if (currentAuthenticationProviderId === undefined) {
				this.storageService.remove(UserDataSyncWorkbenchService.CACHED_AUTHENTICATION_PROVIDER_KEY, StorageScope.APPLICATION);
			} else {
				this.storageService.store(UserDataSyncWorkbenchService.CACHED_AUTHENTICATION_PROVIDER_KEY, currentAuthenticationProviderId, StorageScope.APPLICATION, StorageTarget.MACHINE);
			}
		}
	}

	private _cachedCurrentSessionId: string | undefined | null = null;
	private get currentSessionId(): string | undefined {
		if (this._cachedCurrentSessionId === null) {
			this._cachedCurrentSessionId = this.getStoredCachedSessionId();
		}
		return this._cachedCurrentSessionId;
	}

	private set currentSessionId(cachedSessionId: string | undefined) {
		if (this._cachedCurrentSessionId !== cachedSessionId) {
			this._cachedCurrentSessionId = cachedSessionId;
			if (cachedSessionId === undefined) {
				this.logService.info('Settings Sync: Reset current session');
				this.storageService.remove(UserDataSyncWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
			} else {
				this.logService.info('Settings Sync: Updated current session', cachedSessionId);
				this.storageService.store(UserDataSyncWorkbenchService.CACHED_SESSION_STORAGE_KEY, cachedSessionId, StorageScope.APPLICATION, StorageTarget.MACHINE);
			}
		}
	}

	private getStoredCachedSessionId(): string | undefined {
		return this.storageService.get(UserDataSyncWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
	}

	private get useWorkbenchSessionId(): boolean {
		return !this.storageService.getBoolean(UserDataSyncWorkbenchService.DONOT_USE_WORKBENCH_SESSION_STORAGE_KEY, StorageScope.APPLICATION, false);
	}

	private set useWorkbenchSessionId(useWorkbenchSession: boolean) {
		this.storageService.store(UserDataSyncWorkbenchService.DONOT_USE_WORKBENCH_SESSION_STORAGE_KEY, !useWorkbenchSession, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

}

registerSingleton(IUserDataSyncWorkbenchService, UserDataSyncWorkbenchService, InstantiationType.Eager /* Eager because it initializes settings sync accounts */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/browser/webUserDataSyncEnablementService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/browser/webUserDataSyncEnablementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUserDataSyncEnablementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { UserDataSyncEnablementService } from './userDataSyncEnablementService.js';

export class WebUserDataSyncEnablementService extends UserDataSyncEnablementService implements IUserDataSyncEnablementService {

	private enabled: boolean | undefined = undefined;

	override canToggleEnablement(): boolean {
		return this.isTrusted() && super.canToggleEnablement();
	}

	override isEnabled(): boolean {
		if (!this.isTrusted()) {
			return false;
		}
		if (this.enabled === undefined) {
			this.enabled = this.workbenchEnvironmentService.options?.settingsSyncOptions?.enabled;
		}
		if (this.enabled === undefined) {
			this.enabled = super.isEnabled();
		}
		return this.enabled;
	}

	override setEnablement(enabled: boolean) {
		if (enabled && !this.canToggleEnablement()) {
			return;
		}
		if (this.enabled !== enabled) {
			this.enabled = enabled;
			super.setEnablement(enabled);
		}
	}

	override getResourceSyncStateVersion(resource: SyncResource): string | undefined {
		return resource === SyncResource.Extensions ? this.workbenchEnvironmentService.options?.settingsSyncOptions?.extensionsSyncStateVersion : undefined;
	}

	private isTrusted(): boolean {
		return !!this.workbenchEnvironmentService.options?.workspaceProvider?.trusted;
	}

}

registerSingleton(IUserDataSyncEnablementService, WebUserDataSyncEnablementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/common/userDataSync.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/common/userDataSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuthenticationProvider, SyncStatus, SyncResource, IUserDataSyncResource, IResourcePreview } from '../../../../platform/userDataSync/common/userDataSync.js';
import { Event } from '../../../../base/common/event.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { localize, localize2 } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IView } from '../../../common/views.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IAction2Options } from '../../../../platform/actions/common/actions.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';

export interface IUserDataSyncAccount {
	readonly authenticationProviderId: string;
	readonly accountName: string;
	readonly accountId: string;
}

export const IUserDataSyncWorkbenchService = createDecorator<IUserDataSyncWorkbenchService>('IUserDataSyncWorkbenchService');
export interface IUserDataSyncWorkbenchService {
	_serviceBrand: undefined;

	readonly enabled: boolean;
	readonly authenticationProviders: IAuthenticationProvider[];

	readonly current: IUserDataSyncAccount | undefined;

	readonly accountStatus: AccountStatus;
	readonly onDidChangeAccountStatus: Event<AccountStatus>;

	readonly onDidTurnOnSync: Event<void>;

	turnOn(): Promise<void>;
	turnoff(everyWhere: boolean): Promise<void>;
	signIn(): Promise<void>;

	resetSyncedData(): Promise<void>;
	showSyncActivity(): Promise<void>;
	syncNow(): Promise<void>;

	synchroniseUserDataSyncStoreType(): Promise<void>;

	showConflicts(conflictToOpen?: IResourcePreview): Promise<void>;
	accept(resource: IUserDataSyncResource, conflictResource: URI, content: string | null | undefined, apply: boolean): Promise<void>;

	getAllLogResources(): Promise<URI[]>;
	downloadSyncActivity(): Promise<URI | undefined>;
}

export function getSyncAreaLabel(source: SyncResource): string {
	switch (source) {
		case SyncResource.Settings: return localize('settings', "Settings");
		case SyncResource.Keybindings: return localize('keybindings', "Keyboard Shortcuts");
		case SyncResource.Snippets: return localize('snippets', "Snippets");
		case SyncResource.Prompts: return localize('prompts', "Prompts and Instructions");
		case SyncResource.Tasks: return localize('tasks', "Tasks");
		case SyncResource.Mcp: return localize('mcp', "MCP Servers");
		case SyncResource.Extensions: return localize('extensions', "Extensions");
		case SyncResource.GlobalState: return localize('ui state label', "UI State");
		case SyncResource.Profiles: return localize('profiles', "Profiles");
		case SyncResource.WorkspaceState: return localize('workspace state label', "Workspace State");
	}
}

export const enum AccountStatus {
	Uninitialized = 'uninitialized',
	Unavailable = 'unavailable',
	Available = 'available',
}

export interface IUserDataSyncConflictsView extends IView {
	open(conflict: IResourcePreview): Promise<void>;
}

export const SYNC_TITLE: ILocalizedString = localize2('sync category', "Settings Sync");

export const SYNC_VIEW_ICON = registerIcon('settings-sync-view-icon', Codicon.sync, localize('syncViewIcon', 'View icon of the Settings Sync view.'));

// Contexts
export const CONTEXT_SYNC_STATE = new RawContextKey<string>('syncStatus', SyncStatus.Uninitialized);
export const CONTEXT_SYNC_ENABLEMENT = new RawContextKey<boolean>('syncEnabled', false);
export const CONTEXT_ACCOUNT_STATE = new RawContextKey<string>('userDataSyncAccountStatus', AccountStatus.Uninitialized);
export const CONTEXT_ENABLE_ACTIVITY_VIEWS = new RawContextKey<boolean>(`enableSyncActivityViews`, false);
export const CONTEXT_ENABLE_SYNC_CONFLICTS_VIEW = new RawContextKey<boolean>(`enableSyncConflictsView`, false);
export const CONTEXT_HAS_CONFLICTS = new RawContextKey<boolean>('hasConflicts', false);

// Commands
export const CONFIGURE_SYNC_COMMAND_ID = 'workbench.userDataSync.actions.configure';
export const SHOW_SYNC_LOG_COMMAND_ID = 'workbench.userDataSync.actions.showLog';

// VIEWS
export const SYNC_VIEW_CONTAINER_ID = 'workbench.view.sync';
export const SYNC_CONFLICTS_VIEW_ID = 'workbench.views.sync.conflicts';

export const DOWNLOAD_ACTIVITY_ACTION_DESCRIPTOR: Readonly<IAction2Options> = {
	id: 'workbench.userDataSync.actions.downloadSyncActivity',
	title: localize2('download sync activity title', "Download Settings Sync Activity"),
	category: Categories.Developer,
	f1: true,
	precondition: ContextKeyExpr.and(CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Available), CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized))
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/common/userDataSyncUtil.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/common/userDataSyncUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IUserDataSyncUtilService, getDefaultIgnoredSettings } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { FormattingOptions } from '../../../../base/common/jsonFormatter.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITextResourcePropertiesService, ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';

class UserDataSyncUtilService implements IUserDataSyncUtilService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IKeybindingService private readonly keybindingsService: IKeybindingService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ITextResourcePropertiesService private readonly textResourcePropertiesService: ITextResourcePropertiesService,
		@ITextResourceConfigurationService private readonly textResourceConfigurationService: ITextResourceConfigurationService,
	) { }

	async resolveDefaultCoreIgnoredSettings(): Promise<string[]> {
		return getDefaultIgnoredSettings(true);
	}

	async resolveUserBindings(userBindings: string[]): Promise<IStringDictionary<string>> {
		const keys: IStringDictionary<string> = {};
		for (const userbinding of userBindings) {
			keys[userbinding] = this.keybindingsService.resolveUserBinding(userbinding).map(part => part.getUserSettingsLabel()).join(' ');
		}
		return keys;
	}

	async resolveFormattingOptions(resource: URI): Promise<FormattingOptions> {
		try {
			const modelReference = await this.textModelService.createModelReference(resource);
			const { insertSpaces, tabSize } = modelReference.object.textEditorModel.getOptions();
			const eol = modelReference.object.textEditorModel.getEOL();
			modelReference.dispose();
			return { eol, insertSpaces, tabSize };
		} catch (e) {
		}
		return {
			eol: this.textResourcePropertiesService.getEOL(resource),
			insertSpaces: !!this.textResourceConfigurationService.getValue(resource, 'editor.insertSpaces'),
			tabSize: this.textResourceConfigurationService.getValue(resource, 'editor.tabSize')
		};
	}

}

registerSingleton(IUserDataSyncUtilService, UserDataSyncUtilService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/electron-browser/userDataAutoSyncService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/electron-browser/userDataAutoSyncService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUserDataAutoSyncService, SyncOptions, UserDataSyncError } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { Event } from '../../../../base/common/event.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

class UserDataAutoSyncService implements IUserDataAutoSyncService {

	declare readonly _serviceBrand: undefined;

	private readonly channel: IChannel;
	get onError(): Event<UserDataSyncError> { return Event.map(this.channel.listen<Error>('onError'), e => UserDataSyncError.toUserDataSyncError(e)); }

	constructor(
		@ISharedProcessService sharedProcessService: ISharedProcessService,
	) {
		this.channel = sharedProcessService.getChannel('userDataAutoSync');
	}

	triggerSync(sources: string[], options?: SyncOptions): Promise<void> {
		return this.channel.call('triggerSync', [sources, options]);
	}

	turnOn(): Promise<void> {
		return this.channel.call('turnOn');
	}

	turnOff(everywhere: boolean): Promise<void> {
		return this.channel.call('turnOff', [everywhere]);
	}

}

registerSingleton(IUserDataAutoSyncService, UserDataAutoSyncService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataSync/electron-browser/userDataSyncService.ts]---
Location: vscode-main/src/vs/workbench/services/userDataSync/electron-browser/userDataSyncService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUserDataSyncResourceProviderService, IUserDataSyncService, IUserDataSyncStoreManagementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { UserDataSyncServiceChannelClient } from '../../../../platform/userDataSync/common/userDataSyncServiceIpc.js';
import { IUserDataSyncMachinesService } from '../../../../platform/userDataSync/common/userDataSyncMachines.js';
import { UserDataSyncAccountServiceChannelClient, UserDataSyncStoreManagementServiceChannelClient } from '../../../../platform/userDataSync/common/userDataSyncIpc.js';
import { IUserDataSyncAccountService } from '../../../../platform/userDataSync/common/userDataSyncAccount.js';

registerSharedProcessRemoteService(IUserDataSyncService, 'userDataSync', { channelClientCtor: UserDataSyncServiceChannelClient });
registerSharedProcessRemoteService(IUserDataSyncResourceProviderService, 'IUserDataSyncResourceProviderService');
registerSharedProcessRemoteService(IUserDataSyncMachinesService, 'userDataSyncMachines');
registerSharedProcessRemoteService(IUserDataSyncAccountService, 'userDataSyncAccount', { channelClientCtor: UserDataSyncAccountServiceChannelClient });
registerSharedProcessRemoteService(IUserDataSyncStoreManagementService, 'userDataSyncStoreManagement', { channelClientCtor: UserDataSyncStoreManagementServiceChannelClient });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.ts]---
Location: vscode-main/src/vs/workbench/services/utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../platform/log/common/log.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { Client as MessagePortClient } from '../../../../base/parts/ipc/common/ipc.mp.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IPCClient, ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { acquirePort } from '../../../../base/parts/ipc/electron-browser/ipc.mp.js';
import { IOnDidTerminateUtilityrocessWorkerProcess, ipcUtilityProcessWorkerChannelName, IUtilityProcessWorkerProcess, IUtilityProcessWorkerService } from '../../../../platform/utilityProcess/common/utilityProcessWorkerService.js';
import { Barrier, timeout } from '../../../../base/common/async.js';

export const IUtilityProcessWorkerWorkbenchService = createDecorator<IUtilityProcessWorkerWorkbenchService>('utilityProcessWorkerWorkbenchService');

export interface IUtilityProcessWorker extends IDisposable {

	/**
	 * A IPC client to communicate to the worker process.
	 */
	client: IPCClient<string>;

	/**
	 * A promise that resolves to an object once the
	 * worker process terminates, giving information
	 * how the process terminated.
	 *
	 * This can be used to figure out whether the worker
	 * should be restarted in case of an unexpected
	 * termination.
	 */
	onDidTerminate: Promise<IOnDidTerminateUtilityrocessWorkerProcess>;
}

export interface IUtilityProcessWorkerWorkbenchService {

	readonly _serviceBrand: undefined;

	/**
	 * Will fork a new process with the provided module identifier in a utility
	 * process and establishes a message port connection to that process.
	 *
	 * Requires the forked process to be ES module that uses our IPC channel framework
	 * to respond to the provided `channelName` as a server.
	 *
	 * The process will be automatically terminated when the workbench window closes,
	 * crashes or loads/reloads.
	 *
	 * Note on affinity: repeated calls to `createWorkerChannel` with the same `moduleId`
	 * from the same window will result in any previous forked process to get terminated.
	 * In other words, it is not possible, nor intended to create multiple workers of
	 * the same process from one window. The intent of these workers is to be reused per
	 * window and the communication channel allows to dynamically update the processes
	 * after the fact.
	 *
	 * @param process information around the process to fork as worker
	 *
	 * @returns the worker IPC client to communicate with. Provides a `dispose` method that
	 * allows to terminate the worker if needed.
	 */
	createWorker(process: IUtilityProcessWorkerProcess): Promise<IUtilityProcessWorker>;

	/**
	 * Notifies the service that the workbench window has restored.
	 */
	notifyRestored(): void;
}

export class UtilityProcessWorkerWorkbenchService extends Disposable implements IUtilityProcessWorkerWorkbenchService {

	declare readonly _serviceBrand: undefined;

	private _utilityProcessWorkerService: IUtilityProcessWorkerService | undefined = undefined;
	private get utilityProcessWorkerService(): IUtilityProcessWorkerService {
		if (!this._utilityProcessWorkerService) {
			const channel = this.mainProcessService.getChannel(ipcUtilityProcessWorkerChannelName);
			this._utilityProcessWorkerService = ProxyChannel.toService<IUtilityProcessWorkerService>(channel);
		}

		return this._utilityProcessWorkerService;
	}

	private readonly restoredBarrier = new Barrier();

	constructor(
		readonly windowId: number,
		@ILogService private readonly logService: ILogService,
		@IMainProcessService private readonly mainProcessService: IMainProcessService
	) {
		super();
	}

	async createWorker(process: IUtilityProcessWorkerProcess): Promise<IUtilityProcessWorker> {
		this.logService.trace('Renderer->UtilityProcess#createWorker');

		// We want to avoid heavy utility process work to happen before
		// the window has restored. As such, make sure we await the
		// `Restored` phase before making a connection attempt, but also
		// add a timeout to be safe against possible deadlocks.

		await Promise.race([this.restoredBarrier.wait(), timeout(2000)]);

		// Get ready to acquire the message port from the utility process worker
		const nonce = generateUuid();
		const responseChannel = 'vscode:createUtilityProcessWorkerMessageChannelResult';
		const portPromise = acquirePort(undefined /* we trigger the request via service call! */, responseChannel, nonce);

		// Actually talk with the utility process service
		// to create a new process from a worker
		const onDidTerminate = this.utilityProcessWorkerService.createWorker({
			process,
			reply: { windowId: this.windowId, channel: responseChannel, nonce }
		});

		// Dispose worker upon disposal via utility process service
		const disposables = new DisposableStore();
		disposables.add(toDisposable(() => {
			this.logService.trace('Renderer->UtilityProcess#disposeWorker', process);

			this.utilityProcessWorkerService.disposeWorker({
				process,
				reply: { windowId: this.windowId }
			});
		}));

		const port = await portPromise;
		const client = disposables.add(new MessagePortClient(port, `window:${this.windowId},module:${process.moduleId}`));
		this.logService.trace('Renderer->UtilityProcess#createWorkerChannel: connection established');

		onDidTerminate.then(({ reason }) => {
			if (reason?.code === 0) {
				this.logService.trace(`[UtilityProcessWorker]: terminated normally with code ${reason.code}, signal: ${reason.signal}`);
			} else {
				this.logService.error(`[UtilityProcessWorker]: terminated unexpectedly with code ${reason?.code}, signal: ${reason?.signal}`);
			}
		});

		return { client, onDidTerminate, dispose: () => disposables.dispose() };
	}

	notifyRestored(): void {
		if (!this.restoredBarrier.isOpen()) {
			this.restoredBarrier.open();
		}
	}
}
```

--------------------------------------------------------------------------------

````

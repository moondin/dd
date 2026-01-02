---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 375
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 375 of 552)

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

---[FILE: src/vs/workbench/contrib/customEditor/browser/customEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/browser/customEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../../base/browser/dom.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { toAction } from '../../../../base/common/actions.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IReference } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename } from '../../../../base/common/path.js';
import { dirname, isEqual } from '../../../../base/common/resources.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { EditorInputCapabilities, GroupIdentifier, IMoveResult, IRevertOptions, ISaveOptions, IUntypedEditorInput, Verbosity, createEditorOpenError } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';
import { ICustomEditorModel, ICustomEditorService } from '../common/customEditor.js';
import { IOverlayWebview, IWebviewService } from '../../webview/browser/webview.js';
import { IWebviewWorkbenchService, LazilyResolvedWebviewEditorInput } from '../../webviewPanel/browser/webviewWorkbenchService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IUntitledTextEditorService } from '../../../services/untitled/common/untitledTextEditorService.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { WebviewIconPath } from '../../webviewPanel/browser/webviewEditorInput.js';

interface CustomEditorInputInitInfo {
	readonly resource: URI;
	readonly viewType: string;
	readonly webviewTitle: string | undefined;
	readonly iconPath: WebviewIconPath | undefined;
}

export class CustomEditorInput extends LazilyResolvedWebviewEditorInput {

	static create(
		instantiationService: IInstantiationService,
		init: CustomEditorInputInitInfo,
		group: GroupIdentifier | undefined,
		options?: { readonly customClasses?: string; readonly oldResource?: URI },
	): EditorInput {
		return instantiationService.invokeFunction(accessor => {
			// If it's an untitled file we must populate the untitledDocumentData
			const untitledString = accessor.get(IUntitledTextEditorService).getValue(init.resource);
			const untitledDocumentData = untitledString ? VSBuffer.fromString(untitledString) : undefined;
			const webview = accessor.get(IWebviewService).createWebviewOverlay({
				providedViewType: init.viewType,
				title: init.webviewTitle,
				options: { customClasses: options?.customClasses },
				contentOptions: {},
				extension: undefined,
			});
			const input = instantiationService.createInstance(CustomEditorInput, init, webview, { untitledDocumentData: untitledDocumentData, oldResource: options?.oldResource });
			if (typeof group !== 'undefined') {
				input.updateGroup(group);
			}
			return input;
		});
	}

	public static override readonly typeId = 'workbench.editors.webviewEditor';

	private readonly _editorResource: URI;
	public readonly oldResource?: URI;
	private _defaultDirtyState: boolean | undefined;

	private _editorName: string | undefined = undefined;

	private readonly _backupId: string | undefined;

	private readonly _untitledDocumentData: VSBuffer | undefined;

	override get resource() { return this._editorResource; }

	private _modelRef?: IReference<ICustomEditorModel>;

	constructor(
		init: CustomEditorInputInitInfo,
		webview: IOverlayWebview,
		options: { startsDirty?: boolean; backupId?: string; untitledDocumentData?: VSBuffer; readonly oldResource?: URI },
		@IThemeService themeService: IThemeService,
		@IWebviewWorkbenchService webviewWorkbenchService: IWebviewWorkbenchService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILabelService private readonly labelService: ILabelService,
		@ICustomEditorService private readonly customEditorService: ICustomEditorService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IUndoRedoService private readonly undoRedoService: IUndoRedoService,
		@IFileService private readonly fileService: IFileService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@ICustomEditorLabelService private readonly customEditorLabelService: ICustomEditorLabelService,
	) {
		super({ providedId: init.viewType, viewType: init.viewType, name: '', iconPath: init.iconPath }, webview, themeService, webviewWorkbenchService);
		this._editorResource = init.resource;
		this.oldResource = options.oldResource;
		this._defaultDirtyState = options.startsDirty;
		this._backupId = options.backupId;
		this._untitledDocumentData = options.untitledDocumentData;

		this.registerListeners();
	}

	private registerListeners(): void {
		// Clear our labels on certain label related events
		this._register(this.labelService.onDidChangeFormatters(e => this.onLabelEvent(e.scheme)));
		this._register(this.fileService.onDidChangeFileSystemProviderRegistrations(e => this.onLabelEvent(e.scheme)));
		this._register(this.fileService.onDidChangeFileSystemProviderCapabilities(e => this.onLabelEvent(e.scheme)));
		this._register(this.customEditorLabelService.onDidChange(() => this.updateLabel()));
		this._register(this.filesConfigurationService.onDidChangeReadonly(() => this._onDidChangeCapabilities.fire()));
	}

	private onLabelEvent(scheme: string): void {
		if (scheme === this.resource.scheme) {
			this.updateLabel();
		}
	}

	private updateLabel(): void {

		// Clear any cached labels from before
		this._editorName = undefined;
		this._shortDescription = undefined;
		this._mediumDescription = undefined;
		this._longDescription = undefined;
		this._shortTitle = undefined;
		this._mediumTitle = undefined;
		this._longTitle = undefined;

		// Trigger recompute of label
		this._onDidChangeLabel.fire();
	}

	public override get typeId(): string {
		return CustomEditorInput.typeId;
	}

	public override get editorId() {
		return this.viewType;
	}

	public override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.None;

		capabilities |= EditorInputCapabilities.CanDropIntoEditor;

		if (!this.customEditorService.getCustomEditorCapabilities(this.viewType)?.supportsMultipleEditorsPerDocument) {
			capabilities |= EditorInputCapabilities.Singleton;
		}

		if (this._modelRef) {
			if (this._modelRef.object.isReadonly()) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		} else {
			if (this.filesConfigurationService.isReadonly(this.resource)) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		}

		if (this.resource.scheme === Schemas.untitled) {
			capabilities |= EditorInputCapabilities.Untitled;
		}

		return capabilities;
	}

	override getName(): string {
		const customTitle = this.getWebviewTitle();
		if (customTitle) {
			return customTitle;
		}

		this._editorName ??= this.customEditorLabelService.getName(this.resource) ?? basename(this.labelService.getUriLabel(this.resource));
		return this._editorName;
	}

	override getDescription(verbosity = Verbosity.MEDIUM): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.shortDescription;
			case Verbosity.LONG:
				return this.longDescription;
			case Verbosity.MEDIUM:
			default:
				return this.mediumDescription;
		}
	}

	private _shortDescription: string | undefined = undefined;
	private get shortDescription(): string {
		this._shortDescription ??= this.labelService.getUriBasenameLabel(dirname(this.resource));
		return this._shortDescription;
	}

	private _mediumDescription: string | undefined = undefined;
	private get mediumDescription(): string {
		this._mediumDescription ??= this.labelService.getUriLabel(dirname(this.resource), { relative: true });
		return this._mediumDescription;
	}

	private _longDescription: string | undefined = undefined;
	private get longDescription(): string {
		this._longDescription ??= this.labelService.getUriLabel(dirname(this.resource));
		return this._longDescription;
	}

	private _shortTitle: string | undefined = undefined;
	private get shortTitle(): string {
		this._shortTitle ??= this.getName();
		return this._shortTitle;
	}

	private _mediumTitle: string | undefined = undefined;
	private get mediumTitle(): string {
		this._mediumTitle ??= this.labelService.getUriLabel(this.resource, { relative: true });
		return this._mediumTitle;
	}

	private _longTitle: string | undefined = undefined;
	private get longTitle(): string {
		this._longTitle ??= this.labelService.getUriLabel(this.resource);
		return this._longTitle;
	}

	override getTitle(verbosity?: Verbosity): string {
		const customTitle = this.getWebviewTitle();
		if (customTitle) {
			return customTitle;
		}

		switch (verbosity) {
			case Verbosity.SHORT:
				return this.shortTitle;
			case Verbosity.LONG:
				return this.longTitle;
			default:
			case Verbosity.MEDIUM:
				return this.mediumTitle;
		}
	}

	public override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}
		return this === other || (other instanceof CustomEditorInput
			&& this.viewType === other.viewType
			&& isEqual(this.resource, other.resource));
	}

	public override copy(): EditorInput {
		return CustomEditorInput.create(this.instantiationService,
			{ resource: this.resource, viewType: this.viewType, webviewTitle: this.getWebviewTitle(), iconPath: this.iconPath, },
			this.group,
			this.webview.options);
	}

	public override isReadonly(): boolean | IMarkdownString {
		if (!this._modelRef) {
			return this.filesConfigurationService.isReadonly(this.resource);
		}
		return this._modelRef.object.isReadonly();
	}

	public override isDirty(): boolean {
		if (!this._modelRef) {
			return !!this._defaultDirtyState;
		}
		return this._modelRef.object.isDirty();
	}

	public override async save(groupId: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		if (!this._modelRef) {
			return undefined;
		}

		const target = await this._modelRef.object.saveCustomEditor(options);
		if (!target) {
			return undefined; // save cancelled
		}

		// Different URIs == untyped input returned to allow resolver to possibly resolve to a different editor type
		if (!isEqual(target, this.resource)) {
			return { resource: target };
		}

		return this;
	}

	public override async saveAs(groupId: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		if (!this._modelRef) {
			return undefined;
		}

		const dialogPath = this._editorResource;
		const target = await this.fileDialogService.pickFileToSave(dialogPath, options?.availableFileSystems);
		if (!target) {
			return undefined; // save cancelled
		}

		if (!await this._modelRef.object.saveCustomEditorAs(this._editorResource, target, options)) {
			return undefined;
		}

		return (await this.rename(groupId, target))?.editor;
	}

	public override async revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		if (this._modelRef) {
			return this._modelRef.object.revert(options);
		}
		this._defaultDirtyState = false;
		this._onDidChangeDirty.fire();
	}

	public override async resolve(): Promise<null> {
		await super.resolve();

		if (this.isDisposed()) {
			return null;
		}

		if (!this._modelRef) {
			const oldCapabilities = this.capabilities;
			this._modelRef = this._register(assertReturnsDefined(await this.customEditorService.models.tryRetain(this.resource, this.viewType)));
			this._register(this._modelRef.object.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
			this._register(this._modelRef.object.onDidChangeReadonly(() => this._onDidChangeCapabilities.fire()));
			// If we're loading untitled file data we should ensure it's dirty
			if (this._untitledDocumentData) {
				this._defaultDirtyState = true;
			}
			if (this.isDirty()) {
				this._onDidChangeDirty.fire();
			}
			if (this.capabilities !== oldCapabilities) {
				this._onDidChangeCapabilities.fire();
			}
		}

		return null;
	}

	public override async rename(group: GroupIdentifier, newResource: URI): Promise<IMoveResult | undefined> {
		// We return an untyped editor input which can then be resolved in the editor service
		return { editor: { resource: newResource } };
	}

	public undo(): void | Promise<void> {
		assertReturnsDefined(this._modelRef);
		return this.undoRedoService.undo(this.resource);
	}

	public redo(): void | Promise<void> {
		assertReturnsDefined(this._modelRef);
		return this.undoRedoService.redo(this.resource);
	}

	private _moveHandler?: (newResource: URI) => void;

	public onMove(handler: (newResource: URI) => void): void {
		// TODO: Move this to the service
		this._moveHandler = handler;
	}

	protected override transfer(other: CustomEditorInput): CustomEditorInput | undefined {
		if (!super.transfer(other)) {
			return;
		}

		other._moveHandler = this._moveHandler;
		this._moveHandler = undefined;
		return other;
	}

	public get backupId(): string | undefined {
		if (this._modelRef) {
			return this._modelRef.object.backupId;
		}
		return this._backupId;
	}

	public get untitledDocumentData(): VSBuffer | undefined {
		return this._untitledDocumentData;
	}

	public override toUntyped(): IResourceEditorInput {
		return {
			resource: this.resource,
			options: {
				override: this.viewType
			}
		};
	}

	public override claim(claimant: unknown, targetWindow: CodeWindow, scopedContextKeyService: IContextKeyService | undefined): void {
		if (this.doCanMove(targetWindow.vscodeWindowId) !== true) {
			throw createEditorOpenError(localize('editorUnsupportedInWindow', "Unable to open the editor in this window, it contains modifications that can only be saved in the original window."), [
				toAction({
					id: 'openInOriginalWindow',
					label: localize('reopenInOriginalWindow', "Open in Original Window"),
					run: async () => {
						const originalPart = this.editorGroupsService.getPart(this.layoutService.getContainer(getWindow(this.webview.container).window));
						const currentPart = this.editorGroupsService.getPart(this.layoutService.getContainer(targetWindow.window));
						currentPart.activeGroup.moveEditor(this, originalPart.activeGroup);
					}
				})
			], { forceMessage: true });
		}
		return super.claim(claimant, targetWindow, scopedContextKeyService);
	}

	public override canMove(sourceGroup: GroupIdentifier, targetGroup: GroupIdentifier): true | string {
		const resolvedTargetGroup = this.editorGroupsService.getGroup(targetGroup);
		if (resolvedTargetGroup) {
			const canMove = this.doCanMove(resolvedTargetGroup.windowId);
			if (typeof canMove === 'string') {
				return canMove;
			}
		}

		return super.canMove(sourceGroup, targetGroup);
	}

	private doCanMove(targetWindowId: number): true | string {
		if (this.isModified() && this._modelRef?.object.canHotExit === false) {
			const sourceWindowId = getWindow(this.webview.container).vscodeWindowId;
			if (sourceWindowId !== targetWindowId) {

				// The custom editor is modified, not backed by a file and without a backup.
				// We have to assume that the modified state is enclosed into the webview
				// managed by an extension. As such, we cannot just move the webview
				// into another window because that means, we potentally loose the modified
				// state and thus trigger data loss.

				return localize('editorCannotMove', "Unable to move '{0}': The editor contains changes that can only be saved in its current window.", this.getName());
			}
		}

		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/browser/customEditorInputFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/browser/customEditorInputFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { CustomEditorInput } from './customEditorInput.js';
import { ICustomEditorService } from '../common/customEditor.js';
import { NotebookEditorInput } from '../../notebook/common/notebookEditorInput.js';
import { IWebviewService, WebviewContentOptions, WebviewContentPurpose, WebviewExtensionDescription, WebviewOptions } from '../../webview/browser/webview.js';
import { DeserializedWebview, restoreWebviewContentOptions, restoreWebviewOptions, reviveWebviewExtensionDescription, reviveWebviewIconPath, SerializedWebview, SerializedWebviewOptions, WebviewEditorInputSerializer } from '../../webviewPanel/browser/webviewEditorInputSerializer.js';
import { IWebviewWorkbenchService } from '../../webviewPanel/browser/webviewWorkbenchService.js';
import { IWorkingCopyBackupMeta, IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyBackupService } from '../../../services/workingCopy/common/workingCopyBackup.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../services/workingCopy/common/workingCopyEditorService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export interface CustomDocumentBackupData extends IWorkingCopyBackupMeta {
	readonly viewType: string;
	readonly editorResource: UriComponents;

	readonly customTitle: string | undefined;
	readonly iconPath: { dark: UriComponents; light: UriComponents } | ThemeIcon | undefined;

	backupId: string;

	readonly extension: undefined | {
		readonly location: UriComponents;
		readonly id: string;
	};

	readonly webview: {
		readonly origin: string | undefined;
		readonly options: SerializedWebviewOptions;
		readonly state: any;
	};
}

interface SerializedCustomEditor extends SerializedWebview {
	readonly editorResource: UriComponents;
	readonly dirty: boolean;
	readonly backupId?: string;
}

interface DeserializedCustomEditor extends DeserializedWebview {
	readonly editorResource: URI;
	readonly dirty: boolean;
	readonly backupId?: string;
}

export class CustomEditorInputSerializer extends WebviewEditorInputSerializer {

	public static override readonly ID = CustomEditorInput.typeId;

	public constructor(
		@IWebviewWorkbenchService webviewWorkbenchService: IWebviewWorkbenchService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWebviewService private readonly _webviewService: IWebviewService,
	) {
		super(webviewWorkbenchService);
	}

	public override serialize(input: CustomEditorInput): string | undefined {
		const dirty = input.isDirty();
		const data: SerializedCustomEditor = {
			...this.toJson(input),
			editorResource: input.resource.toJSON(),
			dirty,
			backupId: dirty ? input.backupId : undefined,
		};

		try {
			return JSON.stringify(data);
		} catch {
			return undefined;
		}
	}

	protected override fromJson(data: SerializedCustomEditor): DeserializedCustomEditor {
		return {
			...super.fromJson(data),
			editorResource: URI.from(data.editorResource),
			dirty: data.dirty,
		};
	}

	public override deserialize(
		_instantiationService: IInstantiationService,
		serializedEditorInput: string
	): CustomEditorInput {
		const data = this.fromJson(JSON.parse(serializedEditorInput));

		const webview = reviveWebview(this._webviewService, data);
		const customInput = this._instantiationService.createInstance(CustomEditorInput, {
			resource: data.editorResource,
			viewType: data.viewType,
			webviewTitle: data.title,
			iconPath: data.iconPath,
		}, webview, { startsDirty: data.dirty, backupId: data.backupId });
		if (typeof data.group === 'number') {
			customInput.updateGroup(data.group);
		}
		return customInput;
	}
}

function reviveWebview(webviewService: IWebviewService, data: { origin: string | undefined; viewType: string; state: any; webviewOptions: WebviewOptions; contentOptions: WebviewContentOptions; extension?: WebviewExtensionDescription; title: string | undefined }) {
	const webview = webviewService.createWebviewOverlay({
		providedViewType: data.viewType,
		origin: data.origin,
		title: data.title,
		options: {
			purpose: WebviewContentPurpose.CustomEditor,
			enableFindWidget: data.webviewOptions.enableFindWidget,
			retainContextWhenHidden: data.webviewOptions.retainContextWhenHidden,
		},
		contentOptions: data.contentOptions,
		extension: data.extension,
	});
	webview.state = data.state;
	return webview;
}

export class ComplexCustomWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.complexCustomWorkingCopyEditorHandler';

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkingCopyEditorService _workingCopyEditorService: IWorkingCopyEditorService,
		@IWorkingCopyBackupService private readonly _workingCopyBackupService: IWorkingCopyBackupService,
		@IWebviewService private readonly _webviewService: IWebviewService,
		@ICustomEditorService _customEditorService: ICustomEditorService // DO NOT REMOVE (needed on startup to register overrides properly)
	) {
		super();

		this._register(_workingCopyEditorService.registerHandler(this));
	}

	handles(workingCopy: IWorkingCopyIdentifier): boolean {
		return workingCopy.resource.scheme === Schemas.vscodeCustomEditor;
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handles(workingCopy)) {
			return false;
		}

		if (workingCopy.resource.authority === 'jupyter-notebook-ipynb' && editor instanceof NotebookEditorInput) {
			try {
				const data = JSON.parse(workingCopy.resource.query);
				const workingCopyResource = URI.from(data);
				return isEqual(workingCopyResource, editor.resource);
			} catch {
				return false;
			}
		}

		if (!(editor instanceof CustomEditorInput)) {
			return false;
		}

		if (workingCopy.resource.authority !== editor.viewType.replace(/[^a-z0-9\-_]/gi, '-').toLowerCase()) {
			return false;
		}

		// The working copy stores the uri of the original resource as its query param
		try {
			const data = JSON.parse(workingCopy.resource.query);
			const workingCopyResource = URI.from(data);
			return isEqual(workingCopyResource, editor.resource);
		} catch {
			return false;
		}
	}

	async createEditor(workingCopy: IWorkingCopyIdentifier): Promise<EditorInput> {
		const backup = await this._workingCopyBackupService.resolve<CustomDocumentBackupData>(workingCopy);
		if (!backup?.meta) {
			throw new Error(`No backup found for custom editor: ${workingCopy.resource}`);
		}

		const backupData = backup.meta;
		const extension = reviveWebviewExtensionDescription(backupData.extension?.id, backupData.extension?.location);
		const webview = reviveWebview(this._webviewService, {
			viewType: backupData.viewType,
			origin: backupData.webview.origin,
			webviewOptions: restoreWebviewOptions(backupData.webview.options),
			contentOptions: restoreWebviewContentOptions(backupData.webview.options),
			state: backupData.webview.state,
			extension,
			title: backupData.customTitle,
		});

		const editor = this._instantiationService.createInstance(CustomEditorInput, {
			resource: URI.revive(backupData.editorResource),
			viewType: backupData.viewType,
			webviewTitle: backupData.customTitle,
			iconPath: reviveWebviewIconPath(backupData.iconPath)
		}, webview, { backupId: backupData.backupId });
		editor.updateGroup(0);
		return editor;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/browser/customEditors.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/browser/customEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/customEditor.css';
import { coalesce } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { RedoCommand, UndoCommand } from '../../../../editor/browser/editorExtensions.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { FileOperation, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorExtensions, GroupIdentifier, IEditorFactoryRegistry, IResourceDiffEditorInput } from '../../../common/editor.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { CONTEXT_ACTIVE_CUSTOM_EDITOR_ID, CONTEXT_FOCUSED_CUSTOM_EDITOR_IS_EDITABLE, CustomEditorCapabilities, CustomEditorInfo, CustomEditorInfoCollection, ICustomEditorModelManager, ICustomEditorService } from '../common/customEditor.js';
import { CustomEditorModelManager } from '../common/customEditorModelManager.js';
import { IEditorGroup, IEditorGroupContextKeyProvider, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorResolverService, IEditorType, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ContributedCustomEditors } from '../common/contributedCustomEditors.js';
import { CustomEditorInput } from './customEditorInput.js';

export class CustomEditorService extends Disposable implements ICustomEditorService {
	_serviceBrand: any;

	private readonly _contributedEditors: ContributedCustomEditors;
	private _untitledCounter = 0;
	private readonly _editorResolverDisposables = this._register(new DisposableStore());
	private readonly _editorCapabilities = new Map<string, CustomEditorCapabilities>();

	private readonly _models: ICustomEditorModelManager;

	private readonly _onDidChangeEditorTypes = this._register(new Emitter<void>());
	public readonly onDidChangeEditorTypes: Event<void> = this._onDidChangeEditorTypes.event;

	private readonly _fileEditorFactory = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).getFileEditorFactory();

	constructor(
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
	) {
		super();

		this._models = new CustomEditorModelManager();

		this._contributedEditors = this._register(new ContributedCustomEditors(storageService));
		// Register the contribution points only emitting one change from the resolver
		this.editorResolverService.bufferChangeEvents(this.registerContributionPoints.bind(this));

		this._register(this._contributedEditors.onChange(() => {
			// Register the contribution points only emitting one change from the resolver
			this.editorResolverService.bufferChangeEvents(this.registerContributionPoints.bind(this));
			this._onDidChangeEditorTypes.fire();
		}));

		// Register group context key providers.
		// These set the context keys for each editor group and the global context
		const activeCustomEditorContextKeyProvider: IEditorGroupContextKeyProvider<string> = {
			contextKey: CONTEXT_ACTIVE_CUSTOM_EDITOR_ID,
			getGroupContextKeyValue: group => this.getActiveCustomEditorId(group),
			onDidChange: this.onDidChangeEditorTypes
		};

		const customEditorIsEditableContextKeyProvider: IEditorGroupContextKeyProvider<boolean> = {
			contextKey: CONTEXT_FOCUSED_CUSTOM_EDITOR_IS_EDITABLE,
			getGroupContextKeyValue: group => this.getCustomEditorIsEditable(group),
			onDidChange: this.onDidChangeEditorTypes
		};

		this._register(this.editorGroupService.registerContextKeyProvider(activeCustomEditorContextKeyProvider));
		this._register(this.editorGroupService.registerContextKeyProvider(customEditorIsEditableContextKeyProvider));

		this._register(fileService.onDidRunOperation(e => {
			if (e.isOperation(FileOperation.MOVE)) {
				this.handleMovedFileInOpenedFileEditors(e.resource, this.uriIdentityService.asCanonicalUri(e.target.resource));
			}
		}));

		const PRIORITY = 105;
		this._register(UndoCommand.addImplementation(PRIORITY, 'custom-editor', () => {
			return this.withActiveCustomEditor(editor => editor.undo());
		}));
		this._register(RedoCommand.addImplementation(PRIORITY, 'custom-editor', () => {
			return this.withActiveCustomEditor(editor => editor.redo());
		}));
	}

	getEditorTypes(): IEditorType[] {
		return [...this._contributedEditors];
	}

	private withActiveCustomEditor(f: (editor: CustomEditorInput) => void | Promise<void>): boolean | Promise<void> {
		const activeEditor = this.editorService.activeEditor;
		if (activeEditor instanceof CustomEditorInput) {
			const result = f(activeEditor);
			if (result) {
				return result;
			}
			return true;
		}
		return false;
	}

	private registerContributionPoints(): void {
		// Clear all previous contributions we know
		this._editorResolverDisposables.clear();

		for (const contributedEditor of this._contributedEditors) {
			for (const globPattern of contributedEditor.selector) {
				if (!globPattern.filenamePattern) {
					continue;
				}

				this._editorResolverDisposables.add(this.editorResolverService.registerEditor(
					globPattern.filenamePattern,
					{
						id: contributedEditor.id,
						label: contributedEditor.displayName,
						detail: contributedEditor.providerDisplayName,
						priority: contributedEditor.priority,
					},
					{
						singlePerResource: () => !(this.getCustomEditorCapabilities(contributedEditor.id)?.supportsMultipleEditorsPerDocument ?? false)
					},
					{
						createEditorInput: ({ resource }, group) => {
							return { editor: CustomEditorInput.create(this.instantiationService, { resource, viewType: contributedEditor.id, webviewTitle: undefined, iconPath: undefined }, group.id) };
						},
						createUntitledEditorInput: ({ resource }, group) => {
							return { editor: CustomEditorInput.create(this.instantiationService, { resource: resource ?? URI.from({ scheme: Schemas.untitled, authority: `Untitled-${this._untitledCounter++}` }), viewType: contributedEditor.id, webviewTitle: undefined, iconPath: undefined }, group.id) };
						},
						createDiffEditorInput: (diffEditorInput, group) => {
							return { editor: this.createDiffEditorInput(diffEditorInput, contributedEditor.id, group) };
						},
					}
				));
			}
		}
	}

	private createDiffEditorInput(
		editor: IResourceDiffEditorInput,
		editorID: string,
		group: IEditorGroup
	): DiffEditorInput {
		const modifiedOverride = CustomEditorInput.create(this.instantiationService, { resource: assertReturnsDefined(editor.modified.resource), viewType: editorID, webviewTitle: undefined, iconPath: undefined }, group.id, { customClasses: 'modified' });
		const originalOverride = CustomEditorInput.create(this.instantiationService, { resource: assertReturnsDefined(editor.original.resource), viewType: editorID, webviewTitle: undefined, iconPath: undefined }, group.id, { customClasses: 'original' });
		return this.instantiationService.createInstance(DiffEditorInput, editor.label, editor.description, originalOverride, modifiedOverride, true);
	}

	public get models() { return this._models; }

	public getCustomEditor(viewType: string): CustomEditorInfo | undefined {
		return this._contributedEditors.get(viewType);
	}

	public getContributedCustomEditors(resource: URI): CustomEditorInfoCollection {
		return new CustomEditorInfoCollection(this._contributedEditors.getContributedEditors(resource));
	}

	public getUserConfiguredCustomEditors(resource: URI): CustomEditorInfoCollection {
		const resourceAssocations = this.editorResolverService.getAssociationsForResource(resource);
		return new CustomEditorInfoCollection(
			coalesce(resourceAssocations
				.map(association => this._contributedEditors.get(association.viewType))));
	}

	public getAllCustomEditors(resource: URI): CustomEditorInfoCollection {
		return new CustomEditorInfoCollection([
			...this.getUserConfiguredCustomEditors(resource).allEditors,
			...this.getContributedCustomEditors(resource).allEditors,
		]);
	}

	public registerCustomEditorCapabilities(viewType: string, options: CustomEditorCapabilities): IDisposable {
		if (this._editorCapabilities.has(viewType)) {
			throw new Error(`Capabilities for ${viewType} already set`);
		}
		this._editorCapabilities.set(viewType, options);
		return toDisposable(() => {
			this._editorCapabilities.delete(viewType);
		});
	}

	public getCustomEditorCapabilities(viewType: string): CustomEditorCapabilities | undefined {
		return this._editorCapabilities.get(viewType);
	}

	private getActiveCustomEditorId(group: IEditorGroup): string {
		const activeEditorPane = group.activeEditorPane;
		const resource = activeEditorPane?.input?.resource;
		if (!resource) {
			return '';
		}

		return activeEditorPane?.input instanceof CustomEditorInput ? activeEditorPane.input.viewType : '';
	}

	private getCustomEditorIsEditable(group: IEditorGroup): boolean {
		const activeEditorPane = group.activeEditorPane;
		const resource = activeEditorPane?.input?.resource;
		if (!resource) {
			return false;
		}

		return activeEditorPane?.input instanceof CustomEditorInput;
	}

	private async handleMovedFileInOpenedFileEditors(oldResource: URI, newResource: URI): Promise<void> {
		if (extname(oldResource).toLowerCase() === extname(newResource).toLowerCase()) {
			return;
		}

		const possibleEditors = this.getAllCustomEditors(newResource);

		// See if we have any non-optional custom editor for this resource
		if (!possibleEditors.allEditors.some(editor => editor.priority !== RegisteredEditorPriority.option)) {
			return;
		}

		// If so, check all editors to see if there are any file editors open for the new resource
		const editorsToReplace = new Map<GroupIdentifier, EditorInput[]>();
		for (const group of this.editorGroupService.groups) {
			for (const editor of group.editors) {
				if (this._fileEditorFactory.isFileEditor(editor)
					&& !(editor instanceof CustomEditorInput)
					&& isEqual(editor.resource, newResource)
				) {
					let entry = editorsToReplace.get(group.id);
					if (!entry) {
						entry = [];
						editorsToReplace.set(group.id, entry);
					}
					entry.push(editor);
				}
			}
		}

		if (!editorsToReplace.size) {
			return;
		}

		for (const [group, entries] of editorsToReplace) {
			this.editorService.replaceEditors(entries.map(editor => {
				let replacement: EditorInput | IResourceEditorInput;
				if (possibleEditors.defaultEditor) {
					const viewType = possibleEditors.defaultEditor.id;
					replacement = CustomEditorInput.create(this.instantiationService, { resource: newResource, viewType, webviewTitle: undefined, iconPath: undefined }, group);
				} else {
					replacement = { resource: newResource, options: { override: DEFAULT_EDITOR_ASSOCIATION.id } };
				}

				return {
					editor,
					replacement,
					options: {
						preserveFocus: true,
					}
				};
			}), group);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/browser/media/customEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/browser/media/customEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.webview.modified {
	box-shadow: -6px 0 5px -5px var(--vscode-scrollbar-shadow);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/common/contributedCustomEditors.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/common/contributedCustomEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';
import { CustomEditorPriority, CustomEditorDescriptor, CustomEditorInfo } from './customEditor.js';
import { customEditorsExtensionPoint, ICustomEditorsExtensionPoint } from './extensionPoint.js';
import { RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IExtensionPointUser } from '../../../services/extensions/common/extensionsRegistry.js';

interface CustomEditorsMemento {
	editors?: CustomEditorDescriptor[];
}

export class ContributedCustomEditors extends Disposable {

	private static readonly CUSTOM_EDITORS_STORAGE_ID = 'customEditors';
	private static readonly CUSTOM_EDITORS_ENTRY_ID = 'editors';

	private readonly _editors = new Map<string, CustomEditorInfo>();
	private readonly _memento: Memento<CustomEditorsMemento>;

	constructor(storageService: IStorageService) {
		super();

		this._memento = new Memento(ContributedCustomEditors.CUSTOM_EDITORS_STORAGE_ID, storageService);

		const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		for (const info of mementoObject[ContributedCustomEditors.CUSTOM_EDITORS_ENTRY_ID] || []) {
			this.add(new CustomEditorInfo(info));
		}

		this._register(customEditorsExtensionPoint.setHandler(extensions => {
			this.update(extensions);
		}));
	}

	private readonly _onChange = this._register(new Emitter<void>());
	public readonly onChange = this._onChange.event;

	private update(extensions: readonly IExtensionPointUser<ICustomEditorsExtensionPoint[]>[]) {
		this._editors.clear();

		for (const extension of extensions) {
			for (const webviewEditorContribution of extension.value) {
				this.add(new CustomEditorInfo({
					id: webviewEditorContribution.viewType,
					displayName: webviewEditorContribution.displayName,
					providerDisplayName: extension.description.isBuiltin ? nls.localize('builtinProviderDisplayName', "Built-in") : extension.description.displayName || extension.description.identifier.value,
					selector: webviewEditorContribution.selector || [],
					priority: getPriorityFromContribution(webviewEditorContribution, extension.description),
				}));
			}
		}

		const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		mementoObject[ContributedCustomEditors.CUSTOM_EDITORS_ENTRY_ID] = Array.from(this._editors.values());
		this._memento.saveMemento();

		this._onChange.fire();
	}

	public [Symbol.iterator](): Iterator<CustomEditorInfo> {
		return this._editors.values();
	}

	public get(viewType: string): CustomEditorInfo | undefined {
		return this._editors.get(viewType);
	}

	public getContributedEditors(resource: URI): readonly CustomEditorInfo[] {
		return Array.from(this._editors.values())
			.filter(customEditor => customEditor.matches(resource));
	}

	private add(info: CustomEditorInfo): void {
		if (this._editors.has(info.id)) {
			console.error(`Custom editor with id '${info.id}' already registered`);
			return;
		}
		this._editors.set(info.id, info);
	}
}

function getPriorityFromContribution(
	contribution: ICustomEditorsExtensionPoint,
	extension: IExtensionDescription,
): RegisteredEditorPriority {
	switch (contribution.priority as CustomEditorPriority | undefined) {
		case CustomEditorPriority.default:
			return RegisteredEditorPriority.default;

		case CustomEditorPriority.option:
			return RegisteredEditorPriority.option;

		case CustomEditorPriority.builtin:
			// Builtin is only valid for builtin extensions
			return extension.isBuiltin ? RegisteredEditorPriority.builtin : RegisteredEditorPriority.default;

		default:
			return RegisteredEditorPriority.default;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/common/customEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/common/customEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IRevertOptions, ISaveOptions } from '../../../common/editor.js';
import { globMatchesResource, priorityToRank, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';

export const ICustomEditorService = createDecorator<ICustomEditorService>('customEditorService');

export const CONTEXT_ACTIVE_CUSTOM_EDITOR_ID = new RawContextKey<string>('activeCustomEditorId', '', {
	type: 'string',
	description: nls.localize('context.customEditor', "The viewType of the currently active custom editor."),
});

export const CONTEXT_FOCUSED_CUSTOM_EDITOR_IS_EDITABLE = new RawContextKey<boolean>('focusedCustomEditorIsEditable', false);

export interface CustomEditorCapabilities {
	readonly supportsMultipleEditorsPerDocument?: boolean;
}

export interface ICustomEditorService {
	_serviceBrand: any;

	readonly models: ICustomEditorModelManager;

	getCustomEditor(viewType: string): CustomEditorInfo | undefined;
	getAllCustomEditors(resource: URI): CustomEditorInfoCollection;
	getContributedCustomEditors(resource: URI): CustomEditorInfoCollection;
	getUserConfiguredCustomEditors(resource: URI): CustomEditorInfoCollection;

	registerCustomEditorCapabilities(viewType: string, options: CustomEditorCapabilities): IDisposable;
	getCustomEditorCapabilities(viewType: string): CustomEditorCapabilities | undefined;
}

export interface ICustomEditorModelManager {
	getAllModels(resource: URI): Promise<ICustomEditorModel[]>;

	get(resource: URI, viewType: string): Promise<ICustomEditorModel | undefined>;

	tryRetain(resource: URI, viewType: string): Promise<IReference<ICustomEditorModel>> | undefined;

	add(resource: URI, viewType: string, model: Promise<ICustomEditorModel>): Promise<IReference<ICustomEditorModel>>;

	disposeAllModelsForView(viewType: string): void;
}

export interface ICustomEditorModel extends IDisposable {
	readonly viewType: string;
	readonly resource: URI;
	readonly backupId: string | undefined;
	readonly canHotExit: boolean;

	isReadonly(): boolean | IMarkdownString;
	readonly onDidChangeReadonly: Event<void>;

	isOrphaned(): boolean;
	readonly onDidChangeOrphaned: Event<void>;

	isDirty(): boolean;
	readonly onDidChangeDirty: Event<void>;

	revert(options?: IRevertOptions): Promise<void>;

	saveCustomEditor(options?: ISaveOptions): Promise<URI | undefined>;
	saveCustomEditorAs(resource: URI, targetResource: URI, currentOptions?: ISaveOptions): Promise<boolean>;
}

export const enum CustomEditorPriority {
	default = 'default',
	builtin = 'builtin',
	option = 'option',
}

export interface CustomEditorSelector {
	readonly filenamePattern?: string;
}

export interface CustomEditorDescriptor {
	readonly id: string;
	readonly displayName: string;
	readonly providerDisplayName: string;
	readonly priority: RegisteredEditorPriority;
	readonly selector: readonly CustomEditorSelector[];
}

export class CustomEditorInfo implements CustomEditorDescriptor {

	public readonly id: string;
	public readonly displayName: string;
	public readonly providerDisplayName: string;
	public readonly priority: RegisteredEditorPriority;
	public readonly selector: readonly CustomEditorSelector[];

	constructor(descriptor: CustomEditorDescriptor) {
		this.id = descriptor.id;
		this.displayName = descriptor.displayName;
		this.providerDisplayName = descriptor.providerDisplayName;
		this.priority = descriptor.priority;
		this.selector = descriptor.selector;
	}

	matches(resource: URI): boolean {
		return this.selector.some(selector => selector.filenamePattern && globMatchesResource(selector.filenamePattern, resource));
	}
}

export class CustomEditorInfoCollection {

	public readonly allEditors: readonly CustomEditorInfo[];

	constructor(
		editors: readonly CustomEditorInfo[],
	) {
		this.allEditors = distinct(editors, editor => editor.id);
	}

	public get length(): number { return this.allEditors.length; }

	/**
	 * Find the single default editor to use (if any) by looking at the editor's priority and the
	 * other contributed editors.
	 */
	public get defaultEditor(): CustomEditorInfo | undefined {
		return this.allEditors.find(editor => {
			switch (editor.priority) {
				case RegisteredEditorPriority.default:
				case RegisteredEditorPriority.builtin:
					// A default editor must have higher priority than all other contributed editors.
					return this.allEditors.every(otherEditor =>
						otherEditor === editor || isLowerPriority(otherEditor, editor));

				default:
					return false;
			}
		});
	}

	/**
	 * Find the best available editor to use.
	 *
	 * Unlike the `defaultEditor`, a bestAvailableEditor can exist even if there are other editors with
	 * the same priority.
	 */
	public get bestAvailableEditor(): CustomEditorInfo | undefined {
		const editors = Array.from(this.allEditors).sort((a, b) => {
			return priorityToRank(a.priority) - priorityToRank(b.priority);
		});
		return editors[0];
	}
}

function isLowerPriority(otherEditor: CustomEditorInfo, editor: CustomEditorInfo): unknown {
	return priorityToRank(otherEditor.priority) < priorityToRank(editor.priority);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/common/customEditorModelManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/common/customEditorModelManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { IReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICustomEditorModel, ICustomEditorModelManager } from './customEditor.js';

export class CustomEditorModelManager implements ICustomEditorModelManager {

	private readonly _references = new Map<string, {
		readonly viewType: string;
		readonly model: Promise<ICustomEditorModel>;
		counter: number;
	}>();

	public async getAllModels(resource: URI): Promise<ICustomEditorModel[]> {
		const keyStart = `${resource.toString()}@@@`;
		const models = [];
		for (const [key, entry] of this._references) {
			if (key.startsWith(keyStart) && entry.model) {
				models.push(await entry.model);
			}
		}
		return models;
	}
	public async get(resource: URI, viewType: string): Promise<ICustomEditorModel | undefined> {
		const key = this.key(resource, viewType);
		const entry = this._references.get(key);
		return entry?.model;
	}

	public tryRetain(resource: URI, viewType: string): Promise<IReference<ICustomEditorModel>> | undefined {
		const key = this.key(resource, viewType);

		const entry = this._references.get(key);
		if (!entry) {
			return undefined;
		}

		entry.counter++;

		return entry.model.then(model => {
			return {
				object: model,
				dispose: createSingleCallFunction(() => {
					if (--entry.counter <= 0) {
						entry.model.then(x => x.dispose());
						this._references.delete(key);
					}
				}),
			};
		});
	}

	public add(resource: URI, viewType: string, model: Promise<ICustomEditorModel>): Promise<IReference<ICustomEditorModel>> {
		const key = this.key(resource, viewType);
		const existing = this._references.get(key);
		if (existing) {
			throw new Error('Model already exists');
		}

		this._references.set(key, { viewType, model, counter: 0 });
		return this.tryRetain(resource, viewType)!;
	}

	public disposeAllModelsForView(viewType: string): void {
		for (const [key, value] of this._references) {
			if (value.viewType === viewType) {
				value.model.then(x => x.dispose());
				this._references.delete(key);
			}
		}
	}

	private key(resource: URI, viewType: string): string {
		return `${resource.toString()}@@@${viewType}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/common/customTextEditorModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/common/customTextEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, IReference } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/path.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IRevertOptions, ISaveOptions } from '../../../common/editor.js';
import { ICustomEditorModel } from './customEditor.js';
import { IExtensionService } from '../../../../workbench/services/extensions/common/extensions.js';
import { ITextFileEditorModel, ITextFileService, TextFileEditorModelState } from '../../../services/textfile/common/textfiles.js';

export class CustomTextEditorModel extends Disposable implements ICustomEditorModel {

	public static async create(
		instantiationService: IInstantiationService,
		viewType: string,
		resource: URI
	): Promise<CustomTextEditorModel> {
		return instantiationService.invokeFunction(async accessor => {
			const textModelResolverService = accessor.get(ITextModelService);
			const model = await textModelResolverService.createModelReference(resource);
			return instantiationService.createInstance(CustomTextEditorModel, viewType, resource, model);
		});
	}

	private readonly _textFileModel: ITextFileEditorModel | undefined;

	private readonly _onDidChangeOrphaned = this._register(new Emitter<void>());
	public readonly onDidChangeOrphaned = this._onDidChangeOrphaned.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<void>());
	public readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	constructor(
		public readonly viewType: string,
		private readonly _resource: URI,
		private readonly _model: IReference<IResolvedTextEditorModel>,
		@ITextFileService private readonly textFileService: ITextFileService,
		@ILabelService private readonly _labelService: ILabelService,
		@IExtensionService extensionService: IExtensionService,
	) {
		super();

		this._register(_model);

		this._textFileModel = this.textFileService.files.get(_resource);
		if (this._textFileModel) {
			this._register(this._textFileModel.onDidChangeOrphaned(() => this._onDidChangeOrphaned.fire()));
			this._register(this._textFileModel.onDidChangeReadonly(() => this._onDidChangeReadonly.fire()));
		}

		this._register(this.textFileService.files.onDidChangeDirty(e => {
			if (isEqual(this.resource, e.resource)) {
				this._onDidChangeDirty.fire();
				this._onDidChangeContent.fire();
			}
		}));

		this._register(extensionService.onWillStop(e => {
			e.veto(true, localize('vetoExtHostRestart', "An extension provided text editor for '{0}' is still open that would close otherwise.", this.name));
		}));
	}

	public get resource() {
		return this._resource;
	}

	public get name() {
		return basename(this._labelService.getUriLabel(this._resource));
	}

	public isReadonly(): boolean | IMarkdownString {
		return this._model.object.isReadonly();
	}

	public get backupId() {
		return undefined;
	}

	public get canHotExit() {
		return true; // ensured via backups from text file models
	}

	public isDirty(): boolean {
		return this.textFileService.isDirty(this.resource);
	}

	public isOrphaned(): boolean {
		return !!this._textFileModel?.hasState(TextFileEditorModelState.ORPHAN);
	}

	private readonly _onDidChangeDirty: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeDirty: Event<void> = this._onDidChangeDirty.event;

	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;

	public async revert(options?: IRevertOptions) {
		return this.textFileService.revert(this.resource, options);
	}

	public saveCustomEditor(options?: ISaveOptions): Promise<URI | undefined> {
		return this.textFileService.save(this.resource, options);
	}

	public async saveCustomEditorAs(resource: URI, targetResource: URI, options?: ISaveOptions): Promise<boolean> {
		return !!await this.textFileService.saveAs(resource, targetResource, options);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/common/extensionPoint.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/common/extensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { TypeFromJsonSchema, IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as nls from '../../../../nls.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { CustomEditorPriority } from './customEditor.js';
import { Extensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { languagesExtPoint } from '../../../services/language/common/languageService.js';

const Fields = Object.freeze({
	viewType: 'viewType',
	displayName: 'displayName',
	selector: 'selector',
	priority: 'priority',
});

const customEditorsContributionSchema = {
	type: 'object',
	required: [
		Fields.viewType,
		Fields.displayName,
		Fields.selector,
	],
	additionalProperties: false,
	properties: {
		[Fields.viewType]: {
			type: 'string',
			markdownDescription: nls.localize('contributes.viewType', 'Identifier for the custom editor. This must be unique across all custom editors, so we recommend including your extension id as part of `viewType`. The `viewType` is used when registering custom editors with `vscode.registerCustomEditorProvider` and in the `onCustomEditor:${id}` [activation event](https://code.visualstudio.com/api/references/activation-events).'),
		},
		[Fields.displayName]: {
			type: 'string',
			description: nls.localize('contributes.displayName', 'Human readable name of the custom editor. This is displayed to users when selecting which editor to use.'),
		},
		[Fields.selector]: {
			type: 'array',
			description: nls.localize('contributes.selector', 'Set of globs that the custom editor is enabled for.'),
			items: {
				type: 'object',
				defaultSnippets: [{
					body: {
						filenamePattern: '$1',
					}
				}],
				additionalProperties: false,
				properties: {
					filenamePattern: {
						type: 'string',
						description: nls.localize('contributes.selector.filenamePattern', 'Glob that the custom editor is enabled for.'),
					},
				}
			}
		},
		[Fields.priority]: {
			type: 'string',
			markdownDeprecationMessage: nls.localize('contributes.priority', 'Controls if the custom editor is enabled automatically when the user opens a file. This may be overridden by users using the `workbench.editorAssociations` setting.'),
			enum: [
				CustomEditorPriority.default,
				CustomEditorPriority.option,
			],
			markdownEnumDescriptions: [
				nls.localize('contributes.priority.default', 'The editor is automatically used when the user opens a resource, provided that no other default custom editors are registered for that resource.'),
				nls.localize('contributes.priority.option', 'The editor is not automatically used when the user opens a resource, but a user can switch to the editor using the `Reopen With` command.'),
			],
			default: CustomEditorPriority.default
		}
	}
} as const satisfies IJSONSchema;

export type ICustomEditorsExtensionPoint = TypeFromJsonSchema<typeof customEditorsContributionSchema>;

export const customEditorsExtensionPoint = ExtensionsRegistry.registerExtensionPoint<ICustomEditorsExtensionPoint[]>({
	extensionPoint: 'customEditors',
	deps: [languagesExtPoint],
	jsonSchema: {
		description: nls.localize('contributes.customEditors', 'Contributed custom editors.'),
		type: 'array',
		defaultSnippets: [{
			body: [{
				[Fields.viewType]: '$1',
				[Fields.displayName]: '$2',
				[Fields.selector]: [{
					filenamePattern: '$3'
				}],
			}]
		}],
		items: customEditorsContributionSchema
	},
	activationEventsGenerator: function* (contribs: readonly ICustomEditorsExtensionPoint[]) {
		for (const contrib of contribs) {
			const viewType = contrib[Fields.viewType];
			if (viewType) {
				yield `onCustomEditor:${viewType}`;
			}
		}
	},
});

class CustomEditorsDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.customEditors;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const customEditors = manifest.contributes?.customEditors || [];
		if (!customEditors.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			nls.localize('customEditors view type', "View Type"),
			nls.localize('customEditors priority', "Priority"),
			nls.localize('customEditors filenamePattern', "Filename Pattern"),
		];

		const rows: IRowData[][] = customEditors
			.map(customEditor => {
				return [
					customEditor.viewType,
					customEditor.priority ?? '',
					coalesce(customEditor.selector.map(x => x.filenamePattern)).join(', ')
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'customEditors',
	label: nls.localize('customEditors', "Custom Editors"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(CustomEditorsDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/baseDebugView.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/baseDebugView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { HighlightedLabel, IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IInputValidationOptions, InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { IKeyboardNavigationLabelProvider } from '../../../../base/browser/ui/list/list.js';
import { IAsyncDataSource, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { removeAnsiEscapeCodes } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IDebugService, IExpression, IScope } from '../common/debug.js';
import { Variable } from '../common/debugModel.js';
import { IDebugVisualizerService } from '../common/debugVisualizers.js';
import { LinkDetector } from './linkDetector.js';

const $ = dom.$;

export interface IRenderValueOptions {
	showChanged?: boolean;
	maxValueLength?: number;
	/** If set, a hover will be shown on the element. Requires a disposable store for usage. */
	hover?: false | {
		commands: { id: string; args: unknown[] }[];
		commandService: ICommandService;
	};
	colorize?: boolean;
	linkDetector?: LinkDetector;
}

export interface IVariableTemplateData {
	expression: HTMLElement;
	name: HTMLElement;
	type: HTMLElement;
	value: HTMLElement;
	label: HighlightedLabel;
	lazyButton: HTMLElement;
}

export function renderViewTree(container: HTMLElement): HTMLElement {
	const treeContainer = $('.');
	treeContainer.classList.add('debug-view-content', 'file-icon-themable-tree');
	container.appendChild(treeContainer);
	return treeContainer;
}

export interface IInputBoxOptions {
	initialValue: string;
	ariaLabel: string;
	placeholder?: string;
	validationOptions?: IInputValidationOptions;
	onFinish: (value: string, success: boolean) => void;
}

export interface IExpressionTemplateData {
	expression: HTMLElement;
	name: HTMLSpanElement;
	type: HTMLSpanElement;
	value: HTMLSpanElement;
	inputBoxContainer: HTMLElement;
	actionBar?: ActionBar;
	elementDisposable: DisposableStore;
	templateDisposable: IDisposable;
	label: HighlightedLabel;
	lazyButton: HTMLElement;
	currentElement: IExpression | undefined;
}

/** Splits highlights based on matching of the {@link expressionAndScopeLabelProvider} */
export const splitExpressionOrScopeHighlights = (e: IExpression | IScope, highlights: IHighlight[]) => {
	const nameEndsAt = e.name.length;
	const labelBeginsAt = e.name.length + 2;
	const name: IHighlight[] = [];
	const value: IHighlight[] = [];
	for (const hl of highlights) {
		if (hl.start < nameEndsAt) {
			name.push({ start: hl.start, end: Math.min(hl.end, nameEndsAt) });
		}
		if (hl.end > labelBeginsAt) {
			value.push({ start: Math.max(hl.start - labelBeginsAt, 0), end: hl.end - labelBeginsAt });
		}
	}

	return { name, value };
};

/** Keyboard label provider for expression and scope tree elements. */
export const expressionAndScopeLabelProvider: IKeyboardNavigationLabelProvider<IExpression | IScope> = {
	getKeyboardNavigationLabel(e) {
		const stripAnsi = e.getSession()?.rememberedCapabilities?.supportsANSIStyling;
		return `${e.name}: ${stripAnsi ? removeAnsiEscapeCodes(e.value) : e.value}`;
	},
};

export abstract class AbstractExpressionDataSource<Input, Element extends IExpression> implements IAsyncDataSource<Input, Element> {
	constructor(
		@IDebugService protected debugService: IDebugService,
		@IDebugVisualizerService protected debugVisualizer: IDebugVisualizerService,
	) { }

	public abstract hasChildren(element: Input | Element): boolean;

	public async getChildren(element: Input | Element): Promise<Element[]> {
		const vm = this.debugService.getViewModel();
		const children = await this.doGetChildren(element);
		return Promise.all(children.map(async r => {
			const vizOrTree = vm.getVisualizedExpression(r as IExpression);
			if (typeof vizOrTree === 'string') {
				const viz = await this.debugVisualizer.getVisualizedNodeFor(vizOrTree, r);
				if (viz) {
					vm.setVisualizedExpression(r, viz);
					return viz as IExpression as Element;
				}
			} else if (vizOrTree) {
				return vizOrTree as Element;
			}


			return r;
		}));
	}

	protected abstract doGetChildren(element: Input | Element): Promise<Element[]>;
}

export abstract class AbstractExpressionsRenderer<T = IExpression> implements ITreeRenderer<T, FuzzyScore, IExpressionTemplateData> {

	constructor(
		@IDebugService protected debugService: IDebugService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IHoverService protected readonly hoverService: IHoverService,
	) { }

	abstract get templateId(): string;

	renderTemplate(container: HTMLElement): IExpressionTemplateData {
		const templateDisposable = new DisposableStore();
		const expression = dom.append(container, $('.expression'));
		const name = dom.append(expression, $('span.name'));
		const lazyButton = dom.append(expression, $('span.lazy-button'));
		lazyButton.classList.add(...ThemeIcon.asClassNameArray(Codicon.eye));

		templateDisposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), lazyButton, localize('debug.lazyButton.tooltip', "Click to expand")));
		const type = dom.append(expression, $('span.type'));

		const value = dom.append(expression, $('span.value'));

		const label = templateDisposable.add(new HighlightedLabel(name));

		const inputBoxContainer = dom.append(expression, $('.inputBoxContainer'));

		let actionBar: ActionBar | undefined;
		if (this.renderActionBar) {
			dom.append(expression, $('.span.actionbar-spacer'));
			actionBar = templateDisposable.add(new ActionBar(expression));
		}

		const template: IExpressionTemplateData = { expression, name, type, value, label, inputBoxContainer, actionBar, elementDisposable: new DisposableStore(), templateDisposable, lazyButton, currentElement: undefined };

		templateDisposable.add(dom.addDisposableListener(lazyButton, dom.EventType.CLICK, () => {
			if (template.currentElement) {
				this.debugService.getViewModel().evaluateLazyExpression(template.currentElement);
			}
		}));

		return template;
	}

	public abstract renderElement(node: ITreeNode<T, FuzzyScore>, index: number, data: IExpressionTemplateData): void;

	protected renderExpressionElement(element: IExpression, node: ITreeNode<T, FuzzyScore>, data: IExpressionTemplateData): void {
		data.currentElement = element;
		this.renderExpression(node.element, data, createMatches(node.filterData));
		if (data.actionBar) {
			this.renderActionBar!(data.actionBar, element, data);
		}
		const selectedExpression = this.debugService.getViewModel().getSelectedExpression();
		if (element === selectedExpression?.expression || (element instanceof Variable && element.errorMessage)) {
			const options = this.getInputBoxOptions(element, !!selectedExpression?.settingWatch);
			if (options) {
				data.elementDisposable.add(this.renderInputBox(data.name, data.value, data.inputBoxContainer, options));
			}
		}
	}

	renderInputBox(nameElement: HTMLElement, valueElement: HTMLElement, inputBoxContainer: HTMLElement, options: IInputBoxOptions): IDisposable {
		nameElement.style.display = 'none';
		valueElement.style.display = 'none';
		inputBoxContainer.style.display = 'initial';
		dom.clearNode(inputBoxContainer);

		const inputBox = new InputBox(inputBoxContainer, this.contextViewService, { ...options, inputBoxStyles: defaultInputBoxStyles });

		inputBox.value = options.initialValue;
		inputBox.focus();
		inputBox.select();

		const done = createSingleCallFunction((success: boolean, finishEditing: boolean) => {
			nameElement.style.display = '';
			valueElement.style.display = '';
			inputBoxContainer.style.display = 'none';
			const value = inputBox.value;
			dispose(toDispose);

			if (finishEditing) {
				this.debugService.getViewModel().setSelectedExpression(undefined, false);
				options.onFinish(value, success);
			}
		});

		const toDispose = [
			inputBox,
			dom.addStandardDisposableListener(inputBox.inputElement, dom.EventType.KEY_DOWN, (e: IKeyboardEvent) => {
				const isEscape = e.equals(KeyCode.Escape);
				const isEnter = e.equals(KeyCode.Enter);
				if (isEscape || isEnter) {
					e.preventDefault();
					e.stopPropagation();
					done(isEnter, true);
				}
			}),
			dom.addDisposableListener(inputBox.inputElement, dom.EventType.BLUR, () => {
				done(true, true);
			}),
			dom.addDisposableListener(inputBox.inputElement, dom.EventType.CLICK, e => {
				// Do not expand / collapse selected elements
				e.preventDefault();
				e.stopPropagation();
			})
		];

		return toDisposable(() => {
			done(false, false);
		});
	}

	protected abstract renderExpression(expression: T, data: IExpressionTemplateData, highlights: IHighlight[]): void;
	protected abstract getInputBoxOptions(expression: IExpression, settingValue: boolean): IInputBoxOptions | undefined;

	protected renderActionBar?(actionBar: ActionBar, expression: IExpression, data: IExpressionTemplateData): void;

	disposeElement(node: ITreeNode<T, FuzzyScore>, index: number, templateData: IExpressionTemplateData): void {
		templateData.elementDisposable.clear();
	}

	disposeTemplate(templateData: IExpressionTemplateData): void {
		templateData.elementDisposable.dispose();
		templateData.templateDisposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/breakpointEditorContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/breakpointEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isSafari } from '../../../../base/browser/browser.js';
import { BrowserFeatures } from '../../../../base/browser/canIUse.js';
import * as dom from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { IAction, Separator, SubmenuAction, toAction } from '../../../../base/common/actions.js';
import { distinct } from '../../../../base/common/arrays.js';
import { RunOnceScheduler, timeout } from '../../../../base/common/async.js';
import { memoize } from '../../../../base/common/decorators.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { dispose, disposeIfDisposable, IDisposable } from '../../../../base/common/lifecycle.js';
import * as env from '../../../../base/common/platform.js';
import severity from '../../../../base/common/severity.js';
import { noBreakWhitespace } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ContentWidgetPositionPreference, IActiveCodeEditor, ICodeEditor, IContentWidget, IContentWidgetPosition, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { GlyphMarginLane, IModelDecorationOptions, IModelDecorationOverviewRulerOptions, IModelDecorationsChangeAccessor, ITextModel, OverviewRulerLane, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { GutterActionsRegistry } from '../../codeEditor/browser/editorLineNumberMenu.js';
import { getBreakpointMessageAndIcon } from './breakpointsView.js';
import { BreakpointWidget } from './breakpointWidget.js';
import * as icons from './debugIcons.js';
import { BREAKPOINT_EDITOR_CONTRIBUTION_ID, BreakpointWidgetContext, CONTEXT_BREAKPOINT_WIDGET_VISIBLE, DebuggerString, IBreakpoint, IBreakpointEditorContribution, IBreakpointUpdateData, IDebugConfiguration, IDebugService, IDebugSession, State } from '../common/debug.js';

const $ = dom.$;

interface IBreakpointDecoration {
	decorationId: string;
	breakpoint: IBreakpoint;
	range: Range;
	inlineWidget?: InlineBreakpointWidget;
}

const breakpointHelperDecoration: IModelDecorationOptions = {
	description: 'breakpoint-helper-decoration',
	glyphMarginClassName: ThemeIcon.asClassName(icons.debugBreakpointHint),
	glyphMargin: { position: GlyphMarginLane.Right },
	glyphMarginHoverMessage: new MarkdownString().appendText(nls.localize('breakpointHelper', "Click to add a breakpoint")),
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
};

export function createBreakpointDecorations(accessor: ServicesAccessor, model: ITextModel, breakpoints: ReadonlyArray<IBreakpoint>, state: State, breakpointsActivated: boolean, showBreakpointsInOverviewRuler: boolean): { range: Range; options: IModelDecorationOptions }[] {
	const result: { range: Range; options: IModelDecorationOptions }[] = [];
	breakpoints.forEach((breakpoint) => {
		if (breakpoint.lineNumber > model.getLineCount()) {
			return;
		}
		const hasOtherBreakpointsOnLine = breakpoints.some(bp => bp !== breakpoint && bp.lineNumber === breakpoint.lineNumber);
		const column = model.getLineFirstNonWhitespaceColumn(breakpoint.lineNumber);
		const range = model.validateRange(
			breakpoint.column ? new Range(breakpoint.lineNumber, breakpoint.column, breakpoint.lineNumber, breakpoint.column + 1)
				: new Range(breakpoint.lineNumber, column, breakpoint.lineNumber, column + 1) // Decoration has to have a width #20688
		);

		result.push({
			options: getBreakpointDecorationOptions(accessor, model, breakpoint, state, breakpointsActivated, showBreakpointsInOverviewRuler, hasOtherBreakpointsOnLine),
			range
		});
	});

	return result;
}

function getBreakpointDecorationOptions(accessor: ServicesAccessor, model: ITextModel, breakpoint: IBreakpoint, state: State, breakpointsActivated: boolean, showBreakpointsInOverviewRuler: boolean, hasOtherBreakpointsOnLine: boolean): IModelDecorationOptions {
	const debugService = accessor.get(IDebugService);
	const languageService = accessor.get(ILanguageService);
	const labelService = accessor.get(ILabelService);
	const { icon, message, showAdapterUnverifiedMessage } = getBreakpointMessageAndIcon(state, breakpointsActivated, breakpoint, labelService, debugService.getModel());
	let glyphMarginHoverMessage: MarkdownString | undefined;

	let unverifiedMessage: string | undefined;
	if (showAdapterUnverifiedMessage) {
		let langId: string | undefined;
		unverifiedMessage = debugService.getModel().getSessions().map(s => {
			const dbg = debugService.getAdapterManager().getDebugger(s.configuration.type);
			const message = dbg?.strings?.[DebuggerString.UnverifiedBreakpoints];
			if (message) {
				if (!langId) {
					// Lazily compute this, only if needed for some debug adapter
					langId = languageService.guessLanguageIdByFilepathOrFirstLine(breakpoint.uri) ?? undefined;
				}
				return langId && dbg.interestedInLanguage(langId) ? message : undefined;
			}

			return undefined;
		})
			.find(messages => !!messages);
	}

	if (message) {
		glyphMarginHoverMessage = new MarkdownString(undefined, { isTrusted: true, supportThemeIcons: true });
		if (breakpoint.condition || breakpoint.hitCondition) {
			const languageId = model.getLanguageId();
			glyphMarginHoverMessage.appendCodeblock(languageId, message);
			if (unverifiedMessage) {
				glyphMarginHoverMessage.appendMarkdown('$(warning) ' + unverifiedMessage);
			}
		} else {
			glyphMarginHoverMessage.appendText(message);
			if (unverifiedMessage) {
				glyphMarginHoverMessage.appendMarkdown('\n\n$(warning) ' + unverifiedMessage);
			}
		}
	} else if (unverifiedMessage) {
		glyphMarginHoverMessage = new MarkdownString(undefined, { isTrusted: true, supportThemeIcons: true }).appendMarkdown(unverifiedMessage);
	}

	let overviewRulerDecoration: IModelDecorationOverviewRulerOptions | null = null;
	if (showBreakpointsInOverviewRuler) {
		overviewRulerDecoration = {
			color: themeColorFromId(debugIconBreakpointForeground),
			position: OverviewRulerLane.Left
		};
	}

	const renderInline = breakpoint.column && (hasOtherBreakpointsOnLine || breakpoint.column > model.getLineFirstNonWhitespaceColumn(breakpoint.lineNumber));
	return {
		description: 'breakpoint-decoration',
		glyphMargin: { position: GlyphMarginLane.Right },
		glyphMarginClassName: ThemeIcon.asClassName(icon),
		glyphMarginHoverMessage,
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		before: renderInline ? {
			content: noBreakWhitespace,
			inlineClassName: `debug-breakpoint-placeholder`,
			inlineClassNameAffectsLetterSpacing: true
		} : undefined,
		overviewRuler: overviewRulerDecoration,
		zIndex: 9999
	};
}

type BreakpointsForLine = { lineNumber: number; positions: IPosition[] };

async function requestBreakpointCandidateLocations(model: ITextModel, lineNumbers: number[], session: IDebugSession): Promise<BreakpointsForLine[]> {
	if (!session.capabilities.supportsBreakpointLocationsRequest) {
		return [];
	}

	return await Promise.all(distinct(lineNumbers, l => l).map(async lineNumber => {
		try {
			return { lineNumber, positions: await session.breakpointsLocations(model.uri, lineNumber) };
		} catch {
			return { lineNumber, positions: [] };
		}
	}));
}

function createCandidateDecorations(model: ITextModel, breakpointDecorations: IBreakpointDecoration[], lineBreakpoints: BreakpointsForLine[]): { range: Range; options: IModelDecorationOptions; breakpoint: IBreakpoint | undefined }[] {
	const result: { range: Range; options: IModelDecorationOptions; breakpoint: IBreakpoint | undefined }[] = [];
	for (const { positions, lineNumber } of lineBreakpoints) {
		if (positions.length === 0) {
			continue;
		}

		// Do not render candidates if there is only one, since it is already covered by the line breakpoint
		const firstColumn = model.getLineFirstNonWhitespaceColumn(lineNumber);
		const lastColumn = model.getLineLastNonWhitespaceColumn(lineNumber);
		positions.forEach(p => {
			const range = new Range(p.lineNumber, p.column, p.lineNumber, p.column + 1);
			if ((p.column <= firstColumn && !breakpointDecorations.some(bp => bp.range.startColumn > firstColumn && bp.range.startLineNumber === p.lineNumber)) || p.column > lastColumn) {
				// Do not render candidates on the start of the line if there's no other breakpoint on the line.
				return;
			}

			const breakpointAtPosition = breakpointDecorations.find(bpd => bpd.range.equalsRange(range));
			if (breakpointAtPosition && breakpointAtPosition.inlineWidget) {
				// Space already occupied, do not render candidate.
				return;
			}
			result.push({
				range,
				options: {
					description: 'breakpoint-placeholder-decoration',
					stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
					before: breakpointAtPosition ? undefined : {
						content: noBreakWhitespace,
						inlineClassName: `debug-breakpoint-placeholder`,
						inlineClassNameAffectsLetterSpacing: true
					},
				},
				breakpoint: breakpointAtPosition ? breakpointAtPosition.breakpoint : undefined
			});
		});
	}

	return result;
}

export class BreakpointEditorContribution implements IBreakpointEditorContribution {

	private breakpointHintDecoration: string | null = null;
	private breakpointWidget: BreakpointWidget | undefined;
	private breakpointWidgetVisible!: IContextKey<boolean>;
	private toDispose: IDisposable[] = [];
	private ignoreDecorationsChangedEvent = false;
	private ignoreBreakpointsChangeEvent = false;
	private breakpointDecorations: IBreakpointDecoration[] = [];
	private candidateDecorations: { decorationId: string; inlineWidget: InlineBreakpointWidget }[] = [];
	private setDecorationsScheduler!: RunOnceScheduler;

	constructor(
		private readonly editor: ICodeEditor,
		@IDebugService private readonly debugService: IDebugService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IDialogService private readonly dialogService: IDialogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILabelService private readonly labelService: ILabelService
	) {
		this.breakpointWidgetVisible = CONTEXT_BREAKPOINT_WIDGET_VISIBLE.bindTo(contextKeyService);
		this.setDecorationsScheduler = new RunOnceScheduler(() => this.setDecorations(), 30);
		this.setDecorationsScheduler.schedule();
		this.registerListeners();
	}

	/**
	 * Returns context menu actions at the line number if breakpoints can be
	 * set. This is used by the {@link TestingDecorations} to allow breakpoint
	 * setting on lines where breakpoint "run" actions are present.
	 */
	public getContextMenuActionsAtPosition(lineNumber: number, model: ITextModel) {
		if (!this.debugService.getAdapterManager().hasEnabledDebuggers()) {
			return [];
		}

		if (!this.debugService.canSetBreakpointsIn(model)) {
			return [];
		}

		const breakpoints = this.debugService.getModel().getBreakpoints({ lineNumber, uri: model.uri });
		return this.getContextMenuActions(breakpoints, model.uri, lineNumber);
	}

	private registerListeners(): void {
		this.toDispose.push(this.editor.onMouseDown(async (e: IEditorMouseEvent) => {
			if (!this.debugService.getAdapterManager().hasEnabledDebuggers()) {
				return;
			}

			const model = this.editor.getModel();
			if (!e.target.position
				|| !model
				|| e.target.type !== MouseTargetType.GUTTER_GLYPH_MARGIN
				|| e.target.detail.isAfterLines
				|| !this.marginFreeFromNonDebugDecorations(e.target.position.lineNumber)
				// don't return early if there's a breakpoint
				&& !e.target.element?.className.includes('breakpoint')
			) {
				return;
			}
			const canSetBreakpoints = this.debugService.canSetBreakpointsIn(model);
			const lineNumber = e.target.position.lineNumber;
			const uri = model.uri;

			if (e.event.rightButton || (env.isMacintosh && e.event.leftButton && e.event.ctrlKey)) {
				// handled by editor gutter context menu
				return;
			} else {
				const breakpoints = this.debugService.getModel().getBreakpoints({ uri, lineNumber });

				if (breakpoints.length) {
					const isShiftPressed = e.event.shiftKey;
					const enabled = breakpoints.some(bp => bp.enabled);

					if (isShiftPressed) {
						breakpoints.forEach(bp => this.debugService.enableOrDisableBreakpoints(!enabled, bp));
					} else if (!env.isLinux && breakpoints.some(bp => !!bp.condition || !!bp.logMessage || !!bp.hitCondition || !!bp.triggeredBy)) {
						// Show the dialog if there is a potential condition to be accidently lost.
						// Do not show dialog on linux due to electron issue freezing the mouse #50026
						const logPoint = breakpoints.every(bp => !!bp.logMessage);
						const breakpointType = logPoint ? nls.localize('logPoint', "Logpoint") : nls.localize('breakpoint', "Breakpoint");

						const disabledBreakpointDialogMessage = nls.localize(
							'breakpointHasConditionDisabled',
							"This {0} has a {1} that will get lost on remove. Consider enabling the {0} instead.",
							breakpointType.toLowerCase(),
							logPoint ? nls.localize('message', "message") : nls.localize('condition', "condition")
						);
						const enabledBreakpointDialogMessage = nls.localize(
							'breakpointHasConditionEnabled',
							"This {0} has a {1} that will get lost on remove. Consider disabling the {0} instead.",
							breakpointType.toLowerCase(),
							logPoint ? nls.localize('message', "message") : nls.localize('condition', "condition")
						);

						await this.dialogService.prompt({
							type: severity.Info,
							message: enabled ? enabledBreakpointDialogMessage : disabledBreakpointDialogMessage,
							buttons: [
								{
									label: nls.localize({ key: 'removeLogPoint', comment: ['&& denotes a mnemonic'] }, "&&Remove {0}", breakpointType),
									run: () => breakpoints.forEach(bp => this.debugService.removeBreakpoints(bp.getId()))
								},
								{
									label: nls.localize('disableLogPoint', "{0} {1}", enabled ? nls.localize({ key: 'disable', comment: ['&& denotes a mnemonic'] }, "&&Disable") : nls.localize({ key: 'enable', comment: ['&& denotes a mnemonic'] }, "&&Enable"), breakpointType),
									run: () => breakpoints.forEach(bp => this.debugService.enableOrDisableBreakpoints(!enabled, bp))
								}
							],
							cancelButton: true
						});
					} else {
						if (!enabled) {
							breakpoints.forEach(bp => this.debugService.enableOrDisableBreakpoints(!enabled, bp));
						} else {
							breakpoints.forEach(bp => this.debugService.removeBreakpoints(bp.getId()));
						}
					}
				} else if (canSetBreakpoints) {
					if (e.event.middleButton) {
						const action = this.configurationService.getValue<IDebugConfiguration>('debug').gutterMiddleClickAction;
						if (action !== 'none') {
							let context: BreakpointWidgetContext;
							switch (action) {
								case 'logpoint':
									context = BreakpointWidgetContext.LOG_MESSAGE;
									break;
								case 'conditionalBreakpoint':
									context = BreakpointWidgetContext.CONDITION;
									break;
								case 'triggeredBreakpoint':
									context = BreakpointWidgetContext.TRIGGER_POINT;
							}
							this.showBreakpointWidget(lineNumber, undefined, context);
						}
					} else {
						this.debugService.addBreakpoints(uri, [{ lineNumber }]);
					}
				}
			}
		}));

		if (!(BrowserFeatures.pointerEvents && isSafari)) {
			/**
			 * We disable the hover feature for Safari on iOS as
			 * 1. Browser hover events are handled specially by the system (it treats first click as hover if there is `:hover` css registered). Below hover behavior will confuse users with inconsistent expeirence.
			 * 2. When users click on line numbers, the breakpoint hint displays immediately, however it doesn't create the breakpoint unless users click on the left gutter. On a touch screen, it's hard to click on that small area.
			 */
			this.toDispose.push(this.editor.onMouseMove((e: IEditorMouseEvent) => {
				if (!this.debugService.getAdapterManager().hasEnabledDebuggers()) {
					return;
				}

				let showBreakpointHintAtLineNumber = -1;
				const model = this.editor.getModel();
				if (model && e.target.position && (e.target.type === MouseTargetType.GUTTER_GLYPH_MARGIN || e.target.type === MouseTargetType.GUTTER_LINE_NUMBERS) && this.debugService.canSetBreakpointsIn(model) &&
					this.marginFreeFromNonDebugDecorations(e.target.position.lineNumber)) {
					const data = e.target.detail;
					if (!data.isAfterLines) {
						showBreakpointHintAtLineNumber = e.target.position.lineNumber;
					}
				}
				this.ensureBreakpointHintDecoration(showBreakpointHintAtLineNumber);
			}));
			this.toDispose.push(this.editor.onMouseLeave(() => {
				this.ensureBreakpointHintDecoration(-1);
			}));
		}


		this.toDispose.push(this.editor.onDidChangeModel(async () => {
			this.closeBreakpointWidget();
			await this.setDecorations();
		}));
		this.toDispose.push(this.debugService.getModel().onDidChangeBreakpoints(() => {
			if (!this.ignoreBreakpointsChangeEvent && !this.setDecorationsScheduler.isScheduled()) {
				this.setDecorationsScheduler.schedule();
			}
		}));
		this.toDispose.push(this.debugService.onDidChangeState(() => {
			// We need to update breakpoint decorations when state changes since the top stack frame and breakpoint decoration might change
			if (!this.setDecorationsScheduler.isScheduled()) {
				this.setDecorationsScheduler.schedule();
			}
		}));
		this.toDispose.push(this.editor.onDidChangeModelDecorations(() => this.onModelDecorationsChanged()));
		this.toDispose.push(this.configurationService.onDidChangeConfiguration(async (e) => {
			if (e.affectsConfiguration('debug.showBreakpointsInOverviewRuler') || e.affectsConfiguration('debug.showInlineBreakpointCandidates')) {
				await this.setDecorations();
			}
		}));
	}

	private getContextMenuActions(breakpoints: ReadonlyArray<IBreakpoint>, uri: URI, lineNumber: number, column?: number): IAction[] {
		const actions: IAction[] = [];

		if (breakpoints.length === 1) {
			const breakpointType = breakpoints[0].logMessage ? nls.localize('logPoint', "Logpoint") : nls.localize('breakpoint', "Breakpoint");
			actions.push(toAction({
				id: 'debug.removeBreakpoint', label: nls.localize('removeBreakpoint', "Remove {0}", breakpointType), enabled: true, run: async () => {
					await this.debugService.removeBreakpoints(breakpoints[0].getId());
				}
			}));
			actions.push(toAction({
				id: 'workbench.debug.action.editBreakpointAction',
				label: nls.localize('editBreakpoint', "Edit {0}...", breakpointType),
				enabled: true,
				run: () => Promise.resolve(this.showBreakpointWidget(breakpoints[0].lineNumber, breakpoints[0].column))
			})); actions.push(toAction({
				id: `workbench.debug.viewlet.action.toggleBreakpoint`,
				label: breakpoints[0].enabled ? nls.localize('disableBreakpoint', "Disable {0}", breakpointType) : nls.localize('enableBreakpoint', "Enable {0}", breakpointType),
				enabled: true,
				run: () => this.debugService.enableOrDisableBreakpoints(!breakpoints[0].enabled, breakpoints[0])
			}));
		} else if (breakpoints.length > 1) {
			const sorted = breakpoints.slice().sort((first, second) => (first.column && second.column) ? first.column - second.column : 1);
			actions.push(new SubmenuAction('debug.removeBreakpoints', nls.localize('removeBreakpoints', "Remove Breakpoints"), sorted.map(bp => toAction({
				id: 'removeInlineBreakpoint',
				label: bp.column ? nls.localize('removeInlineBreakpointOnColumn', "Remove Inline Breakpoint on Column {0}", bp.column) : nls.localize('removeLineBreakpoint', "Remove Line Breakpoint"),
				enabled: true,
				run: () => this.debugService.removeBreakpoints(bp.getId())
			})))); actions.push(new SubmenuAction('debug.editBreakpoints', nls.localize('editBreakpoints', "Edit Breakpoints"), sorted.map(bp =>
				toAction({
					id: 'editBreakpoint',
					label: bp.column ? nls.localize('editInlineBreakpointOnColumn', "Edit Inline Breakpoint on Column {0}", bp.column) : nls.localize('editLineBreakpoint', "Edit Line Breakpoint"),
					enabled: true,
					run: () => Promise.resolve(this.showBreakpointWidget(bp.lineNumber, bp.column))
				})
			))); actions.push(new SubmenuAction('debug.enableDisableBreakpoints', nls.localize('enableDisableBreakpoints', "Enable/Disable Breakpoints"), sorted.map(bp => toAction({
				id: bp.enabled ? 'disableColumnBreakpoint' : 'enableColumnBreakpoint',
				label: bp.enabled ? (bp.column ? nls.localize('disableInlineColumnBreakpoint', "Disable Inline Breakpoint on Column {0}", bp.column) : nls.localize('disableBreakpointOnLine', "Disable Line Breakpoint"))
					: (bp.column ? nls.localize('enableBreakpoints', "Enable Inline Breakpoint on Column {0}", bp.column) : nls.localize('enableBreakpointOnLine', "Enable Line Breakpoint")),
				enabled: true,
				run: () => this.debugService.enableOrDisableBreakpoints(!bp.enabled, bp)
			}))));
		} else {
			actions.push(toAction({
				id: 'addBreakpoint',
				label: nls.localize('addBreakpoint', "Add Breakpoint"),
				enabled: true,
				run: () => this.debugService.addBreakpoints(uri, [{ lineNumber, column }])
			}));
			actions.push(toAction({
				id: 'addConditionalBreakpoint',
				label: nls.localize('addConditionalBreakpoint', "Add Conditional Breakpoint..."),
				enabled: true,
				run: () => Promise.resolve(this.showBreakpointWidget(lineNumber, column, BreakpointWidgetContext.CONDITION))
			}));
			actions.push(toAction({
				id: 'addLogPoint',
				label: nls.localize('addLogPoint', "Add Logpoint..."),
				enabled: true,
				run: () => Promise.resolve(this.showBreakpointWidget(lineNumber, column, BreakpointWidgetContext.LOG_MESSAGE))
			}));
			actions.push(toAction({
				id: 'addTriggeredBreakpoint',
				label: nls.localize('addTriggeredBreakpoint', "Add Triggered Breakpoint..."),
				enabled: true,
				run: () => Promise.resolve(this.showBreakpointWidget(lineNumber, column, BreakpointWidgetContext.TRIGGER_POINT))
			}));
		}

		if (this.debugService.state === State.Stopped) {
			actions.push(new Separator());
			actions.push(toAction({
				id: 'runToLine',
				label: nls.localize('runToLine', "Run to Line"),
				enabled: true,
				run: () => this.debugService.runTo(uri, lineNumber).catch(onUnexpectedError)
			}));
		} return actions;
	}

	private marginFreeFromNonDebugDecorations(line: number): boolean {
		const decorations = this.editor.getLineDecorations(line);
		if (decorations) {
			for (const { options } of decorations) {
				const clz = options.glyphMarginClassName;
				if (!clz) {
					continue;
				}
				const hasSomeActionableCodicon = !(clz.includes('codicon-') || clz.startsWith('coverage-deco-')) || clz.includes('codicon-testing-') || clz.includes('codicon-merge-') || clz.includes('codicon-arrow-') || clz.includes('codicon-loading') || clz.includes('codicon-fold') || clz.includes('codicon-gutter-lightbulb') || clz.includes('codicon-lightbulb-sparkle');
				if (hasSomeActionableCodicon) {
					return false;
				}
			}
		}

		return true;
	}

	private ensureBreakpointHintDecoration(showBreakpointHintAtLineNumber: number): void {
		this.editor.changeDecorations((accessor) => {
			if (this.breakpointHintDecoration) {
				accessor.removeDecoration(this.breakpointHintDecoration);
				this.breakpointHintDecoration = null;
			}
			if (showBreakpointHintAtLineNumber !== -1) {
				this.breakpointHintDecoration = accessor.addDecoration({
					startLineNumber: showBreakpointHintAtLineNumber,
					startColumn: 1,
					endLineNumber: showBreakpointHintAtLineNumber,
					endColumn: 1
				}, breakpointHelperDecoration
				);
			}
		});
	}

	private async setDecorations(): Promise<void> {
		if (!this.editor.hasModel()) {
			return;
		}

		const setCandidateDecorations = (changeAccessor: IModelDecorationsChangeAccessor, desiredCandidatePositions: BreakpointsForLine[]) => {
			const desiredCandidateDecorations = createCandidateDecorations(model, this.breakpointDecorations, desiredCandidatePositions);
			const candidateDecorationIds = changeAccessor.deltaDecorations(this.candidateDecorations.map(c => c.decorationId), desiredCandidateDecorations);
			this.candidateDecorations.forEach(candidate => {
				candidate.inlineWidget.dispose();
			});
			this.candidateDecorations = candidateDecorationIds.map((decorationId, index) => {
				const candidate = desiredCandidateDecorations[index];
				// Candidate decoration has a breakpoint attached when a breakpoint is already at that location and we did not yet set a decoration there
				// In practice this happens for the first breakpoint that was set on a line
				// We could have also rendered this first decoration as part of desiredBreakpointDecorations however at that moment we have no location information
				const icon = candidate.breakpoint ? getBreakpointMessageAndIcon(this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), candidate.breakpoint, this.labelService, this.debugService.getModel()).icon : icons.breakpoint.disabled;
				const contextMenuActions = () => this.getContextMenuActions(candidate.breakpoint ? [candidate.breakpoint] : [], activeCodeEditor.getModel().uri, candidate.range.startLineNumber, candidate.range.startColumn);
				const inlineWidget = new InlineBreakpointWidget(activeCodeEditor, decorationId, ThemeIcon.asClassName(icon), candidate.breakpoint, this.debugService, this.contextMenuService, contextMenuActions);

				return {
					decorationId,
					inlineWidget
				};
			});
		};

		const activeCodeEditor = this.editor;
		const model = activeCodeEditor.getModel();
		const breakpoints = this.debugService.getModel().getBreakpoints({ uri: model.uri });
		const debugSettings = this.configurationService.getValue<IDebugConfiguration>('debug');
		const desiredBreakpointDecorations = this.instantiationService.invokeFunction(accessor => createBreakpointDecorations(accessor, model, breakpoints, this.debugService.state, this.debugService.getModel().areBreakpointsActivated(), debugSettings.showBreakpointsInOverviewRuler));

		// try to set breakpoint location candidates in the same changeDecorations()
		// call to avoid flickering, if the DA responds reasonably quickly.
		const session = this.debugService.getViewModel().focusedSession;
		const desiredCandidatePositions = debugSettings.showInlineBreakpointCandidates && session ? requestBreakpointCandidateLocations(this.editor.getModel(), desiredBreakpointDecorations.map(bp => bp.range.startLineNumber), session) : Promise.resolve([]);
		const desiredCandidatePositionsRaced = await Promise.race([desiredCandidatePositions, timeout(500).then(() => undefined)]);
		if (desiredCandidatePositionsRaced === undefined) { // the timeout resolved first
			desiredCandidatePositions.then(v => activeCodeEditor.changeDecorations(d => setCandidateDecorations(d, v)));
		}

		try {
			this.ignoreDecorationsChangedEvent = true;

			// Set breakpoint decorations
			activeCodeEditor.changeDecorations((changeAccessor) => {
				const decorationIds = changeAccessor.deltaDecorations(this.breakpointDecorations.map(bpd => bpd.decorationId), desiredBreakpointDecorations);
				this.breakpointDecorations.forEach(bpd => {
					bpd.inlineWidget?.dispose();
				});
				this.breakpointDecorations = decorationIds.map((decorationId, index) => {
					let inlineWidget: InlineBreakpointWidget | undefined = undefined;
					const breakpoint = breakpoints[index];
					if (desiredBreakpointDecorations[index].options.before) {
						const contextMenuActions = () => this.getContextMenuActions([breakpoint], activeCodeEditor.getModel().uri, breakpoint.lineNumber, breakpoint.column);
						inlineWidget = new InlineBreakpointWidget(activeCodeEditor, decorationId, desiredBreakpointDecorations[index].options.glyphMarginClassName, breakpoint, this.debugService, this.contextMenuService, contextMenuActions);
					}

					return {
						decorationId,
						breakpoint,
						range: desiredBreakpointDecorations[index].range,
						inlineWidget
					};
				});

				if (desiredCandidatePositionsRaced) {
					setCandidateDecorations(changeAccessor, desiredCandidatePositionsRaced);
				}
			});
		} finally {
			this.ignoreDecorationsChangedEvent = false;
		}

		for (const d of this.breakpointDecorations) {
			if (d.inlineWidget) {
				this.editor.layoutContentWidget(d.inlineWidget);
			}
		}
	}

	private async onModelDecorationsChanged(): Promise<void> {
		if (this.breakpointDecorations.length === 0 || this.ignoreDecorationsChangedEvent || !this.editor.hasModel()) {
			// I have no decorations
			return;
		}
		let somethingChanged = false;
		const model = this.editor.getModel();
		this.breakpointDecorations.forEach(breakpointDecoration => {
			if (somethingChanged) {
				return;
			}
			const newBreakpointRange = model.getDecorationRange(breakpointDecoration.decorationId);
			if (newBreakpointRange && (!breakpointDecoration.range.equalsRange(newBreakpointRange))) {
				somethingChanged = true;
				breakpointDecoration.range = newBreakpointRange;
			}
		});
		if (!somethingChanged) {
			// nothing to do, my decorations did not change.
			return;
		}

		const data = new Map<string, IBreakpointUpdateData>();
		for (let i = 0, len = this.breakpointDecorations.length; i < len; i++) {
			const breakpointDecoration = this.breakpointDecorations[i];
			const decorationRange = model.getDecorationRange(breakpointDecoration.decorationId);
			// check if the line got deleted.
			if (decorationRange) {
				// since we know it is collapsed, it cannot grow to multiple lines
				if (breakpointDecoration.breakpoint) {
					data.set(breakpointDecoration.breakpoint.getId(), {
						lineNumber: decorationRange.startLineNumber,
						column: breakpointDecoration.breakpoint.column ? decorationRange.startColumn : undefined,
					});
				}
			}
		}

		try {
			this.ignoreBreakpointsChangeEvent = true;
			await this.debugService.updateBreakpoints(model.uri, data, true);
		} finally {
			this.ignoreBreakpointsChangeEvent = false;
		}
	}

	// breakpoint widget
	showBreakpointWidget(lineNumber: number, column: number | undefined, context?: BreakpointWidgetContext): void {
		this.breakpointWidget?.dispose();

		this.breakpointWidget = this.instantiationService.createInstance(BreakpointWidget, this.editor, lineNumber, column, context);
		this.breakpointWidget.show({ lineNumber, column: 1 });
		this.breakpointWidgetVisible.set(true);
	}

	closeBreakpointWidget(): void {
		if (this.breakpointWidget) {
			this.breakpointWidget.dispose();
			this.breakpointWidget = undefined;
			this.breakpointWidgetVisible.reset();
			this.editor.focus();
		}
	}

	dispose(): void {
		this.breakpointWidget?.dispose();
		this.setDecorationsScheduler.dispose();
		this.editor.removeDecorations(this.breakpointDecorations.map(bpd => bpd.decorationId));
		dispose(this.toDispose);
	}
}

GutterActionsRegistry.registerGutterActionsGenerator(({ lineNumber, editor, accessor }, result) => {
	const model = editor.getModel();
	const debugService = accessor.get(IDebugService);
	if (!model || !debugService.getAdapterManager().hasEnabledDebuggers() || !debugService.canSetBreakpointsIn(model)) {
		return;
	}

	const breakpointEditorContribution = editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID);
	if (!breakpointEditorContribution) {
		return;
	}

	const actions = breakpointEditorContribution.getContextMenuActionsAtPosition(lineNumber, model);

	for (const action of actions) {
		result.push(action, '2_debug');
	}
});

class InlineBreakpointWidget implements IContentWidget, IDisposable {

	// editor.IContentWidget.allowEditorOverflow
	allowEditorOverflow = false;
	suppressMouseDown = true;

	private domNode!: HTMLElement;
	private range: Range | null;
	private toDispose: IDisposable[] = [];

	constructor(
		private readonly editor: IActiveCodeEditor,
		private readonly decorationId: string,
		cssClass: string | null | undefined,
		private readonly breakpoint: IBreakpoint | undefined,
		private readonly debugService: IDebugService,
		private readonly contextMenuService: IContextMenuService,
		private readonly getContextMenuActions: () => IAction[]
	) {
		this.range = this.editor.getModel().getDecorationRange(decorationId);
		this.toDispose.push(this.editor.onDidChangeModelDecorations(() => {
			const model = this.editor.getModel();
			const range = model.getDecorationRange(this.decorationId);
			if (this.range && !this.range.equalsRange(range)) {
				this.range = range;
				this.editor.layoutContentWidget(this);
				this.updateSize();
			}
		}));
		this.create(cssClass);

		this.editor.addContentWidget(this);
		this.editor.layoutContentWidget(this);
	}

	private create(cssClass: string | null | undefined): void {
		this.domNode = $('.inline-breakpoint-widget');
		if (cssClass) {
			this.domNode.classList.add(...cssClass.split(' '));
		}
		this.toDispose.push(dom.addDisposableListener(this.domNode, dom.EventType.CLICK, async e => {
			switch (this.breakpoint?.enabled) {
				case undefined:
					await this.debugService.addBreakpoints(this.editor.getModel().uri, [{ lineNumber: this.range!.startLineNumber, column: this.range!.startColumn }]);
					break;
				case true:
					await this.debugService.removeBreakpoints(this.breakpoint.getId());
					break;
				case false:
					this.debugService.enableOrDisableBreakpoints(true, this.breakpoint);
					break;
			}
		}));
		this.toDispose.push(dom.addDisposableListener(this.domNode, dom.EventType.CONTEXT_MENU, e => {
			const event = new StandardMouseEvent(dom.getWindow(this.domNode), e);
			const actions = this.getContextMenuActions();
			this.contextMenuService.showContextMenu({
				getAnchor: () => event,
				getActions: () => actions,
				getActionsContext: () => this.breakpoint,
				onHide: () => disposeIfDisposable(actions)
			});
		}));

		this.updateSize();

		this.toDispose.push(this.editor.onDidChangeConfiguration(c => {
			if (c.hasChanged(EditorOption.fontSize) || c.hasChanged(EditorOption.lineHeight)) {
				this.updateSize();
			}
		}));
	}

	private updateSize() {
		const lineHeight = this.range ? this.editor.getLineHeightForPosition(this.range.getStartPosition()) : this.editor.getOption(EditorOption.lineHeight);
		this.domNode.style.height = `${lineHeight}px`;
		this.domNode.style.width = `${Math.ceil(0.8 * lineHeight)}px`;
		this.domNode.style.marginLeft = `4px`;
	}

	@memoize
	getId(): string {
		return generateUuid();
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		if (!this.range) {
			return null;
		}
		// Workaround: since the content widget can not be placed before the first column we need to force the left position
		this.domNode.classList.toggle('line-start', this.range.startColumn === 1);

		return {
			position: { lineNumber: this.range.startLineNumber, column: this.range.startColumn - 1 },
			preference: [ContentWidgetPositionPreference.EXACT]
		};
	}

	dispose(): void {
		this.editor.removeContentWidget(this);
		dispose(this.toDispose);
	}
}

registerThemingParticipant((theme, collector) => {
	const scope = '.monaco-editor .glyph-margin-widgets, .monaco-workbench .debug-breakpoints, .monaco-workbench .disassembly-view, .monaco-editor .contentWidgets';
	const debugIconBreakpointColor = theme.getColor(debugIconBreakpointForeground);
	if (debugIconBreakpointColor) {
		collector.addRule(`${scope} {
			${icons.allBreakpoints.map(b => `${ThemeIcon.asCSSSelector(b.regular)}`).join(',\n		')},
			${ThemeIcon.asCSSSelector(icons.debugBreakpointUnsupported)},
			${ThemeIcon.asCSSSelector(icons.debugBreakpointHint)}:not([class*='codicon-debug-breakpoint']):not([class*='codicon-debug-stackframe']),
			${ThemeIcon.asCSSSelector(icons.breakpoint.regular)}${ThemeIcon.asCSSSelector(icons.debugStackframeFocused)}::after,
			${ThemeIcon.asCSSSelector(icons.breakpoint.regular)}${ThemeIcon.asCSSSelector(icons.debugStackframe)}::after {
				color: ${debugIconBreakpointColor} !important;
			}
		}`);

		collector.addRule(`${scope} {
			${ThemeIcon.asCSSSelector(icons.breakpoint.pending)} {
				color: ${debugIconBreakpointColor} !important;
				font-size: 12px !important;
			}
		}`);
	}

	const debugIconBreakpointDisabledColor = theme.getColor(debugIconBreakpointDisabledForeground);
	if (debugIconBreakpointDisabledColor) {
		collector.addRule(`${scope} {
			${icons.allBreakpoints.map(b => ThemeIcon.asCSSSelector(b.disabled)).join(',\n		')} {
				color: ${debugIconBreakpointDisabledColor};
			}
		}`);
	}

	const debugIconBreakpointUnverifiedColor = theme.getColor(debugIconBreakpointUnverifiedForeground);
	if (debugIconBreakpointUnverifiedColor) {
		collector.addRule(`${scope} {
			${icons.allBreakpoints.map(b => ThemeIcon.asCSSSelector(b.unverified)).join(',\n		')} {
				color: ${debugIconBreakpointUnverifiedColor};
			}
		}`);
	}

	const debugIconBreakpointCurrentStackframeForegroundColor = theme.getColor(debugIconBreakpointCurrentStackframeForeground);
	if (debugIconBreakpointCurrentStackframeForegroundColor) {
		collector.addRule(`
		.monaco-editor .debug-top-stack-frame-column {
			color: ${debugIconBreakpointCurrentStackframeForegroundColor} !important;
		}
		${scope} {
			${ThemeIcon.asCSSSelector(icons.debugStackframe)} {
				color: ${debugIconBreakpointCurrentStackframeForegroundColor} !important;
			}
		}
		`);
	}

	const debugIconBreakpointStackframeFocusedColor = theme.getColor(debugIconBreakpointStackframeForeground);
	if (debugIconBreakpointStackframeFocusedColor) {
		collector.addRule(`${scope} {
			${ThemeIcon.asCSSSelector(icons.debugStackframeFocused)} {
				color: ${debugIconBreakpointStackframeFocusedColor} !important;
			}
		}`);
	}
});

export const debugIconBreakpointForeground = registerColor('debugIcon.breakpointForeground', '#E51400', nls.localize('debugIcon.breakpointForeground', 'Icon color for breakpoints.'));
const debugIconBreakpointDisabledForeground = registerColor('debugIcon.breakpointDisabledForeground', '#848484', nls.localize('debugIcon.breakpointDisabledForeground', 'Icon color for disabled breakpoints.'));
const debugIconBreakpointUnverifiedForeground = registerColor('debugIcon.breakpointUnverifiedForeground', '#848484', nls.localize('debugIcon.breakpointUnverifiedForeground', 'Icon color for unverified breakpoints.'));
const debugIconBreakpointCurrentStackframeForeground = registerColor('debugIcon.breakpointCurrentStackframeForeground', { dark: '#FFCC00', light: '#BE8700', hcDark: '#FFCC00', hcLight: '#BE8700' }, nls.localize('debugIcon.breakpointCurrentStackframeForeground', 'Icon color for the current breakpoint stack frame.'));
const debugIconBreakpointStackframeForeground = registerColor('debugIcon.breakpointStackframeForeground', '#89D185', nls.localize('debugIcon.breakpointStackframeForeground', 'Icon color for all breakpoint stack frames.'));
```

--------------------------------------------------------------------------------

````

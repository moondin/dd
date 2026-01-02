---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 536
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 536 of 552)

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

---[FILE: src/vs/workbench/services/untitled/common/untitledTextEditorModel.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/common/untitledTextEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISaveOptions } from '../../../common/editor.js';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IWorkingCopyBackupService } from '../../workingCopy/common/workingCopyBackup.js';
import { ITextResourceConfigurationChangeEvent, ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { createTextBufferFactory, createTextBufferFactoryFromStream } from '../../../../editor/common/model/textModel.js';
import { ITextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { IWorkingCopyService } from '../../workingCopy/common/workingCopyService.js';
import { IWorkingCopy, WorkingCopyCapabilities, IWorkingCopyBackup, NO_TYPE_ID, IWorkingCopySaveEvent } from '../../workingCopy/common/workingCopy.js';
import { IEncodingSupport, ILanguageSupport, ITextFileService } from '../../textfile/common/textfiles.js';
import { IModelContentChangedEvent } from '../../../../editor/common/textModelEvents.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ensureValidWordDefinition } from '../../../../editor/common/core/wordHelper.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { getCharContainingOffset } from '../../../../base/common/strings.js';
import { UTF8 } from '../../textfile/common/encoding.js';
import { bufferToReadable, bufferToStream, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { ILanguageDetectionService } from '../../languageDetection/common/languageDetectionWorkerService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';

export interface IUntitledTextEditorModel extends ITextEditorModel, ILanguageSupport, IEncodingSupport, IWorkingCopy {

	/**
	 * Emits an event when the encoding of this untitled model changes.
	 */
	readonly onDidChangeEncoding: Event<void>;

	/**
	 * Emits an event when the name of this untitled model changes.
	 */
	readonly onDidChangeName: Event<void>;

	/**
	 * Emits an event when this untitled model is reverted.
	 */
	readonly onDidRevert: Event<void>;

	/**
	 * Whether this untitled text model has an associated file path.
	 */
	readonly hasAssociatedFilePath: boolean;

	/**
	 * Whether this model has an explicit language or not.
	 */
	readonly hasLanguageSetExplicitly: boolean;

	/**
	 * Sets the encoding to use for this untitled model.
	 */
	setEncoding(encoding: string): Promise<void>;

	/**
	 * Resolves the untitled model.
	 */
	resolve(): Promise<void>;

	/**
	 * Whether this model is resolved or not.
	 */
	isResolved(): this is IResolvedUntitledTextEditorModel;
}

export interface IResolvedUntitledTextEditorModel extends IUntitledTextEditorModel {

	readonly textEditorModel: ITextModel;
}

export class UntitledTextEditorModel extends BaseTextEditorModel implements IUntitledTextEditorModel {

	private static readonly FIRST_LINE_NAME_MAX_LENGTH = 40;
	private static readonly FIRST_LINE_NAME_CANDIDATE_MAX_LENGTH = this.FIRST_LINE_NAME_MAX_LENGTH * 10;

	// Support the special '${activeEditorLanguage}' language by
	// looking up the language id from the editor that is active
	// before the untitled editor opens. This special id is only
	// used for the initial language and can be changed after the
	// fact (either manually or through auto-detection).
	private static readonly ACTIVE_EDITOR_LANGUAGE_ID = '${activeEditorLanguage}';

	//#region Events

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidChangeName = this._register(new Emitter<void>());
	readonly onDidChangeName = this._onDidChangeName.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeEncoding = this._register(new Emitter<void>());
	readonly onDidChangeEncoding = this._onDidChangeEncoding.event;

	private readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<void>());
	readonly onDidRevert = this._onDidRevert.event;

	//#endregion

	readonly typeId = NO_TYPE_ID; // IMPORTANT: never change this to not break existing assumptions (e.g. backups)

	readonly capabilities = WorkingCopyCapabilities.Untitled;

	//#region Name

	private configuredLabelFormat: 'content' | 'name' = 'content';

	private cachedModelFirstLineWords: string | undefined = undefined;
	get name(): string {

		// Take name from first line if present and only if
		// we have no associated file path. In that case we
		// prefer the file name as title.
		if (this.configuredLabelFormat === 'content' && !this.hasAssociatedFilePath && this.cachedModelFirstLineWords) {
			return this.cachedModelFirstLineWords;
		}

		// Otherwise fallback to resource
		return this.labelService.getUriBasenameLabel(this.resource);
	}

	//#endregion

	constructor(
		readonly resource: URI,
		readonly hasAssociatedFilePath: boolean,
		private readonly initialValue: string | undefined,
		private preferredLanguageId: string | undefined,
		private preferredEncoding: string | undefined,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@IWorkingCopyBackupService private readonly workingCopyBackupService: IWorkingCopyBackupService,
		@ITextResourceConfigurationService private readonly textResourceConfigurationService: ITextResourceConfigurationService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@ILabelService private readonly labelService: ILabelService,
		@IEditorService private readonly editorService: IEditorService,
		@ILanguageDetectionService languageDetectionService: ILanguageDetectionService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
	) {
		super(modelService, languageService, languageDetectionService, accessibilityService);

		this.dirty = this.hasAssociatedFilePath || !!this.initialValue;

		// Make known to working copy service
		this._register(this.workingCopyService.registerWorkingCopy(this));

		// This is typically controlled by the setting `files.defaultLanguage`.
		// If that setting is set, we should not detect the language.
		if (preferredLanguageId) {
			this.setLanguageId(preferredLanguageId);
		}

		// Fetch config
		this.onConfigurationChange(undefined, false);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Config Changes
		this._register(this.textResourceConfigurationService.onDidChangeConfiguration(e => this.onConfigurationChange(e, true)));
	}

	private onConfigurationChange(e: ITextResourceConfigurationChangeEvent | undefined, fromEvent: boolean): void {

		// Encoding
		if (!e || e.affectsConfiguration(this.resource, 'files.encoding')) {
			const configuredEncoding = this.textResourceConfigurationService.getValue(this.resource, 'files.encoding');
			if (this.configuredEncoding !== configuredEncoding && typeof configuredEncoding === 'string') {
				this.configuredEncoding = configuredEncoding;

				if (fromEvent && !this.preferredEncoding) {
					this._onDidChangeEncoding.fire(); // do not fire event if we have a preferred encoding set
				}
			}
		}

		// Label Format
		if (!e || e.affectsConfiguration(this.resource, 'workbench.editor.untitled.labelFormat')) {
			const configuredLabelFormat = this.textResourceConfigurationService.getValue(this.resource, 'workbench.editor.untitled.labelFormat');
			if (this.configuredLabelFormat !== configuredLabelFormat && (configuredLabelFormat === 'content' || configuredLabelFormat === 'name')) {
				this.configuredLabelFormat = configuredLabelFormat;

				if (fromEvent) {
					this._onDidChangeName.fire();
				}
			}
		}
	}

	//#region Language

	override setLanguageId(languageId: string, source?: string): void {
		const actualLanguage: string | undefined = languageId === UntitledTextEditorModel.ACTIVE_EDITOR_LANGUAGE_ID
			? this.editorService.activeTextEditorLanguageId
			: languageId;
		this.preferredLanguageId = actualLanguage;

		if (actualLanguage) {
			super.setLanguageId(actualLanguage, source);
		}
	}

	override getLanguageId(): string | undefined {
		if (this.textEditorModel) {
			return this.textEditorModel.getLanguageId();
		}

		return this.preferredLanguageId;
	}

	//#endregion

	//#region Encoding

	private configuredEncoding: string | undefined;

	getEncoding(): string | undefined {
		return this.preferredEncoding || this.configuredEncoding;
	}

	async setEncoding(encoding: string): Promise<void> {
		const oldEncoding = this.getEncoding();
		this.preferredEncoding = encoding;

		// Emit if it changed
		if (oldEncoding !== this.preferredEncoding) {
			this._onDidChangeEncoding.fire();
		}
	}

	//#endregion

	//#region Dirty

	private dirty: boolean;

	isDirty(): boolean {
		return this.dirty;
	}

	isModified(): boolean {
		return this.isDirty();
	}

	private setDirty(dirty: boolean): void {
		if (this.dirty === dirty) {
			return;
		}

		this.dirty = dirty;
		this._onDidChangeDirty.fire();
	}

	//#endregion

	//#region Save / Revert / Backup

	async save(options?: ISaveOptions): Promise<boolean> {
		const target = await this.textFileService.save(this.resource, options);

		// Emit as event
		if (target) {
			this._onDidSave.fire({ reason: options?.reason, source: options?.source });
		}

		return !!target;
	}

	async revert(): Promise<void> {

		// Reset contents to be empty
		this.ignoreDirtyOnModelContentChange = true;
		try {
			this.updateTextEditorModel(createTextBufferFactory(''));
		} finally {
			this.ignoreDirtyOnModelContentChange = false;
		}

		// No longer dirty
		this.setDirty(false);

		// Emit as event
		this._onDidRevert.fire();
	}

	async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
		let content: VSBufferReadable | undefined = undefined;

		// Make sure to check whether this model has been resolved
		// or not and fallback to the initial value - if any - to
		// prevent backing up an unresolved model and loosing the
		// initial value.
		if (this.isResolved()) {
			// Fill in content the same way we would do when saving the file
			// via the text file service encoding support (hardcode UTF-8)
			content = await this.textFileService.getEncodedReadable(this.resource, this.createSnapshot() ?? undefined, { encoding: UTF8 });
		} else if (typeof this.initialValue === 'string') {
			content = bufferToReadable(VSBuffer.fromString(this.initialValue));
		}

		return { content };
	}

	//#endregion

	//#region Resolve

	private ignoreDirtyOnModelContentChange = false;

	override async resolve(): Promise<void> {

		// Create text editor model if not yet done
		let createdUntitledModel = false;
		let hasBackup = false;
		if (!this.textEditorModel) {
			let untitledContents: VSBufferReadableStream;

			// Check for backups or use initial value or empty
			const backup = await this.workingCopyBackupService.resolve(this);
			if (backup) {
				untitledContents = backup.value;
				hasBackup = true;
			} else {
				untitledContents = bufferToStream(VSBuffer.fromString(this.initialValue || ''));
			}

			// Determine untitled contents based on backup
			// or initial value. We must use text file service
			// to create the text factory to respect encodings
			// accordingly.
			const untitledContentsFactory = await createTextBufferFactoryFromStream(await this.textFileService.getDecodedStream(this.resource, untitledContents, { encoding: UTF8 }));

			this.createTextEditorModel(untitledContentsFactory, this.resource, this.preferredLanguageId);
			createdUntitledModel = true;
		}

		// Otherwise: the untitled model already exists and we must assume
		// that the value of the model was changed by the user. As such we
		// do not update the contents, only the language if configured.
		else {
			this.updateTextEditorModel(undefined, this.preferredLanguageId);
		}

		// Listen to text model events
		const textEditorModel = assertReturnsDefined(this.textEditorModel);
		this.installModelListeners(textEditorModel);

		// Only adjust name and dirty state etc. if we
		// actually created the untitled model
		if (createdUntitledModel) {

			// Name
			if (hasBackup || this.initialValue) {
				this.updateNameFromFirstLine(textEditorModel);
			}

			// Untitled associated to file path are dirty right away as well as untitled with content
			this.setDirty(this.hasAssociatedFilePath || !!hasBackup || !!this.initialValue);

			// If we have initial contents, make sure to emit this
			// as the appropiate events to the outside.
			if (hasBackup || this.initialValue) {
				this._onDidChangeContent.fire();
			}
		}

		return super.resolve();
	}

	override isResolved(): this is IResolvedUntitledTextEditorModel {
		return !!this.textEditorModelHandle;
	}

	protected override installModelListeners(model: ITextModel): void {
		this._register(model.onDidChangeContent(e => this.onModelContentChanged(model, e)));
		this._register(model.onDidChangeLanguage(() => this.onConfigurationChange(undefined, true))); // language change can have impact on config

		super.installModelListeners(model);
	}

	private onModelContentChanged(textEditorModel: ITextModel, e: IModelContentChangedEvent): void {
		if (!this.ignoreDirtyOnModelContentChange) {

			// mark the untitled text editor as non-dirty once its content becomes empty and we do
			// not have an associated path set. we never want dirty indicator in that case.
			if (!this.hasAssociatedFilePath && textEditorModel.getLineCount() === 1 && textEditorModel.getLineLength(1) === 0) {
				this.setDirty(false);
			}

			// turn dirty otherwise
			else {
				this.setDirty(true);
			}
		}

		// Check for name change if first line changed in the range of 0-FIRST_LINE_NAME_CANDIDATE_MAX_LENGTH columns
		if (e.changes.some(change => (change.range.startLineNumber === 1 || change.range.endLineNumber === 1) && change.range.startColumn <= UntitledTextEditorModel.FIRST_LINE_NAME_CANDIDATE_MAX_LENGTH)) {
			this.updateNameFromFirstLine(textEditorModel);
		}

		// Emit as general content change event
		this._onDidChangeContent.fire();

		// Detect language from content
		this.autoDetectLanguage();
	}

	private updateNameFromFirstLine(textEditorModel: ITextModel): void {
		if (this.hasAssociatedFilePath) {
			return; // not in case of an associated file path
		}

		// Determine the first words of the model following these rules:
		// - cannot be only whitespace (so we trim())
		// - cannot be only non-alphanumeric characters (so we run word definition regex over it)
		// - cannot be longer than FIRST_LINE_MAX_TITLE_LENGTH
		// - normalize multiple whitespaces to a single whitespace

		let modelFirstWordsCandidate: string | undefined = undefined;

		let firstLineText = textEditorModel
			.getValueInRange({
				startLineNumber: 1,
				endLineNumber: 1,
				startColumn: 1,
				endColumn: UntitledTextEditorModel.FIRST_LINE_NAME_CANDIDATE_MAX_LENGTH + 1		// first cap at FIRST_LINE_NAME_CANDIDATE_MAX_LENGTH
			})
			.trim().replace(/\s+/g, ' ') 														// normalize whitespaces
			.replace(/\u202E/g, '');															// drop Right-to-Left Override character (#190133)
		firstLineText = firstLineText.substr(0, getCharContainingOffset(						// finally cap at FIRST_LINE_NAME_MAX_LENGTH (grapheme aware #111235)
			firstLineText,
			UntitledTextEditorModel.FIRST_LINE_NAME_MAX_LENGTH)[0]
		);

		if (firstLineText && ensureValidWordDefinition().exec(firstLineText)) {
			modelFirstWordsCandidate = firstLineText;
		}

		if (modelFirstWordsCandidate !== this.cachedModelFirstLineWords) {
			this.cachedModelFirstLineWords = modelFirstWordsCandidate;
			this._onDidChangeName.fire();
		}
	}

	//#endregion

	override isReadonly(): boolean {
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/untitled/common/untitledTextEditorService.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/common/untitledTextEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { UntitledTextEditorModel, IUntitledTextEditorModel } from './untitledTextEditorModel.js';
import { IFilesConfiguration } from '../../../../platform/files/common/files.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export const IUntitledTextEditorService = createDecorator<IUntitledTextEditorService>('untitledTextEditorService');

export interface INewUntitledTextEditorOptions {

	/**
	 * Initial value of the untitled editor. An untitled editor with initial
	 * value is dirty right from the beginning.
	 */
	initialValue?: string;

	/**
	 * Preferred language id to use when saving the untitled editor.
	 */
	languageId?: string;

	/**
	 * Preferred encoding to use when saving the untitled editor.
	 */
	encoding?: string;
}

export interface IExistingUntitledTextEditorOptions extends INewUntitledTextEditorOptions {

	/**
	 * A resource to identify the untitled editor to create or return
	 * if already existing.
	 *
	 * Note: the resource will not be used unless the scheme is `untitled`.
	 */
	untitledResource?: URI;
}

export interface INewUntitledTextEditorWithAssociatedResourceOptions extends INewUntitledTextEditorOptions {

	/**
	 * Resource components to associate with the untitled editor. When saving
	 * the untitled editor, the associated components will be used and the user
	 * is not being asked to provide a file path.
	 *
	 * Note: currently it is not possible to specify the `scheme` to use. The
	 * untitled editor will saved to the default local or remote resource.
	 */
	associatedResource?: { authority: string; path: string; query: string; fragment: string };
}

type IInternalUntitledTextEditorOptions = IExistingUntitledTextEditorOptions & INewUntitledTextEditorWithAssociatedResourceOptions;

export interface IUntitledTextEditorModelSaveEvent {

	/**
	 * The source untitled file that was saved. It is disposed at this point.
	 */
	readonly source: URI;

	/**
	 * The target file the untitled was saved to. Is never untitled.
	 */
	readonly target: URI;
}

export interface IUntitledTextEditorService {

	readonly _serviceBrand: undefined;

	/**
	 * An event for when an untitled editor model was saved to disk.
	 * At the point the event fires, the untitled editor model is
	 * disposed.
	 */
	readonly onDidSave: Event<IUntitledTextEditorModelSaveEvent>;

	/**
	 * Events for when untitled text editors change (e.g. getting dirty, saved or reverted).
	 */
	readonly onDidChangeDirty: Event<IUntitledTextEditorModel>;

	/**
	 * Events for when untitled text editor encodings change.
	 */
	readonly onDidChangeEncoding: Event<IUntitledTextEditorModel>;

	/**
	 * Events for when untitled text editor labels change.
	 */
	readonly onDidChangeLabel: Event<IUntitledTextEditorModel>;

	/**
	 * Events for when untitled text editor models are created.
	 */
	readonly onDidCreate: Event<IUntitledTextEditorModel>;

	/**
	 * Events for when untitled text editors are about to be disposed.
	 */
	readonly onWillDispose: Event<IUntitledTextEditorModel>;

	/**
	 * Creates a new untitled editor model with the provided options. If the `untitledResource`
	 * property is provided and the untitled editor exists, it will return that existing
	 * instance instead of creating a new one.
	 */
	create(options?: INewUntitledTextEditorOptions): IUntitledTextEditorModel;
	create(options?: INewUntitledTextEditorWithAssociatedResourceOptions): IUntitledTextEditorModel;
	create(options?: IExistingUntitledTextEditorOptions): IUntitledTextEditorModel;

	/**
	 * Returns an existing untitled editor model if already created before.
	 */
	get(resource: URI): IUntitledTextEditorModel | undefined;

	/**
	 * Returns the value of the untitled editor, undefined if none exists
	 * @param resource The URI of the untitled file
	 * @returns The content, or undefined
	 */
	getValue(resource: URI): string | undefined;

	/**
	 * Resolves an untitled editor model from the provided options. If the `untitledResource`
	 * property is provided and the untitled editor exists, it will return that existing
	 * instance instead of creating a new one.
	 */
	resolve(options?: INewUntitledTextEditorOptions): Promise<IUntitledTextEditorModel>;
	resolve(options?: INewUntitledTextEditorWithAssociatedResourceOptions): Promise<IUntitledTextEditorModel>;
	resolve(options?: IExistingUntitledTextEditorOptions): Promise<IUntitledTextEditorModel>;

	/**
	 * Figures out if the given resource has an associated resource or not.
	 */
	isUntitledWithAssociatedResource(resource: URI): boolean;

	/**
	 * Waits for the model to be ready to be disposed. There may be conditions
	 * under which the model cannot be disposed, e.g. when it is dirty. Once the
	 * promise is settled, it is safe to dispose the model.
	 */
	canDispose(model: IUntitledTextEditorModel): true | Promise<true>;
}

export interface IUntitledTextEditorModelManager extends IUntitledTextEditorService {

	/**
	 * Internal method: triggers the onDidSave event.
	 */
	notifyDidSave(source: URI, target: URI): void;
}

export class UntitledTextEditorService extends Disposable implements IUntitledTextEditorModelManager {

	declare readonly _serviceBrand: undefined;

	private static readonly UNTITLED_WITHOUT_ASSOCIATED_RESOURCE_REGEX = /Untitled-\d+/;

	private readonly _onDidSave = this._register(new Emitter<IUntitledTextEditorModelSaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<IUntitledTextEditorModel>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeEncoding = this._register(new Emitter<IUntitledTextEditorModel>());
	readonly onDidChangeEncoding = this._onDidChangeEncoding.event;

	private readonly _onDidCreate = this._register(new Emitter<IUntitledTextEditorModel>());
	readonly onDidCreate = this._onDidCreate.event;

	private readonly _onWillDispose = this._register(new Emitter<IUntitledTextEditorModel>());
	readonly onWillDispose = this._onWillDispose.event;

	private readonly _onDidChangeLabel = this._register(new Emitter<IUntitledTextEditorModel>());
	readonly onDidChangeLabel = this._onDidChangeLabel.event;

	private readonly mapResourceToModel = new ResourceMap<UntitledTextEditorModel>();

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
	}

	get(resource: URI): UntitledTextEditorModel | undefined {
		return this.mapResourceToModel.get(resource);
	}

	getValue(resource: URI): string | undefined {
		return this.get(resource)?.textEditorModel?.getValue();
	}

	async resolve(options?: IInternalUntitledTextEditorOptions): Promise<UntitledTextEditorModel> {
		const model = this.doCreateOrGet(options);
		await model.resolve();

		return model;
	}

	create(options?: IInternalUntitledTextEditorOptions): UntitledTextEditorModel {
		return this.doCreateOrGet(options);
	}

	private doCreateOrGet(options: IInternalUntitledTextEditorOptions = Object.create(null)): UntitledTextEditorModel {
		const massagedOptions = this.massageOptions(options);

		// Return existing instance if asked for it
		if (massagedOptions.untitledResource && this.mapResourceToModel.has(massagedOptions.untitledResource)) {
			return this.mapResourceToModel.get(massagedOptions.untitledResource)!;
		}

		// Create new instance otherwise
		return this.doCreate(massagedOptions);
	}

	private massageOptions(options: IInternalUntitledTextEditorOptions): IInternalUntitledTextEditorOptions {
		const massagedOptions: IInternalUntitledTextEditorOptions = Object.create(null);

		// Figure out associated and untitled resource
		if (options.associatedResource) {
			massagedOptions.untitledResource = URI.from({
				scheme: Schemas.untitled,
				authority: options.associatedResource.authority,
				fragment: options.associatedResource.fragment,
				path: options.associatedResource.path,
				query: options.associatedResource.query
			});
			massagedOptions.associatedResource = options.associatedResource;
		} else {
			if (options.untitledResource?.scheme === Schemas.untitled) {
				massagedOptions.untitledResource = options.untitledResource;
			}
		}

		// Language id
		if (options.languageId) {
			massagedOptions.languageId = options.languageId;
		} else if (!massagedOptions.associatedResource) {
			const configuration = this.configurationService.getValue<IFilesConfiguration>();
			if (configuration.files?.defaultLanguage) {
				massagedOptions.languageId = configuration.files.defaultLanguage;
			}
		}

		// Take over encoding and initial value
		massagedOptions.encoding = options.encoding;
		massagedOptions.initialValue = options.initialValue;

		return massagedOptions;
	}

	private doCreate(options: IInternalUntitledTextEditorOptions): UntitledTextEditorModel {

		// Create a new untitled resource if none is provided
		let untitledResource = options.untitledResource;
		if (!untitledResource) {
			let counter = 1;
			do {
				untitledResource = URI.from({ scheme: Schemas.untitled, path: `Untitled-${counter}` });
				counter++;
			} while (this.mapResourceToModel.has(untitledResource));
		}

		// Create new model with provided options
		const model = this._register(this.instantiationService.createInstance(UntitledTextEditorModel, untitledResource, !!options.associatedResource, options.initialValue, options.languageId, options.encoding));

		this.registerModel(model);

		return model;
	}

	private registerModel(model: UntitledTextEditorModel): void {

		// Install model listeners
		const modelListeners = new DisposableStore();
		modelListeners.add(model.onDidChangeDirty(() => this._onDidChangeDirty.fire(model)));
		modelListeners.add(model.onDidChangeName(() => this._onDidChangeLabel.fire(model)));
		modelListeners.add(model.onDidChangeEncoding(() => this._onDidChangeEncoding.fire(model)));
		modelListeners.add(model.onWillDispose(() => this._onWillDispose.fire(model)));

		// Remove from cache on dispose
		Event.once(model.onWillDispose)(() => {

			// Registry
			this.mapResourceToModel.delete(model.resource);

			// Listeners
			modelListeners.dispose();
		});

		// Add to cache
		this.mapResourceToModel.set(model.resource, model);

		// Emit as event
		this._onDidCreate.fire(model);

		// If the model is dirty right from the beginning,
		// make sure to emit this as an event
		if (model.isDirty()) {
			this._onDidChangeDirty.fire(model);
		}
	}

	isUntitledWithAssociatedResource(resource: URI): boolean {
		return resource.scheme === Schemas.untitled && resource.path.length > 1 && !UntitledTextEditorService.UNTITLED_WITHOUT_ASSOCIATED_RESOURCE_REGEX.test(resource.path);
	}

	canDispose(model: UntitledTextEditorModel): true | Promise<true> {
		if (model.isDisposed()) {
			return true; // quick return if model already disposed
		}

		// promise based return in all other cases
		return this.doCanDispose(model);
	}

	private async doCanDispose(model: UntitledTextEditorModel): Promise<true> {

		// dirty model: we do not allow to dispose dirty models to prevent
		// data loss cases. dirty models can only be disposed when they are
		// either saved or reverted
		if (model.isDirty()) {
			await Event.toPromise(model.onDidChangeDirty);

			return this.canDispose(model);
		}

		return true;
	}

	notifyDidSave(source: URI, target: URI): void {
		this._onDidSave.fire({ source, target });
	}
}

registerSingleton(IUntitledTextEditorService, UntitledTextEditorService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/untitled/test/browser/untitledTextEditor.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/test/browser/untitledTextEditor.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../../../test/browser/workbenchTestServices.js';
import { UntitledTextEditorInput } from '../../common/untitledTextEditorInput.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Untitled text editors', () => {

	const disposables = new DisposableStore();

	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(accessor.untitledTextEditorService);
	});

	teardown(() => {
		disposables.clear();
	});

	test('backup and restore (simple)', async function () {
		return testBackupAndRestore('Some very small file text content.');
	});

	test('backup and restore (large, #121347)', async function () {
		const largeContent = '국어한\n'.repeat(100000);
		return testBackupAndRestore(largeContent);
	});

	async function testBackupAndRestore(content: string) {
		const service = accessor.untitledTextEditorService;
		const originalInput = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));
		const restoredInput = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		const originalModel = disposables.add(await originalInput.resolve());
		originalModel.textEditorModel?.setValue(content);

		const backup = await originalModel.backup(CancellationToken.None);
		const modelRestoredIdentifier = { typeId: originalModel.typeId, resource: restoredInput.resource };
		await accessor.workingCopyBackupService.backup(modelRestoredIdentifier, backup.content);

		const restoredModel = disposables.add(await restoredInput.resolve());

		assert.strictEqual(restoredModel.textEditorModel?.getValue(), content);
		assert.strictEqual(restoredModel.isDirty(), true);
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/untitled/test/browser/untitledTextEditor.test.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/test/browser/untitledTextEditor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { join } from '../../../../../base/common/path.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IUntitledTextEditorService, UntitledTextEditorService } from '../../common/untitledTextEditorService.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../../../test/browser/workbenchTestServices.js';
import { snapshotToString } from '../../../textfile/common/textfiles.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { ISingleEditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { UntitledTextEditorInput } from '../../common/untitledTextEditorInput.js';
import { IUntitledTextEditorModel, UntitledTextEditorModel } from '../../common/untitledTextEditorModel.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { EditorInputCapabilities } from '../../../../common/editor.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isReadable, isReadableStream } from '../../../../../base/common/stream.js';
import { readableToBuffer, streamToBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../../base/common/buffer.js';
import { LanguageDetectionLanguageEventSource } from '../../../languageDetection/common/languageDetectionWorkerService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { timeout } from '../../../../../base/common/async.js';

suite('Untitled text editors', () => {

	class TestUntitledTextEditorInput extends UntitledTextEditorInput {
		getModel() { return this.model; }
	}

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(accessor.untitledTextEditorService as UntitledTextEditorService);
	});

	teardown(() => {
		disposables.clear();
	});

	test('basics', async () => {
		const service = accessor.untitledTextEditorService;
		const workingCopyService = accessor.workingCopyService;

		const events: IUntitledTextEditorModel[] = [];
		disposables.add(service.onDidCreate(model => {
			events.push(model);
		}));

		const input1 = instantiationService.createInstance(TestUntitledTextEditorInput, service.create());
		await input1.resolve();
		assert.strictEqual(service.get(input1.resource), input1.getModel());
		assert.ok(!accessor.untitledTextEditorService.isUntitledWithAssociatedResource(input1.resource));

		assert.strictEqual(events.length, 1);
		assert.strictEqual(events[0].resource.toString(), input1.getModel().resource.toString());

		assert.ok(service.get(input1.resource));
		assert.ok(!service.get(URI.file('testing')));

		assert.ok(input1.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(!input1.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(!input1.isReadonly());
		assert.ok(!input1.hasCapability(EditorInputCapabilities.Singleton));
		assert.ok(!input1.hasCapability(EditorInputCapabilities.RequiresTrust));
		assert.ok(!input1.hasCapability(EditorInputCapabilities.Scratchpad));

		const input2 = instantiationService.createInstance(TestUntitledTextEditorInput, service.create());
		assert.strictEqual(service.get(input2.resource), input2.getModel());

		// toUntyped()
		const untypedInput = input1.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(untypedInput.forceUntitled, true);

		// get()
		assert.strictEqual(service.get(input1.resource), input1.getModel());
		assert.strictEqual(service.get(input2.resource), input2.getModel());

		// revert()
		await input1.revert(0);
		assert.ok(input1.isDisposed());
		assert.ok(!service.get(input1.resource));

		// dirty
		const model = await input2.resolve();
		assert.strictEqual(await service.resolve({ untitledResource: input2.resource }), model);
		assert.ok(service.get(model.resource));

		assert.strictEqual(events.length, 2);
		assert.strictEqual(events[1].resource.toString(), input2.resource.toString());

		assert.ok(!input2.isDirty());

		const resourcePromise = awaitDidChangeDirty(accessor.untitledTextEditorService);

		model.textEditorModel?.setValue('foo bar');

		const resource = await resourcePromise;

		assert.strictEqual(resource.toString(), input2.resource.toString());

		assert.ok(input2.isDirty());

		const dirtyUntypedInput = input2.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(dirtyUntypedInput.contents, 'foo bar');
		assert.strictEqual(dirtyUntypedInput.resource, undefined);

		const dirtyUntypedInputWithResource = input2.toUntyped({ preserveViewState: 0, preserveResource: true });
		assert.strictEqual(dirtyUntypedInputWithResource.contents, 'foo bar');
		assert.strictEqual(dirtyUntypedInputWithResource?.resource?.toString(), input2.resource.toString());

		const dirtyUntypedInputWithoutContent = input2.toUntyped();
		assert.strictEqual(dirtyUntypedInputWithoutContent.resource?.toString(), input2.resource.toString());
		assert.strictEqual(dirtyUntypedInputWithoutContent.contents, undefined);

		assert.ok(workingCopyService.isDirty(input2.resource));
		assert.strictEqual(workingCopyService.dirtyCount, 1);

		await input1.revert(0);
		await input2.revert(0);
		assert.ok(!service.get(input1.resource));
		assert.ok(!service.get(input2.resource));
		assert.ok(!input2.isDirty());
		assert.ok(!model.isDirty());

		assert.ok(!workingCopyService.isDirty(input2.resource));
		assert.strictEqual(workingCopyService.dirtyCount, 0);

		await input1.revert(0);
		assert.ok(input1.isDisposed());
		assert.ok(!service.get(input1.resource));

		input2.dispose();
		assert.ok(!service.get(input2.resource));
	});

	function awaitDidChangeDirty(service: IUntitledTextEditorService): Promise<URI> {
		return new Promise(resolve => {
			const listener = service.onDidChangeDirty(async model => {
				listener.dispose();

				resolve(model.resource);
			});
		});
	}

	test('associated resource is dirty', async () => {
		const service = accessor.untitledTextEditorService;
		const file = URI.file(join('C:\\', '/foo/file.txt'));

		let onDidChangeDirtyModel: IUntitledTextEditorModel | undefined = undefined;
		disposables.add(service.onDidChangeDirty(model => {
			onDidChangeDirtyModel = model;
		}));

		const model = disposables.add(service.create({ associatedResource: file }));
		assert.ok(accessor.untitledTextEditorService.isUntitledWithAssociatedResource(model.resource));
		const untitled = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, model));
		assert.ok(untitled.isDirty());
		assert.strictEqual(model, onDidChangeDirtyModel);

		const resolvedModel = await untitled.resolve();

		assert.ok(resolvedModel.hasAssociatedFilePath);
		assert.strictEqual(untitled.isDirty(), true);
	});

	test('no longer dirty when content gets empty (not with associated resource)', async () => {
		const service = accessor.untitledTextEditorService;
		const workingCopyService = accessor.workingCopyService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		// dirty
		const model = disposables.add(await input.resolve());
		model.textEditorModel?.setValue('foo bar');
		assert.ok(model.isDirty());
		assert.ok(workingCopyService.isDirty(model.resource, model.typeId));
		model.textEditorModel?.setValue('');
		assert.ok(!model.isDirty());
		assert.ok(!workingCopyService.isDirty(model.resource, model.typeId));
	});

	test('via create options', async () => {
		const service = accessor.untitledTextEditorService;

		const input1 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));
		const model1 = disposables.add(await input1.resolve());

		model1.textEditorModel!.setValue('foo bar');
		assert.ok(model1.isDirty());

		model1.textEditorModel!.setValue('');
		assert.ok(!model1.isDirty());

		const input2 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ initialValue: 'Hello World' })));
		const model2 = disposables.add(await input2.resolve());
		assert.strictEqual(snapshotToString(model2.createSnapshot()!), 'Hello World');

		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, disposables.add(service.create())));

		const input3 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ untitledResource: input.resource })));
		const model3 = disposables.add(await input3.resolve());

		assert.strictEqual(model3.resource.toString(), input.resource.toString());

		const file = URI.file(join('C:\\', '/foo/file44.txt'));
		const input4 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ associatedResource: file })));
		const model4 = disposables.add(await input4.resolve());
		assert.ok(model4.hasAssociatedFilePath);
		assert.ok(model4.isDirty());
	});

	test('associated path remains dirty when content gets empty', async () => {
		const service = accessor.untitledTextEditorService;
		const file = URI.file(join('C:\\', '/foo/file.txt'));
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ associatedResource: file })));

		// dirty
		const model = disposables.add(await input.resolve());
		model.textEditorModel?.setValue('foo bar');
		assert.ok(model.isDirty());
		model.textEditorModel?.setValue('');
		assert.ok(model.isDirty());
	});

	test('initial content is dirty', async () => {
		const service = accessor.untitledTextEditorService;
		const workingCopyService = accessor.workingCopyService;

		const untitled = disposables.add(instantiationService.createInstance(TestUntitledTextEditorInput, service.create({ initialValue: 'Hello World' })));
		assert.ok(untitled.isDirty());

		const backup = (await untitled.getModel().backup(CancellationToken.None)).content;
		if (isReadableStream(backup)) {
			const value = await streamToBuffer(backup as VSBufferReadableStream);
			assert.strictEqual(value.toString(), 'Hello World');
		} else if (isReadable(backup)) {
			const value = readableToBuffer(backup as VSBufferReadable);
			assert.strictEqual(value.toString(), 'Hello World');
		} else {
			assert.fail('Missing untitled backup');
		}

		// dirty
		const model = disposables.add(await untitled.resolve());
		assert.ok(model.isDirty());
		assert.strictEqual(workingCopyService.dirtyCount, 1);
	});

	test('created with files.defaultLanguage setting', () => {
		const defaultLanguage = 'javascript';
		const config = accessor.testConfigurationService;
		config.setUserConfiguration('files', { 'defaultLanguage': defaultLanguage });

		const service = accessor.untitledTextEditorService;
		const input = disposables.add(service.create());

		assert.strictEqual(input.getLanguageId(), defaultLanguage);

		config.setUserConfiguration('files', { 'defaultLanguage': undefined });
	});

	test('created with files.defaultLanguage setting (${activeEditorLanguage})', async () => {
		const config = accessor.testConfigurationService;
		config.setUserConfiguration('files', { 'defaultLanguage': '${activeEditorLanguage}' });

		accessor.editorService.activeTextEditorLanguageId = 'typescript';

		const service = accessor.untitledTextEditorService;
		const model = disposables.add(service.create());

		assert.strictEqual(model.getLanguageId(), 'typescript');

		config.setUserConfiguration('files', { 'defaultLanguage': undefined });
		accessor.editorService.activeTextEditorLanguageId = undefined;
	});

	test('created with language overrides files.defaultLanguage setting', () => {
		const language = 'typescript';
		const defaultLanguage = 'javascript';
		const config = accessor.testConfigurationService;
		config.setUserConfiguration('files', { 'defaultLanguage': defaultLanguage });

		const service = accessor.untitledTextEditorService;
		const input = disposables.add(service.create({ languageId: language }));

		assert.strictEqual(input.getLanguageId(), language);

		config.setUserConfiguration('files', { 'defaultLanguage': undefined });
	});

	test('can change language afterwards', async () => {
		const languageId = 'untitled-input-test';

		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ languageId: languageId })));

		assert.strictEqual(input.getLanguageId(), languageId);

		const model = disposables.add(await input.resolve());
		assert.strictEqual(model.getLanguageId(), languageId);

		input.setLanguageId(PLAINTEXT_LANGUAGE_ID);

		assert.strictEqual(input.getLanguageId(), PLAINTEXT_LANGUAGE_ID);
	});

	test('remembers that language was set explicitly', async () => {
		const language = 'untitled-input-test';

		disposables.add(accessor.languageService.registerLanguage({
			id: language,
		}));

		const service = accessor.untitledTextEditorService;
		const model = disposables.add(service.create());
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, model));

		assert.ok(!input.hasLanguageSetExplicitly);
		input.setLanguageId(PLAINTEXT_LANGUAGE_ID);
		assert.ok(input.hasLanguageSetExplicitly);

		assert.strictEqual(input.getLanguageId(), PLAINTEXT_LANGUAGE_ID);
	});

	// Issue #159202
	test('remembers that language was set explicitly if set by another source (i.e. ModelService)', async () => {
		const language = 'untitled-input-test';

		disposables.add(accessor.languageService.registerLanguage({
			id: language,
		}));

		const service = accessor.untitledTextEditorService;
		const model = disposables.add(service.create());
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, model));
		disposables.add(await input.resolve());

		assert.ok(!input.hasLanguageSetExplicitly);
		model.textEditorModel!.setLanguage(accessor.languageService.createById(language));
		assert.ok(input.hasLanguageSetExplicitly);

		assert.strictEqual(model.getLanguageId(), language);
	});

	test('Language is not set explicitly if set by language detection source', async () => {
		const language = 'untitled-input-test';

		disposables.add(accessor.languageService.registerLanguage({
			id: language,
		}));

		const service = accessor.untitledTextEditorService;
		const model = disposables.add(service.create());
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, model));
		await input.resolve();

		assert.ok(!input.hasLanguageSetExplicitly);
		model.textEditorModel!.setLanguage(
			accessor.languageService.createById(language),
			// This is really what this is testing
			LanguageDetectionLanguageEventSource);
		assert.ok(!input.hasLanguageSetExplicitly);

		assert.strictEqual(model.getLanguageId(), language);
	});

	test('service#onDidChangeEncoding', async () => {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		disposables.add(service.onDidChangeEncoding(model => {
			counter++;
			assert.strictEqual(model.resource.toString(), input.resource.toString());
		}));

		// encoding
		const model = disposables.add(await input.resolve());
		await model.setEncoding('utf16');
		assert.strictEqual(counter, 1);
	});

	test('service#onDidChangeLabel', async () => {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		disposables.add(service.onDidChangeLabel(model => {
			counter++;
			assert.strictEqual(model.resource.toString(), input.resource.toString());
		}));

		// label
		const model = disposables.add(await input.resolve());
		model.textEditorModel?.setValue('Foo Bar');
		assert.strictEqual(counter, 1);
	});

	test('service#onWillDispose', async () => {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		disposables.add(service.onWillDispose(model => {
			counter++;
			assert.strictEqual(model.resource.toString(), input.resource.toString());
		}));

		const model = disposables.add(await input.resolve());
		assert.strictEqual(counter, 0);
		model.dispose();
		assert.strictEqual(counter, 1);
	});


	test('service#getValue', async () => {
		const service = accessor.untitledTextEditorService;
		const input1 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));
		const model1 = disposables.add(await input1.resolve());

		model1.textEditorModel!.setValue('foo bar');
		assert.strictEqual(service.getValue(model1.resource), 'foo bar');
		model1.dispose();

		// When a model doesn't exist, it should return undefined
		assert.strictEqual(service.getValue(URI.parse('https://www.microsoft.com')), undefined);
	});

	test('model#onDidChangeContent', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		const model = disposables.add(await input.resolve());
		disposables.add(model.onDidChangeContent(() => counter++));

		model.textEditorModel?.setValue('foo');

		assert.strictEqual(counter, 1, 'Dirty model should trigger event');
		model.textEditorModel?.setValue('bar');

		assert.strictEqual(counter, 2, 'Content change when dirty should trigger event');
		model.textEditorModel?.setValue('');

		assert.strictEqual(counter, 3, 'Manual revert should trigger event');
		model.textEditorModel?.setValue('foo');

		assert.strictEqual(counter, 4, 'Dirty model should trigger event');
	});

	test('model#onDidRevert and input disposed when reverted', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		const model = disposables.add(await input.resolve());
		disposables.add(model.onDidRevert(() => counter++));

		model.textEditorModel?.setValue('foo');

		await model.revert();

		assert.ok(input.isDisposed());
		assert.ok(counter === 1);
	});

	test('model#onDidChangeName and input name', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		let model = disposables.add(await input.resolve());
		disposables.add(model.onDidChangeName(() => counter++));

		model.textEditorModel?.setValue('foo');
		assert.strictEqual(input.getName(), 'foo');
		assert.strictEqual(model.name, 'foo');

		assert.strictEqual(counter, 1);
		model.textEditorModel?.setValue('bar');
		assert.strictEqual(input.getName(), 'bar');
		assert.strictEqual(model.name, 'bar');

		assert.strictEqual(counter, 2);
		model.textEditorModel?.setValue('');
		assert.strictEqual(input.getName(), 'Untitled-1');
		assert.strictEqual(model.name, 'Untitled-1');

		model.textEditorModel?.setValue('        ');
		assert.strictEqual(input.getName(), 'Untitled-1');
		assert.strictEqual(model.name, 'Untitled-1');

		model.textEditorModel?.setValue('([]}'); // require actual words
		assert.strictEqual(input.getName(), 'Untitled-1');
		assert.strictEqual(model.name, 'Untitled-1');

		model.textEditorModel?.setValue('([]}hello   '); // require actual words
		assert.strictEqual(input.getName(), '([]}hello');
		assert.strictEqual(model.name, '([]}hello');

		model.textEditorModel?.setValue('12345678901234567890123456789012345678901234567890'); // trimmed at 40chars max
		assert.strictEqual(input.getName(), '1234567890123456789012345678901234567890');
		assert.strictEqual(model.name, '1234567890123456789012345678901234567890');

		model.textEditorModel?.setValue('123456789012345678901234567890123456789🌞'); // do not break grapehems (#111235)
		assert.strictEqual(input.getName(), '123456789012345678901234567890123456789');
		assert.strictEqual(model.name, '123456789012345678901234567890123456789');

		model.textEditorModel?.setValue('hello\u202Eworld'); // do not allow RTL in names (#190133)
		assert.strictEqual(input.getName(), 'helloworld');
		assert.strictEqual(model.name, 'helloworld');

		assert.strictEqual(counter, 7);

		model.textEditorModel?.setValue('Hello\nWorld');
		assert.strictEqual(counter, 8);

		function createSingleEditOp(text: string, positionLineNumber: number, positionColumn: number, selectionLineNumber: number = positionLineNumber, selectionColumn: number = positionColumn): ISingleEditOperation {
			const range = new Range(
				selectionLineNumber,
				selectionColumn,
				positionLineNumber,
				positionColumn
			);

			return {
				range,
				text,
				forceMoveMarkers: false
			};
		}

		model.textEditorModel?.applyEdits([createSingleEditOp('hello', 2, 2)]);
		assert.strictEqual(counter, 8); // change was not on first line

		input.dispose();
		model.dispose();

		const inputWithContents = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create({ initialValue: 'Foo' })));
		model = disposables.add(await inputWithContents.resolve());

		assert.strictEqual(inputWithContents.getName(), 'Foo');
	});

	test('model#onDidChangeDirty', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		const model = disposables.add(await input.resolve());
		disposables.add(model.onDidChangeDirty(() => counter++));

		model.textEditorModel?.setValue('foo');

		assert.strictEqual(counter, 1, 'Dirty model should trigger event');
		model.textEditorModel?.setValue('bar');

		assert.strictEqual(counter, 1, 'Another change does not fire event');
	});

	test('model#onDidChangeEncoding', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		let counter = 0;

		const model = disposables.add(await input.resolve());
		disposables.add(model.onDidChangeEncoding(() => counter++));

		await model.setEncoding('utf16');

		assert.strictEqual(counter, 1, 'Dirty model should trigger event');
		await model.setEncoding('utf16');

		assert.strictEqual(counter, 1, 'Another change to same encoding does not fire event');
	});

	test('canDispose with dirty model', async function () {
		const service = accessor.untitledTextEditorService;
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		const model = disposables.add(await input.resolve());

		model.textEditorModel?.setValue('foo');

		const canDisposePromise = service.canDispose(model as UntitledTextEditorModel);
		assert.ok(canDisposePromise instanceof Promise);

		let canDispose = false;
		(async () => {
			canDispose = await canDisposePromise;
		})();

		assert.strictEqual(canDispose, false);
		model.revert({ soft: true });

		await timeout(0);

		assert.strictEqual(canDispose, true);

		const canDispose2 = service.canDispose(model as UntitledTextEditorModel);
		assert.strictEqual(canDispose2, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/update/browser/updateService.ts]---
Location: vscode-main/src/vs/workbench/services/update/browser/updateService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { IUpdateService, State, UpdateType } from '../../../../platform/update/common/update.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IHostService } from '../../host/browser/host.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export interface IUpdate {
	version: string;
}

export interface IUpdateProvider {

	/**
	 * Should return with the `IUpdate` object if an update is
	 * available or `null` otherwise to signal that there are
	 * no updates.
	 */
	checkForUpdate(): Promise<IUpdate | null>;
}

export class BrowserUpdateService extends Disposable implements IUpdateService {

	declare readonly _serviceBrand: undefined;

	private _onStateChange = this._register(new Emitter<State>());
	readonly onStateChange: Event<State> = this._onStateChange.event;

	private _state: State = State.Uninitialized;
	get state(): State { return this._state; }
	set state(state: State) {
		this._state = state;
		this._onStateChange.fire(state);
	}

	constructor(
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IHostService private readonly hostService: IHostService
	) {
		super();

		this.checkForUpdates(false);
	}

	async isLatestVersion(): Promise<boolean | undefined> {
		const update = await this.doCheckForUpdates(false);
		if (update === undefined) {
			return undefined; // no update provider
		}

		return !!update;
	}

	async checkForUpdates(explicit: boolean): Promise<void> {
		await this.doCheckForUpdates(explicit);
	}

	private async doCheckForUpdates(explicit: boolean): Promise<IUpdate | null /* no update available */ | undefined /* no update provider */> {
		if (this.environmentService.options && this.environmentService.options.updateProvider) {
			const updateProvider = this.environmentService.options.updateProvider;

			// State -> Checking for Updates
			this.state = State.CheckingForUpdates(explicit);

			const update = await updateProvider.checkForUpdate();
			if (update) {
				// State -> Downloaded
				this.state = State.Ready({ version: update.version, productVersion: update.version });
			} else {
				// State -> Idle
				this.state = State.Idle(UpdateType.Archive);
			}

			return update;
		}

		return undefined; // no update provider to ask
	}

	async downloadUpdate(): Promise<void> {
		// no-op
	}

	async applyUpdate(): Promise<void> {
		this.hostService.reload();
	}

	async quitAndInstall(): Promise<void> {
		this.hostService.reload();
	}

	async _applySpecificUpdate(packagePath: string): Promise<void> {
		// noop
	}
}

registerSingleton(IUpdateService, BrowserUpdateService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/update/electron-browser/updateService.ts]---
Location: vscode-main/src/vs/workbench/services/update/electron-browser/updateService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUpdateService } from '../../../../platform/update/common/update.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { UpdateChannelClient } from '../../../../platform/update/common/updateIpc.js';

registerMainProcessRemoteService(IUpdateService, 'update', { channelClientCtor: UpdateChannelClient });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/url/browser/urlService.ts]---
Location: vscode-main/src/vs/workbench/services/url/browser/urlService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IURLService } from '../../../../platform/url/common/url.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { AbstractURLService } from '../../../../platform/url/common/urlService.js';
import { Event } from '../../../../base/common/event.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IOpenerService, IOpener, OpenExternalOptions, OpenInternalOptions } from '../../../../platform/opener/common/opener.js';
import { matchesScheme } from '../../../../base/common/network.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export interface IURLCallbackProvider {

	/**
	 * Indicates that a Uri has been opened outside of VSCode. The Uri
	 * will be forwarded to all installed Uri handlers in the system.
	 */
	readonly onCallback: Event<URI>;

	/**
	 * Creates a Uri that - if opened in a browser - must result in
	 * the `onCallback` to fire.
	 *
	 * The optional `Partial<UriComponents>` must be properly restored for
	 * the Uri passed to the `onCallback` handler.
	 *
	 * For example: if a Uri is to be created with `scheme:"vscode"`,
	 * `authority:"foo"` and `path:"bar"` the `onCallback` should fire
	 * with a Uri `vscode://foo/bar`.
	 *
	 * If there are additional `query` values in the Uri, they should
	 * be added to the list of provided `query` arguments from the
	 * `Partial<UriComponents>`.
	 */
	create(options?: Partial<UriComponents>): URI;
}

class BrowserURLOpener implements IOpener {

	constructor(
		private urlService: IURLService,
		private productService: IProductService
	) { }

	async open(resource: string | URI, options?: OpenInternalOptions | OpenExternalOptions): Promise<boolean> {
		if ((options as OpenExternalOptions | undefined)?.openExternal) {
			return false;
		}

		if (!matchesScheme(resource, this.productService.urlProtocol)) {
			return false;
		}

		if (typeof resource === 'string') {
			resource = URI.parse(resource);
		}

		return this.urlService.open(resource, { trusted: true });
	}
}

export class BrowserURLService extends AbstractURLService {

	private provider: IURLCallbackProvider | undefined;

	constructor(
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@IOpenerService openerService: IOpenerService,
		@IProductService productService: IProductService
	) {
		super();

		this.provider = environmentService.options?.urlCallbackProvider;

		if (this.provider) {
			this._register(this.provider.onCallback(uri => this.open(uri, { trusted: true })));
		}

		this._register(openerService.registerOpener(new BrowserURLOpener(this, productService)));
	}

	create(options?: Partial<UriComponents>): URI {
		if (this.provider) {
			return this.provider.create(options);
		}

		return URI.parse('unsupported://');
	}
}

registerSingleton(IURLService, BrowserURLService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/url/electron-browser/urlService.ts]---
Location: vscode-main/src/vs/workbench/services/url/electron-browser/urlService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IURLService, IURLHandler, IOpenURLOptions } from '../../../../platform/url/common/url.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { URLHandlerChannel } from '../../../../platform/url/common/urlIpc.js';
import { IOpenerService, IOpener } from '../../../../platform/opener/common/opener.js';
import { matchesScheme } from '../../../../base/common/network.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { FocusMode, INativeHostService } from '../../../../platform/native/common/native.js';
import { NativeURLService } from '../../../../platform/url/common/urlService.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export interface IRelayOpenURLOptions extends IOpenURLOptions {
	openToSide?: boolean;
	openExternal?: boolean;
}

export class RelayURLService extends NativeURLService implements IURLHandler, IOpener {

	private urlService: IURLService;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@IOpenerService openerService: IOpenerService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IProductService productService: IProductService,
		@ILogService private readonly logService: ILogService
	) {
		super(productService);

		this.urlService = ProxyChannel.toService<IURLService>(mainProcessService.getChannel('url'));

		mainProcessService.registerChannel('urlHandler', new URLHandlerChannel(this));
		openerService.registerOpener(this);
	}

	override create(options?: Partial<UriComponents>): URI {
		const uri = super.create(options);

		let query = uri.query;
		if (!query) {
			query = `windowId=${encodeURIComponent(this.nativeHostService.windowId)}`;
		} else {
			query += `&windowId=${encodeURIComponent(this.nativeHostService.windowId)}`;
		}

		return uri.with({ query });
	}

	override async open(resource: URI | string, options?: IRelayOpenURLOptions): Promise<boolean> {

		if (!matchesScheme(resource, this.productService.urlProtocol)) {
			return false;
		}

		if (typeof resource === 'string') {
			resource = URI.parse(resource);
		}
		return await this.urlService.open(resource, options);
	}

	async handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		const result = await super.open(uri, options);

		if (result) {
			this.logService.trace('URLService#handleURL(): handled', uri.toString(true));

			await this.nativeHostService.focusWindow({ mode: FocusMode.Force /* Application may not be active */, targetWindowId: this.nativeHostService.windowId });
		} else {
			this.logService.trace('URLService#handleURL(): not handled', uri.toString(true));
		}

		return result;
	}
}

registerSingleton(IURLService, RelayURLService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/browser/domActivityTracker.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/browser/domActivityTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IUserActivityService } from '../common/userActivityService.js';

/**
 * This uses a time interval and checks whether there's any activity in that
 * interval. A naive approach might be to use a debounce whenever an event
 * happens, but this has some scheduling overhead. Instead, the tracker counts
 * how many intervals have elapsed since any activity happened.
 *
 * If there's more than `MIN_INTERVALS_WITHOUT_ACTIVITY`, then say the user is
 * inactive. Therefore the maximum time before an inactive user is detected
 * is `CHECK_INTERVAL * (MIN_INTERVALS_WITHOUT_ACTIVITY + 1)`.
 */
const CHECK_INTERVAL = 30_000;

/** See {@link CHECK_INTERVAL} */
const MIN_INTERVALS_WITHOUT_ACTIVITY = 2;

const eventListenerOptions: AddEventListenerOptions = {
	passive: true, /** does not preventDefault() */
	capture: true, /** should dispatch first (before anyone stopPropagation()) */
};

export class DomActivityTracker extends Disposable {
	constructor(userActivityService: IUserActivityService) {
		super();

		let intervalsWithoutActivity = MIN_INTERVALS_WITHOUT_ACTIVITY;
		const intervalTimer = this._register(new dom.WindowIntervalTimer());
		const activeMutex = this._register(new MutableDisposable());
		activeMutex.value = userActivityService.markActive();

		const onInterval = () => {
			if (++intervalsWithoutActivity === MIN_INTERVALS_WITHOUT_ACTIVITY) {
				activeMutex.clear();
				intervalTimer.cancel();
			}
		};

		const onActivity = (targetWindow: Window & typeof globalThis) => {
			// if was inactive, they've now returned
			if (intervalsWithoutActivity === MIN_INTERVALS_WITHOUT_ACTIVITY) {
				activeMutex.value = userActivityService.markActive();
				intervalTimer.cancelAndSet(onInterval, CHECK_INTERVAL, targetWindow);
			}

			intervalsWithoutActivity = 0;
		};

		this._register(Event.runAndSubscribe(dom.onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(dom.addDisposableListener(window.document, 'touchstart', () => onActivity(window), eventListenerOptions));
			disposables.add(dom.addDisposableListener(window.document, 'mousedown', () => onActivity(window), eventListenerOptions));
			disposables.add(dom.addDisposableListener(window.document, 'keydown', () => onActivity(window), eventListenerOptions));
		}, { window: mainWindow, disposables: this._store }));

		onActivity(mainWindow);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/browser/userActivityBrowser.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/browser/userActivityBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DomActivityTracker } from './domActivityTracker.js';
import { userActivityRegistry } from '../common/userActivityRegistry.js';

userActivityRegistry.add(DomActivityTracker);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/common/userActivityRegistry.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/common/userActivityRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserActivityService } from './userActivityService.js';

class UserActivityRegistry {
	private todo: { new(s: IUserActivityService, ...args: unknown[]): unknown }[] = [];

	public add = (ctor: { new(s: IUserActivityService, ...args: unknown[]): unknown }) => {
		this.todo.push(ctor);
	};

	public take(userActivityService: IUserActivityService, instantiation: IInstantiationService) {
		this.add = ctor => instantiation.createInstance(ctor, userActivityService);
		this.todo.forEach(this.add);
		this.todo = [];
	}
}

export const userActivityRegistry = new UserActivityRegistry();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/common/userActivityService.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/common/userActivityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout, RunOnceScheduler, runWhenGlobalIdle } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { userActivityRegistry } from './userActivityRegistry.js';

export interface IMarkActiveOptions {
	whenHeldFor?: number;
	/**
	 * Only consider this progress if the state is already active. Used to avoid
	 * background work from incorrectly marking the user as active (#237386)
	 */
	extendOnly?: boolean;
}

/**
 * Service that observes user activity in the window.
 */
export interface IUserActivityService {
	_serviceBrand: undefined;

	/**
	 * Whether the user is currently active.
	 */
	readonly isActive: boolean;

	/**
	 * Fires when the activity state changes.
	 */
	readonly onDidChangeIsActive: Event<boolean>;

	/**
	 * Marks the user as being active until the Disposable is disposed of.
	 * Multiple consumers call this method; the user will only be considered
	 * inactive once all consumers have disposed of their Disposables.
	 */
	markActive(opts?: IMarkActiveOptions): IDisposable;
}

const MARK_INACTIVE_DEBOUNCE = 10_000;

export const IUserActivityService = createDecorator<IUserActivityService>('IUserActivityService');

export class UserActivityService extends Disposable implements IUserActivityService {
	declare readonly _serviceBrand: undefined;
	private readonly markInactive = this._register(new RunOnceScheduler(() => {
		this.isActive = false;
		this.changeEmitter.fire(false);
	}, MARK_INACTIVE_DEBOUNCE));

	private readonly changeEmitter = this._register(new Emitter<boolean>);
	private active = 0;

	/**
	 * @inheritdoc
	 *
	 * Note: initialized to true, since the user just did something to open the
	 * window. The bundled DomActivityTracker will initially assume activity
	 * as well in order to unset this if the window gets abandoned.
	 */
	public isActive = true;

	/** @inheritdoc */
	readonly onDidChangeIsActive: Event<boolean> = this.changeEmitter.event;

	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		super();
		this._register(runWhenGlobalIdle(() => userActivityRegistry.take(this, instantiationService)));
	}

	/** @inheritdoc */
	markActive(opts?: IMarkActiveOptions): IDisposable {
		if (opts?.extendOnly && !this.isActive) {
			return Disposable.None;
		}

		if (opts?.whenHeldFor) {
			const store = new DisposableStore();
			store.add(disposableTimeout(() => store.add(this.markActive()), opts.whenHeldFor));
			return store;
		}

		if (++this.active === 1) {
			this.isActive = true;
			this.changeEmitter.fire(true);
			this.markInactive.cancel();
		}

		return toDisposable(() => {
			if (--this.active === 0) {
				this.markInactive.schedule();
			}
		});
	}
}

registerSingleton(IUserActivityService, UserActivityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/test/browser/domActivityTracker.test.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/test/browser/domActivityTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { DomActivityTracker } from '../../browser/domActivityTracker.js';
import { UserActivityService } from '../../common/userActivityService.js';

suite('DomActivityTracker', () => {
	let uas: UserActivityService;
	let insta: TestInstantiationService;
	let clock: sinon.SinonFakeTimers;
	const maxTimeToBecomeIdle = 3 * 30_000; // (MIN_INTERVALS_WITHOUT_ACTIVITY + 1) * CHECK_INTERVAL;
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		clock = sinon.useFakeTimers();
		insta = store.add(new TestInstantiationService());
		uas = store.add(new UserActivityService(insta));
		store.add(new DomActivityTracker(uas));
	});

	teardown(() => {
		clock.restore();
	});


	test('marks inactive on no input', () => {
		assert.equal(uas.isActive, true);
		clock.tick(maxTimeToBecomeIdle);
		assert.equal(uas.isActive, false);
	});

	test('preserves activity state when active', () => {
		assert.equal(uas.isActive, true);

		const div = 10;
		for (let i = 0; i < div; i++) {
			document.dispatchEvent(new MouseEvent('keydown'));
			clock.tick(maxTimeToBecomeIdle / div);
		}

		assert.equal(uas.isActive, true);
	});

	test('restores active state', () => {
		assert.equal(uas.isActive, true);
		clock.tick(maxTimeToBecomeIdle);
		assert.equal(uas.isActive, false);

		document.dispatchEvent(new MouseEvent('keydown'));
		assert.equal(uas.isActive, true);

		clock.tick(maxTimeToBecomeIdle);
		assert.equal(uas.isActive, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userActivity/test/common/userActivityService.test.ts]---
Location: vscode-main/src/vs/workbench/services/userActivity/test/common/userActivityService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import * as assert from 'assert';
import * as sinon from 'sinon';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IMarkActiveOptions, IUserActivityService, UserActivityService } from '../../common/userActivityService.js';

const MARK_INACTIVE_DEBOUNCE = 10_000;

suite('UserActivityService', () => {
	let userActivityService: IUserActivityService;
	let clock: sinon.SinonFakeTimers;

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		clock = sinon.useFakeTimers();
		userActivityService = ds.add(new UserActivityService(ds.add(new TestInstantiationService())));
	});

	teardown(() => {
		clock.restore();
	});

	test('isActive should be true initially', () => {
		assert.ok(userActivityService.isActive);
	});

	test('markActive should be inactive when all handles gone', () => {
		const h1 = userActivityService.markActive();
		const h2 = userActivityService.markActive();
		assert.strictEqual(userActivityService.isActive, true);
		h1.dispose();
		assert.strictEqual(userActivityService.isActive, true);
		h2.dispose();
		clock.tick(MARK_INACTIVE_DEBOUNCE);
		assert.strictEqual(userActivityService.isActive, false);
	});

	test('markActive sets active whenHeldFor', async () => {
		userActivityService.markActive().dispose();
		clock.tick(MARK_INACTIVE_DEBOUNCE);

		const duration = 100; // milliseconds
		const opts: IMarkActiveOptions = { whenHeldFor: duration };
		const handle = userActivityService.markActive(opts);
		assert.strictEqual(userActivityService.isActive, false);
		clock.tick(duration - 1);
		assert.strictEqual(userActivityService.isActive, false);
		clock.tick(1);
		assert.strictEqual(userActivityService.isActive, true);
		handle.dispose();

		clock.tick(MARK_INACTIVE_DEBOUNCE);
		assert.strictEqual(userActivityService.isActive, false);
	});

	test('markActive whenHeldFor before triggers', async () => {
		userActivityService.markActive().dispose();
		clock.tick(MARK_INACTIVE_DEBOUNCE);

		const duration = 100; // milliseconds
		const opts: IMarkActiveOptions = { whenHeldFor: duration };
		userActivityService.markActive(opts).dispose();
		assert.strictEqual(userActivityService.isActive, false);
		clock.tick(duration + MARK_INACTIVE_DEBOUNCE);
		assert.strictEqual(userActivityService.isActive, false);
	});

	test('markActive with extendOnly only extends if already active', () => {
		// Make user inactive
		userActivityService.markActive().dispose();
		clock.tick(MARK_INACTIVE_DEBOUNCE);
		assert.strictEqual(userActivityService.isActive, false);

		// Should not activate if inactive and extendOnly is true
		const handle = userActivityService.markActive({ extendOnly: true });
		assert.strictEqual(userActivityService.isActive, false);
		handle.dispose();

		// Activate normally
		const h1 = userActivityService.markActive();
		assert.strictEqual(userActivityService.isActive, true);

		// Should extend activity if already active
		const h2 = userActivityService.markActive({ extendOnly: true });
		h1.dispose();
		// Still active because h2 is holding
		assert.strictEqual(userActivityService.isActive, true);
		h2.dispose();
		clock.tick(MARK_INACTIVE_DEBOUNCE);
		assert.strictEqual(userActivityService.isActive, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userAttention/browser/userAttentionBrowser.ts]---
Location: vscode-main/src/vs/workbench/services/userAttention/browser/userAttentionBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, IObservable, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { TotalTrueTimeObservable, wasTrueRecently } from '../../../../base/common/observableInternal/experimental/time.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { IHostService } from '../../host/browser/host.js';
import { IUserAttentionService } from '../common/userAttentionService.js';

/**
 * The user attention timeout in milliseconds.
 * User is considered attentive if there was activity within this time frame.
 */
const USER_ATTENTION_TIMEOUT_MS = 60_000;

export class UserAttentionService extends Disposable implements IUserAttentionService {
	declare readonly _serviceBrand: undefined;

	private readonly _isTracingEnabled: IObservable<boolean>;
	private readonly _timeKeeper: TotalTrueTimeObservable;

	public readonly isVsCodeFocused: IObservable<boolean>;
	public readonly hasUserAttention: IObservable<boolean>;
	public readonly isUserActive: IObservable<boolean>;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();

		const hostAdapter = this._register(instantiationService.createInstance(UserAttentionServiceEnv));
		this.isVsCodeFocused = hostAdapter.isVsCodeFocused;
		this.isUserActive = hostAdapter.isUserActive;

		this._isTracingEnabled = observableFromEvent(
			this,
			this._logService.onDidChangeLogLevel,
			() => this._logService.getLevel() === LogLevel.Trace
		);

		const hadRecentActivity = wasTrueRecently(this.isUserActive, USER_ATTENTION_TIMEOUT_MS, this._store);

		this.hasUserAttention = derived(this, reader => {
			return hadRecentActivity.read(reader);
		});

		this._timeKeeper = this._register(new TotalTrueTimeObservable(this.hasUserAttention));

		this._register(autorun(reader => {
			if (!this._isTracingEnabled.read(reader)) {
				return;
			}

			reader.store.add(autorun(innerReader => {
				const focused = this.isVsCodeFocused.read(innerReader);
				this._logService.trace(`[UserAttentionService] VS Code focus changed: ${focused}`);
			}));
			reader.store.add(autorun(innerReader => {
				const hasAttention = this.hasUserAttention.read(innerReader);
				this._logService.trace(`[UserAttentionService] User attention changed: ${hasAttention}`);
			}));
		}));
	}

	public fireAfterGivenFocusTimePassed(focusTimeMs: number, callback: () => void): IDisposable {
		return this._timeKeeper.fireWhenTimeIncreasedBy(focusTimeMs, callback);
	}

	get totalFocusTimeMs(): number {
		return this._timeKeeper.totalTimeMs();
	}
}

export class UserAttentionServiceEnv extends Disposable {
	public readonly isVsCodeFocused: IObservable<boolean>;
	public readonly isUserActive: IObservable<boolean>;

	private readonly _isUserActive = observableValue<boolean>(this, false);
	private _activityDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

	constructor(
		@IHostService private readonly _hostService: IHostService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();

		this.isVsCodeFocused = observableFromEvent(this, this._hostService.onDidChangeFocus, () => this._hostService.hasFocus);
		this.isUserActive = this._isUserActive;

		const onActivity = () => {
			this._markUserActivity();
		};

		this._register(Event.runAndSubscribe(dom.onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(dom.addDisposableListener(window.document, 'keydown', onActivity, eventListenerOptions));
			disposables.add(dom.addDisposableListener(window.document, 'mousemove', onActivity, eventListenerOptions));
			disposables.add(dom.addDisposableListener(window.document, 'mousedown', onActivity, eventListenerOptions));
			disposables.add(dom.addDisposableListener(window.document, 'touchstart', onActivity, eventListenerOptions));
		}, { window: mainWindow, disposables: this._store }));

		if (this._hostService.hasFocus) {
			this._markUserActivity();
		}
	}

	private _markUserActivity(): void {
		if (this._activityDebounceTimeout !== undefined) {
			clearTimeout(this._activityDebounceTimeout);
		} else {
			this._logService.trace('[UserAttentionService] User activity detected');
			this._isUserActive.set(true, undefined);
		}

		// An activity event accounts for 500ms for immediate use activity
		this._activityDebounceTimeout = setTimeout(() => {
			this._isUserActive.set(false, undefined);
			this._activityDebounceTimeout = undefined;
		}, 500);
	}
}

const eventListenerOptions: AddEventListenerOptions = {
	passive: true,
	capture: true,
};

registerSingleton(IUserAttentionService, UserAttentionService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userAttention/common/userAttentionService.ts]---
Location: vscode-main/src/vs/workbench/services/userAttention/common/userAttentionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IUserAttentionService = createDecorator<IUserAttentionService>('userAttentionService');

/**
 * Service that tracks whether the user is actively paying attention to VS Code.
 *
 * This is determined by:
 * * VS Code window has focus
 * * User has performed some activity (keyboard/mouse) within the last minute
 */
export interface IUserAttentionService {
	readonly _serviceBrand: undefined;

	readonly isVsCodeFocused: IObservable<boolean>;

	/**
	 * Observable that is true when user activity was recently detected (within the last 500ms).
	 * This includes keyboard typing and mouse movements/clicks while VS Code is focused.
	 * The 500ms window prevents event spam from continuous mouse movement.
	 */
	readonly isUserActive: IObservable<boolean>;

	/**
	 * Observable that indicates whether the user is actively paying attention to VS Code.
	 * This is true when:
	 * * VS Code has focus, AND
	 * * There was user activity within the last minute
	 */
	readonly hasUserAttention: IObservable<boolean>;

	/**
	 * The total time in milliseconds that the user has been paying attention to VS Code.
	 */
	readonly totalFocusTimeMs: number;

	/**
	 * Fires the callback after the user has accumulated the specified amount of focus time.
	 * Focus time is computed as the number of 1-minute blocks in which the user has attention
	 * (hasUserAttention is true).
	 *
	 * @param focusTimeMs The accumulated focus time in milliseconds before the callback is fired.
	 * @param callback The callback to fire once the focus time has been accumulated.
	 * @returns A disposable that cancels the callback when disposed.
	 */
	fireAfterGivenFocusTimePassed(focusTimeMs: number, callback: () => void): IDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userAttention/test/browser/userAttentionService.test.ts]---
Location: vscode-main/src/vs/workbench/services/userAttention/test/browser/userAttentionService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { UserAttentionServiceEnv, UserAttentionService } from '../../browser/userAttentionBrowser.js';

suite('UserAttentionService', () => {
	let userAttentionService: UserAttentionService;
	let insta: TestInstantiationService;
	let clock: sinon.SinonFakeTimers;
	let hostAdapterMock: {
		isVsCodeFocused: IObservable<boolean>;
		isUserActive: IObservable<boolean>;
		setFocus(focused: boolean): void;
		setActive(active: boolean): void;
		dispose(): void;
	};
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const ONE_MINUTE = 50_000;
	const ATTENTION_TIMEOUT = 60_000; // USER_ATTENTION_TIMEOUT_MS is 60 seconds

	setup(() => {
		clock = sinon.useFakeTimers();
		insta = store.add(new TestInstantiationService());
		insta.stub(ILogService, new NullLogService());

		const isVsCodeFocused = observableValue('focused', true);
		const isUserActive = observableValue('active', false);

		hostAdapterMock = {
			isVsCodeFocused,
			isUserActive,
			setFocus: (f) => isVsCodeFocused.set(f, undefined),
			setActive: (a) => isUserActive.set(a, undefined),
			dispose: () => { }
		};

		const originalCreateInstance = insta.createInstance;
		sinon.stub(insta, 'createInstance').callsFake((ctor: any, ...args: any[]) => {
			if (ctor === UserAttentionServiceEnv) {
				return hostAdapterMock;
			}
			return originalCreateInstance.call(insta, ctor, ...args);
		});

		userAttentionService = store.add(insta.createInstance(UserAttentionService));

		// Simulate initial activity
		hostAdapterMock.setActive(true);
		hostAdapterMock.setActive(false);
	});

	teardown(() => {
		clock.restore();
	});

	test('isVsCodeFocused reflects window focus state', () => {
		assert.strictEqual(userAttentionService.isVsCodeFocused.get(), true);

		hostAdapterMock.setFocus(false);
		assert.strictEqual(userAttentionService.isVsCodeFocused.get(), false);

		hostAdapterMock.setFocus(true);
		assert.strictEqual(userAttentionService.isVsCodeFocused.get(), true);
	});

	test('hasUserAttention is true when focused and has recent activity', () => {
		// Initially focused with activity
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);
	});

	test('hasUserAttention becomes false after attention timeout without activity', () => {
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);

		// Advance time past the attention timeout (5 seconds)
		clock.tick(ATTENTION_TIMEOUT + 1);

		assert.strictEqual(userAttentionService.hasUserAttention.get(), false);
	});

	test('hasUserAttention is false when window loses focus', () => {
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);

		hostAdapterMock.setFocus(false);

		// Attention is not dependent on focus
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);
	});

	test('hasUserAttention is restored when activity occurs', () => {
		// Wait for attention to expire
		clock.tick(ATTENTION_TIMEOUT + 1);
		assert.strictEqual(userAttentionService.hasUserAttention.get(), false);

		// Simulate activity
		hostAdapterMock.setActive(true);

		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);
	});

	test('activity keeps attention alive', () => {
		// Start with attention
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);

		// Advance time halfway, then activity
		clock.tick(ONE_MINUTE / 2);
		hostAdapterMock.setActive(true);
		hostAdapterMock.setActive(false);

		// Advance another half minute - should still have attention
		clock.tick(ONE_MINUTE / 2);
		assert.strictEqual(userAttentionService.hasUserAttention.get(), true);

		// Now let it expire
		clock.tick(ONE_MINUTE + 1);
		assert.strictEqual(userAttentionService.hasUserAttention.get(), false);
	});

	suite('fireAfterGivenFocusTimePassed', () => {
		test('fires callback after accumulated focus time', () => {
			let callbackFired = false;
			const disposable = userAttentionService.fireAfterGivenFocusTimePassed(3 * ONE_MINUTE, () => {
				callbackFired = true;
			});
			store.add(disposable);

			// Mark activity to ensure attention is maintained, then advance 1 minute - not yet fired
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Mark activity and advance another minute - still not fired
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Mark activity and advance 3rd minute - should fire
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, true);
		});

		test('does not accumulate time when user has no attention', () => {
			let callbackFired = false;
			const disposable = userAttentionService.fireAfterGivenFocusTimePassed(2 * ONE_MINUTE, () => {
				callbackFired = true;
			});
			store.add(disposable);

			// Mark activity and accumulate 1 minute
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Lose focus - should still accumulate (even with activity)
			hostAdapterMock.setFocus(false);
			// Mark activity again to ensure attention is maintained
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, true);
		});

		test('stops accumulating time when attention expires', () => {
			let callbackFired = false;
			const disposable = userAttentionService.fireAfterGivenFocusTimePassed(2 * ONE_MINUTE, () => {
				callbackFired = true;
			});
			store.add(disposable);

			// Mark activity and accumulate 1 minute
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Let attention expire (don't mark activity before tick)
			// Advance enough time that the activity timeout expires
			clock.tick(ONE_MINUTE + 1);
			assert.strictEqual(userAttentionService.hasUserAttention.get(), false);
			assert.strictEqual(callbackFired, false);

			// This minute shouldn't count (no attention)
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Restore activity and accumulate 1 more minute
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, true);
		});

		test('can be disposed before callback fires', () => {
			let callbackFired = false;
			const disposable = userAttentionService.fireAfterGivenFocusTimePassed(2 * ONE_MINUTE, () => {
				callbackFired = true;
			});

			// Mark activity and accumulate 1 minute
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);

			// Dispose before it fires
			disposable.dispose();

			// Advance past threshold - should not fire
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callbackFired, false);
		});

		test('callback fires only once', () => {
			let callCount = 0;
			const disposable = userAttentionService.fireAfterGivenFocusTimePassed(ONE_MINUTE, () => {
				callCount++;
			});
			store.add(disposable);

			// Mark activity and advance 1 minute - should fire
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callCount, 1);

			// Keep ticking, should not fire again
			hostAdapterMock.setActive(true);
			hostAdapterMock.setActive(false);
			clock.tick(ONE_MINUTE);
			assert.strictEqual(callCount, 1);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userData/browser/userDataInit.ts]---
Location: vscode-main/src/vs/workbench/services/userData/browser/userDataInit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { mark } from '../../../../base/common/performance.js';

export interface IUserDataInitializer {
	requiresInitialization(): Promise<boolean>;
	whenInitializationFinished(): Promise<void>;
	initializeRequiredResources(): Promise<void>;
	initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void>;
	initializeOtherResources(instantiationService: IInstantiationService): Promise<void>;
}

export const IUserDataInitializationService = createDecorator<IUserDataInitializationService>('IUserDataInitializationService');
export interface IUserDataInitializationService extends IUserDataInitializer {
	_serviceBrand: undefined;
}

export class UserDataInitializationService implements IUserDataInitializationService {

	_serviceBrand: undefined;

	constructor(private readonly initializers: IUserDataInitializer[] = []) {
	}

	async whenInitializationFinished(): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.whenInitializationFinished()));
		}
	}

	async requiresInitialization(): Promise<boolean> {
		return (await Promise.all(this.initializers.map(initializer => initializer.requiresInitialization()))).some(result => result);
	}

	async initializeRequiredResources(): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeRequiredResources()));
		}
	}

	async initializeOtherResources(instantiationService: IInstantiationService): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeOtherResources(instantiationService)));
		}
	}

	async initializeInstalledExtensions(instantiationService: IInstantiationService): Promise<void> {
		if (await this.requiresInitialization()) {
			await Promise.all(this.initializers.map(initializer => initializer.initializeInstalledExtensions(instantiationService)));
		}
	}

}

class InitializeOtherResourcesContribution implements IWorkbenchContribution {
	constructor(
		@IUserDataInitializationService userDataInitializeService: IUserDataInitializationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IExtensionService extensionService: IExtensionService
	) {
		extensionService.whenInstalledExtensionsRegistered().then(() => this.initializeOtherResource(userDataInitializeService, instantiationService));
	}

	private async initializeOtherResource(userDataInitializeService: IUserDataInitializationService, instantiationService: IInstantiationService): Promise<void> {
		if (await userDataInitializeService.requiresInitialization()) {
			mark('code/willInitOtherUserData');
			await userDataInitializeService.initializeOtherResources(instantiationService);
			mark('code/didInitOtherUserData');
		}
	}
}

if (isWeb) {
	const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench);
	workbenchRegistry.registerWorkbenchContribution(InitializeOtherResourcesContribution, LifecyclePhase.Restored);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/extensionsResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/extensionsResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { GlobalExtensionEnablementService } from '../../../../platform/extensionManagement/common/extensionEnablementService.js';
import { EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT, EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT, IExtensionGalleryService, IExtensionIdentifier, IExtensionManagementService, IGlobalExtensionEnablementService, ILocalExtension, InstallExtensionInfo } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileStorageService } from '../../../../platform/userDataProfile/common/userDataProfileStorageService.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';

interface IProfileExtension {
	identifier: IExtensionIdentifier;
	displayName?: string;
	preRelease?: boolean;
	applicationScoped?: boolean;
	disabled?: boolean;
	version?: string;
}

export class ExtensionsResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IGlobalExtensionEnablementService private readonly extensionEnablementService: IGlobalExtensionEnablementService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const profileExtensions: IProfileExtension[] = JSON.parse(content);
		const installedExtensions = await this.extensionManagementService.getInstalled(undefined, this.userDataProfileService.currentProfile.extensionsResource);
		const extensionsToEnableOrDisable: { extension: IExtensionIdentifier; enable: boolean }[] = [];
		const extensionsToInstall: IProfileExtension[] = [];
		for (const e of profileExtensions) {
			const isDisabled = this.extensionEnablementService.getDisabledExtensions().some(disabledExtension => areSameExtensions(disabledExtension, e.identifier));
			const installedExtension = installedExtensions.find(installed => areSameExtensions(installed.identifier, e.identifier));
			if (!installedExtension || (!installedExtension.isBuiltin && installedExtension.preRelease !== e.preRelease)) {
				extensionsToInstall.push(e);
			}
			if (isDisabled !== !!e.disabled) {
				extensionsToEnableOrDisable.push({ extension: e.identifier, enable: !e.disabled });
			}
		}
		const extensionsToUninstall: ILocalExtension[] = installedExtensions.filter(extension => !extension.isBuiltin && !profileExtensions.some(({ identifier }) => areSameExtensions(identifier, extension.identifier)));
		for (const { extension, enable } of extensionsToEnableOrDisable) {
			if (enable) {
				this.logService.trace(`Initializing Profile: Enabling extension...`, extension.id);
				await this.extensionEnablementService.enableExtension(extension);
				this.logService.info(`Initializing Profile: Enabled extension...`, extension.id);
			} else {
				this.logService.trace(`Initializing Profile: Disabling extension...`, extension.id);
				await this.extensionEnablementService.disableExtension(extension);
				this.logService.info(`Initializing Profile: Disabled extension...`, extension.id);
			}
		}
		if (extensionsToInstall.length) {
			const galleryExtensions = await this.extensionGalleryService.getExtensions(extensionsToInstall.map(e => ({ ...e.identifier, version: e.version, hasPreRelease: e.version ? undefined : e.preRelease })), CancellationToken.None);
			await Promise.all(extensionsToInstall.map(async e => {
				const extension = galleryExtensions.find(galleryExtension => areSameExtensions(galleryExtension.identifier, e.identifier));
				if (!extension) {
					return;
				}
				if (await this.extensionManagementService.canInstall(extension) === true) {
					this.logService.trace(`Initializing Profile: Installing extension...`, extension.identifier.id, extension.version);
					await this.extensionManagementService.installFromGallery(extension, {
						isMachineScoped: false,/* set isMachineScoped value to prevent install and sync dialog in web */
						donotIncludePackAndDependencies: true,
						installGivenVersion: !!e.version,
						installPreReleaseVersion: e.preRelease,
						profileLocation: this.userDataProfileService.currentProfile.extensionsResource,
						context: { [EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT]: true, [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true }
					});
					this.logService.info(`Initializing Profile: Installed extension...`, extension.identifier.id, extension.version);
				} else {
					this.logService.info(`Initializing Profile: Skipped installing extension because it cannot be installed.`, extension.identifier.id);
				}
			}));
		}
		if (extensionsToUninstall.length) {
			await Promise.all(extensionsToUninstall.map(e => this.extensionManagementService.uninstall(e)));
		}
	}
}

export class ExtensionsResource implements IProfileResource {

	constructor(
		@IWorkbenchExtensionManagementService private readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IUserDataProfileStorageService private readonly userDataProfileStorageService: IUserDataProfileStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile, exclude?: string[]): Promise<string> {
		const extensions = await this.getLocalExtensions(profile);
		return this.toContent(extensions, exclude);
	}

	toContent(extensions: IProfileExtension[], exclude?: string[]): string {
		return JSON.stringify(exclude?.length ? extensions.filter(e => !exclude.includes(e.identifier.id.toLowerCase())) : extensions);
	}

	async apply(content: string, profile: IUserDataProfile, progress?: (message: string) => void, token?: CancellationToken): Promise<void> {
		return this.withProfileScopedServices(profile, async (extensionEnablementService) => {
			const profileExtensions: IProfileExtension[] = await this.getProfileExtensions(content);
			const installedExtensions = await this.extensionManagementService.getInstalled(undefined, profile.extensionsResource);
			const extensionsToEnableOrDisable: { extension: IExtensionIdentifier; enable: boolean }[] = [];
			const extensionsToInstall: IProfileExtension[] = [];
			for (const e of profileExtensions) {
				const isDisabled = extensionEnablementService.getDisabledExtensions().some(disabledExtension => areSameExtensions(disabledExtension, e.identifier));
				const installedExtension = installedExtensions.find(installed => areSameExtensions(installed.identifier, e.identifier));
				if (!installedExtension || (!installedExtension.isBuiltin && installedExtension.preRelease !== e.preRelease)) {
					extensionsToInstall.push(e);
				}
				if (isDisabled !== !!e.disabled) {
					extensionsToEnableOrDisable.push({ extension: e.identifier, enable: !e.disabled });
				}
			}
			const extensionsToUninstall: ILocalExtension[] = installedExtensions.filter(extension => !extension.isBuiltin && !profileExtensions.some(({ identifier }) => areSameExtensions(identifier, extension.identifier)) && !extension.isApplicationScoped);
			for (const { extension, enable } of extensionsToEnableOrDisable) {
				if (enable) {
					this.logService.trace(`Importing Profile (${profile.name}): Enabling extension...`, extension.id);
					await extensionEnablementService.enableExtension(extension);
					this.logService.info(`Importing Profile (${profile.name}): Enabled extension...`, extension.id);
				} else {
					this.logService.trace(`Importing Profile (${profile.name}): Disabling extension...`, extension.id);
					await extensionEnablementService.disableExtension(extension);
					this.logService.info(`Importing Profile (${profile.name}): Disabled extension...`, extension.id);
				}
			}
			if (extensionsToInstall.length) {
				this.logService.info(`Importing Profile (${profile.name}): Started installing extensions.`);
				const galleryExtensions = await this.extensionGalleryService.getExtensions(extensionsToInstall.map(e => ({ ...e.identifier, version: e.version, hasPreRelease: e.version ? undefined : e.preRelease })), CancellationToken.None);
				const installExtensionInfos: InstallExtensionInfo[] = [];
				await Promise.all(extensionsToInstall.map(async e => {
					const extension = galleryExtensions.find(galleryExtension => areSameExtensions(galleryExtension.identifier, e.identifier));
					if (!extension) {
						return;
					}
					if (await this.extensionManagementService.canInstall(extension) === true) {
						installExtensionInfos.push({
							extension,
							options: {
								isMachineScoped: false,/* set isMachineScoped value to prevent install and sync dialog in web */
								donotIncludePackAndDependencies: true,
								installGivenVersion: !!e.version,
								installPreReleaseVersion: e.preRelease,
								profileLocation: profile.extensionsResource,
								context: { [EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT]: true }
							}
						});
					} else {
						this.logService.info(`Importing Profile (${profile.name}): Skipped installing extension because it cannot be installed.`, extension.identifier.id);
					}
				}));
				if (installExtensionInfos.length) {
					if (token) {
						await this.extensionManagementService.requestPublisherTrust(installExtensionInfos);
						for (const installExtensionInfo of installExtensionInfos) {
							if (token.isCancellationRequested) {
								return;
							}
							progress?.(localize('installingExtension', "Installing extension {0}...", installExtensionInfo.extension.displayName ?? installExtensionInfo.extension.identifier.id));
							await this.extensionManagementService.installFromGallery(installExtensionInfo.extension, installExtensionInfo.options);
						}
					} else {
						await this.extensionManagementService.installGalleryExtensions(installExtensionInfos);
					}
				}
				this.logService.info(`Importing Profile (${profile.name}): Finished installing extensions.`);
			}
			if (extensionsToUninstall.length) {
				await Promise.all(extensionsToUninstall.map(e => this.extensionManagementService.uninstall(e)));
			}
		});
	}

	async copy(from: IUserDataProfile, to: IUserDataProfile, disableExtensions: boolean): Promise<void> {
		await this.extensionManagementService.copyExtensions(from.extensionsResource, to.extensionsResource);
		const extensionsToDisable = await this.withProfileScopedServices(from, async (extensionEnablementService) =>
			extensionEnablementService.getDisabledExtensions());
		if (disableExtensions) {
			const extensions = await this.extensionManagementService.getInstalled(ExtensionType.User, to.extensionsResource);
			for (const extension of extensions) {
				extensionsToDisable.push(extension.identifier);
			}
		}
		await this.withProfileScopedServices(to, async (extensionEnablementService) =>
			Promise.all(extensionsToDisable.map(extension => extensionEnablementService.disableExtension(extension))));
	}

	async getLocalExtensions(profile: IUserDataProfile): Promise<IProfileExtension[]> {
		return this.withProfileScopedServices(profile, async (extensionEnablementService) => {
			const result = new Map<string, IProfileExtension & { displayName?: string }>();
			const installedExtensions = await this.extensionManagementService.getInstalled(undefined, profile.extensionsResource);
			const disabledExtensions = extensionEnablementService.getDisabledExtensions();
			for (const extension of installedExtensions) {
				const { identifier, preRelease } = extension;
				const disabled = disabledExtensions.some(disabledExtension => areSameExtensions(disabledExtension, identifier));
				if (extension.isBuiltin && !disabled) {
					// skip enabled builtin extensions
					continue;
				}
				if (!extension.isBuiltin) {
					if (!extension.identifier.uuid) {
						// skip user extensions without uuid
						continue;
					}
				}
				const existing = result.get(identifier.id.toLowerCase());
				if (existing?.disabled) {
					// Remove the duplicate disabled extension
					result.delete(identifier.id.toLowerCase());
				}
				const profileExtension: IProfileExtension = { identifier, displayName: extension.manifest.displayName };
				if (disabled) {
					profileExtension.disabled = true;
				}
				if (!extension.isBuiltin && extension.pinned) {
					profileExtension.version = extension.manifest.version;
				}
				if (!profileExtension.version && preRelease) {
					profileExtension.preRelease = true;
				}
				profileExtension.applicationScoped = extension.isApplicationScoped;
				result.set(profileExtension.identifier.id.toLowerCase(), profileExtension);
			}
			return [...result.values()];
		});
	}

	async getProfileExtensions(content: string): Promise<IProfileExtension[]> {
		return JSON.parse(content);
	}

	private async withProfileScopedServices<T>(profile: IUserDataProfile, fn: (extensionEnablementService: IGlobalExtensionEnablementService) => Promise<T>): Promise<T> {
		return this.userDataProfileStorageService.withProfileScopedStorageService(profile,
			async storageService => {
				const disposables = new DisposableStore();
				const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IStorageService, storageService])));
				const extensionEnablementService = disposables.add(instantiationService.createInstance(GlobalExtensionEnablementService));
				try {
					return await fn(extensionEnablementService);
				} finally {
					disposables.dispose();
				}
			});
	}
}

export abstract class ExtensionsResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Extensions;
	readonly handle = ProfileResourceType.Extensions;
	readonly label = { label: localize('extensions', "Extensions") };
	readonly collapsibleState = TreeItemCollapsibleState.Expanded;
	contextValue = ProfileResourceType.Extensions;
	checkbox: ITreeItemCheckboxState | undefined;

	protected readonly excludedExtensions = new Set<string>();

	async getChildren(): Promise<Array<IProfileResourceChildTreeItem & IProfileExtension>> {
		const extensions = (await this.getExtensions()).sort((a, b) => (a.displayName ?? a.identifier.id).localeCompare(b.displayName ?? b.identifier.id));
		const that = this;
		return extensions.map<IProfileResourceChildTreeItem & IProfileExtension>(e => ({
			...e,
			handle: e.identifier.id.toLowerCase(),
			parent: this,
			label: { label: e.displayName || e.identifier.id },
			description: e.applicationScoped ? localize('all profiles and disabled', "All Profiles") : undefined,
			collapsibleState: TreeItemCollapsibleState.None,
			checkbox: that.checkbox ? {
				get isChecked() { return !that.excludedExtensions.has(e.identifier.id.toLowerCase()); },
				set isChecked(value: boolean) {
					if (value) {
						that.excludedExtensions.delete(e.identifier.id.toLowerCase());
					} else {
						that.excludedExtensions.add(e.identifier.id.toLowerCase());
					}
				},
				tooltip: localize('exclude', "Select {0} Extension", e.displayName || e.identifier.id),
				accessibilityInformation: {
					label: localize('exclude', "Select {0} Extension", e.displayName || e.identifier.id),
				}
			} : undefined,
			themeIcon: Codicon.extensions,
			command: {
				id: 'extension.open',
				title: '',
				arguments: [e.identifier.id, undefined, true]
			}
		}));
	}

	async hasContent(): Promise<boolean> {
		const extensions = await this.getExtensions();
		return extensions.length > 0;
	}

	abstract isFromDefaultProfile(): boolean;
	abstract getContent(): Promise<string>;
	protected abstract getExtensions(): Promise<IProfileExtension[]>;

}

export class ExtensionsResourceExportTreeItem extends ExtensionsResourceTreeItem {

	constructor(
		private readonly profile: IUserDataProfile,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.extensions;
	}

	protected getExtensions(): Promise<IProfileExtension[]> {
		return this.instantiationService.createInstance(ExtensionsResource).getLocalExtensions(this.profile);
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(ExtensionsResource).getContent(this.profile, [...this.excludedExtensions.values()]);
	}

}

export class ExtensionsResourceImportTreeItem extends ExtensionsResourceTreeItem {

	constructor(
		private readonly content: string,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	isFromDefaultProfile(): boolean {
		return false;
	}

	protected getExtensions(): Promise<IProfileExtension[]> {
		return this.instantiationService.createInstance(ExtensionsResource).getProfileExtensions(this.content);
	}

	async getContent(): Promise<string> {
		const extensionsResource = this.instantiationService.createInstance(ExtensionsResource);
		const extensions = await extensionsResource.getProfileExtensions(this.content);
		return extensionsResource.toContent(extensions, [...this.excludedExtensions.values()]);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/globalStateResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/globalStateResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageEntry, IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileStorageService } from '../../../../platform/userDataProfile/common/userDataProfileStorageService.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem } from '../common/userDataProfile.js';

interface IGlobalState {
	storage: IStringDictionary<string>;
}

export class GlobalStateResourceInitializer implements IProfileResourceInitializer {

	constructor(@IStorageService private readonly storageService: IStorageService) {
	}

	async initialize(content: string): Promise<void> {
		const globalState: IGlobalState = JSON.parse(content);
		const storageKeys = Object.keys(globalState.storage);
		if (storageKeys.length) {
			const storageEntries: Array<IStorageEntry> = [];
			for (const key of storageKeys) {
				storageEntries.push({ key, value: globalState.storage[key], scope: StorageScope.PROFILE, target: StorageTarget.USER });
			}
			this.storageService.storeAll(storageEntries, true);
		}
	}
}

export class GlobalStateResource implements IProfileResource {

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IUserDataProfileStorageService private readonly userDataProfileStorageService: IUserDataProfileStorageService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile): Promise<string> {
		const globalState = await this.getGlobalState(profile);
		return JSON.stringify(globalState);
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const globalState: IGlobalState = JSON.parse(content);
		await this.writeGlobalState(globalState, profile);
	}

	async getGlobalState(profile: IUserDataProfile): Promise<IGlobalState> {
		const storage: IStringDictionary<string> = {};
		const storageData = await this.userDataProfileStorageService.readStorageData(profile);
		for (const [key, value] of storageData) {
			if (value.value !== undefined && value.target === StorageTarget.USER) {
				storage[key] = value.value;
			}
		}
		return { storage };
	}

	private async writeGlobalState(globalState: IGlobalState, profile: IUserDataProfile): Promise<void> {
		const storageKeys = Object.keys(globalState.storage);
		if (storageKeys.length) {
			const updatedStorage = new Map<string, string | undefined>();
			const nonProfileKeys = [
				// Do not include application scope user target keys because they also include default profile user target keys
				...this.storageService.keys(StorageScope.APPLICATION, StorageTarget.MACHINE),
				...this.storageService.keys(StorageScope.WORKSPACE, StorageTarget.USER),
				...this.storageService.keys(StorageScope.WORKSPACE, StorageTarget.MACHINE),
			];
			for (const key of storageKeys) {
				if (nonProfileKeys.includes(key)) {
					this.logService.info(`Importing Profile (${profile.name}): Ignoring global state key '${key}' because it is not a profile key.`);
				} else {
					updatedStorage.set(key, globalState.storage[key]);
				}
			}
			await this.userDataProfileStorageService.updateStorageData(profile, updatedStorage, StorageTarget.USER);
		}
	}
}

export abstract class GlobalStateResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.GlobalState;
	readonly handle = ProfileResourceType.GlobalState;
	readonly label = { label: localize('globalState', "UI State") };
	readonly collapsibleState = TreeItemCollapsibleState.Collapsed;
	checkbox: ITreeItemCheckboxState | undefined;

	constructor(
		private readonly resource: URI,
		private readonly uriIdentityService: IUriIdentityService
	) { }

	async getChildren(): Promise<IProfileResourceChildTreeItem[]> {
		return [{
			handle: this.resource.toString(),
			resourceUri: this.resource,
			collapsibleState: TreeItemCollapsibleState.None,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(this.resource)
			},
			parent: this,
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [this.resource, undefined, undefined]
			}
		}];
	}

	abstract getContent(): Promise<string>;
	abstract isFromDefaultProfile(): boolean;
}

export class GlobalStateResourceExportTreeItem extends GlobalStateResourceTreeItem {

	constructor(
		private readonly profile: IUserDataProfile,
		resource: URI,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(resource, uriIdentityService);
	}

	async hasContent(): Promise<boolean> {
		const globalState = await this.instantiationService.createInstance(GlobalStateResource).getGlobalState(this.profile);
		return Object.keys(globalState.storage).length > 0;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(GlobalStateResource).getContent(this.profile);
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.globalState;
	}

}

export class GlobalStateResourceImportTreeItem extends GlobalStateResourceTreeItem {

	constructor(
		private readonly content: string,
		resource: URI,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(resource, uriIdentityService);
	}

	async getContent(): Promise<string> {
		return this.content;
	}

	isFromDefaultProfile(): boolean {
		return false;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/iconSelectBox.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/iconSelectBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIconSelectBoxOptions, IconSelectBox } from '../../../../base/browser/ui/icons/iconSelectBox.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import * as dom from '../../../../base/browser/dom.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

export const WorkbenchIconSelectBoxFocusContextKey = new RawContextKey<boolean>('iconSelectBoxFocus', true);
export const WorkbenchIconSelectBoxInputFocusContextKey = new RawContextKey<boolean>('iconSelectBoxInputFocus', true);
export const WorkbenchIconSelectBoxInputEmptyContextKey = new RawContextKey<boolean>('iconSelectBoxInputEmpty', true);

export class WorkbenchIconSelectBox extends IconSelectBox {

	private static focusedWidget: WorkbenchIconSelectBox | undefined;
	static getFocusedWidget(): WorkbenchIconSelectBox | undefined {
		return WorkbenchIconSelectBox.focusedWidget;
	}

	private readonly contextKeyService: IContextKeyService;
	private readonly inputFocusContextKey: IContextKey<boolean>;
	private readonly inputEmptyContextKey: IContextKey<boolean>;

	constructor(
		options: IIconSelectBoxOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(options);
		this.contextKeyService = this._register(contextKeyService.createScoped(this.domNode));
		WorkbenchIconSelectBoxFocusContextKey.bindTo(this.contextKeyService);
		this.inputFocusContextKey = WorkbenchIconSelectBoxInputFocusContextKey.bindTo(this.contextKeyService);
		this.inputEmptyContextKey = WorkbenchIconSelectBoxInputEmptyContextKey.bindTo(this.contextKeyService);
		if (this.inputBox) {
			const focusTracker = this._register(dom.trackFocus(this.inputBox.inputElement));
			this._register(focusTracker.onDidFocus(() => this.inputFocusContextKey.set(true)));
			this._register(focusTracker.onDidBlur(() => this.inputFocusContextKey.set(false)));
			this._register(this.inputBox.onDidChange(() => this.inputEmptyContextKey.set(this.inputBox?.value.length === 0)));
		}
	}

	override focus(): void {
		super.focus();
		WorkbenchIconSelectBox.focusedWidget = this;
	}

}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'iconSelectBox.focusUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchIconSelectBoxFocusContextKey,
	primary: KeyCode.UpArrow,
	handler: () => {
		const selectBox = WorkbenchIconSelectBox.getFocusedWidget();
		if (selectBox) {
			selectBox.focusPreviousRow();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'iconSelectBox.focusDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchIconSelectBoxFocusContextKey,
	primary: KeyCode.DownArrow,
	handler: () => {
		const selectBox = WorkbenchIconSelectBox.getFocusedWidget();
		if (selectBox) {
			selectBox.focusNextRow();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'iconSelectBox.focusNext',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchIconSelectBoxFocusContextKey, ContextKeyExpr.or(WorkbenchIconSelectBoxInputEmptyContextKey, WorkbenchIconSelectBoxInputFocusContextKey.toNegated())),
	primary: KeyCode.RightArrow,
	handler: () => {
		const selectBox = WorkbenchIconSelectBox.getFocusedWidget();
		if (selectBox) {
			selectBox.focusNext();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'iconSelectBox.focusPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchIconSelectBoxFocusContextKey, ContextKeyExpr.or(WorkbenchIconSelectBoxInputEmptyContextKey, WorkbenchIconSelectBoxInputFocusContextKey.toNegated())),
	primary: KeyCode.LeftArrow,
	handler: () => {
		const selectBox = WorkbenchIconSelectBox.getFocusedWidget();
		if (selectBox) {
			selectBox.focusPrevious();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'iconSelectBox.selectFocused',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchIconSelectBoxFocusContextKey,
	primary: KeyCode.Enter,
	handler: () => {
		const selectBox = WorkbenchIconSelectBox.getFocusedWidget();
		if (selectBox) {
			selectBox.setSelection(selectBox.getFocus()[0]);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/keybindingsResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/keybindingsResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';
import { platform, Platform } from '../../../../base/common/platform.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { localize } from '../../../../nls.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

interface IKeybindingsResourceContent {
	platform: Platform;
	keybindings: string | null;
}

export class KeybindingsResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const keybindingsContent: IKeybindingsResourceContent = JSON.parse(content);
		if (keybindingsContent.keybindings === null) {
			this.logService.info(`Initializing Profile: No keybindings to apply...`);
			return;
		}
		await this.fileService.writeFile(this.userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString(keybindingsContent.keybindings));
	}
}

export class KeybindingsResource implements IProfileResource {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile): Promise<string> {
		const keybindingsContent = await this.getKeybindingsResourceContent(profile);
		return JSON.stringify(keybindingsContent);
	}

	async getKeybindingsResourceContent(profile: IUserDataProfile): Promise<IKeybindingsResourceContent> {
		const keybindings = await this.getKeybindingsContent(profile);
		return { keybindings, platform };
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const keybindingsContent: IKeybindingsResourceContent = JSON.parse(content);
		if (keybindingsContent.keybindings === null) {
			this.logService.info(`Importing Profile (${profile.name}): No keybindings to apply...`);
			return;
		}
		await this.fileService.writeFile(profile.keybindingsResource, VSBuffer.fromString(keybindingsContent.keybindings));
	}

	private async getKeybindingsContent(profile: IUserDataProfile): Promise<string | null> {
		try {
			const content = await this.fileService.readFile(profile.keybindingsResource);
			return content.value.toString();
		} catch (error) {
			// File not found
			if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return null;
			} else {
				throw error;
			}
		}
	}

}

export class KeybindingsResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Keybindings;
	readonly handle = ProfileResourceType.Keybindings;
	readonly label = { label: localize('keybindings', "Keyboard Shortcuts") };
	readonly collapsibleState = TreeItemCollapsibleState.Expanded;
	checkbox: ITreeItemCheckboxState | undefined;

	constructor(
		private readonly profile: IUserDataProfile,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.keybindings;
	}

	async getChildren(): Promise<IProfileResourceChildTreeItem[]> {
		return [{
			handle: this.profile.keybindingsResource.toString(),
			resourceUri: this.profile.keybindingsResource,
			collapsibleState: TreeItemCollapsibleState.None,
			parent: this,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(this.profile.settingsResource)
			},
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [this.profile.keybindingsResource, undefined, undefined]
			}
		}];
	}

	async hasContent(): Promise<boolean> {
		const keybindingsContent = await this.instantiationService.createInstance(KeybindingsResource).getKeybindingsResourceContent(this.profile);
		return keybindingsContent.keybindings !== null;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(KeybindingsResource).getContent(this.profile);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/mcpProfileResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/mcpProfileResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { localize } from '../../../../nls.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';

interface IMcpResourceContent {
	readonly mcp: string | null;
}

export class McpResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const mcpContent: IMcpResourceContent = JSON.parse(content);
		if (!mcpContent.mcp) {
			this.logService.info(`Initializing Profile: No MCP servers to apply...`);
			return;
		}
		await this.fileService.writeFile(this.userDataProfileService.currentProfile.mcpResource, VSBuffer.fromString(mcpContent.mcp));
	}
}

export class McpProfileResource implements IProfileResource {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile): Promise<string> {
		const mcpContent = await this.getMcpResourceContent(profile);
		return JSON.stringify(mcpContent);
	}

	async getMcpResourceContent(profile: IUserDataProfile): Promise<IMcpResourceContent> {
		const mcpContent = await this.getMcpContent(profile);
		return { mcp: mcpContent };
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const mcpContent: IMcpResourceContent = JSON.parse(content);
		if (!mcpContent.mcp) {
			this.logService.info(`Importing Profile (${profile.name}): No MCP servers to apply...`);
			return;
		}
		await this.fileService.writeFile(profile.mcpResource, VSBuffer.fromString(mcpContent.mcp));
	}

	private async getMcpContent(profile: IUserDataProfile): Promise<string | null> {
		try {
			const content = await this.fileService.readFile(profile.mcpResource);
			return content.value.toString();
		} catch (error) {
			// File not found
			if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return null;
			} else {
				throw error;
			}
		}
	}
}

export class McpResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Mcp;
	readonly handle = ProfileResourceType.Mcp;
	readonly label = { label: localize('mcp', "MCP Servers") };
	readonly collapsibleState = TreeItemCollapsibleState.Expanded;
	checkbox: ITreeItemCheckboxState | undefined;

	constructor(
		private readonly profile: IUserDataProfile,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	async getChildren(): Promise<IProfileResourceChildTreeItem[]> {
		return [{
			handle: this.profile.mcpResource.toString(),
			resourceUri: this.profile.mcpResource,
			collapsibleState: TreeItemCollapsibleState.None,
			parent: this,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(this.profile.mcpResource)
			},
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [this.profile.mcpResource, undefined, undefined]
			}
		}];
	}

	async hasContent(): Promise<boolean> {
		const mcpContent = await this.instantiationService.createInstance(McpProfileResource).getMcpResourceContent(this.profile);
		return mcpContent.mcp !== null;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(McpProfileResource).getContent(this.profile);
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.mcp;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/settingsResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/settingsResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';
import { updateIgnoredSettings } from '../../../../platform/userDataSync/common/settingsMerge.js';
import { IUserDataSyncUtilService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { localize } from '../../../../nls.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

interface ISettingsContent {
	settings: string | null;
}

export class SettingsResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const settingsContent: ISettingsContent = JSON.parse(content);
		if (settingsContent.settings === null) {
			this.logService.info(`Initializing Profile: No settings to apply...`);
			return;
		}
		await this.fileService.writeFile(this.userDataProfileService.currentProfile.settingsResource, VSBuffer.fromString(settingsContent.settings));
	}
}

export class SettingsResource implements IProfileResource {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IUserDataSyncUtilService private readonly userDataSyncUtilService: IUserDataSyncUtilService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile): Promise<string> {
		const settingsContent = await this.getSettingsContent(profile);
		return JSON.stringify(settingsContent);
	}

	async getSettingsContent(profile: IUserDataProfile): Promise<ISettingsContent> {
		const localContent = await this.getLocalFileContent(profile);
		if (localContent === null) {
			return { settings: null };
		} else {
			const ignoredSettings = this.getIgnoredSettings();
			const formattingOptions = await this.userDataSyncUtilService.resolveFormattingOptions(profile.settingsResource);
			const settings = updateIgnoredSettings(localContent || '{}', '{}', ignoredSettings, formattingOptions);
			return { settings };
		}
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const settingsContent: ISettingsContent = JSON.parse(content);
		if (settingsContent.settings === null) {
			this.logService.info(`Importing Profile (${profile.name}): No settings to apply...`);
			return;
		}
		const localSettingsContent = await this.getLocalFileContent(profile);
		const formattingOptions = await this.userDataSyncUtilService.resolveFormattingOptions(profile.settingsResource);
		const contentToUpdate = updateIgnoredSettings(settingsContent.settings, localSettingsContent || '{}', this.getIgnoredSettings(), formattingOptions);
		await this.fileService.writeFile(profile.settingsResource, VSBuffer.fromString(contentToUpdate));
	}

	private getIgnoredSettings(): string[] {
		const allSettings = Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationProperties();
		const ignoredSettings = Object.keys(allSettings).filter(key => allSettings[key]?.scope === ConfigurationScope.MACHINE || allSettings[key]?.scope === ConfigurationScope.APPLICATION_MACHINE || allSettings[key]?.scope === ConfigurationScope.MACHINE_OVERRIDABLE);
		return ignoredSettings;
	}

	private async getLocalFileContent(profile: IUserDataProfile): Promise<string | null> {
		try {
			const content = await this.fileService.readFile(profile.settingsResource);
			return content.value.toString();
		} catch (error) {
			// File not found
			if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return null;
			} else {
				throw error;
			}
		}
	}

}

export class SettingsResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Settings;
	readonly handle = ProfileResourceType.Settings;
	readonly label = { label: localize('settings', "Settings") };
	readonly collapsibleState = TreeItemCollapsibleState.Expanded;
	checkbox: ITreeItemCheckboxState | undefined;

	constructor(
		private readonly profile: IUserDataProfile,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	async getChildren(): Promise<IProfileResourceChildTreeItem[]> {
		return [{
			handle: this.profile.settingsResource.toString(),
			resourceUri: this.profile.settingsResource,
			collapsibleState: TreeItemCollapsibleState.None,
			parent: this,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(this.profile.settingsResource)
			},
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [this.profile.settingsResource, undefined, undefined]
			}
		}];
	}

	async hasContent(): Promise<boolean> {
		const settingsContent = await this.instantiationService.createInstance(SettingsResource).getSettingsContent(this.profile);
		return settingsContent.settings !== null;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(SettingsResource).getContent(this.profile);
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.settings;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/snippetsResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/snippetsResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { FileOperationError, FileOperationResult, IFileService, IFileStat } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';

interface ISnippetsContent {
	snippets: IStringDictionary<string>;
}

export class SnippetsResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const snippetsContent: ISnippetsContent = JSON.parse(content);
		for (const key in snippetsContent.snippets) {
			const resource = this.uriIdentityService.extUri.joinPath(this.userDataProfileService.currentProfile.snippetsHome, key);
			await this.fileService.writeFile(resource, VSBuffer.fromString(snippetsContent.snippets[key]));
		}
	}
}

export class SnippetsResource implements IProfileResource {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
	}

	async getContent(profile: IUserDataProfile, excluded?: ResourceSet): Promise<string> {
		const snippets = await this.getSnippets(profile, excluded);
		return JSON.stringify({ snippets });
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const snippetsContent: ISnippetsContent = JSON.parse(content);
		for (const key in snippetsContent.snippets) {
			const resource = this.uriIdentityService.extUri.joinPath(profile.snippetsHome, key);
			await this.fileService.writeFile(resource, VSBuffer.fromString(snippetsContent.snippets[key]));
		}
	}

	private async getSnippets(profile: IUserDataProfile, excluded?: ResourceSet): Promise<IStringDictionary<string>> {
		const snippets: IStringDictionary<string> = {};
		const snippetsResources = await this.getSnippetsResources(profile, excluded);
		for (const resource of snippetsResources) {
			const key = this.uriIdentityService.extUri.relativePath(profile.snippetsHome, resource)!;
			const content = await this.fileService.readFile(resource);
			snippets[key] = content.value.toString();
		}
		return snippets;
	}

	async getSnippetsResources(profile: IUserDataProfile, excluded?: ResourceSet): Promise<URI[]> {
		const snippets: URI[] = [];
		let stat: IFileStat;
		try {
			stat = await this.fileService.resolve(profile.snippetsHome);
		} catch (e) {
			// No snippets
			if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return snippets;
			} else {
				throw e;
			}
		}
		for (const { resource } of stat.children || []) {
			if (excluded?.has(resource)) {
				continue;
			}
			const extension = this.uriIdentityService.extUri.extname(resource);
			if (extension === '.json' || extension === '.code-snippets') {
				snippets.push(resource);
			}
		}
		return snippets;
	}
}

export class SnippetsResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Snippets;
	readonly handle: string;
	readonly label = { label: localize('snippets', "Snippets") };
	readonly collapsibleState = TreeItemCollapsibleState.Collapsed;
	checkbox: ITreeItemCheckboxState | undefined;

	private readonly excludedSnippets = new ResourceSet();

	constructor(
		private readonly profile: IUserDataProfile,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		this.handle = this.profile.snippetsHome.toString();
	}

	async getChildren(): Promise<IProfileResourceChildTreeItem[] | undefined> {
		const snippetsResources = await this.instantiationService.createInstance(SnippetsResource).getSnippetsResources(this.profile);
		const that = this;
		return snippetsResources.map<IProfileResourceChildTreeItem>(resource => ({
			handle: resource.toString(),
			parent: that,
			resourceUri: resource,
			collapsibleState: TreeItemCollapsibleState.None,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(resource),
			},
			checkbox: that.checkbox ? {
				get isChecked() { return !that.excludedSnippets.has(resource); },
				set isChecked(value: boolean) {
					if (value) {
						that.excludedSnippets.delete(resource);
					} else {
						that.excludedSnippets.add(resource);
					}
				},
				accessibilityInformation: {
					label: localize('exclude', "Select Snippet {0}", this.uriIdentityService.extUri.basename(resource)),
				}
			} : undefined,
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [resource, undefined, undefined]
			}
		}));
	}

	async hasContent(): Promise<boolean> {
		const snippetsResources = await this.instantiationService.createInstance(SnippetsResource).getSnippetsResources(this.profile);
		return snippetsResources.length > 0;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(SnippetsResource).getContent(this.profile, this.excludedSnippets);
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.snippets;
	}


}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/userDataProfile/browser/tasksResource.ts]---
Location: vscode-main/src/vs/workbench/services/userDataProfile/browser/tasksResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { localize } from '../../../../nls.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { ITreeItemCheckboxState, TreeItemCollapsibleState } from '../../../common/views.js';
import { IProfileResource, IProfileResourceChildTreeItem, IProfileResourceInitializer, IProfileResourceTreeItem, IUserDataProfileService } from '../common/userDataProfile.js';

interface ITasksResourceContent {
	tasks: string | null;
}

export class TasksResourceInitializer implements IProfileResourceInitializer {

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async initialize(content: string): Promise<void> {
		const tasksContent: ITasksResourceContent = JSON.parse(content);
		if (!tasksContent.tasks) {
			this.logService.info(`Initializing Profile: No tasks to apply...`);
			return;
		}
		await this.fileService.writeFile(this.userDataProfileService.currentProfile.tasksResource, VSBuffer.fromString(tasksContent.tasks));
	}
}

export class TasksResource implements IProfileResource {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	async getContent(profile: IUserDataProfile): Promise<string> {
		const tasksContent = await this.getTasksResourceContent(profile);
		return JSON.stringify(tasksContent);
	}

	async getTasksResourceContent(profile: IUserDataProfile): Promise<ITasksResourceContent> {
		const tasksContent = await this.getTasksContent(profile);
		return { tasks: tasksContent };
	}

	async apply(content: string, profile: IUserDataProfile): Promise<void> {
		const tasksContent: ITasksResourceContent = JSON.parse(content);
		if (!tasksContent.tasks) {
			this.logService.info(`Importing Profile (${profile.name}): No tasks to apply...`);
			return;
		}
		await this.fileService.writeFile(profile.tasksResource, VSBuffer.fromString(tasksContent.tasks));
	}

	private async getTasksContent(profile: IUserDataProfile): Promise<string | null> {
		try {
			const content = await this.fileService.readFile(profile.tasksResource);
			return content.value.toString();
		} catch (error) {
			// File not found
			if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return null;
			} else {
				throw error;
			}
		}
	}

}

export class TasksResourceTreeItem implements IProfileResourceTreeItem {

	readonly type = ProfileResourceType.Tasks;
	readonly handle = ProfileResourceType.Tasks;
	readonly label = { label: localize('tasks', "Tasks") };
	readonly collapsibleState = TreeItemCollapsibleState.Expanded;
	checkbox: ITreeItemCheckboxState | undefined;

	constructor(
		private readonly profile: IUserDataProfile,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	async getChildren(): Promise<IProfileResourceChildTreeItem[]> {
		return [{
			handle: this.profile.tasksResource.toString(),
			resourceUri: this.profile.tasksResource,
			collapsibleState: TreeItemCollapsibleState.None,
			parent: this,
			accessibilityInformation: {
				label: this.uriIdentityService.extUri.basename(this.profile.settingsResource)
			},
			command: {
				id: API_OPEN_EDITOR_COMMAND_ID,
				title: '',
				arguments: [this.profile.tasksResource, undefined, undefined]
			}
		}];
	}

	async hasContent(): Promise<boolean> {
		const tasksContent = await this.instantiationService.createInstance(TasksResource).getTasksResourceContent(this.profile);
		return tasksContent.tasks !== null;
	}

	async getContent(): Promise<string> {
		return this.instantiationService.createInstance(TasksResource).getContent(this.profile);
	}

	isFromDefaultProfile(): boolean {
		return !this.profile.isDefault && !!this.profile.useDefaultFlags?.tasks;
	}


}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 530
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 530 of 552)

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

---[FILE: src/vs/workbench/services/textfile/browser/textFileService.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/browser/textFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IEncodingSupport, ITextFileService, ITextFileStreamContent, ITextFileContent, IResourceEncodings, IReadTextFileOptions, IWriteTextFileOptions, toBufferOrReadable, TextFileOperationError, TextFileOperationResult, ITextFileSaveOptions, ITextFileEditorModelManager, IResourceEncoding, stringToSnapshot, ITextFileSaveAsOptions, IReadTextFileEncodingOptions, TextFileEditorModelState, IResolvedTextFileEditorModel } from '../common/textfiles.js';
import { IRevertOptions, SaveSourceRegistry } from '../../../common/editor.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IFileService, FileOperationError, FileOperationResult, IFileStatWithMetadata, ICreateFileOptions, IFileStreamContent } from '../../../../platform/files/common/files.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { extname as pathExtname } from '../../../../base/common/path.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IUntitledTextEditorService, IUntitledTextEditorModelManager } from '../../untitled/common/untitledTextEditorService.js';
import { IResolvedUntitledTextEditorModel, UntitledTextEditorModel } from '../../untitled/common/untitledTextEditorModel.js';
import { TextFileEditorModelManager } from '../common/textFileEditorModelManager.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Schemas } from '../../../../base/common/network.js';
import { createTextBufferFactoryFromSnapshot, createTextBufferFactoryFromStream } from '../../../../editor/common/model/textModel.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { joinPath, dirname, basename, toLocalResource, extname, isEqual } from '../../../../base/common/resources.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { VSBuffer, VSBufferReadable, bufferToStream, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { ITextSnapshot, ITextModel } from '../../../../editor/common/model.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IResolvedTextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IPathService } from '../../path/common/pathService.js';
import { IWorkingCopyFileService, IFileOperationUndoRedoInfo, ICreateFileOperation } from '../../workingCopy/common/workingCopyFileService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService, WORKSPACE_EXTENSION } from '../../../../platform/workspace/common/workspace.js';
import { UTF8, UTF8_with_bom, UTF16be, UTF16le, encodingExists, toEncodeReadable, toDecodeStream, IDecodeStreamResult, DecodeStreamError, DecodeStreamErrorKind } from '../common/encoding.js';
import { consumeStream, ReadableStream } from '../../../../base/common/stream.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { IDecorationData, IDecorationsProvider, IDecorationsService } from '../../decorations/common/decorations.js';
import { Emitter } from '../../../../base/common/event.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { listErrorForeground } from '../../../../platform/theme/common/colorRegistry.js';

export abstract class AbstractTextFileService extends Disposable implements ITextFileService {

	declare readonly _serviceBrand: undefined;

	private static readonly TEXTFILE_SAVE_CREATE_SOURCE = SaveSourceRegistry.registerSource('textFileCreate.source', localize('textFileCreate.source', "File Created"));
	private static readonly TEXTFILE_SAVE_REPLACE_SOURCE = SaveSourceRegistry.registerSource('textFileOverwrite.source', localize('textFileOverwrite.source', "File Replaced"));

	readonly files: ITextFileEditorModelManager;

	readonly untitled: IUntitledTextEditorModelManager;

	constructor(
		@IFileService protected readonly fileService: IFileService,
		@IUntitledTextEditorService untitledTextEditorService: IUntitledTextEditorModelManager,
		@ILifecycleService protected readonly lifecycleService: ILifecycleService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IModelService private readonly modelService: IModelService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IDialogService private readonly dialogService: IDialogService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@ITextResourceConfigurationService protected readonly textResourceConfigurationService: ITextResourceConfigurationService,
		@IFilesConfigurationService protected readonly filesConfigurationService: IFilesConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IPathService private readonly pathService: IPathService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILanguageService private readonly languageService: ILanguageService,
		@ILogService protected readonly logService: ILogService,
		@IElevatedFileService private readonly elevatedFileService: IElevatedFileService,
		@IDecorationsService private readonly decorationsService: IDecorationsService
	) {
		super();

		this.files = this._register(this.instantiationService.createInstance(TextFileEditorModelManager));
		this.untitled = untitledTextEditorService;

		this.provideDecorations();
	}

	//#region decorations

	private provideDecorations(): void {

		// Text file model decorations
		const provider = this._register(new class extends Disposable implements IDecorationsProvider {

			readonly label = localize('textFileModelDecorations', "Text File Model Decorations");

			private readonly _onDidChange = this._register(new Emitter<URI[]>());
			readonly onDidChange = this._onDidChange.event;

			constructor(private readonly files: ITextFileEditorModelManager) {
				super();

				this.registerListeners();
			}

			private registerListeners(): void {

				// Creates
				this._register(this.files.onDidResolve(({ model }) => {
					if (model.isReadonly() || model.hasState(TextFileEditorModelState.ORPHAN)) {
						this._onDidChange.fire([model.resource]);
					}
				}));

				// Removals: once a text file model is no longer
				// under our control, make sure to signal this as
				// decoration change because from this point on we
				// have no way of updating the decoration anymore.
				this._register(this.files.onDidRemove(modelUri => this._onDidChange.fire([modelUri])));

				// Changes
				this._register(this.files.onDidChangeReadonly(model => this._onDidChange.fire([model.resource])));
				this._register(this.files.onDidChangeOrphaned(model => this._onDidChange.fire([model.resource])));
			}

			provideDecorations(uri: URI): IDecorationData | undefined {
				const model = this.files.get(uri);
				if (!model || model.isDisposed()) {
					return undefined;
				}

				const isReadonly = model.isReadonly();
				const isOrphaned = model.hasState(TextFileEditorModelState.ORPHAN);

				// Readonly + Orphaned
				if (isReadonly && isOrphaned) {
					return {
						color: listErrorForeground,
						letter: Codicon.lockSmall,
						strikethrough: true,
						tooltip: localize('readonlyAndDeleted', "Deleted, Read-only"),
					};
				}

				// Readonly
				else if (isReadonly) {
					return {
						letter: Codicon.lockSmall,
						tooltip: localize('readonly', "Read-only"),
					};
				}

				// Orphaned
				else if (isOrphaned) {
					return {
						color: listErrorForeground,
						strikethrough: true,
						tooltip: localize('deleted', "Deleted"),
					};
				}

				return undefined;
			}
		}(this.files));

		this._register(this.decorationsService.registerDecorationsProvider(provider));
	}

	//#endregion

	//#region text file read / write / create

	private _encoding: EncodingOracle | undefined;

	get encoding(): EncodingOracle {
		if (!this._encoding) {
			this._encoding = this._register(this.instantiationService.createInstance(EncodingOracle));
		}

		return this._encoding;
	}

	async read(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileContent> {
		const [bufferStream, decoder] = await this.doRead(resource, {
			...options,
			// optimization: since we know that the caller does not
			// care about buffering, we indicate this to the reader.
			// this reduces all the overhead the buffered reading
			// has (open, read, close) if the provider supports
			// unbuffered reading.
			preferUnbuffered: true
		});

		return {
			...bufferStream,
			encoding: decoder.detected.encoding || UTF8,
			value: await consumeStream(decoder.stream, strings => strings.join(''))
		};
	}

	async readStream(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileStreamContent> {
		const [bufferStream, decoder] = await this.doRead(resource, options);

		return {
			...bufferStream,
			encoding: decoder.detected.encoding || UTF8,
			value: await createTextBufferFactoryFromStream(decoder.stream)
		};
	}

	private async doRead(resource: URI, options?: IReadTextFileOptions & { preferUnbuffered?: boolean }): Promise<[IFileStreamContent, IDecodeStreamResult]> {
		const cts = new CancellationTokenSource();

		// read stream raw (either buffered or unbuffered)
		let bufferStream: IFileStreamContent;
		if (options?.preferUnbuffered) {
			const content = await this.fileService.readFile(resource, options, cts.token);
			bufferStream = {
				...content,
				value: bufferToStream(content.value)
			};
		} else {
			bufferStream = await this.fileService.readFileStream(resource, options, cts.token);
		}

		// read through encoding library
		try {
			const decoder = await this.doGetDecodedStream(resource, bufferStream.value, options);

			return [bufferStream, decoder];
		} catch (error) {

			// Make sure to cancel reading on error to
			// stop file service activity as soon as
			// possible. When for example a large binary
			// file is read we want to cancel the read
			// instantly.
			// Refs:
			// - https://github.com/microsoft/vscode/issues/138805
			// - https://github.com/microsoft/vscode/issues/132771
			cts.dispose(true);

			// special treatment for streams that are binary
			if ((<DecodeStreamError>error).decodeStreamErrorKind === DecodeStreamErrorKind.STREAM_IS_BINARY) {
				throw new TextFileOperationError(localize('fileBinaryError', "File seems to be binary and cannot be opened as text"), TextFileOperationResult.FILE_IS_BINARY, options);
			}

			// re-throw any other error as it is
			else {
				throw error;
			}
		}
	}

	async create(operations: { resource: URI; value?: string | ITextSnapshot; options?: ICreateFileOptions }[], undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]> {
		const operationsWithContents: ICreateFileOperation[] = await Promise.all(operations.map(async operation => {
			const contents = await this.getEncodedReadable(operation.resource, operation.value);
			return {
				resource: operation.resource,
				contents,
				overwrite: operation.options?.overwrite
			};
		}));

		return this.workingCopyFileService.create(operationsWithContents, CancellationToken.None, undoInfo);
	}

	async write(resource: URI, value: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<IFileStatWithMetadata> {
		const readable = await this.getEncodedReadable(resource, value, options);

		if (options?.writeElevated && this.elevatedFileService.isSupported(resource)) {
			return this.elevatedFileService.writeFileElevated(resource, readable, options);
		}

		return this.fileService.writeFile(resource, readable, options);
	}

	async getEncodedReadable(resource: URI | undefined, value: ITextSnapshot): Promise<VSBufferReadable>;
	async getEncodedReadable(resource: URI | undefined, value: string): Promise<VSBuffer | VSBufferReadable>;
	async getEncodedReadable(resource: URI | undefined, value?: ITextSnapshot): Promise<VSBufferReadable | undefined>;
	async getEncodedReadable(resource: URI | undefined, value?: string): Promise<VSBuffer | VSBufferReadable | undefined>;
	async getEncodedReadable(resource: URI | undefined, value?: string | ITextSnapshot): Promise<VSBuffer | VSBufferReadable | undefined>;
	async getEncodedReadable(resource: URI | undefined, value: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<VSBuffer | VSBufferReadable>;
	async getEncodedReadable(resource: URI | undefined, value?: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<VSBuffer | VSBufferReadable | undefined> {

		// check for encoding
		const { encoding, addBOM } = await this.encoding.getWriteEncoding(resource, options);

		// when encoding is standard skip encoding step
		if (encoding === UTF8 && !addBOM) {
			return typeof value === 'undefined'
				? undefined
				: toBufferOrReadable(value);
		}

		// otherwise create encoded readable
		value = value || '';
		const snapshot = typeof value === 'string' ? stringToSnapshot(value) : value;
		return toEncodeReadable(snapshot, encoding, { addBOM });
	}

	async getDecodedStream(resource: URI | undefined, value: VSBufferReadableStream, options?: IReadTextFileEncodingOptions): Promise<ReadableStream<string>> {
		return (await this.doGetDecodedStream(resource, value, options)).stream;
	}

	private doGetDecodedStream(resource: URI | undefined, stream: VSBufferReadableStream, options?: IReadTextFileEncodingOptions): Promise<IDecodeStreamResult> {

		// read through encoding library
		return toDecodeStream(stream, {
			acceptTextOnly: options?.acceptTextOnly ?? false,
			guessEncoding:
				options?.autoGuessEncoding ||
				this.textResourceConfigurationService.getValue(resource, 'files.autoGuessEncoding'),
			candidateGuessEncodings:
				options?.candidateGuessEncodings ||
				this.textResourceConfigurationService.getValue(resource, 'files.candidateGuessEncodings'),
			overwriteEncoding: async detectedEncoding => this.validateDetectedEncoding(resource, detectedEncoding ?? undefined, options)
		});
	}

	getEncoding(resource: URI): string {
		const model = resource.scheme === Schemas.untitled ? this.untitled.get(resource) : this.files.get(resource);
		return model?.getEncoding() ?? this.encoding.getUnvalidatedEncodingForResource(resource);
	}

	async resolveDecoding(resource: URI | undefined, options?: IReadTextFileEncodingOptions): Promise<{ preferredEncoding: string; guessEncoding: boolean; candidateGuessEncodings: string[] }> {
		return {
			preferredEncoding: (await this.encoding.getPreferredReadEncoding(resource, options, undefined)).encoding,
			guessEncoding:
				options?.autoGuessEncoding ||
				this.textResourceConfigurationService.getValue(resource, 'files.autoGuessEncoding'),
			candidateGuessEncodings:
				options?.candidateGuessEncodings ||
				this.textResourceConfigurationService.getValue(resource, 'files.candidateGuessEncodings'),
		};
	}

	async validateDetectedEncoding(resource: URI | undefined, detectedEncoding: string | undefined, options?: IReadTextFileEncodingOptions): Promise<string> {
		const { encoding } = await this.encoding.getPreferredReadEncoding(resource, options, detectedEncoding);

		return encoding;
	}

	resolveEncoding(resource: URI | undefined, options?: IWriteTextFileOptions): Promise<{ encoding: string; addBOM: boolean }> {
		return this.encoding.getWriteEncoding(resource, options);
	}

	//#endregion


	//#region save

	async save(resource: URI, options?: ITextFileSaveOptions): Promise<URI | undefined> {

		// Untitled
		if (resource.scheme === Schemas.untitled) {
			const model = this.untitled.get(resource);
			if (model) {
				let targetUri: URI | undefined;

				// Untitled with associated file path don't need to prompt
				if (model.hasAssociatedFilePath) {
					targetUri = await this.suggestSavePath(resource);
				}

				// Otherwise ask user
				else {
					targetUri = await this.fileDialogService.pickFileToSave(await this.suggestSavePath(resource), options?.availableFileSystems);
				}

				// Save as if target provided
				if (targetUri) {
					return this.saveAs(resource, targetUri, options);
				}
			}
		}

		// File
		else {
			const model = this.files.get(resource);
			if (model) {
				return await model.save(options) ? resource : undefined;
			}
		}

		return undefined;
	}

	async saveAs(source: URI, target?: URI, options?: ITextFileSaveAsOptions): Promise<URI | undefined> {

		// Get to target resource
		if (!target) {
			target = await this.fileDialogService.pickFileToSave(await this.suggestSavePath(options?.suggestedTarget ?? source), options?.availableFileSystems);
		}

		if (!target) {
			return; // user canceled
		}

		// Ensure target is not marked as readonly and prompt otherwise
		if (this.filesConfigurationService.isReadonly(target)) {
			const confirmed = await this.confirmMakeWriteable(target);
			if (!confirmed) {
				return;
			} else {
				this.filesConfigurationService.updateReadonly(target, false);
			}
		}

		// Just save if target is same as models own resource
		if (isEqual(source, target)) {
			return this.save(source, { ...options, force: true  /* force to save, even if not dirty (https://github.com/microsoft/vscode/issues/99619) */ });
		}

		// If the target is different but of same identity, we
		// move the source to the target, knowing that the
		// underlying file system cannot have both and then save.
		// However, this will only work if the source exists
		// and is not orphaned, so we need to check that too.
		if (this.fileService.hasProvider(source) && this.uriIdentityService.extUri.isEqual(source, target) && (await this.fileService.exists(source))) {
			await this.workingCopyFileService.move([{ file: { source, target } }], CancellationToken.None);

			// At this point we don't know whether we have a
			// model for the source or the target URI so we
			// simply try to save with both resources.
			const success = await this.save(source, options);
			if (!success) {
				await this.save(target, options);
			}

			return target;
		}

		// Do it
		return this.doSaveAs(source, target, options);
	}

	private async doSaveAs(source: URI, target: URI, options?: ITextFileSaveOptions): Promise<URI | undefined> {
		let success = false;

		let resolvedTextModel: IResolvedTextFileEditorModel | IResolvedUntitledTextEditorModel | undefined;
		if (source.scheme !== Schemas.untitled) {
			const textFileModel = this.files.get(source);
			if (textFileModel?.isResolved()) {
				resolvedTextModel = textFileModel;
			}
		} else {
			const untitledTextModel = this.untitled.get(source);
			if (untitledTextModel?.isResolved()) {
				resolvedTextModel = untitledTextModel;
			}
		}

		// If the source is an existing resolved file or untitled text model, we can
		// directly use that model to copy the contents to the target destination
		if (resolvedTextModel) {
			success = await this.doSaveAsTextFile(resolvedTextModel, source, target, options);
		}

		// Otherwise if the source can be handled by the file service
		// we can simply invoke the copy() function to save as
		else if (this.fileService.hasProvider(source)) {
			await this.fileService.copy(source, target, true);

			success = true;
		}

		// Finally we simply check if we can find a editor model that
		// would give us access to the contents.
		else {
			const textModel = this.modelService.getModel(source);
			if (textModel) {
				success = await this.doSaveAsTextFile(textModel, source, target, options);
			}
		}

		if (!success) {
			return undefined;
		}

		// Revert the source
		try {
			await this.revert(source);
		} catch (error) {

			// It is possible that reverting the source fails, for example
			// when a remote is disconnected and we cannot read it anymore.
			// However, this should not interrupt the "Save As" flow, so
			// we gracefully catch the error and just log it.

			this.logService.error(error);
		}

		// Events
		if (source.scheme === Schemas.untitled) {
			this.untitled.notifyDidSave(source, target);
		}

		return target;
	}

	private async doSaveAsTextFile(sourceModel: IResolvedTextEditorModel | IResolvedUntitledTextEditorModel | ITextModel, source: URI, target: URI, options?: ITextFileSaveOptions): Promise<boolean> {

		// Find source encoding if any
		let sourceModelEncoding: string | undefined = undefined;
		const sourceModelWithEncodingSupport = (sourceModel as unknown as IEncodingSupport);
		if (typeof sourceModelWithEncodingSupport.getEncoding === 'function') {
			sourceModelEncoding = sourceModelWithEncodingSupport.getEncoding();
		}

		// Prefer an existing model if it is already resolved for the given target resource
		let targetExists = false;
		let targetModel = this.files.get(target);
		if (targetModel?.isResolved()) {
			targetExists = true;
		}

		// Otherwise create the target file empty if it does not exist already and resolve it from there
		else {
			targetExists = await this.fileService.exists(target);

			// create target file adhoc if it does not exist yet
			if (!targetExists) {
				await this.create([{ resource: target, value: '' }]);
			}

			try {
				targetModel = await this.files.resolve(target, { encoding: sourceModelEncoding });
			} catch (error) {
				// if the target already exists and was not created by us, it is possible
				// that we cannot resolve the target as text model if it is binary or too
				// large. in that case we have to delete the target file first and then
				// re-run the operation.
				if (targetExists) {
					if (
						(<TextFileOperationError>error).textFileOperationResult === TextFileOperationResult.FILE_IS_BINARY ||
						(<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_TOO_LARGE
					) {
						await this.fileService.del(target);

						return this.doSaveAsTextFile(sourceModel, source, target, options);
					}
				}

				throw error;
			}
		}

		// Confirm to overwrite if we have an untitled file with associated file where
		// the file actually exists on disk and we are instructed to save to that file
		// path. This can happen if the file was created after the untitled file was opened.
		// See https://github.com/microsoft/vscode/issues/67946
		let write: boolean;
		if (sourceModel instanceof UntitledTextEditorModel && sourceModel.hasAssociatedFilePath && targetExists && this.uriIdentityService.extUri.isEqual(target, toLocalResource(sourceModel.resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme))) {
			write = await this.confirmOverwrite(target);
		} else {
			write = true;
		}

		if (!write) {
			return false;
		}

		let sourceTextModel: ITextModel | undefined = undefined;
		if (sourceModel instanceof BaseTextEditorModel) {
			if (sourceModel.isResolved()) {
				sourceTextModel = sourceModel.textEditorModel ?? undefined;
			}
		} else {
			sourceTextModel = sourceModel as ITextModel;
		}

		let targetTextModel: ITextModel | undefined = undefined;
		if (targetModel.isResolved()) {
			targetTextModel = targetModel.textEditorModel;
		}

		// take over model value, encoding and language (only if more specific) from source model
		if (sourceTextModel && targetTextModel) {

			// encoding
			targetModel.updatePreferredEncoding(sourceModelEncoding);

			// content
			this.modelService.updateModel(targetTextModel, createTextBufferFactoryFromSnapshot(sourceTextModel.createSnapshot()));

			// language
			const sourceLanguageId = sourceTextModel.getLanguageId();
			const targetLanguageId = targetTextModel.getLanguageId();
			if (sourceLanguageId !== PLAINTEXT_LANGUAGE_ID && targetLanguageId === PLAINTEXT_LANGUAGE_ID) {
				targetTextModel.setLanguage(sourceLanguageId); // only use if more specific than plain/text
			}

			// transient properties
			const sourceTransientProperties = this.codeEditorService.getTransientModelProperties(sourceTextModel);
			if (sourceTransientProperties) {
				for (const [key, value] of sourceTransientProperties) {
					this.codeEditorService.setTransientModelProperty(targetTextModel, key, value);
				}
			}
		}

		// set source options depending on target exists or not
		if (!options?.source) {
			options = {
				...options,
				source: targetExists ? AbstractTextFileService.TEXTFILE_SAVE_REPLACE_SOURCE : AbstractTextFileService.TEXTFILE_SAVE_CREATE_SOURCE
			};
		}

		// save model
		return targetModel.save({
			...options,
			from: source
		});
	}

	private async confirmOverwrite(resource: URI): Promise<boolean> {
		const { confirmed } = await this.dialogService.confirm({
			type: 'warning',
			message: localize('confirmOverwrite', "'{0}' already exists. Do you want to replace it?", basename(resource)),
			detail: localize('overwriteIrreversible', "A file or folder with the name '{0}' already exists in the folder '{1}'. Replacing it will overwrite its current contents.", basename(resource), basename(dirname(resource))),
			primaryButton: localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
		});

		return confirmed;
	}

	private async confirmMakeWriteable(resource: URI): Promise<boolean> {
		const { confirmed } = await this.dialogService.confirm({
			type: 'warning',
			message: localize('confirmMakeWriteable', "'{0}' is marked as read-only. Do you want to save anyway?", basename(resource)),
			detail: localize('confirmMakeWriteableDetail', "Paths can be configured as read-only via settings."),
			primaryButton: localize({ key: 'makeWriteableButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Save Anyway")
		});

		return confirmed;
	}

	private async suggestSavePath(resource: URI): Promise<URI> {

		// Just take the resource as is if the file service can handle it
		if (this.fileService.hasProvider(resource)) {
			return resource;
		}

		const remoteAuthority = this.environmentService.remoteAuthority;
		const defaultFilePath = await this.fileDialogService.defaultFilePath();

		// Otherwise try to suggest a path that can be saved
		let suggestedFilename: string | undefined = undefined;
		if (resource.scheme === Schemas.untitled) {
			const model = this.untitled.get(resource);
			if (model) {

				// Untitled with associated file path
				if (model.hasAssociatedFilePath) {
					return toLocalResource(resource, remoteAuthority, this.pathService.defaultUriScheme);
				}

				// Untitled without associated file path: use name
				// of untitled model if it is a valid path name and
				// figure out the file extension from the mode if any.

				let nameCandidate: string;
				if (await this.pathService.hasValidBasename(joinPath(defaultFilePath, model.name), model.name)) {
					nameCandidate = model.name;
				} else {
					nameCandidate = basename(resource);
				}

				const languageId = model.getLanguageId();
				if (languageId && languageId !== PLAINTEXT_LANGUAGE_ID) {
					suggestedFilename = this.suggestFilename(languageId, nameCandidate);
				} else {
					suggestedFilename = nameCandidate;
				}
			}
		}

		// Fallback to basename of resource
		if (!suggestedFilename) {
			suggestedFilename = basename(resource);
		}

		// Try to place where last active file was if any
		// Otherwise fallback to user home
		return joinPath(defaultFilePath, suggestedFilename);
	}

	suggestFilename(languageId: string, untitledName: string) {
		const languageName = this.languageService.getLanguageName(languageId);
		if (!languageName) {
			return untitledName; // unknown language, so we cannot suggest a better name
		}

		const untitledExtension = pathExtname(untitledName);

		const extensions = this.languageService.getExtensions(languageId);
		if (extensions.includes(untitledExtension)) {
			return untitledName; // preserve extension if it is compatible with the mode
		}

		const primaryExtension = extensions.at(0);
		if (primaryExtension) {
			if (untitledExtension) {
				return `${untitledName.substring(0, untitledName.indexOf(untitledExtension))}${primaryExtension}`;
			}

			return `${untitledName}${primaryExtension}`;
		}

		const filenames = this.languageService.getFilenames(languageId);
		if (filenames.includes(untitledName)) {
			return untitledName; // preserve name if it is compatible with the mode
		}

		return filenames.at(0) ?? untitledName;
	}

	//#endregion

	//#region revert

	async revert(resource: URI, options?: IRevertOptions): Promise<void> {

		// Untitled
		if (resource.scheme === Schemas.untitled) {
			const model = this.untitled.get(resource);
			if (model) {
				return model.revert(options);
			}
		}

		// File
		else {
			const model = this.files.get(resource);
			if (model && (model.isDirty() || options?.force)) {
				return model.revert(options);
			}
		}
	}

	//#endregion

	//#region dirty

	isDirty(resource: URI): boolean {
		const model = resource.scheme === Schemas.untitled ? this.untitled.get(resource) : this.files.get(resource);
		if (model) {
			return model.isDirty();
		}

		return false;
	}

	//#endregion
}

export interface IEncodingOverride {
	parent?: URI;
	extension?: string;
	encoding: string;
}

export class EncodingOracle extends Disposable implements IResourceEncodings {

	private _encodingOverrides: IEncodingOverride[];
	protected get encodingOverrides(): IEncodingOverride[] { return this._encodingOverrides; }
	protected set encodingOverrides(value: IEncodingOverride[]) { this._encodingOverrides = value; }

	constructor(
		@ITextResourceConfigurationService private textResourceConfigurationService: ITextResourceConfigurationService,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private contextService: IWorkspaceContextService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this._encodingOverrides = this.getDefaultEncodingOverrides();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Workspace Folder Change
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.encodingOverrides = this.getDefaultEncodingOverrides()));
	}

	private getDefaultEncodingOverrides(): IEncodingOverride[] {
		const defaultEncodingOverrides: IEncodingOverride[] = [];

		// Global settings
		defaultEncodingOverrides.push({ parent: this.environmentService.userRoamingDataHome, encoding: UTF8 });

		// Workspace files (via extension and via untitled workspaces location)
		defaultEncodingOverrides.push({ extension: WORKSPACE_EXTENSION, encoding: UTF8 });
		defaultEncodingOverrides.push({ parent: this.environmentService.untitledWorkspacesHome, encoding: UTF8 });

		// Folder Settings
		this.contextService.getWorkspace().folders.forEach(folder => {
			defaultEncodingOverrides.push({ parent: joinPath(folder.uri, '.vscode'), encoding: UTF8 });
		});

		return defaultEncodingOverrides;
	}

	async getWriteEncoding(resource: URI | undefined, options?: IWriteTextFileOptions): Promise<{ encoding: string; addBOM: boolean }> {
		const { encoding, hasBOM } = await this.getPreferredWriteEncoding(resource, options ? options.encoding : undefined);

		return { encoding, addBOM: hasBOM };
	}

	async getPreferredWriteEncoding(resource: URI | undefined, preferredEncoding?: string): Promise<IResourceEncoding> {
		const resourceEncoding = await this.getValidatedEncodingForResource(resource, preferredEncoding);

		return {
			encoding: resourceEncoding,
			hasBOM: resourceEncoding === UTF16be || resourceEncoding === UTF16le || resourceEncoding === UTF8_with_bom // enforce BOM for certain encodings
		};
	}

	async getPreferredReadEncoding(resource: URI | undefined, options?: IReadTextFileEncodingOptions, detectedEncoding?: string): Promise<IResourceEncoding> {
		let preferredEncoding: string | undefined;

		// Encoding passed in as option
		if (options?.encoding) {
			if (detectedEncoding === UTF8_with_bom && options.encoding === UTF8) {
				preferredEncoding = UTF8_with_bom; // indicate the file has BOM if we are to resolve with UTF 8
			} else {
				preferredEncoding = options.encoding; // give passed in encoding highest priority
			}
		}

		// Encoding detected
		else if (typeof detectedEncoding === 'string') {
			preferredEncoding = detectedEncoding;
		}

		// Encoding configured
		else if (this.textResourceConfigurationService.getValue(resource, 'files.encoding') === UTF8_with_bom) {
			preferredEncoding = UTF8; // if we did not detect UTF 8 BOM before, this can only be UTF 8 then
		}

		const encoding = await this.getValidatedEncodingForResource(resource, preferredEncoding);

		return {
			encoding,
			hasBOM: encoding === UTF16be || encoding === UTF16le || encoding === UTF8_with_bom // enforce BOM for certain encodings
		};
	}

	getUnvalidatedEncodingForResource(resource: URI | undefined, preferredEncoding?: string): string {
		let fileEncoding: string;

		const override = this.getEncodingOverride(resource);
		if (override) {
			fileEncoding = override; // encoding override always wins
		} else if (preferredEncoding) {
			fileEncoding = preferredEncoding; // preferred encoding comes second
		} else {
			fileEncoding = this.textResourceConfigurationService.getValue(resource, 'files.encoding'); // and last we check for settings
		}

		return fileEncoding || UTF8;
	}

	private async getValidatedEncodingForResource(resource: URI | undefined, preferredEncoding?: string): Promise<string> {
		let fileEncoding = this.getUnvalidatedEncodingForResource(resource, preferredEncoding);
		if (fileEncoding !== UTF8 && !(await encodingExists(fileEncoding))) {
			fileEncoding = UTF8;
		}

		return fileEncoding;
	}

	private getEncodingOverride(resource: URI | undefined): string | undefined {
		if (resource && this.encodingOverrides?.length) {
			for (const override of this.encodingOverrides) {

				// check if the resource is child of encoding override path
				if (override.parent && this.uriIdentityService.extUri.isEqualOrParent(resource, override.parent)) {
					return override.encoding;
				}

				// check if the resource extension is equal to encoding override
				if (override.extension && extname(resource) === `.${override.extension}`) {
					return override.encoding;
				}
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/encoding.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/encoding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Readable, ReadableStream, newWriteableStream, listenStream } from '../../../../base/common/stream.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { importAMDNodeModule } from '../../../../amdX.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { coalesce } from '../../../../base/common/arrays.js';

export const UTF8 = 'utf8';
export const UTF8_with_bom = 'utf8bom';
export const UTF16be = 'utf16be';
export const UTF16le = 'utf16le';

export type UTF_ENCODING = typeof UTF8 | typeof UTF8_with_bom | typeof UTF16be | typeof UTF16le;

export function isUTFEncoding(encoding: string): encoding is UTF_ENCODING {
	return [UTF8, UTF8_with_bom, UTF16be, UTF16le].some(utfEncoding => utfEncoding === encoding);
}

export const UTF16be_BOM = [0xFE, 0xFF];
export const UTF16le_BOM = [0xFF, 0xFE];
export const UTF8_BOM = [0xEF, 0xBB, 0xBF];

const ZERO_BYTE_DETECTION_BUFFER_MAX_LEN = 512; 	// number of bytes to look at to decide about a file being binary or not
const NO_ENCODING_GUESS_MIN_BYTES = 512; 			// when not auto guessing the encoding, small number of bytes are enough
const AUTO_ENCODING_GUESS_MIN_BYTES = 512 * 8; 		// with auto guessing we want a lot more content to be read for guessing
const AUTO_ENCODING_GUESS_MAX_BYTES = 512 * 128; 	// set an upper limit for the number of bytes we pass on to jschardet

export interface IDecodeStreamOptions {
	acceptTextOnly: boolean;
	guessEncoding: boolean;
	candidateGuessEncodings: string[];
	minBytesRequiredForDetection?: number;

	overwriteEncoding(detectedEncoding: string | null): Promise<string>;
}

export interface IDecodeStreamResult {
	stream: ReadableStream<string>;
	detected: IDetectedEncodingResult;
}

export const enum DecodeStreamErrorKind {

	/**
	 * Error indicating that the stream is binary even
	 * though `acceptTextOnly` was specified.
	 */
	STREAM_IS_BINARY = 1
}

export class DecodeStreamError extends Error {

	constructor(
		message: string,
		readonly decodeStreamErrorKind: DecodeStreamErrorKind
	) {
		super(message);
	}
}

export interface IDecoderStream {
	write(buffer: Uint8Array): string;
	end(): string | undefined;
}

class DecoderStream implements IDecoderStream {

	/**
	 * This stream will only load iconv-lite lazily if the encoding
	 * is not UTF-8. This ensures that for most common cases we do
	 * not pay the price of loading the module from disk.
	 *
	 * We still need to be careful when converting UTF-8 to a string
	 * though because we read the file in chunks of Buffer and thus
	 * need to decode it via TextDecoder helper that is available
	 * in browser and node.js environments.
	 */
	static async create(encoding: string): Promise<DecoderStream> {
		let decoder: IDecoderStream | undefined = undefined;
		if (encoding !== UTF8) {
			const iconv = await importAMDNodeModule<typeof import('@vscode/iconv-lite-umd')>('@vscode/iconv-lite-umd', 'lib/iconv-lite-umd.js');
			decoder = iconv.getDecoder(toNodeEncoding(encoding));
		} else {
			const utf8TextDecoder = new TextDecoder();
			decoder = {
				write(buffer: Uint8Array): string {
					return utf8TextDecoder.decode(buffer, {
						// Signal to TextDecoder that potentially more data is coming
						// and that we are calling `decode` in the end to consume any
						// remainders
						stream: true
					});
				},

				end(): string | undefined {
					return utf8TextDecoder.decode();
				}
			};
		}

		return new DecoderStream(decoder);
	}

	private constructor(private iconvLiteDecoder: IDecoderStream) { }

	write(buffer: Uint8Array): string {
		return this.iconvLiteDecoder.write(buffer);
	}

	end(): string | undefined {
		return this.iconvLiteDecoder.end();
	}
}

export function toDecodeStream(source: VSBufferReadableStream, options: IDecodeStreamOptions): Promise<IDecodeStreamResult> {
	const minBytesRequiredForDetection = options.minBytesRequiredForDetection ?? (options.guessEncoding ? AUTO_ENCODING_GUESS_MIN_BYTES : NO_ENCODING_GUESS_MIN_BYTES);

	return new Promise<IDecodeStreamResult>((resolve, reject) => {
		const target = newWriteableStream<string>(strings => strings.join(''));

		const bufferedChunks: VSBuffer[] = [];
		let bytesBuffered = 0;

		let decoder: IDecoderStream | undefined = undefined;

		const cts = new CancellationTokenSource();

		const createDecoder = async () => {
			try {

				// detect encoding from buffer
				const detected = await detectEncodingFromBuffer({
					buffer: VSBuffer.concat(bufferedChunks),
					bytesRead: bytesBuffered
				}, options.guessEncoding, options.candidateGuessEncodings);

				// throw early if the source seems binary and
				// we are instructed to only accept text
				if (detected.seemsBinary && options.acceptTextOnly) {
					throw new DecodeStreamError('Stream is binary but only text is accepted for decoding', DecodeStreamErrorKind.STREAM_IS_BINARY);
				}

				// ensure to respect overwrite of encoding
				detected.encoding = await options.overwriteEncoding(detected.encoding);

				// decode and write buffered content
				decoder = await DecoderStream.create(detected.encoding);
				const decoded = decoder.write(VSBuffer.concat(bufferedChunks).buffer);
				target.write(decoded);

				bufferedChunks.length = 0;
				bytesBuffered = 0;

				// signal to the outside our detected encoding and final decoder stream
				resolve({
					stream: target,
					detected
				});
			} catch (error) {

				// Stop handling anything from the source and target
				cts.cancel();
				target.destroy();

				reject(error);
			}
		};

		listenStream(source, {
			onData: async chunk => {

				// if the decoder is ready, we just write directly
				if (decoder) {
					target.write(decoder.write(chunk.buffer));
				}

				// otherwise we need to buffer the data until the stream is ready
				else {
					bufferedChunks.push(chunk);
					bytesBuffered += chunk.byteLength;

					// buffered enough data for encoding detection, create stream
					if (bytesBuffered >= minBytesRequiredForDetection) {

						// pause stream here until the decoder is ready
						source.pause();

						await createDecoder();

						// resume stream now that decoder is ready but
						// outside of this stack to reduce recursion
						setTimeout(() => source.resume());
					}
				}
			},
			onError: error => target.error(error), // simply forward to target
			onEnd: async () => {

				// we were still waiting for data to do the encoding
				// detection. thus, wrap up starting the stream even
				// without all the data to get things going
				if (!decoder) {
					await createDecoder();
				}

				// end the target with the remainders of the decoder
				target.end(decoder?.end());
			}
		}, cts.token);
	});
}

export async function toEncodeReadable(readable: Readable<string>, encoding: string, options?: { addBOM?: boolean }): Promise<VSBufferReadable> {
	const iconv = await importAMDNodeModule<typeof import('@vscode/iconv-lite-umd')>('@vscode/iconv-lite-umd', 'lib/iconv-lite-umd.js');
	const encoder = iconv.getEncoder(toNodeEncoding(encoding), options);

	let bytesWritten = false;
	let done = false;

	return {
		read() {
			if (done) {
				return null;
			}

			const chunk = readable.read();
			if (typeof chunk !== 'string') {
				done = true;

				// If we are instructed to add a BOM but we detect that no
				// bytes have been written, we must ensure to return the BOM
				// ourselves so that we comply with the contract.
				if (!bytesWritten && options?.addBOM) {
					switch (encoding) {
						case UTF8:
						case UTF8_with_bom:
							return VSBuffer.wrap(Uint8Array.from(UTF8_BOM));
						case UTF16be:
							return VSBuffer.wrap(Uint8Array.from(UTF16be_BOM));
						case UTF16le:
							return VSBuffer.wrap(Uint8Array.from(UTF16le_BOM));
					}
				}

				const leftovers = encoder.end();
				if (leftovers && leftovers.length > 0) {
					bytesWritten = true;

					return VSBuffer.wrap(leftovers);
				}

				return null;
			}

			bytesWritten = true;

			return VSBuffer.wrap(encoder.write(chunk));
		}
	};
}

export async function encodingExists(encoding: string): Promise<boolean> {
	const iconv = await importAMDNodeModule<typeof import('@vscode/iconv-lite-umd')>('@vscode/iconv-lite-umd', 'lib/iconv-lite-umd.js');

	return iconv.encodingExists(toNodeEncoding(encoding));
}

export function toNodeEncoding(enc: string | null): string {
	if (enc === UTF8_with_bom || enc === null) {
		return UTF8; // iconv does not distinguish UTF 8 with or without BOM, so we need to help it
	}

	return enc;
}

export function detectEncodingByBOMFromBuffer(buffer: VSBuffer | null, bytesRead: number): typeof UTF8_with_bom | typeof UTF16le | typeof UTF16be | null {
	if (!buffer || bytesRead < UTF16be_BOM.length) {
		return null;
	}

	const b0 = buffer.readUInt8(0);
	const b1 = buffer.readUInt8(1);

	// UTF-16 BE
	if (b0 === UTF16be_BOM[0] && b1 === UTF16be_BOM[1]) {
		return UTF16be;
	}

	// UTF-16 LE
	if (b0 === UTF16le_BOM[0] && b1 === UTF16le_BOM[1]) {
		return UTF16le;
	}

	if (bytesRead < UTF8_BOM.length) {
		return null;
	}

	const b2 = buffer.readUInt8(2);

	// UTF-8
	if (b0 === UTF8_BOM[0] && b1 === UTF8_BOM[1] && b2 === UTF8_BOM[2]) {
		return UTF8_with_bom;
	}

	return null;
}

// we explicitly ignore a specific set of encodings from auto guessing
// - ASCII: we never want this encoding (most UTF-8 files would happily detect as
//          ASCII files and then you could not type non-ASCII characters anymore)
// - UTF-16: we have our own detection logic for UTF-16
// - UTF-32: we do not support this encoding in VSCode
const IGNORE_ENCODINGS = ['ascii', 'utf-16', 'utf-32'];

/**
 * Guesses the encoding from buffer.
 */
async function guessEncodingByBuffer(buffer: VSBuffer, candidateGuessEncodings?: string[]): Promise<string | null> {
	const jschardet = await importAMDNodeModule<typeof import('jschardet')>('jschardet', 'dist/jschardet.min.js');

	// ensure to limit buffer for guessing due to https://github.com/aadsm/jschardet/issues/53
	const limitedBuffer = buffer.slice(0, AUTO_ENCODING_GUESS_MAX_BYTES);

	// before guessing jschardet calls toString('binary') on input if it is a Buffer,
	// since we are using it inside browser environment as well we do conversion ourselves
	// https://github.com/aadsm/jschardet/blob/v2.1.1/src/index.js#L36-L40
	const binaryString = encodeLatin1(limitedBuffer.buffer);

	// ensure to convert candidate encodings to jschardet encoding names if provided
	if (candidateGuessEncodings) {
		candidateGuessEncodings = coalesce(candidateGuessEncodings.map(e => toJschardetEncoding(e)));
		if (candidateGuessEncodings.length === 0) {
			candidateGuessEncodings = undefined;
		}
	}

	let guessed: { encoding: string | undefined } | undefined;
	try {
		guessed = jschardet.detect(binaryString, candidateGuessEncodings ? { detectEncodings: candidateGuessEncodings } : undefined);
	} catch (error) {
		return null; // jschardet throws for unknown encodings (https://github.com/microsoft/vscode/issues/239928)
	}

	if (!guessed?.encoding) {
		return null;
	}

	const enc = guessed.encoding.toLowerCase();
	if (0 <= IGNORE_ENCODINGS.indexOf(enc)) {
		return null; // see comment above why we ignore some encodings
	}

	return toIconvLiteEncoding(guessed.encoding);
}

const JSCHARDET_TO_ICONV_ENCODINGS: { [name: string]: string } = {
	'ibm866': 'cp866',
	'big5': 'cp950'
};

function normalizeEncoding(encodingName: string): string {
	return encodingName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function toIconvLiteEncoding(encodingName: string): string {
	const normalizedEncodingName = normalizeEncoding(encodingName);
	const mapped = JSCHARDET_TO_ICONV_ENCODINGS[normalizedEncodingName];

	return mapped || normalizedEncodingName;
}

function toJschardetEncoding(encodingName: string): string | undefined {
	const normalizedEncodingName = normalizeEncoding(encodingName);
	const mapped = GUESSABLE_ENCODINGS[normalizedEncodingName];

	return mapped ? mapped.guessableName : undefined;
}

function encodeLatin1(buffer: Uint8Array): string {
	let result = '';
	for (let i = 0; i < buffer.length; i++) {
		result += String.fromCharCode(buffer[i]);
	}

	return result;
}

/**
 * The encodings that are allowed in a settings file don't match the canonical encoding labels specified by WHATWG.
 * See https://encoding.spec.whatwg.org/#names-and-labels
 * Iconv-lite strips all non-alphanumeric characters, but ripgrep doesn't. For backcompat, allow these labels.
 */
export function toCanonicalName(enc: string): string {
	switch (enc) {
		case 'shiftjis':
			return 'shift-jis';
		case 'utf16le':
			return 'utf-16le';
		case 'utf16be':
			return 'utf-16be';
		case 'big5hkscs':
			return 'big5-hkscs';
		case 'eucjp':
			return 'euc-jp';
		case 'euckr':
			return 'euc-kr';
		case 'koi8r':
			return 'koi8-r';
		case 'koi8u':
			return 'koi8-u';
		case 'macroman':
			return 'x-mac-roman';
		case 'utf8bom':
			return 'utf8';
		default: {
			const m = enc.match(/windows(\d+)/);
			if (m) {
				return 'windows-' + m[1];
			}

			return enc;
		}
	}
}

export interface IDetectedEncodingResult {
	encoding: string | null;
	seemsBinary: boolean;
}

export interface IReadResult {
	buffer: VSBuffer | null;
	bytesRead: number;
}

export function detectEncodingFromBuffer(readResult: IReadResult, autoGuessEncoding?: false, candidateGuessEncodings?: string[]): IDetectedEncodingResult;
export function detectEncodingFromBuffer(readResult: IReadResult, autoGuessEncoding?: boolean, candidateGuessEncodings?: string[]): Promise<IDetectedEncodingResult>;
export function detectEncodingFromBuffer({ buffer, bytesRead }: IReadResult, autoGuessEncoding?: boolean, candidateGuessEncodings?: string[]): Promise<IDetectedEncodingResult> | IDetectedEncodingResult {

	// Always first check for BOM to find out about encoding
	let encoding = detectEncodingByBOMFromBuffer(buffer, bytesRead);

	// Detect 0 bytes to see if file is binary or UTF-16 LE/BE
	// unless we already know that this file has a UTF-16 encoding
	let seemsBinary = false;
	if (encoding !== UTF16be && encoding !== UTF16le && buffer) {
		let couldBeUTF16LE = true; // e.g. 0xAA 0x00
		let couldBeUTF16BE = true; // e.g. 0x00 0xAA
		let containsZeroByte = false;

		// This is a simplified guess to detect UTF-16 BE or LE by just checking if
		// the first 512 bytes have the 0-byte at a specific location. For UTF-16 LE
		// this would be the odd byte index and for UTF-16 BE the even one.
		// Note: this can produce false positives (a binary file that uses a 2-byte
		// encoding of the same format as UTF-16) and false negatives (a UTF-16 file
		// that is using 4 bytes to encode a character).
		for (let i = 0; i < bytesRead && i < ZERO_BYTE_DETECTION_BUFFER_MAX_LEN; i++) {
			const isEndian = (i % 2 === 1); // assume 2-byte sequences typical for UTF-16
			const isZeroByte = (buffer.readUInt8(i) === 0);

			if (isZeroByte) {
				containsZeroByte = true;
			}

			// UTF-16 LE: expect e.g. 0xAA 0x00
			if (couldBeUTF16LE && (isEndian && !isZeroByte || !isEndian && isZeroByte)) {
				couldBeUTF16LE = false;
			}

			// UTF-16 BE: expect e.g. 0x00 0xAA
			if (couldBeUTF16BE && (isEndian && isZeroByte || !isEndian && !isZeroByte)) {
				couldBeUTF16BE = false;
			}

			// Return if this is neither UTF16-LE nor UTF16-BE and thus treat as binary
			if (isZeroByte && !couldBeUTF16LE && !couldBeUTF16BE) {
				break;
			}
		}

		// Handle case of 0-byte included
		if (containsZeroByte) {
			if (couldBeUTF16LE) {
				encoding = UTF16le;
			} else if (couldBeUTF16BE) {
				encoding = UTF16be;
			} else {
				seemsBinary = true;
			}
		}
	}

	// Auto guess encoding if configured
	if (autoGuessEncoding && !seemsBinary && !encoding && buffer) {
		return guessEncodingByBuffer(buffer.slice(0, bytesRead), candidateGuessEncodings).then(guessedEncoding => {
			return {
				seemsBinary: false,
				encoding: guessedEncoding
			};
		});
	}

	return { seemsBinary, encoding };
}

type EncodingsMap = { [encoding: string]: { labelLong: string; labelShort: string; order: number; encodeOnly?: boolean; alias?: string; guessableName?: string } };

export const SUPPORTED_ENCODINGS: EncodingsMap = {
	utf8: {
		labelLong: 'UTF-8',
		labelShort: 'UTF-8',
		order: 1,
		alias: 'utf8bom',
		guessableName: 'UTF-8'
	},
	utf8bom: {
		labelLong: 'UTF-8 with BOM',
		labelShort: 'UTF-8 with BOM',
		encodeOnly: true,
		order: 2,
		alias: 'utf8'
	},
	utf16le: {
		labelLong: 'UTF-16 LE',
		labelShort: 'UTF-16 LE',
		order: 3,
		guessableName: 'UTF-16LE'
	},
	utf16be: {
		labelLong: 'UTF-16 BE',
		labelShort: 'UTF-16 BE',
		order: 4,
		guessableName: 'UTF-16BE'
	},
	windows1252: {
		labelLong: 'Western (Windows 1252)',
		labelShort: 'Windows 1252',
		order: 5,
		guessableName: 'windows-1252'
	},
	iso88591: {
		labelLong: 'Western (ISO 8859-1)',
		labelShort: 'ISO 8859-1',
		order: 6
	},
	iso88593: {
		labelLong: 'Western (ISO 8859-3)',
		labelShort: 'ISO 8859-3',
		order: 7
	},
	iso885915: {
		labelLong: 'Western (ISO 8859-15)',
		labelShort: 'ISO 8859-15',
		order: 8
	},
	macroman: {
		labelLong: 'Western (Mac Roman)',
		labelShort: 'Mac Roman',
		order: 9
	},
	cp437: {
		labelLong: 'DOS (CP 437)',
		labelShort: 'CP437',
		order: 10
	},
	windows1256: {
		labelLong: 'Arabic (Windows 1256)',
		labelShort: 'Windows 1256',
		order: 11
	},
	iso88596: {
		labelLong: 'Arabic (ISO 8859-6)',
		labelShort: 'ISO 8859-6',
		order: 12
	},
	windows1257: {
		labelLong: 'Baltic (Windows 1257)',
		labelShort: 'Windows 1257',
		order: 13
	},
	iso88594: {
		labelLong: 'Baltic (ISO 8859-4)',
		labelShort: 'ISO 8859-4',
		order: 14
	},
	iso885914: {
		labelLong: 'Celtic (ISO 8859-14)',
		labelShort: 'ISO 8859-14',
		order: 15
	},
	windows1250: {
		labelLong: 'Central European (Windows 1250)',
		labelShort: 'Windows 1250',
		order: 16,
		guessableName: 'windows-1250'
	},
	iso88592: {
		labelLong: 'Central European (ISO 8859-2)',
		labelShort: 'ISO 8859-2',
		order: 17,
		guessableName: 'ISO-8859-2'
	},
	cp852: {
		labelLong: 'Central European (CP 852)',
		labelShort: 'CP 852',
		order: 18
	},
	windows1251: {
		labelLong: 'Cyrillic (Windows 1251)',
		labelShort: 'Windows 1251',
		order: 19,
		guessableName: 'windows-1251'
	},
	cp866: {
		labelLong: 'Cyrillic (CP 866)',
		labelShort: 'CP 866',
		order: 20,
		guessableName: 'IBM866'
	},
	cp1125: {
		labelLong: 'Cyrillic (CP 1125)',
		labelShort: 'CP 1125',
		order: 21,
		guessableName: 'IBM1125'
	},
	iso88595: {
		labelLong: 'Cyrillic (ISO 8859-5)',
		labelShort: 'ISO 8859-5',
		order: 22,
		guessableName: 'ISO-8859-5'
	},
	koi8r: {
		labelLong: 'Cyrillic (KOI8-R)',
		labelShort: 'KOI8-R',
		order: 23,
		guessableName: 'KOI8-R'
	},
	koi8u: {
		labelLong: 'Cyrillic (KOI8-U)',
		labelShort: 'KOI8-U',
		order: 24
	},
	iso885913: {
		labelLong: 'Estonian (ISO 8859-13)',
		labelShort: 'ISO 8859-13',
		order: 25
	},
	windows1253: {
		labelLong: 'Greek (Windows 1253)',
		labelShort: 'Windows 1253',
		order: 26,
		guessableName: 'windows-1253'
	},
	iso88597: {
		labelLong: 'Greek (ISO 8859-7)',
		labelShort: 'ISO 8859-7',
		order: 27,
		guessableName: 'ISO-8859-7'
	},
	windows1255: {
		labelLong: 'Hebrew (Windows 1255)',
		labelShort: 'Windows 1255',
		order: 28,
		guessableName: 'windows-1255'
	},
	iso88598: {
		labelLong: 'Hebrew (ISO 8859-8)',
		labelShort: 'ISO 8859-8',
		order: 29,
		guessableName: 'ISO-8859-8'
	},
	iso885910: {
		labelLong: 'Nordic (ISO 8859-10)',
		labelShort: 'ISO 8859-10',
		order: 30
	},
	iso885916: {
		labelLong: 'Romanian (ISO 8859-16)',
		labelShort: 'ISO 8859-16',
		order: 31
	},
	windows1254: {
		labelLong: 'Turkish (Windows 1254)',
		labelShort: 'Windows 1254',
		order: 32
	},
	iso88599: {
		labelLong: 'Turkish (ISO 8859-9)',
		labelShort: 'ISO 8859-9',
		order: 33
	},
	windows1258: {
		labelLong: 'Vietnamese (Windows 1258)',
		labelShort: 'Windows 1258',
		order: 34
	},
	gbk: {
		labelLong: 'Simplified Chinese (GBK)',
		labelShort: 'GBK',
		order: 35
	},
	gb18030: {
		labelLong: 'Simplified Chinese (GB18030)',
		labelShort: 'GB18030',
		order: 36
	},
	cp950: {
		labelLong: 'Traditional Chinese (Big5)',
		labelShort: 'Big5',
		order: 37,
		guessableName: 'Big5'
	},
	big5hkscs: {
		labelLong: 'Traditional Chinese (Big5-HKSCS)',
		labelShort: 'Big5-HKSCS',
		order: 38
	},
	shiftjis: {
		labelLong: 'Japanese (Shift JIS)',
		labelShort: 'Shift JIS',
		order: 39,
		guessableName: 'SHIFT_JIS'
	},
	eucjp: {
		labelLong: 'Japanese (EUC-JP)',
		labelShort: 'EUC-JP',
		order: 40,
		guessableName: 'EUC-JP'
	},
	euckr: {
		labelLong: 'Korean (EUC-KR)',
		labelShort: 'EUC-KR',
		order: 41,
		guessableName: 'EUC-KR'
	},
	windows874: {
		labelLong: 'Thai (Windows 874)',
		labelShort: 'Windows 874',
		order: 42
	},
	iso885911: {
		labelLong: 'Latin/Thai (ISO 8859-11)',
		labelShort: 'ISO 8859-11',
		order: 43
	},
	koi8ru: {
		labelLong: 'Cyrillic (KOI8-RU)',
		labelShort: 'KOI8-RU',
		order: 44
	},
	koi8t: {
		labelLong: 'Tajik (KOI8-T)',
		labelShort: 'KOI8-T',
		order: 45
	},
	gb2312: {
		labelLong: 'Simplified Chinese (GB 2312)',
		labelShort: 'GB 2312',
		order: 46,
		guessableName: 'GB2312'
	},
	cp865: {
		labelLong: 'Nordic DOS (CP 865)',
		labelShort: 'CP 865',
		order: 47
	},
	cp850: {
		labelLong: 'Western European DOS (CP 850)',
		labelShort: 'CP 850',
		order: 48
	}
};

export const GUESSABLE_ENCODINGS: EncodingsMap = (() => {
	const guessableEncodings: EncodingsMap = {};
	for (const encoding in SUPPORTED_ENCODINGS) {
		if (SUPPORTED_ENCODINGS[encoding].guessableName) {
			guessableEncodings[encoding] = SUPPORTED_ENCODINGS[encoding];
		}
	}

	return guessableEncodings;
})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/textEditorService.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/textEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorFactoryRegistry, IFileEditorInput, IUntypedEditorInput, IUntypedFileEditorInput, EditorExtensions, isResourceDiffEditorInput, isResourceSideBySideEditorInput, IUntitledTextResourceEditorInput, DEFAULT_EDITOR_ASSOCIATION, isResourceMergeEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { INewUntitledTextEditorOptions, IUntitledTextEditorService } from '../../untitled/common/untitledTextEditorService.js';
import { Schemas } from '../../../../base/common/network.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { TextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { UntitledTextEditorInput } from '../../untitled/common/untitledTextEditorInput.js';
import { IUntitledTextEditorModel } from '../../untitled/common/untitledTextEditorModel.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../editor/common/editorResolverService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';

export const ITextEditorService = createDecorator<ITextEditorService>('textEditorService');

export interface ITextEditorService {

	readonly _serviceBrand: undefined;

	/**
	 * @deprecated this method should not be used, rather consider using
	 * `IEditorResolverService` instead with `DEFAULT_EDITOR_ASSOCIATION.id`.
	 */
	createTextEditor(input: IUntypedEditorInput): EditorInput;

	/**
	 * @deprecated this method should not be used, rather consider using
	 * `IEditorResolverService` instead with `DEFAULT_EDITOR_ASSOCIATION.id`.
	 */
	createTextEditor(input: IUntypedFileEditorInput): IFileEditorInput;

	/**
	 * A way to create text editor inputs from an untyped editor input. Depending
	 * on the passed in input this will be:
	 * - a `IFileEditorInput` for file resources
	 * - a `UntitledEditorInput` for untitled resources
	 * - a `TextResourceEditorInput` for virtual resources
	 *
	 * @param input the untyped editor input to create a typed input from
	 */
	resolveTextEditor(input: IUntypedEditorInput): Promise<EditorInput>;
	resolveTextEditor(input: IUntypedFileEditorInput): Promise<IFileEditorInput>;
}

class FileEditorInputLeakError extends Error {

	constructor(message: string, stack: string) {
		super(message);

		this.name = 'FileEditorInputLeakError';
		this.stack = stack;
	}
}

export class TextEditorService extends Disposable implements ITextEditorService {

	declare readonly _serviceBrand: undefined;

	private readonly editorInputCache = new ResourceMap<TextResourceEditorInput | IFileEditorInput | UntitledTextEditorInput>();

	private readonly fileEditorFactory = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).getFileEditorFactory();

	constructor(
		@IUntitledTextEditorService private readonly untitledTextEditorService: IUntitledTextEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileService private readonly fileService: IFileService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService
	) {
		super();

		// Register the default editor to the editor resolver
		// service so that it shows up in the editors picker
		this.registerDefaultEditor();
	}

	private registerDefaultEditor(): void {
		this._register(this.editorResolverService.registerEditor(
			'*',
			{
				id: DEFAULT_EDITOR_ASSOCIATION.id,
				label: DEFAULT_EDITOR_ASSOCIATION.displayName,
				detail: DEFAULT_EDITOR_ASSOCIATION.providerDisplayName,
				priority: RegisteredEditorPriority.builtin
			},
			{},
			{
				createEditorInput: editor => ({ editor: this.createTextEditor(editor) }),
				createUntitledEditorInput: untitledEditor => ({ editor: this.createTextEditor(untitledEditor) }),
				createDiffEditorInput: diffEditor => ({ editor: this.createTextEditor(diffEditor) })
			}
		));
	}

	resolveTextEditor(input: IUntypedEditorInput): Promise<EditorInput>;
	resolveTextEditor(input: IUntypedFileEditorInput): Promise<IFileEditorInput>;
	async resolveTextEditor(input: IUntypedEditorInput | IUntypedFileEditorInput): Promise<EditorInput | IFileEditorInput> {
		return this.createTextEditor(input);
	}

	createTextEditor(input: IUntypedEditorInput): EditorInput;
	createTextEditor(input: IUntypedFileEditorInput): IFileEditorInput;
	createTextEditor(input: IUntypedEditorInput | IUntypedFileEditorInput): EditorInput | IFileEditorInput {

		// Merge Editor Not Supported (we fallback to showing the result only)
		if (isResourceMergeEditorInput(input)) {
			return this.createTextEditor(input.result);
		}

		// Diff Editor Support
		if (isResourceDiffEditorInput(input)) {
			const original = this.createTextEditor(input.original);
			const modified = this.createTextEditor(input.modified);

			return this.instantiationService.createInstance(DiffEditorInput, input.label, input.description, original, modified, undefined);
		}

		// Side by Side Editor Support
		if (isResourceSideBySideEditorInput(input)) {
			const primary = this.createTextEditor(input.primary);
			const secondary = this.createTextEditor(input.secondary);

			return this.instantiationService.createInstance(SideBySideEditorInput, input.label, input.description, secondary, primary);
		}

		// Untitled text file support
		const untitledInput = input as IUntitledTextResourceEditorInput;
		if (untitledInput.forceUntitled || !untitledInput.resource || (untitledInput.resource.scheme === Schemas.untitled)) {
			const untitledOptions: Partial<INewUntitledTextEditorOptions> = {
				languageId: untitledInput.languageId,
				initialValue: untitledInput.contents,
				encoding: untitledInput.encoding
			};

			// Untitled resource: use as hint for an existing untitled editor
			let untitledModel: IUntitledTextEditorModel;
			if (untitledInput.resource?.scheme === Schemas.untitled) {
				untitledModel = this.untitledTextEditorService.create({ untitledResource: untitledInput.resource, ...untitledOptions });
			}

			// Other resource: use as hint for associated filepath
			else {
				untitledModel = this.untitledTextEditorService.create({ associatedResource: untitledInput.resource, ...untitledOptions });
			}

			return this.createOrGetCached(untitledModel.resource, () => this.instantiationService.createInstance(UntitledTextEditorInput, untitledModel));
		}

		// Text File/Resource Editor Support
		const textResourceEditorInput = input as IUntypedFileEditorInput;
		if (textResourceEditorInput.resource instanceof URI) {

			// Derive the label from the path if not provided explicitly
			const label = textResourceEditorInput.label || basename(textResourceEditorInput.resource);

			// We keep track of the preferred resource this input is to be created
			// with but it may be different from the canonical resource (see below)
			const preferredResource = textResourceEditorInput.resource;

			// From this moment on, only operate on the canonical resource
			// to ensure we reduce the chance of opening the same resource
			// with different resource forms (e.g. path casing on Windows)
			const canonicalResource = this.uriIdentityService.asCanonicalUri(preferredResource);

			return this.createOrGetCached(canonicalResource, () => {

				// File
				if (textResourceEditorInput.forceFile || this.fileService.hasProvider(canonicalResource)) {
					return this.fileEditorFactory.createFileEditor(canonicalResource, preferredResource, textResourceEditorInput.label, textResourceEditorInput.description, textResourceEditorInput.encoding, textResourceEditorInput.languageId, textResourceEditorInput.contents, this.instantiationService);
				}

				// Resource
				return this.instantiationService.createInstance(TextResourceEditorInput, canonicalResource, textResourceEditorInput.label, textResourceEditorInput.description, textResourceEditorInput.languageId, textResourceEditorInput.contents);
			}, cachedInput => {

				// Untitled
				if (cachedInput instanceof UntitledTextEditorInput) {
					return;
				}

				// Files
				else if (!(cachedInput instanceof TextResourceEditorInput)) {
					cachedInput.setPreferredResource(preferredResource);

					if (textResourceEditorInput.label) {
						cachedInput.setPreferredName(textResourceEditorInput.label);
					}

					if (textResourceEditorInput.description) {
						cachedInput.setPreferredDescription(textResourceEditorInput.description);
					}

					if (textResourceEditorInput.encoding) {
						cachedInput.setPreferredEncoding(textResourceEditorInput.encoding);
					}

					if (textResourceEditorInput.languageId) {
						cachedInput.setPreferredLanguageId(textResourceEditorInput.languageId);
					}

					if (typeof textResourceEditorInput.contents === 'string') {
						cachedInput.setPreferredContents(textResourceEditorInput.contents);
					}
				}

				// Resources
				else {
					if (label) {
						cachedInput.setName(label);
					}

					if (textResourceEditorInput.description) {
						cachedInput.setDescription(textResourceEditorInput.description);
					}

					if (textResourceEditorInput.languageId) {
						cachedInput.setPreferredLanguageId(textResourceEditorInput.languageId);
					}

					if (typeof textResourceEditorInput.contents === 'string') {
						cachedInput.setPreferredContents(textResourceEditorInput.contents);
					}
				}
			});
		}

		throw new Error(`ITextEditorService: Unable to create texteditor from ${JSON.stringify(input)}`);
	}

	private createOrGetCached(
		resource: URI,
		factoryFn: () => TextResourceEditorInput | IFileEditorInput | UntitledTextEditorInput,
		cachedFn?: (input: TextResourceEditorInput | IFileEditorInput | UntitledTextEditorInput) => void
	): TextResourceEditorInput | IFileEditorInput | UntitledTextEditorInput {

		// Return early if already cached
		let input = this.editorInputCache.get(resource);
		if (input) {
			cachedFn?.(input);

			return input;
		}

		// Otherwise create and add to cache
		input = factoryFn();
		this.editorInputCache.set(resource, input);

		// Track Leaks
		const leakId = this.trackLeaks(input);

		Event.once(input.onWillDispose)(() => {

			// Remove from cache
			this.editorInputCache.delete(resource);

			// Untrack Leaks
			if (leakId) {
				this.untrackLeaks(leakId);
			}
		});

		return input;
	}

	//#region Leak Monitoring

	private static readonly LEAK_TRACKING_THRESHOLD = 256;
	private static readonly LEAK_REPORTING_THRESHOLD = 2 * this.LEAK_TRACKING_THRESHOLD;
	private static LEAK_REPORTED = false;

	private readonly mapLeakToCounter = new Map<string, number>();

	private trackLeaks(input: TextResourceEditorInput | IFileEditorInput | UntitledTextEditorInput): string | undefined {
		if (TextEditorService.LEAK_REPORTED || this.editorInputCache.size < TextEditorService.LEAK_TRACKING_THRESHOLD) {
			return undefined;
		}

		const leakId = `${input.resource.scheme}#${input.typeId || '<no typeId>'}#${input.editorId || '<no editorId>'}\n${new Error().stack?.split('\n').slice(2).join('\n') ?? ''}`;
		const leakCounter = (this.mapLeakToCounter.get(leakId) ?? 0) + 1;
		this.mapLeakToCounter.set(leakId, leakCounter);

		if (this.editorInputCache.size > TextEditorService.LEAK_REPORTING_THRESHOLD) {
			TextEditorService.LEAK_REPORTED = true;

			const [topLeak, topCount] = Array.from(this.mapLeakToCounter.entries()).reduce(
				([topLeak, topCount], [key, val]) => val > topCount ? [key, val] : [topLeak, topCount]
			);

			const message = `Potential text editor input LEAK detected, having ${this.editorInputCache.size} text editor inputs already. Most frequent owner (${topCount})`;
			onUnexpectedError(new FileEditorInputLeakError(message, topLeak));
		}

		return leakId;
	}

	private untrackLeaks(leakId: string): void {
		const stackCounter = (this.mapLeakToCounter.get(leakId) ?? 1) - 1;
		this.mapLeakToCounter.set(leakId, stackCounter);

		if (stackCounter === 0) {
			this.mapLeakToCounter.delete(leakId);
		}
	}

	//#endregion
}

registerSingleton(ITextEditorService, TextEditorService, InstantiationType.Eager /* do not change: https://github.com/microsoft/vscode/issues/137675 */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/textFileEditorModel.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/textFileEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { mark } from '../../../../base/common/performance.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { EncodingMode, ITextFileService, TextFileEditorModelState, ITextFileEditorModel, ITextFileStreamContent, ITextFileResolveOptions, IResolvedTextFileEditorModel, TextFileResolveReason, ITextFileEditorModelSaveEvent, ITextFileSaveAsOptions } from './textfiles.js';
import { IRevertOptions, SaveReason, SaveSourceRegistry } from '../../../common/editor.js';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel.js';
import { IWorkingCopyBackupService, IResolvedWorkingCopyBackup } from '../../workingCopy/common/workingCopyBackup.js';
import { IFileService, FileOperationError, FileOperationResult, FileChangesEvent, FileChangeType, IFileStatWithMetadata, ETAG_DISABLED, NotModifiedSinceFileOperationError } from '../../../../platform/files/common/files.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { timeout, TaskSequentializer } from '../../../../base/common/async.js';
import { ITextBufferFactory, ITextModel } from '../../../../editor/common/model.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { basename } from '../../../../base/common/path.js';
import { IWorkingCopyService } from '../../workingCopy/common/workingCopyService.js';
import { IWorkingCopyBackup, WorkingCopyCapabilities, NO_TYPE_ID, IWorkingCopyBackupMeta } from '../../workingCopy/common/workingCopy.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { UTF16be, UTF16le, UTF8, UTF8_with_bom } from './encoding.js';
import { createTextBufferFactoryFromStream } from '../../../../editor/common/model/textModel.js';
import { ILanguageDetectionService } from '../../languageDetection/common/languageDetectionWorkerService.js';
import { IPathService } from '../../path/common/pathService.js';
import { extUri } from '../../../../base/common/resources.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { TextModelEditSource, EditSources } from '../../../../editor/common/textModelEditSource.js';

interface IBackupMetaData extends IWorkingCopyBackupMeta {
	mtime: number;
	ctime: number;
	size: number;
	etag: string;
	orphaned: boolean;
}

/**
 * The text file editor model listens to changes to its underlying code editor model and saves these changes through the file service back to the disk.
 */
export class TextFileEditorModel extends BaseTextEditorModel implements ITextFileEditorModel {

	private static readonly TEXTFILE_SAVE_ENCODING_SOURCE = SaveSourceRegistry.registerSource('textFileEncoding.source', localize('textFileCreate.source', "File Encoding Changed"));

	//#region Events

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidResolve = this._register(new Emitter<TextFileResolveReason>());
	readonly onDidResolve = this._onDidResolve.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidSaveError = this._register(new Emitter<void>());
	readonly onDidSaveError = this._onDidSaveError.event;

	private readonly _onDidSave = this._register(new Emitter<ITextFileEditorModelSaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<void>());
	readonly onDidRevert = this._onDidRevert.event;

	private readonly _onDidChangeEncoding = this._register(new Emitter<void>());
	readonly onDidChangeEncoding = this._onDidChangeEncoding.event;

	private readonly _onDidChangeOrphaned = this._register(new Emitter<void>());
	readonly onDidChangeOrphaned = this._onDidChangeOrphaned.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<void>());
	readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	//#endregion

	readonly typeId = NO_TYPE_ID; // IMPORTANT: never change this to not break existing assumptions (e.g. backups)

	readonly capabilities = WorkingCopyCapabilities.None;

	readonly name: string;
	private resourceHasExtension: boolean;

	private contentEncoding: string | undefined; // encoding as reported from disk

	private versionId = 0;
	private bufferSavedVersionId: number | undefined;

	private ignoreDirtyOnModelContentChange = false;
	private ignoreSaveFromSaveParticipants = false;

	private static readonly UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD = 500;
	private lastModelContentChangeFromUndoRedo: number | undefined = undefined;

	lastResolvedFileStat: IFileStatWithMetadata | undefined; // !!! DO NOT MARK PRIVATE! USED IN TESTS !!!

	private readonly saveSequentializer = new TaskSequentializer();

	private dirty = false;
	private inConflictMode = false;
	private inOrphanMode = false;
	private inErrorMode = false;

	constructor(
		readonly resource: URI,
		private preferredEncoding: string | undefined,		// encoding as chosen by the user
		private preferredLanguageId: string | undefined,	// language id as chosen by the user
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@IFileService private readonly fileService: IFileService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IWorkingCopyBackupService private readonly workingCopyBackupService: IWorkingCopyBackupService,
		@ILogService private readonly logService: ILogService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@ILabelService private readonly labelService: ILabelService,
		@ILanguageDetectionService languageDetectionService: ILanguageDetectionService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@IPathService private readonly pathService: IPathService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProgressService private readonly progressService: IProgressService
	) {
		super(modelService, languageService, languageDetectionService, accessibilityService);

		this.name = basename(this.labelService.getUriLabel(this.resource));
		this.resourceHasExtension = !!extUri.extname(this.resource);

		// Make known to working copy service
		this._register(this.workingCopyService.registerWorkingCopy(this));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));
		this._register(this.filesConfigurationService.onDidChangeFilesAssociation(() => this.onDidChangeFilesAssociation()));
		this._register(this.filesConfigurationService.onDidChangeReadonly(() => this._onDidChangeReadonly.fire()));
	}

	private async onDidFilesChange(e: FileChangesEvent): Promise<void> {
		let fileEventImpactsModel = false;
		let newInOrphanModeGuess: boolean | undefined;

		// If we are currently orphaned, we check if the model file was added back
		if (this.inOrphanMode) {
			const modelFileAdded = e.contains(this.resource, FileChangeType.ADDED);
			if (modelFileAdded) {
				newInOrphanModeGuess = false;
				fileEventImpactsModel = true;
			}
		}

		// Otherwise we check if the model file was deleted
		else {
			const modelFileDeleted = e.contains(this.resource, FileChangeType.DELETED);
			if (modelFileDeleted) {
				newInOrphanModeGuess = true;
				fileEventImpactsModel = true;
			}
		}

		if (fileEventImpactsModel && this.inOrphanMode !== newInOrphanModeGuess) {
			let newInOrphanModeValidated = false;
			if (newInOrphanModeGuess) {
				// We have received reports of users seeing delete events even though the file still
				// exists (network shares issue: https://github.com/microsoft/vscode/issues/13665).
				// Since we do not want to mark the model as orphaned, we have to check if the
				// file is really gone and not just a faulty file event.
				await timeout(100, CancellationToken.None);

				if (this.isDisposed()) {
					newInOrphanModeValidated = true;
				} else {
					const exists = await this.fileService.exists(this.resource);
					newInOrphanModeValidated = !exists;
				}
			}

			if (this.inOrphanMode !== newInOrphanModeValidated && !this.isDisposed()) {
				this.setOrphaned(newInOrphanModeValidated);
			}
		}
	}

	private setOrphaned(orphaned: boolean): void {
		if (this.inOrphanMode !== orphaned) {
			this.inOrphanMode = orphaned;
			this._onDidChangeOrphaned.fire();
		}
	}

	private onDidChangeFilesAssociation(): void {
		if (!this.isResolved()) {
			return;
		}

		const firstLineText = this.getFirstLineText(this.textEditorModel);
		const languageSelection = this.getOrCreateLanguage(this.resource, this.languageService, this.preferredLanguageId, firstLineText);

		this.textEditorModel.setLanguage(languageSelection);
	}

	override setLanguageId(languageId: string, source?: string): void {
		super.setLanguageId(languageId, source);

		this.preferredLanguageId = languageId;
	}

	//#region Backup

	async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {

		// Fill in metadata if we are resolved
		let meta: IBackupMetaData | undefined = undefined;
		if (this.lastResolvedFileStat) {
			meta = {
				mtime: this.lastResolvedFileStat.mtime,
				ctime: this.lastResolvedFileStat.ctime,
				size: this.lastResolvedFileStat.size,
				etag: this.lastResolvedFileStat.etag,
				orphaned: this.inOrphanMode
			};
		}

		// Fill in content the same way we would do when
		// saving the file via the text file service
		// encoding support (hardcode UTF-8)
		const content = await this.textFileService.getEncodedReadable(this.resource, this.createSnapshot() ?? undefined, { encoding: UTF8 });

		return { meta, content };
	}

	//#endregion

	//#region Revert

	async revert(options?: IRevertOptions): Promise<void> {
		if (!this.isResolved()) {
			return;
		}

		// Unset flags
		const wasDirty = this.dirty;
		const undo = this.doSetDirty(false);

		// Force read from disk unless reverting soft
		const softUndo = options?.soft;
		if (!softUndo) {
			try {
				await this.forceResolveFromFile();
			} catch (error) {

				// FileNotFound means the file got deleted meanwhile, so ignore it
				if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {

					// Set flags back to previous values, we are still dirty if revert failed
					undo();

					throw error;
				}
			}
		}

		// Emit file change event
		this._onDidRevert.fire();

		// Emit dirty change event
		if (wasDirty) {
			this._onDidChangeDirty.fire();
		}
	}

	//#endregion

	//#region Resolve

	override async resolve(options?: ITextFileResolveOptions): Promise<void> {
		this.trace('resolve() - enter');
		mark('code/willResolveTextFileEditorModel');

		// Return early if we are disposed
		if (this.isDisposed()) {
			this.trace('resolve() - exit - without resolving because model is disposed');

			return;
		}

		// Unless there are explicit contents provided, it is important that we do not
		// resolve a model that is dirty or is in the process of saving to prevent data
		// loss.
		if (!options?.contents && (this.dirty || this.saveSequentializer.isRunning())) {
			this.trace('resolve() - exit - without resolving because model is dirty or being saved');

			return;
		}

		// Resolve either from backup or from file
		await this.doResolve(options);

		mark('code/didResolveTextFileEditorModel');
	}

	private async doResolve(options?: ITextFileResolveOptions): Promise<void> {

		// First check if we have contents to use for the model
		if (options?.contents) {
			return this.resolveFromBuffer(options.contents, options);
		}

		// Second, check if we have a backup to resolve from (only for new models)
		const isNewModel = !this.isResolved();
		if (isNewModel) {
			const resolvedFromBackup = await this.resolveFromBackup(options);
			if (resolvedFromBackup) {
				return;
			}
		}

		// Finally, resolve from file resource
		return this.resolveFromFile(options);
	}

	private async resolveFromBuffer(buffer: ITextBufferFactory, options?: ITextFileResolveOptions): Promise<void> {
		this.trace('resolveFromBuffer()');

		// Try to resolve metdata from disk
		let mtime: number;
		let ctime: number;
		let size: number;
		let etag: string;
		try {
			const metadata = await this.fileService.stat(this.resource);
			mtime = metadata.mtime;
			ctime = metadata.ctime;
			size = metadata.size;
			etag = metadata.etag;

			// Clear orphaned state when resolving was successful
			this.setOrphaned(false);
		} catch (error) {

			// Put some fallback values in error case
			mtime = Date.now();
			ctime = Date.now();
			size = 0;
			etag = ETAG_DISABLED;

			// Apply orphaned state based on error code
			this.setOrphaned(error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND);
		}

		const preferredEncoding = await this.textFileService.encoding.getPreferredWriteEncoding(this.resource, this.preferredEncoding);

		// Resolve with buffer
		this.resolveFromContent({
			resource: this.resource,
			name: this.name,
			mtime,
			ctime,
			size,
			etag,
			value: buffer,
			encoding: preferredEncoding.encoding,
			readonly: false,
			locked: false
		}, true /* dirty (resolved from buffer) */, options);
	}

	private async resolveFromBackup(options?: ITextFileResolveOptions): Promise<boolean> {

		// Resolve backup if any
		const backup = await this.workingCopyBackupService.resolve<IBackupMetaData>(this);

		// Resolve preferred encoding if we need it
		let encoding = UTF8;
		if (backup) {
			encoding = (await this.textFileService.encoding.getPreferredWriteEncoding(this.resource, this.preferredEncoding)).encoding;
		}

		// Abort if someone else managed to resolve the model by now
		const isNewModel = !this.isResolved();
		if (!isNewModel) {
			this.trace('resolveFromBackup() - exit - without resolving because previously new model got created meanwhile');

			return true; // imply that resolving has happened in another operation
		}

		// Try to resolve from backup if we have any
		if (backup) {
			await this.doResolveFromBackup(backup, encoding, options);

			return true;
		}

		// Otherwise signal back that resolving did not happen
		return false;
	}

	private async doResolveFromBackup(backup: IResolvedWorkingCopyBackup<IBackupMetaData>, encoding: string, options?: ITextFileResolveOptions): Promise<void> {
		this.trace('doResolveFromBackup()');

		// Resolve with backup
		this.resolveFromContent({
			resource: this.resource,
			name: this.name,
			mtime: backup.meta ? backup.meta.mtime : Date.now(),
			ctime: backup.meta ? backup.meta.ctime : Date.now(),
			size: backup.meta ? backup.meta.size : 0,
			etag: backup.meta ? backup.meta.etag : ETAG_DISABLED, // etag disabled if unknown!
			value: await createTextBufferFactoryFromStream(await this.textFileService.getDecodedStream(this.resource, backup.value, { encoding: UTF8 })),
			encoding,
			readonly: false,
			locked: false
		}, true /* dirty (resolved from backup) */, options);

		// Restore orphaned flag based on state
		if (backup.meta?.orphaned) {
			this.setOrphaned(true);
		}
	}

	private async resolveFromFile(options?: ITextFileResolveOptions): Promise<void> {
		this.trace('resolveFromFile()');

		const forceReadFromFile = options?.forceReadFromFile;
		const allowBinary = this.isResolved() /* always allow if we resolved previously */ || options?.allowBinary;

		// Decide on etag
		let etag: string | undefined;
		if (forceReadFromFile) {
			etag = ETAG_DISABLED; // disable ETag if we enforce to read from disk
		} else if (this.lastResolvedFileStat) {
			etag = this.lastResolvedFileStat.etag; // otherwise respect etag to support caching
		}

		// Remember current version before doing any long running operation
		// to ensure we are not changing a model that was changed meanwhile
		const currentVersionId = this.versionId;

		// Resolve Content
		try {
			const content = await this.textFileService.readStream(this.resource, {
				acceptTextOnly: !allowBinary,
				etag,
				encoding: this.preferredEncoding,
				limits: options?.limits
			});

			// Clear orphaned state when resolving was successful
			this.setOrphaned(false);

			// Return early if the model content has changed
			// meanwhile to prevent loosing any changes
			if (currentVersionId !== this.versionId) {
				this.trace('resolveFromFile() - exit - without resolving because model content changed');

				return;
			}

			return this.resolveFromContent(content, false /* not dirty (resolved from file) */, options);
		} catch (error) {
			const result = error.fileOperationResult;

			// Apply orphaned state based on error code
			this.setOrphaned(result === FileOperationResult.FILE_NOT_FOUND);

			// NotModified status is expected and can be handled gracefully
			// if we are resolved. We still want to update our last resolved
			// stat to e.g. detect changes to the file's readonly state
			if (this.isResolved() && result === FileOperationResult.FILE_NOT_MODIFIED_SINCE) {
				if (error instanceof NotModifiedSinceFileOperationError) {
					this.updateLastResolvedFileStat(error.stat);
				}

				return;
			}

			// Unless we are forced to read from the file, Ignore when a model has been resolved once
			// and the file was deleted meanwhile. Since we already have the model resolved, we can return
			// to this state and update the orphaned flag to indicate that this model has no version on
			// disk anymore.
			if (this.isResolved() && result === FileOperationResult.FILE_NOT_FOUND && !forceReadFromFile) {
				return;
			}

			// Otherwise bubble up the error
			throw error;
		}
	}

	private resolveFromContent(content: ITextFileStreamContent, dirty: boolean, options?: ITextFileResolveOptions): void {
		this.trace('resolveFromContent() - enter');

		// Return early if we are disposed
		if (this.isDisposed()) {
			this.trace('resolveFromContent() - exit - because model is disposed');

			return;
		}

		// Update our resolved disk stat model
		this.updateLastResolvedFileStat({
			resource: this.resource,
			name: content.name,
			mtime: content.mtime,
			ctime: content.ctime,
			size: content.size,
			etag: content.etag,
			readonly: content.readonly,
			locked: content.locked,
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			children: undefined
		});

		// Keep the original encoding to not loose it when saving
		const oldEncoding = this.contentEncoding;
		this.contentEncoding = content.encoding;

		// Handle events if encoding changed
		if (this.preferredEncoding) {
			this.updatePreferredEncoding(this.contentEncoding); // make sure to reflect the real encoding of the file (never out of sync)
		} else if (oldEncoding !== this.contentEncoding) {
			this._onDidChangeEncoding.fire();
		}

		// Update Existing Model
		if (this.textEditorModel) {
			this.doUpdateTextModel(content.value, EditSources.reloadFromDisk());
		}

		// Create New Model
		else {
			this.doCreateTextModel(content.resource, content.value);
		}

		// Update model dirty flag. This is very important to call
		// in both cases of dirty or not because it conditionally
		// updates the `bufferSavedVersionId` to determine the
		// version when to consider the model as saved again (e.g.
		// when undoing back to the saved state)
		this.setDirty(!!dirty);

		// Emit as event
		this._onDidResolve.fire(options?.reason ?? TextFileResolveReason.OTHER);
	}

	private doCreateTextModel(resource: URI, value: ITextBufferFactory): void {
		this.trace('doCreateTextModel()');

		// Create model
		const textModel = this.createTextEditorModel(value, resource, this.preferredLanguageId);

		// Model Listeners
		this.installModelListeners(textModel);

		// Detect language from content
		this.autoDetectLanguage();
	}

	private doUpdateTextModel(value: ITextBufferFactory, reason: TextModelEditSource): void {
		this.trace('doUpdateTextModel()');

		// Update model value in a block that ignores content change events for dirty tracking
		this.ignoreDirtyOnModelContentChange = true;
		try {
			this.updateTextEditorModel(value, this.preferredLanguageId, reason);
		} finally {
			this.ignoreDirtyOnModelContentChange = false;
		}
	}

	protected override installModelListeners(model: ITextModel): void {

		// See https://github.com/microsoft/vscode/issues/30189
		// This code has been extracted to a different method because it caused a memory leak
		// where `value` was captured in the content change listener closure scope.

		this._register(model.onDidChangeContent(e => this.onModelContentChanged(model, e.isUndoing || e.isRedoing)));
		this._register(model.onDidChangeLanguage(() => this.onMaybeShouldChangeEncoding())); // detect possible encoding change via language specific settings

		super.installModelListeners(model);
	}

	private onModelContentChanged(model: ITextModel, isUndoingOrRedoing: boolean): void {
		this.trace(`onModelContentChanged() - enter`);

		// In any case increment the version id because it tracks the textual content state of the model at all times
		this.versionId++;
		this.trace(`onModelContentChanged() - new versionId ${this.versionId}`);

		// Remember when the user changed the model through a undo/redo operation.
		// We need this information to throttle save participants to fix
		// https://github.com/microsoft/vscode/issues/102542
		if (isUndoingOrRedoing) {
			this.lastModelContentChangeFromUndoRedo = Date.now();
		}

		// We mark check for a dirty-state change upon model content change, unless:
		// - explicitly instructed to ignore it (e.g. from model.resolve())
		// - the model is readonly (in that case we never assume the change was done by the user)
		if (!this.ignoreDirtyOnModelContentChange && !this.isReadonly()) {

			// The contents changed as a matter of Undo and the version reached matches the saved one
			// In this case we clear the dirty flag and emit a SAVED event to indicate this state.
			if (model.getAlternativeVersionId() === this.bufferSavedVersionId) {
				this.trace('onModelContentChanged() - model content changed back to last saved version');

				// Clear flags
				const wasDirty = this.dirty;
				this.setDirty(false);

				// Emit revert event if we were dirty
				if (wasDirty) {
					this._onDidRevert.fire();
				}
			}

			// Otherwise the content has changed and we signal this as becoming dirty
			else {
				this.trace('onModelContentChanged() - model content changed and marked as dirty');

				// Mark as dirty
				this.setDirty(true);
			}
		}

		// Emit as event
		this._onDidChangeContent.fire();

		// Detect language from content
		this.autoDetectLanguage();
	}

	protected override async autoDetectLanguage(): Promise<void> {

		// Wait to be ready to detect language
		await this.extensionService?.whenInstalledExtensionsRegistered();

		// Only perform language detection conditionally
		const languageId = this.getLanguageId();
		if (
			this.resource.scheme === this.pathService.defaultUriScheme &&	// make sure to not detect language for non-user visible documents
			(!languageId || languageId === PLAINTEXT_LANGUAGE_ID) &&		// only run on files with plaintext language set or no language set at all
			!this.resourceHasExtension										// only run if this particular file doesn't have an extension
		) {
			return super.autoDetectLanguage();
		}
	}

	private async forceResolveFromFile(): Promise<void> {
		if (this.isDisposed()) {
			return; // return early when the model is invalid
		}

		// We go through the text file service to make
		// sure this kind of `resolve` is properly
		// running in sequence with any other running
		// `resolve` if any, including subsequent runs
		// that are triggered right after.

		await this.textFileService.files.resolve(this.resource, {
			reload: { async: false },
			forceReadFromFile: true
		});
	}

	//#endregion

	//#region Dirty

	isDirty(): this is IResolvedTextFileEditorModel {
		return this.dirty;
	}

	isModified(): boolean {
		return this.isDirty();
	}

	setDirty(dirty: boolean): void {
		if (!this.isResolved()) {
			return; // only resolved models can be marked dirty
		}

		// Track dirty state and version id
		const wasDirty = this.dirty;
		this.doSetDirty(dirty);

		// Emit as Event if dirty changed
		if (dirty !== wasDirty) {
			this._onDidChangeDirty.fire();
		}
	}

	private doSetDirty(dirty: boolean): () => void {
		const wasDirty = this.dirty;
		const wasInConflictMode = this.inConflictMode;
		const wasInErrorMode = this.inErrorMode;
		const oldBufferSavedVersionId = this.bufferSavedVersionId;

		if (!dirty) {
			this.dirty = false;
			this.inConflictMode = false;
			this.inErrorMode = false;
			this.updateSavedVersionId();
		} else {
			this.dirty = true;
		}

		// Return function to revert this call
		return () => {
			this.dirty = wasDirty;
			this.inConflictMode = wasInConflictMode;
			this.inErrorMode = wasInErrorMode;
			this.bufferSavedVersionId = oldBufferSavedVersionId;
		};
	}

	//#endregion

	//#region Save

	async save(options: ITextFileSaveAsOptions = Object.create(null)): Promise<boolean> {
		if (!this.isResolved()) {
			return false;
		}

		if (this.isReadonly()) {
			this.trace('save() - ignoring request for readonly resource');

			return false; // if model is readonly we do not attempt to save at all
		}

		if (
			(this.hasState(TextFileEditorModelState.CONFLICT) || this.hasState(TextFileEditorModelState.ERROR)) &&
			(options.reason === SaveReason.AUTO || options.reason === SaveReason.FOCUS_CHANGE || options.reason === SaveReason.WINDOW_CHANGE)
		) {
			this.trace('save() - ignoring auto save request for model that is in conflict or error');

			return false; // if model is in save conflict or error, do not save unless save reason is explicit
		}

		// Actually do save and log
		this.trace('save() - enter');
		await this.doSave(options);
		this.trace('save() - exit');

		return this.hasState(TextFileEditorModelState.SAVED);
	}

	private async doSave(options: ITextFileSaveAsOptions): Promise<void> {
		if (typeof options.reason !== 'number') {
			options.reason = SaveReason.EXPLICIT;
		}

		const versionId = this.versionId;
		this.trace(`doSave(${versionId}) - enter with versionId ${versionId}`);

		// Return early if saved from within save participant to break recursion
		//
		// Scenario: a save participant triggers a save() on the model
		if (this.ignoreSaveFromSaveParticipants) {
			this.trace(`doSave(${versionId}) - exit - refusing to save() recursively from save participant`);

			return;
		}

		// Lookup any running save for this versionId and return it if found
		//
		// Scenario: user invoked the save action multiple times quickly for the same contents
		//           while the save was not yet finished to disk
		//
		if (this.saveSequentializer.isRunning(versionId)) {
			this.trace(`doSave(${versionId}) - exit - found a running save for versionId ${versionId}`);

			return this.saveSequentializer.running;
		}

		// Return early if not dirty (unless forced)
		//
		// Scenario: user invoked save action even though the model is not dirty
		if (!options.force && !this.dirty) {
			this.trace(`doSave(${versionId}) - exit - because not dirty and/or versionId is different (this.isDirty: ${this.dirty}, this.versionId: ${this.versionId})`);

			return;
		}

		// Return if currently saving by storing this save request as the next save that should happen.
		// Never ever must 2 saves execute at the same time because this can lead to dirty writes and race conditions.
		//
		// Scenario A: auto save was triggered and is currently busy saving to disk. this takes long enough that another auto save
		//             kicks in.
		// Scenario B: save is very slow (e.g. network share) and the user manages to change the buffer and trigger another save
		//             while the first save has not returned yet.
		//
		if (this.saveSequentializer.isRunning()) {
			this.trace(`doSave(${versionId}) - exit - because busy saving`);

			// Indicate to the save sequentializer that we want to
			// cancel the running operation so that ours can run
			// before the running one finishes.
			// Currently this will try to cancel running save
			// participants but never a running save.
			this.saveSequentializer.cancelRunning();

			// Queue this as the upcoming save and return
			return this.saveSequentializer.queue(() => this.doSave(options));
		}

		// Push all edit operations to the undo stack so that the user has a chance to
		// Ctrl+Z back to the saved version.
		if (this.isResolved()) {
			this.textEditorModel.pushStackElement();
		}

		const saveCancellation = new CancellationTokenSource();

		return this.progressService.withProgress({
			title: localize('saveParticipants', "Saving '{0}'", this.name),
			location: ProgressLocation.Window,
			cancellable: true,
			delay: this.isDirty() ? 3000 : 5000
		}, progress => {
			return this.doSaveSequential(versionId, options, progress, saveCancellation);
		}, () => {
			saveCancellation.cancel();
		}).finally(() => {
			saveCancellation.dispose();
		});
	}

	private doSaveSequential(versionId: number, options: ITextFileSaveAsOptions, progress: IProgress<IProgressStep>, saveCancellation: CancellationTokenSource): Promise<void> {
		return this.saveSequentializer.run(versionId, (async () => {

			// A save participant can still change the model now and since we are so close to saving
			// we do not want to trigger another auto save or similar, so we block this
			// In addition we update our version right after in case it changed because of a model change
			//
			// Save participants can also be skipped through API.
			if (this.isResolved() && !options.skipSaveParticipants) {
				try {

					// Measure the time it took from the last undo/redo operation to this save. If this
					// time is below `UNDO_REDO_SAVE_PARTICIPANTS_THROTTLE_THRESHOLD`, we make sure to
					// delay the save participant for the remaining time if the reason is auto save.
					//
					// This fixes the following issue:
					// - the user has configured auto save with delay of 100ms or shorter
					// - the user has a save participant enabled that modifies the file on each save
					// - the user types into the file and the file gets saved
					// - the user triggers undo operation
					// - this will undo the save participant change but trigger the save participant right after
					// - the user has no chance to undo over the save participant
					//
					// Reported as: https://github.com/microsoft/vscode/issues/102542
					if (options.reason === SaveReason.AUTO && typeof this.lastModelContentChangeFromUndoRedo === 'number') {
						const timeFromUndoRedoToSave = Date.now() - this.lastModelContentChangeFromUndoRedo;
						if (timeFromUndoRedoToSave < TextFileEditorModel.UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD) {
							await timeout(TextFileEditorModel.UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD - timeFromUndoRedoToSave);
						}
					}

					// Run save participants unless save was cancelled meanwhile
					if (!saveCancellation.token.isCancellationRequested) {
						this.ignoreSaveFromSaveParticipants = true;
						try {
							await this.textFileService.files.runSaveParticipants(this, { reason: options.reason ?? SaveReason.EXPLICIT, savedFrom: options.from }, progress, saveCancellation.token);
						} catch (err) {
							if (isCancellationError(err) && !saveCancellation.token.isCancellationRequested) {
								// participant wants to cancel this operation
								saveCancellation.cancel();
							}
						} finally {
							this.ignoreSaveFromSaveParticipants = false;
						}
					}
				} catch (error) {
					this.logService.error(`[text file model] runSaveParticipants(${versionId}) - resulted in an error: ${error.toString()}`, this.resource.toString());
				}
			}

			// It is possible that a subsequent save is cancelling this
			// running save. As such we return early when we detect that
			// However, we do not pass the token into the file service
			// because that is an atomic operation currently without
			// cancellation support, so we dispose the cancellation if
			// it was not cancelled yet.
			if (saveCancellation.token.isCancellationRequested) {
				return;
			} else {
				saveCancellation.dispose();
			}

			// We have to protect against being disposed at this point. It could be that the save() operation
			// was triggerd followed by a dispose() operation right after without waiting. Typically we cannot
			// be disposed if we are dirty, but if we are not dirty, save() and dispose() can still be triggered
			// one after the other without waiting for the save() to complete. If we are disposed(), we risk
			// saving contents to disk that are stale (see https://github.com/microsoft/vscode/issues/50942).
			// To fix this issue, we will not store the contents to disk when we got disposed.
			if (this.isDisposed()) {
				return;
			}

			// We require a resolved model from this point on, since we are about to write data to disk.
			if (!this.isResolved()) {
				return;
			}

			// update versionId with its new value (if pre-save changes happened)
			versionId = this.versionId;

			// Clear error flag since we are trying to save again
			this.inErrorMode = false;

			// Save to Disk. We mark the save operation as currently running with
			// the latest versionId because it might have changed from a save
			// participant triggering
			progress.report({ message: localize('saveTextFile', "Writing into file...") });
			this.trace(`doSave(${versionId}) - before write()`);
			const lastResolvedFileStat = assertReturnsDefined(this.lastResolvedFileStat);
			const resolvedTextFileEditorModel = this;
			return this.saveSequentializer.run(versionId, (async () => {
				try {
					const stat = await this.textFileService.write(lastResolvedFileStat.resource, resolvedTextFileEditorModel.createSnapshot(), {
						mtime: lastResolvedFileStat.mtime,
						encoding: this.getEncoding(),
						etag: (options.ignoreModifiedSince || !this.filesConfigurationService.preventSaveConflicts(lastResolvedFileStat.resource, resolvedTextFileEditorModel.getLanguageId())) ? ETAG_DISABLED : lastResolvedFileStat.etag,
						unlock: options.writeUnlock,
						writeElevated: options.writeElevated
					});

					this.handleSaveSuccess(stat, versionId, options);
				} catch (error) {
					this.handleSaveError(error, versionId, options);
				}
			})());
		})(), () => saveCancellation.cancel());
	}

	private handleSaveSuccess(stat: IFileStatWithMetadata, versionId: number, options: ITextFileSaveAsOptions): void {

		// Updated resolved stat with updated stat
		this.updateLastResolvedFileStat(stat);

		// Update dirty state unless model has changed meanwhile
		if (versionId === this.versionId) {
			this.trace(`handleSaveSuccess(${versionId}) - setting dirty to false because versionId did not change`);
			this.setDirty(false);
		} else {
			this.trace(`handleSaveSuccess(${versionId}) - not setting dirty to false because versionId did change meanwhile`);
		}

		// Update orphan state given save was successful
		this.setOrphaned(false);

		// Emit Save Event
		this._onDidSave.fire({ reason: options.reason, stat, source: options.source });
	}

	private handleSaveError(error: Error, versionId: number, options: ITextFileSaveAsOptions): void {
		(options.ignoreErrorHandler ? this.logService.trace : this.logService.error).apply(this.logService, [`[text file model] handleSaveError(${versionId}) - exit - resulted in a save error: ${error.toString()}`, this.resource.toString()]);

		// Return early if the save() call was made asking to
		// handle the save error itself.
		if (options.ignoreErrorHandler) {
			throw error;
		}

		// In any case of an error, we mark the model as dirty to prevent data loss
		// It could be possible that the write corrupted the file on disk (e.g. when
		// an error happened after truncating the file) and as such we want to preserve
		// the model contents to prevent data loss.
		this.setDirty(true);

		// Flag as error state in the model
		this.inErrorMode = true;

		// Look out for a save conflict
		if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE) {
			this.inConflictMode = true;
		}

		// Show to user
		this.textFileService.files.saveErrorHandler.onSaveError(error, this, options);

		// Emit as event
		this._onDidSaveError.fire();
	}

	private updateSavedVersionId(): void {
		// we remember the models alternate version id to remember when the version
		// of the model matches with the saved version on disk. we need to keep this
		// in order to find out if the model changed back to a saved version (e.g.
		// when undoing long enough to reach to a version that is saved and then to
		// clear the dirty flag)
		if (this.isResolved()) {
			this.bufferSavedVersionId = this.textEditorModel.getAlternativeVersionId();
		}
	}

	private updateLastResolvedFileStat(newFileStat: IFileStatWithMetadata): void {
		const oldReadonly = this.isReadonly();

		// First resolve - just take
		if (!this.lastResolvedFileStat) {
			this.lastResolvedFileStat = newFileStat;
		}

		// Subsequent resolve - make sure that we only assign it if the mtime is equal or has advanced.
		// This prevents race conditions from resolving and saving. If a save comes in late after a revert
		// was called, the mtime could be out of sync.
		else if (this.lastResolvedFileStat.mtime <= newFileStat.mtime) {
			this.lastResolvedFileStat = newFileStat;
		}

		// In all other cases update only the readonly and locked flags
		else {
			this.lastResolvedFileStat = { ...this.lastResolvedFileStat, readonly: newFileStat.readonly, locked: newFileStat.locked };
		}

		// Signal that the readonly state changed
		if (this.isReadonly() !== oldReadonly) {
			this._onDidChangeReadonly.fire();
		}
	}

	//#endregion

	hasState(state: TextFileEditorModelState): boolean {
		switch (state) {
			case TextFileEditorModelState.CONFLICT:
				return this.inConflictMode;
			case TextFileEditorModelState.DIRTY:
				return this.dirty;
			case TextFileEditorModelState.ERROR:
				return this.inErrorMode;
			case TextFileEditorModelState.ORPHAN:
				return this.inOrphanMode;
			case TextFileEditorModelState.PENDING_SAVE:
				return this.saveSequentializer.isRunning();
			case TextFileEditorModelState.SAVED:
				return !this.dirty;
		}
	}

	async joinState(state: TextFileEditorModelState.PENDING_SAVE): Promise<void> {
		return this.saveSequentializer.running;
	}

	override getLanguageId(this: IResolvedTextFileEditorModel): string;
	override getLanguageId(): string | undefined;
	override getLanguageId(): string | undefined {
		if (this.textEditorModel) {
			return this.textEditorModel.getLanguageId();
		}

		return this.preferredLanguageId;
	}

	//#region Encoding

	private async onMaybeShouldChangeEncoding(): Promise<void> {

		// This is a bit of a hack but there is a narrow case where
		// per-language configured encodings are not working:
		//
		// On startup we may not yet have all languages resolved so
		// we pick a wrong encoding. We never used to re-apply the
		// encoding when the language was then resolved, because that
		// is an operation that is will have to fetch the contents
		// again from disk.
		//
		// To mitigate this issue, when we detect the model language
		// changes, we see if there is a specific encoding configured
		// for the new language and apply it, only if the model is
		// not dirty and only if the encoding was not explicitly set.
		//
		// (see https://github.com/microsoft/vscode/issues/127936)

		if (this.hasEncodingSetExplicitly) {
			this.trace('onMaybeShouldChangeEncoding() - ignoring because encoding was set explicitly');

			return; // never change the user's choice of encoding
		}

		if (this.contentEncoding === UTF8_with_bom || this.contentEncoding === UTF16be || this.contentEncoding === UTF16le) {
			this.trace('onMaybeShouldChangeEncoding() - ignoring because content encoding has a BOM');

			return; // never change an encoding that we can detect 100% via BOMs
		}

		const { encoding } = await this.textFileService.encoding.getPreferredReadEncoding(this.resource);
		if (typeof encoding !== 'string' || !this.isNewEncoding(encoding)) {
			this.trace(`onMaybeShouldChangeEncoding() - ignoring because preferred encoding ${encoding} is not new`);

			return; // return early if encoding is invalid or did not change
		}

		if (this.isDirty()) {
			this.trace('onMaybeShouldChangeEncoding() - ignoring because model is dirty');

			return; // return early to prevent accident saves in this case
		}

		this.logService.info(`Adjusting encoding based on configured language override to '${encoding}' for ${this.resource.toString(true)}.`);

		// Force resolve to pick up the new encoding
		return this.forceResolveFromFile();
	}

	private hasEncodingSetExplicitly = false;

	setEncoding(encoding: string, mode: EncodingMode): Promise<void> {

		// Remember that an explicit encoding was set
		this.hasEncodingSetExplicitly = true;

		return this.setEncodingInternal(encoding, mode);
	}

	private async setEncodingInternal(encoding: string, mode: EncodingMode): Promise<void> {

		// Encode: Save with encoding
		if (mode === EncodingMode.Encode) {
			this.updatePreferredEncoding(encoding);

			// Save
			if (!this.isDirty()) {
				this.versionId++; // needs to increment because we change the model potentially
				this.setDirty(true);
			}

			if (!this.inConflictMode) {
				await this.save({ source: TextFileEditorModel.TEXTFILE_SAVE_ENCODING_SOURCE });
			}
		}

		// Decode: Resolve with encoding
		else {
			if (!this.isNewEncoding(encoding)) {
				return; // return early if the encoding is already the same
			}

			if (this.isDirty()) {
				throw new Error('Cannot re-open a dirty text document with different encoding. Save it first.');
			}

			this.updatePreferredEncoding(encoding);

			await this.forceResolveFromFile();
		}
	}

	updatePreferredEncoding(encoding: string | undefined): void {
		if (!this.isNewEncoding(encoding)) {
			return;
		}

		this.preferredEncoding = encoding;

		// Emit
		this._onDidChangeEncoding.fire();
	}

	private isNewEncoding(encoding: string | undefined): boolean {
		if (this.preferredEncoding === encoding) {
			return false; // return early if the encoding is already the same
		}

		if (!this.preferredEncoding && this.contentEncoding === encoding) {
			return false; // also return if we don't have a preferred encoding but the content encoding is already the same
		}

		return true;
	}

	getEncoding(): string | undefined {
		return this.preferredEncoding || this.contentEncoding;
	}

	//#endregion

	private trace(msg: string): void {
		this.logService.trace(`[text file model] ${msg}`, this.resource.toString());
	}

	override isResolved(): this is IResolvedTextFileEditorModel {
		return !!this.textEditorModel;
	}

	override isReadonly(): boolean | IMarkdownString {
		return this.filesConfigurationService.isReadonly(this.resource, this.lastResolvedFileStat);
	}

	override dispose(): void {
		this.trace('dispose()');

		this.inConflictMode = false;
		this.inOrphanMode = false;
		this.inErrorMode = false;

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/textFileEditorModelManager.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/textFileEditorModelManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { TextFileEditorModel } from './textFileEditorModel.js';
import { dispose, IDisposable, Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ITextFileEditorModel, ITextFileEditorModelManager, ITextFileEditorModelResolveOrCreateOptions, ITextFileResolveEvent, ITextFileSaveEvent, ITextFileSaveParticipant } from './textfiles.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IFileService, FileChangesEvent, FileOperation, FileChangeType, IFileSystemProviderRegistrationEvent, IFileSystemProviderCapabilitiesChangeEvent } from '../../../../platform/files/common/files.js';
import { Promises, ResourceQueue } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { TextFileSaveParticipant } from './textFileSaveParticipant.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStoredFileWorkingCopySaveParticipantContext, IWorkingCopyFileService, WorkingCopyFileEvent } from '../../workingCopy/common/workingCopyFileService.js';
import { ITextSnapshot } from '../../../../editor/common/model.js';
import { extname, joinPath } from '../../../../base/common/resources.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { PLAINTEXT_EXTENSION, PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IProgress, IProgressStep } from '../../../../platform/progress/common/progress.js';

interface ITextFileEditorModelToRestore {
	readonly source: URI;
	readonly target: URI;
	readonly snapshot?: ITextSnapshot;
	readonly language?: {
		readonly id: string;
		readonly explicit: boolean;
	};
	readonly encoding?: string;
}

export class TextFileEditorModelManager extends Disposable implements ITextFileEditorModelManager {

	private readonly _onDidCreate = this._register(new Emitter<TextFileEditorModel>({ leakWarningThreshold: 500 /* increased for users with hundreds of inputs opened */ }));
	readonly onDidCreate = this._onDidCreate.event;

	private readonly _onDidResolve = this._register(new Emitter<ITextFileResolveEvent>());
	readonly onDidResolve = this._onDidResolve.event;

	private readonly _onDidRemove = this._register(new Emitter<URI>());
	readonly onDidRemove = this._onDidRemove.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	private readonly _onDidChangeOrphaned = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidChangeOrphaned = this._onDidChangeOrphaned.event;

	private readonly _onDidSaveError = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidSaveError = this._onDidSaveError.event;

	private readonly _onDidSave = this._register(new Emitter<ITextFileSaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidRevert = this._onDidRevert.event;

	private readonly _onDidChangeEncoding = this._register(new Emitter<TextFileEditorModel>());
	readonly onDidChangeEncoding = this._onDidChangeEncoding.event;

	private readonly mapResourceToModel = new ResourceMap<TextFileEditorModel>();
	private readonly mapResourceToModelListeners = new ResourceMap<IDisposable>();
	private readonly mapResourceToDisposeListener = new ResourceMap<IDisposable>();
	private readonly mapResourceToPendingModelResolvers = new ResourceMap<Promise<void>>();

	private readonly modelResolveQueue = this._register(new ResourceQueue());

	saveErrorHandler = (() => {
		const notificationService = this.notificationService;

		return {
			onSaveError(error: Error, model: ITextFileEditorModel): void {
				notificationService.error(localize({ key: 'genericSaveError', comment: ['{0} is the resource that failed to save and {1} the error message'] }, "Failed to save '{0}': {1}", model.name, toErrorMessage(error, false)));
			}
		};
	})();

	get models(): TextFileEditorModel[] {
		return [...this.mapResourceToModel.values()];
	}

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@INotificationService private readonly notificationService: INotificationService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this.saveParticipants = this._register(this.instantiationService.createInstance(TextFileSaveParticipant));

		this.registerListeners();
	}

	private registerListeners(): void {

		// Update models from file change events
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));

		// File system provider changes
		this._register(this.fileService.onDidChangeFileSystemProviderCapabilities(e => this.onDidChangeFileSystemProviderCapabilities(e)));
		this._register(this.fileService.onDidChangeFileSystemProviderRegistrations(e => this.onDidChangeFileSystemProviderRegistrations(e)));

		// Working copy operations
		this._register(this.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => this.onWillRunWorkingCopyFileOperation(e)));
		this._register(this.workingCopyFileService.onDidFailWorkingCopyFileOperation(e => this.onDidFailWorkingCopyFileOperation(e)));
		this._register(this.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => this.onDidRunWorkingCopyFileOperation(e)));
	}

	private onDidFilesChange(e: FileChangesEvent): void {
		for (const model of this.models) {
			if (model.isDirty()) {
				continue; // never reload dirty models
			}

			// Trigger a model resolve for any update or add event that impacts
			// the model. We also consider the added event because it could
			// be that a file was added and updated right after.
			if (e.contains(model.resource, FileChangeType.UPDATED, FileChangeType.ADDED)) {
				this.queueModelReload(model);
			}
		}
	}

	private onDidChangeFileSystemProviderCapabilities(e: IFileSystemProviderCapabilitiesChangeEvent): void {

		// Resolve models again for file systems that changed
		// capabilities to fetch latest metadata (e.g. readonly)
		// into all models.
		this.queueModelReloads(e.scheme);
	}

	private onDidChangeFileSystemProviderRegistrations(e: IFileSystemProviderRegistrationEvent): void {
		if (!e.added) {
			return; // only if added
		}

		// Resolve models again for file systems that registered
		// to account for capability changes: extensions may
		// unregister and register the same provider with different
		// capabilities, so we want to ensure to fetch latest
		// metadata (e.g. readonly) into all models.
		this.queueModelReloads(e.scheme);
	}

	private queueModelReloads(scheme: string): void {
		for (const model of this.models) {
			if (model.isDirty()) {
				continue; // never reload dirty models
			}

			if (scheme === model.resource.scheme) {
				this.queueModelReload(model);
			}
		}
	}

	private queueModelReload(model: TextFileEditorModel): void {

		// Resolve model to update (use a queue to prevent accumulation of resolves
		// when the resolve actually takes long. At most we only want the queue
		// to have a size of 2 (1 running resolve and 1 queued resolve).
		const queueSize = this.modelResolveQueue.queueSize(model.resource);
		if (queueSize <= 1) {
			this.modelResolveQueue.queueFor(model.resource, async () => {
				try {
					await this.reload(model);
				} catch (error) {
					onUnexpectedError(error);
				}
			});
		}
	}

	private readonly mapCorrelationIdToModelsToRestore = new Map<number, ITextFileEditorModelToRestore[]>();

	private onWillRunWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {

		// Move / Copy: remember models to restore after the operation
		if (e.operation === FileOperation.MOVE || e.operation === FileOperation.COPY) {
			const modelsToRestore: ITextFileEditorModelToRestore[] = [];

			for (const { source, target } of e.files) {
				if (source) {
					if (this.uriIdentityService.extUri.isEqual(source, target)) {
						continue; // ignore if resources are considered equal
					}

					// find all models that related to source (can be many if resource is a folder)
					const sourceModels: TextFileEditorModel[] = [];
					for (const model of this.models) {
						if (this.uriIdentityService.extUri.isEqualOrParent(model.resource, source)) {
							sourceModels.push(model);
						}
					}

					// remember each source model to resolve again after move is done
					// with optional content to restore if it was dirty
					for (const sourceModel of sourceModels) {
						const sourceModelResource = sourceModel.resource;

						// If the source is the actual model, just use target as new resource
						let targetModelResource: URI;
						if (this.uriIdentityService.extUri.isEqual(sourceModelResource, source)) {
							targetModelResource = target;
						}

						// Otherwise a parent folder of the source is being moved, so we need
						// to compute the target resource based on that
						else {
							targetModelResource = joinPath(target, sourceModelResource.path.substr(source.path.length + 1));
						}

						const languageId = sourceModel.getLanguageId();
						modelsToRestore.push({
							source: sourceModelResource,
							target: targetModelResource,
							language: languageId ? {
								id: languageId,
								explicit: sourceModel.languageChangeSource === 'user'
							} : undefined,
							encoding: sourceModel.getEncoding(),
							snapshot: sourceModel.isDirty() ? sourceModel.createSnapshot() : undefined
						});
					}
				}
			}

			this.mapCorrelationIdToModelsToRestore.set(e.correlationId, modelsToRestore);
		}
	}

	private onDidFailWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {

		// Move / Copy: restore dirty flag on models to restore that were dirty
		if ((e.operation === FileOperation.MOVE || e.operation === FileOperation.COPY)) {
			const modelsToRestore = this.mapCorrelationIdToModelsToRestore.get(e.correlationId);
			if (modelsToRestore) {
				this.mapCorrelationIdToModelsToRestore.delete(e.correlationId);

				modelsToRestore.forEach(model => {
					// snapshot presence means this model used to be dirty and so we restore that
					// flag. we do NOT have to restore the content because the model was only soft
					// reverted and did not loose its original dirty contents.
					if (model.snapshot) {
						this.get(model.source)?.setDirty(true);
					}
				});
			}
		}
	}

	private onDidRunWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {
		switch (e.operation) {

			// Create: Revert existing models
			case FileOperation.CREATE:
				e.waitUntil((async () => {
					for (const { target } of e.files) {
						const model = this.get(target);
						if (model && !model.isDisposed()) {
							await model.revert();
						}
					}
				})());
				break;

			// Move/Copy: restore models that were resolved before the operation took place
			case FileOperation.MOVE:
			case FileOperation.COPY:
				e.waitUntil((async () => {
					const modelsToRestore = this.mapCorrelationIdToModelsToRestore.get(e.correlationId);
					if (modelsToRestore) {
						this.mapCorrelationIdToModelsToRestore.delete(e.correlationId);

						await Promises.settled(modelsToRestore.map(async modelToRestore => {

							// From this moment on, only operate on the canonical resource
							// to fix a potential data loss issue:
							// https://github.com/microsoft/vscode/issues/211374
							const target = this.uriIdentityService.asCanonicalUri(modelToRestore.target);

							// restore the model at the target. if we have previous dirty content, we pass it
							// over to be used, otherwise we force a reload from disk. this is important
							// because we know the file has changed on disk after the move and the model might
							// have still existed with the previous state. this ensures that the model is not
							// tracking a stale state.
							const restoredModel = await this.resolve(target, {
								reload: { async: false }, // enforce a reload
								contents: modelToRestore.snapshot ? createTextBufferFactoryFromSnapshot(modelToRestore.snapshot) : undefined,
								encoding: modelToRestore.encoding
							});

							// restore model language only if it is specific
							if (modelToRestore.language?.id && modelToRestore.language.id !== PLAINTEXT_LANGUAGE_ID) {

								// an explicitly set language is restored via `setLanguageId`
								// to preserve it as explicitly set by the user.
								// (https://github.com/microsoft/vscode/issues/203648)
								if (modelToRestore.language.explicit) {
									restoredModel.setLanguageId(modelToRestore.language.id);
								}

								// otherwise, a model language is applied via lower level
								// APIs to not confuse it with an explicitly set language.
								// (https://github.com/microsoft/vscode/issues/125795)
								else if (restoredModel.getLanguageId() === PLAINTEXT_LANGUAGE_ID && extname(target) !== PLAINTEXT_EXTENSION) {
									restoredModel.updateTextEditorModel(undefined, modelToRestore.language.id);
								}
							}
						}));
					}
				})());
				break;
		}
	}

	get(resource: URI): TextFileEditorModel | undefined {
		return this.mapResourceToModel.get(resource);
	}

	private has(resource: URI): boolean {
		return this.mapResourceToModel.has(resource);
	}

	private async reload(model: TextFileEditorModel): Promise<void> {

		// Await a pending model resolve first before proceeding
		// to ensure that we never resolve a model more than once
		// in parallel.
		await this.joinPendingResolves(model.resource);

		if (model.isDirty() || model.isDisposed() || !this.has(model.resource)) {
			return; // the model possibly got dirty or disposed, so return early then
		}

		// Trigger reload
		await this.doResolve(model, { reload: { async: false } });
	}

	async resolve(resource: URI, options?: ITextFileEditorModelResolveOrCreateOptions): Promise<TextFileEditorModel> {

		// Await a pending model resolve first before proceeding
		// to ensure that we never resolve a model more than once
		// in parallel.
		const pendingResolve = this.joinPendingResolves(resource);
		if (pendingResolve) {
			await pendingResolve;
		}

		// Trigger resolve
		return this.doResolve(resource, options);
	}

	private async doResolve(resourceOrModel: URI | TextFileEditorModel, options?: ITextFileEditorModelResolveOrCreateOptions): Promise<TextFileEditorModel> {
		let model: TextFileEditorModel | undefined;
		let resource: URI;
		if (URI.isUri(resourceOrModel)) {
			resource = resourceOrModel;
			model = this.get(resource);
		} else {
			resource = resourceOrModel.resource;
			model = resourceOrModel;
		}

		let modelResolve: Promise<void>;
		let didCreateModel = false;

		// Model exists
		if (model) {

			// Always reload if contents are provided
			if (options?.contents) {
				modelResolve = model.resolve(options);
			}

			// Reload async or sync based on options
			else if (options?.reload) {

				// async reload: trigger a reload but return immediately
				if (options.reload.async) {
					modelResolve = Promise.resolve();
					(async () => {
						try {
							await model.resolve(options);
						} catch (error) {
							if (!model.isDisposed()) {
								onUnexpectedError(error); // only log if the model is still around
							}
						}
					})();
				}

				// sync reload: do not return until model reloaded
				else {
					modelResolve = model.resolve(options);
				}
			}

			// Do not reload
			else {
				modelResolve = Promise.resolve();
			}
		}

		// Model does not exist
		else {
			didCreateModel = true;

			const newModel = model = this.instantiationService.createInstance(TextFileEditorModel, resource, options ? options.encoding : undefined, options ? options.languageId : undefined);
			modelResolve = model.resolve(options);

			this.registerModel(newModel);
		}

		// Store pending resolves to avoid race conditions
		this.mapResourceToPendingModelResolvers.set(resource, modelResolve);

		// Make known to manager (if not already known)
		this.add(resource, model);

		// Emit some events if we created the model
		if (didCreateModel) {
			this._onDidCreate.fire(model);

			// If the model is dirty right from the beginning,
			// make sure to emit this as an event
			if (model.isDirty()) {
				this._onDidChangeDirty.fire(model);
			}
		}

		try {
			await modelResolve;
		} catch (error) {

			// Automatically dispose the model if we created it
			// because we cannot dispose a model we do not own
			// https://github.com/microsoft/vscode/issues/138850
			if (didCreateModel) {
				model.dispose();
			}

			throw error;
		} finally {

			// Remove from pending resolves
			this.mapResourceToPendingModelResolvers.delete(resource);
		}

		// Apply language if provided
		if (options?.languageId) {
			model.setLanguageId(options.languageId);
		}

		// Model can be dirty if a backup was restored, so we make sure to
		// have this event delivered if we created the model here
		if (didCreateModel && model.isDirty()) {
			this._onDidChangeDirty.fire(model);
		}

		return model;
	}

	private joinPendingResolves(resource: URI): Promise<void> | undefined {
		const pendingModelResolve = this.mapResourceToPendingModelResolvers.get(resource);
		if (!pendingModelResolve) {
			return;
		}

		return this.doJoinPendingResolves(resource);
	}

	private async doJoinPendingResolves(resource: URI): Promise<void> {

		// While we have pending model resolves, ensure
		// to await the last one finishing before returning.
		// This prevents a race when multiple clients await
		// the pending resolve and then all trigger the resolve
		// at the same time.
		let currentModelCopyResolve: Promise<void> | undefined;
		while (this.mapResourceToPendingModelResolvers.has(resource)) {
			const nextPendingModelResolve = this.mapResourceToPendingModelResolvers.get(resource);
			if (nextPendingModelResolve === currentModelCopyResolve) {
				return; // already awaited on - return
			}

			currentModelCopyResolve = nextPendingModelResolve;
			try {
				await nextPendingModelResolve;
			} catch (error) {
				// ignore any error here, it will bubble to the original requestor
			}
		}
	}

	private registerModel(model: TextFileEditorModel): void {

		// Install model listeners
		const modelListeners = new DisposableStore();
		modelListeners.add(model.onDidResolve(reason => this._onDidResolve.fire({ model, reason })));
		modelListeners.add(model.onDidChangeDirty(() => this._onDidChangeDirty.fire(model)));
		modelListeners.add(model.onDidChangeReadonly(() => this._onDidChangeReadonly.fire(model)));
		modelListeners.add(model.onDidChangeOrphaned(() => this._onDidChangeOrphaned.fire(model)));
		modelListeners.add(model.onDidSaveError(() => this._onDidSaveError.fire(model)));
		modelListeners.add(model.onDidSave(e => this._onDidSave.fire({ model, ...e })));
		modelListeners.add(model.onDidRevert(() => this._onDidRevert.fire(model)));
		modelListeners.add(model.onDidChangeEncoding(() => this._onDidChangeEncoding.fire(model)));

		// Keep for disposal
		this.mapResourceToModelListeners.set(model.resource, modelListeners);
	}

	add(resource: URI, model: TextFileEditorModel): void {
		const knownModel = this.mapResourceToModel.get(resource);
		if (knownModel === model) {
			return; // already cached
		}

		// dispose any previously stored dispose listener for this resource
		const disposeListener = this.mapResourceToDisposeListener.get(resource);
		disposeListener?.dispose();

		// store in cache but remove when model gets disposed
		this.mapResourceToModel.set(resource, model);
		this.mapResourceToDisposeListener.set(resource, model.onWillDispose(() => this.remove(resource)));
	}

	remove(resource: URI): void {
		const removed = this.mapResourceToModel.delete(resource);

		const disposeListener = this.mapResourceToDisposeListener.get(resource);
		if (disposeListener) {
			dispose(disposeListener);
			this.mapResourceToDisposeListener.delete(resource);
		}

		const modelListener = this.mapResourceToModelListeners.get(resource);
		if (modelListener) {
			dispose(modelListener);
			this.mapResourceToModelListeners.delete(resource);
		}

		if (removed) {
			this._onDidRemove.fire(resource);
		}
	}

	//#region Save participants

	private readonly saveParticipants: TextFileSaveParticipant;

	addSaveParticipant(participant: ITextFileSaveParticipant): IDisposable {
		return this.saveParticipants.addSaveParticipant(participant);
	}

	runSaveParticipants(model: ITextFileEditorModel, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		return this.saveParticipants.participate(model, context, progress, token);
	}

	//#endregion

	canDispose(model: TextFileEditorModel): true | Promise<true> {

		// quick return if model already disposed or not dirty and not resolving
		if (
			model.isDisposed() ||
			(!this.mapResourceToPendingModelResolvers.has(model.resource) && !model.isDirty())
		) {
			return true;
		}

		// promise based return in all other cases
		return this.doCanDispose(model);
	}

	private async doCanDispose(model: TextFileEditorModel): Promise<true> {

		// Await any pending resolves first before proceeding
		const pendingResolve = this.joinPendingResolves(model.resource);
		if (pendingResolve) {
			await pendingResolve;

			return this.canDispose(model);
		}

		// dirty model: we do not allow to dispose dirty models to prevent
		// data loss cases. dirty models can only be disposed when they are
		// either saved or reverted
		if (model.isDirty()) {
			await Event.toPromise(model.onDidChangeDirty);

			return this.canDispose(model);
		}

		return true;
	}

	override dispose(): void {
		super.dispose();

		// model caches
		this.mapResourceToModel.clear();
		this.mapResourceToPendingModelResolvers.clear();

		// dispose the dispose listeners
		dispose(this.mapResourceToDisposeListener.values());
		this.mapResourceToDisposeListener.clear();

		// dispose the model change listeners
		dispose(this.mapResourceToModelListeners.values());
		this.mapResourceToModelListeners.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/textfiles.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/textfiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ISaveOptions, IRevertOptions, SaveReason } from '../../../common/editor.js';
import { ReadableStream } from '../../../../base/common/stream.js';
import { IBaseFileStatWithMetadata, IFileStatWithMetadata, IWriteFileOptions, FileOperationError, FileOperationResult, IReadFileStreamOptions, IFileReadLimits } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { ITextBufferFactory, ITextModel, ITextSnapshot } from '../../../../editor/common/model.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { areFunctions, isUndefinedOrNull } from '../../../../base/common/types.js';
import { IWorkingCopy, IWorkingCopySaveEvent } from '../../workingCopy/common/workingCopy.js';
import { IUntitledTextEditorModelManager } from '../../untitled/common/untitledTextEditorService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IProgress, IProgressStep } from '../../../../platform/progress/common/progress.js';
import { IFileOperationUndoRedoInfo } from '../../workingCopy/common/workingCopyFileService.js';

export const ITextFileService = createDecorator<ITextFileService>('textFileService');

export interface ITextFileService extends IDisposable {

	readonly _serviceBrand: undefined;

	/**
	 * Access to the manager of text file editor models providing further
	 * methods to work with them.
	 */
	readonly files: ITextFileEditorModelManager;

	/**
	 * Access to the manager of untitled text editor models providing further
	 * methods to work with them.
	 */
	readonly untitled: IUntitledTextEditorModelManager;

	/**
	 * Helper to determine encoding for resources.
	 */
	readonly encoding: IResourceEncodings;

	/**
	 * A resource is dirty if it has unsaved changes or is an untitled file not yet saved.
	 *
	 * @param resource the resource to check for being dirty
	 */
	isDirty(resource: URI): boolean;

	/**
	 * Saves the resource.
	 *
	 * @param resource the resource to save
	 * @param options optional save options
	 * @return Path of the saved resource or undefined if canceled.
	 */
	save(resource: URI, options?: ITextFileSaveOptions): Promise<URI | undefined>;

	/**
	 * Saves the provided resource asking the user for a file name or using the provided one.
	 *
	 * @param resource the resource to save as.
	 * @param targetResource the optional target to save to.
	 * @param options optional save options
	 * @return Path of the saved resource or undefined if canceled.
	 */
	saveAs(resource: URI, targetResource?: URI, options?: ITextFileSaveAsOptions): Promise<URI | undefined>;

	/**
	 * Reverts the provided resource.
	 *
	 * @param resource the resource of the file to revert.
	 * @param force to force revert even when the file is not dirty
	 */
	revert(resource: URI, options?: IRevertOptions): Promise<void>;

	/**
	 * Read the contents of a file identified by the resource.
	 */
	read(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileContent>;

	/**
	 * Read the contents of a file identified by the resource as stream.
	 */
	readStream(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileStreamContent>;

	/**
	 * Update a file with given contents.
	 */
	write(resource: URI, value: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<IFileStatWithMetadata>;

	/**
	 * Create files. If the file exists it will be overwritten with the contents if
	 * the options enable to overwrite.
	 */
	create(operations: { resource: URI; value?: string | ITextSnapshot; options?: { overwrite?: boolean } }[], undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]>;

	/**
	 * Returns the readable that uses the appropriate encoding. This method should
	 * be used whenever a `string` or `ITextSnapshot` is being persisted to the
	 * file system.
	 */
	getEncodedReadable(resource: URI | undefined, value: ITextSnapshot, options?: IWriteTextFileOptions): Promise<VSBufferReadable>;
	getEncodedReadable(resource: URI | undefined, value: string, options?: IWriteTextFileOptions): Promise<VSBuffer | VSBufferReadable>;
	getEncodedReadable(resource: URI | undefined, value?: ITextSnapshot, options?: IWriteTextFileOptions): Promise<VSBufferReadable | undefined>;
	getEncodedReadable(resource: URI | undefined, value?: string, options?: IWriteTextFileOptions): Promise<VSBuffer | VSBufferReadable | undefined>;
	getEncodedReadable(resource: URI | undefined, value?: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<VSBuffer | VSBufferReadable | undefined>;

	/**
	 * Returns a stream of strings that uses the appropriate encoding. This method should
	 * be used whenever a `VSBufferReadableStream` is being loaded from the file system.
	 *
	 * Will throw an error if `acceptTextOnly: true` for resources that seem to be binary.
	 */
	getDecodedStream(resource: URI | undefined, value: VSBufferReadableStream, options?: IReadTextFileEncodingOptions): Promise<ReadableStream<string>>;

	/**
	 * Get the encoding for the provided `resource`. Will try to determine the encoding
	 * from any existing model for that `resource` and fallback to the configured defaults.
	 */
	getEncoding(resource: URI): string;

	/**
	 * Get the properties for decoding the provided `resource` based on configuration.
	 */
	resolveDecoding(resource: URI | undefined, options?: IReadTextFileEncodingOptions): Promise<{ preferredEncoding: string; guessEncoding: boolean; candidateGuessEncodings: string[] }>;

	/**
	 * Get the properties for encoding the provided `resource` based on configuration.
	 */
	resolveEncoding(resource: URI | undefined, options?: IWriteTextFileOptions): Promise<{ encoding: string; addBOM: boolean }>;

	/**
	 * Given a detected encoding, validate it against the configured encoding options.
	 */
	validateDetectedEncoding(resource: URI | undefined, detectedEncoding: string, options?: IReadTextFileEncodingOptions): Promise<string>;
}

export interface IReadTextFileEncodingOptions {

	/**
	 * The optional encoding parameter allows to specify the desired encoding when resolving
	 * the contents of the file.
	 */
	readonly encoding?: string;

	/**
	 * The optional guessEncoding parameter allows to guess encoding from content of the file.
	 */
	readonly autoGuessEncoding?: boolean;

	/**
	 * The optional candidateGuessEncodings parameter limits the allowed encodings to guess from.
	 */
	readonly candidateGuessEncodings?: string[];

	/**
	 * The optional acceptTextOnly parameter allows to fail this request early if the file
	 * contents are not textual.
	 */
	readonly acceptTextOnly?: boolean;
}

export interface IReadTextFileOptions extends IReadTextFileEncodingOptions, IReadFileStreamOptions { }

export interface IWriteTextFileOptions extends IWriteFileOptions {

	/**
	 * The encoding to use when updating a file.
	 */
	readonly encoding?: string;

	/**
	 * Whether to write to the file as elevated (admin) user. When setting this option a prompt will
	 * ask the user to authenticate as super user.
	 */
	readonly writeElevated?: boolean;
}

export const enum TextFileOperationResult {
	FILE_IS_BINARY
}

export class TextFileOperationError extends FileOperationError {

	static isTextFileOperationError(obj: unknown): obj is TextFileOperationError {
		return obj instanceof Error && !isUndefinedOrNull((obj as TextFileOperationError).textFileOperationResult);
	}

	override readonly options?: IReadTextFileOptions & IWriteTextFileOptions;

	constructor(
		message: string,
		public textFileOperationResult: TextFileOperationResult,
		options?: IReadTextFileOptions & IWriteTextFileOptions
	) {
		super(message, FileOperationResult.FILE_OTHER_ERROR);

		this.options = options;
	}
}

export interface IResourceEncodings {
	getPreferredReadEncoding(resource: URI): Promise<IResourceEncoding>;
	getPreferredWriteEncoding(resource: URI, preferredEncoding?: string): Promise<IResourceEncoding>;
}

export interface IResourceEncoding {
	readonly encoding: string;
	readonly hasBOM: boolean;
}

/**
 * The save error handler can be installed on the text file editor model to install code that executes when save errors occur.
 */
export interface ISaveErrorHandler {

	/**
	 * Called whenever a save fails.
	 */
	onSaveError(error: Error, model: ITextFileEditorModel, options: ITextFileSaveAsOptions): void;
}

/**
 * States the text file editor model can be in.
 */
export const enum TextFileEditorModelState {

	/**
	 * A model is saved.
	 */
	SAVED,

	/**
	 * A model is dirty.
	 */
	DIRTY,

	/**
	 * A model is currently being saved but this operation has not completed yet.
	 */
	PENDING_SAVE,

	/**
	 * A model is in conflict mode when changes cannot be saved because the
	 * underlying file has changed. Models in conflict mode are always dirty.
	 */
	CONFLICT,

	/**
	 * A model is in orphan state when the underlying file has been deleted.
	 */
	ORPHAN,

	/**
	 * Any error that happens during a save that is not causing the CONFLICT state.
	 * Models in error mode are always dirty.
	 */
	ERROR
}

export const enum TextFileResolveReason {
	EDITOR = 1,
	REFERENCE = 2,
	OTHER = 3
}

interface IBaseTextFileContent extends IBaseFileStatWithMetadata {

	/**
	 * The encoding of the content if known.
	 */
	readonly encoding: string;
}

export interface ITextFileContent extends IBaseTextFileContent {

	/**
	 * The content of a text file.
	 */
	readonly value: string;
}

export interface ITextFileStreamContent extends IBaseTextFileContent {

	/**
	 * The line grouped content of a text file.
	 */
	readonly value: ITextBufferFactory;
}

export interface ITextFileEditorModelResolveOrCreateOptions extends ITextFileResolveOptions {

	/**
	 * The language id to use for the model text content.
	 */
	readonly languageId?: string;

	/**
	 * The encoding to use when resolving the model text content.
	 */
	readonly encoding?: string;

	/**
	 * If the model was already resolved before, allows to trigger
	 * a reload of it to fetch the latest contents.
	 */
	readonly reload?: {

		/**
		 * Controls whether the reload happens in the background
		 * or whether `resolve` will await the reload to happen.
		 */
		readonly async: boolean;
	};
}

export interface ITextFileSaveEvent extends ITextFileEditorModelSaveEvent {

	/**
	 * The model that was saved.
	 */
	readonly model: ITextFileEditorModel;
}

export interface ITextFileResolveEvent {

	/**
	 * The model that was resolved.
	 */
	readonly model: ITextFileEditorModel;

	/**
	 * The reason why the model was resolved.
	 */
	readonly reason: TextFileResolveReason;
}

export interface ITextFileSaveParticipantContext {

	/**
	 * The reason why the save was triggered.
	 */
	readonly reason: SaveReason;

	/**
	 * Only applies to when a text file was saved as, for
	 * example when starting with untitled and saving. This
	 * provides access to the initial resource the text
	 * file had before.
	 */
	readonly savedFrom?: URI;
}

export interface ITextFileSaveParticipant {

	/**
	 * The ordinal number which determines the order of participation.
	 * Lower values mean to participant sooner
	 */
	readonly ordinal?: number;

	/**
	 * Participate in a save of a model. Allows to change the model
	 * before it is being saved to disk.
	 */
	participate(
		model: ITextFileEditorModel,
		context: ITextFileSaveParticipantContext,
		progress: IProgress<IProgressStep>,
		token: CancellationToken
	): Promise<void>;
}

export interface ITextFileEditorModelManager {

	readonly onDidCreate: Event<ITextFileEditorModel>;
	readonly onDidResolve: Event<ITextFileResolveEvent>;
	readonly onDidChangeDirty: Event<ITextFileEditorModel>;
	readonly onDidChangeReadonly: Event<ITextFileEditorModel>;
	readonly onDidRemove: Event<URI>;
	readonly onDidChangeOrphaned: Event<ITextFileEditorModel>;
	readonly onDidChangeEncoding: Event<ITextFileEditorModel>;
	readonly onDidSaveError: Event<ITextFileEditorModel>;
	readonly onDidSave: Event<ITextFileSaveEvent>;
	readonly onDidRevert: Event<ITextFileEditorModel>;

	/**
	 * Access to all text file editor models in memory.
	 */
	readonly models: ITextFileEditorModel[];

	/**
	 * Allows to configure the error handler that is called on save errors.
	 */
	saveErrorHandler: ISaveErrorHandler;

	/**
	 * Returns the text file editor model for the provided resource
	 * or undefined if none.
	 */
	get(resource: URI): ITextFileEditorModel | undefined;

	/**
	 * Allows to resolve a text file model from disk.
	 */
	resolve(resource: URI, options?: ITextFileEditorModelResolveOrCreateOptions): Promise<ITextFileEditorModel>;

	/**
	 * Adds a participant for saving text file models.
	 */
	addSaveParticipant(participant: ITextFileSaveParticipant): IDisposable;

	/**
	 * Runs the registered save participants on the provided model.
	 */
	runSaveParticipants(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void>;

	/**
	 * Waits for the model to be ready to be disposed. There may be conditions
	 * under which the model cannot be disposed, e.g. when it is dirty. Once the
	 * promise is settled, it is safe to dispose the model.
	 */
	canDispose(model: ITextFileEditorModel): true | Promise<true>;
}

export interface ITextFileSaveOptions extends ISaveOptions {

	/**
	 * Save the file with an attempt to unlock it.
	 */
	readonly writeUnlock?: boolean;

	/**
	 * Save the file with elevated privileges.
	 *
	 * Note: This may not be supported in all environments.
	 */
	readonly writeElevated?: boolean;

	/**
	 * Allows to write to a file even if it has been modified on disk.
	 */
	readonly ignoreModifiedSince?: boolean;

	/**
	 * If set, will bubble up the error to the caller instead of handling it.
	 */
	readonly ignoreErrorHandler?: boolean;
}

export interface ITextFileSaveAsOptions extends ITextFileSaveOptions {

	/**
	 * Optional URI of the resource the text file is saved from if known.
	 */
	readonly from?: URI;

	/**
	 * Optional URI to use as suggested file path to save as.
	 */
	readonly suggestedTarget?: URI;
}

export interface ITextFileResolveOptions {

	/**
	 * The contents to use for the model if known. If not
	 * provided, the contents will be retrieved from the
	 * underlying resource or backup if present.
	 */
	readonly contents?: ITextBufferFactory;

	/**
	 * Go to file bypassing any cache of the model if any.
	 */
	readonly forceReadFromFile?: boolean;

	/**
	 * Allow to resolve a model even if we think it is a binary file.
	 */
	readonly allowBinary?: boolean;

	/**
	 * Context why the model is being resolved.
	 */
	readonly reason?: TextFileResolveReason;

	/**
	 * If provided, the size of the file will be checked against the limits
	 * and an error will be thrown if any limit is exceeded.
	 */
	readonly limits?: IFileReadLimits;
}

export const enum EncodingMode {

	/**
	 * Instructs the encoding support to encode the object with the provided encoding
	 */
	Encode,

	/**
	 * Instructs the encoding support to decode the object with the provided encoding
	 */
	Decode
}

export interface IEncodingSupport {

	/**
	 * Gets the encoding of the object if known.
	 */
	getEncoding(): string | undefined;

	/**
	 * Sets the encoding for the object for saving.
	 */
	setEncoding(encoding: string, mode: EncodingMode): Promise<void>;
}

export interface ILanguageSupport {

	/**
	 * Sets the language id of the object.
	 */
	setLanguageId(languageId: string, source?: string): void;
}

export interface ITextFileEditorModelSaveEvent extends IWorkingCopySaveEvent {

	/**
	 * The resolved stat from the save operation.
	 */
	readonly stat: IFileStatWithMetadata;
}

export interface ITextFileEditorModel extends ITextEditorModel, IEncodingSupport, ILanguageSupport, IWorkingCopy {

	readonly onDidSave: Event<ITextFileEditorModelSaveEvent>;
	readonly onDidSaveError: Event<void>;
	readonly onDidChangeOrphaned: Event<void>;
	readonly onDidChangeReadonly: Event<void>;
	readonly onDidChangeEncoding: Event<void>;

	hasState(state: TextFileEditorModelState): boolean;
	joinState(state: TextFileEditorModelState.PENDING_SAVE): Promise<void>;

	updatePreferredEncoding(encoding: string | undefined): void;

	save(options?: ITextFileSaveAsOptions): Promise<boolean>;
	revert(options?: IRevertOptions): Promise<void>;

	resolve(options?: ITextFileResolveOptions): Promise<void>;

	isDirty(): this is IResolvedTextFileEditorModel;

	getLanguageId(): string | undefined;

	isResolved(): this is IResolvedTextFileEditorModel;
}

export function isTextFileEditorModel(model: ITextEditorModel): model is ITextFileEditorModel {
	const candidate = model as ITextFileEditorModel;

	return areFunctions(candidate.setEncoding, candidate.getEncoding, candidate.save, candidate.revert, candidate.isDirty, candidate.getLanguageId);
}

export interface IResolvedTextFileEditorModel extends ITextFileEditorModel {

	readonly textEditorModel: ITextModel;

	createSnapshot(): ITextSnapshot;
}

export function snapshotToString(snapshot: ITextSnapshot): string {
	const chunks: string[] = [];

	let chunk: string | null;
	while (typeof (chunk = snapshot.read()) === 'string') {
		chunks.push(chunk);
	}

	return chunks.join('');
}

export function stringToSnapshot(value: string): ITextSnapshot {
	let done = false;

	return {
		read(): string | null {
			if (!done) {
				done = true;

				return value;
			}

			return null;
		}
	};
}

export function toBufferOrReadable(value: string): VSBuffer;
export function toBufferOrReadable(value: ITextSnapshot): VSBufferReadable;
export function toBufferOrReadable(value: string | ITextSnapshot): VSBuffer | VSBufferReadable;
export function toBufferOrReadable(value: string | ITextSnapshot | undefined): VSBuffer | VSBufferReadable | undefined;
export function toBufferOrReadable(value: string | ITextSnapshot | undefined): VSBuffer | VSBufferReadable | undefined {
	if (typeof value === 'undefined') {
		return undefined;
	}

	if (typeof value === 'string') {
		return VSBuffer.fromString(value);
	}

	return {
		read: () => {
			const chunk = value.read();
			if (typeof chunk === 'string') {
				return VSBuffer.fromString(chunk);
			}

			return null;
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/common/textFileSaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/common/textFileSaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { ITextFileSaveParticipant, ITextFileEditorModel, ITextFileSaveParticipantContext } from './textfiles.js';
import { IDisposable, Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { localize } from '../../../../nls.js';
import { NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { CancellationError, isCancellationError } from '../../../../base/common/errors.js';

export class TextFileSaveParticipant extends Disposable {

	private readonly saveParticipants = new LinkedList<ITextFileSaveParticipant>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IProgressService private readonly progressService: IProgressService,
	) {
		super();
	}

	addSaveParticipant(participant: ITextFileSaveParticipant): IDisposable {
		const remove = this.saveParticipants.push(participant);

		return toDisposable(() => remove());
	}

	async participate(model: ITextFileEditorModel, context: ITextFileSaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		const cts = new CancellationTokenSource(token);

		// undoStop before participation
		model.textEditorModel?.pushStackElement();

		// report to the "outer" progress
		progress.report({
			message: localize('saveParticipants1', "Running Code Actions and Formatters...")
		});

		let bubbleCancel = false;

		// create an "inner" progress to allow to skip over long running save participants
		await this.progressService.withProgress({
			priority: NotificationPriority.URGENT,
			location: ProgressLocation.Notification,
			cancellable: localize('skip', "Skip"),
			delay: model.isDirty() ? 5000 : 3000
		}, async progress => {

			const participants = Array.from(this.saveParticipants).sort((a, b) => {
				const aValue = a.ordinal ?? 0;
				const bValue = b.ordinal ?? 0;
				return aValue - bValue;
			});

			for (const saveParticipant of participants) {
				if (cts.token.isCancellationRequested || !model.textEditorModel /* disposed */) {
					break;
				}

				try {
					const promise = saveParticipant.participate(model, context, progress, cts.token);
					await raceCancellation(promise, cts.token);
				} catch (err) {
					if (!isCancellationError(err)) {
						this.logService.error(err);
					} else if (!cts.token.isCancellationRequested) {
						// we see a cancellation error BUT the token didn't signal it
						// this means the participant wants the save operation to be cancelled
						cts.cancel();
						bubbleCancel = true;
					}
				}
			}
		}, () => {
			cts.cancel();
		});

		// undoStop after participation
		model.textEditorModel?.pushStackElement();

		cts.dispose();

		if (bubbleCancel) {
			throw new CancellationError();
		}
	}

	override dispose(): void {
		this.saveParticipants.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/electron-browser/nativeTextFileService.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/electron-browser/nativeTextFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { AbstractTextFileService } from '../browser/textFileService.js';
import { ITextFileService, ITextFileStreamContent, ITextFileContent, IReadTextFileOptions, TextFileEditorModelState, ITextFileEditorModel } from '../common/textfiles.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService, IFileReadLimits } from '../../../../platform/files/common/files.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IUntitledTextEditorModelManager, IUntitledTextEditorService } from '../../untitled/common/untitledTextEditorService.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IPathService } from '../../path/common/pathService.js';
import { IWorkingCopyFileService } from '../../workingCopy/common/workingCopyFileService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Promises } from '../../../../base/common/async.js';
import { IDecorationsService } from '../../decorations/common/decorations.js';

export class NativeTextFileService extends AbstractTextFileService {

	protected override readonly environmentService: INativeWorkbenchEnvironmentService;

	constructor(
		@IFileService fileService: IFileService,
		@IUntitledTextEditorService untitledTextEditorService: IUntitledTextEditorModelManager,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IDialogService dialogService: IDialogService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IPathService pathService: IPathService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILanguageService languageService: ILanguageService,
		@IElevatedFileService elevatedFileService: IElevatedFileService,
		@ILogService logService: ILogService,
		@IDecorationsService decorationsService: IDecorationsService
	) {
		super(fileService, untitledTextEditorService, lifecycleService, instantiationService, modelService, environmentService, dialogService, fileDialogService, textResourceConfigurationService, filesConfigurationService, codeEditorService, pathService, workingCopyFileService, uriIdentityService, languageService, logService, elevatedFileService, decorationsService);

		this.environmentService = environmentService;

		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle
		this._register(this.lifecycleService.onWillShutdown(event => event.join(this.onWillShutdown(), { id: 'join.textFiles', label: localize('join.textFiles', "Saving text files") })));
	}

	private async onWillShutdown(): Promise<void> {
		let modelsPendingToSave: ITextFileEditorModel[];

		// As long as models are pending to be saved, we prolong the shutdown
		// until that has happened to ensure we are not shutting down in the
		// middle of writing to the file
		// (https://github.com/microsoft/vscode/issues/116600)
		while ((modelsPendingToSave = this.files.models.filter(model => model.hasState(TextFileEditorModelState.PENDING_SAVE))).length > 0) {
			await Promises.settled(modelsPendingToSave.map(model => model.joinState(TextFileEditorModelState.PENDING_SAVE)));
		}
	}

	override async read(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileContent> {

		// ensure platform limits are applied
		options = this.ensureLimits(options);

		return super.read(resource, options);
	}

	override async readStream(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileStreamContent> {

		// ensure platform limits are applied
		options = this.ensureLimits(options);

		return super.readStream(resource, options);
	}

	private ensureLimits(options?: IReadTextFileOptions): IReadTextFileOptions {
		let ensuredOptions: IReadTextFileOptions;
		if (!options) {
			ensuredOptions = Object.create(null);
		} else {
			ensuredOptions = options;
		}

		let ensuredLimits: IFileReadLimits;
		if (!ensuredOptions.limits) {
			ensuredLimits = Object.create(null);
			ensuredOptions = {
				...ensuredOptions,
				limits: ensuredLimits
			};
		} else {
			ensuredLimits = ensuredOptions.limits;
		}

		return ensuredOptions;
	}
}

registerSingleton(ITextFileService, NativeTextFileService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/browser/browserTextFileService.io.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/browserTextFileService.io.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workbenchInstantiationService, TestInMemoryFileSystemProvider, TestBrowserTextFileServiceWithEncodingOverrides } from '../../../../test/browser/workbenchTestServices.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ITextFileService } from '../../common/textfiles.js';
import { TextFileEditorModelManager } from '../../common/textFileEditorModelManager.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IFileService, IStat } from '../../../../../platform/files/common/files.js';
import { URI } from '../../../../../base/common/uri.js';
import { join } from '../../../../../base/common/path.js';
import { UTF16le, detectEncodingByBOMFromBuffer, UTF8_with_bom, UTF16be, toCanonicalName } from '../../common/encoding.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import files from '../common/fixtures/files.js';
import createSuite from '../common/textFileService.io.test.js';
import { isWeb } from '../../../../../base/common/platform.js';
import { IWorkingCopyFileService, WorkingCopyFileService } from '../../../workingCopy/common/workingCopyFileService.js';
import { WorkingCopyService } from '../../../workingCopy/common/workingCopyService.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

// optimization: we don't need to run this suite in native environment,
// because we have nativeTextFileService.io.test.ts for it,
// so our tests run faster
if (isWeb) {
	suite('Files - BrowserTextFileService i/o', function () {
		const disposables = new DisposableStore();

		let service: ITextFileService;
		let fileProvider: TestInMemoryFileSystemProvider;
		const testDir = 'test';

		createSuite({
			setup: async () => {
				const instantiationService = workbenchInstantiationService(undefined, disposables);

				const logService = new NullLogService();
				const fileService = disposables.add(new FileService(logService));

				fileProvider = disposables.add(new TestInMemoryFileSystemProvider());
				disposables.add(fileService.registerProvider(Schemas.file, fileProvider));

				const collection = new ServiceCollection();
				collection.set(IFileService, fileService);
				collection.set(IWorkingCopyFileService, disposables.add(new WorkingCopyFileService(fileService, disposables.add(new WorkingCopyService()), instantiationService, disposables.add(new UriIdentityService(fileService)))));

				service = disposables.add(instantiationService.createChild(collection).createInstance(TestBrowserTextFileServiceWithEncodingOverrides));
				disposables.add(<TextFileEditorModelManager>service.files);

				await fileProvider.mkdir(URI.file(testDir));
				for (const fileName in files) {
					await fileProvider.writeFile(
						URI.file(join(testDir, fileName)),
						files[fileName],
						{ create: true, overwrite: false, unlock: false, atomic: false }
					);
				}

				return { service, testDir };
			},

			teardown: async () => {
				disposables.clear();
			},

			exists,
			stat,
			readFile,
			detectEncodingByBOM
		});

		async function exists(fsPath: string): Promise<boolean> {
			try {
				await fileProvider.readFile(URI.file(fsPath));
				return true;
			}
			catch (e) {
				return false;
			}
		}

		async function readFile(fsPath: string): Promise<VSBuffer>;
		async function readFile(fsPath: string, encoding: string): Promise<string>;
		async function readFile(fsPath: string, encoding?: string): Promise<VSBuffer | string> {
			const file = await fileProvider.readFile(URI.file(fsPath));

			if (!encoding) {
				return VSBuffer.wrap(file);
			}

			return new TextDecoder(toCanonicalName(encoding)).decode(file);
		}

		async function stat(fsPath: string): Promise<IStat> {
			return fileProvider.stat(URI.file(fsPath));
		}

		async function detectEncodingByBOM(fsPath: string): Promise<typeof UTF16be | typeof UTF16le | typeof UTF8_with_bom | null> {
			try {
				const buffer = await readFile(fsPath);

				return detectEncodingByBOMFromBuffer(buffer.slice(0, 3), 3);
			} catch (error) {
				return null; // ignore errors (like file not found)
			}
		}

		ensureNoDisposablesAreLeakedInTestSuite();
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/browser/textEditorService.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/textEditorService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IResourceDiffEditorInput, IResourceSideBySideEditorInput, isResourceDiffEditorInput, isResourceSideBySideEditorInput, isUntitledResourceEditorInput } from '../../../../common/editor.js';
import { workbenchInstantiationService, registerTestEditor, TestFileEditorInput, registerTestResourceEditor, registerTestSideBySideEditor } from '../../../../test/browser/workbenchTestServices.js';
import { TextResourceEditorInput } from '../../../../common/editor/textResourceEditorInput.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { FileEditorInput } from '../../../../contrib/files/browser/editors/fileEditorInput.js';
import { UntitledTextEditorInput } from '../../../untitled/common/untitledTextEditorInput.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { UntitledTextEditorModel } from '../../../untitled/common/untitledTextEditorModel.js';
import { NullFileSystemProvider } from '../../../../../platform/files/test/common/nullFileSystemProvider.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { isLinux } from '../../../../../base/common/platform.js';
import { SideBySideEditorInput } from '../../../../common/editor/sideBySideEditorInput.js';
import { ITextFileEditorModel } from '../../common/textfiles.js';
import { TextEditorService } from '../../common/textEditorService.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';

suite('TextEditorService', () => {

	const TEST_EDITOR_ID = 'MyTestEditorForEditorService';
	const TEST_EDITOR_INPUT_ID = 'testEditorInputForEditorService';

	class FileServiceProvider extends Disposable {
		constructor(scheme: string, @IFileService fileService: IFileService) {
			super();

			this._register(fileService.registerProvider(scheme, new NullFileSystemProvider()));
		}
	}

	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestEditor(TEST_EDITOR_ID, [new SyncDescriptor(TestFileEditorInput)], TEST_EDITOR_INPUT_ID));
		disposables.add(registerTestResourceEditor());
		disposables.add(registerTestSideBySideEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	test('createTextEditor - basics', async function () {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const languageService = instantiationService.get(ILanguageService);
		const service = disposables.add(instantiationService.createInstance(TextEditorService));

		const languageId = 'create-input-test';
		disposables.add(languageService.registerLanguage({
			id: languageId,
		}));

		// Untyped Input (file)
		let input: EditorInput = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html'), options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof FileEditorInput);
		let contentInput = <FileEditorInput>input;
		assert.strictEqual(contentInput.resource.fsPath, toResource.call(this, '/index.html').fsPath);

		// Untyped Input (file casing)
		input = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html') }));
		const inputDifferentCase = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/INDEX.html') }));

		if (!isLinux) {
			assert.strictEqual(input, inputDifferentCase);
			assert.strictEqual(input.resource?.toString(), inputDifferentCase.resource?.toString());
		} else {
			assert.notStrictEqual(input, inputDifferentCase);
			assert.notStrictEqual(input.resource?.toString(), inputDifferentCase.resource?.toString());
		}

		// Typed Input
		assert.strictEqual(disposables.add(service.createTextEditor(input)), input);

		// Untyped Input (file, encoding)
		input = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html'), encoding: 'utf16le', options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof FileEditorInput);
		contentInput = <FileEditorInput>input;
		assert.strictEqual(contentInput.getPreferredEncoding(), 'utf16le');

		// Untyped Input (file, language)
		input = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html'), languageId: languageId }));
		assert(input instanceof FileEditorInput);
		contentInput = <FileEditorInput>input;
		assert.strictEqual(contentInput.getPreferredLanguageId(), languageId);
		let fileModel = disposables.add((await contentInput.resolve() as ITextFileEditorModel));
		assert.strictEqual(fileModel.textEditorModel?.getLanguageId(), languageId);

		// Untyped Input (file, contents)
		input = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html'), contents: 'My contents' }));
		assert(input instanceof FileEditorInput);
		contentInput = <FileEditorInput>input;
		fileModel = disposables.add((await contentInput.resolve() as ITextFileEditorModel));
		assert.strictEqual(fileModel.textEditorModel?.getValue(), 'My contents');
		assert.strictEqual(fileModel.isDirty(), true);

		// Untyped Input (file, different language)
		input = disposables.add(service.createTextEditor({ resource: toResource.call(this, '/index.html'), languageId: 'text' }));
		assert(input instanceof FileEditorInput);
		contentInput = <FileEditorInput>input;
		assert.strictEqual(contentInput.getPreferredLanguageId(), 'text');

		// Untyped Input (untitled)
		input = disposables.add(service.createTextEditor({ resource: undefined, options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof UntitledTextEditorInput);

		// Untyped Input (untitled with contents)
		let untypedInput: any = { contents: 'Hello Untitled', options: { selection: { startLineNumber: 1, startColumn: 1 } } };
		input = disposables.add(service.createTextEditor(untypedInput));
		assert.ok(isUntitledResourceEditorInput(untypedInput));
		assert(input instanceof UntitledTextEditorInput);
		let model = disposables.add(await input.resolve() as UntitledTextEditorModel);
		assert.strictEqual(model.textEditorModel?.getValue(), 'Hello Untitled');

		// Untyped Input (untitled with language id)
		input = disposables.add(service.createTextEditor({ resource: undefined, languageId: languageId, options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof UntitledTextEditorInput);
		model = disposables.add(await input.resolve() as UntitledTextEditorModel);
		assert.strictEqual(model.getLanguageId(), languageId);

		// Untyped Input (untitled with file path)
		input = disposables.add(service.createTextEditor({ resource: URI.file('/some/path.txt'), forceUntitled: true, options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof UntitledTextEditorInput);
		assert.ok((input as UntitledTextEditorInput).hasAssociatedFilePath);

		// Untyped Input (untitled with untitled resource)
		untypedInput = { resource: URI.parse('untitled://Untitled-1'), forceUntitled: true, options: { selection: { startLineNumber: 1, startColumn: 1 } } };
		assert.ok(isUntitledResourceEditorInput(untypedInput));
		input = disposables.add(service.createTextEditor(untypedInput));
		assert(input instanceof UntitledTextEditorInput);
		assert.ok(!(input as UntitledTextEditorInput).hasAssociatedFilePath);

		// Untyped input (untitled with custom resource, but forceUntitled)
		untypedInput = { resource: URI.file('/fake'), forceUntitled: true };
		assert.ok(isUntitledResourceEditorInput(untypedInput));
		input = disposables.add(service.createTextEditor(untypedInput));
		assert(input instanceof UntitledTextEditorInput);

		// Untyped Input (untitled with custom resource)
		const provider = disposables.add(instantiationService.createInstance(FileServiceProvider, 'untitled-custom'));

		input = disposables.add(service.createTextEditor({ resource: URI.parse('untitled-custom://some/path'), forceUntitled: true, options: { selection: { startLineNumber: 1, startColumn: 1 } } }));
		assert(input instanceof UntitledTextEditorInput);
		assert.ok((input as UntitledTextEditorInput).hasAssociatedFilePath);

		provider.dispose();

		// Untyped Input (resource)
		input = disposables.add(service.createTextEditor({ resource: URI.parse('custom:resource') }));
		assert(input instanceof TextResourceEditorInput);

		// Untyped Input (diff)
		const resourceDiffInput = {
			modified: { resource: toResource.call(this, '/modified.html') },
			original: { resource: toResource.call(this, '/original.html') }
		};
		assert.strictEqual(isResourceDiffEditorInput(resourceDiffInput), true);
		input = disposables.add(service.createTextEditor(resourceDiffInput));
		assert(input instanceof DiffEditorInput);
		disposables.add(input.modified);
		disposables.add(input.original);
		assert.strictEqual(input.original.resource?.toString(), resourceDiffInput.original.resource.toString());
		assert.strictEqual(input.modified.resource?.toString(), resourceDiffInput.modified.resource.toString());
		const untypedDiffInput = input.toUntyped() as IResourceDiffEditorInput;
		assert.strictEqual(untypedDiffInput.original.resource?.toString(), resourceDiffInput.original.resource.toString());
		assert.strictEqual(untypedDiffInput.modified.resource?.toString(), resourceDiffInput.modified.resource.toString());

		// Untyped Input (side by side)
		const sideBySideResourceInput = {
			primary: { resource: toResource.call(this, '/primary.html') },
			secondary: { resource: toResource.call(this, '/secondary.html') }
		};
		assert.strictEqual(isResourceSideBySideEditorInput(sideBySideResourceInput), true);
		input = disposables.add(service.createTextEditor(sideBySideResourceInput));
		assert(input instanceof SideBySideEditorInput);
		disposables.add(input.primary);
		disposables.add(input.secondary);
		assert.strictEqual(input.primary.resource?.toString(), sideBySideResourceInput.primary.resource.toString());
		assert.strictEqual(input.secondary.resource?.toString(), sideBySideResourceInput.secondary.resource.toString());
		const untypedSideBySideInput = input.toUntyped() as IResourceSideBySideEditorInput;
		assert.strictEqual(untypedSideBySideInput.primary.resource?.toString(), sideBySideResourceInput.primary.resource.toString());
		assert.strictEqual(untypedSideBySideInput.secondary.resource?.toString(), sideBySideResourceInput.secondary.resource.toString());
	});

	test('createTextEditor- caching', function () {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const service = disposables.add(instantiationService.createInstance(TextEditorService));

		// Cached Input (Files)
		const fileResource1: URI = toResource.call(this, '/foo/bar/cache1.js');
		const fileEditorInput1 = disposables.add(service.createTextEditor({ resource: fileResource1 }));
		assert.ok(fileEditorInput1);

		const fileResource2 = toResource.call(this, '/foo/bar/cache2.js');
		const fileEditorInput2 = disposables.add(service.createTextEditor({ resource: fileResource2 }));
		assert.ok(fileEditorInput2);

		assert.notStrictEqual(fileEditorInput1, fileEditorInput2);

		const fileEditorInput1Again = disposables.add(service.createTextEditor({ resource: fileResource1 }));
		assert.strictEqual(fileEditorInput1Again, fileEditorInput1);

		fileEditorInput1Again.dispose();

		assert.ok(fileEditorInput1.isDisposed());

		const fileEditorInput1AgainAndAgain = disposables.add(service.createTextEditor({ resource: fileResource1 }));
		assert.notStrictEqual(fileEditorInput1AgainAndAgain, fileEditorInput1);
		assert.ok(!fileEditorInput1AgainAndAgain.isDisposed());

		// Cached Input (Resource)
		const resource1 = URI.from({ scheme: 'custom', path: '/foo/bar/cache1.js' });
		const input1 = disposables.add(service.createTextEditor({ resource: resource1 }));
		assert.ok(input1);

		const resource2 = URI.from({ scheme: 'custom', path: '/foo/bar/cache2.js' });
		const input2 = disposables.add(service.createTextEditor({ resource: resource2 }));
		assert.ok(input2);

		assert.notStrictEqual(input1, input2);

		const input1Again = disposables.add(service.createTextEditor({ resource: resource1 }));
		assert.strictEqual(input1Again, input1);

		input1Again.dispose();

		assert.ok(input1.isDisposed());

		const input1AgainAndAgain = disposables.add(service.createTextEditor({ resource: resource1 }));
		assert.notStrictEqual(input1AgainAndAgain, input1);
		assert.ok(!input1AgainAndAgain.isDisposed());
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/browser/textFileEditorModel.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/textFileEditorModel.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TextFileEditorModel } from '../../common/textFileEditorModel.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../../../test/browser/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { TextFileEditorModelManager } from '../../common/textFileEditorModelManager.js';
import { createTextBufferFactoryFromStream } from '../../../../../editor/common/model/textModel.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';

suite('Files - TextFileEditorModel (integration)', () => {

	const disposables = new DisposableStore();

	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let content: string;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		content = accessor.fileService.getContent();
		disposables.add(toDisposable(() => accessor.fileService.setContent(content)));
		disposables.add(<TextFileEditorModelManager>accessor.textFileService.files);
	});

	teardown(() => {
		disposables.clear();
	});

	test('backup and restore (simple)', async function () {
		return testBackupAndRestore(toResource.call(this, '/path/index_async.txt'), toResource.call(this, '/path/index_async2.txt'), 'Some very small file text content.');
	});

	test('backup and restore (large, #121347)', async function () {
		const largeContent = '국어한\n'.repeat(100000);
		return testBackupAndRestore(toResource.call(this, '/path/index_async.txt'), toResource.call(this, '/path/index_async2.txt'), largeContent);
	});

	async function testBackupAndRestore(resourceA: URI, resourceB: URI, contents: string): Promise<void> {
		const originalModel: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, resourceA, 'utf8', undefined));
		await originalModel.resolve({
			contents: await createTextBufferFactoryFromStream(await accessor.textFileService.getDecodedStream(resourceA, bufferToStream(VSBuffer.fromString(contents))))
		});

		assert.strictEqual(originalModel.textEditorModel?.getValue(), contents);

		const backup = await originalModel.backup(CancellationToken.None);
		const modelRestoredIdentifier = { typeId: originalModel.typeId, resource: resourceB };
		await accessor.workingCopyBackupService.backup(modelRestoredIdentifier, backup.content);

		const modelRestored: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, modelRestoredIdentifier.resource, 'utf8', undefined));
		await modelRestored.resolve();

		assert.strictEqual(modelRestored.textEditorModel?.getValue(), contents);
		assert.strictEqual(modelRestored.isDirty(), true);
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````

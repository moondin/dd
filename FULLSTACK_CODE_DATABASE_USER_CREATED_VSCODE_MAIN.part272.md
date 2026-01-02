---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 272
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 272 of 552)

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

---[FILE: src/vs/platform/files/common/fileService.ts]---
Location: vscode-main/src/vs/platform/files/common/fileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../base/common/arrays.js';
import { Promises, ResourceQueue } from '../../../base/common/async.js';
import { bufferedStreamToBuffer, bufferToReadable, newWriteableBufferStream, readableToBuffer, streamToBuffer, VSBuffer, VSBufferReadable, VSBufferReadableBufferedStream, VSBufferReadableStream } from '../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { Schemas } from '../../../base/common/network.js';
import { mark } from '../../../base/common/performance.js';
import { extUri, extUriIgnorePathCase, IExtUri, isAbsolutePath } from '../../../base/common/resources.js';
import { consumeStream, isReadableBufferedStream, isReadableStream, listenStream, newWriteableStream, peekReadable, peekStream, transform } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ensureFileSystemProviderError, etag, ETAG_DISABLED, FileChangesEvent, IFileDeleteOptions, FileOperation, FileOperationError, FileOperationEvent, FileOperationResult, FilePermission, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, hasFileAtomicReadCapability, hasFileFolderCopyCapability, hasFileReadStreamCapability, hasOpenReadWriteCloseCapability, hasReadWriteCapability, ICreateFileOptions, IFileContent, IFileService, IFileStat, IFileStatWithMetadata, IFileStreamContent, IFileSystemProvider, IFileSystemProviderActivationEvent, IFileSystemProviderCapabilitiesChangeEvent, IFileSystemProviderRegistrationEvent, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IReadFileOptions, IReadFileStreamOptions, IResolveFileOptions, IFileStatResult, IFileStatResultWithMetadata, IResolveMetadataFileOptions, IStat, IFileStatWithPartialMetadata, IWatchOptions, IWriteFileOptions, NotModifiedSinceFileOperationError, toFileOperationResult, toFileSystemProviderErrorCode, hasFileCloneCapability, TooLargeFileOperationError, hasFileAtomicDeleteCapability, hasFileAtomicWriteCapability, IWatchOptionsWithCorrelation, IFileSystemWatcher, IWatchOptionsWithoutCorrelation, hasFileRealpathCapability } from './files.js';
import { readFileIntoStream } from './io.js';
import { ILogService } from '../../log/common/log.js';
import { ErrorNoTelemetry } from '../../../base/common/errors.js';

export class FileService extends Disposable implements IFileService {

	declare readonly _serviceBrand: undefined;

	// Choose a buffer size that is a balance between memory needs and
	// manageable IPC overhead. The larger the buffer size, the less
	// roundtrips we have to do for reading/writing data.
	private readonly BUFFER_SIZE = 256 * 1024;

	constructor(@ILogService private readonly logService: ILogService) {
		super();
	}

	//#region File System Provider

	private readonly _onDidChangeFileSystemProviderRegistrations = this._register(new Emitter<IFileSystemProviderRegistrationEvent>());
	readonly onDidChangeFileSystemProviderRegistrations = this._onDidChangeFileSystemProviderRegistrations.event;

	private readonly _onWillActivateFileSystemProvider = this._register(new Emitter<IFileSystemProviderActivationEvent>());
	readonly onWillActivateFileSystemProvider = this._onWillActivateFileSystemProvider.event;

	private readonly _onDidChangeFileSystemProviderCapabilities = this._register(new Emitter<IFileSystemProviderCapabilitiesChangeEvent>());
	readonly onDidChangeFileSystemProviderCapabilities = this._onDidChangeFileSystemProviderCapabilities.event;

	private readonly provider = new Map<string, IFileSystemProvider>();

	registerProvider(scheme: string, provider: IFileSystemProvider): IDisposable {
		if (this.provider.has(scheme)) {
			throw new Error(`A filesystem provider for the scheme '${scheme}' is already registered.`);
		}

		mark(`code/registerFilesystem/${scheme}`);

		const providerDisposables = new DisposableStore();

		// Add provider with event
		this.provider.set(scheme, provider);
		this._onDidChangeFileSystemProviderRegistrations.fire({ added: true, scheme, provider });

		// Forward events from provider
		providerDisposables.add(provider.onDidChangeFile(changes => {
			const event = new FileChangesEvent(changes, !this.isPathCaseSensitive(provider));

			// Always emit any event internally
			this.internalOnDidFilesChange.fire(event);

			// Only emit uncorrelated events in the global `onDidFilesChange` event
			if (!event.hasCorrelation()) {
				this._onDidUncorrelatedFilesChange.fire(event);
			}
		}));
		if (typeof provider.onDidWatchError === 'function') {
			providerDisposables.add(provider.onDidWatchError(error => this._onDidWatchError.fire(new Error(error))));
		}
		providerDisposables.add(provider.onDidChangeCapabilities(() => this._onDidChangeFileSystemProviderCapabilities.fire({ provider, scheme })));

		return toDisposable(() => {
			this._onDidChangeFileSystemProviderRegistrations.fire({ added: false, scheme, provider });
			this.provider.delete(scheme);

			dispose(providerDisposables);
		});
	}

	getProvider(scheme: string): IFileSystemProvider | undefined {
		return this.provider.get(scheme);
	}

	async activateProvider(scheme: string): Promise<void> {

		// Emit an event that we are about to activate a provider with the given scheme.
		// Listeners can participate in the activation by registering a provider for it.
		const joiners: Promise<void>[] = [];
		this._onWillActivateFileSystemProvider.fire({
			scheme,
			join(promise) {
				joiners.push(promise);
			},
		});

		if (this.provider.has(scheme)) {
			return; // provider is already here so we can return directly
		}

		// If the provider is not yet there, make sure to join on the listeners assuming
		// that it takes a bit longer to register the file system provider.
		await Promises.settled(joiners);
	}

	async canHandleResource(resource: URI): Promise<boolean> {

		// Await activation of potentially extension contributed providers
		await this.activateProvider(resource.scheme);

		return this.hasProvider(resource);
	}

	hasProvider(resource: URI): boolean {
		return this.provider.has(resource.scheme);
	}

	hasCapability(resource: URI, capability: FileSystemProviderCapabilities): boolean {
		const provider = this.provider.get(resource.scheme);

		return !!(provider && (provider.capabilities & capability));
	}

	listCapabilities(): Iterable<{ scheme: string; capabilities: FileSystemProviderCapabilities }> {
		return Iterable.map(this.provider, ([scheme, provider]) => ({ scheme, capabilities: provider.capabilities }));
	}

	protected async withProvider(resource: URI): Promise<IFileSystemProvider> {

		// Assert path is absolute
		if (!isAbsolutePath(resource)) {
			throw new FileOperationError(localize('invalidPath', "Unable to resolve filesystem provider with relative file path '{0}'", this.resourceForError(resource)), FileOperationResult.FILE_INVALID_PATH);
		}

		// Activate provider
		await this.activateProvider(resource.scheme);

		// Assert provider
		const provider = this.provider.get(resource.scheme);
		if (!provider) {
			const error = new ErrorNoTelemetry();
			error.message = localize('noProviderFound', "ENOPRO: No file system provider found for resource '{0}'", resource.toString());

			throw error;
		}

		return provider;
	}

	private async withReadProvider(resource: URI): Promise<IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability | IFileSystemProviderWithFileReadStreamCapability> {
		const provider = await this.withProvider(resource);

		if (hasOpenReadWriteCloseCapability(provider) || hasReadWriteCapability(provider) || hasFileReadStreamCapability(provider)) {
			return provider;
		}

		throw new Error(`Filesystem provider for scheme '${resource.scheme}' neither has FileReadWrite, FileReadStream nor FileOpenReadWriteClose capability which is needed for the read operation.`);
	}

	private async withWriteProvider(resource: URI): Promise<IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability> {
		const provider = await this.withProvider(resource);

		if (hasOpenReadWriteCloseCapability(provider) || hasReadWriteCapability(provider)) {
			return provider;
		}

		throw new Error(`Filesystem provider for scheme '${resource.scheme}' neither has FileReadWrite nor FileOpenReadWriteClose capability which is needed for the write operation.`);
	}

	//#endregion

	//#region Operation events

	private readonly _onDidRunOperation = this._register(new Emitter<FileOperationEvent>());
	readonly onDidRunOperation = this._onDidRunOperation.event;

	//#endregion

	//#region File Metadata Resolving

	async resolve(resource: URI, options: IResolveMetadataFileOptions): Promise<IFileStatWithMetadata>;
	async resolve(resource: URI, options?: IResolveFileOptions): Promise<IFileStat>;
	async resolve(resource: URI, options?: IResolveFileOptions): Promise<IFileStat> {
		try {
			return await this.doResolveFile(resource, options);
		} catch (error) {

			// Specially handle file not found case as file operation result
			if (toFileSystemProviderErrorCode(error) === FileSystemProviderErrorCode.FileNotFound) {
				throw new FileOperationError(localize('fileNotFoundError', "Unable to resolve nonexistent file '{0}'", this.resourceForError(resource)), FileOperationResult.FILE_NOT_FOUND);
			}

			// Bubble up any other error as is
			throw ensureFileSystemProviderError(error);
		}
	}

	private async doResolveFile(resource: URI, options: IResolveMetadataFileOptions): Promise<IFileStatWithMetadata>;
	private async doResolveFile(resource: URI, options?: IResolveFileOptions): Promise<IFileStat>;
	private async doResolveFile(resource: URI, options?: IResolveFileOptions): Promise<IFileStat> {
		const provider = await this.withProvider(resource);
		const isPathCaseSensitive = this.isPathCaseSensitive(provider);

		const resolveTo = options?.resolveTo;
		const resolveSingleChildDescendants = options?.resolveSingleChildDescendants;
		const resolveMetadata = options?.resolveMetadata;

		const stat = await provider.stat(resource);

		let trie: TernarySearchTree<URI, boolean> | undefined;

		return this.toFileStat(provider, resource, stat, undefined, !!resolveMetadata, (stat, siblings) => {

			// lazy trie to check for recursive resolving
			if (!trie) {
				trie = TernarySearchTree.forUris<true>(() => !isPathCaseSensitive);
				trie.set(resource, true);
				if (resolveTo) {
					trie.fill(true, resolveTo);
				}
			}

			// check for recursive resolving
			if (trie.get(stat.resource) || trie.findSuperstr(stat.resource.with({ query: null, fragment: null } /* required for https://github.com/microsoft/vscode/issues/128151 */))) {
				return true;
			}

			// check for resolving single child folders
			if (stat.isDirectory && resolveSingleChildDescendants) {
				return siblings === 1;
			}

			return false;
		});
	}

	private async toFileStat(provider: IFileSystemProvider, resource: URI, stat: IStat | { type: FileType } & Partial<IStat>, siblings: number | undefined, resolveMetadata: boolean, recurse: (stat: IFileStat, siblings?: number) => boolean): Promise<IFileStat>;
	private async toFileStat(provider: IFileSystemProvider, resource: URI, stat: IStat, siblings: number | undefined, resolveMetadata: true, recurse: (stat: IFileStat, siblings?: number) => boolean): Promise<IFileStatWithMetadata>;
	private async toFileStat(provider: IFileSystemProvider, resource: URI, stat: IStat | { type: FileType } & Partial<IStat>, siblings: number | undefined, resolveMetadata: boolean, recurse: (stat: IFileStat, siblings?: number) => boolean): Promise<IFileStat> {
		const { providerExtUri } = this.getExtUri(provider);

		// convert to file stat
		const fileStat: IFileStat = {
			resource,
			name: providerExtUri.basename(resource),
			isFile: (stat.type & FileType.File) !== 0,
			isDirectory: (stat.type & FileType.Directory) !== 0,
			isSymbolicLink: (stat.type & FileType.SymbolicLink) !== 0,
			mtime: stat.mtime,
			ctime: stat.ctime,
			size: stat.size,
			readonly: Boolean((stat.permissions ?? 0) & FilePermission.Readonly) || Boolean(provider.capabilities & FileSystemProviderCapabilities.Readonly),
			locked: Boolean((stat.permissions ?? 0) & FilePermission.Locked),
			etag: etag({ mtime: stat.mtime, size: stat.size }),
			children: undefined
		};

		// check to recurse for directories
		if (fileStat.isDirectory && recurse(fileStat, siblings)) {
			try {
				const entries = await provider.readdir(resource);
				const resolvedEntries = await Promises.settled(entries.map(async ([name, type]) => {
					try {
						const childResource = providerExtUri.joinPath(resource, name);
						const childStat = resolveMetadata ? await provider.stat(childResource) : { type };

						return await this.toFileStat(provider, childResource, childStat, entries.length, resolveMetadata, recurse);
					} catch (error) {
						this.logService.trace(error);

						return null; // can happen e.g. due to permission errors
					}
				}));

				// make sure to get rid of null values that signal a failure to resolve a particular entry
				fileStat.children = coalesce(resolvedEntries);
			} catch (error) {
				this.logService.trace(error);

				fileStat.children = []; // gracefully handle errors, we may not have permissions to read
			}

			return fileStat;
		}

		return fileStat;
	}

	async resolveAll(toResolve: { resource: URI; options?: IResolveFileOptions }[]): Promise<IFileStatResult[]>;
	async resolveAll(toResolve: { resource: URI; options: IResolveMetadataFileOptions }[]): Promise<IFileStatResultWithMetadata[]>;
	async resolveAll(toResolve: { resource: URI; options?: IResolveFileOptions }[]): Promise<IFileStatResult[]> {
		return Promises.settled(toResolve.map(async entry => {
			try {
				return { stat: await this.doResolveFile(entry.resource, entry.options), success: true };
			} catch (error) {
				this.logService.trace(error);

				return { stat: undefined, success: false };
			}
		}));
	}

	async stat(resource: URI): Promise<IFileStatWithPartialMetadata> {
		const provider = await this.withProvider(resource);

		const stat = await provider.stat(resource);

		return this.toFileStat(provider, resource, stat, undefined, true, () => false /* Do not resolve any children */);
	}

	async realpath(resource: URI): Promise<URI | undefined> {
		const provider = await this.withProvider(resource);

		if (hasFileRealpathCapability(provider)) {
			const realpath = await provider.realpath(resource);

			return resource.with({ path: realpath });
		}

		return undefined;
	}

	async exists(resource: URI): Promise<boolean> {
		const provider = await this.withProvider(resource);

		try {
			const stat = await provider.stat(resource);

			return !!stat;
		} catch (error) {
			return false;
		}
	}

	//#endregion

	//#region File Reading/Writing

	async canCreateFile(resource: URI, options?: ICreateFileOptions): Promise<Error | true> {
		try {
			await this.doValidateCreateFile(resource, options);
		} catch (error) {
			return error;
		}

		return true;
	}

	private async doValidateCreateFile(resource: URI, options?: ICreateFileOptions): Promise<void> {

		// validate overwrite
		if (!options?.overwrite && await this.exists(resource)) {
			throw new FileOperationError(localize('fileExists', "Unable to create file '{0}' that already exists when overwrite flag is not set", this.resourceForError(resource)), FileOperationResult.FILE_MODIFIED_SINCE, options);
		}
	}

	async createFile(resource: URI, bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream = VSBuffer.fromString(''), options?: ICreateFileOptions): Promise<IFileStatWithMetadata> {

		// validate
		await this.doValidateCreateFile(resource, options);

		// do write into file (this will create it too)
		const fileStat = await this.writeFile(resource, bufferOrReadableOrStream);

		// events
		this._onDidRunOperation.fire(new FileOperationEvent(resource, FileOperation.CREATE, fileStat));

		return fileStat;
	}

	async writeFile(resource: URI, bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		const provider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(resource), resource);
		const { providerExtUri } = this.getExtUri(provider);

		let writeFileOptions = options;
		if (hasFileAtomicWriteCapability(provider) && !writeFileOptions?.atomic) {
			const enforcedAtomicWrite = provider.enforceAtomicWriteFile?.(resource);
			if (enforcedAtomicWrite) {
				writeFileOptions = { ...options, atomic: enforcedAtomicWrite };
			}
		}

		try {

			// validate write (this may already return a peeked-at buffer)
			let { stat, buffer: bufferOrReadableOrStreamOrBufferedStream } = await this.validateWriteFile(provider, resource, bufferOrReadableOrStream, writeFileOptions);

			// mkdir recursively as needed
			if (!stat) {
				await this.mkdirp(provider, providerExtUri.dirname(resource));
			}

			// optimization: if the provider has unbuffered write capability and the data
			// to write is not a buffer, we consume up to 3 chunks and try to write the data
			// unbuffered to reduce the overhead. If the stream or readable has more data
			// to provide we continue to write buffered.
			if (!bufferOrReadableOrStreamOrBufferedStream) {
				bufferOrReadableOrStreamOrBufferedStream = await this.peekBufferForWriting(provider, bufferOrReadableOrStream);
			}

			// write file: unbuffered
			if (
				!hasOpenReadWriteCloseCapability(provider) ||																// buffered writing is unsupported
				(hasReadWriteCapability(provider) && bufferOrReadableOrStreamOrBufferedStream instanceof VSBuffer) ||		// data is a full buffer already
				(hasReadWriteCapability(provider) && hasFileAtomicWriteCapability(provider) && writeFileOptions?.atomic)	// atomic write forces unbuffered write if the provider supports it
			) {
				await this.doWriteUnbuffered(provider, resource, writeFileOptions, bufferOrReadableOrStreamOrBufferedStream);
			}

			// write file: buffered
			else {
				await this.doWriteBuffered(provider, resource, writeFileOptions, bufferOrReadableOrStreamOrBufferedStream instanceof VSBuffer ? bufferToReadable(bufferOrReadableOrStreamOrBufferedStream) : bufferOrReadableOrStreamOrBufferedStream);
			}

			// events
			this._onDidRunOperation.fire(new FileOperationEvent(resource, FileOperation.WRITE));
		} catch (error) {
			throw new FileOperationError(localize('err.write', "Unable to write file '{0}' ({1})", this.resourceForError(resource), ensureFileSystemProviderError(error).toString()), toFileOperationResult(error), writeFileOptions);
		}

		return this.resolve(resource, { resolveMetadata: true });
	}


	private async peekBufferForWriting(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability, bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream): Promise<VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream> {
		let peekResult: VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream;
		if (hasReadWriteCapability(provider) && !(bufferOrReadableOrStream instanceof VSBuffer)) {
			if (isReadableStream(bufferOrReadableOrStream)) {
				const bufferedStream = await peekStream(bufferOrReadableOrStream, 3);
				if (bufferedStream.ended) {
					peekResult = VSBuffer.concat(bufferedStream.buffer);
				} else {
					peekResult = bufferedStream;
				}
			} else {
				peekResult = peekReadable(bufferOrReadableOrStream, data => VSBuffer.concat(data), 3);
			}
		} else {
			peekResult = bufferOrReadableOrStream;
		}

		return peekResult;
	}

	private async validateWriteFile(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability, resource: URI, bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<{ stat: IStat | undefined; buffer: VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream | undefined }> {

		// Validate unlock support
		const unlock = !!options?.unlock;
		if (unlock && !(provider.capabilities & FileSystemProviderCapabilities.FileWriteUnlock)) {
			throw new Error(localize('writeFailedUnlockUnsupported', "Unable to unlock file '{0}' because provider does not support it.", this.resourceForError(resource)));
		}

		// Validate atomic support
		const atomic = !!options?.atomic;
		if (atomic) {
			if (!(provider.capabilities & FileSystemProviderCapabilities.FileAtomicWrite)) {
				throw new Error(localize('writeFailedAtomicUnsupported1', "Unable to atomically write file '{0}' because provider does not support it.", this.resourceForError(resource)));
			}

			if (!(provider.capabilities & FileSystemProviderCapabilities.FileReadWrite)) {
				throw new Error(localize('writeFailedAtomicUnsupported2', "Unable to atomically write file '{0}' because provider does not support unbuffered writes.", this.resourceForError(resource)));
			}

			if (unlock) {
				throw new Error(localize('writeFailedAtomicUnlock', "Unable to unlock file '{0}' because atomic write is enabled.", this.resourceForError(resource)));
			}
		}

		// Validate via file stat meta data
		let stat: IStat | undefined = undefined;
		try {
			stat = await provider.stat(resource);
		} catch (error) {
			return Object.create(null); // file might not exist
		}

		// File cannot be directory
		if ((stat.type & FileType.Directory) !== 0) {
			throw new FileOperationError(localize('fileIsDirectoryWriteError', "Unable to write file '{0}' that is actually a directory", this.resourceForError(resource)), FileOperationResult.FILE_IS_DIRECTORY, options);
		}

		// File cannot be readonly
		this.throwIfFileIsReadonly(resource, stat);

		// Dirty write prevention: if the file on disk has been changed and does not match our expected
		// mtime and etag, we bail out to prevent dirty writing.
		//
		// First, we check for a mtime that is in the future before we do more checks. The assumption is
		// that only the mtime is an indicator for a file that has changed on disk.
		//
		// Second, if the mtime has advanced, we compare the size of the file on disk with our previous
		// one using the etag() function. Relying only on the mtime check has prooven to produce false
		// positives due to file system weirdness (especially around remote file systems). As such, the
		// check for size is a weaker check because it can return a false negative if the file has changed
		// but to the same length. This is a compromise we take to avoid having to produce checksums of
		// the file content for comparison which would be much slower to compute.
		//
		// Third, if the etag() turns out to be different, we do one attempt to compare the buffer we
		// are about to write with the contents on disk to figure out if the contents are identical.
		// In that case we allow the writing as it would result in the same contents in the file.
		let buffer: VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream | undefined;
		if (
			typeof options?.mtime === 'number' && typeof options.etag === 'string' && options.etag !== ETAG_DISABLED &&
			typeof stat.mtime === 'number' && typeof stat.size === 'number' &&
			options.mtime < stat.mtime && options.etag !== etag({ mtime: options.mtime /* not using stat.mtime for a reason, see above */, size: stat.size })
		) {
			buffer = await this.peekBufferForWriting(provider, bufferOrReadableOrStream);
			if (buffer instanceof VSBuffer && buffer.byteLength === stat.size) {
				try {
					const { value } = await this.readFile(resource, { limits: { size: stat.size } });
					if (buffer.equals(value)) {
						return { stat, buffer }; // allow writing since contents are identical
					}
				} catch (error) {
					// ignore, throw the FILE_MODIFIED_SINCE error
				}
			}

			throw new FileOperationError(localize('fileModifiedError', "File Modified Since"), FileOperationResult.FILE_MODIFIED_SINCE, options);
		}

		return { stat, buffer };
	}

	async readFile(resource: URI, options?: IReadFileOptions, token?: CancellationToken): Promise<IFileContent> {
		const provider = await this.withReadProvider(resource);

		if (options?.atomic) {
			return this.doReadFileAtomic(provider, resource, options, token);
		}

		return this.doReadFile(provider, resource, options, token);
	}

	private async doReadFileAtomic(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability | IFileSystemProviderWithFileReadStreamCapability, resource: URI, options?: IReadFileOptions, token?: CancellationToken): Promise<IFileContent> {
		return new Promise<IFileContent>((resolve, reject) => {
			this.writeQueue.queueFor(resource, async () => {
				try {
					const content = await this.doReadFile(provider, resource, options, token);
					resolve(content);
				} catch (error) {
					reject(error);
				}
			}, this.getExtUri(provider).providerExtUri);
		});
	}

	private async doReadFile(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability | IFileSystemProviderWithFileReadStreamCapability, resource: URI, options?: IReadFileOptions, token?: CancellationToken): Promise<IFileContent> {
		const stream = await this.doReadFileStream(provider, resource, {
			...options,
			// optimization: since we know that the caller does not
			// care about buffering, we indicate this to the reader.
			// this reduces all the overhead the buffered reading
			// has (open, read, close) if the provider supports
			// unbuffered reading.
			preferUnbuffered: true
		}, token);

		return {
			...stream,
			value: await streamToBuffer(stream.value)
		};
	}

	async readFileStream(resource: URI, options?: IReadFileStreamOptions, token?: CancellationToken): Promise<IFileStreamContent> {
		const provider = await this.withReadProvider(resource);

		return this.doReadFileStream(provider, resource, options, token);
	}

	private async doReadFileStream(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithOpenReadWriteCloseCapability | IFileSystemProviderWithFileReadStreamCapability, resource: URI, options?: IReadFileOptions & IReadFileStreamOptions & { preferUnbuffered?: boolean }, token?: CancellationToken): Promise<IFileStreamContent> {

		// install a cancellation token that gets cancelled
		// when any error occurs. this allows us to resolve
		// the content of the file while resolving metadata
		// but still cancel the operation in certain cases.
		//
		// in addition, we pass the optional token in that
		// we got from the outside to even allow for external
		// cancellation of the read operation.
		const cancellableSource = new CancellationTokenSource(token);

		let readFileOptions = options;
		if (hasFileAtomicReadCapability(provider) && provider.enforceAtomicReadFile?.(resource)) {
			readFileOptions = { ...options, atomic: true };
		}

		// validate read operation
		const statPromise = this.validateReadFile(resource, readFileOptions).then(stat => stat, error => {
			cancellableSource.dispose(true);

			throw error;
		});

		let fileStream: VSBufferReadableStream | undefined = undefined;
		try {

			// if the etag is provided, we await the result of the validation
			// due to the likelihood of hitting a NOT_MODIFIED_SINCE result.
			// otherwise, we let it run in parallel to the file reading for
			// optimal startup performance.
			if (typeof readFileOptions?.etag === 'string' && readFileOptions.etag !== ETAG_DISABLED) {
				await statPromise;
			}

			// read unbuffered
			if (
				(readFileOptions?.atomic && hasFileAtomicReadCapability(provider)) ||								// atomic reads are always unbuffered
				!(hasOpenReadWriteCloseCapability(provider) || hasFileReadStreamCapability(provider)) ||	// provider has no buffered capability
				(hasReadWriteCapability(provider) && readFileOptions?.preferUnbuffered)								// unbuffered read is preferred
			) {
				fileStream = this.readFileUnbuffered(provider, resource, readFileOptions);
			}

			// read streamed (always prefer over primitive buffered read)
			else if (hasFileReadStreamCapability(provider)) {
				fileStream = this.readFileStreamed(provider, resource, cancellableSource.token, readFileOptions);
			}

			// read buffered
			else {
				fileStream = this.readFileBuffered(provider, resource, cancellableSource.token, readFileOptions);
			}

			fileStream.on('end', () => cancellableSource.dispose());
			fileStream.on('error', () => cancellableSource.dispose());

			const fileStat = await statPromise;

			return {
				...fileStat,
				value: fileStream
			};
		} catch (error) {

			// Await the stream to finish so that we exit this method
			// in a consistent state with file handles closed
			// (https://github.com/microsoft/vscode/issues/114024)
			if (fileStream) {
				await consumeStream(fileStream);
			}

			// Re-throw errors as file operation errors but preserve
			// specific errors (such as not modified since)
			throw this.restoreReadError(error, resource, readFileOptions);
		}
	}

	private restoreReadError(error: Error, resource: URI, options?: IReadFileStreamOptions): FileOperationError {
		const message = localize('err.read', "Unable to read file '{0}' ({1})", this.resourceForError(resource), ensureFileSystemProviderError(error).toString());

		if (error instanceof NotModifiedSinceFileOperationError) {
			return new NotModifiedSinceFileOperationError(message, error.stat, options);
		}

		if (error instanceof TooLargeFileOperationError) {
			return new TooLargeFileOperationError(message, error.fileOperationResult, error.size, error.options as IReadFileOptions);
		}

		return new FileOperationError(message, toFileOperationResult(error), options);
	}

	private readFileStreamed(provider: IFileSystemProviderWithFileReadStreamCapability, resource: URI, token: CancellationToken, options: IReadFileStreamOptions = Object.create(null)): VSBufferReadableStream {
		const fileStream = provider.readFileStream(resource, options, token);

		return transform(fileStream, {
			data: data => data instanceof VSBuffer ? data : VSBuffer.wrap(data),
			error: error => this.restoreReadError(error, resource, options)
		}, data => VSBuffer.concat(data));
	}

	private readFileBuffered(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, resource: URI, token: CancellationToken, options: IReadFileStreamOptions = Object.create(null)): VSBufferReadableStream {
		const stream = newWriteableBufferStream();

		readFileIntoStream(provider, resource, stream, data => data, {
			...options,
			bufferSize: this.BUFFER_SIZE,
			errorTransformer: error => this.restoreReadError(error, resource, options)
		}, token);

		return stream;
	}

	private readFileUnbuffered(provider: IFileSystemProviderWithFileReadWriteCapability | IFileSystemProviderWithFileAtomicReadCapability, resource: URI, options?: IReadFileOptions & IReadFileStreamOptions): VSBufferReadableStream {
		const stream = newWriteableStream<VSBuffer>(data => VSBuffer.concat(data));

		// Read the file into the stream async but do not wait for
		// this to complete because streams work via events
		(async () => {
			try {
				let buffer: Uint8Array;
				if (options?.atomic && hasFileAtomicReadCapability(provider)) {
					buffer = await provider.readFile(resource, { atomic: true });
				} else {
					buffer = await provider.readFile(resource);
				}

				// respect position option
				if (typeof options?.position === 'number') {
					buffer = buffer.slice(options.position);
				}

				// respect length option
				if (typeof options?.length === 'number') {
					buffer = buffer.slice(0, options.length);
				}

				// Throw if file is too large to load
				this.validateReadFileLimits(resource, buffer.byteLength, options);

				// End stream with data
				stream.end(VSBuffer.wrap(buffer));
			} catch (err) {
				stream.error(err);
				stream.end();
			}
		})();

		return stream;
	}

	private async validateReadFile(resource: URI, options?: IReadFileStreamOptions): Promise<IFileStatWithMetadata> {
		const stat = await this.resolve(resource, { resolveMetadata: true });

		// Throw if resource is a directory
		if (stat.isDirectory) {
			throw new FileOperationError(localize('fileIsDirectoryReadError', "Unable to read file '{0}' that is actually a directory", this.resourceForError(resource)), FileOperationResult.FILE_IS_DIRECTORY, options);
		}

		// Throw if file not modified since (unless disabled)
		if (typeof options?.etag === 'string' && options.etag !== ETAG_DISABLED && options.etag === stat.etag) {
			throw new NotModifiedSinceFileOperationError(localize('fileNotModifiedError', "File not modified since"), stat, options);
		}

		// Throw if file is too large to load
		this.validateReadFileLimits(resource, stat.size, options);

		return stat;
	}

	private validateReadFileLimits(resource: URI, size: number, options?: IReadFileStreamOptions): void {
		if (typeof options?.limits?.size === 'number' && size > options.limits.size) {
			throw new TooLargeFileOperationError(localize('fileTooLargeError', "Unable to read file '{0}' that is too large to open", this.resourceForError(resource)), FileOperationResult.FILE_TOO_LARGE, size, options);
		}
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	async canMove(source: URI, target: URI, overwrite?: boolean): Promise<Error | true> {
		return this.doCanMoveCopy(source, target, 'move', overwrite);
	}

	async canCopy(source: URI, target: URI, overwrite?: boolean): Promise<Error | true> {
		return this.doCanMoveCopy(source, target, 'copy', overwrite);
	}

	private async doCanMoveCopy(source: URI, target: URI, mode: 'move' | 'copy', overwrite?: boolean): Promise<Error | true> {
		if (source.toString() !== target.toString()) {
			try {
				const sourceProvider = mode === 'move' ? this.throwIfFileSystemIsReadonly(await this.withWriteProvider(source), source) : await this.withReadProvider(source);
				const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);

				await this.doValidateMoveCopy(sourceProvider, source, targetProvider, target, mode, overwrite);
			} catch (error) {
				return error;
			}
		}

		return true;
	}

	async move(source: URI, target: URI, overwrite?: boolean): Promise<IFileStatWithMetadata> {
		const sourceProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(source), source);
		const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);

		// move
		const mode = await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'move', !!overwrite);

		// resolve and send events
		const fileStat = await this.resolve(target, { resolveMetadata: true });
		this._onDidRunOperation.fire(new FileOperationEvent(source, mode === 'move' ? FileOperation.MOVE : FileOperation.COPY, fileStat));

		return fileStat;
	}

	async copy(source: URI, target: URI, overwrite?: boolean): Promise<IFileStatWithMetadata> {
		const sourceProvider = await this.withReadProvider(source);
		const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);

		// copy
		const mode = await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'copy', !!overwrite);

		// resolve and send events
		const fileStat = await this.resolve(target, { resolveMetadata: true });
		this._onDidRunOperation.fire(new FileOperationEvent(source, mode === 'copy' ? FileOperation.COPY : FileOperation.MOVE, fileStat));

		return fileStat;
	}

	private async doMoveCopy(sourceProvider: IFileSystemProvider, source: URI, targetProvider: IFileSystemProvider, target: URI, mode: 'move' | 'copy', overwrite: boolean): Promise<'move' | 'copy'> {
		if (source.toString() === target.toString()) {
			return mode; // simulate node.js behaviour here and do a no-op if paths match
		}

		// validation
		const { exists, isSameResourceWithDifferentPathCase } = await this.doValidateMoveCopy(sourceProvider, source, targetProvider, target, mode, overwrite);

		// delete as needed (unless target is same resurce with different path case)
		if (exists && !isSameResourceWithDifferentPathCase && overwrite) {
			await this.del(target, { recursive: true });
		}

		// create parent folders
		await this.mkdirp(targetProvider, this.getExtUri(targetProvider).providerExtUri.dirname(target));

		// copy source => target
		if (mode === 'copy') {

			// same provider with fast copy: leverage copy() functionality
			if (sourceProvider === targetProvider && hasFileFolderCopyCapability(sourceProvider)) {
				await sourceProvider.copy(source, target, { overwrite });
			}

			// when copying via buffer/unbuffered, we have to manually
			// traverse the source if it is a folder and not a file
			else {
				const sourceFile = await this.resolve(source);
				if (sourceFile.isDirectory) {
					await this.doCopyFolder(sourceProvider, sourceFile, targetProvider, target);
				} else {
					await this.doCopyFile(sourceProvider, source, targetProvider, target);
				}
			}

			return mode;
		}

		// move source => target
		else {

			// same provider: leverage rename() functionality
			if (sourceProvider === targetProvider) {
				await sourceProvider.rename(source, target, { overwrite });

				return mode;
			}

			// across providers: copy to target & delete at source
			else {
				await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'copy', overwrite);
				await this.del(source, { recursive: true });

				return 'copy';
			}
		}
	}

	private async doCopyFile(sourceProvider: IFileSystemProvider, source: URI, targetProvider: IFileSystemProvider, target: URI): Promise<void> {

		// copy: source (buffered) => target (buffered)
		if (hasOpenReadWriteCloseCapability(sourceProvider) && hasOpenReadWriteCloseCapability(targetProvider)) {
			return this.doPipeBuffered(sourceProvider, source, targetProvider, target);
		}

		// copy: source (buffered) => target (unbuffered)
		if (hasOpenReadWriteCloseCapability(sourceProvider) && hasReadWriteCapability(targetProvider)) {
			return this.doPipeBufferedToUnbuffered(sourceProvider, source, targetProvider, target);
		}

		// copy: source (unbuffered) => target (buffered)
		if (hasReadWriteCapability(sourceProvider) && hasOpenReadWriteCloseCapability(targetProvider)) {
			return this.doPipeUnbufferedToBuffered(sourceProvider, source, targetProvider, target);
		}

		// copy: source (unbuffered) => target (unbuffered)
		if (hasReadWriteCapability(sourceProvider) && hasReadWriteCapability(targetProvider)) {
			return this.doPipeUnbuffered(sourceProvider, source, targetProvider, target);
		}
	}

	private async doCopyFolder(sourceProvider: IFileSystemProvider, sourceFolder: IFileStat, targetProvider: IFileSystemProvider, targetFolder: URI): Promise<void> {

		// create folder in target
		await targetProvider.mkdir(targetFolder);

		// create children in target
		if (Array.isArray(sourceFolder.children)) {
			await Promises.settled(sourceFolder.children.map(async sourceChild => {
				const targetChild = this.getExtUri(targetProvider).providerExtUri.joinPath(targetFolder, sourceChild.name);
				if (sourceChild.isDirectory) {
					return this.doCopyFolder(sourceProvider, await this.resolve(sourceChild.resource), targetProvider, targetChild);
				} else {
					return this.doCopyFile(sourceProvider, sourceChild.resource, targetProvider, targetChild);
				}
			}));
		}
	}

	private async doValidateMoveCopy(sourceProvider: IFileSystemProvider, source: URI, targetProvider: IFileSystemProvider, target: URI, mode: 'move' | 'copy', overwrite?: boolean): Promise<{ exists: boolean; isSameResourceWithDifferentPathCase: boolean }> {
		let isSameResourceWithDifferentPathCase = false;

		// Check if source is equal or parent to target (requires providers to be the same)
		if (sourceProvider === targetProvider) {
			const { providerExtUri, isPathCaseSensitive } = this.getExtUri(sourceProvider);
			if (!isPathCaseSensitive) {
				isSameResourceWithDifferentPathCase = providerExtUri.isEqual(source, target);
			}

			if (isSameResourceWithDifferentPathCase && mode === 'copy') {
				throw new Error(localize('unableToMoveCopyError1', "Unable to copy when source '{0}' is same as target '{1}' with different path case on a case insensitive file system", this.resourceForError(source), this.resourceForError(target)));
			}

			if (!isSameResourceWithDifferentPathCase && providerExtUri.isEqualOrParent(target, source)) {
				throw new Error(localize('unableToMoveCopyError2', "Unable to move/copy when source '{0}' is parent of target '{1}'.", this.resourceForError(source), this.resourceForError(target)));
			}
		}

		// Extra checks if target exists and this is not a rename
		const exists = await this.exists(target);
		if (exists && !isSameResourceWithDifferentPathCase) {

			// Bail out if target exists and we are not about to overwrite
			if (!overwrite) {
				throw new FileOperationError(localize('unableToMoveCopyError3', "Unable to move/copy '{0}' because target '{1}' already exists at destination.", this.resourceForError(source), this.resourceForError(target)), FileOperationResult.FILE_MOVE_CONFLICT);
			}

			// Special case: if the target is a parent of the source, we cannot delete
			// it as it would delete the source as well. In this case we have to throw
			if (sourceProvider === targetProvider) {
				const { providerExtUri } = this.getExtUri(sourceProvider);
				if (providerExtUri.isEqualOrParent(source, target)) {
					throw new Error(localize('unableToMoveCopyError4', "Unable to move/copy '{0}' into '{1}' since a file would replace the folder it is contained in.", this.resourceForError(source), this.resourceForError(target)));
				}
			}
		}

		return { exists, isSameResourceWithDifferentPathCase };
	}

	private getExtUri(provider: IFileSystemProvider): { providerExtUri: IExtUri; isPathCaseSensitive: boolean } {
		const isPathCaseSensitive = this.isPathCaseSensitive(provider);

		return {
			providerExtUri: isPathCaseSensitive ? extUri : extUriIgnorePathCase,
			isPathCaseSensitive
		};
	}

	private isPathCaseSensitive(provider: IFileSystemProvider): boolean {
		return !!(provider.capabilities & FileSystemProviderCapabilities.PathCaseSensitive);
	}

	async createFolder(resource: URI): Promise<IFileStatWithMetadata> {
		const provider = this.throwIfFileSystemIsReadonly(await this.withProvider(resource), resource);

		// mkdir recursively
		await this.mkdirp(provider, resource);

		// events
		const fileStat = await this.resolve(resource, { resolveMetadata: true });
		this._onDidRunOperation.fire(new FileOperationEvent(resource, FileOperation.CREATE, fileStat));

		return fileStat;
	}

	private async mkdirp(provider: IFileSystemProvider, directory: URI): Promise<void> {
		const directoriesToCreate: string[] = [];

		// mkdir until we reach root
		const { providerExtUri } = this.getExtUri(provider);
		while (!providerExtUri.isEqual(directory, providerExtUri.dirname(directory))) {
			try {
				const stat = await provider.stat(directory);
				if ((stat.type & FileType.Directory) === 0) {
					throw new Error(localize('mkdirExistsError', "Unable to create folder '{0}' that already exists but is not a directory", this.resourceForError(directory)));
				}

				break; // we have hit a directory that exists -> good
			} catch (error) {

				// Bubble up any other error that is not file not found
				if (toFileSystemProviderErrorCode(error) !== FileSystemProviderErrorCode.FileNotFound) {
					throw error;
				}

				// Upon error, remember directories that need to be created
				directoriesToCreate.push(providerExtUri.basename(directory));

				// Continue up
				directory = providerExtUri.dirname(directory);
			}
		}

		// Create directories as needed
		for (let i = directoriesToCreate.length - 1; i >= 0; i--) {
			directory = providerExtUri.joinPath(directory, directoriesToCreate[i]);

			try {
				await provider.mkdir(directory);
			} catch (error) {
				if (toFileSystemProviderErrorCode(error) !== FileSystemProviderErrorCode.FileExists) {
					// For mkdirp() we tolerate that the mkdir() call fails
					// in case the folder already exists. This follows node.js
					// own implementation of fs.mkdir({ recursive: true }) and
					// reduces the chances of race conditions leading to errors
					// if multiple calls try to create the same folders
					// As such, we only throw an error here if it is other than
					// the fact that the file already exists.
					// (see also https://github.com/microsoft/vscode/issues/89834)
					throw error;
				}
			}
		}
	}

	async canDelete(resource: URI, options?: Partial<IFileDeleteOptions>): Promise<Error | true> {
		try {
			await this.doValidateDelete(resource, options);
		} catch (error) {
			return error;
		}

		return true;
	}

	private async doValidateDelete(resource: URI, options?: Partial<IFileDeleteOptions>): Promise<IFileSystemProvider> {
		const provider = this.throwIfFileSystemIsReadonly(await this.withProvider(resource), resource);

		// Validate trash support
		const useTrash = !!options?.useTrash;
		if (useTrash && !(provider.capabilities & FileSystemProviderCapabilities.Trash)) {
			throw new Error(localize('deleteFailedTrashUnsupported', "Unable to delete file '{0}' via trash because provider does not support it.", this.resourceForError(resource)));
		}

		// Validate atomic support
		const atomic = options?.atomic;
		if (atomic && !(provider.capabilities & FileSystemProviderCapabilities.FileAtomicDelete)) {
			throw new Error(localize('deleteFailedAtomicUnsupported', "Unable to delete file '{0}' atomically because provider does not support it.", this.resourceForError(resource)));
		}

		if (useTrash && atomic) {
			throw new Error(localize('deleteFailedTrashAndAtomicUnsupported', "Unable to atomically delete file '{0}' because using trash is enabled.", this.resourceForError(resource)));
		}

		// Validate delete
		let stat: IStat | undefined = undefined;
		try {
			stat = await provider.stat(resource);
		} catch (error) {
			// Handled later
		}

		if (stat) {
			this.throwIfFileIsReadonly(resource, stat);
		} else {
			throw new FileOperationError(localize('deleteFailedNotFound', "Unable to delete nonexistent file '{0}'", this.resourceForError(resource)), FileOperationResult.FILE_NOT_FOUND);
		}

		// Validate recursive
		const recursive = !!options?.recursive;
		if (!recursive) {
			const stat = await this.resolve(resource);
			if (stat.isDirectory && Array.isArray(stat.children) && stat.children.length > 0) {
				throw new Error(localize('deleteFailedNonEmptyFolder', "Unable to delete non-empty folder '{0}'.", this.resourceForError(resource)));
			}
		}

		return provider;
	}

	async del(resource: URI, options?: Partial<IFileDeleteOptions>): Promise<void> {
		const provider = await this.doValidateDelete(resource, options);

		let deleteFileOptions = options;
		if (hasFileAtomicDeleteCapability(provider) && !deleteFileOptions?.atomic) {
			const enforcedAtomicDelete = provider.enforceAtomicDelete?.(resource);
			if (enforcedAtomicDelete) {
				deleteFileOptions = { ...options, atomic: enforcedAtomicDelete };
			}
		}

		const useTrash = !!deleteFileOptions?.useTrash;
		const recursive = !!deleteFileOptions?.recursive;
		const atomic = deleteFileOptions?.atomic ?? false;

		// Delete through provider
		await provider.delete(resource, { recursive, useTrash, atomic });

		// Events
		this._onDidRunOperation.fire(new FileOperationEvent(resource, FileOperation.DELETE));
	}

	//#endregion

	//#region Clone File

	async cloneFile(source: URI, target: URI): Promise<void> {
		const sourceProvider = await this.withProvider(source);
		const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);

		if (sourceProvider === targetProvider && this.getExtUri(sourceProvider).providerExtUri.isEqual(source, target)) {
			return; // return early if paths are equal
		}

		// same provider, use `cloneFile` when native support is provided
		if (sourceProvider === targetProvider && hasFileCloneCapability(sourceProvider)) {
			return sourceProvider.cloneFile(source, target);
		}

		// otherwise, either providers are different or there is no native
		// `cloneFile` support, then we fallback to emulate a clone as best
		// as we can with the other primitives

		// create parent folders
		await this.mkdirp(targetProvider, this.getExtUri(targetProvider).providerExtUri.dirname(target));

		// leverage `copy` method if provided and providers are identical
		// queue on the source to ensure atomic read
		if (sourceProvider === targetProvider && hasFileFolderCopyCapability(sourceProvider)) {
			return this.writeQueue.queueFor(source, () => sourceProvider.copy(source, target, { overwrite: true }), this.getExtUri(sourceProvider).providerExtUri);
		}

		// otherwise copy via buffer/unbuffered and use a write queue
		// on the source to ensure atomic operation as much as possible
		return this.writeQueue.queueFor(source, () => this.doCopyFile(sourceProvider, source, targetProvider, target), this.getExtUri(sourceProvider).providerExtUri);
	}

	//#endregion

	//#region File Watching

	private readonly internalOnDidFilesChange = this._register(new Emitter<FileChangesEvent>());

	private readonly _onDidUncorrelatedFilesChange = this._register(new Emitter<FileChangesEvent>());
	readonly onDidFilesChange = this._onDidUncorrelatedFilesChange.event; // global `onDidFilesChange` skips correlated events

	private readonly _onDidWatchError = this._register(new Emitter<Error>());
	readonly onDidWatchError = this._onDidWatchError.event;

	private readonly activeWatchers = new Map<number /* watch request hash */, { disposable: IDisposable; count: number }>();

	private static WATCHER_CORRELATION_IDS = 0;

	createWatcher(resource: URI, options: IWatchOptionsWithoutCorrelation & { recursive: false }): IFileSystemWatcher {
		return this.watch(resource, {
			...options,
			// Explicitly set a correlation id so that file events that originate
			// from requests from extensions are exclusively routed back to the
			// extension host and not into the workbench.
			correlationId: FileService.WATCHER_CORRELATION_IDS++
		});
	}

	watch(resource: URI, options: IWatchOptionsWithCorrelation): IFileSystemWatcher;
	watch(resource: URI, options?: IWatchOptionsWithoutCorrelation): IDisposable;
	watch(resource: URI, options: IWatchOptions = { recursive: false, excludes: [] }): IFileSystemWatcher | IDisposable {
		const disposables = new DisposableStore();

		// Forward watch request to provider and wire in disposables
		let watchDisposed = false;
		let disposeWatch = () => { watchDisposed = true; };
		disposables.add(toDisposable(() => disposeWatch()));

		// Watch and wire in disposable which is async but
		// check if we got disposed meanwhile and forward
		(async () => {
			try {
				const disposable = await this.doWatch(resource, options);
				if (watchDisposed) {
					dispose(disposable);
				} else {
					disposeWatch = () => dispose(disposable);
				}
			} catch (error) {
				this.logService.error(error);
			}
		})();

		// When a correlation identifier is set, return a specific
		// watcher that only emits events matching that correalation.
		const correlationId = options.correlationId;
		if (typeof correlationId === 'number') {
			const fileChangeEmitter = disposables.add(new Emitter<FileChangesEvent>());
			disposables.add(this.internalOnDidFilesChange.event(e => {
				if (e.correlates(correlationId)) {
					fileChangeEmitter.fire(e);
				}
			}));

			const watcher: IFileSystemWatcher = {
				onDidChange: fileChangeEmitter.event,
				dispose: () => disposables.dispose()
			};

			return watcher;
		}

		return disposables;
	}

	private async doWatch(resource: URI, options: IWatchOptions): Promise<IDisposable> {
		const provider = await this.withProvider(resource);

		// Deduplicate identical watch requests
		const watchHash = hash([this.getExtUri(provider).providerExtUri.getComparisonKey(resource), options]);
		let watcher = this.activeWatchers.get(watchHash);
		if (!watcher) {
			watcher = {
				count: 0,
				disposable: provider.watch(resource, options)
			};

			this.activeWatchers.set(watchHash, watcher);
		}

		// Increment usage counter
		watcher.count += 1;

		return toDisposable(() => {
			if (watcher) {

				// Unref
				watcher.count--;

				// Dispose only when last user is reached
				if (watcher.count === 0) {
					dispose(watcher.disposable);
					this.activeWatchers.delete(watchHash);
				}
			}
		});
	}

	override dispose(): void {
		super.dispose();

		for (const [, watcher] of this.activeWatchers) {
			dispose(watcher.disposable);
		}

		this.activeWatchers.clear();
	}

	//#endregion

	//#region Helpers

	private readonly writeQueue = this._register(new ResourceQueue());

	private async doWriteBuffered(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, resource: URI, options: IWriteFileOptions | undefined, readableOrStreamOrBufferedStream: VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream): Promise<void> {
		return this.writeQueue.queueFor(resource, async () => {

			// open handle
			const handle = await provider.open(resource, { create: true, unlock: options?.unlock ?? false });

			// write into handle until all bytes from buffer have been written
			try {
				if (isReadableStream(readableOrStreamOrBufferedStream) || isReadableBufferedStream(readableOrStreamOrBufferedStream)) {
					await this.doWriteStreamBufferedQueued(provider, handle, readableOrStreamOrBufferedStream);
				} else {
					await this.doWriteReadableBufferedQueued(provider, handle, readableOrStreamOrBufferedStream);
				}
			} catch (error) {
				throw ensureFileSystemProviderError(error);
			} finally {

				// close handle always
				await provider.close(handle);
			}
		}, this.getExtUri(provider).providerExtUri);
	}

	private async doWriteStreamBufferedQueued(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, handle: number, streamOrBufferedStream: VSBufferReadableStream | VSBufferReadableBufferedStream): Promise<void> {
		let posInFile = 0;
		let stream: VSBufferReadableStream;

		// Buffered stream: consume the buffer first by writing
		// it to the target before reading from the stream.
		if (isReadableBufferedStream(streamOrBufferedStream)) {
			if (streamOrBufferedStream.buffer.length > 0) {
				const chunk = VSBuffer.concat(streamOrBufferedStream.buffer);
				await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);

				posInFile += chunk.byteLength;
			}

			// If the stream has been consumed, return early
			if (streamOrBufferedStream.ended) {
				return;
			}

			stream = streamOrBufferedStream.stream;
		}

		// Unbuffered stream - just take as is
		else {
			stream = streamOrBufferedStream;
		}

		return new Promise((resolve, reject) => {
			listenStream(stream, {
				onData: async chunk => {

					// pause stream to perform async write operation
					stream.pause();

					try {
						await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);
					} catch (error) {
						return reject(error);
					}

					posInFile += chunk.byteLength;

					// resume stream now that we have successfully written
					// run this on the next tick to prevent increasing the
					// execution stack because resume() may call the event
					// handler again before finishing.
					setTimeout(() => stream.resume());
				},
				onError: error => reject(error),
				onEnd: () => resolve()
			});
		});
	}

	private async doWriteReadableBufferedQueued(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, handle: number, readable: VSBufferReadable): Promise<void> {
		let posInFile = 0;

		let chunk: VSBuffer | null;
		while ((chunk = readable.read()) !== null) {
			await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);

			posInFile += chunk.byteLength;
		}
	}

	private async doWriteBuffer(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, handle: number, buffer: VSBuffer, length: number, posInFile: number, posInBuffer: number): Promise<void> {
		let totalBytesWritten = 0;
		while (totalBytesWritten < length) {

			// Write through the provider
			const bytesWritten = await provider.write(handle, posInFile + totalBytesWritten, buffer.buffer, posInBuffer + totalBytesWritten, length - totalBytesWritten);
			totalBytesWritten += bytesWritten;
		}
	}

	private async doWriteUnbuffered(provider: IFileSystemProviderWithFileReadWriteCapability, resource: URI, options: IWriteFileOptions | undefined, bufferOrReadableOrStreamOrBufferedStream: VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream): Promise<void> {
		return this.writeQueue.queueFor(resource, () => this.doWriteUnbufferedQueued(provider, resource, options, bufferOrReadableOrStreamOrBufferedStream), this.getExtUri(provider).providerExtUri);
	}

	private async doWriteUnbufferedQueued(provider: IFileSystemProviderWithFileReadWriteCapability, resource: URI, options: IWriteFileOptions | undefined, bufferOrReadableOrStreamOrBufferedStream: VSBuffer | VSBufferReadable | VSBufferReadableStream | VSBufferReadableBufferedStream): Promise<void> {
		let buffer: VSBuffer;
		if (bufferOrReadableOrStreamOrBufferedStream instanceof VSBuffer) {
			buffer = bufferOrReadableOrStreamOrBufferedStream;
		} else if (isReadableStream(bufferOrReadableOrStreamOrBufferedStream)) {
			buffer = await streamToBuffer(bufferOrReadableOrStreamOrBufferedStream);
		} else if (isReadableBufferedStream(bufferOrReadableOrStreamOrBufferedStream)) {
			buffer = await bufferedStreamToBuffer(bufferOrReadableOrStreamOrBufferedStream);
		} else {
			buffer = readableToBuffer(bufferOrReadableOrStreamOrBufferedStream);
		}

		// Write through the provider
		await provider.writeFile(resource, buffer.buffer, { create: true, overwrite: true, unlock: options?.unlock ?? false, atomic: options?.atomic ?? false });
	}

	private async doPipeBuffered(sourceProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, source: URI, targetProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, target: URI): Promise<void> {
		return this.writeQueue.queueFor(target, () => this.doPipeBufferedQueued(sourceProvider, source, targetProvider, target), this.getExtUri(targetProvider).providerExtUri);
	}

	private async doPipeBufferedQueued(sourceProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, source: URI, targetProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, target: URI): Promise<void> {
		let sourceHandle: number | undefined = undefined;
		let targetHandle: number | undefined = undefined;

		try {

			// Open handles
			sourceHandle = await sourceProvider.open(source, { create: false });
			targetHandle = await targetProvider.open(target, { create: true, unlock: false });

			const buffer = VSBuffer.alloc(this.BUFFER_SIZE);

			let posInFile = 0;
			let posInBuffer = 0;
			let bytesRead = 0;
			do {
				// read from source (sourceHandle) at current position (posInFile) into buffer (buffer) at
				// buffer position (posInBuffer) up to the size of the buffer (buffer.byteLength).
				bytesRead = await sourceProvider.read(sourceHandle, posInFile, buffer.buffer, posInBuffer, buffer.byteLength - posInBuffer);

				// write into target (targetHandle) at current position (posInFile) from buffer (buffer) at
				// buffer position (posInBuffer) all bytes we read (bytesRead).
				await this.doWriteBuffer(targetProvider, targetHandle, buffer, bytesRead, posInFile, posInBuffer);

				posInFile += bytesRead;
				posInBuffer += bytesRead;

				// when buffer full, fill it again from the beginning
				if (posInBuffer === buffer.byteLength) {
					posInBuffer = 0;
				}
			} while (bytesRead > 0);
		} catch (error) {
			throw ensureFileSystemProviderError(error);
		} finally {
			await Promises.settled([
				typeof sourceHandle === 'number' ? sourceProvider.close(sourceHandle) : Promise.resolve(),
				typeof targetHandle === 'number' ? targetProvider.close(targetHandle) : Promise.resolve(),
			]);
		}
	}

	private async doPipeUnbuffered(sourceProvider: IFileSystemProviderWithFileReadWriteCapability, source: URI, targetProvider: IFileSystemProviderWithFileReadWriteCapability, target: URI): Promise<void> {
		return this.writeQueue.queueFor(target, () => this.doPipeUnbufferedQueued(sourceProvider, source, targetProvider, target), this.getExtUri(targetProvider).providerExtUri);
	}

	private async doPipeUnbufferedQueued(sourceProvider: IFileSystemProviderWithFileReadWriteCapability, source: URI, targetProvider: IFileSystemProviderWithFileReadWriteCapability, target: URI): Promise<void> {
		return targetProvider.writeFile(target, await sourceProvider.readFile(source), { create: true, overwrite: true, unlock: false, atomic: false });
	}

	private async doPipeUnbufferedToBuffered(sourceProvider: IFileSystemProviderWithFileReadWriteCapability, source: URI, targetProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, target: URI): Promise<void> {
		return this.writeQueue.queueFor(target, () => this.doPipeUnbufferedToBufferedQueued(sourceProvider, source, targetProvider, target), this.getExtUri(targetProvider).providerExtUri);
	}

	private async doPipeUnbufferedToBufferedQueued(sourceProvider: IFileSystemProviderWithFileReadWriteCapability, source: URI, targetProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, target: URI): Promise<void> {

		// Open handle
		const targetHandle = await targetProvider.open(target, { create: true, unlock: false });

		// Read entire buffer from source and write buffered
		try {
			const buffer = await sourceProvider.readFile(source);
			await this.doWriteBuffer(targetProvider, targetHandle, VSBuffer.wrap(buffer), buffer.byteLength, 0, 0);
		} catch (error) {
			throw ensureFileSystemProviderError(error);
		} finally {
			await targetProvider.close(targetHandle);
		}
	}

	private async doPipeBufferedToUnbuffered(sourceProvider: IFileSystemProviderWithOpenReadWriteCloseCapability, source: URI, targetProvider: IFileSystemProviderWithFileReadWriteCapability, target: URI): Promise<void> {

		// Read buffer via stream buffered
		const buffer = await streamToBuffer(this.readFileBuffered(sourceProvider, source, CancellationToken.None));

		// Write buffer into target at once
		await this.doWriteUnbuffered(targetProvider, target, undefined, buffer);
	}

	protected throwIfFileSystemIsReadonly<T extends IFileSystemProvider>(provider: T, resource: URI): T {
		if (provider.capabilities & FileSystemProviderCapabilities.Readonly) {
			throw new FileOperationError(localize('err.readonly', "Unable to modify read-only file '{0}'", this.resourceForError(resource)), FileOperationResult.FILE_PERMISSION_DENIED);
		}

		return provider;
	}

	private throwIfFileIsReadonly(resource: URI, stat: IStat): void {
		if ((stat.permissions ?? 0) & FilePermission.Readonly) {
			throw new FileOperationError(localize('err.readonly', "Unable to modify read-only file '{0}'", this.resourceForError(resource)), FileOperationResult.FILE_PERMISSION_DENIED);
		}
	}

	private resourceForError(resource: URI): string {
		if (resource.scheme === Schemas.file) {
			return resource.fsPath;
		}

		return resource.toString(true);
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/inMemoryFilesystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/common/inMemoryFilesystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import * as resources from '../../../base/common/resources.js';
import { ReadableStreamEvents, newWriteableStream } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { FileChangeType, IFileDeleteOptions, IFileOverwriteOptions, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileWriteOptions, IFileChange, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions, createFileSystemProviderError, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileOpenOptions, IFileSystemProviderWithFileAtomicDeleteCapability, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileAtomicWriteCapability, IFileSystemProviderWithFileReadStreamCapability } from './files.js';

class File implements IStat {

	readonly type: FileType.File;
	readonly ctime: number;
	mtime: number;
	size: number;

	name: string;
	data?: Uint8Array;

	constructor(name: string) {
		this.type = FileType.File;
		this.ctime = Date.now();
		this.mtime = Date.now();
		this.size = 0;
		this.name = name;
	}
}

class Directory implements IStat {

	readonly type: FileType.Directory;
	readonly ctime: number;
	mtime: number;
	size: number;

	name: string;
	readonly entries: Map<string, File | Directory>;

	constructor(name: string) {
		this.type = FileType.Directory;
		this.ctime = Date.now();
		this.mtime = Date.now();
		this.size = 0;
		this.name = name;
		this.entries = new Map();
	}
}

type Entry = File | Directory;

export class InMemoryFileSystemProvider extends Disposable implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileAtomicWriteCapability,
	IFileSystemProviderWithFileAtomicDeleteCapability {

	private memoryFdCounter = 0;
	private readonly fdMemory = new Map<number, Uint8Array>();
	private _onDidChangeCapabilities = this._register(new Emitter<void>());
	readonly onDidChangeCapabilities = this._onDidChangeCapabilities.event;

	private _capabilities = FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.PathCaseSensitive;
	get capabilities(): FileSystemProviderCapabilities { return this._capabilities; }

	setReadOnly(readonly: boolean) {
		const isReadonly = !!(this._capabilities & FileSystemProviderCapabilities.Readonly);
		if (readonly !== isReadonly) {
			this._capabilities = readonly ? FileSystemProviderCapabilities.Readonly | FileSystemProviderCapabilities.PathCaseSensitive | FileSystemProviderCapabilities.FileReadWrite
				: FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.PathCaseSensitive;
			this._onDidChangeCapabilities.fire();
		}
	}

	root = new Directory('');

	// --- manage file metadata

	async stat(resource: URI): Promise<IStat> {
		return this._lookup(resource, false);
	}

	async readdir(resource: URI): Promise<[string, FileType][]> {
		const entry = this._lookupAsDirectory(resource, false);
		const result: [string, FileType][] = [];
		entry.entries.forEach((child, name) => result.push([name, child.type]));
		return result;
	}

	// --- manage file contents

	async readFile(resource: URI): Promise<Uint8Array> {
		const data = this._lookupAsFile(resource, false).data;
		if (data) {
			return data;
		}
		throw createFileSystemProviderError('file not found', FileSystemProviderErrorCode.FileNotFound);
	}

	readFileStream(resource: URI): ReadableStreamEvents<Uint8Array> {
		const data = this._lookupAsFile(resource, false).data;

		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);
		stream.end(data);

		return stream;
	}

	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		const basename = resources.basename(resource);
		const parent = this._lookupParentDirectory(resource);
		let entry = parent.entries.get(basename);
		if (entry instanceof Directory) {
			throw createFileSystemProviderError('file is directory', FileSystemProviderErrorCode.FileIsADirectory);
		}
		if (!entry && !opts.create) {
			throw createFileSystemProviderError('file not found', FileSystemProviderErrorCode.FileNotFound);
		}
		if (entry && opts.create && !opts.overwrite) {
			throw createFileSystemProviderError('file exists already', FileSystemProviderErrorCode.FileExists);
		}
		if (!entry) {
			entry = new File(basename);
			parent.entries.set(basename, entry);
			this._fireSoon({ type: FileChangeType.ADDED, resource });
		}
		entry.mtime = Date.now();
		entry.size = content.byteLength;
		entry.data = content;

		this._fireSoon({ type: FileChangeType.UPDATED, resource });
	}

	// file open/read/write/close
	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		const data = this._lookupAsFile(resource, false).data;
		if (data) {
			const fd = this.memoryFdCounter++;
			this.fdMemory.set(fd, data);
			return Promise.resolve(fd);
		}
		throw createFileSystemProviderError('file not found', FileSystemProviderErrorCode.FileNotFound);
	}

	close(fd: number): Promise<void> {
		this.fdMemory.delete(fd);
		return Promise.resolve();
	}

	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const memory = this.fdMemory.get(fd);
		if (!memory) {
			throw createFileSystemProviderError(`No file with that descriptor open`, FileSystemProviderErrorCode.Unavailable);
		}

		const toWrite = VSBuffer.wrap(memory).slice(pos, pos + length);
		data.set(toWrite.buffer, offset);
		return Promise.resolve(toWrite.byteLength);
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const memory = this.fdMemory.get(fd);
		if (!memory) {
			throw createFileSystemProviderError(`No file with that descriptor open`, FileSystemProviderErrorCode.Unavailable);
		}

		const toWrite = VSBuffer.wrap(data).slice(offset, offset + length);
		memory.set(toWrite.buffer, pos);
		return Promise.resolve(toWrite.byteLength);
	}

	// --- manage files/folders

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		if (!opts.overwrite && this._lookup(to, true)) {
			throw createFileSystemProviderError('file exists already', FileSystemProviderErrorCode.FileExists);
		}

		const entry = this._lookup(from, false);
		const oldParent = this._lookupParentDirectory(from);

		const newParent = this._lookupParentDirectory(to);
		const newName = resources.basename(to);

		oldParent.entries.delete(entry.name);
		entry.name = newName;
		newParent.entries.set(newName, entry);

		this._fireSoon(
			{ type: FileChangeType.DELETED, resource: from },
			{ type: FileChangeType.ADDED, resource: to }
		);
	}

	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		const dirname = resources.dirname(resource);
		const basename = resources.basename(resource);
		const parent = this._lookupAsDirectory(dirname, false);
		if (parent.entries.delete(basename)) {
			parent.mtime = Date.now();
			parent.size -= 1;
			this._fireSoon({ type: FileChangeType.UPDATED, resource: dirname }, { resource, type: FileChangeType.DELETED });
		}
	}

	async mkdir(resource: URI): Promise<void> {
		if (this._lookup(resource, true)) {
			throw createFileSystemProviderError('file exists already', FileSystemProviderErrorCode.FileExists);
		}

		const basename = resources.basename(resource);
		const dirname = resources.dirname(resource);
		const parent = this._lookupAsDirectory(dirname, false);

		const entry = new Directory(basename);
		parent.entries.set(entry.name, entry);
		parent.mtime = Date.now();
		parent.size += 1;
		this._fireSoon({ type: FileChangeType.UPDATED, resource: dirname }, { type: FileChangeType.ADDED, resource });
	}

	// --- lookup

	private _lookup(uri: URI, silent: false): Entry;
	private _lookup(uri: URI, silent: boolean): Entry | undefined;
	private _lookup(uri: URI, silent: boolean): Entry | undefined {
		const parts = uri.path.split('/');
		let entry: Entry = this.root;
		for (const part of parts) {
			if (!part) {
				continue;
			}
			let child: Entry | undefined;
			if (entry instanceof Directory) {
				child = entry.entries.get(part);
			}
			if (!child) {
				if (!silent) {
					throw createFileSystemProviderError('file not found', FileSystemProviderErrorCode.FileNotFound);
				} else {
					return undefined;
				}
			}
			entry = child;
		}
		return entry;
	}

	private _lookupAsDirectory(uri: URI, silent: boolean): Directory {
		const entry = this._lookup(uri, silent);
		if (entry instanceof Directory) {
			return entry;
		}
		throw createFileSystemProviderError('file not a directory', FileSystemProviderErrorCode.FileNotADirectory);
	}

	private _lookupAsFile(uri: URI, silent: boolean): File {
		const entry = this._lookup(uri, silent);
		if (entry instanceof File) {
			return entry;
		}
		throw createFileSystemProviderError('file is a directory', FileSystemProviderErrorCode.FileIsADirectory);
	}

	private _lookupParentDirectory(uri: URI): Directory {
		const dirname = resources.dirname(uri);
		return this._lookupAsDirectory(dirname, false);
	}

	// --- manage file events

	private readonly _onDidChangeFile = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile: Event<readonly IFileChange[]> = this._onDidChangeFile.event;

	private _bufferedChanges: IFileChange[] = [];
	private _fireSoonHandle?: Timeout;

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		// ignore, fires for all changes...
		return Disposable.None;
	}

	private _fireSoon(...changes: IFileChange[]): void {
		this._bufferedChanges.push(...changes);

		if (this._fireSoonHandle) {
			clearTimeout(this._fireSoonHandle);
		}

		this._fireSoonHandle = setTimeout(() => {
			this._onDidChangeFile.fire(this._bufferedChanges);
			this._bufferedChanges.length = 0;
		}, 5);
	}

	override dispose(): void {
		super.dispose();

		this.fdMemory.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/io.ts]---
Location: vscode-main/src/vs/platform/files/common/io.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { canceled } from '../../../base/common/errors.js';
import { IDataTransformer, IErrorTransformer, WriteableStream } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { createFileSystemProviderError, ensureFileSystemProviderError, IFileReadStreamOptions, FileSystemProviderErrorCode, IFileSystemProviderWithOpenReadWriteCloseCapability } from './files.js';

export interface ICreateReadStreamOptions extends IFileReadStreamOptions {

	/**
	 * The size of the buffer to use before sending to the stream.
	 */
	readonly bufferSize: number;

	/**
	 * Allows to massage any possibly error that happens during reading.
	 */
	readonly errorTransformer?: IErrorTransformer;
}

/**
 * A helper to read a file from a provider with open/read/close capability into a stream.
 */
export async function readFileIntoStream<T>(
	provider: IFileSystemProviderWithOpenReadWriteCloseCapability,
	resource: URI,
	target: WriteableStream<T>,
	transformer: IDataTransformer<VSBuffer, T>,
	options: ICreateReadStreamOptions,
	token: CancellationToken
): Promise<void> {
	let error: Error | undefined = undefined;

	try {
		await doReadFileIntoStream(provider, resource, target, transformer, options, token);
	} catch (err) {
		error = err;
	} finally {
		if (error && options.errorTransformer) {
			error = options.errorTransformer(error);
		}

		if (typeof error !== 'undefined') {
			target.error(error);
		}

		target.end();
	}
}

async function doReadFileIntoStream<T>(provider: IFileSystemProviderWithOpenReadWriteCloseCapability, resource: URI, target: WriteableStream<T>, transformer: IDataTransformer<VSBuffer, T>, options: ICreateReadStreamOptions, token: CancellationToken): Promise<void> {

	// Check for cancellation
	throwIfCancelled(token);

	// open handle through provider
	const handle = await provider.open(resource, { create: false });

	try {

		// Check for cancellation
		throwIfCancelled(token);

		let totalBytesRead = 0;
		let bytesRead = 0;
		let allowedRemainingBytes = (options && typeof options.length === 'number') ? options.length : undefined;

		let buffer = VSBuffer.alloc(Math.min(options.bufferSize, typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize));

		let posInFile = options && typeof options.position === 'number' ? options.position : 0;
		let posInBuffer = 0;
		do {
			// read from source (handle) at current position (pos) into buffer (buffer) at
			// buffer position (posInBuffer) up to the size of the buffer (buffer.byteLength).
			bytesRead = await provider.read(handle, posInFile, buffer.buffer, posInBuffer, buffer.byteLength - posInBuffer);

			posInFile += bytesRead;
			posInBuffer += bytesRead;
			totalBytesRead += bytesRead;

			if (typeof allowedRemainingBytes === 'number') {
				allowedRemainingBytes -= bytesRead;
			}

			// when buffer full, create a new one and emit it through stream
			if (posInBuffer === buffer.byteLength) {
				await target.write(transformer(buffer));

				buffer = VSBuffer.alloc(Math.min(options.bufferSize, typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize));

				posInBuffer = 0;
			}
		} while (bytesRead > 0 && (typeof allowedRemainingBytes !== 'number' || allowedRemainingBytes > 0) && throwIfCancelled(token) && throwIfTooLarge(totalBytesRead, options));

		// wrap up with last buffer (also respect maxBytes if provided)
		if (posInBuffer > 0) {
			let lastChunkLength = posInBuffer;
			if (typeof allowedRemainingBytes === 'number') {
				lastChunkLength = Math.min(posInBuffer, allowedRemainingBytes);
			}

			target.write(transformer(buffer.slice(0, lastChunkLength)));
		}
	} catch (error) {
		throw ensureFileSystemProviderError(error);
	} finally {
		await provider.close(handle);
	}
}

function throwIfCancelled(token: CancellationToken): boolean {
	if (token.isCancellationRequested) {
		throw canceled();
	}

	return true;
}

function throwIfTooLarge(totalBytesRead: number, options: ICreateReadStreamOptions): boolean {

	// Return early if file is too large to load and we have configured limits
	if (typeof options?.limits?.size === 'number' && totalBytesRead > options.limits.size) {
		throw createFileSystemProviderError(localize('fileTooLargeError', "File is too large to open"), FileSystemProviderErrorCode.FileTooLarge);
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/watcher.ts]---
Location: vscode-main/src/vs/platform/files/common/watcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { GLOBSTAR, IRelativePattern, parse, ParsedPattern } from '../../../base/common/glob.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { isAbsolute } from '../../../base/common/path.js';
import { isLinux } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { FileChangeFilter, FileChangeType, IFileChange, isParent } from './files.js';

interface IWatchRequest {

	/**
	 * The path to watch.
	 */
	readonly path: string;

	/**
	 * Whether to watch recursively or not.
	 */
	readonly recursive: boolean;

	/**
	 * A set of glob patterns or paths to exclude from watching.
	 */
	readonly excludes: string[];

	/**
	 * An optional set of glob patterns or paths to include for
	 * watching. If not provided, all paths are considered for
	 * events.
	 */
	readonly includes?: Array<string | IRelativePattern>;

	/**
	 * If provided, file change events from the watcher that
	 * are a result of this watch request will carry the same
	 * id.
	 */
	readonly correlationId?: number;

	/**
	 * If provided, allows to filter the events that the watcher should consider
	 * for emitting. If not provided, all events are emitted.
	 *
	 * For example, to emit added and updated events, set to:
	 * `FileChangeFilter.ADDED | FileChangeFilter.UPDATED`.
	 */
	readonly filter?: FileChangeFilter;
}

export interface IWatchRequestWithCorrelation extends IWatchRequest {
	readonly correlationId: number;
}

export function isWatchRequestWithCorrelation(request: IWatchRequest): request is IWatchRequestWithCorrelation {
	return typeof request.correlationId === 'number';
}

export interface INonRecursiveWatchRequest extends IWatchRequest {

	/**
	 * The watcher will be non-recursive.
	 */
	readonly recursive: false;
}

export interface IRecursiveWatchRequest extends IWatchRequest {

	/**
	 * The watcher will be recursive.
	 */
	readonly recursive: true;

	/**
	 * @deprecated this only exists for WSL1 support and should never
	 * be used in any other case.
	 */
	pollingInterval?: number;
}

export function isRecursiveWatchRequest(request: IWatchRequest): request is IRecursiveWatchRequest {
	return request.recursive === true;
}

export type IUniversalWatchRequest = IRecursiveWatchRequest | INonRecursiveWatchRequest;

export interface IWatcherErrorEvent {
	readonly error: string;
	readonly request?: IUniversalWatchRequest;
}

export interface IWatcher {

	/**
	 * A normalized file change event from the raw events
	 * the watcher emits.
	 */
	readonly onDidChangeFile: Event<IFileChange[]>;

	/**
	 * An event to indicate a message that should get logged.
	 */
	readonly onDidLogMessage: Event<ILogMessage>;

	/**
	 * An event to indicate an error occurred from the watcher
	 * that is unrecoverable. Listeners should restart the
	 * watcher if possible.
	 */
	readonly onDidError: Event<IWatcherErrorEvent>;

	/**
	 * Configures the watcher to watch according to the
	 * requests. Any existing watched path that is not
	 * in the array, will be removed from watching and
	 * any new path will be added to watching.
	 */
	watch(requests: IWatchRequest[]): Promise<void>;

	/**
	 * Enable verbose logging in the watcher.
	 */
	setVerboseLogging(enabled: boolean): Promise<void>;

	/**
	 * Stop all watchers.
	 */
	stop(): Promise<void>;
}

export interface IRecursiveWatcher extends IWatcher {
	watch(requests: IRecursiveWatchRequest[]): Promise<void>;
}

export interface IRecursiveWatcherWithSubscribe extends IRecursiveWatcher {

	/**
	 * Subscribe to file events for the given path. The callback is called
	 * whenever a file event occurs for the path. If the watcher failed,
	 * the error parameter is set to `true`.
	 *
	 * @returns an `IDisposable` to stop listening to events or `undefined`
	 * if no events can be watched for the path given the current set of
	 * recursive watch requests.
	 */
	subscribe(path: string, callback: (error: true | null, change?: IFileChange) => void): IDisposable | undefined;
}

export interface IRecursiveWatcherOptions {

	/**
	 * If `true`, will enable polling for all watchers, otherwise
	 * will enable it for paths included in the string array.
	 *
	 * @deprecated this only exists for WSL1 support and should never
	 * be used in any other case.
	 */
	readonly usePolling: boolean | string[];

	/**
	 * If polling is enabled (via `usePolling`), defines the duration
	 * in which the watcher will poll for changes.
	 *
	 * @deprecated this only exists for WSL1 support and should never
	 * be used in any other case.
	 */
	readonly pollingInterval?: number;
}

export interface INonRecursiveWatcher extends IWatcher {
	watch(requests: INonRecursiveWatchRequest[]): Promise<void>;
}

export interface IUniversalWatcher extends IWatcher {
	watch(requests: IUniversalWatchRequest[]): Promise<void>;
}

export abstract class AbstractWatcherClient extends Disposable {

	private static readonly MAX_RESTARTS = 5;

	private watcher: IWatcher | undefined;
	private readonly watcherDisposables = this._register(new MutableDisposable());

	private requests: IWatchRequest[] | undefined = undefined;

	private restartCounter = 0;

	constructor(
		private readonly onFileChanges: (changes: IFileChange[]) => void,
		private readonly onLogMessage: (msg: ILogMessage) => void,
		private verboseLogging: boolean,
		private options: {
			readonly type: string;
			readonly restartOnError: boolean;
		}
	) {
		super();
	}

	protected abstract createWatcher(disposables: DisposableStore): IWatcher;

	protected init(): void {

		// Associate disposables to the watcher
		const disposables = new DisposableStore();
		this.watcherDisposables.value = disposables;

		// Ask implementors to create the watcher
		this.watcher = this.createWatcher(disposables);
		this.watcher.setVerboseLogging(this.verboseLogging);

		// Wire in event handlers
		disposables.add(this.watcher.onDidChangeFile(changes => this.onFileChanges(changes)));
		disposables.add(this.watcher.onDidLogMessage(msg => this.onLogMessage(msg)));
		disposables.add(this.watcher.onDidError(e => this.onError(e.error, e.request)));
	}

	protected onError(error: string, failedRequest?: IUniversalWatchRequest): void {

		// Restart on error (up to N times, if possible)
		if (this.canRestart(error, failedRequest)) {
			if (this.restartCounter < AbstractWatcherClient.MAX_RESTARTS && this.requests) {
				this.error(`restarting watcher after unexpected error: ${error}`);
				this.restart(this.requests);
			} else {
				this.error(`gave up attempting to restart watcher after unexpected error: ${error}`);
			}
		}

		// Do not attempt to restart otherwise, report the error
		else {
			this.error(error);
		}
	}

	private canRestart(error: string, failedRequest?: IUniversalWatchRequest): boolean {
		if (!this.options.restartOnError) {
			return false; // disabled by options
		}

		if (failedRequest) {
			// do not treat a failing request as a reason to restart the entire
			// watcher. it is possible that from a large amount of watch requests
			// some fail and we would constantly restart all requests only because
			// of that. rather, continue the watcher and leave the failed request
			return false;
		}

		if (
			error.indexOf('No space left on device') !== -1 ||
			error.indexOf('EMFILE') !== -1
		) {
			// do not restart when the error indicates that the system is running
			// out of handles for file watching. this is not recoverable anyway
			// and needs changes to the system before continuing
			return false;
		}

		return true;
	}

	private restart(requests: IUniversalWatchRequest[]): void {
		this.restartCounter++;

		this.init();
		this.watch(requests);
	}

	async watch(requests: IUniversalWatchRequest[]): Promise<void> {
		this.requests = requests;

		await this.watcher?.watch(requests);
	}

	async setVerboseLogging(verboseLogging: boolean): Promise<void> {
		this.verboseLogging = verboseLogging;

		await this.watcher?.setVerboseLogging(verboseLogging);
	}

	private error(message: string) {
		this.onLogMessage({ type: 'error', message: `[File Watcher (${this.options.type})] ${message}` });
	}

	protected trace(message: string) {
		this.onLogMessage({ type: 'trace', message: `[File Watcher (${this.options.type})] ${message}` });
	}

	override dispose(): void {

		// Render the watcher invalid from here
		this.watcher = undefined;

		return super.dispose();
	}
}

export abstract class AbstractNonRecursiveWatcherClient extends AbstractWatcherClient {

	constructor(
		onFileChanges: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	) {
		super(onFileChanges, onLogMessage, verboseLogging, { type: 'node.js', restartOnError: false });
	}

	protected abstract override createWatcher(disposables: DisposableStore): INonRecursiveWatcher;
}

export abstract class AbstractUniversalWatcherClient extends AbstractWatcherClient {

	constructor(
		onFileChanges: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	) {
		super(onFileChanges, onLogMessage, verboseLogging, { type: 'universal', restartOnError: true });
	}

	protected abstract override createWatcher(disposables: DisposableStore): IUniversalWatcher;
}

export interface ILogMessage {
	readonly type: 'trace' | 'warn' | 'error' | 'info' | 'debug';
	readonly message: string;
}

export function reviveFileChanges(changes: IFileChange[]): IFileChange[] {
	return changes.map(change => ({
		type: change.type,
		resource: URI.revive(change.resource),
		cId: change.cId
	}));
}

export function coalesceEvents(changes: IFileChange[]): IFileChange[] {

	// Build deltas
	const coalescer = new EventCoalescer();
	for (const event of changes) {
		coalescer.processEvent(event);
	}

	return coalescer.coalesce();
}

export function normalizeWatcherPattern(path: string, pattern: string | IRelativePattern): string | IRelativePattern {

	// Patterns are always matched on the full absolute path
	// of the event. As such, if the pattern is not absolute
	// and is a string and does not start with a leading
	// `**`, we have to convert it to a relative pattern with
	// the given `base`

	if (typeof pattern === 'string' && !pattern.startsWith(GLOBSTAR) && !isAbsolute(pattern)) {
		return { base: path, pattern };
	}

	return pattern;
}

export function parseWatcherPatterns(path: string, patterns: Array<string | IRelativePattern>, ignoreCase: boolean): ParsedPattern[] {
	const parsedPatterns: ParsedPattern[] = [];

	for (const pattern of patterns) {
		parsedPatterns.push(parse(normalizeWatcherPattern(path, pattern), { ignoreCase }));
	}

	return parsedPatterns;
}

class EventCoalescer {

	private readonly coalesced = new Set<IFileChange>();
	private readonly mapPathToChange = new Map<string, IFileChange>();

	private toKey(event: IFileChange): string {
		if (isLinux) {
			return event.resource.fsPath;
		}

		return event.resource.fsPath.toLowerCase(); // normalise to file system case sensitivity
	}

	processEvent(event: IFileChange): void {
		const existingEvent = this.mapPathToChange.get(this.toKey(event));

		let keepEvent = false;

		// Event path already exists
		if (existingEvent) {
			const currentChangeType = existingEvent.type;
			const newChangeType = event.type;

			// macOS/Windows: track renames to different case
			// by keeping both CREATE and DELETE events
			if (existingEvent.resource.fsPath !== event.resource.fsPath && (event.type === FileChangeType.DELETED || event.type === FileChangeType.ADDED)) {
				keepEvent = true;
			}

			// Ignore CREATE followed by DELETE in one go
			else if (currentChangeType === FileChangeType.ADDED && newChangeType === FileChangeType.DELETED) {
				this.mapPathToChange.delete(this.toKey(event));
				this.coalesced.delete(existingEvent);
			}

			// Flatten DELETE followed by CREATE into CHANGE
			else if (currentChangeType === FileChangeType.DELETED && newChangeType === FileChangeType.ADDED) {
				existingEvent.type = FileChangeType.UPDATED;
			}

			// Do nothing. Keep the created event
			else if (currentChangeType === FileChangeType.ADDED && newChangeType === FileChangeType.UPDATED) { }

			// Otherwise apply change type
			else {
				existingEvent.type = newChangeType;
			}
		}

		// Otherwise keep
		else {
			keepEvent = true;
		}

		if (keepEvent) {
			this.coalesced.add(event);
			this.mapPathToChange.set(this.toKey(event), event);
		}
	}

	coalesce(): IFileChange[] {
		const addOrChangeEvents: IFileChange[] = [];
		const deletedPaths: string[] = [];

		// This algorithm will remove all DELETE events up to the root folder
		// that got deleted if any. This ensures that we are not producing
		// DELETE events for each file inside a folder that gets deleted.
		//
		// 1.) split ADD/CHANGE and DELETED events
		// 2.) sort short deleted paths to the top
		// 3.) for each DELETE, check if there is a deleted parent and ignore the event in that case
		return Array.from(this.coalesced).filter(e => {
			if (e.type !== FileChangeType.DELETED) {
				addOrChangeEvents.push(e);

				return false; // remove ADD / CHANGE
			}

			return true; // keep DELETE
		}).sort((e1, e2) => {
			return e1.resource.fsPath.length - e2.resource.fsPath.length; // shortest path first
		}).filter(e => {
			if (deletedPaths.some(deletedPath => isParent(e.resource.fsPath, deletedPath, !isLinux /* ignorecase */))) {
				return false; // DELETE is ignored if parent is deleted already
			}

			// otherwise mark as deleted
			deletedPaths.push(e.resource.fsPath);

			return true;
		}).concat(addOrChangeEvents);
	}
}

export function isFiltered(event: IFileChange, filter: FileChangeFilter | undefined): boolean {
	if (typeof filter === 'number') {
		switch (event.type) {
			case FileChangeType.ADDED:
				return (filter & FileChangeFilter.ADDED) === 0;
			case FileChangeType.DELETED:
				return (filter & FileChangeFilter.DELETED) === 0;
			case FileChangeType.UPDATED:
				return (filter & FileChangeFilter.UPDATED) === 0;
		}
	}

	return false;
}

export function requestFilterToString(filter: FileChangeFilter | undefined): string {
	if (typeof filter === 'number') {
		const filters = [];
		if (filter & FileChangeFilter.ADDED) {
			filters.push('Added');
		}
		if (filter & FileChangeFilter.DELETED) {
			filters.push('Deleted');
		}
		if (filter & FileChangeFilter.UPDATED) {
			filters.push('Updated');
		}

		if (filters.length === 0) {
			return '<all>';
		}

		return `[${filters.join(', ')}]`;
	}

	return '<none>';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/electron-main/diskFileSystemProviderServer.ts]---
Location: vscode-main/src/vs/platform/files/electron-main/diskFileSystemProviderServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { shell } from 'electron';
import { localize } from '../../../nls.js';
import { isWindows } from '../../../base/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IFileDeleteOptions, IFileChange, IWatchOptions, createFileSystemProviderError, FileSystemProviderErrorCode } from '../common/files.js';
import { DiskFileSystemProvider } from '../node/diskFileSystemProvider.js';
import { basename, normalize } from '../../../base/common/path.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';
import { AbstractDiskFileSystemProviderChannel, AbstractSessionFileWatcher, ISessionFileWatcher } from '../node/diskFileSystemProviderServer.js';
import { DefaultURITransformer, IURITransformer } from '../../../base/common/uriIpc.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';

export class DiskFileSystemProviderChannel extends AbstractDiskFileSystemProviderChannel<unknown> {

	constructor(
		provider: DiskFileSystemProvider,
		logService: ILogService,
		private readonly environmentService: IEnvironmentService
	) {
		super(provider, logService);
	}

	protected override getUriTransformer(ctx: unknown): IURITransformer {
		return DefaultURITransformer;
	}

	protected override transformIncoming(uriTransformer: IURITransformer, _resource: UriComponents): URI {
		return URI.revive(_resource);
	}

	//#region Delete: override to support Electron's trash support

	protected override async delete(uriTransformer: IURITransformer, _resource: UriComponents, opts: IFileDeleteOptions): Promise<void> {
		if (!opts.useTrash) {
			return super.delete(uriTransformer, _resource, opts);
		}

		const resource = this.transformIncoming(uriTransformer, _resource);
		const filePath = normalize(resource.fsPath);
		try {
			await shell.trashItem(filePath);
		} catch (error) {
			throw createFileSystemProviderError(isWindows ? localize('binFailed', "Failed to move '{0}' to the recycle bin ({1})", basename(filePath), toErrorMessage(error)) : localize('trashFailed', "Failed to move '{0}' to the trash ({1})", basename(filePath), toErrorMessage(error)), FileSystemProviderErrorCode.Unknown);
		}
	}

	//#endregion

	//#region File Watching

	protected createSessionFileWatcher(uriTransformer: IURITransformer, emitter: Emitter<IFileChange[] | string>): ISessionFileWatcher {
		return new SessionFileWatcher(uriTransformer, emitter, this.logService, this.environmentService);
	}

	//#endregion

}

class SessionFileWatcher extends AbstractSessionFileWatcher {

	override watch(req: number, resource: URI, opts: IWatchOptions): IDisposable {
		if (opts.recursive) {
			throw createFileSystemProviderError('Recursive file watching is not supported from main process for performance reasons.', FileSystemProviderErrorCode.Unavailable);
		}

		return super.watch(req, resource, opts);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/diskFileSystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/node/diskFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Stats, promises } from 'fs';
import { Barrier, retry } from '../../../base/common/async.js';
import { ResourceMap } from '../../../base/common/map.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { isEqual } from '../../../base/common/extpath.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { basename, dirname, join } from '../../../base/common/path.js';
import { isLinux, isWindows } from '../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase, joinPath, basename as resourcesBasename, dirname as resourcesDirname } from '../../../base/common/resources.js';
import { newWriteableStream, ReadableStreamEvents } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { IDirent, Promises, RimRafMode, SymlinkSupport } from '../../../base/node/pfs.js';
import { localize } from '../../../nls.js';
import { createFileSystemProviderError, IFileAtomicReadOptions, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, FileSystemProviderCapabilities, FileSystemProviderError, FileSystemProviderErrorCode, FileType, IFileWriteOptions, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileCloneCapability, IFileSystemProviderWithFileFolderCopyCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, isFileOpenForWriteOptions, IStat, FilePermission, IFileSystemProviderWithFileAtomicWriteCapability, IFileSystemProviderWithFileAtomicDeleteCapability, IFileChange, IFileSystemProviderWithFileRealpathCapability } from '../common/files.js';
import { readFileIntoStream } from '../common/io.js';
import { AbstractNonRecursiveWatcherClient, AbstractUniversalWatcherClient, ILogMessage } from '../common/watcher.js';
import { AbstractDiskFileSystemProvider } from '../common/diskFileSystemProvider.js';
import { UniversalWatcherClient } from './watcher/watcherClient.js';
import { NodeJSWatcherClient } from './watcher/nodejs/nodejsClient.js';

export class DiskFileSystemProvider extends AbstractDiskFileSystemProvider implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileFolderCopyCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileAtomicWriteCapability,
	IFileSystemProviderWithFileAtomicDeleteCapability,
	IFileSystemProviderWithFileCloneCapability,
	IFileSystemProviderWithFileRealpathCapability {

	private static TRACE_LOG_RESOURCE_LOCKS = false; // not enabled by default because very spammy

	//#region File Capabilities

	readonly onDidChangeCapabilities = Event.None;

	private _capabilities: FileSystemProviderCapabilities | undefined;
	get capabilities(): FileSystemProviderCapabilities {
		if (!this._capabilities) {
			this._capabilities =
				FileSystemProviderCapabilities.FileReadWrite |
				FileSystemProviderCapabilities.FileOpenReadWriteClose |
				FileSystemProviderCapabilities.FileReadStream |
				FileSystemProviderCapabilities.FileFolderCopy |
				FileSystemProviderCapabilities.FileWriteUnlock |
				FileSystemProviderCapabilities.FileAtomicRead |
				FileSystemProviderCapabilities.FileAtomicWrite |
				FileSystemProviderCapabilities.FileAtomicDelete |
				FileSystemProviderCapabilities.FileClone |
				FileSystemProviderCapabilities.FileRealpath;

			if (isLinux) {
				this._capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
			}
		}

		return this._capabilities;
	}

	//#endregion

	//#region File Metadata Resolving

	async stat(resource: URI): Promise<IStat> {
		try {
			const { stat, symbolicLink } = await SymlinkSupport.stat(this.toFilePath(resource)); // cannot use fs.stat() here to support links properly

			return {
				type: this.toType(stat, symbolicLink),
				ctime: stat.birthtime.getTime(), // intentionally not using ctime here, we want the creation time
				mtime: stat.mtime.getTime(),
				size: stat.size,
				permissions: (stat.mode & 0o200) === 0 ? FilePermission.Locked : undefined
			};
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	private async statIgnoreError(resource: URI): Promise<IStat | undefined> {
		try {
			return await this.stat(resource);
		} catch (error) {
			return undefined;
		}
	}

	async realpath(resource: URI): Promise<string> {
		const filePath = this.toFilePath(resource);

		return Promises.realpath(filePath);
	}

	async readdir(resource: URI): Promise<[string, FileType][]> {
		try {
			const children = await Promises.readdir(this.toFilePath(resource), { withFileTypes: true });

			const result: [string, FileType][] = [];
			await Promise.all(children.map(async child => {
				try {
					let type: FileType;
					if (child.isSymbolicLink()) {
						type = (await this.stat(joinPath(resource, child.name))).type; // always resolve target the link points to if any
					} else {
						type = this.toType(child);
					}

					result.push([child.name, type]);
				} catch (error) {
					this.logService.trace(error); // ignore errors for individual entries that can arise from permission denied
				}
			}));

			return result;
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	private toType(entry: Stats | IDirent, symbolicLink?: { dangling: boolean }): FileType {

		// Signal file type by checking for file / directory, except:
		// - symbolic links pointing to nonexistent files are FileType.Unknown
		// - files that are neither file nor directory are FileType.Unknown
		let type: FileType;
		if (symbolicLink?.dangling) {
			type = FileType.Unknown;
		} else if (entry.isFile()) {
			type = FileType.File;
		} else if (entry.isDirectory()) {
			type = FileType.Directory;
		} else {
			type = FileType.Unknown;
		}

		// Always signal symbolic link as file type additionally
		if (symbolicLink) {
			type |= FileType.SymbolicLink;
		}

		return type;
	}

	//#endregion

	//#region File Reading/Writing

	private readonly resourceLocks = new ResourceMap<Barrier>(resource => extUriBiasedIgnorePathCase.getComparisonKey(resource));

	private async createResourceLock(resource: URI): Promise<IDisposable> {
		const filePath = this.toFilePath(resource);
		this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - request to acquire resource lock (${filePath})`);

		// Await pending locks for resource. It is possible for a new lock being
		// added right after opening, so we have to loop over locks until no lock
		// remains.
		let existingLock: Barrier | undefined = undefined;
		while (existingLock = this.resourceLocks.get(resource)) {
			this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - waiting for resource lock to be released (${filePath})`);
			await existingLock.wait();
		}

		// Store new
		const newLock = new Barrier();
		this.resourceLocks.set(resource, newLock);

		this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - new resource lock created (${filePath})`);

		return toDisposable(() => {
			this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - resource lock dispose() (${filePath})`);

			// Delete lock if it is still ours
			if (this.resourceLocks.get(resource) === newLock) {
				this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - resource lock removed from resource-lock map (${filePath})`);
				this.resourceLocks.delete(resource);
			}

			// Open lock
			this.traceLock(`[Disk FileSystemProvider]: createResourceLock() - resource lock barrier open() (${filePath})`);
			newLock.open();
		});
	}

	async readFile(resource: URI, options?: IFileAtomicReadOptions): Promise<Uint8Array> {
		let lock: IDisposable | undefined = undefined;
		try {
			if (options?.atomic) {
				this.traceLock(`[Disk FileSystemProvider]: atomic read operation started (${this.toFilePath(resource)})`);

				// When the read should be atomic, make sure
				// to await any pending locks for the resource
				// and lock for the duration of the read.
				lock = await this.createResourceLock(resource);
			}

			const filePath = this.toFilePath(resource);

			return await promises.readFile(filePath);
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		} finally {
			lock?.dispose();
		}
	}

	private traceLock(msg: string): void {
		if (DiskFileSystemProvider.TRACE_LOG_RESOURCE_LOCKS) {
			this.logService.trace(msg);
		}
	}

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);

		readFileIntoStream(this, resource, stream, data => data.buffer, {
			...opts,
			bufferSize: 256 * 1024 // read into chunks of 256kb each to reduce IPC overhead
		}, token);

		return stream;
	}

	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		if (opts?.atomic !== false && opts?.atomic?.postfix && await this.canWriteFileAtomic(resource)) {
			return this.doWriteFileAtomic(resource, joinPath(resourcesDirname(resource), `${resourcesBasename(resource)}${opts.atomic.postfix}`), content, opts);
		} else {
			return this.doWriteFile(resource, content, opts);
		}
	}

	private async canWriteFileAtomic(resource: URI): Promise<boolean> {
		try {
			const filePath = this.toFilePath(resource);
			const { symbolicLink } = await SymlinkSupport.stat(filePath);
			if (symbolicLink) {
				// atomic writes are unsupported for symbolic links because
				// we need to ensure that the `rename` operation is atomic
				// and that only works if the link is on the same disk.
				// Since we do not know where the symbolic link points to
				// we refuse to write atomically.
				return false;
			}
		} catch (error) {
			// ignore stat errors here and just proceed trying to write
		}

		return true; // atomic writing supported
	}

	private async doWriteFileAtomic(resource: URI, tempResource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {

		// Ensure to create locks for all resources involved
		// since atomic write involves mutiple disk operations
		// and resources.

		const locks = new DisposableStore();

		try {
			locks.add(await this.createResourceLock(resource));
			locks.add(await this.createResourceLock(tempResource));

			// Write to temp resource first
			await this.doWriteFile(tempResource, content, opts, true /* disable write lock */);

			try {

				// Rename over existing to ensure atomic replace
				await this.rename(tempResource, resource, { overwrite: true });

			} catch (error) {

				// Cleanup in case of rename error
				try {
					await this.delete(tempResource, { recursive: false, useTrash: false, atomic: false });
				} catch (error) {
					// ignore - we want the outer error to bubble up
				}

				throw error;
			}
		} finally {
			locks.dispose();
		}
	}

	private async doWriteFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions, disableWriteLock?: boolean): Promise<void> {
		let handle: number | undefined = undefined;
		try {
			const filePath = this.toFilePath(resource);

			// Validate target unless { create: true, overwrite: true }
			if (!opts.create || !opts.overwrite) {
				const fileExists = await Promises.exists(filePath);
				if (fileExists) {
					if (!opts.overwrite) {
						throw createFileSystemProviderError(localize('fileExists', "File already exists"), FileSystemProviderErrorCode.FileExists);
					}
				} else {
					if (!opts.create) {
						throw createFileSystemProviderError(localize('fileNotExists', "File does not exist"), FileSystemProviderErrorCode.FileNotFound);
					}
				}
			}

			// Open
			handle = await this.open(resource, { create: true, unlock: opts.unlock }, disableWriteLock);

			// Write content at once
			await this.write(handle, 0, content, 0, content.byteLength);
		} catch (error) {
			throw await this.toFileSystemProviderWriteError(resource, error);
		} finally {
			if (typeof handle === 'number') {
				await this.close(handle);
			}
		}
	}

	private readonly mapHandleToPos = new Map<number, number>();
	private readonly mapHandleToLock = new Map<number, IDisposable>();

	private readonly writeHandles = new Map<number, URI>();

	private static canFlush = true;

	static configureFlushOnWrite(enabled: boolean): void {
		DiskFileSystemProvider.canFlush = enabled;
	}

	async open(resource: URI, opts: IFileOpenOptions, disableWriteLock?: boolean): Promise<number> {
		const filePath = this.toFilePath(resource);

		// Writes: guard multiple writes to the same resource
		// behind a single lock to prevent races when writing
		// from multiple places at the same time to the same file
		let lock: IDisposable | undefined = undefined;
		if (isFileOpenForWriteOptions(opts) && !disableWriteLock) {
			lock = await this.createResourceLock(resource);
		}

		let fd: number | undefined = undefined;
		try {

			// Determine whether to unlock the file (write only)
			if (isFileOpenForWriteOptions(opts) && opts.unlock) {
				try {
					const { stat } = await SymlinkSupport.stat(filePath);
					if (!(stat.mode & 0o200 /* File mode indicating writable by owner */)) {
						await promises.chmod(filePath, stat.mode | 0o200);
					}
				} catch (error) {
					if (error.code !== 'ENOENT') {
						this.logService.trace(error); // log errors but do not give up writing
					}
				}
			}

			// Windows gets special treatment (write only)
			if (isWindows && isFileOpenForWriteOptions(opts)) {
				try {

					// We try to use 'r+' for opening (which will fail if the file does not exist)
					// to prevent issues when saving hidden files or preserving alternate data
					// streams.
					// Related issues:
					// - https://github.com/microsoft/vscode/issues/931
					// - https://github.com/microsoft/vscode/issues/6363
					fd = await Promises.open(filePath, 'r+');

					// The flag 'r+' will not truncate the file, so we have to do this manually
					await Promises.ftruncate(fd, 0);
				} catch (error) {
					if (error.code !== 'ENOENT') {
						this.logService.trace(error); // log errors but do not give up writing
					}

					// Make sure to close the file handle if we have one
					if (typeof fd === 'number') {
						try {
							await Promises.close(fd);
						} catch (error) {
							this.logService.trace(error); // log errors but do not give up writing
						}

						// Reset `fd` to be able to try again with 'w'
						fd = undefined;
					}
				}
			}

			if (typeof fd !== 'number') {
				fd = await Promises.open(filePath, isFileOpenForWriteOptions(opts) ?
					// We take `opts.create` as a hint that the file is opened for writing
					// as such we use 'w' to truncate an existing or create the
					// file otherwise. we do not allow reading.
					'w' :
					// Otherwise we assume the file is opened for reading
					// as such we use 'r' to neither truncate, nor create
					// the file.
					'r'
				);
			}

		} catch (error) {

			// Release lock because we have no valid handle
			// if we did open a lock during this operation
			lock?.dispose();

			// Rethrow as file system provider error
			if (isFileOpenForWriteOptions(opts)) {
				throw await this.toFileSystemProviderWriteError(resource, error);
			} else {
				throw this.toFileSystemProviderError(error);
			}
		}

		// Remember this handle to track file position of the handle
		// we init the position to 0 since the file descriptor was
		// just created and the position was not moved so far (see
		// also http://man7.org/linux/man-pages/man2/open.2.html -
		// "The file offset is set to the beginning of the file.")
		this.mapHandleToPos.set(fd, 0);

		// remember that this handle was used for writing
		if (isFileOpenForWriteOptions(opts)) {
			this.writeHandles.set(fd, resource);
		}

		if (lock) {
			const previousLock = this.mapHandleToLock.get(fd);

			// Remember that this handle has an associated lock
			this.traceLock(`[Disk FileSystemProvider]: open() - storing lock for handle ${fd} (${filePath})`);
			this.mapHandleToLock.set(fd, lock);

			// There is a slight chance that a resource lock for a
			// handle was not yet disposed when we acquire a new
			// lock, so we must ensure to dispose the previous lock
			// before storing a new one for the same handle, other
			// wise we end up in a deadlock situation
			// https://github.com/microsoft/vscode/issues/142462
			if (previousLock) {
				this.traceLock(`[Disk FileSystemProvider]: open() - disposing a previous lock that was still stored on same handle ${fd} (${filePath})`);
				previousLock.dispose();
			}
		}

		return fd;
	}

	async close(fd: number): Promise<void> {

		// It is very important that we keep any associated lock
		// for the file handle before attempting to call `fs.close(fd)`
		// because of a possible race condition: as soon as a file
		// handle is released, the OS may assign the same handle to
		// the next `fs.open` call and as such it is possible that our
		// lock is getting overwritten
		const lockForHandle = this.mapHandleToLock.get(fd);

		try {

			// Remove this handle from map of positions
			this.mapHandleToPos.delete(fd);

			// If a handle is closed that was used for writing, ensure
			// to flush the contents to disk if possible.
			if (this.writeHandles.delete(fd) && DiskFileSystemProvider.canFlush) {
				try {
					await Promises.fdatasync(fd); // https://github.com/microsoft/vscode/issues/9589
				} catch (error) {
					// In some exotic setups it is well possible that node fails to sync
					// In that case we disable flushing and log the error to our logger
					DiskFileSystemProvider.configureFlushOnWrite(false);
					this.logService.error(error);
				}
			}

			return await Promises.close(fd);
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		} finally {
			if (lockForHandle) {
				if (this.mapHandleToLock.get(fd) === lockForHandle) {
					this.traceLock(`[Disk FileSystemProvider]: close() - resource lock removed from handle-lock map ${fd}`);
					this.mapHandleToLock.delete(fd); // only delete from map if this is still our lock!
				}

				this.traceLock(`[Disk FileSystemProvider]: close() - disposing lock for handle ${fd}`);
				lockForHandle.dispose();
			}
		}
	}

	async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const normalizedPos = this.normalizePos(fd, pos);

		let bytesRead: number | null = null;
		try {
			bytesRead = (await Promises.read(fd, data, offset, length, normalizedPos)).bytesRead;
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		} finally {
			this.updatePos(fd, normalizedPos, bytesRead);
		}

		return bytesRead;
	}

	private normalizePos(fd: number, pos: number): number | null {

		// When calling fs.read/write we try to avoid passing in the "pos" argument and
		// rather prefer to pass in "null" because this avoids an extra seek(pos)
		// call that in some cases can even fail (e.g. when opening a file over FTP -
		// see https://github.com/microsoft/vscode/issues/73884).
		//
		// as such, we compare the passed in position argument with our last known
		// position for the file descriptor and use "null" if they match.
		if (pos === this.mapHandleToPos.get(fd)) {
			return null;
		}

		return pos;
	}

	private updatePos(fd: number, pos: number | null, bytesLength: number | null): void {
		const lastKnownPos = this.mapHandleToPos.get(fd);
		if (typeof lastKnownPos === 'number') {

			// pos !== null signals that previously a position was used that is
			// not null. node.js documentation explains, that in this case
			// the internal file pointer is not moving and as such we do not move
			// our position pointer.
			//
			// Docs: "If position is null, data will be read from the current file position,
			// and the file position will be updated. If position is an integer, the file position
			// will remain unchanged."
			if (typeof pos === 'number') {
				// do not modify the position
			}

			// bytesLength = number is a signal that the read/write operation was
			// successful and as such we need to advance the position in the Map
			//
			// Docs (http://man7.org/linux/man-pages/man2/read.2.html):
			// "On files that support seeking, the read operation commences at the
			// file offset, and the file offset is incremented by the number of
			// bytes read."
			//
			// Docs (http://man7.org/linux/man-pages/man2/write.2.html):
			// "For a seekable file (i.e., one to which lseek(2) may be applied, for
			// example, a regular file) writing takes place at the file offset, and
			// the file offset is incremented by the number of bytes actually
			// written."
			else if (typeof bytesLength === 'number') {
				this.mapHandleToPos.set(fd, lastKnownPos + bytesLength);
			}

			// bytesLength = null signals an error in the read/write operation
			// and as such we drop the handle from the Map because the position
			// is unspecificed at this point.
			else {
				this.mapHandleToPos.delete(fd);
			}
		}
	}

	async write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {

		// We know at this point that the file to write to is truncated and thus empty
		// if the write now fails, the file remains empty. as such we really try hard
		// to ensure the write succeeds by retrying up to three times.
		return retry(() => this.doWrite(fd, pos, data, offset, length), 100 /* ms delay */, 3 /* retries */);
	}

	private async doWrite(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const normalizedPos = this.normalizePos(fd, pos);

		let bytesWritten: number | null = null;
		try {
			bytesWritten = (await Promises.write(fd, data, offset, length, normalizedPos)).bytesWritten;
		} catch (error) {
			throw await this.toFileSystemProviderWriteError(this.writeHandles.get(fd), error);
		} finally {
			this.updatePos(fd, normalizedPos, bytesWritten);
		}

		return bytesWritten;
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	async mkdir(resource: URI): Promise<void> {
		try {
			await promises.mkdir(this.toFilePath(resource));
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		try {
			const filePath = this.toFilePath(resource);
			if (opts.recursive) {
				let rmMoveToPath: string | undefined = undefined;
				if (opts?.atomic !== false && opts.atomic.postfix) {
					rmMoveToPath = join(dirname(filePath), `${basename(filePath)}${opts.atomic.postfix}`);
				}

				await Promises.rm(filePath, RimRafMode.MOVE, rmMoveToPath);
			} else {
				try {
					await promises.unlink(filePath);
				} catch (unlinkError) {

					// `fs.unlink` will throw when used on directories
					// we try to detect this error and then see if the
					// provided resource is actually a directory. in that
					// case we use `fs.rmdir` to delete the directory.

					if (unlinkError.code === 'EPERM' || unlinkError.code === 'EISDIR') {
						let isDirectory = false;
						try {
							const { stat, symbolicLink } = await SymlinkSupport.stat(filePath);
							isDirectory = stat.isDirectory() && !symbolicLink;
						} catch (statError) {
							// ignore
						}

						if (isDirectory) {
							await promises.rmdir(filePath);
						} else {
							throw unlinkError;
						}
					} else {
						throw unlinkError;
					}
				}
			}
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		const fromFilePath = this.toFilePath(from);
		const toFilePath = this.toFilePath(to);

		if (fromFilePath === toFilePath) {
			return; // simulate node.js behaviour here and do a no-op if paths match
		}

		try {

			// Validate the move operation can perform
			await this.validateMoveCopy(from, to, 'move', opts.overwrite);

			// Rename
			await Promises.rename(fromFilePath, toFilePath);
		} catch (error) {

			// Rewrite some typical errors that can happen especially around symlinks
			// to something the user can better understand
			if (error.code === 'EINVAL' || error.code === 'EBUSY' || error.code === 'ENAMETOOLONG') {
				error = new Error(localize('moveError', "Unable to move '{0}' into '{1}' ({2}).", basename(fromFilePath), basename(dirname(toFilePath)), error.toString()));
			}

			throw this.toFileSystemProviderError(error);
		}
	}

	async copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		const fromFilePath = this.toFilePath(from);
		const toFilePath = this.toFilePath(to);

		if (fromFilePath === toFilePath) {
			return; // simulate node.js behaviour here and do a no-op if paths match
		}

		try {

			// Validate the copy operation can perform
			await this.validateMoveCopy(from, to, 'copy', opts.overwrite);

			// Copy
			await Promises.copy(fromFilePath, toFilePath, { preserveSymlinks: true });
		} catch (error) {

			// Rewrite some typical errors that can happen especially around symlinks
			// to something the user can better understand
			if (error.code === 'EINVAL' || error.code === 'EBUSY' || error.code === 'ENAMETOOLONG') {
				error = new Error(localize('copyError', "Unable to copy '{0}' into '{1}' ({2}).", basename(fromFilePath), basename(dirname(toFilePath)), error.toString()));
			}

			throw this.toFileSystemProviderError(error);
		}
	}

	private async validateMoveCopy(from: URI, to: URI, mode: 'move' | 'copy', overwrite?: boolean): Promise<void> {
		const fromFilePath = this.toFilePath(from);
		const toFilePath = this.toFilePath(to);

		let isSameResourceWithDifferentPathCase = false;
		const isPathCaseSensitive = !!(this.capabilities & FileSystemProviderCapabilities.PathCaseSensitive);
		if (!isPathCaseSensitive) {
			isSameResourceWithDifferentPathCase = isEqual(fromFilePath, toFilePath, true /* ignore case */);
		}

		if (isSameResourceWithDifferentPathCase) {

			// You cannot copy the same file to the same location with different
			// path case unless you are on a case sensitive file system
			if (mode === 'copy') {
				throw createFileSystemProviderError(localize('fileCopyErrorPathCase', "File cannot be copied to same path with different path case"), FileSystemProviderErrorCode.FileExists);
			}

			// You can move the same file to the same location with different
			// path case on case insensitive file systems
			else if (mode === 'move') {
				return;
			}
		}

		// Here we have to see if the target to move/copy to exists or not.
		// We need to respect the `overwrite` option to throw in case the
		// target exists.

		const fromStat = await this.statIgnoreError(from);
		if (!fromStat) {
			throw createFileSystemProviderError(localize('fileMoveCopyErrorNotFound', "File to move/copy does not exist"), FileSystemProviderErrorCode.FileNotFound);
		}

		const toStat = await this.statIgnoreError(to);
		if (!toStat) {
			return; // target does not exist so we are good
		}

		if (!overwrite) {
			throw createFileSystemProviderError(localize('fileMoveCopyErrorExists', "File at target already exists and thus will not be moved/copied to unless overwrite is specified"), FileSystemProviderErrorCode.FileExists);
		}

		// Handle existing target for move/copy
		if ((fromStat.type & FileType.File) !== 0 && (toStat.type & FileType.File) !== 0) {
			return; // node.js can move/copy a file over an existing file without having to delete it first
		} else {
			await this.delete(to, { recursive: true, useTrash: false, atomic: false });
		}
	}

	//#endregion

	//#region Clone File

	async cloneFile(from: URI, to: URI): Promise<void> {
		return this.doCloneFile(from, to, false /* optimistically assume parent folders exist */);
	}

	private async doCloneFile(from: URI, to: URI, mkdir: boolean): Promise<void> {
		const fromFilePath = this.toFilePath(from);
		const toFilePath = this.toFilePath(to);

		const isPathCaseSensitive = !!(this.capabilities & FileSystemProviderCapabilities.PathCaseSensitive);
		if (isEqual(fromFilePath, toFilePath, !isPathCaseSensitive)) {
			return; // cloning is only supported `from` and `to` are different files
		}

		// Implement clone by using `fs.copyFile`, however setup locks
		// for both `from` and `to` because node.js does not ensure
		// this to be an atomic operation

		const locks = new DisposableStore();

		try {
			locks.add(await this.createResourceLock(from));
			locks.add(await this.createResourceLock(to));

			if (mkdir) {
				await promises.mkdir(dirname(toFilePath), { recursive: true });
			}

			await promises.copyFile(fromFilePath, toFilePath);
		} catch (error) {
			if (error.code === 'ENOENT' && !mkdir) {
				return this.doCloneFile(from, to, true);
			}

			throw this.toFileSystemProviderError(error);
		} finally {
			locks.dispose();
		}
	}

	//#endregion

	//#region File Watching

	protected createUniversalWatcher(
		onChange: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	): AbstractUniversalWatcherClient {
		return new UniversalWatcherClient(changes => onChange(changes), msg => onLogMessage(msg), verboseLogging);
	}

	protected createNonRecursiveWatcher(
		onChange: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	): AbstractNonRecursiveWatcherClient {
		return new NodeJSWatcherClient(changes => onChange(changes), msg => onLogMessage(msg), verboseLogging);
	}

	//#endregion

	//#region Helpers

	private toFileSystemProviderError(error: NodeJS.ErrnoException): FileSystemProviderError {
		if (error instanceof FileSystemProviderError) {
			return error; // avoid double conversion
		}

		let resultError: Error | string = error;
		let code: FileSystemProviderErrorCode;
		switch (error.code) {
			case 'ENOENT':
				code = FileSystemProviderErrorCode.FileNotFound;
				break;
			case 'EISDIR':
				code = FileSystemProviderErrorCode.FileIsADirectory;
				break;
			case 'ENOTDIR':
				code = FileSystemProviderErrorCode.FileNotADirectory;
				break;
			case 'EEXIST':
				code = FileSystemProviderErrorCode.FileExists;
				break;
			case 'EPERM':
			case 'EACCES':
				code = FileSystemProviderErrorCode.NoPermissions;
				break;
			case 'ERR_UNC_HOST_NOT_ALLOWED':
				resultError = `${error.message}. Please update the 'security.allowedUNCHosts' setting if you want to allow this host.`;
				code = FileSystemProviderErrorCode.Unknown;
				break;
			default:
				code = FileSystemProviderErrorCode.Unknown;
		}

		return createFileSystemProviderError(resultError, code);
	}

	private async toFileSystemProviderWriteError(resource: URI | undefined, error: NodeJS.ErrnoException): Promise<FileSystemProviderError> {
		let fileSystemProviderWriteError = this.toFileSystemProviderError(error);

		// If the write error signals permission issues, we try
		// to read the file's mode to see if the file is write
		// locked.
		if (resource && fileSystemProviderWriteError.code === FileSystemProviderErrorCode.NoPermissions) {
			try {
				const { stat } = await SymlinkSupport.stat(this.toFilePath(resource));
				if (!(stat.mode & 0o200 /* File mode indicating writable by owner */)) {
					fileSystemProviderWriteError = createFileSystemProviderError(error, FileSystemProviderErrorCode.FileWriteLocked);
				}
			} catch (error) {
				this.logService.trace(error); // ignore - return original error
			}
		}

		return fileSystemProviderWriteError;
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/diskFileSystemProviderServer.ts]---
Location: vscode-main/src/vs/platform/files/node/diskFileSystemProviderServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { DiskFileSystemProvider } from './diskFileSystemProvider.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { ReadableStreamEventPayload, listenStream } from '../../../base/common/stream.js';
import { IStat, IFileReadStreamOptions, IFileWriteOptions, IFileOpenOptions, IFileDeleteOptions, IFileOverwriteOptions, IFileChange, IWatchOptions, FileType, IFileAtomicReadOptions } from '../common/files.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IRecursiveWatcherOptions } from '../common/watcher.js';

export interface ISessionFileWatcher extends IDisposable {
	watch(req: number, resource: URI, opts: IWatchOptions): IDisposable;
}

/**
 * A server implementation for a IPC based file system provider client.
 */
export abstract class AbstractDiskFileSystemProviderChannel<T> extends Disposable implements IServerChannel<T> {

	constructor(
		protected readonly provider: DiskFileSystemProvider,
		protected readonly logService: ILogService
	) {
		super();
	}

	call<TResult>(ctx: T, command: string, args: unknown[]): Promise<TResult> {
		const uriTransformer = this.getUriTransformer(ctx);

		switch (command) {
			case 'stat': return this.stat(uriTransformer, args[0] as UriComponents) as Promise<TResult>;
			case 'realpath': return this.realpath(uriTransformer, args[0] as UriComponents) as Promise<TResult>;
			case 'readdir': return this.readdir(uriTransformer, args[0] as UriComponents) as Promise<TResult>;
			case 'open': return this.open(uriTransformer, args[0] as UriComponents, args[1] as IFileOpenOptions) as Promise<TResult>;
			case 'close': return this.close(args[0] as number) as Promise<TResult>;
			case 'read': return this.read(args[0] as number, args[1] as number, args[2] as number) as Promise<TResult>;
			case 'readFile': return this.readFile(uriTransformer, args[0] as UriComponents, args[1] as IFileAtomicReadOptions) as Promise<TResult>;
			case 'write': return this.write(args[0] as number, args[1] as number, args[2] as VSBuffer, args[3] as number, args[4] as number) as Promise<TResult>;
			case 'writeFile': return this.writeFile(uriTransformer, args[0] as UriComponents, args[1] as VSBuffer, args[2] as IFileWriteOptions) as Promise<TResult>;
			case 'rename': return this.rename(uriTransformer, args[0] as UriComponents, args[1] as UriComponents, args[2] as IFileOverwriteOptions) as Promise<TResult>;
			case 'copy': return this.copy(uriTransformer, args[0] as UriComponents, args[1] as UriComponents, args[2] as IFileOverwriteOptions) as Promise<TResult>;
			case 'cloneFile': return this.cloneFile(uriTransformer, args[0] as UriComponents, args[1] as UriComponents) as Promise<TResult>;
			case 'mkdir': return this.mkdir(uriTransformer, args[0] as UriComponents) as Promise<TResult>;
			case 'delete': return this.delete(uriTransformer, args[0] as UriComponents, args[1] as IFileDeleteOptions) as Promise<TResult>;
			case 'watch': return this.watch(uriTransformer, args[0] as string, args[1] as number, args[2] as UriComponents, args[3] as IWatchOptions) as Promise<TResult>;
			case 'unwatch': return this.unwatch(args[0] as string, args[1] as number) as Promise<TResult>;
		}

		throw new Error(`IPC Command ${command} not found`);
	}

	listen<TResult>(ctx: T, event: string, args: unknown[]): Event<TResult> {
		const uriTransformer = this.getUriTransformer(ctx);

		switch (event) {
			case 'fileChange': return this.onFileChange(uriTransformer, args[0] as string) as Event<TResult>;
			case 'readFileStream': return this.onReadFileStream(uriTransformer, args[0] as URI, args[1] as IFileReadStreamOptions) as Event<TResult>;
		}

		throw new Error(`Unknown event ${event}`);
	}

	protected abstract getUriTransformer(ctx: T): IURITransformer;

	protected abstract transformIncoming(uriTransformer: IURITransformer, _resource: UriComponents, supportVSCodeResource?: boolean): URI;

	//#region File Metadata Resolving

	private stat(uriTransformer: IURITransformer, _resource: UriComponents): Promise<IStat> {
		const resource = this.transformIncoming(uriTransformer, _resource, true);

		return this.provider.stat(resource);
	}

	private realpath(uriTransformer: IURITransformer, _resource: UriComponents): Promise<string> {
		const resource = this.transformIncoming(uriTransformer, _resource, true);

		return this.provider.realpath(resource);
	}

	private readdir(uriTransformer: IURITransformer, _resource: UriComponents): Promise<[string, FileType][]> {
		const resource = this.transformIncoming(uriTransformer, _resource);

		return this.provider.readdir(resource);
	}

	//#endregion

	//#region File Reading/Writing

	private async readFile(uriTransformer: IURITransformer, _resource: UriComponents, opts?: IFileAtomicReadOptions): Promise<VSBuffer> {
		const resource = this.transformIncoming(uriTransformer, _resource, true);
		const buffer = await this.provider.readFile(resource, opts);

		return VSBuffer.wrap(buffer);
	}

	private onReadFileStream(uriTransformer: IURITransformer, _resource: URI, opts: IFileReadStreamOptions): Event<ReadableStreamEventPayload<VSBuffer>> {
		const resource = this.transformIncoming(uriTransformer, _resource, true);
		const cts = new CancellationTokenSource();

		const emitter = new Emitter<ReadableStreamEventPayload<VSBuffer>>({
			onDidRemoveLastListener: () => {

				// Ensure to cancel the read operation when there is no more
				// listener on the other side to prevent unneeded work.
				cts.cancel();
			}
		});

		const fileStream = this.provider.readFileStream(resource, opts, cts.token);
		listenStream(fileStream, {
			onData: chunk => emitter.fire(VSBuffer.wrap(chunk)),
			onError: error => emitter.fire(error),
			onEnd: () => {

				// Forward event
				emitter.fire('end');

				// Cleanup
				emitter.dispose();
				cts.dispose();
			}
		});

		return emitter.event;
	}

	private writeFile(uriTransformer: IURITransformer, _resource: UriComponents, content: VSBuffer, opts: IFileWriteOptions): Promise<void> {
		const resource = this.transformIncoming(uriTransformer, _resource);

		return this.provider.writeFile(resource, content.buffer, opts);
	}

	private open(uriTransformer: IURITransformer, _resource: UriComponents, opts: IFileOpenOptions): Promise<number> {
		const resource = this.transformIncoming(uriTransformer, _resource, true);

		return this.provider.open(resource, opts);
	}

	private close(fd: number): Promise<void> {
		return this.provider.close(fd);
	}

	private async read(fd: number, pos: number, length: number): Promise<[VSBuffer, number]> {
		const buffer = VSBuffer.alloc(length);
		const bufferOffset = 0; // offset is 0 because we create a buffer to read into for each call
		const bytesRead = await this.provider.read(fd, pos, buffer.buffer, bufferOffset, length);

		return [buffer, bytesRead];
	}

	private write(fd: number, pos: number, data: VSBuffer, offset: number, length: number): Promise<number> {
		return this.provider.write(fd, pos, data.buffer, offset, length);
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	private mkdir(uriTransformer: IURITransformer, _resource: UriComponents): Promise<void> {
		const resource = this.transformIncoming(uriTransformer, _resource);

		return this.provider.mkdir(resource);
	}

	protected delete(uriTransformer: IURITransformer, _resource: UriComponents, opts: IFileDeleteOptions): Promise<void> {
		const resource = this.transformIncoming(uriTransformer, _resource);

		return this.provider.delete(resource, opts);
	}

	private rename(uriTransformer: IURITransformer, _source: UriComponents, _target: UriComponents, opts: IFileOverwriteOptions): Promise<void> {
		const source = this.transformIncoming(uriTransformer, _source);
		const target = this.transformIncoming(uriTransformer, _target);

		return this.provider.rename(source, target, opts);
	}

	private copy(uriTransformer: IURITransformer, _source: UriComponents, _target: UriComponents, opts: IFileOverwriteOptions): Promise<void> {
		const source = this.transformIncoming(uriTransformer, _source);
		const target = this.transformIncoming(uriTransformer, _target);

		return this.provider.copy(source, target, opts);
	}

	//#endregion

	//#region Clone File

	private cloneFile(uriTransformer: IURITransformer, _source: UriComponents, _target: UriComponents): Promise<void> {
		const source = this.transformIncoming(uriTransformer, _source);
		const target = this.transformIncoming(uriTransformer, _target);

		return this.provider.cloneFile(source, target);
	}

	//#endregion

	//#region File Watching

	private readonly sessionToWatcher = new Map<string /* session ID */, ISessionFileWatcher>();
	private readonly watchRequests = new Map<string /* session ID + request ID */, IDisposable>();

	private onFileChange(uriTransformer: IURITransformer, sessionId: string): Event<IFileChange[] | string> {

		// We want a specific emitter for the given session so that events
		// from the one session do not end up on the other session. As such
		// we create a `SessionFileWatcher` and a `Emitter` for that session.

		const emitter = new Emitter<IFileChange[] | string>({
			onWillAddFirstListener: () => {
				this.sessionToWatcher.set(sessionId, this.createSessionFileWatcher(uriTransformer, emitter));
			},
			onDidRemoveLastListener: () => {
				dispose(this.sessionToWatcher.get(sessionId));
				this.sessionToWatcher.delete(sessionId);
			}
		});

		return emitter.event;
	}

	private async watch(uriTransformer: IURITransformer, sessionId: string, req: number, _resource: UriComponents, opts: IWatchOptions): Promise<void> {
		const watcher = this.sessionToWatcher.get(sessionId);
		if (watcher) {
			const resource = this.transformIncoming(uriTransformer, _resource);
			const disposable = watcher.watch(req, resource, opts);
			this.watchRequests.set(sessionId + req, disposable);
		}
	}

	private async unwatch(sessionId: string, req: number): Promise<void> {
		const id = sessionId + req;
		const disposable = this.watchRequests.get(id);
		if (disposable) {
			dispose(disposable);
			this.watchRequests.delete(id);
		}
	}

	protected abstract createSessionFileWatcher(uriTransformer: IURITransformer, emitter: Emitter<IFileChange[] | string>): ISessionFileWatcher;

	//#endregion

	override dispose(): void {
		super.dispose();

		for (const [, disposable] of this.watchRequests) {
			disposable.dispose();
		}
		this.watchRequests.clear();

		for (const [, disposable] of this.sessionToWatcher) {
			disposable.dispose();
		}
		this.sessionToWatcher.clear();
	}
}

export abstract class AbstractSessionFileWatcher extends Disposable implements ISessionFileWatcher {

	private readonly watcherRequests = new Map<number, IDisposable>();

	// To ensure we use one file watcher per session, we keep a
	// disk file system provider instantiated for this session.
	// The provider is cheap and only stateful when file watching
	// starts.
	//
	// This is important because we want to ensure that we only
	// forward events from the watched paths for this session and
	// not other clients that asked to watch other paths.
	private readonly fileWatcher: DiskFileSystemProvider;

	constructor(
		private readonly uriTransformer: IURITransformer,
		sessionEmitter: Emitter<IFileChange[] | string>,
		logService: ILogService,
		private readonly environmentService: IEnvironmentService
	) {
		super();

		this.fileWatcher = this._register(new DiskFileSystemProvider(logService));

		this.registerListeners(sessionEmitter);
	}

	private registerListeners(sessionEmitter: Emitter<IFileChange[] | string>): void {
		const localChangeEmitter = this._register(new Emitter<readonly IFileChange[]>());

		this._register(localChangeEmitter.event((events) => {
			sessionEmitter.fire(
				events.map(e => ({
					resource: this.uriTransformer.transformOutgoingURI(e.resource),
					type: e.type,
					cId: e.cId
				}))
			);
		}));

		this._register(this.fileWatcher.onDidChangeFile(events => localChangeEmitter.fire(events)));
		this._register(this.fileWatcher.onDidWatchError(error => sessionEmitter.fire(error)));
	}

	protected getRecursiveWatcherOptions(environmentService: IEnvironmentService): IRecursiveWatcherOptions | undefined {
		return undefined; // subclasses can override
	}

	protected getExtraExcludes(environmentService: IEnvironmentService): string[] | undefined {
		return undefined; // subclasses can override
	}

	watch(req: number, resource: URI, opts: IWatchOptions): IDisposable {
		const extraExcludes = this.getExtraExcludes(this.environmentService);
		if (Array.isArray(extraExcludes)) {
			opts.excludes = [...opts.excludes, ...extraExcludes];
		}

		this.watcherRequests.set(req, this.fileWatcher.watch(resource, opts));

		return toDisposable(() => {
			dispose(this.watcherRequests.get(req));
			this.watcherRequests.delete(req);
		});
	}

	override dispose(): void {
		for (const [, disposable] of this.watcherRequests) {
			disposable.dispose();
		}
		this.watcherRequests.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/baseWatcher.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/baseWatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { watchFile, unwatchFile, Stats } from 'fs';
import { Disposable, DisposableMap, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ILogMessage, IRecursiveWatcherWithSubscribe, IUniversalWatchRequest, IWatchRequestWithCorrelation, IWatcher, IWatcherErrorEvent, isWatchRequestWithCorrelation, requestFilterToString } from '../../common/watcher.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { FileChangeType, IFileChange } from '../../common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { DeferredPromise, ThrottledDelayer } from '../../../../base/common/async.js';
import { hash } from '../../../../base/common/hash.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';

interface ISuspendedWatchRequest {
	readonly id: number;
	readonly correlationId: number | undefined;
	readonly path: string;
}

export abstract class BaseWatcher extends Disposable implements IWatcher {

	protected readonly _onDidChangeFile = this._register(new Emitter<IFileChange[]>());
	readonly onDidChangeFile = this._onDidChangeFile.event;

	protected readonly _onDidLogMessage = this._register(new Emitter<ILogMessage>());
	readonly onDidLogMessage = this._onDidLogMessage.event;

	protected readonly _onDidWatchFail = this._register(new Emitter<IUniversalWatchRequest>());
	private readonly onDidWatchFail = this._onDidWatchFail.event;

	private readonly correlatedWatchRequests = new Map<number /* request ID */, IWatchRequestWithCorrelation>();
	private readonly nonCorrelatedWatchRequests = new Map<number /* request ID */, IUniversalWatchRequest>();

	private readonly suspendedWatchRequests = this._register(new DisposableMap<number /* request ID */>());
	private readonly suspendedWatchRequestsWithPolling = new Set<number /* request ID */>();

	private readonly updateWatchersDelayer = this._register(new ThrottledDelayer<void>(this.getUpdateWatchersDelay()));

	protected readonly suspendedWatchRequestPollingInterval: number = 5007; // node.js default

	private joinWatch = new DeferredPromise<void>();

	constructor() {
		super();

		this._register(this.onDidWatchFail(request => this.suspendWatchRequest({
			id: this.computeId(request),
			correlationId: this.isCorrelated(request) ? request.correlationId : undefined,
			path: request.path
		})));
	}

	protected isCorrelated(request: IUniversalWatchRequest): request is IWatchRequestWithCorrelation {
		return isWatchRequestWithCorrelation(request);
	}

	private computeId(request: IUniversalWatchRequest): number {
		if (this.isCorrelated(request)) {
			return request.correlationId;
		} else {
			// Requests without correlation do not carry any unique identifier, so we have to
			// come up with one based on the options of the request. This matches what the
			// file service does (vs/platform/files/common/fileService.ts#L1178).
			return hash(request);
		}
	}

	async watch(requests: IUniversalWatchRequest[]): Promise<void> {
		if (!this.joinWatch.isSettled) {
			this.joinWatch.complete();
		}
		this.joinWatch = new DeferredPromise<void>();

		try {
			this.correlatedWatchRequests.clear();
			this.nonCorrelatedWatchRequests.clear();

			// Figure out correlated vs. non-correlated requests
			for (const request of requests) {
				if (this.isCorrelated(request)) {
					this.correlatedWatchRequests.set(request.correlationId, request);
				} else {
					this.nonCorrelatedWatchRequests.set(this.computeId(request), request);
				}
			}

			// Remove all suspended watch requests that are no longer watched
			for (const [id] of this.suspendedWatchRequests) {
				if (!this.nonCorrelatedWatchRequests.has(id) && !this.correlatedWatchRequests.has(id)) {
					this.suspendedWatchRequests.deleteAndDispose(id);
					this.suspendedWatchRequestsWithPolling.delete(id);
				}
			}

			return await this.updateWatchers(false /* not delayed */);
		} finally {
			this.joinWatch.complete();
		}
	}

	private updateWatchers(delayed: boolean): Promise<void> {
		const nonSuspendedRequests: IUniversalWatchRequest[] = [];
		for (const [id, request] of [...this.nonCorrelatedWatchRequests, ...this.correlatedWatchRequests]) {
			if (!this.suspendedWatchRequests.has(id)) {
				nonSuspendedRequests.push(request);
			}
		}

		return this.updateWatchersDelayer.trigger(() => this.doWatch(nonSuspendedRequests), delayed ? this.getUpdateWatchersDelay() : 0).catch(error => onUnexpectedError(error));
	}

	protected getUpdateWatchersDelay(): number {
		return 800;
	}

	isSuspended(request: IUniversalWatchRequest): 'polling' | boolean {
		const id = this.computeId(request);
		return this.suspendedWatchRequestsWithPolling.has(id) ? 'polling' : this.suspendedWatchRequests.has(id);
	}

	private async suspendWatchRequest(request: ISuspendedWatchRequest): Promise<void> {
		if (this.suspendedWatchRequests.has(request.id)) {
			return; // already suspended
		}

		const disposables = new DisposableStore();
		this.suspendedWatchRequests.set(request.id, disposables);

		// It is possible that a watch request fails right during watch()
		// phase while other requests succeed. To increase the chance of
		// reusing another watcher for suspend/resume tracking, we await
		// all watch requests having processed.

		await this.joinWatch.p;

		if (disposables.isDisposed) {
			return;
		}

		this.monitorSuspendedWatchRequest(request, disposables);

		this.updateWatchers(true /* delay this call as we might accumulate many failing watch requests on startup */);
	}

	private resumeWatchRequest(request: ISuspendedWatchRequest): void {
		this.suspendedWatchRequests.deleteAndDispose(request.id);
		this.suspendedWatchRequestsWithPolling.delete(request.id);

		this.updateWatchers(false);
	}

	private monitorSuspendedWatchRequest(request: ISuspendedWatchRequest, disposables: DisposableStore): void {
		if (this.doMonitorWithExistingWatcher(request, disposables)) {
			this.trace(`reusing an existing recursive watcher to monitor ${request.path}`);
			this.suspendedWatchRequestsWithPolling.delete(request.id);
		} else {
			this.doMonitorWithNodeJS(request, disposables);
			this.suspendedWatchRequestsWithPolling.add(request.id);
		}
	}

	private doMonitorWithExistingWatcher(request: ISuspendedWatchRequest, disposables: DisposableStore): boolean {
		const subscription = this.recursiveWatcher?.subscribe(request.path, (error, change) => {
			if (disposables.isDisposed) {
				return; // return early if already disposed
			}

			if (error) {
				this.monitorSuspendedWatchRequest(request, disposables);
			} else if (change?.type === FileChangeType.ADDED) {
				this.onMonitoredPathAdded(request);
			}
		});

		if (subscription) {
			disposables.add(subscription);

			return true;
		}

		return false;
	}

	private doMonitorWithNodeJS(request: ISuspendedWatchRequest, disposables: DisposableStore): void {
		let pathNotFound = false;

		const watchFileCallback: (curr: Stats, prev: Stats) => void = (curr, prev) => {
			if (disposables.isDisposed) {
				return; // return early if already disposed
			}

			const currentPathNotFound = this.isPathNotFound(curr);
			const previousPathNotFound = this.isPathNotFound(prev);
			const oldPathNotFound = pathNotFound;
			pathNotFound = currentPathNotFound;

			// Watch path created: resume watching request
			if (!currentPathNotFound && (previousPathNotFound || oldPathNotFound)) {
				this.onMonitoredPathAdded(request);
			}
		};

		this.trace(`starting fs.watchFile() on ${request.path} (correlationId: ${request.correlationId})`);
		try {
			watchFile(request.path, { persistent: false, interval: this.suspendedWatchRequestPollingInterval }, watchFileCallback);
		} catch (error) {
			this.warn(`fs.watchFile() failed with error ${error} on path ${request.path} (correlationId: ${request.correlationId})`);
		}

		disposables.add(toDisposable(() => {
			this.trace(`stopping fs.watchFile() on ${request.path} (correlationId: ${request.correlationId})`);

			try {
				unwatchFile(request.path, watchFileCallback);
			} catch (error) {
				this.warn(`fs.unwatchFile() failed with error ${error} on path ${request.path} (correlationId: ${request.correlationId})`);
			}
		}));
	}

	private onMonitoredPathAdded(request: ISuspendedWatchRequest): void {
		this.trace(`detected ${request.path} exists again, resuming watcher (correlationId: ${request.correlationId})`);

		// Emit as event
		const event: IFileChange = { resource: URI.file(request.path), type: FileChangeType.ADDED, cId: request.correlationId };
		this._onDidChangeFile.fire([event]);
		this.traceEvent(event, request);

		// Resume watching
		this.resumeWatchRequest(request);
	}

	private isPathNotFound(stats: Stats): boolean {
		return stats.ctimeMs === 0 && stats.ino === 0;
	}

	async stop(): Promise<void> {
		this.suspendedWatchRequests.clearAndDisposeAll();
		this.suspendedWatchRequestsWithPolling.clear();
	}

	protected traceEvent(event: IFileChange, request: IUniversalWatchRequest | ISuspendedWatchRequest): void {
		if (this.verboseLogging) {
			const traceMsg = ` >> normalized ${event.type === FileChangeType.ADDED ? '[ADDED]' : event.type === FileChangeType.DELETED ? '[DELETED]' : '[CHANGED]'} ${event.resource.fsPath}`;
			this.traceWithCorrelation(traceMsg, request);
		}
	}

	protected traceWithCorrelation(message: string, request: IUniversalWatchRequest | ISuspendedWatchRequest): void {
		if (this.verboseLogging) {
			this.trace(`${message}${typeof request.correlationId === 'number' ? ` <${request.correlationId}> ` : ``}`);
		}
	}

	protected requestToString(request: IUniversalWatchRequest): string {
		return `${request.path} (excludes: ${request.excludes.length > 0 ? request.excludes : '<none>'}, includes: ${request.includes && request.includes.length > 0 ? JSON.stringify(request.includes) : '<all>'}, filter: ${requestFilterToString(request.filter)}, correlationId: ${typeof request.correlationId === 'number' ? request.correlationId : '<none>'})`;
	}

	protected abstract doWatch(requests: IUniversalWatchRequest[]): Promise<void>;

	protected abstract readonly recursiveWatcher: IRecursiveWatcherWithSubscribe | undefined;

	protected abstract trace(message: string): void;
	protected abstract warn(message: string): void;

	abstract onDidError: Event<IWatcherErrorEvent>;

	protected verboseLogging = false;

	async setVerboseLogging(enabled: boolean): Promise<void> {
		this.verboseLogging = enabled;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/watcher.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/watcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILogMessage, isRecursiveWatchRequest, IUniversalWatcher, IUniversalWatchRequest } from '../../common/watcher.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ParcelWatcher } from './parcel/parcelWatcher.js';
import { NodeJSWatcher } from './nodejs/nodejsWatcher.js';
import { Promises } from '../../../../base/common/async.js';
import { computeStats } from './watcherStats.js';

export class UniversalWatcher extends Disposable implements IUniversalWatcher {

	private readonly recursiveWatcher = this._register(new ParcelWatcher());
	private readonly nonRecursiveWatcher = this._register(new NodeJSWatcher(this.recursiveWatcher));

	readonly onDidChangeFile = Event.any(this.recursiveWatcher.onDidChangeFile, this.nonRecursiveWatcher.onDidChangeFile);
	readonly onDidError = Event.any(this.recursiveWatcher.onDidError, this.nonRecursiveWatcher.onDidError);

	private readonly _onDidLogMessage = this._register(new Emitter<ILogMessage>());
	readonly onDidLogMessage = Event.any(this._onDidLogMessage.event, this.recursiveWatcher.onDidLogMessage, this.nonRecursiveWatcher.onDidLogMessage);

	private requests: IUniversalWatchRequest[] = [];
	private failedRecursiveRequests = 0;

	constructor() {
		super();

		this._register(this.recursiveWatcher.onDidError(e => {
			if (e.request) {
				this.failedRecursiveRequests++;
			}
		}));
	}

	async watch(requests: IUniversalWatchRequest[]): Promise<void> {
		this.requests = requests;
		this.failedRecursiveRequests = 0;

		// Watch recursively first to give recursive watchers a chance
		// to step in for non-recursive watch requests, thus reducing
		// watcher duplication.

		let error: Error | undefined;
		try {
			await this.recursiveWatcher.watch(requests.filter(request => isRecursiveWatchRequest(request)));
		} catch (e) {
			error = e;
		}

		try {
			await this.nonRecursiveWatcher.watch(requests.filter(request => !isRecursiveWatchRequest(request)));
		} catch (e) {
			if (!error) {
				error = e;
			}
		}

		if (error) {
			throw error;
		}
	}

	async setVerboseLogging(enabled: boolean): Promise<void> {

		// Log stats
		if (enabled && this.requests.length > 0) {
			this._onDidLogMessage.fire({ type: 'trace', message: computeStats(this.requests, this.failedRecursiveRequests, this.recursiveWatcher, this.nonRecursiveWatcher) });
		}

		// Forward to watchers
		await Promises.settled([
			this.recursiveWatcher.setVerboseLogging(enabled),
			this.nonRecursiveWatcher.setVerboseLogging(enabled)
		]);
	}

	async stop(): Promise<void> {
		await Promises.settled([
			this.recursiveWatcher.stop(),
			this.nonRecursiveWatcher.stop()
		]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/watcherClient.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/watcherClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { FileAccess } from '../../../../base/common/network.js';
import { getNextTickChannel, ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { Client } from '../../../../base/parts/ipc/node/ipc.cp.js';
import { IFileChange } from '../../common/files.js';
import { AbstractUniversalWatcherClient, ILogMessage, IUniversalWatcher } from '../../common/watcher.js';

export class UniversalWatcherClient extends AbstractUniversalWatcherClient {

	constructor(
		onFileChanges: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	) {
		super(onFileChanges, onLogMessage, verboseLogging);

		this.init();
	}

	protected override createWatcher(disposables: DisposableStore): IUniversalWatcher {

		// Fork the universal file watcher and build a client around
		// its server for passing over requests and receiving events.
		const client = disposables.add(new Client(
			FileAccess.asFileUri('bootstrap-fork').fsPath,
			{
				serverName: 'File Watcher',
				args: ['--type=fileWatcher'],
				env: {
					VSCODE_ESM_ENTRYPOINT: 'vs/platform/files/node/watcher/watcherMain',
					VSCODE_PIPE_LOGGING: 'true',
					VSCODE_VERBOSE_LOGGING: 'true' // transmit console logs from server to client
				}
			}
		));

		// React on unexpected termination of the watcher process
		disposables.add(client.onDidProcessExit(({ code, signal }) => this.onError(`terminated by itself with code ${code}, signal: ${signal} (ETERM)`)));

		return ProxyChannel.toService<IUniversalWatcher>(getNextTickChannel(client.getChannel('watcher')));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/watcherMain.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/watcherMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { Server as ChildProcessServer } from '../../../../base/parts/ipc/node/ipc.cp.js';
import { Server as UtilityProcessServer } from '../../../../base/parts/ipc/node/ipc.mp.js';
import { isUtilityProcess } from '../../../../base/parts/sandbox/node/electronTypes.js';
import { UniversalWatcher } from './watcher.js';

let server: ChildProcessServer<string> | UtilityProcessServer;
if (isUtilityProcess(process)) {
	server = new UtilityProcessServer();
} else {
	server = new ChildProcessServer('watcher');
}

const service = new UniversalWatcher();
server.registerChannel('watcher', ProxyChannel.fromService(service, new DisposableStore()));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/watcherStats.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/watcherStats.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INonRecursiveWatchRequest, IRecursiveWatchRequest, isRecursiveWatchRequest, IUniversalWatchRequest, requestFilterToString } from '../../common/watcher.js';
import { INodeJSWatcherInstance, NodeJSWatcher } from './nodejs/nodejsWatcher.js';
import { ParcelWatcher, ParcelWatcherInstance } from './parcel/parcelWatcher.js';

export function computeStats(
	requests: IUniversalWatchRequest[],
	failedRecursiveRequests: number,
	recursiveWatcher: ParcelWatcher,
	nonRecursiveWatcher: NodeJSWatcher
): string {
	const lines: string[] = [];

	const allRecursiveRequests = sortByPathPrefix(requests.filter(request => isRecursiveWatchRequest(request)));
	const nonSuspendedRecursiveRequests = allRecursiveRequests.filter(request => recursiveWatcher.isSuspended(request) === false);
	const suspendedPollingRecursiveRequests = allRecursiveRequests.filter(request => recursiveWatcher.isSuspended(request) === 'polling');
	const suspendedNonPollingRecursiveRequests = allRecursiveRequests.filter(request => recursiveWatcher.isSuspended(request) === true);

	const recursiveRequestsStatus = computeRequestStatus(allRecursiveRequests, recursiveWatcher);
	const recursiveWatcherStatus = computeRecursiveWatchStatus(recursiveWatcher);

	const allNonRecursiveRequests = sortByPathPrefix(requests.filter(request => !isRecursiveWatchRequest(request)));
	const nonSuspendedNonRecursiveRequests = allNonRecursiveRequests.filter(request => nonRecursiveWatcher.isSuspended(request) === false);
	const suspendedPollingNonRecursiveRequests = allNonRecursiveRequests.filter(request => nonRecursiveWatcher.isSuspended(request) === 'polling');
	const suspendedNonPollingNonRecursiveRequests = allNonRecursiveRequests.filter(request => nonRecursiveWatcher.isSuspended(request) === true);

	const nonRecursiveRequestsStatus = computeRequestStatus(allNonRecursiveRequests, nonRecursiveWatcher);
	const nonRecursiveWatcherStatus = computeNonRecursiveWatchStatus(nonRecursiveWatcher);

	lines.push('[Summary]');
	lines.push(`- Recursive Requests:     total: ${allRecursiveRequests.length}, suspended: ${recursiveRequestsStatus.suspended}, polling: ${recursiveRequestsStatus.polling}, failed: ${failedRecursiveRequests}`);
	lines.push(`- Non-Recursive Requests: total: ${allNonRecursiveRequests.length}, suspended: ${nonRecursiveRequestsStatus.suspended}, polling: ${nonRecursiveRequestsStatus.polling}`);
	lines.push(`- Recursive Watchers:     total: ${Array.from(recursiveWatcher.watchers).length}, active: ${recursiveWatcherStatus.active}, failed: ${recursiveWatcherStatus.failed}, stopped: ${recursiveWatcherStatus.stopped}`);
	lines.push(`- Non-Recursive Watchers: total: ${Array.from(nonRecursiveWatcher.watchers).length}, active: ${nonRecursiveWatcherStatus.active}, failed: ${nonRecursiveWatcherStatus.failed}, reusing: ${nonRecursiveWatcherStatus.reusing}`);
	lines.push(`- I/O Handles Impact:     total: ${recursiveRequestsStatus.polling + nonRecursiveRequestsStatus.polling + recursiveWatcherStatus.active + nonRecursiveWatcherStatus.active}`);

	lines.push(`\n[Recursive Requests (${allRecursiveRequests.length}, suspended: ${recursiveRequestsStatus.suspended}, polling: ${recursiveRequestsStatus.polling})]:`);
	const recursiveRequestLines: string[] = [];
	for (const request of [nonSuspendedRecursiveRequests, suspendedPollingRecursiveRequests, suspendedNonPollingRecursiveRequests].flat()) {
		fillRequestStats(recursiveRequestLines, request, recursiveWatcher);
	}
	lines.push(...alignTextColumns(recursiveRequestLines));

	const recursiveWatcheLines: string[] = [];
	fillRecursiveWatcherStats(recursiveWatcheLines, recursiveWatcher);
	lines.push(...alignTextColumns(recursiveWatcheLines));

	lines.push(`\n[Non-Recursive Requests (${allNonRecursiveRequests.length}, suspended: ${nonRecursiveRequestsStatus.suspended}, polling: ${nonRecursiveRequestsStatus.polling})]:`);
	const nonRecursiveRequestLines: string[] = [];
	for (const request of [nonSuspendedNonRecursiveRequests, suspendedPollingNonRecursiveRequests, suspendedNonPollingNonRecursiveRequests].flat()) {
		fillRequestStats(nonRecursiveRequestLines, request, nonRecursiveWatcher);
	}
	lines.push(...alignTextColumns(nonRecursiveRequestLines));

	const nonRecursiveWatcheLines: string[] = [];
	fillNonRecursiveWatcherStats(nonRecursiveWatcheLines, nonRecursiveWatcher);
	lines.push(...alignTextColumns(nonRecursiveWatcheLines));

	return `\n\n[File Watcher] request stats:\n\n${lines.join('\n')}\n\n`;
}

function alignTextColumns(lines: string[]) {
	let maxLength = 0;
	for (const line of lines) {
		maxLength = Math.max(maxLength, line.split('\t')[0].length);
	}

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const parts = line.split('\t');
		if (parts.length === 2) {
			const padding = ' '.repeat(maxLength - parts[0].length);
			lines[i] = `${parts[0]}${padding}\t${parts[1]}`;
		}
	}

	return lines;
}

function computeRequestStatus(requests: IUniversalWatchRequest[], watcher: ParcelWatcher | NodeJSWatcher): { suspended: number; polling: number } {
	let polling = 0;
	let suspended = 0;

	for (const request of requests) {
		const isSuspended = watcher.isSuspended(request);
		if (isSuspended === false) {
			continue;
		}

		suspended++;

		if (isSuspended === 'polling') {
			polling++;
		}
	}

	return { suspended, polling };
}

function computeRecursiveWatchStatus(recursiveWatcher: ParcelWatcher): { active: number; failed: number; stopped: number } {
	let active = 0;
	let failed = 0;
	let stopped = 0;

	for (const watcher of recursiveWatcher.watchers) {
		if (!watcher.failed && !watcher.stopped) {
			active++;
		}
		if (watcher.failed) {
			failed++;
		}
		if (watcher.stopped) {
			stopped++;
		}
	}

	return { active, failed, stopped };
}

function computeNonRecursiveWatchStatus(nonRecursiveWatcher: NodeJSWatcher): { active: number; failed: number; reusing: number } {
	let active = 0;
	let failed = 0;
	let reusing = 0;

	for (const watcher of nonRecursiveWatcher.watchers) {
		if (!watcher.instance.failed && !watcher.instance.isReusingRecursiveWatcher) {
			active++;
		}
		if (watcher.instance.failed) {
			failed++;
		}
		if (watcher.instance.isReusingRecursiveWatcher) {
			reusing++;
		}
	}

	return { active, failed, reusing };
}

function sortByPathPrefix(requests: IRecursiveWatchRequest[]): IRecursiveWatchRequest[];
function sortByPathPrefix(requests: INonRecursiveWatchRequest[]): INonRecursiveWatchRequest[];
function sortByPathPrefix(requests: IUniversalWatchRequest[]): IUniversalWatchRequest[];
function sortByPathPrefix(requests: INodeJSWatcherInstance[]): INodeJSWatcherInstance[];
function sortByPathPrefix(requests: ParcelWatcherInstance[]): ParcelWatcherInstance[];
function sortByPathPrefix(requests: IUniversalWatchRequest[] | INodeJSWatcherInstance[] | ParcelWatcherInstance[]): IUniversalWatchRequest[] | INodeJSWatcherInstance[] | ParcelWatcherInstance[] {
	requests.sort((r1, r2) => {
		const p1 = isUniversalWatchRequest(r1) ? r1.path : r1.request.path;
		const p2 = isUniversalWatchRequest(r2) ? r2.path : r2.request.path;

		const minLength = Math.min(p1.length, p2.length);
		for (let i = 0; i < minLength; i++) {
			if (p1[i] !== p2[i]) {
				return (p1[i] < p2[i]) ? -1 : 1;
			}
		}

		return p1.length - p2.length;
	});

	return requests;
}

function isUniversalWatchRequest(obj: unknown): obj is IUniversalWatchRequest {
	const candidate = obj as IUniversalWatchRequest | undefined;

	return typeof candidate?.path === 'string';
}

function fillRequestStats(lines: string[], request: IUniversalWatchRequest, watcher: ParcelWatcher | NodeJSWatcher): void {
	const decorations = [];
	const suspended = watcher.isSuspended(request);
	if (suspended !== false) {
		if (suspended === 'polling') {
			decorations.push('[SUSPENDED <polling>]');
		} else {
			decorations.push('[SUSPENDED <non-polling>]');
		}
	}

	lines.push(` ${request.path}\t${decorations.length > 0 ? decorations.join(' ') + ' ' : ''}(${requestDetailsToString(request)})`);
}

function requestDetailsToString(request: IUniversalWatchRequest): string {
	return `excludes: ${request.excludes.length > 0 ? request.excludes : '<none>'}, includes: ${request.includes && request.includes.length > 0 ? JSON.stringify(request.includes) : '<all>'}, filter: ${requestFilterToString(request.filter)}, correlationId: ${typeof request.correlationId === 'number' ? request.correlationId : '<none>'}`;
}

function fillRecursiveWatcherStats(lines: string[], recursiveWatcher: ParcelWatcher): void {
	const watchers = sortByPathPrefix(Array.from(recursiveWatcher.watchers));

	const { active, failed, stopped } = computeRecursiveWatchStatus(recursiveWatcher);
	lines.push(`\n[Recursive Watchers (${watchers.length}, active: ${active}, failed: ${failed}, stopped: ${stopped})]:`);

	for (const watcher of watchers) {
		const decorations = [];
		if (watcher.failed) {
			decorations.push('[FAILED]');
		}
		if (watcher.stopped) {
			decorations.push('[STOPPED]');
		}
		if (watcher.subscriptionsCount > 0) {
			decorations.push(`[SUBSCRIBED:${watcher.subscriptionsCount}]`);
		}
		if (watcher.restarts > 0) {
			decorations.push(`[RESTARTED:${watcher.restarts}]`);
		}
		lines.push(` ${watcher.request.path}\t${decorations.length > 0 ? decorations.join(' ') + ' ' : ''}(${requestDetailsToString(watcher.request)})`);
	}
}

function fillNonRecursiveWatcherStats(lines: string[], nonRecursiveWatcher: NodeJSWatcher): void {
	const allWatchers = sortByPathPrefix(Array.from(nonRecursiveWatcher.watchers));
	const activeWatchers = allWatchers.filter(watcher => !watcher.instance.failed && !watcher.instance.isReusingRecursiveWatcher);
	const failedWatchers = allWatchers.filter(watcher => watcher.instance.failed);
	const reusingWatchers = allWatchers.filter(watcher => watcher.instance.isReusingRecursiveWatcher);

	const { active, failed, reusing } = computeNonRecursiveWatchStatus(nonRecursiveWatcher);
	lines.push(`\n[Non-Recursive Watchers (${allWatchers.length}, active: ${active}, failed: ${failed}, reusing: ${reusing})]:`);

	for (const watcher of [activeWatchers, failedWatchers, reusingWatchers].flat()) {
		const decorations = [];
		if (watcher.instance.failed) {
			decorations.push('[FAILED]');
		}
		if (watcher.instance.isReusingRecursiveWatcher) {
			decorations.push('[REUSING]');
		}
		lines.push(` ${watcher.request.path}\t${decorations.length > 0 ? decorations.join(' ') + ' ' : ''}(${requestDetailsToString(watcher.request)})`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/nodejs/nodejsClient.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/nodejs/nodejsClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IFileChange } from '../../../common/files.js';
import { ILogMessage, AbstractNonRecursiveWatcherClient, INonRecursiveWatcher } from '../../../common/watcher.js';
import { NodeJSWatcher } from './nodejsWatcher.js';

export class NodeJSWatcherClient extends AbstractNonRecursiveWatcherClient {

	constructor(
		onFileChanges: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	) {
		super(onFileChanges, onLogMessage, verboseLogging);

		this.init();
	}

	protected override createWatcher(disposables: DisposableStore): INonRecursiveWatcher {
		return disposables.add(new NodeJSWatcher(undefined /* no recursive watching support here */)) satisfies INonRecursiveWatcher;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/node/watcher/nodejs/nodejsWatcher.ts]---
Location: vscode-main/src/vs/platform/files/node/watcher/nodejs/nodejsWatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { patternsEquals } from '../../../../../base/common/glob.js';
import { BaseWatcher } from '../baseWatcher.js';
import { isLinux } from '../../../../../base/common/platform.js';
import { INonRecursiveWatchRequest, INonRecursiveWatcher, IRecursiveWatcherWithSubscribe } from '../../../common/watcher.js';
import { NodeJSFileWatcherLibrary } from './nodejsWatcherLib.js';
import { ThrottledWorker } from '../../../../../base/common/async.js';
import { MutableDisposable } from '../../../../../base/common/lifecycle.js';

export interface INodeJSWatcherInstance {

	/**
	 * The watcher instance.
	 */
	readonly instance: NodeJSFileWatcherLibrary;

	/**
	 * The watch request associated to the watcher.
	 */
	readonly request: INonRecursiveWatchRequest;
}

export class NodeJSWatcher extends BaseWatcher implements INonRecursiveWatcher {

	readonly onDidError = Event.None;

	private readonly _watchers = new Map<string /* path */ | number /* correlation ID */, INodeJSWatcherInstance>();
	get watchers() { return this._watchers.values(); }

	private readonly worker = this._register(new MutableDisposable<ThrottledWorker<INonRecursiveWatchRequest>>());

	constructor(protected readonly recursiveWatcher: IRecursiveWatcherWithSubscribe | undefined) {
		super();
	}

	protected override async doWatch(requests: INonRecursiveWatchRequest[]): Promise<void> {

		// Figure out duplicates to remove from the requests
		requests = this.removeDuplicateRequests(requests);

		// Figure out which watchers to start and which to stop
		const requestsToStart: INonRecursiveWatchRequest[] = [];
		const watchersToStop = new Set(Array.from(this.watchers));
		for (const request of requests) {
			const watcher = this._watchers.get(this.requestToWatcherKey(request));
			if (watcher && patternsEquals(watcher.request.excludes, request.excludes) && patternsEquals(watcher.request.includes, request.includes)) {
				watchersToStop.delete(watcher); // keep watcher
			} else {
				requestsToStart.push(request); // start watching
			}
		}

		// Logging

		if (requestsToStart.length) {
			this.trace(`Request to start watching: ${requestsToStart.map(request => this.requestToString(request)).join(',')}`);
		}

		if (watchersToStop.size) {
			this.trace(`Request to stop watching: ${Array.from(watchersToStop).map(watcher => this.requestToString(watcher.request)).join(',')}`);
		}

		// Stop the worker
		this.worker.clear();

		// Stop watching as instructed
		for (const watcher of watchersToStop) {
			this.stopWatching(watcher);
		}

		// Start watching as instructed
		this.createWatchWorker().work(requestsToStart);
	}

	private createWatchWorker(): ThrottledWorker<INonRecursiveWatchRequest> {

		// We see very large amount of non-recursive file watcher requests
		// in large workspaces. To prevent the overhead of starting thousands
		// of watchers at once, we use a throttled worker to distribute this
		// work over time.

		this.worker.value = new ThrottledWorker<INonRecursiveWatchRequest>({
			maxWorkChunkSize: 100,				// only start 100 watchers at once before...
			throttleDelay: 100,	  				// ...resting for 100ms until we start watchers again...
			maxBufferedWork: Number.MAX_VALUE 	// ...and never refuse any work.
		}, requests => {
			for (const request of requests) {
				this.startWatching(request);
			}
		});

		return this.worker.value;
	}

	private requestToWatcherKey(request: INonRecursiveWatchRequest): string | number {
		return typeof request.correlationId === 'number' ? request.correlationId : this.pathToWatcherKey(request.path);
	}

	private pathToWatcherKey(path: string): string {
		return isLinux ? path : path.toLowerCase() /* ignore path casing */;
	}

	private startWatching(request: INonRecursiveWatchRequest): void {

		// Start via node.js lib
		const instance = new NodeJSFileWatcherLibrary(request, this.recursiveWatcher, changes => this._onDidChangeFile.fire(changes), () => this._onDidWatchFail.fire(request), msg => this._onDidLogMessage.fire(msg), this.verboseLogging);

		// Remember as watcher instance
		const watcher: INodeJSWatcherInstance = { request, instance };
		this._watchers.set(this.requestToWatcherKey(request), watcher);
	}

	override async stop(): Promise<void> {
		await super.stop();

		for (const watcher of this.watchers) {
			this.stopWatching(watcher);
		}
	}

	private stopWatching(watcher: INodeJSWatcherInstance): void {
		this.trace(`stopping file watcher`, watcher);

		this._watchers.delete(this.requestToWatcherKey(watcher.request));

		watcher.instance.dispose();
	}

	private removeDuplicateRequests(requests: INonRecursiveWatchRequest[]): INonRecursiveWatchRequest[] {
		const mapCorrelationtoRequests = new Map<number | undefined /* correlation */, Map<string, INonRecursiveWatchRequest>>();

		// Ignore requests for the same paths that have the same correlation
		for (const request of requests) {

			let requestsForCorrelation = mapCorrelationtoRequests.get(request.correlationId);
			if (!requestsForCorrelation) {
				requestsForCorrelation = new Map<string, INonRecursiveWatchRequest>();
				mapCorrelationtoRequests.set(request.correlationId, requestsForCorrelation);
			}

			const path = this.pathToWatcherKey(request.path);
			if (requestsForCorrelation.has(path)) {
				this.trace(`ignoring a request for watching who's path is already watched: ${this.requestToString(request)}`);
			}

			requestsForCorrelation.set(path, request);
		}

		return Array.from(mapCorrelationtoRequests.values()).flatMap(requests => Array.from(requests.values()));
	}

	override async setVerboseLogging(enabled: boolean): Promise<void> {
		super.setVerboseLogging(enabled);

		for (const watcher of this.watchers) {
			watcher.instance.setVerboseLogging(enabled);
		}
	}

	protected trace(message: string, watcher?: INodeJSWatcherInstance): void {
		if (this.verboseLogging) {
			this._onDidLogMessage.fire({ type: 'trace', message: this.toMessage(message, watcher) });
		}
	}

	protected warn(message: string): void {
		this._onDidLogMessage.fire({ type: 'warn', message: this.toMessage(message) });
	}

	private toMessage(message: string, watcher?: INodeJSWatcherInstance): string {
		return watcher ? `[File Watcher (node.js)] ${message} (${this.requestToString(watcher.request)})` : `[File Watcher (node.js)] ${message}`;
	}
}
```

--------------------------------------------------------------------------------

````

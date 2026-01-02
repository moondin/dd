---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 274
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 274 of 552)

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

---[FILE: src/vs/platform/files/test/node/diskFileService.integrationTest.ts]---
Location: vscode-main/src/vs/platform/files/test/node/diskFileService.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, writeFileSync, promises } from 'fs';
import { tmpdir } from 'os';
import { timeout } from '../../../../base/common/async.js';
import { bufferToReadable, bufferToStream, streamToBuffer, streamToBufferReadableStream, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { basename, dirname, join, posix } from '../../../../base/common/path.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises } from '../../../../base/node/pfs.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { etag, IFileAtomicReadOptions, FileOperation, FileOperationError, FileOperationEvent, FileOperationResult, FilePermission, FileSystemProviderCapabilities, hasFileAtomicReadCapability, hasOpenReadWriteCloseCapability, IFileStat, IFileStatWithMetadata, IReadFileOptions, IStat, NotModifiedSinceFileOperationError, TooLargeFileOperationError, IFileAtomicOptions } from '../../common/files.js';
import { FileService } from '../../common/fileService.js';
import { DiskFileSystemProvider } from '../../node/diskFileSystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';

function getByName(root: IFileStat, name: string): IFileStat | undefined {
	if (root.children === undefined) {
		return undefined;
	}

	return root.children.find(child => child.name === name);
}

function toLineByLineReadable(content: string): VSBufferReadable {
	let chunks = content.split('\n');
	chunks = chunks.map((chunk, index) => {
		if (index === 0) {
			return chunk;
		}

		return '\n' + chunk;
	});

	return {
		read(): VSBuffer | null {
			const chunk = chunks.shift();
			if (typeof chunk === 'string') {
				return VSBuffer.fromString(chunk);
			}

			return null;
		}
	};
}

export class TestDiskFileSystemProvider extends DiskFileSystemProvider {

	totalBytesRead: number = 0;

	private invalidStatSize: boolean = false;
	private smallStatSize: boolean = false;
	private readonly: boolean = false;

	private _testCapabilities!: FileSystemProviderCapabilities;
	override get capabilities(): FileSystemProviderCapabilities {
		if (!this._testCapabilities) {
			this._testCapabilities =
				FileSystemProviderCapabilities.FileReadWrite |
				FileSystemProviderCapabilities.FileOpenReadWriteClose |
				FileSystemProviderCapabilities.FileReadStream |
				FileSystemProviderCapabilities.Trash |
				FileSystemProviderCapabilities.FileFolderCopy |
				FileSystemProviderCapabilities.FileWriteUnlock |
				FileSystemProviderCapabilities.FileAtomicRead |
				FileSystemProviderCapabilities.FileAtomicWrite |
				FileSystemProviderCapabilities.FileAtomicDelete |
				FileSystemProviderCapabilities.FileClone |
				FileSystemProviderCapabilities.FileRealpath;

			if (isLinux) {
				this._testCapabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
			}
		}

		return this._testCapabilities;
	}

	override set capabilities(capabilities: FileSystemProviderCapabilities) {
		this._testCapabilities = capabilities;
	}

	setInvalidStatSize(enabled: boolean): void {
		this.invalidStatSize = enabled;
	}

	setSmallStatSize(enabled: boolean): void {
		this.smallStatSize = enabled;
	}

	setReadonly(readonly: boolean): void {
		this.readonly = readonly;
	}

	override async stat(resource: URI): Promise<IStat> {
		const res = await super.stat(resource);

		if (this.invalidStatSize) {
			// eslint-disable-next-line local/code-no-any-casts
			(res as any).size = String(res.size) as any; // for https://github.com/microsoft/vscode/issues/72909
		} else if (this.smallStatSize) {
			// eslint-disable-next-line local/code-no-any-casts
			(res as any).size = 1;
		} else if (this.readonly) {
			// eslint-disable-next-line local/code-no-any-casts
			(res as any).permissions = FilePermission.Readonly;
		}

		return res;
	}

	override async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const bytesRead = await super.read(fd, pos, data, offset, length);

		this.totalBytesRead += bytesRead;

		return bytesRead;
	}

	override async readFile(resource: URI, options?: IFileAtomicReadOptions): Promise<Uint8Array> {
		const res = await super.readFile(resource, options);

		this.totalBytesRead += res.byteLength;

		return res;
	}
}

DiskFileSystemProvider.configureFlushOnWrite(false); // speed up all unit tests by disabling flush on write

flakySuite('Disk File Service', function () {

	const testSchema = 'test';

	let service: FileService;
	let fileProvider: TestDiskFileSystemProvider;
	let testProvider: TestDiskFileSystemProvider;

	let testDir: string;

	const disposables = new DisposableStore();

	setup(async () => {
		const logService = new NullLogService();

		service = disposables.add(new FileService(logService));

		fileProvider = disposables.add(new TestDiskFileSystemProvider(logService));
		disposables.add(service.registerProvider(Schemas.file, fileProvider));

		testProvider = disposables.add(new TestDiskFileSystemProvider(logService));
		disposables.add(service.registerProvider(testSchema, testProvider));

		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'diskfileservice');

		const sourceDir = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/service').fsPath;

		await Promises.copy(sourceDir, testDir, { preserveSymlinks: false });
	});

	teardown(() => {
		disposables.clear();

		return Promises.rm(testDir);
	});

	test('createFolder', async () => {
		let event: FileOperationEvent | undefined;
		disposables.add(service.onDidRunOperation(e => event = e));

		const parent = await service.resolve(URI.file(testDir));

		const newFolderResource = URI.file(join(parent.resource.fsPath, 'newFolder'));

		const newFolder = await service.createFolder(newFolderResource);

		assert.strictEqual(newFolder.name, 'newFolder');
		assert.strictEqual(existsSync(newFolder.resource.fsPath), true);

		assert.ok(event);
		assert.strictEqual(event.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event.operation, FileOperation.CREATE);
		assert.strictEqual(event.target!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event.target!.isDirectory, true);
	});

	test('createFolder: creating multiple folders at once', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const multiFolderPaths = ['a', 'couple', 'of', 'folders'];
		const parent = await service.resolve(URI.file(testDir));

		const newFolderResource = URI.file(join(parent.resource.fsPath, ...multiFolderPaths));

		const newFolder = await service.createFolder(newFolderResource);

		const lastFolderName = multiFolderPaths[multiFolderPaths.length - 1];
		assert.strictEqual(newFolder.name, lastFolderName);
		assert.strictEqual(existsSync(newFolder.resource.fsPath), true);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, newFolderResource.fsPath);
		assert.strictEqual(event!.target!.isDirectory, true);
	});

	test('exists', async () => {
		let exists = await service.exists(URI.file(testDir));
		assert.strictEqual(exists, true);

		exists = await service.exists(URI.file(testDir + 'something'));
		assert.strictEqual(exists, false);
	});

	test('resolve - file', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/index.html');
		const resolved = await service.resolve(resource);

		assert.strictEqual(resolved.name, 'index.html');
		assert.strictEqual(resolved.isFile, true);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.readonly, false);
		assert.strictEqual(resolved.isSymbolicLink, false);
		assert.strictEqual(resolved.resource.toString(), resource.toString());
		assert.strictEqual(resolved.children, undefined);
		assert.ok(resolved.mtime! > 0);
		assert.ok(resolved.ctime! > 0);
		assert.ok(resolved.size! > 0);
	});

	test('resolve - directory', async () => {
		const testsElements = ['examples', 'other', 'index.html', 'site.css'];

		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver');
		const result = await service.resolve(resource);

		assert.ok(result);
		assert.strictEqual(result.resource.toString(), resource.toString());
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);
		assert.strictEqual(result.readonly, false);
		assert.ok(result.mtime! > 0);
		assert.ok(result.ctime! > 0);
		assert.strictEqual(result.children.length, testsElements.length);

		assert.ok(result.children.every(entry => {
			return testsElements.some(name => {
				return basename(entry.resource.fsPath) === name;
			});
		}));

		result.children.forEach(value => {
			assert.ok(basename(value.resource.fsPath));
			if (['examples', 'other'].indexOf(basename(value.resource.fsPath)) >= 0) {
				assert.ok(value.isDirectory);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource.fsPath) === 'index.html') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else if (basename(value.resource.fsPath) === 'site.css') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.strictEqual(value.mtime, undefined);
				assert.strictEqual(value.ctime, undefined);
			} else {
				assert.fail('Unexpected value ' + basename(value.resource.fsPath));
			}
		});
	});

	test('resolve - directory - with metadata', async () => {
		const testsElements = ['examples', 'other', 'index.html', 'site.css'];

		const result = await service.resolve(FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver'), { resolveMetadata: true });

		assert.ok(result);
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);
		assert.ok(result.mtime > 0);
		assert.ok(result.ctime > 0);
		assert.strictEqual(result.children.length, testsElements.length);

		assert.ok(result.children.every(entry => {
			return testsElements.some(name => {
				return basename(entry.resource.fsPath) === name;
			});
		}));

		assert.ok(result.children.every(entry => entry.etag.length > 0));

		result.children.forEach(value => {
			assert.ok(basename(value.resource.fsPath));
			if (['examples', 'other'].indexOf(basename(value.resource.fsPath)) >= 0) {
				assert.ok(value.isDirectory);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else if (basename(value.resource.fsPath) === 'index.html') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else if (basename(value.resource.fsPath) === 'site.css') {
				assert.ok(!value.isDirectory);
				assert.ok(!value.children);
				assert.ok(value.mtime > 0);
				assert.ok(value.ctime > 0);
			} else {
				assert.fail('Unexpected value ' + basename(value.resource.fsPath));
			}
		});
	});

	test('resolve - directory with resolveTo', async () => {
		const resolved = await service.resolve(URI.file(testDir), { resolveTo: [URI.file(join(testDir, 'deep'))] });
		assert.strictEqual(resolved.children!.length, 8);

		const deep = (getByName(resolved, 'deep')!);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolve - directory - resolveTo single directory', async () => {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath), { resolveTo: [URI.file(join(resolverFixturesPath, 'other/deep'))] });

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 4);

		const other = getByName(result, 'other');
		assert.ok(other);
		assert.ok(other.children!.length > 0);

		const deep = getByName(other, 'deep');
		assert.ok(deep);
		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolve directory - resolveTo multiple directories', () => {
		return testResolveDirectoryWithTarget(false);
	});

	test('resolve directory - resolveTo with a URI that has query parameter (https://github.com/microsoft/vscode/issues/128151)', () => {
		return testResolveDirectoryWithTarget(true);
	});

	async function testResolveDirectoryWithTarget(withQueryParam: boolean): Promise<void> {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath).with({ query: withQueryParam ? 'test' : undefined }), {
			resolveTo: [
				URI.file(join(resolverFixturesPath, 'other/deep')).with({ query: withQueryParam ? 'test' : undefined }),
				URI.file(join(resolverFixturesPath, 'examples')).with({ query: withQueryParam ? 'test' : undefined })
			]
		});

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 4);

		const other = getByName(result, 'other');
		assert.ok(other);
		assert.ok(other.children!.length > 0);

		const deep = getByName(other, 'deep');
		assert.ok(deep);
		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);

		const examples = getByName(result, 'examples');
		assert.ok(examples);
		assert.ok(examples.children!.length > 0);
		assert.strictEqual(examples.children!.length, 4);
	}

	test('resolve directory - resolveSingleChildFolders', async () => {
		const resolverFixturesPath = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/other').fsPath;
		const result = await service.resolve(URI.file(resolverFixturesPath), { resolveSingleChildDescendants: true });

		assert.ok(result);
		assert.ok(result.children);
		assert.ok(result.children.length > 0);
		assert.ok(result.isDirectory);

		const children = result.children;
		assert.strictEqual(children.length, 1);

		const deep = getByName(result, 'deep');
		assert.ok(deep);
		assert.ok(deep.children!.length > 0);
		assert.strictEqual(deep.children!.length, 4);
	});

	test('resolves', async () => {
		const res = await service.resolveAll([
			{ resource: URI.file(testDir), options: { resolveTo: [URI.file(join(testDir, 'deep'))] } },
			{ resource: URI.file(join(testDir, 'deep')) }
		]);

		const r1 = (res[0].stat!);
		assert.strictEqual(r1.children!.length, 8);

		const deep = (getByName(r1, 'deep')!);
		assert.strictEqual(deep.children!.length, 4);

		const r2 = (res[1].stat!);
		assert.strictEqual(r2.children!.length, 4);
		assert.strictEqual(r2.name, 'deep');
	});

	test('resolve / realpath - folder symbolic link', async () => {
		const link = URI.file(join(testDir, 'deep-link'));
		await promises.symlink(join(testDir, 'deep'), link.fsPath, 'junction');

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.children!.length, 4);
		assert.strictEqual(resolved.isDirectory, true);
		assert.strictEqual(resolved.isSymbolicLink, true);

		const realpath = await service.realpath(link);
		assert.ok(realpath);
		assert.strictEqual(basename(realpath.fsPath), 'deep');
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('resolve - file symbolic link', async () => {
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(join(testDir, 'lorem.txt'), link.fsPath);

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.isSymbolicLink, true);
	});

	test('resolve - symbolic link pointing to nonexistent file does not break', async () => {
		await promises.symlink(join(testDir, 'foo'), join(testDir, 'bar'), 'junction');

		const resolved = await service.resolve(URI.file(testDir));
		assert.strictEqual(resolved.isDirectory, true);
		assert.strictEqual(resolved.children!.length, 9);

		const resolvedLink = resolved.children?.find(child => child.name === 'bar' && child.isSymbolicLink);
		assert.ok(resolvedLink);

		assert.ok(!resolvedLink?.isDirectory);
		assert.ok(!resolvedLink?.isFile);
	});

	test('stat - file', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver/index.html');
		const resolved = await service.stat(resource);

		assert.strictEqual(resolved.name, 'index.html');
		assert.strictEqual(resolved.isFile, true);
		assert.strictEqual(resolved.isDirectory, false);
		assert.strictEqual(resolved.readonly, false);
		assert.strictEqual(resolved.isSymbolicLink, false);
		assert.strictEqual(resolved.resource.toString(), resource.toString());
		assert.ok(resolved.mtime > 0);
		assert.ok(resolved.ctime > 0);
		assert.ok(resolved.size > 0);
	});

	test('stat - directory', async () => {
		const resource = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/resolver');
		const result = await service.stat(resource);

		assert.ok(result);
		assert.strictEqual(result.resource.toString(), resource.toString());
		assert.strictEqual(result.name, 'resolver');
		assert.ok(result.isDirectory);
		assert.strictEqual(result.readonly, false);
		assert.ok(result.mtime > 0);
		assert.ok(result.ctime > 0);
	});

	test('deleteFile (non recursive)', async () => {
		return testDeleteFile(false, false);
	});

	test('deleteFile (recursive)', async () => {
		return testDeleteFile(false, true);
	});

	(isLinux /* trash is unreliable on Linux */ ? test.skip : test)('deleteFile (useTrash)', async () => {
		return testDeleteFile(true, false);
	});

	async function testDeleteFile(useTrash: boolean, recursive: boolean): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'deep', 'conway.js'));
		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { useTrash, recursive }), true);
		await service.del(source.resource, { useTrash, recursive });

		assert.strictEqual(existsSync(source.resource.fsPath), false);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);

		let error: Error | undefined = undefined;
		try {
			await service.del(source.resource, { useTrash, recursive });
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.strictEqual((<FileOperationError>error).fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
	}

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('deleteFile - symbolic link (exists)', async () => {
		const target = URI.file(join(testDir, 'lorem.txt'));
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(target.fsPath, link.fsPath);

		const source = await service.resolve(link);

		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		assert.strictEqual(await service.canDelete(source.resource), true);
		await service.del(source.resource);

		assert.strictEqual(existsSync(source.resource.fsPath), false);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, link.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);

		assert.strictEqual(existsSync(target.fsPath), true); // target the link pointed to is never deleted
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('deleteFile - symbolic link (pointing to nonexistent file)', async () => {
		const target = URI.file(join(testDir, 'foo'));
		const link = URI.file(join(testDir, 'bar'));
		await promises.symlink(target.fsPath, link.fsPath);

		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		assert.strictEqual(await service.canDelete(link), true);
		await service.del(link);

		assert.strictEqual(existsSync(link.fsPath), false);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, link.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);
	});

	test('deleteFolder (recursive)', async () => {
		return testDeleteFolderRecursive(false, false);
	});

	test('deleteFolder (recursive, atomic)', async () => {
		return testDeleteFolderRecursive(false, { postfix: '.vsctmp' });
	});

	(isLinux /* trash is unreliable on Linux */ ? test.skip : test)('deleteFolder (recursive, useTrash)', async () => {
		return testDeleteFolderRecursive(true, false);
	});

	async function testDeleteFolderRecursive(useTrash: boolean, atomic: IFileAtomicOptions | false): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'deep'));
		const source = await service.resolve(resource);

		assert.strictEqual(await service.canDelete(source.resource, { recursive: true, useTrash, atomic }), true);
		await service.del(source.resource, { recursive: true, useTrash, atomic });

		assert.strictEqual(existsSync(source.resource.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.DELETE);
	}

	test('deleteFolder (non recursive)', async () => {
		const resource = URI.file(join(testDir, 'deep'));
		const source = await service.resolve(resource);

		assert.ok((await service.canDelete(source.resource)) instanceof Error);

		let error;
		try {
			await service.del(source.resource);
		} catch (e) {
			error = e;
		}

		assert.ok(error);
	});

	test('deleteFolder empty folder (recursive)', () => {
		return testDeleteEmptyFolder(true);
	});

	test('deleteFolder empty folder (non recursive)', () => {
		return testDeleteEmptyFolder(false);
	});

	async function testDeleteEmptyFolder(recursive: boolean): Promise<void> {
		const { resource } = await service.createFolder(URI.file(join(testDir, 'deep', 'empty')));

		await service.del(resource, { recursive });

		assert.strictEqual(await service.exists(resource), false);
	}

	test('move', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'index.html'));
		const sourceContents = readFileSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'other.html'));

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	});

	test('move - across providers (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders();
	});

	test('move - across providers (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders();
	});

	test('move - across providers (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders();
	});

	test('move - across providers (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders();
	});

	test('move - across providers - large (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveAcrossProviders('lorem.txt');
	});

	test('move - across providers - large (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveAcrossProviders('lorem.txt');
	});

	async function testMoveAcrossProviders(sourceFile = 'index.html'): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, sourceFile));
		const sourceContents = readFileSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'other.html')).with({ scheme: testSchema });

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	}

	test('move - multi folder', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const multiFolderPaths = ['a', 'couple', 'of', 'folders'];
		const renameToPath = join(...multiFolderPaths, 'other.html');

		const source = URI.file(join(testDir, 'index.html'));

		assert.strictEqual(await service.canMove(source, URI.file(join(dirname(source.fsPath), renameToPath))), true);
		const renamed = await service.move(source, URI.file(join(dirname(source.fsPath), renameToPath)));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);
	});

	test('move - directory', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'deep'));

		assert.strictEqual(await service.canMove(source, URI.file(join(dirname(source.fsPath), 'deeper'))), true);
		const renamed = await service.move(source, URI.file(join(dirname(source.fsPath), 'deeper')));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);
	});

	test('move - directory - across providers (buffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (unbuffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (buffered => unbuffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testMoveFolderAcrossProviders();
	});

	test('move - directory - across providers (unbuffered => buffered)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);
		setCapabilities(testProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testMoveFolderAcrossProviders();
	});

	async function testMoveFolderAcrossProviders(): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = URI.file(join(testDir, 'deep'));
		const sourceChildren = readdirSync(source.fsPath);

		const target = URI.file(join(dirname(source.fsPath), 'deeper')).with({ scheme: testSchema });

		assert.strictEqual(await service.canMove(source, target), true);
		const renamed = await service.move(source, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(existsSync(source.fsPath), false);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		const targetChildren = readdirSync(target.fsPath);
		assert.strictEqual(sourceChildren.length, targetChildren.length);
		for (let i = 0; i < sourceChildren.length; i++) {
			assert.strictEqual(sourceChildren[i], targetChildren[i]);
		}
	}

	test('move - MIX CASE', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const renamedResource = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));
		assert.strictEqual(await service.canMove(source.resource, renamedResource), true);
		let renamed = await service.move(source.resource, renamedResource);

		assert.strictEqual(existsSync(renamedResource.fsPath), true);
		assert.strictEqual(basename(renamedResource.fsPath), 'INDEX.html');
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamedResource.fsPath);

		renamed = await service.resolve(renamedResource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - same file', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		assert.strictEqual(await service.canMove(source.resource, URI.file(source.resource.fsPath)), true);
		let renamed = await service.move(source.resource, URI.file(source.resource.fsPath));

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(basename(renamed.resource.fsPath), 'index.html');
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		renamed = await service.resolve(renamed.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - same file #2', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const targetParent = URI.file(testDir);
		const target = targetParent.with({ path: posix.join(targetParent.path, posix.basename(source.resource.path)) });

		assert.strictEqual(await service.canMove(source.resource, target), true);
		let renamed = await service.move(source.resource, target);

		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.strictEqual(basename(renamed.resource.fsPath), 'index.html');
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.MOVE);
		assert.strictEqual(event!.target!.resource.fsPath, renamed.resource.fsPath);

		renamed = await service.resolve(renamed.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, renamed.size);
	});

	test('move - source parent of target', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		assert.ok((await service.canMove(URI.file(testDir), URI.file(join(testDir, 'binary.txt'))) instanceof Error));

		let error;
		try {
			await service.move(URI.file(testDir), URI.file(join(testDir, 'binary.txt')));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.ok(!event!);

		source = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(originalSize, source.size);
	});

	test('move - FILE_MOVE_CONFLICT', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		assert.ok((await service.canMove(source.resource, URI.file(join(testDir, 'binary.txt'))) instanceof Error));

		let error;
		try {
			await service.move(source.resource, URI.file(join(testDir, 'binary.txt')));
		} catch (e) {
			error = e;
		}

		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MOVE_CONFLICT);
		assert.ok(!event!);

		source = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(originalSize, source.size);
	});

	test('move - overwrite folder with file', async () => {
		let createEvent: FileOperationEvent;
		let moveEvent: FileOperationEvent;
		let deleteEvent: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => {
			if (e.operation === FileOperation.CREATE) {
				createEvent = e;
			} else if (e.operation === FileOperation.DELETE) {
				deleteEvent = e;
			} else if (e.operation === FileOperation.MOVE) {
				moveEvent = e;
			}
		}));

		const parent = await service.resolve(URI.file(testDir));
		const folderResource = URI.file(join(parent.resource.fsPath, 'conway.js'));
		const f = await service.createFolder(folderResource);
		const source = URI.file(join(testDir, 'deep', 'conway.js'));

		assert.strictEqual(await service.canMove(source, f.resource, true), true);
		const moved = await service.move(source, f.resource, true);

		assert.strictEqual(existsSync(moved.resource.fsPath), true);
		assert.ok(statSync(moved.resource.fsPath).isFile);
		assert.ok(createEvent!);
		assert.ok(deleteEvent!);
		assert.ok(moveEvent!);
		assert.strictEqual(moveEvent!.resource.fsPath, source.fsPath);
		assert.strictEqual(moveEvent!.target!.resource.fsPath, moved.resource.fsPath);
		assert.strictEqual(deleteEvent!.resource.fsPath, folderResource.fsPath);
	});

	test('copy', async () => {
		await doTestCopy();
	});

	test('copy - unbuffered (FileSystemProviderCapabilities.FileReadWrite)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		await doTestCopy();
	});

	test('copy - unbuffered large (FileSystemProviderCapabilities.FileReadWrite)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		await doTestCopy('lorem.txt');
	});

	test('copy - buffered (FileSystemProviderCapabilities.FileOpenReadWriteClose)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		await doTestCopy();
	});

	test('copy - buffered large (FileSystemProviderCapabilities.FileOpenReadWriteClose)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		await doTestCopy('lorem.txt');
	});

	function setCapabilities(provider: TestDiskFileSystemProvider, capabilities: FileSystemProviderCapabilities): void {
		provider.capabilities = capabilities;
		if (isLinux) {
			provider.capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
		}
	}

	async function doTestCopy(sourceName: string = 'index.html') {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, sourceName)));
		const target = URI.file(join(testDir, 'other.html'));

		assert.strictEqual(await service.canCopy(source.resource, target), true);
		const copied = await service.copy(source.resource, target);

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
		assert.strictEqual(existsSync(source.resource.fsPath), true);
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		const sourceContents = readFileSync(source.resource.fsPath);
		const targetContents = readFileSync(target.fsPath);

		assert.strictEqual(sourceContents.byteLength, targetContents.byteLength);
		assert.strictEqual(sourceContents.toString(), targetContents.toString());
	}

	test('copy - overwrite folder with file', async () => {
		let createEvent: FileOperationEvent;
		let copyEvent: FileOperationEvent;
		let deleteEvent: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => {
			if (e.operation === FileOperation.CREATE) {
				createEvent = e;
			} else if (e.operation === FileOperation.DELETE) {
				deleteEvent = e;
			} else if (e.operation === FileOperation.COPY) {
				copyEvent = e;
			}
		}));

		const parent = await service.resolve(URI.file(testDir));
		const folderResource = URI.file(join(parent.resource.fsPath, 'conway.js'));
		const f = await service.createFolder(folderResource);
		const source = URI.file(join(testDir, 'deep', 'conway.js'));

		assert.strictEqual(await service.canCopy(source, f.resource, true), true);
		const copied = await service.copy(source, f.resource, true);

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
		assert.ok(statSync(copied.resource.fsPath).isFile);
		assert.ok(createEvent!);
		assert.ok(deleteEvent!);
		assert.ok(copyEvent!);
		assert.strictEqual(copyEvent!.resource.fsPath, source.fsPath);
		assert.strictEqual(copyEvent!.target!.resource.fsPath, copied.resource.fsPath);
		assert.strictEqual(deleteEvent!.resource.fsPath, folderResource.fsPath);
	});

	test('copy - MIX CASE same target - no overwrite', async () => {
		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		const target = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));

		const canCopy = await service.canCopy(source.resource, target);

		let error;
		let copied: IFileStatWithMetadata;
		try {
			copied = await service.copy(source.resource, target);
		} catch (e) {
			error = e;
		}

		if (isLinux) {
			assert.ok(!error);
			assert.strictEqual(canCopy, true);

			assert.strictEqual(existsSync(copied!.resource.fsPath), true);
			assert.ok(readdirSync(testDir).some(f => f === 'INDEX.html'));
			assert.strictEqual(source.size, copied!.size);
		} else {
			assert.ok(error);
			assert.ok(canCopy instanceof Error);

			source = await service.resolve(source.resource, { resolveMetadata: true });
			assert.strictEqual(originalSize, source.size);
		}
	});

	test('copy - MIX CASE same target - overwrite', async () => {
		let source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		const originalSize = source.size;
		assert.ok(originalSize > 0);

		const target = URI.file(join(dirname(source.resource.fsPath), 'INDEX.html'));

		const canCopy = await service.canCopy(source.resource, target, true);

		let error;
		let copied: IFileStatWithMetadata;
		try {
			copied = await service.copy(source.resource, target, true);
		} catch (e) {
			error = e;
		}

		if (isLinux) {
			assert.ok(!error);
			assert.strictEqual(canCopy, true);

			assert.strictEqual(existsSync(copied!.resource.fsPath), true);
			assert.ok(readdirSync(testDir).some(f => f === 'INDEX.html'));
			assert.strictEqual(source.size, copied!.size);
		} else {
			assert.ok(error);
			assert.ok(canCopy instanceof Error);

			source = await service.resolve(source.resource, { resolveMetadata: true });
			assert.strictEqual(originalSize, source.size);
		}
	});

	test('copy - MIX CASE different target - overwrite', async () => {
		const source1 = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source1.size > 0);

		const renamed = await service.move(source1.resource, URI.file(join(dirname(source1.resource.fsPath), 'CONWAY.js')));
		assert.strictEqual(existsSync(renamed.resource.fsPath), true);
		assert.ok(readdirSync(testDir).some(f => f === 'CONWAY.js'));
		assert.strictEqual(source1.size, renamed.size);

		const source2 = await service.resolve(URI.file(join(testDir, 'deep', 'conway.js')), { resolveMetadata: true });
		const target = URI.file(join(testDir, basename(source2.resource.path)));

		assert.strictEqual(await service.canCopy(source2.resource, target, true), true);
		const res = await service.copy(source2.resource, target, true);
		assert.strictEqual(existsSync(res.resource.fsPath), true);
		assert.ok(readdirSync(testDir).some(f => f === 'conway.js'));
		assert.strictEqual(source2.size, res.size);
	});

	test('copy - same file', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		assert.strictEqual(await service.canCopy(source.resource, URI.file(source.resource.fsPath)), true);
		let copied = await service.copy(source.resource, URI.file(source.resource.fsPath));

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
		assert.strictEqual(basename(copied.resource.fsPath), 'index.html');
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		copied = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, copied.size);
	});

	test('copy - same file #2', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const source = await service.resolve(URI.file(join(testDir, 'index.html')), { resolveMetadata: true });
		assert.ok(source.size > 0);

		const targetParent = URI.file(testDir);
		const target = targetParent.with({ path: posix.join(targetParent.path, posix.basename(source.resource.path)) });

		assert.strictEqual(await service.canCopy(source.resource, URI.file(target.fsPath)), true);
		let copied = await service.copy(source.resource, URI.file(target.fsPath));

		assert.strictEqual(existsSync(copied.resource.fsPath), true);
		assert.strictEqual(basename(copied.resource.fsPath), 'index.html');
		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, source.resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.COPY);
		assert.strictEqual(event!.target!.resource.fsPath, copied.resource.fsPath);

		copied = await service.resolve(source.resource, { resolveMetadata: true });
		assert.strictEqual(source.size, copied.size);
	});

	test('cloneFile - basics', () => {
		return testCloneFile();
	});

	test('cloneFile - via copy capability', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileFolderCopy);

		return testCloneFile();
	});

	test('cloneFile - via pipe', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testCloneFile();
	});

	async function testCloneFile(): Promise<void> {
		const source1 = URI.file(join(testDir, 'index.html'));
		const source1Size = (await service.resolve(source1, { resolveMetadata: true })).size;

		const source2 = URI.file(join(testDir, 'lorem.txt'));
		const source2Size = (await service.resolve(source2, { resolveMetadata: true })).size;

		const targetParent = URI.file(testDir);

		// same path is a no-op
		await service.cloneFile(source1, source1);

		// simple clone to existing parent folder path
		const target1 = targetParent.with({ path: posix.join(targetParent.path, `${posix.basename(source1.path)}-clone`) });

		await service.cloneFile(source1, URI.file(target1.fsPath));

		assert.strictEqual(existsSync(target1.fsPath), true);
		assert.strictEqual(basename(target1.fsPath), 'index.html-clone');

		let target1Size = (await service.resolve(target1, { resolveMetadata: true })).size;

		assert.strictEqual(source1Size, target1Size);

		// clone to same path overwrites
		await service.cloneFile(source2, URI.file(target1.fsPath));

		target1Size = (await service.resolve(target1, { resolveMetadata: true })).size;

		assert.strictEqual(source2Size, target1Size);
		assert.notStrictEqual(source1Size, target1Size);

		// clone creates missing folders ad-hoc
		const target2 = targetParent.with({ path: posix.join(targetParent.path, 'foo', 'bar', `${posix.basename(source1.path)}-clone`) });

		await service.cloneFile(source1, URI.file(target2.fsPath));

		assert.strictEqual(existsSync(target2.fsPath), true);
		assert.strictEqual(basename(target2.fsPath), 'index.html-clone');

		const target2Size = (await service.resolve(target2, { resolveMetadata: true })).size;

		assert.strictEqual(source1Size, target2Size);
	}

	test('readFile - small file - default', () => {
		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - buffered', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - buffered / readonly', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - unbuffered / readonly', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - small file - streamed / readonly', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream | FileSystemProviderCapabilities.Readonly);

		return testReadFile(URI.file(join(testDir, 'small.txt')));
	});

	test('readFile - large file - default', async () => {
		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - large file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')));
	});

	test('readFile - atomic (emulated on service level)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')), { atomic: true });
	});

	test('readFile - atomic (natively supported)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite & FileSystemProviderCapabilities.FileAtomicRead);

		return testReadFile(URI.file(join(testDir, 'lorem.txt')), { atomic: true });
	});

	async function testReadFile(resource: URI, options?: IReadFileOptions): Promise<void> {
		const content = await service.readFile(resource, options);

		assert.strictEqual(content.value.toString(), readFileSync(resource.fsPath).toString());
	}

	test('readFileStream - small file - default', () => {
		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - buffered', () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	test('readFileStream - small file - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileStream(URI.file(join(testDir, 'small.txt')));
	});

	async function testReadFileStream(resource: URI): Promise<void> {
		const content = await service.readFileStream(resource);

		assert.strictEqual((await streamToBuffer(content.value)).toString(), readFileSync(resource.fsPath).toString());
	}

	test('readFile - Files are intermingled #38331 - default', async () => {
		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testFilesNotIntermingled();
	});

	test('readFile - Files are intermingled #38331 - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testFilesNotIntermingled();
	});

	async function testFilesNotIntermingled() {
		const resource1 = URI.file(join(testDir, 'lorem.txt'));
		const resource2 = URI.file(join(testDir, 'some_utf16le.css'));

		// load in sequence and keep data
		const value1 = await service.readFile(resource1);
		const value2 = await service.readFile(resource2);

		// load in parallel in expect the same result
		const result = await Promise.all([
			service.readFile(resource1),
			service.readFile(resource2)
		]);

		assert.strictEqual(result[0].value.toString(), value1.value.toString());
		assert.strictEqual(result[1].value.toString(), value2.value.toString());
	}

	test('readFile - from position (ASCII) - default', async () => {
		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileFromPositionAscii();
	});

	test('readFile - from position (ASCII) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileFromPositionAscii();
	});

	async function testReadFileFromPositionAscii() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const contents = await service.readFile(resource, { position: 6 });

		assert.strictEqual(contents.value.toString(), 'File');
	}

	test('readFile - from position (with umlaut) - default', async () => {
		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadFileFromPositionUmlaut();
	});

	test('readFile - from position (with umlaut) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadFileFromPositionUmlaut();
	});

	async function testReadFileFromPositionUmlaut() {
		const resource = URI.file(join(testDir, 'small_umlaut.txt'));

		const contents = await service.readFile(resource, { position: Buffer.from('Small File with Ü').length });

		assert.strictEqual(contents.value.toString(), 'mlaut');
	}

	test('readFile - 3 bytes (ASCII) - default', async () => {
		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testReadThreeBytesFromFile();
	});

	test('readFile - 3 bytes (ASCII) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testReadThreeBytesFromFile();
	});

	async function testReadThreeBytesFromFile() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const contents = await service.readFile(resource, { length: 3 });

		assert.strictEqual(contents.value.toString(), 'Sma');
	}

	test('readFile - 20000 bytes (large) - default', async () => {
		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 20000 bytes (large) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return readLargeFileWithLength(20000);
	});

	test('readFile - 80000 bytes (large) - default', async () => {
		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return readLargeFileWithLength(80000);
	});

	test('readFile - 80000 bytes (large) - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return readLargeFileWithLength(80000);
	});

	async function readLargeFileWithLength(length: number) {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const contents = await service.readFile(resource, { length });

		assert.strictEqual(contents.value.byteLength, length);
	}

	test('readFile - FILE_IS_DIRECTORY', async () => {
		const resource = URI.file(join(testDir, 'deep'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_IS_DIRECTORY);
	});

	(isWindows /* error code does not seem to be supported on windows */ ? test.skip : test)('readFile - FILE_NOT_DIRECTORY', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt', 'file.txt'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_DIRECTORY);
	});

	test('readFile - FILE_NOT_FOUND', async () => {
		const resource = URI.file(join(testDir, '404.html'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_FOUND);
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - default', async () => {
		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testNotModifiedSince();
	});

	test('readFile - FILE_NOT_MODIFIED_SINCE - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testNotModifiedSince();
	});

	async function testNotModifiedSince() {
		const resource = URI.file(join(testDir, 'index.html'));

		const contents = await service.readFile(resource);
		fileProvider.totalBytesRead = 0;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { etag: contents.etag });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_NOT_MODIFIED_SINCE);
		assert.ok(error instanceof NotModifiedSinceFileOperationError && error.stat);
		assert.strictEqual(fileProvider.totalBytesRead, 0);
	}

	test('readFile - FILE_NOT_MODIFIED_SINCE does not fire wrongly - https://github.com/microsoft/vscode/issues/72909', async () => {
		fileProvider.setInvalidStatSize(true);

		const resource = URI.file(join(testDir, 'index.html'));

		await service.readFile(resource);

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { etag: undefined });
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('readFile - FILE_TOO_LARGE - default', async () => {
		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testFileTooLarge();
	});

	test('readFile - FILE_TOO_LARGE - streamed', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadStream);

		return testFileTooLarge();
	});

	async function testFileTooLarge() {
		await doTestFileTooLarge(false);

		// Also test when the stat size is wrong
		fileProvider.setSmallStatSize(true);
		return doTestFileTooLarge(true);
	}

	async function doTestFileTooLarge(statSizeWrong: boolean) {
		const resource = URI.file(join(testDir, 'index.html'));

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(resource, { limits: { size: 10 } });
		} catch (err) {
			error = err;
		}

		if (!statSizeWrong) {
			assert.ok(error instanceof TooLargeFileOperationError);
			assert.ok(typeof error.size === 'number');
		}
		assert.strictEqual(error!.fileOperationResult, FileOperationResult.FILE_TOO_LARGE);
	}

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('readFile - dangling symbolic link - https://github.com/microsoft/vscode/issues/116049', async () => {
		const link = URI.file(join(testDir, 'small.js-link'));
		await promises.symlink(join(testDir, 'small.js'), link.fsPath);

		let error: FileOperationError | undefined = undefined;
		try {
			await service.readFile(link);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('createFile', async () => {
		return assertCreateFile(contents => VSBuffer.fromString(contents));
	});

	test('createFile (readable)', async () => {
		return assertCreateFile(contents => bufferToReadable(VSBuffer.fromString(contents)));
	});

	test('createFile (stream)', async () => {
		return assertCreateFile(contents => bufferToStream(VSBuffer.fromString(contents)));
	});

	async function assertCreateFile(converter: (content: string) => VSBuffer | VSBufferReadable | VSBufferReadableStream): Promise<void> {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		assert.strictEqual(await service.canCreateFile(resource), true);
		const fileStat = await service.createFile(resource, converter(contents));
		assert.strictEqual(fileStat.name, 'test.txt');
		assert.strictEqual(existsSync(fileStat.resource.fsPath), true);
		assert.strictEqual(readFileSync(fileStat.resource.fsPath).toString(), contents);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, resource.fsPath);
	}

	test('createFile (does not overwrite by default)', async () => {
		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		writeFileSync(resource.fsPath, ''); // create file

		assert.ok((await service.canCreateFile(resource)) instanceof Error);

		let error;
		try {
			await service.createFile(resource, VSBuffer.fromString(contents));
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('createFile (allows to overwrite existing)', async () => {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const contents = 'Hello World';
		const resource = URI.file(join(testDir, 'test.txt'));

		writeFileSync(resource.fsPath, ''); // create file

		assert.strictEqual(await service.canCreateFile(resource, { overwrite: true }), true);
		const fileStat = await service.createFile(resource, VSBuffer.fromString(contents), { overwrite: true });
		assert.strictEqual(fileStat.name, 'test.txt');
		assert.strictEqual(existsSync(fileStat.resource.fsPath), true);
		assert.strictEqual(readFileSync(fileStat.resource.fsPath).toString(), contents);

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.CREATE);
		assert.strictEqual(event!.target!.resource.fsPath, resource.fsPath);
	});

	test('writeFile - default', async () => {
		return testWriteFile(false);
	});

	test('writeFile - flush on write', async () => {
		DiskFileSystemProvider.configureFlushOnWrite(true);
		try {
			return await testWriteFile(false);
		} finally {
			DiskFileSystemProvider.configureFlushOnWrite(false);
		}
	});

	test('writeFile - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFile(false);
	});

	test('writeFile - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFile(false);
	});

	test('writeFile - default (atomic)', async () => {
		return testWriteFile(true);
	});

	test('writeFile - flush on write (atomic)', async () => {
		DiskFileSystemProvider.configureFlushOnWrite(true);
		try {
			return await testWriteFile(true);
		} finally {
			DiskFileSystemProvider.configureFlushOnWrite(false);
		}
	});

	test('writeFile - buffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileAtomicWrite);

		let e;
		try {
			await testWriteFile(true);
		} catch (error) {
			e = error;
		}

		assert.ok(e);
	});

	test('writeFile - unbuffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		return testWriteFile(true);
	});

	(isWindows ? test.skip /* windows: cannot create file symbolic link without elevated context */ : test)('writeFile - atomic writing does not break symlinks', async () => {
		const link = URI.file(join(testDir, 'lorem.txt-linked'));
		await promises.symlink(join(testDir, 'lorem.txt'), link.fsPath);

		const content = 'Updates to the lorem file';
		await service.writeFile(link, VSBuffer.fromString(content), { atomic: { postfix: '.vsctmp' } });
		assert.strictEqual(readFileSync(link.fsPath).toString(), content);

		const resolved = await service.resolve(link);
		assert.strictEqual(resolved.isSymbolicLink, true);
	});

	async function testWriteFile(atomic: boolean) {
		let event: FileOperationEvent;
		disposables.add(service.onDidRunOperation(e => event = e));

		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { atomic: atomic ? { postfix: '.vsctmp' } : false });

		assert.ok(event!);
		assert.strictEqual(event!.resource.fsPath, resource.fsPath);
		assert.strictEqual(event!.operation, FileOperation.WRITE);

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file) - default', async () => {
		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLarge(false);
	});

	test('writeFile (large file) - default (atomic)', async () => {
		return testWriteFileLarge(true);
	});

	test('writeFile (large file) - buffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileAtomicWrite);

		let e;
		try {
			await testWriteFileLarge(true);
		} catch (error) {
			e = error;
		}

		assert.ok(e);
	});

	test('writeFile (large file) - unbuffered (atomic)', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		return testWriteFileLarge(true);
	});

	async function testWriteFileLarge(atomic: boolean) {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const fileStat = await service.writeFile(resource, VSBuffer.fromString(newContent), { atomic: atomic ? { postfix: '.vsctmp' } : false });
		assert.strictEqual(fileStat.name, 'lorem.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file) - unbuffered (atomic) - concurrent writes with multiple services', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileAtomicWrite);

		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const promises: Promise<IFileStatWithMetadata>[] = [];
		let suffix = 0;
		for (let i = 0; i < 10; i++) {
			const service = disposables.add(new FileService(new NullLogService()));
			disposables.add(service.registerProvider(Schemas.file, fileProvider));

			promises.push(service.writeFile(resource, VSBuffer.fromString(`${newContent}${++suffix}`), { atomic: { postfix: '.vsctmp' } }));
			await timeout(0);
		}

		await Promise.allSettled(promises);

		assert.strictEqual(readFileSync(resource.fsPath).toString(), `${newContent}${suffix}`);
	});

	test('writeFile - buffered - readonly throws', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.Readonly);

		return testWriteFileReadonlyThrows();
	});

	test('writeFile - unbuffered - readonly throws', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.Readonly);

		return testWriteFileReadonlyThrows();
	});

	async function testWriteFileReadonlyThrows() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';

		let error: Error;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent));
		} catch (err) {
			error = err;
		}

		assert.ok(error!);
	}

	test('writeFile (large file) - multiple parallel writes queue up and atomic read support (via file service)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const writePromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async offset => {
			const fileStat = await service.writeFile(resource, VSBuffer.fromString(offset + newContent));
			assert.strictEqual(fileStat.name, 'lorem.txt');
		}));

		const readPromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async () => {
			const fileContent = await service.readFile(resource, { atomic: true });
			assert.ok(fileContent.value.byteLength > 0); // `atomic: true` ensures we never read a truncated file
		}));

		await Promise.all([writePromises, readPromises]);
	});

	test('provider - write barrier prevents dirty writes', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		const writePromises = Promise.all(['0', '00', '000', '0000', '00000'].map(async offset => {
			const content = offset + newContent;
			const contentBuffer = VSBuffer.fromString(content).buffer;

			const fd = await provider.open(resource, { create: true, unlock: false });
			try {
				await provider.write(fd, 0, VSBuffer.fromString(content).buffer, 0, contentBuffer.byteLength);

				// Here since `close` is not called, all other writes are
				// waiting on the barrier to release, so doing a readFile
				// should give us a consistent view of the file contents
				assert.strictEqual((await promises.readFile(resource.fsPath)).toString(), content);
			} finally {
				await provider.close(fd);
			}
		}));

		await Promise.all([writePromises]);
	});

	test('provider - write barrier is partitioned per resource', async () => {
		const resource1 = URI.file(join(testDir, 'lorem.txt'));
		const resource2 = URI.file(join(testDir, 'test.txt'));

		const provider = service.getProvider(resource1.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		const fd1 = await provider.open(resource1, { create: true, unlock: false });
		const fd2 = await provider.open(resource2, { create: true, unlock: false });

		const newContent = 'Hello World';

		try {
			await provider.write(fd1, 0, VSBuffer.fromString(newContent).buffer, 0, VSBuffer.fromString(newContent).buffer.byteLength);
			assert.strictEqual((await promises.readFile(resource1.fsPath)).toString(), newContent);

			await provider.write(fd2, 0, VSBuffer.fromString(newContent).buffer, 0, VSBuffer.fromString(newContent).buffer.byteLength);
			assert.strictEqual((await promises.readFile(resource2.fsPath)).toString(), newContent);
		} finally {
			await Promise.allSettled([
				await provider.close(fd1),
				await provider.close(fd2)
			]);
		}
	});

	test('provider - write barrier not becoming stale', async () => {
		const newFolder = join(testDir, 'new-folder');
		const newResource = URI.file(join(newFolder, 'lorem.txt'));

		const provider = service.getProvider(newResource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));

		let error: Error | undefined = undefined;
		try {
			await provider.open(newResource, { create: true, unlock: false });
		} catch (e) {
			error = e;
		}

		assert.ok(error); // expected because `new-folder` does not exist

		await promises.mkdir(newFolder);

		const content = readFileSync(URI.file(join(testDir, 'lorem.txt')).fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const fd = await provider.open(newResource, { create: true, unlock: false });
		try {
			await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);

			assert.strictEqual((await promises.readFile(newResource.fsPath)).toString(), newContent);
		} finally {
			await provider.close(fd);
		}
	});

	test('provider - atomic reads (write pending when read starts)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));
		assert.ok(hasFileAtomicReadCapability(provider));

		let atomicReadPromise: Promise<Uint8Array> | undefined = undefined;
		const fd = await provider.open(resource, { create: true, unlock: false });
		try {

			// Start reading while write is pending
			atomicReadPromise = provider.readFile(resource, { atomic: true });

			// Simulate a slow write, giving the read
			// a chance to succeed if it were not atomic
			await timeout(20);

			await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);
		} finally {
			await provider.close(fd);
		}

		assert.ok(atomicReadPromise);

		const atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, newContentBuffer.byteLength);
	});

	test('provider - atomic reads (read pending when write starts)', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();
		const newContentBuffer = VSBuffer.fromString(newContent).buffer;

		const provider = service.getProvider(resource.scheme);
		assert.ok(provider);
		assert.ok(hasOpenReadWriteCloseCapability(provider));
		assert.ok(hasFileAtomicReadCapability(provider));

		let atomicReadPromise = provider.readFile(resource, { atomic: true });

		const fdPromise = provider.open(resource, { create: true, unlock: false }).then(async fd => {
			try {
				return await provider.write(fd, 0, newContentBuffer, 0, newContentBuffer.byteLength);
			} finally {
				await provider.close(fd);
			}
		});

		let atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, content.byteLength);

		await fdPromise;

		atomicReadPromise = provider.readFile(resource, { atomic: true });
		atomicReadResult = await atomicReadPromise;
		assert.strictEqual(atomicReadResult.byteLength, newContentBuffer.byteLength);
	});

	test('writeFile (readable) - default', async () => {
		return testWriteFileReadable();
	});

	test('writeFile (readable) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileReadable();
	});

	test('writeFile (readable) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileReadable();
	});

	async function testWriteFileReadable() {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, toLineByLineReadable(newContent));

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (large file - readable) - default', async () => {
		return testWriteFileLargeReadable();
	});

	test('writeFile (large file - readable) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLargeReadable();
	});

	test('writeFile (large file - readable) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLargeReadable();
	});

	async function testWriteFileLargeReadable() {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const content = readFileSync(resource.fsPath);
		const newContent = content.toString() + content.toString();

		const fileStat = await service.writeFile(resource, toLineByLineReadable(newContent));
		assert.strictEqual(fileStat.name, 'lorem.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	}

	test('writeFile (stream) - default', async () => {
		return testWriteFileStream();
	});

	test('writeFile (stream) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileStream();
	});

	test('writeFile (stream) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileStream();
	});

	async function testWriteFileStream() {
		const source = URI.file(join(testDir, 'small.txt'));
		const target = URI.file(join(testDir, 'small-copy.txt'));

		const fileStat = await service.writeFile(target, streamToBufferReadableStream(createReadStream(source.fsPath)));
		assert.strictEqual(fileStat.name, 'small-copy.txt');

		const targetContents = readFileSync(target.fsPath).toString();
		assert.strictEqual(readFileSync(source.fsPath).toString(), targetContents);
	}

	test('writeFile (large file - stream) - default', async () => {
		return testWriteFileLargeStream();
	});

	test('writeFile (large file - stream) - buffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testWriteFileLargeStream();
	});

	test('writeFile (large file - stream) - unbuffered', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testWriteFileLargeStream();
	});

	async function testWriteFileLargeStream() {
		const source = URI.file(join(testDir, 'lorem.txt'));
		const target = URI.file(join(testDir, 'lorem-copy.txt'));

		const fileStat = await service.writeFile(target, streamToBufferReadableStream(createReadStream(source.fsPath)));
		assert.strictEqual(fileStat.name, 'lorem-copy.txt');

		const targetContents = readFileSync(target.fsPath).toString();
		assert.strictEqual(readFileSync(source.fsPath).toString(), targetContents);
	}

	test('writeFile (file is created including parents)', async () => {
		const resource = URI.file(join(testDir, 'other', 'newfile.txt'));

		const content = 'File is created including parent';
		const fileStat = await service.writeFile(resource, VSBuffer.fromString(content));
		assert.strictEqual(fileStat.name, 'newfile.txt');

		assert.strictEqual(readFileSync(resource.fsPath).toString(), content);
	});

	test('writeFile - locked files and unlocking', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.FileWriteUnlock);

		return testLockedFiles(false);
	});

	test('writeFile (stream) - locked files and unlocking', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose | FileSystemProviderCapabilities.FileWriteUnlock);

		return testLockedFiles(false);
	});

	test('writeFile - locked files and unlocking throws error when missing capability', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileReadWrite);

		return testLockedFiles(true);
	});

	test('writeFile (stream) - locked files and unlocking throws error when missing capability', async () => {
		setCapabilities(fileProvider, FileSystemProviderCapabilities.FileOpenReadWriteClose);

		return testLockedFiles(true);
	});

	async function testLockedFiles(expectError: boolean) {
		const lockedFile = URI.file(join(testDir, 'my-locked-file'));

		const content = await service.writeFile(lockedFile, VSBuffer.fromString('Locked File'));
		assert.strictEqual(content.locked, false);

		const stats = await promises.stat(lockedFile.fsPath);
		await promises.chmod(lockedFile.fsPath, stats.mode & ~0o200);

		let stat = await service.stat(lockedFile);
		assert.strictEqual(stat.locked, true);

		let error;
		const newContent = 'Updates to locked file';
		try {
			await service.writeFile(lockedFile, VSBuffer.fromString(newContent));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		error = undefined;

		if (expectError) {
			try {
				await service.writeFile(lockedFile, VSBuffer.fromString(newContent), { unlock: true });
			} catch (e) {
				error = e;
			}

			assert.ok(error);
		} else {
			await service.writeFile(lockedFile, VSBuffer.fromString(newContent), { unlock: true });
			assert.strictEqual(readFileSync(lockedFile.fsPath).toString(), newContent);

			stat = await service.stat(lockedFile);
			assert.strictEqual(stat.locked, false);
		}
	}

	test('writeFile (error when folder is encountered)', async () => {
		const resource = URI.file(testDir);

		let error: Error | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString('File is created including parent'));
		} catch (err) {
			error = err;
		}

		assert.ok(error);
	});

	test('writeFile (no error when providing up to date etag)', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		assert.strictEqual(readFileSync(resource.fsPath).toString(), newContent);
	});

	test('writeFile - error when writing to file that has been updated meanwhile', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = 'Updates to the small file';
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		const newContentLeadingToError = newContent + newContent;

		const fakeMtime = 1000;
		const fakeSize = 1000;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContentLeadingToError), { etag: etag({ mtime: fakeMtime, size: fakeSize }), mtime: fakeMtime });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof FileOperationError);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MODIFIED_SINCE);
	});

	test('writeFile - no error when writing to file where size is the same', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const stat = await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content; // same content
		await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: stat.etag, mtime: stat.mtime });

		const newContentLeadingToNoError = newContent; // writing the same content should be OK

		const fakeMtime = 1000;
		const actualSize = newContent.length;

		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContentLeadingToNoError), { etag: etag({ mtime: fakeMtime, size: actualSize }), mtime: fakeMtime });
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('writeFile - no error when writing to file where content is the same', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content; // same content
		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: 'anything', mtime: 0 } /* fake it */);
		} catch (err) {
			error = err;
		}

		assert.ok(!error);
	});

	test('writeFile - error when writing to file where content is the same length but different', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.resolve(resource);

		const content = readFileSync(resource.fsPath).toString();
		assert.strictEqual(content, 'Small File');

		const newContent = content.split('').reverse().join(''); // reverse content
		let error: FileOperationError | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString(newContent), { etag: 'anything', mtime: 0 } /* fake it */);
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.ok(error instanceof FileOperationError);
		assert.strictEqual(error.fileOperationResult, FileOperationResult.FILE_MODIFIED_SINCE);
	});

	test('writeFile - no error when writing to same nonexistent folder multiple times different new files', async () => {
		const newFolder = URI.file(join(testDir, 'some', 'new', 'folder'));

		const file1 = joinPath(newFolder, 'file-1');
		const file2 = joinPath(newFolder, 'file-2');
		const file3 = joinPath(newFolder, 'file-3');

		// this essentially verifies that the mkdirp logic implemented
		// in the file service is able to receive multiple requests for
		// the same folder and will not throw errors if another racing
		// call succeeded first.
		const newContent = 'Updates to the small file';
		await Promise.all([
			service.writeFile(file1, VSBuffer.fromString(newContent)),
			service.writeFile(file2, VSBuffer.fromString(newContent)),
			service.writeFile(file3, VSBuffer.fromString(newContent))
		]);

		assert.ok(service.exists(file1));
		assert.ok(service.exists(file2));
		assert.ok(service.exists(file3));
	});

	test('writeFile - error when writing to folder that is a file', async () => {
		const existingFile = URI.file(join(testDir, 'my-file'));

		await service.createFile(existingFile);

		const newFile = joinPath(existingFile, 'file-1');

		let error;
		const newContent = 'Updates to the small file';
		try {
			await service.writeFile(newFile, VSBuffer.fromString(newContent));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
	});

	test('read - mixed positions', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		// read multiple times from position 0
		let buffer = VSBuffer.alloc(1024);
		let fd = await fileProvider.open(resource, { create: false });
		for (let i = 0; i < 3; i++) {
			await fileProvider.read(fd, 0, buffer.buffer, 0, 26);
			assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		}
		await fileProvider.close(fd);

		// read multiple times at various locations
		buffer = VSBuffer.alloc(1024);
		fd = await fileProvider.open(resource, { create: false });

		let posInFile = 0;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		posInFile += 26;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 1);
		assert.strictEqual(buffer.slice(0, 1).toString(), ',');
		posInFile += 1;

		await fileProvider.read(fd, posInFile, buffer.buffer, 0, 12);
		assert.strictEqual(buffer.slice(0, 12).toString(), ' consectetur');
		posInFile += 12;

		await fileProvider.read(fd, 98 /* no longer in sequence of posInFile */, buffer.buffer, 0, 9);
		assert.strictEqual(buffer.slice(0, 9).toString(), 'fermentum');

		await fileProvider.read(fd, 27, buffer.buffer, 0, 12);
		assert.strictEqual(buffer.slice(0, 12).toString(), ' consectetur');

		await fileProvider.read(fd, 26, buffer.buffer, 0, 1);
		assert.strictEqual(buffer.slice(0, 1).toString(), ',');

		await fileProvider.read(fd, 0, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');

		await fileProvider.read(fd, posInFile /* back in sequence */, buffer.buffer, 0, 11);
		assert.strictEqual(buffer.slice(0, 11).toString(), ' adipiscing');

		await fileProvider.close(fd);
	});

	test('write - mixed positions', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		const buffer = VSBuffer.alloc(1024);
		const fdWrite = await fileProvider.open(resource, { create: true, unlock: false });
		const fdRead = await fileProvider.open(resource, { create: false });

		let posInFileWrite = 0;
		let posInFileRead = 0;

		const initialContents = VSBuffer.fromString('Lorem ipsum dolor sit amet');
		await fileProvider.write(fdWrite, posInFileWrite, initialContents.buffer, 0, initialContents.byteLength);
		posInFileWrite += initialContents.byteLength;

		await fileProvider.read(fdRead, posInFileRead, buffer.buffer, 0, 26);
		assert.strictEqual(buffer.slice(0, 26).toString(), 'Lorem ipsum dolor sit amet');
		posInFileRead += 26;

		const contents = VSBuffer.fromString('Hello World');

		await fileProvider.write(fdWrite, posInFileWrite, contents.buffer, 0, contents.byteLength);
		posInFileWrite += contents.byteLength;

		await fileProvider.read(fdRead, posInFileRead, buffer.buffer, 0, contents.byteLength);
		assert.strictEqual(buffer.slice(0, contents.byteLength).toString(), 'Hello World');
		posInFileRead += contents.byteLength;

		await fileProvider.write(fdWrite, 6, contents.buffer, 0, contents.byteLength);

		await fileProvider.read(fdRead, 0, buffer.buffer, 0, 11);
		assert.strictEqual(buffer.slice(0, 11).toString(), 'Lorem Hello');

		await fileProvider.write(fdWrite, posInFileWrite, contents.buffer, 0, contents.byteLength);
		posInFileWrite += contents.byteLength;

		await fileProvider.read(fdRead, posInFileWrite - contents.byteLength, buffer.buffer, 0, contents.byteLength);
		assert.strictEqual(buffer.slice(0, contents.byteLength).toString(), 'Hello World');

		await fileProvider.close(fdWrite);
		await fileProvider.close(fdRead);
	});

	test('readonly - is handled properly for a single resource', async () => {
		fileProvider.setReadonly(true);

		const resource = URI.file(join(testDir, 'index.html'));

		const resolveResult = await service.resolve(resource);
		assert.strictEqual(resolveResult.readonly, true);

		const readResult = await service.readFile(resource);
		assert.strictEqual(readResult.readonly, true);

		let writeFileError: Error | undefined = undefined;
		try {
			await service.writeFile(resource, VSBuffer.fromString('Hello Test'));
		} catch (error) {
			writeFileError = error;
		}
		assert.ok(writeFileError);

		let deleteFileError: Error | undefined = undefined;
		try {
			await service.del(resource);
		} catch (error) {
			deleteFileError = error;
		}
		assert.ok(deleteFileError);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/nodejsWatcher.test.ts]---
Location: vscode-main/src/vs/platform/files/test/node/nodejsWatcher.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import assert from 'assert';
import { tmpdir } from 'os';
import { basename, dirname, join } from '../../../../base/common/path.js';
import { Promises, RimRafMode } from '../../../../base/node/pfs.js';
import { getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { FileChangeFilter, FileChangeType } from '../../common/files.js';
import { INonRecursiveWatchRequest, IRecursiveWatcherWithSubscribe } from '../../common/watcher.js';
import { watchFileContents } from '../../node/watcher/nodejs/nodejsWatcherLib.js';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { getDriveLetter } from '../../../../base/common/extpath.js';
import { ltrim } from '../../../../base/common/strings.js';
import { DeferredPromise, timeout } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { NodeJSWatcher } from '../../node/watcher/nodejs/nodejsWatcher.js';
import { FileAccess } from '../../../../base/common/network.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { addUNCHostToAllowlist } from '../../../../base/node/unc.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { TestParcelWatcher } from './parcelWatcher.test.js';

// this suite has shown flaky runs in Azure pipelines where
// tasks would just hang and timeout after a while (not in
// mocha but generally). as such they will run only on demand
// whenever we update the watcher library.

suite.skip('File Watcher (node.js)', function () {

	this.timeout(10000);

	class TestNodeJSWatcher extends NodeJSWatcher {

		protected override readonly suspendedWatchRequestPollingInterval = 100;

		private readonly _onDidWatch = this._register(new Emitter<void>());
		readonly onDidWatch = this._onDidWatch.event;

		readonly onWatchFail = this._onDidWatchFail.event;

		protected override getUpdateWatchersDelay(): number {
			return 0;
		}

		protected override async doWatch(requests: INonRecursiveWatchRequest[]): Promise<void> {
			await super.doWatch(requests);
			for (const watcher of this.watchers) {
				await watcher.instance.ready;
			}

			this._onDidWatch.fire();
		}
	}

	let testDir: string;
	let watcher: TestNodeJSWatcher;

	let loggingEnabled = false;

	function enableLogging(enable: boolean) {
		loggingEnabled = enable;
		watcher?.setVerboseLogging(enable);
	}

	enableLogging(loggingEnabled);

	setup(async () => {
		await createWatcher(undefined);

		// Rule out strange testing conditions by using the realpath
		// here. for example, on macOS the tmp dir is potentially a
		// symlink in some of the root folders, which is a rather
		// unrealisic case for the file watcher.
		testDir = URI.file(getRandomTestPath(fs.realpathSync(tmpdir()), 'vsctests', 'filewatcher')).fsPath;

		const sourceDir = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/service').fsPath;

		await Promises.copy(sourceDir, testDir, { preserveSymlinks: false });
	});

	async function createWatcher(accessor: IRecursiveWatcherWithSubscribe | undefined) {
		await watcher?.stop();
		watcher?.dispose();

		watcher = new TestNodeJSWatcher(accessor);
		watcher?.setVerboseLogging(loggingEnabled);

		watcher.onDidLogMessage(e => {
			if (loggingEnabled) {
				console.log(`[non-recursive watcher test message] ${e.message}`);
			}
		});

		watcher.onDidError(e => {
			if (loggingEnabled) {
				console.log(`[non-recursive watcher test error] ${e}`);
			}
		});
	}

	teardown(async () => {
		await watcher.stop();
		watcher.dispose();

		// Possible that the file watcher is still holding
		// onto the folders on Windows specifically and the
		// unlink would fail. In that case, do not fail the
		// test suite.
		return Promises.rm(testDir).catch(error => console.error(error));
	});

	function toMsg(type: FileChangeType): string {
		switch (type) {
			case FileChangeType.ADDED: return 'added';
			case FileChangeType.DELETED: return 'deleted';
			default: return 'changed';
		}
	}

	async function awaitEvent(service: TestNodeJSWatcher, path: string, type: FileChangeType, correlationId?: number | null, expectedCount?: number): Promise<void> {
		if (loggingEnabled) {
			console.log(`Awaiting change type '${toMsg(type)}' on file '${path}'`);
		}

		// Await the event
		await new Promise<void>(resolve => {
			let counter = 0;
			const disposable = service.onDidChangeFile(events => {
				for (const event of events) {
					if (extUriBiasedIgnorePathCase.isEqual(event.resource, URI.file(path)) && event.type === type && (correlationId === null || event.cId === correlationId)) {
						counter++;
						if (typeof expectedCount === 'number' && counter < expectedCount) {
							continue; // not yet
						}

						disposable.dispose();
						resolve();
						break;
					}
				}
			});
		});
	}

	test('basics (folder watch)', async function () {
		const request = { path: testDir, excludes: [], recursive: false };
		await watcher.watch([request]);
		assert.strictEqual(watcher.isSuspended(request), false);

		const instance = Array.from(watcher.watchers)[0].instance;
		assert.strictEqual(instance.isReusingRecursiveWatcher, false);
		assert.strictEqual(instance.failed, false);

		// New file
		const newFilePath = join(testDir, 'newFile.txt');
		let changeFuture: Promise<unknown> = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');
		await changeFuture;

		// New folder
		const newFolderPath = join(testDir, 'New Folder');
		changeFuture = awaitEvent(watcher, newFolderPath, FileChangeType.ADDED);
		await fs.promises.mkdir(newFolderPath);
		await changeFuture;

		// Rename file
		let renamedFilePath = join(testDir, 'renamedFile.txt');
		changeFuture = Promise.all([
			awaitEvent(watcher, newFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, renamedFilePath, FileChangeType.ADDED)
		]);
		await Promises.rename(newFilePath, renamedFilePath);
		await changeFuture;

		// Rename folder
		let renamedFolderPath = join(testDir, 'Renamed Folder');
		changeFuture = Promise.all([
			awaitEvent(watcher, newFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, renamedFolderPath, FileChangeType.ADDED)
		]);
		await Promises.rename(newFolderPath, renamedFolderPath);
		await changeFuture;

		// Rename file (same name, different case)
		const caseRenamedFilePath = join(testDir, 'RenamedFile.txt');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, caseRenamedFilePath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFilePath, caseRenamedFilePath);
		await changeFuture;
		renamedFilePath = caseRenamedFilePath;

		// Rename folder (same name, different case)
		const caseRenamedFolderPath = join(testDir, 'REnamed Folder');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, caseRenamedFolderPath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFolderPath, caseRenamedFolderPath);
		await changeFuture;
		renamedFolderPath = caseRenamedFolderPath;

		// Move file
		const movedFilepath = join(testDir, 'movedFile.txt');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, movedFilepath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFilePath, movedFilepath);
		await changeFuture;

		// Move folder
		const movedFolderpath = join(testDir, 'Moved Folder');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, movedFolderpath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFolderPath, movedFolderpath);
		await changeFuture;

		// Copy file
		const copiedFilepath = join(testDir, 'copiedFile.txt');
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.ADDED);
		await fs.promises.copyFile(movedFilepath, copiedFilepath);
		await changeFuture;

		// Copy folder
		const copiedFolderpath = join(testDir, 'Copied Folder');
		changeFuture = awaitEvent(watcher, copiedFolderpath, FileChangeType.ADDED);
		await Promises.copy(movedFolderpath, copiedFolderpath, { preserveSymlinks: false });
		await changeFuture;

		// Change file
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.UPDATED);
		await Promises.writeFile(copiedFilepath, 'Hello Change');
		await changeFuture;

		// Create new file
		const anotherNewFilePath = join(testDir, 'anotherNewFile.txt');
		changeFuture = awaitEvent(watcher, anotherNewFilePath, FileChangeType.ADDED);
		await Promises.writeFile(anotherNewFilePath, 'Hello Another World');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.DELETED);
		await fs.promises.unlink(copiedFilepath);
		await changeFuture;

		// Delete folder
		changeFuture = awaitEvent(watcher, copiedFolderpath, FileChangeType.DELETED);
		await fs.promises.rmdir(copiedFolderpath);
		await changeFuture;

		watcher.dispose();
	});

	test('basics (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		const request = { path: filePath, excludes: [], recursive: false };
		await watcher.watch([request]);
		assert.strictEqual(watcher.isSuspended(request), false);

		const instance = Array.from(watcher.watchers)[0].instance;
		assert.strictEqual(instance.isReusingRecursiveWatcher, false);
		assert.strictEqual(instance.failed, false);

		// Change file
		let changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED);
		await fs.promises.unlink(filePath);
		await changeFuture;

		// Recreate watcher
		await Promises.writeFile(filePath, 'Hello Change');
		await watcher.watch([]);
		await watcher.watch([{ path: filePath, excludes: [], recursive: false }]);

		// Move file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED);
		await Promises.rename(filePath, `${filePath}-moved`);
		await changeFuture;
	});

	test('atomic writes (folder watch)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], recursive: false }]);

		// Delete + Recreate file
		const newFilePath = join(testDir, 'lorem.txt');
		const changeFuture: Promise<unknown> = awaitEvent(watcher, newFilePath, FileChangeType.UPDATED);
		await fs.promises.unlink(newFilePath);
		Promises.writeFile(newFilePath, 'Hello Atomic World');
		await changeFuture;
	});

	test('atomic writes (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		await watcher.watch([{ path: filePath, excludes: [], recursive: false }]);

		// Delete + Recreate file
		const newFilePath = join(filePath);
		const changeFuture: Promise<unknown> = awaitEvent(watcher, newFilePath, FileChangeType.UPDATED);
		await fs.promises.unlink(newFilePath);
		Promises.writeFile(newFilePath, 'Hello Atomic World');
		await changeFuture;
	});

	test('multiple events (folder watch)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], recursive: false }]);

		// multiple add

		const newFilePath1 = join(testDir, 'newFile-1.txt');
		const newFilePath2 = join(testDir, 'newFile-2.txt');
		const newFilePath3 = join(testDir, 'newFile-3.txt');

		const addedFuture1: Promise<unknown> = awaitEvent(watcher, newFilePath1, FileChangeType.ADDED);
		const addedFuture2: Promise<unknown> = awaitEvent(watcher, newFilePath2, FileChangeType.ADDED);
		const addedFuture3: Promise<unknown> = awaitEvent(watcher, newFilePath3, FileChangeType.ADDED);

		await Promise.all([
			await Promises.writeFile(newFilePath1, 'Hello World 1'),
			await Promises.writeFile(newFilePath2, 'Hello World 2'),
			await Promises.writeFile(newFilePath3, 'Hello World 3'),
		]);

		await Promise.all([addedFuture1, addedFuture2, addedFuture3]);

		// multiple change

		const changeFuture1: Promise<unknown> = awaitEvent(watcher, newFilePath1, FileChangeType.UPDATED);
		const changeFuture2: Promise<unknown> = awaitEvent(watcher, newFilePath2, FileChangeType.UPDATED);
		const changeFuture3: Promise<unknown> = awaitEvent(watcher, newFilePath3, FileChangeType.UPDATED);

		await Promise.all([
			await Promises.writeFile(newFilePath1, 'Hello Update 1'),
			await Promises.writeFile(newFilePath2, 'Hello Update 2'),
			await Promises.writeFile(newFilePath3, 'Hello Update 3'),
		]);

		await Promise.all([changeFuture1, changeFuture2, changeFuture3]);

		// copy with multiple files

		const copyFuture1: Promise<unknown> = awaitEvent(watcher, join(testDir, 'newFile-1-copy.txt'), FileChangeType.ADDED);
		const copyFuture2: Promise<unknown> = awaitEvent(watcher, join(testDir, 'newFile-2-copy.txt'), FileChangeType.ADDED);
		const copyFuture3: Promise<unknown> = awaitEvent(watcher, join(testDir, 'newFile-3-copy.txt'), FileChangeType.ADDED);

		await Promise.all([
			Promises.copy(join(testDir, 'newFile-1.txt'), join(testDir, 'newFile-1-copy.txt'), { preserveSymlinks: false }),
			Promises.copy(join(testDir, 'newFile-2.txt'), join(testDir, 'newFile-2-copy.txt'), { preserveSymlinks: false }),
			Promises.copy(join(testDir, 'newFile-3.txt'), join(testDir, 'newFile-3-copy.txt'), { preserveSymlinks: false })
		]);

		await Promise.all([copyFuture1, copyFuture2, copyFuture3]);

		// multiple delete

		const deleteFuture1: Promise<unknown> = awaitEvent(watcher, newFilePath1, FileChangeType.DELETED);
		const deleteFuture2: Promise<unknown> = awaitEvent(watcher, newFilePath2, FileChangeType.DELETED);
		const deleteFuture3: Promise<unknown> = awaitEvent(watcher, newFilePath3, FileChangeType.DELETED);

		await Promise.all([
			await fs.promises.unlink(newFilePath1),
			await fs.promises.unlink(newFilePath2),
			await fs.promises.unlink(newFilePath3)
		]);

		await Promise.all([deleteFuture1, deleteFuture2, deleteFuture3]);
	});

	test('multiple events (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		await watcher.watch([{ path: filePath, excludes: [], recursive: false }]);

		// multiple change

		const changeFuture1: Promise<unknown> = awaitEvent(watcher, filePath, FileChangeType.UPDATED);

		await Promise.all([
			await Promises.writeFile(filePath, 'Hello Update 1'),
			await Promises.writeFile(filePath, 'Hello Update 2'),
			await Promises.writeFile(filePath, 'Hello Update 3'),
		]);

		await Promise.all([changeFuture1]);
	});

	test('excludes can be updated (folder watch)', async function () {
		await watcher.watch([{ path: testDir, excludes: ['**'], recursive: false }]);
		await watcher.watch([{ path: testDir, excludes: [], recursive: false }]);

		return basicCrudTest(join(testDir, 'files-excludes.txt'));
	});

	test('excludes are ignored (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		await watcher.watch([{ path: filePath, excludes: ['**'], recursive: false }]);

		return basicCrudTest(filePath, true);
	});

	test('includes can be updated (folder watch)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['nothing'], recursive: false }]);
		await watcher.watch([{ path: testDir, excludes: [], recursive: false }]);

		return basicCrudTest(join(testDir, 'files-includes.txt'));
	});

	test('non-includes are ignored (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		await watcher.watch([{ path: filePath, excludes: [], includes: ['nothing'], recursive: false }]);

		return basicCrudTest(filePath, true);
	});

	test('includes are supported (folder watch)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['**/files-includes.txt'], recursive: false }]);

		return basicCrudTest(join(testDir, 'files-includes.txt'));
	});

	test('includes are supported (folder watch, relative pattern explicit)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: [{ base: testDir, pattern: 'files-includes.txt' }], recursive: false }]);

		return basicCrudTest(join(testDir, 'files-includes.txt'));
	});

	test('includes are supported (folder watch, relative pattern implicit)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['files-includes.txt'], recursive: false }]);

		return basicCrudTest(join(testDir, 'files-includes.txt'));
	});

	test('correlationId is supported', async function () {
		const correlationId = Math.random();
		await watcher.watch([{ correlationId, path: testDir, excludes: [], recursive: false }]);

		return basicCrudTest(join(testDir, 'newFile.txt'), undefined, correlationId);
	});

	(isWindows /* windows: cannot create file symbolic link without elevated context */ ? test.skip : test)('symlink support (folder watch)', async function () {
		const link = join(testDir, 'deep-linked');
		const linkTarget = join(testDir, 'deep');
		await fs.promises.symlink(linkTarget, link);

		await watcher.watch([{ path: link, excludes: [], recursive: false }]);

		return basicCrudTest(join(link, 'newFile.txt'));
	});

	async function basicCrudTest(filePath: string, skipAdd?: boolean, correlationId?: number | null, expectedCount?: number, awaitWatchAfterAdd?: boolean): Promise<void> {
		let changeFuture: Promise<unknown>;

		// New file
		if (!skipAdd) {
			changeFuture = awaitEvent(watcher, filePath, FileChangeType.ADDED, correlationId, expectedCount);
			await Promises.writeFile(filePath, 'Hello World');
			await changeFuture;
			if (awaitWatchAfterAdd) {
				await Event.toPromise(watcher.onDidWatch);
			}
		}

		// Change file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED, correlationId, expectedCount);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, correlationId, expectedCount);
		await fs.promises.unlink(await Promises.realpath(filePath)); // support symlinks
		await changeFuture;
	}

	(isWindows /* windows: cannot create file symbolic link without elevated context */ ? test.skip : test)('symlink support (file watch)', async function () {
		const link = join(testDir, 'lorem.txt-linked');
		const linkTarget = join(testDir, 'lorem.txt');
		await fs.promises.symlink(linkTarget, link);

		await watcher.watch([{ path: link, excludes: [], recursive: false }]);

		return basicCrudTest(link, true);
	});

	(!isWindows /* UNC is windows only */ ? test.skip : test)('unc support (folder watch)', async function () {
		addUNCHostToAllowlist('localhost');

		// Local UNC paths are in the form of: \\localhost\c$\my_dir
		const uncPath = `\\\\localhost\\${getDriveLetter(testDir)?.toLowerCase()}$\\${ltrim(testDir.substr(testDir.indexOf(':') + 1), '\\')}`;

		await watcher.watch([{ path: uncPath, excludes: [], recursive: false }]);

		return basicCrudTest(join(uncPath, 'newFile.txt'));
	});

	(!isWindows /* UNC is windows only */ ? test.skip : test)('unc support (file watch)', async function () {
		addUNCHostToAllowlist('localhost');

		// Local UNC paths are in the form of: \\localhost\c$\my_dir
		const uncPath = `\\\\localhost\\${getDriveLetter(testDir)?.toLowerCase()}$\\${ltrim(testDir.substr(testDir.indexOf(':') + 1), '\\')}\\lorem.txt`;

		await watcher.watch([{ path: uncPath, excludes: [], recursive: false }]);

		return basicCrudTest(uncPath, true);
	});

	(isLinux /* linux: is case sensitive */ ? test.skip : test)('wrong casing (folder watch)', async function () {
		const wrongCase = join(dirname(testDir), basename(testDir).toUpperCase());

		await watcher.watch([{ path: wrongCase, excludes: [], recursive: false }]);

		return basicCrudTest(join(wrongCase, 'newFile.txt'));
	});

	(isLinux /* linux: is case sensitive */ ? test.skip : test)('wrong casing (file watch)', async function () {
		const filePath = join(testDir, 'LOREM.txt');
		await watcher.watch([{ path: filePath, excludes: [], recursive: false }]);

		return basicCrudTest(filePath, true);
	});

	test('invalid path does not explode', async function () {
		const invalidPath = join(testDir, 'invalid');

		await watcher.watch([{ path: invalidPath, excludes: [], recursive: false }]);
	});

	test('watchFileContents', async function () {
		const watchedPath = join(testDir, 'lorem.txt');

		const cts = new CancellationTokenSource();

		const readyPromise = new DeferredPromise<void>();
		const chunkPromise = new DeferredPromise<void>();
		const watchPromise = watchFileContents(watchedPath, () => chunkPromise.complete(), () => readyPromise.complete(), cts.token);

		await readyPromise.p;

		Promises.writeFile(watchedPath, 'Hello World');

		await chunkPromise.p;

		cts.cancel(); // this will resolve `watchPromise`

		return watchPromise;
	});

	test('watching same or overlapping paths supported when correlation is applied', async function () {
		await watcher.watch([
			{ path: testDir, excludes: [], recursive: false, correlationId: 1 }
		]);

		await basicCrudTest(join(testDir, 'newFile_1.txt'), undefined, null, 1);

		await watcher.watch([
			{ path: testDir, excludes: [], recursive: false, correlationId: 1 },
			{ path: testDir, excludes: [], recursive: false, correlationId: 2, },
			{ path: testDir, excludes: [], recursive: false, correlationId: undefined }
		]);

		await basicCrudTest(join(testDir, 'newFile_2.txt'), undefined, null, 3);
		await basicCrudTest(join(testDir, 'otherNewFile.txt'), undefined, null, 3);
	});

	test('watching missing path emits watcher fail event', async function () {
		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);

		const folderPath = join(testDir, 'missing');
		watcher.watch([{ path: folderPath, excludes: [], recursive: true }]);

		await onDidWatchFail;
	});

	test('deleting watched path emits watcher fail and delete event when correlated (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');

		await watcher.watch([{ path: filePath, excludes: [], recursive: false, correlationId: 1 }]);

		const instance = Array.from(watcher.watchers)[0].instance;

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		const changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, 1);
		fs.promises.unlink(filePath);
		await onDidWatchFail;
		await changeFuture;
		assert.strictEqual(instance.failed, true);
	});

	(isMacintosh || isWindows /* macOS: does not seem to report deletes on folders | Windows: reports on('error') event only */ ? test.skip : test)('deleting watched path emits watcher fail and delete event when correlated (folder watch)', async function () {
		const folderPath = join(testDir, 'deep');

		await watcher.watch([{ path: folderPath, excludes: [], recursive: false, correlationId: 1 }]);

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		const changeFuture = awaitEvent(watcher, folderPath, FileChangeType.DELETED, 1);
		Promises.rm(folderPath, RimRafMode.UNLINK);
		await onDidWatchFail;
		await changeFuture;
	});

	test('watch requests support suspend/resume (file, does not exist in beginning)', async function () {
		const filePath = join(testDir, 'not-found.txt');

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		const request = { path: filePath, excludes: [], recursive: false };
		await watcher.watch([request]);
		await onDidWatchFail;
		assert.strictEqual(watcher.isSuspended(request), 'polling');

		await basicCrudTest(filePath, undefined, null, undefined, true);
		await basicCrudTest(filePath, undefined, null, undefined, true);
	});

	test('watch requests support suspend/resume (file, exists in beginning)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		const request = { path: filePath, excludes: [], recursive: false };
		await watcher.watch([request]);

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		await basicCrudTest(filePath, true);
		await onDidWatchFail;
		assert.strictEqual(watcher.isSuspended(request), 'polling');

		await basicCrudTest(filePath, undefined, null, undefined, true);
	});

	(isWindows /* Windows: does not seem to report this */ ? test.skip : test)('watch requests support suspend/resume (folder, does not exist in beginning)', async function () {
		let onDidWatchFail = Event.toPromise(watcher.onWatchFail);

		const folderPath = join(testDir, 'not-found');
		const request = { path: folderPath, excludes: [], recursive: false };
		await watcher.watch([request]);
		await onDidWatchFail;
		assert.strictEqual(watcher.isSuspended(request), 'polling');

		let changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
		let onDidWatch = Event.toPromise(watcher.onDidWatch);
		await fs.promises.mkdir(folderPath);
		await changeFuture;
		await onDidWatch;

		assert.strictEqual(watcher.isSuspended(request), false);

		if (isWindows) { // somehow failing on macOS/Linux
			const filePath = join(folderPath, 'newFile.txt');
			await basicCrudTest(filePath);

			onDidWatchFail = Event.toPromise(watcher.onWatchFail);
			await fs.promises.rmdir(folderPath);
			await onDidWatchFail;

			changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
			onDidWatch = Event.toPromise(watcher.onDidWatch);
			await fs.promises.mkdir(folderPath);
			await changeFuture;
			await onDidWatch;

			await timeout(500); // somehow needed on Linux

			await basicCrudTest(filePath);
		}
	});

	(isMacintosh /* macOS: does not seem to report this */ ? test.skip : test)('watch requests support suspend/resume (folder, exists in beginning)', async function () {
		const folderPath = join(testDir, 'deep');
		await watcher.watch([{ path: folderPath, excludes: [], recursive: false }]);

		const filePath = join(folderPath, 'newFile.txt');
		await basicCrudTest(filePath);

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		await Promises.rm(folderPath);
		await onDidWatchFail;

		const changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
		const onDidWatch = Event.toPromise(watcher.onDidWatch);
		await fs.promises.mkdir(folderPath);
		await changeFuture;
		await onDidWatch;

		await timeout(500); // somehow needed on Linux

		await basicCrudTest(filePath);
	});

	test('parcel watcher reused when present for non-recursive file watching (uncorrelated)', function () {
		return testParcelWatcherReused(undefined);
	});

	test('parcel watcher reused when present for non-recursive file watching (correlated)', function () {
		return testParcelWatcherReused(2);
	});

	function createParcelWatcher() {
		const recursiveWatcher = new TestParcelWatcher();
		recursiveWatcher.setVerboseLogging(loggingEnabled);
		recursiveWatcher.onDidLogMessage(e => {
			if (loggingEnabled) {
				console.log(`[recursive watcher test message] ${e.message}`);
			}
		});

		recursiveWatcher.onDidError(e => {
			if (loggingEnabled) {
				console.log(`[recursive watcher test error] ${e.error}`);
			}
		});

		return recursiveWatcher;
	}

	async function testParcelWatcherReused(correlationId: number | undefined) {
		const recursiveWatcher = createParcelWatcher();
		await recursiveWatcher.watch([{ path: testDir, excludes: [], recursive: true, correlationId: 1 }]);

		const recursiveInstance = Array.from(recursiveWatcher.watchers)[0];
		assert.strictEqual(recursiveInstance.subscriptionsCount, 0);

		await createWatcher(recursiveWatcher);

		const filePath = join(testDir, 'deep', 'conway.js');
		await watcher.watch([{ path: filePath, excludes: [], recursive: false, correlationId }]);

		const { instance } = Array.from(watcher.watchers)[0];
		assert.strictEqual(instance.isReusingRecursiveWatcher, true);
		assert.strictEqual(recursiveInstance.subscriptionsCount, 1);

		let changeFuture = awaitEvent(watcher, filePath, isMacintosh /* somehow fsevents seems to report still on the initial create from test setup */ ? FileChangeType.ADDED : FileChangeType.UPDATED, correlationId);
		await Promises.writeFile(filePath, 'Hello World');
		await changeFuture;

		await recursiveWatcher.stop();
		recursiveWatcher.dispose();

		await timeout(500); // give the watcher some time to restart

		changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED, correlationId);
		await Promises.writeFile(filePath, 'Hello World');
		await changeFuture;

		assert.strictEqual(instance.isReusingRecursiveWatcher, false);
	}

	test('watch requests support suspend/resume (file, does not exist in beginning, parcel watcher reused)', async function () {
		const recursiveWatcher = createParcelWatcher();
		await recursiveWatcher.watch([{ path: testDir, excludes: [], recursive: true }]);

		await createWatcher(recursiveWatcher);

		const filePath = join(testDir, 'not-found-2.txt');

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		const request = { path: filePath, excludes: [], recursive: false };
		await watcher.watch([request]);
		await onDidWatchFail;
		assert.strictEqual(watcher.isSuspended(request), true);

		const changeFuture = awaitEvent(watcher, filePath, FileChangeType.ADDED);
		await Promises.writeFile(filePath, 'Hello World');
		await changeFuture;

		assert.strictEqual(watcher.isSuspended(request), false);
	});

	test('event type filter (file watch)', async function () {
		const filePath = join(testDir, 'lorem.txt');
		const request = { path: filePath, excludes: [], recursive: false, filter: FileChangeFilter.UPDATED | FileChangeFilter.DELETED, correlationId: 1 };
		await watcher.watch([request]);

		// Change file
		let changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED, 1);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, 1);
		await fs.promises.unlink(filePath);
		await changeFuture;
	});

	test('event type filter (folder watch)', async function () {
		const request = { path: testDir, excludes: [], recursive: false, filter: FileChangeFilter.UPDATED | FileChangeFilter.DELETED, correlationId: 1 };
		await watcher.watch([request]);

		// Change file
		const filePath = join(testDir, 'lorem.txt');
		let changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED, 1);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, 1);
		await fs.promises.unlink(filePath);
		await changeFuture;
	});

	(isLinux ? test.skip : test)('includes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['*.TXT'], recursive: false }]);

		return basicCrudTest(join(testDir, 'newFile.txt'));
	});

	(isLinux ? test.skip : test)('excludes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: ['*.TXT'], recursive: false }]);

		// New file (should be excluded)
		const newFilePath = join(testDir, 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');

		const res = await Promise.any([
			timeout(500).then(() => true),
			changeFuture.then(() => false)
		]);

		if (!res) {
			assert.fail('Unexpected change event');
		}
	});

	(isLinux ? test.skip : test)('excludes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: ['*.TXT'], recursive: false }]);

		// New file (should be excluded)
		const newFilePath = join(testDir, 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');

		const res = await Promise.any([
			timeout(500).then(() => true),
			changeFuture.then(() => false)
		]);

		if (!res) {
			assert.fail('Unexpected change event');
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/parcelWatcher.test.ts]---
Location: vscode-main/src/vs/platform/files/test/node/parcelWatcher.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { realpathSync, promises } from 'fs';
import { tmpdir } from 'os';
import { timeout } from '../../../../base/common/async.js';
import { dirname, join } from '../../../../base/common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { Promises, RimRafMode } from '../../../../base/node/pfs.js';
import { getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { FileChangeFilter, FileChangeType, IFileChange } from '../../common/files.js';
import { ParcelWatcher } from '../../node/watcher/parcel/parcelWatcher.js';
import { IRecursiveWatchRequest } from '../../common/watcher.js';
import { getDriveLetter } from '../../../../base/common/extpath.js';
import { ltrim } from '../../../../base/common/strings.js';
import { FileAccess } from '../../../../base/common/network.js';
import { extUriBiasedIgnorePathCase } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { addUNCHostToAllowlist } from '../../../../base/node/unc.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export class TestParcelWatcher extends ParcelWatcher {

	protected override readonly suspendedWatchRequestPollingInterval = 100;

	private readonly _onDidWatch = this._register(new Emitter<void>());
	readonly onDidWatch = this._onDidWatch.event;

	readonly onWatchFail = this._onDidWatchFail.event;

	async testRemoveDuplicateRequests(paths: string[], excludes: string[] = []): Promise<string[]> {

		// Work with strings as paths to simplify testing
		const requests: IRecursiveWatchRequest[] = paths.map(path => {
			return { path, excludes, recursive: true };
		});

		return (await this.removeDuplicateRequests(requests, false /* validate paths skipped for tests */)).map(request => request.path);
	}

	protected override getUpdateWatchersDelay(): number {
		return 0;
	}

	protected override async doWatch(requests: IRecursiveWatchRequest[]): Promise<void> {
		await super.doWatch(requests);
		await this.whenReady();

		this._onDidWatch.fire();
	}

	async whenReady(): Promise<void> {
		for (const watcher of this.watchers) {
			await watcher.ready;
		}
	}
}

// this suite has shown flaky runs in Azure pipelines where
// tasks would just hang and timeout after a while (not in
// mocha but generally). as such they will run only on demand
// whenever we update the watcher library.

suite.skip('File Watcher (parcel)', function () {

	this.timeout(10000);

	let testDir: string;
	let watcher: TestParcelWatcher;

	let loggingEnabled = false;

	function enableLogging(enable: boolean) {
		loggingEnabled = enable;
		watcher?.setVerboseLogging(enable);
	}

	enableLogging(loggingEnabled);

	setup(async () => {
		watcher = new TestParcelWatcher();
		watcher.setVerboseLogging(loggingEnabled);

		watcher.onDidLogMessage(e => {
			if (loggingEnabled) {
				console.log(`[recursive watcher test message] ${e.message}`);
			}
		});

		watcher.onDidError(e => {
			if (loggingEnabled) {
				console.log(`[recursive watcher test error] ${e.error}`);
			}
		});

		// Rule out strange testing conditions by using the realpath
		// here. for example, on macOS the tmp dir is potentially a
		// symlink in some of the root folders, which is a rather
		// unrealisic case for the file watcher.
		testDir = URI.file(getRandomTestPath(realpathSync(tmpdir()), 'vsctests', 'filewatcher')).fsPath;

		const sourceDir = FileAccess.asFileUri('vs/platform/files/test/node/fixtures/service').fsPath;

		await Promises.copy(sourceDir, testDir, { preserveSymlinks: false });
	});

	teardown(async () => {
		const watchers = Array.from(watcher.watchers).length;
		let stoppedInstances = 0;
		for (const instance of watcher.watchers) {
			Event.once(instance.onDidStop)(() => {
				if (instance.stopped) {
					stoppedInstances++;
				}
			});
		}

		await watcher.stop();
		assert.strictEqual(stoppedInstances, watchers, 'All watchers must be stopped before the test ends');
		watcher.dispose();

		// Possible that the file watcher is still holding
		// onto the folders on Windows specifically and the
		// unlink would fail. In that case, do not fail the
		// test suite.
		return Promises.rm(testDir).catch(error => console.error(error));
	});

	function toMsg(type: FileChangeType): string {
		switch (type) {
			case FileChangeType.ADDED: return 'added';
			case FileChangeType.DELETED: return 'deleted';
			default: return 'changed';
		}
	}

	async function awaitEvent(watcher: TestParcelWatcher, path: string, type: FileChangeType, failOnEventReason?: string, correlationId?: number | null, expectedCount?: number): Promise<IFileChange[]> {
		if (loggingEnabled) {
			console.log(`Awaiting change type '${toMsg(type)}' on file '${path}'`);
		}

		// Await the event
		const res = await new Promise<IFileChange[]>((resolve, reject) => {
			let counter = 0;
			const disposable = watcher.onDidChangeFile(events => {
				for (const event of events) {
					if (extUriBiasedIgnorePathCase.isEqual(event.resource, URI.file(path)) && event.type === type && (correlationId === null || event.cId === correlationId)) {
						counter++;
						if (typeof expectedCount === 'number' && counter < expectedCount) {
							continue; // not yet
						}

						disposable.dispose();
						if (failOnEventReason) {
							reject(new Error(`Unexpected file event: ${failOnEventReason}`));
						} else {
							setImmediate(() => resolve(events)); // copied from parcel watcher tests, seems to drop unrelated events on macOS
						}
						break;
					}
				}
			});
		});

		// Unwind from the event call stack: we have seen crashes in Parcel
		// when e.g. calling `unsubscribe` directly from the stack of a file
		// change event
		// Refs: https://github.com/microsoft/vscode/issues/137430
		await timeout(1);

		return res;
	}

	function awaitMessage(watcher: TestParcelWatcher, type: 'trace' | 'warn' | 'error' | 'info' | 'debug'): Promise<void> {
		if (loggingEnabled) {
			console.log(`Awaiting message of type ${type}`);
		}

		// Await the message
		return new Promise<void>(resolve => {
			const disposable = watcher.onDidLogMessage(msg => {
				if (msg.type === type) {
					disposable.dispose();
					resolve();
				}
			});
		});
	}

	test('basics', async function () {
		const request = { path: testDir, excludes: [], recursive: true };
		await watcher.watch([request]);

		const instance = Array.from(watcher.watchers)[0];
		assert.strictEqual(request, instance.request);
		assert.strictEqual(instance.failed, false);
		assert.strictEqual(instance.stopped, false);

		const disposables = new DisposableStore();

		const subscriptions1 = new Map<string, FileChangeType>();
		const subscriptions2 = new Map<string, FileChangeType>();

		// New file
		const newFilePath = join(testDir, 'deep', 'newFile.txt');
		disposables.add(instance.subscribe(newFilePath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		disposables.add(instance.subscribe(newFilePath, change => subscriptions2.set(change.resource.fsPath, change.type))); // can subscribe multiple times
		assert.strictEqual(instance.include(newFilePath), true);
		assert.strictEqual(instance.exclude(newFilePath), false);
		let changeFuture: Promise<unknown> = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');
		await changeFuture;
		assert.strictEqual(subscriptions1.get(newFilePath), FileChangeType.ADDED);
		assert.strictEqual(subscriptions2.get(newFilePath), FileChangeType.ADDED);

		// New folder
		const newFolderPath = join(testDir, 'deep', 'New Folder');
		disposables.add(instance.subscribe(newFolderPath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		const disposable = instance.subscribe(newFolderPath, change => subscriptions2.set(change.resource.fsPath, change.type));
		disposable.dispose();
		assert.strictEqual(instance.include(newFolderPath), true);
		assert.strictEqual(instance.exclude(newFolderPath), false);
		changeFuture = awaitEvent(watcher, newFolderPath, FileChangeType.ADDED);
		await promises.mkdir(newFolderPath);
		await changeFuture;
		assert.strictEqual(subscriptions1.get(newFolderPath), FileChangeType.ADDED);
		assert.strictEqual(subscriptions2.has(newFolderPath), false /* subscription was disposed before the event */);

		// Rename file
		let renamedFilePath = join(testDir, 'deep', 'renamedFile.txt');
		disposables.add(instance.subscribe(renamedFilePath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		changeFuture = Promise.all([
			awaitEvent(watcher, newFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, renamedFilePath, FileChangeType.ADDED)
		]);
		await Promises.rename(newFilePath, renamedFilePath);
		await changeFuture;
		assert.strictEqual(subscriptions1.get(newFilePath), FileChangeType.DELETED);
		assert.strictEqual(subscriptions1.get(renamedFilePath), FileChangeType.ADDED);

		// Rename folder
		let renamedFolderPath = join(testDir, 'deep', 'Renamed Folder');
		disposables.add(instance.subscribe(renamedFolderPath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		changeFuture = Promise.all([
			awaitEvent(watcher, newFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, renamedFolderPath, FileChangeType.ADDED)
		]);
		await Promises.rename(newFolderPath, renamedFolderPath);
		await changeFuture;
		assert.strictEqual(subscriptions1.get(newFolderPath), FileChangeType.DELETED);
		assert.strictEqual(subscriptions1.get(renamedFolderPath), FileChangeType.ADDED);

		// Rename file (same name, different case)
		const caseRenamedFilePath = join(testDir, 'deep', 'RenamedFile.txt');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, caseRenamedFilePath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFilePath, caseRenamedFilePath);
		await changeFuture;
		renamedFilePath = caseRenamedFilePath;

		// Rename folder (same name, different case)
		const caseRenamedFolderPath = join(testDir, 'deep', 'REnamed Folder');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, caseRenamedFolderPath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFolderPath, caseRenamedFolderPath);
		await changeFuture;
		renamedFolderPath = caseRenamedFolderPath;

		// Move file
		const movedFilepath = join(testDir, 'movedFile.txt');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFilePath, FileChangeType.DELETED),
			awaitEvent(watcher, movedFilepath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFilePath, movedFilepath);
		await changeFuture;

		// Move folder
		const movedFolderpath = join(testDir, 'Moved Folder');
		changeFuture = Promise.all([
			awaitEvent(watcher, renamedFolderPath, FileChangeType.DELETED),
			awaitEvent(watcher, movedFolderpath, FileChangeType.ADDED)
		]);
		await Promises.rename(renamedFolderPath, movedFolderpath);
		await changeFuture;

		// Copy file
		const copiedFilepath = join(testDir, 'deep', 'copiedFile.txt');
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.ADDED);
		await promises.copyFile(movedFilepath, copiedFilepath);
		await changeFuture;

		// Copy folder
		const copiedFolderpath = join(testDir, 'deep', 'Copied Folder');
		changeFuture = awaitEvent(watcher, copiedFolderpath, FileChangeType.ADDED);
		await Promises.copy(movedFolderpath, copiedFolderpath, { preserveSymlinks: false });
		await changeFuture;

		// Change file
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.UPDATED);
		await Promises.writeFile(copiedFilepath, 'Hello Change');
		await changeFuture;

		// Create new file
		const anotherNewFilePath = join(testDir, 'deep', 'anotherNewFile.txt');
		changeFuture = awaitEvent(watcher, anotherNewFilePath, FileChangeType.ADDED);
		await Promises.writeFile(anotherNewFilePath, 'Hello Another World');
		await changeFuture;

		// Read file does not emit event
		changeFuture = awaitEvent(watcher, anotherNewFilePath, FileChangeType.UPDATED, 'unexpected-event-from-read-file');
		await promises.readFile(anotherNewFilePath);
		await Promise.race([timeout(100), changeFuture]);

		// Stat file does not emit event
		changeFuture = awaitEvent(watcher, anotherNewFilePath, FileChangeType.UPDATED, 'unexpected-event-from-stat');
		await promises.stat(anotherNewFilePath);
		await Promise.race([timeout(100), changeFuture]);

		// Stat folder does not emit event
		changeFuture = awaitEvent(watcher, copiedFolderpath, FileChangeType.UPDATED, 'unexpected-event-from-stat');
		await promises.stat(copiedFolderpath);
		await Promise.race([timeout(100), changeFuture]);

		// Delete file
		changeFuture = awaitEvent(watcher, copiedFilepath, FileChangeType.DELETED);
		disposables.add(instance.subscribe(copiedFilepath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		await promises.unlink(copiedFilepath);
		await changeFuture;
		assert.strictEqual(subscriptions1.get(copiedFilepath), FileChangeType.DELETED);

		// Delete folder
		changeFuture = awaitEvent(watcher, copiedFolderpath, FileChangeType.DELETED);
		disposables.add(instance.subscribe(copiedFolderpath, change => subscriptions1.set(change.resource.fsPath, change.type)));
		await promises.rmdir(copiedFolderpath);
		await changeFuture;
		assert.strictEqual(subscriptions1.get(copiedFolderpath), FileChangeType.DELETED);

		disposables.dispose();
	});

	(isMacintosh /* this test seems not possible with fsevents backend */ ? test.skip : test)('basics (atomic writes)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], recursive: true }]);

		// Delete + Recreate file
		const newFilePath = join(testDir, 'deep', 'conway.js');
		const changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.UPDATED);
		await promises.unlink(newFilePath);
		Promises.writeFile(newFilePath, 'Hello Atomic World');
		await changeFuture;
	});

	(!isLinux /* polling is only used in linux environments (WSL) */ ? test.skip : test)('basics (polling)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], pollingInterval: 100, recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	async function basicCrudTest(filePath: string, correlationId?: number | null, expectedCount?: number): Promise<void> {

		// New file
		let changeFuture = awaitEvent(watcher, filePath, FileChangeType.ADDED, undefined, correlationId, expectedCount);
		await Promises.writeFile(filePath, 'Hello World');
		await changeFuture;

		// Change file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.UPDATED, undefined, correlationId, expectedCount);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, undefined, correlationId, expectedCount);
		await promises.unlink(filePath);
		await changeFuture;
	}

	test('multiple events', async function () {
		await watcher.watch([{ path: testDir, excludes: [], recursive: true }]);
		await promises.mkdir(join(testDir, 'deep-multiple'));

		// multiple add

		const newFilePath1 = join(testDir, 'newFile-1.txt');
		const newFilePath2 = join(testDir, 'newFile-2.txt');
		const newFilePath3 = join(testDir, 'newFile-3.txt');
		const newFilePath4 = join(testDir, 'deep-multiple', 'newFile-1.txt');
		const newFilePath5 = join(testDir, 'deep-multiple', 'newFile-2.txt');
		const newFilePath6 = join(testDir, 'deep-multiple', 'newFile-3.txt');

		const addedFuture1 = awaitEvent(watcher, newFilePath1, FileChangeType.ADDED);
		const addedFuture2 = awaitEvent(watcher, newFilePath2, FileChangeType.ADDED);
		const addedFuture3 = awaitEvent(watcher, newFilePath3, FileChangeType.ADDED);
		const addedFuture4 = awaitEvent(watcher, newFilePath4, FileChangeType.ADDED);
		const addedFuture5 = awaitEvent(watcher, newFilePath5, FileChangeType.ADDED);
		const addedFuture6 = awaitEvent(watcher, newFilePath6, FileChangeType.ADDED);

		await Promise.all([
			await Promises.writeFile(newFilePath1, 'Hello World 1'),
			await Promises.writeFile(newFilePath2, 'Hello World 2'),
			await Promises.writeFile(newFilePath3, 'Hello World 3'),
			await Promises.writeFile(newFilePath4, 'Hello World 4'),
			await Promises.writeFile(newFilePath5, 'Hello World 5'),
			await Promises.writeFile(newFilePath6, 'Hello World 6')
		]);

		await Promise.all([addedFuture1, addedFuture2, addedFuture3, addedFuture4, addedFuture5, addedFuture6]);

		// multiple change

		const changeFuture1 = awaitEvent(watcher, newFilePath1, FileChangeType.UPDATED);
		const changeFuture2 = awaitEvent(watcher, newFilePath2, FileChangeType.UPDATED);
		const changeFuture3 = awaitEvent(watcher, newFilePath3, FileChangeType.UPDATED);
		const changeFuture4 = awaitEvent(watcher, newFilePath4, FileChangeType.UPDATED);
		const changeFuture5 = awaitEvent(watcher, newFilePath5, FileChangeType.UPDATED);
		const changeFuture6 = awaitEvent(watcher, newFilePath6, FileChangeType.UPDATED);

		await Promise.all([
			await Promises.writeFile(newFilePath1, 'Hello Update 1'),
			await Promises.writeFile(newFilePath2, 'Hello Update 2'),
			await Promises.writeFile(newFilePath3, 'Hello Update 3'),
			await Promises.writeFile(newFilePath4, 'Hello Update 4'),
			await Promises.writeFile(newFilePath5, 'Hello Update 5'),
			await Promises.writeFile(newFilePath6, 'Hello Update 6')
		]);

		await Promise.all([changeFuture1, changeFuture2, changeFuture3, changeFuture4, changeFuture5, changeFuture6]);

		// copy with multiple files

		const copyFuture1 = awaitEvent(watcher, join(testDir, 'deep-multiple-copy', 'newFile-1.txt'), FileChangeType.ADDED);
		const copyFuture2 = awaitEvent(watcher, join(testDir, 'deep-multiple-copy', 'newFile-2.txt'), FileChangeType.ADDED);
		const copyFuture3 = awaitEvent(watcher, join(testDir, 'deep-multiple-copy', 'newFile-3.txt'), FileChangeType.ADDED);
		const copyFuture4 = awaitEvent(watcher, join(testDir, 'deep-multiple-copy'), FileChangeType.ADDED);

		await Promises.copy(join(testDir, 'deep-multiple'), join(testDir, 'deep-multiple-copy'), { preserveSymlinks: false });

		await Promise.all([copyFuture1, copyFuture2, copyFuture3, copyFuture4]);

		// multiple delete (single files)

		const deleteFuture1 = awaitEvent(watcher, newFilePath1, FileChangeType.DELETED);
		const deleteFuture2 = awaitEvent(watcher, newFilePath2, FileChangeType.DELETED);
		const deleteFuture3 = awaitEvent(watcher, newFilePath3, FileChangeType.DELETED);
		const deleteFuture4 = awaitEvent(watcher, newFilePath4, FileChangeType.DELETED);
		const deleteFuture5 = awaitEvent(watcher, newFilePath5, FileChangeType.DELETED);
		const deleteFuture6 = awaitEvent(watcher, newFilePath6, FileChangeType.DELETED);

		await Promise.all([
			await promises.unlink(newFilePath1),
			await promises.unlink(newFilePath2),
			await promises.unlink(newFilePath3),
			await promises.unlink(newFilePath4),
			await promises.unlink(newFilePath5),
			await promises.unlink(newFilePath6)
		]);

		await Promise.all([deleteFuture1, deleteFuture2, deleteFuture3, deleteFuture4, deleteFuture5, deleteFuture6]);

		// multiple delete (folder)

		const deleteFolderFuture1 = awaitEvent(watcher, join(testDir, 'deep-multiple'), FileChangeType.DELETED);
		const deleteFolderFuture2 = awaitEvent(watcher, join(testDir, 'deep-multiple-copy'), FileChangeType.DELETED);

		await Promise.all([Promises.rm(join(testDir, 'deep-multiple'), RimRafMode.UNLINK), Promises.rm(join(testDir, 'deep-multiple-copy'), RimRafMode.UNLINK)]);

		await Promise.all([deleteFolderFuture1, deleteFolderFuture2]);
	});

	test('subsequent watch updates watchers (path)', async function () {
		await watcher.watch([{ path: testDir, excludes: [join(realpathSync(testDir), 'unrelated')], recursive: true }]);

		// New file (*.txt)
		let newTextFilePath = join(testDir, 'deep', 'newFile.txt');
		let changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');
		await changeFuture;

		await watcher.watch([{ path: join(testDir, 'deep'), excludes: [join(realpathSync(testDir), 'unrelated')], recursive: true }]);
		newTextFilePath = join(testDir, 'deep', 'newFile2.txt');
		changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');
		await changeFuture;

		await watcher.watch([{ path: join(testDir, 'deep'), excludes: [realpathSync(testDir)], recursive: true }]);
		await watcher.watch([{ path: join(testDir, 'deep'), excludes: [], recursive: true }]);
		newTextFilePath = join(testDir, 'deep', 'newFile3.txt');
		changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');
		await changeFuture;
	});

	test('invalid path does not crash watcher', async function () {
		await watcher.watch([
			{ path: testDir, excludes: [], recursive: true },
			{ path: join(testDir, 'invalid-folder'), excludes: [], recursive: true },
			{ path: FileAccess.asFileUri('').fsPath, excludes: [], recursive: true }
		]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('subsequent watch updates watchers (excludes)', async function () {
		await watcher.watch([{ path: testDir, excludes: [realpathSync(testDir)], recursive: true }]);
		await watcher.watch([{ path: testDir, excludes: [], recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('subsequent watch updates watchers (includes)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['nothing'], recursive: true }]);
		await watcher.watch([{ path: testDir, excludes: [], recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('includes are supported', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['**/deep/**'], recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('includes are supported (relative pattern explicit)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: [{ base: testDir, pattern: 'deep/newFile.txt' }], recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('includes are supported (relative pattern implicit)', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['deep/newFile.txt'], recursive: true }]);

		return basicCrudTest(join(testDir, 'deep', 'newFile.txt'));
	});

	test('excludes are supported (path)', async function () {
		return testExcludes([join(realpathSync(testDir), 'deep')]);
	});

	test('excludes are supported (glob)', function () {
		return testExcludes(['deep/**']);
	});

	async function testExcludes(excludes: string[]) {
		await watcher.watch([{ path: testDir, excludes, recursive: true }]);

		// New file (*.txt)
		const newTextFilePath = join(testDir, 'deep', 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');

		const res = await Promise.any([
			timeout(500).then(() => true),
			changeFuture.then(() => false)
		]);

		if (!res) {
			assert.fail('Unexpected change event');
		}
	}

	(isWindows /* windows: cannot create file symbolic link without elevated context */ ? test.skip : test)('symlink support (root)', async function () {
		const link = join(testDir, 'deep-linked');
		const linkTarget = join(testDir, 'deep');
		await promises.symlink(linkTarget, link);

		await watcher.watch([{ path: link, excludes: [], recursive: true }]);

		return basicCrudTest(join(link, 'newFile.txt'));
	});

	(isWindows /* windows: cannot create file symbolic link without elevated context */ ? test.skip : test)('symlink support (via extra watch)', async function () {
		const link = join(testDir, 'deep-linked');
		const linkTarget = join(testDir, 'deep');
		await promises.symlink(linkTarget, link);

		await watcher.watch([{ path: testDir, excludes: [], recursive: true }, { path: link, excludes: [], recursive: true }]);

		return basicCrudTest(join(link, 'newFile.txt'));
	});

	(!isWindows /* UNC is windows only */ ? test.skip : test)('unc support', async function () {
		addUNCHostToAllowlist('localhost');

		// Local UNC paths are in the form of: \\localhost\c$\my_dir
		const uncPath = `\\\\localhost\\${getDriveLetter(testDir)?.toLowerCase()}$\\${ltrim(testDir.substr(testDir.indexOf(':') + 1), '\\')}`;

		await watcher.watch([{ path: uncPath, excludes: [], recursive: true }]);

		return basicCrudTest(join(uncPath, 'deep', 'newFile.txt'));
	});

	(isLinux /* linux: is case sensitive */ ? test.skip : test)('wrong casing', async function () {
		const deepWrongCasedPath = join(testDir, 'DEEP');

		await watcher.watch([{ path: deepWrongCasedPath, excludes: [], recursive: true }]);

		return basicCrudTest(join(deepWrongCasedPath, 'newFile.txt'));
	});

	test('invalid folder does not explode', async function () {
		const invalidPath = join(testDir, 'invalid');

		await watcher.watch([{ path: invalidPath, excludes: [], recursive: true }]);
	});

	(isWindows /* flaky on windows */ ? test.skip : test)('deleting watched path without correlation restarts watching', async function () {
		const watchedPath = join(testDir, 'deep');

		await watcher.watch([{ path: watchedPath, excludes: [], recursive: true }]);

		// Delete watched path and await
		const warnFuture = awaitMessage(watcher, 'warn');
		await Promises.rm(watchedPath, RimRafMode.UNLINK);
		await warnFuture;

		// Restore watched path
		await timeout(1500); // node.js watcher used for monitoring folder restore is async
		await promises.mkdir(watchedPath);
		await timeout(1500); // restart is delayed
		await watcher.whenReady();

		// Verify events come in again
		const newFilePath = join(watchedPath, 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');
		await changeFuture;
	});

	test('correlationId is supported', async function () {
		const correlationId = Math.random();
		await watcher.watch([{ correlationId, path: testDir, excludes: [], recursive: true }]);

		return basicCrudTest(join(testDir, 'newFile.txt'), correlationId);
	});

	test('should not exclude roots that do not overlap', async () => {
		if (isWindows) {
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a']), ['C:\\a']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a', 'C:\\b']), ['C:\\a', 'C:\\b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a', 'C:\\b', 'C:\\c\\d\\e']), ['C:\\a', 'C:\\b', 'C:\\c\\d\\e']);
		} else {
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a']), ['/a']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a', '/b']), ['/a', '/b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a', '/b', '/c/d/e']), ['/a', '/b', '/c/d/e']);
		}
	});

	test('should remove sub-folders of other paths', async () => {
		if (isWindows) {
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a', 'C:\\a\\b']), ['C:\\a']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a', 'C:\\b', 'C:\\a\\b']), ['C:\\a', 'C:\\b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\b\\a', 'C:\\a', 'C:\\b', 'C:\\a\\b']), ['C:\\a', 'C:\\b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['C:\\a', 'C:\\a\\b', 'C:\\a\\c\\d']), ['C:\\a']);
		} else {
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a', '/a/b']), ['/a']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a', '/b', '/a/b']), ['/a', '/b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/b/a', '/a', '/b', '/a/b']), ['/a', '/b']);
			assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/a', '/a/b', '/a/c/d']), ['/a']);
		}
	});

	test('should ignore when everything excluded', async () => {
		assert.deepStrictEqual(await watcher.testRemoveDuplicateRequests(['/foo/bar', '/bar'], ['**', 'something']), []);
	});

	test('watching same or overlapping paths supported when correlation is applied', async () => {
		await watcher.watch([
			{ path: testDir, excludes: [], recursive: true, correlationId: 1 }
		]);

		await basicCrudTest(join(testDir, 'newFile.txt'), null, 1);

		// same path, same options
		await watcher.watch([
			{ path: testDir, excludes: [], recursive: true, correlationId: 1 },
			{ path: testDir, excludes: [], recursive: true, correlationId: 2, },
			{ path: testDir, excludes: [], recursive: true, correlationId: undefined }
		]);

		await basicCrudTest(join(testDir, 'newFile.txt'), null, 3);
		await basicCrudTest(join(testDir, 'otherNewFile.txt'), null, 3);

		// same path, different options
		await watcher.watch([
			{ path: testDir, excludes: [], recursive: true, correlationId: 1 },
			{ path: testDir, excludes: [], recursive: true, correlationId: 2 },
			{ path: testDir, excludes: [], recursive: true, correlationId: undefined },
			{ path: testDir, excludes: [join(realpathSync(testDir), 'deep')], recursive: true, correlationId: 3 },
			{ path: testDir, excludes: [join(realpathSync(testDir), 'other')], recursive: true, correlationId: 4 },
		]);

		await basicCrudTest(join(testDir, 'newFile.txt'), null, 5);
		await basicCrudTest(join(testDir, 'otherNewFile.txt'), null, 5);

		// overlapping paths (same options)
		await watcher.watch([
			{ path: dirname(testDir), excludes: [], recursive: true, correlationId: 1 },
			{ path: testDir, excludes: [], recursive: true, correlationId: 2 },
			{ path: join(testDir, 'deep'), excludes: [], recursive: true, correlationId: 3 },
		]);

		await basicCrudTest(join(testDir, 'deep', 'newFile.txt'), null, 3);
		await basicCrudTest(join(testDir, 'deep', 'otherNewFile.txt'), null, 3);

		// overlapping paths (different options)
		await watcher.watch([
			{ path: dirname(testDir), excludes: [], recursive: true, correlationId: 1 },
			{ path: testDir, excludes: [join(realpathSync(testDir), 'some')], recursive: true, correlationId: 2 },
			{ path: join(testDir, 'deep'), excludes: [join(realpathSync(testDir), 'other')], recursive: true, correlationId: 3 },
		]);

		await basicCrudTest(join(testDir, 'deep', 'newFile.txt'), null, 3);
		await basicCrudTest(join(testDir, 'deep', 'otherNewFile.txt'), null, 3);
	});

	test('watching missing path emits watcher fail event', async function () {
		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);

		const folderPath = join(testDir, 'missing');
		watcher.watch([{ path: folderPath, excludes: [], recursive: true }]);

		await onDidWatchFail;
	});

	test('deleting watched path emits watcher fail and delete event if correlated', async function () {
		const folderPath = join(testDir, 'deep');

		await watcher.watch([{ path: folderPath, excludes: [], recursive: true, correlationId: 1 }]);

		let failed = false;
		const instance = Array.from(watcher.watchers)[0];
		assert.strictEqual(instance.include(folderPath), true);
		instance.onDidFail(() => failed = true);

		const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
		const changeFuture = awaitEvent(watcher, folderPath, FileChangeType.DELETED, undefined, 1);
		Promises.rm(folderPath, RimRafMode.UNLINK);
		await onDidWatchFail;
		await changeFuture;
		assert.strictEqual(failed, true);
		assert.strictEqual(instance.failed, true);
	});

	(!isMacintosh /* Linux/Windows: times out for some reason */ ? test.skip : test)('watch requests support suspend/resume (folder, does not exist in beginning, not reusing watcher)', async () => {
		await testWatchFolderDoesNotExist(false);
	});

	test('watch requests support suspend/resume (folder, does not exist in beginning, reusing watcher)', async () => {
		await testWatchFolderDoesNotExist(true);
	});

	async function testWatchFolderDoesNotExist(reuseExistingWatcher: boolean) {
		let onDidWatchFail = Event.toPromise(watcher.onWatchFail);

		const folderPath = join(testDir, 'not-found');

		const requests: IRecursiveWatchRequest[] = [];
		if (reuseExistingWatcher) {
			requests.push({ path: testDir, excludes: [], recursive: true });
			await watcher.watch(requests);
		}

		const request: IRecursiveWatchRequest = { path: folderPath, excludes: [], recursive: true };
		requests.push(request);

		await watcher.watch(requests);
		await onDidWatchFail;

		if (reuseExistingWatcher) {
			assert.strictEqual(watcher.isSuspended(request), true);
		} else {
			assert.strictEqual(watcher.isSuspended(request), 'polling');
		}

		let changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
		let onDidWatch = Event.toPromise(watcher.onDidWatch);
		await promises.mkdir(folderPath);
		await changeFuture;
		await onDidWatch;

		assert.strictEqual(watcher.isSuspended(request), false);

		const filePath = join(folderPath, 'newFile.txt');
		await basicCrudTest(filePath);

		if (!reuseExistingWatcher) {
			onDidWatchFail = Event.toPromise(watcher.onWatchFail);
			await Promises.rm(folderPath);
			await onDidWatchFail;

			changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
			onDidWatch = Event.toPromise(watcher.onDidWatch);
			await promises.mkdir(folderPath);
			await changeFuture;
			await onDidWatch;

			await basicCrudTest(filePath);
		}
	}

	(!isMacintosh /* Linux/Windows: times out for some reason */ ? test.skip : test)('watch requests support suspend/resume (folder, exist in beginning, not reusing watcher)', async () => {
		await testWatchFolderExists(false);
	});

	test('watch requests support suspend/resume (folder, exist in beginning, reusing watcher)', async () => {
		await testWatchFolderExists(true);
	});

	async function testWatchFolderExists(reuseExistingWatcher: boolean) {
		const folderPath = join(testDir, 'deep');

		const requests: IRecursiveWatchRequest[] = [{ path: folderPath, excludes: [], recursive: true }];
		if (reuseExistingWatcher) {
			requests.push({ path: testDir, excludes: [], recursive: true });
		}

		await watcher.watch(requests);

		const filePath = join(folderPath, 'newFile.txt');
		await basicCrudTest(filePath);

		if (!reuseExistingWatcher) {
			const onDidWatchFail = Event.toPromise(watcher.onWatchFail);
			await Promises.rm(folderPath);
			await onDidWatchFail;

			const changeFuture = awaitEvent(watcher, folderPath, FileChangeType.ADDED);
			const onDidWatch = Event.toPromise(watcher.onDidWatch);
			await promises.mkdir(folderPath);
			await changeFuture;
			await onDidWatch;

			await basicCrudTest(filePath);
		}
	}

	test('watch request reuses another recursive watcher even when requests are coming in at the same time', async function () {
		const folderPath1 = join(testDir, 'deep', 'not-existing1');
		const folderPath2 = join(testDir, 'deep', 'not-existing2');
		const folderPath3 = join(testDir, 'not-existing3');

		const requests: IRecursiveWatchRequest[] = [
			{ path: folderPath1, excludes: [], recursive: true, correlationId: 1 },
			{ path: folderPath2, excludes: [], recursive: true, correlationId: 2 },
			{ path: folderPath3, excludes: [], recursive: true, correlationId: 3 },
			{ path: join(testDir, 'deep'), excludes: [], recursive: true }
		];

		await watcher.watch(requests);

		assert.strictEqual(watcher.isSuspended(requests[0]), true);
		assert.strictEqual(watcher.isSuspended(requests[1]), true);
		assert.strictEqual(watcher.isSuspended(requests[2]), 'polling');
		assert.strictEqual(watcher.isSuspended(requests[3]), false);
	});

	test('event type filter', async function () {
		const request = { path: testDir, excludes: [], recursive: true, filter: FileChangeFilter.ADDED | FileChangeFilter.DELETED, correlationId: 1 };
		await watcher.watch([request]);

		// Change file
		const filePath = join(testDir, 'lorem-newfile.txt');
		let changeFuture = awaitEvent(watcher, filePath, FileChangeType.ADDED, undefined, 1);
		await Promises.writeFile(filePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, filePath, FileChangeType.DELETED, undefined, 1);
		await promises.unlink(filePath);
		await changeFuture;
	});

	(isLinux ? test.skip : test)('includes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['**/*.TXT'], recursive: true }]);

		// New file (matches *.TXT case-insensitively)
		const newFilePath = join(testDir, 'deep', 'newFile.txt');
		let changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');
		await changeFuture;

		// Change file
		changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.UPDATED);
		await Promises.writeFile(newFilePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.DELETED);
		await promises.unlink(newFilePath);
		await changeFuture;
	});

	(isLinux ? test.skip : test)('includes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: [], includes: ['**/*.TXT'], recursive: true }]);

		// New file (matches *.TXT case-insensitively)
		const newFilePath = join(testDir, 'deep', 'newFile.txt');
		let changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newFilePath, 'Hello World');
		await changeFuture;

		// Change file
		changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.UPDATED);
		await Promises.writeFile(newFilePath, 'Hello Change');
		await changeFuture;

		// Delete file
		changeFuture = awaitEvent(watcher, newFilePath, FileChangeType.DELETED);
		await promises.unlink(newFilePath);
		await changeFuture;
	});

	(isLinux ? test.skip : test)('excludes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: ['**/DEEP/**'], recursive: true }]);

		// New file in excluded folder (should not trigger event)
		const newTextFilePath = join(testDir, 'deep', 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');

		const res = await Promise.any([
			timeout(500).then(() => true),
			changeFuture.then(() => false)
		]);

		if (!res) {
			assert.fail('Unexpected change event');
		}
	});

	(isLinux ? test.skip : test)('excludes are case insensitive on Windows/Mac', async function () {
		await watcher.watch([{ path: testDir, excludes: ['**/DEEP/**'], recursive: true }]);

		// New file in excluded folder (should not trigger event)
		const newTextFilePath = join(testDir, 'deep', 'newFile.txt');
		const changeFuture = awaitEvent(watcher, newTextFilePath, FileChangeType.ADDED);
		await Promises.writeFile(newTextFilePath, 'Hello World');

		const res = await Promise.any([
			timeout(500).then(() => true),
			changeFuture.then(() => false)
		]);

		if (!res) {
			assert.fail('Unexpected change event');
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/index.html]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/index.html

```html
<!DOCTYPE html>
<html>
<head id='headID'>
    <title>Strada </title>
    <link href="site.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.4.1.js"></script>
    <script src="../compiler/dtree.js" type="text/javascript"></script>
    <script src="../compiler/typescript.js" type="text/javascript"></script>
    <script type="text/javascript">

    // Compile strada source into resulting javascript
    function compile(prog, libText) {
        var outfile = {
          source: "",
          Write: function (s) { this.source += s; },
          WriteLine: function (s) { this.source += s + "\r"; },
        }

        var parseErrors = []

        var compiler=new Tools.TypeScriptCompiler(outfile,true);
        compiler.setErrorCallback(function(start,len, message) { parseErrors.push({start:start, len:len, message:message}); });
        compiler.addUnit(libText,"lib.ts");
        compiler.addUnit(prog,"input.ts");
        compiler.typeCheck();
        compiler.emit();

        if(parseErrors.length > 0 ) {
          //throw new Error(parseErrors);
        }

	while(outfile.source[0] == '/' && outfile.source[1] == '/' && outfile.source[2] == ' ') {
            outfile.source = outfile.source.slice(outfile.source.indexOf('\r')+1);
        }
        var errorPrefix = "";
	for(var i = 0;i<parseErrors.length;i++) {
          errorPrefix += "// Error: (" + parseErrors[i].start + "," + parseErrors[i].len + ") " + parseErrors[i].message + "\r";
        }

        return errorPrefix + outfile.source;
    }
    </script>
    <script type="text/javascript">

        var libText = "";
        $.get("../compiler/lib.ts", function(newLibText) {
            libText = newLibText;
        });


        // execute the javascript in the compiledOutput pane
        function execute() {
          $('#compilation').text("Running...");
          var txt = $('#compiledOutput').val();
          var res;
          try {
             var ret = eval(txt); // CodeQL [SM01632] This code is only used for tests
             res = "Ran successfully!";
          } catch(e) {
             res = "Exception thrown: " + e;
          }
          $('#compilation').text(String(res));
        }

        // recompile the stradaSrc and populate the compiledOutput pane
        function srcUpdated() {
            var newText = $('#stradaSrc').val();
            var compiledSource;
            try {
                compiledSource = compile(newText, libText);
            } catch (e) {
                compiledSource = "//Parse error"
                for(var i in e)
                  compiledSource += "\r// " + e[i];
            }
            $('#compiledOutput').val(compiledSource);
        }

        // Populate the stradaSrc pane with one of the built in samples
        function exampleSelectionChanged() {
            var examples = document.getElementById('examples');
            var selectedExample = examples.options[examples.selectedIndex].value;
            if (selectedExample != "") {
                $.get('examples/' + selectedExample, function (srcText) {
                    $('#stradaSrc').val(srcText);
                    setTimeout(srcUpdated,100);
                }, function (err) {
                    console.log(err);
                });
            }
        }

    </script>
</head>
<body>
    <h1>TypeScript</h1>
    <br />
    <select id="examples" onchange='exampleSelectionChanged()'>
        <option value="">Select...</option>
        <option value="small.ts">Small</option>
        <option value="employee.ts">Employees</option>
        <option value="conway.ts">Conway Game of Life</option>
        <option value="typescript.ts">TypeScript Compiler</option>
    </select>

    <div>
        <textarea id='stradaSrc' rows='40' cols='80' onchange='srcUpdated()' onkeyup='srcUpdated()' spellcheck="false">
//Type your TypeScript here...
      </textarea>
      <textarea id='compiledOutput' rows='40' cols='80' spellcheck="false">
//Compiled code will show up here...
      </textarea>
      <br />
      <button onclick='execute()'/>Run</button>
      <div id='compilation'>Press 'run' to execute code...</div>
      <div id='results'>...write your results into #results...</div>
    </div>
    <div id='bod' style='display:none'></div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/site.css]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/site.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------
The base color for this template is #5c87b2. If you'd like
to use a different color start by replacing all instances of
#5c87b2 with your new color.
----------------------------------------------------------*/
body
{
    background-color: #5c87b2;
    font-size: .75em;
    font-family: Segoe UI, Verdana, Helvetica, Sans-Serif;
    margin: 8px;
    padding: 0;
    color: #696969;
}

h1, h2, h3, h4, h5, h6
{
    color: #000;
    font-size: 40px;
    margin: 0px;
}

textarea 
{
   font-family: Consolas
}

#results 
{
    margin-top: 2em;
    margin-left: 2em;
    color: black;
    font-size: medium;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/examples/company.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/examples/company.js

```javascript
'use strict';
/// <reference path="employee.ts" />
var Workforce;
(function (Workforce_1) {
    var Company = (function () {
        function Company() {
        }
        return Company;
    })();
    (function (property, Workforce, IEmployee) {
        if (property === undefined) { property = employees; }
        if (IEmployee === undefined) { IEmployee = []; }
        property;
        calculateMonthlyExpenses();
        {
            var result = 0;
            for (var i = 0; i < employees.length; i++) {
                result += employees[i].calculatePay();
            }
            return result;
        }
    });
})(Workforce || (Workforce = {}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/examples/conway.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/examples/conway.js

```javascript
'use strict';
var Conway;
(function (Conway) {
    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    })();
    (function (property, number, property, number, property, boolean) {
        if (property === undefined) { property = row; }
        if (property === undefined) { property = col; }
        if (property === undefined) { property = live; }
    });
    var GameOfLife = (function () {
        function GameOfLife() {
        }
        return GameOfLife;
    })();
    (function () {
        property;
        gridSize = 50;
        property;
        canvasSize = 600;
        property;
        lineColor = '#cdcdcd';
        property;
        liveColor = '#666';
        property;
        deadColor = '#eee';
        property;
        initialLifeProbability = 0.5;
        property;
        animationRate = 60;
        property;
        cellSize = 0;
        property;
        context: ICanvasRenderingContext2D;
        property;
        world = createWorld();
        circleOfLife();
        function createWorld() {
            return travelWorld(function (cell) {
                cell.live = Math.random() < initialLifeProbability;
                return cell;
            });
        }
        function circleOfLife() {
            world = travelWorld(function (cell) {
                cell = world[cell.row][cell.col];
                draw(cell);
                return resolveNextGeneration(cell);
            });
            setTimeout(function () { circleOfLife(); }, animationRate);
        }
        function resolveNextGeneration(cell) {
            var count = countNeighbors(cell);
            var newCell = new Cell(cell.row, cell.col, cell.live);
            if (count < 2 || count > 3)
                newCell.live = false;
            else if (count == 3)
                newCell.live = true;
            return newCell;
        }
        function countNeighbors(cell) {
            var neighbors = 0;
            for (var row = -1; row <= 1; row++) {
                for (var col = -1; col <= 1; col++) {
                    if (row == 0 && col == 0)
                        continue;
                    if (isAlive(cell.row + row, cell.col + col)) {
                        neighbors++;
                    }
                }
            }
            return neighbors;
        }
        function isAlive(row, col) {
            // todo - need to guard with worl[row] exists?
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize)
                return false;
            return world[row][col].live;
        }
        function travelWorld(callback) {
            var result = [];
            for (var row = 0; row < gridSize; row++) {
                var rowData = [];
                for (var col = 0; col < gridSize; col++) {
                    rowData.push(callback(new Cell(row, col, false)));
                }
                result.push(rowData);
            }
            return result;
        }
        function draw(cell) {
            if (context == null)
                context = createDrawingContext();
            if (cellSize == 0)
                cellSize = canvasSize / gridSize;
            context.strokeStyle = lineColor;
            context.strokeRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
            context.fillStyle = cell.live ? liveColor : deadColor;
            context.fillRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
        }
        function createDrawingContext() {
            var canvas = document.getElementById('conway-canvas');
            if (canvas == null) {
                canvas = document.createElement('canvas');
                canvas.id = "conway-canvas";
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                document.body.appendChild(canvas);
            }
            return canvas.getContext('2d');
        }
    });
})(Conway || (Conway = {}));
var game = new Conway.GameOfLife();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/examples/employee.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/examples/employee.js

```javascript
'use strict';
var Workforce;
(function (Workforce) {
    var Employee = (function () {
        function Employee() {
        }
        return Employee;
    })();
    (property);
    name: string, property;
    basepay: number;
    implements;
    IEmployee;
    {
        name;
        basepay;
    }
    var SalesEmployee = (function () {
        function SalesEmployee() {
        }
        return SalesEmployee;
    })();
    ();
    Employee(name, basepay);
    {
        function calculatePay() {
            var multiplier = (document.getElementById("mult")), as = any, value;
            return _super.calculatePay.call(this) * multiplier + bonus;
        }
    }
    var employee = new Employee('Bob', 1000);
    var salesEmployee = new SalesEmployee('Jim', 800, 400);
    salesEmployee.calclatePay(); // error: No member 'calclatePay' on SalesEmployee
})(Workforce || (Workforce = {}));
extern;
var $;
var s = Workforce.salesEmployee.calculatePay();
$('#results').text(s);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/examples/small.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/examples/small.js

```javascript
'use strict';
var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    (function (x, property, number) {
        if (property === undefined) { property = w; }
        var local = 1;
        // unresolved symbol because x is local
        //self.x++;
        self.w--; // ok because w is a property
        property;
        f = function (y) {
            return y + x + local + w + self.w;
        };
        function sum(z) {
            return z + f(z) + w + self.w;
        }
    });
})(M || (M = {}));
var c = new M.C(12, 5);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/other/deep/company.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/other/deep/company.js

```javascript
'use strict';
/// <reference path="employee.ts" />
var Workforce;
(function (Workforce_1) {
    var Company = (function () {
        function Company() {
        }
        return Company;
    })();
    (function (property, Workforce, IEmployee) {
        if (property === undefined) { property = employees; }
        if (IEmployee === undefined) { IEmployee = []; }
        property;
        calculateMonthlyExpenses();
        {
            var result = 0;
            for (var i = 0; i < employees.length; i++) {
                result += employees[i].calculatePay();
            }
            return result;
        }
    });
})(Workforce || (Workforce = {}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/other/deep/conway.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/other/deep/conway.js

```javascript
'use strict';
var Conway;
(function (Conway) {
    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    })();
    (function (property, number, property, number, property, boolean) {
        if (property === undefined) { property = row; }
        if (property === undefined) { property = col; }
        if (property === undefined) { property = live; }
    });
    var GameOfLife = (function () {
        function GameOfLife() {
        }
        return GameOfLife;
    })();
    (function () {
        property;
        gridSize = 50;
        property;
        canvasSize = 600;
        property;
        lineColor = '#cdcdcd';
        property;
        liveColor = '#666';
        property;
        deadColor = '#eee';
        property;
        initialLifeProbability = 0.5;
        property;
        animationRate = 60;
        property;
        cellSize = 0;
        property;
        context: ICanvasRenderingContext2D;
        property;
        world = createWorld();
        circleOfLife();
        function createWorld() {
            return travelWorld(function (cell) {
                cell.live = Math.random() < initialLifeProbability;
                return cell;
            });
        }
        function circleOfLife() {
            world = travelWorld(function (cell) {
                cell = world[cell.row][cell.col];
                draw(cell);
                return resolveNextGeneration(cell);
            });
            setTimeout(function () { circleOfLife(); }, animationRate);
        }
        function resolveNextGeneration(cell) {
            var count = countNeighbors(cell);
            var newCell = new Cell(cell.row, cell.col, cell.live);
            if (count < 2 || count > 3)
                newCell.live = false;
            else if (count == 3)
                newCell.live = true;
            return newCell;
        }
        function countNeighbors(cell) {
            var neighbors = 0;
            for (var row = -1; row <= 1; row++) {
                for (var col = -1; col <= 1; col++) {
                    if (row == 0 && col == 0)
                        continue;
                    if (isAlive(cell.row + row, cell.col + col)) {
                        neighbors++;
                    }
                }
            }
            return neighbors;
        }
        function isAlive(row, col) {
            // todo - need to guard with worl[row] exists?
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize)
                return false;
            return world[row][col].live;
        }
        function travelWorld(callback) {
            var result = [];
            for (var row = 0; row < gridSize; row++) {
                var rowData = [];
                for (var col = 0; col < gridSize; col++) {
                    rowData.push(callback(new Cell(row, col, false)));
                }
                result.push(rowData);
            }
            return result;
        }
        function draw(cell) {
            if (context == null)
                context = createDrawingContext();
            if (cellSize == 0)
                cellSize = canvasSize / gridSize;
            context.strokeStyle = lineColor;
            context.strokeRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
            context.fillStyle = cell.live ? liveColor : deadColor;
            context.fillRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
        }
        function createDrawingContext() {
            var canvas = document.getElementById('conway-canvas');
            if (canvas == null) {
                canvas = document.createElement('canvas');
                canvas.id = "conway-canvas";
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                document.body.appendChild(canvas);
            }
            return canvas.getContext('2d');
        }
    });
})(Conway || (Conway = {}));
var game = new Conway.GameOfLife();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/other/deep/employee.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/other/deep/employee.js

```javascript
'use strict';
var Workforce;
(function (Workforce) {
    var Employee = (function () {
        function Employee() {
        }
        return Employee;
    })();
    (property);
    name: string, property;
    basepay: number;
    implements;
    IEmployee;
    {
        name;
        basepay;
    }
    var SalesEmployee = (function () {
        function SalesEmployee() {
        }
        return SalesEmployee;
    })();
    ();
    Employee(name, basepay);
    {
        function calculatePay() {
            var multiplier = (document.getElementById("mult")), as = any, value;
            return _super.calculatePay.call(this) * multiplier + bonus;
        }
    }
    var employee = new Employee('Bob', 1000);
    var salesEmployee = new SalesEmployee('Jim', 800, 400);
    salesEmployee.calclatePay(); // error: No member 'calclatePay' on SalesEmployee
})(Workforce || (Workforce = {}));
extern;
var $;
var s = Workforce.salesEmployee.calculatePay();
$('#results').text(s);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/resolver/other/deep/small.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/resolver/other/deep/small.js

```javascript
'use strict';
var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    (function (x, property, number) {
        if (property === undefined) { property = w; }
        var local = 1;
        // unresolved symbol because x is local
        //self.x++;
        self.w--; // ok because w is a property
        property;
        f = function (y) {
            return y + x + local + w + self.w;
        };
        function sum(z) {
            return z + f(z) + w + self.w;
        }
    });
})(M || (M = {}));
var c = new M.C(12, 5);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/index.html]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/index.html

```html
<!DOCTYPE html>
<html>
<head id='headID'>
    <title>Strada </title>
    <link href="site.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.4.1.js"></script>
    <script src="../compiler/dtree.js" type="text/javascript"></script>
    <script src="../compiler/typescript.js" type="text/javascript"></script>
    <script type="text/javascript">

    // Compile strada source into resulting javascript
    function compile(prog, libText) {
        var outfile = {
          source: "",
          Write: function (s) { this.source += s; },
          WriteLine: function (s) { this.source += s + "\r"; },
        }

        var parseErrors = []

        var compiler=new Tools.TypeScriptCompiler(outfile,true);
        compiler.setErrorCallback(function(start,len, message) { parseErrors.push({start:start, len:len, message:message}); });
        compiler.addUnit(libText,"lib.ts");
        compiler.addUnit(prog,"input.ts");
        compiler.typeCheck();
        compiler.emit();

        if(parseErrors.length > 0 ) {
          //throw new Error(parseErrors);
        }

	while(outfile.source[0] == '/' && outfile.source[1] == '/' && outfile.source[2] == ' ') {
            outfile.source = outfile.source.slice(outfile.source.indexOf('\r')+1);
        }
        var errorPrefix = "";
	for(var i = 0;i<parseErrors.length;i++) {
          errorPrefix += "// Error: (" + parseErrors[i].start + "," + parseErrors[i].len + ") " + parseErrors[i].message + "\r";
        }

        return errorPrefix + outfile.source;
    }
    </script>
    <script type="text/javascript">

        var libText = "";
        $.get("../compiler/lib.ts", function(newLibText) {
            libText = newLibText;
        });


        // execute the javascript in the compiledOutput pane
        function execute() {
          $('#compilation').text("Running...");
          var txt = $('#compiledOutput').val();
          var res;
          try {
             var ret = eval(txt); // CodeQL [SM01632] This code is only used for tests
             res = "Ran successfully!";
          } catch(e) {
             res = "Exception thrown: " + e;
          }
          $('#compilation').text(String(res));
        }

        // recompile the stradaSrc and populate the compiledOutput pane
        function srcUpdated() {
            var newText = $('#stradaSrc').val();
            var compiledSource;
            try {
                compiledSource = compile(newText, libText);
            } catch (e) {
                compiledSource = "//Parse error"
                for(var i in e)
                  compiledSource += "\r// " + e[i];
            }
            $('#compiledOutput').val(compiledSource);
        }

        // Populate the stradaSrc pane with one of the built in samples
        function exampleSelectionChanged() {
            var examples = document.getElementById('examples');
            var selectedExample = examples.options[examples.selectedIndex].value;
            if (selectedExample != "") {
                $.get('examples/' + selectedExample, function (srcText) {
                    $('#stradaSrc').val(srcText);
                    setTimeout(srcUpdated,100);
                }, function (err) {
                    console.log(err);
                });
            }
        }

    </script>
</head>
<body>
    <h1>TypeScript</h1>
    <br />
    <select id="examples" onchange='exampleSelectionChanged()'>
        <option value="">Select...</option>
        <option value="small.ts">Small</option>
        <option value="employee.ts">Employees</option>
        <option value="conway.ts">Conway Game of Life</option>
        <option value="typescript.ts">TypeScript Compiler</option>
    </select>

    <div>
        <textarea id='stradaSrc' rows='40' cols='80' onchange='srcUpdated()' onkeyup='srcUpdated()' spellcheck="false">
//Type your TypeScript here...
      </textarea>
      <textarea id='compiledOutput' rows='40' cols='80' spellcheck="false">
//Compiled code will show up here...
      </textarea>
      <br />
      <button onclick='execute()'/>Run</button>
      <div id='compilation'>Press 'run' to execute code...</div>
      <div id='results'>...write your results into #results...</div>
    </div>
    <div id='bod' style='display:none'></div>
</body>
</html>
```

--------------------------------------------------------------------------------

````

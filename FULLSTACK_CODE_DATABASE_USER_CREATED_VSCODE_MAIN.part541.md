---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 541
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 541 of 552)

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

---[FILE: src/vs/workbench/services/workingCopy/test/browser/untitledFileWorkingCopy.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/untitledFileWorkingCopy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBufferReadableStream, newWriteableBufferStream, VSBuffer, streamToBuffer, bufferToStream, readableToBuffer, VSBufferReadable } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename } from '../../../../../base/common/resources.js';
import { consumeReadable, consumeStream, isReadable, isReadableStream } from '../../../../../base/common/stream.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { SnapshotContext } from '../../common/fileWorkingCopy.js';
import { IUntitledFileWorkingCopyModel, IUntitledFileWorkingCopyModelContentChangedEvent, IUntitledFileWorkingCopyModelFactory, UntitledFileWorkingCopy } from '../../common/untitledFileWorkingCopy.js';
import { TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

export class TestUntitledFileWorkingCopyModel extends Disposable implements IUntitledFileWorkingCopyModel {

	private readonly _onDidChangeContent = this._register(new Emitter<IUntitledFileWorkingCopyModelContentChangedEvent>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	constructor(readonly resource: URI, public contents: string) {
		super();
	}

	fireContentChangeEvent(event: IUntitledFileWorkingCopyModelContentChangedEvent): void {
		this._onDidChangeContent.fire(event);
	}

	updateContents(newContents: string): void {
		this.doUpdate(newContents);
	}

	private throwOnSnapshot = false;
	setThrowOnSnapshot(): void {
		this.throwOnSnapshot = true;
	}

	async snapshot(context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream> {
		if (this.throwOnSnapshot) {
			throw new Error('Fail');
		}

		const stream = newWriteableBufferStream();
		stream.end(VSBuffer.fromString(this.contents));

		return stream;
	}

	async update(contents: VSBufferReadableStream, token: CancellationToken): Promise<void> {
		this.doUpdate((await streamToBuffer(contents)).toString());
	}

	private doUpdate(newContents: string): void {
		this.contents = newContents;

		this.versionId++;

		this._onDidChangeContent.fire({ isInitial: newContents.length === 0 });
	}

	versionId = 0;

	pushedStackElement = false;

	pushStackElement(): void {
		this.pushedStackElement = true;
	}

	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}

export class TestUntitledFileWorkingCopyModelFactory implements IUntitledFileWorkingCopyModelFactory<TestUntitledFileWorkingCopyModel> {

	async createModel(resource: URI, contents: VSBufferReadableStream, token: CancellationToken): Promise<TestUntitledFileWorkingCopyModel> {
		return new TestUntitledFileWorkingCopyModel(resource, (await streamToBuffer(contents)).toString());
	}
}

suite('UntitledFileWorkingCopy', () => {

	const factory = new TestUntitledFileWorkingCopyModelFactory();

	const disposables = new DisposableStore();
	const resource = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: UntitledFileWorkingCopy<TestUntitledFileWorkingCopyModel>;

	function createWorkingCopy(uri: URI = resource, hasAssociatedFilePath = false, initialValue = '') {
		return disposables.add(new UntitledFileWorkingCopy<TestUntitledFileWorkingCopyModel>(
			'testUntitledWorkingCopyType',
			uri,
			basename(uri),
			hasAssociatedFilePath,
			false,
			initialValue.length > 0 ? { value: bufferToStream(VSBuffer.fromString(initialValue)) } : undefined,
			factory,
			async workingCopy => { await workingCopy.revert(); return true; },
			accessor.workingCopyService,
			accessor.workingCopyBackupService,
			accessor.logService
		));
	}

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		workingCopy = disposables.add(createWorkingCopy());
	});

	teardown(() => {
		disposables.clear();
	});

	test('registers with working copy service', async () => {
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 1);

		workingCopy.dispose();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
	});

	test('dirty', async () => {
		assert.strictEqual(workingCopy.isDirty(), false);

		let changeDirtyCounter = 0;
		disposables.add(workingCopy.onDidChangeDirty(() => {
			changeDirtyCounter++;
		}));

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		await workingCopy.resolve();
		assert.strictEqual(workingCopy.isResolved(), true);

		// Dirty from: Model content change
		workingCopy.model?.updateContents('hello dirty');
		assert.strictEqual(contentChangeCounter, 1);

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(changeDirtyCounter, 1);

		await workingCopy.save();

		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(changeDirtyCounter, 2);
	});

	test('dirty - cleared when content event signals isEmpty', async () => {
		assert.strictEqual(workingCopy.isDirty(), false);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello dirty');
		assert.strictEqual(workingCopy.isDirty(), true);

		workingCopy.model?.fireContentChangeEvent({ isInitial: true });

		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('dirty - not cleared when content event signals isEmpty when associated resource', async () => {
		workingCopy.dispose();
		workingCopy = createWorkingCopy(resource, true);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello dirty');
		assert.strictEqual(workingCopy.isDirty(), true);

		workingCopy.model?.fireContentChangeEvent({ isInitial: true });

		assert.strictEqual(workingCopy.isDirty(), true);
	});

	test('revert', async () => {
		let revertCounter = 0;
		disposables.add(workingCopy.onDidRevert(() => {
			revertCounter++;
		}));

		let disposeCounter = 0;
		disposables.add(workingCopy.onWillDispose(() => {
			disposeCounter++;
		}));

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello dirty');
		assert.strictEqual(workingCopy.isDirty(), true);

		await workingCopy.revert();

		assert.strictEqual(revertCounter, 1);
		assert.strictEqual(disposeCounter, 1);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('dispose', async () => {
		let disposeCounter = 0;
		disposables.add(workingCopy.onWillDispose(() => {
			disposeCounter++;
		}));

		await workingCopy.resolve();
		workingCopy.dispose();

		assert.strictEqual(disposeCounter, 1);
	});

	test('backup', async () => {
		assert.strictEqual((await workingCopy.backup(CancellationToken.None)).content, undefined);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('Hello Backup');
		const backup = await workingCopy.backup(CancellationToken.None);

		let backupContents: string | undefined = undefined;
		if (isReadableStream(backup.content)) {
			backupContents = (await consumeStream(backup.content, chunks => VSBuffer.concat(chunks))).toString();
		} else if (backup.content) {
			backupContents = consumeReadable(backup.content, chunks => VSBuffer.concat(chunks)).toString();
		}

		assert.strictEqual(backupContents, 'Hello Backup');
	});

	test('resolve - without contents', async () => {
		assert.strictEqual(workingCopy.isResolved(), false);
		assert.strictEqual(workingCopy.hasAssociatedFilePath, false);
		assert.strictEqual(workingCopy.model, undefined);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isResolved(), true);
		assert.ok(workingCopy.model);
	});

	test('resolve - with initial contents', async () => {
		workingCopy.dispose();

		workingCopy = createWorkingCopy(resource, false, 'Hello Initial');

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		assert.strictEqual(workingCopy.isDirty(), true);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Initial');
		assert.strictEqual(contentChangeCounter, 1);

		workingCopy.model.updateContents('Changed contents');

		await workingCopy.resolve(); // second resolve should be ignored
		assert.strictEqual(workingCopy.model?.contents, 'Changed contents');
	});

	test('backup - with initial contents uses those even if unresolved', async () => {
		workingCopy.dispose();

		workingCopy = createWorkingCopy(resource, false, 'Hello Initial');

		assert.strictEqual(workingCopy.isDirty(), true);

		const backup = (await workingCopy.backup(CancellationToken.None)).content;
		if (isReadableStream(backup)) {
			const value = await streamToBuffer(backup as VSBufferReadableStream);
			assert.strictEqual(value.toString(), 'Hello Initial');
		} else if (isReadable(backup)) {
			const value = readableToBuffer(backup as VSBufferReadable);
			assert.strictEqual(value.toString(), 'Hello Initial');
		} else {
			assert.fail('Missing untitled backup');
		}
	});


	test('resolve - with associated resource', async () => {
		workingCopy.dispose();
		workingCopy = createWorkingCopy(resource, true);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.hasAssociatedFilePath, true);
	});

	test('resolve - with backup', async () => {
		await workingCopy.resolve();
		workingCopy.model?.updateContents('Hello Backup');

		const backup = await workingCopy.backup(CancellationToken.None);
		await accessor.workingCopyBackupService.backup(workingCopy, backup.content, undefined, backup.meta);

		assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(workingCopy), true);

		workingCopy.dispose();

		workingCopy = createWorkingCopy();

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Backup');
		assert.strictEqual(contentChangeCounter, 1);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/untitledFileWorkingCopyManager.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/untitledFileWorkingCopyManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { FileWorkingCopyManager, IFileWorkingCopyManager } from '../../common/fileWorkingCopyManager.js';
import { NO_TYPE_ID, WorkingCopyCapabilities } from '../../common/workingCopy.js';
import { TestStoredFileWorkingCopyModel, TestStoredFileWorkingCopyModelFactory } from './storedFileWorkingCopy.test.js';
import { TestUntitledFileWorkingCopyModel, TestUntitledFileWorkingCopyModelFactory } from './untitledFileWorkingCopy.test.js';
import { TestInMemoryFileSystemProvider, TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('UntitledFileWorkingCopyManager', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	let manager: IFileWorkingCopyManager<TestStoredFileWorkingCopyModel, TestUntitledFileWorkingCopyModel>;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		disposables.add(accessor.fileService.registerProvider(Schemas.file, disposables.add(new TestInMemoryFileSystemProvider())));
		disposables.add(accessor.fileService.registerProvider(Schemas.vscodeRemote, disposables.add(new TestInMemoryFileSystemProvider())));

		manager = disposables.add(new FileWorkingCopyManager(
			'testUntitledFileWorkingCopyType',
			new TestStoredFileWorkingCopyModelFactory(),
			new TestUntitledFileWorkingCopyModelFactory(),
			accessor.fileService, accessor.lifecycleService, accessor.labelService, accessor.logService,
			accessor.workingCopyFileService, accessor.workingCopyBackupService, accessor.uriIdentityService, accessor.fileDialogService,
			accessor.filesConfigurationService, accessor.workingCopyService, accessor.notificationService,
			accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.pathService,
			accessor.environmentService, accessor.dialogService, accessor.decorationsService, accessor.progressService
		));
	});

	teardown(() => {
		for (const workingCopy of [...manager.untitled.workingCopies, ...manager.stored.workingCopies]) {
			workingCopy.dispose();
		}

		disposables.clear();
	});

	test('basics', async () => {
		let createCounter = 0;
		disposables.add(manager.untitled.onDidCreate(e => {
			createCounter++;
		}));

		let disposeCounter = 0;
		disposables.add(manager.untitled.onWillDispose(e => {
			disposeCounter++;
		}));

		let dirtyCounter = 0;
		disposables.add(manager.untitled.onDidChangeDirty(e => {
			dirtyCounter++;
		}));

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.untitled.workingCopies.length, 0);

		assert.strictEqual(manager.untitled.get(URI.file('/some/invalidPath')), undefined);
		assert.strictEqual(manager.untitled.get(URI.file('/some/invalidPath').with({ scheme: Schemas.untitled })), undefined);

		const workingCopy1 = await manager.untitled.resolve();
		const workingCopy2 = await manager.untitled.resolve();

		assert.strictEqual(workingCopy1.typeId, 'testUntitledFileWorkingCopyType');
		assert.strictEqual(workingCopy1.resource.scheme, Schemas.untitled);

		assert.strictEqual(createCounter, 2);

		assert.strictEqual(manager.untitled.get(workingCopy1.resource), workingCopy1);
		assert.strictEqual(manager.untitled.get(workingCopy2.resource), workingCopy2);

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 2);
		assert.strictEqual(manager.untitled.workingCopies.length, 2);

		assert.notStrictEqual(workingCopy1.resource.toString(), workingCopy2.resource.toString());

		for (const workingCopy of [workingCopy1, workingCopy2]) {
			assert.strictEqual(workingCopy.capabilities, WorkingCopyCapabilities.Untitled);
			assert.strictEqual(workingCopy.isDirty(), false);
			assert.strictEqual(workingCopy.isModified(), false);
			assert.ok(workingCopy.model);
		}

		workingCopy1.model?.updateContents('Hello World');

		assert.strictEqual(workingCopy1.isDirty(), true);
		assert.strictEqual(workingCopy1.isModified(), true);
		assert.strictEqual(dirtyCounter, 1);

		workingCopy1.model?.updateContents(''); // change to empty clears dirty/modified flags
		assert.strictEqual(workingCopy1.isDirty(), false);
		assert.strictEqual(workingCopy1.isModified(), false);
		assert.strictEqual(dirtyCounter, 2);

		workingCopy2.model?.fireContentChangeEvent({ isInitial: false });
		assert.strictEqual(workingCopy2.isDirty(), true);
		assert.strictEqual(workingCopy2.isModified(), true);
		assert.strictEqual(dirtyCounter, 3);

		workingCopy1.dispose();

		assert.strictEqual(manager.untitled.workingCopies.length, 1);
		assert.strictEqual(manager.untitled.get(workingCopy1.resource), undefined);

		workingCopy2.dispose();

		assert.strictEqual(manager.untitled.workingCopies.length, 0);
		assert.strictEqual(manager.untitled.get(workingCopy2.resource), undefined);

		assert.strictEqual(disposeCounter, 2);
	});

	test('dirty - scratchpads are never dirty', async () => {
		let dirtyCounter = 0;
		disposables.add(manager.untitled.onDidChangeDirty(e => {
			dirtyCounter++;
		}));

		const workingCopy1 = await manager.resolve({
			untitledResource: URI.from({ scheme: Schemas.untitled, path: `/myscratchpad` }),
			isScratchpad: true
		});

		assert.strictEqual(workingCopy1.resource.scheme, Schemas.untitled);
		assert.strictEqual(manager.untitled.workingCopies.length, 1);

		workingCopy1.model?.updateContents('contents');
		assert.strictEqual(workingCopy1.isDirty(), false);
		assert.strictEqual(workingCopy1.isModified(), true);

		workingCopy1.model?.fireContentChangeEvent({ isInitial: true });
		assert.strictEqual(workingCopy1.isDirty(), false);
		assert.strictEqual(workingCopy1.isModified(), false);

		assert.strictEqual(dirtyCounter, 0);

		workingCopy1.dispose();
	});

	test('resolve - with initial value', async () => {
		let dirtyCounter = 0;
		disposables.add(manager.untitled.onDidChangeDirty(e => {
			dirtyCounter++;
		}));

		const workingCopy1 = await manager.untitled.resolve({ contents: { value: bufferToStream(VSBuffer.fromString('Hello World')) } });

		assert.strictEqual(workingCopy1.isModified(), true);
		assert.strictEqual(workingCopy1.isDirty(), true);
		assert.strictEqual(dirtyCounter, 1);
		assert.strictEqual(workingCopy1.model?.contents, 'Hello World');

		workingCopy1.dispose();

		const workingCopy2 = await manager.untitled.resolve({ contents: { value: bufferToStream(VSBuffer.fromString('Hello World')), markModified: true } });

		assert.strictEqual(workingCopy2.isModified(), true);
		assert.strictEqual(workingCopy2.isDirty(), true);
		assert.strictEqual(dirtyCounter, 2);
		assert.strictEqual(workingCopy2.model?.contents, 'Hello World');

		workingCopy2.dispose();
	});

	test('resolve - with initial value but markDirty: false', async () => {
		let dirtyCounter = 0;
		disposables.add(manager.untitled.onDidChangeDirty(e => {
			dirtyCounter++;
		}));

		const workingCopy = await manager.untitled.resolve({ contents: { value: bufferToStream(VSBuffer.fromString('Hello World')), markModified: false } });

		assert.strictEqual(workingCopy.isModified(), false);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(dirtyCounter, 0);
		assert.strictEqual(workingCopy.model?.contents, 'Hello World');

		workingCopy.dispose();
	});

	test('resolve begins counter from 1 for disposed untitled', async () => {
		const untitled1 = await manager.untitled.resolve();
		untitled1.dispose();

		const untitled1Again = disposables.add(await manager.untitled.resolve());
		assert.strictEqual(untitled1.resource.toString(), untitled1Again.resource.toString());
	});

	test('resolve - existing', async () => {
		let createCounter = 0;
		disposables.add(manager.untitled.onDidCreate(e => {
			createCounter++;
		}));

		const workingCopy1 = await manager.untitled.resolve();
		assert.strictEqual(createCounter, 1);

		const workingCopy2 = await manager.untitled.resolve({ untitledResource: workingCopy1.resource });
		assert.strictEqual(workingCopy1, workingCopy2);
		assert.strictEqual(createCounter, 1);

		const workingCopy3 = await manager.untitled.resolve({ untitledResource: URI.file('/invalid/untitled') });
		assert.strictEqual(workingCopy3.resource.scheme, Schemas.untitled);

		workingCopy1.dispose();
		workingCopy2.dispose();
		workingCopy3.dispose();
	});

	test('resolve - untitled resource used for new working copy', async () => {
		const invalidUntitledResource = URI.file('my/untitled.txt');
		const validUntitledResource = invalidUntitledResource.with({ scheme: Schemas.untitled });

		const workingCopy1 = await manager.untitled.resolve({ untitledResource: invalidUntitledResource });
		assert.notStrictEqual(workingCopy1.resource.toString(), invalidUntitledResource.toString());

		const workingCopy2 = await manager.untitled.resolve({ untitledResource: validUntitledResource });
		assert.strictEqual(workingCopy2.resource.toString(), validUntitledResource.toString());

		workingCopy1.dispose();
		workingCopy2.dispose();
	});

	test('resolve - with associated resource', async () => {
		const workingCopy = await manager.untitled.resolve({ associatedResource: { path: '/some/associated.txt' } });

		assert.strictEqual(workingCopy.hasAssociatedFilePath, true);
		assert.strictEqual(workingCopy.resource.path, '/some/associated.txt');

		workingCopy.dispose();
	});

	test('save - without associated resource', async () => {
		let savedEvent: { source: URI; target: URI } | undefined = undefined;
		disposables.add(manager.untitled.onDidSave(e => {
			savedEvent = e;
		}));

		const workingCopy = await manager.untitled.resolve();
		workingCopy.model?.updateContents('Simple Save');

		accessor.fileDialogService.setPickFileToSave(URI.file('simple/file.txt'));

		const result = await workingCopy.save();
		assert.ok(result);

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);
		assert.strictEqual(savedEvent!.source.toString(), workingCopy.resource.toString());
		assert.strictEqual(savedEvent!.target.toString(), URI.file('simple/file.txt').toString());

		workingCopy.dispose();
	});

	test('save - with associated resource', async () => {
		let savedEvent: { source: URI; target: URI } | undefined = undefined;
		disposables.add(manager.untitled.onDidSave(e => {
			savedEvent = e;
		}));

		const workingCopy = await manager.untitled.resolve({ associatedResource: { path: '/some/associated.txt' } });
		workingCopy.model?.updateContents('Simple Save with associated resource');

		accessor.fileService.notExistsSet.set(URI.from({ scheme: Schemas.file, path: '/some/associated.txt' }), true);

		const result = await workingCopy.save();
		assert.ok(result);

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);
		assert.strictEqual(savedEvent!.source.toString(), workingCopy.resource.toString());
		assert.strictEqual(savedEvent!.target.toString(), URI.file('/some/associated.txt').toString());

		workingCopy.dispose();
	});

	test('save - with associated resource (asks to overwrite)', async () => {
		const workingCopy = await manager.untitled.resolve({ associatedResource: { path: '/some/associated.txt' } });
		workingCopy.model?.updateContents('Simple Save with associated resource');

		let result = await workingCopy.save();
		assert.ok(!result); // not confirmed

		assert.strictEqual(manager.untitled.get(workingCopy.resource), workingCopy);

		accessor.dialogService.setConfirmResult({ confirmed: true });

		result = await workingCopy.save();
		assert.ok(result); // confirmed

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);

		workingCopy.dispose();
	});

	test('destroy', async () => {
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);

		await manager.untitled.resolve();
		await manager.untitled.resolve();
		await manager.untitled.resolve();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 3);
		assert.strictEqual(manager.untitled.workingCopies.length, 3);

		await manager.untitled.destroy();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.untitled.workingCopies.length, 0);
	});

	test('manager with different types produce different URIs', async () => {
		try {
			manager = disposables.add(new FileWorkingCopyManager(
				'someOtherUntitledTypeId',
				new TestStoredFileWorkingCopyModelFactory(),
				new TestUntitledFileWorkingCopyModelFactory(),
				accessor.fileService, accessor.lifecycleService, accessor.labelService, accessor.logService,
				accessor.workingCopyFileService, accessor.workingCopyBackupService, accessor.uriIdentityService, accessor.fileDialogService,
				accessor.filesConfigurationService, accessor.workingCopyService, accessor.notificationService,
				accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.pathService,
				accessor.environmentService, accessor.dialogService, accessor.decorationsService, accessor.progressService
			));

			const untitled1OriginalType = disposables.add(await manager.untitled.resolve());
			const untitled1OtherType = disposables.add(await manager.untitled.resolve());

			assert.notStrictEqual(untitled1OriginalType.resource.toString(), untitled1OtherType.resource.toString());
		} finally {
			manager.destroy();
		}
	});

	test('manager without typeId produces backwards compatible URIs', async () => {
		try {
			manager = disposables.add(new FileWorkingCopyManager(
				NO_TYPE_ID,
				new TestStoredFileWorkingCopyModelFactory(),
				new TestUntitledFileWorkingCopyModelFactory(),
				accessor.fileService, accessor.lifecycleService, accessor.labelService, accessor.logService,
				accessor.workingCopyFileService, accessor.workingCopyBackupService, accessor.uriIdentityService, accessor.fileDialogService,
				accessor.filesConfigurationService, accessor.workingCopyService, accessor.notificationService,
				accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.pathService,
				accessor.environmentService, accessor.dialogService, accessor.decorationsService, accessor.progressService
			));

			const result = disposables.add(await manager.untitled.resolve());
			assert.strictEqual(result.resource.scheme, Schemas.untitled);
			assert.ok(result.resource.path.length > 0);
			assert.strictEqual(result.resource.query, '');
			assert.strictEqual(result.resource.authority, '');
			assert.strictEqual(result.resource.fragment, '');
		} finally {
			manager.destroy();
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/untitledScratchpadWorkingCopy.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/untitledScratchpadWorkingCopy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBufferReadableStream, VSBuffer, streamToBuffer, bufferToStream, readableToBuffer, VSBufferReadable } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename } from '../../../../../base/common/resources.js';
import { consumeReadable, consumeStream, isReadable, isReadableStream } from '../../../../../base/common/stream.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IUntitledFileWorkingCopyModelFactory, UntitledFileWorkingCopy } from '../../common/untitledFileWorkingCopy.js';
import { TestUntitledFileWorkingCopyModel } from './untitledFileWorkingCopy.test.js';
import { TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

export class TestUntitledFileWorkingCopyModelFactory implements IUntitledFileWorkingCopyModelFactory<TestUntitledFileWorkingCopyModel> {

	async createModel(resource: URI, contents: VSBufferReadableStream, token: CancellationToken): Promise<TestUntitledFileWorkingCopyModel> {
		return new TestUntitledFileWorkingCopyModel(resource, (await streamToBuffer(contents)).toString());
	}
}

suite('UntitledScratchpadWorkingCopy', () => {

	const factory = new TestUntitledFileWorkingCopyModelFactory();

	const disposables = new DisposableStore();
	const resource = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: UntitledFileWorkingCopy<TestUntitledFileWorkingCopyModel>;

	function createWorkingCopy(uri: URI = resource, hasAssociatedFilePath = false, initialValue = '') {
		return disposables.add(new UntitledFileWorkingCopy<TestUntitledFileWorkingCopyModel>(
			'testUntitledWorkingCopyType',
			uri,
			basename(uri),
			hasAssociatedFilePath,
			true,
			initialValue.length > 0 ? { value: bufferToStream(VSBuffer.fromString(initialValue)) } : undefined,
			factory,
			async workingCopy => { await workingCopy.revert(); return true; },
			accessor.workingCopyService,
			accessor.workingCopyBackupService,
			accessor.logService
		));
	}

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		workingCopy = disposables.add(createWorkingCopy());
	});

	teardown(() => {
		disposables.clear();
	});

	test('registers with working copy service', async () => {
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 1);

		workingCopy.dispose();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
	});

	test('modified - not dirty', async () => {
		assert.strictEqual(workingCopy.isDirty(), false);

		let changeDirtyCounter = 0;
		disposables.add(workingCopy.onDidChangeDirty(() => {
			changeDirtyCounter++;
		}));

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		await workingCopy.resolve();
		assert.strictEqual(workingCopy.isResolved(), true);

		// Modified from: Model content change
		workingCopy.model?.updateContents('hello modified');
		assert.strictEqual(contentChangeCounter, 1);

		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(changeDirtyCounter, 0);

		await workingCopy.save();

		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(changeDirtyCounter, 0);
	});

	test('modified - cleared when content event signals isEmpty', async () => {
		assert.strictEqual(workingCopy.isModified(), false);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello modified');

		assert.strictEqual(workingCopy.isModified(), true);

		workingCopy.model?.fireContentChangeEvent({ isInitial: true });

		assert.strictEqual(workingCopy.isModified(), false);
	});

	test('modified - not cleared when content event signals isEmpty when associated resource', async () => {
		workingCopy.dispose();
		workingCopy = createWorkingCopy(resource, true);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello modified');
		assert.strictEqual(workingCopy.isModified(), true);

		workingCopy.model?.fireContentChangeEvent({ isInitial: true });

		assert.strictEqual(workingCopy.isModified(), true);
	});

	test('revert', async () => {
		let revertCounter = 0;
		disposables.add(workingCopy.onDidRevert(() => {
			revertCounter++;
		}));

		let disposeCounter = 0;
		disposables.add(workingCopy.onWillDispose(() => {
			disposeCounter++;
		}));

		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello modified');
		assert.strictEqual(workingCopy.isModified(), true);

		await workingCopy.revert();

		assert.strictEqual(revertCounter, 1);
		assert.strictEqual(disposeCounter, 1);
		assert.strictEqual(workingCopy.isModified(), false);
	});

	test('dispose', async () => {
		let disposeCounter = 0;
		disposables.add(workingCopy.onWillDispose(() => {
			disposeCounter++;
		}));

		await workingCopy.resolve();
		workingCopy.dispose();

		assert.strictEqual(disposeCounter, 1);
	});

	test('backup', async () => {
		assert.strictEqual((await workingCopy.backup(CancellationToken.None)).content, undefined);

		await workingCopy.resolve();

		workingCopy.model?.updateContents('Hello Backup');
		const backup = await workingCopy.backup(CancellationToken.None);

		let backupContents: string | undefined = undefined;
		if (isReadableStream(backup.content)) {
			backupContents = (await consumeStream(backup.content, chunks => VSBuffer.concat(chunks))).toString();
		} else if (backup.content) {
			backupContents = consumeReadable(backup.content, chunks => VSBuffer.concat(chunks)).toString();
		}

		assert.strictEqual(backupContents, 'Hello Backup');
	});

	test('resolve - without contents', async () => {
		assert.strictEqual(workingCopy.isResolved(), false);
		assert.strictEqual(workingCopy.hasAssociatedFilePath, false);
		assert.strictEqual(workingCopy.model, undefined);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isResolved(), true);
		assert.ok(workingCopy.model);
	});

	test('resolve - with initial contents', async () => {
		workingCopy.dispose();

		workingCopy = createWorkingCopy(resource, false, 'Hello Initial');

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		assert.strictEqual(workingCopy.isModified(), true);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Initial');
		assert.strictEqual(contentChangeCounter, 1);

		workingCopy.model.updateContents('Changed contents');

		await workingCopy.resolve(); // second resolve should be ignored
		assert.strictEqual(workingCopy.model?.contents, 'Changed contents');
	});

	test('backup - with initial contents uses those even if unresolved', async () => {
		workingCopy.dispose();

		workingCopy = createWorkingCopy(resource, false, 'Hello Initial');

		assert.strictEqual(workingCopy.isModified(), true);

		const backup = (await workingCopy.backup(CancellationToken.None)).content;
		if (isReadableStream(backup)) {
			const value = await streamToBuffer(backup as VSBufferReadableStream);
			assert.strictEqual(value.toString(), 'Hello Initial');
		} else if (isReadable(backup)) {
			const value = readableToBuffer(backup as VSBufferReadable);
			assert.strictEqual(value.toString(), 'Hello Initial');
		} else {
			assert.fail('Missing untitled backup');
		}
	});


	test('resolve - with associated resource', async () => {
		workingCopy.dispose();
		workingCopy = createWorkingCopy(resource, true);

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.hasAssociatedFilePath, true);
	});

	test('resolve - with backup', async () => {
		await workingCopy.resolve();
		workingCopy.model?.updateContents('Hello Backup');

		const backup = await workingCopy.backup(CancellationToken.None);
		await accessor.workingCopyBackupService.backup(workingCopy, backup.content, undefined, backup.meta);

		assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(workingCopy), true);

		workingCopy.dispose();

		workingCopy = createWorkingCopy();

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Backup');
		assert.strictEqual(contentChangeCounter, 1);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/workingCopyBackupTracker.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/workingCopyBackupTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IEditorService } from '../../../editor/common/editorService.js';
import { EditorPart } from '../../../../browser/parts/editor/editorPart.js';
import { IEditorGroupsService } from '../../../editor/common/editorGroupsService.js';
import { EditorService } from '../../../editor/browser/editorService.js';
import { IUntitledTextResourceEditorInput } from '../../../../common/editor.js';
import { IWorkingCopyBackupService } from '../../common/workingCopyBackup.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IFilesConfigurationService } from '../../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyService } from '../../common/workingCopyService.js';
import { IWorkingCopyBackup } from '../../common/workingCopy.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ILifecycleService, LifecyclePhase } from '../../../lifecycle/common/lifecycle.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { UntitledTextEditorInput } from '../../../untitled/common/untitledTextEditorInput.js';
import { createEditorPart, InMemoryTestWorkingCopyBackupService, registerTestResourceEditor, TestServiceAccessor, toTypedWorkingCopyId, toUntypedWorkingCopyId, workbenchInstantiationService, workbenchTeardown } from '../../../../test/browser/workbenchTestServices.js';
import { TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { timeout } from '../../../../../base/common/async.js';
import { BrowserWorkingCopyBackupTracker } from '../../browser/workingCopyBackupTracker.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../common/workingCopyEditorService.js';
import { bufferToReadable, VSBuffer } from '../../../../../base/common/buffer.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { Schemas } from '../../../../../base/common/network.js';

suite('WorkingCopyBackupTracker (browser)', function () {
	let accessor: TestServiceAccessor;
	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestResourceEditor());
	});

	teardown(async () => {
		await workbenchTeardown(accessor.instantiationService);

		disposables.clear();
	});

	class TestWorkingCopyBackupTracker extends BrowserWorkingCopyBackupTracker {

		constructor(
			@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
			@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
			@IWorkingCopyService workingCopyService: IWorkingCopyService,
			@ILifecycleService lifecycleService: ILifecycleService,
			@ILogService logService: ILogService,
			@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
			@IEditorService editorService: IEditorService,
			@IEditorGroupsService editorGroupService: IEditorGroupsService
		) {
			super(workingCopyBackupService, filesConfigurationService, workingCopyService, lifecycleService, logService, workingCopyEditorService, editorService, editorGroupService);
		}

		protected override getBackupScheduleDelay(): number {
			return 10; // Reduce timeout for tests
		}

		get pendingBackupOperationCount(): number { return this.pendingBackupOperations.size; }

		getUnrestoredBackups() {
			return this.unrestoredBackups;
		}

		async testRestoreBackups(handler: IWorkingCopyEditorHandler): Promise<void> {
			return super.restoreBackups(handler);
		}
	}

	class TestUntitledTextEditorInput extends UntitledTextEditorInput {

		resolved = false;

		override resolve() {
			this.resolved = true;

			return super.resolve();
		}
	}

	async function createTracker(): Promise<{ accessor: TestServiceAccessor; part: EditorPart; tracker: TestWorkingCopyBackupTracker; workingCopyBackupService: InMemoryTestWorkingCopyBackupService; instantiationService: IInstantiationService }> {
		const workingCopyBackupService = disposables.add(new InMemoryTestWorkingCopyBackupService());
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(IWorkingCopyBackupService, workingCopyBackupService);

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		disposables.add(registerTestResourceEditor());

		const editorService: EditorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		accessor = instantiationService.createInstance(TestServiceAccessor);

		const tracker = disposables.add(instantiationService.createInstance(TestWorkingCopyBackupTracker));

		return { accessor, part, tracker, workingCopyBackupService: workingCopyBackupService, instantiationService };
	}

	async function untitledBackupTest(untitled: IUntitledTextResourceEditorInput = { resource: undefined }): Promise<void> {
		const { accessor, workingCopyBackupService } = await createTracker();

		const untitledTextEditor = disposables.add((await accessor.editorService.openEditor(untitled))?.input as UntitledTextEditorInput);
		const untitledTextModel = disposables.add(await untitledTextEditor.resolve());

		if (!untitled?.contents) {
			untitledTextModel.textEditorModel?.setValue('Super Good');
		}

		await workingCopyBackupService.joinBackupResource();

		assert.strictEqual(workingCopyBackupService.hasBackupSync(untitledTextModel), true);

		untitledTextModel.dispose();

		await workingCopyBackupService.joinDiscardBackup();

		assert.strictEqual(workingCopyBackupService.hasBackupSync(untitledTextModel), false);
	}

	test('Track backups (untitled)', function () {
		return untitledBackupTest();
	});

	test('Track backups (untitled with initial contents)', function () {
		return untitledBackupTest({ resource: undefined, contents: 'Foo Bar' });
	});

	test('Track backups (custom)', async function () {
		const { accessor, tracker, workingCopyBackupService } = await createTracker();

		class TestBackupWorkingCopy extends TestWorkingCopy {

			constructor(resource: URI) {
				super(resource);

				disposables.add(accessor.workingCopyService.registerWorkingCopy(this));
			}

			readonly backupDelay = 10;

			override async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
				await timeout(0);

				return {};
			}
		}

		const resource: URI = toResource.call(this, '/path/custom.txt');
		const customWorkingCopy = disposables.add(new TestBackupWorkingCopy(resource));

		// Normal
		customWorkingCopy.setDirty(true);
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);
		await workingCopyBackupService.joinBackupResource();
		assert.strictEqual(workingCopyBackupService.hasBackupSync(customWorkingCopy), true);

		customWorkingCopy.setDirty(false);
		customWorkingCopy.setDirty(true);
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);
		await workingCopyBackupService.joinBackupResource();
		assert.strictEqual(workingCopyBackupService.hasBackupSync(customWorkingCopy), true);

		customWorkingCopy.setDirty(false);
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);
		await workingCopyBackupService.joinDiscardBackup();
		assert.strictEqual(workingCopyBackupService.hasBackupSync(customWorkingCopy), false);

		// Cancellation
		customWorkingCopy.setDirty(true);
		await timeout(0);
		customWorkingCopy.setDirty(false);
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);
		await workingCopyBackupService.joinDiscardBackup();
		assert.strictEqual(workingCopyBackupService.hasBackupSync(customWorkingCopy), false);
	});

	async function restoreBackupsInit(): Promise<[TestWorkingCopyBackupTracker, TestServiceAccessor]> {
		const fooFile = URI.file(isWindows ? 'c:\\Foo' : '/Foo');
		const barFile = URI.file(isWindows ? 'c:\\Bar' : '/Bar');
		const untitledFile1 = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });
		const untitledFile2 = URI.from({ scheme: Schemas.untitled, path: 'Untitled-2' });

		const workingCopyBackupService = disposables.add(new InMemoryTestWorkingCopyBackupService());
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(IWorkingCopyBackupService, workingCopyBackupService);

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService: EditorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		accessor = instantiationService.createInstance(TestServiceAccessor);

		// Backup 2 normal files and 2 untitled files
		const untitledFile1WorkingCopyId = toUntypedWorkingCopyId(untitledFile1);
		const untitledFile2WorkingCopyId = toTypedWorkingCopyId(untitledFile2);
		await workingCopyBackupService.backup(untitledFile1WorkingCopyId, bufferToReadable(VSBuffer.fromString('untitled-1')));
		await workingCopyBackupService.backup(untitledFile2WorkingCopyId, bufferToReadable(VSBuffer.fromString('untitled-2')));

		const fooFileWorkingCopyId = toUntypedWorkingCopyId(fooFile);
		const barFileWorkingCopyId = toTypedWorkingCopyId(barFile);
		await workingCopyBackupService.backup(fooFileWorkingCopyId, bufferToReadable(VSBuffer.fromString('fooFile')));
		await workingCopyBackupService.backup(barFileWorkingCopyId, bufferToReadable(VSBuffer.fromString('barFile')));

		const tracker = disposables.add(instantiationService.createInstance(TestWorkingCopyBackupTracker));

		accessor.lifecycleService.phase = LifecyclePhase.Restored;

		return [tracker, accessor];
	}

	test('Restore backups (basics, some handled)', async function () {
		const [tracker, accessor] = await restoreBackupsInit();

		assert.strictEqual(tracker.getUnrestoredBackups().size, 0);

		let handlesCounter = 0;
		let isOpenCounter = 0;
		let createEditorCounter = 0;

		await tracker.testRestoreBackups({
			handles: workingCopy => {
				handlesCounter++;

				return workingCopy.typeId === 'testBackupTypeId';
			},
			isOpen: (workingCopy, editor) => {
				isOpenCounter++;

				return false;
			},
			createEditor: workingCopy => {
				createEditorCounter++;

				return disposables.add(accessor.instantiationService.createInstance(TestUntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));
			}
		});

		assert.strictEqual(handlesCounter, 4);
		assert.strictEqual(isOpenCounter, 0);
		assert.strictEqual(createEditorCounter, 2);

		assert.strictEqual(accessor.editorService.count, 2);
		assert.ok(accessor.editorService.editors.every(editor => editor.isDirty()));
		assert.strictEqual(tracker.getUnrestoredBackups().size, 2);

		for (const editor of accessor.editorService.editors) {
			assert.ok(editor instanceof TestUntitledTextEditorInput);
			assert.strictEqual(editor.resolved, true);
		}
	});

	test('Restore backups (basics, none handled)', async function () {
		const [tracker, accessor] = await restoreBackupsInit();

		await tracker.testRestoreBackups({
			handles: workingCopy => false,
			isOpen: (workingCopy, editor) => { throw new Error('unexpected'); },
			createEditor: workingCopy => { throw new Error('unexpected'); }
		});

		assert.strictEqual(accessor.editorService.count, 0);
		assert.strictEqual(tracker.getUnrestoredBackups().size, 4);
	});

	test('Restore backups (basics, error case)', async function () {
		const [tracker] = await restoreBackupsInit();

		try {
			await tracker.testRestoreBackups({
				handles: workingCopy => true,
				isOpen: (workingCopy, editor) => { throw new Error('unexpected'); },
				createEditor: workingCopy => { throw new Error('unexpected'); }
			});
		} catch (error) {
			// ignore
		}

		assert.strictEqual(tracker.getUnrestoredBackups().size, 4);
	});

	test('Restore backups (multiple handlers)', async function () {
		const [tracker, accessor] = await restoreBackupsInit();

		const firstHandler = tracker.testRestoreBackups({
			handles: workingCopy => {
				return workingCopy.typeId === 'testBackupTypeId';
			},
			isOpen: (workingCopy, editor) => {
				return false;
			},
			createEditor: workingCopy => {
				return disposables.add(accessor.instantiationService.createInstance(TestUntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));
			}
		});

		const secondHandler = tracker.testRestoreBackups({
			handles: workingCopy => {
				return workingCopy.typeId.length === 0;
			},
			isOpen: (workingCopy, editor) => {
				return false;
			},
			createEditor: workingCopy => {
				return disposables.add(accessor.instantiationService.createInstance(TestUntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));
			}
		});

		await Promise.all([firstHandler, secondHandler]);

		assert.strictEqual(accessor.editorService.count, 4);
		assert.ok(accessor.editorService.editors.every(editor => editor.isDirty()));
		assert.strictEqual(tracker.getUnrestoredBackups().size, 0);

		for (const editor of accessor.editorService.editors) {
			assert.ok(editor instanceof TestUntitledTextEditorInput);
			assert.strictEqual(editor.resolved, true);
		}
	});

	test('Restore backups (editors already opened)', async function () {
		const [tracker, accessor] = await restoreBackupsInit();

		assert.strictEqual(tracker.getUnrestoredBackups().size, 0);

		let handlesCounter = 0;
		let isOpenCounter = 0;

		const editor1 = disposables.add(accessor.instantiationService.createInstance(TestUntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));
		const editor2 = disposables.add(accessor.instantiationService.createInstance(TestUntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));

		await accessor.editorService.openEditors([{ editor: editor1 }, { editor: editor2 }]);

		editor1.resolved = false;
		editor2.resolved = false;

		await tracker.testRestoreBackups({
			handles: workingCopy => {
				handlesCounter++;

				return workingCopy.typeId === 'testBackupTypeId';
			},
			isOpen: (workingCopy, editor) => {
				isOpenCounter++;

				return true;
			},
			createEditor: workingCopy => { throw new Error('unexpected'); }
		});

		assert.strictEqual(handlesCounter, 4);
		assert.strictEqual(isOpenCounter, 4);

		assert.strictEqual(accessor.editorService.count, 2);
		assert.strictEqual(tracker.getUnrestoredBackups().size, 2);

		for (const editor of accessor.editorService.editors) {
			assert.ok(editor instanceof TestUntitledTextEditorInput);

			// assert that we only call `resolve` on inactive editors
			if (accessor.editorService.isVisible(editor)) {
				assert.strictEqual(editor.resolved, false);
			} else {
				assert.strictEqual(editor.resolved, true);
			}
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/workingCopyEditorService.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/workingCopyEditorService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditorService } from '../../../editor/browser/editorService.js';
import { IEditorGroupsService } from '../../../editor/common/editorGroupsService.js';
import { UntitledTextEditorInput } from '../../../untitled/common/untitledTextEditorInput.js';
import { IWorkingCopyEditorHandler, WorkingCopyEditorService } from '../../common/workingCopyEditorService.js';
import { createEditorPart, registerTestResourceEditor, TestEditorService, TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';

suite('WorkingCopyEditorService', () => {

	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestResourceEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	test('registry - basics', () => {
		const service = disposables.add(new WorkingCopyEditorService(disposables.add(new TestEditorService())));

		let handlerEvent: IWorkingCopyEditorHandler | undefined = undefined;
		disposables.add(service.onDidRegisterHandler(handler => {
			handlerEvent = handler;
		}));

		const editorHandler: IWorkingCopyEditorHandler = {
			handles: workingCopy => false,
			isOpen: () => false,
			createEditor: workingCopy => { throw new Error(); }
		};

		disposables.add(service.registerHandler(editorHandler));

		assert.strictEqual(handlerEvent, editorHandler);
	});

	test('findEditor', async () => {
		const disposables = new DisposableStore();

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		const accessor = instantiationService.createInstance(TestServiceAccessor);

		const service = disposables.add(new WorkingCopyEditorService(editorService));

		const resource = URI.parse('custom://some/folder/custom.txt');
		const testWorkingCopy = disposables.add(new TestWorkingCopy(resource, false, 'testWorkingCopyTypeId1'));

		assert.strictEqual(service.findEditor(testWorkingCopy), undefined);

		const editorHandler: IWorkingCopyEditorHandler = {
			handles: workingCopy => workingCopy === testWorkingCopy,
			isOpen: (workingCopy, editor) => workingCopy === testWorkingCopy,
			createEditor: workingCopy => { throw new Error(); }
		};

		disposables.add(service.registerHandler(editorHandler));

		const editor1 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));
		const editor2 = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, accessor.untitledTextEditorService.create({ initialValue: 'foo' })));

		await editorService.openEditors([{ editor: editor1 }, { editor: editor2 }]);

		assert.ok(service.findEditor(testWorkingCopy));

		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/workingCopyFileService.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/workingCopyFileService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TextFileEditorModel } from '../../../textfile/common/textFileEditorModel.js';
import { TextFileEditorModelManager } from '../../../textfile/common/textFileEditorModelManager.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { workbenchInstantiationService, TestServiceAccessor, ITestTextFileEditorModelManager } from '../../../../test/browser/workbenchTestServices.js';
import { URI } from '../../../../../base/common/uri.js';
import { FileOperation } from '../../../../../platform/files/common/files.js';
import { TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { ICopyOperation } from '../../common/workingCopyFileService.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { timeout } from '../../../../../base/common/async.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('WorkingCopyFileService', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(<TextFileEditorModelManager>accessor.textFileService.files);
	});

	teardown(() => {
		disposables.clear();
	});

	test('create - dirty file', async function () {
		await testCreate(toResource.call(this, '/path/file.txt'), VSBuffer.fromString('Hello World'));
	});

	test('delete - dirty file', async function () {
		await testDelete([toResource.call(this, '/path/file.txt')]);
	});

	test('delete multiple - dirty files', async function () {
		await testDelete([
			toResource.call(this, '/path/file1.txt'),
			toResource.call(this, '/path/file2.txt'),
			toResource.call(this, '/path/file3.txt'),
			toResource.call(this, '/path/file4.txt')]);
	});

	test('move - dirty file', async function () {
		await testMoveOrCopy([{ source: toResource.call(this, '/path/file.txt'), target: toResource.call(this, '/path/file_target.txt') }], true);
	});

	test('move - source identical to target', async function () {
		const sourceModel: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel.resource, sourceModel);

		const eventCounter = await testEventsMoveOrCopy([{ file: { source: sourceModel.resource, target: sourceModel.resource }, overwrite: true }], true);

		sourceModel.dispose();
		assert.strictEqual(eventCounter, 3);
	});

	test('move - one source == target and another source != target', async function () {
		const sourceModel1: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file1.txt'), 'utf8', undefined);
		const sourceModel2: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file2.txt'), 'utf8', undefined);
		const targetModel2: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file_target2.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel1.resource, sourceModel1);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel2.resource, sourceModel2);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(targetModel2.resource, targetModel2);

		const eventCounter = await testEventsMoveOrCopy([
			{ file: { source: sourceModel1.resource, target: sourceModel1.resource }, overwrite: true },
			{ file: { source: sourceModel2.resource, target: targetModel2.resource }, overwrite: true }
		], true);

		sourceModel1.dispose();
		sourceModel2.dispose();
		targetModel2.dispose();
		assert.strictEqual(eventCounter, 3);
	});

	test('move multiple - dirty file', async function () {
		await testMoveOrCopy([
			{ source: toResource.call(this, '/path/file1.txt'), target: toResource.call(this, '/path/file1_target.txt') },
			{ source: toResource.call(this, '/path/file2.txt'), target: toResource.call(this, '/path/file2_target.txt') }],
			true);
	});

	test('move - dirty file (target exists and is dirty)', async function () {
		await testMoveOrCopy([{ source: toResource.call(this, '/path/file.txt'), target: toResource.call(this, '/path/file_target.txt') }], true, true);
	});

	test('copy - dirty file', async function () {
		await testMoveOrCopy([{ source: toResource.call(this, '/path/file.txt'), target: toResource.call(this, '/path/file_target.txt') }], false);
	});

	test('copy - source identical to target', async function () {
		const sourceModel: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel.resource, sourceModel);

		const eventCounter = await testEventsMoveOrCopy([{ file: { source: sourceModel.resource, target: sourceModel.resource }, overwrite: true }]);

		sourceModel.dispose();
		assert.strictEqual(eventCounter, 3);
	});

	test('copy - one source == target and another source != target', async function () {
		const sourceModel1: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file1.txt'), 'utf8', undefined);
		const sourceModel2: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file2.txt'), 'utf8', undefined);
		const targetModel2: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file_target2.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel1.resource, sourceModel1);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel2.resource, sourceModel2);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(targetModel2.resource, targetModel2);

		const eventCounter = await testEventsMoveOrCopy([
			{ file: { source: sourceModel1.resource, target: sourceModel1.resource }, overwrite: true },
			{ file: { source: sourceModel2.resource, target: targetModel2.resource }, overwrite: true }
		]);

		sourceModel1.dispose();
		sourceModel2.dispose();
		targetModel2.dispose();
		assert.strictEqual(eventCounter, 3);
	});

	test('copy multiple - dirty file', async function () {
		await testMoveOrCopy([
			{ source: toResource.call(this, '/path/file1.txt'), target: toResource.call(this, '/path/file_target1.txt') },
			{ source: toResource.call(this, '/path/file2.txt'), target: toResource.call(this, '/path/file_target2.txt') },
			{ source: toResource.call(this, '/path/file3.txt'), target: toResource.call(this, '/path/file_target3.txt') }],
			false);
	});

	test('copy - dirty file (target exists and is dirty)', async function () {
		await testMoveOrCopy([{ source: toResource.call(this, '/path/file.txt'), target: toResource.call(this, '/path/file_target.txt') }], false, true);
	});

	test('getDirty', async function () {
		const model1 = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file-1.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model1.resource, model1);

		const model2 = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file-2.txt'), 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model2.resource, model2);

		let dirty = accessor.workingCopyFileService.getDirty(model1.resource);
		assert.strictEqual(dirty.length, 0);

		await model1.resolve();
		model1.textEditorModel!.setValue('foo');

		dirty = accessor.workingCopyFileService.getDirty(model1.resource);
		assert.strictEqual(dirty.length, 1);
		assert.strictEqual(dirty[0], model1);

		dirty = accessor.workingCopyFileService.getDirty(toResource.call(this, '/path'));
		assert.strictEqual(dirty.length, 1);
		assert.strictEqual(dirty[0], model1);

		await model2.resolve();
		model2.textEditorModel!.setValue('bar');

		dirty = accessor.workingCopyFileService.getDirty(toResource.call(this, '/path'));
		assert.strictEqual(dirty.length, 2);

		model1.dispose();
		model2.dispose();
	});

	test('registerWorkingCopyProvider', async function () {
		const model1: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file-1.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model1.resource, model1);
		await model1.resolve();
		model1.textEditorModel!.setValue('foo');

		const testWorkingCopy: TestWorkingCopy = disposables.add(new TestWorkingCopy(toResource.call(this, '/path/file-2.txt'), true));
		const registration = accessor.workingCopyFileService.registerWorkingCopyProvider(() => {
			return [model1, testWorkingCopy];
		});

		let dirty = accessor.workingCopyFileService.getDirty(model1.resource);
		assert.strictEqual(dirty.length, 2, 'Should return default working copy + working copy from provider');
		assert.strictEqual(dirty[0], model1);
		assert.strictEqual(dirty[1], testWorkingCopy);

		registration.dispose();

		dirty = accessor.workingCopyFileService.getDirty(model1.resource);
		assert.strictEqual(dirty.length, 1, 'Should have unregistered our provider');
		assert.strictEqual(dirty[0], model1);
	});

	test('createFolder', async function () {
		let eventCounter = 0;
		let correlationId: number | undefined = undefined;

		const resource = toResource.call(this, '/path/folder');

		disposables.add(accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async (files, operation) => {
				assert.strictEqual(files.length, 1);
				const file = files[0];
				assert.strictEqual(file.target.toString(), resource.toString());
				assert.strictEqual(operation, FileOperation.CREATE);
				eventCounter++;
			}
		}));

		disposables.add(accessor.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => {
			assert.strictEqual(e.files.length, 1);
			const file = e.files[0];
			assert.strictEqual(file.target.toString(), resource.toString());
			assert.strictEqual(e.operation, FileOperation.CREATE);
			correlationId = e.correlationId;
			eventCounter++;
		}));

		disposables.add(accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			assert.strictEqual(e.files.length, 1);
			const file = e.files[0];
			assert.strictEqual(file.target.toString(), resource.toString());
			assert.strictEqual(e.operation, FileOperation.CREATE);
			assert.strictEqual(e.correlationId, correlationId);
			eventCounter++;
		}));

		await accessor.workingCopyFileService.createFolder([{ resource }], CancellationToken.None);

		assert.strictEqual(eventCounter, 3);
	});

	test('cancellation of participants', async function () {
		const resource = toResource.call(this, '/path/folder');

		let canceled = false;
		disposables.add(accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async (files, operation, info, t, token) => {
				await timeout(0);
				canceled = token.isCancellationRequested;
			}
		}));

		// Create
		let cts = new CancellationTokenSource();
		let promise: Promise<unknown> = accessor.workingCopyFileService.create([{ resource }], cts.token);
		cts.cancel();
		await promise;
		assert.strictEqual(canceled, true);
		canceled = false;

		// Create Folder
		cts = new CancellationTokenSource();
		promise = accessor.workingCopyFileService.createFolder([{ resource }], cts.token);
		cts.cancel();
		await promise;
		assert.strictEqual(canceled, true);
		canceled = false;

		// Move
		cts = new CancellationTokenSource();
		promise = accessor.workingCopyFileService.move([{ file: { source: resource, target: resource } }], cts.token);
		cts.cancel();
		await promise;
		assert.strictEqual(canceled, true);
		canceled = false;

		// Copy
		cts = new CancellationTokenSource();
		promise = accessor.workingCopyFileService.copy([{ file: { source: resource, target: resource } }], cts.token);
		cts.cancel();
		await promise;
		assert.strictEqual(canceled, true);
		canceled = false;

		// Delete
		cts = new CancellationTokenSource();
		promise = accessor.workingCopyFileService.delete([{ resource }], cts.token);
		cts.cancel();
		await promise;
		assert.strictEqual(canceled, true);
		canceled = false;
	});

	async function testEventsMoveOrCopy(files: ICopyOperation[], move?: boolean): Promise<number> {
		let eventCounter = 0;

		const participant = accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async files => {
				eventCounter++;
			}
		});

		const listener1 = accessor.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => {
			eventCounter++;
		});

		const listener2 = accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			eventCounter++;
		});

		if (move) {
			await accessor.workingCopyFileService.move(files, CancellationToken.None);
		} else {
			await accessor.workingCopyFileService.copy(files, CancellationToken.None);
		}

		participant.dispose();
		listener1.dispose();
		listener2.dispose();
		return eventCounter;
	}

	async function testMoveOrCopy(files: { source: URI; target: URI }[], move: boolean, targetDirty?: boolean): Promise<void> {

		let eventCounter = 0;
		const models = await Promise.all(files.map(async ({ source, target }, i) => {
			const sourceModel: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, source, 'utf8', undefined);
			const targetModel: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, target, 'utf8', undefined);
			(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(sourceModel.resource, sourceModel);
			(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(targetModel.resource, targetModel);

			await sourceModel.resolve();
			sourceModel.textEditorModel!.setValue('foo' + i);
			assert.ok(accessor.textFileService.isDirty(sourceModel.resource));
			if (targetDirty) {
				await targetModel.resolve();
				targetModel.textEditorModel!.setValue('bar' + i);
				assert.ok(accessor.textFileService.isDirty(targetModel.resource));
			}

			return { sourceModel, targetModel };
		}));

		const participant = accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async (files, operation) => {
				for (let i = 0; i < files.length; i++) {
					const { target, source } = files[i];
					const { targetModel, sourceModel } = models[i];

					assert.strictEqual(target.toString(), targetModel.resource.toString());
					assert.strictEqual(source?.toString(), sourceModel.resource.toString());
				}

				eventCounter++;

				assert.strictEqual(operation, move ? FileOperation.MOVE : FileOperation.COPY);
			}
		});

		let correlationId: number;

		const listener1 = accessor.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => {
			for (let i = 0; i < e.files.length; i++) {
				const { target, source } = files[i];
				const { targetModel, sourceModel } = models[i];

				assert.strictEqual(target.toString(), targetModel.resource.toString());
				assert.strictEqual(source?.toString(), sourceModel.resource.toString());
			}

			eventCounter++;

			correlationId = e.correlationId;
			assert.strictEqual(e.operation, move ? FileOperation.MOVE : FileOperation.COPY);
		});

		const listener2 = accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			for (let i = 0; i < e.files.length; i++) {
				const { target, source } = files[i];
				const { targetModel, sourceModel } = models[i];
				assert.strictEqual(target.toString(), targetModel.resource.toString());
				assert.strictEqual(source?.toString(), sourceModel.resource.toString());
			}

			eventCounter++;

			assert.strictEqual(e.operation, move ? FileOperation.MOVE : FileOperation.COPY);
			assert.strictEqual(e.correlationId, correlationId);
		});

		if (move) {
			await accessor.workingCopyFileService.move(models.map(model => ({ file: { source: model.sourceModel.resource, target: model.targetModel.resource }, options: { overwrite: true } })), CancellationToken.None);
		} else {
			await accessor.workingCopyFileService.copy(models.map(model => ({ file: { source: model.sourceModel.resource, target: model.targetModel.resource }, options: { overwrite: true } })), CancellationToken.None);
		}

		for (let i = 0; i < models.length; i++) {
			const { sourceModel, targetModel } = models[i];

			assert.strictEqual(targetModel.textEditorModel!.getValue(), 'foo' + i);

			if (move) {
				assert.ok(!accessor.textFileService.isDirty(sourceModel.resource));
			} else {
				assert.ok(accessor.textFileService.isDirty(sourceModel.resource));
			}
			assert.ok(accessor.textFileService.isDirty(targetModel.resource));

			sourceModel.dispose();
			targetModel.dispose();
		}
		assert.strictEqual(eventCounter, 3);

		participant.dispose();
		listener1.dispose();
		listener2.dispose();
	}

	async function testDelete(resources: URI[]) {

		const models = await Promise.all(resources.map(async resource => {
			const model = instantiationService.createInstance(TextFileEditorModel, resource, 'utf8', undefined);
			(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

			await model.resolve();
			model.textEditorModel!.setValue('foo');
			assert.ok(accessor.workingCopyService.isDirty(model.resource));
			return model;
		}));

		let eventCounter = 0;
		let correlationId: number | undefined = undefined;

		const participant = accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async (files, operation) => {
				for (let i = 0; i < models.length; i++) {
					const model = models[i];
					const file = files[i];
					assert.strictEqual(file.target.toString(), model.resource.toString());
				}
				assert.strictEqual(operation, FileOperation.DELETE);
				eventCounter++;
			}
		});

		const listener1 = accessor.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => {
			for (let i = 0; i < models.length; i++) {
				const model = models[i];
				const file = e.files[i];
				assert.strictEqual(file.target.toString(), model.resource.toString());
			}
			assert.strictEqual(e.operation, FileOperation.DELETE);
			correlationId = e.correlationId;
			eventCounter++;
		});

		const listener2 = accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			for (let i = 0; i < models.length; i++) {
				const model = models[i];
				const file = e.files[i];
				assert.strictEqual(file.target.toString(), model.resource.toString());
			}
			assert.strictEqual(e.operation, FileOperation.DELETE);
			assert.strictEqual(e.correlationId, correlationId);
			eventCounter++;
		});

		await accessor.workingCopyFileService.delete(models.map(model => ({ resource: model.resource })), CancellationToken.None);
		for (const model of models) {
			assert.ok(!accessor.workingCopyService.isDirty(model.resource));
			model.dispose();
		}

		assert.strictEqual(eventCounter, 3);

		participant.dispose();
		listener1.dispose();
		listener2.dispose();
	}

	async function testCreate(resource: URI, contents: VSBuffer) {
		const model = instantiationService.createInstance(TextFileEditorModel, resource, 'utf8', undefined);
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.workingCopyService.isDirty(model.resource));

		let eventCounter = 0;
		let correlationId: number | undefined = undefined;

		disposables.add(accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async (files, operation) => {
				assert.strictEqual(files.length, 1);
				const file = files[0];
				assert.strictEqual(file.target.toString(), model.resource.toString());
				assert.strictEqual(operation, FileOperation.CREATE);
				eventCounter++;
			}
		}));

		disposables.add(accessor.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => {
			assert.strictEqual(e.files.length, 1);
			const file = e.files[0];
			assert.strictEqual(file.target.toString(), model.resource.toString());
			assert.strictEqual(e.operation, FileOperation.CREATE);
			correlationId = e.correlationId;
			eventCounter++;
		}));

		disposables.add(accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			assert.strictEqual(e.files.length, 1);
			const file = e.files[0];
			assert.strictEqual(file.target.toString(), model.resource.toString());
			assert.strictEqual(e.operation, FileOperation.CREATE);
			assert.strictEqual(e.correlationId, correlationId);
			eventCounter++;
		}));

		await accessor.workingCopyFileService.create([{ resource, contents }], CancellationToken.None);
		assert.ok(!accessor.workingCopyService.isDirty(model.resource));
		model.dispose();

		assert.strictEqual(eventCounter, 3);
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/common/workingCopyService.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/common/workingCopyService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IWorkingCopy } from '../../common/workingCopy.js';
import { URI } from '../../../../../base/common/uri.js';
import { TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { IWorkingCopySaveEvent, WorkingCopyService } from '../../common/workingCopyService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('WorkingCopyService', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('registry - basics', () => {
		const service = disposables.add(new WorkingCopyService());

		const onDidChangeDirty: IWorkingCopy[] = [];
		disposables.add(service.onDidChangeDirty(copy => onDidChangeDirty.push(copy)));

		const onDidChangeContent: IWorkingCopy[] = [];
		disposables.add(service.onDidChangeContent(copy => onDidChangeContent.push(copy)));

		const onDidSave: IWorkingCopySaveEvent[] = [];
		disposables.add(service.onDidSave(copy => onDidSave.push(copy)));

		const onDidRegister: IWorkingCopy[] = [];
		disposables.add(service.onDidRegister(copy => onDidRegister.push(copy)));

		const onDidUnregister: IWorkingCopy[] = [];
		disposables.add(service.onDidUnregister(copy => onDidUnregister.push(copy)));

		assert.strictEqual(service.hasDirty, false);
		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.workingCopies.length, 0);
		assert.strictEqual(service.isDirty(URI.file('/')), false);

		// resource 1
		const resource1 = URI.file('/some/folder/file.txt');
		assert.strictEqual(service.has(resource1), false);
		assert.strictEqual(service.has({ resource: resource1, typeId: 'testWorkingCopyType' }), false);
		assert.strictEqual(service.get({ resource: resource1, typeId: 'testWorkingCopyType' }), undefined);
		assert.strictEqual(service.getAll(resource1), undefined);
		const copy1 = disposables.add(new TestWorkingCopy(resource1));
		const unregister1 = service.registerWorkingCopy(copy1);

		assert.strictEqual(service.workingCopies.length, 1);
		assert.strictEqual(service.workingCopies[0], copy1);
		assert.strictEqual(onDidRegister.length, 1);
		assert.strictEqual(onDidRegister[0], copy1);
		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.modifiedCount, 0);
		assert.strictEqual(service.isDirty(resource1), false);
		assert.strictEqual(service.has(resource1), true);
		assert.strictEqual(service.has(copy1), true);
		assert.strictEqual(service.get(copy1), copy1);
		assert.strictEqual(service.hasDirty, false);

		const copies = service.getAll(copy1.resource);
		assert.strictEqual(copies?.length, 1);
		assert.strictEqual(copies[0], copy1);

		copy1.setDirty(true);
		copy1.save();

		assert.strictEqual(copy1.isDirty(), true);
		assert.strictEqual(service.dirtyCount, 1);
		assert.strictEqual(service.dirtyWorkingCopies.length, 1);
		assert.strictEqual(service.dirtyWorkingCopies[0], copy1);
		assert.strictEqual(service.modifiedCount, 1);
		assert.strictEqual(service.modifiedWorkingCopies.length, 1);
		assert.strictEqual(service.modifiedWorkingCopies[0], copy1);
		assert.strictEqual(service.workingCopies.length, 1);
		assert.strictEqual(service.workingCopies[0], copy1);
		assert.strictEqual(service.isDirty(resource1), true);
		assert.strictEqual(service.hasDirty, true);
		assert.strictEqual(onDidChangeDirty.length, 1);
		assert.strictEqual(onDidChangeDirty[0], copy1);
		assert.strictEqual(onDidSave.length, 1);
		assert.strictEqual(onDidSave[0].workingCopy, copy1);

		copy1.setContent('foo');

		assert.strictEqual(onDidChangeContent.length, 1);
		assert.strictEqual(onDidChangeContent[0], copy1);

		copy1.setDirty(false);

		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.isDirty(resource1), false);
		assert.strictEqual(service.hasDirty, false);
		assert.strictEqual(onDidChangeDirty.length, 2);
		assert.strictEqual(onDidChangeDirty[1], copy1);

		unregister1.dispose();

		assert.strictEqual(onDidUnregister.length, 1);
		assert.strictEqual(onDidUnregister[0], copy1);
		assert.strictEqual(service.workingCopies.length, 0);
		assert.strictEqual(service.has(resource1), false);

		// resource 2
		const resource2 = URI.file('/some/folder/file-dirty.txt');
		const copy2 = disposables.add(new TestWorkingCopy(resource2, true));
		const unregister2 = service.registerWorkingCopy(copy2);

		assert.strictEqual(onDidRegister.length, 2);
		assert.strictEqual(onDidRegister[1], copy2);
		assert.strictEqual(service.dirtyCount, 1);
		assert.strictEqual(service.isDirty(resource2), true);
		assert.strictEqual(service.hasDirty, true);

		assert.strictEqual(onDidChangeDirty.length, 3);
		assert.strictEqual(onDidChangeDirty[2], copy2);

		copy2.setContent('foo');

		assert.strictEqual(onDidChangeContent.length, 2);
		assert.strictEqual(onDidChangeContent[1], copy2);

		unregister2.dispose();

		assert.strictEqual(onDidUnregister.length, 2);
		assert.strictEqual(onDidUnregister[1], copy2);
		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.hasDirty, false);
		assert.strictEqual(onDidChangeDirty.length, 4);
		assert.strictEqual(onDidChangeDirty[3], copy2);
	});

	test('registry - multiple copies on same resource throws (same type ID)', () => {
		const service = disposables.add(new WorkingCopyService());

		const resource = URI.parse('custom://some/folder/custom.txt');

		const copy1 = disposables.add(new TestWorkingCopy(resource));
		disposables.add(service.registerWorkingCopy(copy1));

		const copy2 = disposables.add(new TestWorkingCopy(resource));

		assert.throws(() => service.registerWorkingCopy(copy2));
	});

	test('registry - multiple copies on same resource is supported (different type ID)', () => {
		const service = disposables.add(new WorkingCopyService());

		const resource = URI.parse('custom://some/folder/custom.txt');

		const typeId1 = 'testWorkingCopyTypeId1';
		let copy1 = disposables.add(new TestWorkingCopy(resource, false, typeId1));
		let dispose1 = service.registerWorkingCopy(copy1);

		const typeId2 = 'testWorkingCopyTypeId2';
		const copy2 = disposables.add(new TestWorkingCopy(resource, false, typeId2));
		const dispose2 = service.registerWorkingCopy(copy2);

		const typeId3 = 'testWorkingCopyTypeId3';
		const copy3 = disposables.add(new TestWorkingCopy(resource, false, typeId3));
		const dispose3 = service.registerWorkingCopy(copy3);

		const copies = service.getAll(resource);
		assert.strictEqual(copies?.length, 3);
		assert.strictEqual(copies[0], copy1);
		assert.strictEqual(copies[1], copy2);
		assert.strictEqual(copies[2], copy3);

		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.isDirty(resource), false);
		assert.strictEqual(service.isDirty(resource, typeId1), false);

		copy1.setDirty(true);
		assert.strictEqual(service.dirtyCount, 1);
		assert.strictEqual(service.isDirty(resource), true);
		assert.strictEqual(service.isDirty(resource, typeId1), true);
		assert.strictEqual(service.isDirty(resource, typeId2), false);

		copy2.setDirty(true);
		assert.strictEqual(service.dirtyCount, 2);
		assert.strictEqual(service.isDirty(resource), true);
		assert.strictEqual(service.isDirty(resource, typeId1), true);
		assert.strictEqual(service.isDirty(resource, typeId2), true);

		copy3.setDirty(true);
		assert.strictEqual(service.dirtyCount, 3);
		assert.strictEqual(service.isDirty(resource), true);
		assert.strictEqual(service.isDirty(resource, typeId1), true);
		assert.strictEqual(service.isDirty(resource, typeId2), true);
		assert.strictEqual(service.isDirty(resource, typeId3), true);

		copy1.setDirty(false);
		copy2.setDirty(false);
		copy3.setDirty(false);
		assert.strictEqual(service.dirtyCount, 0);
		assert.strictEqual(service.isDirty(resource), false);
		assert.strictEqual(service.isDirty(resource, typeId1), false);
		assert.strictEqual(service.isDirty(resource, typeId2), false);
		assert.strictEqual(service.isDirty(resource, typeId3), false);

		dispose1.dispose();
		copy1 = disposables.add(new TestWorkingCopy(resource, false, typeId1));
		dispose1 = service.registerWorkingCopy(copy1);

		dispose1.dispose();
		dispose2.dispose();
		dispose3.dispose();

		assert.strictEqual(service.workingCopies.length, 0);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyBackupService.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyBackupService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isWindows } from '../../../../../base/common/platform.js';
import { insert } from '../../../../../base/common/arrays.js';
import { hash } from '../../../../../base/common/hash.js';
import { isEqual, joinPath, dirname } from '../../../../../base/common/resources.js';
import { join } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { WorkingCopyBackupsModel, hashIdentifier } from '../../common/workingCopyBackupService.js';
import { createTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { Schemas } from '../../../../../base/common/network.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { LogLevel, NullLogService } from '../../../../../platform/log/common/log.js';
import { NativeWorkbenchEnvironmentService } from '../../../environment/electron-browser/environmentService.js';
import { toBufferOrReadable } from '../../../textfile/common/textfiles.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { NativeWorkingCopyBackupService } from '../../electron-browser/workingCopyBackupService.js';
import { FileUserDataProvider } from '../../../../../platform/userData/common/fileUserDataProvider.js';
import { bufferToReadable, bufferToStream, streamToBuffer, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../../base/common/buffer.js';
import { TestLifecycleService, toTypedWorkingCopyId, toUntypedWorkingCopyId } from '../../../../test/browser/workbenchTestServices.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IWorkingCopyBackupMeta, IWorkingCopyIdentifier } from '../../common/workingCopy.js';
import { consumeStream } from '../../../../../base/common/stream.js';
import { TestProductService } from '../../../../test/common/workbenchTestServices.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { INativeWindowConfiguration } from '../../../../../platform/window/common/window.js';
import product from '../../../../../platform/product/common/product.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { UserDataProfilesService } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';

const homeDir = URI.file('home').with({ scheme: Schemas.inMemory });
const tmpDir = URI.file('tmp').with({ scheme: Schemas.inMemory });
const NULL_PROFILE = {
	name: '',
	id: '',
	shortName: '',
	isDefault: false,
	location: homeDir,
	settingsResource: joinPath(homeDir, 'settings.json'),
	globalStorageHome: joinPath(homeDir, 'globalStorage'),
	keybindingsResource: joinPath(homeDir, 'keybindings.json'),
	tasksResource: joinPath(homeDir, 'tasks.json'),
	mcpResource: joinPath(homeDir, 'mcp.json'),
	snippetsHome: joinPath(homeDir, 'snippets'),
	promptsHome: joinPath(homeDir, 'prompts'),
	extensionsResource: joinPath(homeDir, 'extensions.json'),
	cacheHome: joinPath(homeDir, 'cache')
};

const TestNativeWindowConfiguration: INativeWindowConfiguration = {
	windowId: 0,
	machineId: 'testMachineId',
	sqmId: 'testSqmId',
	devDeviceId: 'testdevDeviceId',
	logLevel: LogLevel.Error,
	loggers: [],
	mainPid: 0,
	appRoot: '',
	userEnv: {},
	execPath: process.execPath,
	perfMarks: [],
	colorScheme: { dark: true, highContrast: false },
	os: { release: 'unknown', hostname: 'unknown', arch: 'unknown' },
	product,
	homeDir: homeDir.fsPath,
	tmpDir: tmpDir.fsPath,
	userDataDir: joinPath(homeDir, product.nameShort).fsPath,
	profiles: { profile: NULL_PROFILE, all: [NULL_PROFILE], home: homeDir },
	nls: {
		messages: [],
		language: 'en'
	},
	_: []
};

export class TestNativeWorkbenchEnvironmentService extends NativeWorkbenchEnvironmentService {

	constructor(testDir: URI, backupPath: URI) {
		super({ ...TestNativeWindowConfiguration, backupPath: backupPath.fsPath, 'user-data-dir': testDir.fsPath }, TestProductService);
	}
}

export class NodeTestWorkingCopyBackupService extends NativeWorkingCopyBackupService {

	private backupResourceJoiners: Function[];
	private discardBackupJoiners: Function[];
	discardedBackups: IWorkingCopyIdentifier[];
	discardedAllBackups: boolean;
	private pendingBackupsArr: Promise<void>[];

	readonly _fileService: IFileService;

	constructor(testDir: URI, workspaceBackupPath: URI) {
		const environmentService = new TestNativeWorkbenchEnvironmentService(testDir, workspaceBackupPath);
		const logService = new NullLogService();
		const fileService = new FileService(logService);
		const lifecycleService = new TestLifecycleService();
		super(environmentService, fileService, logService, lifecycleService);

		const fsp = new InMemoryFileSystemProvider();
		fileService.registerProvider(Schemas.inMemory, fsp);
		const uriIdentityService = new UriIdentityService(fileService);
		const userDataProfilesService = new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService);
		fileService.registerProvider(Schemas.vscodeUserData, new FileUserDataProvider(Schemas.file, fsp, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, logService));

		this._fileService = fileService;

		this.backupResourceJoiners = [];
		this.discardBackupJoiners = [];
		this.discardedBackups = [];
		this.pendingBackupsArr = [];
		this.discardedAllBackups = false;
	}

	testGetFileService(): IFileService {
		return this.fileService;
	}

	async waitForAllBackups(): Promise<void> {
		await Promise.all(this.pendingBackupsArr);
	}

	joinBackupResource(): Promise<void> {
		return new Promise(resolve => this.backupResourceJoiners.push(resolve));
	}

	override async backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadableStream | VSBufferReadable, versionId?: number, meta?: any, token?: CancellationToken): Promise<void> {
		const p = super.backup(identifier, content, versionId, meta, token);
		const removeFromPendingBackups = insert(this.pendingBackupsArr, p.then(undefined, undefined));

		try {
			await p;
		} finally {
			removeFromPendingBackups();
		}

		while (this.backupResourceJoiners.length) {
			this.backupResourceJoiners.pop()!();
		}
	}

	joinDiscardBackup(): Promise<void> {
		return new Promise(resolve => this.discardBackupJoiners.push(resolve));
	}

	override async discardBackup(identifier: IWorkingCopyIdentifier): Promise<void> {
		await super.discardBackup(identifier);
		this.discardedBackups.push(identifier);

		while (this.discardBackupJoiners.length) {
			this.discardBackupJoiners.pop()!();
		}
	}

	override async discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void> {
		this.discardedAllBackups = true;

		return super.discardBackups(filter);
	}

	async getBackupContents(identifier: IWorkingCopyIdentifier): Promise<string> {
		const backupResource = this.toBackupResource(identifier);

		const fileContents = await this.fileService.readFile(backupResource);

		return fileContents.value.toString();
	}
}

suite('WorkingCopyBackupService', () => {

	let testDir: URI;
	let backupHome: URI;
	let workspacesJsonPath: URI;
	let workspaceBackupPath: URI;

	let service: NodeTestWorkingCopyBackupService;
	let fileService: IFileService;

	const disposables = new DisposableStore();

	const workspaceResource = URI.file(isWindows ? 'c:\\workspace' : '/workspace');
	const fooFile = URI.file(isWindows ? 'c:\\Foo' : '/Foo');
	const customFile = URI.parse('customScheme://some/path');
	const customFileWithFragment = URI.parse('customScheme2://some/path#fragment');
	const barFile = URI.file(isWindows ? 'c:\\Bar' : '/Bar');
	const fooBarFile = URI.file(isWindows ? 'c:\\Foo Bar' : '/Foo Bar');
	const untitledFile = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });

	setup(async () => {
		testDir = URI.file(join(generateUuid(), 'vsctests', 'workingcopybackupservice')).with({ scheme: Schemas.inMemory });
		backupHome = joinPath(testDir, 'Backups');
		workspacesJsonPath = joinPath(backupHome, 'workspaces.json');
		workspaceBackupPath = joinPath(backupHome, hash(workspaceResource.fsPath).toString(16));

		service = disposables.add(new NodeTestWorkingCopyBackupService(testDir, workspaceBackupPath));
		fileService = service._fileService;

		await fileService.createFolder(backupHome);

		return fileService.writeFile(workspacesJsonPath, VSBuffer.fromString(''));
	});

	teardown(() => {
		disposables.clear();
	});

	suite('hashIdentifier', () => {
		test('should correctly hash the identifier for untitled scheme URIs', () => {
			const uri = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes change people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			const untypedBackupHash = hashIdentifier(toUntypedWorkingCopyId(uri));
			assert.strictEqual(untypedBackupHash, '-7f9c1a2e');
			assert.strictEqual(untypedBackupHash, hash(uri.fsPath).toString(16));

			const typedBackupHash = hashIdentifier({ typeId: 'hashTest', resource: uri });
			if (isWindows) {
				assert.strictEqual(typedBackupHash, '-17c47cdc');
			} else {
				assert.strictEqual(typedBackupHash, '-8ad5f4f');
			}

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes collide people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			assert.notStrictEqual(untypedBackupHash, typedBackupHash);
		});

		test('should correctly hash the identifier for file scheme URIs', () => {
			const uri = URI.file('/foo');

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes change people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			const untypedBackupHash = hashIdentifier(toUntypedWorkingCopyId(uri));
			if (isWindows) {
				assert.strictEqual(untypedBackupHash, '20ffaa13');
			} else {
				assert.strictEqual(untypedBackupHash, '20eb3560');
			}
			assert.strictEqual(untypedBackupHash, hash(uri.fsPath).toString(16));

			const typedBackupHash = hashIdentifier({ typeId: 'hashTest', resource: uri });
			if (isWindows) {
				assert.strictEqual(typedBackupHash, '-55fc55db');
			} else {
				assert.strictEqual(typedBackupHash, '51e56bf');
			}

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes collide people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			assert.notStrictEqual(untypedBackupHash, typedBackupHash);
		});

		test('should correctly hash the identifier for custom scheme URIs', () => {
			const uri = URI.from({
				scheme: 'vscode-custom',
				path: 'somePath'
			});

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes change people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			const untypedBackupHash = hashIdentifier(toUntypedWorkingCopyId(uri));
			assert.strictEqual(untypedBackupHash, '-44972d98');
			assert.strictEqual(untypedBackupHash, hash(uri.toString()).toString(16));

			const typedBackupHash = hashIdentifier({ typeId: 'hashTest', resource: uri });
			assert.strictEqual(typedBackupHash, '502149c7');

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes collide people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			assert.notStrictEqual(untypedBackupHash, typedBackupHash);
		});

		test('should not fail for URIs without path', () => {
			const uri = URI.from({
				scheme: 'vscode-fragment',
				fragment: 'frag'
			});

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes change people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			const untypedBackupHash = hashIdentifier(toUntypedWorkingCopyId(uri));
			assert.strictEqual(untypedBackupHash, '-2f6b2f1b');
			assert.strictEqual(untypedBackupHash, hash(uri.toString()).toString(16));

			const typedBackupHash = hashIdentifier({ typeId: 'hashTest', resource: uri });
			assert.strictEqual(typedBackupHash, '6e82ca57');

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// If these hashes collide people will lose their backed up files
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

			assert.notStrictEqual(untypedBackupHash, typedBackupHash);
		});
	});

	suite('getBackupResource', () => {
		test('should get the correct backup path for text files', () => {

			// Format should be: <backupHome>/<workspaceHash>/<scheme>/<filePathHash>
			const backupResource = fooFile;
			const workspaceHash = hash(workspaceResource.fsPath).toString(16);

			// No Type ID
			let backupId = toUntypedWorkingCopyId(backupResource);
			let filePathHash = hashIdentifier(backupId);
			let expectedPath = joinPath(backupHome, workspaceHash, Schemas.file, filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);

			// With Type ID
			backupId = toTypedWorkingCopyId(backupResource);
			filePathHash = hashIdentifier(backupId);
			expectedPath = joinPath(backupHome, workspaceHash, Schemas.file, filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);
		});

		test('should get the correct backup path for untitled files', () => {

			// Format should be: <backupHome>/<workspaceHash>/<scheme>/<filePathHash>
			const backupResource = URI.from({ scheme: Schemas.untitled, path: 'Untitled-1' });
			const workspaceHash = hash(workspaceResource.fsPath).toString(16);

			// No Type ID
			let backupId = toUntypedWorkingCopyId(backupResource);
			let filePathHash = hashIdentifier(backupId);
			let expectedPath = joinPath(backupHome, workspaceHash, Schemas.untitled, filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);

			// With Type ID
			backupId = toTypedWorkingCopyId(backupResource);
			filePathHash = hashIdentifier(backupId);
			expectedPath = joinPath(backupHome, workspaceHash, Schemas.untitled, filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);
		});

		test('should get the correct backup path for custom files', () => {

			// Format should be: <backupHome>/<workspaceHash>/<scheme>/<filePathHash>
			const backupResource = URI.from({ scheme: 'custom', path: 'custom/file.txt' });
			const workspaceHash = hash(workspaceResource.fsPath).toString(16);

			// No Type ID
			let backupId = toUntypedWorkingCopyId(backupResource);
			let filePathHash = hashIdentifier(backupId);
			let expectedPath = joinPath(backupHome, workspaceHash, 'custom', filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);

			// With Type ID
			backupId = toTypedWorkingCopyId(backupResource);
			filePathHash = hashIdentifier(backupId);
			expectedPath = joinPath(backupHome, workspaceHash, 'custom', filePathHash).with({ scheme: Schemas.vscodeUserData }).toString();
			assert.strictEqual(service.toBackupResource(backupId).toString(), expectedPath);
		});
	});

	suite('backup', () => {

		function toExpectedPreamble(identifier: IWorkingCopyIdentifier, content = '', meta?: object): string {
			return `${identifier.resource.toString()} ${JSON.stringify({ ...meta, typeId: identifier.typeId })}\n${content}`;
		}

		test('joining', async () => {
			let backupJoined = false;
			const joinBackupsPromise = service.joinBackups();
			joinBackupsPromise.then(() => backupJoined = true);
			await joinBackupsPromise;
			assert.strictEqual(backupJoined, true);

			backupJoined = false;
			service.joinBackups().then(() => backupJoined = true);

			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			const backupPromise = service.backup(identifier);
			assert.strictEqual(backupJoined, false);
			await backupPromise;
			assert.strictEqual(backupJoined, true);

			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('no text', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('text file', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test'));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('text file (with version)', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')), 666);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test'));
			assert.ok(!service.hasBackupSync(identifier, 555));
			assert.ok(service.hasBackupSync(identifier, 666));
		});

		test('text file (with meta)', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const meta = { etag: '678', orphaned: true };

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')), undefined, meta);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test', meta));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('text file with whitespace in name and type (with meta)', async () => {
			const fileWithSpace = URI.file(isWindows ? 'c:\\Foo \n Bar' : '/Foo \n Bar');
			const identifier = toTypedWorkingCopyId(fileWithSpace, ' test id \n');
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const meta = { etag: '678 \n k', orphaned: true };

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')), undefined, meta);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test', meta));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('text file with unicode character in name and type (with meta)', async () => {
			const fileWithUnicode = URI.file(isWindows ? 'c:\\so𒀅meࠄ' : '/so𒀅meࠄ');
			const identifier = toTypedWorkingCopyId(fileWithUnicode, ' test so𒀅meࠄ id \n');
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const meta = { etag: '678so𒀅meࠄ', orphaned: true };

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')), undefined, meta);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test', meta));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('untitled file', async () => {
			const identifier = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test'));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('text file (readable)', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const model = createTextModel('test');

			await service.backup(identifier, toBufferOrReadable(model.createSnapshot()));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test'));
			assert.ok(service.hasBackupSync(identifier));

			model.dispose();
		});

		test('untitled file (readable)', async () => {
			const identifier = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const model = createTextModel('test');

			await service.backup(identifier, toBufferOrReadable(model.createSnapshot()));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, 'test'));

			model.dispose();
		});

		test('text file (large file, stream)', () => {
			const largeString = (new Array(30 * 1024)).join('Large String\n');

			return testLargeTextFile(largeString, bufferToStream(VSBuffer.fromString(largeString)));
		});

		test('text file (large file, readable)', async () => {
			const largeString = (new Array(30 * 1024)).join('Large String\n');
			const model = createTextModel(largeString);

			await testLargeTextFile(largeString, toBufferOrReadable(model.createSnapshot()));

			model.dispose();
		});

		async function testLargeTextFile(largeString: string, buffer: VSBufferReadable | VSBufferReadableStream) {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, buffer, undefined, { largeTest: true });
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, largeString, { largeTest: true }));
			assert.ok(service.hasBackupSync(identifier));
		}

		test('untitled file (large file, readable)', async () => {
			const identifier = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));
			const largeString = (new Array(30 * 1024)).join('Large String\n');
			const model = createTextModel(largeString);

			await service.backup(identifier, toBufferOrReadable(model.createSnapshot()));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier, largeString));
			assert.ok(service.hasBackupSync(identifier));

			model.dispose();
		});

		test('cancellation', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			const cts = new CancellationTokenSource();
			const promise = service.backup(identifier, undefined, undefined, undefined, cts.token);
			cts.cancel();
			await promise;

			assert.strictEqual((await fileService.exists(backupPath)), false);
			assert.ok(!service.hasBackupSync(identifier));
		});

		test('multiple', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await Promise.all([
				service.backup(identifier),
				service.backup(identifier),
				service.backup(identifier),
				service.backup(identifier)
			]);

			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.readFile(backupPath)).value.toString(), toExpectedPreamble(identifier));
			assert.ok(service.hasBackupSync(identifier));
		});

		test('multiple same resource, different type id', async () => {
			const backupId1 = toUntypedWorkingCopyId(fooFile);
			const backupId2 = toTypedWorkingCopyId(fooFile, 'type1');
			const backupId3 = toTypedWorkingCopyId(fooFile, 'type2');

			await Promise.all([
				service.backup(backupId1),
				service.backup(backupId2),
				service.backup(backupId3)
			]);

			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 3);

			for (const backupId of [backupId1, backupId2, backupId3]) {
				const fooBackupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));
				assert.strictEqual((await fileService.exists(fooBackupPath)), true);
				assert.strictEqual((await fileService.readFile(fooBackupPath)).value.toString(), toExpectedPreamble(backupId));
				assert.ok(service.hasBackupSync(backupId));
			}
		});
	});

	suite('discardBackup', () => {

		test('joining', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.ok(service.hasBackupSync(identifier));

			let backupJoined = false;
			service.joinBackups().then(() => backupJoined = true);

			const discardBackupPromise = service.discardBackup(identifier);
			assert.strictEqual(backupJoined, false);
			await discardBackupPromise;
			assert.strictEqual(backupJoined, true);

			assert.strictEqual((await fileService.exists(backupPath)), false);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 0);
			assert.ok(!service.hasBackupSync(identifier));
		});

		test('text file', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);
			assert.ok(service.hasBackupSync(identifier));

			await service.discardBackup(identifier);
			assert.strictEqual((await fileService.exists(backupPath)), false);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 0);
			assert.ok(!service.hasBackupSync(identifier));
		});

		test('untitled file', async () => {
			const identifier = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);

			await service.discardBackup(identifier);
			assert.strictEqual((await fileService.exists(backupPath)), false);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 0);
		});

		test('multiple same resource, different type id', async () => {
			const backupId1 = toUntypedWorkingCopyId(fooFile);
			const backupId2 = toTypedWorkingCopyId(fooFile, 'type1');
			const backupId3 = toTypedWorkingCopyId(fooFile, 'type2');

			await Promise.all([
				service.backup(backupId1),
				service.backup(backupId2),
				service.backup(backupId3)
			]);

			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 3);

			for (const backupId of [backupId1, backupId2, backupId3]) {
				const backupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));
				await service.discardBackup(backupId);
				assert.strictEqual((await fileService.exists(backupPath)), false);
			}
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 0);
		});
	});

	suite('discardBackups (all)', () => {
		test('text file', async () => {
			const backupId1 = toUntypedWorkingCopyId(fooFile);
			const backupId2 = toUntypedWorkingCopyId(barFile);
			const backupId3 = toTypedWorkingCopyId(barFile);

			await service.backup(backupId1, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);

			await service.backup(backupId2, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 2);

			await service.backup(backupId3, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 3);

			await service.discardBackups();
			for (const backupId of [backupId1, backupId2, backupId3]) {
				const backupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));
				assert.strictEqual((await fileService.exists(backupPath)), false);
			}

			assert.strictEqual((await fileService.exists(joinPath(workspaceBackupPath, 'file'))), false);
		});

		test('untitled file', async () => {
			const backupId = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));

			await service.backup(backupId, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);

			await service.discardBackups();
			assert.strictEqual((await fileService.exists(backupPath)), false);
			assert.strictEqual((await fileService.exists(joinPath(workspaceBackupPath, 'untitled'))), false);
		});

		test('can backup after discarding all', async () => {
			await service.discardBackups();
			await service.backup(toUntypedWorkingCopyId(untitledFile), bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.exists(workspaceBackupPath)), true);
		});
	});

	suite('discardBackups (except some)', () => {
		test('text file', async () => {
			const backupId1 = toUntypedWorkingCopyId(fooFile);
			const backupId2 = toUntypedWorkingCopyId(barFile);
			const backupId3 = toTypedWorkingCopyId(barFile);

			await service.backup(backupId1, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 1);

			await service.backup(backupId2, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 2);

			await service.backup(backupId3, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'file'))).children?.length, 3);

			await service.discardBackups({ except: [backupId2, backupId3] });

			let backupPath = joinPath(workspaceBackupPath, backupId1.resource.scheme, hashIdentifier(backupId1));
			assert.strictEqual((await fileService.exists(backupPath)), false);

			backupPath = joinPath(workspaceBackupPath, backupId2.resource.scheme, hashIdentifier(backupId2));
			assert.strictEqual((await fileService.exists(backupPath)), true);

			backupPath = joinPath(workspaceBackupPath, backupId3.resource.scheme, hashIdentifier(backupId3));
			assert.strictEqual((await fileService.exists(backupPath)), true);

			await service.discardBackups({ except: [backupId1] });

			for (const backupId of [backupId1, backupId2, backupId3]) {
				const backupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));
				assert.strictEqual((await fileService.exists(backupPath)), false);
			}
		});

		test('untitled file', async () => {
			const backupId = toUntypedWorkingCopyId(untitledFile);
			const backupPath = joinPath(workspaceBackupPath, backupId.resource.scheme, hashIdentifier(backupId));

			await service.backup(backupId, bufferToReadable(VSBuffer.fromString('test')));
			assert.strictEqual((await fileService.exists(backupPath)), true);
			assert.strictEqual((await fileService.resolve(joinPath(workspaceBackupPath, 'untitled'))).children?.length, 1);

			await service.discardBackups({ except: [backupId] });
			assert.strictEqual((await fileService.exists(backupPath)), true);
		});
	});

	suite('getBackups', () => {
		test('text file', async () => {
			await Promise.all([
				service.backup(toUntypedWorkingCopyId(fooFile), bufferToReadable(VSBuffer.fromString('test'))),
				service.backup(toTypedWorkingCopyId(fooFile, 'type1'), bufferToReadable(VSBuffer.fromString('test'))),
				service.backup(toTypedWorkingCopyId(fooFile, 'type2'), bufferToReadable(VSBuffer.fromString('test')))
			]);

			let backups = await service.getBackups();
			assert.strictEqual(backups.length, 3);

			for (const backup of backups) {
				if (backup.typeId === '') {
					assert.strictEqual(backup.resource.toString(), fooFile.toString());
				} else if (backup.typeId === 'type1') {
					assert.strictEqual(backup.resource.toString(), fooFile.toString());
				} else if (backup.typeId === 'type2') {
					assert.strictEqual(backup.resource.toString(), fooFile.toString());
				} else {
					assert.fail('Unexpected backup');
				}
			}

			await service.backup(toUntypedWorkingCopyId(barFile), bufferToReadable(VSBuffer.fromString('test')));

			backups = await service.getBackups();
			assert.strictEqual(backups.length, 4);
		});

		test('untitled file', async () => {
			await Promise.all([
				service.backup(toUntypedWorkingCopyId(untitledFile), bufferToReadable(VSBuffer.fromString('test'))),
				service.backup(toTypedWorkingCopyId(untitledFile, 'type1'), bufferToReadable(VSBuffer.fromString('test'))),
				service.backup(toTypedWorkingCopyId(untitledFile, 'type2'), bufferToReadable(VSBuffer.fromString('test')))
			]);

			const backups = await service.getBackups();
			assert.strictEqual(backups.length, 3);

			for (const backup of backups) {
				if (backup.typeId === '') {
					assert.strictEqual(backup.resource.toString(), untitledFile.toString());
				} else if (backup.typeId === 'type1') {
					assert.strictEqual(backup.resource.toString(), untitledFile.toString());
				} else if (backup.typeId === 'type2') {
					assert.strictEqual(backup.resource.toString(), untitledFile.toString());
				} else {
					assert.fail('Unexpected backup');
				}
			}
		});
	});

	suite('resolve', () => {

		interface IBackupTestMetaData extends IWorkingCopyBackupMeta {
			mtime?: number;
			size?: number;
			etag?: string;
			orphaned?: boolean;
		}

		test('should restore the original contents (untitled file)', async () => {
			const contents = 'test\nand more stuff';

			await testResolveBackup(untitledFile, contents);
		});

		test('should restore the original contents (untitled file with metadata)', async () => {
			const contents = 'test\nand more stuff';

			const meta = {
				etag: 'the Etag',
				size: 666,
				mtime: Date.now(),
				orphaned: true
			};

			await testResolveBackup(untitledFile, contents, meta);
		});

		test('should restore the original contents (untitled file empty with metadata)', async () => {
			const contents = '';

			const meta = {
				etag: 'the Etag',
				size: 666,
				mtime: Date.now(),
				orphaned: true
			};

			await testResolveBackup(untitledFile, contents, meta);
		});

		test('should restore the original contents (untitled large file with metadata)', async () => {
			const contents = (new Array(30 * 1024)).join('Large String\n');

			const meta = {
				etag: 'the Etag',
				size: 666,
				mtime: Date.now(),
				orphaned: true
			};

			await testResolveBackup(untitledFile, contents, meta);
		});

		test('should restore the original contents (text file)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'consectetur ',
				'adipiscing ßß elit'
			].join('');

			await testResolveBackup(fooFile, contents);
		});

		test('should restore the original contents (text file - custom scheme)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'consectetur ',
				'adipiscing ßß elit'
			].join('');

			await testResolveBackup(customFile, contents);
		});

		test('should restore the original contents (text file with metadata)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooFile, contents, meta);
		});

		test('should restore the original contents (empty text file with metadata)', async () => {
			const contents = '';

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooFile, contents, meta);
		});

		test('should restore the original contents (large text file with metadata)', async () => {
			const contents = (new Array(30 * 1024)).join('Large String\n');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooFile, contents, meta);
		});

		test('should restore the original contents (text file with metadata changed once)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooFile, contents, meta);

			// Change meta and test again
			meta.size = 999;
			await testResolveBackup(fooFile, contents, meta);
		});

		test('should restore the original contents (text file with metadata and fragment URI)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(customFileWithFragment, contents, meta);
		});

		test('should restore the original contents (text file with space in name with metadata)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooBarFile, contents, meta);
		});

		test('should restore the original contents (text file with too large metadata to persist)', async () => {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: (new Array(100 * 1024)).join('Large String'),
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await testResolveBackup(fooFile, contents, meta, true);
		});

		async function testResolveBackup(resource: URI, contents: string, meta?: IBackupTestMetaData, expectNoMeta?: boolean) {
			await doTestResolveBackup(toUntypedWorkingCopyId(resource), contents, meta, expectNoMeta);
			await doTestResolveBackup(toTypedWorkingCopyId(resource), contents, meta, expectNoMeta);
		}

		async function doTestResolveBackup(identifier: IWorkingCopyIdentifier, contents: string, meta?: IBackupTestMetaData, expectNoMeta?: boolean) {
			await service.backup(identifier, bufferToReadable(VSBuffer.fromString(contents)), 1, meta);

			const backup = await service.resolve<IBackupTestMetaData>(identifier);
			assert.ok(backup);
			assert.strictEqual(contents, (await streamToBuffer(backup.value)).toString());

			if (expectNoMeta || !meta) {
				assert.strictEqual(backup.meta, undefined);
			} else {
				assert.ok(backup.meta);
				assert.strictEqual(backup.meta.etag, meta.etag);
				assert.strictEqual(backup.meta.size, meta.size);
				assert.strictEqual(backup.meta.mtime, meta.mtime);
				assert.strictEqual(backup.meta.orphaned, meta.orphaned);

				assert.strictEqual(Object.keys(meta).length, Object.keys(backup.meta).length);
			}
		}

		test('should restore the original contents (text file with broken metadata)', async () => {
			await testShouldRestoreOriginalContentsWithBrokenBackup(toUntypedWorkingCopyId(fooFile));
			await testShouldRestoreOriginalContentsWithBrokenBackup(toTypedWorkingCopyId(fooFile));
		});

		async function testShouldRestoreOriginalContentsWithBrokenBackup(identifier: IWorkingCopyIdentifier): Promise<void> {
			const contents = [
				'Lorem ipsum ',
				'dolor öäü sit amet ',
				'adipiscing ßß elit',
				'consectetur '
			].join('');

			const meta = {
				etag: 'theEtag',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString(contents)), 1, meta);

			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			const fileContents = (await fileService.readFile(backupPath)).value.toString();
			assert.strictEqual(fileContents.indexOf(identifier.resource.toString()), 0);

			const metaIndex = fileContents.indexOf('{');
			const newFileContents = fileContents.substring(0, metaIndex) + '{{' + fileContents.substr(metaIndex);
			await fileService.writeFile(backupPath, VSBuffer.fromString(newFileContents));

			const backup = await service.resolve(identifier);
			assert.ok(backup);
			assert.strictEqual(contents, (await streamToBuffer(backup.value)).toString());
			assert.strictEqual(backup.meta, undefined);
		}

		test('should update metadata from file into model when resolving', async () => {
			await testShouldUpdateMetaFromFileWhenResolving(toUntypedWorkingCopyId(fooFile));
			await testShouldUpdateMetaFromFileWhenResolving(toTypedWorkingCopyId(fooFile));
		});

		async function testShouldUpdateMetaFromFileWhenResolving(identifier: IWorkingCopyIdentifier): Promise<void> {
			const contents = 'Foo Bar';

			const meta = {
				etag: 'theEtagForThisMetadataTest',
				size: 888,
				mtime: Date.now(),
				orphaned: false
			};

			const updatedMeta = {
				...meta,
				etag: meta.etag + meta.etag
			};

			await service.backup(identifier, bufferToReadable(VSBuffer.fromString(contents)), 1, meta);

			const backupPath = joinPath(workspaceBackupPath, identifier.resource.scheme, hashIdentifier(identifier));

			// Simulate the condition of the backups model loading initially without
			// meta data information and then getting the meta data updated on the
			// first call to resolve the backup. We simulate this by explicitly changing
			// the meta data in the file and then verifying that the updated meta data
			// is persisted back into the model (verified via `hasBackupSync`).
			// This is not really something that would happen in real life because any
			// backup that is made via backup service will update the model accordingly.

			const originalFileContents = (await fileService.readFile(backupPath)).value.toString();
			await fileService.writeFile(backupPath, VSBuffer.fromString(originalFileContents.replace(meta.etag, updatedMeta.etag)));

			await service.resolve(identifier);

			assert.strictEqual(service.hasBackupSync(identifier, undefined, meta), false);
			assert.strictEqual(service.hasBackupSync(identifier, undefined, updatedMeta), true);

			await fileService.writeFile(backupPath, VSBuffer.fromString(originalFileContents));

			await service.getBackups();

			assert.strictEqual(service.hasBackupSync(identifier, undefined, meta), true);
			assert.strictEqual(service.hasBackupSync(identifier, undefined, updatedMeta), false);
		}

		test('should ignore invalid backups (empty file)', async () => {
			const contents = 'test\nand more stuff';

			await service.backup(toUntypedWorkingCopyId(fooFile), bufferToReadable(VSBuffer.fromString(contents)), 1);

			let backup = await service.resolve(toUntypedWorkingCopyId(fooFile));
			assert.ok(backup);

			await service.testGetFileService().writeFile(service.toBackupResource(toUntypedWorkingCopyId(fooFile)), VSBuffer.fromString(''));

			backup = await service.resolve<IBackupTestMetaData>(toUntypedWorkingCopyId(fooFile));
			assert.ok(!backup);
		});

		test('should ignore invalid backups (no preamble)', async () => {
			const contents = 'testand more stuff';

			await service.backup(toUntypedWorkingCopyId(fooFile), bufferToReadable(VSBuffer.fromString(contents)), 1);

			let backup = await service.resolve(toUntypedWorkingCopyId(fooFile));
			assert.ok(backup);

			await service.testGetFileService().writeFile(service.toBackupResource(toUntypedWorkingCopyId(fooFile)), VSBuffer.fromString(contents));

			backup = await service.resolve<IBackupTestMetaData>(toUntypedWorkingCopyId(fooFile));
			assert.ok(!backup);
		});

		test('file with binary data', async () => {
			const identifier = toUntypedWorkingCopyId(fooFile);

			const buffer = Uint8Array.from([
				137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 73, 0, 0, 0, 67, 8, 2, 0, 0, 0, 95, 138, 191, 237, 0, 0, 0, 1, 115, 82, 71, 66, 0, 174, 206, 28, 233, 0, 0, 0, 4, 103, 65, 77, 65, 0, 0, 177, 143, 11, 252, 97, 5, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 14, 195, 0, 0, 14, 195, 1, 199, 111, 168, 100, 0, 0, 0, 71, 116, 69, 88, 116, 83, 111, 117, 114, 99, 101, 0, 83, 104, 111, 116, 116, 121, 32, 118, 50, 46, 48, 46, 50, 46, 50, 49, 54, 32, 40, 67, 41, 32, 84, 104, 111, 109, 97, 115, 32, 66, 97, 117, 109, 97, 110, 110, 32, 45, 32, 104, 116, 116, 112, 58, 47, 47, 115, 104, 111, 116, 116, 121, 46, 100, 101, 118, 115, 45, 111, 110, 46, 110, 101, 116, 44, 132, 21, 213, 0, 0, 0, 84, 73, 68, 65, 84, 120, 218, 237, 207, 65, 17, 0, 0, 12, 2, 32, 211, 217, 63, 146, 37, 246, 218, 65, 3, 210, 191, 226, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 230, 118, 100, 169, 4, 173, 8, 44, 248, 184, 40, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
			]);

			await service.backup(identifier, bufferToReadable(VSBuffer.wrap(buffer)), undefined, { binaryTest: 'true' });

			const backup = await service.resolve(toUntypedWorkingCopyId(fooFile));
			assert.ok(backup);

			const backupBuffer = await consumeStream(backup.value, chunks => VSBuffer.concat(chunks));
			assert.strictEqual(backupBuffer.buffer.byteLength, buffer.byteLength);
		});
	});

	suite('WorkingCopyBackupsModel', () => {

		test('simple', async () => {
			const model = await WorkingCopyBackupsModel.create(workspaceBackupPath, service.testGetFileService());

			const resource1 = URI.file('test.html');

			assert.strictEqual(model.has(resource1), false);

			model.add(resource1);

			assert.strictEqual(model.has(resource1), true);
			assert.strictEqual(model.has(resource1, 0), true);
			assert.strictEqual(model.has(resource1, 1), false);
			assert.strictEqual(model.has(resource1, 1, { foo: 'bar' }), false);

			model.remove(resource1);

			assert.strictEqual(model.has(resource1), false);

			model.add(resource1);

			assert.strictEqual(model.has(resource1), true);
			assert.strictEqual(model.has(resource1, 0), true);
			assert.strictEqual(model.has(resource1, 1), false);

			model.clear();

			assert.strictEqual(model.has(resource1), false);

			model.add(resource1, 1);

			assert.strictEqual(model.has(resource1), true);
			assert.strictEqual(model.has(resource1, 0), false);
			assert.strictEqual(model.has(resource1, 1), true);

			const resource2 = URI.file('test1.html');
			const resource3 = URI.file('test2.html');
			const resource4 = URI.file('test3.html');

			model.add(resource2);
			model.add(resource3);
			model.add(resource4, undefined, { foo: 'bar' });

			assert.strictEqual(model.has(resource1), true);
			assert.strictEqual(model.has(resource2), true);
			assert.strictEqual(model.has(resource3), true);

			assert.strictEqual(model.has(resource4), true);
			assert.strictEqual(model.has(resource4, undefined, { foo: 'bar' }), true);
			assert.strictEqual(model.has(resource4, undefined, { bar: 'foo' }), false);

			model.update(resource4, { foo: 'nothing' });
			assert.strictEqual(model.has(resource4, undefined, { foo: 'nothing' }), true);
			assert.strictEqual(model.has(resource4, undefined, { foo: 'bar' }), false);

			model.update(resource4);
			assert.strictEqual(model.has(resource4), true);
			assert.strictEqual(model.has(resource4, undefined, { foo: 'nothing' }), false);
		});

		test('create', async () => {
			const fooBackupPath = joinPath(workspaceBackupPath, fooFile.scheme, hashIdentifier(toUntypedWorkingCopyId(fooFile)));
			await fileService.createFolder(dirname(fooBackupPath));
			await fileService.writeFile(fooBackupPath, VSBuffer.fromString('foo'));
			const model = await WorkingCopyBackupsModel.create(workspaceBackupPath, service.testGetFileService());

			assert.strictEqual(model.has(fooBackupPath), true);
		});

		test('get', async () => {
			const model = await WorkingCopyBackupsModel.create(workspaceBackupPath, service.testGetFileService());

			assert.deepStrictEqual(model.get(), []);

			const file1 = URI.file('/root/file/foo.html');
			const file2 = URI.file('/root/file/bar.html');
			const untitled = URI.file('/root/untitled/bar.html');

			model.add(file1);
			model.add(file2);
			model.add(untitled);

			assert.deepStrictEqual(model.get().map(f => f.fsPath), [file1.fsPath, file2.fsPath, untitled.fsPath]);
		});
	});

	suite('typeId migration', () => {

		test('works (when meta is missing)', async () => {
			const fooBackupId = toUntypedWorkingCopyId(fooFile);
			const untitledBackupId = toUntypedWorkingCopyId(untitledFile);
			const customBackupId = toUntypedWorkingCopyId(customFile);

			const fooBackupPath = joinPath(workspaceBackupPath, fooFile.scheme, hashIdentifier(fooBackupId));
			const untitledBackupPath = joinPath(workspaceBackupPath, untitledFile.scheme, hashIdentifier(untitledBackupId));
			const customFileBackupPath = joinPath(workspaceBackupPath, customFile.scheme, hashIdentifier(customBackupId));

			// Prepare backups of the old format without meta
			await fileService.createFolder(joinPath(workspaceBackupPath, fooFile.scheme));
			await fileService.createFolder(joinPath(workspaceBackupPath, untitledFile.scheme));
			await fileService.createFolder(joinPath(workspaceBackupPath, customFile.scheme));
			await fileService.writeFile(fooBackupPath, VSBuffer.fromString(`${fooFile.toString()}\ntest file`));
			await fileService.writeFile(untitledBackupPath, VSBuffer.fromString(`${untitledFile.toString()}\ntest untitled`));
			await fileService.writeFile(customFileBackupPath, VSBuffer.fromString(`${customFile.toString()}\ntest custom`));

			service.reinitialize(workspaceBackupPath);

			const backups = await service.getBackups();
			assert.strictEqual(backups.length, 3);
			assert.ok(backups.some(backup => isEqual(backup.resource, fooFile)));
			assert.ok(backups.some(backup => isEqual(backup.resource, untitledFile)));
			assert.ok(backups.some(backup => isEqual(backup.resource, customFile)));
			assert.ok(backups.every(backup => backup.typeId === ''));
		});

		test('works (when typeId in meta is missing)', async () => {
			const fooBackupId = toUntypedWorkingCopyId(fooFile);
			const untitledBackupId = toUntypedWorkingCopyId(untitledFile);
			const customBackupId = toUntypedWorkingCopyId(customFile);

			const fooBackupPath = joinPath(workspaceBackupPath, fooFile.scheme, hashIdentifier(fooBackupId));
			const untitledBackupPath = joinPath(workspaceBackupPath, untitledFile.scheme, hashIdentifier(untitledBackupId));
			const customFileBackupPath = joinPath(workspaceBackupPath, customFile.scheme, hashIdentifier(customBackupId));

			// Prepare backups of the old format without meta
			await fileService.createFolder(joinPath(workspaceBackupPath, fooFile.scheme));
			await fileService.createFolder(joinPath(workspaceBackupPath, untitledFile.scheme));
			await fileService.createFolder(joinPath(workspaceBackupPath, customFile.scheme));
			await fileService.writeFile(fooBackupPath, VSBuffer.fromString(`${fooFile.toString()} ${JSON.stringify({ foo: 'bar' })}\ntest file`));
			await fileService.writeFile(untitledBackupPath, VSBuffer.fromString(`${untitledFile.toString()} ${JSON.stringify({ foo: 'bar' })}\ntest untitled`));
			await fileService.writeFile(customFileBackupPath, VSBuffer.fromString(`${customFile.toString()} ${JSON.stringify({ foo: 'bar' })}\ntest custom`));

			service.reinitialize(workspaceBackupPath);

			const backups = await service.getBackups();
			assert.strictEqual(backups.length, 3);
			assert.ok(backups.some(backup => isEqual(backup.resource, fooFile)));
			assert.ok(backups.some(backup => isEqual(backup.resource, untitledFile)));
			assert.ok(backups.some(backup => isEqual(backup.resource, customFile)));
			assert.ok(backups.every(backup => backup.typeId === ''));
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyBackupTracker.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyBackupTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isMacintosh, isWindows } from '../../../../../base/common/platform.js';
import { join } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { hash } from '../../../../../base/common/hash.js';
import { NativeWorkingCopyBackupTracker } from '../../electron-browser/workingCopyBackupTracker.js';
import { TextFileEditorModelManager } from '../../../textfile/common/textFileEditorModelManager.js';
import { IEditorService } from '../../../editor/common/editorService.js';
import { EditorPart } from '../../../../browser/parts/editor/editorPart.js';
import { IEditorGroupsService } from '../../../editor/common/editorGroupsService.js';
import { EditorService } from '../../../editor/browser/editorService.js';
import { IWorkingCopyBackupService } from '../../common/workingCopyBackup.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IFilesConfigurationService } from '../../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyService } from '../../common/workingCopyService.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { HotExitConfiguration } from '../../../../../platform/files/common/files.js';
import { ShutdownReason, ILifecycleService } from '../../../lifecycle/common/lifecycle.js';
import { IFileDialogService, ConfirmResult, IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { INativeHostService } from '../../../../../platform/native/common/native.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { createEditorPart, registerTestFileEditor, TestBeforeShutdownEvent, TestEnvironmentService, TestFilesConfigurationService, TestFileService, TestTextResourceConfigurationService, workbenchTeardown } from '../../../../test/browser/workbenchTestServices.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { TestWorkspace, Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { IProgressService } from '../../../../../platform/progress/common/progress.js';
import { IWorkingCopyEditorService } from '../../common/workingCopyEditorService.js';
import { TestContextService, TestMarkerService, TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IWorkingCopyBackup, WorkingCopyCapabilities } from '../../common/workingCopy.js';
import { Event, Emitter } from '../../../../../base/common/event.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { Schemas } from '../../../../../base/common/network.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { TestServiceAccessor, workbenchInstantiationService } from '../../../../test/electron-browser/workbenchTestServices.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';

suite('WorkingCopyBackupTracker (native)', function () {

	class TestWorkingCopyBackupTracker extends NativeWorkingCopyBackupTracker {

		constructor(
			@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
			@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
			@IWorkingCopyService workingCopyService: IWorkingCopyService,
			@ILifecycleService lifecycleService: ILifecycleService,
			@IFileDialogService fileDialogService: IFileDialogService,
			@IDialogService dialogService: IDialogService,
			@IWorkspaceContextService contextService: IWorkspaceContextService,
			@INativeHostService nativeHostService: INativeHostService,
			@ILogService logService: ILogService,
			@IEditorService editorService: IEditorService,
			@IEnvironmentService environmentService: IEnvironmentService,
			@IProgressService progressService: IProgressService,
			@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
			@IEditorGroupsService editorGroupService: IEditorGroupsService
		) {
			super(workingCopyBackupService, filesConfigurationService, workingCopyService, lifecycleService, fileDialogService, dialogService, contextService, nativeHostService, logService, environmentService, progressService, workingCopyEditorService, editorService, editorGroupService);
		}

		protected override getBackupScheduleDelay(): number {
			return 10; // Reduce timeout for tests
		}

		waitForReady(): Promise<void> {
			return this.whenReady;
		}

		get pendingBackupOperationCount(): number { return this.pendingBackupOperations.size; }

		override dispose() {
			super.dispose();

			for (const [_, pending] of this.pendingBackupOperations) {
				pending.cancel();
				pending.disposable.dispose();
			}
		}

		private readonly _onDidResume = this._register(new Emitter<void>());
		readonly onDidResume = this._onDidResume.event;

		private readonly _onDidSuspend = this._register(new Emitter<void>());
		readonly onDidSuspend = this._onDidSuspend.event;

		protected override suspendBackupOperations(): { resume: () => void } {
			const { resume } = super.suspendBackupOperations();

			this._onDidSuspend.fire();

			return {
				resume: () => {
					resume();

					this._onDidResume.fire();
				}
			};
		}
	}

	let testDir: URI;
	let backupHome: URI;
	let workspaceBackupPath: URI;

	let accessor: TestServiceAccessor;

	const disposables = new DisposableStore();

	setup(async () => {
		testDir = URI.file(join(generateUuid(), 'vsctests', 'workingcopybackuptracker')).with({ scheme: Schemas.inMemory });
		backupHome = joinPath(testDir, 'Backups');
		const workspacesJsonPath = joinPath(backupHome, 'workspaces.json');

		const workspaceResource = URI.file(isWindows ? 'c:\\workspace' : '/workspace').with({ scheme: Schemas.inMemory });
		workspaceBackupPath = joinPath(backupHome, hash(workspaceResource.toString()).toString(16));

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add((<TextFileEditorModelManager>accessor.textFileService.files));

		disposables.add(registerTestFileEditor());

		await accessor.fileService.createFolder(backupHome);
		await accessor.fileService.createFolder(workspaceBackupPath);

		return accessor.fileService.writeFile(workspacesJsonPath, VSBuffer.fromString(''));
	});

	teardown(() => {
		disposables.clear();
	});

	async function createTracker(autoSaveEnabled = false): Promise<{ accessor: TestServiceAccessor; part: EditorPart; tracker: TestWorkingCopyBackupTracker; instantiationService: IInstantiationService; cleanup: () => Promise<void> }> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const configurationService = new TestConfigurationService();
		if (autoSaveEnabled) {
			configurationService.setUserConfiguration('files', { autoSave: 'afterDelay', autoSaveDelay: 1 });
		} else {
			configurationService.setUserConfiguration('files', { autoSave: 'off', autoSaveDelay: 1 });
		}
		instantiationService.stub(IConfigurationService, configurationService);

		instantiationService.stub(IFilesConfigurationService, disposables.add(new TestFilesConfigurationService(
			<IContextKeyService>instantiationService.createInstance(MockContextKeyService),
			configurationService,
			new TestContextService(TestWorkspace),
			TestEnvironmentService,
			disposables.add(new UriIdentityService(disposables.add(new TestFileService()))),
			disposables.add(new TestFileService()),
			new TestMarkerService(),
			new TestTextResourceConfigurationService(configurationService)
		)));

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService: EditorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		accessor = instantiationService.createInstance(TestServiceAccessor);

		const tracker = instantiationService.createInstance(TestWorkingCopyBackupTracker);

		const cleanup = async () => {
			await accessor.workingCopyBackupService.waitForAllBackups(); // File changes could also schedule some backup operations so we need to wait for them before finishing the test

			await workbenchTeardown(instantiationService);

			part.dispose();
			tracker.dispose();
		};

		return { accessor, part, tracker, instantiationService, cleanup };
	}

	test('Track backups (file, auto save off)', function () {
		return trackBackupsTest(toResource.call(this, '/path/index.txt'), false);
	});

	test('Track backups (file, auto save on)', function () {
		return trackBackupsTest(toResource.call(this, '/path/index.txt'), true);
	});

	async function trackBackupsTest(resource: URI, autoSave: boolean) {
		const { accessor, cleanup } = await createTracker(autoSave);

		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const fileModel = accessor.textFileService.files.get(resource);
		assert.ok(fileModel);
		fileModel.textEditorModel?.setValue('Super Good');

		await accessor.workingCopyBackupService.joinBackupResource();

		assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(fileModel), true);

		fileModel.dispose();

		await accessor.workingCopyBackupService.joinDiscardBackup();

		assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(fileModel), false);

		await cleanup();
	}

	test('onWillShutdown - no veto if no dirty files', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);

		await cleanup();
	});

	test('onWillShutdown - veto if user cancels (hot.exit: off)', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const model = accessor.textFileService.files.get(resource);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);
		accessor.filesConfigurationService.testOnFilesConfigurationChange({ files: { hotExit: 'off' } });

		await model?.resolve();
		model?.textEditorModel?.setValue('foo');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);

		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(veto);

		await cleanup();
	});

	test('onWillShutdown - no veto if auto save is on', async function () {
		const { accessor, cleanup } = await createTracker(true /* auto save enabled */);

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const model = accessor.textFileService.files.get(resource);

		await model?.resolve();
		model?.textEditorModel?.setValue('foo');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);

		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 0);

		await cleanup();
	});

	test('onWillShutdown - no veto and backups cleaned up if user does not want to save (hot.exit: off)', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const model = accessor.textFileService.files.get(resource);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.DONT_SAVE);
		accessor.filesConfigurationService.testOnFilesConfigurationChange({ files: { hotExit: 'off' } });

		await model?.resolve();
		model?.textEditorModel?.setValue('foo');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);
		assert.ok(accessor.workingCopyBackupService.discardedBackups.length > 0);

		await cleanup();
	});

	test('onWillShutdown - no backups discarded when shutdown without dirty but tracker not ready', async function () {
		const { accessor, cleanup } = await createTracker();

		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);
		assert.ok(!accessor.workingCopyBackupService.discardedAllBackups);

		await cleanup();
	});

	test('onWillShutdown - backups discarded when shutdown without dirty', async function () {
		const { accessor, tracker, cleanup } = await createTracker();

		await tracker.waitForReady();

		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);
		assert.ok(accessor.workingCopyBackupService.discardedAllBackups);

		await cleanup();
	});

	test('onWillShutdown - save (hot.exit: off)', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const model = accessor.textFileService.files.get(resource);

		accessor.fileDialogService.setConfirmResult(ConfirmResult.SAVE);
		accessor.filesConfigurationService.testOnFilesConfigurationChange({ files: { hotExit: 'off' } });

		await model?.resolve();
		model?.textEditorModel?.setValue('foo');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		const event = new TestBeforeShutdownEvent();
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(!veto);
		assert.ok(!model?.isDirty());

		await cleanup();
	});

	test('onWillShutdown - veto if backup fails', async function () {
		const { accessor, cleanup } = await createTracker();

		class TestBackupWorkingCopy extends TestWorkingCopy {

			constructor(resource: URI) {
				super(resource);

				this._register(accessor.workingCopyService.registerWorkingCopy(this));
			}

			override async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
				throw new Error('unable to backup');
			}
		}

		const resource = toResource.call(this, '/path/custom.txt');
		const customWorkingCopy = disposables.add(new TestBackupWorkingCopy(resource));
		customWorkingCopy.setDirty(true);

		const event = new TestBeforeShutdownEvent();
		event.reason = ShutdownReason.QUIT;
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(veto);

		const finalVeto = await event.finalValue?.();
		assert.ok(finalVeto); // assert the tracker uses the internal finalVeto API

		await cleanup();
	});

	test('onWillShutdown - scratchpads - veto if backup fails', async function () {
		const { accessor, cleanup } = await createTracker();

		class TestBackupWorkingCopy extends TestWorkingCopy {

			constructor(resource: URI) {
				super(resource);

				this._register(accessor.workingCopyService.registerWorkingCopy(this));
			}

			override capabilities = WorkingCopyCapabilities.Untitled | WorkingCopyCapabilities.Scratchpad;

			override async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
				throw new Error('unable to backup');
			}

			override isDirty(): boolean {
				return false;
			}

			override isModified(): boolean {
				return true;
			}
		}

		const resource = toResource.call(this, '/path/custom.txt');
		disposables.add(new TestBackupWorkingCopy(resource));

		const event = new TestBeforeShutdownEvent();
		event.reason = ShutdownReason.QUIT;
		accessor.lifecycleService.fireBeforeShutdown(event);

		const veto = await event.value;
		assert.ok(veto);

		const finalVeto = await event.finalValue?.();
		assert.ok(finalVeto); // assert the tracker uses the internal finalVeto API

		await cleanup();
	});

	test('onWillShutdown - pending backup operations canceled and tracker suspended/resumsed', async function () {
		const { accessor, tracker, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { pinned: true } });

		const model = accessor.textFileService.files.get(resource);

		await model?.resolve();
		model?.textEditorModel?.setValue('foo');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);

		const onSuspend = Event.toPromise(tracker.onDidSuspend);

		const event = new TestBeforeShutdownEvent();
		event.reason = ShutdownReason.QUIT;
		accessor.lifecycleService.fireBeforeShutdown(event);

		await onSuspend;

		assert.strictEqual(tracker.pendingBackupOperationCount, 0);

		// Ops are suspended during shutdown!
		model?.textEditorModel?.setValue('bar');
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(tracker.pendingBackupOperationCount, 0);

		const onResume = Event.toPromise(tracker.onDidResume);
		await event.value;

		// Ops are resumed after shutdown!
		model?.textEditorModel?.setValue('foo');
		await onResume;
		assert.strictEqual(tracker.pendingBackupOperationCount, 1);

		await cleanup();
	});

	suite('Hot Exit', () => {
		suite('"onExit" setting', () => {
			test('should hot exit on non-Mac (reason: CLOSE, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, false, true, !!isMacintosh);
			});
			test('should hot exit on non-Mac (reason: CLOSE, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, false, false, !!isMacintosh);
			});
			test('should NOT hot exit (reason: CLOSE, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, true, true, true);
			});
			test('should NOT hot exit (reason: CLOSE, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, true, false, true);
			});
			test('should hot exit (reason: QUIT, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, false, true, false);
			});
			test('should hot exit (reason: QUIT, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, false, false, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, true, true, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, true, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, false, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, false, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, true, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, true, false, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, false, true, true);
			});
			test('should NOT hot exit (reason: LOAD, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, false, false, true);
			});
			test('should NOT hot exit (reason: LOAD, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, true, true, true);
			});
			test('should NOT hot exit (reason: LOAD, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, true, false, true);
			});
		});

		suite('"onExitAndWindowClose" setting', () => {
			test('should hot exit (reason: CLOSE, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, false, true, false);
			});
			test('should hot exit (reason: CLOSE, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, false, false, !!isMacintosh);
			});
			test('should hot exit (reason: CLOSE, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, true, true, false);
			});
			test('should NOT hot exit (reason: CLOSE, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, true, false, true);
			});
			test('should hot exit (reason: QUIT, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, false, true, false);
			});
			test('should hot exit (reason: QUIT, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, false, false, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, true, true, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, true, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, false, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, false, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, true, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, true, false, false);
			});
			test('should hot exit (reason: LOAD, windows: single, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, false, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: single, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, false, false, true);
			});
			test('should hot exit (reason: LOAD, windows: multiple, workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, true, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: multiple, empty workspace)', function () {
				return hotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, true, false, true);
			});
		});

		suite('"onExit" setting - scratchpad', () => {
			test('should hot exit (reason: CLOSE, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, false, true, false);
			});
			test('should hot exit (reason: CLOSE, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, false, false, !!isMacintosh);
			});
			test('should hot exit (reason: CLOSE, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, true, true, false);
			});
			test('should NOT hot exit (reason: CLOSE, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.CLOSE, true, false, true);
			});
			test('should hot exit (reason: QUIT, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, false, true, false);
			});
			test('should hot exit (reason: QUIT, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, false, false, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, true, true, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.QUIT, true, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, false, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, false, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, true, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.RELOAD, true, false, false);
			});
			test('should hot exit (reason: LOAD, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, false, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, false, false, true);
			});
			test('should hot exit (reason: LOAD, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, true, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT, ShutdownReason.LOAD, true, false, true);
			});
		});

		suite('"onExitAndWindowClose" setting - scratchpad', () => {
			test('should hot exit (reason: CLOSE, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, false, true, false);
			});
			test('should hot exit (reason: CLOSE, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, false, false, !!isMacintosh);
			});
			test('should hot exit (reason: CLOSE, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, true, true, false);
			});
			test('should NOT hot exit (reason: CLOSE, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.CLOSE, true, false, true);
			});
			test('should hot exit (reason: QUIT, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, false, true, false);
			});
			test('should hot exit (reason: QUIT, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, false, false, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, true, true, false);
			});
			test('should hot exit (reason: QUIT, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.QUIT, true, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, false, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, false, false, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, true, true, false);
			});
			test('should hot exit (reason: RELOAD, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.RELOAD, true, false, false);
			});
			test('should hot exit (reason: LOAD, windows: single, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, false, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: single, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, false, false, true);
			});
			test('should hot exit (reason: LOAD, windows: multiple, workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, true, true, false);
			});
			test('should NOT hot exit (reason: LOAD, windows: multiple, empty workspace)', function () {
				return scratchpadHotExitTest.call(this, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE, ShutdownReason.LOAD, true, false, true);
			});
		});


		async function hotExitTest(this: any, setting: string, shutdownReason: ShutdownReason, multipleWindows: boolean, workspace: boolean, shouldVeto: boolean): Promise<void> {
			const { accessor, cleanup } = await createTracker();

			const resource = toResource.call(this, '/path/index.txt');
			await accessor.editorService.openEditor({ resource, options: { pinned: true } });

			const model = accessor.textFileService.files.get(resource);

			// Set hot exit config
			accessor.filesConfigurationService.testOnFilesConfigurationChange({ files: { hotExit: setting } });

			// Set empty workspace if required
			if (!workspace) {
				accessor.contextService.setWorkspace(new Workspace('empty:1508317022751'));
			}

			// Set multiple windows if required
			if (multipleWindows) {
				accessor.nativeHostService.windowCount = Promise.resolve(2);
			}

			// Set cancel to force a veto if hot exit does not trigger
			accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);

			await model?.resolve();
			model?.textEditorModel?.setValue('foo');
			assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);

			const event = new TestBeforeShutdownEvent();
			event.reason = shutdownReason;
			accessor.lifecycleService.fireBeforeShutdown(event);

			const veto = await event.value;
			assert.ok(typeof event.finalValue === 'function'); // assert the tracker uses the internal finalVeto API
			assert.strictEqual(accessor.workingCopyBackupService.discardedBackups.length, 0); // When hot exit is set, backups should never be cleaned since the confirm result is cancel
			assert.strictEqual(veto, shouldVeto);

			await cleanup();
		}

		async function scratchpadHotExitTest(this: any, setting: string, shutdownReason: ShutdownReason, multipleWindows: boolean, workspace: boolean, shouldVeto: boolean): Promise<void> {
			const { accessor, cleanup } = await createTracker();

			class TestBackupWorkingCopy extends TestWorkingCopy {

				constructor(resource: URI) {
					super(resource);

					this._register(accessor.workingCopyService.registerWorkingCopy(this));
				}

				override capabilities = WorkingCopyCapabilities.Untitled | WorkingCopyCapabilities.Scratchpad;

				override isDirty(): boolean {
					return false;
				}

				override isModified(): boolean {
					return true;
				}
			}

			// Set hot exit config
			accessor.filesConfigurationService.testOnFilesConfigurationChange({ files: { hotExit: setting } });

			// Set empty workspace if required
			if (!workspace) {
				accessor.contextService.setWorkspace(new Workspace('empty:1508317022751'));
			}

			// Set multiple windows if required
			if (multipleWindows) {
				accessor.nativeHostService.windowCount = Promise.resolve(2);
			}

			// Set cancel to force a veto if hot exit does not trigger
			accessor.fileDialogService.setConfirmResult(ConfirmResult.CANCEL);

			const resource = toResource.call(this, '/path/custom.txt');
			disposables.add(new TestBackupWorkingCopy(resource));

			const event = new TestBeforeShutdownEvent();
			event.reason = shutdownReason;
			accessor.lifecycleService.fireBeforeShutdown(event);

			const veto = await event.value;
			assert.ok(typeof event.finalValue === 'function'); // assert the tracker uses the internal finalVeto API
			assert.strictEqual(accessor.workingCopyBackupService.discardedBackups.length, 0); // When hot exit is set, backups should never be cleaned since the confirm result is cancel
			assert.strictEqual(veto, shouldVeto);

			await cleanup();
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````

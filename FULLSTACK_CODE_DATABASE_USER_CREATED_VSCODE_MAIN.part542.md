---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 542
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 542 of 552)

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

---[FILE: src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyHistoryService.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyHistoryService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestContextService, TestStorageService, TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IWorkingCopyHistoryEntry, IWorkingCopyHistoryEntryDescriptor, IWorkingCopyHistoryEvent } from '../../common/workingCopyHistory.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { LabelService } from '../../../label/common/labelService.js';
import { TestEnvironmentService, TestLifecycleService, TestPathService, TestRemoteAgentService, TestWillShutdownEvent } from '../../../../test/browser/workbenchTestServices.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NativeWorkingCopyHistoryService } from '../../common/workingCopyHistoryService.js';
import { joinPath, dirname, basename } from '../../../../../base/common/resources.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { join } from '../../../../../base/common/path.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

export class TestWorkingCopyHistoryService extends NativeWorkingCopyHistoryService {

	readonly _fileService: IFileService;
	readonly _configurationService: TestConfigurationService;
	readonly _lifecycleService: TestLifecycleService;

	constructor(disposables: DisposableStore, fileService?: IFileService) {
		const environmentService = TestEnvironmentService;
		const logService = new NullLogService();

		if (!fileService) {
			fileService = disposables.add(new FileService(logService));
			disposables.add(fileService.registerProvider(Schemas.inMemory, disposables.add(new InMemoryFileSystemProvider())));
			disposables.add(fileService.registerProvider(Schemas.vscodeUserData, disposables.add(new InMemoryFileSystemProvider())));
		}

		const remoteAgentService = new TestRemoteAgentService();
		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		const lifecycleService = disposables.add(new TestLifecycleService());
		const labelService = disposables.add(new LabelService(environmentService, new TestContextService(), new TestPathService(), new TestRemoteAgentService(), disposables.add(new TestStorageService()), lifecycleService));
		const configurationService = new TestConfigurationService();

		super(fileService, remoteAgentService, environmentService, uriIdentityService, labelService, lifecycleService, logService, configurationService);

		this._fileService = fileService;
		this._configurationService = configurationService;
		this._lifecycleService = lifecycleService;
	}
}

suite('WorkingCopyHistoryService', () => {

	const disposables = new DisposableStore();

	let testDir: URI;
	let historyHome: URI;
	let workHome: URI;
	let service: TestWorkingCopyHistoryService;
	let fileService: IFileService;

	let testFile1Path: URI;
	let testFile2Path: URI;
	let testFile3Path: URI;

	const testFile1PathContents = 'Hello Foo';
	const testFile2PathContents = [
		'Lorem ipsum ',
		'dolor öäü sit amet ',
		'adipiscing ßß elit',
		'consectetur '
	].join('');
	const testFile3PathContents = 'Hello Bar';

	setup(async () => {
		testDir = URI.file(join(generateUuid(), 'vsctests', 'workingcopyhistoryservice')).with({ scheme: Schemas.inMemory });
		historyHome = joinPath(testDir, 'User', 'History');
		workHome = joinPath(testDir, 'work');

		service = disposables.add(new TestWorkingCopyHistoryService(disposables));
		fileService = service._fileService;

		await fileService.createFolder(historyHome);
		await fileService.createFolder(workHome);

		testFile1Path = joinPath(workHome, 'foo.txt');
		testFile2Path = joinPath(workHome, 'bar.txt');
		testFile3Path = joinPath(workHome, 'foo-bar.txt');

		await fileService.writeFile(testFile1Path, VSBuffer.fromString(testFile1PathContents));
		await fileService.writeFile(testFile2Path, VSBuffer.fromString(testFile2PathContents));
		await fileService.writeFile(testFile3Path, VSBuffer.fromString(testFile3PathContents));
	});

	let increasingTimestampCounter = 1;

	async function addEntry(descriptor: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken, expectEntryAdded?: boolean): Promise<IWorkingCopyHistoryEntry>;
	async function addEntry(descriptor: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken, expectEntryAdded: false): Promise<IWorkingCopyHistoryEntry | undefined>;
	async function addEntry(descriptor: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken, expectEntryAdded = true): Promise<IWorkingCopyHistoryEntry | undefined> {
		const entry = await service.addEntry({
			...descriptor,
			timestamp: increasingTimestampCounter++ // very important to get tests to not be flaky with stable sort order
		}, token);

		if (expectEntryAdded) {
			assert.ok(entry, 'Unexpected undefined local history entry');
			assert.strictEqual((await fileService.exists(entry.location)), true, 'Unexpected local history not stored');
		}

		return entry;
	}

	teardown(() => {
		disposables.clear();
	});

	test('addEntry', async () => {
		const addEvents: IWorkingCopyHistoryEvent[] = [];
		disposables.add(service.onDidAddEntry(e => addEvents.push(e)));

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		// Add Entry works

		const entry1A = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		const entry2A = await addEntry({ resource: workingCopy2.resource, source: 'My Source' }, CancellationToken.None);

		assert.strictEqual((await fileService.readFile(entry1A.location)).value.toString(), testFile1PathContents);
		assert.strictEqual((await fileService.readFile(entry2A.location)).value.toString(), testFile2PathContents);

		assert.strictEqual(addEvents.length, 2);
		assert.strictEqual(addEvents[0].entry.workingCopy.resource.toString(), workingCopy1.resource.toString());
		assert.strictEqual(addEvents[1].entry.workingCopy.resource.toString(), workingCopy2.resource.toString());
		assert.strictEqual(addEvents[1].entry.source, 'My Source');

		const entry1B = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		const entry2B = await addEntry({ resource: workingCopy2.resource }, CancellationToken.None);

		assert.strictEqual((await fileService.readFile(entry1B.location)).value.toString(), testFile1PathContents);
		assert.strictEqual((await fileService.readFile(entry2B.location)).value.toString(), testFile2PathContents);

		assert.strictEqual(addEvents.length, 4);
		assert.strictEqual(addEvents[2].entry.workingCopy.resource.toString(), workingCopy1.resource.toString());
		assert.strictEqual(addEvents[3].entry.workingCopy.resource.toString(), workingCopy2.resource.toString());

		// Cancellation works

		const cts = new CancellationTokenSource();
		const entry1CPromise = addEntry({ resource: workingCopy1.resource }, cts.token, false);
		cts.dispose(true);

		const entry1C = await entry1CPromise;
		assert.ok(!entry1C);

		assert.strictEqual(addEvents.length, 4);

		// Invalid working copies are ignored

		const workingCopy3 = disposables.add(new TestWorkingCopy(testFile2Path.with({ scheme: 'unsupported' })));
		const entry3A = await addEntry({ resource: workingCopy3.resource }, CancellationToken.None, false);
		assert.ok(!entry3A);

		assert.strictEqual(addEvents.length, 4);
	});

	test('renameEntry', async () => {
		const changeEvents: IWorkingCopyHistoryEvent[] = [];
		disposables.add(service.onDidChangeEntry(e => changeEvents.push(e)));

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource, source: 'My Source' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		await service.updateEntry(entry, { source: 'Hello Rename' }, CancellationToken.None);

		assert.strictEqual(changeEvents.length, 1);
		assert.strictEqual(changeEvents[0].entry, entry);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries[0].source, 'Hello Rename');

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].source, 'Hello Rename');
	});

	test('removeEntry', async () => {
		const removeEvents: IWorkingCopyHistoryEvent[] = [];
		disposables.add(service.onDidRemoveEntry(e => removeEvents.push(e)));

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource, source: 'My Source' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		let removed = await service.removeEntry(entry2, CancellationToken.None);
		assert.strictEqual(removed, true);

		assert.strictEqual(removeEvents.length, 1);
		assert.strictEqual(removeEvents[0].entry, entry2);

		// Cannot remove same entry again
		removed = await service.removeEntry(entry2, CancellationToken.None);
		assert.strictEqual(removed, false);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);
	});

	test('removeEntry - deletes history entries folder when last entry removed', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		let entry: IWorkingCopyHistoryEntry | undefined = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);

		// Simulate shutdown
		let event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		assert.strictEqual((await fileService.exists(dirname(entry.location))), true);

		entry = (await service.getEntries(workingCopy1.resource, CancellationToken.None)).at(0);
		assert.ok(entry);

		await service.removeEntry(entry, CancellationToken.None);

		// Simulate shutdown
		event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		assert.strictEqual((await fileService.exists(dirname(entry.location))), false);
	});

	test('removeAll', async () => {
		let removed = false;
		disposables.add(service.onDidRemoveEntries(() => removed = true));

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy2.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy2.resource, source: 'My Source' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);
		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);

		await service.removeAll(CancellationToken.None);

		assert.strictEqual(removed, true);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);
		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);
		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);
	});

	test('getEntries - simple', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		const entry1 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry1);

		const entry2 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);
		assertEntryEqual(entries[1], entry2);

		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		const entry3 = await addEntry({ resource: workingCopy2.resource, source: 'other-test-source' }, CancellationToken.None);

		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry3);
	});

	test('getEntries - metadata preserved when stored', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		const entry1 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy2.resource }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopy2.resource, source: 'other-source' }, CancellationToken.None);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry1);

		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);
		assertEntryEqual(entries[0], entry2);
		assertEntryEqual(entries[1], entry3);
	});

	test('getEntries - corrupt meta.json is no problem', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		const metaFile = joinPath(dirname(entry1.location), 'entries.json');
		assert.ok((await fileService.exists(metaFile)));
		await fileService.del(metaFile);

		const entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry1, false /* skip timestamp that is unreliable when entries.json is gone */);
	});

	test('getEntries - missing entries from meta.json is no problem', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		await fileService.del(entry1.location);

		const entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry2);
	});

	test('getEntries - in-memory and on-disk entries are merged', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		const entry3 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry4 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);

		const entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);
		assertEntryEqual(entries[0], entry1);
		assertEntryEqual(entries[1], entry2);
		assertEntryEqual(entries[2], entry3);
		assertEntryEqual(entries[3], entry4);
	});

	test('getEntries - configured max entries respected', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopy1.resource, source: 'Test source' }, CancellationToken.None);
		const entry4 = await addEntry({ resource: workingCopy1.resource }, CancellationToken.None);

		service._configurationService.setUserConfiguration('workbench.localHistory.maxFileEntries', 2);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);
		assertEntryEqual(entries[0], entry3);
		assertEntryEqual(entries[1], entry4);

		service._configurationService.setUserConfiguration('workbench.localHistory.maxFileEntries', 4);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		service._configurationService.setUserConfiguration('workbench.localHistory.maxFileEntries', 5);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);
	});

	test('getAll', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		let resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 0);

		await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);
		await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);

		resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 2);
		for (const resource of resources) {
			if (resource.toString() !== workingCopy1.resource.toString() && resource.toString() !== workingCopy2.resource.toString()) {
				assert.fail(`Unexpected history resource: ${resource.toString()}`);
			}
		}

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		const workingCopy3 = disposables.add(new TestWorkingCopy(testFile3Path));
		await addEntry({ resource: workingCopy3.resource, source: 'test-source' }, CancellationToken.None);

		resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 3);
		for (const resource of resources) {
			if (resource.toString() !== workingCopy1.resource.toString() && resource.toString() !== workingCopy2.resource.toString() && resource.toString() !== workingCopy3.resource.toString()) {
				assert.fail(`Unexpected history resource: ${resource.toString()}`);
			}
		}
	});

	test('getAll - ignores resource when no entries exist', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		let resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 1);

		await service.removeEntry(entry, CancellationToken.None);

		resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 0);

		// Simulate shutdown
		const event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		resources = await service.getAll(CancellationToken.None);
		assert.strictEqual(resources.length, 0);
	});

	function assertEntryEqual(entryA: IWorkingCopyHistoryEntry, entryB: IWorkingCopyHistoryEntry, assertTimestamp = true): void {
		assert.strictEqual(entryA.id, entryB.id);
		assert.strictEqual(entryA.location.toString(), entryB.location.toString());
		if (assertTimestamp) {
			assert.strictEqual(entryA.timestamp, entryB.timestamp);
		}
		assert.strictEqual(entryA.source, entryB.source);
		assert.strictEqual(entryA.workingCopy.name, entryB.workingCopy.name);
		assert.strictEqual(entryA.workingCopy.resource.toString(), entryB.workingCopy.resource.toString());
	}

	test('entries cleaned up on shutdown', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);
		const entry4 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);

		service._configurationService.setUserConfiguration('workbench.localHistory.maxFileEntries', 2);

		// Simulate shutdown
		let event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		assert.ok(!(await fileService.exists(entry1.location)));
		assert.ok(!(await fileService.exists(entry2.location)));
		assert.ok((await fileService.exists(entry3.location)));
		assert.ok((await fileService.exists(entry4.location)));

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 2);
		assertEntryEqual(entries[0], entry3);
		assertEntryEqual(entries[1], entry4);

		service._configurationService.setUserConfiguration('workbench.localHistory.maxFileEntries', 3);

		const entry5 = await addEntry({ resource: workingCopy1.resource, source: 'other-source' }, CancellationToken.None);

		// Simulate shutdown
		event = new TestWillShutdownEvent();
		service._lifecycleService.fireWillShutdown(event);
		await Promise.allSettled(event.value);

		assert.ok((await fileService.exists(entry3.location)));
		assert.ok((await fileService.exists(entry4.location)));
		assert.ok((await fileService.exists(entry5.location)));

		// Resolve from file service fresh and verify again

		service.dispose();
		service = disposables.add(new TestWorkingCopyHistoryService(disposables, fileService));

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);
		assertEntryEqual(entries[0], entry3);
		assertEntryEqual(entries[1], entry4);
		assertEntryEqual(entries[2], entry5);
	});

	test('entries are merged when source is same', async () => {
		let replaced: IWorkingCopyHistoryEntry | undefined = undefined;
		disposables.add(service.onDidReplaceEntry(e => replaced = e.entry));

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));

		service._configurationService.setUserConfiguration('workbench.localHistory.mergeWindow', 1);

		const entry1 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		assert.strictEqual(replaced, undefined);

		const entry2 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		assert.strictEqual(replaced, entry1);

		const entry3 = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		assert.strictEqual(replaced, entry2);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 1);
		assertEntryEqual(entries[0], entry3);

		service._configurationService.setUserConfiguration('workbench.localHistory.mergeWindow', undefined);

		await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);
	});

	test('move entries (file rename)', async () => {
		const workingCopy = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopy.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		const renamedWorkingCopyResource = joinPath(dirname(workingCopy.resource), 'renamed.txt');
		await fileService.move(workingCopy.resource, renamedWorkingCopyResource);

		const result = await service.moveEntries(workingCopy.resource, renamedWorkingCopyResource);

		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].toString(), renamedWorkingCopyResource.toString());

		entries = await service.getEntries(workingCopy.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await service.getEntries(renamedWorkingCopyResource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1.id);
		assert.strictEqual(entries[0].timestamp, entry1.timestamp);
		assert.strictEqual(entries[0].source, entry1.source);
		assert.ok(!entries[0].sourceDescription);
		assert.notStrictEqual(entries[0].location, entry1.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());

		assert.strictEqual(entries[1].id, entry2.id);
		assert.strictEqual(entries[1].timestamp, entry2.timestamp);
		assert.strictEqual(entries[1].source, entry2.source);
		assert.ok(!entries[1].sourceDescription);
		assert.notStrictEqual(entries[1].location, entry2.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());

		assert.strictEqual(entries[2].id, entry3.id);
		assert.strictEqual(entries[2].timestamp, entry3.timestamp);
		assert.strictEqual(entries[2].source, entry3.source);
		assert.notStrictEqual(entries[2].location, entry3.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());
		assert.ok(!entries[2].sourceDescription);

		assert.strictEqual(entries[3].source, 'renamed.source' /* for the move */);
		assert.ok(entries[3].sourceDescription); // contains the source working copy path

		const all = await service.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 1);
		assert.strictEqual(all[0].toString(), renamedWorkingCopyResource.toString());
	});

	test('entries moved (folder rename)', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		const entry1A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry2A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry3A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		const entry1B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);
		const entry2B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);
		const entry3B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		const renamedWorkHome = joinPath(dirname(workHome), 'renamed');
		await fileService.move(workHome, renamedWorkHome);

		const resources = await service.moveEntries(workHome, renamedWorkHome);

		const renamedWorkingCopy1Resource = joinPath(renamedWorkHome, basename(workingCopy1.resource));
		const renamedWorkingCopy2Resource = joinPath(renamedWorkHome, basename(workingCopy2.resource));

		assert.strictEqual(resources.length, 2);
		for (const resource of resources) {
			if (resource.toString() !== renamedWorkingCopy1Resource.toString() && resource.toString() !== renamedWorkingCopy2Resource.toString()) {
				assert.fail(`Unexpected history resource: ${resource.toString()}`);
			}
		}

		entries = await service.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);
		entries = await service.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await service.getEntries(renamedWorkingCopy1Resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1A.id);
		assert.strictEqual(entries[0].timestamp, entry1A.timestamp);
		assert.strictEqual(entries[0].source, entry1A.source);
		assert.notStrictEqual(entries[0].location, entry1A.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		assert.strictEqual(entries[1].id, entry2A.id);
		assert.strictEqual(entries[1].timestamp, entry2A.timestamp);
		assert.strictEqual(entries[1].source, entry2A.source);
		assert.notStrictEqual(entries[1].location, entry2A.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		assert.strictEqual(entries[2].id, entry3A.id);
		assert.strictEqual(entries[2].timestamp, entry3A.timestamp);
		assert.strictEqual(entries[2].source, entry3A.source);
		assert.notStrictEqual(entries[2].location, entry3A.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		entries = await service.getEntries(renamedWorkingCopy2Resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1B.id);
		assert.strictEqual(entries[0].timestamp, entry1B.timestamp);
		assert.strictEqual(entries[0].source, entry1B.source);
		assert.notStrictEqual(entries[0].location, entry1B.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		assert.strictEqual(entries[1].id, entry2B.id);
		assert.strictEqual(entries[1].timestamp, entry2B.timestamp);
		assert.strictEqual(entries[1].source, entry2B.source);
		assert.notStrictEqual(entries[1].location, entry2B.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		assert.strictEqual(entries[2].id, entry3B.id);
		assert.strictEqual(entries[2].timestamp, entry3B.timestamp);
		assert.strictEqual(entries[2].source, entry3B.source);
		assert.notStrictEqual(entries[2].location, entry3B.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		assert.strictEqual(entries[3].source, 'moved.source' /* for the move */);
		assert.ok(entries[3].sourceDescription); // contains the source working copy path

		const all = await service.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 2);
		for (const resource of all) {
			if (resource.toString() !== renamedWorkingCopy1Resource.toString() && resource.toString() !== renamedWorkingCopy2Resource.toString()) {
				assert.fail(`Unexpected history resource: ${resource.toString()}`);
			}
		}
	});

	test('move entries (file rename) - preserves previous entries (no new entries)', async () => {
		const workingCopyTarget = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopySource = disposables.add(new TestWorkingCopy(testFile2Path));

		const entry1 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-source1' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-source2' }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-source3' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopyTarget.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		entries = await service.getEntries(workingCopySource.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		await fileService.move(workingCopySource.resource, workingCopyTarget.resource, true);

		const result = await service.moveEntries(workingCopySource.resource, workingCopyTarget.resource);

		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].toString(), workingCopyTarget.resource.toString());

		entries = await service.getEntries(workingCopySource.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await service.getEntries(workingCopyTarget.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1.id);
		assert.strictEqual(entries[0].timestamp, entry1.timestamp);
		assert.strictEqual(entries[0].source, entry1.source);
		assert.notStrictEqual(entries[0].location, entry1.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[1].id, entry2.id);
		assert.strictEqual(entries[1].timestamp, entry2.timestamp);
		assert.strictEqual(entries[1].source, entry2.source);
		assert.notStrictEqual(entries[1].location, entry2.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[2].id, entry3.id);
		assert.strictEqual(entries[2].timestamp, entry3.timestamp);
		assert.strictEqual(entries[2].source, entry3.source);
		assert.notStrictEqual(entries[2].location, entry3.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[3].source, 'renamed.source' /* for the move */);
		assert.ok(entries[3].sourceDescription); // contains the source working copy path

		const all = await service.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 1);
		assert.strictEqual(all[0].toString(), workingCopyTarget.resource.toString());
	});

	test('move entries (file rename) - preserves previous entries (new entries)', async () => {
		const workingCopyTarget = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopySource = disposables.add(new TestWorkingCopy(testFile2Path));

		const targetEntry1 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-target1' }, CancellationToken.None);
		const targetEntry2 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-target2' }, CancellationToken.None);
		const targetEntry3 = await addEntry({ resource: workingCopyTarget.resource, source: 'test-target3' }, CancellationToken.None);

		const sourceEntry1 = await addEntry({ resource: workingCopySource.resource, source: 'test-source1' }, CancellationToken.None);
		const sourceEntry2 = await addEntry({ resource: workingCopySource.resource, source: 'test-source2' }, CancellationToken.None);
		const sourceEntry3 = await addEntry({ resource: workingCopySource.resource, source: 'test-source3' }, CancellationToken.None);

		let entries = await service.getEntries(workingCopyTarget.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		entries = await service.getEntries(workingCopySource.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		await fileService.move(workingCopySource.resource, workingCopyTarget.resource, true);

		const result = await service.moveEntries(workingCopySource.resource, workingCopyTarget.resource);

		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].toString(), workingCopyTarget.resource.toString());

		entries = await service.getEntries(workingCopySource.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await service.getEntries(workingCopyTarget.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 7);

		assert.strictEqual(entries[0].id, targetEntry1.id);
		assert.strictEqual(entries[0].timestamp, targetEntry1.timestamp);
		assert.strictEqual(entries[0].source, targetEntry1.source);
		assert.notStrictEqual(entries[0].location, targetEntry1.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[1].id, targetEntry2.id);
		assert.strictEqual(entries[1].timestamp, targetEntry2.timestamp);
		assert.strictEqual(entries[1].source, targetEntry2.source);
		assert.notStrictEqual(entries[1].location, targetEntry2.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[2].id, targetEntry3.id);
		assert.strictEqual(entries[2].timestamp, targetEntry3.timestamp);
		assert.strictEqual(entries[2].source, targetEntry3.source);
		assert.notStrictEqual(entries[2].location, targetEntry3.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[3].id, sourceEntry1.id);
		assert.strictEqual(entries[3].timestamp, sourceEntry1.timestamp);
		assert.strictEqual(entries[3].source, sourceEntry1.source);
		assert.notStrictEqual(entries[3].location, sourceEntry1.location);
		assert.strictEqual(entries[3].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[4].id, sourceEntry2.id);
		assert.strictEqual(entries[4].timestamp, sourceEntry2.timestamp);
		assert.strictEqual(entries[4].source, sourceEntry2.source);
		assert.notStrictEqual(entries[4].location, sourceEntry2.location);
		assert.strictEqual(entries[4].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[5].id, sourceEntry3.id);
		assert.strictEqual(entries[5].timestamp, sourceEntry3.timestamp);
		assert.strictEqual(entries[5].source, sourceEntry3.source);
		assert.notStrictEqual(entries[5].location, sourceEntry3.location);
		assert.strictEqual(entries[5].workingCopy.resource.toString(), workingCopyTarget.resource.toString());

		assert.strictEqual(entries[6].source, 'renamed.source' /* for the move */);
		assert.ok(entries[6].sourceDescription); // contains the source working copy path

		const all = await service.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 1);
		assert.strictEqual(all[0].toString(), workingCopyTarget.resource.toString());
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyHistoryTracker.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/electron-browser/workingCopyHistoryTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { TestContextService, TestWorkingCopy } from '../../../../test/common/workbenchTestServices.js';
import { randomPath } from '../../../../../base/common/extpath.js';
import { join } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { WorkingCopyHistoryTracker } from '../../common/workingCopyHistoryTracker.js';
import { WorkingCopyService } from '../../common/workingCopyService.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { TestFileService, TestPathService } from '../../../../test/browser/workbenchTestServices.js';
import { DeferredPromise } from '../../../../../base/common/async.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename, dirname, isEqual, joinPath } from '../../../../../base/common/resources.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { UndoRedoService } from '../../../../../platform/undoRedo/common/undoRedoService.js';
import { TestDialogService } from '../../../../../platform/dialogs/test/common/testDialogService.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IWorkingCopyHistoryEntry, IWorkingCopyHistoryEntryDescriptor } from '../../common/workingCopyHistory.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestWorkingCopyHistoryService } from './workingCopyHistoryService.test.js';

suite('WorkingCopyHistoryTracker', () => {

	let testDir: URI;
	let historyHome: URI;
	let workHome: URI;

	let workingCopyHistoryService: TestWorkingCopyHistoryService;
	let workingCopyService: WorkingCopyService;
	let fileService: IFileService;
	let configurationService: TestConfigurationService;

	let tracker: WorkingCopyHistoryTracker;

	let testFile1Path: URI;
	let testFile2Path: URI;

	const disposables = new DisposableStore();

	const testFile1PathContents = 'Hello Foo';
	const testFile2PathContents = [
		'Lorem ipsum ',
		'dolor öäü sit amet ',
		'adipiscing ßß elit',
		'consectetur '
	].join('').repeat(1000);

	let increasingTimestampCounter = 1;

	async function addEntry(descriptor: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken): Promise<IWorkingCopyHistoryEntry> {
		const entry = await workingCopyHistoryService.addEntry({
			...descriptor,
			timestamp: increasingTimestampCounter++ // very important to get tests to not be flaky with stable sort order
		}, token);

		return assertReturnsDefined(entry);
	}

	setup(async () => {
		testDir = URI.file(randomPath(join('vsctests', 'workingcopyhistorytracker'))).with({ scheme: Schemas.inMemory });
		historyHome = joinPath(testDir, 'User', 'History');
		workHome = joinPath(testDir, 'work');

		workingCopyHistoryService = disposables.add(new TestWorkingCopyHistoryService(disposables));
		workingCopyService = disposables.add(new WorkingCopyService());
		fileService = workingCopyHistoryService._fileService;
		configurationService = workingCopyHistoryService._configurationService;

		tracker = disposables.add(createTracker());

		await fileService.createFolder(historyHome);
		await fileService.createFolder(workHome);

		testFile1Path = joinPath(workHome, 'foo.txt');
		testFile2Path = joinPath(workHome, 'bar.txt');

		await fileService.writeFile(testFile1Path, VSBuffer.fromString(testFile1PathContents));
		await fileService.writeFile(testFile2Path, VSBuffer.fromString(testFile2PathContents));
	});

	function createTracker() {
		return new WorkingCopyHistoryTracker(
			workingCopyService,
			workingCopyHistoryService,
			disposables.add(new UriIdentityService(disposables.add(new TestFileService()))),
			new TestPathService(undefined, Schemas.file),
			configurationService,
			new UndoRedoService(new TestDialogService(), new TestNotificationService()),
			new TestContextService(),
			workingCopyHistoryService._fileService
		);
	}

	teardown(async () => {
		await fileService.del(testDir, { recursive: true });
		disposables.clear();
	});

	test('history entry added on save', async () => {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		const stat1 = await fileService.resolve(workingCopy1.resource, { resolveMetadata: true });
		const stat2 = await fileService.resolve(workingCopy2.resource, { resolveMetadata: true });

		disposables.add(workingCopyService.registerWorkingCopy(workingCopy1));
		disposables.add(workingCopyService.registerWorkingCopy(workingCopy2));

		const saveResult = new DeferredPromise<void>();
		let addedCounter = 0;
		disposables.add(workingCopyHistoryService.onDidAddEntry(e => {
			if (isEqual(e.entry.workingCopy.resource, workingCopy1.resource) || isEqual(e.entry.workingCopy.resource, workingCopy2.resource)) {
				addedCounter++;

				if (addedCounter === 2) {
					saveResult.complete();
				}
			}
		}));

		await workingCopy1.save(undefined, stat1);
		await workingCopy2.save(undefined, stat2);

		await saveResult.p;
	});

	test('history entry skipped when setting disabled (globally)', async () => {
		configurationService.setUserConfiguration('workbench.localHistory.enabled', false, testFile1Path);

		return assertNoLocalHistoryEntryAddedWithSettingsConfigured();
	});

	test('history entry skipped when setting disabled (exclude)', () => {
		configurationService.setUserConfiguration('workbench.localHistory.exclude', { '**/foo.txt': true });

		// Recreate to apply settings
		tracker.dispose();
		tracker = disposables.add(createTracker());

		return assertNoLocalHistoryEntryAddedWithSettingsConfigured();
	});

	test('history entry skipped when too large', async () => {
		configurationService.setUserConfiguration('workbench.localHistory.maxFileSize', 0, testFile1Path);

		return assertNoLocalHistoryEntryAddedWithSettingsConfigured();
	});

	async function assertNoLocalHistoryEntryAddedWithSettingsConfigured(): Promise<void> {
		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		const stat1 = await fileService.resolve(workingCopy1.resource, { resolveMetadata: true });
		const stat2 = await fileService.resolve(workingCopy2.resource, { resolveMetadata: true });

		disposables.add(workingCopyService.registerWorkingCopy(workingCopy1));
		disposables.add(workingCopyService.registerWorkingCopy(workingCopy2));

		const saveResult = new DeferredPromise<void>();
		disposables.add(workingCopyHistoryService.onDidAddEntry(e => {
			if (isEqual(e.entry.workingCopy.resource, workingCopy1.resource)) {
				assert.fail('Unexpected working copy history entry: ' + e.entry.workingCopy.resource.toString());
			}

			if (isEqual(e.entry.workingCopy.resource, workingCopy2.resource)) {
				saveResult.complete();
			}
		}));

		await workingCopy1.save(undefined, stat1);
		await workingCopy2.save(undefined, stat2);

		await saveResult.p;
	}

	test('entries moved (file rename)', async () => {
		const entriesMoved = Event.toPromise(workingCopyHistoryService.onDidMoveEntries);

		const workingCopy = disposables.add(new TestWorkingCopy(testFile1Path));

		const entry1 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);
		const entry2 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);
		const entry3 = await addEntry({ resource: workingCopy.resource, source: 'test-source' }, CancellationToken.None);

		let entries = await workingCopyHistoryService.getEntries(workingCopy.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		const renamedWorkingCopyResource = joinPath(dirname(workingCopy.resource), 'renamed.txt');
		await workingCopyHistoryService._fileService.move(workingCopy.resource, renamedWorkingCopyResource);

		await entriesMoved;

		entries = await workingCopyHistoryService.getEntries(workingCopy.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await workingCopyHistoryService.getEntries(renamedWorkingCopyResource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1.id);
		assert.strictEqual(entries[0].timestamp, entry1.timestamp);
		assert.strictEqual(entries[0].source, entry1.source);
		assert.notStrictEqual(entries[0].location, entry1.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());

		assert.strictEqual(entries[1].id, entry2.id);
		assert.strictEqual(entries[1].timestamp, entry2.timestamp);
		assert.strictEqual(entries[1].source, entry2.source);
		assert.notStrictEqual(entries[1].location, entry2.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());

		assert.strictEqual(entries[2].id, entry3.id);
		assert.strictEqual(entries[2].timestamp, entry3.timestamp);
		assert.strictEqual(entries[2].source, entry3.source);
		assert.notStrictEqual(entries[2].location, entry3.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopyResource.toString());

		const all = await workingCopyHistoryService.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 1);
		assert.strictEqual(all[0].toString(), renamedWorkingCopyResource.toString());
	});

	test('entries moved (folder rename)', async () => {
		const entriesMoved = Event.toPromise(workingCopyHistoryService.onDidMoveEntries);

		const workingCopy1 = disposables.add(new TestWorkingCopy(testFile1Path));
		const workingCopy2 = disposables.add(new TestWorkingCopy(testFile2Path));

		const entry1A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry2A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);
		const entry3A = await addEntry({ resource: workingCopy1.resource, source: 'test-source' }, CancellationToken.None);

		const entry1B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);
		const entry2B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);
		const entry3B = await addEntry({ resource: workingCopy2.resource, source: 'test-source' }, CancellationToken.None);

		let entries = await workingCopyHistoryService.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		entries = await workingCopyHistoryService.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 3);

		const renamedWorkHome = joinPath(dirname(testDir), 'renamed');
		await workingCopyHistoryService._fileService.move(workHome, renamedWorkHome);

		const renamedWorkingCopy1Resource = joinPath(renamedWorkHome, basename(workingCopy1.resource));
		const renamedWorkingCopy2Resource = joinPath(renamedWorkHome, basename(workingCopy2.resource));

		await entriesMoved;

		entries = await workingCopyHistoryService.getEntries(workingCopy1.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);
		entries = await workingCopyHistoryService.getEntries(workingCopy2.resource, CancellationToken.None);
		assert.strictEqual(entries.length, 0);

		entries = await workingCopyHistoryService.getEntries(renamedWorkingCopy1Resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1A.id);
		assert.strictEqual(entries[0].timestamp, entry1A.timestamp);
		assert.strictEqual(entries[0].source, entry1A.source);
		assert.notStrictEqual(entries[0].location, entry1A.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		assert.strictEqual(entries[1].id, entry2A.id);
		assert.strictEqual(entries[1].timestamp, entry2A.timestamp);
		assert.strictEqual(entries[1].source, entry2A.source);
		assert.notStrictEqual(entries[1].location, entry2A.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		assert.strictEqual(entries[2].id, entry3A.id);
		assert.strictEqual(entries[2].timestamp, entry3A.timestamp);
		assert.strictEqual(entries[2].source, entry3A.source);
		assert.notStrictEqual(entries[2].location, entry3A.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopy1Resource.toString());

		entries = await workingCopyHistoryService.getEntries(renamedWorkingCopy2Resource, CancellationToken.None);
		assert.strictEqual(entries.length, 4);

		assert.strictEqual(entries[0].id, entry1B.id);
		assert.strictEqual(entries[0].timestamp, entry1B.timestamp);
		assert.strictEqual(entries[0].source, entry1B.source);
		assert.notStrictEqual(entries[0].location, entry1B.location);
		assert.strictEqual(entries[0].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		assert.strictEqual(entries[1].id, entry2B.id);
		assert.strictEqual(entries[1].timestamp, entry2B.timestamp);
		assert.strictEqual(entries[1].source, entry2B.source);
		assert.notStrictEqual(entries[1].location, entry2B.location);
		assert.strictEqual(entries[1].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		assert.strictEqual(entries[2].id, entry3B.id);
		assert.strictEqual(entries[2].timestamp, entry3B.timestamp);
		assert.strictEqual(entries[2].source, entry3B.source);
		assert.notStrictEqual(entries[2].location, entry3B.location);
		assert.strictEqual(entries[2].workingCopy.resource.toString(), renamedWorkingCopy2Resource.toString());

		const all = await workingCopyHistoryService.getAll(CancellationToken.None);
		assert.strictEqual(all.length, 2);
		for (const resource of all) {
			if (resource.toString() !== renamedWorkingCopy1Resource.toString() && resource.toString() !== renamedWorkingCopy2Resource.toString()) {
				assert.fail(`Unexpected history resource: ${resource.toString()}`);
			}
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/browser/abstractWorkspaceEditingService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/browser/abstractWorkspaceEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkspaceEditingService } from '../common/workspaceEditing.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { hasWorkspaceFileExtension, isSavedWorkspace, isUntitledWorkspace, isWorkspaceIdentifier, IWorkspaceContextService, IWorkspaceIdentifier, toWorkspaceIdentifier, WorkbenchState, WORKSPACE_EXTENSION, WORKSPACE_FILTER } from '../../../../platform/workspace/common/workspace.js';
import { IJSONEditingService, JSONEditingError, JSONEditingErrorCode } from '../../configuration/common/jsonEditing.js';
import { IWorkspaceFolderCreationData, IWorkspacesService, rewriteWorkspaceFileForNewLocation, IEnterWorkspaceResult, IStoredWorkspace } from '../../../../platform/workspaces/common/workspaces.js';
import { WorkspaceService } from '../../configuration/browser/configurationService.js';
import { ConfigurationScope, IConfigurationRegistry, Extensions as ConfigurationExtensions, IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { distinct } from '../../../../base/common/arrays.js';
import { basename, isEqual, isEqualAuthority, joinPath, removeTrailingPathSeparator } from '../../../../base/common/resources.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IFileDialogService, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IHostService } from '../../host/browser/host.js';
import { Schemas } from '../../../../base/common/network.js';
import { SaveReason } from '../../../common/editor.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchConfigurationService } from '../../configuration/common/configuration.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export abstract class AbstractWorkspaceEditingService extends Disposable implements IWorkspaceEditingService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
		@IWorkspaceContextService protected readonly contextService: WorkspaceService,
		@IWorkbenchConfigurationService protected readonly configurationService: IWorkbenchConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@ICommandService private readonly commandService: ICommandService,
		@IFileService private readonly fileService: IFileService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IWorkspacesService protected readonly workspacesService: IWorkspacesService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IDialogService protected readonly dialogService: IDialogService,
		@IHostService protected readonly hostService: IHostService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
	) {
		super();
	}

	async pickNewWorkspacePath(): Promise<URI | undefined> {
		const availableFileSystems = [Schemas.file];
		if (this.environmentService.remoteAuthority) {
			availableFileSystems.unshift(Schemas.vscodeRemote);
		}
		let workspacePath = await this.fileDialogService.showSaveDialog({
			saveLabel: localize('save', "Save"),
			title: localize('saveWorkspace', "Save Workspace"),
			filters: WORKSPACE_FILTER,
			defaultUri: joinPath(await this.fileDialogService.defaultWorkspacePath(), this.getNewWorkspaceName()),
			availableFileSystems
		});

		if (!workspacePath) {
			return; // canceled
		}

		if (!hasWorkspaceFileExtension(workspacePath)) {
			// Always ensure we have workspace file extension
			// (see https://github.com/microsoft/vscode/issues/84818)
			workspacePath = workspacePath.with({ path: `${workspacePath.path}.${WORKSPACE_EXTENSION}` });
		}

		return workspacePath;
	}

	private getNewWorkspaceName(): string {

		// First try with existing workspace name
		const configPathURI = this.getCurrentWorkspaceIdentifier()?.configPath;
		if (configPathURI && isSavedWorkspace(configPathURI, this.environmentService)) {
			return basename(configPathURI);
		}

		// Then fallback to first folder if any
		const folder = this.contextService.getWorkspace().folders.at(0);
		if (folder) {
			return `${basename(folder.uri)}.${WORKSPACE_EXTENSION}`;
		}

		// Finally pick a good default
		return `workspace.${WORKSPACE_EXTENSION}`;
	}

	async updateFolders(index: number, deleteCount?: number, foldersToAddCandidates?: IWorkspaceFolderCreationData[], donotNotifyError?: boolean): Promise<void> {
		const folders = this.contextService.getWorkspace().folders;

		let foldersToDelete: URI[] = [];
		if (typeof deleteCount === 'number') {
			foldersToDelete = folders.slice(index, index + deleteCount).map(folder => folder.uri);
		}

		let foldersToAdd: IWorkspaceFolderCreationData[] = [];
		if (Array.isArray(foldersToAddCandidates)) {
			foldersToAdd = foldersToAddCandidates.map(folderToAdd => ({ uri: removeTrailingPathSeparator(folderToAdd.uri), name: folderToAdd.name })); // Normalize
		}

		const wantsToDelete = foldersToDelete.length > 0;
		const wantsToAdd = foldersToAdd.length > 0;

		if (!wantsToAdd && !wantsToDelete) {
			return; // return early if there is nothing to do
		}

		// Add Folders
		if (wantsToAdd && !wantsToDelete) {
			return this.doAddFolders(foldersToAdd, index, donotNotifyError);
		}

		// Delete Folders
		if (wantsToDelete && !wantsToAdd) {
			return this.removeFolders(foldersToDelete);
		}

		// Add & Delete Folders
		else {

			// if we are in single-folder state and the folder is replaced with
			// other folders, we handle this specially and just enter workspace
			// mode with the folders that are being added.
			if (this.includesSingleFolderWorkspace(foldersToDelete)) {
				return this.createAndEnterWorkspace(foldersToAdd);
			}

			// if we are not in workspace-state, we just add the folders
			if (this.contextService.getWorkbenchState() !== WorkbenchState.WORKSPACE) {
				return this.doAddFolders(foldersToAdd, index, donotNotifyError);
			}

			// finally, update folders within the workspace
			return this.doUpdateFolders(foldersToAdd, foldersToDelete, index, donotNotifyError);
		}
	}

	private async doUpdateFolders(foldersToAdd: IWorkspaceFolderCreationData[], foldersToDelete: URI[], index?: number, donotNotifyError = false): Promise<void> {
		try {
			await this.contextService.updateFolders(foldersToAdd, foldersToDelete, index);
		} catch (error) {
			if (donotNotifyError) {
				throw error;
			}

			this.handleWorkspaceConfigurationEditingError(error);
		}
	}

	addFolders(foldersToAddCandidates: IWorkspaceFolderCreationData[], donotNotifyError = false): Promise<void> {

		// Normalize
		const foldersToAdd = foldersToAddCandidates.map(folderToAdd => ({ uri: removeTrailingPathSeparator(folderToAdd.uri), name: folderToAdd.name }));

		return this.doAddFolders(foldersToAdd, undefined, donotNotifyError);
	}

	private async doAddFolders(foldersToAdd: IWorkspaceFolderCreationData[], index?: number, donotNotifyError = false): Promise<void> {
		const state = this.contextService.getWorkbenchState();
		const remoteAuthority = this.environmentService.remoteAuthority;
		if (remoteAuthority) {
			// https://github.com/microsoft/vscode/issues/94191
			foldersToAdd = foldersToAdd.filter(folder => folder.uri.scheme !== Schemas.file && (folder.uri.scheme !== Schemas.vscodeRemote || isEqualAuthority(folder.uri.authority, remoteAuthority)));
		}

		// If we are in no-workspace or single-folder workspace, adding folders has to
		// enter a workspace.
		if (state !== WorkbenchState.WORKSPACE) {
			let newWorkspaceFolders = this.contextService.getWorkspace().folders.map(folder => ({ uri: folder.uri }));
			newWorkspaceFolders.splice(typeof index === 'number' ? index : newWorkspaceFolders.length, 0, ...foldersToAdd);
			newWorkspaceFolders = distinct(newWorkspaceFolders, folder => this.uriIdentityService.extUri.getComparisonKey(folder.uri));

			if (state === WorkbenchState.EMPTY && newWorkspaceFolders.length === 0 || state === WorkbenchState.FOLDER && newWorkspaceFolders.length === 1) {
				return; // return if the operation is a no-op for the current state
			}

			return this.createAndEnterWorkspace(newWorkspaceFolders);
		}

		// Delegate addition of folders to workspace service otherwise
		try {
			await this.contextService.addFolders(foldersToAdd, index);
		} catch (error) {
			if (donotNotifyError) {
				throw error;
			}

			this.handleWorkspaceConfigurationEditingError(error);
		}
	}

	async removeFolders(foldersToRemove: URI[], donotNotifyError = false): Promise<void> {

		// If we are in single-folder state and the opened folder is to be removed,
		// we create an empty workspace and enter it.
		if (this.includesSingleFolderWorkspace(foldersToRemove)) {
			return this.createAndEnterWorkspace([]);
		}

		// Delegate removal of folders to workspace service otherwise
		try {
			await this.contextService.removeFolders(foldersToRemove);
		} catch (error) {
			if (donotNotifyError) {
				throw error;
			}

			this.handleWorkspaceConfigurationEditingError(error);
		}
	}

	private includesSingleFolderWorkspace(folders: URI[]): boolean {
		if (this.contextService.getWorkbenchState() === WorkbenchState.FOLDER) {
			const workspaceFolder = this.contextService.getWorkspace().folders[0];
			return (folders.some(folder => this.uriIdentityService.extUri.isEqual(folder, workspaceFolder.uri)));
		}

		return false;
	}

	async createAndEnterWorkspace(folders: IWorkspaceFolderCreationData[], path?: URI): Promise<void> {
		if (path && !await this.isValidTargetWorkspacePath(path)) {
			return;
		}

		const remoteAuthority = this.environmentService.remoteAuthority;
		const untitledWorkspace = await this.workspacesService.createUntitledWorkspace(folders, remoteAuthority);
		if (path) {
			try {
				await this.saveWorkspaceAs(untitledWorkspace, path);
			} finally {
				await this.workspacesService.deleteUntitledWorkspace(untitledWorkspace); // https://github.com/microsoft/vscode/issues/100276
			}
		} else {
			path = untitledWorkspace.configPath;
			if (!this.userDataProfileService.currentProfile.isDefault) {
				await this.userDataProfilesService.setProfileForWorkspace(untitledWorkspace, this.userDataProfileService.currentProfile);
			}
		}

		return this.enterWorkspace(path);
	}

	async saveAndEnterWorkspace(workspaceUri: URI): Promise<void> {
		const workspaceIdentifier = this.getCurrentWorkspaceIdentifier();
		if (!workspaceIdentifier) {
			return;
		}

		// Allow to save the workspace of the current window
		// if we have an identical match on the path
		if (isEqual(workspaceIdentifier.configPath, workspaceUri)) {
			return this.saveWorkspace(workspaceIdentifier);
		}

		// From this moment on we require a valid target that is not opened already
		if (!await this.isValidTargetWorkspacePath(workspaceUri)) {
			return;
		}

		await this.saveWorkspaceAs(workspaceIdentifier, workspaceUri);

		return this.enterWorkspace(workspaceUri);
	}

	async isValidTargetWorkspacePath(workspaceUri: URI): Promise<boolean> {
		return true; // OK
	}

	protected async saveWorkspaceAs(workspace: IWorkspaceIdentifier, targetConfigPathURI: URI): Promise<void> {
		const configPathURI = workspace.configPath;

		const isNotUntitledWorkspace = !isUntitledWorkspace(targetConfigPathURI, this.environmentService);
		if (isNotUntitledWorkspace && !this.userDataProfileService.currentProfile.isDefault) {
			const newWorkspace = await this.workspacesService.getWorkspaceIdentifier(targetConfigPathURI);
			await this.userDataProfilesService.setProfileForWorkspace(newWorkspace, this.userDataProfileService.currentProfile);
		}

		// Return early if target is same as source
		if (this.uriIdentityService.extUri.isEqual(configPathURI, targetConfigPathURI)) {
			return;
		}

		const isFromUntitledWorkspace = isUntitledWorkspace(configPathURI, this.environmentService);

		// Read the contents of the workspace file, update it to new location and save it.
		const raw = await this.fileService.readFile(configPathURI);
		const newRawWorkspaceContents = rewriteWorkspaceFileForNewLocation(raw.value.toString(), configPathURI, isFromUntitledWorkspace, targetConfigPathURI, this.uriIdentityService.extUri);
		await this.textFileService.create([{ resource: targetConfigPathURI, value: newRawWorkspaceContents, options: { overwrite: true } }]);

		// Set trust for the workspace file
		await this.trustWorkspaceConfiguration(targetConfigPathURI);
	}

	protected async saveWorkspace(workspace: IWorkspaceIdentifier): Promise<void> {
		const configPathURI = workspace.configPath;

		// First: try to save any existing model as it could be dirty
		const existingModel = this.textFileService.files.get(configPathURI);
		if (existingModel) {
			await existingModel.save({ force: true, reason: SaveReason.EXPLICIT });
			return;
		}

		// Second: if the file exists on disk, simply return
		const workspaceFileExists = await this.fileService.exists(configPathURI);
		if (workspaceFileExists) {
			return;
		}

		// Finally, we need to re-create the file as it was deleted
		const newWorkspace: IStoredWorkspace = { folders: [] };
		const newRawWorkspaceContents = rewriteWorkspaceFileForNewLocation(JSON.stringify(newWorkspace, null, '\t'), configPathURI, false, configPathURI, this.uriIdentityService.extUri);
		await this.textFileService.create([{ resource: configPathURI, value: newRawWorkspaceContents }]);
	}

	private handleWorkspaceConfigurationEditingError(error: JSONEditingError): void {
		switch (error.code) {
			case JSONEditingErrorCode.ERROR_INVALID_FILE:
				this.onInvalidWorkspaceConfigurationFileError();
				break;
			default:
				this.notificationService.error(error.message);
		}
	}

	private onInvalidWorkspaceConfigurationFileError(): void {
		const message = localize('errorInvalidTaskConfiguration', "Unable to write into workspace configuration file. Please open the file to correct errors/warnings in it and try again.");
		this.askToOpenWorkspaceConfigurationFile(message);
	}

	private askToOpenWorkspaceConfigurationFile(message: string): void {
		this.notificationService.prompt(Severity.Error, message,
			[{
				label: localize('openWorkspaceConfigurationFile', "Open Workspace Configuration"),
				run: () => this.commandService.executeCommand('workbench.action.openWorkspaceConfigFile')
			}]
		);
	}

	abstract enterWorkspace(workspaceUri: URI): Promise<void>;

	protected async doEnterWorkspace(workspaceUri: URI): Promise<IEnterWorkspaceResult | undefined> {
		if (this.environmentService.extensionTestsLocationURI) {
			throw new Error('Entering a new workspace is not possible in tests.');
		}

		const workspace = await this.workspacesService.getWorkspaceIdentifier(workspaceUri);

		// Settings migration (only if we come from a folder workspace)
		if (this.contextService.getWorkbenchState() === WorkbenchState.FOLDER) {
			await this.migrateWorkspaceSettings(workspace);
		}

		await this.configurationService.initialize(workspace);

		return this.workspacesService.enterWorkspace(workspaceUri);
	}

	private migrateWorkspaceSettings(toWorkspace: IWorkspaceIdentifier): Promise<void> {
		return this.doCopyWorkspaceSettings(toWorkspace, setting => setting.scope === ConfigurationScope.WINDOW);
	}

	copyWorkspaceSettings(toWorkspace: IWorkspaceIdentifier): Promise<void> {
		return this.doCopyWorkspaceSettings(toWorkspace);
	}

	private doCopyWorkspaceSettings(toWorkspace: IWorkspaceIdentifier, filter?: (config: IConfigurationPropertySchema) => boolean): Promise<void> {
		const configurationProperties = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
		const targetWorkspaceConfiguration: Record<string, unknown> = {};
		for (const key of this.configurationService.keys().workspace) {
			if (configurationProperties[key]) {
				if (filter && !filter(configurationProperties[key])) {
					continue;
				}

				targetWorkspaceConfiguration[key] = this.configurationService.inspect(key).workspaceValue;
			}
		}

		return this.jsonEditingService.write(toWorkspace.configPath, [{ path: ['settings'], value: targetWorkspaceConfiguration }], true);
	}

	private async trustWorkspaceConfiguration(configPathURI: URI): Promise<void> {
		if (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY && this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			await this.workspaceTrustManagementService.setUrisTrust([configPathURI], true);
		}
	}

	protected getCurrentWorkspaceIdentifier(): IWorkspaceIdentifier | undefined {
		const identifier = toWorkspaceIdentifier(this.contextService.getWorkspace());
		if (isWorkspaceIdentifier(identifier)) {
			return identifier;
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/browser/workspaceEditingService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/browser/workspaceEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { WorkspaceService } from '../../configuration/browser/configurationService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IFileDialogService, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IHostService } from '../../host/browser/host.js';
import { AbstractWorkspaceEditingService } from './abstractWorkspaceEditingService.js';
import { IWorkspaceEditingService } from '../common/workspaceEditing.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchConfigurationService } from '../../configuration/common/configuration.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export class BrowserWorkspaceEditingService extends AbstractWorkspaceEditingService {

	constructor(
		@IJSONEditingService jsonEditingService: IJSONEditingService,
		@IWorkspaceContextService contextService: WorkspaceService,
		@IWorkbenchConfigurationService configurationService: IWorkbenchConfigurationService,
		@INotificationService notificationService: INotificationService,
		@ICommandService commandService: ICommandService,
		@IFileService fileService: IFileService,
		@ITextFileService textFileService: ITextFileService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@IDialogService dialogService: IDialogService,
		@IHostService hostService: IHostService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceTrustManagementService workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
	) {
		super(jsonEditingService, contextService, configurationService, notificationService, commandService, fileService, textFileService, workspacesService, environmentService, fileDialogService, dialogService, hostService, uriIdentityService, workspaceTrustManagementService, userDataProfilesService, userDataProfileService);
	}

	async enterWorkspace(workspaceUri: URI): Promise<void> {
		const result = await this.doEnterWorkspace(workspaceUri);
		if (result) {

			// Open workspace in same window
			await this.hostService.openWindow([{ workspaceUri }], { forceReuseWindow: true });
		}
	}
}

registerSingleton(IWorkspaceEditingService, BrowserWorkspaceEditingService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/browser/workspaces.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/browser/workspaces.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { URI } from '../../../../base/common/uri.js';
import { hash } from '../../../../base/common/hash.js';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function getWorkspaceIdentifier(workspaceUri: URI): IWorkspaceIdentifier {
	return {
		id: getWorkspaceId(workspaceUri),
		configPath: workspaceUri
	};
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function getSingleFolderWorkspaceIdentifier(folderUri: URI): ISingleFolderWorkspaceIdentifier {
	return {
		id: getWorkspaceId(folderUri),
		uri: folderUri
	};
}

function getWorkspaceId(uri: URI): string {
	return hash(uri.toString()).toString(16);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/browser/workspacesService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/browser/workspacesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkspacesService, IWorkspaceFolderCreationData, IEnterWorkspaceResult, IRecentlyOpened, restoreRecentlyOpened, IRecent, isRecentFile, isRecentFolder, toStoreData, IStoredWorkspaceFolder, getStoredWorkspaceFolder, IStoredWorkspace, isRecentWorkspace } from '../../../../platform/workspaces/common/workspaces.js';
import { URI } from '../../../../base/common/uri.js';
import { Emitter } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isTemporaryWorkspace, IWorkspaceContextService, IWorkspaceFoldersChangeEvent, IWorkspaceIdentifier, WorkbenchState, WORKSPACE_EXTENSION } from '../../../../platform/workspace/common/workspace.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getWorkspaceIdentifier } from './workspaces.js';
import { IFileService, FileOperationError, FileOperationResult } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { joinPath } from '../../../../base/common/resources.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceBackupInfo, IFolderBackupInfo } from '../../../../platform/backup/common/backup.js';
import { Schemas } from '../../../../base/common/network.js';

export class BrowserWorkspacesService extends Disposable implements IWorkspacesService {

	static readonly RECENTLY_OPENED_KEY = 'recently.opened';

	declare readonly _serviceBrand: undefined;

	private readonly _onRecentlyOpenedChange = this._register(new Emitter<void>());
	readonly onDidChangeRecentlyOpened = this._onRecentlyOpenedChange.event;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILogService private readonly logService: ILogService,
		@IFileService private readonly fileService: IFileService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();

		// Opening a workspace should push it as most
		// recently used to the workspaces history
		this.addWorkspaceToRecentlyOpened();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Storage
		this._register(this.storageService.onDidChangeValue(StorageScope.APPLICATION, BrowserWorkspacesService.RECENTLY_OPENED_KEY, this._store)(() => this._onRecentlyOpenedChange.fire()));

		// Workspace
		this._register(this.contextService.onDidChangeWorkspaceFolders(e => this.onDidChangeWorkspaceFolders(e)));
	}

	private onDidChangeWorkspaceFolders(e: IWorkspaceFoldersChangeEvent): void {
		if (!isTemporaryWorkspace(this.contextService.getWorkspace())) {
			return;
		}

		// When in a temporary workspace, make sure to track folder changes
		// in the history so that these can later be restored.

		for (const folder of e.added) {
			this.addRecentlyOpened([{ folderUri: folder.uri }]);
		}
	}

	private addWorkspaceToRecentlyOpened(): void {
		const workspace = this.contextService.getWorkspace();
		const remoteAuthority = this.environmentService.remoteAuthority;
		switch (this.contextService.getWorkbenchState()) {
			case WorkbenchState.FOLDER:
				this.addRecentlyOpened([{ folderUri: workspace.folders[0].uri, remoteAuthority }]);
				break;
			case WorkbenchState.WORKSPACE:
				this.addRecentlyOpened([{ workspace: { id: workspace.id, configPath: workspace.configuration! }, remoteAuthority }]);
				break;
		}
	}

	//#region Workspaces History

	async getRecentlyOpened(): Promise<IRecentlyOpened> {
		const recentlyOpenedRaw = this.storageService.get(BrowserWorkspacesService.RECENTLY_OPENED_KEY, StorageScope.APPLICATION);
		if (recentlyOpenedRaw) {
			const recentlyOpened = restoreRecentlyOpened(JSON.parse(recentlyOpenedRaw), this.logService);
			recentlyOpened.workspaces = recentlyOpened.workspaces.filter(recent => {

				// In web, unless we are in a temporary workspace, we cannot support
				// to switch to local folders because this would require a window
				// reload and local file access only works with explicit user gesture
				// from the current session.
				if (isRecentFolder(recent) && recent.folderUri.scheme === Schemas.file && !isTemporaryWorkspace(this.contextService.getWorkspace())) {
					return false;
				}

				// Never offer temporary workspaces in the history
				if (isRecentWorkspace(recent) && isTemporaryWorkspace(recent.workspace.configPath)) {
					return false;
				}

				return true;
			});

			return recentlyOpened;
		}

		return { workspaces: [], files: [] };
	}

	async addRecentlyOpened(recents: IRecent[]): Promise<void> {
		const recentlyOpened = await this.getRecentlyOpened();

		for (const recent of recents) {
			if (isRecentFile(recent)) {
				this.doRemoveRecentlyOpened(recentlyOpened, [recent.fileUri]);
				recentlyOpened.files.unshift(recent);
			} else if (isRecentFolder(recent)) {
				this.doRemoveRecentlyOpened(recentlyOpened, [recent.folderUri]);
				recentlyOpened.workspaces.unshift(recent);
			} else {
				this.doRemoveRecentlyOpened(recentlyOpened, [recent.workspace.configPath]);
				recentlyOpened.workspaces.unshift(recent);
			}
		}

		return this.saveRecentlyOpened(recentlyOpened);
	}

	async removeRecentlyOpened(paths: URI[]): Promise<void> {
		const recentlyOpened = await this.getRecentlyOpened();

		this.doRemoveRecentlyOpened(recentlyOpened, paths);

		return this.saveRecentlyOpened(recentlyOpened);
	}

	private doRemoveRecentlyOpened(recentlyOpened: IRecentlyOpened, paths: URI[]): void {
		recentlyOpened.files = recentlyOpened.files.filter(file => {
			return !paths.some(path => path.toString() === file.fileUri.toString());
		});

		recentlyOpened.workspaces = recentlyOpened.workspaces.filter(workspace => {
			return !paths.some(path => path.toString() === (isRecentFolder(workspace) ? workspace.folderUri.toString() : workspace.workspace.configPath.toString()));
		});
	}

	private async saveRecentlyOpened(data: IRecentlyOpened): Promise<void> {
		return this.storageService.store(BrowserWorkspacesService.RECENTLY_OPENED_KEY, JSON.stringify(toStoreData(data)), StorageScope.APPLICATION, StorageTarget.USER);
	}

	async clearRecentlyOpened(): Promise<void> {
		this.storageService.remove(BrowserWorkspacesService.RECENTLY_OPENED_KEY, StorageScope.APPLICATION);
	}

	//#endregion

	//#region Workspace Management

	async enterWorkspace(workspaceUri: URI): Promise<IEnterWorkspaceResult | undefined> {
		return { workspace: await this.getWorkspaceIdentifier(workspaceUri) };
	}

	async createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier> {
		const randomId = (Date.now() + Math.round(Math.random() * 1000)).toString();
		const newUntitledWorkspacePath = joinPath(this.environmentService.untitledWorkspacesHome, `Untitled-${randomId}.${WORKSPACE_EXTENSION}`);

		// Build array of workspace folders to store
		const storedWorkspaceFolder: IStoredWorkspaceFolder[] = [];
		if (folders) {
			for (const folder of folders) {
				storedWorkspaceFolder.push(getStoredWorkspaceFolder(folder.uri, true, folder.name, this.environmentService.untitledWorkspacesHome, this.uriIdentityService.extUri));
			}
		}

		// Store at untitled workspaces location
		const storedWorkspace: IStoredWorkspace = { folders: storedWorkspaceFolder, remoteAuthority };
		await this.fileService.writeFile(newUntitledWorkspacePath, VSBuffer.fromString(JSON.stringify(storedWorkspace, null, '\t')));

		return this.getWorkspaceIdentifier(newUntitledWorkspacePath);
	}

	async deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void> {
		try {
			await this.fileService.del(workspace.configPath);
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				throw error; // re-throw any other error than file not found which is OK
			}
		}
	}

	async getWorkspaceIdentifier(workspaceUri: URI): Promise<IWorkspaceIdentifier> {
		return getWorkspaceIdentifier(workspaceUri);
	}

	//#endregion


	//#region Dirty Workspaces

	async getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>> {
		return []; // Currently not supported in web
	}

	//#endregion
}

registerSingleton(IWorkspacesService, BrowserWorkspacesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/browser/workspaceTrustEditorInput.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/browser/workspaceTrustEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Schemas } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';

const WorkspaceTrustEditorIcon = registerIcon('workspace-trust-editor-label-icon', Codicon.shield, localize('workspaceTrustEditorLabelIcon', 'Icon of the workspace trust editor label.'));

export class WorkspaceTrustEditorInput extends EditorInput {
	static readonly ID: string = 'workbench.input.workspaceTrust';

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton;
	}

	override get typeId(): string {
		return WorkspaceTrustEditorInput.ID;
	}

	readonly resource: URI = URI.from({
		scheme: Schemas.vscodeWorkspaceTrust,
		path: `workspaceTrustEditor`
	});

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(otherInput) || otherInput instanceof WorkspaceTrustEditorInput;
	}

	override getName(): string {
		return localize('workspaceTrustEditorInputName', "Workspace Trust");
	}

	override getIcon(): ThemeIcon {
		return WorkspaceTrustEditorIcon;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/canonicalUriService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/canonicalUriService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ICanonicalUriService, ICanonicalUriProvider } from '../../../../platform/workspace/common/canonicalUri.js';

export class CanonicalUriService implements ICanonicalUriService {
	declare readonly _serviceBrand: undefined;

	private readonly _providers = new Map<string, ICanonicalUriProvider>();

	registerCanonicalUriProvider(provider: ICanonicalUriProvider): IDisposable {
		this._providers.set(provider.scheme, provider);
		return {
			dispose: () => this._providers.delete(provider.scheme)
		};
	}

	async provideCanonicalUri(uri: URI, targetScheme: string, token: CancellationToken): Promise<URI | undefined> {
		const provider = this._providers.get(uri.scheme);
		if (provider) {
			return provider.provideCanonicalUri(uri, targetScheme, token);
		}
		return undefined;
	}
}

registerSingleton(ICanonicalUriService, CanonicalUriService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/editSessionIdentityService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/editSessionIdentityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { insert } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { EditSessionIdentityMatch, IEditSessionIdentityCreateParticipant, IEditSessionIdentityProvider, IEditSessionIdentityService } from '../../../../platform/workspace/common/editSessions.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IExtensionService } from '../../extensions/common/extensions.js';

export class EditSessionIdentityService implements IEditSessionIdentityService {
	readonly _serviceBrand: undefined;

	private _editSessionIdentifierProviders = new Map<string, IEditSessionIdentityProvider>();

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService,
	) { }

	registerEditSessionIdentityProvider(provider: IEditSessionIdentityProvider): IDisposable {
		if (this._editSessionIdentifierProviders.get(provider.scheme)) {
			throw new Error(`A provider has already been registered for scheme ${provider.scheme}`);
		}

		this._editSessionIdentifierProviders.set(provider.scheme, provider);
		return toDisposable(() => {
			this._editSessionIdentifierProviders.delete(provider.scheme);
		});
	}

	async getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, token: CancellationToken): Promise<string | undefined> {
		const { scheme } = workspaceFolder.uri;

		const provider = await this.activateProvider(scheme);
		this._logService.trace(`EditSessionIdentityProvider for scheme ${scheme} available: ${!!provider}`);

		return provider?.getEditSessionIdentifier(workspaceFolder, token);
	}

	async provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, cancellationToken: CancellationToken): Promise<EditSessionIdentityMatch | undefined> {
		const { scheme } = workspaceFolder.uri;

		const provider = await this.activateProvider(scheme);
		this._logService.trace(`EditSessionIdentityProvider for scheme ${scheme} available: ${!!provider}`);

		return provider?.provideEditSessionIdentityMatch?.(workspaceFolder, identity1, identity2, cancellationToken);
	}

	async onWillCreateEditSessionIdentity(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void> {
		this._logService.debug('Running onWillCreateEditSessionIdentity participants...');

		// TODO@joyceerhl show progress notification?
		for (const participant of this._participants) {
			await participant.participate(workspaceFolder, cancellationToken);
		}

		this._logService.debug(`Done running ${this._participants.length} onWillCreateEditSessionIdentity participants.`);
	}

	private _participants: IEditSessionIdentityCreateParticipant[] = [];

	addEditSessionIdentityCreateParticipant(participant: IEditSessionIdentityCreateParticipant): IDisposable {
		const dispose = insert(this._participants, participant);

		return toDisposable(() => dispose());
	}

	private async activateProvider(scheme: string) {
		const transformedScheme = scheme === 'vscode-remote' ? 'file' : scheme;

		const provider = this._editSessionIdentifierProviders.get(scheme);
		if (provider) {
			return provider;
		}

		await this._extensionService.activateByEvent(`onEditSession:${transformedScheme}`);
		return this._editSessionIdentifierProviders.get(scheme);
	}
}

registerSingleton(IEditSessionIdentityService, EditSessionIdentityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/workspaceEditing.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/workspaceEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceFolderCreationData } from '../../../../platform/workspaces/common/workspaces.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';

export const IWorkspaceEditingService = createDecorator<IWorkspaceEditingService>('workspaceEditingService');

export interface IWorkspaceEditingService {

	readonly _serviceBrand: undefined;

	/**
	 * Add folders to the existing workspace.
	 * When `donotNotifyError` is `true`, error will be bubbled up otherwise, the service handles the error with proper message and action
	 */
	addFolders(folders: IWorkspaceFolderCreationData[], donotNotifyError?: boolean): Promise<void>;

	/**
	 * Remove folders from the existing workspace
	 * When `donotNotifyError` is `true`, error will be bubbled up otherwise, the service handles the error with proper message and action
	 */
	removeFolders(folders: URI[], donotNotifyError?: boolean): Promise<void>;

	/**
	 * Allows to add and remove folders to the existing workspace at once.
	 * When `donotNotifyError` is `true`, error will be bubbled up otherwise, the service handles the error with proper message and action
	 */
	updateFolders(index: number, deleteCount?: number, foldersToAdd?: IWorkspaceFolderCreationData[], donotNotifyError?: boolean): Promise<void>;

	/**
	 * Enters the workspace with the provided path.
	 */
	enterWorkspace(path: URI): Promise<void>;

	/**
	 * Creates a new workspace with the provided folders and opens it. if path is provided
	 * the workspace will be saved into that location.
	 */
	createAndEnterWorkspace(folders: IWorkspaceFolderCreationData[], path?: URI): Promise<void>;

	/**
	 * Saves the current workspace to the provided path and opens it. requires a workspace to be opened.
	 */
	saveAndEnterWorkspace(path: URI): Promise<void>;

	/**
	 * Copies current workspace settings to the target workspace.
	 */
	copyWorkspaceSettings(toWorkspace: IWorkspaceIdentifier): Promise<void>;

	/**
	 * Picks a new workspace path
	 */
	pickNewWorkspacePath(): Promise<URI | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/workspaceIdentityService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/workspaceIdentityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isEqualOrParent, joinPath, relativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceStateFolder } from '../../../../platform/userDataSync/common/userDataSync.js';
import { EditSessionIdentityMatch, IEditSessionIdentityService } from '../../../../platform/workspace/common/editSessions.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';

export const IWorkspaceIdentityService = createDecorator<IWorkspaceIdentityService>('IWorkspaceIdentityService');
export interface IWorkspaceIdentityService {
	_serviceBrand: undefined;
	matches(folders: IWorkspaceStateFolder[], cancellationToken: CancellationToken): Promise<((obj: unknown) => unknown) | false>;
	getWorkspaceStateFolders(cancellationToken: CancellationToken): Promise<IWorkspaceStateFolder[]>;
}

export class WorkspaceIdentityService implements IWorkspaceIdentityService {
	declare _serviceBrand: undefined;

	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IEditSessionIdentityService private readonly editSessionIdentityService: IEditSessionIdentityService
	) { }

	async getWorkspaceStateFolders(cancellationToken: CancellationToken): Promise<IWorkspaceStateFolder[]> {
		const workspaceStateFolders: IWorkspaceStateFolder[] = [];

		for (const workspaceFolder of this.workspaceContextService.getWorkspace().folders) {
			const workspaceFolderIdentity = await this.editSessionIdentityService.getEditSessionIdentifier(workspaceFolder, cancellationToken);
			if (!workspaceFolderIdentity) { continue; }
			workspaceStateFolders.push({ resourceUri: workspaceFolder.uri.toString(), workspaceFolderIdentity });
		}

		return workspaceStateFolders;
	}

	async matches(incomingWorkspaceFolders: IWorkspaceStateFolder[], cancellationToken: CancellationToken): Promise<((value: unknown) => unknown) | false> {
		const incomingToCurrentWorkspaceFolderUris: { [key: string]: string } = {};

		const incomingIdentitiesToIncomingWorkspaceFolders: { [key: string]: string } = {};
		for (const workspaceFolder of incomingWorkspaceFolders) {
			incomingIdentitiesToIncomingWorkspaceFolders[workspaceFolder.workspaceFolderIdentity] = workspaceFolder.resourceUri;
		}

		// Precompute the identities of the current workspace folders
		const currentWorkspaceFoldersToIdentities = new Map<IWorkspaceFolder, string>();
		for (const workspaceFolder of this.workspaceContextService.getWorkspace().folders) {
			const workspaceFolderIdentity = await this.editSessionIdentityService.getEditSessionIdentifier(workspaceFolder, cancellationToken);
			if (!workspaceFolderIdentity) { continue; }
			currentWorkspaceFoldersToIdentities.set(workspaceFolder, workspaceFolderIdentity);
		}

		// Match the current workspace folders to the incoming workspace folders
		for (const [currentWorkspaceFolder, currentWorkspaceFolderIdentity] of currentWorkspaceFoldersToIdentities.entries()) {

			// Happy case: identities do not need further disambiguation
			const incomingWorkspaceFolder = incomingIdentitiesToIncomingWorkspaceFolders[currentWorkspaceFolderIdentity];
			if (incomingWorkspaceFolder) {
				// There is an incoming workspace folder with the exact same identity as the current workspace folder
				incomingToCurrentWorkspaceFolderUris[incomingWorkspaceFolder] = currentWorkspaceFolder.uri.toString();
				continue;
			}

			// Unhappy case: compare the identity of the current workspace folder to all incoming workspace folder identities
			let hasCompleteMatch = false;
			for (const [incomingIdentity, incomingFolder] of Object.entries(incomingIdentitiesToIncomingWorkspaceFolders)) {
				if (await this.editSessionIdentityService.provideEditSessionIdentityMatch(currentWorkspaceFolder, currentWorkspaceFolderIdentity, incomingIdentity, cancellationToken) === EditSessionIdentityMatch.Complete) {
					incomingToCurrentWorkspaceFolderUris[incomingFolder] = currentWorkspaceFolder.uri.toString();
					hasCompleteMatch = true;
					break;
				}
			}

			if (hasCompleteMatch) {
				continue;
			}

			return false;
		}

		const convertUri = (uriToConvert: URI) => {
			// Figure out which current folder the incoming URI is a child of
			for (const incomingFolderUriKey of Object.keys(incomingToCurrentWorkspaceFolderUris)) {
				const incomingFolderUri = URI.parse(incomingFolderUriKey);
				if (isEqualOrParent(incomingFolderUri, uriToConvert)) {
					const currentWorkspaceFolderUri = incomingToCurrentWorkspaceFolderUris[incomingFolderUriKey];

					// Compute the relative file path section of the uri to convert relative to the folder it came from
					const relativeFilePath = relativePath(incomingFolderUri, uriToConvert);

					// Reparent the relative file path under the current workspace folder it belongs to
					if (relativeFilePath) {
						return joinPath(URI.parse(currentWorkspaceFolderUri), relativeFilePath);
					}
				}
			}

			// No conversion was possible; return the original URI
			return uriToConvert;
		};

		// Recursively look for any URIs in the provided object and
		// replace them with the URIs of the current workspace folders
		const uriReplacer = (obj: unknown, depth = 0) => {
			if (!obj || depth > 200) {
				return obj;
			}

			if (obj instanceof VSBuffer || obj instanceof Uint8Array) {
				return obj;
			}

			if (URI.isUri(obj)) {
				return convertUri(obj);
			}

			if (Array.isArray(obj)) {
				for (let i = 0; i < obj.length; ++i) {
					obj[i] = uriReplacer(obj[i], depth + 1);
				}
			} else {
				// walk object
				for (const key in obj) {
					if (Object.hasOwnProperty.call(obj, key)) {
						(obj as Record<string, unknown>)[key] = uriReplacer((obj as Record<string, unknown>)[key], depth + 1);
					}
				}
			}

			return obj;
		};

		return uriReplacer;
	}
}

registerSingleton(IWorkspaceIdentityService, WorkspaceIdentityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/workspaceTrust.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/workspaceTrust.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { IPath } from '../../../../platform/window/common/window.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IRemoteAuthorityResolverService, ResolverResult } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { getRemoteAuthority } from '../../../../platform/remote/common/remoteHosts.js';
import { isVirtualResource } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ISingleFolderWorkspaceIdentifier, isSavedWorkspace, isSingleFolderWorkspaceIdentifier, isTemporaryWorkspace, IWorkspace, IWorkspaceContextService, IWorkspaceFolder, toWorkspaceIdentifier, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { WorkspaceTrustRequestOptions, IWorkspaceTrustManagementService, IWorkspaceTrustInfo, IWorkspaceTrustUriInfo, IWorkspaceTrustRequestService, IWorkspaceTrustTransitionParticipant, WorkspaceTrustUriResponse, IWorkspaceTrustEnablementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { Memento } from '../../../common/memento.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isEqualAuthority } from '../../../../base/common/resources.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { promiseWithResolvers } from '../../../../base/common/async.js';

export const WORKSPACE_TRUST_ENABLED = 'security.workspace.trust.enabled';
export const WORKSPACE_TRUST_STARTUP_PROMPT = 'security.workspace.trust.startupPrompt';
export const WORKSPACE_TRUST_BANNER = 'security.workspace.trust.banner';
export const WORKSPACE_TRUST_UNTRUSTED_FILES = 'security.workspace.trust.untrustedFiles';
export const WORKSPACE_TRUST_EMPTY_WINDOW = 'security.workspace.trust.emptyWindow';
export const WORKSPACE_TRUST_EXTENSION_SUPPORT = 'extensions.supportUntrustedWorkspaces';
export const WORKSPACE_TRUST_STORAGE_KEY = 'content.trust.model.key';

export class CanonicalWorkspace implements IWorkspace {
	constructor(
		private readonly originalWorkspace: IWorkspace,
		private readonly canonicalFolderUris: URI[],
		private readonly canonicalConfiguration: URI | null | undefined
	) { }


	get folders(): IWorkspaceFolder[] {
		return this.originalWorkspace.folders.map((folder, index) => {
			return {
				index: folder.index,
				name: folder.name,
				toResource: folder.toResource,
				uri: this.canonicalFolderUris[index]
			};
		});
	}

	get transient(): boolean | undefined {
		return this.originalWorkspace.transient;
	}

	get configuration(): URI | null | undefined {
		return this.canonicalConfiguration ?? this.originalWorkspace.configuration;
	}

	get id(): string {
		return this.originalWorkspace.id;
	}
}

export class WorkspaceTrustEnablementService extends Disposable implements IWorkspaceTrustEnablementService {

	_serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService
	) {
		super();
	}

	isWorkspaceTrustEnabled(): boolean {
		if (this.environmentService.disableWorkspaceTrust) {
			return false;
		}

		return !!this.configurationService.getValue(WORKSPACE_TRUST_ENABLED);
	}
}

export class WorkspaceTrustManagementService extends Disposable implements IWorkspaceTrustManagementService {

	_serviceBrand: undefined;

	private readonly storageKey = WORKSPACE_TRUST_STORAGE_KEY;

	private readonly _workspaceResolvedPromise: Promise<void>;
	private readonly _workspaceResolvedPromiseResolve: () => void;
	private readonly _workspaceTrustInitializedPromise: Promise<void>;
	private readonly _workspaceTrustInitializedPromiseResolve: () => void;

	private readonly _onDidChangeTrust = this._register(new Emitter<boolean>());
	readonly onDidChangeTrust = this._onDidChangeTrust.event;

	private readonly _onDidChangeTrustedFolders = this._register(new Emitter<void>());
	readonly onDidChangeTrustedFolders = this._onDidChangeTrustedFolders.event;

	private _canonicalStartupFiles: URI[] = [];
	private _canonicalWorkspace: IWorkspace;
	private _canonicalUrisResolved: boolean;

	private _isTrusted: boolean;
	private _trustStateInfo: IWorkspaceTrustInfo;
	private _remoteAuthority: ResolverResult | undefined;

	private readonly _storedTrustState: WorkspaceTrustMemento;
	private readonly _trustTransitionManager: WorkspaceTrustTransitionManager;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IStorageService private readonly storageService: IStorageService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IWorkspaceTrustEnablementService private readonly workspaceTrustEnablementService: IWorkspaceTrustEnablementService,
		@IFileService private readonly fileService: IFileService
	) {
		super();

		this._canonicalUrisResolved = false;
		this._canonicalWorkspace = this.workspaceService.getWorkspace();

		({ promise: this._workspaceResolvedPromise, resolve: this._workspaceResolvedPromiseResolve } = promiseWithResolvers());
		({ promise: this._workspaceTrustInitializedPromise, resolve: this._workspaceTrustInitializedPromiseResolve } = promiseWithResolvers());

		this._storedTrustState = new WorkspaceTrustMemento(isWeb && this.isEmptyWorkspace() ? undefined : this.storageService);
		this._trustTransitionManager = this._register(new WorkspaceTrustTransitionManager());

		this._trustStateInfo = this.loadTrustInfo();
		this._isTrusted = this.calculateWorkspaceTrust();

		this.initializeWorkspaceTrust();
		this.registerListeners();
	}

	//#region initialize

	private initializeWorkspaceTrust(): void {
		// Resolve canonical Uris
		this.resolveCanonicalUris()
			.then(async () => {
				this._canonicalUrisResolved = true;
				await this.updateWorkspaceTrust();
			})
			.finally(() => {
				this._workspaceResolvedPromiseResolve();

				if (!this.environmentService.remoteAuthority) {
					this._workspaceTrustInitializedPromiseResolve();
				}
			});

		// Remote - resolve remote authority
		if (this.environmentService.remoteAuthority) {
			this.remoteAuthorityResolverService.resolveAuthority(this.environmentService.remoteAuthority)
				.then(async result => {
					this._remoteAuthority = result;
					await this.fileService.activateProvider(Schemas.vscodeRemote);
					await this.updateWorkspaceTrust();
				})
				.finally(() => {
					this._workspaceTrustInitializedPromiseResolve();
				});
		}

		// Empty workspace - save initial state to memento
		if (this.isEmptyWorkspace()) {
			this._workspaceTrustInitializedPromise.then(() => {
				if (this._storedTrustState.isEmptyWorkspaceTrusted === undefined) {
					this._storedTrustState.isEmptyWorkspaceTrusted = this.isWorkspaceTrusted();
				}
			});
		}
	}

	//#endregion

	//#region private interface

	private registerListeners(): void {
		this._register(this.workspaceService.onDidChangeWorkspaceFolders(async () => await this.updateWorkspaceTrust()));
		this._register(this.storageService.onDidChangeValue(StorageScope.APPLICATION, this.storageKey, this._store)(async () => {
			/* This will only execute if storage was changed by a user action in a separate window */
			if (JSON.stringify(this._trustStateInfo) !== JSON.stringify(this.loadTrustInfo())) {
				this._trustStateInfo = this.loadTrustInfo();
				this._onDidChangeTrustedFolders.fire();

				await this.updateWorkspaceTrust();
			}
		}));
	}

	private async getCanonicalUri(uri: URI): Promise<URI> {
		let canonicalUri = uri;
		if (this.environmentService.remoteAuthority && uri.scheme === Schemas.vscodeRemote) {
			canonicalUri = await this.remoteAuthorityResolverService.getCanonicalURI(uri);
		} else if (uri.scheme === 'vscode-vfs') {
			const index = uri.authority.indexOf('+');
			if (index !== -1) {
				canonicalUri = uri.with({ authority: uri.authority.substr(0, index) });
			}
		}

		// ignore query and fragent section of uris always
		return canonicalUri.with({ query: null, fragment: null });
	}

	private async resolveCanonicalUris(): Promise<void> {
		// Open editors
		const filesToOpen: IPath[] = [];
		if (this.environmentService.filesToOpenOrCreate) {
			filesToOpen.push(...this.environmentService.filesToOpenOrCreate);
		}

		if (this.environmentService.filesToDiff) {
			filesToOpen.push(...this.environmentService.filesToDiff);
		}

		if (this.environmentService.filesToMerge) {
			filesToOpen.push(...this.environmentService.filesToMerge);
		}

		if (filesToOpen.length) {
			const filesToOpenOrCreateUris = filesToOpen.filter(f => !!f.fileUri).map(f => f.fileUri!);
			const canonicalFilesToOpen = await Promise.all(filesToOpenOrCreateUris.map(uri => this.getCanonicalUri(uri)));

			this._canonicalStartupFiles.push(...canonicalFilesToOpen.filter(uri => this._canonicalStartupFiles.every(u => !this.uriIdentityService.extUri.isEqual(uri, u))));
		}

		// Workspace
		const workspaceUris = this.workspaceService.getWorkspace().folders.map(f => f.uri);
		const canonicalWorkspaceFolders = await Promise.all(workspaceUris.map(uri => this.getCanonicalUri(uri)));

		let canonicalWorkspaceConfiguration = this.workspaceService.getWorkspace().configuration;
		if (canonicalWorkspaceConfiguration && isSavedWorkspace(canonicalWorkspaceConfiguration, this.environmentService)) {
			canonicalWorkspaceConfiguration = await this.getCanonicalUri(canonicalWorkspaceConfiguration);
		}

		this._canonicalWorkspace = new CanonicalWorkspace(this.workspaceService.getWorkspace(), canonicalWorkspaceFolders, canonicalWorkspaceConfiguration);
	}

	private loadTrustInfo(): IWorkspaceTrustInfo {
		const infoAsString = this.storageService.get(this.storageKey, StorageScope.APPLICATION);

		let result: IWorkspaceTrustInfo | undefined;
		try {
			if (infoAsString) {
				result = JSON.parse(infoAsString);
			}
		} catch { }

		if (!result) {
			result = {
				uriTrustInfo: []
			};
		}

		if (!result.uriTrustInfo) {
			result.uriTrustInfo = [];
		}

		result.uriTrustInfo = result.uriTrustInfo.map(info => { return { uri: URI.revive(info.uri), trusted: info.trusted }; });
		result.uriTrustInfo = result.uriTrustInfo.filter(info => info.trusted);

		return result;
	}

	private async saveTrustInfo(): Promise<void> {
		this.storageService.store(this.storageKey, JSON.stringify(this._trustStateInfo), StorageScope.APPLICATION, StorageTarget.MACHINE);
		this._onDidChangeTrustedFolders.fire();

		await this.updateWorkspaceTrust();
	}

	private getWorkspaceUris(): URI[] {
		const workspaceUris = this._canonicalWorkspace.folders.map(f => f.uri);
		const workspaceConfiguration = this._canonicalWorkspace.configuration;
		if (workspaceConfiguration && isSavedWorkspace(workspaceConfiguration, this.environmentService)) {
			workspaceUris.push(workspaceConfiguration);
		}

		return workspaceUris;
	}

	private calculateWorkspaceTrust(): boolean {
		// Feature is disabled
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			return true;
		}

		// Canonical Uris not yet resolved
		if (!this._canonicalUrisResolved) {
			return false;
		}

		// Remote - resolver explicitly sets workspace trust to TRUE
		if (this.environmentService.remoteAuthority && this._remoteAuthority?.options?.isTrusted) {
			return this._remoteAuthority.options.isTrusted;
		}

		// Empty workspace - use memento, open ediors, or user setting
		if (this.isEmptyWorkspace()) {
			// Use memento if present
			if (this._storedTrustState.isEmptyWorkspaceTrusted !== undefined) {
				return this._storedTrustState.isEmptyWorkspaceTrusted;
			}

			// Startup files
			if (this._canonicalStartupFiles.length) {
				return this.getUrisTrust(this._canonicalStartupFiles);
			}

			// User setting
			return !!this.configurationService.getValue(WORKSPACE_TRUST_EMPTY_WINDOW);
		}

		return this.getUrisTrust(this.getWorkspaceUris());
	}

	private async updateWorkspaceTrust(trusted?: boolean): Promise<void> {
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			return;
		}

		if (trusted === undefined) {
			await this.resolveCanonicalUris();
			trusted = this.calculateWorkspaceTrust();
		}

		if (this.isWorkspaceTrusted() === trusted) { return; }

		// Update workspace trust
		this.isTrusted = trusted;

		// Run workspace trust transition participants
		await this._trustTransitionManager.participate(trusted);

		// Fire workspace trust change event
		this._onDidChangeTrust.fire(trusted);
	}

	private getUrisTrust(uris: URI[]): boolean {
		let state = true;
		for (const uri of uris) {
			const { trusted } = this.doGetUriTrustInfo(uri);

			if (!trusted) {
				state = trusted;
				return state;
			}
		}

		return state;
	}

	private doGetUriTrustInfo(uri: URI): IWorkspaceTrustUriInfo {
		// Return trusted when workspace trust is disabled
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			return { trusted: true, uri };
		}

		if (this.isTrustedVirtualResource(uri)) {
			return { trusted: true, uri };
		}

		if (this.isTrustedByRemote(uri)) {
			return { trusted: true, uri };
		}

		let resultState = false;
		let maxLength = -1;

		let resultUri = uri;

		for (const trustInfo of this._trustStateInfo.uriTrustInfo) {
			if (this.uriIdentityService.extUri.isEqualOrParent(uri, trustInfo.uri)) {
				const fsPath = trustInfo.uri.fsPath;
				if (fsPath.length > maxLength) {
					maxLength = fsPath.length;
					resultState = trustInfo.trusted;
					resultUri = trustInfo.uri;
				}
			}
		}

		return { trusted: resultState, uri: resultUri };
	}

	private async doSetUrisTrust(uris: URI[], trusted: boolean): Promise<void> {
		let changed = false;

		for (const uri of uris) {
			if (trusted) {
				if (this.isTrustedVirtualResource(uri)) {
					continue;
				}

				if (this.isTrustedByRemote(uri)) {
					continue;
				}

				const foundItem = this._trustStateInfo.uriTrustInfo.find(trustInfo => this.uriIdentityService.extUri.isEqual(trustInfo.uri, uri));
				if (!foundItem) {
					this._trustStateInfo.uriTrustInfo.push({ uri, trusted: true });
					changed = true;
				}
			} else {
				const previousLength = this._trustStateInfo.uriTrustInfo.length;
				this._trustStateInfo.uriTrustInfo = this._trustStateInfo.uriTrustInfo.filter(trustInfo => !this.uriIdentityService.extUri.isEqual(trustInfo.uri, uri));
				if (previousLength !== this._trustStateInfo.uriTrustInfo.length) {
					changed = true;
				}
			}
		}

		if (changed) {
			await this.saveTrustInfo();
		}
	}

	private isEmptyWorkspace(): boolean {
		if (this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return true;
		}

		const workspace = this.workspaceService.getWorkspace();
		if (workspace) {
			return isTemporaryWorkspace(this.workspaceService.getWorkspace()) && workspace.folders.length === 0;
		}

		return false;
	}

	private isTrustedVirtualResource(uri: URI): boolean {
		return isVirtualResource(uri) && uri.scheme !== 'vscode-vfs';
	}

	private isTrustedByRemote(uri: URI): boolean {
		if (!this.environmentService.remoteAuthority) {
			return false;
		}

		if (!this._remoteAuthority) {
			return false;
		}

		return (isEqualAuthority(getRemoteAuthority(uri), this._remoteAuthority.authority.authority)) && !!this._remoteAuthority.options?.isTrusted;
	}

	private set isTrusted(value: boolean) {
		this._isTrusted = value;

		// Reset acceptsOutOfWorkspaceFiles
		if (!value) {
			this._storedTrustState.acceptsOutOfWorkspaceFiles = false;
		}

		// Empty workspace - save memento
		if (this.isEmptyWorkspace()) {
			this._storedTrustState.isEmptyWorkspaceTrusted = value;
		}
	}

	//#endregion

	//#region public interface

	get workspaceResolved(): Promise<void> {
		return this._workspaceResolvedPromise;
	}

	get workspaceTrustInitialized(): Promise<void> {
		return this._workspaceTrustInitializedPromise;
	}

	get acceptsOutOfWorkspaceFiles(): boolean {
		return this._storedTrustState.acceptsOutOfWorkspaceFiles;
	}

	set acceptsOutOfWorkspaceFiles(value: boolean) {
		this._storedTrustState.acceptsOutOfWorkspaceFiles = value;
	}

	isWorkspaceTrusted(): boolean {
		return this._isTrusted;
	}

	isWorkspaceTrustForced(): boolean {
		// Remote - remote authority explicitly sets workspace trust
		if (this.environmentService.remoteAuthority && this._remoteAuthority?.options?.isTrusted !== undefined) {
			return true;
		}

		// All workspace uris are trusted automatically
		const workspaceUris = this.getWorkspaceUris().filter(uri => !this.isTrustedVirtualResource(uri));
		if (workspaceUris.length === 0) {
			return true;
		}

		return false;
	}

	canSetParentFolderTrust(): boolean {
		const workspaceIdentifier = toWorkspaceIdentifier(this._canonicalWorkspace);

		if (!isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
			return false;
		}

		if (workspaceIdentifier.uri.scheme !== Schemas.file && workspaceIdentifier.uri.scheme !== Schemas.vscodeRemote) {
			return false;
		}

		const parentFolder = this.uriIdentityService.extUri.dirname(workspaceIdentifier.uri);
		if (this.uriIdentityService.extUri.isEqual(workspaceIdentifier.uri, parentFolder)) {
			return false;
		}

		return true;
	}

	async setParentFolderTrust(trusted: boolean): Promise<void> {
		if (this.canSetParentFolderTrust()) {
			const workspaceUri = (toWorkspaceIdentifier(this._canonicalWorkspace) as ISingleFolderWorkspaceIdentifier).uri;
			const parentFolder = this.uriIdentityService.extUri.dirname(workspaceUri);

			await this.setUrisTrust([parentFolder], trusted);
		}
	}

	canSetWorkspaceTrust(): boolean {
		// Remote - remote authority not yet resolved, or remote authority explicitly sets workspace trust
		if (this.environmentService.remoteAuthority && (!this._remoteAuthority || this._remoteAuthority.options?.isTrusted !== undefined)) {
			return false;
		}

		// Empty workspace
		if (this.isEmptyWorkspace()) {
			return true;
		}

		// All workspace uris are trusted automatically
		const workspaceUris = this.getWorkspaceUris().filter(uri => !this.isTrustedVirtualResource(uri));
		if (workspaceUris.length === 0) {
			return false;
		}

		// Untrusted workspace
		if (!this.isWorkspaceTrusted()) {
			return true;
		}

		// Trusted workspaces
		// Can only untrusted in the single folder scenario
		const workspaceIdentifier = toWorkspaceIdentifier(this._canonicalWorkspace);
		if (!isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
			return false;
		}

		// Can only be untrusted in certain schemes
		if (workspaceIdentifier.uri.scheme !== Schemas.file && workspaceIdentifier.uri.scheme !== 'vscode-vfs') {
			return false;
		}

		// If the current folder isn't trusted directly, return false
		const trustInfo = this.doGetUriTrustInfo(workspaceIdentifier.uri);
		if (!trustInfo.trusted || !this.uriIdentityService.extUri.isEqual(workspaceIdentifier.uri, trustInfo.uri)) {
			return false;
		}

		// Check if the parent is also trusted
		if (this.canSetParentFolderTrust()) {
			const parentFolder = this.uriIdentityService.extUri.dirname(workspaceIdentifier.uri);
			const parentPathTrustInfo = this.doGetUriTrustInfo(parentFolder);
			if (parentPathTrustInfo.trusted) {
				return false;
			}
		}

		return true;
	}

	async setWorkspaceTrust(trusted: boolean): Promise<void> {
		// Empty workspace
		if (this.isEmptyWorkspace()) {
			await this.updateWorkspaceTrust(trusted);
			return;
		}

		const workspaceFolders = this.getWorkspaceUris();
		await this.setUrisTrust(workspaceFolders, trusted);
	}

	async getUriTrustInfo(uri: URI): Promise<IWorkspaceTrustUriInfo> {
		// Return trusted when workspace trust is disabled
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			return { trusted: true, uri };
		}

		// Uri is trusted automatically by the remote
		if (this.isTrustedByRemote(uri)) {
			return { trusted: true, uri };
		}

		return this.doGetUriTrustInfo(await this.getCanonicalUri(uri));
	}

	async setUrisTrust(uris: URI[], trusted: boolean): Promise<void> {
		this.doSetUrisTrust(await Promise.all(uris.map(uri => this.getCanonicalUri(uri))), trusted);
	}

	getTrustedUris(): URI[] {
		return this._trustStateInfo.uriTrustInfo.map(info => info.uri);
	}

	async setTrustedUris(uris: URI[]): Promise<void> {
		this._trustStateInfo.uriTrustInfo = [];
		for (const uri of uris) {
			const canonicalUri = await this.getCanonicalUri(uri);
			const cleanUri = this.uriIdentityService.extUri.removeTrailingPathSeparator(canonicalUri);
			let added = false;
			for (const addedUri of this._trustStateInfo.uriTrustInfo) {
				if (this.uriIdentityService.extUri.isEqual(addedUri.uri, cleanUri)) {
					added = true;
					break;
				}
			}

			if (added) {
				continue;
			}

			this._trustStateInfo.uriTrustInfo.push({
				trusted: true,
				uri: cleanUri
			});
		}

		await this.saveTrustInfo();
	}

	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable {
		return this._trustTransitionManager.addWorkspaceTrustTransitionParticipant(participant);
	}

	//#endregion
}

export class WorkspaceTrustRequestService extends Disposable implements IWorkspaceTrustRequestService {
	_serviceBrand: undefined;

	private _openFilesTrustRequestPromise?: Promise<WorkspaceTrustUriResponse>;
	private _openFilesTrustRequestResolver?: (response: WorkspaceTrustUriResponse) => void;

	private _workspaceTrustRequestPromise?: Promise<boolean | undefined>;
	private _workspaceTrustRequestResolver?: (trusted: boolean | undefined) => void;

	private readonly _onDidInitiateOpenFilesTrustRequest = this._register(new Emitter<void>());
	readonly onDidInitiateOpenFilesTrustRequest = this._onDidInitiateOpenFilesTrustRequest.event;

	private readonly _onDidInitiateWorkspaceTrustRequest = this._register(new Emitter<WorkspaceTrustRequestOptions | undefined>());
	readonly onDidInitiateWorkspaceTrustRequest = this._onDidInitiateWorkspaceTrustRequest.event;

	private readonly _onDidInitiateWorkspaceTrustRequestOnStartup = this._register(new Emitter<void>());
	readonly onDidInitiateWorkspaceTrustRequestOnStartup = this._onDidInitiateWorkspaceTrustRequestOnStartup.event;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService
	) {
		super();
	}

	//#region Open file(s) trust request

	private get untrustedFilesSetting(): 'prompt' | 'open' | 'newWindow' {
		return this.configurationService.getValue(WORKSPACE_TRUST_UNTRUSTED_FILES);
	}

	private set untrustedFilesSetting(value: 'prompt' | 'open' | 'newWindow') {
		this.configurationService.updateValue(WORKSPACE_TRUST_UNTRUSTED_FILES, value);
	}

	async completeOpenFilesTrustRequest(result: WorkspaceTrustUriResponse, saveResponse?: boolean): Promise<void> {
		if (!this._openFilesTrustRequestResolver) {
			return;
		}

		// Set acceptsOutOfWorkspaceFiles
		if (result === WorkspaceTrustUriResponse.Open) {
			this.workspaceTrustManagementService.acceptsOutOfWorkspaceFiles = true;
		}

		// Save response
		if (saveResponse) {
			if (result === WorkspaceTrustUriResponse.Open) {
				this.untrustedFilesSetting = 'open';
			}

			if (result === WorkspaceTrustUriResponse.OpenInNewWindow) {
				this.untrustedFilesSetting = 'newWindow';
			}
		}

		// Resolve promise
		this._openFilesTrustRequestResolver(result);

		this._openFilesTrustRequestResolver = undefined;
		this._openFilesTrustRequestPromise = undefined;
	}

	async requestOpenFilesTrust(uris: URI[]): Promise<WorkspaceTrustUriResponse> {
		// If workspace is untrusted, there is no conflict
		if (!this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			return WorkspaceTrustUriResponse.Open;
		}

		const openFilesTrustInfo = await Promise.all(uris.map(uri => this.workspaceTrustManagementService.getUriTrustInfo(uri)));

		// If all uris are trusted, there is no conflict
		if (openFilesTrustInfo.map(info => info.trusted).every(trusted => trusted)) {
			return WorkspaceTrustUriResponse.Open;
		}

		// If user has setting, don't need to ask
		if (this.untrustedFilesSetting !== 'prompt') {
			if (this.untrustedFilesSetting === 'newWindow') {
				return WorkspaceTrustUriResponse.OpenInNewWindow;
			}

			if (this.untrustedFilesSetting === 'open') {
				return WorkspaceTrustUriResponse.Open;
			}
		}

		// If we already asked the user, don't need to ask again
		if (this.workspaceTrustManagementService.acceptsOutOfWorkspaceFiles) {
			return WorkspaceTrustUriResponse.Open;
		}

		// Create/return a promise
		if (!this._openFilesTrustRequestPromise) {
			this._openFilesTrustRequestPromise = new Promise<WorkspaceTrustUriResponse>(resolve => {
				this._openFilesTrustRequestResolver = resolve;
			});
		} else {
			return this._openFilesTrustRequestPromise;
		}

		this._onDidInitiateOpenFilesTrustRequest.fire();
		return this._openFilesTrustRequestPromise;
	}

	//#endregion

	//#region Workspace trust request

	private resolveWorkspaceTrustRequest(trusted?: boolean): void {
		if (this._workspaceTrustRequestResolver) {
			this._workspaceTrustRequestResolver(trusted ?? this.workspaceTrustManagementService.isWorkspaceTrusted());

			this._workspaceTrustRequestResolver = undefined;
			this._workspaceTrustRequestPromise = undefined;
		}
	}

	cancelWorkspaceTrustRequest(): void {
		if (this._workspaceTrustRequestResolver) {
			this._workspaceTrustRequestResolver(undefined);

			this._workspaceTrustRequestResolver = undefined;
			this._workspaceTrustRequestPromise = undefined;
		}
	}

	async completeWorkspaceTrustRequest(trusted?: boolean): Promise<void> {
		if (trusted === undefined || trusted === this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			this.resolveWorkspaceTrustRequest(trusted);
			return;
		}

		// Register one-time event handler to resolve the promise when workspace trust changed
		Event.once(this.workspaceTrustManagementService.onDidChangeTrust)(trusted => this.resolveWorkspaceTrustRequest(trusted));

		// Update storage, transition workspace state
		await this.workspaceTrustManagementService.setWorkspaceTrust(trusted);
	}

	async requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean | undefined> {
		// Trusted workspace
		if (this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			return this.workspaceTrustManagementService.isWorkspaceTrusted();
		}

		// Modal request
		if (!this._workspaceTrustRequestPromise) {
			// Create promise
			this._workspaceTrustRequestPromise = new Promise(resolve => {
				this._workspaceTrustRequestResolver = resolve;
			});
		} else {
			// Return existing promise
			return this._workspaceTrustRequestPromise;
		}

		this._onDidInitiateWorkspaceTrustRequest.fire(options);
		return this._workspaceTrustRequestPromise;
	}

	requestWorkspaceTrustOnStartup(): void {
		if (!this._workspaceTrustRequestPromise) {
			// Create promise
			this._workspaceTrustRequestPromise = new Promise(resolve => {
				this._workspaceTrustRequestResolver = resolve;
			});
		}

		this._onDidInitiateWorkspaceTrustRequestOnStartup.fire();
	}

	//#endregion
}

class WorkspaceTrustTransitionManager extends Disposable {

	private readonly participants = new LinkedList<IWorkspaceTrustTransitionParticipant>();

	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable {
		const remove = this.participants.push(participant);
		return toDisposable(() => remove());
	}

	async participate(trusted: boolean): Promise<void> {
		for (const participant of this.participants) {
			await participant.participate(trusted);
		}
	}

	override dispose(): void {
		this.participants.clear();
		super.dispose();
	}
}

interface WorkspaceTrustMementoData {
	acceptsOutOfWorkspaceFiles?: boolean;
	isEmptyWorkspaceTrusted?: boolean | undefined;
}

class WorkspaceTrustMemento {

	private readonly _memento?: Memento<WorkspaceTrustMementoData>;
	private readonly _mementoObject: WorkspaceTrustMementoData;

	private readonly _acceptsOutOfWorkspaceFilesKey = 'acceptsOutOfWorkspaceFiles';
	private readonly _isEmptyWorkspaceTrustedKey = 'isEmptyWorkspaceTrusted';

	constructor(storageService?: IStorageService) {
		if (storageService) {
			this._memento = new Memento('workspaceTrust', storageService);
			this._mementoObject = this._memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this._mementoObject = {};
		}
	}

	get acceptsOutOfWorkspaceFiles(): boolean {
		return this._mementoObject[this._acceptsOutOfWorkspaceFilesKey] ?? false;
	}

	set acceptsOutOfWorkspaceFiles(value: boolean) {
		this._mementoObject[this._acceptsOutOfWorkspaceFilesKey] = value;

		this._memento?.saveMemento();
	}

	get isEmptyWorkspaceTrusted(): boolean | undefined {
		return this._mementoObject[this._isEmptyWorkspaceTrustedKey];
	}

	set isEmptyWorkspaceTrusted(value: boolean | undefined) {
		this._mementoObject[this._isEmptyWorkspaceTrustedKey] = value;

		this._memento?.saveMemento();
	}
}

registerSingleton(IWorkspaceTrustRequestService, WorkspaceTrustRequestService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/common/workspaceUtils.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/common/workspaceUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { IFileService } from '../../../../platform/files/common/files.js';

export async function areWorkspaceFoldersEmpty(workspace: IWorkspace, fileService: IFileService): Promise<boolean> {
	for (const folder of workspace.folders) {
		const folderStat = await fileService.resolve(folder.uri);
		if (folderStat.children && folderStat.children.length > 0) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/electron-browser/workspaceEditingService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/electron-browser/workspaceEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IWorkspaceEditingService } from '../common/workspaceEditing.js';
import { URI } from '../../../../base/common/uri.js';
import { hasWorkspaceFileExtension, isUntitledWorkspace, isWorkspaceIdentifier, IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { WorkspaceService } from '../../configuration/browser/configurationService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IWorkingCopyBackupService } from '../../workingCopy/common/workingCopyBackup.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { basename } from '../../../../base/common/resources.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { ILifecycleService, ShutdownReason } from '../../lifecycle/common/lifecycle.js';
import { IFileDialogService, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IHostService } from '../../host/browser/host.js';
import { AbstractWorkspaceEditingService } from '../browser/abstractWorkspaceEditingService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { WorkingCopyBackupService } from '../../workingCopy/common/workingCopyBackupService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchConfigurationService } from '../../configuration/common/configuration.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';

export class NativeWorkspaceEditingService extends AbstractWorkspaceEditingService {

	constructor(
		@IJSONEditingService jsonEditingService: IJSONEditingService,
		@IWorkspaceContextService contextService: WorkspaceService,
		@INativeHostService private nativeHostService: INativeHostService,
		@IWorkbenchConfigurationService configurationService: IWorkbenchConfigurationService,
		@IStorageService private storageService: IStorageService,
		@IExtensionService private extensionService: IExtensionService,
		@IWorkingCopyBackupService private workingCopyBackupService: IWorkingCopyBackupService,
		@INotificationService notificationService: INotificationService,
		@ICommandService commandService: ICommandService,
		@IFileService fileService: IFileService,
		@ITextFileService textFileService: ITextFileService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@IDialogService dialogService: IDialogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ILabelService private readonly labelService: ILabelService,
		@IHostService hostService: IHostService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceTrustManagementService workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
	) {
		super(jsonEditingService, contextService, configurationService, notificationService, commandService, fileService, textFileService, workspacesService, environmentService, fileDialogService, dialogService, hostService, uriIdentityService, workspaceTrustManagementService, userDataProfilesService, userDataProfileService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.lifecycleService.onBeforeShutdown(e => {
			const saveOperation = this.saveUntitledBeforeShutdown(e.reason);
			e.veto(saveOperation, 'veto.untitledWorkspace');
		}));
	}

	private async saveUntitledBeforeShutdown(reason: ShutdownReason): Promise<boolean> {
		if (reason !== ShutdownReason.LOAD && reason !== ShutdownReason.CLOSE) {
			return false; // only interested when window is closing or loading
		}

		const workspaceIdentifier = this.getCurrentWorkspaceIdentifier();
		if (!workspaceIdentifier || !isUntitledWorkspace(workspaceIdentifier.configPath, this.environmentService)) {
			return false; // only care about untitled workspaces to ask for saving
		}

		const windowCount = await this.nativeHostService.getWindowCount();
		if (reason === ShutdownReason.CLOSE && !isMacintosh && windowCount === 1) {
			return false; // Windows/Linux: quits when last window is closed, so do not ask then
		}

		const confirmSaveUntitledWorkspace = this.configurationService.getValue<boolean>('window.confirmSaveUntitledWorkspace') !== false;
		if (!confirmSaveUntitledWorkspace) {
			await this.workspacesService.deleteUntitledWorkspace(workspaceIdentifier);

			return false; // no confirmation configured
		}

		let canceled = false;
		const { result, checkboxChecked } = await this.dialogService.prompt<boolean>({
			type: Severity.Warning,
			message: localize('saveWorkspaceMessage', "Do you want to save your workspace configuration as a file?"),
			detail: localize('saveWorkspaceDetail', "Save your workspace if you plan to open it again."),
			buttons: [
				{
					label: localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save"),
					run: async () => {
						const newWorkspacePath = await this.pickNewWorkspacePath();
						if (!newWorkspacePath || !hasWorkspaceFileExtension(newWorkspacePath)) {
							return true; // keep veto if no target was provided
						}

						try {
							await this.saveWorkspaceAs(workspaceIdentifier, newWorkspacePath);

							// Make sure to add the new workspace to the history to find it again
							const newWorkspaceIdentifier = await this.workspacesService.getWorkspaceIdentifier(newWorkspacePath);
							await this.workspacesService.addRecentlyOpened([{
								label: this.labelService.getWorkspaceLabel(newWorkspaceIdentifier, { verbose: Verbosity.LONG }),
								workspace: newWorkspaceIdentifier,
								remoteAuthority: this.environmentService.remoteAuthority // remember whether this was a remote window
							}]);

							// Delete the untitled one
							await this.workspacesService.deleteUntitledWorkspace(workspaceIdentifier);
						} catch (error) {
							// ignore
						}

						return false;
					}
				},
				{
					label: localize({ key: 'doNotSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save"),
					run: async () => {
						await this.workspacesService.deleteUntitledWorkspace(workspaceIdentifier);

						return false;
					}
				}
			],
			cancelButton: {
				run: () => {
					canceled = true;

					return true; // veto
				}
			},
			checkbox: {
				label: localize('doNotAskAgain', "Always discard untitled workspaces without asking")
			}
		});

		if (!canceled && checkboxChecked) {
			await this.configurationService.updateValue('window.confirmSaveUntitledWorkspace', false, ConfigurationTarget.USER);
		}

		return result;
	}

	override async isValidTargetWorkspacePath(workspaceUri: URI): Promise<boolean> {
		const windows = await this.nativeHostService.getWindows({ includeAuxiliaryWindows: false });

		// Prevent overwriting a workspace that is currently opened in another window
		if (windows.some(window => isWorkspaceIdentifier(window.workspace) && this.uriIdentityService.extUri.isEqual(window.workspace.configPath, workspaceUri))) {
			await this.dialogService.info(
				localize('workspaceOpenedMessage', "Unable to save workspace '{0}'", basename(workspaceUri)),
				localize('workspaceOpenedDetail', "The workspace is already opened in another window. Please close that window first and then try again.")
			);

			return false;
		}

		return true; // OK
	}

	async enterWorkspace(workspaceUri: URI): Promise<void> {
		const stopped = await this.extensionService.stopExtensionHosts(localize('restartExtensionHost.reason', "Opening a multi-root workspace"));
		if (!stopped) {
			return;
		}

		const result = await this.doEnterWorkspace(workspaceUri);
		if (result) {

			// Migrate storage to new workspace
			await this.storageService.switch(result.workspace, true /* preserve data */);

			// Reinitialize backup service
			if (this.workingCopyBackupService instanceof WorkingCopyBackupService) {
				const newBackupWorkspaceHome = result.backupPath ? URI.file(result.backupPath).with({ scheme: this.environmentService.userRoamingDataHome.scheme }) : undefined;
				this.workingCopyBackupService.reinitialize(newBackupWorkspaceHome);
			}
		}

		// TODO@aeschli: workaround until restarting works
		if (this.environmentService.remoteAuthority) {
			this.hostService.reload();
		}

		// Restart the extension host: entering a workspace means a new location for
		// storage and potentially a change in the workspace.rootPath property.
		else {
			this.extensionService.startExtensionHosts();
		}
	}
}

registerSingleton(IWorkspaceEditingService, NativeWorkspaceEditingService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/electron-browser/workspacesService.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/electron-browser/workspacesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';

// @ts-expect-error: interface is implemented via proxy
export class NativeWorkspacesService implements IWorkspacesService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@INativeHostService nativeHostService: INativeHostService
	) {
		return ProxyChannel.toService<IWorkspacesService>(mainProcessService.getChannel('workspaces'), { context: nativeHostService.windowId });
	}
}

registerSingleton(IWorkspacesService, NativeWorkspacesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/test/browser/workspaces.test.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/test/browser/workspaces.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { getWorkspaceIdentifier, getSingleFolderWorkspaceIdentifier } from '../../browser/workspaces.js';

suite('Workspaces', () => {
	test('workspace identifiers are stable', function () {

		// workspace identifier
		assert.strictEqual(getWorkspaceIdentifier(URI.parse('vscode-remote:/hello/test')).id, '474434e4');

		// single folder identifier
		assert.strictEqual(getSingleFolderWorkspaceIdentifier(URI.parse('vscode-remote:/hello/test'))?.id, '474434e4');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workspaces/test/common/workspaceTrust.test.ts]---
Location: vscode-main/src/vs/workbench/services/workspaces/test/common/workspaceTrust.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IRemoteAuthorityResolverService } from '../../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustEnablementService, IWorkspaceTrustInfo } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { Memento } from '../../../../common/memento.js';
import { IWorkbenchEnvironmentService } from '../../../environment/common/environmentService.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { WorkspaceTrustEnablementService, WorkspaceTrustManagementService, WORKSPACE_TRUST_STORAGE_KEY } from '../../common/workspaceTrust.js';
import { TestContextService, TestStorageService, TestWorkspaceTrustEnablementService } from '../../../../test/common/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Mutable } from '../../../../../base/common/types.js';

suite('Workspace Trust', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let environmentService: Mutable<IWorkbenchEnvironmentService>;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());

		configurationService = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, configurationService);

		environmentService = {} as IWorkbenchEnvironmentService;
		instantiationService.stub(IWorkbenchEnvironmentService, environmentService);

		const fileService = store.add(new FileService(new NullLogService()));
		const uriIdentityService = store.add(new UriIdentityService(fileService));

		instantiationService.stub(IUriIdentityService, uriIdentityService);
		instantiationService.stub(IRemoteAuthorityResolverService, new class extends mock<IRemoteAuthorityResolverService>() { });
	});

	suite('Enablement', () => {
		test('workspace trust enabled', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(true, true));
			const testObject = store.add(instantiationService.createInstance(WorkspaceTrustEnablementService));

			assert.strictEqual(testObject.isWorkspaceTrustEnabled(), true);
		});

		test('workspace trust disabled (user setting)', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(false, true));
			const testObject = store.add(instantiationService.createInstance(WorkspaceTrustEnablementService));

			assert.strictEqual(testObject.isWorkspaceTrustEnabled(), false);
		});

		test('workspace trust disabled (--disable-workspace-trust)', () => {
			instantiationService.stub(IWorkbenchEnvironmentService, { ...environmentService, disableWorkspaceTrust: true });
			const testObject = store.add(instantiationService.createInstance(WorkspaceTrustEnablementService));

			assert.strictEqual(testObject.isWorkspaceTrustEnabled(), false);
		});
	});

	suite('Management', () => {
		let storageService: TestStorageService;
		let workspaceService: TestContextService;

		teardown(() => {
			Memento.clear(StorageScope.WORKSPACE);
		});

		setup(() => {
			storageService = store.add(new TestStorageService());
			instantiationService.stub(IStorageService, storageService);

			workspaceService = new TestContextService();
			instantiationService.stub(IWorkspaceContextService, workspaceService);

			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());
		});

		test('empty workspace - trusted', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(true, true));
			workspaceService.setWorkspace(new Workspace('empty-workspace'));
			const testObject = await initializeTestObject();

			assert.strictEqual(true, testObject.isWorkspaceTrusted());
		});

		test('empty workspace - untrusted', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(true, false));
			workspaceService.setWorkspace(new Workspace('empty-workspace'));
			const testObject = await initializeTestObject();

			assert.strictEqual(false, testObject.isWorkspaceTrusted());
		});

		test('empty workspace - trusted, open trusted file', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(true, true));
			const trustInfo: IWorkspaceTrustInfo = { uriTrustInfo: [{ uri: URI.parse('file:///Folder'), trusted: true }] };
			storageService.store(WORKSPACE_TRUST_STORAGE_KEY, JSON.stringify(trustInfo), StorageScope.APPLICATION, StorageTarget.MACHINE);

			environmentService.filesToOpenOrCreate = [{ fileUri: URI.parse('file:///Folder/file.txt') }];
			instantiationService.stub(IWorkbenchEnvironmentService, { ...environmentService });

			workspaceService.setWorkspace(new Workspace('empty-workspace'));
			const testObject = await initializeTestObject();

			assert.strictEqual(true, testObject.isWorkspaceTrusted());
		});

		test('empty workspace - trusted, open untrusted file', async () => {
			await configurationService.setUserConfiguration('security', getUserSettings(true, true));

			environmentService.filesToOpenOrCreate = [{ fileUri: URI.parse('file:///Folder/foo.txt') }];
			instantiationService.stub(IWorkbenchEnvironmentService, { ...environmentService });

			workspaceService.setWorkspace(new Workspace('empty-workspace'));
			const testObject = await initializeTestObject();

			assert.strictEqual(false, testObject.isWorkspaceTrusted());
		});

		async function initializeTestObject(): Promise<WorkspaceTrustManagementService> {
			const workspaceTrustManagementService = store.add(instantiationService.createInstance(WorkspaceTrustManagementService));
			await workspaceTrustManagementService.workspaceTrustInitialized;

			return workspaceTrustManagementService;
		}
	});

	function getUserSettings(enabled: boolean, emptyWindow: boolean) {
		return { workspace: { trust: { emptyWindow, enabled } } };
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/codeeditor.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/codeeditor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { URI } from '../../../base/common/uri.js';
import { workbenchInstantiationService, TestEditorService } from './workbenchTestServices.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { LanguageService } from '../../../editor/common/services/languageService.js';
import { RangeHighlightDecorations } from '../../browser/codeeditor.js';
import { TextModel } from '../../../editor/common/model/textModel.js';
import { createTestCodeEditor } from '../../../editor/test/browser/testCodeEditor.js';
import { Range, IRange } from '../../../editor/common/core/range.js';
import { Position } from '../../../editor/common/core/position.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { ModelService } from '../../../editor/common/services/modelService.js';
import { CoreNavigationCommands } from '../../../editor/browser/coreCommands.js';
import { ICodeEditor } from '../../../editor/browser/editorBrowser.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { createTextModel } from '../../../editor/test/common/testTextModel.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('Editor - Range decorations', () => {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let codeEditor: ICodeEditor;
	let model: TextModel;
	let text: string;
	let testObject: RangeHighlightDecorations;
	const modelsToDispose: TextModel[] = [];

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(IEditorService, new TestEditorService());
		instantiationService.stub(ILanguageService, LanguageService);
		instantiationService.stub(IModelService, stubModelService(instantiationService));
		text = 'LINE1' + '\n' + 'LINE2' + '\n' + 'LINE3' + '\n' + 'LINE4' + '\r\n' + 'LINE5';
		model = disposables.add(aModel(URI.file('some_file')));
		codeEditor = disposables.add(createTestCodeEditor(model));

		instantiationService.stub(IEditorService, 'activeEditor', { get resource() { return codeEditor.getModel()!.uri; } });
		instantiationService.stub(IEditorService, 'activeTextEditorControl', codeEditor);

		testObject = disposables.add(instantiationService.createInstance(RangeHighlightDecorations));
	});

	teardown(() => {
		codeEditor.dispose();
		modelsToDispose.forEach(model => model.dispose());
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('highlight range for the resource if it is an active editor', function () {
		const range: IRange = new Range(1, 1, 1, 1);
		testObject.highlightRange({ resource: model.uri, range });

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, [range]);
	});

	test('remove highlight range', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		testObject.removeHighlightRange();

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, []);
	});

	test('highlight range for the resource removes previous highlight', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		const range: IRange = new Range(2, 2, 4, 3);
		testObject.highlightRange({ resource: model.uri, range });

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, [range]);
	});

	test('highlight range for a new resource removes highlight of previous resource', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });

		const anotherModel = prepareActiveEditor('anotherModel');
		const range: IRange = new Range(2, 2, 4, 3);
		testObject.highlightRange({ resource: anotherModel.uri, range });

		let actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
		actuals = rangeHighlightDecorations(anotherModel);
		assert.deepStrictEqual(actuals, [range]);
	});

	test('highlight is removed on model change', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		prepareActiveEditor('anotherModel');

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('highlight is removed on cursor position change', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		codeEditor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(2, 1)
		});

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('range is not highlight if not active editor', function () {
		const model = aModel(URI.file('some model'));
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('previous highlight is not removed if not active editor', function () {
		const range = new Range(1, 1, 1, 1);
		testObject.highlightRange({ resource: model.uri, range });

		const model1 = aModel(URI.file('some model'));
		testObject.highlightRange({ resource: model1.uri, range: { startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 } });

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, [range]);
	});

	function prepareActiveEditor(resource: string): TextModel {
		const model = aModel(URI.file(resource));
		codeEditor.setModel(model);
		return model;
	}

	function aModel(resource: URI, content: string = text): TextModel {
		const model = createTextModel(content, undefined, undefined, resource);
		modelsToDispose.push(model);
		return model;
	}

	function rangeHighlightDecorations(m: TextModel): IRange[] {
		const rangeHighlights: IRange[] = [];

		for (const dec of m.getAllDecorations()) {
			if (dec.options.className === 'rangeHighlight') {
				rangeHighlights.push(dec.range);
			}
		}

		rangeHighlights.sort(Range.compareRangesUsingStarts);
		return rangeHighlights;
	}

	function stubModelService(instantiationService: TestInstantiationService): IModelService {
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IThemeService, new TestThemeService());
		return instantiationService.createInstance(ModelService);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/contributions.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/contributions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DeferredPromise } from '../../../base/common/async.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { isCI } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { EditorPart } from '../../browser/parts/editor/editorPart.js';
import { WorkbenchPhase, WorkbenchContributionsRegistry } from '../../common/contributions.js';
import { EditorService } from '../../services/editor/browser/editorService.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService, SIDE_GROUP } from '../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../services/lifecycle/common/lifecycle.js';
import { ITestInstantiationService, TestFileEditorInput, TestServiceAccessor, TestSingletonFileEditorInput, createEditorPart, registerTestEditor, workbenchInstantiationService } from './workbenchTestServices.js';

suite('Contributions', () => {
	const disposables = new DisposableStore();

	let aCreated: boolean;
	let aCreatedPromise: DeferredPromise<void>;

	let bCreated: boolean;
	let bCreatedPromise: DeferredPromise<void>;

	const TEST_EDITOR_ID = 'MyTestEditorForContributions';
	const TEST_EDITOR_INPUT_ID = 'testEditorInputForContributions';

	async function createEditorService(instantiationService: ITestInstantiationService = workbenchInstantiationService(undefined, disposables)): Promise<[EditorPart, EditorService]> {
		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		return [part, editorService];
	}

	setup(() => {
		aCreated = false;
		aCreatedPromise = new DeferredPromise<void>();

		bCreated = false;
		bCreatedPromise = new DeferredPromise<void>();

		disposables.add(registerTestEditor(TEST_EDITOR_ID, [new SyncDescriptor(TestFileEditorInput), new SyncDescriptor(TestSingletonFileEditorInput)], TEST_EDITOR_INPUT_ID));
	});

	teardown(async () => {
		disposables.clear();
	});

	class TestContributionA {
		constructor() {
			aCreated = true;
			aCreatedPromise.complete();
		}
	}
	class TestContributionB {
		constructor() {
			bCreated = true;
			bCreatedPromise.complete();
		}
	}
	class TestContributionError {
		constructor() {
			throw new Error();
		}
	}

	test('getWorkbenchContribution() - with lazy contributions', () => {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		assert.throws(() => registry.getWorkbenchContribution('a'));

		registry.registerWorkbenchContribution2('a', TestContributionA, { lazy: true });
		assert.throws(() => registry.getWorkbenchContribution('a'));

		registry.registerWorkbenchContribution2('b', TestContributionB, { lazy: true });
		registry.registerWorkbenchContribution2('c', TestContributionError, { lazy: true });

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		registry.start(instantiationService);

		const instanceA = registry.getWorkbenchContribution('a');
		assert.ok(instanceA instanceof TestContributionA);
		assert.ok(aCreated);
		assert.strictEqual(instanceA, registry.getWorkbenchContribution('a'));

		const instanceB = registry.getWorkbenchContribution('b');
		assert.ok(instanceB instanceof TestContributionB);

		assert.throws(() => registry.getWorkbenchContribution('c'));
	});

	test('getWorkbenchContribution() - with non-lazy contributions', async () => {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.lifecycleService.usePhases = true;
		registry.start(instantiationService);

		assert.throws(() => registry.getWorkbenchContribution('a'));

		registry.registerWorkbenchContribution2('a', TestContributionA, WorkbenchPhase.BlockRestore);

		const instanceA = registry.getWorkbenchContribution('a');
		assert.ok(instanceA instanceof TestContributionA);
		assert.ok(aCreated);

		accessor.lifecycleService.phase = LifecyclePhase.Ready;
		await aCreatedPromise.p;

		assert.strictEqual(instanceA, registry.getWorkbenchContribution('a'));
	});

	test('lifecycle phase instantiation works when phase changes', async () => {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const accessor = instantiationService.createInstance(TestServiceAccessor);
		registry.start(instantiationService);

		registry.registerWorkbenchContribution2('a', TestContributionA, WorkbenchPhase.BlockRestore);
		assert.ok(!aCreated);

		accessor.lifecycleService.phase = LifecyclePhase.Ready;
		await aCreatedPromise.p;
		assert.ok(aCreated);
	});

	test('lifecycle phase instantiation works when phase was already met', async () => {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.lifecycleService.usePhases = true;
		accessor.lifecycleService.phase = LifecyclePhase.Restored;

		registry.registerWorkbenchContribution2('a', TestContributionA, WorkbenchPhase.BlockRestore);
		registry.start(instantiationService);

		await aCreatedPromise.p;
		assert.ok(aCreated);
	});

	(isCI ? test.skip /* runWhenIdle seems flaky in CI on Windows */ : test)('lifecycle phase instantiation works for late phases', async () => {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const accessor = instantiationService.createInstance(TestServiceAccessor);
		accessor.lifecycleService.usePhases = true;
		registry.start(instantiationService);

		registry.registerWorkbenchContribution2('a', TestContributionA, WorkbenchPhase.AfterRestored);
		registry.registerWorkbenchContribution2('b', TestContributionB, WorkbenchPhase.Eventually);
		assert.ok(!aCreated);
		assert.ok(!bCreated);

		accessor.lifecycleService.phase = LifecyclePhase.Starting;
		accessor.lifecycleService.phase = LifecyclePhase.Ready;
		accessor.lifecycleService.phase = LifecyclePhase.Restored;
		await aCreatedPromise.p;
		assert.ok(aCreated);

		accessor.lifecycleService.phase = LifecyclePhase.Eventually;
		await bCreatedPromise.p;
		assert.ok(bCreated);
	});

	test('contribution on editor - editor exists before start', async function () {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const [, editorService] = await createEditorService(instantiationService);

		const input = disposables.add(new TestFileEditorInput(URI.parse('my://resource-basics'), TEST_EDITOR_INPUT_ID));
		await editorService.openEditor(input, { pinned: true });

		registry.registerWorkbenchContribution2('a', TestContributionA, { editorTypeId: TEST_EDITOR_ID });
		registry.start(instantiationService.createChild(new ServiceCollection([IEditorService, editorService])));

		await aCreatedPromise.p;
		assert.ok(aCreated);

		registry.registerWorkbenchContribution2('b', TestContributionB, { editorTypeId: TEST_EDITOR_ID });

		const input2 = disposables.add(new TestFileEditorInput(URI.parse('my://resource-basics2'), TEST_EDITOR_INPUT_ID));
		await editorService.openEditor(input2, { pinned: true }, SIDE_GROUP);

		await bCreatedPromise.p;
		assert.ok(bCreated);
	});

	test('contribution on editor - editor does not exist before start', async function () {
		const registry = disposables.add(new WorkbenchContributionsRegistry());

		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const [, editorService] = await createEditorService(instantiationService);

		const input = disposables.add(new TestFileEditorInput(URI.parse('my://resource-basics'), TEST_EDITOR_INPUT_ID));

		registry.registerWorkbenchContribution2('a', TestContributionA, { editorTypeId: TEST_EDITOR_ID });
		registry.start(instantiationService.createChild(new ServiceCollection([IEditorService, editorService])));

		await editorService.openEditor(input, { pinned: true });

		await aCreatedPromise.p;
		assert.ok(aCreated);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/notificationsList.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/notificationsList.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { NotificationAccessibilityProvider } from '../../browser/parts/notifications/notificationsList.js';
import { NotificationViewItem, INotificationsFilter, INotificationViewItem } from '../../common/notifications.js';
import { Severity, NotificationsFilter } from '../../../platform/notification/common/notification.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { MockKeybindingService } from '../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('NotificationsList AccessibilityProvider', () => {

	const noFilter: INotificationsFilter = { global: NotificationsFilter.OFF, sources: new Map() };
	let configurationService: IConfigurationService;
	let keybindingService: IKeybindingService;
	let accessibilityProvider: NotificationAccessibilityProvider;
	const createdNotifications: INotificationViewItem[] = [];

	setup(() => {
		configurationService = new TestConfigurationService();
		keybindingService = new MockKeybindingService();
		accessibilityProvider = new NotificationAccessibilityProvider({}, keybindingService, configurationService);
	});

	teardown(() => {
		// Close all created notifications to prevent disposable leaks
		for (const notification of createdNotifications) {
			notification.close();
		}
		createdNotifications.length = 0;
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('getAriaLabel includes severity prefix for Error notifications', () => {
		const notification = NotificationViewItem.create({ severity: Severity.Error, message: 'Something went wrong' }, noFilter)!;
		createdNotifications.push(notification);
		const ariaLabel = accessibilityProvider.getAriaLabel(notification);

		assert.ok(ariaLabel.startsWith('Error: '), `Expected aria label to start with "Error: ", but got: ${ariaLabel}`);
		assert.ok(ariaLabel.includes('Something went wrong'), 'Expected aria label to include original message');
		assert.ok(ariaLabel.includes('notification'), 'Expected aria label to include "notification"');
	});

	test('getAriaLabel includes severity prefix for Warning notifications', () => {
		const notification = NotificationViewItem.create({ severity: Severity.Warning, message: 'This is a warning' }, noFilter)!;
		createdNotifications.push(notification);
		const ariaLabel = accessibilityProvider.getAriaLabel(notification);

		assert.ok(ariaLabel.startsWith('Warning: '), `Expected aria label to start with "Warning: ", but got: ${ariaLabel}`);
		assert.ok(ariaLabel.includes('This is a warning'), 'Expected aria label to include original message');
		assert.ok(ariaLabel.includes('notification'), 'Expected aria label to include "notification"');
	});

	test('getAriaLabel includes severity prefix for Info notifications', () => {
		const notification = NotificationViewItem.create({ severity: Severity.Info, message: 'Information message' }, noFilter)!;
		createdNotifications.push(notification);
		const ariaLabel = accessibilityProvider.getAriaLabel(notification);

		assert.ok(ariaLabel.startsWith('Info: '), `Expected aria label to start with "Info: ", but got: ${ariaLabel}`);
		assert.ok(ariaLabel.includes('Information message'), 'Expected aria label to include original message');
		assert.ok(ariaLabel.includes('notification'), 'Expected aria label to include "notification"');
	});

	test('getAriaLabel includes source when present', () => {
		const notification = NotificationViewItem.create({
			severity: Severity.Error,
			message: 'Error with source',
			source: 'TestExtension'
		}, noFilter)!;
		createdNotifications.push(notification);
		const ariaLabel = accessibilityProvider.getAriaLabel(notification);

		assert.ok(ariaLabel.startsWith('Error: '), 'Expected aria label to start with severity prefix');
		assert.ok(ariaLabel.includes('Error with source'), 'Expected aria label to include original message');
		assert.ok(ariaLabel.includes('source: TestExtension'), 'Expected aria label to include source information');
		assert.ok(ariaLabel.includes('notification'), 'Expected aria label to include "notification"');
	});

	test('severity prefix consistency', () => {
		// Test that the severity prefixes are consistent with the ARIA alerts
		const errorNotification = NotificationViewItem.create({ severity: Severity.Error, message: 'Error message' }, noFilter)!;
		const warningNotification = NotificationViewItem.create({ severity: Severity.Warning, message: 'Warning message' }, noFilter)!;
		const infoNotification = NotificationViewItem.create({ severity: Severity.Info, message: 'Info message' }, noFilter)!;

		createdNotifications.push(errorNotification, warningNotification, infoNotification);

		const errorLabel = accessibilityProvider.getAriaLabel(errorNotification);
		const warningLabel = accessibilityProvider.getAriaLabel(warningNotification);
		const infoLabel = accessibilityProvider.getAriaLabel(infoNotification);

		// Check that each severity type gets the correct prefix
		assert.ok(errorLabel.includes('Error: Error message'), 'Error notifications should have Error prefix');
		assert.ok(warningLabel.includes('Warning: Warning message'), 'Warning notifications should have Warning prefix');
		assert.ok(infoLabel.includes('Info: Info message'), 'Info notifications should have Info prefix');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/part.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/part.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Part } from '../../browser/part.js';
import { isEmptyObject } from '../../../base/common/types.js';
import { TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { append, $, hide } from '../../../base/browser/dom.js';
import { TestLayoutService } from './workbenchTestServices.js';
import { StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { TestStorageService } from '../common/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { mainWindow } from '../../../base/browser/window.js';

/* eslint-disable no-restricted-syntax */

suite('Workbench parts', () => {

	const disposables = new DisposableStore();

	class SimplePart extends Part {

		minimumWidth: number = 50;
		maximumWidth: number = 50;
		minimumHeight: number = 50;
		maximumHeight: number = 50;

		override layout(width: number, height: number): void {
			throw new Error('Method not implemented.');
		}

		toJSON(): object {
			throw new Error('Method not implemented.');
		}
	}

	class MyPart extends SimplePart {

		constructor(private expectedParent: HTMLElement) {
			super('myPart', { hasTitle: true }, new TestThemeService(), disposables.add(new TestStorageService()), new TestLayoutService());
		}

		protected override createTitleArea(parent: HTMLElement): HTMLElement {
			assert.strictEqual(parent, this.expectedParent);
			return super.createTitleArea(parent)!;
		}

		protected override createContentArea(parent: HTMLElement): HTMLElement {
			assert.strictEqual(parent, this.expectedParent);
			return super.createContentArea(parent)!;
		}

		testGetMemento(scope: StorageScope, target: StorageTarget) {
			return super.getMemento(scope, target);
		}

		testSaveState(): void {
			return super.saveState();
		}
	}

	class MyPart2 extends SimplePart {

		constructor() {
			super('myPart2', { hasTitle: true }, new TestThemeService(), disposables.add(new TestStorageService()), new TestLayoutService());
		}

		protected override createTitleArea(parent: HTMLElement): HTMLElement {
			const titleContainer = append(parent, $('div'));
			const titleLabel = append(titleContainer, $('span'));
			titleLabel.id = 'myPart.title';
			titleLabel.innerText = 'Title';

			return titleContainer;
		}

		protected override createContentArea(parent: HTMLElement): HTMLElement {
			const contentContainer = append(parent, $('div'));
			const contentSpan = append(contentContainer, $('span'));
			contentSpan.id = 'myPart.content';
			contentSpan.innerText = 'Content';

			return contentContainer;
		}
	}

	class MyPart3 extends SimplePart {

		constructor() {
			super('myPart2', { hasTitle: false }, new TestThemeService(), disposables.add(new TestStorageService()), new TestLayoutService());
		}

		protected override createTitleArea(parent: HTMLElement): HTMLElement {
			return null!;
		}

		protected override createContentArea(parent: HTMLElement): HTMLElement {
			const contentContainer = append(parent, $('div'));
			const contentSpan = append(contentContainer, $('span'));
			contentSpan.id = 'myPart.content';
			contentSpan.innerText = 'Content';

			return contentContainer;
		}
	}

	let fixture: HTMLElement;
	const fixtureId = 'workbench-part-fixture';

	setup(() => {
		fixture = document.createElement('div');
		fixture.id = fixtureId;
		mainWindow.document.body.appendChild(fixture);
	});

	teardown(() => {
		fixture.remove();
		disposables.clear();
	});

	test('Creation', () => {
		const b = document.createElement('div');
		mainWindow.document.getElementById(fixtureId)!.appendChild(b);
		hide(b);

		let part = disposables.add(new MyPart(b));
		part.create(b);

		assert.strictEqual(part.getId(), 'myPart');

		// Memento
		// eslint-disable-next-line local/code-no-any-casts
		let memento = part.testGetMemento(StorageScope.PROFILE, StorageTarget.MACHINE) as any;
		assert(memento);
		memento.foo = 'bar';
		memento.bar = [1, 2, 3];

		part.testSaveState();

		// Re-Create to assert memento contents
		part = disposables.add(new MyPart(b));

		memento = part.testGetMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert(memento);
		assert.strictEqual(memento.foo, 'bar');
		assert.strictEqual(memento.bar.length, 3);

		// Empty Memento stores empty object
		delete memento.foo;
		delete memento.bar;

		part.testSaveState();
		part = disposables.add(new MyPart(b));
		memento = part.testGetMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert(memento);
		assert.strictEqual(isEmptyObject(memento), true);
	});

	test('Part Layout with Title and Content', function () {
		const b = document.createElement('div');
		mainWindow.document.getElementById(fixtureId)!.appendChild(b);
		hide(b);

		const part = disposables.add(new MyPart2());
		part.create(b);

		assert(mainWindow.document.getElementById('myPart.title'));
		assert(mainWindow.document.getElementById('myPart.content'));
	});

	test('Part Layout with Content only', function () {
		const b = document.createElement('div');
		mainWindow.document.getElementById(fixtureId)!.appendChild(b);
		hide(b);

		const part = disposables.add(new MyPart3());
		part.create(b);

		assert(!mainWindow.document.getElementById('myPart.title'));
		assert(mainWindow.document.getElementById('myPart.content'));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 295
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 295 of 552)

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

---[FILE: src/vs/platform/userDataSync/test/common/synchronizer.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/synchronizer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Barrier } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isEqual, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileService } from '../../../files/common/files.js';
import { IStorageService, StorageScope } from '../../../storage/common/storage.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { AbstractSynchroniser, IAcceptResult, IMergeResult, IResourcePreview, SyncStrategy } from '../../common/abstractSynchronizer.js';
import { Change, IRemoteUserData, IResourcePreview as IBaseResourcePreview, IUserDataSyncConfiguration, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus, USER_DATA_SYNC_SCHEME, IUserData } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

interface ITestResourcePreview extends IResourcePreview {
	ref: string;
}

class TestSynchroniser extends AbstractSynchroniser {

	syncBarrier: Barrier = new Barrier();
	syncResult: { hasConflicts: boolean; hasError: boolean } = { hasConflicts: false, hasError: false };
	onDoSyncCall: Emitter<void> = this._register(new Emitter<void>());
	failWhenGettingLatestRemoteUserData: boolean = false;

	protected readonly version: number = 1;

	private cancelled: boolean = false;
	readonly localResource = joinPath(this.environmentService.userRoamingDataHome, 'testResource.json');

	getMachineId(): Promise<string> { return this.currentMachineIdPromise; }
	getLastSyncResource(): URI { return this.lastSyncResource; }

	protected override getLatestRemoteUserData(refOrLatestData: string | IUserData | null, lastSyncUserData: IRemoteUserData | null): Promise<IRemoteUserData> {
		if (this.failWhenGettingLatestRemoteUserData) {
			throw new Error();
		}
		return super.getLatestRemoteUserData(refOrLatestData, lastSyncUserData);
	}

	protected override async doSync(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, strategy: SyncStrategy, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<SyncStatus> {
		this.cancelled = false;
		this.onDoSyncCall.fire();
		await this.syncBarrier.wait();

		if (this.cancelled) {
			return SyncStatus.Idle;
		}

		return super.doSync(remoteUserData, lastSyncUserData, strategy, userDataSyncConfiguration);
	}

	protected override async generateSyncPreview(remoteUserData: IRemoteUserData): Promise<ITestResourcePreview[]> {
		if (this.syncResult.hasError) {
			throw new Error('failed');
		}

		let fileContent = null;
		try {
			fileContent = await this.fileService.readFile(this.localResource);
		} catch (error) { }

		return [{
			baseResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' })),
			baseContent: null,
			localResource: this.localResource,
			localContent: fileContent ? fileContent.value.toString() : null,
			remoteResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' })),
			remoteContent: remoteUserData.syncData ? remoteUserData.syncData.content : null,
			previewResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'preview' })),
			ref: remoteUserData.ref,
			localChange: Change.Modified,
			remoteChange: Change.Modified,
			acceptedResource: this.localResource.with(({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })),
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		return true;
	}

	protected async getMergeResult(resourcePreview: ITestResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return {
			content: resourcePreview.ref,
			localChange: Change.Modified,
			remoteChange: Change.Modified,
			hasConflicts: this.syncResult.hasConflicts,
		};
	}

	protected async getAcceptResult(resourcePreview: ITestResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		if (isEqual(resource, resourcePreview.localResource)) {
			return {
				content: resourcePreview.localContent,
				localChange: Change.None,
				remoteChange: resourcePreview.localContent === null ? Change.Deleted : Change.Modified,
			};
		}

		if (isEqual(resource, resourcePreview.remoteResource)) {
			return {
				content: resourcePreview.remoteContent,
				localChange: resourcePreview.remoteContent === null ? Change.Deleted : Change.Modified,
				remoteChange: Change.None,
			};
		}

		if (isEqual(resource, resourcePreview.previewResource)) {
			if (content === undefined) {
				return {
					content: resourcePreview.ref,
					localChange: Change.Modified,
					remoteChange: Change.Modified,
				};
			} else {
				return {
					content,
					localChange: content === null ? resourcePreview.localContent !== null ? Change.Deleted : Change.None : Change.Modified,
					remoteChange: content === null ? resourcePreview.remoteContent !== null ? Change.Deleted : Change.None : Change.Modified,
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		if (resourcePreviews[0][1].localChange === Change.Deleted) {
			await this.fileService.del(this.localResource);
		}

		if (resourcePreviews[0][1].localChange === Change.Added || resourcePreviews[0][1].localChange === Change.Modified) {
			await this.fileService.writeFile(this.localResource, VSBuffer.fromString(resourcePreviews[0][1].content!));
		}

		if (resourcePreviews[0][1].remoteChange === Change.Deleted) {
			await this.applyRef(null, remoteUserData.ref);
		}

		if (resourcePreviews[0][1].remoteChange === Change.Added || resourcePreviews[0][1].remoteChange === Change.Modified) {
			await this.applyRef(resourcePreviews[0][1].content, remoteUserData.ref);
		}
	}

	async applyRef(content: string | null, ref: string): Promise<void> {
		const remoteUserData = await this.updateRemoteUserData(content === null ? '' : content, ref);
		await this.updateLastSyncUserData(remoteUserData);
	}

	override async stop(): Promise<void> {
		this.cancelled = true;
		this.syncBarrier.open();
		super.stop();
	}

	testTriggerLocalChange(): void {
		this.triggerLocalChange();
	}

	onDidTriggerLocalChangeCall: Emitter<void> = this._register(new Emitter<void>());
	protected override async doTriggerLocalChange(): Promise<void> {
		await super.doTriggerLocalChange();
		this.onDidTriggerLocalChangeCall.fire();
	}

	hasLocalData(): Promise<boolean> { throw new Error('not implemented'); }
	async resolveContent(uri: URI): Promise<string | null> { return null; }
}

suite('TestSynchronizer - Auto Sync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('status is syncing', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));

			const promise = Event.toPromise(testObject.onDoSyncCall.event);

			testObject.sync(await client.getLatestRef(testObject.resource));
			await promise;

			assert.deepStrictEqual(actual, [SyncStatus.Syncing]);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);

			testObject.stop();
		});
	});

	test('status is set correctly when sync is finished', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, [SyncStatus.Syncing, SyncStatus.Idle]);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
		});
	});

	test('status is set correctly when sync has errors', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasError: true, hasConflicts: false };
			testObject.syncBarrier.open();

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));

			try {
				await testObject.sync(await client.getLatestRef(testObject.resource));
				assert.fail('Should fail');
			} catch (e) {
				assert.deepStrictEqual(actual, [SyncStatus.Syncing, SyncStatus.Idle]);
				assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			}
		});
	});

	test('status is set to hasConflicts when asked to sync if there are conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
			assertConflicts(testObject.conflicts.conflicts, [testObject.localResource]);
		});
	});

	test('sync should not run if syncing already', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			const promise = Event.toPromise(testObject.onDoSyncCall.event);

			testObject.sync(await client.getLatestRef(testObject.resource));
			await promise;

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, []);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);

			await testObject.stop();
		});
	});

	test('sync should not run if there are conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const actual: SyncStatus[] = [];
			disposableStore.add(testObject.onDidChangeStatus(status => actual.push(status)));
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(actual, []);
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
		});
	});

	test('accept preview during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const fileService = client.instantiationService.get(IFileService);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, (await fileService.readFile(testObject.localResource)).value.toString());
		});
	});

	test('accept remote during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const currentRemoteContent = (await testObject.getRemoteUserData(null)).syncData?.content;
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, currentRemoteContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), currentRemoteContent);
		});
	});

	test('accept local during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, newLocalContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), newLocalContent);
		});
	});

	test('accept new content during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			const mergeContent = 'newContent';
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, mergeContent);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, mergeContent);
			assert.strictEqual((await fileService.readFile(testObject.localResource)).value.toString(), mergeContent);
		});
	});

	test('accept delete during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			const newLocalContent = 'conflict';
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString(newLocalContent));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, null);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, '');
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('accept deleted local during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			const fileService = client.instantiationService.get(IFileService);
			await fileService.del(testObject.localResource);

			testObject.syncResult = { hasConflicts: true, hasError: false };
			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, '');
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('accept deleted remote during conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			const fileService = client.instantiationService.get(IFileService);
			await fileService.writeFile(testObject.localResource, VSBuffer.fromString('some content'));
			testObject.syncResult = { hasConflicts: true, hasError: false };

			await testObject.sync(await client.getLatestRef(testObject.resource));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertConflicts(testObject.conflicts.conflicts, []);

			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData, null);
			assert.ok(!(await fileService.exists(testObject.localResource)));
		});
	});

	test('request latest data on precondition failure', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			// Sync once
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));
			testObject.syncBarrier = new Barrier();

			// update remote data before syncing so that 412 is thrown by server
			const disposable = testObject.onDoSyncCall.event(async () => {
				disposable.dispose();
				await testObject.applyRef(ref, ref!);
				server.reset();
				testObject.syncBarrier.open();
			});

			// Start sycing
			const ref = await client.getLatestRef(testObject.resource);
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': ref } },
				{ type: 'GET', url: `${server.url}/v1/resource/${testObject.resource}/latest`, headers: {} },
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': `${parseInt(ref!) + 1}` } },
			]);
		});
	});

	test('no requests are made to server when local change is triggered', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			server.reset();
			const promise = Event.toPromise(testObject.onDidTriggerLocalChangeCall.event);
			testObject.testTriggerLocalChange();

			await promise;
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('status is reset when getting latest remote data fails', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.failWhenGettingLatestRemoteUserData = true;

			try {
				await testObject.sync(await client.getLatestRef(testObject.resource));
				assert.fail('Should throw an error');
			} catch (error) {
			}

			assert.strictEqual(testObject.status, SyncStatus.Idle);
		});
	});
});

suite('TestSynchronizer - Manual Sync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preview -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preview -> merge -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const ref = await client.getLatestRef(testObject.resource);
			let preview = await testObject.sync(ref, true);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('preview -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const ref = await client.getLatestRef(testObject.resource);
			let preview = await testObject.sync(ref, true);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('preivew -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> accept -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> accept -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('preivew -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('conflicts: preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);

			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Conflict);
			assertConflicts(testObject.conflicts.conflicts, [preview!.resourcePreviews[0].localResource]);
		});
	});

	test('conflicts: preview -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			const preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			const content = await testObject.resolveContent(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, content);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept 2', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			const content = await testObject.resolveContent(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, content);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preview -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			testObject.syncResult = { hasConflicts: true, hasError: false };
			const ref = await client.getLatestRef(testObject.resource);
			let preview = await testObject.sync(ref, true);

			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);

			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, ref);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

	test('conflicts: preivew -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> accept -> discard -> accept', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: true, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Accepted);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> accept -> discard', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();

			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);

			assert.deepStrictEqual(testObject.status, SyncStatus.Syncing);
			assertPreviews(preview!.resourcePreviews, [testObject.localResource]);
			assert.strictEqual(preview!.resourcePreviews[0].mergeState, MergeState.Preview);
			assertConflicts(testObject.conflicts.conflicts, []);
		});
	});

	test('conflicts: preivew -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('conflicts: preivew -> accept -> discard -> accept -> apply', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncResult = { hasConflicts: false, hasError: false };
			testObject.syncBarrier.open();
			await testObject.sync(await client.getLatestRef(testObject.resource));

			const expectedContent = (await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString();
			let preview = await testObject.sync(await client.getLatestRef(testObject.resource), true);
			preview = await testObject.accept(preview!.resourcePreviews[0].remoteResource);
			preview = await testObject.discard(preview!.resourcePreviews[0].previewResource);
			preview = await testObject.accept(preview!.resourcePreviews[0].localResource);
			preview = await testObject.apply(false);

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual(preview, null);
			assertConflicts(testObject.conflicts.conflicts, []);
			assert.strictEqual((await testObject.getRemoteUserData(null)).syncData?.content, expectedContent);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), expectedContent);
		});
	});

	test('remote is accepted if last sync state does not exists in server', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp();
			const synchronizer2: TestSynchroniser = disposableStore.add(client2.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client2.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			synchronizer2.syncBarrier.open();
			const ref = await client2.getLatestRef(testObject.resource);
			await synchronizer2.sync(ref);

			await fileService.del(testObject.getLastSyncResource());
			await testObject.sync(await client.getLatestRef(testObject.resource));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			assert.strictEqual((await client.instantiationService.get(IFileService).readFile(testObject.localResource)).value.toString(), ref);
		});
	});

});

suite('TestSynchronizer - Last Sync Data', () => {
	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp();
	});

	test('last sync data is null when not synced before', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));

			const actual = await testObject.getLastSyncUserData();

			assert.strictEqual(actual, null);
		});
	});

	test('last sync data is set after sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(JSON.parse((await fileService.readFile(testObject.getLastSyncResource())).value.toString()), { ref: '1', syncData: { version: 1, machineId, content: '0' } });
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
		});
	});

	test('last sync data is read from server after sync if last sync resource is deleted', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.del(testObject.getLastSyncResource());
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
		});
	});

	test('last sync data is read from server after sync and sync data is invalid', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				version: 1,
				content: JSON.stringify({
					content: '0',
					machineId,
					version: 1
				}),
				additionalData: {
					foo: 'bar'
				}
			})));
			server.reset();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				},
			});
			assert.deepStrictEqual(server.requests, [{ headers: {}, type: 'GET', url: 'http://host:3000/v1/resource/settings/1' }]);
		});
	});

	test('last sync data is read from server after sync and stored sync data is tampered', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '2',
				syncData: {
					content: '0',
					machineId,
					version: 1
				}
			})));
			server.reset();
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.deepStrictEqual(actual, {
				ref: '1',
				syncData: {
					content: '0',
					machineId,
					version: 1
				}
			});
			assert.deepStrictEqual(server.requests, [{ headers: {}, type: 'GET', url: 'http://host:3000/v1/resource/settings/1' }]);
		});
	});

	test('reading last sync data: no requests are made to server when sync data is invalid', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			const machineId = await testObject.getMachineId();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				version: 1,
				content: JSON.stringify({
					content: '0',
					machineId,
					version: 1
				}),
				additionalData: {
					foo: 'bar'
				}
			})));
			await testObject.getLastSyncUserData();
			server.reset();

			await testObject.getLastSyncUserData();
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('reading last sync data: no requests are made to server when sync data is null', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			server.reset();
			await fileService.writeFile(testObject.getLastSyncResource(), VSBuffer.fromString(JSON.stringify({
				ref: '1',
				syncData: null,
			})));
			await testObject.getLastSyncUserData();

			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('last sync data is null after sync if last sync state is deleted', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			storageService.remove('settings.lastSyncUserData', StorageScope.APPLICATION);
			const actual = await testObject.getLastSyncUserData();

			assert.strictEqual(actual, null);
		});
	});

	test('last sync data is null after sync if last sync content is deleted everywhere', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const storageService = client.instantiationService.get(IStorageService);
			const fileService = client.instantiationService.get(IFileService);
			const userDataSyncStoreService = client.instantiationService.get(IUserDataSyncStoreService);
			const testObject: TestSynchroniser = disposableStore.add(client.instantiationService.createInstance(TestSynchroniser, { syncResource: SyncResource.Settings, profile: client.instantiationService.get(IUserDataProfilesService).defaultProfile }, undefined));
			testObject.syncBarrier.open();

			await testObject.sync(await client.getLatestRef(testObject.resource));
			await fileService.del(testObject.getLastSyncResource());
			await userDataSyncStoreService.deleteResource(testObject.syncResource.syncResource, null);
			const actual = await testObject.getLastSyncUserData();

			assert.deepStrictEqual(storageService.get('settings.lastSyncUserData', StorageScope.APPLICATION), JSON.stringify({ ref: '1' }));
			assert.strictEqual(actual, null);
		});
	});

});

function assertConflicts(actual: IBaseResourcePreview[], expected: URI[]) {
	assert.deepStrictEqual(actual.map(({ localResource }) => localResource.toString()), expected.map(uri => uri.toString()));
}

function assertPreviews(actual: IBaseResourcePreview[], expected: URI[]) {
	assert.deepStrictEqual(actual.map(({ localResource }) => localResource.toString()), expected.map(uri => uri.toString()));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/tasksSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/tasksSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileService } from '../../../files/common/files.js';
import { ILogService } from '../../../log/common/log.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { getTasksContentFromSyncContent, TasksSynchroniser } from '../../common/tasksSync.js';
import { Change, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('TasksSync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	let testObject: TasksSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Tasks) as TasksSynchroniser;
	});

	test('when tasks file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);
			assert.ok(!await fileService.exists(tasksResource));

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when tasks file does not exist and remote has changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await client2.instantiationService.get(IFileService).writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file exists locally and remote has no tasks', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('first time sync: when tasks file exists locally with same content as remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await client2.instantiationService.get(IFileService).writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file locally has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('when tasks file remotely has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely with same changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const previewContent = (await fileService.readFile(testObject.conflicts.conflicts[0].previewResource)).value.toString();
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
			assert.deepStrictEqual(testObject.conflicts.conflicts.length, 1);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].mergeState, MergeState.Conflict);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].localChange, Change.Modified);
			assert.deepStrictEqual(testObject.conflicts.conflicts[0].remoteChange, Change.Modified);

			await testObject.accept(testObject.conflicts.conflicts[0].previewResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), previewContent);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept modified preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch 2'
				}]
			});
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			});
			fileService2.writeFile(tasksResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file has moved forward locally and remotely - accept local', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));

			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			fileService2.writeFile(tasksResource2, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
				}]
			})));
			await client2.sync();

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			fileService.writeFile(tasksResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(tasksResource)).value.toString(), content);
		});
	});

	test('when tasks file was removed in one client', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await fileService.writeFile(tasksResource, VSBuffer.fromString(JSON.stringify({
				'version': '2.0.0',
				'tasks': []
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			await client2.sync();

			const tasksResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			fileService2.del(tasksResource2);
			await client2.sync();

			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(getTasksContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(await fileService.exists(tasksResource), false);
		});
	});

	test('when tasks file is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			await testObject.sync(await client.getLatestRef(SyncResource.Tasks));

			const content = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			await fileService.createFile(tasksResource, VSBuffer.fromString(content));

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await client.getLatestRef(SyncResource.Tasks);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
			]);

			lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(getTasksContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('apply remote when tasks file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const tasksResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.tasksResource;
			if (await fileService.exists(tasksResource)) {
				await fileService.del(tasksResource);
			}

			const preview = (await testObject.sync(await client.getLatestRef(SyncResource.Tasks), true))!;

			server.reset();
			const content = await testObject.resolveContent(preview.resourcePreviews[0].remoteResource);
			await testObject.accept(preview.resourcePreviews[0].remoteResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('sync profile tasks', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
			const expected = JSON.stringify({
				'version': '2.0.0',
				'tasks': [{
					'type': 'npm',
					'script': 'watch',
					'label': 'Watch'
				}]
			});
			await client2.instantiationService.get(IFileService).createFile(profile.tasksResource, VSBuffer.fromString(expected));
			await client2.sync();

			await client.sync();

			const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
			const actual = (await client.instantiationService.get(IFileService).readFile(syncedProfile.tasksResource)).value.toString();
			assert.strictEqual(actual, expected);
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/userDataAutoSyncService.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataAutoSyncService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Event } from '../../../../base/common/event.js';
import { joinPath } from '../../../../base/common/resources.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { UserDataAutoSyncService } from '../../common/userDataAutoSyncService.js';
import { IUserDataSyncService, SyncResource, UserDataAutoSyncError, UserDataSyncErrorCode, UserDataSyncStoreError } from '../../common/userDataSync.js';
import { IUserDataSyncMachinesService } from '../../common/userDataSyncMachines.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

class TestUserDataAutoSyncService extends UserDataAutoSyncService {
	protected override startAutoSync(): boolean { return false; }
	protected override getSyncTriggerDelayTime(): number { return 50; }

	sync(): Promise<void> {
		return this.triggerSync(['sync']);
	}
}

suite('UserDataAutoSyncService', () => {

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	test('test auto sync with sync resource change triggers sync', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();

			// Sync once and reset requests
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();
			target.reset();

			const testObject: UserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Trigger auto sync with settings change
			await testObject.triggerSync([SyncResource.Settings]);

			// Filter out machine requests
			const actual = target.requests.filter(request => !request.url.startsWith(`${target.url}/v1/resource/machines`));

			// Make sure only one manifest request is made
			assert.deepStrictEqual(actual, [{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} }]);
		});
	});

	test('test auto sync with sync resource change triggers sync for every change', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();

			// Sync once and reset requests
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();
			target.reset();

			const testObject: UserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Trigger auto sync with settings change multiple times
			for (let counter = 0; counter < 2; counter++) {
				await testObject.triggerSync([SyncResource.Settings]);
			}

			// Filter out machine requests
			const actual = target.requests.filter(request => !request.url.startsWith(`${target.url}/v1/resource/machines`));

			assert.deepStrictEqual(actual, [
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } }
			]);
		});
	});

	test('test auto sync with non sync resource change triggers sync', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();

			// Sync once and reset requests
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();
			target.reset();

			const testObject: UserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Trigger auto sync with window focus once
			await testObject.triggerSync(['windowFocus']);

			// Filter out machine requests
			const actual = target.requests.filter(request => !request.url.startsWith(`${target.url}/v1/resource/machines`));

			// Make sure only one manifest request is made
			assert.deepStrictEqual(actual, [{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} }]);
		});
	});

	test('test auto sync with non sync resource change does not trigger continuous syncs', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();

			// Sync once and reset requests
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();
			target.reset();

			const testObject: UserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Trigger auto sync with window focus multiple times
			for (let counter = 0; counter < 2; counter++) {
				await testObject.triggerSync(['windowFocus'], { skipIfSyncedRecently: true });
			}

			// Filter out machine requests
			const actual = target.requests.filter(request => !request.url.startsWith(`${target.url}/v1/resource/machines`));

			// Make sure only one manifest request is made
			assert.deepStrictEqual(actual, [{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} }]);
		});
	});

	test('test first auto sync requests', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			await testObject.sync();

			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
				// Machines
				{ type: 'GET', url: `${target.url}/v1/resource/machines/latest`, headers: {} },
				// Settings
				{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '0' } },
				// Keybindings
				{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '0' } },
				// Snippets
				{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '0' } },
				// Tasks
				{ type: 'POST', url: `${target.url}/v1/resource/tasks`, headers: { 'If-Match': '0' } },
				// Global state
				{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '0' } },
				// Prompts
				{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '0' } },
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
				// Machines
				{ type: 'POST', url: `${target.url}/v1/resource/machines`, headers: { 'If-Match': '0' } }
			]);
		});
	});

	test('test further auto sync requests without changes', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Sync once and reset requests
			await testObject.sync();
			target.reset();

			await testObject.sync();

			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } }
			]);
		});
	});

	test('test further auto sync requests with changes', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Sync once and reset requests
			await testObject.sync();
			target.reset();

			// Do changes in the client
			const fileService = client.instantiationService.get(IFileService);
			const environmentService = client.instantiationService.get(IEnvironmentService);
			const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
			await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
			await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
			await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
			await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'h1.prompt.md'), VSBuffer.fromString(' '));
			await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
			await testObject.sync();

			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } },
				// Settings
				{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
				// Keybindings
				{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
				// Snippets
				{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
				// Global state
				{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '1' } },
				// Prompts
				{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
			]);
		});
	});

	test('test auto sync send execution id header', async () => {
		await runWithFakedTimers({}, async () => {
			// Setup the client
			const target = new UserDataSyncTestServer();
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(client.instantiationService.createInstance(TestUserDataAutoSyncService));

			// Sync once and reset requests
			await testObject.sync();
			target.reset();

			await testObject.sync();

			for (const request of target.requestsWithAllHeaders) {
				const hasExecutionIdHeader = request.headers && request.headers['X-Execution-Id'] && request.headers['X-Execution-Id'].length > 0;
				if (request.url.startsWith(`${target.url}/v1/resource/machines`)) {
					assert.ok(!hasExecutionIdHeader, `Should not have execution header: ${request.url}`);
				} else {
					assert.ok(hasExecutionIdHeader, `Should have execution header: ${request.url}`);
				}
			}
		});
	});

	test('test delete on one client throws turned off error on other client while syncing', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer();

			// Set up and sync from the client
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));
			await testObject.sync();

			// Reset from the first client
			await client.instantiationService.get(IUserDataSyncService).reset();

			// Sync from the test client
			target.reset();

			const errorPromise = Event.toPromise(testObject.onError);
			await testObject.sync();

			const e = await errorPromise;
			assert.ok(e instanceof UserDataAutoSyncError);
			assert.deepStrictEqual((<UserDataAutoSyncError>e).code, UserDataSyncErrorCode.TurnedOff);
			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } },
				// Machine
				{ type: 'GET', url: `${target.url}/v1/resource/machines/latest`, headers: { 'If-None-Match': '1' } },
			]);
		});
	});

	test('test disabling the machine turns off sync', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer();

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));
			await testObject.sync();

			// Disable current machine
			const userDataSyncMachinesService = testClient.instantiationService.get(IUserDataSyncMachinesService);
			const machines = await userDataSyncMachinesService.getMachines();
			const currentMachine = machines.find(m => m.isCurrent)!;
			await userDataSyncMachinesService.setEnablements([[currentMachine.id, false]]);

			target.reset();

			const errorPromise = Event.toPromise(testObject.onError);
			await testObject.sync();

			const e = await errorPromise;
			assert.ok(e instanceof UserDataAutoSyncError);
			assert.deepStrictEqual((<UserDataAutoSyncError>e).code, UserDataSyncErrorCode.TurnedOff);
			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } },
				// Machine
				{ type: 'GET', url: `${target.url}/v1/resource/machines/latest`, headers: { 'If-None-Match': '2' } },
				{ type: 'POST', url: `${target.url}/v1/resource/machines`, headers: { 'If-Match': '2' } },
			]);
		});
	});

	test('test removing the machine adds machine back', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer();

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));
			await testObject.sync();

			// Remove current machine
			await testClient.instantiationService.get(IUserDataSyncMachinesService).removeCurrentMachine();

			target.reset();

			await testObject.sync();
			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } },
				// Machine
				{ type: 'POST', url: `${target.url}/v1/resource/machines`, headers: { 'If-Match': '2' } },
			]);
		});
	});

	test('test creating new session from one client throws session expired error on another client while syncing', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer();

			// Set up and sync from the client
			const client = disposableStore.add(new UserDataSyncClient(target));
			await client.setUp();
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));
			await testObject.sync();

			// Reset from the first client
			await client.instantiationService.get(IUserDataSyncService).reset();

			// Sync again from the first client to create new session
			await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

			// Sync from the test client
			target.reset();

			const errorPromise = Event.toPromise(testObject.onError);
			await testObject.sync();

			const e = await errorPromise;
			assert.ok(e instanceof UserDataAutoSyncError);
			assert.deepStrictEqual((<UserDataAutoSyncError>e).code, UserDataSyncErrorCode.SessionExpired);
			assert.deepStrictEqual(target.requests, [
				// Manifest
				{ type: 'GET', url: `${target.url}/v1/manifest`, headers: { 'If-None-Match': '1' } },
				// Machine
				{ type: 'GET', url: `${target.url}/v1/resource/machines/latest`, headers: { 'If-None-Match': '1' } },
			]);
		});
	});

	test('test rate limit on server', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer(5);

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));

			const errorPromise = Event.toPromise(testObject.onError);
			while (target.requests.length < 5) {
				await testObject.sync();
			}

			const e = await errorPromise;
			assert.ok(e instanceof UserDataSyncStoreError);
			assert.deepStrictEqual((<UserDataSyncStoreError>e).code, UserDataSyncErrorCode.TooManyRequests);
		});
	});

	test('test auto sync is suspended when server donot accepts requests', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer(5, 1);

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));

			while (target.requests.length < 5) {
				await testObject.sync();
			}

			target.reset();
			await testObject.sync();

			assert.deepStrictEqual(target.requests, []);
		});
	});

	test('test cache control header with no cache is sent when triggered with disable cache option', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer(5, 1);

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));

			await testObject.triggerSync(['some reason'], { disableCache: true });
			assert.strictEqual(target.requestsWithAllHeaders[0].headers!['Cache-Control'], 'no-cache');
		});
	});

	test('test cache control header is not sent when triggered without disable cache option', async () => {
		await runWithFakedTimers({}, async () => {
			const target = new UserDataSyncTestServer(5, 1);

			// Set up and sync from the test client
			const testClient = disposableStore.add(new UserDataSyncClient(target));
			await testClient.setUp();
			const testObject: TestUserDataAutoSyncService = disposableStore.add(testClient.instantiationService.createInstance(TestUserDataAutoSyncService));

			await testObject.triggerSync(['some reason']);
			assert.strictEqual(target.requestsWithAllHeaders[0].headers!['Cache-Control'], undefined);
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/userDataProfilesManifestMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataProfilesManifestMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IUserDataProfile, toUserDataProfile } from '../../../userDataProfile/common/userDataProfile.js';
import { merge } from '../../common/userDataProfilesManifestMerge.js';
import { ISyncUserDataProfile } from '../../common/userDataSync.js';

suite('UserDataProfilesManifestMerge', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge returns local profiles if remote does not exist', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
			toUserDataProfile('2', '2', URI.file('2'), URI.file('cache')),
		];

		const actual = merge(localProfiles, null, null, []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.added, localProfiles);
		assert.deepStrictEqual(actual.remote?.updated, []);
		assert.deepStrictEqual(actual.remote?.removed, []);
	});

	test('merge returns local profiles if remote does not exist with ignored profiles', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
			toUserDataProfile('2', '2', URI.file('2'), URI.file('cache')),
		];

		const actual = merge(localProfiles, null, null, ['2']);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.added, [localProfiles[0]]);
		assert.deepStrictEqual(actual.remote?.updated, []);
		assert.deepStrictEqual(actual.remote?.removed, []);
	});

	test('merge local and remote profiles when there is no base', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
			toUserDataProfile('2', '2', URI.file('2'), URI.file('cache')),
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: 'changed', collection: '1' },
			{ id: '3', name: '3', collection: '3' },
		];

		const actual = merge(localProfiles, remoteProfiles, null, []);

		assert.deepStrictEqual(actual.local.added, [remoteProfiles[1]]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [remoteProfiles[0]]);
		assert.deepStrictEqual(actual.remote?.added, [localProfiles[1]]);
		assert.deepStrictEqual(actual.remote?.updated, []);
		assert.deepStrictEqual(actual.remote?.removed, []);
	});

	test('merge local and remote profiles when there is base', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', 'changed 1', URI.file('1'), URI.file('cache')),
			toUserDataProfile('3', '3', URI.file('3'), URI.file('cache')),
			toUserDataProfile('4', 'changed local', URI.file('4'), URI.file('cache')),
			toUserDataProfile('5', '5', URI.file('5'), URI.file('cache')),
			toUserDataProfile('6', '6', URI.file('6'), URI.file('cache')),
			toUserDataProfile('8', '8', URI.file('8'), URI.file('cache')),
			toUserDataProfile('10', '10', URI.file('8'), URI.file('cache'), { useDefaultFlags: { tasks: true } }),
			toUserDataProfile('11', '11', URI.file('1'), URI.file('cache'), { useDefaultFlags: { keybindings: true } }),
		];
		const base: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
			{ id: '2', name: '2', collection: '2' },
			{ id: '3', name: '3', collection: '3' },
			{ id: '4', name: '4', collection: '4' },
			{ id: '5', name: '5', collection: '5' },
			{ id: '6', name: '6', collection: '6' },
			{ id: '10', name: '10', collection: '10', useDefaultFlags: { tasks: true } },
			{ id: '11', name: '11', collection: '11' },
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
			{ id: '2', name: '2', collection: '2' },
			{ id: '3', name: '3', collection: '3' },
			{ id: '4', name: 'changed remote', collection: '4' },
			{ id: '5', name: '5', collection: '5' },
			{ id: '7', name: '7', collection: '7' },
			{ id: '9', name: '9', collection: '9', useDefaultFlags: { snippets: true } },
			{ id: '10', name: '10', collection: '10' },
			{ id: '11', name: '11', collection: '11' },
		];

		const actual = merge(localProfiles, remoteProfiles, base, []);

		assert.deepStrictEqual(actual.local.added, [remoteProfiles[5], remoteProfiles[6]]);
		assert.deepStrictEqual(actual.local.removed, [localProfiles[4]]);
		assert.deepStrictEqual(actual.local.updated, [remoteProfiles[3], remoteProfiles[7]]);
		assert.deepStrictEqual(actual.remote?.added, [localProfiles[5]]);
		assert.deepStrictEqual(actual.remote?.updated, [localProfiles[0], localProfiles[7]]);
		assert.deepStrictEqual(actual.remote?.removed, [remoteProfiles[1]]);
	});

	test('merge local and remote profiles when there is base with ignored profiles', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', 'changed 1', URI.file('1'), URI.file('cache')),
			toUserDataProfile('3', '3', URI.file('3'), URI.file('cache')),
			toUserDataProfile('4', 'changed local', URI.file('4'), URI.file('cache')),
			toUserDataProfile('5', '5', URI.file('5'), URI.file('cache')),
			toUserDataProfile('6', '6', URI.file('6'), URI.file('cache')),
			toUserDataProfile('8', '8', URI.file('8'), URI.file('cache')),
		];
		const base: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
			{ id: '2', name: '2', collection: '2' },
			{ id: '3', name: '3', collection: '3' },
			{ id: '4', name: '4', collection: '4' },
			{ id: '5', name: '5', collection: '5' },
			{ id: '6', name: '6', collection: '6' },
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
			{ id: '2', name: '2', collection: '2' },
			{ id: '3', name: 'changed 3', collection: '3' },
			{ id: '4', name: 'changed remote', collection: '4' },
			{ id: '5', name: '5', collection: '5' },
			{ id: '7', name: '7', collection: '7' },
		];

		const actual = merge(localProfiles, remoteProfiles, base, ['4', '8']);

		assert.deepStrictEqual(actual.local.added, [remoteProfiles[5]]);
		assert.deepStrictEqual(actual.local.removed, [localProfiles[4]]);
		assert.deepStrictEqual(actual.local.updated, [remoteProfiles[2]]);
		assert.deepStrictEqual(actual.remote?.added, []);
		assert.deepStrictEqual(actual.remote?.updated, [localProfiles[0]]);
		assert.deepStrictEqual(actual.remote?.removed, [remoteProfiles[1]]);
	});

	test('merge when there are no remote changes', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
		];
		const base: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: 'name changed', collection: '1' },
		];

		const actual = merge(localProfiles, remoteProfiles, base, []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [remoteProfiles[0]]);
		assert.strictEqual(actual.remote, null);
	});

	test('merge when there are no local and remote changes', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
		];
		const base: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
		];

		const actual = merge(localProfiles, remoteProfiles, base, []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.strictEqual(actual.remote, null);
	});

	test('merge when profile is removed locally, but not exists in remote', () => {
		const localProfiles: IUserDataProfile[] = [
			toUserDataProfile('1', '1', URI.file('1'), URI.file('cache')),
		];
		const base: ISyncUserDataProfile[] = [
			{ id: '1', name: '1', collection: '1' },
			{ id: '2', name: '2', collection: '2' },
		];
		const remoteProfiles: ISyncUserDataProfile[] = [
			{ id: '1', name: '3', collection: '1' },
		];

		const actual = merge(localProfiles, remoteProfiles, base, []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, remoteProfiles);
		assert.strictEqual(actual.remote, null);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/userDataProfilesManifestSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataProfilesManifestSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { UserDataProfilesManifestSynchroniser } from '../../common/userDataProfilesManifestSync.js';
import { ISyncData, ISyncUserDataProfile, IUserDataSyncStoreService, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('UserDataProfilesManifestSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: UserDataProfilesManifestSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.Profiles) as UserDataProfilesManifestSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when profiles does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when profile is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', '1');

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await testClient.getLatestRef(SyncResource.Profiles);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/collection`, headers: {} },
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
			]);

			lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.deepStrictEqual(JSON.parse(lastSyncUserData!.syncData!.content), [{ 'name': '1', 'id': '1', 'collection': '1' }]);
		});
	});

	test('first time sync - outgoing to server (no state)', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', '1');

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			assert.deepStrictEqual(JSON.parse(JSON.parse(content).content), [{ 'name': '1', 'id': '1', 'collection': '1' }]);
		});
	});

	test('first time sync - incoming from server (no state)', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }]);
		});
	});

	test('first time sync when profiles exists', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }, { id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('first time sync when storage exists - has conflicts', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const profiles = getLocalProfiles(testClient);
			assert.deepStrictEqual(profiles, [{ id: '1', name: 'name 1', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }]);
		});
	});

	test('sync adding a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '1', name: 'name 1', useDefaultFlags: undefined }, { id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1' }, { id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('sync updating a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			await testClient.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { name: 'name 2' });
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '1', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 2', collection: '1' }]);
		});
	});

	test('sync removing a profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await testClient.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await testClient.instantiationService.get(IUserDataProfilesService).createProfile('2', 'name 2');
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			await client2.sync();

			testClient.instantiationService.get(IUserDataProfilesService).removeProfile(profile);
			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			await client2.sync();
			assert.deepStrictEqual(getLocalProfiles(client2), [{ id: '2', name: 'name 2', useDefaultFlags: undefined }]);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '2', name: 'name 2', collection: '2' }]);
		});
	});

	test('sync profile that uses default profile', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1', { useDefaultFlags: { keybindings: true } });
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);

			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	test('sync profile when the profile is updated to use default profile locally', async () => {
		await runWithFakedTimers<void>({}, async () => {
			await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			const profile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === '1')!;
			testClient.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { useDefaultFlags: { keybindings: true } });

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);
			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	test('sync profile when the profile is updated to use default profile remotely', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createProfile('1', 'name 1');
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));

			client2.instantiationService.get(IUserDataProfilesService).updateProfile(profile, { useDefaultFlags: { keybindings: true } });
			await client2.sync();

			await testObject.sync(await testClient.getLatestRef(SyncResource.Profiles));
			assert.strictEqual(testObject.status, SyncStatus.Idle);
			assert.deepStrictEqual(testObject.conflicts.conflicts, []);

			const { content } = await testClient.read(testObject.resource);
			assert.ok(content !== null);
			const actual = parseRemoteProfiles(content);
			assert.deepStrictEqual(actual, [{ id: '1', name: 'name 1', collection: '1', useDefaultFlags: { keybindings: true } }]);

			assert.deepStrictEqual(getLocalProfiles(testClient), [{ id: '1', name: 'name 1', useDefaultFlags: { keybindings: true } }]);
		});
	});

	function parseRemoteProfiles(content: string): ISyncUserDataProfile[] {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	function getLocalProfiles(client: UserDataSyncClient): { id: string; name: string }[] {
		return client.instantiationService.get(IUserDataProfilesService).profiles
			.slice(1).sort((a, b) => a.name.localeCompare(b.name))
			.map(profile => ({ id: profile.id, name: profile.name, useDefaultFlags: profile.useDefaultFlags }));
	}


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/userDataSyncClient.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataSyncClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter } from '../../../../base/common/event.js';
import { FormattingOptions } from '../../../../base/common/jsonFormatter.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IHeaders, IRequestContext, IRequestOptions } from '../../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { ConfigurationService } from '../../../configuration/common/configurationService.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { GlobalExtensionEnablementService } from '../../../extensionManagement/common/extensionEnablementService.js';
import { DidUninstallExtensionEvent, IExtensionGalleryService, IExtensionManagementService, IGlobalExtensionEnablementService, InstallExtensionResult } from '../../../extensionManagement/common/extensionManagement.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { AuthInfo, Credentials, IRequestService } from '../../../request/common/request.js';
import { InMemoryStorageService, IStorageService } from '../../../storage/common/storage.js';
import { ITelemetryService } from '../../../telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../telemetry/common/telemetryUtils.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { ExtensionStorageService, IExtensionStorageService } from '../../../extensionManagement/common/extensionStorage.js';
import { IgnoredExtensionsManagementService, IIgnoredExtensionsManagementService } from '../../common/ignoredExtensions.js';
import { ALL_SYNC_RESOURCES, getDefaultIgnoredSettings, IUserData, IUserDataSyncLocalStoreService, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncService, IUserDataSyncStoreManagementService, IUserDataSyncStoreService, IUserDataSyncUtilService, registerConfiguration, ServerResource, SyncResource, IUserDataSynchroniser, IUserDataResourceManifest, IUserDataCollectionManifest, USER_DATA_SYNC_SCHEME, IUserDataManifest } from '../../common/userDataSync.js';
import { IUserDataSyncAccountService, UserDataSyncAccountService } from '../../common/userDataSyncAccount.js';
import { UserDataSyncLocalStoreService } from '../../common/userDataSyncLocalStoreService.js';
import { IUserDataSyncMachinesService, UserDataSyncMachinesService } from '../../common/userDataSyncMachines.js';
import { UserDataSyncEnablementService } from '../../common/userDataSyncEnablementService.js';
import { UserDataSyncService } from '../../common/userDataSyncService.js';
import { UserDataSyncStoreManagementService, UserDataSyncStoreService } from '../../common/userDataSyncStoreService.js';
import { InMemoryUserDataProfilesService, IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { NullPolicyService } from '../../../policy/common/policy.js';
import { IUserDataProfileStorageService } from '../../../userDataProfile/common/userDataProfileStorageService.js';
import { TestUserDataProfileStorageService } from '../../../userDataProfile/test/common/userDataProfileStorageService.test.js';

export class UserDataSyncClient extends Disposable {

	readonly instantiationService: TestInstantiationService;

	constructor(readonly testServer: UserDataSyncTestServer = new UserDataSyncTestServer()) {
		super();
		this.instantiationService = this._register(new TestInstantiationService());
	}

	async setUp(empty: boolean = false): Promise<void> {
		this._register(registerConfiguration());

		const logService = this.instantiationService.stub(ILogService, new NullLogService());

		const userRoamingDataHome = URI.file('userdata').with({ scheme: Schemas.inMemory });
		const userDataSyncHome = joinPath(userRoamingDataHome, '.sync');
		const environmentService = this.instantiationService.stub(IEnvironmentService, {
			userDataSyncHome,
			userRoamingDataHome,
			cacheHome: joinPath(userRoamingDataHome, 'cache'),
			argvResource: joinPath(userRoamingDataHome, 'argv.json'),
			sync: 'on',
		});

		this.instantiationService.stub(IProductService, {
			_serviceBrand: undefined, ...product, ...{
				'configurationSync.store': {
					url: this.testServer.url,
					stableUrl: this.testServer.url,
					insidersUrl: this.testServer.url,
					canSwitch: false,
					authenticationProviders: { 'test': { scopes: [] } }
				}
			}
		});

		const fileService = this._register(new FileService(logService));
		this._register(fileService.registerProvider(Schemas.inMemory, this._register(new InMemoryFileSystemProvider())));
		this._register(fileService.registerProvider(USER_DATA_SYNC_SCHEME, this._register(new InMemoryFileSystemProvider())));
		this.instantiationService.stub(IFileService, fileService);

		const uriIdentityService = this._register(this.instantiationService.createInstance(UriIdentityService));
		this.instantiationService.stub(IUriIdentityService, uriIdentityService);

		const userDataProfilesService = this._register(new InMemoryUserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		this.instantiationService.stub(IUserDataProfilesService, userDataProfilesService);

		const storageService = this._register(new TestStorageService(userDataProfilesService.defaultProfile));
		this.instantiationService.stub(IStorageService, this._register(storageService));
		this.instantiationService.stub(IUserDataProfileStorageService, this._register(new TestUserDataProfileStorageService(false, storageService)));

		const configurationService = this._register(new ConfigurationService(userDataProfilesService.defaultProfile.settingsResource, fileService, new NullPolicyService(), logService));
		await configurationService.initialize();
		this.instantiationService.stub(IConfigurationService, configurationService);

		this.instantiationService.stub(IRequestService, this.testServer);

		this.instantiationService.stub(IUserDataSyncLogService, logService);
		this.instantiationService.stub(ITelemetryService, NullTelemetryService);
		this.instantiationService.stub(IUserDataSyncStoreManagementService, this._register(this.instantiationService.createInstance(UserDataSyncStoreManagementService)));
		this.instantiationService.stub(IUserDataSyncStoreService, this._register(this.instantiationService.createInstance(UserDataSyncStoreService)));

		const userDataSyncAccountService: IUserDataSyncAccountService = this._register(this.instantiationService.createInstance(UserDataSyncAccountService));
		await userDataSyncAccountService.updateAccount({ authenticationProviderId: 'authenticationProviderId', token: 'token' });
		this.instantiationService.stub(IUserDataSyncAccountService, userDataSyncAccountService);

		this.instantiationService.stub(IUserDataSyncMachinesService, this._register(this.instantiationService.createInstance(UserDataSyncMachinesService)));
		this.instantiationService.stub(IUserDataSyncLocalStoreService, this._register(this.instantiationService.createInstance(UserDataSyncLocalStoreService)));
		this.instantiationService.stub(IUserDataSyncUtilService, new TestUserDataSyncUtilService());
		this.instantiationService.stub(IUserDataSyncEnablementService, this._register(this.instantiationService.createInstance(UserDataSyncEnablementService)));

		this.instantiationService.stub(IExtensionManagementService, {
			async getInstalled() { return []; },
			onDidInstallExtensions: new Emitter<readonly InstallExtensionResult[]>().event,
			onDidUninstallExtension: new Emitter<DidUninstallExtensionEvent>().event,
		});
		this.instantiationService.stub(IGlobalExtensionEnablementService, this._register(this.instantiationService.createInstance(GlobalExtensionEnablementService)));
		this.instantiationService.stub(IExtensionStorageService, this._register(this.instantiationService.createInstance(ExtensionStorageService)));
		this.instantiationService.stub(IIgnoredExtensionsManagementService, this.instantiationService.createInstance(IgnoredExtensionsManagementService));
		this.instantiationService.stub(IExtensionGalleryService, {
			isEnabled() { return true; },
			async getCompatibleExtension() { return null; }
		});

		this.instantiationService.stub(IUserDataSyncService, this._register(this.instantiationService.createInstance(UserDataSyncService)));

		if (!empty) {
			await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({})));
			await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([])));
			await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'c.json'), VSBuffer.fromString(`{}`));
			await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'c.prompt.md'), VSBuffer.fromString(' '));
			await fileService.writeFile(userDataProfilesService.defaultProfile.tasksResource, VSBuffer.fromString(`{}`));
			await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'en' })));
		}
		await configurationService.reloadConfiguration();

		// `prompts` resource is disabled by default, so enable it for tests
		this.instantiationService
			.get(IUserDataSyncEnablementService)
			.setResourceEnablement(SyncResource.Prompts, true);
	}

	async sync(): Promise<void> {
		await (await this.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();
	}

	read(resource: SyncResource, collection?: string): Promise<IUserData> {
		return this.instantiationService.get(IUserDataSyncStoreService).readResource(resource, null, collection);
	}

	async getLatestRef(resource: SyncResource): Promise<string | null> {
		const manifest = await this._getResourceManifest();
		return manifest?.[resource] ?? null;
	}

	async _getResourceManifest(): Promise<IUserDataResourceManifest | null> {
		const manifest = await this.instantiationService.get(IUserDataSyncStoreService).manifest(null);
		return manifest?.latest ?? null;
	}

	getSynchronizer(source: SyncResource): IUserDataSynchroniser {
		return (this.instantiationService.get(IUserDataSyncService) as UserDataSyncService).getOrCreateActiveProfileSynchronizer(this.instantiationService.get(IUserDataProfilesService).defaultProfile, undefined).enabled.find(s => s.resource === source)!;
	}

}

const ALL_SERVER_RESOURCES: ServerResource[] = [...ALL_SYNC_RESOURCES, 'machines'];

export class UserDataSyncTestServer implements IRequestService {

	_serviceBrand: undefined;

	readonly url: string = 'http://host:3000';
	private session: string | null = null;
	private readonly collections = new Map<string, Map<ServerResource, IUserData>>();
	private readonly data = new Map<ServerResource, IUserData>();

	private _requests: { url: string; type: string; headers?: IHeaders }[] = [];
	get requests(): { url: string; type: string; headers?: IHeaders }[] { return this._requests; }

	private _requestsWithAllHeaders: { url: string; type: string; headers?: IHeaders }[] = [];
	get requestsWithAllHeaders(): { url: string; type: string; headers?: IHeaders }[] { return this._requestsWithAllHeaders; }

	private _responses: { status: number }[] = [];
	get responses(): { status: number }[] { return this._responses; }
	reset(): void { this._requests = []; this._responses = []; this._requestsWithAllHeaders = []; }

	private manifestRef = 0;
	private collectionCounter = 0;

	constructor(private readonly rateLimit = Number.MAX_SAFE_INTEGER, private readonly retryAfter?: number) { }

	async resolveProxy(url: string): Promise<string | undefined> { return url; }
	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> { return undefined; }
	async lookupKerberosAuthorization(url: string): Promise<string | undefined> { return undefined; }
	async loadCertificates(): Promise<string[]> { return []; }

	async request(options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		if (this._requests.length === this.rateLimit) {
			return this.toResponse(429, this.retryAfter ? { 'retry-after': `${this.retryAfter}` } : undefined);
		}
		const headers: IHeaders = {};
		if (options.headers) {
			if (options.headers['If-None-Match']) {
				headers['If-None-Match'] = options.headers['If-None-Match'];
			}
			if (options.headers['If-Match']) {
				headers['If-Match'] = options.headers['If-Match'];
			}
		}
		this._requests.push({ url: options.url!, type: options.type!, headers });
		this._requestsWithAllHeaders.push({ url: options.url!, type: options.type!, headers: options.headers });
		const requestContext = await this.doRequest(options);
		this._responses.push({ status: requestContext.res.statusCode! });
		return requestContext;
	}

	private async doRequest(options: IRequestOptions): Promise<IRequestContext> {
		const versionUrl = `${this.url}/v1/`;
		const relativePath = options.url!.indexOf(versionUrl) === 0 ? options.url!.substring(versionUrl.length) : undefined;
		const segments = relativePath ? relativePath.split('/') : [];
		if (options.type === 'GET' && segments.length === 1 && segments[0] === 'manifest') {
			return this.getManifest(options.headers);
		}
		if (options.type === 'GET' && segments.length === 3 && segments[0] === 'resource') {
			return this.getResourceData(undefined, segments[1], segments[2] === 'latest' ? undefined : segments[2], options.headers);
		}
		if (options.type === 'POST' && segments.length === 2 && segments[0] === 'resource') {
			return this.writeData(undefined, segments[1], options.data, options.headers);
		}
		// resources in collection
		if (options.type === 'GET' && segments.length === 5 && segments[0] === 'collection' && segments[2] === 'resource') {
			return this.getResourceData(segments[1], segments[3], segments[4] === 'latest' ? undefined : segments[4], options.headers);
		}
		if (options.type === 'POST' && segments.length === 4 && segments[0] === 'collection' && segments[2] === 'resource') {
			return this.writeData(segments[1], segments[3], options.data, options.headers);
		}
		if (options.type === 'DELETE' && segments.length === 2 && segments[0] === 'resource') {
			return this.deleteResourceData(undefined, segments[1]);
		}
		if (options.type === 'DELETE' && segments.length === 1 && segments[0] === 'resource') {
			return this.clear(options.headers);
		}
		if (options.type === 'DELETE' && segments[0] === 'collection') {
			return this.toResponse(204);
		}
		if (options.type === 'POST' && segments.length === 1 && segments[0] === 'collection') {
			return this.createCollection();
		}
		return this.toResponse(501);
	}

	private async getManifest(headers?: IHeaders): Promise<IRequestContext> {
		if (this.session) {
			const latest: Record<ServerResource, string> = Object.create({});
			this.data.forEach((value, key) => latest[key] = value.ref);
			let collections: IUserDataCollectionManifest | undefined = undefined;
			if (this.collectionCounter) {
				collections = {};
				for (let collectionId = 1; collectionId <= this.collectionCounter; collectionId++) {
					const collectionData = this.collections.get(`${collectionId}`);
					if (collectionData) {
						const latest: Record<ServerResource, string> = Object.create({});
						collectionData.forEach((value, key) => latest[key] = value.ref);
						collections[`${collectionId}`] = { latest };
					}
				}
			}
			const manifest: IUserDataManifest = { session: this.session, latest, collections, ref: '1' };
			return this.toResponse(200, { 'Content-Type': 'application/json', etag: `${this.manifestRef++}` }, JSON.stringify(manifest));
		}
		return this.toResponse(204, { etag: `${this.manifestRef++}` });
	}

	private async getResourceData(collection: string | undefined, resource: string, ref?: string, headers: IHeaders = {}): Promise<IRequestContext> {
		const collectionData = collection ? this.collections.get(collection) : this.data;
		if (!collectionData) {
			return this.toResponse(501);
		}

		const resourceKey = ALL_SERVER_RESOURCES.find(key => key === resource);
		if (resourceKey) {
			const data = collectionData.get(resourceKey);
			if (ref && data?.ref !== ref) {
				return this.toResponse(404);
			}
			if (!data) {
				return this.toResponse(204, { etag: '0' });
			}
			if (headers['If-None-Match'] === data.ref) {
				return this.toResponse(304);
			}
			return this.toResponse(200, { etag: data.ref }, data.content || '');
		}
		return this.toResponse(204);
	}

	private async writeData(collection: string | undefined, resource: string, content: string = '', headers: IHeaders = {}): Promise<IRequestContext> {
		if (!this.session) {
			this.session = generateUuid();
		}
		const collectionData = collection ? this.collections.get(collection) : this.data;
		if (!collectionData) {
			return this.toResponse(501);
		}
		const resourceKey = ALL_SERVER_RESOURCES.find(key => key === resource);
		if (resourceKey) {
			const data = collectionData.get(resourceKey);
			if (headers['If-Match'] !== undefined && headers['If-Match'] !== (data ? data.ref : '0')) {
				return this.toResponse(412);
			}
			const ref = `${parseInt(data?.ref || '0') + 1}`;
			collectionData.set(resourceKey, { ref, content });
			return this.toResponse(200, { etag: ref });
		}
		return this.toResponse(204);
	}

	private async deleteResourceData(collection: string | undefined, resource: string, headers: IHeaders = {}): Promise<IRequestContext> {
		const collectionData = collection ? this.collections.get(collection) : this.data;
		if (!collectionData) {
			return this.toResponse(501);
		}

		const resourceKey = ALL_SERVER_RESOURCES.find(key => key === resource);
		if (resourceKey) {
			collectionData.delete(resourceKey);
			return this.toResponse(200);
		}

		return this.toResponse(404);
	}

	private async createCollection(): Promise<IRequestContext> {
		const collectionId = `${++this.collectionCounter}`;
		this.collections.set(collectionId, new Map());
		return this.toResponse(200, {}, collectionId);
	}

	async clear(headers?: IHeaders): Promise<IRequestContext> {
		this.collections.clear();
		this.data.clear();
		this.session = null;
		this.collectionCounter = 0;
		return this.toResponse(204);
	}

	private toResponse(statusCode: number, headers?: IHeaders, data?: string): IRequestContext {
		return {
			res: {
				headers: headers || {},
				statusCode
			},
			stream: bufferToStream(VSBuffer.fromString(data || ''))
		};
	}
}

export class TestUserDataSyncUtilService implements IUserDataSyncUtilService {

	_serviceBrand: undefined;

	async resolveDefaultCoreIgnoredSettings(): Promise<string[]> {
		return getDefaultIgnoredSettings();
	}

	async resolveUserBindings(userbindings: string[]): Promise<IStringDictionary<string>> {
		const keys: IStringDictionary<string> = {};
		for (const keybinding of userbindings) {
			keys[keybinding] = keybinding;
		}
		return keys;
	}

	async resolveFormattingOptions(file?: URI): Promise<FormattingOptions> {
		return { eol: '\n', insertSpaces: false, tabSize: 4 };
	}

}

class TestStorageService extends InMemoryStorageService {
	constructor(private readonly profileStorageProfile: IUserDataProfile) {
		super();
	}
	override hasScope(profile: IUserDataProfile): boolean {
		return this.profileStorageProfile.id === profile.id;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/userDataSyncService.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataSyncService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { IUserDataSyncEnablementService, IUserDataSyncService, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('UserDataSyncService', () => {

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	test('test first time sync ever', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);

		// Sync for first time
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '0' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '0' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '0' } },
			// Tasks
			{ type: 'POST', url: `${target.url}/v1/resource/tasks`, headers: { 'If-Match': '0' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '0' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '0' } },
		]);

	});

	test('test first time sync ever when a sync resource is disabled', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		client.instantiationService.get(IUserDataSyncEnablementService).setResourceEnablement(SyncResource.Settings, false);
		const testObject = client.instantiationService.get(IUserDataSyncService);

		// Sync for first time
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '0' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '0' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/tasks`, headers: { 'If-Match': '0' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '0' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '0' } },
		]);
	});

	test('test first time sync ever with no data', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp(true);
		const testObject = client.instantiationService.get(IUserDataSyncService);

		// Sync for first time
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
		]);
	});

	test('test first time sync from the client with no changes - merge', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);

		// Sync (merge) from the test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/tasks/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: {} },
		]);
	});

	test('test first time sync from the client with changes - merge', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client with changes
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const fileService = testClient.instantiationService.get(IFileService);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = testClient.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'mine.prompt.md'), VSBuffer.fromString('text'));
		await fileService.writeFile(joinPath(dirname(userDataProfilesService.defaultProfile.settingsResource), 'tasks.json'), VSBuffer.fromString(JSON.stringify({})));
		const testObject = testClient.instantiationService.get(IUserDataSyncService);

		// Sync (merge) from the test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/tasks/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
		]);

	});

	test('test first time sync from the client with changes - merge with profile', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client with changes
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const fileService = testClient.instantiationService.get(IFileService);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = testClient.instantiationService.get(IUserDataProfilesService);
		await userDataProfilesService.createNamedProfile('1');
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'my.prompt.md'), VSBuffer.fromString('some prompt text'));
		await fileService.writeFile(joinPath(dirname(userDataProfilesService.defaultProfile.settingsResource), 'tasks.json'), VSBuffer.fromString(JSON.stringify({})));
		const testObject = testClient.instantiationService.get(IUserDataSyncService);

		// Sync (merge) from the test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
			{ type: 'GET', url: `${target.url}/v1/resource/tasks/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: {} },
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
			{ type: 'POST', url: `${target.url}/v1/collection`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/profiles`, headers: { 'If-Match': '0' } },
		]);

	});

	test('test sync when there are no changes', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// sync from the client again
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
		]);
	});

	test('test sync when there are local changes', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();
		target.reset();

		// Do changes in the client
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'shared.prompt.md'), VSBuffer.fromString('prompt text'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));

		// Sync from the client
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '1' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
		]);
	});

	test('test sync when there are local changes with profile', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();
		target.reset();

		// Do changes in the client
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await userDataProfilesService.createNamedProfile('1');
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'default.prompt.md'), VSBuffer.fromString('some prompt file contents'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));

		// Sync from the client
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '1' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
			// Profiles
			{ type: 'POST', url: `${target.url}/v1/collection`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/profiles`, headers: { 'If-Match': '0' } },
		]);
	});

	test('test sync when there are local changes and sync resource is disabled', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();
		target.reset();

		// Do changes in the client
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, '1.prompt.md'), VSBuffer.fromString('random prompt text'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		client.instantiationService.get(IUserDataSyncEnablementService).setResourceEnablement(SyncResource.Snippets, false);
		client.instantiationService.get(IUserDataSyncEnablementService).setResourceEnablement(SyncResource.Prompts, false);

		// Sync from the client
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '1' } },
		]);
	});

	test('test sync when there are remote changes', async () => {
		const target = new UserDataSyncTestServer();

		// Sync from first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// Do changes in first client and sync
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{ "a": "changed" }`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'unknown.prompt.md'), VSBuffer.fromString('prompt text'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: { 'If-None-Match': '1' } },
			// Keybindings
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: { 'If-None-Match': '1' } },
			// Snippets
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: { 'If-None-Match': '1' } },
			// Global state
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: { 'If-None-Match': '1' } },
			// Prompts
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: { 'If-None-Match': '1' } },
		]);

	});

	test('test sync when there are remote changes with profile', async () => {
		const target = new UserDataSyncTestServer();

		// Sync from first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// Do changes in first client and sync
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await userDataProfilesService.createNamedProfile('1');
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{ "a": "changed" }`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'global.prompt.md'), VSBuffer.fromString('some text goes here'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: { 'If-None-Match': '1' } },
			// Keybindings
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: { 'If-None-Match': '1' } },
			// Snippets
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: { 'If-None-Match': '1' } },
			// Global state
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: { 'If-None-Match': '1' } },
			// Prompts
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: { 'If-None-Match': '1' } },
			// Profiles
			{ type: 'GET', url: `${target.url}/v1/resource/profiles/latest`, headers: { 'If-None-Match': '0' } },
		]);

	});

	test('test delete', async () => {
		const target = new UserDataSyncTestServer();

		// Sync from the client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// Reset from the client
		target.reset();
		await testObject.reset();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'DELETE', url: `${target.url}/v1/collection`, headers: {} },
			{ type: 'DELETE', url: `${target.url}/v1/resource`, headers: {} },
		]);

	});

	test('test delete and sync', async () => {
		const target = new UserDataSyncTestServer();

		// Sync from the client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// Reset from the client
		await testObject.reset();

		// Sync again
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '0' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '0' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '0' } },
			// Tasks
			{ type: 'POST', url: `${target.url}/v1/resource/tasks`, headers: { 'If-Match': '0' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '0' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '0' } },
		]);

	});

	test('test sync status', async () => {
		const target = new UserDataSyncTestServer();

		// Setup the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);

		// sync from the client
		const actualStatuses: SyncStatus[] = [];
		const disposable = testObject.onDidChangeStatus(status => actualStatuses.push(status));
		await (await testObject.createSyncTask(null)).run();

		disposable.dispose();
		assert.deepStrictEqual(actualStatuses, [SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle, SyncStatus.Syncing, SyncStatus.Idle]);
	});

	test('test sync conflicts status', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		let fileService = client.instantiationService.get(IFileService);
		let userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		fileService = testClient.instantiationService.get(IFileService);
		userDataProfilesService = testClient.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 16 })));
		const testObject = testClient.instantiationService.get(IUserDataSyncService);

		// sync from the client
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);
		assert.deepStrictEqual(testObject.conflicts.map(({ syncResource }) => syncResource), [SyncResource.Settings]);
	});

	test('test sync will sync other non conflicted areas', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const fileService = client.instantiationService.get(IFileService);
		let userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client and get conflicts in settings
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testFileService = testClient.instantiationService.get(IFileService);
		userDataProfilesService = testClient.instantiationService.get(IUserDataProfilesService);
		await testFileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 16 })));
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// sync from the first client with changes in keybindings
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// sync from the test client
		target.reset();
		const actualStatuses: SyncStatus[] = [];
		const disposable = testObject.onDidChangeStatus(status => actualStatuses.push(status));
		await (await testObject.createSyncTask(null)).run();

		disposable.dispose();
		assert.deepStrictEqual(actualStatuses, []);
		assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Keybindings
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: { 'If-None-Match': '1' } },
		]);
	});

	test('test stop sync reset status', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		let fileService = client.instantiationService.get(IFileService);
		let userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Setup the test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		fileService = testClient.instantiationService.get(IFileService);
		userDataProfilesService = testClient.instantiationService.get(IUserDataProfilesService);
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 16 })));
		const testObject = testClient.instantiationService.get(IUserDataSyncService);


		const syncTask = (await testObject.createSyncTask(null));
		syncTask.run().then(null, () => null /* ignore error */);
		await syncTask.stop();

		assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts, []);
	});

	test('test sync send execution id header', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);

		await (await testObject.createSyncTask(null)).run();

		for (const request of target.requestsWithAllHeaders) {
			const hasExecutionIdHeader = request.headers && request.headers['X-Execution-Id'] && request.headers['X-Execution-Id'].length > 0;
			assert.ok(hasExecutionIdHeader, `Should have execution header: ${request.url}`);
		}

	});

	test('test can run sync taks only once', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);

		const syncTask = await testObject.createSyncTask(null);
		await syncTask.run();

		try {
			await syncTask.run();
			assert.fail('Should fail running the task again');
		} catch (error) {
			/* expected */
		}
	});

	test('test sync when there are local profile that uses default profile', async () => {
		const target = new UserDataSyncTestServer();

		// Setup and sync from the client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();
		target.reset();

		// Do changes in the client
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await userDataProfilesService.createNamedProfile('1', { useDefaultFlags: { settings: true } });
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{}`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, '2.prompt.md'), VSBuffer.fromString('file contents'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));

		// Sync from the client
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'POST', url: `${target.url}/v1/resource/settings`, headers: { 'If-Match': '1' } },
			// Keybindings
			{ type: 'POST', url: `${target.url}/v1/resource/keybindings`, headers: { 'If-Match': '1' } },
			// Snippets
			{ type: 'POST', url: `${target.url}/v1/resource/snippets`, headers: { 'If-Match': '1' } },
			// Global state
			{ type: 'POST', url: `${target.url}/v1/resource/globalState`, headers: { 'If-Match': '1' } },
			// Prompts
			{ type: 'POST', url: `${target.url}/v1/resource/prompts`, headers: { 'If-Match': '1' } },
			// Profiles
			{ type: 'POST', url: `${target.url}/v1/collection`, headers: {} },
			{ type: 'POST', url: `${target.url}/v1/resource/profiles`, headers: { 'If-Match': '0' } },
		]);
	});

	test('test sync when there is a remote profile that uses default profile', async () => {
		const target = new UserDataSyncTestServer();

		// Sync from first client
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		const testClient = disposableStore.add(new UserDataSyncClient(target));
		await testClient.setUp();
		const testObject = testClient.instantiationService.get(IUserDataSyncService);
		await (await testObject.createSyncTask(null)).run();

		// Do changes in first client and sync
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		await userDataProfilesService.createNamedProfile('1', { useDefaultFlags: { keybindings: true } });
		await fileService.writeFile(userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(JSON.stringify({ 'editor.fontSize': 14 })));
		await fileService.writeFile(userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify([{ 'command': 'abcd', 'key': 'cmd+c' }])));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'html.json'), VSBuffer.fromString(`{ "a": "changed" }`));
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.promptsHome, 'best.prompt.md'), VSBuffer.fromString('prompt prompt'));
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'de' })));
		await (await client.instantiationService.get(IUserDataSyncService).createSyncTask(null)).run();

		// Sync from test client
		target.reset();
		await (await testObject.createSyncTask(null)).run();

		assert.deepStrictEqual(target.requests, [
			// Manifest
			{ type: 'GET', url: `${target.url}/v1/manifest`, headers: {} },
			// Settings
			{ type: 'GET', url: `${target.url}/v1/resource/settings/latest`, headers: { 'If-None-Match': '1' } },
			// Keybindings
			{ type: 'GET', url: `${target.url}/v1/resource/keybindings/latest`, headers: { 'If-None-Match': '1' } },
			// Snippets
			{ type: 'GET', url: `${target.url}/v1/resource/snippets/latest`, headers: { 'If-None-Match': '1' } },
			// Global state
			{ type: 'GET', url: `${target.url}/v1/resource/globalState/latest`, headers: { 'If-None-Match': '1' } },
			// Prompts
			{ type: 'GET', url: `${target.url}/v1/resource/prompts/latest`, headers: { 'If-None-Match': '1' } },
			// Profiles
			{ type: 'GET', url: `${target.url}/v1/resource/profiles/latest`, headers: { 'If-None-Match': '0' } },
		]);

	});
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 294
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 294 of 552)

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

---[FILE: src/vs/platform/userDataSync/test/common/mcpSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/mcpSync.test.ts

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
import { getMcpContentFromSyncContent, McpSynchroniser } from '../../common/mcpSync.js';
import { Change, IUserDataSyncStoreService, MergeState, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('McpSync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	let testObject: McpSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Mcp) as McpSynchroniser;
	});

	test('when mcp file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
			let manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, []);
			assert.ok(!await fileService.exists(mcpResource));

			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(lastSyncUserData!.syncData, null);

			manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);

			manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('when mcp file does not exist and remote has changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await client2.instantiationService.get(IFileService).writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file exists locally and remote has no mcp', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('first time sync: when mcp file exists locally with same content as remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await client2.instantiationService.get(IFileService).writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file locally has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('when mcp file remotely has moved forward', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely with same changes', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			const content = JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

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
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), previewContent);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), previewContent);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept modified preview', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					},
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			await testObject.accept(testObject.conflicts.conflicts[0].previewResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept remote', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			});
			fileService2.writeFile(mcpResource2, VSBuffer.fromString(content));
			await client2.sync();

			fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].remoteResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file has moved forward locally and remotely - accept local', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			await fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));

			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;

			await client2.sync();
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			fileService2.writeFile(mcpResource2, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {
					'server1': {
						'command': 'node',
						'args': ['./server1.js']
					}
				}
			})));
			await client2.sync();

			const content = JSON.stringify({
				'mcpServers': {
					'server2': {
						'command': 'node',
						'args': ['./server2.js']
					}
				}
			});
			fileService.writeFile(mcpResource, VSBuffer.fromString(content));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));
			assert.deepStrictEqual(testObject.status, SyncStatus.HasConflicts);

			await testObject.accept(testObject.conflicts.conflicts[0].localResource);
			await testObject.apply(false);
			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), content);
			assert.strictEqual((await fileService.readFile(mcpResource)).value.toString(), content);
		});
	});

	test('when mcp file was removed in one client', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify({
				'mcpServers': {}
			})));
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			await client2.sync();

			const mcpResource2 = client2.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			const fileService2 = client2.instantiationService.get(IFileService);
			fileService2.del(mcpResource2);
			await client2.sync();

			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			assert.deepStrictEqual(testObject.status, SyncStatus.Idle);
			const lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(getMcpContentFromSyncContent(remoteUserData.syncData!.content, client.instantiationService.get(ILogService)), null);
			assert.strictEqual(await fileService.exists(mcpResource), false);
		});
	});

	test('when mcp file is created after first sync', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			await testObject.sync(await client.getLatestRef(SyncResource.Mcp));

			const content = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			await fileService.createFile(mcpResource, VSBuffer.fromString(content));

			let lastSyncUserData = await testObject.getLastSyncUserData();
			const manifest = await client.getLatestRef(SyncResource.Mcp);
			server.reset();
			await testObject.sync(manifest);

			assert.deepStrictEqual(server.requests, [
				{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
			]);

			lastSyncUserData = await testObject.getLastSyncUserData();
			const remoteUserData = await testObject.getRemoteUserData(null);
			assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
			assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
			assert.strictEqual(getMcpContentFromSyncContent(lastSyncUserData!.syncData!.content, client.instantiationService.get(ILogService)), content);
		});
	});

	test('apply remote when mcp file does not exist', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const fileService = client.instantiationService.get(IFileService);
			const mcpResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.mcpResource;
			if (await fileService.exists(mcpResource)) {
				await fileService.del(mcpResource);
			}

			const preview = (await testObject.sync(await client.getLatestRef(SyncResource.Mcp), true))!;

			server.reset();
			const content = await testObject.resolveContent(preview.resourcePreviews[0].remoteResource);
			await testObject.accept(preview.resourcePreviews[0].remoteResource, content);
			await testObject.apply(false);
			assert.deepStrictEqual(server.requests, []);
		});
	});

	test('sync profile mcp', async () => {
		await runWithFakedTimers<void>({}, async () => {
			const client2 = disposableStore.add(new UserDataSyncClient(server));
			await client2.setUp(true);
			const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
			const expected = JSON.stringify({
				'mcpServers': {
					'test-server': {
						'command': 'node',
						'args': ['./server.js']
					}
				}
			});
			await client2.instantiationService.get(IFileService).createFile(profile.mcpResource, VSBuffer.fromString(expected));
			await client2.sync();

			await client.sync();

			const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
			const actual = (await client.instantiationService.get(IFileService).readFile(syncedProfile.mcpResource)).value.toString();
			assert.strictEqual(actual, expected);
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/promptsSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/promptsSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IFileService } from '../../../files/common/files.js';
import { assertDefined } from '../../../../base/common/types.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { PromptsSynchronizer } from '../../common/promptsSync/promptsSync.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { IResourcePreview, ISyncData, IUserDataSyncStoreService, PREVIEW_DIR_NAME, SyncResource, SyncStatus } from '../../common/userDataSync.js';

const PROMPT1_TEXT = 'Write a poem about a programmer who falls in love with their code.';
const PROMPT2_TEXT = 'Explain quantum physics using only emojis and cat memes.';
const PROMPT3_TEXT = 'Create a dialogue between a toaster and a refrigerator about their daily routines.';
const PROMPT4_TEXT = 'Describe a day in the life of a rubber duck debugging session.';
const PROMPT5_TEXT = 'Write a short story where a bug in the code becomes a superhero.';
const PROMPT6_TEXT = 'Imagine a world where all software bugs are sentient.\nWhat do they talk about?';

suite('PromptsSync', () => {
	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: PromptsSynchronizer;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);

		const maybeSynchronizer = testClient.getSynchronizer(SyncResource.Prompts) as (PromptsSynchronizer | undefined);

		assertDefined(
			maybeSynchronizer,
			'Prompts synchronizer object must be defined.',
		);

		testObject = maybeSynchronizer;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when prompts does not exist', async () => {
		const fileService = testClient.instantiationService.get(IFileService);
		const promptsResource = testClient.instantiationService.get(IUserDataProfilesService).defaultProfile.promptsHome;

		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await testClient.getLatestRef(SyncResource.Prompts);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);
		assert.ok(!(await fileService.exists(promptsResource)));

		const lastSyncUserData = await testObject.getLastSyncUserData();

		assertDefined(
			lastSyncUserData,
			'Last sync user data must be defined.',
		);

		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData.syncData, null);

		manifest = await testClient.getLatestRef(SyncResource.Prompts);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await testClient.getLatestRef(SyncResource.Prompts);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	});

	test('when prompt is created after first sync', async () => {
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, testClient);

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await testClient.getLatestRef(SyncResource.Prompts);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

		lastSyncUserData = await testObject.getLastSyncUserData();

		assertDefined(
			lastSyncUserData,
			'Last sync user data must be defined.',
		);

		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData.syncData, remoteUserData.syncData);

		assertDefined(
			lastSyncUserData.syncData,
			'Last sync user sync data must be defined.',
		);

		assert.deepStrictEqual(
			lastSyncUserData.syncData.content,
			JSON.stringify({ 'prompt3.prompt.md': PROMPT3_TEXT }),
		);
	});

	test('first time sync - outgoing to server (no prompts)', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, testClient);
		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, testClient);

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(
			actual,
			{
				'prompt3.prompt.md': PROMPT3_TEXT,
				'prompt1.prompt.md': PROMPT1_TEXT,
			});
	});

	test('first time sync - incoming from server (no prompts)', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);
		const actual2 = await readPrompt('prompt1.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT1_TEXT);
	});

	test('first time sync when prompts exists', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);
		const actual2 = await readPrompt('prompt1.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT1_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(
			actual,
			{
				'prompt3.prompt.md': PROMPT3_TEXT,
				'prompt1.prompt.md': PROMPT1_TEXT,
			});
	});

	test('first time sync when prompts exists - has conflicts', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);

		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(
			environmentService.userDataSyncHome,
			testObject.resource, PREVIEW_DIR_NAME,
			'prompt3.prompt.md',
		);

		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when prompts exists - has conflicts and accept conflicts', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, PROMPT3_TEXT);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'prompt3.prompt.md': PROMPT3_TEXT });
	});

	test('first time sync when prompts exists - has multiple conflicts', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('prompt1.prompt.md', PROMPT2_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local1 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'prompt3.prompt.md');
		const local2 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'prompt1.prompt.md');
		assertPreviews(testObject.conflicts.conflicts, [local1, local2]);
	});

	test('first time sync when prompts exists - has multiple conflicts and accept one conflict', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('prompt1.prompt.md', PROMPT2_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		let conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, PROMPT4_TEXT);

		conflicts = testObject.conflicts.conflicts;
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'prompt1.prompt.md');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when prompts exists - has multiple conflicts and accept all conflicts', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('prompt1.prompt.md', PROMPT2_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, PROMPT4_TEXT);
		await testObject.accept(conflicts[1].previewResource, PROMPT1_TEXT);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT4_TEXT);
		const actual2 = await readPrompt('prompt1.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT1_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'prompt3.prompt.md': PROMPT4_TEXT, 'prompt1.prompt.md': PROMPT1_TEXT });
	});

	test('sync adding a prompt', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);
		const actual2 = await readPrompt('prompt1.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT1_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'prompt3.prompt.md': PROMPT3_TEXT, 'prompt1.prompt.md': PROMPT1_TEXT });
	});

	test('sync adding a prompt - accept', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('prompt1.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);
		const actual2 = await readPrompt('prompt1.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT1_TEXT);
	});

	test('sync updating a prompt', async () => {
		await updatePrompt('default.prompt.md', PROMPT3_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('default.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('default.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT4_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'default.prompt.md': PROMPT4_TEXT });
	});

	test('sync updating a prompt - accept', async () => {
		await updatePrompt('my.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('my.prompt.md', PROMPT4_TEXT, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('my.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT4_TEXT);
	});

	test('sync updating a prompt - conflict', async () => {
		await updatePrompt('some.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('some.prompt.md', PROMPT4_TEXT, client2);
		await client2.sync();

		await updatePrompt('some.prompt.md', PROMPT5_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'some.prompt.md');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync updating a prompt - resolve conflict', async () => {
		await updatePrompt('advanced.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('advanced.prompt.md', PROMPT4_TEXT, client2);
		await client2.sync();

		await updatePrompt('advanced.prompt.md', PROMPT5_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, PROMPT4_TEXT);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('advanced.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT4_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'advanced.prompt.md': PROMPT4_TEXT });
	});

	test('sync removing a prompt', async () => {
		await updatePrompt('another.prompt.md', PROMPT3_TEXT, testClient);
		await updatePrompt('chat.prompt.md', PROMPT1_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await removePrompt('another.prompt.md', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('chat.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('another.prompt.md', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'chat.prompt.md': PROMPT1_TEXT });
	});

	test('sync removing a prompt - accept', async () => {
		await updatePrompt('my-query.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('summarize.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await removePrompt('my-query.prompt.md', client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('summarize.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('my-query.prompt.md', testClient);
		assert.strictEqual(actual2, null);
	});

	test('sync removing a prompt locally and updating it remotely', async () => {
		await updatePrompt('some.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('important.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await updatePrompt('some.prompt.md', PROMPT4_TEXT, client2);
		await client2.sync();

		await removePrompt('some.prompt.md', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('important.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('some.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT4_TEXT);
	});

	test('sync removing a prompt - conflict', async () => {
		await updatePrompt('common.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('rare.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await removePrompt('common.prompt.md', client2);
		await client2.sync();

		await updatePrompt('common.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'common.prompt.md');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync removing a prompt - resolve conflict', async () => {
		await updatePrompt('uncommon.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('hot.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await removePrompt('uncommon.prompt.md', client2);
		await client2.sync();

		await updatePrompt('uncommon.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, PROMPT5_TEXT);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('hot.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('uncommon.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT5_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'hot.prompt.md': PROMPT1_TEXT, 'uncommon.prompt.md': PROMPT5_TEXT });
	});

	test('sync removing a prompt - resolve conflict by removing', async () => {
		await updatePrompt('prompt3.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('refactor.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		await removePrompt('prompt3.prompt.md', client2);
		await client2.sync();

		await updatePrompt('prompt3.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, null);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('refactor.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('prompt3.prompt.md', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'refactor.prompt.md': PROMPT1_TEXT });
	});

	test('sync prompts', async () => {
		await updatePrompt('first.prompt.md', PROMPT6_TEXT, client2);
		await updatePrompt('roaming.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('roaming.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT3_TEXT);
		const actual2 = await readPrompt('first.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT6_TEXT);

		const { content } = await testClient.read(testObject.resource);
		assertDefined(
			content,
			'Test object content must be defined.',
		);

		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'roaming.prompt.md': PROMPT3_TEXT, 'first.prompt.md': PROMPT6_TEXT });
	});

	test('sync should ignore non prompts', async () => {
		await updatePrompt('my.prompt.md', PROMPT6_TEXT, client2);
		await updatePrompt('html.html', PROMPT3_TEXT, client2);
		await updatePrompt('shared.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readPrompt('shared.prompt.md', testClient);
		assert.strictEqual(actual1, PROMPT1_TEXT);
		const actual2 = await readPrompt('my.prompt.md', testClient);
		assert.strictEqual(actual2, PROMPT6_TEXT);
		const actual3 = await readPrompt('html.html', testClient);
		assert.strictEqual(actual3, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parsePrompts(content);
		assert.deepStrictEqual(actual, { 'shared.prompt.md': PROMPT1_TEXT, 'my.prompt.md': PROMPT6_TEXT });
	});

	test('previews are reset after all conflicts resolved', async () => {
		await updatePrompt('html.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('css.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('html.prompt.md', PROMPT4_TEXT, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, PROMPT4_TEXT);
		await testObject.apply(false);

		const fileService = testClient.instantiationService.get(IFileService);
		assert.ok(!await fileService.exists(dirname(conflicts[0].previewResource)));
	});

	test('merge when there are multiple prompts and all prompts are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updatePrompt('sublime.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('tests.prompt.md', PROMPT2_TEXT, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'sublime.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'tests.prompt.md'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple prompts and all prompts are merged and applied', async () => {
		await updatePrompt('short.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('long.prompt.md', PROMPT2_TEXT, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple prompts and one prompt has no changes and one prompt is merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updatePrompt('coding.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await updatePrompt('coding.prompt.md', PROMPT3_TEXT, testClient);
		await updatePrompt('exploring.prompt.md', PROMPT2_TEXT, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'exploring.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'coding.prompt.md'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple prompts and one prompt has no changes and prompts is merged and applied', async () => {
		await updatePrompt('quick.prompt.md', PROMPT3_TEXT, client2);
		await client2.sync();

		await updatePrompt('quick.prompt.md', PROMPT3_TEXT, testClient);
		await updatePrompt('databases.prompt.md', PROMPT2_TEXT, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple prompts with conflicts and all prompts are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updatePrompt('reverse.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('recycle.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('reverse.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('recycle.prompt.md', PROMPT2_TEXT, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'reverse.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'recycle.prompt.md'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'reverse.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'recycle.prompt.md'),
			]);
	});

	test('accept when there are multiple prompts with conflicts and only one prompt is accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updatePrompt('current.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('future.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('current.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('future.prompt.md', PROMPT2_TEXT, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'current.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'future.prompt.md'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'current.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'future.prompt.md'),
			]);

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, PROMPT4_TEXT);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'current.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'future.prompt.md'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'future.prompt.md'),
			]);
	});

	test('accept when there are multiple prompts with conflicts and all prompts are accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updatePrompt('dynamic.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('static.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('dynamic.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('static.prompt.md', PROMPT2_TEXT, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'dynamic.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'static.prompt.md'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'dynamic.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'static.prompt.md'),
			]);

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, PROMPT4_TEXT);
		preview = await testObject.accept(preview!.resourcePreviews[1].previewResource, PROMPT2_TEXT);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'dynamic.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'static.prompt.md'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('accept when there are multiple prompts with conflicts and all prompts are accepted and applied', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		await updatePrompt('edicational.prompt.md', PROMPT3_TEXT, client2);
		await updatePrompt('unknown.prompt.md', PROMPT1_TEXT, client2);
		await client2.sync();

		await updatePrompt('edicational.prompt.md', PROMPT4_TEXT, testClient);
		await updatePrompt('unknown.prompt.md', PROMPT2_TEXT, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Prompts), true);

		assertDefined(
			preview,
			'Preview must be defined.',
		);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'edicational.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'unknown.prompt.md'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'edicational.prompt.md'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'unknown.prompt.md'),
			]);

		preview = await testObject.accept(preview.resourcePreviews[0].previewResource, PROMPT4_TEXT);

		assertDefined(
			preview,
			'Preview must be defined after accept.',
		);

		preview = await testObject.accept(preview.resourcePreviews[1].previewResource, PROMPT2_TEXT);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);

		assert.strictEqual(
			preview,
			null,
			'Preview after the last apply must be `null`.',
		);

		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('sync profile prompts', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updatePrompt('my.prompt.md', PROMPT3_TEXT, client2, profile);
		await client2.sync();

		await testClient.sync();

		const syncedProfile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const content = await readPrompt('my.prompt.md', testClient, syncedProfile);
		assert.strictEqual(content, PROMPT3_TEXT);
	});

	function parsePrompts(content: string): IStringDictionary<string> {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	async function updatePrompt(
		name: string,
		content: string,
		client: UserDataSyncClient,
		profile?: IUserDataProfile,
	): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const promptsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).promptsHome, name);
		await fileService.writeFile(promptsResource, VSBuffer.fromString(content));
	}

	async function removePrompt(name: string, client: UserDataSyncClient): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const promptsResource = joinPath(userDataProfilesService.defaultProfile.promptsHome, name);
		await fileService.del(promptsResource);
	}

	async function readPrompt(name: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<string | null> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const promptsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).promptsHome, name);
		if (await fileService.exists(promptsResource)) {
			const content = await fileService.readFile(promptsResource);
			return content.value.toString();
		}
		return null;
	}

	function assertPreviews(actual: IResourcePreview[], expected: URI[]) {
		assert.deepStrictEqual(
			actual.map(({ previewResource }) => previewResource.toString()),
			expected.map(uri => uri.toString()),
		);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/settingsMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/settingsMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { addSetting, merge, updateIgnoredSettings } from '../../common/settingsMerge.js';
import type { IConflictSetting } from '../../common/userDataSync.js';

const formattingOptions = { eol: '\n', insertSpaces: false, tabSize: 4 };

suite('SettingsMerge - Merge', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge when local and remote are same with one entry', async () => {
		const localContent = stringify({ 'a': 1 });
		const remoteContent = stringify({ 'a': 1 });
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local and remote are same with multiple entries', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2
		});
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local and remote are same with multiple entries in different order', async () => {
		const localContent = stringify({
			'b': 2,
			'a': 1,
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2
		});
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, localContent);
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.conflictsSettings.length, 0);
	});

	test('merge when local and remote are same with different base content', async () => {
		const localContent = stringify({
			'b': 2,
			'a': 1,
		});
		const baseContent = stringify({
			'a': 2,
			'b': 1
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2
		});
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, localContent);
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(actual.hasConflicts);
	});

	test('merge when a new entry is added to remote', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2
		});
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when multiple new entries are added to remote', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when multiple new entries are added to remote from base and local has not changed', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({
			'b': 2,
			'a': 1,
			'c': 3,
		});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when an entry is removed from remote from base and local has not changed', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2,
		});
		const remoteContent = stringify({
			'a': 1,
		});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when all entries are removed from base and local has not changed', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when an entry is updated in remote from base and local has not changed', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({
			'a': 2
		});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when remote has moved forwareded with multiple changes and local stays with base', async () => {
		const localContent = stringify({
			'a': 1,
		});
		const remoteContent = stringify({
			'a': 2,
			'b': 1,
			'c': 3,
			'd': 4,
		});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when remote has moved forwareded with order changes and local stays with base', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		const remoteContent = stringify({
			'a': 2,
			'd': 4,
			'c': 3,
			'b': 2,
		});
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when remote has moved forwareded with comment changes and local stays with base', async () => {
		const localContent = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1,
}`;
		const remoteContent = stringify`
{
	// comment b has changed
	"b": 2,
	// this is comment for c
	"c": 1,
}`;
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when remote has moved forwareded with comment and order changes and local stays with base', async () => {
		const localContent = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1,
}`;
		const remoteContent = stringify`
{
	// this is comment for c
	"c": 1,
	// comment b has changed
	"b": 2,
}`;
		const actual = merge(localContent, remoteContent, localContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when a new entries are added to local', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
			'd': 4,
		});
		const remoteContent = stringify({
			'a': 1,
		});
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when multiple new entries are added to local from base and remote is not changed', async () => {
		const localContent = stringify({
			'a': 2,
			'b': 1,
			'c': 3,
			'd': 4,
		});
		const remoteContent = stringify({
			'a': 1,
		});
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when an entry is removed from local from base and remote has not changed', async () => {
		const localContent = stringify({
			'a': 1,
			'c': 2
		});
		const remoteContent = stringify({
			'a': 2,
			'b': 1,
			'c': 3,
			'd': 4,
		});
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when an entry is updated in local from base and remote has not changed', async () => {
		const localContent = stringify({
			'a': 1,
			'c': 2
		});
		const remoteContent = stringify({
			'a': 2,
			'c': 2,
		});
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local has moved forwarded with multiple changes and remote stays with base', async () => {
		const localContent = stringify({
			'a': 2,
			'b': 1,
			'c': 3,
			'd': 4,
		});
		const remoteContent = stringify({
			'a': 1,
		});
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local has moved forwarded with order changes and remote stays with base', async () => {
		const localContent = `
{
	"b": 2,
	"c": 1,
}`;
		const remoteContent = stringify`
{
	"c": 1,
	"b": 2,
}`;
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local has moved forwarded with comment changes and remote stays with base', async () => {
		const localContent = `
{
	// comment for b has changed
	"b": 2,
	// comment for c
	"c": 1,
}`;
		const remoteContent = stringify`
{
	// comment for b
	"b": 2,
	// comment for c
	"c": 1,
}`;
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local has moved forwarded with comment and order changes and remote stays with base', async () => {
		const localContent = `
{
	// comment for c
	"c": 1,
	// comment for b has changed
	"b": 2,
}`;
		const remoteContent = stringify`
{
	// comment for b
	"b": 2,
	// comment for c
	"c": 1,
}`;
		const actual = merge(localContent, remoteContent, remoteContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, localContent);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('merge when local and remote with one entry but different value', async () => {
		const localContent = stringify({
			'a': 1
		});
		const remoteContent = stringify({
			'a': 2
		});
		const expectedConflicts: IConflictSetting[] = [{ key: 'a', localValue: 1, remoteValue: 2 }];
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, localContent);
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
	});

	test('merge when the entry is removed in remote but updated in local and a new entry is added in remote', async () => {
		const baseContent = stringify({
			'a': 1
		});
		const localContent = stringify({
			'a': 2
		});
		const remoteContent = stringify({
			'b': 2
		});
		const expectedConflicts: IConflictSetting[] = [{ key: 'a', localValue: 2, remoteValue: undefined }];
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 2,
			'b': 2
		}));
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
	});

	test('merge with single entry and local is empty', async () => {
		const baseContent = stringify({
			'a': 1
		});
		const localContent = stringify({});
		const remoteContent = stringify({
			'a': 2
		});
		const expectedConflicts: IConflictSetting[] = [{ key: 'a', localValue: undefined, remoteValue: 2 }];
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, localContent);
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
	});

	test('merge when local and remote has moved forwareded with conflicts', async () => {
		const baseContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
			'd': 4,
		});
		const localContent = stringify({
			'a': 2,
			'c': 3,
			'd': 5,
			'e': 4,
			'f': 1,
		});
		const remoteContent = stringify({
			'b': 3,
			'c': 3,
			'd': 6,
			'e': 5,
		});
		const expectedConflicts: IConflictSetting[] = [
			{ key: 'b', localValue: undefined, remoteValue: 3 },
			{ key: 'a', localValue: 2, remoteValue: undefined },
			{ key: 'd', localValue: 5, remoteValue: 6 },
			{ key: 'e', localValue: 4, remoteValue: 5 },
		];
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 2,
			'c': 3,
			'd': 5,
			'e': 4,
			'f': 1,
		}));
		assert.strictEqual(actual.remoteContent, stringify({
			'b': 3,
			'c': 3,
			'd': 6,
			'e': 5,
			'f': 1,
		}));
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
	});

	test('merge when local and remote has moved forwareded with change in order', async () => {
		const baseContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
			'd': 4,
		});
		const localContent = stringify({
			'a': 2,
			'c': 3,
			'b': 2,
			'd': 4,
			'e': 5,
		});
		const remoteContent = stringify({
			'a': 1,
			'b': 2,
			'c': 4,
		});
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 2,
			'c': 4,
			'b': 2,
			'e': 5,
		}));
		assert.strictEqual(actual.remoteContent, stringify({
			'a': 2,
			'b': 2,
			'e': 5,
			'c': 4,
		}));
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, []);
	});

	test('merge when local and remote has moved forwareded with comment changes', async () => {
		const baseContent = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1
}`;
		const localContent = `
{
	// comment b has changed in local
	"b": 2,
	// this is comment for c
	"c": 1
}`;
		const remoteContent = `
{
	// comment b has changed in remote
	"b": 2,
	// this is comment for c
	"c": 1
}`;
		const actual = merge(localContent, remoteContent, baseContent, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, localContent);
		assert.strictEqual(actual.remoteContent, remoteContent);
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, []);
	});

	test('resolve when local and remote has moved forwareded with resolved conflicts', async () => {
		const baseContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
			'd': 4,
		});
		const localContent = stringify({
			'a': 2,
			'c': 3,
			'd': 5,
			'e': 4,
			'f': 1,
		});
		const remoteContent = stringify({
			'b': 3,
			'c': 3,
			'd': 6,
			'e': 5,
		});
		const expectedConflicts: IConflictSetting[] = [
			{ key: 'd', localValue: 5, remoteValue: 6 },
		];
		const actual = merge(localContent, remoteContent, baseContent, [], [{ key: 'a', value: 2 }, { key: 'b', value: undefined }, { key: 'e', value: 5 }], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 2,
			'c': 3,
			'd': 5,
			'e': 5,
			'f': 1,
		}));
		assert.strictEqual(actual.remoteContent, stringify({
			'c': 3,
			'd': 6,
			'e': 5,
			'f': 1,
			'a': 2,
		}));
		assert.ok(actual.hasConflicts);
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
	});

	test('ignored setting is not merged when changed in local and remote', async () => {
		const localContent = stringify({ 'a': 1 });
		const remoteContent = stringify({ 'a': 2 });
		const actual = merge(localContent, remoteContent, null, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged when changed in local and remote from base', async () => {
		const baseContent = stringify({ 'a': 0 });
		const localContent = stringify({ 'a': 1 });
		const remoteContent = stringify({ 'a': 2 });
		const actual = merge(localContent, remoteContent, baseContent, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged when added in remote', async () => {
		const localContent = stringify({});
		const remoteContent = stringify({ 'a': 1 });
		const actual = merge(localContent, remoteContent, null, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged when added in remote from base', async () => {
		const localContent = stringify({ 'b': 2 });
		const remoteContent = stringify({ 'a': 1, 'b': 2 });
		const actual = merge(localContent, remoteContent, localContent, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged when removed in remote', async () => {
		const localContent = stringify({ 'a': 1 });
		const remoteContent = stringify({});
		const actual = merge(localContent, remoteContent, null, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged when removed in remote from base', async () => {
		const localContent = stringify({ 'a': 2 });
		const remoteContent = stringify({});
		const actual = merge(localContent, remoteContent, localContent, ['a'], [], formattingOptions);
		assert.strictEqual(actual.localContent, null);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged with other changes without conflicts', async () => {
		const baseContent = stringify({
			'a': 2,
			'b': 2,
			'c': 3,
			'd': 4,
			'e': 5,
		});
		const localContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		const remoteContent = stringify({
			'a': 3,
			'b': 3,
			'd': 4,
			'e': 6,
		});
		const actual = merge(localContent, remoteContent, baseContent, ['a', 'e'], [], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 1,
			'b': 3,
		}));
		assert.strictEqual(actual.remoteContent, stringify({
			'a': 3,
			'b': 3,
			'e': 6,
		}));
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});

	test('ignored setting is not merged with other changes conflicts', async () => {
		const baseContent = stringify({
			'a': 2,
			'b': 2,
			'c': 3,
			'd': 4,
			'e': 5,
		});
		const localContent = stringify({
			'a': 1,
			'b': 4,
			'c': 3,
			'd': 5,
		});
		const remoteContent = stringify({
			'a': 3,
			'b': 3,
			'e': 6,
		});
		const expectedConflicts: IConflictSetting[] = [
			{ key: 'd', localValue: 5, remoteValue: undefined },
			{ key: 'b', localValue: 4, remoteValue: 3 },
		];
		const actual = merge(localContent, remoteContent, baseContent, ['a', 'e'], [], formattingOptions);
		assert.strictEqual(actual.localContent, stringify({
			'a': 1,
			'b': 4,
			'd': 5,
		}));
		assert.strictEqual(actual.remoteContent, stringify({
			'a': 3,
			'b': 3,
			'e': 6,
		}));
		assert.deepStrictEqual(actual.conflictsSettings, expectedConflicts);
		assert.ok(actual.hasConflicts);
	});

	test('merge when remote has comments and local is empty', async () => {
		const localContent = `
{

}`;
		const remoteContent = stringify`
{
	// this is a comment
	"a": 1,
}`;
		const actual = merge(localContent, remoteContent, null, [], [], formattingOptions);
		assert.strictEqual(actual.localContent, remoteContent);
		assert.strictEqual(actual.remoteContent, null);
		assert.strictEqual(actual.conflictsSettings.length, 0);
		assert.ok(!actual.hasConflicts);
	});
});

suite('SettingsMerge - Compute Remote Content', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('local content is returned when there are no ignored settings', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		const remoteContent = stringify({
			'a': 3,
			'b': 3,
			'd': 4,
			'e': 6,
		});
		const actual = updateIgnoredSettings(localContent, remoteContent, [], formattingOptions);
		assert.strictEqual(actual, localContent);
	});

	test('when target content is empty', async () => {
		const remoteContent = stringify({
			'a': 3,
		});
		const actual = updateIgnoredSettings('', remoteContent, ['a'], formattingOptions);
		assert.strictEqual(actual, '');
	});

	test('when source content is empty', async () => {
		const localContent = stringify({
			'a': 3,
			'b': 3,
		});
		const expected = stringify({
			'b': 3,
		});
		const actual = updateIgnoredSettings(localContent, '', ['a'], formattingOptions);
		assert.strictEqual(actual, expected);
	});

	test('ignored settings are not updated from remote content', async () => {
		const localContent = stringify({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		const remoteContent = stringify({
			'a': 3,
			'b': 3,
			'd': 4,
			'e': 6,
		});
		const expected = stringify({
			'a': 3,
			'b': 2,
			'c': 3,
		});
		const actual = updateIgnoredSettings(localContent, remoteContent, ['a'], formattingOptions);
		assert.strictEqual(actual, expected);
	});

});

suite('SettingsMerge - Add Setting', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Insert after a setting without comments', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 2,
	"d": 3
}`;

		const expected = `
{
	"a": 2,
	"b": 2,
	"d": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting without comments at the end', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 2
}`;

		const expected = `
{
	"a": 2,
	"b": 2
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert between settings without comment', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert between settings and there is a comment in between in source', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting and after a comment at the end', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2
}`;
		const targetContent = `
{
	"a": 1
	// this is comment for b
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting ending with comma and after a comment at the end', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2
}`;
		const targetContent = `
{
	"a": 1,
	// this is comment for b
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a comment and there are no settings', () => {

		const sourceContent = `
{
	// this is comment for b
	"b": 2
}`;
		const targetContent = `
{
	// this is comment for b
}`;

		const expected = `
{
	// this is comment for b
	"b": 2
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting and between a comment and setting', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	// this is comment for b
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting between two comments and there is a setting after', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	// this is comment for b
	// this is comment for c
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting between two comments on the same line and there is a setting after', () => {

		const sourceContent = `
{
	"a": 1,
	/* this is comment for b */
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	/* this is comment for b */ // this is comment for c
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	/* this is comment for b */
	"b": 2, // this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting between two line comments on the same line and there is a setting after', () => {

		const sourceContent = `
{
	"a": 1,
	/* this is comment for b */
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"a": 1,
	// this is comment for b // this is comment for c
	"c": 3
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b // this is comment for c
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting between two comments and there is no setting after', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2
	// this is a comment
}`;
		const targetContent = `
{
	"a": 1
	// this is comment for b
	// this is a comment
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2
	// this is a comment
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting with comma and between two comments and there is no setting after', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2
	// this is a comment
}`;
		const targetContent = `
{
	"a": 1,
	// this is comment for b
	// this is a comment
}`;

		const expected = `
{
	"a": 1,
	// this is comment for b
	"b": 2
	// this is a comment
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});
	test('Insert before a setting without comments', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"d": 2,
	"c": 3
}`;

		const expected = `
{
	"d": 2,
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting without comments at the end', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"c": 3
}`;

		const expected = `
{
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting with comment', () => {

		const sourceContent = `
{
	"a": 1,
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	// this is comment for c
	"c": 3
}`;

		const expected = `
{
	"b": 2,
	// this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting and before a comment at the beginning', () => {

		const sourceContent = `
{
	// this is comment for b
	"b": 2,
	"c": 3,
}`;
		const targetContent = `
{
	// this is comment for b
	"c": 3
}`;

		const expected = `
{
	// this is comment for b
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting ending with comma and before a comment at the begninning', () => {

		const sourceContent = `
{
	// this is comment for b
	"b": 2,
	"c": 3,
}`;
		const targetContent = `
{
	// this is comment for b
	"c": 3,
}`;

		const expected = `
{
	// this is comment for b
	"b": 2,
	"c": 3,
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting and between a setting and comment', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"d": 1,
	// this is comment for b
	"c": 3
}`;

		const expected = `
{
	"d": 1,
	// this is comment for b
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting between two comments and there is a setting before', () => {

		const sourceContent = `
{
	"a": 1,
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"d": 1,
	// this is comment for b
	// this is comment for c
	"c": 3
}`;

		const expected = `
{
	"d": 1,
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting between two comments on the same line and there is a setting before', () => {

		const sourceContent = `
{
	"a": 1,
	/* this is comment for b */
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"d": 1,
	/* this is comment for b */ // this is comment for c
	"c": 3
}`;

		const expected = `
{
	"d": 1,
	/* this is comment for b */
	"b": 2,
	// this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting between two line comments on the same line and there is a setting before', () => {

		const sourceContent = `
{
	"a": 1,
	/* this is comment for b */
	"b": 2,
	// this is comment for c
	"c": 3
}`;
		const targetContent = `
{
	"d": 1,
	// this is comment for b // this is comment for c
	"c": 3
}`;

		const expected = `
{
	"d": 1,
	"b": 2,
	// this is comment for b // this is comment for c
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting between two comments and there is no setting before', () => {

		const sourceContent = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1
}`;
		const targetContent = `
{
	// this is comment for b
	// this is comment for c
	"c": 1
}`;

		const expected = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert before a setting with comma and between two comments and there is no setting before', () => {

		const sourceContent = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1
}`;
		const targetContent = `
{
	// this is comment for b
	// this is comment for c
	"c": 1,
}`;

		const expected = `
{
	// this is comment for b
	"b": 2,
	// this is comment for c
	"c": 1,
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a setting that is of object type', () => {

		const sourceContent = `
{
	"b": {
		"d": 1
	},
	"a": 2,
	"c": 1
}`;
		const targetContent = `
{
	"b": {
		"d": 1
	},
	"c": 1
}`;

		const actual = addSetting('a', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, sourceContent);
	});

	test('Insert after a setting that is of array type', () => {

		const sourceContent = `
{
	"b": [
		1
	],
	"a": 2,
	"c": 1
}`;
		const targetContent = `
{
	"b": [
		1
	],
	"c": 1
}`;

		const actual = addSetting('a', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, sourceContent);
	});

	test('Insert after a comment with comma separator of previous setting and no next nodes ', () => {

		const sourceContent = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2
}`;
		const targetContent = `
{
	"a": 1
	// this is comment for a
	,
}`;

		const expected = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a comment with comma separator of previous setting and there is a setting after ', () => {

		const sourceContent = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2,
	"c": 3
}`;
		const targetContent = `
{
	"a": 1
	// this is comment for a
	,
	"c": 3
}`;

		const expected = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2,
	"c": 3
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});

	test('Insert after a comment with comma separator of previous setting and there is a comment after ', () => {

		const sourceContent = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2
	// this is a comment
}`;
		const targetContent = `
{
	"a": 1
	// this is comment for a
	,
	// this is a comment
}`;

		const expected = `
{
	"a": 1
	// this is comment for a
	,
	"b": 2
	// this is a comment
}`;

		const actual = addSetting('b', sourceContent, targetContent, formattingOptions);

		assert.strictEqual(actual, expected);
	});
});


function stringify(value: any): string {
	return JSON.stringify(value, null, '\t');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/settingsSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/settingsSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Event } from '../../../../base/common/event.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../configuration/common/configurationRegistry.js';
import { IFileService } from '../../../files/common/files.js';
import { Registry } from '../../../registry/common/platform.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { ISettingsSyncContent, parseSettingsSyncContent, SettingsSynchroniser } from '../../common/settingsSync.js';
import { ISyncData, IUserDataSyncStoreService, SyncResource, SyncStatus, UserDataSyncError, UserDataSyncErrorCode } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('SettingsSync - Auto', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;
	let testObject: SettingsSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
			'id': 'settingsSync',
			'type': 'object',
			'properties': {
				'settingsSync.machine': {
					'type': 'string',
					'scope': ConfigurationScope.MACHINE
				},
				'settingsSync.machineOverridable': {
					'type': 'string',
					'scope': ConfigurationScope.MACHINE_OVERRIDABLE
				}
			}
		});
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Settings) as SettingsSynchroniser;
	});

	test('when settings file does not exist', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const fileService = client.instantiationService.get(IFileService);
		const settingResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.settingsResource;

		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await client.getLatestRef(SyncResource.Settings);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);
		assert.ok(!await fileService.exists(settingResource));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await client.getLatestRef(SyncResource.Settings);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await client.getLatestRef(SyncResource.Settings);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	}));

	test('when settings file is empty and remote has no changes', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const fileService = client.instantiationService.get(IFileService);
		const settingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.settingsResource;
		await fileService.writeFile(settingsResource, VSBuffer.fromString(''));

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(parseSettingsSyncContent(lastSyncUserData!.syncData!.content)?.settings, '{}');
		assert.strictEqual(parseSettingsSyncContent(remoteUserData.syncData!.content)?.settings, '{}');
		assert.strictEqual((await fileService.readFile(settingsResource)).value.toString(), '');
	}));

	test('when settings file is empty and remote has changes', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const content =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",
	"workbench.tree.indent": 20,
	"workbench.colorCustomizations": {
		"editorLineNumber.activeForeground": "#ff0000",
		"[GitHub Sharp]": {
			"statusBarItem.remoteBackground": "#24292E",
			"editorPane.background": "#f3f1f11a"
		}
	},

	"gitBranch.base": "remote-repo/master",

	// Experimental
	"workbench.view.experimental.allowMovingToNewContainer": true,
}`;
		await client2.instantiationService.get(IFileService).writeFile(client2.instantiationService.get(IUserDataProfilesService).defaultProfile.settingsResource, VSBuffer.fromString(content));
		await client2.sync();

		const fileService = client.instantiationService.get(IFileService);
		const settingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.settingsResource;
		await fileService.writeFile(settingsResource, VSBuffer.fromString(''));

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(parseSettingsSyncContent(lastSyncUserData!.syncData!.content)?.settings, content);
		assert.strictEqual(parseSettingsSyncContent(remoteUserData.syncData!.content)?.settings, content);
		assert.strictEqual((await fileService.readFile(settingsResource)).value.toString(), content);
	}));

	test('when settings file is created after first sync', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const fileService = client.instantiationService.get(IFileService);

		const settingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.settingsResource;
		await testObject.sync(await client.getLatestRef(SyncResource.Settings));
		await fileService.createFile(settingsResource, VSBuffer.fromString('{}'));

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await client.getLatestRef(SyncResource.Settings);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(parseSettingsSyncContent(lastSyncUserData!.syncData!.content)?.settings, '{}');
	}));

	test('sync for first time to the server', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const expected =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",
	"workbench.tree.indent": 20,
	"workbench.colorCustomizations": {
		"editorLineNumber.activeForeground": "#ff0000",
		"[GitHub Sharp]": {
			"statusBarItem.remoteBackground": "#24292E",
			"editorPane.background": "#f3f1f11a"
		}
	},

	"gitBranch.base": "remote-repo/master",

	// Experimental
	"workbench.view.experimental.allowMovingToNewContainer": true,
}`;

		await updateSettings(expected, client);
		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, expected);
	}));

	test('do not sync machine settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Machine
	"settingsSync.machine": "someValue",
	"settingsSync.machineOverridable": "someValue"
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp"
}`);
	}));

	test('do not sync machine settings when spread across file', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"settingsSync.machine": "someValue",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Machine
	"settingsSync.machineOverridable": "someValue"
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp"
}`);
	}));

	test('do not sync machine settings when spread across file - 2', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"settingsSync.machine": "someValue",

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Machine
	"settingsSync.machineOverridable": "someValue",
	"files.simpleDialog.enable": true,
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",
	"files.simpleDialog.enable": true,
}`);
	}));

	test('sync when all settings are machine settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Machine
	"settingsSync.machine": "someValue",
	"settingsSync.machineOverridable": "someValue"
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
}`);
	}));

	test('sync when all settings are machine settings with trailing comma', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Machine
	"settingsSync.machine": "someValue",
	"settingsSync.machineOverridable": "someValue",
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	,
}`);
	}));

	test('local change event is triggered when settings are changed', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const content =
			`{
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,
}`;

		await updateSettings(content, client);
		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const promise = Event.toPromise(testObject.onDidChangeLocal);
		await updateSettings(`{
	"files.autoSave": "off",
	"files.simpleDialog.enable": true,
}`, client);
		await promise;
	}));

	test('do not sync ignored settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Editor
	"editor.fontFamily": "Fira Code",

	// Terminal
	"terminal.integrated.shell.osx": "some path",

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	]
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	]
}`);
	}));

	test('do not sync ignored and machine settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Editor
	"editor.fontFamily": "Fira Code",

	// Terminal
	"terminal.integrated.shell.osx": "some path",

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	],

	// Machine
	"settingsSync.machine": "someValue",
}`;
		await updateSettings(settingsContent, client);

		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	],
}`);
	}));

	test('sync throws invalid content error', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const expected =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",
	"workbench.tree.indent": 20,
	"workbench.colorCustomizations": {
		"editorLineNumber.activeForeground": "#ff0000",
		"[GitHub Sharp]": {
			"statusBarItem.remoteBackground": "#24292E",
			"editorPane.background": "#f3f1f11a"
		}
	}

	"gitBranch.base": "remote-repo/master",

	// Experimental
	"workbench.view.experimental.allowMovingToNewContainer": true,
}`;

		await updateSettings(expected, client);

		try {
			await testObject.sync(await client.getLatestRef(SyncResource.Settings));
			assert.fail('should fail with invalid content error');
		} catch (e) {
			assert.ok(e instanceof UserDataSyncError);
			assert.deepStrictEqual((<UserDataSyncError>e).code, UserDataSyncErrorCode.LocalInvalidContent);
		}
	}));

	test('sync throws invalid content error - content is an array', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await updateSettings('[]', client);
		try {
			await testObject.sync(await client.getLatestRef(SyncResource.Settings));
			assert.fail('should fail with invalid content error');
		} catch (e) {
			assert.ok(e instanceof UserDataSyncError);
			assert.deepStrictEqual((<UserDataSyncError>e).code, UserDataSyncErrorCode.LocalInvalidContent);
		}
	}));

	test('sync when there are conflicts', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		await updateSettings(JSON.stringify({
			'a': 1,
			'b': 2,
			'settingsSync.ignoredSettings': ['a']
		}), client2);
		await client2.sync();

		await updateSettings(JSON.stringify({
			'a': 2,
			'b': 1,
			'settingsSync.ignoredSettings': ['a']
		}), client);
		await testObject.sync(await client.getLatestRef(SyncResource.Settings));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assert.strictEqual(testObject.conflicts.conflicts[0].localResource.toString(), testObject.localResource.toString());

		const fileService = client.instantiationService.get(IFileService);
		const mergeContent = (await fileService.readFile(testObject.conflicts.conflicts[0].previewResource)).value.toString();
		assert.strictEqual(mergeContent, '');
	}));

	test('sync profile settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updateSettings(JSON.stringify({
			'a': 1,
			'b': 2,
		}), client2, profile);
		await client2.sync();

		await client.sync();

		assert.strictEqual(testObject.status, SyncStatus.Idle);

		const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const content = (await client.instantiationService.get(IFileService).readFile(syncedProfile.settingsResource)).value.toString();
		assert.deepStrictEqual(JSON.parse(content), {
			'a': 1,
			'b': 2,
		});
	}));

});

suite('SettingsSync - Manual', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;
	let testObject: SettingsSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Settings) as SettingsSynchroniser;
	});

	test('do not sync ignored settings', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const settingsContent =
			`{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Editor
	"editor.fontFamily": "Fira Code",

	// Terminal
	"terminal.integrated.shell.osx": "some path",

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	]
}`;
		await updateSettings(settingsContent, client);

		let preview = await testObject.sync(await client.getLatestRef(SyncResource.Settings), true);
		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource);
		preview = await testObject.apply(false);

		const { content } = await client.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSettings(content);
		assert.deepStrictEqual(actual, `{
	// Always
	"files.autoSave": "afterDelay",
	"files.simpleDialog.enable": true,

	// Workbench
	"workbench.colorTheme": "GitHub Sharp",

	// Ignored
	"settingsSync.ignoredSettings": [
		"editor.fontFamily",
		"terminal.integrated.shell.osx"
	]
}`);
	}));

});

function parseSettings(content: string): string {
	const syncData: ISyncData = JSON.parse(content);
	const settingsSyncContent: ISettingsSyncContent = JSON.parse(syncData.content);
	return settingsSyncContent.settings;
}

async function updateSettings(content: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<void> {
	await client.instantiationService.get(IFileService).writeFile((profile ?? client.instantiationService.get(IUserDataProfilesService).defaultProfile).settingsResource, VSBuffer.fromString(content));
	await client.instantiationService.get(IConfigurationService).reloadConfiguration();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/snippetsMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/snippetsMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { merge } from '../../common/snippetsMerge.js';

const tsSnippet1 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console",
	}

}`;

const tsSnippet2 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console always",
	}

}`;

const htmlSnippet1 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div"
	}
}`;

const htmlSnippet2 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div changed"
	}
}`;

const cSnippet = `{
	// Place your snippets for c here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position.Placeholders with the
	// same ids are connected.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
}`;

suite('SnippetsMerge', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge when local and remote are same with one snippet', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local and remote are same with multiple entries', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local and remote are same with multiple entries in different order', async () => {
		const local = { 'typescript.json': tsSnippet1, 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local and remote are same with different base content', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const base = { 'html.json': htmlSnippet2, 'typescript.json': tsSnippet2 };

		const actual = merge(local, remote, base);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when a new entry is added to remote', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, { 'typescript.json': tsSnippet1 });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when multiple new entries are added to remote', async () => {
		const local = {};
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, remote);
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when new entry is added to remote from base and local has not changed', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, local);

		assert.deepStrictEqual(actual.local.added, { 'typescript.json': tsSnippet1 });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when an entry is removed from remote from base and local has not changed', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const remote = { 'html.json': htmlSnippet1 };

		const actual = merge(local, remote, local);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, ['typescript.json']);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when all entries are removed from base and local has not changed', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const remote = {};

		const actual = merge(local, remote, local);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, ['html.json', 'typescript.json']);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when an entry is updated in remote from base and local has not changed', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet2 };

		const actual = merge(local, remote, local);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, { 'html.json': htmlSnippet2 });
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when remote has moved forwarded with multiple changes and local stays with base', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const remote = { 'html.json': htmlSnippet2, 'c.json': cSnippet };

		const actual = merge(local, remote, local);

		assert.deepStrictEqual(actual.local.added, { 'c.json': cSnippet });
		assert.deepStrictEqual(actual.local.updated, { 'html.json': htmlSnippet2 });
		assert.deepStrictEqual(actual.local.removed, ['typescript.json']);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when a new entries are added to local', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1, 'c.json': cSnippet };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, { 'c.json': cSnippet });
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when multiple new entries are added to local from base and remote is not changed', async () => {
		const local = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1, 'c.json': cSnippet };
		const remote = { 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, remote);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, { 'html.json': htmlSnippet1, 'c.json': cSnippet });
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when an entry is removed from local from base and remote has not changed', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, remote);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, ['typescript.json']);
	});

	test('merge when an entry is updated in local from base and remote has not changed', async () => {
		const local = { 'html.json': htmlSnippet2, 'typescript.json': tsSnippet1 };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, remote);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, { 'html.json': htmlSnippet2 });
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local has moved forwarded with multiple changes and remote stays with base', async () => {
		const local = { 'html.json': htmlSnippet2, 'c.json': cSnippet };
		const remote = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, remote);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, { 'c.json': cSnippet });
		assert.deepStrictEqual(actual.remote.updated, { 'html.json': htmlSnippet2 });
		assert.deepStrictEqual(actual.remote.removed, ['typescript.json']);
	});

	test('merge when local and remote with one entry but different value', async () => {
		const local = { 'html.json': htmlSnippet1 };
		const remote = { 'html.json': htmlSnippet2 };

		const actual = merge(local, remote, null);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, ['html.json']);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when the entry is removed in remote but updated in local and a new entry is added in remote', async () => {
		const base = { 'html.json': htmlSnippet1 };
		const local = { 'html.json': htmlSnippet2 };
		const remote = { 'typescript.json': tsSnippet1 };

		const actual = merge(local, remote, base);

		assert.deepStrictEqual(actual.local.added, { 'typescript.json': tsSnippet1 });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, ['html.json']);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge with single entry and local is empty', async () => {
		const base = { 'html.json': htmlSnippet1 };
		const local = {};
		const remote = { 'html.json': htmlSnippet2 };

		const actual = merge(local, remote, base);

		assert.deepStrictEqual(actual.local.added, { 'html.json': htmlSnippet2 });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, []);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local and remote has moved forwareded with conflicts', async () => {
		const base = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const local = { 'html.json': htmlSnippet2, 'c.json': cSnippet };
		const remote = { 'typescript.json': tsSnippet2 };

		const actual = merge(local, remote, base);

		assert.deepStrictEqual(actual.local.added, { 'typescript.json': tsSnippet2 });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, ['html.json']);
		assert.deepStrictEqual(actual.remote.added, { 'c.json': cSnippet });
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

	test('merge when local and remote has moved forwareded with multiple conflicts', async () => {
		const base = { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 };
		const local = { 'html.json': htmlSnippet2, 'typescript.json': tsSnippet2, 'c.json': cSnippet };
		const remote = { 'c.json': cSnippet };

		const actual = merge(local, remote, base);

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.conflicts, ['html.json', 'typescript.json']);
		assert.deepStrictEqual(actual.remote.added, {});
		assert.deepStrictEqual(actual.remote.updated, {});
		assert.deepStrictEqual(actual.remote.removed, []);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/snippetsSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/snippetsSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { SnippetsSynchroniser } from '../../common/snippetsSync.js';
import { IResourcePreview, ISyncData, IUserDataSyncStoreService, PREVIEW_DIR_NAME, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

const tsSnippet1 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console",
	}

}`;

const tsSnippet2 = `{

	// Place your snippets for TypeScript here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, Placeholders with the
	// same ids are connected.
	"Print to console": {
	// Example:
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console always",
	}

}`;

const htmlSnippet1 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div"
	}
}`;

const htmlSnippet2 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div changed"
	}
}`;

const htmlSnippet3 = `{
/*
	// Place your snippets for HTML here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted.
	// Example:
	"Print to console": {
	"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
			"description": "Log output to console"
	}
*/
"Div": {
	"prefix": "div",
		"body": [
			"<div>",
			"",
			"</div>"
		],
			"description": "New div changed again"
	}
}`;

const globalSnippet = `{
	// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and {1: label}, { 2: another } for placeholders.
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
}`;

suite('SnippetsSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: SnippetsSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.Snippets) as SnippetsSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when snippets does not exist', async () => {
		const fileService = testClient.instantiationService.get(IFileService);
		const snippetsResource = testClient.instantiationService.get(IUserDataProfilesService).defaultProfile.snippetsHome;

		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);
		assert.ok(!await fileService.exists(snippetsResource));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	});

	test('when snippet is created after first sync', async () => {
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await updateSnippet('html.json', htmlSnippet1, testClient);

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await testClient.getLatestRef(SyncResource.Snippets);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.deepStrictEqual(lastSyncUserData!.syncData!.content, JSON.stringify({ 'html.json': htmlSnippet1 }));
	});

	test('first time sync - outgoing to server (no snippets)', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet1, testClient);

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('first time sync - incoming from server (no snippets)', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);
	});

	test('first time sync when snippets exists', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('first time sync when snippets exists - has conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when snippets exists - has conflicts and accept conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet1);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1 });
	});

	test('first time sync when snippets exists - has multiple conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local1 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		const local2 = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json');
		assertPreviews(testObject.conflicts.conflicts, [local1, local2]);
	});

	test('first time sync when snippets exists - has multiple conflicts and accept one conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		let conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);

		conflicts = testObject.conflicts.conflicts;
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('first time sync when snippets exists - has multiple conflicts and accept all conflicts', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);
		await testObject.accept(conflicts[1].previewResource, tsSnippet1);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2, 'typescript.json': tsSnippet1 });
	});

	test('sync adding a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'typescript.json': tsSnippet1 });
	});

	test('sync adding a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual2, tsSnippet1);
	});

	test('sync updating a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2 });
	});

	test('sync updating a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);
	});

	test('sync updating a snippet - conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet3, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync updating a snippet - resolve conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet3, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, htmlSnippet2);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet2);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet2 });
	});

	test('sync removing a snippet', async () => {
		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet1, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1 });
	});

	test('sync removing a snippet - accept', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);
	});

	test('sync removing a snippet locally and updating it remotely', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await updateSnippet('html.json', htmlSnippet2, client2);
		await client2.sync();

		await removeSnippet('html.json', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, htmlSnippet2);
	});

	test('sync removing a snippet - conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		const local = joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json');
		assertPreviews(testObject.conflicts.conflicts, [local]);
	});

	test('sync removing a snippet - resolve conflict', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, htmlSnippet3);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, htmlSnippet3);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1, 'html.json': htmlSnippet3 });
	});

	test('sync removing a snippet - resolve conflict by removing', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		await removeSnippet('html.json', client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		await testObject.accept(testObject.conflicts.conflicts[0].previewResource, null);
		await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual2, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1 });
	});

	test('sync global and language snippet', async () => {
		await updateSnippet('global.code-snippets', globalSnippet, client2);
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('html.json', testClient);
		assert.strictEqual(actual1, htmlSnippet1);
		const actual2 = await readSnippet('global.code-snippets', testClient);
		assert.strictEqual(actual2, globalSnippet);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'html.json': htmlSnippet1, 'global.code-snippets': globalSnippet });
	});

	test('sync should ignore non snippets', async () => {
		await updateSnippet('global.code-snippets', globalSnippet, client2);
		await updateSnippet('html.html', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const actual1 = await readSnippet('typescript.json', testClient);
		assert.strictEqual(actual1, tsSnippet1);
		const actual2 = await readSnippet('global.code-snippets', testClient);
		assert.strictEqual(actual2, globalSnippet);
		const actual3 = await readSnippet('html.html', testClient);
		assert.strictEqual(actual3, null);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseSnippets(content);
		assert.deepStrictEqual(actual, { 'typescript.json': tsSnippet1, 'global.code-snippets': globalSnippet });
	});

	test('previews are reset after all conflicts resolved', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets));

		const conflicts = testObject.conflicts.conflicts;
		await testObject.accept(conflicts[0].previewResource, htmlSnippet2);
		await testObject.apply(false);

		const fileService = testClient.instantiationService.get(IFileService);
		assert.ok(!await fileService.exists(dirname(conflicts[0].previewResource)));
	});

	test('merge when there are multiple snippets and all snippets are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and all snippets are merged and applied', async () => {
		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and one snippet has no changes and one snippet is merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets and one snippet has no changes and snippets is merged and applied', async () => {
		await updateSnippet('html.json', htmlSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet1, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('merge when there are multiple snippets with conflicts and all snippets are merged', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		const preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
	});

	test('accept when there are multiple snippets with conflicts and only one snippet is accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
	});

	test('accept when there are multiple snippets with conflicts and all snippets are accepted', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);

		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);
		preview = await testObject.accept(preview!.resourcePreviews[1].previewResource, tsSnippet2);

		assert.strictEqual(testObject.status, SyncStatus.Syncing);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('accept when there are multiple snippets with conflicts and all snippets are accepted and applied', async () => {
		const environmentService = testClient.instantiationService.get(IEnvironmentService);
		await updateSnippet('html.json', htmlSnippet1, client2);
		await updateSnippet('typescript.json', tsSnippet1, client2);
		await client2.sync();

		await updateSnippet('html.json', htmlSnippet2, testClient);
		await updateSnippet('typescript.json', tsSnippet2, testClient);
		let preview = await testObject.sync(await testClient.getLatestRef(SyncResource.Snippets), true);

		assert.strictEqual(testObject.status, SyncStatus.HasConflicts);
		assertPreviews(preview!.resourcePreviews,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);
		assertPreviews(testObject.conflicts.conflicts,
			[
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'html.json'),
				joinPath(environmentService.userDataSyncHome, testObject.resource, PREVIEW_DIR_NAME, 'typescript.json'),
			]);

		preview = await testObject.accept(preview!.resourcePreviews[0].previewResource, htmlSnippet2);
		preview = await testObject.accept(preview!.resourcePreviews[1].previewResource, tsSnippet2);
		preview = await testObject.apply(false);

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.strictEqual(preview, null);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);
	});

	test('sync profile snippets', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updateSnippet('html.json', htmlSnippet1, client2, profile);
		await client2.sync();

		await testClient.sync();

		const syncedProfile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const content = await readSnippet('html.json', testClient, syncedProfile);
		assert.strictEqual(content, htmlSnippet1);
	});

	function parseSnippets(content: string): IStringDictionary<string> {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	async function updateSnippet(name: string, content: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).snippetsHome, name);
		await fileService.writeFile(snippetsResource, VSBuffer.fromString(content));
	}

	async function removeSnippet(name: string, client: UserDataSyncClient): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, name);
		await fileService.del(snippetsResource);
	}

	async function readSnippet(name: string, client: UserDataSyncClient, profile?: IUserDataProfile): Promise<string | null> {
		const fileService = client.instantiationService.get(IFileService);
		const userDataProfilesService = client.instantiationService.get(IUserDataProfilesService);
		const snippetsResource = joinPath((profile ?? userDataProfilesService.defaultProfile).snippetsHome, name);
		if (await fileService.exists(snippetsResource)) {
			const content = await fileService.readFile(snippetsResource);
			return content.value.toString();
		}
		return null;
	}

	function assertPreviews(actual: IResourcePreview[], expected: URI[]) {
		assert.deepStrictEqual(actual.map(({ previewResource }) => previewResource.toString()), expected.map(uri => uri.toString()));
	}

});
```

--------------------------------------------------------------------------------

````

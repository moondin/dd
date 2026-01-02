---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 296
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 296 of 552)

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

---[FILE: src/vs/platform/userDataSync/test/common/userDataSyncStoreService.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/userDataSyncStoreService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../base/common/async.js';
import { newWriteableBufferStream } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { isWeb } from '../../../../base/common/platform.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../log/common/log.js';
import { IProductService } from '../../../product/common/productService.js';
import { IRequestService } from '../../../request/common/request.js';
import { IUserDataSyncStoreService, SyncResource, UserDataSyncErrorCode, UserDataSyncStoreError } from '../../common/userDataSync.js';
import { RequestsSession, UserDataSyncStoreService } from '../../common/userDataSyncStoreService.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('UserDataSyncStoreService', () => {

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	test('test read manifest for the first time', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);
		const productService = client.instantiationService.get(IProductService);

		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Client-Name'], `${productService.applicationName}${isWeb ? '-web' : ''}`);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Client-Version'], productService.version);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test read manifest for the second time when session is not yet created', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test session id header is not set in the first manifest request after session is created', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		await testObject.writeResource(SyncResource.Settings, 'some content', null);

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test session id header is set from the second manifest request after session is created', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test headers are send for write request', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		await testObject.manifest(null);

		target.reset();
		await testObject.writeResource(SyncResource.Settings, 'some content', null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test headers are send for read request', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		await testObject.manifest(null);

		target.reset();
		await testObject.readResource(SyncResource.Settings, null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test headers are reset after session is cleared ', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		await testObject.manifest(null);
		await testObject.clear();

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test old headers are sent after session is changed on server ', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		const userSessionId = target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'];
		await target.clear();

		// client 2
		const client2 = disposableStore.add(new UserDataSyncClient(target));
		await client2.setUp();
		const testObject2 = client2.instantiationService.get(IUserDataSyncStoreService);
		await testObject2.writeResource(SyncResource.Settings, 'some content', null);

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], userSessionId);
	});

	test('test old headers are reset from second request after session is changed on server ', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		const userSessionId = target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'];
		await target.clear();

		// client 2
		const client2 = disposableStore.add(new UserDataSyncClient(target));
		await client2.setUp();
		const testObject2 = client2.instantiationService.get(IUserDataSyncStoreService);
		await testObject2.writeResource(SyncResource.Settings, 'some content', null);

		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], userSessionId);
	});

	test('test old headers are sent after session is cleared from another server ', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		const userSessionId = target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'];

		// client 2
		const client2 = disposableStore.add(new UserDataSyncClient(target));
		await client2.setUp();
		const testObject2 = client2.instantiationService.get(IUserDataSyncStoreService);
		await testObject2.clear();

		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], userSessionId);
	});

	test('test headers are reset after session is cleared from another server ', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];

		// client 2
		const client2 = disposableStore.add(new UserDataSyncClient(target));
		await client2.setUp();
		const testObject2 = client2.instantiationService.get(IUserDataSyncStoreService);
		await testObject2.clear();

		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.strictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test headers are reset after session is cleared from another server - started syncing again', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);
		const machineSessionId = target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'];
		const userSessionId = target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'];

		// client 2
		const client2 = disposableStore.add(new UserDataSyncClient(target));
		await client2.setUp();
		const testObject2 = client2.instantiationService.get(IUserDataSyncStoreService);
		await testObject2.clear();

		await testObject.manifest(null);
		await testObject.writeResource(SyncResource.Settings, 'some content', null);
		await testObject.manifest(null);
		target.reset();
		await testObject.manifest(null);

		assert.strictEqual(target.requestsWithAllHeaders.length, 1);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], undefined);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-Machine-Session-Id'], machineSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], userSessionId);
		assert.notStrictEqual(target.requestsWithAllHeaders[0].headers!['X-User-Session-Id'], undefined);
	});

	test('test rate limit on server with retry after', async () => {
		const target = new UserDataSyncTestServer(1, 1);
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);

		const promise = Event.toPromise(testObject.onDidChangeDonotMakeRequestsUntil);
		try {
			await testObject.manifest(null);
			assert.fail('should fail');
		} catch (e) {
			assert.ok(e instanceof UserDataSyncStoreError);
			assert.deepStrictEqual((<UserDataSyncStoreError>e).code, UserDataSyncErrorCode.TooManyRequestsAndRetryAfter);
			await promise;
			assert.ok(!!testObject.donotMakeRequestsUntil);
		}
	});

	test('test donotMakeRequestsUntil is reset after retry time is finished', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const client = disposableStore.add(new UserDataSyncClient(new UserDataSyncTestServer(1, 0.25)));
			await client.setUp();
			const testObject = client.instantiationService.get(IUserDataSyncStoreService);

			await testObject.manifest(null);
			try {
				await testObject.manifest(null);
				assert.fail('should fail');
			} catch (e) { }

			const promise = Event.toPromise(testObject.onDidChangeDonotMakeRequestsUntil);
			await timeout(300);
			await promise;
			assert.ok(!testObject.donotMakeRequestsUntil);
		});
	});

	test('test donotMakeRequestsUntil is retrieved', async () => {
		const client = disposableStore.add(new UserDataSyncClient(new UserDataSyncTestServer(1, 1)));
		await client.setUp();
		const testObject = client.instantiationService.get(IUserDataSyncStoreService);

		await testObject.manifest(null);
		try {
			await testObject.manifest(null);
		} catch (e) { }

		const target = disposableStore.add(client.instantiationService.createInstance(UserDataSyncStoreService));
		assert.strictEqual(target.donotMakeRequestsUntil?.getTime(), testObject.donotMakeRequestsUntil?.getTime());
	});

	test('test donotMakeRequestsUntil is checked and reset after retreived', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const client = disposableStore.add(new UserDataSyncClient(new UserDataSyncTestServer(1, 0.25)));
			await client.setUp();
			const testObject = client.instantiationService.get(IUserDataSyncStoreService);

			await testObject.manifest(null);
			try {
				await testObject.manifest(null);
				assert.fail('should fail');
			} catch (e) { }

			await timeout(300);
			const target = disposableStore.add(client.instantiationService.createInstance(UserDataSyncStoreService));
			assert.ok(!target.donotMakeRequestsUntil);
		});
	});

	test('test read resource request handles 304', async () => {
		// Setup the client
		const target = new UserDataSyncTestServer();
		const client = disposableStore.add(new UserDataSyncClient(target));
		await client.setUp();
		await client.sync();

		const testObject = client.instantiationService.get(IUserDataSyncStoreService);
		const expected = await testObject.readResource(SyncResource.Settings, null);
		const actual = await testObject.readResource(SyncResource.Settings, expected);

		assert.strictEqual(actual, expected);
	});

});

suite('UserDataSyncRequestsSession', () => {

	const requestService: IRequestService = {
		_serviceBrand: undefined,
		async request() { return { res: { headers: {} }, stream: newWriteableBufferStream() }; },
		async resolveProxy() { return undefined; },
		async lookupAuthorization() { return undefined; },
		async lookupKerberosAuthorization() { return undefined; },
		async loadCertificates() { return []; }
	};


	ensureNoDisposablesAreLeakedInTestSuite();

	test('too many requests are thrown when limit exceeded', async () => {
		const testObject = new RequestsSession(1, 500, requestService, new NullLogService());
		await testObject.request('url', {}, CancellationToken.None);

		try {
			await testObject.request('url', {}, CancellationToken.None);
		} catch (error) {
			assert.ok(error instanceof UserDataSyncStoreError);
			assert.strictEqual((<UserDataSyncStoreError>error).code, UserDataSyncErrorCode.LocalTooManyRequests);
			return;
		}
		assert.fail('Should fail with limit exceeded');
	});

	test('requests are handled after session is expired', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const testObject = new RequestsSession(1, 100, requestService, new NullLogService());
		await testObject.request('url', {}, CancellationToken.None);
		await timeout(125);
		await testObject.request('url', {}, CancellationToken.None);
	}));

	test('too many requests are thrown after session is expired', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const testObject = new RequestsSession(1, 100, requestService, new NullLogService());
		await testObject.request('url', {}, CancellationToken.None);
		await timeout(125);
		await testObject.request('url', {}, CancellationToken.None);

		try {
			await testObject.request('url', {}, CancellationToken.None);
		} catch (error) {
			assert.ok(error instanceof UserDataSyncStoreError);
			assert.strictEqual((<UserDataSyncStoreError>error).code, UserDataSyncErrorCode.LocalTooManyRequests);
			return;
		}
		assert.fail('Should fail with limit exceeded');
	}));

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/utilityProcess/common/utilityProcessWorkerService.ts]---
Location: vscode-main/src/vs/platform/utilityProcess/common/utilityProcessWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IUtilityProcessWorkerProcess {

	/**
	 * The module to load as child process into the worker.
	 */
	readonly moduleId: string;

	/**
	 * The type of the process appears in the arguments of the
	 * forked process to identify it easier.
	 */
	readonly type: string;

	/**
	 * A human-readable name for the utility process.
	 */
	readonly name: string;
}

export interface IOnDidTerminateUtilityrocessWorkerProcess {

	/**
	 * More information around how the utility process worker
	 * process terminated. Will be `undefined` in case the
	 * worker process was terminated normally via APIs
	 * and will be defined in case the worker process
	 * terminated on its own, either unexpectedly or
	 * because it finished.
	 */
	readonly reason: IUtilityProcessWorkerProcessExit;
}

export interface IUtilityProcessWorkerProcessExit {

	/**
	 * The utility process worker process exit code if known.
	 */
	readonly code?: number;

	/**
	 * The utility process worker process exit signal if known.
	 */
	readonly signal?: string;
}

export interface IUtilityProcessWorkerConfiguration {

	/**
	 * Configuration specific to the process to fork.
	 */
	readonly process: IUtilityProcessWorkerProcess;

	/**
	 * Configuration specific for how to respond with the
	 * communication message port to the receiver window.
	 */
	readonly reply: {
		readonly windowId: number;
		readonly channel?: string;
		readonly nonce?: string;
	};
}

export interface IUtilityProcessWorkerCreateConfiguration extends IUtilityProcessWorkerConfiguration {
	readonly reply: {
		readonly windowId: number;
		readonly channel: string;
		readonly nonce: string;
	};
}

export const ipcUtilityProcessWorkerChannelName = 'utilityProcessWorker';

export interface IUtilityProcessWorkerService {

	readonly _serviceBrand: undefined;

	/**
	 * Will fork a new process with the provided module identifier in a utility
	 * process and establishes a message port connection to that process. The other
	 * end of the message port connection will be sent back to the calling window
	 * as identified by the `reply` configuration.
	 *
	 * Requires the forked process to be ES module that uses our IPC channel framework
	 * to respond to the provided `channelName` as a server.
	 *
	 * The process will be automatically terminated when the receiver window closes,
	 * crashes or loads/reloads. It can also explicitly be terminated by calling
	 * `disposeWorker`.
	 *
	 * Note on affinity: repeated calls to `createWorker` with the same `moduleId` from
	 * the same window will result in any previous forked process to get terminated.
	 * In other words, it is not possible, nor intended to create multiple workers of
	 * the same process from one window. The intent of these workers is to be reused per
	 * window and the communication channel allows to dynamically update the processes
	 * after the fact.
	 *
	 * @returns a promise that resolves then the worker terminated. Provides more details
	 * about the termination that can be used to figure out if the termination was unexpected
	 * or not and whether the worker needs to be restarted.
	 */
	createWorker(configuration: IUtilityProcessWorkerCreateConfiguration): Promise<IOnDidTerminateUtilityrocessWorkerProcess>;

	/**
	 * Terminates the process for the provided configuration if any.
	 */
	disposeWorker(configuration: IUtilityProcessWorkerConfiguration): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/utilityProcess/electron-main/utilityProcess.ts]---
Location: vscode-main/src/vs/platform/utilityProcess/electron-main/utilityProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, Details, MessageChannelMain, app, utilityProcess, UtilityProcess as ElectronUtilityProcess } from 'electron';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { ILogService } from '../../log/common/log.js';
import { StringDecoder } from 'string_decoder';
import { timeout } from '../../../base/common/async.js';
import { FileAccess } from '../../../base/common/network.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import Severity from '../../../base/common/severity.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { removeDangerousEnvVariables } from '../../../base/common/processes.js';
import { deepClone } from '../../../base/common/objects.js';
import { isWindows } from '../../../base/common/platform.js';
import { isUNCAccessRestrictionsDisabled, getUNCHostAllowlist } from '../../../base/node/unc.js';

export interface IUtilityProcessConfiguration {

	/**
	 * A way to group utility processes of same type together.
	 */
	readonly type: string;

	/**
	 * A human-readable name for the utility process.
	 */
	readonly name: string;

	/**
	 * The entry point to load in the utility process.
	 */
	readonly entryPoint: string;

	/**
	 * An optional serializable object to be sent into the utility process
	 * as first message alongside the message port.
	 */
	readonly payload?: unknown;

	/**
	 * Environment key-value pairs. Default is `process.env`.
	 */
	readonly env?: { [key: string]: string | undefined };

	/**
	 * List of string arguments that will be available as `process.argv`
	 * in the child process.
	 */
	readonly args?: string[];

	/**
	 * List of string arguments passed to the executable.
	 */
	readonly execArgv?: string[];

	/**
	 * Allow the utility process to load unsigned libraries.
	 */
	readonly allowLoadingUnsignedLibraries?: boolean;

	/**
	 * Used in log messages to correlate the process
	 * with other components.
	 */
	readonly correlationId?: string;

	/**
	 * Optional pid of the parent process. If set, the
	 * utility process will be terminated when the parent
	 * process exits.
	 */
	readonly parentLifecycleBound?: number;

	/**
	 * HTTP 401 and 407 requests created via electron:net module
	 * will be redirected to the main process and can be handled
	 * via the app#login event.
	 */
	readonly respondToAuthRequestsFromMainProcess?: boolean;
}

export interface IWindowUtilityProcessConfiguration extends IUtilityProcessConfiguration {

	// --- message port response related

	readonly responseWindowId: number;
	readonly responseChannel: string;
	readonly responseNonce: string;

	// --- utility process options

	/**
	 * If set to `true`, will terminate the utility process
	 * when the associated browser window closes or reloads.
	 */
	readonly windowLifecycleBound?: boolean;
}

function isWindowUtilityProcessConfiguration(config: IUtilityProcessConfiguration): config is IWindowUtilityProcessConfiguration {
	const candidate = config as IWindowUtilityProcessConfiguration;

	return typeof candidate.responseWindowId === 'number';
}

interface IUtilityProcessExitBaseEvent {

	/**
	 * The process id of the process that exited.
	 */
	readonly pid: number;

	/**
	 * The exit code of the process.
	 */
	readonly code: number;
}

export interface IUtilityProcessExitEvent extends IUtilityProcessExitBaseEvent {

	/**
	 * The signal that caused the process to exit is unknown
	 * for utility processes.
	 */
	readonly signal: 'unknown';
}

export interface IUtilityProcessCrashEvent extends IUtilityProcessExitBaseEvent {

	/**
	 * The reason of the utility process crash.
	 */
	readonly reason: 'clean-exit' | 'abnormal-exit' | 'killed' | 'crashed' | 'oom' | 'launch-failed' | 'integrity-failure' | 'memory-eviction';
}

export interface IUtilityProcessInfo {
	readonly pid: number;
	readonly name: string;
}

export class UtilityProcess extends Disposable {

	private static ID_COUNTER = 0;

	private static readonly all = new Map<number, IUtilityProcessInfo>();
	static getAll(): IUtilityProcessInfo[] {
		return Array.from(UtilityProcess.all.values());
	}

	private readonly id = String(++UtilityProcess.ID_COUNTER);

	private readonly _onStdout = this._register(new Emitter<string>());
	readonly onStdout = this._onStdout.event;

	private readonly _onStderr = this._register(new Emitter<string>());
	readonly onStderr = this._onStderr.event;

	private readonly _onMessage = this._register(new Emitter<unknown>());
	readonly onMessage = this._onMessage.event;

	private readonly _onSpawn = this._register(new Emitter<number | undefined>());
	readonly onSpawn = this._onSpawn.event;

	private readonly _onExit = this._register(new Emitter<IUtilityProcessExitEvent>());
	readonly onExit = this._onExit.event;

	private readonly _onCrash = this._register(new Emitter<IUtilityProcessCrashEvent>());
	readonly onCrash = this._onCrash.event;

	private process: ElectronUtilityProcess | undefined = undefined;
	private processPid: number | undefined = undefined;
	private configuration: IUtilityProcessConfiguration | undefined = undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILifecycleMainService protected readonly lifecycleMainService: ILifecycleMainService
	) {
		super();
	}

	protected log(msg: string, severity: Severity): void {
		let logMsg: string;
		if (this.configuration?.correlationId) {
			logMsg = `[UtilityProcess id: ${this.configuration?.correlationId}, type: ${this.configuration?.type}, pid: ${this.processPid ?? '<none>'}]: ${msg}`;
		} else {
			logMsg = `[UtilityProcess type: ${this.configuration?.type}, pid: ${this.processPid ?? '<none>'}]: ${msg}`;
		}

		switch (severity) {
			case Severity.Error:
				this.logService.error(logMsg);
				break;
			case Severity.Warning:
				this.logService.warn(logMsg);
				break;
			case Severity.Info:
				this.logService.trace(logMsg);
				break;
		}
	}

	private validateCanStart(): boolean {
		if (this.process) {
			this.log('Cannot start utility process because it is already running...', Severity.Error);

			return false;
		}

		return true;
	}

	start(configuration: IUtilityProcessConfiguration): boolean {
		const started = this.doStart(configuration);

		if (started && configuration.payload) {
			const posted = this.postMessage(configuration.payload);
			if (posted) {
				this.log('payload sent via postMessage()', Severity.Info);
			}
		}

		return started;
	}

	protected doStart(configuration: IUtilityProcessConfiguration): boolean {
		if (!this.validateCanStart()) {
			return false;
		}

		this.configuration = configuration;

		const serviceName = `${this.configuration.type}-${this.id}`;
		const modulePath = FileAccess.asFileUri('bootstrap-fork.js').fsPath;
		const args = this.configuration.args ?? [];
		const execArgv = this.configuration.execArgv ?? [];
		const allowLoadingUnsignedLibraries = this.configuration.allowLoadingUnsignedLibraries;
		const respondToAuthRequestsFromMainProcess = this.configuration.respondToAuthRequestsFromMainProcess;
		const stdio = 'pipe';
		const env = this.createEnv(configuration);

		this.log('creating new...', Severity.Info);

		// Fork utility process
		this.process = utilityProcess.fork(modulePath, args, {
			serviceName,
			env,
			execArgv, // !!! Add `--trace-warnings` for node.js tracing !!!
			allowLoadingUnsignedLibraries,
			respondToAuthRequestsFromMainProcess,
			stdio
		});

		// Register to events
		this.registerListeners(this.process, this.configuration, serviceName);

		return true;
	}

	private createEnv(configuration: IUtilityProcessConfiguration): NodeJS.ProcessEnv {
		const env: NodeJS.ProcessEnv = configuration.env ? { ...configuration.env } : { ...deepClone(process.env) };

		// Apply supported environment variables from config
		env['VSCODE_ESM_ENTRYPOINT'] = configuration.entryPoint;
		if (typeof configuration.parentLifecycleBound === 'number') {
			env['VSCODE_PARENT_PID'] = String(configuration.parentLifecycleBound);
		}
		env['VSCODE_CRASH_REPORTER_PROCESS_TYPE'] = configuration.type;
		if (isWindows) {
			if (isUNCAccessRestrictionsDisabled()) {
				env['NODE_DISABLE_UNC_ACCESS_CHECKS'] = '1';
			} else {
				env['NODE_UNC_HOST_ALLOWLIST'] = getUNCHostAllowlist().join('\\');
			}
		}

		// Remove any environment variables that are not allowed
		removeDangerousEnvVariables(env);

		// Ensure all values are strings, otherwise the process will not start
		for (const key of Object.keys(env)) {
			env[key] = String(env[key]);
		}

		return env;
	}

	private registerListeners(process: ElectronUtilityProcess, configuration: IUtilityProcessConfiguration, serviceName: string): void {

		// Stdout
		if (process.stdout) {
			const stdoutDecoder = new StringDecoder('utf-8');
			this._register(Event.fromNodeEventEmitter<string | Buffer>(process.stdout, 'data')(chunk => this._onStdout.fire(typeof chunk === 'string' ? chunk : stdoutDecoder.write(chunk))));
		}

		// Stderr
		if (process.stderr) {
			const stderrDecoder = new StringDecoder('utf-8');
			this._register(Event.fromNodeEventEmitter<string | Buffer>(process.stderr, 'data')(chunk => this._onStderr.fire(typeof chunk === 'string' ? chunk : stderrDecoder.write(chunk))));
		}

		// Messages
		this._register(Event.fromNodeEventEmitter(process, 'message')(msg => this._onMessage.fire(msg)));

		// Spawn
		this._register(Event.fromNodeEventEmitter<void>(process, 'spawn')(() => {
			this.processPid = process.pid;

			if (typeof process.pid === 'number') {
				UtilityProcess.all.set(process.pid, { pid: process.pid, name: isWindowUtilityProcessConfiguration(configuration) ? `${configuration.name} [${configuration.responseWindowId}]` : configuration.name });
			}

			this.log('successfully created', Severity.Info);
			this._onSpawn.fire(process.pid);
		}));

		// Exit
		this._register(Event.fromNodeEventEmitter<number>(process, 'exit')(code => {
			this.log(`received exit event with code ${code}`, Severity.Info);

			// Event
			this._onExit.fire({ pid: this.processPid!, code, signal: 'unknown' });

			// Cleanup
			this.onDidExitOrCrashOrKill();
		}));

		// Child process gone
		this._register(Event.fromNodeEventEmitter<{ details: Details }>(app, 'child-process-gone', (event, details) => ({ event, details }))(({ details }) => {
			if (details.type === 'Utility' && details.name === serviceName) {
				this.log(`crashed with code ${details.exitCode} and reason '${details.reason}'`, Severity.Error);

				// Telemetry
				type UtilityProcessCrashClassification = {
					type: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of utility process to understand the origin of the crash better.' };
					reason: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The reason of the utility process crash to understand the nature of the crash better.' };
					code: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The exit code of the utility process to understand the nature of the crash better' };
					owner: 'bpasero';
					comment: 'Provides insight into reasons the utility process crashed.';
				};
				type UtilityProcessCrashEvent = {
					type: string;
					reason: string;
					code: number;
				};
				this.telemetryService.publicLog2<UtilityProcessCrashEvent, UtilityProcessCrashClassification>('utilityprocesscrash', {
					type: configuration.type,
					reason: details.reason,
					code: details.exitCode
				});

				// Event
				this._onCrash.fire({ pid: this.processPid!, code: details.exitCode, reason: details.reason });

				// Cleanup
				this.onDidExitOrCrashOrKill();
			}
		}));
	}

	once(message: unknown, callback: () => void): void {
		const disposable = this._register(this._onMessage.event(msg => {
			if (msg === message) {
				disposable.dispose();

				callback();
			}
		}));
	}

	postMessage(message: unknown, transfer?: Electron.MessagePortMain[]): boolean {
		if (!this.process) {
			return false; // already killed, crashed or never started
		}

		this.process.postMessage(message, transfer);

		return true;
	}

	connect(payload?: unknown): Electron.MessagePortMain {
		const { port1: outPort, port2: utilityProcessPort } = new MessageChannelMain();
		this.postMessage(payload, [utilityProcessPort]);

		return outPort;
	}

	enableInspectPort(): boolean {
		if (!this.process || typeof this.processPid !== 'number') {
			return false;
		}

		this.log('enabling inspect port', Severity.Info);

		interface ProcessExt {
			_debugProcess?(pid: number): unknown;
		}

		// use (undocumented) _debugProcess feature of node if available
		const processExt = <ProcessExt>process;
		if (typeof processExt._debugProcess === 'function') {
			processExt._debugProcess(this.processPid);

			return true;
		}

		// not supported...
		return false;
	}

	kill(): void {
		if (!this.process) {
			return; // already killed, crashed or never started
		}

		this.log('attempting to kill the process...', Severity.Info);
		const killed = this.process.kill();
		if (killed) {
			this.log('successfully killed the process', Severity.Info);
			this.onDidExitOrCrashOrKill();
		} else {
			this.log('unable to kill the process', Severity.Warning);
		}
	}

	private onDidExitOrCrashOrKill(): void {
		if (typeof this.processPid === 'number') {
			UtilityProcess.all.delete(this.processPid);
		}

		this.process = undefined;
	}

	async waitForExit(maxWaitTimeMs: number): Promise<void> {
		if (!this.process) {
			return; // already killed, crashed or never started
		}

		this.log('waiting to exit...', Severity.Info);
		await Promise.race([Event.toPromise(this.onExit), timeout(maxWaitTimeMs)]);

		if (this.process) {
			this.log(`did not exit within ${maxWaitTimeMs}ms, will kill it now...`, Severity.Info);
			this.kill();
		}
	}
}

export class WindowUtilityProcess extends UtilityProcess {

	constructor(
		@ILogService logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService
	) {
		super(logService, telemetryService, lifecycleMainService);
	}

	override start(configuration: IWindowUtilityProcessConfiguration): boolean {
		const responseWindow = this.windowsMainService.getWindowById(configuration.responseWindowId);
		if (!responseWindow?.win || responseWindow.win.isDestroyed() || responseWindow.win.webContents.isDestroyed()) {
			this.log('Refusing to start utility process because requesting window cannot be found or is destroyed...', Severity.Error);

			return true;
		}

		// Start utility process
		const started = super.doStart(configuration);
		if (!started) {
			return false;
		}

		// Register to window events
		this.registerWindowListeners(responseWindow.win, configuration);

		// Establish & exchange message ports
		const windowPort = this.connect(configuration.payload);
		responseWindow.win.webContents.postMessage(configuration.responseChannel, configuration.responseNonce, [windowPort]);

		return true;
	}

	private registerWindowListeners(window: BrowserWindow, configuration: IWindowUtilityProcessConfiguration): void {

		// If the lifecycle of the utility process is bound to the window,
		// we kill the process if the window closes or changes

		if (configuration.windowLifecycleBound) {
			this._register(Event.filter(this.lifecycleMainService.onWillLoadWindow, e => e.window.win === window)(() => this.kill()));
			this._register(Event.fromNodeEventEmitter(window, 'closed')(() => this.kill()));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/utilityProcess/electron-main/utilityProcessWorkerMainService.ts]---
Location: vscode-main/src/vs/platform/utilityProcess/electron-main/utilityProcessWorkerMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IUtilityProcessWorkerCreateConfiguration, IOnDidTerminateUtilityrocessWorkerProcess, IUtilityProcessWorkerConfiguration, IUtilityProcessWorkerProcessExit, IUtilityProcessWorkerService } from '../common/utilityProcessWorkerService.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { WindowUtilityProcess } from './utilityProcess.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { hash } from '../../../base/common/hash.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';

export const IUtilityProcessWorkerMainService = createDecorator<IUtilityProcessWorkerMainService>('utilityProcessWorker');

export interface IUtilityProcessWorkerMainService extends IUtilityProcessWorkerService {

	readonly _serviceBrand: undefined;
}

export class UtilityProcessWorkerMainService extends Disposable implements IUtilityProcessWorkerMainService {

	declare readonly _serviceBrand: undefined;

	private readonly workers = new Map<number /* id */, UtilityProcessWorker>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService
	) {
		super();
	}

	async createWorker(configuration: IUtilityProcessWorkerCreateConfiguration): Promise<IOnDidTerminateUtilityrocessWorkerProcess> {
		const workerLogId = `window: ${configuration.reply.windowId}, moduleId: ${configuration.process.moduleId}`;
		this.logService.trace(`[UtilityProcessWorker]: createWorker(${workerLogId})`);

		// Ensure to dispose any existing process for config
		const workerId = this.hash(configuration);
		if (this.workers.has(workerId)) {
			this.logService.warn(`[UtilityProcessWorker]: createWorker() found an existing worker that will be terminated (${workerLogId})`);

			this.disposeWorker(configuration);
		}

		// Create new worker
		const worker = new UtilityProcessWorker(this.logService, this.windowsMainService, this.telemetryService, this.lifecycleMainService, configuration);
		if (!worker.spawn()) {
			return { reason: { code: 1, signal: 'EINVALID' } };
		}

		this.workers.set(workerId, worker);

		const onDidTerminate = new DeferredPromise<IOnDidTerminateUtilityrocessWorkerProcess>();
		Event.once(worker.onDidTerminate)(reason => {
			if (reason.code === 0) {
				this.logService.trace(`[UtilityProcessWorker]: terminated normally with code ${reason.code}, signal: ${reason.signal}`);
			} else {
				this.logService.error(`[UtilityProcessWorker]: terminated unexpectedly with code ${reason.code}, signal: ${reason.signal}`);
			}

			this.workers.delete(workerId);
			onDidTerminate.complete({ reason });
		});

		return onDidTerminate.p;
	}

	private hash(configuration: IUtilityProcessWorkerConfiguration): number {
		return hash({
			moduleId: configuration.process.moduleId,
			windowId: configuration.reply.windowId
		});
	}

	async disposeWorker(configuration: IUtilityProcessWorkerConfiguration): Promise<void> {
		const workerId = this.hash(configuration);
		const worker = this.workers.get(workerId);
		if (!worker) {
			return;
		}

		this.logService.trace(`[UtilityProcessWorker]: disposeWorker(window: ${configuration.reply.windowId}, moduleId: ${configuration.process.moduleId})`);

		worker.kill();
		worker.dispose();
		this.workers.delete(workerId);
	}
}

class UtilityProcessWorker extends Disposable {

	private readonly _onDidTerminate = this._register(new Emitter<IUtilityProcessWorkerProcessExit>());
	readonly onDidTerminate = this._onDidTerminate.event;

	private readonly utilityProcess: WindowUtilityProcess;

	constructor(
		@ILogService logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		private readonly configuration: IUtilityProcessWorkerCreateConfiguration
	) {
		super();

		this.utilityProcess = this._register(new WindowUtilityProcess(logService, windowsMainService, telemetryService, lifecycleMainService));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.utilityProcess.onExit(e => this._onDidTerminate.fire({ code: e.code, signal: e.signal })));
		this._register(this.utilityProcess.onCrash(e => this._onDidTerminate.fire({ code: e.code, signal: 'ECRASH' })));
	}

	spawn(): boolean {
		const window = this.windowsMainService.getWindowById(this.configuration.reply.windowId);
		const windowPid = window?.win?.webContents.getOSProcessId();

		return this.utilityProcess.start({
			type: this.configuration.process.type,
			name: this.configuration.process.name,
			entryPoint: this.configuration.process.moduleId,
			parentLifecycleBound: windowPid,
			windowLifecycleBound: true,
			correlationId: `${this.configuration.reply.windowId}`,
			responseWindowId: this.configuration.reply.windowId,
			responseChannel: this.configuration.reply.channel,
			responseNonce: this.configuration.reply.nonce
		});
	}

	kill() {
		this.utilityProcess.kill();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/common/webContentExtractor.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/common/webContentExtractor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IWebContentExtractorService = createDecorator<IWebContentExtractorService>('IWebContentExtractorService');
export const ISharedWebContentExtractorService = createDecorator<ISharedWebContentExtractorService>('ISharedWebContentExtractorService');

export interface IWebContentExtractorOptions {
	/**
	 * Whether to allow cross-authority redirects on the web content.
	 * 'false' by default.
	 */
	followRedirects?: boolean;
}

export type WebContentExtractResult =
	| { status: 'ok'; result: string; title?: string }
	| { status: 'error'; error: string; statusCode?: number; result?: string; title?: string }
	| { status: 'redirect'; toURI: URI };

export interface IWebContentExtractorService {
	_serviceBrand: undefined;
	extract(uri: URI[], options?: IWebContentExtractorOptions): Promise<WebContentExtractResult[]>;
}

/*
 * A service that extracts image content from a given arbitrary URI. This is done in the shared process to avoid running non trusted application code in the main process.
 */
export interface ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(uri: URI, token: CancellationToken): Promise<VSBuffer | undefined>;
}

/**
 * A service that extracts web content from a given URI.
 * This is a placeholder implementation that does not perform any actual extraction.
 * It's intended to be used on platforms where web content extraction is not supported such as in the browser.
 */
export class NullWebContentExtractorService implements IWebContentExtractorService {
	_serviceBrand: undefined;

	extract(_uri: URI[]): Promise<WebContentExtractResult[]> {
		throw new Error('Not implemented');
	}
}

export class NullSharedWebContentExtractorService implements ISharedWebContentExtractorService {
	_serviceBrand: undefined;
	readImage(_uri: URI, _token: CancellationToken): Promise<VSBuffer | undefined> {
		throw new Error('Not implemented');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/electron-browser/webContentExtractorService.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/electron-browser/webContentExtractorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerMainProcessRemoteService, registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';
import { ISharedWebContentExtractorService, IWebContentExtractorService } from '../common/webContentExtractor.js';

registerMainProcessRemoteService(IWebContentExtractorService, 'webContentExtractor');
registerSharedProcessRemoteService(ISharedWebContentExtractorService, 'sharedWebContentExtractor');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/electron-main/cdpAccessibilityDomain.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/electron-main/cdpAccessibilityDomain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//#region Types

import { URI } from '../../../base/common/uri.js';

export interface AXValue {
	type: AXValueType;
	value?: unknown;
	relatedNodes?: AXNode[];
	sources?: AXValueSource[];
}

export interface AXValueSource {
	type: AXValueSourceType;
	value?: AXValue;
	attribute?: string;
	attributeValue?: string;
	superseded?: boolean;
	nativeSource?: AXValueNativeSourceType;
	nativeSourceValue?: string;
	invalid?: boolean;
	invalidReason?: string;
}

export interface AXNode {
	nodeId: string;
	ignored: boolean;
	ignoredReasons?: AXProperty[];
	role?: AXValue;
	chromeRole?: AXValue;
	name?: AXValue;
	description?: AXValue;
	value?: AXValue;
	properties?: AXProperty[];
	childIds?: string[];
	backendDOMNodeId?: number;
}

export interface AXProperty {
	name: AXPropertyName;
	value: AXValue;
}

export type AXValueType = 'boolean' | 'tristate' | 'booleanOrUndefined' | 'idref' | 'idrefList' | 'integer' | 'node' | 'nodeList' | 'number' | 'string' | 'computedString' | 'token' | 'tokenList' | 'domRelation' | 'role' | 'internalRole' | 'valueUndefined';

export type AXValueSourceType = 'attribute' | 'implicit' | 'style' | 'contents' | 'placeholder' | 'relatedElement';

export type AXValueNativeSourceType = 'description' | 'figcaption' | 'label' | 'labelfor' | 'labelwrapped' | 'legend' | 'rubyannotation' | 'tablecaption' | 'title' | 'other';

export type AXPropertyName = 'url' | 'busy' | 'disabled' | 'editable' | 'focusable' | 'focused' | 'hidden' | 'hiddenRoot' | 'invalid' | 'keyshortcuts' | 'settable' | 'roledescription' | 'live' | 'atomic' | 'relevant' | 'root' | 'autocomplete' | 'hasPopup' | 'level' | 'multiselectable' | 'orientation' | 'multiline' | 'readonly' | 'required' | 'valuemin' | 'valuemax' | 'valuetext' | 'checked' | 'expanded' | 'pressed' | 'selected' | 'activedescendant' | 'controls' | 'describedby' | 'details' | 'errormessage' | 'flowto' | 'labelledby' | 'owns';

//#endregion

interface AXNodeTree {
	readonly node: AXNode;
	readonly children: AXNodeTree[];
	parent: AXNodeTree | null;
}

function createNodeTree(nodes: AXNode[]): AXNodeTree | null {
	if (nodes.length === 0) {
		return null;
	}

	// Create a map of node IDs to their corresponding nodes for quick lookup
	const nodeLookup = new Map<string, AXNode>();
	for (const node of nodes) {
		nodeLookup.set(node.nodeId, node);
	}

	// Helper function to get all non-ignored descendants of a node
	function getNonIgnoredDescendants(nodeId: string): string[] {
		const node = nodeLookup.get(nodeId);
		if (!node || !node.childIds) {
			return [];
		}

		const result: string[] = [];
		for (const childId of node.childIds) {
			const childNode = nodeLookup.get(childId);
			if (!childNode) {
				continue;
			}

			if (childNode.ignored) {
				// If child is ignored, add its non-ignored descendants instead
				result.push(...getNonIgnoredDescendants(childId));
			} else {
				// Otherwise, add the child itself
				result.push(childId);
			}
		}
		return result;
	}

	// Create tree nodes only for non-ignored nodes
	const nodeMap = new Map<string, AXNodeTree>();
	for (const node of nodes) {
		if (!node.ignored) {
			nodeMap.set(node.nodeId, { node, children: [], parent: null });
		}
	}

	// Establish parent-child relationships, bypassing ignored nodes
	for (const node of nodes) {
		if (node.ignored) {
			continue;
		}

		const treeNode = nodeMap.get(node.nodeId)!;
		if (node.childIds) {
			for (const childId of node.childIds) {
				const childNode = nodeLookup.get(childId);
				if (!childNode) {
					continue;
				}

				if (childNode.ignored) {
					// If child is ignored, connect its non-ignored descendants to this node
					const nonIgnoredDescendants = getNonIgnoredDescendants(childId);
					for (const descendantId of nonIgnoredDescendants) {
						const descendantTreeNode = nodeMap.get(descendantId);
						if (descendantTreeNode) {
							descendantTreeNode.parent = treeNode;
							treeNode.children.push(descendantTreeNode);
						}
					}
				} else {
					// Normal case: add non-ignored child directly
					const childTreeNode = nodeMap.get(childId);
					if (childTreeNode) {
						childTreeNode.parent = treeNode;
						treeNode.children.push(childTreeNode);
					}
				}
			}
		}
	}

	// Find the root node (a node without a parent)
	for (const node of nodeMap.values()) {
		if (!node.parent) {
			return node;
		}
	}

	return null;
}

/**
 * When possible, we will make sure lines are no longer than 80. This is to help
 * certain pieces of software that can't handle long lines.
 */
const LINE_MAX_LENGTH = 80;

/**
 * Converts an accessibility tree represented by AXNode objects into a markdown string.
 *
 * @param uri The URI of the document
 * @param axNodes The array of AXNode objects representing the accessibility tree
 * @returns A markdown representation of the accessibility tree
 */
export function convertAXTreeToMarkdown(uri: URI, axNodes: AXNode[]): string {
	const tree = createNodeTree(axNodes);
	if (!tree) {
		return ''; // Return empty string for empty tree
	}

	// Process tree to extract main content and navigation links
	const mainContent = extractMainContent(uri, tree);
	const navLinks = collectNavigationLinks(tree);

	// Combine main content and navigation links
	return mainContent + (navLinks.length > 0 ? '\n\n## Additional Links\n' + navLinks.join('\n') : '');
}

function extractMainContent(uri: URI, tree: AXNodeTree): string {
	const contentBuffer: string[] = [];
	processNode(uri, tree, contentBuffer, 0, true);
	return contentBuffer.join('');
}

function processNode(uri: URI, node: AXNodeTree, buffer: string[], depth: number, allowWrap: boolean): void {
	const role = getNodeRole(node.node);

	switch (role) {
		case 'navigation':
			return; // Skip navigation nodes

		case 'heading':
			processHeadingNode(uri, node, buffer, depth);
			return;

		case 'paragraph':
			processParagraphNode(uri, node, buffer, depth, allowWrap);
			return;

		case 'list':
			buffer.push('\n');
			for (const descChild of node.children) {
				processNode(uri, descChild, buffer, depth + 1, true);
			}
			buffer.push('\n');
			return;

		case 'ListMarker':
			// TODO: Should we normalize these ListMarkers to `-` and normal lists?
			buffer.push(getNodeText(node.node, allowWrap));
			return;

		case 'listitem': {
			const tempBuffer: string[] = [];
			// Process the children of the list item
			for (const descChild of node.children) {
				processNode(uri, descChild, tempBuffer, depth + 1, true);
			}
			const indent = getLevel(node.node) > 1 ? ' '.repeat(getLevel(node.node)) : '';
			buffer.push(`${indent}${tempBuffer.join('').trim()}\n`);
			return;
		}

		case 'link':
			if (!isNavigationLink(node)) {
				const linkText = getNodeText(node.node, allowWrap);
				const url = getLinkUrl(node.node);
				if (!isSameUriIgnoringQueryAndFragment(uri, node.node)) {
					buffer.push(`[${linkText}](${url})`);
				} else {
					buffer.push(linkText);
				}
			}
			return;
		case 'StaticText': {
			const staticText = getNodeText(node.node, allowWrap);
			if (staticText) {
				buffer.push(staticText);
			}
			break;
		}
		case 'image': {
			const altText = getNodeText(node.node, allowWrap) || 'Image';
			const imageUrl = getImageUrl(node.node);
			if (imageUrl) {
				buffer.push(`![${altText}](${imageUrl})\n\n`);
			} else {
				buffer.push(`[Image: ${altText}]\n\n`);
			}
			break;
		}

		case 'DescriptionList':
			processDescriptionListNode(uri, node, buffer, depth);
			return;

		case 'blockquote':
			buffer.push('> ' + getNodeText(node.node, allowWrap).replace(/\n/g, '\n> ') + '\n\n');
			break;

		// TODO: Is this the correct way to handle the generic role?
		case 'generic':
			buffer.push(' ');
			break;

		case 'code': {
			processCodeNode(uri, node, buffer, depth);
			return;
		}

		case 'pre':
			buffer.push('```\n' + getNodeText(node.node, false) + '\n```\n\n');
			break;

		case 'table':
			processTableNode(node, buffer);
			return;
	}

	// Process children if not already handled in specific cases
	for (const child of node.children) {
		processNode(uri, child, buffer, depth + 1, allowWrap);
	}
}

function getNodeRole(node: AXNode): string {
	return node.role?.value as string || '';
}

function getNodeText(node: AXNode, allowWrap: boolean): string {
	const text = node.name?.value as string || node.value?.value as string || '';
	if (!allowWrap) {
		return text;
	}

	if (text.length <= LINE_MAX_LENGTH) {
		return text;
	}

	const chars = text.split('');
	let lastSpaceIndex = -1;
	for (let i = 1; i < chars.length; i++) {
		if (chars[i] === ' ') {
			lastSpaceIndex = i;
		}
		// Check if we reached the line max length, try to break at the last space
		// before the line max length
		if (i % LINE_MAX_LENGTH === 0 && lastSpaceIndex !== -1) {
			// replace the space with a new line
			chars[lastSpaceIndex] = '\n';
			lastSpaceIndex = i;
		}
	}
	return chars.join('');
}

function getLevel(node: AXNode): number {
	const levelProp = node.properties?.find(p => p.name === 'level');
	return levelProp ? Math.min(Number(levelProp.value.value) || 1, 6) : 1;
}

function getLinkUrl(node: AXNode): string {
	// Find URL in properties
	const urlProp = node.properties?.find(p => p.name === 'url');
	return urlProp?.value.value as string || '#';
}

function getImageUrl(node: AXNode): string | null {
	// Find URL in properties
	const urlProp = node.properties?.find(p => p.name === 'url');
	return urlProp?.value.value as string || null;
}

function isNavigationLink(node: AXNodeTree): boolean {
	// Check if this link is part of navigation
	let current: AXNodeTree | null = node;
	while (current) {
		const role = getNodeRole(current.node);
		if (['navigation', 'menu', 'menubar'].includes(role)) {
			return true;
		}
		current = current.parent;
	}
	return false;
}

function isSameUriIgnoringQueryAndFragment(uri: URI, node: AXNode): boolean {
	// Check if this link is an anchor link
	const link = getLinkUrl(node);
	try {
		const parsed = URI.parse(link);
		return parsed.scheme === uri.scheme && parsed.authority === uri.authority && parsed.path === uri.path;
	} catch (e) {
		return false;
	}
}

function processParagraphNode(uri: URI, node: AXNodeTree, buffer: string[], depth: number, allowWrap: boolean): void {
	buffer.push('\n');
	// Process the children of the paragraph
	for (const child of node.children) {
		processNode(uri, child, buffer, depth + 1, allowWrap);
	}
	buffer.push('\n\n');
}

function processHeadingNode(uri: URI, node: AXNodeTree, buffer: string[], depth: number): void {
	buffer.push('\n');
	const level = getLevel(node.node);
	buffer.push(`${'#'.repeat(level)} `);
	// Process children nodes of the heading
	for (const child of node.children) {
		if (getNodeRole(child.node) === 'StaticText') {
			buffer.push(getNodeText(child.node, false));
		} else {
			processNode(uri, child, buffer, depth + 1, false);
		}
	}
	buffer.push('\n\n');
}

function processDescriptionListNode(uri: URI, node: AXNodeTree, buffer: string[], depth: number): void {
	buffer.push('\n');

	// Process each child of the description list
	for (const child of node.children) {
		if (getNodeRole(child.node) === 'term') {
			buffer.push('- **');
			// Process term nodes
			for (const termChild of child.children) {
				processNode(uri, termChild, buffer, depth + 1, true);
			}
			buffer.push('** ');
		} else if (getNodeRole(child.node) === 'definition') {
			// Process description nodes
			for (const descChild of child.children) {
				processNode(uri, descChild, buffer, depth + 1, true);
			}
			buffer.push('\n');
		}
	}

	buffer.push('\n');
}

function isTableCell(role: string): boolean {
	// Match cell, gridcell, columnheader, rowheader roles
	return role === 'cell' || role === 'gridcell' || role === 'columnheader' || role === 'rowheader';
}

function processTableNode(node: AXNodeTree, buffer: string[]): void {
	buffer.push('\n');

	// Find rows
	const rows = node.children.filter(child => getNodeRole(child.node).includes('row'));

	if (rows.length > 0) {
		// First row as header
		const headerCells = rows[0].children.filter(cell => isTableCell(getNodeRole(cell.node)));

		// Generate header row
		const headerContent = headerCells.map(cell => getNodeText(cell.node, false) || ' ');
		buffer.push('| ' + headerContent.join(' | ') + ' |\n');

		// Generate separator row
		buffer.push('| ' + headerCells.map(() => '---').join(' | ') + ' |\n');

		// Generate data rows
		for (let i = 1; i < rows.length; i++) {
			const dataCells = rows[i].children.filter(cell => isTableCell(getNodeRole(cell.node)));
			const rowContent = dataCells.map(cell => getNodeText(cell.node, false) || ' ');
			buffer.push('| ' + rowContent.join(' | ') + ' |\n');
		}
	}

	buffer.push('\n');
}

function processCodeNode(uri: URI, node: AXNodeTree, buffer: string[], depth: number): void {
	const tempBuffer: string[] = [];
	// Process the children of the code node
	for (const child of node.children) {
		processNode(uri, child, tempBuffer, depth + 1, false);
	}
	const isCodeblock = tempBuffer.some(text => text.includes('\n'));
	if (isCodeblock) {
		buffer.push('\n```\n');
		// Append the processed text to the buffer
		buffer.push(tempBuffer.join(''));
		buffer.push('\n```\n');
	} else {
		buffer.push('`');
		let characterCount = 0;
		// Append the processed text to the buffer
		for (const tempItem of tempBuffer) {
			characterCount += tempItem.length;
			if (characterCount > LINE_MAX_LENGTH) {
				buffer.push('\n');
				characterCount = 0;
			}
			buffer.push(tempItem);
			buffer.push('`');
		}
	}
}

function collectNavigationLinks(tree: AXNodeTree): string[] {
	const links: string[] = [];
	collectLinks(tree, links);
	return links;
}

function collectLinks(node: AXNodeTree, links: string[]): void {
	const role = getNodeRole(node.node);

	if (role === 'link' && isNavigationLink(node)) {
		const linkText = getNodeText(node.node, true);
		const url = getLinkUrl(node.node);
		const description = node.node.description?.value as string || '';

		links.push(`- [${linkText}](${url})${description ? ' - ' + description : ''}`);
	}

	// Process children
	for (const child of node.children) {
		collectLinks(child, links);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/electron-main/webContentCache.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/electron-main/webContentCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LRUCache } from '../../../base/common/map.js';
import { extUriIgnorePathCase } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IWebContentExtractorOptions, WebContentExtractResult } from '../common/webContentExtractor.js';

type CacheEntry = Readonly<{
	result: WebContentExtractResult;
	options: IWebContentExtractorOptions | undefined;
	expiration: number;
}>;

/**
 * A cache for web content extraction results.
 */
export class WebContentCache {
	private static readonly MAX_CACHE_SIZE = 1000;
	private static readonly SUCCESS_CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours
	private static readonly ERROR_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

	private readonly _cache = new LRUCache<string, CacheEntry>(WebContentCache.MAX_CACHE_SIZE);

	/**
	 * Add a web content extraction result to the cache.
	 */
	public add(uri: URI, options: IWebContentExtractorOptions | undefined, result: WebContentExtractResult) {
		let expiration: number;
		switch (result.status) {
			case 'ok':
			case 'redirect':
				expiration = Date.now() + WebContentCache.SUCCESS_CACHE_DURATION;
				break;
			default:
				expiration = Date.now() + WebContentCache.ERROR_CACHE_DURATION;
				break;
		}

		const key = WebContentCache.getKey(uri, options);
		this._cache.set(key, { result, options, expiration });
	}

	/**
	 * Try to get a cached web content extraction result for the given URI and options.
	 */
	public tryGet(uri: URI, options: IWebContentExtractorOptions | undefined): WebContentExtractResult | undefined {
		const key = WebContentCache.getKey(uri, options);
		const entry = this._cache.get(key);
		if (entry === undefined) {
			return undefined;
		}

		if (entry.expiration < Date.now()) {
			this._cache.delete(key);
			return undefined;
		}

		return entry.result;
	}

	private static getKey(uri: URI, options: IWebContentExtractorOptions | undefined): string {
		return `${!!options?.followRedirects}${extUriIgnorePathCase.getComparisonKey(uri)}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/electron-main/webContentExtractorService.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/electron-main/webContentExtractorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow } from 'electron';
import { Limiter } from '../../../base/common/async.js';
import { URI } from '../../../base/common/uri.js';
import { ILogService } from '../../log/common/log.js';
import { IWebContentExtractorOptions, IWebContentExtractorService, WebContentExtractResult } from '../common/webContentExtractor.js';
import { WebContentCache } from './webContentCache.js';
import { WebPageLoader } from './webPageLoader.js';

export class NativeWebContentExtractorService implements IWebContentExtractorService {
	_serviceBrand: undefined;

	// Only allow 3 windows to be opened at a time
	// to avoid overwhelming the system with too many processes.
	private _limiter = new Limiter<WebContentExtractResult>(3);
	private _webContentsCache = new WebContentCache();

	constructor(@ILogService private readonly _logger: ILogService) { }

	extract(uris: URI[], options?: IWebContentExtractorOptions): Promise<WebContentExtractResult[]> {
		if (uris.length === 0) {
			this._logger.info('No URIs provided for extraction');
			return Promise.resolve([]);
		}
		this._logger.info(`Extracting content from ${uris.length} URIs`);
		return Promise.all(uris.map((uri) => this._limiter.queue(() => this.doExtract(uri, options))));
	}

	async doExtract(uri: URI, options: IWebContentExtractorOptions | undefined): Promise<WebContentExtractResult> {
		const cached = this._webContentsCache.tryGet(uri, options);
		if (cached !== undefined) {
			this._logger.info(`Found cached content for ${uri.toString()}`);
			return cached;
		}

		const loader = new WebPageLoader((options) => new BrowserWindow(options), this._logger, uri, options);
		try {
			const result = await loader.load();
			this._webContentsCache.add(uri, options, result);
			return result;
		} finally {
			loader.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/electron-main/webPageLoader.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/electron-main/webPageLoader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { BeforeSendResponse, BrowserWindow, BrowserWindowConstructorOptions, Event, OnBeforeSendHeadersListenerDetails } from 'electron';
import { Queue, raceTimeout, TimeoutTimer } from '../../../base/common/async.js';
import { createSingleCallFunction } from '../../../base/common/functional.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { equalsIgnoreCase } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { ILogService } from '../../log/common/log.js';
import { IWebContentExtractorOptions, WebContentExtractResult } from '../common/webContentExtractor.js';
import { AXNode, convertAXTreeToMarkdown } from './cdpAccessibilityDomain.js';

type NetworkRequestEventParams = Readonly<{
	requestId?: string;
	request?: { url?: string };
	response?: { status?: number; statusText?: string };
	type?: string;
}>;

/**
 * A web page loader that uses Electron to load web pages and extract their content.
 */
export class WebPageLoader extends Disposable {
	private static readonly TIMEOUT = 30000; // 30 seconds
	private static readonly POST_LOAD_TIMEOUT = 5000; // 5 seconds - increased for dynamic content
	private static readonly FRAME_TIMEOUT = 500; // 0.5 seconds
	private static readonly IDLE_DEBOUNCE_TIME = 500; // 0.5 seconds - wait after last network request
	private static readonly MIN_CONTENT_LENGTH = 100; // Minimum content length to consider extraction successful

	private readonly _window: BrowserWindow;
	private readonly _debugger: Electron.Debugger;
	private readonly _requests = new Set<string>();
	private readonly _queue = this._register(new Queue());
	private readonly _timeout = this._register(new TimeoutTimer());
	private readonly _idleDebounceTimer = this._register(new TimeoutTimer());
	private _onResult = (_result: WebContentExtractResult) => { };
	private _didFinishLoad = false;

	constructor(
		browserWindowFactory: (options: BrowserWindowConstructorOptions) => BrowserWindow,
		private readonly _logger: ILogService,
		private readonly _uri: URI,
		private readonly _options?: IWebContentExtractorOptions,
	) {
		super();

		this._window = browserWindowFactory({
			width: 800,
			height: 600,
			show: false,
			webPreferences: {
				partition: generateUuid(), // do not share any state with the default renderer session
				javascript: true,
				offscreen: true,
				sandbox: true,
				webgl: false,
			}
		});

		this._register(toDisposable(() => this._window.destroy()));

		this._debugger = this._window.webContents.debugger;
		this._debugger.attach('1.1');
		this._debugger.on('message', this.onDebugMessage.bind(this));

		this._window.webContents
			.once('did-start-loading', this.onStartLoading.bind(this))
			.once('did-finish-load', this.onFinishLoad.bind(this))
			.once('did-fail-load', this.onFailLoad.bind(this))
			.once('will-navigate', this.onRedirect.bind(this))
			.once('will-redirect', this.onRedirect.bind(this))
			.on('select-client-certificate', (event) => event.preventDefault());

		this._window.webContents.session.webRequest.onBeforeSendHeaders(
			this.onBeforeSendHeaders.bind(this));
	}

	private trace(message: string) {
		this._logger.trace(`[WebPageLoader] [${this._uri}] ${message}`);
	}

	/**
	 * Loads the web page and extracts its content.
	 */
	public async load() {
		return await new Promise<WebContentExtractResult>((resolve) => {
			this._onResult = createSingleCallFunction((result) => {
				switch (result.status) {
					case 'ok':
						this.trace(`Loaded web page content, status: ${result.status}, title: '${result.title}', length: ${result.result.length}`);
						break;
					case 'redirect':
						this.trace(`Loaded web page content, status: ${result.status}, toURI: ${result.toURI}`);
						break;
					case 'error':
						this.trace(`Loaded web page content, status: ${result.status}, code: ${result.statusCode}, error: '${result.error}', title: '${result.title}', length: ${result.result?.length ?? 0}`);
						break;
				}

				const content = result.status !== 'redirect' ? result.result : undefined;
				if (content !== undefined) {
					this.trace(content.length < 200 ? `Extracted content: '${content}'` : `Extracted content preview: '${content.substring(0, 200)}...'`);
				}

				resolve(result);
				this.dispose();
			});

			this.trace(`Loading web page content`);
			void this._window.loadURL(this._uri.toString(true));
			this.setTimeout(WebPageLoader.TIMEOUT);
		});
	}

	/**
	 * Sets a timeout to trigger content extraction regardless of current loading state.
	 */
	private setTimeout(time: number) {
		if (this._store.isDisposed) {
			return;
		}

		this.trace(`Setting page load timeout to ${time} ms`);
		this._timeout.cancelAndSet(() => {
			this.trace(`Page load timeout reached`);
			void this._queue.queue(() => this.extractContent());
		}, time);
	}

	/**
	 * Updates HTTP headers for each web request.
	 */
	private onBeforeSendHeaders(details: OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: BeforeSendResponse) => void) {
		const headers = { ...details.requestHeaders };

		// Request privacy for web-sites that respect these.
		headers['DNT'] = '1';
		headers['Sec-GPC'] = '1';

		callback({ requestHeaders: headers });
	}

	/**
	 * Handles the 'did-start-loading' event, enabling network tracking.
	 */
	private onStartLoading() {
		if (this._store.isDisposed) {
			return;
		}

		this.trace(`Received 'did-start-loading' event`);
		void this._debugger.sendCommand('Network.enable').catch(() => {
			// This throws when we destroy the window on redirect.
		});
	}

	/**
	 * Handles the 'did-finish-load' event, checking for idle state
	 * and updating timeout to allow for post-load activities.
	 */
	private onFinishLoad() {
		if (this._store.isDisposed) {
			return;
		}

		this.trace(`Received 'did-finish-load' event`);
		this._didFinishLoad = true;
		this.scheduleIdleCheck();
		this.setTimeout(WebPageLoader.POST_LOAD_TIMEOUT);
	}

	/**
	 * Handles the 'did-fail-load' event, reporting load failures.
	 */
	private onFailLoad(_event: Event, statusCode: number, error: string) {
		if (this._store.isDisposed) {
			return;
		}

		this.trace(`Received 'did-fail-load' event, code: ${statusCode}, error: '${error}'`);
		if (statusCode === -3) {
			this.trace(`Ignoring ERR_ABORTED (-3) as it may be caused by CSP or other measures`);
			void this._queue.queue(() => this.extractContent());
		} else {
			void this._queue.queue(() => this.extractContent({ status: 'error', statusCode, error }));
		}
	}

	/**
	 * Handles the 'will-navigate' and 'will-redirect' events, managing redirects.
	 */
	private onRedirect(event: Event, url: string) {
		if (this._store.isDisposed) {
			return;
		}

		this.trace(`Received 'will-navigate' or 'will-redirect' event, url: ${url}`);
		if (!this._options?.followRedirects) {
			const toURI = URI.parse(url);
			if (!equalsIgnoreCase(toURI.authority, this._uri.authority)) {
				event.preventDefault();
				this._onResult({ status: 'redirect', toURI });
			}
		}
	}

	/**
	 * Handles debugger messages related to network requests, tracking their lifecycle.
	 * @note DO NOT add logging to this function, microsoft.com will freeze when too many logs are generated
	 */
	private onDebugMessage(_event: Event, method: string, params: NetworkRequestEventParams) {
		if (this._store.isDisposed) {
			return;
		}

		const { requestId, type, response } = params;
		switch (method) {
			case 'Network.requestWillBeSent':
				if (requestId !== undefined) {
					this._requests.add(requestId);
					this._idleDebounceTimer.cancel();
				}
				break;
			case 'Network.loadingFinished':
			case 'Network.loadingFailed':
				if (requestId !== undefined) {
					this._requests.delete(requestId);
					if (this._requests.size === 0 && this._didFinishLoad) {
						this.scheduleIdleCheck();
					}
				}
				break;
			case 'Network.responseReceived':
				if (type === 'Document') {
					const statusCode = response?.status ?? 0;
					if (statusCode >= 400) {
						const error = response?.statusText || `HTTP error ${statusCode}`;
						void this._queue.queue(() => this.extractContent({ status: 'error', statusCode, error }));
					}
				}
				break;
		}
	}

	/**
	 * Schedules an idle check after a debounce period to allow for bursts of network activity.
	 * If idle is detected, proceeds to extract content.
	 */
	private scheduleIdleCheck() {
		if (this._store.isDisposed) {
			return;
		}

		this._idleDebounceTimer.cancelAndSet(async () => {
			if (this._store.isDisposed) {
				return;
			}

			await this.nextFrame();

			if (this._requests.size === 0) {
				this._queue.queue(() => this.extractContent());
			} else {
				this.trace(`New network requests detected, deferring content extraction`);
			}
		}, WebPageLoader.IDLE_DEBOUNCE_TIME);
	}

	/**
	 * Waits for a rendering frame to ensure the page had a chance to update.
	 */
	private async nextFrame() {
		if (this._store.isDisposed) {
			return;
		}

		// Wait for a rendering frame to ensure the page had a chance to update.
		await raceTimeout(
			new Promise<void>((resolve) => {
				try {
					this.trace(`Waiting for a frame to be rendered`);
					this._window.webContents.beginFrameSubscription(false, () => {
						try {
							this.trace(`A frame has been rendered`);
							this._window.webContents.endFrameSubscription();
						} catch {
							// ignore errors
						}
						resolve();
					});
				} catch {
					// ignore errors
					resolve();
				}
			}),
			WebPageLoader.FRAME_TIMEOUT
		);
	}

	/**
	 * Extracts the content of the loaded web page using the Accessibility domain and reports the result.
	 */
	private async extractContent(errorResult?: WebContentExtractResult & { status: 'error' }) {
		if (this._store.isDisposed) {
			return;
		}

		try {
			const title = this._window.webContents.getTitle();

			let result = await this.extractAccessibilityTreeContent() ?? '';
			if (result.length < WebPageLoader.MIN_CONTENT_LENGTH) {
				this.trace(`Accessibility tree extraction yielded insufficient content, trying main DOM element extraction`);
				const domContent = await this.extractMainDomElementContent() ?? '';
				result = domContent.length > result.length ? domContent : result;
			}

			if (result.length === 0) {
				this._onResult({ status: 'error', error: 'Failed to extract meaningful content from the web page' });
			} else if (errorResult !== undefined) {
				this._onResult({ ...errorResult, result, title });
			} else {
				this._onResult({ status: 'ok', result, title });
			}
		} catch (e) {
			if (errorResult !== undefined) {
				this._onResult(errorResult);
			} else {
				this._onResult({
					status: 'error',
					error: e instanceof Error ? e.message : String(e)
				});
			}
		}
	}

	/**
	 * Extracts content from the Accessibility tree of the loaded web page.
	 * @return The extracted content, or undefined if extraction fails.
	 */
	private async extractAccessibilityTreeContent(): Promise<string | undefined> {
		this.trace(`Extracting content using Accessibility domain`);
		try {
			const { nodes } = await this._debugger.sendCommand('Accessibility.getFullAXTree') as { nodes: AXNode[] };
			return convertAXTreeToMarkdown(this._uri, nodes);
		} catch (error) {
			this.trace(`Accessibility tree extraction failed: ${error instanceof Error ? error.message : String(error)}`);
			return undefined;
		}
	}

	/**
	 * Fallback method for extracting web page content when Accessibility tree extraction yields insufficient content.
	 * Attempts to extract meaningful text content from the main DOM elements of the loaded web page.
	 * @returns The extracted text content, or undefined if extraction fails.
	 */
	private async extractMainDomElementContent(): Promise<string | undefined> {
		try {
			this.trace(`Extracting content from main DOM element`);
			return await this._window.webContents.executeJavaScript(`
				(() => {
					const selectors = ['main','article','[role="main"]','.main-content','#main-content','.article-body','.post-content','.entry-content','.content','body'];
					for (const selector of selectors) {
						const content = document.querySelector(selector)?.textContent?.replace(/[ \\t]+/g, ' ').replace(/\\s{2,}/gm, '\\n').trim();
						if (content && content.length > ${WebPageLoader.MIN_CONTENT_LENGTH}) {
							return content;
						}
					}
					return undefined;
				})();
			`);
		} catch (error) {
			this.trace(`DOM extraction failed: ${error instanceof Error ? error.message : String(error)}`);
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/node/sharedWebContentExtractorService.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/node/sharedWebContentExtractorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { ISharedWebContentExtractorService } from '../common/webContentExtractor.js';

export class SharedWebContentExtractorService implements ISharedWebContentExtractorService {
	_serviceBrand: undefined;

	async readImage(uri: URI, token: CancellationToken): Promise<VSBuffer | undefined> {
		if (token.isCancellationRequested) {
			return undefined;
		}

		try {
			const response = await fetch(uri.toString(true), {
				headers: {
					'Accept': 'image/*',
					'User-Agent': 'Mozilla/5.0'
				}
			});
			const contentType = response.headers.get('content-type');
			if (!response.ok || !contentType?.startsWith('image/') || !/(webp|jpg|jpeg|gif|png|bmp)$/i.test(contentType)) {
				return undefined;
			}

			const content = VSBuffer.wrap(await (response as unknown as { bytes: () => Promise<Uint8Array<ArrayBuffer>> } /* workaround https://github.com/microsoft/TypeScript/issues/61826 */).bytes());
			return content;
		} catch (err) {
			console.log(err);
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/test/electron-main/cdpAccessibilityDomain.test.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/test/electron-main/cdpAccessibilityDomain.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { AXNode, AXProperty, AXValueType, convertAXTreeToMarkdown } from '../../electron-main/cdpAccessibilityDomain.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('CDP Accessibility Domain', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const testUri = URI.parse('https://example.com/test');

	function createAXValue(type: AXValueType, value: any) {
		return { type, value };
	}

	function createAXProperty(name: string, value: any, type: AXValueType = 'string'): AXProperty {
		return {
			// eslint-disable-next-line local/code-no-any-casts
			name: name as any,
			value: createAXValue(type, value)
		};
	}

	test('empty tree returns empty string', () => {
		const result = convertAXTreeToMarkdown(testUri, []);
		assert.strictEqual(result, '');
	});

	//#region Heading Tests

	test('simple heading conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				childIds: ['node2'],
				ignored: false,
				role: createAXValue('role', 'heading'),
				name: createAXValue('string', 'Test Heading'),
				properties: [
					createAXProperty('level', 2, 'integer')
				]
			},
			{
				nodeId: 'node2',
				childIds: [],
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Test Heading')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), '## Test Heading');
	});

	//#endregion

	//#region Paragraph Tests

	test('paragraph with text conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'paragraph'),
				childIds: ['node2']
			},
			{
				nodeId: 'node2',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'This is a paragraph of text.')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), 'This is a paragraph of text.');
	});

	test('really long paragraph should insert newlines at the space before 80 characters', () => {
		const longStr = [
			'This is a paragraph of text. It is really long. Like really really really really',
			'really really really really really really really long. That long.'
		];

		const nodes: AXNode[] = [
			{
				nodeId: 'node2',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', longStr.join(' '))
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), longStr.join('\n'));
	});

	//#endregion

	//#region List Tests

	test('list conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'list'),
				childIds: ['node2', 'node3']
			},
			{
				nodeId: 'node2',
				ignored: false,
				role: createAXValue('role', 'listitem'),
				childIds: ['node4', 'node6']
			},
			{
				nodeId: 'node3',
				ignored: false,
				role: createAXValue('role', 'listitem'),
				childIds: ['node5', 'node7']
			},
			{
				nodeId: 'node4',
				ignored: false,
				role: createAXValue('role', 'ListMarker'),
				name: createAXValue('string', '1. ')
			},
			{
				nodeId: 'node5',
				ignored: false,
				role: createAXValue('role', 'ListMarker'),
				name: createAXValue('string', '2. ')
			},
			{
				nodeId: 'node6',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Item 1')
			},
			{
				nodeId: 'node7',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Item 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
1. Item 1
2. Item 2

`;
		assert.strictEqual(result, expected);
	});

	test('nested list conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'list1',
				ignored: false,
				role: createAXValue('role', 'list'),
				childIds: ['item1', 'item2']
			},
			{
				nodeId: 'item1',
				ignored: false,
				role: createAXValue('role', 'listitem'),
				childIds: ['marker1', 'text1', 'nestedList'],
				properties: [
					createAXProperty('level', 1, 'integer')
				]
			},
			{
				nodeId: 'marker1',
				ignored: false,
				role: createAXValue('role', 'ListMarker'),
				name: createAXValue('string', '- ')
			},
			{
				nodeId: 'text1',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Item 1')
			},
			{
				nodeId: 'nestedList',
				ignored: false,
				role: createAXValue('role', 'list'),
				childIds: ['nestedItem']
			},
			{
				nodeId: 'nestedItem',
				ignored: false,
				role: createAXValue('role', 'listitem'),
				childIds: ['nestedMarker', 'nestedText'],
				properties: [
					createAXProperty('level', 2, 'integer')
				]
			},
			{
				nodeId: 'nestedMarker',
				ignored: false,
				role: createAXValue('role', 'ListMarker'),
				name: createAXValue('string', '- ')
			},
			{
				nodeId: 'nestedText',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Item 1a')
			},
			{
				nodeId: 'item2',
				ignored: false,
				role: createAXValue('role', 'listitem'),
				childIds: ['marker2', 'text2'],
				properties: [
					createAXProperty('level', 1, 'integer')
				]
			},
			{
				nodeId: 'marker2',
				ignored: false,
				role: createAXValue('role', 'ListMarker'),
				name: createAXValue('string', '- ')
			},
			{
				nodeId: 'text2',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Item 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const indent = '  ';
		const expected =
			`
- Item 1
${indent}- Item 1a
- Item 2

`;
		assert.strictEqual(result, expected);
	});

	//#endregion

	//#region Links Tests

	test('links conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'paragraph'),
				childIds: ['node2']
			},
			{
				nodeId: 'node2',
				ignored: false,
				role: createAXValue('role', 'link'),
				name: createAXValue('string', 'Test Link'),
				properties: [
					createAXProperty('url', 'https://test.com')
				]
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), '[Test Link](https://test.com)');
	});

	test('links to same page are not converted to markdown links', () => {
		const pageUri = URI.parse('https://example.com/page');
		const nodes: AXNode[] = [
			{
				nodeId: 'link',
				ignored: false,
				role: createAXValue('role', 'link'),
				name: createAXValue('string', 'Current page link'),
				properties: [createAXProperty('url', 'https://example.com/page?section=1#header')]
			}
		];

		const result = convertAXTreeToMarkdown(pageUri, nodes);
		assert.strictEqual(result.includes('Current page link'), true);
		assert.strictEqual(result.includes('[Current page link]'), false);
	});

	//#endregion

	//#region Image Tests

	test('image conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'image'),
				name: createAXValue('string', 'Alt text'),
				properties: [
					createAXProperty('url', 'https://test.com/image.png')
				]
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), '![Alt text](https://test.com/image.png)');
	});

	test('image without URL shows alt text', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'image'),
				name: createAXValue('string', 'Alt text')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.trim(), '[Image: Alt text]');
	});

	//#endregion

	//#region Description List Tests

	test('description list conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'dl',
				ignored: false,
				role: createAXValue('role', 'DescriptionList'),
				childIds: ['term1', 'def1', 'term2', 'def2']
			},
			{
				nodeId: 'term1',
				ignored: false,
				role: createAXValue('role', 'term'),
				childIds: ['termText1']
			},
			{
				nodeId: 'termText1',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Term 1')
			},
			{
				nodeId: 'def1',
				ignored: false,
				role: createAXValue('role', 'definition'),
				childIds: ['defText1']
			},
			{
				nodeId: 'defText1',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Definition 1')
			},
			{
				nodeId: 'term2',
				ignored: false,
				role: createAXValue('role', 'term'),
				childIds: ['termText2']
			},
			{
				nodeId: 'termText2',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Term 2')
			},
			{
				nodeId: 'def2',
				ignored: false,
				role: createAXValue('role', 'definition'),
				childIds: ['defText2']
			},
			{
				nodeId: 'defText2',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'Definition 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.includes('- **Term 1** Definition 1'), true);
		assert.strictEqual(result.includes('- **Term 2** Definition 2'), true);
	});

	//#endregion

	//#region Blockquote Tests

	test('blockquote conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'blockquote'),
				name: createAXValue('string', 'This is a blockquote\nWith multiple lines')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`> This is a blockquote
> With multiple lines`;
		assert.strictEqual(result.trim(), expected);
	});

	//#endregion

	//#region Code Tests

	test('preformatted text conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: createAXValue('role', 'pre'),
				name: createAXValue('string', 'function test() {\n  return true;\n}')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			'```\nfunction test() {\n  return true;\n}\n```';
		assert.strictEqual(result.trim(), expected);
	});

	test('code block conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'code',
				ignored: false,
				role: createAXValue('role', 'code'),
				childIds: ['codeText']
			},
			{
				nodeId: 'codeText',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'const x = 42;\nconsole.log(x);')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.includes('```'), true);
		assert.strictEqual(result.includes('const x = 42;'), true);
		assert.strictEqual(result.includes('console.log(x);'), true);
	});

	test('inline code conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'code',
				ignored: false,
				role: createAXValue('role', 'code'),
				childIds: ['codeText']
			},
			{
				nodeId: 'codeText',
				ignored: false,
				role: createAXValue('role', 'StaticText'),
				name: createAXValue('string', 'const x = 42;')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		assert.strictEqual(result.includes('`const x = 42;`'), true);
	});

	//#endregion

	//#region Table Tests

	test('table conversion', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'table1',
				ignored: false,
				role: createAXValue('role', 'table'),
				childIds: ['row1', 'row2']
			},
			{
				nodeId: 'row1',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['cell1', 'cell2']
			},
			{
				nodeId: 'row2',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['cell3', 'cell4']
			},
			{
				nodeId: 'cell1',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Header 1')
			},
			{
				nodeId: 'cell2',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Header 2')
			},
			{
				nodeId: 'cell3',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 1')
			},
			{
				nodeId: 'cell4',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
| Header 1 | Header 2 |
| --- | --- |
| Data 1 | Data 2 |
`;
		assert.strictEqual(result.trim(), expected.trim());
	});

	test('table with columnheader role (th elements)', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'table1',
				ignored: false,
				role: createAXValue('role', 'table'),
				childIds: ['row1', 'row2']
			},
			{
				nodeId: 'row1',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['header1', 'header2']
			},
			{
				nodeId: 'row2',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['cell3', 'cell4']
			},
			{
				nodeId: 'header1',
				ignored: false,
				role: createAXValue('role', 'columnheader'),
				name: createAXValue('string', 'Header 1')
			},
			{
				nodeId: 'header2',
				ignored: false,
				role: createAXValue('role', 'columnheader'),
				name: createAXValue('string', 'Header 2')
			},
			{
				nodeId: 'cell3',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 1')
			},
			{
				nodeId: 'cell4',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
| Header 1 | Header 2 |
| --- | --- |
| Data 1 | Data 2 |
`;
		assert.strictEqual(result.trim(), expected.trim());
	});

	test('table with rowheader role', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'table1',
				ignored: false,
				role: createAXValue('role', 'table'),
				childIds: ['row1', 'row2']
			},
			{
				nodeId: 'row1',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['rowheader1', 'cell2']
			},
			{
				nodeId: 'row2',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['rowheader2', 'cell4']
			},
			{
				nodeId: 'rowheader1',
				ignored: false,
				role: createAXValue('role', 'rowheader'),
				name: createAXValue('string', 'Row 1')
			},
			{
				nodeId: 'cell2',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 1')
			},
			{
				nodeId: 'rowheader2',
				ignored: false,
				role: createAXValue('role', 'rowheader'),
				name: createAXValue('string', 'Row 2')
			},
			{
				nodeId: 'cell4',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'Data 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
| Row 1 | Data 1 |
| --- | --- |
| Row 2 | Data 2 |
`;
		assert.strictEqual(result.trim(), expected.trim());
	});

	test('table with mixed cell types', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'table1',
				ignored: false,
				role: createAXValue('role', 'table'),
				childIds: ['row1', 'row2', 'row3']
			},
			{
				nodeId: 'row1',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['header1', 'header2', 'header3']
			},
			{
				nodeId: 'row2',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['rowheader1', 'cell2', 'cell3']
			},
			{
				nodeId: 'row3',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['rowheader2', 'cell4', 'cell5']
			},
			{
				nodeId: 'header1',
				ignored: false,
				role: createAXValue('role', 'columnheader'),
				name: createAXValue('string', 'Name')
			},
			{
				nodeId: 'header2',
				ignored: false,
				role: createAXValue('role', 'columnheader'),
				name: createAXValue('string', 'Age')
			},
			{
				nodeId: 'header3',
				ignored: false,
				role: createAXValue('role', 'columnheader'),
				name: createAXValue('string', 'City')
			},
			{
				nodeId: 'rowheader1',
				ignored: false,
				role: createAXValue('role', 'rowheader'),
				name: createAXValue('string', 'John')
			},
			{
				nodeId: 'cell2',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', '25')
			},
			{
				nodeId: 'cell3',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'NYC')
			},
			{
				nodeId: 'rowheader2',
				ignored: false,
				role: createAXValue('role', 'rowheader'),
				name: createAXValue('string', 'Jane')
			},
			{
				nodeId: 'cell4',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', '30')
			},
			{
				nodeId: 'cell5',
				ignored: false,
				role: createAXValue('role', 'cell'),
				name: createAXValue('string', 'LA')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
| Name | Age | City |
| --- | --- | --- |
| John | 25 | NYC |
| Jane | 30 | LA |
`;
		assert.strictEqual(result.trim(), expected.trim());
	});

	test('table with gridcell role', () => {
		const nodes: AXNode[] = [
			{
				nodeId: 'table1',
				ignored: false,
				role: createAXValue('role', 'table'),
				childIds: ['row1', 'row2']
			},
			{
				nodeId: 'row1',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['cell1', 'cell2']
			},
			{
				nodeId: 'row2',
				ignored: false,
				role: createAXValue('role', 'row'),
				childIds: ['cell3', 'cell4']
			},
			{
				nodeId: 'cell1',
				ignored: false,
				role: createAXValue('role', 'gridcell'),
				name: createAXValue('string', 'Header 1')
			},
			{
				nodeId: 'cell2',
				ignored: false,
				role: createAXValue('role', 'gridcell'),
				name: createAXValue('string', 'Header 2')
			},
			{
				nodeId: 'cell3',
				ignored: false,
				role: createAXValue('role', 'gridcell'),
				name: createAXValue('string', 'Data 1')
			},
			{
				nodeId: 'cell4',
				ignored: false,
				role: createAXValue('role', 'gridcell'),
				name: createAXValue('string', 'Data 2')
			}
		];

		const result = convertAXTreeToMarkdown(testUri, nodes);
		const expected =
			`
| Header 1 | Header 2 |
| --- | --- |
| Data 1 | Data 2 |
`;
		assert.strictEqual(result.trim(), expected.trim());
	});

	//#endregion
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/test/electron-main/webContentCache.test.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/test/electron-main/webContentCache.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { WebContentCache } from '../../electron-main/webContentCache.js';
import { WebContentExtractResult } from '../../common/webContentExtractor.js';

suite('WebContentCache', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	let cache: WebContentCache;

	setup(() => {
		cache = new WebContentCache();
	});

	//#region Basic Cache Operations

	test('returns undefined for uncached URI', () => {
		const uri = URI.parse('https://example.com/page');
		const result = cache.tryGet(uri, undefined);
		assert.strictEqual(result, undefined);
	});

	test('returns cached result for previously added URI', () => {
		const uri = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Test content', title: 'Test Title' };

		cache.add(uri, undefined, extractResult);
		const cached = cache.tryGet(uri, undefined);

		assert.deepStrictEqual(cached, extractResult);
	});

	test('returns cached ok result', () => {
		const uri = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Content', title: 'Title' };

		cache.add(uri, undefined, extractResult);
		const cached = cache.tryGet(uri, undefined);

		assert.deepStrictEqual(cached, extractResult);
	});

	test('returns cached redirect result', () => {
		const uri = URI.parse('https://example.com/old');
		const redirectUri = URI.parse('https://example.com/new');
		const extractResult: WebContentExtractResult = { status: 'redirect', toURI: redirectUri };

		cache.add(uri, undefined, extractResult);
		const cached = cache.tryGet(uri, undefined);

		assert.deepStrictEqual(cached, extractResult);
	});

	test('returns cached error result', () => {
		const uri = URI.parse('https://example.com/error');
		const extractResult: WebContentExtractResult = { status: 'error', error: 'Not found', statusCode: 404 };

		cache.add(uri, undefined, extractResult);
		const cached = cache.tryGet(uri, undefined);

		assert.deepStrictEqual(cached, extractResult);
	});

	//#endregion

	//#region Options-Based Cache Key

	test('different options produce different cache entries', () => {
		const uri = URI.parse('https://example.com/page');
		const resultWithRedirects: WebContentExtractResult = { status: 'ok', result: 'With redirects', title: 'Redirects Title' };
		const resultWithoutRedirects: WebContentExtractResult = { status: 'ok', result: 'Without redirects', title: 'No Redirects Title' };

		cache.add(uri, { followRedirects: true }, resultWithRedirects);
		cache.add(uri, { followRedirects: false }, resultWithoutRedirects);

		assert.deepStrictEqual(cache.tryGet(uri, { followRedirects: true }), resultWithRedirects);
		assert.deepStrictEqual(cache.tryGet(uri, { followRedirects: false }), resultWithoutRedirects);
	});

	test('undefined options and followRedirects: false use same cache key', () => {
		const uri = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Content', title: 'Title' };

		cache.add(uri, undefined, extractResult);

		// Both undefined and { followRedirects: false } should resolve to the same key
		// because !!undefined === false and !!false === false
		assert.deepStrictEqual(cache.tryGet(uri, undefined), extractResult);
		assert.deepStrictEqual(cache.tryGet(uri, { followRedirects: false }), extractResult);
	});

	//#endregion

	//#region URI Case Sensitivity

	test('URI path case is ignored for cache lookup', () => {
		const uri1 = URI.parse('https://example.com/Page');
		const uri2 = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Content', title: 'Title' };

		cache.add(uri1, undefined, extractResult);

		// extUriIgnorePathCase should make these equivalent
		assert.deepStrictEqual(cache.tryGet(uri2, undefined), extractResult);
	});

	//#endregion

	//#region Cache Expiration

	test('expired success entries are not returned', () => {
		const uri = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Content', title: 'Title' };

		// Mock Date.now to control expiration
		const originalDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = () => currentTime;

		try {
			cache.add(uri, undefined, extractResult);

			// Move time forward past the 24-hour success cache duration
			currentTime += (1000 * 60 * 60 * 24) + 1; // 24 hours + 1ms

			const cached = cache.tryGet(uri, undefined);
			assert.strictEqual(cached, undefined);
		} finally {
			Date.now = originalDateNow;
		}
	});

	test('expired error entries are not returned', () => {
		const uri = URI.parse('https://example.com/error');
		const extractResult: WebContentExtractResult = { status: 'error', error: 'Server error', statusCode: 500 };

		const originalDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = () => currentTime;

		try {
			cache.add(uri, undefined, extractResult);

			// Move time forward past the 5-minute error cache duration
			currentTime += (1000 * 60 * 5) + 1; // 5 minutes + 1ms

			const cached = cache.tryGet(uri, undefined);
			assert.strictEqual(cached, undefined);
		} finally {
			Date.now = originalDateNow;
		}
	});

	test('non-expired success entries are returned', () => {
		const uri = URI.parse('https://example.com/page');
		const extractResult: WebContentExtractResult = { status: 'ok', result: 'Content', title: 'Title' };

		const originalDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = () => currentTime;

		try {
			cache.add(uri, undefined, extractResult);

			// Move time forward but stay within the 24-hour success cache duration
			currentTime += (1000 * 60 * 60 * 23); // 23 hours

			const cached = cache.tryGet(uri, undefined);
			assert.deepStrictEqual(cached, extractResult);
		} finally {
			Date.now = originalDateNow;
		}
	});

	test('non-expired error entries are returned', () => {
		const uri = URI.parse('https://example.com/error');
		const extractResult: WebContentExtractResult = { status: 'error', error: 'Server error', statusCode: 500 };

		const originalDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = () => currentTime;

		try {
			cache.add(uri, undefined, extractResult);

			// Move time forward but stay within the 5-minute error cache duration
			currentTime += (1000 * 60 * 4); // 4 minutes

			const cached = cache.tryGet(uri, undefined);
			assert.deepStrictEqual(cached, extractResult);
		} finally {
			Date.now = originalDateNow;
		}
	});

	test('redirect results use success cache duration', () => {
		const uri = URI.parse('https://example.com/old');
		const extractResult: WebContentExtractResult = { status: 'redirect', toURI: URI.parse('https://example.com/new') };

		const originalDateNow = Date.now;
		let currentTime = 1000000;
		Date.now = () => currentTime;

		try {
			cache.add(uri, undefined, extractResult);

			// Move time forward past error duration but within success duration
			currentTime += (1000 * 60 * 60); // 1 hour (past 5 min error, within 24 hour success)

			const cached = cache.tryGet(uri, undefined);
			assert.deepStrictEqual(cached, extractResult);
		} finally {
			Date.now = originalDateNow;
		}
	});

	//#endregion

	//#region Cache Overwrite

	test('adding same URI overwrites previous entry', () => {
		const uri = URI.parse('https://example.com/page');
		const firstResult: WebContentExtractResult = { status: 'ok', result: 'First content', title: 'First Title' };
		const secondResult: WebContentExtractResult = { status: 'ok', result: 'Second content', title: 'Second Title' };

		cache.add(uri, undefined, firstResult);
		cache.add(uri, undefined, secondResult);

		const cached = cache.tryGet(uri, undefined);
		assert.deepStrictEqual(cached, secondResult);
	});

	//#endregion

	//#region Different URI Components

	test('different hosts produce different cache entries', () => {
		const uri1 = URI.parse('https://example.com/page');
		const uri2 = URI.parse('https://other.com/page');
		const result1: WebContentExtractResult = { status: 'ok', result: 'Example content', title: 'Example Title' };
		const result2: WebContentExtractResult = { status: 'ok', result: 'Other content', title: 'Other Title' };

		cache.add(uri1, undefined, result1);
		cache.add(uri2, undefined, result2);

		assert.deepStrictEqual(cache.tryGet(uri1, undefined), result1);
		assert.deepStrictEqual(cache.tryGet(uri2, undefined), result2);
	});

	test('different paths produce different cache entries', () => {
		const uri1 = URI.parse('https://example.com/page1');
		const uri2 = URI.parse('https://example.com/page2');
		const result1: WebContentExtractResult = { status: 'ok', result: 'Page 1 content', title: 'Page 1 Title' };
		const result2: WebContentExtractResult = { status: 'ok', result: 'Page 2 content', title: 'Page 2 Title' };

		cache.add(uri1, undefined, result1);
		cache.add(uri2, undefined, result2);

		assert.deepStrictEqual(cache.tryGet(uri1, undefined), result1);
		assert.deepStrictEqual(cache.tryGet(uri2, undefined), result2);
	});

	test('different query strings produce different cache entries', () => {
		const uri1 = URI.parse('https://example.com/page?a=1');
		const uri2 = URI.parse('https://example.com/page?a=2');
		const result1: WebContentExtractResult = { status: 'ok', result: 'Query 1 content', title: 'Query 1 Title' };
		const result2: WebContentExtractResult = { status: 'ok', result: 'Query 2 content', title: 'Query 2 Title' };

		cache.add(uri1, undefined, result1);
		cache.add(uri2, undefined, result2);

		assert.deepStrictEqual(cache.tryGet(uri1, undefined), result1);
		assert.deepStrictEqual(cache.tryGet(uri2, undefined), result2);
	});

	//#endregion
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webContentExtractor/test/electron-main/webPageLoader.test.ts]---
Location: vscode-main/src/vs/platform/webContentExtractor/test/electron-main/webPageLoader.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { NullLogService } from '../../../log/common/log.js';
import { AXNode } from '../../electron-main/cdpAccessibilityDomain.js';
import { WebPageLoader } from '../../electron-main/webPageLoader.js';

interface MockElectronEvent {
	preventDefault?: sinon.SinonStub;
}

class MockWebContents {
	private readonly _listeners = new Map<string, ((...args: unknown[]) => void)[]>();
	public readonly debugger: MockDebugger;
	public loadURL = sinon.stub().resolves();
	public getTitle = sinon.stub().returns('Test Page Title');
	public executeJavaScript = sinon.stub().resolves(undefined);

	public session = {
		webRequest: {
			onBeforeSendHeaders: sinon.stub()
		}
	};

	constructor() {
		this.debugger = new MockDebugger();
	}

	once(event: string, listener: (...args: unknown[]) => void): this {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, []);
		}
		this._listeners.get(event)!.push(listener);
		return this;
	}

	on(event: string, listener: (...args: unknown[]) => void): this {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, []);
		}
		this._listeners.get(event)!.push(listener);
		return this;
	}

	emit(event: string, ...args: unknown[]): void {
		const listeners = this._listeners.get(event) || [];
		for (const listener of listeners) {
			listener(...args);
		}
		this._listeners.delete(event);
	}

	beginFrameSubscription(_onlyDirty: boolean, callback: () => void): void {
		setTimeout(() => callback(), 0);
	}

	endFrameSubscription(): void {
	}
}

class MockDebugger {
	private readonly _listeners = new Map<string, ((...args: unknown[]) => void)[]>();
	public attach = sinon.stub();
	public sendCommand = sinon.stub().resolves({});

	on(event: string, listener: (...args: unknown[]) => void): this {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, []);
		}
		this._listeners.get(event)!.push(listener);
		return this;
	}

	emit(event: string, ...args: unknown[]): void {
		const listeners = this._listeners.get(event) || [];
		for (const listener of listeners) {
			listener(...args);
		}
	}
}

class MockBrowserWindow {
	public readonly webContents: MockWebContents;
	public destroy = sinon.stub();
	public loadURL = sinon.stub().resolves();

	constructor(_options?: Electron.BrowserWindowConstructorOptions) {
		this.webContents = new MockWebContents();
	}
}

suite('WebPageLoader', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let window: MockBrowserWindow;

	teardown(() => {
		sinon.restore();
	});

	function createWebPageLoader(uri: URI, options?: { followRedirects?: boolean }): WebPageLoader {
		const loader = new WebPageLoader((options) => {
			window = new MockBrowserWindow(options);
			// eslint-disable-next-line local/code-no-any-casts
			return window as any;
		}, new NullLogService(), uri, options);
		disposables.add(loader);
		return loader;
	}

	function createMockAXNodes(): AXNode[] {
		return [
			{
				nodeId: 'node1',
				ignored: false,
				role: { type: 'role', value: 'paragraph' },
				childIds: ['node2']
			},
			{
				nodeId: 'node2',
				ignored: false,
				role: { type: 'role', value: 'StaticText' },
				name: { type: 'string', value: 'Test content from page' }
			}
		];
	}

	//#region Basic Loading Tests

	test('successful page load returns ok status with content', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate page load events
		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'ok');
		assert.strictEqual(result.title, 'Test Page Title');
		assert.ok(result.result.includes('Test content from page'));
	}));

	test('page load failure returns error status', async () => {
		const uri = URI.parse('https://example.com/page');

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: createMockAXNodes() });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate page load failure
		const mockEvent: MockElectronEvent = {};
		window.webContents.emit('did-fail-load', mockEvent, -6, 'ERR_CONNECTION_REFUSED');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'error');
		if (result.status === 'error') {
			assert.strictEqual(result.statusCode, -6);
			assert.strictEqual(result.error, 'ERR_CONNECTION_REFUSED');
		}
	});

	test('ERR_ABORTED is ignored and content extraction continues', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate ERR_ABORTED (-3) which should be ignored
		const mockEvent: MockElectronEvent = {};
		window.webContents.emit('did-fail-load', mockEvent, -3, 'ERR_ABORTED');

		const result = await loadPromise;

		// ERR_ABORTED should not cause an error status, content should be extracted
		assert.strictEqual(result.status, 'ok');
		if (result.status === 'ok') {
			assert.ok(result.result.includes('Test content from page'));
		}
	}));

	//#endregion

	//#region Redirect Tests

	test('redirect to different authority returns redirect status when followRedirects is false', async () => {
		const uri = URI.parse('https://example.com/page');
		const redirectUrl = 'https://other-domain.com/redirected';

		const loader = createWebPageLoader(uri, { followRedirects: false });

		window.webContents.debugger.sendCommand.resolves({});

		const loadPromise = loader.load();

		// Simulate redirect to different authority
		const mockEvent: MockElectronEvent = {
			preventDefault: sinon.stub()
		};
		window.webContents.emit('will-redirect', mockEvent, redirectUrl);

		const result = await loadPromise;

		assert.strictEqual(result.status, 'redirect');
		if (result.status === 'redirect') {
			assert.strictEqual(result.toURI.authority, 'other-domain.com');
		}
		assert.ok((mockEvent.preventDefault!).called);
	});

	test('redirect to same authority is not treated as redirect', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const redirectUrl = 'https://example.com/other-page';
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri, { followRedirects: false });

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate redirect to same authority
		const mockEvent: MockElectronEvent = {
			preventDefault: sinon.stub()
		};
		window.webContents.emit('will-redirect', mockEvent, redirectUrl);

		// Should not prevent default for same-authority redirects
		assert.ok(!(mockEvent.preventDefault!).called);

		// Continue with normal load
		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;
		assert.strictEqual(result.status, 'ok');
	}));

	test('redirect is followed when followRedirects option is true', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const redirectUrl = 'https://other-domain.com/redirected';
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri, { followRedirects: true });

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate redirect
		const mockEvent: MockElectronEvent = {
			preventDefault: sinon.stub()
		};
		window.webContents.emit('will-redirect', mockEvent, redirectUrl);

		// Should not prevent default when followRedirects is true
		assert.ok(!(mockEvent.preventDefault!).called);

		// Continue with normal load after redirect
		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;
		assert.strictEqual(result.status, 'ok');
	}));

	//#endregion

	//#region HTTP Error Tests

	test('HTTP error status code returns error with content', async () => {
		const uri = URI.parse('https://example.com/not-found');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate network response with error status
		const mockEvent: MockElectronEvent = {};
		window.webContents.debugger.emit('message', mockEvent, 'Network.responseReceived', {
			requestId: 'req1',
			type: 'Document',
			response: {
				status: 404,
				statusText: 'Not Found'
			}
		});

		const result = await loadPromise;

		assert.strictEqual(result.status, 'error');
		if (result.status === 'error') {
			assert.strictEqual(result.statusCode, 404);
			assert.strictEqual(result.error, 'Not Found');
		}
	});

	test('HTTP 500 error returns server error status', async () => {
		const uri = URI.parse('https://example.com/server-error');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate network response with 500 status
		const mockEvent: MockElectronEvent = {};
		window.webContents.debugger.emit('message', mockEvent, 'Network.responseReceived', {
			requestId: 'req1',
			type: 'Document',
			response: {
				status: 500,
				statusText: 'Internal Server Error'
			}
		});

		const result = await loadPromise;

		assert.strictEqual(result.status, 'error');
		if (result.status === 'error') {
			assert.strictEqual(result.statusCode, 500);
			assert.strictEqual(result.error, 'Internal Server Error');
		}
	});

	test('HTTP error without status text uses fallback message', async () => {
		const uri = URI.parse('https://example.com/error');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate network response without status text
		const mockEvent: MockElectronEvent = {};
		window.webContents.debugger.emit('message', mockEvent, 'Network.responseReceived', {
			requestId: 'req1',
			type: 'Document',
			response: {
				status: 503
			}
		});

		const result = await loadPromise;

		assert.strictEqual(result.status, 'error');
		if (result.status === 'error') {
			assert.strictEqual(result.statusCode, 503);
			assert.strictEqual(result.error, 'HTTP error 503');
		}
	});

	//#endregion

	//#region Network Request Tracking Tests

	test('tracks network requests and waits for completion', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate page starting to load
		window.webContents.emit('did-start-loading');

		// Simulate network requests
		const mockEvent: MockElectronEvent = {};
		window.webContents.debugger.emit('message', mockEvent, 'Network.requestWillBeSent', {
			requestId: 'req1'
		});
		window.webContents.debugger.emit('message', mockEvent, 'Network.requestWillBeSent', {
			requestId: 'req2'
		});

		// Simulate page finish load (but network requests still pending)
		window.webContents.emit('did-finish-load');

		// Simulate network requests completing
		window.webContents.debugger.emit('message', mockEvent, 'Network.loadingFinished', {
			requestId: 'req1'
		});
		window.webContents.debugger.emit('message', mockEvent, 'Network.loadingFinished', {
			requestId: 'req2'
		});

		const result = await loadPromise;

		assert.strictEqual(result.status, 'ok');
	}));

	test('handles network request failures gracefully', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const axNodes = createMockAXNodes();

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		// Simulate page load
		window.webContents.emit('did-start-loading');

		// Simulate a network request that fails
		const mockEvent: MockElectronEvent = {};
		window.webContents.debugger.emit('message', mockEvent, 'Network.requestWillBeSent', {
			requestId: 'req1'
		});
		window.webContents.debugger.emit('message', mockEvent, 'Network.loadingFailed', {
			requestId: 'req1'
		});

		window.webContents.emit('did-finish-load');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'ok');
	}));

	//#endregion

	//#region Accessibility Tree Extraction Tests

	test('extracts content from accessibility tree', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		const axNodes: AXNode[] = [
			{
				nodeId: 'heading1',
				ignored: false,
				role: { type: 'role', value: 'heading' },
				name: { type: 'string', value: 'Page Title' },
				properties: [{ name: 'level', value: { type: 'integer', value: 1 } }],
				childIds: ['text1']
			},
			{
				nodeId: 'text1',
				ignored: false,
				role: { type: 'role', value: 'StaticText' },
				name: { type: 'string', value: 'Page Title' }
			}
		];

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: axNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'ok');
		if (result.status === 'ok') {
			assert.ok(result.result.includes('# Page Title'));
		}
	}));

	test('falls back to DOM extraction when accessibility tree yields insufficient content', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');
		// Create AX tree with very short content (less than MIN_CONTENT_LENGTH)
		const shortAXNodes: AXNode[] = [
			{
				nodeId: 'node1',
				ignored: false,
				role: { type: 'role', value: 'StaticText' },
				name: { type: 'string', value: 'Short' }
			}
		];

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: shortAXNodes });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		// Mock DOM extraction returning longer content
		const domContent = 'This is much longer content extracted from the DOM that exceeds the minimum content length requirement and should be used instead of the short accessibility tree content.';
		window.webContents.executeJavaScript.resolves(domContent);

		const loadPromise = loader.load();

		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'ok');
		if (result.status === 'ok') {
			assert.strictEqual(result.result, domContent);
		}
		// Verify executeJavaScript was called for DOM extraction
		assert.ok(window.webContents.executeJavaScript.called);
	}));

	test('returns error when both accessibility tree and DOM extraction yield no content', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/empty-page');

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					// Return empty accessibility tree
					return Promise.resolve({ nodes: [] });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		// Mock DOM extraction returning undefined (no content)
		window.webContents.executeJavaScript.resolves(undefined);

		const loadPromise = loader.load();

		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		const result = await loadPromise;

		assert.strictEqual(result.status, 'error');
		if (result.status === 'error') {
			assert.ok(result.error.includes('Failed to extract meaningful content'));
		}
		// Verify both extraction methods were attempted
		assert.ok(window.webContents.executeJavaScript.called);
	}));

	//#endregion

	//#region Header Modification Tests

	test('onBeforeSendHeaders adds browser headers for navigation', () => {
		createWebPageLoader(URI.parse('https://example.com/page'));

		// Get the callback passed to onBeforeSendHeaders
		assert.ok(window.webContents.session.webRequest.onBeforeSendHeaders.called);
		const callback = window.webContents.session.webRequest.onBeforeSendHeaders.getCall(0).args[0];

		// Mock callback function
		let modifiedHeaders: Record<string, string> | undefined;
		const mockCallback = (details: { requestHeaders: Record<string, string> }) => {
			modifiedHeaders = details.requestHeaders;
		};

		// Simulate a request to the same domain
		callback(
			{
				url: 'https://example.com/page',
				requestHeaders: {
					'TestHeader': 'TestValue'
				}
			},
			mockCallback
		);

		// Verify headers were added
		assert.ok(modifiedHeaders);
		assert.strictEqual(modifiedHeaders['DNT'], '1');
		assert.strictEqual(modifiedHeaders['Sec-GPC'], '1');
		assert.strictEqual(modifiedHeaders['TestHeader'], 'TestValue');
	});

	//#endregion

	//#region Disposal Tests

	test('disposes resources after load completes', () => runWithFakedTimers({ useFakeTimers: true }, async () => {
		const uri = URI.parse('https://example.com/page');

		const loader = createWebPageLoader(uri);

		window.webContents.debugger.sendCommand.callsFake((command: string) => {
			switch (command) {
				case 'Network.enable':
					return Promise.resolve();
				case 'Accessibility.getFullAXTree':
					return Promise.resolve({ nodes: createMockAXNodes() });
				default:
					assert.fail(`Unexpected command: ${command}`);
			}
		});

		const loadPromise = loader.load();

		window.webContents.emit('did-start-loading');
		window.webContents.emit('did-finish-load');

		await loadPromise;

		// The loader should call destroy on the window when disposed
		assert.ok(window.destroy.called);
	}));

	//#endregion
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webview/common/mimeTypes.ts]---
Location: vscode-main/src/vs/platform/webview/common/mimeTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getMediaMime, Mimes } from '../../../base/common/mime.js';
import { extname } from '../../../base/common/path.js';
import { URI } from '../../../base/common/uri.js';

const webviewMimeTypes = new Map([
	['.svg', 'image/svg+xml'],
	['.txt', Mimes.text],
	['.css', 'text/css'],
	['.js', 'application/javascript'],
	['.cjs', 'application/javascript'],
	['.mjs', 'application/javascript'],
	['.json', 'application/json'],
	['.html', 'text/html'],
	['.htm', 'text/html'],
	['.xhtml', 'application/xhtml+xml'],
	['.oft', 'font/otf'],
	['.xml', 'application/xml'],
	['.wasm', 'application/wasm'],
]);

export function getWebviewContentMimeType(resource: URI): string {
	const ext = extname(resource.fsPath).toLowerCase();
	return webviewMimeTypes.get(ext) || getMediaMime(resource.fsPath) || Mimes.unknown;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webview/common/webviewManagerService.ts]---
Location: vscode-main/src/vs/platform/webview/common/webviewManagerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IWebviewManagerService = createDecorator<IWebviewManagerService>('webviewManagerService');

export interface WebviewWebContentsId {
	readonly webContentsId: number;
}

export interface WebviewWindowId {
	readonly windowId: number;
}

export interface FindInFrameOptions {
	readonly forward?: boolean;
	readonly findNext?: boolean;
	readonly matchCase?: boolean;
}

export interface FoundInFrameResult {
	readonly requestId: number;
	readonly activeMatchOrdinal: number;
	readonly matches: number;
	readonly finalUpdate: boolean;
}

export interface IWebviewManagerService {
	_serviceBrand: unknown;

	readonly onFoundInFrame: Event<FoundInFrameResult>;

	setIgnoreMenuShortcuts(id: WebviewWebContentsId | WebviewWindowId, enabled: boolean): Promise<void>;

	findInFrame(windowId: WebviewWindowId, frameName: string, text: string, options: FindInFrameOptions): Promise<void>;

	stopFindInFrame(windowId: WebviewWindowId, frameName: string, options: { keepSelection?: boolean }): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webview/common/webviewPortMapping.ts]---
Location: vscode-main/src/vs/platform/webview/common/webviewPortMapping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IAddress } from '../../remote/common/remoteAgentConnection.js';
import { extractLocalHostUriMetaDataForPortMapping, ITunnelService, RemoteTunnel } from '../../tunnel/common/tunnel.js';

export interface IWebviewPortMapping {
	readonly webviewPort: number;
	readonly extensionHostPort: number;
}

/**
 * Manages port mappings for a single webview.
 */
export class WebviewPortMappingManager implements IDisposable {

	private readonly _tunnels = new Map<number, RemoteTunnel>();

	constructor(
		private readonly _getExtensionLocation: () => URI | undefined,
		private readonly _getMappings: () => readonly IWebviewPortMapping[],
		private readonly tunnelService: ITunnelService
	) { }

	public async getRedirect(resolveAuthority: IAddress | null | undefined, url: string): Promise<string | undefined> {
		const uri = URI.parse(url);
		const requestLocalHostInfo = extractLocalHostUriMetaDataForPortMapping(uri);
		if (!requestLocalHostInfo) {
			return undefined;
		}

		for (const mapping of this._getMappings()) {
			if (mapping.webviewPort === requestLocalHostInfo.port) {
				const extensionLocation = this._getExtensionLocation();
				if (extensionLocation && extensionLocation.scheme === Schemas.vscodeRemote) {
					const tunnel = resolveAuthority && await this.getOrCreateTunnel(resolveAuthority, mapping.extensionHostPort);
					if (tunnel) {
						if (tunnel.tunnelLocalPort === mapping.webviewPort) {
							return undefined;
						}
						return encodeURI(uri.with({
							authority: `127.0.0.1:${tunnel.tunnelLocalPort}`,
						}).toString(true));
					}
				}

				if (mapping.webviewPort !== mapping.extensionHostPort) {
					return encodeURI(uri.with({
						authority: `${requestLocalHostInfo.address}:${mapping.extensionHostPort}`
					}).toString(true));
				}
			}
		}

		return undefined;
	}

	async dispose() {
		for (const tunnel of this._tunnels.values()) {
			await tunnel.dispose();
		}
		this._tunnels.clear();
	}

	private async getOrCreateTunnel(remoteAuthority: IAddress, remotePort: number): Promise<RemoteTunnel | undefined> {
		const existing = this._tunnels.get(remotePort);
		if (existing) {
			return existing;
		}
		const tunnelOrError = await this.tunnelService.openTunnel({ getAddress: async () => remoteAuthority }, undefined, remotePort);
		let tunnel: RemoteTunnel | undefined;
		if (typeof tunnelOrError === 'string') {
			tunnel = undefined;
		}
		if (tunnel) {
			this._tunnels.set(remotePort, tunnel);
		}
		return tunnel;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webview/electron-main/webviewMainService.ts]---
Location: vscode-main/src/vs/platform/webview/electron-main/webviewMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WebContents, webContents, WebFrameMain } from 'electron';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { FindInFrameOptions, FoundInFrameResult, IWebviewManagerService, WebviewWebContentsId, WebviewWindowId } from '../common/webviewManagerService.js';
import { WebviewProtocolProvider } from './webviewProtocolProvider.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { IFileService } from '../../files/common/files.js';

export class WebviewMainService extends Disposable implements IWebviewManagerService {

	declare readonly _serviceBrand: undefined;

	private readonly _onFoundInFrame = this._register(new Emitter<FoundInFrameResult>());
	public readonly onFoundInFrame = this._onFoundInFrame.event;

	constructor(
		@IFileService fileService: IFileService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
	) {
		super();
		this._register(new WebviewProtocolProvider(fileService));
	}

	public async setIgnoreMenuShortcuts(id: WebviewWebContentsId | WebviewWindowId, enabled: boolean): Promise<void> {
		let contents: WebContents | undefined;

		if (typeof (id as WebviewWindowId).windowId === 'number') {
			const { windowId } = (id as WebviewWindowId);
			const window = this.windowsMainService.getWindowById(windowId);
			if (!window?.win) {
				throw new Error(`Invalid windowId: ${windowId}`);
			}
			contents = window.win.webContents;
		} else {
			const { webContentsId } = (id as WebviewWebContentsId);
			contents = webContents.fromId(webContentsId);
			if (!contents) {
				throw new Error(`Invalid webContentsId: ${webContentsId}`);
			}
		}

		if (!contents.isDestroyed()) {
			contents.setIgnoreMenuShortcuts(enabled);
		}
	}

	public async findInFrame(windowId: WebviewWindowId, frameName: string, text: string, options: { findNext?: boolean; forward?: boolean }): Promise<void> {
		const initialFrame = this.getFrameByName(windowId, frameName);

		type WebFrameMainWithFindSupport = WebFrameMain & {
			findInFrame?(text: string, findOptions: FindInFrameOptions): void;
			on(event: 'found-in-frame', listener: Function): WebFrameMain;
			removeListener(event: 'found-in-frame', listener: Function): WebFrameMain;
		};
		const frame = initialFrame as unknown as WebFrameMainWithFindSupport;
		if (typeof frame.findInFrame === 'function') {
			frame.findInFrame(text, {
				findNext: options.findNext,
				forward: options.forward,
			});
			const foundInFrameHandler = (_: unknown, result: FoundInFrameResult) => {
				if (result.finalUpdate) {
					this._onFoundInFrame.fire(result);
					frame.removeListener('found-in-frame', foundInFrameHandler);
				}
			};
			frame.on('found-in-frame', foundInFrameHandler);
		}
	}

	public async stopFindInFrame(windowId: WebviewWindowId, frameName: string, options: { keepSelection?: boolean }): Promise<void> {
		const initialFrame = this.getFrameByName(windowId, frameName);

		type WebFrameMainWithFindSupport = WebFrameMain & {
			stopFindInFrame?(stopOption: 'keepSelection' | 'clearSelection'): void;
		};

		const frame = initialFrame as unknown as WebFrameMainWithFindSupport;
		if (typeof frame.stopFindInFrame === 'function') {
			frame.stopFindInFrame(options.keepSelection ? 'keepSelection' : 'clearSelection');
		}
	}

	private getFrameByName(windowId: WebviewWindowId, frameName: string): WebFrameMain {
		const window = this.windowsMainService.getWindowById(windowId.windowId);
		if (!window?.win) {
			throw new Error(`Invalid windowId: ${windowId}`);
		}
		const frame = window.win.webContents.mainFrame.framesInSubtree.find(frame => {
			return frame.name === frameName;
		});
		if (!frame) {
			throw new Error(`Unknown frame: ${frameName}`);
		}
		return frame;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webview/electron-main/webviewProtocolProvider.ts]---
Location: vscode-main/src/vs/platform/webview/electron-main/webviewProtocolProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { protocol } from 'electron';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { AppResourcePath, COI, FileAccess, Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IFileService } from '../../files/common/files.js';


export class WebviewProtocolProvider implements IDisposable {

	private static validWebviewFilePaths = new Map<string, { readonly mime: string }>([
		['/index.html', { mime: 'text/html' }],
		['/fake.html', { mime: 'text/html' }],
		['/service-worker.js', { mime: 'application/javascript' }],
	]);

	constructor(
		@IFileService private readonly _fileService: IFileService
	) {
		// Register the protocol for loading webview html
		const webviewHandler = this.handleWebviewRequest.bind(this);
		protocol.handle(Schemas.vscodeWebview, webviewHandler);
	}

	dispose(): void {
		protocol.unhandle(Schemas.vscodeWebview);
	}

	private async handleWebviewRequest(request: GlobalRequest): Promise<GlobalResponse> {
		try {
			const uri = URI.parse(request.url);
			const entry = WebviewProtocolProvider.validWebviewFilePaths.get(uri.path);
			if (entry) {
				const relativeResourcePath: AppResourcePath = `vs/workbench/contrib/webview/browser/pre${uri.path}`;
				const url = FileAccess.asFileUri(relativeResourcePath);

				const content = await this._fileService.readFile(url);
				return new Response(content.value.buffer.buffer as ArrayBuffer, {
					headers: {
						'Content-Type': entry.mime,
						...COI.getHeadersFromQuery(request.url),
						'Cross-Origin-Resource-Policy': 'cross-origin',
					}
				});
			} else {
				return new Response(null, { status: 403 });
			}
		} catch {
			// noop
		}
		return new Response(null, { status: 500 });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webWorker/browser/webWorkerDescriptor.ts]---
Location: vscode-main/src/vs/platform/webWorker/browser/webWorkerDescriptor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';

export class WebWorkerDescriptor {
	public readonly esmModuleLocation: URI | (() => URI) | undefined;
	public readonly esmModuleLocationBundler: URL | (() => URL) | undefined;
	public readonly label: string;

	constructor(args: {
		/** The location of the esm module after transpilation */
		esmModuleLocation?: URI | (() => URI);
		/** The location of the esm module when used in a bundler environment. Refer to the typescript file in the src folder and use `?workerModule`. */
		esmModuleLocationBundler?: URL | (() => URL);
		label: string;
	}) {
		this.esmModuleLocation = args.esmModuleLocation;
		this.esmModuleLocationBundler = args.esmModuleLocationBundler;
		this.label = args.label;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webWorker/browser/webWorkerService.ts]---
Location: vscode-main/src/vs/platform/webWorker/browser/webWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWebWorkerClient } from '../../../base/common/worker/webWorker.js';
import { WebWorkerDescriptor } from './webWorkerDescriptor.js';

export const IWebWorkerService = createDecorator<IWebWorkerService>('IWebWorkerService');

export interface IWebWorkerService {
	readonly _serviceBrand: undefined;

	createWorkerClient<T extends object>(workerDescriptor: WebWorkerDescriptor | Worker | Promise<Worker>): IWebWorkerClient<T>;

	getWorkerUrl(descriptor: WebWorkerDescriptor): string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/webWorker/browser/webWorkerServiceImpl.ts]---
Location: vscode-main/src/vs/platform/webWorker/browser/webWorkerServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../base/browser/trustedTypes.js';
import { coalesce } from '../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { COI } from '../../../base/common/network.js';
import { IWebWorker, IWebWorkerClient, Message, WebWorkerClient } from '../../../base/common/worker/webWorker.js';
import { getNLSLanguage, getNLSMessages } from '../../../nls.js';
import { WebWorkerDescriptor } from './webWorkerDescriptor.js';
import { IWebWorkerService } from './webWorkerService.js';

export class WebWorkerService implements IWebWorkerService {
	private static _workerIdPool: number = 0;
	declare readonly _serviceBrand: undefined;

	createWorkerClient<T extends object>(workerDescriptor: WebWorkerDescriptor | Worker | Promise<Worker>): IWebWorkerClient<T> {
		let worker: Worker | Promise<Worker>;
		const id = ++WebWorkerService._workerIdPool;
		if (workerDescriptor instanceof Worker || isPromiseLike<Worker>(workerDescriptor)) {
			worker = Promise.resolve(workerDescriptor);
		} else {
			worker = this._createWorker(workerDescriptor);
		}

		return new WebWorkerClient<T>(new WebWorker(worker, id));
	}

	protected _createWorker(descriptor: WebWorkerDescriptor): Promise<Worker> {
		const workerRunnerUrl = this.getWorkerUrl(descriptor);

		const workerUrlWithNls = getWorkerBootstrapUrl(descriptor.label, workerRunnerUrl);
		const worker = new Worker(ttPolicy ? ttPolicy.createScriptURL(workerUrlWithNls) as unknown as string : workerUrlWithNls, { name: descriptor.label, type: 'module' });
		return whenESMWorkerReady(worker);
	}

	getWorkerUrl(descriptor: WebWorkerDescriptor): string {
		if (!descriptor.esmModuleLocation) {
			throw new Error('Missing esmModuleLocation in WebWorkerDescriptor');
		}
		const uri = typeof descriptor.esmModuleLocation === 'function' ? descriptor.esmModuleLocation() : descriptor.esmModuleLocation;
		const urlStr = uri.toString(true);
		return urlStr;
	}
}

const ttPolicy = ((): ReturnType<typeof createTrustedTypesPolicy> => {
	type WorkerGlobalWithPolicy = typeof globalThis & {
		workerttPolicy?: ReturnType<typeof createTrustedTypesPolicy>;
	};

	// Reuse the trusted types policy defined from worker bootstrap
	// when available.
	// Refs https://github.com/microsoft/vscode/issues/222193
	const workerGlobalThis = globalThis as WorkerGlobalWithPolicy;
	if (typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope' && workerGlobalThis.workerttPolicy !== undefined) {
		return workerGlobalThis.workerttPolicy;
	} else {
		return createTrustedTypesPolicy('defaultWorkerFactory', { createScriptURL: value => value });
	}
})();

export function createBlobWorker(blobUrl: string, options?: WorkerOptions): Worker {
	if (!blobUrl.startsWith('blob:')) {
		throw new URIError('Not a blob-url: ' + blobUrl);
	}
	return new Worker(ttPolicy ? ttPolicy.createScriptURL(blobUrl) as unknown as string : blobUrl, { ...options, type: 'module' });
}

function getWorkerBootstrapUrl(label: string, workerScriptUrl: string): string {
	if (/^((http:)|(https:)|(file:))/.test(workerScriptUrl) && workerScriptUrl.substring(0, globalThis.origin.length) !== globalThis.origin) {
		// this is the cross-origin case
		// i.e. the webpage is running at a different origin than where the scripts are loaded from
	} else {
		const start = workerScriptUrl.lastIndexOf('?');
		const end = workerScriptUrl.lastIndexOf('#', start);
		const params = start > 0
			? new URLSearchParams(workerScriptUrl.substring(start + 1, ~end ? end : undefined))
			: new URLSearchParams();

		COI.addSearchParam(params, true, true);
		const search = params.toString();
		if (!search) {
			workerScriptUrl = `${workerScriptUrl}#${label}`;
		} else {
			workerScriptUrl = `${workerScriptUrl}?${params.toString()}#${label}`;
		}
	}

	// In below blob code, we are using JSON.stringify to ensure the passed
	// in values are not breaking our script. The values may contain string
	// terminating characters (such as ' or ").
	const blob = new Blob([coalesce([
		`/*${label}*/`,
		`globalThis._VSCODE_NLS_MESSAGES = ${JSON.stringify(getNLSMessages())};`,
		`globalThis._VSCODE_NLS_LANGUAGE = ${JSON.stringify(getNLSLanguage())};`,
		`globalThis._VSCODE_FILE_ROOT = ${JSON.stringify(globalThis._VSCODE_FILE_ROOT)};`,
		`const ttPolicy = globalThis.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });`,
		`globalThis.workerttPolicy = ttPolicy;`,
		`await import(ttPolicy?.createScriptURL(${JSON.stringify(workerScriptUrl)}) ?? ${JSON.stringify(workerScriptUrl)});`,
		`globalThis.postMessage({ type: 'vscode-worker-ready' });`,
		`/*${label}*/`
	]).join('')], { type: 'application/javascript' });
	return URL.createObjectURL(blob);
}

function whenESMWorkerReady(worker: Worker): Promise<Worker> {
	return new Promise<Worker>((resolve, reject) => {
		worker.onmessage = function (e) {
			if (e.data.type === 'vscode-worker-ready') {
				worker.onmessage = null;
				resolve(worker);
			}
		};
		worker.onerror = reject;
	});
}

function isPromiseLike<T>(obj: unknown): obj is PromiseLike<T> {
	return !!obj && typeof (obj as PromiseLike<T>).then === 'function';
}

export class WebWorker extends Disposable implements IWebWorker {
	private readonly id: number;
	private worker: Promise<Worker> | null;

	private readonly _onMessage = this._register(new Emitter<Message>());
	public readonly onMessage = this._onMessage.event;

	private readonly _onError = this._register(new Emitter<MessageEvent | ErrorEvent>());
	public readonly onError = this._onError.event;

	constructor(worker: Promise<Worker>, id: number) {
		super();
		this.id = id;
		this.worker = worker;
		this.postMessage('-please-ignore-', []); // TODO: Eliminate this extra message
		const errorHandler = (ev: ErrorEvent) => {
			this._onError.fire(ev);
		};
		this.worker.then((w) => {
			w.onmessage = (ev) => {
				this._onMessage.fire(ev.data);
			};
			w.onmessageerror = (ev) => {
				this._onError.fire(ev);
			};
			if (typeof w.addEventListener === 'function') {
				w.addEventListener('error', errorHandler);
			}
		});
		this._register(toDisposable(() => {
			this.worker?.then(w => {
				w.onmessage = null;
				w.onmessageerror = null;
				w.removeEventListener('error', errorHandler);
				w.terminate();
			});
			this.worker = null;
		}));
	}

	public getId(): number {
		return this.id;
	}

	public postMessage(message: unknown, transfer: Transferable[]): void {
		this.worker?.then(w => {
			try {
				w.postMessage(message, transfer);
			} catch (err) {
				onUnexpectedError(err);
				onUnexpectedError(new Error(`FAILED to post message to worker`, { cause: err }));
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/window/common/window.ts]---
Location: vscode-main/src/vs/platform/window/common/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { PerformanceMark } from '../../../base/common/performance.js';
import { isMacintosh, isNative, isWeb } from '../../../base/common/platform.js';
import { URI, UriComponents, UriDto } from '../../../base/common/uri.js';
import { ISandboxConfiguration } from '../../../base/parts/sandbox/common/sandboxTypes.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEditorOptions } from '../../editor/common/editor.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { FileType } from '../../files/common/files.js';
import { ILoggerResource, LogLevel } from '../../log/common/log.js';
import { PolicyDefinition, PolicyValue } from '../../policy/common/policy.js';
import { IPartsSplash } from '../../theme/common/themeService.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { IAnyWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export const WindowMinimumSize = {
	WIDTH: 400,
	WIDTH_WITH_VERTICAL_PANEL: 600,
	HEIGHT: 270
};

export interface IPoint {
	readonly x: number;
	readonly y: number;
}

export interface IRectangle extends IPoint {
	readonly width: number;
	readonly height: number;
}

export interface IBaseOpenWindowsOptions {

	/**
	 * Whether to reuse the window or open a new one.
	 */
	readonly forceReuseWindow?: boolean;

	/**
	 * The remote authority to use when windows are opened with either
	 * - no workspace (empty window)
	 * - a workspace that is neither `file://` nor `vscode-remote://`
	 * Use 'null' for a local window.
	 * If not set, defaults to the remote authority of the current window.
	 */
	readonly remoteAuthority?: string | null;

	readonly forceProfile?: string;
	readonly forceTempProfile?: boolean;
}

export interface IOpenWindowOptions extends IBaseOpenWindowsOptions {
	readonly forceNewWindow?: boolean;
	readonly preferNewWindow?: boolean;

	readonly noRecentEntry?: boolean;

	readonly addMode?: boolean;
	readonly removeMode?: boolean;

	readonly diffMode?: boolean;
	readonly mergeMode?: boolean;
	readonly gotoLineMode?: boolean;

	readonly waitMarkerFileURI?: URI;
}

export interface IAddRemoveFoldersRequest {
	readonly foldersToAdd: UriComponents[];
	readonly foldersToRemove: UriComponents[];
}

interface IOpenedWindow {
	readonly id: number;
	readonly title: string;
	readonly filename?: string;
}

export interface IOpenedMainWindow extends IOpenedWindow {
	readonly workspace?: IAnyWorkspaceIdentifier;
	readonly dirty: boolean;
}

export interface IOpenedAuxiliaryWindow extends IOpenedWindow {
	readonly parentId: number;
}

export function isOpenedAuxiliaryWindow(candidate: IOpenedMainWindow | IOpenedAuxiliaryWindow): candidate is IOpenedAuxiliaryWindow {
	return typeof (candidate as IOpenedAuxiliaryWindow).parentId === 'number';
}

export interface IOpenEmptyWindowOptions extends IBaseOpenWindowsOptions { }

export type IWindowOpenable = IWorkspaceToOpen | IFolderToOpen | IFileToOpen;

export interface IBaseWindowOpenable {
	label?: string;
}

export interface IWorkspaceToOpen extends IBaseWindowOpenable {
	readonly workspaceUri: URI;
}

export interface IFolderToOpen extends IBaseWindowOpenable {
	readonly folderUri: URI;
}

export interface IFileToOpen extends IBaseWindowOpenable {
	readonly fileUri: URI;
}

export function isWorkspaceToOpen(uriToOpen: IWindowOpenable): uriToOpen is IWorkspaceToOpen {
	return !!(uriToOpen as IWorkspaceToOpen).workspaceUri;
}

export function isFolderToOpen(uriToOpen: IWindowOpenable): uriToOpen is IFolderToOpen {
	return !!(uriToOpen as IFolderToOpen).folderUri;
}

export function isFileToOpen(uriToOpen: IWindowOpenable): uriToOpen is IFileToOpen {
	return !!(uriToOpen as IFileToOpen).fileUri;
}

export const enum MenuSettings {
	MenuStyle = 'window.menuStyle',
	MenuBarVisibility = 'window.menuBarVisibility'
}

export const enum MenuStyleConfiguration {
	CUSTOM = 'custom',
	NATIVE = 'native',
	INHERIT = 'inherit',
}

export function hasNativeContextMenu(configurationService: IConfigurationService, titleBarStyle?: TitlebarStyle): boolean {
	if (isWeb) {
		return false;
	}

	const nativeTitle = hasNativeTitlebar(configurationService, titleBarStyle);
	const windowConfigurations = configurationService.getValue<IWindowSettings | undefined>('window');

	if (windowConfigurations?.menuStyle === MenuStyleConfiguration.NATIVE) {
		// Do not support native menu with custom title bar
		if (!isMacintosh && !nativeTitle) {
			return false;
		}
		return true;
	}

	if (windowConfigurations?.menuStyle === MenuStyleConfiguration.CUSTOM) {
		return false;
	}

	return nativeTitle; // Default to inherit from title bar style
}

export function hasNativeMenu(configurationService: IConfigurationService, titleBarStyle?: TitlebarStyle): boolean {
	if (isWeb) {
		return false;
	}

	if (isMacintosh) {
		return true;
	}

	return hasNativeContextMenu(configurationService, titleBarStyle);
}

export type MenuBarVisibility = 'classic' | 'visible' | 'toggle' | 'hidden' | 'compact';

export function getMenuBarVisibility(configurationService: IConfigurationService): MenuBarVisibility {
	const menuBarVisibility = configurationService.getValue<MenuBarVisibility | 'default'>(MenuSettings.MenuBarVisibility);

	if (menuBarVisibility === 'default' || (menuBarVisibility === 'compact' && hasNativeMenu(configurationService)) || (isMacintosh && isNative)) {
		return 'classic';
	} else {
		return menuBarVisibility;
	}
}

export interface IWindowsConfiguration {
	readonly window: IWindowSettings;
}

export interface IWindowSettings {
	readonly openFilesInNewWindow: 'on' | 'off' | 'default';
	readonly openFoldersInNewWindow: 'on' | 'off' | 'default';
	readonly openWithoutArgumentsInNewWindow: 'on' | 'off';
	readonly restoreWindows: 'preserve' | 'all' | 'folders' | 'one' | 'none';
	readonly restoreFullscreen: boolean;
	readonly zoomLevel: number;
	readonly titleBarStyle: TitlebarStyle;
	readonly controlsStyle: WindowControlsStyle;
	readonly menuStyle: MenuStyleConfiguration;
	readonly autoDetectHighContrast: boolean;
	readonly autoDetectColorScheme: boolean;
	readonly menuBarVisibility: MenuBarVisibility;
	readonly newWindowDimensions: 'default' | 'inherit' | 'offset' | 'maximized' | 'fullscreen';
	readonly nativeTabs: boolean;
	readonly nativeFullScreen: boolean;
	readonly enableMenuBarMnemonics: boolean;
	readonly closeWhenEmpty: boolean;
	readonly clickThroughInactive: boolean;
	readonly newWindowProfile: string;
	readonly density: IDensitySettings;
	readonly border: 'off' | 'default' | 'system' | string /* color in RGB or other formats */;
}

export interface IDensitySettings {
	readonly editorTabHeight: 'default' | 'compact';
}

export const enum TitleBarSetting {
	TITLE_BAR_STYLE = 'window.titleBarStyle',
	CUSTOM_TITLE_BAR_VISIBILITY = 'window.customTitleBarVisibility',
}

export const enum TitlebarStyle {
	NATIVE = 'native',
	CUSTOM = 'custom',
}

export const enum WindowControlsStyle {
	NATIVE = 'native',
	CUSTOM = 'custom',
	HIDDEN = 'hidden'
}

export const enum CustomTitleBarVisibility {
	AUTO = 'auto',
	WINDOWED = 'windowed',
	NEVER = 'never',
}

export function hasCustomTitlebar(configurationService: IConfigurationService, titleBarStyle?: TitlebarStyle): boolean {
	// Returns if it possible to have a custom title bar in the curren session
	// Does not imply that the title bar is visible
	return true;
}

export function hasNativeTitlebar(configurationService: IConfigurationService, titleBarStyle?: TitlebarStyle): boolean {
	if (!titleBarStyle) {
		titleBarStyle = getTitleBarStyle(configurationService);
	}

	return titleBarStyle === TitlebarStyle.NATIVE;
}

export function getTitleBarStyle(configurationService: IConfigurationService): TitlebarStyle {
	if (isWeb) {
		return TitlebarStyle.CUSTOM;
	}

	const configuration = configurationService.getValue<IWindowSettings | undefined>('window');
	if (configuration) {
		const useNativeTabs = isMacintosh && configuration.nativeTabs === true;
		if (useNativeTabs) {
			return TitlebarStyle.NATIVE; // native tabs on macOS do not work with custom title style
		}

		const useSimpleFullScreen = isMacintosh && configuration.nativeFullScreen === false;
		if (useSimpleFullScreen) {
			return TitlebarStyle.NATIVE; // simple fullscreen does not work well with custom title style (https://github.com/microsoft/vscode/issues/63291)
		}

		const style = configuration.titleBarStyle;
		if (style === TitlebarStyle.NATIVE || style === TitlebarStyle.CUSTOM) {
			return style;
		}
	}

	return TitlebarStyle.CUSTOM; // default to custom on all OS
}

export function getWindowControlsStyle(configurationService: IConfigurationService): WindowControlsStyle {
	if (isWeb || isMacintosh || getTitleBarStyle(configurationService) === TitlebarStyle.NATIVE) {
		return WindowControlsStyle.NATIVE; // only supported on Windows/Linux desktop with custom titlebar
	}

	const configuration = configurationService.getValue<IWindowSettings | undefined>('window');
	const style = configuration?.controlsStyle;
	if (style === WindowControlsStyle.CUSTOM || style === WindowControlsStyle.HIDDEN) {
		return style;
	}

	return WindowControlsStyle.NATIVE; // default to native on all OS
}

export const DEFAULT_CUSTOM_TITLEBAR_HEIGHT = 35; // includes space for command center

export function useWindowControlsOverlay(configurationService: IConfigurationService): boolean {
	if (isWeb) {
		return false; // only supported on desktop instances
	}

	if (hasNativeTitlebar(configurationService)) {
		return false; // only supported when title bar is custom
	}

	if (!isMacintosh) {
		const setting = getWindowControlsStyle(configurationService);
		if (setting === WindowControlsStyle.CUSTOM || setting === WindowControlsStyle.HIDDEN) {
			return false; // explicitly disabled by choice
		}
	}

	return true; // default
}

export function useNativeFullScreen(configurationService: IConfigurationService): boolean {
	const windowConfig = configurationService.getValue<IWindowSettings | undefined>('window');
	if (!windowConfig || typeof windowConfig.nativeFullScreen !== 'boolean') {
		return true; // default
	}

	if (windowConfig.nativeTabs) {
		return true; // https://github.com/electron/electron/issues/16142
	}

	return windowConfig.nativeFullScreen !== false;
}


export interface IPath<T = IEditorOptions> extends IPathData<T> {

	/**
	 * The file path to open within the instance
	 */
	fileUri?: URI;
}

export interface IPathData<T = IEditorOptions> {

	/**
	 * The file path to open within the instance
	 */
	readonly fileUri?: UriComponents;

	/**
	 * Optional editor options to apply in the file
	 */
	readonly options?: T;

	/**
	 * A hint that the file exists. if true, the
	 * file exists, if false it does not. with
	 * `undefined` the state is unknown.
	 */
	readonly exists?: boolean;

	/**
	 * A hint about the file type of this path.
	 * with `undefined` the type is unknown.
	 */
	readonly type?: FileType;

	/**
	 * Specifies if the file should be only be opened
	 * if it exists.
	 */
	readonly openOnlyIfExists?: boolean;
}

export interface IPathsToWaitFor extends IPathsToWaitForData {
	paths: IPath[];
	waitMarkerFileUri: URI;
}

interface IPathsToWaitForData {
	readonly paths: IPathData[];
	readonly waitMarkerFileUri: UriComponents;
}

export interface IOpenFileRequest {
	readonly filesToOpenOrCreate?: IPathData[];
	readonly filesToDiff?: IPathData[];
	readonly filesToMerge?: IPathData[];
}

/**
 * Additional context for the request on native only.
 */
export interface INativeOpenFileRequest extends IOpenFileRequest {
	readonly termProgram?: string;
	readonly filesToWait?: IPathsToWaitForData;
}

export interface INativeRunActionInWindowRequest {
	readonly id: string;
	readonly from: 'menu' | 'touchbar' | 'mouse';
	readonly args?: unknown[];
}

export interface INativeRunKeybindingInWindowRequest {
	readonly userSettingsLabel: string;
}

export interface IColorScheme {
	readonly dark: boolean;
	readonly highContrast: boolean;
}

export interface IWindowConfiguration {
	remoteAuthority?: string;

	filesToOpenOrCreate?: IPath[];
	filesToDiff?: IPath[];
	filesToMerge?: IPath[];
}

export interface IOSConfiguration {
	readonly release: string;
	readonly hostname: string;
	readonly arch: string;
}

export interface INativeWindowConfiguration extends IWindowConfiguration, NativeParsedArgs, ISandboxConfiguration {
	mainPid: number;
	handle?: VSBuffer;

	machineId: string;
	sqmId: string;
	devDeviceId: string;

	execPath: string;
	backupPath?: string;

	profiles: {
		home: UriComponents;
		all: readonly UriDto<IUserDataProfile>[];
		profile: UriDto<IUserDataProfile>;
	};

	homeDir: string;
	tmpDir: string;
	userDataDir: string;

	partsSplash?: IPartsSplash;

	workspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier;

	isInitialStartup?: boolean;
	logLevel: LogLevel;
	loggers: UriDto<ILoggerResource>[];

	fullscreen?: boolean;
	maximized?: boolean;
	accessibilitySupport?: boolean;
	colorScheme: IColorScheme;
	autoDetectHighContrast?: boolean;
	autoDetectColorScheme?: boolean;
	isCustomZoomLevel?: boolean;

	perfMarks: PerformanceMark[];

	filesToWait?: IPathsToWaitFor;

	os: IOSConfiguration;
	policiesData?: IStringDictionary<{ definition: PolicyDefinition; value: PolicyValue }>;
}

/**
 * According to Electron docs: `scale := 1.2 ^ level`.
 * https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentssetzoomlevellevel
 */
export function zoomLevelToZoomFactor(zoomLevel = 0): number {
	return 1.2 ** zoomLevel;
}

export const DEFAULT_EMPTY_WINDOW_SIZE = { width: 1200, height: 800 } as const;
export const DEFAULT_WORKSPACE_WINDOW_SIZE = { width: 1440, height: 900 } as const;
export const DEFAULT_AUX_WINDOW_SIZE = { width: 1024, height: 768 } as const;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/window/electron-browser/window.ts]---
Location: vscode-main/src/vs/platform/window/electron-browser/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getZoomLevel, setZoomFactor, setZoomLevel } from '../../../base/browser/browser.js';
import { getActiveWindow, getWindows } from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { ISandboxConfiguration } from '../../../base/parts/sandbox/common/sandboxTypes.js';
import { ISandboxGlobals, ipcRenderer, webFrame } from '../../../base/parts/sandbox/electron-browser/globals.js';
import { zoomLevelToZoomFactor } from '../common/window.js';

export enum ApplyZoomTarget {
	ACTIVE_WINDOW = 1,
	ALL_WINDOWS
}

export const MAX_ZOOM_LEVEL = 8;
export const MIN_ZOOM_LEVEL = -8;

/**
 * Apply a zoom level to the window. Also sets it in our in-memory
 * browser helper so that it can be accessed in non-electron layers.
 */
export function applyZoom(zoomLevel: number, target: ApplyZoomTarget | Window): void {
	zoomLevel = Math.min(Math.max(zoomLevel, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL); // cap zoom levels between -8 and 8

	const targetWindows: Window[] = [];
	if (target === ApplyZoomTarget.ACTIVE_WINDOW) {
		targetWindows.push(getActiveWindow());
	} else if (target === ApplyZoomTarget.ALL_WINDOWS) {
		targetWindows.push(...Array.from(getWindows()).map(({ window }) => window));
	} else {
		targetWindows.push(target);
	}

	for (const targetWindow of targetWindows) {
		getGlobals(targetWindow)?.webFrame?.setZoomLevel(zoomLevel);
		setZoomFactor(zoomLevelToZoomFactor(zoomLevel), targetWindow);
		setZoomLevel(zoomLevel, targetWindow);
	}
}

function getGlobals(win: Window): ISandboxGlobals | undefined {
	if (win === mainWindow) {
		// main window
		return { ipcRenderer, webFrame };
	} else {
		// auxiliary window
		const auxiliaryWindow = win as unknown as { vscode: ISandboxGlobals };
		if (auxiliaryWindow?.vscode?.ipcRenderer && auxiliaryWindow?.vscode?.webFrame) {
			return auxiliaryWindow.vscode;
		}
	}

	return undefined;
}

export function zoomIn(target: ApplyZoomTarget | Window): void {
	applyZoom(getZoomLevel(typeof target === 'number' ? getActiveWindow() : target) + 1, target);
}

export function zoomOut(target: ApplyZoomTarget | Window): void {
	applyZoom(getZoomLevel(typeof target === 'number' ? getActiveWindow() : target) - 1, target);
}

//#region Bootstrap Window

export interface ILoadOptions<T extends ISandboxConfiguration = ISandboxConfiguration> {
	configureDeveloperSettings?: (config: T) => {
		forceDisableShowDevtoolsOnError?: boolean;
		forceEnableDeveloperKeybindings?: boolean;
		disallowReloadKeybinding?: boolean;
		removeDeveloperKeybindingsAfterLoad?: boolean;
	};
	beforeImport?: (config: T) => void;
}

export interface ILoadResult<M, T> {
	readonly result: M;
	readonly configuration: T;
}

export interface IBootstrapWindow {
	load<M, T extends ISandboxConfiguration = ISandboxConfiguration>(
		esModule: string,
		options: ILoadOptions<T>
	): Promise<ILoadResult<M, T>>;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/window/electron-main/window.ts]---
Location: vscode-main/src/vs/platform/window/electron-main/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { ISerializableCommandAction } from '../../action/common/action.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { FocusMode } from '../../native/common/native.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { DEFAULT_AUX_WINDOW_SIZE, DEFAULT_EMPTY_WINDOW_SIZE, DEFAULT_WORKSPACE_WINDOW_SIZE, INativeWindowConfiguration } from '../common/window.js';

export interface IBaseWindow extends IDisposable {

	readonly onDidMaximize: Event<void>;
	readonly onDidUnmaximize: Event<void>;
	readonly onDidTriggerSystemContextMenu: Event<{ readonly x: number; readonly y: number }>;
	readonly onDidEnterFullScreen: Event<void>;
	readonly onDidLeaveFullScreen: Event<void>;
	readonly onDidClose: Event<void>;

	readonly id: number;
	readonly win: electron.BrowserWindow | null;

	readonly lastFocusTime: number;
	focus(options?: { mode: FocusMode }): void;

	setRepresentedFilename(name: string): void;
	getRepresentedFilename(): string | undefined;

	setDocumentEdited(edited: boolean): void;
	isDocumentEdited(): boolean;

	readonly isFullScreen: boolean;
	toggleFullScreen(): void;

	updateWindowControls(options: { height?: number; backgroundColor?: string; foregroundColor?: string }): void;

	matches(webContents: electron.WebContents): boolean;
}

export interface ICodeWindow extends IBaseWindow {

	readonly onWillLoad: Event<ILoadEvent>;
	readonly onDidSignalReady: Event<void>;
	readonly onDidDestroy: Event<void>;

	readonly whenClosedOrLoaded: Promise<void>;

	readonly config: INativeWindowConfiguration | undefined;

	readonly openedWorkspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier;

	readonly profile?: IUserDataProfile;

	readonly backupPath?: string;

	readonly remoteAuthority?: string;

	readonly isExtensionDevelopmentHost: boolean;
	readonly isExtensionTestHost: boolean;

	readonly isReady: boolean;
	ready(): Promise<ICodeWindow>;
	setReady(): void;

	addTabbedWindow(window: ICodeWindow): void;

	load(config: INativeWindowConfiguration, options?: { isReload?: boolean }): void;
	reload(cli?: NativeParsedArgs): void;

	close(): void;

	getBounds(): electron.Rectangle;

	send(channel: string, ...args: unknown[]): void;
	sendWhenReady(channel: string, token: CancellationToken, ...args: unknown[]): void;

	updateTouchBar(items: ISerializableCommandAction[][]): void;

	notifyZoomLevel(zoomLevel: number | undefined): void;

	serializeWindowState(): IWindowState;
}

export const enum LoadReason {

	/**
	 * The window is loaded for the first time.
	 */
	INITIAL = 1,

	/**
	 * The window is loaded into a different workspace context.
	 */
	LOAD,

	/**
	 * The window is reloaded.
	 */
	RELOAD
}

export const enum UnloadReason {

	/**
	 * The window is closed.
	 */
	CLOSE = 1,

	/**
	 * All windows unload because the application quits.
	 */
	QUIT,

	/**
	 * The window is reloaded.
	 */
	RELOAD,

	/**
	 * The window is loaded into a different workspace context.
	 */
	LOAD
}

export interface IWindowState {
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	mode?: WindowMode;
	zoomLevel?: number;
	readonly display?: number;
}

export const defaultWindowState = function (mode = WindowMode.Normal, hasWorkspace = false): IWindowState {
	const size = hasWorkspace ? DEFAULT_WORKSPACE_WINDOW_SIZE : DEFAULT_EMPTY_WINDOW_SIZE;
	return {
		width: size.width,
		height: size.height,
		mode
	};
};

export const defaultAuxWindowState = function (): IWindowState {

	// Auxiliary windows are being created from a `window.open` call
	// that sets `windowFeatures` that encode the desired size and
	// position of the new window (`top`, `left`).
	// In order to truly override this to a good default window state
	// we need to set not only width and height but also x and y to
	// a good location on the primary display.

	const width = DEFAULT_AUX_WINDOW_SIZE.width;
	const height = DEFAULT_AUX_WINDOW_SIZE.height;
	const workArea = electron.screen.getPrimaryDisplay().workArea;
	const x = Math.max(workArea.x + (workArea.width / 2) - (width / 2), 0);
	const y = Math.max(workArea.y + (workArea.height / 2) - (height / 2), 0);

	return {
		x,
		y,
		width,
		height,
		mode: WindowMode.Normal
	};
};

export const enum WindowMode {
	Maximized,
	Normal,
	Minimized, // not used anymore, but also cannot remove due to existing stored UI state (needs migration)
	Fullscreen
}

export interface ILoadEvent {
	readonly workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined;
	readonly reason: LoadReason;
}

export const enum WindowError {

	/**
	 * Maps to the `unresponsive` event on a `BrowserWindow`.
	 */
	UNRESPONSIVE = 1,

	/**
	 * Maps to the `render-process-gone` event on a `WebContents`.
	 */
	PROCESS_GONE = 2,

	/**
	 * Maps to the `did-fail-load` event on a `WebContents`.
	 */
	LOAD = 3,

	/**
	 * Maps to the `responsive` event on a `BrowserWindow`.
	 */
	RESPONSIVE = 4,
}
```

--------------------------------------------------------------------------------

````

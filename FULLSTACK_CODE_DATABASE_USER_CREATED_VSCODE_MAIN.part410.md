---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 410
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 410 of 552)

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

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpServerConnection.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpServerConnection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { autorun, observableValue } from '../../../../../base/common/observable.js';
import { upcast } from '../../../../../base/common/types.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogger, ILoggerService, LogLevel, NullLogger } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IOutputService } from '../../../../services/output/common/output.js';
import { TestLoggerService, TestProductService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IMcpHostDelegate, IMcpMessageTransport } from '../../common/mcpRegistryTypes.js';
import { McpServerConnection } from '../../common/mcpServerConnection.js';
import { McpCollectionDefinition, McpConnectionState, McpServerDefinition, McpServerLaunch, McpServerTransportType, McpServerTrust } from '../../common/mcpTypes.js';
import { TestMcpMessageTransport } from './mcpRegistryTypes.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';
import { Event } from '../../../../../base/common/event.js';
import { McpTaskManager } from '../../common/mcpTaskManager.js';

class TestMcpHostDelegate extends Disposable implements IMcpHostDelegate {
	private readonly _transport: TestMcpMessageTransport;
	private _canStartValue = true;

	priority = 0;

	constructor() {
		super();
		this._transport = this._register(new TestMcpMessageTransport());
	}

	substituteVariables(serverDefinition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch> {
		return Promise.resolve(launch);
	}

	canStart(): boolean {
		return this._canStartValue;
	}

	start(): IMcpMessageTransport {
		if (!this._canStartValue) {
			throw new Error('Cannot start server');
		}
		return this._transport;
	}

	getTransport(): TestMcpMessageTransport {
		return this._transport;
	}

	setCanStart(value: boolean): void {
		this._canStartValue = value;
	}

	waitForInitialProviderPromises(): Promise<void> {
		return Promise.resolve();
	}
}

suite('Workbench - MCP - ServerConnection', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let delegate: TestMcpHostDelegate;
	let transport: TestMcpMessageTransport;
	let collection: McpCollectionDefinition;
	let serverDefinition: McpServerDefinition;

	setup(() => {
		delegate = store.add(new TestMcpHostDelegate());
		transport = delegate.getTransport();

		// Setup test services
		const services = new ServiceCollection(
			[ILoggerService, store.add(new TestLoggerService())],
			[IOutputService, upcast({ showChannel: () => { } })],
			[IStorageService, store.add(new TestStorageService())],
			[IProductService, TestProductService],
		);

		instantiationService = store.add(new TestInstantiationService(services));

		// Create test collection
		collection = {
			id: 'test-collection',
			label: 'Test Collection',
			remoteAuthority: null,
			serverDefinitions: observableValue('serverDefs', []),
			trustBehavior: McpServerTrust.Kind.Trusted,
			scope: StorageScope.APPLICATION,
			configTarget: ConfigurationTarget.USER,
		};

		// Create server definition
		serverDefinition = {
			id: 'test-server',
			label: 'Test Server',
			cacheNonce: 'a',
			launch: {
				type: McpServerTransportType.Stdio,
				command: 'test-command',
				args: [],
				env: {},
				envFile: undefined,
				cwd: '/test'
			}
		};
	});

	function waitForHandler(cnx: McpServerConnection) {
		const handler = cnx.handler.get();
		if (handler) {
			return Promise.resolve(handler);
		}

		return new Promise(resolve => {
			const disposable = autorun(reader => {
				const handler = cnx.handler.read(reader);
				if (handler) {
					disposable.dispose();
					resolve(handler);
				}
			});
		});
	}

	test('should start and set state to Running when transport succeeds', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise = connection.start({});

		// Simulate successful connection
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });

		const state = await startPromise;
		assert.strictEqual(state.state, McpConnectionState.Kind.Running);

		transport.simulateInitialized();
		assert.ok(await waitForHandler(connection));
	});

	test('should handle errors during start', async () => {
		// Setup delegate to fail on start
		delegate.setCanStart(false);

		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const state = await connection.start({});

		assert.strictEqual(state.state, McpConnectionState.Kind.Error);
		assert.ok(state.message);
	});

	test('should handle transport errors', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise = connection.start({});

		// Simulate error in transport
		transport.setConnectionState({
			state: McpConnectionState.Kind.Error,
			message: 'Test error message'
		});

		const state = await startPromise;
		assert.strictEqual(state.state, McpConnectionState.Kind.Error);
		assert.strictEqual(state.message, 'Test error message');
	});

	test('should stop and set state to Stopped', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise = connection.start({});
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		await startPromise;

		// Stop the connection
		const stopPromise = connection.stop();
		await stopPromise;

		assert.strictEqual(connection.state.get().state, McpConnectionState.Kind.Stopped);
	});

	test('should not restart if already starting', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise1 = connection.start({});

		// Try to start again while starting
		const startPromise2 = connection.start({});

		// Simulate successful connection
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });

		const state1 = await startPromise1;
		const state2 = await startPromise2;

		// Both promises should resolve to the same state
		assert.strictEqual(state1.state, McpConnectionState.Kind.Running);
		assert.strictEqual(state2.state, McpConnectionState.Kind.Running);

		transport.simulateInitialized();
		assert.ok(await waitForHandler(connection));

		connection.dispose();
	});

	test('should clean up when disposed', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);

		// Start the connection
		const startPromise = connection.start({});
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		await startPromise;

		// Dispose the connection
		connection.dispose();

		assert.strictEqual(connection.state.get().state, McpConnectionState.Kind.Stopped);
	});

	test('should log transport messages', async () => {
		// Track logged messages
		const loggedMessages: string[] = [];

		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			{
				onDidChangeLogLevel: Event.None,
				getLevel: () => LogLevel.Debug,
				info: (message: string) => {
					loggedMessages.push(message);
				},
				error: () => { },
				dispose: () => { }
			} as Partial<ILogger> as ILogger,
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise = connection.start({});

		// Simulate log message from transport
		transport.simulateLog('Test log message');

		// Set connection to running
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		await startPromise;

		// Check that the message was logged
		assert.ok(loggedMessages.some(msg => msg === 'Test log message'));

		connection.dispose();
		await timeout(10);
	});

	test('should correctly handle transitions to and from error state', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// Start the connection
		const startPromise = connection.start({});

		// Transition to error state
		const errorState: McpConnectionState = {
			state: McpConnectionState.Kind.Error,
			message: 'Temporary error'
		};
		transport.setConnectionState(errorState);

		let state = await startPromise;
		assert.equal(state, errorState);


		transport.setConnectionState({ state: McpConnectionState.Kind.Stopped });

		// Transition back to running state
		const startPromise2 = connection.start({});
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		state = await startPromise2;
		assert.deepStrictEqual(state, { state: McpConnectionState.Kind.Running });

		connection.dispose();
		await timeout(10);
	});

	test('should handle multiple start/stop cycles', async () => {
		// Create server connection
		const connection = instantiationService.createInstance(
			McpServerConnection,
			collection,
			serverDefinition,
			delegate,
			serverDefinition.launch,
			new NullLogger(),
			false,
			store.add(new McpTaskManager()),
		);
		store.add(connection);

		// First cycle
		let startPromise = connection.start({});
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		await startPromise;

		await connection.stop();
		assert.deepStrictEqual(connection.state.get(), { state: McpConnectionState.Kind.Stopped });

		// Second cycle
		startPromise = connection.start({});
		transport.setConnectionState({ state: McpConnectionState.Kind.Running });
		await startPromise;

		assert.deepStrictEqual(connection.state.get(), { state: McpConnectionState.Kind.Running });

		await connection.stop();

		assert.deepStrictEqual(connection.state.get(), { state: McpConnectionState.Kind.Stopped });

		connection.dispose();
		await timeout(10);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpServerRequestHandler.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpServerRequestHandler.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { upcast } from '../../../../../base/common/types.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILoggerService } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestLoggerService, TestProductService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IMcpHostDelegate } from '../../common/mcpRegistryTypes.js';
import { McpServerRequestHandler, McpTask } from '../../common/mcpServerRequestHandler.js';
import { McpConnectionState, McpServerDefinition, McpServerLaunch } from '../../common/mcpTypes.js';
import { MCP } from '../../common/modelContextProtocol.js';
import { TestMcpMessageTransport } from './mcpRegistryTypes.js';
import { IOutputService } from '../../../../services/output/common/output.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { McpTaskManager } from '../../common/mcpTaskManager.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';

class TestMcpHostDelegate extends Disposable implements IMcpHostDelegate {
	private readonly _transport: TestMcpMessageTransport;

	priority = 0;

	constructor() {
		super();
		this._transport = this._register(new TestMcpMessageTransport());
	}


	substituteVariables(serverDefinition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch> {
		return Promise.resolve(launch);
	}

	canStart(): boolean {
		return true;
	}

	start(): TestMcpMessageTransport {
		return this._transport;
	}

	getTransport(): TestMcpMessageTransport {
		return this._transport;
	}

	waitForInitialProviderPromises(): Promise<void> {
		return Promise.resolve();
	}
}

suite('Workbench - MCP - ServerRequestHandler', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let delegate: TestMcpHostDelegate;
	let transport: TestMcpMessageTransport;
	let handler: McpServerRequestHandler;
	let cts: CancellationTokenSource;

	setup(async () => {
		delegate = store.add(new TestMcpHostDelegate());
		transport = delegate.getTransport();
		cts = store.add(new CancellationTokenSource());

		// Setup test services
		const services = new ServiceCollection(
			[ILoggerService, store.add(new TestLoggerService())],
			[IOutputService, upcast({ showChannel: () => { } })],
			[IStorageService, store.add(new TestStorageService())],
			[IProductService, TestProductService],
		);

		instantiationService = store.add(new TestInstantiationService(services));

		transport.setConnectionState({ state: McpConnectionState.Kind.Running });

		// Manually create the handler since we need the transport already set up
		const logger = store.add((instantiationService.get(ILoggerService) as TestLoggerService)
			.createLogger('mcpServerTest', { hidden: true, name: 'MCP Test' }));

		// Start the handler creation
		const handlerPromise = McpServerRequestHandler.create(instantiationService, { logger, launch: transport, taskManager: store.add(new McpTaskManager()) }, cts.token);

		handler = await handlerPromise;
		store.add(handler);
	});

	test('should send and receive JSON-RPC requests', async () => {
		// Setup request
		const requestPromise = handler.listResources();

		// Get the sent message and verify it
		const sentMessages = transport.getSentMessages();
		assert.strictEqual(sentMessages.length, 3); // initialize + listResources

		// Verify listResources request format
		const listResourcesRequest = sentMessages[2] as MCP.JSONRPCRequest;
		assert.strictEqual(listResourcesRequest.method, 'resources/list');
		assert.strictEqual(listResourcesRequest.jsonrpc, MCP.JSONRPC_VERSION);
		assert.ok(typeof listResourcesRequest.id === 'number');

		// Simulate server response with mock resources that match the expected Resource interface
		transport.simulateReceiveMessage({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: listResourcesRequest.id,
			result: {
				resources: [
					{ uri: 'resource1', type: 'text/plain', name: 'Test Resource 1' },
					{ uri: 'resource2', type: 'text/plain', name: 'Test Resource 2' }
				]
			}
		});

		// Verify the result
		const resources = await requestPromise;
		assert.strictEqual(resources.length, 2);
		assert.strictEqual(resources[0].uri, 'resource1');
		assert.strictEqual(resources[1].name, 'Test Resource 2');
	});

	test('should handle paginated requests', async () => {
		// Setup request
		const requestPromise = handler.listResources();

		// Get the first request and respond with pagination
		const sentMessages = transport.getSentMessages();
		const listResourcesRequest = sentMessages[2] as MCP.JSONRPCRequest;

		// Send first page with nextCursor
		transport.simulateReceiveMessage({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: listResourcesRequest.id,
			result: {
				resources: [
					{ uri: 'resource1', type: 'text/plain', name: 'Test Resource 1' }
				],
				nextCursor: 'page2'
			}
		});

		// Clear the sent messages to only capture the next page request
		transport.clearSentMessages();

		// Wait a bit to allow the handler to process and send the next request
		await new Promise(resolve => setTimeout(resolve, 0));

		// Get the second request and verify cursor is included
		const sentMessages2 = transport.getSentMessages();
		assert.strictEqual(sentMessages2.length, 1);

		const listResourcesRequest2 = sentMessages2[0] as MCP.JSONRPCRequest;
		assert.strictEqual(listResourcesRequest2.method, 'resources/list');
		assert.deepStrictEqual(listResourcesRequest2.params, { cursor: 'page2' });

		// Send final page with no nextCursor
		transport.simulateReceiveMessage({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: listResourcesRequest2.id,
			result: {
				resources: [
					{ uri: 'resource2', type: 'text/plain', name: 'Test Resource 2' }
				]
			}
		});

		// Verify the combined result
		const resources = await requestPromise;
		assert.strictEqual(resources.length, 2);
		assert.strictEqual(resources[0].uri, 'resource1');
		assert.strictEqual(resources[1].uri, 'resource2');
	});

	test('should handle error responses', async () => {
		// Setup request
		const requestPromise = handler.readResource({ uri: 'non-existent' });

		// Get the sent message
		const sentMessages = transport.getSentMessages();
		const readResourceRequest = sentMessages[2] as MCP.JSONRPCRequest; // [0] is initialize

		// Simulate error response
		transport.simulateReceiveMessage({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: readResourceRequest.id,
			error: {
				code: MCP.METHOD_NOT_FOUND,
				message: 'Resource not found'
			}
		});

		// Verify the error is thrown correctly
		try {
			await requestPromise;
			assert.fail('Expected error was not thrown');
		} catch (e: unknown) {
			assert.strictEqual((e as Error).message, 'MPC -32601: Resource not found');
			assert.strictEqual((e as { code: number }).code, MCP.METHOD_NOT_FOUND);
		}
	});

	test('should handle server requests', async () => {
		// Simulate ping request from server
		const pingRequest: MCP.JSONRPCRequest & MCP.PingRequest = {
			jsonrpc: MCP.JSONRPC_VERSION,
			id: 100,
			method: 'ping'
		};

		transport.simulateReceiveMessage(pingRequest);

		// The handler should have sent a response
		const sentMessages = transport.getSentMessages();
		const pingResponse = sentMessages.find(m =>
			'id' in m && m.id === pingRequest.id && 'result' in m
		) as MCP.JSONRPCResponse;

		assert.ok(pingResponse, 'No ping response was sent');
		assert.deepStrictEqual(pingResponse.result, {});
	});

	test('should handle roots list requests', async () => {
		// Set roots
		handler.roots = [
			{ uri: 'file:///test/root1', name: 'Root 1' },
			{ uri: 'file:///test/root2', name: 'Root 2' }
		];

		// Simulate roots/list request from server
		const rootsRequest: MCP.JSONRPCRequest & MCP.ListRootsRequest = {
			jsonrpc: MCP.JSONRPC_VERSION,
			id: 101,
			method: 'roots/list'
		};

		transport.simulateReceiveMessage(rootsRequest);

		// The handler should have sent a response
		const sentMessages = transport.getSentMessages();
		const rootsResponse = sentMessages.find(m =>
			'id' in m && m.id === rootsRequest.id && 'result' in m
		) as MCP.JSONRPCResponse;

		assert.ok(rootsResponse, 'No roots/list response was sent');
		assert.strictEqual((rootsResponse.result as MCP.ListRootsResult).roots.length, 2);
		assert.strictEqual((rootsResponse.result as MCP.ListRootsResult).roots[0].uri, 'file:///test/root1');
	});

	test('should handle server notifications', async () => {
		let progressNotificationReceived = false;
		store.add(handler.onDidReceiveProgressNotification(notification => {
			progressNotificationReceived = true;
			assert.strictEqual(notification.method, 'notifications/progress');
			assert.strictEqual(notification.params.progressToken, 'token1');
			assert.strictEqual(notification.params.progress, 50);
		}));

		// Simulate progress notification with correct format
		const progressNotification: MCP.JSONRPCNotification & MCP.ProgressNotification = {
			jsonrpc: MCP.JSONRPC_VERSION,
			method: 'notifications/progress',
			params: {
				progressToken: 'token1',
				progress: 50,
				total: 100
			}
		};

		transport.simulateReceiveMessage(progressNotification);
		assert.strictEqual(progressNotificationReceived, true);
	});

	test('should handle cancellation', async () => {
		// Setup a new cancellation token source for this specific test
		const testCts = store.add(new CancellationTokenSource());
		const requestPromise = handler.listResources(undefined, testCts.token);

		// Get the request ID
		const sentMessages = transport.getSentMessages();
		const listResourcesRequest = sentMessages[2] as MCP.JSONRPCRequest;
		const requestId = listResourcesRequest.id;

		// Cancel the request
		testCts.cancel();

		// Check that a cancellation notification was sent
		const cancelNotification = transport.getSentMessages().find(m =>
			!('id' in m) &&
			'method' in m &&
			m.method === 'notifications/cancelled' &&
			'params' in m &&
			m.params && m.params.requestId === requestId
		);

		assert.ok(cancelNotification, 'No cancellation notification was sent');

		// Verify the promise was cancelled
		try {
			await requestPromise;
			assert.fail('Promise should have been cancelled');
		} catch (e) {
			assert.strictEqual(e.name, 'Canceled');
		}
	});

	test('should handle cancelled notification from server', async () => {
		// Setup request
		const requestPromise = handler.listResources();

		// Get the request ID
		const sentMessages = transport.getSentMessages();
		const listResourcesRequest = sentMessages[2] as MCP.JSONRPCRequest;
		const requestId = listResourcesRequest.id;

		// Simulate cancelled notification from server
		const cancelledNotification: MCP.JSONRPCNotification & MCP.CancelledNotification = {
			jsonrpc: MCP.JSONRPC_VERSION,
			method: 'notifications/cancelled',
			params: {
				requestId
			}
		};

		transport.simulateReceiveMessage(cancelledNotification);

		// Verify the promise was cancelled
		try {
			await requestPromise;
			assert.fail('Promise should have been cancelled');
		} catch (e) {
			assert.strictEqual(e.name, 'Canceled');
		}
	});

	test('should dispose properly and cancel pending requests', async () => {
		// Setup multiple requests
		const request1 = handler.listResources();
		const request2 = handler.listTools();

		// Dispose the handler
		handler.dispose();

		// Verify all promises were cancelled
		try {
			await request1;
			assert.fail('Promise 1 should have been cancelled');
		} catch (e) {
			assert.strictEqual(e.name, 'Canceled');
		}

		try {
			await request2;
			assert.fail('Promise 2 should have been cancelled');
		} catch (e) {
			assert.strictEqual(e.name, 'Canceled');
		}
	});

	test('should handle connection error by cancelling requests', async () => {
		// Setup request
		const requestPromise = handler.listResources();

		// Simulate connection error
		transport.setConnectionState({
			state: McpConnectionState.Kind.Error,
			message: 'Connection lost'
		});

		// Verify the promise was cancelled
		try {
			await requestPromise;
			assert.fail('Promise should have been cancelled');
		} catch (e) {
			assert.strictEqual(e.name, 'Canceled');
		}
	});
});

suite.skip('Workbench - MCP - McpTask', () => { // TODO@connor4312 https://github.com/microsoft/vscode/issues/280126
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let clock: sinon.SinonFakeTimers;

	setup(() => {
		clock = sinon.useFakeTimers();
	});

	teardown(() => {
		clock.restore();
	});

	function createTask(overrides: Partial<MCP.Task> = {}): MCP.Task {
		return {
			taskId: 'task1',
			status: 'working',
			createdAt: new Date().toISOString(),
			ttl: null,
			...overrides
		};
	}

	test('should resolve when task completes', async () => {
		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: sinon.stub().resolves(createTask({ status: 'completed' })),
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		const task = store.add(new McpTask(createTask()));
		task.setHandler(mockHandler);

		// Advance time to trigger polling
		await clock.tickAsync(2000);

		// Update to completed state
		task.onDidUpdateState(createTask({ status: 'completed' }));

		const result = await task.result;
		assert.deepStrictEqual(result, { content: [{ type: 'text', text: 'result' }] });
		assert.ok((mockHandler.getTaskResult as sinon.SinonStub).calledWith({ taskId: 'task1' }));
	});

	test('should poll for task updates', async () => {
		const getTaskStub = sinon.stub();
		getTaskStub.onCall(0).resolves(createTask({ status: 'working' }));
		getTaskStub.onCall(1).resolves(createTask({ status: 'working' }));
		getTaskStub.onCall(2).resolves(createTask({ status: 'completed' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler);

		// First poll
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub.callCount, 1);

		// Second poll
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub.callCount, 2);

		// Third poll - completes
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub.callCount, 3);

		const result = await task.result;
		assert.deepStrictEqual(result, { content: [{ type: 'text', text: 'result' }] });
	});

	test('should use default poll interval if not specified', async () => {
		const getTaskStub = sinon.stub();
		getTaskStub.resolves(createTask({ status: 'working' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
		});

		const task = store.add(new McpTask(createTask()));
		task.setHandler(mockHandler);

		// Default poll interval is 2000ms
		await clock.tickAsync(2000);
		assert.strictEqual(getTaskStub.callCount, 1);

		await clock.tickAsync(2000);
		assert.strictEqual(getTaskStub.callCount, 2);

		task.dispose();
	});

	test('should reject when task fails', async () => {
		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: sinon.stub().resolves(createTask({
				status: 'failed',
				statusMessage: 'Something went wrong'
			}))
		});

		const task = store.add(new McpTask(createTask()));
		task.setHandler(mockHandler);

		// Update to failed state
		task.onDidUpdateState(createTask({
			status: 'failed',
			statusMessage: 'Something went wrong'
		}));

		await assert.rejects(
			task.result,
			(error: Error) => {
				assert.ok(error.message.includes('Task task1 failed'));
				assert.ok(error.message.includes('Something went wrong'));
				return true;
			}
		);
	});

	test('should cancel when task is cancelled', async () => {
		const task = store.add(new McpTask(createTask()));

		// Update to cancelled state
		task.onDidUpdateState(createTask({ status: 'cancelled' }));

		await assert.rejects(
			task.result,
			(error: Error) => {
				assert.strictEqual(error.name, 'Canceled');
				return true;
			}
		);
	});

	test('should cancel when cancellation token is triggered', async () => {
		const cts = store.add(new CancellationTokenSource());
		const task = store.add(new McpTask(createTask(), cts.token));

		// Cancel the token
		cts.cancel();

		await assert.rejects(
			task.result,
			(error: Error) => {
				assert.strictEqual(error.name, 'Canceled');
				return true;
			}
		);
	});

	test('should handle TTL expiration', async () => {
		const now = Date.now();
		clock.setSystemTime(now);

		const task = store.add(new McpTask(createTask({ ttl: 5000 })));

		// Advance time past TTL
		await clock.tickAsync(6000);

		await assert.rejects(
			task.result,
			(error: Error) => {
				assert.strictEqual(error.name, 'Canceled');
				return true;
			}
		);
	});

	test('should stop polling when in terminal state', async () => {
		const getTaskStub = sinon.stub();
		getTaskStub.resolves(createTask({ status: 'completed' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler);

		// Update to completed state immediately
		task.onDidUpdateState(createTask({ status: 'completed' }));

		await task.result;

		// Advance time - should not poll anymore
		const initialCallCount = getTaskStub.callCount;
		await clock.tickAsync(5000);
		assert.strictEqual(getTaskStub.callCount, initialCallCount);
	});

	test('should handle handler reconnection', async () => {
		const getTaskStub1 = sinon.stub();
		getTaskStub1.resolves(createTask({ status: 'working' }));

		const mockHandler1 = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub1,
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler1);

		// First poll with handler1
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub1.callCount, 1);

		// Switch to a new handler
		const getTaskStub2 = sinon.stub();
		getTaskStub2.resolves(createTask({ status: 'completed' }));

		const mockHandler2 = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub2,
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		task.setHandler(mockHandler2);

		// Second poll with handler2
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub1.callCount, 1); // No more calls to old handler
		assert.strictEqual(getTaskStub2.callCount, 1); // New handler is called

		const result = await task.result;
		assert.deepStrictEqual(result, { content: [{ type: 'text', text: 'result' }] });
	});

	test('should not poll when handler is undefined', async () => {
		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));

		// Advance time - should not crash
		await clock.tickAsync(5000);

		// Now set a handler and it should start polling
		const getTaskStub = sinon.stub();
		getTaskStub.resolves(createTask({ status: 'completed' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		task.setHandler(mockHandler);
		await clock.tickAsync(1000);
		assert.strictEqual(getTaskStub.callCount, 1);

		task.dispose();
	});

	test('should handle input_required state', async () => {
		const getTaskStub = sinon.stub();
		// getTask call returns completed (triggered by input_required handling)
		getTaskStub.resolves(createTask({ status: 'completed' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
			getTaskResult: sinon.stub().resolves({ content: [{ type: 'text', text: 'result' }] })
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler);

		// Update to input_required - this triggers a getTask call
		task.onDidUpdateState(createTask({ status: 'input_required' }));

		// Allow the promise to settle
		await clock.tickAsync(0);

		// Verify getTask was called
		assert.strictEqual(getTaskStub.callCount, 1);

		// Once getTask resolves with completed, should fetch result
		const result = await task.result;
		assert.deepStrictEqual(result, { content: [{ type: 'text', text: 'result' }] });
	});

	test('should handle getTask returning cancelled during polling', async () => {
		const getTaskStub = sinon.stub();
		getTaskStub.resolves(createTask({ status: 'cancelled' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler);

		// Advance time to trigger polling
		await clock.tickAsync(1000);

		await assert.rejects(
			task.result,
			(error: Error) => {
				assert.strictEqual(error.name, 'Canceled');
				return true;
			}
		);
	});

	test('should return correct task id', () => {
		const task = store.add(new McpTask(createTask({ taskId: 'my-task-id' })));
		assert.strictEqual(task.id, 'my-task-id');
	});

	test('should dispose cleanly', async () => {
		const getTaskStub = sinon.stub();
		getTaskStub.resolves(createTask({ status: 'working' }));

		const mockHandler = upcastPartial<McpServerRequestHandler>({
			getTask: getTaskStub,
		});

		const task = store.add(new McpTask(createTask({ pollInterval: 1000 })));
		task.setHandler(mockHandler);

		// Poll once
		await clock.tickAsync(1000);
		const callCountBeforeDispose = getTaskStub.callCount;

		// Dispose
		task.dispose();

		// Advance time - should not poll anymore
		await clock.tickAsync(5000);
		assert.strictEqual(getTaskStub.callCount, callCountBeforeDispose);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpTypes.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpTypes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { McpResourceURI, McpServerDefinition, McpServerTransportType } from '../../common/mcpTypes.js';
import * as assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';

suite('MCP Types', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('McpResourceURI - round trips', () => {
		const roundTrip = (uri: string) => {
			const from = McpResourceURI.fromServer({ label: '', id: 'my-id' }, uri);
			const to = McpResourceURI.toServer(from);
			assert.strictEqual(to.definitionId, 'my-id');
			assert.strictEqual(to.resourceURL.toString(), uri, `expected to round trip ${uri}`);
		};

		roundTrip('file:///path/to/file.txt');
		roundTrip('custom-scheme://my-path/to/resource.txt');
		roundTrip('custom-scheme://my-path');
		roundTrip('custom-scheme://my-path/');
		roundTrip('custom-scheme://my-path/?with=query&params=here');

		roundTrip('custom-scheme:///my-path');
		roundTrip('custom-scheme:///my-path/foo/?with=query&params=here');
	});

	suite('McpServerDefinition.equals', () => {
		const createBasicDefinition = (overrides?: Partial<McpServerDefinition>): McpServerDefinition => ({
			id: 'test-server',
			label: 'Test Server',
			cacheNonce: 'v1.0.0',
			launch: {
				type: McpServerTransportType.Stdio,
				cwd: undefined,
				command: 'test-command',
				args: [],
				env: {},
				envFile: undefined
			},
			...overrides
		});

		test('returns true for identical definitions', () => {
			const def1 = createBasicDefinition();
			const def2 = createBasicDefinition();
			assert.strictEqual(McpServerDefinition.equals(def1, def2), true);
		});

		test('returns false when cacheNonce differs', () => {
			const def1 = createBasicDefinition({ cacheNonce: 'v1.0.0' });
			const def2 = createBasicDefinition({ cacheNonce: 'v2.0.0' });
			assert.strictEqual(McpServerDefinition.equals(def1, def2), false);
		});

		test('returns false when id differs', () => {
			const def1 = createBasicDefinition({ id: 'server-1' });
			const def2 = createBasicDefinition({ id: 'server-2' });
			assert.strictEqual(McpServerDefinition.equals(def1, def2), false);
		});

		test('returns false when label differs', () => {
			const def1 = createBasicDefinition({ label: 'Server A' });
			const def2 = createBasicDefinition({ label: 'Server B' });
			assert.strictEqual(McpServerDefinition.equals(def1, def2), false);
		});

		test('returns false when roots differ', () => {
			const def1 = createBasicDefinition({ roots: [URI.file('/path1')] });
			const def2 = createBasicDefinition({ roots: [URI.file('/path2')] });
			assert.strictEqual(McpServerDefinition.equals(def1, def2), false);
		});

		test('returns true when roots are both undefined', () => {
			const def1 = createBasicDefinition({ roots: undefined });
			const def2 = createBasicDefinition({ roots: undefined });
			assert.strictEqual(McpServerDefinition.equals(def1, def2), true);
		});

		test('returns false when launch differs', () => {
			const def1 = createBasicDefinition({
				launch: {
					type: McpServerTransportType.Stdio,
					cwd: undefined,
					command: 'command1',
					args: [],
					env: {},
					envFile: undefined
				}
			});
			const def2 = createBasicDefinition({
				launch: {
					type: McpServerTransportType.Stdio,
					cwd: undefined,
					command: 'command2',
					args: [],
					env: {},
					envFile: undefined
				}
			});
			assert.strictEqual(McpServerDefinition.equals(def1, def2), false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/testMcpService.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/testMcpService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { observableValue } from '../../../../../base/common/observable.js';
import { IAutostartResult, IMcpServer, IMcpService, LazyCollectionState } from '../../common/mcpTypes.js';

export class TestMcpService implements IMcpService {
	declare readonly _serviceBrand: undefined;
	public servers = observableValue<readonly IMcpServer[]>(this, []);
	resetCaches(): void {

	}
	resetTrust(): void {

	}

	cancelAutostart(): void {

	}

	autostart() {
		return observableValue<IAutostartResult>(this, { working: false, starting: [], serversRequiringInteraction: [] });
	}

	public lazyCollectionState = observableValue(this, { state: LazyCollectionState.AllKnown, collections: [] });

	activateCollections(): Promise<void> {
		return Promise.resolve();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/uriTemplate.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/uriTemplate.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { UriTemplate } from '../../common/uriTemplate.js';
import * as assert from 'assert';

suite('UriTemplate', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	/**
	 * Helper function to test template parsing and component extraction
	 */
	function testParsing(template: string, expectedComponents: unknown[]) {
		const templ = UriTemplate.parse(template);
		assert.deepStrictEqual(templ.components.filter(c => typeof c === 'object'), expectedComponents);
		return templ;
	}

	/**
	 * Helper function to test template resolution
	 */
	function testResolution(template: string, variables: Record<string, any>, expected: string) {
		const templ = UriTemplate.parse(template);
		const result = templ.resolve(variables);
		assert.strictEqual(result, expected);
	}

	test('simple replacement', () => {
		const templ = UriTemplate.parse('http://example.com/{var}');
		assert.deepStrictEqual(templ.components, ['http://example.com/', {
			expression: '{var}',
			operator: '',
			variables: [{ explodable: false, name: 'var', optional: false, prefixLength: undefined, repeatable: false }]
		}, '']);
		const result = templ.resolve({ var: 'value' });
		assert.strictEqual(result, 'http://example.com/value');
	});

	test('parsing components correctly', () => {
		// Simple component
		testParsing('http://example.com/{var}', [{
			expression: '{var}',
			operator: '',
			variables: [{ explodable: false, name: 'var', optional: false, prefixLength: undefined, repeatable: false }]
		}]);

		// Component with operator
		testParsing('http://example.com/{+path}', [{
			expression: '{+path}',
			operator: '+',
			variables: [{ explodable: false, name: 'path', optional: false, prefixLength: undefined, repeatable: false }]
		}]);

		// Component with multiple variables
		testParsing('http://example.com/{x,y}', [{
			expression: '{x,y}',
			operator: '',
			variables: [
				{ explodable: false, name: 'x', optional: false, prefixLength: undefined, repeatable: false },
				{ explodable: false, name: 'y', optional: false, prefixLength: undefined, repeatable: false }
			]
		}]);

		// Component with value modifiers
		testParsing('http://example.com/{var:3}', [{
			expression: '{var:3}',
			operator: '',
			variables: [{ explodable: false, name: 'var', optional: false, prefixLength: 3, repeatable: false }]
		}]);

		testParsing('http://example.com/{list*}', [{
			expression: '{list*}',
			operator: '',
			variables: [{ explodable: true, name: 'list', optional: false, prefixLength: undefined, repeatable: true }]
		}]);

		// Multiple components
		testParsing('http://example.com/{x}/path/{y}', [
			{
				expression: '{x}',
				operator: '',
				variables: [{ explodable: false, name: 'x', optional: false, prefixLength: undefined, repeatable: false }]
			},
			{
				expression: '{y}',
				operator: '',
				variables: [{ explodable: false, name: 'y', optional: false, prefixLength: undefined, repeatable: false }]
			}
		]);
	});

	test('Level 1 - Simple string expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!'
		};

		testResolution('{var}', variables, 'value');
		testResolution('{hello}', variables, 'Hello%20World%21');
	});

	test('Level 2 - Reserved expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar'
		};

		testResolution('{+var}', variables, 'value');
		testResolution('{+hello}', variables, 'Hello%20World!');
		testResolution('{+path}/here', variables, '/foo/bar/here');
		testResolution('here?ref={+path}', variables, 'here?ref=/foo/bar');
	});

	test('Level 2 - Fragment expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!'
		};

		testResolution('X{#var}', variables, 'X#value');
		testResolution('X{#hello}', variables, 'X#Hello%20World!');
	});

	test('Level 3 - String expansion with multiple variables', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			empty: '',
			path: '/foo/bar',
			x: '1024',
			y: '768'
		};

		testResolution('map?{x,y}', variables, 'map?1024,768');
		testResolution('{x,hello,y}', variables, '1024,Hello%20World%21,768');
	});

	test('Level 3 - Reserved expansion with multiple variables', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar',
			x: '1024',
			y: '768'
		};

		testResolution('{+x,hello,y}', variables, '1024,Hello%20World!,768');
		testResolution('{+path,x}/here', variables, '/foo/bar,1024/here');
	});

	test('Level 3 - Fragment expansion with multiple variables', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar',
			x: '1024',
			y: '768'
		};

		testResolution('{#x,hello,y}', variables, '#1024,Hello%20World!,768');
		testResolution('{#path,x}/here', variables, '#/foo/bar,1024/here');
	});

	test('Level 3 - Label expansion with dot-prefix', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			x: '1024',
			y: '768'
		};

		testResolution('X{.var}', variables, 'X.value');
		testResolution('X{.x,y}', variables, 'X.1024.768');
	});

	test('Level 3 - Path segments expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			x: '1024'
		};

		testResolution('{/var}', variables, '/value');
		testResolution('{/var,x}/here', variables, '/value/1024/here');
	});

	test('Level 3 - Path-style parameter expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			x: '1024',
			y: '768',
			empty: ''
		};

		testResolution('{;x,y}', variables, ';x=1024;y=768');
		testResolution('{;x,y,empty}', variables, ';x=1024;y=768;empty');
	});

	test('Level 3 - Form-style query expansion', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			x: '1024',
			y: '768',
			empty: ''
		};

		testResolution('{?x,y}', variables, '?x=1024&y=768');
		testResolution('{?x,y,empty}', variables, '?x=1024&y=768&empty=');
	});

	test('Level 3 - Form-style query continuation', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			x: '1024',
			y: '768',
			empty: ''
		};

		testResolution('?fixed=yes{&x}', variables, '?fixed=yes&x=1024');
		testResolution('{&x,y,empty}', variables, '&x=1024&y=768&empty=');
	});

	test('Level 4 - String expansion with value modifiers', () => {
		// Test cases from RFC 6570 Section 1.2
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{var:3}', variables, 'val');
		testResolution('{var:30}', variables, 'value');
		testResolution('{list}', variables, 'red,green,blue');
		testResolution('{list*}', variables, 'red,green,blue');
	});

	test('Level 4 - Reserved expansion with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{+path:6}/here', variables, '/foo/b/here');
		testResolution('{+list}', variables, 'red,green,blue');
		testResolution('{+list*}', variables, 'red,green,blue');
		testResolution('{+keys}', variables, 'semi,;,dot,.,comma,,');
		testResolution('{+keys*}', variables, 'semi=;,dot=.,comma=,');
	});

	test('Level 4 - Fragment expansion with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			hello: 'Hello World!',
			path: '/foo/bar',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{#path:6}/here', variables, '#/foo/b/here');
		testResolution('{#list}', variables, '#red,green,blue');
		testResolution('{#list*}', variables, '#red,green,blue');
		testResolution('{#keys}', variables, '#semi,;,dot,.,comma,,');
		testResolution('{#keys*}', variables, '#semi=;,dot=.,comma=,');
	});

	test('Level 4 - Label expansion with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('X{.var:3}', variables, 'X.val');
		testResolution('X{.list}', variables, 'X.red,green,blue');
		testResolution('X{.list*}', variables, 'X.red.green.blue');
		testResolution('X{.keys}', variables, 'X.semi,;,dot,.,comma,,');
		testResolution('X{.keys*}', variables, 'X.semi=;.dot=..comma=,');
	});

	test('Level 4 - Path expansion with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			list: ['red', 'green', 'blue'],
			path: '/foo/bar',
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{/var:1,var}', variables, '/v/value');
		testResolution('{/list}', variables, '/red,green,blue');
		testResolution('{/list*}', variables, '/red/green/blue');
		testResolution('{/list*,path:4}', variables, '/red/green/blue/%2Ffoo');
		testResolution('{/keys}', variables, '/semi,;,dot,.,comma,,');
		testResolution('{/keys*}', variables, '/semi=%3B/dot=./comma=%2C');
	});

	test('Level 4 - Path-style parameters with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{;hello:5}', { hello: 'Hello World!' }, ';hello=Hello');
		testResolution('{;list}', variables, ';list=red,green,blue');
		testResolution('{;list*}', variables, ';list=red;list=green;list=blue');
		testResolution('{;keys}', variables, ';keys=semi,;,dot,.,comma,,');
		testResolution('{;keys*}', variables, ';semi=;;dot=.;comma=,');
	});

	test('Level 4 - Form-style query with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('{?var:3}', variables, '?var=val');
		testResolution('{?list}', variables, '?list=red,green,blue');
		testResolution('{?list*}', variables, '?list=red&list=green&list=blue');
		testResolution('{?keys}', variables, '?keys=semi,;,dot,.,comma,,');
		testResolution('{?keys*}', variables, '?semi=;&dot=.&comma=,');
	});

	test('Level 4 - Form-style query continuation with value modifiers', () => {
		// Test cases related to Level 4 features
		const variables = {
			var: 'value',
			list: ['red', 'green', 'blue'],
			keys: {
				semi: ';',
				dot: '.',
				comma: ','
			}
		};

		testResolution('?fixed=yes{&var:3}', variables, '?fixed=yes&var=val');
		testResolution('?fixed=yes{&list}', variables, '?fixed=yes&list=red,green,blue');
		testResolution('?fixed=yes{&list*}', variables, '?fixed=yes&list=red&list=green&list=blue');
		testResolution('?fixed=yes{&keys}', variables, '?fixed=yes&keys=semi,;,dot,.,comma,,');
		testResolution('?fixed=yes{&keys*}', variables, '?fixed=yes&semi=;&dot=.&comma=,');
	});

	test('handling undefined or null values', () => {
		// Test handling of undefined/null values for different operators
		const variables = {
			defined: 'value',
			undef: undefined,
			null: null,
			empty: ''
		};

		// Simple string expansion
		testResolution('{defined,undef,null,empty}', variables, 'value,');

		// Reserved expansion
		testResolution('{+defined,undef,null,empty}', variables, 'value,');

		// Fragment expansion
		testResolution('{#defined,undef,null,empty}', variables, '#value,');

		// Label expansion
		testResolution('X{.defined,undef,null,empty}', variables, 'X.value');

		// Path segments
		testResolution('{/defined,undef,null}', variables, '/value');

		// Path-style parameters
		testResolution('{;defined,empty}', variables, ';defined=value;empty');

		// Form-style query
		testResolution('{?defined,undef,null,empty}', variables, '?defined=value&undef=&null=&empty=');

		// Form-style query continuation
		testResolution('{&defined,undef,null,empty}', variables, '&defined=value&undef=&null=&empty=');
	});

	test('complex templates', () => {
		// Test more complex template combinations
		const variables = {
			domain: 'example.com',
			user: 'fred',
			path: ['path', 'to', 'resource'],
			query: 'search',
			page: 5,
			lang: 'en',
			sessionId: '123abc',
			filters: ['color:blue', 'shape:square'],
			coordinates: { lat: '37.7', lon: '-122.4' }
		};

		// RESTful URL pattern
		testResolution('https://{domain}/api/v1/users/{user}{/path*}{?query,page,lang}',
			variables,
			'https://example.com/api/v1/users/fred/path/to/resource?query=search&page=5&lang=en');

		// Complex query parameters
		testResolution('https://{domain}/search{?query,filters,coordinates*}',
			variables,
			'https://example.com/search?query=search&filters=color:blue,shape:square&lat=37.7&lon=-122.4');

		// Multiple expression types
		testResolution('https://{domain}/users/{user}/profile{.lang}{?sessionId}{#path}',
			variables,
			'https://example.com/users/fred/profile.en?sessionId=123abc#path,to,resource');
	});

	test('literals and escaping', () => {
		// Test literal segments and escaping
		testParsing('http://example.com/literal', []);
		testParsing('http://example.com/{var}literal{var2}', [
			{
				expression: '{var}',
				operator: '',
				variables: [{ explodable: false, name: 'var', optional: false, prefixLength: undefined, repeatable: false }]
			},
			{
				expression: '{var2}',
				operator: '',
				variables: [{ explodable: false, name: 'var2', optional: false, prefixLength: undefined, repeatable: false }]
			}
		]);

		// Test that escaped braces are treated as literals
		// Note: The current implementation might not handle this case
		testResolution('http://example.com/{{var}}', { var: 'value' }, 'http://example.com/{var}');
	});

	test('edge cases', () => {
		// Empty template
		testResolution('', {}, '');

		// Template with only literals
		testResolution('http://example.com/path', {}, 'http://example.com/path');

		// No variables provided for resolution
		testResolution('{var}', {}, '');

		// Multiple sequential expressions
		testResolution('{a}{b}{c}', { a: '1', b: '2', c: '3' }, '123');

		// Expressions with special characters in variable names
		testResolution('{_hidden.var-name$}', { '_hidden.var-name$': 'value' }, 'value');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/node/mcpStdioStateHandler.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/node/mcpStdioStateHandler.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import * as assert from 'assert';
import { McpStdioStateHandler } from '../../node/mcpStdioStateHandler.js';
import { isWindows } from '../../../../../base/common/platform.js';

const GRACE_TIME = 100;

suite('McpStdioStateHandler', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	function run(code: string) {
		const child = spawn('node', ['-e', code], {
			stdio: 'pipe',
			env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
		});

		return {
			child,
			handler: store.add(new McpStdioStateHandler(child, GRACE_TIME)),
			processId: new Promise<number>((resolve) => {
				child.on('spawn', () => resolve(child.pid!));
			}),
			output: new Promise<string>((resolve) => {
				let output = '';
				child.stderr.setEncoding('utf-8').on('data', (data) => {
					output += data.toString();
				});
				child.stdout.setEncoding('utf-8').on('data', (data) => {
					output += data.toString();
				});
				child.on('close', () => resolve(output));
			}),
		};
	}

	test('stdin ends process', async () => {
		const { child, handler, output } = run(`
			const data = require('fs').readFileSync(0, 'utf-8');
			process.stdout.write('Data received: ' + data);
			process.on('SIGTERM', () => process.stdout.write('SIGTERM received'));
		`);

		await new Promise<void>(r => child.stdin.write('Hello MCP!', () => r()));
		handler.stop();
		const result = await output;
		assert.strictEqual(result.trim(), 'Data received: Hello MCP!');
	});

	if (!isWindows) {
		test('sigterm after grace', async () => {
			const { handler, output } = run(`
			setInterval(() => {}, 1000);
			process.stdin.on('end', () => process.stdout.write('stdin ended\\n'));
			process.stdin.resume();
			process.on('SIGTERM', () => {
				process.stdout.write('SIGTERM received', () => {
					process.stdout.end(() => process.exit(0));
				});
			});
		`);

			const before = Date.now();
			handler.stop();
			const result = await output;
			const delay = Date.now() - before;
			assert.strictEqual(result.trim(), 'stdin ended\nSIGTERM received');
			assert.ok(delay >= GRACE_TIME, `Expected at least ${GRACE_TIME}ms delay, got ${delay}ms`);
		});
	}

	test('sigkill after grace', async () => {
		const { handler, output } = run(`
			setInterval(() => {}, 1000);
			process.stdin.on('end', () => process.stdout.write('stdin ended\\n'));
			process.stdin.resume();
			process.on('SIGTERM', () => {
				process.stdout.write('SIGTERM received');
			});
		`);

		const before = Date.now();
		handler.stop();
		const result = await output;
		const delay = Date.now() - before;
		if (!isWindows) {
			assert.strictEqual(result.trim(), 'stdin ended\nSIGTERM received');
		} else {
			assert.strictEqual(result.trim(), 'stdin ended');
		}
		assert.ok(delay >= GRACE_TIME * 2, `Expected at least ${GRACE_TIME * 2}ms delay, got ${delay}ms`);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import {
	AcceptAllInput1, AcceptAllInput2, AcceptMerge, CompareInput1WithBaseCommand,
	CompareInput2WithBaseCommand, GoToNextUnhandledConflict, GoToPreviousUnhandledConflict, OpenBaseFile, OpenMergeEditor,
	OpenResultResource, ResetToBaseAndAutoMergeCommand, SetColumnLayout, SetMixedLayout, ShowHideTopBase, ShowHideCenterBase, ShowHideBase,
	ShowNonConflictingChanges, ToggleActiveConflictInput1, ToggleActiveConflictInput2, ResetCloseWithConflictsChoice,
	AcceptAllCombination, ToggleBetweenInputs
} from './commands/commands.js';
import { MergeEditorCopyContentsToJSON, MergeEditorLoadContentsFromFolder, MergeEditorSaveContentsToFolder } from './commands/devCommands.js';
import { MergeEditorInput } from './mergeEditorInput.js';
import { MergeEditor, MergeEditorOpenHandlerContribution, MergeEditorResolverContribution } from './view/mergeEditor.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { MergeEditorSerializer } from './mergeEditorSerializer.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { MergeEditorAccessibilityHelpProvider } from './mergeEditorAccessibilityHelp.js';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		MergeEditor,
		MergeEditor.ID,
		localize('name', "Merge Editor")
	),
	[
		new SyncDescriptor(MergeEditorInput)
	]
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	MergeEditorInput.ID,
	MergeEditorSerializer
);

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	properties: {
		'mergeEditor.diffAlgorithm': {
			type: 'string',
			enum: ['legacy', 'advanced'],
			default: 'advanced',
			markdownEnumDescriptions: [
				localize('diffAlgorithm.legacy', "Uses the legacy diffing algorithm."),
				localize('diffAlgorithm.advanced', "Uses the advanced diffing algorithm."),
			]
		},
		'mergeEditor.showDeletionMarkers': {
			type: 'boolean',
			default: true,
			description: 'Controls if deletions in base or one of the inputs should be indicated by a vertical bar.',
		},
	}
});

registerAction2(OpenResultResource);
registerAction2(SetMixedLayout);
registerAction2(SetColumnLayout);
registerAction2(OpenMergeEditor);
registerAction2(OpenBaseFile);
registerAction2(ShowNonConflictingChanges);
registerAction2(ShowHideBase);
registerAction2(ShowHideTopBase);
registerAction2(ShowHideCenterBase);

registerAction2(GoToNextUnhandledConflict);
registerAction2(GoToPreviousUnhandledConflict);

registerAction2(ToggleActiveConflictInput1);
registerAction2(ToggleActiveConflictInput2);

registerAction2(CompareInput1WithBaseCommand);
registerAction2(CompareInput2WithBaseCommand);

registerAction2(AcceptAllInput1);
registerAction2(AcceptAllInput2);

registerAction2(ResetToBaseAndAutoMergeCommand);

registerAction2(AcceptMerge);
registerAction2(ResetCloseWithConflictsChoice);
registerAction2(AcceptAllCombination);

registerAction2(ToggleBetweenInputs);

// Dev Commands
registerAction2(MergeEditorCopyContentsToJSON);
registerAction2(MergeEditorSaveContentsToFolder);
registerAction2(MergeEditorLoadContentsFromFolder);

Registry
	.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(MergeEditorOpenHandlerContribution, LifecyclePhase.Restored);

registerWorkbenchContribution2(MergeEditorResolverContribution.ID, MergeEditorResolverContribution, WorkbenchPhase.BlockStartup /* only registers an editor resolver */);

AccessibleViewRegistry.register(new MergeEditorAccessibilityHelpProvider());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeEditorAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeEditorAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { localize } from '../../../../nls.js';
import { AccessibleContentProvider, AccessibleViewProviderId, AccessibleViewType } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyEqualsExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';


export class MergeEditorAccessibilityHelpProvider implements IAccessibleViewImplementation {
	readonly name = 'mergeEditor';
	readonly type = AccessibleViewType.Help;
	readonly priority = 125;
	readonly when = ContextKeyEqualsExpr.create('isMergeEditor', true);
	getProvider(accessor: ServicesAccessor) {
		const codeEditorService = accessor.get(ICodeEditorService);

		const codeEditor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!codeEditor) {
			return;
		}

		const content = [
			localize('msg1', "You are in a merge editor."),
			localize('msg2', "Navigate between merge conflicts using the commands Go to Next Unhandled Conflict{0} and Go to Previous Unhandled Conflict{1}.", '<keybinding:merge.goToNextUnhandledConflict>', '<keybinding:merge.goToPreviousUnhandledConflict>'),
			localize('msg3', "Run the command Merge Editor: Accept All Incoming Changes from the Left{0} and Merge Editor: Accept All Current Changes from the Right{1}", '<keybinding:merge.acceptAllInput1>', '<keybinding:merge.acceptAllInput2>'),
			localize('msg4', "Complete the Merge{0}.", '<keybinding:mergeEditor.acceptMerge>'),
			localize('msg5', "Toggle between merge editor inputs, incoming and current changes {0}.", '<keybinding:mergeEditor.toggleBetweenInputs>'),
		];

		return new AccessibleContentProvider(
			AccessibleViewProviderId.MergeEditor,
			{ type: AccessibleViewType.Help },
			() => content.join('\n'),
			() => codeEditor.focus(),
			AccessibilityVerbositySettingId.MergeEditor,
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertFn } from '../../../../base/common/assert.js';
import { autorun } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorInputCapabilities, IResourceMergeEditorInput, IRevertOptions, isResourceMergeEditorInput, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput, IEditorCloseHandler } from '../../../common/editor/editorInput.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';
import { AbstractTextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { IMergeEditorInputModel, TempFileMergeEditorModeFactory, WorkspaceMergeEditorModeFactory } from './mergeEditorInputModel.js';
import { MergeEditorTelemetry } from './telemetry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ILanguageSupport, ITextFileSaveOptions, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { MergeEditorType } from './view/viewModel.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class MergeEditorInputData {
	constructor(
		readonly uri: URI,
		readonly title: string | undefined,
		readonly detail: string | undefined,
		readonly description: string | undefined,
	) { }
}

export class MergeEditorInput extends AbstractTextResourceEditorInput implements ILanguageSupport {
	static readonly ID = 'mergeEditor.Input';

	private _inputModel?: IMergeEditorInputModel;

	private _focusedEditor: MergeEditorType;

	override closeHandler: IEditorCloseHandler;

	private get useWorkingCopy() {
		return this.configurationService.getValue('mergeEditor.useWorkingCopy') ?? false;
	}

	constructor(
		public readonly base: URI,
		public readonly input1: MergeEditorInputData,
		public readonly input2: MergeEditorInputData,
		public readonly result: URI,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IEditorService editorService: IEditorService,
		@ITextFileService textFileService: ITextFileService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService,
		@ILogService private readonly logService: ILogService,
	) {
		super(result, undefined, editorService, textFileService, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
		this._focusedEditor = 'result';
		this.closeHandler = {
			showConfirm: () => this._inputModel?.shouldConfirmClose() ?? false,
			confirm: async (editors) => {
				assertFn(() => editors.every(e => e.editor instanceof MergeEditorInput));
				const inputModels = editors.map(e => (e.editor as MergeEditorInput)._inputModel).filter(isDefined);
				return await this._inputModel!.confirmClose(inputModels);
			},
		};
		this.mergeEditorModeFactory = this._instaService.createInstance(
			this.useWorkingCopy
				? TempFileMergeEditorModeFactory
				: WorkspaceMergeEditorModeFactory,
			this._instaService.createInstance(MergeEditorTelemetry),
		);
	}

	override dispose(): void {
		super.dispose();
	}

	override get typeId(): string {
		return MergeEditorInput.ID;
	}

	override get editorId(): string {
		return DEFAULT_EDITOR_ASSOCIATION.id;
	}

	override get capabilities(): EditorInputCapabilities {
		let capabilities = super.capabilities | EditorInputCapabilities.MultipleEditors;
		if (this.useWorkingCopy) {
			capabilities |= EditorInputCapabilities.Untitled;
		}
		return capabilities;
	}

	override getName(): string {
		return localize('name', "Merging: {0}", super.getName());
	}

	private readonly mergeEditorModeFactory;

	override async resolve(): Promise<IMergeEditorInputModel> {
		if (!this._inputModel) {
			const inputModel = this._register(await this.mergeEditorModeFactory.createInputModel({
				base: this.base,
				input1: this.input1,
				input2: this.input2,
				result: this.result,
			}));
			this._inputModel = inputModel;

			this._register(autorun(reader => {
				/** @description fire dirty event */
				inputModel.isDirty.read(reader);
				this._onDidChangeDirty.fire();
			}));

			await this._inputModel.model.onInitialized;
		}

		return this._inputModel;
	}

	public async accept(): Promise<void> {
		await this._inputModel?.accept();
	}

	override async save(group: number, options?: ITextFileSaveOptions | undefined): Promise<IUntypedEditorInput | undefined> {
		await this._inputModel?.save(options);
		return undefined;
	}

	override toUntyped(): IResourceMergeEditorInput {
		return {
			input1: { resource: this.input1.uri, label: this.input1.title, description: this.input1.description, detail: this.input1.detail },
			input2: { resource: this.input2.uri, label: this.input2.title, description: this.input2.description, detail: this.input2.detail },
			base: { resource: this.base },
			result: { resource: this.result },
			options: {
				override: this.typeId
			}
		};
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}
		if (otherInput instanceof MergeEditorInput) {
			return isEqual(this.base, otherInput.base)
				&& isEqual(this.input1.uri, otherInput.input1.uri)
				&& isEqual(this.input2.uri, otherInput.input2.uri)
				&& isEqual(this.result, otherInput.result);
		}
		if (isResourceMergeEditorInput(otherInput)) {
			return (this.editorId === otherInput.options?.override || otherInput.options?.override === undefined)
				&& isEqual(this.base, otherInput.base.resource)
				&& isEqual(this.input1.uri, otherInput.input1.resource)
				&& isEqual(this.input2.uri, otherInput.input2.resource)
				&& isEqual(this.result, otherInput.result.resource);
		}

		return false;
	}

	override async revert(group: number, options?: IRevertOptions): Promise<void> {
		return this._inputModel?.revert(options);
	}

	// ---- FileEditorInput

	override isDirty(): boolean {
		return this._inputModel?.isDirty.get() ?? false;
	}

	setLanguageId(languageId: string, source?: string): void {
		this._inputModel?.model.setLanguageId(languageId, source);
	}

	/**
	 * Updates the focused editor and triggers a name change event
	 */
	public updateFocusedEditor(editor: MergeEditorType): void {
		if (this._focusedEditor !== editor) {
			this._focusedEditor = editor;
			this.logService.trace('alertFocusedEditor', editor);
			alertFocusedEditor(editor);
		}
	}

	// implement get/set encoding
}

function alertFocusedEditor(editor: MergeEditorType) {
	switch (editor) {
		case 'input1':
			alert(localize('mergeEditor.input1', "Incoming, Left Input"));
			break;
		case 'input2':
			alert(localize('mergeEditor.input2', "Current, Right Input"));
			break;
		case 'result':
			alert(localize('mergeEditor.result', "Merge Result"));
			break;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeEditorInputModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeEditorInputModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertFn } from '../../../../base/common/assert.js';
import { BugIndicatingError, onUnexpectedError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { derived, IObservable, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import Severity from '../../../../base/common/severity.js';
import { URI } from '../../../../base/common/uri.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { ConfirmResult, IDialogService, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IRevertOptions, SaveSourceRegistry } from '../../../common/editor.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { MergeEditorInputData } from './mergeEditorInput.js';
import { conflictMarkers } from './mergeMarkers/mergeMarkersController.js';
import { MergeDiffComputer } from './model/diffComputer.js';
import { InputData, MergeEditorModel } from './model/mergeEditorModel.js';
import { MergeEditorTelemetry } from './telemetry.js';
import { StorageCloseWithConflicts } from '../common/mergeEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ITextFileEditorModel, ITextFileSaveOptions, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';

export interface MergeEditorArgs {
	base: URI;
	input1: MergeEditorInputData;
	input2: MergeEditorInputData;
	result: URI;
}

export interface IMergeEditorInputModelFactory {
	createInputModel(args: MergeEditorArgs): Promise<IMergeEditorInputModel>;
}

export interface IMergeEditorInputModel extends IDisposable {
	readonly resultUri: URI;

	readonly model: MergeEditorModel;
	readonly isDirty: IObservable<boolean>;

	save(options?: ITextFileSaveOptions): Promise<void>;

	/**
	 * If save resets the dirty state, revert must do so too.
	*/
	revert(options?: IRevertOptions): Promise<void>;

	shouldConfirmClose(): boolean;

	confirmClose(inputModels: IMergeEditorInputModel[]): Promise<ConfirmResult>;

	/**
	 * Marks the merge as done. The merge editor must be closed afterwards.
	*/
	accept(): Promise<void>;
}

/* ================ Temp File ================ */

export class TempFileMergeEditorModeFactory implements IMergeEditorInputModelFactory {
	constructor(
		private readonly _mergeEditorTelemetry: MergeEditorTelemetry,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
	) {
	}

	async createInputModel(args: MergeEditorArgs): Promise<IMergeEditorInputModel> {
		const store = new DisposableStore();

		const [
			base,
			result,
			input1Data,
			input2Data,
		] = await Promise.all([
			this._textModelService.createModelReference(args.base),
			this._textModelService.createModelReference(args.result),
			toInputData(args.input1, this._textModelService, store),
			toInputData(args.input2, this._textModelService, store),
		]);

		store.add(base);
		store.add(result);

		const tempResultUri = result.object.textEditorModel.uri.with({ scheme: 'merge-result' });

		const temporaryResultModel = this._modelService.createModel(
			'',
			{
				languageId: result.object.textEditorModel.getLanguageId(),
				onDidChange: Event.None,
			},
			tempResultUri,
		);
		store.add(temporaryResultModel);

		const mergeDiffComputer = this._instantiationService.createInstance(MergeDiffComputer);
		const model = this._instantiationService.createInstance(
			MergeEditorModel,
			base.object.textEditorModel,
			input1Data,
			input2Data,
			temporaryResultModel,
			mergeDiffComputer,
			{
				resetResult: true,
			},
			this._mergeEditorTelemetry,
		);
		store.add(model);

		await model.onInitialized;

		return this._instantiationService.createInstance(TempFileMergeEditorInputModel, model, store, result.object, args.result);
	}
}

class TempFileMergeEditorInputModel extends EditorModel implements IMergeEditorInputModel {
	private readonly savedAltVersionId;
	private readonly altVersionId;

	public readonly isDirty;

	private finished;

	constructor(
		public readonly model: MergeEditorModel,
		private readonly disposable: IDisposable,
		private readonly result: IResolvedTextEditorModel,
		public readonly resultUri: URI,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IDialogService private readonly dialogService: IDialogService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super();
		this.savedAltVersionId = observableValue(this, this.model.resultTextModel.getAlternativeVersionId());
		this.altVersionId = observableFromEvent(this,
			e => this.model.resultTextModel.onDidChangeContent(e),
			() => /** @description getAlternativeVersionId */ this.model.resultTextModel.getAlternativeVersionId()
		);
		this.isDirty = derived(this, (reader) => this.altVersionId.read(reader) !== this.savedAltVersionId.read(reader));
		this.finished = false;
	}

	override dispose(): void {
		this.disposable.dispose();
		super.dispose();
	}

	async accept(): Promise<void> {
		const value = await this.model.resultTextModel.getValue();
		this.result.textEditorModel.setValue(value);
		this.savedAltVersionId.set(this.model.resultTextModel.getAlternativeVersionId(), undefined);
		await this.textFileService.save(this.result.textEditorModel.uri);
		this.finished = true;
	}

	private async _discard(): Promise<void> {
		await this.textFileService.revert(this.model.resultTextModel.uri);
		this.savedAltVersionId.set(this.model.resultTextModel.getAlternativeVersionId(), undefined);
		this.finished = true;
	}

	public shouldConfirmClose(): boolean {
		return true;
	}

	public async confirmClose(inputModels: TempFileMergeEditorInputModel[]): Promise<ConfirmResult> {
		assertFn(
			() => inputModels.some((m) => m === this)
		);

		const someDirty = inputModels.some((m) => m.isDirty.get());
		let choice: ConfirmResult;
		if (someDirty) {
			const isMany = inputModels.length > 1;

			const message = isMany
				? localize('messageN', 'Do you want keep the merge result of {0} files?', inputModels.length)
				: localize('message1', 'Do you want keep the merge result of {0}?', basename(inputModels[0].model.resultTextModel.uri));

			const hasUnhandledConflicts = inputModels.some((m) => m.model.hasUnhandledConflicts.get());

			const buttons: IPromptButton<ConfirmResult>[] = [
				{
					label: hasUnhandledConflicts ?
						localize({ key: 'saveWithConflict', comment: ['&& denotes a mnemonic'] }, "&&Save With Conflicts") :
						localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save"),
					run: () => ConfirmResult.SAVE
				},
				{
					label: localize({ key: 'discard', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save"),
					run: () => ConfirmResult.DONT_SAVE
				}
			];

			choice = (await this.dialogService.prompt<ConfirmResult>({
				type: Severity.Info,
				message,
				detail:
					hasUnhandledConflicts
						? isMany
							? localize('detailNConflicts', "The files contain unhandled conflicts. The merge results will be lost if you don't save them.")
							: localize('detail1Conflicts', "The file contains unhandled conflicts. The merge result will be lost if you don't save it.")
						: isMany
							? localize('detailN', "The merge results will be lost if you don't save them.")
							: localize('detail1', "The merge result will be lost if you don't save it."),
				buttons,
				cancelButton: {
					run: () => ConfirmResult.CANCEL
				}
			})).result;
		} else {
			choice = ConfirmResult.DONT_SAVE;
		}

		if (choice === ConfirmResult.SAVE) {
			// save with conflicts
			await Promise.all(inputModels.map(m => m.accept()));
		} else if (choice === ConfirmResult.DONT_SAVE) {
			// discard changes
			await Promise.all(inputModels.map(m => m._discard()));
		} else {
			// cancel: stay in editor
		}
		return choice;
	}

	public async save(options?: ITextFileSaveOptions): Promise<void> {
		if (this.finished) {
			return;
		}
		// It does not make sense to save anything in the temp file mode.
		// The file stays dirty from the first edit on.

		(async () => {
			const { confirmed } = await this.dialogService.confirm({
				message: localize(
					'saveTempFile.message',
					"Do you want to accept the merge result?"
				),
				detail: localize(
					'saveTempFile.detail',
					"This will write the merge result to the original file and close the merge editor."
				),
				primaryButton: localize({ key: 'acceptMerge', comment: ['&& denotes a mnemonic'] }, '&&Accept Merge')
			});

			if (confirmed) {
				await this.accept();
				const editors = this.editorService.findEditors(this.resultUri).filter(e => e.editor.typeId === 'mergeEditor.Input');
				await this.editorService.closeEditors(editors);
			}
		})();
	}

	public async revert(options?: IRevertOptions): Promise<void> {
		// no op
	}
}

/* ================ Workspace ================ */

export class WorkspaceMergeEditorModeFactory implements IMergeEditorInputModelFactory {
	constructor(
		private readonly _mergeEditorTelemetry: MergeEditorTelemetry,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
	}

	private static readonly FILE_SAVED_SOURCE = SaveSourceRegistry.registerSource('merge-editor.source', localize('merge-editor.source', "Before Resolving Conflicts In Merge Editor"));

	public async createInputModel(args: MergeEditorArgs): Promise<IMergeEditorInputModel> {
		const store = new DisposableStore();

		let [
			base,
			result,
			input1Data,
			input2Data,
		] = await Promise.all([
			this._textModelService.createModelReference(args.base).then<IReference<ITextModel>>(v => ({
				object: v.object.textEditorModel,
				dispose: () => v.dispose(),
			})).catch(e => {
				onUnexpectedError(e);
				console.error(e); // Only file not found error should be handled ideally
				return undefined;
			}),
			this._textModelService.createModelReference(args.result),
			toInputData(args.input1, this._textModelService, store),
			toInputData(args.input2, this._textModelService, store),
		]);

		if (base === undefined) {
			const tm = this._modelService.createModel('', this._languageService.createById(result.object.getLanguageId()));
			base = {
				dispose: () => { tm.dispose(); },
				object: tm
			};
		}

		store.add(base);
		store.add(result);

		const resultTextFileModel = this.textFileService.files.models.find(m =>
			m.resource.toString() === result.object.textEditorModel.uri.toString()
		);
		if (!resultTextFileModel) {
			throw new BugIndicatingError();
		}
		// So that "Don't save" does revert the file
		await resultTextFileModel.save({ source: WorkspaceMergeEditorModeFactory.FILE_SAVED_SOURCE });

		const lines = resultTextFileModel.textEditorModel!.getLinesContent();
		const hasConflictMarkers = lines.some(l => l.startsWith(conflictMarkers.start));
		const resetResult = hasConflictMarkers;

		const mergeDiffComputer = this._instantiationService.createInstance(MergeDiffComputer);

		const model = this._instantiationService.createInstance(
			MergeEditorModel,
			base.object,
			input1Data,
			input2Data,
			result.object.textEditorModel,
			mergeDiffComputer,
			{
				resetResult
			},
			this._mergeEditorTelemetry,
		);
		store.add(model);

		await model.onInitialized;

		return this._instantiationService.createInstance(WorkspaceMergeEditorInputModel, model, store, resultTextFileModel, this._mergeEditorTelemetry);
	}
}

class WorkspaceMergeEditorInputModel extends EditorModel implements IMergeEditorInputModel {
	public readonly isDirty;

	private reported;
	private readonly dateTimeOpened;

	constructor(
		public readonly model: MergeEditorModel,
		private readonly disposableStore: DisposableStore,
		private readonly resultTextFileModel: ITextFileEditorModel,
		private readonly telemetry: MergeEditorTelemetry,
		@IDialogService private readonly _dialogService: IDialogService,
		@IStorageService private readonly _storageService: IStorageService,
	) {
		super();
		this.isDirty = observableFromEvent(this,
			Event.any(this.resultTextFileModel.onDidChangeDirty, this.resultTextFileModel.onDidSaveError),
			() => /** @description isDirty */ this.resultTextFileModel.isDirty()
		);
		this.reported = false;
		this.dateTimeOpened = new Date();
	}

	public override dispose(): void {
		this.disposableStore.dispose();
		super.dispose();

		this.reportClose(false);
	}

	private reportClose(accepted: boolean): void {
		if (!this.reported) {
			const remainingConflictCount = this.model.unhandledConflictsCount.get();
			const durationOpenedMs = new Date().getTime() - this.dateTimeOpened.getTime();
			this.telemetry.reportMergeEditorClosed({
				durationOpenedSecs: durationOpenedMs / 1000,
				remainingConflictCount,
				accepted,

				conflictCount: this.model.conflictCount,
				combinableConflictCount: this.model.combinableConflictCount,

				conflictsResolvedWithBase: this.model.conflictsResolvedWithBase,
				conflictsResolvedWithInput1: this.model.conflictsResolvedWithInput1,
				conflictsResolvedWithInput2: this.model.conflictsResolvedWithInput2,
				conflictsResolvedWithSmartCombination: this.model.conflictsResolvedWithSmartCombination,

				manuallySolvedConflictCountThatEqualNone: this.model.manuallySolvedConflictCountThatEqualNone,
				manuallySolvedConflictCountThatEqualSmartCombine: this.model.manuallySolvedConflictCountThatEqualSmartCombine,
				manuallySolvedConflictCountThatEqualInput1: this.model.manuallySolvedConflictCountThatEqualInput1,
				manuallySolvedConflictCountThatEqualInput2: this.model.manuallySolvedConflictCountThatEqualInput2,

				manuallySolvedConflictCountThatEqualNoneAndStartedWithBase: this.model.manuallySolvedConflictCountThatEqualNoneAndStartedWithBase,
				manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1: this.model.manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1,
				manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2: this.model.manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2,
				manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart: this.model.manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart,
				manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart: this.model.manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart,
			});
			this.reported = true;
		}
	}

	public async accept(): Promise<void> {
		this.reportClose(true);
		await this.resultTextFileModel.save();
	}

	get resultUri(): URI {
		return this.resultTextFileModel.resource;
	}

	async save(options?: ITextFileSaveOptions): Promise<void> {
		await this.resultTextFileModel.save(options);
	}

	/**
	 * If save resets the dirty state, revert must do so too.
	*/
	async revert(options?: IRevertOptions): Promise<void> {
		await this.resultTextFileModel.revert(options);
	}

	shouldConfirmClose(): boolean {
		// Always confirm
		return true;
	}

	async confirmClose(inputModels: IMergeEditorInputModel[]): Promise<ConfirmResult> {
		const isMany = inputModels.length > 1;
		const someDirty = inputModels.some(m => m.isDirty.get());
		const someUnhandledConflicts = inputModels.some(m => m.model.hasUnhandledConflicts.get());
		if (someDirty) {
			const message = isMany
				? localize('workspace.messageN', 'Do you want to save the changes you made to {0} files?', inputModels.length)
				: localize('workspace.message1', 'Do you want to save the changes you made to {0}?', basename(inputModels[0].resultUri));
			const { result } = await this._dialogService.prompt<ConfirmResult>({
				type: Severity.Info,
				message,
				detail:
					someUnhandledConflicts ?
						isMany
							? localize('workspace.detailN.unhandled', "The files contain unhandled conflicts. Your changes will be lost if you don't save them.")
							: localize('workspace.detail1.unhandled', "The file contains unhandled conflicts. Your changes will be lost if you don't save them.")
						: isMany
							? localize('workspace.detailN.handled', "Your changes will be lost if you don't save them.")
							: localize('workspace.detail1.handled', "Your changes will be lost if you don't save them."),
				buttons: [
					{
						label: someUnhandledConflicts
							? localize({ key: 'workspace.saveWithConflict', comment: ['&& denotes a mnemonic'] }, '&&Save with Conflicts')
							: localize({ key: 'workspace.save', comment: ['&& denotes a mnemonic'] }, '&&Save'),
						run: () => ConfirmResult.SAVE
					},
					{
						label: localize({ key: 'workspace.doNotSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save"),
						run: () => ConfirmResult.DONT_SAVE
					}
				],
				cancelButton: {
					run: () => ConfirmResult.CANCEL
				}
			});
			return result;

		} else if (someUnhandledConflicts && !this._storageService.getBoolean(StorageCloseWithConflicts, StorageScope.PROFILE, false)) {
			const { confirmed, checkboxChecked } = await this._dialogService.confirm({
				message: isMany
					? localize('workspace.messageN.nonDirty', 'Do you want to close {0} merge editors?', inputModels.length)
					: localize('workspace.message1.nonDirty', 'Do you want to close the merge editor for {0}?', basename(inputModels[0].resultUri)),
				detail: someUnhandledConflicts ?
					isMany
						? localize('workspace.detailN.unhandled.nonDirty', "The files contain unhandled conflicts.")
						: localize('workspace.detail1.unhandled.nonDirty', "The file contains unhandled conflicts.")
					: undefined,
				primaryButton: someUnhandledConflicts
					? localize({ key: 'workspace.closeWithConflicts', comment: ['&& denotes a mnemonic'] }, '&&Close with Conflicts')
					: localize({ key: 'workspace.close', comment: ['&& denotes a mnemonic'] }, '&&Close'),
				checkbox: { label: localize('noMoreWarn', "Do not ask me again") }
			});

			if (checkboxChecked) {
				this._storageService.store(StorageCloseWithConflicts, true, StorageScope.PROFILE, StorageTarget.USER);
			}

			return confirmed ? ConfirmResult.SAVE : ConfirmResult.CANCEL;
		} else {
			// This shouldn't do anything
			return ConfirmResult.SAVE;
		}
	}
}

/* ================= Utils ================== */

async function toInputData(data: MergeEditorInputData, textModelService: ITextModelService, store: DisposableStore): Promise<InputData> {
	const ref = await textModelService.createModelReference(data.uri);
	store.add(ref);
	return {
		textModel: ref.object.textEditorModel,
		title: data.title,
		description: data.description,
		detail: data.detail,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeEditorSerializer.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeEditorSerializer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { parse } from '../../../../base/common/marshalling.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorSerializer } from '../../../common/editor.js';
import { MergeEditorInput, MergeEditorInputData } from './mergeEditorInput.js';

export class MergeEditorSerializer implements IEditorSerializer {
	canSerialize(): boolean {
		return true;
	}

	serialize(editor: MergeEditorInput): string {
		return JSON.stringify(this.toJSON(editor));
	}

	toJSON(editor: MergeEditorInput): MergeEditorInputJSON {
		return {
			base: editor.base,
			input1: editor.input1,
			input2: editor.input2,
			result: editor.result,
		};
	}

	deserialize(instantiationService: IInstantiationService, raw: string): MergeEditorInput | undefined {
		try {
			const data = <MergeEditorInputJSON>parse(raw);
			return instantiationService.createInstance(
				MergeEditorInput,
				data.base,
				new MergeEditorInputData(data.input1.uri, data.input1.title, data.input1.detail, data.input1.description),
				new MergeEditorInputData(data.input2.uri, data.input2.title, data.input2.detail, data.input2.description),
				data.result
			);
		} catch (err) {
			onUnexpectedError(err);
			return undefined;
		}
	}
}

interface MergeEditorInputJSON {
	base: URI;
	input1: { uri: URI; title?: string; detail?: string; description?: string };
	input2: { uri: URI; title?: string; detail?: string; description?: string };
	result: URI;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/telemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/telemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { InputNumber } from './model/modifiedBaseRange.js';
export class MergeEditorTelemetry {
	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) { }

	reportMergeEditorOpened(args: {
		conflictCount: number;
		combinableConflictCount: number;

		baseVisible: boolean;
		isColumnView: boolean;
		baseTop: boolean;
	}): void {
		this.telemetryService.publicLog2<{
			conflictCount: number;
			combinableConflictCount: number;

			baseVisible: boolean;
			isColumnView: boolean;
			baseTop: boolean;
		}, {
			owner: 'hediet';

			conflictCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts typically occur' };
			combinableConflictCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To evaluate how useful the smart-merge feature is' };

			baseVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many users use the base view to solve a conflict' };
			isColumnView: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To gain insight which layout should be default' };
			baseTop: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To gain insight which layout should be default for the base view' };

			comment: 'This event tracks when a user opens a 3 way merge editor. The associated data helps to fine-tune the merge editor.';
		}>('mergeEditor.opened', {
			conflictCount: args.conflictCount,
			combinableConflictCount: args.combinableConflictCount,

			baseVisible: args.baseVisible,
			isColumnView: args.isColumnView,
			baseTop: args.baseTop,
		});
	}

	reportLayoutChange(args: {
		baseVisible: boolean;
		isColumnView: boolean;
		baseTop: boolean;
	}): void {
		this.telemetryService.publicLog2<{
			baseVisible: boolean;
			isColumnView: boolean;
			baseTop: boolean;
		}, {
			owner: 'hediet';

			baseVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many users use the base view to solve a conflict' };
			isColumnView: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To gain insight which layout should be default' };
			baseTop: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To gain insight which layout should be default for the base view' };

			comment: 'This event tracks when a user changes the layout of the 3 way merge editor. This is useful to understand what layout should be default.';
		}>('mergeEditor.layoutChanged', {
			baseVisible: args.baseVisible,
			isColumnView: args.isColumnView,
			baseTop: args.baseTop,
		});
	}

	reportMergeEditorClosed(args: {
		conflictCount: number;
		combinableConflictCount: number;

		durationOpenedSecs: number;
		remainingConflictCount: number;
		accepted: boolean;

		conflictsResolvedWithBase: number;
		conflictsResolvedWithInput1: number;
		conflictsResolvedWithInput2: number;
		conflictsResolvedWithSmartCombination: number;

		manuallySolvedConflictCountThatEqualNone: number;
		manuallySolvedConflictCountThatEqualSmartCombine: number;
		manuallySolvedConflictCountThatEqualInput1: number;
		manuallySolvedConflictCountThatEqualInput2: number;

		manuallySolvedConflictCountThatEqualNoneAndStartedWithBase: number;
		manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1: number;
		manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2: number;
		manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart: number;
		manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart: number;
	}): void {
		this.telemetryService.publicLog2<{
			conflictCount: number;
			combinableConflictCount: number;

			durationOpenedSecs: number;
			remainingConflictCount: number;
			accepted: boolean;

			conflictsResolvedWithBase: number;
			conflictsResolvedWithInput1: number;
			conflictsResolvedWithInput2: number;
			conflictsResolvedWithSmartCombination: number;

			manuallySolvedConflictCountThatEqualNone: number;
			manuallySolvedConflictCountThatEqualSmartCombine: number;
			manuallySolvedConflictCountThatEqualInput1: number;
			manuallySolvedConflictCountThatEqualInput2: number;

			manuallySolvedConflictCountThatEqualNoneAndStartedWithBase: number;
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1: number;
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2: number;
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart: number;
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart: number;
		}, {
			owner: 'hediet';

			conflictCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts typically occur' };
			combinableConflictCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To evaluate how useful the smart-merge feature is' };

			durationOpenedSecs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how long the merge editor was open before it was closed. This can be compared with the inline experience to investigate time savings.' };
			remainingConflictCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many conflicts were skipped. Should be zero for a successful merge.' };
			accepted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user completed the merge successfully or just closed the editor' };

			conflictsResolvedWithBase: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts are resolved with base' };
			conflictsResolvedWithInput1: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts are resolved with input1' };
			conflictsResolvedWithInput2: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts are resolved with input2' };
			conflictsResolvedWithSmartCombination: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how many conflicts are resolved with smart combination' };

			manuallySolvedConflictCountThatEqualNone: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many conflicts were solved manually that are not recognized by the merge editor.' };
			manuallySolvedConflictCountThatEqualSmartCombine: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many conflicts were solved manually that equal the smart combination of the inputs.' };
			manuallySolvedConflictCountThatEqualInput1: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many conflicts were solved manually that equal just input 1' };
			manuallySolvedConflictCountThatEqualInput2: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many conflicts were solved manually that equal just input 2' };

			manuallySolvedConflictCountThatEqualNoneAndStartedWithBase: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many manually solved conflicts that are not recognized started with base' };
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many manually solved conflicts that are not recognized started with input1' };
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many manually solved conflicts that are not recognized started with input2' };
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many manually solved conflicts that are not recognized started with both (non-smart combination)' };
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates how many manually solved conflicts that are not recognized started with both (smart-combination)' };

			comment: 'This event tracks when a user closes a merge editor. It also tracks how the user solved the merge conflicts. This data can be used to improve the UX of the merge editor. This event will be fired rarely (less than 200k per week)';
		}>('mergeEditor.closed', {
			conflictCount: args.conflictCount,
			combinableConflictCount: args.combinableConflictCount,

			durationOpenedSecs: args.durationOpenedSecs,
			remainingConflictCount: args.remainingConflictCount,
			accepted: args.accepted,

			conflictsResolvedWithBase: args.conflictsResolvedWithBase,
			conflictsResolvedWithInput1: args.conflictsResolvedWithInput1,
			conflictsResolvedWithInput2: args.conflictsResolvedWithInput2,
			conflictsResolvedWithSmartCombination: args.conflictsResolvedWithSmartCombination,

			manuallySolvedConflictCountThatEqualNone: args.manuallySolvedConflictCountThatEqualNone,
			manuallySolvedConflictCountThatEqualSmartCombine: args.manuallySolvedConflictCountThatEqualSmartCombine,
			manuallySolvedConflictCountThatEqualInput1: args.manuallySolvedConflictCountThatEqualInput1,
			manuallySolvedConflictCountThatEqualInput2: args.manuallySolvedConflictCountThatEqualInput2,

			manuallySolvedConflictCountThatEqualNoneAndStartedWithBase: args.manuallySolvedConflictCountThatEqualNoneAndStartedWithBase,
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1: args.manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1,
			manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2: args.manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2,
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart: args.manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart,
			manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart: args.manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart,
		});
	}

	reportAcceptInvoked(inputNumber: InputNumber, otherAccepted: boolean): void {
		this.telemetryService.publicLog2<{
			otherAccepted: boolean;
			isInput1: boolean;
		}, {
			owner: 'hediet';
			otherAccepted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user already accepted the other side' };
			isInput1: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user accepted input 1 or input 2' };
			comment: 'This event tracks when a user accepts one side of a conflict.';
		}>('mergeEditor.action.accept', {
			otherAccepted: otherAccepted,
			isInput1: inputNumber === 1,
		});
	}

	reportSmartCombinationInvoked(otherAccepted: boolean): void {
		this.telemetryService.publicLog2<{
			otherAccepted: boolean;
		}, {
			owner: 'hediet';
			otherAccepted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user immediately clicks on accept both or only after the other side has been accepted' };
			comment: 'This event tracks when the user clicks on "Accept Both".';
		}>('mergeEditor.action.smartCombination', {
			otherAccepted: otherAccepted,
		});
	}

	reportRemoveInvoked(inputNumber: InputNumber, otherAccepted: boolean): void {
		this.telemetryService.publicLog2<{
			otherAccepted: boolean;
			isInput1: boolean;
		}, {
			owner: 'hediet';
			otherAccepted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user accepted the other side' };
			isInput1: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the user accepted input 1 or input 2' };
			comment: 'This event tracks when a user un-accepts one side of a conflict.';
		}>('mergeEditor.action.remove', {
			otherAccepted: otherAccepted,
			isInput1: inputNumber === 1,
		});
	}

	reportResetToBaseInvoked(): void {
		this.telemetryService.publicLog2<{
		}, {
			owner: 'hediet';
			comment: 'This event tracks when the user invokes "Reset To Base".';
		}>('mergeEditor.action.resetToBase', {});
	}

	reportNavigationToNextConflict(): void {
		this.telemetryService.publicLog2<{
		}, {
			owner: 'hediet';
			comment: 'This event tracks when the user navigates to the next conflict".';
		}>('mergeEditor.action.goToNextConflict', {

		});
	}

	reportNavigationToPreviousConflict(): void {
		this.telemetryService.publicLog2<{

		}, {
			owner: 'hediet';
			comment: 'This event tracks when the user navigates to the previous conflict".';
		}>('mergeEditor.action.goToPreviousConflict', {

		});
	}

	reportConflictCounterClicked(): void {
		this.telemetryService.publicLog2<{
		}, {
			owner: 'hediet';
			comment: 'This event tracks when the user clicks on the conflict counter to navigate to the next conflict.';
		}>('mergeEditor.action.conflictCounterClicked', {});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/utils.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ArrayQueue, CompareResult } from '../../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, autorunOpts } from '../../../../base/common/observable.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IModelDeltaDecoration } from '../../../../editor/common/model.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export function setStyle(
	element: HTMLElement,
	style: {
		width?: number | string;
		height?: number | string;
		left?: number | string;
		top?: number | string;
	}
): void {
	Object.entries(style).forEach(([key, value]) => {
		element.style.setProperty(key, toSize(value));
	});
}

function toSize(value: number | string): string {
	return typeof value === 'number' ? `${value}px` : value;
}

export function applyObservableDecorations(editor: CodeEditorWidget, decorations: IObservable<IModelDeltaDecoration[]>): IDisposable {
	const d = new DisposableStore();
	let decorationIds: string[] = [];
	d.add(autorunOpts({ debugName: () => `Apply decorations from ${decorations.debugName}` }, reader => {
		const d = decorations.read(reader);
		editor.changeDecorations(a => {
			decorationIds = a.deltaDecorations(decorationIds, d);
		});
	}));
	d.add({
		dispose: () => {
			editor.changeDecorations(a => {
				decorationIds = a.deltaDecorations(decorationIds, []);
			});
		}
	});
	return d;
}

export function* leftJoin<TLeft, TRight>(
	left: Iterable<TLeft>,
	right: readonly TRight[],
	compare: (left: TLeft, right: TRight) => CompareResult,
): IterableIterator<{ left: TLeft; rights: TRight[] }> {
	const rightQueue = new ArrayQueue(right);
	for (const leftElement of left) {
		rightQueue.takeWhile(rightElement => CompareResult.isGreaterThan(compare(leftElement, rightElement)));
		const equals = rightQueue.takeWhile(rightElement => CompareResult.isNeitherLessOrGreaterThan(compare(leftElement, rightElement)));
		yield { left: leftElement, rights: equals || [] };
	}
}

export function* join<TLeft, TRight>(
	left: Iterable<TLeft>,
	right: readonly TRight[],
	compare: (left: TLeft, right: TRight) => CompareResult,
): IterableIterator<{ left?: TLeft; rights: TRight[] }> {
	const rightQueue = new ArrayQueue(right);
	for (const leftElement of left) {
		const skipped = rightQueue.takeWhile(rightElement => CompareResult.isGreaterThan(compare(leftElement, rightElement)));
		if (skipped) {
			yield { rights: skipped };
		}
		const equals = rightQueue.takeWhile(rightElement => CompareResult.isNeitherLessOrGreaterThan(compare(leftElement, rightElement)));
		yield { left: leftElement, rights: equals || [] };
	}
}

export function elementAtOrUndefined<T>(arr: T[], index: number): T | undefined {
	return arr[index];
}

export function setFields<T extends {}>(obj: T, fields: Partial<T>): T {
	return Object.assign(obj, fields);
}

export function deepMerge<T extends {}>(source1: T, source2: Partial<T>): T {
	// eslint-disable-next-line local/code-no-any-casts
	const result = {} as any as T;
	for (const key in source1) {
		result[key] = source1[key];
	}
	for (const key in source2) {
		const source2Value = source2[key];
		if (typeof result[key] === 'object' && source2Value && typeof source2Value === 'object') {
			result[key] = deepMerge<any>(result[key], source2Value);
		} else {
			// eslint-disable-next-line local/code-no-any-casts
			result[key] = source2Value as any;
		}
	}
	return result;
}

export class PersistentStore<T> {
	private hasValue = false;
	private value: Readonly<T> | undefined = undefined;

	constructor(
		private readonly key: string,
		@IStorageService private readonly storageService: IStorageService
	) { }

	public get(): Readonly<T> | undefined {
		if (!this.hasValue) {
			const value = this.storageService.get(this.key, StorageScope.PROFILE);
			if (value !== undefined) {
				try {
					// eslint-disable-next-line local/code-no-any-casts
					this.value = JSON.parse(value) as any;
				} catch (e) {
					onUnexpectedError(e);
				}
			}
			this.hasValue = true;
		}

		return this.value;
	}

	public set(newValue: T | undefined): void {
		this.value = newValue;

		this.storageService.store(
			this.key,
			JSON.stringify(this.value),
			StorageScope.PROFILE,
			StorageTarget.USER
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/commands/commands.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/commands/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { basename } from '../../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ILocalizedString } from '../../../../../platform/action/common/action.js';
import { Action2, IAction2Options, MenuId } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IEditorIdentifier, IResourceMergeEditorInput } from '../../../../common/editor.js';
import { MergeEditorInput, MergeEditorInputData } from '../mergeEditorInput.js';
import { IMergeEditorInputModel } from '../mergeEditorInputModel.js';
import { MergeEditor } from '../view/mergeEditor.js';
import { MergeEditorViewModel } from '../view/viewModel.js';
import { ctxIsMergeEditor, ctxMergeEditorLayout, ctxMergeEditorShowBase, ctxMergeEditorShowBaseAtTop, ctxMergeEditorShowNonConflictingChanges, StorageCloseWithConflicts } from '../../common/mergeEditor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { transaction } from '../../../../../base/common/observable.js';
import { ModifiedBaseRangeStateKind } from '../model/modifiedBaseRange.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';

abstract class MergeEditorAction extends Action2 {
	constructor(desc: Readonly<IAction2Options>) {
		super(desc);
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			const vm = activeEditorPane.viewModel.get();
			if (!vm) {
				return;
			}
			this.runWithViewModel(vm, accessor);
		}
	}

	abstract runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void;
}

interface MergeEditorAction2Args {
	inputModel: IMergeEditorInputModel;
	viewModel: MergeEditorViewModel;
	input: MergeEditorInput;
	editorIdentifier: IEditorIdentifier;
}

abstract class MergeEditorAction2 extends Action2 {
	constructor(desc: Readonly<IAction2Options>) {
		super(desc);
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			const vm = activeEditorPane.viewModel.get();
			if (!vm) {
				return;
			}

			// eslint-disable-next-line local/code-no-any-casts
			return this.runWithMergeEditor({
				viewModel: vm,
				inputModel: activeEditorPane.inputModel.get()!,
				input: activeEditorPane.input as MergeEditorInput,
				editorIdentifier: {
					editor: activeEditorPane.input,
					groupId: activeEditorPane.group.id,
				}
			}, accessor, ...args) as any;
		}
	}

	abstract runWithMergeEditor(context: MergeEditorAction2Args, accessor: ServicesAccessor, ...args: unknown[]): unknown;
}

export class OpenMergeEditor extends Action2 {
	constructor() {
		super({
			id: '_open.mergeEditor',
			title: localize2('title', 'Open Merge Editor'),
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const validatedArgs = IRelaxedOpenArgs.validate(args[0]);

		const input: IResourceMergeEditorInput = {
			base: { resource: validatedArgs.base },
			input1: { resource: validatedArgs.input1.uri, label: validatedArgs.input1.title, description: validatedArgs.input1.description, detail: validatedArgs.input1.detail },
			input2: { resource: validatedArgs.input2.uri, label: validatedArgs.input2.title, description: validatedArgs.input2.description, detail: validatedArgs.input2.detail },
			result: { resource: validatedArgs.output },
			options: { preserveFocus: true }
		};
		accessor.get(IEditorService).openEditor(input);
	}
}

namespace IRelaxedOpenArgs {
	export function validate(obj: unknown): {
		base: URI;
		input1: MergeEditorInputData;
		input2: MergeEditorInputData;
		output: URI;
	} {
		if (!obj || typeof obj !== 'object') {
			throw new TypeError('invalid argument');
		}

		const o = obj as IRelaxedOpenArgs;
		const base = toUri(o.base);
		const output = toUri(o.output);
		const input1 = toInputData(o.input1);
		const input2 = toInputData(o.input2);
		return { base, input1, input2, output };
	}

	function toInputData(obj: unknown): MergeEditorInputData {
		if (typeof obj === 'string') {
			return new MergeEditorInputData(URI.parse(obj, true), undefined, undefined, undefined);
		}
		if (!obj || typeof obj !== 'object') {
			throw new TypeError('invalid argument');
		}

		if (isUriComponents(obj)) {
			return new MergeEditorInputData(URI.revive(obj), undefined, undefined, undefined);
		}

		const o = obj as IRelaxedInputData;
		const title = o.title;
		const uri = toUri(o.uri);
		const detail = o.detail;
		const description = o.description;
		return new MergeEditorInputData(uri, title, detail, description);
	}

	function toUri(obj: unknown): URI {
		if (typeof obj === 'string') {
			return URI.parse(obj, true);
		} else if (obj && typeof obj === 'object') {
			return URI.revive(<UriComponents>obj);
		}
		throw new TypeError('invalid argument');
	}

	function isUriComponents(obj: unknown): obj is UriComponents {
		if (!obj || typeof obj !== 'object') {
			return false;
		}
		const o = obj as UriComponents;
		return typeof o.scheme === 'string'
			&& typeof o.authority === 'string'
			&& typeof o.path === 'string'
			&& typeof o.query === 'string'
			&& typeof o.fragment === 'string';
	}
}

type IRelaxedInputData = { uri: UriComponents; title?: string; detail?: string; description?: string };

type IRelaxedOpenArgs = {
	base: UriComponents | string;
	input1: IRelaxedInputData | string;
	input2: IRelaxedInputData | string;
	output: UriComponents | string;
};

export class SetMixedLayout extends Action2 {
	constructor() {
		super({
			id: 'merge.mixedLayout',
			title: localize2('layout.mixed', "Mixed Layout"),
			toggled: ctxMergeEditorLayout.isEqualTo('mixed'),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ctxIsMergeEditor,
					group: '1_merge',
					order: 9,
				},
			],
			precondition: ctxIsMergeEditor,
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.setLayoutKind('mixed');
		}
	}
}

export class SetColumnLayout extends Action2 {
	constructor() {
		super({
			id: 'merge.columnLayout',
			title: localize2('layout.column', 'Column Layout'),
			toggled: ctxMergeEditorLayout.isEqualTo('columns'),
			menu: [{
				id: MenuId.EditorTitle,
				when: ctxIsMergeEditor,
				group: '1_merge',
				order: 10,
			}],
			precondition: ctxIsMergeEditor,
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.setLayoutKind('columns');
		}
	}
}

export class ShowNonConflictingChanges extends Action2 {
	constructor() {
		super({
			id: 'merge.showNonConflictingChanges',
			title: localize2('showNonConflictingChanges', "Show Non-Conflicting Changes"),
			toggled: ctxMergeEditorShowNonConflictingChanges.isEqualTo(true),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ctxIsMergeEditor,
					group: '3_merge',
					order: 9,
				},
			],
			precondition: ctxIsMergeEditor,
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.toggleShowNonConflictingChanges();
		}
	}
}

export class ShowHideBase extends Action2 {
	constructor() {
		super({
			id: 'merge.showBase',
			title: localize2('layout.showBase', "Show Base"),
			toggled: ctxMergeEditorShowBase.isEqualTo(true),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(ctxIsMergeEditor, ctxMergeEditorLayout.isEqualTo('columns')),
					group: '2_merge',
					order: 9,
				},
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.toggleBase();
		}
	}
}

export class ShowHideTopBase extends Action2 {
	constructor() {
		super({
			id: 'merge.showBaseTop',
			title: localize2('layout.showBaseTop', "Show Base Top"),
			toggled: ContextKeyExpr.and(ctxMergeEditorShowBase, ctxMergeEditorShowBaseAtTop),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(ctxIsMergeEditor, ctxMergeEditorLayout.isEqualTo('mixed')),
					group: '2_merge',
					order: 10,
				},
			],
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.toggleShowBaseTop();
		}
	}
}

export class ShowHideCenterBase extends Action2 {
	constructor() {
		super({
			id: 'merge.showBaseCenter',
			title: localize2('layout.showBaseCenter', "Show Base Center"),
			toggled: ContextKeyExpr.and(ctxMergeEditorShowBase, ctxMergeEditorShowBaseAtTop.negate()),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(ctxIsMergeEditor, ctxMergeEditorLayout.isEqualTo('mixed')),
					group: '2_merge',
					order: 11,
				},
			],
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			activeEditorPane.toggleShowBaseCenter();
		}
	}
}

const mergeEditorCategory: ILocalizedString = localize2('mergeEditor', "Merge Editor");

export class OpenResultResource extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.openResult',
			icon: Codicon.goToFile,
			title: localize2('openfile', "Open File"),
			category: mergeEditorCategory,
			menu: [{
				id: MenuId.EditorTitle,
				when: ctxIsMergeEditor,
				group: 'navigation',
				order: 1,
			}],
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		editorService.openEditor({ resource: viewModel.model.resultTextModel.uri });
	}
}

export class GoToNextUnhandledConflict extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.goToNextUnhandledConflict',
			category: mergeEditorCategory,
			title: localize2('merge.goToNextUnhandledConflict', "Go to Next Unhandled Conflict"),
			icon: Codicon.arrowDown,
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ctxIsMergeEditor,
					group: 'navigation',
					order: 3
				},
			],
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.model.telemetry.reportNavigationToNextConflict();
		viewModel.goToNextModifiedBaseRange(r => !viewModel.model.isHandled(r).get());
	}
}

export class GoToPreviousUnhandledConflict extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.goToPreviousUnhandledConflict',
			category: mergeEditorCategory,
			title: localize2('merge.goToPreviousUnhandledConflict', "Go to Previous Unhandled Conflict"),
			icon: Codicon.arrowUp,
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ctxIsMergeEditor,
					group: 'navigation',
					order: 2
				},
			],
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.model.telemetry.reportNavigationToPreviousConflict();
		viewModel.goToPreviousModifiedBaseRange(r => !viewModel.model.isHandled(r).get());
	}
}

export class ToggleActiveConflictInput1 extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.toggleActiveConflictInput1',
			category: mergeEditorCategory,
			title: localize2('merge.toggleCurrentConflictFromLeft', "Toggle Current Conflict from Left"),
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.toggleActiveConflict(1);
	}
}

export class ToggleActiveConflictInput2 extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.toggleActiveConflictInput2',
			category: mergeEditorCategory,
			title: localize2('merge.toggleCurrentConflictFromRight', "Toggle Current Conflict from Right"),
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.toggleActiveConflict(2);
	}
}

export class CompareInput1WithBaseCommand extends MergeEditorAction {
	constructor() {
		super({
			id: 'mergeEditor.compareInput1WithBase',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.compareInput1WithBase', "Compare Input 1 With Base"),
			shortTitle: localize('mergeEditor.compareWithBase', 'Compare With Base'),
			f1: true,
			precondition: ctxIsMergeEditor,
			menu: { id: MenuId.MergeInput1Toolbar, group: 'primary' },
			icon: Codicon.compareChanges,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		mergeEditorCompare(viewModel, editorService, 1);
	}
}

export class CompareInput2WithBaseCommand extends MergeEditorAction {
	constructor() {
		super({
			id: 'mergeEditor.compareInput2WithBase',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.compareInput2WithBase', "Compare Input 2 With Base"),
			shortTitle: localize('mergeEditor.compareWithBase', 'Compare With Base'),
			f1: true,
			precondition: ctxIsMergeEditor,
			menu: { id: MenuId.MergeInput2Toolbar, group: 'primary' },
			icon: Codicon.compareChanges,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		mergeEditorCompare(viewModel, editorService, 2);
	}
}

async function mergeEditorCompare(viewModel: MergeEditorViewModel, editorService: IEditorService, inputNumber: 1 | 2) {

	editorService.openEditor(editorService.activeEditor!, { pinned: true });

	const model = viewModel.model;
	const base = model.base;
	const input = inputNumber === 1 ? viewModel.inputCodeEditorView1.editor : viewModel.inputCodeEditorView2.editor;

	const lineNumber = input.getPosition()!.lineNumber;
	await editorService.openEditor({
		original: { resource: base.uri },
		modified: { resource: input.getModel()!.uri },
		options: {
			selection: {
				startLineNumber: lineNumber,
				startColumn: 1,
			},
			revealIfOpened: true,
			revealIfVisible: true,
		} satisfies ITextEditorOptions
	});
}

export class OpenBaseFile extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.openBaseEditor',
			category: mergeEditorCategory,
			title: localize2('merge.openBaseEditor', "Open Base File"),
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void {
		const openerService = accessor.get(IOpenerService);
		openerService.open(viewModel.model.base.uri);
	}
}

export class AcceptAllInput1 extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.acceptAllInput1',
			category: mergeEditorCategory,
			title: localize2('merge.acceptAllInput1', "Accept All Incoming Changes from Left"),
			f1: true,
			precondition: ctxIsMergeEditor,
			menu: { id: MenuId.MergeInput1Toolbar, group: 'primary' },
			icon: Codicon.checkAll,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.acceptAll(1);
	}
}

export class AcceptAllInput2 extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.acceptAllInput2',
			category: mergeEditorCategory,
			title: localize2('merge.acceptAllInput2', "Accept All Current Changes from Right"),
			f1: true,
			precondition: ctxIsMergeEditor,
			menu: { id: MenuId.MergeInput2Toolbar, group: 'primary' },
			icon: Codicon.checkAll,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel): void {
		viewModel.acceptAll(2);
	}
}

export class ResetToBaseAndAutoMergeCommand extends MergeEditorAction {
	constructor() {
		super({
			id: 'mergeEditor.resetResultToBaseAndAutoMerge',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.resetResultToBaseAndAutoMerge', "Reset Result"),
			shortTitle: localize('mergeEditor.resetResultToBaseAndAutoMerge.short', 'Reset'),
			f1: true,
			precondition: ctxIsMergeEditor,
			menu: { id: MenuId.MergeInputResultToolbar, group: 'primary' },
			icon: Codicon.discard,
		});
	}

	override runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void {
		viewModel.model.reset();
	}
}

export class ResetCloseWithConflictsChoice extends Action2 {
	constructor() {
		super({
			id: 'mergeEditor.resetCloseWithConflictsChoice',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.resetChoice', "Reset Choice for \'Close with Conflicts\'"),
			f1: true,
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IStorageService).remove(StorageCloseWithConflicts, StorageScope.PROFILE);
	}
}

export class AcceptAllCombination extends MergeEditorAction2 {
	constructor() {
		super({
			id: 'mergeEditor.acceptAllCombination',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.acceptAllCombination', "Accept All Combination"),
			f1: true,
		});
	}

	override runWithMergeEditor(context: MergeEditorAction2Args, accessor: ServicesAccessor, ...args: unknown[]) {
		const { viewModel } = context;
		const modifiedBaseRanges = viewModel.model.modifiedBaseRanges.get();
		const model = viewModel.model;
		transaction((tx) => {
			for (const m of modifiedBaseRanges) {
				const state = model.getState(m).get();
				if (state.kind !== ModifiedBaseRangeStateKind.unrecognized && !state.isInputIncluded(1) && (!state.isInputIncluded(2) || !viewModel.shouldUseAppendInsteadOfAccept.get()) && m.canBeCombined) {
					model.setState(
						m,
						state
							.withInputValue(1, true)
							.withInputValue(2, true, true),
						true,
						tx
					);
					model.telemetry.reportSmartCombinationInvoked(state.includesInput(2));
				}
			}
		});
		return { success: true };

	}
}

// this is an API command
export class AcceptMerge extends MergeEditorAction2 {
	constructor() {
		super({
			id: 'mergeEditor.acceptMerge',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.acceptMerge', "Complete Merge"),
			f1: true,
			precondition: ctxIsMergeEditor,
			keybinding: [
				{
					primary: KeyMod.CtrlCmd | KeyCode.Enter,
					weight: KeybindingWeight.EditorContrib,
					when: ctxIsMergeEditor,
				}
			]
		});
	}

	override async runWithMergeEditor({ inputModel, editorIdentifier, viewModel }: MergeEditorAction2Args, accessor: ServicesAccessor) {
		const dialogService = accessor.get(IDialogService);
		const editorService = accessor.get(IEditorService);

		if (viewModel.model.unhandledConflictsCount.get() > 0) {
			const { confirmed } = await dialogService.confirm({
				message: localize('mergeEditor.acceptMerge.unhandledConflicts.message', "Do you want to complete the merge of {0}?", basename(inputModel.resultUri)),
				detail: localize('mergeEditor.acceptMerge.unhandledConflicts.detail', "The file contains unhandled conflicts."),
				primaryButton: localize({ key: 'mergeEditor.acceptMerge.unhandledConflicts.accept', comment: ['&& denotes a mnemonic'] }, "&&Complete with Conflicts")
			});

			if (!confirmed) {
				return {
					successful: false
				};
			}
		}

		await inputModel.accept();
		await editorService.closeEditor(editorIdentifier);

		return {
			successful: true
		};
	}
}

export class ToggleBetweenInputs extends MergeEditorAction2 {
	constructor() {
		super({
			id: 'mergeEditor.toggleBetweenInputs',
			category: mergeEditorCategory,
			title: localize2('mergeEditor.toggleBetweenInputs', "Toggle Between Merge Editor Inputs"),
			f1: true,
			precondition: ctxIsMergeEditor,
			keybinding: [
				{
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyT,
					// Override reopen closed editor
					weight: KeybindingWeight.WorkbenchContrib + 10,
					when: ctxIsMergeEditor,
				}
			]
		});
	}

	override runWithMergeEditor({ viewModel }: MergeEditorAction2Args, accessor: ServicesAccessor) {
		const input1IsFocused = viewModel.inputCodeEditorView1.editor.hasWidgetFocus();

		// Toggle focus between inputs
		if (input1IsFocused) {
			viewModel.inputCodeEditorView2.editor.focus();
		} else {
			viewModel.inputCodeEditorView1.editor.focus();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/commands/devCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/commands/devCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ILocalizedString } from '../../../../../platform/action/common/action.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IFileDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IResourceMergeEditorInput } from '../../../../common/editor.js';
import { MergeEditor } from '../view/mergeEditor.js';
import { ctxIsMergeEditor, MergeEditorContents } from '../../common/mergeEditor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

const MERGE_EDITOR_CATEGORY: ILocalizedString = localize2('mergeEditor', 'Merge Editor (Dev)');

export class MergeEditorCopyContentsToJSON extends Action2 {
	constructor() {
		super({
			id: 'merge.dev.copyContentsJson',
			category: MERGE_EDITOR_CATEGORY,
			title: localize2('merge.dev.copyState', "Copy Merge Editor State as JSON"),
			icon: Codicon.layoutCentered,
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		const clipboardService = accessor.get(IClipboardService);
		const notificationService = accessor.get(INotificationService);

		if (!(activeEditorPane instanceof MergeEditor)) {
			notificationService.info({
				name: localize('mergeEditor.name', 'Merge Editor'),
				message: localize('mergeEditor.noActiveMergeEditor', "No active merge editor")
			});
			return;
		}
		const model = activeEditorPane.model;
		if (!model) {
			return;
		}
		const contents: MergeEditorContents = {
			languageId: model.resultTextModel.getLanguageId(),
			base: model.base.getValue(),
			input1: model.input1.textModel.getValue(),
			input2: model.input2.textModel.getValue(),
			result: model.resultTextModel.getValue(),
			initialResult: model.getInitialResultValue(),
		};
		const jsonStr = JSON.stringify(contents, undefined, 4);
		clipboardService.writeText(jsonStr);

		notificationService.info({
			name: localize('mergeEditor.name', 'Merge Editor'),
			message: localize('mergeEditor.successfullyCopiedMergeEditorContents', "Successfully copied merge editor state"),
		});
	}
}

export class MergeEditorSaveContentsToFolder extends Action2 {
	constructor() {
		super({
			id: 'merge.dev.saveContentsToFolder',
			category: MERGE_EDITOR_CATEGORY,
			title: localize2('merge.dev.saveContentsToFolder', "Save Merge Editor State to Folder"),
			icon: Codicon.layoutCentered,
			f1: true,
			precondition: ctxIsMergeEditor,
		});
	}

	async run(accessor: ServicesAccessor) {
		const { activeEditorPane } = accessor.get(IEditorService);
		const notificationService = accessor.get(INotificationService);
		const dialogService = accessor.get(IFileDialogService);
		const fileService = accessor.get(IFileService);
		const languageService = accessor.get(ILanguageService);

		if (!(activeEditorPane instanceof MergeEditor)) {
			notificationService.info({
				name: localize('mergeEditor.name', 'Merge Editor'),
				message: localize('mergeEditor.noActiveMergeEditor', "No active merge editor")
			});
			return;
		}
		const model = activeEditorPane.model;
		if (!model) {
			return;
		}

		const result = await dialogService.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			title: localize('mergeEditor.selectFolderToSaveTo', 'Select folder to save to')
		});
		if (!result) {
			return;
		}
		const targetDir = result[0];

		const extension = languageService.getExtensions(model.resultTextModel.getLanguageId())[0] || '';

		async function write(fileName: string, source: string) {
			await fileService.writeFile(URI.joinPath(targetDir, fileName + extension), VSBuffer.fromString(source), {});
		}

		await Promise.all([
			write('base', model.base.getValue()),
			write('input1', model.input1.textModel.getValue()),
			write('input2', model.input2.textModel.getValue()),
			write('result', model.resultTextModel.getValue()),
			write('initialResult', model.getInitialResultValue()),
		]);

		notificationService.info({
			name: localize('mergeEditor.name', 'Merge Editor'),
			message: localize('mergeEditor.successfullySavedMergeEditorContentsToFolder', "Successfully saved merge editor state to folder"),
		});
	}
}

export class MergeEditorLoadContentsFromFolder extends Action2 {
	constructor() {
		super({
			id: 'merge.dev.loadContentsFromFolder',
			category: MERGE_EDITOR_CATEGORY,
			title: localize2('merge.dev.loadContentsFromFolder', "Load Merge Editor State from Folder"),
			icon: Codicon.layoutCentered,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor, args?: { folderUri?: URI; resultState?: 'initial' | 'current' }) {
		const dialogService = accessor.get(IFileDialogService);
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);
		const quickInputService = accessor.get(IQuickInputService);

		if (!args) {
			args = {};
		}

		let targetDir: URI;
		if (!args.folderUri) {
			const result = await dialogService.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				title: localize('mergeEditor.selectFolderToSaveTo', 'Select folder to save to')
			});
			if (!result) {
				return;
			}
			targetDir = result[0];
		} else {
			targetDir = args.folderUri;
		}

		const targetDirInfo = await fileService.resolve(targetDir);

		function findFile(name: string) {
			return targetDirInfo.children!.find(c => c.name.startsWith(name))?.resource!;
		}

		const shouldOpenInitial = await promptOpenInitial(quickInputService, args.resultState);

		const baseUri = findFile('base');
		const input1Uri = findFile('input1');
		const input2Uri = findFile('input2');
		const resultUri = findFile(shouldOpenInitial ? 'initialResult' : 'result');

		const input: IResourceMergeEditorInput = {
			base: { resource: baseUri },
			input1: { resource: input1Uri, label: 'Input 1', description: 'Input 1', detail: '(from file)' },
			input2: { resource: input2Uri, label: 'Input 2', description: 'Input 2', detail: '(from file)' },
			result: { resource: resultUri },
		};
		editorService.openEditor(input);
	}
}

async function promptOpenInitial(quickInputService: IQuickInputService, resultStateOverride?: 'initial' | 'current') {
	if (resultStateOverride) {
		return resultStateOverride === 'initial';
	}
	const result = await quickInputService.pick([{ label: 'result', result: false }, { label: 'initial result', result: true }], { canPickMany: false });
	return result?.result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/mergeMarkers/mergeMarkersController.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/mergeMarkers/mergeMarkersController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../../base/browser/dom.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable } from '../../../../../base/common/observable.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { MergeEditorLineRange } from '../model/lineRange.js';
import { MergeEditorViewModel } from '../view/viewModel.js';
import * as nls from '../../../../../nls.js';

export const conflictMarkers = {
	start: '<<<<<<<',
	end: '>>>>>>>',
};

export class MergeMarkersController extends Disposable {
	private readonly viewZoneIds: string[] = [];
	private readonly disposableStore = new DisposableStore();

	public constructor(
		public readonly editor: ICodeEditor,
		public readonly mergeEditorViewModel: IObservable<MergeEditorViewModel | undefined>,
	) {
		super();

		this._register(editor.onDidChangeModelContent(e => {
			this.updateDecorations();
		}));

		this._register(editor.onDidChangeModel(e => {
			this.updateDecorations();
		}));

		this.updateDecorations();
	}

	private updateDecorations() {
		const model = this.editor.getModel();
		const blocks = model ? getBlocks(model, { blockToRemoveStartLinePrefix: conflictMarkers.start, blockToRemoveEndLinePrefix: conflictMarkers.end }) : { blocks: [] };

		this.editor.setHiddenAreas(blocks.blocks.map(b => b.lineRange.deltaEnd(-1).toExclusiveRange()), this);
		this.editor.changeViewZones(c => {
			this.disposableStore.clear();
			for (const id of this.viewZoneIds) {
				c.removeZone(id);
			}
			this.viewZoneIds.length = 0;
			for (const b of blocks.blocks) {

				const startLine = model!.getLineContent(b.lineRange.startLineNumber).substring(0, 20);
				const endLine = model!.getLineContent(b.lineRange.endLineNumberExclusive - 1).substring(0, 20);

				const conflictingLinesCount = b.lineRange.length - 2;

				const domNode = h('div', [
					h('div.conflict-zone-root', [
						h('pre', [startLine]),
						h('span.dots', ['...']),
						h('pre', [endLine]),
						h('span.text', [
							conflictingLinesCount === 1
								? nls.localize('conflictingLine', "1 Conflicting Line")
								: nls.localize('conflictingLines', "{0} Conflicting Lines", conflictingLinesCount)
						]),
					]),
				]).root;
				this.viewZoneIds.push(c.addZone({
					afterLineNumber: b.lineRange.endLineNumberExclusive - 1,
					domNode,
					heightInLines: 1.5,
				}));

				const updateWidth = () => {
					const layoutInfo = this.editor.getLayoutInfo();
					domNode.style.width = `${layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth}px`;
				};

				this.disposableStore.add(
					this.editor.onDidLayoutChange(() => {
						updateWidth();
					})
				);
				updateWidth();


				this.disposableStore.add(autorun(reader => {
					/** @description update classname */
					const vm = this.mergeEditorViewModel.read(reader);
					if (!vm) {
						return;
					}
					const activeRange = vm.activeModifiedBaseRange.read(reader);

					const classNames: string[] = [];
					classNames.push('conflict-zone');

					if (activeRange) {
						const activeRangeInResult = vm.model.getLineRangeInResult(activeRange.baseRange, reader);
						if (activeRangeInResult.intersectsOrTouches(b.lineRange)) {
							classNames.push('focused');
						}
					}

					domNode.className = classNames.join(' ');
				}));
			}
		});
	}
}


function getBlocks(document: ITextModel, configuration: ProjectionConfiguration): { blocks: Block[]; transformedContent: string } {
	const blocks: Block[] = [];
	const transformedContent: string[] = [];

	let inBlock = false;
	let startLineNumber = -1;
	let curLine = 0;

	for (const line of document.getLinesContent()) {
		curLine++;
		if (!inBlock) {
			if (line.startsWith(configuration.blockToRemoveStartLinePrefix)) {
				inBlock = true;
				startLineNumber = curLine;
			} else {
				transformedContent.push(line);
			}
		} else {
			if (line.startsWith(configuration.blockToRemoveEndLinePrefix)) {
				inBlock = false;
				blocks.push(new Block(MergeEditorLineRange.fromLength(startLineNumber, curLine - startLineNumber + 1)));
				transformedContent.push('');
			}
		}
	}

	return {
		blocks,
		transformedContent: transformedContent.join('\n')
	};
}

class Block {
	constructor(public readonly lineRange: MergeEditorLineRange) { }
}

interface ProjectionConfiguration {
	blockToRemoveStartLinePrefix: string;
	blockToRemoveEndLinePrefix: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/diffComputer.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/diffComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertFn, checkAdjacentItems } from '../../../../../base/common/assert.js';
import { IReader } from '../../../../../base/common/observable.js';
import { RangeMapping as DiffRangeMapping } from '../../../../../editor/common/diff/rangeMapping.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { MergeEditorLineRange } from './lineRange.js';
import { DetailedLineRangeMapping, RangeMapping } from './mapping.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';

export interface IMergeDiffComputer {
	computeDiff(textModel1: ITextModel, textModel2: ITextModel, reader: IReader): Promise<IMergeDiffComputerResult>;
}

export interface IMergeDiffComputerResult {
	diffs: DetailedLineRangeMapping[] | null;
}

export class MergeDiffComputer implements IMergeDiffComputer {
	private readonly mergeAlgorithm;

	constructor(
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		this.mergeAlgorithm = observableConfigValue<'smart' | 'experimental' | 'legacy' | 'advanced'>(
			'mergeEditor.diffAlgorithm', 'advanced', this.configurationService)
			.map(v => v === 'smart' ? 'legacy' : v === 'experimental' ? 'advanced' : v);
	}

	async computeDiff(textModel1: ITextModel, textModel2: ITextModel, reader: IReader): Promise<IMergeDiffComputerResult> {
		const diffAlgorithm = this.mergeAlgorithm.read(reader);
		const inputVersion = textModel1.getVersionId();
		const outputVersion = textModel2.getVersionId();

		const result = await this.editorWorkerService.computeDiff(
			textModel1.uri,
			textModel2.uri,
			{
				ignoreTrimWhitespace: false,
				maxComputationTimeMs: 0,
				computeMoves: false,
			},
			diffAlgorithm,
		);

		if (!result) {
			throw new Error('Diff computation failed');
		}

		if (textModel1.isDisposed() || textModel2.isDisposed()) {
			return { diffs: null };
		}

		const changes = result.changes.map(c =>
			new DetailedLineRangeMapping(
				toLineRange(c.original),
				textModel1,
				toLineRange(c.modified),
				textModel2,
				c.innerChanges?.map(ic => toRangeMapping(ic))
			)
		);

		const newInputVersion = textModel1.getVersionId();
		const newOutputVersion = textModel2.getVersionId();

		if (inputVersion !== newInputVersion || outputVersion !== newOutputVersion) {
			return { diffs: null };
		}

		assertFn(() => {
			/*
			// This does not hold (see https://github.com/microsoft/vscode-copilot/issues/10610)
			// TODO@hediet the diff algorithm should just use compute a string edit that transforms the input to the output, nothing else

			for (const c of changes) {
				const inputRange = c.inputRange;
				const outputRange = c.outputRange;
				const inputTextModel = c.inputTextModel;
				const outputTextModel = c.outputTextModel;

				for (const map of c.rangeMappings) {
					let inputRangesValid = inputRange.startLineNumber - 1 <= map.inputRange.startLineNumber
						&& map.inputRange.endLineNumber <= inputRange.endLineNumberExclusive;
					if (inputRangesValid && map.inputRange.startLineNumber === inputRange.startLineNumber - 1) {
						inputRangesValid = map.inputRange.endColumn >= inputTextModel.getLineMaxColumn(map.inputRange.startLineNumber);
					}
					if (inputRangesValid && map.inputRange.endLineNumber === inputRange.endLineNumberExclusive) {
						inputRangesValid = map.inputRange.endColumn === 1;
					}

					let outputRangesValid = outputRange.startLineNumber - 1 <= map.outputRange.startLineNumber
						&& map.outputRange.endLineNumber <= outputRange.endLineNumberExclusive;
					if (outputRangesValid && map.outputRange.startLineNumber === outputRange.startLineNumber - 1) {
						outputRangesValid = map.outputRange.endColumn >= outputTextModel.getLineMaxColumn(map.outputRange.endLineNumber);
					}
					if (outputRangesValid && map.outputRange.endLineNumber === outputRange.endLineNumberExclusive) {
						outputRangesValid = map.outputRange.endColumn === 1;
					}

					if (!inputRangesValid || !outputRangesValid) {
						return false;
					}
				}
			}*/

			return changes.length === 0 || (changes[0].inputRange.startLineNumber === changes[0].outputRange.startLineNumber &&
				checkAdjacentItems(changes,
					(m1, m2) => m2.inputRange.startLineNumber - m1.inputRange.endLineNumberExclusive === m2.outputRange.startLineNumber - m1.outputRange.endLineNumberExclusive &&
						// There has to be an unchanged line in between (otherwise both diffs should have been joined)
						m1.inputRange.endLineNumberExclusive < m2.inputRange.startLineNumber &&
						m1.outputRange.endLineNumberExclusive < m2.outputRange.startLineNumber,
				));
		});

		return {
			diffs: changes
		};
	}
}

export function toLineRange(range: LineRange): MergeEditorLineRange {
	return MergeEditorLineRange.fromLength(range.startLineNumber, range.length);
}

export function toRangeMapping(mapping: DiffRangeMapping): RangeMapping {
	return new RangeMapping(mapping.originalRange, mapping.modifiedRange);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/editing.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/editing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../../base/common/arrays.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IIdentifiedSingleEditOperation } from '../../../../../editor/common/model.js';
import { MergeEditorLineRange } from './lineRange.js';

/**
 * Represents an edit, expressed in whole lines:
 * At (before) {@link MergeEditorLineRange.startLineNumber}, delete {@link MergeEditorLineRange.length} many lines and insert {@link newLines}.
*/
export class LineRangeEdit {
	constructor(
		public readonly range: MergeEditorLineRange,
		public readonly newLines: string[]
	) { }

	public equals(other: LineRangeEdit): boolean {
		return this.range.equals(other.range) && equals(this.newLines, other.newLines);
	}

	public toEdits(modelLineCount: number): IIdentifiedSingleEditOperation[] {
		return new LineEdits([this]).toEdits(modelLineCount);
	}
}

export class RangeEdit {
	constructor(
		public readonly range: Range,
		public readonly newText: string
	) { }

	public equals(other: RangeEdit): boolean {
		return Range.equalsRange(this.range, other.range) && this.newText === other.newText;
	}
}

export class LineEdits {
	constructor(public readonly edits: readonly LineRangeEdit[]) { }

	public toEdits(modelLineCount: number): IIdentifiedSingleEditOperation[] {
		return this.edits.map((e) => {
			if (e.range.endLineNumberExclusive <= modelLineCount) {
				return {
					range: new Range(e.range.startLineNumber, 1, e.range.endLineNumberExclusive, 1),
					text: e.newLines.map(s => s + '\n').join(''),
				};
			}

			if (e.range.startLineNumber === 1) {
				return {
					range: new Range(1, 1, modelLineCount, Number.MAX_SAFE_INTEGER),
					text: e.newLines.join('\n'),
				};
			}

			return {
				range: new Range(e.range.startLineNumber - 1, Number.MAX_SAFE_INTEGER, modelLineCount, Number.MAX_SAFE_INTEGER),
				text: e.newLines.map(s => '\n' + s).join(''),
			};
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/lineRange.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/lineRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Constants } from '../../../../../base/common/uint.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';
import { ITextModel } from '../../../../../editor/common/model.js';

/**
 * TODO: Deprecate in favor of LineRange!
 */
export class MergeEditorLineRange extends LineRange {
	static fromLineNumbers(startLineNumber: number, endExclusiveLineNumber: number): MergeEditorLineRange {
		return MergeEditorLineRange.fromLength(startLineNumber, endExclusiveLineNumber - startLineNumber);
	}

	static fromLength(startLineNumber: number, length: number): MergeEditorLineRange {
		return new MergeEditorLineRange(startLineNumber, startLineNumber + length);
	}

	public override join(other: MergeEditorLineRange): MergeEditorLineRange {
		return MergeEditorLineRange.fromLineNumbers(Math.min(this.startLineNumber, other.startLineNumber), Math.max(this.endLineNumberExclusive, other.endLineNumberExclusive));
	}

	public isAfter(range: MergeEditorLineRange): boolean {
		return this.startLineNumber >= range.endLineNumberExclusive;
	}

	public isBefore(range: MergeEditorLineRange): boolean {
		return range.startLineNumber >= this.endLineNumberExclusive;
	}

	public override delta(lineDelta: number): MergeEditorLineRange {
		return MergeEditorLineRange.fromLength(this.startLineNumber + lineDelta, this.length);
	}

	public deltaEnd(delta: number): MergeEditorLineRange {
		return MergeEditorLineRange.fromLength(this.startLineNumber, this.length + delta);
	}

	public deltaStart(lineDelta: number): MergeEditorLineRange {
		return MergeEditorLineRange.fromLength(this.startLineNumber + lineDelta, this.length - lineDelta);
	}

	public getLines(model: ITextModel): string[] {
		const result = new Array(this.length);
		for (let i = 0; i < this.length; i++) {
			result[i] = model.getLineContent(this.startLineNumber + i);
		}
		return result;
	}

	public toInclusiveRangeOrEmpty(): Range {
		if (this.isEmpty) {
			return new Range(this.startLineNumber, 1, this.startLineNumber, 1);
		}
		return new Range(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Constants.MAX_SAFE_SMALL_INTEGER);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/mapping.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/mapping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, concatArrays, numberComparator } from '../../../../../base/common/arrays.js';
import { findLast } from '../../../../../base/common/arraysFind.js';
import { assertFn, checkAdjacentItems } from '../../../../../base/common/assert.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { LineRangeEdit } from './editing.js';
import { MergeEditorLineRange } from './lineRange.js';
import { addLength, lengthBetweenPositions, rangeContainsPosition, rangeIsBeforeOrTouching } from './rangeUtils.js';

/**
 * Represents a mapping of an input line range to an output line range.
*/
export class LineRangeMapping {
	public static join(mappings: readonly LineRangeMapping[]): LineRangeMapping | undefined {
		return mappings.reduce<undefined | LineRangeMapping>((acc, cur) => acc ? acc.join(cur) : cur, undefined);
	}
	constructor(
		public readonly inputRange: MergeEditorLineRange,
		public readonly outputRange: MergeEditorLineRange
	) { }

	public extendInputRange(extendedInputRange: MergeEditorLineRange): LineRangeMapping {
		if (!extendedInputRange.containsRange(this.inputRange)) {
			throw new BugIndicatingError();
		}

		const startDelta = extendedInputRange.startLineNumber - this.inputRange.startLineNumber;
		const endDelta = extendedInputRange.endLineNumberExclusive - this.inputRange.endLineNumberExclusive;
		return new LineRangeMapping(
			extendedInputRange,
			MergeEditorLineRange.fromLength(
				this.outputRange.startLineNumber + startDelta,
				this.outputRange.length - startDelta + endDelta
			)
		);
	}

	public join(other: LineRangeMapping): LineRangeMapping {
		return new LineRangeMapping(
			this.inputRange.join(other.inputRange),
			this.outputRange.join(other.outputRange)
		);
	}

	public get resultingDeltaFromOriginalToModified(): number {
		return this.outputRange.endLineNumberExclusive - this.inputRange.endLineNumberExclusive;
	}

	public toString(): string {
		return `${this.inputRange.toString()} -> ${this.outputRange.toString()}`;
	}

	public addOutputLineDelta(delta: number): LineRangeMapping {
		return new LineRangeMapping(
			this.inputRange,
			this.outputRange.delta(delta)
		);
	}

	public addInputLineDelta(delta: number): LineRangeMapping {
		return new LineRangeMapping(
			this.inputRange.delta(delta),
			this.outputRange
		);
	}

	public reverse(): LineRangeMapping {
		return new LineRangeMapping(this.outputRange, this.inputRange);
	}
}

/**
* Represents a total monotonous mapping of line ranges in one document to another document.
*/
export class DocumentLineRangeMap {
	public static betweenOutputs(
		inputToOutput1: readonly LineRangeMapping[],
		inputToOutput2: readonly LineRangeMapping[],
		inputLineCount: number
	): DocumentLineRangeMap {
		const alignments = MappingAlignment.compute(inputToOutput1, inputToOutput2);
		const mappings = alignments.map((m) => new LineRangeMapping(m.output1Range, m.output2Range));
		return new DocumentLineRangeMap(mappings, inputLineCount);
	}

	constructor(
		/**
		 * The line range mappings that define this document mapping.
		 * The space between two input ranges must equal the space between two output ranges.
		 * These holes act as dense sequence of 1:1 line mappings.
		*/
		public readonly lineRangeMappings: LineRangeMapping[],
		public readonly inputLineCount: number
	) {
		assertFn(() => {
			return checkAdjacentItems(lineRangeMappings,
				(m1, m2) => m1.inputRange.isBefore(m2.inputRange) && m1.outputRange.isBefore(m2.outputRange) &&
					m2.inputRange.startLineNumber - m1.inputRange.endLineNumberExclusive === m2.outputRange.startLineNumber - m1.outputRange.endLineNumberExclusive,
			);
		});
	}

	public project(lineNumber: number): LineRangeMapping {
		const lastBefore = findLast(this.lineRangeMappings, r => r.inputRange.startLineNumber <= lineNumber);
		if (!lastBefore) {
			return new LineRangeMapping(
				MergeEditorLineRange.fromLength(lineNumber, 1),
				MergeEditorLineRange.fromLength(lineNumber, 1)
			);
		}

		if (lastBefore.inputRange.contains(lineNumber)) {
			return lastBefore;
		}
		const containingRange = MergeEditorLineRange.fromLength(lineNumber, 1);
		const mappedRange = MergeEditorLineRange.fromLength(
			lineNumber +
			lastBefore.outputRange.endLineNumberExclusive -
			lastBefore.inputRange.endLineNumberExclusive,
			1
		);
		return new LineRangeMapping(containingRange, mappedRange);
	}

	public get outputLineCount(): number {
		const last = this.lineRangeMappings.at(-1);
		const diff = last ? last.outputRange.endLineNumberExclusive - last.inputRange.endLineNumberExclusive : 0;
		return this.inputLineCount + diff;
	}

	public reverse(): DocumentLineRangeMap {
		return new DocumentLineRangeMap(
			this.lineRangeMappings.map(r => r.reverse()),
			this.outputLineCount
		);
	}
}

/**
 * Aligns two mappings with a common input range.
 */
export class MappingAlignment<T extends LineRangeMapping> {
	public static compute<T extends LineRangeMapping>(
		fromInputToOutput1: readonly T[],
		fromInputToOutput2: readonly T[]
	): MappingAlignment<T>[] {
		const compareByStartLineNumber = compareBy<LineRangeMapping, number>(
			(d) => d.inputRange.startLineNumber,
			numberComparator
		);

		const combinedDiffs = concatArrays(
			fromInputToOutput1.map((diff) => ({ source: 0 as const, diff })),
			fromInputToOutput2.map((diff) => ({ source: 1 as const, diff }))
		).sort(compareBy((d) => d.diff, compareByStartLineNumber));

		const currentDiffs = [new Array<T>(), new Array<T>()];
		const deltaFromBaseToInput = [0, 0];

		const alignments = new Array<MappingAlignment<T>>();

		function pushAndReset(inputRange: MergeEditorLineRange) {
			const mapping1 = LineRangeMapping.join(currentDiffs[0]) || new LineRangeMapping(inputRange, inputRange.delta(deltaFromBaseToInput[0]));
			const mapping2 = LineRangeMapping.join(currentDiffs[1]) || new LineRangeMapping(inputRange, inputRange.delta(deltaFromBaseToInput[1]));

			alignments.push(
				new MappingAlignment(
					currentInputRange!,
					mapping1.extendInputRange(currentInputRange!).outputRange,
					currentDiffs[0],
					mapping2.extendInputRange(currentInputRange!).outputRange,
					currentDiffs[1]
				)
			);
			currentDiffs[0] = [];
			currentDiffs[1] = [];
		}

		let currentInputRange: MergeEditorLineRange | undefined;

		for (const diff of combinedDiffs) {
			const range = diff.diff.inputRange;
			if (currentInputRange && !currentInputRange.intersectsOrTouches(range)) {
				pushAndReset(currentInputRange);
				currentInputRange = undefined;
			}
			deltaFromBaseToInput[diff.source] =
				diff.diff.resultingDeltaFromOriginalToModified;
			currentInputRange = currentInputRange ? currentInputRange.join(range) : range;
			currentDiffs[diff.source].push(diff.diff);
		}
		if (currentInputRange) {
			pushAndReset(currentInputRange);
		}

		return alignments;
	}

	constructor(
		public readonly inputRange: MergeEditorLineRange,
		public readonly output1Range: MergeEditorLineRange,
		public readonly output1LineMappings: T[],
		public readonly output2Range: MergeEditorLineRange,
		public readonly output2LineMappings: T[],
	) {
	}

	public toString(): string {
		return `${this.output1Range} <- ${this.inputRange} -> ${this.output2Range}`;
	}
}

/**
 * A line range mapping with inner range mappings.
*/
export class DetailedLineRangeMapping extends LineRangeMapping {
	public static override join(mappings: readonly DetailedLineRangeMapping[]): DetailedLineRangeMapping | undefined {
		return mappings.reduce<undefined | DetailedLineRangeMapping>((acc, cur) => acc ? acc.join(cur) : cur, undefined);
	}

	public readonly rangeMappings: readonly RangeMapping[];

	constructor(
		inputRange: MergeEditorLineRange,
		public readonly inputTextModel: ITextModel,
		outputRange: MergeEditorLineRange,
		public readonly outputTextModel: ITextModel,
		rangeMappings?: readonly RangeMapping[],
	) {
		super(inputRange, outputRange);

		this.rangeMappings = rangeMappings || [new RangeMapping(this.inputRange.toExclusiveRange(), this.outputRange.toExclusiveRange())];
	}

	public override addOutputLineDelta(delta: number): DetailedLineRangeMapping {
		return new DetailedLineRangeMapping(
			this.inputRange,
			this.inputTextModel,
			this.outputRange.delta(delta),
			this.outputTextModel,
			this.rangeMappings.map(d => d.addOutputLineDelta(delta))
		);
	}

	public override addInputLineDelta(delta: number): DetailedLineRangeMapping {
		return new DetailedLineRangeMapping(
			this.inputRange.delta(delta),
			this.inputTextModel,
			this.outputRange,
			this.outputTextModel,
			this.rangeMappings.map(d => d.addInputLineDelta(delta))
		);
	}

	public override join(other: DetailedLineRangeMapping): DetailedLineRangeMapping {
		return new DetailedLineRangeMapping(
			this.inputRange.join(other.inputRange),
			this.inputTextModel,
			this.outputRange.join(other.outputRange),
			this.outputTextModel,
		);
	}

	public getLineEdit(): LineRangeEdit {
		return new LineRangeEdit(this.inputRange, this.getOutputLines());
	}

	public getReverseLineEdit(): LineRangeEdit {
		return new LineRangeEdit(this.outputRange, this.getInputLines());
	}

	private getOutputLines(): string[] {
		return this.outputRange.getLines(this.outputTextModel);
	}

	private getInputLines(): string[] {
		return this.inputRange.getLines(this.inputTextModel);
	}
}

/**
 * Represents a mapping of an input range to an output range.
*/
export class RangeMapping {
	constructor(public readonly inputRange: Range, public readonly outputRange: Range) {
	}
	toString(): string {
		function rangeToString(range: Range) {
			// TODO@hediet make this the default Range.toString
			return `[${range.startLineNumber}:${range.startColumn}, ${range.endLineNumber}:${range.endColumn})`;
		}

		return `${rangeToString(this.inputRange)} -> ${rangeToString(this.outputRange)}`;
	}

	addOutputLineDelta(deltaLines: number): RangeMapping {
		return new RangeMapping(
			this.inputRange,
			new Range(
				this.outputRange.startLineNumber + deltaLines,
				this.outputRange.startColumn,
				this.outputRange.endLineNumber + deltaLines,
				this.outputRange.endColumn
			)
		);
	}

	addInputLineDelta(deltaLines: number): RangeMapping {
		return new RangeMapping(
			new Range(
				this.inputRange.startLineNumber + deltaLines,
				this.inputRange.startColumn,
				this.inputRange.endLineNumber + deltaLines,
				this.inputRange.endColumn
			),
			this.outputRange,
		);
	}

	reverse(): RangeMapping {
		return new RangeMapping(this.outputRange, this.inputRange);
	}
}

/**
* Represents a total monotonous mapping of ranges in one document to another document.
*/
export class DocumentRangeMap {
	constructor(
		/**
		 * The line range mappings that define this document mapping.
		 * Can have holes.
		*/
		public readonly rangeMappings: RangeMapping[],
		public readonly inputLineCount: number
	) {
		assertFn(() => checkAdjacentItems(
			rangeMappings,
			(m1, m2) =>
				rangeIsBeforeOrTouching(m1.inputRange, m2.inputRange) &&
				rangeIsBeforeOrTouching(m1.outputRange, m2.outputRange) /*&&
				lengthBetweenPositions(m1.inputRange.getEndPosition(), m2.inputRange.getStartPosition()).equals(
					lengthBetweenPositions(m1.outputRange.getEndPosition(), m2.outputRange.getStartPosition())
				)*/
		));
	}

	public project(position: Position): RangeMapping {
		const lastBefore = findLast(this.rangeMappings, r => r.inputRange.getStartPosition().isBeforeOrEqual(position));
		if (!lastBefore) {
			return new RangeMapping(
				Range.fromPositions(position, position),
				Range.fromPositions(position, position)
			);
		}

		if (rangeContainsPosition(lastBefore.inputRange, position)) {
			return lastBefore;
		}

		const dist = lengthBetweenPositions(lastBefore.inputRange.getEndPosition(), position);
		const outputPos = addLength(lastBefore.outputRange.getEndPosition(), dist);

		return new RangeMapping(
			Range.fromPositions(position),
			Range.fromPositions(outputPos)
		);
	}

	public projectRange(range: Range): RangeMapping {
		const start = this.project(range.getStartPosition());
		const end = this.project(range.getEndPosition());
		return new RangeMapping(
			start.inputRange.plusRange(end.inputRange),
			start.outputRange.plusRange(end.outputRange)
		);
	}

	public get outputLineCount(): number {
		const last = this.rangeMappings.at(-1);
		const diff = last ? last.outputRange.endLineNumber - last.inputRange.endLineNumber : 0;
		return this.inputLineCount + diff;
	}

	public reverse(): DocumentRangeMap {
		return new DocumentRangeMap(
			this.rangeMappings.map(m => m.reverse()),
			this.outputLineCount
		);
	}
}
```

--------------------------------------------------------------------------------

````

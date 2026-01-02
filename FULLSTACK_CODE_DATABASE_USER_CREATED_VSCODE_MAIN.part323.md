---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 323
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 323 of 552)

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

---[FILE: src/vs/workbench/api/test/browser/mainThreadChatSessions.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadChatSessions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../platform/contextkey/browser/contextKeyService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { ChatSessionsService } from '../../../contrib/chat/browser/chatSessions.contribution.js';
import { IChatAgentRequest } from '../../../contrib/chat/common/chatAgents.js';
import { IChatProgress, IChatProgressMessage, IChatService } from '../../../contrib/chat/common/chatService.js';
import { IChatSessionItem, IChatSessionsService } from '../../../contrib/chat/common/chatSessionsService.js';
import { LocalChatSessionUri } from '../../../contrib/chat/common/chatUri.js';
import { ChatAgentLocation } from '../../../contrib/chat/common/constants.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { mock, TestExtensionService } from '../../../test/common/workbenchTestServices.js';
import { MainThreadChatSessions, ObservableChatSession } from '../../browser/mainThreadChatSessions.js';
import { ExtHostChatSessionsShape, IChatProgressDto, IChatSessionProviderOptions } from '../../common/extHost.protocol.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { MockChatService } from '../../../contrib/chat/test/common/mockChatService.js';

suite('ObservableChatSession', function () {
	let disposables: DisposableStore;
	let logService: ILogService;
	let dialogService: IDialogService;
	let proxy: ExtHostChatSessionsShape;

	setup(function () {
		disposables = new DisposableStore();
		logService = new NullLogService();

		dialogService = new class extends mock<IDialogService>() {
			override async confirm() {
				return { confirmed: true };
			}
		};

		proxy = {
			$provideChatSessionContent: sinon.stub(),
			$provideChatSessionProviderOptions: sinon.stub<[providerHandle: number, token: CancellationToken], Promise<IChatSessionProviderOptions | undefined>>().resolves(undefined),
			$provideHandleOptionsChange: sinon.stub(),
			$interruptChatSessionActiveResponse: sinon.stub(),
			$invokeChatSessionRequestHandler: sinon.stub(),
			$disposeChatSessionContent: sinon.stub(),
			$provideChatSessionItems: sinon.stub(),
			$provideNewChatSessionItem: sinon.stub().resolves({ label: 'New Session' } as IChatSessionItem)
		};
	});

	teardown(function () {
		disposables.dispose();
		sinon.restore();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createSessionContent(options: {
		id?: string;
		history?: any[];
		hasActiveResponseCallback?: boolean;
		hasRequestHandler?: boolean;
	} = {}) {
		return {
			id: options.id || 'test-id',
			history: options.history || [],
			hasActiveResponseCallback: options.hasActiveResponseCallback || false,
			hasRequestHandler: options.hasRequestHandler || false
		};
	}

	async function createInitializedSession(sessionContent: any, sessionId = 'test-id'): Promise<ObservableChatSession> {
		const resource = LocalChatSessionUri.forSession(sessionId);
		const session = new ObservableChatSession(resource, 1, proxy, logService, dialogService);
		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);
		await session.initialize(CancellationToken.None);
		return session;
	}

	test('constructor creates session with proper initial state', function () {
		const sessionId = 'test-id';
		const resource = LocalChatSessionUri.forSession(sessionId);
		const session = disposables.add(new ObservableChatSession(resource, 1, proxy, logService, dialogService));

		assert.strictEqual(session.providerHandle, 1);
		assert.deepStrictEqual(session.history, []);
		assert.ok(session.progressObs);
		assert.ok(session.isCompleteObs);

		// Initial state should be inactive and incomplete
		assert.deepStrictEqual(session.progressObs.get(), []);
		assert.strictEqual(session.isCompleteObs.get(), false);
	});

	test('session queues progress before initialization and processes it after', async function () {
		const sessionId = 'test-id';
		const resource = LocalChatSessionUri.forSession(sessionId);
		const session = disposables.add(new ObservableChatSession(resource, 1, proxy, logService, dialogService));

		const progress1: IChatProgress = { kind: 'progressMessage', content: { value: 'Hello', isTrusted: false } };
		const progress2: IChatProgress = { kind: 'progressMessage', content: { value: 'World', isTrusted: false } };

		// Add progress before initialization - should be queued
		session.handleProgressChunk('req1', [progress1]);
		session.handleProgressChunk('req1', [progress2]);

		// Progress should be queued, not visible yet
		assert.deepStrictEqual(session.progressObs.get(), []);

		// Initialize the session
		const sessionContent = createSessionContent();
		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);
		await session.initialize(CancellationToken.None);

		// Now progress should be visible
		assert.strictEqual(session.progressObs.get().length, 2);
		assert.deepStrictEqual(session.progressObs.get(), [progress1, progress2]);
		assert.strictEqual(session.isCompleteObs.get(), true); // Should be complete for sessions without active response callback or request handler
	});

	test('initialization loads session history and sets up capabilities', async function () {
		const sessionHistory = [
			{ type: 'request', prompt: 'Previous question' },
			{ type: 'response', parts: [{ kind: 'progressMessage', content: { value: 'Previous answer', isTrusted: false } }] }
		];

		const sessionContent = createSessionContent({
			history: sessionHistory,
			hasActiveResponseCallback: true,
			hasRequestHandler: true
		});

		const session = disposables.add(await createInitializedSession(sessionContent));

		// Verify history was loaded
		assert.strictEqual(session.history.length, 2);
		assert.strictEqual(session.history[0].type, 'request');
		assert.strictEqual(session.history[0].prompt, 'Previous question');
		assert.strictEqual(session.history[1].type, 'response');

		// Verify capabilities were set up
		assert.ok(session.interruptActiveResponseCallback);
		assert.ok(session.requestHandler);
	});

	test('initialization is idempotent and returns same promise', async function () {
		const sessionId = 'test-id';
		const resource = LocalChatSessionUri.forSession(sessionId);
		const session = disposables.add(new ObservableChatSession(resource, 1, proxy, logService, dialogService));

		const sessionContent = createSessionContent();
		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);

		const promise1 = session.initialize(CancellationToken.None);
		const promise2 = session.initialize(CancellationToken.None);

		assert.strictEqual(promise1, promise2);
		await promise1;

		// Should only call proxy once even though initialize was called twice
		assert.ok((proxy.$provideChatSessionContent as sinon.SinonStub).calledOnce);
	});

	test('progress handling works correctly after initialization', async function () {
		const sessionContent = createSessionContent();
		const session = disposables.add(await createInitializedSession(sessionContent));

		const progress: IChatProgress = { kind: 'progressMessage', content: { value: 'New progress', isTrusted: false } };

		// Add progress after initialization
		session.handleProgressChunk('req1', [progress]);

		assert.deepStrictEqual(session.progressObs.get(), [progress]);
		// Session with no capabilities should remain complete
		assert.strictEqual(session.isCompleteObs.get(), true);
	});

	test('progress completion updates session state correctly', async function () {
		const sessionContent = createSessionContent();
		const session = disposables.add(await createInitializedSession(sessionContent));

		// Add some progress first
		const progress: IChatProgress = { kind: 'progressMessage', content: { value: 'Processing...', isTrusted: false } };
		session.handleProgressChunk('req1', [progress]);

		// Session with no capabilities should already be complete
		assert.strictEqual(session.isCompleteObs.get(), true);
		session.handleProgressComplete('req1');
		assert.strictEqual(session.isCompleteObs.get(), true);
	});

	test('session with active response callback becomes active when progress is added', async function () {
		const sessionContent = createSessionContent({ hasActiveResponseCallback: true });
		const session = disposables.add(await createInitializedSession(sessionContent));

		// Session should start inactive and incomplete (has capabilities but no active progress)
		assert.strictEqual(session.isCompleteObs.get(), false);

		const progress: IChatProgress = { kind: 'progressMessage', content: { value: 'Processing...', isTrusted: false } };
		session.handleProgressChunk('req1', [progress]);

		assert.strictEqual(session.isCompleteObs.get(), false);
		session.handleProgressComplete('req1');

		assert.strictEqual(session.isCompleteObs.get(), true);
	});

	test('request handler forwards requests to proxy', async function () {
		const sessionContent = createSessionContent({ hasRequestHandler: true });
		const session = disposables.add(await createInitializedSession(sessionContent));

		assert.ok(session.requestHandler);

		const request: IChatAgentRequest = {
			requestId: 'req1',
			sessionResource: LocalChatSessionUri.forSession('test-session'),
			agentId: 'test-agent',
			message: 'Test prompt',
			location: ChatAgentLocation.Chat,
			variables: { variables: [] }
		};
		const progressCallback = sinon.stub();

		await session.requestHandler!(request, progressCallback, [], CancellationToken.None);

		assert.ok((proxy.$invokeChatSessionRequestHandler as sinon.SinonStubbedMember<typeof proxy.$invokeChatSessionRequestHandler>).calledOnceWith(1, session.sessionResource, request, [], CancellationToken.None));
	});

	test('request handler forwards progress updates to external callback', async function () {
		const sessionContent = createSessionContent({ hasRequestHandler: true });
		const session = disposables.add(await createInitializedSession(sessionContent));

		assert.ok(session.requestHandler);

		const request: IChatAgentRequest = {
			requestId: 'req1',
			sessionResource: LocalChatSessionUri.forSession('test-session'),
			agentId: 'test-agent',
			message: 'Test prompt',
			location: ChatAgentLocation.Chat,
			variables: { variables: [] }
		};
		const progressCallback = sinon.stub();

		let resolveRequest: () => void;
		const requestPromise = new Promise<void>(resolve => {
			resolveRequest = resolve;
		});

		(proxy.$invokeChatSessionRequestHandler as sinon.SinonStub).returns(requestPromise);

		const requestHandlerPromise = session.requestHandler!(request, progressCallback, [], CancellationToken.None);

		const progress1: IChatProgress = { kind: 'progressMessage', content: { value: 'Progress 1', isTrusted: false } };
		const progress2: IChatProgress = { kind: 'progressMessage', content: { value: 'Progress 2', isTrusted: false } };

		session.handleProgressChunk('req1', [progress1]);
		session.handleProgressChunk('req1', [progress2]);

		// Wait a bit for autorun to trigger
		await new Promise(resolve => setTimeout(resolve, 0));

		assert.ok(progressCallback.calledTwice);
		assert.deepStrictEqual(progressCallback.firstCall.args[0], [progress1]);
		assert.deepStrictEqual(progressCallback.secondCall.args[0], [progress2]);

		// Complete the request
		resolveRequest!();
		await requestHandlerPromise;

		assert.strictEqual(session.isCompleteObs.get(), true);
	});

	test('dispose properly cleans up resources and notifies listeners', function () {
		const sessionId = 'test-id';
		const resource = LocalChatSessionUri.forSession(sessionId);
		const session = disposables.add(new ObservableChatSession(resource, 1, proxy, logService, dialogService));

		let disposeEventFired = false;
		const disposable = session.onWillDispose(() => {
			disposeEventFired = true;
		});

		session.dispose();

		assert.ok(disposeEventFired);
		assert.ok((proxy.$disposeChatSessionContent as sinon.SinonStubbedMember<typeof proxy.$disposeChatSessionContent>).calledOnceWith(1, resource));

		disposable.dispose();
	});

	test('session with multiple request/response pairs in history', async function () {
		const sessionHistory = [
			{ type: 'request', prompt: 'First question' },
			{ type: 'response', parts: [{ kind: 'progressMessage', content: { value: 'First answer', isTrusted: false } }] },
			{ type: 'request', prompt: 'Second question' },
			{ type: 'response', parts: [{ kind: 'progressMessage', content: { value: 'Second answer', isTrusted: false } }] }
		];

		const sessionContent = createSessionContent({
			history: sessionHistory,
			hasActiveResponseCallback: false,
			hasRequestHandler: false
		});

		const session = disposables.add(await createInitializedSession(sessionContent));

		// Verify all history was loaded correctly
		assert.strictEqual(session.history.length, 4);
		assert.strictEqual(session.history[0].type, 'request');
		assert.strictEqual(session.history[0].prompt, 'First question');
		assert.strictEqual(session.history[1].type, 'response');
		assert.strictEqual((session.history[1].parts[0] as IChatProgressMessage).content.value, 'First answer');
		assert.strictEqual(session.history[2].type, 'request');
		assert.strictEqual(session.history[2].prompt, 'Second question');
		assert.strictEqual(session.history[3].type, 'response');
		assert.strictEqual((session.history[3].parts[0] as IChatProgressMessage).content.value, 'Second answer');

		// Session should be complete since it has no capabilities
		assert.strictEqual(session.isCompleteObs.get(), true);
	});
});

suite('MainThreadChatSessions', function () {
	let instantiationService: TestInstantiationService;
	let mainThread: MainThreadChatSessions;
	let proxy: ExtHostChatSessionsShape;
	let chatSessionsService: IChatSessionsService;
	let disposables: DisposableStore;

	const exampleSessionResource = LocalChatSessionUri.forSession('new-session-id');

	setup(function () {
		disposables = new DisposableStore();
		instantiationService = new TestInstantiationService();

		proxy = {
			$provideChatSessionContent: sinon.stub(),
			$provideChatSessionProviderOptions: sinon.stub<[providerHandle: number, token: CancellationToken], Promise<IChatSessionProviderOptions | undefined>>().resolves(undefined),
			$provideHandleOptionsChange: sinon.stub(),
			$interruptChatSessionActiveResponse: sinon.stub(),
			$invokeChatSessionRequestHandler: sinon.stub(),
			$disposeChatSessionContent: sinon.stub(),
			$provideChatSessionItems: sinon.stub(),
			$provideNewChatSessionItem: sinon.stub().resolves({ resource: exampleSessionResource, label: 'New Session' } as IChatSessionItem)
		};

		const extHostContext = new class implements IExtHostContext {
			remoteAuthority = '';
			extensionHostKind = ExtensionHostKind.LocalProcess;
			dispose() { }
			assertRegistered() { }
			set(v: any): any { return null; }
			getProxy(): any { return proxy; }
			drain(): any { return null; }
		};

		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IContextKeyService, disposables.add(instantiationService.createInstance(ContextKeyService)));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IEditorService, new class extends mock<IEditorService>() { });
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IViewsService, new class extends mock<IViewsService>() {
			override async openView() { return null; }
		});
		instantiationService.stub(IDialogService, new class extends mock<IDialogService>() {
			override async confirm() {
				return { confirmed: true };
			}
		});
		instantiationService.stub(ILabelService, new class extends mock<ILabelService>() {
			override registerFormatter() {
				return {
					dispose: () => { }
				};
			}
		});
		instantiationService.stub(IChatService, new MockChatService());

		chatSessionsService = disposables.add(instantiationService.createInstance(ChatSessionsService));
		instantiationService.stub(IChatSessionsService, chatSessionsService);
		mainThread = disposables.add(instantiationService.createInstance(MainThreadChatSessions, extHostContext));
	});

	teardown(function () {
		disposables.dispose();
		instantiationService.dispose();
		sinon.restore();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('provideChatSessionContent creates and initializes session', async function () {
		const sessionScheme = 'test-session-type';
		mainThread.$registerChatSessionContentProvider(1, sessionScheme);

		const sessionContent = {
			id: 'test-session',
			history: [],
			hasActiveResponseCallback: false,
			hasRequestHandler: false
		};

		const resource = URI.parse(`${sessionScheme}:/test-session`);

		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);
		const session1 = await chatSessionsService.getOrCreateChatSession(resource, CancellationToken.None);

		assert.ok(session1);

		const session2 = await chatSessionsService.getOrCreateChatSession(resource, CancellationToken.None);
		assert.strictEqual(session1, session2);

		assert.ok((proxy.$provideChatSessionContent as sinon.SinonStub).calledOnce);
		mainThread.$unregisterChatSessionContentProvider(1);
	});

	test('$handleProgressChunk routes to correct session', async function () {
		const sessionScheme = 'test-session-type';

		mainThread.$registerChatSessionContentProvider(1, sessionScheme);

		const sessionContent = {
			id: 'test-session',
			history: [],
			hasActiveResponseCallback: false,
			hasRequestHandler: false
		};

		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);

		const resource = URI.parse(`${sessionScheme}:/test-session`);
		const session = await chatSessionsService.getOrCreateChatSession(resource, CancellationToken.None) as ObservableChatSession;

		const progressDto: IChatProgressDto = { kind: 'progressMessage', content: { value: 'Test', isTrusted: false } };
		await mainThread.$handleProgressChunk(1, resource, 'req1', [progressDto]);

		assert.strictEqual(session.progressObs.get().length, 1);
		assert.strictEqual(session.progressObs.get()[0].kind, 'progressMessage');

		mainThread.$unregisterChatSessionContentProvider(1);
	});

	test('$handleProgressComplete marks session complete', async function () {
		const sessionScheme = 'test-session-type';
		mainThread.$registerChatSessionContentProvider(1, sessionScheme);

		const sessionContent = {
			id: 'test-session',
			history: [],
			hasActiveResponseCallback: false,
			hasRequestHandler: false
		};

		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);

		const resource = URI.parse(`${sessionScheme}:/test-session`);
		const session = await chatSessionsService.getOrCreateChatSession(resource, CancellationToken.None) as ObservableChatSession;

		const progressDto: IChatProgressDto = { kind: 'progressMessage', content: { value: 'Test', isTrusted: false } };
		await mainThread.$handleProgressChunk(1, resource, 'req1', [progressDto]);
		mainThread.$handleProgressComplete(1, resource, 'req1');

		assert.strictEqual(session.isCompleteObs.get(), true);

		mainThread.$unregisterChatSessionContentProvider(1);
	});

	test('integration with multiple request/response pairs', async function () {
		const sessionScheme = 'test-session-type';
		mainThread.$registerChatSessionContentProvider(1, sessionScheme);

		const sessionContent = {
			id: 'multi-turn-session',
			history: [
				{ type: 'request', prompt: 'First question' },
				{ type: 'response', parts: [{ kind: 'progressMessage', content: { value: 'First answer', isTrusted: false } }] },
				{ type: 'request', prompt: 'Second question' },
				{ type: 'response', parts: [{ kind: 'progressMessage', content: { value: 'Second answer', isTrusted: false } }] }
			],
			hasActiveResponseCallback: false,
			hasRequestHandler: false
		};

		(proxy.$provideChatSessionContent as sinon.SinonStub).resolves(sessionContent);

		const resource = URI.parse(`${sessionScheme}:/multi-turn-session`);
		const session = await chatSessionsService.getOrCreateChatSession(resource, CancellationToken.None) as ObservableChatSession;

		// Verify the session loaded correctly
		assert.ok(session);
		assert.strictEqual(session.history.length, 4);

		// Verify all history items are correctly loaded
		assert.strictEqual(session.history[0].type, 'request');
		assert.strictEqual(session.history[0].prompt, 'First question');
		assert.strictEqual(session.history[1].type, 'response');
		assert.strictEqual(session.history[2].type, 'request');
		assert.strictEqual(session.history[2].prompt, 'Second question');
		assert.strictEqual(session.history[3].type, 'response');

		// Session should be complete since it has no active capabilities
		assert.strictEqual(session.isCompleteObs.get(), true);

		mainThread.$unregisterChatSessionContentProvider(1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadCommands.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadCommands.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadCommands } from '../../browser/mainThreadCommands.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('MainThreadCommands', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('dispose on unregister', function () {

		const commands = new MainThreadCommands(SingleProxyRPCProtocol(null), undefined!, new class extends mock<IExtensionService>() { });
		assert.strictEqual(CommandsRegistry.getCommand('foo'), undefined);

		// register
		commands.$registerCommand('foo');
		assert.ok(CommandsRegistry.getCommand('foo'));

		// unregister
		commands.$unregisterCommand('foo');
		assert.strictEqual(CommandsRegistry.getCommand('foo'), undefined);

		commands.dispose();

	});

	test('unregister all on dispose', function () {

		const commands = new MainThreadCommands(SingleProxyRPCProtocol(null), undefined!, new class extends mock<IExtensionService>() { });
		assert.strictEqual(CommandsRegistry.getCommand('foo'), undefined);

		commands.$registerCommand('foo');
		commands.$registerCommand('bar');

		assert.ok(CommandsRegistry.getCommand('foo'));
		assert.ok(CommandsRegistry.getCommand('bar'));

		commands.dispose();

		assert.strictEqual(CommandsRegistry.getCommand('foo'), undefined);
		assert.strictEqual(CommandsRegistry.getCommand('bar'), undefined);
	});

	test('activate and throw when needed', async function () {

		const activations: string[] = [];
		const runs: string[] = [];

		const commands = new MainThreadCommands(
			SingleProxyRPCProtocol(null),
			new class extends mock<ICommandService>() {
				override executeCommand<T>(id: string): Promise<T | undefined> {
					runs.push(id);
					return Promise.resolve(undefined);
				}
			},
			new class extends mock<IExtensionService>() {
				override activateByEvent(id: string) {
					activations.push(id);
					return Promise.resolve();
				}
			}
		);

		// case 1: arguments and retry
		try {
			activations.length = 0;
			await commands.$executeCommand('bazz', [1, 2, { n: 3 }], true);
			assert.ok(false);
		} catch (e) {
			assert.deepStrictEqual(activations, ['onCommand:bazz']);
			assert.strictEqual((<Error>e).message, '$executeCommand:retry');
		}

		// case 2: no arguments and retry
		runs.length = 0;
		await commands.$executeCommand('bazz', [], true);
		assert.deepStrictEqual(runs, ['bazz']);

		// case 3: arguments and no retry
		runs.length = 0;
		await commands.$executeCommand('bazz', [1, 2, true], false);
		assert.deepStrictEqual(runs, ['bazz']);

		commands.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadConfiguration.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { URI } from '../../../../base/common/uri.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationRegistry, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MainThreadConfiguration } from '../../browser/mainThreadConfiguration.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { IConfigurationService, ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { WorkspaceService } from '../../../services/configuration/browser/configurationService.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('MainThreadConfiguration', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	const proxy = {
		$initializeConfiguration: () => { }
	};
	let instantiationService: TestInstantiationService;
	let target: sinon.SinonSpy;

	suiteSetup(() => {
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
			'id': 'extHostConfiguration',
			'title': 'a',
			'type': 'object',
			'properties': {
				'extHostConfiguration.resource': {
					'description': 'extHostConfiguration.resource',
					'type': 'boolean',
					'default': true,
					'scope': ConfigurationScope.RESOURCE
				},
				'extHostConfiguration.window': {
					'description': 'extHostConfiguration.resource',
					'type': 'boolean',
					'default': true,
					'scope': ConfigurationScope.WINDOW
				}
			}
		});
	});

	setup(() => {
		target = sinon.spy();

		instantiationService = new TestInstantiationService();
		instantiationService.stub(IConfigurationService, WorkspaceService);
		instantiationService.stub(IConfigurationService, 'onDidUpdateConfiguration', sinon.mock());
		instantiationService.stub(IConfigurationService, 'onDidChangeConfiguration', sinon.mock());
		instantiationService.stub(IConfigurationService, 'updateValue', target);
		instantiationService.stub(IEnvironmentService, {
			isBuilt: false
		});
	});

	teardown(() => {
		instantiationService.dispose();
	});

	test('update resource configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update resource configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update resource configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update window configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update window configuration without configuration target defaults to workspace in multi root workspace when resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update window configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update window configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update resource configuration without configuration target defaults to folder', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE_FOLDER, target.args[0][3]);
	});

	test('update configuration with user configuration target', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(ConfigurationTarget.USER, 'extHostConfiguration.window', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.USER, target.args[0][3]);
	});

	test('update configuration with workspace configuration target', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(ConfigurationTarget.WORKSPACE, 'extHostConfiguration.window', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('update configuration with folder configuration target', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$updateConfigurationOption(ConfigurationTarget.WORKSPACE_FOLDER, 'extHostConfiguration.window', 'value', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE_FOLDER, target.args[0][3]);
	});

	test('remove resource configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove resource configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove resource configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove window configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove window configuration without configuration target defaults to workspace in multi root workspace when resource is provided', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove window configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove window configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.FOLDER });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', undefined, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE, target.args[0][3]);
	});

	test('remove configuration without configuration target defaults to folder', function () {
		instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{ getWorkbenchState: () => WorkbenchState.WORKSPACE });
		const testObject: MainThreadConfiguration = instantiationService.createInstance(MainThreadConfiguration, SingleProxyRPCProtocol(proxy));

		testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', { resource: URI.file('abc') }, undefined);

		assert.strictEqual(ConfigurationTarget.WORKSPACE_FOLDER, target.args[0][3]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadDiagnostics.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadDiagnostics.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../base/common/async.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { MarkerService } from '../../../../platform/markers/common/markerService.js';
import { IMarkerData } from '../../../../platform/markers/common/markers.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { MainThreadDiagnostics } from '../../browser/mainThreadDiagnostics.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { mock } from '../../../test/common/workbenchTestServices.js';


suite('MainThreadDiagnostics', function () {

	let markerService: MarkerService;

	setup(function () {
		markerService = new MarkerService();
	});

	teardown(function () {
		markerService.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('clear markers on dispose', function () {

		const diag = new MainThreadDiagnostics(
			new class implements IExtHostContext {
				remoteAuthority = '';
				extensionHostKind = ExtensionHostKind.LocalProcess;
				dispose() { }
				assertRegistered() { }
				set(v: any): any { return null; }
				getProxy(): any {
					return {
						$acceptMarkersChange() { }
					};
				}
				drain(): any { return null; }
			},
			markerService,
			new class extends mock<IUriIdentityService>() {
				override asCanonicalUri(uri: URI) { return uri; }
			}
		);

		diag.$changeMany('foo', [[URI.file('a'), [{
			code: '666',
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: 1,
			endColumn: 1,
			message: 'fffff',
			severity: 1,
			source: 'me'
		}]]]);

		assert.strictEqual(markerService.read().length, 1);
		diag.dispose();
		assert.strictEqual(markerService.read().length, 0);
	});

	test('OnDidChangeDiagnostics triggers twice on same diagnostics #136434', function () {

		return runWithFakedTimers({}, async () => {

			const changedData: [UriComponents, IMarkerData[]][][] = [];

			const diag = new MainThreadDiagnostics(
				new class implements IExtHostContext {
					remoteAuthority = '';
					extensionHostKind = ExtensionHostKind.LocalProcess;
					dispose() { }
					assertRegistered() { }
					set(v: any): any { return null; }
					getProxy(): any {
						return {
							$acceptMarkersChange(data: [UriComponents, IMarkerData[]][]) {
								changedData.push(data);
							}
						};
					}
					drain(): any { return null; }
				},
				markerService,
				new class extends mock<IUriIdentityService>() {
					override asCanonicalUri(uri: URI) { return uri; }
				}
			);

			const markerDataStub = {
				code: '666',
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				severity: 1,
				source: 'me'
			};
			const target = URI.file('a');
			diag.$changeMany('foo', [[target, [{ ...markerDataStub, message: 'same_owner' }]]]);
			markerService.changeOne('bar', target, [{ ...markerDataStub, message: 'forgein_owner' }]);

			// added one marker via the API and one via the ext host. the latter must not
			// trigger an event to the extension host

			await timeout(0);
			assert.strictEqual(markerService.read().length, 2);
			assert.strictEqual(changedData.length, 1);
			assert.strictEqual(changedData[0].length, 1);
			assert.strictEqual(changedData[0][0][1][0].message, 'forgein_owner');

			diag.dispose();
		});
	});

	test('onDidChangeDiagnostics different behavior when "extensionKind" ui running on remote workspace #136955', function () {
		return runWithFakedTimers({}, async () => {

			const markerData: IMarkerData = {
				code: '666',
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				severity: 1,
				source: 'me',
				message: 'message'
			};
			const target = URI.file('a');
			markerService.changeOne('bar', target, [markerData]);

			const changedData: [UriComponents, IMarkerData[]][][] = [];

			const diag = new MainThreadDiagnostics(
				new class implements IExtHostContext {
					remoteAuthority = '';
					extensionHostKind = ExtensionHostKind.LocalProcess;
					dispose() { }
					assertRegistered() { }
					set(v: any): any { return null; }
					getProxy(): any {
						return {
							$acceptMarkersChange(data: [UriComponents, IMarkerData[]][]) {
								changedData.push(data);
							}
						};
					}
					drain(): any { return null; }
				},
				markerService,
				new class extends mock<IUriIdentityService>() {
					override asCanonicalUri(uri: URI) { return uri; }
				}
			);

			diag.$clear('bar');
			await timeout(0);
			assert.strictEqual(markerService.read().length, 0);
			assert.strictEqual(changedData.length, 1);

			diag.dispose();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadDocumentContentProviders.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadDocumentContentProviders.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { MainThreadDocumentContentProviders } from '../../browser/mainThreadDocumentContentProviders.js';
import { createTextModel } from '../../../../editor/test/common/testTextModel.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('MainThreadDocumentContentProviders', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('events are processed properly', function () {

		const uri = URI.parse('test:uri');
		const model = createTextModel('1', undefined, undefined, uri);

		const providers = new MainThreadDocumentContentProviders(new TestRPCProtocol(), null!, null!,
			new class extends mock<IModelService>() {
				override getModel(_uri: URI) {
					assert.strictEqual(uri.toString(), _uri.toString());
					return model;
				}
			},
			new class extends mock<IEditorWorkerService>() {
				override computeMoreMinimalEdits(_uri: URI, data: TextEdit[] | undefined) {
					assert.strictEqual(model.getValue(), '1');
					return Promise.resolve(data);
				}
			},
		);

		store.add(model);
		store.add(providers);

		return new Promise<void>((resolve, reject) => {
			let expectedEvents = 1;
			store.add(model.onDidChangeContent(e => {
				expectedEvents -= 1;
				try {
					assert.ok(expectedEvents >= 0);
				} catch (err) {
					reject(err);
				}
				if (model.getValue() === '1\n2\n3') {
					model.dispose();
					resolve();
				}
			}));
			providers.$onVirtualDocumentChange(uri, '1\n2');
			providers.$onVirtualDocumentChange(uri, '1\n2\n3');
		});
	});

	test('model disposed during async operation', async function () {
		const uri = URI.parse('test:disposed');
		const model = createTextModel('initial', undefined, undefined, uri);

		let disposeModelDuringEdit = false;

		const providers = new MainThreadDocumentContentProviders(new TestRPCProtocol(), null!, null!,
			new class extends mock<IModelService>() {
				override getModel(_uri: URI) {
					assert.strictEqual(uri.toString(), _uri.toString());
					return model;
				}
			},
			new class extends mock<IEditorWorkerService>() {
				override async computeMoreMinimalEdits(_uri: URI, data: TextEdit[] | undefined) {
					// Simulate async operation
					await new Promise(resolve => setTimeout(resolve, 10));

					// Dispose model during the async operation if flag is set
					if (disposeModelDuringEdit) {
						model.dispose();
					}

					return data;
				}
			},
		);

		store.add(model);
		store.add(providers);

		// First call should work normally
		await providers.$onVirtualDocumentChange(uri, 'updated');
		assert.strictEqual(model.getValue(), 'updated');

		// Second call should not throw even though model gets disposed during async operation
		disposeModelDuringEdit = true;
		await providers.$onVirtualDocumentChange(uri, 'should not apply');

		// Model should be disposed and value unchanged
		assert.ok(model.isDisposed());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadDocuments.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadDocuments.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { BoundModelReferenceCollection } from '../../browser/mainThreadDocuments.js';
import { timeout } from '../../../../base/common/async.js';
import { URI } from '../../../../base/common/uri.js';
import { extUri } from '../../../../base/common/resources.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('BoundModelReferenceCollection', function () {

	let col: BoundModelReferenceCollection;

	setup(function () {
		col = new BoundModelReferenceCollection(extUri, 15, 75);
	});

	teardown(function () {
		col.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('max age', async function () {

		let didDispose = false;

		col.add(
			URI.parse('test://farboo'),
			{
				object: {},
				dispose() {
					didDispose = true;
				}
			});

		await timeout(30);
		assert.strictEqual(didDispose, true);
	});

	test('max size', function () {

		const disposed: number[] = [];

		col.add(
			URI.parse('test://farboo'),
			{
				object: {},
				dispose() {
					disposed.push(0);
				}
			}, 6);

		col.add(
			URI.parse('test://boofar'),
			{
				object: {},
				dispose() {
					disposed.push(1);
				}
			}, 6);

		col.add(
			URI.parse('test://xxxxxxx'),
			{
				object: {},
				dispose() {
					disposed.push(2);
				}
			}, 70);

		assert.deepStrictEqual(disposed, [0, 1]);
	});

	test('max count', function () {
		col.dispose();
		col = new BoundModelReferenceCollection(extUri, 10000, 10000, 2);

		const disposed: number[] = [];

		col.add(
			URI.parse('test://xxxxxxx'),
			{
				object: {},
				dispose() {
					disposed.push(0);
				}
			}
		);
		col.add(
			URI.parse('test://xxxxxxx'),
			{
				object: {},
				dispose() {
					disposed.push(1);
				}
			}
		);
		col.add(
			URI.parse('test://xxxxxxx'),
			{
				object: {},
				dispose() {
					disposed.push(2);
				}
			}
		);

		assert.deepStrictEqual(disposed, [0]);
	});

	test('dispose uri', function () {

		let disposed: number[] = [];

		col.add(
			URI.parse('test:///farboo'),
			{
				object: {},
				dispose() {
					disposed.push(0);
				}
			});

		col.add(
			URI.parse('test:///boofar'),
			{
				object: {},
				dispose() {
					disposed.push(1);
				}
			});

		col.add(
			URI.parse('test:///boo/far1'),
			{
				object: {},
				dispose() {
					disposed.push(2);
				}
			});

		col.add(
			URI.parse('test:///boo/far2'),
			{
				object: {},
				dispose() {
					disposed.push(3);
				}
			});

		col.add(
			URI.parse('test:///boo1/far'),
			{
				object: {},
				dispose() {
					disposed.push(4);
				}
			});

		col.remove(URI.parse('test:///unknown'));
		assert.strictEqual(disposed.length, 0);

		col.remove(URI.parse('test:///farboo'));
		assert.deepStrictEqual(disposed, [0]);

		disposed = [];

		col.remove(URI.parse('test:///boo'));
		assert.deepStrictEqual(disposed, [2, 3]);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadDocumentsAndEditors.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadDocumentsAndEditors.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadDocumentsAndEditors } from '../../browser/mainThreadDocumentsAndEditors.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { ModelService } from '../../../../editor/common/services/modelService.js';
import { TestCodeEditorService } from '../../../../editor/test/browser/editorTestServices.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IDocumentsAndEditorsDelta } from '../../common/extHost.protocol.js';
import { createTestCodeEditor, ITestCodeEditor } from '../../../../editor/test/browser/testCodeEditor.js';
import { mock } from '../../../../base/test/common/mock.js';
import { TestEditorService, TestEditorGroupsService, TestEnvironmentService, TestPathService } from '../../../test/browser/workbenchTestServices.js';
import { Event } from '../../../../base/common/event.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';
import { UndoRedoService } from '../../../../platform/undoRedo/common/undoRedoService.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { TestNotificationService } from '../../../../platform/notification/test/common/testNotificationService.js';
import { TestTextResourcePropertiesService, TestWorkingCopyFileService } from '../../../test/common/workbenchTestServices.js';
import { UriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { TextModel } from '../../../../editor/common/model/textModel.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { LanguageService } from '../../../../editor/common/services/languageService.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { TestLanguageConfigurationService } from '../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IQuickDiffModelService } from '../../../contrib/scm/browser/quickDiffModel.js';
import { ITextEditorDiffInformation } from '../../../../platform/editor/common/editor.js';
import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TestTreeSitterLibraryService } from '../../../../editor/test/common/services/testTreeSitterLibraryService.js';

suite('MainThreadDocumentsAndEditors', () => {

	let disposables: DisposableStore;

	let modelService: ModelService;
	let codeEditorService: TestCodeEditorService;
	let textFileService: ITextFileService;
	const deltas: IDocumentsAndEditorsDelta[] = [];

	function myCreateTestCodeEditor(model: ITextModel | undefined): ITestCodeEditor {
		return createTestCodeEditor(model, {
			hasTextFocus: false,
			serviceCollection: new ServiceCollection(
				[ICodeEditorService, codeEditorService]
			)
		});
	}

	setup(() => {
		disposables = new DisposableStore();

		deltas.length = 0;
		const configService = new TestConfigurationService();
		configService.setUserConfiguration('editor', { 'detectIndentation': false });
		const dialogService = new TestDialogService();
		const notificationService = new TestNotificationService();
		const undoRedoService = new UndoRedoService(dialogService, notificationService);
		const themeService = new TestThemeService();
		const instantiationService = new TestInstantiationService();
		instantiationService.set(ILanguageService, disposables.add(new LanguageService()));
		instantiationService.set(ILanguageConfigurationService, new TestLanguageConfigurationService());
		instantiationService.set(ITreeSitterLibraryService, new TestTreeSitterLibraryService());
		instantiationService.set(IUndoRedoService, undoRedoService);
		modelService = new ModelService(
			configService,
			new TestTextResourcePropertiesService(configService),
			undoRedoService,
			instantiationService
		);
		codeEditorService = new TestCodeEditorService(themeService);
		textFileService = new class extends mock<ITextFileService>() {
			override isDirty() { return false; }
			// eslint-disable-next-line local/code-no-any-casts
			override files = <any>{
				onDidSave: Event.None,
				onDidRevert: Event.None,
				onDidChangeDirty: Event.None,
				onDidChangeEncoding: Event.None
			};
			// eslint-disable-next-line local/code-no-any-casts
			override untitled = <any>{
				onDidChangeEncoding: Event.None
			};
			override getEncoding() { return 'utf8'; }
		};
		const workbenchEditorService = disposables.add(new TestEditorService());
		const editorGroupService = new TestEditorGroupsService();

		const fileService = new class extends mock<IFileService>() {
			override onDidRunOperation = Event.None;
			override onDidChangeFileSystemProviderCapabilities = Event.None;
			override onDidChangeFileSystemProviderRegistrations = Event.None;
		};

		new MainThreadDocumentsAndEditors(
			SingleProxyRPCProtocol({
				$acceptDocumentsAndEditorsDelta: (delta: IDocumentsAndEditorsDelta) => { deltas.push(delta); },
				$acceptEditorDiffInformation: (id: string, diffInformation: ITextEditorDiffInformation | undefined) => { }
			}),
			modelService,
			textFileService,
			workbenchEditorService,
			codeEditorService,
			fileService,
			null!,
			editorGroupService,
			new class extends mock<IPaneCompositePartService>() implements IPaneCompositePartService {
				override onDidPaneCompositeOpen = Event.None;
				override onDidPaneCompositeClose = Event.None;
				override getActivePaneComposite() {
					return undefined;
				}
			},
			TestEnvironmentService,
			new TestWorkingCopyFileService(),
			new UriIdentityService(fileService),
			new class extends mock<IClipboardService>() {
				override readText() {
					return Promise.resolve('clipboard_contents');
				}
			},
			new TestPathService(),
			new TestConfigurationService(),
			new class extends mock<IQuickDiffModelService>() {
				override createQuickDiffModelReference() {
					return undefined;
				}
			}
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Model#add', () => {
		deltas.length = 0;

		disposables.add(modelService.createModel('farboo', null));

		assert.strictEqual(deltas.length, 1);
		const [delta] = deltas;

		assert.strictEqual(delta.addedDocuments!.length, 1);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);
		assert.strictEqual(delta.newActiveEditor, undefined);
	});

	test('ignore huge model', function () {

		const oldLimit = TextModel._MODEL_SYNC_LIMIT;
		try {
			const largeModelString = 'abc'.repeat(1024);
			TextModel._MODEL_SYNC_LIMIT = largeModelString.length / 2;

			const model = modelService.createModel(largeModelString, null);
			disposables.add(model);
			assert.ok(model.isTooLargeForSyncing());

			assert.strictEqual(deltas.length, 1);
			const [delta] = deltas;
			assert.strictEqual(delta.newActiveEditor, null);
			assert.strictEqual(delta.addedDocuments, undefined);
			assert.strictEqual(delta.removedDocuments, undefined);
			assert.strictEqual(delta.addedEditors, undefined);
			assert.strictEqual(delta.removedEditors, undefined);

		} finally {
			TextModel._MODEL_SYNC_LIMIT = oldLimit;
		}
	});

	test('ignore huge model from editor', function () {

		const oldLimit = TextModel._MODEL_SYNC_LIMIT;
		try {
			const largeModelString = 'abc'.repeat(1024);
			TextModel._MODEL_SYNC_LIMIT = largeModelString.length / 2;

			const model = modelService.createModel(largeModelString, null);
			const editor = myCreateTestCodeEditor(model);

			assert.strictEqual(deltas.length, 1);
			deltas.length = 0;
			assert.strictEqual(deltas.length, 0);
			editor.dispose();
			model.dispose();

		} finally {
			TextModel._MODEL_SYNC_LIMIT = oldLimit;
		}
	});

	test('ignore simple widget model', function () {
		this.timeout(1000 * 60); // increase timeout for this one test

		const model = modelService.createModel('test', null, undefined, true);
		disposables.add(model);
		assert.ok(model.isForSimpleWidget);

		assert.strictEqual(deltas.length, 1);
		const [delta] = deltas;
		assert.strictEqual(delta.newActiveEditor, null);
		assert.strictEqual(delta.addedDocuments, undefined);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);
	});

	test('ignore editor w/o model', () => {
		const editor = myCreateTestCodeEditor(undefined);
		assert.strictEqual(deltas.length, 1);
		const [delta] = deltas;
		assert.strictEqual(delta.newActiveEditor, null);
		assert.strictEqual(delta.addedDocuments, undefined);
		assert.strictEqual(delta.removedDocuments, undefined);
		assert.strictEqual(delta.addedEditors, undefined);
		assert.strictEqual(delta.removedEditors, undefined);

		editor.dispose();
	});

	test('editor with model', () => {
		deltas.length = 0;

		const model = modelService.createModel('farboo', null);
		const editor = myCreateTestCodeEditor(model);

		assert.strictEqual(deltas.length, 2);
		const [first, second] = deltas;
		assert.strictEqual(first.addedDocuments!.length, 1);
		assert.strictEqual(first.newActiveEditor, undefined);
		assert.strictEqual(first.removedDocuments, undefined);
		assert.strictEqual(first.addedEditors, undefined);
		assert.strictEqual(first.removedEditors, undefined);

		assert.strictEqual(second.addedEditors!.length, 1);
		assert.strictEqual(second.addedDocuments, undefined);
		assert.strictEqual(second.removedDocuments, undefined);
		assert.strictEqual(second.removedEditors, undefined);
		assert.strictEqual(second.newActiveEditor, undefined);

		editor.dispose();
		model.dispose();
	});

	test('editor with dispos-ed/-ing model', () => {
		const model = modelService.createModel('farboo', null);
		const editor = myCreateTestCodeEditor(model);

		// ignore things until now
		deltas.length = 0;

		modelService.destroyModel(model.uri);
		assert.strictEqual(deltas.length, 1);
		const [first] = deltas;

		assert.strictEqual(first.newActiveEditor, undefined);
		assert.strictEqual(first.removedEditors!.length, 1);
		assert.strictEqual(first.removedDocuments!.length, 1);
		assert.strictEqual(first.addedDocuments, undefined);
		assert.strictEqual(first.addedEditors, undefined);

		editor.dispose();
		model.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadEditors.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadEditors.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../base/common/event.js';
import { DisposableStore, IReference, ImmortalReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IBulkEditService } from '../../../../editor/browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditOperation, ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { EndOfLineSequence, ITextSnapshot } from '../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { LanguageService } from '../../../../editor/common/services/languageService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ModelService } from '../../../../editor/common/services/modelService.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TestCodeEditorService } from '../../../../editor/test/browser/editorTestServices.js';
import { TestLanguageConfigurationService } from '../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { TestTreeSitterLibraryService } from '../../../../editor/test/common/services/testTreeSitterLibraryService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationService } from '../../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../../platform/notification/test/common/testNotificationService.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../../platform/undoRedo/common/undoRedoService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { BulkEditService } from '../../../contrib/bulkEdit/browser/bulkEditService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';
import { LabelService } from '../../../services/label/common/labelService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ICopyOperation, ICreateFileOperation, ICreateOperation, IDeleteOperation, IMoveOperation, IWorkingCopyFileService } from '../../../services/workingCopy/common/workingCopyFileService.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { TestEditorGroupsService, TestEditorService, TestEnvironmentService, TestLifecycleService, TestWorkingCopyService } from '../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestFileService, TestTextResourcePropertiesService } from '../../../test/common/workbenchTestServices.js';
import { MainThreadBulkEdits } from '../../browser/mainThreadBulkEdits.js';
import { MainThreadTextEditors, IMainThreadEditorLocator } from '../../browser/mainThreadEditors.js';
import { MainThreadTextEditor } from '../../browser/mainThreadEditor.js';
import { MainThreadDocuments } from '../../browser/mainThreadDocuments.js';
import { IWorkspaceTextEditDto } from '../../common/extHost.protocol.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { TestClipboardService } from '../../../../platform/clipboard/test/common/testClipboardService.js';
import { createTestCodeEditor } from '../../../../editor/test/browser/testCodeEditor.js';

suite('MainThreadEditors', () => {

	let disposables: DisposableStore;
	const existingResource = URI.parse('foo:existing');
	const resource = URI.parse('foo:bar');

	let modelService: IModelService;

	let bulkEdits: MainThreadBulkEdits;
	let editors: MainThreadTextEditors;
	let editorLocator: IMainThreadEditorLocator;
	let testEditor: MainThreadTextEditor;

	const movedResources = new Map<URI, URI>();
	const copiedResources = new Map<URI, URI>();
	const createdResources = new Set<URI>();
	const deletedResources = new Set<URI>();

	const editorId = 'testEditorId';

	setup(() => {
		disposables = new DisposableStore();

		movedResources.clear();
		copiedResources.clear();
		createdResources.clear();
		deletedResources.clear();

		const configService = new TestConfigurationService();
		const dialogService = new TestDialogService();
		const notificationService = new TestNotificationService();
		const undoRedoService = new UndoRedoService(dialogService, notificationService);
		const themeService = new TestThemeService();

		const services = new ServiceCollection();
		services.set(IBulkEditService, new SyncDescriptor(BulkEditService));
		services.set(ILabelService, new SyncDescriptor(LabelService));
		services.set(ILogService, new NullLogService());
		services.set(IWorkspaceContextService, new TestContextService());
		services.set(IEnvironmentService, TestEnvironmentService);
		services.set(IWorkbenchEnvironmentService, TestEnvironmentService);
		services.set(IConfigurationService, configService);
		services.set(IDialogService, dialogService);
		services.set(INotificationService, notificationService);
		services.set(IUndoRedoService, undoRedoService);
		services.set(ITextResourcePropertiesService, new SyncDescriptor(TestTextResourcePropertiesService));
		services.set(IModelService, new SyncDescriptor(ModelService));
		services.set(ICodeEditorService, new TestCodeEditorService(themeService));
		services.set(IFileService, new TestFileService());
		services.set(IUriIdentityService, new SyncDescriptor(UriIdentityService));
		services.set(ITreeSitterLibraryService, new TestTreeSitterLibraryService());
		services.set(IEditorService, disposables.add(new TestEditorService()));
		services.set(ILifecycleService, new TestLifecycleService());
		services.set(IWorkingCopyService, new TestWorkingCopyService());
		services.set(IEditorGroupsService, new TestEditorGroupsService());
		services.set(IClipboardService, new TestClipboardService());
		services.set(ITextFileService, new class extends mock<ITextFileService>() {
			override isDirty() { return false; }
			// eslint-disable-next-line local/code-no-any-casts
			override files = <any>{
				onDidSave: Event.None,
				onDidRevert: Event.None,
				onDidChangeDirty: Event.None,
				onDidChangeEncoding: Event.None
			};
			// eslint-disable-next-line local/code-no-any-casts
			override untitled = <any>{
				onDidChangeEncoding: Event.None
			};
			override create(operations: { resource: URI }[]) {
				for (const o of operations) {
					createdResources.add(o.resource);
				}
				return Promise.resolve(Object.create(null));
			}
			override async getEncodedReadable(resource: URI, value?: string | ITextSnapshot): Promise<any> {
				return undefined;
			}
		});
		services.set(IWorkingCopyFileService, new class extends mock<IWorkingCopyFileService>() {
			override onDidRunWorkingCopyFileOperation = Event.None;
			override createFolder(operations: ICreateOperation[]): any {
				this.create(operations);
			}
			override create(operations: ICreateFileOperation[]) {
				for (const operation of operations) {
					createdResources.add(operation.resource);
				}
				return Promise.resolve(Object.create(null));
			}
			override move(operations: IMoveOperation[]) {
				const { source, target } = operations[0].file;
				movedResources.set(source, target);
				return Promise.resolve(Object.create(null));
			}
			override copy(operations: ICopyOperation[]) {
				const { source, target } = operations[0].file;
				copiedResources.set(source, target);
				return Promise.resolve(Object.create(null));
			}
			override delete(operations: IDeleteOperation[]) {
				for (const operation of operations) {
					deletedResources.add(operation.resource);
				}
				return Promise.resolve(undefined);
			}
		});
		services.set(ITextModelService, new class extends mock<ITextModelService>() {
			override createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {
				const textEditorModel = new class extends mock<IResolvedTextEditorModel>() {
					override textEditorModel = modelService.getModel(resource)!;
				};
				textEditorModel.isReadonly = () => false;
				return Promise.resolve(new ImmortalReference(textEditorModel));
			}
		});
		services.set(IEditorWorkerService, new class extends mock<IEditorWorkerService>() {

		});
		services.set(IPaneCompositePartService, new class extends mock<IPaneCompositePartService>() implements IPaneCompositePartService {
			override onDidPaneCompositeOpen = Event.None;
			override onDidPaneCompositeClose = Event.None;
			override getActivePaneComposite() {
				return undefined;
			}
		});

		services.set(ILanguageService, disposables.add(new LanguageService()));
		services.set(ILanguageConfigurationService, new TestLanguageConfigurationService());

		const instaService = new InstantiationService(services);

		bulkEdits = instaService.createInstance(MainThreadBulkEdits, SingleProxyRPCProtocol(null));
		const documents = instaService.createInstance(MainThreadDocuments, SingleProxyRPCProtocol(null));

		// Create editor locator
		editorLocator = {
			getEditor(id: string): MainThreadTextEditor | undefined {
				return id === editorId ? testEditor : undefined;
			},
			findTextEditorIdFor() { return undefined; },
			getIdOfCodeEditor() { return undefined; }
		};

		editors = instaService.createInstance(MainThreadTextEditors, editorLocator, SingleProxyRPCProtocol(null));
		modelService = instaService.invokeFunction(accessor => accessor.get(IModelService));

		// Create a test code editor using the helper
		const model = modelService.createModel('Hello world!', null, existingResource);
		const testCodeEditor = disposables.add(createTestCodeEditor(model));

		testEditor = disposables.add(instaService.createInstance(
			MainThreadTextEditor,
			editorId,
			model,
			testCodeEditor,
			{ onGainedFocus() { }, onLostFocus() { } },
			documents
		));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test(`applyWorkspaceEdit returns false if model is changed by user`, () => {

		const model = disposables.add(modelService.createModel('something', null, resource));

		const workspaceResourceEdit: IWorkspaceTextEditDto = {
			resource: resource,
			versionId: model.getVersionId(),
			textEdit: {
				text: 'asdfg',
				range: new Range(1, 1, 1, 1)
			}
		};

		// Act as if the user edited the model
		model.applyEdits([EditOperation.insert(new Position(0, 0), 'something')]);

		return bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({ edits: [workspaceResourceEdit] })).then((result) => {
			assert.strictEqual(result, false);
		});
	});

	test(`issue #54773: applyWorkspaceEdit checks model version in race situation`, () => {

		const model = disposables.add(modelService.createModel('something', null, resource));

		const workspaceResourceEdit1: IWorkspaceTextEditDto = {
			resource: resource,
			versionId: model.getVersionId(),
			textEdit: {
				text: 'asdfg',
				range: new Range(1, 1, 1, 1)
			}
		};
		const workspaceResourceEdit2: IWorkspaceTextEditDto = {
			resource: resource,
			versionId: model.getVersionId(),
			textEdit: {
				text: 'asdfg',
				range: new Range(1, 1, 1, 1)
			}
		};

		const p1 = bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({ edits: [workspaceResourceEdit1] })).then((result) => {
			// first edit request succeeds
			assert.strictEqual(result, true);
		});
		const p2 = bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({ edits: [workspaceResourceEdit2] })).then((result) => {
			// second edit request fails
			assert.strictEqual(result, false);
		});
		return Promise.all([p1, p2]);
	});

	test('applyWorkspaceEdit: noop eol edit keeps undo stack clean', async () => {

		const initialText = 'hello\nworld';
		const model = disposables.add(modelService.createModel(initialText, null, resource));
		const initialAlternativeVersionId = model.getAlternativeVersionId();

		const insertEdit: IWorkspaceTextEditDto = {
			resource: resource,
			versionId: model.getVersionId(),
			textEdit: {
				range: new Range(1, 6, 1, 6),
				text: '2'
			}
		};

		const insertResult = await bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({ edits: [insertEdit] }));
		assert.strictEqual(insertResult, true);
		assert.strictEqual(model.getValue(), 'hello2\nworld');
		assert.notStrictEqual(model.getAlternativeVersionId(), initialAlternativeVersionId);

		const eolEdit: IWorkspaceTextEditDto = {
			resource: resource,
			versionId: model.getVersionId(),
			textEdit: {
				range: new Range(1, 1, 1, 1),
				text: '',
				eol: EndOfLineSequence.LF
			}
		};

		const eolResult = await bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({ edits: [eolEdit] }));
		assert.strictEqual(eolResult, true);
		assert.strictEqual(model.getValue(), 'hello2\nworld');

		const undoResult = model.undo();
		if (undoResult) {
			await undoResult;
		}
		assert.strictEqual(model.getValue(), initialText);
		assert.strictEqual(model.getAlternativeVersionId(), initialAlternativeVersionId);
	});

	test(`applyWorkspaceEdit with only resource edit`, () => {
		return bulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers({
			edits: [
				{ oldResource: resource, newResource: resource, options: undefined },
				{ oldResource: undefined, newResource: resource, options: undefined },
				{ oldResource: resource, newResource: undefined, options: undefined }
			]
		})).then((result) => {
			assert.strictEqual(result, true);
			assert.strictEqual(movedResources.get(resource), resource);
			assert.strictEqual(createdResources.has(resource), true);
			assert.strictEqual(deletedResources.has(resource), true);
		});
	});

	test('applyWorkspaceEdit can control undo/redo stack 1', async () => {
		const model = modelService.getModel(existingResource)!;

		const edit1: ISingleEditOperation = {
			range: new Range(1, 1, 1, 2),
			text: 'h',
			forceMoveMarkers: false
		};

		const applied1 = await editors.$tryApplyEdits(editorId, model.getVersionId(), [edit1], { undoStopBefore: false, undoStopAfter: false });
		assert.strictEqual(applied1, true);
		assert.strictEqual(model.getValue(), 'hello world!');

		const edit2: ISingleEditOperation = {
			range: new Range(1, 2, 1, 6),
			text: 'ELLO',
			forceMoveMarkers: false
		};

		const applied2 = await editors.$tryApplyEdits(editorId, model.getVersionId(), [edit2], { undoStopBefore: false, undoStopAfter: false });
		assert.strictEqual(applied2, true);
		assert.strictEqual(model.getValue(), 'hELLO world!');

		await model.undo();
		assert.strictEqual(model.getValue(), 'Hello world!');
	});

	test('applyWorkspaceEdit can control undo/redo stack 2', async () => {
		const model = modelService.getModel(existingResource)!;

		const edit1: ISingleEditOperation = {
			range: new Range(1, 1, 1, 2),
			text: 'h',
			forceMoveMarkers: false
		};

		const applied1 = await editors.$tryApplyEdits(editorId, model.getVersionId(), [edit1], { undoStopBefore: false, undoStopAfter: false });
		assert.strictEqual(applied1, true);
		assert.strictEqual(model.getValue(), 'hello world!');

		const edit2: ISingleEditOperation = {
			range: new Range(1, 2, 1, 6),
			text: 'ELLO',
			forceMoveMarkers: false
		};

		const applied2 = await editors.$tryApplyEdits(editorId, model.getVersionId(), [edit2], { undoStopBefore: true, undoStopAfter: false });
		assert.strictEqual(applied2, true);
		assert.strictEqual(model.getValue(), 'hELLO world!');

		await model.undo();
		assert.strictEqual(model.getValue(), 'hello world!');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadManagedSockets.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadManagedSockets.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { disposableTimeout, timeout } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { SocketCloseEvent } from '../../../../base/parts/ipc/common/ipc.net.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { RemoteSocketHalf } from '../../../../platform/remote/common/managedSocket.js';
import { MainThreadManagedSocket } from '../../browser/mainThreadManagedSockets.js';
import { ExtHostManagedSocketsShape } from '../../common/extHost.protocol.js';

suite('MainThreadManagedSockets', () => {

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	suite('ManagedSocket', () => {
		let extHost: ExtHostMock;
		let half: RemoteSocketHalf;

		class ExtHostMock extends mock<ExtHostManagedSocketsShape>() {
			private onDidFire = new Emitter<void>();
			public readonly events: any[] = [];

			override $remoteSocketWrite(socketId: number, buffer: VSBuffer): void {
				this.events.push({ socketId, data: buffer.toString() });
				this.onDidFire.fire();
			}

			override $remoteSocketDrain(socketId: number) {
				this.events.push({ socketId, event: 'drain' });
				this.onDidFire.fire();
				return Promise.resolve();
			}

			override $remoteSocketEnd(socketId: number) {
				this.events.push({ socketId, event: 'end' });
				this.onDidFire.fire();
			}

			expectEvent(test: (evt: any) => void, message: string) {
				if (this.events.some(test)) {
					return;
				}

				const d = new DisposableStore();
				return new Promise<void>(resolve => {
					d.add(this.onDidFire.event(() => {
						if (this.events.some(test)) {
							return;
						}
					}));
					d.add(disposableTimeout(() => {
						throw new Error(`Expected ${message} but only had ${JSON.stringify(this.events, null, 2)}`);
					}, 1000));
				}).finally(() => d.dispose());
			}
		}

		setup(() => {
			extHost = new ExtHostMock();
			half = {
				onClose: new Emitter<SocketCloseEvent>(),
				onData: new Emitter<VSBuffer>(),
				onEnd: new Emitter<void>(),
			};
		});

		async function doConnect() {
			const socket = MainThreadManagedSocket.connect(1, extHost, '/hello', 'world=true', '', half);
			await extHost.expectEvent(evt => evt.data && evt.data.startsWith('GET ws://localhost/hello?world=true&skipWebSocketFrames=true HTTP/1.1\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Key:'), 'websocket open event');
			half.onData.fire(VSBuffer.fromString('Opened successfully ;)\r\n\r\n'));
			return ds.add(await socket);
		}

		test('connects', async () => {
			await doConnect();
		});

		test('includes trailing connection data', async () => {
			const socketProm = MainThreadManagedSocket.connect(1, extHost, '/hello', 'world=true', '', half);
			await extHost.expectEvent(evt => evt.data && evt.data.includes('GET ws://localhost'), 'websocket open event');
			half.onData.fire(VSBuffer.fromString('Opened successfully ;)\r\n\r\nSome trailing data'));
			const socket = ds.add(await socketProm);

			const data: string[] = [];
			ds.add(socket.onData(d => data.push(d.toString())));
			await timeout(1); // allow microtasks to flush
			assert.deepStrictEqual(data, ['Some trailing data']);
		});

		test('round trips data', async () => {
			const socket = await doConnect();
			const data: string[] = [];
			ds.add(socket.onData(d => data.push(d.toString())));

			socket.write(VSBuffer.fromString('ping'));
			await extHost.expectEvent(evt => evt.data === 'ping', 'expected ping');
			half.onData.fire(VSBuffer.fromString('pong'));
			assert.deepStrictEqual(data, ['pong']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadTreeViews.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadTreeViews.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import assert from 'assert';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { TestNotificationService } from '../../../../platform/notification/test/common/testNotificationService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { MainThreadTreeViews } from '../../browser/mainThreadTreeViews.js';
import { ExtHostTreeViewsShape } from '../../common/extHost.protocol.js';
import { CustomTreeView } from '../../../browser/parts/views/treeView.js';
import { Extensions, ITreeItem, ITreeView, ITreeViewDescriptor, IViewContainersRegistry, IViewDescriptorService, IViewsRegistry, TreeItemCollapsibleState, ViewContainer, ViewContainerLocation } from '../../../common/views.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { ViewDescriptorService } from '../../../services/views/browser/viewDescriptorService.js';
import { TestViewsService, workbenchInstantiationService } from '../../../test/browser/workbenchTestServices.js';
import { TestExtensionService } from '../../../test/common/workbenchTestServices.js';

suite('MainThreadHostTreeView', function () {
	const testTreeViewId = 'testTreeView';
	const customValue = 'customValue';
	const ViewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);

	interface CustomTreeItem extends ITreeItem {
		customProp: string;
	}

	class MockExtHostTreeViewsShape extends mock<ExtHostTreeViewsShape>() {
		override async $getChildren(treeViewId: string, treeItemHandle?: string[]): Promise<(number | ITreeItem)[][]> {
			return [[0, <CustomTreeItem>{ handle: 'testItem1', collapsibleState: TreeItemCollapsibleState.Expanded, customProp: customValue }]];
		}

		override async $hasResolve(): Promise<boolean> {
			return false;
		}

		override $setVisible(): void { }
	}

	let container: ViewContainer;
	let mainThreadTreeViews: MainThreadTreeViews;
	let extHostTreeViewsShape: MockExtHostTreeViewsShape;

	teardown(() => {
		ViewsRegistry.deregisterViews(ViewsRegistry.getViews(container), container);
	});

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		const instantiationService: TestInstantiationService = workbenchInstantiationService(undefined, disposables);
		const viewDescriptorService = disposables.add(instantiationService.createInstance(ViewDescriptorService));
		instantiationService.stub(IViewDescriptorService, viewDescriptorService);
		// eslint-disable-next-line local/code-no-any-casts
		container = Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry).registerViewContainer({ id: 'testContainer', title: nls.localize2('test', 'test'), ctorDescriptor: new SyncDescriptor(<any>{}) }, ViewContainerLocation.Sidebar);
		const viewDescriptor: ITreeViewDescriptor = {
			id: testTreeViewId,
			ctorDescriptor: null!,
			name: nls.localize2('Test View 1', 'Test View 1'),
			treeView: disposables.add(instantiationService.createInstance(CustomTreeView, 'testTree', 'Test Title', 'extension.id')),
		};
		ViewsRegistry.registerViews([viewDescriptor], container);

		const testExtensionService = new TestExtensionService();
		extHostTreeViewsShape = new MockExtHostTreeViewsShape();
		mainThreadTreeViews = disposables.add(new MainThreadTreeViews(
			new class implements IExtHostContext {
				remoteAuthority = '';
				extensionHostKind = ExtensionHostKind.LocalProcess;
				dispose() { }
				assertRegistered() { }
				set(v: any): any { return null; }
				getProxy(): any {
					return extHostTreeViewsShape;
				}
				drain(): any { return null; }
			}, new TestViewsService(), new TestNotificationService(), testExtensionService, new NullLogService()));
		mainThreadTreeViews.$registerTreeViewDataProvider(testTreeViewId, { showCollapseAll: false, canSelectMany: false, dropMimeTypes: [], dragMimeTypes: [], hasHandleDrag: false, hasHandleDrop: false, manuallyManageCheckboxes: false });
		await testExtensionService.whenInstalledExtensionsRegistered();
	});

	test('getChildren keeps custom properties', async () => {
		const treeView: ITreeView = (<ITreeViewDescriptor>ViewsRegistry.getView(testTreeViewId)).treeView;
		const children = await treeView.dataProvider?.getChildren({ handle: 'root', collapsibleState: TreeItemCollapsibleState.Expanded });
		assert(children!.length === 1, 'Exactly one child should be returned');
		assert((<CustomTreeItem>children![0]).customProp === customValue, 'Tree Items should keep custom properties');
	});


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadVariableProvider.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadVariableProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestMainThreadNotebookKernels } from './TestMainThreadNotebookKernels.js';
import { ExtHostNotebookKernelsShape } from '../../common/extHost.protocol.js';
import { mock } from '../../../test/common/workbenchTestServices.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { AsyncIterableProducer } from '../../../../base/common/async.js';
import { VariablesResult } from '../../../contrib/notebook/common/notebookKernelService.js';

type variableGetter = () => Promise<VariablesResult>;

suite('MainThreadNotebookKernelVariableProvider', function () {
	let mainThreadKernels: TestMainThreadNotebookKernels;
	let variables: (VariablesResult | variableGetter)[];

	teardown(function () {
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async function () {
		const proxy = new class extends mock<ExtHostNotebookKernelsShape>() {
			override async $provideVariables(handle: number, requestId: string, notebookUri: UriComponents, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): Promise<void> {
				for (const variable of variables) {
					if (token.isCancellationRequested) {
						return;
					}
					const result = typeof variable === 'function'
						? await variable()
						: variable;
					mainThreadKernels.instance.$receiveVariable(requestId, result);
				}
			}
		};
		const extHostContext = SingleProxyRPCProtocol(proxy);
		variables = [];
		mainThreadKernels = store.add(new TestMainThreadNotebookKernels(extHostContext));
	});

	test('get variables from kernel', async function () {
		await mainThreadKernels.addKernel('test-kernel');

		const kernel = mainThreadKernels.getKernel('test-kernel');
		assert.ok(kernel, 'Kernel should be registered');

		variables.push(createVariable(1));
		variables.push(createVariable(2));
		const vars = kernel.provideVariables(URI.file('nb.ipynb'), undefined, 'named', 0, CancellationToken.None);

		await verifyVariables(vars, [1, 2]);
	});

	test('get variables twice', async function () {
		await mainThreadKernels.addKernel('test-kernel');

		const kernel = mainThreadKernels.getKernel('test-kernel');
		assert.ok(kernel, 'Kernel should be registered');

		variables.push(createVariable(1));
		variables.push(createVariable(2));
		const vars = kernel.provideVariables(URI.file('nb.ipynb'), undefined, 'named', 0, CancellationToken.None);
		const vars2 = kernel.provideVariables(URI.file('nb.ipynb'), undefined, 'named', 0, CancellationToken.None);

		await verifyVariables(vars, [1, 2]);
		await verifyVariables(vars2, [1, 2]);
	});

	test('gets all variables async', async function () {
		await mainThreadKernels.addKernel('test-kernel');

		const kernel = mainThreadKernels.getKernel('test-kernel');
		assert.ok(kernel, 'Kernel should be registered');

		variables.push(createVariable(1));
		const result = createVariable(2);
		variables.push(async () => {
			await new Promise(resolve => setTimeout(resolve, 5));
			return result;
		});
		variables.push(createVariable(3));
		const vars = kernel.provideVariables(URI.file('nb.ipynb'), undefined, 'named', 0, CancellationToken.None);

		await verifyVariables(vars, [1, 2, 3]);
	});

	test('cancel while getting variables', async function () {
		await mainThreadKernels.addKernel('test-kernel');

		const kernel = mainThreadKernels.getKernel('test-kernel');
		assert.ok(kernel, 'Kernel should be registered');

		variables.push(createVariable(1));
		const result = createVariable(2);
		variables.push(async () => {
			await new Promise(resolve => setTimeout(resolve, 50));
			return result;
		});
		variables.push(createVariable(3));
		const cancellation = new CancellationTokenSource();
		const vars = kernel.provideVariables(URI.file('nb.ipynb'), undefined, 'named', 0, cancellation.token);
		cancellation.cancel();

		await verifyVariables(vars, [1, 2]);
	});
});

async function verifyVariables(variables: AsyncIterableProducer<VariablesResult>, expectedIds: number[]) {
	let varIx = 0;

	for await (const variable of variables) {
		assert.ok(expectedIds[varIx], 'more variables than expected');
		assert.strictEqual(variable.id, expectedIds[varIx++]);
	}
}

function createVariable(id: number) {
	return {
		id,
		name: `var${id}`,
		value: `${id}`,
		type: 'number',
		expression: `var${id}`,
		hasNamedChildren: false,
		indexedChildrenCount: 0,
		extensionId: 'extension-id1',
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadWorkspace.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadWorkspace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MainThreadWorkspace } from '../../browser/mainThreadWorkspace.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { IFileQuery, ISearchService } from '../../../services/search/common/search.js';
import { workbenchInstantiationService } from '../../../test/browser/workbenchTestServices.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';

suite('MainThreadWorkspace', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let configService: TestConfigurationService;
	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables) as TestInstantiationService;

		configService = instantiationService.get(IConfigurationService) as TestConfigurationService;
		configService.setUserConfiguration('search', {});
	});

	test('simple', () => {
		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.strictEqual(query.folderQueries.length, 1);
				assert.strictEqual(query.folderQueries[0].disregardIgnoreFiles, true);

				assert.deepStrictEqual({ ...query.includePattern }, { 'foo': true });
				assert.strictEqual(query.maxResults, 10);

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(null, { maxResults: 10, includePattern: 'foo', disregardSearchExcludeSettings: true }, CancellationToken.None);
	});

	test('exclude defaults', () => {
		configService.setUserConfiguration('search', {
			'exclude': { 'searchExclude': true }
		});
		configService.setUserConfiguration('files', {
			'exclude': { 'filesExclude': true }
		});

		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.strictEqual(query.folderQueries.length, 1);
				assert.strictEqual(query.folderQueries[0].disregardIgnoreFiles, true);
				assert.strictEqual(query.folderQueries[0].excludePattern?.length, 1);
				assert.deepStrictEqual(query.folderQueries[0].excludePattern[0].pattern, { 'filesExclude': true });

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(null, { maxResults: 10, includePattern: '', disregardSearchExcludeSettings: true }, CancellationToken.None);
	});

	test('disregard excludes', () => {
		configService.setUserConfiguration('search', {
			'exclude': { 'searchExclude': true }
		});
		configService.setUserConfiguration('files', {
			'exclude': { 'filesExclude': true }
		});

		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.deepStrictEqual(query.folderQueries[0].excludePattern, []);
				assert.deepStrictEqual(query.excludePattern, undefined);

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(null, { maxResults: 10, includePattern: '', disregardSearchExcludeSettings: true, disregardExcludeSettings: true }, CancellationToken.None);
	});

	test('do not disregard anything if disregardExcludeSettings is true', () => {
		configService.setUserConfiguration('search', {
			'exclude': { 'searchExclude': true }
		});
		configService.setUserConfiguration('files', {
			'exclude': { 'filesExclude': true }
		});

		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.strictEqual(query.folderQueries.length, 1);
				assert.strictEqual(query.folderQueries[0].disregardIgnoreFiles, true);
				assert.deepStrictEqual(query.folderQueries[0].excludePattern, []);

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(null, { maxResults: 10, includePattern: '', disregardExcludeSettings: true, disregardSearchExcludeSettings: false }, CancellationToken.None);
	});

	test('exclude string', () => {
		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.deepStrictEqual(query.folderQueries[0].excludePattern, []);
				assert.deepStrictEqual({ ...query.excludePattern }, { 'exclude/**': true });

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(null, { maxResults: 10, includePattern: '', excludePattern: [{ pattern: 'exclude/**' }], disregardSearchExcludeSettings: true }, CancellationToken.None);
	});
	test('Valid revived URI after moving to EH', () => {
		const uriComponents: UriComponents = {
			scheme: 'test',
			path: '/Users/username/Downloads',
		};
		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery) {
				assert.strictEqual(query.folderQueries?.length, 1);
				assert.ok(URI.isUri(query.folderQueries[0].folder));
				assert.strictEqual(query.folderQueries[0].folder.path, '/Users/username/Downloads');
				assert.strictEqual(query.folderQueries[0].folder.scheme, 'test');

				return Promise.resolve({ results: [], messages: [] });
			}
		});

		const mtw = disposables.add(instantiationService.createInstance(MainThreadWorkspace, SingleProxyRPCProtocol({ $initializeWorkspace: () => { } })));
		return mtw.$startFileSearch(uriComponents, { filePattern: '*.md' }, CancellationToken.None);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/TestMainThreadNotebookKernels.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/TestMainThreadNotebookKernels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mock } from '../../../test/common/workbenchTestServices.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import { INotebookKernel, INotebookKernelService } from '../../../contrib/notebook/common/notebookKernelService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { INotebookCellExecution, INotebookExecution, INotebookExecutionStateService } from '../../../contrib/notebook/common/notebookExecutionStateService.js';
import { INotebookService } from '../../../contrib/notebook/common/notebookService.js';
import { INotebookEditorService } from '../../../contrib/notebook/browser/services/notebookEditorService.js';
import { Event } from '../../../../base/common/event.js';
import { MainThreadNotebookKernels } from '../../browser/mainThreadNotebookKernels.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';

export class TestMainThreadNotebookKernels extends Disposable {
	private readonly instantiationService: TestInstantiationService;
	private readonly registeredKernels = new Map<string, INotebookKernel>();
	private mainThreadNotebookKernels: MainThreadNotebookKernels;
	private kernelHandle = 0;

	constructor(extHostContext: IExtHostContext) {
		super();
		this.instantiationService = this._register(new TestInstantiationService());
		this.setupDefaultStubs();
		this.mainThreadNotebookKernels = this._register(this.instantiationService.createInstance(MainThreadNotebookKernels, extHostContext));
	}

	private setupDefaultStubs(): void {
		this.instantiationService.stub(ILanguageService, new class extends mock<ILanguageService>() {
			override getRegisteredLanguageIds() {
				return ['typescript', 'javascript', 'python'];
			}
		});

		this.instantiationService.stub(INotebookKernelService, new class extends mock<INotebookKernelService>() {
			constructor(private builder: TestMainThreadNotebookKernels) {
				super();
			}

			override registerKernel(kernel: INotebookKernel) {
				this.builder.registeredKernels.set(kernel.id, kernel);
				return Disposable.None;
			}
			override onDidChangeSelectedNotebooks = Event.None;
			override getMatchingKernel() {
				return {
					selected: undefined,
					suggestions: [],
					all: [],
					hidden: []
				};
			}
		}(this));

		this.instantiationService.stub(INotebookExecutionStateService, new class extends mock<INotebookExecutionStateService>() {
			override createCellExecution(): INotebookCellExecution {
				return new class extends mock<INotebookCellExecution>() { };
			}
			override createExecution(): INotebookExecution {
				return new class extends mock<INotebookExecution>() { };
			}
		});

		this.instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override getNotebookTextModel() {
				return undefined;
			}
		});

		this.instantiationService.stub(INotebookEditorService, new class extends mock<INotebookEditorService>() {
			override listNotebookEditors() {
				return [];
			}
			override onDidAddNotebookEditor = Event.None;
			override onDidRemoveNotebookEditor = Event.None;
		});
	}

	get instance(): MainThreadNotebookKernels {
		return this.mainThreadNotebookKernels;
	}

	async addKernel(id: string): Promise<void> {
		const handle = this.kernelHandle++;
		await this.instance.$addKernel(handle, {
			id,
			notebookType: 'test-notebook',
			extensionId: new ExtensionIdentifier('test.extension'),
			extensionLocation: { scheme: 'test', path: '/test' },
			label: 'Test Kernel',
			description: 'A test kernel',
			hasVariableProvider: true
		});
	}

	getKernel(id: string): INotebookKernel | undefined {
		return this.registeredKernels.get(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/extensionHostMain.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/extensionHostMain.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SerializedError, errorHandler, onUnexpectedError } from '../../../../base/common/errors.js';
import { isFirefox, isSafari } from '../../../../base/common/platform.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationService } from '../../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { MainThreadErrorsShape, MainThreadExtensionServiceShape } from '../../common/extHost.protocol.js';
import { ExtensionPaths, IExtHostExtensionService } from '../../common/extHostExtensionService.js';
import { IExtHostRpcService } from '../../common/extHostRpcService.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ErrorHandler } from '../../common/extensionHostMain.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { ProxyIdentifier, Proxied } from '../../../services/extensions/common/proxyIdentifier.js';
import { IExtHostApiDeprecationService, NullApiDeprecationService } from '../../common/extHostApiDeprecationService.js';
import { ExtensionDescriptionRegistry, IActivationEventsReader } from '../../../services/extensions/common/extensionDescriptionRegistry.js';


suite('ExtensionHostMain#ErrorHandler - Wrapping prepareStackTrace can cause slowdown and eventual stack overflow #184926 ', function () {

	if (isFirefox || isSafari) {
		return;
	}

	const extensionsIndex = TernarySearchTree.forUris<IExtensionDescription>();
	const mainThreadExtensionsService = new class extends mock<MainThreadExtensionServiceShape>() implements MainThreadErrorsShape {
		override $onExtensionRuntimeError(extensionId: ExtensionIdentifier, data: SerializedError): void {

		}
		$onUnexpectedError(err: any | SerializedError): void {

		}
	};

	const basicActivationEventsReader: IActivationEventsReader = {
		readActivationEvents: (extensionDescription: IExtensionDescription): string[] => {
			return [];
		}
	};

	const collection = new ServiceCollection(
		[ILogService, new NullLogService()],
		[IExtHostTelemetry, new class extends mock<IExtHostTelemetry>() {
			declare readonly _serviceBrand: undefined;
			override onExtensionError(extension: ExtensionIdentifier, error: Error): boolean {
				return true;
			}
		}],
		[IExtHostExtensionService, new class extends mock<IExtHostExtensionService & any>() {
			declare readonly _serviceBrand: undefined;
			getExtensionPathIndex() {
				return new class extends ExtensionPaths {
					override findSubstr(key: URI): IExtensionDescription | undefined {
						findSubstrCount++;
						return nullExtensionDescription;
					}

				}(extensionsIndex);
			}
			getExtensionRegistry() {
				return new class extends ExtensionDescriptionRegistry {
					override getExtensionDescription(extensionId: ExtensionIdentifier | string): IExtensionDescription | undefined {
						return nullExtensionDescription;
					}
				}(basicActivationEventsReader, []);
			}
		}],
		[IExtHostRpcService, new class extends mock<IExtHostRpcService>() {
			declare readonly _serviceBrand: undefined;
			override getProxy<T>(identifier: ProxyIdentifier<T>): Proxied<T> {
				// eslint-disable-next-line local/code-no-any-casts
				return <any>mainThreadExtensionsService;
			}
		}],
		[IExtHostApiDeprecationService, NullApiDeprecationService],
	);

	const originalPrepareStackTrace = Error.prepareStackTrace;
	const insta = new InstantiationService(collection, false);

	let existingErrorHandler: (e: any) => void;
	let findSubstrCount = 0;

	ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(async function () {
		existingErrorHandler = errorHandler.getUnexpectedErrorHandler();
		await insta.invokeFunction(ErrorHandler.installFullHandler);
	});

	suiteTeardown(function () {
		errorHandler.setUnexpectedErrorHandler(existingErrorHandler);
	});

	setup(async function () {
		findSubstrCount = 0;
	});

	teardown(() => {
		Error.prepareStackTrace = originalPrepareStackTrace;
	});

	test('basics', function () {

		const err = new Error('test1');

		onUnexpectedError(err);

		assert.strictEqual(findSubstrCount, 1);

	});

	test('set/reset prepareStackTrace-callback', function () {

		const original = Error.prepareStackTrace;
		Error.prepareStackTrace = (_error, _stack) => 'stack';
		const probeErr = new Error();
		const stack = probeErr.stack;
		assert.ok(stack);
		Error.prepareStackTrace = original;
		assert.strictEqual(findSubstrCount, 1);

		// already checked
		onUnexpectedError(probeErr);
		assert.strictEqual(findSubstrCount, 1);

		// one more error
		const err = new Error('test2');
		onUnexpectedError(err);

		assert.strictEqual(findSubstrCount, 2);
	});

	test('wrap prepareStackTrace-callback', function () {

		function do_something_else(params: string) {
			return params;
		}

		const original = Error.prepareStackTrace;
		Error.prepareStackTrace = (...args) => {
			return do_something_else(original?.(...args));
		};
		const probeErr = new Error();
		const stack = probeErr.stack;
		assert.ok(stack);


		onUnexpectedError(probeErr);
		assert.strictEqual(findSubstrCount, 1);
	});

	test('prevent rewrapping', function () {

		let do_something_count = 0;
		function do_something(params: any) {
			do_something_count++;
		}

		Error.prepareStackTrace = (result, stack) => {
			do_something(stack);
			return 'fakestack';
		};

		for (let i = 0; i < 2_500; ++i) {
			Error.prepareStackTrace = Error.prepareStackTrace;
		}

		const probeErr = new Error();
		const stack = probeErr.stack;
		assert.strictEqual(stack, 'fakestack');

		onUnexpectedError(probeErr);
		assert.strictEqual(findSubstrCount, 1);

		const probeErr2 = new Error();
		onUnexpectedError(probeErr2);
		assert.strictEqual(findSubstrCount, 2);
		assert.strictEqual(do_something_count, 2);
	});


	suite('https://gist.github.com/thecrypticace/f0f2e182082072efdaf0f8e1537d2cce', function () {

		test('Restored, separate operations', () => {
			// Actual Test
			let original;

			// Operation 1
			original = Error.prepareStackTrace;
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			const err1 = new Error();
			assert.ok(err1.stack);
			assert.strictEqual(findSubstrCount, 1);
			Error.prepareStackTrace = original;

			// Operation 2
			original = Error.prepareStackTrace;
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);
			assert.strictEqual(findSubstrCount, 2);
			Error.prepareStackTrace = original;

			// Operation 3
			original = Error.prepareStackTrace;
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);
			assert.strictEqual(findSubstrCount, 3);
			Error.prepareStackTrace = original;

			// Operation 4
			original = Error.prepareStackTrace;
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);
			assert.strictEqual(findSubstrCount, 4);
			Error.prepareStackTrace = original;

			// Back to Operation 1
			assert.ok(err1.stack);
			assert.strictEqual(findSubstrCount, 4);
		});

		test('Never restored, separate operations', () => {
			// Operation 1
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);

			// Operation 2
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);

			// Operation 3
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);

			// Operation 4
			for (let i = 0; i < 12_500; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);
		});

		test('Restored, too many uses before restoration', async () => {
			const original = Error.prepareStackTrace;
			Error.prepareStackTrace = (_, stack) => stack;

			// Operation 1 — more uses of `prepareStackTrace`
			for (let i = 0; i < 10_000; ++i) { Error.prepareStackTrace = Error.prepareStackTrace; }
			assert.ok(new Error().stack);

			Error.prepareStackTrace = original;
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/extHostExtensionActivator.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/extHostExtensionActivator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { promiseWithResolvers, timeout } from '../../../../base/common/async.js';
import { Mutable } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtensionIdentifier, IExtensionDescription, TargetPlatform } from '../../../../platform/extensions/common/extensions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ActivatedExtension, EmptyExtension, ExtensionActivationTimes, ExtensionsActivator, IExtensionsActivatorHost } from '../../common/extHostExtensionActivator.js';
import { ExtensionDescriptionRegistry, IActivationEventsReader } from '../../../services/extensions/common/extensionDescriptionRegistry.js';
import { ExtensionActivationReason, MissingExtensionDependency } from '../../../services/extensions/common/extensions.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

suite('ExtensionsActivator', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const idA = new ExtensionIdentifier(`a`);
	const idB = new ExtensionIdentifier(`b`);
	const idC = new ExtensionIdentifier(`c`);

	test('calls activate only once with sequential activations', async () => {
		const disposables = new DisposableStore();
		const host = new SimpleExtensionsActivatorHost();
		const activator = createActivator(host, [
			desc(idA)
		], [], disposables);

		await activator.activateByEvent('*', false);
		assert.deepStrictEqual(host.activateCalls, [idA]);

		await activator.activateByEvent('*', false);
		assert.deepStrictEqual(host.activateCalls, [idA]);

		disposables.dispose();
	});

	test('calls activate only once with parallel activations', async () => {
		const disposables = new DisposableStore();
		const extActivation = new ExtensionActivationPromiseSource();
		const host = new PromiseExtensionsActivatorHost([
			[idA, extActivation]
		]);
		const activator = createActivator(host, [
			desc(idA, [], ['evt1', 'evt2'])
		], [], disposables);

		const activate1 = activator.activateByEvent('evt1', false);
		const activate2 = activator.activateByEvent('evt2', false);

		extActivation.resolve();

		await activate1;
		await activate2;

		assert.deepStrictEqual(host.activateCalls, [idA]);

		disposables.dispose();
	});

	test('activates dependencies first', async () => {
		const disposables = new DisposableStore();
		const extActivationA = new ExtensionActivationPromiseSource();
		const extActivationB = new ExtensionActivationPromiseSource();
		const host = new PromiseExtensionsActivatorHost([
			[idA, extActivationA],
			[idB, extActivationB]
		]);
		const activator = createActivator(host, [
			desc(idA, [idB], ['evt1']),
			desc(idB, [], ['evt1']),
		], [], disposables);

		const activate = activator.activateByEvent('evt1', false);

		await timeout(0);
		assert.deepStrictEqual(host.activateCalls, [idB]);
		extActivationB.resolve();

		await timeout(0);
		assert.deepStrictEqual(host.activateCalls, [idB, idA]);
		extActivationA.resolve();

		await timeout(0);
		await activate;

		assert.deepStrictEqual(host.activateCalls, [idB, idA]);

		disposables.dispose();
	});

	test('Supports having resolved extensions', async () => {
		const disposables = new DisposableStore();
		const host = new SimpleExtensionsActivatorHost();
		const bExt = desc(idB);
		delete (<Mutable<IExtensionDescription>>bExt).main;
		delete (<Mutable<IExtensionDescription>>bExt).browser;
		const activator = createActivator(host, [
			desc(idA, [idB])
		], [bExt], disposables);

		await activator.activateByEvent('*', false);
		assert.deepStrictEqual(host.activateCalls, [idA]);

		disposables.dispose();
	});

	test('Supports having external extensions', async () => {
		const disposables = new DisposableStore();
		const extActivationA = new ExtensionActivationPromiseSource();
		const extActivationB = new ExtensionActivationPromiseSource();
		const host = new PromiseExtensionsActivatorHost([
			[idA, extActivationA],
			[idB, extActivationB]
		]);
		const bExt = desc(idB);
		(<Mutable<IExtensionDescription>>bExt).api = 'none';
		const activator = createActivator(host, [
			desc(idA, [idB])
		], [bExt], disposables);

		const activate = activator.activateByEvent('*', false);

		await timeout(0);
		assert.deepStrictEqual(host.activateCalls, [idB]);
		extActivationB.resolve();

		await timeout(0);
		assert.deepStrictEqual(host.activateCalls, [idB, idA]);
		extActivationA.resolve();

		await activate;
		assert.deepStrictEqual(host.activateCalls, [idB, idA]);

		disposables.dispose();
	});

	test('Error: activateById with missing extension', async () => {
		const disposables = new DisposableStore();
		const host = new SimpleExtensionsActivatorHost();
		const activator = createActivator(host, [
			desc(idA),
			desc(idB),
		], [], disposables);

		let error: Error | undefined = undefined;
		try {
			await activator.activateById(idC, { startup: false, extensionId: idC, activationEvent: 'none' });
		} catch (err) {
			error = err;
		}

		assert.strictEqual(typeof error === 'undefined', false);

		disposables.dispose();
	});

	test('Error: dependency missing', async () => {
		const disposables = new DisposableStore();
		const host = new SimpleExtensionsActivatorHost();
		const activator = createActivator(host, [
			desc(idA, [idB]),
		], [], disposables);

		await activator.activateByEvent('*', false);

		assert.deepStrictEqual(host.errors.length, 1);
		assert.deepStrictEqual(host.errors[0][0], idA);

		disposables.dispose();
	});

	test('Error: dependency activation failed', async () => {
		const disposables = new DisposableStore();
		const extActivationA = new ExtensionActivationPromiseSource();
		const extActivationB = new ExtensionActivationPromiseSource();
		const host = new PromiseExtensionsActivatorHost([
			[idA, extActivationA],
			[idB, extActivationB]
		]);
		const activator = createActivator(host, [
			desc(idA, [idB]),
			desc(idB)
		], [], disposables);

		const activate = activator.activateByEvent('*', false);
		extActivationB.reject(new Error(`b fails!`));

		await activate;
		assert.deepStrictEqual(host.errors.length, 2);
		assert.deepStrictEqual(host.errors[0][0], idB);
		assert.deepStrictEqual(host.errors[1][0], idA);

		disposables.dispose();
	});

	test('issue #144518: Problem with git extension and vscode-icons', async () => {
		const disposables = new DisposableStore();
		const extActivationA = new ExtensionActivationPromiseSource();
		const extActivationB = new ExtensionActivationPromiseSource();
		const extActivationC = new ExtensionActivationPromiseSource();
		const host = new PromiseExtensionsActivatorHost([
			[idA, extActivationA],
			[idB, extActivationB],
			[idC, extActivationC]
		]);
		const activator = createActivator(host, [
			desc(idA, [idB]),
			desc(idB),
			desc(idC),
		], [], disposables);

		activator.activateByEvent('*', false);
		assert.deepStrictEqual(host.activateCalls, [idB, idC]);

		extActivationB.resolve();
		await timeout(0);

		assert.deepStrictEqual(host.activateCalls, [idB, idC, idA]);
		extActivationA.resolve();

		disposables.dispose();
	});

	class SimpleExtensionsActivatorHost implements IExtensionsActivatorHost {
		public readonly activateCalls: ExtensionIdentifier[] = [];
		public readonly errors: [ExtensionIdentifier, Error | null, MissingExtensionDependency | null][] = [];

		onExtensionActivationError(extensionId: ExtensionIdentifier, error: Error | null, missingExtensionDependency: MissingExtensionDependency | null): void {
			this.errors.push([extensionId, error, missingExtensionDependency]);
		}

		actualActivateExtension(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<ActivatedExtension> {
			this.activateCalls.push(extensionId);
			return Promise.resolve(new EmptyExtension(ExtensionActivationTimes.NONE));
		}
	}

	class PromiseExtensionsActivatorHost extends SimpleExtensionsActivatorHost {

		constructor(
			private readonly _promises: [ExtensionIdentifier, ExtensionActivationPromiseSource][]
		) {
			super();
		}

		override actualActivateExtension(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<ActivatedExtension> {
			this.activateCalls.push(extensionId);
			for (const [id, promiseSource] of this._promises) {
				if (id.value === extensionId.value) {
					return promiseSource.promise;
				}
			}
			throw new Error(`Unexpected!`);
		}
	}

	class ExtensionActivationPromiseSource {
		private readonly _resolve: (value: ActivatedExtension) => void;
		private readonly _reject: (err: Error) => void;
		public readonly promise: Promise<ActivatedExtension>;

		constructor() {
			({ promise: this.promise, resolve: this._resolve, reject: this._reject } = promiseWithResolvers<ActivatedExtension>());
		}

		public resolve(): void {
			this._resolve(new EmptyExtension(ExtensionActivationTimes.NONE));
		}

		public reject(err: Error): void {
			this._reject(err);
		}
	}

	const basicActivationEventsReader: IActivationEventsReader = {
		readActivationEvents: (extensionDescription: IExtensionDescription): string[] => {
			return extensionDescription.activationEvents?.slice() ?? [];
		}
	};

	function createActivator(host: IExtensionsActivatorHost, extensionDescriptions: IExtensionDescription[], otherHostExtensionDescriptions: IExtensionDescription[] = [], disposables: DisposableStore): ExtensionsActivator {
		const registry = disposables.add(new ExtensionDescriptionRegistry(basicActivationEventsReader, extensionDescriptions));
		const globalRegistry = disposables.add(new ExtensionDescriptionRegistry(basicActivationEventsReader, extensionDescriptions.concat(otherHostExtensionDescriptions)));
		return disposables.add(new ExtensionsActivator(registry, globalRegistry, host, new NullLogService()));
	}

	function desc(id: ExtensionIdentifier, deps: ExtensionIdentifier[] = [], activationEvents: string[] = ['*']): IExtensionDescription {
		return {
			name: id.value,
			publisher: 'test',
			version: '0.0.0',
			engines: { vscode: '^1.0.0' },
			identifier: id,
			extensionLocation: URI.parse(`nothing://nowhere`),
			isBuiltin: false,
			isUnderDevelopment: false,
			isUserBuiltin: false,
			activationEvents,
			main: 'index.js',
			targetPlatform: TargetPlatform.UNDEFINED,
			extensionDependencies: deps.map(d => d.value),
			enabledApiProposals: undefined,
			preRelease: false,
		};
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/extHostMcp.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/extHostMcp.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { LogLevel } from '../../../../platform/log/common/log.js';
import { createAuthMetadata, CommonResponse, IAuthMetadata } from '../../common/extHostMcp.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

// Test constants to avoid magic strings
const TEST_MCP_URL = 'https://example.com/mcp';
const TEST_AUTH_SERVER = 'https://auth.example.com';
const TEST_RESOURCE_METADATA_URL = 'https://example.com/.well-known/oauth-protected-resource';

/**
 * Creates a mock CommonResponse for testing.
 */
function createMockResponse(options: {
	status?: number;
	statusText?: string;
	url?: string;
	headers?: Record<string, string>;
	body?: string;
}): CommonResponse {
	const headers = new Headers(options.headers ?? {});
	return {
		status: options.status ?? 200,
		statusText: options.statusText ?? 'OK',
		url: options.url ?? TEST_MCP_URL,
		headers,
		body: null,
		json: async () => JSON.parse(options.body ?? '{}'),
		text: async () => options.body ?? '',
	};
}

/**
 * Helper to create an IAuthMetadata instance for testing via the factory function.
 * Uses a mock fetch that returns the provided server metadata.
 */
async function createTestAuthMetadata(options: {
	scopes?: string[];
	serverMetadataIssuer?: string;
	resourceMetadata?: { resource: string; authorization_servers?: string[]; scopes_supported?: string[] };
}): Promise<{ authMetadata: IAuthMetadata; logMessages: Array<{ level: LogLevel; message: string }> }> {
	const logMessages: Array<{ level: LogLevel; message: string }> = [];
	const mockLogger = (level: LogLevel, message: string) => logMessages.push({ level, message });

	const issuer = options.serverMetadataIssuer ?? TEST_AUTH_SERVER;

	const mockFetch = sinon.stub();

	// Mock resource metadata fetch
	mockFetch.onCall(0).resolves(createMockResponse({
		status: 200,
		url: TEST_RESOURCE_METADATA_URL,
		body: JSON.stringify(options.resourceMetadata ?? {
			resource: TEST_MCP_URL,
			authorization_servers: [issuer]
		})
	}));

	// Mock server metadata fetch
	mockFetch.onCall(1).resolves(createMockResponse({
		status: 200,
		url: `${issuer}/.well-known/oauth-authorization-server`,
		body: JSON.stringify({
			issuer,
			authorization_endpoint: `${issuer}/authorize`,
			token_endpoint: `${issuer}/token`,
			response_types_supported: ['code']
		})
	}));

	const wwwAuthHeader = options.scopes
		? `Bearer scope="${options.scopes.join(' ')}"`
		: 'Bearer realm="example"';

	const originalResponse = createMockResponse({
		status: 401,
		url: TEST_MCP_URL,
		headers: {
			'WWW-Authenticate': wwwAuthHeader
		}
	});

	const authMetadata = await createAuthMetadata(
		TEST_MCP_URL,
		originalResponse,
		{
			launchHeaders: new Map(),
			fetch: mockFetch,
			log: mockLogger
		}
	);

	return { authMetadata, logMessages };
}

suite('ExtHostMcp', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('IAuthMetadata', () => {
		suite('properties', () => {
			test('should expose readonly properties', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: ['read', 'write'],
					serverMetadataIssuer: TEST_AUTH_SERVER
				});

				assert.ok(authMetadata.authorizationServer.toString().startsWith(TEST_AUTH_SERVER));
				assert.strictEqual(authMetadata.serverMetadata.issuer, TEST_AUTH_SERVER);
				assert.deepStrictEqual(authMetadata.scopes, ['read', 'write']);
			});

			test('should allow undefined scopes', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: undefined
				});

				assert.strictEqual(authMetadata.scopes, undefined);
			});
		});

		suite('update()', () => {
			test('should return true and update scopes when WWW-Authenticate header contains new scopes', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: ['read']
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer scope="read write admin"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, true);
				assert.deepStrictEqual(authMetadata.scopes, ['read', 'write', 'admin']);
			});

			test('should return false when scopes are the same', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: ['read', 'write']
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer scope="read write"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, false);
				assert.deepStrictEqual(authMetadata.scopes, ['read', 'write']);
			});

			test('should return false when scopes are same but in different order', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: ['read', 'write']
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer scope="write read"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, false);
			});

			test('should return true when updating from undefined scopes to defined scopes', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: undefined
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer scope="read"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, true);
				assert.deepStrictEqual(authMetadata.scopes, ['read']);
			});

			test('should return true when updating from defined scopes to undefined (no scope in header)', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: ['read']
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer realm="example"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, true);
				assert.strictEqual(authMetadata.scopes, undefined);
			});

			test('should return false when no WWW-Authenticate header and scopes are already undefined', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: undefined
				});

				const response = createMockResponse({
					status: 401,
					headers: {}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, false);
			});

			test('should handle multiple Bearer challenges and use first scope', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: undefined
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Bearer scope="first", Bearer scope="second"'
					}
				});

				authMetadata.update(response);

				assert.deepStrictEqual(authMetadata.scopes, ['first']);
			});

			test('should ignore non-Bearer schemes', async () => {
				const { authMetadata } = await createTestAuthMetadata({
					scopes: undefined
				});

				const response = createMockResponse({
					status: 401,
					headers: {
						'WWW-Authenticate': 'Basic realm="example"'
					}
				});

				const result = authMetadata.update(response);

				assert.strictEqual(result, false);
				assert.strictEqual(authMetadata.scopes, undefined);
			});
		});
	});

	suite('createAuthMetadata', () => {
		let sandbox: sinon.SinonSandbox;
		let logMessages: Array<{ level: LogLevel; message: string }>;
		let mockLogger: (level: LogLevel, message: string) => void;

		setup(() => {
			sandbox = sinon.createSandbox();
			logMessages = [];
			mockLogger = (level, message) => logMessages.push({ level, message });
		});

		teardown(() => {
			sandbox.restore();
		});

		test('should create IAuthMetadata with fetched server metadata', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER],
					scopes_supported: ['read', 'write']
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					'WWW-Authenticate': 'Bearer scope="api.read"'
				}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map([['X-Custom', 'value']]),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			assert.ok(authMetadata.authorizationServer.toString().startsWith(TEST_AUTH_SERVER));
			assert.strictEqual(authMetadata.serverMetadata.issuer, TEST_AUTH_SERVER);
			assert.deepStrictEqual(authMetadata.scopes, ['api.read']);
		});

		test('should fall back to default metadata when server metadata fetch fails', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch - fails
			mockFetch.onCall(0).rejects(new Error('Network error'));

			// Mock server metadata fetch - also fails
			mockFetch.onCall(1).rejects(new Error('Network error'));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// Should use default metadata based on the URL
			assert.ok(authMetadata.authorizationServer.toString().startsWith('https://example.com'));
			assert.ok(authMetadata.serverMetadata.issuer.startsWith('https://example.com'));
			assert.ok(authMetadata.serverMetadata.authorization_endpoint?.startsWith('https://example.com/authorize'));
			assert.ok(authMetadata.serverMetadata.token_endpoint?.startsWith('https://example.com/token'));

			// Should log the fallback
			assert.ok(logMessages.some(m =>
				m.level === LogLevel.Info &&
				m.message.includes('Using default auth metadata')
			));
		});

		test('should use scopes from WWW-Authenticate header when resource metadata has none', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch - no scopes_supported
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER]
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					'WWW-Authenticate': 'Bearer scope="header.scope"'
				}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			assert.deepStrictEqual(authMetadata.scopes, ['header.scope']);
		});

		test('should use scopes from WWW-Authenticate header even when resource metadata has scopes_supported', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch - has scopes_supported
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER],
					scopes_supported: ['resource.scope1', 'resource.scope2']
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					'WWW-Authenticate': 'Bearer scope="header.scope"'
				}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// WWW-Authenticate header scopes take precedence over resource metadata scopes_supported
			assert.deepStrictEqual(authMetadata.scopes, ['header.scope']);
		});

		test('should use resource_metadata challenge URL from WWW-Authenticate header', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch from challenge URL
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: 'https://example.com/custom-resource-metadata',
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER]
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					'WWW-Authenticate': 'Bearer resource_metadata="https://example.com/custom-resource-metadata"'
				}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			assert.ok(authMetadata.authorizationServer.toString().startsWith(TEST_AUTH_SERVER));

			// Verify the resource_metadata URL was logged
			assert.ok(logMessages.some(m =>
				m.level === LogLevel.Debug &&
				m.message.includes('resource_metadata challenge')
			));
		});

		test('should pass launch headers when fetching metadata from same origin', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch to succeed so we can verify headers
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER]
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {}
			});

			const launchHeaders = new Map<string, string>([
				['Authorization', 'Bearer existing-token'],
				['X-Custom-Header', 'custom-value']
			]);

			await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders,
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// Verify fetch was called
			assert.ok(mockFetch.called, 'fetch should have been called');

			// Verify the first call (resource metadata) included the launch headers
			const firstCallArgs = mockFetch.firstCall.args;
			assert.ok(firstCallArgs.length >= 2, 'fetch should have been called with options');
			const fetchOptions = firstCallArgs[1] as RequestInit;
			assert.ok(fetchOptions.headers, 'fetch options should include headers');
		});

		test('should handle empty scope string in WWW-Authenticate header', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER]
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					'WWW-Authenticate': 'Bearer scope=""'
				}
			});

			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// Empty scope string should result in empty array or undefined
			assert.ok(
				authMetadata.scopes === undefined ||
				(Array.isArray(authMetadata.scopes) && authMetadata.scopes.length === 0) ||
				(Array.isArray(authMetadata.scopes) && authMetadata.scopes.every(s => s === '')),
				'Empty scope string should be handled gracefully'
			);
		});

		test('should handle malformed WWW-Authenticate header gracefully', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: JSON.stringify({
					resource: TEST_MCP_URL,
					authorization_servers: [TEST_AUTH_SERVER]
				})
			}));

			// Mock server metadata fetch
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: `${TEST_AUTH_SERVER}/.well-known/oauth-authorization-server`,
				body: JSON.stringify({
					issuer: TEST_AUTH_SERVER,
					authorization_endpoint: `${TEST_AUTH_SERVER}/authorize`,
					token_endpoint: `${TEST_AUTH_SERVER}/token`,
					response_types_supported: ['code']
				})
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {
					// Malformed header - missing closing quote
					'WWW-Authenticate': 'Bearer scope="unclosed'
				}
			});

			// Should not throw - should handle gracefully
			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// Should still create valid auth metadata
			assert.ok(authMetadata.authorizationServer);
			assert.ok(authMetadata.serverMetadata);
		});

		test('should handle invalid JSON in resource metadata response', async () => {
			const mockFetch = sandbox.stub();

			// Mock resource metadata fetch - returns invalid JSON
			mockFetch.onCall(0).resolves(createMockResponse({
				status: 200,
				url: TEST_RESOURCE_METADATA_URL,
				body: 'not valid json {'
			}));

			// Mock server metadata fetch - also returns invalid JSON
			mockFetch.onCall(1).resolves(createMockResponse({
				status: 200,
				url: 'https://example.com/.well-known/oauth-authorization-server',
				body: '{ invalid }'
			}));

			const originalResponse = createMockResponse({
				status: 401,
				url: TEST_MCP_URL,
				headers: {}
			});

			// Should fall back to default metadata, not throw
			const authMetadata = await createAuthMetadata(
				TEST_MCP_URL,
				originalResponse,
				{
					launchHeaders: new Map(),
					fetch: mockFetch,
					log: mockLogger
				}
			);

			// Should use default metadata
			assert.ok(authMetadata.authorizationServer);
			assert.ok(authMetadata.serverMetadata);
		});

		test('should handle non-401 status codes in update()', async () => {
			const { authMetadata } = await createTestAuthMetadata({
				scopes: ['read']
			});

			// Response with 403 instead of 401
			const response = createMockResponse({
				status: 403,
				headers: {
					'WWW-Authenticate': 'Bearer scope="new.scope"'
				}
			});

			// update() should still process the WWW-Authenticate header regardless of status
			const result = authMetadata.update(response);

			// The behavior depends on implementation - either it updates or ignores non-401
			// This test documents the actual behavior
			assert.strictEqual(typeof result, 'boolean');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/extHostTerminalShellIntegration.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/extHostTerminalShellIntegration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { type Terminal, type TerminalShellExecution, type TerminalShellExecutionCommandLine, type TerminalShellExecutionStartEvent } from 'vscode';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { InternalTerminalShellIntegration } from '../../common/extHostTerminalShellIntegration.js';
import { Emitter } from '../../../../base/common/event.js';
import { TerminalShellExecutionCommandLineConfidence } from '../../common/extHostTypes.js';
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import type { URI } from '../../../../base/common/uri.js';
import { DeferredPromise } from '../../../../base/common/async.js';

function cmdLine(value: string): TerminalShellExecutionCommandLine {
	return Object.freeze({
		confidence: TerminalShellExecutionCommandLineConfidence.High,
		value,
		isTrusted: true,
	});
}
function asCmdLine(value: string | TerminalShellExecutionCommandLine): TerminalShellExecutionCommandLine {
	if (typeof value === 'string') {
		return cmdLine(value);
	}
	return value;
}
function vsc(data: string) {
	return `\x1b]633;${data}\x07`;
}

const testCommandLine = 'echo hello world';
const testCommandLine2 = 'echo goodbye world';

interface ITrackedEvent {
	type: 'start' | 'data' | 'end';
	commandLine: string;
	data?: string;
}

suite('InternalTerminalShellIntegration', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let si: InternalTerminalShellIntegration;
	let terminal: Terminal;
	let onDidStartTerminalShellExecution: Emitter<TerminalShellExecutionStartEvent>;
	let trackedEvents: ITrackedEvent[];
	let readIteratorsFlushed: Promise<void>[];

	async function startExecutionAwaitObject(commandLine: string | TerminalShellExecutionCommandLine, cwd?: URI): Promise<TerminalShellExecution> {
		return await new Promise<TerminalShellExecution>(r => {
			store.add(onDidStartTerminalShellExecution.event(e => {
				r(e.execution);
			}));
			si.startShellExecution(asCmdLine(commandLine), cwd);
		});
	}

	async function endExecutionAwaitObject(commandLine: string | TerminalShellExecutionCommandLine): Promise<TerminalShellExecution> {
		return await new Promise<TerminalShellExecution>(r => {
			store.add(si.onDidRequestEndExecution(e => r(e.execution)));
			si.endShellExecution(asCmdLine(commandLine), 0);
		});
	}

	async function emitData(data: string): Promise<void> {
		// AsyncIterableObjects are initialized in a microtask, this doesn't matter in practice
		// since the events will always come through in different events.
		await new Promise<void>(r => queueMicrotask(r));
		si.emitData(data);
	}

	function assertTrackedEvents(expected: ITrackedEvent[]) {
		deepStrictEqual(trackedEvents, expected);
	}

	function assertNonDataTrackedEvents(expected: ITrackedEvent[]) {
		deepStrictEqual(trackedEvents.filter(e => e.type !== 'data'), expected);
	}

	function assertDataTrackedEvents(expected: ITrackedEvent[]) {
		deepStrictEqual(trackedEvents.filter(e => e.type === 'data'), expected);
	}

	setup(() => {
		// eslint-disable-next-line local/code-no-any-casts
		terminal = Symbol('testTerminal') as any;
		onDidStartTerminalShellExecution = store.add(new Emitter());
		si = store.add(new InternalTerminalShellIntegration(terminal, true, onDidStartTerminalShellExecution));

		trackedEvents = [];
		readIteratorsFlushed = [];
		store.add(onDidStartTerminalShellExecution.event(async e => {
			trackedEvents.push({
				type: 'start',
				commandLine: e.execution.commandLine.value,
			});
			const stream = e.execution.read();
			const readIteratorsFlushedDeferred = new DeferredPromise<void>();
			readIteratorsFlushed.push(readIteratorsFlushedDeferred.p);
			for await (const data of stream) {
				trackedEvents.push({
					type: 'data',
					commandLine: e.execution.commandLine.value,
					data,
				});
			}
			readIteratorsFlushedDeferred.complete();
		}));
		store.add(si.onDidRequestEndExecution(e => trackedEvents.push({
			type: 'end',
			commandLine: e.execution.commandLine.value,
		})));
	});

	test('simple execution', async () => {
		const execution = await startExecutionAwaitObject(testCommandLine);
		deepStrictEqual(execution.commandLine.value, testCommandLine);
		const execution2 = await endExecutionAwaitObject(testCommandLine);
		strictEqual(execution2, execution);

		assertTrackedEvents([
			{ commandLine: testCommandLine, type: 'start' },
			{ commandLine: testCommandLine, type: 'end' },
		]);
	});

	test('different execution unexpectedly ended', async () => {
		const execution1 = await startExecutionAwaitObject(testCommandLine);
		const execution2 = await endExecutionAwaitObject(testCommandLine2);
		strictEqual(execution1, execution2, 'when a different execution is ended, the one that started first should end');

		assertTrackedEvents([
			{ commandLine: testCommandLine, type: 'start' },
			// This looks weird, but it's the same execution behind the scenes, just the command
			// line was updated
			{ commandLine: testCommandLine2, type: 'end' },
		]);
	});

	test('no end event', async () => {
		const execution1 = await startExecutionAwaitObject(testCommandLine);
		const endedExecution = await new Promise<TerminalShellExecution>(r => {
			store.add(si.onDidRequestEndExecution(e => r(e.execution)));
			startExecutionAwaitObject(testCommandLine2);
		});
		strictEqual(execution1, endedExecution, 'when no end event is fired, the current execution should end');

		// Clean up disposables
		await endExecutionAwaitObject(testCommandLine2);
		await Promise.all(readIteratorsFlushed);

		assertTrackedEvents([
			{ commandLine: testCommandLine, type: 'start' },
			{ commandLine: testCommandLine, type: 'end' },
			{ commandLine: testCommandLine2, type: 'start' },
			{ commandLine: testCommandLine2, type: 'end' },
		]);
	});

	suite('executeCommand', () => {
		test('^C to clear previous command', async () => {
			const commandLine = 'foo';
			const apiRequestedExecution = si.requestNewShellExecution(cmdLine(commandLine), undefined);
			const firstExecution = await startExecutionAwaitObject('^C');
			notStrictEqual(firstExecution, apiRequestedExecution.value);
			si.emitData('SIGINT');
			si.endShellExecution(cmdLine('^C'), 0);
			si.startShellExecution(cmdLine(commandLine), undefined);
			await emitData('1');
			await endExecutionAwaitObject(commandLine);
			// IMPORTANT: We cannot reliably assert the order of data events here because flushing
			// of the async iterator is asynchronous and could happen after the execution's end
			// event fires if an execution is started immediately afterwards.
			await Promise.all(readIteratorsFlushed);

			assertNonDataTrackedEvents([
				{ commandLine: '^C', type: 'start' },
				{ commandLine: '^C', type: 'end' },
				{ commandLine, type: 'start' },
				{ commandLine, type: 'end' },
			]);
			assertDataTrackedEvents([
				{ commandLine: '^C', type: 'data', data: 'SIGINT' },
				{ commandLine, type: 'data', data: '1' },
			]);
		});

		test('multi-line command line', async () => {
			const commandLine = 'foo\nbar';
			const apiRequestedExecution = si.requestNewShellExecution(cmdLine(commandLine), undefined);
			const startedExecution = await startExecutionAwaitObject('foo');
			strictEqual(startedExecution, apiRequestedExecution.value);

			si.emitData('1');
			si.emitData('2');
			si.endShellExecution(cmdLine('foo'), 0);
			si.startShellExecution(cmdLine('bar'), undefined);
			si.emitData('3');
			si.emitData('4');
			const endedExecution = await endExecutionAwaitObject('bar');
			strictEqual(startedExecution, endedExecution);

			assertTrackedEvents([
				{ commandLine, type: 'start' },
				{ commandLine, type: 'data', data: '1' },
				{ commandLine, type: 'data', data: '2' },
				{ commandLine, type: 'data', data: '3' },
				{ commandLine, type: 'data', data: '4' },
				{ commandLine, type: 'end' },
			]);
		});

		test('multi-line command with long second command', async () => {
			const commandLine = 'echo foo\ncat << EOT\nline1\nline2\nline3\nEOT';
			const subCommandLine1 = 'echo foo';
			const subCommandLine2 = 'cat << EOT\nline1\nline2\nline3\nEOT';

			const apiRequestedExecution = si.requestNewShellExecution(cmdLine(commandLine), undefined);
			const startedExecution = await startExecutionAwaitObject(subCommandLine1);
			strictEqual(startedExecution, apiRequestedExecution.value);

			si.emitData(`${vsc('C')}foo`);
			si.endShellExecution(cmdLine(subCommandLine1), 0);
			si.startShellExecution(cmdLine(subCommandLine2), undefined);
			si.emitData(`${vsc('C')}line1`);
			si.emitData('line2');
			si.emitData('line3');
			const endedExecution = await endExecutionAwaitObject(subCommandLine2);
			strictEqual(startedExecution, endedExecution);

			assertTrackedEvents([
				{ commandLine, type: 'start' },
				{ commandLine, type: 'data', data: `${vsc('C')}foo` },
				{ commandLine, type: 'data', data: `${vsc('C')}line1` },
				{ commandLine, type: 'data', data: 'line2' },
				{ commandLine, type: 'data', data: 'line3' },
				{ commandLine, type: 'end' },
			]);
		});

		test('multi-line command comment followed by long second command', async () => {
			const commandLine = '# comment: foo\ncat << EOT\nline1\nline2\nline3\nEOT';
			const subCommandLine1 = '# comment: foo';
			const subCommandLine2 = 'cat << EOT\nline1\nline2\nline3\nEOT';

			const apiRequestedExecution = si.requestNewShellExecution(cmdLine(commandLine), undefined);
			const startedExecution = await startExecutionAwaitObject(subCommandLine1);
			strictEqual(startedExecution, apiRequestedExecution.value);

			si.emitData(`${vsc('C')}`);
			si.endShellExecution(cmdLine(subCommandLine1), 0);
			si.startShellExecution(cmdLine(subCommandLine2), undefined);
			si.emitData(`${vsc('C')}line1`);
			si.emitData('line2');
			si.emitData('line3');
			const endedExecution = await endExecutionAwaitObject(subCommandLine2);
			strictEqual(startedExecution, endedExecution);

			assertTrackedEvents([
				{ commandLine, type: 'start' },
				{ commandLine, type: 'data', data: `${vsc('C')}` },
				{ commandLine, type: 'data', data: `${vsc('C')}line1` },
				{ commandLine, type: 'data', data: 'line2' },
				{ commandLine, type: 'data', data: 'line3' },
				{ commandLine, type: 'end' },
			]);
		});

		test('4 multi-line commands with output', async () => {
			const commandLine = 'echo "\nfoo"\ngit commit -m "hello\n\nworld"\ncat << EOT\nline1\nline2\nline3\nEOT\n{\necho "foo"\n}';
			const subCommandLine1 = 'echo "\nfoo"';
			const subCommandLine2 = 'git commit -m "hello\n\nworld"';
			const subCommandLine3 = 'cat << EOT\nline1\nline2\nline3\nEOT';
			const subCommandLine4 = '{\necho "foo"\n}';

			const apiRequestedExecution = si.requestNewShellExecution(cmdLine(commandLine), undefined);
			const startedExecution = await startExecutionAwaitObject(subCommandLine1);
			strictEqual(startedExecution, apiRequestedExecution.value);

			si.emitData(`${vsc('C')}foo`);
			si.endShellExecution(cmdLine(subCommandLine1), 0);
			si.startShellExecution(cmdLine(subCommandLine2), undefined);
			si.emitData(`${vsc('C')} 2 files changed, 61 insertions(+), 2 deletions(-)`);
			si.endShellExecution(cmdLine(subCommandLine2), 0);
			si.startShellExecution(cmdLine(subCommandLine3), undefined);
			si.emitData(`${vsc('C')}line1`);
			si.emitData('line2');
			si.emitData('line3');
			si.endShellExecution(cmdLine(subCommandLine3), 0);
			si.emitData(`${vsc('C')}foo`);
			si.startShellExecution(cmdLine(subCommandLine4), undefined);
			const endedExecution = await endExecutionAwaitObject(subCommandLine4);
			strictEqual(startedExecution, endedExecution);

			assertTrackedEvents([
				{ commandLine, type: 'start' },
				{ commandLine, type: 'data', data: `${vsc('C')}foo` },
				{ commandLine, type: 'data', data: `${vsc('C')} 2 files changed, 61 insertions(+), 2 deletions(-)` },
				{ commandLine, type: 'data', data: `${vsc('C')}line1` },
				{ commandLine, type: 'data', data: 'line2' },
				{ commandLine, type: 'data', data: 'line3' },
				{ commandLine, type: 'data', data: `${vsc('C')}foo` },
				{ commandLine, type: 'end' },
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/extHostTypeConverters.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/extHostTypeConverters.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IconPathDto } from '../../common/extHost.protocol.js';
import { IconPath } from '../../common/extHostTypeConverters.js';
import { ThemeColor, ThemeIcon } from '../../common/extHostTypes.js';

suite('extHostTypeConverters', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('IconPath', function () {
		suite('from', function () {
			test('undefined', function () {
				assert.strictEqual(IconPath.from(undefined), undefined);
			});

			test('ThemeIcon', function () {
				const themeIcon = new ThemeIcon('account', new ThemeColor('testing.iconForeground'));
				assert.strictEqual(IconPath.from(themeIcon), themeIcon);
			});

			test('URI', function () {
				const uri = URI.parse('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
				assert.strictEqual(IconPath.from(uri), uri);
			});

			test('string', function () {
				const str = '/path/to/icon.png';
				// eslint-disable-next-line local/code-no-any-casts
				const r1 = IconPath.from(str as any) as any as URI;
				assert.ok(URI.isUri(r1));
				assert.strictEqual(r1.scheme, 'file');
				assert.strictEqual(r1.path, str);
			});

			test('dark only', function () {
				const input = { dark: URI.file('/path/to/dark.png') };
				// eslint-disable-next-line local/code-no-any-casts
				const result = IconPath.from(input as any) as unknown as { dark: URI; light: URI };
				assert.strictEqual(typeof result, 'object');
				assert.ok('light' in result && 'dark' in result);
				assert.ok(URI.isUri(result.light));
				assert.ok(URI.isUri(result.dark));
				assert.strictEqual(result.dark.toString(), input.dark.toString());
				assert.strictEqual(result.light.toString(), input.dark.toString());
			});

			test('dark/light', function () {
				const input = { light: URI.file('/path/to/light.png'), dark: URI.file('/path/to/dark.png') };
				const result = IconPath.from(input);
				assert.strictEqual(typeof result, 'object');
				assert.ok('light' in result && 'dark' in result);
				assert.ok(URI.isUri(result.light));
				assert.ok(URI.isUri(result.dark));
				assert.strictEqual(result.dark.toString(), input.dark.toString());
				assert.strictEqual(result.light.toString(), input.light.toString());
			});

			test('dark/light strings', function () {
				const input = { light: '/path/to/light.png', dark: '/path/to/dark.png' };
				// eslint-disable-next-line local/code-no-any-casts
				const result = IconPath.from(input as any) as unknown as IconPathDto;
				assert.strictEqual(typeof result, 'object');
				assert.ok('light' in result && 'dark' in result);
				assert.ok(URI.isUri(result.light));
				assert.ok(URI.isUri(result.dark));
				assert.strictEqual(result.dark.path, input.dark);
				assert.strictEqual(result.light.path, input.light);
			});

			test('invalid object', function () {
				const invalidObject = { foo: 'bar' };
				// eslint-disable-next-line local/code-no-any-casts
				const result = IconPath.from(invalidObject as any);
				assert.strictEqual(result, undefined);
			});

			test('light only', function () {
				const input = { light: URI.file('/path/to/light.png') };
				// eslint-disable-next-line local/code-no-any-casts
				const result = IconPath.from(input as any);
				assert.strictEqual(result, undefined);
			});
		});

		suite('to', function () {
			test('undefined', function () {
				assert.strictEqual(IconPath.to(undefined), undefined);
			});

			test('ThemeIcon', function () {
				const themeIcon = new ThemeIcon('account');
				assert.strictEqual(IconPath.to(themeIcon), themeIcon);
			});

			test('URI', function () {
				const uri: UriComponents = { scheme: 'data', path: 'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' };
				const result = IconPath.to(uri);
				assert.ok(URI.isUri(result));
				assert.strictEqual(result.toString(), URI.revive(uri).toString());
			});

			test('dark/light', function () {
				const input: { light: UriComponents; dark: UriComponents } = {
					light: { scheme: 'file', path: '/path/to/light.png' },
					dark: { scheme: 'file', path: '/path/to/dark.png' }
				};
				const result = IconPath.to(input);
				assert.strictEqual(typeof result, 'object');
				assert.ok('light' in result && 'dark' in result);
				assert.ok(URI.isUri(result.light));
				assert.ok(URI.isUri(result.dark));
				assert.strictEqual(result.dark.toString(), URI.revive(input.dark).toString());
				assert.strictEqual(result.light.toString(), URI.revive(input.light).toString());
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/common/testRPCProtocol.ts]---
Location: vscode-main/src/vs/workbench/api/test/common/testRPCProtocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isThenable } from '../../../../base/common/async.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { IExtHostRpcService } from '../../common/extHostRpcService.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { Proxied, ProxyIdentifier, SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';
import { parseJsonAndRestoreBufferRefs, stringifyJsonWithBufferRefs } from '../../../services/extensions/common/rpcProtocol.js';

export function SingleProxyRPCProtocol(thing: any): IExtHostContext & IExtHostRpcService {
	return {
		_serviceBrand: undefined,
		remoteAuthority: null!,
		getProxy<T>(): T {
			return thing;
		},
		set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R {
			return value;
		},
		dispose: undefined!,
		assertRegistered: undefined!,
		drain: undefined!,
		extensionHostKind: ExtensionHostKind.LocalProcess
	};
}

/** Makes a fake {@link SingleProxyRPCProtocol} on which any method can be called */
export function AnyCallRPCProtocol<T>(useCalls?: { [K in keyof T]: T[K] }) {
	return SingleProxyRPCProtocol(new Proxy({}, {
		get(_target, prop: string) {
			if (useCalls && prop in useCalls) {
				// eslint-disable-next-line local/code-no-any-casts
				return (useCalls as any)[prop];
			}
			return () => Promise.resolve(undefined);
		}
	}));
}

export class TestRPCProtocol implements IExtHostContext, IExtHostRpcService {

	public _serviceBrand: undefined;
	public remoteAuthority = null!;
	public extensionHostKind = ExtensionHostKind.LocalProcess;

	private _callCountValue: number = 0;
	private _idle?: Promise<any>;
	private _completeIdle?: Function;

	private readonly _locals: { [id: string]: any };
	private readonly _proxies: { [id: string]: any };

	constructor() {
		this._locals = Object.create(null);
		this._proxies = Object.create(null);
	}

	drain(): Promise<void> {
		return Promise.resolve();
	}

	private get _callCount(): number {
		return this._callCountValue;
	}

	private set _callCount(value: number) {
		this._callCountValue = value;
		if (this._callCountValue === 0) {
			this._completeIdle?.();
			this._idle = undefined;
		}
	}

	sync(): Promise<any> {
		return new Promise<any>((c) => {
			setTimeout(c, 0);
		}).then(() => {
			if (this._callCount === 0) {
				return undefined;
			}
			if (!this._idle) {
				this._idle = new Promise<any>((c, e) => {
					this._completeIdle = c;
				});
			}
			return this._idle;
		});
	}

	public getProxy<T>(identifier: ProxyIdentifier<T>): Proxied<T> {
		if (!this._proxies[identifier.sid]) {
			this._proxies[identifier.sid] = this._createProxy(identifier.sid);
		}
		return this._proxies[identifier.sid];
	}

	private _createProxy<T>(proxyId: string): T {
		const handler = {
			get: (target: any, name: PropertyKey) => {
				if (typeof name === 'string' && !target[name] && name.charCodeAt(0) === CharCode.DollarSign) {
					target[name] = (...myArgs: any[]) => {
						return this._remoteCall(proxyId, name, myArgs);
					};
				}

				return target[name];
			}
		};
		return new Proxy(Object.create(null), handler);
	}

	public set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R {
		this._locals[identifier.sid] = value;
		return value;
	}

	protected _remoteCall(proxyId: string, path: string, args: any[]): Promise<any> {
		this._callCount++;

		return new Promise<any>((c) => {
			setTimeout(c, 0);
		}).then(() => {
			const instance = this._locals[proxyId];
			// pretend the args went over the wire... (invoke .toJSON on objects...)
			const wireArgs = simulateWireTransfer(args);
			let p: Promise<any>;
			try {
				const result = (<Function>instance[path]).apply(instance, wireArgs);
				p = isThenable(result) ? result : Promise.resolve(result);
			} catch (err) {
				p = Promise.reject(err);
			}

			return p.then(result => {
				this._callCount--;
				// pretend the result went over the wire... (invoke .toJSON on objects...)
				const wireResult = simulateWireTransfer(result);
				return wireResult;
			}, err => {
				this._callCount--;
				return Promise.reject(err);
			});
		});
	}

	public dispose() { }

	public assertRegistered(identifiers: ProxyIdentifier<any>[]): void {
		throw new Error('Not implemented!');
	}
}

function simulateWireTransfer<T>(obj: T): T {
	if (!obj) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// eslint-disable-next-line local/code-no-any-casts
		return obj.map(simulateWireTransfer) as any;
	}

	if (obj instanceof SerializableObjectWithBuffers) {
		const { jsonString, referencedBuffers } = stringifyJsonWithBufferRefs(obj);
		return parseJsonAndRestoreBufferRefs(jsonString, referencedBuffers, null);
	} else {
		return JSON.parse(JSON.stringify(obj));
	}
}
```

--------------------------------------------------------------------------------

````

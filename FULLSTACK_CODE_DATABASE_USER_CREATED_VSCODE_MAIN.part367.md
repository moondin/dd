---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 367
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 367 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatSessionsService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatSessionsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ChatSessionsService } from '../../browser/chatSessions.contribution.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite.skip('ChatSessionsService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let chatSessionsService: ChatSessionsService;

	setup(() => {
		const instantiationService = store.add(workbenchInstantiationService(undefined, store));
		chatSessionsService = store.add(instantiationService.createInstance(ChatSessionsService));
	});

	suite('extractFileNameFromLink', () => {

		function callExtractFileNameFromLink(filePath: string): string {
			// Access the private method using bracket notation with proper typing
			type ServiceWithPrivateMethod = Record<'extractFileNameFromLink', (filePath: string) => string>;
			return (chatSessionsService as unknown as ServiceWithPrivateMethod)['extractFileNameFromLink'](filePath);
		}

		test('should extract filename from markdown link with link text', () => {
			const input = 'Read [README](file:///path/to/README.md) for more info';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Read README for more info');
		});

		test('should extract filename from markdown link without link text', () => {
			const input = 'Read [](file:///index.js) for instructions';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Read index.js for instructions');
		});

		test('should extract filename from markdown link with empty link text', () => {
			const input = 'Check [  ](file:///config.json) settings';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Check config.json settings');
		});

		test('should handle multiple file links in same string', () => {
			const input = 'See [main](file:///main.js) and [utils](file:///utils/helper.ts)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'See main and utils');
		});

		test('should handle file path without extension', () => {
			const input = 'Open [](file:///src/components/Button)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Open Button');
		});

		test('should handle deep file paths', () => {
			const input = 'Edit [](file:///very/deep/nested/path/to/file.tsx)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Edit file.tsx');
		});

		test('should handle file path that is just a filename', () => {
			const input = 'View [script](file:///script.py)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'View script');
		});

		test('should handle link text with special characters', () => {
			const input = 'See [App.js (main)](file:///App.js)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'See App.js (main)');
		});

		test('should return original string if no file links present', () => {
			const input = 'This is just regular text with no links';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'This is just regular text with no links');
		});

		test('should handle mixed content with file links and regular text', () => {
			const input = 'Check [config](file:///config.yml) and visit https://example.com';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Check config and visit https://example.com');
		});

		test('should handle file path with query parameters or fragments', () => {
			const input = 'Open [](file:///index.html?param=value#section)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Open index.html?param=value#section');
		});

		test('should handle Windows-style paths', () => {
			const input = 'Edit [](file:///C:/Users/user/Documents/file.txt)';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, 'Edit file.txt');
		});

		test('should preserve whitespace around replacements', () => {
			const input = '   Check [](file:///test.js)   ';
			const result = callExtractFileNameFromLink(input);
			assert.strictEqual(result, '   Check test.js   ');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatTodoListWidget.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatTodoListWidget.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ChatTodoListWidget } from '../../browser/chatContentParts/chatTodoListWidget.js';
import { IChatTodo, IChatTodoListService } from '../../common/chatTodoListService.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { URI } from '../../../../../base/common/uri.js';

const testSessionUri = URI.parse('chat-session://test/session1');

suite('ChatTodoListWidget Accessibility', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let widget: ChatTodoListWidget;

	const sampleTodos: IChatTodo[] = [
		{ id: 1, title: 'First task', status: 'not-started' },
		{ id: 2, title: 'Second task', status: 'in-progress', description: 'This is a task description' },
		{ id: 3, title: 'Third task', status: 'completed' }
	];

	setup(() => {
		// Mock the todo list service
		const mockTodoListService: IChatTodoListService = {
			_serviceBrand: undefined,
			onDidUpdateTodos: Event.None,
			getTodos: (sessionResource: URI) => sampleTodos,
			setTodos: (sessionResource: URI, todos: IChatTodo[]) => { }
		};

		// Mock the configuration service
		const mockConfigurationService = new TestConfigurationService({ 'chat.todoListTool.descriptionField': true });

		const instantiationService = workbenchInstantiationService(undefined, store);
		instantiationService.stub(IChatTodoListService, mockTodoListService);
		instantiationService.stub(IConfigurationService, mockConfigurationService);
		widget = store.add(instantiationService.createInstance(ChatTodoListWidget));
		mainWindow.document.body.appendChild(widget.domNode);
	});

	teardown(() => {
		if (widget.domNode.parentNode) {
			widget.domNode.parentNode.removeChild(widget.domNode);
		}
	});

	test('creates proper semantic list structure', () => {
		widget.render(testSessionUri);

		const todoListContainer = widget.domNode.querySelector('.todo-list-container');
		assert.ok(todoListContainer, 'Should have todo list container');
		assert.strictEqual(todoListContainer?.getAttribute('aria-labelledby'), 'todo-list-title');
		assert.strictEqual(todoListContainer?.getAttribute('role'), 'list');

		const titleElement = widget.domNode.querySelector('#todo-list-title');
		assert.ok(titleElement, 'Should have title element with ID todo-list-title');
		// When collapsed, title shows progress and current task without "Todos" prefix
		assert.ok(titleElement?.textContent, 'Title should have content');

		// The todo list container itself acts as the list (no nested ul element)
		const todoItems = todoListContainer?.querySelectorAll('li.todo-item');
		assert.ok(todoItems && todoItems.length > 0, 'Should have todo items in the list container');
	});

	test('todo items have proper accessibility attributes', () => {
		widget.render(testSessionUri);

		const todoItems = widget.domNode.querySelectorAll('.todo-item');
		assert.strictEqual(todoItems.length, 3, 'Should have 3 todo items');

		// Check first item (not-started)
		const firstItem = todoItems[0] as HTMLElement;
		assert.strictEqual(firstItem.getAttribute('role'), 'listitem');
		assert.ok(firstItem.getAttribute('aria-label')?.includes('First task'));
		assert.ok(firstItem.getAttribute('aria-label')?.includes('not started'));

		// Check second item (in-progress with description)
		const secondItem = todoItems[1] as HTMLElement;
		assert.ok(secondItem.getAttribute('aria-label')?.includes('Second task'));
		assert.ok(secondItem.getAttribute('aria-label')?.includes('in progress'));
		assert.ok(secondItem.getAttribute('aria-label')?.includes('This is a task description'));

		// Check third item (completed)
		const thirdItem = todoItems[2] as HTMLElement;
		assert.ok(thirdItem.getAttribute('aria-label')?.includes('Third task'));
		assert.ok(thirdItem.getAttribute('aria-label')?.includes('completed'));
	});

	test('status icons are hidden from screen readers', () => {
		widget.render(testSessionUri);

		const statusIcons = widget.domNode.querySelectorAll('.todo-status-icon');
		statusIcons.forEach(icon => {
			assert.strictEqual(icon.getAttribute('aria-hidden'), 'true', 'Status icons should be hidden from screen readers');
		});
	});

	test('expand button has proper accessibility attributes', () => {
		widget.render(testSessionUri);

		// The expandoButton is now a Monaco Button, so we need to check its element
		const expandoContainer = widget.domNode.querySelector('.todo-list-expand');
		assert.ok(expandoContainer, 'Should have expando container');

		const expandoButton = expandoContainer?.querySelector('.monaco-button');
		assert.ok(expandoButton, 'Should have Monaco button');
		assert.strictEqual(expandoButton?.getAttribute('aria-expanded'), 'false'); // Should be collapsed due to in-progress task
		assert.strictEqual(expandoButton?.getAttribute('aria-controls'), 'todo-list-container');

		// The title element should have progress information
		const titleElement = expandoButton?.querySelector('.todo-list-title');
		assert.ok(titleElement, 'Should have title element');
		const titleText = titleElement?.textContent;
		// When collapsed, title shows progress and current task: " (2/3) - Second task"
		// Progress is 2/3 because: 1 completed + 1 in-progress (current) = task 2 of 3
		assert.ok(titleText?.includes('(2/3)'), `Title should show progress format, but got: "${titleText}"`);
		assert.ok(titleText?.includes('Second task'), `Title should show current task when collapsed, but got: "${titleText}"`);
	});

	test('todo items have complete aria-label with status information', () => {
		widget.render(testSessionUri);

		const todoItems = widget.domNode.querySelectorAll('.todo-item');
		assert.strictEqual(todoItems.length, 3, 'Should have 3 todo items');

		// Check first item (not-started) - aria-label should include title and status
		const firstItem = todoItems[0] as HTMLElement;
		const firstAriaLabel = firstItem.getAttribute('aria-label');
		assert.ok(firstAriaLabel?.includes('First task'), 'First item aria-label should include title');
		assert.ok(firstAriaLabel?.includes('not started'), 'First item aria-label should include status');

		// Check second item (in-progress with description) - aria-label should include title, status, and description
		const secondItem = todoItems[1] as HTMLElement;
		const secondAriaLabel = secondItem.getAttribute('aria-label');
		assert.ok(secondAriaLabel?.includes('Second task'), 'Second item aria-label should include title');
		assert.ok(secondAriaLabel?.includes('in progress'), 'Second item aria-label should include status');
		assert.ok(secondAriaLabel?.includes('This is a task description'), 'Second item aria-label should include description');

		// Check third item (completed) - aria-label should include title and status
		const thirdItem = todoItems[2] as HTMLElement;
		const thirdAriaLabel = thirdItem.getAttribute('aria-label');
		assert.ok(thirdAriaLabel?.includes('Third task'), 'Third item aria-label should include title');
		assert.ok(thirdAriaLabel?.includes('completed'), 'Third item aria-label should include status');
	});

	test('widget displays properly when no todos exist', () => {
		// Create a new mock service with empty todos
		const emptyTodoListService: IChatTodoListService = {
			_serviceBrand: undefined,
			onDidUpdateTodos: Event.None,
			getTodos: (sessionResource: URI) => [],
			setTodos: (sessionResource: URI, todos: IChatTodo[]) => { }
		};

		const emptyConfigurationService = new TestConfigurationService({ 'chat.todoListTool.descriptionField': true });

		const instantiationService = workbenchInstantiationService(undefined, store);
		instantiationService.stub(IChatTodoListService, emptyTodoListService);
		instantiationService.stub(IConfigurationService, emptyConfigurationService);
		const emptyWidget = store.add(instantiationService.createInstance(ChatTodoListWidget));
		mainWindow.document.body.appendChild(emptyWidget.domNode);

		emptyWidget.render(testSessionUri);

		// Widget should be hidden when no todos
		assert.strictEqual(emptyWidget.domNode.style.display, 'none', 'Widget should be hidden when no todos');
	});

	test('clear button has proper accessibility', () => {
		widget.render(testSessionUri);

		const clearButton = widget.domNode.querySelector('.todo-clear-button-container .monaco-button');
		assert.ok(clearButton, 'Should have clear button');
		assert.strictEqual(clearButton?.getAttribute('tabindex'), '0', 'Clear button should be focusable');
	});

	test('title element displays progress correctly and is accessible', () => {
		widget.render(testSessionUri);

		const titleElement = widget.domNode.querySelector('#todo-list-title');
		assert.ok(titleElement, 'Should have title element with ID');

		// Title should show progress format: " (2/3)" since one todo is completed and one is in-progress
		// When collapsed, it also shows the current task: " (2/3) - Second task"
		// Progress is 2/3 because: 1 completed + 1 in-progress (current) = task 2 of 3
		const titleText = titleElement?.textContent;
		assert.ok(titleText?.includes('(2/3)'), `Title should show progress format, but got: "${titleText}"`);
		assert.ok(titleText?.includes('Second task'), `Title should show current task when collapsed, but got: "${titleText}"`);

		// Verify aria-labelledby connection works
		const todoListContainer = widget.domNode.querySelector('.todo-list-container');
		assert.strictEqual(todoListContainer?.getAttribute('aria-labelledby'), 'todo-list-title');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/languageModelToolsConfirmationService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/languageModelToolsConfirmationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IStorageService, InMemoryStorageService } from '../../../../../platform/storage/common/storage.js';
import { LanguageModelToolsConfirmationService } from '../../browser/languageModelToolsConfirmationService.js';
import { ToolConfirmKind } from '../../common/chatService.js';
import { ILanguageModelToolConfirmationActions, ILanguageModelToolConfirmationContribution, ILanguageModelToolConfirmationRef } from '../../common/languageModelToolsConfirmationService.js';
import { ToolDataSource } from '../../common/languageModelToolsService.js';

suite('LanguageModelToolsConfirmationService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let service: LanguageModelToolsConfirmationService;
	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = store.add(new TestInstantiationService());
		instantiationService.stub(IStorageService, store.add(new InMemoryStorageService()));

		service = store.add(instantiationService.createInstance(LanguageModelToolsConfirmationService));
	});

	function createToolRef(toolId: string, source: ToolDataSource = ToolDataSource.Internal, parameters: unknown = {}): ILanguageModelToolConfirmationRef {
		return { toolId, source, parameters };
	}

	function createMcpToolRef(toolId: string, definitionId: string, serverLabel: string, parameters: unknown = {}): ILanguageModelToolConfirmationRef {
		return {
			toolId,
			source: {
				type: 'mcp',
				label: serverLabel,
				serverLabel,
				instructions: undefined,
				collectionId: 'testCollection',
				definitionId
			},
			parameters
		};
	}

	test('getPreConfirmAction returns undefined by default', () => {
		const ref = createToolRef('testTool');
		const result = service.getPreConfirmAction(ref);
		assert.strictEqual(result, undefined);
	});

	test('getPostConfirmAction returns undefined by default', () => {
		const ref = createToolRef('testTool');
		const result = service.getPostConfirmAction(ref);
		assert.strictEqual(result, undefined);
	});

	test('getPreConfirmActions returns default tool-level actions', () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);

		assert.ok(actions.length >= 3);
		assert.ok(actions.some(a => a.label.includes('Session')));
		assert.ok(actions.some(a => a.label.includes('Workspace')));
		assert.ok(actions.some(a => a.label.includes('Always Allow')));
	});

	test('getPostConfirmActions returns default tool-level actions', () => {
		const ref = createToolRef('testTool');
		const actions = service.getPostConfirmActions(ref);

		assert.ok(actions.length >= 3);
		assert.ok(actions.some(a => a.label.includes('Session')));
		assert.ok(actions.some(a => a.label.includes('Workspace')));
		assert.ok(actions.some(a => a.label.includes('Always Allow')));
	});

	test('getPreConfirmActions includes server-level actions for MCP tools', () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPreConfirmActions(ref);

		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Session')));
		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Workspace')));
		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Always Allow')));
	});

	test('getPostConfirmActions includes server-level actions for MCP tools', () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPostConfirmActions(ref);

		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Session')));
		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Workspace')));
		assert.ok(actions.some(a => a.label.includes('Test Server') && a.label.includes('Always Allow')));
	});

	test('pre-execution session confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);
		const sessionAction = actions.find(a => a.label.includes('Session') && !a.label.includes('Server'));

		assert.ok(sessionAction);
		await sessionAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
	});

	test('pre-execution workspace confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);
		const workspaceAction = actions.find(a => a.label.includes('Workspace') && !a.label.includes('Server'));

		assert.ok(workspaceAction);
		await workspaceAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('pre-execution profile confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);
		const profileAction = actions.find(a => a.label.includes('Always Allow') && !a.label.includes('Server'));

		assert.ok(profileAction);
		await profileAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'profile' });
	});

	test('post-execution session confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPostConfirmActions(ref);
		const sessionAction = actions.find(a => a.label.includes('Session') && !a.label.includes('Server'));

		assert.ok(sessionAction);
		await sessionAction.select();

		const result = service.getPostConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
	});

	test('post-execution workspace confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPostConfirmActions(ref);
		const workspaceAction = actions.find(a => a.label.includes('Workspace') && !a.label.includes('Server'));

		assert.ok(workspaceAction);
		await workspaceAction.select();

		const result = service.getPostConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('post-execution profile confirmation works', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPostConfirmActions(ref);
		const profileAction = actions.find(a => a.label.includes('Always Allow') && !a.label.includes('Server'));

		assert.ok(profileAction);
		await profileAction.select();

		const result = service.getPostConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'profile' });
	});

	test('MCP server-level pre-execution session confirmation works', async () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPreConfirmActions(ref);
		const serverAction = actions.find(a => a.label.includes('Test Server') && a.label.includes('Session'));

		assert.ok(serverAction);
		await serverAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
	});

	test('MCP server-level pre-execution workspace confirmation works', async () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPreConfirmActions(ref);
		const serverAction = actions.find(a => a.label.includes('Test Server') && a.label.includes('Workspace'));

		assert.ok(serverAction);
		await serverAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('MCP server-level pre-execution profile confirmation works', async () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPreConfirmActions(ref);
		const serverAction = actions.find(a => a.label.includes('Test Server') && a.label.includes('Always Allow'));

		assert.ok(serverAction);
		await serverAction.select();

		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'profile' });
	});

	test('MCP server-level post-execution session confirmation works', async () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');
		const actions = service.getPostConfirmActions(ref);
		const serverAction = actions.find(a => a.label.includes('Test Server') && a.label.includes('Session'));

		assert.ok(serverAction);
		await serverAction.select();

		const result = service.getPostConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
	});

	test('MCP server-level confirmation applies to all tools from that server', async () => {
		const ref1 = createMcpToolRef('mcpTool1', 'serverId', 'Test Server');
		const ref2 = createMcpToolRef('mcpTool2', 'serverId', 'Test Server');

		const actions = service.getPreConfirmActions(ref1);
		const serverAction = actions.find(a => a.label.includes('Test Server') && a.label.includes('Session'));

		assert.ok(serverAction);
		await serverAction.select();

		const result1 = service.getPreConfirmAction(ref1);
		const result2 = service.getPreConfirmAction(ref2);

		assert.deepStrictEqual(result1, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
		assert.deepStrictEqual(result2, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
	});

	test('tool-level confirmation takes precedence over server-level confirmation', async () => {
		const ref = createMcpToolRef('mcpTool', 'serverId', 'Test Server');

		// Set server-level confirmation
		const serverActions = service.getPreConfirmActions(ref);
		const serverAction = serverActions.find(a => a.label.includes('Test Server') && a.label.includes('Session'));
		assert.ok(serverAction);
		await serverAction.select();

		// Set tool-level confirmation to a different scope
		const toolActions = service.getPreConfirmActions(ref);
		const toolAction = toolActions.find(a => !a.label.includes('Test Server') && a.label.includes('Workspace'));
		assert.ok(toolAction);
		await toolAction.select();

		// Tool-level should take precedence
		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('registerConfirmationContribution allows custom pre-confirm actions', () => {
		const contribution: ILanguageModelToolConfirmationContribution = {
			getPreConfirmAction: (ref) => {
				return { type: ToolConfirmKind.UserAction };
			}
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		const ref = createToolRef('customTool');
		const result = service.getPreConfirmAction(ref);

		assert.ok(result);
		assert.strictEqual(result.type, ToolConfirmKind.UserAction);
	});

	test('registerConfirmationContribution allows custom post-confirm actions', () => {
		const contribution: ILanguageModelToolConfirmationContribution = {
			getPostConfirmAction: (ref) => {
				return { type: ToolConfirmKind.UserAction };
			}
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		const ref = createToolRef('customTool');
		const result = service.getPostConfirmAction(ref);

		assert.ok(result);
		assert.strictEqual(result.type, ToolConfirmKind.UserAction);
	});

	test('registerConfirmationContribution allows custom pre-confirm action list', () => {
		const customActions: ILanguageModelToolConfirmationActions[] = [
			{
				label: 'Custom Action 1',
				select: async () => true
			},
			{
				label: 'Custom Action 2',
				select: async () => true
			}
		];

		const contribution: ILanguageModelToolConfirmationContribution = {
			getPreConfirmActions: (ref) => customActions
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		const ref = createToolRef('customTool');
		const actions = service.getPreConfirmActions(ref);

		// Should include both custom actions and default actions
		assert.ok(actions.some(a => a.label === 'Custom Action 1'));
		assert.ok(actions.some(a => a.label === 'Custom Action 2'));
		assert.ok(actions.some(a => a.label.includes('Session')));
	});

	test('registerConfirmationContribution with canUseDefaultApprovals=false only shows custom actions', () => {
		const customActions: ILanguageModelToolConfirmationActions[] = [
			{
				label: 'Custom Action Only',
				select: async () => true
			}
		];

		const contribution: ILanguageModelToolConfirmationContribution = {
			canUseDefaultApprovals: false,
			getPreConfirmActions: (ref) => customActions
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		const ref = createToolRef('customTool');
		const actions = service.getPreConfirmActions(ref);

		assert.strictEqual(actions.length, 1);
		assert.strictEqual(actions[0].label, 'Custom Action Only');
	});

	test('contribution getPreConfirmAction takes precedence over default stores', () => {
		const contribution: ILanguageModelToolConfirmationContribution = {
			getPreConfirmAction: (ref) => {
				return { type: ToolConfirmKind.UserAction };
			}
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		// Contribution should take precedence even without setting default
		const ref = createToolRef('customTool');
		const result = service.getPreConfirmAction(ref);
		assert.ok(result);
		assert.strictEqual(result.type, ToolConfirmKind.UserAction);
	});

	test('contribution with canUseDefaultApprovals=false prevents default store checks', () => {
		const contribution: ILanguageModelToolConfirmationContribution = {
			canUseDefaultApprovals: false,
			getPreConfirmAction: () => undefined
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		const ref = createToolRef('customTool');
		const actions = service.getPreConfirmActions(ref);

		// Should have no actions since canUseDefaultApprovals is false
		assert.strictEqual(actions.length, 0);
	});

	test('resetToolAutoConfirmation clears all confirmations', async () => {
		const ref1 = createToolRef('tool1');
		const ref2 = createMcpToolRef('mcpTool', 'serverId', 'Test Server');

		// Set some confirmations
		const actions1 = service.getPreConfirmActions(ref1);
		const sessionAction1 = actions1.find(a => a.label.includes('Session') && !a.label.includes('Server'));
		assert.ok(sessionAction1);
		await sessionAction1.select();

		const actions2 = service.getPreConfirmActions(ref2);
		const serverAction = actions2.find(a => a.label.includes('Test Server') && a.label.includes('Session'));
		assert.ok(serverAction);
		await serverAction.select();

		// Verify they're set
		assert.ok(service.getPreConfirmAction(ref1));
		assert.ok(service.getPreConfirmAction(ref2));

		// Reset
		service.resetToolAutoConfirmation();

		// Verify they're cleared
		assert.strictEqual(service.getPreConfirmAction(ref1), undefined);
		assert.strictEqual(service.getPreConfirmAction(ref2), undefined);
	});

	test('resetToolAutoConfirmation calls contribution reset', () => {
		let resetCalled = false;
		const contribution: ILanguageModelToolConfirmationContribution = {
			reset: () => {
				resetCalled = true;
			}
		};

		store.add(service.registerConfirmationContribution('customTool', contribution));

		service.resetToolAutoConfirmation();

		assert.strictEqual(resetCalled, true);
	});

	test('disposing contribution registration removes it', () => {
		const contribution: ILanguageModelToolConfirmationContribution = {
			getPreConfirmAction: (ref) => {
				return { type: ToolConfirmKind.UserAction };
			}
		};

		const disposable = service.registerConfirmationContribution('customTool', contribution);

		const ref = createToolRef('customTool');
		let result = service.getPreConfirmAction(ref);
		assert.ok(result);
		assert.strictEqual(result.type, ToolConfirmKind.UserAction);

		disposable.dispose();

		result = service.getPreConfirmAction(ref);
		assert.strictEqual(result, undefined);
	});

	test('different tools have independent confirmations', async () => {
		const ref1 = createToolRef('tool1');
		const ref2 = createToolRef('tool2');

		// Set session for tool1
		const actions1 = service.getPreConfirmActions(ref1);
		const sessionAction = actions1.find(a => a.label.includes('Session') && !a.label.includes('Server'));
		assert.ok(sessionAction);
		await sessionAction.select();

		// Set workspace for tool2
		const actions2 = service.getPreConfirmActions(ref2);
		const workspaceAction = actions2.find(a => a.label.includes('Workspace') && !a.label.includes('Server'));
		assert.ok(workspaceAction);
		await workspaceAction.select();

		// Verify they're independent
		const result1 = service.getPreConfirmAction(ref1);
		const result2 = service.getPreConfirmAction(ref2);

		assert.deepStrictEqual(result1, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
		assert.deepStrictEqual(result2, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('pre and post execution confirmations are independent', async () => {
		const ref = createToolRef('testTool');

		// Set pre-execution to session
		const preActions = service.getPreConfirmActions(ref);
		const preSessionAction = preActions.find(a => a.label.includes('Session') && !a.label.includes('Server'));
		assert.ok(preSessionAction);
		await preSessionAction.select();

		// Set post-execution to workspace
		const postActions = service.getPostConfirmActions(ref);
		const postWorkspaceAction = postActions.find(a => a.label.includes('Workspace') && !a.label.includes('Server'));
		assert.ok(postWorkspaceAction);
		await postWorkspaceAction.select();

		// Verify they're independent
		const preResult = service.getPreConfirmAction(ref);
		const postResult = service.getPostConfirmAction(ref);

		assert.deepStrictEqual(preResult, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
		assert.deepStrictEqual(postResult, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('different MCP servers have independent confirmations', async () => {
		const ref1 = createMcpToolRef('tool1', 'server1', 'Server 1');
		const ref2 = createMcpToolRef('tool2', 'server2', 'Server 2');

		// Set server1 to session
		const actions1 = service.getPreConfirmActions(ref1);
		const serverAction1 = actions1.find(a => a.label.includes('Server 1') && a.label.includes('Session'));
		assert.ok(serverAction1);
		await serverAction1.select();

		// Set server2 to workspace
		const actions2 = service.getPreConfirmActions(ref2);
		const serverAction2 = actions2.find(a => a.label.includes('Server 2') && a.label.includes('Workspace'));
		assert.ok(serverAction2);
		await serverAction2.select();

		// Verify they're independent
		const result1 = service.getPreConfirmAction(ref1);
		const result2 = service.getPreConfirmAction(ref2);

		assert.deepStrictEqual(result1, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });
		assert.deepStrictEqual(result2, { type: ToolConfirmKind.LmServicePerTool, scope: 'workspace' });
	});

	test('actions return true when select is called', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);

		for (const action of actions) {
			const result = await action.select();
			assert.strictEqual(result, true);
		}
	});

	test('session confirmations are stored in memory only', async () => {
		const ref = createToolRef('testTool');
		const actions = service.getPreConfirmActions(ref);
		const sessionAction = actions.find(a => a.label.includes('Session') && !a.label.includes('Server'));

		assert.ok(sessionAction);
		await sessionAction.select();

		// Verify it's set
		const result = service.getPreConfirmAction(ref);
		assert.deepStrictEqual(result, { type: ToolConfirmKind.LmServicePerTool, scope: 'session' });

		// Create new service instance (simulating restart)
		const newService = store.add(instantiationService.createInstance(LanguageModelToolsConfirmationService));

		// Session confirmation should not persist
		const newResult = newService.getPreConfirmAction(ref);
		assert.strictEqual(newResult, undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/languageModelToolsService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/languageModelToolsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { Barrier } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { CancellationError, isCancellationError } from '../../../../../base/common/errors.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { TestAccessibilityService } from '../../../../../platform/accessibility/test/common/testAccessibilityService.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ConfigurationTarget, IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { ContextKeyEqualsExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { LanguageModelToolsService } from '../../browser/languageModelToolsService.js';
import { ChatModel, IChatModel } from '../../common/chatModel.js';
import { IChatService, IChatToolInputInvocationData, IChatToolInvocation, ToolConfirmKind } from '../../common/chatService.js';
import { ChatConfiguration } from '../../common/constants.js';
import { SpecedToolAliases, isToolResultInputOutputDetails, IToolData, IToolImpl, IToolInvocation, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { MockChatService } from '../common/mockChatService.js';
import { ChatToolInvocation } from '../../common/chatProgressTypes/chatToolInvocation.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';
import { ILanguageModelToolsConfirmationService } from '../../common/languageModelToolsConfirmationService.js';
import { MockLanguageModelToolsConfirmationService } from '../common/mockLanguageModelToolsConfirmationService.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';

// --- Test helpers to reduce repetition and improve readability ---

class TestAccessibilitySignalService implements Partial<IAccessibilitySignalService> {
	public signalPlayedCalls: { signal: AccessibilitySignal; options?: any }[] = [];

	async playSignal(signal: AccessibilitySignal, options?: any): Promise<void> {
		this.signalPlayedCalls.push({ signal, options });
	}

	reset() {
		this.signalPlayedCalls = [];
	}
}

class TestTelemetryService implements Partial<ITelemetryService> {
	public events: Array<{ eventName: string; data: any }> = [];

	publicLog2<E extends Record<string, any>, T extends Record<string, any>>(eventName: string, data?: E): void {
		this.events.push({ eventName, data });
	}

	reset() {
		this.events = [];
	}
}

function registerToolForTest(service: LanguageModelToolsService, store: any, id: string, impl: IToolImpl, data?: Partial<IToolData>) {
	const toolData: IToolData = {
		id,
		modelDescription: data?.modelDescription ?? 'Test Tool',
		displayName: data?.displayName ?? 'Test Tool',
		source: ToolDataSource.Internal,
		...data,
	};
	store.add(service.registerTool(toolData, impl));
	return {
		id,
		makeDto: (parameters: any, context?: { sessionId: string }, callId: string = '1'): IToolInvocation => ({
			callId,
			toolId: id,
			tokenBudget: 100,
			parameters,
			context: context ? {
				sessionId: context.sessionId,
				sessionResource: LocalChatSessionUri.forSession(context.sessionId),
			} : undefined,
		}),
	};
}

function stubGetSession(chatService: MockChatService, sessionId: string, options?: { requestId?: string; capture?: { invocation?: any } }): IChatModel {
	const requestId = options?.requestId ?? 'requestId';
	const capture = options?.capture;
	const fakeModel = {
		sessionId,
		sessionResource: LocalChatSessionUri.forSession(sessionId),
		getRequests: () => [{ id: requestId, modelId: 'test-model' }],
	} as ChatModel;
	chatService.addSession(fakeModel);
	chatService.appendProgress = (request, progress) => {
		if (capture) { capture.invocation = progress; }
	};

	return fakeModel;
}

async function waitForPublishedInvocation(capture: { invocation?: any }, tries = 5): Promise<ChatToolInvocation> {
	for (let i = 0; i < tries && !capture.invocation; i++) {
		await Promise.resolve();
	}
	return capture.invocation;
}

suite('LanguageModelToolsService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let contextKeyService: IContextKeyService;
	let service: LanguageModelToolsService;
	let chatService: MockChatService;
	let configurationService: TestConfigurationService;

	setup(() => {
		configurationService = new TestConfigurationService();
		configurationService.setUserConfiguration(ChatConfiguration.ExtensionToolsEnabled, true);
		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(configurationService)),
			configurationService: () => configurationService
		}, store);
		contextKeyService = instaService.get(IContextKeyService);
		chatService = new MockChatService();
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		service = store.add(instaService.createInstance(LanguageModelToolsService));
	});

	function setupToolsForTest(service: LanguageModelToolsService, store: any) {

		// Create a variety of tools and tool sets for testing
		// Some with toolReferenceName, some without, some from extensions, mcp and user defined

		const tool1: IToolData = {
			id: 'tool1',
			toolReferenceName: 'tool1RefName',
			modelDescription: 'Test Tool 1',
			displayName: 'Tool1 Display Name',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(tool1));

		const tool2: IToolData = {
			id: 'tool2',
			modelDescription: 'Test Tool 2',
			displayName: 'Tool2 Display Name',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(tool2));

		/** Extension Tool 1 */

		const extTool1: IToolData = {
			id: 'extTool1',
			toolReferenceName: 'extTool1RefName',
			modelDescription: 'Test Extension Tool 1',
			displayName: 'ExtTool1 Display Name',
			source: { type: 'extension', label: 'My Extension', extensionId: new ExtensionIdentifier('my.extension') },
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(extTool1));

		/** Internal Tool Set with internalToolSetTool1 */

		const internalToolSetTool1: IToolData = {
			id: 'internalToolSetTool1',
			toolReferenceName: 'internalToolSetTool1RefName',
			modelDescription: 'Test Internal Tool Set 1',
			displayName: 'InternalToolSet1 Display Name',
			source: ToolDataSource.Internal,
		};
		store.add(service.registerToolData(internalToolSetTool1));

		const internalToolSet = store.add(service.createToolSet(
			ToolDataSource.Internal,
			'internalToolSet',
			'internalToolSetRefName',
			{ description: 'Test Set' }
		));
		store.add(internalToolSet.addTool(internalToolSetTool1));

		/** User Tool Set with tool1 */

		const userToolSet = store.add(service.createToolSet(
			{ type: 'user', label: 'User', file: URI.file('/test/userToolSet.json') },
			'userToolSet',
			'userToolSetRefName',
			{ description: 'Test Set' }
		));
		store.add(userToolSet.addTool(tool2));

		/** MCP tool in a MCP tool set */

		const mcpDataSource: ToolDataSource = { type: 'mcp', label: 'My MCP Server', serverLabel: 'MCP Server', instructions: undefined, collectionId: 'testMCPCollection', definitionId: 'testMCPDefId' };
		const mcpTool1: IToolData = {
			id: 'mcpTool1',
			toolReferenceName: 'mcpTool1RefName',
			modelDescription: 'Test MCP Tool 1',
			displayName: 'McpTool1 Display Name',
			source: mcpDataSource,
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(mcpTool1));

		const mcpToolSet = store.add(service.createToolSet(
			mcpDataSource,
			'mcpToolSet',
			'mcpToolSetRefName',
			{ description: 'MCP Test ToolSet' }
		));
		store.add(mcpToolSet.addTool(mcpTool1));
	}


	test('registerToolData', () => {
		const toolData: IToolData = {
			id: 'testTool',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const disposable = service.registerToolData(toolData);
		assert.strictEqual(service.getTool('testTool')?.id, 'testTool');
		disposable.dispose();
		assert.strictEqual(service.getTool('testTool'), undefined);
	});

	test('registerToolImplementation', () => {
		const toolData: IToolData = {
			id: 'testTool',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolData));

		const toolImpl: IToolImpl = {
			invoke: async () => ({ content: [{ kind: 'text', value: 'result' }] }),
		};

		store.add(service.registerToolImplementation('testTool', toolImpl));
		assert.strictEqual(service.getTool('testTool')?.id, 'testTool');
	});

	test('getTools', () => {
		contextKeyService.createKey('testKey', true);
		const toolData1: IToolData = {
			id: 'testTool1',
			modelDescription: 'Test Tool 1',
			when: ContextKeyEqualsExpr.create('testKey', false),
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const toolData2: IToolData = {
			id: 'testTool2',
			modelDescription: 'Test Tool 2',
			when: ContextKeyEqualsExpr.create('testKey', true),
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const toolData3: IToolData = {
			id: 'testTool3',
			modelDescription: 'Test Tool 3',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolData1));
		store.add(service.registerToolData(toolData2));
		store.add(service.registerToolData(toolData3));

		const tools = Array.from(service.getTools());
		assert.strictEqual(tools.length, 2);
		assert.strictEqual(tools[0].id, 'testTool2');
		assert.strictEqual(tools[1].id, 'testTool3');
	});

	test('getToolByName', () => {
		contextKeyService.createKey('testKey', true);
		const toolData1: IToolData = {
			id: 'testTool1',
			toolReferenceName: 'testTool1',
			modelDescription: 'Test Tool 1',
			when: ContextKeyEqualsExpr.create('testKey', false),
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const toolData2: IToolData = {
			id: 'testTool2',
			toolReferenceName: 'testTool2',
			modelDescription: 'Test Tool 2',
			when: ContextKeyEqualsExpr.create('testKey', true),
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const toolData3: IToolData = {
			id: 'testTool3',
			toolReferenceName: 'testTool3',
			modelDescription: 'Test Tool 3',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolData1));
		store.add(service.registerToolData(toolData2));
		store.add(service.registerToolData(toolData3));

		assert.strictEqual(service.getToolByName('testTool1'), undefined);
		assert.strictEqual(service.getToolByName('testTool1', true)?.id, 'testTool1');
		assert.strictEqual(service.getToolByName('testTool2')?.id, 'testTool2');
		assert.strictEqual(service.getToolByName('testTool3')?.id, 'testTool3');
	});

	test('invokeTool', async () => {
		const toolData: IToolData = {
			id: 'testTool',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolData));

		const toolImpl: IToolImpl = {
			invoke: async (invocation) => {
				assert.strictEqual(invocation.callId, '1');
				assert.strictEqual(invocation.toolId, 'testTool');
				assert.deepStrictEqual(invocation.parameters, { a: 1 });
				return { content: [{ kind: 'text', value: 'result' }] };
			}
		};

		store.add(service.registerToolImplementation('testTool', toolImpl));

		const dto: IToolInvocation = {
			callId: '1',
			toolId: 'testTool',
			tokenBudget: 100,
			parameters: {
				a: 1
			},
			context: undefined,
		};

		const result = await service.invokeTool(dto, async () => 0, CancellationToken.None);
		assert.strictEqual(result.content[0].value, 'result');
	});

	test('invocation parameters are overridden by input toolSpecificData', async () => {
		const rawInput = { b: 2 };
		const tool = registerToolForTest(service, store, 'testToolInputOverride', {
			prepareToolInvocation: async () => ({
				toolSpecificData: { kind: 'input', rawInput } satisfies IChatToolInputInvocationData,
				confirmationMessages: {
					title: 'a',
					message: 'b',
				}
			}),
			invoke: async (invocation) => {
				// The service should replace parameters with rawInput and strip toolSpecificData
				assert.deepStrictEqual(invocation.parameters, rawInput);
				assert.strictEqual(invocation.toolSpecificData, undefined);
				return { content: [{ kind: 'text', value: 'ok' }] };
			},
		});

		const sessionId = 'sessionId';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'requestId-io', capture });
		const dto = tool.makeDto({ a: 1 }, { sessionId });

		const invokeP = service.invokeTool(dto, async () => 0, CancellationToken.None);
		const published = await waitForPublishedInvocation(capture);
		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await invokeP;
		assert.strictEqual(result.content[0].value, 'ok');
	});

	test('chat invocation injects input toolSpecificData for confirmation when alwaysDisplayInputOutput', async () => {
		const toolData: IToolData = {
			id: 'testToolDisplayIO',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
			alwaysDisplayInputOutput: true,
		};

		const tool = registerToolForTest(service, store, 'testToolDisplayIO', {
			prepareToolInvocation: async () => ({
				confirmationMessages: { title: 'Confirm', message: 'Proceed?' }
			}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'done' }] }),
		}, toolData);

		const sessionId = 'sessionId-io';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'requestId-io', capture });

		const dto = tool.makeDto({ a: 1 }, { sessionId });

		const invokeP = service.invokeTool(dto, async () => 0, CancellationToken.None);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published, 'expected ChatToolInvocation to be published');
		assert.strictEqual(published.toolId, tool.id);
		// The service should have injected input toolSpecificData with the raw parameters
		assert.strictEqual(published.toolSpecificData?.kind, 'input');
		assert.deepStrictEqual(published.toolSpecificData?.rawInput, dto.parameters);

		// Confirm to let invoke proceed
		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await invokeP;
		assert.strictEqual(result.content[0].value, 'done');
	});

	test('chat invocation waits for user confirmation before invoking', async () => {
		const toolData: IToolData = {
			id: 'testToolConfirm',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		let invoked = false;
		const tool = registerToolForTest(service, store, toolData.id, {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Confirm', message: 'Go?' } }),
			invoke: async () => {
				invoked = true;
				return { content: [{ kind: 'text', value: 'ran' }] };
			},
		}, toolData);

		const sessionId = 'sessionId-confirm';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'requestId-confirm', capture });

		const dto = tool.makeDto({ x: 1 }, { sessionId });

		const promise = service.invokeTool(dto, async () => 0, CancellationToken.None);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published, 'expected ChatToolInvocation to be published');
		assert.strictEqual(invoked, false, 'invoke should not run before confirmation');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(invoked, true, 'invoke should have run after confirmation');
		assert.strictEqual(result.content[0].value, 'ran');
	});

	test('cancel tool call', async () => {
		const toolBarrier = new Barrier();
		const tool = registerToolForTest(service, store, 'testTool', {
			invoke: async (invocation, countTokens, progress, cancelToken) => {
				assert.strictEqual(invocation.callId, '1');
				assert.strictEqual(invocation.toolId, 'testTool');
				assert.deepStrictEqual(invocation.parameters, { a: 1 });
				await toolBarrier.wait();
				if (cancelToken.isCancellationRequested) {
					throw new CancellationError();
				} else {
					throw new Error('Tool call should be cancelled');
				}
			}
		});

		const sessionId = 'sessionId';
		const requestId = 'requestId';
		const dto = tool.makeDto({ a: 1 }, { sessionId });
		stubGetSession(chatService, sessionId, { requestId });
		const toolPromise = service.invokeTool(dto, async () => 0, CancellationToken.None);
		service.cancelToolCallsForRequest(requestId);
		toolBarrier.open();
		await assert.rejects(toolPromise, err => {
			return isCancellationError(err);
		}, 'Expected tool call to be cancelled');
	});

	test('toFullReferenceNames', () => {
		setupToolsForTest(service, store);

		const tool1 = service.getToolByFullReferenceName('tool1RefName');
		const extTool1 = service.getToolByFullReferenceName('my.extension/extTool1RefName');
		const mcpToolSet = service.getToolByFullReferenceName('mcpToolSetRefName/*');
		const mcpTool1 = service.getToolByFullReferenceName('mcpToolSetRefName/mcpTool1RefName');
		const internalToolSet = service.getToolByFullReferenceName('internalToolSetRefName');
		const internalTool = service.getToolByFullReferenceName('internalToolSetRefName/internalToolSetTool1RefName');
		const userToolSet = service.getToolSet('userToolSet');
		const unknownTool = { id: 'unregisteredTool', toolReferenceName: 'unregisteredToolRefName', modelDescription: 'Unregistered Tool', displayName: 'Unregistered Tool', source: ToolDataSource.Internal, canBeReferencedInPrompt: true } satisfies IToolData;
		const unknownToolSet = service.createToolSet(ToolDataSource.Internal, 'unknownToolSet', 'unknownToolSetRefName', { description: 'Unknown Test Set' });
		unknownToolSet.dispose(); // unregister the set
		assert.ok(tool1);
		assert.ok(extTool1);
		assert.ok(mcpTool1);
		assert.ok(mcpToolSet);
		assert.ok(internalToolSet);
		assert.ok(internalTool);
		assert.ok(userToolSet);

		// Test with some enabled tool
		{
			// creating a map by hand is a no-go, we just do it for this test
			const map = new Map<IToolData | ToolSet, boolean>([[tool1, true], [extTool1, true], [mcpToolSet, true], [mcpTool1, true]]);
			const fullReferenceNames = service.toFullReferenceNames(map);
			const expectedFullReferenceNames = ['tool1RefName', 'my.extension/extTool1RefName', 'mcpToolSetRefName/*'];
			assert.deepStrictEqual(fullReferenceNames.sort(), expectedFullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Test with user data
		{
			// creating a map by hand is a no-go, we just do it for this test
			const map = new Map<IToolData | ToolSet, boolean>([[tool1, true], [userToolSet, true], [internalToolSet, false], [internalTool, true]]);
			const fullReferenceNames = service.toFullReferenceNames(map);
			const expectedFullReferenceNames = ['tool1RefName', 'internalToolSetRefName/internalToolSetTool1RefName'];
			assert.deepStrictEqual(fullReferenceNames.sort(), expectedFullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Test with unknown tool and tool set
		{
			// creating a map by hand is a no-go, we just do it for this test
			const map = new Map<IToolData | ToolSet, boolean>([[unknownTool, true], [unknownToolSet, true], [internalToolSet, true], [internalTool, true]]);
			const fullReferenceNames = service.toFullReferenceNames(map);
			const expectedFullReferenceNames = ['internalToolSetRefName'];
			assert.deepStrictEqual(fullReferenceNames.sort(), expectedFullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
	});

	test('toToolAndToolSetEnablementMap', () => {
		setupToolsForTest(service, store);

		const allFullReferenceNames = [
			'tool1RefName',
			'Tool2 Display Name',
			'my.extension/extTool1RefName',
			'mcpToolSetRefName/*',
			'mcpToolSetRefName/mcpTool1RefName',
			'internalToolSetRefName',
			'internalToolSetRefName/internalToolSetTool1RefName',
			'vscode',
			'execute',
			'read'
		];
		const numOfTools = allFullReferenceNames.length + 1; // +1 for userToolSet which has no full reference name but is a tool set

		const tool1 = service.getToolByFullReferenceName('tool1RefName');
		const tool2 = service.getToolByFullReferenceName('Tool2 Display Name');
		const extTool1 = service.getToolByFullReferenceName('my.extension/extTool1RefName');
		const mcpToolSet = service.getToolByFullReferenceName('mcpToolSetRefName/*');
		const mcpTool1 = service.getToolByFullReferenceName('mcpToolSetRefName/mcpTool1RefName');
		const internalToolSet = service.getToolByFullReferenceName('internalToolSetRefName');
		const internalTool = service.getToolByFullReferenceName('internalToolSetRefName/internalToolSetTool1RefName');
		const userToolSet = service.getToolSet('userToolSet');
		const vscodeToolSet = service.getToolSet('vscode');
		const executeToolSet = service.getToolSet('execute');
		const readToolSet = service.getToolSet('read');
		assert.ok(tool1);
		assert.ok(tool2);
		assert.ok(extTool1);
		assert.ok(mcpTool1);
		assert.ok(mcpToolSet);
		assert.ok(internalToolSet);
		assert.ok(internalTool);
		assert.ok(userToolSet);
		assert.ok(vscodeToolSet);
		assert.ok(executeToolSet);
		assert.ok(readToolSet);
		// Test with enabled tool
		{
			const fullReferenceNames = ['tool1RefName'];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 1, 'Expected 1 tool to be enabled');
			assert.strictEqual(result1.get(tool1), true, 'tool1 should be enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			assert.deepStrictEqual(fullReferenceNames1.sort(), fullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');

		}
		// Test with multiple enabled tools
		{
			const fullReferenceNames = ['my.extension/extTool1RefName', 'mcpToolSetRefName/*', 'internalToolSetRefName/internalToolSetTool1RefName'];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 4, 'Expected 4 tools to be enabled');
			assert.strictEqual(result1.get(extTool1), true, 'extTool1 should be enabled');
			assert.strictEqual(result1.get(mcpToolSet), true, 'mcpToolSet should be enabled');
			assert.strictEqual(result1.get(mcpTool1), true, 'mcpTool1 should be enabled because the set is enabled');
			assert.strictEqual(result1.get(internalTool), true, 'internalTool should be enabled because the set is enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			assert.deepStrictEqual(fullReferenceNames1.sort(), fullReferenceNames.sort(), 'toFullReferenceNames should return the expected names');
		}
		// Test with all enabled tools, redundant names
		{
			const result1 = service.toToolAndToolSetEnablementMap(allFullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 11, 'Expected 11 tools to be enabled'); // +3 including the vscode, execute, read toolsets

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			const expectedFullReferenceNames = ['tool1RefName', 'Tool2 Display Name', 'my.extension/extTool1RefName', 'mcpToolSetRefName/*', 'internalToolSetRefName', 'vscode', 'execute', 'read'];
			assert.deepStrictEqual(fullReferenceNames1.sort(), expectedFullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Test with no enabled tools
		{
			const fullReferenceNames: string[] = [];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 0, 'Expected 0 tools to be enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			assert.deepStrictEqual(fullReferenceNames1.sort(), fullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Test with unknown tool
		{
			const fullReferenceNames: string[] = ['unknownToolRefName'];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 0, 'Expected 0 tools to be enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			assert.deepStrictEqual(fullReferenceNames1.sort(), [], 'toFullReferenceNames should return no enabled names');
		}
		// Test with legacy tool names
		{
			const fullReferenceNames: string[] = ['extTool1RefName', 'mcpToolSetRefName', 'internalToolSetTool1RefName'];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 4, 'Expected 4 tools to be enabled');
			assert.strictEqual(result1.get(extTool1), true, 'extTool1 should be enabled');
			assert.strictEqual(result1.get(mcpToolSet), true, 'mcpToolSet should be enabled');
			assert.strictEqual(result1.get(mcpTool1), true, 'mcpTool1 should be enabled because the set is enabled');
			assert.strictEqual(result1.get(internalTool), true, 'internalTool should be enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			const expectedFullReferenceNames: string[] = ['my.extension/extTool1RefName', 'mcpToolSetRefName/*', 'internalToolSetRefName/internalToolSetTool1RefName'];
			assert.deepStrictEqual(fullReferenceNames1.sort(), expectedFullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Test with tool in user tool set
		{
			const fullReferenceNames = ['Tool2 Display Name'];
			const result1 = service.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			assert.strictEqual(result1.size, numOfTools, `Expected ${numOfTools} tools and tool sets`);
			assert.strictEqual([...result1.entries()].filter(([_, enabled]) => enabled).length, 2, 'Expected 1 tool and user tool set to be enabled');
			assert.strictEqual(result1.get(tool2), true, 'tool2 should be enabled');
			assert.strictEqual(result1.get(userToolSet), true, 'userToolSet should be enabled');

			const fullReferenceNames1 = service.toFullReferenceNames(result1);
			assert.deepStrictEqual(fullReferenceNames1.sort(), fullReferenceNames.sort(), 'toFullReferenceNames should return the original enabled names');

		}
	});

	test('toToolAndToolSetEnablementMap with extension tool', () => {
		// Register individual tools
		const toolData1: IToolData = {
			id: 'tool1',
			toolReferenceName: 'refTool1',
			modelDescription: 'Test Tool 1',
			displayName: 'Test Tool 1',
			source: { type: 'extension', label: 'My Extension', extensionId: new ExtensionIdentifier('My.extension') },
			canBeReferencedInPrompt: true,
		};

		store.add(service.registerToolData(toolData1));

		// Test enabling the tool set
		const enabledNames = [toolData1].map(t => service.getFullReferenceName(t));
		const result = service.toToolAndToolSetEnablementMap(enabledNames, undefined);

		assert.strictEqual(result.get(toolData1), true, 'individual tool should be enabled');

		const fullReferenceNames = service.toFullReferenceNames(result);
		assert.deepStrictEqual(fullReferenceNames.sort(), enabledNames.sort(), 'toFullReferenceNames should return the original enabled names');
	});

	test('toToolAndToolSetEnablementMap with tool sets', () => {
		// Register individual tools
		const toolData1: IToolData = {
			id: 'tool1',
			toolReferenceName: 'refTool1',
			modelDescription: 'Test Tool 1',
			displayName: 'Test Tool 1',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};

		const toolData2: IToolData = {
			id: 'tool2',
			modelDescription: 'Test Tool 2',
			displayName: 'Test Tool 2',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};

		store.add(service.registerToolData(toolData1));
		store.add(service.registerToolData(toolData2));

		// Create a tool set
		const toolSet = store.add(service.createToolSet(
			ToolDataSource.Internal,
			'testToolSet',
			'refToolSet',
			{ description: 'Test Tool Set' }
		));

		// Add tools to the tool set
		const toolSetTool1: IToolData = {
			id: 'toolSetTool1',
			modelDescription: 'Tool Set Tool 1',
			displayName: 'Tool Set Tool 1',
			source: ToolDataSource.Internal,
		};

		const toolSetTool2: IToolData = {
			id: 'toolSetTool2',
			modelDescription: 'Tool Set Tool 2',
			displayName: 'Tool Set Tool 2',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolSetTool1));
		store.add(service.registerToolData(toolSetTool2));
		store.add(toolSet.addTool(toolSetTool1));
		store.add(toolSet.addTool(toolSetTool2));

		// Test enabling the tool set
		const enabledNames = [toolSet, toolData1].map(t => service.getFullReferenceName(t));
		const result = service.toToolAndToolSetEnablementMap(enabledNames, undefined);

		assert.strictEqual(result.get(toolData1), true, 'individual tool should be enabled');
		assert.strictEqual(result.get(toolData2), false);
		assert.strictEqual(result.get(toolSet), true, 'tool set should be enabled');
		assert.strictEqual(result.get(toolSetTool1), true, 'tool set tool 1 should be enabled');
		assert.strictEqual(result.get(toolSetTool2), true, 'tool set tool 2 should be enabled');

		const fullReferenceNames = service.toFullReferenceNames(result);
		assert.deepStrictEqual(fullReferenceNames.sort(), enabledNames.sort(), 'toFullReferenceNames should return the original enabled names');
	});

	test('toToolAndToolSetEnablementMap with non-existent tool names', () => {
		const toolData: IToolData = {
			id: 'tool1',
			toolReferenceName: 'refTool1',
			modelDescription: 'Test Tool 1',
			displayName: 'Test Tool 1',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};

		store.add(service.registerToolData(toolData));

		const unregisteredToolData: IToolData = {
			id: 'toolX',
			toolReferenceName: 'refToolX',
			modelDescription: 'Test Tool X',
			displayName: 'Test Tool X',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
		};

		// Test with non-existent tool names
		const enabledNames = [toolData, unregisteredToolData].map(t => service.getFullReferenceName(t));
		const result = service.toToolAndToolSetEnablementMap(enabledNames, undefined);

		assert.strictEqual(result.get(toolData), true, 'existing tool should be enabled');
		// Non-existent tools should not appear in the result map
		assert.strictEqual(result.get(unregisteredToolData), undefined, 'non-existent tool should not be in result');

		const fullReferenceNames = service.toFullReferenceNames(result);
		const expectedNames = [service.getFullReferenceName(toolData)]; // Only the existing tool
		assert.deepStrictEqual(fullReferenceNames.sort(), expectedNames.sort(), 'toFullReferenceNames should return the original enabled names');

	});


	test('toToolAndToolSetEnablementMap with legacy names', () => {
		// Test that legacy tool reference names and legacy toolset names work correctly

		// Create a tool with legacy reference names
		const toolWithLegacy: IToolData = {
			id: 'newTool',
			toolReferenceName: 'newToolRef',
			modelDescription: 'New Tool',
			displayName: 'New Tool',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
			legacyToolReferenceFullNames: ['oldToolName', 'deprecatedToolName']
		};
		store.add(service.registerToolData(toolWithLegacy));

		// Create a tool set with legacy names
		const toolSetWithLegacy = store.add(service.createToolSet(
			ToolDataSource.Internal,
			'newToolSet',
			'newToolSetRef',
			{ description: 'New Tool Set', legacyFullNames: ['oldToolSet', 'deprecatedToolSet'] }
		));

		// Create a tool in the toolset
		const toolInSet: IToolData = {
			id: 'toolInSet',
			toolReferenceName: 'toolInSetRef',
			modelDescription: 'Tool In Set',
			displayName: 'Tool In Set',
			source: ToolDataSource.Internal,
		};
		store.add(service.registerToolData(toolInSet));
		store.add(toolSetWithLegacy.addTool(toolInSet));

		// Test 1: Using legacy tool reference name should enable the tool
		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolName'], undefined);
			assert.strictEqual(result.get(toolWithLegacy), true, 'tool should be enabled via legacy name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolRef'], 'should return current full reference name, not legacy');
		}

		// Test 2: Using another legacy tool reference name should also work
		{
			const result = service.toToolAndToolSetEnablementMap(['deprecatedToolName'], undefined);
			assert.strictEqual(result.get(toolWithLegacy), true, 'tool should be enabled via another legacy name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolRef'], 'should return current full reference name, not legacy');
		}

		// Test 3: Using legacy toolset name should enable the entire toolset
		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet'], undefined);
			assert.strictEqual(result.get(toolSetWithLegacy), true, 'toolset should be enabled via legacy name');
			assert.strictEqual(result.get(toolInSet), true, 'tool in set should be enabled when set is enabled via legacy name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolSetRef'], 'should return current full reference name, not legacy');
		}

		// Test 4: Using deprecated toolset name should also work
		{
			const result = service.toToolAndToolSetEnablementMap(['deprecatedToolSet'], undefined);
			assert.strictEqual(result.get(toolSetWithLegacy), true, 'toolset should be enabled via another legacy name');
			assert.strictEqual(result.get(toolInSet), true, 'tool in set should be enabled when set is enabled via legacy name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolSetRef'], 'should return current full reference name, not legacy');
		}

		// Test 5: Mix of current and legacy names
		{
			const result = service.toToolAndToolSetEnablementMap(['newToolRef', 'oldToolSet'], undefined);
			assert.strictEqual(result.get(toolWithLegacy), true, 'tool should be enabled via current name');
			assert.strictEqual(result.get(toolSetWithLegacy), true, 'toolset should be enabled via legacy name');
			assert.strictEqual(result.get(toolInSet), true, 'tool in set should be enabled');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames.sort(), ['newToolRef', 'newToolSetRef'].sort(), 'should return current full reference names');
		}

		// Test 6: Using legacy names and current names together (redundant but should work)
		{
			const result = service.toToolAndToolSetEnablementMap(['newToolRef', 'oldToolName', 'deprecatedToolName'], undefined);
			assert.strictEqual(result.get(toolWithLegacy), true, 'tool should be enabled (redundant legacy names should not cause issues)');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolRef'], 'should return single current full reference name');
		}
	});

	test('toToolAndToolSetEnablementMap with orphaned toolset in legacy names', () => {
		// Test that when a tool has a legacy name with a toolset prefix, but that toolset no longer exists,
		// we can enable the tool by either the full legacy name OR just the orphaned toolset name

		// Create a tool that used to be in 'oldToolSet/oldToolName' but now is just 'newToolRef'
		const toolWithOrphanedToolSet: IToolData = {
			id: 'migratedTool',
			toolReferenceName: 'newToolRef',
			modelDescription: 'Migrated Tool',
			displayName: 'Migrated Tool',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
			legacyToolReferenceFullNames: ['oldToolSet/oldToolName']
		};
		store.add(service.registerToolData(toolWithOrphanedToolSet));

		// Test 1: Using the full legacy name should enable the tool
		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet/oldToolName'], undefined);
			assert.strictEqual(result.get(toolWithOrphanedToolSet), true, 'tool should be enabled via full legacy name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolRef'], 'should return current full reference name');
		}

		// Test 2: Using just the orphaned toolset name should also enable the tool
		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet'], undefined);
			assert.strictEqual(result.get(toolWithOrphanedToolSet), true, 'tool should be enabled via orphaned toolset name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames, ['newToolRef'], 'should return current full reference name');
		}

		// Test 3: Multiple tools from the same orphaned toolset
		const anotherToolFromOrphanedSet: IToolData = {
			id: 'anotherMigratedTool',
			toolReferenceName: 'anotherNewToolRef',
			modelDescription: 'Another Migrated Tool',
			displayName: 'Another Migrated Tool',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
			legacyToolReferenceFullNames: ['oldToolSet/anotherOldToolName']
		};
		store.add(service.registerToolData(anotherToolFromOrphanedSet));

		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet'], undefined);
			assert.strictEqual(result.get(toolWithOrphanedToolSet), true, 'first tool should be enabled via orphaned toolset name');
			assert.strictEqual(result.get(anotherToolFromOrphanedSet), true, 'second tool should also be enabled via orphaned toolset name');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames.sort(), ['newToolRef', 'anotherNewToolRef'].sort(), 'should return both current full reference names');
		}

		// Test 4: Orphaned toolset name should NOT enable tools that weren't in that toolset
		const unrelatedTool: IToolData = {
			id: 'unrelatedTool',
			toolReferenceName: 'unrelatedToolRef',
			modelDescription: 'Unrelated Tool',
			displayName: 'Unrelated Tool',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: true,
			legacyToolReferenceFullNames: ['differentToolSet/oldName']
		};
		store.add(service.registerToolData(unrelatedTool));

		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet'], undefined);
			assert.strictEqual(result.get(toolWithOrphanedToolSet), true, 'tool from oldToolSet should be enabled');
			assert.strictEqual(result.get(anotherToolFromOrphanedSet), true, 'another tool from oldToolSet should be enabled');
			assert.strictEqual(result.get(unrelatedTool), false, 'tool from different toolset should NOT be enabled');

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames.sort(), ['newToolRef', 'anotherNewToolRef'].sort(), 'should only return tools from oldToolSet');
		}

		// Test 5: If a toolset with the same name exists, it should take precedence over orphaned toolset mapping
		const newToolSetWithSameName = store.add(service.createToolSet(
			ToolDataSource.Internal,
			'recreatedToolSet',
			'oldToolSet',  // Same name as the orphaned toolset
			{ description: 'Recreated Tool Set' }
		));

		const toolInRecreatedSet: IToolData = {
			id: 'toolInRecreatedSet',
			toolReferenceName: 'toolInRecreatedSetRef',
			modelDescription: 'Tool In Recreated Set',
			displayName: 'Tool In Recreated Set',
			source: ToolDataSource.Internal,
		};
		store.add(service.registerToolData(toolInRecreatedSet));
		store.add(newToolSetWithSameName.addTool(toolInRecreatedSet));

		{
			const result = service.toToolAndToolSetEnablementMap(['oldToolSet'], undefined);
			// Now 'oldToolSet' should enable BOTH the recreated toolset AND the tools with legacy names pointing to oldToolSet
			assert.strictEqual(result.get(newToolSetWithSameName), true, 'recreated toolset should be enabled');
			assert.strictEqual(result.get(toolInRecreatedSet), true, 'tool in recreated set should be enabled');
			// The tools with legacy toolset names should ALSO be enabled because their legacy names match
			assert.strictEqual(result.get(toolWithOrphanedToolSet), true, 'tool with legacy toolset should still be enabled');
			assert.strictEqual(result.get(anotherToolFromOrphanedSet), true, 'another tool with legacy toolset should still be enabled');

			const fullReferenceNames = service.toFullReferenceNames(result);
			// Should return the toolset name plus the individual tools that were enabled via legacy names
			assert.deepStrictEqual(fullReferenceNames.sort(), ['oldToolSet', 'newToolRef', 'anotherNewToolRef'].sort(), 'should return toolset and individual tools');
		}
	});

	test('toToolAndToolSetEnablementMap map Github to VSCode tools', () => {
		const runInTerminalToolData: IToolData = {
			id: 'runInTerminalId',
			toolReferenceName: 'runInTerminal',
			modelDescription: 'runInTerminal Description',
			displayName: 'runInTerminal displayName',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: false,
		};

		store.add(service.registerToolData(runInTerminalToolData));
		store.add(service.executeToolSet.addTool(runInTerminalToolData));


		const runSubagentToolData: IToolData = {
			id: 'runSubagentId',
			toolReferenceName: 'runSubagent',
			modelDescription: 'runSubagent Description',
			displayName: 'runSubagent displayName',
			source: ToolDataSource.Internal,
			canBeReferencedInPrompt: false,
		};

		store.add(service.registerToolData(runSubagentToolData));

		const agentSet = store.add(service.createToolSet(
			ToolDataSource.Internal,
			SpecedToolAliases.agent,
			SpecedToolAliases.agent,
			{ description: 'Agent' }
		));
		store.add(agentSet.addTool(runSubagentToolData));

		const githubMcpDataSource: ToolDataSource = { type: 'mcp', label: 'Github', serverLabel: 'Github MCP Server', instructions: undefined, collectionId: 'githubMCPCollection', definitionId: 'githubMCPDefId' };
		const githubMcpTool1: IToolData = {
			id: 'create_branch',
			toolReferenceName: 'create_branch',
			modelDescription: 'Test Github MCP Tool 1',
			displayName: 'Create Branch',
			source: githubMcpDataSource,
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(githubMcpTool1));

		const githubMcpToolSet = store.add(service.createToolSet(
			githubMcpDataSource,
			'githubMcpToolSet',
			'github/github-mcp-server',
			{ description: 'Github MCP Test ToolSet' }
		));
		store.add(githubMcpToolSet.addTool(githubMcpTool1));

		assert.equal(githubMcpToolSet.referenceName, 'github', 'github/github-mcp-server will be normalized to github');

		const playwrightMcpDataSource: ToolDataSource = { type: 'mcp', label: 'playwright', serverLabel: 'playwright MCP Server', instructions: undefined, collectionId: 'playwrightMCPCollection', definitionId: 'playwrightMCPDefId' };
		const playwrightMcpTool1: IToolData = {
			id: 'browser_click',
			toolReferenceName: 'browser_click',
			modelDescription: 'Test playwright MCP Tool 1',
			displayName: 'Create Branch',
			source: playwrightMcpDataSource,
			canBeReferencedInPrompt: true,
		};
		store.add(service.registerToolData(playwrightMcpTool1));

		const playwrightMcpToolSet = store.add(service.createToolSet(
			playwrightMcpDataSource,
			'playwrightMcpToolSet',
			'microsoft/playwright-mcp',
			{ description: 'playwright MCP Test ToolSet' }
		));
		store.add(playwrightMcpToolSet.addTool(playwrightMcpTool1));

		const deprecated = service.getDeprecatedFullReferenceNames();
		const deprecatesTo = (key: string): string[] | undefined => {
			const values = deprecated.get(key);
			return values ? Array.from(values).sort() : undefined;
		};

		assert.equal(playwrightMcpToolSet.referenceName, 'playwright', 'microsoft/playwright-mcp will be normalized to playwright');

		{
			const toolNames = ['custom-agent', 'shell'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(service.executeToolSet), true, 'execute should be enabled');
			assert.strictEqual(result.get(agentSet), true, 'agent should be enabled');

			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, [SpecedToolAliases.agent, SpecedToolAliases.execute].sort(), 'toFullReferenceNames should return the VS Code tool names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [agentSet, service.executeToolSet]);

			assert.deepStrictEqual(deprecatesTo('custom-agent'), [SpecedToolAliases.agent], 'customAgent should map to agent');
			assert.deepStrictEqual(deprecatesTo('shell'), [SpecedToolAliases.execute], 'shell is now execute');
		}
		{
			const toolNames = ['github/*', 'playwright/*'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpToolSet), true, 'githubMcpToolSet should be enabled');
			assert.strictEqual(result.get(playwrightMcpToolSet), true, 'playwrightMcpToolSet should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/*', 'playwright/*'], 'toFullReferenceNames should return the VS Code tool names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpToolSet, playwrightMcpToolSet]);

			assert.deepStrictEqual(deprecatesTo('github/*'), undefined, 'github/* is fine');
			assert.deepStrictEqual(deprecatesTo('playwright/*'), undefined, 'playwright/* is fine');
		}

		{
			// the speced names should work and not be altered
			const toolNames = ['github/create_branch', 'playwright/browser_click'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpTool1), true, 'githubMcpTool1 should be enabled');
			assert.strictEqual(result.get(playwrightMcpTool1), true, 'playwrightMcpTool1 should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/create_branch', 'playwright/browser_click'], 'toFullReferenceNames should return the speced names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpTool1, playwrightMcpTool1]);

			assert.deepStrictEqual(deprecatesTo('github/create_branch'), undefined, 'github/create_branch is fine');
			assert.deepStrictEqual(deprecatesTo('playwright/browser_click'), undefined, 'playwright/browser_click is fine');
		}

		{
			// using the old MCP full names should also work
			const toolNames = ['github/github-mcp-server/*', 'microsoft/playwright-mcp/*'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpToolSet), true, 'githubMcpToolSet should be enabled');
			assert.strictEqual(result.get(playwrightMcpToolSet), true, 'playwrightMcpToolSet should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/*', 'playwright/*'], 'toFullReferenceNames should return the speced names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpToolSet, playwrightMcpToolSet]);

			assert.deepStrictEqual(deprecatesTo('github/github-mcp-server/*'), ['github/*']);
			assert.deepStrictEqual(deprecatesTo('microsoft/playwright-mcp/*'), ['playwright/*']);
		}
		{
			// using the old MCP full names should also work
			const toolNames = ['github/github-mcp-server/create_branch', 'microsoft/playwright-mcp/browser_click'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpTool1), true, 'githubMcpTool1 should be enabled');
			assert.strictEqual(result.get(playwrightMcpTool1), true, 'playwrightMcpTool1 should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/create_branch', 'playwright/browser_click'], 'toFullReferenceNames should return the speced names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpTool1, playwrightMcpTool1]);

			assert.deepStrictEqual(deprecatesTo('github/github-mcp-server/create_branch'), ['github/create_branch']);
			assert.deepStrictEqual(deprecatesTo('microsoft/playwright-mcp/browser_click'), ['playwright/browser_click']);
		}

		{
			// using the latest MCP full names should also work
			const toolNames = ['io.github.github/github-mcp-server/*', 'com.microsoft/playwright-mcp/*'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpToolSet), true, 'githubMcpToolSet should be enabled');
			assert.strictEqual(result.get(playwrightMcpToolSet), true, 'playwrightMcpToolSet should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/*', 'playwright/*'], 'toFullReferenceNames should return the speced names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpToolSet, playwrightMcpToolSet]);

			assert.deepStrictEqual(deprecatesTo('io.github.github/github-mcp-server/*'), ['github/*']);
			assert.deepStrictEqual(deprecatesTo('com.microsoft/playwright-mcp/*'), ['playwright/*']);
		}

		{
			// using the latest MCP full names should also work
			const toolNames = ['io.github.github/github-mcp-server/create_branch', 'com.microsoft/playwright-mcp/browser_click'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpTool1), true, 'githubMcpTool1 should be enabled');
			assert.strictEqual(result.get(playwrightMcpTool1), true, 'playwrightMcpTool1 should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/create_branch', 'playwright/browser_click'], 'toFullReferenceNames should return the speced names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpTool1, playwrightMcpTool1]);

			assert.deepStrictEqual(deprecatesTo('io.github.github/github-mcp-server/create_branch'), ['github/create_branch']);
			assert.deepStrictEqual(deprecatesTo('com.microsoft/playwright-mcp/browser_click'), ['playwright/browser_click']);
		}

		{
			// using the old MCP full names should also work
			const toolNames = ['github-mcp-server/create_branch'];
			const result = service.toToolAndToolSetEnablementMap(toolNames, undefined);

			assert.strictEqual(result.get(githubMcpTool1), true, 'githubMcpTool1 should be enabled');
			const fullReferenceNames = service.toFullReferenceNames(result).sort();
			assert.deepStrictEqual(fullReferenceNames, ['github/create_branch'], 'toFullReferenceNames should return the VS Code tool names');

			assert.deepStrictEqual(toolNames.map(name => service.getToolByFullReferenceName(name)), [githubMcpTool1]);

			assert.deepStrictEqual(deprecatesTo('github-mcp-server/create_branch'), ['github/create_branch']);
		}

	});

	test('accessibility signal for tool confirmation', async () => {
		// Create a test configuration service with proper settings
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration('chat.tools.global.autoApprove', false);
		testConfigService.setUserConfiguration('accessibility.signals.chatUserActionRequired', { sound: 'auto', announcement: 'auto' });

		// Create a test accessibility service that simulates screen reader being enabled
		const testAccessibilityService = new class extends TestAccessibilityService {
			override isScreenReaderOptimized(): boolean { return true; }
		}();

		// Create a test accessibility signal service that tracks calls
		const testAccessibilitySignalService = new TestAccessibilitySignalService();

		// Create a new service instance with the test services
		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(IAccessibilityService, testAccessibilityService);
		instaService.stub(IAccessibilitySignalService, testAccessibilitySignalService as unknown as IAccessibilitySignalService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		const toolData: IToolData = {
			id: 'testAccessibilityTool',
			modelDescription: 'Test Accessibility Tool',
			displayName: 'Test Accessibility Tool',
			source: ToolDataSource.Internal,
		};

		const tool = registerToolForTest(testService, store, toolData.id, {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Accessibility Test', message: 'Testing accessibility signal' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'executed' }] }),
		}, toolData);

		const sessionId = 'sessionId-accessibility';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'requestId-accessibility', capture });

		const dto = tool.makeDto({ param: 'value' }, { sessionId });

		const promise = testService.invokeTool(dto, async () => 0, CancellationToken.None);
		const published = await waitForPublishedInvocation(capture);

		assert.ok(published, 'expected ChatToolInvocation to be published');
		assert.ok(published.confirmationMessages, 'should have confirmation messages');

		// The accessibility signal should have been played
		assert.strictEqual(testAccessibilitySignalService.signalPlayedCalls.length, 1, 'accessibility signal should have been played once');
		const signalCall = testAccessibilitySignalService.signalPlayedCalls[0];
		assert.strictEqual(signalCall.signal, AccessibilitySignal.chatUserActionRequired, 'correct signal should be played');
		assert.ok(signalCall.options?.customAlertMessage.includes('Accessibility Test'), 'alert message should include tool title');
		assert.ok(signalCall.options?.customAlertMessage.includes('Chat confirmation required'), 'alert message should include confirmation text');

		// Complete the invocation
		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'executed');
	});

	test('accessibility signal respects autoApprove configuration', async () => {
		// Create a test configuration service with auto-approve enabled
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration('chat.tools.global.autoApprove', true);
		testConfigService.setUserConfiguration('accessibility.signals.chatUserActionRequired', { sound: 'auto', announcement: 'auto' });

		// Create a test accessibility service that simulates screen reader being enabled
		const testAccessibilityService = new class extends TestAccessibilityService {
			override isScreenReaderOptimized(): boolean { return true; }
		}();

		// Create a test accessibility signal service that tracks calls
		const testAccessibilitySignalService = new TestAccessibilitySignalService();

		// Create a new service instance with the test services
		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(IAccessibilityService, testAccessibilityService);
		instaService.stub(IAccessibilitySignalService, testAccessibilitySignalService as unknown as IAccessibilitySignalService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		const toolData: IToolData = {
			id: 'testAutoApproveTool',
			modelDescription: 'Test Auto Approve Tool',
			displayName: 'Test Auto Approve Tool',
			source: ToolDataSource.Internal,
		};

		const tool = registerToolForTest(testService, store, toolData.id, {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Auto Approve Test', message: 'Testing auto approve' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'auto approved' }] }),
		}, toolData);

		const sessionId = 'sessionId-auto-approve';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'requestId-auto-approve', capture });

		const dto = tool.makeDto({ config: 'test' }, { sessionId });

		// When auto-approve is enabled, tool should complete without user intervention
		const result = await testService.invokeTool(dto, async () => 0, CancellationToken.None);

		// Verify the tool completed and no accessibility signal was played
		assert.strictEqual(result.content[0].value, 'auto approved');
		assert.strictEqual(testAccessibilitySignalService.signalPlayedCalls.length, 0, 'accessibility signal should not be played when auto-approve is enabled');
	});

	test('shouldAutoConfirm with basic configuration', async () => {
		// Test basic shouldAutoConfirm behavior with simple configuration
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration('chat.tools.global.autoApprove', true); // Global enabled

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Register a tool that should be auto-approved
		const autoTool = registerToolForTest(testService, store, 'autoTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Test', message: 'Should auto-approve' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'auto approved' }] })
		});

		const sessionId = 'test-basic-config';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool should be auto-approved (global config = true)
		const result = await testService.invokeTool(
			autoTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result.content[0].value, 'auto approved');
	});

	test('shouldAutoConfirm with per-tool configuration object', async () => {
		// Test per-tool configuration: { toolId: true/false }
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration('chat.tools.global.autoApprove', {
			'approvedTool': true,
			'deniedTool': false
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool explicitly approved
		const approvedTool = registerToolForTest(testService, store, 'approvedTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Test', message: 'Should auto-approve' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'approved' }] })
		});

		const sessionId = 'test-per-tool';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Approved tool should auto-approve
		const approvedResult = await testService.invokeTool(
			approvedTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(approvedResult.content[0].value, 'approved');

		// Test that non-specified tools require confirmation (default behavior)
		const unspecifiedTool = registerToolForTest(testService, store, 'unspecifiedTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Test', message: 'Should require confirmation' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'unspecified' }] })
		});

		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId + '2', { requestId: 'req2', capture });
		const unspecifiedPromise = testService.invokeTool(
			unspecifiedTool.makeDto({ test: 2 }, { sessionId: sessionId + '2' }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'unspecified tool should require confirmation');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const unspecifiedResult = await unspecifiedPromise;
		assert.strictEqual(unspecifiedResult.content[0].value, 'unspecified');
	});

	test('eligibleForAutoApproval setting controls tool eligibility', async () => {
		// Test the new eligibleForAutoApproval setting
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'eligibleToolRef': true,
			'ineligibleToolRef': false
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool explicitly marked as eligible (using toolReferenceName) - no confirmation needed
		const eligibleTool = registerToolForTest(testService, store, 'eligibleTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'eligible tool ran' }] })
		}, {
			toolReferenceName: 'eligibleToolRef'
		});

		const sessionId = 'test-eligible';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Eligible tool should not get default confirmation messages injected
		const eligibleResult = await testService.invokeTool(
			eligibleTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(eligibleResult.content[0].value, 'eligible tool ran');

		// Tool explicitly marked as ineligible (using toolReferenceName) - must require confirmation
		const ineligibleTool = registerToolForTest(testService, store, 'ineligibleTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'ineligible requires confirmation' }] })
		}, {
			toolReferenceName: 'ineligibleToolRef'
		});

		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId + '2', { requestId: 'req2', capture });
		const ineligiblePromise = testService.invokeTool(
			ineligibleTool.makeDto({ test: 2 }, { sessionId: sessionId + '2' }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'ineligible tool should require confirmation');
		assert.ok(published?.confirmationMessages?.title, 'should have default confirmation title');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const ineligibleResult = await ineligiblePromise;
		assert.strictEqual(ineligibleResult.content[0].value, 'ineligible requires confirmation');

		// Tool not specified should default to eligible - no confirmation needed
		const unspecifiedTool = registerToolForTest(testService, store, 'unspecifiedTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'unspecified defaults to eligible' }] })
		}, {
			toolReferenceName: 'unspecifiedToolRef'
		});

		const unspecifiedResult = await testService.invokeTool(
			unspecifiedTool.makeDto({ test: 3 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(unspecifiedResult.content[0].value, 'unspecified defaults to eligible');
	});

	test('tool content formatting with alwaysDisplayInputOutput', async () => {
		// Test ensureToolDetails, formatToolInput, and toolResultToIO
		const toolData: IToolData = {
			id: 'formatTool',
			modelDescription: 'Format Test Tool',
			displayName: 'Format Test Tool',
			source: ToolDataSource.Internal,
			alwaysDisplayInputOutput: true
		};

		const tool = registerToolForTest(service, store, toolData.id, {
			prepareToolInvocation: async () => ({}),
			invoke: async (invocation) => ({
				content: [
					{ kind: 'text', value: 'Text result' },
					{ kind: 'data', value: { data: VSBuffer.fromByteArray([1, 2, 3]), mimeType: 'application/octet-stream' } }
				]
			})
		}, toolData);

		const input = { a: 1, b: 'test', c: [1, 2, 3] };
		const result = await service.invokeTool(
			tool.makeDto(input),
			async () => 0,
			CancellationToken.None
		);

		// Should have tool result details because alwaysDisplayInputOutput = true
		assert.ok(result.toolResultDetails, 'should have toolResultDetails');
		const details = result.toolResultDetails;
		assert.ok(isToolResultInputOutputDetails(details));

		// Test formatToolInput - should be formatted JSON
		const expectedInputJson = JSON.stringify(input, undefined, 2);
		assert.strictEqual(details.input, expectedInputJson, 'input should be formatted JSON');

		// Test toolResultToIO - should convert different content types
		assert.strictEqual(details.output.length, 2, 'should have 2 output items');

		// Text content
		const textOutput = details.output[0];
		assert.strictEqual(textOutput.type, 'embed');
		assert.strictEqual(textOutput.isText, true);
		assert.strictEqual(textOutput.value, 'Text result');

		// Data content (base64 encoded)
		const dataOutput = details.output[1];
		assert.strictEqual(dataOutput.type, 'embed');
		assert.strictEqual(dataOutput.mimeType, 'application/octet-stream');
		assert.strictEqual(dataOutput.value, 'AQID'); // base64 of [1,2,3]
	});

	test('tool error handling and telemetry', async () => {
		const testTelemetryService = new TestTelemetryService();

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(configurationService)),
			configurationService: () => configurationService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ITelemetryService, testTelemetryService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Test successful invocation telemetry
		const successTool = registerToolForTest(testService, store, 'successTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'success' }] })
		});

		const sessionId = 'telemetry-test';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		await testService.invokeTool(
			successTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);

		// Check success telemetry
		const successEvents = testTelemetryService.events.filter(e => e.eventName === 'languageModelToolInvoked');
		assert.strictEqual(successEvents.length, 1, 'should have success telemetry event');
		assert.strictEqual(successEvents[0].data.result, 'success');
		assert.strictEqual(successEvents[0].data.toolId, 'successTool');
		assert.strictEqual(successEvents[0].data.chatSessionId, sessionId);

		testTelemetryService.reset();

		// Test error telemetry
		const errorTool = registerToolForTest(testService, store, 'errorTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => { throw new Error('Tool error'); }
		});

		stubGetSession(chatService, sessionId + '2', { requestId: 'req2' });

		try {
			await testService.invokeTool(
				errorTool.makeDto({ test: 2 }, { sessionId: sessionId + '2' }),
				async () => 0,
				CancellationToken.None
			);
			assert.fail('Should have thrown');
		} catch (err) {
			// Expected
		}

		// Check error telemetry
		const errorEvents = testTelemetryService.events.filter(e => e.eventName === 'languageModelToolInvoked');
		assert.strictEqual(errorEvents.length, 1, 'should have error telemetry event');
		assert.strictEqual(errorEvents[0].data.result, 'error');
		assert.strictEqual(errorEvents[0].data.toolId, 'errorTool');
	});

	test('call tracking and cleanup', async () => {
		// Test that cancelToolCallsForRequest method exists and can be called
		// (The detailed cancellation behavior is already tested in "cancel tool call" test)
		const sessionId = 'tracking-session';
		const requestId = 'tracking-request';
		stubGetSession(chatService, sessionId, { requestId });

		// Just verify the method exists and doesn't throw
		assert.doesNotThrow(() => {
			service.cancelToolCallsForRequest(requestId);
		}, 'cancelToolCallsForRequest should not throw');

		// Verify calling with non-existent request ID doesn't throw
		assert.doesNotThrow(() => {
			service.cancelToolCallsForRequest('non-existent-request');
		}, 'cancelToolCallsForRequest with non-existent ID should not throw');
	});

	test('accessibility signal with different settings combinations', async () => {
		const testAccessibilitySignalService = new TestAccessibilitySignalService();

		// Test case 1: Sound enabled, announcement disabled, screen reader off
		const testConfigService1 = new TestConfigurationService();
		testConfigService1.setUserConfiguration('chat.tools.global.autoApprove', false);
		testConfigService1.setUserConfiguration('accessibility.signals.chatUserActionRequired', { sound: 'on', announcement: 'off' });

		const testAccessibilityService1 = new class extends TestAccessibilityService {
			override isScreenReaderOptimized(): boolean { return false; }
		}();

		const instaService1 = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService1)),
			configurationService: () => testConfigService1
		}, store);
		instaService1.stub(IChatService, chatService);
		instaService1.stub(IAccessibilityService, testAccessibilityService1);
		instaService1.stub(IAccessibilitySignalService, testAccessibilitySignalService as unknown as IAccessibilitySignalService);
		instaService1.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService1 = store.add(instaService1.createInstance(LanguageModelToolsService));

		const tool1 = registerToolForTest(testService1, store, 'soundOnlyTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Sound Test', message: 'Testing sound only' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'executed' }] })
		});

		const sessionId1 = 'sound-test';
		const capture1: { invocation?: any } = {};
		stubGetSession(chatService, sessionId1, { requestId: 'req1', capture: capture1 });

		const promise1 = testService1.invokeTool(tool1.makeDto({ test: 1 }, { sessionId: sessionId1 }), async () => 0, CancellationToken.None);
		const published1 = await waitForPublishedInvocation(capture1);

		// Signal should be played (sound=on, no screen reader requirement)
		assert.strictEqual(testAccessibilitySignalService.signalPlayedCalls.length, 1, 'sound should be played when sound=on');
		const call1 = testAccessibilitySignalService.signalPlayedCalls[0];
		assert.strictEqual(call1.options?.modality, undefined, 'should use default modality for sound');

		IChatToolInvocation.confirmWith(published1, { type: ToolConfirmKind.UserAction });
		await promise1;

		testAccessibilitySignalService.reset();

		// Test case 2: Sound auto, announcement auto, screen reader on
		const testConfigService2 = new TestConfigurationService();
		testConfigService2.setUserConfiguration('chat.tools.global.autoApprove', false);
		testConfigService2.setUserConfiguration('accessibility.signals.chatUserActionRequired', { sound: 'auto', announcement: 'auto' });

		const testAccessibilityService2 = new class extends TestAccessibilityService {
			override isScreenReaderOptimized(): boolean { return true; }
		}();

		const instaService2 = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService2)),
			configurationService: () => testConfigService2
		}, store);
		instaService2.stub(IChatService, chatService);
		instaService2.stub(IAccessibilityService, testAccessibilityService2);
		instaService2.stub(IAccessibilitySignalService, testAccessibilitySignalService as unknown as IAccessibilitySignalService);
		instaService2.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService2 = store.add(instaService2.createInstance(LanguageModelToolsService));

		const tool2 = registerToolForTest(testService2, store, 'autoScreenReaderTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Auto Test', message: 'Testing auto with screen reader' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'executed' }] })
		});

		const sessionId2 = 'auto-sr-test';
		const capture2: { invocation?: any } = {};
		stubGetSession(chatService, sessionId2, { requestId: 'req2', capture: capture2 });

		const promise2 = testService2.invokeTool(tool2.makeDto({ test: 2 }, { sessionId: sessionId2 }), async () => 0, CancellationToken.None);
		const published2 = await waitForPublishedInvocation(capture2);

		// Signal should be played (both sound and announcement enabled for screen reader)
		assert.strictEqual(testAccessibilitySignalService.signalPlayedCalls.length, 1, 'signal should be played with screen reader optimization');
		const call2 = testAccessibilitySignalService.signalPlayedCalls[0];
		assert.ok(call2.options?.customAlertMessage, 'should have custom alert message');
		assert.strictEqual(call2.options?.userGesture, true, 'should mark as user gesture');

		IChatToolInvocation.confirmWith(published2, { type: ToolConfirmKind.UserAction });
		await promise2;

		testAccessibilitySignalService.reset();

		// Test case 3: Sound off, announcement off - no signal
		const testConfigService3 = new TestConfigurationService();
		testConfigService3.setUserConfiguration('chat.tools.global.autoApprove', false);
		testConfigService3.setUserConfiguration('accessibility.signals.chatUserActionRequired', { sound: 'off', announcement: 'off' });

		const testAccessibilityService3 = new class extends TestAccessibilityService {
			override isScreenReaderOptimized(): boolean { return true; }
		}();

		const instaService3 = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService3)),
			configurationService: () => testConfigService3
		}, store);
		instaService3.stub(IChatService, chatService);
		instaService3.stub(IAccessibilityService, testAccessibilityService3);
		instaService3.stub(IAccessibilitySignalService, testAccessibilitySignalService as unknown as IAccessibilitySignalService);
		instaService3.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService3 = store.add(instaService3.createInstance(LanguageModelToolsService));

		const tool3 = registerToolForTest(testService3, store, 'offTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Off Test', message: 'Testing off settings' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'executed' }] })
		});

		const sessionId3 = 'off-test';
		const capture3: { invocation?: any } = {};
		stubGetSession(chatService, sessionId3, { requestId: 'req3', capture: capture3 });

		const promise3 = testService3.invokeTool(tool3.makeDto({ test: 3 }, { sessionId: sessionId3 }), async () => 0, CancellationToken.None);
		const published3 = await waitForPublishedInvocation(capture3);

		// No signal should be played
		assert.strictEqual(testAccessibilitySignalService.signalPlayedCalls.length, 0, 'no signal should be played when both sound and announcement are off');

		IChatToolInvocation.confirmWith(published3, { type: ToolConfirmKind.UserAction });
		await promise3;
	});

	test('createToolSet and getToolSet', () => {
		const toolSet = store.add(service.createToolSet(
			ToolDataSource.Internal,
			'testToolSetId',
			'testToolSetName',
			{ icon: undefined, description: 'Test tool set' }
		));

		// Should be able to retrieve by ID
		const retrieved = service.getToolSet('testToolSetId');
		assert.ok(retrieved);
		assert.strictEqual(retrieved.id, 'testToolSetId');
		assert.strictEqual(retrieved.referenceName, 'testToolSetName');

		// Should not find non-existent tool set
		assert.strictEqual(service.getToolSet('nonExistentId'), undefined);

		// Dispose should remove it
		toolSet.dispose();
		assert.strictEqual(service.getToolSet('testToolSetId'), undefined);
	});

	test('getToolSetByName', () => {
		store.add(service.createToolSet(
			ToolDataSource.Internal,
			'toolSet1',
			'refName1'
		));

		store.add(service.createToolSet(
			ToolDataSource.Internal,
			'toolSet2',
			'refName2'
		));

		// Should find by reference name
		assert.strictEqual(service.getToolSetByName('refName1')?.id, 'toolSet1');
		assert.strictEqual(service.getToolSetByName('refName2')?.id, 'toolSet2');

		// Should not find non-existent name
		assert.strictEqual(service.getToolSetByName('nonExistentName'), undefined);
	});

	test('getTools with includeDisabled parameter', () => {
		// Test the includeDisabled parameter behavior with context keys
		contextKeyService.createKey('testKey', false);
		const disabledTool: IToolData = {
			id: 'disabledTool',
			modelDescription: 'Disabled Tool',
			displayName: 'Disabled Tool',
			source: ToolDataSource.Internal,
			when: ContextKeyEqualsExpr.create('testKey', true), // Will be disabled since testKey is false
		};

		const enabledTool: IToolData = {
			id: 'enabledTool',
			modelDescription: 'Enabled Tool',
			displayName: 'Enabled Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(disabledTool));
		store.add(service.registerToolData(enabledTool));

		const enabledTools = Array.from(service.getTools());
		assert.strictEqual(enabledTools.length, 1, 'Should only return enabled tools');
		assert.strictEqual(enabledTools[0].id, 'enabledTool');

		const allTools = Array.from(service.getTools(true));
		assert.strictEqual(allTools.length, 2, 'includeDisabled should return all tools');
	});

	test('tool registration duplicate error', () => {
		const toolData: IToolData = {
			id: 'duplicateTool',
			modelDescription: 'Duplicate Tool',
			displayName: 'Duplicate Tool',
			source: ToolDataSource.Internal,
		};

		// First registration should succeed
		store.add(service.registerToolData(toolData));

		// Second registration should throw
		assert.throws(() => {
			service.registerToolData(toolData);
		}, /Tool "duplicateTool" is already registered/);
	});

	test('tool implementation registration without data throws', () => {
		const toolImpl: IToolImpl = {
			invoke: async () => ({ content: [] }),
		};

		// Should throw when registering implementation for non-existent tool
		assert.throws(() => {
			service.registerToolImplementation('nonExistentTool', toolImpl);
		}, /Tool "nonExistentTool" was not contributed/);
	});

	test('tool implementation duplicate registration throws', () => {
		const toolData: IToolData = {
			id: 'testTool',
			modelDescription: 'Test Tool',
			displayName: 'Test Tool',
			source: ToolDataSource.Internal,
		};

		const toolImpl1: IToolImpl = {
			invoke: async () => ({ content: [] }),
		};

		const toolImpl2: IToolImpl = {
			invoke: async () => ({ content: [] }),
		};

		store.add(service.registerToolData(toolData));
		store.add(service.registerToolImplementation('testTool', toolImpl1));

		// Second implementation should throw
		assert.throws(() => {
			service.registerToolImplementation('testTool', toolImpl2);
		}, /Tool "testTool" already has an implementation/);
	});

	test('invokeTool with unknown tool throws', async () => {
		const dto: IToolInvocation = {
			callId: '1',
			toolId: 'unknownTool',
			tokenBudget: 100,
			parameters: {},
			context: undefined,
		};

		await assert.rejects(
			service.invokeTool(dto, async () => 0, CancellationToken.None),
			/Tool unknownTool was not contributed/
		);
	});

	test('invokeTool without implementation activates extension and throws if still not found', async () => {
		const toolData: IToolData = {
			id: 'extensionActivationTool',
			modelDescription: 'Extension Tool',
			displayName: 'Extension Tool',
			source: ToolDataSource.Internal,
		};

		store.add(service.registerToolData(toolData));

		const dto: IToolInvocation = {
			callId: '1',
			toolId: 'extensionActivationTool',
			tokenBudget: 100,
			parameters: {},
			context: undefined,
		};

		// Should throw after attempting extension activation
		await assert.rejects(
			service.invokeTool(dto, async () => 0, CancellationToken.None),
			/Tool extensionActivationTool does not have an implementation registered/
		);
	});

	test('invokeTool without context (non-chat scenario)', async () => {
		const tool = registerToolForTest(service, store, 'nonChatTool', {
			invoke: async (invocation) => {
				assert.strictEqual(invocation.context, undefined);
				return { content: [{ kind: 'text', value: 'non-chat result' }] };
			}
		});

		const dto = tool.makeDto({ test: 1 }); // No context

		const result = await service.invokeTool(dto, async () => 0, CancellationToken.None);
		assert.strictEqual(result.content[0].value, 'non-chat result');
	});

	test('invokeTool with unknown chat session throws', async () => {
		const tool = registerToolForTest(service, store, 'unknownSessionTool', {
			invoke: async () => ({ content: [{ kind: 'text', value: 'should not reach' }] })
		});

		const dto = tool.makeDto({ test: 1 }, { sessionId: 'unknownSession' });

		// Test that it throws, regardless of exact error message
		let threwError = false;
		try {
			await service.invokeTool(dto, async () => 0, CancellationToken.None);
		} catch (err) {
			threwError = true;
			// Verify it's one of the expected error types
			assert.ok(
				err instanceof Error && (
					err.message.includes('Tool called for unknown chat session') ||
					err.message.includes('getRequests is not a function')
				),
				`Unexpected error: ${err.message}`
			);
		}
		assert.strictEqual(threwError, true, 'Should have thrown an error');
	});

	test('tool error with alwaysDisplayInputOutput includes details', async () => {
		const toolData: IToolData = {
			id: 'errorToolWithIO',
			modelDescription: 'Error Tool With IO',
			displayName: 'Error Tool With IO',
			source: ToolDataSource.Internal,
			alwaysDisplayInputOutput: true
		};

		const tool = registerToolForTest(service, store, toolData.id, {
			invoke: async () => { throw new Error('Tool execution failed'); }
		}, toolData);

		const input = { param: 'testValue' };

		try {
			await service.invokeTool(
				tool.makeDto(input),
				async () => 0,
				CancellationToken.None
			);
			assert.fail('Should have thrown');
		} catch (err: any) {
			// The error should bubble up, but we need to check if toolResultError is set
			// This tests the internal error handling path
			assert.strictEqual(err.message, 'Tool execution failed');
		}
	});

	test('context key changes trigger tool updates', async () => {
		let changeEventFired = false;
		const disposable = service.onDidChangeTools(() => {
			changeEventFired = true;
		});
		store.add(disposable);

		// Create a tool with a context key dependency
		contextKeyService.createKey('dynamicKey', false);
		const toolData: IToolData = {
			id: 'contextTool',
			modelDescription: 'Context Tool',
			displayName: 'Context Tool',
			source: ToolDataSource.Internal,
			when: ContextKeyEqualsExpr.create('dynamicKey', true),
		};

		store.add(service.registerToolData(toolData));

		// Change the context key value
		contextKeyService.createKey('dynamicKey', true);

		// Wait a bit for the scheduler
		await new Promise(resolve => setTimeout(resolve, 800));

		assert.strictEqual(changeEventFired, true, 'onDidChangeTools should fire when context keys change');
	});

	test('configuration changes trigger tool updates', async () => {
		return runWithFakedTimers({}, async () => {
			let changeEventFired = false;
			const disposable = service.onDidChangeTools(() => {
				changeEventFired = true;
			});
			store.add(disposable);

			// Change the correct configuration key
			configurationService.setUserConfiguration('chat.extensionTools.enabled', false);
			// Fire the configuration change event manually
			configurationService.onDidChangeConfigurationEmitter.fire({
				affectsConfiguration: () => true,
				affectedKeys: new Set(['chat.extensionTools.enabled']),
				change: null!,
				source: ConfigurationTarget.USER
			} satisfies IConfigurationChangeEvent);

			// Wait a bit for the scheduler
			await new Promise(resolve => setTimeout(resolve, 800));

			assert.strictEqual(changeEventFired, true, 'onDidChangeTools should fire when configuration changes');
		});
	});

	test('toToolAndToolSetEnablementMap with MCP toolset enables contained tools', () => {
		// Create MCP toolset
		const mcpToolSet = store.add(service.createToolSet(
			{ type: 'mcp', label: 'testServer', serverLabel: 'testServer', instructions: undefined, collectionId: 'testCollection', definitionId: 'testDef' },
			'mcpSet',
			'mcpSetRef'
		));

		const mcpTool: IToolData = {
			id: 'mcpTool',
			modelDescription: 'MCP Tool',
			displayName: 'MCP Tool',
			source: { type: 'mcp', label: 'testServer', serverLabel: 'testServer', instructions: undefined, collectionId: 'testCollection', definitionId: 'testDef' },
			canBeReferencedInPrompt: true,
			toolReferenceName: 'mcpToolRef'
		};

		store.add(service.registerToolData(mcpTool));
		store.add(mcpToolSet.addTool(mcpTool));

		// Enable the MCP toolset
		{
			const enabledNames = [mcpToolSet].map(t => service.getFullReferenceName(t));
			const result = service.toToolAndToolSetEnablementMap(enabledNames, undefined);

			assert.strictEqual(result.get(mcpToolSet), true, 'MCP toolset should be enabled'); // Ensure the toolset is in the map
			assert.strictEqual(result.get(mcpTool), true, 'MCP tool should be enabled when its toolset is enabled'); // Ensure the tool is in the map

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames.sort(), enabledNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}
		// Enable a tool from the MCP toolset
		{
			const enabledNames = [mcpTool].map(t => service.getFullReferenceName(t, mcpToolSet));
			const result = service.toToolAndToolSetEnablementMap(enabledNames, undefined);

			assert.strictEqual(result.get(mcpToolSet), false, 'MCP toolset should be disabled'); // Ensure the toolset is in the map
			assert.strictEqual(result.get(mcpTool), true, 'MCP tool should be enabled'); // Ensure the tool is in the map

			const fullReferenceNames = service.toFullReferenceNames(result);
			assert.deepStrictEqual(fullReferenceNames.sort(), enabledNames.sort(), 'toFullReferenceNames should return the original enabled names');
		}

	});

	test('shouldAutoConfirm with workspace-specific tool configuration', async () => {
		const testConfigService = new TestConfigurationService();
		// Configure per-tool settings at different scopes
		testConfigService.setUserConfiguration('chat.tools.global.autoApprove', { 'workspaceTool': true });

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		const workspaceTool = registerToolForTest(testService, store, 'workspaceTool', {
			prepareToolInvocation: async () => ({ confirmationMessages: { title: 'Test', message: 'Workspace tool' } }),
			invoke: async () => ({ content: [{ kind: 'text', value: 'workspace result' }] })
		}, { runsInWorkspace: true });

		const sessionId = 'workspace-test';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Should auto-approve based on user configuration
		const result = await testService.invokeTool(
			workspaceTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result.content[0].value, 'workspace result');
	});

	test('getFullReferenceNames', () => {
		setupToolsForTest(service, store);

		const fullReferenceNames = Array.from(service.getFullReferenceNames()).sort();

		const expectedNames = [
			'tool1RefName',
			'Tool2 Display Name',
			'my.extension/extTool1RefName',
			'mcpToolSetRefName/*',
			'mcpToolSetRefName/mcpTool1RefName',
			'internalToolSetRefName',
			'internalToolSetRefName/internalToolSetTool1RefName',
			'vscode',
			'execute',
			'read'
		].sort();

		assert.deepStrictEqual(fullReferenceNames, expectedNames, 'getFullReferenceNames should return correct full reference names');
	});

	test('getDeprecatedFullReferenceNames', () => {
		setupToolsForTest(service, store);

		const deprecatedNames = service.getDeprecatedFullReferenceNames();

		// Tools in internal tool sets should have their full reference names with toolset prefix, tools sets keep their name
		assert.deepStrictEqual(deprecatedNames.get('internalToolSetTool1RefName'), new Set(['internalToolSetRefName/internalToolSetTool1RefName']));
		assert.strictEqual(deprecatedNames.get('internalToolSetRefName'), undefined);

		// For extension tools, the full reference name includes the extension ID
		assert.deepStrictEqual(deprecatedNames.get('extTool1RefName'), new Set(['my.extension/extTool1RefName']));

		// For MCP tool sets, the full reference name includes the /* suffix
		assert.deepStrictEqual(deprecatedNames.get('mcpToolSetRefName'), new Set(['mcpToolSetRefName/*']));
		assert.deepStrictEqual(deprecatedNames.get('mcpTool1RefName'), new Set(['mcpToolSetRefName/mcpTool1RefName']));

		// Internal tool sets and user tools sets and tools without namespace changes should not appear
		assert.strictEqual(deprecatedNames.get('Tool2 Display Name'), undefined);
		assert.strictEqual(deprecatedNames.get('tool1RefName'), undefined);
		assert.strictEqual(deprecatedNames.get('userToolSetRefName'), undefined);
	});

	test('getToolByFullReferenceName', () => {
		setupToolsForTest(service, store);

		// Test finding tools by their full reference names
		const tool1 = service.getToolByFullReferenceName('tool1RefName');
		assert.ok(tool1);
		assert.strictEqual(tool1.id, 'tool1');

		const tool2 = service.getToolByFullReferenceName('Tool2 Display Name');
		assert.ok(tool2);
		assert.strictEqual(tool2.id, 'tool2');

		const extTool = service.getToolByFullReferenceName('my.extension/extTool1RefName');
		assert.ok(extTool);
		assert.strictEqual(extTool.id, 'extTool1');

		const mcpTool = service.getToolByFullReferenceName('mcpToolSetRefName/mcpTool1RefName');
		assert.ok(mcpTool);
		assert.strictEqual(mcpTool.id, 'mcpTool1');


		const mcpToolSet = service.getToolByFullReferenceName('mcpToolSetRefName/*');
		assert.ok(mcpToolSet);
		assert.strictEqual(mcpToolSet.id, 'mcpToolSet');

		const internalToolSet = service.getToolByFullReferenceName('internalToolSetRefName/internalToolSetTool1RefName');
		assert.ok(internalToolSet);
		assert.strictEqual(internalToolSet.id, 'internalToolSetTool1');

		// Test finding tools within tool sets
		const toolInSet = service.getToolByFullReferenceName('internalToolSetRefName');
		assert.ok(toolInSet);
		assert.strictEqual(toolInSet!.id, 'internalToolSet');

	});

	test('eligibleForAutoApproval setting can be configured via policy', async () => {
		// Test that policy configuration works for eligibleForAutoApproval
		// Policy values should be JSON strings for object-type settings
		const testConfigService = new TestConfigurationService();

		// Simulate policy configuration (would come from policy file)
		const policyValue = {
			'toolA': true,
			'toolB': false
		};
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, policyValue);

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool A is eligible (true in policy)
		const toolA = registerToolForTest(testService, store, 'toolA', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'toolA executed' }] })
		}, {
			toolReferenceName: 'toolA'
		});

		// Tool B is ineligible (false in policy)
		const toolB = registerToolForTest(testService, store, 'toolB', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'toolB executed' }] })
		}, {
			toolReferenceName: 'toolB'
		});

		const sessionId = 'test-policy';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool A should execute without confirmation (eligible)
		const resultA = await testService.invokeTool(
			toolA.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(resultA.content[0].value, 'toolA executed');

		// Tool B should require confirmation (ineligible)
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId + '2', { requestId: 'req2', capture });
		const promiseB = testService.invokeTool(
			toolB.makeDto({ test: 2 }, { sessionId: sessionId + '2' }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'toolB should require confirmation due to policy');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const resultB = await promiseB;
		assert.strictEqual(resultB.content[0].value, 'toolB executed');
	});

	test('eligibleForAutoApproval with legacy tool reference names - eligible', async () => {
		// Test backwards compatibility: configuring a legacy name as eligible should work
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'oldToolName': true  // Using legacy name
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool has been renamed but has legacy name
		const renamedTool = registerToolForTest(testService, store, 'renamedTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'tool executed via legacy name' }] })
		}, {
			toolReferenceName: 'newToolName',
			legacyToolReferenceFullNames: ['oldToolName']
		});

		const sessionId = 'test-legacy-eligible';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool should be eligible even though we configured the legacy name
		const result = await testService.invokeTool(
			renamedTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result.content[0].value, 'tool executed via legacy name');
	});

	test('eligibleForAutoApproval with legacy tool reference names - ineligible', async () => {
		// Test backwards compatibility: configuring a legacy name as ineligible should work
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'deprecatedToolName': false  // Using legacy name
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool has been renamed but has legacy name
		const renamedTool = registerToolForTest(testService, store, 'renamedTool2', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'tool requires confirmation' }] })
		}, {
			toolReferenceName: 'modernToolName',
			legacyToolReferenceFullNames: ['deprecatedToolName']
		});

		const sessionId = 'test-legacy-ineligible';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1', capture });

		// Tool should be ineligible and require confirmation
		const promise = testService.invokeTool(
			renamedTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'tool should require confirmation when legacy name is ineligible');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'tool requires confirmation');
	});

	test('eligibleForAutoApproval with multiple legacy names', async () => {
		// Test that any of the legacy names can be used in the configuration
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'secondLegacyName': true  // Using the second legacy name
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool has multiple legacy names
		const multiLegacyTool = registerToolForTest(testService, store, 'multiLegacyTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'multi legacy executed' }] })
		}, {
			toolReferenceName: 'currentToolName',
			legacyToolReferenceFullNames: ['firstLegacyName', 'secondLegacyName', 'thirdLegacyName']
		});

		const sessionId = 'test-multi-legacy';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool should be eligible via second legacy name
		const result = await testService.invokeTool(
			multiLegacyTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result.content[0].value, 'multi legacy executed');
	});

	test('eligibleForAutoApproval current name takes precedence over legacy names', async () => {
		// Test forward compatibility: current name in config should take precedence
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'currentName': false,      // Current name says ineligible
			'oldName': true           // Legacy name says eligible
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		const tool = registerToolForTest(testService, store, 'precedenceTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'precedence test' }] })
		}, {
			toolReferenceName: 'currentName',
			legacyToolReferenceFullNames: ['oldName']
		});

		const sessionId = 'test-precedence';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1', capture });

		// Current name should take precedence, so tool should be ineligible
		const promise = testService.invokeTool(
			tool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'current name should take precedence over legacy name');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'precedence test');
	});

	test('eligibleForAutoApproval with legacy full reference names from toolsets', async () => {
		// Test legacy names that include toolset prefixes (e.g., 'oldToolSet/oldToolName')
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'oldToolSet/oldToolName': false  // Legacy full reference name from old toolset
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool was in an old toolset but now standalone
		const migratedTool = registerToolForTest(testService, store, 'migratedTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'migrated tool' }] })
		}, {
			toolReferenceName: 'standaloneToolName',
			legacyToolReferenceFullNames: ['oldToolSet/oldToolName']
		});

		const sessionId = 'test-fullReferenceName-legacy';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1', capture });

		// Tool should be ineligible based on legacy full reference name
		const promise = testService.invokeTool(
			migratedTool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'tool should be ineligible via legacy full reference name');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'migrated tool');
	});

	test('eligibleForAutoApproval mixed current and legacy names', async () => {
		// Test realistic migration scenario with mixed current and legacy names
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'modernTool': true,           // Current name
			'legacyToolOld': false,      // Legacy name
			'unchangedTool': true        // Tool that never changed
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Modern tool with current name
		const tool1 = registerToolForTest(testService, store, 'tool1', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'modern executed' }] })
		}, {
			toolReferenceName: 'modernTool'
		});

		// Renamed tool with legacy name
		const tool2 = registerToolForTest(testService, store, 'tool2', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'legacy needs confirmation' }] })
		}, {
			toolReferenceName: 'legacyToolNew',
			legacyToolReferenceFullNames: ['legacyToolOld']
		});

		// Unchanged tool
		const tool3 = registerToolForTest(testService, store, 'tool3', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'unchanged executed' }] })
		}, {
			toolReferenceName: 'unchangedTool'
		});

		const sessionId = 'test-mixed';
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool 1 should be eligible (current name)
		const result1 = await testService.invokeTool(
			tool1.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result1.content[0].value, 'modern executed');

		// Tool 2 should be ineligible (legacy name)
		const capture2: { invocation?: any } = {};
		stubGetSession(chatService, sessionId + '2', { requestId: 'req2', capture: capture2 });
		const promise2 = testService.invokeTool(
			tool2.makeDto({ test: 2 }, { sessionId: sessionId + '2' }),
			async () => 0,
			CancellationToken.None
		);
		const published2 = await waitForPublishedInvocation(capture2);
		assert.ok(published2?.confirmationMessages, 'tool2 should require confirmation via legacy name');

		IChatToolInvocation.confirmWith(published2, { type: ToolConfirmKind.UserAction });
		const result2 = await promise2;
		assert.strictEqual(result2.content[0].value, 'legacy needs confirmation');

		// Tool 3 should be eligible (unchanged)
		const result3 = await testService.invokeTool(
			tool3.makeDto({ test: 3 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		assert.strictEqual(result3.content[0].value, 'unchanged executed');
	});

	test('eligibleForAutoApproval with namespaced legacy names - full tool name eligible', async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'gitTools/gitCommit': true
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		const tool = registerToolForTest(testService, store, 'gitCommitTool', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'commit executed' }] })
		}, {
			toolReferenceName: 'commit',
			legacyToolReferenceFullNames: ['gitTools/gitCommit']
		});

		const sessionId = 'test-extension-prefix';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool should be eligible via legacy extension-prefixed name
		const result = await testService.invokeTool(
			tool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);

		const published = await waitForPublishedInvocation(capture);
		assert.strictEqual(published, undefined, 'tool should not require confirmation when legacy trimmed name is eligible');
		assert.strictEqual(result.content[0].value, 'commit executed');
	});

	test('eligibleForAutoApproval with namespaced and renamed toolname - just last segment eligible', async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'gitCommit': true
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool that was previously namespaced under extension but is now internal
		const tool = registerToolForTest(testService, store, 'gitCommitTool2', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'commit executed' }] })
		}, {
			toolReferenceName: 'commit',
			legacyToolReferenceFullNames: ['gitTools/gitCommit']
		});

		const sessionId = 'test-renamed-prefix';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1' });

		// Tool should be eligible via legacy extension-prefixed name
		const result = await testService.invokeTool(
			tool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);

		const published = await waitForPublishedInvocation(capture);
		assert.strictEqual(published, undefined, 'tool should not require confirmation when legacy trimmed name is eligible');
		assert.strictEqual(result.content[0].value, 'commit executed');
	});

	test('eligibleForAutoApproval with namespaced legacy names - full tool name ineligible', async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'gitTools/gitCommit': false
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool that was previously namespaced under extension but is now internal
		const tool = registerToolForTest(testService, store, 'gitCommitTool3', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'commit blocked' }] })
		}, {
			toolReferenceName: 'commit',
			legacyToolReferenceFullNames: ['something/random', 'gitTools/bar', 'gitTools/gitCommit']
		});

		const sessionId = 'test-extension-prefix-blocked';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1', capture });

		// Tool should be ineligible via legacy extension-prefixed name
		const promise = testService.invokeTool(
			tool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'tool should require confirmation when legacy full name is ineligible');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'commit blocked');
	});

	test('eligibleForAutoApproval with namespaced and renamed toolname - just last segment ineligible', async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.EligibleForAutoApproval, {
			'gitCommit': false
		});

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, store);
		instaService.stub(IChatService, chatService);
		instaService.stub(ILanguageModelToolsConfirmationService, new MockLanguageModelToolsConfirmationService());
		const testService = store.add(instaService.createInstance(LanguageModelToolsService));

		// Tool that was previously namespaced under extension but is now internal
		const tool = registerToolForTest(testService, store, 'gitCommitTool4', {
			prepareToolInvocation: async () => ({}),
			invoke: async () => ({ content: [{ kind: 'text', value: 'commit blocked' }] })
		}, {
			toolReferenceName: 'commit',
			legacyToolReferenceFullNames: ['something/random', 'gitTools/bar', 'gitTools/gitCommit']
		});

		const sessionId = 'test-renamed-prefix-blocked';
		const capture: { invocation?: any } = {};
		stubGetSession(chatService, sessionId, { requestId: 'req1', capture });

		// Tool should be ineligible via trimmed legacy name
		const promise = testService.invokeTool(
			tool.makeDto({ test: 1 }, { sessionId }),
			async () => 0,
			CancellationToken.None
		);
		const published = await waitForPublishedInvocation(capture);
		assert.ok(published?.confirmationMessages, 'tool should require confirmation when legacy trimmed name is ineligible');
		assert.strictEqual(published?.confirmationMessages?.allowAutoConfirm, false, 'should not allow auto confirm');

		IChatToolInvocation.confirmWith(published, { type: ToolConfirmKind.UserAction });
		const result = await promise;
		assert.strictEqual(result.content[0].value, 'commit blocked');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/localAgentSessionsProvider.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/localAgentSessionsProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { LocalAgentsSessionsProvider } from '../../browser/agentSessions/localAgentSessionsProvider.js';
import { ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatModel, IChatRequestModel, IChatResponseModel } from '../../common/chatModel.js';
import { IChatDetail, IChatService, IChatSessionStartOptions, ResponseModelState } from '../../common/chatService.js';
import { ChatSessionStatus, IChatSessionsService, localChatSessionType } from '../../common/chatSessionsService.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { MockChatSessionsService } from '../common/mockChatSessionsService.js';

class MockChatService implements IChatService {
	private readonly _chatModels: ISettableObservable<Iterable<IChatModel>> = observableValue('chatModels', []);
	readonly chatModels = this._chatModels;
	requestInProgressObs = observableValue('name', false);
	edits2Enabled: boolean = false;
	_serviceBrand: undefined;
	editingSessions = [];
	transferredSessionData = undefined;
	readonly onDidSubmitRequest = Event.None;

	private sessions = new Map<string, IChatModel>();
	private liveSessionItems: IChatDetail[] = [];
	private historySessionItems: IChatDetail[] = [];

	private readonly _onDidDisposeSession = new Emitter<{ sessionResource: URI[]; reason: 'cleared' }>();
	readonly onDidDisposeSession = this._onDidDisposeSession.event;

	fireDidDisposeSession(sessionResource: URI[]): void {
		this._onDidDisposeSession.fire({ sessionResource, reason: 'cleared' });
	}

	setSaveModelsEnabled(enabled: boolean): void {

	}

	setLiveSessionItems(items: IChatDetail[]): void {
		this.liveSessionItems = items;
	}

	setHistorySessionItems(items: IChatDetail[]): void {
		this.historySessionItems = items;
	}

	addSession(sessionResource: URI, session: IChatModel): void {
		this.sessions.set(sessionResource.toString(), session);
		// Update the chatModels observable
		this._chatModels.set([...this.sessions.values()], undefined);
	}

	removeSession(sessionResource: URI): void {
		this.sessions.delete(sessionResource.toString());
		// Update the chatModels observable
		this._chatModels.set([...this.sessions.values()], undefined);
	}

	isEnabled(_location: ChatAgentLocation): boolean {
		return true;
	}

	hasSessions(): boolean {
		return this.sessions.size > 0;
	}

	getProviderInfos() {
		return [];
	}

	startSession(_location: ChatAgentLocation, _options?: IChatSessionStartOptions): any {
		throw new Error('Method not implemented.');
	}

	getSession(sessionResource: URI): IChatModel | undefined {
		return this.sessions.get(sessionResource.toString());
	}

	getOrRestoreSession(_sessionResource: URI): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getPersistedSessionTitle(_sessionResource: URI): string | undefined {
		return undefined;
	}

	loadSessionFromContent(_data: any): any {
		throw new Error('Method not implemented.');
	}

	loadSessionForResource(_resource: URI, _position: ChatAgentLocation, _token: CancellationToken): Promise<any> {
		throw new Error('Method not implemented.');
	}

	getActiveSessionReference(_sessionResource: URI): any {
		return undefined;
	}

	setTitle(_sessionResource: URI, _title: string): void { }

	appendProgress(_request: IChatRequestModel, _progress: any): void { }

	sendRequest(_sessionResource: URI, _message: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	resendRequest(_request: IChatRequestModel, _options?: any): Promise<void> {
		throw new Error('Method not implemented.');
	}

	adoptRequest(_sessionResource: URI, _request: IChatRequestModel): Promise<void> {
		throw new Error('Method not implemented.');
	}

	removeRequest(_sessionResource: URI, _requestId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	cancelCurrentRequestForSession(_sessionResource: URI): void { }

	addCompleteRequest(): void { }

	async getLocalSessionHistory(): Promise<IChatDetail[]> {
		return this.historySessionItems;
	}

	async clearAllHistoryEntries(): Promise<void> { }

	async removeHistoryEntry(_resource: URI): Promise<void> { }

	readonly onDidPerformUserAction = Event.None;

	notifyUserAction(_event: any): void { }

	transferChatSession(): void { }

	setChatSessionTitle(): void { }

	isEditingLocation(_location: ChatAgentLocation): boolean {
		return false;
	}

	getChatStorageFolder(): URI {
		return URI.file('/tmp');
	}

	logChatIndex(): void { }

	isPersistedSessionEmpty(_sessionResource: URI): boolean {
		return false;
	}

	activateDefaultAgent(_location: ChatAgentLocation): Promise<void> {
		return Promise.resolve();
	}

	getChatSessionFromInternalUri(_sessionResource: URI): any {
		return undefined;
	}

	async getLiveSessionItems(): Promise<IChatDetail[]> {
		return this.liveSessionItems;
	}

	async getHistorySessionItems(): Promise<IChatDetail[]> {
		return this.historySessionItems;
	}

	waitForModelDisposals(): Promise<void> {
		return Promise.resolve();
	}

	getMetadataForSession(sessionResource: URI): Promise<IChatDetail | undefined> {
		throw new Error('Method not implemented.');
	}
}

function createMockChatModel(options: {
	sessionResource: URI;
	hasRequests?: boolean;
	requestInProgress?: boolean;
	timestamp?: number;
	lastResponseComplete?: boolean;
	lastResponseCanceled?: boolean;
	lastResponseHasError?: boolean;
	lastResponseTimestamp?: number;
	lastResponseCompletedAt?: number;
	customTitle?: string;
	editingSession?: {
		entries: Array<{
			state: ModifiedFileEntryState;
			linesAdded: number;
			linesRemoved: number;
			modifiedURI: URI;
		}>;
	};
}): IChatModel {
	const requests: IChatRequestModel[] = [];

	if (options.hasRequests !== false) {
		const mockResponse: Partial<IChatResponseModel> = {
			isComplete: options.lastResponseComplete ?? true,
			isCanceled: options.lastResponseCanceled ?? false,
			result: options.lastResponseHasError ? { errorDetails: { message: 'error' } } : undefined,
			timestamp: options.lastResponseTimestamp ?? Date.now(),
			completedAt: options.lastResponseCompletedAt,
			response: {
				value: [],
				getMarkdown: () => '',
				toString: () => options.customTitle ? '' : 'Test response content'
			}
		};

		requests.push({
			id: 'request-1',
			response: mockResponse as IChatResponseModel
		} as IChatRequestModel);
	}

	const editingSessionEntries = options.editingSession?.entries.map(entry => ({
		state: observableValue('state', entry.state),
		linesAdded: observableValue('linesAdded', entry.linesAdded),
		linesRemoved: observableValue('linesRemoved', entry.linesRemoved),
		modifiedURI: entry.modifiedURI
	}));

	const mockEditingSession = options.editingSession ? {
		entries: observableValue('entries', editingSessionEntries ?? [])
	} : undefined;

	const _onDidChange = new Emitter<{ kind: string } | undefined>();

	return {
		sessionResource: options.sessionResource,
		hasRequests: options.hasRequests !== false,
		timestamp: options.timestamp ?? Date.now(),
		requestInProgress: observableValue('requestInProgress', options.requestInProgress ?? false),
		getRequests: () => requests,
		onDidChange: _onDidChange.event,
		editingSession: mockEditingSession,
		setCustomTitle: (_title: string) => {
			_onDidChange.fire({ kind: 'setCustomTitle' });
		}
	} as unknown as IChatModel;
}

suite('LocalAgentsSessionsProvider', () => {
	const disposables = new DisposableStore();
	let mockChatService: MockChatService;
	let mockChatSessionsService: MockChatSessionsService;
	let instantiationService: TestInstantiationService;

	setup(() => {
		mockChatService = new MockChatService();
		mockChatSessionsService = new MockChatSessionsService();
		instantiationService = disposables.add(workbenchInstantiationService(undefined, disposables));
		instantiationService.stub(IChatService, mockChatService);
		instantiationService.stub(IChatSessionsService, mockChatSessionsService);
	});

	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createProvider(): LocalAgentsSessionsProvider {
		return disposables.add(instantiationService.createInstance(LocalAgentsSessionsProvider));
	}

	test('should have correct session type', () => {
		const provider = createProvider();
		assert.strictEqual(provider.chatSessionType, localChatSessionType);
	});

	test('should register itself with chat sessions service', () => {
		const provider = createProvider();

		const providers = mockChatSessionsService.getAllChatSessionItemProviders();
		assert.strictEqual(providers.length, 1);
		assert.strictEqual(providers[0], provider);
	});

	test('should provide empty sessions when no live or history sessions', async () => {
		return runWithFakedTimers({}, async () => {
			const provider = createProvider();

			mockChatService.setLiveSessionItems([]);
			mockChatService.setHistorySessionItems([]);

			const sessions = await provider.provideChatSessionItems(CancellationToken.None);
			assert.strictEqual(sessions.length, 0);
		});
	});

	test('should provide live session items', async () => {
		return runWithFakedTimers({}, async () => {
			const provider = createProvider();

			const sessionResource = LocalChatSessionUri.forSession('test-session');
			const mockModel = createMockChatModel({
				sessionResource,
				hasRequests: true,
				timestamp: Date.now()
			});

			mockChatService.addSession(sessionResource, mockModel);
			mockChatService.setLiveSessionItems([{
				sessionResource,
				title: 'Test Session',
				lastMessageDate: Date.now(),
				isActive: true,
				timing: { startTime: 0, endTime: 1 },
				lastResponseState: ResponseModelState.Complete
			}]);

			const sessions = await provider.provideChatSessionItems(CancellationToken.None);
			assert.strictEqual(sessions.length, 1);
			assert.strictEqual(sessions[0].label, 'Test Session');
			assert.strictEqual(sessions[0].resource.toString(), sessionResource.toString());
		});
	});

	test('should provide history session items', async () => {
		return runWithFakedTimers({}, async () => {
			const provider = createProvider();

			const sessionResource = LocalChatSessionUri.forSession('history-session');

			mockChatService.setLiveSessionItems([]);
			mockChatService.setHistorySessionItems([{
				sessionResource,
				title: 'History Session',
				lastMessageDate: Date.now() - 10000,
				isActive: false,
				lastResponseState: ResponseModelState.Complete,
				timing: { startTime: 0, endTime: 1 }
			}]);

			const sessions = await provider.provideChatSessionItems(CancellationToken.None);
			assert.strictEqual(sessions.length, 1);
			assert.strictEqual(sessions[0].label, 'History Session');
		});
	});

	test('should not duplicate sessions in history and live', async () => {
		return runWithFakedTimers({}, async () => {
			const provider = createProvider();

			const sessionResource = LocalChatSessionUri.forSession('duplicate-session');
			const mockModel = createMockChatModel({
				sessionResource,
				hasRequests: true
			});

			mockChatService.addSession(sessionResource, mockModel);
			mockChatService.setLiveSessionItems([{
				sessionResource,
				title: 'Live Session',
				lastMessageDate: Date.now(),
				isActive: true,
				lastResponseState: ResponseModelState.Complete,
				timing: { startTime: 0, endTime: 1 }
			}]);
			mockChatService.setHistorySessionItems([{
				sessionResource,
				title: 'History Session',
				lastMessageDate: Date.now() - 10000,
				isActive: false,
				lastResponseState: ResponseModelState.Complete,
				timing: { startTime: 0, endTime: 1 }
			}]);

			const sessions = await provider.provideChatSessionItems(CancellationToken.None);
			assert.strictEqual(sessions.length, 1);
			assert.strictEqual(sessions[0].label, 'Live Session');
		});
	});

	suite('Session Status', () => {
		test('should return InProgress status when request in progress', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('in-progress-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: true
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'In Progress Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].status, ChatSessionStatus.InProgress);
			});
		});

		test('should return Completed status when last response is complete', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('completed-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: false,
					lastResponseComplete: true,
					lastResponseCanceled: false,
					lastResponseHasError: false
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Completed Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 },
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].status, ChatSessionStatus.Completed);
			});
		});

		test('should return Success status when last response was canceled', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('canceled-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: false,
					lastResponseComplete: false,
					lastResponseCanceled: true
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Canceled Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 },
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].status, ChatSessionStatus.Completed);
			});
		});

		test('should return Failed status when last response has error', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('error-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: false,
					lastResponseComplete: true,
					lastResponseHasError: true
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Error Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 },
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].status, ChatSessionStatus.Failed);
			});
		});
	});

	suite('Session Statistics', () => {
		test('should return statistics for sessions with modified entries', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('stats-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					editingSession: {
						entries: [
							{
								state: ModifiedFileEntryState.Modified,
								linesAdded: 10,
								linesRemoved: 5,
								modifiedURI: URI.file('/test/file1.ts')
							},
							{
								state: ModifiedFileEntryState.Modified,
								linesAdded: 20,
								linesRemoved: 3,
								modifiedURI: URI.file('/test/file2.ts')
							}
						]
					}
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Stats Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 },
					stats: {
						added: 30,
						removed: 8,
						fileCount: 2
					}
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.ok(sessions[0].changes);
				const changes = sessions[0].changes as { files: number; insertions: number; deletions: number };
				assert.strictEqual(changes.files, 2);
				assert.strictEqual(changes.insertions, 30);
				assert.strictEqual(changes.deletions, 8);
			});
		});

		test('should not return statistics for sessions without modified entries', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('no-stats-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					editingSession: {
						entries: [
							{
								state: ModifiedFileEntryState.Accepted,
								linesAdded: 10,
								linesRemoved: 5,
								modifiedURI: URI.file('/test/file1.ts')
							}
						]
					}
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'No Stats Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].changes, undefined);
			});
		});
	});

	suite('Session Timing', () => {
		test('should use model timestamp for startTime when model exists', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('timing-session');
				const modelTimestamp = Date.now() - 5000;
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					timestamp: modelTimestamp
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Timing Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: modelTimestamp }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].timing.startTime, modelTimestamp);
			});
		});

		test('should use lastMessageDate for startTime when model does not exist', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('history-timing');
				const lastMessageDate = Date.now() - 10000;

				mockChatService.setLiveSessionItems([]);
				mockChatService.setHistorySessionItems([{
					sessionResource,
					title: 'History Timing Session',
					lastMessageDate,
					isActive: false,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: lastMessageDate }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].timing.startTime, lastMessageDate);
			});
		});

		test('should set endTime from last response completedAt', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('endtime-session');
				const completedAt = Date.now() - 1000;
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					lastResponseComplete: true,
					lastResponseCompletedAt: completedAt
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'EndTime Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: completedAt }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].timing.endTime, completedAt);
			});
		});
	});

	suite('Session Icon', () => {
		test('should use Codicon.chatSparkle as icon', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('icon-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true
				});

				mockChatService.addSession(sessionResource, mockModel);
				mockChatService.setLiveSessionItems([{
					sessionResource,
					title: 'Icon Session',
					lastMessageDate: Date.now(),
					isActive: true,
					lastResponseState: ResponseModelState.Complete,
					timing: { startTime: 0, endTime: 1 }
				}]);

				const sessions = await provider.provideChatSessionItems(CancellationToken.None);
				assert.strictEqual(sessions.length, 1);
				assert.strictEqual(sessions[0].iconPath, Codicon.chatSparkle);
			});
		});
	});

	suite('Events', () => {
		test('should fire onDidChangeChatSessionItems when model progress changes', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('progress-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: true
				});

				// Add the session first
				mockChatService.addSession(sessionResource, mockModel);

				let changeEventCount = 0;
				disposables.add(provider.onDidChangeChatSessionItems(() => {
					changeEventCount++;
				}));

				// Simulate progress change by triggering the progress listener
				mockChatSessionsService.triggerProgressEvent();

				assert.strictEqual(changeEventCount, 1);
			});
		});

		test('should fire onDidChangeChatSessionItems when model request status changes', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('status-change-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true,
					requestInProgress: false
				});

				// Add the session first
				mockChatService.addSession(sessionResource, mockModel);

				let changeEventCount = 0;
				disposables.add(provider.onDidChangeChatSessionItems(() => {
					changeEventCount++;
				}));

				// Simulate progress change by triggering the progress listener
				mockChatSessionsService.triggerProgressEvent();

				assert.strictEqual(changeEventCount, 1);
			});
		});

		test('should clean up model listeners when model is removed via chatModels observable', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				const sessionResource = LocalChatSessionUri.forSession('cleanup-session');
				const mockModel = createMockChatModel({
					sessionResource,
					hasRequests: true
				});

				// Add the session first
				mockChatService.addSession(sessionResource, mockModel);

				// Now remove the session - the observable should trigger cleanup
				mockChatService.removeSession(sessionResource);

				// Verify the listener was cleaned up by triggering a title change
				// The onDidChangeChatSessionItems from registerModelListeners cleanup should fire once
				// but after that, title changes should NOT fire onDidChangeChatSessionItems
				let changeEventCount = 0;
				disposables.add(provider.onDidChangeChatSessionItems(() => {
					changeEventCount++;
				}));

				(mockModel as unknown as { setCustomTitle: (title: string) => void }).setCustomTitle('New Title');

				assert.strictEqual(changeEventCount, 0, 'onDidChangeChatSessionItems should NOT fire after model is removed');
			});
		});

		test('should fire onDidChange when session items change for local type', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				let changeEventFired = false;
				disposables.add(provider.onDidChange(() => {
					changeEventFired = true;
				}));

				mockChatSessionsService.notifySessionItemsChanged(localChatSessionType);

				assert.strictEqual(changeEventFired, true);
			});
		});

		test('should not fire onDidChange when session items change for other types', async () => {
			return runWithFakedTimers({}, async () => {
				const provider = createProvider();

				let changeEventFired = false;
				disposables.add(provider.onDidChange(() => {
					changeEventFired = true;
				}));

				mockChatSessionsService.notifySessionItemsChanged('other-type');

				assert.strictEqual(changeEventFired, false);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/mockChatWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/mockChatWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatWidget, IChatWidgetService } from '../../browser/chat.js';
import { ChatAgentLocation } from '../../common/constants.js';

export class MockChatWidgetService implements IChatWidgetService {
	readonly onDidAddWidget: Event<IChatWidget> = Event.None;
	readonly onDidBackgroundSession: Event<URI> = Event.None;

	readonly _serviceBrand: undefined;

	/**
	 * Returns the most recently focused widget if any.
	 */
	readonly lastFocusedWidget: IChatWidget | undefined;

	getWidgetByInputUri(uri: URI): IChatWidget | undefined {
		return undefined;
	}

	getWidgetBySessionResource(sessionResource: URI): IChatWidget | undefined {
		return undefined;
	}

	getWidgetsByLocations(location: ChatAgentLocation): ReadonlyArray<IChatWidget> {
		return [];
	}

	revealWidget(preserveFocus?: boolean): Promise<IChatWidget | undefined> {
		return Promise.resolve(undefined);
	}

	reveal(widget: IChatWidget, preserveFocus?: boolean): Promise<boolean> {
		return Promise.resolve(true);
	}

	getAllWidgets(): ReadonlyArray<IChatWidget> {
		throw new Error('Method not implemented.');
	}

	openSession(sessionResource: URI): Promise<IChatWidget | undefined> {
		throw new Error('Method not implemented.');
	}

	register(newWidget: IChatWidget): IDisposable {
		return Disposable.None;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptBodyAutocompletion.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptBodyAutocompletion.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { CompletionContext, CompletionTriggerKind } from '../../../../../../editor/common/languages.js';
import { ContextKeyService } from '../../../../../../platform/contextkey/browser/contextKeyService.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ExtensionIdentifier } from '../../../../../../platform/extensions/common/extensions.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { LanguageModelToolsService } from '../../../browser/languageModelToolsService.js';
import { ChatConfiguration } from '../../../common/constants.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource } from '../../../common/languageModelToolsService.js';
import { PromptBodyAutocompletion } from '../../../common/promptSyntax/languageProviders/promptBodyAutocompletion.js';
import { createTextModel } from '../../../../../../editor/test/common/testTextModel.js';
import { URI } from '../../../../../../base/common/uri.js';
import { getLanguageIdForPromptsType, PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { getPromptFileExtension } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { InMemoryFileSystemProvider } from '../../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { Range } from '../../../../../../editor/common/core/range.js';

suite('PromptBodyAutocompletion', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instaService: TestInstantiationService;
	let completionProvider: PromptBodyAutocompletion;

	setup(async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.ExtensionToolsEnabled, true);
		instaService = workbenchInstantiationService({
			contextKeyService: () => disposables.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, disposables);
		instaService.stub(ILogService, new NullLogService());
		const fileService = disposables.add(instaService.createInstance(FileService));
		instaService.stub(IFileService, fileService);

		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider('test', fileSystemProvider));

		// Create some test files and directories
		await fileService.createFolder(URI.parse('test:///workspace'));
		await fileService.createFolder(URI.parse('test:///workspace/src'));
		await fileService.createFolder(URI.parse('test:///workspace/docs'));
		await fileService.writeFile(URI.parse('test:///workspace/src/index.ts'), VSBuffer.fromString('export function hello() {}'));
		await fileService.writeFile(URI.parse('test:///workspace/README.md'), VSBuffer.fromString('# Project'));
		await fileService.writeFile(URI.parse('test:///workspace/package.json'), VSBuffer.fromString('{}'));

		const toolService = disposables.add(instaService.createInstance(LanguageModelToolsService));

		const testTool1 = { id: 'testTool1', displayName: 'tool1', canBeReferencedInPrompt: true, modelDescription: 'Test Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool1));

		const testTool2 = { id: 'testTool2', displayName: 'tool2', canBeReferencedInPrompt: true, toolReferenceName: 'tool2', modelDescription: 'Test Tool 2', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool2));

		const myExtSource = { type: 'extension', label: 'My Extension', extensionId: new ExtensionIdentifier('My.extension') } satisfies ToolDataSource;
		const testTool3 = { id: 'testTool3', displayName: 'tool3', canBeReferencedInPrompt: true, toolReferenceName: 'tool3', modelDescription: 'Test Tool 3', source: myExtSource, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool3));

		const prExtSource = { type: 'extension', label: 'GitHub Pull Request Extension', extensionId: new ExtensionIdentifier('github.vscode-pull-request-github') } satisfies ToolDataSource;
		const prExtTool1 = { id: 'suggestFix', canBeReferencedInPrompt: true, toolReferenceName: 'suggest-fix', modelDescription: 'tool4', displayName: 'Test Tool 4', source: prExtSource, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(prExtTool1));

		instaService.set(ILanguageModelToolsService, toolService);

		completionProvider = instaService.createInstance(PromptBodyAutocompletion);
	});

	async function getCompletions(content: string, line: number, column: number, promptType: PromptsType) {
		const languageId = getLanguageIdForPromptsType(promptType);
		const model = disposables.add(createTextModel(content, languageId, undefined, URI.parse('test://workspace/test' + getPromptFileExtension(promptType))));
		const position = new Position(line, column);
		const context: CompletionContext = { triggerKind: CompletionTriggerKind.Invoke };
		const result = await completionProvider.provideCompletionItems(model, position, context, CancellationToken.None);
		if (!result || !result.suggestions) {
			return [];
		}
		const lineContent = model.getLineContent(position.lineNumber);
		return result.suggestions.map(s => {
			assert(s.range instanceof Range);
			return {
				label: s.label,
				result: lineContent.substring(0, s.range.startColumn - 1) + s.insertText + lineContent.substring(s.range.endColumn - 1)
			};
		});
	}

	suite('prompt body completions', () => {
		test('default suggestions', async () => {
			const content = [
				'---',
				'description: "Test"',
				'---',
				'',
				'Use # to reference a file or tool.',
				'One more #to'
			].join('\n');

			{
				const actual = (await getCompletions(content, 5, 6, PromptsType.prompt));
				assert.deepEqual(actual, [
					{
						label: 'file:',
						result: 'Use #file: to reference a file or tool.'
					},
					{
						label: 'tool:',
						result: 'Use #tool: to reference a file or tool.'
					}
				]);
			}
			{
				const actual = (await getCompletions(content, 6, 13, PromptsType.prompt));
				assert.deepEqual(actual, [
					{
						label: 'file:',
						result: 'One more #file:'
					},
					{
						label: 'tool:',
						result: 'One more #tool:'
					}
				]);
			}
		});

		test('tool suggestions', async () => {
			const content = [
				'---',
				'description: "Test"',
				'---',
				'',
				'Use #tool: to reference a tool.',
			].join('\n');
			{
				const actual = (await getCompletions(content, 5, 11, PromptsType.prompt));
				assert.deepEqual(actual, [
					{
						label: 'vscode',
						result: 'Use #tool:vscode to reference a tool.'
					},
					{
						label: 'execute',
						result: 'Use #tool:execute to reference a tool.'
					},
					{
						label: 'read',
						result: 'Use #tool:read to reference a tool.'
					},
					{
						label: 'tool1',
						result: 'Use #tool:tool1 to reference a tool.'
					},
					{
						label: 'tool2',
						result: 'Use #tool:tool2 to reference a tool.'
					},
					{
						label: 'my.extension/tool3',
						result: 'Use #tool:my.extension/tool3 to reference a tool.'
					},
					{
						label: 'github.vscode-pull-request-github/suggest-fix',
						result: 'Use #tool:github.vscode-pull-request-github/suggest-fix to reference a tool.'
					}
				]);
			}
		});
	});
});
```

--------------------------------------------------------------------------------

````

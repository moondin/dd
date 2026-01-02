---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 368
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 368 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptCodeActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptCodeActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { CodeActionContext, CodeActionTriggerType, IWorkspaceTextEdit, IWorkspaceFileEdit } from '../../../../../../editor/common/languages.js';
import { createTextModel } from '../../../../../../editor/test/common/testTextModel.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../../platform/contextkey/browser/contextKeyService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { ChatConfiguration } from '../../../common/constants.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource } from '../../../common/languageModelToolsService.js';
import { LanguageModelToolsService } from '../../../browser/languageModelToolsService.js';
import { IPromptsService } from '../../../common/promptSyntax/service/promptsService.js';
import { getLanguageIdForPromptsType, PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { getPromptFileExtension } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptFileParser } from '../../../common/promptSyntax/promptFileParser.js';
import { PromptCodeActionProvider } from '../../../common/promptSyntax/languageProviders/promptCodeActions.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { CodeActionKind } from '../../../../../../editor/contrib/codeAction/common/types.js';

suite('PromptCodeActionProvider', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instaService: TestInstantiationService;
	let codeActionProvider: PromptCodeActionProvider;
	let fileService: IFileService;

	setup(async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.ExtensionToolsEnabled, true);
		instaService = workbenchInstantiationService({
			contextKeyService: () => disposables.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, disposables);

		const toolService = disposables.add(instaService.createInstance(LanguageModelToolsService));

		// Register test tools including deprecated ones
		const testTool1 = { id: 'testTool1', displayName: 'tool1', canBeReferencedInPrompt: true, modelDescription: 'Test Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool1));

		const deprecatedTool = { id: 'oldTool', displayName: 'oldTool', canBeReferencedInPrompt: true, modelDescription: 'Deprecated Tool', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(deprecatedTool));

		// Mock deprecated tool names
		toolService.getDeprecatedFullReferenceNames = () => {
			const map = new Map<string, Set<string>>();
			map.set('oldTool', new Set(['newTool1', 'newTool2']));
			map.set('singleDeprecated', new Set(['singleReplacement']));
			return map;
		};

		instaService.set(ILanguageModelToolsService, toolService);
		instaService.stub(IMarkerService, { read: () => [] });

		fileService = {
			canMove: async (source: URI, target: URI) => {
				// Mock file service that allows moves for testing
				return true;
			}
		} as IFileService;
		instaService.set(IFileService, fileService);

		const parser = new PromptFileParser();
		instaService.stub(IPromptsService, {
			getParsedPromptFile(model: ITextModel) {
				return parser.parse(model.uri, model.getValue());
			},
			getAgentFileURIFromModeFile(uri: URI) {
				// Mock conversion from .chatmode.md to .agent.md
				if (uri.path.endsWith('.chatmode.md')) {
					return uri.with({ path: uri.path.replace('.chatmode.md', '.agent.md') });
				}
				return undefined;
			}
		});

		codeActionProvider = instaService.createInstance(PromptCodeActionProvider);
	});

	async function getCodeActions(content: string, line: number, column: number, promptType: PromptsType, fileExtension?: string): Promise<{ title: string; textEdits?: IWorkspaceTextEdit[]; fileEdits?: IWorkspaceFileEdit[] }[]> {
		const languageId = getLanguageIdForPromptsType(promptType);
		const uri = URI.parse('test:///test' + (fileExtension ?? getPromptFileExtension(promptType)));
		const model = disposables.add(createTextModel(content, languageId, undefined, uri));
		const range = new Range(line, column, line, column);
		const context: CodeActionContext = { trigger: CodeActionTriggerType.Invoke };

		const result = await codeActionProvider.provideCodeActions(model, range, context, CancellationToken.None);
		if (!result || result.actions.length === 0) {
			return [];
		}

		for (const action of result.actions) {
			assert.equal(action.kind, CodeActionKind.QuickFix.value);
		}

		return result.actions.map(action => ({
			title: action.title,
			textEdits: action.edit?.edits?.filter((edit): edit is IWorkspaceTextEdit => 'textEdit' in edit),
			fileEdits: action.edit?.edits?.filter((edit): edit is IWorkspaceFileEdit => 'oldResource' in edit)
		}));
	}

	suite('agent code actions', () => {
		test('no code actions for instructions files', async () => {
			const content = [
				'---',
				'description: "Test instruction"',
				'applyTo: "**/*.ts"',
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 2, 1, PromptsType.instructions);
			assert.strictEqual(actions.length, 0);
		});

		test('migrate mode file to agent file', async () => {
			const content = [
				'---',
				'name: "Test Mode"',
				'description: "Test mode file"',
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 1, 1, PromptsType.agent, '.chatmode.md');
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Migrate to custom agent file`);
		});

		test('update deprecated tool names - single replacement', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ['singleDeprecated']`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Update to 'singleReplacement'`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits!.length, 1);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, `'singleReplacement'`);
		});

		test('update deprecated tool names - multiple replacements', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ['oldTool']`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Expand to 2 tools`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits!.length, 1);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, `'newTool1','newTool2'`);
		});

		test('update all deprecated tool names', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ['oldTool', 'singleDeprecated', 'validTool']`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 4, 8, PromptsType.agent); // Position at the bracket
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Update all tool names`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits!.length, 2); // Only deprecated tools are updated
		});

		test('handles double quotes in tool names', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ["singleDeprecated"]`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Update to 'singleReplacement'`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, `"singleReplacement"`);
		});

		test('handles unquoted tool names', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				'tools: [singleDeprecated]', // No quotes
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Update to 'singleReplacement'`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, `singleReplacement`); // No quotes preserved
		});

		test('no code actions when range not in tools array', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ['singleDeprecated']`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 2, 1, PromptsType.agent); // Range in description, not tools
			assert.strictEqual(actions.length, 0);
		});
	});

	suite('prompt code actions', () => {
		test('rename mode to agent', async () => {
			const content = [
				'---',
				'description: "Test"',
				'mode: edit',
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 3, 1, PromptsType.prompt);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Rename to 'agent'`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits!.length, 1);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, 'agent');
		});

		test('update deprecated tool names in prompt', async () => {
			const content = [
				'---',
				'description: "Test"',
				`tools: ['singleDeprecated']`,
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 3, 10, PromptsType.prompt);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].title, `Update to 'singleReplacement'`);
			assert.ok(actions[0].textEdits);
			assert.strictEqual(actions[0].textEdits!.length, 1);
			assert.strictEqual(actions[0].textEdits![0].textEdit.text, `'singleReplacement'`);
		});

		test('no code actions when range not in mode attribute', async () => {
			const content = [
				'---',
				'description: "Test"',
				'mode: edit',
				'---',
			].join('\n');
			const actions = await getCodeActions(content, 2, 1, PromptsType.prompt); // Range in description, not mode
			assert.strictEqual(actions.length, 0);
		});

		test('both mode and tools code actions available', async () => {
			const content = [
				'---',
				'description: "Test"',
				'mode: edit',
				`tools: ['singleDeprecated']`,
				'---',
			].join('\n');
			// Test mode action
			const modeActions = await getCodeActions(content, 3, 1, PromptsType.prompt);
			assert.strictEqual(modeActions.length, 1);
			assert.strictEqual(modeActions[0].title, `Rename to 'agent'`);

			// Test tools action
			const toolActions = await getCodeActions(content, 4, 10, PromptsType.prompt);
			assert.strictEqual(toolActions.length, 1);
			assert.strictEqual(toolActions[0].title, `Update to 'singleReplacement'`);
		});
	});

	test('returns undefined when no code actions available', async () => {
		const content = [
			'---',
			'description: "Test"',
			'target: vscode',
			`tools: ['validTool']`, // No deprecated tools
			'---',
		].join('\n');
		const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
		assert.strictEqual(actions.length, 0);
	});

	test('uses comma-space delimiter when separator includes comma', async () => {
		const content = [
			'---',
			'description: "Test"',
			'target: vscode',
			`tools: ['oldTool', 'validTool']`,
			'---',
		].join('\n');
		const actions = await getCodeActions(content, 4, 10, PromptsType.agent);
		assert.strictEqual(actions.length, 1);
		assert.strictEqual(actions[0].title, `Expand to 2 tools`);
		assert.ok(actions[0].textEdits);
		assert.strictEqual(actions[0].textEdits![0].textEdit.text, `'newTool1', 'newTool2'`);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptHovers.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptHovers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { ContextKeyService } from '../../../../../../platform/contextkey/browser/contextKeyService.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ExtensionIdentifier } from '../../../../../../platform/extensions/common/extensions.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { LanguageModelToolsService } from '../../../browser/languageModelToolsService.js';
import { ChatMode, CustomChatMode, IChatModeService } from '../../../common/chatModes.js';
import { ChatConfiguration } from '../../../common/constants.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource } from '../../../common/languageModelToolsService.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../../../common/languageModels.js';
import { PromptHoverProvider } from '../../../common/promptSyntax/languageProviders/promptHovers.js';
import { IPromptsService, PromptsStorage } from '../../../common/promptSyntax/service/promptsService.js';
import { MockChatModeService } from '../../common/mockChatModeService.js';
import { createTextModel } from '../../../../../../editor/test/common/testTextModel.js';
import { URI } from '../../../../../../base/common/uri.js';
import { PromptFileParser } from '../../../common/promptSyntax/promptFileParser.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { getLanguageIdForPromptsType, PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { getPromptFileExtension } from '../../../common/promptSyntax/config/promptFileLocations.js';

suite('PromptHoverProvider', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instaService: TestInstantiationService;
	let hoverProvider: PromptHoverProvider;

	setup(async () => {
		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.ExtensionToolsEnabled, true);
		instaService = workbenchInstantiationService({
			contextKeyService: () => disposables.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, disposables);

		const toolService = disposables.add(instaService.createInstance(LanguageModelToolsService));

		const testTool1 = { id: 'testTool1', displayName: 'tool1', canBeReferencedInPrompt: true, modelDescription: 'Test Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool1));

		const testTool2 = { id: 'testTool2', displayName: 'tool2', canBeReferencedInPrompt: true, toolReferenceName: 'tool2', modelDescription: 'Test Tool 2', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool2));

		instaService.set(ILanguageModelToolsService, toolService);

		const testModels: ILanguageModelChatMetadata[] = [
			{ id: 'mae-4', name: 'MAE 4', vendor: 'olama', version: '1.0', family: 'mae', modelPickerCategory: undefined, extension: new ExtensionIdentifier('a.b'), isUserSelectable: true, maxInputTokens: 8192, maxOutputTokens: 1024, capabilities: { agentMode: true, toolCalling: true } } satisfies ILanguageModelChatMetadata,
			{ id: 'mae-4.1', name: 'MAE 4.1', vendor: 'copilot', version: '1.0', family: 'mae', modelPickerCategory: undefined, extension: new ExtensionIdentifier('a.b'), isUserSelectable: true, maxInputTokens: 8192, maxOutputTokens: 1024, capabilities: { agentMode: true, toolCalling: true } } satisfies ILanguageModelChatMetadata,
		];

		instaService.stub(ILanguageModelsService, {
			getLanguageModelIds() { return testModels.map(m => m.id); },
			lookupLanguageModel(name: string) {
				return testModels.find(m => m.id === name);
			}
		});

		const customChatMode = new CustomChatMode({
			uri: URI.parse('myFs://test/test/chatmode.md'),
			name: 'BeastMode',
			agentInstructions: { content: 'Beast mode instructions', toolReferences: [] },
			source: { storage: PromptsStorage.local }
		});
		instaService.stub(IChatModeService, new MockChatModeService({ builtin: [ChatMode.Agent, ChatMode.Ask, ChatMode.Edit], custom: [customChatMode] }));

		const parser = new PromptFileParser();
		instaService.stub(IPromptsService, {
			getParsedPromptFile(model: ITextModel) {
				return parser.parse(model.uri, model.getValue());
			}
		});

		hoverProvider = instaService.createInstance(PromptHoverProvider);
	});

	async function getHover(content: string, line: number, column: number, promptType: PromptsType): Promise<string | undefined> {
		const languageId = getLanguageIdForPromptsType(promptType);
		const uri = URI.parse('test:///test' + getPromptFileExtension(promptType));
		const model = disposables.add(createTextModel(content, languageId, undefined, uri));
		const position = new Position(line, column);
		const hover = await hoverProvider.provideHover(model, position, CancellationToken.None);
		if (!hover || hover.contents.length === 0) {
			return undefined;
		}
		// Return the markdown value from the first content
		const firstContent = hover.contents[0];
		if (firstContent instanceof MarkdownString) {
			return firstContent.value;
		}
		return undefined;
	}

	suite('agent hovers', () => {
		test('hover on target attribute shows description', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 1, PromptsType.agent);
			assert.strictEqual(hover, 'The target to which the header attributes like tools apply to. Possible values are `github-copilot` and `vscode`.');
		});

		test('hover on model attribute with github-copilot target shows note', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: github-copilot',
				'model: MAE 4',
				'---',
			].join('\n');
			const hover = await getHover(content, 4, 1, PromptsType.agent);
			const expected = [
				'Specify the model that runs this custom agent.',
				'',
				'Note: This attribute is not used when target is github-copilot.'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on model attribute with vscode target shows model info', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				'model: MAE 4 (olama)',
				'---',
			].join('\n');
			const hover = await getHover(content, 4, 1, PromptsType.agent);
			const expected = [
				'Specify the model that runs this custom agent.',
				'',
				'- Name: MAE 4',
				'- Family: mae',
				'- Vendor: olama'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on handoffs attribute with github-copilot target shows note', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: github-copilot',
				'handoffs:',
				'  - label: Test',
				'    agent: Default',
				'    prompt: Test',
				'---',
			].join('\n');
			const hover = await getHover(content, 4, 1, PromptsType.agent);
			const expected = [
				'Possible handoff actions when the agent has completed its task.',
				'',
				'Note: This attribute is not used when target is github-copilot.'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on handoffs attribute with vscode target shows description', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				'handoffs:',
				'  - label: Test',
				'    agent: Default',
				'    prompt: Test',
				'---',
			].join('\n');
			const hover = await getHover(content, 4, 1, PromptsType.agent);
			assert.strictEqual(hover, 'Possible handoff actions when the agent has completed its task.');
		});

		test('hover on github-copilot tool shows simple description', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: github-copilot',
				`tools: ['execute', 'read']`,
				'---',
			].join('\n');
			// Hover on 'shell' tool
			const hoverShell = await getHover(content, 4, 10, PromptsType.agent);
			assert.strictEqual(hoverShell, 'ToolSet: execute\n\n\nExecute code and applications on your machine');

			// Hover on 'read' tool
			const hoverEdit = await getHover(content, 4, 20, PromptsType.agent);
			assert.strictEqual(hoverEdit, 'ToolSet: read\n\n\nRead files in your workspace');
		});

		test('hover on github-copilot tool with target undefined', async () => {
			const content = [
				'---',
				'name: "Test"',
				'description: "Test"',
				`tools: ['shell', 'read']`,
				'---',
			].join('\n');
			// Hover on 'shell' tool
			const hoverShell = await getHover(content, 4, 10, PromptsType.agent);
			assert.strictEqual(hoverShell, 'ToolSet: execute\n\n\nExecute code and applications on your machine');

			// Hover on 'read' tool
			const hoverEdit = await getHover(content, 4, 20, PromptsType.agent);
			assert.strictEqual(hoverEdit, 'ToolSet: read\n\n\nRead files in your workspace');
		});

		test('hover on vscode tool shows detailed description', async () => {
			const content = [
				'---',
				'description: "Test"',
				'target: vscode',
				`tools: ['tool1', 'tool2']`,
				'---',
			].join('\n');
			// Hover on 'tool1'
			const hover = await getHover(content, 4, 10, PromptsType.agent);
			assert.strictEqual(hover, 'Test Tool 1');
		});

		test('hover on description attribute', async () => {
			const content = [
				'---',
				'description: "Test agent"',
				'target: vscode',
				'---',
			].join('\n');
			const hover = await getHover(content, 2, 1, PromptsType.agent);
			assert.strictEqual(hover, 'The description of the custom agent, what it does and when to use it.');
		});

		test('hover on argument-hint attribute', async () => {
			const content = [
				'---',
				'description: "Test"',
				'argument-hint: "test hint"',
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 1, PromptsType.agent);
			assert.strictEqual(hover, 'The argument-hint describes what inputs the custom agent expects or supports.');
		});

		test('hover on name attribute', async () => {
			const content = [
				'---',
				'name: "My Agent"',
				'description: "Test agent"',
				'target: vscode',
				'---',
			].join('\n');
			const hover = await getHover(content, 2, 1, PromptsType.agent);
			assert.strictEqual(hover, 'The name of the agent as shown in the UI.');
		});

		test('hover on infer attribute shows description', async () => {
			const content = [
				'---',
				'name: "Test Agent"',
				'description: "Test agent"',
				'infer: true',
				'---',
			].join('\n');
			const hover = await getHover(content, 4, 1, PromptsType.agent);
			assert.strictEqual(hover, 'Whether the agent can be used as a subagent.');
		});
	});

	suite('prompt hovers', () => {
		test('hover on model attribute shows model info', async () => {
			const content = [
				'---',
				'description: "Test"',
				'model: MAE 4 (olama)',
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 1, PromptsType.prompt);
			const expected = [
				'The model to use in this prompt.',
				'',
				'- Name: MAE 4',
				'- Family: mae',
				'- Vendor: olama'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on tools attribute shows tool description', async () => {
			const content = [
				'---',
				'description: "Test"',
				`tools: ['tool1']`,
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 10, PromptsType.prompt);
			assert.strictEqual(hover, 'Test Tool 1');
		});

		test('hover on agent attribute shows agent info', async () => {
			const content = [
				'---',
				'description: "Test"',
				'agent: BeastMode',
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 1, PromptsType.prompt);
			const expected = [
				'The agent to use when running this prompt.',
				'',
				'**Built-in agents:**',
				'- `agent`: Describe what to build next',
				'- `ask`: Explore and understand your code',
				'- `edit`: Edit or refactor selected code',
				'',
				'**Custom agents:**',
				'- `BeastMode`: Custom agent'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on name attribute', async () => {
			const content = [
				'---',
				'name: "My Prompt"',
				'description: "Test prompt"',
				'---',
			].join('\n');
			const hover = await getHover(content, 2, 1, PromptsType.prompt);
			assert.strictEqual(hover, 'The name of the prompt. This is also the name of the slash command that will run this prompt.');
		});
	});

	suite('instructions hovers', () => {
		test('hover on description attribute', async () => {
			const content = [
				'---',
				'description: "Test instruction"',
				'applyTo: "**/*.ts"',
				'---',
			].join('\n');
			const hover = await getHover(content, 2, 1, PromptsType.instructions);
			assert.strictEqual(hover, 'The description of the instruction file. It can be used to provide additional context or information about the instructions and is passed to the language model as part of the prompt.');
		});

		test('hover on applyTo attribute', async () => {
			const content = [
				'---',
				'description: "Test"',
				'applyTo: "**/*.ts"',
				'---',
			].join('\n');
			const hover = await getHover(content, 3, 1, PromptsType.instructions);
			const expected = [
				'One or more glob pattern (separated by comma) that describe for which files the instructions apply to. Based on these patterns, the file is automatically included in the prompt, when the context contains a file that matches one or more of these patterns. Use `**` when you want this file to always be added.',
				'Example: `**/*.ts`, `**/*.js`, `client/**`'
			].join('\n');
			assert.strictEqual(hover, expected);
		});

		test('hover on name attribute', async () => {
			const content = [
				'---',
				'name: "My Instructions"',
				'description: "Test instruction"',
				'applyTo: "**/*.ts"',
				'---',
			].join('\n');
			const hover = await getHover(content, 2, 1, PromptsType.instructions);
			assert.strictEqual(hover, 'The name of the instruction file as shown in the UI. If not set, the name is derived from the file name.');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptValidator.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/promptSytntax/promptValidator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';

import { ResourceSet } from '../../../../../../base/common/map.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ContextKeyService } from '../../../../../../platform/contextkey/browser/contextKeyService.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ExtensionIdentifier } from '../../../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { IMarkerData, MarkerSeverity } from '../../../../../../platform/markers/common/markers.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { LanguageModelToolsService } from '../../../browser/languageModelToolsService.js';
import { ChatMode, CustomChatMode, IChatModeService } from '../../../common/chatModes.js';
import { ChatConfiguration } from '../../../common/constants.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource } from '../../../common/languageModelToolsService.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../../../common/languageModels.js';
import { getPromptFileExtension } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptValidator } from '../../../common/promptSyntax/languageProviders/promptValidator.js';
import { PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { PromptFileParser } from '../../../common/promptSyntax/promptFileParser.js';
import { PromptsStorage } from '../../../common/promptSyntax/service/promptsService.js';
import { MockChatModeService } from '../../common/mockChatModeService.js';

suite('PromptValidator', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instaService: TestInstantiationService;

	const existingRef1 = URI.parse('myFs://test/reference1.md');
	const existingRef2 = URI.parse('myFs://test/reference2.md');

	setup(async () => {

		const testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(ChatConfiguration.ExtensionToolsEnabled, true);
		instaService = workbenchInstantiationService({
			contextKeyService: () => disposables.add(new ContextKeyService(testConfigService)),
			configurationService: () => testConfigService
		}, disposables);
		instaService.stub(ILabelService, { getUriLabel: (resource) => resource.path });

		const toolService = disposables.add(instaService.createInstance(LanguageModelToolsService));

		const testTool1 = { id: 'testTool1', displayName: 'tool1', canBeReferencedInPrompt: true, modelDescription: 'Test Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool1));
		const testTool2 = { id: 'testTool2', displayName: 'tool2', canBeReferencedInPrompt: true, toolReferenceName: 'tool2', modelDescription: 'Test Tool 2', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool2));
		const shellTool = { id: 'shell', displayName: 'shell', canBeReferencedInPrompt: true, toolReferenceName: 'shell', modelDescription: 'Runs commands in the terminal', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(shellTool));

		const myExtSource = { type: 'extension', label: 'My Extension', extensionId: new ExtensionIdentifier('My.extension') } satisfies ToolDataSource;
		const testTool3 = { id: 'testTool3', displayName: 'tool3', canBeReferencedInPrompt: true, toolReferenceName: 'tool3', modelDescription: 'Test Tool 3', source: myExtSource, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(testTool3));

		const prExtSource = { type: 'extension', label: 'GitHub Pull Request Extension', extensionId: new ExtensionIdentifier('github.vscode-pull-request-github') } satisfies ToolDataSource;
		const prExtTool1 = { id: 'suggestFix', canBeReferencedInPrompt: true, toolReferenceName: 'suggest-fix', modelDescription: 'tool4', displayName: 'Test Tool 4', source: prExtSource, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(prExtTool1));

		const toolWithLegacy = { id: 'newTool', toolReferenceName: 'newToolRef', displayName: 'New Tool', canBeReferencedInPrompt: true, modelDescription: 'New Tool', source: ToolDataSource.External, inputSchema: {}, legacyToolReferenceFullNames: ['oldToolName', 'deprecatedToolName'] } satisfies IToolData;
		disposables.add(toolService.registerToolData(toolWithLegacy));

		const toolSetWithLegacy = disposables.add(toolService.createToolSet(
			ToolDataSource.External,
			'newToolSet',
			'newToolSetRef',
			{ description: 'New Tool Set', legacyFullNames: ['oldToolSet', 'deprecatedToolSet'] }
		));
		const toolInSet = { id: 'toolInSet', toolReferenceName: 'toolInSetRef', displayName: 'Tool In Set', canBeReferencedInPrompt: false, modelDescription: 'Tool In Set', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(toolInSet));
		disposables.add(toolSetWithLegacy.addTool(toolInSet));

		const anotherToolWithLegacy = { id: 'anotherTool', toolReferenceName: 'anotherToolRef', displayName: 'Another Tool', canBeReferencedInPrompt: true, modelDescription: 'Another Tool', source: ToolDataSource.External, inputSchema: {}, legacyToolReferenceFullNames: ['legacyTool'] } satisfies IToolData;
		disposables.add(toolService.registerToolData(anotherToolWithLegacy));

		const anotherToolSetWithLegacy = disposables.add(toolService.createToolSet(
			ToolDataSource.External,
			'anotherToolSet',
			'anotherToolSetRef',
			{ description: 'Another Tool Set', legacyFullNames: ['legacyToolSet'] }
		));
		const anotherToolInSet = { id: 'anotherToolInSet', toolReferenceName: 'anotherToolInSetRef', displayName: 'Another Tool In Set', canBeReferencedInPrompt: false, modelDescription: 'Another Tool In Set', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(anotherToolInSet));
		disposables.add(anotherToolSetWithLegacy.addTool(anotherToolInSet));

		const conflictToolSet1 = disposables.add(toolService.createToolSet(
			ToolDataSource.External,
			'conflictSet1',
			'conflictSet1Ref',
			{ legacyFullNames: ['sharedLegacyName'] }
		));
		const conflictTool1 = { id: 'conflictTool1', toolReferenceName: 'conflictTool1Ref', displayName: 'Conflict Tool 1', canBeReferencedInPrompt: false, modelDescription: 'Conflict Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(conflictTool1));
		disposables.add(conflictToolSet1.addTool(conflictTool1));

		const conflictToolSet2 = disposables.add(toolService.createToolSet(
			ToolDataSource.External,
			'conflictSet2',
			'conflictSet2Ref',
			{ legacyFullNames: ['sharedLegacyName'] }
		));
		const conflictTool2 = { id: 'conflictTool2', toolReferenceName: 'conflictTool2Ref', displayName: 'Conflict Tool 2', canBeReferencedInPrompt: false, modelDescription: 'Conflict Tool 2', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
		disposables.add(toolService.registerToolData(conflictTool2));
		disposables.add(conflictToolSet2.addTool(conflictTool2));

		instaService.set(ILanguageModelToolsService, toolService);

		const testModels: ILanguageModelChatMetadata[] = [
			{ id: 'mae-4', name: 'MAE 4', vendor: 'olama', version: '1.0', family: 'mae', modelPickerCategory: undefined, extension: new ExtensionIdentifier('a.b'), isUserSelectable: true, maxInputTokens: 8192, maxOutputTokens: 1024, capabilities: { agentMode: true, toolCalling: true } } satisfies ILanguageModelChatMetadata,
			{ id: 'mae-4.1', name: 'MAE 4.1', vendor: 'copilot', version: '1.0', family: 'mae', modelPickerCategory: undefined, extension: new ExtensionIdentifier('a.b'), isUserSelectable: true, maxInputTokens: 8192, maxOutputTokens: 1024, capabilities: { agentMode: true, toolCalling: true } } satisfies ILanguageModelChatMetadata,
			{ id: 'mae-3.5-turbo', name: 'MAE 3.5 Turbo', vendor: 'copilot', version: '1.0', family: 'mae', modelPickerCategory: undefined, extension: new ExtensionIdentifier('a.b'), isUserSelectable: true, maxInputTokens: 8192, maxOutputTokens: 1024 } satisfies ILanguageModelChatMetadata
		];

		instaService.stub(ILanguageModelsService, {
			getLanguageModelIds() { return testModels.map(m => m.id); },
			lookupLanguageModel(name: string) {
				return testModels.find(m => m.id === name);
			}
		});

		const customChatMode = new CustomChatMode({
			uri: URI.parse('myFs://test/test/chatmode.md'),
			name: 'BeastMode',
			agentInstructions: { content: 'Beast mode instructions', toolReferences: [] },
			source: { storage: PromptsStorage.local }
		});
		instaService.stub(IChatModeService, new MockChatModeService({ builtin: [ChatMode.Agent, ChatMode.Ask, ChatMode.Edit], custom: [customChatMode] }));


		const existingFiles = new ResourceSet([existingRef1, existingRef2]);
		instaService.stub(IFileService, {
			exists(uri: URI) {
				return Promise.resolve(existingFiles.has(uri));
			}
		});
	});

	async function validate(code: string, promptType: PromptsType): Promise<IMarkerData[]> {
		const uri = URI.parse('myFs://test/testFile' + getPromptFileExtension(promptType));
		const result = new PromptFileParser().parse(uri, code);
		const validator = instaService.createInstance(PromptValidator);
		const markers: IMarkerData[] = [];
		await validator.validate(result, promptType, m => markers.push(m));
		return markers;
	}
	suite('agents', () => {

		test('correct agent', async () => {
			const content = [
			/* 01 */'---',
			/* 02 */`description: "Agent mode test"`,
			/* 03 */'model: MAE 4.1',
			/* 04 */`tools: ['tool1', 'tool2']`,
			/* 05 */'---',
			/* 06 */'This is a chat agent test.',
			/* 07 */'Here is a #tool1 variable and a #file:./reference1.md as well as a [reference](./reference2.md).',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(markers, []);
		});

		test('agent with errors (empty description, unknown tool & model)', async () => {
			const content = [
			/* 01 */'---',
			/* 02 */`description: ""`, // empty description -> error
			/* 03 */'model: MAE 4.2', // unknown model -> warning
			/* 04 */`tools: ['tool1', 'tool2', 'tool4', 'my.extension/tool3']`, // tool4 unknown -> error
			/* 05 */'---',
			/* 06 */'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(
				markers.map(m => ({ severity: m.severity, message: m.message })),
				[
					{ severity: MarkerSeverity.Error, message: `The 'description' attribute should not be empty.` },
					{ severity: MarkerSeverity.Warning, message: `Unknown tool 'tool4'.` },
					{ severity: MarkerSeverity.Warning, message: `Unknown model 'MAE 4.2'.` },
				]
			);
		});

		test('tools must be array', async () => {
			const content = [
				'---',
				'description: "Test"',
				`tools: 'tool1'`,
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.deepStrictEqual(markers.map(m => m.message), [`The 'tools' attribute must be an array.`]);
		});

		test('each tool must be string', async () => {
			const content = [
				'---',
				'description: "Test"',
				`tools: ['tool1', 2]`,
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(
				markers.map(m => ({ severity: m.severity, message: m.message })),
				[
					{ severity: MarkerSeverity.Error, message: `Each tool name in the 'tools' attribute must be a string.` },
				]
			);
		});

		test('old tool reference', async () => {
			const content = [
				'---',
				'description: "Test"',
				`tools: ['tool1', 'tool3']`,
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(
				markers.map(m => ({ severity: m.severity, message: m.message })),
				[
					{ severity: MarkerSeverity.Info, message: `Tool or toolset 'tool3' has been renamed, use 'my.extension/tool3' instead.` },
				]
			);
		});

		test('legacy tool reference names', async () => {
			// Test using legacy tool reference name
			{
				const content = [
					'---',
					'description: "Test"',
					`tools: ['tool1', 'oldToolName']`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(
					markers.map(m => ({ severity: m.severity, message: m.message })),
					[
						{ severity: MarkerSeverity.Info, message: `Tool or toolset 'oldToolName' has been renamed, use 'newToolRef' instead.` },
					]
				);
			}

			// Test using another legacy tool reference name
			{
				const content = [
					'---',
					'description: "Test"',
					`tools: ['tool1', 'deprecatedToolName']`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(
					markers.map(m => ({ severity: m.severity, message: m.message })),
					[
						{ severity: MarkerSeverity.Info, message: `Tool or toolset 'deprecatedToolName' has been renamed, use 'newToolRef' instead.` },
					]
				);
			}
		});

		test('legacy toolset names', async () => {
			// Test using legacy toolset name
			{
				const content = [
					'---',
					'description: "Test"',
					`tools: ['tool1', 'oldToolSet']`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(
					markers.map(m => ({ severity: m.severity, message: m.message })),
					[
						{ severity: MarkerSeverity.Info, message: `Tool or toolset 'oldToolSet' has been renamed, use 'newToolSetRef' instead.` },
					]
				);
			}

			// Test using another legacy toolset name
			{
				const content = [
					'---',
					'description: "Test"',
					`tools: ['tool1', 'deprecatedToolSet']`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(
					markers.map(m => ({ severity: m.severity, message: m.message })),
					[
						{ severity: MarkerSeverity.Info, message: `Tool or toolset 'deprecatedToolSet' has been renamed, use 'newToolSetRef' instead.` },
					]
				);
			}
		});

		test('multiple legacy names in same tools list', async () => {
			// Test multiple legacy names together
			const content = [
				'---',
				'description: "Test"',
				`tools: ['legacyTool', 'legacyToolSet', 'tool3']`,
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(
				markers.map(m => ({ severity: m.severity, message: m.message })),
				[
					{ severity: MarkerSeverity.Info, message: `Tool or toolset 'legacyTool' has been renamed, use 'anotherToolRef' instead.` },
					{ severity: MarkerSeverity.Info, message: `Tool or toolset 'legacyToolSet' has been renamed, use 'anotherToolSetRef' instead.` },
					{ severity: MarkerSeverity.Info, message: `Tool or toolset 'tool3' has been renamed, use 'my.extension/tool3' instead.` },
				]
			);
		});

		test('deprecated tool name mapping to multiple new names', async () => {
			// The toolsets are registered in setup with a shared legacy name 'sharedLegacyName'
			// This simulates the case where one deprecated name maps to multiple current names
			const content = [
				'---',
				'description: "Test"',
				`tools: ['sharedLegacyName']`,
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Info);
			// When multiple toolsets share the same legacy name, the message should indicate multiple options
			// The message will say "use the following tools instead:" for multiple mappings
			const expectedMessage = `Tool or toolset 'sharedLegacyName' has been renamed, use the following tools instead: conflictSet1Ref, conflictSet2Ref`;
			assert.strictEqual(markers[0].message, expectedMessage);
		});

		test('deprecated tool name in body variable reference - single mapping', async () => {
			// Test deprecated tool name used as variable reference in body
			const content = [
				'---',
				'description: "Test"',
				'---',
				'Body with #tool:oldToolName reference',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Info);
			assert.strictEqual(markers[0].message, `Tool or toolset 'oldToolName' has been renamed, use 'newToolRef' instead.`);
		});

		test('deprecated tool name in body variable reference - multiple mappings', async () => {
			// Register tools with the same legacy name to create multiple mappings
			const multiMapToolSet1 = disposables.add(instaService.get(ILanguageModelToolsService).createToolSet(
				ToolDataSource.External,
				'multiMapSet1',
				'multiMapSet1Ref',
				{ legacyFullNames: ['multiMapLegacy'] }
			));
			const multiMapTool1 = { id: 'multiMapTool1', toolReferenceName: 'multiMapTool1Ref', displayName: 'Multi Map Tool 1', canBeReferencedInPrompt: true, modelDescription: 'Multi Map Tool 1', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
			disposables.add(instaService.get(ILanguageModelToolsService).registerToolData(multiMapTool1));
			disposables.add(multiMapToolSet1.addTool(multiMapTool1));

			const multiMapToolSet2 = disposables.add(instaService.get(ILanguageModelToolsService).createToolSet(
				ToolDataSource.External,
				'multiMapSet2',
				'multiMapSet2Ref',
				{ legacyFullNames: ['multiMapLegacy'] }
			));
			const multiMapTool2 = { id: 'multiMapTool2', toolReferenceName: 'multiMapTool2Ref', displayName: 'Multi Map Tool 2', canBeReferencedInPrompt: true, modelDescription: 'Multi Map Tool 2', source: ToolDataSource.External, inputSchema: {} } satisfies IToolData;
			disposables.add(instaService.get(ILanguageModelToolsService).registerToolData(multiMapTool2));
			disposables.add(multiMapToolSet2.addTool(multiMapTool2));

			const content = [
				'---',
				'description: "Test"',
				'---',
				'Body with #tool:multiMapLegacy reference',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Info);
			// When multiple toolsets share the same legacy name, the message should indicate multiple options
			// The message will say "use the following tools instead:" for multiple mappings in body references
			const expectedMessage = `Tool or toolset 'multiMapLegacy' has been renamed, use the following tools instead: multiMapSet1Ref, multiMapSet2Ref`;
			assert.strictEqual(markers[0].message, expectedMessage);
		});

		test('unknown attribute in agent file', async () => {
			const content = [
				'---',
				'description: "Test"',
				`applyTo: '*.ts'`, // not allowed in agent file
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(
				markers.map(m => ({ severity: m.severity, message: m.message })),
				[
					{ severity: MarkerSeverity.Warning, message: `Attribute 'applyTo' is not supported in VS Code agent files. Supported: argument-hint, description, handoffs, infer, model, name, target, tools.` },
				]
			);
		});

		test('tools with invalid handoffs', async () => {
			{
				const content = [
					'---',
					'description: "Test"',
					`handoffs: next`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.deepStrictEqual(markers.map(m => m.message), [`The 'handoffs' attribute must be an array.`]);
			}
			{
				const content = [
					'---',
					'description: "Test"',
					`handoffs:`,
					`  - label: '123'`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.deepStrictEqual(markers.map(m => m.message), [`Missing required properties 'agent', 'prompt' in handoff object.`]);
			}
			{
				const content = [
					'---',
					'description: "Test"',
					`handoffs:`,
					`  - label: '123'`,
					`    agent: ''`,
					`    prompt: ''`,
					`    send: true`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.deepStrictEqual(markers.map(m => m.message), [`The 'agent' property in a handoff must be a non-empty string.`]);
			}
			{
				const content = [
					'---',
					'description: "Test"',
					`handoffs:`,
					`  - label: '123'`,
					`    agent: 'Cool'`,
					`    prompt: ''`,
					`    send: true`,
					'---',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.deepStrictEqual(markers.map(m => m.message), [`Unknown agent 'Cool'. Available agents: agent, ask, edit, BeastMode.`]);
			}
		});

		test('agent with handoffs attribute', async () => {
			const content = [
				'---',
				'description: \"Test agent with handoffs\"',
				`handoffs:`,
				'  - label: Test Prompt',
				'    agent: agent',
				'    prompt: Add tests for this code',
				'  - label: Optimize Performance',
				'    agent: agent',
				'    prompt: Optimize for performance',
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(markers, [], 'Expected no validation issues for handoffs attribute');
		});

		test('github-copilot agent with supported attributes', async () => {
			const content = [
				'---',
				'name: "GitHub_Copilot_Custom_Agent"',
				'description: "GitHub Copilot agent"',
				'target: github-copilot',
				`tools: ['shell', 'edit', 'search', 'custom-agent']`,
				'mcp-servers: []',
				'---',
				'Body with #search and #edit references',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(markers, [], 'Expected no validation issues for github-copilot target');
		});

		test('github-copilot agent warns about model and handoffs attributes', async () => {
			const content = [
				'---',
				'name: "GitHubAgent"',
				'description: "GitHub Copilot agent"',
				'target: github-copilot',
				'model: MAE 4.1',
				`tools: ['shell', 'edit']`,
				`handoffs:`,
				'  - label: Test',
				'    agent: Default',
				'    prompt: Test',
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			const messages = markers.map(m => m.message);
			assert.deepStrictEqual(messages, [
				'Attribute \'model\' is not supported in custom GitHub Copilot agent files. Supported: description, infer, mcp-servers, name, target, tools.',
				'Attribute \'handoffs\' is not supported in custom GitHub Copilot agent files. Supported: description, infer, mcp-servers, name, target, tools.',
			], 'Model and handoffs are not validated for github-copilot target');
		});

		test('github-copilot agent does not validate variable references', async () => {
			const content = [
				'---',
				'name: "GitHubAgent"',
				'description: "GitHub Copilot agent"',
				'target: github-copilot',
				`tools: ['shell', 'edit']`,
				'---',
				'Body with #unknownTool reference',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			// Variable references should not be validated for github-copilot target
			assert.deepStrictEqual(markers, [], 'Variable references are not validated for github-copilot target');
		});

		test('github-copilot agent rejects unsupported attributes', async () => {
			const content = [
				'---',
				'name: "GitHubAgent"',
				'description: "GitHub Copilot agent"',
				'target: github-copilot',
				'argument-hint: "test hint"',
				`tools: ['shell']`,
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.ok(markers[0].message.includes(`Attribute 'argument-hint' is not supported`), 'Expected warning about unsupported attribute');
		});

		test('vscode target agent validates normally', async () => {
			const content = [
				'---',
				'description: "VS Code agent"',
				'target: vscode',
				'model: MAE 4.1',
				`tools: ['tool1', 'tool2']`,
				'---',
				'Body with #tool1',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.deepStrictEqual(markers, [], 'VS Code target should validate normally');
		});

		test('vscode target agent warns about unknown tools', async () => {
			const content = [
				'---',
				'description: "VS Code agent"',
				'target: vscode',
				`tools: ['tool1', 'unknownTool']`,
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.strictEqual(markers[0].message, `Unknown tool 'unknownTool'.`);
		});

		test('vscode target agent with mcp-servers and github-tools', async () => {
			const content = [
				'---',
				'description: "VS Code agent"',
				'target: vscode',
				`tools: ['tool1', 'edit']`,
				`mcp-servers: {}`,
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			const messages = markers.map(m => m.message);
			assert.deepStrictEqual(messages, [
				'Attribute \'mcp-servers\' is ignored when running locally in VS Code.',
				'Unknown tool \'edit\'.',
			]);
		});

		test('undefined target with mcp-servers and github-tools', async () => {
			const content = [
				'---',
				'description: "VS Code agent"',
				`tools: ['tool1', 'shell']`,
				`mcp-servers: {}`,
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			const messages = markers.map(m => m.message);
			assert.deepStrictEqual(messages, [
				'Attribute \'mcp-servers\' is ignored when running locally in VS Code.',
			]);
		});

		test('default target (no target specified) validates as vscode', async () => {
			const content = [
				'---',
				'description: "Agent without target"',
				'model: MAE 4.1',
				`tools: ['tool1']`,
				'argument-hint: "test hint"',
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.agent);
			// Should validate normally as if target was vscode
			assert.deepStrictEqual(markers, [], 'Agent without target should validate as vscode');
		});

		test('name attribute validation', async () => {
			// Valid name
			{
				const content = [
					'---',
					'name: "MyAgent"',
					'description: "Test agent"',
					'target: vscode',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Valid name should not produce errors');
			}

			// Empty name
			{
				const content = [
					'---',
					'name: ""',
					'description: "Test agent"',
					'target: vscode',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'name' attribute must not be empty.`);
			}

			// Non-string name
			{
				const content = [
					'---',
					'name: 123',
					'description: "Test agent"',
					'target: vscode',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'name' attribute must be a string.`);
			}

			// Valid name with allowed characters
			{
				const content = [
					'---',
					'name: "My_Agent-2.0 with spaces"',
					'description: "Test agent"',
					'target: vscode',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Name with allowed characters should be valid');
			}
		});

		test('github-copilot target requires name attribute', async () => {
			// Missing name with github-copilot target
			{
				const content = [
					'---',
					'description: "GitHub Copilot agent"',
					'target: github-copilot',
					`tools: ['shell']`,
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 0);
			}

			// Valid name with github-copilot target
			{
				const content = [
					'---',
					'name: "GitHubAgent"',
					'description: "GitHub Copilot agent"',
					'target: github-copilot',
					`tools: ['shell']`,
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Valid github-copilot agent with name should not produce errors');
			}

			// Missing name with vscode target (should be optional)
			{
				const content = [
					'---',
					'description: "VS Code agent"',
					'target: vscode',
					`tools: ['tool1']`,
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Name should be optional for vscode target');
			}
		});

		test('infer attribute validation', async () => {
			// Valid infer: true
			{
				const content = [
					'---',
					'name: "TestAgent"',
					'description: "Test agent"',
					'infer: true',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Valid infer: true should not produce errors');
			}

			// Valid infer: false
			{
				const content = [
					'---',
					'name: "TestAgent"',
					'description: "Test agent"',
					'infer: false',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Valid infer: false should not produce errors');
			}

			// Invalid infer: string value
			{
				const content = [
					'---',
					'name: "TestAgent"',
					'description: "Test agent"',
					'infer: "yes"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'infer' attribute must be a boolean.`);
			}

			// Invalid infer: number value
			{
				const content = [
					'---',
					'name: "TestAgent"',
					'description: "Test agent"',
					'infer: 1',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'infer' attribute must be a boolean.`);
			}

			// Missing infer attribute (should be optional)
			{
				const content = [
					'---',
					'name: "TestAgent"',
					'description: "Test agent"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.agent);
				assert.deepStrictEqual(markers, [], 'Missing infer attribute should be allowed');
			}
		});
	});

	suite('instructions', () => {

		test('instructions valid', async () => {
			const content = [
				'---',
				'description: "Instr"',
				'applyTo: *.ts,*.js',
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.instructions);
			assert.deepEqual(markers, []);
		});

		test('instructions invalid applyTo type', async () => {
			const content = [
				'---',
				'description: "Instr"',
				'applyTo: 5',
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.instructions);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].message, `The 'applyTo' attribute must be a string.`);
		});

		test('instructions invalid applyTo glob & unknown attribute', async () => {
			const content = [
				'---',
				'description: "Instr"',
				`applyTo: ''`, // empty -> invalid glob
				'model: mae-4', // model not allowed in instructions
				'---',
			].join('\n');
			const markers = await validate(content, PromptsType.instructions);
			assert.strictEqual(markers.length, 2);
			// Order: unknown attribute warnings first (attribute iteration) then applyTo validation
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.ok(markers[0].message.startsWith(`Attribute 'model' is not supported in instructions files.`));
			assert.strictEqual(markers[1].message, `The 'applyTo' attribute must be a valid glob pattern.`);
		});

		test('invalid header structure (YAML array)', async () => {
			const content = [
				'---',
				'- item1',
				'---',
				'Body',
			].join('\n');
			const markers = await validate(content, PromptsType.instructions);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].message, 'Invalid header, expecting <key: value> pairs');
		});

		test('name attribute validation in instructions', async () => {
			// Valid name
			{
				const content = [
					'---',
					'name: "MyInstructions"',
					'description: "Test instructions"',
					'applyTo: "**/*.ts"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.instructions);
				assert.deepStrictEqual(markers, [], 'Valid name should not produce errors');
			}

			// Empty name
			{
				const content = [
					'---',
					'name: ""',
					'description: "Test instructions"',
					'applyTo: "**/*.ts"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.instructions);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'name' attribute must not be empty.`);
			}
		});
	});

	suite('prompts', () => {

		test('prompt valid with agent mode (default) and tools and a BYO model', async () => {
			// mode omitted -> defaults to Agent; tools+model should validate; model MAE 4 is agent capable
			const content = [
				'---',
				'description: "Prompt with tools"',
				'model: MAE 4.1',
				`tools: ['tool1','tool2']`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.deepStrictEqual(markers, []);
		});

		test('prompt model not suited for agent mode', async () => {
			// MAE 3.5 Turbo lacks agentMode capability -> warning when used in agent (default)
			const content = [
				'---',
				'description: "Prompt with unsuitable model"',
				'model: MAE 3.5 Turbo',
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1, 'Expected one warning about unsuitable model');
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.strictEqual(markers[0].message, `Model 'MAE 3.5 Turbo' is not suited for agent mode.`);
		});

		test('prompt with custom agent BeastMode and tools', async () => {
			// Explicit custom agent should be recognized; BeastMode kind comes from setup; ensure tools accepted
			const content = [
				'---',
				'description: "Prompt custom mode"',
				'agent: BeastMode',
				`tools: ['tool1']`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.deepStrictEqual(markers, []);
		});

		test('prompt with custom mode BeastMode and tools', async () => {
			// Explicit custom mode should be recognized; BeastMode kind comes from setup; ensure tools accepted
			const content = [
				'---',
				'description: "Prompt custom mode"',
				'mode: BeastMode',
				`tools: ['tool1']`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1);
			assert.deepStrictEqual(markers.map(m => m.message), [`The 'mode' attribute has been deprecated. Please rename it to 'agent'.`]);

		});

		test('prompt with custom mode an agent', async () => {
			// Explicit custom mode should be recognized; BeastMode kind comes from setup; ensure tools accepted
			const content = [
				'---',
				'description: "Prompt custom mode"',
				'mode: BeastMode',
				`agent: agent`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1);
			assert.deepStrictEqual(markers.map(m => m.message), [`The 'mode' attribute has been deprecated. The 'agent' attribute is used instead.`]);

		});

		test('prompt with unknown agent Ask', async () => {
			const content = [
				'---',
				'description: "Prompt unknown agent Ask"',
				'agent: Ask',
				`tools: ['tool1','tool2']`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1, 'Expected one warning about tools in non-agent mode');
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.strictEqual(markers[0].message, `Unknown agent 'Ask'. Available agents: agent, ask, edit, BeastMode.`);
		});

		test('prompt with agent edit', async () => {
			const content = [
				'---',
				'description: "Prompt edit mode with tool"',
				'agent: edit',
				`tools: ['tool1']`,
				'---',
				'Body'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1);
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.strictEqual(markers[0].message, `The 'tools' attribute is only supported when using agents. Attribute will be ignored.`);
		});

		test('name attribute validation in prompts', async () => {
			// Valid name
			{
				const content = [
					'---',
					'name: "MyPrompt"',
					'description: "Test prompt"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.prompt);
				assert.deepStrictEqual(markers, [], 'Valid name should not produce errors');
			}

			// Empty name
			{
				const content = [
					'---',
					'name: ""',
					'description: "Test prompt"',
					'---',
					'Body',
				].join('\n');
				const markers = await validate(content, PromptsType.prompt);
				assert.strictEqual(markers.length, 1);
				assert.strictEqual(markers[0].severity, MarkerSeverity.Error);
				assert.strictEqual(markers[0].message, `The 'name' attribute must not be empty.`);
			}
		});
	});

	suite('body', () => {
		test('body with existing file references and known tools has no markers', async () => {
			const content = [
				'---',
				'description: "Refs"',
				'---',
				'Here is a #file:./reference1.md and a markdown [reference](./reference2.md) plus variables #tool1 and #tool2'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.deepStrictEqual(markers, [], 'Expected no validation issues');
		});

		test('body with missing file references reports warnings', async () => {
			const content = [
				'---',
				'description: "Missing Refs"',
				'---',
				'Here is a #file:./missing1.md and a markdown [missing link](./missing2.md).'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			const messages = markers.map(m => m.message).sort();
			assert.deepStrictEqual(messages, [
				`File './missing1.md' not found at '/missing1.md'.`,
				`File './missing2.md' not found at '/missing2.md'.`
			]);
		});

		test('body with http link', async () => {
			const content = [
				'---',
				'description: "HTTP Link"',
				'---',
				'Here is a [http link](http://example.com).'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.deepStrictEqual(markers, [], 'Expected no validation issues');
		});

		test('body with url link', async () => {
			const nonExistingRef = existingRef1.with({ path: '/nonexisting' });
			const content = [
				'---',
				'description: "URL Links"',
				'---',
				`Here is a [url link](${existingRef1.toString()}).`,
				`Here is a [url link](${nonExistingRef.toString()}).`
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			const messages = markers.map(m => m.message).sort();
			assert.deepStrictEqual(messages, [
				`File 'myFs://test/nonexisting' not found at '/nonexisting'.`,
			]);
		});

		test('body with unknown tool variable reference warns', async () => {
			const content = [
				'---',
				'description: "Unknown tool var"',
				'---',
				'This line references known #tool:tool1 and unknown #tool:toolX'
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			assert.strictEqual(markers.length, 1, 'Expected one warning for unknown tool variable');
			assert.strictEqual(markers[0].severity, MarkerSeverity.Warning);
			assert.strictEqual(markers[0].message, `Unknown tool or toolset 'toolX'.`);
		});

		test('body with tool not present in tools list', async () => {
			const content = [
				'---',
				'tools: []',
				'---',
				'I need',
				'#tool:ms-azuretools.vscode-azure-github-copilot/azure_recommend_custom_modes',
				'#tool:github.vscode-pull-request-github/suggest-fix',
				'#tool:openSimpleBrowser',
			].join('\n');
			const markers = await validate(content, PromptsType.prompt);
			const actual = markers.sort((a, b) => a.startLineNumber - b.startLineNumber).map(m => ({ message: m.message, startColumn: m.startColumn, endColumn: m.endColumn }));
			assert.deepEqual(actual, [
				{ message: `Unknown tool or toolset 'ms-azuretools.vscode-azure-github-copilot/azure_recommend_custom_modes'.`, startColumn: 7, endColumn: 77 },
				{ message: `Tool or toolset 'github.vscode-pull-request-github/suggest-fix' also needs to be enabled in the header.`, startColumn: 7, endColumn: 52 },
				{ message: `Unknown tool or toolset 'openSimpleBrowser'.`, startColumn: 7, endColumn: 24 },
			]);
		});

	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_CDATA.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_CDATA.0.snap

```text
<div class="rendered-markdown"><p>

&lt;!--[CDATA[&lt;div--&gt;content]]&gt;</p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_html_comments.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_html_comments.0.snap

```text
<div class="rendered-markdown"><p>

&lt;!-- comment1 &lt;div&gt;&lt;/div&gt; --&gt;</p><div>content</div><p>&lt;!-- comment2 --&gt;</p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_invalid_HTML.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_invalid_HTML.0.snap

```text
<div class="rendered-markdown">

<p>1&lt;canvas&gt;2&lt;/canvas&gt;</p><p>&lt;details&gt;3&lt;/details&gt;4</p><p></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_invalid_HTML_with_attributes.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_invalid_HTML_with_attributes.0.snap

```text
<div class="rendered-markdown">

<p>1</p><p>&lt;details id="id1" style="display: none"&gt;2&lt;details id="my id 2"&gt;3&lt;/details&gt;&lt;/details&gt;4</p><p></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_mixed_valid_and_invalid_HTML.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_mixed_valid_and_invalid_HTML.0.snap

```text
<div class="rendered-markdown">


<h1>heading</h1><p>
&lt;details&gt;
</p><ul>
    <li><span>&lt;details&gt;<i>1</i>&lt;/details&gt;</span></li>
    <li><b>hi</b></li>
</ul><p>
&lt;/details&gt;
</p><pre>&lt;canvas&gt;canvas here&lt;/canvas&gt;</pre><p>&lt;details&gt;&lt;/details&gt;</p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_remote_images_are_disallowed.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_remote_images_are_disallowed.0.snap

```text
<div class="rendered-markdown">

<p><div>&lt;img src="http://disallowed.com/image.jpg"&gt;</div></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_self-closing_elements.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_self-closing_elements.0.snap

```text
<div class="rendered-markdown">

<p>&lt;area&gt;</p><hr><br><p>&lt;input type="text" value="test"&gt;</p><p></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_self-closing_elements.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_self-closing_elements.1.snap

```text
<div class="rendered-markdown">

<p>&lt;area&gt;</p><hr><br><input type="checkbox" disabled=""><p></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_simple.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_simple.0.snap

```text
a
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_supportHtml_with_one-line_markdown.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_supportHtml_with_one-line_markdown.0.snap

```text
<div class="rendered-markdown">

<p><strong>hello</strong></p></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_supportHtml_with_one-line_markdown.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_supportHtml_with_one-line_markdown.1.snap

```text
<div class="rendered-markdown">

<ol>
<li><a href="" title="" draggable="false" data-href="https://example.com"><em>hello</em></a> test <strong>text</strong></li>
</ol>
</div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_valid_HTML.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/__snapshots__/ChatMarkdownRenderer_valid_HTML.0.snap

```text
<div class="rendered-markdown">


<h1>heading</h1>
<ul>
    <li>1</li>
    <li><b>hi</b></li>
</ul>
<pre><code>code here</code></pre></div>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/annotations.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/annotations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IChatMarkdownContent } from '../../common/chatService.js';
import { annotateSpecialMarkdownContent, extractVulnerabilitiesFromText } from '../../common/annotations.js';

function content(str: string): IChatMarkdownContent {
	return { kind: 'markdownContent', content: new MarkdownString(str) };
}

suite('Annotations', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('extractVulnerabilitiesFromText', () => {
		test('single line', async () => {
			const before = 'some code ';
			const vulnContent = 'content with vuln';
			const after = ' after';
			const annotatedResult = annotateSpecialMarkdownContent([content(before), { kind: 'markdownVuln', content: new MarkdownString(vulnContent), vulnerabilities: [{ title: 'title', description: 'vuln' }] }, content(after)]);
			await assertSnapshot(annotatedResult);

			const markdown = annotatedResult[0] as IChatMarkdownContent;
			const result = extractVulnerabilitiesFromText(markdown.content.value);
			await assertSnapshot(result);
		});

		test('multiline', async () => {
			const before = 'some code\nover\nmultiple lines ';
			const vulnContent = 'content with vuln\nand\nnewlines';
			const after = 'more code\nwith newline';
			const annotatedResult = annotateSpecialMarkdownContent([content(before), { kind: 'markdownVuln', content: new MarkdownString(vulnContent), vulnerabilities: [{ title: 'title', description: 'vuln' }] }, content(after)]);
			await assertSnapshot(annotatedResult);

			const markdown = annotatedResult[0] as IChatMarkdownContent;
			const result = extractVulnerabilitiesFromText(markdown.content.value);
			await assertSnapshot(result);
		});

		test('multiple vulns', async () => {
			const before = 'some code\nover\nmultiple lines ';
			const vulnContent = 'content with vuln\nand\nnewlines';
			const after = 'more code\nwith newline';
			const annotatedResult = annotateSpecialMarkdownContent([
				content(before),
				{ kind: 'markdownVuln', content: new MarkdownString(vulnContent), vulnerabilities: [{ title: 'title', description: 'vuln' }] },
				content(after),
				{ kind: 'markdownVuln', content: new MarkdownString(vulnContent), vulnerabilities: [{ title: 'title', description: 'vuln' }] },
			]);
			await assertSnapshot(annotatedResult);

			const markdown = annotatedResult[0] as IChatMarkdownContent;
			const result = extractVulnerabilitiesFromText(markdown.content.value);
			await assertSnapshot(result);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatAgents.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatAgents.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ChatAgentService, IChatAgentData, IChatAgentImplementation } from '../../common/chatAgents.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';

const testAgentId = 'testAgent';
const testAgentData: IChatAgentData = {
	id: testAgentId,
	name: 'Test Agent',
	extensionDisplayName: '',
	extensionId: new ExtensionIdentifier(''),
	extensionVersion: undefined,
	extensionPublisherId: '',
	locations: [],
	modes: [],
	metadata: {},
	slashCommands: [],
	disambiguation: [],
};

class TestingContextKeyService extends MockContextKeyService {
	private _contextMatchesRulesReturnsTrue = false;
	public contextMatchesRulesReturnsTrue() {
		this._contextMatchesRulesReturnsTrue = true;
	}

	public override contextMatchesRules(rules: ContextKeyExpression): boolean {
		return this._contextMatchesRulesReturnsTrue;
	}
}

suite('ChatAgents', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let chatAgentService: ChatAgentService;
	let contextKeyService: TestingContextKeyService;
	setup(() => {
		contextKeyService = new TestingContextKeyService();
		chatAgentService = store.add(new ChatAgentService(contextKeyService, new TestConfigurationService()));
	});

	test('registerAgent', async () => {
		assert.strictEqual(chatAgentService.getAgents().length, 0);


		const agentRegistration = chatAgentService.registerAgent(testAgentId, testAgentData);

		assert.strictEqual(chatAgentService.getAgents().length, 1);
		assert.strictEqual(chatAgentService.getAgents()[0].id, testAgentId);

		assert.throws(() => chatAgentService.registerAgent(testAgentId, testAgentData));

		agentRegistration.dispose();
		assert.strictEqual(chatAgentService.getAgents().length, 0);
	});

	test('agent when clause', async () => {
		assert.strictEqual(chatAgentService.getAgents().length, 0);

		store.add(chatAgentService.registerAgent(testAgentId, {
			...testAgentData,
			when: 'myKey'
		}));
		assert.strictEqual(chatAgentService.getAgents().length, 0);

		contextKeyService.contextMatchesRulesReturnsTrue();
		assert.strictEqual(chatAgentService.getAgents().length, 1);
	});

	suite('registerAgentImplementation', function () {
		const agentImpl: IChatAgentImplementation = {
			invoke: async () => { return {}; },
			provideFollowups: async () => { return []; },
		};

		test('should register an agent implementation', () => {
			store.add(chatAgentService.registerAgent(testAgentId, testAgentData));
			store.add(chatAgentService.registerAgentImplementation(testAgentId, agentImpl));

			const agents = chatAgentService.getActivatedAgents();
			assert.strictEqual(agents.length, 1);
			assert.strictEqual(agents[0].id, testAgentId);
		});

		test('can dispose an agent implementation', () => {
			store.add(chatAgentService.registerAgent(testAgentId, testAgentData));
			const implRegistration = chatAgentService.registerAgentImplementation(testAgentId, agentImpl);
			implRegistration.dispose();

			const agents = chatAgentService.getActivatedAgents();
			assert.strictEqual(agents.length, 0);
		});

		test('should throw error if agent does not exist', () => {
			assert.throws(() => chatAgentService.registerAgentImplementation('nonexistentAgent', agentImpl));
		});

		test('should throw error if agent already has an implementation', () => {
			store.add(chatAgentService.registerAgent(testAgentId, testAgentData));
			store.add(chatAgentService.registerAgentImplementation(testAgentId, agentImpl));

			assert.throws(() => chatAgentService.registerAgentImplementation(testAgentId, agentImpl));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { OffsetRange } from '../../../../../editor/common/core/ranges/offsetRange.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { ChatAgentService, IChatAgentService } from '../../common/chatAgents.js';
import { ChatModel, IExportableChatData, ISerializableChatData1, ISerializableChatData2, ISerializableChatData3, isExportableSessionData, isSerializableSessionData, normalizeSerializableChatData, Response } from '../../common/chatModel.js';
import { ChatRequestTextPart } from '../../common/chatParserTypes.js';
import { IChatService, IChatToolInvocation } from '../../common/chatService.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { MockChatService } from './mockChatService.js';

suite('ChatModel', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService());
		instantiationService.stub(IStorageService, testDisposables.add(new TestStorageService()));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IChatAgentService, testDisposables.add(instantiationService.createInstance(ChatAgentService)));
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IChatService, new MockChatService());
	});

	test('initialization with exported data only (imported)', async () => {
		const exportedData: IExportableChatData = {
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		const model = testDisposables.add(instantiationService.createInstance(
			ChatModel,
			exportedData,
			{ initialLocation: ChatAgentLocation.Chat, canUseTools: true }
		));

		assert.strictEqual(model.isImported, true);
		assert.ok(model.sessionId); // Should have generated ID
		assert.ok(model.timestamp > 0); // Should have generated timestamp
	});

	test('initialization with full serializable data (not imported)', async () => {
		const now = Date.now();
		const serializableData: ISerializableChatData3 = {
			version: 3,
			sessionId: 'existing-session',
			creationDate: now - 1000,
			lastMessageDate: now,
			customTitle: 'My Chat',
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		const model = testDisposables.add(instantiationService.createInstance(
			ChatModel,
			serializableData,
			{ initialLocation: ChatAgentLocation.Chat, canUseTools: true }
		));

		assert.strictEqual(model.isImported, false);
		assert.strictEqual(model.sessionId, 'existing-session');
		assert.strictEqual(model.timestamp, now - 1000);
		assert.strictEqual(model.lastMessageDate, now);
		assert.strictEqual(model.customTitle, 'My Chat');
	});

	test('initialization with invalid data', async () => {
		const invalidData = {
			// Missing required fields
			requests: 'not-an-array'
		} as unknown as IExportableChatData;

		const model = testDisposables.add(instantiationService.createInstance(
			ChatModel,
			invalidData,
			{ initialLocation: ChatAgentLocation.Chat, canUseTools: true }
		));

		// Should handle gracefully with empty state
		assert.strictEqual(model.getRequests().length, 0);
		assert.ok(model.sessionId); // Should have generated ID
	});

	test('initialization without data', async () => {
		const model = testDisposables.add(instantiationService.createInstance(
			ChatModel,
			undefined,
			{ initialLocation: ChatAgentLocation.Chat, canUseTools: true }
		));

		assert.strictEqual(model.isImported, false);
		assert.strictEqual(model.getRequests().length, 0);
		assert.ok(model.sessionId);
		assert.ok(model.timestamp > 0);
	});

	test('removeRequest', async () => {
		const model = testDisposables.add(instantiationService.createInstance(ChatModel, undefined, { initialLocation: ChatAgentLocation.Chat, canUseTools: true }));

		const text = 'hello';
		model.addRequest({ text, parts: [new ChatRequestTextPart(new OffsetRange(0, text.length), new Range(1, text.length, 1, text.length), text)] }, { variables: [] }, 0);
		const requests = model.getRequests();
		assert.strictEqual(requests.length, 1);

		model.removeRequest(requests[0].id);
		assert.strictEqual(model.getRequests().length, 0);
	});

	test('adoptRequest', async function () {
		const model1 = testDisposables.add(instantiationService.createInstance(ChatModel, undefined, { initialLocation: ChatAgentLocation.EditorInline, canUseTools: true }));
		const model2 = testDisposables.add(instantiationService.createInstance(ChatModel, undefined, { initialLocation: ChatAgentLocation.Chat, canUseTools: true }));

		const text = 'hello';
		const request1 = model1.addRequest({ text, parts: [new ChatRequestTextPart(new OffsetRange(0, text.length), new Range(1, text.length, 1, text.length), text)] }, { variables: [] }, 0);

		assert.strictEqual(model1.getRequests().length, 1);
		assert.strictEqual(model2.getRequests().length, 0);
		assert.ok(request1.session === model1);
		assert.ok(request1.response?.session === model1);

		model2.adoptRequest(request1);

		assert.strictEqual(model1.getRequests().length, 0);
		assert.strictEqual(model2.getRequests().length, 1);
		assert.ok(request1.session === model2);
		assert.ok(request1.response?.session === model2);

		model2.acceptResponseProgress(request1, { content: new MarkdownString('Hello'), kind: 'markdownContent' });

		assert.strictEqual(request1.response.response.toString(), 'Hello');
	});

	test('addCompleteRequest', async function () {
		const model1 = testDisposables.add(instantiationService.createInstance(ChatModel, undefined, { initialLocation: ChatAgentLocation.Chat, canUseTools: true }));

		const text = 'hello';
		const request1 = model1.addRequest({ text, parts: [new ChatRequestTextPart(new OffsetRange(0, text.length), new Range(1, text.length, 1, text.length), text)] }, { variables: [] }, 0, undefined, undefined, undefined, undefined, undefined, undefined, true);

		assert.strictEqual(request1.isCompleteAddedRequest, true);
		assert.strictEqual(request1.response!.isCompleteAddedRequest, true);
		assert.strictEqual(request1.shouldBeRemovedOnSend, undefined);
		assert.strictEqual(request1.response!.shouldBeRemovedOnSend, undefined);
	});
});

suite('Response', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('mergeable markdown', async () => {
		const response = store.add(new Response([]));
		response.updateContent({ content: new MarkdownString('markdown1'), kind: 'markdownContent' });
		response.updateContent({ content: new MarkdownString('markdown2'), kind: 'markdownContent' });
		await assertSnapshot(response.value);

		assert.strictEqual(response.toString(), 'markdown1markdown2');
	});

	test('not mergeable markdown', async () => {
		const response = store.add(new Response([]));
		const md1 = new MarkdownString('markdown1');
		md1.supportHtml = true;
		response.updateContent({ content: md1, kind: 'markdownContent' });
		response.updateContent({ content: new MarkdownString('markdown2'), kind: 'markdownContent' });
		await assertSnapshot(response.value);
	});

	test('inline reference', async () => {
		const response = store.add(new Response([]));
		response.updateContent({ content: new MarkdownString('text before '), kind: 'markdownContent' });
		response.updateContent({ inlineReference: URI.parse('https://microsoft.com/'), kind: 'inlineReference' });
		response.updateContent({ content: new MarkdownString(' text after'), kind: 'markdownContent' });
		await assertSnapshot(response.value);

		assert.strictEqual(response.toString(), 'text before https://microsoft.com/ text after');

	});

	test('consolidated edit summary', async () => {
		const response = store.add(new Response([]));
		response.updateContent({ content: new MarkdownString('Some content before edits'), kind: 'markdownContent' });
		response.updateContent({ kind: 'textEditGroup', uri: URI.parse('file:///file1.ts'), edits: [], state: undefined, done: true });
		response.updateContent({ kind: 'textEditGroup', uri: URI.parse('file:///file2.ts'), edits: [], state: undefined, done: true });
		response.updateContent({ content: new MarkdownString('Some content after edits'), kind: 'markdownContent' });

		// Should have single "Made changes." at the end instead of multiple entries
		const responseString = response.toString();
		const madeChangesCount = (responseString.match(/Made changes\./g) || []).length;
		assert.strictEqual(madeChangesCount, 1, 'Should have exactly one "Made changes." message');
		assert.ok(responseString.includes('Some content before edits'), 'Should include content before edits');
		assert.ok(responseString.includes('Some content after edits'), 'Should include content after edits');
		assert.ok(responseString.endsWith('Made changes.'), 'Should end with "Made changes."');
	});

	test('no edit summary when no edits', async () => {
		const response = store.add(new Response([]));
		response.updateContent({ content: new MarkdownString('Some content'), kind: 'markdownContent' });
		response.updateContent({ content: new MarkdownString('More content'), kind: 'markdownContent' });

		// Should not have "Made changes." when there are no edit groups
		const responseString = response.toString();
		assert.ok(!responseString.includes('Made changes.'), 'Should not include "Made changes." when no edits present');
		assert.strictEqual(responseString, 'Some contentMore content');
	});

	test('consolidated edit summary with clear operation', async () => {
		const response = store.add(new Response([]));
		response.updateContent({ content: new MarkdownString('Initial content'), kind: 'markdownContent' });
		response.updateContent({ kind: 'textEditGroup', uri: URI.parse('file:///file1.ts'), edits: [], state: undefined, done: true });
		response.updateContent({ kind: 'clearToPreviousToolInvocation', reason: 1 });
		response.updateContent({ content: new MarkdownString('Content after clear'), kind: 'markdownContent' });
		response.updateContent({ kind: 'textEditGroup', uri: URI.parse('file:///file2.ts'), edits: [], state: undefined, done: true });

		// Should only show "Made changes." for edits after the clear operation
		const responseString = response.toString();
		const madeChangesCount = (responseString.match(/Made changes\./g) || []).length;
		assert.strictEqual(madeChangesCount, 1, 'Should have exactly one "Made changes." message after clear');
		assert.ok(responseString.includes('Content after clear'), 'Should include content after clear');
		assert.ok(!responseString.includes('Initial content'), 'Should not include content before clear');
		assert.ok(responseString.endsWith('Made changes.'), 'Should end with "Made changes."');
	});
});

suite('normalizeSerializableChatData', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('v1', () => {
		const v1Data: ISerializableChatData1 = {
			creationDate: Date.now(),
			initialLocation: undefined,
			requests: [],
			responderAvatarIconUri: undefined,
			responderUsername: 'bot',
			sessionId: 'session1',
		};

		const newData = normalizeSerializableChatData(v1Data);
		assert.strictEqual(newData.creationDate, v1Data.creationDate);
		assert.strictEqual(newData.lastMessageDate, v1Data.creationDate);
		assert.strictEqual(newData.version, 3);
		assert.ok('customTitle' in newData);
	});

	test('v2', () => {
		const v2Data: ISerializableChatData2 = {
			version: 2,
			creationDate: 100,
			lastMessageDate: Date.now(),
			initialLocation: undefined,
			requests: [],
			responderAvatarIconUri: undefined,
			responderUsername: 'bot',
			sessionId: 'session1',
			computedTitle: 'computed title'
		};

		const newData = normalizeSerializableChatData(v2Data);
		assert.strictEqual(newData.version, 3);
		assert.strictEqual(newData.creationDate, v2Data.creationDate);
		assert.strictEqual(newData.lastMessageDate, v2Data.lastMessageDate);
		assert.strictEqual(newData.customTitle, v2Data.computedTitle);
	});

	test('old bad data', () => {
		const v1Data: ISerializableChatData1 = {
			// Testing the scenario where these are missing
			sessionId: undefined!,
			creationDate: undefined!,

			initialLocation: undefined,
			requests: [],
			responderAvatarIconUri: undefined,
			responderUsername: 'bot',
		};

		const newData = normalizeSerializableChatData(v1Data);
		assert.strictEqual(newData.version, 3);
		assert.ok(newData.creationDate > 0);
		assert.ok(newData.lastMessageDate > 0);
		assert.ok(newData.sessionId);
	});

	test('v3 with bug', () => {
		const v3Data: ISerializableChatData3 = {
			// Test case where old data was wrongly normalized and these fields were missing
			creationDate: undefined!,
			lastMessageDate: undefined!,

			version: 3,
			initialLocation: undefined,
			requests: [],
			responderAvatarIconUri: undefined,
			responderUsername: 'bot',
			sessionId: 'session1',
			customTitle: 'computed title'
		};

		const newData = normalizeSerializableChatData(v3Data);
		assert.strictEqual(newData.version, 3);
		assert.ok(newData.creationDate > 0);
		assert.ok(newData.lastMessageDate > 0);
		assert.ok(newData.sessionId);
	});
});

suite('isExportableSessionData', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('valid exportable data', () => {
		const validData: IExportableChatData = {
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isExportableSessionData(validData), true);
	});

	test('invalid - missing requests', () => {
		const invalidData = {
			initialLocation: ChatAgentLocation.Chat,
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isExportableSessionData(invalidData), false);
	});

	test('invalid - requests not array', () => {
		const invalidData = {
			initialLocation: ChatAgentLocation.Chat,
			requests: 'not-an-array',
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isExportableSessionData(invalidData), false);
	});

	test('invalid - missing responderUsername', () => {
		const invalidData = {
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isExportableSessionData(invalidData), false);
	});

	test('invalid - responderUsername not string', () => {
		const invalidData = {
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 123,
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isExportableSessionData(invalidData), false);
	});

	test('invalid - null', () => {
		assert.strictEqual(isExportableSessionData(null), false);
	});

	test('invalid - undefined', () => {
		assert.strictEqual(isExportableSessionData(undefined), false);
	});
});

suite('isSerializableSessionData', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('valid serializable data', () => {
		const validData: ISerializableChatData3 = {
			version: 3,
			sessionId: 'session1',
			creationDate: Date.now(),
			lastMessageDate: Date.now(),
			customTitle: undefined,
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isSerializableSessionData(validData), true);
	});

	test('valid - with usedContext', () => {
		const validData: ISerializableChatData3 = {
			version: 3,
			sessionId: 'session1',
			creationDate: Date.now(),
			lastMessageDate: Date.now(),
			customTitle: undefined,
			initialLocation: ChatAgentLocation.Chat,
			requests: [{
				requestId: 'req1',
				message: 'test',
				variableData: { variables: [] },
				response: undefined,
				usedContext: { documents: [], kind: 'usedContext' }
			}],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isSerializableSessionData(validData), true);
	});

	test('invalid - missing sessionId', () => {
		const invalidData = {
			version: 3,
			creationDate: Date.now(),
			lastMessageDate: Date.now(),
			customTitle: undefined,
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isSerializableSessionData(invalidData), false);
	});

	test('invalid - missing creationDate', () => {
		const invalidData = {
			version: 3,
			sessionId: 'session1',
			lastMessageDate: Date.now(),
			customTitle: undefined,
			initialLocation: ChatAgentLocation.Chat,
			requests: [],
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isSerializableSessionData(invalidData), false);
	});

	test('invalid - not exportable', () => {
		const invalidData = {
			version: 3,
			sessionId: 'session1',
			creationDate: Date.now(),
			lastMessageDate: Date.now(),
			customTitle: undefined,
			initialLocation: ChatAgentLocation.Chat,
			requests: 'not-an-array',
			responderUsername: 'bot',
			responderAvatarIconUri: undefined
		};

		assert.strictEqual(isSerializableSessionData(invalidData), false);
	});
});

suite('ChatResponseModel', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService());
		instantiationService.stub(IStorageService, testDisposables.add(new TestStorageService()));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IChatAgentService, testDisposables.add(instantiationService.createInstance(ChatAgentService)));
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IChatService, new MockChatService());
	});

	test('timestamp and confirmationAdjustedTimestamp', async () => {
		const clock = sinon.useFakeTimers();
		try {
			const model = testDisposables.add(instantiationService.createInstance(ChatModel, undefined, { initialLocation: ChatAgentLocation.Chat, canUseTools: true }));
			const start = Date.now();

			const text = 'hello';
			const request = model.addRequest({ text, parts: [new ChatRequestTextPart(new OffsetRange(0, text.length), new Range(1, text.length, 1, text.length), text)] }, { variables: [] }, 0);
			const response = request.response!;

			assert.strictEqual(response.timestamp, start);
			assert.strictEqual(response.confirmationAdjustedTimestamp.get(), start);

			// Advance time, no pending confirmation
			clock.tick(1000);
			assert.strictEqual(response.confirmationAdjustedTimestamp.get(), start);

			// Add pending confirmation via tool invocation
			const toolState = observableValue<any>('state', { type: 0 /* IChatToolInvocation.StateKind.WaitingForConfirmation */ });
			const toolInvocation = {
				kind: 'toolInvocation',
				invocationMessage: 'calling tool',
				confirmationMessages: { title: 'Please confirm' },
				state: toolState
			} as Partial<IChatToolInvocation> as IChatToolInvocation;

			model.acceptResponseProgress(request, toolInvocation);

			// Advance time while pending
			clock.tick(2000);
			// Timestamp should still be start (it includes the wait time while waiting)
			assert.strictEqual(response.confirmationAdjustedTimestamp.get(), start);

			// Resolve confirmation
			toolState.set({ type: 3 /* IChatToolInvocation.StateKind.Completed */ }, undefined);

			// Now adjusted timestamp should reflect the wait time
			// The wait time was 2000ms.
			// confirmationAdjustedTimestamp = start + waitTime = start + 2000
			assert.strictEqual(response.confirmationAdjustedTimestamp.get(), start + 2000);

			// Advance time again
			clock.tick(1000);
			assert.strictEqual(response.confirmationAdjustedTimestamp.get(), start + 2000);

		} finally {
			clock.restore();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatModelStore.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatModelStore.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DeferredPromise } from '../../../../../base/common/async.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { ChatModel } from '../../common/chatModel.js';
import { ChatModelStore, IStartSessionProps } from '../../common/chatModelStore.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { MockChatModel } from './mockChatModel.js';

suite('ChatModelStore', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let testObject: ChatModelStore;
	let createdModels: MockChatModel[];
	let willDisposePromises: DeferredPromise<void>[];

	setup(() => {
		createdModels = [];
		willDisposePromises = [];
		testObject = store.add(new ChatModelStore({
			createModel: (props: IStartSessionProps) => {
				const model = new MockChatModel(props.sessionResource);
				createdModels.push(model);
				return model as unknown as ChatModel;
			},
			willDisposeModel: async (model: ChatModel) => {
				const p = new DeferredPromise<void>();
				willDisposePromises.push(p);
				await p.p;
			}
		}, new NullLogService()));
	});

	test('create and dispose', async () => {
		const uri = URI.parse('test://session');
		const props: IStartSessionProps = {
			sessionResource: uri,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		const ref = testObject.acquireOrCreate(props);
		assert.strictEqual(createdModels.length, 1);
		assert.strictEqual(ref.object, createdModels[0]);

		ref.dispose();
		assert.strictEqual(willDisposePromises.length, 1);

		willDisposePromises[0].complete();
		await testObject.waitForModelDisposals();
		assert.strictEqual(testObject.get(uri), undefined);
	});

	test('resurrection', async () => {
		const uri = URI.parse('test://session');
		const props: IStartSessionProps = {
			sessionResource: uri,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		const ref1 = testObject.acquireOrCreate(props);
		const model1 = ref1.object;
		ref1.dispose();

		// Model is pending disposal
		assert.strictEqual(willDisposePromises.length, 1);
		assert.strictEqual(testObject.get(uri), model1);

		// Acquire again - should be resurrected
		const ref2 = testObject.acquireOrCreate(props);
		assert.strictEqual(ref2.object, model1);
		assert.strictEqual(createdModels.length, 1);

		// Finish disposal of the first ref
		willDisposePromises[0].complete();
		await testObject.waitForModelDisposals();

		// Model should still exist because ref2 holds it
		assert.strictEqual(testObject.get(uri), model1);

		ref2.dispose();
	});

	test('get and has', async () => {
		const uri = URI.parse('test://session');
		const props: IStartSessionProps = {
			sessionResource: uri,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		const ref = testObject.acquireOrCreate(props);
		assert.strictEqual(testObject.get(uri), ref.object);
		assert.strictEqual(testObject.has(uri), true);

		ref.dispose();
		willDisposePromises[0].complete();
		await testObject.waitForModelDisposals();

		assert.strictEqual(testObject.get(uri), undefined);
		assert.strictEqual(testObject.has(uri), false);
	});

	test('acquireExisting', async () => {
		const uri = URI.parse('test://session');
		const props: IStartSessionProps = {
			sessionResource: uri,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		assert.strictEqual(testObject.acquireExisting(uri), undefined);

		const ref1 = testObject.acquireOrCreate(props);
		const ref2 = testObject.acquireExisting(uri);
		assert.ok(ref2);
		assert.strictEqual(ref2.object, ref1.object);

		ref1.dispose();
		ref2.dispose();
		willDisposePromises[0].complete();
		await testObject.waitForModelDisposals();
	});

	test('values', async () => {
		const uri1 = URI.parse('test://session1');
		const uri2 = URI.parse('test://session2');
		const props1: IStartSessionProps = {
			sessionResource: uri1,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};
		const props2: IStartSessionProps = {
			sessionResource: uri2,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		const ref1 = testObject.acquireOrCreate(props1);
		const ref2 = testObject.acquireOrCreate(props2);

		const values = Array.from(testObject.values());
		assert.strictEqual(values.length, 2);
		assert.ok(values.includes(ref1.object));
		assert.ok(values.includes(ref2.object));

		ref1.dispose();
		ref2.dispose();
		willDisposePromises[0].complete();
		willDisposePromises[1].complete();
		await testObject.waitForModelDisposals();
	});

	test('dispose store', async () => {
		const uri = URI.parse('test://session');
		const props: IStartSessionProps = {
			sessionResource: uri,
			location: ChatAgentLocation.Chat,
			canUseTools: true
		};

		const ref = testObject.acquireOrCreate(props);
		const model = ref.object as unknown as MockChatModel;
		testObject.dispose();

		assert.strictEqual(model.isDisposed, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatModeService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatModeService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { Emitter } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IChatAgentService } from '../../common/chatAgents.js';
import { ChatMode, ChatModeService } from '../../common/chatModes.js';
import { ChatModeKind } from '../../common/constants.js';
import { IAgentSource, ICustomAgent, IPromptsService, PromptsStorage } from '../../common/promptSyntax/service/promptsService.js';
import { MockPromptsService } from './mockPromptsService.js';

class TestChatAgentService implements Partial<IChatAgentService> {
	_serviceBrand: undefined;

	private _hasToolsAgent = true;
	private readonly _onDidChangeAgents = new Emitter<any>();

	get hasToolsAgent(): boolean {
		return this._hasToolsAgent;
	}

	setHasToolsAgent(value: boolean): void {
		this._hasToolsAgent = value;
		this._onDidChangeAgents.fire(undefined);
	}

	readonly onDidChangeAgents = this._onDidChangeAgents.event;
}

suite('ChatModeService', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	const workspaceSource: IAgentSource = { storage: PromptsStorage.local };

	let instantiationService: TestInstantiationService;
	let promptsService: MockPromptsService;
	let chatAgentService: TestChatAgentService;
	let storageService: TestStorageService;
	let configurationService: TestConfigurationService;
	let chatModeService: ChatModeService;

	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService());
		promptsService = new MockPromptsService();
		chatAgentService = new TestChatAgentService();
		storageService = testDisposables.add(new TestStorageService());
		configurationService = new TestConfigurationService();

		instantiationService.stub(IPromptsService, promptsService);
		instantiationService.stub(IChatAgentService, chatAgentService);
		instantiationService.stub(IStorageService, storageService);
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IConfigurationService, configurationService);

		chatModeService = testDisposables.add(instantiationService.createInstance(ChatModeService));
	});

	test('should return builtin modes', () => {
		const modes = chatModeService.getModes();

		assert.strictEqual(modes.builtin.length, 3);
		assert.strictEqual(modes.custom.length, 0);

		// Check that Ask mode is always present
		const askMode = modes.builtin.find(mode => mode.id === ChatModeKind.Ask);
		assert.ok(askMode);
		assert.strictEqual(askMode.label.get(), 'Ask');
		assert.strictEqual(askMode.name.get(), 'ask');
		assert.strictEqual(askMode.kind, ChatModeKind.Ask);
	});

	test('should adjust builtin modes based on tools agent availability', () => {
		// Agent mode should always be present regardless of tools agent availability
		chatAgentService.setHasToolsAgent(true);
		let agents = chatModeService.getModes();
		assert.ok(agents.builtin.find(agent => agent.id === ChatModeKind.Agent));

		// Without tools agent - Agent mode should not be present
		chatAgentService.setHasToolsAgent(false);
		agents = chatModeService.getModes();
		assert.strictEqual(agents.builtin.find(agent => agent.id === ChatModeKind.Agent), undefined);

		// Ask and Edit modes should always be present
		assert.ok(agents.builtin.find(agent => agent.id === ChatModeKind.Ask));
		assert.ok(agents.builtin.find(agent => agent.id === ChatModeKind.Edit));
	});

	test('should find builtin modes by id', () => {
		const agentMode = chatModeService.findModeById(ChatModeKind.Agent);
		assert.ok(agentMode);
		assert.strictEqual(agentMode.id, ChatMode.Agent.id);
		assert.strictEqual(agentMode.kind, ChatModeKind.Agent);
	});

	test('should return undefined for non-existent mode', () => {
		const mode = chatModeService.findModeById('non-existent-mode');
		assert.strictEqual(mode, undefined);
	});

	test('should handle custom modes from prompts service', async () => {
		const customMode: ICustomAgent = {
			uri: URI.parse('file:///test/custom-mode.md'),
			name: 'Test Mode',
			description: 'A test custom mode',
			tools: ['tool1', 'tool2'],
			agentInstructions: { content: 'Custom mode body', toolReferences: [] },
			source: workspaceSource
		};

		promptsService.setCustomModes([customMode]);

		// Wait for the service to refresh
		await timeout(0);

		const modes = chatModeService.getModes();
		assert.strictEqual(modes.custom.length, 1);

		const testMode = modes.custom[0];
		assert.strictEqual(testMode.id, customMode.uri.toString());
		assert.strictEqual(testMode.name.get(), customMode.name);
		assert.strictEqual(testMode.label.get(), customMode.name);
		assert.strictEqual(testMode.description.get(), customMode.description);
		assert.strictEqual(testMode.kind, ChatModeKind.Agent);
		assert.deepStrictEqual(testMode.customTools?.get(), customMode.tools);
		assert.deepStrictEqual(testMode.modeInstructions?.get(), customMode.agentInstructions);
		assert.deepStrictEqual(testMode.handOffs?.get(), customMode.handOffs);
		assert.strictEqual(testMode.uri?.get().toString(), customMode.uri.toString());
		assert.deepStrictEqual(testMode.source, workspaceSource);
	});

	test('should fire change event when custom modes are updated', async () => {
		let eventFired = false;
		testDisposables.add(chatModeService.onDidChangeChatModes(() => {
			eventFired = true;
		}));

		const customMode: ICustomAgent = {
			uri: URI.parse('file:///test/custom-mode.md'),
			name: 'Test Mode',
			description: 'A test custom mode',
			tools: [],
			agentInstructions: { content: 'Custom mode body', toolReferences: [] },
			source: workspaceSource,
		};

		promptsService.setCustomModes([customMode]);

		// Wait for the event to fire
		await timeout(0);

		assert.ok(eventFired);
	});

	test('should find custom modes by id', async () => {
		const customMode: ICustomAgent = {
			uri: URI.parse('file:///test/findable-mode.md'),
			name: 'Findable Mode',
			description: 'A findable custom mode',
			tools: [],
			agentInstructions: { content: 'Findable mode body', toolReferences: [] },
			source: workspaceSource,
		};

		promptsService.setCustomModes([customMode]);

		// Wait for the service to refresh
		await timeout(0);

		const foundMode = chatModeService.findModeById(customMode.uri.toString());
		assert.ok(foundMode);
		assert.strictEqual(foundMode.id, customMode.uri.toString());
		assert.strictEqual(foundMode.name.get(), customMode.name);
		assert.strictEqual(foundMode.label.get(), customMode.name);
	});

	test('should update existing custom mode instances when data changes', async () => {
		const uri = URI.parse('file:///test/updateable-mode.md');
		const initialMode: ICustomAgent = {
			uri,
			name: 'Initial Mode',
			description: 'Initial description',
			tools: ['tool1'],
			agentInstructions: { content: 'Initial body', toolReferences: [] },
			model: 'gpt-4',
			source: workspaceSource,
		};

		promptsService.setCustomModes([initialMode]);
		await timeout(0);

		const initialModes = chatModeService.getModes();
		const initialCustomMode = initialModes.custom[0];
		assert.strictEqual(initialCustomMode.description.get(), 'Initial description');

		// Update the mode data
		const updatedMode: ICustomAgent = {
			...initialMode,
			description: 'Updated description',
			tools: ['tool1', 'tool2'],
			agentInstructions: { content: 'Updated body', toolReferences: [] },
			model: 'Updated model'
		};

		promptsService.setCustomModes([updatedMode]);
		await timeout(0);

		const updatedModes = chatModeService.getModes();
		const updatedCustomMode = updatedModes.custom[0];

		// The instance should be the same (reused)
		assert.strictEqual(initialCustomMode, updatedCustomMode);

		// But the observable properties should be updated
		assert.strictEqual(updatedCustomMode.description.get(), 'Updated description');
		assert.deepStrictEqual(updatedCustomMode.customTools?.get(), ['tool1', 'tool2']);
		assert.deepStrictEqual(updatedCustomMode.modeInstructions?.get(), { content: 'Updated body', toolReferences: [] });
		assert.strictEqual(updatedCustomMode.model?.get(), 'Updated model');
		assert.deepStrictEqual(updatedCustomMode.source, workspaceSource);
	});

	test('should remove custom modes that no longer exist', async () => {
		const mode1: ICustomAgent = {
			uri: URI.parse('file:///test/mode1.md'),
			name: 'Mode 1',
			description: 'First mode',
			tools: [],
			agentInstructions: { content: 'Mode 1 body', toolReferences: [] },
			source: workspaceSource,
		};

		const mode2: ICustomAgent = {
			uri: URI.parse('file:///test/mode2.md'),
			name: 'Mode 2',
			description: 'Second mode',
			tools: [],
			agentInstructions: { content: 'Mode 2 body', toolReferences: [] },
			source: workspaceSource,
		};

		// Add both modes
		promptsService.setCustomModes([mode1, mode2]);
		await timeout(0);

		let modes = chatModeService.getModes();
		assert.strictEqual(modes.custom.length, 2);

		// Remove one mode
		promptsService.setCustomModes([mode1]);
		await timeout(0);

		modes = chatModeService.getModes();
		assert.strictEqual(modes.custom.length, 1);
		assert.strictEqual(modes.custom[0].id, mode1.uri.toString());
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatRequestParser.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatRequestParser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mockObject } from '../../../../../base/test/common/mock.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { ChatAgentService, IChatAgentCommand, IChatAgentData, IChatAgentService } from '../../common/chatAgents.js';
import { ChatRequestParser } from '../../common/chatRequestParser.js';
import { IChatService } from '../../common/chatService.js';
import { IChatSlashCommandService } from '../../common/chatSlashCommands.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';
import { IChatVariablesService } from '../../common/chatVariables.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { IToolData, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { MockChatService } from './mockChatService.js';
import { MockChatVariablesService } from './mockChatVariables.js';
import { MockPromptsService } from './mockPromptsService.js';

const testSessionUri = LocalChatSessionUri.forSession('test-session');

suite('ChatRequestParser', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let parser: ChatRequestParser;

	let variableService: MockChatVariablesService;
	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService());
		instantiationService.stub(IStorageService, testDisposables.add(new TestStorageService()));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IChatService, new MockChatService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IChatAgentService, testDisposables.add(instantiationService.createInstance(ChatAgentService)));
		instantiationService.stub(IPromptsService, testDisposables.add(new MockPromptsService()));

		variableService = new MockChatVariablesService();
		instantiationService.stub(IChatVariablesService, variableService);
	});

	test('plain text', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, 'test');
		await assertSnapshot(result);
	});

	test('plain text with newlines', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'line 1\nline 2\r\nline 3';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('slash in text', async () => {
		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'can we add a new file for an Express router to handle the / route';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('slash command', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/fix this';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('invalid slash command', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/explain this';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('multiple slash commands', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/fix /fix';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('slash command not first', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'Hello /fix';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('slash command after whitespace', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '    /fix';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('prompt slash command', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.isValidSlashCommandName.callsFake((command: string) => {
			return !!command.match(/^[\w_\-\.]+$/);
		});
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '    /prompt';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('prompt slash command after text', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.isValidSlashCommandName.callsFake((command: string) => {
			return !!command.match(/^[\w_\-\.]+$/);
		});
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = 'handle the / route and the request of /search-option';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('prompt slash command after slash', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.isValidSlashCommandName.callsFake((command: string) => {
			return !!command.match(/^[\w_\-\.]+$/);

		});
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/ route and the request of /search-option';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	test('prompt slash command with numbers', async () => {
		const slashCommandService = mockObject<IChatSlashCommandService>()({});
		slashCommandService.getCommands.returns([{ command: 'fix' }]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatSlashCommandService, slashCommandService as any);

		const promptSlashCommandService = mockObject<IPromptsService>()({});
		promptSlashCommandService.isValidSlashCommandName.callsFake((command: string) => {
			return !!command.match(/^[\w_\-\.]+$/);
		});
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IPromptsService, promptSlashCommandService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const text = '/001-sample this is a test';
		const result = parser.parseChatRequest(testSessionUri, text);
		await assertSnapshot(result);
	});

	// test('variables', async () => {
	// 	varService.hasVariable.returns(true);
	// 	varService.getVariable.returns({ id: 'copilot.selection' });

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What does #selection mean?';
	// 	const result = parser.parseChatRequest(testSessionUri, text);
	// 	await assertSnapshot(result);
	// });

	// test('variable with question mark', async () => {
	// 	varService.hasVariable.returns(true);
	// 	varService.getVariable.returns({ id: 'copilot.selection' });

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What is #selection?';
	// 	const result = parser.parseChatRequest(testSessionUri, text);
	// 	await assertSnapshot(result);
	// });

	// test('invalid variables', async () => {
	// 	varService.hasVariable.returns(false);

	// 	parser = instantiationService.createInstance(ChatRequestParser);
	// 	const text = 'What does #selection mean?';
	// 	const result = parser.parseChatRequest(testSessionUri, text);
	// 	await assertSnapshot(result);
	// });

	const getAgentWithSlashCommands = (slashCommands: IChatAgentCommand[]) => {
		return { id: 'agent', name: 'agent', extensionId: nullExtensionDescription.identifier, extensionVersion: undefined, publisherDisplayName: '', extensionDisplayName: '', extensionPublisherId: '', locations: [ChatAgentLocation.Chat], modes: [ChatModeKind.Ask], metadata: {}, slashCommands, disambiguation: [] } satisfies IChatAgentData;
	};

	test('agent with subcommand after text', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent Please do /subCommand thanks');
		await assertSnapshot(result);
	});

	test('agents, subCommand', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent /subCommand Please do thanks');
		await assertSnapshot(result);
	});

	test('agent but edit mode', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent hello', undefined, { mode: ChatModeKind.Edit });
		await assertSnapshot(result);
	});

	test('agent with question mark', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent? Are you there');
		await assertSnapshot(result);
	});

	test('agent and subcommand with leading whitespace', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '    \r\n\t   @agent \r\n\t   /subCommand Thanks');
		await assertSnapshot(result);
	});

	test('agent and subcommand after newline', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '    \n@agent\n/subCommand Thanks');
		await assertSnapshot(result);
	});

	test('agent not first', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, 'Hello Mr. @agent');
		await assertSnapshot(result);
	});

	test('agents and tools and multiline', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		variableService.setSelectedToolAndToolSets(testSessionUri, new Map([
			[{ id: 'get_selection', toolReferenceName: 'selection', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }, true],
			[{ id: 'get_debugConsole', toolReferenceName: 'debugConsole', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }, true]
		] satisfies [IToolData | ToolSet, boolean][]));

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent /subCommand \nPlease do with #selection\nand #debugConsole');
		await assertSnapshot(result);
	});

	test('agents and tools and multiline, part2', async () => {
		const agentsService = mockObject<IChatAgentService>()({});
		agentsService.getAgentsByName.returns([getAgentWithSlashCommands([{ name: 'subCommand', description: '' }])]);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IChatAgentService, agentsService as any);

		variableService.setSelectedToolAndToolSets(testSessionUri, new Map([
			[{ id: 'get_selection', toolReferenceName: 'selection', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }, true],
			[{ id: 'get_debugConsole', toolReferenceName: 'debugConsole', canBeReferencedInPrompt: true, displayName: '', modelDescription: '', source: ToolDataSource.Internal }, true]
		] satisfies [IToolData | ToolSet, boolean][]));

		parser = instantiationService.createInstance(ChatRequestParser);
		const result = parser.parseChatRequest(testSessionUri, '@agent Please \ndo /subCommand with #selection\nand #debugConsole');
		await assertSnapshot(result);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { constObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchAssignmentService } from '../../../../services/assignment/common/assignmentService.js';
import { NullWorkbenchAssignmentService } from '../../../../services/assignment/test/common/nullAssignmentService.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { InMemoryTestFileService, mock, TestContextService, TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';
import { TestMcpService } from '../../../mcp/test/common/testMcpService.js';
import { ChatAgentService, IChatAgent, IChatAgentData, IChatAgentImplementation, IChatAgentService } from '../../common/chatAgents.js';
import { IChatEditingService, IChatEditingSession } from '../../common/chatEditingService.js';
import { ChatModel, IChatModel, ISerializableChatData } from '../../common/chatModel.js';
import { IChatFollowup, IChatModelReference, IChatService } from '../../common/chatService.js';
import { ChatService } from '../../common/chatServiceImpl.js';
import { ChatSlashCommandService, IChatSlashCommandService } from '../../common/chatSlashCommands.js';
import { IChatVariablesService } from '../../common/chatVariables.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { MockChatService } from './mockChatService.js';
import { MockChatVariablesService } from './mockChatVariables.js';

const chatAgentWithUsedContextId = 'ChatProviderWithUsedContext';
const chatAgentWithUsedContext: IChatAgent = {
	id: chatAgentWithUsedContextId,
	name: chatAgentWithUsedContextId,
	extensionId: nullExtensionDescription.identifier,
	extensionVersion: undefined,
	publisherDisplayName: '',
	extensionPublisherId: '',
	extensionDisplayName: '',
	locations: [ChatAgentLocation.Chat],
	modes: [ChatModeKind.Ask],
	metadata: {},
	slashCommands: [],
	disambiguation: [],
	async invoke(request, progress, history, token) {
		progress([{
			documents: [
				{
					uri: URI.file('/test/path/to/file'),
					version: 3,
					ranges: [
						new Range(1, 1, 2, 2)
					]
				}
			],
			kind: 'usedContext'
		}]);

		return { metadata: { metadataKey: 'value' } };
	},
	async provideFollowups(sessionId, token) {
		return [{ kind: 'reply', message: 'Something else', agentId: '', tooltip: 'a tooltip' } satisfies IChatFollowup];
	},
};

const chatAgentWithMarkdownId = 'ChatProviderWithMarkdown';
const chatAgentWithMarkdown: IChatAgent = {
	id: chatAgentWithMarkdownId,
	name: chatAgentWithMarkdownId,
	extensionId: nullExtensionDescription.identifier,
	extensionVersion: undefined,
	publisherDisplayName: '',
	extensionPublisherId: '',
	extensionDisplayName: '',
	locations: [ChatAgentLocation.Chat],
	modes: [ChatModeKind.Ask],
	metadata: {},
	slashCommands: [],
	disambiguation: [],
	async invoke(request, progress, history, token) {
		progress([{ kind: 'markdownContent', content: new MarkdownString('test') }]);
		return { metadata: { metadataKey: 'value' } };
	},
	async provideFollowups(sessionId, token) {
		return [];
	},
};

function getAgentData(id: string): IChatAgentData {
	return {
		name: id,
		id: id,
		extensionId: nullExtensionDescription.identifier,
		extensionVersion: undefined,
		extensionPublisherId: '',
		publisherDisplayName: '',
		extensionDisplayName: '',
		locations: [ChatAgentLocation.Chat],
		modes: [ChatModeKind.Ask],
		metadata: {},
		slashCommands: [],
		disambiguation: [],
	};
}

suite('ChatService', () => {
	const testDisposables = new DisposableStore();

	let instantiationService: TestInstantiationService;
	let testFileService: InMemoryTestFileService;

	let chatAgentService: IChatAgentService;
	const testServices: ChatService[] = [];

	/**
	 * Ensure we wait for model disposals from all created ChatServices
	 */
	function createChatService(): ChatService {
		const service = testDisposables.add(instantiationService.createInstance(ChatService));
		testServices.push(service);
		return service;
	}

	function startSessionModel(service: IChatService, location: ChatAgentLocation = ChatAgentLocation.Chat): IChatModelReference {
		const ref = testDisposables.add(service.startSession(location));
		return ref;
	}

	async function getOrRestoreModel(service: IChatService, resource: URI): Promise<IChatModel | undefined> {
		const ref = await service.getOrRestoreSession(resource);
		if (!ref) {
			return undefined;
		}
		return testDisposables.add(ref).object;
	}

	setup(async () => {
		instantiationService = testDisposables.add(new TestInstantiationService(new ServiceCollection(
			[IChatVariablesService, new MockChatVariablesService()],
			[IWorkbenchAssignmentService, new NullWorkbenchAssignmentService()],
			[IMcpService, new TestMcpService()],
		)));
		instantiationService.stub(IStorageService, testDisposables.add(new TestStorageService()));
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(IExtensionService, new TestExtensionService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IViewsService, new TestExtensionService());
		instantiationService.stub(IWorkspaceContextService, new TestContextService());
		instantiationService.stub(IChatSlashCommandService, testDisposables.add(instantiationService.createInstance(ChatSlashCommandService)));
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IChatService, new MockChatService());
		instantiationService.stub(IEnvironmentService, { workspaceStorageHome: URI.file('/test/path/to/workspaceStorage') });
		instantiationService.stub(ILifecycleService, { onWillShutdown: Event.None });
		instantiationService.stub(IChatEditingService, new class extends mock<IChatEditingService>() {
			override startOrContinueGlobalEditingSession(): IChatEditingSession {
				return {
					state: constObservable('idle'),
					requestDisablement: observableValue('requestDisablement', []),
					entries: constObservable([]),
					dispose: () => { }
				} as unknown as IChatEditingSession;
			}
		});

		// Configure test file service with tracking and in-memory storage
		testFileService = testDisposables.add(new InMemoryTestFileService());
		instantiationService.stub(IFileService, testFileService);

		chatAgentService = testDisposables.add(instantiationService.createInstance(ChatAgentService));
		instantiationService.stub(IChatAgentService, chatAgentService);

		const agent: IChatAgentImplementation = {
			async invoke(request, progress, history, token) {
				return {};
			},
		};
		testDisposables.add(chatAgentService.registerAgent('testAgent', { ...getAgentData('testAgent'), isDefault: true }));
		testDisposables.add(chatAgentService.registerAgent(chatAgentWithUsedContextId, getAgentData(chatAgentWithUsedContextId)));
		testDisposables.add(chatAgentService.registerAgent(chatAgentWithMarkdownId, getAgentData(chatAgentWithMarkdownId)));
		testDisposables.add(chatAgentService.registerAgentImplementation('testAgent', agent));
		chatAgentService.updateAgent('testAgent', {});
	});

	teardown(async () => {
		testDisposables.clear();
		await Promise.all(testServices.map(s => s.waitForModelDisposals()));
		testServices.length = 0;
	});
	ensureNoDisposablesAreLeakedInTestSuite();

	test('retrieveSession', async () => {
		const testService = createChatService();
		// Don't add refs to testDisposables so we can control disposal
		const session1Ref = testService.startSession(ChatAgentLocation.Chat);
		const session1 = session1Ref.object as ChatModel;
		session1.addRequest({ parts: [], text: 'request 1' }, { variables: [] }, 0);

		const session2Ref = testService.startSession(ChatAgentLocation.Chat);
		const session2 = session2Ref.object as ChatModel;
		session2.addRequest({ parts: [], text: 'request 2' }, { variables: [] }, 0);

		// Dispose refs to trigger persistence to file service
		session1Ref.dispose();
		session2Ref.dispose();

		// Wait for async persistence to complete
		await testService.waitForModelDisposals();

		// Verify that sessions were written to the file service
		assert.strictEqual(testFileService.writeOperations.length, 2, 'Should have written 2 sessions to file service');

		const session1WriteOp = testFileService.writeOperations.find((op: { resource: URI; content: string }) =>
			op.content.includes('request 1'));
		const session2WriteOp = testFileService.writeOperations.find((op: { resource: URI; content: string }) =>
			op.content.includes('request 2'));

		assert.ok(session1WriteOp, 'Session 1 should have been written to file service');
		assert.ok(session2WriteOp, 'Session 2 should have been written to file service');

		// Create a new service instance to simulate app restart
		const testService2 = createChatService();

		// Retrieve sessions and verify they're loaded from file service
		const retrieved1 = await getOrRestoreModel(testService2, session1.sessionResource);
		const retrieved2 = await getOrRestoreModel(testService2, session2.sessionResource);

		assert.ok(retrieved1, 'Should retrieve session 1');
		assert.ok(retrieved2, 'Should retrieve session 2');
		assert.deepStrictEqual(retrieved1.getRequests()[0]?.message.text, 'request 1');
		assert.deepStrictEqual(retrieved2.getRequests()[0]?.message.text, 'request 2');
	});

	test('addCompleteRequest', async () => {
		const testService = createChatService();

		const modelRef = testDisposables.add(startSessionModel(testService));
		const model = modelRef.object;
		assert.strictEqual(model.getRequests().length, 0);

		await testService.addCompleteRequest(model.sessionResource, 'test request', undefined, 0, { message: 'test response' });
		assert.strictEqual(model.getRequests().length, 1);
		assert.ok(model.getRequests()[0].response);
		assert.strictEqual(model.getRequests()[0].response?.response.toString(), 'test response');
	});

	test('sendRequest fails', async () => {
		const testService = createChatService();

		const modelRef = testDisposables.add(startSessionModel(testService));
		const model = modelRef.object;
		const response = await testService.sendRequest(model.sessionResource, `@${chatAgentWithUsedContextId} test request`);
		assert(response);
		await response.responseCompletePromise;

		await assertSnapshot(toSnapshotExportData(model));
	});

	test('history', async () => {
		const historyLengthAgent: IChatAgentImplementation = {
			async invoke(request, progress, history, token) {
				return {
					metadata: { historyLength: history.length }
				};
			},
		};

		testDisposables.add(chatAgentService.registerAgent('defaultAgent', { ...getAgentData('defaultAgent'), isDefault: true }));
		testDisposables.add(chatAgentService.registerAgent('agent2', getAgentData('agent2')));
		testDisposables.add(chatAgentService.registerAgentImplementation('defaultAgent', historyLengthAgent));
		testDisposables.add(chatAgentService.registerAgentImplementation('agent2', historyLengthAgent));

		const testService = createChatService();
		const modelRef = testDisposables.add(startSessionModel(testService));
		const model = modelRef.object;

		// Send a request to default agent
		const response = await testService.sendRequest(model.sessionResource, `test request`, { agentId: 'defaultAgent' });
		assert(response);
		await response.responseCompletePromise;
		assert.strictEqual(model.getRequests().length, 1);
		assert.strictEqual(model.getRequests()[0].response?.result?.metadata?.historyLength, 0);

		// Send a request to agent2- it can't see the default agent's message
		const response2 = await testService.sendRequest(model.sessionResource, `test request`, { agentId: 'agent2' });
		assert(response2);
		await response2.responseCompletePromise;
		assert.strictEqual(model.getRequests().length, 2);
		assert.strictEqual(model.getRequests()[1].response?.result?.metadata?.historyLength, 0);

		// Send a request to defaultAgent - the default agent can see agent2's message
		const response3 = await testService.sendRequest(model.sessionResource, `test request`, { agentId: 'defaultAgent' });
		assert(response3);
		await response3.responseCompletePromise;
		assert.strictEqual(model.getRequests().length, 3);
		assert.strictEqual(model.getRequests()[2].response?.result?.metadata?.historyLength, 2);
	});

	test('can serialize', async () => {
		testDisposables.add(chatAgentService.registerAgentImplementation(chatAgentWithUsedContextId, chatAgentWithUsedContext));
		chatAgentService.updateAgent(chatAgentWithUsedContextId, {});
		const testService = createChatService();

		const modelRef = testDisposables.add(startSessionModel(testService));
		const model = modelRef.object;
		assert.strictEqual(model.getRequests().length, 0);

		await assertSnapshot(toSnapshotExportData(model));

		const response = await testService.sendRequest(model.sessionResource, `@${chatAgentWithUsedContextId} test request`);
		assert(response);
		await response.responseCompletePromise;
		assert.strictEqual(model.getRequests().length, 1);

		const response2 = await testService.sendRequest(model.sessionResource, `test request 2`);
		assert(response2);
		await response2.responseCompletePromise;
		assert.strictEqual(model.getRequests().length, 2);

		await assertSnapshot(toSnapshotExportData(model));
	});

	test('can deserialize', async () => {
		let serializedChatData: ISerializableChatData;
		testDisposables.add(chatAgentService.registerAgentImplementation(chatAgentWithUsedContextId, chatAgentWithUsedContext));

		// create the first service, send request, get response, and serialize the state
		{  // serapate block to not leak variables in outer scope
			const testService = createChatService();

			const chatModel1Ref = testDisposables.add(startSessionModel(testService));
			const chatModel1 = chatModel1Ref.object;
			assert.strictEqual(chatModel1.getRequests().length, 0);

			const response = await testService.sendRequest(chatModel1.sessionResource, `@${chatAgentWithUsedContextId} test request`);
			assert(response);

			await response.responseCompletePromise;

			serializedChatData = JSON.parse(JSON.stringify(chatModel1));
		}

		// try deserializing the state into a new service

		const testService2 = createChatService();

		const chatModel2Ref = testService2.loadSessionFromContent(serializedChatData);
		assert(chatModel2Ref);
		testDisposables.add(chatModel2Ref);
		const chatModel2 = chatModel2Ref.object;

		await assertSnapshot(toSnapshotExportData(chatModel2));
	});

	test('can deserialize with response', async () => {
		let serializedChatData: ISerializableChatData;
		testDisposables.add(chatAgentService.registerAgentImplementation(chatAgentWithMarkdownId, chatAgentWithMarkdown));

		{
			const testService = createChatService();

			const chatModel1Ref = testDisposables.add(startSessionModel(testService));
			const chatModel1 = chatModel1Ref.object;
			assert.strictEqual(chatModel1.getRequests().length, 0);

			const response = await testService.sendRequest(chatModel1.sessionResource, `@${chatAgentWithUsedContextId} test request`);
			assert(response);

			await response.responseCompletePromise;

			serializedChatData = JSON.parse(JSON.stringify(chatModel1));
		}

		// try deserializing the state into a new service

		const testService2 = createChatService();

		const chatModel2Ref = testService2.loadSessionFromContent(serializedChatData);
		assert(chatModel2Ref);
		testDisposables.add(chatModel2Ref);
		const chatModel2 = chatModel2Ref.object;

		await assertSnapshot(toSnapshotExportData(chatModel2));
	});

	test('onDidDisposeSession', async () => {
		const testService = createChatService();
		const modelRef = testService.startSession(ChatAgentLocation.Chat);
		const model = modelRef.object;

		let disposed = false;
		testDisposables.add(testService.onDidDisposeSession(e => {
			for (const resource of e.sessionResource) {
				if (resource.toString() === model.sessionResource.toString()) {
					disposed = true;
				}
			}
		}));

		modelRef.dispose();
		await testService.waitForModelDisposals();
		assert.strictEqual(disposed, true);
	});
});


function toSnapshotExportData(model: IChatModel) {
	const exp = model.toExport();
	return {
		...exp,
		requests: exp.requests.map(r => {
			return {
				...r,
				modelState: {
					...r.modelState,
					completedAt: undefined
				},
				timestamp: undefined,
				requestId: undefined, // id contains a random part
				responseId: undefined, // id contains a random part
			};
		})
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatUrlFetchingPatterns.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatUrlFetchingPatterns.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { extractUrlPatterns, getPatternLabel, isUrlApproved, getMatchingPattern, IUrlApprovalSettings } from '../../common/chatUrlFetchingPatterns.js';

suite('ChatUrlFetchingPatterns', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('extractUrlPatterns', () => {
		test('simple domain', () => {
			const url = URI.parse('https://example.com');
			const patterns = extractUrlPatterns(url);
			assert.deepStrictEqual(patterns, [
				'https://example.com',
			]);
		});

		test('subdomain', () => {
			const url = URI.parse('https://api.example.com');
			const patterns = extractUrlPatterns(url);
			assert.deepStrictEqual(patterns, [
				'https://api.example.com',
				'https://*.example.com'
			]);
		});

		test('multiple subdomains', () => {
			const url = URI.parse('https://foo.bar.example.com/path');
			const patterns = extractUrlPatterns(url);
			assert.deepStrictEqual(patterns, [
				'https://foo.bar.example.com/path',
				'https://foo.bar.example.com',
				'https://*.bar.example.com',
				'https://*.example.com',
			]);
		});

		test('with path', () => {
			const url = URI.parse('https://example.com/api/v1/users');
			const patterns = extractUrlPatterns(url);
			assert.deepStrictEqual(patterns, [
				'https://example.com/api/v1/users',
				'https://example.com',
				'https://example.com/api/v1',
				'https://example.com/api',
			]);
		});

		test('IP address - no wildcard subdomain', () => {
			const url = URI.parse('https://192.168.1.1');
			const patterns = extractUrlPatterns(url);
			assert.strictEqual(patterns.filter(p => p.includes('*')).length, 0);
		});

		test('with query and fragment', () => {
			const url = URI.parse('https://example.com/path?query=1#fragment');
			const patterns = extractUrlPatterns(url);
			assert.deepStrictEqual(patterns, [
				'https://example.com/path?query=1#fragment',
				'https://example.com',
			]);
		});
	});

	suite('getPatternLabel', () => {
		test('removes https protocol', () => {
			const url = URI.parse('https://example.com');
			const label = getPatternLabel(url, 'https://example.com');
			assert.strictEqual(label, 'example.com');
		});

		test('removes http protocol', () => {
			const url = URI.parse('http://example.com');
			const label = getPatternLabel(url, 'http://example.com');
			assert.strictEqual(label, 'example.com');
		});

		test('removes trailing slashes', () => {
			const url = URI.parse('https://example.com/');
			const label = getPatternLabel(url, 'https://example.com/');
			assert.strictEqual(label, 'example.com');
		});

		test('preserves path', () => {
			const url = URI.parse('https://example.com/api/v1');
			const label = getPatternLabel(url, 'https://example.com/api/v1');
			assert.strictEqual(label, 'example.com/api/v1');
		});
	});

	suite('isUrlApproved', () => {
		test('exact match with boolean', () => {
			const url = URI.parse('https://example.com');
			const approved = { 'https://example.com': true };
			assert.strictEqual(isUrlApproved(url, approved, true), true);
			assert.strictEqual(isUrlApproved(url, approved, false), true);
		});

		test('no match returns false', () => {
			const url = URI.parse('https://example.com');
			const approved = { 'https://other.com': true };
			assert.strictEqual(isUrlApproved(url, approved, true), false);
		});

		test('wildcard subdomain match', () => {
			const url = URI.parse('https://api.example.com');
			const approved = { 'https://*.example.com': true };
			assert.strictEqual(isUrlApproved(url, approved, true), true);
		});

		test('path wildcard match', () => {
			const url = URI.parse('https://example.com/api/users');
			const approved = { 'https://example.com/api/*': true };
			assert.strictEqual(isUrlApproved(url, approved, true), true);
		});

		test('granular settings - request approved', () => {
			const url = URI.parse('https://example.com');
			const approved: Record<string, IUrlApprovalSettings> = {
				'https://example.com': { approveRequest: true, approveResponse: false }
			};
			assert.strictEqual(isUrlApproved(url, approved, true), true);
			assert.strictEqual(isUrlApproved(url, approved, false), false);
		});

		test('granular settings - response approved', () => {
			const url = URI.parse('https://example.com');
			const approved: Record<string, IUrlApprovalSettings> = {
				'https://example.com': { approveRequest: false, approveResponse: true }
			};
			assert.strictEqual(isUrlApproved(url, approved, true), false);
			assert.strictEqual(isUrlApproved(url, approved, false), true);
		});

		test('granular settings - both approved', () => {
			const url = URI.parse('https://example.com');
			const approved: Record<string, IUrlApprovalSettings> = {
				'https://example.com': { approveRequest: true, approveResponse: true }
			};
			assert.strictEqual(isUrlApproved(url, approved, true), true);
			assert.strictEqual(isUrlApproved(url, approved, false), true);
		});

		test('granular settings - missing property defaults to false', () => {
			const url = URI.parse('https://example.com');
			const approved: Record<string, IUrlApprovalSettings> = {
				'https://example.com': { approveRequest: true }
			};
			assert.strictEqual(isUrlApproved(url, approved, false), false);
		});
	});

	suite('getMatchingPattern', () => {
		test('exact match', () => {
			const url = URI.parse('https://example.com/path');
			const approved = { 'https://example.com/path': true };
			const pattern = getMatchingPattern(url, approved);
			assert.strictEqual(pattern, 'https://example.com/path');
		});

		test('wildcard match', () => {
			const url = URI.parse('https://api.example.com');
			const approved = { 'https://*.example.com': true };
			const pattern = getMatchingPattern(url, approved);
			assert.strictEqual(pattern, 'https://*.example.com');
		});

		test('no match returns undefined', () => {
			const url = URI.parse('https://example.com');
			const approved = { 'https://other.com': true };
			const pattern = getMatchingPattern(url, approved);
			assert.strictEqual(pattern, undefined);
		});

		test('most specific match', () => {
			const url = URI.parse('https://api.example.com/v1/users');
			const approved = {
				'https://*.example.com': true,
				'https://api.example.com': true,
				'https://api.example.com/v1/*': true
			};
			const pattern = getMatchingPattern(url, approved);
			assert.ok(pattern !== undefined);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatWidgetHistoryService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatWidgetHistoryService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IStorageService, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IChatModelInputState } from '../../common/chatModel.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { ChatHistoryNavigator, ChatInputHistoryMaxEntries, ChatWidgetHistoryService, IChatWidgetHistoryService } from '../../common/chatWidgetHistoryService.js';
import { Memento } from '../../../../common/memento.js';

suite('ChatWidgetHistoryService', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		// Clear memento cache before each test to prevent state leakage
		Memento.clear(StorageScope.APPLICATION);
		Memento.clear(StorageScope.PROFILE);
		Memento.clear(StorageScope.WORKSPACE);
	});

	function createHistoryService(): ChatWidgetHistoryService {
		// Create fresh instances for each test to avoid state leakage
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);
		return testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
	}

	function createInputState(text: string, modeKind = ChatModeKind.Ask): IChatModelInputState {
		return {
			inputText: text,
			attachments: [],
			mode: { id: modeKind, kind: modeKind },
			selectedModel: undefined,
			selections: [],
			contrib: {}
		};
	}

	test('should start with empty history', () => {
		const historyService = createHistoryService();
		const history = historyService.getHistory(ChatAgentLocation.Chat);
		assert.strictEqual(history.length, 0);
	});

	test('should append and retrieve history entries', () => {
		const historyService = createHistoryService();
		const entry = createInputState('test query');
		historyService.append(ChatAgentLocation.Chat, entry);

		const history = historyService.getHistory(ChatAgentLocation.Chat);
		assert.strictEqual(history.length, 1);
		assert.strictEqual(history[0].inputText, 'test query');
	});

	test('should maintain separate history per location', () => {
		const historyService = createHistoryService();
		historyService.append(ChatAgentLocation.Chat, createInputState('chat query'));
		historyService.append(ChatAgentLocation.Terminal, createInputState('terminal query'));

		const chatHistory = historyService.getHistory(ChatAgentLocation.Chat);
		const terminalHistory = historyService.getHistory(ChatAgentLocation.Terminal);

		assert.strictEqual(chatHistory.length, 1);
		assert.strictEqual(terminalHistory.length, 1);
		assert.strictEqual(chatHistory[0].inputText, 'chat query');
		assert.strictEqual(terminalHistory[0].inputText, 'terminal query');
	});

	test('should limit history to max entries', () => {
		const historyService = createHistoryService();
		for (let i = 0; i < ChatInputHistoryMaxEntries + 10; i++) {
			historyService.append(ChatAgentLocation.Chat, createInputState(`query ${i}`));
		}

		const history = historyService.getHistory(ChatAgentLocation.Chat);
		assert.strictEqual(history.length, ChatInputHistoryMaxEntries);
		assert.strictEqual(history[0].inputText, 'query 10'); // First 10 should be dropped
		assert.strictEqual(history[history.length - 1].inputText, `query ${ChatInputHistoryMaxEntries + 9}`);
	});

	test('should fire append event when history is added', () => {
		const historyService = createHistoryService();
		let eventFired = false;
		let firedEntry: IChatModelInputState | undefined;

		testDisposables.add(historyService.onDidChangeHistory(e => {
			if (e.kind === 'append') {
				eventFired = true;
				firedEntry = e.entry;
			}
		}));

		const entry = createInputState('test');
		historyService.append(ChatAgentLocation.Chat, entry);

		assert.ok(eventFired);
		assert.strictEqual(firedEntry?.inputText, 'test');
	});

	test('should clear all history', () => {
		const historyService = createHistoryService();
		historyService.append(ChatAgentLocation.Chat, createInputState('query 1'));
		historyService.append(ChatAgentLocation.Terminal, createInputState('query 2'));

		historyService.clearHistory();

		assert.strictEqual(historyService.getHistory(ChatAgentLocation.Chat).length, 0);
		assert.strictEqual(historyService.getHistory(ChatAgentLocation.Terminal).length, 0);
	});

	test('should fire clear event when history is cleared', () => {
		const historyService = createHistoryService();
		let clearEventFired = false;

		testDisposables.add(historyService.onDidChangeHistory(e => {
			if (e.kind === 'clear') {
				clearEventFired = true;
			}
		}));

		historyService.clearHistory();
		assert.ok(clearEventFired);
	});
});

suite('ChatHistoryNavigator', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		// Clear memento cache before each test to prevent state leakage
		Memento.clear(StorageScope.APPLICATION);
		Memento.clear(StorageScope.PROFILE);
		Memento.clear(StorageScope.WORKSPACE);
	});

	function createNavigator(): ChatHistoryNavigator {
		// Create fresh instances for each test to avoid state leakage
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		const historyService = testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
		instantiationService.stub(IChatWidgetHistoryService, historyService);

		return testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));
	}

	function createInputState(text: string): IChatModelInputState {
		return {
			inputText: text,
			attachments: [],
			mode: { id: ChatModeKind.Ask, kind: ChatModeKind.Ask },
			selectedModel: undefined,
			selections: [],
			contrib: {}
		};
	}

	test('should start at end of empty history', () => {
		const nav = createNavigator();
		assert.ok(nav.isAtEnd());
		assert.ok(nav.isAtStart());
	});

	test('should navigate backwards through history', () => {
		const nav = createNavigator();
		nav.append(createInputState('first'));
		nav.append(createInputState('second'));
		nav.append(createInputState('third'));

		assert.ok(nav.isAtEnd());

		const prev1 = nav.previous();
		assert.strictEqual(prev1?.inputText, 'third');

		const prev2 = nav.previous();
		assert.strictEqual(prev2?.inputText, 'second');

		const prev3 = nav.previous();
		assert.strictEqual(prev3?.inputText, 'first');
		assert.ok(nav.isAtStart());
	});

	test('should navigate forwards through history', () => {
		const nav = createNavigator();
		nav.append(createInputState('first'));
		nav.append(createInputState('second'));

		nav.previous();
		nav.previous();
		assert.ok(nav.isAtStart());

		const next1 = nav.next();
		assert.strictEqual(next1?.inputText, 'second');

		const next2 = nav.next();
		assert.strictEqual(next2, undefined);
		assert.ok(nav.isAtEnd());
	});

	test('should reset cursor to end', () => {
		const nav = createNavigator();
		nav.append(createInputState('first'));
		nav.append(createInputState('second'));

		nav.previous();
		assert.ok(!nav.isAtEnd());

		nav.resetCursor();
		assert.ok(nav.isAtEnd());
	});

	test('should overlay edited entries', () => {
		const nav = createNavigator();
		nav.append(createInputState('first'));
		nav.append(createInputState('second'));

		nav.previous();
		const edited = createInputState('second edited');
		nav.overlay(edited);

		const current = nav.current();
		assert.strictEqual(current?.inputText, 'second edited');

		// Original history should be unchanged
		assert.strictEqual(nav.values[1].inputText, 'second');
	});

	test('should clear overlay on append', () => {
		const nav = createNavigator();
		nav.append(createInputState('first'));

		nav.previous();
		nav.overlay(createInputState('first edited'));

		const currentBefore = nav.current();
		assert.strictEqual(currentBefore?.inputText, 'first edited');

		nav.append(createInputState('second'));

		// After append, cursor should be at end and overlay cleared
		assert.ok(nav.isAtEnd());
		nav.previous();
		assert.strictEqual(nav.current()?.inputText, 'second');
	});

	test('should stop at start when navigating backwards', () => {
		const nav = createNavigator();
		nav.append(createInputState('only'));

		nav.previous();
		assert.ok(nav.isAtStart());

		const prev = nav.previous();
		assert.strictEqual(prev?.inputText, 'only'); // Should stay at first
		assert.ok(nav.isAtStart());
	});

	test('should stop at end when navigating forwards', () => {
		const nav = createNavigator();
		nav.append(createInputState('only'));

		const next1 = nav.next();
		assert.strictEqual(next1, undefined);
		assert.ok(nav.isAtEnd());

		const next2 = nav.next();
		assert.strictEqual(next2, undefined);
		assert.ok(nav.isAtEnd());
	});

	test('should update when history service appends entries', () => {
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		const historyService = testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
		instantiationService.stub(IChatWidgetHistoryService, historyService);

		const nav = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));

		historyService.append(ChatAgentLocation.Chat, createInputState('from service'));

		const history = nav.values;
		assert.strictEqual(history.length, 1);
		assert.strictEqual(history[0].inputText, 'from service');
	});

	test('should adjust cursor when history is cleared', () => {
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		const historyService = testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
		instantiationService.stub(IChatWidgetHistoryService, historyService);

		const nav = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));

		nav.append(createInputState('first'));
		nav.append(createInputState('second'));

		nav.previous();
		assert.ok(!nav.isAtEnd());

		historyService.clearHistory();

		assert.ok(nav.isAtEnd());
		assert.ok(nav.isAtStart());
		assert.strictEqual(nav.values.length, 0);
	});

	test('should handle cursor adjustment when max entries reached', () => {
		const nav = createNavigator();
		// Add entries up to the max
		for (let i = 0; i < ChatInputHistoryMaxEntries; i++) {
			nav.append(createInputState(`entry ${i}`));
		}

		// Navigate to middle of history
		for (let i = 0; i < 20; i++) {
			nav.previous();
		}

		// Add one more entry (should drop oldest)
		nav.append(createInputState('new entry'));

		// Cursor should be at end after append
		assert.ok(nav.isAtEnd());
	});

	test('should support concurrent navigators', () => {
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		const historyService = testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
		instantiationService.stub(IChatWidgetHistoryService, historyService);

		const nav1 = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));
		const nav2 = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));

		nav1.append(createInputState('query 1'));

		assert.strictEqual(nav1.values.length, 1);
		assert.strictEqual(nav2.values.length, 1);
		assert.strictEqual(nav1.values[0].inputText, 'query 1');
		assert.strictEqual(nav2.values[0].inputText, 'query 1');

		nav1.previous();
		assert.ok(!nav1.isAtEnd());
		assert.ok(nav2.isAtEnd());

		nav2.append(createInputState('query 2'));

		assert.strictEqual(nav1.values.length, 2);
		assert.strictEqual(nav2.values.length, 2);

		// nav1 should stay at same position (pointing to query 1)
		assert.strictEqual(nav1.current()?.inputText, 'query 1');

		// nav2 should be at end
		assert.ok(nav2.isAtEnd());
	});

	test('should support concurrent navigators with mixed positions', () => {
		const instantiationService = testDisposables.add(new TestInstantiationService());
		const storageService = testDisposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		const historyService = testDisposables.add(instantiationService.createInstance(ChatWidgetHistoryService));
		instantiationService.stub(IChatWidgetHistoryService, historyService);

		const nav1 = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));
		const nav2 = testDisposables.add(instantiationService.createInstance(ChatHistoryNavigator, ChatAgentLocation.Chat));

		nav1.append(createInputState('query 1'));
		nav1.append(createInputState('query 2'));
		nav1.append(createInputState('query 3'));

		// Both at end
		assert.ok(nav1.isAtEnd());
		assert.ok(nav2.isAtEnd());

		// Move nav1 back to 'query 2'
		nav1.previous();
		assert.strictEqual(nav1.current()?.inputText, 'query 3');
		nav1.previous();
		assert.strictEqual(nav1.current()?.inputText, 'query 2');

		// Move nav2 back to 'query 1'
		nav2.previous();
		nav2.previous();
		nav2.previous();
		assert.strictEqual(nav2.current()?.inputText, 'query 1');

		// Append new query
		nav1.append(createInputState('query 4'));

		// nav1 should be at end (because it appended)
		assert.ok(nav1.isAtEnd());
		assert.strictEqual(nav1.values.length, 4);

		// nav2 should stay at 'query 1'
		assert.strictEqual(nav2.current()?.inputText, 'query 1');
		assert.strictEqual(nav2.values.length, 4);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/chatWordCounter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/chatWordCounter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { getNWords, IWordCountResult } from '../../common/chatWordCounter.js';

suite('ChatWordCounter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function doTest(str: string, nWords: number, resultStr: string) {
		const result = getNWords(str, nWords);
		assert.strictEqual(result.value, resultStr);
		assert.strictEqual(result.returnedWordCount, nWords);
	}

	suite('getNWords', () => {
		test('matching actualWordCount', () => {
			const cases: [string, number, string][] = [
				['hello world', 1, 'hello'],
				['hello', 1, 'hello'],
				['hello world', 0, ''],
				['here\'s, some.   punctuation?', 3, 'here\'s, some.   punctuation?'],
				['| markdown | _table_ | header |', 3, '| markdown | _table_ | header |'],
				['| --- | --- | --- |', 1, '| ---'],
				['| --- | --- | --- |', 3, '| --- | --- | --- |'],
				[' \t some \n whitespace     \n\n\nhere   ', 3, ' \t some \n whitespace     \n\n\nhere   '],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});

		test('whitespace', () => {
			assert.deepStrictEqual(
				getNWords('hello ', 1),
				{
					value: 'hello ',
					returnedWordCount: 1,
					isFullString: true,
					totalWordCount: 1,
				} satisfies IWordCountResult);
			assert.deepStrictEqual(
				getNWords('hello\n\n', 1),
				{
					value: 'hello\n\n',
					returnedWordCount: 1,
					isFullString: true,
					totalWordCount: 1,
				} satisfies IWordCountResult);
			assert.deepStrictEqual(
				getNWords('\nhello', 1),
				{
					value: '\nhello',
					returnedWordCount: 1,
					isFullString: true,
					totalWordCount: 1,
				} satisfies IWordCountResult);
		});

		test('matching links', () => {
			const cases: [string, number, string][] = [
				['[hello](https://example.com) world', 1, '[hello](https://example.com)'],
				['[hello](https://example.com) world', 2, '[hello](https://example.com) world'],
				['oh [hello](https://example.com "title") world', 1, 'oh'],
				['oh [hello](https://example.com "title") world', 2, 'oh [hello](https://example.com "title")'],
				// Parens in link destination
				['[hello](https://example.com?()) world', 1, '[hello](https://example.com?())'],
				// Escaped brackets in link text
				['[he \\[l\\] \\]lo](https://example.com?()) world', 1, '[he \\[l\\] \\]lo](https://example.com?())'],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});

		test('code', () => {
			const cases: [string, number, string][] = [
				['let a=1-2', 2, 'let a'],
				['let a=1-2', 3, 'let a='],
				['let a=1-2', 4, 'let a=1'],
				['const myVar = 1+2', 4, 'const myVar = 1'],
				['<div id="myDiv"></div>', 3, '<div id='],
				['<div id="myDiv"></div>', 4, '<div id="myDiv"></div>'],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});

		test('codeblocks', () => {
			const cases: [string, number, string][] = [
				['hello\n\n```\n```\n\nworld foo', 2, 'hello\n\n```\n```\n\nworld'],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});

		test('chinese characters', () => {
			const cases: [string, number, string][] = [
				['我喜欢中国菜', 3, '我喜欢'],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});

		test(`Inline math shouldn't be broken up`, () => {
			const cases: [string, number, string][] = [
				['a $x + y$ b', 3, 'a $x + y$ b'],
				['a $\\frac{1}{2} + \\sqrt{x^2 + y^2}$ b', 3, 'a $\\frac{1}{2} + \\sqrt{x^2 + y^2}$ b'],
			];

			cases.forEach(([str, nWords, result]) => doTest(str, nWords, result));
		});
	});
});
```

--------------------------------------------------------------------------------

````

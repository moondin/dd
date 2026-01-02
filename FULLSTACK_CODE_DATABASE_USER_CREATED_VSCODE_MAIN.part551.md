---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 551
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 551 of 552)

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

---[FILE: test/mcp/src/automationTools/debug.ts]---
Location: vscode-main/test/mcp/src/automationTools/debug.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Debug Tools
 */
export function applyDebugTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];
	tools.push(server.tool(
		'vscode_automation_debug_open',
		'Open the debug viewlet',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.debug.openDebugViewlet();
			return {
				content: [{
					type: 'text' as const,
					text: 'Opened debug viewlet'
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_debug_set_breakpoint',
		'Set a breakpoint on a specific line',
		{
			lineNumber: z.number().describe('Line number to set breakpoint on')
		},
		async (args) => {
			const { lineNumber } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.debug.setBreakpointOnLine(lineNumber);
			return {
				content: [{
					type: 'text' as const,
					text: `Set breakpoint on line ${lineNumber}`
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_debug_start',
		'Start debugging',
		async () => {
			const app = await appService.getOrCreateApplication();
			const result = await app.workbench.debug.startDebugging();
			return {
				content: [{
					type: 'text' as const,
					text: `Started debugging (result: ${result})`
				}]
			};
		}
	));

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_debug_stop',
	// 	'Stop debugging',
	// 	async () => {
	// 		await app.workbench.debug.stopDebugging();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Stopped debugging'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_debug_step_over',
	// 	'Step over in debugger',
	// 	async () => {
	// 		await app.workbench.debug.stepOver();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Stepped over'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_debug_step_in',
	// 	'Step into in debugger',
	// 	async () => {
	// 		await app.workbench.debug.stepIn();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Stepped in'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_debug_step_out',
	// 	'Step out in debugger',
	// 	async () => {
	// 		await app.workbench.debug.stepOut();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Stepped out'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_debug_continue',
	// 	'Continue execution in debugger',
	// 	async () => {
	// 		await app.workbench.debug.continue();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Continued execution'
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/editor.ts]---
Location: vscode-main/test/mcp/src/automationTools/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Editor Management Tools
 */
export function applyEditorTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];
	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_editor_open_file',
	// 	'Open a file in the VS Code editor through quick open',
	// 	{
	// 		fileName: z.string().describe('Name of the file to open (partial names work)')
	// 	},
	// 	async (args) => {
	// 		const { fileName } = args;
	// 		await app.workbench.quickaccess.openFileQuickAccessAndWait(fileName, fileName);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Opened file: ${fileName}`
	// 			}]
	// 		};
	// 	}
	// );

	// This one is critical as Playwright had trouble typing in monaco
	tools.push(server.tool(
		'vscode_automation_editor_type_text',
		'Type text in the currently active editor',
		{
			text: z.string().describe('The text to type'),
			filename: z.string().describe('Filename to target specific editor')
		},
		async (args) => {
			const { text, filename } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.editor.waitForTypeInEditor(filename, text);
			return {
				content: [{
					type: 'text' as const,
					text: `Typed text: "${text}"`
				}]
			};
		}
	));

	// Doesn't seem particularly useful
	// server.tool(
	// 	'vscode_automation_editor_get_selection',
	// 	'Get the current selection in the editor',
	// 	{
	// 		filename: z.string().describe('Filename to target specific editor')
	// 	},
	// 	async (args) => {
	// 		const { filename } = args;
	// 		return new Promise((resolve, reject) => {
	// 			const selectionHandler = (selection: { selectionStart: number; selectionEnd: number }) => {
	// 				resolve({
	// 					content: [{
	// 						type: 'text' as const,
	// 						text: `Selection: start=${selection.selectionStart}, end=${selection.selectionEnd}`
	// 					}]
	// 				});
	// 				return true;
	// 			};

	// 			app.workbench.editor.waitForEditorSelection(filename, selectionHandler).catch(reject);
	// 		});
	// 	}
	// );

	// Doesn't seem particularly useful
	// server.tool(
	// 	'vscode_automation_editor_go_to_definition',
	// 	'Go to definition of symbol at current cursor position',
	// 	{
	// 		filename: z.string().describe('File containing the symbol'),
	// 		term: z.string().describe('The symbol/term to go to definition for'),
	// 		line: z.number().describe('Line number where the symbol is located')
	// 	},
	// 	async (args) => {
	// 		const { filename, term, line } = args;
	// 		await app.workbench.editor.gotoDefinition(filename, term, line);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Navigated to definition of "${term}" in ${filename} at line ${line}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_editor_peek_definition',
	// 	'Peek definition of symbol at current cursor position',
	// 	{
	// 		filename: z.string().describe('File containing the symbol'),
	// 		term: z.string().describe('The symbol/term to peek definition for'),
	// 		line: z.number().describe('Line number where the symbol is located')
	// 	},
	// 	async (args) => {
	// 		const { filename, term, line } = args;
	// 		await app.workbench.editor.peekDefinition(filename, term, line);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Peeked definition of "${term}" in ${filename} at line ${line}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_editor_rename_symbol',
	// 	'Rename a symbol in the editor',
	// 	{
	// 		filename: z.string().describe('File containing the symbol'),
	// 		line: z.number().describe('Line number where the symbol is located'),
	// 		oldName: z.string().describe('Current name of the symbol'),
	// 		newName: z.string().describe('New name for the symbol')
	// 	},
	// 	async (args) => {
	// 		const { filename, line, oldName, newName } = args;
	// 		await app.workbench.editor.rename(filename, line, oldName, newName);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Renamed "${oldName}" to "${newName}" in ${filename} at line ${line}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_editor_find_references',
	// 	'Find all references to a symbol',
	// 	{
	// 		filename: z.string().describe('File containing the symbol'),
	// 		term: z.string().describe('The symbol/term to find references for'),
	// 		line: z.number().describe('Line number where the symbol is located')
	// 	},
	// 	async (args) => {
	// 		const { filename, term, line } = args;
	// 		await app.workbench.editor.findReferences(filename, term, line);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Found references for "${term}" in ${filename} at line ${line}`
	// 			}]
	// 		};
	// 	}
	// );

	// Editor File Management Tools
	tools.push(server.tool(
		'vscode_automation_editor_new_untitled_file',
		'Create a new untitled file',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.editors.newUntitledFile();
			return {
				content: [{
					type: 'text' as const,
					text: 'Created new untitled file'
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_editor_save_file',
		'Save the currently active file',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.editors.saveOpenedFile();
			return {
				content: [{
					type: 'text' as const,
					text: 'Saved active file'
				}]
			};
		}
	));

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_editor_select_tab',
	// 	'Select a specific tab by filename',
	// 	{
	// 		fileName: z.string().describe('Name of the file tab to select')
	// 	},
	// 	async (args) => {
	// 		const { fileName } = args;
	// 		await app.workbench.editors.selectTab(fileName);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Selected tab: ${fileName}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_editor_wait_for_tab',
	// 	'Wait for a specific tab to appear',
	// 	{
	// 		fileName: z.string().describe('Name of the file tab to wait for'),
	// 		isDirty: z.boolean().optional().describe('Whether to wait for the tab to be dirty (unsaved)')
	// 	},
	// 	async (args) => {
	// 		const { fileName, isDirty = false } = args;
	// 		await app.workbench.editors.waitForTab(fileName, isDirty);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Tab appeared: ${fileName}${isDirty ? ' (dirty)' : ''}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_editor_wait_for_focus',
	// 	'Wait for an editor to have focus',
	// 	{
	// 		fileName: z.string().describe('Name of the file to wait for focus'),
	// 		retryCount: z.number().optional().describe('Number of retries')
	// 	},
	// 	async (args) => {
	// 		const { fileName, retryCount } = args;
	// 		await app.workbench.editors.waitForEditorFocus(fileName, retryCount);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Editor has focus: ${fileName}`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/explorer.ts]---
Location: vscode-main/test/mcp/src/automationTools/explorer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';

/**
 * Explorer and File Management Tools
 */
export function applyExplorerTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_explorer_open',
	// 	'Open the file explorer viewlet',
	// 	async () => {
	// 		await app.workbench.explorer.openExplorerView();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Opened file explorer'
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/extensions.ts]---
Location: vscode-main/test/mcp/src/automationTools/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Extensions Tools
 */
export function applyExtensionsTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_extensions_search',
	// 	'Search for an extension by ID',
	// 	{
	// 		extensionId: z.string().describe('Extension ID to search for (e.g., "ms-python.python")')
	// 	},
	// 	async (args) => {
	// 		const { extensionId } = args;
	// 		await app.workbench.extensions.searchForExtension(extensionId);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Searched for extension: ${extensionId}`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_extensions_open',
		'Open an extension by ID',
		{
			extensionId: z.string().describe('Extension ID to open (e.g., "ms-python.python")')
		},
		async (args) => {
			const { extensionId } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.extensions.openExtension(extensionId);
			return {
				content: [{
					type: 'text' as const,
					text: `Opened extension: ${extensionId}`
				}]
			};
		}
	));

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_extensions_close',
	// 	'Close an extension tab by title',
	// 	{
	// 		title: z.string().describe('Extension title to close')
	// 	},
	// 	async (args) => {
	// 		const { title } = args;
	// 		await app.workbench.extensions.closeExtension(title);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Closed extension: ${title}`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_extensions_install',
		'Install an extension by ID',
		{
			extensionId: z.string().describe('Extension ID to install (e.g., "ms-python.python")'),
			waitUntilEnabled: z.boolean().optional().default(true).describe('Whether to wait until the extension is enabled')
		},
		async (args) => {
			const { extensionId, waitUntilEnabled = true } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.extensions.installExtension(extensionId, waitUntilEnabled);
			return {
				content: [{
					type: 'text' as const,
					text: `Installed extension: ${extensionId}${waitUntilEnabled ? ' (waited until enabled)' : ''}`
				}]
			};
		}
	));

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/index.ts]---
Location: vscode-main/test/mcp/src/automationTools/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import all tool modules
import { applyCoreTools } from './core.js';
import { applyEditorTools } from './editor.js';
import { applyTerminalTools } from './terminal.js';
import { applyDebugTools } from './debug.js';
import { applySearchTools } from './search.js';
import { applyExtensionsTools } from './extensions.js';
import { applyQuickAccessTools } from './quickAccess.js';
import { applyExplorerTools } from './explorer.js';
import { applyActivityBarTools } from './activityBar.js';
import { applySCMTools } from './scm.js';
import { applyStatusBarTools } from './statusbar.js';
import { applyProblemsTools } from './problems.js';
import { applySettingsTools } from './settings.js';
import { applyKeybindingsTools } from './keybindings.js';
import { applyNotebookTools } from './notebook.js';
import { applyLocalizationTools } from './localization.js';
import { applyTaskTools } from './task.js';
import { applyProfilerTools } from './profiler.js';
import { applyChatTools } from './chat.js';
import { ApplicationService } from '../application';

/**
 * Apply all VS Code automation tools to the MCP server
 * @param server - The MCP server instance
 * @param appService - The application service instance
 * @returns The registered tools from the server
 */
export function applyAllTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	let tools: RegisteredTool[] = [];

	// Core Application Management Tools
	tools = tools.concat(applyCoreTools(server, appService));

	// Editor Management Tools
	tools = tools.concat(applyEditorTools(server, appService));

	// Terminal Management Tools
	tools = tools.concat(applyTerminalTools(server, appService));

	// Debug Tools
	tools = tools.concat(applyDebugTools(server, appService));

	// Search Tools
	tools = tools.concat(applySearchTools(server, appService));

	// Extensions Tools
	tools = tools.concat(applyExtensionsTools(server, appService));

	// Command Palette and Quick Access Tools
	tools = tools.concat(applyQuickAccessTools(server, appService));

	// Explorer and File Management Tools
	tools = tools.concat(applyExplorerTools(server, appService));

	// Activity Bar Tools
	tools = tools.concat(applyActivityBarTools(server, appService));

	// Source Control Management Tools
	tools = tools.concat(applySCMTools(server, appService));

	// Status Bar Tools
	tools = tools.concat(applyStatusBarTools(server, appService));

	// Problems Panel Tools
	tools = tools.concat(applyProblemsTools(server, appService));

	// Settings Editor Tools
	tools = tools.concat(applySettingsTools(server, appService));

	// Keybindings Editor Tools
	tools = tools.concat(applyKeybindingsTools(server, appService));

	// Notebook Tools
	tools = tools.concat(applyNotebookTools(server, appService));

	// Localization Tools
	tools = tools.concat(applyLocalizationTools(server, appService));

	// Task Tools
	tools = tools.concat(applyTaskTools(server, appService));

	// Profiler Tools
	tools = tools.concat(applyProfilerTools(server, appService));

	// Chat Tools
	tools = tools.concat(applyChatTools(server, appService));

	// Return all registered tools
	return tools;
}

// Re-export individual tool functions for selective use
export {
	applyCoreTools,
	applyEditorTools,
	applyTerminalTools,
	applyDebugTools,
	applySearchTools,
	applyExtensionsTools,
	applyQuickAccessTools,
	applyExplorerTools,
	applyActivityBarTools,
	applySCMTools,
	applyStatusBarTools,
	applyProblemsTools,
	applySettingsTools,
	applyKeybindingsTools,
	applyNotebookTools,
	applyLocalizationTools,
	applyTaskTools,
	applyProfilerTools,
	applyChatTools
};
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/keybindings.ts]---
Location: vscode-main/test/mcp/src/automationTools/keybindings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';

/**
 * Keybindings Editor Tools
 */
export function applyKeybindingsTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_keybindings_update',
	// 	'Update a keybinding for a specific command',
	// 	{
	// 		command: z.string().describe('Command ID to update keybinding for'),
	// 		commandName: z.string().optional().describe('Optional command display name'),
	// 		keybinding: z.string().describe('New keybinding (e.g., "ctrl+k ctrl+c")'),
	// 		keybindingTitle: z.string().describe('Display title for the keybinding')
	// 	},
	// 	async (args) => {
	// 		const { command, commandName, keybinding, keybindingTitle } = args;
	// 		await app.workbench.keybindingsEditor.updateKeybinding(command, commandName, keybinding, keybindingTitle);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Updated keybinding for "${command}"${commandName ? ` (${commandName})` : ''}: ${keybinding} (${keybindingTitle})`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/localization.ts]---
Location: vscode-main/test/mcp/src/automationTools/localization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';

/**
 * Localization Tools
 */
export function applyLocalizationTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_localization_get_locale_info',
	// 	'Get current locale information',
	// 	async () => {
	// 		const localeInfo = await app.workbench.localization.getLocaleInfo();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Locale info:\n${JSON.stringify(localeInfo, null, 2)}`
	// 			}]
	// 		};
	// 	}
	// );

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_localization_get_localized_strings',
	// 	'Get all localized strings',
	// 	async () => {
	// 		const localizedStrings = await app.workbench.localization.getLocalizedStrings();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Localized strings:\n${JSON.stringify(localizedStrings, null, 2)}`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/notebook.ts]---
Location: vscode-main/test/mcp/src/automationTools/notebook.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Notebook Tools
 */
export function applyNotebookTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	tools.push(server.tool(
		'vscode_automation_notebook_open',
		'Open a notebook',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.notebook.openNotebook();
			return {
				content: [{
					type: 'text' as const,
					text: 'Opened notebook'
				}]
			};
		}
	));

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_focus_next_cell',
	// 	'Focus the next cell in the notebook',
	// 	async () => {
	// 		await app.workbench.notebook.focusNextCell();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Focused next cell'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_focus_first_cell',
	// 	'Focus the first cell in the notebook',
	// 	async () => {
	// 		await app.workbench.notebook.focusFirstCell();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Focused first cell'
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_notebook_edit_cell',
		'Enter edit mode for the current cell',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.notebook.editCell();
			return {
				content: [{
					type: 'text' as const,
					text: 'Entered cell edit mode'
				}]
			};
		}
	));

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_notebook_stop_editing_cell',
	// 	'Exit edit mode for the current cell',
	// 	async () => {
	// 		await app.workbench.notebook.stopEditingCell();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Exited cell edit mode'
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_notebook_type_in_editor',
		'Type text in the notebook cell editor',
		{
			text: z.string().describe('Text to type in the cell editor')
		},
		async (args) => {
			const { text } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.notebook.waitForTypeInEditor(text);
			return {
				content: [{
					type: 'text' as const,
					text: `Typed in notebook cell: "${text}"`
				}]
			};
		}
	));

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_wait_for_cell_contents',
	// 	'Wait for specific contents in the active cell editor',
	// 	{
	// 		contents: z.string().describe('Expected contents in the active cell')
	// 	},
	// 	async (args) => {
	// 		const { contents } = args;
	// 		await app.workbench.notebook.waitForActiveCellEditorContents(contents);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Active cell contains expected contents: "${contents}"`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_wait_for_markdown_contents',
	// 	'Wait for specific text in markdown cell output',
	// 	{
	// 		markdownSelector: z.string().describe('CSS selector for the markdown element'),
	// 		text: z.string().describe('Expected text in the markdown output')
	// 	},
	// 	async (args) => {
	// 		const { markdownSelector, text } = args;
	// 		await app.workbench.notebook.waitForMarkdownContents(markdownSelector, text);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Markdown content found: "${text}" in ${markdownSelector}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_insert_cell',
	// 	'Insert a new cell of specified type',
	// 	{
	// 		kind: z.enum(['markdown', 'code']).describe('Type of cell to insert')
	// 	},
	// 	async (args) => {
	// 		const { kind } = args;
	// 		await app.workbench.notebook.insertNotebookCell(kind);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Inserted ${kind} cell`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_delete_active_cell',
	// 	'Delete the currently active cell',
	// 	async () => {
	// 		await app.workbench.notebook.deleteActiveCell();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Deleted active cell'
	// 			}]
	// 		};
	// 	}
	// );

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_notebook_focus_in_cell_output',
	// 	'Focus inside cell output area',
	// 	async () => {
	// 		await app.workbench.notebook.focusInCellOutput();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Focused in cell output'
	// 			}]
	// 		};
	// 	}
	// );

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_notebook_focus_out_cell_output',
	// 	'Focus outside cell output area',
	// 	async () => {
	// 		await app.workbench.notebook.focusOutCellOutput();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Focused out of cell output'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_execute_active_cell',
	// 	'Execute the currently active cell',
	// 	async () => {
	// 		await app.workbench.notebook.executeActiveCell();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Executed active cell'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_notebook_execute_cell_action',
	// 	'Execute a specific cell action using CSS selector',
	// 	{
	// 		selector: z.string().describe('CSS selector for the cell action to execute')
	// 	},
	// 	async (args) => {
	// 		const { selector } = args;
	// 		await app.workbench.notebook.executeCellAction(selector);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Executed cell action: ${selector}`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/problems.ts]---
Location: vscode-main/test/mcp/src/automationTools/problems.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Problems Panel Tools
 */
export function applyProblemsTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	tools.push(server.tool(
		'vscode_automation_problems_show',
		'Show the problems view',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.problems.showProblemsView();
			return {
				content: [{
					type: 'text' as const,
					text: 'Showed problems view'
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_problems_hide',
		'Hide the problems view',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.problems.hideProblemsView();
			return {
				content: [{
					type: 'text' as const,
					text: 'Hid problems view'
				}]
			};
		}
	));

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_problems_wait_for_view',
	// 	'Wait for the problems view to appear',
	// 	async () => {
	// 		await app.workbench.problems.waitForProblemsView();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Problems view is now visible'
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_problems_get_selector_in_view',
		'Get CSS selector for problems of a specific severity in the problems view',
		{
			severity: z.enum(['WARNING', 'ERROR']).describe('Problem severity (WARNING or ERROR)')
		},
		async (args) => {
			const { severity } = args;
			const severityMap: Record<string, number> = {
				'WARNING': 0,
				'ERROR': 1
			};

			// This is a static method that returns a selector, not an async operation
			const app = await appService.getOrCreateApplication();
			// eslint-disable-next-line local/code-no-any-casts
			const selector = (app.workbench.problems.constructor as any).getSelectorInProblemsView(severityMap[severity]);
			return {
				content: [{
					type: 'text' as const,
					text: `CSS selector for ${severity} problems in view: ${selector}`
				}]
			};
		}
	));

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_problems_get_selector_in_editor',
	// 	'Get CSS selector for problems of a specific severity in the editor',
	// 	{
	// 		severity: z.enum(['WARNING', 'ERROR']).describe('Problem severity (WARNING or ERROR)')
	// 	},
	// 	async (args) => {
	// 		const { severity } = args;
	// 		const severityMap: Record<string, number> = {
	// 			'WARNING': 0,
	// 			'ERROR': 1
	// 		};

	// 		// This is a static method that returns a selector, not an async operation
	// 		const selector = (app.workbench.problems.constructor as any).getSelectorInEditor(severityMap[severity]);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `CSS selector for ${severity} problems in editor: ${selector}`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/profiler.ts]---
Location: vscode-main/test/mcp/src/automationTools/profiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';

/**
 * Profiler Tools
 * Note: Due to MCP limitations, these tools provide information about profiler methods
 * but cannot execute them directly as they require function parameters
 */
export function applyProfilerTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Seems too niche
	// 	server.tool(
	// 		'vscode_automation_profiler_info',
	// 		'Get information about available profiler methods',
	// 		{},
	// 		async () => {
	// 			return {
	// 				content: [{
	// 					type: 'text' as const,
	// 					text: `Profiler methods available:
	// - checkObjectLeaks(classNames, fn): Check for object leaks during function execution
	// - checkHeapLeaks(classNames, fn): Check for heap leaks during function execution

	// Note: These methods require function parameters and cannot be executed directly via MCP.
	// They are primarily used within VS Code's automation test framework.`
	// 				}]
	// 			};
	// 		}
	// 	);

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/quickAccess.ts]---
Location: vscode-main/test/mcp/src/automationTools/quickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Command Palette and Quick Access Tools
 */
export function applyQuickAccessTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	tools.push(server.tool(
		'vscode_automation_command_run',
		'Run a command by name through the command palette',
		{
			command: z.string().describe('The command name to run'),
			exactMatch: z.boolean().optional().describe('Whether to require exact label match')
		},
		async (args) => {
			const { command, exactMatch } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.quickaccess.runCommand(command, { exactLabelMatch: exactMatch, keepOpen: true });
			return {
				content: [{
					type: 'text' as const,
					text: `Executed command: "${command}"`
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_quick_open_file',
		'Open quick file search and select a file',
		{
			fileName: z.string().describe('Name or pattern of file to search for'),
			exactFileName: z.string().optional().describe('Exact file name to select from results')
		},
		async (args) => {
			const { fileName, exactFileName } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.quickaccess.openFileQuickAccessAndWait(fileName, exactFileName || fileName);
			return {
				content: [{
					type: 'text' as const,
					text: `Opened file through quick open: "${fileName}"`
				}]
			};
		}
	));

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_quick_input_type',
	// 	'Type text into the currently open quick input',
	// 	{
	// 		text: z.string().describe('Text to type into quick input')
	// 	},
	// 	async (args) => {
	// 		const { text } = args;
	// 		await app.workbench.quickinput.type(text);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Typed in quick input: "${text}"`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_quick_input_select_item',
	// 	'Select an item from the quick input list',
	// 	{
	// 		index: z.number().optional().describe('Index of item to select (0-based)'),
	// 		keepOpen: z.boolean().optional().describe('Keep quick input open after selection')
	// 	},
	// 	async (args) => {
	// 		const { index = 0, keepOpen } = args;
	// 		await app.workbench.quickinput.selectQuickInputElement(index, keepOpen);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Selected quick input item at index ${index}`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/scm.ts]---
Location: vscode-main/test/mcp/src/automationTools/scm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Source Control Management Tools
 */
export function applySCMTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_open',
	// 	'Open the Source Control Management viewlet',
	// 	async () => {
	// 		await app.workbench.scm.openSCMViewlet();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Opened SCM viewlet'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_wait_for_change',
	// 	'Wait for a specific change to appear in SCM',
	// 	{
	// 		name: z.string().describe('Name of the file change to wait for'),
	// 		type: z.string().optional().describe('Type of change (optional)')
	// 	},
	// 	async (args) => {
	// 		const { name, type } = args;
	// 		await app.workbench.scm.waitForChange(name, type);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Change detected: ${name}${type ? ` (${type})` : ''}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_refresh',
	// 	'Refresh the SCM viewlet',
	// 	async () => {
	// 		await app.workbench.scm.refreshSCMViewlet();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Refreshed SCM viewlet'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_open_change',
	// 	'Open a specific change in the SCM viewlet',
	// 	{
	// 		name: z.string().describe('Name of the file change to open')
	// 	},
	// 	async (args) => {
	// 		const { name } = args;
	// 		await app.workbench.scm.openChange(name);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Opened change: ${name}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_stage',
	// 	'Stage a specific file change',
	// 	{
	// 		name: z.string().describe('Name of the file to stage')
	// 	},
	// 	async (args) => {
	// 		const { name } = args;
	// 		await app.workbench.scm.stage(name);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Staged file: ${name}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_scm_unstage',
	// 	'Unstage a specific file change',
	// 	{
	// 		name: z.string().describe('Name of the file to unstage')
	// 	},
	// 	async (args) => {
	// 		const { name } = args;
	// 		await app.workbench.scm.unstage(name);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Unstaged file: ${name}`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_scm_commit',
		'Commit staged changes with a message',
		{
			message: z.string().describe('Commit message')
		},
		async (args) => {
			const { message } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.scm.commit(message);
			return {
				content: [{
					type: 'text' as const,
					text: `Committed changes with message: "${message}"`
				}]
			};
		}
	));

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/search.ts]---
Location: vscode-main/test/mcp/src/automationTools/search.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Search Tools
 */
export function applySearchTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_search_open',
	// 	'Open the search viewlet',
	// 	async () => {
	// 		await app.workbench.search.openSearchViewlet();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Opened search viewlet'
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_search_for_text',
		'Search for text in files',
		{
			searchText: z.string().describe('Text to search for')
		},
		async (args) => {
			const { searchText } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.search.openSearchViewlet();
			await app.workbench.search.searchFor(searchText);
			return {
				content: [{
					type: 'text' as const,
					text: `Searched for: "${searchText}"`
				}]
			};
		}
	));

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_search_set_files_to_include',
	// 	'Set files to include in search',
	// 	{
	// 		pattern: z.string().describe('File pattern to include (e.g., "*.ts", "src/**")')
	// 	},
	// 	async (args) => {
	// 		const { pattern } = args;
	// 		await app.workbench.search.setFilesToIncludeText(pattern);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Set files to include: "${pattern}"`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_search_submit',
	// 	'Submit the current search',
	// 	async () => {
	// 		await app.workbench.search.submitSearch();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Submitted search'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_search_clear_results',
	// 	'Clear search results',
	// 	async () => {
	// 		await app.workbench.search.clearSearchResults();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Cleared search results'
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/settings.ts]---
Location: vscode-main/test/mcp/src/automationTools/settings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Settings Editor Tools
 */
export function applySettingsTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// I don't think we need this and the batch version
	// server.tool(
	// 	'vscode_automation_settings_add_user_setting',
	// 	'Add a single user setting key-value pair',
	// 	{
	// 		setting: z.string().describe('Setting key (e.g., "editor.fontSize")'),
	// 		value: z.string().describe('Setting value (as JSON string)')
	// 	},
	// 	async (args) => {
	// 		const { setting, value } = args;
	// 		await app.workbench.settingsEditor.addUserSetting(setting, value);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Added user setting: ${setting} = ${value}`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_settings_add_user_settings',
		'Add multiple user settings at once',
		{
			settings: z.array(z.array(z.string()).length(2)).describe('Array of [key, value] setting pairs')
		},
		async (args) => {
			const { settings } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.settingsEditor.addUserSettings(settings as [string, string][]);
			return {
				content: [{
					type: 'text' as const,
					text: `Added ${settings.length} user settings: ${settings.map(([k, v]) => `${k}=${v}`).join(', ')}`
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_settings_clear_user_settings',
		'Clear all user settings',
		async () => {
			const app = await appService.getOrCreateApplication();
			await app.workbench.settingsEditor.clearUserSettings();
			return {
				content: [{
					type: 'text' as const,
					text: 'Cleared all user settings'
				}]
			};
		}
	));

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_settings_open_user_file',
	// 	'Open the user settings JSON file',
	// 	async () => {
	// 		await app.workbench.settingsEditor.openUserSettingsFile();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Opened user settings file'
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this one out
	// server.tool(
	// 	'vscode_automation_settings_open_user_ui',
	// 	'Open the user settings UI',
	// 	async () => {
	// 		await app.workbench.settingsEditor.openUserSettingsUI();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Opened user settings UI'
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_settings_search_ui',
		'Search for settings in the settings UI',
		{
			query: z.string().describe('Search query for settings')
		},
		async (args) => {
			const { query } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.settingsEditor.searchSettingsUI(query);
			return {
				content: [{
					type: 'text' as const,
					text: `Searched settings UI for: "${query}"`
				}]
			};
		}
	));

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/statusbar.ts]---
Location: vscode-main/test/mcp/src/automationTools/statusbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';

/**
 * Status Bar Tools
 */
export function applyStatusBarTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_statusbar_wait_for_element',
	// 	'Wait for a specific status bar element to appear',
	// 	{
	// 		element: z.enum([
	// 			'BRANCH_STATUS',
	// 			'SYNC_STATUS',
	// 			'PROBLEMS_STATUS',
	// 			'SELECTION_STATUS',
	// 			'INDENTATION_STATUS',
	// 			'ENCODING_STATUS',
	// 			'EOL_STATUS',
	// 			'LANGUAGE_STATUS'
	// 		]).describe('Status bar element to wait for')
	// 	},
	// 	async (args) => {
	// 		const { element } = args;
	// 		// Map string to enum value
	// 		const elementMap: Record<string, number> = {
	// 			'BRANCH_STATUS': 0,
	// 			'SYNC_STATUS': 1,
	// 			'PROBLEMS_STATUS': 2,
	// 			'SELECTION_STATUS': 3,
	// 			'INDENTATION_STATUS': 4,
	// 			'ENCODING_STATUS': 5,
	// 			'EOL_STATUS': 6,
	// 			'LANGUAGE_STATUS': 7
	// 		};

	// 		await app.workbench.statusbar.waitForStatusbarElement(elementMap[element]);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Status bar element found: ${element}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_statusbar_click',
	// 	'Click on a specific status bar element',
	// 	{
	// 		element: z.enum([
	// 			'BRANCH_STATUS',
	// 			'SYNC_STATUS',
	// 			'PROBLEMS_STATUS',
	// 			'SELECTION_STATUS',
	// 			'INDENTATION_STATUS',
	// 			'ENCODING_STATUS',
	// 			'EOL_STATUS',
	// 			'LANGUAGE_STATUS'
	// 		]).describe('Status bar element to click')
	// 	},
	// 	async (args) => {
	// 		const { element } = args;
	// 		// Map string to enum value
	// 		const elementMap: Record<string, number> = {
	// 			'BRANCH_STATUS': 0,
	// 			'SYNC_STATUS': 1,
	// 			'PROBLEMS_STATUS': 2,
	// 			'SELECTION_STATUS': 3,
	// 			'INDENTATION_STATUS': 4,
	// 			'ENCODING_STATUS': 5,
	// 			'EOL_STATUS': 6,
	// 			'LANGUAGE_STATUS': 7
	// 		};

	// 		await app.workbench.statusbar.clickOn(elementMap[element]);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Clicked status bar element: ${element}`
	// 			}]
	// 		};
	// 	}
	// );

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_statusbar_wait_for_eol',
	// 	'Wait for a specific End of Line (EOL) type in the status bar',
	// 	{
	// 		eol: z.string().describe('EOL type to wait for (e.g., "LF", "CRLF")')
	// 	},
	// 	async (args) => {
	// 		const { eol } = args;
	// 		const result = await app.workbench.statusbar.waitForEOL(eol);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `EOL status found: ${result}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_statusbar_wait_for_text',
	// 	'Wait for specific text to appear in a status bar element',
	// 	{
	// 		title: z.string().describe('Title/identifier of the status bar element'),
	// 		text: z.string().describe('Text to wait for in the status bar element')
	// 	},
	// 	async (args) => {
	// 		const { title, text } = args;
	// 		await app.workbench.statusbar.waitForStatusbarText(title, text);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Status bar text found - ${title}: "${text}"`
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/task.ts]---
Location: vscode-main/test/mcp/src/automationTools/task.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Task Tools
 */
export function applyTaskTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];

	// Seems too niche
	// server.tool(
	// 	'vscode_automation_task_assert_tasks',
	// 	'Assert that specific tasks exist with given properties',
	// 	{
	// 		filter: z.string().describe('Filter string for tasks'),
	// 		expected: z.array(z.object({
	// 			label: z.string().optional(),
	// 			type: z.string().optional(),
	// 			command: z.string().optional(),
	// 			identifier: z.string().optional(),
	// 			group: z.string().optional(),
	// 			isBackground: z.boolean().optional(),
	// 			promptOnClose: z.boolean().optional(),
	// 			icon: z.object({
	// 				id: z.string().optional(),
	// 				color: z.string().optional()
	// 			}).optional(),
	// 			hide: z.boolean().optional()
	// 		})).describe('Array of expected task properties'),
	// 		type: z.enum(['run', 'configure']).describe('Type of task operation')
	// 	},
	// 	async (args) => {
	// 		const { filter, expected, type } = args;
	// 		await app.workbench.task.assertTasks(filter, expected, type);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Asserted ${expected.length} tasks for ${type} with filter: "${filter}"`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_task_configure',
		'Configure a task with specific properties',
		{
			properties: z.object({
				label: z.string().optional(),
				type: z.string().optional(),
				command: z.string().optional(),
				identifier: z.string().optional(),
				group: z.string().optional(),
				isBackground: z.boolean().optional(),
				promptOnClose: z.boolean().optional(),
				icon: z.object({
					id: z.string().optional(),
					color: z.string().optional()
				}).optional(),
				hide: z.boolean().optional()
			}).describe('Task configuration properties')
		},
		async (args) => {
			const { properties } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.task.configureTask(properties);
			return {
				content: [{
					type: 'text' as const,
					text: `Configured task: ${properties.label || properties.identifier || 'unnamed task'}`
				}]
			};
		}
	));

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/mcp/src/automationTools/terminal.ts]---
Location: vscode-main/test/mcp/src/automationTools/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApplicationService } from '../application';
import { z } from 'zod';

/**
 * Terminal Management Tools
 */
export function applyTerminalTools(server: McpServer, appService: ApplicationService): RegisteredTool[] {
	const tools: RegisteredTool[] = [];
	tools.push(server.tool(
		'vscode_automation_terminal_create',
		'Create a new terminal',
		{
			expectedLocation: z.enum(['editor', 'panel']).optional().describe('Expected location of terminal (editor or panel)')
		},
		async (args) => {
			const { expectedLocation } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.terminal.createTerminal(expectedLocation);
			return {
				content: [{
					type: 'text' as const,
					text: `Created new terminal${expectedLocation ? ` in ${expectedLocation}` : ''}`
				}]
			};
		}
	));

	tools.push(server.tool(
		'vscode_automation_terminal_run_command',
		'Run a command in the terminal',
		{
			command: z.string().describe('Command to run in the terminal'),
			skipEnter: z.boolean().optional().describe('Skip pressing enter after typing command')
		},
		async (args) => {
			const { command, skipEnter } = args;
			const app = await appService.getOrCreateApplication();
			await app.workbench.terminal.runCommandInTerminal(command, skipEnter);
			return {
				content: [{
					type: 'text' as const,
					text: `Ran command in terminal: "${command}"`
				}]
			};
		}
	));

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_terminal_wait_for_text',
	// 	'Wait for specific text to appear in terminal output',
	// 	{
	// 		acceptFunction: z.string().describe('JavaScript function body that takes buffer array and returns boolean'),
	// 		message: z.string().optional().describe('Optional message for waiting'),
	// 		splitIndex: z.number().optional().describe('Split terminal index (0 or 1)')
	// 	},
	// 	async (args) => {
	// 		const { acceptFunction, message, splitIndex } = args;
	// 		// Create function from string
	// 		const acceptFn = new Function('buffer', acceptFunction) as (buffer: string[]) => boolean;
	// 		const terminalSplitIndex = splitIndex === 0 ? 0 : splitIndex === 1 ? 1 : undefined;
	// 		await app.workbench.terminal.waitForTerminalText(acceptFn, message, terminalSplitIndex);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Terminal text condition met: ${message || 'custom condition'}`
	// 			}]
	// 		};
	// 	}
	// );

	tools.push(server.tool(
		'vscode_automation_terminal_get_groups',
		'Get current terminal groups information',
		async () => {
			const app = await appService.getOrCreateApplication();
			const groups = await app.workbench.terminal.getTerminalGroups();
			return {
				content: [{
					type: 'text' as const,
					text: `Terminal groups:\n${JSON.stringify(groups, null, 2)}`
				}]
			};
		}
	));

	// Seems too niche and redundant with runCommand tool
	// server.tool(
	// 	'vscode_automation_terminal_run_command_by_id',
	// 	'Run a terminal command by ID',
	// 	{
	// 		commandId: z.enum([
	// 			'workbench.action.terminal.split',
	// 			'workbench.action.terminal.killAll',
	// 			'workbench.action.terminal.unsplit',
	// 			'workbench.action.terminal.join',
	// 			'workbench.action.terminal.toggleTerminal',
	// 			'workbench.action.createTerminalEditor',
	// 			'workbench.action.createTerminalEditorSide',
	// 			'workbench.action.terminal.moveToTerminalPanel',
	// 			'workbench.action.terminal.moveToEditor',
	// 			'workbench.action.terminal.newWithProfile',
	// 			'workbench.action.terminal.selectDefaultShell',
	// 			'workbench.action.terminal.detachSession',
	// 			'workbench.action.terminal.new'
	// 		]).describe('Terminal command ID to execute'),
	// 		expectedLocation: z.enum(['editor', 'panel']).optional().describe('Expected location after command')
	// 	},
	// 	async (args) => {
	// 		const { commandId, expectedLocation } = args;
	// 		await app.workbench.terminal.runCommand(commandId as any, expectedLocation);
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: `Executed terminal command: ${commandId}`
	// 			}]
	// 		};
	// 	}
	// );

	// Playwright can probably figure this out
	// server.tool(
	// 	'vscode_automation_terminal_split',
	// 	'Split the current terminal',
	// 	async () => {
	// 		await app.workbench.terminal.clickSplitButton();
	// 		return {
	// 			content: [{
	// 				type: 'text' as const,
	// 				text: 'Split terminal'
	// 			}]
	// 		};
	// 	}
	// );

	return tools;
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/.gitignore]---
Location: vscode-main/test/monaco/.gitignore

```text
/dist/**/*.js
/dist/**/*.ttf
/out/
/esm-check/out/
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/.mocharc.json]---
Location: vscode-main/test/monaco/.mocharc.json

```json
{
	"$schema": "https://www.schemastore.org/mocharc",
	"ui": "bdd",
	"timeout": 10000
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/.npmrc]---
Location: vscode-main/test/monaco/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/core.js]---
Location: vscode-main/test/monaco/core.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as monaco from 'monaco-editor-core';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		return './editorWebWorkerMain.bundle.js';
	}
};

window.instance = monaco.editor.create(document.getElementById('container'), {
	value: [
		'from banana import *',
		'',
		'class Monkey:',
		'	# Bananas the monkey can eat.',
		'	capacity = 10',
		'	def eat(self, N):',
		'		\'\'\'Make the monkey eat N bananas!\'\'\'',
		'		capacity = capacity - N*banana.size',
		'',
		'	def feeding_frenzy(self):',
		'		eat(9.25)',
		'		return "Yum yum"',
	].join('\n'),
	language: 'python'
});
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/monaco.test.ts]---
Location: vscode-main/test/monaco/monaco.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as playwright from '@playwright/test';
import { assert } from 'chai';
import { injectAxe } from 'axe-playwright';

const PORT = 8563;
const TIMEOUT = 20 * 1000;

const APP = `http://127.0.0.1:${PORT}/dist/core.html`;

let browser: playwright.Browser;
let page: playwright.Page;

type BrowserType = 'chromium' | 'firefox' | 'webkit';

const browserType: BrowserType = process.env.BROWSER as BrowserType || 'chromium';

before(async function () {
	this.timeout(TIMEOUT);
	console.log(`Starting browser: ${browserType}`);
	browser = await playwright[browserType].launch({
		headless: process.argv.includes('--headless'),
	});
});

after(async function () {
	this.timeout(TIMEOUT);
	await browser.close();
});

const pageErrors: any[] = [];
beforeEach(async function () {
	this.timeout(TIMEOUT);
	page = await browser.newPage({
		viewport: {
			width: 800,
			height: 600
		}
	});

	pageErrors.length = 0;
	page.on('pageerror', (e) => {
		console.log(e);
		pageErrors.push(e);
	});
	page.on('pageerror', (e) => {
		console.log(e);
		pageErrors.push(e);
	});
});

afterEach(async () => {
	await page.close();
	for (const e of pageErrors) {
		throw e;
	}
});

describe('API Integration Tests', function (): void {
	this.timeout(TIMEOUT);

	beforeEach(async () => {
		await page.goto(APP);
	});

	it('`monaco` is not exposed as global', async function (): Promise<any> {
		assert.strictEqual(await page.evaluate(`typeof monaco`), 'undefined');
	});

	it('Focus and Type', async function (): Promise<any> {
		await page.evaluate(`
		(function () {
			instance.focus();
			instance.trigger('keyboard', 'cursorHome');
			instance.trigger('keyboard', 'type', {
				text: 'a'
			});
		})()
		`);
		assert.strictEqual(await page.evaluate(`instance.getModel().getLineContent(1)`), 'afrom banana import *');
	});

	it('Type and Undo', async function (): Promise<any> {
		await page.evaluate(`
		(function () {
			instance.focus();
			instance.trigger('keyboard', 'cursorHome');
			instance.trigger('keyboard', 'type', {
				text: 'a'
			});
			instance.getModel().undo();
		})()
		`);
		assert.strictEqual(await page.evaluate(`instance.getModel().getLineContent(1)`), 'from banana import *');
	});

	it('Multi Cursor', async function (): Promise<any> {
		await page.evaluate(`
		(function () {
			instance.focus();
			instance.trigger('keyboard', 'editor.action.insertCursorBelow');
			instance.trigger('keyboard', 'editor.action.insertCursorBelow');
			instance.trigger('keyboard', 'editor.action.insertCursorBelow');
			instance.trigger('keyboard', 'editor.action.insertCursorBelow');
			instance.trigger('keyboard', 'editor.action.insertCursorBelow');
			instance.trigger('keyboard', 'type', {
				text: '# '
			});
			instance.focus();
		})()
		`);

		await page.waitForTimeout(1000);

		assert.deepStrictEqual(await page.evaluate(`
			[
				instance.getModel().getLineContent(1),
				instance.getModel().getLineContent(2),
				instance.getModel().getLineContent(3),
				instance.getModel().getLineContent(4),
				instance.getModel().getLineContent(5),
				instance.getModel().getLineContent(6),
				instance.getModel().getLineContent(7),
			]
		`), [
			'# from banana import *',
			'# ',
			'# class Monkey:',
			'# 	# Bananas the monkey can eat.',
			'# 	capacity = 10',
			'# 	def eat(self, N):',
			'\t\t\'\'\'Make the monkey eat N bananas!\'\'\''
		]);
	});
	describe('Accessibility', function (): void {
		beforeEach(async () => {
			await page.goto(APP);
			await injectAxe(page);
			await page.evaluate(`
			(function () {
				instance.focus();
				instance.trigger('keyboard', 'cursorHome');
				instance.trigger('keyboard', 'type', {
					text: 'a'
				});
			})()
			`);
		});

		it('Editor should not have critical accessibility violations', async () => {
			let violationCount = 0;
			const checkedElements = new Set<string>();

			// Run axe and get all results (passes and violations)
			const axeResults = await page.evaluate(() => {
				return window.axe.run(document, {
					runOnly: {
						type: 'tag',
						values: [
							'wcag2a',
							'wcag2aa',
							'wcag21a',
							'wcag21aa',
							'best-practice'
						]
					}
				});
			});

			axeResults.violations.forEach((v: any) => {
				const isCritical = v.impact === 'critical';
				const emoji = isCritical ? '❌' : undefined;
				v.nodes.forEach((node: any) => {
					const selector = node.target?.join(' ');
					if (selector && emoji) {
						checkedElements.add(selector);
						console.log(`${emoji} FAIL: ${selector} - ${v.id} - ${v.description}`);
					}
				});
				violationCount += isCritical ? 1 : 0;
			});

			axeResults.passes.forEach((pass: any) => {
				pass.nodes.forEach((node: any) => {
					const selector = node.target?.join(' ');
					if (selector && !checkedElements.has(selector)) {
						checkedElements.add(selector);
					}
				});
			});

			playwright.expect(violationCount).toBe(0);
		});

		it('Editor should not have color contrast accessibility violations', async () => {
			let violationCount = 0;
			const checkedElements = new Set<string>();

			const axeResults = await page.evaluate(() => {
				return window.axe.run(document, {
					runOnly: {
						type: 'rule',
						values: ['color-contrast']
					}
				});
			});

			axeResults.violations.forEach((v: any) => {
				const isCritical = v.impact === 'critical';
				const emoji = isCritical ? '❌' : undefined;
				v.nodes.forEach((node: any) => {
					const selector = node.target?.join(' ');
					if (selector && emoji) {
						checkedElements.add(selector);
						console.log(`${emoji} FAIL: ${selector} - ${v.id} - ${v.description}`);
					}
				});
				violationCount += 1;
			});

			axeResults.passes.forEach((pass: any) => {
				pass.nodes.forEach((node: any) => {
					const selector = node.target?.join(' ');
					if (selector && !checkedElements.has(selector)) {
						checkedElements.add(selector);
					}
				});
			});

			playwright.expect(violationCount).toBe(0);
		});
		it('Monaco editor container should have an ARIA role', async () => {
			const role = await page.evaluate(() => {
				const container = document.querySelector('.monaco-editor');
				return container?.getAttribute('role');
			});
			assert.isDefined(role, 'Monaco editor container should have a role attribute');
		});

		it('Monaco editor should have an ARIA label', async () => {
			const ariaLabel = await page.evaluate(() => {
				const container = document.querySelector('.monaco-editor');
				return container?.getAttribute('aria-label');
			});
			assert.isDefined(ariaLabel, 'Monaco editor container should have an aria-label attribute');
		});

		it('All toolbar buttons should have accessible names', async () => {
			const buttonsWithoutLabel = await page.evaluate(() => {
				return Array.from(document.querySelectorAll('button')).filter(btn => {
					const label = btn.getAttribute('aria-label') || btn.textContent?.trim();
					return !label;
				}).map(btn => btn.outerHTML);
			});
			assert.deepEqual(buttonsWithoutLabel, [], 'All toolbar buttons should have accessible names');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/package-lock.json]---
Location: vscode-main/test/monaco/package-lock.json

```json
{
  "name": "test-monaco",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "test-monaco",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/chai": "^4.2.14",
        "axe-playwright": "^2.1.0",
        "chai": "^4.2.0",
        "warnings-to-errors-webpack-plugin": "^2.3.0"
      }
    },
    "node_modules/@types/chai": {
      "version": "4.2.14",
      "resolved": "https://registry.npmjs.org/@types/chai/-/chai-4.2.14.tgz",
      "integrity": "sha512-G+ITQPXkwTrslfG5L/BksmbLUA0M1iybEsmCWPqzSxsRRhJZimBKJkoMi8fr/CPygPTj4zO5pJH7I2/cm9M7SQ==",
      "dev": true
    },
    "node_modules/@types/junit-report-builder": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/junit-report-builder/-/junit-report-builder-3.0.2.tgz",
      "integrity": "sha512-R5M+SYhMbwBeQcNXYWNCZkl09vkVfAtcPIaCGdzIkkbeaTrVbGQ7HVgi4s+EmM/M1K4ZuWQH0jGcvMvNePfxYA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/assertion-error": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/assertion-error/-/assertion-error-1.1.0.tgz",
      "integrity": "sha512-jgsaNduz+ndvGyFt3uSuWqvy4lCnIJiovtouQN5JZHOKCS2QuhEdbcQHFhVksz2N2U9hXJo8odG7ETyWlEeuDw==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/axe-core": {
      "version": "4.10.3",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.10.3.tgz",
      "integrity": "sha512-Xm7bpRXnDSX2YE2YFfBk2FnF0ep6tmG7xPh8iHee8MIcrgq762Nkce856dYtJYLkuIoYZvGfTs/PbZhideTcEg==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axe-html-reporter": {
      "version": "2.2.11",
      "resolved": "https://registry.npmjs.org/axe-html-reporter/-/axe-html-reporter-2.2.11.tgz",
      "integrity": "sha512-WlF+xlNVgNVWiM6IdVrsh+N0Cw7qupe5HT9N6Uyi+aN7f6SSi92RDomiP1noW8OWIV85V6x404m5oKMeqRV3tQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mustache": "^4.0.1"
      },
      "engines": {
        "node": ">=8.9.0"
      },
      "peerDependencies": {
        "axe-core": ">=3"
      }
    },
    "node_modules/axe-playwright": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/axe-playwright/-/axe-playwright-2.1.0.tgz",
      "integrity": "sha512-tY48SX56XaAp16oHPyD4DXpybz8Jxdz9P7exTjF/4AV70EGUavk+1fUPWirM0OYBR+YyDx6hUeDvuHVA6fB9YA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/junit-report-builder": "^3.0.2",
        "axe-core": "^4.10.1",
        "axe-html-reporter": "2.2.11",
        "junit-report-builder": "^5.1.1",
        "picocolors": "^1.1.1"
      },
      "peerDependencies": {
        "playwright": ">1.0.0"
      }
    },
    "node_modules/chai": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/chai/-/chai-4.2.0.tgz",
      "integrity": "sha512-XQU3bhBukrOsQCuwZndwGcCVQHyZi53fQ6Ys1Fym7E4olpIqqZZhhoFJoaKVvV17lWQoXYwgWN2nF5crA8J2jw==",
      "dev": true,
      "dependencies": {
        "assertion-error": "^1.1.0",
        "check-error": "^1.0.2",
        "deep-eql": "^3.0.1",
        "get-func-name": "^2.0.0",
        "pathval": "^1.1.0",
        "type-detect": "^4.0.5"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/check-error": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/check-error/-/check-error-1.0.2.tgz",
      "integrity": "sha1-V00xLt2Iu13YkS6Sht1sCu1KrII= sha512-BrgHpW9NURQgzoNyjfq0Wu6VFO6D7IZEmJNdtgNqpzGG8RuNFHt2jQxWlAs4HMe119chBnv+34syEZtc6IhLtA==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/deep-eql": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/deep-eql/-/deep-eql-3.0.1.tgz",
      "integrity": "sha512-+QeIQyN5ZuO+3Uk5DYh6/1eKO0m0YmJFGNmFHGACpf1ClL1nmlV/p4gNgbl2pJGxgXb4faqo6UE+M5ACEMyVcw==",
      "dev": true,
      "dependencies": {
        "type-detect": "^4.0.0"
      },
      "engines": {
        "node": ">=0.12"
      }
    },
    "node_modules/get-func-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/get-func-name/-/get-func-name-2.0.2.tgz",
      "integrity": "sha512-8vXOvuE167CtIc3OyItco7N/dpRtBbYOsPsXCz7X/PMnlGjYjSGuZJgM1Y7mmew7BKf9BqvLX2tnOVy1BBUsxQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/junit-report-builder": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/junit-report-builder/-/junit-report-builder-5.1.1.tgz",
      "integrity": "sha512-ZNOIIGMzqCGcHQEA2Q4rIQQ3Df6gSIfne+X9Rly9Bc2y55KxAZu8iGv+n2pP0bLf0XAOctJZgeloC54hWzCahQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lodash": "^4.17.21",
        "make-dir": "^3.1.0",
        "xmlbuilder": "^15.1.1"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/make-dir": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-3.1.0.tgz",
      "integrity": "sha512-g3FeP20LNwhALb/6Cz6Dd4F2ngze0jz7tbzrD2wAV+o9FeNHe4rL+yK2md0J/fiSf1sa1ADhXqi5+oVwOM/eGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mustache": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/mustache/-/mustache-4.2.0.tgz",
      "integrity": "sha512-71ippSywq5Yb7/tVYyGbkBggbU8H3u5Rz56fH60jGFgr8uHwxs+aSKeqmluIVzM0m0kB7xQjKS6qPfd0b2ZoqQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "mustache": "bin/mustache"
      }
    },
    "node_modules/pathval": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/pathval/-/pathval-1.1.1.tgz",
      "integrity": "sha512-Dp6zGqpTdETdR63lehJYPeIOqpiNBNtc7BpWSLrOje7UaIsE5aY92r/AunQA7rsXvet3lrJ3JnZX29UPTKXyKQ==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/type-detect": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/type-detect/-/type-detect-4.0.8.tgz",
      "integrity": "sha512-0fr/mIH1dlO+x7TlcMy+bIDqKPsw/70tVyeHW787goQjhmqaZe10uwLujubK9q9Lg6Fiho1KUKDYz0Z7k7g5/g==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/warnings-to-errors-webpack-plugin": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/warnings-to-errors-webpack-plugin/-/warnings-to-errors-webpack-plugin-2.3.0.tgz",
      "integrity": "sha512-fzOyw+Ctr2MqJ+4UXKobDiOLzMMSBAdvGMWvZ4NRgTBCofAL2mmdfr6/Of3Bqz9Sq6R6xT5dLs6nnLLCtmppeQ==",
      "dev": true,
      "peerDependencies": {
        "webpack": "^2.2.0-rc || ^3 || ^4 || ^5"
      }
    },
    "node_modules/xmlbuilder": {
      "version": "15.1.1",
      "resolved": "https://registry.npmjs.org/xmlbuilder/-/xmlbuilder-15.1.1.tgz",
      "integrity": "sha512-yMqGBqtXyeN1e3TGYvgNgDVZ3j84W4cwkOXQswghol6APgZWaff9lnbvN7MHYJOiXsvGPXtjTYJEiC9J2wv9Eg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.0"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/package.json]---
Location: vscode-main/test/monaco/package.json

```json
{
  "name": "test-monaco",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "scripts": {
    "compile": "node ../../node_modules/typescript/bin/tsc",
    "bundle-webpack": "node ../../node_modules/webpack/bin/webpack --config ./webpack.config.js --bail",
    "esm-check": "node esm-check/esm-check.js",
    "test": "node runner.js"
  },
  "devDependencies": {
    "@types/chai": "^4.2.14",
    "axe-playwright": "^2.1.0",
    "chai": "^4.2.0",
    "warnings-to-errors-webpack-plugin": "^2.3.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/README.md]---
Location: vscode-main/test/monaco/README.md

```markdown
# Monaco Editor Test

This directory contains scripts that are used to smoke test the Monaco Editor distribution.

## Setup & Bundle

 $test/monaco> npm i
 $test/monaco> npm run bundle

## Compile and run tests

 $test/monaco> npm run compile
 $test/monaco> npm run test
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/runner.js]---
Location: vscode-main/test/monaco/runner.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const yaserver = require('yaserver');
const http = require('http');
const cp = require('child_process');

const PORT = 8563;

yaserver.createServer({
	rootDir: __dirname
}).then((staticServer) => {
	const server = http.createServer((request, response) => {
		return staticServer.handle(request, response);
	});
	server.listen(PORT, '127.0.0.1', () => {
		runTests().then(() => {
			console.log(`All good`);
			process.exit(0);
		}, (err) => {
			console.error(err);
			process.exit(1);
		});
	});
});

function runTests() {
	return (
		runTest('chromium')
			.then(() => runTest('firefox'))
			// .then(() => runTest('webkit'))
	);
}

function runTest(browser) {
	return new Promise((resolve, reject) => {
		const proc = cp.spawn('node', ['../../node_modules/mocha/bin/mocha', 'out/*.test.js', '--headless'], {
			env: { BROWSER: browser, ...process.env },
			stdio: 'inherit'
		});
		proc.on('error', reject);
		proc.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(code);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/tsconfig.json]---
Location: vscode-main/test/monaco/tsconfig.json

```json
{
	"compilerOptions": {
		"module": "commonjs",
		"target": "es2016",
		"strict": true,
		"noUnusedParameters": false,
		"noUnusedLocals": true,
		"outDir": "out",
		"sourceMap": true,
		"skipLibCheck": true,
		"declaration": true,
		"lib": [
			"esnext", // for #201187
			"dom"
		]
	},
	"exclude": [
		"node_modules",
		"out",
		"tools"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/webpack.config.js]---
Location: vscode-main/test/monaco/webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const WarningsToErrorsPlugin = require('warnings-to-errors-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'core': './core.js',
		'editorWebWorkerMain': '../../out-monaco-editor-core/esm/vs/editor/common/services/editorWebWorkerMain.js',
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			'monaco-editor-core': path.resolve(__dirname, '../../out-monaco-editor-core/esm/vs/editor/editor.main.js'),
		}
	},
	stats: {
		all: false,
		modules: true,
		errors: true,
		warnings: true,
		// our additional options
		moduleTrace: true,
		errorDetails: true,
		chunks: true
	},
	plugins: [
		new WarningsToErrorsPlugin()
	],
	optimization: {
		// Without it, CI fails, which indicates a webpack minification bug.
		minimize: false,
	},
};
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/dist/core.html]---
Location: vscode-main/test/monaco/dist/core.html

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
</head>
<body>
	<div id="container" style="width:800px;height:600px;border:1px solid #ccc"></div>
	<script src="./core.bundle.js"></script>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/esm-check/esm-check.js]---
Location: vscode-main/test/monaco/esm-check/esm-check.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const fs = require('fs');
const path = require('path');
const playwright = require('@playwright/test');
const yaserver = require('yaserver');
const http = require('http');
const { glob } = require('glob');

const DEBUG_TESTS = false;
const SRC_DIR = path.join(__dirname, '../../../out-monaco-editor-core/esm');
const DST_DIR = path.join(__dirname, './out');
const PORT = 8562;

run();

async function run() {
	await extractSourcesWithoutCSS();
	const server = await startServer();

	const browser = await playwright['chromium'].launch({
		headless: !DEBUG_TESTS,
		devtools: DEBUG_TESTS
		// slowMo: DEBUG_TESTS ? 2000 : 0
	});

	const page = await browser.newPage({
		viewport: {
			width: 800,
			height: 600
		}
	});
	page.on('pageerror', (e) => {
		console.error(`[esm-check] A page error occurred:`);
		console.error(e);
		process.exit(1);
	});

	const URL = `http://127.0.0.1:${PORT}/index.html`;
	console.log(`[esm-check] Navigating to ${URL}`);
	const response = await page.goto(URL);
	if (!response) {
		console.error(`[esm-check] Missing response.`);
		process.exit(1);
	}
	if (response.status() !== 200) {
		console.error(`[esm-check] Response status ${response.status()} is not 200 .`);
		process.exit(1);
	}
	console.log(`[esm-check] All appears good.`);

	await page.close();
	await browser.close();

	server.close();
}

/**
 * @returns {Promise<http.Server>}
 */
async function startServer() {
	const staticServer = await yaserver.createServer({ rootDir: __dirname });
	return new Promise((resolve, reject) => {
		const server = http.createServer((request, response) => {
			return staticServer.handle(request, response);
		});
		server.listen(PORT, '127.0.0.1', () => {
			resolve(server);
		});
	});
}

async function extractSourcesWithoutCSS() {
	fs.rmSync(DST_DIR, { recursive: true, force: true });

	for (const file of glob.sync('**/*', { cwd: SRC_DIR, nodir: true })) {
		const srcFilename = path.join(SRC_DIR, file);
		if (!/\.js$/.test(srcFilename)) {
			continue;
		}

		const dstFilename = path.join(DST_DIR, file);

		let contents = fs.readFileSync(srcFilename).toString();
		contents = contents.replace(/import '[^']+\.css';/g, '');

		fs.mkdirSync(path.dirname(dstFilename), { recursive: true });
		fs.writeFileSync(dstFilename, contents);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/esm-check/index.html]---
Location: vscode-main/test/monaco/esm-check/index.html

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	</head>
	<body>
		<div id="container" style="width: 800px; height: 600px; border: 1px solid #ccc"></div>

		<script type="module" src="index.js"></script>
	</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: test/monaco/esm-check/index.js]---
Location: vscode-main/test/monaco/esm-check/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// eslint-disable-next-line local/code-no-standalone-editor
import * as monaco from './out/vs/editor/editor.main.js';

monaco.editor.create(document.getElementById('container'), {
	value: 'Hello world'
});
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/.gitignore]---
Location: vscode-main/test/smoke/.gitignore

```text
.DS_Store
npm-debug.log
Thumbs.db
node_modules/
out/
keybindings.*.json
test_data/
src/vscode/driver.d.ts
vscode-server*/
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/Audit.md]---
Location: vscode-main/test/smoke/Audit.md

```markdown
# VS Code Smoke Tests Failures History

This file contains a history of smoke test failures which could be avoided if particular techniques were used in the test (e.g. binding test elements with HTML5 `data-*` attribute).

To better understand what can be employed in smoke test to ensure its stability, it is important to understand patterns that led to smoke test breakage. This markdown is a result of work on [this issue](https://github.com/microsoft/vscode/issues/27906).

## Log

1. This following change led to the smoke test failure because DOM element's attribute `a[title]` was changed:
 [eac49a3](https://github.com/microsoft/vscode/commit/eac49a321b84cb9828430e9dcd3f34243a3480f7)

 This attribute was used in the smoke test to grab the contents of SCM part in status bar:
 [0aec2d6](https://github.com/microsoft/vscode/commit/0aec2d6838b5e65cc74c33b853ffbd9fa191d636)

2. To be continued...
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/package-lock.json]---
Location: vscode-main/test/smoke/package-lock.json

```json
{
  "name": "code-oss-dev-smoke-test",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "code-oss-dev-smoke-test",
      "version": "0.1.0",
      "license": "MIT",
      "dependencies": {
        "ncp": "^2.0.0",
        "node-fetch": "^2.6.7"
      },
      "devDependencies": {
        "@types/ncp": "2.0.1",
        "@types/node": "22.x",
        "@types/node-fetch": "^2.5.10",
        "npm-run-all": "^4.1.5"
      }
    },
    "node_modules/@types/ncp": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/@types/ncp/-/ncp-2.0.1.tgz",
      "integrity": "sha512-TeiJ7uvv/92ugSqZ0v9l0eNXzutlki0aK+R1K5bfA5SYUil46ITlxLW4iNTCf55P4L5weCmaOdtxGeGWvudwPg==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/node-fetch": {
      "version": "2.5.10",
      "resolved": "https://registry.npmjs.org/@types/node-fetch/-/node-fetch-2.5.10.tgz",
      "integrity": "sha512-IpkX0AasN44hgEad0gEF/V6EgR5n69VEqPEgnmoM8GsIGro3PowbWs4tR6IhxUTyPLpOn+fiGG6nrQhcmoCuIQ==",
      "dev": true,
      "dependencies": {
        "@types/node": "*",
        "form-data": "^3.0.0"
      }
    },
    "node_modules/ansi-styles": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
      "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
      "dev": true,
      "dependencies": {
        "color-convert": "^1.9.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha1-x57Zf380y48robyXkLzDZkdLS3k= sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "dev": true
    },
    "node_modules/balanced-match": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
      "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c= sha512-9Y0g0Q8rmSt+H33DfKv7FOc3v+iRI+o1lbzt8jGcIosYW37IIW/2XVYq5NPdmaD5NQ59Nk26Kl/vZbwW9Fr8vg==",
      "dev": true
    },
    "node_modules/brace-expansion": {
      "version": "1.1.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
      "integrity": "sha512-9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.0.tgz",
      "integrity": "sha512-AEXsYIyyDY3MCzbwdhzG3Jx1R0J2wetQyUynn6dYHAO+bg8l1k7jwZtRv4ryryFs7EP+NDlikJlVe59jr0cM2w==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "get-intrinsic": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/chalk": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz",
      "integrity": "sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "escape-string-regexp": "^1.0.5",
        "supports-color": "^5.3.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "dev": true,
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha1-p9BVi9icQveV3UIyj3QIMcpTvCU= sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==",
      "dev": true
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "dev": true,
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha1-2Klr13/Wjfd5OnMDajug1UBdR3s= sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true
    },
    "node_modules/cross-spawn": {
      "version": "6.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-6.0.6.tgz",
      "integrity": "sha512-VqCUuhcd1iB+dsv8gxPttb5iZh/D0iubSP21g36KXdEuf6I5JiioesUVjpCdHV9MZRUfVFlvwtIUyPfxo5trtw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "nice-try": "^1.0.4",
        "path-key": "^2.0.1",
        "semver": "^5.5.0",
        "shebang-command": "^1.2.0",
        "which": "^1.2.9"
      },
      "engines": {
        "node": ">=4.8"
      }
    },
    "node_modules/define-properties": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.1.3.tgz",
      "integrity": "sha512-3MqfYKj2lLzdMSf8ZIZE/V+Zuy+BgD6f164e8K2w7dgnpKArBDerGYpM46IYYcjnkdPNMjPk9A6VFB8+3SKlXQ==",
      "dev": true,
      "dependencies": {
        "object-keys": "^1.0.12"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha1-3zrhmayt+31ECqrgsp4icrJOxhk= sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "dev": true,
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/error-ex": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
      "integrity": "sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==",
      "dev": true,
      "dependencies": {
        "is-arrayish": "^0.2.1"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.18.0-next.1",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.18.0-next.1.tgz",
      "integrity": "sha512-I4UGspA0wpZXWENrdA0uHbnhte683t3qT/1VFH9aX2dA5PPSf6QW5HHXf5HImaqPmjXaVeVk4RGWnaylmV7uAA==",
      "dev": true,
      "dependencies": {
        "es-to-primitive": "^1.2.1",
        "function-bind": "^1.1.1",
        "has": "^1.0.3",
        "has-symbols": "^1.0.1",
        "is-callable": "^1.2.2",
        "is-negative-zero": "^2.0.0",
        "is-regex": "^1.1.1",
        "object-inspect": "^1.8.0",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.1",
        "string.prototype.trimend": "^1.0.1",
        "string.prototype.trimstart": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.2.1.tgz",
      "integrity": "sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==",
      "dev": true,
      "dependencies": {
        "is-callable": "^1.1.4",
        "is-date-object": "^1.0.1",
        "is-symbol": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ= sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "dev": true,
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/form-data": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-3.0.4.tgz",
      "integrity": "sha512-f0cRzm6dkyVYV3nPoooP8XlccPQukegwhAnpoLcXy+X+A8KfpGOoXwDr9FLZd3wzgLaBGQBE3lY93Zm/i1JvIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.4.tgz",
      "integrity": "sha512-WjKPNJF79dtJAVniUlGGWHYGz2jWxT6VhN/4m1NdkbZ2nOsEF+cI1Edgql5zCRhs/VsQYRvrXctxktVXZUkixw==",
      "dev": true
    },
    "node_modules/has": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/has/-/has-1.0.3.tgz",
      "integrity": "sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/has-flag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
      "integrity": "sha1-tdRU3CGZriJWmfNGfloH87lVuv0= sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hosted-git-info": {
      "version": "2.8.9",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-2.8.9.tgz",
      "integrity": "sha512-mxIDAb9Lsm6DoOJ7xH+5+X4y1LU/4Hi50L9C5sIswK3JzULS4bwk1FvjdBgvYR4bzT4tuUQiC15FE2f5HbLvYw==",
      "dev": true
    },
    "node_modules/is-arrayish": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "integrity": "sha1-d8mYQFJ6qOyxqLppe4BkWnqSap0= sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "dev": true
    },
    "node_modules/is-callable": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.2.tgz",
      "integrity": "sha512-dnMqspv5nU3LoewK2N/y7KLtxtakvTuaCsU9FU50/QDmdbHNy/4/JuRtMHqRU22o3q+W89YQndQEeCVwK+3qrA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.2.0.tgz",
      "integrity": "sha512-XRAfAdyyY5F5cOXn7hYQDqh2Xmii+DEfIcQGxK/uNwMHhIkPWO0g8msXcbzLe+MpGoR951MlqM/2iIlU4vKDdQ==",
      "dev": true,
      "dependencies": {
        "has": "^1.0.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.2.tgz",
      "integrity": "sha512-USlDT524woQ08aoZFzh3/Z6ch9Y/EWXEHQ/AaRN0SkKq4t2Jw2R2339tSXmwuVoY7LLlBCbOIlx2myP/L5zk0g==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.1.tgz",
      "integrity": "sha512-2z6JzQvZRa9A2Y7xC6dQQm4FSTSTNWjKIYYTt4246eMTJmIo0Q+ZyOsU66X8lxK1AbB92dFeglPLrhwpeRKO6w==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-regex": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.1.1.tgz",
      "integrity": "sha512-1+QkEcxiLlB7VEyFtyBg94e08OAsvq7FUBgApTq/w2ymCLyKJgDPsybBENVtA7XCQEgEXxKPonG+mvYRxh/LIg==",
      "dev": true,
      "dependencies": {
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.3.tgz",
      "integrity": "sha512-OwijhaRSgqvhm/0ZdAcXNZt9lYdKFpcRDT5ULUuYXPoT794UNOdU+gpT6Rzo7b4V2HUl/op6GqY894AZwv9faQ==",
      "dev": true,
      "dependencies": {
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha1-6PvzdNxVb/iUehDcsFctYz8s+hA= sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true
    },
    "node_modules/json-parse-better-errors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json-parse-better-errors/-/json-parse-better-errors-1.0.2.tgz",
      "integrity": "sha512-mrqyZKfX5EhL7hvqcV6WG1yYjnjeuYDzDhhcAAUrq8Po85NBQBJP+ZDUT75qZQ98IkUoBqdkExkukOU7Ts2wrw==",
      "dev": true
    },
    "node_modules/load-json-file": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/load-json-file/-/load-json-file-4.0.0.tgz",
      "integrity": "sha1-L19Fq5HjMhYjT9U62rZo607AmTs= sha512-Kx8hMakjX03tiGTLAIdJ+lL0htKnXjEZN6hk/tozf/WOuYGdZBJrZ+rCJRbVCugsjB3jMLn9746NsQIf5VjBMw==",
      "dev": true,
      "dependencies": {
        "graceful-fs": "^4.1.2",
        "parse-json": "^4.0.0",
        "pify": "^3.0.0",
        "strip-bom": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/memorystream": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/memorystream/-/memorystream-0.3.1.tgz",
      "integrity": "sha1-htcJCzDORV1j+64S3aUaR93K+bI= sha512-S3UwM3yj5mtUSEfP41UZmt/0SCoVYUcU1rkXv+BQ5Ig8ndL4sPoJNBUJERafdPb5jjHJGuMgytgKvKIf58XNBw==",
      "dev": true,
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/ncp": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ncp/-/ncp-2.0.0.tgz",
      "integrity": "sha1-GVoh1sRuNh0vsSgbo4uR6d9727M= sha512-zIdGUrPRFTUELUvr3Gmc7KZ2Sw/h1PiVM0Af/oHB6zgnV1ikqSfRk+TOufi79aHYCW3NiOXmr1BP5nWbzojLaA==",
      "bin": {
        "ncp": "bin/ncp"
      }
    },
    "node_modules/nice-try": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/nice-try/-/nice-try-1.0.5.tgz",
      "integrity": "sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==",
      "dev": true
    },
    "node_modules/node-fetch": {
      "version": "2.6.7",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.6.7.tgz",
      "integrity": "sha512-ZjMPFEfVx5j+y2yF35Kzx5sF7kDzxuDj6ziH4FFbOp87zKDZNx8yExJIb05OGF4Nlt9IHFIMBkRl41VdvcNdbQ==",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/normalize-package-data": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/normalize-package-data/-/normalize-package-data-2.5.0.tgz",
      "integrity": "sha512-/5CMN3T0R4XTj4DcGaexo+roZSdSFW/0AOOTROrjxzCG1wrWXEsGbRKevjlIL+ZDE4sZlJr5ED4YW0yqmkK+eA==",
      "dev": true,
      "dependencies": {
        "hosted-git-info": "^2.1.4",
        "resolve": "^1.10.0",
        "semver": "2 || 3 || 4 || 5",
        "validate-npm-package-license": "^3.0.1"
      }
    },
    "node_modules/npm-run-all": {
      "version": "4.1.5",
      "resolved": "https://registry.npmjs.org/npm-run-all/-/npm-run-all-4.1.5.tgz",
      "integrity": "sha512-Oo82gJDAVcaMdi3nuoKFavkIHBRVqQ1qvMb+9LHk/cF4P6B2m8aP04hGf7oL6wZ9BuGwX1onlLhpuoofSyoQDQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "chalk": "^2.4.1",
        "cross-spawn": "^6.0.5",
        "memorystream": "^0.3.1",
        "minimatch": "^3.0.4",
        "pidtree": "^0.3.0",
        "read-pkg": "^3.0.0",
        "shell-quote": "^1.6.1",
        "string.prototype.padend": "^3.0.0"
      },
      "bin": {
        "npm-run-all": "bin/npm-run-all/index.js",
        "run-p": "bin/run-p/index.js",
        "run-s": "bin/run-s/index.js"
      },
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.9.0.tgz",
      "integrity": "sha512-i3Bp9iTqwhaLZBxGkRfo5ZbE07BQRT7MGu8+nNgwW9ItGp1TzCTw2DLEoWwjClxBjOFI/hWljTAmYGCEwmtnOw==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.2.tgz",
      "integrity": "sha512-ixT2L5THXsApyiUPYKmW+2EHpXXe5Ii3M+f4e+aJFAHao5amFRW6J0OO6c/LU8Be47utCx2GL89hxGB6XSmKuQ==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3",
        "has-symbols": "^1.0.1",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/parse-json": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-4.0.0.tgz",
      "integrity": "sha1-vjX1Qlvh9/bHRxhPmKeIy5lHfuA= sha512-aOIos8bujGN93/8Ox/jPLh7RwVnPEysynVFE+fQZyg6jKELEHwzgKdLRFHUgXJL6kylijVSBC4BvN9OmsB48Rw==",
      "dev": true,
      "dependencies": {
        "error-ex": "^1.3.1",
        "json-parse-better-errors": "^1.0.1"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/path-key": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-2.0.1.tgz",
      "integrity": "sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A= sha512-fEHGKCSmUSDPv4uoj8AlD+joPlq3peND+HRYyxFz4KPw4z926S/b8rIuFs2FYJg3BwsxJf6A9/3eIdLaYC+9Dw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true
    },
    "node_modules/path-type": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/path-type/-/path-type-3.0.0.tgz",
      "integrity": "sha512-T2ZUsdZFHgA3u4e5PfPbjd7HDDpxPnQb5jN0SrDsjNSuVXHJqtwTnWqG0B1jZrgmJ/7lj1EmVIByWt1gxGkWvg==",
      "dev": true,
      "dependencies": {
        "pify": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/pidtree": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/pidtree/-/pidtree-0.3.1.tgz",
      "integrity": "sha512-qQbW94hLHEqCg7nhby4yRC7G2+jYHY4Rguc2bjw7Uug4GIJuu1tvf2uHaZv5Q8zdt+WKJ6qK1FOI6amaWUo5FA==",
      "dev": true,
      "bin": {
        "pidtree": "bin/pidtree.js"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/pify": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-3.0.0.tgz",
      "integrity": "sha1-5aSs0sEB/fPZpNB/DbxNtJ3SgXY= sha512-C3FsVNH1udSEX48gGX1xfvwTWfsYWj5U+8/uK15BGzIGrKoUpghX8hWZwa/OFnakBiiVNmBvemTJR5mcy7iPcg==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/read-pkg": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/read-pkg/-/read-pkg-3.0.0.tgz",
      "integrity": "sha1-nLxoaXj+5l0WwA4rGcI3/Pbjg4k= sha512-BLq/cCO9two+lBgiTYNqD6GdtK8s4NpaWrl6/rCO9w0TUS8oJl7cmToOZfRYllKTISY6nt1U7jQ53brmKqY6BA==",
      "dev": true,
      "dependencies": {
        "load-json-file": "^4.0.0",
        "normalize-package-data": "^2.3.2",
        "path-type": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve": {
      "version": "1.19.0",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.19.0.tgz",
      "integrity": "sha512-rArEXAgsBG4UgRGcynxWIWKFvh/XZCcS8UJdHhwy91zwAvCZIbcs+vAbflgBnNjYMs/i/i+/Ux6IZhML1yPvxg==",
      "dev": true,
      "dependencies": {
        "is-core-module": "^2.1.0",
        "path-parse": "^1.0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/semver": {
      "version": "5.7.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-5.7.2.tgz",
      "integrity": "sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g==",
      "dev": true,
      "bin": {
        "semver": "bin/semver"
      }
    },
    "node_modules/shebang-command": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-1.2.0.tgz",
      "integrity": "sha1-RKrGW2lbAzmJaMOfNj/uXer98eo= sha512-EV3L1+UQWGor21OmnvojK36mhg+TyIKDh3iFBKBohr5xeXIhNBcx8oWdgkTEEQ+BEFFYdLRuqMfd5L84N1V5Vg==",
      "dev": true,
      "dependencies": {
        "shebang-regex": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/shebang-regex": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-1.0.0.tgz",
      "integrity": "sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM= sha512-wpoSFAxys6b2a2wHZ1XpDSgD7N9iVjg29Ph9uV/uaP9Ex/KXlkTZTeddxDPSYQpgvzKLGJke2UU0AzoGCjNIvQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/shell-quote": {
      "version": "1.7.3",
      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.7.3.tgz",
      "integrity": "sha512-Vpfqwm4EnqGdlsBFNmHhxhElJYrdfcxPThu+ryKS5J8L/fhAwLazFZtq+S+TWZ9ANj2piSQLGj6NQg+lKPmxrw==",
      "dev": true
    },
    "node_modules/spdx-correct": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/spdx-correct/-/spdx-correct-3.1.1.tgz",
      "integrity": "sha512-cOYcUWwhCuHCXi49RhFRCyJEK3iPj1Ziz9DpViV3tbZOwXD49QzIN3MpOLJNxh2qwq2lJJZaKMVw9qNi4jTC0w==",
      "dev": true,
      "dependencies": {
        "spdx-expression-parse": "^3.0.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-exceptions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/spdx-exceptions/-/spdx-exceptions-2.3.0.tgz",
      "integrity": "sha512-/tTrYOC7PPI1nUAgx34hUpqXuyJG+DTHJTnIULG4rDygi4xu/tfgmq1e1cIRwRzwZgo4NLySi+ricLkZkw4i5A==",
      "dev": true
    },
    "node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-license-ids": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/spdx-license-ids/-/spdx-license-ids-3.0.7.tgz",
      "integrity": "sha512-U+MTEOO0AiDzxwFvoa4JVnMV6mZlJKk2sBLt90s7G0Gd0Mlknc7kxEn3nuDPNZRta7O2uy8oLcZLVT+4sqNZHQ==",
      "dev": true
    },
    "node_modules/string.prototype.padend": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/string.prototype.padend/-/string.prototype.padend-3.1.1.tgz",
      "integrity": "sha512-eCzTASPnoCr5Ht+Vn1YXgm8SB015hHKgEIMu9Nr9bQmLhRBxKRfmzSj/IQsxDFc8JInJDDFA0qXwK+xxI7wDkg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3",
        "es-abstract": "^1.18.0-next.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.3.tgz",
      "integrity": "sha512-ayH0pB+uf0U28CtjlLvL7NaohvR1amUvVZk+y3DYb0Ey2PUV5zPkkKy9+U1ndVEIXO8hNg18eIv9Jntbii+dKw==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.3.tgz",
      "integrity": "sha512-oBIBUy5lea5tt0ovtOFiEQaBkoBBkyJhZXzJYrSmDo5IUUqbOPvVezuRs/agBIdZ2p2Eo1FD6bD9USyBLfl3xg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM= sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/supports-color": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
      "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
      "dev": true,
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha1-gYT9NH2snNwYWZLzpmIuFLnZq2o= sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/validate-npm-package-license": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/validate-npm-package-license/-/validate-npm-package-license-3.0.4.tgz",
      "integrity": "sha512-DpKm2Ui/xN7/HQKCtpZxoRWBhZ9Z0kqtygG8XCgNQ8ZlDnxuQmWhj566j8fN4Cu3/JmbhsDo7fcAJq4s9h27Ew==",
      "dev": true,
      "dependencies": {
        "spdx-correct": "^3.0.0",
        "spdx-expression-parse": "^3.0.0"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha1-JFNCdeKnvGvnvIZhHMFq4KVlSHE= sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ=="
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha1-lmRU6HZUYuN2RNNib2dCzotwll0= sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/which": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/which/-/which-1.3.1.tgz",
      "integrity": "sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==",
      "dev": true,
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "which": "bin/which"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/package.json]---
Location: vscode-main/test/smoke/package.json

```json
{
  "name": "code-oss-dev-smoke-test",
  "version": "0.1.0",
  "license": "MIT",
  "main": "./src/main.js",
  "scripts": {
    "compile": "cd ../automation && npm run compile && cd ../smoke && node ../../node_modules/typescript/bin/tsc",
    "watch-automation": "cd ../automation && npm run watch",
    "watch-smoke": "node ../../node_modules/typescript/bin/tsc --watch --preserveWatchOutput",
    "watch": "npm-run-all -lp watch-automation watch-smoke",
    "mocha": "node ../node_modules/mocha/bin/mocha"
  },
  "dependencies": {
    "ncp": "^2.0.0",
    "node-fetch": "^2.6.7"
  },
  "devDependencies": {
    "@types/ncp": "2.0.1",
    "@types/node": "22.x",
    "@types/node-fetch": "^2.5.10",
    "npm-run-all": "^4.1.5"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/README.md]---
Location: vscode-main/test/smoke/README.md

```markdown
# VS Code Smoke Test

Make sure you are on **Node v12.x**.

## Quick Overview

```bash
# Build extensions in the VS Code repo (if needed)
npm i && npm run compile

# Dev (Electron)
npm run smoketest

# Dev (Web - Must be run on distro)
npm run smoketest -- --web --browser [chromium|webkit]

# Build (Electron)
npm run smoketest -- --build <path to latest version>
example: npm run smoketest -- --build /Applications/Visual\ Studio\ Code\ -\ Insiders.app

# Build (Web - read instructions below)
npm run smoketest -- --build <path to server web build (ends in -web)> --web --browser [chromium|webkit]

# Remote (Electron)
npm run smoketest -- --build <path to latest version> --remote
```

\* This step is necessary only when running without `--build` and OSS doesn't already exist in the `.build/electron` directory.

### Running for a release (Endgame)

You must always run the smoketest version that matches the release you are testing. So, if you want to run the smoketest for a release build (e.g. `release/1.22`), you need to check out that version of the smoke tests too:

```bash
git fetch
git checkout release/1.22
npm i && npm run compile
cd test/smoke
npm i
```

#### Web

There is no support for testing an old version to a new one yet.
Instead, simply configure the `--build` command line argument to point to the absolute path of the extracted server web build folder (e.g. `<rest of path here>/vscode-server-darwin-x64-web` for macOS). The server web build is available from the builds page (see previous subsection).

**macOS**: if you have downloaded the server with web bits, make sure to run the following command before unzipping it to avoid security issues on startup:

```bash
xattr -d com.apple.quarantine <path to server with web folder zip>
```

**Note**: make sure to point to the server that includes the client bits!

### Debug

- `--verbose` logs all the low level driver calls made to Code;
- `-f PATTERN` (alias `-g PATTERN`) filters the tests to be run. You can also use pretty much any mocha argument;
- `--headless` will run playwright in headless mode when `--web` is used.

**Note**: you can enable verbose logging of playwright library by setting a `DEBUG` environment variable before running the tests (<https://playwright.dev/docs/debug#verbose-api-logs>), for example to `pw:browser`.

### Develop

```bash
cd test/smoke
npm run watch
```

## Troubleshooting

### Error: Could not get a unique tmp filename, max tries reached

On Windows, check for the folder `C:\Users\<username>\AppData\Local\Temp\t`. If this folder exists, the `tmp` module can't run properly, resulting in the error above. In this case, delete the `t` folder.

## Pitfalls

- Beware of workbench **state**. The tests within a single suite will share the same state.

- Beware of **singletons**. This evil can, and will, manifest itself under the form of FS paths, TCP ports, IPC handles. Whenever writing a test, or setting up more smoke test architecture, make sure it can run simultaneously with any other tests and even itself. All test suites should be able to run many times in parallel.

- Beware of **focus**. **Never** depend on DOM elements having focus using `.focused` classes or `:focus` pseudo-classes, since they will lose that state as soon as another window appears on top of the running VS Code window. A safe approach which avoids this problem is to use the `waitForActiveElement` API. Many tests use this whenever they need to wait for a specific element to _have focus_.

- Beware of **timing**. You need to read from or write to the DOM... but is it the right time to do that? Can you 100% guarantee that `input` box will be visible at that point in time? Or are you just hoping that it will be so? Hope is your worst enemy in UI tests. Example: just because you triggered Quick Access with `F1`, it doesn't mean that it's open and you can just start typing; you must first wait for the input element to be in the DOM as well as be the current active element.

- Beware of **waiting**. **Never** wait longer than a couple of seconds for anything, unless it's justified. Think of it as a human using Code. Would a human take 10 minutes to run through the Search viewlet smoke test? Then, the computer should even be faster. **Don't** use `setTimeout` just because. Think about what you should wait for in the DOM to be ready and wait for that instead.
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/tsconfig.json]---
Location: vscode-main/test/smoke/tsconfig.json

```json
{
	"compilerOptions": {
		"module": "commonjs",
		"noImplicitAny": false,
		"removeComments": false,
		"preserveConstEnums": true,
		"target": "es2024",
		"strict": true,
		"noUnusedParameters": false,
		"noUnusedLocals": true,
		"outDir": "out",
		"sourceMap": true,
		"skipLibCheck": true,
		"lib": [
			"esnext", // for #201187
			"dom"
		]
	},
	"exclude": [
		"node_modules"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/main.ts]---
Location: vscode-main/test/smoke/src/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { gracefulify } from 'graceful-fs';
import * as cp from 'child_process';
import * as path from 'path';
import * as os from 'os';
import minimist from 'minimist';
import * as vscodetest from '@vscode/test-electron';
import fetch from 'node-fetch';
import { Quality, MultiLogger, Logger, ConsoleLogger, FileLogger, measureAndLog, getDevElectronPath, getBuildElectronPath, getBuildVersion, ApplicationOptions } from '../../automation';
import { retry } from './utils';

import { setup as setupDataLossTests } from './areas/workbench/data-loss.test';
import { setup as setupPreferencesTests } from './areas/preferences/preferences.test';
import { setup as setupSearchTests } from './areas/search/search.test';
import { setup as setupNotebookTests } from './areas/notebook/notebook.test';
import { setup as setupLanguagesTests } from './areas/languages/languages.test';
import { setup as setupStatusbarTests } from './areas/statusbar/statusbar.test';
import { setup as setupExtensionTests } from './areas/extensions/extensions.test';
import { setup as setupMultirootTests } from './areas/multiroot/multiroot.test';
import { setup as setupLocalizationTests } from './areas/workbench/localization.test';
import { setup as setupLaunchTests } from './areas/workbench/launch.test';
import { setup as setupTerminalTests } from './areas/terminal/terminal.test';
import { setup as setupTaskTests } from './areas/task/task.test';
import { setup as setupChatTests } from './areas/chat/chat.test';

const rootPath = path.join(__dirname, '..', '..', '..');

const [, , ...args] = process.argv;
const opts = minimist(args, {
	string: [
		'browser',
		'build',
		'stable-build',
		'wait-time',
		'test-repo',
		'electronArgs'
	],
	boolean: [
		'verbose',
		'remote',
		'web',
		'headless',
		'tracing'
	],
	default: {
		verbose: false
	}
}) as {
	verbose?: boolean;
	remote?: boolean;
	headless?: boolean;
	web?: boolean;
	tracing?: boolean;
	build?: string;
	'stable-build'?: string;
	browser?: 'chromium' | 'webkit' | 'firefox' | 'chromium-msedge' | 'chromium-chrome';
	electronArgs?: string;
};

const logsRootPath = (() => {
	const logsParentPath = path.join(rootPath, '.build', 'logs');

	let logsName: string;
	if (opts.web) {
		logsName = 'smoke-tests-browser';
	} else if (opts.remote) {
		logsName = 'smoke-tests-remote';
	} else {
		logsName = 'smoke-tests-electron';
	}

	return path.join(logsParentPath, logsName);
})();

const crashesRootPath = (() => {
	const crashesParentPath = path.join(rootPath, '.build', 'crashes');

	let crashesName: string;
	if (opts.web) {
		crashesName = 'smoke-tests-browser';
	} else if (opts.remote) {
		crashesName = 'smoke-tests-remote';
	} else {
		crashesName = 'smoke-tests-electron';
	}

	return path.join(crashesParentPath, crashesName);
})();

const logger = createLogger();

function createLogger(): Logger {
	const loggers: Logger[] = [];

	// Log to console if verbose
	if (opts.verbose) {
		loggers.push(new ConsoleLogger());
	}

	// Prepare logs rot path
	fs.rmSync(logsRootPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
	fs.mkdirSync(logsRootPath, { recursive: true });

	// Always log to log file
	loggers.push(new FileLogger(path.join(logsRootPath, 'smoke-test-runner.log')));

	return new MultiLogger(loggers);
}

try {
	gracefulify(fs);
} catch (error) {
	logger.log(`Error enabling graceful-fs: ${error}`);
}

function getTestTypeSuffix(): string {
	if (opts.web) {
		return 'browser';
	} else if (opts.remote) {
		return 'remote';
	} else {
		return 'electron';
	}
}

const testDataPath = path.join(os.tmpdir(), `vscsmoke-${getTestTypeSuffix()}`);
if (fs.existsSync(testDataPath)) {
	fs.rmSync(testDataPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
}
fs.mkdirSync(testDataPath, { recursive: true });
process.once('exit', () => {
	try {
		fs.rmSync(testDataPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
	} catch {
		// noop
	}
});

const testRepoUrl = 'https://github.com/microsoft/vscode-smoketest-express';
const workspacePath = path.join(testDataPath, `vscode-smoketest-express`);
const extensionsPath = path.join(testDataPath, 'extensions-dir');
fs.mkdirSync(extensionsPath, { recursive: true });

function fail(errorMessage): void {
	logger.log(errorMessage);
	if (!opts.verbose) {
		console.error(errorMessage);
	}
	process.exit(1);
}

let quality: Quality;
let version: string | undefined;

function parseVersion(version: string): { major: number; minor: number; patch: number } {
	const [, major, minor, patch] = /^(\d+)\.(\d+)\.(\d+)/.exec(version)!;
	return { major: parseInt(major), minor: parseInt(minor), patch: parseInt(patch) };
}

function parseQuality(): Quality {
	if (process.env.VSCODE_DEV === '1') {
		return Quality.Dev;
	}

	const quality = process.env.VSCODE_QUALITY ?? '';

	switch (quality) {
		case 'stable':
			return Quality.Stable;
		case 'insider':
			return Quality.Insiders;
		case 'exploration':
			return Quality.Exploration;
		case 'oss':
			return Quality.OSS;
		default:
			return Quality.Dev;
	}
}

//
// #### Electron Smoke Tests ####
//
if (!opts.web) {
	let testCodePath = opts.build;
	let electronPath: string | undefined;

	if (testCodePath) {
		electronPath = getBuildElectronPath(testCodePath);
		version = getBuildVersion(testCodePath);
	} else {
		testCodePath = getDevElectronPath();
		electronPath = testCodePath;
		process.env.VSCODE_REPOSITORY = rootPath;
		process.env.VSCODE_DEV = '1';
		process.env.VSCODE_CLI = '1';
	}

	if (!fs.existsSync(electronPath || '')) {
		fail(`Cannot find VSCode at ${electronPath}. Please run VSCode once first (scripts/code.sh, scripts\\code.bat) and try again.`);
	}

	quality = parseQuality();

	if (opts.remote) {
		logger.log(`Running desktop remote smoke tests against ${electronPath}`);
	} else {
		logger.log(`Running desktop smoke tests against ${electronPath}`);
	}
}

//
// #### Web Smoke Tests ####
//
else {
	const testCodeServerPath = opts.build || process.env.VSCODE_REMOTE_SERVER_PATH;

	if (typeof testCodeServerPath === 'string') {
		if (!fs.existsSync(testCodeServerPath)) {
			fail(`Cannot find Code server at ${testCodeServerPath}.`);
		} else {
			logger.log(`Running web smoke tests against ${testCodeServerPath}`);
		}
	}

	if (!testCodeServerPath) {
		process.env.VSCODE_REPOSITORY = rootPath;
		process.env.VSCODE_DEV = '1';
		process.env.VSCODE_CLI = '1';

		logger.log(`Running web smoke out of sources`);
	}

	quality = parseQuality();
}

logger.log(`VS Code product quality: ${quality}.`);

const userDataDir = path.join(testDataPath, 'd');

async function setupRepository(): Promise<void> {
	if (opts['test-repo']) {
		logger.log('Copying test project repository:', opts['test-repo']);
		fs.rmSync(workspacePath, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
		// not platform friendly
		if (process.platform === 'win32') {
			cp.execSync(`xcopy /E "${opts['test-repo']}" "${workspacePath}"\\*`);
		} else {
			cp.execSync(`cp -R "${opts['test-repo']}" "${workspacePath}"`);
		}
	} else {
		if (!fs.existsSync(workspacePath)) {
			logger.log('Cloning test project repository...');
			const res = cp.spawnSync('git', ['clone', testRepoUrl, workspacePath], { stdio: 'inherit' });
			if (!fs.existsSync(workspacePath)) {
				throw new Error(`Clone operation failed: ${res.stderr.toString()}`);
			}
		} else {
			logger.log('Cleaning test project repository...');
			cp.spawnSync('git', ['fetch'], { cwd: workspacePath, stdio: 'inherit' });
			cp.spawnSync('git', ['reset', '--hard', 'FETCH_HEAD'], { cwd: workspacePath, stdio: 'inherit' });
			cp.spawnSync('git', ['clean', '-xdf'], { cwd: workspacePath, stdio: 'inherit' });
		}
	}
}

async function ensureStableCode(): Promise<void> {
	let stableCodePath = opts['stable-build'];
	if (!stableCodePath) {
		const current = parseVersion(version!);
		const versionsReq = await retry(() => measureAndLog(() => fetch('https://update.code.visualstudio.com/api/releases/stable'), 'versionReq', logger), 1000, 20);

		if (!versionsReq.ok) {
			throw new Error('Could not fetch releases from update server');
		}

		const versions: string[] = await measureAndLog(() => versionsReq.json(), 'versionReq.json()', logger);
		const stableVersion = versions.find(raw => {
			const version = parseVersion(raw);
			return version.major < current.major || (version.major === current.major && version.minor < current.minor);
		});

		if (!stableVersion) {
			throw new Error(`Could not find suitable stable version for ${version}`);
		}

		logger.log(`Found VS Code v${version}, downloading previous VS Code version ${stableVersion}...`);

		let lastProgressMessage: string | undefined = undefined;
		let lastProgressReportedAt = 0;
		const stableCodeDestination = path.join(testDataPath, 's');
		const stableCodeExecutable = await retry(() => measureAndLog(() => vscodetest.download({
			cachePath: stableCodeDestination,
			version: stableVersion,
			extractSync: true,
			reporter: {
				report: report => {
					let progressMessage = `download stable code progress: ${report.stage}`;
					const now = Date.now();
					if (progressMessage !== lastProgressMessage || now - lastProgressReportedAt > 10000) {
						lastProgressMessage = progressMessage;
						lastProgressReportedAt = now;

						if (report.stage === 'downloading') {
							progressMessage += ` (${report.bytesSoFar}/${report.totalBytes})`;
						}

						logger.log(progressMessage);
					}
				},
				error: error => logger.log(`download stable code error: ${error}`)
			}
		}), 'download stable code', logger), 1000, 3, async () => {
			fs.rmSync(stableCodeDestination, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
		});

		if (process.platform === 'darwin') {
			// Visual Studio Code.app/Contents/MacOS/Electron
			stableCodePath = path.dirname(path.dirname(path.dirname(stableCodeExecutable)));
		} else {
			// VSCode/Code.exe (Windows) | VSCode/code (Linux)
			stableCodePath = path.dirname(stableCodeExecutable);
		}

		opts['stable-version'] = parseVersion(stableVersion);
	}

	if (!fs.existsSync(stableCodePath)) {
		throw new Error(`Cannot find Stable VSCode at ${stableCodePath}.`);
	}

	logger.log(`Using stable build ${stableCodePath} for migration tests`);

	opts['stable-build'] = stableCodePath;
}

async function setup(): Promise<void> {
	logger.log('Test data path:', testDataPath);
	logger.log('Preparing smoketest setup...');

	if (!opts.web && !opts.remote && opts.build) {
		// only enabled when running with --build and not in web or remote
		await measureAndLog(() => ensureStableCode(), 'ensureStableCode', logger);
	}
	await measureAndLog(() => setupRepository(), 'setupRepository', logger);

	logger.log('Smoketest setup done!\n');
}

// Before all tests run setup
before(async function () {
	this.timeout(5 * 60 * 1000); // increase since we download VSCode

	const options: ApplicationOptions = {
		quality,
		version: parseVersion(version ?? '0.0.0'),
		codePath: opts.build,
		workspacePath,
		userDataDir,
		useInMemorySecretStorage: true,
		extensionsPath,
		logger,
		logsPath: path.join(logsRootPath, 'suite_unknown'),
		crashesPath: path.join(crashesRootPath, 'suite_unknown'),
		verbose: opts.verbose,
		remote: opts.remote,
		web: opts.web,
		tracing: opts.tracing || !!process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || !!process.env.GITHUB_WORKSPACE,
		headless: opts.headless,
		browser: opts.browser,
		extraArgs: (opts.electronArgs || '').split(' ').map(arg => arg.trim()).filter(arg => !!arg)
	};
	this.defaultOptions = options;

	await setup();
});

// After main suite (after all tests)
after(async function () {
	try {
		await measureAndLog(async () => {
			fs.rmSync(testDataPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 });
		}, 'rimraf(testDataPath)', logger);
	} catch (error) {
		logger.log(`Unable to delete smoke test workspace: ${error}. This indicates some process is locking the workspace folder.`);
	}
});

describe(`VSCode Smoke Tests (${opts.web ? 'Web' : 'Electron'})`, () => {
	if (!opts.web) { setupDataLossTests(() => { return { stableCodePath: opts['stable-build'], stableCodeVersion: opts['stable-version'] } /* Do not change, deferred for a reason! */; }, logger); }
	setupPreferencesTests(logger);
	setupSearchTests(logger);
	if (!opts.web) { setupNotebookTests(logger); }
	setupLanguagesTests(logger);
	setupTerminalTests(logger);
	setupTaskTests(logger);
	setupStatusbarTests(logger);
	if (quality !== Quality.Dev && quality !== Quality.OSS) { setupExtensionTests(logger); }
	setupMultirootTests(logger);
	if (!opts.web && !opts.remote && quality !== Quality.Dev && quality !== Quality.OSS) { setupLocalizationTests(logger); }
	if (!opts.web && !opts.remote) { setupLaunchTests(logger); }
	if (!opts.web) { setupChatTests(logger); }
});
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/utils.ts]---
Location: vscode-main/test/smoke/src/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Suite, Context } from 'mocha';
import { dirname, join } from 'path';
import { Application, ApplicationOptions, Logger } from '../../automation';

export function describeRepeat(n: number, description: string, callback: (this: Suite) => void): void {
	for (let i = 0; i < n; i++) {
		describe(`${description} (iteration ${i})`, callback);
	}
}

export function itRepeat(n: number, description: string, callback: (this: Context) => any): void {
	for (let i = 0; i < n; i++) {
		it(`${description} (iteration ${i})`, callback);
	}
}

export function installAllHandlers(logger: Logger, optionsTransform?: (opts: ApplicationOptions) => ApplicationOptions) {
	installDiagnosticsHandler(logger);
	installAppBeforeHandler(optionsTransform);
	installAppAfterHandler();
}

export function installDiagnosticsHandler(logger: Logger, appFn?: () => Application | undefined) {

	// Before each suite
	before(async function () {
		const suiteTitle = this.currentTest?.parent?.title;
		logger.log('');
		logger.log(`>>> Suite start: '${suiteTitle ?? 'unknown'}' <<<`);
		logger.log('');
	});

	// Before each test
	beforeEach(async function () {
		const testTitle = this.currentTest?.title;
		logger.log('');
		logger.log(`>>> Test start: '${testTitle ?? 'unknown'}' <<<`);
		logger.log('');

		const app: Application = appFn?.() ?? this.app;
		await app?.startTracing(testTitle ?? 'unknown');
	});

	// After each test
	afterEach(async function () {
		const currentTest = this.currentTest;
		if (!currentTest) {
			return;
		}

		const failed = currentTest.state === 'failed';
		const testTitle = currentTest.title;
		logger.log('');
		if (failed) {
			logger.log(`>>> !!! FAILURE !!! Test end: '${testTitle}' !!! FAILURE !!! <<<`);
		} else {
			logger.log(`>>> Test end: '${testTitle}' <<<`);
		}
		logger.log('');

		const app: Application = appFn?.() ?? this.app;
		await app?.stopTracing(testTitle.replace(/[^a-z0-9\-]/ig, '_'), failed);
	});
}

let logsCounter = 1;
let crashCounter = 1;

export function suiteLogsPath(options: ApplicationOptions, suiteName: string): string {
	return join(dirname(options.logsPath), `${logsCounter++}_suite_${suiteName.replace(/[^a-z0-9\-]/ig, '_')}`);
}

export function suiteCrashPath(options: ApplicationOptions, suiteName: string): string {
	return join(dirname(options.crashesPath), `${crashCounter++}_suite_${suiteName.replace(/[^a-z0-9\-]/ig, '_')}`);
}

function installAppBeforeHandler(optionsTransform?: (opts: ApplicationOptions) => ApplicationOptions) {
	before(async function () {
		const suiteName = this.test?.parent?.title ?? 'unknown';

		this.app = createApp({
			...this.defaultOptions,
			logsPath: suiteLogsPath(this.defaultOptions, suiteName),
			crashesPath: suiteCrashPath(this.defaultOptions, suiteName)
		}, optionsTransform);
		await this.app.start();
	});
}

export function installAppAfterHandler(appFn?: () => Application | undefined, joinFn?: () => Promise<unknown>) {
	after(async function () {
		const app: Application = appFn?.() ?? this.app;
		if (app) {
			await app.stop();
		}

		if (joinFn) {
			await joinFn();
		}
	});
}

export function createApp(options: ApplicationOptions, optionsTransform?: (opts: ApplicationOptions) => ApplicationOptions): Application {
	if (optionsTransform) {
		options = optionsTransform({ ...options });
	}

	const config = options.userDataDir
		? { ...options, userDataDir: getRandomUserDataDir(options.userDataDir) }
		: options;
	const app = new Application(config);

	return app;
}

export function getRandomUserDataDir(baseUserDataDir: string): string {

	// Pick a random user data dir suffix that is not
	// too long to not run into max path length issues
	// https://github.com/microsoft/vscode/issues/34988
	const userDataPathSuffix = [...Array(8)].map(() => Math.random().toString(36)[3]).join('');

	return baseUserDataDir.concat(`-${userDataPathSuffix}`);
}

export function timeout(i: number) {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, i);
	});
}

export async function retryWithRestart(app: Application, testFn: () => Promise<unknown>, retries = 3, timeoutMs = 20000): Promise<unknown> {
	let lastError: Error | undefined = undefined;
	for (let i = 0; i < retries; i++) {
		const result = await Promise.race([
			testFn().then(() => true, error => {
				lastError = error;
				return false;
			}),
			timeout(timeoutMs).then(() => false)
		]);

		if (result) {
			return;
		}

		await app.restart();
	}

	throw lastError ?? new Error('retryWithRestart failed with an unknown error');
}

export interface ITask<T> {
	(): T;
}

export async function retry<T>(task: ITask<Promise<T>>, delay: number, retries: number, onBeforeRetry?: () => Promise<unknown>): Promise<T> {
	let lastError: Error | undefined;

	for (let i = 0; i < retries; i++) {
		try {
			if (i > 0 && typeof onBeforeRetry === 'function') {
				try {
					await onBeforeRetry();
				} catch (error) {
					console.warn(`onBeforeRetry failed with: ${error}`);
				}
			}

			return await task();
		} catch (error) {
			lastError = error as Error;

			await timeout(delay);
		}
	}

	throw lastError;
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/chat/chat.test.ts]---
Location: vscode-main/test/smoke/src/areas/chat/chat.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Chat', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('can disable AI features', async function () {
			const app = this.app as Application;

			await app.workbench.settingsEditor.addUserSetting('chat.disableAIFeatures', 'true');

			// await for setting to apply in the UI
			await app.code.waitForElements('.noauxiliarybar', true, elements => elements.length === 1);

			// assert that AI related commands are not present
			let expectedFound = false;
			const unexpectedFound: Set<string> = new Set();
			for (const term of ['chat', 'agent', 'copilot', 'mcp']) {
				const commands = await app.workbench.quickaccess.getVisibleCommandNames(term);
				for (const command of commands) {
					if (command === 'Chat: Use AI Features with Copilot for free...') {
						expectedFound = true;
						continue;
					}

					if (command.includes('Chat') || command.includes('Agent') || command.includes('Copilot') || command.includes('MCP')) {
						unexpectedFound.add(command);
					}
				}
			}

			if (!expectedFound) {
				throw new Error(`Expected AI related command not found`);
			}

			if (unexpectedFound.size > 0) {
				throw new Error(`Unexpected AI related commands found after having disabled AI features: ${JSON.stringify(Array.from(unexpectedFound), undefined, 0)}`);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/extensions/extensions.test.ts]---
Location: vscode-main/test/smoke/src/areas/extensions/extensions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Extensions', () => {

		// Shared before/after handling
		installAllHandlers(logger, opts => {
			opts.verbose = true; // enable verbose logging for tracing
			opts.snapshots = true; // enable network tab in devtools for tracing since we install an extension
			return opts;
		});

		it('install and enable vscode-smoketest-check extension', async function () {
			const app = this.app as Application;

			await app.workbench.extensions.installExtension('ms-vscode.vscode-smoketest-check', true);

			// Close extension editor because keybindings dispatch is not working when web views are opened and focused
			// https://github.com/microsoft/vscode/issues/110276
			await app.workbench.extensions.closeExtension('vscode-smoketest-check');

			await app.workbench.quickaccess.runCommand('Smoke Test Check');
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/languages/languages.test.ts]---
Location: vscode-main/test/smoke/src/areas/languages/languages.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import { Application, ProblemSeverity, Problems, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Language Features', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('verifies quick outline (js)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'bin', 'www'));

			await app.workbench.quickaccess.openQuickOutline();
			await app.workbench.quickinput.waitForQuickInputElements(names => names.length >= 6);
			await app.workbench.quickinput.closeQuickInput();
		});

		it('verifies quick outline (css)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));

			await app.workbench.quickaccess.openQuickOutline();
			await app.workbench.quickinput.waitForQuickInputElements(names => names.length === 2);
			await app.workbench.quickinput.closeQuickInput();
		});

		it('verifies problems view (css)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));
			await app.workbench.editor.waitForTypeInEditor('style.css', '.foo{}');

			await app.code.waitForElement(Problems.getSelectorInEditor(ProblemSeverity.WARNING));

			await app.workbench.problems.showProblemsView();
			await app.code.waitForElement(Problems.getSelectorInProblemsView(ProblemSeverity.WARNING));
			await app.workbench.problems.hideProblemsView();
		});

		it('verifies settings (css)', async function () {
			const app = this.app as Application;
			await app.workbench.settingsEditor.addUserSetting('css.lint.emptyRules', '"error"');
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));

			await app.code.waitForElement(Problems.getSelectorInEditor(ProblemSeverity.ERROR));

			await app.workbench.problems.showProblemsView();
			await app.code.waitForElement(Problems.getSelectorInProblemsView(ProblemSeverity.ERROR));
			await app.workbench.problems.hideProblemsView();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/multiroot/multiroot.test.ts]---
Location: vscode-main/test/smoke/src/areas/multiroot/multiroot.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { Application, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

function toUri(path: string): string {
	if (process.platform === 'win32') {
		return `${path.replace(/\\/g, '/')}`;
	}

	return `${path}`;
}

function createWorkspaceFile(workspacePath: string): string {
	const workspaceFilePath = join(dirname(workspacePath), 'smoketest.code-workspace');
	const workspace = {
		folders: [
			{ path: toUri(join(workspacePath, 'public')) },
			{ path: toUri(join(workspacePath, 'routes')) },
			{ path: toUri(join(workspacePath, 'views')) }
		],
		settings: {
			'workbench.startupEditor': 'none',
			'workbench.enableExperiments': false,
			'typescript.disableAutomaticTypeAcquisition': true,
			'json.schemaDownload.enable': false,
			'npm.fetchOnlinePackageInfo': false,
			'npm.autoDetect': 'off',
			'workbench.editor.languageDetection': false,
			'workbench.localHistory.enabled': false
		}
	};

	writeFileSync(workspaceFilePath, JSON.stringify(workspace, null, '\t'));

	return workspaceFilePath;
}

export function setup(logger: Logger) {
	describe('Multiroot', () => {

		// Shared before/after handling
		installAllHandlers(logger, opts => {
			const workspacePath = createWorkspaceFile(opts.workspacePath);
			return { ...opts, workspacePath };
		});

		it('shows results from all folders', async function () {
			const app = this.app as Application;
			const expectedNames = [
				'index.js',
				'users.js',
				'style.css',
				'error.pug',
				'index.pug',
				'layout.pug'
			];

			await app.workbench.quickaccess.openFileQuickAccessAndWait('*.*', 6);
			await app.workbench.quickinput.waitForQuickInputElements(names => expectedNames.every(expectedName => names.some(name => expectedName === name)));
			await app.workbench.quickinput.closeQuickInput();
		});

		it('shows workspace name in title', async function () {
			const app = this.app as Application;

			await app.code.waitForTitle(title => /smoketest \(Workspace\)/i.test(title));
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/notebook/notebook.test.ts]---
Location: vscode-main/test/smoke/src/areas/notebook/notebook.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { Application, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Notebooks', () => { // https://github.com/microsoft/vscode/issues/140575

		// Shared before/after handling
		installAllHandlers(logger);

		afterEach(async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.runCommand('workbench.action.files.save');
			await app.workbench.quickaccess.runCommand('workbench.action.closeActiveEditor');
		});

		after(async function () {
			const app = this.app as Application;
			cp.execSync('git checkout . --quiet', { cwd: app.workspacePathOrFolder });
			cp.execSync('git reset --hard HEAD --quiet', { cwd: app.workspacePathOrFolder });
		});

		// the heap snapshot fails to parse
		it.skip('check heap leaks', async function () {
			const app = this.app as Application;
			await app.profiler.checkHeapLeaks(['NotebookTextModel', 'NotebookCellTextModel', 'NotebookEventDispatcher'], async () => {
				await app.workbench.notebook.openNotebook();
				await app.workbench.quickaccess.runCommand('workbench.action.files.save');
				await app.workbench.quickaccess.runCommand('workbench.action.closeActiveEditor');
			});
		});

		it.skip('check object leaks', async function () {
			const app = this.app as Application;
			await app.profiler.checkObjectLeaks(['NotebookTextModel', 'NotebookCellTextModel', 'NotebookEventDispatcher'], async () => {
				await app.workbench.notebook.openNotebook();
				await app.workbench.quickaccess.runCommand('workbench.action.files.save');
				await app.workbench.quickaccess.runCommand('workbench.action.closeActiveEditor');
			});
		});

		it.skip('inserts/edits code cell', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.focusNextCell();
			await app.workbench.notebook.insertNotebookCell('code');
			await app.workbench.notebook.waitForTypeInEditor('// some code');
			await app.workbench.notebook.stopEditingCell();
		});

		it.skip('inserts/edits markdown cell', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.focusNextCell();
			await app.workbench.notebook.insertNotebookCell('markdown');
			await app.workbench.notebook.waitForTypeInEditor('## hello2! ');
			await app.workbench.notebook.stopEditingCell();
			// TODO: markdown row selectors haven't been updated to look in the webview
			await app.workbench.notebook.waitForMarkdownContents('', '');
		});

		it.skip('moves focus as it inserts/deletes a cell', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.focusFirstCell();
			await app.workbench.notebook.insertNotebookCell('code');
			await app.workbench.notebook.waitForActiveCellEditorContents('');
			await app.workbench.notebook.waitForTypeInEditor('# added cell');
			await app.workbench.notebook.focusFirstCell();
			await app.workbench.notebook.insertNotebookCell('code');
			await app.workbench.notebook.waitForActiveCellEditorContents('');
			await app.workbench.notebook.deleteActiveCell();
			await app.workbench.notebook.waitForActiveCellEditorContents('# added cell');
		});

		it.skip('moves focus in and out of output', async function () { // TODO@rebornix https://github.com/microsoft/vscode/issues/139270
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			// first cell is a code cell that already has output
			await app.workbench.notebook.focusInCellOutput();
			await app.workbench.notebook.editCell();
			await app.workbench.notebook.waitForActiveCellEditorContents('print(1)');
		});

		// broken: there is no kernel available to execute code
		it.skip('cell action execution', async function () { // TODO@rebornix https://github.com/microsoft/vscode/issues/139270
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.insertNotebookCell('code');
			await app.workbench.notebook.executeCellAction('.notebook-editor .monaco-list-row.focused div.monaco-toolbar .codicon-debug');
			await app.workbench.notebook.waitForActiveCellEditorContents('test');
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/preferences/preferences.test.ts]---
Location: vscode-main/test/smoke/src/areas/preferences/preferences.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, ActivityBarPosition, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Preferences', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('turns off editor line numbers and verifies the live change', async function () {
			const app = this.app as Application;

			await app.workbench.settingsEditor.openUserSettingsFile();
			await app.code.waitForElements('.line-numbers', false, elements => !!elements.length);

			await app.workbench.settingsEditor.addUserSetting('editor.lineNumbers', '"off"');
			await app.code.waitForElements('.line-numbers', false, elements => !elements || elements.length === 0);
		});

		it.skip('changes "workbench.action.toggleSidebarPosition" command key binding and verifies it', async function () {
			const app = this.app as Application;

			await app.workbench.activitybar.waitForActivityBar(ActivityBarPosition.LEFT);

			await app.workbench.keybindingsEditor.updateKeybinding('workbench.action.toggleSidebarPosition', 'View: Toggle Primary Side Bar Position', 'ctrl+u', 'Control+U');

			await app.code.dispatchKeybinding('ctrl+u', () => app.workbench.activitybar.waitForActivityBar(ActivityBarPosition.RIGHT));
		});
	});

	describe('Settings editor', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('shows a modified indicator on a modified setting', async function () {
			const app = this.app as Application;

			await app.workbench.settingsEditor.searchSettingsUI('@id:editor.tabSize');
			await app.code.waitForSetValue('.settings-editor .setting-item-contents .setting-item-control input', '6');
			await app.code.waitForElement('.settings-editor .setting-item-contents .setting-item-modified-indicator');
			await app.code.waitForSetValue('.settings-editor .setting-item-contents .setting-item-control input', '4');
		});

		// Skipping test due to it being flaky.
		it.skip('turns off editor line numbers and verifies the live change', async function () {
			const app = this.app as Application;

			await app.workbench.editors.newUntitledFile();
			await app.code.dispatchKeybinding('enter', async () => {
				await app.code.waitForElements('.line-numbers', false, elements => !!elements.length);
			});

			// Turn off line numbers
			await app.workbench.settingsEditor.searchSettingsUI('editor.lineNumbers');
			await app.code.waitAndClick('.settings-editor .monaco-list-rows .setting-item-control select', 2, 2);
			await app.code.waitAndClick('.context-view .option-text', 2, 2);

			await app.workbench.editors.selectTab('Untitled-1');
			await app.code.waitForElements('.line-numbers', false, elements => !elements || elements.length === 0);
		});

		// Skipping test due to it being flaky.
		it.skip('hides the toc when searching depending on the search behavior', async function () {
			const app = this.app as Application;

			// Hide ToC when searching
			await app.workbench.settingsEditor.searchSettingsUI('workbench.settings.settingsSearchTocBehavior');
			await app.code.waitAndClick('.settings-editor .monaco-list-rows .setting-item-control select', 2, 2);
			await app.code.waitAndClick('.context-view .monaco-list-row:nth-child(1) .option-text', 2, 2);
			await app.workbench.settingsEditor.searchSettingsUI('test');
			await app.code.waitForElements('.settings-editor .settings-toc-container', false, elements => elements.length === 1 && elements[0].attributes['style'].includes('width: 0px'));
			await app.code.waitForElements('.settings-editor .settings-body .monaco-sash', false, elements => elements.length === 1 && elements[0].className.includes('disabled'));

			// Show ToC when searching
			await app.workbench.settingsEditor.searchSettingsUI('workbench.settings.settingsSearchTocBehavior');
			await app.code.waitAndClick('.settings-editor .monaco-list-rows .setting-item-control select', 2, 2);
			await app.code.waitAndClick('.context-view .monaco-list-row:nth-child(2) .option-text', 2, 2);
			await app.workbench.settingsEditor.searchSettingsUI('test');
			await app.code.waitForElements('.settings-editor .settings-toc-container', false, elements => elements.length === 1 && !elements[0].attributes['style'].includes('width: 0px'));
			await app.code.waitForElements('.settings-editor .settings-body .monaco-sash', false, elements => elements.length === 1 && !elements[0].className.includes('disabled'));
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/search/search.test.ts]---
Location: vscode-main/test/smoke/src/areas/search/search.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { Application, Logger } from '../../../../automation';
import { installAllHandlers, retry } from '../../utils';

export function setup(logger: Logger) {
	describe('Search', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		after(function () {
			const app = this.app as Application;
			retry(async () => cp.execSync('git checkout . --quiet', { cwd: app.workspacePathOrFolder }), 0, 5);
			retry(async () => cp.execSync('git reset --hard HEAD --quiet', { cwd: app.workspacePathOrFolder }), 0, 5);
		});

		it('verifies the sidebar moves to the right', async function () {
			const app = this.app as Application;
			await app.workbench.search.openSearchViewlet();

			await app.code.dispatchKeybinding('PageUp', async () => {
				await app.workbench.search.hasActivityBarMoved();
			});

			await app.code.dispatchKeybinding('PageUp', async () => {
				await app.workbench.search.hasActivityBarMoved();
			});
		});

		it('searches for body & checks for correct result number', async function () {
			const app = this.app as Application;
			await app.workbench.search.openSearchViewlet();
			await app.workbench.search.searchFor('body');

			await app.workbench.search.waitForResultText('6 results in 3 files');
		});

		it('searches only for *.js files & checks for correct result number', async function () {
			const app = this.app as Application;
			try {
				await app.workbench.search.setFilesToIncludeText('*.js');
				await app.workbench.search.searchFor('body');
				await app.workbench.search.showQueryDetails();

				await app.workbench.search.waitForResultText('4 results in 1 file');
			} finally {
				await app.workbench.search.setFilesToIncludeText('');
				await app.workbench.search.hideQueryDetails();
			}
		});

		it('dismisses result & checks for correct result number', async function () {
			const app = this.app as Application;
			await app.workbench.search.searchFor('body');
			await app.workbench.search.waitForResultText('6 results in 3 files');
			await app.workbench.search.removeFileMatch('app.js', '2 results in 2 files');
		});

		it.skip('replaces first search result with a replace term', async function () { // TODO@roblourens https://github.com/microsoft/vscode/issues/137195
			const app = this.app as Application;

			await app.workbench.search.searchFor('body');
			await app.workbench.search.waitForResultText('6 results in 3 files');
			await app.workbench.search.expandReplace();
			await app.workbench.search.setReplaceText('ydob');
			await app.workbench.search.replaceFileMatch('app.js', '2 results in 2 files');

			await app.workbench.search.searchFor('ydob');
			await app.workbench.search.waitForResultText('4 results in 1 file');
			await app.workbench.search.setReplaceText('body');
			await app.workbench.search.replaceFileMatch('app.js', '0 results in 0 files');
			await app.workbench.search.waitForResultText('0 results in 0 files');
		});
	});

	describe('Quick Open', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('quick open search produces correct result', async function () {
			const app = this.app as Application;
			const expectedNames = [
				'.eslintrc.json',
				'tasks.json',
				'settings.json',
				'app.js',
				'index.js',
				'users.js',
				'package.json',
				'jsconfig.json'
			];

			await app.workbench.quickaccess.openFileQuickAccessAndWait('.js', 8);
			await app.workbench.quickinput.waitForQuickInputElements(names => expectedNames.every(expectedName => names.some(name => expectedName === name)));
			await app.workbench.quickinput.closeQuickInput();
		});

		it('quick open respects fuzzy matching', async function () {
			const app = this.app as Application;
			const expectedNames = [
				'tasks.json',
				'app.js',
				'package.json'
			];

			await app.workbench.quickaccess.openFileQuickAccessAndWait('a.s', 3);
			await app.workbench.quickinput.waitForQuickInputElements(names => expectedNames.every(expectedName => names.some(name => expectedName === name)));
			await app.workbench.quickinput.closeQuickInput();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/statusbar/statusbar.test.ts]---
Location: vscode-main/test/smoke/src/areas/statusbar/statusbar.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import { Application, StatusBarElement, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Statusbar', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		it('verifies presence of all default status bar elements', async function () {
			const app = this.app as Application;
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.BRANCH_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.SYNC_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.PROBLEMS_STATUS);

			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'readme.md'));
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.ENCODING_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.EOL_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.INDENTATION_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.LANGUAGE_STATUS);
			await app.workbench.statusbar.waitForStatusbarElement(StatusBarElement.SELECTION_STATUS);
		});

		it(`verifies that 'quick input' opens when clicking on status bar elements`, async function () {
			const app = this.app as Application;
			await app.workbench.statusbar.clickOn(StatusBarElement.BRANCH_STATUS);
			await app.workbench.quickinput.waitForQuickInputOpened();
			await app.workbench.quickinput.closeQuickInput();

			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'readme.md'));
			await app.workbench.statusbar.clickOn(StatusBarElement.INDENTATION_STATUS);
			await app.workbench.quickinput.waitForQuickInputOpened();
			await app.workbench.quickinput.closeQuickInput();
			await app.workbench.statusbar.clickOn(StatusBarElement.ENCODING_STATUS);
			await app.workbench.quickinput.waitForQuickInputOpened();
			await app.workbench.quickinput.closeQuickInput();
			await app.workbench.statusbar.clickOn(StatusBarElement.EOL_STATUS);
			await app.workbench.quickinput.waitForQuickInputOpened();
			await app.workbench.quickinput.closeQuickInput();
			await app.workbench.statusbar.clickOn(StatusBarElement.LANGUAGE_STATUS);
			await app.workbench.quickinput.waitForQuickInputOpened();
			await app.workbench.quickinput.closeQuickInput();
		});

		it(`verifies that 'Problems View' appears when clicking on 'Problems' status element`, async function () {
			const app = this.app as Application;
			await app.workbench.statusbar.clickOn(StatusBarElement.PROBLEMS_STATUS);
			await app.workbench.problems.waitForProblemsView();
		});

		it(`verifies if changing EOL is reflected in the status bar`, async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'readme.md'));
			await app.workbench.statusbar.clickOn(StatusBarElement.EOL_STATUS);

			await app.workbench.quickinput.selectQuickInputElement(1);

			await app.workbench.statusbar.waitForEOL('CRLF');
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/task/task-quick-pick.test.ts]---
Location: vscode-main/test/smoke/src/areas/task/task-quick-pick.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Task, Terminal, TerminalCommandId } from '../../../../automation/';

export function setup(options?: { skipSuite: boolean }) {
	describe('Task Quick Pick', () => {
		let app: Application;
		let task: Task;
		let terminal: Terminal;

		// Acquire automation API
		before(async function () {
			app = this.app as Application;
			task = app.workbench.task;
			terminal = app.workbench.terminal;
		});

		afterEach(async () => {
			// Kill all terminals between every test for a consistent testing environment
			await terminal.runCommand(TerminalCommandId.KillAll);
		});

		describe('Tasks: Run Task', () => {
			const label = 'name';
			const type = 'shell';
			const command = `echo 'test'`;
			it('hide property - true', async () => {
				await task.configureTask({ type, command, label, hide: true });
				await task.assertTasks(label, [], 'run');
			});
			it('hide property - false', async () => {
				await task.configureTask({ type, command, label, hide: false });
				await task.assertTasks(label, [{ label, hide: false }], 'run');
			});
			it('hide property - undefined', async () => {
				await task.configureTask({ type, command, label });
				await task.assertTasks(label, [{ label }], 'run');
			});
			(options?.skipSuite ? it.skip : it.skip)('icon - icon only', async () => {
				const config = { label, type, command, icon: { id: 'lightbulb' } };
				await task.configureTask(config);
				await task.assertTasks(label, [config], 'run');
			});
			(options?.skipSuite ? it.skip : it.skip)('icon - color only', async () => {
				const config = { label, type, command, icon: { color: 'terminal.ansiRed' } };
				await task.configureTask(config);
				await task.assertTasks(label, [{ label, type, command, icon: { color: 'Red' } }], 'run');
			});
			(options?.skipSuite ? it.skip : it.skip)('icon - icon & color', async () => {
				const config = { label, type, command, icon: { id: 'lightbulb', color: 'terminal.ansiRed' } };
				await task.configureTask(config);
				await task.assertTasks(label, [{ label, type, command, icon: { id: 'lightbulb', color: 'Red' } }], 'run');
			});
		});
		//TODO: why won't this command run
		describe.skip('Tasks: Configure Task', () => {
			const label = 'name';
			const type = 'shell';
			const command = `echo 'test'`;
			describe('hide', () => {
				it('true should still show the task', async () => {
					await task.configureTask({ type, command, label, hide: true });
					await task.assertTasks(label, [{ label }], 'configure');
				});
			});
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/task/task.test.ts]---
Location: vscode-main/test/smoke/src/areas/task/task.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';
import { setup as setupTaskQuickPickTests } from './task-quick-pick.test';

export function setup(logger: Logger) {
	describe('Task', function () {

		// Retry tests 3 times to minimize build failures due to any flakiness
		this.retries(3);

		// Shared before/after handling
		installAllHandlers(logger);

		// Refs https://github.com/microsoft/vscode/issues/225250
		// Pty spawning fails with invalid fd error in product CI while development CI
		// works fine, we need additional logging to investigate.
		setupTaskQuickPickTests({ skipSuite: process.platform === 'linux' });
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-editors.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-editors.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, TerminalCommandId, TerminalCommandIdWithValue, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Editors', () => {
		let app: Application;
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;

		// Acquire automation API
		before(async function () {
			app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		it('should update color of the tab', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			const color = 'Cyan';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.ChangeColor, color);
			await terminal.assertSingleTab({ color }, true);
		});

		it('should rename the tab', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertSingleTab({ name }, true);
		});

		it('should show the panel when the terminal is moved there and close the editor', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.runCommand(TerminalCommandId.MoveToPanel);
			await terminal.assertSingleTab({});
		});

		it('should open a terminal in a new group for open to the side', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.runCommand(TerminalCommandId.SplitEditor);
			await terminal.assertEditorGroupCount(2);
		});

		it('should open a terminal in a new group when the split button is pressed', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.clickSplitButton();
			await terminal.assertEditorGroupCount(2);
		});

		it('should create new terminals in the active editor group via command', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.assertEditorGroupCount(1);
		});

		it('should create new terminals in the active editor group via plus button', async () => {
			await terminal.runCommand(TerminalCommandId.CreateNewEditor);
			await terminal.clickPlusButton();
			await terminal.assertEditorGroupCount(1);
		});

		it('should create a terminal in the editor area by default', async () => {
			await app.workbench.settingsEditor.addUserSetting('terminal.integrated.defaultLocation', '"editor"');
			// Close the settings editor
			await app.workbench.quickaccess.runCommand('workbench.action.closeAllEditors');
			await terminal.createTerminal('editor');
			await terminal.assertEditorGroupCount(1);
			await terminal.assertTerminalViewHidden();
			await app.workbench.settingsEditor.clearUserSettings();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-helpers.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-helpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application } from '../../../../automation';

export async function setTerminalTestSettings(app: Application, additionalSettings: [key: string, value: string][] = []) {
	await app.workbench.settingsEditor.addUserSettings([
		// Work wrap is required when calling settingsEditor.addUserSetting multiple times or the
		// click to focus will fail
		['editor.wordWrap', '"on"'],
		// Always show tabs to make getting terminal groups easier
		['terminal.integrated.tabs.hideCondition', '"never"'],
		// Use the DOM renderer for smoke tests so they can be inspected in the playwright trace
		// viewer
		['terminal.integrated.gpuAcceleration', '"off"'],
		...additionalSettings
	]);

	// Close the settings editor
	await app.workbench.quickaccess.runCommand('workbench.action.closeAllEditors');
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-input.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-input.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Input', () => {
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;

		// Acquire automation API
		before(async function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		describe('Auto replies', function () {

			// HACK: Retry this suite only on Windows because conpty can rarely lead to unexpected behavior which would
			// cause flakiness. If this does happen, the feature is expected to fail.
			if (process.platform === 'win32') {
				this.retries(3);
			}

			async function writeTextForAutoReply(text: string): Promise<void> {
				// Put the matching word in quotes to avoid powershell coloring the first word and
				// on a new line to avoid cursor move/line switching sequences
				await terminal.runCommandInTerminal(`"\r${text}`, true);
			}

			it('should automatically reply to a custom entry', async () => {
				await settingsEditor.addUserSetting('terminal.integrated.autoReplies', '{ "foo": "bar" }');
				await terminal.createTerminal();
				await writeTextForAutoReply('foo');
				await terminal.waitForTerminalText(buffer => buffer.some(line => line.match(/foo.*bar/)));
			});
		});
	});
}
```

--------------------------------------------------------------------------------

````

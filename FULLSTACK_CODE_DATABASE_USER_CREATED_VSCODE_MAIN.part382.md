---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 382
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 382 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/common/abstractDebugAdapter.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/abstractDebugAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IDebugAdapter } from './debug.js';
import { timeout } from '../../../../base/common/async.js';
import { localize } from '../../../../nls.js';

/**
 * Abstract implementation of the low level API for a debug adapter.
 * Missing is how this API communicates with the debug adapter.
 */
export abstract class AbstractDebugAdapter implements IDebugAdapter {
	private sequence: number;
	private pendingRequests = new Map<number, (e: DebugProtocol.Response) => void>();
	private requestCallback: ((request: DebugProtocol.Request) => void) | undefined;
	private eventCallback: ((request: DebugProtocol.Event) => void) | undefined;
	private messageCallback: ((message: DebugProtocol.ProtocolMessage) => void) | undefined;
	private queue: DebugProtocol.ProtocolMessage[] = [];
	protected readonly _onError = new Emitter<Error>();
	protected readonly _onExit = new Emitter<number | null>();

	constructor() {
		this.sequence = 1;
	}

	abstract startSession(): Promise<void>;

	abstract stopSession(): Promise<void>;

	abstract sendMessage(message: DebugProtocol.ProtocolMessage): void;

	get onError(): Event<Error> {
		return this._onError.event;
	}

	get onExit(): Event<number | null> {
		return this._onExit.event;
	}

	onMessage(callback: (message: DebugProtocol.ProtocolMessage) => void): void {
		if (this.messageCallback) {
			this._onError.fire(new Error(`attempt to set more than one 'Message' callback`));
		}
		this.messageCallback = callback;
	}

	onEvent(callback: (event: DebugProtocol.Event) => void): void {
		if (this.eventCallback) {
			this._onError.fire(new Error(`attempt to set more than one 'Event' callback`));
		}
		this.eventCallback = callback;
	}

	onRequest(callback: (request: DebugProtocol.Request) => void): void {
		if (this.requestCallback) {
			this._onError.fire(new Error(`attempt to set more than one 'Request' callback`));
		}
		this.requestCallback = callback;
	}

	sendResponse(response: DebugProtocol.Response): void {
		if (response.seq > 0) {
			this._onError.fire(new Error(`attempt to send more than one response for command ${response.command}`));
		} else {
			this.internalSend('response', response);
		}
	}

	sendRequest(command: string, args: any, clb: (result: DebugProtocol.Response) => void, timeout?: number): number {
		const request: any = {
			command: command
		};
		if (args && Object.keys(args).length > 0) {
			request.arguments = args;
		}
		this.internalSend('request', request);
		if (typeof timeout === 'number') {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				const clb = this.pendingRequests.get(request.seq);
				if (clb) {
					this.pendingRequests.delete(request.seq);
					const err: DebugProtocol.Response = {
						type: 'response',
						seq: 0,
						request_seq: request.seq,
						success: false,
						command,
						message: localize('timeout', "Timeout after {0} ms for '{1}'", timeout, command)
					};
					clb(err);
				}
			}, timeout);
		}
		if (clb) {
			// store callback for this request
			this.pendingRequests.set(request.seq, clb);
		}

		return request.seq;
	}

	acceptMessage(message: DebugProtocol.ProtocolMessage): void {
		if (this.messageCallback) {
			this.messageCallback(message);
		} else {
			this.queue.push(message);
			if (this.queue.length === 1) {
				// first item = need to start processing loop
				this.processQueue();
			}
		}
	}

	/**
	 * Returns whether we should insert a timeout between processing messageA
	 * and messageB. Artificially queueing protocol messages guarantees that any
	 * microtasks for previous message finish before next message is processed.
	 * This is essential ordering when using promises anywhere along the call path.
	 *
	 * For example, take the following, where `chooseAndSendGreeting` returns
	 * a person name and then emits a greeting event:
	 *
	 * ```
	 * let person: string;
	 * adapter.onGreeting(() => console.log('hello', person));
	 * person = await adapter.chooseAndSendGreeting();
	 * ```
	 *
	 * Because the event is dispatched synchronously, it may fire before person
	 * is assigned if they're processed in the same task. Inserting a task
	 * boundary avoids this issue.
	 */
	protected needsTaskBoundaryBetween(messageA: DebugProtocol.ProtocolMessage, messageB: DebugProtocol.ProtocolMessage) {
		return messageA.type !== 'event' || messageB.type !== 'event';
	}

	/**
	 * Reads and dispatches items from the queue until it is empty.
	 */
	private async processQueue() {
		let message: DebugProtocol.ProtocolMessage | undefined;
		while (this.queue.length) {
			if (!message || this.needsTaskBoundaryBetween(this.queue[0], message)) {
				await timeout(0);
			}

			message = this.queue.shift();
			if (!message) {
				return; // may have been disposed of
			}

			switch (message.type) {
				case 'event':
					this.eventCallback?.(<DebugProtocol.Event>message);
					break;
				case 'request':
					this.requestCallback?.(<DebugProtocol.Request>message);
					break;
				case 'response': {
					const response = <DebugProtocol.Response>message;
					const clb = this.pendingRequests.get(response.request_seq);
					if (clb) {
						this.pendingRequests.delete(response.request_seq);
						clb(response);
					}
					break;
				}
			}
		}
	}

	private internalSend(typ: 'request' | 'response' | 'event', message: DebugProtocol.ProtocolMessage): void {
		message.type = typ;
		message.seq = this.sequence++;
		this.sendMessage(message);
	}

	protected async cancelPendingRequests(): Promise<void> {
		if (this.pendingRequests.size === 0) {
			return Promise.resolve();
		}

		const pending = new Map<number, (e: DebugProtocol.Response) => void>();
		this.pendingRequests.forEach((value, key) => pending.set(key, value));
		await timeout(500);
		pending.forEach((callback, request_seq) => {
			const err: DebugProtocol.Response = {
				type: 'response',
				seq: 0,
				request_seq,
				success: false,
				command: 'canceled',
				message: 'canceled'
			};
			callback(err);
			this.pendingRequests.delete(request_seq);
		});
	}

	getPendingRequestIds(): number[] {
		return Array.from(this.pendingRequests.keys());
	}

	dispose(): void {
		this.queue = [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/breakpoints.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/breakpoints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IBreakpointContribution } from './debug.js';

export class Breakpoints {

	private breakpointsWhen: ContextKeyExpression | undefined;

	constructor(
		private readonly breakpointContribution: IBreakpointContribution,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		this.breakpointsWhen = typeof breakpointContribution.when === 'string' ? ContextKeyExpr.deserialize(breakpointContribution.when) : undefined;
	}

	get language(): string {
		return this.breakpointContribution.language;
	}

	get enabled(): boolean {
		return !this.breakpointsWhen || this.contextKeyService.contextMatchesRules(this.breakpointsWhen);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debug.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debug.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Color } from '../../../../base/common/color.js';
import { Event } from '../../../../base/common/event.js';
import { IJSONSchema, IJSONSchemaSnippet } from '../../../../base/common/jsonSchema.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import severity from '../../../../base/common/severity.js';
import { URI, UriComponents, URI as uri } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { IRange } from '../../../../editor/common/core/range.js';
import * as editorCommon from '../../../../editor/common/editorCommon.js';
import { ITextModel as EditorIModel } from '../../../../editor/common/model.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryEndpoint } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IEditorPane } from '../../../common/editor.js';
import { DebugCompoundRoot } from './debugCompoundRoot.js';
import { IDataBreakpointOptions, IFunctionBreakpointOptions, IInstructionBreakpointOptions } from './debugModel.js';
import { Source } from './debugSource.js';
import { ITaskIdentifier } from '../../tasks/common/tasks.js';
import { LiveTestResult } from '../../testing/common/testResult.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IView } from '../../../common/views.js';

export const VIEWLET_ID = 'workbench.view.debug';

export const VARIABLES_VIEW_ID = 'workbench.debug.variablesView';
export const WATCH_VIEW_ID = 'workbench.debug.watchExpressionsView';
export const CALLSTACK_VIEW_ID = 'workbench.debug.callStackView';
export const LOADED_SCRIPTS_VIEW_ID = 'workbench.debug.loadedScriptsView';
export const BREAKPOINTS_VIEW_ID = 'workbench.debug.breakPointsView';
export const DISASSEMBLY_VIEW_ID = 'workbench.debug.disassemblyView';
export const DEBUG_PANEL_ID = 'workbench.panel.repl';
export const REPL_VIEW_ID = 'workbench.panel.repl.view';
export const CONTEXT_DEBUG_TYPE = new RawContextKey<string>('debugType', undefined, { type: 'string', description: nls.localize('debugType', "Debug type of the active debug session. For example 'python'.") });
export const CONTEXT_DEBUG_CONFIGURATION_TYPE = new RawContextKey<string>('debugConfigurationType', undefined, { type: 'string', description: nls.localize('debugConfigurationType', "Debug type of the selected launch configuration. For example 'python'.") });
export const CONTEXT_DEBUG_STATE = new RawContextKey<string>('debugState', 'inactive', { type: 'string', description: nls.localize('debugState', "State that the focused debug session is in. One of the following: 'inactive', 'initializing', 'stopped' or 'running'.") });
export const CONTEXT_DEBUG_UX_KEY = 'debugUx';
export const CONTEXT_DEBUG_UX = new RawContextKey<string>(CONTEXT_DEBUG_UX_KEY, 'default', { type: 'string', description: nls.localize('debugUX', "Debug UX state. When there are no debug configurations it is 'simple', otherwise 'default'. Used to decide when to show welcome views in the debug viewlet.") });
export const CONTEXT_HAS_DEBUGGED = new RawContextKey<boolean>('hasDebugged', false, { type: 'boolean', description: nls.localize('hasDebugged', "True when a debug session has been started at least once, false otherwise.") });
export const CONTEXT_IN_DEBUG_MODE = new RawContextKey<boolean>('inDebugMode', false, { type: 'boolean', description: nls.localize('inDebugMode', "True when debugging, false otherwise.") });
export const CONTEXT_IN_DEBUG_REPL = new RawContextKey<boolean>('inDebugRepl', false, { type: 'boolean', description: nls.localize('inDebugRepl', "True when focus is in the debug console, false otherwise.") });
export const CONTEXT_BREAKPOINT_WIDGET_VISIBLE = new RawContextKey<boolean>('breakpointWidgetVisible', false, { type: 'boolean', description: nls.localize('breakpointWidgetVisibile', "True when breakpoint editor zone widget is visible, false otherwise.") });
export const CONTEXT_IN_BREAKPOINT_WIDGET = new RawContextKey<boolean>('inBreakpointWidget', false, { type: 'boolean', description: nls.localize('inBreakpointWidget', "True when focus is in the breakpoint editor zone widget, false otherwise.") });
export const CONTEXT_BREAKPOINTS_FOCUSED = new RawContextKey<boolean>('breakpointsFocused', true, { type: 'boolean', description: nls.localize('breakpointsFocused', "True when the BREAKPOINTS view is focused, false otherwise.") });
export const CONTEXT_WATCH_EXPRESSIONS_FOCUSED = new RawContextKey<boolean>('watchExpressionsFocused', true, { type: 'boolean', description: nls.localize('watchExpressionsFocused', "True when the WATCH view is focused, false otherwise.") });
export const CONTEXT_WATCH_EXPRESSIONS_EXIST = new RawContextKey<boolean>('watchExpressionsExist', false, { type: 'boolean', description: nls.localize('watchExpressionsExist', "True when at least one watch expression exists, false otherwise.") });
export const CONTEXT_VARIABLES_FOCUSED = new RawContextKey<boolean>('variablesFocused', true, { type: 'boolean', description: nls.localize('variablesFocused', "True when the VARIABLES views is focused, false otherwise") });
export const CONTEXT_EXPRESSION_SELECTED = new RawContextKey<boolean>('expressionSelected', false, { type: 'boolean', description: nls.localize('expressionSelected', "True when an expression input box is open in either the WATCH or the VARIABLES view, false otherwise.") });
export const CONTEXT_BREAKPOINT_INPUT_FOCUSED = new RawContextKey<boolean>('breakpointInputFocused', false, { type: 'boolean', description: nls.localize('breakpointInputFocused', "True when the input box has focus in the BREAKPOINTS view.") });
export const CONTEXT_CALLSTACK_ITEM_TYPE = new RawContextKey<string>('callStackItemType', undefined, { type: 'string', description: nls.localize('callStackItemType', "Represents the item type of the focused element in the CALL STACK view. For example: 'session', 'thread', 'stackFrame'") });
export const CONTEXT_CALLSTACK_SESSION_IS_ATTACH = new RawContextKey<boolean>('callStackSessionIsAttach', false, { type: 'boolean', description: nls.localize('callStackSessionIsAttach', "True when the session in the CALL STACK view is attach, false otherwise. Used internally for inline menus in the CALL STACK view.") });
export const CONTEXT_CALLSTACK_ITEM_STOPPED = new RawContextKey<boolean>('callStackItemStopped', false, { type: 'boolean', description: nls.localize('callStackItemStopped', "True when the focused item in the CALL STACK is stopped. Used internaly for inline menus in the CALL STACK view.") });
export const CONTEXT_CALLSTACK_SESSION_HAS_ONE_THREAD = new RawContextKey<boolean>('callStackSessionHasOneThread', false, { type: 'boolean', description: nls.localize('callStackSessionHasOneThread', "True when the focused session in the CALL STACK view has exactly one thread. Used internally for inline menus in the CALL STACK view.") });
export const CONTEXT_CALLSTACK_FOCUSED = new RawContextKey<boolean>('callStackFocused', true, { type: 'boolean', description: nls.localize('callStackFocused', "True when the CALLSTACK view is focused, false otherwise.") });
export const CONTEXT_WATCH_ITEM_TYPE = new RawContextKey<string>('watchItemType', undefined, { type: 'string', description: nls.localize('watchItemType', "Represents the item type of the focused element in the WATCH view. For example: 'expression', 'variable'") });
export const CONTEXT_CAN_VIEW_MEMORY = new RawContextKey<boolean>('canViewMemory', undefined, { type: 'boolean', description: nls.localize('canViewMemory', "Indicates whether the item in the view has an associated memory refrence.") });
export const CONTEXT_BREAKPOINT_ITEM_TYPE = new RawContextKey<string>('breakpointItemType', undefined, { type: 'string', description: nls.localize('breakpointItemType', "Represents the item type of the focused element in the BREAKPOINTS view. For example: 'breakpoint', 'exceptionBreakppint', 'functionBreakpoint', 'dataBreakpoint'") });
export const CONTEXT_BREAKPOINT_ITEM_IS_DATA_BYTES = new RawContextKey<boolean>('breakpointItemBytes', undefined, { type: 'boolean', description: nls.localize('breakpointItemIsDataBytes', "Whether the breakpoint item is a data breakpoint on a byte range.") });
export const CONTEXT_BREAKPOINT_HAS_MODES = new RawContextKey<boolean>('breakpointHasModes', false, { type: 'boolean', description: nls.localize('breakpointHasModes', "Whether the breakpoint has multiple modes it can switch to.") });
export const CONTEXT_BREAKPOINT_SUPPORTS_CONDITION = new RawContextKey<boolean>('breakpointSupportsCondition', false, { type: 'boolean', description: nls.localize('breakpointSupportsCondition', "True when the focused breakpoint supports conditions.") });
export const CONTEXT_LOADED_SCRIPTS_SUPPORTED = new RawContextKey<boolean>('loadedScriptsSupported', false, { type: 'boolean', description: nls.localize('loadedScriptsSupported', "True when the focused sessions supports the LOADED SCRIPTS view") });
export const CONTEXT_LOADED_SCRIPTS_ITEM_TYPE = new RawContextKey<string>('loadedScriptsItemType', undefined, { type: 'string', description: nls.localize('loadedScriptsItemType', "Represents the item type of the focused element in the LOADED SCRIPTS view.") });
export const CONTEXT_FOCUSED_SESSION_IS_ATTACH = new RawContextKey<boolean>('focusedSessionIsAttach', false, { type: 'boolean', description: nls.localize('focusedSessionIsAttach', "True when the focused session is 'attach'.") });
export const CONTEXT_FOCUSED_SESSION_IS_NO_DEBUG = new RawContextKey<boolean>('focusedSessionIsNoDebug', false, { type: 'boolean', description: nls.localize('focusedSessionIsNoDebug', "True when the focused session is run without debugging.") });
export const CONTEXT_STEP_BACK_SUPPORTED = new RawContextKey<boolean>('stepBackSupported', false, { type: 'boolean', description: nls.localize('stepBackSupported', "True when the focused session supports 'stepBack' requests.") });
export const CONTEXT_RESTART_FRAME_SUPPORTED = new RawContextKey<boolean>('restartFrameSupported', false, { type: 'boolean', description: nls.localize('restartFrameSupported', "True when the focused session supports 'restartFrame' requests.") });
export const CONTEXT_STACK_FRAME_SUPPORTS_RESTART = new RawContextKey<boolean>('stackFrameSupportsRestart', false, { type: 'boolean', description: nls.localize('stackFrameSupportsRestart', "True when the focused stack frame supports 'restartFrame'.") });
export const CONTEXT_JUMP_TO_CURSOR_SUPPORTED = new RawContextKey<boolean>('jumpToCursorSupported', false, { type: 'boolean', description: nls.localize('jumpToCursorSupported', "True when the focused session supports 'jumpToCursor' request.") });
export const CONTEXT_STEP_INTO_TARGETS_SUPPORTED = new RawContextKey<boolean>('stepIntoTargetsSupported', false, { type: 'boolean', description: nls.localize('stepIntoTargetsSupported', "True when the focused session supports 'stepIntoTargets' request.") });
export const CONTEXT_BREAKPOINTS_EXIST = new RawContextKey<boolean>('breakpointsExist', false, { type: 'boolean', description: nls.localize('breakpointsExist', "True when at least one breakpoint exists.") });
export const CONTEXT_DEBUGGERS_AVAILABLE = new RawContextKey<boolean>('debuggersAvailable', false, { type: 'boolean', description: nls.localize('debuggersAvailable', "True when there is at least one debug extensions active.") });
export const CONTEXT_DEBUG_EXTENSION_AVAILABLE = new RawContextKey<boolean>('debugExtensionAvailable', true, { type: 'boolean', description: nls.localize('debugExtensionsAvailable', "True when there is at least one debug extension installed and enabled.") });
export const CONTEXT_DEBUG_PROTOCOL_VARIABLE_MENU_CONTEXT = new RawContextKey<string>('debugProtocolVariableMenuContext', undefined, { type: 'string', description: nls.localize('debugProtocolVariableMenuContext', "Represents the context the debug adapter sets on the focused variable in the VARIABLES view.") });
export const CONTEXT_SET_VARIABLE_SUPPORTED = new RawContextKey<boolean>('debugSetVariableSupported', false, { type: 'boolean', description: nls.localize('debugSetVariableSupported', "True when the focused session supports 'setVariable' request.") });
export const CONTEXT_SET_DATA_BREAKPOINT_BYTES_SUPPORTED = new RawContextKey<boolean>('debugSetDataBreakpointAddressSupported', false, { type: 'boolean', description: nls.localize('debugSetDataBreakpointAddressSupported', "True when the focused session supports 'getBreakpointInfo' request on an address.") });
export const CONTEXT_SET_EXPRESSION_SUPPORTED = new RawContextKey<boolean>('debugSetExpressionSupported', false, { type: 'boolean', description: nls.localize('debugSetExpressionSupported', "True when the focused session supports 'setExpression' request.") });
export const CONTEXT_BREAK_WHEN_VALUE_CHANGES_SUPPORTED = new RawContextKey<boolean>('breakWhenValueChangesSupported', false, { type: 'boolean', description: nls.localize('breakWhenValueChangesSupported', "True when the focused session supports to break when value changes.") });
export const CONTEXT_BREAK_WHEN_VALUE_IS_ACCESSED_SUPPORTED = new RawContextKey<boolean>('breakWhenValueIsAccessedSupported', false, { type: 'boolean', description: nls.localize('breakWhenValueIsAccessedSupported', "True when the focused breakpoint supports to break when value is accessed.") });
export const CONTEXT_BREAK_WHEN_VALUE_IS_READ_SUPPORTED = new RawContextKey<boolean>('breakWhenValueIsReadSupported', false, { type: 'boolean', description: nls.localize('breakWhenValueIsReadSupported', "True when the focused breakpoint supports to break when value is read.") });
export const CONTEXT_TERMINATE_DEBUGGEE_SUPPORTED = new RawContextKey<boolean>('terminateDebuggeeSupported', false, { type: 'boolean', description: nls.localize('terminateDebuggeeSupported', "True when the focused session supports the terminate debuggee capability.") });
export const CONTEXT_SUSPEND_DEBUGGEE_SUPPORTED = new RawContextKey<boolean>('suspendDebuggeeSupported', false, { type: 'boolean', description: nls.localize('suspendDebuggeeSupported', "True when the focused session supports the suspend debuggee capability.") });
export const CONTEXT_TERMINATE_THREADS_SUPPORTED = new RawContextKey<boolean>('terminateThreadsSupported', false, { type: 'boolean', description: nls.localize('terminateThreadsSupported', "True when the focused session supports the terminate threads capability.") });
export const CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT = new RawContextKey<boolean>('variableEvaluateNamePresent', false, { type: 'boolean', description: nls.localize('variableEvaluateNamePresent', "True when the focused variable has an 'evalauteName' field set.") });
export const CONTEXT_VARIABLE_IS_READONLY = new RawContextKey<boolean>('variableIsReadonly', false, { type: 'boolean', description: nls.localize('variableIsReadonly', "True when the focused variable is read-only.") });
export const CONTEXT_VARIABLE_VALUE = new RawContextKey<boolean>('variableValue', false, { type: 'string', description: nls.localize('variableValue', "Value of the variable, present for debug visualization clauses.") });
export const CONTEXT_VARIABLE_TYPE = new RawContextKey<boolean>('variableType', false, { type: 'string', description: nls.localize('variableType', "Type of the variable, present for debug visualization clauses.") });
export const CONTEXT_VARIABLE_INTERFACES = new RawContextKey<boolean>('variableInterfaces', false, { type: 'array', description: nls.localize('variableInterfaces', "Any interfaces or contracts that the variable satisfies, present for debug visualization clauses.") });
export const CONTEXT_VARIABLE_NAME = new RawContextKey<boolean>('variableName', false, { type: 'string', description: nls.localize('variableName', "Name of the variable, present for debug visualization clauses.") });
export const CONTEXT_VARIABLE_LANGUAGE = new RawContextKey<boolean>('variableLanguage', false, { type: 'string', description: nls.localize('variableLanguage', "Language of the variable source, present for debug visualization clauses.") });
export const CONTEXT_VARIABLE_EXTENSIONID = new RawContextKey<boolean>('variableExtensionId', false, { type: 'string', description: nls.localize('variableExtensionId', "Extension ID of the variable source, present for debug visualization clauses.") });
export const CONTEXT_EXCEPTION_WIDGET_VISIBLE = new RawContextKey<boolean>('exceptionWidgetVisible', false, { type: 'boolean', description: nls.localize('exceptionWidgetVisible', "True when the exception widget is visible.") });
export const CONTEXT_MULTI_SESSION_REPL = new RawContextKey<boolean>('multiSessionRepl', false, { type: 'boolean', description: nls.localize('multiSessionRepl', "True when there is more than 1 debug console.") });
export const CONTEXT_MULTI_SESSION_DEBUG = new RawContextKey<boolean>('multiSessionDebug', false, { type: 'boolean', description: nls.localize('multiSessionDebug', "True when there is more than 1 active debug session.") });
export const CONTEXT_DISASSEMBLE_REQUEST_SUPPORTED = new RawContextKey<boolean>('disassembleRequestSupported', false, { type: 'boolean', description: nls.localize('disassembleRequestSupported', "True when the focused sessions supports disassemble request.") });
export const CONTEXT_DISASSEMBLY_VIEW_FOCUS = new RawContextKey<boolean>('disassemblyViewFocus', false, { type: 'boolean', description: nls.localize('disassemblyViewFocus', "True when the Disassembly View is focused.") });
export const CONTEXT_LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST = new RawContextKey<boolean>('languageSupportsDisassembleRequest', false, { type: 'boolean', description: nls.localize('languageSupportsDisassembleRequest', "True when the language in the current editor supports disassemble request.") });
export const CONTEXT_FOCUSED_STACK_FRAME_HAS_INSTRUCTION_POINTER_REFERENCE = new RawContextKey<boolean>('focusedStackFrameHasInstructionReference', false, { type: 'boolean', description: nls.localize('focusedStackFrameHasInstructionReference', "True when the focused stack frame has instruction pointer reference.") });

export const debuggerDisabledMessage = (debugType: string) => nls.localize('debuggerDisabled', "Configured debug type '{0}' is installed but not supported in this environment.", debugType);

export const EDITOR_CONTRIBUTION_ID = 'editor.contrib.debug';
export const BREAKPOINT_EDITOR_CONTRIBUTION_ID = 'editor.contrib.breakpoint';
export const DEBUG_SCHEME = 'debug';
export const INTERNAL_CONSOLE_OPTIONS_SCHEMA = {
	enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart'],
	default: 'openOnFirstSessionStart',
	description: nls.localize('internalConsoleOptions', "Controls when the internal Debug Console should open.")
};

export interface IDebugViewWithVariables extends IView {
	readonly treeSelection: IExpression[];
}

// raw

export interface IRawModelUpdate {
	sessionId: string;
	threads: DebugProtocol.Thread[];
	stoppedDetails?: IRawStoppedDetails;
}

export interface IRawStoppedDetails {
	reason?: string;
	description?: string;
	threadId?: number;
	text?: string;
	totalFrames?: number;
	allThreadsStopped?: boolean;
	preserveFocusHint?: boolean;
	framesErrorMessage?: string;
	hitBreakpointIds?: number[];
}

// model

export interface ITreeElement {
	getId(): string;
}

export interface IReplElement extends ITreeElement {
	toString(includeSource?: boolean): string;
	readonly sourceData?: IReplElementSource;
}

export interface INestingReplElement extends IReplElement {
	readonly hasChildren: boolean;
	getChildren(): Promise<IReplElement[]> | IReplElement[];
}

export interface IReplElementSource {
	readonly source: Source;
	readonly lineNumber: number;
	readonly column: number;
}

export interface IExpressionValue {
	readonly value: string;
	readonly type?: string;
	valueChanged?: boolean;
}

export interface IExpressionContainer extends ITreeElement, IExpressionValue {
	readonly hasChildren: boolean;
	getSession(): IDebugSession | undefined;
	evaluateLazy(): Promise<void>;
	getChildren(): Promise<IExpression[]>;
	readonly reference?: number;
	readonly memoryReference?: string;
	readonly presentationHint?: DebugProtocol.VariablePresentationHint | undefined;
	readonly valueLocationReference?: number;
}

export interface IExpression extends IExpressionContainer {
	name: string;
}

export interface IDebugger {
	readonly type: string;
	createDebugAdapter(session: IDebugSession): Promise<IDebugAdapter>;
	runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined>;
	startDebugging(args: IConfig, parentSessionId: string): Promise<boolean>;
	getCustomTelemetryEndpoint(): ITelemetryEndpoint | undefined;
	getInitialConfigurationContent(initialConfigs?: IConfig[]): Promise<string>;
}

export interface IDebuggerMetadata {
	label: string;
	type: string;
	strings?: { [key in DebuggerString]: string };
	interestedInLanguage(languageId: string): boolean;
}

export const enum State {
	Inactive,
	Initializing,
	Stopped,
	Running
}

export function getStateLabel(state: State): string {
	switch (state) {
		case State.Initializing: return 'initializing';
		case State.Stopped: return 'stopped';
		case State.Running: return 'running';
		default: return 'inactive';
	}
}

export interface AdapterEndEvent {
	error?: Error;
	sessionLengthInSeconds: number;
	emittedStopped: boolean;
}

export interface LoadedSourceEvent {
	reason: 'new' | 'changed' | 'removed';
	source: Source;
}

export type IDebugSessionReplMode = 'separate' | 'mergeWithParent';

export interface IDebugTestRunReference {
	runId: string;
	taskId: string;
}

export interface IDebugSessionOptions {
	noDebug?: boolean;
	parentSession?: IDebugSession;
	lifecycleManagedByParent?: boolean;
	repl?: IDebugSessionReplMode;
	compoundRoot?: DebugCompoundRoot;
	compact?: boolean;
	startedByUser?: boolean;
	saveBeforeRestart?: boolean;
	suppressDebugToolbar?: boolean;
	suppressDebugStatusbar?: boolean;
	suppressDebugView?: boolean;
	/**
	 * Set if the debug session is correlated with a test run. Stopping/restarting
	 * the session will instead stop/restart the test run.
	 */
	testRun?: IDebugTestRunReference;
}

export interface IDataBreakpointInfoResponse {
	dataId: string | null;
	description: string;
	canPersist?: boolean;
	accessTypes?: DebugProtocol.DataBreakpointAccessType[];
}

export interface IMemoryInvalidationEvent {
	fromOffset: number;
	toOffset: number;
}

export const enum MemoryRangeType {
	Valid,
	Unreadable,
	Error,
}

export interface IMemoryRange {
	type: MemoryRangeType;
	offset: number;
	length: number;
}

export interface IValidMemoryRange extends IMemoryRange {
	type: MemoryRangeType.Valid;
	offset: number;
	length: number;
	data: VSBuffer;
}

export interface IUnreadableMemoryRange extends IMemoryRange {
	type: MemoryRangeType.Unreadable;
}

export interface IErrorMemoryRange extends IMemoryRange {
	type: MemoryRangeType.Error;
	error: string;
}

/**
 * Union type of memory that can be returned from read(). Since a read request
 * could encompass multiple previously-read ranges, multiple of these types
 * are possible to return.
 */
export type MemoryRange = IValidMemoryRange | IUnreadableMemoryRange | IErrorMemoryRange;

export const DEBUG_MEMORY_SCHEME = 'vscode-debug-memory';

/**
 * An IMemoryRegion corresponds to a contiguous range of memory referred to
 * by a DAP `memoryReference`.
 */
export interface IMemoryRegion extends IDisposable {
	/**
	 * Event that fires when memory changes. Can be a result of memory events or
	 * `write` requests.
	 */
	readonly onDidInvalidate: Event<IMemoryInvalidationEvent>;

	/**
	 * Whether writes are supported on this memory region.
	 */
	readonly writable: boolean;

	/**
	 * Requests memory ranges from the debug adapter. It returns a list of memory
	 * ranges that overlap (but may exceed!) the given offset. Use the `offset`
	 * and `length` of each range for display.
	 */
	read(fromOffset: number, toOffset: number): Promise<MemoryRange[]>;

	/**
	 * Writes memory to the debug adapter at the given offset.
	 */
	write(offset: number, data: VSBuffer): Promise<number>;
}

/** Data that can be inserted in {@link IDebugSession.appendToRepl} */
export interface INewReplElementData {
	/**
	 * Output string to display
	 */
	output: string;

	/**
	 * Expression data to display. Will result in the item being expandable in
	 * the REPL. Its value will be used if {@link output} is not provided.
	 */
	expression?: IExpression;

	/**
	 * Output severity.
	 */
	sev: severity;

	/**
	 * Originating location.
	 */
	source?: IReplElementSource;
}

export interface IDebugEvaluatePosition {
	line: number;
	column: number;
	source: DebugProtocol.Source;
}

export interface IDebugLocationReferenced {
	line: number;
	column: number;
	endLine?: number;
	endColumn?: number;
	source: Source;
}

export interface IDebugSession extends ITreeElement, IDisposable {

	readonly configuration: IConfig;
	readonly unresolvedConfiguration: IConfig | undefined;
	readonly state: State;
	readonly root: IWorkspaceFolder | undefined;
	readonly parentSession: IDebugSession | undefined;
	readonly subId: string | undefined;
	readonly compact: boolean;
	readonly compoundRoot: DebugCompoundRoot | undefined;
	readonly saveBeforeRestart: boolean;
	readonly name: string;
	readonly autoExpandLazyVariables: boolean;
	readonly suppressDebugToolbar: boolean;
	readonly suppressDebugStatusbar: boolean;
	readonly suppressDebugView: boolean;
	readonly lifecycleManagedByParent: boolean;
	/** Test run this debug session was spawned by */
	readonly correlatedTestRun?: LiveTestResult;

	setSubId(subId: string | undefined): void;

	getMemory(memoryReference: string): IMemoryRegion;

	setName(name: string): void;
	readonly onDidChangeName: Event<string>;
	getLabel(): string;

	getSourceForUri(modelUri: uri): Source | undefined;
	getSource(raw?: DebugProtocol.Source): Source;

	setConfiguration(configuration: { resolved: IConfig; unresolved: IConfig | undefined }): void;
	rawUpdate(data: IRawModelUpdate): void;

	getThread(threadId: number): IThread | undefined;
	getAllThreads(): IThread[];
	clearThreads(removeThreads: boolean, reference?: number): void;
	getStoppedDetails(): IRawStoppedDetails | undefined;

	getReplElements(): IReplElement[];
	hasSeparateRepl(): boolean;
	removeReplExpressions(): void;
	addReplExpression(stackFrame: IStackFrame | undefined, name: string): Promise<void>;
	appendToRepl(data: INewReplElementData): void;
	/** Cancel any associated test run set through the DebugSessionOptions */
	cancelCorrelatedTestRun(): void;

	// session events
	readonly onDidEndAdapter: Event<AdapterEndEvent | undefined>;
	readonly onDidChangeState: Event<void>;
	readonly onDidChangeReplElements: Event<IReplElement | undefined>;

	/** DA capabilities. Set only when there is a running session available. */
	readonly capabilities: DebugProtocol.Capabilities;
	/** DA capabilities. These are retained on the session even after is implementation ends. */
	readonly rememberedCapabilities?: DebugProtocol.Capabilities;

	// DAP events

	readonly onDidLoadedSource: Event<LoadedSourceEvent>;
	readonly onDidCustomEvent: Event<DebugProtocol.Event>;
	readonly onDidProgressStart: Event<DebugProtocol.ProgressStartEvent>;
	readonly onDidProgressUpdate: Event<DebugProtocol.ProgressUpdateEvent>;
	readonly onDidProgressEnd: Event<DebugProtocol.ProgressEndEvent>;
	readonly onDidInvalidateMemory: Event<DebugProtocol.MemoryEvent>;

	// DAP request

	initialize(dbgr: IDebugger): Promise<void>;
	launchOrAttach(config: IConfig): Promise<void>;
	restart(): Promise<void>;
	terminate(restart?: boolean /* false */): Promise<void>;
	disconnect(restart?: boolean /* false */, suspend?: boolean): Promise<void>;

	sendBreakpoints(modelUri: uri, bpts: IBreakpoint[], sourceModified: boolean): Promise<void>;
	sendFunctionBreakpoints(fbps: IFunctionBreakpoint[]): Promise<void>;
	dataBreakpointInfo(name: string, variablesReference?: number, frameId?: number): Promise<IDataBreakpointInfoResponse | undefined>;
	dataBytesBreakpointInfo(address: string, bytes: number): Promise<IDataBreakpointInfoResponse | undefined>;
	sendDataBreakpoints(dbps: IDataBreakpoint[]): Promise<void>;
	sendInstructionBreakpoints(dbps: IInstructionBreakpoint[]): Promise<void>;
	sendExceptionBreakpoints(exbpts: IExceptionBreakpoint[]): Promise<void>;
	breakpointsLocations(uri: uri, lineNumber: number): Promise<IPosition[]>;
	getDebugProtocolBreakpoint(breakpointId: string): DebugProtocol.Breakpoint | undefined;
	resolveLocationReference(locationReference: number): Promise<IDebugLocationReferenced>;

	stackTrace(threadId: number, startFrame: number, levels: number, token: CancellationToken): Promise<DebugProtocol.StackTraceResponse | undefined>;
	exceptionInfo(threadId: number): Promise<IExceptionInfo | undefined>;
	scopes(frameId: number, threadId: number): Promise<DebugProtocol.ScopesResponse | undefined>;
	variables(variablesReference: number, threadId: number | undefined, filter: 'indexed' | 'named' | undefined, start: number | undefined, count: number | undefined): Promise<DebugProtocol.VariablesResponse | undefined>;
	evaluate(expression: string, frameId?: number, context?: string, location?: IDebugEvaluatePosition): Promise<DebugProtocol.EvaluateResponse | undefined>;
	customRequest(request: string, args: unknown): Promise<DebugProtocol.Response | undefined>;
	cancel(progressId: string): Promise<DebugProtocol.CancelResponse | undefined>;
	disassemble(memoryReference: string, offset: number, instructionOffset: number, instructionCount: number): Promise<DebugProtocol.DisassembledInstruction[] | undefined>;
	readMemory(memoryReference: string, offset: number, count: number): Promise<DebugProtocol.ReadMemoryResponse | undefined>;
	writeMemory(memoryReference: string, offset: number, data: string, allowPartial?: boolean): Promise<DebugProtocol.WriteMemoryResponse | undefined>;

	restartFrame(frameId: number, threadId: number): Promise<void>;
	next(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepIn(threadId: number, targetId?: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepInTargets(frameId: number): Promise<DebugProtocol.StepInTarget[] | undefined>;
	stepOut(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepBack(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	continue(threadId: number): Promise<void>;
	reverseContinue(threadId: number): Promise<void>;
	pause(threadId: number): Promise<void>;
	terminateThreads(threadIds: number[]): Promise<void>;

	completions(frameId: number | undefined, threadId: number, text: string, position: Position, token: CancellationToken): Promise<DebugProtocol.CompletionsResponse | undefined>;
	setVariable(variablesReference: number | undefined, name: string, value: string): Promise<DebugProtocol.SetVariableResponse | undefined>;
	setExpression(frameId: number, expression: string, value: string): Promise<DebugProtocol.SetExpressionResponse | undefined>;
	loadSource(resource: uri): Promise<DebugProtocol.SourceResponse | undefined>;
	getLoadedSources(): Promise<Source[]>;

	gotoTargets(source: DebugProtocol.Source, line: number, column?: number): Promise<DebugProtocol.GotoTargetsResponse | undefined>;
	goto(threadId: number, targetId: number): Promise<DebugProtocol.GotoResponse | undefined>;
}

export interface IThread extends ITreeElement {

	/**
	 * Process the thread belongs to
	 */
	readonly session: IDebugSession;

	/**
	 * Id of the thread generated by the debug adapter backend.
	 */
	readonly threadId: number;

	/**
	 * Name of the thread.
	 */
	readonly name: string;

	/**
	 * Information about the current thread stop event. Undefined if thread is not stopped.
	 */
	readonly stoppedDetails: IRawStoppedDetails | undefined;

	/**
	 * Information about the exception if an 'exception' stopped event raised and DA supports the 'exceptionInfo' request, otherwise undefined.
	 */
	readonly exceptionInfo: Promise<IExceptionInfo | undefined>;

	readonly stateLabel: string;

	/**
	 * Gets the callstack if it has already been received from the debug
	 * adapter.
	 */
	getCallStack(): ReadonlyArray<IStackFrame>;


	/**
	 * Gets the top stack frame that is not hidden if the callstack has already been received from the debug adapter
	 */
	getTopStackFrame(): IStackFrame | undefined;

	/**
	 * Invalidates the callstack cache
	 */
	clearCallStack(): void;

	/**
	 * Indicates whether this thread is stopped. The callstack for stopped
	 * threads can be retrieved from the debug adapter.
	 */
	readonly stopped: boolean;

	next(granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepIn(granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepOut(granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	stepBack(granularity?: DebugProtocol.SteppingGranularity): Promise<void>;
	continue(): Promise<void>;
	pause(): Promise<void>;
	terminate(): Promise<void>;
	reverseContinue(): Promise<void>;
}

export interface IScope extends IExpressionContainer {
	readonly name: string;
	readonly expensive: boolean;
	readonly range?: IRange;
	readonly hasChildren: boolean;
	readonly childrenHaveBeenLoaded: boolean;
}

export interface IStackFrame extends ITreeElement {
	readonly thread: IThread;
	readonly name: string;
	readonly presentationHint: string | undefined;
	readonly frameId: number;
	readonly range: IRange;
	readonly source: Source;
	readonly canRestart: boolean;
	readonly instructionPointerReference?: string;
	getScopes(): Promise<IScope[]>;
	getMostSpecificScopes(range: IRange): Promise<ReadonlyArray<IScope>>;
	forgetScopes(): void;
	restart(): Promise<void>;
	toString(): string;
	openInEditor(editorService: IEditorService, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): Promise<IEditorPane | undefined>;
	equals(other: IStackFrame): boolean;
}

export function isFrameDeemphasized(frame: IStackFrame): boolean {
	const hint = frame.presentationHint ?? frame.source.presentationHint;
	return hint === 'deemphasize' || hint === 'subtle';
}

export interface IEnablement extends ITreeElement {
	readonly enabled: boolean;
}

export interface IBreakpointData {
	readonly id?: string;
	readonly lineNumber: number;
	readonly column?: number;
	readonly enabled?: boolean;
	readonly condition?: string;
	readonly logMessage?: string;
	readonly hitCondition?: string;
	readonly triggeredBy?: string;
	readonly mode?: string;
	readonly modeLabel?: string;
}

export interface IBreakpointUpdateData {
	readonly condition?: string;
	readonly hitCondition?: string;
	readonly logMessage?: string;
	readonly lineNumber?: number;
	readonly column?: number;
	readonly triggeredBy?: string;
	readonly mode?: string;
	readonly modeLabel?: string;
}

export interface IBaseBreakpoint extends IEnablement {
	readonly condition?: string;
	readonly hitCondition?: string;
	readonly logMessage?: string;
	readonly verified: boolean;
	readonly supported: boolean;
	readonly message?: string;
	/** The preferred mode of the breakpoint from {@link DebugProtocol.BreakpointMode} */
	readonly mode?: string;
	/** The preferred mode label of the breakpoint from {@link DebugProtocol.BreakpointMode} */
	readonly modeLabel?: string;
	readonly sessionsThatVerified: string[];
	getIdFromAdapter(sessionId: string): number | undefined;
}

export interface IBreakpoint extends IBaseBreakpoint {
	/** URI where the breakpoint was first set by the user. */
	readonly originalUri: uri;
	/** URI where the breakpoint is currently shown; may be moved by debugger */
	readonly uri: uri;
	readonly lineNumber: number;
	readonly endLineNumber?: number;
	readonly column?: number;
	readonly endColumn?: number;
	readonly adapterData: unknown;
	readonly sessionAgnosticData: { lineNumber: number; column: number | undefined };
	/** An ID of the breakpoint that triggers this breakpoint. */
	readonly triggeredBy?: string;
	/** Pending on the trigger breakpoint, which means this breakpoint is not yet sent to DA */
	readonly pending: boolean;

	/** Marks that a session did trigger the breakpoint. */
	setSessionDidTrigger(sessionId: string, didTrigger?: boolean): void;
	/** Gets whether the `triggeredBy` condition has been met in the given sesison ID. */
	getSessionDidTrigger(sessionId: string): boolean;

	toDAP(): DebugProtocol.SourceBreakpoint;
}

export interface IFunctionBreakpoint extends IBaseBreakpoint {
	readonly name: string;
	toDAP(): DebugProtocol.FunctionBreakpoint;
}

export interface IExceptionBreakpoint extends IBaseBreakpoint {
	readonly filter: string;
	readonly label: string;
	readonly description: string | undefined;
}

export const enum DataBreakpointSetType {
	Variable,
	Address,
}

/**
 * Source for a data breakpoint. A data breakpoint on a variable always has a
 * `dataId` because it cannot reference that variable globally, but addresses
 * can request info repeated and use session-specific data.
 */
export type DataBreakpointSource =
	| { type: DataBreakpointSetType.Variable; dataId: string }
	| { type: DataBreakpointSetType.Address; address: string; bytes: number };

export interface IDataBreakpoint extends IBaseBreakpoint {
	readonly description: string;
	readonly canPersist: boolean;
	readonly src: DataBreakpointSource;
	readonly accessType: DebugProtocol.DataBreakpointAccessType;
	toDAP(session: IDebugSession): Promise<DebugProtocol.DataBreakpoint | undefined>;
}

export interface IInstructionBreakpoint extends IBaseBreakpoint {
	readonly instructionReference: string;
	readonly offset?: number;
	/** Original instruction memory address; display purposes only */
	readonly address: bigint;
	toDAP(): DebugProtocol.InstructionBreakpoint;
}

export interface IExceptionInfo {
	readonly id?: string;
	readonly description?: string;
	readonly breakMode: string | null;
	readonly details?: DebugProtocol.ExceptionDetails;
}

// model interfaces

export interface IViewModel extends ITreeElement {
	/**
	 * Returns the focused debug session or undefined if no session is stopped.
	 */
	readonly focusedSession: IDebugSession | undefined;

	/**
	 * Returns the focused thread or undefined if no thread is stopped.
	 */
	readonly focusedThread: IThread | undefined;

	/**
	 * Returns the focused stack frame or undefined if there are no stack frames.
	 */
	readonly focusedStackFrame: IStackFrame | undefined;

	setVisualizedExpression(original: IExpression, visualized: IExpression & { treeId: string } | undefined): void;
	/** Returns the visualized expression if loaded, or a tree it should be visualized with, or undefined */
	getVisualizedExpression(expression: IExpression): IExpression | string | undefined;
	getSelectedExpression(): { expression: IExpression; settingWatch: boolean } | undefined;
	setSelectedExpression(expression: IExpression | undefined, settingWatch: boolean): void;
	updateViews(): void;

	isMultiSessionView(): boolean;

	readonly onDidFocusSession: Event<IDebugSession | undefined>;
	readonly onDidFocusThread: Event<{ thread: IThread | undefined; explicit: boolean; session: IDebugSession | undefined }>;
	readonly onDidFocusStackFrame: Event<{ stackFrame: IStackFrame | undefined; explicit: boolean; session: IDebugSession | undefined }>;
	readonly onDidSelectExpression: Event<{ expression: IExpression; settingWatch: boolean } | undefined>;
	readonly onDidEvaluateLazyExpression: Event<IExpressionContainer>;
	/**
	 * Fired when `setVisualizedExpression`, to migrate elements currently
	 * rendered as `original` to the `replacement`.
	 */
	readonly onDidChangeVisualization: Event<{ original: IExpression; replacement: IExpression }>;
	readonly onWillUpdateViews: Event<void>;

	evaluateLazyExpression(expression: IExpressionContainer): void;
}

export interface IEvaluate {
	evaluate(session: IDebugSession, stackFrame: IStackFrame, context: string): Promise<void>;
}

export interface IDebugModel extends ITreeElement {
	getSession(sessionId: string | undefined, includeInactive?: boolean): IDebugSession | undefined;
	getSessions(includeInactive?: boolean): IDebugSession[];
	getBreakpoints(filter?: { uri?: uri; originalUri?: uri; lineNumber?: number; column?: number; enabledOnly?: boolean; triggeredOnly?: boolean }): ReadonlyArray<IBreakpoint>;
	areBreakpointsActivated(): boolean;
	getFunctionBreakpoints(): ReadonlyArray<IFunctionBreakpoint>;
	getDataBreakpoints(): ReadonlyArray<IDataBreakpoint>;

	/**
	 * Returns list of all exception breakpoints.
	 */
	getExceptionBreakpoints(): ReadonlyArray<IExceptionBreakpoint>;

	/**
	 * Returns list of exception breakpoints for the given session
	 * @param sessionId Session id. If falsy, returns the breakpoints from the last set fallback session.
	 */
	getExceptionBreakpointsForSession(sessionId?: string): ReadonlyArray<IExceptionBreakpoint>;

	getInstructionBreakpoints(): ReadonlyArray<IInstructionBreakpoint>;
	getWatchExpressions(): ReadonlyArray<IExpression & IEvaluate>;
	registerBreakpointModes(debugType: string, modes: DebugProtocol.BreakpointMode[]): void;
	getBreakpointModes(forBreakpointType: 'source' | 'exception' | 'data' | 'instruction'): DebugProtocol.BreakpointMode[];
	readonly onDidChangeBreakpoints: Event<IBreakpointsChangeEvent | undefined>;
	readonly onDidChangeCallStack: Event<void>;
	/**
	 * The expression has been added, removed, or repositioned.
	 */
	readonly onDidChangeWatchExpressions: Event<IExpression | undefined>;
	/**
	 * The expression's value has changed.
	 */
	readonly onDidChangeWatchExpressionValue: Event<IExpression | undefined>;

	fetchCallstack(thread: IThread, levels?: number): Promise<void>;
}

/**
 * An event describing a change to the set of [breakpoints](#debug.Breakpoint).
 */
export interface IBreakpointsChangeEvent {
	added?: Array<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint>;
	removed?: Array<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint>;
	changed?: Array<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint>;
	sessionOnly: boolean;
}

// Debug configuration interfaces

export interface IDebugConfiguration {
	allowBreakpointsEverywhere: boolean;
	gutterMiddleClickAction: 'logpoint' | 'conditionalBreakpoint' | 'triggeredBreakpoint' | 'none';
	openDebug: 'neverOpen' | 'openOnSessionStart' | 'openOnFirstSessionStart' | 'openOnDebugBreak';
	openExplorerOnEnd: boolean;
	inlineValues: boolean | 'auto' | 'on' | 'off'; // boolean for back-compat
	toolBarLocation: 'floating' | 'docked' | 'commandCenter' | 'hidden';
	showInStatusBar: 'never' | 'always' | 'onFirstSessionStart';
	internalConsoleOptions: 'neverOpen' | 'openOnSessionStart' | 'openOnFirstSessionStart';
	extensionHostDebugAdapter: boolean;
	enableAllHovers: boolean;
	showSubSessionsInToolBar: boolean;
	closeReadonlyTabsOnEnd: boolean;
	console: {
		fontSize: number;
		fontFamily: string;
		lineHeight: number;
		wordWrap: boolean;
		closeOnEnd: boolean;
		collapseIdenticalLines: boolean;
		historySuggestions: boolean;
		acceptSuggestionOnEnter: 'off' | 'on';
		maximumLines: number;
	};
	focusWindowOnBreak: boolean;
	focusEditorOnBreak: boolean;
	onTaskErrors: 'debugAnyway' | 'showErrors' | 'prompt' | 'abort';
	showBreakpointsInOverviewRuler: boolean;
	showInlineBreakpointCandidates: boolean;
	confirmOnExit: 'always' | 'never';
	disassemblyView: {
		showSourceCode: boolean;
	};
	autoExpandLazyVariables: 'auto' | 'off' | 'on';
	enableStatusBarColor: boolean;
	showVariableTypes: boolean;
	hideSlowPreLaunchWarning: boolean;
}

export interface IGlobalConfig {
	version: string;
	compounds: ICompound[];
	configurations: IConfig[];
}

interface IEnvConfig {
	internalConsoleOptions?: 'neverOpen' | 'openOnSessionStart' | 'openOnFirstSessionStart';
	preRestartTask?: string | ITaskIdentifier;
	postRestartTask?: string | ITaskIdentifier;
	preLaunchTask?: string | ITaskIdentifier;
	postDebugTask?: string | ITaskIdentifier;
	debugServer?: number;
	noDebug?: boolean;
	suppressMultipleSessionWarning?: boolean;
}

export interface IConfigPresentation {
	hidden?: boolean;
	group?: string;
	order?: number;
}

export interface IConfig extends IEnvConfig {

	// fundamental attributes
	type: string;
	request: string;
	name: string;
	presentation?: IConfigPresentation;
	// platform specifics
	windows?: IEnvConfig;
	osx?: IEnvConfig;
	linux?: IEnvConfig;

	// internals
	__configurationTarget?: ConfigurationTarget;
	__sessionId?: string;
	__restart?: unknown;
	__autoAttach?: boolean;
	port?: number; // TODO
}

export interface ICompound {
	name: string;
	stopAll?: boolean;
	preLaunchTask?: string | ITaskIdentifier;
	configurations: (string | { name: string; folder: string })[];
	presentation?: IConfigPresentation;
}

export interface IDebugAdapter extends IDisposable {
	readonly onError: Event<Error>;
	readonly onExit: Event<number | null>;
	onRequest(callback: (request: DebugProtocol.Request) => void): void;
	onEvent(callback: (event: DebugProtocol.Event) => void): void;
	startSession(): Promise<void>;
	sendMessage(message: DebugProtocol.ProtocolMessage): void;
	sendResponse(response: DebugProtocol.Response): void;
	sendRequest(command: string, args: unknown, clb: (result: DebugProtocol.Response) => void, timeout?: number): number;
	stopSession(): Promise<void>;
}

export interface IDebugAdapterFactory extends ITerminalLauncher {
	createDebugAdapter(session: IDebugSession): IDebugAdapter;
	substituteVariables(folder: IWorkspaceFolder | undefined, config: IConfig): Promise<IConfig>;
}

export interface IDebugAdapterExecutableOptions {
	cwd?: string;
	env?: { [key: string]: string };
}

export interface IDebugAdapterExecutable {
	readonly type: 'executable';
	readonly command: string;
	readonly args: string[];
	readonly options?: IDebugAdapterExecutableOptions;
}

export interface IDebugAdapterServer {
	readonly type: 'server';
	readonly port: number;
	readonly host?: string;
}

export interface IDebugAdapterNamedPipeServer {
	readonly type: 'pipeServer';
	readonly path: string;
}

export interface IDebugAdapterInlineImpl extends IDisposable {
	readonly onDidSendMessage: Event<DebugProtocol.Message>;
	handleMessage(message: DebugProtocol.Message): void;
}

export interface IDebugAdapterImpl {
	readonly type: 'implementation';
}

export type IAdapterDescriptor = IDebugAdapterExecutable | IDebugAdapterServer | IDebugAdapterNamedPipeServer | IDebugAdapterImpl;

export interface IPlatformSpecificAdapterContribution {
	program?: string;
	args?: string[];
	runtime?: string;
	runtimeArgs?: string[];
}

export interface IDebuggerContribution extends IPlatformSpecificAdapterContribution {
	type: string;
	label?: string;
	win?: IPlatformSpecificAdapterContribution;
	winx86?: IPlatformSpecificAdapterContribution;
	windows?: IPlatformSpecificAdapterContribution;
	osx?: IPlatformSpecificAdapterContribution;
	linux?: IPlatformSpecificAdapterContribution;

	// internal
	aiKey?: string;

	// supported languages
	languages?: string[];

	// debug configuration support
	configurationAttributes?: Record<string, IJSONSchema>;
	initialConfigurations?: unknown[];
	configurationSnippets?: IJSONSchemaSnippet[];
	variables?: { [key: string]: string };
	when?: string;
	hiddenWhen?: string;
	deprecated?: string;
	strings?: { [key in DebuggerString]: string };
	/** @deprecated */
	uiMessages?: { [key in DebuggerString]: string };
}

export interface IBreakpointContribution {
	language: string;
	when?: string;
}

export enum DebugConfigurationProviderTriggerKind {
	/**
	 *	`DebugConfigurationProvider.provideDebugConfigurations` is called to provide the initial debug configurations for a newly created launch.json.
	 */
	Initial = 1,
	/**
	 * `DebugConfigurationProvider.provideDebugConfigurations` is called to provide dynamically generated debug configurations when the user asks for them through the UI (e.g. via the "Select and Start Debugging" command).
	 */
	Dynamic = 2
}

export interface IDebugConfigurationProvider {
	readonly type: string;
	readonly triggerKind: DebugConfigurationProviderTriggerKind;
	resolveDebugConfiguration?(folderUri: uri | undefined, debugConfiguration: IConfig, token: CancellationToken): Promise<IConfig | null | undefined>;
	resolveDebugConfigurationWithSubstitutedVariables?(folderUri: uri | undefined, debugConfiguration: IConfig, token: CancellationToken): Promise<IConfig | null | undefined>;
	provideDebugConfigurations?(folderUri: uri | undefined, token: CancellationToken): Promise<IConfig[]>;
}

export interface IDebugAdapterDescriptorFactory {
	readonly type: string;
	createDebugAdapterDescriptor(session: IDebugSession): Promise<IAdapterDescriptor>;
}

interface ITerminalLauncher {
	runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined>;
}

export interface IConfigurationManager {

	/**
	 * Returns an object containing the selected launch configuration and the selected configuration name. Both these fields can be null (no folder workspace).
	 */
	readonly selectedConfiguration: {
		launch: ILaunch | undefined;
		// Potentially activates extensions
		getConfig: () => Promise<IConfig | undefined>;
		name: string | undefined;
		// Type is used when matching dynamic configurations to their corresponding provider
		type: string | undefined;
	};

	selectConfiguration(launch: ILaunch | undefined, name?: string, config?: IConfig, dynamicConfigOptions?: { type?: string }): Promise<void>;

	getLaunches(): ReadonlyArray<ILaunch>;
	getLaunch(workspaceUri: uri | undefined): ILaunch | undefined;
	getAllConfigurations(): { launch: ILaunch; name: string; presentation?: IConfigPresentation }[];
	removeRecentDynamicConfigurations(name: string, type: string): void;
	getRecentDynamicConfigurations(): { name: string; type: string }[];

	/**
	 * Allows to register on change of selected debug configuration.
	 */
	readonly onDidSelectConfiguration: Event<void>;

	/**
	 * Allows to register on change of selected debug configuration.
	 */
	readonly onDidChangeConfigurationProviders: Event<void>;

	hasDebugConfigurationProvider(debugType: string, triggerKind?: DebugConfigurationProviderTriggerKind): boolean;
	getDynamicProviders(): Promise<{ label: string; type: string; pick: () => Promise<{ launch: ILaunch; config: IConfig; label: string } | undefined> }[]>;
	getDynamicConfigurationsByType(type: string, token?: CancellationToken): Promise<{ launch: ILaunch; config: IConfig; label: string }[]>;

	registerDebugConfigurationProvider(debugConfigurationProvider: IDebugConfigurationProvider): IDisposable;
	unregisterDebugConfigurationProvider(debugConfigurationProvider: IDebugConfigurationProvider): void;

	resolveConfigurationByProviders(folderUri: uri | undefined, type: string | undefined, debugConfiguration: unknown, token: CancellationToken): Promise<IConfig | null | undefined>;
}

export enum DebuggerString {
	UnverifiedBreakpoints = 'unverifiedBreakpoints'
}

export interface IAdapterManager {

	readonly onDidRegisterDebugger: Event<void>;

	hasEnabledDebuggers(): boolean;
	getDebugAdapterDescriptor(session: IDebugSession): Promise<IAdapterDescriptor | undefined>;
	getDebuggerLabel(type: string): string | undefined;
	someDebuggerInterestedInLanguage(language: string): boolean;
	getDebugger(type: string): IDebuggerMetadata | undefined;

	activateDebuggers(activationEvent: string, debugType?: string): Promise<void>;
	registerDebugAdapterFactory(debugTypes: string[], debugAdapterFactory: IDebugAdapterFactory): IDisposable;
	createDebugAdapter(session: IDebugSession): IDebugAdapter | undefined;
	registerDebugAdapterDescriptorFactory(debugAdapterDescriptorFactory: IDebugAdapterDescriptorFactory): IDisposable;
	unregisterDebugAdapterDescriptorFactory(debugAdapterDescriptorFactory: IDebugAdapterDescriptorFactory): void;

	substituteVariables(debugType: string, folder: IWorkspaceFolder | undefined, config: IConfig): Promise<IConfig>;
	runInTerminal(debugType: string, args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined>;
	getEnabledDebugger(type: string): (IDebugger & IDebuggerMetadata) | undefined;
	guessDebugger(gettingConfigurations: boolean): Promise<IGuessedDebugger | undefined>;

	get onDidDebuggersExtPointRead(): Event<void>;
}

export interface IGuessedDebugger {
	debugger: IDebugger;
	withConfig?: {
		label: string;
		launch: ILaunch;
		config: IConfig;
	};
}

export interface ILaunch {

	/**
	 * Resource pointing to the launch.json this object is wrapping.
	 */
	readonly uri: uri;

	/**
	 * Name of the launch.
	 */
	readonly name: string;

	/**
	 * Workspace of the launch. Can be undefined.
	 */
	readonly workspace: IWorkspaceFolder | undefined;

	/**
	 * Should this launch be shown in the debug dropdown.
	 */
	readonly hidden: boolean;

	/**
	 * Returns a configuration with the specified name.
	 * Returns undefined if there is no configuration with the specified name.
	 */
	getConfiguration(name: string): IConfig | undefined;

	/**
	 * Returns a compound with the specified name.
	 * Returns undefined if there is no compound with the specified name.
	 */
	getCompound(name: string): ICompound | undefined;

	/**
	 * Returns the names of all configurations and compounds.
	 * Ignores configurations which are invalid.
	 */
	getConfigurationNames(ignoreCompoundsAndPresentation?: boolean): string[];

	/**
	 * Opens the launch.json file. Creates if it does not exist.
	 */
	openConfigFile(options: { preserveFocus: boolean; type?: string; suppressInitialConfigs?: boolean }, token?: CancellationToken): Promise<{ editor: IEditorPane | null; created: boolean }>;
}

// Debug service interfaces

export const IDebugService = createDecorator<IDebugService>('debugService');

export interface IDebugService {
	readonly _serviceBrand: undefined;

	/**
	 * Gets the current debug state.
	 */
	readonly state: State;

	readonly initializingOptions?: IDebugSessionOptions | undefined;

	/**
	 * Allows to register on debug state changes.
	 */
	readonly onDidChangeState: Event<State>;

	/**
	 * Allows to register on sessions about to be created (not yet fully initialised).
	 * This is fired exactly one time for any given session.
	 */
	readonly onWillNewSession: Event<IDebugSession>;

	/**
	 * Fired when a new debug session is started. This may fire multiple times
	 * for a single session due to restarts.
	 */
	readonly onDidNewSession: Event<IDebugSession>;

	/**
	 * Allows to register on end session events.
	 *
	 * Contains a boolean indicating whether the session will restart. If restart
	 * is true, the session should not considered to be dead yet.
	 */
	readonly onDidEndSession: Event<{ session: IDebugSession; restart: boolean }>;

	/**
	 * Gets the configuration manager.
	 */
	getConfigurationManager(): IConfigurationManager;

	/**
	 * Gets the adapter manager.
	 */
	getAdapterManager(): IAdapterManager;

	/**
	 * Sets the focused stack frame and evaluates all expressions against the newly focused stack frame,
	 */
	focusStackFrame(focusedStackFrame: IStackFrame | undefined, thread?: IThread, session?: IDebugSession, options?: { explicit?: boolean; preserveFocus?: boolean; sideBySide?: boolean; pinned?: boolean }): Promise<void>;

	/**
	 * Returns true if breakpoints can be set for a given editor model. Depends on mode.
	 */
	canSetBreakpointsIn(model: EditorIModel): boolean;

	/**
	 * Adds new breakpoints to the model for the file specified with the uri. Notifies debug adapter of breakpoint changes.
	 */
	addBreakpoints(uri: uri, rawBreakpoints: IBreakpointData[], ariaAnnounce?: boolean): Promise<IBreakpoint[]>;

	/**
	 * Updates the breakpoints.
	 */
	updateBreakpoints(originalUri: uri, data: Map<string, IBreakpointUpdateData>, sendOnResourceSaved: boolean): Promise<void>;

	/**
	 * Enables or disables all breakpoints. If breakpoint is passed only enables or disables the passed breakpoint.
	 * Notifies debug adapter of breakpoint changes.
	 */
	enableOrDisableBreakpoints(enable: boolean, breakpoint?: IEnablement): Promise<void>;

	/**
	 * Sets the global activated property for all breakpoints.
	 * Notifies debug adapter of breakpoint changes.
	 */
	setBreakpointsActivated(activated: boolean): Promise<void>;

	/**
	 * Removes all breakpoints. If id is passed only removes the breakpoint associated with that id.
	 * Notifies debug adapter of breakpoint changes.
	 */
	removeBreakpoints(id?: string | string[]): Promise<void>;

	/**
	 * Adds a new function breakpoint for the given name.
	 */
	addFunctionBreakpoint(opts?: IFunctionBreakpointOptions, id?: string): void;

	/**
	 * Updates an already existing function breakpoint.
	 * Notifies debug adapter of breakpoint changes.
	 */
	updateFunctionBreakpoint(id: string, update: { name?: string; hitCondition?: string; condition?: string }): Promise<void>;

	/**
	 * Removes all function breakpoints. If id is passed only removes the function breakpoint with the passed id.
	 * Notifies debug adapter of breakpoint changes.
	 */
	removeFunctionBreakpoints(id?: string): Promise<void>;

	/**
	 * Adds a new data breakpoint.
	 */
	addDataBreakpoint(opts: IDataBreakpointOptions): Promise<void>;

	/**
	 * Updates an already existing data breakpoint.
	 * Notifies debug adapter of breakpoint changes.
	 */
	updateDataBreakpoint(id: string, update: { hitCondition?: string; condition?: string }): Promise<void>;

	/**
	 * Removes all data breakpoints. If id is passed only removes the data breakpoint with the passed id.
	 * Notifies debug adapter of breakpoint changes.
	 */
	removeDataBreakpoints(id?: string): Promise<void>;

	/**
	 * Adds a new instruction breakpoint.
	 */
	addInstructionBreakpoint(opts: IInstructionBreakpointOptions): Promise<void>;

	/**
	 * Removes all instruction breakpoints. If address is passed only removes the instruction breakpoint with the passed address.
	 * The address should be the address string supplied by the debugger from the "Disassemble" request.
	 * Notifies debug adapter of breakpoint changes.
	 */
	removeInstructionBreakpoints(instructionReference?: string, offset?: number): Promise<void>;

	setExceptionBreakpointCondition(breakpoint: IExceptionBreakpoint, condition: string | undefined): Promise<void>;

	/**
	 * Creates breakpoints based on the sesison filter options. This will create
	 * disabled breakpoints (or enabled, if the filter indicates it's a default)
	 * for each filter provided in the session.
	 */
	setExceptionBreakpointsForSession(session: IDebugSession, filters: DebugProtocol.ExceptionBreakpointsFilter[]): void;

	/**
	 * Sends all breakpoints to the passed session.
	 * If session is not passed, sends all breakpoints to each session.
	 */
	sendAllBreakpoints(session?: IDebugSession): Promise<void>;

	/**
	 * Sends breakpoints of the given source to the passed session.
	 */
	sendBreakpoints(modelUri: uri, sourceModified?: boolean, session?: IDebugSession): Promise<void>;

	/**
	 * Adds a new watch expression and evaluates it against the debug adapter.
	 */
	addWatchExpression(name?: string): void;

	/**
	 * Renames a watch expression and evaluates it against the debug adapter.
	 */
	renameWatchExpression(id: string, newName: string): void;

	/**
	 * Moves a watch expression to a new possition. Used for reordering watch expressions.
	 */
	moveWatchExpression(id: string, position: number): void;

	/**
	 * Removes all watch expressions. If id is passed only removes the watch expression with the passed id.
	 */
	removeWatchExpressions(id?: string): void;

	/**
	 * Starts debugging. If the configOrName is not passed uses the selected configuration in the debug dropdown.
	 * Also saves all files, manages if compounds are present in the configuration
	 * and resolveds configurations via DebugConfigurationProviders.
	 *
	 * Returns true if the start debugging was successful. For compound launches, all configurations have to start successfully for it to return success.
	 * On errors the startDebugging will throw an error, however some error and cancelations are handled and in that case will simply return false.
	 */
	startDebugging(launch: ILaunch | undefined, configOrName?: IConfig | string, options?: IDebugSessionOptions, saveBeforeStart?: boolean): Promise<boolean>;

	/**
	 * Restarts a session or creates a new one if there is no active session.
	 */
	restartSession(session: IDebugSession, restartData?: unknown): Promise<void>;

	/**
	 * Stops the session. If no session is specified then all sessions are stopped.
	 */
	stopSession(session: IDebugSession | undefined, disconnect?: boolean, suspend?: boolean): Promise<void>;

	/**
	 * Makes unavailable all sources with the passed uri. Source will appear as grayed out in callstack view.
	 */
	sourceIsNotAvailable(uri: uri): void;

	/**
	 * Gets the current debug model.
	 */
	getModel(): IDebugModel;

	/**
	 * Gets the current view model.
	 */
	getViewModel(): IViewModel;

	/**
	 * Resumes execution and pauses until the given position is reached.
	 */
	runTo(uri: uri, lineNumber: number, column?: number): Promise<void>;
}

// Editor interfaces
export const enum BreakpointWidgetContext {
	CONDITION = 0,
	HIT_COUNT = 1,
	LOG_MESSAGE = 2,
	TRIGGER_POINT = 3
}

export interface IDebugEditorContribution extends editorCommon.IEditorContribution {
	showHover(range: Position, focus: boolean): Promise<void>;
	addLaunchConfiguration(): Promise<void>;
	closeExceptionWidget(): void;
}

export interface IBreakpointEditorContribution extends editorCommon.IEditorContribution {
	showBreakpointWidget(lineNumber: number, column: number | undefined, context?: BreakpointWidgetContext): void;
	closeBreakpointWidget(): void;
	getContextMenuActionsAtPosition(lineNumber: number, model: EditorIModel): IAction[];
}

export interface IReplConfiguration {
	readonly fontSize: number;
	readonly fontFamily: string;
	readonly lineHeight: number;
	readonly cssLineHeight: string;
	readonly backgroundColor: Color | undefined;
	readonly fontSizeForTwistie: number;
}

export interface IReplOptions {
	readonly replConfiguration: IReplConfiguration;
}

export interface IDebugVisualizationContext {
	variable: DebugProtocol.Variable;
	containerId?: number;
	frameId?: number;
	threadId: number;
	sessionId: string;
}

export const enum DebugVisualizationType {
	Command,
	Tree,
}

export type MainThreadDebugVisualization =
	| { type: DebugVisualizationType.Command }
	| { type: DebugVisualizationType.Tree; id: string };


export const enum DebugTreeItemCollapsibleState {
	None = 0,
	Collapsed = 1,
	Expanded = 2
}

export interface IDebugVisualizationTreeItem {
	id: number;
	label: string;
	description?: string;
	collapsibleState: DebugTreeItemCollapsibleState;
	contextValue?: string;
	canEdit?: boolean;
}

export namespace IDebugVisualizationTreeItem {
	export type Serialized = IDebugVisualizationTreeItem;
	export const deserialize = (v: Serialized): IDebugVisualizationTreeItem => v;
	export const serialize = (item: IDebugVisualizationTreeItem): Serialized => item;
}

export interface IDebugVisualization {
	id: number;
	name: string;
	iconPath: { light?: URI; dark: URI } | undefined;
	iconClass: string | undefined;
	visualization: MainThreadDebugVisualization | undefined;
}

export namespace IDebugVisualization {
	export interface Serialized {
		id: number;
		name: string;
		iconPath?: { light?: UriComponents; dark: UriComponents };
		iconClass?: string;
		visualization?: MainThreadDebugVisualization;
	}

	export const deserialize = (v: Serialized): IDebugVisualization => ({
		id: v.id,
		name: v.name,
		iconPath: v.iconPath && { light: URI.revive(v.iconPath.light), dark: URI.revive(v.iconPath.dark) },
		iconClass: v.iconClass,
		visualization: v.visualization,
	});

	export const serialize = (visualizer: IDebugVisualization): Serialized => visualizer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugAccessibilityAnnouncer.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugAccessibilityAnnouncer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDebugService } from './debug.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Expression } from './debugModel.js';

export class DebugWatchAccessibilityAnnouncer extends Disposable implements IWorkbenchContribution {
	static ID = 'workbench.contrib.debugWatchAccessibilityAnnouncer';
	private readonly _listener: MutableDisposable<IDisposable> = this._register(new MutableDisposable());
	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@ILogService private readonly _logService: ILogService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
		this._setListener();
		this._register(_configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('accessibility.debugWatchVariableAnnouncements')) {
				this._setListener();
			}
		}));
	}

	private _setListener(): void {
		const value = this._configurationService.getValue('accessibility.debugWatchVariableAnnouncements');
		if (value && !this._listener.value) {
			this._listener.value = this._debugService.getModel().onDidChangeWatchExpressionValue((e) => {
				if (!e || e.value === Expression.DEFAULT_VALUE) {
					return;
				}

				// TODO: get user feedback, perhaps setting to configure verbosity + whether value, name, neither, or both are announced
				this._accessibilityService.alert(`${e.name} = ${e.value}`);
				this._logService.trace(`debugAccessibilityAnnouncerValueChanged ${e.name} ${e.value}`);
			});
		} else {
			this._listener.clear();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugCompoundRoot.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugCompoundRoot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';

export class DebugCompoundRoot {
	private stopped = false;
	private stopEmitter = new Emitter<void>();

	onDidSessionStop = this.stopEmitter.event;

	sessionStopped(): void {
		if (!this.stopped) { // avoid sending extranous terminate events
			this.stopped = true;
			this.stopEmitter.fire();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI as uri } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { getMimeTypes } from '../../../../editor/common/services/languagesAssociations.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { DEBUG_SCHEME, IDebugService, IDebugSession } from './debug.js';
import { Source } from './debugSource.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { ErrorNoTelemetry } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

/**
 * Debug URI format
 *
 * a debug URI represents a Source object and the debug session where the Source comes from.
 *
 *       debug:arbitrary_path?session=123e4567-e89b-12d3-a456-426655440000&ref=1016
 *       \___/ \____________/ \__________________________________________/ \______/
 *         |          |                             |                          |
 *      scheme   source.path                    session id            source.reference
 *
 * the arbitrary_path and the session id are encoded with 'encodeURIComponent'
 *
 */
export class DebugContentProvider extends Disposable implements IWorkbenchContribution, ITextModelContentProvider {

	private static INSTANCE: DebugContentProvider;

	private readonly pendingUpdates = new Map<string, CancellationTokenSource>();

	constructor(
		@ITextModelService textModelResolverService: ITextModelService,
		@IDebugService private readonly debugService: IDebugService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService
	) {
		super();
		this._store.add(textModelResolverService.registerTextModelContentProvider(DEBUG_SCHEME, this));
		DebugContentProvider.INSTANCE = this;
	}

	override dispose(): void {
		this.pendingUpdates.forEach(cancellationSource => cancellationSource.dispose());
		super.dispose();
	}

	provideTextContent(resource: uri): Promise<ITextModel> | null {
		return this.createOrUpdateContentModel(resource, true);
	}

	/**
	 * Reload the model content of the given resource.
	 * If there is no model for the given resource, this method does nothing.
	 */
	static refreshDebugContent(resource: uri): void {
		DebugContentProvider.INSTANCE?.createOrUpdateContentModel(resource, false);
	}

	/**
	 * Create or reload the model content of the given resource.
	 */
	private createOrUpdateContentModel(resource: uri, createIfNotExists: boolean): Promise<ITextModel> | null {

		const model = this.modelService.getModel(resource);
		if (!model && !createIfNotExists) {
			// nothing to do
			return null;
		}

		let session: IDebugSession | undefined;

		if (resource.query) {
			const data = Source.getEncodedDebugData(resource);
			session = this.debugService.getModel().getSession(data.sessionId);
		}

		if (!session) {
			// fallback: use focused session
			session = this.debugService.getViewModel().focusedSession;
		}

		if (!session) {
			return Promise.reject(new ErrorNoTelemetry(localize('unable', "Unable to resolve the resource without a debug session")));
		}
		const createErrModel = (errMsg?: string) => {
			this.debugService.sourceIsNotAvailable(resource);
			const languageSelection = this.languageService.createById(PLAINTEXT_LANGUAGE_ID);
			const message = errMsg
				? localize('canNotResolveSourceWithError', "Could not load source '{0}': {1}.", resource.path, errMsg)
				: localize('canNotResolveSource', "Could not load source '{0}'.", resource.path);
			return this.modelService.createModel(message, languageSelection, resource);
		};

		return session.loadSource(resource).then(response => {

			if (response && response.body) {

				if (model) {

					const newContent = response.body.content;

					// cancel and dispose an existing update
					const cancellationSource = this.pendingUpdates.get(model.id);
					cancellationSource?.cancel();

					// create and keep update token
					const myToken = new CancellationTokenSource();
					this.pendingUpdates.set(model.id, myToken);

					// update text model
					return this.editorWorkerService.computeMoreMinimalEdits(model.uri, [{ text: newContent, range: model.getFullModelRange() }]).then(edits => {

						// remove token
						this.pendingUpdates.delete(model.id);

						if (!myToken.token.isCancellationRequested && edits && edits.length > 0) {
							// use the evil-edit as these models show in readonly-editor only
							model.applyEdits(edits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text)));
						}
						return model;
					});
				} else {
					// create text model
					const mime = response.body.mimeType || getMimeTypes(resource)[0];
					const languageSelection = this.languageService.createByMimeType(mime);
					return this.modelService.createModel(response.body.content, languageSelection, resource);
				}
			}

			return createErrModel();

		}, (err: DebugProtocol.ErrorResponse) => createErrModel(err.message));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { CONTEXT_DEBUG_PROTOCOL_VARIABLE_MENU_CONTEXT, CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT, CONTEXT_CAN_VIEW_MEMORY, CONTEXT_VARIABLE_IS_READONLY, CONTEXT_VARIABLE_TYPE, CONTEXT_DEBUG_TYPE } from './debug.js';
import { Variable } from './debugModel.js';


/**
 * Gets a context key overlay that has context for the given variable.
 */
export function getContextForVariable(parentContext: IContextKeyService, variable: Variable, additionalContext: [string, unknown][] = []) {
	const session = variable.getSession();
	const contextKeys: [string, unknown][] = [
		[CONTEXT_DEBUG_PROTOCOL_VARIABLE_MENU_CONTEXT.key, variable.variableMenuContext || ''],
		[CONTEXT_VARIABLE_EVALUATE_NAME_PRESENT.key, !!variable.evaluateName],
		[CONTEXT_CAN_VIEW_MEMORY.key, !!session?.capabilities.supportsReadMemoryRequest && variable.memoryReference !== undefined],
		[CONTEXT_VARIABLE_IS_READONLY.key, !!variable.presentationHint?.attributes?.includes('readOnly') || variable.presentationHint?.lazy],
		[CONTEXT_VARIABLE_TYPE.key, variable.type],
		[CONTEXT_DEBUG_TYPE.key, session?.configuration.type],
		...additionalContext,
	];

	return parentContext.createOverlay(contextKeys);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugger.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { isObject } from '../../../../base/common/types.js';
import { IJSONSchema, IJSONSchemaMap, IJSONSchemaSnippet } from '../../../../base/common/jsonSchema.js';
import { IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IConfig, IDebuggerContribution, IDebugAdapter, IDebugger, IDebugSession, IAdapterManager, IDebugService, debuggerDisabledMessage, IDebuggerMetadata, DebugConfigurationProviderTriggerKind } from './debug.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import * as ConfigurationResolverUtils from '../../../services/configurationResolver/common/configurationResolverUtils.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { URI } from '../../../../base/common/uri.js';
import { Schemas } from '../../../../base/common/network.js';
import { isDebuggerMainContribution } from './debugUtils.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ITelemetryEndpoint } from '../../../../platform/telemetry/common/telemetry.js';
import { cleanRemoteAuthority } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { filter } from '../../../../base/common/objects.js';

export class Debugger implements IDebugger, IDebuggerMetadata {

	private debuggerContribution: IDebuggerContribution;
	private mergedExtensionDescriptions: IExtensionDescription[] = [];
	private mainExtensionDescription: IExtensionDescription | undefined;

	private debuggerWhen: ContextKeyExpression | undefined;
	private debuggerHiddenWhen: ContextKeyExpression | undefined;

	constructor(
		private adapterManager: IAdapterManager,
		dbgContribution: IDebuggerContribution,
		extensionDescription: IExtensionDescription,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITextResourcePropertiesService private readonly resourcePropertiesService: ITextResourcePropertiesService,
		@IConfigurationResolverService private readonly configurationResolverService: IConfigurationResolverService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IDebugService private readonly debugService: IDebugService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		this.debuggerContribution = { type: dbgContribution.type };
		this.merge(dbgContribution, extensionDescription);

		this.debuggerWhen = typeof this.debuggerContribution.when === 'string' ? ContextKeyExpr.deserialize(this.debuggerContribution.when) : undefined;
		this.debuggerHiddenWhen = typeof this.debuggerContribution.hiddenWhen === 'string' ? ContextKeyExpr.deserialize(this.debuggerContribution.hiddenWhen) : undefined;
	}

	merge(otherDebuggerContribution: IDebuggerContribution, extensionDescription: IExtensionDescription): void {

		/**
		 * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
		 * if existing non-structured properties on the destination should be overwritten or not. Defaults to true (overwrite).
		 */
		function mixin(destination: any, source: any, overwrite: boolean, level = 0): any {

			if (!isObject(destination)) {
				return source;
			}

			if (isObject(source)) {
				Object.keys(source).forEach(key => {
					if (key !== '__proto__') {
						if (isObject(destination[key]) && isObject(source[key])) {
							mixin(destination[key], source[key], overwrite, level + 1);
						} else {
							if (key in destination) {
								if (overwrite) {
									if (level === 0 && key === 'type') {
										// don't merge the 'type' property
									} else {
										destination[key] = source[key];
									}
								}
							} else {
								destination[key] = source[key];
							}
						}
					}
				});
			}

			return destination;
		}

		// only if not already merged
		if (this.mergedExtensionDescriptions.indexOf(extensionDescription) < 0) {

			// remember all extensions that have been merged for this debugger
			this.mergedExtensionDescriptions.push(extensionDescription);

			// merge new debugger contribution into existing contributions (and don't overwrite values in built-in extensions)
			mixin(this.debuggerContribution, otherDebuggerContribution, extensionDescription.isBuiltin);

			// remember the extension that is considered the "main" debugger contribution
			if (isDebuggerMainContribution(otherDebuggerContribution)) {
				this.mainExtensionDescription = extensionDescription;
			}
		}
	}

	async startDebugging(configuration: IConfig, parentSessionId: string): Promise<boolean> {
		const parentSession = this.debugService.getModel().getSession(parentSessionId);
		return await this.debugService.startDebugging(undefined, configuration, { parentSession }, undefined);
	}

	async createDebugAdapter(session: IDebugSession): Promise<IDebugAdapter> {
		await this.adapterManager.activateDebuggers('onDebugAdapterProtocolTracker', this.type);
		const da = this.adapterManager.createDebugAdapter(session);
		if (da) {
			return Promise.resolve(da);
		}
		throw new Error(nls.localize('cannot.find.da', "Cannot find debug adapter for type '{0}'.", this.type));
	}

	async substituteVariables(folder: IWorkspaceFolder | undefined, config: IConfig): Promise<IConfig> {
		const substitutedConfig = await this.adapterManager.substituteVariables(this.type, folder, config);
		return await this.configurationResolverService.resolveWithInteractionReplace(folder, substitutedConfig, 'launch', this.variables, substitutedConfig.__configurationTarget);
	}

	runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined> {
		return this.adapterManager.runInTerminal(this.type, args, sessionId);
	}

	get label(): string {
		return this.debuggerContribution.label || this.debuggerContribution.type;
	}

	get type(): string {
		return this.debuggerContribution.type;
	}

	get variables(): { [key: string]: string } | undefined {
		return this.debuggerContribution.variables;
	}

	get configurationSnippets(): IJSONSchemaSnippet[] | undefined {
		return this.debuggerContribution.configurationSnippets;
	}

	get languages(): string[] | undefined {
		return this.debuggerContribution.languages;
	}

	get when(): ContextKeyExpression | undefined {
		return this.debuggerWhen;
	}

	get hiddenWhen(): ContextKeyExpression | undefined {
		return this.debuggerHiddenWhen;
	}

	get enabled() {
		return !this.debuggerWhen || this.contextKeyService.contextMatchesRules(this.debuggerWhen);
	}

	get isHiddenFromDropdown() {
		if (!this.debuggerHiddenWhen) {
			return false;
		}
		return this.contextKeyService.contextMatchesRules(this.debuggerHiddenWhen);
	}

	get strings() {
		return this.debuggerContribution.strings ?? this.debuggerContribution.uiMessages;
	}

	interestedInLanguage(languageId: string): boolean {
		return !!(this.languages && this.languages.indexOf(languageId) >= 0);
	}

	hasInitialConfiguration(): boolean {
		return !!this.debuggerContribution.initialConfigurations;
	}

	hasDynamicConfigurationProviders(): boolean {
		return this.debugService.getConfigurationManager().hasDebugConfigurationProvider(this.type, DebugConfigurationProviderTriggerKind.Dynamic);
	}

	hasConfigurationProvider(): boolean {
		return this.debugService.getConfigurationManager().hasDebugConfigurationProvider(this.type);
	}

	getInitialConfigurationContent(initialConfigs?: IConfig[]): Promise<string> {
		// at this point we got some configs from the package.json and/or from registered DebugConfigurationProviders
		let initialConfigurations = this.debuggerContribution.initialConfigurations || [];
		if (initialConfigs) {
			initialConfigurations = initialConfigurations.concat(initialConfigs);
		}

		const eol = this.resourcePropertiesService.getEOL(URI.from({ scheme: Schemas.untitled, path: '1' })) === '\r\n' ? '\r\n' : '\n';
		const configs = JSON.stringify(initialConfigurations, null, '\t').split('\n').map(line => '\t' + line).join(eol).trim();
		const comment1 = nls.localize('launch.config.comment1', "Use IntelliSense to learn about possible attributes.");
		const comment2 = nls.localize('launch.config.comment2', "Hover to view descriptions of existing attributes.");
		const comment3 = nls.localize('launch.config.comment3', "For more information, visit: {0}", 'https://go.microsoft.com/fwlink/?linkid=830387');

		let content = [
			'{',
			`\t// ${comment1}`,
			`\t// ${comment2}`,
			`\t// ${comment3}`,
			`\t"version": "0.2.0",`,
			`\t"configurations": ${configs}`,
			'}'
		].join(eol);

		// fix formatting
		const editorConfig = this.configurationService.getValue<any>();
		if (editorConfig.editor && editorConfig.editor.insertSpaces) {
			content = content.replace(new RegExp('\t', 'g'), ' '.repeat(editorConfig.editor.tabSize));
		}

		return Promise.resolve(content);
	}

	getMainExtensionDescriptor(): IExtensionDescription {
		return this.mainExtensionDescription || this.mergedExtensionDescriptions[0];
	}

	getCustomTelemetryEndpoint(): ITelemetryEndpoint | undefined {
		const aiKey = this.debuggerContribution.aiKey;
		if (!aiKey) {
			return undefined;
		}

		const sendErrorTelemtry = cleanRemoteAuthority(this.environmentService.remoteAuthority) !== 'other';
		return {
			id: `${this.getMainExtensionDescriptor().publisher}.${this.type}`,
			aiKey,
			sendErrorTelemetry: sendErrorTelemtry
		};
	}

	getSchemaAttributes(definitions: IJSONSchemaMap): IJSONSchema[] | null {

		if (!this.debuggerContribution.configurationAttributes) {
			return null;
		}

		// fill in the default configuration attributes shared by all adapters.
		return Object.entries(this.debuggerContribution.configurationAttributes).map(([request, attributes]) => {
			const definitionId = `${this.type}:${request}`;
			const platformSpecificDefinitionId = `${this.type}:${request}:platform`;
			const defaultRequired = ['name', 'type', 'request'];
			attributes.required = attributes.required && attributes.required.length ? defaultRequired.concat(attributes.required) : defaultRequired;
			attributes.additionalProperties = false;
			attributes.type = 'object';
			if (!attributes.properties) {
				attributes.properties = {};
			}
			const properties = attributes.properties;
			properties['type'] = {
				enum: [this.type],
				enumDescriptions: [this.label],
				description: nls.localize('debugType', "Type of configuration."),
				pattern: '^(?!node2)',
				deprecationMessage: this.debuggerContribution.deprecated || (this.enabled ? undefined : debuggerDisabledMessage(this.type)),
				doNotSuggest: !!this.debuggerContribution.deprecated,
				errorMessage: nls.localize('debugTypeNotRecognised', "The debug type is not recognized. Make sure that you have a corresponding debug extension installed and that it is enabled."),
				patternErrorMessage: nls.localize('node2NotSupported', "\"node2\" is no longer supported, use \"node\" instead and set the \"protocol\" attribute to \"inspector\".")
			};
			properties['request'] = {
				enum: [request],
				description: nls.localize('debugRequest', "Request type of configuration. Can be \"launch\" or \"attach\"."),
			};
			for (const prop in definitions['common'].properties) {
				properties[prop] = {
					$ref: `#/definitions/common/properties/${prop}`
				};
			}
			Object.keys(properties).forEach(name => {
				// Use schema allOf property to get independent error reporting #21113
				ConfigurationResolverUtils.applyDeprecatedVariableMessage(properties[name]);
			});

			definitions[definitionId] = { ...attributes };
			definitions[platformSpecificDefinitionId] = {
				type: 'object',
				additionalProperties: false,
				properties: filter(properties, key => key !== 'type' && key !== 'request' && key !== 'name')
			};

			// Don't add the OS props to the real attributes object so they don't show up in 'definitions'
			const attributesCopy = { ...attributes };
			attributesCopy.properties = {
				...properties,
				...{
					windows: {
						$ref: `#/definitions/${platformSpecificDefinitionId}`,
						description: nls.localize('debugWindowsConfiguration', "Windows specific launch configuration attributes."),
					},
					osx: {
						$ref: `#/definitions/${platformSpecificDefinitionId}`,
						description: nls.localize('debugOSXConfiguration', "OS X specific launch configuration attributes."),
					},
					linux: {
						$ref: `#/definitions/${platformSpecificDefinitionId}`,
						description: nls.localize('debugLinuxConfiguration', "Linux specific launch configuration attributes."),
					}
				}
			};

			return attributesCopy;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugLifecycle.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugLifecycle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugConfiguration, IDebugService } from './debug.js';
import { ILifecycleService, ShutdownReason } from '../../../services/lifecycle/common/lifecycle.js';

export class DebugLifecycle implements IWorkbenchContribution {
	private disposable: IDisposable;

	constructor(
		@ILifecycleService lifecycleService: ILifecycleService,
		@IDebugService private readonly debugService: IDebugService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IDialogService private readonly dialogService: IDialogService,
	) {
		this.disposable = lifecycleService.onBeforeShutdown(async e => e.veto(this.shouldVetoShutdown(e.reason), 'veto.debug'));
	}

	private shouldVetoShutdown(_reason: ShutdownReason): boolean | Promise<boolean> {
		const rootSessions = this.debugService.getModel().getSessions().filter(s => s.parentSession === undefined);
		if (rootSessions.length === 0) {
			return false;
		}

		const shouldConfirmOnExit = this.configurationService.getValue<IDebugConfiguration>('debug').confirmOnExit;
		if (shouldConfirmOnExit === 'never') {
			return false;
		}

		return this.showWindowCloseConfirmation(rootSessions.length);
	}

	public dispose() {
		return this.disposable.dispose();
	}

	private async showWindowCloseConfirmation(numSessions: number): Promise<boolean> {
		let message: string;
		if (numSessions === 1) {
			message = nls.localize('debug.debugSessionCloseConfirmationSingular', "There is an active debug session, are you sure you want to stop it?");
		} else {
			message = nls.localize('debug.debugSessionCloseConfirmationPlural', "There are active debug sessions, are you sure you want to stop them?");
		}
		const res = await this.dialogService.confirm({
			message,
			type: 'warning',
			primaryButton: nls.localize({ key: 'debug.stop', comment: ['&& denotes a mnemonic'] }, "&&Stop Debugging")
		});
		return !res.confirmed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/common/debugModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/common/debugModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { findLastIdx } from '../../../../base/common/arraysFind.js';
import { DeferredPromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { VSBuffer, decodeBase64, encodeBase64 } from '../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event, trackSetChanges } from '../../../../base/common/event.js';
import { stringHash } from '../../../../base/common/hash.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { mixin } from '../../../../base/common/objects.js';
import { autorun } from '../../../../base/common/observable.js';
import * as resources from '../../../../base/common/resources.js';
import { isString, isUndefinedOrNull } from '../../../../base/common/types.js';
import { URI, URI as uri } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import * as nls from '../../../../nls.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IEditorPane } from '../../../common/editor.js';
import { DEBUG_MEMORY_SCHEME, DataBreakpointSetType, DataBreakpointSource, DebugTreeItemCollapsibleState, IBaseBreakpoint, IBreakpoint, IBreakpointData, IBreakpointUpdateData, IBreakpointsChangeEvent, IDataBreakpoint, IDebugEvaluatePosition, IDebugModel, IDebugSession, IDebugVisualizationTreeItem, IEnablement, IExceptionBreakpoint, IExceptionInfo, IExpression, IExpressionContainer, IFunctionBreakpoint, IInstructionBreakpoint, IMemoryInvalidationEvent, IMemoryRegion, IRawModelUpdate, IRawStoppedDetails, IScope, IStackFrame, IThread, ITreeElement, MemoryRange, MemoryRangeType, State, isFrameDeemphasized } from './debug.js';
import { Source, UNKNOWN_SOURCE_LABEL, getUriFromSource } from './debugSource.js';
import { DebugStorage } from './debugStorage.js';
import { IDebugVisualizerService } from './debugVisualizers.js';
import { DisassemblyViewInput } from './disassemblyViewInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';

interface IDebugProtocolVariableWithContext extends DebugProtocol.Variable {
	__vscodeVariableMenuContext?: string;
}

export class ExpressionContainer implements IExpressionContainer {

	public static readonly allValues = new Map<string, string>();
	// Use chunks to support variable paging #9537
	private static readonly BASE_CHUNK_SIZE = 100;

	public type: string | undefined;
	public valueChanged = false;
	private _value: string = '';
	protected children?: Promise<IExpression[]>;

	constructor(
		protected session: IDebugSession | undefined,
		protected readonly threadId: number | undefined,
		private _reference: number | undefined,
		private readonly id: string,
		public namedVariables: number | undefined = 0,
		public indexedVariables: number | undefined = 0,
		public memoryReference: string | undefined = undefined,
		private startOfVariables: number | undefined = 0,
		public presentationHint: DebugProtocol.VariablePresentationHint | undefined = undefined,
		public valueLocationReference: number | undefined = undefined,
	) { }

	get reference(): number | undefined {
		return this._reference;
	}

	set reference(value: number | undefined) {
		this._reference = value;
		this.children = undefined; // invalidate children cache
	}

	async evaluateLazy(): Promise<void> {
		if (typeof this.reference === 'undefined') {
			return;
		}

		const response = await this.session!.variables(this.reference, this.threadId, undefined, undefined, undefined);
		if (!response || !response.body || !response.body.variables || response.body.variables.length !== 1) {
			return;
		}

		const dummyVar = response.body.variables[0];
		this.reference = dummyVar.variablesReference;
		this._value = dummyVar.value;
		this.namedVariables = dummyVar.namedVariables;
		this.indexedVariables = dummyVar.indexedVariables;
		this.memoryReference = dummyVar.memoryReference;
		this.presentationHint = dummyVar.presentationHint;
		this.valueLocationReference = dummyVar.valueLocationReference;
		// Also call overridden method to adopt subclass props
		this.adoptLazyResponse(dummyVar);
	}

	protected adoptLazyResponse(response: DebugProtocol.Variable): void {
	}

	getChildren(): Promise<IExpression[]> {
		if (!this.children) {
			this.children = this.doGetChildren();
		}

		return this.children;
	}

	private async doGetChildren(): Promise<IExpression[]> {
		if (!this.hasChildren) {
			return [];
		}

		if (!this.getChildrenInChunks) {
			return this.fetchVariables(undefined, undefined, undefined);
		}

		// Check if object has named variables, fetch them independent from indexed variables #9670
		const children = this.namedVariables ? await this.fetchVariables(undefined, undefined, 'named') : [];

		// Use a dynamic chunk size based on the number of elements #9774
		let chunkSize = ExpressionContainer.BASE_CHUNK_SIZE;
		while (!!this.indexedVariables && this.indexedVariables > chunkSize * ExpressionContainer.BASE_CHUNK_SIZE) {
			chunkSize *= ExpressionContainer.BASE_CHUNK_SIZE;
		}

		if (!!this.indexedVariables && this.indexedVariables > chunkSize) {
			// There are a lot of children, create fake intermediate values that represent chunks #9537
			const numberOfChunks = Math.ceil(this.indexedVariables / chunkSize);
			for (let i = 0; i < numberOfChunks; i++) {
				const start = (this.startOfVariables || 0) + i * chunkSize;
				const count = Math.min(chunkSize, this.indexedVariables - i * chunkSize);
				children.push(new Variable(this.session, this.threadId, this, this.reference, `[${start}..${start + count - 1}]`, '', '', undefined, count, undefined, { kind: 'virtual' }, undefined, undefined, true, start));
			}

			return children;
		}

		const variables = await this.fetchVariables(this.startOfVariables, this.indexedVariables, 'indexed');
		return children.concat(variables);
	}

	getId(): string {
		return this.id;
	}

	getSession(): IDebugSession | undefined {
		return this.session;
	}

	get value(): string {
		return this._value;
	}

	get hasChildren(): boolean {
		// only variables with reference > 0 have children.
		return !!this.reference && this.reference > 0 && !this.presentationHint?.lazy;
	}

	private async fetchVariables(start: number | undefined, count: number | undefined, filter: 'indexed' | 'named' | undefined): Promise<Variable[]> {
		try {
			const response = await this.session!.variables(this.reference || 0, this.threadId, filter, start, count);
			if (!response || !response.body || !response.body.variables) {
				return [];
			}

			const nameCount = new Map<string, number>();
			const vars = response.body.variables.filter(v => !!v).map((v: IDebugProtocolVariableWithContext) => {
				if (isString(v.value) && isString(v.name) && typeof v.variablesReference === 'number') {
					const count = nameCount.get(v.name) || 0;
					const idDuplicationIndex = count > 0 ? count.toString() : '';
					nameCount.set(v.name, count + 1);
					return new Variable(this.session, this.threadId, this, v.variablesReference, v.name, v.evaluateName, v.value, v.namedVariables, v.indexedVariables, v.memoryReference, v.presentationHint, v.type, v.__vscodeVariableMenuContext, true, 0, idDuplicationIndex, v.declarationLocationReference, v.valueLocationReference);
				}
				return new Variable(this.session, this.threadId, this, 0, '', undefined, nls.localize('invalidVariableAttributes', "Invalid variable attributes"), 0, 0, undefined, { kind: 'virtual' }, undefined, undefined, false);
			});

			if (this.session!.autoExpandLazyVariables) {
				await Promise.all(vars.map(v => v.presentationHint?.lazy && v.evaluateLazy()));
			}

			return vars;
		} catch (e) {
			return [new Variable(this.session, this.threadId, this, 0, '', undefined, e.message, 0, 0, undefined, { kind: 'virtual' }, undefined, undefined, false)];
		}
	}

	// The adapter explicitly sents the children count of an expression only if there are lots of children which should be chunked.
	private get getChildrenInChunks(): boolean {
		return !!this.indexedVariables;
	}

	set value(value: string) {
		this._value = value;
		this.valueChanged = !!ExpressionContainer.allValues.get(this.getId()) &&
			ExpressionContainer.allValues.get(this.getId()) !== Expression.DEFAULT_VALUE && ExpressionContainer.allValues.get(this.getId()) !== value;
		ExpressionContainer.allValues.set(this.getId(), value);
	}

	toString(): string {
		return this.value;
	}

	async evaluateExpression(
		expression: string,
		session: IDebugSession | undefined,
		stackFrame: IStackFrame | undefined,
		context: string,
		keepLazyVars = false,
		location?: IDebugEvaluatePosition,
	): Promise<boolean> {

		if (!session || (!stackFrame && context !== 'repl')) {
			this.value = context === 'repl' ? nls.localize('startDebugFirst', "Please start a debug session to evaluate expressions") : Expression.DEFAULT_VALUE;
			this.reference = 0;
			return false;
		}

		this.session = session;
		try {
			const response = await session.evaluate(expression, stackFrame ? stackFrame.frameId : undefined, context, location);

			if (response && response.body) {
				this.value = response.body.result || '';
				this.reference = response.body.variablesReference;
				this.namedVariables = response.body.namedVariables;
				this.indexedVariables = response.body.indexedVariables;
				this.memoryReference = response.body.memoryReference;
				this.type = response.body.type || this.type;
				this.presentationHint = response.body.presentationHint;
				this.valueLocationReference = response.body.valueLocationReference;

				if (!keepLazyVars && response.body.presentationHint?.lazy) {
					await this.evaluateLazy();
				}

				return true;
			}
			return false;
		} catch (e) {
			this.value = e.message || '';
			this.reference = 0;
			this.memoryReference = undefined;
			return false;
		}
	}
}

function handleSetResponse(expression: ExpressionContainer, response: DebugProtocol.SetVariableResponse | DebugProtocol.SetExpressionResponse | undefined): void {
	if (response && response.body) {
		expression.value = response.body.value || '';
		expression.type = response.body.type || expression.type;
		expression.reference = response.body.variablesReference;
		expression.namedVariables = response.body.namedVariables;
		expression.indexedVariables = response.body.indexedVariables;
		// todo @weinand: the set responses contain most properties, but not memory references. Should they?
	}
}

export class VisualizedExpression implements IExpression {
	public errorMessage?: string;
	private readonly id = generateUuid();

	evaluateLazy(): Promise<void> {
		return Promise.resolve();
	}
	getChildren(): Promise<IExpression[]> {
		return this.visualizer.getVisualizedChildren(this.session, this.treeId, this.treeItem.id);
	}

	getId(): string {
		return this.id;
	}

	get name() {
		return this.treeItem.label;
	}

	get value() {
		return this.treeItem.description || '';
	}

	get hasChildren() {
		return this.treeItem.collapsibleState !== DebugTreeItemCollapsibleState.None;
	}

	constructor(
		private readonly session: IDebugSession | undefined,
		private readonly visualizer: IDebugVisualizerService,
		public readonly treeId: string,
		public readonly treeItem: IDebugVisualizationTreeItem,
		public readonly original?: Variable,
	) { }

	public getSession(): IDebugSession | undefined {
		return this.session;
	}

	/** Edits the value, sets the {@link errorMessage} and returns false if unsuccessful */
	public async edit(newValue: string) {
		try {
			await this.visualizer.editTreeItem(this.treeId, this.treeItem, newValue);
			return true;
		} catch (e) {
			this.errorMessage = e.message;
			return false;
		}
	}
}

export class Expression extends ExpressionContainer implements IExpression {
	static readonly DEFAULT_VALUE = nls.localize('notAvailable', "not available");

	public available: boolean;

	private readonly _onDidChangeValue = new Emitter<IExpression>();
	public readonly onDidChangeValue: Event<IExpression> = this._onDidChangeValue.event;

	constructor(public name: string, id = generateUuid()) {
		super(undefined, undefined, 0, id);
		this.available = false;
		// name is not set if the expression is just being added
		// in that case do not set default value to prevent flashing #14499
		if (name) {
			this.value = Expression.DEFAULT_VALUE;
		}
	}

	async evaluate(session: IDebugSession | undefined, stackFrame: IStackFrame | undefined, context: string, keepLazyVars?: boolean, location?: IDebugEvaluatePosition): Promise<void> {
		const hadDefaultValue = this.value === Expression.DEFAULT_VALUE;
		this.available = await this.evaluateExpression(this.name, session, stackFrame, context, keepLazyVars, location);
		if (hadDefaultValue || this.valueChanged) {
			this._onDidChangeValue.fire(this);
		}
	}

	override toString(): string {
		return `${this.name}\n${this.value}`;
	}

	toJSON() {
		return {
			sessionId: this.getSession()?.getId(),
			variable: this.toDebugProtocolObject(),
		};
	}

	toDebugProtocolObject(): DebugProtocol.Variable {
		return {
			name: this.name,
			variablesReference: this.reference || 0,
			memoryReference: this.memoryReference,
			value: this.value,
			type: this.type,
			evaluateName: this.name
		};
	}

	async setExpression(value: string, stackFrame: IStackFrame): Promise<void> {
		if (!this.session) {
			return;
		}

		const response = await this.session.setExpression(stackFrame.frameId, this.name, value);
		handleSetResponse(this, response);
	}
}

export class Variable extends ExpressionContainer implements IExpression {

	// Used to show the error message coming from the adapter when setting the value #7807
	public errorMessage: string | undefined;

	constructor(
		session: IDebugSession | undefined,
		threadId: number | undefined,
		public readonly parent: IExpressionContainer,
		reference: number | undefined,
		public readonly name: string,
		public evaluateName: string | undefined,
		value: string | undefined,
		namedVariables: number | undefined,
		indexedVariables: number | undefined,
		memoryReference: string | undefined,
		presentationHint: DebugProtocol.VariablePresentationHint | undefined,
		type: string | undefined = undefined,
		public readonly variableMenuContext: string | undefined = undefined,
		public readonly available = true,
		startOfVariables = 0,
		idDuplicationIndex = '',
		public readonly declarationLocationReference: number | undefined = undefined,
		valueLocationReference: number | undefined = undefined,
	) {
		super(session, threadId, reference, `variable:${parent.getId()}:${name}:${idDuplicationIndex}`, namedVariables, indexedVariables, memoryReference, startOfVariables, presentationHint, valueLocationReference);
		this.value = value || '';
		this.type = type;
	}

	getThreadId() {
		return this.threadId;
	}

	async setVariable(value: string, stackFrame: IStackFrame): Promise<void> {
		if (!this.session) {
			return;
		}

		try {
			// Send out a setExpression for debug extensions that do not support set variables https://github.com/microsoft/vscode/issues/124679#issuecomment-869844437
			if (this.session.capabilities.supportsSetExpression && !this.session.capabilities.supportsSetVariable && this.evaluateName) {
				return this.setExpression(value, stackFrame);
			}

			const response = await this.session.setVariable((<ExpressionContainer>this.parent).reference, this.name, value);
			handleSetResponse(this, response);
		} catch (err) {
			this.errorMessage = err.message;
		}
	}

	async setExpression(value: string, stackFrame: IStackFrame): Promise<void> {
		if (!this.session || !this.evaluateName) {
			return;
		}

		const response = await this.session.setExpression(stackFrame.frameId, this.evaluateName, value);
		handleSetResponse(this, response);
	}

	override toString(): string {
		return this.name ? `${this.name}: ${this.value}` : this.value;
	}

	toJSON() {
		return {
			sessionId: this.getSession()?.getId(),
			container: this.parent instanceof Expression
				? { expression: this.parent.name }
				: (this.parent as (Variable | Scope)).toDebugProtocolObject(),
			variable: this.toDebugProtocolObject()
		};
	}

	protected override adoptLazyResponse(response: DebugProtocol.Variable): void {
		this.evaluateName = response.evaluateName;
	}

	toDebugProtocolObject(): DebugProtocol.Variable {
		return {
			name: this.name,
			variablesReference: this.reference || 0,
			memoryReference: this.memoryReference,
			value: this.value,
			type: this.type,
			evaluateName: this.evaluateName
		};
	}
}

export class Scope extends ExpressionContainer implements IScope {

	constructor(
		public readonly stackFrame: IStackFrame,
		id: number,
		public readonly name: string,
		reference: number,
		public expensive: boolean,
		namedVariables?: number,
		indexedVariables?: number,
		public readonly range?: IRange
	) {
		super(stackFrame.thread.session, stackFrame.thread.threadId, reference, `scope:${name}:${id}`, namedVariables, indexedVariables);
	}

	get childrenHaveBeenLoaded(): boolean {
		return !!this.children;
	}

	override toString(): string {
		return this.name;
	}

	toDebugProtocolObject(): DebugProtocol.Scope {
		return {
			name: this.name,
			variablesReference: this.reference || 0,
			expensive: this.expensive
		};
	}
}

export class ErrorScope extends Scope {

	constructor(
		stackFrame: IStackFrame,
		index: number,
		message: string,
	) {
		super(stackFrame, index, message, 0, false);
	}

	override toString(): string {
		return this.name;
	}
}

export class StackFrame implements IStackFrame {

	private scopes: Promise<Scope[]> | undefined;

	constructor(
		public readonly thread: Thread,
		public readonly frameId: number,
		public readonly source: Source,
		public readonly name: string,
		public readonly presentationHint: string | undefined,
		public readonly range: IRange,
		private readonly index: number,
		public readonly canRestart: boolean,
		public readonly instructionPointerReference?: string
	) { }

	getId(): string {
		return `stackframe:${this.thread.getId()}:${this.index}:${this.source.name}`;
	}

	getScopes(): Promise<IScope[]> {
		if (!this.scopes) {
			this.scopes = this.thread.session.scopes(this.frameId, this.thread.threadId).then(response => {
				if (!response || !response.body || !response.body.scopes) {
					return [];
				}

				const usedIds = new Set<number>();
				return response.body.scopes.map(rs => {
					// form the id based on the name and location so that it's the
					// same across multiple pauses to retain expansion state
					let id = 0;
					do {
						id = stringHash(`${rs.name}:${rs.line}:${rs.column}`, id);
					} while (usedIds.has(id));

					usedIds.add(id);
					return new Scope(this, id, rs.name, rs.variablesReference, rs.expensive, rs.namedVariables, rs.indexedVariables,
						rs.line && rs.column && rs.endLine && rs.endColumn ? new Range(rs.line, rs.column, rs.endLine, rs.endColumn) : undefined);

				});
			}, err => [new ErrorScope(this, 0, err.message)]);
		}

		return this.scopes;
	}

	async getMostSpecificScopes(range: IRange): Promise<IScope[]> {
		const scopes = await this.getScopes();
		const nonExpensiveScopes = scopes.filter(s => !s.expensive);
		const haveRangeInfo = nonExpensiveScopes.some(s => !!s.range);
		if (!haveRangeInfo) {
			return nonExpensiveScopes;
		}

		const scopesContainingRange = nonExpensiveScopes.filter(scope => scope.range && Range.containsRange(scope.range, range))
			.sort((first, second) => (first.range!.endLineNumber - first.range!.startLineNumber) - (second.range!.endLineNumber - second.range!.startLineNumber));
		return scopesContainingRange.length ? scopesContainingRange : nonExpensiveScopes;
	}

	restart(): Promise<void> {
		return this.thread.session.restartFrame(this.frameId, this.thread.threadId);
	}

	forgetScopes(): void {
		this.scopes = undefined;
	}

	toString(): string {
		const lineNumberToString = typeof this.range.startLineNumber === 'number' ? `:${this.range.startLineNumber}` : '';
		const sourceToString = `${this.source.inMemory ? this.source.name : this.source.uri.fsPath}${lineNumberToString}`;

		return sourceToString === UNKNOWN_SOURCE_LABEL ? this.name : `${this.name} (${sourceToString})`;
	}

	async openInEditor(editorService: IEditorService, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): Promise<IEditorPane | undefined> {
		const threadStopReason = this.thread.stoppedDetails?.reason;
		if (this.instructionPointerReference &&
			((threadStopReason === 'instruction breakpoint' && !preserveFocus) ||
				(threadStopReason === 'step' && this.thread.lastSteppingGranularity === 'instruction' && !preserveFocus) ||
				editorService.activeEditor instanceof DisassemblyViewInput)) {
			return editorService.openEditor(DisassemblyViewInput.instance, { pinned: true, revealIfOpened: true, preserveFocus });
		}

		if (this.source.available) {
			return this.source.openInEditor(editorService, this.range, preserveFocus, sideBySide, pinned);
		}
		return undefined;
	}

	equals(other: IStackFrame): boolean {
		return (this.name === other.name) && (other.thread === this.thread) && (this.frameId === other.frameId) && (other.source === this.source) && (Range.equalsRange(this.range, other.range));
	}
}

const KEEP_SUBTLE_FRAME_AT_TOP_REASONS: readonly string[] = ['breakpoint', 'step', 'function breakpoint'];

export class Thread implements IThread {
	private callStack: IStackFrame[];
	private staleCallStack: IStackFrame[];
	private callStackCancellationTokens: CancellationTokenSource[] = [];
	public stoppedDetails: IRawStoppedDetails | undefined;
	public stopped: boolean;
	public reachedEndOfCallStack = false;
	public lastSteppingGranularity: DebugProtocol.SteppingGranularity | undefined;

	constructor(public readonly session: IDebugSession, public name: string, public readonly threadId: number) {
		this.callStack = [];
		this.staleCallStack = [];
		this.stopped = false;
	}

	getId(): string {
		return `thread:${this.session.getId()}:${this.threadId}`;
	}

	clearCallStack(): void {
		if (this.callStack.length) {
			this.staleCallStack = this.callStack;
		}
		this.callStack = [];
		this.callStackCancellationTokens.forEach(c => c.dispose(true));
		this.callStackCancellationTokens = [];
	}

	getCallStack(): IStackFrame[] {
		return this.callStack;
	}

	getStaleCallStack(): ReadonlyArray<IStackFrame> {
		return this.staleCallStack;
	}

	getTopStackFrame(): IStackFrame | undefined {
		const callStack = this.getCallStack();
		const stopReason = this.stoppedDetails?.reason;
		// Allow stack frame without source and with instructionReferencePointer as top stack frame when using disassembly view.
		const firstAvailableStackFrame = callStack.find(sf => !!(
			((stopReason === 'instruction breakpoint' || (stopReason === 'step' && this.lastSteppingGranularity === 'instruction')) && sf.instructionPointerReference) ||
			(sf.source && sf.source.available && (KEEP_SUBTLE_FRAME_AT_TOP_REASONS.includes(stopReason!) || !isFrameDeemphasized(sf)))));
		return firstAvailableStackFrame;
	}

	get stateLabel(): string {
		if (this.stoppedDetails) {
			return this.stoppedDetails.description ||
				(this.stoppedDetails.reason ? nls.localize({ key: 'pausedOn', comment: ['indicates reason for program being paused'] }, "Paused on {0}", this.stoppedDetails.reason) : nls.localize('paused', "Paused"));
		}

		return nls.localize({ key: 'running', comment: ['indicates state'] }, "Running");
	}

	/**
	 * Queries the debug adapter for the callstack and returns a promise
	 * which completes once the call stack has been retrieved.
	 * If the thread is not stopped, it returns a promise to an empty array.
	 * Only fetches the first stack frame for performance reasons. Calling this method consecutive times
	 * gets the remainder of the call stack.
	 */
	async fetchCallStack(levels = 20): Promise<void> {
		if (this.stopped) {
			const start = this.callStack.length;
			const callStack = await this.getCallStackImpl(start, levels);
			this.reachedEndOfCallStack = callStack.length < levels;
			if (start < this.callStack.length) {
				// Set the stack frames for exact position we requested. To make sure no concurrent requests create duplicate stack frames #30660
				this.callStack.splice(start, this.callStack.length - start);
			}
			this.callStack = this.callStack.concat(callStack || []);
			if (typeof this.stoppedDetails?.totalFrames === 'number' && this.stoppedDetails.totalFrames === this.callStack.length) {
				this.reachedEndOfCallStack = true;
			}
		}
	}

	private async getCallStackImpl(startFrame: number, levels: number): Promise<IStackFrame[]> {
		try {
			const tokenSource = new CancellationTokenSource();
			this.callStackCancellationTokens.push(tokenSource);
			const response = await this.session.stackTrace(this.threadId, startFrame, levels, tokenSource.token);
			if (!response || !response.body || tokenSource.token.isCancellationRequested) {
				return [];
			}

			if (this.stoppedDetails) {
				this.stoppedDetails.totalFrames = response.body.totalFrames;
			}

			return response.body.stackFrames.map((rsf, index) => {
				const source = this.session.getSource(rsf.source);

				return new StackFrame(this, rsf.id, source, rsf.name, rsf.presentationHint, new Range(
					rsf.line,
					rsf.column,
					rsf.endLine || rsf.line,
					rsf.endColumn || rsf.column
				), startFrame + index, typeof rsf.canRestart === 'boolean' ? rsf.canRestart : true, rsf.instructionPointerReference);
			});
		} catch (err) {
			if (this.stoppedDetails) {
				this.stoppedDetails.framesErrorMessage = err.message;
			}

			return [];
		}
	}

	/**
	 * Returns exception info promise if the exception was thrown, otherwise undefined
	 */
	get exceptionInfo(): Promise<IExceptionInfo | undefined> {
		if (this.stoppedDetails && this.stoppedDetails.reason === 'exception') {
			if (this.session.capabilities.supportsExceptionInfoRequest) {
				return this.session.exceptionInfo(this.threadId);
			}
			return Promise.resolve({
				description: this.stoppedDetails.text,
				breakMode: null
			});
		}
		return Promise.resolve(undefined);
	}

	next(granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		return this.session.next(this.threadId, granularity);
	}

	stepIn(granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		return this.session.stepIn(this.threadId, undefined, granularity);
	}

	stepOut(granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		return this.session.stepOut(this.threadId, granularity);
	}

	stepBack(granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		return this.session.stepBack(this.threadId, granularity);
	}

	continue(): Promise<void> {
		return this.session.continue(this.threadId);
	}

	pause(): Promise<void> {
		return this.session.pause(this.threadId);
	}

	terminate(): Promise<void> {
		return this.session.terminateThreads([this.threadId]);
	}

	reverseContinue(): Promise<void> {
		return this.session.reverseContinue(this.threadId);
	}
}

/**
 * Gets a URI to a memory in the given session ID.
 */
export const getUriForDebugMemory = (
	sessionId: string,
	memoryReference: string,
	range?: { fromOffset: number; toOffset: number },
	displayName = 'memory'
) => {
	return URI.from({
		scheme: DEBUG_MEMORY_SCHEME,
		authority: sessionId,
		path: '/' + encodeURIComponent(memoryReference) + `/${encodeURIComponent(displayName)}.bin`,
		query: range ? `?range=${range.fromOffset}:${range.toOffset}` : undefined,
	});
};

export class MemoryRegion extends Disposable implements IMemoryRegion {
	private readonly invalidateEmitter = this._register(new Emitter<IMemoryInvalidationEvent>());

	/** @inheritdoc */
	public readonly onDidInvalidate = this.invalidateEmitter.event;

	/** @inheritdoc */
	public readonly writable: boolean;

	constructor(private readonly memoryReference: string, private readonly session: IDebugSession) {
		super();
		this.writable = !!this.session.capabilities.supportsWriteMemoryRequest;
		this._register(session.onDidInvalidateMemory(e => {
			if (e.body.memoryReference === memoryReference) {
				this.invalidate(e.body.offset, e.body.count - e.body.offset);
			}
		}));
	}

	public async read(fromOffset: number, toOffset: number): Promise<MemoryRange[]> {
		const length = toOffset - fromOffset;
		const offset = fromOffset;
		const result = await this.session.readMemory(this.memoryReference, offset, length);

		if (result === undefined || !result.body?.data) {
			return [{ type: MemoryRangeType.Unreadable, offset, length }];
		}

		let data: VSBuffer;
		try {
			data = decodeBase64(result.body.data);
		} catch {
			return [{ type: MemoryRangeType.Error, offset, length, error: 'Invalid base64 data from debug adapter' }];
		}

		const unreadable = result.body.unreadableBytes || 0;
		const dataLength = length - unreadable;
		if (data.byteLength < dataLength) {
			const pad = VSBuffer.alloc(dataLength - data.byteLength);
			pad.buffer.fill(0);
			data = VSBuffer.concat([data, pad], dataLength);
		} else if (data.byteLength > dataLength) {
			data = data.slice(0, dataLength);
		}

		if (!unreadable) {
			return [{ type: MemoryRangeType.Valid, offset, length, data }];
		}

		return [
			{ type: MemoryRangeType.Valid, offset, length: dataLength, data },
			{ type: MemoryRangeType.Unreadable, offset: offset + dataLength, length: unreadable },
		];
	}

	public async write(offset: number, data: VSBuffer): Promise<number> {
		const result = await this.session.writeMemory(this.memoryReference, offset, encodeBase64(data), true);
		const written = result?.body?.bytesWritten ?? data.byteLength;
		this.invalidate(offset, offset + written);
		return written;
	}

	public override dispose() {
		super.dispose();
	}

	private invalidate(fromOffset: number, toOffset: number) {
		this.invalidateEmitter.fire({ fromOffset, toOffset });
	}
}

export class Enablement implements IEnablement {
	constructor(
		public enabled: boolean,
		private readonly id: string
	) { }

	getId(): string {
		return this.id;
	}
}

interface IBreakpointSessionData extends DebugProtocol.Breakpoint {
	supportsConditionalBreakpoints: boolean;
	supportsHitConditionalBreakpoints: boolean;
	supportsLogPoints: boolean;
	supportsFunctionBreakpoints: boolean;
	supportsDataBreakpoints: boolean;
	supportsInstructionBreakpoints: boolean;
	sessionId: string;
}

function toBreakpointSessionData(data: DebugProtocol.Breakpoint, capabilities: DebugProtocol.Capabilities): IBreakpointSessionData {
	return mixin({
		supportsConditionalBreakpoints: !!capabilities.supportsConditionalBreakpoints,
		supportsHitConditionalBreakpoints: !!capabilities.supportsHitConditionalBreakpoints,
		supportsLogPoints: !!capabilities.supportsLogPoints,
		supportsFunctionBreakpoints: !!capabilities.supportsFunctionBreakpoints,
		supportsDataBreakpoints: !!capabilities.supportsDataBreakpoints,
		supportsInstructionBreakpoints: !!capabilities.supportsInstructionBreakpoints
	}, data);
}

export interface IBaseBreakpointOptions {
	enabled?: boolean;
	hitCondition?: string;
	condition?: string;
	logMessage?: string;
	mode?: string;
	modeLabel?: string;
}

export abstract class BaseBreakpoint extends Enablement implements IBaseBreakpoint {

	private sessionData = new Map<string, IBreakpointSessionData>();
	protected data: IBreakpointSessionData | undefined;
	public hitCondition: string | undefined;
	public condition: string | undefined;
	public logMessage: string | undefined;
	public mode: string | undefined;
	public modeLabel: string | undefined;

	constructor(
		id: string,
		opts: IBaseBreakpointOptions
	) {
		super(opts.enabled ?? true, id);
		this.condition = opts.condition;
		this.hitCondition = opts.hitCondition;
		this.logMessage = opts.logMessage;
		this.mode = opts.mode;
		this.modeLabel = opts.modeLabel;
	}

	setSessionData(sessionId: string, data: IBreakpointSessionData | undefined): void {
		if (!data) {
			this.sessionData.delete(sessionId);
		} else {
			data.sessionId = sessionId;
			this.sessionData.set(sessionId, data);
		}

		const allData = Array.from(this.sessionData.values());
		const verifiedData = distinct(allData.filter(d => d.verified), d => `${d.line}:${d.column}`);
		if (verifiedData.length) {
			// In case multiple session verified the breakpoint and they provide different data show the intial data that the user set (corner case)
			this.data = verifiedData.length === 1 ? verifiedData[0] : undefined;
		} else {
			// No session verified the breakpoint
			this.data = allData.length ? allData[0] : undefined;
		}
	}

	get message(): string | undefined {
		if (!this.data) {
			return undefined;
		}

		return this.data.message;
	}

	get verified(): boolean {
		return this.data ? this.data.verified : true;
	}

	get sessionsThatVerified() {
		const sessionIds: string[] = [];
		for (const [sessionId, data] of this.sessionData) {
			if (data.verified) {
				sessionIds.push(sessionId);
			}
		}

		return sessionIds;
	}

	abstract get supported(): boolean;

	getIdFromAdapter(sessionId: string): number | undefined {
		const data = this.sessionData.get(sessionId);
		return data ? data.id : undefined;
	}

	getDebugProtocolBreakpoint(sessionId: string): DebugProtocol.Breakpoint | undefined {
		const data = this.sessionData.get(sessionId);
		if (data) {
			const bp: DebugProtocol.Breakpoint = {
				id: data.id,
				verified: data.verified,
				message: data.message,
				source: data.source,
				line: data.line,
				column: data.column,
				endLine: data.endLine,
				endColumn: data.endColumn,
				instructionReference: data.instructionReference,
				offset: data.offset
			};
			return bp;
		}
		return undefined;
	}

	toJSON(): IBaseBreakpointOptions & { id: string } {
		return {
			id: this.getId(),
			enabled: this.enabled,
			condition: this.condition,
			hitCondition: this.hitCondition,
			logMessage: this.logMessage,
			mode: this.mode,
			modeLabel: this.modeLabel,
		};
	}
}

export interface IBreakpointOptions extends IBaseBreakpointOptions {
	uri: uri;
	lineNumber: number;
	column: number | undefined;
	adapterData: unknown;
	triggeredBy: string | undefined;
}

export class Breakpoint extends BaseBreakpoint implements IBreakpoint {
	private sessionsDidTrigger?: Set<string>;
	private readonly _uri: uri;
	private _adapterData: unknown;
	private _lineNumber: number;
	private _column: number | undefined;
	public triggeredBy: string | undefined;

	constructor(
		opts: IBreakpointOptions,
		private readonly textFileService: ITextFileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
		id = generateUuid(),
	) {
		super(id, opts);
		this._uri = opts.uri;
		this._lineNumber = opts.lineNumber;
		this._column = opts.column;
		this._adapterData = opts.adapterData;
		this.triggeredBy = opts.triggeredBy;
	}

	toDAP(): DebugProtocol.SourceBreakpoint {
		return {
			line: this.sessionAgnosticData.lineNumber,
			column: this.sessionAgnosticData.column,
			condition: this.condition,
			hitCondition: this.hitCondition,
			logMessage: this.logMessage,
			mode: this.mode
		};
	}

	get originalUri() {
		return this._uri;
	}

	get lineNumber(): number {
		return this.verified && this.data && typeof this.data.line === 'number' ? this.data.line : this._lineNumber;
	}

	override get verified(): boolean {
		if (this.data) {
			return this.data.verified && !this.textFileService.isDirty(this._uri);
		}

		return true;
	}

	get pending(): boolean {
		if (this.data) {
			return false;
		}
		return this.triggeredBy !== undefined;
	}

	get uri(): uri {
		return this.verified && this.data && this.data.source ? getUriFromSource(this.data.source, this.data.source.path, this.data.sessionId, this.uriIdentityService, this.logService) : this._uri;
	}

	get column(): number | undefined {
		return this.verified && this.data && typeof this.data.column === 'number' ? this.data.column : this._column;
	}

	override get message(): string | undefined {
		if (this.textFileService.isDirty(this.uri)) {
			return nls.localize('breakpointDirtydHover', "Unverified breakpoint. File is modified, please restart debug session.");
		}

		return super.message;
	}

	get adapterData(): unknown {
		return this.data && this.data.source && this.data.source.adapterData ? this.data.source.adapterData : this._adapterData;
	}

	get endLineNumber(): number | undefined {
		return this.verified && this.data ? this.data.endLine : undefined;
	}

	get endColumn(): number | undefined {
		return this.verified && this.data ? this.data.endColumn : undefined;
	}

	get sessionAgnosticData(): { lineNumber: number; column: number | undefined } {
		return {
			lineNumber: this._lineNumber,
			column: this._column
		};
	}

	get supported(): boolean {
		if (!this.data) {
			return true;
		}
		if (this.logMessage && !this.data.supportsLogPoints) {
			return false;
		}
		if (this.condition && !this.data.supportsConditionalBreakpoints) {
			return false;
		}
		if (this.hitCondition && !this.data.supportsHitConditionalBreakpoints) {
			return false;
		}

		return true;
	}

	override setSessionData(sessionId: string, data: IBreakpointSessionData | undefined): void {
		super.setSessionData(sessionId, data);
		if (!this._adapterData) {
			this._adapterData = this.adapterData;
		}
	}

	override toJSON(): IBreakpointOptions & { id: string } {
		return {
			...super.toJSON(),
			uri: this._uri,
			lineNumber: this._lineNumber,
			column: this._column,
			adapterData: this.adapterData,
			triggeredBy: this.triggeredBy,
		};
	}

	override toString(): string {
		return `${resources.basenameOrAuthority(this.uri)} ${this.lineNumber}`;
	}

	public setSessionDidTrigger(sessionId: string, didTrigger = true): void {
		if (didTrigger) {
			this.sessionsDidTrigger ??= new Set();
			this.sessionsDidTrigger.add(sessionId);
		} else {
			this.sessionsDidTrigger?.delete(sessionId);
		}
	}

	public getSessionDidTrigger(sessionId: string): boolean {
		return !!this.sessionsDidTrigger?.has(sessionId);
	}

	update(data: IBreakpointUpdateData): void {
		if (data.hasOwnProperty('lineNumber') && !isUndefinedOrNull(data.lineNumber)) {
			this._lineNumber = data.lineNumber;
		}
		if (data.hasOwnProperty('column')) {
			this._column = data.column;
		}
		if (data.hasOwnProperty('condition')) {
			this.condition = data.condition;
		}
		if (data.hasOwnProperty('hitCondition')) {
			this.hitCondition = data.hitCondition;
		}
		if (data.hasOwnProperty('logMessage')) {
			this.logMessage = data.logMessage;
		}
		if (data.hasOwnProperty('mode')) {
			this.mode = data.mode;
			this.modeLabel = data.modeLabel;
		}
		if (data.hasOwnProperty('triggeredBy')) {
			this.triggeredBy = data.triggeredBy;
			this.sessionsDidTrigger = undefined;
		}
	}
}

export interface IFunctionBreakpointOptions extends IBaseBreakpointOptions {
	name: string;
}

export class FunctionBreakpoint extends BaseBreakpoint implements IFunctionBreakpoint {
	public name: string;

	constructor(
		opts: IFunctionBreakpointOptions,
		id = generateUuid()
	) {
		super(id, opts);
		this.name = opts.name;
	}

	toDAP(): DebugProtocol.FunctionBreakpoint {
		return {
			name: this.name,
			condition: this.condition,
			hitCondition: this.hitCondition,
		};
	}

	override toJSON(): IFunctionBreakpointOptions & { id: string } {
		return {
			...super.toJSON(),
			name: this.name,
		};
	}

	get supported(): boolean {
		if (!this.data) {
			return true;
		}

		return this.data.supportsFunctionBreakpoints;
	}

	override toString(): string {
		return this.name;
	}
}

export interface IDataBreakpointOptions extends IBaseBreakpointOptions {
	description: string;
	src: DataBreakpointSource;
	canPersist: boolean;
	initialSessionData?: { session: IDebugSession; dataId: string };
	accessTypes: DebugProtocol.DataBreakpointAccessType[] | undefined;
	accessType: DebugProtocol.DataBreakpointAccessType;
}

export class DataBreakpoint extends BaseBreakpoint implements IDataBreakpoint {
	private readonly sessionDataIdForAddr = new WeakMap<IDebugSession, string | null>();

	public readonly description: string;
	public readonly src: DataBreakpointSource;
	public readonly canPersist: boolean;
	public readonly accessTypes: DebugProtocol.DataBreakpointAccessType[] | undefined;
	public readonly accessType: DebugProtocol.DataBreakpointAccessType;

	constructor(
		opts: IDataBreakpointOptions,
		id = generateUuid()
	) {
		super(id, opts);
		this.description = opts.description;
		if ('dataId' in opts) { //  back compat with old saved variables in 1.87
			opts.src = { type: DataBreakpointSetType.Variable, dataId: opts.dataId as string };
		}
		this.src = opts.src;
		this.canPersist = opts.canPersist;
		this.accessTypes = opts.accessTypes;
		this.accessType = opts.accessType;
		if (opts.initialSessionData) {
			this.sessionDataIdForAddr.set(opts.initialSessionData.session, opts.initialSessionData.dataId);
		}
	}

	async toDAP(session: IDebugSession): Promise<DebugProtocol.DataBreakpoint | undefined> {
		let dataId: string;
		if (this.src.type === DataBreakpointSetType.Variable) {
			dataId = this.src.dataId;
		} else {
			let sessionDataId = this.sessionDataIdForAddr.get(session);
			if (!sessionDataId) {
				sessionDataId = (await session.dataBytesBreakpointInfo(this.src.address, this.src.bytes))?.dataId;
				if (!sessionDataId) {
					return undefined;
				}
				this.sessionDataIdForAddr.set(session, sessionDataId);
			}
			dataId = sessionDataId;
		}

		return {
			dataId,
			accessType: this.accessType,
			condition: this.condition,
			hitCondition: this.hitCondition,
		};
	}

	override toJSON(): IDataBreakpointOptions & { id: string } {
		return {
			...super.toJSON(),
			description: this.description,
			src: this.src,
			accessTypes: this.accessTypes,
			accessType: this.accessType,
			canPersist: this.canPersist,
		};
	}

	get supported(): boolean {
		if (!this.data) {
			return true;
		}

		return this.data.supportsDataBreakpoints;
	}

	override toString(): string {
		return this.description;
	}
}

export interface IExceptionBreakpointOptions extends IBaseBreakpointOptions {
	filter: string;
	label: string;
	supportsCondition: boolean;
	description: string | undefined;
	conditionDescription: string | undefined;
	fallback?: boolean;
}

export class ExceptionBreakpoint extends BaseBreakpoint implements IExceptionBreakpoint {

	private supportedSessions: Set<string> = new Set();

	public readonly filter: string;
	public readonly label: string;
	public readonly supportsCondition: boolean;
	public readonly description: string | undefined;
	public readonly conditionDescription: string | undefined;
	private fallback: boolean = false;

	constructor(
		opts: IExceptionBreakpointOptions,
		id = generateUuid(),
	) {
		super(id, opts);
		this.filter = opts.filter;
		this.label = opts.label;
		this.supportsCondition = opts.supportsCondition;
		this.description = opts.description;
		this.conditionDescription = opts.conditionDescription;
		this.fallback = opts.fallback || false;
	}

	override toJSON(): IExceptionBreakpointOptions & { id: string } {
		return {
			...super.toJSON(),
			filter: this.filter,
			label: this.label,
			enabled: this.enabled,
			supportsCondition: this.supportsCondition,
			conditionDescription: this.conditionDescription,
			condition: this.condition,
			fallback: this.fallback,
			description: this.description,
		};
	}

	setSupportedSession(sessionId: string, supported: boolean): void {
		if (supported) {
			this.supportedSessions.add(sessionId);
		}
		else {
			this.supportedSessions.delete(sessionId);
		}
	}

	/**
	 * Used to specify which breakpoints to show when no session is specified.
	 * Useful when no session is active and we want to show the exception breakpoints from the last session.
	 */
	setFallback(isFallback: boolean) {
		this.fallback = isFallback;
	}

	get supported(): boolean {
		return true;
	}

	/**
	 * Checks if the breakpoint is applicable for the specified session.
	 * If sessionId is undefined, returns true if this breakpoint is a fallback breakpoint.
	 */
	isSupportedSession(sessionId?: string): boolean {
		return sessionId ? this.supportedSessions.has(sessionId) : this.fallback;
	}

	matches(filter: DebugProtocol.ExceptionBreakpointsFilter) {
		return this.filter === filter.filter
			&& this.label === filter.label
			&& this.supportsCondition === !!filter.supportsCondition
			&& this.conditionDescription === filter.conditionDescription
			&& this.description === filter.description;
	}

	override toString(): string {
		return this.label;
	}
}

export interface IInstructionBreakpointOptions extends IBaseBreakpointOptions {
	instructionReference: string;
	offset: number;
	canPersist: boolean;
	address: bigint;
}

export class InstructionBreakpoint extends BaseBreakpoint implements IInstructionBreakpoint {
	public readonly instructionReference: string;
	public readonly offset: number;
	public readonly canPersist: boolean;
	public readonly address: bigint;

	constructor(
		opts: IInstructionBreakpointOptions,
		id = generateUuid()
	) {
		super(id, opts);
		this.instructionReference = opts.instructionReference;
		this.offset = opts.offset;
		this.canPersist = opts.canPersist;
		this.address = opts.address;
	}

	toDAP(): DebugProtocol.InstructionBreakpoint {
		return {
			instructionReference: this.instructionReference,
			condition: this.condition,
			hitCondition: this.hitCondition,
			mode: this.mode,
			offset: this.offset,
		};
	}

	override toJSON(): IInstructionBreakpointOptions & { id: string } {
		return {
			...super.toJSON(),
			instructionReference: this.instructionReference,
			offset: this.offset,
			canPersist: this.canPersist,
			address: this.address,
		};
	}

	get supported(): boolean {
		if (!this.data) {
			return true;
		}

		return this.data.supportsInstructionBreakpoints;
	}

	override toString(): string {
		return this.instructionReference;
	}
}

export class ThreadAndSessionIds implements ITreeElement {
	constructor(public sessionId: string, public threadId: number) { }

	getId(): string {
		return `${this.sessionId}:${this.threadId}`;
	}
}

interface IBreakpointModeInternal extends DebugProtocol.BreakpointMode {
	firstFromDebugType: string;
}

export class DebugModel extends Disposable implements IDebugModel {

	private sessions: IDebugSession[];
	private schedulers = new Map<string, { scheduler: RunOnceScheduler; completeDeferred: DeferredPromise<void> }>();
	private breakpointsActivated = true;
	private readonly _onDidChangeBreakpoints = this._register(new Emitter<IBreakpointsChangeEvent | undefined>());
	private readonly _onDidChangeCallStack = this._register(new Emitter<void>());
	private _onDidChangeCallStackFire = this._register(new RunOnceScheduler(() => {
		this._onDidChangeCallStack.fire(undefined);
	}, 100));
	private readonly _onDidChangeWatchExpressions = this._register(new Emitter<IExpression | undefined>());
	private readonly _onDidChangeWatchExpressionValue = this._register(new Emitter<IExpression | undefined>());
	private readonly _breakpointModes = new Map<string, IBreakpointModeInternal>();
	private breakpoints!: Breakpoint[];
	private functionBreakpoints!: FunctionBreakpoint[];
	private exceptionBreakpoints!: ExceptionBreakpoint[];
	private dataBreakpoints!: DataBreakpoint[];
	private watchExpressions!: Expression[];
	private instructionBreakpoints: InstructionBreakpoint[];

	constructor(
		debugStorage: DebugStorage,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this._register(autorun(reader => {
			this.breakpoints = debugStorage.breakpoints.read(reader);
			this.functionBreakpoints = debugStorage.functionBreakpoints.read(reader);
			this.exceptionBreakpoints = debugStorage.exceptionBreakpoints.read(reader);
			this.dataBreakpoints = debugStorage.dataBreakpoints.read(reader);
			this._onDidChangeBreakpoints.fire(undefined);
		}));

		this._register(autorun(reader => {
			this.watchExpressions = debugStorage.watchExpressions.read(reader);
			this._onDidChangeWatchExpressions.fire(undefined);
		}));

		this._register(trackSetChanges(
			() => new Set(this.watchExpressions),
			this.onDidChangeWatchExpressions,
			(we) => we.onDidChangeValue((e) => this._onDidChangeWatchExpressionValue.fire(e)))
		);

		this.instructionBreakpoints = [];
		this.sessions = [];
	}

	getId(): string {
		return 'root';
	}

	getSession(sessionId: string | undefined, includeInactive = false): IDebugSession | undefined {
		if (sessionId) {
			return this.getSessions(includeInactive).find(s => s.getId() === sessionId);
		}
		return undefined;
	}

	getSessions(includeInactive = false): IDebugSession[] {
		// By default do not return inactive sessions.
		// However we are still holding onto inactive sessions due to repl and debug service session revival (eh scenario)
		return this.sessions.filter(s => includeInactive || s.state !== State.Inactive);
	}

	addSession(session: IDebugSession): void {
		this.sessions = this.sessions.filter(s => {
			if (s.getId() === session.getId()) {
				// Make sure to de-dupe if a session is re-initialized. In case of EH debugging we are adding a session again after an attach.
				return false;
			}
			if (s.state === State.Inactive && s.configuration.name === session.configuration.name) {
				// Make sure to remove all inactive sessions that are using the same configuration as the new session
				s.dispose();
				return false;
			}

			return true;
		});

		let i = 1;
		while (this.sessions.some(s => s.getLabel() === session.getLabel())) {
			session.setName(`${session.configuration.name} ${++i}`);
		}

		let index = -1;
		if (session.parentSession) {
			// Make sure that child sessions are placed after the parent session
			index = findLastIdx(this.sessions, s => s.parentSession === session.parentSession || s === session.parentSession);
		}
		if (index >= 0) {
			this.sessions.splice(index + 1, 0, session);
		} else {
			this.sessions.push(session);
		}
		this._onDidChangeCallStack.fire(undefined);
	}

	get onDidChangeBreakpoints(): Event<IBreakpointsChangeEvent | undefined> {
		return this._onDidChangeBreakpoints.event;
	}

	get onDidChangeCallStack(): Event<void> {
		return this._onDidChangeCallStack.event;
	}

	get onDidChangeWatchExpressions(): Event<IExpression | undefined> {
		return this._onDidChangeWatchExpressions.event;
	}

	get onDidChangeWatchExpressionValue(): Event<IExpression | undefined> {
		return this._onDidChangeWatchExpressionValue.event;
	}

	rawUpdate(data: IRawModelUpdate): void {
		const session = this.sessions.find(p => p.getId() === data.sessionId);
		if (session) {
			session.rawUpdate(data);
			this._onDidChangeCallStack.fire(undefined);
		}
	}

	clearThreads(id: string, removeThreads: boolean, reference: number | undefined = undefined): void {
		const session = this.sessions.find(p => p.getId() === id);
		if (session) {
			let threads: IThread[];
			if (reference === undefined) {
				threads = session.getAllThreads();
			} else {
				const thread = session.getThread(reference);
				threads = thread !== undefined ? [thread] : [];
			}
			for (const thread of threads) {
				const threadId = thread.getId();
				const entry = this.schedulers.get(threadId);
				if (entry !== undefined) {
					entry.scheduler.dispose();
					entry.completeDeferred.complete();
					this.schedulers.delete(threadId);
				}
			}

			session.clearThreads(removeThreads, reference);
			if (!this._onDidChangeCallStackFire.isScheduled()) {
				this._onDidChangeCallStackFire.schedule();
			}
		}
	}

	/**
	 * Update the call stack and notify the call stack view that changes have occurred.
	 */
	async fetchCallstack(thread: IThread, levels?: number): Promise<void> {

		if ((<Thread>thread).reachedEndOfCallStack) {
			return;
		}

		const totalFrames = thread.stoppedDetails?.totalFrames;
		const remainingFrames = (typeof totalFrames === 'number') ? (totalFrames - thread.getCallStack().length) : undefined;

		if (!levels || (remainingFrames && levels > remainingFrames)) {
			levels = remainingFrames;
		}

		if (levels && levels > 0) {
			await (<Thread>thread).fetchCallStack(levels);
			this._onDidChangeCallStack.fire();
		}

		return;
	}

	refreshTopOfCallstack(thread: Thread, fetchFullStack = true): { topCallStack: Promise<void>; wholeCallStack: Promise<void> } {
		if (thread.session.capabilities.supportsDelayedStackTraceLoading) {
			// For improved performance load the first stack frame and then load the rest async.
			let topCallStack = Promise.resolve();
			const wholeCallStack = new Promise<void>((c, e) => {
				topCallStack = thread.fetchCallStack(1).then(() => {
					if (!fetchFullStack) {
						c();
						this._onDidChangeCallStack.fire();
						return;
					}

					if (!this.schedulers.has(thread.getId())) {
						const deferred = new DeferredPromise<void>();
						this.schedulers.set(thread.getId(), {
							completeDeferred: deferred,
							scheduler: new RunOnceScheduler(() => {
								thread.fetchCallStack(19).then(() => {
									const stale = thread.getStaleCallStack();
									const current = thread.getCallStack();
									let bottomOfCallStackChanged = stale.length !== current.length;
									for (let i = 1; i < stale.length && !bottomOfCallStackChanged; i++) {
										bottomOfCallStackChanged = !stale[i].equals(current[i]);
									}

									if (bottomOfCallStackChanged) {
										this._onDidChangeCallStack.fire();
									}
								}).finally(() => {
									deferred.complete();
									this.schedulers.delete(thread.getId());
								});
							}, 420)
						});
					}

					const entry = this.schedulers.get(thread.getId())!;
					entry.scheduler.schedule();
					entry.completeDeferred.p.then(c, e);
					this._onDidChangeCallStack.fire();
				});
			});

			return { topCallStack, wholeCallStack };
		}

		const wholeCallStack = thread.fetchCallStack();
		return { wholeCallStack, topCallStack: wholeCallStack };
	}

	getBreakpoints(filter?: { uri?: uri; originalUri?: uri; lineNumber?: number; column?: number; enabledOnly?: boolean; triggeredOnly?: boolean }): IBreakpoint[] {
		if (filter) {
			const uriStr = filter.uri?.toString();
			const originalUriStr = filter.originalUri?.toString();
			return this.breakpoints.filter(bp => {
				if (uriStr && bp.uri.toString() !== uriStr) {
					return false;
				}
				if (originalUriStr && bp.originalUri.toString() !== originalUriStr) {
					return false;
				}
				if (filter.lineNumber && bp.lineNumber !== filter.lineNumber) {
					return false;
				}
				if (filter.column && bp.column !== filter.column) {
					return false;
				}
				if (filter.enabledOnly && (!this.breakpointsActivated || !bp.enabled)) {
					return false;
				}
				if (filter.triggeredOnly && bp.triggeredBy === undefined) {
					return false;
				}

				return true;
			});
		}

		return this.breakpoints;
	}

	getFunctionBreakpoints(): IFunctionBreakpoint[] {
		return this.functionBreakpoints;
	}

	getDataBreakpoints(): IDataBreakpoint[] {
		return this.dataBreakpoints;
	}

	getExceptionBreakpoints(): IExceptionBreakpoint[] {
		return this.exceptionBreakpoints;
	}

	getExceptionBreakpointsForSession(sessionId?: string): IExceptionBreakpoint[] {
		return this.exceptionBreakpoints.filter(ebp => ebp.isSupportedSession(sessionId));
	}

	getInstructionBreakpoints(): IInstructionBreakpoint[] {
		return this.instructionBreakpoints;
	}

	setExceptionBreakpointsForSession(sessionId: string, filters: DebugProtocol.ExceptionBreakpointsFilter[]): void {
		if (!filters) {
			return;
		}

		let didChangeBreakpoints = false;
		filters.forEach((d) => {
			let ebp = this.exceptionBreakpoints.filter((exbp) => exbp.matches(d)).pop();

			if (!ebp) {
				didChangeBreakpoints = true;
				ebp = new ExceptionBreakpoint({
					filter: d.filter,
					label: d.label,
					enabled: !!d.default,
					supportsCondition: !!d.supportsCondition,
					description: d.description,
					conditionDescription: d.conditionDescription,
				});
				this.exceptionBreakpoints.push(ebp);
			}

			ebp.setSupportedSession(sessionId, true);
		});

		if (didChangeBreakpoints) {
			this._onDidChangeBreakpoints.fire(undefined);
		}
	}

	removeExceptionBreakpointsForSession(sessionId: string): void {
		this.exceptionBreakpoints.forEach(ebp => ebp.setSupportedSession(sessionId, false));
	}

	// Set last focused session as fallback session.
	// This is done to keep track of the exception breakpoints to show when no session is active.
	setExceptionBreakpointFallbackSession(sessionId: string): void {
		this.exceptionBreakpoints.forEach(ebp => ebp.setFallback(ebp.isSupportedSession(sessionId)));
	}

	setExceptionBreakpointCondition(exceptionBreakpoint: IExceptionBreakpoint, condition: string | undefined): void {
		(exceptionBreakpoint as ExceptionBreakpoint).condition = condition;
		this._onDidChangeBreakpoints.fire(undefined);
	}

	areBreakpointsActivated(): boolean {
		return this.breakpointsActivated;
	}

	setBreakpointsActivated(activated: boolean): void {
		this.breakpointsActivated = activated;
		this._onDidChangeBreakpoints.fire(undefined);
	}

	addBreakpoints(uri: uri, rawData: IBreakpointData[], fireEvent = true): IBreakpoint[] {
		const newBreakpoints = rawData.map(rawBp => {
			return new Breakpoint({
				uri,
				lineNumber: rawBp.lineNumber,
				column: rawBp.column,
				enabled: rawBp.enabled ?? true,
				condition: rawBp.condition,
				hitCondition: rawBp.hitCondition,
				logMessage: rawBp.logMessage,
				triggeredBy: rawBp.triggeredBy,
				adapterData: undefined,
				mode: rawBp.mode,
				modeLabel: rawBp.modeLabel,
			}, this.textFileService, this.uriIdentityService, this.logService, rawBp.id);
		});
		this.breakpoints = this.breakpoints.concat(newBreakpoints);
		this.breakpointsActivated = true;
		this.sortAndDeDup();

		if (fireEvent) {
			this._onDidChangeBreakpoints.fire({ added: newBreakpoints, sessionOnly: false });
		}

		return newBreakpoints;
	}

	removeBreakpoints(toRemove: IBreakpoint[]): void {
		this.breakpoints = this.breakpoints.filter(bp => !toRemove.some(toRemove => toRemove.getId() === bp.getId()));
		this._onDidChangeBreakpoints.fire({ removed: toRemove, sessionOnly: false });
	}

	updateBreakpoints(data: Map<string, IBreakpointUpdateData>): void {
		const updated: IBreakpoint[] = [];
		this.breakpoints.forEach(bp => {
			const bpData = data.get(bp.getId());
			if (bpData) {
				bp.update(bpData);
				updated.push(bp);
			}
		});
		this.sortAndDeDup();
		this._onDidChangeBreakpoints.fire({ changed: updated, sessionOnly: false });
	}

	setBreakpointSessionData(sessionId: string, capabilites: DebugProtocol.Capabilities, data: Map<string, DebugProtocol.Breakpoint> | undefined): void {
		this.breakpoints.forEach(bp => {
			if (!data) {
				bp.setSessionData(sessionId, undefined);
			} else {
				const bpData = data.get(bp.getId());
				if (bpData) {
					bp.setSessionData(sessionId, toBreakpointSessionData(bpData, capabilites));
				}
			}
		});
		this.functionBreakpoints.forEach(fbp => {
			if (!data) {
				fbp.setSessionData(sessionId, undefined);
			} else {
				const fbpData = data.get(fbp.getId());
				if (fbpData) {
					fbp.setSessionData(sessionId, toBreakpointSessionData(fbpData, capabilites));
				}
			}
		});
		this.dataBreakpoints.forEach(dbp => {
			if (!data) {
				dbp.setSessionData(sessionId, undefined);
			} else {
				const dbpData = data.get(dbp.getId());
				if (dbpData) {
					dbp.setSessionData(sessionId, toBreakpointSessionData(dbpData, capabilites));
				}
			}
		});
		this.exceptionBreakpoints.forEach(ebp => {
			if (!data) {
				ebp.setSessionData(sessionId, undefined);
			} else {
				const ebpData = data.get(ebp.getId());
				if (ebpData) {
					ebp.setSessionData(sessionId, toBreakpointSessionData(ebpData, capabilites));
				}
			}
		});
		this.instructionBreakpoints.forEach(ibp => {
			if (!data) {
				ibp.setSessionData(sessionId, undefined);
			} else {
				const ibpData = data.get(ibp.getId());
				if (ibpData) {
					ibp.setSessionData(sessionId, toBreakpointSessionData(ibpData, capabilites));
				}
			}
		});

		this._onDidChangeBreakpoints.fire({
			sessionOnly: true
		});
	}

	getDebugProtocolBreakpoint(breakpointId: string, sessionId: string): DebugProtocol.Breakpoint | undefined {
		const bp = this.breakpoints.find(bp => bp.getId() === breakpointId);
		if (bp) {
			return bp.getDebugProtocolBreakpoint(sessionId);
		}
		return undefined;
	}

	getBreakpointModes(forBreakpointType: 'source' | 'exception' | 'data' | 'instruction'): DebugProtocol.BreakpointMode[] {
		return [...this._breakpointModes.values()].filter(mode => mode.appliesTo.includes(forBreakpointType));
	}

	registerBreakpointModes(debugType: string, modes: DebugProtocol.BreakpointMode[]) {
		for (const mode of modes) {
			const key = `${mode.mode}/${mode.label}`;
			const rec = this._breakpointModes.get(key);
			if (rec) {
				for (const target of mode.appliesTo) {
					if (!rec.appliesTo.includes(target)) {
						rec.appliesTo.push(target);
					}
				}
			} else {
				const duplicate = [...this._breakpointModes.values()].find(r => r !== rec && r.label === mode.label);
				if (duplicate) {
					duplicate.label = `${duplicate.label} (${duplicate.firstFromDebugType})`;
				}

				this._breakpointModes.set(key, {
					mode: mode.mode,
					label: duplicate ? `${mode.label} (${debugType})` : mode.label,
					firstFromDebugType: debugType,
					description: mode.description,
					appliesTo: mode.appliesTo.slice(), // avoid later mutations
				});
			}
		}
	}

	private sortAndDeDup(): void {
		this.breakpoints = this.breakpoints.sort((first, second) => {
			if (first.uri.toString() !== second.uri.toString()) {
				return resources.basenameOrAuthority(first.uri).localeCompare(resources.basenameOrAuthority(second.uri));
			}
			if (first.lineNumber === second.lineNumber) {
				if (first.column && second.column) {
					return first.column - second.column;
				}
				return 1;
			}

			return first.lineNumber - second.lineNumber;
		});
		this.breakpoints = distinct(this.breakpoints, bp => `${bp.uri.toString()}:${bp.lineNumber}:${bp.column}`);
	}

	setEnablement(element: IEnablement, enable: boolean): void {
		if (element instanceof Breakpoint || element instanceof FunctionBreakpoint || element instanceof ExceptionBreakpoint || element instanceof DataBreakpoint || element instanceof InstructionBreakpoint) {
			const changed: Array<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint> = [];
			if (element.enabled !== enable && (element instanceof Breakpoint || element instanceof FunctionBreakpoint || element instanceof DataBreakpoint || element instanceof InstructionBreakpoint)) {
				changed.push(element);
			}

			element.enabled = enable;
			if (enable) {
				this.breakpointsActivated = true;
			}

			this._onDidChangeBreakpoints.fire({ changed: changed, sessionOnly: false });
		}
	}

	enableOrDisableAllBreakpoints(enable: boolean): void {
		const changed: Array<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint> = [];

		this.breakpoints.forEach(bp => {
			if (bp.enabled !== enable) {
				changed.push(bp);
			}
			bp.enabled = enable;
		});
		this.functionBreakpoints.forEach(fbp => {
			if (fbp.enabled !== enable) {
				changed.push(fbp);
			}
			fbp.enabled = enable;
		});
		this.dataBreakpoints.forEach(dbp => {
			if (dbp.enabled !== enable) {
				changed.push(dbp);
			}
			dbp.enabled = enable;
		});
		this.instructionBreakpoints.forEach(ibp => {
			if (ibp.enabled !== enable) {
				changed.push(ibp);
			}
			ibp.enabled = enable;
		});

		if (enable) {
			this.breakpointsActivated = true;
		}

		this._onDidChangeBreakpoints.fire({ changed: changed, sessionOnly: false });
	}

	addFunctionBreakpoint(opts: IFunctionBreakpointOptions, id?: string): IFunctionBreakpoint {
		const newFunctionBreakpoint = new FunctionBreakpoint(opts, id);
		this.functionBreakpoints.push(newFunctionBreakpoint);
		this._onDidChangeBreakpoints.fire({ added: [newFunctionBreakpoint], sessionOnly: false });

		return newFunctionBreakpoint;
	}

	updateFunctionBreakpoint(id: string, update: { name?: string; hitCondition?: string; condition?: string }): void {
		const functionBreakpoint = this.functionBreakpoints.find(fbp => fbp.getId() === id);
		if (functionBreakpoint) {
			if (typeof update.name === 'string') {
				functionBreakpoint.name = update.name;
			}
			if (typeof update.condition === 'string') {
				functionBreakpoint.condition = update.condition;
			}
			if (typeof update.hitCondition === 'string') {
				functionBreakpoint.hitCondition = update.hitCondition;
			}
			this._onDidChangeBreakpoints.fire({ changed: [functionBreakpoint], sessionOnly: false });
		}
	}

	removeFunctionBreakpoints(id?: string): void {
		let removed: FunctionBreakpoint[];
		if (id) {
			removed = this.functionBreakpoints.filter(fbp => fbp.getId() === id);
			this.functionBreakpoints = this.functionBreakpoints.filter(fbp => fbp.getId() !== id);
		} else {
			removed = this.functionBreakpoints;
			this.functionBreakpoints = [];
		}
		this._onDidChangeBreakpoints.fire({ removed, sessionOnly: false });
	}

	addDataBreakpoint(opts: IDataBreakpointOptions, id?: string): void {
		const newDataBreakpoint = new DataBreakpoint(opts, id);
		this.dataBreakpoints.push(newDataBreakpoint);
		this._onDidChangeBreakpoints.fire({ added: [newDataBreakpoint], sessionOnly: false });
	}

	updateDataBreakpoint(id: string, update: { hitCondition?: string; condition?: string }): void {
		const dataBreakpoint = this.dataBreakpoints.find(fbp => fbp.getId() === id);
		if (dataBreakpoint) {
			if (typeof update.condition === 'string') {
				dataBreakpoint.condition = update.condition;
			}
			if (typeof update.hitCondition === 'string') {
				dataBreakpoint.hitCondition = update.hitCondition;
			}
			this._onDidChangeBreakpoints.fire({ changed: [dataBreakpoint], sessionOnly: false });
		}
	}

	removeDataBreakpoints(id?: string): void {
		let removed: DataBreakpoint[];
		if (id) {
			removed = this.dataBreakpoints.filter(fbp => fbp.getId() === id);
			this.dataBreakpoints = this.dataBreakpoints.filter(fbp => fbp.getId() !== id);
		} else {
			removed = this.dataBreakpoints;
			this.dataBreakpoints = [];
		}
		this._onDidChangeBreakpoints.fire({ removed, sessionOnly: false });
	}

	addInstructionBreakpoint(opts: IInstructionBreakpointOptions): void {
		const newInstructionBreakpoint = new InstructionBreakpoint(opts);
		this.instructionBreakpoints.push(newInstructionBreakpoint);
		this._onDidChangeBreakpoints.fire({ added: [newInstructionBreakpoint], sessionOnly: true });
	}

	removeInstructionBreakpoints(instructionReference?: string, offset?: number): void {
		let removed: InstructionBreakpoint[] = [];
		if (instructionReference) {
			for (let i = 0; i < this.instructionBreakpoints.length; i++) {
				const ibp = this.instructionBreakpoints[i];
				if (ibp.instructionReference === instructionReference && (offset === undefined || ibp.offset === offset)) {
					removed.push(ibp);
					this.instructionBreakpoints.splice(i--, 1);
				}
			}
		} else {
			removed = this.instructionBreakpoints;
			this.instructionBreakpoints = [];
		}
		this._onDidChangeBreakpoints.fire({ removed, sessionOnly: false });
	}

	getWatchExpressions(): Expression[] {
		return this.watchExpressions;
	}

	addWatchExpression(name?: string): IExpression {
		const we = new Expression(name || '');
		this.watchExpressions.push(we);
		this._onDidChangeWatchExpressions.fire(we);

		return we;
	}

	renameWatchExpression(id: string, newName: string): void {
		const filtered = this.watchExpressions.filter(we => we.getId() === id);
		if (filtered.length === 1) {
			filtered[0].name = newName;
			this._onDidChangeWatchExpressions.fire(filtered[0]);
		}
	}

	removeWatchExpressions(id: string | null = null): void {
		this.watchExpressions = id ? this.watchExpressions.filter(we => we.getId() !== id) : [];
		this._onDidChangeWatchExpressions.fire(undefined);
	}

	moveWatchExpression(id: string, position: number): void {
		const we = this.watchExpressions.find(we => we.getId() === id);
		if (we) {
			this.watchExpressions = this.watchExpressions.filter(we => we.getId() !== id);
			this.watchExpressions = this.watchExpressions.slice(0, position).concat(we, this.watchExpressions.slice(position));
			this._onDidChangeWatchExpressions.fire(undefined);
		}
	}

	sourceIsNotAvailable(uri: uri): void {
		this.sessions.forEach(s => {
			const source = s.getSourceForUri(uri);
			if (source) {
				source.available = false;
			}
		});
		this._onDidChangeCallStack.fire(undefined);
	}
}
```

--------------------------------------------------------------------------------

````

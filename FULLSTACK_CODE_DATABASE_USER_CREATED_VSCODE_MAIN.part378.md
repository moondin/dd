---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 378
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 378 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/browser/debugCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindowId } from '../../../../base/browser/dom.js';
import { List } from '../../../../base/browser/ui/list/listWidget.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { deepClone } from '../../../../base/common/objects.js';
import { isWeb, isWindows } from '../../../../base/common/platform.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import * as nls from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IExtensionHostDebugService } from '../../../../platform/debug/common/extensionHostDebug.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { ActiveEditorContext, PanelFocusContext, ResourceContextKey } from '../../../common/contextkeys.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { TEXT_FILE_EDITOR_ID } from '../../files/common/files.js';
import { CONTEXT_BREAKPOINT_INPUT_FOCUSED, CONTEXT_BREAKPOINTS_FOCUSED, CONTEXT_DEBUG_STATE, CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DISASSEMBLY_VIEW_FOCUS, CONTEXT_EXPRESSION_SELECTED, CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_IN_DEBUG_MODE, CONTEXT_IN_DEBUG_REPL, CONTEXT_JUMP_TO_CURSOR_SUPPORTED, CONTEXT_STEP_INTO_TARGETS_SUPPORTED, CONTEXT_VARIABLES_FOCUSED, CONTEXT_WATCH_EXPRESSIONS_FOCUSED, DataBreakpointSetType, EDITOR_CONTRIBUTION_ID, getStateLabel, IConfig, IDataBreakpointInfoResponse, IDebugConfiguration, IDebugEditorContribution, IDebugService, IDebugSession, IEnablement, IExceptionBreakpoint, isFrameDeemphasized, IStackFrame, IThread, REPL_VIEW_ID, State, VIEWLET_ID } from '../common/debug.js';
import { Breakpoint, DataBreakpoint, Expression, FunctionBreakpoint, Thread, Variable } from '../common/debugModel.js';
import { saveAllBeforeDebugStart, resolveChildSession } from '../common/debugUtils.js';
import { showLoadedScriptMenu } from '../common/loadedScriptsPicker.js';
import { openBreakpointSource } from './breakpointsView.js';
import { showDebugSessionMenu } from './debugSessionPicker.js';

export const ADD_CONFIGURATION_ID = 'debug.addConfiguration';
export const COPY_ADDRESS_ID = 'editor.debug.action.copyAddress';
export const TOGGLE_BREAKPOINT_ID = 'editor.debug.action.toggleBreakpoint';
export const TOGGLE_INLINE_BREAKPOINT_ID = 'editor.debug.action.toggleInlineBreakpoint';
export const COPY_STACK_TRACE_ID = 'debug.copyStackTrace';
export const REVERSE_CONTINUE_ID = 'workbench.action.debug.reverseContinue';
export const STEP_BACK_ID = 'workbench.action.debug.stepBack';
export const RESTART_SESSION_ID = 'workbench.action.debug.restart';
export const TERMINATE_THREAD_ID = 'workbench.action.debug.terminateThread';
export const STEP_OVER_ID = 'workbench.action.debug.stepOver';
export const STEP_INTO_ID = 'workbench.action.debug.stepInto';
export const STEP_INTO_TARGET_ID = 'workbench.action.debug.stepIntoTarget';
export const STEP_OUT_ID = 'workbench.action.debug.stepOut';
export const PAUSE_ID = 'workbench.action.debug.pause';
export const DISCONNECT_ID = 'workbench.action.debug.disconnect';
export const DISCONNECT_AND_SUSPEND_ID = 'workbench.action.debug.disconnectAndSuspend';
export const STOP_ID = 'workbench.action.debug.stop';
export const RESTART_FRAME_ID = 'workbench.action.debug.restartFrame';
export const CONTINUE_ID = 'workbench.action.debug.continue';
export const FOCUS_REPL_ID = 'workbench.debug.action.focusRepl';
export const JUMP_TO_CURSOR_ID = 'debug.jumpToCursor';
export const FOCUS_SESSION_ID = 'workbench.action.debug.focusProcess';
export const SELECT_AND_START_ID = 'workbench.action.debug.selectandstart';
export const SELECT_DEBUG_CONSOLE_ID = 'workbench.action.debug.selectDebugConsole';
export const SELECT_DEBUG_SESSION_ID = 'workbench.action.debug.selectDebugSession';
export const DEBUG_CONFIGURE_COMMAND_ID = 'workbench.action.debug.configure';
export const DEBUG_START_COMMAND_ID = 'workbench.action.debug.start';
export const DEBUG_RUN_COMMAND_ID = 'workbench.action.debug.run';
export const EDIT_EXPRESSION_COMMAND_ID = 'debug.renameWatchExpression';
export const COPY_WATCH_EXPRESSION_COMMAND_ID = 'debug.copyWatchExpression';
export const SET_EXPRESSION_COMMAND_ID = 'debug.setWatchExpression';
export const REMOVE_EXPRESSION_COMMAND_ID = 'debug.removeWatchExpression';
export const NEXT_DEBUG_CONSOLE_ID = 'workbench.action.debug.nextConsole';
export const PREV_DEBUG_CONSOLE_ID = 'workbench.action.debug.prevConsole';
export const SHOW_LOADED_SCRIPTS_ID = 'workbench.action.debug.showLoadedScripts';
export const CALLSTACK_TOP_ID = 'workbench.action.debug.callStackTop';
export const CALLSTACK_BOTTOM_ID = 'workbench.action.debug.callStackBottom';
export const CALLSTACK_UP_ID = 'workbench.action.debug.callStackUp';
export const CALLSTACK_DOWN_ID = 'workbench.action.debug.callStackDown';
export const ADD_TO_WATCH_ID = 'debug.addToWatchExpressions';
export const COPY_EVALUATE_PATH_ID = 'debug.copyEvaluatePath';
export const COPY_VALUE_ID = 'workbench.debug.viewlet.action.copyValue';
export const BREAK_WHEN_VALUE_CHANGES_ID = 'debug.breakWhenValueChanges';
export const BREAK_WHEN_VALUE_IS_ACCESSED_ID = 'debug.breakWhenValueIsAccessed';
export const BREAK_WHEN_VALUE_IS_READ_ID = 'debug.breakWhenValueIsRead';
export const TOGGLE_EXCEPTION_BREAKPOINTS_ID = 'debug.toggleExceptionBreakpoints';
export const ATTACH_TO_CURRENT_CODE_RENDERER = 'debug.attachToCurrentCodeRenderer';

export const DEBUG_COMMAND_CATEGORY: ILocalizedString = nls.localize2('debug', 'Debug');
export const RESTART_LABEL = nls.localize2('restartDebug', "Restart");
export const STEP_OVER_LABEL = nls.localize2('stepOverDebug', "Step Over");
export const STEP_INTO_LABEL = nls.localize2('stepIntoDebug', "Step Into");
export const STEP_INTO_TARGET_LABEL = nls.localize2('stepIntoTargetDebug', "Step Into Target");
export const STEP_OUT_LABEL = nls.localize2('stepOutDebug', "Step Out");
export const PAUSE_LABEL = nls.localize2('pauseDebug', "Pause");
export const DISCONNECT_LABEL = nls.localize2('disconnect', "Disconnect");
export const DISCONNECT_AND_SUSPEND_LABEL = nls.localize2('disconnectSuspend', "Disconnect and Suspend");
export const STOP_LABEL = nls.localize2('stop', "Stop");
export const CONTINUE_LABEL = nls.localize2('continueDebug', "Continue");
export const FOCUS_SESSION_LABEL = nls.localize2('focusSession', "Focus Session");
export const SELECT_AND_START_LABEL = nls.localize2('selectAndStartDebugging', "Select and Start Debugging");
export const DEBUG_CONFIGURE_LABEL = nls.localize('openLaunchJson', "Open '{0}'", 'launch.json');
export const DEBUG_START_LABEL = nls.localize2('startDebug', "Start Debugging");
export const DEBUG_RUN_LABEL = nls.localize2('startWithoutDebugging', "Start Without Debugging");
export const NEXT_DEBUG_CONSOLE_LABEL = nls.localize2('nextDebugConsole', "Focus Next Debug Console");
export const PREV_DEBUG_CONSOLE_LABEL = nls.localize2('prevDebugConsole', "Focus Previous Debug Console");
export const OPEN_LOADED_SCRIPTS_LABEL = nls.localize2('openLoadedScript', "Open Loaded Script...");
export const CALLSTACK_TOP_LABEL = nls.localize2('callStackTop', "Navigate to Top of Call Stack");
export const CALLSTACK_BOTTOM_LABEL = nls.localize2('callStackBottom', "Navigate to Bottom of Call Stack");
export const CALLSTACK_UP_LABEL = nls.localize2('callStackUp', "Navigate Up Call Stack");
export const CALLSTACK_DOWN_LABEL = nls.localize2('callStackDown', "Navigate Down Call Stack");
export const COPY_EVALUATE_PATH_LABEL = nls.localize2('copyAsExpression', "Copy as Expression");
export const COPY_VALUE_LABEL = nls.localize2('copyValue', "Copy Value");
export const COPY_ADDRESS_LABEL = nls.localize2('copyAddress', "Copy Address");
export const ADD_TO_WATCH_LABEL = nls.localize2('addToWatchExpressions', "Add to Watch");

export const SELECT_DEBUG_CONSOLE_LABEL = nls.localize2('selectDebugConsole', "Select Debug Console");
export const SELECT_DEBUG_SESSION_LABEL = nls.localize2('selectDebugSession', "Select Debug Session");

export const DEBUG_QUICK_ACCESS_PREFIX = 'debug ';
export const DEBUG_CONSOLE_QUICK_ACCESS_PREFIX = 'debug consoles ';

let dataBreakpointInfoResponse: IDataBreakpointInfoResponse | undefined;

export function setDataBreakpointInfoResponse(resp: IDataBreakpointInfoResponse | undefined) {
	dataBreakpointInfoResponse = resp;
}

interface CallStackContext {
	sessionId: string;
	threadId: string;
	frameId: string;
}

function isThreadContext(obj: any): obj is CallStackContext {
	return obj && typeof obj.sessionId === 'string' && typeof obj.threadId === 'string';
}

async function getThreadAndRun(accessor: ServicesAccessor, sessionAndThreadId: CallStackContext | unknown, run: (thread: IThread) => Promise<void>): Promise<void> {
	const debugService = accessor.get(IDebugService);
	let thread: IThread | undefined;
	if (isThreadContext(sessionAndThreadId)) {
		const session = debugService.getModel().getSession(sessionAndThreadId.sessionId);
		if (session) {
			thread = session.getAllThreads().find(t => t.getId() === sessionAndThreadId.threadId);
		}
	} else if (isSessionContext(sessionAndThreadId)) {
		const session = debugService.getModel().getSession(sessionAndThreadId.sessionId);
		if (session) {
			const threads = session.getAllThreads();
			thread = threads.length > 0 ? threads[0] : undefined;
		}
	}

	if (!thread) {
		thread = debugService.getViewModel().focusedThread;
		if (!thread) {
			const focusedSession = debugService.getViewModel().focusedSession;
			const threads = focusedSession ? focusedSession.getAllThreads() : undefined;
			thread = threads && threads.length ? threads[0] : undefined;
		}
	}

	if (thread) {
		await run(thread);
	}
}

function isStackFrameContext(obj: any): obj is CallStackContext {
	return obj && typeof obj.sessionId === 'string' && typeof obj.threadId === 'string' && typeof obj.frameId === 'string';
}

function getFrame(debugService: IDebugService, context: CallStackContext | unknown): IStackFrame | undefined {
	if (isStackFrameContext(context)) {
		const session = debugService.getModel().getSession(context.sessionId);
		if (session) {
			const thread = session.getAllThreads().find(t => t.getId() === context.threadId);
			if (thread) {
				return thread.getCallStack().find(sf => sf.getId() === context.frameId);
			}
		}
	} else {
		return debugService.getViewModel().focusedStackFrame;
	}

	return undefined;
}

function isSessionContext(obj: any): obj is CallStackContext {
	return obj && typeof obj.sessionId === 'string';
}

async function changeDebugConsoleFocus(accessor: ServicesAccessor, next: boolean) {
	const debugService = accessor.get(IDebugService);
	const viewsService = accessor.get(IViewsService);
	const sessions = debugService.getModel().getSessions(true).filter(s => s.hasSeparateRepl());
	let currSession = debugService.getViewModel().focusedSession;

	let nextIndex = 0;
	if (sessions.length > 0 && currSession) {
		while (currSession && !currSession.hasSeparateRepl()) {
			currSession = currSession.parentSession;
		}

		if (currSession) {
			const currIndex = sessions.indexOf(currSession);
			if (next) {
				nextIndex = (currIndex === (sessions.length - 1) ? 0 : (currIndex + 1));
			} else {
				nextIndex = (currIndex === 0 ? (sessions.length - 1) : (currIndex - 1));
			}
		}
	}
	await debugService.focusStackFrame(undefined, undefined, sessions[nextIndex], { explicit: true });

	if (!viewsService.isViewVisible(REPL_VIEW_ID)) {
		await viewsService.openView(REPL_VIEW_ID, true);
	}
}

async function navigateCallStack(debugService: IDebugService, down: boolean) {
	const frame = debugService.getViewModel().focusedStackFrame;
	if (frame) {

		let callStack = frame.thread.getCallStack();
		let index = callStack.findIndex(elem => elem.frameId === frame.frameId);
		let nextVisibleFrame;
		if (down) {
			if (index >= callStack.length - 1) {
				if ((<Thread>frame.thread).reachedEndOfCallStack) {
					goToTopOfCallStack(debugService);
					return;
				} else {
					await debugService.getModel().fetchCallstack(frame.thread, 20);
					callStack = frame.thread.getCallStack();
					index = callStack.findIndex(elem => elem.frameId === frame.frameId);
				}
			}
			nextVisibleFrame = findNextVisibleFrame(true, callStack, index);
		} else {
			if (index <= 0) {
				goToBottomOfCallStack(debugService);
				return;
			}
			nextVisibleFrame = findNextVisibleFrame(false, callStack, index);
		}

		if (nextVisibleFrame) {
			debugService.focusStackFrame(nextVisibleFrame, undefined, undefined, { preserveFocus: false });
		}
	}
}

async function goToBottomOfCallStack(debugService: IDebugService) {
	const thread = debugService.getViewModel().focusedThread;
	if (thread) {
		await debugService.getModel().fetchCallstack(thread);
		const callStack = thread.getCallStack();
		if (callStack.length > 0) {
			const nextVisibleFrame = findNextVisibleFrame(false, callStack, 0); // must consider the next frame up first, which will be the last frame
			if (nextVisibleFrame) {
				debugService.focusStackFrame(nextVisibleFrame, undefined, undefined, { preserveFocus: false });
			}
		}
	}
}

function goToTopOfCallStack(debugService: IDebugService) {
	const thread = debugService.getViewModel().focusedThread;

	if (thread) {
		debugService.focusStackFrame(thread.getTopStackFrame(), undefined, undefined, { preserveFocus: false });
	}
}

/**
 * Finds next frame that is not skipped by SkipFiles. Skips frame at index and starts searching at next.
 * Must satisfy `0 <= startIndex <= callStack - 1`
 * @param down specifies whether to search downwards if the current file is skipped.
 * @param callStack the call stack to search
 * @param startIndex the index to start the search at
 */
function findNextVisibleFrame(down: boolean, callStack: readonly IStackFrame[], startIndex: number) {

	if (startIndex >= callStack.length) {
		startIndex = callStack.length - 1;
	} else if (startIndex < 0) {
		startIndex = 0;
	}

	let index = startIndex;

	let currFrame;
	do {
		if (down) {
			if (index === callStack.length - 1) {
				index = 0;
			} else {
				index++;
			}
		} else {
			if (index === 0) {
				index = callStack.length - 1;
			} else {
				index--;
			}
		}

		currFrame = callStack[index];
		if (!isFrameDeemphasized(currFrame)) {
			return currFrame;
		}
	} while (index !== startIndex); // end loop when we've just checked the start index, since that should be the last one checked

	return undefined;
}

// These commands are used in call stack context menu, call stack inline actions, command palette, debug toolbar, mac native touch bar
// When the command is exectued in the context of a thread(context menu on a thread, inline call stack action) we pass the thread id
// Otherwise when it is executed "globaly"(using the touch bar, debug toolbar, command palette) we do not pass any id and just take whatever is the focussed thread
// Same for stackFrame commands and session commands.
CommandsRegistry.registerCommand({
	id: COPY_STACK_TRACE_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const textResourcePropertiesService = accessor.get(ITextResourcePropertiesService);
		const clipboardService = accessor.get(IClipboardService);
		const debugService = accessor.get(IDebugService);
		const frame = getFrame(debugService, context);
		if (frame) {
			const eol = textResourcePropertiesService.getEOL(frame.source.uri);
			await clipboardService.writeText(frame.thread.getCallStack().map(sf => sf.toString()).join(eol));
		}
	}
});

CommandsRegistry.registerCommand({
	id: REVERSE_CONTINUE_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		await getThreadAndRun(accessor, context, thread => thread.reverseContinue());
	}
});

CommandsRegistry.registerCommand({
	id: STEP_BACK_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const contextKeyService = accessor.get(IContextKeyService);
		if (CONTEXT_DISASSEMBLY_VIEW_FOCUS.getValue(contextKeyService)) {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepBack('instruction'));
		} else {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepBack());
		}
	}
});

CommandsRegistry.registerCommand({
	id: TERMINATE_THREAD_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		await getThreadAndRun(accessor, context, thread => thread.terminate());
	}
});

CommandsRegistry.registerCommand({
	id: JUMP_TO_CURSOR_ID,
	handler: async (accessor: ServicesAccessor) => {
		const debugService = accessor.get(IDebugService);
		const stackFrame = debugService.getViewModel().focusedStackFrame;
		const editorService = accessor.get(IEditorService);
		const activeEditorControl = editorService.activeTextEditorControl;
		const notificationService = accessor.get(INotificationService);
		const quickInputService = accessor.get(IQuickInputService);

		if (stackFrame && isCodeEditor(activeEditorControl) && activeEditorControl.hasModel()) {
			const position = activeEditorControl.getPosition();
			const resource = activeEditorControl.getModel().uri;
			const source = stackFrame.thread.session.getSourceForUri(resource);
			if (source) {
				const response = await stackFrame.thread.session.gotoTargets(source.raw, position.lineNumber, position.column);
				const targets = response?.body.targets;
				if (targets && targets.length) {
					let id = targets[0].id;
					if (targets.length > 1) {
						const picks = targets.map(t => ({ label: t.label, _id: t.id }));
						const pick = await quickInputService.pick(picks, { placeHolder: nls.localize('chooseLocation', "Choose the specific location") });
						if (!pick) {
							return;
						}

						id = pick._id;
					}

					return await stackFrame.thread.session.goto(stackFrame.thread.threadId, id).catch(e => notificationService.warn(e));
				}
			}
		}

		return notificationService.warn(nls.localize('noExecutableCode', "No executable code is associated at the current cursor position."));
	}
});


CommandsRegistry.registerCommand({
	id: CALLSTACK_TOP_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		goToTopOfCallStack(debugService);
	}
});

CommandsRegistry.registerCommand({
	id: CALLSTACK_BOTTOM_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		await goToBottomOfCallStack(debugService);
	}
});

CommandsRegistry.registerCommand({
	id: CALLSTACK_UP_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		navigateCallStack(debugService, false);
	}
});

CommandsRegistry.registerCommand({
	id: CALLSTACK_DOWN_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		navigateCallStack(debugService, true);
	}
});

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	command: {
		id: JUMP_TO_CURSOR_ID,
		title: nls.localize('jumpToCursor', "Jump to Cursor"),
		category: DEBUG_COMMAND_CATEGORY
	},
	when: ContextKeyExpr.and(CONTEXT_JUMP_TO_CURSOR_SUPPORTED, EditorContextKeys.editorTextFocus),
	group: 'debug',
	order: 3
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: NEXT_DEBUG_CONSOLE_ID,
	weight: KeybindingWeight.WorkbenchContrib + 1,
	when: CONTEXT_IN_DEBUG_REPL,
	primary: KeyMod.CtrlCmd | KeyCode.PageDown,
	mac: { primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.BracketRight },
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		changeDebugConsoleFocus(accessor, true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: PREV_DEBUG_CONSOLE_ID,
	weight: KeybindingWeight.WorkbenchContrib + 1,
	when: CONTEXT_IN_DEBUG_REPL,
	primary: KeyMod.CtrlCmd | KeyCode.PageUp,
	mac: { primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.BracketLeft },
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		changeDebugConsoleFocus(accessor, false);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: RESTART_SESSION_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.F5,
	when: CONTEXT_IN_DEBUG_MODE,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		const configurationService = accessor.get(IConfigurationService);
		let session: IDebugSession | undefined;
		if (isSessionContext(context)) {
			session = debugService.getModel().getSession(context.sessionId);
		} else {
			session = debugService.getViewModel().focusedSession;
		}

		if (!session) {
			const { launch, name } = debugService.getConfigurationManager().selectedConfiguration;
			await debugService.startDebugging(launch, name, { noDebug: false, startedByUser: true });
		} else {
			const showSubSessions = configurationService.getValue<IDebugConfiguration>('debug').showSubSessionsInToolBar;
			// Stop should be sent to the root parent session
			while (!showSubSessions && session.lifecycleManagedByParent && session.parentSession) {
				session = session.parentSession;
			}
			session.removeReplExpressions();
			await debugService.restartSession(session);
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: STEP_OVER_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.F10,
	when: CONTEXT_DEBUG_STATE.isEqualTo('stopped'),
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const contextKeyService = accessor.get(IContextKeyService);
		if (CONTEXT_DISASSEMBLY_VIEW_FOCUS.getValue(contextKeyService)) {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.next('instruction'));
		} else {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.next());
		}
	}
});

// Windows browsers use F11 for full screen, thus use alt+F11 as the default shortcut
const STEP_INTO_KEYBINDING = (isWeb && isWindows) ? (KeyMod.Alt | KeyCode.F11) : KeyCode.F11;

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: STEP_INTO_ID,
	weight: KeybindingWeight.WorkbenchContrib + 10, // Have a stronger weight to have priority over full screen when debugging
	primary: STEP_INTO_KEYBINDING,
	// Use a more flexible when clause to not allow full screen command to take over when F11 pressed a lot of times
	when: CONTEXT_DEBUG_STATE.notEqualsTo('inactive'),
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const contextKeyService = accessor.get(IContextKeyService);
		if (CONTEXT_DISASSEMBLY_VIEW_FOCUS.getValue(contextKeyService)) {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepIn('instruction'));
		} else {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepIn());
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: STEP_OUT_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.Shift | KeyCode.F11,
	when: CONTEXT_DEBUG_STATE.isEqualTo('stopped'),
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const contextKeyService = accessor.get(IContextKeyService);
		if (CONTEXT_DISASSEMBLY_VIEW_FOCUS.getValue(contextKeyService)) {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepOut('instruction'));
		} else {
			await getThreadAndRun(accessor, context, (thread: IThread) => thread.stepOut());
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: PAUSE_ID,
	weight: KeybindingWeight.WorkbenchContrib + 2, // take priority over focus next part while we are debugging
	primary: KeyCode.F6,
	when: CONTEXT_DEBUG_STATE.isEqualTo('running'),
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		await getThreadAndRun(accessor, context, thread => thread.pause());
	}
});


KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: STEP_INTO_TARGET_ID,
	primary: STEP_INTO_KEYBINDING | KeyMod.CtrlCmd,
	when: ContextKeyExpr.and(CONTEXT_STEP_INTO_TARGETS_SUPPORTED, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped')),
	weight: KeybindingWeight.WorkbenchContrib,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const quickInputService = accessor.get(IQuickInputService);
		const debugService = accessor.get(IDebugService);
		const session = debugService.getViewModel().focusedSession;
		const frame = debugService.getViewModel().focusedStackFrame;
		if (!frame || !session) {
			return;
		}

		const editor = await accessor.get(IEditorService).openEditor({
			resource: frame.source.uri,
			options: { revealIfOpened: true }
		});

		let codeEditor: ICodeEditor | undefined;
		if (editor) {
			const ctrl = editor?.getControl();
			if (isCodeEditor(ctrl)) {
				codeEditor = ctrl;
			}
		}

		interface ITargetItem extends IQuickPickItem {
			target: DebugProtocol.StepInTarget;
		}

		const disposables = new DisposableStore();
		const qp = disposables.add(quickInputService.createQuickPick<ITargetItem>());
		qp.busy = true;
		qp.show();

		disposables.add(qp.onDidChangeActive(([item]) => {
			if (codeEditor && item && item.target.line !== undefined) {
				codeEditor.revealLineInCenterIfOutsideViewport(item.target.line);
				codeEditor.setSelection({
					startLineNumber: item.target.line,
					startColumn: item.target.column || 1,
					endLineNumber: item.target.endLine || item.target.line,
					endColumn: item.target.endColumn || item.target.column || 1,
				});
			}
		}));

		disposables.add(qp.onDidAccept(() => {
			if (qp.activeItems.length) {
				session.stepIn(frame.thread.threadId, qp.activeItems[0].target.id);
			}
		}));

		disposables.add(qp.onDidHide(() => disposables.dispose()));

		session.stepInTargets(frame.frameId).then(targets => {
			qp.busy = false;
			if (targets?.length) {
				qp.items = targets?.map(target => ({ target, label: target.label }));
			} else {
				qp.placeholder = nls.localize('editor.debug.action.stepIntoTargets.none', "No step targets available");
			}
		});
	}
});

async function stopHandler(accessor: ServicesAccessor, _: unknown, context: CallStackContext | unknown, disconnect: boolean, suspend?: boolean): Promise<void> {
	const debugService = accessor.get(IDebugService);
	let session: IDebugSession | undefined;
	if (isSessionContext(context)) {
		session = debugService.getModel().getSession(context.sessionId);
	} else {
		session = debugService.getViewModel().focusedSession;
	}

	const configurationService = accessor.get(IConfigurationService);
	const showSubSessions = configurationService.getValue<IDebugConfiguration>('debug').showSubSessionsInToolBar;
	// Stop should be sent to the root parent session
	while (!showSubSessions && session && session.lifecycleManagedByParent && session.parentSession) {
		session = session.parentSession;
	}

	await debugService.stopSession(session, disconnect, suspend);
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: DISCONNECT_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.Shift | KeyCode.F5,
	when: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH, CONTEXT_IN_DEBUG_MODE),
	handler: (accessor, _, context) => stopHandler(accessor, _, context, true)
});

CommandsRegistry.registerCommand({
	id: DISCONNECT_AND_SUSPEND_ID,
	handler: (accessor, _, context) => stopHandler(accessor, _, context, true, true)
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: STOP_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.Shift | KeyCode.F5,
	when: ContextKeyExpr.and(CONTEXT_FOCUSED_SESSION_IS_ATTACH.toNegated(), CONTEXT_IN_DEBUG_MODE),
	handler: (accessor, _, context) => stopHandler(accessor, _, context, false)
});

CommandsRegistry.registerCommand({
	id: RESTART_FRAME_ID,
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		const debugService = accessor.get(IDebugService);
		const notificationService = accessor.get(INotificationService);
		const frame = getFrame(debugService, context);
		if (frame) {
			try {
				await frame.restart();
			} catch (e) {
				notificationService.error(e);
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CONTINUE_ID,
	weight: KeybindingWeight.WorkbenchContrib + 10, // Use a stronger weight to get priority over start debugging F5 shortcut
	primary: KeyCode.F5,
	when: CONTEXT_DEBUG_STATE.isEqualTo('stopped'),
	handler: async (accessor: ServicesAccessor, _: string, context: CallStackContext | unknown) => {
		await getThreadAndRun(accessor, context, thread => thread.continue());
	}
});

CommandsRegistry.registerCommand({
	id: SHOW_LOADED_SCRIPTS_ID,
	handler: async (accessor) => {
		await showLoadedScriptMenu(accessor);
	}
});

CommandsRegistry.registerCommand({
	id: 'debug.startFromConfig',
	handler: async (accessor, config: IConfig) => {
		const debugService = accessor.get(IDebugService);
		await debugService.startDebugging(undefined, config);
	}
});

CommandsRegistry.registerCommand({
	id: FOCUS_SESSION_ID,
	handler: async (accessor: ServicesAccessor, session: IDebugSession) => {
		const debugService = accessor.get(IDebugService);
		const editorService = accessor.get(IEditorService);
		session = resolveChildSession(session, debugService.getModel().getSessions());
		await debugService.focusStackFrame(undefined, undefined, session, { explicit: true });
		const stackFrame = debugService.getViewModel().focusedStackFrame;
		if (stackFrame) {
			await stackFrame.openInEditor(editorService, true);
		}
	}
});

CommandsRegistry.registerCommand({
	id: SELECT_AND_START_ID,
	handler: async (accessor: ServicesAccessor, debugType: string | unknown, debugStartOptions?: { noDebug?: boolean }) => {
		const quickInputService = accessor.get(IQuickInputService);
		const debugService = accessor.get(IDebugService);

		if (debugType) {
			const configManager = debugService.getConfigurationManager();
			const dynamicProviders = await configManager.getDynamicProviders();
			for (const provider of dynamicProviders) {
				if (provider.type === debugType) {
					const pick = await provider.pick();
					if (pick) {
						await configManager.selectConfiguration(pick.launch, pick.config.name, pick.config, { type: provider.type });
						debugService.startDebugging(pick.launch, pick.config, { noDebug: debugStartOptions?.noDebug, startedByUser: true });

						return;
					}
				}
			}
		}

		quickInputService.quickAccess.show(DEBUG_QUICK_ACCESS_PREFIX);
	}
});

CommandsRegistry.registerCommand({
	id: SELECT_DEBUG_CONSOLE_ID,
	handler: async (accessor: ServicesAccessor) => {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.quickAccess.show(DEBUG_CONSOLE_QUICK_ACCESS_PREFIX);
	}
});

CommandsRegistry.registerCommand({
	id: SELECT_DEBUG_SESSION_ID,
	handler: async (accessor: ServicesAccessor) => {
		showDebugSessionMenu(accessor, SELECT_AND_START_ID);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: DEBUG_START_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.F5,
	when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE.isEqualTo('inactive')),
	handler: async (accessor: ServicesAccessor, debugStartOptions?: { config?: Partial<IConfig>; noDebug?: boolean }) => {
		const debugService = accessor.get(IDebugService);
		await saveAllBeforeDebugStart(accessor.get(IConfigurationService), accessor.get(IEditorService));
		const { launch, name, getConfig } = debugService.getConfigurationManager().selectedConfiguration;
		const config = await getConfig();
		const configOrName = config ? Object.assign(deepClone(config), debugStartOptions?.config) : name;
		await debugService.startDebugging(launch, configOrName, { noDebug: debugStartOptions?.noDebug, startedByUser: true }, false);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: DEBUG_RUN_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.CtrlCmd | KeyCode.F5,
	mac: { primary: KeyMod.WinCtrl | KeyCode.F5 },
	when: ContextKeyExpr.and(CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DEBUG_STATE.notEqualsTo(getStateLabel(State.Initializing))),
	handler: async (accessor: ServicesAccessor) => {
		const commandService = accessor.get(ICommandService);
		await commandService.executeCommand(DEBUG_START_COMMAND_ID, { noDebug: true });
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.toggleBreakpoint',
	weight: KeybindingWeight.WorkbenchContrib + 5,
	when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_FOCUSED, InputFocusedContext.toNegated()),
	primary: KeyCode.Space,
	handler: (accessor) => {
		const listService = accessor.get(IListService);
		const debugService = accessor.get(IDebugService);
		const list = listService.lastFocusedList;
		if (list instanceof List) {
			const focused = <IEnablement[]>list.getFocusedElements();
			if (focused && focused.length) {
				debugService.enableOrDisableBreakpoints(!focused[0].enabled, focused[0]);
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.enableOrDisableBreakpoint',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: undefined,
	when: EditorContextKeys.editorTextFocus,
	handler: (accessor) => {
		const debugService = accessor.get(IDebugService);
		const editorService = accessor.get(IEditorService);
		const control = editorService.activeTextEditorControl;
		if (isCodeEditor(control)) {
			const model = control.getModel();
			if (model) {
				const position = control.getPosition();
				if (position) {
					const bps = debugService.getModel().getBreakpoints({ uri: model.uri, lineNumber: position.lineNumber });
					if (bps.length) {
						debugService.enableOrDisableBreakpoints(!bps[0].enabled, bps[0]);
					}
				}
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: EDIT_EXPRESSION_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib + 5,
	when: CONTEXT_WATCH_EXPRESSIONS_FOCUSED,
	primary: KeyCode.F2,
	mac: { primary: KeyCode.Enter },
	handler: (accessor: ServicesAccessor, expression: Expression | unknown) => {
		const debugService = accessor.get(IDebugService);
		if (!(expression instanceof Expression)) {
			const listService = accessor.get(IListService);
			const focused = listService.lastFocusedList;
			if (focused) {
				const elements = focused.getFocus();
				if (Array.isArray(elements) && elements[0] instanceof Expression) {
					expression = elements[0];
				}
			}
		}

		if (expression instanceof Expression) {
			debugService.getViewModel().setSelectedExpression(expression, false);
		}
	}
});

CommandsRegistry.registerCommand({
	id: SET_EXPRESSION_COMMAND_ID,
	handler: async (accessor: ServicesAccessor, expression: Expression | unknown) => {
		const debugService = accessor.get(IDebugService);
		if (expression instanceof Expression || expression instanceof Variable) {
			debugService.getViewModel().setSelectedExpression(expression, true);
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.setVariable',
	weight: KeybindingWeight.WorkbenchContrib + 5,
	when: CONTEXT_VARIABLES_FOCUSED,
	primary: KeyCode.F2,
	mac: { primary: KeyCode.Enter },
	handler: (accessor) => {
		const listService = accessor.get(IListService);
		const debugService = accessor.get(IDebugService);
		const focused = listService.lastFocusedList;

		if (focused) {
			const elements = focused.getFocus();
			if (Array.isArray(elements) && elements[0] instanceof Variable) {
				debugService.getViewModel().setSelectedExpression(elements[0], false);
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: REMOVE_EXPRESSION_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(CONTEXT_WATCH_EXPRESSIONS_FOCUSED, CONTEXT_EXPRESSION_SELECTED.toNegated()),
	primary: KeyCode.Delete,
	mac: { primary: KeyMod.CtrlCmd | KeyCode.Backspace },
	handler: (accessor: ServicesAccessor, expression: Expression | unknown) => {
		const debugService = accessor.get(IDebugService);

		if (expression instanceof Expression) {
			debugService.removeWatchExpressions(expression.getId());
			return;
		}

		const listService = accessor.get(IListService);
		const focused = listService.lastFocusedList;
		if (focused) {
			let elements = focused.getFocus();
			if (Array.isArray(elements) && elements[0] instanceof Expression) {
				const selection = focused.getSelection();
				if (selection && selection.indexOf(elements[0]) >= 0) {
					elements = selection;
				}
				elements.forEach((e: Expression) => debugService.removeWatchExpressions(e.getId()));
			}
		}
	}
});

CommandsRegistry.registerCommand({
	id: BREAK_WHEN_VALUE_CHANGES_ID,
	handler: async (accessor: ServicesAccessor) => {
		const debugService = accessor.get(IDebugService);
		if (dataBreakpointInfoResponse) {
			await debugService.addDataBreakpoint({ description: dataBreakpointInfoResponse.description, src: { type: DataBreakpointSetType.Variable, dataId: dataBreakpointInfoResponse.dataId! }, canPersist: !!dataBreakpointInfoResponse.canPersist, accessTypes: dataBreakpointInfoResponse.accessTypes, accessType: 'write' });
		}
	}
});

CommandsRegistry.registerCommand({
	id: BREAK_WHEN_VALUE_IS_ACCESSED_ID,
	handler: async (accessor: ServicesAccessor) => {
		const debugService = accessor.get(IDebugService);
		if (dataBreakpointInfoResponse) {
			await debugService.addDataBreakpoint({ description: dataBreakpointInfoResponse.description, src: { type: DataBreakpointSetType.Variable, dataId: dataBreakpointInfoResponse.dataId! }, canPersist: !!dataBreakpointInfoResponse.canPersist, accessTypes: dataBreakpointInfoResponse.accessTypes, accessType: 'readWrite' });
		}
	}
});

CommandsRegistry.registerCommand({
	id: BREAK_WHEN_VALUE_IS_READ_ID,
	handler: async (accessor: ServicesAccessor) => {
		const debugService = accessor.get(IDebugService);
		if (dataBreakpointInfoResponse) {
			await debugService.addDataBreakpoint({ description: dataBreakpointInfoResponse.description, src: { type: DataBreakpointSetType.Variable, dataId: dataBreakpointInfoResponse.dataId! }, canPersist: !!dataBreakpointInfoResponse.canPersist, accessTypes: dataBreakpointInfoResponse.accessTypes, accessType: 'read' });
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.removeBreakpoint',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(CONTEXT_BREAKPOINTS_FOCUSED, CONTEXT_BREAKPOINT_INPUT_FOCUSED.toNegated()),
	primary: KeyCode.Delete,
	mac: { primary: KeyMod.CtrlCmd | KeyCode.Backspace },
	handler: (accessor) => {
		const listService = accessor.get(IListService);
		const debugService = accessor.get(IDebugService);
		const list = listService.lastFocusedList;

		if (list instanceof List) {
			const focused = list.getFocusedElements();
			const element = focused.length ? focused[0] : undefined;
			if (element instanceof Breakpoint) {
				debugService.removeBreakpoints(element.getId());
			} else if (element instanceof FunctionBreakpoint) {
				debugService.removeFunctionBreakpoints(element.getId());
			} else if (element instanceof DataBreakpoint) {
				debugService.removeDataBreakpoints(element.getId());
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.installAdditionalDebuggers',
	weight: KeybindingWeight.WorkbenchContrib,
	when: undefined,
	primary: undefined,
	handler: async (accessor, query: string) => {
		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		let searchFor = `@category:debuggers`;
		if (typeof query === 'string') {
			searchFor += ` ${query}`;
		}
		return extensionsWorkbenchService.openSearch(searchFor);
	}
});

registerAction2(class AddConfigurationAction extends Action2 {
	constructor() {
		super({
			id: ADD_CONFIGURATION_ID,
			title: nls.localize2('addConfiguration', "Add Configuration..."),
			category: DEBUG_COMMAND_CATEGORY,
			f1: true,
			menu: {
				id: MenuId.EditorContent,
				when: ContextKeyExpr.and(
					ContextKeyExpr.regex(ResourceContextKey.Path.key, /\.vscode[/\\]launch\.json$/),
					ActiveEditorContext.isEqualTo(TEXT_FILE_EDITOR_ID))
			}
		});
	}

	async run(accessor: ServicesAccessor, launchUri: string): Promise<void> {
		const manager = accessor.get(IDebugService).getConfigurationManager();

		const launch = manager.getLaunches().find(l => l.uri.toString() === launchUri) || manager.selectedConfiguration.launch;
		if (launch) {
			const { editor, created } = await launch.openConfigFile({ preserveFocus: false });
			if (editor && !created) {
				const codeEditor = <ICodeEditor>editor.getControl();
				if (codeEditor) {
					await codeEditor.getContribution<IDebugEditorContribution>(EDITOR_CONTRIBUTION_ID)?.addLaunchConfiguration();
				}
			}
		}
	}
});

const inlineBreakpointHandler = (accessor: ServicesAccessor) => {
	const debugService = accessor.get(IDebugService);
	const editorService = accessor.get(IEditorService);
	const control = editorService.activeTextEditorControl;
	if (isCodeEditor(control)) {
		const position = control.getPosition();
		if (position && control.hasModel() && debugService.canSetBreakpointsIn(control.getModel())) {
			const modelUri = control.getModel().uri;
			const breakpointAlreadySet = debugService.getModel().getBreakpoints({ lineNumber: position.lineNumber, uri: modelUri })
				.some(bp => (bp.sessionAgnosticData.column === position.column || (!bp.column && position.column <= 1)));

			if (!breakpointAlreadySet) {
				debugService.addBreakpoints(modelUri, [{ lineNumber: position.lineNumber, column: position.column > 1 ? position.column : undefined }]);
			}
		}
	}
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.Shift | KeyCode.F9,
	when: EditorContextKeys.editorTextFocus,
	id: TOGGLE_INLINE_BREAKPOINT_ID,
	handler: inlineBreakpointHandler
});

MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	command: {
		id: TOGGLE_INLINE_BREAKPOINT_ID,
		title: nls.localize('addInlineBreakpoint', "Add Inline Breakpoint"),
		category: DEBUG_COMMAND_CATEGORY
	},
	when: ContextKeyExpr.and(
		CONTEXT_IN_DEBUG_MODE,
		PanelFocusContext.toNegated(),
		EditorContextKeys.editorTextFocus,
		ChatContextKeys.inChatSession.toNegated()),
	group: 'debug',
	order: 1
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.openBreakpointToSide',
	weight: KeybindingWeight.WorkbenchContrib,
	when: CONTEXT_BREAKPOINTS_FOCUSED,
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	secondary: [KeyMod.Alt | KeyCode.Enter],
	handler: (accessor) => {
		const listService = accessor.get(IListService);
		const list = listService.lastFocusedList;
		if (list instanceof List) {
			const focus = list.getFocusedElements();
			if (focus.length && focus[0] instanceof Breakpoint) {
				return openBreakpointSource(focus[0], true, false, true, accessor.get(IDebugService), accessor.get(IEditorService));
			}
		}

		return undefined;
	}
});

registerAction2(class ToggleExceptionBreakpointsAction extends Action2 {
	constructor() {
		super({
			id: TOGGLE_EXCEPTION_BREAKPOINTS_ID,
			title: nls.localize2('toggleExceptionBreakpoints', "Toggle Exception Breakpoints"),
			category: DEBUG_COMMAND_CATEGORY,
			f1: true,
			precondition: CONTEXT_DEBUGGERS_AVAILABLE
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const quickInputService = accessor.get(IQuickInputService);

		// Get the focused session or the first available session
		const debugModel = debugService.getModel();
		const session = debugService.getViewModel().focusedSession || debugModel.getSessions()[0];
		const exceptionBreakpoints = session ? debugModel.getExceptionBreakpointsForSession(session.getId()) : debugModel.getExceptionBreakpoints();
		if (exceptionBreakpoints.length === 0) {
			return;
		}

		// If only one exception breakpoint type, toggle it directly
		if (exceptionBreakpoints.length === 1) {
			const breakpoint = exceptionBreakpoints[0];
			await debugService.enableOrDisableBreakpoints(!breakpoint.enabled, breakpoint);
			return;
		}

		// Multiple exception breakpoint types - show quickpick for selection
		interface IExceptionBreakpointItem extends IQuickPickItem {
			breakpoint: IExceptionBreakpoint;
		}

		const disposables = new DisposableStore();
		const quickPick = disposables.add(quickInputService.createQuickPick<IExceptionBreakpointItem>());
		quickPick.placeholder = nls.localize('selectExceptionBreakpointsPlaceholder', "Pick enabled exception breakpoints");
		quickPick.canSelectMany = true;
		quickPick.matchOnDescription = true;
		quickPick.matchOnDetail = true;

		// Create quickpick items from exception breakpoints
		quickPick.items = exceptionBreakpoints.map(bp => ({
			label: bp.label,
			description: bp.description,
			picked: bp.enabled,
			breakpoint: bp
		}));

		quickPick.selectedItems = quickPick.items.filter(item => item.picked);

		disposables.add(quickPick.onDidAccept(() => {
			const selectedItems = quickPick.selectedItems;
			const toEnable: IExceptionBreakpoint[] = [];
			const toDisable: IExceptionBreakpoint[] = [];

			// Determine which breakpoints need to be toggled
			for (const bp of exceptionBreakpoints) {
				const isSelected = selectedItems.some(item => item.breakpoint === bp);
				if (isSelected && !bp.enabled) {
					toEnable.push(bp);
				} else if (!isSelected && bp.enabled) {
					toDisable.push(bp);
				}
			}

			// Toggle the breakpoints
			const promises: Promise<void>[] = [];
			for (const bp of toEnable) {
				promises.push(debugService.enableOrDisableBreakpoints(true, bp));
			}
			for (const bp of toDisable) {
				promises.push(debugService.enableOrDisableBreakpoints(false, bp));
			}

			Promise.all(promises).then(() => disposables.dispose());
		}));

		disposables.add(quickPick.onDidHide(() => disposables.dispose()));
		quickPick.show();
	}
});

// When there are no debug extensions, open the debug viewlet when F5 is pressed so the user can read the limitations
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'debug.openView',
	weight: KeybindingWeight.WorkbenchContrib,
	when: CONTEXT_DEBUGGERS_AVAILABLE.toNegated(),
	primary: KeyCode.F5,
	secondary: [KeyMod.CtrlCmd | KeyCode.F5],
	handler: async (accessor) => {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		await paneCompositeService.openPaneComposite(VIEWLET_ID, ViewContainerLocation.Sidebar, true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: ATTACH_TO_CURRENT_CODE_RENDERER,
			title: nls.localize2('attachToCurrentCodeRenderer', "Attach to Current Code Renderer"),
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const env = accessor.get(IEnvironmentService);
		if (!env.isExtensionDevelopment && !env.extensionTestsLocationURI) {
			throw new Error('Refusing to attach to renderer outside of development context');
		}

		const windowId = getWindowId(mainWindow);
		const extDebugService = accessor.get(IExtensionHostDebugService);
		const result = await extDebugService.attachToCurrentWindowRenderer(windowId);

		return result;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugConfigurationManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugConfigurationManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { sequence } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import * as json from '../../../../base/common/json.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { DisposableStore, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import * as resources from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI as uri } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService, IWorkspaceFolder, IWorkspaceFoldersChangeEvent, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IEditorPane } from '../../../common/editor.js';
import { launchSchemaId } from '../../../services/configuration/common/configuration.js';
import { ACTIVE_GROUP, IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { CONTEXT_DEBUG_CONFIGURATION_TYPE, DebugConfigurationProviderTriggerKind, IAdapterManager, ICompound, IConfig, IConfigPresentation, IConfigurationManager, IDebugConfigurationProvider, IGlobalConfig, IGuessedDebugger, ILaunch } from '../common/debug.js';
import { launchSchema } from '../common/debugSchemas.js';
import { getVisibleAndSorted } from '../common/debugUtils.js';
import { debugConfigure } from './debugIcons.js';

const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
jsonRegistry.registerSchema(launchSchemaId, launchSchema);

const DEBUG_SELECTED_CONFIG_NAME_KEY = 'debug.selectedconfigname';
const DEBUG_SELECTED_ROOT = 'debug.selectedroot';
// Debug type is only stored if a dynamic configuration is used for better restore
const DEBUG_SELECTED_TYPE = 'debug.selectedtype';
const DEBUG_RECENT_DYNAMIC_CONFIGURATIONS = 'debug.recentdynamicconfigurations';
const ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME = 'onDebugDynamicConfigurations';

interface IDynamicPickItem { label: string; launch: ILaunch; config: IConfig }

export class ConfigurationManager implements IConfigurationManager {
	private launches!: ILaunch[];
	private selectedName: string | undefined;
	private selectedLaunch: ILaunch | undefined;
	private getSelectedConfig: () => Promise<IConfig | undefined> = () => Promise.resolve(undefined);
	private selectedType: string | undefined;
	private selectedDynamic = false;
	private toDispose: IDisposable[];
	private readonly _onDidSelectConfigurationName = new Emitter<void>();
	private configProviders: IDebugConfigurationProvider[];
	private debugConfigurationTypeContext: IContextKey<string>;
	private readonly _onDidChangeConfigurationProviders = new Emitter<void>();
	public readonly onDidChangeConfigurationProviders = this._onDidChangeConfigurationProviders.event;

	constructor(
		private readonly adapterManager: IAdapterManager,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IHistoryService private readonly historyService: IHistoryService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILogService private readonly logService: ILogService,
	) {
		this.configProviders = [];
		this.toDispose = [this._onDidChangeConfigurationProviders];
		this.initLaunches();
		this.setCompoundSchemaValues();
		this.registerListeners();
		const previousSelectedRoot = this.storageService.get(DEBUG_SELECTED_ROOT, StorageScope.WORKSPACE);
		const previousSelectedType = this.storageService.get(DEBUG_SELECTED_TYPE, StorageScope.WORKSPACE);
		const previousSelectedLaunch = this.launches.find(l => l.uri.toString() === previousSelectedRoot);
		const previousSelectedName = this.storageService.get(DEBUG_SELECTED_CONFIG_NAME_KEY, StorageScope.WORKSPACE);
		this.debugConfigurationTypeContext = CONTEXT_DEBUG_CONFIGURATION_TYPE.bindTo(contextKeyService);
		const dynamicConfig = previousSelectedType ? { type: previousSelectedType } : undefined;
		if (previousSelectedLaunch && previousSelectedLaunch.getConfigurationNames().length) {
			this.selectConfiguration(previousSelectedLaunch, previousSelectedName, undefined, dynamicConfig);
		} else if (this.launches.length > 0) {
			this.selectConfiguration(undefined, previousSelectedName, undefined, dynamicConfig);
		}
	}

	registerDebugConfigurationProvider(debugConfigurationProvider: IDebugConfigurationProvider): IDisposable {
		this.configProviders.push(debugConfigurationProvider);
		this._onDidChangeConfigurationProviders.fire();
		return {
			dispose: () => {
				this.unregisterDebugConfigurationProvider(debugConfigurationProvider);
				this._onDidChangeConfigurationProviders.fire();
			}
		};
	}

	unregisterDebugConfigurationProvider(debugConfigurationProvider: IDebugConfigurationProvider): void {
		const ix = this.configProviders.indexOf(debugConfigurationProvider);
		if (ix >= 0) {
			this.configProviders.splice(ix, 1);
		}
	}

	/**
	 * if scope is not specified,a value of DebugConfigurationProvideTrigger.Initial is assumed.
	 */
	hasDebugConfigurationProvider(debugType: string, triggerKind?: DebugConfigurationProviderTriggerKind): boolean {
		if (triggerKind === undefined) {
			triggerKind = DebugConfigurationProviderTriggerKind.Initial;
		}
		// check if there are providers for the given type that contribute a provideDebugConfigurations method
		const provider = this.configProviders.find(p => p.provideDebugConfigurations && (p.type === debugType) && (p.triggerKind === triggerKind));
		return !!provider;
	}

	async resolveConfigurationByProviders(folderUri: uri | undefined, type: string | undefined, config: IConfig, token: CancellationToken): Promise<IConfig | null | undefined> {
		const resolveDebugConfigurationForType = async (type: string | undefined, config: IConfig | null | undefined) => {
			if (type !== '*') {
				await this.adapterManager.activateDebuggers('onDebugResolve', type);
			}

			for (const p of this.configProviders) {
				if (p.type === type && p.resolveDebugConfiguration && config) {
					config = await p.resolveDebugConfiguration(folderUri, config, token);
				}
			}

			return config;
		};

		let resolvedType = config.type ?? type;
		let result: IConfig | null | undefined = config;
		for (let seen = new Set(); result && !seen.has(resolvedType);) {
			seen.add(resolvedType);
			result = await resolveDebugConfigurationForType(resolvedType, result);
			result = await resolveDebugConfigurationForType('*', result);
			resolvedType = result?.type ?? type!;
		}

		return result;
	}

	async resolveDebugConfigurationWithSubstitutedVariables(folderUri: uri | undefined, type: string | undefined, config: IConfig, token: CancellationToken): Promise<IConfig | null | undefined> {
		// pipe the config through the promises sequentially. Append at the end the '*' types
		const providers = this.configProviders.filter(p => p.type === type && p.resolveDebugConfigurationWithSubstitutedVariables)
			.concat(this.configProviders.filter(p => p.type === '*' && p.resolveDebugConfigurationWithSubstitutedVariables));

		let result: IConfig | null | undefined = config;
		await sequence(providers.map(provider => async () => {
			// If any provider returned undefined or null make sure to respect that and do not pass the result to more resolver
			if (result) {
				result = await provider.resolveDebugConfigurationWithSubstitutedVariables!(folderUri, result, token);
			}
		}));

		return result;
	}

	async provideDebugConfigurations(folderUri: uri | undefined, type: string, token: CancellationToken): Promise<any[]> {
		await this.adapterManager.activateDebuggers('onDebugInitialConfigurations');
		const results = await Promise.all(this.configProviders.filter(p => p.type === type && p.triggerKind === DebugConfigurationProviderTriggerKind.Initial && p.provideDebugConfigurations).map(p => p.provideDebugConfigurations!(folderUri, token)));

		return results.reduce((first, second) => first.concat(second), []);
	}

	async getDynamicProviders(): Promise<{ label: string; type: string; getProvider: () => Promise<IDebugConfigurationProvider | undefined>; pick: () => Promise<{ launch: ILaunch; config: IConfig; label: string } | undefined> }[]> {
		await this.extensionService.whenInstalledExtensionsRegistered();
		const debugDynamicExtensionsTypes = this.extensionService.extensions.reduce((acc, e) => {
			if (!e.activationEvents) {
				return acc;
			}

			const explicitTypes: string[] = [];
			let hasGenericEvent = false;
			for (const event of e.activationEvents) {
				if (event === ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME) {
					hasGenericEvent = true;
				} else if (event.startsWith(`${ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME}:`)) {
					explicitTypes.push(event.slice(ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME.length + 1));
				}
			}

			if (explicitTypes.length) {
				explicitTypes.forEach(t => acc.add(t));
			} else if (hasGenericEvent) {
				const debuggerType = e.contributes?.debuggers?.[0].type;
				if (debuggerType) {
					acc.add(debuggerType);
				}
			}

			return acc;
		}, new Set<string>());

		for (const configProvider of this.configProviders) {
			if (configProvider.triggerKind === DebugConfigurationProviderTriggerKind.Dynamic) {
				debugDynamicExtensionsTypes.add(configProvider.type);
			}
		}

		return [...debugDynamicExtensionsTypes].map(type => {
			return {
				label: this.adapterManager.getDebuggerLabel(type)!,
				getProvider: async () => {
					await this.adapterManager.activateDebuggers(ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME, type);
					return this.configProviders.find(p => p.type === type && p.triggerKind === DebugConfigurationProviderTriggerKind.Dynamic && p.provideDebugConfigurations);
				},
				type,
				pick: async () => {
					// Do a late 'onDebugDynamicConfigurationsName' activation so extensions are not activated too early #108578
					await this.adapterManager.activateDebuggers(ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME, type);

					const disposables = new DisposableStore();
					const token = new CancellationTokenSource();
					disposables.add(token);
					const input = disposables.add(this.quickInputService.createQuickPick<IDynamicPickItem>());
					input.busy = true;
					input.placeholder = nls.localize('selectConfiguration', "Select Launch Configuration");

					const chosenPromise = new Promise<IDynamicPickItem | undefined>(resolve => {
						disposables.add(input.onDidAccept(() => resolve(input.activeItems[0])));
						disposables.add(input.onDidTriggerItemButton(async (context) => {
							resolve(undefined);
							const { launch, config } = context.item;
							await launch.openConfigFile({ preserveFocus: false, type: config.type, suppressInitialConfigs: true });
							// Only Launch have a pin trigger button
							await (launch as Launch).writeConfiguration(config);
							await this.selectConfiguration(launch, config.name);
							this.removeRecentDynamicConfigurations(config.name, config.type);
						}));
						disposables.add(input.onDidHide(() => resolve(undefined)));
					}).finally(() => token.cancel());

					let items: IDynamicPickItem[];
					try {
						// This await invokes the extension providers, which might fail due to several reasons,
						// therefore we gate this logic under a try/catch to prevent leaving the Debug Tab
						// selector in a borked state.
						items = await this.getDynamicConfigurationsByType(type, token.token);
					} catch (err) {
						this.logService.error(err);
						disposables.dispose();
						return;
					}

					input.items = items;
					input.busy = false;
					input.show();
					const chosen = await chosenPromise;
					disposables.dispose();

					return chosen;
				}
			};
		});
	}

	async getDynamicConfigurationsByType(type: string, token: CancellationToken = CancellationToken.None): Promise<IDynamicPickItem[]> {
		// Do a late 'onDebugDynamicConfigurationsName' activation so extensions are not activated too early #108578
		await this.adapterManager.activateDebuggers(ON_DEBUG_DYNAMIC_CONFIGURATIONS_NAME, type);

		const picks: Promise<IDynamicPickItem[]>[] = [];
		const provider = this.configProviders.find(p => p.type === type && p.triggerKind === DebugConfigurationProviderTriggerKind.Dynamic && p.provideDebugConfigurations);
		this.getLaunches().forEach(launch => {
			if (provider) {
				picks.push(provider.provideDebugConfigurations!(launch.workspace?.uri, token).then(configurations => configurations.map(config => ({
					label: config.name,
					description: launch.name,
					config,
					buttons: [{
						iconClass: ThemeIcon.asClassName(debugConfigure),
						tooltip: nls.localize('editLaunchConfig', "Edit Debug Configuration in launch.json")
					}],
					launch
				}))));
			}
		});

		return (await Promise.all(picks)).flat();
	}

	getAllConfigurations(): { launch: ILaunch; name: string; presentation?: IConfigPresentation }[] {
		const all: { launch: ILaunch; name: string; presentation?: IConfigPresentation }[] = [];
		for (const l of this.launches) {
			for (const name of l.getConfigurationNames()) {
				const config = l.getConfiguration(name) || l.getCompound(name);
				if (config) {
					all.push({ launch: l, name, presentation: config.presentation });
				}
			}
		}

		return getVisibleAndSorted(all);
	}

	removeRecentDynamicConfigurations(name: string, type: string) {
		const remaining = this.getRecentDynamicConfigurations().filter(c => c.name !== name || c.type !== type);
		this.storageService.store(DEBUG_RECENT_DYNAMIC_CONFIGURATIONS, JSON.stringify(remaining), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		if (this.selectedConfiguration.name === name && this.selectedType === type && this.selectedDynamic) {
			this.selectConfiguration(undefined, undefined);
		} else {
			this._onDidSelectConfigurationName.fire();
		}
	}

	getRecentDynamicConfigurations(): { name: string; type: string }[] {
		return JSON.parse(this.storageService.get(DEBUG_RECENT_DYNAMIC_CONFIGURATIONS, StorageScope.WORKSPACE, '[]'));
	}

	private registerListeners(): void {
		this.toDispose.push(Event.any<IWorkspaceFoldersChangeEvent | WorkbenchState>(this.contextService.onDidChangeWorkspaceFolders, this.contextService.onDidChangeWorkbenchState)(() => {
			this.initLaunches();
			this.selectConfiguration(undefined);
			this.setCompoundSchemaValues();
		}));
		this.toDispose.push(this.configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration('launch')) {
				// A change happen in the launch.json. If there is already a launch configuration selected, do not change the selection.
				await this.selectConfiguration(undefined);
				this.setCompoundSchemaValues();
			}
		}));
		this.toDispose.push(this.adapterManager.onDidDebuggersExtPointRead(() => {
			this.setCompoundSchemaValues();
		}));
	}

	private initLaunches(): void {
		this.launches = this.contextService.getWorkspace().folders.map(folder => this.instantiationService.createInstance(Launch, this, this.adapterManager, folder));
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			this.launches.push(this.instantiationService.createInstance(WorkspaceLaunch, this, this.adapterManager));
		}
		this.launches.push(this.instantiationService.createInstance(UserLaunch, this, this.adapterManager));

		if (this.selectedLaunch && this.launches.indexOf(this.selectedLaunch) === -1) {
			this.selectConfiguration(undefined);
		}
	}

	private setCompoundSchemaValues(): void {
		const compoundConfigurationsSchema = (<IJSONSchema>launchSchema.properties!['compounds'].items).properties!['configurations'];
		const launchNames = this.launches.map(l =>
			l.getConfigurationNames(true)).reduce((first, second) => first.concat(second), []);
		(<IJSONSchema>compoundConfigurationsSchema.items).oneOf![0].enum = launchNames;
		(<IJSONSchema>compoundConfigurationsSchema.items).oneOf![1].properties!.name.enum = launchNames;

		const folderNames = this.contextService.getWorkspace().folders.map(f => f.name);
		(<IJSONSchema>compoundConfigurationsSchema.items).oneOf![1].properties!.folder.enum = folderNames;

		jsonRegistry.registerSchema(launchSchemaId, launchSchema);
	}

	getLaunches(): ILaunch[] {
		return this.launches;
	}

	getLaunch(workspaceUri: uri | undefined): ILaunch | undefined {
		if (!uri.isUri(workspaceUri)) {
			return undefined;
		}

		return this.launches.find(l => l.workspace && this.uriIdentityService.extUri.isEqual(l.workspace.uri, workspaceUri));
	}

	get selectedConfiguration(): { launch: ILaunch | undefined; name: string | undefined; getConfig: () => Promise<IConfig | undefined>; type: string | undefined } {
		return {
			launch: this.selectedLaunch,
			name: this.selectedName,
			getConfig: this.getSelectedConfig,
			type: this.selectedType
		};
	}

	get onDidSelectConfiguration(): Event<void> {
		return this._onDidSelectConfigurationName.event;
	}

	getWorkspaceLaunch(): ILaunch | undefined {
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			return this.launches[this.launches.length - 1];
		}

		return undefined;
	}

	async selectConfiguration(launch: ILaunch | undefined, name?: string, config?: IConfig, dynamicConfig?: { type?: string }): Promise<void> {
		if (typeof launch === 'undefined') {
			const rootUri = this.historyService.getLastActiveWorkspaceRoot();
			launch = this.getLaunch(rootUri);
			if (!launch || launch.getConfigurationNames().length === 0) {
				launch = this.launches.find(l => !!(l && l.getConfigurationNames().length)) || launch || this.launches[0];
			}
		}

		const previousLaunch = this.selectedLaunch;
		const previousName = this.selectedName;
		const previousSelectedDynamic = this.selectedDynamic;
		this.selectedLaunch = launch;

		if (this.selectedLaunch) {
			this.storageService.store(DEBUG_SELECTED_ROOT, this.selectedLaunch.uri.toString(), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(DEBUG_SELECTED_ROOT, StorageScope.WORKSPACE);
		}

		const names = launch ? launch.getConfigurationNames() : [];
		this.getSelectedConfig = () => {
			const selected = this.selectedName ? launch?.getConfiguration(this.selectedName) : undefined;
			return Promise.resolve(selected || config);
		};

		let type = config?.type;
		if (name && names.indexOf(name) >= 0) {
			this.setSelectedLaunchName(name);
		} else if (dynamicConfig && dynamicConfig.type) {
			// We could not find the previously used name and config is not passed. We should get all dynamic configurations from providers
			// And potentially auto select the previously used dynamic configuration #96293
			type = dynamicConfig.type;
			if (!config) {
				const providers = (await this.getDynamicProviders()).filter(p => p.type === type);
				this.getSelectedConfig = async () => {
					const activatedProviders = await Promise.all(providers.map(p => p.getProvider()));
					const provider = activatedProviders.length > 0 ? activatedProviders[0] : undefined;
					if (provider && launch && launch.workspace) {
						const token = new CancellationTokenSource();
						const dynamicConfigs = await provider.provideDebugConfigurations!(launch.workspace.uri, token.token);
						const dynamicConfig = dynamicConfigs.find(c => c.name === name);
						if (dynamicConfig) {
							return dynamicConfig;
						}
					}

					return undefined;
				};
			}
			this.setSelectedLaunchName(name);

			let recentDynamicProviders = this.getRecentDynamicConfigurations();
			if (name && dynamicConfig.type) {
				// We need to store the recently used dynamic configurations to be able to show them in UI #110009
				recentDynamicProviders.unshift({ name, type: dynamicConfig.type });
				recentDynamicProviders = distinct(recentDynamicProviders, t => `${t.name} : ${t.type}`);
				this.storageService.store(DEBUG_RECENT_DYNAMIC_CONFIGURATIONS, JSON.stringify(recentDynamicProviders), StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		} else if (!this.selectedName || names.indexOf(this.selectedName) === -1) {
			// We could not find the configuration to select, pick the first one, or reset the selection if there is no launch configuration
			const nameToSet = names.length ? names[0] : undefined;
			this.setSelectedLaunchName(nameToSet);
		}

		if (!config && launch && this.selectedName) {
			config = launch.getConfiguration(this.selectedName);
			type = config?.type;
		}

		this.selectedType = dynamicConfig?.type || config?.type;
		this.selectedDynamic = !!dynamicConfig;
		// Only store the selected type if we are having a dynamic configuration. Otherwise restoring this configuration from storage might be misindentified as a dynamic configuration
		this.storageService.store(DEBUG_SELECTED_TYPE, dynamicConfig ? this.selectedType : undefined, StorageScope.WORKSPACE, StorageTarget.MACHINE);

		if (type) {
			this.debugConfigurationTypeContext.set(type);
		} else {
			this.debugConfigurationTypeContext.reset();
		}

		if (this.selectedLaunch !== previousLaunch || this.selectedName !== previousName || previousSelectedDynamic !== this.selectedDynamic) {
			this._onDidSelectConfigurationName.fire();
		}
	}

	private setSelectedLaunchName(selectedName: string | undefined): void {
		this.selectedName = selectedName;

		if (this.selectedName) {
			this.storageService.store(DEBUG_SELECTED_CONFIG_NAME_KEY, this.selectedName, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(DEBUG_SELECTED_CONFIG_NAME_KEY, StorageScope.WORKSPACE);
		}
	}

	dispose(): void {
		this.toDispose = dispose(this.toDispose);
	}
}

abstract class AbstractLaunch implements ILaunch {
	abstract readonly uri: uri;
	abstract readonly name: string;
	abstract readonly workspace: IWorkspaceFolder | undefined;
	protected abstract getConfig(): IGlobalConfig | undefined;
	abstract openConfigFile(options: { preserveFocus: boolean; type?: string | undefined; suppressInitialConfigs?: boolean | undefined }, token?: CancellationToken | undefined): Promise<{ editor: IEditorPane | null; created: boolean }>;

	constructor(
		protected configurationManager: ConfigurationManager,
		private readonly adapterManager: IAdapterManager
	) { }

	getCompound(name: string): ICompound | undefined {
		const config = this.getDeduplicatedConfig();
		if (!config || !config.compounds) {
			return undefined;
		}

		return config.compounds.find(compound => compound.name === name);
	}

	getConfigurationNames(ignoreCompoundsAndPresentation = false): string[] {
		const config = this.getDeduplicatedConfig();
		if (!config || (!Array.isArray(config.configurations) && !Array.isArray(config.compounds))) {
			return [];
		} else {
			const configurations: (IConfig | ICompound)[] = [];
			if (config.configurations) {
				configurations.push(...config.configurations.filter(cfg => cfg && typeof cfg.name === 'string'));
			}

			if (ignoreCompoundsAndPresentation) {
				return configurations.map(c => c.name);
			}

			if (config.compounds) {
				configurations.push(...config.compounds.filter(compound => typeof compound.name === 'string' && compound.configurations && compound.configurations.length));
			}
			return getVisibleAndSorted(configurations).map(c => c.name);
		}
	}

	getConfiguration(name: string): IConfig | undefined {
		// We need to clone the configuration in order to be able to make changes to it #42198
		const config = this.getDeduplicatedConfig();
		if (!config || !config.configurations) {
			return undefined;
		}
		const configuration = config.configurations.find(config => config && config.name === name);
		if (!configuration) {
			return;
		}

		if (this instanceof UserLaunch) {
			return { ...configuration, __configurationTarget: ConfigurationTarget.USER };
		} else if (this instanceof WorkspaceLaunch) {
			return { ...configuration, __configurationTarget: ConfigurationTarget.WORKSPACE };
		} else {
			return { ...configuration, __configurationTarget: ConfigurationTarget.WORKSPACE_FOLDER };
		}
	}

	async getInitialConfigurationContent(folderUri?: uri, type?: string, useInitialConfigs?: boolean, token?: CancellationToken): Promise<string> {
		let content = '';
		const adapter: Partial<IGuessedDebugger> | undefined = type
			? { debugger: this.adapterManager.getEnabledDebugger(type) }
			: await this.adapterManager.guessDebugger(true);

		if (adapter?.withConfig && adapter.debugger) {
			content = await adapter.debugger.getInitialConfigurationContent([adapter.withConfig.config]);
		} else if (adapter?.debugger) {
			const initialConfigs = useInitialConfigs ?
				await this.configurationManager.provideDebugConfigurations(folderUri, adapter.debugger.type, token || CancellationToken.None) :
				[];
			content = await adapter.debugger.getInitialConfigurationContent(initialConfigs);
		}

		return content;
	}


	get hidden(): boolean {
		return false;
	}

	private getDeduplicatedConfig(): IGlobalConfig | undefined {
		const original = this.getConfig();
		return original && {
			version: original.version,
			compounds: original.compounds && distinguishConfigsByName(original.compounds),
			configurations: original.configurations && distinguishConfigsByName(original.configurations),
		};
	}
}

function distinguishConfigsByName<T extends { name: string }>(things: readonly T[]): T[] {
	const seen = new Map<string, number>();
	return things.map(thing => {
		const no = seen.get(thing.name) || 0;
		seen.set(thing.name, no + 1);
		return no === 0 ? thing : { ...thing, name: `${thing.name} (${no})` };
	});
}

class Launch extends AbstractLaunch implements ILaunch {

	constructor(
		configurationManager: ConfigurationManager,
		adapterManager: IAdapterManager,
		public workspace: IWorkspaceFolder,
		@IFileService private readonly fileService: IFileService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super(configurationManager, adapterManager);
	}

	get uri(): uri {
		return resources.joinPath(this.workspace.uri, '/.vscode/launch.json');
	}

	get name(): string {
		return this.workspace.name;
	}

	protected getConfig(): IGlobalConfig | undefined {
		return this.configurationService.inspect<IGlobalConfig>('launch', { resource: this.workspace.uri }).workspaceFolderValue;
	}

	async openConfigFile({ preserveFocus, type, suppressInitialConfigs }: { preserveFocus: boolean; type?: string; suppressInitialConfigs?: boolean }, token?: CancellationToken): Promise<{ editor: IEditorPane | null; created: boolean }> {
		const resource = this.uri;
		let created = false;
		let content = '';
		try {
			const fileContent = await this.fileService.readFile(resource);
			content = fileContent.value.toString();
		} catch {
			// launch.json not found: create one by collecting launch configs from debugConfigProviders
			content = await this.getInitialConfigurationContent(this.workspace.uri, type, !suppressInitialConfigs, token);
			if (!content) {
				// Cancelled
				return { editor: null, created: false };
			}

			created = true; // pin only if config file is created #8727
			try {
				await this.textFileService.write(resource, content);
			} catch (error) {
				throw new Error(nls.localize('DebugConfig.failed', "Unable to create 'launch.json' file inside the '.vscode' folder ({0}).", error.message));
			}
		}

		const index = content.indexOf(`"${this.configurationManager.selectedConfiguration.name}"`);
		let startLineNumber = 1;
		for (let i = 0; i < index; i++) {
			if (content.charAt(i) === '\n') {
				startLineNumber++;
			}
		}
		const selection = startLineNumber > 1 ? { startLineNumber, startColumn: 4 } : undefined;

		const editor = await this.editorService.openEditor({
			resource,
			options: {
				selection,
				preserveFocus,
				pinned: created,
				revealIfVisible: true
			},
		}, ACTIVE_GROUP);

		return ({
			editor: editor ?? null,
			created
		});
	}

	async writeConfiguration(configuration: IConfig): Promise<void> {
		// note: we don't get the deduplicated config since we don't want that to 'leak' into the file
		const fullConfig: Partial<IGlobalConfig> = { ...(this.getConfig() ?? {}) };
		fullConfig.configurations = [...fullConfig.configurations || [], configuration];
		await this.configurationService.updateValue('launch', fullConfig, { resource: this.workspace.uri }, ConfigurationTarget.WORKSPACE_FOLDER);
	}
}

class WorkspaceLaunch extends AbstractLaunch implements ILaunch {
	constructor(
		configurationManager: ConfigurationManager,
		adapterManager: IAdapterManager,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService
	) {
		super(configurationManager, adapterManager);
	}

	get workspace(): undefined {
		return undefined;
	}

	get uri(): uri {
		return this.contextService.getWorkspace().configuration!;
	}

	get name(): string {
		return nls.localize('workspace', "workspace");
	}

	protected getConfig(): IGlobalConfig | undefined {
		return this.configurationService.inspect<IGlobalConfig>('launch').workspaceValue;
	}

	async openConfigFile({ preserveFocus, type, useInitialConfigs }: { preserveFocus: boolean; type?: string; useInitialConfigs?: boolean }, token?: CancellationToken): Promise<{ editor: IEditorPane | null; created: boolean }> {
		const launchExistInFile = !!this.getConfig();
		if (!launchExistInFile) {
			// Launch property in workspace config not found: create one by collecting launch configs from debugConfigProviders
			const content = await this.getInitialConfigurationContent(undefined, type, useInitialConfigs, token);
			if (content) {
				await this.configurationService.updateValue('launch', json.parse(content), ConfigurationTarget.WORKSPACE);
			} else {
				return { editor: null, created: false };
			}
		}

		const editor = await this.editorService.openEditor({
			resource: this.contextService.getWorkspace().configuration!,
			options: { preserveFocus }
		}, ACTIVE_GROUP);

		return ({
			editor: editor ?? null,
			created: false
		});
	}
}

class UserLaunch extends AbstractLaunch implements ILaunch {

	constructor(
		configurationManager: ConfigurationManager,
		adapterManager: IAdapterManager,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IPreferencesService private readonly preferencesService: IPreferencesService
	) {
		super(configurationManager, adapterManager);
	}

	get workspace(): undefined {
		return undefined;
	}

	get uri(): uri {
		return this.preferencesService.userSettingsResource;
	}

	get name(): string {
		return nls.localize('user settings', "user settings");
	}

	override get hidden(): boolean {
		return true;
	}

	protected getConfig(): IGlobalConfig | undefined {
		return this.configurationService.inspect<IGlobalConfig>('launch').userValue;
	}

	async openConfigFile({ preserveFocus, type, useInitialContent }: { preserveFocus: boolean; type?: string; useInitialContent?: boolean }): Promise<{ editor: IEditorPane | null; created: boolean }> {
		const editor = await this.preferencesService.openUserSettings({ jsonEditor: true, preserveFocus, revealSetting: { key: 'launch' } });
		return ({
			editor: editor ?? null,
			created: false
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugConsoleQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugConsoleQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { FastAndSlowPicks, IPickerQuickAccessItem, PickerQuickAccessProvider, Picks } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { DEBUG_CONSOLE_QUICK_ACCESS_PREFIX, SELECT_AND_START_ID } from './debugCommands.js';
import { IDebugService, IDebugSession, REPL_VIEW_ID } from '../common/debug.js';

export class DebugConsoleQuickAccess extends PickerQuickAccessProvider<IPickerQuickAccessItem> {

	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@IViewsService private readonly _viewsService: IViewsService,
		@ICommandService private readonly _commandService: ICommandService,
	) {
		super(DEBUG_CONSOLE_QUICK_ACCESS_PREFIX, { canAcceptInBackground: true });
	}

	protected _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): Picks<IPickerQuickAccessItem> | Promise<Picks<IPickerQuickAccessItem>> | FastAndSlowPicks<IPickerQuickAccessItem> | null {
		const debugConsolePicks: Array<IPickerQuickAccessItem | IQuickPickSeparator> = [];

		this._debugService.getModel().getSessions(true).filter(s => s.hasSeparateRepl()).forEach((session, index) => {
			const pick = this._createPick(session, index, filter);
			if (pick) {
				debugConsolePicks.push(pick);
			}
		});


		if (debugConsolePicks.length > 0) {
			debugConsolePicks.push({ type: 'separator' });
		}

		const createTerminalLabel = localize("workbench.action.debug.startDebug", "Start a New Debug Session");
		debugConsolePicks.push({
			label: `$(plus) ${createTerminalLabel}`,
			ariaLabel: createTerminalLabel,
			accept: () => this._commandService.executeCommand(SELECT_AND_START_ID)
		});
		return debugConsolePicks;
	}

	private _createPick(session: IDebugSession, sessionIndex: number, filter: string): IPickerQuickAccessItem | undefined {
		const label = session.name;

		const highlights = matchesFuzzy(filter, label, true);
		if (highlights) {
			return {
				label,
				highlights: { label: highlights },
				accept: (keyMod, event) => {
					this._debugService.focusStackFrame(undefined, undefined, session, { explicit: true });
					if (!this._viewsService.isViewVisible(REPL_VIEW_ID)) {
						this._viewsService.openView(REPL_VIEW_ID, true);
					}
				}
			};
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugEditorActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugEditorActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getDomNodePagePosition } from '../../../../base/browser/dom.js';
import { toAction } from '../../../../base/common/actions.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, IActionOptions, registerEditorAction } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { Position } from '../../../../editor/common/core/position.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { MessageController } from '../../../../editor/contrib/message/browser/messageController.js';
import * as nls from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { PanelFocusContext } from '../../../common/contextkeys.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { openBreakpointSource } from './breakpointsView.js';
import { DisassemblyView, IDisassembledInstructionEntry } from './disassemblyView.js';
import { Repl } from './repl.js';
import { BREAKPOINT_EDITOR_CONTRIBUTION_ID, BreakpointWidgetContext, CONTEXT_CALLSTACK_ITEM_TYPE, CONTEXT_DEBUG_STATE, CONTEXT_DEBUGGERS_AVAILABLE, CONTEXT_DISASSEMBLE_REQUEST_SUPPORTED, CONTEXT_DISASSEMBLY_VIEW_FOCUS, CONTEXT_EXCEPTION_WIDGET_VISIBLE, CONTEXT_FOCUSED_STACK_FRAME_HAS_INSTRUCTION_POINTER_REFERENCE, CONTEXT_IN_DEBUG_MODE, CONTEXT_LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST, CONTEXT_STEP_INTO_TARGETS_SUPPORTED, EDITOR_CONTRIBUTION_ID, IBreakpointEditorContribution, IDebugConfiguration, IDebugEditorContribution, IDebugService, REPL_VIEW_ID, WATCH_VIEW_ID } from '../common/debug.js';
import { getEvaluatableExpressionAtPosition } from '../common/debugUtils.js';
import { DisassemblyViewInput } from '../common/disassemblyViewInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { TOGGLE_BREAKPOINT_ID } from '../../../../workbench/contrib/debug/browser/debugCommands.js';

class ToggleBreakpointAction extends Action2 {
	constructor() {
		super({
			id: TOGGLE_BREAKPOINT_ID,
			title: {
				...nls.localize2('toggleBreakpointAction', "Debug: Toggle Breakpoint"),
				mnemonicTitle: nls.localize({ key: 'miToggleBreakpoint', comment: ['&& denotes a mnemonic'] }, "Toggle &&Breakpoint"),
			},
			f1: true,
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			keybinding: {
				when: ContextKeyExpr.or(EditorContextKeys.editorTextFocus, CONTEXT_DISASSEMBLY_VIEW_FOCUS),
				primary: KeyCode.F9,
				weight: KeybindingWeight.EditorContrib
			},
			menu: {
				id: MenuId.MenubarDebugMenu,
				when: CONTEXT_DEBUGGERS_AVAILABLE,
				group: '4_new_breakpoint',
				order: 1
			}
		});
	}

	async run(accessor: ServicesAccessor, entry?: IDisassembledInstructionEntry): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const debugService = accessor.get(IDebugService);

		const activePane = editorService.activeEditorPane;
		if (activePane instanceof DisassemblyView) {
			const location = entry ? activePane.getAddressAndOffset(entry) : activePane.focusedAddressAndOffset;
			if (location) {
				const bps = debugService.getModel().getInstructionBreakpoints();
				const toRemove = bps.find(bp => bp.address === location.address);
				if (toRemove) {
					debugService.removeInstructionBreakpoints(toRemove.instructionReference, toRemove.offset);
				} else {
					debugService.addInstructionBreakpoint({ instructionReference: location.reference, offset: location.offset, address: location.address, canPersist: false });
				}
			}
			return;
		}

		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (editor?.hasModel()) {
			const modelUri = editor.getModel().uri;
			const canSet = debugService.canSetBreakpointsIn(editor.getModel());
			// Does not account for multi line selections, Set to remove multiple cursor on the same line
			const lineNumbers = [...new Set(editor.getSelections().map(s => s.getPosition().lineNumber))];

			await Promise.all(lineNumbers.map(async line => {
				const bps = debugService.getModel().getBreakpoints({ lineNumber: line, uri: modelUri });
				if (bps.length) {
					await Promise.all(bps.map(bp => debugService.removeBreakpoints(bp.getId())));
				} else if (canSet) {
					await debugService.addBreakpoints(modelUri, [{ lineNumber: line }]);
				}
			}));
		}
	}
}

class ConditionalBreakpointAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.debug.action.conditionalBreakpoint',
			label: nls.localize2('conditionalBreakpointEditorAction', "Debug: Add Conditional Breakpoint..."),
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			menuOpts: {
				menuId: MenuId.MenubarNewBreakpointMenu,
				title: nls.localize({ key: 'miConditionalBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&Conditional Breakpoint..."),
				group: '1_breakpoints',
				order: 1,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);

		const position = editor.getPosition();
		if (position && editor.hasModel() && debugService.canSetBreakpointsIn(editor.getModel())) {
			editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID)?.showBreakpointWidget(position.lineNumber, undefined, BreakpointWidgetContext.CONDITION);
		}
	}
}

class LogPointAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.debug.action.addLogPoint',
			label: nls.localize2('logPointEditorAction', "Debug: Add Logpoint..."),
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			menuOpts: [
				{
					menuId: MenuId.MenubarNewBreakpointMenu,
					title: nls.localize({ key: 'miLogPoint', comment: ['&& denotes a mnemonic'] }, "&&Logpoint..."),
					group: '1_breakpoints',
					order: 4,
					when: CONTEXT_DEBUGGERS_AVAILABLE,
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);

		const position = editor.getPosition();
		if (position && editor.hasModel() && debugService.canSetBreakpointsIn(editor.getModel())) {
			editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID)?.showBreakpointWidget(position.lineNumber, position.column, BreakpointWidgetContext.LOG_MESSAGE);
		}
	}
}

class TriggerByBreakpointAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.debug.action.triggerByBreakpoint',
			label: nls.localize('triggerByBreakpointEditorAction', "Debug: Add Triggered Breakpoint..."),
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			alias: 'Debug: Triggered Breakpoint...',
			menuOpts: [
				{
					menuId: MenuId.MenubarNewBreakpointMenu,
					title: nls.localize({ key: 'miTriggerByBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&Triggered Breakpoint..."),
					group: '1_breakpoints',
					order: 4,
					when: CONTEXT_DEBUGGERS_AVAILABLE,
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);

		const position = editor.getPosition();
		if (position && editor.hasModel() && debugService.canSetBreakpointsIn(editor.getModel())) {
			editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID)?.showBreakpointWidget(position.lineNumber, position.column, BreakpointWidgetContext.TRIGGER_POINT);
		}
	}
}

class EditBreakpointAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.debug.action.editBreakpoint',
			label: nls.localize('EditBreakpointEditorAction', "Debug: Edit Breakpoint"),
			alias: 'Debug: Edit Existing Breakpoint',
			precondition: CONTEXT_DEBUGGERS_AVAILABLE,
			menuOpts: {
				menuId: MenuId.MenubarNewBreakpointMenu,
				title: nls.localize({ key: 'miEditBreakpoint', comment: ['&& denotes a mnemonic'] }, "&&Edit Breakpoint"),
				group: '1_breakpoints',
				order: 1,
				when: CONTEXT_DEBUGGERS_AVAILABLE
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);

		const position = editor.getPosition();
		const debugModel = debugService.getModel();
		if (!(editor.hasModel() && position)) {
			return;
		}

		const lineBreakpoints = debugModel.getBreakpoints({ lineNumber: position.lineNumber });
		if (lineBreakpoints.length === 0) {
			return;
		}

		const breakpointDistances = lineBreakpoints.map(b => {
			if (!b.column) {
				return position.column;
			}

			return Math.abs(b.column - position.column);
		});
		const closestBreakpointIndex = breakpointDistances.indexOf(Math.min(...breakpointDistances));
		const closestBreakpoint = lineBreakpoints[closestBreakpointIndex];

		editor.getContribution<IBreakpointEditorContribution>(BREAKPOINT_EDITOR_CONTRIBUTION_ID)?.showBreakpointWidget(closestBreakpoint.lineNumber, closestBreakpoint.column);
	}
}

class OpenDisassemblyViewAction extends Action2 {

	public static readonly ID = 'debug.action.openDisassemblyView';

	constructor() {
		super({
			id: OpenDisassemblyViewAction.ID,
			title: {
				...nls.localize2('openDisassemblyView', "Open Disassembly View"),
				mnemonicTitle: nls.localize({ key: 'miDisassemblyView', comment: ['&& denotes a mnemonic'] }, "&&DisassemblyView"),
			},
			precondition: CONTEXT_FOCUSED_STACK_FRAME_HAS_INSTRUCTION_POINTER_REFERENCE,
			menu: [
				{
					id: MenuId.EditorContext,
					group: 'debug',
					order: 5,
					when: ContextKeyExpr.and(CONTEXT_IN_DEBUG_MODE, PanelFocusContext.toNegated(), CONTEXT_DEBUG_STATE.isEqualTo('stopped'), EditorContextKeys.editorTextFocus, CONTEXT_DISASSEMBLE_REQUEST_SUPPORTED, CONTEXT_LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST)
				},
				{
					id: MenuId.DebugCallStackContext,
					group: 'z_commands',
					order: 50,
					when: ContextKeyExpr.and(CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'), CONTEXT_CALLSTACK_ITEM_TYPE.isEqualTo('stackFrame'), CONTEXT_DISASSEMBLE_REQUEST_SUPPORTED)
				},
				{
					id: MenuId.CommandPalette,
					when: ContextKeyExpr.and(CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'), CONTEXT_DISASSEMBLE_REQUEST_SUPPORTED)
				}
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		editorService.openEditor(DisassemblyViewInput.instance, { pinned: true, revealIfOpened: true });
	}
}

class ToggleDisassemblyViewSourceCodeAction extends Action2 {

	public static readonly ID = 'debug.action.toggleDisassemblyViewSourceCode';
	public static readonly configID: string = 'debug.disassemblyView.showSourceCode';

	constructor() {
		super({
			id: ToggleDisassemblyViewSourceCodeAction.ID,
			title: {
				...nls.localize2('toggleDisassemblyViewSourceCode', "Toggle Source Code in Disassembly View"),
				mnemonicTitle: nls.localize({ key: 'mitogglesource', comment: ['&& denotes a mnemonic'] }, "&&ToggleSource"),
			},
			metadata: {
				description: nls.localize2('toggleDisassemblyViewSourceCodeDescription', 'Shows or hides source code in disassembly')
			},
			f1: true,
		});
	}

	run(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]): void {
		const configService = accessor.get(IConfigurationService);
		if (configService) {
			const value = configService.getValue<IDebugConfiguration>('debug').disassemblyView.showSourceCode;
			configService.updateValue(ToggleDisassemblyViewSourceCodeAction.configID, !value);
		}
	}
}

export class RunToCursorAction extends EditorAction {

	public static readonly ID = 'editor.debug.action.runToCursor';
	public static readonly LABEL: ILocalizedString = nls.localize2('runToCursor', "Run to Cursor");

	constructor() {
		super({
			id: RunToCursorAction.ID,
			label: RunToCursorAction.LABEL.value,
			alias: 'Debug: Run to Cursor',
			precondition: ContextKeyExpr.and(
				CONTEXT_DEBUGGERS_AVAILABLE,
				PanelFocusContext.toNegated(),
				ContextKeyExpr.or(EditorContextKeys.editorTextFocus, CONTEXT_DISASSEMBLY_VIEW_FOCUS),
				ChatContextKeys.inChatSession.negate()
			),
			contextMenuOpts: {
				group: 'debug',
				order: 2,
				when: CONTEXT_IN_DEBUG_MODE
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const position = editor.getPosition();
		if (!(editor.hasModel() && position)) {
			return;
		}
		const uri = editor.getModel().uri;

		const debugService = accessor.get(IDebugService);
		const viewModel = debugService.getViewModel();
		const uriIdentityService = accessor.get(IUriIdentityService);

		let column: number | undefined = undefined;
		const focusedStackFrame = viewModel.focusedStackFrame;
		if (focusedStackFrame && uriIdentityService.extUri.isEqual(focusedStackFrame.source.uri, uri) && focusedStackFrame.range.startLineNumber === position.lineNumber) {
			// If the cursor is on a line different than the one the debugger is currently paused on, then send the breakpoint on the line without a column
			// otherwise set it at the precise column #102199
			column = position.column;
		}
		await debugService.runTo(uri, position.lineNumber, column);
	}
}

export class SelectionToReplAction extends EditorAction {

	public static readonly ID = 'editor.debug.action.selectionToRepl';
	public static readonly LABEL: ILocalizedString = nls.localize2('evaluateInDebugConsole', "Evaluate in Debug Console");

	constructor() {
		super({
			id: SelectionToReplAction.ID,
			label: SelectionToReplAction.LABEL.value,
			alias: 'Debug: Evaluate in Console',
			precondition: ContextKeyExpr.and(
				CONTEXT_IN_DEBUG_MODE,
				EditorContextKeys.editorTextFocus,
				ChatContextKeys.inChatSession.negate()),
			contextMenuOpts: {
				group: 'debug',
				order: 0
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const viewsService = accessor.get(IViewsService);
		const viewModel = debugService.getViewModel();
		const session = viewModel.focusedSession;
		if (!editor.hasModel() || !session) {
			return;
		}

		const selection = editor.getSelection();
		let text: string;
		if (selection.isEmpty()) {
			text = editor.getModel().getLineContent(selection.selectionStartLineNumber).trim();
		} else {
			text = editor.getModel().getValueInRange(selection);
		}

		const replView = await viewsService.openView(REPL_VIEW_ID, false) as Repl | undefined;
		replView?.sendReplInput(text);
	}
}

export class SelectionToWatchExpressionsAction extends EditorAction {

	public static readonly ID = 'editor.debug.action.selectionToWatch';
	public static readonly LABEL: ILocalizedString = nls.localize2('addToWatch', "Add to Watch");

	constructor() {
		super({
			id: SelectionToWatchExpressionsAction.ID,
			label: SelectionToWatchExpressionsAction.LABEL.value,
			alias: 'Debug: Add to Watch',
			precondition: ContextKeyExpr.and(
				CONTEXT_IN_DEBUG_MODE,
				EditorContextKeys.editorTextFocus,
				ChatContextKeys.inChatSession.negate()),
			contextMenuOpts: {
				group: 'debug',
				order: 1
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const viewsService = accessor.get(IViewsService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		if (!editor.hasModel()) {
			return;
		}

		let expression: string | undefined = undefined;

		const model = editor.getModel();
		const selection = editor.getSelection();

		if (!selection.isEmpty()) {
			expression = model.getValueInRange(selection);
		} else {
			const position = editor.getPosition();
			const evaluatableExpression = await getEvaluatableExpressionAtPosition(languageFeaturesService, model, position);
			if (!evaluatableExpression) {
				return;
			}
			expression = evaluatableExpression.matchingExpression;
		}

		if (!expression) {
			return;
		}

		await viewsService.openView(WATCH_VIEW_ID);
		debugService.addWatchExpression(expression);
	}
}

class ShowDebugHoverAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.debug.action.showDebugHover',
			label: nls.localize2('showDebugHover', "Debug: Show Hover"),
			precondition: CONTEXT_IN_DEBUG_MODE,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyI),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const position = editor.getPosition();
		if (!position || !editor.hasModel()) {
			return;
		}

		return editor.getContribution<IDebugEditorContribution>(EDITOR_CONTRIBUTION_ID)?.showHover(position, true);
	}
}

const NO_TARGETS_MESSAGE = nls.localize('editor.debug.action.stepIntoTargets.notAvailable', "Step targets are not available here");

class StepIntoTargetsAction extends EditorAction {

	public static readonly ID = 'editor.debug.action.stepIntoTargets';
	public static readonly LABEL = nls.localize({ key: 'stepIntoTargets', comment: ['Step Into Targets lets the user step into an exact function he or she is interested in.'] }, "Step Into Target");

	constructor() {
		super({
			id: StepIntoTargetsAction.ID,
			label: StepIntoTargetsAction.LABEL,
			alias: 'Debug: Step Into Target',
			precondition: ContextKeyExpr.and(CONTEXT_STEP_INTO_TARGETS_SUPPORTED, CONTEXT_IN_DEBUG_MODE, CONTEXT_DEBUG_STATE.isEqualTo('stopped'), EditorContextKeys.editorTextFocus),
			contextMenuOpts: {
				group: 'debug',
				order: 1.5
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const debugService = accessor.get(IDebugService);
		const contextMenuService = accessor.get(IContextMenuService);
		const uriIdentityService = accessor.get(IUriIdentityService);
		const session = debugService.getViewModel().focusedSession;
		const frame = debugService.getViewModel().focusedStackFrame;
		const selection = editor.getSelection();

		const targetPosition = selection?.getPosition() || (frame && { lineNumber: frame.range.startLineNumber, column: frame.range.startColumn });

		if (!session || !frame || !editor.hasModel() || !uriIdentityService.extUri.isEqual(editor.getModel().uri, frame.source.uri)) {
			if (targetPosition) {
				MessageController.get(editor)?.showMessage(NO_TARGETS_MESSAGE, targetPosition);
			}
			return;
		}


		const targets = await session.stepInTargets(frame.frameId);
		if (!targets?.length) {
			MessageController.get(editor)?.showMessage(NO_TARGETS_MESSAGE, targetPosition!);
			return;
		}

		// If there is a selection, try to find the best target with a position to step into.
		if (selection) {
			const positionalTargets: { start: Position; end?: Position; target: DebugProtocol.StepInTarget }[] = [];
			for (const target of targets) {
				if (target.line) {
					positionalTargets.push({
						start: new Position(target.line, target.column || 1),
						end: target.endLine ? new Position(target.endLine, target.endColumn || 1) : undefined,
						target
					});
				}
			}

			positionalTargets.sort((a, b) => b.start.lineNumber - a.start.lineNumber || b.start.column - a.start.column);

			const needle = selection.getPosition();

			// Try to find a target with a start and end that is around the cursor
			// position. Or, if none, whatever is before the cursor.
			const best = positionalTargets.find(t => t.end && needle.isBefore(t.end) && t.start.isBeforeOrEqual(needle)) || positionalTargets.find(t => t.end === undefined && t.start.isBeforeOrEqual(needle));
			if (best) {
				session.stepIn(frame.thread.threadId, best.target.id);
				return;
			}
		}

		// Otherwise, show a context menu and have the user pick a target
		editor.revealLineInCenterIfOutsideViewport(frame.range.startLineNumber);
		const cursorCoords = editor.getScrolledVisiblePosition(targetPosition!);
		const editorCoords = getDomNodePagePosition(editor.getDomNode());
		const x = editorCoords.left + cursorCoords.left;
		const y = editorCoords.top + cursorCoords.top + cursorCoords.height;

		contextMenuService.showContextMenu({
			getAnchor: () => ({ x, y }),
			getActions: () => {
				return targets.map(t => toAction({ id: `stepIntoTarget:${t.id}`, label: t.label, enabled: true, run: () => session.stepIn(frame.thread.threadId, t.id) }));
			}
		});
	}
}

class GoToBreakpointAction extends EditorAction {
	constructor(private isNext: boolean, opts: IActionOptions) {
		super(opts);
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<any> {
		const debugService = accessor.get(IDebugService);
		const editorService = accessor.get(IEditorService);
		const uriIdentityService = accessor.get(IUriIdentityService);

		if (editor.hasModel()) {
			const currentUri = editor.getModel().uri;
			const currentLine = editor.getPosition().lineNumber;
			//Breakpoints returned from `getBreakpoints` are already sorted.
			const allEnabledBreakpoints = debugService.getModel().getBreakpoints({ enabledOnly: true });

			//Try to find breakpoint in current file
			let moveBreakpoint =
				this.isNext
					? allEnabledBreakpoints.filter(bp => uriIdentityService.extUri.isEqual(bp.uri, currentUri) && bp.lineNumber > currentLine).shift()
					: allEnabledBreakpoints.filter(bp => uriIdentityService.extUri.isEqual(bp.uri, currentUri) && bp.lineNumber < currentLine).pop();

			//Try to find breakpoints in following files
			if (!moveBreakpoint) {
				moveBreakpoint =
					this.isNext
						? allEnabledBreakpoints.filter(bp => bp.uri.toString() > currentUri.toString()).shift()
						: allEnabledBreakpoints.filter(bp => bp.uri.toString() < currentUri.toString()).pop();
			}

			//Move to first or last possible breakpoint
			if (!moveBreakpoint && allEnabledBreakpoints.length) {
				moveBreakpoint = this.isNext ? allEnabledBreakpoints[0] : allEnabledBreakpoints[allEnabledBreakpoints.length - 1];
			}

			if (moveBreakpoint) {
				return openBreakpointSource(moveBreakpoint, false, true, false, debugService, editorService);
			}
		}
	}
}

class GoToNextBreakpointAction extends GoToBreakpointAction {
	constructor() {
		super(true, {
			id: 'editor.debug.action.goToNextBreakpoint',
			label: nls.localize2('goToNextBreakpoint', "Debug: Go to Next Breakpoint"),
			precondition: CONTEXT_DEBUGGERS_AVAILABLE
		});
	}
}

class GoToPreviousBreakpointAction extends GoToBreakpointAction {
	constructor() {
		super(false, {
			id: 'editor.debug.action.goToPreviousBreakpoint',
			label: nls.localize2('goToPreviousBreakpoint', "Debug: Go to Previous Breakpoint"),
			precondition: CONTEXT_DEBUGGERS_AVAILABLE
		});
	}
}

class CloseExceptionWidgetAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.debug.action.closeExceptionWidget',
			label: nls.localize2('closeExceptionWidget', "Close Exception Widget"),
			precondition: CONTEXT_EXCEPTION_WIDGET_VISIBLE,
			kbOpts: {
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const contribution = editor.getContribution<IDebugEditorContribution>(EDITOR_CONTRIBUTION_ID);
		contribution?.closeExceptionWidget();
	}
}

registerAction2(OpenDisassemblyViewAction);
registerAction2(ToggleDisassemblyViewSourceCodeAction);
registerAction2(ToggleBreakpointAction);
registerEditorAction(ConditionalBreakpointAction);
registerEditorAction(LogPointAction);
registerEditorAction(TriggerByBreakpointAction);
registerEditorAction(EditBreakpointAction);
registerEditorAction(RunToCursorAction);
registerEditorAction(StepIntoTargetsAction);
registerEditorAction(SelectionToReplAction);
registerEditorAction(SelectionToWatchExpressionsAction);
registerEditorAction(ShowDebugHoverAction);
registerEditorAction(GoToNextBreakpointAction);
registerEditorAction(GoToPreviousBreakpointAction);
registerEditorAction(CloseExceptionWidgetAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, isKeyboardEvent } from '../../../../base/browser/dom.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { memoize } from '../../../../base/common/decorators.js';
import { illegalArgument, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { visit } from '../../../../base/common/json.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable, MutableDisposable, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import { basename } from '../../../../base/common/path.js';
import * as env from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { assertType, isDefined } from '../../../../base/common/types.js';
import { Constants } from '../../../../base/common/uint.js';
import { URI } from '../../../../base/common/uri.js';
import { CoreEditingCommands } from '../../../../editor/browser/coreCommands.js';
import { ICodeEditor, IEditorMouseEvent, IPartialEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { EditorOption, IEditorHoverOptions } from '../../../../editor/common/config/editorOptions.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { DEFAULT_WORD_REGEXP } from '../../../../editor/common/core/wordHelper.js';
import { IEditorDecorationsCollection, ScrollType } from '../../../../editor/common/editorCommon.js';
import { StandardTokenType } from '../../../../editor/common/encodedTokenAttributes.js';
import { InlineValue, InlineValueContext } from '../../../../editor/common/languages.js';
import { IModelDeltaDecoration, ITextModel, InjectedTextCursorStops } from '../../../../editor/common/model.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../../editor/common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ContentHoverController } from '../../../../editor/contrib/hover/browser/contentHoverController.js';
import { HoverStartMode, HoverStartSource } from '../../../../editor/contrib/hover/browser/hoverOperation.js';
import * as nls from '../../../../nls.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { FloatingEditorClickWidget } from '../../../browser/codeeditor.js';
import { DebugHoverWidget, ShowDebugHoverResult } from './debugHover.js';
import { ExceptionWidget } from './exceptionWidget.js';
import { CONTEXT_EXCEPTION_WIDGET_VISIBLE, IDebugConfiguration, IDebugEditorContribution, IDebugService, IDebugSession, IExceptionInfo, IExpression, IStackFrame, State } from '../common/debug.js';
import { Expression } from '../common/debugModel.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { InsertLineAfterAction } from '../../../../editor/contrib/linesOperations/browser/linesOperations.js';

const MAX_NUM_INLINE_VALUES = 100; // JS Global scope can have 700+ entries. We want to limit ourselves for perf reasons
const MAX_INLINE_DECORATOR_LENGTH = 150; // Max string length of each inline decorator when debugging. If exceeded ... is added
const MAX_TOKENIZATION_LINE_LEN = 500; // If line is too long, then inline values for the line are skipped

const DEAFULT_INLINE_DEBOUNCE_DELAY = 200;

export const debugInlineForeground = registerColor('editor.inlineValuesForeground', {
	dark: '#ffffff80',
	light: '#00000080',
	hcDark: '#ffffff80',
	hcLight: '#00000080'
}, nls.localize('editor.inlineValuesForeground', "Color for the debug inline value text."));

export const debugInlineBackground = registerColor('editor.inlineValuesBackground', '#ffc80033', nls.localize('editor.inlineValuesBackground', "Color for the debug inline value background."));

class InlineSegment {
	constructor(public column: number, public text: string) {
	}
}

export function formatHoverContent(contentText: string): MarkdownString {
	if (contentText.includes(',') && contentText.includes('=')) {
		// Custom split: for each equals sign after the first, backtrack to the nearest comma
		const customSplit = (text: string): string[] => {
			const splits: number[] = [];
			let equalsFound = 0;
			let start = 0;
			for (let i = 0; i < text.length; i++) {
				if (text[i] === '=') {
					if (equalsFound === 0) {
						equalsFound++;
						continue;
					}
					const commaIndex = text.lastIndexOf(',', i);
					if (commaIndex !== -1 && commaIndex >= start) {
						splits.push(commaIndex);
						start = commaIndex + 1;
					}
					equalsFound++;
				}
			}
			const result: string[] = [];
			let s = 0;
			for (const index of splits) {
				result.push(text.substring(s, index).trim());
				s = index + 1;
			}
			if (s < text.length) {
				result.push(text.substring(s).trim());
			}
			return result;
		};

		const pairs = customSplit(contentText);
		const formattedPairs = pairs.map(pair => {
			const equalsIndex = pair.indexOf('=');
			if (equalsIndex !== -1) {
				const indent = ' '.repeat(equalsIndex + 2);
				const [firstLine, ...restLines] = pair.split(/\r?\n/);
				return [firstLine, ...restLines.map(line => indent + line)].join('\n');
			}
			return pair;
		});
		return new MarkdownString().appendCodeblock('', formattedPairs.join(',\n'));
	}
	return new MarkdownString().appendCodeblock('', contentText);
}

export function createInlineValueDecoration(lineNumber: number, contentText: string, classNamePrefix: string, column = Constants.MAX_SAFE_SMALL_INTEGER, viewportMaxCol: number = MAX_INLINE_DECORATOR_LENGTH): IModelDeltaDecoration[] {
	const rawText = contentText; // store raw text for hover message

	// Truncate contentText if it exceeds the viewport max column
	if (contentText.length > viewportMaxCol) {
		contentText = contentText.substring(0, viewportMaxCol) + '...';
	}

	return [
		{
			range: {
				startLineNumber: lineNumber,
				endLineNumber: lineNumber,
				startColumn: column,
				endColumn: column
			},
			options: {
				description: `${classNamePrefix}-inline-value-decoration-spacer`,
				after: {
					content: strings.noBreakWhitespace,
					cursorStops: InjectedTextCursorStops.None
				},
				showIfCollapsed: true,
			}
		},
		{
			range: {
				startLineNumber: lineNumber,
				endLineNumber: lineNumber,
				startColumn: column,
				endColumn: column
			},
			options: {
				description: `${classNamePrefix}-inline-value-decoration`,
				after: {
					content: replaceWsWithNoBreakWs(contentText),
					inlineClassName: `${classNamePrefix}-inline-value`,
					inlineClassNameAffectsLetterSpacing: true,
					cursorStops: InjectedTextCursorStops.None
				},
				showIfCollapsed: true,
				hoverMessage: formatHoverContent(rawText)
			}
		},
	];
}

function replaceWsWithNoBreakWs(str: string): string {
	return str.replace(/[ \t\n]/g, strings.noBreakWhitespace);
}

function createInlineValueDecorationsInsideRange(expressions: ReadonlyArray<IExpression>, ranges: Range[], model: ITextModel, wordToLineNumbersMap: Map<string, number[]>) {
	const nameValueMap = new Map<string, string>();
	for (const expr of expressions) {
		nameValueMap.set(expr.name, expr.value);
		// Limit the size of map. Too large can have a perf impact
		if (nameValueMap.size >= MAX_NUM_INLINE_VALUES) {
			break;
		}
	}

	const lineToNamesMap: Map<number, string[]> = new Map<number, string[]>();

	// Compute unique set of names on each line
	nameValueMap.forEach((_value, name) => {
		const lineNumbers = wordToLineNumbersMap.get(name);
		if (lineNumbers) {
			for (const lineNumber of lineNumbers) {
				if (ranges.some(r => lineNumber >= r.startLineNumber && lineNumber <= r.endLineNumber)) {
					if (!lineToNamesMap.has(lineNumber)) {
						lineToNamesMap.set(lineNumber, []);
					}

					if (lineToNamesMap.get(lineNumber)!.indexOf(name) === -1) {
						lineToNamesMap.get(lineNumber)!.push(name);
					}
				}
			}
		}
	});

	// Compute decorators for each line
	return [...lineToNamesMap].map(([line, names]) => ({
		line,
		variables: names.sort((first, second) => {
			const content = model.getLineContent(line);
			return content.indexOf(first) - content.indexOf(second);
		}).map(name => ({ name, value: nameValueMap.get(name)! }))
	}));
}

function getWordToLineNumbersMap(model: ITextModel, lineNumber: number, result: Map<string, number[]>) {
	const lineLength = model.getLineLength(lineNumber);
	// If line is too long then skip the line
	if (lineLength > MAX_TOKENIZATION_LINE_LEN) {
		return;
	}

	const lineContent = model.getLineContent(lineNumber);
	model.tokenization.forceTokenization(lineNumber);
	const lineTokens = model.tokenization.getLineTokens(lineNumber);
	for (let tokenIndex = 0, tokenCount = lineTokens.getCount(); tokenIndex < tokenCount; tokenIndex++) {
		const tokenType = lineTokens.getStandardTokenType(tokenIndex);

		// Token is a word and not a comment
		if (tokenType === StandardTokenType.Other) {
			DEFAULT_WORD_REGEXP.lastIndex = 0; // We assume tokens will usually map 1:1 to words if they match

			const tokenStartOffset = lineTokens.getStartOffset(tokenIndex);
			const tokenEndOffset = lineTokens.getEndOffset(tokenIndex);
			const tokenStr = lineContent.substring(tokenStartOffset, tokenEndOffset);
			const wordMatch = DEFAULT_WORD_REGEXP.exec(tokenStr);

			if (wordMatch) {

				const word = wordMatch[0];
				if (!result.has(word)) {
					result.set(word, []);
				}

				result.get(word)!.push(lineNumber);
			}
		}
	}
}

export class DebugEditorContribution implements IDebugEditorContribution {

	private toDispose: IDisposable[];
	private hoverWidget: DebugHoverWidget;
	private hoverPosition?: { position: Position; event: IMouseEvent };
	private mouseDown = false;
	private exceptionWidgetVisible: IContextKey<boolean>;
	private gutterIsHovered = false;

	private exceptionWidget: ExceptionWidget | undefined;
	private configurationWidget: FloatingEditorClickWidget | undefined;
	private readonly altListener = new MutableDisposable();
	private altPressed = false;
	private oldDecorations: IEditorDecorationsCollection;
	private readonly displayedStore = new DisposableStore();
	private editorHoverOptions: IEditorHoverOptions | undefined;
	private readonly debounceInfo: IFeatureDebounceInformation;
	private allowScrollToExceptionWidget = true;
	private shouldScrollToExceptionWidget = () => this.allowScrollToExceptionWidget;

	// Holds a Disposable that prevents the default editor hover behavior while it exists.
	private readonly defaultHoverLockout = new MutableDisposable();

	constructor(
		private editor: ICodeEditor,
		@IDebugService private readonly debugService: IDebugService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHostService private readonly hostService: IHostService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService featureDebounceService: ILanguageFeatureDebounceService,
		@IEditorService private readonly editorService: IEditorService
	) {
		this.oldDecorations = this.editor.createDecorationsCollection();
		this.debounceInfo = featureDebounceService.for(languageFeaturesService.inlineValuesProvider, 'InlineValues', { min: DEAFULT_INLINE_DEBOUNCE_DELAY });
		this.hoverWidget = this.instantiationService.createInstance(DebugHoverWidget, this.editor);
		this.toDispose = [this.defaultHoverLockout, this.altListener, this.displayedStore];
		this.registerListeners();
		this.exceptionWidgetVisible = CONTEXT_EXCEPTION_WIDGET_VISIBLE.bindTo(contextKeyService);
		this.toggleExceptionWidget();
	}

	private registerListeners(): void {
		this.toDispose.push(this.debugService.getViewModel().onDidFocusStackFrame(e => this.onFocusStackFrame(e.stackFrame)));

		// hover listeners & hover widget
		this.toDispose.push(this.editor.onMouseDown((e: IEditorMouseEvent) => this.onEditorMouseDown(e)));
		this.toDispose.push(this.editor.onMouseUp(() => this.mouseDown = false));
		this.toDispose.push(this.editor.onMouseMove((e: IEditorMouseEvent) => this.onEditorMouseMove(e)));
		this.toDispose.push(this.editor.onMouseLeave((e: IPartialEditorMouseEvent) => {
			const hoverDomNode = this.hoverWidget.getDomNode();
			if (!hoverDomNode) {
				return;
			}

			const rect = hoverDomNode.getBoundingClientRect();
			// Only hide the hover widget if the editor mouse leave event is outside the hover widget #3528
			if (e.event.posx < rect.left || e.event.posx > rect.right || e.event.posy < rect.top || e.event.posy > rect.bottom) {
				this.hideHoverWidget();
			}
		}));
		this.toDispose.push(this.editor.onKeyDown((e: IKeyboardEvent) => this.onKeyDown(e)));
		this.toDispose.push(this.editor.onDidChangeModelContent(() => {
			this._wordToLineNumbersMap = undefined;
			this.updateInlineValuesScheduler.schedule();
		}));
		this.toDispose.push(this.debugService.getViewModel().onWillUpdateViews(() => this.updateInlineValuesScheduler.schedule()));
		this.toDispose.push(this.debugService.getViewModel().onDidEvaluateLazyExpression(() => this.updateInlineValuesScheduler.schedule()));
		this.toDispose.push(this.editor.onDidChangeModel(async () => {
			this.addDocumentListeners();
			this.toggleExceptionWidget();
			this.hideHoverWidget();
			this._wordToLineNumbersMap = undefined;
			const stackFrame = this.debugService.getViewModel().focusedStackFrame;
			await this.updateInlineValueDecorations(stackFrame);
		}));
		this.toDispose.push(this.editor.onDidScrollChange(() => {
			this.hideHoverWidget();

			// Inline value provider should get called on view port change
			const model = this.editor.getModel();
			if (model && this.languageFeaturesService.inlineValuesProvider.has(model)) {
				this.updateInlineValuesScheduler.schedule();
			}
		}));
		this.toDispose.push(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('editor.hover')) {
				this.updateHoverConfiguration();
			}
		}));
		this.toDispose.push(this.debugService.onDidChangeState((state: State) => {
			if (state !== State.Stopped) {
				this.toggleExceptionWidget();
			}
		}));

		this.updateHoverConfiguration();
	}

	private _wordToLineNumbersMap: WordsToLineNumbersCache | undefined;

	private updateHoverConfiguration(): void {
		const model = this.editor.getModel();
		if (model) {
			this.editorHoverOptions = this.configurationService.getValue<IEditorHoverOptions>('editor.hover', {
				resource: model.uri,
				overrideIdentifier: model.getLanguageId()
			});
		}
	}

	private addDocumentListeners(): void {
		const stackFrame = this.debugService.getViewModel().focusedStackFrame;
		const model = this.editor.getModel();
		if (model) {
			this.applyDocumentListeners(model, stackFrame);
		}
	}

	private applyDocumentListeners(model: ITextModel, stackFrame: IStackFrame | undefined): void {
		if (!stackFrame || !this.uriIdentityService.extUri.isEqual(model.uri, stackFrame.source.uri)) {
			this.altListener.clear();
			return;
		}

		const ownerDocument = this.editor.getContainerDomNode().ownerDocument;

		// When the alt key is pressed show regular editor hover and hide the debug hover #84561
		this.altListener.value = addDisposableListener(ownerDocument, 'keydown', keydownEvent => {
			const standardKeyboardEvent = new StandardKeyboardEvent(keydownEvent);
			if (standardKeyboardEvent.keyCode === KeyCode.Alt) {
				this.altPressed = true;
				const debugHoverWasVisible = this.hoverWidget.isVisible();
				this.hoverWidget.hide();
				this.defaultHoverLockout.clear();

				if (debugHoverWasVisible && this.hoverPosition) {
					// If the debug hover was visible immediately show the editor hover for the alt transition to be smooth
					this.showEditorHover(this.hoverPosition.position, false);
				}

				const onKeyUp = new DomEmitter(ownerDocument, 'keyup');
				const listener = Event.any<KeyboardEvent | boolean>(this.hostService.onDidChangeFocus, onKeyUp.event)(keyupEvent => {
					let standardKeyboardEvent = undefined;
					if (isKeyboardEvent(keyupEvent)) {
						standardKeyboardEvent = new StandardKeyboardEvent(keyupEvent);
					}
					if (!standardKeyboardEvent || standardKeyboardEvent.keyCode === KeyCode.Alt) {
						this.altPressed = false;
						this.preventDefaultEditorHover();
						listener.dispose();
						onKeyUp.dispose();
					}
				});
			}
		});
	}

	async showHover(position: Position, focus: boolean, mouseEvent?: IMouseEvent): Promise<void> {
		// normally will already be set in `showHoverScheduler`, but public callers may hit this directly:
		this.preventDefaultEditorHover();

		const sf = this.debugService.getViewModel().focusedStackFrame;
		const model = this.editor.getModel();
		if (sf && model && this.uriIdentityService.extUri.isEqual(sf.source.uri, model.uri)) {
			const result = await this.hoverWidget.showAt(position, focus, mouseEvent);
			if (result === ShowDebugHoverResult.NOT_AVAILABLE) {
				// When no expression available fallback to editor hover
				this.showEditorHover(position, focus);
			}
		} else {
			this.showEditorHover(position, focus);
		}
	}

	private preventDefaultEditorHover() {
		if (this.defaultHoverLockout.value || this.editorHoverOptions?.enabled === 'off') {
			return;
		}

		const hoverController = this.editor.getContribution<ContentHoverController>(ContentHoverController.ID);
		hoverController?.hideContentHover();

		this.editor.updateOptions({ hover: { enabled: 'off' } });
		this.defaultHoverLockout.value = {
			dispose: () => {
				this.editor.updateOptions({
					hover: { enabled: this.editorHoverOptions?.enabled ?? 'on' }
				});
			}
		};
	}

	private showEditorHover(position: Position, focus: boolean) {
		const hoverController = this.editor.getContribution<ContentHoverController>(ContentHoverController.ID);
		const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
		// enable the editor hover, otherwise the content controller will see it
		// as disabled and hide it on the first mouse move (#193149)
		this.defaultHoverLockout.clear();
		hoverController?.showContentHover(range, HoverStartMode.Immediate, HoverStartSource.Mouse, focus);
	}

	private async onFocusStackFrame(sf: IStackFrame | undefined): Promise<void> {
		const model = this.editor.getModel();
		if (model) {
			this.applyDocumentListeners(model, sf);
			if (sf && this.uriIdentityService.extUri.isEqual(sf.source.uri, model.uri)) {
				await this.toggleExceptionWidget();
			} else {
				this.hideHoverWidget();
			}
		}

		await this.updateInlineValueDecorations(sf);
	}

	private get hoverDelay() {
		const baseDelay = this.editorHoverOptions?.delay || 0;

		// heuristic to get a 'good' but configurable delay for evaluation. The
		// debug hover can be very large, so we tend to be more conservative about
		// when to show it (#180621). With this equation:
		// - default 300ms hover => * 2   = 600ms
		// - short   100ms hover => * 2   = 200ms
		// - longer  600ms hover => * 1.5 = 900ms
		// - long   1000ms hover => * 1.0 = 1000ms
		const delayFactor = clamp(2 - (baseDelay - 300) / 600, 1, 2);

		return baseDelay * delayFactor;
	}

	@memoize
	private get showHoverScheduler() {
		const scheduler = new RunOnceScheduler(() => {
			if (this.hoverPosition && !this.altPressed) {
				this.showHover(this.hoverPosition.position, false, this.hoverPosition.event);
			}
		}, this.hoverDelay);
		this.toDispose.push(scheduler);

		return scheduler;
	}

	private hideHoverWidget(): void {
		if (this.hoverWidget.willBeVisible()) {
			this.hoverWidget.hide();
		}
		this.showHoverScheduler.cancel();
		this.defaultHoverLockout.clear();
	}

	// hover business

	private onEditorMouseDown(mouseEvent: IEditorMouseEvent): void {
		this.mouseDown = true;
		if (mouseEvent.target.type === MouseTargetType.CONTENT_WIDGET && mouseEvent.target.detail === DebugHoverWidget.ID) {
			return;
		}

		this.hideHoverWidget();
	}

	private onEditorMouseMove(mouseEvent: IEditorMouseEvent): void {
		if (this.debugService.state !== State.Stopped) {
			return;
		}

		const target = mouseEvent.target;
		const stopKey = env.isMacintosh ? 'metaKey' : 'ctrlKey';

		if (!this.altPressed) {
			if (target.type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
				this.defaultHoverLockout.clear();
				this.gutterIsHovered = true;
			} else if (this.gutterIsHovered) {
				this.gutterIsHovered = false;
				this.updateHoverConfiguration();
			}
		}

		if (
			(target.type === MouseTargetType.CONTENT_WIDGET && target.detail === DebugHoverWidget.ID)
			|| this.hoverWidget.isInSafeTriangle(mouseEvent.event.posx, mouseEvent.event.posy)
		) {
			// mouse moved on top of debug hover widget

			const sticky = this.editorHoverOptions?.sticky ?? true;
			if (sticky || this.hoverWidget.isShowingComplexValue || mouseEvent.event[stopKey]) {
				return;
			}
		}

		if (target.type === MouseTargetType.CONTENT_TEXT) {
			if (target.position && !Position.equals(target.position, this.hoverPosition?.position || null) && !this.hoverWidget.isInSafeTriangle(mouseEvent.event.posx, mouseEvent.event.posy)) {
				this.hoverPosition = { position: target.position, event: mouseEvent.event };
				// Disable the editor hover during the request to avoid flickering
				this.preventDefaultEditorHover();
				this.showHoverScheduler.schedule(this.hoverDelay);
			}
		} else if (!this.mouseDown) {
			// Do not hide debug hover when the mouse is pressed because it usually leads to accidental closing #64620
			this.hideHoverWidget();
		}
	}

	private onKeyDown(e: IKeyboardEvent): void {
		const stopKey = env.isMacintosh ? KeyCode.Meta : KeyCode.Ctrl;
		if (e.keyCode !== stopKey && e.keyCode !== KeyCode.Alt) {
			// do not hide hover when Ctrl/Meta is pressed, and alt is handled separately
			this.hideHoverWidget();
		}
	}
	// end hover business

	// exception widget
	private async toggleExceptionWidget(): Promise<void> {
		// Toggles exception widget based on the state of the current editor model and debug stack frame
		const model = this.editor.getModel();
		const focusedSf = this.debugService.getViewModel().focusedStackFrame;
		const callStack = focusedSf ? focusedSf.thread.getCallStack() : null;
		if (!model || !focusedSf || !callStack || callStack.length === 0) {
			this.closeExceptionWidget();
			return;
		}

		// First call stack frame that is available is the frame where exception has been thrown
		const exceptionSf = callStack.find(sf => !!(sf && sf.source && sf.source.available && sf.source.presentationHint !== 'deemphasize'));
		if (!exceptionSf || exceptionSf !== focusedSf) {
			this.closeExceptionWidget();
			return;
		}

		const sameUri = this.uriIdentityService.extUri.isEqual(exceptionSf.source.uri, model.uri);
		if (this.exceptionWidget && !sameUri) {
			this.closeExceptionWidget();
		} else if (sameUri) {
			// Show exception widget in all editors with the same file, but only scroll in the active editor
			const activeControl = this.editorService.activeTextEditorControl;
			const isActiveEditor = activeControl === this.editor;
			const exceptionInfo = await focusedSf.thread.exceptionInfo;

			if (exceptionInfo) {
				if (isActiveEditor) {
					// Active editor: show widget and scroll to it
					this.showExceptionWidget(exceptionInfo, this.debugService.getViewModel().focusedSession, exceptionSf.range.startLineNumber, exceptionSf.range.startColumn);
				} else {
					// Inactive editor: show widget without scrolling
					this.showExceptionWidgetWithoutScroll(exceptionInfo, this.debugService.getViewModel().focusedSession, exceptionSf.range.startLineNumber, exceptionSf.range.startColumn);
				}
			}
		}
	}

	private showExceptionWidget(exceptionInfo: IExceptionInfo, debugSession: IDebugSession | undefined, lineNumber: number, column: number): void {
		if (this.exceptionWidget) {
			this.exceptionWidget.dispose();
		}

		this.exceptionWidget = this.instantiationService.createInstance(ExceptionWidget, this.editor, exceptionInfo, debugSession, this.shouldScrollToExceptionWidget);
		this.exceptionWidget.show({ lineNumber, column }, 0);
		this.exceptionWidget.focus();
		this.editor.revealRangeInCenter({
			startLineNumber: lineNumber,
			startColumn: column,
			endLineNumber: lineNumber,
			endColumn: column,
		});
		this.exceptionWidgetVisible.set(true);
	}

	private showExceptionWidgetWithoutScroll(exceptionInfo: IExceptionInfo, debugSession: IDebugSession | undefined, lineNumber: number, column: number): void {
		if (this.exceptionWidget) {
			this.exceptionWidget.dispose();
		}

		// Disable scrolling to exception widget
		this.allowScrollToExceptionWidget = false;

		const currentScrollTop = this.editor.getScrollTop();
		const visibleRanges = this.editor.getVisibleRanges();
		if (visibleRanges.length === 0) {
			// Editor not fully initialized or not visible; skip scroll adjustment
			this.exceptionWidget = this.instantiationService.createInstance(ExceptionWidget, this.editor, exceptionInfo, debugSession, this.shouldScrollToExceptionWidget);
			this.exceptionWidget.show({ lineNumber, column }, 0);
			this.exceptionWidgetVisible.set(true);
			this.allowScrollToExceptionWidget = true;
			return;
		}

		const firstVisibleLine = visibleRanges[0].startLineNumber;

		// Create widget - this may add a zone that pushes content down
		this.exceptionWidget = this.instantiationService.createInstance(ExceptionWidget, this.editor, exceptionInfo, debugSession, this.shouldScrollToExceptionWidget);
		this.exceptionWidget.show({ lineNumber, column }, 0);
		this.exceptionWidgetVisible.set(true);

		// only adjust scroll if the exception widget is above the first visible line
		if (lineNumber < firstVisibleLine) {
			// Get the actual height of the widget that was just added from the whitespace
			// The whitespace height is more accurate than the container height
			const scrollAdjustment = this.exceptionWidget.getWhitespaceHeight();

			// Scroll down by the actual widget height to keep the first visible line the same
			this.editor.setScrollTop(currentScrollTop + scrollAdjustment, ScrollType.Immediate);
		}

		// Re-enable scrolling to exception widget
		this.allowScrollToExceptionWidget = true;
	}

	closeExceptionWidget(): void {
		if (this.exceptionWidget) {
			const shouldFocusEditor = this.exceptionWidget.hasFocus();
			this.exceptionWidget.dispose();
			this.exceptionWidget = undefined;
			this.exceptionWidgetVisible.set(false);
			if (shouldFocusEditor) {
				this.editor.focus();
			}
		}
	}

	async addLaunchConfiguration(): Promise<void> {
		const model = this.editor.getModel();
		if (!model) {
			return;
		}

		let configurationsArrayPosition: Position | undefined;
		let lastProperty: string;

		const getConfigurationPosition = () => {
			let depthInArray = 0;
			visit(model.getValue(), {
				onObjectProperty: (property: string) => {
					lastProperty = property;
				},
				onArrayBegin: (offset: number) => {
					if (lastProperty === 'configurations' && depthInArray === 0) {
						configurationsArrayPosition = model.getPositionAt(offset + 1);
					}
					depthInArray++;
				},
				onArrayEnd: () => {
					depthInArray--;
				}
			});
		};

		getConfigurationPosition();

		if (!configurationsArrayPosition) {
			// "configurations" array doesn't exist. Add it here.
			const { tabSize, insertSpaces } = model.getOptions();
			const eol = model.getEOL();
			const edit = (basename(model.uri.fsPath) === 'launch.json') ?
				setProperty(model.getValue(), ['configurations'], [], { tabSize, insertSpaces, eol })[0] :
				setProperty(model.getValue(), ['launch'], { 'configurations': [] }, { tabSize, insertSpaces, eol })[0];
			const startPosition = model.getPositionAt(edit.offset);
			const lineNumber = startPosition.lineNumber;
			const range = new Range(lineNumber, startPosition.column, lineNumber, model.getLineMaxColumn(lineNumber));
			model.pushEditOperations(null, [EditOperation.replace(range, edit.content)], () => null);
			// Go through the file again since we've edited it
			getConfigurationPosition();
		}
		if (!configurationsArrayPosition) {
			return;
		}

		this.editor.focus();

		const insertLine = (position: Position): Promise<any> => {
			// Check if there are more characters on a line after a "configurations": [, if yes enter a newline
			if (model.getLineLastNonWhitespaceColumn(position.lineNumber) > position.column) {
				this.editor.setPosition(position);
				this.instantiationService.invokeFunction((accessor) => {
					CoreEditingCommands.LineBreakInsert.runEditorCommand(accessor, this.editor, null);
				});
			}
			this.editor.setPosition(position);
			return this.commandService.executeCommand(InsertLineAfterAction.ID);
		};

		await insertLine(configurationsArrayPosition);
		await this.commandService.executeCommand('editor.action.triggerSuggest');
	}

	// Inline Decorations

	@memoize
	private get removeInlineValuesScheduler(): RunOnceScheduler {
		return new RunOnceScheduler(
			() => {
				this.displayedStore.clear();
				this.oldDecorations.clear();
			},
			100
		);
	}

	@memoize
	private get updateInlineValuesScheduler(): RunOnceScheduler {
		const model = this.editor.getModel();
		return new RunOnceScheduler(
			async () => await this.updateInlineValueDecorations(this.debugService.getViewModel().focusedStackFrame),
			model ? this.debounceInfo.get(model) : DEAFULT_INLINE_DEBOUNCE_DELAY
		);
	}

	private async updateInlineValueDecorations(stackFrame: IStackFrame | undefined): Promise<void> {

		const var_value_format = '{0} = {1}';
		const separator = ', ';

		const model = this.editor.getModel();
		const inlineValuesSetting = this.configurationService.getValue<IDebugConfiguration>('debug').inlineValues;
		const inlineValuesTurnedOn = inlineValuesSetting === true || inlineValuesSetting === 'on' || (inlineValuesSetting === 'auto' && model && this.languageFeaturesService.inlineValuesProvider.has(model));
		if (!inlineValuesTurnedOn || !model || !stackFrame || model.uri.toString() !== stackFrame.source.uri.toString()) {
			if (!this.removeInlineValuesScheduler.isScheduled()) {
				this.removeInlineValuesScheduler.schedule();
			}
			return;
		}

		this.removeInlineValuesScheduler.cancel();
		this.displayedStore.clear();

		const viewRanges = this.editor.getVisibleRangesPlusViewportAboveBelow();
		let allDecorations: IModelDeltaDecoration[];

		const cts = new CancellationTokenSource();
		this.displayedStore.add(toDisposable(() => cts.dispose(true)));

		if (this.languageFeaturesService.inlineValuesProvider.has(model)) {

			const findVariable = async (_key: string, caseSensitiveLookup: boolean): Promise<string | undefined> => {
				const scopes = await stackFrame.getMostSpecificScopes(stackFrame.range);
				const key = caseSensitiveLookup ? _key : _key.toLowerCase();
				for (const scope of scopes) {
					const variables = await scope.getChildren();
					const found = variables.find(v => caseSensitiveLookup ? (v.name === key) : (v.name.toLowerCase() === key));
					if (found) {
						return found.value;
					}
				}
				return undefined;
			};

			const ctx: InlineValueContext = {
				frameId: stackFrame.frameId,
				stoppedLocation: new Range(stackFrame.range.startLineNumber, stackFrame.range.startColumn + 1, stackFrame.range.endLineNumber, stackFrame.range.endColumn + 1)
			};

			const providers = this.languageFeaturesService.inlineValuesProvider.ordered(model).reverse();

			allDecorations = [];
			const lineDecorations = new Map<number, InlineSegment[]>();

			const promises = providers.flatMap(provider => viewRanges.map(range => Promise.resolve(provider.provideInlineValues(model, range, ctx, cts.token)).then(async (result) => {
				if (result) {
					for (const iv of result) {

						let text: string | undefined = undefined;
						switch (iv.type) {
							case 'text':
								text = iv.text;
								break;
							case 'variable': {
								let va = iv.variableName;
								if (!va) {
									const lineContent = model.getLineContent(iv.range.startLineNumber);
									va = lineContent.substring(iv.range.startColumn - 1, iv.range.endColumn - 1);
								}
								const value = await findVariable(va, iv.caseSensitiveLookup);
								if (value) {
									text = strings.format(var_value_format, va, value);
								}
								break;
							}
							case 'expression': {
								let expr = iv.expression;
								if (!expr) {
									const lineContent = model.getLineContent(iv.range.startLineNumber);
									expr = lineContent.substring(iv.range.startColumn - 1, iv.range.endColumn - 1);
								}
								if (expr) {
									const expression = new Expression(expr);
									await expression.evaluate(stackFrame.thread.session, stackFrame, 'watch', true);
									if (expression.available) {
										text = strings.format(var_value_format, expr, expression.value);
									}
								}
								break;
							}
						}

						if (text) {
							const line = iv.range.startLineNumber;
							let lineSegments = lineDecorations.get(line);
							if (!lineSegments) {
								lineSegments = [];
								lineDecorations.set(line, lineSegments);
							}
							if (!lineSegments.some(iv => iv.text === text)) {	// de-dupe
								lineSegments.push(new InlineSegment(iv.range.startColumn, text));
							}
						}
					}
				}
			}, err => {
				onUnexpectedExternalError(err);
			})));

			const startTime = Date.now();

			await Promise.all(promises);

			// update debounce info
			this.updateInlineValuesScheduler.delay = this.debounceInfo.update(model, Date.now() - startTime);

			// sort line segments and concatenate them into a decoration

			lineDecorations.forEach((segments, line) => {
				if (segments.length > 0) {
					segments = segments.sort((a, b) => a.column - b.column);
					const text = segments.map(s => s.text).join(separator);
					const editorWidth = this.editor.getLayoutInfo().width;
					const fontInfo = this.editor.getOption(EditorOption.fontInfo);
					const viewportMaxCol = Math.floor((editorWidth - 50) / fontInfo.typicalHalfwidthCharacterWidth);
					allDecorations.push(...createInlineValueDecoration(line, text, 'debug', undefined, viewportMaxCol));
				}
			});

		} else {
			// old "one-size-fits-all" strategy

			const scopes = await stackFrame.getMostSpecificScopes(stackFrame.range);
			const scopesWithVariables = await Promise.all(scopes.map(async scope =>
				({ scope, variables: await scope.getChildren() })));

			// Map of inline values per line that's populated in scope order, from
			// narrowest to widest. This is done to avoid duplicating values if
			// they appear in multiple scopes or are shadowed (#129770, #217326)
			const valuesPerLine = new Map</* line */number, Map</* var */string, /* value */ string>>();

			for (const { scope, variables } of scopesWithVariables) {
				let scopeRange = new Range(0, 0, stackFrame.range.startLineNumber, stackFrame.range.startColumn);
				if (scope.range) {
					scopeRange = scopeRange.setStartPosition(scope.range.startLineNumber, scope.range.startColumn);
				}

				const ownRanges = viewRanges.map(r => r.intersectRanges(scopeRange)).filter(isDefined);
				this._wordToLineNumbersMap ??= new WordsToLineNumbersCache(model);
				for (const range of ownRanges) {
					this._wordToLineNumbersMap.ensureRangePopulated(range);
				}

				const mapped = createInlineValueDecorationsInsideRange(variables, ownRanges, model, this._wordToLineNumbersMap.value);
				for (const { line, variables } of mapped) {
					let values = valuesPerLine.get(line);
					if (!values) {
						values = new Map<string, string>();
						valuesPerLine.set(line, values);
					}

					for (const { name, value } of variables) {
						if (!values.has(name)) {
							values.set(name, value);
						}
					}
				}
			}

			allDecorations = [...valuesPerLine.entries()].flatMap(([line, values]) => {
				const text = [...values].map(([n, v]) => `${n} = ${v}`).join(', ');
				const editorWidth = this.editor.getLayoutInfo().width;
				const fontInfo = this.editor.getOption(EditorOption.fontInfo);
				const viewportMaxCol = Math.floor((editorWidth - 50) / fontInfo.typicalHalfwidthCharacterWidth);
				return createInlineValueDecoration(line, text, 'debug', undefined, viewportMaxCol);
			});
		}

		if (cts.token.isCancellationRequested) {
			return;
		}

		// If word wrap is on, application of inline decorations may change the scroll position.
		// Ensure the cursor maintains its vertical position relative to the viewport when
		// we apply decorations.
		let preservePosition: { position: Position; top: number } | undefined;
		if (this.editor.getOption(EditorOption.wordWrap) !== 'off') {
			const position = this.editor.getPosition();
			if (position && this.editor.getVisibleRanges().some(r => r.containsPosition(position))) {
				preservePosition = { position, top: this.editor.getTopForPosition(position.lineNumber, position.column) };
			}
		}

		this.oldDecorations.set(allDecorations);

		if (preservePosition) {
			const top = this.editor.getTopForPosition(preservePosition.position.lineNumber, preservePosition.position.column);
			this.editor.setScrollTop(this.editor.getScrollTop() - (preservePosition.top - top), ScrollType.Immediate);
		}
	}

	dispose(): void {
		if (this.hoverWidget) {
			this.hoverWidget.dispose();
		}
		if (this.configurationWidget) {
			this.configurationWidget.dispose();
		}
		this.toDispose = dispose(this.toDispose);
	}
}

class WordsToLineNumbersCache {
	// we use this as an array of bits where each 1 bit is a line number that's been parsed
	private readonly intervals: Uint8Array;
	public readonly value = new Map<string, number[]>();

	constructor(private readonly model: ITextModel) {
		this.intervals = new Uint8Array(Math.ceil(model.getLineCount() / 8));
	}

	/** Ensures that variables names in the given range have been identified. */
	public ensureRangePopulated(range: Range) {
		for (let lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
			const bin = lineNumber >> 3;  /* Math.floor(i / 8) */
			const bit = 1 << (lineNumber & 0b111); /* 1 << (i % 8) */
			if (!(this.intervals[bin] & bit)) {
				getWordToLineNumbersMap(this.model, lineNumber, this.value);
				this.intervals[bin] |= bit;
			}
		}
	}
}


CommandsRegistry.registerCommand(
	'_executeInlineValueProvider',
	async (
		accessor: ServicesAccessor,
		uri: URI,
		iRange: IRange,
		context: InlineValueContext
	): Promise<InlineValue[] | null> => {
		assertType(URI.isUri(uri));
		assertType(Range.isIRange(iRange));

		if (!context || typeof context.frameId !== 'number' || !Range.isIRange(context.stoppedLocation)) {
			throw illegalArgument('context');
		}

		const model = accessor.get(IModelService).getModel(uri);
		if (!model) {
			throw illegalArgument('uri');
		}

		const range = Range.lift(iRange);
		const { inlineValuesProvider } = accessor.get(ILanguageFeaturesService);
		const providers = inlineValuesProvider.ordered(model);
		const providerResults = await Promise.all(providers.map(provider => provider.provideInlineValues(model, range, context, CancellationToken.None)));
		return providerResults.flat().filter(isDefined);
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugExpressionRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugExpressionRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IHighlight } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IDebugSession, IExpressionValue } from '../common/debug.js';
import { Expression, ExpressionContainer, Variable } from '../common/debugModel.js';
import { ReplEvaluationResult } from '../common/replModel.js';
import { IVariableTemplateData, splitExpressionOrScopeHighlights } from './baseDebugView.js';
import { handleANSIOutput } from './debugANSIHandling.js';
import { COPY_EVALUATE_PATH_ID, COPY_VALUE_ID } from './debugCommands.js';
import { DebugLinkHoverBehavior, DebugLinkHoverBehaviorTypeData, ILinkDetector, LinkDetector } from './linkDetector.js';

export interface IValueHoverOptions {
	/** Commands to show in the hover footer. */
	commands?: { id: string; args: unknown[] }[];
}

export interface IRenderValueOptions {
	showChanged?: boolean;
	maxValueLength?: number;
	/** If not false, a rich hover will be shown on the element. */
	hover?: false | IValueHoverOptions;
	colorize?: boolean;
	highlights?: IHighlight[];

	/**
	 * Indicates areas where VS Code implicitly always supported ANSI escape
	 * sequences. These should be rendered as ANSI when the DA does not specify
	 * any value of `supportsANSIStyling`.
	 * @deprecated
	 */
	wasANSI?: boolean;
	session?: IDebugSession;
	locationReference?: number;
}

export interface IRenderVariableOptions {
	showChanged?: boolean;
	highlights?: IHighlight[];
}


const MAX_VALUE_RENDER_LENGTH_IN_VIEWLET = 1024;
const booleanRegex = /^(true|false)$/i;
const stringRegex = /^(['"]).*\1$/;

const enum Cls {
	Value = 'value',
	Unavailable = 'unavailable',
	Error = 'error',
	Changed = 'changed',
	Boolean = 'boolean',
	String = 'string',
	Number = 'number',
}

const allClasses: readonly Cls[] = Object.keys({
	[Cls.Value]: 0,
	[Cls.Unavailable]: 0,
	[Cls.Error]: 0,
	[Cls.Changed]: 0,
	[Cls.Boolean]: 0,
	[Cls.String]: 0,
	[Cls.Number]: 0,
} satisfies { [key in Cls]: unknown }) as Cls[];

export class DebugExpressionRenderer {
	private displayType: IObservable<boolean>;
	private readonly linkDetector: LinkDetector;

	constructor(
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		this.linkDetector = instantiationService.createInstance(LinkDetector);
		this.displayType = observableConfigValue('debug.showVariableTypes', false, configurationService);
	}

	renderVariable(data: IVariableTemplateData, variable: Variable, options: IRenderVariableOptions = {}): IDisposable {
		const displayType = this.displayType.get();
		const highlights = splitExpressionOrScopeHighlights(variable, options.highlights || []);

		if (variable.available) {
			data.type.textContent = '';
			let text = variable.name;
			if (variable.value && typeof variable.name === 'string') {
				if (variable.type && displayType) {
					text += ': ';
					data.type.textContent = variable.type + ' =';
				} else {
					text += ' =';
				}
			}

			data.label.set(text, highlights.name, variable.type && !displayType ? variable.type : variable.name);
			data.name.classList.toggle('virtual', variable.presentationHint?.kind === 'virtual');
			data.name.classList.toggle('internal', variable.presentationHint?.visibility === 'internal');
		} else if (variable.value && typeof variable.name === 'string' && variable.name) {
			data.label.set(':');
		}

		data.expression.classList.toggle('lazy', !!variable.presentationHint?.lazy);
		const commands = [
			{ id: COPY_VALUE_ID, args: [variable, [variable]] as unknown[] }
		];
		if (variable.evaluateName) {
			commands.push({ id: COPY_EVALUATE_PATH_ID, args: [{ variable }] });
		}

		return this.renderValue(data.value, variable, {
			showChanged: options.showChanged,
			maxValueLength: MAX_VALUE_RENDER_LENGTH_IN_VIEWLET,
			hover: { commands },
			highlights: highlights.value,
			colorize: true,
			session: variable.getSession(),
		});
	}

	renderValue(container: HTMLElement, expressionOrValue: IExpressionValue | string, options: IRenderValueOptions = {}): IDisposable {
		const store = new DisposableStore();
		// Use remembered capabilities so REPL elements can render even once a session ends
		const supportsANSI: boolean = options.session?.rememberedCapabilities?.supportsANSIStyling ?? options.wasANSI ?? false;

		let value = typeof expressionOrValue === 'string' ? expressionOrValue : expressionOrValue.value;

		// remove stale classes
		for (const cls of allClasses) {
			container.classList.remove(cls);
		}
		container.classList.add(Cls.Value);
		// when resolving expressions we represent errors from the server as a variable with name === null.
		if (value === null || ((expressionOrValue instanceof Expression || expressionOrValue instanceof Variable || expressionOrValue instanceof ReplEvaluationResult) && !expressionOrValue.available)) {
			container.classList.add(Cls.Unavailable);
			if (value !== Expression.DEFAULT_VALUE) {
				container.classList.add(Cls.Error);
			}
		} else {
			if (typeof expressionOrValue !== 'string' && options.showChanged && expressionOrValue.valueChanged && value !== Expression.DEFAULT_VALUE) {
				// value changed color has priority over other colors.
				container.classList.add(Cls.Changed);
				expressionOrValue.valueChanged = false;
			}

			if (options.colorize && typeof expressionOrValue !== 'string') {
				if (expressionOrValue.type === 'number' || expressionOrValue.type === 'boolean' || expressionOrValue.type === 'string') {
					container.classList.add(expressionOrValue.type);
				} else if (!isNaN(+value)) {
					container.classList.add(Cls.Number);
				} else if (booleanRegex.test(value)) {
					container.classList.add(Cls.Boolean);
				} else if (stringRegex.test(value)) {
					container.classList.add(Cls.String);
				}
			}
		}

		if (options.maxValueLength && value && value.length > options.maxValueLength) {
			value = value.substring(0, options.maxValueLength) + '...';
		}
		if (!value) {
			value = '';
		}

		const session = options.session ?? ((expressionOrValue instanceof ExpressionContainer) ? expressionOrValue.getSession() : undefined);
		// Only use hovers for links if thre's not going to be a hover for the value.
		const hoverBehavior: DebugLinkHoverBehaviorTypeData = options.hover === false ? { type: DebugLinkHoverBehavior.Rich, store } : { type: DebugLinkHoverBehavior.None };
		dom.clearNode(container);
		const locationReference = options.locationReference ?? (expressionOrValue instanceof ExpressionContainer && expressionOrValue.valueLocationReference);

		let linkDetector: ILinkDetector = this.linkDetector;
		if (locationReference && session) {
			linkDetector = this.linkDetector.makeReferencedLinkDetector(locationReference, session);
		}

		if (supportsANSI) {
			container.appendChild(handleANSIOutput(value, linkDetector, session ? session.root : undefined, options.highlights));
		} else {
			container.appendChild(linkDetector.linkify(value, false, session?.root, true, hoverBehavior, options.highlights));
		}

		if (options.hover !== false) {
			const { commands = [] } = options.hover || {};
			store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), container, () => {
				const container = dom.$('div');
				const markdownHoverElement = dom.$('div.hover-row');
				const hoverContentsElement = dom.append(markdownHoverElement, dom.$('div.hover-contents'));
				const hoverContentsPre = dom.append(hoverContentsElement, dom.$('pre.debug-var-hover-pre'));
				if (supportsANSI) {
					// note: intentionally using `this.linkDetector` so we don't blindly linkify the
					// entire contents and instead only link file paths that it contains.
					hoverContentsPre.appendChild(handleANSIOutput(value, this.linkDetector, session ? session.root : undefined, options.highlights));
				} else {
					hoverContentsPre.textContent = value;
				}
				container.appendChild(markdownHoverElement);
				return container;
			}, {
				actions: commands.map(({ id, args }) => {
					const description = CommandsRegistry.getCommand(id)?.metadata?.description;
					return {
						label: typeof description === 'string' ? description : description ? description.value : id,
						commandId: id,
						run: () => this.commandService.executeCommand(id, ...args),
					};
				})
			}));
		}

		return store;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugHover.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { AsyncDataTree } from '../../../../base/browser/ui/tree/asyncDataTree.js';
import { ITreeContextMenuEvent } from '../../../../base/browser/ui/tree/tree.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import * as lifecycle from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../editor/browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IDimension } from '../../../../editor/common/core/2d/dimension.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import * as nls from '../../../../nls.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { asCssVariable, editorHoverBackground, editorHoverBorder, editorHoverForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IDebugService, IDebugSession, IExpression, IExpressionContainer, IStackFrame } from '../common/debug.js';
import { Expression, Variable, VisualizedExpression } from '../common/debugModel.js';
import { getEvaluatableExpressionAtPosition } from '../common/debugUtils.js';
import { AbstractExpressionDataSource } from './baseDebugView.js';
import { DebugExpressionRenderer } from './debugExpressionRenderer.js';
import { VariablesRenderer, VisualizedVariableRenderer, openContextMenuForVariableTreeElement } from './variablesView.js';

const $ = dom.$;

export const enum ShowDebugHoverResult {
	NOT_CHANGED,
	NOT_AVAILABLE,
	CANCELLED,
}

async function doFindExpression(container: IExpressionContainer, namesToFind: string[]): Promise<IExpression | null> {
	if (!container) {
		return null;
	}

	const children = await container.getChildren();
	// look for our variable in the list. First find the parents of the hovered variable if there are any.
	const filtered = children.filter(v => namesToFind[0] === v.name);
	if (filtered.length !== 1) {
		return null;
	}

	if (namesToFind.length === 1) {
		return filtered[0];
	} else {
		return doFindExpression(filtered[0], namesToFind.slice(1));
	}
}

export async function findExpressionInStackFrame(stackFrame: IStackFrame, namesToFind: string[]): Promise<IExpression | undefined> {
	const scopes = await stackFrame.getScopes();
	const nonExpensive = scopes.filter(s => !s.expensive);
	const expressions = coalesce(await Promise.all(nonExpensive.map(scope => doFindExpression(scope, namesToFind))));

	// only show if all expressions found have the same value
	return expressions.length > 0 && expressions.every(e => e.value === expressions[0].value) ? expressions[0] : undefined;
}

export class DebugHoverWidget implements IContentWidget {

	static readonly ID = 'debug.hoverWidget';
	// editor.IContentWidget.allowEditorOverflow
	readonly allowEditorOverflow = true;

	// todo@connor4312: move more properties that are only valid while a hover
	// is happening into `_isVisible`
	private _isVisible?: {
		store: lifecycle.DisposableStore;
	};
	private safeTriangle?: dom.SafeTriangle;
	private showCancellationSource?: CancellationTokenSource;
	private domNode!: HTMLElement;
	private tree!: AsyncDataTree<IExpression, IExpression, any>;
	private showAtPosition: Position | null;
	private positionPreference: ContentWidgetPositionPreference[];
	private readonly highlightDecorations: IEditorDecorationsCollection;
	private complexValueContainer!: HTMLElement;
	private complexValueTitle!: HTMLElement;
	private valueContainer!: HTMLElement;
	private treeContainer!: HTMLElement;
	private toDispose: lifecycle.IDisposable[];
	private scrollbar!: DomScrollableElement;
	private debugHoverComputer: DebugHoverComputer;
	private expressionRenderer: DebugExpressionRenderer;

	private expressionToRender: IExpression | undefined;
	private isUpdatingTree = false;

	public get isShowingComplexValue() {
		return this.complexValueContainer?.hidden === false;
	}

	constructor(
		private editor: ICodeEditor,
		@IDebugService private readonly debugService: IDebugService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		this.highlightDecorations = this.editor.createDecorationsCollection();
		this.toDispose = [];

		this.showAtPosition = null;
		this.positionPreference = [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW];
		this.debugHoverComputer = this.instantiationService.createInstance(DebugHoverComputer, this.editor);
		this.expressionRenderer = this.instantiationService.createInstance(DebugExpressionRenderer);
	}

	private create(): void {
		this.domNode = $('.debug-hover-widget');
		this.complexValueContainer = dom.append(this.domNode, $('.complex-value'));
		this.complexValueTitle = dom.append(this.complexValueContainer, $('.title'));
		this.treeContainer = dom.append(this.complexValueContainer, $('.debug-hover-tree'));
		this.treeContainer.setAttribute('role', 'tree');
		const tip = dom.append(this.complexValueContainer, $('.tip'));
		tip.textContent = nls.localize({ key: 'quickTip', comment: ['"switch to editor language hover" means to show the programming language hover widget instead of the debug hover'] }, 'Hold {0} key to switch to editor language hover', isMacintosh ? 'Option' : 'Alt');
		const dataSource = this.instantiationService.createInstance(DebugHoverDataSource);
		this.tree = this.instantiationService.createInstance(WorkbenchAsyncDataTree<IExpression, IExpression, any>, 'DebugHover', this.treeContainer, new DebugHoverDelegate(), [
			this.instantiationService.createInstance(VariablesRenderer, this.expressionRenderer),
			this.instantiationService.createInstance(VisualizedVariableRenderer, this.expressionRenderer),
		],
			dataSource, {
			accessibilityProvider: new DebugHoverAccessibilityProvider(),
			mouseSupport: false,
			horizontalScrolling: true,
			useShadows: false,
			keyboardNavigationLabelProvider: { getKeyboardNavigationLabel: (e: IExpression) => e.name },
			overrideStyles: {
				listBackground: editorHoverBackground
			}
		});

		this.toDispose.push(VisualizedVariableRenderer.rendererOnVisualizationRange(this.debugService.getViewModel(), this.tree));

		this.valueContainer = $('.value');
		this.valueContainer.tabIndex = 0;
		this.valueContainer.setAttribute('role', 'tooltip');
		this.scrollbar = new DomScrollableElement(this.valueContainer, { horizontal: ScrollbarVisibility.Hidden });
		this.domNode.appendChild(this.scrollbar.getDomNode());
		this.toDispose.push(this.scrollbar);

		this.editor.applyFontInfo(this.domNode);
		this.domNode.style.backgroundColor = asCssVariable(editorHoverBackground);
		this.domNode.style.border = `1px solid ${asCssVariable(editorHoverBorder)}`;
		this.domNode.style.color = asCssVariable(editorHoverForeground);

		this.toDispose.push(this.tree.onContextMenu(async e => await this.onContextMenu(e)));

		this.toDispose.push(this.tree.onDidChangeContentHeight(() => {
			if (!this.isUpdatingTree) {
				// Don't do a layout in the middle of the async setInput
				this.layoutTreeAndContainer();
			}
		}));
		this.toDispose.push(this.tree.onDidChangeContentWidth(() => {
			if (!this.isUpdatingTree) {
				// Don't do a layout in the middle of the async setInput
				this.layoutTreeAndContainer();
			}
		}));

		this.registerListeners();
		this.editor.addContentWidget(this);
	}

	private async onContextMenu(e: ITreeContextMenuEvent<IExpression>): Promise<void> {
		const variable = e.element;
		if (!(variable instanceof Variable) || !variable.value) {
			return;
		}

		return openContextMenuForVariableTreeElement(this.contextKeyService, this.menuService, this.contextMenuService, MenuId.DebugHoverContext, e);
	}

	private registerListeners(): void {
		this.toDispose.push(dom.addStandardDisposableListener(this.domNode, 'keydown', (e: IKeyboardEvent) => {
			if (e.equals(KeyCode.Escape)) {
				this.hide();
			}
		}));
		this.toDispose.push(this.editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this.editor.applyFontInfo(this.domNode);
			}
		}));

		this.toDispose.push(this.debugService.getViewModel().onDidEvaluateLazyExpression(async e => {
			if (e instanceof Variable && this.tree.hasNode(e)) {
				await this.tree.updateChildren(e, false, true);
				await this.tree.expand(e);
			}
		}));
	}

	isHovered(): boolean {
		return !!this.domNode?.matches(':hover');
	}

	isVisible(): boolean {
		return !!this._isVisible;
	}

	willBeVisible(): boolean {
		return !!this.showCancellationSource;
	}

	getId(): string {
		return DebugHoverWidget.ID;
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	/**
	 * Gets whether the given coordinates are in the safe triangle formed from
	 * the position at which the hover was initiated.
	 */
	isInSafeTriangle(x: number, y: number) {
		return this._isVisible && !!this.safeTriangle?.contains(x, y);
	}

	async showAt(position: Position, focus: boolean, mouseEvent?: IMouseEvent): Promise<void | ShowDebugHoverResult> {
		this.showCancellationSource?.dispose(true);
		const cancellationSource = this.showCancellationSource = new CancellationTokenSource();
		const session = this.debugService.getViewModel().focusedSession;

		if (!session || !this.editor.hasModel()) {
			this.hide();
			return ShowDebugHoverResult.NOT_AVAILABLE;
		}

		const result = await this.debugHoverComputer.compute(position, cancellationSource.token);
		if (cancellationSource.token.isCancellationRequested) {
			this.hide();
			return ShowDebugHoverResult.CANCELLED;
		}

		if (!result.range) {
			this.hide();
			return ShowDebugHoverResult.NOT_AVAILABLE;
		}

		if (this.isVisible() && !result.rangeChanged) {
			return ShowDebugHoverResult.NOT_CHANGED;
		}

		const expression = await this.debugHoverComputer.evaluate(session);
		if (cancellationSource.token.isCancellationRequested) {
			this.hide();
			return ShowDebugHoverResult.CANCELLED;
		}

		if (!expression || (expression instanceof Expression && !expression.available)) {
			this.hide();
			return ShowDebugHoverResult.NOT_AVAILABLE;
		}

		this.highlightDecorations.set([{
			range: result.range,
			options: DebugHoverWidget._HOVER_HIGHLIGHT_DECORATION_OPTIONS
		}]);

		return this.doShow(session, result.range.getStartPosition(), expression, focus, mouseEvent);
	}

	private static readonly _HOVER_HIGHLIGHT_DECORATION_OPTIONS = ModelDecorationOptions.register({
		description: 'bdebug-hover-highlight',
		className: 'hoverHighlight'
	});

	private async doShow(session: IDebugSession | undefined, position: Position, expression: IExpression, focus: boolean, mouseEvent: IMouseEvent | undefined): Promise<void> {
		if (!this.domNode) {
			this.create();
		}

		this.showAtPosition = position;
		const store = new lifecycle.DisposableStore();
		this._isVisible = { store };

		if (!expression.hasChildren) {
			this.complexValueContainer.hidden = true;
			this.valueContainer.hidden = false;
			store.add(this.expressionRenderer.renderValue(this.valueContainer, expression, {
				showChanged: false,
				colorize: true,
				hover: false,
				session,
			}));
			this.valueContainer.title = '';
			this.editor.layoutContentWidget(this);
			this.safeTriangle = mouseEvent && new dom.SafeTriangle(mouseEvent.posx, mouseEvent.posy, this.domNode);
			this.scrollbar.scanDomNode();
			if (focus) {
				this.editor.render();
				this.valueContainer.focus();
			}

			return undefined;
		}

		this.valueContainer.hidden = true;

		this.expressionToRender = expression;
		store.add(this.expressionRenderer.renderValue(this.complexValueTitle, expression, { hover: false, session }));
		this.editor.layoutContentWidget(this);
		this.safeTriangle = mouseEvent && new dom.SafeTriangle(mouseEvent.posx, mouseEvent.posy, this.domNode);
		this.tree.scrollTop = 0;
		this.tree.scrollLeft = 0;
		this.complexValueContainer.hidden = false;

		if (focus) {
			this.editor.render();
			this.tree.domFocus();
		}
	}

	private layoutTreeAndContainer(): void {
		this.layoutTree();
		this.editor.layoutContentWidget(this);
	}

	private layoutTree(): void {
		const scrollBarHeight = 10;
		let maxHeightToAvoidCursorOverlay = Infinity;
		if (this.showAtPosition) {
			const editorTop = this.editor.getDomNode()?.offsetTop || 0;
			const containerTop = this.treeContainer.offsetTop + editorTop;
			const hoveredCharTop = this.editor.getTopForLineNumber(this.showAtPosition.lineNumber, true) - this.editor.getScrollTop();
			if (containerTop < hoveredCharTop) {
				maxHeightToAvoidCursorOverlay = hoveredCharTop + editorTop - 22; // 22 is monaco top padding https://github.com/microsoft/vscode/blob/a1df2d7319382d42f66ad7f411af01e4cc49c80a/src/vs/editor/browser/viewParts/contentWidgets/contentWidgets.ts#L364
			}
		}
		const treeHeight = Math.min(Math.max(266, this.editor.getLayoutInfo().height * 0.55), this.tree.contentHeight + scrollBarHeight, maxHeightToAvoidCursorOverlay);

		const realTreeWidth = this.tree.contentWidth;
		const treeWidth = clamp(realTreeWidth, 400, 550);
		this.tree.layout(treeHeight, treeWidth);
		this.treeContainer.style.height = `${treeHeight}px`;
		this.scrollbar.scanDomNode();
	}

	beforeRender(): IDimension | null {
		// beforeRender will be called each time the hover size changes, and the content widget is layed out again.
		if (this.expressionToRender) {
			const expression = this.expressionToRender;
			this.expressionToRender = undefined;

			// Do this in beforeRender once the content widget is no longer display=none so that its elements' sizes will be measured correctly.
			this.isUpdatingTree = true;
			this.tree.setInput(expression).finally(() => {
				this.isUpdatingTree = false;
			});
		}

		return null;
	}

	afterRender(positionPreference: ContentWidgetPositionPreference | null) {
		if (positionPreference) {
			// Remember where the editor placed you to keep position stable #109226
			this.positionPreference = [positionPreference];
		}
	}


	hide(): void {
		if (this.showCancellationSource) {
			this.showCancellationSource.dispose(true);
			this.showCancellationSource = undefined;
		}

		if (!this._isVisible) {
			return;
		}

		if (dom.isAncestorOfActiveElement(this.domNode)) {
			this.editor.focus();
		}
		this._isVisible.store.dispose();
		this._isVisible = undefined;

		this.highlightDecorations.clear();
		this.editor.layoutContentWidget(this);
		this.positionPreference = [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW];
	}

	getPosition(): IContentWidgetPosition | null {
		return this._isVisible ? {
			position: this.showAtPosition,
			preference: this.positionPreference
		} : null;
	}

	dispose(): void {
		this.toDispose = lifecycle.dispose(this.toDispose);
	}
}

class DebugHoverAccessibilityProvider implements IListAccessibilityProvider<IExpression> {

	getWidgetAriaLabel(): string {
		return nls.localize('treeAriaLabel', "Debug Hover");
	}

	getAriaLabel(element: IExpression): string {
		return nls.localize({ key: 'variableAriaLabel', comment: ['Do not translate placeholders. Placeholders are name and value of a variable.'] }, "{0}, value {1}, variables, debug", element.name, element.value);
	}
}

class DebugHoverDataSource extends AbstractExpressionDataSource<IExpression, IExpression> {

	public override hasChildren(element: IExpression): boolean {
		return element.hasChildren;
	}

	protected override doGetChildren(element: IExpression): Promise<IExpression[]> {
		return element.getChildren();
	}
}

class DebugHoverDelegate implements IListVirtualDelegate<IExpression> {
	getHeight(element: IExpression): number {
		return 18;
	}

	getTemplateId(element: IExpression): string {
		if (element instanceof VisualizedExpression) {
			return VisualizedVariableRenderer.ID;
		}
		return VariablesRenderer.ID;
	}
}

interface IDebugHoverComputeResult {
	rangeChanged: boolean;
	range?: Range;
}

class DebugHoverComputer {
	private _current?: {
		range: Range;
		expression: string;
	};

	constructor(
		private editor: ICodeEditor,
		@IDebugService private readonly debugService: IDebugService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@ILogService private readonly logService: ILogService,
	) { }

	public async compute(position: Position, token: CancellationToken): Promise<IDebugHoverComputeResult> {
		const session = this.debugService.getViewModel().focusedSession;
		if (!session || !this.editor.hasModel()) {
			return { rangeChanged: false };
		}

		const model = this.editor.getModel();
		const result = await getEvaluatableExpressionAtPosition(this.languageFeaturesService, model, position, token);
		if (!result) {
			return { rangeChanged: false };
		}

		const { range, matchingExpression } = result;
		const rangeChanged = !this._current?.range.equalsRange(range);
		this._current = { expression: matchingExpression, range: Range.lift(range) };
		return { rangeChanged, range: this._current.range };
	}

	async evaluate(session: IDebugSession): Promise<IExpression | undefined> {
		if (!this._current) {
			this.logService.error('No expression to evaluate');
			return;
		}

		const textModel = this.editor.getModel();
		const debugSource = textModel && session.getSourceForUri(textModel?.uri);

		if (session.capabilities.supportsEvaluateForHovers) {
			const expression = new Expression(this._current.expression);
			await expression.evaluate(session, this.debugService.getViewModel().focusedStackFrame, 'hover', undefined, debugSource ? {
				line: this._current.range.startLineNumber,
				column: this._current.range.startColumn,
				source: debugSource.raw,
			} : undefined);
			return expression;
		} else {
			const focusedStackFrame = this.debugService.getViewModel().focusedStackFrame;
			if (focusedStackFrame) {
				return await findExpressionInStackFrame(
					focusedStackFrame,
					coalesce(this._current.expression.split('.').map(word => word.trim()))
				);
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/browser/debugIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/browser/debugIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const debugConsoleViewIcon = registerIcon('debug-console-view-icon', Codicon.debugConsole, localize('debugConsoleViewIcon', 'View icon of the debug console view.'));
export const runViewIcon = registerIcon('run-view-icon', Codicon.debugAlt, localize('runViewIcon', 'View icon of the run view.'));
export const variablesViewIcon = registerIcon('variables-view-icon', Codicon.debugAlt, localize('variablesViewIcon', 'View icon of the variables view.'));
export const watchViewIcon = registerIcon('watch-view-icon', Codicon.debugAlt, localize('watchViewIcon', 'View icon of the watch view.'));
export const callStackViewIcon = registerIcon('callstack-view-icon', Codicon.debugAlt, localize('callStackViewIcon', 'View icon of the call stack view.'));
export const breakpointsViewIcon = registerIcon('breakpoints-view-icon', Codicon.debugAlt, localize('breakpointsViewIcon', 'View icon of the breakpoints view.'));
export const loadedScriptsViewIcon = registerIcon('loaded-scripts-view-icon', Codicon.debugAlt, localize('loadedScriptsViewIcon', 'View icon of the loaded scripts view.'));

export const breakpoint = {
	regular: registerIcon('debug-breakpoint', Codicon.debugBreakpoint, localize('debugBreakpoint', 'Icon for breakpoints.')),
	disabled: registerIcon('debug-breakpoint-disabled', Codicon.debugBreakpointDisabled, localize('debugBreakpointDisabled', 'Icon for disabled breakpoints.')),
	unverified: registerIcon('debug-breakpoint-unverified', Codicon.debugBreakpointUnverified, localize('debugBreakpointUnverified', 'Icon for unverified breakpoints.')),
	pending: registerIcon('debug-breakpoint-pending', Codicon.debugBreakpointPending, localize('debugBreakpointPendingOnTrigger', 'Icon for breakpoints waiting on another breakpoint.')),
};
export const functionBreakpoint = {
	regular: registerIcon('debug-breakpoint-function', Codicon.debugBreakpointFunction, localize('debugBreakpointFunction', 'Icon for function breakpoints.')),
	disabled: registerIcon('debug-breakpoint-function-disabled', Codicon.debugBreakpointFunctionDisabled, localize('debugBreakpointFunctionDisabled', 'Icon for disabled function breakpoints.')),
	unverified: registerIcon('debug-breakpoint-function-unverified', Codicon.debugBreakpointFunctionUnverified, localize('debugBreakpointFunctionUnverified', 'Icon for unverified function breakpoints.'))
};
export const conditionalBreakpoint = {
	regular: registerIcon('debug-breakpoint-conditional', Codicon.debugBreakpointConditional, localize('debugBreakpointConditional', 'Icon for conditional breakpoints.')),
	disabled: registerIcon('debug-breakpoint-conditional-disabled', Codicon.debugBreakpointConditionalDisabled, localize('debugBreakpointConditionalDisabled', 'Icon for disabled conditional breakpoints.')),
	unverified: registerIcon('debug-breakpoint-conditional-unverified', Codicon.debugBreakpointConditionalUnverified, localize('debugBreakpointConditionalUnverified', 'Icon for unverified conditional breakpoints.'))
};
export const dataBreakpoint = {
	regular: registerIcon('debug-breakpoint-data', Codicon.debugBreakpointData, localize('debugBreakpointData', 'Icon for data breakpoints.')),
	disabled: registerIcon('debug-breakpoint-data-disabled', Codicon.debugBreakpointDataDisabled, localize('debugBreakpointDataDisabled', 'Icon for disabled data breakpoints.')),
	unverified: registerIcon('debug-breakpoint-data-unverified', Codicon.debugBreakpointDataUnverified, localize('debugBreakpointDataUnverified', 'Icon for unverified data breakpoints.')),
};
export const logBreakpoint = {
	regular: registerIcon('debug-breakpoint-log', Codicon.debugBreakpointLog, localize('debugBreakpointLog', 'Icon for log breakpoints.')),
	disabled: registerIcon('debug-breakpoint-log-disabled', Codicon.debugBreakpointLogDisabled, localize('debugBreakpointLogDisabled', 'Icon for disabled log breakpoint.')),
	unverified: registerIcon('debug-breakpoint-log-unverified', Codicon.debugBreakpointLogUnverified, localize('debugBreakpointLogUnverified', 'Icon for unverified log breakpoints.')),
};

export const debugBreakpointHint = registerIcon('debug-hint', Codicon.debugHint, localize('debugBreakpointHint', 'Icon for breakpoint hints shown on hover in editor glyph margin.'));
export const debugBreakpointUnsupported = registerIcon('debug-breakpoint-unsupported', Codicon.debugBreakpointUnsupported, localize('debugBreakpointUnsupported', 'Icon for unsupported breakpoints.'));

export const allBreakpoints = [breakpoint, functionBreakpoint, conditionalBreakpoint, dataBreakpoint, logBreakpoint];


export const debugStackframe = registerIcon('debug-stackframe', Codicon.debugStackframe, localize('debugStackframe', 'Icon for a stackframe shown in the editor glyph margin.'));
export const debugStackframeFocused = registerIcon('debug-stackframe-focused', Codicon.debugStackframeFocused, localize('debugStackframeFocused', 'Icon for a focused stackframe  shown in the editor glyph margin.'));

export const debugGripper = registerIcon('debug-gripper', Codicon.gripper, localize('debugGripper', 'Icon for the debug bar gripper.'));

export const debugRestartFrame = registerIcon('debug-restart-frame', Codicon.debugRestartFrame, localize('debugRestartFrame', 'Icon for the debug restart frame action.'));

export const debugStop = registerIcon('debug-stop', Codicon.debugStop, localize('debugStop', 'Icon for the debug stop action.'));
export const debugDisconnect = registerIcon('debug-disconnect', Codicon.debugDisconnect, localize('debugDisconnect', 'Icon for the debug disconnect action.'));
export const debugRestart = registerIcon('debug-restart', Codicon.debugRestart, localize('debugRestart', 'Icon for the debug restart action.'));
export const debugStepOver = registerIcon('debug-step-over', Codicon.debugStepOver, localize('debugStepOver', 'Icon for the debug step over action.'));
export const debugStepInto = registerIcon('debug-step-into', Codicon.debugStepInto, localize('debugStepInto', 'Icon for the debug step into action.'));
export const debugStepOut = registerIcon('debug-step-out', Codicon.debugStepOut, localize('debugStepOut', 'Icon for the debug step out action.'));
export const debugStepBack = registerIcon('debug-step-back', Codicon.debugStepBack, localize('debugStepBack', 'Icon for the debug step back action.'));
export const debugPause = registerIcon('debug-pause', Codicon.debugPause, localize('debugPause', 'Icon for the debug pause action.'));
export const debugContinue = registerIcon('debug-continue', Codicon.debugContinue, localize('debugContinue', 'Icon for the debug continue action.'));
export const debugReverseContinue = registerIcon('debug-reverse-continue', Codicon.debugReverseContinue, localize('debugReverseContinue', 'Icon for the debug reverse continue action.'));
export const debugRun = registerIcon('debug-run', Codicon.run, localize('debugRun', 'Icon for the run or debug action.'));

export const debugStart = registerIcon('debug-start', Codicon.debugStart, localize('debugStart', 'Icon for the debug start action.'));
export const debugConfigure = registerIcon('debug-configure', Codicon.gear, localize('debugConfigure', 'Icon for the debug configure action.'));
export const debugConsole = registerIcon('debug-console', Codicon.gear, localize('debugConsole', 'Icon for the debug console open action.'));
export const debugRemoveConfig = registerIcon('debug-remove-config', Codicon.trash, localize('debugRemoveConfig', 'Icon for removing debug configurations.'));

export const debugCollapseAll = registerIcon('debug-collapse-all', Codicon.collapseAll, localize('debugCollapseAll', 'Icon for the collapse all action in the debug views.'));
export const callstackViewSession = registerIcon('callstack-view-session', Codicon.bug, localize('callstackViewSession', 'Icon for the session icon in the call stack view.'));
export const debugConsoleClearAll = registerIcon('debug-console-clear-all', Codicon.clearAll, localize('debugConsoleClearAll', 'Icon for the clear all action in the debug console.'));
export const watchExpressionsRemoveAll = registerIcon('watch-expressions-remove-all', Codicon.closeAll, localize('watchExpressionsRemoveAll', 'Icon for the Remove All action in the watch view.'));
export const watchExpressionRemove = registerIcon('watch-expression-remove', Codicon.removeClose, localize('watchExpressionRemove', 'Icon for the Remove action in the watch view.'));
export const watchExpressionsAdd = registerIcon('watch-expressions-add', Codicon.add, localize('watchExpressionsAdd', 'Icon for the add action in the watch view.'));
export const watchExpressionsAddFuncBreakpoint = registerIcon('watch-expressions-add-function-breakpoint', Codicon.add, localize('watchExpressionsAddFuncBreakpoint', 'Icon for the add function breakpoint action in the watch view.'));
export const watchExpressionsAddDataBreakpoint = registerIcon('watch-expressions-add-data-breakpoint', Codicon.variableGroup, localize('watchExpressionsAddDataBreakpoint', 'Icon for the add data breakpoint action in the breakpoints view.'));

export const breakpointsRemoveAll = registerIcon('breakpoints-remove-all', Codicon.closeAll, localize('breakpointsRemoveAll', 'Icon for the Remove All action in the breakpoints view.'));
export const breakpointsActivate = registerIcon('breakpoints-activate', Codicon.activateBreakpoints, localize('breakpointsActivate', 'Icon for the activate action in the breakpoints view.'));

export const debugConsoleEvaluationInput = registerIcon('debug-console-evaluation-input', Codicon.arrowSmallRight, localize('debugConsoleEvaluationInput', 'Icon for the debug evaluation input marker.'));
export const debugConsoleEvaluationPrompt = registerIcon('debug-console-evaluation-prompt', Codicon.chevronRight, localize('debugConsoleEvaluationPrompt', 'Icon for the debug evaluation prompt.'));

export const debugInspectMemory = registerIcon('debug-inspect-memory', Codicon.fileBinary, localize('debugInspectMemory', 'Icon for the inspect memory action.'));
```

--------------------------------------------------------------------------------

````

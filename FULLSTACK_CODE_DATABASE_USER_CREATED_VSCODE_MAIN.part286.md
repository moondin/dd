---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 286
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 286 of 552)

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

---[FILE: src/vs/platform/terminal/common/capabilities/commandDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/commandDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { debounce } from '../../../../base/common/decorators.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MandatoryMutableDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ILogService } from '../../../log/common/log.js';
import { isString } from '../../../../base/common/types.js';
import { CommandInvalidationReason, ICommandDetectionCapability, ICommandInvalidationRequest, IHandleCommandOptions, ISerializedCommandDetectionCapability, ISerializedTerminalCommand, ITerminalCommand, TerminalCapability } from './capabilities.js';
import { ITerminalOutputMatcher } from '../terminal.js';
import { ICurrentPartialCommand, isFullTerminalCommand, PartialTerminalCommand, TerminalCommand } from './commandDetection/terminalCommand.js';
import { PromptInputModel, type IPromptInputModel } from './commandDetection/promptInputModel.js';
import type { IBuffer, IDisposable, IMarker, Terminal } from '@xterm/headless';

interface ITerminalDimensions {
	cols: number;
	rows: number;
}

export class CommandDetectionCapability extends Disposable implements ICommandDetectionCapability {
	readonly type = TerminalCapability.CommandDetection;

	private readonly _promptInputModel: PromptInputModel;
	get promptInputModel(): IPromptInputModel { return this._promptInputModel; }

	protected _commands: TerminalCommand[] = [];
	private _cwd: string | undefined;
	private _promptTerminator: string | undefined;
	private _currentCommand: PartialTerminalCommand;
	private _commandMarkers: IMarker[] = [];
	private _dimensions: ITerminalDimensions;
	private __isCommandStorageDisabled: boolean = false;
	private _handleCommandStartOptions?: IHandleCommandOptions;
	private _hasRichCommandDetection: boolean = false;
	get hasRichCommandDetection() { return this._hasRichCommandDetection; }
	private _nextCommandId: { command: string; commandId: string | undefined } | undefined;

	private _ptyHeuristicsHooks: ICommandDetectionHeuristicsHooks;
	private readonly _ptyHeuristics: MandatoryMutableDisposable<IPtyHeuristics>;

	get commands(): readonly TerminalCommand[] { return this._commands; }
	get executingCommand(): string | undefined { return this._currentCommand.command; }
	get executingCommandObject(): ITerminalCommand | undefined {
		if (this._currentCommand.commandStartMarker) {
			// HACK: This does a lot more than the consumer of the API needs. It's also a little
			//       misleading since it's not promoting the current command yet.
			return this._currentCommand.promoteToFullCommand(this._cwd, undefined, this._handleCommandStartOptions?.ignoreCommandLine ?? false, undefined);
		}
		return undefined;
	}
	get executingCommandConfidence(): 'low' | 'medium' | 'high' | undefined {
		const casted = this._currentCommand as PartialTerminalCommand | ITerminalCommand;
		return isFullTerminalCommand(casted) ? casted.commandLineConfidence : undefined;
	}
	get currentCommand(): ICurrentPartialCommand {
		return this._currentCommand;
	}
	get cwd(): string | undefined { return this._cwd; }
	get promptTerminator(): string | undefined { return this._promptTerminator; }

	private readonly _onCommandStarted = this._register(new Emitter<ITerminalCommand>());
	readonly onCommandStarted = this._onCommandStarted.event;
	private readonly _onCommandStartChanged = this._register(new Emitter<void>());
	readonly onCommandStartChanged = this._onCommandStartChanged.event;
	private readonly _onBeforeCommandFinished = this._register(new Emitter<ITerminalCommand>());
	readonly onBeforeCommandFinished = this._onBeforeCommandFinished.event;
	private readonly _onCommandFinished = this._register(new Emitter<ITerminalCommand>());
	readonly onCommandFinished = this._onCommandFinished.event;
	private readonly _onCommandExecuted = this._register(new Emitter<ITerminalCommand>());
	readonly onCommandExecuted = this._onCommandExecuted.event;
	private readonly _onCommandInvalidated = this._register(new Emitter<ITerminalCommand[]>());
	readonly onCommandInvalidated = this._onCommandInvalidated.event;
	private readonly _onCurrentCommandInvalidated = this._register(new Emitter<ICommandInvalidationRequest>());
	readonly onCurrentCommandInvalidated = this._onCurrentCommandInvalidated.event;
	private readonly _onSetRichCommandDetection = this._register(new Emitter<boolean>());
	readonly onSetRichCommandDetection = this._onSetRichCommandDetection.event;

	constructor(
		private readonly _terminal: Terminal,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._currentCommand = new PartialTerminalCommand(this._terminal);
		this._promptInputModel = this._register(new PromptInputModel(this._terminal, this.onCommandStarted, this.onCommandStartChanged, this.onCommandExecuted, this._logService));

		// Pull command line from the buffer if it was not set explicitly
		this._register(this.onCommandExecuted(command => {
			if (command.commandLineConfidence !== 'high') {
				// HACK: onCommandExecuted actually fired with PartialTerminalCommand
				const typedCommand = (command as ITerminalCommand | PartialTerminalCommand);
				command.command = typedCommand.extractCommandLine();
				command.commandLineConfidence = 'low';

				// ITerminalCommand
				if (isFullTerminalCommand(typedCommand)) {
					if (
						// Markers exist
						typedCommand.promptStartMarker && typedCommand.marker && typedCommand.executedMarker &&
						// Single line command
						command.command.indexOf('\n') === -1 &&
						// Start marker is not on the left-most column
						typedCommand.startX !== undefined && typedCommand.startX > 0
					) {
						command.commandLineConfidence = 'medium';
					}
				}
				// PartialTerminalCommand
				else {
					if (
						// Markers exist
						typedCommand.promptStartMarker && typedCommand.commandStartMarker && typedCommand.commandExecutedMarker &&
						// Single line command
						command.command.indexOf('\n') === -1 &&
						// Start marker is not on the left-most column
						typedCommand.commandStartX !== undefined && typedCommand.commandStartX > 0
					) {
						command.commandLineConfidence = 'medium';
					}
				}
			}
		}));

		this._register(this._terminal.parser.registerCsiHandler({ final: 'J' }, params => {
			if (params.length >= 1 && params[0] === 2) {
				if (!this._terminal.options.scrollOnEraseInDisplay) {
					this._clearCommandsInViewport();
				}
				this._currentCommand.wasCleared = true;
			}
			// We don't want to override xterm.js' default behavior, just augment it
			return false;
		}));

		// Set up platform-specific behaviors
		const that = this;
		this._ptyHeuristicsHooks = new class implements ICommandDetectionHeuristicsHooks {
			get onCurrentCommandInvalidatedEmitter() { return that._onCurrentCommandInvalidated; }
			get onCommandStartedEmitter() { return that._onCommandStarted; }
			get onCommandExecutedEmitter() { return that._onCommandExecuted; }
			get dimensions() { return that._dimensions; }
			get isCommandStorageDisabled() { return that.__isCommandStorageDisabled; }
			get commandMarkers() { return that._commandMarkers; }
			set commandMarkers(value) { that._commandMarkers = value; }
			get clearCommandsInViewport() { return that._clearCommandsInViewport.bind(that); }
		};
		this._ptyHeuristics = this._register(new MandatoryMutableDisposable(new UnixPtyHeuristics(this._terminal, this, this._ptyHeuristicsHooks, this._logService)));

		this._dimensions = {
			cols: this._terminal.cols,
			rows: this._terminal.rows
		};
		this._register(this._terminal.onResize(e => this._handleResize(e)));
		this._register(this._terminal.onCursorMove(() => this._handleCursorMove()));
	}

	private _handleResize(e: { cols: number; rows: number }) {
		this._ptyHeuristics.value.preHandleResize?.(e);
		this._dimensions.cols = e.cols;
		this._dimensions.rows = e.rows;
	}

	@debounce(500)
	private _handleCursorMove() {
		if (this._store.isDisposed) {
			return;
		}
		// Early versions of conpty do not have real support for an alt buffer, in addition certain
		// commands such as tsc watch will write to the top of the normal buffer. The following
		// checks when the cursor has moved while the normal buffer is empty and if it is above the
		// current command, all decorations within the viewport will be invalidated.
		//
		// This function is debounced so that the cursor is only checked when it is stable so
		// conpty's screen reprinting will not trigger decoration clearing.
		//
		// This is mostly a workaround for Windows but applies to all OS' because of the tsc watch
		// case.
		if (this._terminal.buffer.active === this._terminal.buffer.normal && this._currentCommand.commandStartMarker) {
			if (this._terminal.buffer.active.baseY + this._terminal.buffer.active.cursorY < this._currentCommand.commandStartMarker.line) {
				this._clearCommandsInViewport();
				this._currentCommand.isInvalid = true;
				this._onCurrentCommandInvalidated.fire({ reason: CommandInvalidationReason.Windows });
			}
		}
	}

	private _clearCommandsInViewport(): void {
		// Find the number of commands on the tail end of the array that are within the viewport
		let count = 0;
		for (let i = this._commands.length - 1; i >= 0; i--) {
			const line = this._commands[i].marker?.line;
			if (line && line < this._terminal.buffer.active.baseY) {
				break;
			}
			count++;
		}
		// Remove them
		if (count > 0) {
			this._onCommandInvalidated.fire(this._commands.splice(this._commands.length - count, count));
		}
	}

	setContinuationPrompt(value: string): void {
		this._promptInputModel.setContinuationPrompt(value);
	}

	// TODO: Simplify this, can everything work off the last line?
	setPromptTerminator(promptTerminator: string, lastPromptLine: string) {
		this._logService.debug('CommandDetectionCapability#setPromptTerminator', promptTerminator);
		this._promptTerminator = promptTerminator;
		this._promptInputModel.setLastPromptLine(lastPromptLine);
	}

	setCwd(value: string) {
		this._cwd = value;
	}

	setIsWindowsPty(value: boolean) {
		if (value && !(this._ptyHeuristics.value instanceof WindowsPtyHeuristics)) {
			const that = this;
			this._ptyHeuristics.value = new WindowsPtyHeuristics(
				this._terminal,
				this,
				new class {
					get onCurrentCommandInvalidatedEmitter() { return that._onCurrentCommandInvalidated; }
					get onCommandStartedEmitter() { return that._onCommandStarted; }
					get onCommandExecutedEmitter() { return that._onCommandExecuted; }
					get dimensions() { return that._dimensions; }
					get isCommandStorageDisabled() { return that.__isCommandStorageDisabled; }
					get commandMarkers() { return that._commandMarkers; }
					set commandMarkers(value) { that._commandMarkers = value; }
					get clearCommandsInViewport() { return that._clearCommandsInViewport.bind(that); }
				},
				this._logService
			);
		} else if (!value && !(this._ptyHeuristics.value instanceof UnixPtyHeuristics)) {
			this._ptyHeuristics.value = new UnixPtyHeuristics(this._terminal, this, this._ptyHeuristicsHooks, this._logService);
		}
	}

	setHasRichCommandDetection(value: boolean): void {
		this._hasRichCommandDetection = value;
		this._onSetRichCommandDetection.fire(value);
	}

	setIsCommandStorageDisabled(): void {
		this.__isCommandStorageDisabled = true;
	}

	getCommandForLine(line: number): ITerminalCommand | ICurrentPartialCommand | undefined {
		// Handle the current partial command first, anything below it's prompt is considered part
		// of the current command
		if (this._currentCommand.promptStartMarker && line >= this._currentCommand.promptStartMarker?.line) {
			return this._currentCommand;
		}

		// No commands
		if (this._commands.length === 0) {
			return undefined;
		}

		// Line is before any registered commands
		if ((this._commands[0].promptStartMarker ?? this._commands[0].marker!).line > line) {
			return undefined;
		}

		// Iterate backwards through commands to find the right one
		for (let i = this.commands.length - 1; i >= 0; i--) {
			if ((this.commands[i].promptStartMarker ?? this.commands[i].marker!).line <= line) {
				return this.commands[i];
			}
		}

		return undefined;
	}

	getCwdForLine(line: number): string | undefined {
		// Handle the current partial command first, anything below it's prompt is considered part
		// of the current command
		if (this._currentCommand.promptStartMarker && line >= this._currentCommand.promptStartMarker?.line) {
			return this._cwd;
		}

		const command = this.getCommandForLine(line);
		if (command && isFullTerminalCommand(command)) {
			return command.cwd;
		}

		return undefined;
	}

	handlePromptStart(options?: IHandleCommandOptions): void {
		// Adjust the last command's finished marker when needed. The standard position for the
		// finished marker `D` to appear is at the same position as the following prompt started
		// `A`. Only do this when it would not extend past the current cursor position.
		const lastCommand = this.commands.at(-1);
		if (
			lastCommand?.endMarker &&
			lastCommand?.executedMarker &&
			lastCommand.endMarker.line === lastCommand.executedMarker.line &&
			lastCommand.executedMarker.line < this._terminal.buffer.active.baseY + this._terminal.buffer.active.cursorY
		) {
			this._logService.debug('CommandDetectionCapability#handlePromptStart adjusted commandFinished', `${lastCommand.endMarker.line} -> ${lastCommand.executedMarker.line + 1}`);
			lastCommand.endMarker = cloneMarker(this._terminal, lastCommand.executedMarker, 1);
		}

		this._currentCommand.promptStartMarker = (
			options?.marker ||
			// Generally the prompt start should happen at the exact place the endmarker happened.
			// However, after ctrl+l is used to clear the display, we want to ensure the actual
			// prompt start marker position is used. This is mostly a workaround for Windows but we
			// apply it generally.
			(!this._currentCommand.wasCleared && lastCommand?.endMarker
				? cloneMarker(this._terminal, lastCommand.endMarker)
				: this._terminal.registerMarker(0))
		);
		this._currentCommand.wasCleared = false;
	}

	handleContinuationStart(): void {
		this._currentCommand.currentContinuationMarker = this._terminal.registerMarker(0);
		this._logService.debug('CommandDetectionCapability#handleContinuationStart', this._currentCommand.currentContinuationMarker);
	}

	handleContinuationEnd(): void {
		if (!this._currentCommand.currentContinuationMarker) {
			this._logService.warn('CommandDetectionCapability#handleContinuationEnd Received continuation end without start');
			return;
		}
		if (!this._currentCommand.continuations) {
			this._currentCommand.continuations = [];
		}
		this._currentCommand.continuations.push({
			marker: this._currentCommand.currentContinuationMarker,
			end: this._terminal.buffer.active.cursorX
		});
		this._currentCommand.currentContinuationMarker = undefined;
		this._logService.debug('CommandDetectionCapability#handleContinuationEnd', this._currentCommand.continuations[this._currentCommand.continuations.length - 1]);
	}

	handleRightPromptStart(): void {
		this._currentCommand.commandRightPromptStartX = this._terminal.buffer.active.cursorX;
		this._logService.debug('CommandDetectionCapability#handleRightPromptStart', this._currentCommand.commandRightPromptStartX);
	}

	handleRightPromptEnd(): void {
		this._currentCommand.commandRightPromptEndX = this._terminal.buffer.active.cursorX;
		this._logService.debug('CommandDetectionCapability#handleRightPromptEnd', this._currentCommand.commandRightPromptEndX);
	}

	handleCommandStart(options?: IHandleCommandOptions): void {
		this._handleCommandStartOptions = options;
		this._currentCommand.cwd = this._cwd;
		// Only update the column if the line has already been set
		this._currentCommand.commandStartMarker = options?.marker || this._currentCommand.commandStartMarker;
		if (this._currentCommand.commandStartMarker?.line === this._terminal.buffer.active.cursorY) {
			this._currentCommand.commandStartX = this._terminal.buffer.active.cursorX;
			this._onCommandStartChanged.fire();
			this._logService.debug('CommandDetectionCapability#handleCommandStart', this._currentCommand.commandStartX, this._currentCommand.commandStartMarker?.line);
			return;
		}
		this._ptyHeuristics.value.handleCommandStart(options);
	}

	/**
	 * Sets the command ID to use for the next command that starts.
	 * This is useful when you want to pre-assign an ID before the shell sends the command start sequence.
	 */
	setNextCommandId(command: string, commandId: string): void {
		this._nextCommandId = { command, commandId };
	}

	handleCommandExecuted(options?: IHandleCommandOptions): void {
		this._ensureCurrentCommandId(this._currentCommand.command ?? this._currentCommand.extractCommandLine());
		this._ptyHeuristics.value.handleCommandExecuted(options);
		this._currentCommand.markExecutedTime();
	}

	handleCommandFinished(exitCode: number | undefined, options?: IHandleCommandOptions): void {
		// Command executed may not have happened yet, if not handle it now so the expected events
		// properly propagate. This may cause the output to show up in the computed command line,
		// but the command line confidence will be low in the extension host for example and
		// therefore cannot be trusted anyway.
		if (!this._currentCommand.commandExecutedMarker) {
			this.handleCommandExecuted();
		}
		this._currentCommand.markFinishedTime();
		this._ptyHeuristics.value.preHandleCommandFinished?.();

		this._logService.debug('CommandDetectionCapability#handleCommandFinished', this._terminal.buffer.active.cursorX, options?.marker?.line, this._currentCommand.command, this._currentCommand);

		// HACK: Handle a special case on some versions of bash where identical commands get merged
		// in the output of `history`, this detects that case and sets the exit code to the last
		// command's exit code. This covered the majority of cases but will fail if the same command
		// runs with a different exit code, that will need a more robust fix where we send the
		// command ID and exit code over to the capability to adjust there.
		if (exitCode === undefined) {
			const lastCommand = this.commands.length > 0 ? this.commands[this.commands.length - 1] : undefined;
			if (this._currentCommand.command && this._currentCommand.command.length > 0 && lastCommand?.command === this._currentCommand.command) {
				exitCode = lastCommand.exitCode;
			}
		}

		if (this._currentCommand.commandStartMarker === undefined || !this._terminal.buffer.active) {
			return;
		}

		this._currentCommand.commandFinishedMarker = options?.marker || this._terminal.registerMarker(0);

		this._ptyHeuristics.value.postHandleCommandFinished?.();

		const newCommand = this._currentCommand.promoteToFullCommand(this._cwd, exitCode, this._handleCommandStartOptions?.ignoreCommandLine ?? false, options?.markProperties);

		if (newCommand) {
			this._commands.push(newCommand);
			this._onBeforeCommandFinished.fire(newCommand);
			// NOTE: onCommandFinished used to not fire if the command was invalid, but this causes
			// problems especially with the associated execution event never firing in the extension
			// API. See https://github.com/microsoft/vscode/issues/252489
			this._logService.debug('CommandDetectionCapability#onCommandFinished', newCommand);
			this._onCommandFinished.fire(newCommand);
		}
		// Create new command for next execution
		this._currentCommand = new PartialTerminalCommand(this._terminal);
		this._handleCommandStartOptions = undefined;
	}

	private _ensureCurrentCommandId(_commandLine: string | undefined): void {
		if (this._nextCommandId?.commandId) {
			// Assign the pre-set command ID to the current command. The timing of setNextCommandId
			// (called right before runCommand) and _ensureCurrentCommandId (called on command
			// executed) ensures we're matching the right command without needing string comparison.
			if (this._currentCommand.id !== this._nextCommandId.commandId) {
				this._currentCommand.id = this._nextCommandId.commandId;
			}
			this._nextCommandId = undefined;
		}
	}

	setCommandLine(commandLine: string, isTrusted: boolean) {
		this._logService.debug('CommandDetectionCapability#setCommandLine', commandLine, isTrusted);
		this._currentCommand.command = commandLine;
		this._currentCommand.commandLineConfidence = 'high';
		this._currentCommand.isTrusted = isTrusted;

		if (isTrusted) {
			this._promptInputModel.setConfidentCommandLine(commandLine);
		}
	}

	serialize(): ISerializedCommandDetectionCapability {
		const commands: ISerializedTerminalCommand[] = this.commands.map(e => e.serialize(this.__isCommandStorageDisabled));
		const partialCommand = this._currentCommand.serialize(this._cwd);
		if (partialCommand) {
			commands.push(partialCommand);
		}
		return {
			isWindowsPty: this._ptyHeuristics.value instanceof WindowsPtyHeuristics,
			hasRichCommandDetection: this._hasRichCommandDetection,
			commands,
			promptInputModel: this._promptInputModel.serialize(),
		};
	}

	deserialize(serialized: ISerializedCommandDetectionCapability): void {
		if (serialized.isWindowsPty) {
			this.setIsWindowsPty(serialized.isWindowsPty);
		}
		if (serialized.hasRichCommandDetection) {
			this.setHasRichCommandDetection(serialized.hasRichCommandDetection);
		}
		const buffer = this._terminal.buffer.normal;
		for (const e of serialized.commands) {
			// Partial command
			if (!e.endLine) {
				// Check for invalid command
				const marker = e.startLine !== undefined ? this._terminal.registerMarker(e.startLine - (buffer.baseY + buffer.cursorY)) : undefined;
				if (!marker) {
					continue;
				}
				this._currentCommand.commandStartMarker = e.startLine !== undefined ? this._terminal.registerMarker(e.startLine - (buffer.baseY + buffer.cursorY)) : undefined;
				this._currentCommand.commandStartX = e.startX;
				this._currentCommand.promptStartMarker = e.promptStartLine !== undefined ? this._terminal.registerMarker(e.promptStartLine - (buffer.baseY + buffer.cursorY)) : undefined;
				this._cwd = e.cwd;
				// eslint-disable-next-line local/code-no-dangerous-type-assertions
				this._onCommandStarted.fire({ marker } as ITerminalCommand);
				continue;
			}

			// Full command
			const newCommand = TerminalCommand.deserialize(this._terminal, e, this.__isCommandStorageDisabled);
			if (!newCommand) {
				continue;
			}

			this._commands.push(newCommand);
			this._logService.debug('CommandDetectionCapability#onCommandFinished', newCommand);
			this._onCommandFinished.fire(newCommand);
		}
		if (serialized.promptInputModel) {
			this._promptInputModel.deserialize(serialized.promptInputModel);
		}
	}
}

/**
 * Additional hooks to private methods on {@link CommandDetectionCapability} that are needed by the
 * heuristics objects.
 */
interface ICommandDetectionHeuristicsHooks {
	readonly onCurrentCommandInvalidatedEmitter: Emitter<ICommandInvalidationRequest>;
	readonly onCommandStartedEmitter: Emitter<ITerminalCommand>;
	readonly onCommandExecutedEmitter: Emitter<ITerminalCommand>;
	readonly dimensions: ITerminalDimensions;
	readonly isCommandStorageDisabled: boolean;

	commandMarkers: IMarker[];

	clearCommandsInViewport(): void;
}

type IPtyHeuristics = (
	// All optional methods
	Partial<UnixPtyHeuristics> & Partial<WindowsPtyHeuristics> &
	// All common methods
	(UnixPtyHeuristics | WindowsPtyHeuristics) &
	IDisposable
);

/**
 * Non-Windows-specific behavior.
 */
class UnixPtyHeuristics extends Disposable {
	constructor(
		private readonly _terminal: Terminal,
		private readonly _capability: CommandDetectionCapability,
		private readonly _hooks: ICommandDetectionHeuristicsHooks,
		private readonly _logService: ILogService
	) {
		super();
	}

	handleCommandStart(options?: IHandleCommandOptions) {
		const currentCommand = this._capability.currentCommand;
		currentCommand.commandStartX = this._terminal.buffer.active.cursorX;
		currentCommand.commandStartMarker = options?.marker || this._terminal.registerMarker(0);

		// Clear executed as it must happen after command start
		currentCommand.commandExecutedMarker?.dispose();
		currentCommand.commandExecutedMarker = undefined;
		currentCommand.commandExecutedX = undefined;
		for (const m of this._hooks.commandMarkers) {
			m.dispose();
		}
		this._hooks.commandMarkers.length = 0;

		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		this._hooks.onCommandStartedEmitter.fire({ marker: options?.marker || currentCommand.commandStartMarker, markProperties: options?.markProperties } as ITerminalCommand);
		this._logService.debug('CommandDetectionCapability#handleCommandStart', currentCommand.commandStartX, currentCommand.commandStartMarker?.line);
	}

	handleCommandExecuted(options?: IHandleCommandOptions) {
		const currentCommand = this._capability.currentCommand;
		currentCommand.commandExecutedMarker = options?.marker || this._terminal.registerMarker(0);
		currentCommand.commandExecutedX = this._terminal.buffer.active.cursorX;
		this._logService.debug('CommandDetectionCapability#handleCommandExecuted', currentCommand.commandExecutedX, currentCommand.commandExecutedMarker?.line);

		// Sanity check optional props
		if (!currentCommand.commandStartMarker || !currentCommand.commandExecutedMarker || currentCommand.commandStartX === undefined) {
			return;
		}

		currentCommand.command = this._capability.promptInputModel.ghostTextIndex > -1 ? this._capability.promptInputModel.value.substring(0, this._capability.promptInputModel.ghostTextIndex) : this._capability.promptInputModel.value;
		this._hooks.onCommandExecutedEmitter.fire(currentCommand as ITerminalCommand);
	}
}

const enum AdjustCommandStartMarkerConstants {
	MaxCheckLineCount = 10,
	Interval = 20,
	MaximumPollCount = 10,
}

/**
 * An object that integrated with and decorates the command detection capability to add heuristics
 * that adjust various markers to work better with Windows and ConPTY. This isn't depended upon the
 * frontend OS, or even the backend OS, but the `IsWindows` property which technically a non-Windows
 * client can emit (for example in tests).
 */
class WindowsPtyHeuristics extends Disposable {

	private readonly _onCursorMoveListener = this._register(new MutableDisposable());

	private _tryAdjustCommandStartMarkerScheduler?: RunOnceScheduler;
	private _tryAdjustCommandStartMarkerScannedLineCount: number = 0;
	private _tryAdjustCommandStartMarkerPollCount: number = 0;

	constructor(
		private readonly _terminal: Terminal,
		private readonly _capability: CommandDetectionCapability,
		private readonly _hooks: ICommandDetectionHeuristicsHooks,
		@ILogService private readonly _logService: ILogService,
	) {
		super();

		this._register(this._capability.onBeforeCommandFinished(command => {
			// For older Windows backends we cannot listen to CSI J, instead we assume running clear
			// or cls will clear all commands in the viewport. This is not perfect but it's right
			// most of the time.
			if (command.command.trim().toLowerCase() === 'clear' || command.command.trim().toLowerCase() === 'cls') {
				this._tryAdjustCommandStartMarkerScheduler?.cancel();
				this._tryAdjustCommandStartMarkerScheduler = undefined;
				this._hooks.clearCommandsInViewport();
				this._capability.currentCommand.isInvalid = true;
				this._hooks.onCurrentCommandInvalidatedEmitter.fire({ reason: CommandInvalidationReason.Windows });
			}
		}));
	}

	preHandleResize(e: { cols: number; rows: number }) {
		// Resize behavior is different under conpty; instead of bringing parts of the scrollback
		// back into the viewport, new lines are inserted at the bottom (ie. the same behavior as if
		// there was no scrollback).
		//
		// On resize this workaround will wait for a conpty reprint to occur by waiting for the
		// cursor to move, it will then calculate the number of lines that the commands within the
		// viewport _may have_ shifted. After verifying the content of the current line is
		// incorrect, the line after shifting is checked and if that matches delete events are fired
		// on the xterm.js buffer to move the markers.
		//
		// While a bit hacky, this approach is quite safe and seems to work great at least for pwsh.
		const baseY = this._terminal.buffer.active.baseY;
		const rowsDifference = e.rows - this._hooks.dimensions.rows;
		// Only do when rows increase, do in the next frame as this needs to happen after
		// conpty reprints the screen
		if (rowsDifference > 0) {
			this._waitForCursorMove().then(() => {
				// Calculate the number of lines the content may have shifted, this will max out at
				// scrollback count since the standard behavior will be used then
				const potentialShiftedLineCount = Math.min(rowsDifference, baseY);
				// For each command within the viewport, assume commands are in the correct order
				for (let i = this._capability.commands.length - 1; i >= 0; i--) {
					const command = this._capability.commands[i];
					if (!command.marker || command.marker.line < baseY || command.commandStartLineContent === undefined) {
						break;
					}
					const line = this._terminal.buffer.active.getLine(command.marker.line);
					if (!line || line.translateToString(true) === command.commandStartLineContent) {
						continue;
					}
					const shiftedY = command.marker.line - potentialShiftedLineCount;
					const shiftedLine = this._terminal.buffer.active.getLine(shiftedY);
					if (shiftedLine?.translateToString(true) !== command.commandStartLineContent) {
						continue;
					}
					// HACK: xterm.js doesn't expose this by design as it's an internal core
					// function an embedder could easily do damage with. Additionally, this
					// can't really be upstreamed since the event relies on shell integration to
					// verify the shifting is necessary.
					interface IXtermWithCore extends Terminal {
						_core: {
							_bufferService: {
								buffer: {
									lines: {
										onDeleteEmitter: {
											fire(data: { index: number; amount: number }): void;
										};
									};
								};
							};
						};
					}
					(this._terminal as IXtermWithCore)._core._bufferService.buffer.lines.onDeleteEmitter.fire({
						index: this._terminal.buffer.active.baseY,
						amount: potentialShiftedLineCount
					});
				}
			});
		}
	}

	handleCommandStart() {
		this._capability.currentCommand.commandStartX = this._terminal.buffer.active.cursorX;

		// On Windows track all cursor movements after the command start sequence
		this._hooks.commandMarkers.length = 0;

		const initialCommandStartMarker = this._capability.currentCommand.commandStartMarker = (
			this._capability.currentCommand.promptStartMarker
				? cloneMarker(this._terminal, this._capability.currentCommand.promptStartMarker)
				: this._terminal.registerMarker(0)
		)!;
		this._capability.currentCommand.commandStartX = 0;

		// DEBUG: Add a decoration for the original unadjusted command start position
		// if ('registerDecoration' in this._terminal) {
		// 	const d = (this._terminal as any).registerDecoration({
		// 		marker: this._capability.currentCommand.commandStartMarker,
		// 		x: this._capability.currentCommand.commandStartX
		// 	});
		// 	d?.onRender((e: HTMLElement) => {
		// 		e.textContent = 'b';
		// 		e.classList.add('xterm-sequence-decoration', 'top', 'right');
		// 		e.title = 'Initial command start position';
		// 	});
		// }

		// The command started sequence may be printed before the actual prompt is, for example a
		// multi-line prompt will typically look like this where D, A and B signify the command
		// finished, prompt started and command started sequences respectively:
		//
		//     D/my/cwdB
		//     > C
		//
		// Due to this, it's likely that this will be called before the line has been parsed.
		// Unfortunately, it is also the case that the actual command start data may not be parsed
		// by the end of the task either, so a microtask cannot be used.
		//
		// The strategy used is to begin polling and scanning downwards for up to the next 5 lines.
		// If it looks like a prompt is found, the command started location is adjusted. If the
		// command executed sequences comes in before polling is done, polling is canceled and the
		// final polling task is executed synchronously.
		this._tryAdjustCommandStartMarkerScannedLineCount = 0;
		this._tryAdjustCommandStartMarkerPollCount = 0;
		this._tryAdjustCommandStartMarkerScheduler = new RunOnceScheduler(() => this._tryAdjustCommandStartMarker(initialCommandStartMarker), AdjustCommandStartMarkerConstants.Interval);
		this._tryAdjustCommandStartMarkerScheduler.schedule();

		// TODO: Cache details about polling for the future - eg. if it always fails, stop bothering
	}

	private _tryAdjustCommandStartMarker(start: IMarker) {
		if (this._store.isDisposed) {
			return;
		}
		const buffer = this._terminal.buffer.active;
		let scannedLineCount = this._tryAdjustCommandStartMarkerScannedLineCount;
		while (scannedLineCount < AdjustCommandStartMarkerConstants.MaxCheckLineCount && start.line + scannedLineCount < buffer.baseY + this._terminal.rows) {
			if (this._cursorOnNextLine()) {
				const prompt = this._getWindowsPrompt(start.line + scannedLineCount);
				if (prompt) {
					const adjustedPrompt = isString(prompt) ? prompt : prompt.prompt;
					this._capability.currentCommand.commandStartMarker = this._terminal.registerMarker(0)!;
					if (!isString(prompt) && prompt.likelySingleLine) {
						this._logService.debug('CommandDetectionCapability#_tryAdjustCommandStartMarker adjusted promptStart', `${this._capability.currentCommand.promptStartMarker?.line} -> ${this._capability.currentCommand.commandStartMarker.line}`);
						this._capability.currentCommand.promptStartMarker?.dispose();
						this._capability.currentCommand.promptStartMarker = cloneMarker(this._terminal, this._capability.currentCommand.commandStartMarker);
						// Adjust the last command if it's not in the same position as the following
						// prompt start marker
						const lastCommand = this._capability.commands.at(-1);
						if (lastCommand && this._capability.currentCommand.commandStartMarker.line !== lastCommand.endMarker?.line) {
							lastCommand.endMarker?.dispose();
							lastCommand.endMarker = cloneMarker(this._terminal, this._capability.currentCommand.commandStartMarker);
						}
					}
					// use the regex to set the position as it's possible input has occurred
					this._capability.currentCommand.commandStartX = adjustedPrompt.length;
					this._logService.debug('CommandDetectionCapability#_tryAdjustCommandStartMarker adjusted commandStart', `${start.line} -> ${this._capability.currentCommand.commandStartMarker.line}:${this._capability.currentCommand.commandStartX}`);
					this._flushPendingHandleCommandStartTask();
					return;
				}
			}
			scannedLineCount++;
		}
		if (scannedLineCount < AdjustCommandStartMarkerConstants.MaxCheckLineCount) {
			this._tryAdjustCommandStartMarkerScannedLineCount = scannedLineCount;
			if (++this._tryAdjustCommandStartMarkerPollCount < AdjustCommandStartMarkerConstants.MaximumPollCount) {
				this._tryAdjustCommandStartMarkerScheduler?.schedule();
			} else {
				this._flushPendingHandleCommandStartTask();
			}
		} else {
			this._flushPendingHandleCommandStartTask();
		}
	}

	private _flushPendingHandleCommandStartTask() {
		// Perform final try adjust if necessary
		if (this._tryAdjustCommandStartMarkerScheduler) {
			// Max out poll count to ensure it's the last run
			this._tryAdjustCommandStartMarkerPollCount = AdjustCommandStartMarkerConstants.MaximumPollCount;
			this._tryAdjustCommandStartMarkerScheduler.flush();
			this._tryAdjustCommandStartMarkerScheduler = undefined;
		}

		if (!this._capability.currentCommand.commandExecutedMarker) {
			this._onCursorMoveListener.value = this._terminal.onCursorMove(() => {
				if (this._hooks.commandMarkers.length === 0 || this._hooks.commandMarkers[this._hooks.commandMarkers.length - 1].line !== this._terminal.buffer.active.cursorY) {
					const marker = this._terminal.registerMarker(0);
					if (marker) {
						this._hooks.commandMarkers.push(marker);
					}
				}
			});
		}

		if (this._capability.currentCommand.commandStartMarker) {
			const line = this._terminal.buffer.active.getLine(this._capability.currentCommand.commandStartMarker.line);
			if (line) {
				this._capability.currentCommand.commandStartLineContent = line.translateToString(true);
			}
		}
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		this._hooks.onCommandStartedEmitter.fire({ marker: this._capability.currentCommand.commandStartMarker } as ITerminalCommand);
		this._logService.debug('CommandDetectionCapability#_handleCommandStartWindows', this._capability.currentCommand.commandStartX, this._capability.currentCommand.commandStartMarker?.line);
	}

	handleCommandExecuted(options: IHandleCommandOptions | undefined) {
		if (this._tryAdjustCommandStartMarkerScheduler) {
			this._flushPendingHandleCommandStartTask();
		}
		// Use the gathered cursor move markers to correct the command start and executed markers
		this._onCursorMoveListener.clear();
		this._evaluateCommandMarkers();
		this._capability.currentCommand.commandExecutedX = this._terminal.buffer.active.cursorX;
		this._hooks.onCommandExecutedEmitter.fire(this._capability.currentCommand as ITerminalCommand);
		this._logService.debug('CommandDetectionCapability#handleCommandExecuted', this._capability.currentCommand.commandExecutedX, this._capability.currentCommand.commandExecutedMarker?.line);
	}

	preHandleCommandFinished() {
		if (this._capability.currentCommand.commandExecutedMarker) {
			return;
		}
		// This is done on command finished just in case command executed never happens (for example
		// PSReadLine tab completion)
		if (this._hooks.commandMarkers.length === 0) {
			// If the command start timeout doesn't happen before command finished, just use the
			// current marker.
			if (!this._capability.currentCommand.commandStartMarker) {
				this._capability.currentCommand.commandStartMarker = this._terminal.registerMarker(0);
			}
			if (this._capability.currentCommand.commandStartMarker) {
				this._hooks.commandMarkers.push(this._capability.currentCommand.commandStartMarker);
			}
		}
		this._evaluateCommandMarkers();
	}

	postHandleCommandFinished(): void {
		const currentCommand = this._capability.currentCommand;
		const commandText = currentCommand.command;
		const commandLine = currentCommand.commandStartMarker?.line;
		const executedLine = currentCommand.commandExecutedMarker?.line;
		if (
			!commandText || commandText.length === 0 ||
			commandLine === undefined || commandLine === -1 ||
			executedLine === undefined || executedLine === -1
		) {
			return;
		}

		// Scan downwards from the command start line and search for every character in the actual
		// command line. This may end up matching the wrong characters, but it shouldn't matter at
		// least in the typical case as the entire command will still get matched.
		let current = 0;
		let found = false;
		for (let i = commandLine; i <= executedLine; i++) {
			const line = this._terminal.buffer.active.getLine(i);
			if (!line) {
				break;
			}
			const text = line.translateToString(true);
			for (let j = 0; j < text.length; j++) {
				// Skip whitespace in case it was not actually rendered or could be trimmed from the
				// end of the line
				while (commandText.length < current && commandText[current] === ' ') {
					current++;
				}

				// Character match
				if (text[j] === commandText[current]) {
					current++;
				}

				// Full command match
				if (current === commandText.length) {
					// It's ambiguous whether the command executed marker should ideally appear at
					// the end of the line or at the beginning of the next line. Since it's more
					// useful for extracting the command at the end of the current line we go with
					// that.
					const wrapsToNextLine = j >= this._terminal.cols - 1;
					currentCommand.commandExecutedMarker = this._terminal.registerMarker(i - (this._terminal.buffer.active.baseY + this._terminal.buffer.active.cursorY) + (wrapsToNextLine ? 1 : 0));
					currentCommand.commandExecutedX = wrapsToNextLine ? 0 : j + 1;
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}
	}

	private _evaluateCommandMarkers(): void {
		// On Windows, use the gathered cursor move markers to correct the command start and
		// executed markers.
		if (this._hooks.commandMarkers.length === 0) {
			return;
		}
		this._hooks.commandMarkers = this._hooks.commandMarkers.sort((a, b) => a.line - b.line);
		this._capability.currentCommand.commandStartMarker = this._hooks.commandMarkers[0];
		if (this._capability.currentCommand.commandStartMarker) {
			const line = this._terminal.buffer.active.getLine(this._capability.currentCommand.commandStartMarker.line);
			if (line) {
				this._capability.currentCommand.commandStartLineContent = line.translateToString(true);
			}
		}
		this._capability.currentCommand.commandExecutedMarker = this._hooks.commandMarkers[this._hooks.commandMarkers.length - 1];
		// Fire this now to prevent issues like #197409
		this._hooks.onCommandExecutedEmitter.fire(this._capability.currentCommand as ITerminalCommand);
	}

	private _cursorOnNextLine(): boolean {
		const lastCommand = this._capability.commands.at(-1);

		// There is only a single command, so this check is unnecessary
		if (!lastCommand) {
			return true;
		}

		const cursorYAbsolute = this._terminal.buffer.active.baseY + this._terminal.buffer.active.cursorY;
		// If the cursor position is within the last command, we should poll.
		const lastCommandYAbsolute = (lastCommand.endMarker ? lastCommand.endMarker.line : lastCommand.marker?.line) ?? -1;
		return cursorYAbsolute > lastCommandYAbsolute;
	}

	private _waitForCursorMove(): Promise<void> {
		const cursorX = this._terminal.buffer.active.cursorX;
		const cursorY = this._terminal.buffer.active.cursorY;
		let totalDelay = 0;
		return new Promise<void>((resolve, reject) => {
			const interval = setInterval(() => {
				if (cursorX !== this._terminal.buffer.active.cursorX || cursorY !== this._terminal.buffer.active.cursorY) {
					resolve();
					clearInterval(interval);
					return;
				}
				totalDelay += 10;
				if (totalDelay > 1000) {
					clearInterval(interval);
					resolve();
				}
			}, 10);
		});
	}

	private _getWindowsPrompt(y: number = this._terminal.buffer.active.baseY + this._terminal.buffer.active.cursorY): string | { prompt: string; likelySingleLine: true } | undefined {
		const line = this._terminal.buffer.active.getLine(y);
		if (!line) {
			return;
		}
		const lineText = line.translateToString(true);
		if (!lineText) {
			return;
		}

		// PowerShell
		const pwshPrompt = lineText.match(/(?<prompt>(\(.+\)\s)?(?:PS.+>\s?))/)?.groups?.prompt;
		if (pwshPrompt) {
			const adjustedPrompt = this._adjustPrompt(pwshPrompt, lineText, '>');
			if (adjustedPrompt) {
				return {
					prompt: adjustedPrompt,
					likelySingleLine: true
				};
			}
		}

		// Custom prompts like starship end in the common \u276f character
		const customPrompt = lineText.match(/.*\u276f(?=[^\u276f]*$)/g)?.[0];
		if (customPrompt) {
			const adjustedPrompt = this._adjustPrompt(customPrompt, lineText, '\u276f');
			if (adjustedPrompt) {
				return adjustedPrompt;
			}
		}

		// Bash Prompt
		const bashPrompt = lineText.match(/^(?<prompt>\$)/)?.groups?.prompt;
		if (bashPrompt) {
			const adjustedPrompt = this._adjustPrompt(bashPrompt, lineText, '$');
			if (adjustedPrompt) {
				return adjustedPrompt;
			}
		}

		// Python Prompt
		const pythonPrompt = lineText.match(/^(?<prompt>>>> )/g)?.groups?.prompt;
		if (pythonPrompt) {
			return {
				prompt: pythonPrompt,
				likelySingleLine: true
			};
		}

		// Dynamic prompt detection
		if (this._capability.promptTerminator && (lineText === this._capability.promptTerminator || lineText.trim().endsWith(this._capability.promptTerminator))) {
			const adjustedPrompt = this._adjustPrompt(lineText, lineText, this._capability.promptTerminator);
			if (adjustedPrompt) {
				return adjustedPrompt;
			}
		}

		// Command Prompt
		const cmdMatch = lineText.match(/^(?<prompt>(\(.+\)\s)?(?:[A-Z]:\\.*>))/);
		return cmdMatch?.groups?.prompt ? {
			prompt: cmdMatch.groups.prompt,
			likelySingleLine: true
		} : undefined;
	}

	private _adjustPrompt(prompt: string | undefined, lineText: string, char: string): string | undefined {
		if (!prompt) {
			return;
		}
		// Conpty may not 'render' the space at the end of the prompt
		if (lineText === prompt && prompt.endsWith(char)) {
			prompt += ' ';
		}
		return prompt;
	}
}

export function getLinesForCommand(buffer: IBuffer, command: ITerminalCommand, cols: number, outputMatcher?: ITerminalOutputMatcher): string[] | undefined {
	if (!outputMatcher) {
		return undefined;
	}
	const executedMarker = command.executedMarker;
	const endMarker = command.endMarker;
	if (!executedMarker || !endMarker) {
		return undefined;
	}
	const startLine = executedMarker.line;
	const endLine = endMarker.line;

	const linesToCheck = outputMatcher.length;
	const lines: string[] = [];
	if (outputMatcher.anchor === 'bottom') {
		for (let i = endLine - (outputMatcher.offset || 0); i >= startLine; i--) {
			let wrappedLineStart = i;
			const wrappedLineEnd = i;
			while (wrappedLineStart >= startLine && buffer.getLine(wrappedLineStart)?.isWrapped) {
				wrappedLineStart--;
			}
			i = wrappedLineStart;
			lines.unshift(getXtermLineContent(buffer, wrappedLineStart, wrappedLineEnd, cols));
			if (lines.length > linesToCheck) {
				lines.pop();
			}
		}
	} else {
		for (let i = startLine + (outputMatcher.offset || 0); i < endLine; i++) {
			const wrappedLineStart = i;
			let wrappedLineEnd = i;
			while (wrappedLineEnd + 1 < endLine && buffer.getLine(wrappedLineEnd + 1)?.isWrapped) {
				wrappedLineEnd++;
			}
			i = wrappedLineEnd;
			lines.push(getXtermLineContent(buffer, wrappedLineStart, wrappedLineEnd, cols));
			if (lines.length === linesToCheck) {
				lines.shift();
			}
		}
	}
	return lines;
}

function getXtermLineContent(buffer: IBuffer, lineStart: number, lineEnd: number, cols: number): string {
	// Cap the maximum number of lines generated to prevent potential performance problems. This is
	// more of a sanity check as the wrapped line should already be trimmed down at this point.
	const maxLineLength = Math.max(2048 / cols * 2);
	lineEnd = Math.min(lineEnd, lineStart + maxLineLength);
	let content = '';
	for (let i = lineStart; i <= lineEnd; i++) {
		// Make sure only 0 to cols are considered as resizing when windows mode is enabled will
		// retain buffer data outside of the terminal width as reflow is disabled.
		const line = buffer.getLine(i);
		if (line) {
			content += line.translateToString(true, 0, cols);
		}
	}
	return content;
}

function cloneMarker(xterm: Terminal, marker: IMarker, offset: number = 0): IMarker | undefined {
	return xterm.registerMarker(marker.line - (xterm.buffer.active.baseY + xterm.buffer.active.cursorY) + offset);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/cwdDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/cwdDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICwdDetectionCapability, TerminalCapability } from './capabilities.js';

export class CwdDetectionCapability extends Disposable implements ICwdDetectionCapability {
	readonly type = TerminalCapability.CwdDetection;
	private _cwd = '';
	private _cwds = new Map</*cwd*/string, /*frequency*/number>();

	/**
	 * Gets the list of cwds seen in this session in order of last accessed.
	 */
	get cwds(): string[] {
		return Array.from(this._cwds.keys());
	}

	private readonly _onDidChangeCwd = this._register(new Emitter<string>());
	readonly onDidChangeCwd = this._onDidChangeCwd.event;

	getCwd(): string {
		return this._cwd;
	}

	updateCwd(cwd: string): void {
		const didChange = this._cwd !== cwd;
		this._cwd = cwd;
		const count = this._cwds.get(this._cwd) || 0;
		this._cwds.delete(this._cwd); // Delete to put it at the bottom of the iterable
		this._cwds.set(this._cwd, count + 1);
		if (didChange) {
			this._onDidChangeCwd.fire(cwd);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/naiveCwdDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/naiveCwdDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { ITerminalChildProcess } from '../terminal.js';
import { TerminalCapability, INaiveCwdDetectionCapability } from './capabilities.js';

export class NaiveCwdDetectionCapability implements INaiveCwdDetectionCapability {
	constructor(private readonly _process: ITerminalChildProcess) { }
	readonly type = TerminalCapability.NaiveCwdDetection;
	private _cwd = '';

	private readonly _onDidChangeCwd = new Emitter<string>();
	readonly onDidChangeCwd = this._onDidChangeCwd.event;

	async getCwd(): Promise<string> {
		if (!this._process) {
			return Promise.resolve('');
		}
		const newCwd = await this._process.getCwd();
		if (newCwd !== this._cwd) {
			this._onDidChangeCwd.fire(newCwd);
		}
		this._cwd = newCwd;
		return this._cwd;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/partialCommandDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/partialCommandDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IPartialCommandDetectionCapability, TerminalCapability } from './capabilities.js';
import type { IMarker, Terminal } from '@xterm/headless';

const enum Constants {
	/**
	 * The minimum size of the prompt in which to assume the line is a command.
	 */
	MinimumPromptLength = 2
}

/**
 * This capability guesses where commands are based on where the cursor was when enter was pressed.
 * It's very hit or miss but it's often correct and better than nothing.
 */
export class PartialCommandDetectionCapability extends DisposableStore implements IPartialCommandDetectionCapability {
	readonly type = TerminalCapability.PartialCommandDetection;

	private readonly _commands: IMarker[] = [];

	get commands(): readonly IMarker[] { return this._commands; }

	private readonly _onCommandFinished = this.add(new Emitter<IMarker>());
	readonly onCommandFinished = this._onCommandFinished.event;

	constructor(
		private readonly _terminal: Terminal,
		private _onDidExecuteText: Event<void> | undefined
	) {
		super();
		this.add(this._terminal.onData(e => this._onData(e)));
		this.add(this._terminal.parser.registerCsiHandler({ final: 'J' }, params => {
			if (params.length >= 1 && (params[0] === 2 || params[0] === 3)) {
				this._clearCommandsInViewport();
			}
			// We don't want to override xterm.js' default behavior, just augment it
			return false;
		}));
		if (this._onDidExecuteText) {
			this.add(this._onDidExecuteText(() => this._onEnter()));
		}
	}

	private _onData(data: string): void {
		if (data === '\x0d') {
			this._onEnter();
		}
	}

	private _onEnter(): void {
		if (!this._terminal) {
			return;
		}
		if (this._terminal.buffer.active.cursorX >= Constants.MinimumPromptLength) {
			const marker = this._terminal.registerMarker(0);
			if (marker) {
				this._commands.push(marker);
				this._onCommandFinished.fire(marker);
			}
		}
	}

	private _clearCommandsInViewport(): void {
		// Find the number of commands on the tail end of the array that are within the viewport
		let count = 0;
		for (let i = this._commands.length - 1; i >= 0; i--) {
			if (this._commands[i].line < this._terminal.buffer.active.baseY) {
				break;
			}
			count++;
		}
		// Remove them
		this._commands.splice(this._commands.length - count, count);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/promptTypeDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/promptTypeDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IPromptTypeDetectionCapability, TerminalCapability } from './capabilities.js';

export class PromptTypeDetectionCapability extends Disposable implements IPromptTypeDetectionCapability {
	readonly type = TerminalCapability.PromptTypeDetection;

	private _promptType: string | undefined;
	get promptType(): string | undefined { return this._promptType; }

	private readonly _onPromptTypeChanged = this._register(new Emitter<string | undefined>());
	readonly onPromptTypeChanged = this._onPromptTypeChanged.event;

	setPromptType(value: string): void {
		this._promptType = value;
		this._onPromptTypeChanged.fire(value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/shellEnvDetectionCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/shellEnvDetectionCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IShellEnvDetectionCapability, TerminalCapability, TerminalShellIntegrationEnvironment } from './capabilities.js';
import { Emitter } from '../../../../base/common/event.js';
import { equals } from '../../../../base/common/objects.js';
import { mapsStrictEqualIgnoreOrder } from '../../../../base/common/map.js';

export interface IShellEnv {
	value: Map<string, string>;
	isTrusted: boolean;
}

export class ShellEnvDetectionCapability extends Disposable implements IShellEnvDetectionCapability {
	readonly type = TerminalCapability.ShellEnvDetection;

	private _pendingEnv: IShellEnv | undefined;
	private _env: IShellEnv = { value: new Map(), isTrusted: true };

	get env(): TerminalShellIntegrationEnvironment {
		return this._createStateObject();
	}

	private readonly _onDidChangeEnv = this._register(new Emitter<TerminalShellIntegrationEnvironment>());
	readonly onDidChangeEnv = this._onDidChangeEnv.event;

	setEnvironment(env: { [key: string]: string | undefined }, isTrusted: boolean): void {
		if (equals(this.env.value, env)) {
			return;
		}

		this._env.value.clear();
		for (const [key, value] of Object.entries(env)) {
			if (value !== undefined) {
				this._env.value.set(key, value);
			}
		}
		this._env.isTrusted = isTrusted;

		this._fireEnvChange();
	}

	startEnvironmentSingleVar(clear: boolean, isTrusted: boolean): void {
		if (clear) {
			this._pendingEnv = {
				value: new Map(),
				isTrusted
			};
		} else {
			this._pendingEnv = {
				value: new Map(this._env.value),
				isTrusted: this._env.isTrusted && isTrusted
			};
		}

	}

	setEnvironmentSingleVar(key: string, value: string | undefined, isTrusted: boolean): void {
		if (!this._pendingEnv) {
			return;
		}
		if (key !== undefined && value !== undefined) {
			this._pendingEnv.value.set(key, value);
			this._pendingEnv.isTrusted &&= isTrusted;
		}
	}

	endEnvironmentSingleVar(isTrusted: boolean): void {
		if (!this._pendingEnv) {
			return;
		}
		this._pendingEnv.isTrusted &&= isTrusted;
		const envDiffers = !mapsStrictEqualIgnoreOrder(this._env.value, this._pendingEnv.value);
		if (envDiffers) {
			this._env = this._pendingEnv;
			this._fireEnvChange();
		}
		this._pendingEnv = undefined;
	}

	deleteEnvironmentSingleVar(key: string, value: string | undefined, isTrusted: boolean): void {
		if (!this._pendingEnv) {
			return;
		}
		if (key !== undefined && value !== undefined) {
			this._pendingEnv.value.delete(key);
			this._pendingEnv.isTrusted &&= isTrusted;
		}
	}

	private _fireEnvChange(): void {
		this._onDidChangeEnv.fire(this._createStateObject());
	}

	private _createStateObject(): TerminalShellIntegrationEnvironment {
		return {
			value: Object.fromEntries(this._env.value),
			isTrusted: this._env.isTrusted
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/terminalCapabilityStore.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/terminalCapabilityStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICommandDetectionCapability, ITerminalCapabilityImplMap, ITerminalCapabilityStore, TerminalCapability, type AnyTerminalCapabilityChangeEvent, type ICwdDetectionCapability } from './capabilities.js';

export class TerminalCapabilityStore extends Disposable implements ITerminalCapabilityStore {
	private _map: Map<TerminalCapability, ITerminalCapabilityImplMap[TerminalCapability]> = new Map();

	private readonly _onDidAddCapability = this._register(new Emitter<AnyTerminalCapabilityChangeEvent>());
	get onDidAddCapability() { return this._onDidAddCapability.event; }
	private readonly _onDidRemoveCapability = this._register(new Emitter<AnyTerminalCapabilityChangeEvent>());
	get onDidRemoveCapability() { return this._onDidRemoveCapability.event; }

	@memoize
	get onDidChangeCapabilities() {
		return Event.map(Event.any(
			this._onDidAddCapability.event,
			this._onDidRemoveCapability.event
		), () => void 0, this._store);
	}
	@memoize
	get onDidAddCommandDetectionCapability() {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === TerminalCapability.CommandDetection, this._store), e => e.capability as ICommandDetectionCapability, this._store);
	}
	@memoize
	get onDidRemoveCommandDetectionCapability() {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === TerminalCapability.CommandDetection, this._store), () => void 0, this._store);
	}
	@memoize
	get onDidAddCwdDetectionCapability() {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === TerminalCapability.CwdDetection, this._store), e => e.capability as ICwdDetectionCapability, this._store);
	}
	@memoize
	get onDidRemoveCwdDetectionCapability() {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === TerminalCapability.CwdDetection, this._store), () => void 0, this._store);
	}

	get items(): IterableIterator<TerminalCapability> {
		return this._map.keys();
	}

	createOnDidRemoveCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]> {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === type), e => e.capability as ITerminalCapabilityImplMap[T]);
	}
	createOnDidAddCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]> {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === type), e => e.capability as ITerminalCapabilityImplMap[T]);
	}

	add<T extends TerminalCapability>(capability: T, impl: ITerminalCapabilityImplMap[T]) {
		this._map.set(capability, impl);
		this._onDidAddCapability.fire(createCapabilityEvent(capability, impl));
	}

	get<T extends TerminalCapability>(capability: T): ITerminalCapabilityImplMap[T] | undefined {
		// HACK: This isn't totally safe since the Map key and value are not connected
		return this._map.get(capability) as ITerminalCapabilityImplMap[T] | undefined;
	}

	remove(capability: TerminalCapability) {
		const impl = this._map.get(capability);
		if (!impl) {
			return;
		}
		this._map.delete(capability);
		this._onDidRemoveCapability.fire(createCapabilityEvent(capability, impl));
	}

	has(capability: TerminalCapability) {
		return this._map.has(capability);
	}
}

export class TerminalCapabilityStoreMultiplexer extends Disposable implements ITerminalCapabilityStore {
	readonly _stores: ITerminalCapabilityStore[] = [];

	private readonly _onDidAddCapability = this._register(new Emitter<AnyTerminalCapabilityChangeEvent>());
	get onDidAddCapability() { return this._onDidAddCapability.event; }
	private readonly _onDidRemoveCapability = this._register(new Emitter<AnyTerminalCapabilityChangeEvent>());
	get onDidRemoveCapability() { return this._onDidRemoveCapability.event; }

	@memoize
	get onDidChangeCapabilities() {
		return Event.map(Event.any(
			this._onDidAddCapability.event,
			this._onDidRemoveCapability.event
		), () => void 0, this._store);
	}
	@memoize
	get onDidAddCommandDetectionCapability() {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === TerminalCapability.CommandDetection, this._store), e => e.capability as ICommandDetectionCapability, this._store);
	}
	@memoize
	get onDidRemoveCommandDetectionCapability() {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === TerminalCapability.CommandDetection, this._store), () => void 0, this._store);
	}
	@memoize
	get onDidAddCwdDetectionCapability() {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === TerminalCapability.CwdDetection, this._store), e => e.capability as ICwdDetectionCapability, this._store);
	}
	@memoize
	get onDidRemoveCwdDetectionCapability() {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === TerminalCapability.CwdDetection, this._store), () => void 0, this._store);
	}

	get items(): IterableIterator<TerminalCapability> {
		return this._items();
	}

	createOnDidRemoveCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]> {
		return Event.map(Event.filter(this.onDidRemoveCapability, e => e.id === type), e => e.capability as ITerminalCapabilityImplMap[T]);
	}
	createOnDidAddCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]> {
		return Event.map(Event.filter(this.onDidAddCapability, e => e.id === type), e => e.capability as ITerminalCapabilityImplMap[T]);
	}

	private *_items(): IterableIterator<TerminalCapability> {
		for (const store of this._stores) {
			for (const c of store.items) {
				yield c;
			}
		}
	}

	has(capability: TerminalCapability): boolean {
		for (const store of this._stores) {
			for (const c of store.items) {
				if (c === capability) {
					return true;
				}
			}
		}
		return false;
	}

	get<T extends TerminalCapability>(capability: T): ITerminalCapabilityImplMap[T] | undefined {
		for (const store of this._stores) {
			const c = store.get(capability);
			if (c) {
				return c;
			}
		}
		return undefined;
	}

	add(store: ITerminalCapabilityStore) {
		this._stores.push(store);
		for (const capability of store.items) {
			this._onDidAddCapability.fire(createCapabilityEvent(capability, store.get(capability)!));
		}
		this._register(store.onDidAddCapability(e => this._onDidAddCapability.fire(e)));
		this._register(store.onDidRemoveCapability(e => this._onDidRemoveCapability.fire(e)));
	}
}

function createCapabilityEvent<T extends TerminalCapability>(capability: T, impl: ITerminalCapabilityImplMap[T]): AnyTerminalCapabilityChangeEvent {
	// HACK: This cast is required to convert a generic type to a discriminated union, this is
	// necessary in order to enable type narrowing on the event consumer side.
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	return { id: capability, capability: impl } as AnyTerminalCapabilityChangeEvent;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/commandDetection/promptInputModel.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/commandDetection/promptInputModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IBuffer, IBufferCell, IBufferLine, IMarker, Terminal } from '@xterm/headless';
import { throttle } from '../../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ILogService, LogLevel } from '../../../../log/common/log.js';
import { PosixShellType, TerminalShellType } from '../../terminal.js';
import type { ITerminalCommand } from '../capabilities.js';

export const enum PromptInputState {
	Unknown = 0,
	Input = 1,
	Execute = 2,
}

/**
 * A model of the prompt input state using shell integration and analyzing the terminal buffer. This
 * may not be 100% accurate but provides a best guess.
 */
export interface IPromptInputModel extends IPromptInputModelState {
	readonly state: PromptInputState;

	readonly onDidStartInput: Event<IPromptInputModelState>;
	readonly onDidChangeInput: Event<IPromptInputModelState>;
	readonly onDidFinishInput: Event<IPromptInputModelState>;
	/**
	 * Fires immediately before {@link onDidFinishInput} when a SIGINT/Ctrl+C/^C is detected.
	 */
	readonly onDidInterrupt: Event<IPromptInputModelState>;

	/**
	 * Gets the prompt input as a user-friendly string where `|` is the cursor position and `[` and
	 * `]` wrap any ghost text.
	 *
	 * @param emptyStringWhenEmpty If true, an empty string is returned when the prompt input is
	 * empty (as opposed to '|').
	 */
	getCombinedString(emptyStringWhenEmpty?: boolean): string;

	setShellType(shellType?: TerminalShellType): void;
}

export interface IPromptInputModelState {
	/**
	 * The full prompt input include ghost text.
	 */
	readonly value: string;
	/**
	 * The prompt input up to the cursor index, this will always exclude the ghost text.
	 */
	readonly prefix: string;
	/**
	 * The prompt input from the cursor to the end, this _does not_ include ghost text.
	 */
	readonly suffix: string;
	/**
	 * The index of the cursor in {@link value}.
	 */
	readonly cursorIndex: number;
	/**
	 * The index of the start of ghost text in {@link value}. This is -1 when there is no ghost
	 * text.
	 */
	readonly ghostTextIndex: number;
}

export interface ISerializedPromptInputModel {
	readonly modelState: IPromptInputModelState;
	readonly commandStartX: number;
	readonly lastPromptLine: string | undefined;
	readonly continuationPrompt: string | undefined;
	readonly lastUserInput: string;
}

export class PromptInputModel extends Disposable implements IPromptInputModel {
	private _state: PromptInputState = PromptInputState.Unknown;
	get state() { return this._state; }

	private _commandStartMarker: IMarker | undefined;
	private _commandStartX: number = 0;
	private _lastPromptLine: string | undefined;
	private _continuationPrompt: string | undefined;
	private _shellType: TerminalShellType | undefined;

	private _lastUserInput: string = '';

	private _value: string = '';
	get value() { return this._value; }
	get prefix() { return this._value.substring(0, this._cursorIndex); }
	get suffix() { return this._value.substring(this._cursorIndex, this._ghostTextIndex === -1 ? undefined : this._ghostTextIndex); }

	private _cursorIndex: number = 0;
	get cursorIndex() { return this._cursorIndex; }

	private _ghostTextIndex: number = -1;
	get ghostTextIndex() { return this._ghostTextIndex; }

	private readonly _onDidStartInput = this._register(new Emitter<IPromptInputModelState>());
	readonly onDidStartInput = this._onDidStartInput.event;
	private readonly _onDidChangeInput = this._register(new Emitter<IPromptInputModelState>());
	readonly onDidChangeInput = this._onDidChangeInput.event;
	private readonly _onDidFinishInput = this._register(new Emitter<IPromptInputModelState>());
	readonly onDidFinishInput = this._onDidFinishInput.event;
	private readonly _onDidInterrupt = this._register(new Emitter<IPromptInputModelState>());
	readonly onDidInterrupt = this._onDidInterrupt.event;

	constructor(
		private readonly _xterm: Terminal,
		onCommandStart: Event<ITerminalCommand>,
		onCommandStartChanged: Event<void>,
		onCommandExecuted: Event<ITerminalCommand>,
		@ILogService private readonly _logService: ILogService
	) {
		super();

		this._register(Event.any(
			this._xterm.onCursorMove,
			this._xterm.onData,
			this._xterm.onWriteParsed,
		)(() => this._sync()));
		this._register(this._xterm.onData(e => this._handleUserInput(e)));

		this._register(onCommandStart(e => this._handleCommandStart(e as { marker: IMarker })));
		this._register(onCommandStartChanged(() => this._handleCommandStartChanged()));
		this._register(onCommandExecuted(() => this._handleCommandExecuted()));

		this._register(this.onDidStartInput(() => this._logCombinedStringIfTrace('PromptInputModel#onDidStartInput')));
		this._register(this.onDidChangeInput(() => this._logCombinedStringIfTrace('PromptInputModel#onDidChangeInput')));
		this._register(this.onDidFinishInput(() => this._logCombinedStringIfTrace('PromptInputModel#onDidFinishInput')));
		this._register(this.onDidInterrupt(() => this._logCombinedStringIfTrace('PromptInputModel#onDidInterrupt')));
	}

	private _logCombinedStringIfTrace(message: string) {
		// Only generate the combined string if trace
		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace(message, this.getCombinedString());
		}
	}

	setShellType(shellType: TerminalShellType): void {
		this._shellType = shellType;
	}

	setContinuationPrompt(value: string): void {
		this._continuationPrompt = value;
		this._sync();
	}

	setLastPromptLine(value: string): void {
		this._lastPromptLine = value;
		this._sync();
	}

	setConfidentCommandLine(value: string): void {
		if (this._value !== value) {
			this._value = value;
			this._cursorIndex = -1;
			this._ghostTextIndex = -1;
			this._onDidChangeInput.fire(this._createStateObject());
		}
	}

	getCombinedString(emptyStringWhenEmpty?: boolean): string {
		const value = this._value.replaceAll('\n', '\u23CE');
		if (this._cursorIndex === -1) {
			return value;
		}
		let result = `${value.substring(0, this.cursorIndex)}|`;
		if (this.ghostTextIndex !== -1) {
			result += `${value.substring(this.cursorIndex, this.ghostTextIndex)}[`;
			result += `${value.substring(this.ghostTextIndex)}]`;
		} else {
			result += value.substring(this.cursorIndex);
		}
		if (result === '|' && emptyStringWhenEmpty) {
			return '';
		}
		return result;
	}

	serialize(): ISerializedPromptInputModel {
		return {
			modelState: this._createStateObject(),
			commandStartX: this._commandStartX,
			lastPromptLine: this._lastPromptLine,
			continuationPrompt: this._continuationPrompt,
			lastUserInput: this._lastUserInput
		};
	}

	deserialize(serialized: ISerializedPromptInputModel): void {
		this._value = serialized.modelState.value;
		this._cursorIndex = serialized.modelState.cursorIndex;
		this._ghostTextIndex = serialized.modelState.ghostTextIndex;
		this._commandStartX = serialized.commandStartX;
		this._lastPromptLine = serialized.lastPromptLine;
		this._continuationPrompt = serialized.continuationPrompt;
		this._lastUserInput = serialized.lastUserInput;
	}

	private _handleCommandStart(command: { marker: IMarker }) {
		if (this._state === PromptInputState.Input) {
			return;
		}

		this._state = PromptInputState.Input;
		this._commandStartMarker = command.marker;
		this._commandStartX = this._xterm.buffer.active.cursorX;
		this._value = '';
		this._cursorIndex = 0;
		this._onDidStartInput.fire(this._createStateObject());
		this._onDidChangeInput.fire(this._createStateObject());

		// Trigger a sync if prompt terminator is set as that could adjust the command start X
		if (this._lastPromptLine) {
			if (this._commandStartX !== this._lastPromptLine.length) {
				const line = this._xterm.buffer.active.getLine(this._commandStartMarker.line);
				if (line?.translateToString(true).startsWith(this._lastPromptLine)) {
					this._commandStartX = this._lastPromptLine.length;
					this._sync();
				}
			}
		}
	}

	private _handleCommandStartChanged() {
		if (this._state !== PromptInputState.Input) {
			return;
		}

		this._commandStartX = this._xterm.buffer.active.cursorX;
		this._onDidChangeInput.fire(this._createStateObject());
		this._sync();
	}

	private _handleCommandExecuted() {
		if (this._state === PromptInputState.Execute) {
			return;
		}

		this._cursorIndex = -1;

		// Remove any ghost text from the input if it exists on execute
		if (this._ghostTextIndex !== -1) {
			this._value = this._value.substring(0, this._ghostTextIndex);
			this._ghostTextIndex = -1;
		}

		const event = this._createStateObject();
		if (this._lastUserInput === '\u0003') {
			this._lastUserInput = '';
			this._onDidInterrupt.fire(event);
		}

		this._state = PromptInputState.Execute;
		this._onDidFinishInput.fire(event);
		this._onDidChangeInput.fire(event);
	}

	@throttle(0)
	private _sync() {
		try {
			this._doSync();
		} catch (e) {
			this._logService.error('Error while syncing prompt input model', e);
		}
	}

	private _doSync() {
		if (this._state !== PromptInputState.Input) {
			return;
		}

		let commandStartY = this._commandStartMarker?.line;
		if (commandStartY === undefined) {
			return;
		}

		const buffer = this._xterm.buffer.active;
		let line = buffer.getLine(commandStartY);
		const absoluteCursorY = buffer.baseY + buffer.cursorY;
		let cursorIndex: number | undefined;

		let commandLine = line?.translateToString(true, this._commandStartX);
		if (this._shellType === PosixShellType.Fish && (!line || !commandLine)) {
			commandStartY += 1;
			line = buffer.getLine(commandStartY);
			if (line) {
				commandLine = line.translateToString(true);
				cursorIndex = absoluteCursorY === commandStartY ? buffer.cursorX : commandLine?.trimEnd().length;
			}
		}
		if (line === undefined || commandLine === undefined) {
			this._logService.trace(`PromptInputModel#_sync: no line`);
			return;
		}

		let value = commandLine;
		let ghostTextIndex = -1;
		if (cursorIndex === undefined) {
			if (absoluteCursorY === commandStartY) {
				cursorIndex = Math.min(this._getRelativeCursorIndex(this._commandStartX, buffer, line), commandLine.length);
			} else {
				cursorIndex = commandLine.trimEnd().length;
			}
		}

		// From command start line to cursor line
		for (let y = commandStartY + 1; y <= absoluteCursorY; y++) {
			const nextLine = buffer.getLine(y);
			const lineText = nextLine?.translateToString(true);
			if (lineText && nextLine) {
				// Check if the line wrapped without a new line (continuation) or
				// we're on the last line and the continuation prompt is not present, so we need to add the value
				if (nextLine.isWrapped || (absoluteCursorY === y && this._continuationPrompt && !this._lineContainsContinuationPrompt(lineText))) {
					value += `${lineText}`;
					const relativeCursorIndex = this._getRelativeCursorIndex(0, buffer, nextLine);
					if (absoluteCursorY === y) {
						cursorIndex += relativeCursorIndex;
					} else {
						cursorIndex += lineText.length;
					}
				} else if (this._shellType === PosixShellType.Fish) {
					if (value.endsWith('\\')) {
						// Trim off the trailing backslash
						value = value.substring(0, value.length - 1);
						value += `${lineText.trim()}`;
						cursorIndex += lineText.trim().length - 1;
					} else {
						if (/^ {6,}/.test(lineText)) {
							// Was likely a new line
							value += `\n${lineText.trim()}`;
							cursorIndex += lineText.trim().length + 1;
						} else {
							value += lineText;
							cursorIndex += lineText.length;
						}
					}
				}
				// Verify continuation prompt if we have it, if this line doesn't have it then the
				// user likely just pressed enter.
				else if (this._continuationPrompt === undefined || this._lineContainsContinuationPrompt(lineText)) {
					const trimmedLineText = this._trimContinuationPrompt(lineText);
					value += `\n${trimmedLineText}`;
					if (absoluteCursorY === y) {
						const continuationCellWidth = this._getContinuationPromptCellWidth(nextLine, lineText);
						const relativeCursorIndex = this._getRelativeCursorIndex(continuationCellWidth, buffer, nextLine);
						cursorIndex += relativeCursorIndex + 1;
					} else {
						cursorIndex += trimmedLineText.length + 1;
					}
				}
			}
		}

		// Below cursor line
		for (let y = absoluteCursorY + 1; y < buffer.baseY + this._xterm.rows; y++) {
			const belowCursorLine = buffer.getLine(y);
			const lineText = belowCursorLine?.translateToString(true);
			if (lineText && belowCursorLine) {
				if (this._shellType === PosixShellType.Fish) {
					value += `${lineText}`;
				} else if (this._continuationPrompt === undefined || this._lineContainsContinuationPrompt(lineText)) {
					value += `\n${this._trimContinuationPrompt(lineText)}`;
				} else {
					value += lineText;
				}
			} else {
				break;
			}
		}

		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace(`PromptInputModel#_sync: ${this.getCombinedString()}`);
		}

		// Adjust trailing whitespace
		{
			let trailingWhitespace = this._value.length - this._value.trimEnd().length;

			// Handle backspace key
			if (this._lastUserInput === '\x7F') {
				this._lastUserInput = '';
				if (cursorIndex === this._cursorIndex - 1) {
					// If trailing whitespace is being increased by removing a non-whitespace character
					if (this._value.trimEnd().length > value.trimEnd().length && value.trimEnd().length <= cursorIndex) {
						trailingWhitespace = Math.max((this._value.length - 1) - value.trimEnd().length, 0);
					}
					// Standard case; subtract from trailing whitespace
					else {
						trailingWhitespace = Math.max(trailingWhitespace - 1, 0);
					}

				}
			}

			// Handle delete key
			if (this._lastUserInput === '\x1b[3~') {
				this._lastUserInput = '';
				if (cursorIndex === this._cursorIndex) {
					trailingWhitespace = Math.max(trailingWhitespace - 1, 0);
				}
			}

			const valueLines = value.split('\n');
			const isMultiLine = valueLines.length > 1;
			const valueEndTrimmed = value.trimEnd();
			if (!isMultiLine) {
				// Adjust trimmed whitespace value based on cursor position
				if (valueEndTrimmed.length < value.length) {
					// Handle space key
					if (this._lastUserInput === ' ') {
						this._lastUserInput = '';
						if (cursorIndex > valueEndTrimmed.length && cursorIndex > this._cursorIndex) {
							trailingWhitespace++;
						}
					}
					trailingWhitespace = Math.max(cursorIndex - valueEndTrimmed.length, trailingWhitespace, 0);
				}

				// Handle case where a non-space character is inserted in the middle of trailing whitespace
				const charBeforeCursor = cursorIndex === 0 ? '' : value[cursorIndex - 1];
				if (trailingWhitespace > 0 && cursorIndex === this._cursorIndex + 1 && this._lastUserInput !== '' && charBeforeCursor !== ' ') {
					trailingWhitespace = this._value.length - this._cursorIndex;
				}
			}

			if (isMultiLine) {
				valueLines[valueLines.length - 1] = valueLines.at(-1)?.trimEnd() ?? '';
				const continuationOffset = (valueLines.length - 1) * (this._continuationPrompt?.length ?? 0);
				trailingWhitespace = Math.max(0, cursorIndex - value.length - continuationOffset);
			}

			value = valueLines.map(e => e.trimEnd()).join('\n') + ' '.repeat(trailingWhitespace);
		}

		ghostTextIndex = this._scanForGhostText(buffer, line, cursorIndex);

		if (this._value !== value || this._cursorIndex !== cursorIndex || this._ghostTextIndex !== ghostTextIndex) {
			this._value = value;
			this._cursorIndex = cursorIndex;
			this._ghostTextIndex = ghostTextIndex;
			this._onDidChangeInput.fire(this._createStateObject());
		}
	}

	private _handleUserInput(e: string) {
		this._lastUserInput = e;
	}

	/**
	 * Detect ghost text by looking for italic or dim text in or after the cursor and
	 * non-italic/dim text in the first non-whitespace cell following command start and before the cursor.
	 */
	private _scanForGhostText(buffer: IBuffer, line: IBufferLine, cursorIndex: number): number {
		if (!this.value.trim().length) {
			return -1;
		}
		// Check last non-whitespace character has non-ghost text styles
		let ghostTextIndex = -1;
		let proceedWithGhostTextCheck = false;
		let x = buffer.cursorX;
		while (x > 0) {
			const cell = line.getCell(--x);
			if (!cell) {
				break;
			}
			if (cell.getChars().trim().length > 0) {
				proceedWithGhostTextCheck = !this._isCellStyledLikeGhostText(cell);
				break;
			}
		}

		// Check to the end of the line for possible ghost text. For example pwsh's ghost text
		// can look like this `Get-|Ch[ildItem]`
		if (proceedWithGhostTextCheck) {
			let potentialGhostIndexOffset = 0;
			let x = buffer.cursorX;

			while (x < line.length) {
				const cell = line.getCell(x++);
				if (!cell || cell.getCode() === 0) {
					break;
				}
				if (this._isCellStyledLikeGhostText(cell)) {
					ghostTextIndex = cursorIndex + potentialGhostIndexOffset;
					break;
				}

				potentialGhostIndexOffset += cell.getChars().length;
			}
		}

		// Ghost text may not be italic or dimmed, but will have a different style than the
		// rest of the line that precedes it.
		if (ghostTextIndex === -1) {
			ghostTextIndex = this._scanForGhostTextAdvanced(buffer, line, cursorIndex);
		}

		if (ghostTextIndex > -1 && this.value.substring(ghostTextIndex).endsWith(' ')) {
			this._value = this.value.trim();
			if (!this.value.substring(ghostTextIndex)) {
				ghostTextIndex = -1;
			}
		}
		return ghostTextIndex;
	}

	private _scanForGhostTextAdvanced(buffer: IBuffer, line: IBufferLine, cursorIndex: number): number {
		let ghostTextIndex = -1;
		let currentPos = buffer.cursorX; // Start scanning from the cursor position

		// Map to store styles and their corresponding positions
		const styleMap = new Map<string, number[]>();

		// Identify the last non-whitespace character in the line
		let lastNonWhitespaceCell = line.getCell(currentPos);
		let nextCell: IBufferCell | undefined = lastNonWhitespaceCell;

		// Scan from the cursor position to the end of the line
		while (nextCell && currentPos < line.length) {
			const styleKey = this._getCellStyleAsString(nextCell);

			// Track all occurrences of each unique style in the line
			styleMap.set(styleKey, [...(styleMap.get(styleKey) ?? []), currentPos]);

			// Move to the next cell
			nextCell = line.getCell(++currentPos);

			// Update `lastNonWhitespaceCell` only if the new cell contains visible characters
			if (nextCell?.getChars().trim().length) {
				lastNonWhitespaceCell = nextCell;
			}
		}

		// If there's no valid last non-whitespace cell OR the first and last styles match (indicating no ghost text)
		if (!lastNonWhitespaceCell?.getChars().trim().length ||
			this._cellStylesMatch(line.getCell(this._commandStartX), lastNonWhitespaceCell)) {
			return -1;
		}

		// Retrieve the positions of all cells with the same style as `lastNonWhitespaceCell`
		const positionsWithGhostStyle = styleMap.get(this._getCellStyleAsString(lastNonWhitespaceCell));
		if (positionsWithGhostStyle) {
			// Ghost text must start at the cursor or one char after (e.g. a space)
			// To account for cursor movement, we also ensure there are not 5+ spaces preceding the ghost text position
			if (positionsWithGhostStyle[0] > buffer.cursorX + 1 && this._isPositionRightPrompt(line, positionsWithGhostStyle[0])) {
				return -1;
			}
			// Ensure these positions are contiguous
			for (let i = 1; i < positionsWithGhostStyle.length; i++) {
				if (positionsWithGhostStyle[i] !== positionsWithGhostStyle[i - 1] + 1) {
					// Discontinuous styles, so may be syntax highlighting vs ghost text
					return -1;
				}
			}
			// Calculate the ghost text start index
			if (buffer.baseY + buffer.cursorY === this._commandStartMarker?.line) {
				ghostTextIndex = positionsWithGhostStyle[0] - this._commandStartX;
			} else {
				ghostTextIndex = positionsWithGhostStyle[0];
			}
		}

		// Ensure no earlier cells in the line match `lastNonWhitespaceCell`'s style,
		// which would indicate the text is not ghost text.
		if (ghostTextIndex !== -1) {
			for (let checkPos = buffer.cursorX; checkPos >= this._commandStartX; checkPos--) {
				const checkCell = line.getCell(checkPos);
				if (!checkCell?.getChars.length) {
					continue;
				}
				if (checkCell && checkCell.getCode() !== 0 && this._cellStylesMatch(lastNonWhitespaceCell, checkCell)) {
					return -1;
				}
			}
		}

		return ghostTextIndex >= cursorIndex ? ghostTextIndex : -1;
	}

	/**
	 * 5+ spaces preceding the position, following the command start,
	 * indicates that we're likely in a right prompt at the current position
	 */
	private _isPositionRightPrompt(line: IBufferLine, position: number): boolean {
		let count = 0;
		for (let i = position - 1; i >= this._commandStartX; i--) {
			const cell = line.getCell(i);
			// treat missing cell or whitespace-only cell as empty; reset count on first non-empty
			if (!cell || cell.getChars().trim().length === 0) {
				count++;
				// If we've already found 5 consecutive empties we can early-return
				if (count >= 5) {
					return true;
				}
			} else {
				// consecutive sequence broken
				count = 0;
			}
		}
		return false;
	}

	private _getCellStyleAsString(cell: IBufferCell): string {
		return `${cell.getFgColor()}${cell.getBgColor()}${cell.isBold()}${cell.isItalic()}${cell.isDim()}${cell.isUnderline()}${cell.isBlink()}${cell.isInverse()}${cell.isInvisible()}${cell.isStrikethrough()}${cell.isOverline()}${cell.getFgColorMode()}${cell.getBgColorMode()}`;
	}

	private _cellStylesMatch(a: IBufferCell | undefined, b: IBufferCell | undefined): boolean {
		if (!a || !b) {
			return false;
		}
		return a.getFgColor() === b.getFgColor()
			&& a.getBgColor() === b.getBgColor()
			&& a.isBold() === b.isBold()
			&& a.isItalic() === b.isItalic()
			&& a.isDim() === b.isDim()
			&& a.isUnderline() === b.isUnderline()
			&& a.isBlink() === b.isBlink()
			&& a.isInverse() === b.isInverse()
			&& a.isInvisible() === b.isInvisible()
			&& a.isStrikethrough() === b.isStrikethrough()
			&& a.isOverline() === b.isOverline()
			&& a?.getBgColorMode() === b?.getBgColorMode()
			&& a?.getFgColorMode() === b?.getFgColorMode();
	}

	private _trimContinuationPrompt(lineText: string): string {
		if (this._lineContainsContinuationPrompt(lineText)) {
			lineText = lineText.substring(this._continuationPrompt!.length);
		}
		return lineText;
	}

	private _lineContainsContinuationPrompt(lineText: string): boolean {
		return !!(this._continuationPrompt && lineText.startsWith(this._continuationPrompt.trimEnd()));
	}

	private _getContinuationPromptCellWidth(line: IBufferLine, lineText: string): number {
		if (!this._continuationPrompt || !lineText.startsWith(this._continuationPrompt.trimEnd())) {
			return 0;
		}
		let buffer = '';
		let x = 0;
		let cell: IBufferCell | undefined;
		while (buffer !== this._continuationPrompt) {
			cell = line.getCell(x++);
			if (!cell) {
				break;
			}
			buffer += cell.getChars();
		}
		return x;
	}

	private _getRelativeCursorIndex(startCellX: number, buffer: IBuffer, line: IBufferLine): number {
		return line?.translateToString(false, startCellX, buffer.cursorX).length ?? 0;
	}

	private _isCellStyledLikeGhostText(cell: IBufferCell): boolean {
		return !!(cell.isItalic() || cell.isDim());
	}

	private _createStateObject(): IPromptInputModelState {
		return Object.freeze({
			value: this._value,
			prefix: this.prefix,
			suffix: this.suffix,
			cursorIndex: this._cursorIndex,
			ghostTextIndex: this._ghostTextIndex
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/commandDetection/terminalCommand.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/commandDetection/terminalCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkProperties, ISerializedTerminalCommand, ITerminalCommand } from '../capabilities.js';
import { ITerminalOutputMatcher, ITerminalOutputMatch } from '../../terminal.js';
import type { IBuffer, IBufferLine, IMarker, Terminal } from '@xterm/headless';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { isString } from '../../../../../base/common/types.js';

export interface ITerminalCommandProperties {
	command: string;
	commandLineConfidence: 'low' | 'medium' | 'high';
	isTrusted: boolean;
	timestamp: number;
	duration: number;
	id: string | undefined;
	marker: IMarker | undefined;
	cwd: string | undefined;
	exitCode: number | undefined;
	commandStartLineContent: string | undefined;
	markProperties: IMarkProperties | undefined;
	executedX: number | undefined;
	startX: number | undefined;

	promptStartMarker?: IMarker | undefined;
	endMarker?: IMarker | undefined;
	executedMarker?: IMarker | undefined;
	aliases?: string[][] | undefined;
	wasReplayed?: boolean | undefined;
}

export class TerminalCommand implements ITerminalCommand {

	get command() { return this._properties.command; }
	get commandLineConfidence() { return this._properties.commandLineConfidence; }
	get isTrusted() { return this._properties.isTrusted; }
	get timestamp() { return this._properties.timestamp; }
	get duration() { return this._properties.duration; }
	get promptStartMarker() { return this._properties.promptStartMarker; }
	get marker() { return this._properties.marker; }
	get endMarker() { return this._properties.endMarker; }
	set endMarker(value: IMarker | undefined) { this._properties.endMarker = value; }
	get executedMarker() { return this._properties.executedMarker; }
	get aliases() { return this._properties.aliases; }
	get wasReplayed() { return this._properties.wasReplayed; }
	get cwd() { return this._properties.cwd; }
	get exitCode() { return this._properties.exitCode; }
	get commandStartLineContent() { return this._properties.commandStartLineContent; }
	get markProperties() { return this._properties.markProperties; }
	get executedX() { return this._properties.executedX; }
	get startX() { return this._properties.startX; }
	get id() { return this._properties.id; }

	constructor(
		private readonly _xterm: Terminal,
		private readonly _properties: ITerminalCommandProperties,
	) {
	}

	static deserialize(xterm: Terminal, serialized: ISerializedTerminalCommand & Required<Pick<ISerializedTerminalCommand, 'endLine'>>, isCommandStorageDisabled: boolean): TerminalCommand | undefined {
		const buffer = xterm.buffer.normal;
		const marker = serialized.startLine !== undefined ? xterm.registerMarker(serialized.startLine - (buffer.baseY + buffer.cursorY)) : undefined;

		// Check for invalid command
		if (!marker) {
			return undefined;
		}
		const promptStartMarker = serialized.promptStartLine !== undefined ? xterm.registerMarker(serialized.promptStartLine - (buffer.baseY + buffer.cursorY)) : undefined;

		// Valid full command
		const endMarker = serialized.endLine !== undefined ? xterm.registerMarker(serialized.endLine - (buffer.baseY + buffer.cursorY)) : undefined;
		const executedMarker = serialized.executedLine !== undefined ? xterm.registerMarker(serialized.executedLine - (buffer.baseY + buffer.cursorY)) : undefined;
		const newCommand = new TerminalCommand(xterm, {
			command: isCommandStorageDisabled ? '' : serialized.command,
			commandLineConfidence: serialized.commandLineConfidence ?? 'low',
			isTrusted: serialized.isTrusted,
			id: serialized.id,
			promptStartMarker,
			marker,
			startX: serialized.startX,
			endMarker,
			executedMarker,
			executedX: serialized.executedX,
			timestamp: serialized.timestamp,
			duration: serialized.duration,
			cwd: serialized.cwd,
			commandStartLineContent: serialized.commandStartLineContent,
			exitCode: serialized.exitCode,
			markProperties: serialized.markProperties,
			aliases: undefined,
			wasReplayed: true
		});
		return newCommand;
	}

	serialize(isCommandStorageDisabled: boolean): ISerializedTerminalCommand {
		return {
			promptStartLine: this.promptStartMarker?.line,
			startLine: this.marker?.line,
			startX: undefined,
			endLine: this.endMarker?.line,
			executedLine: this.executedMarker?.line,
			executedX: this.executedX,
			command: isCommandStorageDisabled ? '' : this.command,
			commandLineConfidence: isCommandStorageDisabled ? 'low' : this.commandLineConfidence,
			isTrusted: this.isTrusted,
			cwd: this.cwd,
			exitCode: this.exitCode,
			commandStartLineContent: this.commandStartLineContent,
			timestamp: this.timestamp,
			duration: this.duration,
			markProperties: this.markProperties,
			id: this.id,
		};
	}

	extractCommandLine(): string {
		return extractCommandLine(this._xterm.buffer.active, this._xterm.cols, this.marker, this.startX, this.executedMarker, this.executedX);
	}

	getOutput(): string | undefined {
		if (!this.executedMarker || !this.endMarker) {
			return undefined;
		}
		const startLine = this.executedMarker.line;
		const endLine = this.endMarker.line;

		if (startLine === endLine) {
			return undefined;
		}
		let output = '';
		let line: IBufferLine | undefined;
		for (let i = startLine; i < endLine; i++) {
			line = this._xterm.buffer.active.getLine(i);
			if (!line) {
				continue;
			}
			output += line.translateToString(!line.isWrapped) + (line.isWrapped ? '' : '\n');
		}
		return output === '' ? undefined : output;
	}

	getOutputMatch(outputMatcher: ITerminalOutputMatcher): ITerminalOutputMatch | undefined {
		// TODO: Add back this check? this._ptyHeuristics.value instanceof WindowsPtyHeuristics && (executedMarker?.line === endMarker?.line) ? this._currentCommand.commandStartMarker : executedMarker
		if (!this.executedMarker || !this.endMarker) {
			return undefined;
		}
		const endLine = this.endMarker.line;
		if (endLine === -1) {
			return undefined;
		}
		const buffer = this._xterm.buffer.active;
		const startLine = Math.max(this.executedMarker.line, 0);
		const matcher = outputMatcher.lineMatcher;
		const linesToCheck = isString(matcher) ? 1 : outputMatcher.length || countNewLines(matcher);
		const lines: string[] = [];
		let match: RegExpMatchArray | null | undefined;
		if (outputMatcher.anchor === 'bottom') {
			for (let i = endLine - (outputMatcher.offset || 0); i >= startLine; i--) {
				let wrappedLineStart = i;
				const wrappedLineEnd = i;
				while (wrappedLineStart >= startLine && buffer.getLine(wrappedLineStart)?.isWrapped) {
					wrappedLineStart--;
				}
				i = wrappedLineStart;
				lines.unshift(getXtermLineContent(buffer, wrappedLineStart, wrappedLineEnd, this._xterm.cols));
				if (!match) {
					match = lines[0].match(matcher);
				}
				if (lines.length >= linesToCheck) {
					break;
				}
			}
		} else {
			for (let i = startLine + (outputMatcher.offset || 0); i < endLine; i++) {
				const wrappedLineStart = i;
				let wrappedLineEnd = i;
				while (wrappedLineEnd + 1 < endLine && buffer.getLine(wrappedLineEnd + 1)?.isWrapped) {
					wrappedLineEnd++;
				}
				i = wrappedLineEnd;
				lines.push(getXtermLineContent(buffer, wrappedLineStart, wrappedLineEnd, this._xterm.cols));
				if (!match) {
					match = lines[lines.length - 1].match(matcher);
				}
				if (lines.length >= linesToCheck) {
					break;
				}
			}
		}
		return match ? { regexMatch: match, outputLines: lines } : undefined;
	}

	hasOutput(): boolean {
		return (
			!this.executedMarker?.isDisposed &&
			!this.endMarker?.isDisposed &&
			!!(
				this.executedMarker &&
				this.endMarker &&
				this.executedMarker.line < this.endMarker.line
			)
		);
	}

	getPromptRowCount(): number {
		return getPromptRowCount(this, this._xterm.buffer.active);
	}

	getCommandRowCount(): number {
		return getCommandRowCount(this);
	}
}

export interface ICurrentPartialCommand {
	promptStartMarker?: IMarker;

	commandStartMarker?: IMarker;
	commandStartX?: number;
	commandStartLineContent?: string;

	commandRightPromptStartX?: number;
	commandRightPromptEndX?: number;

	commandLines?: IMarker;

	commandExecutedMarker?: IMarker;
	commandExecutedX?: number;

	commandFinishedMarker?: IMarker;

	currentContinuationMarker?: IMarker;
	continuations?: { marker: IMarker; end: number }[];

	command?: string;

	/**
	 * Whether the command line is trusted via a nonce.
	 */
	isTrusted?: boolean;

	/**
	 * Something invalidated the command before it finished, this will prevent the onCommandFinished
	 * event from firing.
	 */
	isInvalid?: boolean;

	getPromptRowCount(): number;
	getCommandRowCount(): number;
}

export class PartialTerminalCommand implements ICurrentPartialCommand {
	promptStartMarker?: IMarker;

	commandStartMarker?: IMarker;
	commandStartX?: number;
	commandStartLineContent?: string;

	commandRightPromptStartX?: number;
	commandRightPromptEndX?: number;

	commandLines?: IMarker;

	commandExecutedMarker?: IMarker;
	commandExecutedX?: number;

	private commandExecutedTimestamp?: number;
	private commandDuration?: number;

	commandFinishedMarker?: IMarker;

	currentContinuationMarker?: IMarker;
	continuations?: { marker: IMarker; end: number }[];

	cwd?: string;
	command?: string;
	commandLineConfidence?: 'low' | 'medium' | 'high';
	id: string | undefined;

	isTrusted?: boolean;
	isInvalid?: boolean;
	/**
	 * Track temporarily if the command was recently cleared, this can be used for marker
	 * adjustments
	 */
	wasCleared?: boolean;

	constructor(
		private readonly _xterm: Terminal,
		id?: string
	) {
		this.id = id ?? generateUuid();
	}

	serialize(cwd: string | undefined): ISerializedTerminalCommand | undefined {
		if (!this.commandStartMarker) {
			return undefined;
		}

		return {
			promptStartLine: this.promptStartMarker?.line,
			startLine: this.commandStartMarker.line,
			startX: this.commandStartX,
			endLine: undefined,
			executedLine: undefined,
			executedX: undefined,
			command: '',
			commandLineConfidence: 'low',
			isTrusted: true,
			cwd,
			exitCode: undefined,
			commandStartLineContent: undefined,
			timestamp: 0,
			duration: 0,
			markProperties: undefined,
			id: this.id
		};
	}

	promoteToFullCommand(cwd: string | undefined, exitCode: number | undefined, ignoreCommandLine: boolean, markProperties: IMarkProperties | undefined): TerminalCommand | undefined {
		// When the command finishes and executed never fires the placeholder selector should be used.
		if (exitCode === undefined && this.command === undefined) {
			this.command = '';
		}

		if ((this.command !== undefined && !this.command.startsWith('\\')) || ignoreCommandLine) {
			return new TerminalCommand(this._xterm, {
				command: ignoreCommandLine ? '' : (this.command || ''),
				commandLineConfidence: ignoreCommandLine ? 'low' : (this.commandLineConfidence || 'low'),
				isTrusted: !!this.isTrusted,
				id: this.id,
				promptStartMarker: this.promptStartMarker,
				marker: this.commandStartMarker,
				startX: this.commandStartX,
				endMarker: this.commandFinishedMarker,
				executedMarker: this.commandExecutedMarker,
				executedX: this.commandExecutedX,
				timestamp: Date.now(),
				duration: this.commandDuration || 0,
				cwd,
				exitCode,
				commandStartLineContent: this.commandStartLineContent,
				markProperties
			});
		}

		return undefined;
	}

	markExecutedTime() {
		if (this.commandExecutedTimestamp === undefined) {
			this.commandExecutedTimestamp = Date.now();
		}
	}

	markFinishedTime() {
		if (this.commandDuration === undefined && this.commandExecutedTimestamp !== undefined) {
			this.commandDuration = Date.now() - this.commandExecutedTimestamp;
		}
	}

	extractCommandLine(): string {
		return extractCommandLine(this._xterm.buffer.active, this._xterm.cols, this.commandStartMarker, this.commandStartX, this.commandExecutedMarker, this.commandExecutedX);
	}

	getPromptRowCount(): number {
		return getPromptRowCount(this, this._xterm.buffer.active);
	}

	getCommandRowCount(): number {
		return getCommandRowCount(this);
	}
}

function extractCommandLine(
	buffer: IBuffer,
	cols: number,
	commandStartMarker: IMarker | undefined,
	commandStartX: number | undefined,
	commandExecutedMarker: IMarker | undefined,
	commandExecutedX: number | undefined
): string {
	if (!commandStartMarker || !commandExecutedMarker || commandStartX === undefined || commandExecutedX === undefined) {
		return '';
	}
	let content = '';
	for (let i = commandStartMarker.line; i <= commandExecutedMarker.line; i++) {
		const line = buffer.getLine(i);
		if (line) {
			content += line.translateToString(true, i === commandStartMarker.line ? commandStartX : 0, i === commandExecutedMarker.line ? commandExecutedX : cols);
		}
	}
	return content;
}

function getXtermLineContent(buffer: IBuffer, lineStart: number, lineEnd: number, cols: number): string {
	// Cap the maximum number of lines generated to prevent potential performance problems. This is
	// more of a sanity check as the wrapped line should already be trimmed down at this point.
	const maxLineLength = Math.max(2048 / cols * 2);
	lineEnd = Math.min(lineEnd, lineStart + maxLineLength);
	let content = '';
	for (let i = lineStart; i <= lineEnd; i++) {
		// Make sure only 0 to cols are considered as resizing when windows mode is enabled will
		// retain buffer data outside of the terminal width as reflow is disabled.
		const line = buffer.getLine(i);
		if (line) {
			content += line.translateToString(true, 0, cols);
		}
	}
	return content;
}

function countNewLines(regex: RegExp): number {
	if (!regex.multiline) {
		return 1;
	}
	const source = regex.source;
	let count = 1;
	let i = source.indexOf('\\n');
	while (i !== -1) {
		count++;
		i = source.indexOf('\\n', i + 1);
	}
	return count;
}

function getPromptRowCount(command: ITerminalCommand | ICurrentPartialCommand, buffer: IBuffer): number {
	const marker = isFullTerminalCommand(command) ? command.marker : command.commandStartMarker;
	if (!marker || !command.promptStartMarker) {
		return 1;
	}
	let promptRowCount = 1;
	let promptStartLine = command.promptStartMarker.line;
	// Trim any leading whitespace-only lines to retain vertical space
	while (promptStartLine < marker.line && (buffer.getLine(promptStartLine)?.translateToString(true) ?? '').length === 0) {
		promptStartLine++;
	}
	promptRowCount = marker.line - promptStartLine + 1;
	return promptRowCount;
}

function getCommandRowCount(command: ITerminalCommand | ICurrentPartialCommand): number {
	const marker = isFullTerminalCommand(command) ? command.marker : command.commandStartMarker;
	const executedMarker = isFullTerminalCommand(command) ? command.executedMarker : command.commandExecutedMarker;
	if (!marker || !executedMarker) {
		return 1;
	}
	const commandExecutedLine = Math.max(executedMarker.line, marker.line);
	let commandRowCount = commandExecutedLine - marker.line + 1;
	// Trim the last line if the cursor X is in the left-most cell
	const executedX = isFullTerminalCommand(command) ? command.executedX : command.commandExecutedX;
	if (executedX === 0) {
		commandRowCount--;
	}
	return commandRowCount;
}

export function isFullTerminalCommand(command: ITerminalCommand | ICurrentPartialCommand): command is ITerminalCommand {
	return !!(command as ITerminalCommand).hasOutput;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/xterm/shellIntegrationAddon.ts]---
Location: vscode-main/src/vs/platform/terminal/common/xterm/shellIntegrationAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IShellIntegration, ShellIntegrationStatus } from '../terminal.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { TerminalCapabilityStore } from '../capabilities/terminalCapabilityStore.js';
import { CommandDetectionCapability } from '../capabilities/commandDetectionCapability.js';
import { CwdDetectionCapability } from '../capabilities/cwdDetectionCapability.js';
import { IBufferMarkCapability, ICommandDetectionCapability, ICwdDetectionCapability, IPromptTypeDetectionCapability, ISerializedCommandDetectionCapability, IShellEnvDetectionCapability, TerminalCapability } from '../capabilities/capabilities.js';
import { PartialCommandDetectionCapability } from '../capabilities/partialCommandDetectionCapability.js';
import { ILogService } from '../../../log/common/log.js';
import { ITelemetryService } from '../../../telemetry/common/telemetry.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { BufferMarkCapability } from '../capabilities/bufferMarkCapability.js';
import type { ITerminalAddon, Terminal } from '@xterm/headless';
import { URI } from '../../../../base/common/uri.js';
import { sanitizeCwd } from '../terminalEnvironment.js';
import { removeAnsiEscapeCodesFromPrompt } from '../../../../base/common/strings.js';
import { ShellEnvDetectionCapability } from '../capabilities/shellEnvDetectionCapability.js';
import { PromptTypeDetectionCapability } from '../capabilities/promptTypeDetectionCapability.js';


/**
 * Shell integration is a feature that enhances the terminal's understanding of what's happening
 * in the shell by injecting special sequences into the shell's prompt using the "Set Text
 * Parameters" sequence (`OSC Ps ; Pt ST`).
 *
 * Definitions:
 * - OSC: `\x1b]`
 * - Ps:  A single (usually optional) numeric parameter, composed of one or more digits.
 * - Pt:  A text parameter composed of printable characters.
 * - ST: `\x7`
 *
 * This is inspired by a feature of the same name in the FinalTerm, iTerm2 and kitty terminals.
 */

/**
 * The identifier for the first numeric parameter (`Ps`) for OSC commands used by shell integration.
 */
export const enum ShellIntegrationOscPs {
	/**
	 * Sequences pioneered by FinalTerm.
	 */
	FinalTerm = 133,
	/**
	 * Sequences pioneered by VS Code. The number is derived from the least significant digit of
	 * "VSC" when encoded in hex ("VSC" = 0x56, 0x53, 0x43).
	 */
	VSCode = 633,
	/**
	 * Sequences pioneered by iTerm.
	 */
	ITerm = 1337,
	SetCwd = 7,
	SetWindowsFriendlyCwd = 9
}

/**
 * Sequences pioneered by FinalTerm.
 */
const enum FinalTermOscPt {
	/**
	 * The start of the prompt, this is expected to always appear at the start of a line.
	 *
	 * Format: `OSC 133 ; A ST`
	 */
	PromptStart = 'A',

	/**
	 * The start of a command, ie. where the user inputs their command.
	 *
	 * Format: `OSC 133 ; B ST`
	 */
	CommandStart = 'B',

	/**
	 * Sent just before the command output begins.
	 *
	 * Format: `OSC 133 ; C ST`
	 */
	CommandExecuted = 'C',

	/**
	 * Sent just after a command has finished. The exit code is optional, when not specified it
	 * means no command was run (ie. enter on empty prompt or ctrl+c).
	 *
	 * Format: `OSC 133 ; D [; <ExitCode>] ST`
	 */
	CommandFinished = 'D',
}

/**
 * VS Code-specific shell integration sequences. Some of these are based on more common alternatives
 * like those pioneered in {@link FinalTermOscPt FinalTerm}. The decision to move to entirely custom
 * sequences was to try to improve reliability and prevent the possibility of applications confusing
 * the terminal. If multiple shell integration scripts run, VS Code will prioritize the VS
 * Code-specific ones.
 *
 * It's recommended that authors of shell integration scripts use the common sequences (`133`)
 * when building general purpose scripts and the VS Code-specific (`633`) when targeting only VS
 * Code or when there are no other alternatives (eg. {@link CommandLine `633 ; E`}). These sequences
 * support mix-and-matching.
 */
const enum VSCodeOscPt {
	/**
	 * The start of the prompt, this is expected to always appear at the start of a line.
	 *
	 * Format: `OSC 633 ; A ST`
	 *
	 * Based on {@link FinalTermOscPt.PromptStart}.
	 */
	PromptStart = 'A',

	/**
	 * The start of a command, ie. where the user inputs their command.
	 *
	 * Format: `OSC 633 ; B ST`
	 *
	 * Based on  {@link FinalTermOscPt.CommandStart}.
	 */
	CommandStart = 'B',

	/**
	 * Sent just before the command output begins.
	 *
	 * Format: `OSC 633 ; C ST`
	 *
	 * Based on {@link FinalTermOscPt.CommandExecuted}.
	 */
	CommandExecuted = 'C',

	/**
	 * Sent just after a command has finished. This should generally be used on the new line
	 * following the end of a command's output, just before {@link PromptStart}. The exit code is
	 * optional, when not specified it means no command was run (ie. enter on empty prompt or
	 * ctrl+c).
	 *
	 * Format: `OSC 633 ; D [; <ExitCode>] ST`
	 *
	 * Based on {@link FinalTermOscPt.CommandFinished}.
	 */
	CommandFinished = 'D',

	/**
	 * Explicitly set the command line. This helps workaround performance and reliability problems
	 * with parsing out the command, such as conpty not guaranteeing the position of the sequence or
	 * the shell not guaranteeing that the entire command is even visible. Ideally this is called
	 * immediately before {@link CommandExecuted}, immediately before {@link CommandFinished} will
	 * also work but that means terminal will only know the accurate command line when the command is
	 * finished.
	 *
	 * The command line can escape ascii characters using the `\xAB` format, where AB are the
	 * hexadecimal representation of the character code (case insensitive), and escape the `\`
	 * character using `\\`. It's required to escape semi-colon (`0x3b`) and characters 0x20 and
	 * below, this is particularly important for new line and semi-colon.
	 *
	 * Some examples:
	 *
	 * ```
	 * "\"  -> "\\"
	 * "\n" -> "\x0a"
	 * ";"  -> "\x3b"
	 * ```
	 *
	 * An optional nonce can be provided which is may be required by the terminal in order enable
	 * some features. This helps ensure no malicious command injection has occurred.
	 *
	 * Format: `OSC 633 ; E [; <CommandLine> [; <Nonce>]] ST`
	 */
	CommandLine = 'E',

	/**
	 * Similar to prompt start but for line continuations.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	ContinuationStart = 'F',

	/**
	 * Similar to command start but for line continuations.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	ContinuationEnd = 'G',

	/**
	 * The start of the right prompt.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	RightPromptStart = 'H',

	/**
	 * The end of the right prompt.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	RightPromptEnd = 'I',

	/**
	 * Set the value of an arbitrary property, only known properties will be handled by VS Code.
	 *
	 * Format: `OSC 633 ; P ; <Property>=<Value> ST`
	 *
	 * Known properties:
	 *
	 * - `Cwd` - Reports the current working directory to the terminal.
	 * - `IsWindows` - Reports whether the shell is using a Windows backend like winpty or conpty.
	 *   This may be used to enable additional heuristics as the positioning of the shell
	 *   integration sequences are not guaranteed to be correct. Valid values: `True`, `False`.
	 * - `ContinuationPrompt` - Reports the continuation prompt that is printed at the start of
	 *   multi-line inputs.
	 * - `HasRichCommandDetection` - Reports whether the shell has rich command line detection,
	 *   meaning that sequences A, B, C, D and E are exactly where they're meant to be. In
	 *   particular, {@link CommandLine} must happen immediately before {@link CommandExecuted} so
	 *   VS Code knows the command line when the execution begins.
	 *
	 * WARNING: Any other properties may be changed and are not guaranteed to work in the future.
	 */
	Property = 'P',

	/**
	 * Sets a mark/point-of-interest in the buffer.
	 *
	 * Format: `OSC 633 ; SetMark [; Id=<string>] [; Hidden]`
	 *
	 * `Id` - The identifier of the mark that can be used to reference it
	 * `Hidden` - When set, the mark will be available to reference internally but will not visible
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	SetMark = 'SetMark',

	/**
	 * Sends the shell's complete environment in JSON format.
	 *
	 * Format: `OSC 633 ; EnvJson ; <Environment> ; <Nonce>`
	 *
	 * - `Environment` - A stringified JSON object containing the shell's complete environment. The
	 *    variables and values use the same encoding rules as the {@link CommandLine} sequence.
	 * - `Nonce` - An _mandatory_ nonce can be provided which may be required by the terminal in order
	 *   to enable some features. This helps ensure no malicious command injection has occurred.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	EnvJson = 'EnvJson',

	/**
	 * Delete a single environment variable from cached environment.
	 *
	 * Format: `OSC 633 ; EnvSingleDelete ; <EnvironmentKey> ; <EnvironmentValue> [; <Nonce>]`
	 *
	 * - `Nonce` - An optional nonce can be provided which may be required by the terminal in order
	 *   to enable some features. This helps ensure no malicious command injection has occurred.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	EnvSingleDelete = 'EnvSingleDelete',

	/**
	 * The start of the collecting user's environment variables individually.
	 *
	 * Format: `OSC 633 ; EnvSingleStart ; <Clear> [; <Nonce>]`
	 *
	 * - `Clear` - An _mandatory_ flag indicating any cached environment variables will be cleared.
	 * - `Nonce` - An optional nonce can be provided which may be required by the terminal in order
	 *   to enable some features. This helps ensure no malicious command injection has occurred.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	EnvSingleStart = 'EnvSingleStart',

	/**
	 * Sets an entry of single environment variable to transactional pending map of environment variables.
	 *
	 * Format: `OSC 633 ; EnvSingleEntry ; <EnvironmentKey> ; <EnvironmentValue> [; <Nonce>]`
	 *
	 * - `Nonce` - An optional nonce can be provided which may be required by the terminal in order
	 *   to enable some features. This helps ensure no malicious command injection has occurred.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	EnvSingleEntry = 'EnvSingleEntry',

	/**
	 * The end of the collecting user's environment variables individually.
	 * Clears any pending environment variables and fires an event that contains user's environment.
	 *
	 * Format: `OSC 633 ; EnvSingleEnd [; <Nonce>]`
	 *
	 * - `Nonce` - An optional nonce can be provided which may be required by the terminal in order
	 *   to enable some features. This helps ensure no malicious command injection has occurred.
	 *
	 * WARNING: This sequence is unfinalized, DO NOT use this in your shell integration script.
	 */
	EnvSingleEnd = 'EnvSingleEnd'
}

/**
 * ITerm sequences
 */
const enum ITermOscPt {
	/**
	 * Sets a mark/point-of-interest in the buffer.
	 *
	 * Format: `OSC 1337 ; SetMark`
	 */
	SetMark = 'SetMark',

	/**
	 * Reports current working directory (CWD).
	 *
	 * Format: `OSC 1337 ; CurrentDir=<Cwd> ST`
	 */
	CurrentDir = 'CurrentDir'
}

/**
 * The shell integration addon extends xterm by reading shell integration sequences and creating
 * capabilities and passing along relevant sequences to the capabilities. This is meant to
 * encapsulate all handling/parsing of sequences so the capabilities don't need to.
 */
export class ShellIntegrationAddon extends Disposable implements IShellIntegration, ITerminalAddon {
	private _terminal?: Terminal;
	readonly capabilities = this._register(new TerminalCapabilityStore());
	private _hasUpdatedTelemetry: boolean = false;
	private _activationTimeout: Timeout | undefined;
	private _commonProtocolDisposables: IDisposable[] = [];

	private _seenSequences: Set<string> = new Set();
	get seenSequences(): ReadonlySet<string> { return this._seenSequences; }

	private _status: ShellIntegrationStatus = ShellIntegrationStatus.Off;
	get status(): ShellIntegrationStatus { return this._status; }

	private readonly _onDidChangeStatus = new Emitter<ShellIntegrationStatus>();
	readonly onDidChangeStatus = this._onDidChangeStatus.event;
	private readonly _onDidChangeSeenSequences = new Emitter<ReadonlySet<string>>();
	readonly onDidChangeSeenSequences = this._onDidChangeSeenSequences.event;

	constructor(
		private _nonce: string,
		private readonly _disableTelemetry: boolean | undefined,
		private _onDidExecuteText: Event<void> | undefined,
		private readonly _telemetryService: ITelemetryService | undefined,
		private readonly _logService: ILogService
	) {
		super();
		this._register(toDisposable(() => {
			this._clearActivationTimeout();
			this._disposeCommonProtocol();
		}));
	}

	private _disposeCommonProtocol(): void {
		dispose(this._commonProtocolDisposables);
		this._commonProtocolDisposables.length = 0;
	}

	activate(xterm: Terminal) {
		this._terminal = xterm;
		this.capabilities.add(TerminalCapability.PartialCommandDetection, this._register(new PartialCommandDetectionCapability(this._terminal, this._onDidExecuteText)));
		this._register(xterm.parser.registerOscHandler(ShellIntegrationOscPs.VSCode, data => this._handleVSCodeSequence(data)));
		this._register(xterm.parser.registerOscHandler(ShellIntegrationOscPs.ITerm, data => this._doHandleITermSequence(data)));
		this._commonProtocolDisposables.push(
			xterm.parser.registerOscHandler(ShellIntegrationOscPs.FinalTerm, data => this._handleFinalTermSequence(data))
		);
		this._register(xterm.parser.registerOscHandler(ShellIntegrationOscPs.SetCwd, data => this._doHandleSetCwd(data)));
		this._register(xterm.parser.registerOscHandler(ShellIntegrationOscPs.SetWindowsFriendlyCwd, data => this._doHandleSetWindowsFriendlyCwd(data)));
		this._ensureCapabilitiesOrAddFailureTelemetry();
	}

	getMarkerId(terminal: Terminal, vscodeMarkerId: string) {
		this._createOrGetBufferMarkDetection(terminal).getMark(vscodeMarkerId);
	}

	setNextCommandId(command: string, commandId: string): void {
		if (this._terminal) {
			this._createOrGetCommandDetection(this._terminal).setNextCommandId(command, commandId);
		}
	}

	private _markSequenceSeen(sequence: string) {
		if (!this._seenSequences.has(sequence)) {
			this._seenSequences.add(sequence);
			this._onDidChangeSeenSequences.fire(this._seenSequences);
		}
	}

	private _handleFinalTermSequence(data: string): boolean {
		const didHandle = this._doHandleFinalTermSequence(data);
		if (this._status === ShellIntegrationStatus.Off) {
			this._status = ShellIntegrationStatus.FinalTerm;
			this._onDidChangeStatus.fire(this._status);
		}
		return didHandle;
	}

	private _doHandleFinalTermSequence(data: string): boolean {
		if (!this._terminal) {
			return false;
		}

		// Pass the sequence along to the capability
		// It was considered to disable the common protocol in order to not confuse the VS Code
		// shell integration if both happen for some reason. This doesn't work for powerlevel10k
		// when instant prompt is enabled though. If this does end up being a problem we could pass
		// a type flag through the capability calls
		const [command, ...args] = data.split(';');
		this._markSequenceSeen(command);
		switch (command) {
			case FinalTermOscPt.PromptStart:
				this._createOrGetCommandDetection(this._terminal).handlePromptStart();
				return true;
			case FinalTermOscPt.CommandStart:
				// Ignore the command line for these sequences as it's unreliable for example in powerlevel10k
				this._createOrGetCommandDetection(this._terminal).handleCommandStart({ ignoreCommandLine: true });
				return true;
			case FinalTermOscPt.CommandExecuted:
				this._createOrGetCommandDetection(this._terminal).handleCommandExecuted();
				return true;
			case FinalTermOscPt.CommandFinished: {
				const exitCode = args.length === 1 ? parseInt(args[0]) : undefined;
				this._createOrGetCommandDetection(this._terminal).handleCommandFinished(exitCode);
				return true;
			}
		}
		return false;
	}

	private _handleVSCodeSequence(data: string): boolean {
		const didHandle = this._doHandleVSCodeSequence(data);
		if (!this._hasUpdatedTelemetry && didHandle) {
			this._telemetryService?.publicLog2<{}, { owner: 'meganrogge'; comment: 'Indicates shell integration was activated' }>('terminal/shellIntegrationActivationSucceeded');
			this._hasUpdatedTelemetry = true;
			this._clearActivationTimeout();
		}
		if (this._status !== ShellIntegrationStatus.VSCode) {
			this._status = ShellIntegrationStatus.VSCode;
			this._onDidChangeStatus.fire(this._status);
		}
		return didHandle;
	}

	private async _ensureCapabilitiesOrAddFailureTelemetry(): Promise<void> {
		if (!this._telemetryService || this._disableTelemetry) {
			return;
		}
		this._activationTimeout = setTimeout(() => {
			if (!this.capabilities.get(TerminalCapability.CommandDetection) && !this.capabilities.get(TerminalCapability.CwdDetection)) {
				this._telemetryService?.publicLog2<{}, { owner: 'meganrogge'; comment: 'Indicates shell integration activation timeout' }>('terminal/shellIntegrationActivationTimeout');
				this._logService.warn('Shell integration failed to add capabilities within 10 seconds');
			}
			this._hasUpdatedTelemetry = true;
		}, 10000);
	}

	private _clearActivationTimeout(): void {
		if (this._activationTimeout !== undefined) {
			clearTimeout(this._activationTimeout);
			this._activationTimeout = undefined;
		}
	}

	private _doHandleVSCodeSequence(data: string): boolean {
		if (!this._terminal) {
			return false;
		}

		// Pass the sequence along to the capability
		const argsIndex = data.indexOf(';');
		const command = argsIndex === -1 ? data : data.substring(0, argsIndex);
		this._markSequenceSeen(command);
		// Cast to strict checked index access
		const args: (string | undefined)[] = argsIndex === -1 ? [] : data.substring(argsIndex + 1).split(';');
		switch (command) {
			case VSCodeOscPt.PromptStart:
				this._createOrGetCommandDetection(this._terminal).handlePromptStart();
				return true;
			case VSCodeOscPt.CommandStart:
				this._createOrGetCommandDetection(this._terminal).handleCommandStart();
				return true;
			case VSCodeOscPt.CommandExecuted:
				this._createOrGetCommandDetection(this._terminal).handleCommandExecuted();
				return true;
			case VSCodeOscPt.CommandFinished: {
				const arg0 = args[0];
				const exitCode = arg0 !== undefined ? parseInt(arg0) : undefined;
				this._createOrGetCommandDetection(this._terminal).handleCommandFinished(exitCode);
				return true;
			}
			case VSCodeOscPt.CommandLine: {
				const arg0 = args[0];
				const arg1 = args[1];
				let commandLine: string;
				if (arg0 !== undefined) {
					commandLine = deserializeVSCodeOscMessage(arg0);
				} else {
					commandLine = '';
				}
				this._createOrGetCommandDetection(this._terminal).setCommandLine(commandLine, arg1 === this._nonce);
				return true;
			}
			case VSCodeOscPt.ContinuationStart: {
				this._createOrGetCommandDetection(this._terminal).handleContinuationStart();
				return true;
			}
			case VSCodeOscPt.ContinuationEnd: {
				this._createOrGetCommandDetection(this._terminal).handleContinuationEnd();
				return true;
			}
			case VSCodeOscPt.EnvJson: {
				const arg0 = args[0];
				const arg1 = args[1];
				if (arg0 !== undefined) {
					try {
						const env = JSON.parse(deserializeVSCodeOscMessage(arg0));
						this._createOrGetShellEnvDetection().setEnvironment(env, arg1 === this._nonce);
					} catch (e) {
						this._logService.warn('Failed to parse environment from shell integration sequence', arg0);
					}
				}
				return true;
			}
			case VSCodeOscPt.EnvSingleStart: {
				this._createOrGetShellEnvDetection().startEnvironmentSingleVar(args[0] === '1', args[1] === this._nonce);
				return true;
			}
			case VSCodeOscPt.EnvSingleDelete: {
				const arg0 = args[0];

				const arg1 = args[1];
				const arg2 = args[2];
				if (arg0 !== undefined && arg1 !== undefined) {
					const env = deserializeVSCodeOscMessage(arg1);
					this._createOrGetShellEnvDetection().deleteEnvironmentSingleVar(arg0, env, arg2 === this._nonce);
				}
				return true;
			}
			case VSCodeOscPt.EnvSingleEntry: {
				const arg0 = args[0];
				const arg1 = args[1];
				const arg2 = args[2];
				if (arg0 !== undefined && arg1 !== undefined) {
					const env = deserializeVSCodeOscMessage(arg1);
					this._createOrGetShellEnvDetection().setEnvironmentSingleVar(arg0, env, arg2 === this._nonce);
				}
				return true;
			}
			case VSCodeOscPt.EnvSingleEnd: {
				this._createOrGetShellEnvDetection().endEnvironmentSingleVar(args[0] === this._nonce);
				return true;
			}
			case VSCodeOscPt.RightPromptStart: {
				this._createOrGetCommandDetection(this._terminal).handleRightPromptStart();
				return true;
			}
			case VSCodeOscPt.RightPromptEnd: {
				this._createOrGetCommandDetection(this._terminal).handleRightPromptEnd();
				return true;
			}
			case VSCodeOscPt.Property: {
				const arg0 = args[0];
				const deserialized = arg0 !== undefined ? deserializeVSCodeOscMessage(arg0) : '';
				const { key, value } = parseKeyValueAssignment(deserialized);
				if (value === undefined) {
					return true;
				}
				switch (key) {
					case 'ContinuationPrompt': {
						this._updateContinuationPrompt(removeAnsiEscapeCodesFromPrompt(value));
						return true;
					}
					case 'Cwd': {
						this._updateCwd(value);
						return true;
					}
					case 'IsWindows': {
						this._createOrGetCommandDetection(this._terminal).setIsWindowsPty(value === 'True' ? true : false);
						return true;
					}
					case 'HasRichCommandDetection': {
						this._createOrGetCommandDetection(this._terminal).setHasRichCommandDetection(value === 'True' ? true : false);
						return true;
					}
					case 'Prompt': {
						// Remove escape sequences from the user's prompt
						const sanitizedValue = value.replace(/\x1b\[[0-9;]*m/g, '');
						this._updatePromptTerminator(sanitizedValue);
						return true;
					}
					case 'PromptType': {
						this._createOrGetPromptTypeDetection().setPromptType(value);
						return true;
					}
					case 'Task': {
						this._createOrGetBufferMarkDetection(this._terminal);
						this.capabilities.get(TerminalCapability.CommandDetection)?.setIsCommandStorageDisabled();
						return true;
					}
				}
			}
			case VSCodeOscPt.SetMark: {
				this._createOrGetBufferMarkDetection(this._terminal).addMark(parseMarkSequence(args));
				return true;
			}
		}

		// Unrecognized sequence
		return false;
	}

	private _updateContinuationPrompt(value: string) {
		if (!this._terminal) {
			return;
		}
		this._createOrGetCommandDetection(this._terminal).setContinuationPrompt(value);
	}

	private _updatePromptTerminator(prompt: string) {
		if (!this._terminal) {
			return;
		}
		const lastPromptLine = prompt.substring(prompt.lastIndexOf('\n') + 1);
		const lastPromptLineTrimmed = lastPromptLine.trim();
		const promptTerminator = (
			lastPromptLineTrimmed.length === 1
				// The prompt line contains a single character, treat the full line as the
				// terminator for example "\u2b9e "
				? lastPromptLine
				: lastPromptLine.substring(lastPromptLine.lastIndexOf(' '))
		);
		if (promptTerminator) {
			this._createOrGetCommandDetection(this._terminal).setPromptTerminator(promptTerminator, lastPromptLine);
		}
	}

	private _updateCwd(value: string) {
		value = sanitizeCwd(value);
		this._createOrGetCwdDetection().updateCwd(value);
		const commandDetection = this.capabilities.get(TerminalCapability.CommandDetection);
		commandDetection?.setCwd(value);
	}

	private _doHandleITermSequence(data: string): boolean {
		if (!this._terminal) {
			return false;
		}

		const [command] = data.split(';');
		this._markSequenceSeen(`${ShellIntegrationOscPs.ITerm};${command}`);
		switch (command) {
			case ITermOscPt.SetMark: {
				this._createOrGetBufferMarkDetection(this._terminal).addMark();
			}
			default: {
				// Checking for known `<key>=<value>` pairs.
				// Note that unlike `VSCodeOscPt.Property`, iTerm2 does not interpret backslash or hex-escape sequences.
				// See: https://github.com/gnachman/iTerm2/blob/bb0882332cec5196e4de4a4225978d746e935279/sources/VT100Terminal.m#L2089-L2105
				const { key, value } = parseKeyValueAssignment(command);

				if (value === undefined) {
					// No '=' was found, so it's not a property assignment.
					return true;
				}

				switch (key) {
					case ITermOscPt.CurrentDir:
						// Encountered: `OSC 1337 ; CurrentDir=<Cwd> ST`
						this._updateCwd(value);
						return true;
				}
			}
		}

		// Unrecognized sequence
		return false;
	}

	private _doHandleSetWindowsFriendlyCwd(data: string): boolean {
		if (!this._terminal) {
			return false;
		}

		const [command, ...args] = data.split(';');
		this._markSequenceSeen(`${ShellIntegrationOscPs.SetWindowsFriendlyCwd};${command}`);
		switch (command) {
			case '9':
				// Encountered `OSC 9 ; 9 ; <cwd> ST`
				if (args.length) {
					this._updateCwd(args[0]);
				}
				return true;
		}

		// Unrecognized sequence
		return false;
	}

	/**
	 * Handles the sequence: `OSC 7 ; scheme://cwd ST`
	 */
	private _doHandleSetCwd(data: string): boolean {
		if (!this._terminal) {
			return false;
		}

		const [command] = data.split(';');
		this._markSequenceSeen(`${ShellIntegrationOscPs.SetCwd};${command}`);

		if (command.match(/^file:\/\/.*\//)) {
			const uri = URI.parse(command);
			if (uri.path && uri.path.length > 0) {
				this._updateCwd(uri.path);
				return true;
			}
		}

		// Unrecognized sequence
		return false;
	}

	serialize(): ISerializedCommandDetectionCapability {
		if (!this._terminal || !this.capabilities.has(TerminalCapability.CommandDetection)) {
			return {
				isWindowsPty: false,
				hasRichCommandDetection: false,
				commands: [],
				promptInputModel: undefined,
			};
		}
		const result = this._createOrGetCommandDetection(this._terminal).serialize();
		return result;
	}

	deserialize(serialized: ISerializedCommandDetectionCapability): void {
		if (!this._terminal) {
			throw new Error('Cannot restore commands before addon is activated');
		}
		const commandDetection = this._createOrGetCommandDetection(this._terminal);
		commandDetection.deserialize(serialized);
		if (commandDetection.cwd) {
			// Cwd gets set when the command is deserialized, so we need to update it here
			this._updateCwd(commandDetection.cwd);
		}
	}

	protected _createOrGetCwdDetection(): ICwdDetectionCapability {
		let cwdDetection = this.capabilities.get(TerminalCapability.CwdDetection);
		if (!cwdDetection) {
			cwdDetection = this._register(new CwdDetectionCapability());
			this.capabilities.add(TerminalCapability.CwdDetection, cwdDetection);
		}
		return cwdDetection;
	}

	protected _createOrGetCommandDetection(terminal: Terminal): ICommandDetectionCapability {
		let commandDetection = this.capabilities.get(TerminalCapability.CommandDetection);
		if (!commandDetection) {
			commandDetection = this._register(new CommandDetectionCapability(terminal, this._logService));
			this.capabilities.add(TerminalCapability.CommandDetection, commandDetection);
		}
		return commandDetection;
	}

	protected _createOrGetBufferMarkDetection(terminal: Terminal): IBufferMarkCapability {
		let bufferMarkDetection = this.capabilities.get(TerminalCapability.BufferMarkDetection);
		if (!bufferMarkDetection) {
			bufferMarkDetection = this._register(new BufferMarkCapability(terminal));
			this.capabilities.add(TerminalCapability.BufferMarkDetection, bufferMarkDetection);
		}
		return bufferMarkDetection;
	}

	protected _createOrGetShellEnvDetection(): IShellEnvDetectionCapability {
		let shellEnvDetection = this.capabilities.get(TerminalCapability.ShellEnvDetection);
		if (!shellEnvDetection) {
			shellEnvDetection = this._register(new ShellEnvDetectionCapability());
			this.capabilities.add(TerminalCapability.ShellEnvDetection, shellEnvDetection);
		}
		return shellEnvDetection;
	}

	protected _createOrGetPromptTypeDetection(): IPromptTypeDetectionCapability {
		let promptTypeDetection = this.capabilities.get(TerminalCapability.PromptTypeDetection);
		if (!promptTypeDetection) {
			promptTypeDetection = this._register(new PromptTypeDetectionCapability());
			this.capabilities.add(TerminalCapability.PromptTypeDetection, promptTypeDetection);
		}
		return promptTypeDetection;
	}
}

export function deserializeVSCodeOscMessage(message: string): string {
	return message.replaceAll(
		// Backslash ('\') followed by an escape operator: either another '\', or 'x' and two hex chars.
		/\\(\\|x([0-9a-f]{2}))/gi,
		// If it's a hex value, parse it to a character.
		// Otherwise the operator is '\', which we return literally, now unescaped.
		(_match: string, op: string, hex?: string) => hex ? String.fromCharCode(parseInt(hex, 16)) : op);
}

export function serializeVSCodeOscMessage(message: string): string {
	return message.replace(
		// Match backslash ('\'), semicolon (';'), or characters 0x20 and below
		/[\\;\x00-\x20]/g,
		(char: string) => {
			// Escape backslash as '\\'
			if (char === '\\') {
				return '\\\\';
			}
			// Escape other characters as '\xAB' where AB is the hex representation
			const charCode = char.charCodeAt(0);
			return `\\x${charCode.toString(16).padStart(2, '0')}`;
		}
	);
}

export function parseKeyValueAssignment(message: string): { key: string; value: string | undefined } {
	const separatorIndex = message.indexOf('=');
	if (separatorIndex === -1) {
		return { key: message, value: undefined }; // No '=' was found.
	}
	return {
		key: message.substring(0, separatorIndex),
		value: message.substring(1 + separatorIndex)
	};
}


export function parseMarkSequence(sequence: (string | undefined)[]): { id?: string; hidden?: boolean } {
	let id = undefined;
	let hidden = false;
	for (const property of sequence) {
		// Sanity check, this shouldn't happen in practice
		if (property === undefined) {
			continue;
		}
		if (property === 'Hidden') {
			hidden = true;
		}
		if (property.startsWith('Id=')) {
			id = property.substring(3);
		}
	}
	return { id, hidden };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/electron-main/electronPtyHostStarter.ts]---
Location: vscode-main/src/vs/platform/terminal/electron-main/electronPtyHostStarter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { parsePtyHostDebugPort } from '../../environment/node/environmentService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { NullTelemetryService } from '../../telemetry/common/telemetryUtils.js';
import { IReconnectConstants, TerminalSettingId } from '../common/terminal.js';
import { IPtyHostConnection, IPtyHostStarter } from '../node/ptyHost.js';
import { UtilityProcess } from '../../utilityProcess/electron-main/utilityProcess.js';
import { Client as MessagePortClient } from '../../../base/parts/ipc/electron-main/ipc.mp.js';
import { IpcMainEvent } from 'electron';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { Emitter } from '../../../base/common/event.js';
import { deepClone } from '../../../base/common/objects.js';
import { isNumber } from '../../../base/common/types.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { Schemas } from '../../../base/common/network.js';

export class ElectronPtyHostStarter extends Disposable implements IPtyHostStarter {

	private utilityProcess: UtilityProcess | undefined = undefined;

	private readonly _onRequestConnection = new Emitter<void>();
	readonly onRequestConnection = this._onRequestConnection.event;
	private readonly _onWillShutdown = new Emitter<void>();
	readonly onWillShutdown = this._onWillShutdown.event;

	constructor(
		private readonly _reconnectConstants: IReconnectConstants,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEnvironmentMainService private readonly _environmentMainService: IEnvironmentMainService,
		@ILifecycleMainService private readonly _lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly _logService: ILogService
	) {
		super();

		this._register(this._lifecycleMainService.onWillShutdown(() => this._onWillShutdown.fire()));
		// Listen for new windows to establish connection directly to pty host
		validatedIpcMain.on('vscode:createPtyHostMessageChannel', (e, nonce) => this._onWindowConnection(e, nonce));
		this._register(toDisposable(() => {
			validatedIpcMain.removeHandler('vscode:createPtyHostMessageChannel');
		}));
	}

	start(): IPtyHostConnection {
		this.utilityProcess = new UtilityProcess(this._logService, NullTelemetryService, this._lifecycleMainService);

		const inspectParams = parsePtyHostDebugPort(this._environmentMainService.args, this._environmentMainService.isBuilt);
		const execArgv = inspectParams.port ? [
			'--nolazy',
			`--inspect${inspectParams.break ? '-brk' : ''}=${inspectParams.port}`
		] : undefined;

		this.utilityProcess.start({
			type: 'ptyHost',
			name: 'pty-host',
			entryPoint: 'vs/platform/terminal/node/ptyHostMain',
			execArgv,
			args: ['--logsPath', this._environmentMainService.logsHome.with({ scheme: Schemas.file }).fsPath],
			env: this._createPtyHostConfiguration()
		});

		const port = this.utilityProcess.connect();
		const client = new MessagePortClient(port, 'ptyHost');

		const store = new DisposableStore();
		store.add(client);
		store.add(toDisposable(() => {
			this.utilityProcess?.kill();
			this.utilityProcess?.dispose();
			this.utilityProcess = undefined;
		}));

		return {
			client,
			store,
			onDidProcessExit: this.utilityProcess.onExit
		};
	}

	private _createPtyHostConfiguration() {
		this._environmentMainService.unsetSnapExportedVariables();
		const config: { [key: string]: string } = {
			...deepClone(process.env),
			VSCODE_ESM_ENTRYPOINT: 'vs/platform/terminal/node/ptyHostMain',
			VSCODE_PIPE_LOGGING: 'true',
			VSCODE_VERBOSE_LOGGING: 'true', // transmit console logs from server to client,
			VSCODE_RECONNECT_GRACE_TIME: String(this._reconnectConstants.graceTime),
			VSCODE_RECONNECT_SHORT_GRACE_TIME: String(this._reconnectConstants.shortGraceTime),
			VSCODE_RECONNECT_SCROLLBACK: String(this._reconnectConstants.scrollback),
		};
		const simulatedLatency = this._configurationService.getValue(TerminalSettingId.DeveloperPtyHostLatency);
		if (simulatedLatency && isNumber(simulatedLatency)) {
			config.VSCODE_LATENCY = String(simulatedLatency);
		}
		const startupDelay = this._configurationService.getValue(TerminalSettingId.DeveloperPtyHostStartupDelay);
		if (startupDelay && isNumber(startupDelay)) {
			config.VSCODE_STARTUP_DELAY = String(startupDelay);
		}
		this._environmentMainService.restoreSnapExportedVariables();
		return config;
	}

	private _onWindowConnection(e: IpcMainEvent, nonce: string) {
		this._onRequestConnection.fire();

		const port = this.utilityProcess!.connect();

		// Check back if the requesting window meanwhile closed
		// Since shared process is delayed on startup there is
		// a chance that the window close before the shared process
		// was ready for a connection.

		if (e.sender.isDestroyed()) {
			port.close();
			return;
		}

		e.sender.postMessage('vscode:createPtyHostMessageChannelResult', nonce, [port]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/childProcessMonitor.ts]---
Location: vscode-main/src/vs/platform/terminal/node/childProcessMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parse } from '../../../base/common/path.js';
import { debounce, throttle } from '../../../base/common/decorators.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ProcessItem } from '../../../base/common/processes.js';
import { listProcesses } from '../../../base/node/ps.js';
import { ILogService } from '../../log/common/log.js';

const enum Constants {
	/**
	 * The amount of time to throttle checks when the process receives output.
	 */
	InactiveThrottleDuration = 5000,
	/**
	 * The amount of time to debounce check when the process receives input.
	 */
	ActiveDebounceDuration = 1000,
}

export const ignoreProcessNames: string[] = [];

/**
 * Monitors a process for child processes, checking at differing times depending on input and output
 * calls into the monitor.
 */
export class ChildProcessMonitor extends Disposable {
	private _hasChildProcesses: boolean = false;
	private set hasChildProcesses(value: boolean) {
		if (this._hasChildProcesses !== value) {
			this._hasChildProcesses = value;
			this._logService.debug('ChildProcessMonitor: Has child processes changed', value);
			this._onDidChangeHasChildProcesses.fire(value);
		}
	}
	/**
	 * Whether the process has child processes.
	 */
	get hasChildProcesses(): boolean { return this._hasChildProcesses; }

	private readonly _onDidChangeHasChildProcesses = this._register(new Emitter<boolean>());
	/**
	 * An event that fires when whether the process has child processes changes.
	 */
	readonly onDidChangeHasChildProcesses = this._onDidChangeHasChildProcesses.event;

	constructor(
		private readonly _pid: number,
		@ILogService private readonly _logService: ILogService
	) {
		super();
	}

	/**
	 * Input was triggered on the process.
	 */
	handleInput() {
		this._refreshActive();
	}

	/**
	 * Output was triggered on the process.
	 */
	handleOutput() {
		this._refreshInactive();
	}

	@debounce(Constants.ActiveDebounceDuration)
	private async _refreshActive(): Promise<void> {
		if (this._store.isDisposed) {
			return;
		}
		try {
			const processItem = await listProcesses(this._pid);
			this.hasChildProcesses = this._processContainsChildren(processItem);
		} catch (e) {
			this._logService.debug('ChildProcessMonitor: Fetching process tree failed', e);
		}
	}

	@throttle(Constants.InactiveThrottleDuration)
	private _refreshInactive(): void {
		this._refreshActive();
	}

	private _processContainsChildren(processItem: ProcessItem): boolean {
		// No child processes
		if (!processItem.children) {
			return false;
		}

		// A single child process, handle special cases
		if (processItem.children.length === 1) {
			const item = processItem.children[0];
			let cmd: string;
			if (item.cmd.startsWith(`"`)) {
				cmd = item.cmd.substring(1, item.cmd.indexOf(`"`, 1));
			} else {
				const spaceIndex = item.cmd.indexOf(` `);
				if (spaceIndex === -1) {
					cmd = item.cmd;
				} else {
					cmd = item.cmd.substring(0, spaceIndex);
				}
			}
			return ignoreProcessNames.indexOf(parse(cmd).name) === -1;
		}

		// Fallback, count child processes
		return processItem.children.length > 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/heartbeatService.ts]---
Location: vscode-main/src/vs/platform/terminal/node/heartbeatService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { HeartbeatConstants, IHeartbeatService } from '../common/terminal.js';

export class HeartbeatService extends Disposable implements IHeartbeatService {
	private readonly _onBeat = this._register(new Emitter<void>());
	readonly onBeat = this._onBeat.event;

	constructor() {
		super();

		const interval = setInterval(() => {
			this._onBeat.fire();
		}, HeartbeatConstants.BeatInterval);
		this._register(toDisposable(() => clearInterval(interval)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/nodePtyHostStarter.ts]---
Location: vscode-main/src/vs/platform/terminal/node/nodePtyHostStarter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { FileAccess, Schemas } from '../../../base/common/network.js';
import { Client, IIPCOptions } from '../../../base/parts/ipc/node/ipc.cp.js';
import { IEnvironmentService, INativeEnvironmentService } from '../../environment/common/environment.js';
import { parsePtyHostDebugPort } from '../../environment/node/environmentService.js';
import { IReconnectConstants } from '../common/terminal.js';
import { IPtyHostConnection, IPtyHostStarter } from './ptyHost.js';

export class NodePtyHostStarter extends Disposable implements IPtyHostStarter {
	constructor(
		private readonly _reconnectConstants: IReconnectConstants,
		@IEnvironmentService private readonly _environmentService: INativeEnvironmentService
	) {
		super();
	}

	start(): IPtyHostConnection {
		const opts: IIPCOptions = {
			serverName: 'Pty Host',
			args: ['--type=ptyHost', '--logsPath', this._environmentService.logsHome.with({ scheme: Schemas.file }).fsPath],
			env: {
				VSCODE_ESM_ENTRYPOINT: 'vs/platform/terminal/node/ptyHostMain',
				VSCODE_PIPE_LOGGING: 'true',
				VSCODE_VERBOSE_LOGGING: 'true', // transmit console logs from server to client,
				VSCODE_RECONNECT_GRACE_TIME: this._reconnectConstants.graceTime,
				VSCODE_RECONNECT_SHORT_GRACE_TIME: this._reconnectConstants.shortGraceTime,
				VSCODE_RECONNECT_SCROLLBACK: this._reconnectConstants.scrollback
			}
		};

		const ptyHostDebug = parsePtyHostDebugPort(this._environmentService.args, this._environmentService.isBuilt);
		if (ptyHostDebug) {
			if (ptyHostDebug.break && ptyHostDebug.port) {
				opts.debugBrk = ptyHostDebug.port;
			} else if (!ptyHostDebug.break && ptyHostDebug.port) {
				opts.debug = ptyHostDebug.port;
			}
		}

		const client = new Client(FileAccess.asFileUri('bootstrap-fork').fsPath, opts);

		const store = new DisposableStore();
		store.add(client);

		return {
			client,
			store,
			onDidProcessExit: client.onDidProcessExit
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/ptyHost.ts]---
Location: vscode-main/src/vs/platform/terminal/node/ptyHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { IChannelClient } from '../../../base/parts/ipc/common/ipc.js';

export interface IPtyHostConnection {
	readonly client: IChannelClient;
	readonly store: DisposableStore;
	readonly onDidProcessExit: Event<{ code: number; signal: string }>;
}

export interface IPtyHostStarter extends IDisposable {
	readonly onRequestConnection?: Event<void>;
	readonly onWillShutdown?: Event<void>;

	/**
	 * Creates a pty host and connects to it.
	 */
	start(): IPtyHostConnection;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/ptyHostMain.ts]---
Location: vscode-main/src/vs/platform/terminal/node/ptyHostMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DefaultURITransformer } from '../../../base/common/uriIpc.js';
import { ProxyChannel } from '../../../base/parts/ipc/common/ipc.js';
import { Server as ChildProcessServer } from '../../../base/parts/ipc/node/ipc.cp.js';
import { Server as UtilityProcessServer } from '../../../base/parts/ipc/node/ipc.mp.js';
import { localize } from '../../../nls.js';
import { OPTIONS, parseArgs } from '../../environment/node/argv.js';
import { NativeEnvironmentService } from '../../environment/node/environmentService.js';
import { getLogLevel } from '../../log/common/log.js';
import { LoggerChannel } from '../../log/common/logIpc.js';
import { LogService } from '../../log/common/logService.js';
import { LoggerService } from '../../log/node/loggerService.js';
import product from '../../product/common/product.js';
import { IProductService } from '../../product/common/productService.js';
import { IReconnectConstants, TerminalIpcChannels } from '../common/terminal.js';
import { HeartbeatService } from './heartbeatService.js';
import { PtyService } from './ptyService.js';
import { isUtilityProcess } from '../../../base/parts/sandbox/node/electronTypes.js';
import { timeout } from '../../../base/common/async.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';

startPtyHost();

async function startPtyHost() {
	// Parse environment variables
	const startupDelay = parseInt(process.env.VSCODE_STARTUP_DELAY ?? '0');
	const simulatedLatency = parseInt(process.env.VSCODE_LATENCY ?? '0');
	const reconnectConstants: IReconnectConstants = {
		graceTime: parseInt(process.env.VSCODE_RECONNECT_GRACE_TIME || '0'),
		shortGraceTime: parseInt(process.env.VSCODE_RECONNECT_SHORT_GRACE_TIME || '0'),
		scrollback: parseInt(process.env.VSCODE_RECONNECT_SCROLLBACK || '100')
	};

	// Sanitize environment
	delete process.env.VSCODE_RECONNECT_GRACE_TIME;
	delete process.env.VSCODE_RECONNECT_SHORT_GRACE_TIME;
	delete process.env.VSCODE_RECONNECT_SCROLLBACK;
	delete process.env.VSCODE_LATENCY;
	delete process.env.VSCODE_STARTUP_DELAY;

	// Delay startup if needed, this must occur before RPC is setup to avoid the channel from timing
	// out.
	if (startupDelay) {
		await timeout(startupDelay);
	}

	// Setup RPC
	const _isUtilityProcess = isUtilityProcess(process);
	let server: ChildProcessServer<string> | UtilityProcessServer;
	if (_isUtilityProcess) {
		server = new UtilityProcessServer();
	} else {
		server = new ChildProcessServer(TerminalIpcChannels.PtyHost);
	}

	// Services
	const productService: IProductService = { _serviceBrand: undefined, ...product };
	const environmentService = new NativeEnvironmentService(parseArgs(process.argv, OPTIONS), productService);
	const loggerService = new LoggerService(getLogLevel(environmentService), environmentService.logsHome);
	server.registerChannel(TerminalIpcChannels.Logger, new LoggerChannel(loggerService, () => DefaultURITransformer));
	const logger = loggerService.createLogger('ptyhost', { name: localize('ptyHost', "Pty Host") });
	const logService = new LogService(logger);

	// Log developer config
	if (startupDelay) {
		logService.warn(`Pty Host startup is delayed ${startupDelay}ms`);
	}
	if (simulatedLatency) {
		logService.warn(`Pty host is simulating ${simulatedLatency}ms latency`);
	}

	const disposables = new DisposableStore();

	// Heartbeat responsiveness tracking
	const heartbeatService = new HeartbeatService();
	server.registerChannel(TerminalIpcChannels.Heartbeat, ProxyChannel.fromService(heartbeatService, disposables));

	// Init pty service
	const ptyService = new PtyService(logService, productService, reconnectConstants, simulatedLatency);
	const ptyServiceChannel = ProxyChannel.fromService(ptyService, disposables);
	server.registerChannel(TerminalIpcChannels.PtyHost, ptyServiceChannel);

	// Register a channel for direct communication via Message Port
	if (_isUtilityProcess) {
		server.registerChannel(TerminalIpcChannels.PtyHostWindow, ptyServiceChannel);
	}

	// Clean up
	process.once('exit', () => {
		logService.trace('Pty host exiting');
		logService.dispose();
		heartbeatService.dispose();
		ptyService.dispose();
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/node/ptyHostService.ts]---
Location: vscode-main/src/vs/platform/terminal/node/ptyHostService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IProcessEnvironment, OS, OperatingSystem, isWindows } from '../../../base/common/platform.js';
import { ProxyChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ILogService, ILoggerService, LogLevel } from '../../log/common/log.js';
import { RemoteLoggerChannelClient } from '../../log/common/logIpc.js';
import { getResolvedShellEnv } from '../../shell/node/shellEnv.js';
import { IPtyHostProcessReplayEvent } from '../common/capabilities/capabilities.js';
import { RequestStore } from '../common/requestStore.js';
import { HeartbeatConstants, IHeartbeatService, ITerminalLaunchResult, IProcessDataEvent, IProcessProperty, IProcessPropertyMap, IProcessReadyEvent, IPtyHostLatencyMeasurement, IPtyHostService, IPtyService, IRequestResolveVariablesEvent, ISerializedTerminalState, IShellLaunchConfig, ITerminalLaunchError, ITerminalProcessOptions, ITerminalProfile, ITerminalsLayoutInfo, ProcessPropertyType, TerminalIcon, TerminalIpcChannels, TerminalSettingId, TitleEventSource } from '../common/terminal.js';
import { registerTerminalPlatformConfiguration } from '../common/terminalPlatformConfiguration.js';
import { IGetTerminalLayoutInfoArgs, IProcessDetails, ISetTerminalLayoutInfoArgs } from '../common/terminalProcess.js';
import { IPtyHostConnection, IPtyHostStarter } from './ptyHost.js';
import { detectAvailableProfiles } from './terminalProfiles.js';
import * as performance from '../../../base/common/performance.js';
import { getSystemShell } from '../../../base/node/shell.js';
import { StopWatch } from '../../../base/common/stopwatch.js';

enum Constants {
	MaxRestarts = 5
}

/**
 * This service implements IPtyService by launching a pty host process, forwarding messages to and
 * from the pty host process and manages the connection.
 */
export class PtyHostService extends Disposable implements IPtyHostService {
	declare readonly _serviceBrand: undefined;

	private __connection?: IPtyHostConnection;
	// ProxyChannel is not used here because events get lost when forwarding across multiple proxies
	private __proxy?: IPtyService;

	private get _connection(): IPtyHostConnection {
		this._ensurePtyHost();
		return this.__connection!;
	}
	private get _proxy(): IPtyService {
		this._ensurePtyHost();
		return this.__proxy!;
	}
	/**
	 * Get the proxy if it exists, otherwise undefined. This is used when calls are not needed to be
	 * passed through to the pty host if it has not yet been spawned.
	 */
	private get _optionalProxy(): IPtyService | undefined {
		return this.__proxy;
	}

	private _ensurePtyHost() {
		if (!this.__connection) {
			this._startPtyHost();
		}
	}

	private readonly _resolveVariablesRequestStore: RequestStore<string[], { workspaceId: string; originalText: string[] }>;
	private _wasQuitRequested = false;
	private _restartCount = 0;
	private _isResponsive = true;
	private _heartbeatFirstTimeout?: Timeout;
	private _heartbeatSecondTimeout?: Timeout;

	private readonly _onPtyHostExit = this._register(new Emitter<number>());
	readonly onPtyHostExit = this._onPtyHostExit.event;
	private readonly _onPtyHostStart = this._register(new Emitter<void>());
	readonly onPtyHostStart = this._onPtyHostStart.event;
	private readonly _onPtyHostUnresponsive = this._register(new Emitter<void>());
	readonly onPtyHostUnresponsive = this._onPtyHostUnresponsive.event;
	private readonly _onPtyHostResponsive = this._register(new Emitter<void>());
	readonly onPtyHostResponsive = this._onPtyHostResponsive.event;
	private readonly _onPtyHostRequestResolveVariables = this._register(new Emitter<IRequestResolveVariablesEvent>());
	readonly onPtyHostRequestResolveVariables = this._onPtyHostRequestResolveVariables.event;

	private readonly _onProcessData = this._register(new Emitter<{ id: number; event: IProcessDataEvent | string }>());
	readonly onProcessData = this._onProcessData.event;
	private readonly _onProcessReady = this._register(new Emitter<{ id: number; event: IProcessReadyEvent }>());
	readonly onProcessReady = this._onProcessReady.event;
	private readonly _onProcessReplay = this._register(new Emitter<{ id: number; event: IPtyHostProcessReplayEvent }>());
	readonly onProcessReplay = this._onProcessReplay.event;
	private readonly _onProcessOrphanQuestion = this._register(new Emitter<{ id: number }>());
	readonly onProcessOrphanQuestion = this._onProcessOrphanQuestion.event;
	private readonly _onDidRequestDetach = this._register(new Emitter<{ requestId: number; workspaceId: string; instanceId: number }>());
	readonly onDidRequestDetach = this._onDidRequestDetach.event;
	private readonly _onDidChangeProperty = this._register(new Emitter<{ id: number; property: IProcessProperty }>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;
	private readonly _onProcessExit = this._register(new Emitter<{ id: number; event: number | undefined }>());
	readonly onProcessExit = this._onProcessExit.event;

	constructor(
		private readonly _ptyHostStarter: IPtyHostStarter,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@ILoggerService private readonly _loggerService: ILoggerService,
	) {
		super();

		// Platform configuration is required on the process running the pty host (shared process or
		// remote server).
		registerTerminalPlatformConfiguration();

		this._register(this._ptyHostStarter);
		this._register(toDisposable(() => this._disposePtyHost()));

		this._resolveVariablesRequestStore = this._register(new RequestStore(undefined, this._logService));
		this._register(this._resolveVariablesRequestStore.onCreateRequest(this._onPtyHostRequestResolveVariables.fire, this._onPtyHostRequestResolveVariables));

		// Start the pty host when a window requests a connection, if the starter has that capability.
		if (this._ptyHostStarter.onRequestConnection) {
			this._register(Event.once(this._ptyHostStarter.onRequestConnection)(() => this._ensurePtyHost()));
		}

		if (this._ptyHostStarter.onWillShutdown) {
			this._register(this._ptyHostStarter.onWillShutdown(() => this._wasQuitRequested = true));
		}
	}

	private get _ignoreProcessNames(): string[] {
		return this._configurationService.getValue<string[]>(TerminalSettingId.IgnoreProcessNames);
	}

	private async _refreshIgnoreProcessNames(): Promise<void> {
		return this._optionalProxy?.refreshIgnoreProcessNames?.(this._ignoreProcessNames);
	}

	private async _resolveShellEnv(): Promise<typeof process.env> {
		if (isWindows) {
			return process.env;
		}

		try {
			return await getResolvedShellEnv(this._configurationService, this._logService, { _: [] }, process.env);
		} catch (error) {
			this._logService.error('ptyHost was unable to resolve shell environment', error);

			return {};
		}
	}

	private _startPtyHost(): [IPtyHostConnection, IPtyService] {
		const connection = this._ptyHostStarter.start();
		const client = connection.client;

		// Log a full stack trace which will tell the exact reason the pty host is starting up
		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace('PtyHostService#_startPtyHost', new Error().stack?.replace(/^Error/, ''));
		}

		// Setup heartbeat service and trigger a heartbeat immediately to reset the timeouts
		const heartbeatService = ProxyChannel.toService<IHeartbeatService>(client.getChannel(TerminalIpcChannels.Heartbeat));
		heartbeatService.onBeat(() => this._handleHeartbeat());
		this._handleHeartbeat(true);

		// Handle exit
		this._register(connection.onDidProcessExit(e => {
			this._onPtyHostExit.fire(e.code);
			if (!this._wasQuitRequested && !this._store.isDisposed) {
				if (this._restartCount <= Constants.MaxRestarts) {
					this._logService.error(`ptyHost terminated unexpectedly with code ${e.code}`);
					this._restartCount++;
					this.restartPtyHost();
				} else {
					this._logService.error(`ptyHost terminated unexpectedly with code ${e.code}, giving up`);
				}
			}
		}));

		// Create proxy and forward events
		const proxy = ProxyChannel.toService<IPtyService>(client.getChannel(TerminalIpcChannels.PtyHost));
		this._register(proxy.onProcessData(e => this._onProcessData.fire(e)));
		this._register(proxy.onProcessReady(e => this._onProcessReady.fire(e)));
		this._register(proxy.onProcessExit(e => this._onProcessExit.fire(e)));
		this._register(proxy.onDidChangeProperty(e => this._onDidChangeProperty.fire(e)));
		this._register(proxy.onProcessReplay(e => this._onProcessReplay.fire(e)));
		this._register(proxy.onProcessOrphanQuestion(e => this._onProcessOrphanQuestion.fire(e)));
		this._register(proxy.onDidRequestDetach(e => this._onDidRequestDetach.fire(e)));

		this._register(new RemoteLoggerChannelClient(this._loggerService, client.getChannel(TerminalIpcChannels.Logger)));

		this.__connection = connection;
		this.__proxy = proxy;

		this._onPtyHostStart.fire();

		this._register(this._configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration(TerminalSettingId.IgnoreProcessNames)) {
				await this._refreshIgnoreProcessNames();
			}
		}));
		this._refreshIgnoreProcessNames();

		return [connection, proxy];
	}

	async createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment,
		executableEnv: IProcessEnvironment,
		options: ITerminalProcessOptions,
		shouldPersist: boolean,
		workspaceId: string,
		workspaceName: string
	): Promise<number> {
		const timeout = setTimeout(() => this._handleUnresponsiveCreateProcess(), HeartbeatConstants.CreateProcessTimeout);
		const id = await this._proxy.createProcess(shellLaunchConfig, cwd, cols, rows, unicodeVersion, env, executableEnv, options, shouldPersist, workspaceId, workspaceName);
		clearTimeout(timeout);
		return id;
	}
	updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void> {
		return this._proxy.updateTitle(id, title, titleSource);
	}
	updateIcon(id: number, userInitiated: boolean, icon: TerminalIcon, color?: string): Promise<void> {
		return this._proxy.updateIcon(id, userInitiated, icon, color);
	}
	attachToProcess(id: number): Promise<void> {
		return this._proxy.attachToProcess(id);
	}
	detachFromProcess(id: number, forcePersist?: boolean): Promise<void> {
		return this._proxy.detachFromProcess(id, forcePersist);
	}
	shutdownAll(): Promise<void> {
		return this._proxy.shutdownAll();
	}
	listProcesses(): Promise<IProcessDetails[]> {
		return this._proxy.listProcesses();
	}
	async getPerformanceMarks(): Promise<performance.PerformanceMark[]> {
		return this._optionalProxy?.getPerformanceMarks() ?? [];
	}
	async reduceConnectionGraceTime(): Promise<void> {
		return this._optionalProxy?.reduceConnectionGraceTime();
	}
	start(id: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined> {
		return this._proxy.start(id);
	}
	shutdown(id: number, immediate: boolean): Promise<void> {
		return this._proxy.shutdown(id, immediate);
	}
	input(id: number, data: string): Promise<void> {
		return this._proxy.input(id, data);
	}
	sendSignal(id: number, signal: string): Promise<void> {
		return this._proxy.sendSignal(id, signal);
	}
	processBinary(id: number, data: string): Promise<void> {
		return this._proxy.processBinary(id, data);
	}
	resize(id: number, cols: number, rows: number): Promise<void> {
		return this._proxy.resize(id, cols, rows);
	}
	clearBuffer(id: number): Promise<void> {
		return this._proxy.clearBuffer(id);
	}
	acknowledgeDataEvent(id: number, charCount: number): Promise<void> {
		return this._proxy.acknowledgeDataEvent(id, charCount);
	}
	setUnicodeVersion(id: number, version: '6' | '11'): Promise<void> {
		return this._proxy.setUnicodeVersion(id, version);
	}
	setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void> {
		return this._proxy.setNextCommandId(id, commandLine, commandId);
	}
	getInitialCwd(id: number): Promise<string> {
		return this._proxy.getInitialCwd(id);
	}
	getCwd(id: number): Promise<string> {
		return this._proxy.getCwd(id);
	}
	async getLatency(): Promise<IPtyHostLatencyMeasurement[]> {
		const sw = new StopWatch();
		const results = await this._proxy.getLatency();
		sw.stop();
		return [
			{
				label: 'ptyhostservice<->ptyhost',
				latency: sw.elapsed()
			},
			...results
		];
	}
	orphanQuestionReply(id: number): Promise<void> {
		return this._proxy.orphanQuestionReply(id);
	}

	installAutoReply(match: string, reply: string): Promise<void> {
		return this._proxy.installAutoReply(match, reply);
	}
	uninstallAllAutoReplies(): Promise<void> {
		return this._proxy.uninstallAllAutoReplies();
	}

	getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string> {
		return this._optionalProxy?.getDefaultSystemShell(osOverride) ?? getSystemShell(osOverride ?? OS, process.env);
	}
	async getProfiles(workspaceId: string, profiles: unknown, defaultProfile: unknown, includeDetectedProfiles: boolean = false): Promise<ITerminalProfile[]> {
		const shellEnv = await this._resolveShellEnv();
		return detectAvailableProfiles(profiles, defaultProfile, includeDetectedProfiles, this._configurationService, shellEnv, undefined, this._logService, this._resolveVariables.bind(this, workspaceId));
	}
	async getEnvironment(): Promise<IProcessEnvironment> {
		// If the pty host is yet to be launched, just return the environment of this process as it
		// is essentially the same when used to evaluate terminal profiles.
		if (!this.__proxy) {
			return { ...process.env };
		}
		return this._proxy.getEnvironment();
	}
	getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string> {
		return this._proxy.getWslPath(original, direction);
	}

	getRevivedPtyNewId(workspaceId: string, id: number): Promise<number | undefined> {
		return this._proxy.getRevivedPtyNewId(workspaceId, id);
	}

	setTerminalLayoutInfo(args: ISetTerminalLayoutInfoArgs): Promise<void> {
		return this._proxy.setTerminalLayoutInfo(args);
	}
	async getTerminalLayoutInfo(args: IGetTerminalLayoutInfoArgs): Promise<ITerminalsLayoutInfo | undefined> {
		// This is optional as we want reconnect requests to go through only if the pty host exists.
		// Revive is handled specially as reviveTerminalProcesses is guaranteed to be called before
		// the request for layout info.
		return this._optionalProxy?.getTerminalLayoutInfo(args);
	}

	async requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined> {
		return this._proxy.requestDetachInstance(workspaceId, instanceId);
	}

	async acceptDetachInstanceReply(requestId: number, persistentProcessId: number): Promise<void> {
		return this._proxy.acceptDetachInstanceReply(requestId, persistentProcessId);
	}

	async freePortKillProcess(port: string): Promise<{ port: string; processId: string }> {
		if (!this._proxy.freePortKillProcess) {
			throw new Error('freePortKillProcess does not exist on the pty proxy');
		}
		return this._proxy.freePortKillProcess(port);
	}

	async serializeTerminalState(ids: number[]): Promise<string> {
		return this._proxy.serializeTerminalState(ids);
	}

	async reviveTerminalProcesses(workspaceId: string, state: ISerializedTerminalState[], dateTimeFormatLocate: string) {
		return this._proxy.reviveTerminalProcesses(workspaceId, state, dateTimeFormatLocate);
	}

	async refreshProperty<T extends ProcessPropertyType>(id: number, property: T): Promise<IProcessPropertyMap[T]> {
		return this._proxy.refreshProperty(id, property);

	}
	async updateProperty<T extends ProcessPropertyType>(id: number, property: T, value: IProcessPropertyMap[T]): Promise<void> {
		return this._proxy.updateProperty(id, property, value);
	}

	async restartPtyHost(): Promise<void> {
		this._disposePtyHost();
		this._isResponsive = true;
		this._startPtyHost();
	}

	private _disposePtyHost(): void {
		this._proxy.shutdownAll();
		this._connection.store.dispose();
	}

	private _handleHeartbeat(isConnecting?: boolean) {
		this._clearHeartbeatTimeouts();
		this._heartbeatFirstTimeout = setTimeout(() => this._handleHeartbeatFirstTimeout(), isConnecting ? HeartbeatConstants.ConnectingBeatInterval : (HeartbeatConstants.BeatInterval * HeartbeatConstants.FirstWaitMultiplier));
		if (!this._isResponsive) {
			this._isResponsive = true;
			this._onPtyHostResponsive.fire();
		}
	}

	private _handleHeartbeatFirstTimeout() {
		this._logService.warn(`No ptyHost heartbeat after ${HeartbeatConstants.BeatInterval * HeartbeatConstants.FirstWaitMultiplier / 1000} seconds`);
		this._heartbeatFirstTimeout = undefined;
		this._heartbeatSecondTimeout = setTimeout(() => this._handleHeartbeatSecondTimeout(), HeartbeatConstants.BeatInterval * HeartbeatConstants.SecondWaitMultiplier);
	}

	private _handleHeartbeatSecondTimeout() {
		this._logService.error(`No ptyHost heartbeat after ${(HeartbeatConstants.BeatInterval * HeartbeatConstants.FirstWaitMultiplier + HeartbeatConstants.BeatInterval * HeartbeatConstants.FirstWaitMultiplier) / 1000} seconds`);
		this._heartbeatSecondTimeout = undefined;
		if (this._isResponsive) {
			this._isResponsive = false;
			this._onPtyHostUnresponsive.fire();
		}
	}

	private _handleUnresponsiveCreateProcess() {
		this._clearHeartbeatTimeouts();
		this._logService.error(`No ptyHost response to createProcess after ${HeartbeatConstants.CreateProcessTimeout / 1000} seconds`);
		if (this._isResponsive) {
			this._isResponsive = false;
			this._onPtyHostUnresponsive.fire();
		}
	}

	private _clearHeartbeatTimeouts() {
		if (this._heartbeatFirstTimeout) {
			clearTimeout(this._heartbeatFirstTimeout);
			this._heartbeatFirstTimeout = undefined;
		}
		if (this._heartbeatSecondTimeout) {
			clearTimeout(this._heartbeatSecondTimeout);
			this._heartbeatSecondTimeout = undefined;
		}
	}

	private _resolveVariables(workspaceId: string, text: string[]): Promise<string[]> {
		return this._resolveVariablesRequestStore.createRequest({ workspaceId, originalText: text });
	}
	async acceptPtyHostResolvedVariables(requestId: number, resolved: string[]) {
		this._resolveVariablesRequestStore.acceptReply(requestId, resolved);
	}
}
```

--------------------------------------------------------------------------------

````

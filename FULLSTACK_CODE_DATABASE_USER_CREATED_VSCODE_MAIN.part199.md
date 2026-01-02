---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 199
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 199 of 552)

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

---[FILE: src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextInput.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../../../../base/browser/browser.js';
import * as dom from '../../../../../base/browser/dom.js';
import { DomEmitter } from '../../../../../base/browser/event.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { inputLatency } from '../../../../../base/browser/performance.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import * as strings from '../../../../../base/common/strings.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ensureClipboardGetsEditorSelection, computePasteData, InMemoryClipboardMetadataManager, IPasteData, getPasteDataFromMetadata } from '../clipboardUtils.js';
import { _debugComposition, ITextAreaWrapper, ITypeData, TextAreaState } from './textAreaEditContextState.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';

export namespace TextAreaSyntethicEvents {
	export const Tap = '-monaco-textarea-synthetic-tap';
}

export interface ICompositionData {
	data: string;
}

export interface ITextAreaInputHost {
	readonly context: ViewContext | null;
	getScreenReaderContent(): TextAreaState;
	deduceModelPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position;
}

export interface ICompositionStartEvent {
	data: string;
}

export interface ICompleteTextAreaWrapper extends ITextAreaWrapper {
	readonly onKeyDown: Event<KeyboardEvent>;
	readonly onKeyPress: Event<KeyboardEvent>;
	readonly onKeyUp: Event<KeyboardEvent>;
	readonly onCompositionStart: Event<CompositionEvent>;
	readonly onCompositionUpdate: Event<CompositionEvent>;
	readonly onCompositionEnd: Event<CompositionEvent>;
	readonly onBeforeInput: Event<InputEvent>;
	readonly onInput: Event<InputEvent>;
	readonly onCut: Event<ClipboardEvent>;
	readonly onCopy: Event<ClipboardEvent>;
	readonly onPaste: Event<ClipboardEvent>;
	readonly onFocus: Event<FocusEvent>;
	readonly onBlur: Event<FocusEvent>;
	readonly onSyntheticTap: Event<void>;

	readonly ownerDocument: Document;

	setIgnoreSelectionChangeTime(reason: string): void;
	getIgnoreSelectionChangeTime(): number;
	resetSelectionChangeTime(): void;

	hasFocus(): boolean;
}

export interface IBrowser {
	isAndroid: boolean;
	isFirefox: boolean;
	isChrome: boolean;
	isSafari: boolean;
}

class CompositionContext {

	private _lastTypeTextLength: number;

	constructor() {
		this._lastTypeTextLength = 0;
	}

	public handleCompositionUpdate(text: string | null | undefined): ITypeData {
		text = text || '';
		const typeInput: ITypeData = {
			text: text,
			replacePrevCharCnt: this._lastTypeTextLength,
			replaceNextCharCnt: 0,
			positionDelta: 0
		};
		this._lastTypeTextLength = text.length;
		return typeInput;
	}
}

/**
 * Writes screen reader content to the textarea and is able to analyze its input events to generate:
 *  - onCut
 *  - onPaste
 *  - onType
 *
 * Composition events are generated for presentation purposes (composition input is reflected in onType).
 */
export class TextAreaInput extends Disposable {

	private _onFocus = this._register(new Emitter<void>());
	public readonly onFocus: Event<void> = this._onFocus.event;

	private _onBlur = this._register(new Emitter<void>());
	public readonly onBlur: Event<void> = this._onBlur.event;

	private _onKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public readonly onKeyDown: Event<IKeyboardEvent> = this._onKeyDown.event;

	private _onKeyUp = this._register(new Emitter<IKeyboardEvent>());
	public readonly onKeyUp: Event<IKeyboardEvent> = this._onKeyUp.event;

	private _onCut = this._register(new Emitter<void>());
	public readonly onCut: Event<void> = this._onCut.event;

	private _onPaste = this._register(new Emitter<IPasteData>());
	public readonly onPaste: Event<IPasteData> = this._onPaste.event;

	private _onType = this._register(new Emitter<ITypeData>());
	public readonly onType: Event<ITypeData> = this._onType.event;

	private _onCompositionStart = this._register(new Emitter<ICompositionStartEvent>());
	public readonly onCompositionStart: Event<ICompositionStartEvent> = this._onCompositionStart.event;

	private _onCompositionUpdate = this._register(new Emitter<ICompositionData>());
	public readonly onCompositionUpdate: Event<ICompositionData> = this._onCompositionUpdate.event;

	private _onCompositionEnd = this._register(new Emitter<void>());
	public readonly onCompositionEnd: Event<void> = this._onCompositionEnd.event;

	private _onSelectionChangeRequest = this._register(new Emitter<Selection>());
	public readonly onSelectionChangeRequest: Event<Selection> = this._onSelectionChangeRequest.event;

	// ---

	private readonly _asyncTriggerCut: RunOnceScheduler;

	private readonly _asyncFocusGainWriteScreenReaderContent: MutableDisposable<RunOnceScheduler> = this._register(new MutableDisposable());

	private _textAreaState: TextAreaState;

	public get textAreaState(): TextAreaState {
		return this._textAreaState;
	}

	private _selectionChangeListener: IDisposable | null;

	private _hasFocus: boolean;
	private _currentComposition: CompositionContext | null;

	constructor(
		private readonly _host: ITextAreaInputHost,
		private readonly _textArea: ICompleteTextAreaWrapper,
		private readonly _OS: OperatingSystem,
		private readonly _browser: IBrowser,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._asyncTriggerCut = this._register(new RunOnceScheduler(() => this._onCut.fire(), 0));
		this._textAreaState = TextAreaState.EMPTY;
		this._selectionChangeListener = null;
		if (this._accessibilityService.isScreenReaderOptimized()) {
			this.writeNativeTextAreaContent('ctor');
		}
		this._register(Event.runAndSubscribe(this._accessibilityService.onDidChangeScreenReaderOptimized, () => {
			if (this._accessibilityService.isScreenReaderOptimized() && !this._asyncFocusGainWriteScreenReaderContent.value) {
				this._asyncFocusGainWriteScreenReaderContent.value = this._register(new RunOnceScheduler(() => this.writeNativeTextAreaContent('asyncFocusGain'), 0));
			} else {
				this._asyncFocusGainWriteScreenReaderContent.clear();
			}
		}));
		this._hasFocus = false;
		this._currentComposition = null;

		let lastKeyDown: IKeyboardEvent | null = null;

		this._register(this._textArea.onKeyDown((_e) => {
			const e = new StandardKeyboardEvent(_e);
			if (e.keyCode === KeyCode.KEY_IN_COMPOSITION
				|| (this._currentComposition && e.keyCode === KeyCode.Backspace)) {
				// Stop propagation for keyDown events if the IME is processing key input
				e.stopPropagation();
			}

			if (e.equals(KeyCode.Escape)) {
				// Prevent default always for `Esc`, otherwise it will generate a keypress
				// See https://msdn.microsoft.com/en-us/library/ie/ms536939(v=vs.85).aspx
				e.preventDefault();
			}

			lastKeyDown = e;
			this._onKeyDown.fire(e);
		}));

		this._register(this._textArea.onKeyUp((_e) => {
			const e = new StandardKeyboardEvent(_e);
			this._onKeyUp.fire(e);
		}));

		this._register(this._textArea.onCompositionStart((e) => {
			if (_debugComposition) {
				console.log(`[compositionstart]`, e);
			}

			const currentComposition = new CompositionContext();
			if (this._currentComposition) {
				// simply reset the composition context
				this._currentComposition = currentComposition;
				return;
			}
			this._currentComposition = currentComposition;

			if (
				this._OS === OperatingSystem.Macintosh
				&& lastKeyDown
				&& lastKeyDown.equals(KeyCode.KEY_IN_COMPOSITION)
				&& this._textAreaState.selectionStart === this._textAreaState.selectionEnd
				&& this._textAreaState.selectionStart > 0
				&& this._textAreaState.value.substr(this._textAreaState.selectionStart - 1, 1) === e.data
				&& (lastKeyDown.code === 'ArrowRight' || lastKeyDown.code === 'ArrowLeft')
			) {
				// Handling long press case on Chromium/Safari macOS + arrow key => pretend the character was selected
				if (_debugComposition) {
					console.log(`[compositionstart] Handling long press case on macOS + arrow key`, e);
				}
				// Pretend the previous character was composed (in order to get it removed by subsequent compositionupdate events)
				currentComposition.handleCompositionUpdate('x');
				this._onCompositionStart.fire({ data: e.data });
				return;
			}

			if (this._browser.isAndroid) {
				// when tapping on the editor, Android enters composition mode to edit the current word
				// so we cannot clear the textarea on Android and we must pretend the current word was selected
				this._onCompositionStart.fire({ data: e.data });
				return;
			}

			this._onCompositionStart.fire({ data: e.data });
		}));

		this._register(this._textArea.onCompositionUpdate((e) => {
			if (_debugComposition) {
				console.log(`[compositionupdate]`, e);
			}
			const currentComposition = this._currentComposition;
			if (!currentComposition) {
				// should not be possible to receive a 'compositionupdate' without a 'compositionstart'
				return;
			}
			if (this._browser.isAndroid) {
				// On Android, the data sent with the composition update event is unusable.
				// For example, if the cursor is in the middle of a word like Mic|osoft
				// and Microsoft is chosen from the keyboard's suggestions, the e.data will contain "Microsoft".
				// This is not really usable because it doesn't tell us where the edit began and where it ended.
				const newState = TextAreaState.readFromTextArea(this._textArea, this._textAreaState);
				const typeInput = TextAreaState.deduceAndroidCompositionInput(this._textAreaState, newState);
				this._textAreaState = newState;
				this._onType.fire(typeInput);
				this._onCompositionUpdate.fire(e);
				return;
			}
			const typeInput = currentComposition.handleCompositionUpdate(e.data);
			this._textAreaState = TextAreaState.readFromTextArea(this._textArea, this._textAreaState);
			this._onType.fire(typeInput);
			this._onCompositionUpdate.fire(e);
		}));

		this._register(this._textArea.onCompositionEnd((e) => {
			if (_debugComposition) {
				console.log(`[compositionend]`, e);
			}
			const currentComposition = this._currentComposition;
			if (!currentComposition) {
				// https://github.com/microsoft/monaco-editor/issues/1663
				// On iOS 13.2, Chinese system IME randomly trigger an additional compositionend event with empty data
				return;
			}
			this._currentComposition = null;

			if (this._browser.isAndroid) {
				// On Android, the data sent with the composition update event is unusable.
				// For example, if the cursor is in the middle of a word like Mic|osoft
				// and Microsoft is chosen from the keyboard's suggestions, the e.data will contain "Microsoft".
				// This is not really usable because it doesn't tell us where the edit began and where it ended.
				const newState = TextAreaState.readFromTextArea(this._textArea, this._textAreaState);
				const typeInput = TextAreaState.deduceAndroidCompositionInput(this._textAreaState, newState);
				this._textAreaState = newState;
				this._onType.fire(typeInput);
				this._onCompositionEnd.fire();
				return;
			}

			const typeInput = currentComposition.handleCompositionUpdate(e.data);
			this._textAreaState = TextAreaState.readFromTextArea(this._textArea, this._textAreaState);
			this._onType.fire(typeInput);
			this._onCompositionEnd.fire();
		}));

		this._register(this._textArea.onInput((e) => {
			if (_debugComposition) {
				console.log(`[input]`, e);
			}

			// Pretend here we touched the text area, as the `input` event will most likely
			// result in a `selectionchange` event which we want to ignore
			this._textArea.setIgnoreSelectionChangeTime('received input event');

			if (this._currentComposition) {
				return;
			}

			const newState = TextAreaState.readFromTextArea(this._textArea, this._textAreaState);
			const typeInput = TextAreaState.deduceInput(this._textAreaState, newState, /*couldBeEmojiInput*/this._OS === OperatingSystem.Macintosh);

			if (typeInput.replacePrevCharCnt === 0 && typeInput.text.length === 1) {
				// one character was typed
				if (
					strings.isHighSurrogate(typeInput.text.charCodeAt(0))
					|| typeInput.text.charCodeAt(0) === 0x7f /* Delete */
				) {
					// Ignore invalid input but keep it around for next time
					return;
				}
			}

			this._textAreaState = newState;
			if (
				typeInput.text !== ''
				|| typeInput.replacePrevCharCnt !== 0
				|| typeInput.replaceNextCharCnt !== 0
				|| typeInput.positionDelta !== 0
			) {
				// https://w3c.github.io/input-events/#interface-InputEvent-Attributes
				if (this._host.context && e.inputType === 'insertFromPaste') {
					this._onPaste.fire(getPasteDataFromMetadata(
						typeInput.text,
						InMemoryClipboardMetadataManager.INSTANCE.get(typeInput.text),
						this._host.context
					));
				} else {
					this._onType.fire(typeInput);
				}
			}
		}));

		// --- Clipboard operations

		this._register(this._textArea.onCut((e) => {
			this._logService.trace(`TextAreaInput#onCut`, e);
			// Pretend here we touched the text area, as the `cut` event will most likely
			// result in a `selectionchange` event which we want to ignore
			this._textArea.setIgnoreSelectionChangeTime('received cut event');

			if (this._host.context) {
				ensureClipboardGetsEditorSelection(e, this._host.context, this._logService, this._browser.isFirefox);
			}
			this._asyncTriggerCut.schedule();
		}));

		this._register(this._textArea.onCopy((e) => {
			this._logService.trace(`TextAreaInput#onCopy`, e);
			if (this._host.context) {
				ensureClipboardGetsEditorSelection(e, this._host.context, this._logService, this._browser.isFirefox);
			}
		}));

		this._register(this._textArea.onPaste((e) => {
			this._logService.trace(`TextAreaInput#onPaste`, e);
			// Pretend here we touched the text area, as the `paste` event will most likely
			// result in a `selectionchange` event which we want to ignore
			this._textArea.setIgnoreSelectionChangeTime('received paste event');
			if (!this._host.context) {
				return;
			}
			const pasteData = computePasteData(e, this._host.context, this._logService);
			if (!pasteData) {
				return;
			}
			this._logService.trace(`TextAreaInput#onPaste (before onPaste)`);
			this._onPaste.fire(pasteData);
		}));

		this._register(this._textArea.onFocus(() => {
			const hadFocus = this._hasFocus;

			this._setHasFocus(true);

			if (this._accessibilityService.isScreenReaderOptimized() && this._browser.isSafari && !hadFocus && this._hasFocus) {
				// When "tabbing into" the textarea, immediately after dispatching the 'focus' event,
				// Safari will always move the selection at offset 0 in the textarea
				if (!this._asyncFocusGainWriteScreenReaderContent.value) {
					this._asyncFocusGainWriteScreenReaderContent.value = new RunOnceScheduler(() => this.writeNativeTextAreaContent('asyncFocusGain'), 0);
				}
				this._asyncFocusGainWriteScreenReaderContent.value.schedule();
			}
		}));
		this._register(this._textArea.onBlur(() => {
			if (this._currentComposition) {
				// See https://github.com/microsoft/vscode/issues/112621
				// where compositionend is not triggered when the editor
				// is taken off-dom during a composition

				// Clear the flag to be able to write to the textarea
				this._currentComposition = null;

				// Clear the textarea to avoid an unwanted cursor type
				this.writeNativeTextAreaContent('blurWithoutCompositionEnd');

				// Fire artificial composition end
				this._onCompositionEnd.fire();
			}
			this._setHasFocus(false);
		}));
		this._register(this._textArea.onSyntheticTap(() => {
			if (this._browser.isAndroid && this._currentComposition) {
				// on Android, tapping does not cancel the current composition, so the
				// textarea is stuck showing the old composition

				// Clear the flag to be able to write to the textarea
				this._currentComposition = null;

				// Clear the textarea to avoid an unwanted cursor type
				this.writeNativeTextAreaContent('tapWithoutCompositionEnd');

				// Fire artificial composition end
				this._onCompositionEnd.fire();
			}
		}));
	}

	_initializeFromTest(): void {
		this._hasFocus = true;
		this._textAreaState = TextAreaState.readFromTextArea(this._textArea, null);
	}

	private _installSelectionChangeListener(): IDisposable {
		// See https://github.com/microsoft/vscode/issues/27216 and https://github.com/microsoft/vscode/issues/98256
		// When using a Braille display, it is possible for users to reposition the
		// system caret. This is reflected in Chrome as a `selectionchange` event.
		//
		// The `selectionchange` event appears to be emitted under numerous other circumstances,
		// so it is quite a challenge to distinguish a `selectionchange` coming in from a user
		// using a Braille display from all the other cases.
		//
		// The problems with the `selectionchange` event are:
		//  * the event is emitted when the textarea is focused programmatically -- textarea.focus()
		//  * the event is emitted when the selection is changed in the textarea programmatically -- textarea.setSelectionRange(...)
		//  * the event is emitted when the value of the textarea is changed programmatically -- textarea.value = '...'
		//  * the event is emitted when tabbing into the textarea
		//  * the event is emitted asynchronously (sometimes with a delay as high as a few tens of ms)
		//  * the event sometimes comes in bursts for a single logical textarea operation

		// `selectionchange` events often come multiple times for a single logical change
		// so throttle multiple `selectionchange` events that burst in a short period of time.
		let previousSelectionChangeEventTime = 0;
		return dom.addDisposableListener(this._textArea.ownerDocument, 'selectionchange', (e) => {//todo
			inputLatency.onSelectionChange();

			if (!this._hasFocus) {
				return;
			}
			if (this._currentComposition) {
				return;
			}
			if (!this._browser.isChrome) {
				// Support only for Chrome until testing happens on other browsers
				return;
			}

			const now = Date.now();

			const delta1 = now - previousSelectionChangeEventTime;
			previousSelectionChangeEventTime = now;
			if (delta1 < 5) {
				// received another `selectionchange` event within 5ms of the previous `selectionchange` event
				// => ignore it
				return;
			}

			const delta2 = now - this._textArea.getIgnoreSelectionChangeTime();
			this._textArea.resetSelectionChangeTime();
			if (delta2 < 100) {
				// received a `selectionchange` event within 100ms since we touched the textarea
				// => ignore it, since we caused it
				return;
			}

			if (!this._textAreaState.selection) {
				// Cannot correlate a position in the textarea with a position in the editor...
				return;
			}

			const newValue = this._textArea.getValue();
			if (this._textAreaState.value !== newValue) {
				// Cannot correlate a position in the textarea with a position in the editor...
				return;
			}

			const newSelectionStart = this._textArea.getSelectionStart();
			const newSelectionEnd = this._textArea.getSelectionEnd();
			if (this._textAreaState.selectionStart === newSelectionStart && this._textAreaState.selectionEnd === newSelectionEnd) {
				// Nothing to do...
				return;
			}

			const _newSelectionStartPosition = this._textAreaState.deduceEditorPosition(newSelectionStart);
			const newSelectionStartPosition = this._host.deduceModelPosition(_newSelectionStartPosition[0]!, _newSelectionStartPosition[1], _newSelectionStartPosition[2]);

			const _newSelectionEndPosition = this._textAreaState.deduceEditorPosition(newSelectionEnd);
			const newSelectionEndPosition = this._host.deduceModelPosition(_newSelectionEndPosition[0]!, _newSelectionEndPosition[1], _newSelectionEndPosition[2]);

			const newSelection = new Selection(
				newSelectionStartPosition.lineNumber, newSelectionStartPosition.column,
				newSelectionEndPosition.lineNumber, newSelectionEndPosition.column
			);

			this._onSelectionChangeRequest.fire(newSelection);
		});
	}

	public override dispose(): void {
		super.dispose();
		if (this._selectionChangeListener) {
			this._selectionChangeListener.dispose();
			this._selectionChangeListener = null;
		}
	}

	public focusTextArea(): void {
		// Setting this._hasFocus and writing the screen reader content
		// will result in a focus() and setSelectionRange() in the textarea
		this._setHasFocus(true);

		// If the editor is off DOM, focus cannot be really set, so let's double check that we have managed to set the focus
		this.refreshFocusState();
	}

	public isFocused(): boolean {
		return this._hasFocus;
	}

	public refreshFocusState(): void {
		this._setHasFocus(this._textArea.hasFocus());
	}

	private _setHasFocus(newHasFocus: boolean): void {
		if (this._hasFocus === newHasFocus) {
			// no change
			return;
		}
		this._hasFocus = newHasFocus;

		if (this._selectionChangeListener) {
			this._selectionChangeListener.dispose();
			this._selectionChangeListener = null;
		}
		if (this._hasFocus) {
			this._selectionChangeListener = this._installSelectionChangeListener();
		}

		if (this._hasFocus) {
			this.writeNativeTextAreaContent('focusgain');
		}

		if (this._hasFocus) {
			this._onFocus.fire();
		} else {
			this._onBlur.fire();
		}
	}

	private _setAndWriteTextAreaState(reason: string, textAreaState: TextAreaState): void {
		if (!this._hasFocus) {
			textAreaState = textAreaState.collapseSelection();
		}
		if (!textAreaState.isWrittenToTextArea(this._textArea, this._hasFocus)) {
			this._logService.trace(`writeTextAreaState(reason: ${reason})`);
		}
		textAreaState.writeToTextArea(reason, this._textArea, this._hasFocus);
		this._textAreaState = textAreaState;
	}

	public writeNativeTextAreaContent(reason: string): void {
		if ((!this._accessibilityService.isScreenReaderOptimized() && reason === 'render') || this._currentComposition) {
			// Do not write to the text on render unless a screen reader is being used #192278
			// Do not write to the text area when doing composition
			return;
		}
		this._setAndWriteTextAreaState(reason, this._host.getScreenReaderContent());
	}
}

export class TextAreaWrapper extends Disposable implements ICompleteTextAreaWrapper {

	public readonly onKeyDown: Event<KeyboardEvent>;
	public readonly onKeyPress: Event<KeyboardEvent>;
	public readonly onKeyUp: Event<KeyboardEvent>;
	public readonly onCompositionStart: Event<CompositionEvent>;
	public readonly onCompositionUpdate: Event<CompositionEvent>;
	public readonly onCompositionEnd: Event<CompositionEvent>;
	public readonly onBeforeInput: Event<InputEvent>;
	public readonly onInput: Event<InputEvent>;
	public readonly onCut: Event<ClipboardEvent>;
	public readonly onCopy: Event<ClipboardEvent>;
	public readonly onPaste: Event<ClipboardEvent>;
	public readonly onFocus: Event<FocusEvent>;
	public readonly onBlur: Event<FocusEvent>; //  = this._register(new DomEmitter(this._actual, 'blur')).event;

	public get ownerDocument(): Document {
		return this._actual.ownerDocument;
	}

	private _onSyntheticTap = this._register(new Emitter<void>());
	public readonly onSyntheticTap: Event<void> = this._onSyntheticTap.event;

	private _ignoreSelectionChangeTime: number;

	constructor(
		private readonly _actual: HTMLTextAreaElement
	) {
		super();
		this._ignoreSelectionChangeTime = 0;
		this.onKeyDown = this._register(new DomEmitter(this._actual, 'keydown')).event;
		this.onKeyPress = this._register(new DomEmitter(this._actual, 'keypress')).event;
		this.onKeyUp = this._register(new DomEmitter(this._actual, 'keyup')).event;
		this.onCompositionStart = this._register(new DomEmitter(this._actual, 'compositionstart')).event;
		this.onCompositionUpdate = this._register(new DomEmitter(this._actual, 'compositionupdate')).event;
		this.onCompositionEnd = this._register(new DomEmitter(this._actual, 'compositionend')).event;
		this.onBeforeInput = this._register(new DomEmitter(this._actual, 'beforeinput')).event;
		this.onInput = <Event<InputEvent>>this._register(new DomEmitter(this._actual, 'input')).event;
		this.onCut = this._register(new DomEmitter(this._actual, 'cut')).event;
		this.onCopy = this._register(new DomEmitter(this._actual, 'copy')).event;
		this.onPaste = this._register(new DomEmitter(this._actual, 'paste')).event;
		this.onFocus = this._register(new DomEmitter(this._actual, 'focus')).event;
		this.onBlur = this._register(new DomEmitter(this._actual, 'blur')).event;

		this._register(this.onKeyDown(() => inputLatency.onKeyDown()));
		this._register(this.onBeforeInput(() => inputLatency.onBeforeInput()));
		this._register(this.onInput(() => inputLatency.onInput()));
		this._register(this.onKeyUp(() => inputLatency.onKeyUp()));
		this._register(dom.addDisposableListener(this._actual, TextAreaSyntethicEvents.Tap, () => this._onSyntheticTap.fire()));
	}

	public hasFocus(): boolean {
		const shadowRoot = dom.getShadowRoot(this._actual);
		if (shadowRoot) {
			return shadowRoot.activeElement === this._actual;
		} else if (this._actual.isConnected) {
			return dom.getActiveElement() === this._actual;
		} else {
			return false;
		}
	}

	public setIgnoreSelectionChangeTime(reason: string): void {
		this._ignoreSelectionChangeTime = Date.now();
	}

	public getIgnoreSelectionChangeTime(): number {
		return this._ignoreSelectionChangeTime;
	}

	public resetSelectionChangeTime(): void {
		this._ignoreSelectionChangeTime = 0;
	}

	public getValue(): string {
		// console.log('current value: ' + this._textArea.value);
		return this._actual.value;
	}

	public setValue(reason: string, value: string): void {
		const textArea = this._actual;
		if (textArea.value === value) {
			// No change
			return;
		}
		// console.log('reason: ' + reason + ', current value: ' + textArea.value + ' => new value: ' + value);
		this.setIgnoreSelectionChangeTime('setValue');
		textArea.value = value;
	}

	public getSelectionStart(): number {
		return this._actual.selectionDirection === 'backward' ? this._actual.selectionEnd : this._actual.selectionStart;
	}

	public getSelectionEnd(): number {
		return this._actual.selectionDirection === 'backward' ? this._actual.selectionStart : this._actual.selectionEnd;
	}

	public setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void {
		const textArea = this._actual;

		let activeElement: Element | null = null;
		const shadowRoot = dom.getShadowRoot(textArea);
		if (shadowRoot) {
			activeElement = shadowRoot.activeElement;
		} else {
			activeElement = dom.getActiveElement();
		}
		const activeWindow = dom.getWindow(activeElement);

		const currentIsFocused = (activeElement === textArea);
		const currentSelectionStart = textArea.selectionStart;
		const currentSelectionEnd = textArea.selectionEnd;

		if (currentIsFocused && currentSelectionStart === selectionStart && currentSelectionEnd === selectionEnd) {
			// No change
			// Firefox iframe bug https://github.com/microsoft/monaco-editor/issues/643#issuecomment-367871377
			if (browser.isFirefox && activeWindow.parent !== activeWindow) {
				textArea.focus();
			}
			return;
		}

		// console.log('reason: ' + reason + ', setSelectionRange: ' + selectionStart + ' -> ' + selectionEnd);

		if (currentIsFocused) {
			// No need to focus, only need to change the selection range
			this.setIgnoreSelectionChangeTime('setSelectionRange');
			textArea.setSelectionRange(selectionStart, selectionEnd);
			if (browser.isFirefox && activeWindow.parent !== activeWindow) {
				textArea.focus();
			}
			return;
		}

		// If the focus is outside the textarea, browsers will try really hard to reveal the textarea.
		// Here, we try to undo the browser's desperate reveal.
		try {
			const scrollState = dom.saveParentsScrollTop(textArea);
			this.setIgnoreSelectionChangeTime('setSelectionRange');
			textArea.focus();
			textArea.setSelectionRange(selectionStart, selectionEnd);
			dom.restoreParentsScrollTop(textArea, scrollState);
		} catch (e) {
			// Sometimes IE throws when setting selection (e.g. textarea is off-DOM)
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextRegistry.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { TextAreaEditContext } from './textAreaEditContext.js';

class TextAreaEditContextRegistryImpl {

	private _textAreaEditContextMapping: Map<string, TextAreaEditContext> = new Map();

	register(ownerID: string, textAreaEditContext: TextAreaEditContext): IDisposable {
		this._textAreaEditContextMapping.set(ownerID, textAreaEditContext);
		return {
			dispose: () => {
				this._textAreaEditContextMapping.delete(ownerID);
			}
		};
	}

	get(ownerID: string): TextAreaEditContext | undefined {
		return this._textAreaEditContextMapping.get(ownerID);
	}
}

export const TextAreaEditContextRegistry = new TextAreaEditContextRegistryImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextState.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/textArea/textAreaEditContextState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commonPrefixLength, commonSuffixLength } from '../../../../../base/common/strings.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { SelectionDirection } from '../../../../common/core/selection.js';
import { ISimpleScreenReaderContentState } from '../screenReaderUtils.js';

export const _debugComposition = false;

export interface ITextAreaWrapper {
	getValue(): string;
	setValue(reason: string, value: string): void;

	getSelectionStart(): number;
	getSelectionEnd(): number;
	setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void;
}

export interface ITypeData {
	text: string;
	replacePrevCharCnt: number;
	replaceNextCharCnt: number;
	positionDelta: number;
}

export class TextAreaState {

	public static readonly EMPTY = new TextAreaState('', 0, 0, null, undefined);

	constructor(
		public readonly value: string,
		/** the offset where selection starts inside `value` */
		public readonly selectionStart: number,
		/** the offset where selection ends inside `value` */
		public readonly selectionEnd: number,
		/** the editor range in the view coordinate system that matches the selection inside `value` */
		public readonly selection: Range | null,
		/** the visible line count (wrapped, not necessarily matching \n characters) for the text in `value` before `selectionStart` */
		public readonly newlineCountBeforeSelection: number | undefined,
	) { }

	public toString(): string {
		return `[ <${this.value}>, selectionStart: ${this.selectionStart}, selectionEnd: ${this.selectionEnd}]`;
	}

	public static readFromTextArea(textArea: ITextAreaWrapper, previousState: TextAreaState | null): TextAreaState {
		const value = textArea.getValue();
		const selectionStart = textArea.getSelectionStart();
		const selectionEnd = textArea.getSelectionEnd();
		let newlineCountBeforeSelection: number | undefined = undefined;
		if (previousState) {
			const valueBeforeSelectionStart = value.substring(0, selectionStart);
			const previousValueBeforeSelectionStart = previousState.value.substring(0, previousState.selectionStart);
			if (valueBeforeSelectionStart === previousValueBeforeSelectionStart) {
				newlineCountBeforeSelection = previousState.newlineCountBeforeSelection;
			}
		}
		return new TextAreaState(value, selectionStart, selectionEnd, null, newlineCountBeforeSelection);
	}

	public collapseSelection(): TextAreaState {
		if (this.selectionStart === this.value.length) {
			return this;
		}
		return new TextAreaState(this.value, this.value.length, this.value.length, null, undefined);
	}

	public isWrittenToTextArea(textArea: ITextAreaWrapper, select: boolean): boolean {
		const valuesEqual = this.value === textArea.getValue();
		if (!select) {
			return valuesEqual;
		}
		const selectionsEqual = this.selectionStart === textArea.getSelectionStart() && this.selectionEnd === textArea.getSelectionEnd();
		return selectionsEqual && valuesEqual;
	}

	public writeToTextArea(reason: string, textArea: ITextAreaWrapper, select: boolean): void {
		if (_debugComposition) {
			console.log(`writeToTextArea ${reason}: ${this.toString()}`);
		}
		textArea.setValue(reason, this.value);
		if (select) {
			textArea.setSelectionRange(reason, this.selectionStart, this.selectionEnd);
		}
	}

	public deduceEditorPosition(offset: number): [Position | null, number, number] {
		if (offset <= this.selectionStart) {
			const str = this.value.substring(offset, this.selectionStart);
			return this._finishDeduceEditorPosition(this.selection?.getStartPosition() ?? null, str, -1);
		}
		if (offset >= this.selectionEnd) {
			const str = this.value.substring(this.selectionEnd, offset);
			return this._finishDeduceEditorPosition(this.selection?.getEndPosition() ?? null, str, 1);
		}
		const str1 = this.value.substring(this.selectionStart, offset);
		if (str1.indexOf(String.fromCharCode(8230)) === -1) {
			return this._finishDeduceEditorPosition(this.selection?.getStartPosition() ?? null, str1, 1);
		}
		const str2 = this.value.substring(offset, this.selectionEnd);
		return this._finishDeduceEditorPosition(this.selection?.getEndPosition() ?? null, str2, -1);
	}

	private _finishDeduceEditorPosition(anchor: Position | null, deltaText: string, signum: number): [Position | null, number, number] {
		let lineFeedCnt = 0;
		let lastLineFeedIndex = -1;
		while ((lastLineFeedIndex = deltaText.indexOf('\n', lastLineFeedIndex + 1)) !== -1) {
			lineFeedCnt++;
		}
		return [anchor, signum * deltaText.length, lineFeedCnt];
	}

	public static deduceInput(previousState: TextAreaState, currentState: TextAreaState, couldBeEmojiInput: boolean): ITypeData {
		if (!previousState) {
			// This is the EMPTY state
			return {
				text: '',
				replacePrevCharCnt: 0,
				replaceNextCharCnt: 0,
				positionDelta: 0
			};
		}

		if (_debugComposition) {
			console.log('------------------------deduceInput');
			console.log(`PREVIOUS STATE: ${previousState.toString()}`);
			console.log(`CURRENT STATE: ${currentState.toString()}`);
		}

		const prefixLength = Math.min(
			commonPrefixLength(previousState.value, currentState.value),
			previousState.selectionStart,
			currentState.selectionStart
		);
		const suffixLength = Math.min(
			commonSuffixLength(previousState.value, currentState.value),
			previousState.value.length - previousState.selectionEnd,
			currentState.value.length - currentState.selectionEnd
		);
		const previousValue = previousState.value.substring(prefixLength, previousState.value.length - suffixLength);
		const currentValue = currentState.value.substring(prefixLength, currentState.value.length - suffixLength);
		const previousSelectionStart = previousState.selectionStart - prefixLength;
		const previousSelectionEnd = previousState.selectionEnd - prefixLength;
		const currentSelectionStart = currentState.selectionStart - prefixLength;
		const currentSelectionEnd = currentState.selectionEnd - prefixLength;

		if (_debugComposition) {
			console.log(`AFTER DIFFING PREVIOUS STATE: <${previousValue}>, selectionStart: ${previousSelectionStart}, selectionEnd: ${previousSelectionEnd}`);
			console.log(`AFTER DIFFING CURRENT STATE: <${currentValue}>, selectionStart: ${currentSelectionStart}, selectionEnd: ${currentSelectionEnd}`);
		}

		if (currentSelectionStart === currentSelectionEnd) {
			// no current selection
			const replacePreviousCharacters = (previousState.selectionStart - prefixLength);
			if (_debugComposition) {
				console.log(`REMOVE PREVIOUS: ${replacePreviousCharacters} chars`);
			}

			return {
				text: currentValue,
				replacePrevCharCnt: replacePreviousCharacters,
				replaceNextCharCnt: 0,
				positionDelta: 0
			};
		}

		// there is a current selection => composition case
		const replacePreviousCharacters = previousSelectionEnd - previousSelectionStart;
		return {
			text: currentValue,
			replacePrevCharCnt: replacePreviousCharacters,
			replaceNextCharCnt: 0,
			positionDelta: 0
		};
	}

	public static deduceAndroidCompositionInput(previousState: TextAreaState, currentState: TextAreaState): ITypeData {
		if (!previousState) {
			// This is the EMPTY state
			return {
				text: '',
				replacePrevCharCnt: 0,
				replaceNextCharCnt: 0,
				positionDelta: 0
			};
		}

		if (_debugComposition) {
			console.log('------------------------deduceAndroidCompositionInput');
			console.log(`PREVIOUS STATE: ${previousState.toString()}`);
			console.log(`CURRENT STATE: ${currentState.toString()}`);
		}

		if (previousState.value === currentState.value) {
			return {
				text: '',
				replacePrevCharCnt: 0,
				replaceNextCharCnt: 0,
				positionDelta: currentState.selectionEnd - previousState.selectionEnd
			};
		}

		const prefixLength = Math.min(commonPrefixLength(previousState.value, currentState.value), previousState.selectionEnd);
		const suffixLength = Math.min(commonSuffixLength(previousState.value, currentState.value), previousState.value.length - previousState.selectionEnd);
		const previousValue = previousState.value.substring(prefixLength, previousState.value.length - suffixLength);
		const currentValue = currentState.value.substring(prefixLength, currentState.value.length - suffixLength);
		const previousSelectionStart = previousState.selectionStart - prefixLength;
		const previousSelectionEnd = previousState.selectionEnd - prefixLength;
		const currentSelectionStart = currentState.selectionStart - prefixLength;
		const currentSelectionEnd = currentState.selectionEnd - prefixLength;

		if (_debugComposition) {
			console.log(`AFTER DIFFING PREVIOUS STATE: <${previousValue}>, selectionStart: ${previousSelectionStart}, selectionEnd: ${previousSelectionEnd}`);
			console.log(`AFTER DIFFING CURRENT STATE: <${currentValue}>, selectionStart: ${currentSelectionStart}, selectionEnd: ${currentSelectionEnd}`);
		}

		return {
			text: currentValue,
			replacePrevCharCnt: previousSelectionEnd,
			replaceNextCharCnt: previousValue.length - previousSelectionEnd,
			positionDelta: currentSelectionEnd - currentValue.length
		};
	}

	public static fromScreenReaderContentState(screenReaderContentState: ISimpleScreenReaderContentState) {
		let selectionStart;
		let selectionEnd;
		const direction = screenReaderContentState.selection.getDirection();
		switch (direction) {
			case SelectionDirection.LTR:
				selectionStart = screenReaderContentState.selectionStart;
				selectionEnd = screenReaderContentState.selectionEnd;
				break;
			case SelectionDirection.RTL:
				selectionStart = screenReaderContentState.selectionEnd;
				selectionEnd = screenReaderContentState.selectionStart;
				break;
		}
		return new TextAreaState(
			screenReaderContentState.value,
			selectionStart,
			selectionEnd,
			screenReaderContentState.selection,
			screenReaderContentState.newlineCountBeforeSelection
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/bufferDirtyTracker.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/bufferDirtyTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IBufferDirtyTrackerReader {
	/**
	 * The index of the first dirty index.
	 */
	readonly dataOffset: number | undefined;
	/**
	 * The index of the last dirty index (inclusive).
	 */
	readonly dirtySize: number | undefined;
	/**
	 * Whether the buffer is dirty.
	 */
	readonly isDirty: boolean;
	/**
	 * Clear the dirty state.
	 */
	clear(): void;
}

/**
 * A simple tracker for dirty regions in a buffer.
 */
export class BufferDirtyTracker implements IBufferDirtyTrackerReader {

	private _startIndex: number | undefined;
	private _endIndex: number | undefined;

	get dataOffset(): number | undefined {
		return this._startIndex;
	}

	get dirtySize(): number | undefined {
		if (this._startIndex === undefined || this._endIndex === undefined) {
			return undefined;
		}
		return this._endIndex - this._startIndex + 1;
	}

	get isDirty(): boolean { return this._startIndex !== undefined; }

	/**
	 * Flag the index(es) as modified. Returns the index flagged.
	 * @param index An index to flag.
	 * @param length An optional length to flag. Defaults to 1.
	 */
	flag(index: number, length: number = 1): number {
		this._flag(index);
		if (length > 1) {
			this._flag(index + length - 1);
		}
		return index;
	}

	private _flag(index: number) {
		if (this._startIndex === undefined || index < this._startIndex) {
			this._startIndex = index;
		}
		if (this._endIndex === undefined || index > this._endIndex) {
			this._endIndex = index;
		}
	}

	clear() {
		this._startIndex = undefined;
		this._endIndex = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/contentSegmenter.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/contentSegmenter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeIntl } from '../../../base/common/date.js';
import type { GraphemeIterator } from '../../../base/common/strings.js';
import type { ViewLineRenderingData } from '../../common/viewModel.js';
import type { ViewLineOptions } from '../viewParts/viewLines/viewLineOptions.js';

export interface IContentSegmenter {
	/**
	 * Gets the content segment at an index within the line data's contents. This will be undefined
	 * when the index should not be rendered, ie. when it's part of an earlier segment like the tail
	 * end of an emoji, or when the line is not that long.
	 * @param index The index within the line data's content string.
	 */
	getSegmentAtIndex(index: number): string | undefined;
	getSegmentData(index: number): Intl.SegmentData | undefined;
}

export function createContentSegmenter(lineData: ViewLineRenderingData, options: ViewLineOptions): IContentSegmenter {
	if (lineData.isBasicASCII && options.useMonospaceOptimizations) {
		return new AsciiContentSegmenter(lineData);
	}
	return new GraphemeContentSegmenter(lineData);
}

class AsciiContentSegmenter implements IContentSegmenter {
	private readonly _content: string;

	constructor(lineData: ViewLineRenderingData) {
		this._content = lineData.content;
	}

	getSegmentAtIndex(index: number): string {
		return this._content[index];
	}

	getSegmentData(index: number): Intl.SegmentData | undefined {
		return undefined;
	}
}

/**
 * This is a more modern version of {@link GraphemeIterator}, relying on browser APIs instead of a
 * manual table approach.
 */
class GraphemeContentSegmenter implements IContentSegmenter {
	private readonly _segments: (Intl.SegmentData | undefined)[] = [];

	constructor(lineData: ViewLineRenderingData) {
		const content = lineData.content;
		const segmenter = safeIntl.Segmenter(undefined, { granularity: 'grapheme' }).value;
		const segmentedContent = Array.from(segmenter.segment(content));
		let segmenterIndex = 0;

		for (let x = 0; x < content.length; x++) {
			const segment = segmentedContent[segmenterIndex];

			// No more segments in the string (eg. an emoji is the last segment)
			if (!segment) {
				break;
			}

			// The segment isn't renderable (eg. the tail end of an emoji)
			if (segment.index !== x) {
				this._segments.push(undefined);
				continue;
			}

			segmenterIndex++;
			this._segments.push(segment);
		}
	}

	getSegmentAtIndex(index: number): string | undefined {
		return this._segments[index]?.segment;
	}

	getSegmentData(index: number): Intl.SegmentData | undefined {
		return this._segments[index];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/gpu.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/gpu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IDisposable } from '../../../base/common/lifecycle.js';
import type { ViewConfigurationChangedEvent, ViewLinesChangedEvent, ViewLinesDeletedEvent, ViewLinesInsertedEvent, ViewScrollChangedEvent, ViewTokensChangedEvent } from '../../common/viewEvents.js';
import type { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import type { ViewLineOptions } from '../viewParts/viewLines/viewLineOptions.js';
import type { IGlyphRasterizer } from './raster/raster.js';

export const enum BindingId {
	GlyphInfo,
	Cells,
	TextureSampler,
	Texture,
	LayoutInfoUniform,
	AtlasDimensionsUniform,
	ScrollOffset,
}

export interface IGpuRenderStrategy extends IDisposable {
	readonly type: string;
	readonly wgsl: string;
	readonly bindGroupEntries: GPUBindGroupEntry[];
	readonly glyphRasterizer: IGlyphRasterizer;

	onLinesDeleted(e: ViewLinesDeletedEvent): boolean;
	onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean;
	onTokensChanged(e: ViewTokensChangedEvent): boolean;
	onLinesInserted(e: ViewLinesInsertedEvent): boolean;
	onLinesChanged(e: ViewLinesChangedEvent): boolean;
	onScrollChanged(e?: ViewScrollChangedEvent): boolean;

	/**
	 * Resets the render strategy, clearing all data and setting up for a new frame.
	 */
	reset(): void;
	update(viewportData: ViewportData, viewLineOptions: ViewLineOptions): number;
	draw(pass: GPURenderPassEncoder, viewportData: ViewportData): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/gpuDisposable.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/gpuDisposable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IReference } from '../../../base/common/lifecycle.js';
import { isFunction } from '../../../base/common/types.js';

export namespace GPULifecycle {
	export async function requestDevice(fallback?: (message: string) => void): Promise<IReference<GPUDevice>> {
		try {
			if (!navigator.gpu) {
				throw new Error('This browser does not support WebGPU');
			}
			const adapter = (await navigator.gpu.requestAdapter())!;
			if (!adapter) {
				throw new Error('This browser supports WebGPU but it appears to be disabled');
			}
			return wrapDestroyableInDisposable(await adapter.requestDevice());
		} catch (e) {
			if (fallback) {
				fallback(e.message);
			}
			throw e;
		}
	}

	export function createBuffer(device: GPUDevice, descriptor: GPUBufferDescriptor, initialValues?: Float32Array | (() => Float32Array)): IReference<GPUBuffer> {
		const buffer = device.createBuffer(descriptor);
		if (initialValues) {
			device.queue.writeBuffer(buffer, 0, (isFunction(initialValues) ? initialValues() : initialValues) as Float32Array<ArrayBuffer>);
		}
		return wrapDestroyableInDisposable(buffer);
	}

	export function createTexture(device: GPUDevice, descriptor: GPUTextureDescriptor): IReference<GPUTexture> {
		return wrapDestroyableInDisposable(device.createTexture(descriptor));
	}
}

function wrapDestroyableInDisposable<T extends { destroy(): void }>(value: T): IReference<T> {
	return {
		object: value,
		dispose: () => value.destroy()
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/gpuUtils.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/gpuUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../base/common/errors.js';
import { toDisposable, type IDisposable } from '../../../base/common/lifecycle.js';

export const quadVertices = new Float32Array([
	1, 0,
	1, 1,
	0, 1,
	0, 0,
	0, 1,
	1, 0,
]);

export function ensureNonNullable<T>(value: T | null): T {
	if (!value) {
		throw new Error(`Value "${value}" cannot be null`);
	}
	return value;
}

// TODO: Move capabilities into ElementSizeObserver?
export function observeDevicePixelDimensions(element: HTMLElement, parentWindow: Window & typeof globalThis, callback: (deviceWidth: number, deviceHeight: number) => void): IDisposable {
	// Observe any resizes to the element and extract the actual pixel size of the element if the
	// devicePixelContentBoxSize API is supported. This allows correcting rounding errors when
	// converting between CSS pixels and device pixels which causes blurry rendering when device
	// pixel ratio is not a round number.
	let observer: ResizeObserver | undefined = new parentWindow.ResizeObserver((entries) => {
		const entry = entries.find((entry) => entry.target === element);
		if (!entry) {
			return;
		}

		// Disconnect if devicePixelContentBoxSize isn't supported by the browser
		if (!('devicePixelContentBoxSize' in entry)) {
			observer?.disconnect();
			observer = undefined;
			return;
		}

		// Fire the callback, ignore events where the dimensions are 0x0 as the canvas is likely hidden
		const width = entry.devicePixelContentBoxSize[0].inlineSize;
		const height = entry.devicePixelContentBoxSize[0].blockSize;
		if (width > 0 && height > 0) {
			callback(width, height);
		}
	});
	try {
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		observer.observe(element, { box: ['device-pixel-content-box'] } as any);
	} catch {
		observer.disconnect();
		observer = undefined;
		throw new BugIndicatingError('Could not observe device pixel dimensions');
	}
	return toDisposable(() => observer?.disconnect());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/objectCollectionBuffer.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/objectCollectionBuffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, dispose, toDisposable, type IDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { BufferDirtyTracker, type IBufferDirtyTrackerReader } from './bufferDirtyTracker.js';

export interface ObjectCollectionBufferPropertySpec {
	name: string;
}

export type ObjectCollectionPropertyValues<T extends ObjectCollectionBufferPropertySpec[]> = {
	[K in T[number]['name']]: number;
};

export interface IObjectCollectionBuffer<T extends ObjectCollectionBufferPropertySpec[]> extends IDisposable {
	/**
	 * The underlying buffer. This **should not** be modified externally.
	 */
	readonly buffer: ArrayBufferLike;
	/**
	 * A view of the underlying buffer. This **should not** be modified externally.
	 */
	readonly view: Float32Array;
	/**
	 * The size of the used portion of the buffer (in bytes).
	 */
	readonly bufferUsedSize: number;
	/**
	 * The size of the used portion of the view (in float32s).
	 */
	readonly viewUsedSize: number;
	/**
	 * The number of entries in the buffer.
	 */
	readonly entryCount: number;

	/**
	 * A tracker for dirty regions in the buffer.
	 */
	readonly dirtyTracker: IBufferDirtyTrackerReader;

	/**
	 * Fires when the buffer is modified.
	 */
	readonly onDidChange: Event<void>;

	/**
	 * Fires when the buffer is recreated.
	 */
	readonly onDidChangeBuffer: Event<void>;

	/**
	 * Creates an entry in the collection. This will return a managed object that can be modified
	 * which will update the underlying buffer.
	 * @param data The data of the entry.
	 */
	createEntry(data: ObjectCollectionPropertyValues<T>): IObjectCollectionBufferEntry<T>;
}

/**
 * An entry in an {@link ObjectCollectionBuffer}. Property values on the entry can be changed and
 * their values will be updated automatically in the buffer.
 */
export interface IObjectCollectionBufferEntry<T extends ObjectCollectionBufferPropertySpec[]> extends IDisposable {
	set(propertyName: T[number]['name'], value: number): void;
	get(propertyName: T[number]['name']): number;
	setRaw(data: ArrayLike<number>): void;
}

export function createObjectCollectionBuffer<T extends ObjectCollectionBufferPropertySpec[]>(
	propertySpecs: T,
	capacity: number
): IObjectCollectionBuffer<T> {
	return new ObjectCollectionBuffer<T>(propertySpecs, capacity);
}

class ObjectCollectionBuffer<T extends ObjectCollectionBufferPropertySpec[]> extends Disposable implements IObjectCollectionBuffer<T> {
	buffer: ArrayBufferLike;
	view: Float32Array;

	get bufferUsedSize() {
		return this.viewUsedSize * Float32Array.BYTES_PER_ELEMENT;
	}
	get viewUsedSize() {
		return this._entries.size * this._entrySize;
	}
	get entryCount() {
		return this._entries.size;
	}

	private _dirtyTracker = new BufferDirtyTracker();
	get dirtyTracker(): IBufferDirtyTrackerReader { return this._dirtyTracker; }

	private readonly _propertySpecsMap: Map<string, ObjectCollectionBufferPropertySpec & { offset: number }> = new Map();
	private readonly _entrySize: number;
	private readonly _entries: LinkedList<ObjectCollectionBufferEntry<T>> = new LinkedList();

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;
	private readonly _onDidChangeBuffer = this._register(new Emitter<void>());
	readonly onDidChangeBuffer = this._onDidChangeBuffer.event;

	constructor(
		public propertySpecs: T,
		public capacity: number
	) {
		super();

		this.view = new Float32Array(capacity * propertySpecs.length);
		this.buffer = this.view.buffer;
		this._entrySize = propertySpecs.length;
		for (let i = 0; i < propertySpecs.length; i++) {
			const spec = {
				offset: i,
				...propertySpecs[i]
			};
			this._propertySpecsMap.set(spec.name, spec);
		}
		this._register(toDisposable(() => dispose(this._entries)));
	}

	createEntry(data: ObjectCollectionPropertyValues<T>): IObjectCollectionBufferEntry<T> {
		if (this._entries.size === this.capacity) {
			this._expandBuffer();
			this._onDidChangeBuffer.fire();
		}

		const value = new ObjectCollectionBufferEntry(this.view, this._propertySpecsMap, this._dirtyTracker, this._entries.size, data);
		const removeFromEntries = this._entries.push(value);
		const listeners: IDisposable[] = [];
		listeners.push(Event.forward(value.onDidChange, this._onDidChange));
		listeners.push(value.onWillDispose(() => {
			const deletedEntryIndex = value.i;
			removeFromEntries();

			// Shift all entries after the deleted entry to the left
			this.view.set(this.view.subarray(deletedEntryIndex * this._entrySize + 2, this._entries.size * this._entrySize + 2), deletedEntryIndex * this._entrySize);

			// Update entries to reflect the new i
			for (const entry of this._entries) {
				if (entry.i > deletedEntryIndex) {
					entry.i--;
				}
			}
			this._dirtyTracker.flag(deletedEntryIndex, (this._entries.size - deletedEntryIndex) * this._entrySize);
			dispose(listeners);
		}));
		return value;
	}

	private _expandBuffer() {
		this.capacity *= 2;
		const newView = new Float32Array(this.capacity * this._entrySize);
		newView.set(this.view);
		this.view = newView;
		this.buffer = this.view.buffer;
	}
}

class ObjectCollectionBufferEntry<T extends ObjectCollectionBufferPropertySpec[]> extends Disposable implements IObjectCollectionBufferEntry<T> {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;
	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	constructor(
		private _view: Float32Array,
		private _propertySpecsMap: Map<string, ObjectCollectionBufferPropertySpec & { offset: number }>,
		private _dirtyTracker: BufferDirtyTracker,
		public i: number,
		data: ObjectCollectionPropertyValues<T>,
	) {
		super();
		for (const propertySpec of this._propertySpecsMap.values()) {
			this._view[this.i * this._propertySpecsMap.size + propertySpec.offset] = data[propertySpec.name as keyof typeof data];
		}
		this._dirtyTracker.flag(this.i * this._propertySpecsMap.size, this._propertySpecsMap.size);
	}

	override dispose() {
		this._onWillDispose.fire();
		super.dispose();
	}

	set(propertyName: T[number]['name'], value: number): void {
		const i = this.i * this._propertySpecsMap.size + this._propertySpecsMap.get(propertyName)!.offset;
		this._view[this._dirtyTracker.flag(i)] = value;
		this._onDidChange.fire();
	}

	get(propertyName: T[number]['name']): number {
		return this._view[this.i * this._propertySpecsMap.size + this._propertySpecsMap.get(propertyName)!.offset];
	}

	setRaw(data: ArrayLike<number>): void {
		if (data.length !== this._propertySpecsMap.size) {
			throw new Error(`Data length ${data.length} does not match the number of properties in the collection (${this._propertySpecsMap.size})`);
		}
		this._view.set(data, this.i * this._propertySpecsMap.size);
		this._dirtyTracker.flag(this.i * this._propertySpecsMap.size, this._propertySpecsMap.size);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/rectangleRenderer.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/rectangleRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../base/browser/dom.js';
import { Event } from '../../../base/common/event.js';
import { IReference, MutableDisposable } from '../../../base/common/lifecycle.js';
import type { IObservable } from '../../../base/common/observable.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import { ViewEventHandler } from '../../common/viewEventHandler.js';
import type { ViewScrollChangedEvent } from '../../common/viewEvents.js';
import type { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import type { ViewContext } from '../../common/viewModel/viewContext.js';
import { GPULifecycle } from './gpuDisposable.js';
import { observeDevicePixelDimensions, quadVertices } from './gpuUtils.js';
import { createObjectCollectionBuffer, type IObjectCollectionBuffer, type IObjectCollectionBufferEntry } from './objectCollectionBuffer.js';
import { RectangleRendererBindingId, rectangleRendererWgsl } from './rectangleRenderer.wgsl.js';

export type RectangleRendererEntrySpec = [
	{ name: 'x' },
	{ name: 'y' },
	{ name: 'width' },
	{ name: 'height' },
	{ name: 'red' },
	{ name: 'green' },
	{ name: 'blue' },
	{ name: 'alpha' },
];

export class RectangleRenderer extends ViewEventHandler {

	private _device!: GPUDevice;
	private _renderPassDescriptor!: GPURenderPassDescriptor;
	private _renderPassColorAttachment!: GPURenderPassColorAttachment;
	private _bindGroup!: GPUBindGroup;
	private _pipeline!: GPURenderPipeline;

	private _vertexBuffer!: GPUBuffer;
	private readonly _shapeBindBuffer: MutableDisposable<IReference<GPUBuffer>> = this._register(new MutableDisposable());

	private _scrollOffsetBindBuffer!: GPUBuffer;
	private _scrollOffsetValueBuffer!: Float32Array;

	private _initialized: boolean = false;

	private readonly _shapeCollection: IObjectCollectionBuffer<RectangleRendererEntrySpec> = this._register(createObjectCollectionBuffer([
		{ name: 'x' },
		{ name: 'y' },
		{ name: 'width' },
		{ name: 'height' },
		{ name: 'red' },
		{ name: 'green' },
		{ name: 'blue' },
		{ name: 'alpha' },
	], 32));

	constructor(
		private readonly _context: ViewContext,
		private readonly _contentLeft: IObservable<number>,
		private readonly _devicePixelRatio: IObservable<number>,
		private readonly _canvas: HTMLCanvasElement,
		private readonly _ctx: GPUCanvasContext,
		device: Promise<GPUDevice>,
	) {
		super();

		this._context.addEventHandler(this);

		this._initWebgpu(device);
	}

	private async _initWebgpu(device: Promise<GPUDevice>) {

		// #region General

		this._device = await device;

		if (this._store.isDisposed) {
			return;
		}

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		this._ctx.configure({
			device: this._device,
			format: presentationFormat,
			alphaMode: 'premultiplied',
		});

		this._renderPassColorAttachment = {
			view: null!, // Will be filled at render time
			loadOp: 'load',
			storeOp: 'store',
		};
		this._renderPassDescriptor = {
			label: 'Monaco rectangle renderer render pass',
			colorAttachments: [this._renderPassColorAttachment],
		};

		// #endregion General

		// #region Uniforms

		let layoutInfoUniformBuffer: GPUBuffer;
		{
			const enum Info {
				FloatsPerEntry = 6,
				BytesPerEntry = Info.FloatsPerEntry * 4,
				Offset_CanvasWidth____ = 0,
				Offset_CanvasHeight___ = 1,
				Offset_ViewportOffsetX = 2,
				Offset_ViewportOffsetY = 3,
				Offset_ViewportWidth__ = 4,
				Offset_ViewportHeight_ = 5,
			}
			const bufferValues = new Float32Array(Info.FloatsPerEntry);
			const updateBufferValues = (canvasDevicePixelWidth: number = this._canvas.width, canvasDevicePixelHeight: number = this._canvas.height) => {
				bufferValues[Info.Offset_CanvasWidth____] = canvasDevicePixelWidth;
				bufferValues[Info.Offset_CanvasHeight___] = canvasDevicePixelHeight;
				bufferValues[Info.Offset_ViewportOffsetX] = Math.ceil(this._context.configuration.options.get(EditorOption.layoutInfo).contentLeft * getActiveWindow().devicePixelRatio);
				bufferValues[Info.Offset_ViewportOffsetY] = 0;
				bufferValues[Info.Offset_ViewportWidth__] = bufferValues[Info.Offset_CanvasWidth____] - bufferValues[Info.Offset_ViewportOffsetX];
				bufferValues[Info.Offset_ViewportHeight_] = bufferValues[Info.Offset_CanvasHeight___] - bufferValues[Info.Offset_ViewportOffsetY];
				return bufferValues;
			};
			layoutInfoUniformBuffer = this._register(GPULifecycle.createBuffer(this._device, {
				label: 'Monaco rectangle renderer uniform buffer',
				size: Info.BytesPerEntry,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			}, () => updateBufferValues())).object;
			this._register(observeDevicePixelDimensions(this._canvas, getActiveWindow(), (w, h) => {
				this._device.queue.writeBuffer(layoutInfoUniformBuffer, 0, updateBufferValues(w, h));
			}));
		}

		const scrollOffsetBufferSize = 2;
		this._scrollOffsetBindBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco rectangle renderer scroll offset buffer',
			size: scrollOffsetBufferSize * Float32Array.BYTES_PER_ELEMENT,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		})).object;
		this._scrollOffsetValueBuffer = new Float32Array(scrollOffsetBufferSize);

		// #endregion Uniforms

		// #region Storage buffers

		const createShapeBindBuffer = () => {
			return GPULifecycle.createBuffer(this._device, {
				label: 'Monaco rectangle renderer shape buffer',
				size: this._shapeCollection.buffer.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			});
		};
		this._shapeBindBuffer.value = createShapeBindBuffer();
		this._register(Event.runAndSubscribe(this._shapeCollection.onDidChangeBuffer, () => {
			this._shapeBindBuffer.value = createShapeBindBuffer();
			if (this._pipeline) {
				this._updateBindGroup(this._pipeline, layoutInfoUniformBuffer);
			}
		}));

		// #endregion Storage buffers

		// #region Vertex buffer

		this._vertexBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco rectangle renderer vertex buffer',
			size: quadVertices.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		}, quadVertices)).object;

		// #endregion Vertex buffer

		// #region Shader module

		const module = this._device.createShaderModule({
			label: 'Monaco rectangle renderer shader module',
			code: rectangleRendererWgsl,
		});

		// #endregion Shader module

		// #region Pipeline

		this._pipeline = this._device.createRenderPipeline({
			label: 'Monaco rectangle renderer render pipeline',
			layout: 'auto',
			vertex: {
				module,
				buffers: [
					{
						arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT, // 2 floats, 4 bytes each
						attributes: [
							{ shaderLocation: 0, offset: 0, format: 'float32x2' },  // position
						],
					}
				]
			},
			fragment: {
				module,
				targets: [
					{
						format: presentationFormat,
						blend: {
							color: {
								srcFactor: 'src-alpha',
								dstFactor: 'one-minus-src-alpha'
							},
							alpha: {
								srcFactor: 'src-alpha',
								dstFactor: 'one-minus-src-alpha'
							},
						},
					}
				],
			},
		});

		// #endregion Pipeline

		// #region Bind group

		this._updateBindGroup(this._pipeline, layoutInfoUniformBuffer);

		// endregion Bind group

		this._initialized = true;
	}

	private _updateBindGroup(pipeline: GPURenderPipeline, layoutInfoUniformBuffer: GPUBuffer) {
		this._bindGroup = this._device.createBindGroup({
			label: 'Monaco rectangle renderer bind group',
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: RectangleRendererBindingId.Shapes, resource: { buffer: this._shapeBindBuffer.value!.object } },
				{ binding: RectangleRendererBindingId.LayoutInfoUniform, resource: { buffer: layoutInfoUniformBuffer } },
				{ binding: RectangleRendererBindingId.ScrollOffset, resource: { buffer: this._scrollOffsetBindBuffer } },
			],
		});
	}

	register(x: number, y: number, width: number, height: number, red: number, green: number, blue: number, alpha: number): IObjectCollectionBufferEntry<RectangleRendererEntrySpec> {
		return this._shapeCollection.createEntry({ x, y, width, height, red, green, blue, alpha });
	}

	// #region Event handlers

	public override onScrollChanged(e: ViewScrollChangedEvent): boolean {
		if (this._device) {
			const dpr = getActiveWindow().devicePixelRatio;
			this._scrollOffsetValueBuffer[0] = this._context.viewLayout.getCurrentScrollLeft() * dpr;
			this._scrollOffsetValueBuffer[1] = this._context.viewLayout.getCurrentScrollTop() * dpr;
			this._device.queue.writeBuffer(this._scrollOffsetBindBuffer, 0, this._scrollOffsetValueBuffer as Float32Array<ArrayBuffer>);
		}
		return true;
	}

	// #endregion

	private _update() {
		if (!this._device) {
			return;
		}
		const shapes = this._shapeCollection;
		if (shapes.dirtyTracker.isDirty) {
			this._device.queue.writeBuffer(this._shapeBindBuffer.value!.object, 0, shapes.buffer, shapes.dirtyTracker.dataOffset, shapes.dirtyTracker.dirtySize! * shapes.view.BYTES_PER_ELEMENT);
			shapes.dirtyTracker.clear();
		}
	}

	draw(viewportData: ViewportData) {
		if (!this._initialized) {
			return;
		}

		this._update();

		const encoder = this._device.createCommandEncoder({ label: 'Monaco rectangle renderer command encoder' });

		this._renderPassColorAttachment.view = this._ctx.getCurrentTexture().createView();
		const pass = encoder.beginRenderPass(this._renderPassDescriptor);
		pass.setPipeline(this._pipeline);
		pass.setVertexBuffer(0, this._vertexBuffer);
		pass.setBindGroup(0, this._bindGroup);

		// Only draw the content area
		const contentLeft = Math.ceil(this._contentLeft.get() * this._devicePixelRatio.get());
		pass.setScissorRect(contentLeft, 0, this._canvas.width - contentLeft, this._canvas.height);

		pass.draw(quadVertices.length / 2, this._shapeCollection.entryCount);
		pass.end();

		const commandBuffer = encoder.finish();
		this._device.queue.submit([commandBuffer]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/rectangleRenderer.wgsl.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/rectangleRenderer.wgsl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum RectangleRendererBindingId {
	Shapes,
	LayoutInfoUniform,
	ScrollOffset,
}

export const rectangleRendererWgsl = /*wgsl*/ `

struct Vertex {
	@location(0) position: vec2f,
};

struct LayoutInfo {
	canvasDims: vec2f,
	viewportOffset: vec2f,
	viewportDims: vec2f,
}

struct ScrollOffset {
	offset: vec2f,
}

struct Shape {
	position: vec2f,
	size: vec2f,
	color: vec4f,
};

struct VSOutput {
	@builtin(position) position: vec4f,
	@location(1)       color:    vec4f,
};

// Uniforms
@group(0) @binding(${RectangleRendererBindingId.LayoutInfoUniform}) var<uniform>       layoutInfo:      LayoutInfo;

// Storage buffers
@group(0) @binding(${RectangleRendererBindingId.Shapes})            var<storage, read> shapes:          array<Shape>;
@group(0) @binding(${RectangleRendererBindingId.ScrollOffset})      var<uniform>       scrollOffset:    ScrollOffset;

@vertex fn vs(
	vert: Vertex,
	@builtin(instance_index) instanceIndex: u32,
	@builtin(vertex_index) vertexIndex : u32
) -> VSOutput {
	let shape = shapes[instanceIndex];

	var vsOut: VSOutput;
	vsOut.position = vec4f(
		(
			// Top left corner
			vec2f(-1,  1) +
			// Convert pixel position to clipspace
			vec2f( 2, -2) / layoutInfo.canvasDims *
			// Shape position and size
			(layoutInfo.viewportOffset - scrollOffset.offset + shape.position + vert.position * shape.size)
		),
		0.0,
		1.0
	);
	vsOut.color = shape.color;
	return vsOut;
}

@fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
	return vsOut.color;
}
`;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/taskQueue.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/taskQueue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../base/browser/dom.js';
import { Disposable, toDisposable, type IDisposable } from '../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';

/**
 * Copyright (c) 2022 The xterm.js authors. All rights reserved.
 * @license MIT
 */

export interface ITaskQueue extends IDisposable {
	/**
	 * Adds a task to the queue which will run in a future idle callback.
	 * To avoid perceivable stalls on the mainthread, tasks with heavy workload
	 * should split their work into smaller pieces and return `true` to get
	 * called again until the work is done (on falsy return value).
	 */
	enqueue(task: () => boolean | void): void;

	/**
	 * Flushes the queue, running all remaining tasks synchronously.
	 */
	flush(): void;

	/**
	 * Clears any remaining tasks from the queue, these will not be run.
	 */
	clear(): void;
}

interface ITaskDeadline {
	timeRemaining(): number;
}
type CallbackWithDeadline = (deadline: ITaskDeadline) => void;

abstract class TaskQueue extends Disposable implements ITaskQueue {
	private _tasks: (() => boolean | void)[] = [];
	private _idleCallback?: number;
	private _i = 0;

	constructor(
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._register(toDisposable(() => this.clear()));
	}

	protected abstract _requestCallback(callback: CallbackWithDeadline): number;
	protected abstract _cancelCallback(identifier: number): void;

	public enqueue(task: () => boolean | void): void {
		this._tasks.push(task);
		this._start();
	}

	public flush(): void {
		while (this._i < this._tasks.length) {
			if (!this._tasks[this._i]()) {
				this._i++;
			}
		}
		this.clear();
	}

	public clear(): void {
		if (this._idleCallback) {
			this._cancelCallback(this._idleCallback);
			this._idleCallback = undefined;
		}
		this._i = 0;
		this._tasks.length = 0;
	}

	private _start(): void {
		if (!this._idleCallback) {
			this._idleCallback = this._requestCallback(this._process.bind(this));
		}
	}

	private _process(deadline: ITaskDeadline): void {
		this._idleCallback = undefined;
		let taskDuration = 0;
		let longestTask = 0;
		let lastDeadlineRemaining = deadline.timeRemaining();
		let deadlineRemaining = 0;
		while (this._i < this._tasks.length) {
			taskDuration = Date.now();
			if (!this._tasks[this._i]()) {
				this._i++;
			}
			// other than performance.now, Date.now might not be stable (changes on wall clock changes),
			// this is not an issue here as a clock change during a short running task is very unlikely
			// in case it still happened and leads to negative duration, simply assume 1 msec
			taskDuration = Math.max(1, Date.now() - taskDuration);
			longestTask = Math.max(taskDuration, longestTask);
			// Guess the following task will take a similar time to the longest task in this batch, allow
			// additional room to try avoid exceeding the deadline
			deadlineRemaining = deadline.timeRemaining();
			if (longestTask * 1.5 > deadlineRemaining) {
				// Warn when the time exceeding the deadline is over 20ms, if this happens in practice the
				// task should be split into sub-tasks to ensure the UI remains responsive.
				if (lastDeadlineRemaining - taskDuration < -20) {
					this._logService.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(lastDeadlineRemaining - taskDuration))}ms`);
				}
				this._start();
				return;
			}
			lastDeadlineRemaining = deadlineRemaining;
		}
		this.clear();
	}
}

/**
 * A queue of that runs tasks over several tasks via setTimeout, trying to maintain above 60 frames
 * per second. The tasks will run in the order they are enqueued, but they will run some time later,
 * and care should be taken to ensure they're non-urgent and will not introduce race conditions.
 */
export class PriorityTaskQueue extends TaskQueue {
	protected _requestCallback(callback: CallbackWithDeadline): number {
		return getActiveWindow().setTimeout(() => callback(this._createDeadline(16)));
	}

	protected _cancelCallback(identifier: number): void {
		getActiveWindow().clearTimeout(identifier);
	}

	private _createDeadline(duration: number): ITaskDeadline {
		const end = Date.now() + duration;
		return {
			timeRemaining: () => Math.max(0, end - Date.now())
		};
	}
}

class IdleTaskQueueInternal extends TaskQueue {
	protected _requestCallback(callback: IdleRequestCallback): number {
		return getActiveWindow().requestIdleCallback(callback);
	}

	protected _cancelCallback(identifier: number): void {
		getActiveWindow().cancelIdleCallback(identifier);
	}
}

/**
 * A queue of that runs tasks over several idle callbacks, trying to respect the idle callback's
 * deadline given by the environment. The tasks will run in the order they are enqueued, but they
 * will run some time later, and care should be taken to ensure they're non-urgent and will not
 * introduce race conditions.
 *
 * This reverts to a {@link PriorityTaskQueue} if the environment does not support idle callbacks.
 */
export const IdleTaskQueue = ('requestIdleCallback' in getActiveWindow()) ? IdleTaskQueueInternal : PriorityTaskQueue;

/**
 * An object that tracks a single debounced task that will run on the next idle frame. When called
 * multiple times, only the last set task will run.
 */
export class DebouncedIdleTask {
	private _queue: ITaskQueue;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		this._queue = instantiationService.createInstance(IdleTaskQueue);
	}

	public set(task: () => boolean | void): void {
		this._queue.clear();
		this._queue.enqueue(task);
	}

	public flush(): void {
		this._queue.flush();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/viewGpuContext.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/viewGpuContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { addDisposableListener, getActiveWindow } from '../../../base/browser/dom.js';
import { createFastDomNode, type FastDomNode } from '../../../base/browser/fastDomNode.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import type { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import type { ViewLineOptions } from '../viewParts/viewLines/viewLineOptions.js';
import { observableValue, runOnChange, type IObservable } from '../../../base/common/observable.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { TextureAtlas } from './atlas/textureAtlas.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { INotificationService, IPromptChoice, Severity } from '../../../platform/notification/common/notification.js';
import { GPULifecycle } from './gpuDisposable.js';
import { ensureNonNullable, observeDevicePixelDimensions } from './gpuUtils.js';
import { RectangleRenderer } from './rectangleRenderer.js';
import type { ViewContext } from '../../common/viewModel/viewContext.js';
import { DecorationCssRuleExtractor } from './css/decorationCssRuleExtractor.js';
import { Event } from '../../../base/common/event.js';
import { EditorOption, type IEditorOptions } from '../../common/config/editorOptions.js';
import { DecorationStyleCache } from './css/decorationStyleCache.js';
import { InlineDecorationType } from '../../common/viewModel/inlineDecorations.js';

export class ViewGpuContext extends Disposable {
	/**
	 * The hard cap for line columns rendered by the GPU renderer.
	 */
	readonly maxGpuCols = 2000;

	readonly canvas: FastDomNode<HTMLCanvasElement>;
	readonly ctx: GPUCanvasContext;

	static device: Promise<GPUDevice>;
	static deviceSync: GPUDevice | undefined;

	readonly rectangleRenderer: RectangleRenderer;

	private static readonly _decorationCssRuleExtractor = new DecorationCssRuleExtractor();
	static get decorationCssRuleExtractor(): DecorationCssRuleExtractor {
		return ViewGpuContext._decorationCssRuleExtractor;
	}

	private static readonly _decorationStyleCache = new DecorationStyleCache();
	static get decorationStyleCache(): DecorationStyleCache {
		return ViewGpuContext._decorationStyleCache;
	}

	private static _atlas: TextureAtlas | undefined;

	/**
	 * The shared texture atlas to use across all views.
	 *
	 * @throws if called before the GPU device is resolved
	 */
	static get atlas(): TextureAtlas {
		if (!ViewGpuContext._atlas) {
			throw new BugIndicatingError('Cannot call ViewGpuContext.textureAtlas before device is resolved');
		}
		return ViewGpuContext._atlas;
	}
	/**
	 * The shared texture atlas to use across all views. This is a convenience alias for
	 * {@link ViewGpuContext.atlas}.
	 *
	 * @throws if called before the GPU device is resolved
	 */
	get atlas(): TextureAtlas {
		return ViewGpuContext.atlas;
	}

	readonly canvasDevicePixelDimensions: IObservable<{ width: number; height: number }>;
	readonly devicePixelRatio: IObservable<number>;
	readonly contentLeft: IObservable<number>;

	constructor(
		context: ViewContext,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this.canvas = createFastDomNode(document.createElement('canvas'));
		this.canvas.setClassName('editorCanvas');

		// Adjust the canvas size to avoid drawing under the scroll bar
		this._register(Event.runAndSubscribe(configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration('editor.scrollbar.verticalScrollbarSize')) {
				const verticalScrollbarSize = configurationService.getValue<IEditorOptions>('editor').scrollbar?.verticalScrollbarSize ?? 14;
				this.canvas.domNode.style.boxSizing = 'border-box';
				this.canvas.domNode.style.paddingRight = `${verticalScrollbarSize}px`;
			}
		}));

		this.ctx = ensureNonNullable(this.canvas.domNode.getContext('webgpu'));

		// Request the GPU device, we only want to do this a single time per window as it's async
		// and can delay the initial render.
		if (!ViewGpuContext.device) {
			ViewGpuContext.device = GPULifecycle.requestDevice((message) => {
				const choices: IPromptChoice[] = [{
					label: nls.localize('editor.dom.render', "Use DOM-based rendering"),
					run: () => this.configurationService.updateValue('editor.experimentalGpuAcceleration', 'off'),
				}];
				this._notificationService.prompt(Severity.Warning, message, choices);
			}).then(ref => {
				ViewGpuContext.deviceSync = ref.object;
				if (!ViewGpuContext._atlas) {
					ViewGpuContext._atlas = this._instantiationService.createInstance(TextureAtlas, ref.object.limits.maxTextureDimension2D, undefined, ViewGpuContext.decorationStyleCache);
				}
				return ref.object;
			});
		}

		const dprObs = observableValue(this, getActiveWindow().devicePixelRatio);
		this._register(addDisposableListener(getActiveWindow(), 'resize', () => {
			dprObs.set(getActiveWindow().devicePixelRatio, undefined);
		}));
		this.devicePixelRatio = dprObs;
		this._register(runOnChange(this.devicePixelRatio, () => ViewGpuContext.atlas?.clear()));

		const canvasDevicePixelDimensions = observableValue(this, { width: this.canvas.domNode.width, height: this.canvas.domNode.height });
		this._register(observeDevicePixelDimensions(
			this.canvas.domNode,
			getActiveWindow(),
			(width, height) => {
				this.canvas.domNode.width = width;
				this.canvas.domNode.height = height;
				canvasDevicePixelDimensions.set({ width, height }, undefined);
			}
		));
		this.canvasDevicePixelDimensions = canvasDevicePixelDimensions;

		const contentLeft = observableValue(this, 0);
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			contentLeft.set(context.configuration.options.get(EditorOption.layoutInfo).contentLeft, undefined);
		}));
		this.contentLeft = contentLeft;

		this.rectangleRenderer = this._instantiationService.createInstance(RectangleRenderer, context, this.contentLeft, this.devicePixelRatio, this.canvas.domNode, this.ctx, ViewGpuContext.device);
	}

	/**
	 * This method determines which lines can be and are allowed to be rendered using the GPU
	 * renderer. Eventually this should trend all lines, except maybe exceptional cases like
	 * decorations that use class names.
	 */
	public canRender(options: ViewLineOptions, viewportData: ViewportData, lineNumber: number): boolean {
		const data = viewportData.getViewLineRenderingData(lineNumber);

		// Check if the line has simple attributes that aren't supported
		if (
			data.containsRTL ||
			data.maxColumn > this.maxGpuCols
		) {
			return false;
		}

		// Check if all inline decorations are supported
		if (data.inlineDecorations.length > 0) {
			let supported = true;
			for (const decoration of data.inlineDecorations) {
				if (decoration.type !== InlineDecorationType.Regular) {
					supported = false;
					break;
				}
				const styleRules = ViewGpuContext._decorationCssRuleExtractor.getStyleRules(this.canvas.domNode, decoration.inlineClassName);
				supported &&= styleRules.every(rule => {
					// Pseudo classes aren't supported currently
					if (rule.selectorText.includes(':')) {
						return false;
					}
					for (const r of rule.style) {
						if (!supportsCssRule(r, rule.style)) {
							return false;
						}
					}
					return true;
				});
				if (!supported) {
					break;
				}
			}
			return supported;
		}

		return true;
	}

	/**
	 * Like {@link canRender} but returns detailed information about why the line cannot be rendered.
	 */
	public canRenderDetailed(options: ViewLineOptions, viewportData: ViewportData, lineNumber: number): string[] {
		const data = viewportData.getViewLineRenderingData(lineNumber);
		const reasons: string[] = [];
		if (data.containsRTL) {
			reasons.push('containsRTL');
		}
		if (data.maxColumn > this.maxGpuCols) {
			reasons.push('maxColumn > maxGpuCols');
		}
		if (data.inlineDecorations.length > 0) {
			let supported = true;
			const problemTypes: InlineDecorationType[] = [];
			const problemSelectors: string[] = [];
			const problemRules: string[] = [];
			for (const decoration of data.inlineDecorations) {
				if (decoration.type !== InlineDecorationType.Regular) {
					problemTypes.push(decoration.type);
					supported = false;
					continue;
				}
				const styleRules = ViewGpuContext._decorationCssRuleExtractor.getStyleRules(this.canvas.domNode, decoration.inlineClassName);
				supported &&= styleRules.every(rule => {
					// Pseudo classes aren't supported currently
					if (rule.selectorText.includes(':')) {
						problemSelectors.push(rule.selectorText);
						return false;
					}
					for (const r of rule.style) {
						if (!supportsCssRule(r, rule.style)) {
							// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
							problemRules.push(`${r}: ${rule.style[r as any]}`);
							return false;
						}
					}
					return true;
				});
				if (!supported) {
					continue;
				}
			}
			if (problemTypes.length > 0) {
				reasons.push(`inlineDecorations with unsupported types (${problemTypes.map(e => `\`${e}\``).join(', ')})`);
			}
			if (problemRules.length > 0) {
				reasons.push(`inlineDecorations with unsupported CSS rules (${problemRules.map(e => `\`${e}\``).join(', ')})`);
			}
			if (problemSelectors.length > 0) {
				reasons.push(`inlineDecorations with unsupported CSS selectors (${problemSelectors.map(e => `\`${e}\``).join(', ')})`);
			}
		}
		return reasons;
	}
}

/**
 * A list of supported decoration CSS rules that can be used in the GPU renderer.
 */
const gpuSupportedDecorationCssRules = [
	'color',
	'font-weight',
	'opacity',
];

function supportsCssRule(rule: string, style: CSSStyleDeclaration) {
	if (!gpuSupportedDecorationCssRules.includes(rule)) {
		return false;
	}
	// Check for values that aren't supported
	switch (rule) {
		default: return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/atlas/atlas.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/atlas/atlas.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { NKeyMap } from '../../../../base/common/map.js';
import type { IBoundingBox, IRasterizedGlyph } from '../raster/raster.js';

/**
 * Information about a {@link IRasterizedGlyph rasterized glyph} that has been drawn to a texture
 * atlas page.
 */
export interface ITextureAtlasPageGlyph {
	/**
	 * The page index of the texture atlas page that the glyph was drawn to.
	 */
	pageIndex: number;
	/**
	 * The index of the glyph in the texture atlas page.
	 */
	glyphIndex: number;
	/** The x coordinate of the glyph on the texture atlas page. */
	x: number;
	/** The y coordinate of the glyph on the texture atlas page. */
	y: number;
	/** The width of the glyph in pixels. */
	w: number;
	/** The height of the glyph in pixels. */
	h: number;
	/** The x offset from {@link x} of the glyph's origin. */
	originOffsetX: number;
	/** The y offset from {@link y} of the glyph's origin. */
	originOffsetY: number;
	/**
	 * The distance from the glyph baseline to the top of the highest bounding rectangle of all
	 * fonts used to render the text.
	 *
	 * @see {@link TextMetrics.fontBoundingBoxAscent}
	 */
	fontBoundingBoxAscent: number;
	/**
	 * The distance from the glyph baseline to the bottom of the bounding rectangle of all fonts
	 * used to render the text.
	 *
	 * @see {@link TextMetrics.fontBoundingBoxDescent}
	 */
	fontBoundingBoxDescent: number;
}

/**
 * A texture atlas allocator is responsible for taking rasterized glyphs, drawing them to a texture
 * atlas page canvas and return information on the texture atlas glyph.
 */
export interface ITextureAtlasAllocator {
	/**
	 * Allocates a rasterized glyph to the canvas, drawing it and returning information on its
	 * position in the canvas. This will return undefined if the glyph does not fit on the canvas.
	 */
	allocate(rasterizedGlyph: Readonly<IRasterizedGlyph>): Readonly<ITextureAtlasPageGlyph> | undefined;
	/**
	 * Gets a usage preview of the atlas for debugging purposes.
	 */
	getUsagePreview(): Promise<Blob>;
	/**
	 * Gets statistics about the allocator's current state for debugging purposes.
	 */
	getStats(): string;
}

/**
 * A texture atlas page that can be read from but not modified.
 */
export interface IReadableTextureAtlasPage {
	/**
	 * A unique identifier for the current state of the texture atlas page. This is a number that
	 * increments whenever a glyph is drawn to the page.
	 */
	readonly version: number;
	/**
	 * A bounding box representing the area of the texture atlas page that is currently in use.
	 */
	readonly usedArea: Readonly<IBoundingBox>;
	/**
	 * An iterator over all glyphs that have been drawn to the page. This will iterate through
	 * glyphs in the order they have been drawn.
	 */
	readonly glyphs: IterableIterator<Readonly<ITextureAtlasPageGlyph>>;
	/**
	 * The source canvas for the texture atlas page.
	 */
	readonly source: OffscreenCanvas;
	/**
	 * Gets a usage preview of the atlas for debugging purposes.
	 */
	getUsagePreview(): Promise<Blob>;
	/**
	 * Gets statistics about the allocator's current state for debugging purposes.
	 */
	getStats(): string;
}

export const enum UsagePreviewColors {
	Unused = '#808080',
	Used = '#4040FF',
	Wasted = '#FF0000',
	Restricted = '#FF000088',
}

export type GlyphMap<T> = NKeyMap<T, [
	chars: string,
	tokenMetadata: number,
	decorationStyleSetId: number,
	rasterizerCacheKey: string,
]>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/atlas/textureAtlas.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/atlas/textureAtlas.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, dispose, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { NKeyMap } from '../../../../base/common/map.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import type { DecorationStyleCache } from '../css/decorationStyleCache.js';
import { GlyphRasterizer } from '../raster/glyphRasterizer.js';
import type { IGlyphRasterizer } from '../raster/raster.js';
import { IdleTaskQueue, type ITaskQueue } from '../taskQueue.js';
import type { IReadableTextureAtlasPage, ITextureAtlasPageGlyph, GlyphMap } from './atlas.js';
import { AllocatorType, TextureAtlasPage } from './textureAtlasPage.js';

export interface ITextureAtlasOptions {
	allocatorType?: AllocatorType;
}

export class TextureAtlas extends Disposable {
	private _colorMap?: string[];
	private readonly _warmUpTask: MutableDisposable<ITaskQueue> = this._register(new MutableDisposable());
	private readonly _warmedUpRasterizers = new Set<number>();
	private readonly _allocatorType: AllocatorType;

	/**
	 * The maximum number of texture atlas pages. This is currently a hard static cap that must not
	 * be reached.
	 */
	static readonly maximumPageCount = 16;

	/**
	 * The main texture atlas pages which are both larger textures and more efficiently packed
	 * relative to the scratch page. The idea is the main pages are drawn to and uploaded to the GPU
	 * much less frequently so as to not drop frames.
	 */
	private readonly _pages: TextureAtlasPage[] = [];
	get pages(): IReadableTextureAtlasPage[] { return this._pages; }

	readonly pageSize: number;

	/**
	 * A maps of glyph keys to the page to start searching for the glyph. This is set before
	 * searching to have as little runtime overhead (branching, intermediate variables) as possible,
	 * so it is not guaranteed to be the actual page the glyph is on. But it is guaranteed that all
	 * pages with a lower index do not contain the glyph.
	 */
	private readonly _glyphPageIndex: GlyphMap<number> = new NKeyMap();

	private readonly _onDidDeleteGlyphs = this._register(new Emitter<void>());
	readonly onDidDeleteGlyphs = this._onDidDeleteGlyphs.event;

	constructor(
		/** The maximum texture size supported by the GPU. */
		private readonly _maxTextureSize: number,
		options: ITextureAtlasOptions | undefined,
		private readonly _decorationStyleCache: DecorationStyleCache,
		@IThemeService private readonly _themeService: IThemeService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		this._allocatorType = options?.allocatorType ?? 'slab';

		this._register(Event.runAndSubscribe(this._themeService.onDidColorThemeChange, () => {
			if (this._colorMap) {
				this.clear();
			}
			this._colorMap = this._themeService.getColorTheme().tokenColorMap;
		}));

		const dprFactor = Math.max(1, Math.floor(getActiveWindow().devicePixelRatio));

		this.pageSize = Math.min(1024 * dprFactor, this._maxTextureSize);
		this._initFirstPage();

		this._register(toDisposable(() => dispose(this._pages)));
	}

	private _initFirstPage() {
		const firstPage = this._instantiationService.createInstance(TextureAtlasPage, 0, this.pageSize, this._allocatorType);
		this._pages.push(firstPage);

		// IMPORTANT: The first glyph on the first page must be an empty glyph such that zeroed out
		// cells end up rendering nothing
		// TODO: This currently means the first slab is for 0x0 glyphs and is wasted
		const nullRasterizer = new GlyphRasterizer(1, '', 1, this._decorationStyleCache);
		firstPage.getGlyph(nullRasterizer, '', 0, 0);
		nullRasterizer.dispose();
	}

	clear() {
		// Clear all pages
		for (const page of this._pages) {
			page.dispose();
		}
		this._pages.length = 0;
		this._glyphPageIndex.clear();
		this._warmedUpRasterizers.clear();
		this._warmUpTask.clear();

		// Recreate first
		this._initFirstPage();

		// Tell listeners
		this._onDidDeleteGlyphs.fire();
	}

	getGlyph(rasterizer: IGlyphRasterizer, chars: string, tokenMetadata: number, decorationStyleSetId: number, x: number): Readonly<ITextureAtlasPageGlyph> {
		// TODO: Encode font size and family into key
		// Ignore metadata that doesn't affect the glyph
		tokenMetadata &= ~(MetadataConsts.LANGUAGEID_MASK | MetadataConsts.TOKEN_TYPE_MASK | MetadataConsts.BALANCED_BRACKETS_MASK);

		// Add x offset for sub-pixel rendering to the unused portion or tokenMetadata. This
		// converts the decimal part of the x to a range from 0 to 9, where 0 = 0.0px x offset,
		// 9 = 0.9px x offset
		tokenMetadata |= Math.floor((x % 1) * 10);

		// Warm up common glyphs
		if (!this._warmedUpRasterizers.has(rasterizer.id)) {
			this._warmUpAtlas(rasterizer);
			this._warmedUpRasterizers.add(rasterizer.id);
		}

		// Try get the glyph, overflowing to a new page if necessary
		return this._tryGetGlyph(this._glyphPageIndex.get(chars, tokenMetadata, decorationStyleSetId, rasterizer.cacheKey) ?? 0, rasterizer, chars, tokenMetadata, decorationStyleSetId);
	}

	private _tryGetGlyph(pageIndex: number, rasterizer: IGlyphRasterizer, chars: string, tokenMetadata: number, decorationStyleSetId: number): Readonly<ITextureAtlasPageGlyph> {
		this._glyphPageIndex.set(pageIndex, chars, tokenMetadata, decorationStyleSetId, rasterizer.cacheKey);
		return (
			this._pages[pageIndex].getGlyph(rasterizer, chars, tokenMetadata, decorationStyleSetId)
			?? (pageIndex + 1 < this._pages.length
				? this._tryGetGlyph(pageIndex + 1, rasterizer, chars, tokenMetadata, decorationStyleSetId)
				: undefined)
			?? this._getGlyphFromNewPage(rasterizer, chars, tokenMetadata, decorationStyleSetId)
		);
	}

	private _getGlyphFromNewPage(rasterizer: IGlyphRasterizer, chars: string, tokenMetadata: number, decorationStyleSetId: number): Readonly<ITextureAtlasPageGlyph> {
		if (this._pages.length >= TextureAtlas.maximumPageCount) {
			throw new Error(`Attempt to create a texture atlas page past the limit ${TextureAtlas.maximumPageCount}`);
		}
		this._pages.push(this._instantiationService.createInstance(TextureAtlasPage, this._pages.length, this.pageSize, this._allocatorType));
		this._glyphPageIndex.set(this._pages.length - 1, chars, tokenMetadata, decorationStyleSetId, rasterizer.cacheKey);
		return this._pages[this._pages.length - 1].getGlyph(rasterizer, chars, tokenMetadata, decorationStyleSetId)!;
	}

	public getUsagePreview(): Promise<Blob[]> {
		return Promise.all(this._pages.map(e => e.getUsagePreview()));
	}

	public getStats(): string[] {
		return this._pages.map(e => e.getStats());
	}

	/**
	 * Warms up the atlas by rasterizing all printable ASCII characters for each token color. This
	 * is distrubuted over multiple idle callbacks to avoid blocking the main thread.
	 */
	private _warmUpAtlas(rasterizer: IGlyphRasterizer): void {
		const colorMap = this._colorMap;
		if (!colorMap) {
			throw new BugIndicatingError('Cannot warm atlas without color map');
		}
		this._warmUpTask.value?.clear();
		const taskQueue = this._warmUpTask.value = this._instantiationService.createInstance(IdleTaskQueue);
		// Warm up using roughly the larger glyphs first to help optimize atlas allocation
		// A-Z
		for (let code = CharCode.A; code <= CharCode.Z; code++) {
			for (const fgColor of colorMap.keys()) {
				taskQueue.enqueue(() => {
					for (let x = 0; x < 1; x += 0.1) {
						this.getGlyph(rasterizer, String.fromCharCode(code), (fgColor << MetadataConsts.FOREGROUND_OFFSET) & MetadataConsts.FOREGROUND_MASK, 0, x);
					}
				});
			}
		}
		// a-z
		for (let code = CharCode.a; code <= CharCode.z; code++) {
			for (const fgColor of colorMap.keys()) {
				taskQueue.enqueue(() => {
					for (let x = 0; x < 1; x += 0.1) {
						this.getGlyph(rasterizer, String.fromCharCode(code), (fgColor << MetadataConsts.FOREGROUND_OFFSET) & MetadataConsts.FOREGROUND_MASK, 0, x);
					}
				});
			}
		}
		// Remaining ascii
		for (let code = CharCode.ExclamationMark; code <= CharCode.Tilde; code++) {
			for (const fgColor of colorMap.keys()) {
				taskQueue.enqueue(() => {
					for (let x = 0; x < 1; x += 0.1) {
						this.getGlyph(rasterizer, String.fromCharCode(code), (fgColor << MetadataConsts.FOREGROUND_OFFSET) & MetadataConsts.FOREGROUND_MASK, 0, x);
					}
				});
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/atlas/textureAtlasPage.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/atlas/textureAtlasPage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { NKeyMap } from '../../../../base/common/map.js';
import { ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import type { IBoundingBox, IGlyphRasterizer } from '../raster/raster.js';
import type { IReadableTextureAtlasPage, ITextureAtlasAllocator, ITextureAtlasPageGlyph, GlyphMap } from './atlas.js';
import { TextureAtlasShelfAllocator } from './textureAtlasShelfAllocator.js';
import { TextureAtlasSlabAllocator } from './textureAtlasSlabAllocator.js';

export type AllocatorType = 'shelf' | 'slab' | ((canvas: OffscreenCanvas, textureIndex: number) => ITextureAtlasAllocator);

export class TextureAtlasPage extends Disposable implements IReadableTextureAtlasPage {

	private _version: number = 0;
	get version(): number { return this._version; }

	/**
	 * The maximum number of glyphs that can be drawn to the page. This is currently a hard static
	 * cap that must not be reached as it will cause the GPU buffer to overflow.
	 */
	static readonly maximumGlyphCount = 5_000;

	private _usedArea: IBoundingBox = { left: 0, top: 0, right: 0, bottom: 0 };
	public get usedArea(): Readonly<IBoundingBox> { return this._usedArea; }

	private readonly _canvas: OffscreenCanvas;
	get source(): OffscreenCanvas { return this._canvas; }

	private readonly _glyphMap: GlyphMap<ITextureAtlasPageGlyph> = new NKeyMap();
	private readonly _glyphInOrderSet: Set<ITextureAtlasPageGlyph> = new Set();
	get glyphs(): IterableIterator<ITextureAtlasPageGlyph> {
		return this._glyphInOrderSet.values();
	}

	private readonly _allocator: ITextureAtlasAllocator;
	private _colorMap!: string[];

	constructor(
		textureIndex: number,
		pageSize: number,
		allocatorType: AllocatorType,
		@ILogService private readonly _logService: ILogService,
		@IThemeService themeService: IThemeService,
	) {
		super();

		this._canvas = new OffscreenCanvas(pageSize, pageSize);
		this._colorMap = themeService.getColorTheme().tokenColorMap;

		switch (allocatorType) {
			case 'shelf': this._allocator = new TextureAtlasShelfAllocator(this._canvas, textureIndex); break;
			case 'slab': this._allocator = new TextureAtlasSlabAllocator(this._canvas, textureIndex); break;
			default: this._allocator = allocatorType(this._canvas, textureIndex); break;
		}

		// Reduce impact of a memory leak if this object is not released
		this._register(toDisposable(() => {
			this._canvas.width = 1;
			this._canvas.height = 1;
		}));
	}

	public getGlyph(rasterizer: IGlyphRasterizer, chars: string, tokenMetadata: number, decorationStyleSetId: number): Readonly<ITextureAtlasPageGlyph> | undefined {
		// IMPORTANT: There are intentionally no intermediate variables here to aid in runtime
		// optimization as it's a very hot function
		return this._glyphMap.get(chars, tokenMetadata, decorationStyleSetId, rasterizer.cacheKey) ?? this._createGlyph(rasterizer, chars, tokenMetadata, decorationStyleSetId);
	}

	private _createGlyph(rasterizer: IGlyphRasterizer, chars: string, tokenMetadata: number, decorationStyleSetId: number): Readonly<ITextureAtlasPageGlyph> | undefined {
		// Ensure the glyph can fit on the page
		if (this._glyphInOrderSet.size >= TextureAtlasPage.maximumGlyphCount) {
			return undefined;
		}

		// Rasterize and allocate the glyph
		const rasterizedGlyph = rasterizer.rasterizeGlyph(chars, tokenMetadata, decorationStyleSetId, this._colorMap);
		const glyph = this._allocator.allocate(rasterizedGlyph);

		// Ensure the glyph was allocated
		if (glyph === undefined) {
			// TODO: undefined here can mean the glyph was too large for a slab on the page, this
			// can lead to big problems if we don't handle it properly https://github.com/microsoft/vscode/issues/232984
			return undefined;
		}

		// Save the glyph
		this._glyphMap.set(glyph, chars, tokenMetadata, decorationStyleSetId, rasterizer.cacheKey);
		this._glyphInOrderSet.add(glyph);

		// Update page version and it's tracked used area
		this._version++;
		this._usedArea.right = Math.max(this._usedArea.right, glyph.x + glyph.w - 1);
		this._usedArea.bottom = Math.max(this._usedArea.bottom, glyph.y + glyph.h - 1);

		if (this._logService.getLevel() === LogLevel.Trace) {
			this._logService.trace('New glyph', {
				chars,
				tokenMetadata,
				decorationStyleSetId,
				rasterizedGlyph,
				glyph
			});
		}

		return glyph;
	}

	getUsagePreview(): Promise<Blob> {
		return this._allocator.getUsagePreview();
	}

	getStats(): string {
		return this._allocator.getStats();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/atlas/textureAtlasShelfAllocator.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/atlas/textureAtlasShelfAllocator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { ensureNonNullable } from '../gpuUtils.js';
import type { IRasterizedGlyph } from '../raster/raster.js';
import { UsagePreviewColors, type ITextureAtlasAllocator, type ITextureAtlasPageGlyph } from './atlas.js';

/**
 * The shelf allocator is a simple allocator that places glyphs in rows, starting a new row when the
 * current row is full. Due to its simplicity, it can waste space but it is very fast.
 */
export class TextureAtlasShelfAllocator implements ITextureAtlasAllocator {

	private readonly _ctx: OffscreenCanvasRenderingContext2D;

	private _currentRow: ITextureAtlasShelf = {
		x: 0,
		y: 0,
		h: 0
	};

	/** A set of all glyphs allocated, this is only tracked to enable debug related functionality */
	private readonly _allocatedGlyphs: Set<Readonly<ITextureAtlasPageGlyph>> = new Set();

	private _nextIndex = 0;

	constructor(
		private readonly _canvas: OffscreenCanvas,
		private readonly _textureIndex: number,
	) {
		this._ctx = ensureNonNullable(this._canvas.getContext('2d', {
			willReadFrequently: true
		}));
	}

	public allocate(rasterizedGlyph: IRasterizedGlyph): ITextureAtlasPageGlyph | undefined {
		// The glyph does not fit into the atlas page
		const glyphWidth = rasterizedGlyph.boundingBox.right - rasterizedGlyph.boundingBox.left + 1;
		const glyphHeight = rasterizedGlyph.boundingBox.bottom - rasterizedGlyph.boundingBox.top + 1;
		if (glyphWidth > this._canvas.width || glyphHeight > this._canvas.height) {
			throw new BugIndicatingError('Glyph is too large for the atlas page');
		}

		// Finalize and increment row if it doesn't fix horizontally
		if (rasterizedGlyph.boundingBox.right - rasterizedGlyph.boundingBox.left + 1 > this._canvas.width - this._currentRow.x) {
			this._currentRow.x = 0;
			this._currentRow.y += this._currentRow.h;
			this._currentRow.h = 1;
		}

		// Return undefined if there isn't any room left
		if (this._currentRow.y + rasterizedGlyph.boundingBox.bottom - rasterizedGlyph.boundingBox.top + 1 > this._canvas.height) {
			return undefined;
		}

		// Draw glyph
		this._ctx.drawImage(
			rasterizedGlyph.source,
			// source
			rasterizedGlyph.boundingBox.left,
			rasterizedGlyph.boundingBox.top,
			glyphWidth,
			glyphHeight,
			// destination
			this._currentRow.x,
			this._currentRow.y,
			glyphWidth,
			glyphHeight
		);

		// Create glyph object
		const glyph: ITextureAtlasPageGlyph = {
			pageIndex: this._textureIndex,
			glyphIndex: this._nextIndex++,
			x: this._currentRow.x,
			y: this._currentRow.y,
			w: glyphWidth,
			h: glyphHeight,
			originOffsetX: rasterizedGlyph.originOffset.x,
			originOffsetY: rasterizedGlyph.originOffset.y,
			fontBoundingBoxAscent: rasterizedGlyph.fontBoundingBoxAscent,
			fontBoundingBoxDescent: rasterizedGlyph.fontBoundingBoxDescent,
		};

		// Shift current row
		this._currentRow.x += glyphWidth;
		this._currentRow.h = Math.max(this._currentRow.h, glyphHeight);

		// Set the glyph
		this._allocatedGlyphs.add(glyph);

		return glyph;
	}

	public getUsagePreview(): Promise<Blob> {
		const w = this._canvas.width;
		const h = this._canvas.height;
		const canvas = new OffscreenCanvas(w, h);
		const ctx = ensureNonNullable(canvas.getContext('2d'));
		ctx.fillStyle = UsagePreviewColors.Unused;
		ctx.fillRect(0, 0, w, h);

		const rowHeight: Map<number, number> = new Map(); // y -> h
		const rowWidth: Map<number, number> = new Map(); // y -> w
		for (const g of this._allocatedGlyphs) {
			rowHeight.set(g.y, Math.max(rowHeight.get(g.y) ?? 0, g.h));
			rowWidth.set(g.y, Math.max(rowWidth.get(g.y) ?? 0, g.x + g.w));
		}
		for (const g of this._allocatedGlyphs) {
			ctx.fillStyle = UsagePreviewColors.Used;
			ctx.fillRect(g.x, g.y, g.w, g.h);
			ctx.fillStyle = UsagePreviewColors.Wasted;
			ctx.fillRect(g.x, g.y + g.h, g.w, rowHeight.get(g.y)! - g.h);
		}
		for (const [rowY, rowW] of rowWidth.entries()) {
			if (rowY !== this._currentRow.y) {
				ctx.fillStyle = UsagePreviewColors.Wasted;
				ctx.fillRect(rowW, rowY, w - rowW, rowHeight.get(rowY)!);
			}
		}
		return canvas.convertToBlob();
	}

	getStats(): string {
		const w = this._canvas.width;
		const h = this._canvas.height;

		let usedPixels = 0;
		let wastedPixels = 0;
		const totalPixels = w * h;

		const rowHeight: Map<number, number> = new Map(); // y -> h
		const rowWidth: Map<number, number> = new Map(); // y -> w
		for (const g of this._allocatedGlyphs) {
			rowHeight.set(g.y, Math.max(rowHeight.get(g.y) ?? 0, g.h));
			rowWidth.set(g.y, Math.max(rowWidth.get(g.y) ?? 0, g.x + g.w));
		}
		for (const g of this._allocatedGlyphs) {
			usedPixels += g.w * g.h;
			wastedPixels += g.w * (rowHeight.get(g.y)! - g.h);
		}
		for (const [rowY, rowW] of rowWidth.entries()) {
			if (rowY !== this._currentRow.y) {
				wastedPixels += (w - rowW) * rowHeight.get(rowY)!;
			}
		}
		return [
			`page${this._textureIndex}:`,
			`     Total: ${totalPixels} (${w}x${h})`,
			`      Used: ${usedPixels} (${((usedPixels / totalPixels) * 100).toPrecision(2)}%)`,
			`    Wasted: ${wastedPixels} (${((wastedPixels / totalPixels) * 100).toPrecision(2)}%)`,
			`Efficiency: ${((usedPixels / (usedPixels + wastedPixels)) * 100).toPrecision(2)}%`,
		].join('\n');
	}
}

interface ITextureAtlasShelf {
	x: number;
	y: number;
	h: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/atlas/textureAtlasSlabAllocator.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/atlas/textureAtlasSlabAllocator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { NKeyMap } from '../../../../base/common/map.js';
import { ensureNonNullable } from '../gpuUtils.js';
import type { IRasterizedGlyph } from '../raster/raster.js';
import { UsagePreviewColors, type ITextureAtlasAllocator, type ITextureAtlasPageGlyph } from './atlas.js';

export interface TextureAtlasSlabAllocatorOptions {
	slabW?: number;
	slabH?: number;
}

/**
 * The slab allocator is a more complex allocator that places glyphs in square slabs of a fixed
 * size. Slabs are defined by a small range of glyphs sizes they can house, this places like-sized
 * glyphs in the same slab which reduces wasted space.
 *
 * Slabs also may contain "unused" regions on the left and bottom depending on the size of the
 * glyphs they include. This space is used to place very thin or short glyphs, which would otherwise
 * waste a lot of space in their own slab.
 */
export class TextureAtlasSlabAllocator implements ITextureAtlasAllocator {

	private readonly _ctx: OffscreenCanvasRenderingContext2D;

	private readonly _slabs: ITextureAtlasSlab[] = [];
	private readonly _activeSlabsByDims: NKeyMap<ITextureAtlasSlab, [number, number]> = new NKeyMap();

	private readonly _unusedRects: ITextureAtlasSlabUnusedRect[] = [];

	private readonly _openRegionsByHeight: Map<number, ITextureAtlasSlabUnusedRect[]> = new Map();
	private readonly _openRegionsByWidth: Map<number, ITextureAtlasSlabUnusedRect[]> = new Map();

	/** A set of all glyphs allocated, this is only tracked to enable debug related functionality */
	private readonly _allocatedGlyphs: Set<Readonly<ITextureAtlasPageGlyph>> = new Set();

	private _slabW: number;
	private _slabH: number;
	private _slabsPerRow: number;
	private _slabsPerColumn: number;
	private _nextIndex = 0;

	constructor(
		private readonly _canvas: OffscreenCanvas,
		private readonly _textureIndex: number,
		options?: TextureAtlasSlabAllocatorOptions
	) {
		this._ctx = ensureNonNullable(this._canvas.getContext('2d', {
			willReadFrequently: true
		}));

		this._slabW = Math.min(
			options?.slabW ?? (64 << Math.max(Math.floor(getActiveWindow().devicePixelRatio) - 1, 0)),
			this._canvas.width
		);
		this._slabH = Math.min(
			options?.slabH ?? this._slabW,
			this._canvas.height
		);
		this._slabsPerRow = Math.floor(this._canvas.width / this._slabW);
		this._slabsPerColumn = Math.floor(this._canvas.height / this._slabH);
	}

	public allocate(rasterizedGlyph: IRasterizedGlyph): ITextureAtlasPageGlyph | undefined {
		// Find ideal slab, creating it if there is none suitable
		const glyphWidth = rasterizedGlyph.boundingBox.right - rasterizedGlyph.boundingBox.left + 1;
		const glyphHeight = rasterizedGlyph.boundingBox.bottom - rasterizedGlyph.boundingBox.top + 1;

		// The glyph does not fit into the atlas page, glyphs should never be this large in practice
		if (glyphWidth > this._canvas.width || glyphHeight > this._canvas.height) {
			throw new BugIndicatingError('Glyph is too large for the atlas page');
		}

		// The glyph does not fit into a slab
		if (glyphWidth > this._slabW || glyphHeight > this._slabH) {
			// Only if this is the allocator's first glyph, resize the slab size to fit the glyph.
			if (this._allocatedGlyphs.size > 0) {
				return undefined;
			}
			// Find the largest power of 2 devisor that the glyph fits into, this ensure there is no
			// wasted space outside the allocated slabs.
			let sizeCandidate = this._canvas.width;
			while (glyphWidth < sizeCandidate / 2 && glyphHeight < sizeCandidate / 2) {
				sizeCandidate /= 2;
			}
			this._slabW = sizeCandidate;
			this._slabH = sizeCandidate;
			this._slabsPerRow = Math.floor(this._canvas.width / this._slabW);
			this._slabsPerColumn = Math.floor(this._canvas.height / this._slabH);
		}

		// const dpr = getActiveWindow().devicePixelRatio;

		// TODO: Include font size as well as DPR in nearestXPixels calculation

		// Round slab glyph dimensions to the nearest x pixels, where x scaled with device pixel ratio
		// const nearestXPixels = Math.max(1, Math.floor(dpr / 0.5));
		// const nearestXPixels = Math.max(1, Math.floor(dpr));
		const desiredSlabSize = {
			// Nearest square number
			// TODO: This can probably be optimized
			// w: 1 << Math.ceil(Math.sqrt(glyphWidth)),
			// h: 1 << Math.ceil(Math.sqrt(glyphHeight)),

			// Nearest x px
			// w: Math.ceil(glyphWidth / nearestXPixels) * nearestXPixels,
			// h: Math.ceil(glyphHeight / nearestXPixels) * nearestXPixels,

			// Round odd numbers up
			// w: glyphWidth % 0 === 1 ? glyphWidth + 1 : glyphWidth,
			// h: glyphHeight % 0 === 1 ? glyphHeight + 1 : glyphHeight,

			// Exact number only
			w: glyphWidth,
			h: glyphHeight,
		};

		// Get any existing slab
		let slab = this._activeSlabsByDims.get(desiredSlabSize.w, desiredSlabSize.h);

		// Check if the slab is full
		if (slab) {
			const glyphsPerSlab = Math.floor(this._slabW / slab.entryW) * Math.floor(this._slabH / slab.entryH);
			if (slab.count >= glyphsPerSlab) {
				slab = undefined;
			}
		}

		let dx: number | undefined;
		let dy: number | undefined;

		// Search for suitable space in unused rectangles
		if (!slab) {
			// Only check availability for the smallest side
			if (glyphWidth < glyphHeight) {
				const openRegions = this._openRegionsByWidth.get(glyphWidth);
				if (openRegions?.length) {
					// TODO: Don't search everything?
					// Search from the end so we can typically pop it off the stack
					for (let i = openRegions.length - 1; i >= 0; i--) {
						const r = openRegions[i];
						if (r.w >= glyphWidth && r.h >= glyphHeight) {
							dx = r.x;
							dy = r.y;
							if (glyphWidth < r.w) {
								this._unusedRects.push({
									x: r.x + glyphWidth,
									y: r.y,
									w: r.w - glyphWidth,
									h: glyphHeight
								});
							}
							r.y += glyphHeight;
							r.h -= glyphHeight;
							if (r.h === 0) {
								if (i === openRegions.length - 1) {
									openRegions.pop();
								} else {
									this._unusedRects.splice(i, 1);
								}
							}
							break;
						}
					}
				}
			} else {
				const openRegions = this._openRegionsByHeight.get(glyphHeight);
				if (openRegions?.length) {
					// TODO: Don't search everything?
					// Search from the end so we can typically pop it off the stack
					for (let i = openRegions.length - 1; i >= 0; i--) {
						const r = openRegions[i];
						if (r.w >= glyphWidth && r.h >= glyphHeight) {
							dx = r.x;
							dy = r.y;
							if (glyphHeight < r.h) {
								this._unusedRects.push({
									x: r.x,
									y: r.y + glyphHeight,
									w: glyphWidth,
									h: r.h - glyphHeight
								});
							}
							r.x += glyphWidth;
							r.w -= glyphWidth;
							if (r.h === 0) {
								if (i === openRegions.length - 1) {
									openRegions.pop();
								} else {
									this._unusedRects.splice(i, 1);
								}
							}
							break;
						}
					}
				}
			}
		}

		// Create a new slab
		if (dx === undefined || dy === undefined) {
			if (!slab) {
				if (this._slabs.length >= this._slabsPerRow * this._slabsPerColumn) {
					return undefined;
				}

				slab = {
					x: Math.floor(this._slabs.length % this._slabsPerRow) * this._slabW,
					y: Math.floor(this._slabs.length / this._slabsPerRow) * this._slabH,
					entryW: desiredSlabSize.w,
					entryH: desiredSlabSize.h,
					count: 0
				};
				// Track unused regions to use for small glyphs
				// +-------------+----+
				// |             |    |
				// |             |    | <- Unused W region
				// |             |    |
				// |-------------+----+
				// |                  | <- Unused H region
				// +------------------+
				const unusedW = this._slabW % slab.entryW;
				const unusedH = this._slabH % slab.entryH;
				if (unusedW) {
					addEntryToMapArray(this._openRegionsByWidth, unusedW, {
						x: slab.x + this._slabW - unusedW,
						w: unusedW,
						y: slab.y,
						h: this._slabH - (unusedH ?? 0)
					});
				}
				if (unusedH) {
					addEntryToMapArray(this._openRegionsByHeight, unusedH, {
						x: slab.x,
						w: this._slabW,
						y: slab.y + this._slabH - unusedH,
						h: unusedH
					});
				}
				this._slabs.push(slab);
				this._activeSlabsByDims.set(slab, desiredSlabSize.w, desiredSlabSize.h);
			}

			const glyphsPerRow = Math.floor(this._slabW / slab.entryW);
			dx = slab.x + Math.floor(slab.count % glyphsPerRow) * slab.entryW;
			dy = slab.y + Math.floor(slab.count / glyphsPerRow) * slab.entryH;

			// Shift current row
			slab.count++;
		}

		// Draw glyph
		this._ctx.drawImage(
			rasterizedGlyph.source,
			// source
			rasterizedGlyph.boundingBox.left,
			rasterizedGlyph.boundingBox.top,
			glyphWidth,
			glyphHeight,
			// destination
			dx,
			dy,
			glyphWidth,
			glyphHeight
		);

		// Create glyph object
		const glyph: ITextureAtlasPageGlyph = {
			pageIndex: this._textureIndex,
			glyphIndex: this._nextIndex++,
			x: dx,
			y: dy,
			w: glyphWidth,
			h: glyphHeight,
			originOffsetX: rasterizedGlyph.originOffset.x,
			originOffsetY: rasterizedGlyph.originOffset.y,
			fontBoundingBoxAscent: rasterizedGlyph.fontBoundingBoxAscent,
			fontBoundingBoxDescent: rasterizedGlyph.fontBoundingBoxDescent,
		};

		// Set the glyph
		this._allocatedGlyphs.add(glyph);

		return glyph;
	}

	public getUsagePreview(): Promise<Blob> {
		const w = this._canvas.width;
		const h = this._canvas.height;
		const canvas = new OffscreenCanvas(w, h);
		const ctx = ensureNonNullable(canvas.getContext('2d'));

		ctx.fillStyle = UsagePreviewColors.Unused;
		ctx.fillRect(0, 0, w, h);

		let slabEntryPixels = 0;
		let usedPixels = 0;
		let slabEdgePixels = 0;
		let restrictedPixels = 0;
		const slabW = 64 << (Math.floor(getActiveWindow().devicePixelRatio) - 1);
		const slabH = slabW;

		// Draw wasted underneath glyphs first
		for (const slab of this._slabs) {
			let x = 0;
			let y = 0;
			for (let i = 0; i < slab.count; i++) {
				if (x + slab.entryW > slabW) {
					x = 0;
					y += slab.entryH;
				}
				ctx.fillStyle = UsagePreviewColors.Wasted;
				ctx.fillRect(slab.x + x, slab.y + y, slab.entryW, slab.entryH);

				slabEntryPixels += slab.entryW * slab.entryH;
				x += slab.entryW;
			}
			const entriesPerRow = Math.floor(slabW / slab.entryW);
			const entriesPerCol = Math.floor(slabH / slab.entryH);
			const thisSlabPixels = slab.entryW * entriesPerRow * slab.entryH * entriesPerCol;
			slabEdgePixels += (slabW * slabH) - thisSlabPixels;
		}

		// Draw glyphs
		for (const g of this._allocatedGlyphs) {
			usedPixels += g.w * g.h;
			ctx.fillStyle = UsagePreviewColors.Used;
			ctx.fillRect(g.x, g.y, g.w, g.h);
		}

		// Draw unused space on side
		const unusedRegions = Array.from(this._openRegionsByWidth.values()).flat().concat(Array.from(this._openRegionsByHeight.values()).flat());
		for (const r of unusedRegions) {
			ctx.fillStyle = UsagePreviewColors.Restricted;
			ctx.fillRect(r.x, r.y, r.w, r.h);
			restrictedPixels += r.w * r.h;
		}


		// Overlay actual glyphs on top
		ctx.globalAlpha = 0.5;
		ctx.drawImage(this._canvas, 0, 0);
		ctx.globalAlpha = 1;

		return canvas.convertToBlob();
	}

	public getStats(): string {
		const w = this._canvas.width;
		const h = this._canvas.height;

		let slabEntryPixels = 0;
		let usedPixels = 0;
		let slabEdgePixels = 0;
		let wastedPixels = 0;
		let restrictedPixels = 0;
		const totalPixels = w * h;
		const slabW = 64 << (Math.floor(getActiveWindow().devicePixelRatio) - 1);
		const slabH = slabW;

		// Draw wasted underneath glyphs first
		for (const slab of this._slabs) {
			let x = 0;
			let y = 0;
			for (let i = 0; i < slab.count; i++) {
				if (x + slab.entryW > slabW) {
					x = 0;
					y += slab.entryH;
				}
				slabEntryPixels += slab.entryW * slab.entryH;
				x += slab.entryW;
			}
			const entriesPerRow = Math.floor(slabW / slab.entryW);
			const entriesPerCol = Math.floor(slabH / slab.entryH);
			const thisSlabPixels = slab.entryW * entriesPerRow * slab.entryH * entriesPerCol;
			slabEdgePixels += (slabW * slabH) - thisSlabPixels;
		}

		// Draw glyphs
		for (const g of this._allocatedGlyphs) {
			usedPixels += g.w * g.h;
		}

		// Draw unused space on side
		const unusedRegions = Array.from(this._openRegionsByWidth.values()).flat().concat(Array.from(this._openRegionsByHeight.values()).flat());
		for (const r of unusedRegions) {
			restrictedPixels += r.w * r.h;
		}

		const edgeUsedPixels = slabEdgePixels - restrictedPixels;
		wastedPixels = slabEntryPixels - (usedPixels - edgeUsedPixels);

		// usedPixels += slabEdgePixels - restrictedPixels;
		const efficiency = usedPixels / (usedPixels + wastedPixels + restrictedPixels);

		return [
			`page[${this._textureIndex}]:`,
			`     Total: ${totalPixels}px (${w}x${h})`,
			`      Used: ${usedPixels}px (${((usedPixels / totalPixels) * 100).toFixed(2)}%)`,
			`    Wasted: ${wastedPixels}px (${((wastedPixels / totalPixels) * 100).toFixed(2)}%)`,
			`Restricted: ${restrictedPixels}px (${((restrictedPixels / totalPixels) * 100).toFixed(2)}%) (hard to allocate)`,
			`Efficiency: ${efficiency === 1 ? '100' : (efficiency * 100).toFixed(2)}%`,
			`     Slabs: ${this._slabs.length} of ${Math.floor(this._canvas.width / slabW) * Math.floor(this._canvas.height / slabH)}`
		].join('\n');
	}
}

interface ITextureAtlasSlab {
	x: number;
	y: number;
	entryH: number;
	entryW: number;
	count: number;
}

interface ITextureAtlasSlabUnusedRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

function addEntryToMapArray<K, V>(map: Map<K, V[]>, key: K, entry: V) {
	let list = map.get(key);
	if (!list) {
		list = [];
		map.set(key, list);
	}
	list.push(entry);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/css/decorationCssRuleExtractor.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/css/decorationCssRuleExtractor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, getActiveDocument } from '../../../../base/browser/dom.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import './media/decorationCssRuleExtractor.css';

/**
 * Extracts CSS rules that would be applied to certain decoration classes.
 */
export class DecorationCssRuleExtractor extends Disposable {
	private _container: HTMLElement;
	private _dummyElement: HTMLSpanElement;

	private _ruleCache: Map</* className */string, CSSStyleRule[]> = new Map();

	constructor() {
		super();

		this._container = $('div.monaco-decoration-css-rule-extractor');
		this._dummyElement = $('span');
		this._container.appendChild(this._dummyElement);

		this._register(toDisposable(() => this._container.remove()));
	}

	getStyleRules(canvas: HTMLElement, decorationClassName: string): CSSStyleRule[] {
		// Check cache
		const existing = this._ruleCache.get(decorationClassName);
		if (existing) {
			return existing;
		}

		// Set up DOM
		this._dummyElement.className = decorationClassName;
		canvas.appendChild(this._container);

		// Get rules
		const rules = this._getStyleRules(decorationClassName);
		this._ruleCache.set(decorationClassName, rules);

		// Tear down DOM
		canvas.removeChild(this._container);

		return rules;
	}

	private _getStyleRules(className: string) {
		// Iterate through all stylesheets and imported stylesheets to find matching rules
		const rules = [];
		const doc = getActiveDocument();
		const stylesheets = [...doc.styleSheets];
		for (let i = 0; i < stylesheets.length; i++) {
			const stylesheet = stylesheets[i];
			for (const rule of stylesheet.cssRules) {
				if (rule instanceof CSSImportRule) {
					if (rule.styleSheet) {
						stylesheets.push(rule.styleSheet);
					}
				} else if (rule instanceof CSSStyleRule) {
					// Note that originally `.matches(rule.selectorText)` was used but this would
					// not pick up pseudo-classes which are important to determine support of the
					// returned styles.
					//
					// Since a selector could contain a class name lookup that is simple a prefix of
					// the class name we are looking for, we need to also check the character after
					// it.
					const searchTerm = `.${className}`;
					const index = rule.selectorText.indexOf(searchTerm);
					if (index !== -1) {
						const endOfResult = index + searchTerm.length;
						if (rule.selectorText.length === endOfResult || rule.selectorText.substring(endOfResult, endOfResult + 1).match(/[ :]/)) {
							rules.push(rule);
						}
					}
				}
			}
		}

		return rules;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/css/decorationStyleCache.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/css/decorationStyleCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NKeyMap } from '../../../../base/common/map.js';

export interface IDecorationStyleSet {
	/**
	 * A 24-bit number representing `color`.
	 */
	color: number | undefined;
	/**
	 * Whether the text should be rendered in bold.
	 */
	bold: boolean | undefined;
	/**
	 * A number between 0 and 1 representing the opacity of the text.
	 */
	opacity: number | undefined;
}

export interface IDecorationStyleCacheEntry extends IDecorationStyleSet {
	/**
	 * A unique identifier for this set of styles.
	 */
	id: number;
}

export class DecorationStyleCache {

	private _nextId = 1;

	private readonly _cacheById = new Map<number, IDecorationStyleCacheEntry>();
	private readonly _cacheByStyle = new NKeyMap<IDecorationStyleCacheEntry, [number, number, string]>();

	getOrCreateEntry(
		color: number | undefined,
		bold: boolean | undefined,
		opacity: number | undefined
	): number {
		if (color === undefined && bold === undefined && opacity === undefined) {
			return 0;
		}
		const result = this._cacheByStyle.get(color ?? 0, bold ? 1 : 0, opacity === undefined ? '' : opacity.toFixed(2));
		if (result) {
			return result.id;
		}
		const id = this._nextId++;
		const entry = {
			id,
			color,
			bold,
			opacity,
		};
		this._cacheById.set(id, entry);
		this._cacheByStyle.set(entry, color ?? 0, bold ? 1 : 0, opacity === undefined ? '' : opacity.toFixed(2));
		return id;
	}

	getStyleSet(id: number): IDecorationStyleSet | undefined {
		if (id === 0) {
			return undefined;
		}
		return this._cacheById.get(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/css/media/decorationCssRuleExtractor.css]---
Location: vscode-main/src/vs/editor/browser/gpu/css/media/decorationCssRuleExtractor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .monaco-decoration-css-rule-extractor {
	visibility: hidden;
	pointer-events: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/raster/glyphRasterizer.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/raster/glyphRasterizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from '../../../../base/common/decorators.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { FontStyle, TokenMetadata } from '../../../common/encodedTokenAttributes.js';
import type { DecorationStyleCache } from '../css/decorationStyleCache.js';
import { ensureNonNullable } from '../gpuUtils.js';
import { type IBoundingBox, type IGlyphRasterizer, type IRasterizedGlyph } from './raster.js';

let nextId = 0;

export class GlyphRasterizer extends Disposable implements IGlyphRasterizer {
	public readonly id = nextId++;

	@memoize
	public get cacheKey(): string {
		return `${this.fontFamily}_${this.fontSize}px`;
	}

	private _canvas: OffscreenCanvas;
	private _ctx: OffscreenCanvasRenderingContext2D;

	private readonly _textMetrics: TextMetrics;

	private _workGlyph: IRasterizedGlyph = {
		source: null!,
		boundingBox: {
			left: 0,
			bottom: 0,
			right: 0,
			top: 0,
		},
		originOffset: {
			x: 0,
			y: 0,
		},
		fontBoundingBoxAscent: 0,
		fontBoundingBoxDescent: 0,
	};
	private _workGlyphConfig: { chars: string | undefined; tokenMetadata: number; decorationStyleSetId: number } = { chars: undefined, tokenMetadata: 0, decorationStyleSetId: 0 };

	// TODO: Support workbench.fontAliasing correctly
	private _antiAliasing: 'subpixel' | 'greyscale' = isMacintosh ? 'greyscale' : 'subpixel';

	constructor(
		readonly fontSize: number,
		readonly fontFamily: string,
		readonly devicePixelRatio: number,
		private readonly _decorationStyleCache: DecorationStyleCache,
	) {
		super();

		const devicePixelFontSize = Math.ceil(this.fontSize * devicePixelRatio);
		this._canvas = new OffscreenCanvas(devicePixelFontSize * 3, devicePixelFontSize * 3);
		this._ctx = ensureNonNullable(this._canvas.getContext('2d', {
			willReadFrequently: true,
			alpha: this._antiAliasing === 'greyscale',
		}));
		this._ctx.textBaseline = 'top';
		this._ctx.fillStyle = '#FFFFFF';
		this._ctx.font = `${devicePixelFontSize}px ${this.fontFamily}`;
		this._textMetrics = this._ctx.measureText('A');
	}

	/**
	 * Rasterizes a glyph. Note that the returned object is reused across different glyphs and
	 * therefore is only safe for synchronous access.
	 */
	public rasterizeGlyph(
		chars: string,
		tokenMetadata: number,
		decorationStyleSetId: number,
		colorMap: string[],
	): Readonly<IRasterizedGlyph> {
		if (chars === '') {
			return {
				source: this._canvas,
				boundingBox: { top: 0, left: 0, bottom: -1, right: -1 },
				originOffset: { x: 0, y: 0 },
				fontBoundingBoxAscent: 0,
				fontBoundingBoxDescent: 0,
			};
		}
		// Check if the last glyph matches the config, reuse if so. This helps avoid unnecessary
		// work when the rasterizer is called multiple times like when the glyph doesn't fit into a
		// page.
		if (this._workGlyphConfig.chars === chars && this._workGlyphConfig.tokenMetadata === tokenMetadata && this._workGlyphConfig.decorationStyleSetId === decorationStyleSetId) {
			return this._workGlyph;
		}
		this._workGlyphConfig.chars = chars;
		this._workGlyphConfig.tokenMetadata = tokenMetadata;
		this._workGlyphConfig.decorationStyleSetId = decorationStyleSetId;
		return this._rasterizeGlyph(chars, tokenMetadata, decorationStyleSetId, colorMap);
	}

	public _rasterizeGlyph(
		chars: string,
		tokenMetadata: number,
		decorationStyleSetId: number,
		colorMap: string[],
	): Readonly<IRasterizedGlyph> {
		const devicePixelFontSize = Math.ceil(this.fontSize * this.devicePixelRatio);
		const canvasDim = devicePixelFontSize * 3;
		if (this._canvas.width !== canvasDim) {
			this._canvas.width = canvasDim;
			this._canvas.height = canvasDim;
		}

		this._ctx.save();

		// The sub-pixel x offset is the fractional part of the x pixel coordinate of the cell, this
		// is used to improve the spacing between rendered characters.
		const xSubPixelXOffset = (tokenMetadata & 0b1111) / 10;

		const bgId = TokenMetadata.getBackground(tokenMetadata);
		const bg = colorMap[bgId];

		const decorationStyleSet = this._decorationStyleCache.getStyleSet(decorationStyleSetId);

		// When SPAA is used, the background color must be present to get the right glyph
		if (this._antiAliasing === 'subpixel') {
			this._ctx.fillStyle = bg;
			this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
		} else {
			this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		}

		const fontSb = new StringBuilder(200);
		const fontStyle = TokenMetadata.getFontStyle(tokenMetadata);
		if (fontStyle & FontStyle.Italic) {
			fontSb.appendString('italic ');
		}
		if (decorationStyleSet?.bold !== undefined) {
			if (decorationStyleSet.bold) {
				fontSb.appendString('bold ');
			}
		} else if (fontStyle & FontStyle.Bold) {
			fontSb.appendString('bold ');
		}
		fontSb.appendString(`${devicePixelFontSize}px ${this.fontFamily}`);
		this._ctx.font = fontSb.build();

		// TODO: Support FontStyle.Strikethrough and FontStyle.Underline text decorations, these
		//       need to be drawn manually to the canvas. See xterm.js for "dodging" the text for
		//       underlines.

		const originX = devicePixelFontSize;
		const originY = devicePixelFontSize;
		if (decorationStyleSet?.color !== undefined) {
			this._ctx.fillStyle = `#${decorationStyleSet.color.toString(16).padStart(8, '0')}`;
		} else {
			this._ctx.fillStyle = colorMap[TokenMetadata.getForeground(tokenMetadata)];
		}
		this._ctx.textBaseline = 'top';

		if (decorationStyleSet?.opacity !== undefined) {
			this._ctx.globalAlpha = decorationStyleSet.opacity;
		}

		this._ctx.fillText(chars, originX + xSubPixelXOffset, originY);
		this._ctx.restore();

		const imageData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
		if (this._antiAliasing === 'subpixel') {
			const bgR = parseInt(bg.substring(1, 3), 16);
			const bgG = parseInt(bg.substring(3, 5), 16);
			const bgB = parseInt(bg.substring(5, 7), 16);
			this._clearColor(imageData, bgR, bgG, bgB);
			this._ctx.putImageData(imageData, 0, 0);
		}
		this._findGlyphBoundingBox(imageData, this._workGlyph.boundingBox);
		// const offset = {
		// 	x: textMetrics.actualBoundingBoxLeft,
		// 	y: textMetrics.actualBoundingBoxAscent
		// };
		// const size = {
		// 	w: textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft,
		// 	y: textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent,
		// 	wInt: Math.ceil(textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft),
		// 	yInt: Math.ceil(textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent),
		// };
		// console.log(`${chars}_${fg}`, textMetrics, boundingBox, originX, originY, { width: boundingBox.right - boundingBox.left, height: boundingBox.bottom - boundingBox.top });
		this._workGlyph.source = this._canvas;
		this._workGlyph.originOffset.x = this._workGlyph.boundingBox.left - originX;
		this._workGlyph.originOffset.y = this._workGlyph.boundingBox.top - originY;
		this._workGlyph.fontBoundingBoxAscent = this._textMetrics.fontBoundingBoxAscent;
		this._workGlyph.fontBoundingBoxDescent = this._textMetrics.fontBoundingBoxDescent;

		// const result2: IRasterizedGlyph = {
		// 	source: this._canvas,
		// 	boundingBox: {
		// 		left: Math.floor(originX - textMetrics.actualBoundingBoxLeft),
		// 		right: Math.ceil(originX + textMetrics.actualBoundingBoxRight),
		// 		top: Math.floor(originY - textMetrics.actualBoundingBoxAscent),
		// 		bottom: Math.ceil(originY + textMetrics.actualBoundingBoxDescent),
		// 	},
		// 	originOffset: {
		// 		x: Math.floor(boundingBox.left - originX),
		// 		y: Math.floor(boundingBox.top - originY)
		// 	}
		// };

		// TODO: Verify result 1 and 2 are the same

		// if (result2.boundingBox.left > result.boundingBox.left) {
		// 	debugger;
		// }
		// if (result2.boundingBox.top > result.boundingBox.top) {
		// 	debugger;
		// }
		// if (result2.boundingBox.right < result.boundingBox.right) {
		// 	debugger;
		// }
		// if (result2.boundingBox.bottom < result.boundingBox.bottom) {
		// 	debugger;
		// }
		// if (JSON.stringify(result2.originOffset) !== JSON.stringify(result.originOffset)) {
		// 	debugger;
		// }



		return this._workGlyph;
	}

	private _clearColor(imageData: ImageData, r: number, g: number, b: number) {
		for (let offset = 0; offset < imageData.data.length; offset += 4) {
			// Check exact match
			if (imageData.data[offset] === r &&
				imageData.data[offset + 1] === g &&
				imageData.data[offset + 2] === b) {
				imageData.data[offset + 3] = 0;
			}
		}
	}

	// TODO: Does this even need to happen when measure text is used?
	private _findGlyphBoundingBox(imageData: ImageData, outBoundingBox: IBoundingBox) {
		const height = this._canvas.height;
		const width = this._canvas.width;
		let found = false;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const alphaOffset = y * width * 4 + x * 4 + 3;
				if (imageData.data[alphaOffset] !== 0) {
					outBoundingBox.top = y;
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}
		outBoundingBox.left = 0;
		found = false;
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const alphaOffset = y * width * 4 + x * 4 + 3;
				if (imageData.data[alphaOffset] !== 0) {
					outBoundingBox.left = x;
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}
		outBoundingBox.right = width;
		found = false;
		for (let x = width - 1; x >= outBoundingBox.left; x--) {
			for (let y = 0; y < height; y++) {
				const alphaOffset = y * width * 4 + x * 4 + 3;
				if (imageData.data[alphaOffset] !== 0) {
					outBoundingBox.right = x;
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}
		outBoundingBox.bottom = outBoundingBox.top;
		found = false;
		for (let y = height - 1; y >= 0; y--) {
			for (let x = 0; x < width; x++) {
				const alphaOffset = y * width * 4 + x * 4 + 3;
				if (imageData.data[alphaOffset] !== 0) {
					outBoundingBox.bottom = y;
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}
	}

	public getTextMetrics(text: string): TextMetrics {
		return this._ctx.measureText(text);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/raster/raster.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/raster/raster.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { MetadataConsts } from '../../../common/encodedTokenAttributes.js';

export interface IGlyphRasterizer {
	/**
	 * A unique identifier for the rasterizer.
	 */
	readonly id: number;

	/**
	 * An identifier for properties inherent to rendering with this rasterizer. This will be the
	 * same as other rasterizer cache keys provided they share the same property values in question.
	 */
	readonly cacheKey: string;

	/**
	 * Rasterizes a glyph.
	 * @param chars The character(s) to rasterize. This can be a single character, a ligature, an
	 * emoji, etc.
	 * @param tokenMetadata The token metadata of the glyph to rasterize. See {@link MetadataConsts}
	 * for how this works.
	 * @param decorationStyleSetId The id of the decoration style sheet. Zero means no decoration.
	 * @param colorMap A theme's color map.
	 */
	rasterizeGlyph(
		chars: string,
		tokenMetadata: number,
		decorationStyleSetId: number,
		colorMap: string[],
	): Readonly<IRasterizedGlyph>;

	getTextMetrics(text: string): TextMetrics;
}

/**
 * A simple bounding box in a 2D plane.
 */
export interface IBoundingBox {
	/** The left x coordinate (inclusive). */
	left: number;
	/** The top y coordinate (inclusive). */
	top: number;
	/** The right x coordinate (inclusive). */
	right: number;
	/** The bottom y coordinate (inclusive). */
	bottom: number;
}

/**
 * A glyph that has been rasterized to a canvas.
 */
export interface IRasterizedGlyph {
	/**
	 * The source canvas the glyph was rasterized to.
	 */
	source: OffscreenCanvas;
	/**
	 * The bounding box of the glyph within {@link source}.
	 */
	boundingBox: IBoundingBox;
	/**
	 * The offset to the glyph's origin (where it should be drawn to).
	 */
	originOffset: { x: number; y: number };
	/**
	 * The distance from the glyph baseline to the top of the highest bounding rectangle of all
	 * fonts used to render the text.
	 *
	 * @see {@link TextMetrics.fontBoundingBoxAscent}
	 */
	fontBoundingBoxAscent: number;
	/**
	 * The distance from the glyph baseline to the bottom of the bounding rectangle of all fonts
	 * used to render the text.
	 *
	 * @see {@link TextMetrics.fontBoundingBoxDescent}
	 */
	fontBoundingBoxDescent: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/renderStrategy/baseRenderStrategy.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/renderStrategy/baseRenderStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ViewEventHandler } from '../../../common/viewEventHandler.js';
import type { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import type { ViewContext } from '../../../common/viewModel/viewContext.js';
import type { ViewLineOptions } from '../../viewParts/viewLines/viewLineOptions.js';
import type { IGpuRenderStrategy } from '../gpu.js';
import { GlyphRasterizer } from '../raster/glyphRasterizer.js';
import type { ViewGpuContext } from '../viewGpuContext.js';

export abstract class BaseRenderStrategy extends ViewEventHandler implements IGpuRenderStrategy {

	get glyphRasterizer() { return this._glyphRasterizer.value; }

	abstract type: string;
	abstract wgsl: string;
	abstract bindGroupEntries: GPUBindGroupEntry[];

	constructor(
		protected readonly _context: ViewContext,
		protected readonly _viewGpuContext: ViewGpuContext,
		protected readonly _device: GPUDevice,
		protected readonly _glyphRasterizer: { value: GlyphRasterizer },
	) {
		super();

		this._context.addEventHandler(this);
	}

	abstract reset(): void;
	abstract update(viewportData: ViewportData, viewLineOptions: ViewLineOptions): number;
	abstract draw(pass: GPURenderPassEncoder, viewportData: ViewportData): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/renderStrategy/fullFileRenderStrategy.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/renderStrategy/fullFileRenderStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';
import type { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { ViewEventType, type ViewConfigurationChangedEvent, type ViewDecorationsChangedEvent, type ViewLineMappingChangedEvent, type ViewLinesChangedEvent, type ViewLinesDeletedEvent, type ViewLinesInsertedEvent, type ViewScrollChangedEvent, type ViewThemeChangedEvent, type ViewTokensChangedEvent, type ViewZonesChangedEvent } from '../../../common/viewEvents.js';
import type { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import type { ViewLineRenderingData } from '../../../common/viewModel.js';
import type { ViewContext } from '../../../common/viewModel/viewContext.js';
import type { ViewLineOptions } from '../../viewParts/viewLines/viewLineOptions.js';
import type { ITextureAtlasPageGlyph } from '../atlas/atlas.js';
import { createContentSegmenter, type IContentSegmenter } from '../contentSegmenter.js';
import { fullFileRenderStrategyWgsl } from './fullFileRenderStrategy.wgsl.js';
import { BindingId } from '../gpu.js';
import { GPULifecycle } from '../gpuDisposable.js';
import { quadVertices } from '../gpuUtils.js';
import { GlyphRasterizer } from '../raster/glyphRasterizer.js';
import { ViewGpuContext } from '../viewGpuContext.js';
import { BaseRenderStrategy } from './baseRenderStrategy.js';
import { InlineDecoration } from '../../../common/viewModel/inlineDecorations.js';

const enum Constants {
	IndicesPerCell = 6,
}

const enum CellBufferInfo {
	FloatsPerEntry = 6,
	BytesPerEntry = CellBufferInfo.FloatsPerEntry * 4,
	Offset_X = 0,
	Offset_Y = 1,
	Offset_Unused1 = 2,
	Offset_Unused2 = 3,
	GlyphIndex = 4,
	TextureIndex = 5,
}

type QueuedBufferEvent = (
	ViewConfigurationChangedEvent |
	ViewLineMappingChangedEvent |
	ViewLinesDeletedEvent |
	ViewZonesChangedEvent
);

/**
 * A render strategy that tracks a large buffer, uploading only dirty lines as they change and
 * leveraging heavy caching. This is the most performant strategy but has limitations around long
 * lines and too many lines.
 */
export class FullFileRenderStrategy extends BaseRenderStrategy {

	/**
	 * The hard cap for line count that can be rendered by the GPU renderer.
	 */
	static readonly maxSupportedLines = 3000;

	/**
	 * The hard cap for line columns that can be rendered by the GPU renderer.
	 */
	static readonly maxSupportedColumns = 200;

	readonly type = 'fullfile';
	readonly wgsl: string = fullFileRenderStrategyWgsl;

	private _cellBindBuffer!: GPUBuffer;

	/**
	 * The cell value buffers, these hold the cells and their glyphs. It's double buffers such that
	 * the thread doesn't block when one is being uploaded to the GPU.
	 */
	private _cellValueBuffers!: [ArrayBuffer, ArrayBuffer];
	private _activeDoubleBufferIndex: 0 | 1 = 0;

	private readonly _upToDateLines: [Set<number>, Set<number>] = [new Set(), new Set()];
	private _visibleObjectCount: number = 0;
	private _finalRenderedLine: number = 0;

	private _scrollOffsetBindBuffer: GPUBuffer;
	private _scrollOffsetValueBuffer: Float32Array;
	private _scrollInitialized: boolean = false;

	private readonly _queuedBufferUpdates: [QueuedBufferEvent[], QueuedBufferEvent[]] = [[], []];

	get bindGroupEntries(): GPUBindGroupEntry[] {
		return [
			{ binding: BindingId.Cells, resource: { buffer: this._cellBindBuffer } },
			{ binding: BindingId.ScrollOffset, resource: { buffer: this._scrollOffsetBindBuffer } }
		];
	}

	constructor(
		context: ViewContext,
		viewGpuContext: ViewGpuContext,
		device: GPUDevice,
		glyphRasterizer: { value: GlyphRasterizer },
	) {
		super(context, viewGpuContext, device, glyphRasterizer);

		const bufferSize = FullFileRenderStrategy.maxSupportedLines * FullFileRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell * Float32Array.BYTES_PER_ELEMENT;
		this._cellBindBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco full file cell buffer',
			size: bufferSize,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		})).object;
		this._cellValueBuffers = [
			new ArrayBuffer(bufferSize),
			new ArrayBuffer(bufferSize),
		];

		const scrollOffsetBufferSize = 2;
		this._scrollOffsetBindBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco scroll offset buffer',
			size: scrollOffsetBufferSize * Float32Array.BYTES_PER_ELEMENT,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		})).object;
		this._scrollOffsetValueBuffer = new Float32Array(scrollOffsetBufferSize);
	}

	// #region Event handlers

	// The primary job of these handlers is to:
	// 1. Invalidate the up to date line cache, which will cause the line to be re-rendered when
	//    it's _within the viewport_.
	// 2. Pass relevant events on to the render function so it can force certain line ranges to be
	//    re-rendered even if they're not in the viewport. For example when a view zone is added,
	//    there are lines that used to be visible but are no longer, so those ranges must be
	//    cleared and uploaded to the GPU.

	public override onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean {
		this._invalidateAllLines();
		this._queueBufferUpdate(e);
		return true;
	}

	public override onDecorationsChanged(e: ViewDecorationsChangedEvent): boolean {
		this._invalidateAllLines();
		return true;
	}

	public override onTokensChanged(e: ViewTokensChangedEvent): boolean {
		// TODO: This currently fires for the entire viewport whenever scrolling stops
		//       https://github.com/microsoft/vscode/issues/233942
		for (const range of e.ranges) {
			this._invalidateLineRange(range.fromLineNumber, range.toLineNumber);
		}
		return true;
	}

	public override onLinesDeleted(e: ViewLinesDeletedEvent): boolean {
		// TODO: This currently invalidates everything after the deleted line, it could shift the
		//       line data up to retain some up to date lines
		// TODO: This does not invalidate lines that are no longer in the file
		this._invalidateLinesFrom(e.fromLineNumber);
		this._queueBufferUpdate(e);
		return true;
	}

	public override onLinesInserted(e: ViewLinesInsertedEvent): boolean {
		// TODO: This currently invalidates everything after the deleted line, it could shift the
		//       line data up to retain some up to date lines
		this._invalidateLinesFrom(e.fromLineNumber);
		return true;
	}

	public override onLinesChanged(e: ViewLinesChangedEvent): boolean {
		this._invalidateLineRange(e.fromLineNumber, e.fromLineNumber + e.count);
		return true;
	}

	public override onScrollChanged(e?: ViewScrollChangedEvent): boolean {
		const dpr = getActiveWindow().devicePixelRatio;
		this._scrollOffsetValueBuffer[0] = (e?.scrollLeft ?? this._context.viewLayout.getCurrentScrollLeft()) * dpr;
		this._scrollOffsetValueBuffer[1] = (e?.scrollTop ?? this._context.viewLayout.getCurrentScrollTop()) * dpr;
		this._device.queue.writeBuffer(this._scrollOffsetBindBuffer, 0, this._scrollOffsetValueBuffer as Float32Array<ArrayBuffer>);
		return true;
	}

	public override onThemeChanged(e: ViewThemeChangedEvent): boolean {
		this._invalidateAllLines();
		return true;
	}

	public override onLineMappingChanged(e: ViewLineMappingChangedEvent): boolean {
		this._invalidateAllLines();
		this._queueBufferUpdate(e);
		return true;
	}

	public override onZonesChanged(e: ViewZonesChangedEvent): boolean {
		this._invalidateAllLines();
		this._queueBufferUpdate(e);

		return true;
	}

	// #endregion

	private _invalidateAllLines(): void {
		this._upToDateLines[0].clear();
		this._upToDateLines[1].clear();
	}

	private _invalidateLinesFrom(lineNumber: number): void {
		for (const i of [0, 1]) {
			const upToDateLines = this._upToDateLines[i];
			for (const upToDateLine of upToDateLines) {
				if (upToDateLine >= lineNumber) {
					upToDateLines.delete(upToDateLine);
				}
			}
		}
	}

	private _invalidateLineRange(fromLineNumber: number, toLineNumber: number): void {
		for (let i = fromLineNumber; i <= toLineNumber; i++) {
			this._upToDateLines[0].delete(i);
			this._upToDateLines[1].delete(i);
		}
	}

	reset() {
		this._invalidateAllLines();
		for (const bufferIndex of [0, 1]) {
			// Zero out buffer and upload to GPU to prevent stale rows from rendering
			const buffer = new Float32Array(this._cellValueBuffers[bufferIndex]);
			buffer.fill(0, 0, buffer.length);
			this._device.queue.writeBuffer(this._cellBindBuffer, 0, buffer.buffer, 0, buffer.byteLength);
		}
		this._finalRenderedLine = 0;
	}

	update(viewportData: ViewportData, viewLineOptions: ViewLineOptions): number {
		// IMPORTANT: This is a hot function. Variables are pre-allocated and shared within the
		// loop. This is done so we don't need to trust the JIT compiler to do this optimization to
		// avoid potential additional blocking time in garbage collector which is a common cause of
		// dropped frames.

		let chars = '';
		let segment: string | undefined;
		let charWidth = 0;
		let y = 0;
		let x = 0;
		let absoluteOffsetX = 0;
		let absoluteOffsetY = 0;
		let tabXOffset = 0;
		let glyph: Readonly<ITextureAtlasPageGlyph>;
		let cellIndex = 0;

		let tokenStartIndex = 0;
		let tokenEndIndex = 0;
		let tokenMetadata = 0;

		let decorationStyleSetBold: boolean | undefined;
		let decorationStyleSetColor: number | undefined;
		let decorationStyleSetOpacity: number | undefined;

		let lineData: ViewLineRenderingData;
		let decoration: InlineDecoration;
		let fillStartIndex = 0;
		let fillEndIndex = 0;

		let tokens: IViewLineTokens;

		const dpr = getActiveWindow().devicePixelRatio;
		let contentSegmenter: IContentSegmenter;

		if (!this._scrollInitialized) {
			this.onScrollChanged();
			this._scrollInitialized = true;
		}

		// Update cell data
		const cellBuffer = new Float32Array(this._cellValueBuffers[this._activeDoubleBufferIndex]);
		const lineIndexCount = FullFileRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell;

		const upToDateLines = this._upToDateLines[this._activeDoubleBufferIndex];
		let dirtyLineStart = 3000;
		let dirtyLineEnd = 0;

		// Handle any queued buffer updates
		const queuedBufferUpdates = this._queuedBufferUpdates[this._activeDoubleBufferIndex];
		while (queuedBufferUpdates.length) {
			const e = queuedBufferUpdates.shift()!;
			switch (e.type) {
				// TODO: Refine these cases so we're not throwing away everything
				case ViewEventType.ViewConfigurationChanged:
				case ViewEventType.ViewLineMappingChanged:
				case ViewEventType.ViewZonesChanged: {
					cellBuffer.fill(0);

					dirtyLineStart = 1;
					dirtyLineEnd = Math.max(dirtyLineEnd, this._finalRenderedLine);
					this._finalRenderedLine = 0;
					break;
				}
				case ViewEventType.ViewLinesDeleted: {
					// Shift content below deleted line up
					const deletedLineContentStartIndex = (e.fromLineNumber - 1) * FullFileRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell;
					const deletedLineContentEndIndex = (e.toLineNumber) * FullFileRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell;
					const nullContentStartIndex = (this._finalRenderedLine - (e.toLineNumber - e.fromLineNumber + 1)) * FullFileRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell;
					cellBuffer.set(cellBuffer.subarray(deletedLineContentEndIndex), deletedLineContentStartIndex);

					// Zero out content on lines that are no longer valid
					cellBuffer.fill(0, nullContentStartIndex);

					// Update dirty lines and final rendered line
					dirtyLineStart = Math.min(dirtyLineStart, e.fromLineNumber);
					dirtyLineEnd = Math.max(dirtyLineEnd, this._finalRenderedLine);
					this._finalRenderedLine -= e.toLineNumber - e.fromLineNumber + 1;
					break;
				}
			}
		}

		for (y = viewportData.startLineNumber; y <= viewportData.endLineNumber; y++) {

			// Only attempt to render lines that the GPU renderer can handle
			if (!this._viewGpuContext.canRender(viewLineOptions, viewportData, y)) {
				fillStartIndex = ((y - 1) * FullFileRenderStrategy.maxSupportedColumns) * Constants.IndicesPerCell;
				fillEndIndex = (y * FullFileRenderStrategy.maxSupportedColumns) * Constants.IndicesPerCell;
				cellBuffer.fill(0, fillStartIndex, fillEndIndex);

				dirtyLineStart = Math.min(dirtyLineStart, y);
				dirtyLineEnd = Math.max(dirtyLineEnd, y);

				continue;
			}

			// Skip updating the line if it's already up to date
			if (upToDateLines.has(y)) {
				continue;
			}

			dirtyLineStart = Math.min(dirtyLineStart, y);
			dirtyLineEnd = Math.max(dirtyLineEnd, y);

			lineData = viewportData.getViewLineRenderingData(y);
			tabXOffset = 0;

			contentSegmenter = createContentSegmenter(lineData, viewLineOptions);
			charWidth = viewLineOptions.spaceWidth * dpr;
			absoluteOffsetX = 0;

			tokens = lineData.tokens;
			tokenStartIndex = lineData.minColumn - 1;
			tokenEndIndex = 0;
			for (let tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
				tokenEndIndex = tokens.getEndOffset(tokenIndex);
				if (tokenEndIndex <= tokenStartIndex) {
					// The faux indent part of the line should have no token type
					continue;
				}

				tokenMetadata = tokens.getMetadata(tokenIndex);

				for (x = tokenStartIndex; x < tokenEndIndex; x++) {
					// Only render lines that do not exceed maximum columns
					if (x > FullFileRenderStrategy.maxSupportedColumns) {
						break;
					}
					segment = contentSegmenter.getSegmentAtIndex(x);
					if (segment === undefined) {
						continue;
					}
					chars = segment;

					if (!(lineData.isBasicASCII && viewLineOptions.useMonospaceOptimizations)) {
						charWidth = this.glyphRasterizer.getTextMetrics(chars).width;
					}

					decorationStyleSetColor = undefined;
					decorationStyleSetBold = undefined;
					decorationStyleSetOpacity = undefined;

					// Apply supported inline decoration styles to the cell metadata
					for (decoration of lineData.inlineDecorations) {
						// This is Range.strictContainsPosition except it works at the cell level,
						// it's also inlined to avoid overhead.
						if (
							(y < decoration.range.startLineNumber || y > decoration.range.endLineNumber) ||
							(y === decoration.range.startLineNumber && x < decoration.range.startColumn - 1) ||
							(y === decoration.range.endLineNumber && x >= decoration.range.endColumn - 1)
						) {
							continue;
						}

						const rules = ViewGpuContext.decorationCssRuleExtractor.getStyleRules(this._viewGpuContext.canvas.domNode, decoration.inlineClassName);
						for (const rule of rules) {
							for (const r of rule.style) {
								const value = rule.styleMap.get(r)?.toString() ?? '';
								switch (r) {
									case 'color': {
										// TODO: This parsing and error handling should move into canRender so fallback
										//       to DOM works
										const parsedColor = Color.Format.CSS.parse(value);
										if (!parsedColor) {
											throw new BugIndicatingError('Invalid color format ' + value);
										}
										decorationStyleSetColor = parsedColor.toNumber32Bit();
										break;
									}
									case 'font-weight': {
										const parsedValue = parseCssFontWeight(value);
										if (parsedValue >= 400) {
											decorationStyleSetBold = true;
											// TODO: Set bold (https://github.com/microsoft/vscode/issues/237584)
										} else {
											decorationStyleSetBold = false;
											// TODO: Set normal (https://github.com/microsoft/vscode/issues/237584)
										}
										break;
									}
									case 'opacity': {
										const parsedValue = parseCssOpacity(value);
										decorationStyleSetOpacity = parsedValue;
										break;
									}
									default: throw new BugIndicatingError('Unexpected inline decoration style');
								}
							}
						}
					}

					if (chars === ' ' || chars === '\t') {
						// Zero out glyph to ensure it doesn't get rendered
						cellIndex = ((y - 1) * FullFileRenderStrategy.maxSupportedColumns + x) * Constants.IndicesPerCell;
						cellBuffer.fill(0, cellIndex, cellIndex + CellBufferInfo.FloatsPerEntry);
						// Adjust xOffset for tab stops
						if (chars === '\t') {
							// Find the pixel offset between the current position and the next tab stop
							const offsetBefore = x + tabXOffset;
							tabXOffset = CursorColumns.nextRenderTabStop(x + tabXOffset, lineData.tabSize);
							absoluteOffsetX += charWidth * (tabXOffset - offsetBefore);
							// Convert back to offset excluding x and the current character
							tabXOffset -= x + 1;
						} else {
							absoluteOffsetX += charWidth;
						}
						continue;
					}

					const decorationStyleSetId = ViewGpuContext.decorationStyleCache.getOrCreateEntry(decorationStyleSetColor, decorationStyleSetBold, decorationStyleSetOpacity);
					glyph = this._viewGpuContext.atlas.getGlyph(this.glyphRasterizer, chars, tokenMetadata, decorationStyleSetId, absoluteOffsetX);

					absoluteOffsetY = Math.round(
						// Top of layout box (includes line height)
						viewportData.relativeVerticalOffset[y - viewportData.startLineNumber] * dpr +

						// Delta from top of layout box (includes line height) to top of the inline box (no line height)
						Math.floor((viewportData.lineHeight * dpr - (glyph.fontBoundingBoxAscent + glyph.fontBoundingBoxDescent)) / 2) +

						// Delta from top of inline box (no line height) to top of glyph origin. If the glyph was drawn
						// with a top baseline for example, this ends up drawing the glyph correctly using the alphabetical
						// baseline.
						glyph.fontBoundingBoxAscent
					);

					cellIndex = ((y - 1) * FullFileRenderStrategy.maxSupportedColumns + x) * Constants.IndicesPerCell;
					cellBuffer[cellIndex + CellBufferInfo.Offset_X] = Math.floor(absoluteOffsetX);
					cellBuffer[cellIndex + CellBufferInfo.Offset_Y] = absoluteOffsetY;
					cellBuffer[cellIndex + CellBufferInfo.GlyphIndex] = glyph.glyphIndex;
					cellBuffer[cellIndex + CellBufferInfo.TextureIndex] = glyph.pageIndex;

					// Adjust the x pixel offset for the next character
					absoluteOffsetX += charWidth;
				}

				tokenStartIndex = tokenEndIndex;
			}

			// Clear to end of line
			fillStartIndex = ((y - 1) * FullFileRenderStrategy.maxSupportedColumns + tokenEndIndex) * Constants.IndicesPerCell;
			fillEndIndex = (y * FullFileRenderStrategy.maxSupportedColumns) * Constants.IndicesPerCell;
			cellBuffer.fill(0, fillStartIndex, fillEndIndex);

			upToDateLines.add(y);
		}

		const visibleObjectCount = (viewportData.endLineNumber - viewportData.startLineNumber + 1) * lineIndexCount;

		// Only write when there is changed data
		dirtyLineStart = Math.min(dirtyLineStart, FullFileRenderStrategy.maxSupportedLines);
		dirtyLineEnd = Math.min(dirtyLineEnd, FullFileRenderStrategy.maxSupportedLines);
		if (dirtyLineStart <= dirtyLineEnd) {
			// Write buffer and swap it out to unblock writes
			this._device.queue.writeBuffer(
				this._cellBindBuffer,
				(dirtyLineStart - 1) * lineIndexCount * Float32Array.BYTES_PER_ELEMENT,
				cellBuffer.buffer,
				(dirtyLineStart - 1) * lineIndexCount * Float32Array.BYTES_PER_ELEMENT,
				(dirtyLineEnd - dirtyLineStart + 1) * lineIndexCount * Float32Array.BYTES_PER_ELEMENT
			);
		}

		this._finalRenderedLine = Math.max(this._finalRenderedLine, dirtyLineEnd);

		this._activeDoubleBufferIndex = this._activeDoubleBufferIndex ? 0 : 1;

		this._visibleObjectCount = visibleObjectCount;

		return visibleObjectCount;
	}

	draw(pass: GPURenderPassEncoder, viewportData: ViewportData): void {
		if (this._visibleObjectCount <= 0) {
			throw new BugIndicatingError('Attempt to draw 0 objects');
		}
		pass.draw(
			quadVertices.length / 2,
			this._visibleObjectCount,
			undefined,
			(viewportData.startLineNumber - 1) * FullFileRenderStrategy.maxSupportedColumns
		);
	}

	/**
	 * Queue updates that need to happen on the active buffer, not just the cache. This will be
	 * deferred to when the actual cell buffer is changed since the active buffer could be locked by
	 * the GPU which would block the main thread.
	 */
	private _queueBufferUpdate(e: QueuedBufferEvent) {
		this._queuedBufferUpdates[0].push(e);
		this._queuedBufferUpdates[1].push(e);
	}
}

function parseCssFontWeight(value: string) {
	switch (value) {
		case 'lighter':
		case 'normal': return 400;
		case 'bolder':
		case 'bold': return 700;
	}
	return parseInt(value);
}

function parseCssOpacity(value: string): number {
	if (value.endsWith('%')) {
		return parseFloat(value.substring(0, value.length - 1)) / 100;
	}
	if (value.match(/^\d+(?:\.\d*)/)) {
		return parseFloat(value);
	}
	return 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/renderStrategy/fullFileRenderStrategy.wgsl.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/renderStrategy/fullFileRenderStrategy.wgsl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextureAtlas } from '../atlas/textureAtlas.js';
import { TextureAtlasPage } from '../atlas/textureAtlasPage.js';
import { BindingId } from '../gpu.js';

export const fullFileRenderStrategyWgsl = /*wgsl*/ `
struct GlyphInfo {
	position: vec2f,
	size: vec2f,
	origin: vec2f,
};

struct Vertex {
	@location(0) position: vec2f,
};

struct Cell {
	position: vec2f,
	unused1: vec2f,
	glyphIndex: f32,
	textureIndex: f32
};

struct LayoutInfo {
	canvasDims: vec2f,
	viewportOffset: vec2f,
	viewportDims: vec2f,
}

struct ScrollOffset {
	offset: vec2f
}

struct VSOutput {
	@builtin(position) position:   vec4f,
	@location(1)       layerIndex: f32,
	@location(0)       texcoord:   vec2f,
};

// Uniforms
@group(0) @binding(${BindingId.LayoutInfoUniform})       var<uniform>       layoutInfo:      LayoutInfo;
@group(0) @binding(${BindingId.AtlasDimensionsUniform})  var<uniform>       atlasDims:       vec2f;
@group(0) @binding(${BindingId.ScrollOffset})            var<uniform>       scrollOffset:    ScrollOffset;

// Storage buffers
@group(0) @binding(${BindingId.GlyphInfo})               var<storage, read> glyphInfo:       array<array<GlyphInfo, ${TextureAtlasPage.maximumGlyphCount}>, ${TextureAtlas.maximumPageCount}>;
@group(0) @binding(${BindingId.Cells})                   var<storage, read> cells:           array<Cell>;

@vertex fn vs(
	vert: Vertex,
	@builtin(instance_index) instanceIndex: u32,
	@builtin(vertex_index) vertexIndex : u32
) -> VSOutput {
	let cell = cells[instanceIndex];
	var glyph = glyphInfo[u32(cell.textureIndex)][u32(cell.glyphIndex)];

	var vsOut: VSOutput;
	// Multiple vert.position by 2,-2 to get it into clipspace which ranged from -1 to 1
	vsOut.position = vec4f(
		// Make everything relative to top left instead of center
		vec2f(-1, 1) +
		((vert.position * vec2f(2, -2)) / layoutInfo.canvasDims) * glyph.size +
		((cell.position * vec2f(2, -2)) / layoutInfo.canvasDims) +
		((glyph.origin * vec2f(2, -2)) / layoutInfo.canvasDims) +
		(((layoutInfo.viewportOffset - scrollOffset.offset * vec2(1, -1)) * 2) / layoutInfo.canvasDims),
		0.0,
		1.0
	);

	vsOut.layerIndex = cell.textureIndex;
	// Textures are flipped from natural direction on the y-axis, so flip it back
	vsOut.texcoord = vert.position;
	vsOut.texcoord = (
		// Glyph offset (0-1)
		(glyph.position / atlasDims) +
		// Glyph coordinate (0-1)
		(vsOut.texcoord * (glyph.size / atlasDims))
	);

	return vsOut;
}

@group(0) @binding(${BindingId.TextureSampler}) var ourSampler: sampler;
@group(0) @binding(${BindingId.Texture})        var ourTexture: texture_2d_array<f32>;

@fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
	return textureSample(ourTexture, ourSampler, vsOut.texcoord, u32(vsOut.layerIndex));
}
`;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/gpu/renderStrategy/viewportRenderStrategy.ts]---
Location: vscode-main/src/vs/editor/browser/gpu/renderStrategy/viewportRenderStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';
import type { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { type ViewConfigurationChangedEvent, type ViewDecorationsChangedEvent, type ViewLineMappingChangedEvent, type ViewLinesChangedEvent, type ViewLinesDeletedEvent, type ViewLinesInsertedEvent, type ViewScrollChangedEvent, type ViewThemeChangedEvent, type ViewTokensChangedEvent, type ViewZonesChangedEvent } from '../../../common/viewEvents.js';
import type { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import type { ViewLineRenderingData } from '../../../common/viewModel.js';
import { InlineDecoration } from '../../../common/viewModel/inlineDecorations.js';
import type { ViewContext } from '../../../common/viewModel/viewContext.js';
import type { ViewLineOptions } from '../../viewParts/viewLines/viewLineOptions.js';
import type { ITextureAtlasPageGlyph } from '../atlas/atlas.js';
import { createContentSegmenter, type IContentSegmenter } from '../contentSegmenter.js';
import { BindingId } from '../gpu.js';
import { GPULifecycle } from '../gpuDisposable.js';
import { quadVertices } from '../gpuUtils.js';
import { GlyphRasterizer } from '../raster/glyphRasterizer.js';
import { ViewGpuContext } from '../viewGpuContext.js';
import { BaseRenderStrategy } from './baseRenderStrategy.js';
import { fullFileRenderStrategyWgsl } from './fullFileRenderStrategy.wgsl.js';

const enum Constants {
	IndicesPerCell = 6,
	CellBindBufferCapacityIncrement = 32,
	CellBindBufferInitialCapacity = 63, // Will be rounded up to nearest increment
}

const enum CellBufferInfo {
	FloatsPerEntry = 6,
	BytesPerEntry = CellBufferInfo.FloatsPerEntry * 4,
	Offset_X = 0,
	Offset_Y = 1,
	Offset_Unused1 = 2,
	Offset_Unused2 = 3,
	GlyphIndex = 4,
	TextureIndex = 5,
}

/**
 * A render strategy that uploads the content of the entire viewport every frame.
 */
export class ViewportRenderStrategy extends BaseRenderStrategy {
	/**
	 * The hard cap for line columns that can be rendered by the GPU renderer.
	 */
	static readonly maxSupportedColumns = 2000;

	readonly type = 'viewport';
	readonly wgsl: string = fullFileRenderStrategyWgsl;

	private _cellBindBufferLineCapacity = Constants.CellBindBufferInitialCapacity;
	private _cellBindBuffer!: GPUBuffer;

	/**
	 * The cell value buffers, these hold the cells and their glyphs. It's double buffers such that
	 * the thread doesn't block when one is being uploaded to the GPU.
	 */
	private _cellValueBuffers!: [ArrayBuffer, ArrayBuffer];
	private _activeDoubleBufferIndex: 0 | 1 = 0;

	private _visibleObjectCount: number = 0;

	private _scrollOffsetBindBuffer: GPUBuffer;
	private _scrollOffsetValueBuffer: Float32Array;
	private _scrollInitialized: boolean = false;

	get bindGroupEntries(): GPUBindGroupEntry[] {
		return [
			{ binding: BindingId.Cells, resource: { buffer: this._cellBindBuffer } },
			{ binding: BindingId.ScrollOffset, resource: { buffer: this._scrollOffsetBindBuffer } }
		];
	}

	private readonly _onDidChangeBindGroupEntries = this._register(new Emitter<void>());
	readonly onDidChangeBindGroupEntries = this._onDidChangeBindGroupEntries.event;

	constructor(
		context: ViewContext,
		viewGpuContext: ViewGpuContext,
		device: GPUDevice,
		glyphRasterizer: { value: GlyphRasterizer },
	) {
		super(context, viewGpuContext, device, glyphRasterizer);

		this._rebuildCellBuffer(this._cellBindBufferLineCapacity);

		const scrollOffsetBufferSize = 2;
		this._scrollOffsetBindBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco scroll offset buffer',
			size: scrollOffsetBufferSize * Float32Array.BYTES_PER_ELEMENT,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		})).object;
		this._scrollOffsetValueBuffer = new Float32Array(scrollOffsetBufferSize);
	}

	private _rebuildCellBuffer(lineCount: number) {
		this._cellBindBuffer?.destroy();

		// Increase in chunks so resizing a window by hand doesn't keep allocating and throwing away
		const lineCountWithIncrement = (Math.floor(lineCount / Constants.CellBindBufferCapacityIncrement) + 1) * Constants.CellBindBufferCapacityIncrement;

		const bufferSize = lineCountWithIncrement * ViewportRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell * Float32Array.BYTES_PER_ELEMENT;
		this._cellBindBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco full file cell buffer',
			size: bufferSize,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		})).object;
		this._cellValueBuffers = [
			new ArrayBuffer(bufferSize),
			new ArrayBuffer(bufferSize),
		];
		this._cellBindBufferLineCapacity = lineCountWithIncrement;

		this._onDidChangeBindGroupEntries.fire();
	}

	// #region Event handlers

	// The primary job of these handlers is to:
	// 1. Invalidate the up to date line cache, which will cause the line to be re-rendered when
	//    it's _within the viewport_.
	// 2. Pass relevant events on to the render function so it can force certain line ranges to be
	//    re-rendered even if they're not in the viewport. For example when a view zone is added,
	//    there are lines that used to be visible but are no longer, so those ranges must be
	//    cleared and uploaded to the GPU.

	public override onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean {
		return true;
	}

	public override onDecorationsChanged(e: ViewDecorationsChangedEvent): boolean {
		return true;
	}

	public override onTokensChanged(e: ViewTokensChangedEvent): boolean {
		return true;
	}

	public override onLinesDeleted(e: ViewLinesDeletedEvent): boolean {
		return true;
	}

	public override onLinesInserted(e: ViewLinesInsertedEvent): boolean {
		return true;
	}

	public override onLinesChanged(e: ViewLinesChangedEvent): boolean {
		return true;
	}

	public override onScrollChanged(e?: ViewScrollChangedEvent): boolean {
		const dpr = getActiveWindow().devicePixelRatio;
		this._scrollOffsetValueBuffer[0] = (e?.scrollLeft ?? this._context.viewLayout.getCurrentScrollLeft()) * dpr;
		this._scrollOffsetValueBuffer[1] = (e?.scrollTop ?? this._context.viewLayout.getCurrentScrollTop()) * dpr;
		this._device.queue.writeBuffer(this._scrollOffsetBindBuffer, 0, this._scrollOffsetValueBuffer as Float32Array<ArrayBuffer>);
		return true;
	}

	public override onThemeChanged(e: ViewThemeChangedEvent): boolean {
		return true;
	}

	public override onLineMappingChanged(e: ViewLineMappingChangedEvent): boolean {
		return true;
	}

	public override onZonesChanged(e: ViewZonesChangedEvent): boolean {
		return true;
	}

	// #endregion

	reset() {
		for (const bufferIndex of [0, 1]) {
			// Zero out buffer and upload to GPU to prevent stale rows from rendering
			const buffer = new Float32Array(this._cellValueBuffers[bufferIndex]);
			buffer.fill(0, 0, buffer.length);
			this._device.queue.writeBuffer(this._cellBindBuffer, 0, buffer.buffer, 0, buffer.byteLength);
		}
	}

	update(viewportData: ViewportData, viewLineOptions: ViewLineOptions): number {
		// IMPORTANT: This is a hot function. Variables are pre-allocated and shared within the
		// loop. This is done so we don't need to trust the JIT compiler to do this optimization to
		// avoid potential additional blocking time in garbage collector which is a common cause of
		// dropped frames.

		let chars = '';
		let segment: string | undefined;
		let charWidth = 0;
		let y = 0;
		let x = 0;
		let absoluteOffsetX = 0;
		let absoluteOffsetY = 0;
		let tabXOffset = 0;
		let glyph: Readonly<ITextureAtlasPageGlyph>;
		let cellIndex = 0;

		let tokenStartIndex = 0;
		let tokenEndIndex = 0;
		let tokenMetadata = 0;

		let decorationStyleSetBold: boolean | undefined;
		let decorationStyleSetColor: number | undefined;
		let decorationStyleSetOpacity: number | undefined;

		let lineData: ViewLineRenderingData;
		let decoration: InlineDecoration;
		let fillStartIndex = 0;
		let fillEndIndex = 0;

		let tokens: IViewLineTokens;

		const dpr = getActiveWindow().devicePixelRatio;
		let contentSegmenter: IContentSegmenter;

		if (!this._scrollInitialized) {
			this.onScrollChanged();
			this._scrollInitialized = true;
		}

		// Zero out cell buffer or rebuild if needed
		if (this._cellBindBufferLineCapacity < viewportData.endLineNumber - viewportData.startLineNumber + 1) {
			this._rebuildCellBuffer(viewportData.endLineNumber - viewportData.startLineNumber + 1);
		}
		const cellBuffer = new Float32Array(this._cellValueBuffers[this._activeDoubleBufferIndex]);
		cellBuffer.fill(0);

		const lineIndexCount = ViewportRenderStrategy.maxSupportedColumns * Constants.IndicesPerCell;

		for (y = viewportData.startLineNumber; y <= viewportData.endLineNumber; y++) {

			// Only attempt to render lines that the GPU renderer can handle
			if (!this._viewGpuContext.canRender(viewLineOptions, viewportData, y)) {
				continue;
			}

			lineData = viewportData.getViewLineRenderingData(y);
			tabXOffset = 0;

			contentSegmenter = createContentSegmenter(lineData, viewLineOptions);
			charWidth = viewLineOptions.spaceWidth * dpr;
			absoluteOffsetX = 0;

			tokens = lineData.tokens;
			tokenStartIndex = lineData.minColumn - 1;
			tokenEndIndex = 0;
			for (let tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
				tokenEndIndex = tokens.getEndOffset(tokenIndex);
				if (tokenEndIndex <= tokenStartIndex) {
					// The faux indent part of the line should have no token type
					continue;
				}

				tokenMetadata = tokens.getMetadata(tokenIndex);

				for (x = tokenStartIndex; x < tokenEndIndex; x++) {
					// Only render lines that do not exceed maximum columns
					if (x > ViewportRenderStrategy.maxSupportedColumns) {
						break;
					}
					segment = contentSegmenter.getSegmentAtIndex(x);
					if (segment === undefined) {
						continue;
					}
					chars = segment;

					if (!(lineData.isBasicASCII && viewLineOptions.useMonospaceOptimizations)) {
						charWidth = this.glyphRasterizer.getTextMetrics(chars).width;
					}

					decorationStyleSetColor = undefined;
					decorationStyleSetBold = undefined;
					decorationStyleSetOpacity = undefined;

					// Apply supported inline decoration styles to the cell metadata
					for (decoration of lineData.inlineDecorations) {
						// This is Range.strictContainsPosition except it works at the cell level,
						// it's also inlined to avoid overhead.
						if (
							(y < decoration.range.startLineNumber || y > decoration.range.endLineNumber) ||
							(y === decoration.range.startLineNumber && x < decoration.range.startColumn - 1) ||
							(y === decoration.range.endLineNumber && x >= decoration.range.endColumn - 1)
						) {
							continue;
						}

						const rules = ViewGpuContext.decorationCssRuleExtractor.getStyleRules(this._viewGpuContext.canvas.domNode, decoration.inlineClassName);
						for (const rule of rules) {
							for (const r of rule.style) {
								const value = rule.styleMap.get(r)?.toString() ?? '';
								switch (r) {
									case 'color': {
										// TODO: This parsing and error handling should move into canRender so fallback
										//       to DOM works
										const parsedColor = Color.Format.CSS.parse(value);
										if (!parsedColor) {
											throw new BugIndicatingError('Invalid color format ' + value);
										}
										decorationStyleSetColor = parsedColor.toNumber32Bit();
										break;
									}
									case 'font-weight': {
										const parsedValue = parseCssFontWeight(value);
										if (parsedValue >= 400) {
											decorationStyleSetBold = true;
											// TODO: Set bold (https://github.com/microsoft/vscode/issues/237584)
										} else {
											decorationStyleSetBold = false;
											// TODO: Set normal (https://github.com/microsoft/vscode/issues/237584)
										}
										break;
									}
									case 'opacity': {
										const parsedValue = parseCssOpacity(value);
										decorationStyleSetOpacity = parsedValue;
										break;
									}
									default: throw new BugIndicatingError('Unexpected inline decoration style');
								}
							}
						}
					}

					if (chars === ' ' || chars === '\t') {
						// Zero out glyph to ensure it doesn't get rendered
						cellIndex = ((y - 1) * ViewportRenderStrategy.maxSupportedColumns + x) * Constants.IndicesPerCell;
						cellBuffer.fill(0, cellIndex, cellIndex + CellBufferInfo.FloatsPerEntry);
						// Adjust xOffset for tab stops
						if (chars === '\t') {
							// Find the pixel offset between the current position and the next tab stop
							const offsetBefore = x + tabXOffset;
							tabXOffset = CursorColumns.nextRenderTabStop(x + tabXOffset, lineData.tabSize);
							absoluteOffsetX += charWidth * (tabXOffset - offsetBefore);
							// Convert back to offset excluding x and the current character
							tabXOffset -= x + 1;
						} else {
							absoluteOffsetX += charWidth;
						}
						continue;
					}

					const decorationStyleSetId = ViewGpuContext.decorationStyleCache.getOrCreateEntry(decorationStyleSetColor, decorationStyleSetBold, decorationStyleSetOpacity);
					glyph = this._viewGpuContext.atlas.getGlyph(this.glyphRasterizer, chars, tokenMetadata, decorationStyleSetId, absoluteOffsetX);

					absoluteOffsetY = Math.round(
						// Top of layout box (includes line height)
						viewportData.relativeVerticalOffset[y - viewportData.startLineNumber] * dpr +

						// Delta from top of layout box (includes line height) to top of the inline box (no line height)
						Math.floor((viewportData.lineHeight * dpr - (glyph.fontBoundingBoxAscent + glyph.fontBoundingBoxDescent)) / 2) +

						// Delta from top of inline box (no line height) to top of glyph origin. If the glyph was drawn
						// with a top baseline for example, this ends up drawing the glyph correctly using the alphabetical
						// baseline.
						glyph.fontBoundingBoxAscent
					);

					cellIndex = ((y - viewportData.startLineNumber) * ViewportRenderStrategy.maxSupportedColumns + x) * Constants.IndicesPerCell;
					cellBuffer[cellIndex + CellBufferInfo.Offset_X] = Math.floor(absoluteOffsetX);
					cellBuffer[cellIndex + CellBufferInfo.Offset_Y] = absoluteOffsetY;
					cellBuffer[cellIndex + CellBufferInfo.GlyphIndex] = glyph.glyphIndex;
					cellBuffer[cellIndex + CellBufferInfo.TextureIndex] = glyph.pageIndex;

					// Adjust the x pixel offset for the next character
					absoluteOffsetX += charWidth;
				}

				tokenStartIndex = tokenEndIndex;
			}

			// Clear to end of line
			fillStartIndex = ((y - viewportData.startLineNumber) * ViewportRenderStrategy.maxSupportedColumns + tokenEndIndex) * Constants.IndicesPerCell;
			fillEndIndex = ((y - viewportData.startLineNumber) * ViewportRenderStrategy.maxSupportedColumns) * Constants.IndicesPerCell;
			cellBuffer.fill(0, fillStartIndex, fillEndIndex);
		}

		const visibleObjectCount = (viewportData.endLineNumber - viewportData.startLineNumber + 1) * lineIndexCount;

		// This render strategy always uploads the whole viewport
		this._device.queue.writeBuffer(
			this._cellBindBuffer,
			0,
			cellBuffer.buffer,
			0,
			(viewportData.endLineNumber - viewportData.startLineNumber) * lineIndexCount * Float32Array.BYTES_PER_ELEMENT
		);

		this._activeDoubleBufferIndex = this._activeDoubleBufferIndex ? 0 : 1;

		this._visibleObjectCount = visibleObjectCount;

		return visibleObjectCount;
	}

	draw(pass: GPURenderPassEncoder, viewportData: ViewportData): void {
		if (this._visibleObjectCount <= 0) {
			throw new BugIndicatingError('Attempt to draw 0 objects');
		}
		pass.draw(quadVertices.length / 2, this._visibleObjectCount);
	}
}

function parseCssFontWeight(value: string) {
	switch (value) {
		case 'lighter':
		case 'normal': return 400;
		case 'bolder':
		case 'bold': return 700;
	}
	return parseInt(value);
}

function parseCssOpacity(value: string): number {
	if (value.endsWith('%')) {
		return parseFloat(value.substring(0, value.length - 1)) / 100;
	}
	if (value.match(/^\d+(?:\.\d*)/)) {
		return parseFloat(value);
	}
	return 1;
}
```

--------------------------------------------------------------------------------

````

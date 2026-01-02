---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 175
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 175 of 552)

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

---[FILE: src/vs/base/common/keyCodes.ts]---
Location: vscode-main/src/vs/base/common/keyCodes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Virtual Key Codes, the value does not hold any inherent meaning.
 * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
 * But these are "more general", as they should work across browsers & OS`s.
 */
export const enum KeyCode {
	DependsOnKbLayout = -1,

	/**
	 * Placed first to cover the 0 value of the enum.
	 */
	Unknown = 0,

	Backspace,
	Tab,
	Enter,
	Shift,
	Ctrl,
	Alt,
	PauseBreak,
	CapsLock,
	Escape,
	Space,
	PageUp,
	PageDown,
	End,
	Home,
	LeftArrow,
	UpArrow,
	RightArrow,
	DownArrow,
	Insert,
	Delete,

	Digit0,
	Digit1,
	Digit2,
	Digit3,
	Digit4,
	Digit5,
	Digit6,
	Digit7,
	Digit8,
	Digit9,

	KeyA,
	KeyB,
	KeyC,
	KeyD,
	KeyE,
	KeyF,
	KeyG,
	KeyH,
	KeyI,
	KeyJ,
	KeyK,
	KeyL,
	KeyM,
	KeyN,
	KeyO,
	KeyP,
	KeyQ,
	KeyR,
	KeyS,
	KeyT,
	KeyU,
	KeyV,
	KeyW,
	KeyX,
	KeyY,
	KeyZ,

	Meta,
	ContextMenu,

	F1,
	F2,
	F3,
	F4,
	F5,
	F6,
	F7,
	F8,
	F9,
	F10,
	F11,
	F12,
	F13,
	F14,
	F15,
	F16,
	F17,
	F18,
	F19,
	F20,
	F21,
	F22,
	F23,
	F24,

	NumLock,
	ScrollLock,

	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ';:' key
	 */
	Semicolon,
	/**
	 * For any country/region, the '+' key
	 * For the US standard keyboard, the '=+' key
	 */
	Equal,
	/**
	 * For any country/region, the ',' key
	 * For the US standard keyboard, the ',<' key
	 */
	Comma,
	/**
	 * For any country/region, the '-' key
	 * For the US standard keyboard, the '-_' key
	 */
	Minus,
	/**
	 * For any country/region, the '.' key
	 * For the US standard keyboard, the '.>' key
	 */
	Period,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '/?' key
	 */
	Slash,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '`~' key
	 */
	Backquote,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '[{' key
	 */
	BracketLeft,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '\|' key
	 */
	Backslash,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ']}' key
	 */
	BracketRight,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ''"' key
	 */
	Quote,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 */
	OEM_8,
	/**
	 * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
	 */
	IntlBackslash,

	Numpad0, // VK_NUMPAD0, 0x60, Numeric keypad 0 key
	Numpad1, // VK_NUMPAD1, 0x61, Numeric keypad 1 key
	Numpad2, // VK_NUMPAD2, 0x62, Numeric keypad 2 key
	Numpad3, // VK_NUMPAD3, 0x63, Numeric keypad 3 key
	Numpad4, // VK_NUMPAD4, 0x64, Numeric keypad 4 key
	Numpad5, // VK_NUMPAD5, 0x65, Numeric keypad 5 key
	Numpad6, // VK_NUMPAD6, 0x66, Numeric keypad 6 key
	Numpad7, // VK_NUMPAD7, 0x67, Numeric keypad 7 key
	Numpad8, // VK_NUMPAD8, 0x68, Numeric keypad 8 key
	Numpad9, // VK_NUMPAD9, 0x69, Numeric keypad 9 key

	NumpadMultiply,	// VK_MULTIPLY, 0x6A, Multiply key
	NumpadAdd,		// VK_ADD, 0x6B, Add key
	NUMPAD_SEPARATOR,	// VK_SEPARATOR, 0x6C, Separator key
	NumpadSubtract,	// VK_SUBTRACT, 0x6D, Subtract key
	NumpadDecimal,	// VK_DECIMAL, 0x6E, Decimal key
	NumpadDivide,	// VK_DIVIDE, 0x6F,

	/**
	 * Cover all key codes when IME is processing input.
	 */
	KEY_IN_COMPOSITION,

	ABNT_C1, // Brazilian (ABNT) Keyboard
	ABNT_C2, // Brazilian (ABNT) Keyboard

	AudioVolumeMute,
	AudioVolumeUp,
	AudioVolumeDown,

	BrowserSearch,
	BrowserHome,
	BrowserBack,
	BrowserForward,

	MediaTrackNext,
	MediaTrackPrevious,
	MediaStop,
	MediaPlayPause,
	LaunchMediaPlayer,
	LaunchMail,
	LaunchApp2,

	/**
	 * VK_CLEAR, 0x0C, CLEAR key
	 */
	Clear,

	/**
	 * Placed last to cover the length of the enum.
	 * Please do not depend on this value!
	 */
	MAX_VALUE
}

/**
 * keyboardEvent.code
 */
export const enum ScanCode {
	DependsOnKbLayout = -1,
	None,
	Hyper,
	Super,
	Fn,
	FnLock,
	Suspend,
	Resume,
	Turbo,
	Sleep,
	WakeUp,
	KeyA,
	KeyB,
	KeyC,
	KeyD,
	KeyE,
	KeyF,
	KeyG,
	KeyH,
	KeyI,
	KeyJ,
	KeyK,
	KeyL,
	KeyM,
	KeyN,
	KeyO,
	KeyP,
	KeyQ,
	KeyR,
	KeyS,
	KeyT,
	KeyU,
	KeyV,
	KeyW,
	KeyX,
	KeyY,
	KeyZ,
	Digit1,
	Digit2,
	Digit3,
	Digit4,
	Digit5,
	Digit6,
	Digit7,
	Digit8,
	Digit9,
	Digit0,
	Enter,
	Escape,
	Backspace,
	Tab,
	Space,
	Minus,
	Equal,
	BracketLeft,
	BracketRight,
	Backslash,
	IntlHash,
	Semicolon,
	Quote,
	Backquote,
	Comma,
	Period,
	Slash,
	CapsLock,
	F1,
	F2,
	F3,
	F4,
	F5,
	F6,
	F7,
	F8,
	F9,
	F10,
	F11,
	F12,
	PrintScreen,
	ScrollLock,
	Pause,
	Insert,
	Home,
	PageUp,
	Delete,
	End,
	PageDown,
	ArrowRight,
	ArrowLeft,
	ArrowDown,
	ArrowUp,
	NumLock,
	NumpadDivide,
	NumpadMultiply,
	NumpadSubtract,
	NumpadAdd,
	NumpadEnter,
	Numpad1,
	Numpad2,
	Numpad3,
	Numpad4,
	Numpad5,
	Numpad6,
	Numpad7,
	Numpad8,
	Numpad9,
	Numpad0,
	NumpadDecimal,
	IntlBackslash,
	ContextMenu,
	Power,
	NumpadEqual,
	F13,
	F14,
	F15,
	F16,
	F17,
	F18,
	F19,
	F20,
	F21,
	F22,
	F23,
	F24,
	Open,
	Help,
	Select,
	Again,
	Undo,
	Cut,
	Copy,
	Paste,
	Find,
	AudioVolumeMute,
	AudioVolumeUp,
	AudioVolumeDown,
	NumpadComma,
	IntlRo,
	KanaMode,
	IntlYen,
	Convert,
	NonConvert,
	Lang1,
	Lang2,
	Lang3,
	Lang4,
	Lang5,
	Abort,
	Props,
	NumpadParenLeft,
	NumpadParenRight,
	NumpadBackspace,
	NumpadMemoryStore,
	NumpadMemoryRecall,
	NumpadMemoryClear,
	NumpadMemoryAdd,
	NumpadMemorySubtract,
	NumpadClear,
	NumpadClearEntry,
	ControlLeft,
	ShiftLeft,
	AltLeft,
	MetaLeft,
	ControlRight,
	ShiftRight,
	AltRight,
	MetaRight,
	BrightnessUp,
	BrightnessDown,
	MediaPlay,
	MediaRecord,
	MediaFastForward,
	MediaRewind,
	MediaTrackNext,
	MediaTrackPrevious,
	MediaStop,
	Eject,
	MediaPlayPause,
	MediaSelect,
	LaunchMail,
	LaunchApp2,
	LaunchApp1,
	SelectTask,
	LaunchScreenSaver,
	BrowserSearch,
	BrowserHome,
	BrowserBack,
	BrowserForward,
	BrowserStop,
	BrowserRefresh,
	BrowserFavorites,
	ZoomToggle,
	MailReply,
	MailForward,
	MailSend,

	MAX_VALUE
}

class KeyCodeStrMap {

	public _keyCodeToStr: string[];
	public _strToKeyCode: { [str: string]: KeyCode };

	constructor() {
		this._keyCodeToStr = [];
		this._strToKeyCode = Object.create(null);
	}

	define(keyCode: KeyCode, str: string): void {
		this._keyCodeToStr[keyCode] = str;
		this._strToKeyCode[str.toLowerCase()] = keyCode;
	}

	keyCodeToStr(keyCode: KeyCode): string {
		return this._keyCodeToStr[keyCode];
	}

	strToKeyCode(str: string): KeyCode {
		return this._strToKeyCode[str.toLowerCase()] || KeyCode.Unknown;
	}
}

const uiMap = new KeyCodeStrMap();
const userSettingsUSMap = new KeyCodeStrMap();
const userSettingsGeneralMap = new KeyCodeStrMap();
export const EVENT_KEY_CODE_MAP: { [keyCode: number]: KeyCode } = new Array(230);
export const NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE: { [nativeKeyCode: string]: KeyCode } = {};
const scanCodeIntToStr: string[] = [];
const scanCodeStrToInt: { [code: string]: number } = Object.create(null);
const scanCodeLowerCaseStrToInt: { [code: string]: number } = Object.create(null);

export const ScanCodeUtils = {
	lowerCaseToEnum: (scanCode: string) => scanCodeLowerCaseStrToInt[scanCode] || ScanCode.None,
	toEnum: (scanCode: string) => scanCodeStrToInt[scanCode] || ScanCode.None,
	toString: (scanCode: ScanCode) => scanCodeIntToStr[scanCode] || 'None'
};

/**
 * -1 if a ScanCode => KeyCode mapping depends on kb layout.
 */
export const IMMUTABLE_CODE_TO_KEY_CODE: KeyCode[] = [];

/**
 * -1 if a KeyCode => ScanCode mapping depends on kb layout.
 */
export const IMMUTABLE_KEY_CODE_TO_CODE: ScanCode[] = [];

for (let i = 0; i <= ScanCode.MAX_VALUE; i++) {
	IMMUTABLE_CODE_TO_KEY_CODE[i] = KeyCode.DependsOnKbLayout;
}

for (let i = 0; i <= KeyCode.MAX_VALUE; i++) {
	IMMUTABLE_KEY_CODE_TO_CODE[i] = ScanCode.DependsOnKbLayout;
}

(function () {

	// See https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
	// See https://github.com/microsoft/node-native-keymap/blob/88c0b0e5/deps/chromium/keyboard_codes_win.h

	const empty = '';
	type IMappingEntry = [0 | 1, ScanCode, string, KeyCode, string, number, string, string, string];
	const mappings: IMappingEntry[] = [
		// immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel
		[1, ScanCode.None, 'None', KeyCode.Unknown, 'unknown', 0, 'VK_UNKNOWN', empty, empty],
		[1, ScanCode.Hyper, 'Hyper', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Super, 'Super', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Fn, 'Fn', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.FnLock, 'FnLock', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Suspend, 'Suspend', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Resume, 'Resume', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Turbo, 'Turbo', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Sleep, 'Sleep', KeyCode.Unknown, empty, 0, 'VK_SLEEP', empty, empty],
		[1, ScanCode.WakeUp, 'WakeUp', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[0, ScanCode.KeyA, 'KeyA', KeyCode.KeyA, 'A', 65, 'VK_A', empty, empty],
		[0, ScanCode.KeyB, 'KeyB', KeyCode.KeyB, 'B', 66, 'VK_B', empty, empty],
		[0, ScanCode.KeyC, 'KeyC', KeyCode.KeyC, 'C', 67, 'VK_C', empty, empty],
		[0, ScanCode.KeyD, 'KeyD', KeyCode.KeyD, 'D', 68, 'VK_D', empty, empty],
		[0, ScanCode.KeyE, 'KeyE', KeyCode.KeyE, 'E', 69, 'VK_E', empty, empty],
		[0, ScanCode.KeyF, 'KeyF', KeyCode.KeyF, 'F', 70, 'VK_F', empty, empty],
		[0, ScanCode.KeyG, 'KeyG', KeyCode.KeyG, 'G', 71, 'VK_G', empty, empty],
		[0, ScanCode.KeyH, 'KeyH', KeyCode.KeyH, 'H', 72, 'VK_H', empty, empty],
		[0, ScanCode.KeyI, 'KeyI', KeyCode.KeyI, 'I', 73, 'VK_I', empty, empty],
		[0, ScanCode.KeyJ, 'KeyJ', KeyCode.KeyJ, 'J', 74, 'VK_J', empty, empty],
		[0, ScanCode.KeyK, 'KeyK', KeyCode.KeyK, 'K', 75, 'VK_K', empty, empty],
		[0, ScanCode.KeyL, 'KeyL', KeyCode.KeyL, 'L', 76, 'VK_L', empty, empty],
		[0, ScanCode.KeyM, 'KeyM', KeyCode.KeyM, 'M', 77, 'VK_M', empty, empty],
		[0, ScanCode.KeyN, 'KeyN', KeyCode.KeyN, 'N', 78, 'VK_N', empty, empty],
		[0, ScanCode.KeyO, 'KeyO', KeyCode.KeyO, 'O', 79, 'VK_O', empty, empty],
		[0, ScanCode.KeyP, 'KeyP', KeyCode.KeyP, 'P', 80, 'VK_P', empty, empty],
		[0, ScanCode.KeyQ, 'KeyQ', KeyCode.KeyQ, 'Q', 81, 'VK_Q', empty, empty],
		[0, ScanCode.KeyR, 'KeyR', KeyCode.KeyR, 'R', 82, 'VK_R', empty, empty],
		[0, ScanCode.KeyS, 'KeyS', KeyCode.KeyS, 'S', 83, 'VK_S', empty, empty],
		[0, ScanCode.KeyT, 'KeyT', KeyCode.KeyT, 'T', 84, 'VK_T', empty, empty],
		[0, ScanCode.KeyU, 'KeyU', KeyCode.KeyU, 'U', 85, 'VK_U', empty, empty],
		[0, ScanCode.KeyV, 'KeyV', KeyCode.KeyV, 'V', 86, 'VK_V', empty, empty],
		[0, ScanCode.KeyW, 'KeyW', KeyCode.KeyW, 'W', 87, 'VK_W', empty, empty],
		[0, ScanCode.KeyX, 'KeyX', KeyCode.KeyX, 'X', 88, 'VK_X', empty, empty],
		[0, ScanCode.KeyY, 'KeyY', KeyCode.KeyY, 'Y', 89, 'VK_Y', empty, empty],
		[0, ScanCode.KeyZ, 'KeyZ', KeyCode.KeyZ, 'Z', 90, 'VK_Z', empty, empty],
		[0, ScanCode.Digit1, 'Digit1', KeyCode.Digit1, '1', 49, 'VK_1', empty, empty],
		[0, ScanCode.Digit2, 'Digit2', KeyCode.Digit2, '2', 50, 'VK_2', empty, empty],
		[0, ScanCode.Digit3, 'Digit3', KeyCode.Digit3, '3', 51, 'VK_3', empty, empty],
		[0, ScanCode.Digit4, 'Digit4', KeyCode.Digit4, '4', 52, 'VK_4', empty, empty],
		[0, ScanCode.Digit5, 'Digit5', KeyCode.Digit5, '5', 53, 'VK_5', empty, empty],
		[0, ScanCode.Digit6, 'Digit6', KeyCode.Digit6, '6', 54, 'VK_6', empty, empty],
		[0, ScanCode.Digit7, 'Digit7', KeyCode.Digit7, '7', 55, 'VK_7', empty, empty],
		[0, ScanCode.Digit8, 'Digit8', KeyCode.Digit8, '8', 56, 'VK_8', empty, empty],
		[0, ScanCode.Digit9, 'Digit9', KeyCode.Digit9, '9', 57, 'VK_9', empty, empty],
		[0, ScanCode.Digit0, 'Digit0', KeyCode.Digit0, '0', 48, 'VK_0', empty, empty],
		[1, ScanCode.Enter, 'Enter', KeyCode.Enter, 'Enter', 13, 'VK_RETURN', empty, empty],
		[1, ScanCode.Escape, 'Escape', KeyCode.Escape, 'Escape', 27, 'VK_ESCAPE', empty, empty],
		[1, ScanCode.Backspace, 'Backspace', KeyCode.Backspace, 'Backspace', 8, 'VK_BACK', empty, empty],
		[1, ScanCode.Tab, 'Tab', KeyCode.Tab, 'Tab', 9, 'VK_TAB', empty, empty],
		[1, ScanCode.Space, 'Space', KeyCode.Space, 'Space', 32, 'VK_SPACE', empty, empty],
		[0, ScanCode.Minus, 'Minus', KeyCode.Minus, '-', 189, 'VK_OEM_MINUS', '-', 'OEM_MINUS'],
		[0, ScanCode.Equal, 'Equal', KeyCode.Equal, '=', 187, 'VK_OEM_PLUS', '=', 'OEM_PLUS'],
		[0, ScanCode.BracketLeft, 'BracketLeft', KeyCode.BracketLeft, '[', 219, 'VK_OEM_4', '[', 'OEM_4'],
		[0, ScanCode.BracketRight, 'BracketRight', KeyCode.BracketRight, ']', 221, 'VK_OEM_6', ']', 'OEM_6'],
		[0, ScanCode.Backslash, 'Backslash', KeyCode.Backslash, '\\', 220, 'VK_OEM_5', '\\', 'OEM_5'],
		[0, ScanCode.IntlHash, 'IntlHash', KeyCode.Unknown, empty, 0, empty, empty, empty], // has been dropped from the w3c spec
		[0, ScanCode.Semicolon, 'Semicolon', KeyCode.Semicolon, ';', 186, 'VK_OEM_1', ';', 'OEM_1'],
		[0, ScanCode.Quote, 'Quote', KeyCode.Quote, '\'', 222, 'VK_OEM_7', '\'', 'OEM_7'],
		[0, ScanCode.Backquote, 'Backquote', KeyCode.Backquote, '`', 192, 'VK_OEM_3', '`', 'OEM_3'],
		[0, ScanCode.Comma, 'Comma', KeyCode.Comma, ',', 188, 'VK_OEM_COMMA', ',', 'OEM_COMMA'],
		[0, ScanCode.Period, 'Period', KeyCode.Period, '.', 190, 'VK_OEM_PERIOD', '.', 'OEM_PERIOD'],
		[0, ScanCode.Slash, 'Slash', KeyCode.Slash, '/', 191, 'VK_OEM_2', '/', 'OEM_2'],
		[1, ScanCode.CapsLock, 'CapsLock', KeyCode.CapsLock, 'CapsLock', 20, 'VK_CAPITAL', empty, empty],
		[1, ScanCode.F1, 'F1', KeyCode.F1, 'F1', 112, 'VK_F1', empty, empty],
		[1, ScanCode.F2, 'F2', KeyCode.F2, 'F2', 113, 'VK_F2', empty, empty],
		[1, ScanCode.F3, 'F3', KeyCode.F3, 'F3', 114, 'VK_F3', empty, empty],
		[1, ScanCode.F4, 'F4', KeyCode.F4, 'F4', 115, 'VK_F4', empty, empty],
		[1, ScanCode.F5, 'F5', KeyCode.F5, 'F5', 116, 'VK_F5', empty, empty],
		[1, ScanCode.F6, 'F6', KeyCode.F6, 'F6', 117, 'VK_F6', empty, empty],
		[1, ScanCode.F7, 'F7', KeyCode.F7, 'F7', 118, 'VK_F7', empty, empty],
		[1, ScanCode.F8, 'F8', KeyCode.F8, 'F8', 119, 'VK_F8', empty, empty],
		[1, ScanCode.F9, 'F9', KeyCode.F9, 'F9', 120, 'VK_F9', empty, empty],
		[1, ScanCode.F10, 'F10', KeyCode.F10, 'F10', 121, 'VK_F10', empty, empty],
		[1, ScanCode.F11, 'F11', KeyCode.F11, 'F11', 122, 'VK_F11', empty, empty],
		[1, ScanCode.F12, 'F12', KeyCode.F12, 'F12', 123, 'VK_F12', empty, empty],
		[1, ScanCode.PrintScreen, 'PrintScreen', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.ScrollLock, 'ScrollLock', KeyCode.ScrollLock, 'ScrollLock', 145, 'VK_SCROLL', empty, empty],
		[1, ScanCode.Pause, 'Pause', KeyCode.PauseBreak, 'PauseBreak', 19, 'VK_PAUSE', empty, empty],
		[1, ScanCode.Insert, 'Insert', KeyCode.Insert, 'Insert', 45, 'VK_INSERT', empty, empty],
		[1, ScanCode.Home, 'Home', KeyCode.Home, 'Home', 36, 'VK_HOME', empty, empty],
		[1, ScanCode.PageUp, 'PageUp', KeyCode.PageUp, 'PageUp', 33, 'VK_PRIOR', empty, empty],
		[1, ScanCode.Delete, 'Delete', KeyCode.Delete, 'Delete', 46, 'VK_DELETE', empty, empty],
		[1, ScanCode.End, 'End', KeyCode.End, 'End', 35, 'VK_END', empty, empty],
		[1, ScanCode.PageDown, 'PageDown', KeyCode.PageDown, 'PageDown', 34, 'VK_NEXT', empty, empty],
		[1, ScanCode.ArrowRight, 'ArrowRight', KeyCode.RightArrow, 'RightArrow', 39, 'VK_RIGHT', 'Right', empty],
		[1, ScanCode.ArrowLeft, 'ArrowLeft', KeyCode.LeftArrow, 'LeftArrow', 37, 'VK_LEFT', 'Left', empty],
		[1, ScanCode.ArrowDown, 'ArrowDown', KeyCode.DownArrow, 'DownArrow', 40, 'VK_DOWN', 'Down', empty],
		[1, ScanCode.ArrowUp, 'ArrowUp', KeyCode.UpArrow, 'UpArrow', 38, 'VK_UP', 'Up', empty],
		[1, ScanCode.NumLock, 'NumLock', KeyCode.NumLock, 'NumLock', 144, 'VK_NUMLOCK', empty, empty],
		[1, ScanCode.NumpadDivide, 'NumpadDivide', KeyCode.NumpadDivide, 'NumPad_Divide', 111, 'VK_DIVIDE', empty, empty],
		[1, ScanCode.NumpadMultiply, 'NumpadMultiply', KeyCode.NumpadMultiply, 'NumPad_Multiply', 106, 'VK_MULTIPLY', empty, empty],
		[1, ScanCode.NumpadSubtract, 'NumpadSubtract', KeyCode.NumpadSubtract, 'NumPad_Subtract', 109, 'VK_SUBTRACT', empty, empty],
		[1, ScanCode.NumpadAdd, 'NumpadAdd', KeyCode.NumpadAdd, 'NumPad_Add', 107, 'VK_ADD', empty, empty],
		[1, ScanCode.NumpadEnter, 'NumpadEnter', KeyCode.Enter, empty, 0, empty, empty, empty],
		[1, ScanCode.Numpad1, 'Numpad1', KeyCode.Numpad1, 'NumPad1', 97, 'VK_NUMPAD1', empty, empty],
		[1, ScanCode.Numpad2, 'Numpad2', KeyCode.Numpad2, 'NumPad2', 98, 'VK_NUMPAD2', empty, empty],
		[1, ScanCode.Numpad3, 'Numpad3', KeyCode.Numpad3, 'NumPad3', 99, 'VK_NUMPAD3', empty, empty],
		[1, ScanCode.Numpad4, 'Numpad4', KeyCode.Numpad4, 'NumPad4', 100, 'VK_NUMPAD4', empty, empty],
		[1, ScanCode.Numpad5, 'Numpad5', KeyCode.Numpad5, 'NumPad5', 101, 'VK_NUMPAD5', empty, empty],
		[1, ScanCode.Numpad6, 'Numpad6', KeyCode.Numpad6, 'NumPad6', 102, 'VK_NUMPAD6', empty, empty],
		[1, ScanCode.Numpad7, 'Numpad7', KeyCode.Numpad7, 'NumPad7', 103, 'VK_NUMPAD7', empty, empty],
		[1, ScanCode.Numpad8, 'Numpad8', KeyCode.Numpad8, 'NumPad8', 104, 'VK_NUMPAD8', empty, empty],
		[1, ScanCode.Numpad9, 'Numpad9', KeyCode.Numpad9, 'NumPad9', 105, 'VK_NUMPAD9', empty, empty],
		[1, ScanCode.Numpad0, 'Numpad0', KeyCode.Numpad0, 'NumPad0', 96, 'VK_NUMPAD0', empty, empty],
		[1, ScanCode.NumpadDecimal, 'NumpadDecimal', KeyCode.NumpadDecimal, 'NumPad_Decimal', 110, 'VK_DECIMAL', empty, empty],
		[0, ScanCode.IntlBackslash, 'IntlBackslash', KeyCode.IntlBackslash, 'OEM_102', 226, 'VK_OEM_102', empty, empty],
		[1, ScanCode.ContextMenu, 'ContextMenu', KeyCode.ContextMenu, 'ContextMenu', 93, empty, empty, empty],
		[1, ScanCode.Power, 'Power', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadEqual, 'NumpadEqual', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.F13, 'F13', KeyCode.F13, 'F13', 124, 'VK_F13', empty, empty],
		[1, ScanCode.F14, 'F14', KeyCode.F14, 'F14', 125, 'VK_F14', empty, empty],
		[1, ScanCode.F15, 'F15', KeyCode.F15, 'F15', 126, 'VK_F15', empty, empty],
		[1, ScanCode.F16, 'F16', KeyCode.F16, 'F16', 127, 'VK_F16', empty, empty],
		[1, ScanCode.F17, 'F17', KeyCode.F17, 'F17', 128, 'VK_F17', empty, empty],
		[1, ScanCode.F18, 'F18', KeyCode.F18, 'F18', 129, 'VK_F18', empty, empty],
		[1, ScanCode.F19, 'F19', KeyCode.F19, 'F19', 130, 'VK_F19', empty, empty],
		[1, ScanCode.F20, 'F20', KeyCode.F20, 'F20', 131, 'VK_F20', empty, empty],
		[1, ScanCode.F21, 'F21', KeyCode.F21, 'F21', 132, 'VK_F21', empty, empty],
		[1, ScanCode.F22, 'F22', KeyCode.F22, 'F22', 133, 'VK_F22', empty, empty],
		[1, ScanCode.F23, 'F23', KeyCode.F23, 'F23', 134, 'VK_F23', empty, empty],
		[1, ScanCode.F24, 'F24', KeyCode.F24, 'F24', 135, 'VK_F24', empty, empty],
		[1, ScanCode.Open, 'Open', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Help, 'Help', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Select, 'Select', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Again, 'Again', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Undo, 'Undo', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Cut, 'Cut', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Copy, 'Copy', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Paste, 'Paste', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Find, 'Find', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.AudioVolumeMute, 'AudioVolumeMute', KeyCode.AudioVolumeMute, 'AudioVolumeMute', 173, 'VK_VOLUME_MUTE', empty, empty],
		[1, ScanCode.AudioVolumeUp, 'AudioVolumeUp', KeyCode.AudioVolumeUp, 'AudioVolumeUp', 175, 'VK_VOLUME_UP', empty, empty],
		[1, ScanCode.AudioVolumeDown, 'AudioVolumeDown', KeyCode.AudioVolumeDown, 'AudioVolumeDown', 174, 'VK_VOLUME_DOWN', empty, empty],
		[1, ScanCode.NumpadComma, 'NumpadComma', KeyCode.NUMPAD_SEPARATOR, 'NumPad_Separator', 108, 'VK_SEPARATOR', empty, empty],
		[0, ScanCode.IntlRo, 'IntlRo', KeyCode.ABNT_C1, 'ABNT_C1', 193, 'VK_ABNT_C1', empty, empty],
		[1, ScanCode.KanaMode, 'KanaMode', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[0, ScanCode.IntlYen, 'IntlYen', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Convert, 'Convert', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NonConvert, 'NonConvert', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Lang1, 'Lang1', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Lang2, 'Lang2', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Lang3, 'Lang3', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Lang4, 'Lang4', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Lang5, 'Lang5', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Abort, 'Abort', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.Props, 'Props', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadParenLeft, 'NumpadParenLeft', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadParenRight, 'NumpadParenRight', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadBackspace, 'NumpadBackspace', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadMemoryStore, 'NumpadMemoryStore', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadMemoryRecall, 'NumpadMemoryRecall', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadMemoryClear, 'NumpadMemoryClear', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadMemoryAdd, 'NumpadMemoryAdd', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadMemorySubtract, 'NumpadMemorySubtract', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.NumpadClear, 'NumpadClear', KeyCode.Clear, 'Clear', 12, 'VK_CLEAR', empty, empty],
		[1, ScanCode.NumpadClearEntry, 'NumpadClearEntry', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.None, empty, KeyCode.Ctrl, 'Ctrl', 17, 'VK_CONTROL', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Shift, 'Shift', 16, 'VK_SHIFT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Alt, 'Alt', 18, 'VK_MENU', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Meta, 'Meta', 91, 'VK_COMMAND', empty, empty],
		[1, ScanCode.ControlLeft, 'ControlLeft', KeyCode.Ctrl, empty, 0, 'VK_LCONTROL', empty, empty],
		[1, ScanCode.ShiftLeft, 'ShiftLeft', KeyCode.Shift, empty, 0, 'VK_LSHIFT', empty, empty],
		[1, ScanCode.AltLeft, 'AltLeft', KeyCode.Alt, empty, 0, 'VK_LMENU', empty, empty],
		[1, ScanCode.MetaLeft, 'MetaLeft', KeyCode.Meta, empty, 0, 'VK_LWIN', empty, empty],
		[1, ScanCode.ControlRight, 'ControlRight', KeyCode.Ctrl, empty, 0, 'VK_RCONTROL', empty, empty],
		[1, ScanCode.ShiftRight, 'ShiftRight', KeyCode.Shift, empty, 0, 'VK_RSHIFT', empty, empty],
		[1, ScanCode.AltRight, 'AltRight', KeyCode.Alt, empty, 0, 'VK_RMENU', empty, empty],
		[1, ScanCode.MetaRight, 'MetaRight', KeyCode.Meta, empty, 0, 'VK_RWIN', empty, empty],
		[1, ScanCode.BrightnessUp, 'BrightnessUp', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.BrightnessDown, 'BrightnessDown', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaPlay, 'MediaPlay', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaRecord, 'MediaRecord', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaFastForward, 'MediaFastForward', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaRewind, 'MediaRewind', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaTrackNext, 'MediaTrackNext', KeyCode.MediaTrackNext, 'MediaTrackNext', 176, 'VK_MEDIA_NEXT_TRACK', empty, empty],
		[1, ScanCode.MediaTrackPrevious, 'MediaTrackPrevious', KeyCode.MediaTrackPrevious, 'MediaTrackPrevious', 177, 'VK_MEDIA_PREV_TRACK', empty, empty],
		[1, ScanCode.MediaStop, 'MediaStop', KeyCode.MediaStop, 'MediaStop', 178, 'VK_MEDIA_STOP', empty, empty],
		[1, ScanCode.Eject, 'Eject', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MediaPlayPause, 'MediaPlayPause', KeyCode.MediaPlayPause, 'MediaPlayPause', 179, 'VK_MEDIA_PLAY_PAUSE', empty, empty],
		[1, ScanCode.MediaSelect, 'MediaSelect', KeyCode.LaunchMediaPlayer, 'LaunchMediaPlayer', 181, 'VK_MEDIA_LAUNCH_MEDIA_SELECT', empty, empty],
		[1, ScanCode.LaunchMail, 'LaunchMail', KeyCode.LaunchMail, 'LaunchMail', 180, 'VK_MEDIA_LAUNCH_MAIL', empty, empty],
		[1, ScanCode.LaunchApp2, 'LaunchApp2', KeyCode.LaunchApp2, 'LaunchApp2', 183, 'VK_MEDIA_LAUNCH_APP2', empty, empty],
		[1, ScanCode.LaunchApp1, 'LaunchApp1', KeyCode.Unknown, empty, 0, 'VK_MEDIA_LAUNCH_APP1', empty, empty],
		[1, ScanCode.SelectTask, 'SelectTask', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.LaunchScreenSaver, 'LaunchScreenSaver', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.BrowserSearch, 'BrowserSearch', KeyCode.BrowserSearch, 'BrowserSearch', 170, 'VK_BROWSER_SEARCH', empty, empty],
		[1, ScanCode.BrowserHome, 'BrowserHome', KeyCode.BrowserHome, 'BrowserHome', 172, 'VK_BROWSER_HOME', empty, empty],
		[1, ScanCode.BrowserBack, 'BrowserBack', KeyCode.BrowserBack, 'BrowserBack', 166, 'VK_BROWSER_BACK', empty, empty],
		[1, ScanCode.BrowserForward, 'BrowserForward', KeyCode.BrowserForward, 'BrowserForward', 167, 'VK_BROWSER_FORWARD', empty, empty],
		[1, ScanCode.BrowserStop, 'BrowserStop', KeyCode.Unknown, empty, 0, 'VK_BROWSER_STOP', empty, empty],
		[1, ScanCode.BrowserRefresh, 'BrowserRefresh', KeyCode.Unknown, empty, 0, 'VK_BROWSER_REFRESH', empty, empty],
		[1, ScanCode.BrowserFavorites, 'BrowserFavorites', KeyCode.Unknown, empty, 0, 'VK_BROWSER_FAVORITES', empty, empty],
		[1, ScanCode.ZoomToggle, 'ZoomToggle', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MailReply, 'MailReply', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MailForward, 'MailForward', KeyCode.Unknown, empty, 0, empty, empty, empty],
		[1, ScanCode.MailSend, 'MailSend', KeyCode.Unknown, empty, 0, empty, empty, empty],

		// See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
		// If an Input Method Editor is processing key input and the event is keydown, return 229.
		[1, ScanCode.None, empty, KeyCode.KEY_IN_COMPOSITION, 'KeyInComposition', 229, empty, empty, empty],
		[1, ScanCode.None, empty, KeyCode.ABNT_C2, 'ABNT_C2', 194, 'VK_ABNT_C2', empty, empty],
		[1, ScanCode.None, empty, KeyCode.OEM_8, 'OEM_8', 223, 'VK_OEM_8', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_KANA', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_HANGUL', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_JUNJA', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_FINAL', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_HANJA', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_KANJI', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_CONVERT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_NONCONVERT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_ACCEPT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_MODECHANGE', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_SELECT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_PRINT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_EXECUTE', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_SNAPSHOT', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_HELP', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_APPS', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_PROCESSKEY', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_PACKET', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_DBE_SBCSCHAR', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_DBE_DBCSCHAR', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_ATTN', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_CRSEL', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_EXSEL', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_EREOF', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_PLAY', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_ZOOM', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_NONAME', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_PA1', empty, empty],
		[1, ScanCode.None, empty, KeyCode.Unknown, empty, 0, 'VK_OEM_CLEAR', empty, empty],
	];

	const seenKeyCode: boolean[] = [];
	const seenScanCode: boolean[] = [];
	for (const mapping of mappings) {
		const [immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel] = mapping;
		if (!seenScanCode[scanCode]) {
			seenScanCode[scanCode] = true;
			scanCodeIntToStr[scanCode] = scanCodeStr;
			scanCodeStrToInt[scanCodeStr] = scanCode;
			scanCodeLowerCaseStrToInt[scanCodeStr.toLowerCase()] = scanCode;
			if (immutable) {
				IMMUTABLE_CODE_TO_KEY_CODE[scanCode] = keyCode;
				if ((keyCode !== KeyCode.Unknown) && (keyCode !== KeyCode.Enter) && !isModifierKey(keyCode)) {
					IMMUTABLE_KEY_CODE_TO_CODE[keyCode] = scanCode;
				}
			}
		}
		if (!seenKeyCode[keyCode]) {
			seenKeyCode[keyCode] = true;
			if (!keyCodeStr) {
				throw new Error(`String representation missing for key code ${keyCode} around scan code ${scanCodeStr}`);
			}
			uiMap.define(keyCode, keyCodeStr);
			userSettingsUSMap.define(keyCode, usUserSettingsLabel || keyCodeStr);
			userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel || usUserSettingsLabel || keyCodeStr);
		}
		if (eventKeyCode) {
			EVENT_KEY_CODE_MAP[eventKeyCode] = keyCode;
		}
		if (vkey) {
			NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[vkey] = keyCode;
		}
	}
	// Manually added due to the exclusion above (due to duplication with NumpadEnter)
	IMMUTABLE_KEY_CODE_TO_CODE[KeyCode.Enter] = ScanCode.Enter;

})();

export namespace KeyCodeUtils {
	export function toString(keyCode: KeyCode): string {
		return uiMap.keyCodeToStr(keyCode);
	}
	export function fromString(key: string): KeyCode {
		return uiMap.strToKeyCode(key);
	}

	export function toUserSettingsUS(keyCode: KeyCode): string {
		return userSettingsUSMap.keyCodeToStr(keyCode);
	}
	export function toUserSettingsGeneral(keyCode: KeyCode): string {
		return userSettingsGeneralMap.keyCodeToStr(keyCode);
	}
	export function fromUserSettings(key: string): KeyCode {
		return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
	}

	export function toElectronAccelerator(keyCode: KeyCode): string | null {
		if (keyCode >= KeyCode.Numpad0 && keyCode <= KeyCode.NumpadDivide) {
			// [Electron Accelerators] Electron is able to parse numpad keys, but unfortunately it
			// renders them just as regular keys in menus. For example, num0 is rendered as "0",
			// numdiv is rendered as "/", numsub is rendered as "-".
			//
			// This can lead to incredible confusion, as it makes numpad based keybindings indistinguishable
			// from keybindings based on regular keys.
			//
			// We therefore need to fall back to custom rendering for numpad keys.
			return null;
		}

		switch (keyCode) {
			case KeyCode.UpArrow:
				return 'Up';
			case KeyCode.DownArrow:
				return 'Down';
			case KeyCode.LeftArrow:
				return 'Left';
			case KeyCode.RightArrow:
				return 'Right';
		}

		return uiMap.keyCodeToStr(keyCode);
	}
}

export const enum KeyMod {
	CtrlCmd = (1 << 11) >>> 0,
	Shift = (1 << 10) >>> 0,
	Alt = (1 << 9) >>> 0,
	WinCtrl = (1 << 8) >>> 0,
}

export function KeyChord(firstPart: number, secondPart: number): number {
	const chordPart = ((secondPart & 0x0000FFFF) << 16) >>> 0;
	return (firstPart | chordPart) >>> 0;
}

export function isModifierKey(keyCode: KeyCode): boolean {
	return (
		keyCode === KeyCode.Ctrl
		|| keyCode === KeyCode.Shift
		|| keyCode === KeyCode.Alt
		|| keyCode === KeyCode.Meta
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/labels.ts]---
Location: vscode-main/src/vs/base/common/labels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hasDriveLetter, toSlashes } from './extpath.js';
import { posix, sep, win32 } from './path.js';
import { isMacintosh, isWindows, OperatingSystem, OS } from './platform.js';
import { extUri, extUriIgnorePathCase } from './resources.js';
import { rtrim, startsWithIgnoreCase } from './strings.js';
import { URI } from './uri.js';

export interface IPathLabelFormatting {

	/**
	 * The OS the path label is from to produce a label
	 * that matches OS expectations.
	 */
	readonly os: OperatingSystem;

	/**
	 * Whether to add a `~` when the path is in the
	 * user home directory.
	 *
	 * Note: this only applies to Linux, macOS but not
	 * Windows.
	 */
	readonly tildify?: IUserHomeProvider;

	/**
	 * Whether to convert to a relative path if the path
	 * is within any of the opened workspace folders.
	 */
	readonly relative?: IRelativePathProvider;
}

export interface IRelativePathProvider {

	/**
	 * Whether to not add a prefix when in multi-root workspace.
	 */
	readonly noPrefix?: boolean;

	getWorkspace(): { folders: { uri: URI; name?: string }[] };
	getWorkspaceFolder(resource: URI): { uri: URI; name?: string } | null;
}

export interface IUserHomeProvider {
	userHome: URI;
}

export function getPathLabel(resource: URI, formatting: IPathLabelFormatting): string {
	const { os, tildify: tildifier, relative: relatifier } = formatting;

	// return early with a relative path if we can resolve one
	if (relatifier) {
		const relativePath = getRelativePathLabel(resource, relatifier, os);
		if (typeof relativePath === 'string') {
			return relativePath;
		}
	}

	// otherwise try to resolve a absolute path label and
	// apply target OS standard path separators if target
	// OS differs from actual OS we are running in
	let absolutePath = resource.fsPath;
	if (os === OperatingSystem.Windows && !isWindows) {
		absolutePath = absolutePath.replace(/\//g, '\\');
	} else if (os !== OperatingSystem.Windows && isWindows) {
		absolutePath = absolutePath.replace(/\\/g, '/');
	}

	// macOS/Linux: tildify with provided user home directory
	if (os !== OperatingSystem.Windows && tildifier?.userHome) {
		const userHome = tildifier.userHome.fsPath;

		// This is a bit of a hack, but in order to figure out if the
		// resource is in the user home, we need to make sure to convert it
		// to a user home resource. We cannot assume that the resource is
		// already a user home resource.
		let userHomeCandidate: string;
		if (resource.scheme !== tildifier.userHome.scheme && resource.path[0] === posix.sep && resource.path[1] !== posix.sep) {
			userHomeCandidate = tildifier.userHome.with({ path: resource.path }).fsPath;
		} else {
			userHomeCandidate = absolutePath;
		}

		absolutePath = tildify(userHomeCandidate, userHome, os);
	}

	// normalize
	const pathLib = os === OperatingSystem.Windows ? win32 : posix;
	return pathLib.normalize(normalizeDriveLetter(absolutePath, os === OperatingSystem.Windows));
}

function getRelativePathLabel(resource: URI, relativePathProvider: IRelativePathProvider, os: OperatingSystem): string | undefined {
	const pathLib = os === OperatingSystem.Windows ? win32 : posix;
	const extUriLib = os === OperatingSystem.Linux ? extUri : extUriIgnorePathCase;

	const workspace = relativePathProvider.getWorkspace();
	const firstFolder = workspace.folders.at(0);
	if (!firstFolder) {
		return undefined;
	}

	// This is a bit of a hack, but in order to figure out the folder
	// the resource belongs to, we need to make sure to convert it
	// to a workspace resource. We cannot assume that the resource is
	// already matching the workspace.
	if (resource.scheme !== firstFolder.uri.scheme && resource.path[0] === posix.sep && resource.path[1] !== posix.sep) {
		resource = firstFolder.uri.with({ path: resource.path });
	}

	const folder = relativePathProvider.getWorkspaceFolder(resource);
	if (!folder) {
		return undefined;
	}

	let relativePathLabel: string | undefined = undefined;
	if (extUriLib.isEqual(folder.uri, resource)) {
		relativePathLabel = ''; // no label if paths are identical
	} else {
		relativePathLabel = extUriLib.relativePath(folder.uri, resource) ?? '';
	}

	// normalize
	if (relativePathLabel) {
		relativePathLabel = pathLib.normalize(relativePathLabel);
	}

	// always show root basename if there are multiple folders
	if (workspace.folders.length > 1 && !relativePathProvider.noPrefix) {
		const rootName = folder.name ? folder.name : extUriLib.basenameOrAuthority(folder.uri);
		relativePathLabel = relativePathLabel ? `${rootName} • ${relativePathLabel}` : rootName;
	}

	return relativePathLabel;
}

export function normalizeDriveLetter(path: string, isWindowsOS: boolean = isWindows): string {
	if (hasDriveLetter(path, isWindowsOS)) {
		return path.charAt(0).toUpperCase() + path.slice(1);
	}

	return path;
}

let normalizedUserHomeCached: { original: string; normalized: string } = Object.create(null);
export function tildify(path: string, userHome: string, os = OS): string {
	if (os === OperatingSystem.Windows || !path || !userHome) {
		return path; // unsupported on Windows
	}

	let normalizedUserHome = normalizedUserHomeCached.original === userHome ? normalizedUserHomeCached.normalized : undefined;
	if (!normalizedUserHome) {
		normalizedUserHome = userHome;
		if (isWindows) {
			normalizedUserHome = toSlashes(normalizedUserHome); // make sure that the path is POSIX normalized on Windows
		}
		normalizedUserHome = `${rtrim(normalizedUserHome, posix.sep)}${posix.sep}`;
		normalizedUserHomeCached = { original: userHome, normalized: normalizedUserHome };
	}

	let normalizedPath = path;
	if (isWindows) {
		normalizedPath = toSlashes(normalizedPath); // make sure that the path is POSIX normalized on Windows
	}

	// Linux: case sensitive, macOS: case insensitive
	if (os === OperatingSystem.Linux ? normalizedPath.startsWith(normalizedUserHome) : startsWithIgnoreCase(normalizedPath, normalizedUserHome)) {
		return `~/${normalizedPath.substr(normalizedUserHome.length)}`;
	}

	return path;
}

export function untildify(path: string, userHome: string): string {
	return path.replace(/^~($|\/|\\)/, `${userHome}$1`);
}

/**
 * Shortens the paths but keeps them easy to distinguish.
 * Replaces not important parts with ellipsis.
 * Every shorten path matches only one original path and vice versa.
 *
 * Algorithm for shortening paths is as follows:
 * 1. For every path in list, find unique substring of that path.
 * 2. Unique substring along with ellipsis is shortened path of that path.
 * 3. To find unique substring of path, consider every segment of length from 1 to path.length of path from end of string
 *    and if present segment is not substring to any other paths then present segment is unique path,
 *    else check if it is not present as suffix of any other path and present segment is suffix of path itself,
 *    if it is true take present segment as unique path.
 * 4. Apply ellipsis to unique segment according to whether segment is present at start/in-between/end of path.
 *
 * Example 1
 * 1. consider 2 paths i.e. ['a\\b\\c\\d', 'a\\f\\b\\c\\d']
 * 2. find unique path of first path,
 * 	a. 'd' is present in path2 and is suffix of path2, hence not unique of present path.
 * 	b. 'c' is present in path2 and 'c' is not suffix of present path, similarly for 'b' and 'a' also.
 * 	c. 'd\\c' is suffix of path2.
 *  d. 'b\\c' is not suffix of present path.
 *  e. 'a\\b' is not present in path2, hence unique path is 'a\\b...'.
 * 3. for path2, 'f' is not present in path1 hence unique is '...\\f\\...'.
 *
 * Example 2
 * 1. consider 2 paths i.e. ['a\\b', 'a\\b\\c'].
 * 	a. Even if 'b' is present in path2, as 'b' is suffix of path1 and is not suffix of path2, unique path will be '...\\b'.
 * 2. for path2, 'c' is not present in path1 hence unique path is '..\\c'.
 */
const ellipsis = '\u2026';
const unc = '\\\\';
const home = '~';
export function shorten(paths: string[], pathSeparator: string = sep): string[] {
	const shortenedPaths: string[] = new Array(paths.length);

	// for every path
	let match = false;
	for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
		const originalPath = paths[pathIndex];

		if (originalPath === '') {
			shortenedPaths[pathIndex] = `.${pathSeparator}`;
			continue;
		}

		if (!originalPath) {
			shortenedPaths[pathIndex] = originalPath;
			continue;
		}

		match = true;

		// trim for now and concatenate unc path (e.g. \\network) or root path (/etc, ~/etc) later
		let prefix = '';
		let trimmedPath = originalPath;
		if (trimmedPath.indexOf(unc) === 0) {
			prefix = trimmedPath.substr(0, trimmedPath.indexOf(unc) + unc.length);
			trimmedPath = trimmedPath.substr(trimmedPath.indexOf(unc) + unc.length);
		} else if (trimmedPath.indexOf(pathSeparator) === 0) {
			prefix = trimmedPath.substr(0, trimmedPath.indexOf(pathSeparator) + pathSeparator.length);
			trimmedPath = trimmedPath.substr(trimmedPath.indexOf(pathSeparator) + pathSeparator.length);
		} else if (trimmedPath.indexOf(home) === 0) {
			prefix = trimmedPath.substr(0, trimmedPath.indexOf(home) + home.length);
			trimmedPath = trimmedPath.substr(trimmedPath.indexOf(home) + home.length);
		}

		// pick the first shortest subpath found
		const segments: string[] = trimmedPath.split(pathSeparator);
		for (let subpathLength = 1; match && subpathLength <= segments.length; subpathLength++) {
			for (let start = segments.length - subpathLength; match && start >= 0; start--) {
				match = false;
				let subpath = segments.slice(start, start + subpathLength).join(pathSeparator);

				// that is unique to any other path
				for (let otherPathIndex = 0; !match && otherPathIndex < paths.length; otherPathIndex++) {

					// suffix subpath treated specially as we consider no match 'x' and 'x/...'
					if (otherPathIndex !== pathIndex && paths[otherPathIndex] && paths[otherPathIndex].indexOf(subpath) > -1) {
						const isSubpathEnding: boolean = (start + subpathLength === segments.length);

						// Adding separator as prefix for subpath, such that 'endsWith(src, trgt)' considers subpath as directory name instead of plain string.
						// prefix is not added when either subpath is root directory or path[otherPathIndex] does not have multiple directories.
						const subpathWithSep: string = (start > 0 && paths[otherPathIndex].indexOf(pathSeparator) > -1) ? pathSeparator + subpath : subpath;
						const isOtherPathEnding: boolean = paths[otherPathIndex].endsWith(subpathWithSep);

						match = !isSubpathEnding || isOtherPathEnding;
					}
				}

				// found unique subpath
				if (!match) {
					let result = '';

					// preserve disk drive or root prefix
					if (segments[0].endsWith(':') || prefix !== '') {
						if (start === 1) {
							// extend subpath to include disk drive prefix
							start = 0;
							subpathLength++;
							subpath = segments[0] + pathSeparator + subpath;
						}

						if (start > 0) {
							result = segments[0] + pathSeparator;
						}

						result = prefix + result;
					}

					// add ellipsis at the beginning if needed
					if (start > 0) {
						result = result + ellipsis + pathSeparator;
					}

					result = result + subpath;

					// add ellipsis at the end if needed
					if (start + subpathLength < segments.length) {
						result = result + pathSeparator + ellipsis;
					}

					shortenedPaths[pathIndex] = result;
				}
			}
		}

		if (match) {
			shortenedPaths[pathIndex] = originalPath; // use original path if no unique subpaths found
		}
	}

	return shortenedPaths;
}

export interface ISeparator {
	label: string;
}

enum Type {
	TEXT,
	VARIABLE,
	SEPARATOR
}

interface ISegment {
	value: string;
	type: Type;
}

/**
 * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
 * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
 * @param value string to which template is applied
 * @param values the values of the templates to use
 */
export function template(template: string, values: { [key: string]: string | ISeparator | undefined | null } = Object.create(null)): string {
	const segments: ISegment[] = [];

	let inVariable = false;
	let curVal = '';
	for (const char of template) {
		// Beginning of variable
		if (char === '$' || (inVariable && char === '{')) {
			if (curVal) {
				segments.push({ value: curVal, type: Type.TEXT });
			}

			curVal = '';
			inVariable = true;
		}

		// End of variable
		else if (char === '}' && inVariable) {
			const resolved = values[curVal];

			// Variable
			if (typeof resolved === 'string') {
				if (resolved.length) {
					segments.push({ value: resolved, type: Type.VARIABLE });
				}
			}

			// Separator
			else if (resolved) {
				const prevSegment = segments[segments.length - 1];
				if (!prevSegment || prevSegment.type !== Type.SEPARATOR) {
					segments.push({ value: resolved.label, type: Type.SEPARATOR }); // prevent duplicate separators
				}
			}

			curVal = '';
			inVariable = false;
		}

		// Text or Variable Name
		else {
			curVal += char;
		}
	}

	// Tail
	if (curVal && !inVariable) {
		segments.push({ value: curVal, type: Type.TEXT });
	}

	return segments.filter((segment, index) => {

		// Only keep separator if we have values to the left and right
		if (segment.type === Type.SEPARATOR) {
			const left = segments[index - 1];
			const right = segments[index + 1];

			return [left, right].every(segment => segment && (segment.type === Type.VARIABLE || segment.type === Type.TEXT) && segment.value.length > 0);
		}

		// accept any TEXT and VARIABLE
		return true;
	}).map(segment => segment.value).join('');
}

/**
 * Handles mnemonics for menu items. Depending on OS:
 * - Windows: Supported via & character (replace && with &)
 * -   Linux: Supported via & character (replace && with &)
 * -   macOS: Unsupported (replace && with empty string)
 */
export function mnemonicMenuLabel(label: string, forceDisableMnemonics?: boolean): string {
	if (isMacintosh || forceDisableMnemonics) {
		return label.replace(/\(&&\w\)|&&/g, '').replace(/&/g, isMacintosh ? '&' : '&&');
	}

	return label.replace(/&&|&/g, m => m === '&' ? '&&' : '&');
}

/**
 * Handles mnemonics for buttons. Depending on OS:
 * - Windows: Supported via & character (replace && with & and & with && for escaping)
 * -   Linux: Supported via _ character (replace && with _)
 * -   macOS: Unsupported (replace && with empty string)
 * When forceDisableMnemonics is set, returns just the label without mnemonics.
 */
export function mnemonicButtonLabel(label: string, forceDisableMnemonics: true): string;
export function mnemonicButtonLabel(label: string, forceDisableMnemonics?: false): { readonly withMnemonic: string; readonly withoutMnemonic: string };
export function mnemonicButtonLabel(label: string, forceDisableMnemonics?: boolean): { readonly withMnemonic: string; readonly withoutMnemonic: string } | string {
	const withoutMnemonic = label.replace(/\(&&\w\)|&&/g, '');

	if (forceDisableMnemonics) {
		return withoutMnemonic;
	}
	if (isMacintosh) {
		return { withMnemonic: withoutMnemonic, withoutMnemonic };
	}

	let withMnemonic: string;
	if (isWindows) {
		withMnemonic = label.replace(/&&|&/g, m => m === '&' ? '&&' : '&');
	} else {
		withMnemonic = label.replace(/&&/g, '_');
	}
	return { withMnemonic, withoutMnemonic };
}

export function unmnemonicLabel(label: string): string {
	return label.replace(/&/g, '&&');
}

/**
 * Splits a recent label in name and parent path, supporting both '/' and '\' and workspace suffixes.
 * If the location is remote, the remote name is included in the name part.
 */
export function splitRecentLabel(recentLabel: string): { name: string; parentPath: string } {
	if (recentLabel.endsWith(']')) {
		// label with workspace suffix
		const lastIndexOfSquareBracket = recentLabel.lastIndexOf(' [', recentLabel.length - 2);
		if (lastIndexOfSquareBracket !== -1) {
			const split = splitName(recentLabel.substring(0, lastIndexOfSquareBracket));
			const remoteNameWithSpace = recentLabel.substring(lastIndexOfSquareBracket);
			return { name: split.name + remoteNameWithSpace, parentPath: split.parentPath };
		}
	}
	return splitName(recentLabel);
}

function splitName(fullPath: string): { name: string; parentPath: string } {
	const p = fullPath.indexOf('/') !== -1 ? posix : win32;
	const name = p.basename(fullPath);
	const parentPath = p.dirname(fullPath);
	if (name.length) {
		return { name, parentPath };
	}
	// only the root segment
	return { name: parentPath, parentPath: '' };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/lazy.ts]---
Location: vscode-main/src/vs/base/common/lazy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

enum LazyValueState {
	Uninitialized,
	Running,
	Completed,
}

export class Lazy<T> {

	private _state = LazyValueState.Uninitialized;
	private _value?: T;
	private _error: Error | undefined;

	constructor(
		private readonly executor: () => T,
	) { }

	/**
	 * True if the lazy value has been resolved.
	 */
	get hasValue(): boolean { return this._state === LazyValueState.Completed; }

	/**
	 * Get the wrapped value.
	 *
	 * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
	 * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
	 */
	get value(): T {
		if (this._state === LazyValueState.Uninitialized) {
			this._state = LazyValueState.Running;
			try {
				this._value = this.executor();
			} catch (err) {
				this._error = err;
			} finally {
				this._state = LazyValueState.Completed;
			}
		} else if (this._state === LazyValueState.Running) {
			throw new Error('Cannot read the value of a lazy that is being initialized');
		}

		if (this._error) {
			throw this._error;
		}
		return this._value!;
	}

	/**
	 * Get the wrapped value without forcing evaluation.
	 */
	get rawValue(): T | undefined { return this._value; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/lifecycle.ts]---
Location: vscode-main/src/vs/base/common/lifecycle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, numberComparator } from './arrays.js';
import { groupBy } from './collections.js';
import { SetMap, ResourceMap } from './map.js';
import { URI } from './uri.js';
import { createSingleCallFunction } from './functional.js';
import { Iterable } from './iterator.js';
import { BugIndicatingError, onUnexpectedError } from './errors.js';

// #region Disposable Tracking

/**
 * Enables logging of potentially leaked disposables.
 *
 * A disposable is considered leaked if it is not disposed or not registered as the child of
 * another disposable. This tracking is very simple an only works for classes that either
 * extend Disposable or use a DisposableStore. This means there are a lot of false positives.
 */
const TRACK_DISPOSABLES = false;
let disposableTracker: IDisposableTracker | null = null;

export interface IDisposableTracker {
	/**
	 * Is called on construction of a disposable.
	*/
	trackDisposable(disposable: IDisposable): void;

	/**
	 * Is called when a disposable is registered as child of another disposable (e.g. {@link DisposableStore}).
	 * If parent is `null`, the disposable is removed from its former parent.
	*/
	setParent(child: IDisposable, parent: IDisposable | null): void;

	/**
	 * Is called after a disposable is disposed.
	*/
	markAsDisposed(disposable: IDisposable): void;

	/**
	 * Indicates that the given object is a singleton which does not need to be disposed.
	*/
	markAsSingleton(disposable: IDisposable): void;
}

export class GCBasedDisposableTracker implements IDisposableTracker {

	private readonly _registry = new FinalizationRegistry<string>(heldValue => {
		console.warn(`[LEAKED DISPOSABLE] ${heldValue}`);
	});

	trackDisposable(disposable: IDisposable): void {
		const stack = new Error('CREATED via:').stack!;
		this._registry.register(disposable, stack, disposable);
	}

	setParent(child: IDisposable, parent: IDisposable | null): void {
		if (parent) {
			this._registry.unregister(child);
		} else {
			this.trackDisposable(child);
		}
	}

	markAsDisposed(disposable: IDisposable): void {
		this._registry.unregister(disposable);
	}

	markAsSingleton(disposable: IDisposable): void {
		this._registry.unregister(disposable);
	}
}

export interface DisposableInfo {
	value: IDisposable;
	source: string | null;
	parent: IDisposable | null;
	isSingleton: boolean;
	idx: number;
}

export class DisposableTracker implements IDisposableTracker {
	private static idx = 0;

	private readonly livingDisposables = new Map<IDisposable, DisposableInfo>();

	private getDisposableData(d: IDisposable): DisposableInfo {
		let val = this.livingDisposables.get(d);
		if (!val) {
			val = { parent: null, source: null, isSingleton: false, value: d, idx: DisposableTracker.idx++ };
			this.livingDisposables.set(d, val);
		}
		return val;
	}

	trackDisposable(d: IDisposable): void {
		const data = this.getDisposableData(d);
		if (!data.source) {
			data.source =
				new Error().stack!;
		}
	}

	setParent(child: IDisposable, parent: IDisposable | null): void {
		const data = this.getDisposableData(child);
		data.parent = parent;
	}

	markAsDisposed(x: IDisposable): void {
		this.livingDisposables.delete(x);
	}

	markAsSingleton(disposable: IDisposable): void {
		this.getDisposableData(disposable).isSingleton = true;
	}

	private getRootParent(data: DisposableInfo, cache: Map<DisposableInfo, DisposableInfo>): DisposableInfo {
		const cacheValue = cache.get(data);
		if (cacheValue) {
			return cacheValue;
		}

		const result = data.parent ? this.getRootParent(this.getDisposableData(data.parent), cache) : data;
		cache.set(data, result);
		return result;
	}

	getTrackedDisposables(): IDisposable[] {
		const rootParentCache = new Map<DisposableInfo, DisposableInfo>();

		const leaking = [...this.livingDisposables.entries()]
			.filter(([, v]) => v.source !== null && !this.getRootParent(v, rootParentCache).isSingleton)
			.flatMap(([k]) => k);

		return leaking;
	}

	computeLeakingDisposables(maxReported = 10, preComputedLeaks?: DisposableInfo[]): { leaks: DisposableInfo[]; details: string } | undefined {
		let uncoveredLeakingObjs: DisposableInfo[] | undefined;
		if (preComputedLeaks) {
			uncoveredLeakingObjs = preComputedLeaks;
		} else {
			const rootParentCache = new Map<DisposableInfo, DisposableInfo>();

			const leakingObjects = [...this.livingDisposables.values()]
				.filter((info) => info.source !== null && !this.getRootParent(info, rootParentCache).isSingleton);

			if (leakingObjects.length === 0) {
				return;
			}
			const leakingObjsSet = new Set(leakingObjects.map(o => o.value));

			// Remove all objects that are a child of other leaking objects. Assumes there are no cycles.
			uncoveredLeakingObjs = leakingObjects.filter(l => {
				return !(l.parent && leakingObjsSet.has(l.parent));
			});

			if (uncoveredLeakingObjs.length === 0) {
				throw new Error('There are cyclic diposable chains!');
			}
		}

		if (!uncoveredLeakingObjs) {
			return undefined;
		}

		function getStackTracePath(leaking: DisposableInfo): string[] {
			function removePrefix(array: string[], linesToRemove: (string | RegExp)[]) {
				while (array.length > 0 && linesToRemove.some(regexp => typeof regexp === 'string' ? regexp === array[0] : array[0].match(regexp))) {
					array.shift();
				}
			}

			const lines = leaking.source!.split('\n').map(p => p.trim().replace('at ', '')).filter(l => l !== '');
			removePrefix(lines, ['Error', /^trackDisposable \(.*\)$/, /^DisposableTracker.trackDisposable \(.*\)$/]);
			return lines.reverse();
		}

		const stackTraceStarts = new SetMap<string, DisposableInfo>();
		for (const leaking of uncoveredLeakingObjs) {
			const stackTracePath = getStackTracePath(leaking);
			for (let i = 0; i <= stackTracePath.length; i++) {
				stackTraceStarts.add(stackTracePath.slice(0, i).join('\n'), leaking);
			}
		}

		// Put earlier leaks first
		uncoveredLeakingObjs.sort(compareBy(l => l.idx, numberComparator));

		let message = '';

		let i = 0;
		for (const leaking of uncoveredLeakingObjs.slice(0, maxReported)) {
			i++;
			const stackTracePath = getStackTracePath(leaking);
			const stackTraceFormattedLines = [];

			for (let i = 0; i < stackTracePath.length; i++) {
				let line = stackTracePath[i];
				const starts = stackTraceStarts.get(stackTracePath.slice(0, i + 1).join('\n'));
				line = `(shared with ${starts.size}/${uncoveredLeakingObjs.length} leaks) at ${line}`;

				const prevStarts = stackTraceStarts.get(stackTracePath.slice(0, i).join('\n'));
				const continuations = groupBy([...prevStarts].map(d => getStackTracePath(d)[i]), v => v);
				delete continuations[stackTracePath[i]];
				for (const [cont, set] of Object.entries(continuations)) {
					if (set) {
						stackTraceFormattedLines.unshift(`    - stacktraces of ${set.length} other leaks continue with ${cont}`);
					}
				}

				stackTraceFormattedLines.unshift(line);
			}

			message += `\n\n\n==================== Leaking disposable ${i}/${uncoveredLeakingObjs.length}: ${leaking.value.constructor.name} ====================\n${stackTraceFormattedLines.join('\n')}\n============================================================\n\n`;
		}

		if (uncoveredLeakingObjs.length > maxReported) {
			message += `\n\n\n... and ${uncoveredLeakingObjs.length - maxReported} more leaking disposables\n\n`;
		}

		return { leaks: uncoveredLeakingObjs, details: message };
	}
}

export function setDisposableTracker(tracker: IDisposableTracker | null): void {
	disposableTracker = tracker;
}

if (TRACK_DISPOSABLES) {
	const __is_disposable_tracked__ = '__is_disposable_tracked__';
	setDisposableTracker(new class implements IDisposableTracker {
		trackDisposable(x: IDisposable): void {
			const stack = new Error('Potentially leaked disposable').stack!;
			setTimeout(() => {
				// eslint-disable-next-line local/code-no-any-casts
				if (!(x as any)[__is_disposable_tracked__]) {
					console.log(stack);
				}
			}, 3000);
		}

		setParent(child: IDisposable, parent: IDisposable | null): void {
			if (child && child !== Disposable.None) {
				try {
					// eslint-disable-next-line local/code-no-any-casts
					(child as any)[__is_disposable_tracked__] = true;
				} catch {
					// noop
				}
			}
		}

		markAsDisposed(disposable: IDisposable): void {
			if (disposable && disposable !== Disposable.None) {
				try {
					// eslint-disable-next-line local/code-no-any-casts
					(disposable as any)[__is_disposable_tracked__] = true;
				} catch {
					// noop
				}
			}
		}
		markAsSingleton(disposable: IDisposable): void { }
	});
}

export function trackDisposable<T extends IDisposable>(x: T): T {
	disposableTracker?.trackDisposable(x);
	return x;
}

export function markAsDisposed(disposable: IDisposable): void {
	disposableTracker?.markAsDisposed(disposable);
}

function setParentOfDisposable(child: IDisposable, parent: IDisposable | null): void {
	disposableTracker?.setParent(child, parent);
}

function setParentOfDisposables(children: IDisposable[], parent: IDisposable | null): void {
	if (!disposableTracker) {
		return;
	}
	for (const child of children) {
		disposableTracker.setParent(child, parent);
	}
}

/**
 * Indicates that the given object is a singleton which does not need to be disposed.
*/
export function markAsSingleton<T extends IDisposable>(singleton: T): T {
	disposableTracker?.markAsSingleton(singleton);
	return singleton;
}

// #endregion

/**
 * An object that performs a cleanup operation when `.dispose()` is called.
 *
 * Some examples of how disposables are used:
 *
 * - An event listener that removes itself when `.dispose()` is called.
 * - A resource such as a file system watcher that cleans up the resource when `.dispose()` is called.
 * - The return value from registering a provider. When `.dispose()` is called, the provider is unregistered.
 */
export interface IDisposable {
	dispose(): void;
}

/**
 * Check if `thing` is {@link IDisposable disposable}.
 */
export function isDisposable<E>(thing: E): thing is E & IDisposable {
	// eslint-disable-next-line local/code-no-any-casts
	return typeof thing === 'object' && thing !== null && typeof (<IDisposable><any>thing).dispose === 'function' && (<IDisposable><any>thing).dispose.length === 0;
}

/**
 * Disposes of the value(s) passed in.
 */
export function dispose<T extends IDisposable>(disposable: T): T;
export function dispose<T extends IDisposable>(disposable: T | undefined): T | undefined;
export function dispose<T extends IDisposable, A extends Iterable<T> = Iterable<T>>(disposables: A): A;
export function dispose<T extends IDisposable>(disposables: Array<T>): Array<T>;
export function dispose<T extends IDisposable>(disposables: ReadonlyArray<T>): ReadonlyArray<T>;
export function dispose<T extends IDisposable>(arg: T | Iterable<T> | undefined): any {
	if (Iterable.is(arg)) {
		const errors: any[] = [];

		for (const d of arg) {
			if (d) {
				try {
					d.dispose();
				} catch (e) {
					errors.push(e);
				}
			}
		}

		if (errors.length === 1) {
			throw errors[0];
		} else if (errors.length > 1) {
			throw new AggregateError(errors, 'Encountered errors while disposing of store');
		}

		return Array.isArray(arg) ? [] : arg;
	} else if (arg) {
		arg.dispose();
		return arg;
	}
}

export function disposeIfDisposable<T extends IDisposable | object>(disposables: Array<T>): Array<T> {
	for (const d of disposables) {
		if (isDisposable(d)) {
			d.dispose();
		}
	}
	return [];
}

/**
 * Combine multiple disposable values into a single {@link IDisposable}.
 */
export function combinedDisposable(...disposables: IDisposable[]): IDisposable {
	const parent = toDisposable(() => dispose(disposables));
	setParentOfDisposables(disposables, parent);
	return parent;
}

class FunctionDisposable implements IDisposable {
	private _isDisposed: boolean;
	private readonly _fn: () => void;

	constructor(fn: () => void) {
		this._isDisposed = false;
		this._fn = fn;
		trackDisposable(this);
	}

	dispose() {
		if (this._isDisposed) {
			return;
		}
		if (!this._fn) {
			throw new Error(`Unbound disposable context: Need to use an arrow function to preserve the value of this`);
		}
		this._isDisposed = true;
		markAsDisposed(this);
		this._fn();
	}
}

/**
 * Turn a function that implements dispose into an {@link IDisposable}.
 *
 * @param fn Clean up function, guaranteed to be called only **once**.
 */
export function toDisposable(fn: () => void): IDisposable {
	return new FunctionDisposable(fn);
}

/**
 * Manages a collection of disposable values.
 *
 * This is the preferred way to manage multiple disposables. A `DisposableStore` is safer to work with than an
 * `IDisposable[]` as it considers edge cases, such as registering the same value multiple times or adding an item to a
 * store that has already been disposed of.
 */
export class DisposableStore implements IDisposable {

	static DISABLE_DISPOSED_WARNING = false;

	private readonly _toDispose = new Set<IDisposable>();
	private _isDisposed = false;

	constructor() {
		trackDisposable(this);
	}

	/**
	 * Dispose of all registered disposables and mark this object as disposed.
	 *
	 * Any future disposables added to this object will be disposed of on `add`.
	 */
	public dispose(): void {
		if (this._isDisposed) {
			return;
		}

		markAsDisposed(this);
		this._isDisposed = true;
		this.clear();
	}

	/**
	 * @return `true` if this object has been disposed of.
	 */
	public get isDisposed(): boolean {
		return this._isDisposed;
	}

	/**
	 * Dispose of all registered disposables but do not mark this object as disposed.
	 */
	public clear(): void {
		if (this._toDispose.size === 0) {
			return;
		}

		try {
			dispose(this._toDispose);
		} finally {
			this._toDispose.clear();
		}
	}

	/**
	 * Add a new {@link IDisposable disposable} to the collection.
	 */
	public add<T extends IDisposable>(o: T): T {
		if (!o || o === Disposable.None) {
			return o;
		}
		if ((o as unknown as DisposableStore) === this) {
			throw new Error('Cannot register a disposable on itself!');
		}

		setParentOfDisposable(o, this);
		if (this._isDisposed) {
			if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
				console.warn(new Error('Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!').stack);
			}
		} else {
			this._toDispose.add(o);
		}

		return o;
	}

	/**
	 * Deletes a disposable from store and disposes of it. This will not throw or warn and proceed to dispose the
	 * disposable even when the disposable is not part in the store.
	 */
	public delete<T extends IDisposable>(o: T): void {
		if (!o) {
			return;
		}
		if ((o as unknown as DisposableStore) === this) {
			throw new Error('Cannot dispose a disposable on itself!');
		}
		this._toDispose.delete(o);
		o.dispose();
	}

	/**
	 * Deletes the value from the store, but does not dispose it.
	 */
	public deleteAndLeak<T extends IDisposable>(o: T): void {
		if (!o) {
			return;
		}
		if (this._toDispose.delete(o)) {
			setParentOfDisposable(o, null);
		}
	}

	public assertNotDisposed(): void {
		if (this._isDisposed) {
			onUnexpectedError(new BugIndicatingError('Object disposed'));
		}
	}
}

/**
 * Abstract base class for a {@link IDisposable disposable} object.
 *
 * Subclasses can {@linkcode _register} disposables that will be automatically cleaned up when this object is disposed of.
 */
export abstract class Disposable implements IDisposable {

	/**
	 * A disposable that does nothing when it is disposed of.
	 *
	 * TODO: This should not be a static property.
	 */
	static readonly None = Object.freeze<IDisposable>({ dispose() { } });

	protected readonly _store = new DisposableStore();

	constructor() {
		trackDisposable(this);
		setParentOfDisposable(this._store, this);
	}

	public dispose(): void {
		markAsDisposed(this);

		this._store.dispose();
	}

	/**
	 * Adds `o` to the collection of disposables managed by this object.
	 */
	protected _register<T extends IDisposable>(o: T): T {
		if ((o as unknown as Disposable) === this) {
			throw new Error('Cannot register a disposable on itself!');
		}
		return this._store.add(o);
	}
}

/**
 * Manages the lifecycle of a disposable value that may be changed.
 *
 * This ensures that when the disposable value is changed, the previously held disposable is disposed of. You can
 * also register a `MutableDisposable` on a `Disposable` to ensure it is automatically cleaned up.
 */
export class MutableDisposable<T extends IDisposable> implements IDisposable {
	private _value?: T;
	private _isDisposed = false;

	constructor() {
		trackDisposable(this);
	}

	/**
	 * Get the currently held disposable value, or `undefined` if this MutableDisposable has been disposed
	 */
	get value(): T | undefined {
		return this._isDisposed ? undefined : this._value;
	}

	/**
	 * Set a new disposable value.
	 *
	 * Behaviour:
	 * - If the MutableDisposable has been disposed, the setter is a no-op.
	 * - If the new value is strictly equal to the current value, the setter is a no-op.
	 * - Otherwise the previous value (if any) is disposed and the new value is stored.
	 *
	 * Related helpers:
	 * - clear() resets the value to `undefined` (and disposes the previous value).
	 * - clearAndLeak() returns the old value without disposing it and removes its parent.
	 */
	set value(value: T | undefined) {
		if (this._isDisposed || value === this._value) {
			return;
		}

		this._value?.dispose();
		if (value) {
			setParentOfDisposable(value, this);
		}
		this._value = value;
	}

	/**
	 * Resets the stored value and disposed of the previously stored value.
	 */
	clear(): void {
		this.value = undefined;
	}

	dispose(): void {
		this._isDisposed = true;
		markAsDisposed(this);
		this._value?.dispose();
		this._value = undefined;
	}

	/**
	 * Clears the value, but does not dispose it.
	 * The old value is returned.
	*/
	clearAndLeak(): T | undefined {
		const oldValue = this._value;
		this._value = undefined;
		if (oldValue) {
			setParentOfDisposable(oldValue, null);
		}
		return oldValue;
	}
}

/**
 * Manages the lifecycle of a disposable value that may be changed like {@link MutableDisposable}, but the value must
 * exist and cannot be undefined.
 */
export class MandatoryMutableDisposable<T extends IDisposable> implements IDisposable {
	private readonly _disposable = new MutableDisposable<T>();
	private _isDisposed = false;

	constructor(initialValue: T) {
		this._disposable.value = initialValue;
	}

	get value(): T {
		return this._disposable.value!;
	}

	set value(value: T) {
		if (this._isDisposed || value === this._disposable.value) {
			return;
		}
		this._disposable.value = value;
	}

	dispose() {
		this._isDisposed = true;
		this._disposable.dispose();
	}
}

export class RefCountedDisposable {

	private _counter: number = 1;

	constructor(
		private readonly _disposable: IDisposable,
	) { }

	acquire() {
		this._counter++;
		return this;
	}

	release() {
		if (--this._counter === 0) {
			this._disposable.dispose();
		}
		return this;
	}
}

export interface IReference<T> extends IDisposable {
	readonly object: T;
}

export abstract class ReferenceCollection<T> {

	private readonly references: Map<string, { readonly object: T; counter: number }> = new Map();

	acquire(key: string, ...args: unknown[]): IReference<T> {
		let reference = this.references.get(key);

		if (!reference) {
			reference = { counter: 0, object: this.createReferencedObject(key, ...args) };
			this.references.set(key, reference);
		}

		const { object } = reference;
		const dispose = createSingleCallFunction(() => {
			if (--reference.counter === 0) {
				this.destroyReferencedObject(key, reference.object);
				this.references.delete(key);
			}
		});

		reference.counter++;

		return { object, dispose };
	}

	protected abstract createReferencedObject(key: string, ...args: unknown[]): T;
	protected abstract destroyReferencedObject(key: string, object: T): void;
}

/**
 * Unwraps a reference collection of promised values. Makes sure
 * references are disposed whenever promises get rejected.
 */
export class AsyncReferenceCollection<T> {

	constructor(private referenceCollection: ReferenceCollection<Promise<T>>) { }

	async acquire(key: string, ...args: any[]): Promise<IReference<T>> {
		const ref = this.referenceCollection.acquire(key, ...args);

		try {
			const object = await ref.object;

			return {
				object,
				dispose: () => ref.dispose()
			};
		} catch (error) {
			ref.dispose();
			throw error;
		}
	}
}

export class ImmortalReference<T> implements IReference<T> {
	constructor(public object: T) { }
	dispose(): void { /* noop */ }
}

export function disposeOnReturn(fn: (store: DisposableStore) => void): void {
	const store = new DisposableStore();
	try {
		fn(store);
	} finally {
		store.dispose();
	}
}

/**
 * A map the manages the lifecycle of the values that it stores.
 */
export class DisposableMap<K, V extends IDisposable = IDisposable> implements IDisposable {

	private readonly _store: Map<K, V>;
	private _isDisposed = false;

	constructor(store: Map<K, V> = new Map<K, V>()) {
		this._store = store;
		trackDisposable(this);
	}

	/**
	 * Disposes of all stored values and mark this object as disposed.
	 *
	 * Trying to use this object after it has been disposed of is an error.
	 */
	dispose(): void {
		markAsDisposed(this);
		this._isDisposed = true;
		this.clearAndDisposeAll();
	}

	/**
	 * Disposes of all stored values and clear the map, but DO NOT mark this object as disposed.
	 */
	clearAndDisposeAll(): void {
		if (!this._store.size) {
			return;
		}

		try {
			dispose(this._store.values());
		} finally {
			this._store.clear();
		}
	}

	has(key: K): boolean {
		return this._store.has(key);
	}

	get size(): number {
		return this._store.size;
	}

	get(key: K): V | undefined {
		return this._store.get(key);
	}

	set(key: K, value: V, skipDisposeOnOverwrite = false): void {
		if (this._isDisposed) {
			console.warn(new Error('Trying to add a disposable to a DisposableMap that has already been disposed of. The added object will be leaked!').stack);
		}

		if (!skipDisposeOnOverwrite) {
			this._store.get(key)?.dispose();
		}

		this._store.set(key, value);
		setParentOfDisposable(value, this);
	}

	/**
	 * Delete the value stored for `key` from this map and also dispose of it.
	 */
	deleteAndDispose(key: K): void {
		this._store.get(key)?.dispose();
		this._store.delete(key);
	}

	/**
	 * Delete the value stored for `key` from this map but return it. The caller is
	 * responsible for disposing of the value.
	 */
	deleteAndLeak(key: K): V | undefined {
		const value = this._store.get(key);
		if (value) {
			setParentOfDisposable(value, null);
		}
		this._store.delete(key);
		return value;
	}

	keys(): IterableIterator<K> {
		return this._store.keys();
	}

	values(): IterableIterator<V> {
		return this._store.values();
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this._store[Symbol.iterator]();
	}
}

/**
 * Call `then` on a Promise, unless the returned disposable is disposed.
 */
export function thenIfNotDisposed<T>(promise: Promise<T>, then: (result: T) => void): IDisposable {
	let disposed = false;
	promise.then(result => {
		if (disposed) {
			return;
		}
		then(result);
	});
	return toDisposable(() => {
		disposed = true;
	});
}

/**
 * Call `then` on a promise that resolves to a {@link IDisposable}, then either register the
 * disposable or register it to the {@link DisposableStore}, depending on whether the store is
 * disposed or not.
 */
export function thenRegisterOrDispose<T extends IDisposable>(promise: Promise<T>, store: DisposableStore): Promise<T> {
	return promise.then(disposable => {
		if (store.isDisposed) {
			disposable.dispose();
		} else {
			store.add(disposable);
		}
		return disposable;
	});
}

export class DisposableResourceMap<V extends IDisposable = IDisposable> extends DisposableMap<URI, V> {
	constructor() {
		super(new ResourceMap());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/linkedList.ts]---
Location: vscode-main/src/vs/base/common/linkedList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class Node<E> {

	static readonly Undefined = new Node<unknown>(undefined);

	element: E;
	next: Node<E> | typeof Node.Undefined;
	prev: Node<E> | typeof Node.Undefined;

	constructor(element: E) {
		this.element = element;
		this.next = Node.Undefined;
		this.prev = Node.Undefined;
	}
}

export class LinkedList<E> {

	private _first: Node<E> | typeof Node.Undefined = Node.Undefined;
	private _last: Node<E> | typeof Node.Undefined = Node.Undefined;
	private _size: number = 0;

	get size(): number {
		return this._size;
	}

	isEmpty(): boolean {
		return this._first === Node.Undefined;
	}

	clear(): void {
		let node = this._first;
		while (node !== Node.Undefined) {
			const next = node.next;
			node.prev = Node.Undefined;
			node.next = Node.Undefined;
			node = next;
		}

		this._first = Node.Undefined;
		this._last = Node.Undefined;
		this._size = 0;
	}

	unshift(element: E): () => void {
		return this._insert(element, false);
	}

	push(element: E): () => void {
		return this._insert(element, true);
	}

	private _insert(element: E, atTheEnd: boolean): () => void {
		const newNode = new Node(element);
		if (this._first === Node.Undefined) {
			this._first = newNode;
			this._last = newNode;

		} else if (atTheEnd) {
			// push
			const oldLast = this._last;
			this._last = newNode;
			newNode.prev = oldLast;
			oldLast.next = newNode;

		} else {
			// unshift
			const oldFirst = this._first;
			this._first = newNode;
			newNode.next = oldFirst;
			oldFirst.prev = newNode;
		}
		this._size += 1;

		let didRemove = false;
		return () => {
			if (!didRemove) {
				didRemove = true;
				this._remove(newNode);
			}
		};
	}

	shift(): E | undefined {
		if (this._first === Node.Undefined) {
			return undefined;
		} else {
			const res = this._first.element;
			this._remove(this._first);
			return res as E;
		}
	}

	pop(): E | undefined {
		if (this._last === Node.Undefined) {
			return undefined;
		} else {
			const res = this._last.element;
			this._remove(this._last);
			return res as E;
		}
	}

	peek(): E | undefined {
		if (this._last === Node.Undefined) {
			return undefined;
		} else {
			const res = this._last.element;
			return res as E;
		}
	}

	private _remove(node: Node<E> | typeof Node.Undefined): void {
		if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
			// middle
			const anchor = node.prev;
			anchor.next = node.next;
			node.next.prev = anchor;

		} else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
			// only node
			this._first = Node.Undefined;
			this._last = Node.Undefined;

		} else if (node.next === Node.Undefined) {
			// last
			this._last = this._last.prev!;
			this._last.next = Node.Undefined;

		} else if (node.prev === Node.Undefined) {
			// first
			this._first = this._first.next!;
			this._first.prev = Node.Undefined;
		}

		// done
		this._size -= 1;
	}

	*[Symbol.iterator](): Iterator<E> {
		let node = this._first;
		while (node !== Node.Undefined) {
			yield node.element as E;
			node = node.next;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/linkedText.ts]---
Location: vscode-main/src/vs/base/common/linkedText.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from './decorators.js';

export interface ILink {
	readonly label: string;
	readonly href: string;
	readonly title?: string;
}

export type LinkedTextNode = string | ILink;

export class LinkedText {

	constructor(readonly nodes: LinkedTextNode[]) { }

	@memoize
	toString(): string {
		return this.nodes.map(node => typeof node === 'string' ? node : node.label).join('');
	}
}

const LINK_REGEX = /\[([^\]]+)\]\(((?:https?:\/\/|command:|file:)[^\)\s]+)(?: (["'])(.+?)(\3))?\)/gi;

export function parseLinkedText(text: string): LinkedText {
	const result: LinkedTextNode[] = [];

	let index = 0;
	let match: RegExpExecArray | null;

	while (match = LINK_REGEX.exec(text)) {
		if (match.index - index > 0) {
			result.push(text.substring(index, match.index));
		}

		const [, label, href, , title] = match;

		if (title) {
			result.push({ label, href, title });
		} else {
			result.push({ label, href });
		}

		index = match.index + match[0].length;
	}

	if (index < text.length) {
		result.push(text.substring(index));
	}

	return new LinkedText(result);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/map.ts]---
Location: vscode-main/src/vs/base/common/map.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from './uri.js';

export function getOrSet<K, V>(map: Map<K, V>, key: K, value: V): V {
	let result = map.get(key);
	if (result === undefined) {
		result = value;
		map.set(key, result);
	}

	return result;
}

export function mapToString<K, V>(map: Map<K, V>): string {
	const entries: string[] = [];
	map.forEach((value, key) => {
		entries.push(`${key} => ${value}`);
	});

	return `Map(${map.size}) {${entries.join(', ')}}`;
}

export function setToString<K>(set: Set<K>): string {
	const entries: K[] = [];
	set.forEach(value => {
		entries.push(value);
	});

	return `Set(${set.size}) {${entries.join(', ')}}`;
}

interface ResourceMapKeyFn {
	(resource: URI): string;
}

class ResourceMapEntry<T> {
	constructor(readonly uri: URI, readonly value: T) { }
}

function isEntries<T>(arg: ResourceMap<T> | ResourceMapKeyFn | readonly (readonly [URI, T])[] | undefined): arg is readonly (readonly [URI, T])[] {
	return Array.isArray(arg);
}

export class ResourceMap<T> implements Map<URI, T> {

	private static readonly defaultToKey = (resource: URI) => resource.toString();

	readonly [Symbol.toStringTag] = 'ResourceMap';

	private readonly map: Map<string, ResourceMapEntry<T>>;
	private readonly toKey: ResourceMapKeyFn;

	/**
	 *
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(toKey?: ResourceMapKeyFn);

	/**
	 *
	 * @param other Another resource which this maps is created from
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(other?: ResourceMap<T>, toKey?: ResourceMapKeyFn);

	/**
	 *
	 * @param other Another resource which this maps is created from
	 * @param toKey Custom uri identity function, e.g use an existing `IExtUri#getComparison`-util
	 */
	constructor(entries?: readonly (readonly [URI, T])[], toKey?: ResourceMapKeyFn);

	constructor(arg?: ResourceMap<T> | ResourceMapKeyFn | readonly (readonly [URI, T])[], toKey?: ResourceMapKeyFn) {
		if (arg instanceof ResourceMap) {
			this.map = new Map(arg.map);
			this.toKey = toKey ?? ResourceMap.defaultToKey;
		} else if (isEntries(arg)) {
			this.map = new Map();
			this.toKey = toKey ?? ResourceMap.defaultToKey;

			for (const [resource, value] of arg) {
				this.set(resource, value);
			}
		} else {
			this.map = new Map();
			this.toKey = arg ?? ResourceMap.defaultToKey;
		}
	}

	set(resource: URI, value: T): this {
		this.map.set(this.toKey(resource), new ResourceMapEntry(resource, value));
		return this;
	}

	get(resource: URI): T | undefined {
		return this.map.get(this.toKey(resource))?.value;
	}

	has(resource: URI): boolean {
		return this.map.has(this.toKey(resource));
	}

	get size(): number {
		return this.map.size;
	}

	clear(): void {
		this.map.clear();
	}

	delete(resource: URI): boolean {
		return this.map.delete(this.toKey(resource));
	}

	forEach(clb: (value: T, key: URI, map: Map<URI, T>) => void, thisArg?: object): void {
		if (typeof thisArg !== 'undefined') {
			clb = clb.bind(thisArg);
		}
		for (const [_, entry] of this.map) {
			clb(entry.value, entry.uri, this);
		}
	}

	*values(): IterableIterator<T> {
		for (const entry of this.map.values()) {
			yield entry.value;
		}
	}

	*keys(): IterableIterator<URI> {
		for (const entry of this.map.values()) {
			yield entry.uri;
		}
	}

	*entries(): IterableIterator<[URI, T]> {
		for (const entry of this.map.values()) {
			yield [entry.uri, entry.value];
		}
	}

	*[Symbol.iterator](): IterableIterator<[URI, T]> {
		for (const [, entry] of this.map) {
			yield [entry.uri, entry.value];
		}
	}
}

export class ResourceSet implements Set<URI> {

	readonly [Symbol.toStringTag]: string = 'ResourceSet';

	private readonly _map: ResourceMap<URI>;

	constructor(toKey?: ResourceMapKeyFn);
	constructor(entries: readonly URI[], toKey?: ResourceMapKeyFn);
	constructor(entriesOrKey?: readonly URI[] | ResourceMapKeyFn, toKey?: ResourceMapKeyFn) {
		if (!entriesOrKey || typeof entriesOrKey === 'function') {
			this._map = new ResourceMap(entriesOrKey);
		} else {
			this._map = new ResourceMap(toKey);
			entriesOrKey.forEach(this.add, this);
		}
	}


	get size(): number {
		return this._map.size;
	}

	add(value: URI): this {
		this._map.set(value, value);
		return this;
	}

	clear(): void {
		this._map.clear();
	}

	delete(value: URI): boolean {
		return this._map.delete(value);
	}

	forEach(callbackfn: (value: URI, value2: URI, set: Set<URI>) => void, thisArg?: unknown): void {
		this._map.forEach((_value, key) => callbackfn.call(thisArg, key, key, this));
	}

	has(value: URI): boolean {
		return this._map.has(value);
	}

	entries(): IterableIterator<[URI, URI]> {
		return this._map.entries();
	}

	keys(): IterableIterator<URI> {
		return this._map.keys();
	}

	values(): IterableIterator<URI> {
		return this._map.keys();
	}

	[Symbol.iterator](): IterableIterator<URI> {
		return this.keys();
	}
}


interface Item<K, V> {
	previous: Item<K, V> | undefined;
	next: Item<K, V> | undefined;
	key: K;
	value: V;
}

export const enum Touch {
	None = 0,
	AsOld = 1,
	AsNew = 2
}

export class LinkedMap<K, V> implements Map<K, V> {

	readonly [Symbol.toStringTag] = 'LinkedMap';

	private _map: Map<K, Item<K, V>>;
	private _head: Item<K, V> | undefined;
	private _tail: Item<K, V> | undefined;
	private _size: number;

	private _state: number;

	constructor() {
		this._map = new Map<K, Item<K, V>>();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state = 0;
	}

	clear(): void {
		this._map.clear();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state++;
	}

	isEmpty(): boolean {
		return !this._head && !this._tail;
	}

	get size(): number {
		return this._size;
	}

	get first(): V | undefined {
		return this._head?.value;
	}

	get last(): V | undefined {
		return this._tail?.value;
	}

	has(key: K): boolean {
		return this._map.has(key);
	}

	get(key: K, touch: Touch = Touch.None): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		if (touch !== Touch.None) {
			this.touch(item, touch);
		}
		return item.value;
	}

	set(key: K, value: V, touch: Touch = Touch.None): this {
		let item = this._map.get(key);
		if (item) {
			item.value = value;
			if (touch !== Touch.None) {
				this.touch(item, touch);
			}
		} else {
			item = { key, value, next: undefined, previous: undefined };
			switch (touch) {
				case Touch.None:
					this.addItemLast(item);
					break;
				case Touch.AsOld:
					this.addItemFirst(item);
					break;
				case Touch.AsNew:
					this.addItemLast(item);
					break;
				default:
					this.addItemLast(item);
					break;
			}
			this._map.set(key, item);
			this._size++;
		}
		return this;
	}

	delete(key: K): boolean {
		return !!this.remove(key);
	}

	remove(key: K): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		this._map.delete(key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	shift(): V | undefined {
		if (!this._head && !this._tail) {
			return undefined;
		}
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		const item = this._head;
		this._map.delete(item.key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	forEach(callbackfn: (value: V, key: K, map: LinkedMap<K, V>) => void, thisArg?: unknown): void {
		const state = this._state;
		let current = this._head;
		while (current) {
			if (thisArg) {
				callbackfn.bind(thisArg)(current.value, current.key, this);
			} else {
				callbackfn(current.value, current.key, this);
			}
			if (this._state !== state) {
				throw new Error(`LinkedMap got modified during iteration.`);
			}
			current = current.next;
		}
	}

	keys(): IterableIterator<K> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<K> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<K> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.key, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	values(): IterableIterator<V> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<V> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<V> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.value, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	entries(): IterableIterator<[K, V]> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<[K, V]> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<[K, V]> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result: IteratorResult<[K, V]> = { value: [current.key, current.value], done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	protected trimOld(newSize: number) {
		if (newSize >= this.size) {
			return;
		}
		if (newSize === 0) {
			this.clear();
			return;
		}
		let current = this._head;
		let currentSize = this.size;
		while (current && currentSize > newSize) {
			this._map.delete(current.key);
			current = current.next;
			currentSize--;
		}
		this._head = current;
		this._size = currentSize;
		if (current) {
			current.previous = undefined;
		}
		this._state++;
	}

	protected trimNew(newSize: number) {
		if (newSize >= this.size) {
			return;
		}
		if (newSize === 0) {
			this.clear();
			return;
		}
		let current = this._tail;
		let currentSize = this.size;
		while (current && currentSize > newSize) {
			this._map.delete(current.key);
			current = current.previous;
			currentSize--;
		}
		this._tail = current;
		this._size = currentSize;
		if (current) {
			current.next = undefined;
		}
		this._state++;
	}

	private addItemFirst(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._tail = item;
		} else if (!this._head) {
			throw new Error('Invalid list');
		} else {
			item.next = this._head;
			this._head.previous = item;
		}
		this._head = item;
		this._state++;
	}

	private addItemLast(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._head = item;
		} else if (!this._tail) {
			throw new Error('Invalid list');
		} else {
			item.previous = this._tail;
			this._tail.next = item;
		}
		this._tail = item;
		this._state++;
	}

	private removeItem(item: Item<K, V>): void {
		if (item === this._head && item === this._tail) {
			this._head = undefined;
			this._tail = undefined;
		}
		else if (item === this._head) {
			// This can only happen if size === 1 which is handled
			// by the case above.
			if (!item.next) {
				throw new Error('Invalid list');
			}
			item.next.previous = undefined;
			this._head = item.next;
		}
		else if (item === this._tail) {
			// This can only happen if size === 1 which is handled
			// by the case above.
			if (!item.previous) {
				throw new Error('Invalid list');
			}
			item.previous.next = undefined;
			this._tail = item.previous;
		}
		else {
			const next = item.next;
			const previous = item.previous;
			if (!next || !previous) {
				throw new Error('Invalid list');
			}
			next.previous = previous;
			previous.next = next;
		}
		item.next = undefined;
		item.previous = undefined;
		this._state++;
	}

	private touch(item: Item<K, V>, touch: Touch): void {
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		if ((touch !== Touch.AsOld && touch !== Touch.AsNew)) {
			return;
		}

		if (touch === Touch.AsOld) {
			if (item === this._head) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item
			if (item === this._tail) {
				// previous must be defined since item was not head but is tail
				// So there are more than on item in the map
				previous!.next = undefined;
				this._tail = previous;
			}
			else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}

			// Insert the node at head
			item.previous = undefined;
			item.next = this._head;
			this._head.previous = item;
			this._head = item;
			this._state++;
		} else if (touch === Touch.AsNew) {
			if (item === this._tail) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item.
			if (item === this._head) {
				// next must be defined since item was not tail but is head
				// So there are more than on item in the map
				next!.previous = undefined;
				this._head = next;
			} else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}
			item.next = undefined;
			item.previous = this._tail;
			this._tail.next = item;
			this._tail = item;
			this._state++;
		}
	}

	toJSON(): [K, V][] {
		const data: [K, V][] = [];

		this.forEach((value, key) => {
			data.push([key, value]);
		});

		return data;
	}

	fromJSON(data: [K, V][]): void {
		this.clear();

		for (const [key, value] of data) {
			this.set(key, value);
		}
	}
}

abstract class Cache<K, V> extends LinkedMap<K, V> {

	protected _limit: number;
	protected _ratio: number;

	constructor(limit: number, ratio: number = 1) {
		super();
		this._limit = limit;
		this._ratio = Math.min(Math.max(0, ratio), 1);
	}

	get limit(): number {
		return this._limit;
	}

	set limit(limit: number) {
		this._limit = limit;
		this.checkTrim();
	}

	get ratio(): number {
		return this._ratio;
	}

	set ratio(ratio: number) {
		this._ratio = Math.min(Math.max(0, ratio), 1);
		this.checkTrim();
	}

	override get(key: K, touch: Touch = Touch.AsNew): V | undefined {
		return super.get(key, touch);
	}

	peek(key: K): V | undefined {
		return super.get(key, Touch.None);
	}

	override set(key: K, value: V): this {
		super.set(key, value, Touch.AsNew);
		return this;
	}

	protected checkTrim() {
		if (this.size > this._limit) {
			this.trim(Math.round(this._limit * this._ratio));
		}
	}

	protected abstract trim(newSize: number): void;
}

export class LRUCache<K, V> extends Cache<K, V> {

	constructor(limit: number, ratio: number = 1) {
		super(limit, ratio);
	}

	protected override trim(newSize: number) {
		this.trimOld(newSize);
	}

	override set(key: K, value: V): this {
		super.set(key, value);
		this.checkTrim();
		return this;
	}
}

export class MRUCache<K, V> extends Cache<K, V> {

	constructor(limit: number, ratio: number = 1) {
		super(limit, ratio);
	}

	protected override trim(newSize: number) {
		this.trimNew(newSize);
	}

	override set(key: K, value: V): this {
		if (this._limit <= this.size && !this.has(key)) {
			this.trim(Math.round(this._limit * this._ratio) - 1);
		}

		super.set(key, value);
		return this;
	}
}

export class CounterSet<T> {

	private map = new Map<T, number>();

	add(value: T): CounterSet<T> {
		this.map.set(value, (this.map.get(value) || 0) + 1);
		return this;
	}

	delete(value: T): boolean {
		let counter = this.map.get(value) || 0;

		if (counter === 0) {
			return false;
		}

		counter--;

		if (counter === 0) {
			this.map.delete(value);
		} else {
			this.map.set(value, counter);
		}

		return true;
	}

	has(value: T): boolean {
		return this.map.has(value);
	}
}

/**
 * A map that allows access both by keys and values.
 * **NOTE**: values need to be unique.
 */
export class BidirectionalMap<K, V> {

	private readonly _m1 = new Map<K, V>();
	private readonly _m2 = new Map<V, K>();

	constructor(entries?: readonly (readonly [K, V])[]) {
		if (entries) {
			for (const [key, value] of entries) {
				this.set(key, value);
			}
		}
	}

	clear(): void {
		this._m1.clear();
		this._m2.clear();
	}

	set(key: K, value: V): void {
		this._m1.set(key, value);
		this._m2.set(value, key);
	}

	get(key: K): V | undefined {
		return this._m1.get(key);
	}

	getKey(value: V): K | undefined {
		return this._m2.get(value);
	}

	delete(key: K): boolean {
		const value = this._m1.get(key);
		if (value === undefined) {
			return false;
		}
		this._m1.delete(key);
		this._m2.delete(value);
		return true;
	}

	forEach(callbackfn: (value: V, key: K, map: BidirectionalMap<K, V>) => void, thisArg?: unknown): void {
		this._m1.forEach((value, key) => {
			callbackfn.call(thisArg, value, key, this);
		});
	}

	keys(): IterableIterator<K> {
		return this._m1.keys();
	}

	values(): IterableIterator<V> {
		return this._m1.values();
	}
}

export class SetMap<K, V> {

	private map = new Map<K, Set<V>>();

	add(key: K, value: V): void {
		let values = this.map.get(key);

		if (!values) {
			values = new Set<V>();
			this.map.set(key, values);
		}

		values.add(value);
	}

	delete(key: K, value: V): void {
		const values = this.map.get(key);

		if (!values) {
			return;
		}

		values.delete(value);

		if (values.size === 0) {
			this.map.delete(key);
		}
	}

	forEach(key: K, fn: (value: V) => void): void {
		const values = this.map.get(key);

		if (!values) {
			return;
		}

		values.forEach(fn);
	}

	get(key: K): ReadonlySet<V> {
		const values = this.map.get(key);
		if (!values) {
			return new Set<V>();
		}
		return values;
	}
}

export function mapsStrictEqualIgnoreOrder(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean {
	if (a === b) {
		return true;
	}

	if (a.size !== b.size) {
		return false;
	}

	for (const [key, value] of a) {
		if (!b.has(key) || b.get(key) !== value) {
			return false;
		}
	}

	for (const [key] of b) {
		if (!a.has(key)) {
			return false;
		}
	}

	return true;
}

/**
 * A map that is addressable with an arbitrary number of keys. This is useful in high performance
 * scenarios where creating a composite key whenever the data is accessed is too expensive. For
 * example for a very hot function, constructing a string like `first-second-third` for every call
 * will cause a significant hit to performance.
 */
export class NKeyMap<TValue, TKeys extends (string | boolean | number)[]> {
	private _data: Map<any, any> = new Map();

	/**
	 * Sets a value on the map. Note that unlike a standard `Map`, the first argument is the value.
	 * This is because the spread operator is used for the keys and must be last..
	 * @param value The value to set.
	 * @param keys The keys for the value.
	 */
	public set(value: TValue, ...keys: [...TKeys]): void {
		let currentMap = this._data;
		for (let i = 0; i < keys.length - 1; i++) {
			let nextMap = currentMap.get(keys[i]);
			if (nextMap === undefined) {
				nextMap = new Map();
				currentMap.set(keys[i], nextMap);
			}
			currentMap = nextMap;
		}
		currentMap.set(keys[keys.length - 1], value);
	}

	public get(...keys: [...TKeys]): TValue | undefined {
		let currentMap = this._data;
		for (let i = 0; i < keys.length - 1; i++) {
			const nextMap = currentMap.get(keys[i]);
			if (nextMap === undefined) {
				return undefined;
			}
			currentMap = nextMap;
		}
		return currentMap.get(keys[keys.length - 1]);
	}

	public clear(): void {
		this._data.clear();
	}

	public *values(): IterableIterator<TValue> {
		function* iterate(map: Map<any, any>): IterableIterator<TValue> {
			for (const value of map.values()) {
				if (value instanceof Map) {
					yield* iterate(value);
				} else {
					yield value;
				}
			}
		}
		yield* iterate(this._data);
	}

	/**
	 * Get a textual representation of the map for debugging purposes.
	 */
	public toString(): string {
		const printMap = (map: Map<any, any>, depth: number): string => {
			let result = '';
			for (const [key, value] of map) {
				result += `${'  '.repeat(depth)}${key}: `;
				if (value instanceof Map) {
					result += '\n' + printMap(value, depth + 1);
				} else {
					result += `${value}\n`;
				}
			}
			return result;
		};

		return printMap(this._data, 0);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/marshalling.ts]---
Location: vscode-main/src/vs/base/common/marshalling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from './buffer.js';
import { URI, UriComponents } from './uri.js';
import { MarshalledId } from './marshallingIds.js';

export function stringify(obj: unknown): string {
	return JSON.stringify(obj, replacer);
}

export function parse(text: string): any {
	let data = JSON.parse(text);
	data = revive(data);
	return data;
}

export interface MarshalledObject {
	$mid: MarshalledId;
}

function replacer(key: string, value: any): any {
	// URI is done via toJSON-member
	if (value instanceof RegExp) {
		return {
			$mid: MarshalledId.Regexp,
			source: value.source,
			flags: value.flags,
		};
	}
	return value;
}


type Deserialize<T> = T extends UriComponents ? URI
	: T extends VSBuffer ? VSBuffer
	: T extends object
	? Revived<T>
	: T;

export type Revived<T> = { [K in keyof T]: Deserialize<T[K]> };

export function revive<T = any>(obj: any, depth = 0): Revived<T> {
	if (!obj || depth > 200) {
		return obj;
	}

	if (typeof obj === 'object') {

		switch ((<MarshalledObject>obj).$mid) {
			// eslint-disable-next-line local/code-no-any-casts
			case MarshalledId.Uri: return <any>URI.revive(obj);
			// eslint-disable-next-line local/code-no-any-casts
			case MarshalledId.Regexp: return <any>new RegExp(obj.source, obj.flags);
			// eslint-disable-next-line local/code-no-any-casts
			case MarshalledId.Date: return <any>new Date(obj.source);
		}

		if (
			obj instanceof VSBuffer
			|| obj instanceof Uint8Array
		) {
			// eslint-disable-next-line local/code-no-any-casts
			return <any>obj;
		}

		if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; ++i) {
				obj[i] = revive(obj[i], depth + 1);
			}
		} else {
			// walk object
			for (const key in obj) {
				if (Object.hasOwnProperty.call(obj, key)) {
					obj[key] = revive(obj[key], depth + 1);
				}
			}
		}
	}

	return obj;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/marshallingIds.ts]---
Location: vscode-main/src/vs/base/common/marshallingIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum MarshalledId {
	Uri = 1,
	Regexp,
	ScmResource,
	ScmResourceGroup,
	ScmProvider,
	CommentController,
	CommentThread,
	CommentThreadInstance,
	CommentThreadReply,
	CommentNode,
	CommentThreadNode,
	TimelineActionContext,
	NotebookCellActionContext,
	NotebookActionContext,
	TerminalContext,
	TestItemContext,
	Date,
	TestMessageMenuArgs,
	ChatViewContext,
	LanguageModelToolResult,
	LanguageModelTextPart,
	LanguageModelThinkingPart,
	LanguageModelPromptTsxPart,
	LanguageModelDataPart,
	AgentSessionContext,
	ChatResponsePullRequestPart,
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/mime.ts]---
Location: vscode-main/src/vs/base/common/mime.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extname } from './path.js';

export const Mimes = Object.freeze({
	text: 'text/plain',
	binary: 'application/octet-stream',
	unknown: 'application/unknown',
	markdown: 'text/markdown',
	latex: 'text/latex',
	uriList: 'text/uri-list',
	html: 'text/html',
});

interface MapExtToMediaMimes {
	[index: string]: string;
}

const mapExtToTextMimes: MapExtToMediaMimes = {
	'.css': 'text/css',
	'.csv': 'text/csv',
	'.htm': 'text/html',
	'.html': 'text/html',
	'.ics': 'text/calendar',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.txt': 'text/plain',
	'.xml': 'text/xml'
};

// Known media mimes that we can handle
const mapExtToMediaMimes: MapExtToMediaMimes = {
	'.aac': 'audio/x-aac',
	'.avi': 'video/x-msvideo',
	'.bmp': 'image/bmp',
	'.flv': 'video/x-flv',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
	'.jpe': 'image/jpg',
	'.jpeg': 'image/jpg',
	'.jpg': 'image/jpg',
	'.m1v': 'video/mpeg',
	'.m2a': 'audio/mpeg',
	'.m2v': 'video/mpeg',
	'.m3a': 'audio/mpeg',
	'.mid': 'audio/midi',
	'.midi': 'audio/midi',
	'.mk3d': 'video/x-matroska',
	'.mks': 'video/x-matroska',
	'.mkv': 'video/x-matroska',
	'.mov': 'video/quicktime',
	'.movie': 'video/x-sgi-movie',
	'.mp2': 'audio/mpeg',
	'.mp2a': 'audio/mpeg',
	'.mp3': 'audio/mpeg',
	'.mp4': 'video/mp4',
	'.mp4a': 'audio/mp4',
	'.mp4v': 'video/mp4',
	'.mpe': 'video/mpeg',
	'.mpeg': 'video/mpeg',
	'.mpg': 'video/mpeg',
	'.mpg4': 'video/mp4',
	'.mpga': 'audio/mpeg',
	'.oga': 'audio/ogg',
	'.ogg': 'audio/ogg',
	'.opus': 'audio/opus',
	'.ogv': 'video/ogg',
	'.png': 'image/png',
	'.psd': 'image/vnd.adobe.photoshop',
	'.qt': 'video/quicktime',
	'.spx': 'audio/ogg',
	'.svg': 'image/svg+xml',
	'.tga': 'image/x-tga',
	'.tif': 'image/tiff',
	'.tiff': 'image/tiff',
	'.wav': 'audio/x-wav',
	'.webm': 'video/webm',
	'.webp': 'image/webp',
	'.wma': 'audio/x-ms-wma',
	'.wmv': 'video/x-ms-wmv',
	'.woff': 'application/font-woff',
};

export function getMediaOrTextMime(path: string): string | undefined {
	const ext = extname(path);
	const textMime = mapExtToTextMimes[ext.toLowerCase()];
	if (textMime !== undefined) {
		return textMime;
	} else {
		return getMediaMime(path);
	}
}

export function getMediaMime(path: string): string | undefined {
	const ext = extname(path);
	return mapExtToMediaMimes[ext.toLowerCase()];
}

export function getExtensionForMimeType(mimeType: string): string | undefined {
	for (const extension in mapExtToMediaMimes) {
		if (mapExtToMediaMimes[extension] === mimeType) {
			return extension;
		}
	}

	return undefined;
}

const _simplePattern = /^(.+)\/(.+?)(;.+)?$/;

export function normalizeMimeType(mimeType: string): string;
export function normalizeMimeType(mimeType: string, strict: true): string | undefined;
export function normalizeMimeType(mimeType: string, strict?: true): string | undefined {

	const match = _simplePattern.exec(mimeType);
	if (!match) {
		return strict
			? undefined
			: mimeType;
	}
	// https://datatracker.ietf.org/doc/html/rfc2045#section-5.1
	// media and subtype must ALWAYS be lowercase, parameter not
	return `${match[1].toLowerCase()}/${match[2].toLowerCase()}${match[3] ?? ''}`;
}

/**
 * Whether the provided mime type is a text stream like `stdout`, `stderr`.
 */
export function isTextStreamMime(mimeType: string) {
	return ['application/vnd.code.notebook.stdout', 'application/vnd.code.notebook.stderr'].includes(mimeType);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/navigator.ts]---
Location: vscode-main/src/vs/base/common/navigator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface INavigator<T> {
	current(): T | null;
	previous(): T | null;
	first(): T | null;
	last(): T | null;
	next(): T | null;
}

export class ArrayNavigator<T> implements INavigator<T> {

	constructor(
		private readonly items: readonly T[],
		protected start: number = 0,
		protected end: number = items.length,
		protected index = start - 1
	) { }

	current(): T | null {
		if (this.index === this.start - 1 || this.index === this.end) {
			return null;
		}

		return this.items[this.index];
	}

	next(): T | null {
		this.index = Math.min(this.index + 1, this.end);
		return this.current();
	}

	previous(): T | null {
		this.index = Math.max(this.index - 1, this.start - 1);
		return this.current();
	}

	first(): T | null {
		this.index = this.start;
		return this.current();
	}

	last(): T | null {
		this.index = this.end - 1;
		return this.current();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/network.ts]---
Location: vscode-main/src/vs/base/common/network.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as errors from './errors.js';
import * as platform from './platform.js';
import { equalsIgnoreCase, startsWithIgnoreCase } from './strings.js';
import { URI } from './uri.js';
import * as paths from './path.js';

export namespace Schemas {

	/**
	 * A schema that is used for models that exist in memory
	 * only and that have no correspondence on a server or such.
	 */
	export const inMemory = 'inmemory';

	/**
	 * A schema that is used for setting files
	 */
	export const vscode = 'vscode';

	/**
	 * A schema that is used for internal private files
	 */
	export const internal = 'private';

	/**
	 * A walk-through document.
	 */
	export const walkThrough = 'walkThrough';

	/**
	 * An embedded code snippet.
	 */
	export const walkThroughSnippet = 'walkThroughSnippet';

	export const http = 'http';

	export const https = 'https';

	export const file = 'file';

	export const mailto = 'mailto';

	export const untitled = 'untitled';

	export const data = 'data';

	export const command = 'command';

	export const vscodeRemote = 'vscode-remote';

	export const vscodeRemoteResource = 'vscode-remote-resource';

	export const vscodeManagedRemoteResource = 'vscode-managed-remote-resource';

	export const vscodeUserData = 'vscode-userdata';

	export const vscodeCustomEditor = 'vscode-custom-editor';

	export const vscodeNotebookCell = 'vscode-notebook-cell';
	export const vscodeNotebookCellMetadata = 'vscode-notebook-cell-metadata';
	export const vscodeNotebookCellMetadataDiff = 'vscode-notebook-cell-metadata-diff';
	export const vscodeNotebookCellOutput = 'vscode-notebook-cell-output';
	export const vscodeNotebookCellOutputDiff = 'vscode-notebook-cell-output-diff';
	export const vscodeNotebookMetadata = 'vscode-notebook-metadata';
	export const vscodeInteractiveInput = 'vscode-interactive-input';

	export const vscodeSettings = 'vscode-settings';

	export const vscodeWorkspaceTrust = 'vscode-workspace-trust';

	export const vscodeTerminal = 'vscode-terminal';

	/** Scheme used for code blocks in chat. */
	export const vscodeChatCodeBlock = 'vscode-chat-code-block';

	/** Scheme used for LHS of code compare (aka diff) blocks in chat. */
	export const vscodeChatCodeCompareBlock = 'vscode-chat-code-compare-block';

	/** Scheme used for the chat input editor. */
	export const vscodeChatEditor = 'vscode-chat-editor';

	/** Scheme used for the chat input part */
	export const vscodeChatInput = 'chatSessionInput';

	/** Scheme used for local chat session content */
	export const vscodeLocalChatSession = 'vscode-chat-session';

	/**
	 * Scheme used internally for webviews that aren't linked to a resource (i.e. not custom editors)
	 */
	export const webviewPanel = 'webview-panel';

	/**
	 * Scheme used for loading the wrapper html and script in webviews.
	 */
	export const vscodeWebview = 'vscode-webview';

	/**
	 * Scheme used for extension pages
	 */
	export const extension = 'extension';

	/**
	 * Scheme used as a replacement of `file` scheme to load
	 * files with our custom protocol handler (desktop only).
	 */
	export const vscodeFileResource = 'vscode-file';

	/**
	 * Scheme used for temporary resources
	 */
	export const tmp = 'tmp';

	/**
	 * Scheme used vs live share
	 */
	export const vsls = 'vsls';

	/**
	 * Scheme used for the Source Control commit input's text document
	 */
	export const vscodeSourceControl = 'vscode-scm';

	/**
	 * Scheme used for input box for creating comments.
	 */
	export const commentsInput = 'comment';

	/**
	 * Scheme used for special rendering of settings in the release notes
	 */
	export const codeSetting = 'code-setting';

	/**
	 * Scheme used for output panel resources
	 */
	export const outputChannel = 'output';

	/**
	 * Scheme used for the accessible view
	 */
	export const accessibleView = 'accessible-view';

	/**
	 * Used for snapshots of chat edits
	 */
	export const chatEditingSnapshotScheme = 'chat-editing-snapshot-text-model';
	export const chatEditingModel = 'chat-editing-text-model';

	/**
	 * Used for rendering multidiffs in copilot agent sessions
	 */
	export const copilotPr = 'copilot-pr';
}

export function matchesScheme(target: URI | string, scheme: string): boolean {
	if (URI.isUri(target)) {
		return equalsIgnoreCase(target.scheme, scheme);
	} else {
		return startsWithIgnoreCase(target, scheme + ':');
	}
}

export function matchesSomeScheme(target: URI | string, ...schemes: string[]): boolean {
	return schemes.some(scheme => matchesScheme(target, scheme));
}

export const connectionTokenCookieName = 'vscode-tkn';
export const connectionTokenQueryName = 'tkn';

class RemoteAuthoritiesImpl {
	private readonly _hosts: { [authority: string]: string | undefined } = Object.create(null);
	private readonly _ports: { [authority: string]: number | undefined } = Object.create(null);
	private readonly _connectionTokens: { [authority: string]: string | undefined } = Object.create(null);
	private _preferredWebSchema: 'http' | 'https' = 'http';
	private _delegate: ((uri: URI) => URI) | null = null;
	private _serverRootPath: string = '/';

	setPreferredWebSchema(schema: 'http' | 'https') {
		this._preferredWebSchema = schema;
	}

	setDelegate(delegate: (uri: URI) => URI): void {
		this._delegate = delegate;
	}

	setServerRootPath(product: { quality?: string; commit?: string }, serverBasePath: string | undefined): void {
		this._serverRootPath = paths.posix.join(serverBasePath ?? '/', getServerProductSegment(product));
	}

	getServerRootPath(): string {
		return this._serverRootPath;
	}

	private get _remoteResourcesPath(): string {
		return paths.posix.join(this._serverRootPath, Schemas.vscodeRemoteResource);
	}

	set(authority: string, host: string, port: number): void {
		this._hosts[authority] = host;
		this._ports[authority] = port;
	}

	setConnectionToken(authority: string, connectionToken: string): void {
		this._connectionTokens[authority] = connectionToken;
	}

	getPreferredWebSchema(): 'http' | 'https' {
		return this._preferredWebSchema;
	}

	rewrite(uri: URI): URI {
		if (this._delegate) {
			try {
				return this._delegate(uri);
			} catch (err) {
				errors.onUnexpectedError(err);
				return uri;
			}
		}
		const authority = uri.authority;
		let host = this._hosts[authority];
		if (host && host.indexOf(':') !== -1 && host.indexOf('[') === -1) {
			host = `[${host}]`;
		}
		const port = this._ports[authority];
		const connectionToken = this._connectionTokens[authority];
		let query = `path=${encodeURIComponent(uri.path)}`;
		if (typeof connectionToken === 'string') {
			query += `&${connectionTokenQueryName}=${encodeURIComponent(connectionToken)}`;
		}
		return URI.from({
			scheme: platform.isWeb ? this._preferredWebSchema : Schemas.vscodeRemoteResource,
			authority: `${host}:${port}`,
			path: this._remoteResourcesPath,
			query
		});
	}
}

export const RemoteAuthorities = new RemoteAuthoritiesImpl();

export function getServerProductSegment(product: { quality?: string; commit?: string }) {
	return `${product.quality ?? 'oss'}-${product.commit ?? 'dev'}`;
}

/**
 * A string pointing to a path inside the app. It should not begin with ./ or ../
 */
export type AppResourcePath = (
	`a${string}` | `b${string}` | `c${string}` | `d${string}` | `e${string}` | `f${string}`
	| `g${string}` | `h${string}` | `i${string}` | `j${string}` | `k${string}` | `l${string}`
	| `m${string}` | `n${string}` | `o${string}` | `p${string}` | `q${string}` | `r${string}`
	| `s${string}` | `t${string}` | `u${string}` | `v${string}` | `w${string}` | `x${string}`
	| `y${string}` | `z${string}`
);

export const builtinExtensionsPath: AppResourcePath = 'vs/../../extensions';
export const nodeModulesPath: AppResourcePath = 'vs/../../node_modules';
export const nodeModulesAsarPath: AppResourcePath = 'vs/../../node_modules.asar';
export const nodeModulesAsarUnpackedPath: AppResourcePath = 'vs/../../node_modules.asar.unpacked';

export const VSCODE_AUTHORITY = 'vscode-app';

class FileAccessImpl {

	private static readonly FALLBACK_AUTHORITY = VSCODE_AUTHORITY;

	/**
	 * Returns a URI to use in contexts where the browser is responsible
	 * for loading (e.g. fetch()) or when used within the DOM.
	 *
	 * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
	 */
	asBrowserUri(resourcePath: AppResourcePath | ''): URI {
		const uri = this.toUri(resourcePath);
		return this.uriToBrowserUri(uri);
	}

	/**
	 * Returns a URI to use in contexts where the browser is responsible
	 * for loading (e.g. fetch()) or when used within the DOM.
	 *
	 * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
	 */
	uriToBrowserUri(uri: URI): URI {
		// Handle remote URIs via `RemoteAuthorities`
		if (uri.scheme === Schemas.vscodeRemote) {
			return RemoteAuthorities.rewrite(uri);
		}

		// Convert to `vscode-file` resource..
		if (
			// ...only ever for `file` resources
			uri.scheme === Schemas.file &&
			(
				// ...and we run in native environments
				platform.isNative ||
				// ...or web worker extensions on desktop
				(platform.webWorkerOrigin === `${Schemas.vscodeFileResource}://${FileAccessImpl.FALLBACK_AUTHORITY}`)
			)
		) {
			return uri.with({
				scheme: Schemas.vscodeFileResource,
				// We need to provide an authority here so that it can serve
				// as origin for network and loading matters in chromium.
				// If the URI is not coming with an authority already, we
				// add our own
				authority: uri.authority || FileAccessImpl.FALLBACK_AUTHORITY,
				query: null,
				fragment: null
			});
		}

		return uri;
	}

	/**
	 * Returns the `file` URI to use in contexts where node.js
	 * is responsible for loading.
	 */
	asFileUri(resourcePath: AppResourcePath | ''): URI {
		const uri = this.toUri(resourcePath);
		return this.uriToFileUri(uri);
	}

	/**
	 * Returns the `file` URI to use in contexts where node.js
	 * is responsible for loading.
	 */
	uriToFileUri(uri: URI): URI {
		// Only convert the URI if it is `vscode-file:` scheme
		if (uri.scheme === Schemas.vscodeFileResource) {
			return uri.with({
				scheme: Schemas.file,
				// Only preserve the `authority` if it is different from
				// our fallback authority. This ensures we properly preserve
				// Windows UNC paths that come with their own authority.
				authority: uri.authority !== FileAccessImpl.FALLBACK_AUTHORITY ? uri.authority : null,
				query: null,
				fragment: null
			});
		}

		return uri;
	}

	private toUri(uriOrModule: URI | string): URI {
		if (URI.isUri(uriOrModule)) {
			return uriOrModule;
		}

		if (globalThis._VSCODE_FILE_ROOT) {
			const rootUriOrPath = globalThis._VSCODE_FILE_ROOT;

			// File URL (with scheme)
			if (/^\w[\w\d+.-]*:\/\//.test(rootUriOrPath)) {
				return URI.joinPath(URI.parse(rootUriOrPath, true), uriOrModule);
			}

			// File Path (no scheme)
			const modulePath = paths.join(rootUriOrPath, uriOrModule);
			return URI.file(modulePath);
		}

		throw new Error('Cannot determine URI for module id!');
	}
}

export const FileAccess = new FileAccessImpl();

export const CacheControlheaders: Record<string, string> = Object.freeze({
	'Cache-Control': 'no-cache, no-store'
});

export const DocumentPolicyheaders: Record<string, string> = Object.freeze({
	'Document-Policy': 'include-js-call-stacks-in-crash-reports'
});

export namespace COI {

	const coiHeaders = new Map<'3' | '2' | '1' | string, Record<string, string>>([
		['1', { 'Cross-Origin-Opener-Policy': 'same-origin' }],
		['2', { 'Cross-Origin-Embedder-Policy': 'require-corp' }],
		['3', { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' }],
	]);

	export const CoopAndCoep = Object.freeze(coiHeaders.get('3'));

	const coiSearchParamName = 'vscode-coi';

	/**
	 * Extract desired headers from `vscode-coi` invocation
	 */
	export function getHeadersFromQuery(url: string | URI | URL): Record<string, string> | undefined {
		let params: URLSearchParams | undefined;
		if (typeof url === 'string') {
			params = new URL(url).searchParams;
		} else if (url instanceof URL) {
			params = url.searchParams;
		} else if (URI.isUri(url)) {
			params = new URL(url.toString(true)).searchParams;
		}
		const value = params?.get(coiSearchParamName);
		if (!value) {
			return undefined;
		}
		return coiHeaders.get(value);
	}

	/**
	 * Add the `vscode-coi` query attribute based on wanting `COOP` and `COEP`. Will be a noop when `crossOriginIsolated`
	 * isn't enabled the current context
	 */
	export function addSearchParam(urlOrSearch: URLSearchParams | Record<string, string>, coop: boolean, coep: boolean): void {
		if (!(globalThis as typeof globalThis & { crossOriginIsolated?: boolean }).crossOriginIsolated) {
			// depends on the current context being COI
			return;
		}
		const value = coop && coep ? '3' : coep ? '2' : '1';
		if (urlOrSearch instanceof URLSearchParams) {
			urlOrSearch.set(coiSearchParamName, value);
		} else {
			urlOrSearch[coiSearchParamName] = value;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/normalization.ts]---
Location: vscode-main/src/vs/base/common/normalization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LRUCache } from './map.js';

const nfcCache = new LRUCache<string, string>(10000); // bounded to 10000 elements
export function normalizeNFC(str: string): string {
	return normalize(str, 'NFC', nfcCache);
}

const nfdCache = new LRUCache<string, string>(10000); // bounded to 10000 elements
export function normalizeNFD(str: string): string {
	return normalize(str, 'NFD', nfdCache);
}

const nonAsciiCharactersPattern = /[^\u0000-\u0080]/;
function normalize(str: string, form: string, normalizedCache: LRUCache<string, string>): string {
	if (!str) {
		return str;
	}

	const cached = normalizedCache.get(str);
	if (cached) {
		return cached;
	}

	let res: string;
	if (nonAsciiCharactersPattern.test(str)) {
		res = str.normalize(form);
	} else {
		res = str;
	}

	// Use the cache for fast lookup
	normalizedCache.set(str, res);

	return res;
}

/**
 * Attempts to normalize the string to Unicode base format (NFD -> remove accents -> lower case).
 * When original string contains accent characters directly, only lower casing will be performed.
 * This is done so as to keep the string length the same and not affect indices.
 *
 * @see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 */
export const tryNormalizeToBase: (str: string) => string = function () {
	const cache = new LRUCache<string, string>(10000); // bounded to 10000 elements
	const accentsRegex = /[\u0300-\u036f]/g;
	return function (str: string): string {
		const cached = cache.get(str);
		if (cached) {
			return cached;
		}

		const noAccents = normalizeNFD(str).replace(accentsRegex, '');
		const result = (noAccents.length === str.length ? noAccents : str).toLowerCase();
		cache.set(str, result);
		return result;
	};
}();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/numbers.ts]---
Location: vscode-main/src/vs/base/common/numbers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert } from './assert.js';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function rot(index: number, modulo: number): number {
	return (modulo + (index % modulo)) % modulo;
}

export class Counter {
	private _next = 0;

	getNext(): number {
		return this._next++;
	}
}

export class MovingAverage {

	private _n = 1;
	private _val = 0;

	update(value: number): number {
		this._val = this._val + (value - this._val) / this._n;
		this._n += 1;
		return this._val;
	}

	get value(): number {
		return this._val;
	}
}

export class SlidingWindowAverage {

	private _n: number = 0;
	private _val = 0;

	private readonly _values: number[] = [];
	private _index: number = 0;
	private _sum = 0;

	constructor(size: number) {
		this._values = new Array(size);
		this._values.fill(0, 0, size);
	}

	update(value: number): number {
		const oldValue = this._values[this._index];
		this._values[this._index] = value;
		this._index = (this._index + 1) % this._values.length;

		this._sum -= oldValue;
		this._sum += value;

		if (this._n < this._values.length) {
			this._n += 1;
		}

		this._val = this._sum / this._n;
		return this._val;
	}

	get value(): number {
		return this._val;
	}
}

/** Returns whether the point is within the triangle formed by the following 6 x/y point pairs */
export function isPointWithinTriangle(
	x: number, y: number,
	ax: number, ay: number,
	bx: number, by: number,
	cx: number, cy: number
) {
	const v0x = cx - ax;
	const v0y = cy - ay;
	const v1x = bx - ax;
	const v1y = by - ay;
	const v2x = x - ax;
	const v2y = y - ay;

	const dot00 = v0x * v0x + v0y * v0y;
	const dot01 = v0x * v1x + v0y * v1y;
	const dot02 = v0x * v2x + v0y * v2y;
	const dot11 = v1x * v1x + v1y * v1y;
	const dot12 = v1x * v2x + v1y * v2y;

	const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return u >= 0 && v >= 0 && u + v < 1;
}

export function randomChance(p: number): boolean {
	assert(p >= 0 && p <= 1, 'p must be between 0 and 1');
	return Math.random() < p;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/oauth.ts]---
Location: vscode-main/src/vs/base/common/oauth.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64 } from './buffer.js';

const WELL_KNOWN_ROUTE = '/.well-known';
export const AUTH_PROTECTED_RESOURCE_METADATA_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/oauth-protected-resource`;
export const AUTH_SERVER_METADATA_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/oauth-authorization-server`;
export const OPENID_CONNECT_DISCOVERY_PATH = `${WELL_KNOWN_ROUTE}/openid-configuration`;
export const AUTH_SCOPE_SEPARATOR = ' ';

//#region types

/**
 * Base OAuth 2.0 error codes as specified in RFC 6749.
 */
export const enum AuthorizationErrorType {
	InvalidRequest = 'invalid_request',
	InvalidClient = 'invalid_client',
	InvalidGrant = 'invalid_grant',
	UnauthorizedClient = 'unauthorized_client',
	UnsupportedGrantType = 'unsupported_grant_type',
	InvalidScope = 'invalid_scope'
}

/**
 * Device authorization grant specific error codes as specified in RFC 8628 section 3.5.
 */
export const enum AuthorizationDeviceCodeErrorType {
	/**
	 * The authorization request is still pending as the end user hasn't completed the user interaction steps.
	 */
	AuthorizationPending = 'authorization_pending',
	/**
	 * A variant of "authorization_pending", polling should continue but interval must be increased by 5 seconds.
	 */
	SlowDown = 'slow_down',
	/**
	 * The authorization request was denied.
	 */
	AccessDenied = 'access_denied',
	/**
	 * The "device_code" has expired and the device authorization session has concluded.
	 */
	ExpiredToken = 'expired_token'
}

/**
 * Dynamic client registration specific error codes as specified in RFC 7591.
 */
export const enum AuthorizationRegistrationErrorType {
	/**
	 * The value of one or more redirection URIs is invalid.
	 */
	InvalidRedirectUri = 'invalid_redirect_uri',
	/**
	 * The value of one of the client metadata fields is invalid and the server has rejected this request.
	 */
	InvalidClientMetadata = 'invalid_client_metadata',
	/**
	 * The software statement presented is invalid.
	 */
	InvalidSoftwareStatement = 'invalid_software_statement',
	/**
	 * The software statement presented is not approved for use by this authorization server.
	 */
	UnapprovedSoftwareStatement = 'unapproved_software_statement'
}

/**
 * Metadata about a protected resource.
 */
export interface IAuthorizationProtectedResourceMetadata {
	/**
	 * REQUIRED. The protected resource's resource identifier URL that uses https scheme and has no fragment components.
	 */
	resource: string;

	/**
	 * OPTIONAL. Human-readable name of the protected resource intended for display to the end user.
	 */
	resource_name?: string;

	/**
	 * OPTIONAL. JSON array containing a list of OAuth authorization server identifiers.
	 */
	authorization_servers?: string[];

	/**
	 * OPTIONAL. URL of the protected resource's JWK Set document.
	 */
	jwks_uri?: string;

	/**
	 * RECOMMENDED. JSON array containing a list of the OAuth 2.0 scope values used in authorization requests.
	 */
	scopes_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the OAuth 2.0 Bearer Token presentation methods supported.
	 */
	bearer_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWS signing algorithms supported.
	 */
	resource_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWE encryption algorithms supported.
	 */
	resource_encryption_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the JWE encryption algorithms supported.
	 */
	resource_encryption_enc_values_supported?: string[];

	/**
	 * OPTIONAL. URL of a page containing human-readable documentation.
	 */
	resource_documentation?: string;

	/**
	 * OPTIONAL. URL that provides the resource's requirements on how clients can use the data.
	 */
	resource_policy_uri?: string;

	/**
	 * OPTIONAL. URL that provides the resource's terms of service.
	 */
	resource_tos_uri?: string;
}

/**
 * Metadata about an OAuth 2.0 Authorization Server.
 */
export interface IAuthorizationServerMetadata {
	/**
	 * REQUIRED. The authorization server's issuer identifier URL that uses https scheme and has no query or fragment components.
	 */
	issuer: string;

	/**
	 * URL of the authorization server's authorization endpoint.
	 * This is REQUIRED unless no grant types are supported that use the authorization endpoint.
	 */
	authorization_endpoint?: string;

	/**
	 * URL of the authorization server's token endpoint.
	 * This is REQUIRED unless only the implicit grant type is supported.
	 */
	token_endpoint?: string;

	/**
	 * OPTIONAL. URL of the authorization server's device code endpoint.
	 */
	device_authorization_endpoint?: string;

	/**
	 * OPTIONAL. URL of the authorization server's JWK Set document containing signing keys.
	 */
	jwks_uri?: string;

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 Dynamic Client Registration endpoint.
	 */
	registration_endpoint?: string;

	/**
	 * RECOMMENDED. JSON array containing a list of the OAuth 2.0 scope values supported.
	 */
	scopes_supported?: string[];

	/**
	 * REQUIRED. JSON array containing a list of the OAuth 2.0 response_type values supported.
	 */
	response_types_supported: string[];

	/**
	 * OPTIONAL. JSON array containing a list of the OAuth 2.0 response_mode values supported.
	 * Default is ["query", "fragment"].
	 */
	response_modes_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of OAuth 2.0 grant type values supported.
	 * Default is ["authorization_code", "implicit"].
	 */
	grant_types_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the token endpoint.
	 * Default is "client_secret_basic".
	 */
	token_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the token endpoint.
	 */
	token_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. URL of a page containing human-readable documentation for developers.
	 */
	service_documentation?: string;

	/**
	 * OPTIONAL. Languages and scripts supported for the user interface, as a JSON array of BCP 47 language tags.
	 */
	ui_locales_supported?: string[];

	/**
	 * OPTIONAL. URL that the authorization server provides to read about the authorization server's requirements.
	 */
	op_policy_uri?: string;

	/**
	 * OPTIONAL. URL that the authorization server provides to read about the authorization server's terms of service.
	 */
	op_tos_uri?: string;

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 revocation endpoint.
	 */
	revocation_endpoint?: string;

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the revocation endpoint.
	 */
	revocation_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the revocation endpoint.
	 */
	revocation_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. URL of the authorization server's OAuth 2.0 introspection endpoint.
	 */
	introspection_endpoint?: string;

	/**
	 * OPTIONAL. JSON array containing a list of client authentication methods supported by the introspection endpoint.
	 */
	introspection_endpoint_auth_methods_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of JWS signing algorithms supported by the introspection endpoint.
	 */
	introspection_endpoint_auth_signing_alg_values_supported?: string[];

	/**
	 * OPTIONAL. JSON array containing a list of PKCE code challenge methods supported.
	 */
	code_challenge_methods_supported?: string[];

	/**
	 * OPTIONAL. Boolean flag indicating whether the authorization server supports the
	 * client_id_metadata document.
	 * ref https://datatracker.ietf.org/doc/html/draft-parecki-oauth-client-id-metadata-document-03
	 */
	client_id_metadata_document_supported?: boolean;
}

/**
 * Request for the dynamic client registration endpoint.
 * @see https://datatracker.ietf.org/doc/html/rfc7591#section-2
 */
export interface IAuthorizationDynamicClientRegistrationRequest {
	/**
	 * OPTIONAL. Array of redirection URI strings for use in redirect-based flows
	 * such as the authorization code and implicit flows.
	 */
	redirect_uris?: string[];

	/**
	 * OPTIONAL. String indicator of the requested authentication method for the token endpoint.
	 * Values: "none", "client_secret_post", "client_secret_basic".
	 * Default is "client_secret_basic".
	 */
	token_endpoint_auth_method?: string;

	/**
	 * OPTIONAL. Array of OAuth 2.0 grant type strings that the client can use at the token endpoint.
	 * Default is ["authorization_code"].
	 */
	grant_types?: string[];

	/**
	 * OPTIONAL. Array of the OAuth 2.0 response type strings that the client can use at the authorization endpoint.
	 * Default is ["code"].
	 */
	response_types?: string[];

	/**
	 * OPTIONAL. Human-readable string name of the client to be presented to the end-user during authorization.
	 */
	client_name?: string;

	/**
	 * OPTIONAL. URL string of a web page providing information about the client.
	 */
	client_uri?: string;

	/**
	 * OPTIONAL. URL string that references a logo for the client.
	 */
	logo_uri?: string;

	/**
	 * OPTIONAL. String containing a space-separated list of scope values that the client can use when requesting access tokens.
	 */
	scope?: string;

	/**
	 * OPTIONAL. Array of strings representing ways to contact people responsible for this client, typically email addresses.
	 */
	contacts?: string[];

	/**
	 * OPTIONAL. URL string that points to a human-readable terms of service document for the client.
	 */
	tos_uri?: string;

	/**
	 * OPTIONAL. URL string that points to a human-readable privacy policy document.
	 */
	policy_uri?: string;

	/**
	 * OPTIONAL. URL string referencing the client's JSON Web Key (JWK) Set document.
	 */
	jwks_uri?: string;

	/**
	 * OPTIONAL. Client's JSON Web Key Set document value.
	 */
	jwks?: object;

	/**
	 * OPTIONAL. A unique identifier string assigned by the client developer or software publisher.
	 */
	software_id?: string;

	/**
	 * OPTIONAL. A version identifier string for the client software.
	 */
	software_version?: string;

	/**
	 * OPTIONAL. A software statement containing client metadata values about the client software as claims.
	 */
	software_statement?: string;

	/**
	 * OPTIONAL. Application type. Usually "native" for OAuth clients.
	 * https://openid.net/specs/openid-connect-registration-1_0.html
	 */
	application_type?: 'native' | 'web' | string;

	/**
	 * OPTIONAL. Additional metadata fields as defined by extensions.
	 */
	[key: string]: unknown;
}

/**
 * Response from the dynamic client registration endpoint.
 */
export interface IAuthorizationDynamicClientRegistrationResponse {
	/**
	 * REQUIRED. The client identifier issued by the authorization server.
	 */
	client_id: string;

	/**
	 * OPTIONAL. The client secret issued by the authorization server.
	 * Not returned for public clients.
	 */
	client_secret?: string;

	/**
	 * OPTIONAL. Time at which the client secret will expire in seconds since the Unix Epoch.
	 */
	client_secret_expires_at?: number;

	/**
	 * OPTIONAL. Client name as provided during registration.
	 */
	client_name?: string;

	/**
	 * OPTIONAL. Client URI as provided during registration.
	 */
	client_uri?: string;

	/**
	 * OPTIONAL. Array of redirection URIs as provided during registration.
	 */
	redirect_uris?: string[];

	/**
	 * OPTIONAL. Array of grant types allowed for the client.
	 */
	grant_types?: string[];

	/**
	 * OPTIONAL. Array of response types allowed for the client.
	 */
	response_types?: string[];

	/**
	 * OPTIONAL. Type of authentication method used by the client.
	 */
	token_endpoint_auth_method?: string;
}

/**
 * Response from the authorization endpoint.
 * Typically returned as query parameters in a redirect.
 */
export interface IAuthorizationAuthorizeResponse {
	/**
	 * REQUIRED. The authorization code generated by the authorization server.
	 */
	code: string;

	/**
	 * REQUIRED. The state value that was sent in the authorization request.
	 * Used to prevent CSRF attacks.
	 */
	state: string;
}

/**
 * Error response from the authorization endpoint.
 */
export interface IAuthorizationAuthorizeErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0.
	 */
	error: string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;

	/**
	 * REQUIRED. The state value that was sent in the authorization request.
	 */
	state: string;
}

/**
 * Response from the token endpoint.
 */
export interface IAuthorizationTokenResponse {
	/**
	 * REQUIRED. The access token issued by the authorization server.
	 */
	access_token: string;

	/**
	 * REQUIRED. The type of the token issued. Usually "Bearer".
	 */
	token_type: string;

	/**
	 * RECOMMENDED. The lifetime in seconds of the access token.
	 */
	expires_in?: number;

	/**
	 * OPTIONAL. The refresh token, which can be used to obtain new access tokens.
	 */
	refresh_token?: string;

	/**
	 * OPTIONAL. The scope of the access token as a space-delimited list of strings.
	 */
	scope?: string;

	/**
	 * OPTIONAL. ID Token value associated with the authenticated session for OpenID Connect flows.
	 */
	id_token?: string;
}

/**
 * Error response from the token endpoint.
 */
export interface IAuthorizationTokenErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0.
	 */
	error: string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;
}

/**
 * Response from the device authorization endpoint as per RFC 8628 section 3.2.
 */
export interface IAuthorizationDeviceResponse {
	/**
	 * REQUIRED. The device verification code.
	 */
	device_code: string;

	/**
	 * REQUIRED. The end-user verification code.
	 */
	user_code: string;

	/**
	 * REQUIRED. The end-user verification URI on the authorization server.
	 */
	verification_uri: string;

	/**
	 * OPTIONAL. A verification URI that includes the user_code, designed for non-textual transmission.
	 */
	verification_uri_complete?: string;

	/**
	 * REQUIRED. The lifetime in seconds of the device_code and user_code.
	 */
	expires_in: number;

	/**
	 * OPTIONAL. The minimum amount of time in seconds that the client should wait between polling requests.
	 * If no value is provided, clients must use 5 as the default.
	 */
	interval?: number;
}

/**
 * Error response from the token endpoint when using device authorization grant.
 * As defined in RFC 8628 section 3.5.
 */
export interface IAuthorizationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or in RFC 8628 section 3.5.
	 */
	error: AuthorizationErrorType | string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;

	/**
	 * OPTIONAL. URI to a human-readable web page with more information about the error.
	 */
	error_uri?: string;
}

/**
 * Error response from the token endpoint when using device authorization grant.
 * As defined in RFC 8628 section 3.5.
 */
export interface IAuthorizationDeviceTokenErrorResponse extends IAuthorizationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or in RFC 8628 section 3.5.
	 */
	error: AuthorizationErrorType | AuthorizationDeviceCodeErrorType | string;
}

export interface IAuthorizationRegistrationErrorResponse {
	/**
	 * REQUIRED. Error code as specified in OAuth 2.0 or Dynamic Client Registration.
	 */
	error: AuthorizationRegistrationErrorType | string;

	/**
	 * OPTIONAL. Human-readable description of the error.
	 */
	error_description?: string;
}

export interface IAuthorizationJWTClaims {
	/**
	 * REQUIRED. JWT ID. Unique identifier for the token.
	 */
	jti: string;

	/**
	 * REQUIRED. Subject. Principal about which the token asserts information.
	 */
	sub: string;

	/**
	 * REQUIRED. Issuer. Entity that issued the token.
	 */
	iss: string;

	/**
	 * OPTIONAL. Audience. Recipients that the token is intended for.
	 */
	aud?: string | string[];

	/**
	 * OPTIONAL. Expiration time. Time after which the token is invalid (seconds since Unix epoch).
	 */
	exp?: number;

	/**
	 * OPTIONAL. Not before time. Time before which the token is not valid (seconds since Unix epoch).
	 */
	nbf?: number;

	/**
	 * OPTIONAL. Issued at time when the token was issued (seconds since Unix epoch).
	 */
	iat?: number;

	/**
	 * OPTIONAL. Authorized party. The party to which the token was issued.
	 */
	azp?: string;

	/**
	 * OPTIONAL. Scope values for which the token is valid.
	 */
	scope?: string;

	/**
	 * OPTIONAL. Full name of the user.
	 */
	name?: string;

	/**
	 * OPTIONAL. Given or first name of the user.
	 */
	given_name?: string;

	/**
	 * OPTIONAL. Family name or last name of the user.
	 */
	family_name?: string;

	/**
	 * OPTIONAL. Middle name of the user.
	 */
	middle_name?: string;

	/**
	 * OPTIONAL. Preferred username or email the user wishes to be referred to.
	 */
	preferred_username?: string;

	/**
	 * OPTIONAL. Email address of the user.
	 */
	email?: string;

	/**
	 * OPTIONAL. True if the user's email has been verified.
	 */
	email_verified?: boolean;

	/**
	 * OPTIONAL. User's profile picture URL.
	 */
	picture?: string;

	/**
	 * OPTIONAL. Authentication time. Time when the user authentication occurred.
	 */
	auth_time?: number;

	/**
	 * OPTIONAL. Authentication context class reference.
	 */
	acr?: string;

	/**
	 * OPTIONAL. Authentication methods references.
	 */
	amr?: string[];

	/**
	 * OPTIONAL. Session ID. String identifier for a session.
	 */
	sid?: string;

	/**
	 * OPTIONAL. Address component.
	 */
	address?: {
		formatted?: string;
		street_address?: string;
		locality?: string;
		region?: string;
		postal_code?: string;
		country?: string;
	};

	/**
	 * OPTIONAL. Groups that the user belongs to.
	 */
	groups?: string[];

	/**
	 * OPTIONAL. Roles assigned to the user.
	 */
	roles?: string[];

	/**
	 * OPTIONAL. Handles optional claims that are not explicitly defined in the standard.
	 */
	[key: string]: unknown;
}

//#endregion

//#region is functions

export function isAuthorizationProtectedResourceMetadata(obj: unknown): obj is IAuthorizationProtectedResourceMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const metadata = obj as IAuthorizationProtectedResourceMetadata;
	if (!metadata.resource) {
		return false;
	}
	if (metadata.scopes_supported !== undefined && !Array.isArray(metadata.scopes_supported)) {
		return false;
	}
	return true;
}

const urisToCheck: Array<keyof IAuthorizationServerMetadata> = [
	'issuer',
	'authorization_endpoint',
	'token_endpoint',
	'registration_endpoint',
	'jwks_uri'
];
export function isAuthorizationServerMetadata(obj: unknown): obj is IAuthorizationServerMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const metadata = obj as IAuthorizationServerMetadata;
	if (!metadata.issuer) {
		throw new Error('Authorization server metadata must have an issuer');
	}

	for (const uri of urisToCheck) {
		if (!metadata[uri]) {
			continue;
		}
		if (typeof metadata[uri] !== 'string') {
			throw new Error(`Authorization server metadata '${uri}' must be a string`);
		}
		if (!metadata[uri].startsWith('https://') && !metadata[uri].startsWith('http://')) {
			throw new Error(`Authorization server metadata '${uri}' must start with http:// or https://`);
		}
	}
	return true;
}

export function isAuthorizationDynamicClientRegistrationResponse(obj: unknown): obj is IAuthorizationDynamicClientRegistrationResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationDynamicClientRegistrationResponse;
	return response.client_id !== undefined;
}

export function isAuthorizationAuthorizeResponse(obj: unknown): obj is IAuthorizationAuthorizeResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationAuthorizeResponse;
	return response.code !== undefined && response.state !== undefined;
}

export function isAuthorizationTokenResponse(obj: unknown): obj is IAuthorizationTokenResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationTokenResponse;
	return response.access_token !== undefined && response.token_type !== undefined;
}

export function isAuthorizationDeviceResponse(obj: unknown): obj is IAuthorizationDeviceResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationDeviceResponse;
	return response.device_code !== undefined && response.user_code !== undefined && response.verification_uri !== undefined && response.expires_in !== undefined;
}

export function isAuthorizationErrorResponse(obj: unknown): obj is IAuthorizationErrorResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationErrorResponse;
	return response.error !== undefined;
}

export function isAuthorizationRegistrationErrorResponse(obj: unknown): obj is IAuthorizationRegistrationErrorResponse {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const response = obj as IAuthorizationRegistrationErrorResponse;
	return response.error !== undefined;
}

//#endregion

export function getDefaultMetadataForUrl(authorizationServer: URL): IAuthorizationServerMetadata {
	return {
		issuer: authorizationServer.toString(),
		authorization_endpoint: new URL('/authorize', authorizationServer).toString(),
		token_endpoint: new URL('/token', authorizationServer).toString(),
		registration_endpoint: new URL('/register', authorizationServer).toString(),
		// Default values for Dynamic OpenID Providers
		// https://openid.net/specs/openid-connect-discovery-1_0.html
		response_types_supported: ['code', 'id_token', 'id_token token'],
	};
}

/**
 * The grant types that we support
 */
const grantTypesSupported = ['authorization_code', 'refresh_token', 'urn:ietf:params:oauth:grant-type:device_code'];

/**
 * Default port for the authorization flow. We try to use this port so that
 * the redirect URI does not change when running on localhost. This is useful
 * for servers that only allow exact matches on the redirect URI. The spec
 * says that the port should not matter, but some servers do not follow
 * the spec and require an exact match.
 */
export const DEFAULT_AUTH_FLOW_PORT = 33418;
export async function fetchDynamicRegistration(serverMetadata: IAuthorizationServerMetadata, clientName: string, scopes?: string[]): Promise<IAuthorizationDynamicClientRegistrationResponse> {
	if (!serverMetadata.registration_endpoint) {
		throw new Error('Server does not support dynamic registration');
	}

	const requestBody: IAuthorizationDynamicClientRegistrationRequest = {
		client_name: clientName,
		client_uri: 'https://code.visualstudio.com',
		grant_types: serverMetadata.grant_types_supported
			? serverMetadata.grant_types_supported.filter(gt => grantTypesSupported.includes(gt))
			: grantTypesSupported,
		response_types: ['code'],
		redirect_uris: [
			'https://insiders.vscode.dev/redirect',
			'https://vscode.dev/redirect',
			'http://127.0.0.1/',
			// Added these for any server that might do
			// only exact match on the redirect URI even
			// though the spec says it should not care
			// about the port.
			`http://127.0.0.1:${DEFAULT_AUTH_FLOW_PORT}/`
		],
		scope: scopes?.join(AUTH_SCOPE_SEPARATOR),
		token_endpoint_auth_method: 'none',
		application_type: 'native'
	};

	const response = await fetch(serverMetadata.registration_endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		const result = await response.text();
		let errorDetails: string = result;

		try {
			const errorResponse = JSON.parse(result);
			if (isAuthorizationRegistrationErrorResponse(errorResponse)) {
				errorDetails = `${errorResponse.error}${errorResponse.error_description ? `: ${errorResponse.error_description}` : ''}`;
			}
		} catch {
			// JSON parsing failed, use raw text
		}

		throw new Error(`Registration to ${serverMetadata.registration_endpoint} failed: ${errorDetails}`);
	}

	const registration = await response.json();
	if (isAuthorizationDynamicClientRegistrationResponse(registration)) {
		return registration;
	}
	throw new Error(`Invalid authorization dynamic client registration response: ${JSON.stringify(registration)}`);
}

export interface IAuthenticationChallenge {
	scheme: string;
	params: Record<string, string>;
}

export function parseWWWAuthenticateHeader(wwwAuthenticateHeaderValue: string): IAuthenticationChallenge[] {
	const challenges: IAuthenticationChallenge[] = [];

	// According to RFC 7235, multiple challenges are separated by commas
	// But parameters within a challenge can also be separated by commas
	// We need to identify scheme names to know where challenges start

	// First, split by commas while respecting quoted strings
	const tokens: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < wwwAuthenticateHeaderValue.length; i++) {
		const char = wwwAuthenticateHeaderValue[i];

		if (char === '"') {
			inQuotes = !inQuotes;
			current += char;
		} else if (char === ',' && !inQuotes) {
			if (current.trim()) {
				tokens.push(current.trim());
			}
			current = '';
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		tokens.push(current.trim());
	}

	// Now process tokens to identify challenges
	// A challenge starts with a scheme name (a token that doesn't contain '=' and is followed by parameters or is standalone)
	let currentChallenge: { scheme: string; params: Record<string, string> } | undefined;

	for (const token of tokens) {
		const hasEquals = token.includes('=');

		if (!hasEquals) {
			// This token doesn't have '=', so it's likely a scheme name
			if (currentChallenge) {
				challenges.push(currentChallenge);
			}
			currentChallenge = { scheme: token.trim(), params: {} };
		} else {
			// This token has '=', it could be:
			// 1. A parameter for the current challenge
			// 2. A new challenge that starts with "Scheme param=value"

			const spaceIndex = token.indexOf(' ');
			if (spaceIndex > 0) {
				const beforeSpace = token.substring(0, spaceIndex);
				const afterSpace = token.substring(spaceIndex + 1);

				// Check if what's before the space looks like a scheme name (no '=')
				if (!beforeSpace.includes('=') && afterSpace.includes('=')) {
					// This is a new challenge starting with "Scheme param=value"
					if (currentChallenge) {
						challenges.push(currentChallenge);
					}
					currentChallenge = { scheme: beforeSpace.trim(), params: {} };

					// Parse the parameter part
					const equalIndex = afterSpace.indexOf('=');
					if (equalIndex > 0) {
						const key = afterSpace.substring(0, equalIndex).trim();
						const value = afterSpace.substring(equalIndex + 1).trim().replace(/^"|"$/g, '');
						if (key && value !== undefined) {
							currentChallenge.params[key] = value;
						}
					}
					continue;
				}
			}

			// This is a parameter for the current challenge
			if (currentChallenge) {
				const equalIndex = token.indexOf('=');
				if (equalIndex > 0) {
					const key = token.substring(0, equalIndex).trim();
					const value = token.substring(equalIndex + 1).trim().replace(/^"|"$/g, '');
					if (key && value !== undefined) {
						currentChallenge.params[key] = value;
					}
				}
			}
		}
	}

	// Don't forget the last challenge
	if (currentChallenge) {
		challenges.push(currentChallenge);
	}

	return challenges;
}

export function getClaimsFromJWT(token: string): IAuthorizationJWTClaims {
	const parts = token.split('.');
	if (parts.length !== 3) {
		throw new Error('Invalid JWT token format: token must have three parts separated by dots');
	}

	const [header, payload, _signature] = parts;

	try {
		const decodedHeader = JSON.parse(decodeBase64(header).toString());
		if (typeof decodedHeader !== 'object') {
			throw new Error('Invalid JWT token format: header is not a JSON object');
		}

		const decodedPayload = JSON.parse(decodeBase64(payload).toString());
		if (typeof decodedPayload !== 'object') {
			throw new Error('Invalid JWT token format: payload is not a JSON object');
		}

		return decodedPayload;
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to parse JWT token: ${e.message}`);
		}
		throw new Error('Failed to parse JWT token');
	}
}

/**
 * Checks if two scope lists are equivalent, regardless of order.
 * This is useful for comparing OAuth scopes where the order should not matter.
 *
 * @param scopes1 First list of scopes to compare (can be undefined)
 * @param scopes2 Second list of scopes to compare (can be undefined)
 * @returns true if the scope lists contain the same scopes (order-independent), false otherwise
 *
 * @example
 * ```typescript
 * scopesMatch(['read', 'write'], ['write', 'read']) // Returns: true
 * scopesMatch(['read'], ['write']) // Returns: false
 * scopesMatch(undefined, undefined) // Returns: true
 * scopesMatch(['read'], undefined) // Returns: false
 * ```
 */
export function scopesMatch(scopes1: readonly string[] | undefined, scopes2: readonly string[] | undefined): boolean {
	if (scopes1 === scopes2) {
		return true;
	}
	if (!scopes1 || !scopes2) {
		return false;
	}
	if (scopes1.length !== scopes2.length) {
		return false;
	}

	// Sort both arrays for comparison to handle different orderings
	const sortedScopes1 = [...scopes1].sort();
	const sortedScopes2 = [...scopes2].sort();

	return sortedScopes1.every((scope, index) => scope === sortedScopes2[index]);
}

interface CommonResponse {
	status: number;
	statusText: string;
	json(): Promise<unknown>;
	text(): Promise<string>;
}

interface IFetcher {
	(input: string, init: { method: string; headers: Record<string, string> }): Promise<CommonResponse>;
}

export interface IFetchResourceMetadataOptions {
	/**
	 * Headers to include only when the resource metadata URL has the same origin as the target resource
	 */
	sameOriginHeaders?: Record<string, string>;
	/**
	 * Optional custom fetch implementation (defaults to global fetch)
	 */
	fetch?: IFetcher;
}

/**
 * Fetches and validates OAuth 2.0 protected resource metadata from the given URL.
 *
 * @param targetResource The target resource URL to compare origins with (e.g., the MCP server URL)
 * @param resourceMetadataUrl Optional URL to fetch the resource metadata from. If not provided, will try well-known URIs.
 * @param options Configuration options for the fetch operation
 * @returns Promise that resolves to an object containing the validated resource metadata and any errors encountered during discovery
 * @throws Error if the fetch fails, returns non-200 status, or the response is invalid on all attempted URLs
 */
export async function fetchResourceMetadata(
	targetResource: string,
	resourceMetadataUrl: string | undefined,
	options: IFetchResourceMetadataOptions = {}
): Promise<{ metadata: IAuthorizationProtectedResourceMetadata; errors: Error[] }> {
	const {
		sameOriginHeaders = {},
		fetch: fetchImpl = fetch
	} = options;

	const targetResourceUrlObj = new URL(targetResource);

	const fetchPrm = async (prmUrl: string, validateUrl: string) => {
		// Determine if we should include same-origin headers
		let headers: Record<string, string> = {
			'Accept': 'application/json'
		};

		const resourceMetadataUrlObj = new URL(prmUrl);
		if (resourceMetadataUrlObj.origin === targetResourceUrlObj.origin) {
			headers = {
				...headers,
				...sameOriginHeaders
			};
		}

		const response = await fetchImpl(prmUrl, { method: 'GET', headers });
		if (response.status !== 200) {
			let errorText: string;
			try {
				errorText = await response.text();
			} catch {
				errorText = response.statusText;
			}
			throw new Error(`Failed to fetch resource metadata from ${prmUrl}: ${response.status} ${errorText}`);
		}

		const body = await response.json();
		if (isAuthorizationProtectedResourceMetadata(body)) {
			// Validate that the resource matches the target resource
			// Use URL constructor for normalization - it handles hostname case and trailing slashes
			const prmValue = new URL(body.resource).toString();
			const expectedResource = new URL(validateUrl).toString();
			if (prmValue !== expectedResource) {
				throw new Error(`Protected Resource Metadata 'resource' property value "${prmValue}" does not match expected value "${expectedResource}" for URL ${prmUrl}. Per RFC 9728, these MUST match. See https://datatracker.ietf.org/doc/html/rfc9728#PRConfigurationValidation`);
			}
			return body;
		} else {
			throw new Error(`Invalid resource metadata from ${prmUrl}. Expected to follow shape of https://datatracker.ietf.org/doc/html/rfc9728#name-protected-resource-metadata (Hints: is scopes_supported an array? Is resource a string?). Current payload: ${JSON.stringify(body)}`);
		}
	};

	const errors: Error[] = [];
	if (resourceMetadataUrl) {
		try {
			const metadata = await fetchPrm(resourceMetadataUrl, targetResource);
			return { metadata, errors };
		} catch (e) {
			errors.push(e instanceof Error ? e : new Error(String(e)));
		}
	}

	// Try well-known URIs starting with path-appended, then root
	const hasPathComponent = targetResourceUrlObj.pathname !== '/';
	const rootUrl = `${targetResourceUrlObj.origin}${AUTH_PROTECTED_RESOURCE_METADATA_DISCOVERY_PATH}`;

	if (hasPathComponent) {
		const pathAppendedUrl = `${rootUrl}${targetResourceUrlObj.pathname}`;
		try {
			const metadata = await fetchPrm(pathAppendedUrl, targetResource);
			return { metadata, errors };
		} catch (e) {
			errors.push(e instanceof Error ? e : new Error(String(e)));
		}
	}

	// Finally, try root discovery
	try {
		const metadata = await fetchPrm(rootUrl, targetResourceUrlObj.origin);
		return { metadata, errors };
	} catch (e) {
		errors.push(e instanceof Error ? e : new Error(String(e)));
	}

	// If we've tried all methods and none worked, throw the error(s)
	if (errors.length === 1) {
		throw errors[0];
	} else {
		throw new AggregateError(errors, 'Failed to fetch resource metadata from all attempted URLs');
	}
}

export interface IFetchAuthorizationServerMetadataOptions {
	/**
	 * Headers to include in the requests
	 */
	additionalHeaders?: Record<string, string>;
	/**
	 * Optional custom fetch implementation (defaults to global fetch)
	 */
	fetch?: IFetcher;
}

/** Helper to try parsing the response as authorization server metadata */
async function tryParseAuthServerMetadata(response: CommonResponse): Promise<IAuthorizationServerMetadata | undefined> {
	if (response.status !== 200) {
		return undefined;
	}
	try {
		const body = await response.json();
		if (isAuthorizationServerMetadata(body)) {
			return body;
		}
	} catch {
		// Failed to parse as JSON or not valid metadata
	}
	return undefined;
}

/** Helper to get error text from response */
async function getErrText(res: CommonResponse): Promise<string> {
	try {
		return await res.text();
	} catch {
		return res.statusText;
	}
}

/**
 * Fetches and validates OAuth 2.0 authorization server metadata from the given authorization server URL.
 *
 * This function tries multiple discovery endpoints in the following order:
 * 1. OAuth 2.0 Authorization Server Metadata with path insertion (RFC 8414)
 * 2. OpenID Connect Discovery with path insertion
 * 3. OpenID Connect Discovery with path addition
 *
 * Path insertion: For issuer URLs with path components (e.g., https://example.com/tenant),
 * the well-known path is inserted after the origin and before the path:
 * https://example.com/.well-known/oauth-authorization-server/tenant
 *
 * Path addition: The well-known path is simply appended to the existing path:
 * https://example.com/tenant/.well-known/openid-configuration
 *
 * @param authorizationServer The authorization server URL (issuer identifier)
 * @param options Configuration options for the fetch operation
 * @returns Promise that resolves to the validated authorization server metadata
 * @throws Error if all discovery attempts fail or the response is invalid
 *
 * @see https://datatracker.ietf.org/doc/html/rfc8414#section-3
 */
export async function fetchAuthorizationServerMetadata(
	authorizationServer: string,
	options: IFetchAuthorizationServerMetadataOptions = {}
): Promise<IAuthorizationServerMetadata> {
	const {
		additionalHeaders = {},
		fetch: fetchImpl = fetch
	} = options;

	const authorizationServerUrl = new URL(authorizationServer);
	const extraPath = authorizationServerUrl.pathname === '/' ? '' : authorizationServerUrl.pathname;

	const errors: Error[] = [];

	const doFetch = async (url: string): Promise<IAuthorizationServerMetadata | undefined> => {
		try {
			const rawResponse = await fetchImpl(url, {
				method: 'GET',
				headers: {
					...additionalHeaders,
					'Accept': 'application/json'
				}
			});
			const metadata = await tryParseAuthServerMetadata(rawResponse);
			if (metadata) {
				return metadata;
			}
			// No metadata found, collect error from response
			errors.push(new Error(`Failed to fetch authorization server metadata from ${url}: ${rawResponse.status} ${await getErrText(rawResponse)}`));
			return undefined;
		} catch (e) {
			// Collect error from fetch failure
			errors.push(e instanceof Error ? e : new Error(String(e)));
			return undefined;
		}
	};

	// For the oauth server metadata discovery path, we _INSERT_
	// the well known path after the origin and before the path.
	// https://datatracker.ietf.org/doc/html/rfc8414#section-3
	const pathToFetch = new URL(AUTH_SERVER_METADATA_DISCOVERY_PATH, authorizationServer).toString() + extraPath;
	let metadata = await doFetch(pathToFetch);
	if (metadata) {
		return metadata;
	}

	// Try fetching the OpenID Connect Discovery with path insertion.
	// For issuer URLs with path components, this inserts the well-known path
	// after the origin and before the path.
	const openidPathInsertionUrl = new URL(OPENID_CONNECT_DISCOVERY_PATH, authorizationServer).toString() + extraPath;
	metadata = await doFetch(openidPathInsertionUrl);
	if (metadata) {
		return metadata;
	}

	// Try fetching the other discovery URL. For the openid metadata discovery
	// path, we _ADD_ the well known path after the existing path.
	// https://datatracker.ietf.org/doc/html/rfc8414#section-3
	const openidPathAdditionUrl = authorizationServer.endsWith('/')
		? authorizationServer + OPENID_CONNECT_DISCOVERY_PATH.substring(1) // Remove leading slash if authServer ends with slash
		: authorizationServer + OPENID_CONNECT_DISCOVERY_PATH;
	metadata = await doFetch(openidPathAdditionUrl);
	if (metadata) {
		return metadata;
	}

	// If we've tried all URLs and none worked, throw the error(s)
	if (errors.length === 1) {
		throw errors[0];
	} else {
		throw new AggregateError(errors, 'Failed to fetch authorization server metadata from all attempted URLs');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/objects.ts]---
Location: vscode-main/src/vs/base/common/objects.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isTypedArray, isObject, isUndefinedOrNull } from './types.js';

export function deepClone<T>(obj: T): T {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}
	if (obj instanceof RegExp) {
		return obj;
	}
	const result: any = Array.isArray(obj) ? [] : {};
	Object.entries(obj).forEach(([key, value]) => {
		result[key] = value && typeof value === 'object' ? deepClone(value) : value;
	});
	return result;
}

export function deepFreeze<T>(obj: T): T {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}
	const stack: any[] = [obj];
	while (stack.length > 0) {
		const obj = stack.shift();
		Object.freeze(obj);
		for (const key in obj) {
			if (_hasOwnProperty.call(obj, key)) {
				const prop = obj[key];
				if (typeof prop === 'object' && !Object.isFrozen(prop) && !isTypedArray(prop)) {
					stack.push(prop);
				}
			}
		}
	}
	return obj;
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;


export function cloneAndChange(obj: any, changer: (orig: any) => any): any {
	return _cloneAndChange(obj, changer, new Set());
}

function _cloneAndChange(obj: any, changer: (orig: any) => any, seen: Set<any>): any {
	if (isUndefinedOrNull(obj)) {
		return obj;
	}

	const changed = changer(obj);
	if (typeof changed !== 'undefined') {
		return changed;
	}

	if (Array.isArray(obj)) {
		const r1: any[] = [];
		for (const e of obj) {
			r1.push(_cloneAndChange(e, changer, seen));
		}
		return r1;
	}

	if (isObject(obj)) {
		if (seen.has(obj)) {
			throw new Error('Cannot clone recursive data-structure');
		}
		seen.add(obj);
		const r2: Record<string, unknown> = {};
		for (const i2 in obj) {
			if (_hasOwnProperty.call(obj, i2)) {
				r2[i2] = _cloneAndChange(obj[i2], changer, seen);
			}
		}
		seen.delete(obj);
		return r2;
	}

	return obj;
}

/**
 * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
 * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
 */
export function mixin(destination: any, source: any, overwrite: boolean = true): any {
	if (!isObject(destination)) {
		return source;
	}

	if (isObject(source)) {
		Object.keys(source).forEach(key => {
			if (key in destination) {
				if (overwrite) {
					if (isObject(destination[key]) && isObject(source[key])) {
						mixin(destination[key], source[key], overwrite);
					} else {
						destination[key] = source[key];
					}
				}
			} else {
				destination[key] = source[key];
			}
		});
	}
	return destination;
}

export function equals(one: any, other: any): boolean {
	if (one === other) {
		return true;
	}
	if (one === null || one === undefined || other === null || other === undefined) {
		return false;
	}
	if (typeof one !== typeof other) {
		return false;
	}
	if (typeof one !== 'object') {
		return false;
	}
	if ((Array.isArray(one)) !== (Array.isArray(other))) {
		return false;
	}

	let i: number;
	let key: string;

	if (Array.isArray(one)) {
		if (one.length !== other.length) {
			return false;
		}
		for (i = 0; i < one.length; i++) {
			if (!equals(one[i], other[i])) {
				return false;
			}
		}
	} else {
		const oneKeys: string[] = [];

		for (key in one) {
			oneKeys.push(key);
		}
		oneKeys.sort();
		const otherKeys: string[] = [];
		for (key in other) {
			otherKeys.push(key);
		}
		otherKeys.sort();
		if (!equals(oneKeys, otherKeys)) {
			return false;
		}
		for (i = 0; i < oneKeys.length; i++) {
			if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Calls `JSON.Stringify` with a replacer to break apart any circular references.
 * This prevents `JSON`.stringify` from throwing the exception
 *  "Uncaught TypeError: Converting circular structure to JSON"
 */
export function safeStringify(obj: any): string {
	const seen = new Set<any>();
	return JSON.stringify(obj, (key, value) => {
		if (isObject(value) || Array.isArray(value)) {
			if (seen.has(value)) {
				return '[Circular]';
			} else {
				seen.add(value);
			}
		}
		if (typeof value === 'bigint') {
			return `[BigInt ${value.toString()}]`;
		}
		return value;
	});
}

type obj = { [key: string]: any };
/**
 * Returns an object that has keys for each value that is different in the base object. Keys
 * that do not exist in the target but in the base object are not considered.
 *
 * Note: This is not a deep-diffing method, so the values are strictly taken into the resulting
 * object if they differ.
 *
 * @param base the object to diff against
 * @param obj the object to use for diffing
 */
export function distinct(base: obj, target: obj): obj {
	const result = Object.create(null);

	if (!base || !target) {
		return result;
	}

	const targetKeys = Object.keys(target);
	targetKeys.forEach(k => {
		const baseValue = base[k];
		const targetValue = target[k];

		if (!equals(baseValue, targetValue)) {
			result[k] = targetValue;
		}
	});

	return result;
}

export function getCaseInsensitive(target: obj, key: string): unknown {
	const lowercaseKey = key.toLowerCase();
	const equivalentKey = Object.keys(target).find(k => k.toLowerCase() === lowercaseKey);
	return equivalentKey ? target[equivalentKey] : target[key];
}

export function filter(obj: obj, predicate: (key: string, value: any) => boolean): obj {
	const result = Object.create(null);
	for (const [key, value] of Object.entries(obj)) {
		if (predicate(key, value)) {
			result[key] = value;
		}
	}
	return result;
}

export function mapValues<T extends {}, R>(obj: T, fn: (value: T[keyof T], key: string) => R): { [K in keyof T]: R } {
	const result: { [key: string]: R } = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = fn(<T[keyof T]>value, key);
	}
	return result as { [K in keyof T]: R };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observable.ts]---
Location: vscode-main/src/vs/base/common/observable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// This is a facade for the observable implementation. Only import from here!

export * from './observableInternal/index.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/paging.ts]---
Location: vscode-main/src/vs/base/common/paging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { range } from './arrays.js';
import { CancellationToken, CancellationTokenSource } from './cancellation.js';
import { CancellationError } from './errors.js';
import { Event, Emitter } from './event.js';

/**
 * A Pager is a stateless abstraction over a paged collection.
 */
export interface IPager<T> {
	firstPage: T[];
	total: number;
	pageSize: number;
	getPage(pageIndex: number, cancellationToken: CancellationToken): Promise<T[]>;
}

export interface IIterativePage<T> {
	readonly items: T[];
	readonly hasMore: boolean;
}

export interface IIterativePager<T> {
	readonly firstPage: IIterativePage<T>;
	getNextPage(cancellationToken: CancellationToken): Promise<IIterativePage<T>>;
}

export interface IPageIterator<T> {
	elements: T[];
	total: number;
	hasNextPage: boolean;
	getNextPage(cancellationToken: CancellationToken): Promise<IPageIterator<T>>;
}

interface IPage<T> {
	isResolved: boolean;
	promise: Promise<void> | null;
	cts: CancellationTokenSource | null;
	promiseIndexes: Set<number>;
	elements: T[];
}

function createPage<T>(elements?: T[]): IPage<T> {
	return {
		isResolved: !!elements,
		promise: null,
		cts: null,
		promiseIndexes: new Set<number>(),
		elements: elements || []
	};
}

/**
 * A PagedModel is a stateful model over an abstracted paged collection.
 */
export interface IPagedModel<T> {
	readonly length: number;
	readonly onDidIncrementLength: Event<number>;
	isResolved(index: number): boolean;
	get(index: number): T;
	resolve(index: number, cancellationToken: CancellationToken): Promise<T>;
}

export function singlePagePager<T>(elements: T[]): IPager<T> {
	return {
		firstPage: elements,
		total: elements.length,
		pageSize: elements.length,
		getPage: (pageIndex: number, cancellationToken: CancellationToken): Promise<T[]> => {
			return Promise.resolve(elements);
		}
	};
}

export class PagedModel<T> implements IPagedModel<T> {

	private pager: IPager<T>;
	private pages: IPage<T>[] = [];

	get length(): number { return this.pager.total; }
	readonly onDidIncrementLength = Event.None;

	constructor(arg: IPager<T> | T[]) {
		this.pager = Array.isArray(arg) ? singlePagePager<T>(arg) : arg;

		const totalPages = Math.ceil(this.pager.total / this.pager.pageSize);

		this.pages = [
			createPage(this.pager.firstPage.slice()),
			...range(totalPages - 1).map(() => createPage<T>())
		];
	}

	isResolved(index: number): boolean {
		const pageIndex = Math.floor(index / this.pager.pageSize);
		const page = this.pages[pageIndex];

		return !!page.isResolved;
	}

	get(index: number): T {
		const pageIndex = Math.floor(index / this.pager.pageSize);
		const indexInPage = index % this.pager.pageSize;
		const page = this.pages[pageIndex];

		return page.elements[indexInPage];
	}

	resolve(index: number, cancellationToken: CancellationToken): Promise<T> {
		if (cancellationToken.isCancellationRequested) {
			return Promise.reject(new CancellationError());
		}

		const pageIndex = Math.floor(index / this.pager.pageSize);
		const indexInPage = index % this.pager.pageSize;
		const page = this.pages[pageIndex];

		if (page.isResolved) {
			return Promise.resolve(page.elements[indexInPage]);
		}

		if (!page.promise) {
			page.cts = new CancellationTokenSource();
			page.promise = this.pager.getPage(pageIndex, page.cts.token)
				.then(elements => {
					page.elements = elements;
					page.isResolved = true;
					page.promise = null;
					page.cts = null;
				}, err => {
					page.isResolved = false;
					page.promise = null;
					page.cts = null;
					return Promise.reject(err);
				});
		}

		const listener = cancellationToken.onCancellationRequested(() => {
			if (!page.cts) {
				return;
			}

			page.promiseIndexes.delete(index);

			if (page.promiseIndexes.size === 0) {
				page.cts.cancel();
			}
		});

		page.promiseIndexes.add(index);

		return page.promise.then(() => page.elements[indexInPage])
			.finally(() => listener.dispose());
	}
}

export class DelayedPagedModel<T> implements IPagedModel<T> {

	get length(): number { return this.model.length; }
	get onDidIncrementLength() { return this.model.onDidIncrementLength; }

	constructor(private readonly model: IPagedModel<T>, private timeout: number = 500) { }

	isResolved(index: number): boolean {
		return this.model.isResolved(index);
	}

	get(index: number): T {
		return this.model.get(index);
	}

	resolve(index: number, cancellationToken: CancellationToken): Promise<T> {
		return new Promise((c, e) => {
			if (cancellationToken.isCancellationRequested) {
				return e(new CancellationError());
			}

			const timer = setTimeout(() => {
				if (cancellationToken.isCancellationRequested) {
					return e(new CancellationError());
				}

				timeoutCancellation.dispose();
				this.model.resolve(index, cancellationToken).then(c, e);
			}, this.timeout);

			const timeoutCancellation = cancellationToken.onCancellationRequested(() => {
				clearTimeout(timer);
				timeoutCancellation.dispose();
				e(new CancellationError());
			});
		});
	}
}

/**
 * A PageIteratorPager wraps an IPageIterator to provide IPager functionality.
 * It caches pages as they are accessed and supports random page access by
 * sequentially loading pages until the requested page is reached.
 */
export class PageIteratorPager<T> implements IPager<T> {
	private cachedPages: T[][] = [];
	private currentIterator: IPageIterator<T>;
	private isComplete: boolean = false;
	private pendingRequests = new Map<number, Promise<void>>();

	public readonly firstPage: T[];
	public readonly pageSize: number;
	public readonly total: number;

	constructor(initialIterator: IPageIterator<T>) {
		this.currentIterator = initialIterator;
		this.firstPage = [...initialIterator.elements];
		this.pageSize = initialIterator.elements.length || 1; // Use first page size as page size
		this.cachedPages[0] = this.firstPage;
		this.isComplete = !initialIterator.hasNextPage;
		this.total = initialIterator.total;
	}

	async getPage(pageIndex: number, cancellationToken: CancellationToken): Promise<T[]> {
		if (cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		// If we already have this page cached, return it
		if (pageIndex < this.cachedPages.length) {
			return this.cachedPages[pageIndex];
		}

		// If we're complete and don't have this page, it doesn't exist
		if (this.isComplete) {
			throw new Error(`Page ${pageIndex} is out of bounds. Total pages: ${this.cachedPages.length}`);
		}


		// Check if there's already a pending request that will load this index
		// (any pending request for an index >= our requested index)
		let promise: Promise<void> | undefined;
		for (const [pendingPageIndex, pendingPromise] of this.pendingRequests) {
			if (pendingPageIndex >= pageIndex) {
				promise = pendingPromise;
				break;
			}
		}

		if (!promise) {
			promise = this.loadPagesUntil(pageIndex, cancellationToken);
			this.pendingRequests.set(pageIndex, promise);
		}

		try {
			await promise;
			if (pageIndex >= this.cachedPages.length) {
				throw new Error(`Page ${pageIndex} is out of bounds. Total pages: ${this.cachedPages.length}`);
			}
			return this.cachedPages[pageIndex];
		} finally {
			this.pendingRequests.delete(pageIndex);
		}
	}

	private async loadPagesUntil(targetPageIndex: number, cancellationToken: CancellationToken): Promise<void> {
		while (targetPageIndex >= this.cachedPages.length && this.currentIterator.hasNextPage) {
			if (cancellationToken.isCancellationRequested) {
				throw new CancellationError();
			}

			this.currentIterator = await this.currentIterator.getNextPage(cancellationToken);
			this.cachedPages.push([...this.currentIterator.elements]);
		}
		if (!this.currentIterator.hasNextPage) {
			this.isComplete = true;
		}
	}
}

export class IterativePagedModel<T> implements IPagedModel<T> {

	private items: T[] = [];
	private _hasNextPage = true;
	private readonly _onDidIncrementLength = new Emitter<number>();
	private loadingPromise: Promise<void> | null = null;

	private readonly pager: IIterativePager<T>;

	constructor(pager: IIterativePager<T>) {
		this.pager = pager;
		this.items = [...pager.firstPage.items];
		this._hasNextPage = pager.firstPage.hasMore;
	}

	get onDidIncrementLength(): Event<number> {
		return this._onDidIncrementLength.event;
	}

	/**
	 * Returns actual length + 1 if there are more pages (sentinel approach)
	 */
	get length(): number {
		return this.items.length + (this._hasNextPage ? 1 : 0);
	}

	/**
	 * Sentinel item is never resolved - it triggers loading
	 */
	isResolved(index: number): boolean {
		if (index === this.items.length && this._hasNextPage) {
			return false; // This will trigger resolve() call
		}
		return index < this.items.length;
	}

	get(index: number): T {
		if (index < this.items.length) {
			return this.items[index];
		}
		throw new Error('Item not resolved yet');
	}

	/**
	 * When sentinel item is accessed, load next page
	 */
	async resolve(index: number, cancellationToken: CancellationToken): Promise<T> {
		if (cancellationToken.isCancellationRequested) {
			return Promise.reject(new CancellationError());
		}

		// If trying to resolve the sentinel item, load next page
		if (index === this.items.length && this._hasNextPage) {
			await this.loadNextPage(cancellationToken);
		}

		// After loading, the requested index should now be valid
		if (index < this.items.length) {
			return this.items[index];
		}

		throw new Error('Index out of bounds');
	}

	private async loadNextPage(cancellationToken: CancellationToken): Promise<void> {
		if (!this._hasNextPage) {
			return;
		}

		// If already loading, return the cached promise
		if (this.loadingPromise) {
			await this.loadingPromise;
			return;
		}

		const pagePromise = this.pager.getNextPage(cancellationToken);

		this.loadingPromise = pagePromise
			.then(page => {
				this.items.push(...page.items);
				this._hasNextPage = page.hasMore;

				// Clear the loading promise before firing the event
				// so that event handlers can trigger loading the next page if needed
				this.loadingPromise = null;

				// Fire length update event
				this._onDidIncrementLength.fire(this.length);
			}, err => {
				this.loadingPromise = null;
				throw err;
			});

		await this.loadingPromise;
	}

	dispose(): void {
		this._onDidIncrementLength.dispose();
	}
}

/**
 * Similar to array.map, `mapPager` lets you map the elements of an
 * abstract paged collection to another type.
 */
export function mapPager<T, R>(pager: IPager<T>, fn: (t: T) => R): IPager<R> {
	return {
		firstPage: pager.firstPage.map(fn),
		total: pager.total,
		pageSize: pager.pageSize,
		getPage: (pageIndex, token) => pager.getPage(pageIndex, token).then(r => r.map(fn))
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/parsers.ts]---
Location: vscode-main/src/vs/base/common/parsers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum ValidationState {
	OK = 0,
	Info = 1,
	Warning = 2,
	Error = 3,
	Fatal = 4
}

export class ValidationStatus {
	private _state: ValidationState;

	constructor() {
		this._state = ValidationState.OK;
	}

	public get state(): ValidationState {
		return this._state;
	}

	public set state(value: ValidationState) {
		if (value > this._state) {
			this._state = value;
		}
	}

	public isOK(): boolean {
		return this._state === ValidationState.OK;
	}

	public isFatal(): boolean {
		return this._state === ValidationState.Fatal;
	}
}

export interface IProblemReporter {
	info(message: string): void;
	warn(message: string): void;
	error(message: string): void;
	fatal(message: string): void;
	status: ValidationStatus;
}

export abstract class Parser {

	private _problemReporter: IProblemReporter;

	constructor(problemReporter: IProblemReporter) {
		this._problemReporter = problemReporter;
	}

	public reset(): void {
		this._problemReporter.status.state = ValidationState.OK;
	}

	public get problemReporter(): IProblemReporter {
		return this._problemReporter;
	}

	public info(message: string): void {
		this._problemReporter.info(message);
	}

	public warn(message: string): void {
		this._problemReporter.warn(message);
	}

	public error(message: string): void {
		this._problemReporter.error(message);
	}

	public fatal(message: string): void {
		this._problemReporter.fatal(message);
	}
}
```

--------------------------------------------------------------------------------

````

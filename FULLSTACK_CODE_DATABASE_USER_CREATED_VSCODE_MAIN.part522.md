---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 522
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 522 of 552)

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

---[FILE: src/vs/workbench/services/keybinding/test/node/win_en_us.js]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_en_us.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

define({
	Sleep: {
		vkey: 'VK_SLEEP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	WakeUp: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyA: {
		vkey: 'VK_A',
		value: 'a',
		withShift: 'A',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyB: {
		vkey: 'VK_B',
		value: 'b',
		withShift: 'B',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyC: {
		vkey: 'VK_C',
		value: 'c',
		withShift: 'C',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyD: {
		vkey: 'VK_D',
		value: 'd',
		withShift: 'D',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyE: {
		vkey: 'VK_E',
		value: 'e',
		withShift: 'E',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyF: {
		vkey: 'VK_F',
		value: 'f',
		withShift: 'F',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyG: {
		vkey: 'VK_G',
		value: 'g',
		withShift: 'G',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyH: {
		vkey: 'VK_H',
		value: 'h',
		withShift: 'H',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyI: {
		vkey: 'VK_I',
		value: 'i',
		withShift: 'I',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyJ: {
		vkey: 'VK_J',
		value: 'j',
		withShift: 'J',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyK: {
		vkey: 'VK_K',
		value: 'k',
		withShift: 'K',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyL: {
		vkey: 'VK_L',
		value: 'l',
		withShift: 'L',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyM: {
		vkey: 'VK_M',
		value: 'm',
		withShift: 'M',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyN: {
		vkey: 'VK_N',
		value: 'n',
		withShift: 'N',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyO: {
		vkey: 'VK_O',
		value: 'o',
		withShift: 'O',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyP: {
		vkey: 'VK_P',
		value: 'p',
		withShift: 'P',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyQ: {
		vkey: 'VK_Q',
		value: 'q',
		withShift: 'Q',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyR: {
		vkey: 'VK_R',
		value: 'r',
		withShift: 'R',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyS: {
		vkey: 'VK_S',
		value: 's',
		withShift: 'S',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyT: {
		vkey: 'VK_T',
		value: 't',
		withShift: 'T',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyU: {
		vkey: 'VK_U',
		value: 'u',
		withShift: 'U',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyV: {
		vkey: 'VK_V',
		value: 'v',
		withShift: 'V',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyW: {
		vkey: 'VK_W',
		value: 'w',
		withShift: 'W',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyX: {
		vkey: 'VK_X',
		value: 'x',
		withShift: 'X',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyY: {
		vkey: 'VK_Y',
		value: 'y',
		withShift: 'Y',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyZ: {
		vkey: 'VK_Z',
		value: 'z',
		withShift: 'Z',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit1: {
		vkey: 'VK_1',
		value: '1',
		withShift: '!',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit2: {
		vkey: 'VK_2',
		value: '2',
		withShift: '@',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit3: {
		vkey: 'VK_3',
		value: '3',
		withShift: '#',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit4: {
		vkey: 'VK_4',
		value: '4',
		withShift: '$',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit5: {
		vkey: 'VK_5',
		value: '5',
		withShift: '%',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit6: {
		vkey: 'VK_6',
		value: '6',
		withShift: '^',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit7: {
		vkey: 'VK_7',
		value: '7',
		withShift: '&',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit8: {
		vkey: 'VK_8',
		value: '8',
		withShift: '*',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit9: {
		vkey: 'VK_9',
		value: '9',
		withShift: '(',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit0: {
		vkey: 'VK_0',
		value: '0',
		withShift: ')',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Enter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Escape: {
		vkey: 'VK_ESCAPE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backspace: {
		vkey: 'VK_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Tab: {
		vkey: 'VK_TAB',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Space: {
		vkey: 'VK_SPACE',
		value: ' ',
		withShift: ' ',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Minus: {
		vkey: 'VK_OEM_MINUS',
		value: '-',
		withShift: '_',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Equal: {
		vkey: 'VK_OEM_PLUS',
		value: '=',
		withShift: '+',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BracketLeft: {
		vkey: 'VK_OEM_4',
		value: '[',
		withShift: '{',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BracketRight: {
		vkey: 'VK_OEM_6',
		value: ']',
		withShift: '}',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backslash: {
		vkey: 'VK_OEM_5',
		value: '\\',
		withShift: '|',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Semicolon: {
		vkey: 'VK_OEM_1',
		value: ';',
		withShift: ':',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Quote: {
		vkey: 'VK_OEM_7',
		value: '\'',
		withShift: '"',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backquote: {
		vkey: 'VK_OEM_3',
		value: '`',
		withShift: '~',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Comma: {
		vkey: 'VK_OEM_COMMA',
		value: ',',
		withShift: '<',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Period: {
		vkey: 'VK_OEM_PERIOD',
		value: '.',
		withShift: '>',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Slash: {
		vkey: 'VK_OEM_2',
		value: '/',
		withShift: '?',
		withAltGr: '',
		withShiftAltGr: ''
	},
	CapsLock: {
		vkey: 'VK_CAPITAL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F1: {
		vkey: 'VK_F1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F2: {
		vkey: 'VK_F2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F3: {
		vkey: 'VK_F3',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F4: {
		vkey: 'VK_F4',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F5: {
		vkey: 'VK_F5',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F6: {
		vkey: 'VK_F6',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F7: {
		vkey: 'VK_F7',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F8: {
		vkey: 'VK_F8',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F9: {
		vkey: 'VK_F9',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F10: {
		vkey: 'VK_F10',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F11: {
		vkey: 'VK_F11',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F12: {
		vkey: 'VK_F12',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PrintScreen: {
		vkey: 'VK_SNAPSHOT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ScrollLock: {
		vkey: 'VK_SCROLL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Pause: {
		vkey: 'VK_NUMLOCK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Insert: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Home: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageUp: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Delete: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	End: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageDown: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowRight: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowLeft: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowDown: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowUp: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumLock: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDivide: {
		vkey: 'VK_DIVIDE',
		value: '/',
		withShift: '/',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadMultiply: {
		vkey: 'VK_MULTIPLY',
		value: '*',
		withShift: '*',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadSubtract: {
		vkey: 'VK_SUBTRACT',
		value: '-',
		withShift: '-',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadAdd: {
		vkey: 'VK_ADD',
		value: '+',
		withShift: '+',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEnter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad1: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad2: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad3: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad4: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad5: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad6: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad7: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad8: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad9: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad0: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDecimal: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlBackslash: {
		vkey: 'VK_OEM_102',
		value: '\\',
		withShift: '|',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ContextMenu: {
		vkey: 'VK_APPS',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Power: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEqual: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F13: {
		vkey: 'VK_F13',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F14: {
		vkey: 'VK_F14',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F15: {
		vkey: 'VK_F15',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F16: {
		vkey: 'VK_F16',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F17: {
		vkey: 'VK_F17',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F18: {
		vkey: 'VK_F18',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F19: {
		vkey: 'VK_F19',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F20: {
		vkey: 'VK_F20',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F21: {
		vkey: 'VK_F21',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F22: {
		vkey: 'VK_F22',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F23: {
		vkey: 'VK_F23',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F24: {
		vkey: 'VK_F24',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Help: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Undo: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Cut: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Copy: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Paste: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeMute: {
		vkey: 'VK_VOLUME_MUTE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeUp: {
		vkey: 'VK_VOLUME_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeDown: {
		vkey: 'VK_VOLUME_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadComma: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlRo: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KanaMode: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlYen: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Convert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NonConvert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang1: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang2: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang3: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang4: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlLeft: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftLeft: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltLeft: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaLeft: {
		vkey: 'VK_LWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlRight: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftRight: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltRight: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaRight: {
		vkey: 'VK_RWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackNext: {
		vkey: 'VK_MEDIA_NEXT_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackPrevious: {
		vkey: 'VK_MEDIA_PREV_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaStop: {
		vkey: 'VK_MEDIA_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Eject: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaPlayPause: {
		vkey: 'VK_MEDIA_PLAY_PAUSE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaSelect: {
		vkey: 'VK_LAUNCH_MEDIA_SELECT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchMail: {
		vkey: 'VK_LAUNCH_MAIL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp2: {
		vkey: 'VK_LAUNCH_APP2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp1: {
		vkey: 'VK_LAUNCH_APP1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserSearch: {
		vkey: 'VK_BROWSER_SEARCH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserHome: {
		vkey: 'VK_BROWSER_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserBack: {
		vkey: 'VK_BROWSER_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserForward: {
		vkey: 'VK_BROWSER_FORWARD',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserStop: {
		vkey: 'VK_BROWSER_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserRefresh: {
		vkey: 'VK_BROWSER_REFRESH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserFavorites: {
		vkey: 'VK_BROWSER_FAVORITES',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/win_en_us.txt]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_en_us.txt

```text
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyA |   a   |                         A |                         A |                          a |         |
|                     Shift+KeyA |   A   |                   Shift+A |                   Shift+A |                    shift+a |         |
|                  Ctrl+Alt+KeyA |  ---  |                Ctrl+Alt+A |                Ctrl+Alt+A |                 ctrl+alt+a |         |
|            Ctrl+Shift+Alt+KeyA |  ---  |          Ctrl+Shift+Alt+A |          Ctrl+Shift+Alt+A |           ctrl+shift+alt+a |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyB |   b   |                         B |                         B |                          b |         |
|                     Shift+KeyB |   B   |                   Shift+B |                   Shift+B |                    shift+b |         |
|                  Ctrl+Alt+KeyB |  ---  |                Ctrl+Alt+B |                Ctrl+Alt+B |                 ctrl+alt+b |         |
|            Ctrl+Shift+Alt+KeyB |  ---  |          Ctrl+Shift+Alt+B |          Ctrl+Shift+Alt+B |           ctrl+shift+alt+b |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyC |   c   |                         C |                         C |                          c |         |
|                     Shift+KeyC |   C   |                   Shift+C |                   Shift+C |                    shift+c |         |
|                  Ctrl+Alt+KeyC |  ---  |                Ctrl+Alt+C |                Ctrl+Alt+C |                 ctrl+alt+c |         |
|            Ctrl+Shift+Alt+KeyC |  ---  |          Ctrl+Shift+Alt+C |          Ctrl+Shift+Alt+C |           ctrl+shift+alt+c |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyD |   d   |                         D |                         D |                          d |         |
|                     Shift+KeyD |   D   |                   Shift+D |                   Shift+D |                    shift+d |         |
|                  Ctrl+Alt+KeyD |  ---  |                Ctrl+Alt+D |                Ctrl+Alt+D |                 ctrl+alt+d |         |
|            Ctrl+Shift+Alt+KeyD |  ---  |          Ctrl+Shift+Alt+D |          Ctrl+Shift+Alt+D |           ctrl+shift+alt+d |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyE |   e   |                         E |                         E |                          e |         |
|                     Shift+KeyE |   E   |                   Shift+E |                   Shift+E |                    shift+e |         |
|                  Ctrl+Alt+KeyE |  ---  |                Ctrl+Alt+E |                Ctrl+Alt+E |                 ctrl+alt+e |         |
|            Ctrl+Shift+Alt+KeyE |  ---  |          Ctrl+Shift+Alt+E |          Ctrl+Shift+Alt+E |           ctrl+shift+alt+e |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyF |   f   |                         F |                         F |                          f |         |
|                     Shift+KeyF |   F   |                   Shift+F |                   Shift+F |                    shift+f |         |
|                  Ctrl+Alt+KeyF |  ---  |                Ctrl+Alt+F |                Ctrl+Alt+F |                 ctrl+alt+f |         |
|            Ctrl+Shift+Alt+KeyF |  ---  |          Ctrl+Shift+Alt+F |          Ctrl+Shift+Alt+F |           ctrl+shift+alt+f |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyG |   g   |                         G |                         G |                          g |         |
|                     Shift+KeyG |   G   |                   Shift+G |                   Shift+G |                    shift+g |         |
|                  Ctrl+Alt+KeyG |  ---  |                Ctrl+Alt+G |                Ctrl+Alt+G |                 ctrl+alt+g |         |
|            Ctrl+Shift+Alt+KeyG |  ---  |          Ctrl+Shift+Alt+G |          Ctrl+Shift+Alt+G |           ctrl+shift+alt+g |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyH |   h   |                         H |                         H |                          h |         |
|                     Shift+KeyH |   H   |                   Shift+H |                   Shift+H |                    shift+h |         |
|                  Ctrl+Alt+KeyH |  ---  |                Ctrl+Alt+H |                Ctrl+Alt+H |                 ctrl+alt+h |         |
|            Ctrl+Shift+Alt+KeyH |  ---  |          Ctrl+Shift+Alt+H |          Ctrl+Shift+Alt+H |           ctrl+shift+alt+h |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyI |   i   |                         I |                         I |                          i |         |
|                     Shift+KeyI |   I   |                   Shift+I |                   Shift+I |                    shift+i |         |
|                  Ctrl+Alt+KeyI |  ---  |                Ctrl+Alt+I |                Ctrl+Alt+I |                 ctrl+alt+i |         |
|            Ctrl+Shift+Alt+KeyI |  ---  |          Ctrl+Shift+Alt+I |          Ctrl+Shift+Alt+I |           ctrl+shift+alt+i |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyJ |   j   |                         J |                         J |                          j |         |
|                     Shift+KeyJ |   J   |                   Shift+J |                   Shift+J |                    shift+j |         |
|                  Ctrl+Alt+KeyJ |  ---  |                Ctrl+Alt+J |                Ctrl+Alt+J |                 ctrl+alt+j |         |
|            Ctrl+Shift+Alt+KeyJ |  ---  |          Ctrl+Shift+Alt+J |          Ctrl+Shift+Alt+J |           ctrl+shift+alt+j |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyK |   k   |                         K |                         K |                          k |         |
|                     Shift+KeyK |   K   |                   Shift+K |                   Shift+K |                    shift+k |         |
|                  Ctrl+Alt+KeyK |  ---  |                Ctrl+Alt+K |                Ctrl+Alt+K |                 ctrl+alt+k |         |
|            Ctrl+Shift+Alt+KeyK |  ---  |          Ctrl+Shift+Alt+K |          Ctrl+Shift+Alt+K |           ctrl+shift+alt+k |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyL |   l   |                         L |                         L |                          l |         |
|                     Shift+KeyL |   L   |                   Shift+L |                   Shift+L |                    shift+l |         |
|                  Ctrl+Alt+KeyL |  ---  |                Ctrl+Alt+L |                Ctrl+Alt+L |                 ctrl+alt+l |         |
|            Ctrl+Shift+Alt+KeyL |  ---  |          Ctrl+Shift+Alt+L |          Ctrl+Shift+Alt+L |           ctrl+shift+alt+l |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyM |   m   |                         M |                         M |                          m |         |
|                     Shift+KeyM |   M   |                   Shift+M |                   Shift+M |                    shift+m |         |
|                  Ctrl+Alt+KeyM |  ---  |                Ctrl+Alt+M |                Ctrl+Alt+M |                 ctrl+alt+m |         |
|            Ctrl+Shift+Alt+KeyM |  ---  |          Ctrl+Shift+Alt+M |          Ctrl+Shift+Alt+M |           ctrl+shift+alt+m |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyN |   n   |                         N |                         N |                          n |         |
|                     Shift+KeyN |   N   |                   Shift+N |                   Shift+N |                    shift+n |         |
|                  Ctrl+Alt+KeyN |  ---  |                Ctrl+Alt+N |                Ctrl+Alt+N |                 ctrl+alt+n |         |
|            Ctrl+Shift+Alt+KeyN |  ---  |          Ctrl+Shift+Alt+N |          Ctrl+Shift+Alt+N |           ctrl+shift+alt+n |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyO |   o   |                         O |                         O |                          o |         |
|                     Shift+KeyO |   O   |                   Shift+O |                   Shift+O |                    shift+o |         |
|                  Ctrl+Alt+KeyO |  ---  |                Ctrl+Alt+O |                Ctrl+Alt+O |                 ctrl+alt+o |         |
|            Ctrl+Shift+Alt+KeyO |  ---  |          Ctrl+Shift+Alt+O |          Ctrl+Shift+Alt+O |           ctrl+shift+alt+o |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyP |   p   |                         P |                         P |                          p |         |
|                     Shift+KeyP |   P   |                   Shift+P |                   Shift+P |                    shift+p |         |
|                  Ctrl+Alt+KeyP |  ---  |                Ctrl+Alt+P |                Ctrl+Alt+P |                 ctrl+alt+p |         |
|            Ctrl+Shift+Alt+KeyP |  ---  |          Ctrl+Shift+Alt+P |          Ctrl+Shift+Alt+P |           ctrl+shift+alt+p |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyQ |   q   |                         Q |                         Q |                          q |         |
|                     Shift+KeyQ |   Q   |                   Shift+Q |                   Shift+Q |                    shift+q |         |
|                  Ctrl+Alt+KeyQ |  ---  |                Ctrl+Alt+Q |                Ctrl+Alt+Q |                 ctrl+alt+q |         |
|            Ctrl+Shift+Alt+KeyQ |  ---  |          Ctrl+Shift+Alt+Q |          Ctrl+Shift+Alt+Q |           ctrl+shift+alt+q |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyR |   r   |                         R |                         R |                          r |         |
|                     Shift+KeyR |   R   |                   Shift+R |                   Shift+R |                    shift+r |         |
|                  Ctrl+Alt+KeyR |  ---  |                Ctrl+Alt+R |                Ctrl+Alt+R |                 ctrl+alt+r |         |
|            Ctrl+Shift+Alt+KeyR |  ---  |          Ctrl+Shift+Alt+R |          Ctrl+Shift+Alt+R |           ctrl+shift+alt+r |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyS |   s   |                         S |                         S |                          s |         |
|                     Shift+KeyS |   S   |                   Shift+S |                   Shift+S |                    shift+s |         |
|                  Ctrl+Alt+KeyS |  ---  |                Ctrl+Alt+S |                Ctrl+Alt+S |                 ctrl+alt+s |         |
|            Ctrl+Shift+Alt+KeyS |  ---  |          Ctrl+Shift+Alt+S |          Ctrl+Shift+Alt+S |           ctrl+shift+alt+s |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyT |   t   |                         T |                         T |                          t |         |
|                     Shift+KeyT |   T   |                   Shift+T |                   Shift+T |                    shift+t |         |
|                  Ctrl+Alt+KeyT |  ---  |                Ctrl+Alt+T |                Ctrl+Alt+T |                 ctrl+alt+t |         |
|            Ctrl+Shift+Alt+KeyT |  ---  |          Ctrl+Shift+Alt+T |          Ctrl+Shift+Alt+T |           ctrl+shift+alt+t |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyU |   u   |                         U |                         U |                          u |         |
|                     Shift+KeyU |   U   |                   Shift+U |                   Shift+U |                    shift+u |         |
|                  Ctrl+Alt+KeyU |  ---  |                Ctrl+Alt+U |                Ctrl+Alt+U |                 ctrl+alt+u |         |
|            Ctrl+Shift+Alt+KeyU |  ---  |          Ctrl+Shift+Alt+U |          Ctrl+Shift+Alt+U |           ctrl+shift+alt+u |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyV |   v   |                         V |                         V |                          v |         |
|                     Shift+KeyV |   V   |                   Shift+V |                   Shift+V |                    shift+v |         |
|                  Ctrl+Alt+KeyV |  ---  |                Ctrl+Alt+V |                Ctrl+Alt+V |                 ctrl+alt+v |         |
|            Ctrl+Shift+Alt+KeyV |  ---  |          Ctrl+Shift+Alt+V |          Ctrl+Shift+Alt+V |           ctrl+shift+alt+v |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyW |   w   |                         W |                         W |                          w |         |
|                     Shift+KeyW |   W   |                   Shift+W |                   Shift+W |                    shift+w |         |
|                  Ctrl+Alt+KeyW |  ---  |                Ctrl+Alt+W |                Ctrl+Alt+W |                 ctrl+alt+w |         |
|            Ctrl+Shift+Alt+KeyW |  ---  |          Ctrl+Shift+Alt+W |          Ctrl+Shift+Alt+W |           ctrl+shift+alt+w |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyX |   x   |                         X |                         X |                          x |         |
|                     Shift+KeyX |   X   |                   Shift+X |                   Shift+X |                    shift+x |         |
|                  Ctrl+Alt+KeyX |  ---  |                Ctrl+Alt+X |                Ctrl+Alt+X |                 ctrl+alt+x |         |
|            Ctrl+Shift+Alt+KeyX |  ---  |          Ctrl+Shift+Alt+X |          Ctrl+Shift+Alt+X |           ctrl+shift+alt+x |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyY |   y   |                         Y |                         Y |                          y |         |
|                     Shift+KeyY |   Y   |                   Shift+Y |                   Shift+Y |                    shift+y |         |
|                  Ctrl+Alt+KeyY |  ---  |                Ctrl+Alt+Y |                Ctrl+Alt+Y |                 ctrl+alt+y |         |
|            Ctrl+Shift+Alt+KeyY |  ---  |          Ctrl+Shift+Alt+Y |          Ctrl+Shift+Alt+Y |           ctrl+shift+alt+y |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyZ |   z   |                         Z |                         Z |                          z |         |
|                     Shift+KeyZ |   Z   |                   Shift+Z |                   Shift+Z |                    shift+z |         |
|                  Ctrl+Alt+KeyZ |  ---  |                Ctrl+Alt+Z |                Ctrl+Alt+Z |                 ctrl+alt+z |         |
|            Ctrl+Shift+Alt+KeyZ |  ---  |          Ctrl+Shift+Alt+Z |          Ctrl+Shift+Alt+Z |           ctrl+shift+alt+z |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit1 |   1   |                         1 |                         1 |                          1 |         |
|                   Shift+Digit1 |   !   |                   Shift+1 |                   Shift+1 |                    shift+1 |         |
|                Ctrl+Alt+Digit1 |  ---  |                Ctrl+Alt+1 |                Ctrl+Alt+1 |                 ctrl+alt+1 |         |
|          Ctrl+Shift+Alt+Digit1 |  ---  |          Ctrl+Shift+Alt+1 |          Ctrl+Shift+Alt+1 |           ctrl+shift+alt+1 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit2 |   2   |                         2 |                         2 |                          2 |         |
|                   Shift+Digit2 |   @   |                   Shift+2 |                   Shift+2 |                    shift+2 |         |
|                Ctrl+Alt+Digit2 |  ---  |                Ctrl+Alt+2 |                Ctrl+Alt+2 |                 ctrl+alt+2 |         |
|          Ctrl+Shift+Alt+Digit2 |  ---  |          Ctrl+Shift+Alt+2 |          Ctrl+Shift+Alt+2 |           ctrl+shift+alt+2 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit3 |   3   |                         3 |                         3 |                          3 |         |
|                   Shift+Digit3 |   #   |                   Shift+3 |                   Shift+3 |                    shift+3 |         |
|                Ctrl+Alt+Digit3 |  ---  |                Ctrl+Alt+3 |                Ctrl+Alt+3 |                 ctrl+alt+3 |         |
|          Ctrl+Shift+Alt+Digit3 |  ---  |          Ctrl+Shift+Alt+3 |          Ctrl+Shift+Alt+3 |           ctrl+shift+alt+3 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit4 |   4   |                         4 |                         4 |                          4 |         |
|                   Shift+Digit4 |   $   |                   Shift+4 |                   Shift+4 |                    shift+4 |         |
|                Ctrl+Alt+Digit4 |  ---  |                Ctrl+Alt+4 |                Ctrl+Alt+4 |                 ctrl+alt+4 |         |
|          Ctrl+Shift+Alt+Digit4 |  ---  |          Ctrl+Shift+Alt+4 |          Ctrl+Shift+Alt+4 |           ctrl+shift+alt+4 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit5 |   5   |                         5 |                         5 |                          5 |         |
|                   Shift+Digit5 |   %   |                   Shift+5 |                   Shift+5 |                    shift+5 |         |
|                Ctrl+Alt+Digit5 |  ---  |                Ctrl+Alt+5 |                Ctrl+Alt+5 |                 ctrl+alt+5 |         |
|          Ctrl+Shift+Alt+Digit5 |  ---  |          Ctrl+Shift+Alt+5 |          Ctrl+Shift+Alt+5 |           ctrl+shift+alt+5 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit6 |   6   |                         6 |                         6 |                          6 |         |
|                   Shift+Digit6 |   ^   |                   Shift+6 |                   Shift+6 |                    shift+6 |         |
|                Ctrl+Alt+Digit6 |  ---  |                Ctrl+Alt+6 |                Ctrl+Alt+6 |                 ctrl+alt+6 |         |
|          Ctrl+Shift+Alt+Digit6 |  ---  |          Ctrl+Shift+Alt+6 |          Ctrl+Shift+Alt+6 |           ctrl+shift+alt+6 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit7 |   7   |                         7 |                         7 |                          7 |         |
|                   Shift+Digit7 |   &   |                   Shift+7 |                   Shift+7 |                    shift+7 |         |
|                Ctrl+Alt+Digit7 |  ---  |                Ctrl+Alt+7 |                Ctrl+Alt+7 |                 ctrl+alt+7 |         |
|          Ctrl+Shift+Alt+Digit7 |  ---  |          Ctrl+Shift+Alt+7 |          Ctrl+Shift+Alt+7 |           ctrl+shift+alt+7 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit8 |   8   |                         8 |                         8 |                          8 |         |
|                   Shift+Digit8 |   *   |                   Shift+8 |                   Shift+8 |                    shift+8 |         |
|                Ctrl+Alt+Digit8 |  ---  |                Ctrl+Alt+8 |                Ctrl+Alt+8 |                 ctrl+alt+8 |         |
|          Ctrl+Shift+Alt+Digit8 |  ---  |          Ctrl+Shift+Alt+8 |          Ctrl+Shift+Alt+8 |           ctrl+shift+alt+8 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit9 |   9   |                         9 |                         9 |                          9 |         |
|                   Shift+Digit9 |   (   |                   Shift+9 |                   Shift+9 |                    shift+9 |         |
|                Ctrl+Alt+Digit9 |  ---  |                Ctrl+Alt+9 |                Ctrl+Alt+9 |                 ctrl+alt+9 |         |
|          Ctrl+Shift+Alt+Digit9 |  ---  |          Ctrl+Shift+Alt+9 |          Ctrl+Shift+Alt+9 |           ctrl+shift+alt+9 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit0 |   0   |                         0 |                         0 |                          0 |         |
|                   Shift+Digit0 |   )   |                   Shift+0 |                   Shift+0 |                    shift+0 |         |
|                Ctrl+Alt+Digit0 |  ---  |                Ctrl+Alt+0 |                Ctrl+Alt+0 |                 ctrl+alt+0 |         |
|          Ctrl+Shift+Alt+Digit0 |  ---  |          Ctrl+Shift+Alt+0 |          Ctrl+Shift+Alt+0 |           ctrl+shift+alt+0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Minus |   -   |                         - |                         - |                          - |         |
|                    Shift+Minus |   _   |                   Shift+- |                   Shift+- |                    shift+- |         |
|                 Ctrl+Alt+Minus |  ---  |                Ctrl+Alt+- |                Ctrl+Alt+- |                 ctrl+alt+- |         |
|           Ctrl+Shift+Alt+Minus |  ---  |          Ctrl+Shift+Alt+- |          Ctrl+Shift+Alt+- |           ctrl+shift+alt+- |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Equal |   =   |                         = |                         = |                          = |         |
|                    Shift+Equal |   +   |                   Shift+= |                   Shift+= |                    shift+= |         |
|                 Ctrl+Alt+Equal |  ---  |                Ctrl+Alt+= |                Ctrl+Alt+= |                 ctrl+alt+= |         |
|           Ctrl+Shift+Alt+Equal |  ---  |          Ctrl+Shift+Alt+= |          Ctrl+Shift+Alt+= |           ctrl+shift+alt+= |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                    BracketLeft |   [   |                         [ |                         [ |                          [ |         |
|              Shift+BracketLeft |   {   |                   Shift+[ |                   Shift+[ |                    shift+[ |         |
|           Ctrl+Alt+BracketLeft |  ---  |                Ctrl+Alt+[ |                Ctrl+Alt+[ |                 ctrl+alt+[ |         |
|     Ctrl+Shift+Alt+BracketLeft |  ---  |          Ctrl+Shift+Alt+[ |          Ctrl+Shift+Alt+[ |           ctrl+shift+alt+[ |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                   BracketRight |   ]   |                         ] |                         ] |                          ] |         |
|             Shift+BracketRight |   }   |                   Shift+] |                   Shift+] |                    shift+] |         |
|          Ctrl+Alt+BracketRight |  ---  |                Ctrl+Alt+] |                Ctrl+Alt+] |                 ctrl+alt+] |         |
|    Ctrl+Shift+Alt+BracketRight |  ---  |          Ctrl+Shift+Alt+] |          Ctrl+Shift+Alt+] |           ctrl+shift+alt+] |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backslash |   \   |                         \ |                         \ |                          \ |         |
|                Shift+Backslash |   |   |                   Shift+\ |                   Shift+\ |                    shift+\ |         |
|             Ctrl+Alt+Backslash |  ---  |                Ctrl+Alt+\ |                Ctrl+Alt+\ |                 ctrl+alt+\ |         |
|       Ctrl+Shift+Alt+Backslash |  ---  |          Ctrl+Shift+Alt+\ |          Ctrl+Shift+Alt+\ |           ctrl+shift+alt+\ |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                       IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|                 Shift+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|              Ctrl+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|        Ctrl+Shift+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Semicolon |   ;   |                         ; |                         ; |                          ; |         |
|                Shift+Semicolon |   :   |                   Shift+; |                   Shift+; |                    shift+; |         |
|             Ctrl+Alt+Semicolon |  ---  |                Ctrl+Alt+; |                Ctrl+Alt+; |                 ctrl+alt+; |         |
|       Ctrl+Shift+Alt+Semicolon |  ---  |          Ctrl+Shift+Alt+; |          Ctrl+Shift+Alt+; |           ctrl+shift+alt+; |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Quote |   '   |                         ' |                         ' |                          ' |         |
|                    Shift+Quote |   "   |                   Shift+' |                   Shift+' |                    shift+' |         |
|                 Ctrl+Alt+Quote |  ---  |                Ctrl+Alt+' |                Ctrl+Alt+' |                 ctrl+alt+' |         |
|           Ctrl+Shift+Alt+Quote |  ---  |          Ctrl+Shift+Alt+' |          Ctrl+Shift+Alt+' |           ctrl+shift+alt+' |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backquote |   `   |                         ` |                         ` |                          ` |         |
|                Shift+Backquote |   ~   |                   Shift+` |                   Shift+` |                    shift+` |         |
|             Ctrl+Alt+Backquote |  ---  |                Ctrl+Alt+` |                Ctrl+Alt+` |                 ctrl+alt+` |         |
|       Ctrl+Shift+Alt+Backquote |  ---  |          Ctrl+Shift+Alt+` |          Ctrl+Shift+Alt+` |           ctrl+shift+alt+` |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Comma |   ,   |                         , |                         , |                          , |         |
|                    Shift+Comma |   <   |                   Shift+, |                   Shift+, |                    shift+, |         |
|                 Ctrl+Alt+Comma |  ---  |                Ctrl+Alt+, |                Ctrl+Alt+, |                 ctrl+alt+, |         |
|           Ctrl+Shift+Alt+Comma |  ---  |          Ctrl+Shift+Alt+, |          Ctrl+Shift+Alt+, |           ctrl+shift+alt+, |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Period |   .   |                         . |                         . |                          . |         |
|                   Shift+Period |   >   |                   Shift+. |                   Shift+. |                    shift+. |         |
|                Ctrl+Alt+Period |  ---  |                Ctrl+Alt+. |                Ctrl+Alt+. |                 ctrl+alt+. |         |
|          Ctrl+Shift+Alt+Period |  ---  |          Ctrl+Shift+Alt+. |          Ctrl+Shift+Alt+. |           ctrl+shift+alt+. |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Slash |   /   |                         / |                         / |                          / |         |
|                    Shift+Slash |   ?   |                   Shift+/ |                   Shift+/ |                    shift+/ |         |
|                 Ctrl+Alt+Slash |  ---  |                Ctrl+Alt+/ |                Ctrl+Alt+/ |                 ctrl+alt+/ |         |
|           Ctrl+Shift+Alt+Slash |  ---  |          Ctrl+Shift+Alt+/ |          Ctrl+Shift+Alt+/ |           ctrl+shift+alt+/ |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        ArrowUp |  ---  |                   UpArrow |                   UpArrow |                         up |         |
|                  Shift+ArrowUp |  ---  |             Shift+UpArrow |             Shift+UpArrow |                   shift+up |         |
|               Ctrl+Alt+ArrowUp |  ---  |          Ctrl+Alt+UpArrow |          Ctrl+Alt+UpArrow |                ctrl+alt+up |         |
|         Ctrl+Shift+Alt+ArrowUp |  ---  |    Ctrl+Shift+Alt+UpArrow |    Ctrl+Shift+Alt+UpArrow |          ctrl+shift+alt+up |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        Numpad0 |  ---  |                   NumPad0 |                   NumPad0 |                    numpad0 |         |
|                  Shift+Numpad0 |  ---  |             Shift+NumPad0 |             Shift+NumPad0 |              shift+numpad0 |         |
|               Ctrl+Alt+Numpad0 |  ---  |          Ctrl+Alt+NumPad0 |          Ctrl+Alt+NumPad0 |           ctrl+alt+numpad0 |         |
|         Ctrl+Shift+Alt+Numpad0 |  ---  |    Ctrl+Shift+Alt+NumPad0 |    Ctrl+Shift+Alt+NumPad0 |     ctrl+shift+alt+numpad0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                  IntlBackslash |   \   |                   OEM_102 |                         \ |                    oem_102 |    NO   |
|            Shift+IntlBackslash |   |   |             Shift+OEM_102 |                   Shift+\ |              shift+oem_102 |    NO   |
|         Ctrl+Alt+IntlBackslash |  ---  |          Ctrl+Alt+OEM_102 |                Ctrl+Alt+\ |           ctrl+alt+oem_102 |    NO   |
|   Ctrl+Shift+Alt+IntlBackslash |  ---  |    Ctrl+Shift+Alt+OEM_102 |          Ctrl+Shift+Alt+\ |     ctrl+shift+alt+oem_102 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|                   Shift+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|                Ctrl+Alt+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|          Ctrl+Shift+Alt+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|                  Shift+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|               Ctrl+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|         Ctrl+Shift+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/win_por_ptb.js]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_por_ptb.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

define({
	Sleep: {
		vkey: 'VK_SLEEP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	WakeUp: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyA: {
		vkey: 'VK_A',
		value: 'a',
		withShift: 'A',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyB: {
		vkey: 'VK_B',
		value: 'b',
		withShift: 'B',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyC: {
		vkey: 'VK_C',
		value: 'c',
		withShift: 'C',
		withAltGr: '₢',
		withShiftAltGr: ''
	},
	KeyD: {
		vkey: 'VK_D',
		value: 'd',
		withShift: 'D',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyE: {
		vkey: 'VK_E',
		value: 'e',
		withShift: 'E',
		withAltGr: '°',
		withShiftAltGr: ''
	},
	KeyF: {
		vkey: 'VK_F',
		value: 'f',
		withShift: 'F',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyG: {
		vkey: 'VK_G',
		value: 'g',
		withShift: 'G',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyH: {
		vkey: 'VK_H',
		value: 'h',
		withShift: 'H',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyI: {
		vkey: 'VK_I',
		value: 'i',
		withShift: 'I',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyJ: {
		vkey: 'VK_J',
		value: 'j',
		withShift: 'J',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyK: {
		vkey: 'VK_K',
		value: 'k',
		withShift: 'K',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyL: {
		vkey: 'VK_L',
		value: 'l',
		withShift: 'L',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyM: {
		vkey: 'VK_M',
		value: 'm',
		withShift: 'M',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyN: {
		vkey: 'VK_N',
		value: 'n',
		withShift: 'N',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyO: {
		vkey: 'VK_O',
		value: 'o',
		withShift: 'O',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyP: {
		vkey: 'VK_P',
		value: 'p',
		withShift: 'P',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyQ: {
		vkey: 'VK_Q',
		value: 'q',
		withShift: 'Q',
		withAltGr: '/',
		withShiftAltGr: ''
	},
	KeyR: {
		vkey: 'VK_R',
		value: 'r',
		withShift: 'R',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyS: {
		vkey: 'VK_S',
		value: 's',
		withShift: 'S',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyT: {
		vkey: 'VK_T',
		value: 't',
		withShift: 'T',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyU: {
		vkey: 'VK_U',
		value: 'u',
		withShift: 'U',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyV: {
		vkey: 'VK_V',
		value: 'v',
		withShift: 'V',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyW: {
		vkey: 'VK_W',
		value: 'w',
		withShift: 'W',
		withAltGr: '?',
		withShiftAltGr: ''
	},
	KeyX: {
		vkey: 'VK_X',
		value: 'x',
		withShift: 'X',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyY: {
		vkey: 'VK_Y',
		value: 'y',
		withShift: 'Y',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyZ: {
		vkey: 'VK_Z',
		value: 'z',
		withShift: 'Z',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit1: {
		vkey: 'VK_1',
		value: '1',
		withShift: '!',
		withAltGr: '¹',
		withShiftAltGr: ''
	},
	Digit2: {
		vkey: 'VK_2',
		value: '2',
		withShift: '@',
		withAltGr: '²',
		withShiftAltGr: ''
	},
	Digit3: {
		vkey: 'VK_3',
		value: '3',
		withShift: '#',
		withAltGr: '³',
		withShiftAltGr: ''
	},
	Digit4: {
		vkey: 'VK_4',
		value: '4',
		withShift: '$',
		withAltGr: '£',
		withShiftAltGr: ''
	},
	Digit5: {
		vkey: 'VK_5',
		value: '5',
		withShift: '%',
		withAltGr: '¢',
		withShiftAltGr: ''
	},
	Digit6: {
		vkey: 'VK_6',
		value: '6',
		withShift: '¨',
		withAltGr: '¬',
		withShiftAltGr: ''
	},
	Digit7: {
		vkey: 'VK_7',
		value: '7',
		withShift: '&',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit8: {
		vkey: 'VK_8',
		value: '8',
		withShift: '*',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit9: {
		vkey: 'VK_9',
		value: '9',
		withShift: '(',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit0: {
		vkey: 'VK_0',
		value: '0',
		withShift: ')',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Enter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Escape: {
		vkey: 'VK_ESCAPE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backspace: {
		vkey: 'VK_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Tab: {
		vkey: 'VK_TAB',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Space: {
		vkey: 'VK_SPACE',
		value: ' ',
		withShift: ' ',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Minus: {
		vkey: 'VK_OEM_MINUS',
		value: '-',
		withShift: '_',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Equal: {
		vkey: 'VK_OEM_PLUS',
		value: '=',
		withShift: '+',
		withAltGr: '§',
		withShiftAltGr: ''
	},
	BracketLeft: {
		vkey: 'VK_OEM_4',
		value: '´',
		withShift: '`',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BracketRight: {
		vkey: 'VK_OEM_6',
		value: '[',
		withShift: '{',
		withAltGr: 'ª',
		withShiftAltGr: ''
	},
	Backslash: {
		vkey: 'VK_OEM_5',
		value: ']',
		withShift: '}',
		withAltGr: 'º',
		withShiftAltGr: ''
	},
	Semicolon: {
		vkey: 'VK_OEM_1',
		value: 'ç',
		withShift: 'Ç',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Quote: {
		vkey: 'VK_OEM_7',
		value: '~',
		withShift: '^',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backquote: {
		vkey: 'VK_OEM_3',
		value: '\'',
		withShift: '"',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Comma: {
		vkey: 'VK_OEM_COMMA',
		value: ',',
		withShift: '<',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Period: {
		vkey: 'VK_OEM_PERIOD',
		value: '.',
		withShift: '>',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Slash: {
		vkey: 'VK_OEM_2',
		value: ';',
		withShift: ':',
		withAltGr: '',
		withShiftAltGr: ''
	},
	CapsLock: {
		vkey: 'VK_CAPITAL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F1: {
		vkey: 'VK_F1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F2: {
		vkey: 'VK_F2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F3: {
		vkey: 'VK_F3',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F4: {
		vkey: 'VK_F4',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F5: {
		vkey: 'VK_F5',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F6: {
		vkey: 'VK_F6',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F7: {
		vkey: 'VK_F7',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F8: {
		vkey: 'VK_F8',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F9: {
		vkey: 'VK_F9',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F10: {
		vkey: 'VK_F10',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F11: {
		vkey: 'VK_F11',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F12: {
		vkey: 'VK_F12',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PrintScreen: {
		vkey: 'VK_SNAPSHOT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ScrollLock: {
		vkey: 'VK_SCROLL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Pause: {
		vkey: 'VK_NUMLOCK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Insert: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Home: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageUp: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Delete: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	End: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageDown: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowRight: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowLeft: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowDown: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowUp: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumLock: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDivide: {
		vkey: 'VK_DIVIDE',
		value: '/',
		withShift: '/',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadMultiply: {
		vkey: 'VK_MULTIPLY',
		value: '*',
		withShift: '*',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadSubtract: {
		vkey: 'VK_SUBTRACT',
		value: '-',
		withShift: '-',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadAdd: {
		vkey: 'VK_ADD',
		value: '+',
		withShift: '+',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEnter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad1: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad2: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad3: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad4: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad5: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad6: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad7: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad8: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad9: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad0: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDecimal: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlBackslash: {
		vkey: 'VK_OEM_102',
		value: '\\',
		withShift: '|',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ContextMenu: {
		vkey: 'VK_APPS',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Power: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEqual: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F13: {
		vkey: 'VK_F13',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F14: {
		vkey: 'VK_F14',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F15: {
		vkey: 'VK_F15',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F16: {
		vkey: 'VK_F16',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F17: {
		vkey: 'VK_F17',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F18: {
		vkey: 'VK_F18',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F19: {
		vkey: 'VK_F19',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F20: {
		vkey: 'VK_F20',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F21: {
		vkey: 'VK_F21',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F22: {
		vkey: 'VK_F22',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F23: {
		vkey: 'VK_F23',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F24: {
		vkey: 'VK_F24',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Help: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Undo: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Cut: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Copy: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Paste: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeMute: {
		vkey: 'VK_VOLUME_MUTE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeUp: {
		vkey: 'VK_VOLUME_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeDown: {
		vkey: 'VK_VOLUME_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadComma: {
		vkey: 'VK_ABNT_C2',
		value: '.',
		withShift: '.',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlRo: {
		vkey: 'VK_ABNT_C1',
		value: '/',
		withShift: '?',
		withAltGr: '°',
		withShiftAltGr: ''
	},
	KanaMode: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlYen: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Convert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NonConvert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang1: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang2: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang3: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang4: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlLeft: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftLeft: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltLeft: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaLeft: {
		vkey: 'VK_LWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlRight: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftRight: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltRight: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaRight: {
		vkey: 'VK_RWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackNext: {
		vkey: 'VK_MEDIA_NEXT_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackPrevious: {
		vkey: 'VK_MEDIA_PREV_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaStop: {
		vkey: 'VK_MEDIA_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Eject: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaPlayPause: {
		vkey: 'VK_MEDIA_PLAY_PAUSE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaSelect: {
		vkey: 'VK_LAUNCH_MEDIA_SELECT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchMail: {
		vkey: 'VK_LAUNCH_MAIL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp2: {
		vkey: 'VK_LAUNCH_APP2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp1: {
		vkey: 'VK_LAUNCH_APP1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserSearch: {
		vkey: 'VK_BROWSER_SEARCH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserHome: {
		vkey: 'VK_BROWSER_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserBack: {
		vkey: 'VK_BROWSER_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserForward: {
		vkey: 'VK_BROWSER_FORWARD',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserStop: {
		vkey: 'VK_BROWSER_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserRefresh: {
		vkey: 'VK_BROWSER_REFRESH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserFavorites: {
		vkey: 'VK_BROWSER_FAVORITES',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/win_por_ptb.txt]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_por_ptb.txt

```text
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyA |   a   |                         A |                         A |                          a |         |
|                     Shift+KeyA |   A   |                   Shift+A |                   Shift+A |                    shift+a |         |
|                  Ctrl+Alt+KeyA |  ---  |                Ctrl+Alt+A |                Ctrl+Alt+A |                 ctrl+alt+a |         |
|            Ctrl+Shift+Alt+KeyA |  ---  |          Ctrl+Shift+Alt+A |          Ctrl+Shift+Alt+A |           ctrl+shift+alt+a |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyB |   b   |                         B |                         B |                          b |         |
|                     Shift+KeyB |   B   |                   Shift+B |                   Shift+B |                    shift+b |         |
|                  Ctrl+Alt+KeyB |  ---  |                Ctrl+Alt+B |                Ctrl+Alt+B |                 ctrl+alt+b |         |
|            Ctrl+Shift+Alt+KeyB |  ---  |          Ctrl+Shift+Alt+B |          Ctrl+Shift+Alt+B |           ctrl+shift+alt+b |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyC |   c   |                         C |                         C |                          c |         |
|                     Shift+KeyC |   C   |                   Shift+C |                   Shift+C |                    shift+c |         |
|                  Ctrl+Alt+KeyC |   ₢   |                Ctrl+Alt+C |                Ctrl+Alt+C |                 ctrl+alt+c |         |
|            Ctrl+Shift+Alt+KeyC |  ---  |          Ctrl+Shift+Alt+C |          Ctrl+Shift+Alt+C |           ctrl+shift+alt+c |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyD |   d   |                         D |                         D |                          d |         |
|                     Shift+KeyD |   D   |                   Shift+D |                   Shift+D |                    shift+d |         |
|                  Ctrl+Alt+KeyD |  ---  |                Ctrl+Alt+D |                Ctrl+Alt+D |                 ctrl+alt+d |         |
|            Ctrl+Shift+Alt+KeyD |  ---  |          Ctrl+Shift+Alt+D |          Ctrl+Shift+Alt+D |           ctrl+shift+alt+d |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyE |   e   |                         E |                         E |                          e |         |
|                     Shift+KeyE |   E   |                   Shift+E |                   Shift+E |                    shift+e |         |
|                  Ctrl+Alt+KeyE |   °   |                Ctrl+Alt+E |                Ctrl+Alt+E |                 ctrl+alt+e |         |
|            Ctrl+Shift+Alt+KeyE |  ---  |          Ctrl+Shift+Alt+E |          Ctrl+Shift+Alt+E |           ctrl+shift+alt+e |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyF |   f   |                         F |                         F |                          f |         |
|                     Shift+KeyF |   F   |                   Shift+F |                   Shift+F |                    shift+f |         |
|                  Ctrl+Alt+KeyF |  ---  |                Ctrl+Alt+F |                Ctrl+Alt+F |                 ctrl+alt+f |         |
|            Ctrl+Shift+Alt+KeyF |  ---  |          Ctrl+Shift+Alt+F |          Ctrl+Shift+Alt+F |           ctrl+shift+alt+f |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyG |   g   |                         G |                         G |                          g |         |
|                     Shift+KeyG |   G   |                   Shift+G |                   Shift+G |                    shift+g |         |
|                  Ctrl+Alt+KeyG |  ---  |                Ctrl+Alt+G |                Ctrl+Alt+G |                 ctrl+alt+g |         |
|            Ctrl+Shift+Alt+KeyG |  ---  |          Ctrl+Shift+Alt+G |          Ctrl+Shift+Alt+G |           ctrl+shift+alt+g |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyH |   h   |                         H |                         H |                          h |         |
|                     Shift+KeyH |   H   |                   Shift+H |                   Shift+H |                    shift+h |         |
|                  Ctrl+Alt+KeyH |  ---  |                Ctrl+Alt+H |                Ctrl+Alt+H |                 ctrl+alt+h |         |
|            Ctrl+Shift+Alt+KeyH |  ---  |          Ctrl+Shift+Alt+H |          Ctrl+Shift+Alt+H |           ctrl+shift+alt+h |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyI |   i   |                         I |                         I |                          i |         |
|                     Shift+KeyI |   I   |                   Shift+I |                   Shift+I |                    shift+i |         |
|                  Ctrl+Alt+KeyI |  ---  |                Ctrl+Alt+I |                Ctrl+Alt+I |                 ctrl+alt+i |         |
|            Ctrl+Shift+Alt+KeyI |  ---  |          Ctrl+Shift+Alt+I |          Ctrl+Shift+Alt+I |           ctrl+shift+alt+i |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyJ |   j   |                         J |                         J |                          j |         |
|                     Shift+KeyJ |   J   |                   Shift+J |                   Shift+J |                    shift+j |         |
|                  Ctrl+Alt+KeyJ |  ---  |                Ctrl+Alt+J |                Ctrl+Alt+J |                 ctrl+alt+j |         |
|            Ctrl+Shift+Alt+KeyJ |  ---  |          Ctrl+Shift+Alt+J |          Ctrl+Shift+Alt+J |           ctrl+shift+alt+j |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyK |   k   |                         K |                         K |                          k |         |
|                     Shift+KeyK |   K   |                   Shift+K |                   Shift+K |                    shift+k |         |
|                  Ctrl+Alt+KeyK |  ---  |                Ctrl+Alt+K |                Ctrl+Alt+K |                 ctrl+alt+k |         |
|            Ctrl+Shift+Alt+KeyK |  ---  |          Ctrl+Shift+Alt+K |          Ctrl+Shift+Alt+K |           ctrl+shift+alt+k |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyL |   l   |                         L |                         L |                          l |         |
|                     Shift+KeyL |   L   |                   Shift+L |                   Shift+L |                    shift+l |         |
|                  Ctrl+Alt+KeyL |  ---  |                Ctrl+Alt+L |                Ctrl+Alt+L |                 ctrl+alt+l |         |
|            Ctrl+Shift+Alt+KeyL |  ---  |          Ctrl+Shift+Alt+L |          Ctrl+Shift+Alt+L |           ctrl+shift+alt+l |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyM |   m   |                         M |                         M |                          m |         |
|                     Shift+KeyM |   M   |                   Shift+M |                   Shift+M |                    shift+m |         |
|                  Ctrl+Alt+KeyM |  ---  |                Ctrl+Alt+M |                Ctrl+Alt+M |                 ctrl+alt+m |         |
|            Ctrl+Shift+Alt+KeyM |  ---  |          Ctrl+Shift+Alt+M |          Ctrl+Shift+Alt+M |           ctrl+shift+alt+m |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyN |   n   |                         N |                         N |                          n |         |
|                     Shift+KeyN |   N   |                   Shift+N |                   Shift+N |                    shift+n |         |
|                  Ctrl+Alt+KeyN |  ---  |                Ctrl+Alt+N |                Ctrl+Alt+N |                 ctrl+alt+n |         |
|            Ctrl+Shift+Alt+KeyN |  ---  |          Ctrl+Shift+Alt+N |          Ctrl+Shift+Alt+N |           ctrl+shift+alt+n |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyO |   o   |                         O |                         O |                          o |         |
|                     Shift+KeyO |   O   |                   Shift+O |                   Shift+O |                    shift+o |         |
|                  Ctrl+Alt+KeyO |  ---  |                Ctrl+Alt+O |                Ctrl+Alt+O |                 ctrl+alt+o |         |
|            Ctrl+Shift+Alt+KeyO |  ---  |          Ctrl+Shift+Alt+O |          Ctrl+Shift+Alt+O |           ctrl+shift+alt+o |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyP |   p   |                         P |                         P |                          p |         |
|                     Shift+KeyP |   P   |                   Shift+P |                   Shift+P |                    shift+p |         |
|                  Ctrl+Alt+KeyP |  ---  |                Ctrl+Alt+P |                Ctrl+Alt+P |                 ctrl+alt+p |         |
|            Ctrl+Shift+Alt+KeyP |  ---  |          Ctrl+Shift+Alt+P |          Ctrl+Shift+Alt+P |           ctrl+shift+alt+p |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyQ |   q   |                         Q |                         Q |                          q |         |
|                     Shift+KeyQ |   Q   |                   Shift+Q |                   Shift+Q |                    shift+q |         |
|                  Ctrl+Alt+KeyQ |   /   |                Ctrl+Alt+Q |                Ctrl+Alt+Q |                 ctrl+alt+q |         |
|            Ctrl+Shift+Alt+KeyQ |  ---  |          Ctrl+Shift+Alt+Q |          Ctrl+Shift+Alt+Q |           ctrl+shift+alt+q |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyR |   r   |                         R |                         R |                          r |         |
|                     Shift+KeyR |   R   |                   Shift+R |                   Shift+R |                    shift+r |         |
|                  Ctrl+Alt+KeyR |  ---  |                Ctrl+Alt+R |                Ctrl+Alt+R |                 ctrl+alt+r |         |
|            Ctrl+Shift+Alt+KeyR |  ---  |          Ctrl+Shift+Alt+R |          Ctrl+Shift+Alt+R |           ctrl+shift+alt+r |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyS |   s   |                         S |                         S |                          s |         |
|                     Shift+KeyS |   S   |                   Shift+S |                   Shift+S |                    shift+s |         |
|                  Ctrl+Alt+KeyS |  ---  |                Ctrl+Alt+S |                Ctrl+Alt+S |                 ctrl+alt+s |         |
|            Ctrl+Shift+Alt+KeyS |  ---  |          Ctrl+Shift+Alt+S |          Ctrl+Shift+Alt+S |           ctrl+shift+alt+s |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyT |   t   |                         T |                         T |                          t |         |
|                     Shift+KeyT |   T   |                   Shift+T |                   Shift+T |                    shift+t |         |
|                  Ctrl+Alt+KeyT |  ---  |                Ctrl+Alt+T |                Ctrl+Alt+T |                 ctrl+alt+t |         |
|            Ctrl+Shift+Alt+KeyT |  ---  |          Ctrl+Shift+Alt+T |          Ctrl+Shift+Alt+T |           ctrl+shift+alt+t |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyU |   u   |                         U |                         U |                          u |         |
|                     Shift+KeyU |   U   |                   Shift+U |                   Shift+U |                    shift+u |         |
|                  Ctrl+Alt+KeyU |  ---  |                Ctrl+Alt+U |                Ctrl+Alt+U |                 ctrl+alt+u |         |
|            Ctrl+Shift+Alt+KeyU |  ---  |          Ctrl+Shift+Alt+U |          Ctrl+Shift+Alt+U |           ctrl+shift+alt+u |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyV |   v   |                         V |                         V |                          v |         |
|                     Shift+KeyV |   V   |                   Shift+V |                   Shift+V |                    shift+v |         |
|                  Ctrl+Alt+KeyV |  ---  |                Ctrl+Alt+V |                Ctrl+Alt+V |                 ctrl+alt+v |         |
|            Ctrl+Shift+Alt+KeyV |  ---  |          Ctrl+Shift+Alt+V |          Ctrl+Shift+Alt+V |           ctrl+shift+alt+v |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyW |   w   |                         W |                         W |                          w |         |
|                     Shift+KeyW |   W   |                   Shift+W |                   Shift+W |                    shift+w |         |
|                  Ctrl+Alt+KeyW |   ?   |                Ctrl+Alt+W |                Ctrl+Alt+W |                 ctrl+alt+w |         |
|            Ctrl+Shift+Alt+KeyW |  ---  |          Ctrl+Shift+Alt+W |          Ctrl+Shift+Alt+W |           ctrl+shift+alt+w |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyX |   x   |                         X |                         X |                          x |         |
|                     Shift+KeyX |   X   |                   Shift+X |                   Shift+X |                    shift+x |         |
|                  Ctrl+Alt+KeyX |  ---  |                Ctrl+Alt+X |                Ctrl+Alt+X |                 ctrl+alt+x |         |
|            Ctrl+Shift+Alt+KeyX |  ---  |          Ctrl+Shift+Alt+X |          Ctrl+Shift+Alt+X |           ctrl+shift+alt+x |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyY |   y   |                         Y |                         Y |                          y |         |
|                     Shift+KeyY |   Y   |                   Shift+Y |                   Shift+Y |                    shift+y |         |
|                  Ctrl+Alt+KeyY |  ---  |                Ctrl+Alt+Y |                Ctrl+Alt+Y |                 ctrl+alt+y |         |
|            Ctrl+Shift+Alt+KeyY |  ---  |          Ctrl+Shift+Alt+Y |          Ctrl+Shift+Alt+Y |           ctrl+shift+alt+y |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyZ |   z   |                         Z |                         Z |                          z |         |
|                     Shift+KeyZ |   Z   |                   Shift+Z |                   Shift+Z |                    shift+z |         |
|                  Ctrl+Alt+KeyZ |  ---  |                Ctrl+Alt+Z |                Ctrl+Alt+Z |                 ctrl+alt+z |         |
|            Ctrl+Shift+Alt+KeyZ |  ---  |          Ctrl+Shift+Alt+Z |          Ctrl+Shift+Alt+Z |           ctrl+shift+alt+z |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit1 |   1   |                         1 |                         1 |                          1 |         |
|                   Shift+Digit1 |   !   |                   Shift+1 |                   Shift+1 |                    shift+1 |         |
|                Ctrl+Alt+Digit1 |   ¹   |                Ctrl+Alt+1 |                Ctrl+Alt+1 |                 ctrl+alt+1 |         |
|          Ctrl+Shift+Alt+Digit1 |  ---  |          Ctrl+Shift+Alt+1 |          Ctrl+Shift+Alt+1 |           ctrl+shift+alt+1 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit2 |   2   |                         2 |                         2 |                          2 |         |
|                   Shift+Digit2 |   @   |                   Shift+2 |                   Shift+2 |                    shift+2 |         |
|                Ctrl+Alt+Digit2 |   ²   |                Ctrl+Alt+2 |                Ctrl+Alt+2 |                 ctrl+alt+2 |         |
|          Ctrl+Shift+Alt+Digit2 |  ---  |          Ctrl+Shift+Alt+2 |          Ctrl+Shift+Alt+2 |           ctrl+shift+alt+2 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit3 |   3   |                         3 |                         3 |                          3 |         |
|                   Shift+Digit3 |   #   |                   Shift+3 |                   Shift+3 |                    shift+3 |         |
|                Ctrl+Alt+Digit3 |   ³   |                Ctrl+Alt+3 |                Ctrl+Alt+3 |                 ctrl+alt+3 |         |
|          Ctrl+Shift+Alt+Digit3 |  ---  |          Ctrl+Shift+Alt+3 |          Ctrl+Shift+Alt+3 |           ctrl+shift+alt+3 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit4 |   4   |                         4 |                         4 |                          4 |         |
|                   Shift+Digit4 |   $   |                   Shift+4 |                   Shift+4 |                    shift+4 |         |
|                Ctrl+Alt+Digit4 |   £   |                Ctrl+Alt+4 |                Ctrl+Alt+4 |                 ctrl+alt+4 |         |
|          Ctrl+Shift+Alt+Digit4 |  ---  |          Ctrl+Shift+Alt+4 |          Ctrl+Shift+Alt+4 |           ctrl+shift+alt+4 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit5 |   5   |                         5 |                         5 |                          5 |         |
|                   Shift+Digit5 |   %   |                   Shift+5 |                   Shift+5 |                    shift+5 |         |
|                Ctrl+Alt+Digit5 |   ¢   |                Ctrl+Alt+5 |                Ctrl+Alt+5 |                 ctrl+alt+5 |         |
|          Ctrl+Shift+Alt+Digit5 |  ---  |          Ctrl+Shift+Alt+5 |          Ctrl+Shift+Alt+5 |           ctrl+shift+alt+5 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit6 |   6   |                         6 |                         6 |                          6 |         |
|                   Shift+Digit6 |   ¨   |                   Shift+6 |                   Shift+6 |                    shift+6 |         |
|                Ctrl+Alt+Digit6 |   ¬   |                Ctrl+Alt+6 |                Ctrl+Alt+6 |                 ctrl+alt+6 |         |
|          Ctrl+Shift+Alt+Digit6 |  ---  |          Ctrl+Shift+Alt+6 |          Ctrl+Shift+Alt+6 |           ctrl+shift+alt+6 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit7 |   7   |                         7 |                         7 |                          7 |         |
|                   Shift+Digit7 |   &   |                   Shift+7 |                   Shift+7 |                    shift+7 |         |
|                Ctrl+Alt+Digit7 |  ---  |                Ctrl+Alt+7 |                Ctrl+Alt+7 |                 ctrl+alt+7 |         |
|          Ctrl+Shift+Alt+Digit7 |  ---  |          Ctrl+Shift+Alt+7 |          Ctrl+Shift+Alt+7 |           ctrl+shift+alt+7 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit8 |   8   |                         8 |                         8 |                          8 |         |
|                   Shift+Digit8 |   *   |                   Shift+8 |                   Shift+8 |                    shift+8 |         |
|                Ctrl+Alt+Digit8 |  ---  |                Ctrl+Alt+8 |                Ctrl+Alt+8 |                 ctrl+alt+8 |         |
|          Ctrl+Shift+Alt+Digit8 |  ---  |          Ctrl+Shift+Alt+8 |          Ctrl+Shift+Alt+8 |           ctrl+shift+alt+8 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit9 |   9   |                         9 |                         9 |                          9 |         |
|                   Shift+Digit9 |   (   |                   Shift+9 |                   Shift+9 |                    shift+9 |         |
|                Ctrl+Alt+Digit9 |  ---  |                Ctrl+Alt+9 |                Ctrl+Alt+9 |                 ctrl+alt+9 |         |
|          Ctrl+Shift+Alt+Digit9 |  ---  |          Ctrl+Shift+Alt+9 |          Ctrl+Shift+Alt+9 |           ctrl+shift+alt+9 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit0 |   0   |                         0 |                         0 |                          0 |         |
|                   Shift+Digit0 |   )   |                   Shift+0 |                   Shift+0 |                    shift+0 |         |
|                Ctrl+Alt+Digit0 |  ---  |                Ctrl+Alt+0 |                Ctrl+Alt+0 |                 ctrl+alt+0 |         |
|          Ctrl+Shift+Alt+Digit0 |  ---  |          Ctrl+Shift+Alt+0 |          Ctrl+Shift+Alt+0 |           ctrl+shift+alt+0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Minus |   -   |                         - |                         - |                  oem_minus |    NO   |
|                    Shift+Minus |   _   |                   Shift+- |                   Shift+- |            shift+oem_minus |    NO   |
|                 Ctrl+Alt+Minus |  ---  |                Ctrl+Alt+- |                Ctrl+Alt+- |         ctrl+alt+oem_minus |    NO   |
|           Ctrl+Shift+Alt+Minus |  ---  |          Ctrl+Shift+Alt+- |          Ctrl+Shift+Alt+- |   ctrl+shift+alt+oem_minus |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Equal |   =   |                         = |                         = |                   oem_plus |    NO   |
|                    Shift+Equal |   +   |                   Shift+= |                   Shift+= |             shift+oem_plus |    NO   |
|                 Ctrl+Alt+Equal |   §   |                Ctrl+Alt+= |                Ctrl+Alt+= |          ctrl+alt+oem_plus |    NO   |
|           Ctrl+Shift+Alt+Equal |  ---  |          Ctrl+Shift+Alt+= |          Ctrl+Shift+Alt+= |    ctrl+shift+alt+oem_plus |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                    BracketLeft |   ´   |                         [ |                         ´ |                      oem_4 |    NO   |
|              Shift+BracketLeft |   `   |                   Shift+[ |                   Shift+´ |                shift+oem_4 |    NO   |
|           Ctrl+Alt+BracketLeft |  ---  |                Ctrl+Alt+[ |                Ctrl+Alt+´ |             ctrl+alt+oem_4 |    NO   |
|     Ctrl+Shift+Alt+BracketLeft |  ---  |          Ctrl+Shift+Alt+[ |          Ctrl+Shift+Alt+´ |       ctrl+shift+alt+oem_4 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                   BracketRight |   [   |                         ] |                         [ |                      oem_6 |    NO   |
|             Shift+BracketRight |   {   |                   Shift+] |                   Shift+[ |                shift+oem_6 |    NO   |
|          Ctrl+Alt+BracketRight |   ª   |                Ctrl+Alt+] |                Ctrl+Alt+[ |             ctrl+alt+oem_6 |    NO   |
|    Ctrl+Shift+Alt+BracketRight |  ---  |          Ctrl+Shift+Alt+] |          Ctrl+Shift+Alt+[ |       ctrl+shift+alt+oem_6 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backslash |   ]   |                         \ |                         ] |                      oem_5 |    NO   |
|                Shift+Backslash |   }   |                   Shift+\ |                   Shift+] |                shift+oem_5 |    NO   |
|             Ctrl+Alt+Backslash |   º   |                Ctrl+Alt+\ |                Ctrl+Alt+] |             ctrl+alt+oem_5 |    NO   |
|       Ctrl+Shift+Alt+Backslash |  ---  |          Ctrl+Shift+Alt+\ |          Ctrl+Shift+Alt+] |       ctrl+shift+alt+oem_5 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                       IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|                 Shift+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|              Ctrl+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|        Ctrl+Shift+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Semicolon |   ç   |                         ; |                         ç |                      oem_1 |    NO   |
|                Shift+Semicolon |   Ç   |                   Shift+; |                   Shift+ç |                shift+oem_1 |    NO   |
|             Ctrl+Alt+Semicolon |  ---  |                Ctrl+Alt+; |                Ctrl+Alt+ç |             ctrl+alt+oem_1 |    NO   |
|       Ctrl+Shift+Alt+Semicolon |  ---  |          Ctrl+Shift+Alt+; |          Ctrl+Shift+Alt+ç |       ctrl+shift+alt+oem_1 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Quote |   ~   |                         ' |                         ~ |                      oem_7 |    NO   |
|                    Shift+Quote |   ^   |                   Shift+' |                   Shift+~ |                shift+oem_7 |    NO   |
|                 Ctrl+Alt+Quote |  ---  |                Ctrl+Alt+' |                Ctrl+Alt+~ |             ctrl+alt+oem_7 |    NO   |
|           Ctrl+Shift+Alt+Quote |  ---  |          Ctrl+Shift+Alt+' |          Ctrl+Shift+Alt+~ |       ctrl+shift+alt+oem_7 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backquote |   '   |                         ` |                         ' |                      oem_3 |    NO   |
|                Shift+Backquote |   "   |                   Shift+` |                   Shift+' |                shift+oem_3 |    NO   |
|             Ctrl+Alt+Backquote |  ---  |                Ctrl+Alt+` |                Ctrl+Alt+' |             ctrl+alt+oem_3 |    NO   |
|       Ctrl+Shift+Alt+Backquote |  ---  |          Ctrl+Shift+Alt+` |          Ctrl+Shift+Alt+' |       ctrl+shift+alt+oem_3 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Comma |   ,   |                         , |                         , |                  oem_comma |    NO   |
|                    Shift+Comma |   <   |                   Shift+, |                   Shift+, |            shift+oem_comma |    NO   |
|                 Ctrl+Alt+Comma |  ---  |                Ctrl+Alt+, |                Ctrl+Alt+, |         ctrl+alt+oem_comma |    NO   |
|           Ctrl+Shift+Alt+Comma |  ---  |          Ctrl+Shift+Alt+, |          Ctrl+Shift+Alt+, |   ctrl+shift+alt+oem_comma |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Period |   .   |                         . |                         . |                 oem_period |    NO   |
|                   Shift+Period |   >   |                   Shift+. |                   Shift+. |           shift+oem_period |    NO   |
|                Ctrl+Alt+Period |  ---  |                Ctrl+Alt+. |                Ctrl+Alt+. |        ctrl+alt+oem_period |    NO   |
|          Ctrl+Shift+Alt+Period |  ---  |          Ctrl+Shift+Alt+. |          Ctrl+Shift+Alt+. |  ctrl+shift+alt+oem_period |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Slash |   ;   |                         / |                         ; |                      oem_2 |    NO   |
|                    Shift+Slash |   :   |                   Shift+/ |                   Shift+; |                shift+oem_2 |    NO   |
|                 Ctrl+Alt+Slash |  ---  |                Ctrl+Alt+/ |                Ctrl+Alt+; |             ctrl+alt+oem_2 |    NO   |
|           Ctrl+Shift+Alt+Slash |  ---  |          Ctrl+Shift+Alt+/ |          Ctrl+Shift+Alt+; |       ctrl+shift+alt+oem_2 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        ArrowUp |  ---  |                   UpArrow |                   UpArrow |                         up |         |
|                  Shift+ArrowUp |  ---  |             Shift+UpArrow |             Shift+UpArrow |                   shift+up |         |
|               Ctrl+Alt+ArrowUp |  ---  |          Ctrl+Alt+UpArrow |          Ctrl+Alt+UpArrow |                ctrl+alt+up |         |
|         Ctrl+Shift+Alt+ArrowUp |  ---  |    Ctrl+Shift+Alt+UpArrow |    Ctrl+Shift+Alt+UpArrow |          ctrl+shift+alt+up |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        Numpad0 |  ---  |                   NumPad0 |                   NumPad0 |                    numpad0 |         |
|                  Shift+Numpad0 |  ---  |             Shift+NumPad0 |             Shift+NumPad0 |              shift+numpad0 |         |
|               Ctrl+Alt+Numpad0 |  ---  |          Ctrl+Alt+NumPad0 |          Ctrl+Alt+NumPad0 |           ctrl+alt+numpad0 |         |
|         Ctrl+Shift+Alt+Numpad0 |  ---  |    Ctrl+Shift+Alt+NumPad0 |    Ctrl+Shift+Alt+NumPad0 |     ctrl+shift+alt+numpad0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                  IntlBackslash |   \   |                   OEM_102 |                         \ |                    oem_102 |    NO   |
|            Shift+IntlBackslash |   |   |             Shift+OEM_102 |                   Shift+\ |              shift+oem_102 |    NO   |
|         Ctrl+Alt+IntlBackslash |  ---  |          Ctrl+Alt+OEM_102 |                Ctrl+Alt+\ |           ctrl+alt+oem_102 |    NO   |
|   Ctrl+Shift+Alt+IntlBackslash |  ---  |    Ctrl+Shift+Alt+OEM_102 |          Ctrl+Shift+Alt+\ |     ctrl+shift+alt+oem_102 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         IntlRo |   /   |                   ABNT_C1 |                         / |                    abnt_c1 |    NO   |
|                   Shift+IntlRo |   ?   |             Shift+ABNT_C1 |                   Shift+/ |              shift+abnt_c1 |    NO   |
|                Ctrl+Alt+IntlRo |   °   |          Ctrl+Alt+ABNT_C1 |                Ctrl+Alt+/ |           ctrl+alt+abnt_c1 |    NO   |
|          Ctrl+Shift+Alt+IntlRo |  ---  |    Ctrl+Shift+Alt+ABNT_C1 |          Ctrl+Shift+Alt+/ |     ctrl+shift+alt+abnt_c1 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|                  Shift+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|               Ctrl+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|         Ctrl+Shift+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/win_ru.js]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_ru.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

define({
	Sleep: {
		vkey: 'VK_SLEEP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	WakeUp: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyA: {
		vkey: 'VK_A',
		value: 'ф',
		withShift: 'Ф',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyB: {
		vkey: 'VK_B',
		value: 'и',
		withShift: 'И',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyC: {
		vkey: 'VK_C',
		value: 'с',
		withShift: 'С',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyD: {
		vkey: 'VK_D',
		value: 'в',
		withShift: 'В',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyE: {
		vkey: 'VK_E',
		value: 'у',
		withShift: 'У',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyF: {
		vkey: 'VK_F',
		value: 'а',
		withShift: 'А',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyG: {
		vkey: 'VK_G',
		value: 'п',
		withShift: 'П',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyH: {
		vkey: 'VK_H',
		value: 'р',
		withShift: 'Р',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyI: {
		vkey: 'VK_I',
		value: 'ш',
		withShift: 'Ш',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyJ: {
		vkey: 'VK_J',
		value: 'о',
		withShift: 'О',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyK: {
		vkey: 'VK_K',
		value: 'л',
		withShift: 'Л',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyL: {
		vkey: 'VK_L',
		value: 'д',
		withShift: 'Д',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyM: {
		vkey: 'VK_M',
		value: 'ь',
		withShift: 'Ь',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyN: {
		vkey: 'VK_N',
		value: 'т',
		withShift: 'Т',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyO: {
		vkey: 'VK_O',
		value: 'щ',
		withShift: 'Щ',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyP: {
		vkey: 'VK_P',
		value: 'з',
		withShift: 'З',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyQ: {
		vkey: 'VK_Q',
		value: 'й',
		withShift: 'Й',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyR: {
		vkey: 'VK_R',
		value: 'к',
		withShift: 'К',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyS: {
		vkey: 'VK_S',
		value: 'ы',
		withShift: 'Ы',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyT: {
		vkey: 'VK_T',
		value: 'е',
		withShift: 'Е',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyU: {
		vkey: 'VK_U',
		value: 'г',
		withShift: 'Г',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyV: {
		vkey: 'VK_V',
		value: 'м',
		withShift: 'М',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyW: {
		vkey: 'VK_W',
		value: 'ц',
		withShift: 'Ц',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyX: {
		vkey: 'VK_X',
		value: 'ч',
		withShift: 'Ч',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyY: {
		vkey: 'VK_Y',
		value: 'н',
		withShift: 'Н',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KeyZ: {
		vkey: 'VK_Z',
		value: 'я',
		withShift: 'Я',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit1: {
		vkey: 'VK_1',
		value: '1',
		withShift: '!',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit2: {
		vkey: 'VK_2',
		value: '2',
		withShift: '\"',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit3: {
		vkey: 'VK_3',
		value: '3',
		withShift: '№',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit4: {
		vkey: 'VK_4',
		value: '4',
		withShift: ';',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit5: {
		vkey: 'VK_5',
		value: '5',
		withShift: '%',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit6: {
		vkey: 'VK_6',
		value: '6',
		withShift: ':',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit7: {
		vkey: 'VK_7',
		value: '7',
		withShift: '?',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit8: {
		vkey: 'VK_8',
		value: '8',
		withShift: '*',
		withAltGr: '₽',
		withShiftAltGr: ''
	},
	Digit9: {
		vkey: 'VK_9',
		value: '9',
		withShift: '(',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Digit0: {
		vkey: 'VK_0',
		value: '0',
		withShift: ')',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Enter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Escape: {
		vkey: 'VK_ESCAPE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backspace: {
		vkey: 'VK_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Tab: {
		vkey: 'VK_TAB',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Space: {
		vkey: 'VK_SPACE',
		value: ' ',
		withShift: ' ',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Minus: {
		vkey: 'VK_OEM_MINUS',
		value: '-',
		withShift: '_',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Equal: {
		vkey: 'VK_OEM_PLUS',
		value: '=',
		withShift: '+',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BracketLeft: {
		vkey: 'VK_OEM_4',
		value: 'х',
		withShift: 'Х',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BracketRight: {
		vkey: 'VK_OEM_6',
		value: 'ъ',
		withShift: 'Ъ',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backslash: {
		vkey: 'VK_OEM_5',
		value: '\\',
		withShift: '/',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Semicolon: {
		vkey: 'VK_OEM_1',
		value: 'ж',
		withShift: 'Ж',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Quote: {
		vkey: 'VK_OEM_7',
		value: 'э',
		withShift: 'Э',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Backquote: {
		vkey: 'VK_OEM_3',
		value: 'ё',
		withShift: 'Ё',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Comma: {
		vkey: 'VK_OEM_COMMA',
		value: 'б',
		withShift: 'Б',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Period: {
		vkey: 'VK_OEM_PERIOD',
		value: 'ю',
		withShift: 'Ю',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Slash: {
		vkey: 'VK_OEM_2',
		value: '.',
		withShift: ',',
		withAltGr: '',
		withShiftAltGr: ''
	},
	CapsLock: {
		vkey: 'VK_CAPITAL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F1: {
		vkey: 'VK_F1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F2: {
		vkey: 'VK_F2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F3: {
		vkey: 'VK_F3',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F4: {
		vkey: 'VK_F4',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F5: {
		vkey: 'VK_F5',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F6: {
		vkey: 'VK_F6',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F7: {
		vkey: 'VK_F7',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F8: {
		vkey: 'VK_F8',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F9: {
		vkey: 'VK_F9',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F10: {
		vkey: 'VK_F10',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F11: {
		vkey: 'VK_F11',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F12: {
		vkey: 'VK_F12',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PrintScreen: {
		vkey: 'VK_SNAPSHOT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ScrollLock: {
		vkey: 'VK_SCROLL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Pause: {
		vkey: 'VK_NUMLOCK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Insert: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Home: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageUp: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Delete: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	End: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	PageDown: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowRight: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowLeft: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowDown: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ArrowUp: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumLock: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDivide: {
		vkey: 'VK_DIVIDE',
		value: '/',
		withShift: '/',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadMultiply: {
		vkey: 'VK_MULTIPLY',
		value: '*',
		withShift: '*',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadSubtract: {
		vkey: 'VK_SUBTRACT',
		value: '-',
		withShift: '-',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadAdd: {
		vkey: 'VK_ADD',
		value: '+',
		withShift: '+',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEnter: {
		vkey: 'VK_RETURN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad1: {
		vkey: 'VK_END',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad2: {
		vkey: 'VK_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad3: {
		vkey: 'VK_NEXT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad4: {
		vkey: 'VK_LEFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad5: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad6: {
		vkey: 'VK_RIGHT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad7: {
		vkey: 'VK_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad8: {
		vkey: 'VK_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad9: {
		vkey: 'VK_PRIOR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Numpad0: {
		vkey: 'VK_INSERT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadDecimal: {
		vkey: 'VK_DELETE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlBackslash: {
		vkey: 'VK_OEM_102',
		value: '\\',
		withShift: '/',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ContextMenu: {
		vkey: 'VK_APPS',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Power: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadEqual: {
		vkey: 'VK_CLEAR',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F13: {
		vkey: 'VK_F13',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F14: {
		vkey: 'VK_F14',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F15: {
		vkey: 'VK_F15',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F16: {
		vkey: 'VK_F16',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F17: {
		vkey: 'VK_F17',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F18: {
		vkey: 'VK_F18',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F19: {
		vkey: 'VK_F19',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F20: {
		vkey: 'VK_F20',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F21: {
		vkey: 'VK_F21',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F22: {
		vkey: 'VK_F22',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F23: {
		vkey: 'VK_F23',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	F24: {
		vkey: 'VK_F24',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Help: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Undo: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Cut: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Copy: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Paste: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeMute: {
		vkey: 'VK_VOLUME_MUTE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeUp: {
		vkey: 'VK_VOLUME_UP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AudioVolumeDown: {
		vkey: 'VK_VOLUME_DOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NumpadComma: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlRo: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	KanaMode: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	IntlYen: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Convert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	NonConvert: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang1: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang2: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang3: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Lang4: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlLeft: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftLeft: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltLeft: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaLeft: {
		vkey: 'VK_LWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ControlRight: {
		vkey: 'VK_CONTROL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	ShiftRight: {
		vkey: 'VK_SHIFT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	AltRight: {
		vkey: 'VK_MENU',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MetaRight: {
		vkey: 'VK_RWIN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackNext: {
		vkey: 'VK_MEDIA_NEXT_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaTrackPrevious: {
		vkey: 'VK_MEDIA_PREV_TRACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaStop: {
		vkey: 'VK_MEDIA_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	Eject: {
		vkey: 'VK_UNKNOWN',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaPlayPause: {
		vkey: 'VK_MEDIA_PLAY_PAUSE',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	MediaSelect: {
		vkey: 'VK_LAUNCH_MEDIA_SELECT',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchMail: {
		vkey: 'VK_LAUNCH_MAIL',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp2: {
		vkey: 'VK_LAUNCH_APP2',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	LaunchApp1: {
		vkey: 'VK_LAUNCH_APP1',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserSearch: {
		vkey: 'VK_BROWSER_SEARCH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserHome: {
		vkey: 'VK_BROWSER_HOME',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserBack: {
		vkey: 'VK_BROWSER_BACK',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserForward: {
		vkey: 'VK_BROWSER_FORWARD',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserStop: {
		vkey: 'VK_BROWSER_STOP',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserRefresh: {
		vkey: 'VK_BROWSER_REFRESH',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	},
	BrowserFavorites: {
		vkey: 'VK_BROWSER_FAVORITES',
		value: '',
		withShift: '',
		withAltGr: '',
		withShiftAltGr: ''
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/win_ru.txt]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/win_ru.txt

```text
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyA |   ф   |                         A |                         A |                          a |         |
|                     Shift+KeyA |   Ф   |                   Shift+A |                   Shift+A |                    shift+a |         |
|                  Ctrl+Alt+KeyA |  ---  |                Ctrl+Alt+A |                Ctrl+Alt+A |                 ctrl+alt+a |         |
|            Ctrl+Shift+Alt+KeyA |  ---  |          Ctrl+Shift+Alt+A |          Ctrl+Shift+Alt+A |           ctrl+shift+alt+a |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyB |   и   |                         B |                         B |                          b |         |
|                     Shift+KeyB |   И   |                   Shift+B |                   Shift+B |                    shift+b |         |
|                  Ctrl+Alt+KeyB |  ---  |                Ctrl+Alt+B |                Ctrl+Alt+B |                 ctrl+alt+b |         |
|            Ctrl+Shift+Alt+KeyB |  ---  |          Ctrl+Shift+Alt+B |          Ctrl+Shift+Alt+B |           ctrl+shift+alt+b |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyC |   с   |                         C |                         C |                          c |         |
|                     Shift+KeyC |   С   |                   Shift+C |                   Shift+C |                    shift+c |         |
|                  Ctrl+Alt+KeyC |  ---  |                Ctrl+Alt+C |                Ctrl+Alt+C |                 ctrl+alt+c |         |
|            Ctrl+Shift+Alt+KeyC |  ---  |          Ctrl+Shift+Alt+C |          Ctrl+Shift+Alt+C |           ctrl+shift+alt+c |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyD |   в   |                         D |                         D |                          d |         |
|                     Shift+KeyD |   В   |                   Shift+D |                   Shift+D |                    shift+d |         |
|                  Ctrl+Alt+KeyD |  ---  |                Ctrl+Alt+D |                Ctrl+Alt+D |                 ctrl+alt+d |         |
|            Ctrl+Shift+Alt+KeyD |  ---  |          Ctrl+Shift+Alt+D |          Ctrl+Shift+Alt+D |           ctrl+shift+alt+d |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyE |   у   |                         E |                         E |                          e |         |
|                     Shift+KeyE |   У   |                   Shift+E |                   Shift+E |                    shift+e |         |
|                  Ctrl+Alt+KeyE |  ---  |                Ctrl+Alt+E |                Ctrl+Alt+E |                 ctrl+alt+e |         |
|            Ctrl+Shift+Alt+KeyE |  ---  |          Ctrl+Shift+Alt+E |          Ctrl+Shift+Alt+E |           ctrl+shift+alt+e |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyF |   а   |                         F |                         F |                          f |         |
|                     Shift+KeyF |   А   |                   Shift+F |                   Shift+F |                    shift+f |         |
|                  Ctrl+Alt+KeyF |  ---  |                Ctrl+Alt+F |                Ctrl+Alt+F |                 ctrl+alt+f |         |
|            Ctrl+Shift+Alt+KeyF |  ---  |          Ctrl+Shift+Alt+F |          Ctrl+Shift+Alt+F |           ctrl+shift+alt+f |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyG |   п   |                         G |                         G |                          g |         |
|                     Shift+KeyG |   П   |                   Shift+G |                   Shift+G |                    shift+g |         |
|                  Ctrl+Alt+KeyG |  ---  |                Ctrl+Alt+G |                Ctrl+Alt+G |                 ctrl+alt+g |         |
|            Ctrl+Shift+Alt+KeyG |  ---  |          Ctrl+Shift+Alt+G |          Ctrl+Shift+Alt+G |           ctrl+shift+alt+g |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyH |   р   |                         H |                         H |                          h |         |
|                     Shift+KeyH |   Р   |                   Shift+H |                   Shift+H |                    shift+h |         |
|                  Ctrl+Alt+KeyH |  ---  |                Ctrl+Alt+H |                Ctrl+Alt+H |                 ctrl+alt+h |         |
|            Ctrl+Shift+Alt+KeyH |  ---  |          Ctrl+Shift+Alt+H |          Ctrl+Shift+Alt+H |           ctrl+shift+alt+h |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyI |   ш   |                         I |                         I |                          i |         |
|                     Shift+KeyI |   Ш   |                   Shift+I |                   Shift+I |                    shift+i |         |
|                  Ctrl+Alt+KeyI |  ---  |                Ctrl+Alt+I |                Ctrl+Alt+I |                 ctrl+alt+i |         |
|            Ctrl+Shift+Alt+KeyI |  ---  |          Ctrl+Shift+Alt+I |          Ctrl+Shift+Alt+I |           ctrl+shift+alt+i |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyJ |   о   |                         J |                         J |                          j |         |
|                     Shift+KeyJ |   О   |                   Shift+J |                   Shift+J |                    shift+j |         |
|                  Ctrl+Alt+KeyJ |  ---  |                Ctrl+Alt+J |                Ctrl+Alt+J |                 ctrl+alt+j |         |
|            Ctrl+Shift+Alt+KeyJ |  ---  |          Ctrl+Shift+Alt+J |          Ctrl+Shift+Alt+J |           ctrl+shift+alt+j |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyK |   л   |                         K |                         K |                          k |         |
|                     Shift+KeyK |   Л   |                   Shift+K |                   Shift+K |                    shift+k |         |
|                  Ctrl+Alt+KeyK |  ---  |                Ctrl+Alt+K |                Ctrl+Alt+K |                 ctrl+alt+k |         |
|            Ctrl+Shift+Alt+KeyK |  ---  |          Ctrl+Shift+Alt+K |          Ctrl+Shift+Alt+K |           ctrl+shift+alt+k |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyL |   д   |                         L |                         L |                          l |         |
|                     Shift+KeyL |   Д   |                   Shift+L |                   Shift+L |                    shift+l |         |
|                  Ctrl+Alt+KeyL |  ---  |                Ctrl+Alt+L |                Ctrl+Alt+L |                 ctrl+alt+l |         |
|            Ctrl+Shift+Alt+KeyL |  ---  |          Ctrl+Shift+Alt+L |          Ctrl+Shift+Alt+L |           ctrl+shift+alt+l |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyM |   ь   |                         M |                         M |                          m |         |
|                     Shift+KeyM |   Ь   |                   Shift+M |                   Shift+M |                    shift+m |         |
|                  Ctrl+Alt+KeyM |  ---  |                Ctrl+Alt+M |                Ctrl+Alt+M |                 ctrl+alt+m |         |
|            Ctrl+Shift+Alt+KeyM |  ---  |          Ctrl+Shift+Alt+M |          Ctrl+Shift+Alt+M |           ctrl+shift+alt+m |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyN |   т   |                         N |                         N |                          n |         |
|                     Shift+KeyN |   Т   |                   Shift+N |                   Shift+N |                    shift+n |         |
|                  Ctrl+Alt+KeyN |  ---  |                Ctrl+Alt+N |                Ctrl+Alt+N |                 ctrl+alt+n |         |
|            Ctrl+Shift+Alt+KeyN |  ---  |          Ctrl+Shift+Alt+N |          Ctrl+Shift+Alt+N |           ctrl+shift+alt+n |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyO |   щ   |                         O |                         O |                          o |         |
|                     Shift+KeyO |   Щ   |                   Shift+O |                   Shift+O |                    shift+o |         |
|                  Ctrl+Alt+KeyO |  ---  |                Ctrl+Alt+O |                Ctrl+Alt+O |                 ctrl+alt+o |         |
|            Ctrl+Shift+Alt+KeyO |  ---  |          Ctrl+Shift+Alt+O |          Ctrl+Shift+Alt+O |           ctrl+shift+alt+o |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyP |   з   |                         P |                         P |                          p |         |
|                     Shift+KeyP |   З   |                   Shift+P |                   Shift+P |                    shift+p |         |
|                  Ctrl+Alt+KeyP |  ---  |                Ctrl+Alt+P |                Ctrl+Alt+P |                 ctrl+alt+p |         |
|            Ctrl+Shift+Alt+KeyP |  ---  |          Ctrl+Shift+Alt+P |          Ctrl+Shift+Alt+P |           ctrl+shift+alt+p |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyQ |   й   |                         Q |                         Q |                          q |         |
|                     Shift+KeyQ |   Й   |                   Shift+Q |                   Shift+Q |                    shift+q |         |
|                  Ctrl+Alt+KeyQ |  ---  |                Ctrl+Alt+Q |                Ctrl+Alt+Q |                 ctrl+alt+q |         |
|            Ctrl+Shift+Alt+KeyQ |  ---  |          Ctrl+Shift+Alt+Q |          Ctrl+Shift+Alt+Q |           ctrl+shift+alt+q |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyR |   к   |                         R |                         R |                          r |         |
|                     Shift+KeyR |   К   |                   Shift+R |                   Shift+R |                    shift+r |         |
|                  Ctrl+Alt+KeyR |  ---  |                Ctrl+Alt+R |                Ctrl+Alt+R |                 ctrl+alt+r |         |
|            Ctrl+Shift+Alt+KeyR |  ---  |          Ctrl+Shift+Alt+R |          Ctrl+Shift+Alt+R |           ctrl+shift+alt+r |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyS |   ы   |                         S |                         S |                          s |         |
|                     Shift+KeyS |   Ы   |                   Shift+S |                   Shift+S |                    shift+s |         |
|                  Ctrl+Alt+KeyS |  ---  |                Ctrl+Alt+S |                Ctrl+Alt+S |                 ctrl+alt+s |         |
|            Ctrl+Shift+Alt+KeyS |  ---  |          Ctrl+Shift+Alt+S |          Ctrl+Shift+Alt+S |           ctrl+shift+alt+s |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyT |   е   |                         T |                         T |                          t |         |
|                     Shift+KeyT |   Е   |                   Shift+T |                   Shift+T |                    shift+t |         |
|                  Ctrl+Alt+KeyT |  ---  |                Ctrl+Alt+T |                Ctrl+Alt+T |                 ctrl+alt+t |         |
|            Ctrl+Shift+Alt+KeyT |  ---  |          Ctrl+Shift+Alt+T |          Ctrl+Shift+Alt+T |           ctrl+shift+alt+t |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyU |   г   |                         U |                         U |                          u |         |
|                     Shift+KeyU |   Г   |                   Shift+U |                   Shift+U |                    shift+u |         |
|                  Ctrl+Alt+KeyU |  ---  |                Ctrl+Alt+U |                Ctrl+Alt+U |                 ctrl+alt+u |         |
|            Ctrl+Shift+Alt+KeyU |  ---  |          Ctrl+Shift+Alt+U |          Ctrl+Shift+Alt+U |           ctrl+shift+alt+u |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyV |   м   |                         V |                         V |                          v |         |
|                     Shift+KeyV |   М   |                   Shift+V |                   Shift+V |                    shift+v |         |
|                  Ctrl+Alt+KeyV |  ---  |                Ctrl+Alt+V |                Ctrl+Alt+V |                 ctrl+alt+v |         |
|            Ctrl+Shift+Alt+KeyV |  ---  |          Ctrl+Shift+Alt+V |          Ctrl+Shift+Alt+V |           ctrl+shift+alt+v |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyW |   ц   |                         W |                         W |                          w |         |
|                     Shift+KeyW |   Ц   |                   Shift+W |                   Shift+W |                    shift+w |         |
|                  Ctrl+Alt+KeyW |  ---  |                Ctrl+Alt+W |                Ctrl+Alt+W |                 ctrl+alt+w |         |
|            Ctrl+Shift+Alt+KeyW |  ---  |          Ctrl+Shift+Alt+W |          Ctrl+Shift+Alt+W |           ctrl+shift+alt+w |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyX |   ч   |                         X |                         X |                          x |         |
|                     Shift+KeyX |   Ч   |                   Shift+X |                   Shift+X |                    shift+x |         |
|                  Ctrl+Alt+KeyX |  ---  |                Ctrl+Alt+X |                Ctrl+Alt+X |                 ctrl+alt+x |         |
|            Ctrl+Shift+Alt+KeyX |  ---  |          Ctrl+Shift+Alt+X |          Ctrl+Shift+Alt+X |           ctrl+shift+alt+x |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyY |   н   |                         Y |                         Y |                          y |         |
|                     Shift+KeyY |   Н   |                   Shift+Y |                   Shift+Y |                    shift+y |         |
|                  Ctrl+Alt+KeyY |  ---  |                Ctrl+Alt+Y |                Ctrl+Alt+Y |                 ctrl+alt+y |         |
|            Ctrl+Shift+Alt+KeyY |  ---  |          Ctrl+Shift+Alt+Y |          Ctrl+Shift+Alt+Y |           ctrl+shift+alt+y |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                           KeyZ |   я   |                         Z |                         Z |                          z |         |
|                     Shift+KeyZ |   Я   |                   Shift+Z |                   Shift+Z |                    shift+z |         |
|                  Ctrl+Alt+KeyZ |  ---  |                Ctrl+Alt+Z |                Ctrl+Alt+Z |                 ctrl+alt+z |         |
|            Ctrl+Shift+Alt+KeyZ |  ---  |          Ctrl+Shift+Alt+Z |          Ctrl+Shift+Alt+Z |           ctrl+shift+alt+z |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit1 |   1   |                         1 |                         1 |                          1 |         |
|                   Shift+Digit1 |   !   |                   Shift+1 |                   Shift+1 |                    shift+1 |         |
|                Ctrl+Alt+Digit1 |  ---  |                Ctrl+Alt+1 |                Ctrl+Alt+1 |                 ctrl+alt+1 |         |
|          Ctrl+Shift+Alt+Digit1 |  ---  |          Ctrl+Shift+Alt+1 |          Ctrl+Shift+Alt+1 |           ctrl+shift+alt+1 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit2 |   2   |                         2 |                         2 |                          2 |         |
|                   Shift+Digit2 |   "   |                   Shift+2 |                   Shift+2 |                    shift+2 |         |
|                Ctrl+Alt+Digit2 |  ---  |                Ctrl+Alt+2 |                Ctrl+Alt+2 |                 ctrl+alt+2 |         |
|          Ctrl+Shift+Alt+Digit2 |  ---  |          Ctrl+Shift+Alt+2 |          Ctrl+Shift+Alt+2 |           ctrl+shift+alt+2 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit3 |   3   |                         3 |                         3 |                          3 |         |
|                   Shift+Digit3 |   №   |                   Shift+3 |                   Shift+3 |                    shift+3 |         |
|                Ctrl+Alt+Digit3 |  ---  |                Ctrl+Alt+3 |                Ctrl+Alt+3 |                 ctrl+alt+3 |         |
|          Ctrl+Shift+Alt+Digit3 |  ---  |          Ctrl+Shift+Alt+3 |          Ctrl+Shift+Alt+3 |           ctrl+shift+alt+3 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit4 |   4   |                         4 |                         4 |                          4 |         |
|                   Shift+Digit4 |   ;   |                   Shift+4 |                   Shift+4 |                    shift+4 |         |
|                Ctrl+Alt+Digit4 |  ---  |                Ctrl+Alt+4 |                Ctrl+Alt+4 |                 ctrl+alt+4 |         |
|          Ctrl+Shift+Alt+Digit4 |  ---  |          Ctrl+Shift+Alt+4 |          Ctrl+Shift+Alt+4 |           ctrl+shift+alt+4 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit5 |   5   |                         5 |                         5 |                          5 |         |
|                   Shift+Digit5 |   %   |                   Shift+5 |                   Shift+5 |                    shift+5 |         |
|                Ctrl+Alt+Digit5 |  ---  |                Ctrl+Alt+5 |                Ctrl+Alt+5 |                 ctrl+alt+5 |         |
|          Ctrl+Shift+Alt+Digit5 |  ---  |          Ctrl+Shift+Alt+5 |          Ctrl+Shift+Alt+5 |           ctrl+shift+alt+5 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit6 |   6   |                         6 |                         6 |                          6 |         |
|                   Shift+Digit6 |   :   |                   Shift+6 |                   Shift+6 |                    shift+6 |         |
|                Ctrl+Alt+Digit6 |  ---  |                Ctrl+Alt+6 |                Ctrl+Alt+6 |                 ctrl+alt+6 |         |
|          Ctrl+Shift+Alt+Digit6 |  ---  |          Ctrl+Shift+Alt+6 |          Ctrl+Shift+Alt+6 |           ctrl+shift+alt+6 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit7 |   7   |                         7 |                         7 |                          7 |         |
|                   Shift+Digit7 |   ?   |                   Shift+7 |                   Shift+7 |                    shift+7 |         |
|                Ctrl+Alt+Digit7 |  ---  |                Ctrl+Alt+7 |                Ctrl+Alt+7 |                 ctrl+alt+7 |         |
|          Ctrl+Shift+Alt+Digit7 |  ---  |          Ctrl+Shift+Alt+7 |          Ctrl+Shift+Alt+7 |           ctrl+shift+alt+7 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit8 |   8   |                         8 |                         8 |                          8 |         |
|                   Shift+Digit8 |   *   |                   Shift+8 |                   Shift+8 |                    shift+8 |         |
|                Ctrl+Alt+Digit8 |   ₽   |                Ctrl+Alt+8 |                Ctrl+Alt+8 |                 ctrl+alt+8 |         |
|          Ctrl+Shift+Alt+Digit8 |  ---  |          Ctrl+Shift+Alt+8 |          Ctrl+Shift+Alt+8 |           ctrl+shift+alt+8 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit9 |   9   |                         9 |                         9 |                          9 |         |
|                   Shift+Digit9 |   (   |                   Shift+9 |                   Shift+9 |                    shift+9 |         |
|                Ctrl+Alt+Digit9 |  ---  |                Ctrl+Alt+9 |                Ctrl+Alt+9 |                 ctrl+alt+9 |         |
|          Ctrl+Shift+Alt+Digit9 |  ---  |          Ctrl+Shift+Alt+9 |          Ctrl+Shift+Alt+9 |           ctrl+shift+alt+9 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Digit0 |   0   |                         0 |                         0 |                          0 |         |
|                   Shift+Digit0 |   )   |                   Shift+0 |                   Shift+0 |                    shift+0 |         |
|                Ctrl+Alt+Digit0 |  ---  |                Ctrl+Alt+0 |                Ctrl+Alt+0 |                 ctrl+alt+0 |         |
|          Ctrl+Shift+Alt+Digit0 |  ---  |          Ctrl+Shift+Alt+0 |          Ctrl+Shift+Alt+0 |           ctrl+shift+alt+0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Minus |   -   |                         - |                         - |                  oem_minus |    NO   |
|                    Shift+Minus |   _   |                   Shift+- |                   Shift+- |            shift+oem_minus |    NO   |
|                 Ctrl+Alt+Minus |  ---  |                Ctrl+Alt+- |                Ctrl+Alt+- |         ctrl+alt+oem_minus |    NO   |
|           Ctrl+Shift+Alt+Minus |  ---  |          Ctrl+Shift+Alt+- |          Ctrl+Shift+Alt+- |   ctrl+shift+alt+oem_minus |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Equal |   =   |                         = |                         = |                   oem_plus |    NO   |
|                    Shift+Equal |   +   |                   Shift+= |                   Shift+= |             shift+oem_plus |    NO   |
|                 Ctrl+Alt+Equal |  ---  |                Ctrl+Alt+= |                Ctrl+Alt+= |          ctrl+alt+oem_plus |    NO   |
|           Ctrl+Shift+Alt+Equal |  ---  |          Ctrl+Shift+Alt+= |          Ctrl+Shift+Alt+= |    ctrl+shift+alt+oem_plus |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                    BracketLeft |   х   |                         [ |                         [ |                      oem_4 |    NO   |
|              Shift+BracketLeft |   Х   |                   Shift+[ |                   Shift+[ |                shift+oem_4 |    NO   |
|           Ctrl+Alt+BracketLeft |  ---  |                Ctrl+Alt+[ |                Ctrl+Alt+[ |             ctrl+alt+oem_4 |    NO   |
|     Ctrl+Shift+Alt+BracketLeft |  ---  |          Ctrl+Shift+Alt+[ |          Ctrl+Shift+Alt+[ |       ctrl+shift+alt+oem_4 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                   BracketRight |   ъ   |                         ] |                         ] |                      oem_6 |    NO   |
|             Shift+BracketRight |   Ъ   |                   Shift+] |                   Shift+] |                shift+oem_6 |    NO   |
|          Ctrl+Alt+BracketRight |  ---  |                Ctrl+Alt+] |                Ctrl+Alt+] |             ctrl+alt+oem_6 |    NO   |
|    Ctrl+Shift+Alt+BracketRight |  ---  |          Ctrl+Shift+Alt+] |          Ctrl+Shift+Alt+] |       ctrl+shift+alt+oem_6 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backslash |   \   |                         \ |                         \ |                      oem_5 |    NO   |
|                Shift+Backslash |   /   |                   Shift+\ |                   Shift+\ |                shift+oem_5 |    NO   |
|             Ctrl+Alt+Backslash |  ---  |                Ctrl+Alt+\ |                Ctrl+Alt+\ |             ctrl+alt+oem_5 |    NO   |
|       Ctrl+Shift+Alt+Backslash |  ---  |          Ctrl+Shift+Alt+\ |          Ctrl+Shift+Alt+\ |       ctrl+shift+alt+oem_5 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                       IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|                 Shift+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|              Ctrl+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
|        Ctrl+Shift+Alt+IntlHash |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Semicolon |   ж   |                         ; |                         ; |                      oem_1 |    NO   |
|                Shift+Semicolon |   Ж   |                   Shift+; |                   Shift+; |                shift+oem_1 |    NO   |
|             Ctrl+Alt+Semicolon |  ---  |                Ctrl+Alt+; |                Ctrl+Alt+; |             ctrl+alt+oem_1 |    NO   |
|       Ctrl+Shift+Alt+Semicolon |  ---  |          Ctrl+Shift+Alt+; |          Ctrl+Shift+Alt+; |       ctrl+shift+alt+oem_1 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Quote |   э   |                         ' |                         ' |                      oem_7 |    NO   |
|                    Shift+Quote |   Э   |                   Shift+' |                   Shift+' |                shift+oem_7 |    NO   |
|                 Ctrl+Alt+Quote |  ---  |                Ctrl+Alt+' |                Ctrl+Alt+' |             ctrl+alt+oem_7 |    NO   |
|           Ctrl+Shift+Alt+Quote |  ---  |          Ctrl+Shift+Alt+' |          Ctrl+Shift+Alt+' |       ctrl+shift+alt+oem_7 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                      Backquote |   ё   |                         ` |                         ` |                      oem_3 |    NO   |
|                Shift+Backquote |   Ё   |                   Shift+` |                   Shift+` |                shift+oem_3 |    NO   |
|             Ctrl+Alt+Backquote |  ---  |                Ctrl+Alt+` |                Ctrl+Alt+` |             ctrl+alt+oem_3 |    NO   |
|       Ctrl+Shift+Alt+Backquote |  ---  |          Ctrl+Shift+Alt+` |          Ctrl+Shift+Alt+` |       ctrl+shift+alt+oem_3 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Comma |   б   |                         , |                         , |                  oem_comma |    NO   |
|                    Shift+Comma |   Б   |                   Shift+, |                   Shift+, |            shift+oem_comma |    NO   |
|                 Ctrl+Alt+Comma |  ---  |                Ctrl+Alt+, |                Ctrl+Alt+, |         ctrl+alt+oem_comma |    NO   |
|           Ctrl+Shift+Alt+Comma |  ---  |          Ctrl+Shift+Alt+, |          Ctrl+Shift+Alt+, |   ctrl+shift+alt+oem_comma |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         Period |   ю   |                         . |                         . |                 oem_period |    NO   |
|                   Shift+Period |   Ю   |                   Shift+. |                   Shift+. |           shift+oem_period |    NO   |
|                Ctrl+Alt+Period |  ---  |                Ctrl+Alt+. |                Ctrl+Alt+. |        ctrl+alt+oem_period |    NO   |
|          Ctrl+Shift+Alt+Period |  ---  |          Ctrl+Shift+Alt+. |          Ctrl+Shift+Alt+. |  ctrl+shift+alt+oem_period |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                          Slash |   .   |                         / |                         / |                      oem_2 |    NO   |
|                    Shift+Slash |   ,   |                   Shift+/ |                   Shift+/ |                shift+oem_2 |    NO   |
|                 Ctrl+Alt+Slash |  ---  |                Ctrl+Alt+/ |                Ctrl+Alt+/ |             ctrl+alt+oem_2 |    NO   |
|           Ctrl+Shift+Alt+Slash |  ---  |          Ctrl+Shift+Alt+/ |          Ctrl+Shift+Alt+/ |       ctrl+shift+alt+oem_2 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        ArrowUp |  ---  |                   UpArrow |                   UpArrow |                         up |         |
|                  Shift+ArrowUp |  ---  |             Shift+UpArrow |             Shift+UpArrow |                   shift+up |         |
|               Ctrl+Alt+ArrowUp |  ---  |          Ctrl+Alt+UpArrow |          Ctrl+Alt+UpArrow |                ctrl+alt+up |         |
|         Ctrl+Shift+Alt+ArrowUp |  ---  |    Ctrl+Shift+Alt+UpArrow |    Ctrl+Shift+Alt+UpArrow |          ctrl+shift+alt+up |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        Numpad0 |  ---  |                   NumPad0 |                   NumPad0 |                    numpad0 |         |
|                  Shift+Numpad0 |  ---  |             Shift+NumPad0 |             Shift+NumPad0 |              shift+numpad0 |         |
|               Ctrl+Alt+Numpad0 |  ---  |          Ctrl+Alt+NumPad0 |          Ctrl+Alt+NumPad0 |           ctrl+alt+numpad0 |         |
|         Ctrl+Shift+Alt+Numpad0 |  ---  |    Ctrl+Shift+Alt+NumPad0 |    Ctrl+Shift+Alt+NumPad0 |     ctrl+shift+alt+numpad0 |         |
-----------------------------------------------------------------------------------------------------------------------------------------
|                  IntlBackslash |   \   |                   OEM_102 |                         \ |                    oem_102 |    NO   |
|            Shift+IntlBackslash |   /   |             Shift+OEM_102 |                   Shift+\ |              shift+oem_102 |    NO   |
|         Ctrl+Alt+IntlBackslash |  ---  |          Ctrl+Alt+OEM_102 |                Ctrl+Alt+\ |           ctrl+alt+oem_102 |    NO   |
|   Ctrl+Shift+Alt+IntlBackslash |  ---  |    Ctrl+Shift+Alt+OEM_102 |          Ctrl+Shift+Alt+\ |     ctrl+shift+alt+oem_102 |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                         IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|                   Shift+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|                Ctrl+Alt+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
|          Ctrl+Shift+Alt+IntlRo |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
|                        IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|                  Shift+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|               Ctrl+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
|         Ctrl+Shift+Alt+IntlYen |  ---  |                      null |                      null |                       null |    NO   |
-----------------------------------------------------------------------------------------------------------------------------------------
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/label/common/labelService.ts]---
Location: vscode-main/src/vs/workbench/services/label/common/labelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IDisposable, Disposable, dispose } from '../../../../base/common/lifecycle.js';
import { posix, sep, win32 } from '../../../../base/common/path.js';
import { Emitter } from '../../../../base/common/event.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IWorkspaceContextService, IWorkspace, isWorkspace, ISingleFolderWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IWorkspaceIdentifier, toWorkspaceIdentifier, WORKSPACE_EXTENSION, isUntitledWorkspace, isTemporaryWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { basenameOrAuthority, basename, joinPath, dirname } from '../../../../base/common/resources.js';
import { tildify, getPathLabel } from '../../../../base/common/labels.js';
import { ILabelService, ResourceLabelFormatter, ResourceLabelFormatting, IFormatterChangeEvent, Verbosity } from '../../../../platform/label/common/label.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { match } from '../../../../base/common/glob.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IPathService } from '../../path/common/pathService.js';
import { isProposedApiEnabled } from '../../extensions/common/extensions.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { Schemas } from '../../../../base/common/network.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';

const resourceLabelFormattersExtPoint = ExtensionsRegistry.registerExtensionPoint<ResourceLabelFormatter[]>({
	extensionPoint: 'resourceLabelFormatters',
	jsonSchema: {
		description: localize('vscode.extension.contributes.resourceLabelFormatters', 'Contributes resource label formatting rules.'),
		type: 'array',
		items: {
			type: 'object',
			required: ['scheme', 'formatting'],
			properties: {
				scheme: {
					type: 'string',
					description: localize('vscode.extension.contributes.resourceLabelFormatters.scheme', 'URI scheme on which to match the formatter on. For example "file". Simple glob patterns are supported.'),
				},
				authority: {
					type: 'string',
					description: localize('vscode.extension.contributes.resourceLabelFormatters.authority', 'URI authority on which to match the formatter on. Simple glob patterns are supported.'),
				},
				formatting: {
					description: localize('vscode.extension.contributes.resourceLabelFormatters.formatting', "Rules for formatting uri resource labels."),
					type: 'object',
					properties: {
						label: {
							type: 'string',
							description: localize('vscode.extension.contributes.resourceLabelFormatters.label', "Label rules to display. For example: myLabel:/${path}. ${path}, ${scheme}, ${authority} and ${authoritySuffix} are supported as variables.")
						},
						separator: {
							type: 'string',
							description: localize('vscode.extension.contributes.resourceLabelFormatters.separator', "Separator to be used in the uri label display. '/' or '\' as an example.")
						},
						stripPathStartingSeparator: {
							type: 'boolean',
							description: localize('vscode.extension.contributes.resourceLabelFormatters.stripPathStartingSeparator', "Controls whether `${path}` substitutions should have starting separator characters stripped.")
						},
						tildify: {
							type: 'boolean',
							description: localize('vscode.extension.contributes.resourceLabelFormatters.tildify', "Controls if the start of the uri label should be tildified when possible.")
						},
						workspaceSuffix: {
							type: 'string',
							description: localize('vscode.extension.contributes.resourceLabelFormatters.formatting.workspaceSuffix', "Suffix appended to the workspace label.")
						}
					}
				}
			}
		}
	}
});

const posixPathSeparatorRegexp = /\//g; // on Unix, backslash is a valid filename character
const winPathSeparatorRegexp = /[\\\/]/g; // on Windows, neither slash nor backslash are valid filename characters
const labelMatchingRegexp = /\$\{(scheme|authoritySuffix|authority|path|(query)\.(.+?))\}/g;

function hasDriveLetterIgnorePlatform(path: string): boolean {
	return !!(path && path[2] === ':');
}

class ResourceLabelFormattersHandler implements IWorkbenchContribution {

	private readonly formattersDisposables = new Map<ResourceLabelFormatter, IDisposable>();

	constructor(@ILabelService labelService: ILabelService) {
		resourceLabelFormattersExtPoint.setHandler((extensions, delta) => {
			for (const added of delta.added) {
				for (const untrustedFormatter of added.value) {

					// We cannot trust that the formatter as it comes from an extension
					// adheres to our interface, so for the required properties we fill
					// in some defaults if missing.

					const formatter = { ...untrustedFormatter };
					if (typeof formatter.formatting.label !== 'string') {
						formatter.formatting.label = '${authority}${path}';
					}
					if (typeof formatter.formatting.separator !== `string`) {
						formatter.formatting.separator = sep;
					}

					if (!isProposedApiEnabled(added.description, 'contribLabelFormatterWorkspaceTooltip') && formatter.formatting.workspaceTooltip) {
						formatter.formatting.workspaceTooltip = undefined; // workspaceTooltip is only proposed
					}

					this.formattersDisposables.set(formatter, labelService.registerFormatter(formatter));
				}
			}

			for (const removed of delta.removed) {
				for (const formatter of removed.value) {
					dispose(this.formattersDisposables.get(formatter));
				}
			}
		});
	}
}
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ResourceLabelFormattersHandler, LifecyclePhase.Restored);

const FORMATTER_CACHE_SIZE = 50;

interface IStoredFormatters {
	formatters?: ResourceLabelFormatter[];
	i?: number;
}

export class LabelService extends Disposable implements ILabelService {

	declare readonly _serviceBrand: undefined;

	private formatters: ResourceLabelFormatter[];

	private readonly _onDidChangeFormatters = this._register(new Emitter<IFormatterChangeEvent>({ leakWarningThreshold: 400 }));
	readonly onDidChangeFormatters = this._onDidChangeFormatters.event;

	private readonly storedFormattersMemento: Memento<IStoredFormatters>;
	private readonly storedFormatters: IStoredFormatters;
	private os: OperatingSystem;
	private userHome: URI | undefined;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IPathService private readonly pathService: IPathService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IStorageService storageService: IStorageService,
		@ILifecycleService lifecycleService: ILifecycleService,
	) {
		super();

		// Find some meaningful defaults until the remote environment
		// is resolved, by taking the current OS we are running in
		// and by taking the local `userHome` if we run on a local
		// file scheme.
		this.os = OS;
		this.userHome = pathService.defaultUriScheme === Schemas.file ? this.pathService.userHome({ preferLocal: true }) : undefined;

		const memento = this.storedFormattersMemento = new Memento('cachedResourceLabelFormatters2', storageService);
		this.storedFormatters = memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		this.formatters = this.storedFormatters?.formatters?.slice() || [];

		// Remote environment is potentially long running
		this.resolveRemoteEnvironment();
	}

	private async resolveRemoteEnvironment(): Promise<void> {

		// OS
		const env = await this.remoteAgentService.getEnvironment();
		this.os = env?.os ?? OS;

		// User home
		this.userHome = await this.pathService.userHome();
	}

	findFormatting(resource: URI): ResourceLabelFormatting | undefined {
		let bestResult: ResourceLabelFormatter | undefined;

		for (const formatter of this.formatters) {
			if (formatter.scheme === resource.scheme) {
				if (!formatter.authority && (!bestResult || formatter.priority)) {
					bestResult = formatter;
					continue;
				}

				if (!formatter.authority) {
					continue;
				}

				if (match(formatter.authority, resource.authority, { ignoreCase: true }) &&
					(
						!bestResult?.authority ||
						formatter.authority.length > bestResult.authority.length ||
						((formatter.authority.length === bestResult.authority.length) && formatter.priority)
					)
				) {
					bestResult = formatter;
				}
			}
		}

		return bestResult ? bestResult.formatting : undefined;
	}

	getUriLabel(resource: URI, options: { relative?: boolean; noPrefix?: boolean; separator?: '/' | '\\'; appendWorkspaceSuffix?: boolean } = {}): string {
		let formatting = this.findFormatting(resource);
		if (formatting && options.separator) {
			// mixin separator if defined from the outside
			formatting = { ...formatting, separator: options.separator };
		}

		let label = this.doGetUriLabel(resource, formatting, options);

		// Without formatting we still need to support the separator
		// as provided in options (https://github.com/microsoft/vscode/issues/130019)
		if (!formatting && options.separator) {
			label = this.adjustPathSeparators(label, options.separator);
		}

		if (options.appendWorkspaceSuffix && formatting?.workspaceSuffix) {
			label = this.appendWorkspaceSuffix(label, resource);
		}

		return label;
	}

	private doGetUriLabel(resource: URI, formatting?: ResourceLabelFormatting, options: { relative?: boolean; noPrefix?: boolean } = {}): string {
		if (!formatting) {
			return getPathLabel(resource, {
				os: this.os,
				tildify: this.userHome ? { userHome: this.userHome } : undefined,
				relative: options.relative ? {
					noPrefix: options.noPrefix,
					getWorkspace: () => this.contextService.getWorkspace(),
					getWorkspaceFolder: resource => this.contextService.getWorkspaceFolder(resource)
				} : undefined
			});
		}

		// Relative label
		if (options.relative && this.contextService) {
			let folder = this.contextService.getWorkspaceFolder(resource);
			if (!folder) {

				// It is possible that the resource we want to resolve the
				// workspace folder for is not using the same scheme as
				// the folders in the workspace, so we help by trying again
				// to resolve a workspace folder by trying again with a
				// scheme that is workspace contained.

				const workspace = this.contextService.getWorkspace();
				const firstFolder = workspace.folders.at(0);
				if (firstFolder && resource.scheme !== firstFolder.uri.scheme && resource.path.startsWith(posix.sep)) {
					folder = this.contextService.getWorkspaceFolder(firstFolder.uri.with({ path: resource.path }));
				}
			}

			if (folder) {
				const folderLabel = this.formatUri(folder.uri, formatting, options.noPrefix);

				let relativeLabel = this.formatUri(resource, formatting, options.noPrefix);
				let overlap = 0;
				while (relativeLabel[overlap] && relativeLabel[overlap] === folderLabel[overlap]) {
					overlap++;
				}

				if (!relativeLabel[overlap] || relativeLabel[overlap] === formatting.separator) {
					relativeLabel = relativeLabel.substring(1 + overlap);
				} else if (overlap === folderLabel.length && folder.uri.path === posix.sep) {
					relativeLabel = relativeLabel.substring(overlap);
				}

				// always show root basename if there are multiple folders
				const hasMultipleRoots = this.contextService.getWorkspace().folders.length > 1;
				if (hasMultipleRoots && !options.noPrefix) {
					const rootName = folder?.name ?? basenameOrAuthority(folder.uri);
					relativeLabel = relativeLabel ? `${rootName} • ${relativeLabel}` : rootName;
				}

				return relativeLabel;
			}
		}

		// Absolute label
		return this.formatUri(resource, formatting, options.noPrefix);
	}

	getUriBasenameLabel(resource: URI): string {
		const formatting = this.findFormatting(resource);
		const label = this.doGetUriLabel(resource, formatting);

		let pathLib: typeof win32 | typeof posix;
		if (formatting?.separator === win32.sep) {
			pathLib = win32;
		} else if (formatting?.separator === posix.sep) {
			pathLib = posix;
		} else {
			pathLib = (this.os === OperatingSystem.Windows) ? win32 : posix;
		}

		return pathLib.basename(label);
	}

	getWorkspaceLabel(workspace: IWorkspace | IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI, options?: { verbose: Verbosity }): string {
		if (isWorkspace(workspace)) {
			const identifier = toWorkspaceIdentifier(workspace);
			if (isSingleFolderWorkspaceIdentifier(identifier) || isWorkspaceIdentifier(identifier)) {
				return this.getWorkspaceLabel(identifier, options);
			}

			return '';
		}

		// Workspace: Single Folder (as URI)
		if (URI.isUri(workspace)) {
			return this.doGetSingleFolderWorkspaceLabel(workspace, options);
		}

		// Workspace: Single Folder (as workspace identifier)
		if (isSingleFolderWorkspaceIdentifier(workspace)) {
			return this.doGetSingleFolderWorkspaceLabel(workspace.uri, options);
		}

		// Workspace: Multi Root
		if (isWorkspaceIdentifier(workspace)) {
			return this.doGetWorkspaceLabel(workspace.configPath, options);
		}

		return '';
	}

	private doGetWorkspaceLabel(workspaceUri: URI, options?: { verbose: Verbosity }): string {

		// Workspace: Untitled
		if (isUntitledWorkspace(workspaceUri, this.environmentService)) {
			return localize('untitledWorkspace', "Untitled (Workspace)");
		}

		// Workspace: Temporary
		if (isTemporaryWorkspace(workspaceUri)) {
			return localize('temporaryWorkspace', "Workspace");
		}

		// Workspace: Saved
		let filename = basename(workspaceUri);
		if (filename.endsWith(WORKSPACE_EXTENSION)) {
			filename = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
		}

		let label: string;
		switch (options?.verbose) {
			case Verbosity.SHORT:
				label = filename; // skip suffix for short label
				break;
			case Verbosity.LONG:
				label = localize('workspaceNameVerbose', "{0} (Workspace)", this.getUriLabel(joinPath(dirname(workspaceUri), filename)));
				break;
			case Verbosity.MEDIUM:
			default:
				label = localize('workspaceName', "{0} (Workspace)", filename);
				break;
		}

		if (options?.verbose === Verbosity.SHORT) {
			return label; // skip suffix for short label
		}

		return this.appendWorkspaceSuffix(label, workspaceUri);
	}

	private doGetSingleFolderWorkspaceLabel(folderUri: URI, options?: { verbose: Verbosity }): string {
		let label: string;
		switch (options?.verbose) {
			case Verbosity.LONG:
				label = this.getUriLabel(folderUri);
				break;
			case Verbosity.SHORT:
			case Verbosity.MEDIUM:
			default:
				label = basename(folderUri) || posix.sep;
				break;
		}

		if (options?.verbose === Verbosity.SHORT) {
			return label; // skip suffix for short label
		}

		return this.appendWorkspaceSuffix(label, folderUri);
	}

	getSeparator(scheme: string, authority?: string): '/' | '\\' {
		const formatter = this.findFormatting(URI.from({ scheme, authority }));

		return formatter?.separator || posix.sep;
	}

	getHostLabel(scheme: string, authority?: string): string {
		const formatter = this.findFormatting(URI.from({ scheme, authority }));

		return formatter?.workspaceSuffix || authority || '';
	}

	getHostTooltip(scheme: string, authority?: string): string | undefined {
		const formatter = this.findFormatting(URI.from({ scheme, authority }));

		return formatter?.workspaceTooltip;
	}

	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		const list = this.storedFormatters.formatters ??= [];

		let replace = list.findIndex(f => f.scheme === formatter.scheme && f.authority === formatter.authority);
		if (replace === -1 && list.length >= FORMATTER_CACHE_SIZE) {
			replace = FORMATTER_CACHE_SIZE - 1; // at max capacity, replace the last element
		}

		if (replace === -1) {
			list.unshift(formatter);
		} else {
			for (let i = replace; i > 0; i--) {
				list[i] = list[i - 1];
			}
			list[0] = formatter;
		}

		this.storedFormattersMemento.saveMemento();

		return this.registerFormatter(formatter);
	}

	registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		this.formatters.push(formatter);
		this._onDidChangeFormatters.fire({ scheme: formatter.scheme });

		return {
			dispose: () => {
				this.formatters = this.formatters.filter(f => f !== formatter);
				this._onDidChangeFormatters.fire({ scheme: formatter.scheme });
			}
		};
	}

	private formatUri(resource: URI, formatting: ResourceLabelFormatting, forceNoTildify?: boolean): string {
		let label = formatting.label.replace(labelMatchingRegexp, (match, token, qsToken, qsValue) => {
			switch (token) {
				case 'scheme': return resource.scheme;
				case 'authority': return resource.authority;
				case 'authoritySuffix': {
					const i = resource.authority.indexOf('+');
					return i === -1 ? resource.authority : resource.authority.slice(i + 1);
				}
				case 'path':
					return formatting.stripPathStartingSeparator
						? resource.path.slice(resource.path[0] === formatting.separator ? 1 : 0)
						: resource.path;
				default: {
					if (qsToken === 'query') {
						const { query } = resource;
						if (query && query[0] === '{' && query[query.length - 1] === '}') {
							try {
								return JSON.parse(query)[qsValue] || '';
							} catch { }
						}
					}

					return '';
				}
			}
		});

		// convert \c:\something => C:\something
		if (formatting.normalizeDriveLetter && hasDriveLetterIgnorePlatform(label)) {
			label = label.charAt(1).toUpperCase() + label.substr(2);
		}

		if (formatting.tildify && !forceNoTildify) {
			if (this.userHome) {
				label = tildify(label, this.userHome.fsPath, this.os);
			}
		}

		if (formatting.authorityPrefix && resource.authority) {
			label = formatting.authorityPrefix + label;
		}

		return this.adjustPathSeparators(label, formatting.separator);
	}

	private adjustPathSeparators(label: string, separator: '/' | '\\' | ''): string {
		return label.replace(this.os === OperatingSystem.Windows ? winPathSeparatorRegexp : posixPathSeparatorRegexp, separator);
	}

	private appendWorkspaceSuffix(label: string, uri: URI): string {
		const formatting = this.findFormatting(uri);
		const suffix = formatting && (typeof formatting.workspaceSuffix === 'string') ? formatting.workspaceSuffix : undefined;

		return suffix ? `${label} [${suffix}]` : label;
	}
}

registerSingleton(ILabelService, LabelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 512
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 512 of 552)

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

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/dvorak.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/dvorak.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Dvorak', localizedName: 'Dvorak', lang: 'en' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['x', 'X', '≈', '˛', 0],
		KeyC: ['j', 'J', '∆', 'Ô', 0],
		KeyD: ['e', 'E', '´', '´', 4],
		KeyE: ['.', '>', '≥', '˘', 0],
		KeyF: ['u', 'U', '¨', '¨', 4],
		KeyG: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyH: ['d', 'D', '∂', 'Î', 0],
		KeyI: ['c', 'C', 'ç', 'Ç', 0],
		KeyJ: ['h', 'H', '˙', 'Ó', 0],
		KeyK: ['t', 'T', '†', 'ˇ', 0],
		KeyL: ['n', 'N', '˜', '˜', 4],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['b', 'B', '∫', 'ı', 0],
		KeyO: ['r', 'R', '®', '‰', 0],
		KeyP: ['l', 'L', '¬', 'Ò', 0],
		KeyQ: ['\'', '"', 'æ', 'Æ', 0],
		KeyR: ['p', 'P', 'π', '∏', 0],
		KeyS: ['o', 'O', 'ø', 'Ø', 0],
		KeyT: ['y', 'Y', '¥', 'Á', 0],
		KeyU: ['g', 'G', '©', '˝', 0],
		KeyV: ['k', 'K', '˚', '', 0],
		KeyW: [',', '<', '≤', '¯', 0],
		KeyX: ['q', 'Q', 'œ', 'Œ', 0],
		KeyY: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyZ: [';', ':', '…', 'Ú', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', '^', '§', 'ﬂ', 0],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['[', '{', '“', '”', 0],
		Equal: [']', '}', '‘', '’', 0],
		BracketLeft: ['/', '?', '÷', '¿', 0],
		BracketRight: ['=', '+', '≠', '±', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: ['s', 'S', 'ß', 'Í', 0],
		Quote: ['-', '_', '–', '—', 0],
		Backquote: ['`', '~', '`', '`', 4],
		Comma: ['w', 'W', '∑', '„', 0],
		Period: ['v', 'V', '√', '◊', 0],
		Slash: ['z', 'Z', 'Ω', '¸', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-belgian.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-belgian.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000813', id: '', text: 'Belgian (Period)' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: [',', '?', '', '', 0, 'VK_OEM_COMMA'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['a', 'A', '', '', 0, 'VK_A'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['w', 'W', '', '', 0, 'VK_W'],
		Digit1: ['&', '1', '|', '', 0, 'VK_1'],
		Digit2: ['é', '2', '@', '', 0, 'VK_2'],
		Digit3: ['"', '3', '#', '', 0, 'VK_3'],
		Digit4: ['\'', '4', '{', '', 0, 'VK_4'],
		Digit5: ['(', '5', '[', '', 0, 'VK_5'],
		Digit6: ['§', '6', '^', '', 0, 'VK_6'],
		Digit7: ['è', '7', '', '', 0, 'VK_7'],
		Digit8: ['!', '8', '', '', 0, 'VK_8'],
		Digit9: ['ç', '9', '{', '', 0, 'VK_9'],
		Digit0: ['à', '0', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: [')', '°', '', '', 0, 'VK_OEM_4'],
		Equal: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		BracketLeft: ['^', '¨', '[', '', 0, 'VK_OEM_6'],
		BracketRight: ['$', '*', ']', '', 0, 'VK_OEM_1'],
		Backslash: ['µ', '£', '`', '`', 0, 'VK_OEM_5'],
		Semicolon: ['m', 'M', '', '', 0, 'VK_M'],
		Quote: ['ù', '%', '´', '´', 0, 'VK_OEM_3'],
		Backquote: ['²', '³', '', '', 0, 'VK_OEM_7'],
		Comma: [';', '.', '', '', 0, 'VK_OEM_PERIOD'],
		Period: [':', '/', '', '', 0, 'VK_OEM_2'],
		Slash: ['=', '+', '~', '~', 0, 'VK_OEM_PLUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '\\', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-ext.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-ext.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.USExtended', lang: 'en', localizedName: 'ABC - Extended' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', '¯', '̄', 4],
		KeyB: ['b', 'B', '˘', '̆', 4],
		KeyC: ['c', 'C', '¸', '̧', 4],
		KeyD: ['d', 'D', 'ð', 'Ð', 0],
		KeyE: ['e', 'E', '´', '́', 4],
		KeyF: ['f', 'F', 'ƒ', '', 0],
		KeyG: ['g', 'G', '©', '‸', 8],
		KeyH: ['h', 'H', 'ˍ', '̱', 4],
		KeyI: ['i', 'I', 'ʼ', '̛', 4],
		KeyJ: ['j', 'J', '˝', '̋', 4],
		KeyK: ['k', 'K', '˚', '̊', 4],
		KeyL: ['l', 'L', '-', '̵', 4],
		KeyM: ['m', 'M', '˛', '̨', 4],
		KeyN: ['n', 'N', '˜', '̃', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', ',', '̦', 4],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', '', 0],
		KeyT: ['t', 'T', 'þ', 'Þ', 0],
		KeyU: ['u', 'U', '¨', '̈', 4],
		KeyV: ['v', 'V', 'ˇ', '̌', 4],
		KeyW: ['w', 'W', '˙', '̇', 4],
		KeyX: ['x', 'X', '.', '̣', 4],
		KeyY: ['y', 'Y', '¥', '', 0],
		KeyZ: ['z', 'Z', 'ˀ', '̉', 4],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '§', '†', 0],
		Digit6: ['6', '^', 'ˆ', '̂', 4],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', '№', 8],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['`', '~', '`', '̀', 4],
		Comma: [',', '<', '≤', '„', 0],
		Period: ['.', '>', '≥', 'ʔ', 8],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-in.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-in.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00004009', id: '', text: 'India' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'ā', 'Ā', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', 'ḍ', 'Ḍ', 0, 'VK_D'],
		KeyE: ['e', 'E', 'ē', 'Ē', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', 'ṅ', 'Ṅ', 0, 'VK_G'],
		KeyH: ['h', 'H', 'ḥ', 'Ḥ', 0, 'VK_H'],
		KeyI: ['i', 'I', 'ī', 'Ī', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', 'l̥', 'L̥', 0, 'VK_L'],
		KeyM: ['m', 'M', 'ṁ', 'Ṁ', 0, 'VK_M'],
		KeyN: ['n', 'N', 'ṇ', 'Ṇ', 0, 'VK_N'],
		KeyO: ['o', 'O', 'ō', 'Ō', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', 'æ', 'Æ', 0, 'VK_Q'],
		KeyR: ['r', 'R', 'r̥', 'R̥', 0, 'VK_R'],
		KeyS: ['s', 'S', 'ś', 'Ś', 0, 'VK_S'],
		KeyT: ['t', 'T', 'ṭ', 'Ṭ', 0, 'VK_T'],
		KeyU: ['u', 'U', 'ū', 'Ū', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', 'ṣ', 'Ṣ', 0, 'VK_X'],
		KeyY: ['y', 'Y', 'ñ', 'Ñ', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '@', '', '', 0, 'VK_2'],
		Digit3: ['3', '#', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '₹', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '^', '', 'ˆ', 0, 'VK_6'],
		Digit7: ['7', '&', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '˘', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '-', 'ˍ', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['[', '{', '', '', 0, 'VK_OEM_4'],
		BracketRight: [']', '}', '', '', 0, 'VK_OEM_6'],
		Backslash: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		Semicolon: [';', ':', '', '', 0, 'VK_OEM_1'],
		Quote: ['\'', '"', '', '', 0, 'VK_OEM_7'],
		Backquote: ['`', '~', '', '~', 0, 'VK_OEM_3'],
		Comma: [',', '<', ',', '<', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '.', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['/', '?', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-intl.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-intl.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.USInternational-PC', lang: 'en', localizedName: 'U.S. International - PC' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '´', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', '˝', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['n', 'N', '˜', '˜', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'ˇ', 0],
		KeyU: ['u', 'U', '¨', '¨', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', '˛', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', '¸', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', 'ˆ', '§', 'ﬂ', 2],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 3],
		Backquote: ['`', '˜', '`', '`', 7],
		Comma: [',', '<', '≤', '¯', 0],
		Period: ['.', '>', '≥', '˘', 0],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-intl.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-intl.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00020409', id: '0001', text: 'United States-International' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'á', 'Á', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '©', '¢', 0, 'VK_C'],
		KeyD: ['d', 'D', 'ð', 'Ð', 0, 'VK_D'],
		KeyE: ['e', 'E', 'é', 'É', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', 'í', 'Í', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', 'ø', 'Ø', 0, 'VK_L'],
		KeyM: ['m', 'M', 'µ', '', 0, 'VK_M'],
		KeyN: ['n', 'N', 'ñ', 'Ñ', 0, 'VK_N'],
		KeyO: ['o', 'O', 'ó', 'Ó', 0, 'VK_O'],
		KeyP: ['p', 'P', 'ö', 'Ö', 0, 'VK_P'],
		KeyQ: ['q', 'Q', 'ä', 'Ä', 0, 'VK_Q'],
		KeyR: ['r', 'R', '®', '', 0, 'VK_R'],
		KeyS: ['s', 'S', 'ß', '§', 0, 'VK_S'],
		KeyT: ['t', 'T', 'þ', 'Þ', 0, 'VK_T'],
		KeyU: ['u', 'U', 'ú', 'Ú', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', 'å', 'Å', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', 'ü', 'Ü', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', 'æ', 'Æ', 0, 'VK_Z'],
		Digit1: ['1', '!', '¡', '¹', 0, 'VK_1'],
		Digit2: ['2', '@', '²', '', 0, 'VK_2'],
		Digit3: ['3', '#', '³', '', 0, 'VK_3'],
		Digit4: ['4', '$', '¤', '£', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '^', '¼', '', 0, 'VK_6'],
		Digit7: ['7', '&', '½', '', 0, 'VK_7'],
		Digit8: ['8', '*', '¾', '', 0, 'VK_8'],
		Digit9: ['9', '(', '‘', '', 0, 'VK_9'],
		Digit0: ['0', ')', '’', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '¥', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '×', '÷', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['[', '{', '«', '', 0, 'VK_OEM_4'],
		BracketRight: [']', '}', '»', '', 0, 'VK_OEM_6'],
		Backslash: ['\\', '|', '¬', '¦', 0, 'VK_OEM_5'],
		Semicolon: [';', ':', '¶', '°', 0, 'VK_OEM_1'],
		Quote: ['\'', '"', '´', '¨', 0, 'VK_OEM_7'],
		Backquote: ['`', '~', '', '', 0, 'VK_OEM_3'],
		Comma: [',', '<', 'ç', 'Ç', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['/', '?', '¿', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-uk.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-uk.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.British', lang: 'en', localizedName: 'British' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '‰', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', 'Ì', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', '^', 'È', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', '˜', 0],
		KeyN: ['n', 'N', '~', 'ˆ', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', 'Â', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'Ê', 0],
		KeyU: ['u', 'U', '¨', 'Ë', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', 'Ù', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', 'Û', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '€', '™', 0],
		Digit3: ['3', '£', '#', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', '^', '§', 'ﬂ', 0],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['`', '~', '`', 'Ÿ', 4],
		Comma: [',', '<', '≤', '¯', 0],
		Period: ['.', '>', '≥', '˘', 0],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '', '', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-uk.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en-uk.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000809', id: '', text: 'United Kingdom' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'á', 'Á', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', 'é', 'É', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', 'í', 'Í', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', 'ó', 'Ó', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', 'ú', 'Ú', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '', '', 0, 'VK_2'],
		Digit3: ['3', '£', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '€', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '^', '', '', 0, 'VK_6'],
		Digit7: ['7', '&', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['[', '{', '', '', 0, 'VK_OEM_4'],
		BracketRight: [']', '}', '', '', 0, 'VK_OEM_6'],
		Backslash: ['#', '~', '\\', '|', 0, 'VK_OEM_7'],
		Semicolon: [';', ':', '', '', 0, 'VK_OEM_1'],
		Quote: ['\'', '@', '', '', 0, 'VK_OEM_3'],
		Backquote: ['`', '¬', '¦', '', 0, 'VK_OEM_8'],
		Comma: [',', '<', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['/', '?', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.US', lang: 'en', localizedName: 'U.S.', isUSStandard: true },
	secondaryLayouts: [
		{ id: 'com.apple.keylayout.ABC', lang: 'en', localizedName: 'ABC' },
		{ id: 'com.sogou.inputmethod.sogou.pinyin', lang: 'zh-Hans', localizedName: 'Pinyin - Simplified' },
		{ id: 'com.apple.inputmethod.Kotoeri.Roman', lang: 'en', localizedName: 'Romaji' },
		{ id: 'com.apple.inputmethod.Kotoeri.Japanese', lang: 'ja', localizedName: 'Hiragana' },
		{ id: 'com.apple.keylayout.Australian', lang: 'en', localizedName: 'Australian' },
		{ id: 'com.apple.keylayout.Canadian', lang: 'en', localizedName: 'Canadian English' },
		{ id: 'com.apple.keylayout.Brazilian', lang: 'pt', localizedName: 'Brazilian' },
	],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '´', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', '˝', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['n', 'N', '˜', '˜', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'ˇ', 0],
		KeyU: ['u', 'U', '¨', '¨', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', '˛', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', '¸', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', '^', '§', 'ﬂ', 0],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['`', '~', '`', '`', 4],
		Comma: [',', '<', '≤', '¯', 0],
		Period: ['.', '>', '≥', '˘', 0],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { model: 'pc105', group: 0, layout: 'us', variant: '', options: '', rules: 'evdev', isUSStandard: true },
	secondaryLayouts: [
		{ model: 'pc105', group: 0, layout: 'cn', variant: '', options: '', rules: 'evdev' },
	],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'a', 'A', 0],
		KeyB: ['b', 'B', 'b', 'B', 0],
		KeyC: ['c', 'C', 'c', 'C', 0],
		KeyD: ['d', 'D', 'd', 'D', 0],
		KeyE: ['e', 'E', 'e', 'E', 0],
		KeyF: ['f', 'F', 'f', 'F', 0],
		KeyG: ['g', 'G', 'g', 'G', 0],
		KeyH: ['h', 'H', 'h', 'H', 0],
		KeyI: ['i', 'I', 'i', 'I', 0],
		KeyJ: ['j', 'J', 'j', 'J', 0],
		KeyK: ['k', 'K', 'k', 'K', 0],
		KeyL: ['l', 'L', 'l', 'L', 0],
		KeyM: ['m', 'M', 'm', 'M', 0],
		KeyN: ['n', 'N', 'n', 'N', 0],
		KeyO: ['o', 'O', 'o', 'O', 0],
		KeyP: ['p', 'P', 'p', 'P', 0],
		KeyQ: ['q', 'Q', 'q', 'Q', 0],
		KeyR: ['r', 'R', 'r', 'R', 0],
		KeyS: ['s', 'S', 's', 'S', 0],
		KeyT: ['t', 'T', 't', 'T', 0],
		KeyU: ['u', 'U', 'u', 'U', 0],
		KeyV: ['v', 'V', 'v', 'V', 0],
		KeyW: ['w', 'W', 'w', 'W', 0],
		KeyX: ['x', 'X', 'x', 'X', 0],
		KeyY: ['y', 'Y', 'y', 'Y', 0],
		KeyZ: ['z', 'Z', 'z', 'Z', 0],
		Digit1: ['1', '!', '1', '!', 0],
		Digit2: ['2', '@', '2', '@', 0],
		Digit3: ['3', '#', '3', '#', 0],
		Digit4: ['4', '$', '4', '$', 0],
		Digit5: ['5', '%', '5', '%', 0],
		Digit6: ['6', '^', '6', '^', 0],
		Digit7: ['7', '&', '7', '&', 0],
		Digit8: ['8', '*', '8', '*', 0],
		Digit9: ['9', '(', '9', '(', 0],
		Digit0: ['0', ')', '0', ')', 0],
		Enter: ['\r', '\r', '\r', '\r', 0],
		Escape: ['\u001b', '\u001b', '\u001b', '\u001b', 0],
		Backspace: ['\b', '\b', '\b', '\b', 0],
		Tab: ['\t', '', '\t', '', 0],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '-', '_', 0],
		Equal: ['=', '+', '=', '+', 0],
		BracketLeft: ['[', '{', '[', '{', 0],
		BracketRight: [']', '}', ']', '}', 0],
		Backslash: ['\\', '|', '\\', '|', 0],
		Semicolon: [';', ':', ';', ':', 0],
		Quote: ['\'', '"', '\'', '"', 0],
		Backquote: ['`', '~', '`', '~', 0],
		Comma: [',', '<', ',', '<', 0],
		Period: ['.', '>', '.', '>', 0],
		Slash: ['/', '?', '/', '?', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: ['', '', '', '', 0],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: ['\r', '\r', '\r', '\r', 0],
		Numpad1: ['', '1', '', '1', 0],
		Numpad2: ['', '2', '', '2', 0],
		Numpad3: ['', '3', '', '3', 0],
		Numpad4: ['', '4', '', '4', 0],
		Numpad5: ['', '5', '', '5', 0],
		Numpad6: ['', '6', '', '6', 0],
		Numpad7: ['', '7', '', '7', 0],
		Numpad8: ['', '8', '', '8', 0],
		Numpad9: ['', '9', '', '9', 0],
		Numpad0: ['', '0', '', '0', 0],
		NumpadDecimal: ['', '.', '', '.', 0],
		IntlBackslash: ['<', '>', '|', '¦', 0],
		ContextMenu: [],
		Power: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Open: [],
		Help: [],
		Select: [],
		Again: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		Find: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: ['.', '.', '.', '.', 0],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		Lang5: [],
		NumpadParenLeft: ['(', '(', '(', '(', 0],
		NumpadParenRight: [')', ')', ')', ')', 0],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		BrightnessUp: [],
		BrightnessDown: [],
		MediaPlay: [],
		MediaRecord: [],
		MediaFastForward: [],
		MediaRewind: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		SelectTask: [],
		LaunchScreenSaver: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: [],
		MailReply: [],
		MailForward: [],
		MailSend: []
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/en.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000409', id: '', text: 'US', isUSStandard: true },
	secondaryLayouts: [
		{ name: '00000804', id: '', text: 'Chinese (Simplified) - US Keyboard' },
		{ name: '00000411', id: '', text: 'Japanese' },
		{ name: '00000412', id: '', text: 'Korean' },
		{ name: '00000404', id: '', text: 'Chinese (Traditional) - US Keyboard' }
	],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '@', '', '', 0, 'VK_2'],
		Digit3: ['3', '#', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '^', '', '', 0, 'VK_6'],
		Digit7: ['7', '&', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['[', '{', '', '', 0, 'VK_OEM_4'],
		BracketRight: [']', '}', '', '', 0, 'VK_OEM_6'],
		Backslash: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		Semicolon: [';', ':', '', '', 0, 'VK_OEM_1'],
		Quote: ['\'', '"', '', '', 0, 'VK_OEM_7'],
		Backquote: ['`', '~', '', '', 0, 'VK_OEM_3'],
		Comma: [',', '<', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['/', '?', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/es-latin.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/es-latin.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000080A', id: '', text: 'Latin American' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '@', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '', '', 0, 'VK_2'],
		Digit3: ['3', '#', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '', '', 0, 'VK_7'],
		Digit8: ['8', '(', '', '', 0, 'VK_8'],
		Digit9: ['9', ')', '', '', 0, 'VK_9'],
		Digit0: ['0', '=', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['\'', '?', '\\', '', 0, 'VK_OEM_4'],
		Equal: ['¿', '¡', '', '', 0, 'VK_OEM_6'],
		BracketLeft: ['´', '¨', '', '', 0, 'VK_OEM_1'],
		BracketRight: ['+', '*', '~', '', 0, 'VK_OEM_PLUS'],
		Backslash: ['}', ']', '`', '', 0, 'VK_OEM_2'],
		Semicolon: ['ñ', 'Ñ', '', '', 0, 'VK_OEM_3'],
		Quote: ['{', '[', '^', '', 0, 'VK_OEM_7'],
		Backquote: ['|', '°', '¬', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Spanish-ISO', lang: 'es', localizedName: 'Spanish - ISO' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', 'ß', '', 0],
		KeyC: ['c', 'C', '©', ' ', 0],
		KeyD: ['d', 'D', '∂', '∆', 0],
		KeyE: ['e', 'E', '€', '€', 0],
		KeyF: ['f', 'F', 'ƒ', 'ﬁ', 0],
		KeyG: ['g', 'G', '', 'ﬂ', 0],
		KeyH: ['h', 'H', '™', ' ', 0],
		KeyI: ['i', 'I', ' ', ' ', 0],
		KeyJ: ['j', 'J', '¶', '¯', 0],
		KeyK: ['k', 'K', '§', 'ˇ', 0],
		KeyL: ['l', 'L', ' ', '˘', 0],
		KeyM: ['m', 'M', 'µ', '˚', 0],
		KeyN: ['n', 'N', ' ', '˙', 0],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', ' ', 0],
		KeyS: ['s', 'S', '∫', ' ', 0],
		KeyT: ['t', 'T', '†', '‡', 0],
		KeyU: ['u', 'U', ' ', ' ', 0],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', 'æ', 'Æ', 0],
		KeyX: ['x', 'X', '∑', '›', 0],
		KeyY: ['y', 'Y', '¥', ' ', 0],
		KeyZ: ['z', 'Z', 'Ω', '‹', 0],
		Digit1: ['1', '!', '|', 'ı', 0],
		Digit2: ['2', '"', '@', '˝', 0],
		Digit3: ['3', '·', '#', '•', 0],
		Digit4: ['4', '$', '¢', '£', 0],
		Digit5: ['5', '%', '∞', '‰', 0],
		Digit6: ['6', '&', '¬', ' ', 0],
		Digit7: ['7', '/', '÷', '⁄', 0],
		Digit8: ['8', '(', '“', '‘', 0],
		Digit9: ['9', ')', '”', '’', 0],
		Digit0: ['0', '=', '≠', '≈', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['\'', '?', '´', '¸', 0],
		Equal: ['¡', '¿', '‚', '˛', 0],
		BracketLeft: ['`', '^', '[', 'ˆ', 3],
		BracketRight: ['+', '*', ']', '±', 0],
		Backslash: ['ç', 'Ç', '}', '»', 0],
		Semicolon: ['ñ', 'Ñ', '~', '˜', 4],
		Quote: ['´', '¨', '{', '«', 3],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [',', ';', '„', '', 0],
		Period: ['.', ':', '…', '…', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', ',', ',', ',', 0],
		IntlBackslash: ['º', 'ª', '\\', '°', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { model: 'pc105', group: 0, layout: 'es', variant: '', options: '', rules: 'evdev' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'æ', 'Æ', 0],
		KeyB: ['b', 'B', '”', '’', 0],
		KeyC: ['c', 'C', '¢', '©', 0],
		KeyD: ['d', 'D', 'ð', 'Ð', 0],
		KeyE: ['e', 'E', '€', '¢', 0],
		KeyF: ['f', 'F', 'đ', 'ª', 0],
		KeyG: ['g', 'G', 'ŋ', 'Ŋ', 0],
		KeyH: ['h', 'H', 'ħ', 'Ħ', 0],
		KeyI: ['i', 'I', '→', 'ı', 0],
		KeyJ: ['j', 'J', '̉', '̛', 0],
		KeyK: ['k', 'K', 'ĸ', '&', 0],
		KeyL: ['l', 'L', 'ł', 'Ł', 0],
		KeyM: ['m', 'M', 'µ', 'º', 0],
		KeyN: ['n', 'N', 'n', 'N', 0],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'þ', 'Þ', 0],
		KeyQ: ['q', 'Q', '@', 'Ω', 0],
		KeyR: ['r', 'R', '¶', '®', 0],
		KeyS: ['s', 'S', 'ß', '§', 0],
		KeyT: ['t', 'T', 'ŧ', 'Ŧ', 0],
		KeyU: ['u', 'U', '↓', '↑', 0],
		KeyV: ['v', 'V', '“', '‘', 0],
		KeyW: ['w', 'W', 'ł', 'Ł', 0],
		KeyX: ['x', 'X', '»', '>', 0],
		KeyY: ['y', 'Y', '←', '¥', 0],
		KeyZ: ['z', 'Z', '«', '<', 0],
		Digit1: ['1', '!', '|', '¡', 0],
		Digit2: ['2', '"', '@', '⅛', 0],
		Digit3: ['3', '·', '#', '£', 0],
		Digit4: ['4', '$', '~', '$', 0],
		Digit5: ['5', '%', '½', '⅜', 0],
		Digit6: ['6', '&', '¬', '⅝', 0],
		Digit7: ['7', '/', '{', '⅞', 0],
		Digit8: ['8', '(', '[', '™', 0],
		Digit9: ['9', ')', ']', '±', 0],
		Digit0: ['0', '=', '}', '°', 0],
		Enter: ['\r', '\r', '\r', '\r', 0],
		Escape: ['\u001b', '\u001b', '\u001b', '\u001b', 0],
		Backspace: ['\b', '\b', '\b', '\b', 0],
		Tab: ['\t', '', '\t', '', 0],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['\'', '?', '\\', '¿', 0],
		Equal: ['¡', '¿', '̃', '~', 0],
		BracketLeft: ['̀', '̂', '[', '̊', 0],
		BracketRight: ['+', '*', ']', '̄', 0],
		Backslash: ['ç', 'Ç', '}', '̆', 0],
		Semicolon: ['ñ', 'Ñ', '~', '̋', 0],
		Quote: ['́', '̈', '{', '{', 0],
		Backquote: ['º', 'ª', '\\', '\\', 0],
		Comma: [',', ';', '─', '×', 0],
		Period: ['.', ':', '·', '÷', 0],
		Slash: ['-', '_', '̣', '̇', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: ['', '', '', '', 0],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: ['\r', '\r', '\r', '\r', 0],
		Numpad1: ['', '1', '', '1', 0],
		Numpad2: ['', '2', '', '2', 0],
		Numpad3: ['', '3', '', '3', 0],
		Numpad4: ['', '4', '', '4', 0],
		Numpad5: ['', '5', '', '5', 0],
		Numpad6: ['', '6', '', '6', 0],
		Numpad7: ['', '7', '', '7', 0],
		Numpad8: ['', '8', '', '8', 0],
		Numpad9: ['', '9', '', '9', 0],
		Numpad0: ['', '0', '', '0', 0],
		NumpadDecimal: ['', '.', '', '.', 0],
		IntlBackslash: ['<', '>', '|', '¦', 0],
		ContextMenu: [],
		Power: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Open: [],
		Help: [],
		Select: [],
		Again: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		Find: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: ['.', '.', '.', '.', 0],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		Lang5: [],
		NumpadParenLeft: ['(', '(', '(', '(', 0],
		NumpadParenRight: [')', ')', ')', ')', 0],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		BrightnessUp: [],
		BrightnessDown: [],
		MediaPlay: [],
		MediaRecord: [],
		MediaFastForward: [],
		MediaRewind: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		SelectTask: [],
		LaunchScreenSaver: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: [],
		MailReply: [],
		MailForward: [],
		MailSend: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/es.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000040A', id: '', text: 'Spanish' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '|', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '·', '#', '', 0, 'VK_3'],
		Digit4: ['4', '$', '~', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '¬', '', 0, 'VK_6'],
		Digit7: ['7', '/', '', '', 0, 'VK_7'],
		Digit8: ['8', '(', '', '', 0, 'VK_8'],
		Digit9: ['9', ')', '', '', 0, 'VK_9'],
		Digit0: ['0', '=', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['\'', '?', '', '', 0, 'VK_OEM_4'],
		Equal: ['¡', '¿', '', '', 0, 'VK_OEM_6'],
		BracketLeft: ['`', '^', '[', '', 0, 'VK_OEM_1'],
		BracketRight: ['+', '*', ']', '', 0, 'VK_OEM_PLUS'],
		Backslash: ['ç', 'Ç', '}', '', 0, 'VK_OEM_2'],
		Semicolon: ['ñ', 'Ñ', '', '', 0, 'VK_OEM_3'],
		Quote: ['´', '¨', '{', '', 0, 'VK_OEM_7'],
		Backquote: ['º', 'ª', '\\', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.French', lang: 'fr', localizedName: 'French' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['q', 'Q', '‡', 'Ω', 0],
		KeyB: ['b', 'B', 'ß', '∫', 0],
		KeyC: ['c', 'C', '©', '¢', 0],
		KeyD: ['d', 'D', '∂', '∆', 0],
		KeyE: ['e', 'E', 'ê', 'Ê', 0],
		KeyF: ['f', 'F', 'ƒ', '·', 0],
		KeyG: ['g', 'G', 'ﬁ', 'ﬂ', 0],
		KeyH: ['h', 'H', 'Ì', 'Î', 0],
		KeyI: ['i', 'I', 'î', 'ï', 0],
		KeyJ: ['j', 'J', 'Ï', 'Í', 0],
		KeyK: ['k', 'K', 'È', 'Ë', 0],
		KeyL: ['l', 'L', '¬', '|', 0],
		KeyM: [',', '?', '∞', '¿', 0],
		KeyN: ['n', 'N', '~', 'ı', 4],
		KeyO: ['o', 'O', 'œ', 'Œ', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['a', 'A', 'æ', 'Æ', 0],
		KeyR: ['r', 'R', '®', '‚', 0],
		KeyS: ['s', 'S', 'Ò', '∑', 0],
		KeyT: ['t', 'T', '†', '™', 0],
		KeyU: ['u', 'U', 'º', 'ª', 0],
		KeyV: ['v', 'V', '◊', '√', 0],
		KeyW: ['z', 'Z', 'Â', 'Å', 0],
		KeyX: ['x', 'X', '≈', '⁄', 0],
		KeyY: ['y', 'Y', 'Ú', 'Ÿ', 0],
		KeyZ: ['w', 'W', '‹', '›', 0],
		Digit1: ['&', '1', '', '´', 8],
		Digit2: ['é', '2', 'ë', '„', 0],
		Digit3: ['"', '3', '“', '”', 0],
		Digit4: ['\'', '4', '‘', '’', 0],
		Digit5: ['(', '5', '{', '[', 0],
		Digit6: ['§', '6', '¶', 'å', 0],
		Digit7: ['è', '7', '«', '»', 0],
		Digit8: ['!', '8', '¡', 'Û', 0],
		Digit9: ['ç', '9', 'Ç', 'Á', 0],
		Digit0: ['à', '0', 'ø', 'Ø', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: [')', '°', '}', ']', 0],
		Equal: ['-', '_', '—', '–', 0],
		BracketLeft: ['^', '¨', 'ô', 'Ô', 3],
		BracketRight: ['$', '*', '€', '¥', 0],
		Backslash: ['`', '£', '@', '#', 1],
		Semicolon: ['m', 'M', 'µ', 'Ó', 0],
		Quote: ['ù', '%', 'Ù', '‰', 0],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [';', '.', '…', '•', 0],
		Period: [':', '/', '÷', '\\', 0],
		Slash: ['=', '+', '≠', '±', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', '.', ',', '.', 0],
		IntlBackslash: ['@', '#', '•', 'Ÿ', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { model: 'pc104', group: 0, layout: 'fr', variant: '', options: '', rules: 'base' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['q', 'Q', '@', 'Ω', 0],
		KeyB: ['b', 'B', '”', '’', 0],
		KeyC: ['c', 'C', '¢', '©', 0],
		KeyD: ['d', 'D', 'ð', 'Ð', 0],
		KeyE: ['e', 'E', '€', '¢', 0],
		KeyF: ['f', 'F', 'đ', 'ª', 0],
		KeyG: ['g', 'G', 'ŋ', 'Ŋ', 0],
		KeyH: ['h', 'H', 'ħ', 'Ħ', 0],
		KeyI: ['i', 'I', '→', 'ı', 0],
		KeyJ: ['j', 'J', '̉', '̛', 0],
		KeyK: ['k', 'K', 'ĸ', '&', 0],
		KeyL: ['l', 'L', 'ł', 'Ł', 0],
		KeyM: [',', '?', '́', '̋', 0],
		KeyN: ['n', 'N', 'n', 'N', 0],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'þ', 'Þ', 0],
		KeyQ: ['a', 'A', 'æ', 'Æ', 0],
		KeyR: ['r', 'R', '¶', '®', 0],
		KeyS: ['s', 'S', 'ß', '§', 0],
		KeyT: ['t', 'T', 'ŧ', 'Ŧ', 0],
		KeyU: ['u', 'U', '↓', '↑', 0],
		KeyV: ['v', 'V', '“', '‘', 0],
		KeyW: ['z', 'Z', '«', '<', 0],
		KeyX: ['x', 'X', '»', '>', 0],
		KeyY: ['y', 'Y', '←', '¥', 0],
		KeyZ: ['w', 'W', 'ł', 'Ł', 0],
		Digit1: ['&', '1', '¹', '¡', 0],
		Digit2: ['é', '2', '~', '⅛', 0],
		Digit3: ['"', '3', '#', '£', 0],
		Digit4: ['\'', '4', '{', '$', 0],
		Digit5: ['(', '5', '[', '⅜', 0],
		Digit6: ['-', '6', '|', '⅝', 0],
		Digit7: ['è', '7', '`', '⅞', 0],
		Digit8: ['_', '8', '\\', '™', 0],
		Digit9: ['ç', '9', '^', '±', 0],
		Digit0: ['à', '0', '@', '°', 0],
		Enter: ['\r', '\r', '\r', '\r', 0],
		Escape: ['\u001b', '\u001b', '\u001b', '\u001b', 0],
		Backspace: ['\b', '\b', '\b', '\b', 0],
		Tab: ['\t', '', '\t', '', 0],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: [')', '°', ']', '¿', 0],
		Equal: ['=', '+', '}', '̨', 0],
		BracketLeft: ['̂', '̈', '̈', '̊', 0],
		BracketRight: ['$', '£', '¤', '̄', 0],
		Backslash: ['*', 'µ', '̀', '̆', 0],
		Semicolon: ['m', 'M', 'µ', 'º', 0],
		Quote: ['ù', '%', '̂', '̌', 0],
		Backquote: ['²', '~', '¬', '¬', 0],
		Comma: [';', '.', '─', '×', 0],
		Period: [':', '/', '·', '÷', 0],
		Slash: ['!', '§', '̣', '̇', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: ['', '', '', '', 0],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: ['/', '/', '/', '/', 0],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: [],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['', '1', '', '1', 0],
		Numpad2: ['', '2', '', '2', 0],
		Numpad3: ['', '3', '', '3', 0],
		Numpad4: ['', '4', '', '4', 0],
		Numpad5: ['', '5', '', '5', 0],
		Numpad6: ['', '6', '', '6', 0],
		Numpad7: ['', '7', '', '7', 0],
		Numpad8: ['', '8', '', '8', 0],
		Numpad9: ['', '9', '', '9', 0],
		Numpad0: ['', '0', '', '0', 0],
		NumpadDecimal: ['', '.', '', '.', 0],
		IntlBackslash: ['<', '>', '|', '¦', 0],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Open: [],
		Help: [],
		Select: [],
		Again: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		Find: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		Lang5: [],
		NumpadParenLeft: [],
		NumpadParenRight: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: ['\r', '\r', '\r', '\r', 0],
		MetaRight: ['.', '.', '.', '.', 0],
		BrightnessUp: [],
		BrightnessDown: [],
		MediaPlay: [],
		MediaRecord: [],
		MediaFastForward: [],
		MediaRewind: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		SelectTask: [],
		LaunchScreenSaver: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: [],
		MailReply: [],
		MailForward: [],
		MailSend: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/fr.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000040C', id: '', text: 'French' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: [',', '?', '', '', 0, 'VK_OEM_COMMA'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['a', 'A', '', '', 0, 'VK_A'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['w', 'W', '', '', 0, 'VK_W'],
		Digit1: ['&', '1', '', '', 0, 'VK_1'],
		Digit2: ['é', '2', '~', '', 0, 'VK_2'],
		Digit3: ['"', '3', '#', '', 0, 'VK_3'],
		Digit4: ['\'', '4', '{', '', 0, 'VK_4'],
		Digit5: ['(', '5', '[', '', 0, 'VK_5'],
		Digit6: ['-', '6', '|', '', 0, 'VK_6'],
		Digit7: ['è', '7', '`', '', 0, 'VK_7'],
		Digit8: ['_', '8', '\\', '', 0, 'VK_8'],
		Digit9: ['ç', '9', '^', '', 0, 'VK_9'],
		Digit0: ['à', '0', '@', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: [')', '°', ']', '', 0, 'VK_OEM_4'],
		Equal: ['=', '+', '}', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['^', '¨', '', '', 0, 'VK_OEM_6'],
		BracketRight: ['$', '£', '¤', '', 0, 'VK_OEM_1'],
		Backslash: ['*', 'µ', '', '', 0, 'VK_OEM_5'],
		Semicolon: ['m', 'M', '', '', 0, 'VK_M'],
		Quote: ['ù', '%', '', '', 0, 'VK_OEM_3'],
		Backquote: ['²', '', '', '', 0, 'VK_OEM_7'],
		Comma: [';', '.', '', '', 0, 'VK_OEM_PERIOD'],
		Period: [':', '/', '', '', 0, 'VK_OEM_2'],
		Slash: ['!', '§', '', '', 0, 'VK_OEM_8'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/hu.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/hu.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000040E', id: '', text: 'Hungarian' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'ä', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '{', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '&', '', 0, 'VK_C'],
		KeyD: ['d', 'D', 'Đ', '', 0, 'VK_D'],
		KeyE: ['e', 'E', 'Ä', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '[', '', 0, 'VK_F'],
		KeyG: ['g', 'G', ']', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', 'Í', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', 'í', '', 0, 'VK_J'],
		KeyK: ['k', 'K', 'ł', '', 0, 'VK_K'],
		KeyL: ['l', 'L', 'Ł', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '<', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '}', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '\\', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', 'đ', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '€', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '@', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '|', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '#', '', 0, 'VK_X'],
		KeyY: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyZ: ['y', 'Y', '>', '', 0, 'VK_Y'],
		Digit1: ['1', '\'', '~', '', 0, 'VK_1'],
		Digit2: ['2', '"', 'ˇ', '', 0, 'VK_2'],
		Digit3: ['3', '+', '^', '', 0, 'VK_3'],
		Digit4: ['4', '!', '˘', '', 0, 'VK_4'],
		Digit5: ['5', '%', '°', '', 0, 'VK_5'],
		Digit6: ['6', '/', '˛', '', 0, 'VK_6'],
		Digit7: ['7', '=', '`', '', 0, 'VK_7'],
		Digit8: ['8', '(', '˙', '', 0, 'VK_8'],
		Digit9: ['9', ')', '´', '', 0, 'VK_9'],
		Digit0: ['ö', 'Ö', '˝', '', 0, 'VK_OEM_3'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['ü', 'Ü', '¨', '', 0, 'VK_OEM_2'],
		Equal: ['ó', 'Ó', '¸', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['ő', 'Ő', '÷', '', 0, 'VK_OEM_4'],
		BracketRight: ['ú', 'Ú', '×', '', 0, 'VK_OEM_6'],
		Backslash: ['ű', 'Ű', '¤', '', 0, 'VK_OEM_5'],
		Semicolon: ['é', 'É', '$', '', 0, 'VK_OEM_1'],
		Quote: ['á', 'Á', 'ß', '', 0, 'VK_OEM_7'],
		Backquote: ['0', '§', '', '', 0, 'VK_0'],
		Comma: [',', '?', ';', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '>', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '*', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['í', 'Í', '<', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/it.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/it.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Italian-Pro', lang: 'it', localizedName: 'Italian' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'Í', 0],
		KeyC: ['c', 'C', '©', 'Á', 0],
		KeyD: ['d', 'D', '∂', '˘', 0],
		KeyE: ['e', 'E', '€', 'È', 0],
		KeyF: ['f', 'F', 'ƒ', '˙', 0],
		KeyG: ['g', 'G', '∞', '˚', 0],
		KeyH: ['h', 'H', '∆', '¸', 0],
		KeyI: ['i', 'I', 'œ', 'Œ', 0],
		KeyJ: ['j', 'J', 'ª', '˝', 0],
		KeyK: ['k', 'K', 'º', '˛', 0],
		KeyL: ['l', 'L', '¬', 'ˇ', 0],
		KeyM: ['m', 'M', 'µ', 'Ú', 0],
		KeyN: ['n', 'N', '˜', 'Ó', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', '„', '‚', 0],
		KeyR: ['r', 'R', '®', 'Ì', 0],
		KeyS: ['s', 'S', 'ß', '¯', 0],
		KeyT: ['t', 'T', '™', 'Ò', 0],
		KeyU: ['u', 'U', '¨', 'Ù', 4],
		KeyV: ['v', 'V', '√', 'É', 0],
		KeyW: ['w', 'W', 'Ω', 'À', 0],
		KeyX: ['x', 'X', '†', '‡', 0],
		KeyY: ['y', 'Y', 'æ', 'Æ', 0],
		KeyZ: ['z', 'Z', '∑', ' ', 0],
		Digit1: ['1', '!', '«', '»', 0],
		Digit2: ['2', '"', '“', '”', 0],
		Digit3: ['3', '£', '‘', '’', 0],
		Digit4: ['4', '$', '¥', '¢', 0],
		Digit5: ['5', '%', '~', '‰', 0],
		Digit6: ['6', '&', '‹', '›', 0],
		Digit7: ['7', '/', '÷', '⁄', 0],
		Digit8: ['8', '(', '´', '', 4],
		Digit9: ['9', ')', '`', ' ', 4],
		Digit0: ['0', '=', '≠', '≈', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['\'', '?', '¡', '¿', 0],
		Equal: ['ì', '^', 'ˆ', '±', 4],
		BracketLeft: ['è', 'é', '[', '{', 0],
		BracketRight: ['+', '*', ']', '}', 0],
		Backslash: ['ù', '§', '¶', '◊', 0],
		Semicolon: ['ò', 'ç', '@', 'Ç', 0],
		Quote: ['à', '°', '#', '∞', 0],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [',', ';', '…', ' ', 0],
		Period: ['.', ':', '•', '·', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', '.', ',', '.', 0],
		IntlBackslash: ['\\', '|', '`', 'ı', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/it.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/it.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000410', id: '', text: 'Italian' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '', '', 0, 'VK_2'],
		Digit3: ['3', '£', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '', '', 0, 'VK_7'],
		Digit8: ['8', '(', '', '', 0, 'VK_8'],
		Digit9: ['9', ')', '', '', 0, 'VK_9'],
		Digit0: ['0', '=', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['\'', '?', '', '', 0, 'VK_OEM_4'],
		Equal: ['ì', '^', '', '', 0, 'VK_OEM_6'],
		BracketLeft: ['è', 'é', '[', '{', 0, 'VK_OEM_1'],
		BracketRight: ['+', '*', ']', '}', 0, 'VK_OEM_PLUS'],
		Backslash: ['ù', '§', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['ò', 'ç', '@', '', 0, 'VK_OEM_3'],
		Quote: ['à', '°', '#', '', 0, 'VK_OEM_7'],
		Backquote: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/jp-roman.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/jp-roman.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.google.inputmethod.Japanese.Roman', lang: 'en', localizedName: 'Alphanumeric (Google)' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', '¯', '̄', 4],
		KeyB: ['b', 'B', '˘', '̆', 4],
		KeyC: ['c', 'C', '¸', '̧', 4],
		KeyD: ['d', 'D', 'ð', 'Ð', 0],
		KeyE: ['e', 'E', '´', '́', 4],
		KeyF: ['f', 'F', 'ƒ', '', 0],
		KeyG: ['g', 'G', '©', '‸', 8],
		KeyH: ['h', 'H', 'ˍ', '̱', 4],
		KeyI: ['i', 'I', 'ʼ', '̛', 4],
		KeyJ: ['j', 'J', '˝', '̋', 4],
		KeyK: ['k', 'K', '˚', '̊', 4],
		KeyL: ['l', 'L', '-', '̵', 4],
		KeyM: ['m', 'M', '˛', '̨', 4],
		KeyN: ['n', 'N', '˜', '̃', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', ',', '̦', 4],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', '', 0],
		KeyT: ['t', 'T', 'þ', 'Þ', 0],
		KeyU: ['u', 'U', '¨', '̈', 4],
		KeyV: ['v', 'V', 'ˇ', '̌', 4],
		KeyW: ['w', 'W', '˙', '̇', 4],
		KeyX: ['x', 'X', '.', '̣', 4],
		KeyY: ['y', 'Y', '¥', '', 0],
		KeyZ: ['z', 'Z', 'ˀ', '̉', 4],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '§', '†', 0],
		Digit6: ['6', '^', 'ˆ', '̂', 4],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', '№', 8],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['`', '~', '`', '̀', 4],
		Comma: [',', '<', '≤', '„', 0],
		Period: ['.', '>', '≥', 'ʔ', 8],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/jp.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/jp.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.inputmethod.Kotoeri.Japanese', lang: 'ja', localizedName: 'Hiragana' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '´', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', '˝', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['n', 'N', '˜', '˜', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'ˇ', 0],
		KeyU: ['u', 'U', '¨', '¨', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', '˛', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', '¸', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', '^', '§', 'ﬂ', 0],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['`', '~', '`', '`', 4],
		Comma: [',', '<', '≤', '¯', 0],
		Period: ['.', '>', '≥', '˘', 0],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/ko.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/ko.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.inputmethod.Korean.2SetKorean', lang: 'ko', localizedName: '2-Set Korean' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['ㅁ', 'ㅁ', 'a', 'A', 0],
		KeyB: ['ㅠ', 'ㅠ', 'b', 'B', 0],
		KeyC: ['ㅊ', 'ㅊ', 'c', 'C', 0],
		KeyD: ['ㅇ', 'ㅇ', 'd', 'D', 0],
		KeyE: ['ㄷ', 'ㄸ', 'e', 'E', 0],
		KeyF: ['ㄹ', 'ㄹ', 'f', 'F', 0],
		KeyG: ['ㅎ', 'ㅎ', 'g', 'G', 0],
		KeyH: ['ㅗ', 'ㅗ', 'h', 'H', 0],
		KeyI: ['ㅑ', 'ㅑ', 'i', 'I', 0],
		KeyJ: ['ㅓ', 'ㅓ', 'j', 'J', 0],
		KeyK: ['ㅏ', 'ㅏ', 'k', 'K', 0],
		KeyL: ['ㅣ', 'ㅣ', 'l', 'L', 0],
		KeyM: ['ㅡ', 'ㅡ', 'm', 'M', 0],
		KeyN: ['ㅜ', 'ㅜ', 'n', 'N', 0],
		KeyO: ['ㅐ', 'ㅒ', 'o', 'O', 0],
		KeyP: ['ㅔ', 'ㅖ', 'p', 'P', 0],
		KeyQ: ['ㅂ', 'ㅃ', 'q', 'Q', 0],
		KeyR: ['ㄱ', 'ㄲ', 'r', 'R', 0],
		KeyS: ['ㄴ', 'ㄴ', 's', 'S', 0],
		KeyT: ['ㅅ', 'ㅆ', 't', 'T', 0],
		KeyU: ['ㅕ', 'ㅕ', 'u', 'U', 0],
		KeyV: ['ㅍ', 'ㅍ', 'v', 'V', 0],
		KeyW: ['ㅈ', 'ㅉ', 'w', 'W', 0],
		KeyX: ['ㅌ', 'ㅌ', 'x', 'X', 0],
		KeyY: ['ㅛ', 'ㅛ', 'y', 'Y', 0],
		KeyZ: ['ㅋ', 'ㅋ', 'z', 'Z', 0],
		Digit1: ['1', '!', '1', '!', 0],
		Digit2: ['2', '@', '2', '@', 0],
		Digit3: ['3', '#', '3', '#', 0],
		Digit4: ['4', '$', '4', '$', 0],
		Digit5: ['5', '%', '5', '%', 0],
		Digit6: ['6', '^', '6', '^', 0],
		Digit7: ['7', '&', '7', '&', 0],
		Digit8: ['8', '*', '8', '*', 0],
		Digit9: ['9', '(', '9', '(', 0],
		Digit0: ['0', ')', '0', ')', 0],
		Enter: [],
		Escape: ['', '', '', '‌', 0],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '-', '_', 0],
		Equal: ['=', '+', '=', '+', 0],
		BracketLeft: ['[', '{', '[', '{', 0],
		BracketRight: [']', '}', ']', '}', 0],
		Backslash: ['\\', '|', '\\', '|', 0],
		Semicolon: [';', ':', ';', ':', 0],
		Quote: ['\'', '"', '\'', '"', 0],
		Backquote: ['₩', '~', '`', '~', 0],
		Comma: [',', '<', ',', '<', 0],
		Period: ['.', '>', '.', '>', 0],
		Slash: ['/', '?', '/', '?', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './en.darwin.js'; // 15%
import './zh-hans.darwin.js';
import './en-uk.darwin.js';
import './es.darwin.js';
import './jp-roman.darwin.js';
import './de.darwin.js';
import './en-intl.darwin.js';
import './en-ext.darwin.js';
import './fr.darwin.js';
import './jp.darwin.js';
import './pl.darwin.js';
import './it.darwin.js';
import './ru.darwin.js';
import './pt.darwin.js';
import './ko.darwin.js';
import './dvorak.darwin.js';

export { KeyboardLayoutContribution } from './_.contribution.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './en.linux.js';
import './es.linux.js';
import './de.linux.js';
import './fr.linux.js';
import './ru.linux.js';

export { KeyboardLayoutContribution } from './_.contribution.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './en.win.js'; // 40%
import './es-latin.win.js';
import './en-in.win.js';
import './de.win.js';
import './en-uk.win.js';
import './fr.win.js';
import './pt-br.win.js';
import './es.win.js';
import './en-intl.win.js';
import './ru.win.js';
import './pl.win.js';
import './it.win.js';
import './sv.win.js';
import './tr.win.js';
import './pt.win.js';
import './dk.win.js';
import './no.win.js';
import './thai.win.js';
import './hu.win.js';
import './de-swiss.win.js';
import './en-belgian.win.js';
import './cz.win.js';

export { KeyboardLayoutContribution } from './_.contribution.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/no.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/no.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000414', id: '', text: 'Norwegian' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', 'µ', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '#', '£', '', 0, 'VK_3'],
		Digit4: ['4', '¤', '$', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['+', '?', '', '', 0, 'VK_OEM_PLUS'],
		Equal: ['\\', '`', '´', '', 0, 'VK_OEM_4'],
		BracketLeft: ['å', 'Å', '', '', 0, 'VK_OEM_6'],
		BracketRight: ['¨', '^', '~', '', 0, 'VK_OEM_1'],
		Backslash: ['\'', '*', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['ø', 'Ø', '', '', 0, 'VK_OEM_3'],
		Quote: ['æ', 'Æ', '', '', 0, 'VK_OEM_7'],
		Backquote: ['|', '§', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/pl.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/pl.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.PolishPro', lang: 'pl', localizedName: 'Polish - Pro' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'ą', 'Ą', 0],
		KeyB: ['b', 'B', 'ļ', 'ű', 0],
		KeyC: ['c', 'C', 'ć', 'Ć', 0],
		KeyD: ['d', 'D', '∂', 'Ž', 0],
		KeyE: ['e', 'E', 'ę', 'Ę', 0],
		KeyF: ['f', 'F', 'ń', 'ž', 0],
		KeyG: ['g', 'G', '©', 'Ū', 0],
		KeyH: ['h', 'H', 'ķ', 'Ó', 0],
		KeyI: ['i', 'I', '^', 'ť', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', 'Ż', 'ū', 0],
		KeyL: ['l', 'L', 'ł', 'Ł', 0],
		KeyM: ['m', 'M', 'Ķ', 'ų', 0],
		KeyN: ['n', 'N', 'ń', 'Ń', 0],
		KeyO: ['o', 'O', 'ó', 'Ó', 0],
		KeyP: ['p', 'P', 'Ļ', 'ł', 0],
		KeyQ: ['q', 'Q', 'Ō', 'ő', 0],
		KeyR: ['r', 'R', '®', '£', 0],
		KeyS: ['s', 'S', 'ś', 'Ś', 0],
		KeyT: ['t', 'T', '†', 'ś', 0],
		KeyU: ['u', 'U', '¨', 'Ť', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', 'ź', 'Ź', 0],
		KeyY: ['y', 'Y', 'ī', 'Á', 0],
		KeyZ: ['z', 'Z', 'ż', 'Ż', 0],
		Digit1: ['1', '!', 'Ń', 'ŕ', 0],
		Digit2: ['2', '@', '™', 'Ř', 0],
		Digit3: ['3', '#', '€', '‹', 0],
		Digit4: ['4', '$', 'ß', '›', 0],
		Digit5: ['5', '%', 'į', 'ř', 0],
		Digit6: ['6', '^', '§', 'Ŗ', 0],
		Digit7: ['7', '&', '¶', 'ŗ', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'Ľ', 'Š', 0],
		Digit0: ['0', ')', 'ľ', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', 'Ī', 0],
		BracketLeft: ['[', '{', '„', '”', 0],
		BracketRight: [']', '}', '‚', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'ĺ', 'ģ', 0],
		Backquote: ['`', '~', '`', 'Ŕ', 4],
		Comma: [',', '<', '≤', 'Ý', 0],
		Period: ['.', '>', '≥', 'ý', 0],
		Slash: ['/', '?', '÷', 'ņ', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '£', '¬', '¬', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/pl.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/pl.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000415', id: '', text: 'Polish (Programmers)' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'ą', 'Ą', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', 'ć', 'Ć', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', 'ę', 'Ę', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', 'ł', 'Ł', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', 'ń', 'Ń', 0, 'VK_N'],
		KeyO: ['o', 'O', 'ó', 'Ó', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', 'ś', 'Ś', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '€', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', 'ź', 'Ź', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', 'ż', 'Ż', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '@', '', '', 0, 'VK_2'],
		Digit3: ['3', '#', '', '', 0, 'VK_3'],
		Digit4: ['4', '$', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '^', '', '', 0, 'VK_6'],
		Digit7: ['7', '&', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['[', '{', '', '', 0, 'VK_OEM_4'],
		BracketRight: [']', '}', '', '', 0, 'VK_OEM_6'],
		Backslash: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		Semicolon: [';', ':', '', '', 0, 'VK_OEM_1'],
		Quote: ['\'', '"', '', '', 0, 'VK_OEM_7'],
		Backquote: ['`', '~', '', '', 0, 'VK_OEM_3'],
		Comma: [',', '<', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['/', '?', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt-br.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt-br.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000416', id: '', text: 'Portuguese (Brazilian ABNT)' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '₢', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '°', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '/', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '?', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '¹', '', 0, 'VK_1'],
		Digit2: ['2', '@', '²', '', 0, 'VK_2'],
		Digit3: ['3', '#', '³', '', 0, 'VK_3'],
		Digit4: ['4', '$', '£', '', 0, 'VK_4'],
		Digit5: ['5', '%', '¢', '', 0, 'VK_5'],
		Digit6: ['6', '¨', '¬', '', 0, 'VK_6'],
		Digit7: ['7', '&', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '§', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['´', '`', '', '', 0, 'VK_OEM_4'],
		BracketRight: ['[', '{', 'ª', '', 0, 'VK_OEM_6'],
		Backslash: [']', '}', 'º', '', 0, 'VK_OEM_5'],
		Semicolon: ['ç', 'Ç', '', '', 0, 'VK_OEM_1'],
		Quote: ['~', '^', '', '', 0, 'VK_OEM_7'],
		Backquote: ['\'', '"', '', '', 0, 'VK_OEM_3'],
		Comma: [',', '<', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', '>', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: [';', ':', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: ['.', '.', '', '', 0, 'VK_ABNT_C2'],
		IntlRo: ['/', '?', '°', '', 0, 'VK_ABNT_C1'],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],

		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Brazilian-Pro', lang: 'pt' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '´', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', '˝', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['n', 'N', '˜', '˜', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'ˇ', 0],
		KeyU: ['u', 'U', '¨', '¨', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', '˛', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', '¸', 0],
		Digit1: ['1', '!', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '$', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', 'ˆ', '§', 'ﬂ', 2],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '(', 'ª', '·', 0],
		Digit0: ['0', ')', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['[', '{', '“', '”', 0],
		BracketRight: [']', '}', '‘', '’', 0],
		Backslash: ['\\', '|', '«', '»', 0],
		Semicolon: [';', ':', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 3],
		Backquote: ['`', '˜', '`', '`', 7],
		Comma: [',', '<', '≤', '¯', 0],
		Period: ['.', '>', '≥', '˘', 0],
		Slash: ['/', '?', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/pt.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000816', id: '', text: 'Portuguese' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '#', '£', '', 0, 'VK_3'],
		Digit4: ['4', '$', '§', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['\'', '?', '', '', 0, 'VK_OEM_4'],
		Equal: ['«', '»', '', '', 0, 'VK_OEM_6'],
		BracketLeft: ['+', '*', '¨', '', 0, 'VK_OEM_PLUS'],
		BracketRight: ['´', '`', ']', '', 0, 'VK_OEM_1'],
		Backslash: ['~', '^', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['ç', 'Ç', '', '', 0, 'VK_OEM_3'],
		Quote: ['º', 'ª', '', '', 0, 'VK_OEM_7'],
		Backquote: ['\\', '|', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Russian', lang: 'ru', localizedName: 'Russian' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['ф', 'Ф', 'ƒ', 'ƒ', 0],
		KeyB: ['и', 'И', 'и', 'И', 0],
		KeyC: ['с', 'С', '≠', '≠', 0],
		KeyD: ['в', 'В', 'ћ', 'Ћ', 0],
		KeyE: ['у', 'У', 'ќ', 'Ќ', 0],
		KeyF: ['а', 'А', '÷', '÷', 0],
		KeyG: ['п', 'П', '©', '©', 0],
		KeyH: ['р', 'Р', '₽', '₽', 0],
		KeyI: ['ш', 'Ш', 'ѕ', 'Ѕ', 0],
		KeyJ: ['о', 'О', '°', '•', 0],
		KeyK: ['л', 'Л', 'љ', 'Љ', 0],
		KeyL: ['д', 'Д', '∆', '∆', 0],
		KeyM: ['ь', 'Ь', '~', '~', 0],
		KeyN: ['т', 'Т', '™', '™', 0],
		KeyO: ['щ', 'Щ', 'ў', 'Ў', 0],
		KeyP: ['з', 'З', '‘', '’', 0],
		KeyQ: ['й', 'Й', 'ј', 'Ј', 0],
		KeyR: ['к', 'К', '®', '®', 0],
		KeyS: ['ы', 'Ы', 'ы', 'Ы', 0],
		KeyT: ['е', 'Е', '†', '†', 0],
		KeyU: ['г', 'Г', 'ѓ', 'Ѓ', 0],
		KeyV: ['м', 'М', 'µ', 'µ', 0],
		KeyW: ['ц', 'Ц', 'џ', 'Џ', 0],
		KeyX: ['ч', 'Ч', '≈', '≈', 0],
		KeyY: ['н', 'Н', 'њ', 'Њ', 0],
		KeyZ: ['я', 'Я', 'ђ', 'Ђ', 0],
		Digit1: ['1', '!', '!', '|', 0],
		Digit2: ['2', '"', '@', '"', 0],
		Digit3: ['3', '№', '#', '£', 0],
		Digit4: ['4', '%', '$', '€', 0],
		Digit5: ['5', ':', '%', '∞', 0],
		Digit6: ['6', ',', '^', '¬', 0],
		Digit7: ['7', '.', '&', '¶', 0],
		Digit8: ['8', ';', '*', '√', 0],
		Digit9: ['9', '(', '{', '\'', 0],
		Digit0: ['0', ')', '}', '`', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '–', '—', 0],
		Equal: ['=', '+', '»', '«', 0],
		BracketLeft: ['х', 'Х', '“', '”', 0],
		BracketRight: ['ъ', 'Ъ', 'ъ', 'Ъ', 0],
		Backslash: ['ё', 'Ё', 'ё', 'Ё', 0],
		Semicolon: ['ж', 'Ж', '…', '…', 0],
		Quote: ['э', 'Э', 'э', 'Э', 0],
		Backquote: [']', '[', ']', '[', 0],
		Comma: ['б', 'Б', '≤', '<', 0],
		Period: ['ю', 'Ю', '≥', '>', 0],
		Slash: ['/', '?', '“', '„', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', '.', ',', ',', 0],
		IntlBackslash: ['>', '<', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { model: 'pc104', group: 0, layout: 'ru', variant: ',', options: '', rules: 'base' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['ф', 'Ф', 'ф', 'Ф', 0],
		KeyB: ['и', 'И', 'и', 'И', 0],
		KeyC: ['с', 'С', 'с', 'С', 0],
		KeyD: ['в', 'В', 'в', 'В', 0],
		KeyE: ['у', 'У', 'у', 'У', 0],
		KeyF: ['а', 'А', 'а', 'А', 0],
		KeyG: ['п', 'П', 'п', 'П', 0],
		KeyH: ['р', 'Р', 'р', 'Р', 0],
		KeyI: ['ш', 'Ш', 'ш', 'Ш', 0],
		KeyJ: ['о', 'О', 'о', 'О', 0],
		KeyK: ['л', 'Л', 'л', 'Л', 0],
		KeyL: ['д', 'Д', 'д', 'Д', 0],
		KeyM: ['ь', 'Ь', 'ь', 'Ь', 0],
		KeyN: ['т', 'Т', 'т', 'Т', 0],
		KeyO: ['щ', 'Щ', 'щ', 'Щ', 0],
		KeyP: ['з', 'З', 'з', 'З', 0],
		KeyQ: ['й', 'Й', 'й', 'Й', 0],
		KeyR: ['к', 'К', 'к', 'К', 0],
		KeyS: ['ы', 'Ы', 'ы', 'Ы', 0],
		KeyT: ['е', 'Е', 'е', 'Е', 0],
		KeyU: ['г', 'Г', 'г', 'Г', 0],
		KeyV: ['м', 'М', 'м', 'М', 0],
		KeyW: ['ц', 'Ц', 'ц', 'Ц', 0],
		KeyX: ['ч', 'Ч', 'ч', 'Ч', 0],
		KeyY: ['н', 'Н', 'н', 'Н', 0],
		KeyZ: ['я', 'Я', 'я', 'Я', 0],
		Digit1: ['1', '!', '1', '!', 0],
		Digit2: ['2', '"', '2', '"', 0],
		Digit3: ['3', '№', '3', '№', 0],
		Digit4: ['4', ';', '4', ';', 0],
		Digit5: ['5', '%', '5', '%', 0],
		Digit6: ['6', ':', '6', ':', 0],
		Digit7: ['7', '?', '7', '?', 0],
		Digit8: ['8', '*', '₽', '', 0],
		Digit9: ['9', '(', '9', '(', 0],
		Digit0: ['0', ')', '0', ')', 0],
		Enter: ['\r', '\r', '\r', '\r', 0],
		Escape: ['\u001b', '\u001b', '\u001b', '\u001b', 0],
		Backspace: ['\b', '\b', '\b', '\b', 0],
		Tab: ['\t', '', '\t', '', 0],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '_', '-', '_', 0],
		Equal: ['=', '+', '=', '+', 0],
		BracketLeft: ['х', 'Х', 'х', 'Х', 0],
		BracketRight: ['ъ', 'Ъ', 'ъ', 'Ъ', 0],
		Backslash: ['\\', '/', '\\', '/', 0],
		Semicolon: ['ж', 'Ж', 'ж', 'Ж', 0],
		Quote: ['э', 'Э', 'э', 'Э', 0],
		Backquote: ['ё', 'Ё', 'ё', 'Ё', 0],
		Comma: ['б', 'Б', 'б', 'Б', 0],
		Period: ['ю', 'Ю', 'ю', 'Ю', 0],
		Slash: ['.', ',', '.', ',', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: ['', '', '', '', 0],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: ['/', '/', '/', '/', 0],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: [],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['', '1', '', '1', 0],
		Numpad2: ['', '2', '', '2', 0],
		Numpad3: ['', '3', '', '3', 0],
		Numpad4: ['', '4', '', '4', 0],
		Numpad5: ['', '5', '', '5', 0],
		Numpad6: ['', '6', '', '6', 0],
		Numpad7: ['', '7', '', '7', 0],
		Numpad8: ['', '8', '', '8', 0],
		Numpad9: ['', '9', '', '9', 0],
		Numpad0: ['', '0', '', '0', 0],
		NumpadDecimal: ['', ',', '', ',', 0],
		IntlBackslash: ['/', '|', '|', '¦', 0],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Open: [],
		Help: [],
		Select: [],
		Again: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		Find: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		Lang5: [],
		NumpadParenLeft: [],
		NumpadParenRight: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: ['\r', '\r', '\r', '\r', 0],
		MetaRight: ['.', '.', '.', '.', 0],
		BrightnessUp: [],
		BrightnessDown: [],
		MediaPlay: [],
		MediaRecord: [],
		MediaFastForward: [],
		MediaRewind: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		SelectTask: [],
		LaunchScreenSaver: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: [],
		MailReply: [],
		MailForward: [],
		MailSend: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/ru.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000419', id: '', text: 'Russian' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['ф', 'Ф', '', '', 0, 'VK_A'],
		KeyB: ['и', 'И', '', '', 0, 'VK_B'],
		KeyC: ['с', 'С', '', '', 0, 'VK_C'],
		KeyD: ['в', 'В', '', '', 0, 'VK_D'],
		KeyE: ['у', 'У', '', '', 0, 'VK_E'],
		KeyF: ['а', 'А', '', '', 0, 'VK_F'],
		KeyG: ['п', 'П', '', '', 0, 'VK_G'],
		KeyH: ['р', 'Р', '', '', 0, 'VK_H'],
		KeyI: ['ш', 'Ш', '', '', 0, 'VK_I'],
		KeyJ: ['о', 'О', '', '', 0, 'VK_J'],
		KeyK: ['л', 'Л', '', '', 0, 'VK_K'],
		KeyL: ['д', 'Д', '', '', 0, 'VK_L'],
		KeyM: ['ь', 'Ь', '', '', 0, 'VK_M'],
		KeyN: ['т', 'Т', '', '', 0, 'VK_N'],
		KeyO: ['щ', 'Щ', '', '', 0, 'VK_O'],
		KeyP: ['з', 'З', '', '', 0, 'VK_P'],
		KeyQ: ['й', 'Й', '', '', 0, 'VK_Q'],
		KeyR: ['к', 'К', '', '', 0, 'VK_R'],
		KeyS: ['ы', 'Ы', '', '', 0, 'VK_S'],
		KeyT: ['е', 'Е', '', '', 0, 'VK_T'],
		KeyU: ['г', 'Г', '', '', 0, 'VK_U'],
		KeyV: ['м', 'М', '', '', 0, 'VK_V'],
		KeyW: ['ц', 'Ц', '', '', 0, 'VK_W'],
		KeyX: ['ч', 'Ч', '', '', 0, 'VK_X'],
		KeyY: ['н', 'Н', '', '', 0, 'VK_Y'],
		KeyZ: ['я', 'Я', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '', '', 0, 'VK_2'],
		Digit3: ['3', '№', '', '', 0, 'VK_3'],
		Digit4: ['4', ';', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', ':', '', '', 0, 'VK_6'],
		Digit7: ['7', '?', '', '', 0, 'VK_7'],
		Digit8: ['8', '*', '₽', '', 0, 'VK_8'],
		Digit9: ['9', '(', '', '', 0, 'VK_9'],
		Digit0: ['0', ')', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['=', '+', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['х', 'Х', '', '', 0, 'VK_OEM_4'],
		BracketRight: ['ъ', 'Ъ', '', '', 0, 'VK_OEM_6'],
		Backslash: ['\\', '/', '', '', 0, 'VK_OEM_5'],
		Semicolon: ['ж', 'Ж', '', '', 0, 'VK_OEM_1'],
		Quote: ['э', 'Э', '', '', 0, 'VK_OEM_7'],
		Backquote: ['ё', 'Ё', '', '', 0, 'VK_OEM_3'],
		Comma: ['б', 'Б', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['ю', 'Ю', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['.', ',', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '/', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/sv.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/sv.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.Swedish-Pro', lang: 'sv', localizedName: 'Swedish - Pro' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', '', '◊', 0],
		KeyB: ['b', 'B', '›', '»', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', '∆', 0],
		KeyE: ['e', 'E', 'é', 'É', 0],
		KeyF: ['f', 'F', 'ƒ', '∫', 0],
		KeyG: ['g', 'G', '¸', '¯', 0],
		KeyH: ['h', 'H', '˛', '˘', 0],
		KeyI: ['i', 'I', 'ı', 'ˆ', 0],
		KeyJ: ['j', 'J', '√', '¬', 0],
		KeyK: ['k', 'K', 'ª', 'º', 0],
		KeyL: ['l', 'L', 'ﬁ', 'ﬂ', 0],
		KeyM: ['m', 'M', '’', '”', 0],
		KeyN: ['n', 'N', '‘', '“', 0],
		KeyO: ['o', 'O', 'œ', 'Œ', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', '•', '°', 0],
		KeyR: ['r', 'R', '®', '√', 0],
		KeyS: ['s', 'S', 'ß', '∑', 0],
		KeyT: ['t', 'T', '†', '‡', 0],
		KeyU: ['u', 'U', 'ü', 'Ü', 0],
		KeyV: ['v', 'V', '‹', '«', 0],
		KeyW: ['w', 'W', 'Ω', '˝', 0],
		KeyX: ['x', 'X', '≈', 'ˇ', 0],
		KeyY: ['y', 'Y', 'µ', '˜', 0],
		KeyZ: ['z', 'Z', '÷', '⁄', 0],
		Digit1: ['1', '!', '©', '¡', 0],
		Digit2: ['2', '"', '@', '”', 0],
		Digit3: ['3', '#', '£', '¥', 0],
		Digit4: ['4', '€', '$', '¢', 0],
		Digit5: ['5', '%', '∞', '‰', 0],
		Digit6: ['6', '&', '§', '¶', 0],
		Digit7: ['7', '/', '|', '\\', 0],
		Digit8: ['8', '(', '[', '{', 0],
		Digit9: ['9', ')', ']', '}', 0],
		Digit0: ['0', '=', '≈', '≠', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['+', '?', '±', '¿', 0],
		Equal: ['´', '`', '´', '`', 3],
		BracketLeft: ['å', 'Å', '˙', '˚', 0],
		BracketRight: ['¨', '^', '~', '^', 7],
		Backslash: ['\'', '*', '™', '’', 0],
		Semicolon: ['ö', 'Ö', 'ø', 'Ø', 0],
		Quote: ['ä', 'Ä', 'æ', 'Æ', 0],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [',', ';', '‚', '„', 0],
		Period: ['.', ':', '…', '·', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', '.', ',', '.', 0],
		IntlBackslash: ['§', '°', '¶', '•', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/sv.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/sv.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000041D', id: '', text: 'Swedish' },
	secondaryLayouts: [
		{ name: '0000040B', id: '', text: 'Finnish' }
	],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', 'µ', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '#', '£', '', 0, 'VK_3'],
		Digit4: ['4', '¤', '$', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['+', '?', '\\', '', 0, 'VK_OEM_PLUS'],
		Equal: ['´', '`', '', '', 0, 'VK_OEM_4'],
		BracketLeft: ['å', 'Å', '', '', 0, 'VK_OEM_6'],
		BracketRight: ['¨', '^', '~', '', 0, 'VK_OEM_1'],
		Backslash: ['\'', '*', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['ö', 'Ö', '', '', 0, 'VK_OEM_3'],
		Quote: ['ä', 'Ä', '', '', 0, 'VK_OEM_7'],
		Backquote: ['§', '½', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '|', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/thai.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/thai.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000041E', id: '', text: 'Thai Kedmanee' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['ฟ', 'ฤ', '', '', 0, 'VK_A'],
		KeyB: ['ิ', 'ฺ', '', '', 0, 'VK_B'],
		KeyC: ['แ', 'ฉ', '', '', 0, 'VK_C'],
		KeyD: ['ก', 'ฏ', '', '', 0, 'VK_D'],
		KeyE: ['ำ', 'ฎ', '', '', 0, 'VK_E'],
		KeyF: ['ด', 'โ', '', '', 0, 'VK_F'],
		KeyG: ['เ', 'ฌ', '', '', 0, 'VK_G'],
		KeyH: ['้', '็', '', '', 0, 'VK_H'],
		KeyI: ['ร', 'ณ', '', '', 0, 'VK_I'],
		KeyJ: ['่', '๋', '', '', 0, 'VK_J'],
		KeyK: ['า', 'ษ', '', '', 0, 'VK_K'],
		KeyL: ['ส', 'ศ', '', '', 0, 'VK_L'],
		KeyM: ['ท', '?', '', '', 0, 'VK_M'],
		KeyN: ['ื', '์', '', '', 0, 'VK_N'],
		KeyO: ['น', 'ฯ', '', '', 0, 'VK_O'],
		KeyP: ['ย', 'ญ', '', '', 0, 'VK_P'],
		KeyQ: ['ๆ', '๐', '', '', 0, 'VK_Q'],
		KeyR: ['พ', 'ฑ', '', '', 0, 'VK_R'],
		KeyS: ['ห', 'ฆ', '', '', 0, 'VK_S'],
		KeyT: ['ะ', 'ธ', '', '', 0, 'VK_T'],
		KeyU: ['ี', '๊', '', '', 0, 'VK_U'],
		KeyV: ['อ', 'ฮ', '', '', 0, 'VK_V'],
		KeyW: ['ไ', '"', '', '', 0, 'VK_W'],
		KeyX: ['ป', ')', '', '', 0, 'VK_X'],
		KeyY: ['ั', 'ํ', '', '', 0, 'VK_Y'],
		KeyZ: ['ผ', '(', '', '', 0, 'VK_Z'],
		Digit1: ['ๅ', '+', '', '', 0, 'VK_1'],
		Digit2: ['/', '๑', '', '', 0, 'VK_2'],
		Digit3: ['-', '๒', '', '', 0, 'VK_3'],
		Digit4: ['ภ', '๓', '', '', 0, 'VK_4'],
		Digit5: ['ถ', '๔', '', '', 0, 'VK_5'],
		Digit6: ['ุ', 'ู', '', '', 0, 'VK_6'],
		Digit7: ['ึ', '฿', '', '', 0, 'VK_7'],
		Digit8: ['ค', '๕', '', '', 0, 'VK_8'],
		Digit9: ['ต', '๖', '', '', 0, 'VK_9'],
		Digit0: ['จ', '๗', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['ข', '๘', '', '', 0, 'VK_OEM_MINUS'],
		Equal: ['ช', '๙', '', '', 0, 'VK_OEM_PLUS'],
		BracketLeft: ['บ', 'ฐ', '', '', 0, 'VK_OEM_4'],
		BracketRight: ['ล', ',', '', '', 0, 'VK_OEM_6'],
		Backslash: ['ฃ', 'ฅ', '', '', 0, 'VK_OEM_5'],
		Semicolon: ['ว', 'ซ', '', '', 0, 'VK_OEM_1'],
		Quote: ['ง', '.', '', '', 0, 'VK_OEM_7'],
		Backquote: ['_', '%', '', '', 0, 'VK_OEM_3'],
		Comma: ['ม', 'ฒ', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['ใ', 'ฬ', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['ฝ', 'ฦ', '', '', 0, 'VK_OEM_2'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['ฃ', 'ฅ', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/tr.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/tr.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '0000041F', id: '', text: 'Turkish Q' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'æ', 'Æ', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['ı', 'I', 'i', 'İ', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '@', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', 'ß', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '₺', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '>', '', 0, 'VK_1'],
		Digit2: ['2', '\'', '£', '', 0, 'VK_2'],
		Digit3: ['3', '^', '#', '', 0, 'VK_3'],
		Digit4: ['4', '+', '$', '', 0, 'VK_4'],
		Digit5: ['5', '%', '½', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['*', '?', '\\', '', 0, 'VK_OEM_8'],
		Equal: ['-', '_', '|', '', 0, 'VK_OEM_MINUS'],
		BracketLeft: ['ğ', 'Ğ', '¨', '', 0, 'VK_OEM_4'],
		BracketRight: ['ü', 'Ü', '~', '', 0, 'VK_OEM_6'],
		Backslash: [',', ';', '`', '', 0, 'VK_OEM_COMMA'],
		Semicolon: ['ş', 'Ş', '´', '', 0, 'VK_OEM_1'],
		Quote: ['i', 'İ', '', '', 0, 'VK_OEM_7'],
		Backquote: ['"', 'é', '<', '', 0, 'VK_OEM_3'],
		Comma: ['ö', 'Ö', '', '', 0, 'VK_OEM_2'],
		Period: ['ç', 'Ç', '', '', 0, 'VK_OEM_5'],
		Slash: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '|', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/zh-hans.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/zh-hans.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.inputmethod.SCIM.ITABC', lang: 'zh-Hans', localizedName: '搜狗拼音' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', 'ı', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', 'Î', 0],
		KeyE: ['e', 'E', '´', '´', 4],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', '˝', 0],
		KeyH: ['h', 'H', '˙', 'Ó', 0],
		KeyI: ['i', 'I', 'ˆ', 'ˆ', 4],
		KeyJ: ['j', 'J', '∆', 'Ô', 0],
		KeyK: ['k', 'K', '˚', '', 0],
		KeyL: ['l', 'L', '¬', 'Ò', 0],
		KeyM: ['m', 'M', 'µ', 'Â', 0],
		KeyN: ['n', 'N', '˜', '˜', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', 'œ', 'Œ', 0],
		KeyR: ['r', 'R', '®', '‰', 0],
		KeyS: ['s', 'S', 'ß', 'Í', 0],
		KeyT: ['t', 'T', '†', 'ˇ', 0],
		KeyU: ['u', 'U', '¨', '¨', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', '˛', 0],
		KeyY: ['y', 'Y', '¥', 'Á', 0],
		KeyZ: ['z', 'Z', 'Ω', '¸', 0],
		Digit1: ['1', '！', '¡', '⁄', 0],
		Digit2: ['2', '@', '™', '€', 0],
		Digit3: ['3', '#', '£', '‹', 0],
		Digit4: ['4', '¥', '¢', '›', 0],
		Digit5: ['5', '%', '∞', 'ﬁ', 0],
		Digit6: ['6', '', '§', 'ﬂ', 0],
		Digit7: ['7', '&', '¶', '‡', 0],
		Digit8: ['8', '*', '•', '°', 0],
		Digit9: ['9', '（', 'ª', '·', 0],
		Digit0: ['0', '）', 'º', '‚', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['-', '', '–', '—', 0],
		Equal: ['=', '+', '≠', '±', 0],
		BracketLeft: ['【', '「', '“', '”', 0],
		BracketRight: ['】', '」', '‘', '’', 0],
		Backslash: ['、', '|', '«', '»', 0],
		Semicolon: ['；', '：', '…', 'Ú', 0],
		Quote: ['\'', '"', 'æ', 'Æ', 0],
		Backquote: ['·', '～', '`', '`', 4],
		Comma: ['，', '《', '≤', '¯', 0],
		Period: ['。', '》', '≥', '˘', 0],
		Slash: ['/', '？', '÷', '¿', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: ['.', '.', '.', '.', 0],
		IntlBackslash: ['§', '±', '§', '±', 0],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/_.contribution.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/_.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeymapInfo } from '../../common/keymapInfo.js';

export class KeyboardLayoutContribution {
	public static readonly INSTANCE: KeyboardLayoutContribution = new KeyboardLayoutContribution();

	private _layoutInfos: IKeymapInfo[] = [];

	get layoutInfos() {
		return this._layoutInfos;
	}

	private constructor() {
	}

	registerKeyboardLayout(layout: IKeymapInfo) {
		this._layoutInfos.push(layout);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/common/fallbackKeyboardMapper.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/fallbackKeyboardMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResolvedKeybinding, KeyCodeChord, Keybinding } from '../../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { USLayoutResolvedKeybinding } from '../../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';
import { IKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';

/**
 * A keyboard mapper to be used when reading the keymap from the OS fails.
 */
export class FallbackKeyboardMapper implements IKeyboardMapper {

	constructor(
		private readonly _mapAltGrToCtrlAlt: boolean,
		private readonly _OS: OperatingSystem,
	) { }

	public dumpDebugInfo(): string {
		return 'FallbackKeyboardMapper dispatching on keyCode';
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		const ctrlKey = keyboardEvent.ctrlKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const altKey = keyboardEvent.altKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const chord = new KeyCodeChord(
			ctrlKey,
			keyboardEvent.shiftKey,
			altKey,
			keyboardEvent.metaKey,
			keyboardEvent.keyCode
		);
		const result = this.resolveKeybinding(new Keybinding([chord]));
		return result[0];
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		return USLayoutResolvedKeybinding.resolveKeybinding(keybinding, this._OS);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/common/keybindingEditing.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/keybindingEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Queue } from '../../../../base/common/async.js';
import * as json from '../../../../base/common/json.js';
import * as objects from '../../../../base/common/objects.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { Edit } from '../../../../base/common/jsonFormatter.js';
import { Disposable, IReference } from '../../../../base/common/lifecycle.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ITextModelService, IResolvedTextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserFriendlyKeybinding } from '../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybindingItem } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export const IKeybindingEditingService = createDecorator<IKeybindingEditingService>('keybindingEditingService');

export interface IKeybindingEditingService {

	readonly _serviceBrand: undefined;

	addKeybinding(keybindingItem: ResolvedKeybindingItem, key: string, when: string | undefined): Promise<void>;

	editKeybinding(keybindingItem: ResolvedKeybindingItem, key: string, when: string | undefined): Promise<void>;

	removeKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void>;

	resetKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void>;
}

export class KeybindingsEditingService extends Disposable implements IKeybindingEditingService {

	public _serviceBrand: undefined;
	private queue: Queue<void>;

	constructor(
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IFileService private readonly fileService: IFileService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
	) {
		super();
		this.queue = new Queue<void>();
	}

	addKeybinding(keybindingItem: ResolvedKeybindingItem, key: string, when: string | undefined): Promise<void> {
		return this.queue.queue(() => this.doEditKeybinding(keybindingItem, key, when, true)); // queue up writes to prevent race conditions
	}

	editKeybinding(keybindingItem: ResolvedKeybindingItem, key: string, when: string | undefined): Promise<void> {
		return this.queue.queue(() => this.doEditKeybinding(keybindingItem, key, when, false)); // queue up writes to prevent race conditions
	}

	resetKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void> {
		return this.queue.queue(() => this.doResetKeybinding(keybindingItem)); // queue up writes to prevent race conditions
	}

	removeKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void> {
		return this.queue.queue(() => this.doRemoveKeybinding(keybindingItem)); // queue up writes to prevent race conditions
	}

	private async doEditKeybinding(keybindingItem: ResolvedKeybindingItem, key: string, when: string | undefined, add: boolean): Promise<void> {
		const reference = await this.resolveAndValidate();
		const model = reference.object.textEditorModel;
		if (add) {
			this.updateKeybinding(keybindingItem, key, when, model, -1);
		} else {
			const userKeybindingEntries = <IUserFriendlyKeybinding[]>json.parse(model.getValue());
			const userKeybindingEntryIndex = this.findUserKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
			this.updateKeybinding(keybindingItem, key, when, model, userKeybindingEntryIndex);
			if (keybindingItem.isDefault && keybindingItem.resolvedKeybinding) {
				this.removeDefaultKeybinding(keybindingItem, model);
			}
		}
		try {
			await this.save();
		} finally {
			reference.dispose();
		}
	}

	private async doRemoveKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void> {
		const reference = await this.resolveAndValidate();
		const model = reference.object.textEditorModel;
		if (keybindingItem.isDefault) {
			this.removeDefaultKeybinding(keybindingItem, model);
		} else {
			this.removeUserKeybinding(keybindingItem, model);
		}
		try {
			return await this.save();
		} finally {
			reference.dispose();
		}
	}

	private async doResetKeybinding(keybindingItem: ResolvedKeybindingItem): Promise<void> {
		const reference = await this.resolveAndValidate();
		const model = reference.object.textEditorModel;
		if (!keybindingItem.isDefault) {
			this.removeUserKeybinding(keybindingItem, model);
			this.removeUnassignedDefaultKeybinding(keybindingItem, model);
		}
		try {
			return await this.save();
		} finally {
			reference.dispose();
		}
	}

	private save(): Promise<any> {
		return this.textFileService.save(this.userDataProfileService.currentProfile.keybindingsResource);
	}

	private updateKeybinding(keybindingItem: ResolvedKeybindingItem, newKey: string, when: string | undefined, model: ITextModel, userKeybindingEntryIndex: number): void {
		const { tabSize, insertSpaces } = model.getOptions();
		const eol = model.getEOL();
		if (userKeybindingEntryIndex !== -1) {
			// Update the keybinding with new key
			this.applyEditsToBuffer(setProperty(model.getValue(), [userKeybindingEntryIndex, 'key'], newKey, { tabSize, insertSpaces, eol })[0], model);
			const edits = setProperty(model.getValue(), [userKeybindingEntryIndex, 'when'], when, { tabSize, insertSpaces, eol });
			if (edits.length > 0) {
				this.applyEditsToBuffer(edits[0], model);
			}
		} else {
			// Add the new keybinding with new key
			this.applyEditsToBuffer(setProperty(model.getValue(), [-1], this.asObject(newKey, keybindingItem.command, when, false), { tabSize, insertSpaces, eol })[0], model);
		}
	}

	private removeUserKeybinding(keybindingItem: ResolvedKeybindingItem, model: ITextModel): void {
		const { tabSize, insertSpaces } = model.getOptions();
		const eol = model.getEOL();
		const userKeybindingEntries = <IUserFriendlyKeybinding[]>json.parse(model.getValue());
		const userKeybindingEntryIndex = this.findUserKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
		if (userKeybindingEntryIndex !== -1) {
			this.applyEditsToBuffer(setProperty(model.getValue(), [userKeybindingEntryIndex], undefined, { tabSize, insertSpaces, eol })[0], model);
		}
	}

	private removeDefaultKeybinding(keybindingItem: ResolvedKeybindingItem, model: ITextModel): void {
		const { tabSize, insertSpaces } = model.getOptions();
		const eol = model.getEOL();
		const key = keybindingItem.resolvedKeybinding ? keybindingItem.resolvedKeybinding.getUserSettingsLabel() : null;
		if (key) {
			const entry: IUserFriendlyKeybinding = this.asObject(key, keybindingItem.command, keybindingItem.when ? keybindingItem.when.serialize() : undefined, true);
			const userKeybindingEntries = <IUserFriendlyKeybinding[]>json.parse(model.getValue());
			if (userKeybindingEntries.every(e => !this.areSame(e, entry))) {
				this.applyEditsToBuffer(setProperty(model.getValue(), [-1], entry, { tabSize, insertSpaces, eol })[0], model);
			}
		}
	}

	private removeUnassignedDefaultKeybinding(keybindingItem: ResolvedKeybindingItem, model: ITextModel): void {
		const { tabSize, insertSpaces } = model.getOptions();
		const eol = model.getEOL();
		const userKeybindingEntries = <IUserFriendlyKeybinding[]>json.parse(model.getValue());
		const indices = this.findUnassignedDefaultKeybindingEntryIndex(keybindingItem, userKeybindingEntries).reverse();
		for (const index of indices) {
			this.applyEditsToBuffer(setProperty(model.getValue(), [index], undefined, { tabSize, insertSpaces, eol })[0], model);
		}
	}

	private findUserKeybindingEntryIndex(keybindingItem: ResolvedKeybindingItem, userKeybindingEntries: IUserFriendlyKeybinding[]): number {
		for (let index = 0; index < userKeybindingEntries.length; index++) {
			const keybinding = userKeybindingEntries[index];
			if (keybinding.command === keybindingItem.command) {
				if (!keybinding.when && !keybindingItem.when) {
					return index;
				}
				if (keybinding.when && keybindingItem.when) {
					const contextKeyExpr = ContextKeyExpr.deserialize(keybinding.when);
					if (contextKeyExpr && contextKeyExpr.serialize() === keybindingItem.when.serialize()) {
						return index;
					}
				}
			}
		}
		return -1;
	}

	private findUnassignedDefaultKeybindingEntryIndex(keybindingItem: ResolvedKeybindingItem, userKeybindingEntries: IUserFriendlyKeybinding[]): number[] {
		const indices: number[] = [];
		for (let index = 0; index < userKeybindingEntries.length; index++) {
			if (userKeybindingEntries[index].command === `-${keybindingItem.command}`) {
				indices.push(index);
			}
		}
		return indices;
	}

	private asObject(key: string, command: string | null, when: string | undefined, negate: boolean): any {
		const object: any = { key };
		if (command) {
			object['command'] = negate ? `-${command}` : command;
		}
		if (when) {
			object['when'] = when;
		}
		return object;
	}

	private areSame(a: IUserFriendlyKeybinding, b: IUserFriendlyKeybinding): boolean {
		if (a.command !== b.command) {
			return false;
		}
		if (a.key !== b.key) {
			return false;
		}
		const whenA = ContextKeyExpr.deserialize(a.when);
		const whenB = ContextKeyExpr.deserialize(b.when);
		if ((whenA && !whenB) || (!whenA && whenB)) {
			return false;
		}
		if (whenA && whenB && !whenA.equals(whenB)) {
			return false;
		}
		if (!objects.equals(a.args, b.args)) {
			return false;
		}
		return true;
	}

	private applyEditsToBuffer(edit: Edit, model: ITextModel): void {
		const startPosition = model.getPositionAt(edit.offset);
		const endPosition = model.getPositionAt(edit.offset + edit.length);
		const range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
		const currentText = model.getValueInRange(range);
		const editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
		model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], () => []);
	}

	private async resolveModelReference(): Promise<IReference<IResolvedTextEditorModel>> {
		const exists = await this.fileService.exists(this.userDataProfileService.currentProfile.keybindingsResource);
		if (!exists) {
			await this.textFileService.write(this.userDataProfileService.currentProfile.keybindingsResource, this.getEmptyContent(), { encoding: 'utf8' });
		}
		return this.textModelResolverService.createModelReference(this.userDataProfileService.currentProfile.keybindingsResource);
	}

	private async resolveAndValidate(): Promise<IReference<IResolvedTextEditorModel>> {

		// Target cannot be dirty if not writing into buffer
		if (this.textFileService.isDirty(this.userDataProfileService.currentProfile.keybindingsResource)) {
			throw new Error(localize('errorKeybindingsFileDirty', "Unable to write because the keybindings configuration file has unsaved changes. Please save it first and then try again."));
		}

		const reference = await this.resolveModelReference();
		const model = reference.object.textEditorModel;
		const EOL = model.getEOL();
		if (model.getValue()) {
			const parsed = this.parse(model);
			if (parsed.parseErrors.length) {
				reference.dispose();
				throw new Error(localize('parseErrors', "Unable to write to the keybindings configuration file. Please open it to correct errors/warnings in the file and try again."));
			}
			if (parsed.result) {
				if (!Array.isArray(parsed.result)) {
					reference.dispose();
					throw new Error(localize('errorInvalidConfiguration', "Unable to write to the keybindings configuration file. It has an object which is not of type Array. Please open the file to clean up and try again."));
				}
			} else {
				const content = EOL + '[]';
				this.applyEditsToBuffer({ content, length: content.length, offset: model.getValue().length }, model);
			}
		} else {
			const content = this.getEmptyContent();
			this.applyEditsToBuffer({ content, length: content.length, offset: 0 }, model);
		}
		return reference;
	}

	private parse(model: ITextModel): { result: IUserFriendlyKeybinding[]; parseErrors: json.ParseError[] } {
		const parseErrors: json.ParseError[] = [];
		const result = json.parse(model.getValue(), parseErrors, { allowTrailingComma: true, allowEmptyContent: true });
		return { result, parseErrors };
	}

	private getEmptyContent(): string {
		return '// ' + localize('emptyKeybindingsHeader', "Place your key bindings in this file to override the defaults") + '\n[\n]';
	}
}

registerSingleton(IKeybindingEditingService, KeybindingsEditingService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/common/keybindingIO.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/keybindingIO.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeybindingParser } from '../../../../base/common/keybindingParser.js';
import { Keybinding } from '../../../../base/common/keybindings.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { ResolvedKeybindingItem } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';

export interface IUserKeybindingItem {
	keybinding: Keybinding | null;
	command: string | null;
	commandArgs?: unknown;
	when: ContextKeyExpression | undefined;
	_sourceKey: string | undefined; /** captures `key` field from `keybindings.json`; `this.keybinding !== null` implies `_sourceKey !== null` */
}

export class KeybindingIO {

	public static writeKeybindingItem(out: OutputBuilder, item: ResolvedKeybindingItem): void {
		if (!item.resolvedKeybinding) {
			return;
		}
		const quotedSerializedKeybinding = JSON.stringify(item.resolvedKeybinding.getUserSettingsLabel());
		out.write(`{ "key": ${rightPaddedString(quotedSerializedKeybinding + ',', 25)} "command": `);

		const quotedSerializedWhen = item.when ? JSON.stringify(item.when.serialize()) : '';
		const quotedSerializeCommand = JSON.stringify(item.command);
		if (quotedSerializedWhen.length > 0) {
			out.write(`${quotedSerializeCommand},`);
			out.writeLine();
			out.write(`                                     "when": ${quotedSerializedWhen}`);
		} else {
			out.write(`${quotedSerializeCommand}`);
		}
		if (item.commandArgs) {
			out.write(',');
			out.writeLine();
			out.write(`                                     "args": ${JSON.stringify(item.commandArgs)}`);
		}
		out.write(' }');
	}

	public static readUserKeybindingItem(input: Object): IUserKeybindingItem {
		const keybinding = 'key' in input && typeof input.key === 'string'
			? KeybindingParser.parseKeybinding(input.key)
			: null;
		const when = 'when' in input && typeof input.when === 'string'
			? ContextKeyExpr.deserialize(input.when)
			: undefined;
		const command = 'command' in input && typeof input.command === 'string'
			? input.command
			: null;
		const commandArgs = 'args' in input && typeof input.args !== 'undefined'
			? input.args
			: undefined;
		return {
			keybinding,
			command,
			commandArgs,
			when,
			_sourceKey: 'key' in input && typeof input.key === 'string' ? input.key : undefined,
		};
	}
}

function rightPaddedString(str: string, minChars: number): string {
	if (str.length < minChars) {
		return str + (new Array(minChars - str.length).join(' '));
	}
	return str;
}

export class OutputBuilder {

	private _lines: string[] = [];
	private _currentLine: string = '';

	write(str: string): void {
		this._currentLine += str;
	}

	writeLine(str: string = ''): void {
		this._lines.push(this._currentLine + str);
		this._currentLine = '';
	}

	toString(): string {
		this.writeLine();
		return this._lines.join('\n');
	}
}
```

--------------------------------------------------------------------------------

````

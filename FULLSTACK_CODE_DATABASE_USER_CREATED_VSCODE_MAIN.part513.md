---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 513
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 513 of 552)

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

---[FILE: src/vs/workbench/services/keybinding/common/keymapInfo.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/keymapInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows, isLinux } from '../../../../base/common/platform.js';
import { getKeyboardLayoutId, IKeyboardLayoutInfo } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';

function deserializeMapping(serializedMapping: ISerializedMapping) {
	const mapping = serializedMapping;

	const ret: { [key: string]: any } = {};
	for (const key in mapping) {
		const result: (string | number)[] = mapping[key];
		if (result.length) {
			const value = result[0];
			const withShift = result[1];
			const withAltGr = result[2];
			const withShiftAltGr = result[3];
			const mask = Number(result[4]);
			const vkey = result.length === 6 ? result[5] : undefined;
			ret[key] = {
				'value': value,
				'vkey': vkey,
				'withShift': withShift,
				'withAltGr': withAltGr,
				'withShiftAltGr': withShiftAltGr,
				'valueIsDeadKey': (mask & 1) > 0,
				'withShiftIsDeadKey': (mask & 2) > 0,
				'withAltGrIsDeadKey': (mask & 4) > 0,
				'withShiftAltGrIsDeadKey': (mask & 8) > 0
			};
		} else {
			ret[key] = {
				'value': '',
				'valueIsDeadKey': false,
				'withShift': '',
				'withShiftIsDeadKey': false,
				'withAltGr': '',
				'withAltGrIsDeadKey': false,
				'withShiftAltGr': '',
				'withShiftAltGrIsDeadKey': false
			};
		}
	}

	return ret;
}

export interface IRawMixedKeyboardMapping {
	[key: string]: {
		value: string;
		withShift: string;
		withAltGr: string;
		withShiftAltGr: string;
		valueIsDeadKey?: boolean;
		withShiftIsDeadKey?: boolean;
		withAltGrIsDeadKey?: boolean;
		withShiftAltGrIsDeadKey?: boolean;

	};
}

interface ISerializedMapping {
	[key: string]: (string | number)[];
}

export interface IKeymapInfo {
	layout: IKeyboardLayoutInfo;
	secondaryLayouts: IKeyboardLayoutInfo[];
	mapping: ISerializedMapping;
	isUserKeyboardLayout?: boolean;
}

export class KeymapInfo {
	mapping: IRawMixedKeyboardMapping;
	isUserKeyboardLayout: boolean;

	constructor(public layout: IKeyboardLayoutInfo, public secondaryLayouts: IKeyboardLayoutInfo[], keyboardMapping: ISerializedMapping, isUserKeyboardLayout?: boolean) {
		this.mapping = deserializeMapping(keyboardMapping);
		this.isUserKeyboardLayout = !!isUserKeyboardLayout;
		this.layout.isUserKeyboardLayout = !!isUserKeyboardLayout;
	}

	static createKeyboardLayoutFromDebugInfo(layout: IKeyboardLayoutInfo, value: IRawMixedKeyboardMapping, isUserKeyboardLayout?: boolean): KeymapInfo {
		const keyboardLayoutInfo = new KeymapInfo(layout, [], {}, true);
		keyboardLayoutInfo.mapping = value;
		return keyboardLayoutInfo;
	}

	update(other: KeymapInfo) {
		this.layout = other.layout;
		this.secondaryLayouts = other.secondaryLayouts;
		this.mapping = other.mapping;
		this.isUserKeyboardLayout = other.isUserKeyboardLayout;
		this.layout.isUserKeyboardLayout = other.isUserKeyboardLayout;
	}

	getScore(other: IRawMixedKeyboardMapping): number {
		let score = 0;
		for (const key in other) {
			if (isWindows && (key === 'Backslash' || key === 'KeyQ')) {
				// keymap from Chromium is probably wrong.
				continue;
			}

			if (isLinux && (key === 'Backspace' || key === 'Escape')) {
				// native keymap doesn't align with keyboard event
				continue;
			}

			const currentMapping = this.mapping[key];

			if (currentMapping === undefined) {
				score -= 1;
			}

			const otherMapping = other[key];

			if (currentMapping && otherMapping && currentMapping.value !== otherMapping.value) {
				score -= 1;
			}
		}

		return score;
	}

	equal(other: KeymapInfo): boolean {
		if (this.isUserKeyboardLayout !== other.isUserKeyboardLayout) {
			return false;
		}

		if (getKeyboardLayoutId(this.layout) !== getKeyboardLayoutId(other.layout)) {
			return false;
		}

		return this.fuzzyEqual(other.mapping);
	}

	fuzzyEqual(other: IRawMixedKeyboardMapping): boolean {
		for (const key in other) {
			if (isWindows && (key === 'Backslash' || key === 'KeyQ')) {
				// keymap from Chromium is probably wrong.
				continue;
			}
			if (this.mapping[key] === undefined) {
				return false;
			}

			const currentMapping = this.mapping[key];
			const otherMapping = other[key];

			if (currentMapping.value !== otherMapping.value) {
				return false;
			}
		}

		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/common/macLinuxKeyboardMapper.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/macLinuxKeyboardMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { KeyCode, KeyCodeUtils, IMMUTABLE_CODE_TO_KEY_CODE, IMMUTABLE_KEY_CODE_TO_CODE, ScanCode, ScanCodeUtils, isModifierKey } from '../../../../base/common/keyCodes.js';
import { ResolvedKeybinding, KeyCodeChord, SingleModifierChord, ScanCodeChord, Keybinding, Chord } from '../../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { IKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { BaseResolvedKeybinding } from '../../../../platform/keybinding/common/baseResolvedKeybinding.js';
import { IMacLinuxKeyboardMapping, IMacLinuxKeyMapping } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';

/**
 * A map from character to key codes.
 * e.g. Contains entries such as:
 *  - '/' => { keyCode: KeyCode.US_SLASH, shiftKey: false }
 *  - '?' => { keyCode: KeyCode.US_SLASH, shiftKey: true }
 */
const CHAR_CODE_TO_KEY_CODE: ({ keyCode: KeyCode; shiftKey: boolean } | null)[] = [];

export class NativeResolvedKeybinding extends BaseResolvedKeybinding<ScanCodeChord> {

	private readonly _mapper: MacLinuxKeyboardMapper;

	constructor(mapper: MacLinuxKeyboardMapper, os: OperatingSystem, chords: ScanCodeChord[]) {
		super(os, chords);
		this._mapper = mapper;
	}

	protected _getLabel(chord: ScanCodeChord): string | null {
		return this._mapper.getUILabelForScanCodeChord(chord);
	}

	protected _getAriaLabel(chord: ScanCodeChord): string | null {
		return this._mapper.getAriaLabelForScanCodeChord(chord);
	}

	protected _getElectronAccelerator(chord: ScanCodeChord): string | null {
		return this._mapper.getElectronAcceleratorLabelForScanCodeChord(chord);
	}

	protected _getUserSettingsLabel(chord: ScanCodeChord): string | null {
		return this._mapper.getUserSettingsLabelForScanCodeChord(chord);
	}

	protected _isWYSIWYG(binding: ScanCodeChord | null): boolean {
		if (!binding) {
			return true;
		}
		if (IMMUTABLE_CODE_TO_KEY_CODE[binding.scanCode] !== KeyCode.DependsOnKbLayout) {
			return true;
		}
		const a = this._mapper.getAriaLabelForScanCodeChord(binding);
		const b = this._mapper.getUserSettingsLabelForScanCodeChord(binding);

		if (!a && !b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return (a.toLowerCase() === b.toLowerCase());
	}

	protected _getChordDispatch(chord: ScanCodeChord): string | null {
		return this._mapper.getDispatchStrForScanCodeChord(chord);
	}

	protected _getSingleModifierChordDispatch(chord: ScanCodeChord): SingleModifierChord | null {
		if ((chord.scanCode === ScanCode.ControlLeft || chord.scanCode === ScanCode.ControlRight) && !chord.shiftKey && !chord.altKey && !chord.metaKey) {
			return 'ctrl';
		}
		if ((chord.scanCode === ScanCode.AltLeft || chord.scanCode === ScanCode.AltRight) && !chord.ctrlKey && !chord.shiftKey && !chord.metaKey) {
			return 'alt';
		}
		if ((chord.scanCode === ScanCode.ShiftLeft || chord.scanCode === ScanCode.ShiftRight) && !chord.ctrlKey && !chord.altKey && !chord.metaKey) {
			return 'shift';
		}
		if ((chord.scanCode === ScanCode.MetaLeft || chord.scanCode === ScanCode.MetaRight) && !chord.ctrlKey && !chord.shiftKey && !chord.altKey) {
			return 'meta';
		}
		return null;
	}
}

interface IScanCodeMapping {
	scanCode: ScanCode;
	value: number;
	withShift: number;
	withAltGr: number;
	withShiftAltGr: number;
}

class ScanCodeCombo {
	public readonly ctrlKey: boolean;
	public readonly shiftKey: boolean;
	public readonly altKey: boolean;
	public readonly scanCode: ScanCode;

	constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, scanCode: ScanCode) {
		this.ctrlKey = ctrlKey;
		this.shiftKey = shiftKey;
		this.altKey = altKey;
		this.scanCode = scanCode;
	}

	public toString(): string {
		return `${this.ctrlKey ? 'Ctrl+' : ''}${this.shiftKey ? 'Shift+' : ''}${this.altKey ? 'Alt+' : ''}${ScanCodeUtils.toString(this.scanCode)}`;
	}

	public equals(other: ScanCodeCombo): boolean {
		return (
			this.ctrlKey === other.ctrlKey
			&& this.shiftKey === other.shiftKey
			&& this.altKey === other.altKey
			&& this.scanCode === other.scanCode
		);
	}

	private getProducedCharCode(mapping: IMacLinuxKeyMapping): string {
		if (!mapping) {
			return '';
		}
		if (this.ctrlKey && this.shiftKey && this.altKey) {
			return mapping.withShiftAltGr;
		}
		if (this.ctrlKey && this.altKey) {
			return mapping.withAltGr;
		}
		if (this.shiftKey) {
			return mapping.withShift;
		}
		return mapping.value;
	}

	public getProducedChar(mapping: IMacLinuxKeyMapping): string {
		const charCode = MacLinuxKeyboardMapper.getCharCode(this.getProducedCharCode(mapping));
		if (charCode === 0) {
			return ' --- ';
		}
		if (charCode >= CharCode.U_Combining_Grave_Accent && charCode <= CharCode.U_Combining_Latin_Small_Letter_X) {
			// combining
			return 'U+' + charCode.toString(16);
		}
		return '  ' + String.fromCharCode(charCode) + '  ';
	}
}

class KeyCodeCombo {
	public readonly ctrlKey: boolean;
	public readonly shiftKey: boolean;
	public readonly altKey: boolean;
	public readonly keyCode: KeyCode;

	constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, keyCode: KeyCode) {
		this.ctrlKey = ctrlKey;
		this.shiftKey = shiftKey;
		this.altKey = altKey;
		this.keyCode = keyCode;
	}

	public toString(): string {
		return `${this.ctrlKey ? 'Ctrl+' : ''}${this.shiftKey ? 'Shift+' : ''}${this.altKey ? 'Alt+' : ''}${KeyCodeUtils.toString(this.keyCode)}`;
	}
}

class ScanCodeKeyCodeMapper {

	/**
	 * ScanCode combination => KeyCode combination.
	 * Only covers relevant modifiers ctrl, shift, alt (since meta does not influence the mappings).
	 */
	private readonly _scanCodeToKeyCode: number[][] = [];
	/**
	 * inverse of `_scanCodeToKeyCode`.
	 * KeyCode combination => ScanCode combination.
	 * Only covers relevant modifiers ctrl, shift, alt (since meta does not influence the mappings).
	 */
	private readonly _keyCodeToScanCode: number[][] = [];

	constructor() {
		this._scanCodeToKeyCode = [];
		this._keyCodeToScanCode = [];
	}

	public registrationComplete(): void {
		// IntlHash and IntlBackslash are rare keys, so ensure they don't end up being the preferred...
		this._moveToEnd(ScanCode.IntlHash);
		this._moveToEnd(ScanCode.IntlBackslash);
	}

	private _moveToEnd(scanCode: ScanCode): void {
		for (let mod = 0; mod < 8; mod++) {
			const encodedKeyCodeCombos = this._scanCodeToKeyCode[(scanCode << 3) + mod];
			if (!encodedKeyCodeCombos) {
				continue;
			}
			for (let i = 0, len = encodedKeyCodeCombos.length; i < len; i++) {
				const encodedScanCodeCombos = this._keyCodeToScanCode[encodedKeyCodeCombos[i]];
				if (encodedScanCodeCombos.length === 1) {
					continue;
				}
				for (let j = 0, len = encodedScanCodeCombos.length; j < len; j++) {
					const entry = encodedScanCodeCombos[j];
					const entryScanCode = (entry >>> 3);
					if (entryScanCode === scanCode) {
						// Move this entry to the end
						for (let k = j + 1; k < len; k++) {
							encodedScanCodeCombos[k - 1] = encodedScanCodeCombos[k];
						}
						encodedScanCodeCombos[len - 1] = entry;
					}
				}
			}
		}
	}

	public registerIfUnknown(scanCodeCombo: ScanCodeCombo, keyCodeCombo: KeyCodeCombo): void {
		if (keyCodeCombo.keyCode === KeyCode.Unknown) {
			return;
		}
		const scanCodeComboEncoded = this._encodeScanCodeCombo(scanCodeCombo);
		const keyCodeComboEncoded = this._encodeKeyCodeCombo(keyCodeCombo);

		const keyCodeIsDigit = (keyCodeCombo.keyCode >= KeyCode.Digit0 && keyCodeCombo.keyCode <= KeyCode.Digit9);
		const keyCodeIsLetter = (keyCodeCombo.keyCode >= KeyCode.KeyA && keyCodeCombo.keyCode <= KeyCode.KeyZ);

		const existingKeyCodeCombos = this._scanCodeToKeyCode[scanCodeComboEncoded];

		// Allow a scan code to map to multiple key codes if it is a digit or a letter key code
		if (keyCodeIsDigit || keyCodeIsLetter) {
			// Only check that we don't insert the same entry twice
			if (existingKeyCodeCombos) {
				for (let i = 0, len = existingKeyCodeCombos.length; i < len; i++) {
					if (existingKeyCodeCombos[i] === keyCodeComboEncoded) {
						// avoid duplicates
						return;
					}
				}
			}
		} else {
			// Don't allow multiples
			if (existingKeyCodeCombos && existingKeyCodeCombos.length !== 0) {
				return;
			}
		}

		this._scanCodeToKeyCode[scanCodeComboEncoded] = this._scanCodeToKeyCode[scanCodeComboEncoded] || [];
		this._scanCodeToKeyCode[scanCodeComboEncoded].unshift(keyCodeComboEncoded);

		this._keyCodeToScanCode[keyCodeComboEncoded] = this._keyCodeToScanCode[keyCodeComboEncoded] || [];
		this._keyCodeToScanCode[keyCodeComboEncoded].unshift(scanCodeComboEncoded);
	}

	public lookupKeyCodeCombo(keyCodeCombo: KeyCodeCombo): ScanCodeCombo[] {
		const keyCodeComboEncoded = this._encodeKeyCodeCombo(keyCodeCombo);
		const scanCodeCombosEncoded = this._keyCodeToScanCode[keyCodeComboEncoded];
		if (!scanCodeCombosEncoded || scanCodeCombosEncoded.length === 0) {
			return [];
		}

		const result: ScanCodeCombo[] = [];
		for (let i = 0, len = scanCodeCombosEncoded.length; i < len; i++) {
			const scanCodeComboEncoded = scanCodeCombosEncoded[i];

			const ctrlKey = (scanCodeComboEncoded & 0b001) ? true : false;
			const shiftKey = (scanCodeComboEncoded & 0b010) ? true : false;
			const altKey = (scanCodeComboEncoded & 0b100) ? true : false;
			const scanCode: ScanCode = (scanCodeComboEncoded >>> 3);

			result[i] = new ScanCodeCombo(ctrlKey, shiftKey, altKey, scanCode);
		}
		return result;
	}

	public lookupScanCodeCombo(scanCodeCombo: ScanCodeCombo): KeyCodeCombo[] {
		const scanCodeComboEncoded = this._encodeScanCodeCombo(scanCodeCombo);
		const keyCodeCombosEncoded = this._scanCodeToKeyCode[scanCodeComboEncoded];
		if (!keyCodeCombosEncoded || keyCodeCombosEncoded.length === 0) {
			return [];
		}

		const result: KeyCodeCombo[] = [];
		for (let i = 0, len = keyCodeCombosEncoded.length; i < len; i++) {
			const keyCodeComboEncoded = keyCodeCombosEncoded[i];

			const ctrlKey = (keyCodeComboEncoded & 0b001) ? true : false;
			const shiftKey = (keyCodeComboEncoded & 0b010) ? true : false;
			const altKey = (keyCodeComboEncoded & 0b100) ? true : false;
			const keyCode: KeyCode = (keyCodeComboEncoded >>> 3);

			result[i] = new KeyCodeCombo(ctrlKey, shiftKey, altKey, keyCode);
		}
		return result;
	}

	public guessStableKeyCode(scanCode: ScanCode): KeyCode {
		if (scanCode >= ScanCode.Digit1 && scanCode <= ScanCode.Digit0) {
			// digits are ok
			switch (scanCode) {
				case ScanCode.Digit1: return KeyCode.Digit1;
				case ScanCode.Digit2: return KeyCode.Digit2;
				case ScanCode.Digit3: return KeyCode.Digit3;
				case ScanCode.Digit4: return KeyCode.Digit4;
				case ScanCode.Digit5: return KeyCode.Digit5;
				case ScanCode.Digit6: return KeyCode.Digit6;
				case ScanCode.Digit7: return KeyCode.Digit7;
				case ScanCode.Digit8: return KeyCode.Digit8;
				case ScanCode.Digit9: return KeyCode.Digit9;
				case ScanCode.Digit0: return KeyCode.Digit0;
			}
		}

		// Lookup the scanCode with and without shift and see if the keyCode is stable
		const keyCodeCombos1 = this.lookupScanCodeCombo(new ScanCodeCombo(false, false, false, scanCode));
		const keyCodeCombos2 = this.lookupScanCodeCombo(new ScanCodeCombo(false, true, false, scanCode));
		if (keyCodeCombos1.length === 1 && keyCodeCombos2.length === 1) {
			const shiftKey1 = keyCodeCombos1[0].shiftKey;
			const keyCode1 = keyCodeCombos1[0].keyCode;
			const shiftKey2 = keyCodeCombos2[0].shiftKey;
			const keyCode2 = keyCodeCombos2[0].keyCode;
			if (keyCode1 === keyCode2 && shiftKey1 !== shiftKey2) {
				// This looks like a stable mapping
				return keyCode1;
			}
		}

		return KeyCode.DependsOnKbLayout;
	}

	private _encodeScanCodeCombo(scanCodeCombo: ScanCodeCombo): number {
		return this._encode(scanCodeCombo.ctrlKey, scanCodeCombo.shiftKey, scanCodeCombo.altKey, scanCodeCombo.scanCode);
	}

	private _encodeKeyCodeCombo(keyCodeCombo: KeyCodeCombo): number {
		return this._encode(keyCodeCombo.ctrlKey, keyCodeCombo.shiftKey, keyCodeCombo.altKey, keyCodeCombo.keyCode);
	}

	private _encode(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, principal: number): number {
		return (
			((ctrlKey ? 1 : 0) << 0)
			| ((shiftKey ? 1 : 0) << 1)
			| ((altKey ? 1 : 0) << 2)
			| principal << 3
		) >>> 0;
	}
}

export class MacLinuxKeyboardMapper implements IKeyboardMapper {

	/**
	 * used only for debug purposes.
	 */
	private readonly _codeInfo: IMacLinuxKeyMapping[];
	/**
	 * Maps ScanCode combos <-> KeyCode combos.
	 */
	private readonly _scanCodeKeyCodeMapper: ScanCodeKeyCodeMapper;
	/**
	 * UI label for a ScanCode.
	 */
	private readonly _scanCodeToLabel: Array<string | null> = [];
	/**
	 * Dispatching string for a ScanCode.
	 */
	private readonly _scanCodeToDispatch: Array<string | null> = [];

	constructor(
		private readonly _isUSStandard: boolean,
		rawMappings: IMacLinuxKeyboardMapping,
		private readonly _mapAltGrToCtrlAlt: boolean,
		private readonly _OS: OperatingSystem,
	) {
		this._codeInfo = [];
		this._scanCodeKeyCodeMapper = new ScanCodeKeyCodeMapper();
		this._scanCodeToLabel = [];
		this._scanCodeToDispatch = [];

		const _registerIfUnknown = (
			hwCtrlKey: 0 | 1, hwShiftKey: 0 | 1, hwAltKey: 0 | 1, scanCode: ScanCode,
			kbCtrlKey: 0 | 1, kbShiftKey: 0 | 1, kbAltKey: 0 | 1, keyCode: KeyCode,
		): void => {
			this._scanCodeKeyCodeMapper.registerIfUnknown(
				new ScanCodeCombo(hwCtrlKey ? true : false, hwShiftKey ? true : false, hwAltKey ? true : false, scanCode),
				new KeyCodeCombo(kbCtrlKey ? true : false, kbShiftKey ? true : false, kbAltKey ? true : false, keyCode)
			);
		};

		const _registerAllCombos = (_ctrlKey: 0 | 1, _shiftKey: 0 | 1, _altKey: 0 | 1, scanCode: ScanCode, keyCode: KeyCode): void => {
			for (let ctrlKey = _ctrlKey; ctrlKey <= 1; ctrlKey++) {
				for (let shiftKey = _shiftKey; shiftKey <= 1; shiftKey++) {
					for (let altKey = _altKey; altKey <= 1; altKey++) {
						_registerIfUnknown(
							ctrlKey, shiftKey, altKey, scanCode,
							ctrlKey, shiftKey, altKey, keyCode
						);
					}
				}
			}
		};

		// Initialize `_scanCodeToLabel`
		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			this._scanCodeToLabel[scanCode] = null;
		}

		// Initialize `_scanCodeToDispatch`
		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			this._scanCodeToDispatch[scanCode] = null;
		}

		// Handle immutable mappings
		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			const keyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
			if (keyCode !== KeyCode.DependsOnKbLayout) {
				_registerAllCombos(0, 0, 0, scanCode, keyCode);
				this._scanCodeToLabel[scanCode] = KeyCodeUtils.toString(keyCode);

				if (keyCode === KeyCode.Unknown || isModifierKey(keyCode)) {
					this._scanCodeToDispatch[scanCode] = null; // cannot dispatch on this ScanCode
				} else {
					this._scanCodeToDispatch[scanCode] = `[${ScanCodeUtils.toString(scanCode)}]`;
				}
			}
		}

		// Try to identify keyboard layouts where characters A-Z are missing
		// and forcibly map them to their corresponding scan codes if that is the case
		const missingLatinLettersOverride: { [scanCode: string]: IMacLinuxKeyMapping } = {};

		{
			const producesLatinLetter: boolean[] = [];
			for (const strScanCode in rawMappings) {
				if (rawMappings.hasOwnProperty(strScanCode)) {
					const scanCode = ScanCodeUtils.toEnum(strScanCode);
					if (scanCode === ScanCode.None) {
						continue;
					}
					if (IMMUTABLE_CODE_TO_KEY_CODE[scanCode] !== KeyCode.DependsOnKbLayout) {
						continue;
					}

					const rawMapping = rawMappings[strScanCode];
					const value = MacLinuxKeyboardMapper.getCharCode(rawMapping.value);

					if (value >= CharCode.a && value <= CharCode.z) {
						const upperCaseValue = CharCode.A + (value - CharCode.a);
						producesLatinLetter[upperCaseValue] = true;
					}
				}
			}

			const _registerLetterIfMissing = (charCode: CharCode, scanCode: ScanCode, value: string, withShift: string): void => {
				if (!producesLatinLetter[charCode]) {
					missingLatinLettersOverride[ScanCodeUtils.toString(scanCode)] = {
						value: value,
						withShift: withShift,
						withAltGr: '',
						withShiftAltGr: ''
					};
				}
			};

			// Ensure letters are mapped
			_registerLetterIfMissing(CharCode.A, ScanCode.KeyA, 'a', 'A');
			_registerLetterIfMissing(CharCode.B, ScanCode.KeyB, 'b', 'B');
			_registerLetterIfMissing(CharCode.C, ScanCode.KeyC, 'c', 'C');
			_registerLetterIfMissing(CharCode.D, ScanCode.KeyD, 'd', 'D');
			_registerLetterIfMissing(CharCode.E, ScanCode.KeyE, 'e', 'E');
			_registerLetterIfMissing(CharCode.F, ScanCode.KeyF, 'f', 'F');
			_registerLetterIfMissing(CharCode.G, ScanCode.KeyG, 'g', 'G');
			_registerLetterIfMissing(CharCode.H, ScanCode.KeyH, 'h', 'H');
			_registerLetterIfMissing(CharCode.I, ScanCode.KeyI, 'i', 'I');
			_registerLetterIfMissing(CharCode.J, ScanCode.KeyJ, 'j', 'J');
			_registerLetterIfMissing(CharCode.K, ScanCode.KeyK, 'k', 'K');
			_registerLetterIfMissing(CharCode.L, ScanCode.KeyL, 'l', 'L');
			_registerLetterIfMissing(CharCode.M, ScanCode.KeyM, 'm', 'M');
			_registerLetterIfMissing(CharCode.N, ScanCode.KeyN, 'n', 'N');
			_registerLetterIfMissing(CharCode.O, ScanCode.KeyO, 'o', 'O');
			_registerLetterIfMissing(CharCode.P, ScanCode.KeyP, 'p', 'P');
			_registerLetterIfMissing(CharCode.Q, ScanCode.KeyQ, 'q', 'Q');
			_registerLetterIfMissing(CharCode.R, ScanCode.KeyR, 'r', 'R');
			_registerLetterIfMissing(CharCode.S, ScanCode.KeyS, 's', 'S');
			_registerLetterIfMissing(CharCode.T, ScanCode.KeyT, 't', 'T');
			_registerLetterIfMissing(CharCode.U, ScanCode.KeyU, 'u', 'U');
			_registerLetterIfMissing(CharCode.V, ScanCode.KeyV, 'v', 'V');
			_registerLetterIfMissing(CharCode.W, ScanCode.KeyW, 'w', 'W');
			_registerLetterIfMissing(CharCode.X, ScanCode.KeyX, 'x', 'X');
			_registerLetterIfMissing(CharCode.Y, ScanCode.KeyY, 'y', 'Y');
			_registerLetterIfMissing(CharCode.Z, ScanCode.KeyZ, 'z', 'Z');
		}

		const mappings: IScanCodeMapping[] = [];
		let mappingsLen = 0;
		for (const strScanCode in rawMappings) {
			if (rawMappings.hasOwnProperty(strScanCode)) {
				const scanCode = ScanCodeUtils.toEnum(strScanCode);
				if (scanCode === ScanCode.None) {
					continue;
				}
				if (IMMUTABLE_CODE_TO_KEY_CODE[scanCode] !== KeyCode.DependsOnKbLayout) {
					continue;
				}

				this._codeInfo[scanCode] = rawMappings[strScanCode];

				const rawMapping = missingLatinLettersOverride[strScanCode] || rawMappings[strScanCode];
				const value = MacLinuxKeyboardMapper.getCharCode(rawMapping.value);
				const withShift = MacLinuxKeyboardMapper.getCharCode(rawMapping.withShift);
				const withAltGr = MacLinuxKeyboardMapper.getCharCode(rawMapping.withAltGr);
				const withShiftAltGr = MacLinuxKeyboardMapper.getCharCode(rawMapping.withShiftAltGr);

				const mapping: IScanCodeMapping = {
					scanCode: scanCode,
					value: value,
					withShift: withShift,
					withAltGr: withAltGr,
					withShiftAltGr: withShiftAltGr,
				};
				mappings[mappingsLen++] = mapping;

				this._scanCodeToDispatch[scanCode] = `[${ScanCodeUtils.toString(scanCode)}]`;

				if (value >= CharCode.a && value <= CharCode.z) {
					const upperCaseValue = CharCode.A + (value - CharCode.a);
					this._scanCodeToLabel[scanCode] = String.fromCharCode(upperCaseValue);
				} else if (value >= CharCode.A && value <= CharCode.Z) {
					this._scanCodeToLabel[scanCode] = String.fromCharCode(value);
				} else if (value) {
					this._scanCodeToLabel[scanCode] = String.fromCharCode(value);
				} else {
					this._scanCodeToLabel[scanCode] = null;
				}
			}
		}

		// Handle all `withShiftAltGr` entries
		for (let i = mappings.length - 1; i >= 0; i--) {
			const mapping = mappings[i];
			const scanCode = mapping.scanCode;
			const withShiftAltGr = mapping.withShiftAltGr;
			if (withShiftAltGr === mapping.withAltGr || withShiftAltGr === mapping.withShift || withShiftAltGr === mapping.value) {
				// handled below
				continue;
			}
			const kb = MacLinuxKeyboardMapper._charCodeToKb(withShiftAltGr);
			if (!kb) {
				continue;
			}
			const kbShiftKey = kb.shiftKey;
			const keyCode = kb.keyCode;

			if (kbShiftKey) {
				// Ctrl+Shift+Alt+ScanCode => Shift+KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 0, 1, 0, keyCode); //       Ctrl+Alt+ScanCode =>          Shift+KeyCode
			} else {
				// Ctrl+Shift+Alt+ScanCode => KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 0, 0, 0, keyCode); //       Ctrl+Alt+ScanCode =>                KeyCode
			}
		}
		// Handle all `withAltGr` entries
		for (let i = mappings.length - 1; i >= 0; i--) {
			const mapping = mappings[i];
			const scanCode = mapping.scanCode;
			const withAltGr = mapping.withAltGr;
			if (withAltGr === mapping.withShift || withAltGr === mapping.value) {
				// handled below
				continue;
			}
			const kb = MacLinuxKeyboardMapper._charCodeToKb(withAltGr);
			if (!kb) {
				continue;
			}
			const kbShiftKey = kb.shiftKey;
			const keyCode = kb.keyCode;

			if (kbShiftKey) {
				// Ctrl+Alt+ScanCode => Shift+KeyCode
				_registerIfUnknown(1, 0, 1, scanCode, 0, 1, 0, keyCode); //       Ctrl+Alt+ScanCode =>          Shift+KeyCode
			} else {
				// Ctrl+Alt+ScanCode => KeyCode
				_registerIfUnknown(1, 0, 1, scanCode, 0, 0, 0, keyCode); //       Ctrl+Alt+ScanCode =>                KeyCode
			}
		}
		// Handle all `withShift` entries
		for (let i = mappings.length - 1; i >= 0; i--) {
			const mapping = mappings[i];
			const scanCode = mapping.scanCode;
			const withShift = mapping.withShift;
			if (withShift === mapping.value) {
				// handled below
				continue;
			}
			const kb = MacLinuxKeyboardMapper._charCodeToKb(withShift);
			if (!kb) {
				continue;
			}
			const kbShiftKey = kb.shiftKey;
			const keyCode = kb.keyCode;

			if (kbShiftKey) {
				// Shift+ScanCode => Shift+KeyCode
				_registerIfUnknown(0, 1, 0, scanCode, 0, 1, 0, keyCode); //          Shift+ScanCode =>          Shift+KeyCode
				_registerIfUnknown(0, 1, 1, scanCode, 0, 1, 1, keyCode); //      Shift+Alt+ScanCode =>      Shift+Alt+KeyCode
				_registerIfUnknown(1, 1, 0, scanCode, 1, 1, 0, keyCode); //     Ctrl+Shift+ScanCode =>     Ctrl+Shift+KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 1, 1, 1, keyCode); // Ctrl+Shift+Alt+ScanCode => Ctrl+Shift+Alt+KeyCode
			} else {
				// Shift+ScanCode => KeyCode
				_registerIfUnknown(0, 1, 0, scanCode, 0, 0, 0, keyCode); //          Shift+ScanCode =>                KeyCode
				_registerIfUnknown(0, 1, 0, scanCode, 0, 1, 0, keyCode); //          Shift+ScanCode =>          Shift+KeyCode
				_registerIfUnknown(0, 1, 1, scanCode, 0, 0, 1, keyCode); //      Shift+Alt+ScanCode =>            Alt+KeyCode
				_registerIfUnknown(0, 1, 1, scanCode, 0, 1, 1, keyCode); //      Shift+Alt+ScanCode =>      Shift+Alt+KeyCode
				_registerIfUnknown(1, 1, 0, scanCode, 1, 0, 0, keyCode); //     Ctrl+Shift+ScanCode =>           Ctrl+KeyCode
				_registerIfUnknown(1, 1, 0, scanCode, 1, 1, 0, keyCode); //     Ctrl+Shift+ScanCode =>     Ctrl+Shift+KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 1, 0, 1, keyCode); // Ctrl+Shift+Alt+ScanCode =>       Ctrl+Alt+KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 1, 1, 1, keyCode); // Ctrl+Shift+Alt+ScanCode => Ctrl+Shift+Alt+KeyCode
			}
		}
		// Handle all `value` entries
		for (let i = mappings.length - 1; i >= 0; i--) {
			const mapping = mappings[i];
			const scanCode = mapping.scanCode;
			const kb = MacLinuxKeyboardMapper._charCodeToKb(mapping.value);
			if (!kb) {
				continue;
			}
			const kbShiftKey = kb.shiftKey;
			const keyCode = kb.keyCode;

			if (kbShiftKey) {
				// ScanCode => Shift+KeyCode
				_registerIfUnknown(0, 0, 0, scanCode, 0, 1, 0, keyCode); //                ScanCode =>          Shift+KeyCode
				_registerIfUnknown(0, 0, 1, scanCode, 0, 1, 1, keyCode); //            Alt+ScanCode =>      Shift+Alt+KeyCode
				_registerIfUnknown(1, 0, 0, scanCode, 1, 1, 0, keyCode); //           Ctrl+ScanCode =>     Ctrl+Shift+KeyCode
				_registerIfUnknown(1, 0, 1, scanCode, 1, 1, 1, keyCode); //       Ctrl+Alt+ScanCode => Ctrl+Shift+Alt+KeyCode
			} else {
				// ScanCode => KeyCode
				_registerIfUnknown(0, 0, 0, scanCode, 0, 0, 0, keyCode); //                ScanCode =>                KeyCode
				_registerIfUnknown(0, 0, 1, scanCode, 0, 0, 1, keyCode); //            Alt+ScanCode =>            Alt+KeyCode
				_registerIfUnknown(0, 1, 0, scanCode, 0, 1, 0, keyCode); //          Shift+ScanCode =>          Shift+KeyCode
				_registerIfUnknown(0, 1, 1, scanCode, 0, 1, 1, keyCode); //      Shift+Alt+ScanCode =>      Shift+Alt+KeyCode
				_registerIfUnknown(1, 0, 0, scanCode, 1, 0, 0, keyCode); //           Ctrl+ScanCode =>           Ctrl+KeyCode
				_registerIfUnknown(1, 0, 1, scanCode, 1, 0, 1, keyCode); //       Ctrl+Alt+ScanCode =>       Ctrl+Alt+KeyCode
				_registerIfUnknown(1, 1, 0, scanCode, 1, 1, 0, keyCode); //     Ctrl+Shift+ScanCode =>     Ctrl+Shift+KeyCode
				_registerIfUnknown(1, 1, 1, scanCode, 1, 1, 1, keyCode); // Ctrl+Shift+Alt+ScanCode => Ctrl+Shift+Alt+KeyCode
			}
		}
		// Handle all left-over available digits
		_registerAllCombos(0, 0, 0, ScanCode.Digit1, KeyCode.Digit1);
		_registerAllCombos(0, 0, 0, ScanCode.Digit2, KeyCode.Digit2);
		_registerAllCombos(0, 0, 0, ScanCode.Digit3, KeyCode.Digit3);
		_registerAllCombos(0, 0, 0, ScanCode.Digit4, KeyCode.Digit4);
		_registerAllCombos(0, 0, 0, ScanCode.Digit5, KeyCode.Digit5);
		_registerAllCombos(0, 0, 0, ScanCode.Digit6, KeyCode.Digit6);
		_registerAllCombos(0, 0, 0, ScanCode.Digit7, KeyCode.Digit7);
		_registerAllCombos(0, 0, 0, ScanCode.Digit8, KeyCode.Digit8);
		_registerAllCombos(0, 0, 0, ScanCode.Digit9, KeyCode.Digit9);
		_registerAllCombos(0, 0, 0, ScanCode.Digit0, KeyCode.Digit0);

		this._scanCodeKeyCodeMapper.registrationComplete();
	}

	public dumpDebugInfo(): string {
		const result: string[] = [];

		const immutableSamples = [
			ScanCode.ArrowUp,
			ScanCode.Numpad0
		];

		let cnt = 0;
		result.push(`isUSStandard: ${this._isUSStandard}`);
		result.push(`----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			if (IMMUTABLE_CODE_TO_KEY_CODE[scanCode] !== KeyCode.DependsOnKbLayout) {
				if (immutableSamples.indexOf(scanCode) === -1) {
					continue;
				}
			}

			if (cnt % 4 === 0) {
				result.push(`|       HW Code combination      |  Key  |    KeyCode combination    | Pri |          UI label         |         User settings          |    Electron accelerator   |       Dispatching string       | WYSIWYG |`);
				result.push(`----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
			}
			cnt++;

			const mapping = this._codeInfo[scanCode];

			for (let mod = 0; mod < 8; mod++) {
				const hwCtrlKey = (mod & 0b001) ? true : false;
				const hwShiftKey = (mod & 0b010) ? true : false;
				const hwAltKey = (mod & 0b100) ? true : false;
				const scanCodeCombo = new ScanCodeCombo(hwCtrlKey, hwShiftKey, hwAltKey, scanCode);
				const resolvedKb = this.resolveKeyboardEvent({
					_standardKeyboardEventBrand: true,
					ctrlKey: scanCodeCombo.ctrlKey,
					shiftKey: scanCodeCombo.shiftKey,
					altKey: scanCodeCombo.altKey,
					metaKey: false,
					altGraphKey: false,
					keyCode: KeyCode.DependsOnKbLayout,
					code: ScanCodeUtils.toString(scanCode)
				});

				const outScanCodeCombo = scanCodeCombo.toString();
				const outKey = scanCodeCombo.getProducedChar(mapping);
				const ariaLabel = resolvedKb.getAriaLabel();
				const outUILabel = (ariaLabel ? ariaLabel.replace(/Control\+/, 'Ctrl+') : null);
				const outUserSettings = resolvedKb.getUserSettingsLabel();
				const outElectronAccelerator = resolvedKb.getElectronAccelerator();
				const outDispatchStr = resolvedKb.getDispatchChords()[0];

				const isWYSIWYG = (resolvedKb ? resolvedKb.isWYSIWYG() : false);
				const outWYSIWYG = (isWYSIWYG ? '       ' : '   NO  ');

				const kbCombos = this._scanCodeKeyCodeMapper.lookupScanCodeCombo(scanCodeCombo);
				if (kbCombos.length === 0) {
					result.push(`| ${this._leftPad(outScanCodeCombo, 30)} | ${outKey} | ${this._leftPad('', 25)} | ${this._leftPad('', 3)} | ${this._leftPad(outUILabel, 25)} | ${this._leftPad(outUserSettings, 30)} | ${this._leftPad(outElectronAccelerator, 25)} | ${this._leftPad(outDispatchStr, 30)} | ${outWYSIWYG} |`);
				} else {
					for (let i = 0, len = kbCombos.length; i < len; i++) {
						const kbCombo = kbCombos[i];
						// find out the priority of this scan code for this key code
						let colPriority: string;

						const scanCodeCombos = this._scanCodeKeyCodeMapper.lookupKeyCodeCombo(kbCombo);
						if (scanCodeCombos.length === 1) {
							// no need for priority, this key code combo maps to precisely this scan code combo
							colPriority = '';
						} else {
							let priority = -1;
							for (let j = 0; j < scanCodeCombos.length; j++) {
								if (scanCodeCombos[j].equals(scanCodeCombo)) {
									priority = j + 1;
									break;
								}
							}
							colPriority = String(priority);
						}

						const outKeybinding = kbCombo.toString();
						if (i === 0) {
							result.push(`| ${this._leftPad(outScanCodeCombo, 30)} | ${outKey} | ${this._leftPad(outKeybinding, 25)} | ${this._leftPad(colPriority, 3)} | ${this._leftPad(outUILabel, 25)} | ${this._leftPad(outUserSettings, 30)} | ${this._leftPad(outElectronAccelerator, 25)} | ${this._leftPad(outDispatchStr, 30)} | ${outWYSIWYG} |`);
						} else {
							// secondary keybindings
							result.push(`| ${this._leftPad('', 30)} |       | ${this._leftPad(outKeybinding, 25)} | ${this._leftPad(colPriority, 3)} | ${this._leftPad('', 25)} | ${this._leftPad('', 30)} | ${this._leftPad('', 25)} | ${this._leftPad('', 30)} |         |`);
						}
					}
				}

			}
			result.push(`----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
		}

		return result.join('\n');
	}

	private _leftPad(str: string | null, cnt: number): string {
		if (str === null) {
			str = 'null';
		}
		while (str.length < cnt) {
			str = ' ' + str;
		}
		return str;
	}

	public keyCodeChordToScanCodeChord(chord: KeyCodeChord): ScanCodeChord[] {
		// Avoid double Enter bindings (both ScanCode.NumpadEnter and ScanCode.Enter point to KeyCode.Enter)
		if (chord.keyCode === KeyCode.Enter) {
			return [new ScanCodeChord(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.metaKey, ScanCode.Enter)];
		}

		const scanCodeCombos = this._scanCodeKeyCodeMapper.lookupKeyCodeCombo(
			new KeyCodeCombo(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.keyCode)
		);

		const result: ScanCodeChord[] = [];
		for (let i = 0, len = scanCodeCombos.length; i < len; i++) {
			const scanCodeCombo = scanCodeCombos[i];
			result[i] = new ScanCodeChord(scanCodeCombo.ctrlKey, scanCodeCombo.shiftKey, scanCodeCombo.altKey, chord.metaKey, scanCodeCombo.scanCode);
		}
		return result;
	}

	public getUILabelForScanCodeChord(chord: ScanCodeChord | null): string | null {
		if (!chord) {
			return null;
		}
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		if (this._OS === OperatingSystem.Macintosh) {
			switch (chord.scanCode) {
				case ScanCode.ArrowLeft:
					return '←';
				case ScanCode.ArrowUp:
					return '↑';
				case ScanCode.ArrowRight:
					return '→';
				case ScanCode.ArrowDown:
					return '↓';
			}
		}
		return this._scanCodeToLabel[chord.scanCode];
	}

	public getAriaLabelForScanCodeChord(chord: ScanCodeChord | null): string | null {
		if (!chord) {
			return null;
		}
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return this._scanCodeToLabel[chord.scanCode];
	}

	public getDispatchStrForScanCodeChord(chord: ScanCodeChord): string | null {
		const codeDispatch = this._scanCodeToDispatch[chord.scanCode];
		if (!codeDispatch) {
			return null;
		}
		let result = '';

		if (chord.ctrlKey) {
			result += 'ctrl+';
		}
		if (chord.shiftKey) {
			result += 'shift+';
		}
		if (chord.altKey) {
			result += 'alt+';
		}
		if (chord.metaKey) {
			result += 'meta+';
		}
		result += codeDispatch;

		return result;
	}

	public getUserSettingsLabelForScanCodeChord(chord: ScanCodeChord | null): string | null {
		if (!chord) {
			return null;
		}
		if (chord.isDuplicateModifierCase()) {
			return '';
		}

		const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[chord.scanCode];
		if (immutableKeyCode !== KeyCode.DependsOnKbLayout) {
			return KeyCodeUtils.toUserSettingsUS(immutableKeyCode).toLowerCase();
		}

		// Check if this scanCode always maps to the same keyCode and back
		const constantKeyCode: KeyCode = this._scanCodeKeyCodeMapper.guessStableKeyCode(chord.scanCode);
		if (constantKeyCode !== KeyCode.DependsOnKbLayout) {
			// Verify that this is a good key code that can be mapped back to the same scan code
			const reverseChords = this.keyCodeChordToScanCodeChord(new KeyCodeChord(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.metaKey, constantKeyCode));
			for (let i = 0, len = reverseChords.length; i < len; i++) {
				const reverseChord = reverseChords[i];
				if (reverseChord.scanCode === chord.scanCode) {
					return KeyCodeUtils.toUserSettingsUS(constantKeyCode).toLowerCase();
				}
			}
		}

		return this._scanCodeToDispatch[chord.scanCode];
	}

	public getElectronAcceleratorLabelForScanCodeChord(chord: ScanCodeChord | null): string | null {
		if (!chord) {
			return null;
		}

		const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[chord.scanCode];
		if (immutableKeyCode !== KeyCode.DependsOnKbLayout) {
			return KeyCodeUtils.toElectronAccelerator(immutableKeyCode);
		}

		// Check if this scanCode always maps to the same keyCode and back
		const constantKeyCode: KeyCode = this._scanCodeKeyCodeMapper.guessStableKeyCode(chord.scanCode);

		if (this._OS === OperatingSystem.Linux && !this._isUSStandard) {
			// [Electron Accelerators] On Linux, Electron does not handle correctly OEM keys.
			// when using a different keyboard layout than US Standard.
			// See https://github.com/microsoft/vscode/issues/23706
			// See https://github.com/microsoft/vscode/pull/134890#issuecomment-941671791
			const isOEMKey = (
				constantKeyCode === KeyCode.Semicolon
				|| constantKeyCode === KeyCode.Equal
				|| constantKeyCode === KeyCode.Comma
				|| constantKeyCode === KeyCode.Minus
				|| constantKeyCode === KeyCode.Period
				|| constantKeyCode === KeyCode.Slash
				|| constantKeyCode === KeyCode.Backquote
				|| constantKeyCode === KeyCode.BracketLeft
				|| constantKeyCode === KeyCode.Backslash
				|| constantKeyCode === KeyCode.BracketRight
			);

			if (isOEMKey) {
				return null;
			}
		}

		if (constantKeyCode !== KeyCode.DependsOnKbLayout) {
			return KeyCodeUtils.toElectronAccelerator(constantKeyCode);
		}

		return null;
	}

	private _toResolvedKeybinding(chordParts: ScanCodeChord[][]): NativeResolvedKeybinding[] {
		if (chordParts.length === 0) {
			return [];
		}
		const result: NativeResolvedKeybinding[] = [];
		this._generateResolvedKeybindings(chordParts, 0, [], result);
		return result;
	}

	private _generateResolvedKeybindings(chordParts: ScanCodeChord[][], currentIndex: number, previousParts: ScanCodeChord[], result: NativeResolvedKeybinding[]) {
		const chordPart = chordParts[currentIndex];
		const isFinalIndex = currentIndex === chordParts.length - 1;
		for (let i = 0, len = chordPart.length; i < len; i++) {
			const chords = [...previousParts, chordPart[i]];
			if (isFinalIndex) {
				result.push(new NativeResolvedKeybinding(this, this._OS, chords));
			} else {
				this._generateResolvedKeybindings(chordParts, currentIndex + 1, chords, result);
			}
		}
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): NativeResolvedKeybinding {
		let code = ScanCodeUtils.toEnum(keyboardEvent.code);

		// Treat NumpadEnter as Enter
		if (code === ScanCode.NumpadEnter) {
			code = ScanCode.Enter;
		}

		const keyCode = keyboardEvent.keyCode;

		if (
			(keyCode === KeyCode.LeftArrow)
			|| (keyCode === KeyCode.UpArrow)
			|| (keyCode === KeyCode.RightArrow)
			|| (keyCode === KeyCode.DownArrow)
			|| (keyCode === KeyCode.Delete)
			|| (keyCode === KeyCode.Insert)
			|| (keyCode === KeyCode.Home)
			|| (keyCode === KeyCode.End)
			|| (keyCode === KeyCode.PageDown)
			|| (keyCode === KeyCode.PageUp)
			|| (keyCode === KeyCode.Backspace)
		) {
			// "Dispatch" on keyCode for these key codes to workaround issues with remote desktoping software
			// where the scan codes appear to be incorrect (see https://github.com/microsoft/vscode/issues/24107)
			const immutableScanCode = IMMUTABLE_KEY_CODE_TO_CODE[keyCode];
			if (immutableScanCode !== ScanCode.DependsOnKbLayout) {
				code = immutableScanCode;
			}

		} else {

			if (
				(code === ScanCode.Numpad1)
				|| (code === ScanCode.Numpad2)
				|| (code === ScanCode.Numpad3)
				|| (code === ScanCode.Numpad4)
				|| (code === ScanCode.Numpad5)
				|| (code === ScanCode.Numpad6)
				|| (code === ScanCode.Numpad7)
				|| (code === ScanCode.Numpad8)
				|| (code === ScanCode.Numpad9)
				|| (code === ScanCode.Numpad0)
				|| (code === ScanCode.NumpadDecimal)
			) {
				// "Dispatch" on keyCode for all numpad keys in order for NumLock to work correctly
				if (keyCode >= 0) {
					const immutableScanCode = IMMUTABLE_KEY_CODE_TO_CODE[keyCode];
					if (immutableScanCode !== ScanCode.DependsOnKbLayout) {
						code = immutableScanCode;
					}
				}
			}
		}

		const ctrlKey = keyboardEvent.ctrlKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const altKey = keyboardEvent.altKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const chord = new ScanCodeChord(ctrlKey, keyboardEvent.shiftKey, altKey, keyboardEvent.metaKey, code);
		return new NativeResolvedKeybinding(this, this._OS, [chord]);
	}

	private _resolveChord(chord: Chord | null): ScanCodeChord[] {
		if (!chord) {
			return [];
		}
		if (chord instanceof ScanCodeChord) {
			return [chord];
		}
		return this.keyCodeChordToScanCodeChord(chord);
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		const chords: ScanCodeChord[][] = keybinding.chords.map(chord => this._resolveChord(chord));
		return this._toResolvedKeybinding(chords);
	}

	private static _redirectCharCode(charCode: number): number {
		switch (charCode) {
			// allow-any-unicode-next-line
			// CJK: 。 「 」 【 】 ； ，
			// map: . [ ] [ ] ; ,
			case CharCode.U_IDEOGRAPHIC_FULL_STOP: return CharCode.Period;
			case CharCode.U_LEFT_CORNER_BRACKET: return CharCode.OpenSquareBracket;
			case CharCode.U_RIGHT_CORNER_BRACKET: return CharCode.CloseSquareBracket;
			case CharCode.U_LEFT_BLACK_LENTICULAR_BRACKET: return CharCode.OpenSquareBracket;
			case CharCode.U_RIGHT_BLACK_LENTICULAR_BRACKET: return CharCode.CloseSquareBracket;
			case CharCode.U_FULLWIDTH_SEMICOLON: return CharCode.Semicolon;
			case CharCode.U_FULLWIDTH_COMMA: return CharCode.Comma;
		}
		return charCode;
	}

	private static _charCodeToKb(charCode: number): { keyCode: KeyCode; shiftKey: boolean } | null {
		charCode = this._redirectCharCode(charCode);
		if (charCode < CHAR_CODE_TO_KEY_CODE.length) {
			return CHAR_CODE_TO_KEY_CODE[charCode];
		}
		return null;
	}

	/**
	 * Attempt to map a combining character to a regular one that renders the same way.
	 *
	 * https://www.compart.com/en/unicode/bidiclass/NSM
	 */
	public static getCharCode(char: string): number {
		if (char.length === 0) {
			return 0;
		}
		const charCode = char.charCodeAt(0);
		switch (charCode) {
			case CharCode.U_Combining_Grave_Accent: return CharCode.U_GRAVE_ACCENT;
			case CharCode.U_Combining_Acute_Accent: return CharCode.U_ACUTE_ACCENT;
			case CharCode.U_Combining_Circumflex_Accent: return CharCode.U_CIRCUMFLEX;
			case CharCode.U_Combining_Tilde: return CharCode.U_SMALL_TILDE;
			case CharCode.U_Combining_Macron: return CharCode.U_MACRON;
			case CharCode.U_Combining_Overline: return CharCode.U_OVERLINE;
			case CharCode.U_Combining_Breve: return CharCode.U_BREVE;
			case CharCode.U_Combining_Dot_Above: return CharCode.U_DOT_ABOVE;
			case CharCode.U_Combining_Diaeresis: return CharCode.U_DIAERESIS;
			case CharCode.U_Combining_Ring_Above: return CharCode.U_RING_ABOVE;
			case CharCode.U_Combining_Double_Acute_Accent: return CharCode.U_DOUBLE_ACUTE_ACCENT;
		}
		return charCode;
	}
}

(function () {
	function define(charCode: number, keyCode: KeyCode, shiftKey: boolean): void {
		for (let i = CHAR_CODE_TO_KEY_CODE.length; i < charCode; i++) {
			CHAR_CODE_TO_KEY_CODE[i] = null;
		}
		CHAR_CODE_TO_KEY_CODE[charCode] = { keyCode: keyCode, shiftKey: shiftKey };
	}

	for (let chCode = CharCode.A; chCode <= CharCode.Z; chCode++) {
		define(chCode, KeyCode.KeyA + (chCode - CharCode.A), true);
	}

	for (let chCode = CharCode.a; chCode <= CharCode.z; chCode++) {
		define(chCode, KeyCode.KeyA + (chCode - CharCode.a), false);
	}

	define(CharCode.Semicolon, KeyCode.Semicolon, false);
	define(CharCode.Colon, KeyCode.Semicolon, true);

	define(CharCode.Equals, KeyCode.Equal, false);
	define(CharCode.Plus, KeyCode.Equal, true);

	define(CharCode.Comma, KeyCode.Comma, false);
	define(CharCode.LessThan, KeyCode.Comma, true);

	define(CharCode.Dash, KeyCode.Minus, false);
	define(CharCode.Underline, KeyCode.Minus, true);

	define(CharCode.Period, KeyCode.Period, false);
	define(CharCode.GreaterThan, KeyCode.Period, true);

	define(CharCode.Slash, KeyCode.Slash, false);
	define(CharCode.QuestionMark, KeyCode.Slash, true);

	define(CharCode.BackTick, KeyCode.Backquote, false);
	define(CharCode.Tilde, KeyCode.Backquote, true);

	define(CharCode.OpenSquareBracket, KeyCode.BracketLeft, false);
	define(CharCode.OpenCurlyBrace, KeyCode.BracketLeft, true);

	define(CharCode.Backslash, KeyCode.Backslash, false);
	define(CharCode.Pipe, KeyCode.Backslash, true);

	define(CharCode.CloseSquareBracket, KeyCode.BracketRight, false);
	define(CharCode.CloseCurlyBrace, KeyCode.BracketRight, true);

	define(CharCode.SingleQuote, KeyCode.Quote, false);
	define(CharCode.DoubleQuote, KeyCode.Quote, true);
})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/common/windowsKeyboardMapper.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/common/windowsKeyboardMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { KeyCode, KeyCodeUtils, IMMUTABLE_CODE_TO_KEY_CODE, ScanCode, ScanCodeUtils, NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE } from '../../../../base/common/keyCodes.js';
import { ResolvedKeybinding, KeyCodeChord, SingleModifierChord, ScanCodeChord, Keybinding, Chord } from '../../../../base/common/keybindings.js';
import { UILabelProvider } from '../../../../base/common/keybindingLabels.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { IKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { BaseResolvedKeybinding } from '../../../../platform/keybinding/common/baseResolvedKeybinding.js';
import { toEmptyArrayIfContainsNull } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { IWindowsKeyboardMapping } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';

const LOG = false;
function log(str: string): void {
	if (LOG) {
		console.info(str);
	}
}


export interface IScanCodeMapping {
	scanCode: ScanCode;
	keyCode: KeyCode;
	value: string;
	withShift: string;
	withAltGr: string;
	withShiftAltGr: string;
}

export class WindowsNativeResolvedKeybinding extends BaseResolvedKeybinding<KeyCodeChord> {

	private readonly _mapper: WindowsKeyboardMapper;

	constructor(mapper: WindowsKeyboardMapper, chords: KeyCodeChord[]) {
		super(OperatingSystem.Windows, chords);
		this._mapper = mapper;
	}

	protected _getLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return this._mapper.getUILabelForKeyCode(chord.keyCode);
	}

	private _getUSLabelForKeybinding(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return KeyCodeUtils.toString(chord.keyCode);
	}

	public getUSLabel(): string | null {
		return UILabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getUSLabelForKeybinding(keybinding));
	}

	protected _getAriaLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return this._mapper.getAriaLabelForKeyCode(chord.keyCode);
	}

	protected _getElectronAccelerator(chord: KeyCodeChord): string | null {
		return this._mapper.getElectronAcceleratorForKeyBinding(chord);
	}

	protected _getUserSettingsLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		const result = this._mapper.getUserSettingsLabelForKeyCode(chord.keyCode);
		return (result ? result.toLowerCase() : result);
	}

	protected _isWYSIWYG(chord: KeyCodeChord): boolean {
		return this.__isWYSIWYG(chord.keyCode);
	}

	private __isWYSIWYG(keyCode: KeyCode): boolean {
		if (
			keyCode === KeyCode.LeftArrow
			|| keyCode === KeyCode.UpArrow
			|| keyCode === KeyCode.RightArrow
			|| keyCode === KeyCode.DownArrow
		) {
			return true;
		}
		const ariaLabel = this._mapper.getAriaLabelForKeyCode(keyCode);
		const userSettingsLabel = this._mapper.getUserSettingsLabelForKeyCode(keyCode);
		return (ariaLabel === userSettingsLabel);
	}

	protected _getChordDispatch(chord: KeyCodeChord): string | null {
		if (chord.isModifierKey()) {
			return null;
		}
		let result = '';

		if (chord.ctrlKey) {
			result += 'ctrl+';
		}
		if (chord.shiftKey) {
			result += 'shift+';
		}
		if (chord.altKey) {
			result += 'alt+';
		}
		if (chord.metaKey) {
			result += 'meta+';
		}
		result += KeyCodeUtils.toString(chord.keyCode);

		return result;
	}

	protected _getSingleModifierChordDispatch(chord: KeyCodeChord): SingleModifierChord | null {
		if (chord.keyCode === KeyCode.Ctrl && !chord.shiftKey && !chord.altKey && !chord.metaKey) {
			return 'ctrl';
		}
		if (chord.keyCode === KeyCode.Shift && !chord.ctrlKey && !chord.altKey && !chord.metaKey) {
			return 'shift';
		}
		if (chord.keyCode === KeyCode.Alt && !chord.ctrlKey && !chord.shiftKey && !chord.metaKey) {
			return 'alt';
		}
		if (chord.keyCode === KeyCode.Meta && !chord.ctrlKey && !chord.shiftKey && !chord.altKey) {
			return 'meta';
		}
		return null;
	}

	private static getProducedCharCode(chord: ScanCodeChord, mapping: IScanCodeMapping): string | null {
		if (!mapping) {
			return null;
		}
		if (chord.ctrlKey && chord.shiftKey && chord.altKey) {
			return mapping.withShiftAltGr;
		}
		if (chord.ctrlKey && chord.altKey) {
			return mapping.withAltGr;
		}
		if (chord.shiftKey) {
			return mapping.withShift;
		}
		return mapping.value;
	}

	public static getProducedChar(chord: ScanCodeChord, mapping: IScanCodeMapping): string {
		const char = this.getProducedCharCode(chord, mapping);
		if (char === null || char.length === 0) {
			return ' --- ';
		}
		return '  ' + char + '  ';
	}
}

export class WindowsKeyboardMapper implements IKeyboardMapper {

	private readonly _codeInfo: IScanCodeMapping[];
	private readonly _scanCodeToKeyCode: KeyCode[];
	private readonly _keyCodeToLabel: Array<string | null> = [];
	private readonly _keyCodeExists: boolean[];

	constructor(
		private readonly _isUSStandard: boolean,
		rawMappings: IWindowsKeyboardMapping,
		private readonly _mapAltGrToCtrlAlt: boolean
	) {
		this._scanCodeToKeyCode = [];
		this._keyCodeToLabel = [];
		this._keyCodeExists = [];
		this._keyCodeToLabel[KeyCode.Unknown] = KeyCodeUtils.toString(KeyCode.Unknown);

		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
			if (immutableKeyCode !== KeyCode.DependsOnKbLayout) {
				this._scanCodeToKeyCode[scanCode] = immutableKeyCode;
				this._keyCodeToLabel[immutableKeyCode] = KeyCodeUtils.toString(immutableKeyCode);
				this._keyCodeExists[immutableKeyCode] = true;
			}
		}

		const producesLetter: boolean[] = [];
		let producesLetters = false;

		this._codeInfo = [];
		for (const strCode in rawMappings) {
			if (rawMappings.hasOwnProperty(strCode)) {
				const scanCode = ScanCodeUtils.toEnum(strCode);
				if (scanCode === ScanCode.None) {
					log(`Unknown scanCode ${strCode} in mapping.`);
					continue;
				}
				const rawMapping = rawMappings[strCode];

				const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
				if (immutableKeyCode !== KeyCode.DependsOnKbLayout) {
					const keyCode = NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[rawMapping.vkey] || KeyCode.Unknown;
					if (keyCode === KeyCode.Unknown || immutableKeyCode === keyCode) {
						continue;
					}
					if (scanCode !== ScanCode.NumpadComma) {
						// Looks like ScanCode.NumpadComma doesn't always map to KeyCode.NUMPAD_SEPARATOR
						// e.g. on POR - PTB
						continue;
					}
				}

				const value = rawMapping.value;
				const withShift = rawMapping.withShift;
				const withAltGr = rawMapping.withAltGr;
				const withShiftAltGr = rawMapping.withShiftAltGr;
				const keyCode = NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[rawMapping.vkey] || KeyCode.Unknown;

				const mapping: IScanCodeMapping = {
					scanCode: scanCode,
					keyCode: keyCode,
					value: value,
					withShift: withShift,
					withAltGr: withAltGr,
					withShiftAltGr: withShiftAltGr,
				};
				this._codeInfo[scanCode] = mapping;
				this._scanCodeToKeyCode[scanCode] = keyCode;

				if (keyCode === KeyCode.Unknown) {
					continue;
				}
				this._keyCodeExists[keyCode] = true;

				if (value.length === 0) {
					// This key does not produce strings
					this._keyCodeToLabel[keyCode] = null;
				}

				else if (value.length > 1) {
					// This key produces a letter representable with multiple UTF-16 code units.
					this._keyCodeToLabel[keyCode] = value;
				}

				else {
					const charCode = value.charCodeAt(0);

					if (charCode >= CharCode.a && charCode <= CharCode.z) {
						const upperCaseValue = CharCode.A + (charCode - CharCode.a);
						producesLetter[upperCaseValue] = true;
						producesLetters = true;
						this._keyCodeToLabel[keyCode] = String.fromCharCode(CharCode.A + (charCode - CharCode.a));
					}

					else if (charCode >= CharCode.A && charCode <= CharCode.Z) {
						producesLetter[charCode] = true;
						producesLetters = true;
						this._keyCodeToLabel[keyCode] = value;
					}

					else {
						this._keyCodeToLabel[keyCode] = value;
					}
				}
			}
		}

		// Handle keyboard layouts where latin characters are not produced e.g. Cyrillic
		const _registerLetterIfMissing = (charCode: CharCode, keyCode: KeyCode): void => {
			if (!producesLetter[charCode]) {
				this._keyCodeToLabel[keyCode] = String.fromCharCode(charCode);
			}
		};
		_registerLetterIfMissing(CharCode.A, KeyCode.KeyA);
		_registerLetterIfMissing(CharCode.B, KeyCode.KeyB);
		_registerLetterIfMissing(CharCode.C, KeyCode.KeyC);
		_registerLetterIfMissing(CharCode.D, KeyCode.KeyD);
		_registerLetterIfMissing(CharCode.E, KeyCode.KeyE);
		_registerLetterIfMissing(CharCode.F, KeyCode.KeyF);
		_registerLetterIfMissing(CharCode.G, KeyCode.KeyG);
		_registerLetterIfMissing(CharCode.H, KeyCode.KeyH);
		_registerLetterIfMissing(CharCode.I, KeyCode.KeyI);
		_registerLetterIfMissing(CharCode.J, KeyCode.KeyJ);
		_registerLetterIfMissing(CharCode.K, KeyCode.KeyK);
		_registerLetterIfMissing(CharCode.L, KeyCode.KeyL);
		_registerLetterIfMissing(CharCode.M, KeyCode.KeyM);
		_registerLetterIfMissing(CharCode.N, KeyCode.KeyN);
		_registerLetterIfMissing(CharCode.O, KeyCode.KeyO);
		_registerLetterIfMissing(CharCode.P, KeyCode.KeyP);
		_registerLetterIfMissing(CharCode.Q, KeyCode.KeyQ);
		_registerLetterIfMissing(CharCode.R, KeyCode.KeyR);
		_registerLetterIfMissing(CharCode.S, KeyCode.KeyS);
		_registerLetterIfMissing(CharCode.T, KeyCode.KeyT);
		_registerLetterIfMissing(CharCode.U, KeyCode.KeyU);
		_registerLetterIfMissing(CharCode.V, KeyCode.KeyV);
		_registerLetterIfMissing(CharCode.W, KeyCode.KeyW);
		_registerLetterIfMissing(CharCode.X, KeyCode.KeyX);
		_registerLetterIfMissing(CharCode.Y, KeyCode.KeyY);
		_registerLetterIfMissing(CharCode.Z, KeyCode.KeyZ);

		if (!producesLetters) {
			// Since this keyboard layout produces no latin letters at all, most of the UI will use the
			// US kb layout equivalent for UI labels, so also try to render other keys with the US labels
			// for consistency...
			const _registerLabel = (keyCode: KeyCode, charCode: CharCode): void => {
				// const existingLabel = this._keyCodeToLabel[keyCode];
				// const existingCharCode = (existingLabel ? existingLabel.charCodeAt(0) : CharCode.Null);
				// if (existingCharCode < 32 || existingCharCode > 126) {
				this._keyCodeToLabel[keyCode] = String.fromCharCode(charCode);
				// }
			};
			_registerLabel(KeyCode.Semicolon, CharCode.Semicolon);
			_registerLabel(KeyCode.Equal, CharCode.Equals);
			_registerLabel(KeyCode.Comma, CharCode.Comma);
			_registerLabel(KeyCode.Minus, CharCode.Dash);
			_registerLabel(KeyCode.Period, CharCode.Period);
			_registerLabel(KeyCode.Slash, CharCode.Slash);
			_registerLabel(KeyCode.Backquote, CharCode.BackTick);
			_registerLabel(KeyCode.BracketLeft, CharCode.OpenSquareBracket);
			_registerLabel(KeyCode.Backslash, CharCode.Backslash);
			_registerLabel(KeyCode.BracketRight, CharCode.CloseSquareBracket);
			_registerLabel(KeyCode.Quote, CharCode.SingleQuote);
		}
	}

	public dumpDebugInfo(): string {
		const result: string[] = [];

		const immutableSamples = [
			ScanCode.ArrowUp,
			ScanCode.Numpad0
		];

		let cnt = 0;
		result.push(`-----------------------------------------------------------------------------------------------------------------------------------------`);
		for (let scanCode = ScanCode.None; scanCode < ScanCode.MAX_VALUE; scanCode++) {
			if (IMMUTABLE_CODE_TO_KEY_CODE[scanCode] !== KeyCode.DependsOnKbLayout) {
				if (immutableSamples.indexOf(scanCode) === -1) {
					continue;
				}
			}

			if (cnt % 6 === 0) {
				result.push(`|       HW Code combination      |  Key  |    KeyCode combination    |          UI label         |        User settings       | WYSIWYG |`);
				result.push(`-----------------------------------------------------------------------------------------------------------------------------------------`);
			}
			cnt++;

			const mapping = this._codeInfo[scanCode];
			const strCode = ScanCodeUtils.toString(scanCode);

			const mods = [0b000, 0b010, 0b101, 0b111];
			for (const mod of mods) {
				const ctrlKey = (mod & 0b001) ? true : false;
				const shiftKey = (mod & 0b010) ? true : false;
				const altKey = (mod & 0b100) ? true : false;
				const scanCodeChord = new ScanCodeChord(ctrlKey, shiftKey, altKey, false, scanCode);
				const keyCodeChord = this._resolveChord(scanCodeChord);
				const strKeyCode = (keyCodeChord ? KeyCodeUtils.toString(keyCodeChord.keyCode) : null);
				const resolvedKb = (keyCodeChord ? new WindowsNativeResolvedKeybinding(this, [keyCodeChord]) : null);

				const outScanCode = `${ctrlKey ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${altKey ? 'Alt+' : ''}${strCode}`;
				const ariaLabel = (resolvedKb ? resolvedKb.getAriaLabel() : null);
				const outUILabel = (ariaLabel ? ariaLabel.replace(/Control\+/, 'Ctrl+') : null);
				const outUserSettings = (resolvedKb ? resolvedKb.getUserSettingsLabel() : null);
				const outKey = WindowsNativeResolvedKeybinding.getProducedChar(scanCodeChord, mapping);
				const outKb = (strKeyCode ? `${ctrlKey ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${altKey ? 'Alt+' : ''}${strKeyCode}` : null);
				const isWYSIWYG = (resolvedKb ? resolvedKb.isWYSIWYG() : false);
				const outWYSIWYG = (isWYSIWYG ? '       ' : '   NO  ');
				result.push(`| ${this._leftPad(outScanCode, 30)} | ${outKey} | ${this._leftPad(outKb, 25)} | ${this._leftPad(outUILabel, 25)} |  ${this._leftPad(outUserSettings, 25)} | ${outWYSIWYG} |`);
			}
			result.push(`-----------------------------------------------------------------------------------------------------------------------------------------`);
		}


		return result.join('\n');
	}

	private _leftPad(str: string | null, cnt: number): string {
		if (str === null) {
			str = 'null';
		}
		while (str.length < cnt) {
			str = ' ' + str;
		}
		return str;
	}

	public getUILabelForKeyCode(keyCode: KeyCode): string {
		return this._getLabelForKeyCode(keyCode);
	}

	public getAriaLabelForKeyCode(keyCode: KeyCode): string {
		return this._getLabelForKeyCode(keyCode);
	}

	public getUserSettingsLabelForKeyCode(keyCode: KeyCode): string {
		if (this._isUSStandard) {
			return KeyCodeUtils.toUserSettingsUS(keyCode);
		}
		return KeyCodeUtils.toUserSettingsGeneral(keyCode);
	}

	public getElectronAcceleratorForKeyBinding(chord: KeyCodeChord): string | null {
		return KeyCodeUtils.toElectronAccelerator(chord.keyCode);
	}

	private _getLabelForKeyCode(keyCode: KeyCode): string {
		return this._keyCodeToLabel[keyCode] || KeyCodeUtils.toString(KeyCode.Unknown);
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): WindowsNativeResolvedKeybinding {
		const ctrlKey = keyboardEvent.ctrlKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const altKey = keyboardEvent.altKey || (this._mapAltGrToCtrlAlt && keyboardEvent.altGraphKey);
		const chord = new KeyCodeChord(ctrlKey, keyboardEvent.shiftKey, altKey, keyboardEvent.metaKey, keyboardEvent.keyCode);
		return new WindowsNativeResolvedKeybinding(this, [chord]);
	}

	private _resolveChord(chord: Chord | null): KeyCodeChord | null {
		if (!chord) {
			return null;
		}
		if (chord instanceof KeyCodeChord) {
			if (!this._keyCodeExists[chord.keyCode]) {
				return null;
			}
			return chord;
		}
		const keyCode = this._scanCodeToKeyCode[chord.scanCode] || KeyCode.Unknown;
		if (keyCode === KeyCode.Unknown || !this._keyCodeExists[keyCode]) {
			return null;
		}
		return new KeyCodeChord(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.metaKey, keyCode);
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		const chords: KeyCodeChord[] = toEmptyArrayIfContainsNull(keybinding.chords.map(chord => this._resolveChord(chord)));
		if (chords.length > 0) {
			return [new WindowsNativeResolvedKeybinding(this, chords)];
		}
		return [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/electron-browser/nativeKeyboardLayout.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/electron-browser/nativeKeyboardLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeyboardLayoutInfo, IKeyboardLayoutService, IKeyboardMapping, ILinuxKeyboardLayoutInfo, IMacKeyboardLayoutInfo, IMacLinuxKeyboardMapping, IWindowsKeyboardLayoutInfo, IWindowsKeyboardMapping } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';
import { Emitter } from '../../../../base/common/event.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { CachedKeyboardMapper, IKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { WindowsKeyboardMapper } from '../common/windowsKeyboardMapper.js';
import { FallbackKeyboardMapper } from '../common/fallbackKeyboardMapper.js';
import { MacLinuxKeyboardMapper } from '../common/macLinuxKeyboardMapper.js';
import { DispatchConfig, readKeyboardConfig } from '../../../../platform/keyboardLayout/common/keyboardConfig.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INativeKeyboardLayoutService } from './nativeKeyboardLayoutService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class KeyboardLayoutService extends Disposable implements IKeyboardLayoutService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeKeyboardLayout = this._register(new Emitter<void>());
	readonly onDidChangeKeyboardLayout = this._onDidChangeKeyboardLayout.event;

	private _keyboardMapper: IKeyboardMapper | null;

	constructor(
		@INativeKeyboardLayoutService private readonly _nativeKeyboardLayoutService: INativeKeyboardLayoutService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
		this._keyboardMapper = null;

		this._register(this._nativeKeyboardLayoutService.onDidChangeKeyboardLayout(async () => {
			this._keyboardMapper = null;
			this._onDidChangeKeyboardLayout.fire();
		}));

		this._register(_configurationService.onDidChangeConfiguration(async (e) => {
			if (e.affectsConfiguration('keyboard')) {
				this._keyboardMapper = null;
				this._onDidChangeKeyboardLayout.fire();
			}
		}));
	}

	public getRawKeyboardMapping(): IKeyboardMapping | null {
		return this._nativeKeyboardLayoutService.getRawKeyboardMapping();
	}

	public getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null {
		return this._nativeKeyboardLayoutService.getCurrentKeyboardLayout();
	}

	public getAllKeyboardLayouts(): IKeyboardLayoutInfo[] {
		return [];
	}

	public getKeyboardMapper(): IKeyboardMapper {
		const config = readKeyboardConfig(this._configurationService);
		if (config.dispatch === DispatchConfig.KeyCode) {
			// Forcefully set to use keyCode
			return new FallbackKeyboardMapper(config.mapAltGrToCtrlAlt, OS);
		}
		if (!this._keyboardMapper) {
			this._keyboardMapper = new CachedKeyboardMapper(createKeyboardMapper(this.getCurrentKeyboardLayout(), this.getRawKeyboardMapping(), config.mapAltGrToCtrlAlt));
		}
		return this._keyboardMapper;
	}

	public validateCurrentKeyboardMapping(keyboardEvent: IKeyboardEvent): void {
		return;
	}
}

function createKeyboardMapper(layoutInfo: IKeyboardLayoutInfo | null, rawMapping: IKeyboardMapping | null, mapAltGrToCtrlAlt: boolean): IKeyboardMapper {
	const _isUSStandard = isUSStandard(layoutInfo);
	if (OS === OperatingSystem.Windows) {
		return new WindowsKeyboardMapper(_isUSStandard, <IWindowsKeyboardMapping>rawMapping, mapAltGrToCtrlAlt);
	}

	if (!rawMapping || Object.keys(rawMapping).length === 0) {
		// Looks like reading the mappings failed (most likely Mac + Japanese/Chinese keyboard layouts)
		return new FallbackKeyboardMapper(mapAltGrToCtrlAlt, OS);
	}

	if (OS === OperatingSystem.Macintosh) {
		const kbInfo = <IMacKeyboardLayoutInfo>layoutInfo;
		if (kbInfo.id === 'com.apple.keylayout.DVORAK-QWERTYCMD') {
			// Use keyCode based dispatching for DVORAK - QWERTY ⌘
			return new FallbackKeyboardMapper(mapAltGrToCtrlAlt, OS);
		}
	}

	return new MacLinuxKeyboardMapper(_isUSStandard, <IMacLinuxKeyboardMapping>rawMapping, mapAltGrToCtrlAlt, OS);
}

function isUSStandard(_kbInfo: IKeyboardLayoutInfo | null): boolean {
	if (!_kbInfo) {
		return false;
	}

	if (OS === OperatingSystem.Linux) {
		const kbInfo = <ILinuxKeyboardLayoutInfo>_kbInfo;
		const layouts = kbInfo.layout.split(/,/g);
		return (layouts[kbInfo.group] === 'us');
	}

	if (OS === OperatingSystem.Macintosh) {
		const kbInfo = <IMacKeyboardLayoutInfo>_kbInfo;
		return (kbInfo.id === 'com.apple.keylayout.US');
	}

	if (OS === OperatingSystem.Windows) {
		const kbInfo = <IWindowsKeyboardLayoutInfo>_kbInfo;
		return (kbInfo.name === '00000409');
	}

	return false;
}

registerSingleton(IKeyboardLayoutService, KeyboardLayoutService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/electron-browser/nativeKeyboardLayoutService.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/electron-browser/nativeKeyboardLayoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeyboardLayoutInfo, IKeyboardMapping, IMacLinuxKeyboardMapping, IWindowsKeyboardMapping, macLinuxKeyboardMappingEquals, windowsKeyboardMappingEquals } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { INativeKeyboardLayoutService as IBaseNativeKeyboardLayoutService } from '../../../../platform/keyboardLayout/common/keyboardLayoutService.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INativeKeyboardLayoutService = createDecorator<INativeKeyboardLayoutService>('nativeKeyboardLayoutService');

export interface INativeKeyboardLayoutService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeKeyboardLayout: Event<void>;
	getRawKeyboardMapping(): IKeyboardMapping | null;
	getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null;
}

export class NativeKeyboardLayoutService extends Disposable implements INativeKeyboardLayoutService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeKeyboardLayout = this._register(new Emitter<void>());
	readonly onDidChangeKeyboardLayout = this._onDidChangeKeyboardLayout.event;

	private readonly _keyboardLayoutService: IBaseNativeKeyboardLayoutService;
	private _initPromise: Promise<void> | null;
	private _keyboardMapping: IKeyboardMapping | null;
	private _keyboardLayoutInfo: IKeyboardLayoutInfo | null;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		super();
		this._keyboardLayoutService = ProxyChannel.toService<IBaseNativeKeyboardLayoutService>(mainProcessService.getChannel('keyboardLayout'));
		this._initPromise = null;
		this._keyboardMapping = null;
		this._keyboardLayoutInfo = null;

		this._register(this._keyboardLayoutService.onDidChangeKeyboardLayout(async ({ keyboardLayoutInfo, keyboardMapping }) => {
			await this.initialize();
			if (keyboardMappingEquals(this._keyboardMapping, keyboardMapping)) {
				// the mappings are equal
				return;
			}

			this._keyboardMapping = keyboardMapping;
			this._keyboardLayoutInfo = keyboardLayoutInfo;
			this._onDidChangeKeyboardLayout.fire();
		}));
	}

	public initialize(): Promise<void> {
		if (!this._initPromise) {
			this._initPromise = this._doInitialize();
		}
		return this._initPromise;
	}

	private async _doInitialize(): Promise<void> {
		const keyboardLayoutData = await this._keyboardLayoutService.getKeyboardLayoutData();
		const { keyboardLayoutInfo, keyboardMapping } = keyboardLayoutData;
		this._keyboardMapping = keyboardMapping;
		this._keyboardLayoutInfo = keyboardLayoutInfo;
	}

	public getRawKeyboardMapping(): IKeyboardMapping | null {
		return this._keyboardMapping;
	}

	public getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null {
		return this._keyboardLayoutInfo;
	}
}

function keyboardMappingEquals(a: IKeyboardMapping | null, b: IKeyboardMapping | null): boolean {
	if (OS === OperatingSystem.Windows) {
		return windowsKeyboardMappingEquals(<IWindowsKeyboardMapping | null>a, <IWindowsKeyboardMapping | null>b);
	}

	return macLinuxKeyboardMappingEquals(<IMacLinuxKeyboardMapping | null>a, <IMacLinuxKeyboardMapping | null>b);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/browser/browserKeyboardMapper.test.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/browser/browserKeyboardMapper.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import '../../browser/keyboardLayouts/en.darwin.js';
import '../../browser/keyboardLayouts/de.darwin.js';
import { KeyboardLayoutContribution } from '../../browser/keyboardLayouts/_.contribution.js';
import { BrowserKeyboardMapperFactoryBase } from '../../browser/keyboardLayoutService.js';
import { KeymapInfo, IKeymapInfo } from '../../common/keymapInfo.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

class TestKeyboardMapperFactory extends BrowserKeyboardMapperFactoryBase {
	constructor(configurationService: IConfigurationService, notificationService: INotificationService, storageService: IStorageService, commandService: ICommandService) {
		// super(notificationService, storageService, commandService);
		super(configurationService);

		const keymapInfos: IKeymapInfo[] = KeyboardLayoutContribution.INSTANCE.layoutInfos;
		this._keymapInfos.push(...keymapInfos.map(info => (new KeymapInfo(info.layout, info.secondaryLayouts, info.mapping, info.isUserKeyboardLayout))));
		this._mru = this._keymapInfos;
		this._initialized = true;
		this.setLayoutFromBrowserAPI();
		const usLayout = this.getUSStandardLayout();
		if (usLayout) {
			this.setActiveKeyMapping(usLayout.mapping);
		}
	}
}

suite('keyboard layout loader', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let instance: TestKeyboardMapperFactory;

	setup(() => {
		instantiationService = new TestInstantiationService();
		const storageService = new TestStorageService();
		const notitifcationService = instantiationService.stub(INotificationService, new TestNotificationService());
		const configurationService = instantiationService.stub(IConfigurationService, new TestConfigurationService());
		const commandService = instantiationService.stub(ICommandService, {});

		ds.add(instantiationService);
		ds.add(storageService);

		instance = new TestKeyboardMapperFactory(configurationService, notitifcationService, storageService, commandService);
		ds.add(instance);
	});

	teardown(() => {
		instantiationService.dispose();
	});

	test('load default US keyboard layout', () => {
		assert.notStrictEqual(instance.activeKeyboardLayout, null);
	});

	test('isKeyMappingActive', () => {
		instance.setUSKeyboardLayout();
		assert.strictEqual(instance.isKeyMappingActive({
			KeyA: {
				value: 'a',
				valueIsDeadKey: false,
				withShift: 'A',
				withShiftIsDeadKey: false,
				withAltGr: 'å',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Å',
				withShiftAltGrIsDeadKey: false
			}
		}), true);

		assert.strictEqual(instance.isKeyMappingActive({
			KeyA: {
				value: 'a',
				valueIsDeadKey: false,
				withShift: 'A',
				withShiftIsDeadKey: false,
				withAltGr: 'å',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Å',
				withShiftAltGrIsDeadKey: false
			},
			KeyZ: {
				value: 'z',
				valueIsDeadKey: false,
				withShift: 'Z',
				withShiftIsDeadKey: false,
				withAltGr: 'Ω',
				withAltGrIsDeadKey: false,
				withShiftAltGr: '¸',
				withShiftAltGrIsDeadKey: false
			}
		}), true);

		assert.strictEqual(instance.isKeyMappingActive({
			KeyZ: {
				value: 'y',
				valueIsDeadKey: false,
				withShift: 'Y',
				withShiftIsDeadKey: false,
				withAltGr: '¥',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Ÿ',
				withShiftAltGrIsDeadKey: false
			},
		}), false);

	});

	test('Switch keymapping', () => {
		instance.setActiveKeyMapping({
			KeyZ: {
				value: 'y',
				valueIsDeadKey: false,
				withShift: 'Y',
				withShiftIsDeadKey: false,
				withAltGr: '¥',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Ÿ',
				withShiftAltGrIsDeadKey: false
			}
		});
		assert.strictEqual(!!instance.activeKeyboardLayout!.isUSStandard, false);
		assert.strictEqual(instance.isKeyMappingActive({
			KeyZ: {
				value: 'y',
				valueIsDeadKey: false,
				withShift: 'Y',
				withShiftIsDeadKey: false,
				withAltGr: '¥',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Ÿ',
				withShiftAltGrIsDeadKey: false
			},
		}), true);

		instance.setUSKeyboardLayout();
		assert.strictEqual(instance.activeKeyboardLayout!.isUSStandard, true);
	});

	test('Switch keyboard layout info', () => {
		instance.setKeyboardLayout('com.apple.keylayout.German');
		assert.strictEqual(!!instance.activeKeyboardLayout!.isUSStandard, false);
		assert.strictEqual(instance.isKeyMappingActive({
			KeyZ: {
				value: 'y',
				valueIsDeadKey: false,
				withShift: 'Y',
				withShiftIsDeadKey: false,
				withAltGr: '¥',
				withAltGrIsDeadKey: false,
				withShiftAltGr: 'Ÿ',
				withShiftAltGrIsDeadKey: false
			},
		}), true);

		instance.setUSKeyboardLayout();
		assert.strictEqual(instance.activeKeyboardLayout!.isUSStandard, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/browser/keybindingEditing.test.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/browser/keybindingEditing.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as json from '../../../../../base/common/json.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { KeyCodeChord } from '../../../../../base/common/keybindings.js';
import { OS } from '../../../../../base/common/platform.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IUserFriendlyKeybinding } from '../../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybindingItem } from '../../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { KeybindingsEditingService } from '../../common/keybindingEditing.js';
import { ITextFileService } from '../../../textfile/common/textfiles.js';
import { TestEnvironmentService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { FileUserDataProvider } from '../../../../../platform/userData/common/fileUserDataProvider.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { UserDataProfilesService } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { UserDataProfileService } from '../../../userDataProfile/common/userDataProfileService.js';
import { IUserDataProfileService } from '../../../userDataProfile/common/userDataProfile.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

interface Modifiers {
	metaKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
}

const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });

suite('KeybindingsEditing', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let fileService: IFileService;
	let environmentService: IEnvironmentService;
	let userDataProfileService: IUserDataProfileService;
	let testObject: KeybindingsEditingService;

	setup(async () => {

		environmentService = TestEnvironmentService;

		const logService = new NullLogService();
		fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));

		const userFolder = joinPath(ROOT, 'User');
		await fileService.createFolder(userFolder);

		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'eol': '\n' });

		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		const userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		userDataProfileService = disposables.add(new UserDataProfileService(userDataProfilesService.defaultProfile));
		disposables.add(fileService.registerProvider(Schemas.vscodeUserData, disposables.add(new FileUserDataProvider(ROOT.scheme, fileSystemProvider, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, new NullLogService()))));

		instantiationService = workbenchInstantiationService({
			fileService: () => fileService,
			configurationService: () => configService,
			environmentService: () => environmentService
		}, disposables);

		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditingService));
	});

	test('errors cases - parse errors', async () => {
		await fileService.writeFile(userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString(',,,,,,,,,,,,,,'));
		try {
			await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape } }), 'alt+c', undefined);
			assert.fail('Should fail with parse errors');
		} catch (error) {
			assert.strictEqual(error.message, 'Unable to write to the keybindings configuration file. Please open it to correct errors/warnings in the file and try again.');
		}
	});

	test('errors cases - parse errors 2', async () => {
		await fileService.writeFile(userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString('[{"key": }]'));
		try {
			await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape } }), 'alt+c', undefined);
			assert.fail('Should fail with parse errors');
		} catch (error) {
			assert.strictEqual(error.message, 'Unable to write to the keybindings configuration file. Please open it to correct errors/warnings in the file and try again.');
		}
	});

	test('errors cases - dirty', () => {
		instantiationService.stub(ITextFileService, 'isDirty', true);
		return testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape } }), 'alt+c', undefined)
			.then(() => assert.fail('Should fail with dirty error'),
				error => assert.strictEqual(error.message, 'Unable to write because the keybindings configuration file has unsaved changes. Please save it first and then try again.'));
	});

	test('errors cases - did not find an array', async () => {
		await fileService.writeFile(userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString('{"key": "alt+c", "command": "hello"}'));
		try {
			await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape } }), 'alt+c', undefined);
			assert.fail('Should fail');
		} catch (error) {
			assert.strictEqual(error.message, 'Unable to write to the keybindings configuration file. It has an object which is not of type Array. Please open the file to clean up and try again.');
		}
	});

	test('edit a default keybinding to an empty file', async () => {
		await fileService.writeFile(userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString(''));
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'a' }, { key: 'escape', command: '-a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'a' }), 'alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('edit a default keybinding to an empty array', async () => {
		await writeToKeybindingsFile();
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'a' }, { key: 'escape', command: '-a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'a' }), 'alt+c', undefined);
		return assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('edit a default keybinding in an existing array', async () => {
		await writeToKeybindingsFile({ command: 'b', key: 'shift+c' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'shift+c', command: 'b' }, { key: 'alt+c', command: 'a' }, { key: 'escape', command: '-a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'a' }), 'alt+c', undefined);
		return assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('add another keybinding', async () => {
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'a' }];
		await testObject.addKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'a' }), 'alt+c', undefined);
		return assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('add a new default keybinding', async () => {
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'a' }];
		await testObject.addKeybinding(aResolvedKeybindingItem({ command: 'a' }), 'alt+c', undefined);
		return assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('add a new default keybinding using edit', async () => {
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a' }), 'alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('edit an user keybinding', async () => {
		await writeToKeybindingsFile({ key: 'escape', command: 'b' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'b' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'b', isDefault: false }), 'alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('edit an user keybinding with more than one element', async () => {
		await writeToKeybindingsFile({ key: 'escape', command: 'b' }, { key: 'alt+shift+g', command: 'c' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: 'b' }, { key: 'alt+shift+g', command: 'c' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ firstChord: { keyCode: KeyCode.Escape }, command: 'b', isDefault: false }), 'alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('remove a default keybinding', async () => {
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a' }];
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('remove a default keybinding should not ad duplicate entries', async () => {
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a' }];
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'a', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } } }));
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('remove a user keybinding', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: 'b' });
		await testObject.removeKeybinding(aResolvedKeybindingItem({ command: 'b', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } }, isDefault: false }));
		assert.deepStrictEqual(await getUserKeybindings(), []);
	});

	test('reset an edited keybinding', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: 'b' });
		await testObject.resetKeybinding(aResolvedKeybindingItem({ command: 'b', firstChord: { keyCode: KeyCode.KeyC, modifiers: { altKey: true } }, isDefault: false }));
		assert.deepStrictEqual(await getUserKeybindings(), []);
	});

	test('reset a removed keybinding', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-b' });
		await testObject.resetKeybinding(aResolvedKeybindingItem({ command: 'b', isDefault: false }));
		assert.deepStrictEqual(await getUserKeybindings(), []);
	});

	test('reset multiple removed keybindings', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-b' });
		await writeToKeybindingsFile({ key: 'alt+shift+c', command: '-b' });
		await writeToKeybindingsFile({ key: 'escape', command: '-b' });
		await testObject.resetKeybinding(aResolvedKeybindingItem({ command: 'b', isDefault: false }));
		assert.deepStrictEqual(await getUserKeybindings(), []);
	});

	test('add a new keybinding to unassigned keybinding', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-a' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a' }, { key: 'shift+alt+c', command: 'a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a', isDefault: false }), 'shift+alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('add when expression', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-a' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a' }, { key: 'shift+alt+c', command: 'a', when: 'editorTextFocus' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a', isDefault: false }), 'shift+alt+c', 'editorTextFocus');
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('update command and when expression', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' }, { key: 'shift+alt+c', command: 'a', when: 'editorTextFocus' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a', isDefault: false }), 'shift+alt+c', 'editorTextFocus');
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('update when expression', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' }, { key: 'shift+alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' }, { key: 'shift+alt+c', command: 'a', when: 'editorTextFocus' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a', isDefault: false, when: 'editorTextFocus && !editorReadonly' }), 'shift+alt+c', 'editorTextFocus');
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	test('remove when expression', async () => {
		await writeToKeybindingsFile({ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' });
		const expected: IUserFriendlyKeybinding[] = [{ key: 'alt+c', command: '-a', when: 'editorTextFocus && !editorReadonly' }, { key: 'shift+alt+c', command: 'a' }];
		await testObject.editKeybinding(aResolvedKeybindingItem({ command: 'a', isDefault: false }), 'shift+alt+c', undefined);
		assert.deepStrictEqual(await getUserKeybindings(), expected);
	});

	async function writeToKeybindingsFile(...keybindings: IUserFriendlyKeybinding[]): Promise<void> {
		await fileService.writeFile(userDataProfileService.currentProfile.keybindingsResource, VSBuffer.fromString(JSON.stringify(keybindings || [])));
	}

	async function getUserKeybindings(): Promise<IUserFriendlyKeybinding[]> {
		return json.parse((await fileService.readFile(userDataProfileService.currentProfile.keybindingsResource)).value.toString());
	}

	function aResolvedKeybindingItem({ command, when, isDefault, firstChord, secondChord }: { command?: string; when?: string; isDefault?: boolean; firstChord?: { keyCode: KeyCode; modifiers?: Modifiers }; secondChord?: { keyCode: KeyCode; modifiers?: Modifiers } }): ResolvedKeybindingItem {
		const aSimpleKeybinding = function (chord: { keyCode: KeyCode; modifiers?: Modifiers }): KeyCodeChord {
			const { ctrlKey, shiftKey, altKey, metaKey } = chord.modifiers || { ctrlKey: false, shiftKey: false, altKey: false, metaKey: false };
			return new KeyCodeChord(ctrlKey!, shiftKey!, altKey!, metaKey!, chord.keyCode);
		};
		const chords: KeyCodeChord[] = [];
		if (firstChord) {
			chords.push(aSimpleKeybinding(firstChord));
			if (secondChord) {
				chords.push(aSimpleKeybinding(secondChord));
			}
		}
		const keybinding = chords.length > 0 ? new USLayoutResolvedKeybinding(chords, OS) : undefined;
		return new ResolvedKeybindingItem(keybinding, command || 'some command', null, when ? ContextKeyExpr.deserialize(when) : undefined, isDefault === undefined ? true : isDefault, null, false);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/browser/keybindingIO.test.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/browser/keybindingIO.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { KeyChord, KeyCode, KeyMod, ScanCode } from '../../../../../base/common/keyCodes.js';
import { KeyCodeChord, decodeKeybinding, ScanCodeChord, Keybinding } from '../../../../../base/common/keybindings.js';
import { KeybindingParser } from '../../../../../base/common/keybindingParser.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { KeybindingIO } from '../../common/keybindingIO.js';
import { createUSLayoutResolvedKeybinding } from '../../../../../platform/keybinding/test/common/keybindingsTestUtils.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('keybindingIO', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('serialize/deserialize', () => {

		function testOneSerialization(keybinding: number, expected: string, msg: string, OS: OperatingSystem): void {
			const usLayoutResolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS)!;
			const actualSerialized = usLayoutResolvedKeybinding.getUserSettingsLabel();
			assert.strictEqual(actualSerialized, expected, expected + ' - ' + msg);
		}
		function testSerialization(keybinding: number, expectedWin: string, expectedMac: string, expectedLinux: string): void {
			testOneSerialization(keybinding, expectedWin, 'win', OperatingSystem.Windows);
			testOneSerialization(keybinding, expectedMac, 'mac', OperatingSystem.Macintosh);
			testOneSerialization(keybinding, expectedLinux, 'linux', OperatingSystem.Linux);
		}

		function testOneDeserialization(keybinding: string, _expected: number, msg: string, OS: OperatingSystem): void {
			const actualDeserialized = KeybindingParser.parseKeybinding(keybinding);
			const expected = decodeKeybinding(_expected, OS);
			assert.deepStrictEqual(actualDeserialized, expected, keybinding + ' - ' + msg);
		}
		function testDeserialization(inWin: string, inMac: string, inLinux: string, expected: number): void {
			testOneDeserialization(inWin, expected, 'win', OperatingSystem.Windows);
			testOneDeserialization(inMac, expected, 'mac', OperatingSystem.Macintosh);
			testOneDeserialization(inLinux, expected, 'linux', OperatingSystem.Linux);
		}

		function testRoundtrip(keybinding: number, expectedWin: string, expectedMac: string, expectedLinux: string): void {
			testSerialization(keybinding, expectedWin, expectedMac, expectedLinux);
			testDeserialization(expectedWin, expectedMac, expectedLinux, keybinding);
		}

		testRoundtrip(KeyCode.Digit0, '0', '0', '0');
		testRoundtrip(KeyCode.KeyA, 'a', 'a', 'a');
		testRoundtrip(KeyCode.UpArrow, 'up', 'up', 'up');
		testRoundtrip(KeyCode.RightArrow, 'right', 'right', 'right');
		testRoundtrip(KeyCode.DownArrow, 'down', 'down', 'down');
		testRoundtrip(KeyCode.LeftArrow, 'left', 'left', 'left');

		// one modifier
		testRoundtrip(KeyMod.Alt | KeyCode.KeyA, 'alt+a', 'alt+a', 'alt+a');
		testRoundtrip(KeyMod.CtrlCmd | KeyCode.KeyA, 'ctrl+a', 'cmd+a', 'ctrl+a');
		testRoundtrip(KeyMod.Shift | KeyCode.KeyA, 'shift+a', 'shift+a', 'shift+a');
		testRoundtrip(KeyMod.WinCtrl | KeyCode.KeyA, 'win+a', 'ctrl+a', 'meta+a');

		// two modifiers
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyA, 'ctrl+alt+a', 'alt+cmd+a', 'ctrl+alt+a');
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA, 'ctrl+shift+a', 'shift+cmd+a', 'ctrl+shift+a');
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+win+a', 'ctrl+cmd+a', 'ctrl+meta+a');
		testRoundtrip(KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'shift+alt+a', 'shift+alt+a', 'shift+alt+a');
		testRoundtrip(KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'shift+win+a', 'ctrl+shift+a', 'shift+meta+a');
		testRoundtrip(KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'alt+win+a', 'ctrl+alt+a', 'alt+meta+a');

		// three modifiers
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'ctrl+shift+alt+a', 'shift+alt+cmd+a', 'ctrl+shift+alt+a');
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+shift+win+a', 'ctrl+shift+cmd+a', 'ctrl+shift+meta+a');
		testRoundtrip(KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'shift+alt+win+a', 'ctrl+shift+alt+a', 'shift+alt+meta+a');

		// all modifiers
		testRoundtrip(KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+shift+alt+win+a', 'ctrl+shift+alt+cmd+a', 'ctrl+shift+alt+meta+a');

		// chords
		testRoundtrip(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyA), 'ctrl+a ctrl+a', 'cmd+a cmd+a', 'ctrl+a ctrl+a');
		testRoundtrip(KeyChord(KeyMod.CtrlCmd | KeyCode.UpArrow, KeyMod.CtrlCmd | KeyCode.UpArrow), 'ctrl+up ctrl+up', 'cmd+up cmd+up', 'ctrl+up ctrl+up');

		// OEM keys
		testRoundtrip(KeyCode.Semicolon, ';', ';', ';');
		testRoundtrip(KeyCode.Equal, '=', '=', '=');
		testRoundtrip(KeyCode.Comma, ',', ',', ',');
		testRoundtrip(KeyCode.Minus, '-', '-', '-');
		testRoundtrip(KeyCode.Period, '.', '.', '.');
		testRoundtrip(KeyCode.Slash, '/', '/', '/');
		testRoundtrip(KeyCode.Backquote, '`', '`', '`');
		testRoundtrip(KeyCode.ABNT_C1, 'abnt_c1', 'abnt_c1', 'abnt_c1');
		testRoundtrip(KeyCode.ABNT_C2, 'abnt_c2', 'abnt_c2', 'abnt_c2');
		testRoundtrip(KeyCode.BracketLeft, '[', '[', '[');
		testRoundtrip(KeyCode.Backslash, '\\', '\\', '\\');
		testRoundtrip(KeyCode.BracketRight, ']', ']', ']');
		testRoundtrip(KeyCode.Quote, '\'', '\'', '\'');
		testRoundtrip(KeyCode.OEM_8, 'oem_8', 'oem_8', 'oem_8');
		testRoundtrip(KeyCode.IntlBackslash, 'oem_102', 'oem_102', 'oem_102');

		// OEM aliases
		testDeserialization('OEM_1', 'OEM_1', 'OEM_1', KeyCode.Semicolon);
		testDeserialization('OEM_PLUS', 'OEM_PLUS', 'OEM_PLUS', KeyCode.Equal);
		testDeserialization('OEM_COMMA', 'OEM_COMMA', 'OEM_COMMA', KeyCode.Comma);
		testDeserialization('OEM_MINUS', 'OEM_MINUS', 'OEM_MINUS', KeyCode.Minus);
		testDeserialization('OEM_PERIOD', 'OEM_PERIOD', 'OEM_PERIOD', KeyCode.Period);
		testDeserialization('OEM_2', 'OEM_2', 'OEM_2', KeyCode.Slash);
		testDeserialization('OEM_3', 'OEM_3', 'OEM_3', KeyCode.Backquote);
		testDeserialization('ABNT_C1', 'ABNT_C1', 'ABNT_C1', KeyCode.ABNT_C1);
		testDeserialization('ABNT_C2', 'ABNT_C2', 'ABNT_C2', KeyCode.ABNT_C2);
		testDeserialization('OEM_4', 'OEM_4', 'OEM_4', KeyCode.BracketLeft);
		testDeserialization('OEM_5', 'OEM_5', 'OEM_5', KeyCode.Backslash);
		testDeserialization('OEM_6', 'OEM_6', 'OEM_6', KeyCode.BracketRight);
		testDeserialization('OEM_7', 'OEM_7', 'OEM_7', KeyCode.Quote);
		testDeserialization('OEM_8', 'OEM_8', 'OEM_8', KeyCode.OEM_8);
		testDeserialization('OEM_102', 'OEM_102', 'OEM_102', KeyCode.IntlBackslash);

		// accepts '-' as separator
		testDeserialization('ctrl-shift-alt-win-a', 'ctrl-shift-alt-cmd-a', 'ctrl-shift-alt-meta-a', KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA);

		// various input mistakes
		testDeserialization(' ctrl-shift-alt-win-A ', ' shift-alt-cmd-Ctrl-A ', ' ctrl-shift-alt-META-A ', KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA);
	});

	test('deserialize scan codes', () => {
		assert.deepStrictEqual(
			KeybindingParser.parseKeybinding('ctrl+shift+[comma] ctrl+/'),
			new Keybinding([new ScanCodeChord(true, true, false, false, ScanCode.Comma), new KeyCodeChord(true, false, false, false, KeyCode.Slash)])
		);
	});

	test('issue #10452 - invalid command', () => {
		const strJSON = `[{ "key": "ctrl+k ctrl+f", "command": ["firstcommand", "seccondcommand"] }]`;
		const userKeybinding = <Object>JSON.parse(strJSON)[0];
		const keybindingItem = KeybindingIO.readUserKeybindingItem(userKeybinding);
		assert.strictEqual(keybindingItem.command, null);
	});

	test('issue #10452 - invalid when', () => {
		const strJSON = `[{ "key": "ctrl+k ctrl+f", "command": "firstcommand", "when": [] }]`;
		const userKeybinding = <Object>JSON.parse(strJSON)[0];
		const keybindingItem = KeybindingIO.readUserKeybindingItem(userKeybinding);
		assert.strictEqual(keybindingItem.when, undefined);
	});

	test('issue #10452 - invalid key', () => {
		const strJSON = `[{ "key": [], "command": "firstcommand" }]`;
		const userKeybinding = <Object>JSON.parse(strJSON)[0];
		const keybindingItem = KeybindingIO.readUserKeybindingItem(userKeybinding);
		assert.deepStrictEqual(keybindingItem.keybinding, null);
	});

	test('issue #10452 - invalid key 2', () => {
		const strJSON = `[{ "key": "", "command": "firstcommand" }]`;
		const userKeybinding = <Object>JSON.parse(strJSON)[0];
		const keybindingItem = KeybindingIO.readUserKeybindingItem(userKeybinding);
		assert.deepStrictEqual(keybindingItem.keybinding, null);
	});

	test('test commands args', () => {
		const strJSON = `[{ "key": "ctrl+k ctrl+f", "command": "firstcommand", "when": [], "args": { "text": "theText" } }]`;
		const userKeybinding = <Object>JSON.parse(strJSON)[0];
		const keybindingItem = KeybindingIO.readUserKeybindingItem(userKeybinding);
		assert.strictEqual((keybindingItem.commandArgs as unknown as { text: string }).text, 'theText');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/fallbackKeyboardMapper.test.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/fallbackKeyboardMapper.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod, ScanCode } from '../../../../../base/common/keyCodes.js';
import { KeyCodeChord, decodeKeybinding, ScanCodeChord, Keybinding } from '../../../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FallbackKeyboardMapper } from '../../common/fallbackKeyboardMapper.js';
import { IResolvedKeybinding, assertResolveKeyboardEvent, assertResolveKeybinding } from './keyboardMapperTestUtils.js';

suite('keyboardMapper - MAC fallback', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const mapper = new FallbackKeyboardMapper(false, OperatingSystem.Macintosh);

	function _assertResolveKeybinding(k: number, expected: IResolvedKeybinding[]): void {
		assertResolveKeybinding(mapper, decodeKeybinding(k, OperatingSystem.Macintosh)!, expected);
	}

	test('resolveKeybinding Cmd+Z', () => {
		_assertResolveKeybinding(
			KeyMod.CtrlCmd | KeyCode.KeyZ,
			[{
				label: '⌘Z',
				ariaLabel: 'Command+Z',
				electronAccelerator: 'Cmd+Z',
				userSettingsLabel: 'cmd+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['meta+Z'],
				singleModifierDispatchParts: [null],
			}]
		);
	});

	test('resolveKeybinding Cmd+K Cmd+=', () => {
		_assertResolveKeybinding(
			KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Equal),
			[{
				label: '⌘K ⌘=',
				ariaLabel: 'Command+K Command+=',
				electronAccelerator: null,
				userSettingsLabel: 'cmd+k cmd+=',
				isWYSIWYG: true,
				isMultiChord: true,
				dispatchParts: ['meta+K', 'meta+='],
				singleModifierDispatchParts: [null, null],
			}]
		);
	});

	test('resolveKeyboardEvent Cmd+Z', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				metaKey: true,
				altGraphKey: false,
				keyCode: KeyCode.KeyZ,
				code: null!
			},
			{
				label: '⌘Z',
				ariaLabel: 'Command+Z',
				electronAccelerator: 'Cmd+Z',
				userSettingsLabel: 'cmd+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['meta+Z'],
				singleModifierDispatchParts: [null],
			}
		);
	});

	test('resolveUserBinding Cmd+[Comma] Cmd+/', () => {
		assertResolveKeybinding(
			mapper, new Keybinding([
				new ScanCodeChord(false, false, false, true, ScanCode.Comma),
				new KeyCodeChord(false, false, false, true, KeyCode.Slash),
			]),
			[{
				label: '⌘, ⌘/',
				ariaLabel: 'Command+, Command+/',
				electronAccelerator: null,
				userSettingsLabel: 'cmd+, cmd+/',
				isWYSIWYG: true,
				isMultiChord: true,
				dispatchParts: ['meta+,', 'meta+/'],
				singleModifierDispatchParts: [null, null],
			}]
		);
	});

	test('resolveKeyboardEvent Single Modifier Meta+', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				metaKey: true,
				altGraphKey: false,
				keyCode: KeyCode.Meta,
				code: null!
			},
			{
				label: '⌘',
				ariaLabel: 'Command',
				electronAccelerator: null,
				userSettingsLabel: 'cmd',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: [null],
				singleModifierDispatchParts: ['meta'],
			}
		);
	});

	test('resolveKeyboardEvent Single Modifier Shift+', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: true,
				altKey: false,
				metaKey: false,
				altGraphKey: false,
				keyCode: KeyCode.Shift,
				code: null!
			},
			{
				label: '⇧',
				ariaLabel: 'Shift',
				electronAccelerator: null,
				userSettingsLabel: 'shift',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: [null],
				singleModifierDispatchParts: ['shift'],
			}
		);
	});

	test('resolveKeyboardEvent Single Modifier Alt+', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: true,
				metaKey: false,
				altGraphKey: false,
				keyCode: KeyCode.Alt,
				code: null!
			},
			{
				label: '⌥',
				ariaLabel: 'Option',
				electronAccelerator: null,
				userSettingsLabel: 'alt',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: [null],
				singleModifierDispatchParts: ['alt'],
			}
		);
	});

	test('resolveKeyboardEvent Only Modifiers Ctrl+Shift+', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: true,
				shiftKey: true,
				altKey: false,
				metaKey: false,
				altGraphKey: false,
				keyCode: KeyCode.Shift,
				code: null!
			},
			{
				label: '⌃⇧',
				ariaLabel: 'Control+Shift',
				electronAccelerator: null,
				userSettingsLabel: 'ctrl+shift',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: [null],
				singleModifierDispatchParts: [null],
			}
		);
	});

	test('resolveKeyboardEvent mapAltGrToCtrlAlt AltGr+Z', () => {
		const mapper = new FallbackKeyboardMapper(true, OperatingSystem.Macintosh);

		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				metaKey: false,
				altGraphKey: true,
				keyCode: KeyCode.KeyZ,
				code: null!
			},
			{
				label: '⌃⌥Z',
				ariaLabel: 'Control+Option+Z',
				electronAccelerator: 'Ctrl+Alt+Z',
				userSettingsLabel: 'ctrl+alt+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['ctrl+alt+Z'],
				singleModifierDispatchParts: [null],
			}
		);
	});
});

suite('keyboardMapper - LINUX fallback', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const mapper = new FallbackKeyboardMapper(false, OperatingSystem.Linux);

	function _assertResolveKeybinding(k: number, expected: IResolvedKeybinding[]): void {
		assertResolveKeybinding(mapper, decodeKeybinding(k, OperatingSystem.Linux)!, expected);
	}

	test('resolveKeybinding Ctrl+Z', () => {
		_assertResolveKeybinding(
			KeyMod.CtrlCmd | KeyCode.KeyZ,
			[{
				label: 'Ctrl+Z',
				ariaLabel: 'Control+Z',
				electronAccelerator: 'Ctrl+Z',
				userSettingsLabel: 'ctrl+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['ctrl+Z'],
				singleModifierDispatchParts: [null],
			}]
		);
	});

	test('resolveKeybinding Ctrl+K Ctrl+=', () => {
		_assertResolveKeybinding(
			KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Equal),
			[{
				label: 'Ctrl+K Ctrl+=',
				ariaLabel: 'Control+K Control+=',
				electronAccelerator: null,
				userSettingsLabel: 'ctrl+k ctrl+=',
				isWYSIWYG: true,
				isMultiChord: true,
				dispatchParts: ['ctrl+K', 'ctrl+='],
				singleModifierDispatchParts: [null, null],
			}]
		);
	});

	test('resolveKeyboardEvent Ctrl+Z', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: true,
				shiftKey: false,
				altKey: false,
				metaKey: false,
				altGraphKey: false,
				keyCode: KeyCode.KeyZ,
				code: null!
			},
			{
				label: 'Ctrl+Z',
				ariaLabel: 'Control+Z',
				electronAccelerator: 'Ctrl+Z',
				userSettingsLabel: 'ctrl+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['ctrl+Z'],
				singleModifierDispatchParts: [null],
			}
		);
	});

	test('resolveUserBinding Ctrl+[Comma] Ctrl+/', () => {
		assertResolveKeybinding(
			mapper, new Keybinding([
				new ScanCodeChord(true, false, false, false, ScanCode.Comma),
				new KeyCodeChord(true, false, false, false, KeyCode.Slash),
			]),
			[{
				label: 'Ctrl+, Ctrl+/',
				ariaLabel: 'Control+, Control+/',
				electronAccelerator: null,
				userSettingsLabel: 'ctrl+, ctrl+/',
				isWYSIWYG: true,
				isMultiChord: true,
				dispatchParts: ['ctrl+,', 'ctrl+/'],
				singleModifierDispatchParts: [null, null],
			}]
		);
	});

	test('resolveUserBinding Ctrl+[Comma]', () => {
		assertResolveKeybinding(
			mapper, new Keybinding([
				new ScanCodeChord(true, false, false, false, ScanCode.Comma),
			]),
			[{
				label: 'Ctrl+,',
				ariaLabel: 'Control+,',
				electronAccelerator: 'Ctrl+,',
				userSettingsLabel: 'ctrl+,',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['ctrl+,'],
				singleModifierDispatchParts: [null],
			}]
		);
	});

	test('resolveKeyboardEvent Single Modifier Ctrl+', () => {
		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: true,
				shiftKey: false,
				altKey: false,
				metaKey: false,
				altGraphKey: false,
				keyCode: KeyCode.Ctrl,
				code: null!
			},
			{
				label: 'Ctrl',
				ariaLabel: 'Control',
				electronAccelerator: null,
				userSettingsLabel: 'ctrl',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: [null],
				singleModifierDispatchParts: ['ctrl'],
			}
		);
	});

	test('resolveKeyboardEvent mapAltGrToCtrlAlt AltGr+Z', () => {
		const mapper = new FallbackKeyboardMapper(true, OperatingSystem.Linux);

		assertResolveKeyboardEvent(
			mapper,
			{
				_standardKeyboardEventBrand: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				metaKey: false,
				altGraphKey: true,
				keyCode: KeyCode.KeyZ,
				code: null!
			},
			{
				label: 'Ctrl+Alt+Z',
				ariaLabel: 'Control+Alt+Z',
				electronAccelerator: 'Ctrl+Alt+Z',
				userSettingsLabel: 'ctrl+alt+z',
				isWYSIWYG: true,
				isMultiChord: false,
				dispatchParts: ['ctrl+alt+Z'],
				singleModifierDispatchParts: [null],
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/keyboardMapperTestUtils.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/keyboardMapperTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import assert from 'assert';
import * as path from '../../../../../base/common/path.js';
import { SingleModifierChord, ResolvedKeybinding, Keybinding } from '../../../../../base/common/keybindings.js';
import { Promises } from '../../../../../base/node/pfs.js';
import { IKeyboardEvent } from '../../../../../platform/keybinding/common/keybinding.js';
import { IKeyboardMapper } from '../../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { FileAccess } from '../../../../../base/common/network.js';

export interface IResolvedKeybinding {
	label: string | null;
	ariaLabel: string | null;
	electronAccelerator: string | null;
	userSettingsLabel: string | null;
	isWYSIWYG: boolean;
	isMultiChord: boolean;
	dispatchParts: (string | null)[];
	singleModifierDispatchParts: (SingleModifierChord | null)[];
}

function toIResolvedKeybinding(kb: ResolvedKeybinding): IResolvedKeybinding {
	return {
		label: kb.getLabel(),
		ariaLabel: kb.getAriaLabel(),
		electronAccelerator: kb.getElectronAccelerator(),
		userSettingsLabel: kb.getUserSettingsLabel(),
		isWYSIWYG: kb.isWYSIWYG(),
		isMultiChord: kb.hasMultipleChords(),
		dispatchParts: kb.getDispatchChords(),
		singleModifierDispatchParts: kb.getSingleModifierDispatchChords()
	};
}

export function assertResolveKeyboardEvent(mapper: IKeyboardMapper, keyboardEvent: IKeyboardEvent, expected: IResolvedKeybinding): void {
	const actual = toIResolvedKeybinding(mapper.resolveKeyboardEvent(keyboardEvent));
	assert.deepStrictEqual(actual, expected);
}

export function assertResolveKeybinding(mapper: IKeyboardMapper, keybinding: Keybinding, expected: IResolvedKeybinding[]): void {
	const actual: IResolvedKeybinding[] = mapper.resolveKeybinding(keybinding).map(toIResolvedKeybinding);
	assert.deepStrictEqual(actual, expected);
}

export function readRawMapping<T>(file: string): Promise<T> {
	return fs.promises.readFile(FileAccess.asFileUri(`vs/workbench/services/keybinding/test/node/${file}.js`).fsPath).then((buff) => {
		const contents = buff.toString();
		const func = new Function('define', contents);// CodeQL [SM01632] This is used in tests and we read the files as JS to avoid slowing down TS compilation
		let rawMappings: T | null = null;
		func(function (value: T) {
			rawMappings = value;
		});
		return rawMappings!;
	});
}

export function assertMapping(writeFileIfDifferent: boolean, mapper: IKeyboardMapper, file: string): Promise<void> {
	const filePath = path.normalize(FileAccess.asFileUri(`vs/workbench/services/keybinding/test/node/${file}`).fsPath);

	return fs.promises.readFile(filePath).then((buff) => {
		const expected = buff.toString().replace(/\r\n/g, '\n');
		const actual = mapper.dumpDebugInfo().replace(/\r\n/g, '\n');
		if (actual !== expected && writeFileIfDifferent) {
			const destPath = filePath.replace(/[\/\\]out[\/\\]vs[\/\\]workbench/, '/src/vs/workbench');
			Promises.writeFile(destPath, actual);
		}
		assert.deepStrictEqual(actual, expected);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/test/node/linux_de_ch.js]---
Location: vscode-main/src/vs/workbench/services/keybinding/test/node/linux_de_ch.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

define({
	Sleep: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	WakeUp: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	KeyA: {
		value: 'a',
		withShift: 'A',
		withAltGr: 'æ',
		withShiftAltGr: 'Æ'
	},
	KeyB: {
		value: 'b',
		withShift: 'B',
		withAltGr: '”',
		withShiftAltGr: '’'
	},
	KeyC: {
		value: 'c',
		withShift: 'C',
		withAltGr: '¢',
		withShiftAltGr: '©'
	},
	KeyD: {
		value: 'd',
		withShift: 'D',
		withAltGr: 'ð',
		withShiftAltGr: 'Ð'
	},
	KeyE: {
		value: 'e',
		withShift: 'E',
		withAltGr: '€',
		withShiftAltGr: 'E'
	},
	KeyF: {
		value: 'f',
		withShift: 'F',
		withAltGr: 'đ',
		withShiftAltGr: 'ª'
	},
	KeyG: {
		value: 'g',
		withShift: 'G',
		withAltGr: 'ŋ',
		withShiftAltGr: 'Ŋ'
	},
	KeyH: {
		value: 'h',
		withShift: 'H',
		withAltGr: 'ħ',
		withShiftAltGr: 'Ħ'
	},
	KeyI: {
		value: 'i',
		withShift: 'I',
		withAltGr: '→',
		withShiftAltGr: 'ı'
	},
	KeyJ: {
		value: 'j',
		withShift: 'J',
		withAltGr: '̉',
		withShiftAltGr: '̛'
	},
	KeyK: {
		value: 'k',
		withShift: 'K',
		withAltGr: 'ĸ',
		withShiftAltGr: '&'
	},
	KeyL: {
		value: 'l',
		withShift: 'L',
		withAltGr: 'ł',
		withShiftAltGr: 'Ł'
	},
	KeyM: {
		value: 'm',
		withShift: 'M',
		withAltGr: 'µ',
		withShiftAltGr: 'º'
	},
	KeyN: {
		value: 'n',
		withShift: 'N',
		withAltGr: 'n',
		withShiftAltGr: 'N'
	},
	KeyO: {
		value: 'o',
		withShift: 'O',
		withAltGr: 'œ',
		withShiftAltGr: 'Œ'
	},
	KeyP: {
		value: 'p',
		withShift: 'P',
		withAltGr: 'þ',
		withShiftAltGr: 'Þ'
	},
	KeyQ: {
		value: 'q',
		withShift: 'Q',
		withAltGr: '@',
		withShiftAltGr: 'Ω'
	},
	KeyR: {
		value: 'r',
		withShift: 'R',
		withAltGr: '¶',
		withShiftAltGr: '®'
	},
	KeyS: {
		value: 's',
		withShift: 'S',
		withAltGr: 'ß',
		withShiftAltGr: '§'
	},
	KeyT: {
		value: 't',
		withShift: 'T',
		withAltGr: 'ŧ',
		withShiftAltGr: 'Ŧ'
	},
	KeyU: {
		value: 'u',
		withShift: 'U',
		withAltGr: '↓',
		withShiftAltGr: '↑'
	},
	KeyV: {
		value: 'v',
		withShift: 'V',
		withAltGr: '“',
		withShiftAltGr: '‘'
	},
	KeyW: {
		value: 'w',
		withShift: 'W',
		withAltGr: 'ł',
		withShiftAltGr: 'Ł'
	},
	KeyX: {
		value: 'x',
		withShift: 'X',
		withAltGr: '»',
		withShiftAltGr: '>'
	},
	KeyY: {
		value: 'z',
		withShift: 'Z',
		withAltGr: '←',
		withShiftAltGr: '¥'
	},
	KeyZ: {
		value: 'y',
		withShift: 'Y',
		withAltGr: '«',
		withShiftAltGr: '<'
	},
	Digit1: {
		value: '1',
		withShift: '+',
		withAltGr: '|',
		withShiftAltGr: '¡'
	},
	Digit2: {
		value: '2',
		withShift: '"',
		withAltGr: '@',
		withShiftAltGr: '⅛'
	},
	Digit3: {
		value: '3',
		withShift: '*',
		withAltGr: '#',
		withShiftAltGr: '£'
	},
	Digit4: {
		value: '4',
		withShift: 'ç',
		withAltGr: '¼',
		withShiftAltGr: '$'
	},
	Digit5: {
		value: '5',
		withShift: '%',
		withAltGr: '½',
		withShiftAltGr: '⅜'
	},
	Digit6: {
		value: '6',
		withShift: '&',
		withAltGr: '¬',
		withShiftAltGr: '⅝'
	},
	Digit7: {
		value: '7',
		withShift: '/',
		withAltGr: '|',
		withShiftAltGr: '⅞'
	},
	Digit8: {
		value: '8',
		withShift: '(',
		withAltGr: '¢',
		withShiftAltGr: '™'
	},
	Digit9: {
		value: '9',
		withShift: ')',
		withAltGr: ']',
		withShiftAltGr: '±'
	},
	Digit0: {
		value: '0',
		withShift: '=',
		withAltGr: '}',
		withShiftAltGr: '°'
	},
	Enter: {
		value: '\r',
		withShift: '\r',
		withAltGr: '\r',
		withShiftAltGr: '\r'
	},
	Escape: {
		value: '\u001b',
		withShift: '\u001b',
		withAltGr: '\u001b',
		withShiftAltGr: '\u001b'
	},
	Backspace: {
		value: '\b',
		withShift: '\b',
		withAltGr: '\b',
		withShiftAltGr: '\b'
	},
	Tab: {
		value: '\t',
		withShift: '',
		withAltGr: '\t',
		withShiftAltGr: ''
	},
	Space: {
		value: ' ',
		withShift: ' ',
		withAltGr: ' ',
		withShiftAltGr: ' '
	},
	Minus: {
		value: '\'',
		withShift: '?',
		withAltGr: '́',
		withShiftAltGr: '¿'
	},
	Equal: {
		value: '̂',
		withShift: '̀',
		withAltGr: '̃',
		withShiftAltGr: '̨'
	},
	BracketLeft: {
		value: 'ü',
		withShift: 'è',
		withAltGr: '[',
		withShiftAltGr: '̊'
	},
	BracketRight: {
		value: '̈',
		withShift: '!',
		withAltGr: ']',
		withShiftAltGr: '̄'
	},
	Backslash: {
		value: '$',
		withShift: '£',
		withAltGr: '}',
		withShiftAltGr: '̆'
	},
	Semicolon: {
		value: 'ö',
		withShift: 'é',
		withAltGr: '́',
		withShiftAltGr: '̋'
	},
	Quote: {
		value: 'ä',
		withShift: 'à',
		withAltGr: '{',
		withShiftAltGr: '̌'
	},
	Backquote: {
		value: '§',
		withShift: '°',
		withAltGr: '¬',
		withShiftAltGr: '¬'
	},
	Comma: {
		value: ',',
		withShift: ';',
		withAltGr: '─',
		withShiftAltGr: '×'
	},
	Period: {
		value: '.',
		withShift: ':',
		withAltGr: '·',
		withShiftAltGr: '÷'
	},
	Slash: {
		value: '-',
		withShift: '_',
		withAltGr: '̣',
		withShiftAltGr: '̇'
	},
	CapsLock: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F1: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F2: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F3: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F4: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F5: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F6: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F7: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F8: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F9: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F10: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F11: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F12: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	PrintScreen: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ScrollLock: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Pause: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Insert: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Home: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	PageUp: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Delete: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	End: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	PageDown: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ArrowRight: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ArrowLeft: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ArrowDown: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ArrowUp: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NumLock: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NumpadDivide: {
		value: '/',
		withShift: '/',
		withAltGr: '/',
		withShiftAltGr: '/'
	},
	NumpadMultiply: {
		value: '*',
		withShift: '*',
		withAltGr: '*',
		withShiftAltGr: '*'
	},
	NumpadSubtract: {
		value: '-',
		withShift: '-',
		withAltGr: '-',
		withShiftAltGr: '-'
	},
	NumpadAdd: {
		value: '+',
		withShift: '+',
		withAltGr: '+',
		withShiftAltGr: '+'
	},
	NumpadEnter: {
		value: '\r',
		withShift: '\r',
		withAltGr: '\r',
		withShiftAltGr: '\r'
	},
	Numpad1: { value: '', withShift: '1', withAltGr: '', withShiftAltGr: '1' },
	Numpad2: { value: '', withShift: '2', withAltGr: '', withShiftAltGr: '2' },
	Numpad3: { value: '', withShift: '3', withAltGr: '', withShiftAltGr: '3' },
	Numpad4: { value: '', withShift: '4', withAltGr: '', withShiftAltGr: '4' },
	Numpad5: { value: '', withShift: '5', withAltGr: '', withShiftAltGr: '5' },
	Numpad6: { value: '', withShift: '6', withAltGr: '', withShiftAltGr: '6' },
	Numpad7: { value: '', withShift: '7', withAltGr: '', withShiftAltGr: '7' },
	Numpad8: { value: '', withShift: '8', withAltGr: '', withShiftAltGr: '8' },
	Numpad9: { value: '', withShift: '9', withAltGr: '', withShiftAltGr: '9' },
	Numpad0: { value: '', withShift: '0', withAltGr: '', withShiftAltGr: '0' },
	NumpadDecimal: { value: '', withShift: '.', withAltGr: '', withShiftAltGr: '.' },
	IntlBackslash: {
		value: '<',
		withShift: '>',
		withAltGr: '\\',
		withShiftAltGr: '¦'
	},
	ContextMenu: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Power: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NumpadEqual: {
		value: '=',
		withShift: '=',
		withAltGr: '=',
		withShiftAltGr: '='
	},
	F13: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F14: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F15: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F16: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F17: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F18: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F19: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F20: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F21: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F22: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F23: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	F24: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Open: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Help: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Select: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Again: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Undo: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Cut: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Copy: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Paste: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Find: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	AudioVolumeMute: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	AudioVolumeUp: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	AudioVolumeDown: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NumpadComma: {
		value: '.',
		withShift: '.',
		withAltGr: '.',
		withShiftAltGr: '.'
	},
	IntlRo: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	KanaMode: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	IntlYen: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Convert: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NonConvert: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Lang1: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Lang2: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Lang3: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Lang4: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Lang5: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	NumpadParenLeft: {
		value: '(',
		withShift: '(',
		withAltGr: '(',
		withShiftAltGr: '('
	},
	NumpadParenRight: {
		value: ')',
		withShift: ')',
		withAltGr: ')',
		withShiftAltGr: ')'
	},
	ControlLeft: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ShiftLeft: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	AltLeft: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MetaLeft: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ControlRight: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	ShiftRight: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	AltRight: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MetaRight: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrightnessUp: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrightnessDown: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaPlay: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaRecord: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaFastForward: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaRewind: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaTrackNext: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaTrackPrevious: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaStop: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	Eject: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaPlayPause: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MediaSelect: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	LaunchMail: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	LaunchApp2: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	LaunchApp1: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	SelectTask: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	LaunchScreenSaver: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserSearch: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserHome: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserBack: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserForward: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserStop: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserRefresh: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	BrowserFavorites: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MailReply: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MailForward: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' },
	MailSend: { value: '', withShift: '', withAltGr: '', withShiftAltGr: '' }
});
```

--------------------------------------------------------------------------------

````

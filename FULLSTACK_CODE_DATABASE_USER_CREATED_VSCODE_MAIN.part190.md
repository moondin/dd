---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 190
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 190 of 552)

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

---[FILE: src/vs/base/test/common/jsonParse.test.ts]---
Location: vscode-main/src/vs/base/test/common/jsonParse.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';

import { parse, stripComments } from '../../common/jsonc.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('JSON Parse', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Line comment', () => {
		const content: string = [
			'{',
			'  "prop": 10 // a comment',
			'}',
		].join('\n');
		const expected = [
			'{',
			'  "prop": 10 ',
			'}',
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Line comment - EOF', () => {
		const content: string = [
			'{',
			'}',
			'// a comment'
		].join('\n');
		const expected = [
			'{',
			'}',
			''
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Line comment - \\r\\n', () => {
		const content: string = [
			'{',
			'  "prop": 10 // a comment',
			'}',
		].join('\r\n');
		const expected = [
			'{',
			'  "prop": 10 ',
			'}',
		].join('\r\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Line comment - EOF - \\r\\n', () => {
		const content: string = [
			'{',
			'}',
			'// a comment'
		].join('\r\n');
		const expected = [
			'{',
			'}',
			''
		].join('\r\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Block comment - single line', () => {
		const content: string = [
			'{',
			'  /* before */"prop": 10/* after */',
			'}',
		].join('\n');
		const expected = [
			'{',
			'  "prop": 10',
			'}',
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Block comment - multi line', () => {
		const content: string = [
			'{',
			'  /**',
			'   * Some comment',
			'   */',
			'  "prop": 10',
			'}',
		].join('\n');
		const expected = [
			'{',
			'  ',
			'  "prop": 10',
			'}',
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Block comment - shortest match', () => {
		const content = '/* abc */ */';
		const expected = ' */';
		assert.strictEqual(stripComments(content), expected);
	});
	test('No strings - double quote', () => {
		const content: string = [
			'{',
			'  "/* */": 10',
			'}'
		].join('\n');
		const expected: string = [
			'{',
			'  "/* */": 10',
			'}'
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('No strings - single quote', () => {
		const content: string = [
			'{',
			`  '/* */': 10`,
			'}'
		].join('\n');
		const expected: string = [
			'{',
			`  '/* */': 10`,
			'}'
		].join('\n');
		assert.strictEqual(stripComments(content), expected);
	});
	test('Trailing comma in object', () => {
		const content: string = [
			'{',
			`  "a": 10,`,
			'}'
		].join('\n');
		const expected: string = [
			'{',
			`  "a": 10`,
			'}'
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});
	test('Trailing comma in array', () => {
		const content: string = [
			`[ "a", "b", "c", ]`
		].join('\n');
		const expected: string = [
			`[ "a", "b", "c" ]`
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});

	test('Trailing comma', () => {
		const content: string = [
			'{',
			'  "propA": 10, // a comment',
			'  "propB": false, // a trailing comma',
			'}',
		].join('\n');
		const expected = [
			'{',
			'  "propA": 10,',
			'  "propB": false',
			'}',
		].join('\n');
		assert.deepEqual(parse(content), JSON.parse(expected));
	});

	test('Trailing comma - EOF', () => {
		const content = `
// This configuration file allows you to pass permanent command line arguments to VS Code.
// Only a subset of arguments is currently supported to reduce the likelihood of breaking
// the installation.
//
// PLEASE DO NOT CHANGE WITHOUT UNDERSTANDING THE IMPACT
//
// NOTE: Changing this file requires a restart of VS Code.
{
	// Use software rendering instead of hardware accelerated rendering.
	// This can help in cases where you see rendering issues in VS Code.
	// "disable-hardware-acceleration": true,
	// Allows to disable crash reporting.
	// Should restart the app if the value is changed.
	"enable-crash-reporter": true,
	// Unique id used for correlating crash reports sent from this instance.
	// Do not edit this value.
	"crash-reporter-id": "aaaaab31-7453-4506-97d0-93411b2c21c7",
	"locale": "en",
	// "log-level": "trace"
}
`;
		assert.deepEqual(parse(content), {
			'enable-crash-reporter': true,
			'crash-reporter-id': 'aaaaab31-7453-4506-97d0-93411b2c21c7',
			'locale': 'en'
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/jsonSchema.test.ts]---
Location: vscode-main/src/vs/base/test/common/jsonSchema.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { getCompressedContent, IJSONSchema } from '../../common/jsonSchema.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('JSON Schema', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('getCompressedContent 1', () => {

		const schema: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					description: 'a',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				},
				e: {
					type: 'object',
					description: 'e',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				}
			}
		};

		const expected: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					description: 'a',
					properties: {
						b: {
							$ref: '#/$defs/_0'
						}
					}
				},
				e: {
					type: 'object',
					description: 'e',
					properties: {
						b: {
							$ref: '#/$defs/_0'
						}
					}
				}
			},
			$defs: {
				'_0': {
					type: 'object',
					properties: {
						c: {
							type: 'object',
							properties: {
								d: {
									type: 'string'
								}
							}
						}
					}
				}
			}

		};

		assert.deepEqual(getCompressedContent(schema), JSON.stringify(expected));
	});

	test('getCompressedContent 2', () => {

		const schema: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				},
				e: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				}
			}
		};

		const expected: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					$ref: '#/$defs/_0'

				},
				e: {
					$ref: '#/$defs/_0'
				}
			},
			$defs: {
				'_0': {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				}
			}

		};

		assert.deepEqual(getCompressedContent(schema), JSON.stringify(expected));
	});

	test('getCompressedContent 3', () => {


		const schema: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					oneOf: [
						{
							allOf: [
								{
									properties: {
										name: {
											type: 'string'
										},
										description: {
											type: 'string'
										}
									}
								},
								{
									properties: {
										street: {
											type: 'string'
										},
									}
								}
							]
						},
						{
							allOf: [
								{
									properties: {
										name: {
											type: 'string'
										},
										description: {
											type: 'string'
										}
									}
								},
								{
									properties: {
										river: {
											type: 'string'
										},
									}
								}
							]
						},
						{
							allOf: [
								{
									properties: {
										name: {
											type: 'string'
										},
										description: {
											type: 'string'
										}
									}
								},
								{
									properties: {
										mountain: {
											type: 'string'
										},
									}
								}
							]
						}
					]
				},
				b: {
					type: 'object',
					properties: {
						street: {
							properties: {
								street: {
									type: 'string'
								}
							}
						}
					}
				}
			}
		};

		const expected: IJSONSchema = {
			'type': 'object',
			'properties': {
				'a': {
					'type': 'object',
					'oneOf': [
						{
							'allOf': [
								{
									'$ref': '#/$defs/_0'
								},
								{
									'$ref': '#/$defs/_1'
								}
							]
						},
						{
							'allOf': [
								{
									'$ref': '#/$defs/_0'
								},
								{
									'properties': {
										'river': {
											'type': 'string'
										}
									}
								}
							]
						},
						{
							'allOf': [
								{
									'$ref': '#/$defs/_0'
								},
								{
									'properties': {
										'mountain': {
											'type': 'string'
										}
									}
								}
							]
						}
					]
				},
				'b': {
					'type': 'object',
					'properties': {
						'street': {
							'$ref': '#/$defs/_1'
						}
					}
				}
			},
			'$defs': {
				'_0': {
					'properties': {
						'name': {
							'type': 'string'
						},
						'description': {
							'type': 'string'
						}
					}
				},
				'_1': {
					'properties': {
						'street': {
							'type': 'string'
						}
					}
				}
			}
		};

		const actual = getCompressedContent(schema);
		assert.deepEqual(actual, JSON.stringify(expected));
	});

	test('getCompressedContent 4', () => {

		const schema: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				},
				e: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				},
				f: {
					type: 'object',
					properties: {
						d: {
							type: 'string'
						}
					}
				}
			}
		};

		const expected: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					$ref: '#/$defs/_0'
				},
				e: {
					$ref: '#/$defs/_0'
				},
				f: {
					$ref: '#/$defs/_1'
				}
			},
			$defs: {
				'_0': {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									$ref: '#/$defs/_1'
								}
							}
						}
					}
				},
				'_1': {
					type: 'object',
					properties: {
						d: {
							type: 'string'
						}
					}
				}
			}

		};

		assert.deepEqual(getCompressedContent(schema), JSON.stringify(expected));
	});

	test('getCompressedContent 5', () => {

		const schema: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							c: {
								type: 'object',
								properties: {
									d: {
										type: 'string'
									}
								}
							}
						}
					}
				},
				e: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							c: {
								type: 'object',
								properties: {
									d: {
										type: 'string'
									}
								}
							}
						}
					}
				},
				f: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				},
				g: {
					type: 'object',
					properties: {
						b: {
							type: 'object',
							properties: {
								c: {
									type: 'object',
									properties: {
										d: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				}
			}
		};

		const expected: IJSONSchema = {
			type: 'object',
			properties: {
				a: {
					$ref: '#/$defs/_0'
				},
				e: {
					$ref: '#/$defs/_0'
				},
				f: {
					$ref: '#/$defs/_1'
				},
				g: {
					$ref: '#/$defs/_1'
				}
			},
			$defs: {
				'_0': {
					type: 'array',
					items: {
						$ref: '#/$defs/_2'
					}
				},
				'_1': {
					type: 'object',
					properties: {
						b: {
							$ref: '#/$defs/_2'
						}
					}
				},
				'_2': {
					type: 'object',
					properties: {
						c: {
							type: 'object',
							properties: {
								d: {
									type: 'string'
								}
							}
						}
					}
				}
			}

		};

		assert.deepEqual(getCompressedContent(schema), JSON.stringify(expected));
	});


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/keybindings.test.ts]---
Location: vscode-main/src/vs/base/test/common/keybindings.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { KeyCode, ScanCode } from '../../common/keyCodes.js';
import { KeyCodeChord, ScanCodeChord } from '../../common/keybindings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('keyCodes', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #173325: wrong interpretations of special keys (e.g. [Equal] is mistaken for V)', () => {
		const a = new KeyCodeChord(true, false, false, false, KeyCode.KeyV);
		const b = new ScanCodeChord(true, false, false, false, ScanCode.Equal);
		assert.strictEqual(a.getHashCode() === b.getHashCode(), false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/keyCodes.test.ts]---
Location: vscode-main/src/vs/base/test/common/keyCodes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { EVENT_KEY_CODE_MAP, IMMUTABLE_CODE_TO_KEY_CODE, IMMUTABLE_KEY_CODE_TO_CODE, KeyChord, KeyCode, KeyCodeUtils, KeyMod, NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE, ScanCode, ScanCodeUtils } from '../../common/keyCodes.js';
import { decodeKeybinding, KeyCodeChord, Keybinding } from '../../common/keybindings.js';
import { OperatingSystem } from '../../common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('keyCodes', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testBinaryEncoding(expected: Keybinding | null, k: number, OS: OperatingSystem): void {
		assert.deepStrictEqual(decodeKeybinding(k, OS), expected);
	}

	test('mapping for Minus', () => {
		// [147, 83, 0, ScanCode.Minus, 'Minus', KeyCode.US_MINUS, '-', 189, 'VK_OEM_MINUS', '-', 'OEM_MINUS'],
		assert.strictEqual(EVENT_KEY_CODE_MAP[189], KeyCode.Minus);
		assert.strictEqual(NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE['VK_OEM_MINUS'], KeyCode.Minus);
		assert.strictEqual(ScanCodeUtils.lowerCaseToEnum('minus'), ScanCode.Minus);
		assert.strictEqual(ScanCodeUtils.toEnum('Minus'), ScanCode.Minus);
		assert.strictEqual(ScanCodeUtils.toString(ScanCode.Minus), 'Minus');
		assert.strictEqual(IMMUTABLE_CODE_TO_KEY_CODE[ScanCode.Minus], KeyCode.DependsOnKbLayout);
		assert.strictEqual(IMMUTABLE_KEY_CODE_TO_CODE[KeyCode.Minus], ScanCode.DependsOnKbLayout);
		assert.strictEqual(KeyCodeUtils.toString(KeyCode.Minus), '-');
		assert.strictEqual(KeyCodeUtils.fromString('-'), KeyCode.Minus);
		assert.strictEqual(KeyCodeUtils.toUserSettingsUS(KeyCode.Minus), '-');
		assert.strictEqual(KeyCodeUtils.toUserSettingsGeneral(KeyCode.Minus), 'OEM_MINUS');
		assert.strictEqual(KeyCodeUtils.fromUserSettings('-'), KeyCode.Minus);
		assert.strictEqual(KeyCodeUtils.fromUserSettings('OEM_MINUS'), KeyCode.Minus);
		assert.strictEqual(KeyCodeUtils.fromUserSettings('oem_minus'), KeyCode.Minus);
	});

	test('mapping for Space', () => {
		// [21, 10, 1, ScanCode.Space, 'Space', KeyCode.Space, 'Space', 32, 'VK_SPACE', empty, empty],
		assert.strictEqual(EVENT_KEY_CODE_MAP[32], KeyCode.Space);
		assert.strictEqual(NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE['VK_SPACE'], KeyCode.Space);
		assert.strictEqual(ScanCodeUtils.lowerCaseToEnum('space'), ScanCode.Space);
		assert.strictEqual(ScanCodeUtils.toEnum('Space'), ScanCode.Space);
		assert.strictEqual(ScanCodeUtils.toString(ScanCode.Space), 'Space');
		assert.strictEqual(IMMUTABLE_CODE_TO_KEY_CODE[ScanCode.Space], KeyCode.Space);
		assert.strictEqual(IMMUTABLE_KEY_CODE_TO_CODE[KeyCode.Space], ScanCode.Space);
		assert.strictEqual(KeyCodeUtils.toString(KeyCode.Space), 'Space');
		assert.strictEqual(KeyCodeUtils.fromString('Space'), KeyCode.Space);
		assert.strictEqual(KeyCodeUtils.toUserSettingsUS(KeyCode.Space), 'Space');
		assert.strictEqual(KeyCodeUtils.toUserSettingsGeneral(KeyCode.Space), 'Space');
		assert.strictEqual(KeyCodeUtils.fromUserSettings('Space'), KeyCode.Space);
		assert.strictEqual(KeyCodeUtils.fromUserSettings('space'), KeyCode.Space);
	});

	test('MAC binary encoding', () => {

		function test(expected: Keybinding | null, k: number): void {
			testBinaryEncoding(expected, k, OperatingSystem.Macintosh);
		}

		test(null, 0);
		test(new KeyCodeChord(false, false, false, false, KeyCode.Enter).toKeybinding(), KeyCode.Enter);
		test(new KeyCodeChord(true, false, false, false, KeyCode.Enter).toKeybinding(), KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, false, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Alt | KeyCode.Enter);
		test(new KeyCodeChord(true, false, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, true, false, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyCode.Enter);
		test(new KeyCodeChord(true, true, false, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, true, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
		test(new KeyCodeChord(true, true, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, false, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyCode.Enter);
		test(new KeyCodeChord(true, false, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, false, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter);
		test(new KeyCodeChord(true, false, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, true, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter);
		test(new KeyCodeChord(true, true, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
		test(new KeyCodeChord(false, true, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
		test(new KeyCodeChord(true, true, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);

		test(
			new Keybinding([
				new KeyCodeChord(false, false, false, false, KeyCode.Enter),
				new KeyCodeChord(false, false, false, false, KeyCode.Tab)
			]),
			KeyChord(KeyCode.Enter, KeyCode.Tab)
		);
		test(
			new Keybinding([
				new KeyCodeChord(false, false, false, true, KeyCode.KeyY),
				new KeyCodeChord(false, false, false, false, KeyCode.KeyZ)
			]),
			KeyChord(KeyMod.CtrlCmd | KeyCode.KeyY, KeyCode.KeyZ)
		);
	});

	test('WINDOWS & LINUX binary encoding', () => {

		[OperatingSystem.Linux, OperatingSystem.Windows].forEach((OS) => {

			function test(expected: Keybinding | null, k: number): void {
				testBinaryEncoding(expected, k, OS);
			}

			test(null, 0);
			test(new KeyCodeChord(false, false, false, false, KeyCode.Enter).toKeybinding(), KeyCode.Enter);
			test(new KeyCodeChord(false, false, false, true, KeyCode.Enter).toKeybinding(), KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(false, false, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Alt | KeyCode.Enter);
			test(new KeyCodeChord(false, false, true, true, KeyCode.Enter).toKeybinding(), KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(false, true, false, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyCode.Enter);
			test(new KeyCodeChord(false, true, false, true, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(false, true, true, false, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
			test(new KeyCodeChord(false, true, true, true, KeyCode.Enter).toKeybinding(), KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(true, false, false, false, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyCode.Enter);
			test(new KeyCodeChord(true, false, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(true, false, true, false, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter);
			test(new KeyCodeChord(true, false, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(true, true, false, false, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter);
			test(new KeyCodeChord(true, true, false, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
			test(new KeyCodeChord(true, true, true, false, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
			test(new KeyCodeChord(true, true, true, true, KeyCode.Enter).toKeybinding(), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);

			test(
				new Keybinding([
					new KeyCodeChord(false, false, false, false, KeyCode.Enter),
					new KeyCodeChord(false, false, false, false, KeyCode.Tab)
				]),
				KeyChord(KeyCode.Enter, KeyCode.Tab)
			);
			test(
				new Keybinding([
					new KeyCodeChord(true, false, false, false, KeyCode.KeyY),
					new KeyCodeChord(false, false, false, false, KeyCode.KeyZ)
				]),
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyY, KeyCode.KeyZ)
			);

		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/labels.test.ts]---
Location: vscode-main/src/vs/base/test/common/labels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as labels from '../../common/labels.js';
import { isMacintosh, isWindows, OperatingSystem } from '../../common/platform.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Labels', () => {
	(!isWindows ? test.skip : test)('shorten - windows', () => {

		// nothing to shorten
		assert.deepStrictEqual(labels.shorten(['a']), ['a']);
		assert.deepStrictEqual(labels.shorten(['a', 'b']), ['a', 'b']);
		assert.deepStrictEqual(labels.shorten(['a', 'b', 'c']), ['a', 'b', 'c']);
		assert.deepStrictEqual(labels.shorten(['\\\\x\\a', '\\\\x\\a']), ['\\\\x\\a', '\\\\x\\a']);
		assert.deepStrictEqual(labels.shorten(['C:\\a', 'C:\\b']), ['C:\\a', 'C:\\b']);

		// completely different paths
		assert.deepStrictEqual(labels.shorten(['a\\b', 'c\\d', 'e\\f']), ['…\\b', '…\\d', '…\\f']);

		// same beginning
		assert.deepStrictEqual(labels.shorten(['a', 'a\\b']), ['a', '…\\b']);
		assert.deepStrictEqual(labels.shorten(['a\\b', 'a\\b\\c']), ['…\\b', '…\\c']);
		assert.deepStrictEqual(labels.shorten(['a', 'a\\b', 'a\\b\\c']), ['a', '…\\b', '…\\c']);
		assert.deepStrictEqual(labels.shorten(['x:\\a\\b', 'x:\\a\\c']), ['x:\\…\\b', 'x:\\…\\c']);
		assert.deepStrictEqual(labels.shorten(['\\\\a\\b', '\\\\a\\c']), ['\\\\a\\b', '\\\\a\\c']);

		// same ending
		assert.deepStrictEqual(labels.shorten(['a', 'b\\a']), ['a', 'b\\…']);
		assert.deepStrictEqual(labels.shorten(['a\\b\\c', 'd\\b\\c']), ['a\\…', 'd\\…']);
		assert.deepStrictEqual(labels.shorten(['a\\b\\c\\d', 'f\\b\\c\\d']), ['a\\…', 'f\\…']);
		assert.deepStrictEqual(labels.shorten(['d\\e\\a\\b\\c', 'd\\b\\c']), ['…\\a\\…', 'd\\b\\…']);
		assert.deepStrictEqual(labels.shorten(['a\\b\\c\\d', 'a\\f\\b\\c\\d']), ['a\\b\\…', '…\\f\\…']);
		assert.deepStrictEqual(labels.shorten(['a\\b\\a', 'b\\b\\a']), ['a\\b\\…', 'b\\b\\…']);
		assert.deepStrictEqual(labels.shorten(['d\\f\\a\\b\\c', 'h\\d\\b\\c']), ['…\\a\\…', 'h\\…']);
		assert.deepStrictEqual(labels.shorten(['a\\b\\c', 'x:\\0\\a\\b\\c']), ['a\\b\\c', 'x:\\0\\…']);
		assert.deepStrictEqual(labels.shorten(['x:\\a\\b\\c', 'x:\\0\\a\\b\\c']), ['x:\\a\\…', 'x:\\0\\…']);
		assert.deepStrictEqual(labels.shorten(['x:\\a\\b', 'y:\\a\\b']), ['x:\\…', 'y:\\…']);
		assert.deepStrictEqual(labels.shorten(['x:\\a', 'x:\\c']), ['x:\\a', 'x:\\c']);
		assert.deepStrictEqual(labels.shorten(['x:\\a\\b', 'y:\\x\\a\\b']), ['x:\\…', 'y:\\…']);
		assert.deepStrictEqual(labels.shorten(['\\\\x\\b', '\\\\y\\b']), ['\\\\x\\…', '\\\\y\\…']);
		assert.deepStrictEqual(labels.shorten(['\\\\x\\a', '\\\\x\\b']), ['\\\\x\\a', '\\\\x\\b']);

		// same name ending
		assert.deepStrictEqual(labels.shorten(['a\\b', 'a\\c', 'a\\e-b']), ['…\\b', '…\\c', '…\\e-b']);

		// same in the middle
		assert.deepStrictEqual(labels.shorten(['a\\b\\c', 'd\\b\\e']), ['…\\c', '…\\e']);

		// case-sensetive
		assert.deepStrictEqual(labels.shorten(['a\\b\\c', 'd\\b\\C']), ['…\\c', '…\\C']);

		// empty or null
		assert.deepStrictEqual(labels.shorten(['', null!]), ['.\\', null]);

		assert.deepStrictEqual(labels.shorten(['a', 'a\\b', 'a\\b\\c', 'd\\b\\c', 'd\\b']), ['a', 'a\\b', 'a\\b\\c', 'd\\b\\c', 'd\\b']);
		assert.deepStrictEqual(labels.shorten(['a', 'a\\b', 'b']), ['a', 'a\\b', 'b']);
		assert.deepStrictEqual(labels.shorten(['', 'a', 'b', 'b\\c', 'a\\c']), ['.\\', 'a', 'b', 'b\\c', 'a\\c']);
		assert.deepStrictEqual(labels.shorten(['src\\vs\\workbench\\parts\\execution\\electron-browser', 'src\\vs\\workbench\\parts\\execution\\electron-browser\\something', 'src\\vs\\workbench\\parts\\terminal\\electron-browser']), ['…\\execution\\electron-browser', '…\\something', '…\\terminal\\…']);
	});

	(isWindows ? test.skip : test)('shorten - not windows', () => {

		// nothing to shorten
		assert.deepStrictEqual(labels.shorten(['a']), ['a']);
		assert.deepStrictEqual(labels.shorten(['a', 'b']), ['a', 'b']);
		assert.deepStrictEqual(labels.shorten(['/a', '/b']), ['/a', '/b']);
		assert.deepStrictEqual(labels.shorten(['~/a/b/c', '~/a/b/c']), ['~/a/b/c', '~/a/b/c']);
		assert.deepStrictEqual(labels.shorten(['a', 'b', 'c']), ['a', 'b', 'c']);

		// completely different paths
		assert.deepStrictEqual(labels.shorten(['a/b', 'c/d', 'e/f']), ['…/b', '…/d', '…/f']);

		// same beginning
		assert.deepStrictEqual(labels.shorten(['a', 'a/b']), ['a', '…/b']);
		assert.deepStrictEqual(labels.shorten(['a/b', 'a/b/c']), ['…/b', '…/c']);
		assert.deepStrictEqual(labels.shorten(['a', 'a/b', 'a/b/c']), ['a', '…/b', '…/c']);
		assert.deepStrictEqual(labels.shorten(['/a/b', '/a/c']), ['/a/b', '/a/c']);

		// same ending
		assert.deepStrictEqual(labels.shorten(['a', 'b/a']), ['a', 'b/…']);
		assert.deepStrictEqual(labels.shorten(['a/b/c', 'd/b/c']), ['a/…', 'd/…']);
		assert.deepStrictEqual(labels.shorten(['a/b/c/d', 'f/b/c/d']), ['a/…', 'f/…']);
		assert.deepStrictEqual(labels.shorten(['d/e/a/b/c', 'd/b/c']), ['…/a/…', 'd/b/…']);
		assert.deepStrictEqual(labels.shorten(['a/b/c/d', 'a/f/b/c/d']), ['a/b/…', '…/f/…']);
		assert.deepStrictEqual(labels.shorten(['a/b/a', 'b/b/a']), ['a/b/…', 'b/b/…']);
		assert.deepStrictEqual(labels.shorten(['d/f/a/b/c', 'h/d/b/c']), ['…/a/…', 'h/…']);
		assert.deepStrictEqual(labels.shorten(['/x/b', '/y/b']), ['/x/…', '/y/…']);

		// same name ending
		assert.deepStrictEqual(labels.shorten(['a/b', 'a/c', 'a/e-b']), ['…/b', '…/c', '…/e-b']);

		// same in the middle
		assert.deepStrictEqual(labels.shorten(['a/b/c', 'd/b/e']), ['…/c', '…/e']);

		// case-sensitive
		assert.deepStrictEqual(labels.shorten(['a/b/c', 'd/b/C']), ['…/c', '…/C']);

		// empty or null
		assert.deepStrictEqual(labels.shorten(['', null!]), ['./', null]);

		assert.deepStrictEqual(labels.shorten(['a', 'a/b', 'a/b/c', 'd/b/c', 'd/b']), ['a', 'a/b', 'a/b/c', 'd/b/c', 'd/b']);
		assert.deepStrictEqual(labels.shorten(['a', 'a/b', 'b']), ['a', 'a/b', 'b']);
		assert.deepStrictEqual(labels.shorten(['', 'a', 'b', 'b/c', 'a/c']), ['./', 'a', 'b', 'b/c', 'a/c']);
	});

	test('template', () => {

		// simple
		assert.strictEqual(labels.template('Foo Bar'), 'Foo Bar');
		assert.strictEqual(labels.template('Foo${}Bar'), 'FooBar');
		assert.strictEqual(labels.template('$FooBar'), '');
		assert.strictEqual(labels.template('}FooBar'), '}FooBar');
		assert.strictEqual(labels.template('Foo ${one} Bar', { one: 'value' }), 'Foo value Bar');
		assert.strictEqual(labels.template('Foo ${one} Bar ${two}', { one: 'value', two: 'other value' }), 'Foo value Bar other value');

		// conditional separator
		assert.strictEqual(labels.template('Foo${separator}Bar'), 'FooBar');
		assert.strictEqual(labels.template('Foo${separator}Bar', { separator: { label: ' - ' } }), 'Foo - Bar');
		assert.strictEqual(labels.template('${separator}Foo${separator}Bar', { value: 'something', separator: { label: ' - ' } }), 'Foo - Bar');
		assert.strictEqual(labels.template('${value} Foo${separator}Bar', { value: 'something', separator: { label: ' - ' } }), 'something Foo - Bar');

		// real world example (macOS)
		let t = '${activeEditorShort}${separator}${rootName}';
		assert.strictEqual(labels.template(t, { activeEditorShort: '', rootName: '', separator: { label: ' - ' } }), '');
		assert.strictEqual(labels.template(t, { activeEditorShort: '', rootName: 'root', separator: { label: ' - ' } }), 'root');
		assert.strictEqual(labels.template(t, { activeEditorShort: 'markdown.txt', rootName: 'root', separator: { label: ' - ' } }), 'markdown.txt - root');

		// real world example (other)
		t = '${dirty}${activeEditorShort}${separator}${rootName}${separator}${appName}';
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: '', rootName: '', appName: '', separator: { label: ' - ' } }), '');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: '', rootName: '', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: 'Untitled-1', rootName: '', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'Untitled-1 - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: '', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'monaco - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: 'somefile.txt', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'somefile.txt - monaco - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '* ', activeEditorShort: 'somefile.txt', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), '* somefile.txt - monaco - Visual Studio Code');

		// real world example (other)
		t = '${dirty}${activeEditorShort}${separator}${rootNameShort}${separator}${appName}';
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorShort: '', rootName: 'monaco (Workspace)', rootNameShort: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'monaco - Visual Studio Code');
	});

	test('mnemonicButtonLabel', () => {
		assert.strictEqual(labels.mnemonicButtonLabel('Hello World').withMnemonic, 'Hello World');
		assert.strictEqual(labels.mnemonicButtonLabel('').withMnemonic, '');
		if (isWindows) {
			assert.strictEqual(labels.mnemonicButtonLabel('Hello & World').withMnemonic, 'Hello && World');
			assert.strictEqual(labels.mnemonicButtonLabel('Do &&not Save & Continue').withMnemonic, 'Do &not Save && Continue');
		} else if (isMacintosh) {
			assert.strictEqual(labels.mnemonicButtonLabel('Hello & World').withMnemonic, 'Hello & World');
			assert.strictEqual(labels.mnemonicButtonLabel('Do &&not Save & Continue').withMnemonic, 'Do not Save & Continue');
		} else {
			assert.strictEqual(labels.mnemonicButtonLabel('Hello & World').withMnemonic, 'Hello & World');
			assert.strictEqual(labels.mnemonicButtonLabel('Do &&not Save & Continue').withMnemonic, 'Do _not Save & Continue');
		}
	});

	test('getPathLabel', () => {
		const winFileUri = URI.file('c:/some/folder/file.txt');
		const nixFileUri = URI.file('/some/folder/file.txt');
		const nixBadFileUri = URI.revive({ scheme: 'vscode', authority: 'file', path: '//some/folder/file.txt' });
		const uncFileUri = URI.file('c:/some/folder/file.txt').with({ authority: 'auth' });
		const remoteFileUri = URI.file('/some/folder/file.txt').with({ scheme: 'vscode-test', authority: 'auth' });

		// Basics

		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Windows }), 'C:\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Macintosh }), 'c:/some/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Linux }), 'c:/some/folder/file.txt');

		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Windows }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Macintosh }), '/some/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Linux }), '/some/folder/file.txt');

		assert.strictEqual(labels.getPathLabel(uncFileUri, { os: OperatingSystem.Windows }), '\\\\auth\\c:\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(uncFileUri, { os: OperatingSystem.Macintosh }), '/auth/c:/some/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(uncFileUri, { os: OperatingSystem.Linux }), '/auth/c:/some/folder/file.txt');

		assert.strictEqual(labels.getPathLabel(remoteFileUri, { os: OperatingSystem.Windows }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(remoteFileUri, { os: OperatingSystem.Macintosh }), '/some/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(remoteFileUri, { os: OperatingSystem.Linux }), '/some/folder/file.txt');

		// Tildify

		const nixUserHome = URI.file('/some');
		const remoteUserHome = URI.file('/some').with({ scheme: 'vscode-test', authority: 'auth' });

		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Windows, tildify: { userHome: nixUserHome } }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Macintosh, tildify: { userHome: nixUserHome } }), '~/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixBadFileUri, { os: OperatingSystem.Macintosh, tildify: { userHome: nixUserHome } }), '/some/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Linux, tildify: { userHome: nixUserHome } }), '~/folder/file.txt');

		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Windows, tildify: { userHome: remoteUserHome } }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Macintosh, tildify: { userHome: remoteUserHome } }), '~/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Linux, tildify: { userHome: remoteUserHome } }), '~/folder/file.txt');

		const nixUntitledUri = URI.file('/some/folder/file.txt').with({ scheme: 'untitled' });

		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Windows, tildify: { userHome: nixUserHome } }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Macintosh, tildify: { userHome: nixUserHome } }), '~/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Linux, tildify: { userHome: nixUserHome } }), '~/folder/file.txt');

		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Windows, tildify: { userHome: remoteUserHome } }), '\\some\\folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Macintosh, tildify: { userHome: remoteUserHome } }), '~/folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Linux, tildify: { userHome: remoteUserHome } }), '~/folder/file.txt');

		// Relative

		const winFolder = URI.file('c:/some');
		const winRelativePathProvider: labels.IRelativePathProvider = {
			getWorkspace() { return { folders: [{ uri: winFolder }] }; },
			getWorkspaceFolder(resource) { return { uri: winFolder }; }
		};

		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Windows, relative: winRelativePathProvider }), 'folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Macintosh, relative: winRelativePathProvider }), 'folder/file.txt');
		assert.strictEqual(labels.getPathLabel(winFileUri, { os: OperatingSystem.Linux, relative: winRelativePathProvider }), 'folder/file.txt');

		const nixFolder = URI.file('/some');
		const nixRelativePathProvider: labels.IRelativePathProvider = {
			getWorkspace() { return { folders: [{ uri: nixFolder }] }; },
			getWorkspaceFolder(resource) { return { uri: nixFolder }; }
		};

		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Windows, relative: nixRelativePathProvider }), 'folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Macintosh, relative: nixRelativePathProvider }), 'folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixFileUri, { os: OperatingSystem.Linux, relative: nixRelativePathProvider }), 'folder/file.txt');

		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Windows, relative: nixRelativePathProvider }), 'folder\\file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Macintosh, relative: nixRelativePathProvider }), 'folder/file.txt');
		assert.strictEqual(labels.getPathLabel(nixUntitledUri, { os: OperatingSystem.Linux, relative: nixRelativePathProvider }), 'folder/file.txt');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/lazy.test.ts]---
Location: vscode-main/src/vs/base/test/common/lazy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Lazy } from '../../common/lazy.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Lazy', () => {

	test('lazy values should only be resolved once', () => {
		let counter = 0;
		const value = new Lazy(() => ++counter);

		assert.strictEqual(value.hasValue, false);
		assert.strictEqual(value.value, 1);
		assert.strictEqual(value.hasValue, true);
		assert.strictEqual(value.value, 1); // make sure we did not evaluate again
	});

	test('lazy values handle error case', () => {
		let counter = 0;
		const value = new Lazy(() => { throw new Error(`${++counter}`); });

		assert.strictEqual(value.hasValue, false);
		assert.throws(() => value.value, /\b1\b/);
		assert.strictEqual(value.hasValue, true);
		assert.throws(() => value.value, /\b1\b/);
	});

	test('Should throw when accessing lazy value in initializer', () => {
		const value = new Lazy<string>((): string => { return value.value; });

		assert.throws(() => value.value, /Cannot read the value of a lazy that is being initialized/);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/lifecycle.test.ts]---
Location: vscode-main/src/vs/base/test/common/lifecycle.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter } from '../../common/event.js';
import { DisposableStore, dispose, IDisposable, markAsSingleton, ReferenceCollection, thenIfNotDisposed, toDisposable } from '../../common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite, throwIfDisposablesAreLeaked } from './utils.js';

class Disposable implements IDisposable {
	isDisposed = false;
	dispose() { this.isDisposed = true; }
}

// Leaks are allowed here since we test lifecycle stuff:
// eslint-disable-next-line local/code-ensure-no-disposables-leak-in-test
suite('Lifecycle', () => {
	test('dispose single disposable', () => {
		const disposable = new Disposable();

		assert(!disposable.isDisposed);

		dispose(disposable);

		assert(disposable.isDisposed);
	});

	test('dispose disposable array', () => {
		const disposable = new Disposable();
		const disposable2 = new Disposable();

		assert(!disposable.isDisposed);
		assert(!disposable2.isDisposed);

		dispose([disposable, disposable2]);

		assert(disposable.isDisposed);
		assert(disposable2.isDisposed);
	});

	test('dispose disposables', () => {
		const disposable = new Disposable();
		const disposable2 = new Disposable();

		assert(!disposable.isDisposed);
		assert(!disposable2.isDisposed);

		dispose(disposable);
		dispose(disposable2);

		assert(disposable.isDisposed);
		assert(disposable2.isDisposed);
	});

	test('dispose array should dispose all if a child throws on dispose', () => {
		const disposedValues = new Set<number>();

		let thrownError: any;
		try {
			dispose([
				toDisposable(() => { disposedValues.add(1); }),
				toDisposable(() => { throw new Error('I am error'); }),
				toDisposable(() => { disposedValues.add(3); }),
			]);
		} catch (e) {
			thrownError = e;
		}

		assert.ok(disposedValues.has(1));
		assert.ok(disposedValues.has(3));
		assert.strictEqual(thrownError.message, 'I am error');
	});

	test('dispose array should rethrow composite error if multiple entries throw on dispose', () => {
		const disposedValues = new Set<number>();

		let thrownError: any;
		try {
			dispose([
				toDisposable(() => { disposedValues.add(1); }),
				toDisposable(() => { throw new Error('I am error 1'); }),
				toDisposable(() => { throw new Error('I am error 2'); }),
				toDisposable(() => { disposedValues.add(4); }),
			]);
		} catch (e) {
			thrownError = e;
		}

		assert.ok(disposedValues.has(1));
		assert.ok(disposedValues.has(4));
		assert.ok(thrownError instanceof AggregateError);
		assert.strictEqual((thrownError as AggregateError).errors.length, 2);
		assert.strictEqual((thrownError as AggregateError).errors[0].message, 'I am error 1');
		assert.strictEqual((thrownError as AggregateError).errors[1].message, 'I am error 2');
	});

	test('Action bar has broken accessibility #100273', function () {
		const array = [{ dispose() { } }, { dispose() { } }];
		const array2 = dispose(array);

		assert.strictEqual(array.length, 2);
		assert.strictEqual(array2.length, 0);
		assert.ok(array !== array2);

		const set = new Set<IDisposable>([{ dispose() { } }, { dispose() { } }]);
		const setValues = set.values();
		const setValues2 = dispose(setValues);
		assert.ok(setValues === setValues2);
	});
});

suite('DisposableStore', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('dispose should call all child disposes even if a child throws on dispose', () => {
		const disposedValues = new Set<number>();

		const store = new DisposableStore();
		store.add(toDisposable(() => { disposedValues.add(1); }));
		store.add(toDisposable(() => { throw new Error('I am error'); }));
		store.add(toDisposable(() => { disposedValues.add(3); }));

		let thrownError: any;
		try {
			store.dispose();
		} catch (e) {
			thrownError = e;
		}

		assert.ok(disposedValues.has(1));
		assert.ok(disposedValues.has(3));
		assert.strictEqual(thrownError.message, 'I am error');
	});

	test('dispose should throw composite error if multiple children throw on dispose', () => {
		const disposedValues = new Set<number>();

		const store = new DisposableStore();
		store.add(toDisposable(() => { disposedValues.add(1); }));
		store.add(toDisposable(() => { throw new Error('I am error 1'); }));
		store.add(toDisposable(() => { throw new Error('I am error 2'); }));
		store.add(toDisposable(() => { disposedValues.add(4); }));

		let thrownError: any;
		try {
			store.dispose();
		} catch (e) {
			thrownError = e;
		}

		assert.ok(disposedValues.has(1));
		assert.ok(disposedValues.has(4));
		assert.ok(thrownError instanceof AggregateError);
		assert.strictEqual((thrownError as AggregateError).errors.length, 2);
		assert.strictEqual((thrownError as AggregateError).errors[0].message, 'I am error 1');
		assert.strictEqual((thrownError as AggregateError).errors[1].message, 'I am error 2');
	});

	test('delete should evict and dispose of the disposables', () => {
		const disposedValues = new Set<number>();
		const disposables: IDisposable[] = [
			toDisposable(() => { disposedValues.add(1); }),
			toDisposable(() => { disposedValues.add(2); })
		];

		const store = new DisposableStore();
		store.add(disposables[0]);
		store.add(disposables[1]);

		store.delete(disposables[0]);

		assert.ok(disposedValues.has(1));
		assert.ok(!disposedValues.has(2));

		store.dispose();

		assert.ok(disposedValues.has(1));
		assert.ok(disposedValues.has(2));
	});

	test('deleteAndLeak should evict and not dispose of the disposables', () => {
		const disposedValues = new Set<number>();
		const disposables: IDisposable[] = [
			toDisposable(() => { disposedValues.add(1); }),
			toDisposable(() => { disposedValues.add(2); })
		];

		const store = new DisposableStore();
		store.add(disposables[0]);
		store.add(disposables[1]);

		store.deleteAndLeak(disposables[0]);

		assert.ok(!disposedValues.has(1));
		assert.ok(!disposedValues.has(2));

		store.dispose();

		assert.ok(!disposedValues.has(1));
		assert.ok(disposedValues.has(2));

		disposables[0].dispose();
	});
});

suite('Reference Collection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	class Collection extends ReferenceCollection<number> {
		private _count = 0;
		get count() { return this._count; }
		protected createReferencedObject(key: string): number { this._count++; return key.length; }
		protected destroyReferencedObject(key: string, object: number): void { this._count--; }
	}

	test('simple', () => {
		const collection = new Collection();

		const ref1 = collection.acquire('test');
		assert(ref1);
		assert.strictEqual(ref1.object, 4);
		assert.strictEqual(collection.count, 1);
		ref1.dispose();
		assert.strictEqual(collection.count, 0);

		const ref2 = collection.acquire('test');
		const ref3 = collection.acquire('test');
		assert.strictEqual(ref2.object, ref3.object);
		assert.strictEqual(collection.count, 1);

		const ref4 = collection.acquire('monkey');
		assert.strictEqual(ref4.object, 6);
		assert.strictEqual(collection.count, 2);

		ref2.dispose();
		assert.strictEqual(collection.count, 2);

		ref3.dispose();
		assert.strictEqual(collection.count, 1);

		ref4.dispose();
		assert.strictEqual(collection.count, 0);
	});
});

function assertThrows(fn: () => void, test: (error: any) => void) {
	try {
		fn();
		assert.fail('Expected function to throw, but it did not.');
	} catch (e) {
		assert.ok(test(e));
	}
}

suite('No Leakage Utilities', () => {
	suite('throwIfDisposablesAreLeaked', () => {
		test('throws if an event subscription is not cleaned up', () => {
			const eventEmitter = new Emitter();

			assertThrows(() => {
				throwIfDisposablesAreLeaked(() => {
					eventEmitter.event(() => {
						// noop
					});
				}, false);
			}, e => e.message.indexOf('undisposed disposables') !== -1);
		});

		test('throws if a disposable is not disposed', () => {
			assertThrows(() => {
				throwIfDisposablesAreLeaked(() => {
					new DisposableStore();
				}, false);
			}, e => e.message.indexOf('undisposed disposables') !== -1);
		});

		test('does not throw if all event subscriptions are cleaned up', () => {
			const eventEmitter = new Emitter();
			throwIfDisposablesAreLeaked(() => {
				eventEmitter.event(() => {
					// noop
				}).dispose();
			});
		});

		test('does not throw if all disposables are disposed', () => {
			// This disposable is reported before the test and not tracked.
			toDisposable(() => { });

			throwIfDisposablesAreLeaked(() => {
				// This disposable is marked as singleton
				markAsSingleton(toDisposable(() => { }));

				// These disposables are also marked as singleton
				const disposableStore = new DisposableStore();
				disposableStore.add(toDisposable(() => { }));
				markAsSingleton(disposableStore);

				toDisposable(() => { }).dispose();
			});
		});
	});

	suite('ensureNoDisposablesAreLeakedInTest', () => {
		ensureNoDisposablesAreLeakedInTestSuite();

		test('Basic Test', () => {
			toDisposable(() => { }).dispose();
		});
	});

	suite('thenIfNotDisposed', () => {
		const store = ensureNoDisposablesAreLeakedInTestSuite();

		test('normal case', async () => {
			let called = false;
			store.add(thenIfNotDisposed(Promise.resolve(123), (result: number) => {
				assert.strictEqual(result, 123);
				called = true;
			}));

			await new Promise(resolve => setTimeout(resolve, 0));
			assert.strictEqual(called, true);
		});

		test('disposed before promise resolves', async () => {
			let called = false;
			const disposable = thenIfNotDisposed(Promise.resolve(123), () => {
				called = true;
			});

			disposable.dispose();
			await new Promise(resolve => setTimeout(resolve, 0));
			assert.strictEqual(called, false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/linkedList.test.ts]---
Location: vscode-main/src/vs/base/test/common/linkedList.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { LinkedList } from '../../common/linkedList.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('LinkedList', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertElements<E>(list: LinkedList<E>, ...elements: E[]) {

		// check size
		assert.strictEqual(list.size, elements.length);

		// assert toArray
		assert.deepStrictEqual(Array.from(list), elements);

		// assert Symbol.iterator (1)
		assert.deepStrictEqual([...list], elements);

		// assert Symbol.iterator (2)
		for (const item of list) {
			assert.strictEqual(item, elements.shift());
		}
		assert.strictEqual(elements.length, 0);
	}

	test('Push/Iter', () => {
		const list = new LinkedList<number>();
		list.push(0);
		list.push(1);
		list.push(2);
		assertElements(list, 0, 1, 2);
	});

	test('Push/Remove', () => {
		let list = new LinkedList<number>();
		let disp = list.push(0);
		list.push(1);
		list.push(2);
		disp();
		assertElements(list, 1, 2);

		list = new LinkedList<number>();
		list.push(0);
		disp = list.push(1);
		list.push(2);
		disp();
		assertElements(list, 0, 2);

		list = new LinkedList<number>();
		list.push(0);
		list.push(1);
		disp = list.push(2);
		disp();
		assertElements(list, 0, 1);

		list = new LinkedList<number>();
		list.push(0);
		list.push(1);
		disp = list.push(2);
		disp();
		disp();
		assertElements(list, 0, 1);
	});

	test('Push/toArray', () => {
		const list = new LinkedList<string>();
		list.push('foo');
		list.push('bar');
		list.push('far');
		list.push('boo');

		assertElements(list, 'foo', 'bar', 'far', 'boo');
	});

	test('unshift/Iter', () => {
		const list = new LinkedList<number>();
		list.unshift(0);
		list.unshift(1);
		list.unshift(2);
		assertElements(list, 2, 1, 0);
	});

	test('unshift/Remove', () => {
		let list = new LinkedList<number>();
		let disp = list.unshift(0);
		list.unshift(1);
		list.unshift(2);
		disp();
		assertElements(list, 2, 1);

		list = new LinkedList<number>();
		list.unshift(0);
		disp = list.unshift(1);
		list.unshift(2);
		disp();
		assertElements(list, 2, 0);

		list = new LinkedList<number>();
		list.unshift(0);
		list.unshift(1);
		disp = list.unshift(2);
		disp();
		assertElements(list, 1, 0);
	});

	test('unshift/toArray', () => {
		const list = new LinkedList<string>();
		list.unshift('foo');
		list.unshift('bar');
		list.unshift('far');
		list.unshift('boo');
		assertElements(list, 'boo', 'far', 'bar', 'foo');
	});

	test('pop/unshift', function () {
		const list = new LinkedList<string>();
		list.push('a');
		list.push('b');

		assertElements(list, 'a', 'b');

		const a = list.shift();
		assert.strictEqual(a, 'a');
		assertElements(list, 'b');

		list.unshift('a');
		assertElements(list, 'a', 'b');

		const b = list.pop();
		assert.strictEqual(b, 'b');
		assertElements(list, 'a');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/linkedText.test.ts]---
Location: vscode-main/src/vs/base/test/common/linkedText.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { parseLinkedText } from '../../common/linkedText.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('LinkedText', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parses correctly', () => {
		assert.deepStrictEqual(parseLinkedText('').nodes, []);
		assert.deepStrictEqual(parseLinkedText('hello').nodes, ['hello']);
		assert.deepStrictEqual(parseLinkedText('hello there').nodes, ['hello there']);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](http://link.href).').nodes, [
			'Some message with ',
			{ label: 'link text', href: 'http://link.href' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](http://link.href "and a title").').nodes, [
			'Some message with ',
			{ label: 'link text', href: 'http://link.href', title: 'and a title' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](http://link.href \'and a title\').').nodes, [
			'Some message with ',
			{ label: 'link text', href: 'http://link.href', title: 'and a title' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](http://link.href "and a \'title\'").').nodes, [
			'Some message with ',
			{ label: 'link text', href: 'http://link.href', title: 'and a \'title\'' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](http://link.href \'and a "title"\').').nodes, [
			'Some message with ',
			{ label: 'link text', href: 'http://link.href', title: 'and a "title"' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [link text](random stuff).').nodes, [
			'Some message with [link text](random stuff).'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [https link](https://link.href).').nodes, [
			'Some message with ',
			{ label: 'https link', href: 'https://link.href' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [https link](https:).').nodes, [
			'Some message with [https link](https:).'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [a command](command:foobar).').nodes, [
			'Some message with ',
			{ label: 'a command', href: 'command:foobar' },
			'.'
		]);
		assert.deepStrictEqual(parseLinkedText('Some message with [a command](command:).').nodes, [
			'Some message with [a command](command:).'
		]);
		assert.deepStrictEqual(parseLinkedText('link [one](command:foo "nice") and link [two](http://foo)...').nodes, [
			'link ',
			{ label: 'one', href: 'command:foo', title: 'nice' },
			' and link ',
			{ label: 'two', href: 'http://foo' },
			'...'
		]);
		assert.deepStrictEqual(parseLinkedText('link\n[one](command:foo "nice")\nand link [two](http://foo)...').nodes, [
			'link\n',
			{ label: 'one', href: 'command:foo', title: 'nice' },
			'\nand link ',
			{ label: 'two', href: 'http://foo' },
			'...'
		]);
	});

	test('Should match non-greedily', () => {
		assert.deepStrictEqual(parseLinkedText('a [link text 1](http://link.href "title1") b [link text 2](http://link.href "title2") c').nodes, [
			'a ',
			{ label: 'link text 1', href: 'http://link.href', title: 'title1' },
			' b ',
			{ label: 'link text 2', href: 'http://link.href', title: 'title2' },
			' c',
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/map.test.ts]---
Location: vscode-main/src/vs/base/test/common/map.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { BidirectionalMap, LinkedMap, LRUCache, mapsStrictEqualIgnoreOrder, MRUCache, NKeyMap, ResourceMap, SetMap, Touch } from '../../common/map.js';
import { extUriIgnorePathCase } from '../../common/resources.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Map', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('LinkedMap - Simple', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		assert.deepStrictEqual([...map.keys()], ['ak', 'bk']);
		assert.deepStrictEqual([...map.values()], ['av', 'bv']);
		assert.strictEqual(map.first, 'av');
		assert.strictEqual(map.last, 'bv');
	});

	test('LinkedMap - Touch Old one', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('ak', 'av', Touch.AsOld);
		assert.deepStrictEqual([...map.keys()], ['ak']);
		assert.deepStrictEqual([...map.values()], ['av']);
	});

	test('LinkedMap - Touch New one', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('ak', 'av', Touch.AsNew);
		assert.deepStrictEqual([...map.keys()], ['ak']);
		assert.deepStrictEqual([...map.values()], ['av']);
	});

	test('LinkedMap - Touch Old two', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		map.set('bk', 'bv', Touch.AsOld);
		assert.deepStrictEqual([...map.keys()], ['bk', 'ak']);
		assert.deepStrictEqual([...map.values()], ['bv', 'av']);
	});

	test('LinkedMap - Touch New two', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		map.set('ak', 'av', Touch.AsNew);
		assert.deepStrictEqual([...map.keys()], ['bk', 'ak']);
		assert.deepStrictEqual([...map.values()], ['bv', 'av']);
	});

	test('LinkedMap - Touch Old from middle', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		map.set('ck', 'cv');
		map.set('bk', 'bv', Touch.AsOld);
		assert.deepStrictEqual([...map.keys()], ['bk', 'ak', 'ck']);
		assert.deepStrictEqual([...map.values()], ['bv', 'av', 'cv']);
	});

	test('LinkedMap - Touch New from middle', () => {
		const map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		map.set('ck', 'cv');
		map.set('bk', 'bv', Touch.AsNew);
		assert.deepStrictEqual([...map.keys()], ['ak', 'ck', 'bk']);
		assert.deepStrictEqual([...map.values()], ['av', 'cv', 'bv']);
	});

	test('LinkedMap - basics', function () {
		const map = new LinkedMap<string, any>();

		assert.strictEqual(map.size, 0);

		map.set('1', 1);
		map.set('2', '2');
		map.set('3', true);

		const obj = Object.create(null);
		map.set('4', obj);

		const date = Date.now();
		map.set('5', date);

		assert.strictEqual(map.size, 5);
		assert.strictEqual(map.get('1'), 1);
		assert.strictEqual(map.get('2'), '2');
		assert.strictEqual(map.get('3'), true);
		assert.strictEqual(map.get('4'), obj);
		assert.strictEqual(map.get('5'), date);
		assert.ok(!map.get('6'));

		map.delete('6');
		assert.strictEqual(map.size, 5);
		assert.strictEqual(map.delete('1'), true);
		assert.strictEqual(map.delete('2'), true);
		assert.strictEqual(map.delete('3'), true);
		assert.strictEqual(map.delete('4'), true);
		assert.strictEqual(map.delete('5'), true);

		assert.strictEqual(map.size, 0);
		assert.ok(!map.get('5'));
		assert.ok(!map.get('4'));
		assert.ok(!map.get('3'));
		assert.ok(!map.get('2'));
		assert.ok(!map.get('1'));

		map.set('1', 1);
		map.set('2', '2');
		map.set('3', true);

		assert.ok(map.has('1'));
		assert.strictEqual(map.get('1'), 1);
		assert.strictEqual(map.get('2'), '2');
		assert.strictEqual(map.get('3'), true);

		map.clear();

		assert.strictEqual(map.size, 0);
		assert.ok(!map.get('1'));
		assert.ok(!map.get('2'));
		assert.ok(!map.get('3'));
		assert.ok(!map.has('1'));
	});

	test('LinkedMap - Iterators', () => {
		const map = new LinkedMap<number, any>();
		map.set(1, 1);
		map.set(2, 2);
		map.set(3, 3);

		for (const elem of map.keys()) {
			assert.ok(elem);
		}

		for (const elem of map.values()) {
			assert.ok(elem);
		}

		for (const elem of map.entries()) {
			assert.ok(elem);
		}

		{
			const keys = map.keys();
			const values = map.values();
			const entries = map.entries();
			map.get(1);
			keys.next();
			values.next();
			entries.next();
		}

		{
			const keys = map.keys();
			const values = map.values();
			const entries = map.entries();
			map.get(1, Touch.AsNew);

			let exceptions: number = 0;
			try {
				keys.next();
			} catch (err) {
				exceptions++;
			}
			try {
				values.next();
			} catch (err) {
				exceptions++;
			}
			try {
				entries.next();
			} catch (err) {
				exceptions++;
			}

			assert.strictEqual(exceptions, 3);
		}
	});

	test('LinkedMap - LRU Cache simple', () => {
		const cache = new LRUCache<number, number>(5);

		[1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
		assert.strictEqual(cache.size, 5);
		cache.set(6, 6);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [2, 3, 4, 5, 6]);
		cache.set(7, 7);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [3, 4, 5, 6, 7]);
		const values: number[] = [];
		[3, 4, 5, 6, 7].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [3, 4, 5, 6, 7]);
	});

	test('LinkedMap - LRU Cache get', () => {
		const cache = new LRUCache<number, number>(5);

		[1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 5]);
		cache.get(3);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
		cache.peek(4);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
		const values: number[] = [];
		[1, 2, 3, 4, 5].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [1, 2, 3, 4, 5]);
	});

	test('LinkedMap - LRU Cache limit', () => {
		const cache = new LRUCache<number, number>(10);

		for (let i = 1; i <= 10; i++) {
			cache.set(i, i);
		}
		assert.strictEqual(cache.size, 10);
		cache.limit = 5;
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [6, 7, 8, 9, 10]);
		cache.limit = 20;
		assert.strictEqual(cache.size, 5);
		for (let i = 11; i <= 20; i++) {
			cache.set(i, i);
		}
		assert.deepStrictEqual(cache.size, 15);
		const values: number[] = [];
		for (let i = 6; i <= 20; i++) {
			values.push(cache.get(i)!);
			assert.strictEqual(cache.get(i), i);
		}
		assert.deepStrictEqual([...cache.values()], values);
	});

	test('LinkedMap - LRU Cache limit with ratio', () => {
		const cache = new LRUCache<number, number>(10, 0.5);

		for (let i = 1; i <= 10; i++) {
			cache.set(i, i);
		}
		assert.strictEqual(cache.size, 10);
		cache.set(11, 11);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [7, 8, 9, 10, 11]);
		const values: number[] = [];
		[...cache.keys()].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [7, 8, 9, 10, 11]);
		assert.deepStrictEqual([...cache.values()], values);
	});

	test('LinkedMap - MRU Cache simple', () => {
		const cache = new MRUCache<number, number>(5);

		[1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
		assert.strictEqual(cache.size, 5);
		cache.set(6, 6);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 6]);
		cache.set(7, 7);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 7]);
		const values: number[] = [];
		[1, 2, 3, 4, 7].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [1, 2, 3, 4, 7]);
	});

	test('LinkedMap - MRU Cache get', () => {
		const cache = new MRUCache<number, number>(5);

		[1, 2, 3, 4, 5].forEach(value => cache.set(value, value));
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 5]);
		cache.get(3);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
		cache.peek(4);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 4, 5, 3]);
		const values: number[] = [];
		[1, 2, 3, 4, 5].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [1, 2, 3, 4, 5]);
	});

	test('LinkedMap - MRU Cache limit with ratio', () => {
		const cache = new MRUCache<number, number>(10, 0.5);

		for (let i = 1; i <= 10; i++) {
			cache.set(i, i);
		}
		assert.strictEqual(cache.size, 10);
		cache.set(11, 11);
		assert.strictEqual(cache.size, 5);
		assert.deepStrictEqual([...cache.keys()], [1, 2, 3, 4, 11]);
		const values: number[] = [];
		[...cache.keys()].forEach(key => values.push(cache.get(key)!));
		assert.deepStrictEqual(values, [1, 2, 3, 4, 11]);
		assert.deepStrictEqual([...cache.values()], values);
	});

	test('LinkedMap - toJSON / fromJSON', () => {
		let map = new LinkedMap<string, string>();
		map.set('ak', 'av');
		map.set('bk', 'bv');
		map.set('ck', 'cv');

		const json = map.toJSON();
		map = new LinkedMap<string, string>();
		map.fromJSON(json);

		let i = 0;
		map.forEach((value, key) => {
			if (i === 0) {
				assert.strictEqual(key, 'ak');
				assert.strictEqual(value, 'av');
			} else if (i === 1) {
				assert.strictEqual(key, 'bk');
				assert.strictEqual(value, 'bv');
			} else if (i === 2) {
				assert.strictEqual(key, 'ck');
				assert.strictEqual(value, 'cv');
			}
			i++;
		});
	});

	test('LinkedMap - delete Head and Tail', function () {
		const map = new LinkedMap<string, number>();

		assert.strictEqual(map.size, 0);

		map.set('1', 1);
		assert.strictEqual(map.size, 1);
		map.delete('1');
		assert.strictEqual(map.get('1'), undefined);
		assert.strictEqual(map.size, 0);
		assert.strictEqual([...map.keys()].length, 0);
	});

	test('LinkedMap - delete Head', function () {
		const map = new LinkedMap<string, number>();

		assert.strictEqual(map.size, 0);

		map.set('1', 1);
		map.set('2', 2);
		assert.strictEqual(map.size, 2);
		map.delete('1');
		assert.strictEqual(map.get('2'), 2);
		assert.strictEqual(map.size, 1);
		assert.strictEqual([...map.keys()].length, 1);
		assert.strictEqual([...map.keys()][0], '2');
	});

	test('LinkedMap - delete Tail', function () {
		const map = new LinkedMap<string, number>();

		assert.strictEqual(map.size, 0);

		map.set('1', 1);
		map.set('2', 2);
		assert.strictEqual(map.size, 2);
		map.delete('2');
		assert.strictEqual(map.get('1'), 1);
		assert.strictEqual(map.size, 1);
		assert.strictEqual([...map.keys()].length, 1);
		assert.strictEqual([...map.keys()][0], '1');
	});

	test('ResourceMap - basics', function () {
		const map = new ResourceMap<any>();

		const resource1 = URI.parse('some://1');
		const resource2 = URI.parse('some://2');
		const resource3 = URI.parse('some://3');
		const resource4 = URI.parse('some://4');
		const resource5 = URI.parse('some://5');
		const resource6 = URI.parse('some://6');

		assert.strictEqual(map.size, 0);

		const res = map.set(resource1, 1);
		assert.ok(res === map);
		map.set(resource2, '2');
		map.set(resource3, true);

		const values = [...map.values()];
		assert.strictEqual(values[0], 1);
		assert.strictEqual(values[1], '2');
		assert.strictEqual(values[2], true);

		let counter = 0;
		map.forEach((value, key, mapObj) => {
			assert.strictEqual(value, values[counter++]);
			assert.ok(URI.isUri(key));
			assert.ok(map === mapObj);
		});

		const obj = Object.create(null);
		map.set(resource4, obj);

		const date = Date.now();
		map.set(resource5, date);

		assert.strictEqual(map.size, 5);
		assert.strictEqual(map.get(resource1), 1);
		assert.strictEqual(map.get(resource2), '2');
		assert.strictEqual(map.get(resource3), true);
		assert.strictEqual(map.get(resource4), obj);
		assert.strictEqual(map.get(resource5), date);
		assert.ok(!map.get(resource6));

		map.delete(resource6);
		assert.strictEqual(map.size, 5);
		assert.ok(map.delete(resource1));
		assert.ok(map.delete(resource2));
		assert.ok(map.delete(resource3));
		assert.ok(map.delete(resource4));
		assert.ok(map.delete(resource5));

		assert.strictEqual(map.size, 0);
		assert.ok(!map.get(resource5));
		assert.ok(!map.get(resource4));
		assert.ok(!map.get(resource3));
		assert.ok(!map.get(resource2));
		assert.ok(!map.get(resource1));

		map.set(resource1, 1);
		map.set(resource2, '2');
		map.set(resource3, true);

		assert.ok(map.has(resource1));
		assert.strictEqual(map.get(resource1), 1);
		assert.strictEqual(map.get(resource2), '2');
		assert.strictEqual(map.get(resource3), true);

		map.clear();

		assert.strictEqual(map.size, 0);
		assert.ok(!map.get(resource1));
		assert.ok(!map.get(resource2));
		assert.ok(!map.get(resource3));
		assert.ok(!map.has(resource1));

		map.set(resource1, false);
		map.set(resource2, 0);

		assert.ok(map.has(resource1));
		assert.ok(map.has(resource2));
	});

	test('ResourceMap - files (do NOT ignorecase)', function () {
		const map = new ResourceMap<any>();

		const fileA = URI.parse('file://some/filea');
		const fileB = URI.parse('some://some/other/fileb');
		const fileAUpper = URI.parse('file://SOME/FILEA');

		map.set(fileA, 'true');
		assert.strictEqual(map.get(fileA), 'true');

		assert.ok(!map.get(fileAUpper));

		assert.ok(!map.get(fileB));

		map.set(fileAUpper, 'false');
		assert.strictEqual(map.get(fileAUpper), 'false');

		assert.strictEqual(map.get(fileA), 'true');

		const windowsFile = URI.file('c:\\test with %25\\c#code');
		const uncFile = URI.file('\\\\shäres\\path\\c#\\plugin.json');

		map.set(windowsFile, 'true');
		map.set(uncFile, 'true');

		assert.strictEqual(map.get(windowsFile), 'true');
		assert.strictEqual(map.get(uncFile), 'true');
	});

	test('ResourceMap - files (ignorecase)', function () {
		const map = new ResourceMap<any>(uri => extUriIgnorePathCase.getComparisonKey(uri));

		const fileA = URI.parse('file://some/filea');
		const fileB = URI.parse('some://some/other/fileb');
		const fileAUpper = URI.parse('file://SOME/FILEA');

		map.set(fileA, 'true');
		assert.strictEqual(map.get(fileA), 'true');

		assert.strictEqual(map.get(fileAUpper), 'true');

		assert.ok(!map.get(fileB));

		map.set(fileAUpper, 'false');
		assert.strictEqual(map.get(fileAUpper), 'false');

		assert.strictEqual(map.get(fileA), 'false');

		const windowsFile = URI.file('c:\\test with %25\\c#code');
		const uncFile = URI.file('\\\\shäres\\path\\c#\\plugin.json');

		map.set(windowsFile, 'true');
		map.set(uncFile, 'true');

		assert.strictEqual(map.get(windowsFile), 'true');
		assert.strictEqual(map.get(uncFile), 'true');
	});

	test('ResourceMap - files (ignorecase, BUT preservecase)', function () {
		const map = new ResourceMap<number>(uri => extUriIgnorePathCase.getComparisonKey(uri));

		const fileA = URI.parse('file://some/filea');
		const fileAUpper = URI.parse('file://SOME/FILEA');

		map.set(fileA, 1);
		assert.strictEqual(map.get(fileA), 1);
		assert.strictEqual(map.get(fileAUpper), 1);
		assert.deepStrictEqual(Array.from(map.keys()).map(String), [fileA].map(String));
		assert.deepStrictEqual(Array.from(map), [[fileA, 1]]);

		map.set(fileAUpper, 1);
		assert.strictEqual(map.get(fileA), 1);
		assert.strictEqual(map.get(fileAUpper), 1);
		assert.deepStrictEqual(Array.from(map.keys()).map(String), [fileAUpper].map(String));
		assert.deepStrictEqual(Array.from(map), [[fileAUpper, 1]]);
	});

	test('mapsStrictEqualIgnoreOrder', () => {
		const map1 = new Map();
		const map2 = new Map();

		assert.strictEqual(mapsStrictEqualIgnoreOrder(map1, map2), true);

		map1.set('foo', 'bar');
		assert.strictEqual(mapsStrictEqualIgnoreOrder(map1, map2), false);

		map2.set('foo', 'bar');
		assert.strictEqual(mapsStrictEqualIgnoreOrder(map1, map2), true);

		map2.set('bar', 'foo');
		assert.strictEqual(mapsStrictEqualIgnoreOrder(map1, map2), false);

		map1.set('bar', 'foo');
		assert.strictEqual(mapsStrictEqualIgnoreOrder(map1, map2), true);
	});
});

suite('BidirectionalMap', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should set and get values correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		assert.strictEqual(map.get('one'), 1);
		assert.strictEqual(map.get('two'), 2);
		assert.strictEqual(map.get('three'), 3);
	});

	test('should get keys by value correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		assert.strictEqual(map.getKey(1), 'one');
		assert.strictEqual(map.getKey(2), 'two');
		assert.strictEqual(map.getKey(3), 'three');
	});

	test('should delete values correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		assert.strictEqual(map.delete('one'), true);
		assert.strictEqual(map.get('one'), undefined);
		assert.strictEqual(map.getKey(1), undefined);

		assert.strictEqual(map.delete('two'), true);
		assert.strictEqual(map.get('two'), undefined);
		assert.strictEqual(map.getKey(2), undefined);

		assert.strictEqual(map.delete('three'), true);
		assert.strictEqual(map.get('three'), undefined);
		assert.strictEqual(map.getKey(3), undefined);
	});

	test('should handle non-existent keys correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		assert.strictEqual(map.get('four'), undefined);
		assert.strictEqual(map.getKey(4), undefined);
		assert.strictEqual(map.delete('four'), false);
	});

	test('should handle forEach correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		const keys: string[] = [];
		const values: number[] = [];
		map.forEach((value, key) => {
			keys.push(key);
			values.push(value);
		});

		assert.deepStrictEqual(keys, ['one', 'two', 'three']);
		assert.deepStrictEqual(values, [1, 2, 3]);
	});

	test('should handle clear correctly', () => {
		const map = new BidirectionalMap<string, number>();
		map.set('one', 1);
		map.set('two', 2);
		map.set('three', 3);

		map.clear();

		assert.strictEqual(map.get('one'), undefined);
		assert.strictEqual(map.get('two'), undefined);
		assert.strictEqual(map.get('three'), undefined);
		assert.strictEqual(map.getKey(1), undefined);
		assert.strictEqual(map.getKey(2), undefined);
		assert.strictEqual(map.getKey(3), undefined);
	});
});

suite('SetMap', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('add and get', () => {
		const setMap = new SetMap<string, number>();
		setMap.add('a', 1);
		setMap.add('a', 2);
		setMap.add('b', 3);
		assert.deepStrictEqual([...setMap.get('a')], [1, 2]);
		assert.deepStrictEqual([...setMap.get('b')], [3]);
	});

	test('delete', () => {
		const setMap = new SetMap<string, number>();
		setMap.add('a', 1);
		setMap.add('a', 2);
		setMap.add('b', 3);
		setMap.delete('a', 1);
		assert.deepStrictEqual([...setMap.get('a')], [2]);
		setMap.delete('a', 2);
		assert.deepStrictEqual([...setMap.get('a')], []);
	});

	test('forEach', () => {
		const setMap = new SetMap<string, number>();
		setMap.add('a', 1);
		setMap.add('a', 2);
		setMap.add('b', 3);
		let sum = 0;
		setMap.forEach('a', value => sum += value);
		assert.strictEqual(sum, 3);
	});

	test('get empty set', () => {
		const setMap = new SetMap<string, number>();
		assert.deepStrictEqual([...setMap.get('a')], []);
	});
});

suite('NKeyMap', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('set and get', () => {
		const map = new NKeyMap<number, [string, string, string, string]>();
		map.set(1, 'a', 'b', 'c', 'd');
		map.set(2, 'a', 'c', 'c', 'd');
		map.set(3, 'b', 'e', 'f', 'g');
		assert.strictEqual(map.get('a', 'b', 'c', 'd'), 1);
		assert.strictEqual(map.get('a', 'c', 'c', 'd'), 2);
		assert.strictEqual(map.get('b', 'e', 'f', 'g'), 3);
		assert.strictEqual(map.get('a', 'b', 'c', 'a'), undefined);
	});

	test('clear', () => {
		const map = new NKeyMap<number, [string, string, string, string]>();
		map.set(1, 'a', 'b', 'c', 'd');
		map.set(2, 'a', 'c', 'c', 'd');
		map.set(3, 'b', 'e', 'f', 'g');
		map.clear();
		assert.strictEqual(map.get('a', 'b', 'c', 'd'), undefined);
		assert.strictEqual(map.get('a', 'c', 'c', 'd'), undefined);
		assert.strictEqual(map.get('b', 'e', 'f', 'g'), undefined);
	});

	test('values', () => {
		const map = new NKeyMap<number, [string, string, string, string]>();
		map.set(1, 'a', 'b', 'c', 'd');
		map.set(2, 'a', 'c', 'c', 'd');
		map.set(3, 'b', 'e', 'f', 'g');
		assert.deepStrictEqual(Array.from(map.values()), [1, 2, 3]);
	});

	test('toString', () => {
		const map = new NKeyMap<number, [string, string, string]>();
		map.set(1, 'f', 'o', 'o');
		map.set(2, 'b', 'a', 'r');
		map.set(3, 'b', 'a', 'z');
		map.set(3, 'b', 'o', 'o');
		assert.strictEqual(map.toString(), [
			'f: ',
			'  o: ',
			'    o: 1',
			'b: ',
			'  a: ',
			'    r: 2',
			'    z: 3',
			'  o: ',
			'    o: 3',
			'',
		].join('\n'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/markdownString.test.ts]---
Location: vscode-main/src/vs/base/test/common/markdownString.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IMarkdownString, MarkdownString } from '../../common/htmlContent.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { URI } from '../../common/uri.js';

suite('MarkdownString', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Escape leading whitespace', function () {
		const mds = new MarkdownString();
		mds.appendText('Hello\n    Not a code block');
		assert.strictEqual(mds.value, 'Hello\n\n&nbsp;&nbsp;&nbsp;&nbsp;Not&nbsp;a&nbsp;code&nbsp;block');
	});

	test('MarkdownString.appendText doesn\'t escape quote #109040', function () {
		const mds = new MarkdownString();
		mds.appendText('> Text\n>More');
		assert.strictEqual(mds.value, '\\>&nbsp;Text\n\n\\>More');
	});

	test('appendText', () => {

		const mds = new MarkdownString();
		mds.appendText('# foo\n*bar*');

		assert.strictEqual(mds.value, '\\#&nbsp;foo\n\n\\*bar\\*');
	});

	test('appendLink', function () {

		function assertLink(target: string, label: string, title: string | undefined, expected: string) {
			const mds = new MarkdownString();
			mds.appendLink(target, label, title);
			assert.strictEqual(mds.value, expected);
		}

		assertLink(
			'https://example.com\\()![](file:///Users/jrieken/Code/_samples/devfest/foo/img.png)', 'hello', undefined,
			'[hello](https://example.com\\(\\)![](file:///Users/jrieken/Code/_samples/devfest/foo/img.png\\))'
		);
		assertLink(
			'https://example.com', 'hello', 'title',
			'[hello](https://example.com "title")'
		);
		assertLink(
			'foo)', 'hello]', undefined,
			'[hello\\]](foo\\))'
		);
		assertLink(
			'foo\\)', 'hello]', undefined,
			'[hello\\]](foo\\))'
		);
		assertLink(
			'fo)o', 'hell]o', undefined,
			'[hell\\]o](fo\\)o)'
		);
		assertLink(
			'foo)', 'hello]', 'title"',
			'[hello\\]](foo\\) "title\\"")'
		);
	});

	test('lift', () => {
		const dto: IMarkdownString = {
			value: 'hello',
			baseUri: URI.file('/foo/bar'),
			supportThemeIcons: true,
			isTrusted: true,
			supportHtml: true,
			uris: {
				[URI.file('/foo/bar2').toString()]: URI.file('/foo/bar2'),
				[URI.file('/foo/bar3').toString()]: URI.file('/foo/bar3')
			}
		};
		const mds = MarkdownString.lift(dto);
		assert.strictEqual(mds.value, dto.value);
		assert.strictEqual(mds.baseUri?.toString(), dto.baseUri?.toString());
		assert.strictEqual(mds.supportThemeIcons, dto.supportThemeIcons);
		assert.strictEqual(mds.isTrusted, dto.isTrusted);
		assert.strictEqual(mds.supportHtml, dto.supportHtml);
		assert.deepStrictEqual(mds.uris, dto.uris);
	});

	test('lift returns new instance', () => {
		const instance = new MarkdownString('hello');
		const mds2 = MarkdownString.lift(instance).appendText('world');
		assert.strictEqual(mds2.value, 'helloworld');
		assert.strictEqual(instance.value, 'hello');
	});

	suite('appendCodeBlock', () => {
		function assertCodeBlock(lang: string, code: string, result: string) {
			const mds = new MarkdownString();
			mds.appendCodeblock(lang, code);
			assert.strictEqual(mds.value, result);
		}

		test('common cases', () => {
			// no backticks
			assertCodeBlock('ts', 'const a = 1;', `\n${[
				'```ts',
				'const a = 1;',
				'```'
			].join('\n')}\n`);
			// backticks
			assertCodeBlock('ts', 'const a = `1`;', `\n${[
				'```ts',
				'const a = `1`;',
				'```'
			].join('\n')}\n`);
		});

		// @see https://github.com/microsoft/vscode/issues/193746
		test('escape fence', () => {
			// fence in the first line
			assertCodeBlock('md', '```\n```', `\n${[
				'````md',
				'```\n```',
				'````'
			].join('\n')}\n`);
			// fence in the middle of code
			assertCodeBlock('md', '\n\n```\n```', `\n${[
				'````md',
				'\n\n```\n```',
				'````'
			].join('\n')}\n`);
			// longer fence at the end of code
			assertCodeBlock('md', '```\n```\n````\n````', `\n${[
				'`````md',
				'```\n```\n````\n````',
				'`````'
			].join('\n')}\n`);
		});
	});

	suite('ThemeIcons', () => {

		suite('Support On', () => {

			test('appendText', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: true });
				mds.appendText('$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '\\\\$\\(zap\\)&nbsp;$\\(not&nbsp;a&nbsp;theme&nbsp;icon\\)&nbsp;\\\\$\\(add\\)');
			});

			test('appendMarkdown', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: true });
				mds.appendMarkdown('$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '$(zap) $(not a theme icon) $(add)');
			});

			test('appendMarkdown with escaped icon', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: true });
				mds.appendMarkdown('\\$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '\\$(zap) $(not a theme icon) $(add)');
			});

		});

		suite('Support Off', () => {

			test('appendText', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: false });
				mds.appendText('$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '$\\(zap\\)&nbsp;$\\(not&nbsp;a&nbsp;theme&nbsp;icon\\)&nbsp;$\\(add\\)');
			});

			test('appendMarkdown', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: false });
				mds.appendMarkdown('$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '$(zap) $(not a theme icon) $(add)');
			});

			test('appendMarkdown with escaped icon', () => {
				const mds = new MarkdownString(undefined, { supportThemeIcons: true });
				mds.appendMarkdown('\\$(zap) $(not a theme icon) $(add)');

				assert.strictEqual(mds.value, '\\$(zap) $(not a theme icon) $(add)');
			});

		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/marshalling.test.ts]---
Location: vscode-main/src/vs/base/test/common/marshalling.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { parse, stringify } from '../../common/marshalling.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Marshalling', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('RegExp', () => {
		const value = /foo/img;
		const raw = stringify(value);
		const clone = <RegExp>parse(raw);

		assert.strictEqual(value.source, clone.source);
		assert.strictEqual(value.global, clone.global);
		assert.strictEqual(value.ignoreCase, clone.ignoreCase);
		assert.strictEqual(value.multiline, clone.multiline);
	});

	test('URI', () => {
		const value = URI.from({ scheme: 'file', authority: 'server', path: '/shares/c#files', query: 'q', fragment: 'f' });
		const raw = stringify(value);
		const clone = <URI>parse(raw);

		assert.strictEqual(value.scheme, clone.scheme);
		assert.strictEqual(value.authority, clone.authority);
		assert.strictEqual(value.path, clone.path);
		assert.strictEqual(value.query, clone.query);
		assert.strictEqual(value.fragment, clone.fragment);
	});

	test('Bug 16793:# in folder name => mirror models get out of sync', () => {
		const uri1 = URI.file('C:\\C#\\file.txt');
		assert.strictEqual(parse(stringify(uri1)).toString(), uri1.toString());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/mime.test.ts]---
Location: vscode-main/src/vs/base/test/common/mime.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { normalizeMimeType } from '../../common/mime.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Mime', () => {

	test('normalize', () => {
		assert.strictEqual(normalizeMimeType('invalid'), 'invalid');
		assert.strictEqual(normalizeMimeType('invalid', true), undefined);
		assert.strictEqual(normalizeMimeType('Text/plain'), 'text/plain');
		assert.strictEqual(normalizeMimeType('Text/pläin'), 'text/pläin');
		assert.strictEqual(normalizeMimeType('Text/plain;UPPER'), 'text/plain;UPPER');
		assert.strictEqual(normalizeMimeType('Text/plain;lower'), 'text/plain;lower');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/mock.ts]---
Location: vscode-main/src/vs/base/test/common/mock.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SinonStub, stub } from 'sinon';
import { DeepPartial } from '../../common/types.js';

export interface Ctor<T> {
	new(): T;
}

export function mock<T>(): Ctor<T> {
	// eslint-disable-next-line local/code-no-any-casts
	return function () { } as any;
}

export type MockObject<T, ExceptProps = never> = { [K in keyof T]: K extends ExceptProps ? T[K] : SinonStub };

// Creates an object object that returns sinon mocks for every property. Optionally
// takes base properties.
export const mockObject = <T extends object>() => <TP extends Partial<T> = {}>(properties?: TP): MockObject<T, keyof TP> => {
	// eslint-disable-next-line local/code-no-any-casts
	return new Proxy({ ...properties } as any, {
		get(target, key) {
			if (!target.hasOwnProperty(key)) {
				target[key] = stub();
			}

			return target[key];
		},
		set(target, key, value) {
			target[key] = value;
			return true;
		},
	});
};

/**
 * Shortcut for type-safe partials in mocks. A shortcut for `obj as Partial<T> as T`.
 */
export function upcastPartial<T>(partial: Partial<T>): T {
	return partial as T;
}
export function upcastDeepPartial<T>(partial: DeepPartial<T>): T {
	return partial as T;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/network.test.ts]---
Location: vscode-main/src/vs/base/test/common/network.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FileAccess, Schemas } from '../../common/network.js';
import { isWeb } from '../../common/platform.js';
import { isEqual } from '../../common/resources.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('network', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	(isWeb ? test.skip : test)('FileAccess: URI (native)', () => {

		// asCodeUri() & asFileUri(): simple, without authority
		let originalFileUri = URI.file('network.test.ts');
		let browserUri = FileAccess.uriToBrowserUri(originalFileUri);
		assert.ok(browserUri.authority.length > 0);
		let fileUri = FileAccess.uriToFileUri(browserUri);
		assert.strictEqual(fileUri.authority.length, 0);
		assert(isEqual(originalFileUri, fileUri));

		// asCodeUri() & asFileUri(): with authority
		originalFileUri = URI.file('network.test.ts').with({ authority: 'test-authority' });
		browserUri = FileAccess.uriToBrowserUri(originalFileUri);
		assert.strictEqual(browserUri.authority, originalFileUri.authority);
		fileUri = FileAccess.uriToFileUri(browserUri);
		assert(isEqual(originalFileUri, fileUri));
	});

	(isWeb ? test.skip : test)('FileAccess: moduleId (native)', () => {
		const browserUri = FileAccess.asBrowserUri('vs/base/test/node/network.test');
		assert.strictEqual(browserUri.scheme, Schemas.vscodeFileResource);

		const fileUri = FileAccess.asFileUri('vs/base/test/node/network.test');
		assert.strictEqual(fileUri.scheme, Schemas.file);
	});

	(isWeb ? test.skip : test)('FileAccess: query and fragment is dropped (native)', () => {
		const originalFileUri = URI.file('network.test.ts').with({ query: 'foo=bar', fragment: 'something' });
		const browserUri = FileAccess.uriToBrowserUri(originalFileUri);
		assert.strictEqual(browserUri.query, '');
		assert.strictEqual(browserUri.fragment, '');
	});

	(isWeb ? test.skip : test)('FileAccess: query and fragment is kept if URI is already of same scheme (native)', () => {
		const originalFileUri = URI.file('network.test.ts').with({ query: 'foo=bar', fragment: 'something' });
		const browserUri = FileAccess.uriToBrowserUri(originalFileUri.with({ scheme: Schemas.vscodeFileResource }));
		assert.strictEqual(browserUri.query, 'foo=bar');
		assert.strictEqual(browserUri.fragment, 'something');

		const fileUri = FileAccess.uriToFileUri(originalFileUri);
		assert.strictEqual(fileUri.query, 'foo=bar');
		assert.strictEqual(fileUri.fragment, 'something');
	});

	(isWeb ? test.skip : test)('FileAccess: web', () => {
		const originalHttpsUri = URI.file('network.test.ts').with({ scheme: 'https' });
		const browserUri = FileAccess.uriToBrowserUri(originalHttpsUri);
		assert.strictEqual(originalHttpsUri.toString(), browserUri.toString());
	});

	test('FileAccess: remote URIs', () => {
		const originalRemoteUri = URI.file('network.test.ts').with({ scheme: Schemas.vscodeRemote });
		const browserUri = FileAccess.uriToBrowserUri(originalRemoteUri);
		assert.notStrictEqual(originalRemoteUri.scheme, browserUri.scheme);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/normalization.test.ts]---
Location: vscode-main/src/vs/base/test/common/normalization.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { tryNormalizeToBase } from '../../common/normalization.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Normalization', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('tryNormalizeToBase', function () {
		assert.strictEqual(tryNormalizeToBase('joào'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joáo'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joâo'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joäo'), 'joao');
		// assert.strictEqual(strings.tryNormalizeToBase('joæo'), 'joao'); // not an accent
		assert.strictEqual(tryNormalizeToBase('joão'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joåo'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joåo'), 'joao');
		assert.strictEqual(tryNormalizeToBase('joāo'), 'joao');

		assert.strictEqual(tryNormalizeToBase('fôo'), 'foo');
		assert.strictEqual(tryNormalizeToBase('föo'), 'foo');
		assert.strictEqual(tryNormalizeToBase('fòo'), 'foo');
		assert.strictEqual(tryNormalizeToBase('fóo'), 'foo');
		// assert.strictEqual(strings.tryNormalizeToBase('fœo'), 'foo');
		// assert.strictEqual(strings.tryNormalizeToBase('føo'), 'foo');
		assert.strictEqual(tryNormalizeToBase('fōo'), 'foo');
		assert.strictEqual(tryNormalizeToBase('fõo'), 'foo');

		assert.strictEqual(tryNormalizeToBase('andrè'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andré'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andrê'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andrë'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andrē'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andrė'), 'andre');
		assert.strictEqual(tryNormalizeToBase('andrę'), 'andre');

		assert.strictEqual(tryNormalizeToBase('hvîc'), 'hvic');
		assert.strictEqual(tryNormalizeToBase('hvïc'), 'hvic');
		assert.strictEqual(tryNormalizeToBase('hvíc'), 'hvic');
		assert.strictEqual(tryNormalizeToBase('hvīc'), 'hvic');
		assert.strictEqual(tryNormalizeToBase('hvįc'), 'hvic');
		assert.strictEqual(tryNormalizeToBase('hvìc'), 'hvic');

		assert.strictEqual(tryNormalizeToBase('ûdo'), 'udo');
		assert.strictEqual(tryNormalizeToBase('üdo'), 'udo');
		assert.strictEqual(tryNormalizeToBase('ùdo'), 'udo');
		assert.strictEqual(tryNormalizeToBase('údo'), 'udo');
		assert.strictEqual(tryNormalizeToBase('ūdo'), 'udo');

		assert.strictEqual(tryNormalizeToBase('heÿ'), 'hey');

		// assert.strictEqual(strings.tryNormalizeToBase('gruß'), 'grus');
		assert.strictEqual(tryNormalizeToBase('gruś'), 'grus');
		assert.strictEqual(tryNormalizeToBase('gruš'), 'grus');

		assert.strictEqual(tryNormalizeToBase('çool'), 'cool');
		assert.strictEqual(tryNormalizeToBase('ćool'), 'cool');
		assert.strictEqual(tryNormalizeToBase('čool'), 'cool');

		assert.strictEqual(tryNormalizeToBase('ñice'), 'nice');
		assert.strictEqual(tryNormalizeToBase('ńice'), 'nice');

		// Different cases
		assert.strictEqual(tryNormalizeToBase('CAFÉ'), 'cafe');
		assert.strictEqual(tryNormalizeToBase('Café'), 'cafe');
		assert.strictEqual(tryNormalizeToBase('café'), 'cafe');
		assert.strictEqual(tryNormalizeToBase('JOÃO'), 'joao');
		assert.strictEqual(tryNormalizeToBase('João'), 'joao');

		// Mixed cases with accents
		assert.strictEqual(tryNormalizeToBase('CaFé'), 'cafe');
		assert.strictEqual(tryNormalizeToBase('JoÃo'), 'joao');
		assert.strictEqual(tryNormalizeToBase('AnDrÉ'), 'andre');

		// Precomposed accents
		assert.strictEqual(tryNormalizeToBase('\u00E9'), 'e');
		assert.strictEqual(tryNormalizeToBase('\u00E0'), 'a');
		assert.strictEqual(tryNormalizeToBase('caf\u00E9'), 'cafe');

		// Base + combining accents - lower only
		assert.strictEqual(tryNormalizeToBase('\u0065\u0301'), '\u0065\u0301');
		assert.strictEqual(tryNormalizeToBase('Ã\u0061\u0300'), 'ã\u0061\u0300');
		assert.strictEqual(tryNormalizeToBase('CaF\u0065\u0301'), 'caf\u0065\u0301');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/numbers.test.ts]---
Location: vscode-main/src/vs/base/test/common/numbers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { isPointWithinTriangle } from '../../common/numbers.js';

suite('isPointWithinTriangle', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should return true if the point is within the triangle', () => {
		const result = isPointWithinTriangle(0.25, 0.25, 0, 0, 1, 0, 0, 1);
		assert.ok(result);
	});

	test('should return false if the point is outside the triangle', () => {
		const result = isPointWithinTriangle(2, 2, 0, 0, 1, 0, 0, 1);
		assert.ok(!result);
	});

	test('should return true if the point is on the edge of the triangle', () => {
		const result = isPointWithinTriangle(0.5, 0, 0, 0, 1, 0, 0, 1);
		assert.ok(result);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/oauth.test.ts]---
Location: vscode-main/src/vs/base/test/common/oauth.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import {
	getClaimsFromJWT,
	getDefaultMetadataForUrl,
	isAuthorizationAuthorizeResponse,
	isAuthorizationDeviceResponse,
	isAuthorizationErrorResponse,
	isAuthorizationDynamicClientRegistrationResponse,
	isAuthorizationProtectedResourceMetadata,
	isAuthorizationServerMetadata,
	isAuthorizationTokenResponse,
	parseWWWAuthenticateHeader,
	fetchDynamicRegistration,
	fetchResourceMetadata,
	fetchAuthorizationServerMetadata,
	scopesMatch,
	IAuthorizationJWTClaims,
	IAuthorizationServerMetadata,
	DEFAULT_AUTH_FLOW_PORT
} from '../../common/oauth.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { encodeBase64, VSBuffer } from '../../common/buffer.js';

suite('OAuth', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	suite('Type Guards', () => {
		test('isAuthorizationProtectedResourceMetadata should correctly identify protected resource metadata', () => {
			// Valid metadata with minimal required fields
			assert.strictEqual(isAuthorizationProtectedResourceMetadata({ resource: 'https://example.com' }), true);

			// Valid metadata with scopes_supported as array
			assert.strictEqual(isAuthorizationProtectedResourceMetadata({
				resource: 'https://example.com',
				scopes_supported: ['read', 'write']
			}), true);

			// Invalid cases - missing resource
			assert.strictEqual(isAuthorizationProtectedResourceMetadata(null), false);
			assert.strictEqual(isAuthorizationProtectedResourceMetadata(undefined), false);
			assert.strictEqual(isAuthorizationProtectedResourceMetadata({}), false);
			assert.strictEqual(isAuthorizationProtectedResourceMetadata('not an object'), false);

			// Invalid cases - scopes_supported is not an array when provided
			assert.strictEqual(isAuthorizationProtectedResourceMetadata({
				resource: 'https://example.com',
				scopes_supported: 'not an array'
			}), false);
		});

		test('isAuthorizationServerMetadata should correctly identify server metadata', () => {
			// Valid metadata with minimal required fields
			assert.strictEqual(isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				response_types_supported: ['code']
			}), true);

			// Valid metadata with valid URLs
			assert.strictEqual(isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				authorization_endpoint: 'https://example.com/auth',
				token_endpoint: 'https://example.com/token',
				registration_endpoint: 'https://example.com/register',
				jwks_uri: 'https://example.com/jwks',
				response_types_supported: ['code']
			}), true);

			// Valid metadata with http URLs (for localhost/testing)
			assert.strictEqual(isAuthorizationServerMetadata({
				issuer: 'http://localhost:8080',
				authorization_endpoint: 'http://localhost:8080/auth',
				token_endpoint: 'http://localhost:8080/token',
				response_types_supported: ['code']
			}), true);

			// Invalid cases - not an object
			assert.strictEqual(isAuthorizationServerMetadata(null), false);
			assert.strictEqual(isAuthorizationServerMetadata(undefined), false);
			assert.strictEqual(isAuthorizationServerMetadata('not an object'), false);

			// Invalid cases - missing issuer should throw
			assert.throws(() => isAuthorizationServerMetadata({}), /Authorization server metadata must have an issuer/);
			assert.throws(() => isAuthorizationServerMetadata({ response_types_supported: ['code'] }), /Authorization server metadata must have an issuer/);

			// Invalid cases - URI fields must be strings when provided (truthy values)
			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				authorization_endpoint: 123,
				response_types_supported: ['code']
			}), /Authorization server metadata 'authorization_endpoint' must be a string/);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				token_endpoint: 123,
				response_types_supported: ['code']
			}), /Authorization server metadata 'token_endpoint' must be a string/);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				registration_endpoint: [],
				response_types_supported: ['code']
			}), /Authorization server metadata 'registration_endpoint' must be a string/);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				jwks_uri: {},
				response_types_supported: ['code']
			}), /Authorization server metadata 'jwks_uri' must be a string/);

			// Invalid cases - URI fields must start with http:// or https://
			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'ftp://example.com',
				response_types_supported: ['code']
			}), /Authorization server metadata 'issuer' must start with http:\/\/ or https:\/\//);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				authorization_endpoint: 'ftp://example.com/auth',
				response_types_supported: ['code']
			}), /Authorization server metadata 'authorization_endpoint' must start with http:\/\/ or https:\/\//);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				token_endpoint: 'file:///path/to/token',
				response_types_supported: ['code']
			}), /Authorization server metadata 'token_endpoint' must start with http:\/\/ or https:\/\//);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				registration_endpoint: 'mailto:admin@example.com',
				response_types_supported: ['code']
			}), /Authorization server metadata 'registration_endpoint' must start with http:\/\/ or https:\/\//);

			assert.throws(() => isAuthorizationServerMetadata({
				issuer: 'https://example.com',
				jwks_uri: 'data:application/json,{}',
				response_types_supported: ['code']
			}), /Authorization server metadata 'jwks_uri' must start with http:\/\/ or https:\/\//);
		});

		test('isAuthorizationDynamicClientRegistrationResponse should correctly identify registration response', () => {
			// Valid response
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse({
				client_id: 'client-123',
				client_name: 'Test Client'
			}), true);

			// Invalid cases
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse(null), false);
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse(undefined), false);
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse({}), false);
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse({ client_id: 'just-id' }), true);
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse({ client_name: 'missing-id' }), false);
			assert.strictEqual(isAuthorizationDynamicClientRegistrationResponse('not an object'), false);
		});

		test('isAuthorizationAuthorizeResponse should correctly identify authorization response', () => {
			// Valid response
			assert.strictEqual(isAuthorizationAuthorizeResponse({
				code: 'auth-code-123',
				state: 'state-123'
			}), true);

			// Invalid cases
			assert.strictEqual(isAuthorizationAuthorizeResponse(null), false);
			assert.strictEqual(isAuthorizationAuthorizeResponse(undefined), false);
			assert.strictEqual(isAuthorizationAuthorizeResponse({}), false);
			assert.strictEqual(isAuthorizationAuthorizeResponse({ code: 'missing-state' }), false);
			assert.strictEqual(isAuthorizationAuthorizeResponse({ state: 'missing-code' }), false);
			assert.strictEqual(isAuthorizationAuthorizeResponse('not an object'), false);
		});

		test('isAuthorizationTokenResponse should correctly identify token response', () => {
			// Valid response
			assert.strictEqual(isAuthorizationTokenResponse({
				access_token: 'token-123',
				token_type: 'Bearer'
			}), true);

			// Invalid cases
			assert.strictEqual(isAuthorizationTokenResponse(null), false);
			assert.strictEqual(isAuthorizationTokenResponse(undefined), false);
			assert.strictEqual(isAuthorizationTokenResponse({}), false);
			assert.strictEqual(isAuthorizationTokenResponse({ access_token: 'missing-type' }), false);
			assert.strictEqual(isAuthorizationTokenResponse({ token_type: 'missing-token' }), false);
			assert.strictEqual(isAuthorizationTokenResponse('not an object'), false);
		});

		test('isAuthorizationDeviceResponse should correctly identify device authorization response', () => {
			// Valid response
			assert.strictEqual(isAuthorizationDeviceResponse({
				device_code: 'device-code-123',
				user_code: 'ABCD-EFGH',
				verification_uri: 'https://example.com/verify',
				expires_in: 1800
			}), true);

			// Valid response with optional fields
			assert.strictEqual(isAuthorizationDeviceResponse({
				device_code: 'device-code-123',
				user_code: 'ABCD-EFGH',
				verification_uri: 'https://example.com/verify',
				verification_uri_complete: 'https://example.com/verify?user_code=ABCD-EFGH',
				expires_in: 1800,
				interval: 5
			}), true);

			// Invalid cases
			assert.strictEqual(isAuthorizationDeviceResponse(null), false);
			assert.strictEqual(isAuthorizationDeviceResponse(undefined), false);
			assert.strictEqual(isAuthorizationDeviceResponse({}), false);
			assert.strictEqual(isAuthorizationDeviceResponse({ device_code: 'missing-others' }), false);
			assert.strictEqual(isAuthorizationDeviceResponse({ user_code: 'missing-others' }), false);
			assert.strictEqual(isAuthorizationDeviceResponse({ verification_uri: 'missing-others' }), false);
			assert.strictEqual(isAuthorizationDeviceResponse({ expires_in: 1800 }), false);
			assert.strictEqual(isAuthorizationDeviceResponse({
				device_code: 'device-code-123',
				user_code: 'ABCD-EFGH',
				verification_uri: 'https://example.com/verify'
				// Missing expires_in
			}), false);
			assert.strictEqual(isAuthorizationDeviceResponse('not an object'), false);
		});

		test('isAuthorizationErrorResponse should correctly identify error response', () => {
			// Valid error response
			assert.strictEqual(isAuthorizationErrorResponse({
				error: 'authorization_pending',
				error_description: 'The authorization request is still pending'
			}), true);

			// Valid error response with different error codes
			assert.strictEqual(isAuthorizationErrorResponse({
				error: 'slow_down',
				error_description: 'Polling too fast'
			}), true);

			assert.strictEqual(isAuthorizationErrorResponse({
				error: 'access_denied',
				error_description: 'The user denied the request'
			}), true);

			assert.strictEqual(isAuthorizationErrorResponse({
				error: 'expired_token',
				error_description: 'The device code has expired'
			}), true);

			// Valid response with optional error_uri
			assert.strictEqual(isAuthorizationErrorResponse({
				error: 'invalid_request',
				error_description: 'The request is missing a required parameter',
				error_uri: 'https://example.com/error'
			}), true);

			// Invalid cases
			assert.strictEqual(isAuthorizationErrorResponse(null), false);
			assert.strictEqual(isAuthorizationErrorResponse(undefined), false);
			assert.strictEqual(isAuthorizationErrorResponse({}), false);
			assert.strictEqual(isAuthorizationErrorResponse({ error_description: 'missing-error' }), false);
			assert.strictEqual(isAuthorizationErrorResponse('not an object'), false);
		});
	});

	suite('Scope Matching', () => {
		test('scopesMatch should return true for identical scopes', () => {
			const scopes1 = ['test', 'scopes'];
			const scopes2 = ['test', 'scopes'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), true);
		});

		test('scopesMatch should return true for scopes in different order', () => {
			const scopes1 = ['6f1cc985-85e8-487e-b0dd-aa633302a731/.default', 'VSCODE_TENANT:organizations'];
			const scopes2 = ['VSCODE_TENANT:organizations', '6f1cc985-85e8-487e-b0dd-aa633302a731/.default'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), true);
		});

		test('scopesMatch should return false for different scopes', () => {
			const scopes1 = ['test', 'scopes'];
			const scopes2 = ['different', 'scopes'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), false);
		});

		test('scopesMatch should return false for different length arrays', () => {
			const scopes1 = ['test'];
			const scopes2 = ['test', 'scopes'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), false);
		});

		test('scopesMatch should handle complex Microsoft scopes', () => {
			const scopes1 = ['6f1cc985-85e8-487e-b0dd-aa633302a731/.default', 'VSCODE_TENANT:organizations'];
			const scopes2 = ['VSCODE_TENANT:organizations', '6f1cc985-85e8-487e-b0dd-aa633302a731/.default'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), true);
		});

		test('scopesMatch should handle empty arrays', () => {
			assert.strictEqual(scopesMatch([], []), true);
		});

		test('scopesMatch should handle single scope arrays', () => {
			assert.strictEqual(scopesMatch(['single'], ['single']), true);
			assert.strictEqual(scopesMatch(['single'], ['different']), false);
		});

		test('scopesMatch should handle duplicate scopes within arrays', () => {
			const scopes1 = ['scope1', 'scope2', 'scope1'];
			const scopes2 = ['scope2', 'scope1', 'scope1'];
			assert.strictEqual(scopesMatch(scopes1, scopes2), true);
		});

		test('scopesMatch should handle undefined values', () => {
			assert.strictEqual(scopesMatch(undefined, undefined), true);
			assert.strictEqual(scopesMatch(['read'], undefined), false);
			assert.strictEqual(scopesMatch(undefined, ['write']), false);
		});

		test('scopesMatch should handle mixed undefined and empty arrays', () => {
			assert.strictEqual(scopesMatch([], undefined), false);
			assert.strictEqual(scopesMatch(undefined, []), false);
			assert.strictEqual(scopesMatch([], []), true);
		});
	});

	suite('Utility Functions', () => {
		test('getDefaultMetadataForUrl should return correct default endpoints', () => {
			const authorizationServer = new URL('https://auth.example.com');
			const metadata = getDefaultMetadataForUrl(authorizationServer);

			assert.strictEqual(metadata.issuer, 'https://auth.example.com/');
			assert.strictEqual(metadata.authorization_endpoint, 'https://auth.example.com/authorize');
			assert.strictEqual(metadata.token_endpoint, 'https://auth.example.com/token');
			assert.strictEqual(metadata.registration_endpoint, 'https://auth.example.com/register');
			assert.deepStrictEqual(metadata.response_types_supported, ['code', 'id_token', 'id_token token']);
		});
	});

	suite('Parsing Functions', () => {
		test('parseWWWAuthenticateHeader should correctly parse simple header', () => {
			const result = parseWWWAuthenticateHeader('Bearer');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].scheme, 'Bearer');
			assert.deepStrictEqual(result[0].params, {});
		});

		test('parseWWWAuthenticateHeader should correctly parse header with parameters', () => {
			const result = parseWWWAuthenticateHeader('Bearer realm="api", error="invalid_token", error_description="The access token expired"');

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].scheme, 'Bearer');
			assert.deepStrictEqual(result[0].params, {
				realm: 'api',
				error: 'invalid_token',
				error_description: 'The access token expired'
			});
		});

		test('parseWWWAuthenticateHeader should correctly parse parameters with equal signs', () => {
			const result = parseWWWAuthenticateHeader('Bearer resource_metadata="https://example.com/.well-known/oauth-protected-resource?v=1"');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].scheme, 'Bearer');
			assert.deepStrictEqual(result[0].params, {
				resource_metadata: 'https://example.com/.well-known/oauth-protected-resource?v=1'
			});
		});

		test('parseWWWAuthenticateHeader should correctly parse multiple', () => {
			const result = parseWWWAuthenticateHeader('Bearer realm="api", error="invalid_token", error_description="The access token expired", Basic realm="hi"');

			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].scheme, 'Bearer');
			assert.deepStrictEqual(result[0].params, {
				realm: 'api',
				error: 'invalid_token',
				error_description: 'The access token expired'
			});
			assert.strictEqual(result[1].scheme, 'Basic');
			assert.deepStrictEqual(result[1].params, {
				realm: 'hi'
			});
		});


		test('getClaimsFromJWT should correctly parse a JWT token', () => {
			// Create a sample JWT with known payload
			const payload: IAuthorizationJWTClaims = {
				jti: 'id123',
				sub: 'user123',
				iss: 'https://example.com',
				aud: 'client123',
				exp: 1716239022,
				iat: 1716235422,
				name: 'Test User'
			};

			// Create fake but properly formatted JWT
			const header = { alg: 'HS256', typ: 'JWT' };
			const encodedHeader = encodeBase64(VSBuffer.fromString(JSON.stringify(header)));
			const encodedPayload = encodeBase64(VSBuffer.fromString(JSON.stringify(payload)));
			const fakeSignature = 'fake-signature';
			const token = `${encodedHeader}.${encodedPayload}.${fakeSignature}`;

			const claims = getClaimsFromJWT(token);
			assert.deepStrictEqual(claims, payload);
		});

		test('getClaimsFromJWT should throw for invalid JWT format', () => {
			// Test with wrong number of parts - should throw "Invalid JWT token format"
			assert.throws(() => getClaimsFromJWT('only.two'), /Invalid JWT token format.*three parts/);
			assert.throws(() => getClaimsFromJWT('one'), /Invalid JWT token format.*three parts/);
			assert.throws(() => getClaimsFromJWT('has.four.parts.here'), /Invalid JWT token format.*three parts/);
		});

		test('getClaimsFromJWT should throw for invalid header content', () => {
			// Create JWT with invalid header
			const encodedHeader = encodeBase64(VSBuffer.fromString('not-json'));
			const encodedPayload = encodeBase64(VSBuffer.fromString(JSON.stringify({ sub: 'test' })));
			const token = `${encodedHeader}.${encodedPayload}.signature`;

			assert.throws(() => getClaimsFromJWT(token), /Failed to parse JWT token/);
		});

		test('getClaimsFromJWT should throw for invalid payload content', () => {
			// Create JWT with valid header but invalid payload
			const header = { alg: 'HS256', typ: 'JWT' };
			const encodedHeader = encodeBase64(VSBuffer.fromString(JSON.stringify(header)));
			const encodedPayload = encodeBase64(VSBuffer.fromString('not-json'));
			const token = `${encodedHeader}.${encodedPayload}.signature`;

			assert.throws(() => getClaimsFromJWT(token), /Failed to parse JWT token/);
		});
	});

	suite('Network Functions', () => {
		let sandbox: sinon.SinonSandbox;
		let fetchStub: sinon.SinonStub;

		setup(() => {
			sandbox = sinon.createSandbox();
			fetchStub = sandbox.stub(globalThis, 'fetch');
		});

		teardown(() => {
			sandbox.restore();
		});

		test('fetchDynamicRegistration should make correct request and parse response', async () => {
			// Setup successful response
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client',
				client_uri: 'https://code.visualstudio.com'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			const result = await fetchDynamicRegistration(
				serverMetadata,
				'Test Client'
			);

			// Verify fetch was called correctly
			assert.strictEqual(fetchStub.callCount, 1);
			const [url, options] = fetchStub.firstCall.args;
			assert.strictEqual(url, 'https://auth.example.com/register');
			assert.strictEqual(options.method, 'POST');
			assert.strictEqual(options.headers['Content-Type'], 'application/json');

			// Verify request body
			const requestBody = JSON.parse(options.body as string);
			assert.strictEqual(requestBody.client_name, 'Test Client');
			assert.strictEqual(requestBody.client_uri, 'https://code.visualstudio.com');
			assert.deepStrictEqual(requestBody.grant_types, ['authorization_code', 'refresh_token', 'urn:ietf:params:oauth:grant-type:device_code']);
			assert.deepStrictEqual(requestBody.response_types, ['code']);
			assert.deepStrictEqual(requestBody.redirect_uris, [
				'https://insiders.vscode.dev/redirect',
				'https://vscode.dev/redirect',
				'http://127.0.0.1/',
				`http://127.0.0.1:${DEFAULT_AUTH_FLOW_PORT}/`
			]);

			// Verify response is processed correctly
			assert.deepStrictEqual(result, mockResponse);
		});

		test('fetchDynamicRegistration should throw error on non-OK response', async () => {
			fetchStub.resolves({
				ok: false,
				statusText: 'Bad Request',
				text: async () => 'Bad Request'
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Registration to https:\/\/auth\.example\.com\/register failed: Bad Request/
			);
		});

		test('fetchDynamicRegistration should throw error on invalid response format', async () => {
			fetchStub.resolves({
				ok: true,
				json: async () => ({ invalid: 'response' }) // Missing required fields
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Invalid authorization dynamic client registration response/
			);
		});

		test('fetchDynamicRegistration should filter grant types based on server metadata', async () => {
			// Setup successful response
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code'],
				grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'] // Mix of supported and unsupported
			};

			await fetchDynamicRegistration(serverMetadata, 'Test Client');

			// Verify fetch was called correctly
			assert.strictEqual(fetchStub.callCount, 1);
			const [, options] = fetchStub.firstCall.args;

			// Verify request body contains only the intersection of supported grant types
			const requestBody = JSON.parse(options.body as string);
			assert.deepStrictEqual(requestBody.grant_types, ['authorization_code', 'refresh_token']); // client_credentials should be filtered out
		});

		test('fetchDynamicRegistration should use default grant types when server metadata has none', async () => {
			// Setup successful response
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
				// No grant_types_supported specified
			};

			await fetchDynamicRegistration(serverMetadata, 'Test Client');

			// Verify fetch was called correctly
			assert.strictEqual(fetchStub.callCount, 1);
			const [, options] = fetchStub.firstCall.args;

			// Verify request body contains default grant types
			const requestBody = JSON.parse(options.body as string);
			assert.deepStrictEqual(requestBody.grant_types, ['authorization_code', 'refresh_token', 'urn:ietf:params:oauth:grant-type:device_code']);
		});

		test('fetchDynamicRegistration should throw error when registration endpoint is missing', async () => {
			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				response_types_supported: ['code']
				// registration_endpoint is missing
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Server does not support dynamic registration/
			);
		});

		test('fetchDynamicRegistration should handle structured error response', async () => {
			const errorResponse = {
				error: 'invalid_client_metadata',
				error_description: 'The client metadata is invalid'
			};

			fetchStub.resolves({
				ok: false,
				text: async () => JSON.stringify(errorResponse)
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Registration to https:\/\/auth\.example\.com\/register failed: invalid_client_metadata: The client metadata is invalid/
			);
		});

		test('fetchDynamicRegistration should handle structured error response without description', async () => {
			const errorResponse = {
				error: 'invalid_redirect_uri'
			};

			fetchStub.resolves({
				ok: false,
				text: async () => JSON.stringify(errorResponse)
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Registration to https:\/\/auth\.example\.com\/register failed: invalid_redirect_uri/
			);
		});

		test('fetchDynamicRegistration should handle malformed JSON error response', async () => {
			fetchStub.resolves({
				ok: false,
				text: async () => 'Invalid JSON {'
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Registration to https:\/\/auth\.example\.com\/register failed: Invalid JSON \{/
			);
		});

		test('fetchDynamicRegistration should include scopes in request when provided', async () => {
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await fetchDynamicRegistration(serverMetadata, 'Test Client', ['read', 'write']);

			// Verify request includes scopes
			const [, options] = fetchStub.firstCall.args;
			const requestBody = JSON.parse(options.body as string);
			assert.strictEqual(requestBody.scope, 'read write');
		});

		test('fetchDynamicRegistration should omit scope from request when not provided', async () => {
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await fetchDynamicRegistration(serverMetadata, 'Test Client');

			// Verify request does not include scope when not provided
			const [, options] = fetchStub.firstCall.args;
			const requestBody = JSON.parse(options.body as string);
			assert.strictEqual(requestBody.scope, undefined);
		});

		test('fetchDynamicRegistration should handle empty scopes array', async () => {
			const mockResponse = {
				client_id: 'generated-client-id',
				client_name: 'Test Client'
			};

			fetchStub.resolves({
				ok: true,
				json: async () => mockResponse
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await fetchDynamicRegistration(serverMetadata, 'Test Client', []);

			// Verify request includes empty scope
			const [, options] = fetchStub.firstCall.args;
			const requestBody = JSON.parse(options.body as string);
			assert.strictEqual(requestBody.scope, '');
		});

		test('fetchDynamicRegistration should handle network fetch failure', async () => {
			fetchStub.rejects(new Error('Network error'));

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Network error/
			);
		});

		test('fetchDynamicRegistration should handle response.json() failure', async () => {
			fetchStub.resolves({
				ok: true,
				json: async () => {
					throw new Error('JSON parsing failed');
				}
			} as unknown as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/JSON parsing failed/
			);
		});

		test('fetchDynamicRegistration should handle response.text() failure for error cases', async () => {
			fetchStub.resolves({
				ok: false,
				text: async () => {
					throw new Error('Text parsing failed');
				}
			} as unknown as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Text parsing failed/
			);
		});
	});

	suite('Client ID Fallback Scenarios', () => {
		let sandbox: sinon.SinonSandbox;
		let fetchStub: sinon.SinonStub;

		setup(() => {
			sandbox = sinon.createSandbox();
			fetchStub = sandbox.stub(globalThis, 'fetch');
		});

		teardown(() => {
			sandbox.restore();
		});

		test('fetchDynamicRegistration should throw specific error for missing registration endpoint', async () => {
			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				response_types_supported: ['code']
				// registration_endpoint is missing
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				{
					message: 'Server does not support dynamic registration'
				}
			);
		});

		test('fetchDynamicRegistration should throw specific error for DCR failure', async () => {
			fetchStub.resolves({
				ok: false,
				text: async () => 'DCR not supported'
			} as Response);

			const serverMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code']
			};

			await assert.rejects(
				async () => await fetchDynamicRegistration(serverMetadata, 'Test Client'),
				/Registration to https:\/\/auth\.example\.com\/register failed: DCR not supported/
			);
		});
	});

	suite('fetchResourceMetadata', () => {
		let sandbox: sinon.SinonSandbox;
		let fetchStub: sinon.SinonStub;

		setup(() => {
			sandbox = sinon.createSandbox();
			fetchStub = sandbox.stub();
		});

		teardown(() => {
			sandbox.restore();
		});

		test('should successfully fetch and validate resource metadata', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const expectedMetadata = {
				resource: 'https://example.com/api',
				scopes_supported: ['read', 'write']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			assert.strictEqual(fetchStub.firstCall.args[0], resourceMetadataUrl);
			assert.strictEqual(fetchStub.firstCall.args[1].method, 'GET');
			assert.strictEqual(fetchStub.firstCall.args[1].headers['Accept'], 'application/json');
		});

		test('should include same-origin headers when origins match', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const sameOriginHeaders = {
				'X-Test-Header': 'test-value',
				'X-Custom-Header': 'value'
			};
			const expectedMetadata = {
				resource: 'https://example.com/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub, sameOriginHeaders }
			);

			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['Accept'], 'application/json');
			assert.strictEqual(headers['X-Test-Header'], 'test-value');
			assert.strictEqual(headers['X-Custom-Header'], 'value');
		});

		test('should not include same-origin headers when origins differ', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://other-domain.com/.well-known/oauth-protected-resource';
			const sameOriginHeaders = {
				'X-Test-Header': 'test-value'
			};
			const expectedMetadata = {
				resource: 'https://example.com/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub, sameOriginHeaders }
			);

			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['Accept'], 'application/json');
			assert.strictEqual(headers['X-Test-Header'], undefined);
		});

		test('should throw error when fetch returns non-200 status', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';

			// Stub all possible URLs to return 404 for robust fallback testing
			fetchStub.resolves({
				status: 404,
				text: async () => 'Not Found'
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs fail
					assert.ok(error instanceof AggregateError || /Failed to fetch resource metadata from.*404 Not Found/.test(error.message));
					return true;
				}
			);
		});

		test('should handle error when response.text() throws', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';

			// Stub all possible URLs to return 500 for robust fallback testing
			fetchStub.resolves({
				status: 500,
				statusText: 'Internal Server Error',
				text: async () => { throw new Error('Cannot read response'); }
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs fail
					assert.ok(error instanceof AggregateError || /Failed to fetch resource metadata from.*500 Internal Server Error/.test(error.message));
					return true;
				}
			);
		});

		test('should throw error when resource property does not match target resource', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const metadata = {
				resource: 'https://different.com/api'
			};

			// Stub all possible URLs to return invalid metadata for robust fallback testing
			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs fail validation
					assert.ok(error instanceof AggregateError);
					assert.ok(error.errors.some((e: Error) => /does not match expected value/.test(e.message)));
					return true;
				}
			);
		});

		test('should normalize URLs when comparing resource values', async () => {
			const targetResource = 'https://EXAMPLE.COM/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const metadata = {
				resource: 'https://example.com/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			// URL normalization should handle hostname case differences
			const result = await fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub });
			assert.deepStrictEqual(result.metadata, metadata);
		});

		test('should throw error when response is not valid resource metadata', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const invalidMetadata = {
				// Missing required 'resource' property
				scopes_supported: ['read', 'write']
			};

			// Stub all possible URLs to return invalid metadata for robust fallback testing
			fetchStub.resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata)
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs return invalid metadata
					assert.ok(error instanceof AggregateError || /Invalid resource metadata/.test(error.message));
					return true;
				}
			);
		});

		test('should throw error when scopes_supported is not an array', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const invalidMetadata = {
				resource: 'https://example.com/api',
				scopes_supported: 'not an array'
			};

			// Stub all possible URLs to return invalid metadata for robust fallback testing
			fetchStub.resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata)
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs return invalid metadata
					assert.ok(error instanceof AggregateError || /Invalid resource metadata/.test(error.message));
					return true;
				}
			);
		});

		test('should handle metadata with optional fields', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const metadata = {
				resource: 'https://example.com/api',
				resource_name: 'Example API',
				authorization_servers: ['https://auth.example.com'],
				jwks_uri: 'https://example.com/jwks',
				scopes_supported: ['read', 'write', 'admin'],
				bearer_methods_supported: ['header', 'body'],
				resource_documentation: 'https://example.com/docs'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			const result = await fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub });
			assert.deepStrictEqual(result.metadata, metadata);
		});

		test('should use global fetch when custom fetch is not provided', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const metadata = {
				resource: 'https://example.com/api'
			};

			// eslint-disable-next-line local/code-no-any-casts
			const globalFetchStub = sandbox.stub(globalThis, 'fetch').resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			} as any);

			const result = await fetchResourceMetadata(targetResource, resourceMetadataUrl);

			assert.deepStrictEqual(result.metadata, metadata);
			assert.strictEqual(globalFetchStub.callCount, 1);
		});

		test('should handle same origin with different ports', async () => {
			const targetResource = 'https://example.com:8080/api';
			const resourceMetadataUrl = 'https://example.com:9090/.well-known/oauth-protected-resource';
			const sameOriginHeaders = {
				'X-Test-Header': 'test-value'
			};
			const metadata = {
				resource: 'https://example.com:8080/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub, sameOriginHeaders }
			);

			// Different ports mean different origins
			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['X-Test-Header'], undefined);
		});

		test('should handle same origin with different protocols', async () => {
			const targetResource = 'http://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const sameOriginHeaders = {
				'X-Test-Header': 'test-value'
			};
			const metadata = {
				resource: 'http://example.com/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub, sameOriginHeaders }
			);

			// Different protocols mean different origins
			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['X-Test-Header'], undefined);
		});

		test('should include error details in message with resource values', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const metadata = {
				resource: 'https://different.com/other'
			};

			// Stub all possible URLs to return invalid metadata for robust fallback testing
			fetchStub.resolves({
				status: 200,
				json: async () => metadata,
				text: async () => JSON.stringify(metadata)
			});

			try {
				await fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub });
				assert.fail('Should have thrown an error');
			} catch (error: any) {
				// Should be AggregateError with validation errors
				const errorMessage = error instanceof AggregateError ? error.errors.map((e: Error) => e.message).join(' ') : error.message;
				assert.ok(/does not match expected value/.test(errorMessage), 'Error message should mention mismatch');
				assert.ok(/https:\/\/different\.com\/other/.test(errorMessage), 'Error message should include actual resource value');
				assert.ok(/https:\/\/example\.com\/api/.test(errorMessage), 'Error message should include expected resource value');
			}
		});

		test('should fallback to well-known URI with path when no resourceMetadataUrl provided', async () => {
			const targetResource = 'https://example.com/api/v1';
			const expectedMetadata = {
				resource: 'https://example.com/api/v1',
				scopes_supported: ['read', 'write']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			// Should try path-appended version first
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://example.com/.well-known/oauth-protected-resource/api/v1');
		});

		test('should fallback to well-known URI at root when path version fails', async () => {
			const targetResource = 'https://example.com/api/v1';
			const expectedMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read', 'write']
			};

			// First call fails, second succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
			// First attempt with path
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://example.com/.well-known/oauth-protected-resource/api/v1');
			// Second attempt at root
			assert.strictEqual(fetchStub.secondCall.args[0], 'https://example.com/.well-known/oauth-protected-resource');
		});

		test('should throw error when all well-known URIs fail', async () => {
			const targetResource = 'https://example.com/api/v1';

			fetchStub.resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, undefined, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 2, 'Should contain 2 errors');
					assert.ok(/Failed to fetch resource metadata from.*\/api\/v1.*404/.test(error.errors[0].message), 'First error should mention /api/v1 and 404');
					assert.ok(/Failed to fetch resource metadata from.*\.well-known.*404/.test(error.errors[1].message), 'Second error should mention .well-known and 404');
					return true;
				}
			); assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should not append path when target resource is root', async () => {
			const targetResource = 'https://example.com/';
			const expectedMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			// Both URLs should be the same when path is /
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://example.com/.well-known/oauth-protected-resource');
		});

		test('should include same-origin headers when using well-known fallback', async () => {
			const targetResource = 'https://example.com/api';
			const sameOriginHeaders = {
				'X-Test-Header': 'test-value',
				'X-Custom-Header': 'value'
			};
			const expectedMetadata = {
				resource: 'https://example.com/api'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub, sameOriginHeaders }
			);

			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['Accept'], 'application/json');
			assert.strictEqual(headers['X-Test-Header'], 'test-value');
			assert.strictEqual(headers['X-Custom-Header'], 'value');
		});

		test('should handle fetchImpl throwing network error and continue to next URL', async () => {
			const targetResource = 'https://example.com/api/v1';
			const expectedMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read', 'write']
			};

			// First call throws network error, second succeeds
			fetchStub.onFirstCall().rejects(new Error('Network connection failed'));

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
			// First attempt with path should have thrown error
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://example.com/.well-known/oauth-protected-resource/api/v1');
			// Second attempt at root should succeed
			assert.strictEqual(fetchStub.secondCall.args[0], 'https://example.com/.well-known/oauth-protected-resource');
		});

		test('should throw AggregateError when fetchImpl throws on all URLs', async () => {
			const targetResource = 'https://example.com/api/v1';

			// Both calls throw network errors
			fetchStub.rejects(new Error('Network connection failed'));

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, undefined, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 2, 'Should contain 2 errors');
					assert.ok(/Network connection failed/.test(error.errors[0].message), 'First error should mention network failure');
					assert.ok(/Network connection failed/.test(error.errors[1].message), 'Second error should mention network failure');
					return true;
				}
			);

			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should handle mix of fetch error and non-200 response', async () => {
			const targetResource = 'https://example.com/api/v1';

			// First call throws network error
			fetchStub.onFirstCall().rejects(new Error('Connection timeout'));

			// Second call returns 404
			fetchStub.onSecondCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, undefined, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 2, 'Should contain 2 errors');
					assert.ok(/Connection timeout/.test(error.errors[0].message), 'First error should be network error');
					assert.ok(/Failed to fetch resource metadata.*404/.test(error.errors[1].message), 'Second error should be 404');
					return true;
				}
			);

			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should accept root URL in PRM resource when using root discovery fallback (no trailing slash)', async () => {
			const targetResource = 'https://example.com/api/v1';
			// Per RFC 9728: when metadata retrieved from root discovery URL,
			// the resource value must match the root URL (where well-known was inserted)
			const expectedMetadata = {
				resource: 'https://example.com',
				scopes_supported: ['read', 'write']
			};

			// First call (path-appended) fails, second (root) succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should accept root URL in PRM resource when using root discovery fallback (with trailing slash)', async () => {
			const targetResource = 'https://example.com/api/v1';
			// Test that trailing slash form is also accepted (URL normalization)
			const expectedMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read', 'write']
			};

			// First call (path-appended) fails, second (root) succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				undefined,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should reject PRM with full path resource when using root discovery fallback', async () => {
			const targetResource = 'https://example.com/api/v1';
			// This violates RFC 9728: root discovery PRM should have root URL, not full path
			const invalidMetadata = {
				resource: 'https://example.com/api/v1',
				scopes_supported: ['read']
			};

			// First call (path-appended) fails, second (root) returns invalid metadata
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found'
			});

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata)
			});

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, undefined, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 2);
					// First error is 404 from path-appended attempt
					assert.ok(/404/.test(error.errors[0].message));
					// Second error is validation failure from root attempt
					assert.ok(/does not match expected value/.test(error.errors[1].message));
					// Check that validation was against root URL (origin) not full path
					assert.ok(/https:\/\/example\.com\/api\/v1.*https:\/\/example\.com/.test(error.errors[1].message));
					return true;
				}
			);

			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should reject PRM with root resource when using path-appended discovery', async () => {
			const targetResource = 'https://example.com/api/v1';
			// This violates RFC 9728: path-appended discovery PRM should match full target URL
			const invalidMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read']
			};

			// First attempt (path-appended) gets the wrong resource value
			// It will fail validation and continue to second URL (root)
			// Second attempt (root) will succeed because root expects root resource
			fetchStub.resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata)
			});

			// This should actually succeed on the second (root) attempt
			const result = await fetchResourceMetadata(targetResource, undefined, { fetch: fetchStub });

			assert.deepStrictEqual(result.metadata, invalidMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
			// Verify both URLs were tried
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://example.com/.well-known/oauth-protected-resource/api/v1');
			assert.strictEqual(fetchStub.secondCall.args[0], 'https://example.com/.well-known/oauth-protected-resource');
		});

		test('should validate against targetResource when resourceMetadataUrl is explicitly provided', async () => {
			const targetResource = 'https://example.com/api/v1';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			// When explicit URL provided (e.g., from WWW-Authenticate), must match targetResource
			const validMetadata = {
				resource: 'https://example.com/api/v1',
				scopes_supported: ['read']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => validMetadata,
				text: async () => JSON.stringify(validMetadata)
			});

			const result = await fetchResourceMetadata(
				targetResource,
				resourceMetadataUrl,
				{ fetch: fetchStub }
			);

			assert.deepStrictEqual(result.metadata, validMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			assert.strictEqual(fetchStub.firstCall.args[0], resourceMetadataUrl);
		});

		test('should fallback to root discovery when explicit resourceMetadataUrl validation fails', async () => {
			const targetResource = 'https://example.com/api/v1';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';
			const invalidMetadata = {
				resource: 'https://example.com/',
				scopes_supported: ['read']
			};

			// Stub all URLs to return root resource metadata
			// Explicit URL returns root (validation fails), path-appended fails, root succeeds
			fetchStub.resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata)
			});

			// Should succeed on root discovery fallback
			const result = await fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub });
			assert.deepStrictEqual(result.metadata, invalidMetadata);
			// Should have tried explicit URL, path-appended, then succeeded on root
			assert.ok(fetchStub.callCount >= 2);
		});

		test('should handle fetchImpl throwing error with explicit resourceMetadataUrl', async () => {
			const targetResource = 'https://example.com/api';
			const resourceMetadataUrl = 'https://example.com/.well-known/oauth-protected-resource';

			// Stub all possible URLs to throw network error for robust fallback testing
			fetchStub.rejects(new Error('DNS resolution failed'));

			await assert.rejects(
				async () => fetchResourceMetadata(targetResource, resourceMetadataUrl, { fetch: fetchStub }),
				(error: any) => {
					// Should be AggregateError since all URLs fail
					assert.ok(error instanceof AggregateError || /DNS resolution failed/.test(error.message));
					return true;
				}
			);

			// Should have tried explicit URL and well-known discovery
			assert.ok(fetchStub.callCount >= 2);
		});
	});

	suite('fetchAuthorizationServerMetadata', () => {
		let sandbox: sinon.SinonSandbox;
		let fetchStub: sinon.SinonStub;

		setup(() => {
			sandbox = sinon.createSandbox();
			fetchStub = sandbox.stub();
		});

		teardown(() => {
			sandbox.restore();
		});

		test('should successfully fetch metadata from OAuth discovery endpoint with path insertion', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant',
				authorization_endpoint: 'https://auth.example.com/tenant/authorize',
				token_endpoint: 'https://auth.example.com/tenant/token',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			// Should try OAuth discovery with path insertion: https://auth.example.com/.well-known/oauth-authorization-server/tenant
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://auth.example.com/.well-known/oauth-authorization-server/tenant');
			assert.strictEqual(fetchStub.firstCall.args[1].method, 'GET');
		});

		test('should fallback to OpenID Connect discovery with path insertion', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant',
				authorization_endpoint: 'https://auth.example.com/tenant/authorize',
				token_endpoint: 'https://auth.example.com/tenant/token',
				response_types_supported: ['code']
			};

			// First call fails, second succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
			// First attempt: OAuth discovery
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://auth.example.com/.well-known/oauth-authorization-server/tenant');
			// Second attempt: OpenID Connect discovery with path insertion
			assert.strictEqual(fetchStub.secondCall.args[0], 'https://auth.example.com/.well-known/openid-configuration/tenant');
		});

		test('should fallback to OpenID Connect discovery with path addition', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant',
				authorization_endpoint: 'https://auth.example.com/tenant/authorize',
				token_endpoint: 'https://auth.example.com/tenant/token',
				response_types_supported: ['code']
			};

			// First two calls fail, third succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			fetchStub.onSecondCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			fetchStub.onThirdCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 3);
			// First attempt: OAuth discovery
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://auth.example.com/.well-known/oauth-authorization-server/tenant');
			// Second attempt: OpenID Connect discovery with path insertion
			assert.strictEqual(fetchStub.secondCall.args[0], 'https://auth.example.com/.well-known/openid-configuration/tenant');
			// Third attempt: OpenID Connect discovery with path addition
			assert.strictEqual(fetchStub.thirdCall.args[0], 'https://auth.example.com/tenant/.well-known/openid-configuration');
		});

		test('should handle authorization server at root without extra path', async () => {
			const authorizationServer = 'https://auth.example.com';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				authorization_endpoint: 'https://auth.example.com/authorize',
				token_endpoint: 'https://auth.example.com/token',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			// For root URLs, no extra path is added
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://auth.example.com/.well-known/oauth-authorization-server');
		});

		test('should handle authorization server with trailing slash', async () => {
			const authorizationServer = 'https://auth.example.com/tenant/';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant/',
				authorization_endpoint: 'https://auth.example.com/tenant/authorize',
				token_endpoint: 'https://auth.example.com/tenant/token',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
		});

		test('should include additional headers in all requests', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';
			const additionalHeaders = {
				'X-Custom-Header': 'custom-value',
				'Authorization': 'Bearer token123'
			};
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub, additionalHeaders });

			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['X-Custom-Header'], 'custom-value');
			assert.strictEqual(headers['Authorization'], 'Bearer token123');
			assert.strictEqual(headers['Accept'], 'application/json');
		});
		test('should throw AggregateError when all discovery endpoints fail', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';

			fetchStub.resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 3, 'Should contain 3 errors (one for each URL)');
					assert.strictEqual(error.message, 'Failed to fetch authorization server metadata from all attempted URLs');
					// Verify each error includes the URL it attempted
					assert.ok(/oauth-authorization-server.*404/.test(error.errors[0].message), 'First error should mention OAuth discovery and 404');
					assert.ok(/openid-configuration.*404/.test(error.errors[1].message), 'Second error should mention OpenID path insertion and 404');
					assert.ok(/openid-configuration.*404/.test(error.errors[2].message), 'Third error should mention OpenID path addition and 404');
					return true;
				}
			);

			// Should have tried all three endpoints
			assert.strictEqual(fetchStub.callCount, 3);
		});

		test('should throw single error (not AggregateError) when only one URL is tried and fails', async () => {
			const authorizationServer = 'https://auth.example.com';

			// First attempt succeeds on second try, so only one error is collected for first URL
			fetchStub.onFirstCall().resolves({
				status: 500,
				text: async () => 'Internal Server Error',
				statusText: 'Internal Server Error',
				json: async () => { throw new Error('Not JSON'); }
			});

			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				response_types_supported: ['code']
			};

			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			// Should succeed on second attempt
			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });
			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should throw AggregateError when multiple URLs fail with mixed error types', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';

			// First call: network error
			fetchStub.onFirstCall().rejects(new Error('Connection timeout'));

			// Second call: 404
			fetchStub.onSecondCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			// Third call: 500
			fetchStub.onThirdCall().resolves({
				status: 500,
				text: async () => 'Internal Server Error',
				statusText: 'Internal Server Error',
				json: async () => { throw new Error('Not JSON'); }
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 3, 'Should contain 3 errors');
					// First error is network error
					assert.ok(/Connection timeout/.test(error.errors[0].message), 'First error should be network error');
					// Second error is 404
					assert.ok(/404.*Not Found/.test(error.errors[1].message), 'Second error should be 404');
					// Third error is 500
					assert.ok(/500.*Internal Server Error/.test(error.errors[2].message), 'Third error should be 500');
					return true;
				}
			);

			assert.strictEqual(fetchStub.callCount, 3);
		});

		test('should handle invalid JSON response', async () => {
			const authorizationServer = 'https://auth.example.com';

			fetchStub.resolves({
				status: 200,
				json: async () => { throw new Error('Invalid JSON'); },
				text: async () => 'Invalid JSON',
				statusText: 'OK'
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				/Failed to fetch authorization server metadata/
			);
		});

		test('should handle valid JSON but invalid metadata structure', async () => {
			const authorizationServer = 'https://auth.example.com';
			const invalidMetadata = {
				// Missing required 'issuer' field
				authorization_endpoint: 'https://auth.example.com/authorize'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => invalidMetadata,
				text: async () => JSON.stringify(invalidMetadata),
				statusText: 'OK'
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				/Failed to fetch authorization server metadata/
			);
		});

		test('should use global fetch when custom fetch is not provided', async () => {
			const authorizationServer = 'https://auth.example.com';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				response_types_supported: ['code']
			};

			// eslint-disable-next-line local/code-no-any-casts
			const globalFetchStub = sandbox.stub(globalThis, 'fetch').resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			} as any);

			const result = await fetchAuthorizationServerMetadata(authorizationServer);

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(globalFetchStub.callCount, 1);
		});

		test('should handle network fetch failure and continue to next endpoint', async () => {
			const authorizationServer = 'https://auth.example.com';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				response_types_supported: ['code']
			};

			// First call throws network error, second succeeds
			fetchStub.onFirstCall().rejects(new Error('Network error'));
			fetchStub.onSecondCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			// Should have tried two endpoints
			assert.strictEqual(fetchStub.callCount, 2);
		});

		test('should throw error when network fails on all endpoints', async () => {
			const authorizationServer = 'https://auth.example.com';

			fetchStub.rejects(new Error('Network error'));

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 3, 'Should contain 3 errors');
					assert.strictEqual(error.message, 'Failed to fetch authorization server metadata from all attempted URLs');
					// All errors should be network errors
					assert.ok(/Network error/.test(error.errors[0].message), 'First error should be network error');
					assert.ok(/Network error/.test(error.errors[1].message), 'Second error should be network error');
					assert.ok(/Network error/.test(error.errors[2].message), 'Third error should be network error');
					return true;
				}
			);

			// Should have tried all three endpoints
			assert.strictEqual(fetchStub.callCount, 3);
		});

		test('should handle mix of network error and non-200 response', async () => {
			const authorizationServer = 'https://auth.example.com/tenant';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant',
				response_types_supported: ['code']
			};

			// First call throws network error
			fetchStub.onFirstCall().rejects(new Error('Connection timeout'));

			// Second call returns 404
			fetchStub.onSecondCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			// Third call succeeds
			fetchStub.onThirdCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			// Should have tried all three endpoints
			assert.strictEqual(fetchStub.callCount, 3);
		});

		test('should handle response.text() failure in error case', async () => {
			const authorizationServer = 'https://auth.example.com';

			fetchStub.resolves({
				status: 500,
				text: async () => { throw new Error('Cannot read text'); },
				statusText: 'Internal Server Error',
				json: async () => { throw new Error('Cannot read json'); }
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 3, 'Should contain 3 errors');
					// All errors should include status code and statusText (fallback when text() fails)
					for (const err of error.errors) {
						assert.ok(/500 Internal Server Error/.test(err.message), `Error should mention 500 and statusText: ${err.message}`);
					}
					return true;
				}
			);
		});

		test('should correctly handle path addition with trailing slash', async () => {
			const authorizationServer = 'https://auth.example.com/tenant/';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant/',
				response_types_supported: ['code']
			};

			// First two calls fail, third succeeds
			fetchStub.onFirstCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			fetchStub.onSecondCall().resolves({
				status: 404,
				text: async () => 'Not Found',
				statusText: 'Not Found',
				json: async () => { throw new Error('Not JSON'); }
			});

			fetchStub.onThirdCall().resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 3);
			// Third attempt should correctly handle trailing slash (not double-slash)
			assert.strictEqual(fetchStub.thirdCall.args[0], 'https://auth.example.com/tenant/.well-known/openid-configuration');
		});

		test('should handle deeply nested paths', async () => {
			const authorizationServer = 'https://auth.example.com/tenant/org/sub';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant/org/sub',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
			// Should correctly insert well-known path with nested paths
			assert.strictEqual(fetchStub.firstCall.args[0], 'https://auth.example.com/.well-known/oauth-authorization-server/tenant/org/sub');
		});

		test('should handle 200 response with non-metadata JSON', async () => {
			const authorizationServer = 'https://auth.example.com';
			const invalidResponse = {
				error: 'not_supported',
				message: 'Metadata not available'
			};

			fetchStub.resolves({
				status: 200,
				json: async () => invalidResponse,
				text: async () => JSON.stringify(invalidResponse),
				statusText: 'OK'
			});

			await assert.rejects(
				async () => fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub }),
				(error: any) => {
					assert.ok(error instanceof AggregateError, 'Should be an AggregateError');
					assert.strictEqual(error.errors.length, 3, 'Should contain 3 errors');
					// All errors should indicate failed to fetch with status code
					for (const err of error.errors) {
						assert.ok(/Failed to fetch authorization server metadata from/.test(err.message), `Error should mention failed fetch: ${err.message}`);
					}
					return true;
				}
			);

			// Should try all three endpoints
			assert.strictEqual(fetchStub.callCount, 3);
		});

		test('should validate metadata according to isAuthorizationServerMetadata', async () => {
			const authorizationServer = 'https://auth.example.com';
			// Valid metadata with all required fields
			const validMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				authorization_endpoint: 'https://auth.example.com/authorize',
				token_endpoint: 'https://auth.example.com/token',
				jwks_uri: 'https://auth.example.com/jwks',
				registration_endpoint: 'https://auth.example.com/register',
				response_types_supported: ['code', 'token']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => validMetadata,
				text: async () => JSON.stringify(validMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, validMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
		});

		test('should handle URLs with query parameters', async () => {
			const authorizationServer = 'https://auth.example.com/tenant?version=v2';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/tenant?version=v2',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			const result = await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub });

			assert.deepStrictEqual(result, expectedMetadata);
			assert.strictEqual(fetchStub.callCount, 1);
		});

		test('should handle empty additionalHeaders', async () => {
			const authorizationServer = 'https://auth.example.com';
			const expectedMetadata: IAuthorizationServerMetadata = {
				issuer: 'https://auth.example.com/',
				response_types_supported: ['code']
			};

			fetchStub.resolves({
				status: 200,
				json: async () => expectedMetadata,
				text: async () => JSON.stringify(expectedMetadata),
				statusText: 'OK'
			});

			await fetchAuthorizationServerMetadata(authorizationServer, { fetch: fetchStub, additionalHeaders: {} });

			const headers = fetchStub.firstCall.args[1].headers;
			assert.strictEqual(headers['Accept'], 'application/json');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/objects.test.ts]---
Location: vscode-main/src/vs/base/test/common/objects.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as objects from '../../common/objects.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

const check = (one: any, other: any, msg: string) => {
	assert(objects.equals(one, other), msg);
	assert(objects.equals(other, one), '[reverse] ' + msg);
};

const checkNot = (one: any, other: any, msg: string) => {
	assert(!objects.equals(one, other), msg);
	assert(!objects.equals(other, one), '[reverse] ' + msg);
};

suite('Objects', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('equals', () => {
		check(null, null, 'null');
		check(undefined, undefined, 'undefined');
		check(1234, 1234, 'numbers');
		check('', '', 'empty strings');
		check('1234', '1234', 'strings');
		check([], [], 'empty arrays');
		// check(['', 123], ['', 123], 'arrays');
		check([[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6]], 'nested arrays');
		check({}, {}, 'empty objects');
		check({ a: 1, b: '123' }, { a: 1, b: '123' }, 'objects');
		check({ a: 1, b: '123' }, { b: '123', a: 1 }, 'objects (key order)');
		check({ a: { b: 1, c: 2 }, b: 3 }, { a: { b: 1, c: 2 }, b: 3 }, 'nested objects');

		checkNot(null, undefined, 'null != undefined');
		checkNot(null, '', 'null != empty string');
		checkNot(null, [], 'null != empty array');
		checkNot(null, {}, 'null != empty object');
		checkNot(null, 0, 'null != zero');
		checkNot(undefined, '', 'undefined != empty string');
		checkNot(undefined, [], 'undefined != empty array');
		checkNot(undefined, {}, 'undefined != empty object');
		checkNot(undefined, 0, 'undefined != zero');
		checkNot('', [], 'empty string != empty array');
		checkNot('', {}, 'empty string != empty object');
		checkNot('', 0, 'empty string != zero');
		checkNot([], {}, 'empty array != empty object');
		checkNot([], 0, 'empty array != zero');
		checkNot(0, [], 'zero != empty array');

		checkNot('1234', 1234, 'string !== number');

		checkNot([[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6000]], 'arrays');
		checkNot({ a: { b: 1, c: 2 }, b: 3 }, { b: 3, a: { b: 9, c: 2 } }, 'objects');
	});

	test('mixin - array', function () {

		const foo: any = {};
		objects.mixin(foo, { bar: [1, 2, 3] });

		assert(foo.bar);
		assert(Array.isArray(foo.bar));
		assert.strictEqual(foo.bar.length, 3);
		assert.strictEqual(foo.bar[0], 1);
		assert.strictEqual(foo.bar[1], 2);
		assert.strictEqual(foo.bar[2], 3);
	});

	test('mixin - no overwrite', function () {
		const foo: any = {
			bar: '123'
		};

		const bar: any = {
			bar: '456'
		};

		objects.mixin(foo, bar, false);

		assert.strictEqual(foo.bar, '123');
	});

	test('cloneAndChange', () => {
		const o1 = { something: 'hello' };
		const o = {
			o1: o1,
			o2: o1
		};
		assert.deepStrictEqual(objects.cloneAndChange(o, () => { }), o);
	});

	test('safeStringify', () => {
		const obj1: any = {
			friend: null
		};

		const obj2: any = {
			friend: null
		};

		obj1.friend = obj2;
		obj2.friend = obj1;

		const arr: any = [1];
		arr.push(arr);

		const circular: any = {
			a: 42,
			b: null,
			c: [
				obj1, obj2
			],
			d: null,
			e: BigInt(42)
		};

		arr.push(circular);


		circular.b = circular;
		circular.d = arr;

		const result = objects.safeStringify(circular);

		assert.deepStrictEqual(JSON.parse(result), {
			a: 42,
			b: '[Circular]',
			c: [
				{
					friend: {
						friend: '[Circular]'
					}
				},
				'[Circular]'
			],
			d: [1, '[Circular]', '[Circular]'],
			e: '[BigInt 42]'
		});
	});

	test('distinct', () => {
		const base = {
			one: 'one',
			two: 2,
			three: {
				3: true
			},
			four: false
		};

		let diff = objects.distinct(base, base);
		assert.strictEqual(Object.keys(diff).length, 0);

		let obj = {};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 0);

		obj = {
			one: 'one',
			two: 2
		};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 0);

		obj = {
			three: {
				3: true
			},
			four: false
		};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 0);

		obj = {
			one: 'two',
			two: 2,
			three: {
				3: true
			},
			four: true
		};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 2);
		assert.strictEqual(diff.one, 'two');
		assert.strictEqual(diff.four, true);

		obj = {
			one: null,
			two: 2,
			three: {
				3: true
			},
			four: undefined
		};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 2);
		assert.strictEqual(diff.one, null);
		assert.strictEqual(diff.four, undefined);

		obj = {
			one: 'two',
			two: 3,
			three: { 3: false },
			four: true
		};

		diff = objects.distinct(base, obj);
		assert.strictEqual(Object.keys(diff).length, 4);
		assert.strictEqual(diff.one, 'two');
		assert.strictEqual(diff.two, 3);
		assert.strictEqual(diff.three?.['3'], false);
		assert.strictEqual(diff.four, true);
	});

	test('getCaseInsensitive', () => {
		const obj1 = {
			lowercase: 123,
			mIxEdCaSe: 456
		};

		assert.strictEqual(obj1.lowercase, objects.getCaseInsensitive(obj1, 'lowercase'));
		assert.strictEqual(obj1.lowercase, objects.getCaseInsensitive(obj1, 'lOwErCaSe'));

		assert.strictEqual(obj1.mIxEdCaSe, objects.getCaseInsensitive(obj1, 'MIXEDCASE'));
		assert.strictEqual(obj1.mIxEdCaSe, objects.getCaseInsensitive(obj1, 'mixedcase'));
	});
});

test('mapValues', () => {
	const obj = {
		a: 1,
		b: 2,
		c: 3
	};

	const result = objects.mapValues(obj, (value, key) => `${key}: ${value * 2}`);

	assert.deepStrictEqual(result, {
		a: 'a: 2',
		b: 'b: 4',
		c: 'c: 6',
	});
});
```

--------------------------------------------------------------------------------

````

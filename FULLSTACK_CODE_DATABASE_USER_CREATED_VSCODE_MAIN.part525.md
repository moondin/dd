---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 525
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 525 of 552)

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

---[FILE: src/vs/workbench/services/preferences/common/preferencesValidation.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/common/preferencesValidation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { JSONSchemaType } from '../../../../base/common/jsonSchema.js';
import { Color } from '../../../../base/common/color.js';
import { isObject, isUndefinedOrNull, isString, isStringArray } from '../../../../base/common/types.js';
import { IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';

type Validator<T> = { enabled: boolean; isValid: (value: T) => boolean; message: string };

function canBeType(propTypes: (string | undefined)[], ...types: JSONSchemaType[]): boolean {
	return types.some(t => propTypes.includes(t));
}

function isNullOrEmpty(value: unknown): boolean {
	return value === '' || isUndefinedOrNull(value);
}

export function createValidator(prop: IConfigurationPropertySchema): (value: any) => (string | null) {
	const type: (string | undefined)[] = Array.isArray(prop.type) ? prop.type : [prop.type];
	const isNullable = canBeType(type, 'null');
	const isNumeric = (canBeType(type, 'number') || canBeType(type, 'integer')) && (type.length === 1 || type.length === 2 && isNullable);

	const numericValidations = getNumericValidators(prop);
	const stringValidations = getStringValidators(prop);
	const arrayValidator = getArrayValidator(prop);
	const objectValidator = getObjectValidator(prop);

	return value => {
		if (isNullable && isNullOrEmpty(value)) { return ''; }

		const errors: string[] = [];
		if (arrayValidator) {
			const err = arrayValidator(value);
			if (err) {
				errors.push(err);
			}
		}

		if (objectValidator) {
			const err = objectValidator(value);
			if (err) {
				errors.push(err);
			}
		}

		if (prop.type === 'boolean' && value !== true && value !== false) {
			errors.push(nls.localize('validations.booleanIncorrectType', 'Incorrect type. Expected "boolean".'));
		}

		if (isNumeric) {
			if (isNullOrEmpty(value) || typeof value === 'boolean' || Array.isArray(value) || isNaN(+value)) {
				errors.push(nls.localize('validations.expectedNumeric', "Value must be a number."));
			} else {
				errors.push(...numericValidations.filter(validator => !validator.isValid(+value)).map(validator => validator.message));
			}
		}

		if (prop.type === 'string') {
			if (prop.enum && !isStringArray(prop.enum)) {
				errors.push(nls.localize('validations.stringIncorrectEnumOptions', 'The enum options should be strings, but there is a non-string option. Please file an issue with the extension author.'));
			} else if (!isString(value)) {
				errors.push(nls.localize('validations.stringIncorrectType', 'Incorrect type. Expected "string".'));
			} else {
				errors.push(...stringValidations.filter(validator => !validator.isValid(value)).map(validator => validator.message));
			}
		}

		if (errors.length) {
			return prop.errorMessage ? [prop.errorMessage, ...errors].join(' ') : errors.join(' ');
		}

		return '';
	};
}

/**
 * Returns an error string if the value is invalid and can't be displayed in the settings UI for the given type.
 */
export function getInvalidTypeError(value: any, type: undefined | string | string[]): string | undefined {
	if (typeof type === 'undefined') {
		return;
	}

	const typeArr = Array.isArray(type) ? type : [type];
	if (!typeArr.some(_type => valueValidatesAsType(value, _type))) {
		return nls.localize('invalidTypeError', "Setting has an invalid type, expected {0}. Fix in JSON.", JSON.stringify(type));
	}

	return;
}

function valueValidatesAsType(value: any, type: string): boolean {
	const valueType = typeof value;
	if (type === 'boolean') {
		return valueType === 'boolean';
	} else if (type === 'object') {
		return value && !Array.isArray(value) && valueType === 'object';
	} else if (type === 'null') {
		return value === null;
	} else if (type === 'array') {
		return Array.isArray(value);
	} else if (type === 'string') {
		return valueType === 'string';
	} else if (type === 'number' || type === 'integer') {
		return valueType === 'number';
	}

	return true;
}

function toRegExp(pattern: string): RegExp {
	try {
		// The u flag allows support for better Unicode matching,
		// but deprecates some patterns such as [\s-9]
		// Ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_class#description
		return new RegExp(pattern, 'u');
	} catch (e) {
		try {
			return new RegExp(pattern);
		} catch (e) {
			// If the pattern can't be parsed even without the 'u' flag,
			// just log the error to avoid rendering the entire Settings editor blank.
			// Ref https://github.com/microsoft/vscode/issues/195054
			console.error(nls.localize('regexParsingError', "Error parsing the following regex both with and without the u flag:"), pattern);
			return /.*/;
		}
	}
}

function getStringValidators(prop: IConfigurationPropertySchema) {
	const uriRegex = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
	let patternRegex: RegExp | undefined;
	if (typeof prop.pattern === 'string') {
		patternRegex = toRegExp(prop.pattern);
	}

	return [
		{
			enabled: prop.maxLength !== undefined,
			isValid: ((value: { length: number }) => value.length <= prop.maxLength!),
			message: nls.localize('validations.maxLength', "Value must be {0} or fewer characters long.", prop.maxLength)
		},
		{
			enabled: prop.minLength !== undefined,
			isValid: ((value: { length: number }) => value.length >= prop.minLength!),
			message: nls.localize('validations.minLength', "Value must be {0} or more characters long.", prop.minLength)
		},
		{
			enabled: patternRegex !== undefined,
			isValid: ((value: string) => patternRegex!.test(value)),
			message: prop.patternErrorMessage || nls.localize('validations.regex', "Value must match regex `{0}`.", prop.pattern)
		},
		{
			enabled: prop.format === 'color-hex',
			isValid: ((value: string) => Color.Format.CSS.parseHex(value)),
			message: nls.localize('validations.colorFormat', "Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA.")
		},
		{
			enabled: prop.format === 'uri' || prop.format === 'uri-reference',
			isValid: ((value: string) => !!value.length),
			message: nls.localize('validations.uriEmpty', "URI expected.")
		},
		{
			enabled: prop.format === 'uri' || prop.format === 'uri-reference',
			isValid: ((value: string) => uriRegex.test(value)),
			message: nls.localize('validations.uriMissing', "URI is expected.")
		},
		{
			enabled: prop.format === 'uri',
			isValid: ((value: string) => {
				const matches = value.match(uriRegex);
				return !!(matches && matches[2]);
			}),
			message: nls.localize('validations.uriSchemeMissing', "URI with a scheme is expected.")
		},
		{
			enabled: prop.enum !== undefined,
			isValid: ((value: string) => {
				return prop.enum!.includes(value);
			}),
			message: nls.localize('validations.invalidStringEnumValue', "Value is not accepted. Valid values: {0}.",
				prop.enum ? prop.enum.map(key => `"${key}"`).join(', ') : '[]')
		}
	].filter(validation => validation.enabled);
}

function getNumericValidators(prop: IConfigurationPropertySchema): Validator<number>[] {
	const type: (string | undefined)[] = Array.isArray(prop.type) ? prop.type : [prop.type];

	const isNullable = canBeType(type, 'null');
	const isIntegral = (canBeType(type, 'integer')) && (type.length === 1 || type.length === 2 && isNullable);
	const isNumeric = canBeType(type, 'number', 'integer') && (type.length === 1 || type.length === 2 && isNullable);
	if (!isNumeric) {
		return [];
	}

	let exclusiveMax: number | undefined;
	let exclusiveMin: number | undefined;

	if (typeof prop.exclusiveMaximum === 'boolean') {
		exclusiveMax = prop.exclusiveMaximum ? prop.maximum : undefined;
	} else {
		exclusiveMax = prop.exclusiveMaximum;
	}

	if (typeof prop.exclusiveMinimum === 'boolean') {
		exclusiveMin = prop.exclusiveMinimum ? prop.minimum : undefined;
	} else {
		exclusiveMin = prop.exclusiveMinimum;
	}

	return [
		{
			enabled: exclusiveMax !== undefined && (prop.maximum === undefined || exclusiveMax <= prop.maximum),
			isValid: ((value: number) => value < exclusiveMax!),
			message: nls.localize('validations.exclusiveMax', "Value must be strictly less than {0}.", exclusiveMax)
		},
		{
			enabled: exclusiveMin !== undefined && (prop.minimum === undefined || exclusiveMin >= prop.minimum),
			isValid: ((value: number) => value > exclusiveMin!),
			message: nls.localize('validations.exclusiveMin', "Value must be strictly greater than {0}.", exclusiveMin)
		},
		{
			enabled: prop.maximum !== undefined && (exclusiveMax === undefined || exclusiveMax > prop.maximum),
			isValid: ((value: number) => value <= prop.maximum!),
			message: nls.localize('validations.max', "Value must be less than or equal to {0}.", prop.maximum)
		},
		{
			enabled: prop.minimum !== undefined && (exclusiveMin === undefined || exclusiveMin < prop.minimum),
			isValid: ((value: number) => value >= prop.minimum!),
			message: nls.localize('validations.min', "Value must be greater than or equal to {0}.", prop.minimum)
		},
		{
			enabled: prop.multipleOf !== undefined,
			isValid: ((value: number) => value % prop.multipleOf! === 0),
			message: nls.localize('validations.multipleOf', "Value must be a multiple of {0}.", prop.multipleOf)
		},
		{
			enabled: isIntegral,
			isValid: ((value: number) => value % 1 === 0),
			message: nls.localize('validations.expectedInteger', "Value must be an integer.")
		},
	].filter(validation => validation.enabled);
}

function getArrayValidator(prop: IConfigurationPropertySchema): ((value: any) => (string | null)) | null {
	if (prop.type === 'array' && prop.items && !Array.isArray(prop.items)) {
		const propItems = prop.items;
		if (propItems && !Array.isArray(propItems.type)) {
			const withQuotes = (s: string) => `'` + s + `'`;
			return value => {
				if (!value) {
					return null;
				}

				let message = '';

				if (!Array.isArray(value)) {
					message += nls.localize('validations.arrayIncorrectType', 'Incorrect type. Expected an array.');
					message += '\n';
					return message;
				}

				const arrayValue = value as unknown[];
				if (prop.uniqueItems) {
					if (new Set(arrayValue).size < arrayValue.length) {
						message += nls.localize('validations.stringArrayUniqueItems', 'Array has duplicate items');
						message += '\n';
					}
				}

				if (prop.minItems && arrayValue.length < prop.minItems) {
					message += nls.localize('validations.stringArrayMinItem', 'Array must have at least {0} items', prop.minItems);
					message += '\n';
				}

				if (prop.maxItems && arrayValue.length > prop.maxItems) {
					message += nls.localize('validations.stringArrayMaxItem', 'Array must have at most {0} items', prop.maxItems);
					message += '\n';
				}

				if (propItems.type === 'string') {
					if (!isStringArray(arrayValue)) {
						message += nls.localize('validations.stringArrayIncorrectType', 'Incorrect type. Expected a string array.');
						message += '\n';
						return message;
					}

					if (typeof propItems.pattern === 'string') {
						const patternRegex = toRegExp(propItems.pattern);
						arrayValue.forEach(v => {
							if (!patternRegex.test(v)) {
								message +=
									propItems.patternErrorMessage ||
									nls.localize(
										'validations.stringArrayItemPattern',
										'Value {0} must match regex {1}.',
										withQuotes(v),
										withQuotes(propItems.pattern!)
									);
							}
						});
					}

					const propItemsEnum = propItems.enum;
					if (propItemsEnum) {
						arrayValue.forEach(v => {
							if (propItemsEnum.indexOf(v) === -1) {
								message += nls.localize(
									'validations.stringArrayItemEnum',
									'Value {0} is not one of {1}',
									withQuotes(v),
									'[' + propItemsEnum.map(withQuotes).join(', ') + ']'
								);
								message += '\n';
							}
						});
					}
				} else if (propItems.type === 'integer' || propItems.type === 'number') {
					arrayValue.forEach(v => {
						const errorMessage = getErrorsForSchema(propItems, v);
						if (errorMessage) {
							message += `${v}: ${errorMessage}\n`;
						}
					});
				}

				return message;
			};
		}
	}

	return null;
}

function getObjectValidator(prop: IConfigurationPropertySchema): ((value: any) => (string | null)) | null {
	if (prop.type === 'object') {
		const { properties, patternProperties, additionalProperties } = prop;
		return value => {
			if (!value) {
				return null;
			}

			const errors: string[] = [];

			if (!isObject(value)) {
				errors.push(nls.localize('validations.objectIncorrectType', 'Incorrect type. Expected an object.'));
			} else {
				Object.keys(value).forEach((key: string) => {
					const data = value[key];
					if (properties && key in properties) {
						const errorMessage = getErrorsForSchema(properties[key], data);
						if (errorMessage) {
							errors.push(`${key}: ${errorMessage}\n`);
						}
						return;
					}

					if (patternProperties) {
						for (const pattern in patternProperties) {
							if (RegExp(pattern).test(key)) {
								const errorMessage = getErrorsForSchema(patternProperties[pattern], data);
								if (errorMessage) {
									errors.push(`${key}: ${errorMessage}\n`);
								}
								return;
							}
						}
					}

					if (additionalProperties === false) {
						errors.push(nls.localize('validations.objectPattern', 'Property {0} is not allowed.\n', key));
					} else if (typeof additionalProperties === 'object') {
						const errorMessage = getErrorsForSchema(additionalProperties, data);
						if (errorMessage) {
							errors.push(`${key}: ${errorMessage}\n`);
						}
					}
				});
			}

			if (errors.length) {
				return prop.errorMessage ? [prop.errorMessage, ...errors].join(' ') : errors.join(' ');
			}

			return '';
		};
	}

	return null;
}

function getErrorsForSchema(propertySchema: IConfigurationPropertySchema, data: any): string | null {
	const validator = createValidator(propertySchema);
	const errorMessage = validator(data);
	return errorMessage;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/test/browser/keybindingsEditorModel.test.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/test/browser/keybindingsEditorModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as uuid from '../../../../../base/common/uuid.js';
import { OS, OperatingSystem } from '../../../../../base/common/platform.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { KeyCodeChord } from '../../../../../base/common/keybindings.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IExtensionService } from '../../../extensions/common/extensions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsEditorModel } from '../../browser/keybindingsEditorModel.js';
import { ResolvedKeybindingItem } from '../../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';

import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingItemEntry } from '../../common/preferences.js';
import { Action2, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../../platform/extensions/common/extensions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

interface Modifiers {
	metaKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
}

suite('KeybindingsEditorModel', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let testObject: KeybindingsEditorModel;
	let extensions: Partial<IExtensionDescription>[] = [];

	setup(() => {
		extensions = [];
		instantiationService = disposables.add(new TestInstantiationService());

		instantiationService.stub(IKeybindingService, {});
		instantiationService.stub(IExtensionService, {
			whenInstalledExtensionsRegistered: () => Promise.resolve(true),
			get extensions() { return extensions as IExtensionDescription[]; }
		});
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OS));

		disposables.add(CommandsRegistry.registerCommand('command_without_keybinding', () => { }));
	});

	test('fetch returns default keybindings', async () => {
		const expected = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'b' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } })
		);

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns distinct keybindings', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = prepareKeybindingService(
			aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape } }),
		);

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, [expected[0]]);
	});

	test('fetch returns default keybindings at the top', async () => {
		const expected = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'b' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } })
		);

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch('').slice(0, 2), true);
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns default keybindings sorted by command id', async () => {
		const keybindings = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'b' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'c' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Backspace } })
		);
		const expected = [keybindings[2], keybindings[0], keybindings[1]];

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns user keybinding first if default and user has same id', async () => {
		const sameId = 'b' + uuid.generateUuid();
		const keybindings = prepareKeybindingService(
			aResolvedKeybindingItem({ command: sameId, firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: sameId, firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape }, isDefault: false })
		);
		const expected = [keybindings[1], keybindings[0]];

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns keybinding with titles first', async () => {
		const keybindings = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'b' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'c' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'd' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } })
		);

		registerCommandWithTitle(keybindings[1].command!, 'B Title');
		registerCommandWithTitle(keybindings[3].command!, 'A Title');

		const expected = [keybindings[3], keybindings[1], keybindings[0], keybindings[2]];
		instantiationService.stub(IKeybindingService, 'getKeybindings', () => keybindings);
		instantiationService.stub(IKeybindingService, 'getDefaultKeybindings', () => keybindings);

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns keybinding with user first if title and id matches', async () => {
		const sameId = 'b' + uuid.generateUuid();
		const keybindings = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: sameId, firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'c' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: sameId, firstChord: { keyCode: KeyCode.Escape }, isDefault: false })
		);

		registerCommandWithTitle(keybindings[1].command!, 'Same Title');
		const expected = [keybindings[3], keybindings[1], keybindings[0], keybindings[2]];

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch(''));
		assertKeybindingItems(actuals, expected);
	});

	test('fetch returns default keybindings sorted by precedence', async () => {
		const expected = prepareKeybindingService(
			aResolvedKeybindingItem({ command: 'b' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'c' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, secondChord: { keyCode: KeyCode.Escape } }),
			aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Backspace } })
		);

		await testObject.resolve(new Map<string, string>());
		const actuals = asResolvedKeybindingItems(testObject.fetch('', true));
		assertKeybindingItems(actuals, expected);
	});

	test('convert keybinding without title to entry', async () => {
		const expected = aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2' });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('')[0];
		assert.strictEqual(actual.keybindingItem.command, expected.command);
		assert.strictEqual(actual.keybindingItem.commandLabel, '');
		assert.strictEqual(actual.keybindingItem.commandDefaultLabel, null);
		assert.strictEqual(actual.keybindingItem.keybinding.getAriaLabel(), expected.resolvedKeybinding!.getAriaLabel());
		assert.strictEqual(actual.keybindingItem.when, expected.when!.serialize());
	});

	test('convert keybinding with title to entry', async () => {
		const expected = aResolvedKeybindingItem({ command: 'a' + uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2' });
		prepareKeybindingService(expected);
		registerCommandWithTitle(expected.command!, 'Some Title');

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('')[0];
		assert.strictEqual(actual.keybindingItem.command, expected.command);
		assert.strictEqual(actual.keybindingItem.commandLabel, 'Some Title');
		assert.strictEqual(actual.keybindingItem.commandDefaultLabel, null);
		assert.strictEqual(actual.keybindingItem.keybinding.getAriaLabel(), expected.resolvedKeybinding!.getAriaLabel());
		assert.strictEqual(actual.keybindingItem.when, expected.when!.serialize());
	});

	test('convert without title and binding to entry', async () => {
		disposables.add(CommandsRegistry.registerCommand('command_without_keybinding', () => { }));
		prepareKeybindingService();

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('').filter(element => element.keybindingItem.command === 'command_without_keybinding')[0];
		assert.strictEqual(actual.keybindingItem.command, 'command_without_keybinding');
		assert.strictEqual(actual.keybindingItem.commandLabel, '');
		assert.strictEqual(actual.keybindingItem.commandDefaultLabel, null);
		assert.strictEqual(actual.keybindingItem.keybinding, undefined);
		assert.strictEqual(actual.keybindingItem.when, '');
	});

	test('convert with title and without binding to entry', async () => {
		const id = 'a' + uuid.generateUuid();
		registerCommandWithTitle(id, 'some title');
		prepareKeybindingService();

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('').filter(element => element.keybindingItem.command === id)[0];
		assert.strictEqual(actual.keybindingItem.command, id);
		assert.strictEqual(actual.keybindingItem.commandLabel, 'some title');
		assert.strictEqual(actual.keybindingItem.commandDefaultLabel, null);
		assert.strictEqual(actual.keybindingItem.keybinding, undefined);
		assert.strictEqual(actual.keybindingItem.when, '');
	});

	test('filter by command id', async () => {
		const id = 'workbench.action.increaseViewSize';
		registerCommandWithTitle(id, 'some title');
		prepareKeybindingService();

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('workbench action view size').filter(element => element.keybindingItem.command === id)[0];
		assert.ok(actual);
	});

	test('filter by command title', async () => {
		const id = 'a' + uuid.generateUuid();
		registerCommandWithTitle(id, 'Increase view size');
		prepareKeybindingService();

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('increase size').filter(element => element.keybindingItem.command === id)[0];
		assert.ok(actual);
	});

	test('filter by system source', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2' });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('system').filter(element => element.keybindingItem.command === command)[0];
		assert.ok(actual);
	});

	test('filter by user source', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2', isDefault: false });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('user').filter(element => element.keybindingItem.command === command)[0];
		assert.ok(actual);
	});

	test('filter by default source with "@source: " prefix', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2', isDefault: true });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('@source: default').filter(element => element.keybindingItem.command === command)[0];
		assert.ok(actual);
	});

	test('filter by user source with "@source: " prefix', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2', isDefault: false });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('@source: user').filter(element => element.keybindingItem.command === command)[0];
		assert.ok(actual);
	});

	test('filter by command prefix with different commands', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2', isDefault: true });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: uuid.generateUuid(), firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: true }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch(`@command:${command}`);
		assert.strictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].keybindingItem.command, command);
	});

	test('filter by command prefix with same commands', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'context1 && context2', isDefault: true });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: true }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch(`@command:${command}`);
		assert.strictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].keybindingItem.command, command);
		assert.deepStrictEqual(actual[1].keybindingItem.command, command);
	});

	test('filter by when context', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('when context').filter(element => element.keybindingItem.command === command)[0];
		assert.ok(actual);
	});

	test('filter by cmd key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));

		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected);

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('cmd').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by meta key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));

		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('meta').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by command key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));

		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('command').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by windows key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Windows));

		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('windows').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by alt key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('alt').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { altKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by option key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('option').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { altKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by ctrl key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('ctrl').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by control key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('control').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by shift key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('shift').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { shiftKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by arrow', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.RightArrow, modifiers: { shiftKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('arrow').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by modifier and key', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.RightArrow, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.RightArrow, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('alt right').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { altKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by key and modifier', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.RightArrow, modifiers: { altKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.RightArrow, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('right alt').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(0, actual.length);
	});

	test('filter by modifiers and key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true, metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('alt cmd esc').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { altKey: true, metaKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by modifiers in random order and key', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('cmd shift esc').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true, shiftKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by first part', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.Delete }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('cmd shift esc').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true, shiftKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter matches in chord part', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.Delete }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('cmd del').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { metaKey: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, { keyCode: true });
	});

	test('filter matches first part and in chord part', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.Delete }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.UpArrow }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('cmd shift esc del').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { shiftKey: true, metaKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, { keyCode: true });
	});

	test('filter exact matches', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"ctrl c"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter exact matches with first and chord part', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"shift meta escape ctrl c"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { shiftKey: true, metaKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, { ctrlKey: true, keyCode: true });
	});

	test('filter exact matches with first and chord part no results', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.Delete, modifiers: { metaKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.UpArrow }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"cmd shift esc del"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(0, actual.length);
	});

	test('filter matches with + separator', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"control+c"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter by keybinding prefix', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('@keybinding:control+c').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter matches with + separator in first and chord parts', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"shift+meta+escape ctrl+c"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { shiftKey: true, metaKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, { keyCode: true, ctrlKey: true });
	});

	test('filter by keybinding prefix with chord', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('@keybinding:"shift+meta+escape ctrl+c"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { shiftKey: true, metaKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, { keyCode: true, ctrlKey: true });
	});

	test('filter exact matches with space #32993', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Space, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Backspace, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"ctrl+space"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
	});

	test('filter exact matches with user settings label', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.DownArrow } });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: 'down', firstChord: { keyCode: KeyCode.Escape } }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"down"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { keyCode: true });
	});

	test('filter exact matches also return chords', async () => {
		const command = 'a' + uuid.generateUuid();
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.KeyK, modifiers: { ctrlKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { shiftKey: true, metaKey: true } }, secondChord: { keyCode: KeyCode.KeyC, modifiers: { ctrlKey: true } }, when: 'whenContext1 && whenContext2', isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('"control+k"').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { ctrlKey: true, keyCode: true });
		assert.deepStrictEqual(actual[0].keybindingMatches!.chordPart, {});
	});

	test('filter modifiers are not matched when not completely matched (prefix)', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const term = `alt.${uuid.generateUuid()}`;
		const command = `command.${term}`;
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: 'some_command', firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch(term);
		assert.strictEqual(1, actual.length);
		assert.strictEqual(command, actual[0].keybindingItem.command);
		assert.strictEqual(1, actual[0].commandIdMatches?.length);
	});

	test('filter modifiers are not matched when not completely matched (includes)', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const term = `abcaltdef.${uuid.generateUuid()}`;
		const command = `command.${term}`;
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape }, isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: 'some_command', firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch(term);
		assert.strictEqual(1, actual.length);
		assert.strictEqual(command, actual[0].keybindingItem.command);
		assert.strictEqual(1, actual[0].commandIdMatches?.length);
	});

	test('filter modifiers are matched with complete term', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command = `command.${uuid.generateUuid()}`;
		const expected = aResolvedKeybindingItem({ command, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, isDefault: false });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: 'some_command', firstChord: { keyCode: KeyCode.Escape }, isDefault: false }));

		await testObject.resolve(new Map<string, string>());
		const actual = testObject.fetch('alt').filter(element => element.keybindingItem.command === command);
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingMatches!.firstPart, { altKey: true });
	});

	test('filter by extension', async () => {
		testObject = disposables.add(instantiationService.createInstance(KeybindingsEditorModel, OperatingSystem.Macintosh));
		const command1 = `command.${uuid.generateUuid()}`;
		const command2 = `command.${uuid.generateUuid()}`;
		extensions.push({ identifier: new ExtensionIdentifier('foo'), displayName: 'foo bar' }, { identifier: new ExtensionIdentifier('bar'), displayName: 'bar foo' });
		disposables.add(MenuRegistry.addCommand({ id: command2, title: 'title', category: 'category', source: { id: extensions[1].identifier!.value, title: extensions[1].displayName! } }));
		const expected = aResolvedKeybindingItem({ command: command1, firstChord: { keyCode: KeyCode.Escape, modifiers: { altKey: true } }, isDefault: true, extensionId: extensions[0].identifier!.value });
		prepareKeybindingService(expected, aResolvedKeybindingItem({ command: command2, isDefault: true }));

		await testObject.resolve(new Map<string, string>());
		let actual = testObject.fetch('@ext:foo');
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingItem.command, command1);

		actual = testObject.fetch('@ext:"bar foo"');
		assert.strictEqual(1, actual.length);
		assert.deepStrictEqual(actual[0].keybindingItem.command, command2);
	});

	function prepareKeybindingService(...keybindingItems: ResolvedKeybindingItem[]): ResolvedKeybindingItem[] {
		instantiationService.stub(IKeybindingService, 'getKeybindings', () => keybindingItems);
		instantiationService.stub(IKeybindingService, 'getDefaultKeybindings', () => keybindingItems);
		return keybindingItems;
	}

	function registerCommandWithTitle(command: string, title: string): void {
		disposables.add(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: command,
					title: { value: title, original: title },
					f1: true
				});
			}
			async run(): Promise<void> { }
		}));
	}

	function assertKeybindingItems(actual: ResolvedKeybindingItem[], expected: ResolvedKeybindingItem[]) {
		assert.strictEqual(actual.length, expected.length);
		for (let i = 0; i < actual.length; i++) {
			assertKeybindingItem(actual[i], expected[i]);
		}
	}

	function assertKeybindingItem(actual: ResolvedKeybindingItem, expected: ResolvedKeybindingItem): void {
		assert.strictEqual(actual.command, expected.command);
		if (actual.when) {
			assert.ok(!!expected.when);
			assert.strictEqual(actual.when.serialize(), expected.when.serialize());
		} else {
			assert.ok(!expected.when);
		}
		assert.strictEqual(actual.isDefault, expected.isDefault);

		if (actual.resolvedKeybinding) {
			assert.ok(!!expected.resolvedKeybinding);
			assert.strictEqual(actual.resolvedKeybinding.getLabel(), expected.resolvedKeybinding.getLabel());
		} else {
			assert.ok(!expected.resolvedKeybinding);
		}
	}

	function aResolvedKeybindingItem({ command, when, isDefault, firstChord, secondChord, extensionId }: { command?: string; when?: string; isDefault?: boolean; firstChord?: { keyCode: KeyCode; modifiers?: Modifiers }; secondChord?: { keyCode: KeyCode; modifiers?: Modifiers }; extensionId?: string }): ResolvedKeybindingItem {
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
		return new ResolvedKeybindingItem(keybinding, command || 'some command', null, when ? ContextKeyExpr.deserialize(when) : undefined, isDefault === undefined ? true : isDefault, extensionId ?? null, false);
	}

	function asResolvedKeybindingItems(keybindingEntries: IKeybindingItemEntry[], keepUnassigned: boolean = false): ResolvedKeybindingItem[] {
		if (!keepUnassigned) {
			keybindingEntries = keybindingEntries.filter(keybindingEntry => !!keybindingEntry.keybindingItem.keybinding);
		}
		return keybindingEntries.map(entry => entry.keybindingItem.keybindingItem);
	}


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/test/browser/preferencesService.test.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/test/browser/preferencesService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestCommandService } from '../../../../../editor/test/browser/editorTestServices.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IURLService } from '../../../../../platform/url/common/url.js';
import { DEFAULT_EDITOR_ASSOCIATION, IEditorPane } from '../../../../common/editor.js';
import { IJSONEditingService } from '../../../configuration/common/jsonEditing.js';
import { TestJSONEditingService } from '../../../configuration/test/common/testServices.js';
import { PreferencesService } from '../../browser/preferencesService.js';
import { IPreferencesService, ISettingsEditorOptions } from '../../common/preferences.js';
import { IRemoteAgentService } from '../../../remote/common/remoteAgentService.js';
import { TestRemoteAgentService, ITestInstantiationService, workbenchInstantiationService, TestEditorGroupView, TestEditorGroupsService } from '../../../../test/browser/workbenchTestServices.js';
import { IEditorGroupsService } from '../../../editor/common/editorGroupsService.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { SettingsEditor2Input } from '../../common/preferencesEditorInput.js';

suite('PreferencesService', () => {
	let testInstantiationService: ITestInstantiationService;
	let testObject: PreferencesService;
	let lastOpenEditorOptions: IEditorOptions | undefined;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		testInstantiationService = workbenchInstantiationService({}, disposables);

		class TestOpenEditorGroupView extends TestEditorGroupView {
			lastOpenEditorOptions: any;
			override openEditor(_editor: SettingsEditor2Input, options?: IEditorOptions): Promise<IEditorPane> {
				lastOpenEditorOptions = options;
				_editor.dispose();
				return Promise.resolve(undefined!);
			}
		}

		const testEditorGroupService = new TestEditorGroupsService([new TestOpenEditorGroupView(0)]);
		testInstantiationService.stub(IEditorGroupsService, testEditorGroupService);
		testInstantiationService.stub(IJSONEditingService, TestJSONEditingService);
		testInstantiationService.stub(IRemoteAgentService, TestRemoteAgentService);
		testInstantiationService.stub(ICommandService, TestCommandService);
		testInstantiationService.stub(IURLService, { registerHandler: () => { } });

		// PreferencesService creates a PreferencesEditorInput which depends on IPreferencesService, add the real one, not a stub
		const collection = new ServiceCollection();
		collection.set(IPreferencesService, new SyncDescriptor(PreferencesService));
		const instantiationService = disposables.add(testInstantiationService.createChild(collection));
		testObject = disposables.add(instantiationService.createInstance(PreferencesService));
	});
	test('options are preserved when calling openEditor', async () => {
		await testObject.openSettings({ jsonEditor: false, query: 'test query' });
		const options = lastOpenEditorOptions as ISettingsEditorOptions;
		assert.strictEqual(options.focusSearch, true);
		assert.strictEqual(options.override, DEFAULT_EDITOR_ASSOCIATION.id);
		assert.strictEqual(options.query, 'test query');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/test/common/preferencesModels.test.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/test/common/preferencesModels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { toDisposable } from '../../../../../base/common/lifecycle.js';
import { DefaultSettings } from '../../common/preferencesModels.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { Extensions, IConfigurationRegistry, IConfigurationNode } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';

suite('DefaultSettings', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let configurationRegistry: IConfigurationRegistry;
	let configurationService: TestConfigurationService;

	setup(() => {
		configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		configurationService = new TestConfigurationService();
	});

	test('groups settings by title when they share the same extension id', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: 'config1',
			title: 'Group 1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: 'config2',
			title: 'Group 2',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 2, 'Should have 2 groups');
		assert.strictEqual(extensionGroups[0].title, 'Group 1');
		assert.strictEqual(extensionGroups[1].title, 'Group 2');

		assert.strictEqual(extensionGroups[0].sections[0].settings.length, 1);
		assert.strictEqual(extensionGroups[0].sections[0].settings[0].key, 'test.setting1');

		assert.strictEqual(extensionGroups[1].sections[0].settings.length, 1);
		assert.strictEqual(extensionGroups[1].sections[0].settings[0].key, 'test.setting2');
	});

	test('groups settings by id when they share the same extension id and have no title', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: 'group1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: 'group1',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 1, 'Should have 1 group');
		assert.strictEqual(extensionGroups[0].id, 'group1');
		assert.strictEqual(extensionGroups[0].sections[0].settings.length, 2);
	});

	test('separates groups with same id but different titles', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: 'group1',
			title: 'Title 1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: 'group1',
			title: 'Title 2',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 2, 'Should have 2 groups');
		assert.strictEqual(extensionGroups[0].title, 'Title 1');
		assert.strictEqual(extensionGroups[1].title, 'Title 2');
	});

	test('merges untitled group into titled group if id matches', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: 'group1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: 'group1',
			title: 'Title 1',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 1, 'Should have 1 group');
		assert.strictEqual(extensionGroups[0].title, 'Title 1');
		assert.strictEqual(extensionGroups[0].sections[0].settings.length, 2);
	});

	test('separates groups with same id and title but different extension ids', () => {
		const extensionId1 = 'test.extension1';
		const extensionId2 = 'test.extension2';
		const config1: IConfigurationNode = {
			id: 'group1',
			title: 'Title 1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId1 }
		};

		const config2: IConfigurationNode = {
			id: 'group1',
			title: 'Title 1',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId2 }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const group1 = groups.find(g => g.extensionInfo?.id === extensionId1);
		const group2 = groups.find(g => g.extensionInfo?.id === extensionId2);

		assert.ok(group1);
		assert.ok(group2);
		assert.notStrictEqual(group1, group2);
		assert.strictEqual(group1.title, 'Title 1');
		assert.strictEqual(group2.title, 'Title 1');
	});

	test('separates groups with same id (no title) but different extension ids', () => {
		const extensionId1 = 'test.extension1';
		const extensionId2 = 'test.extension2';
		const config1: IConfigurationNode = {
			id: 'group1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId1 }
		};

		const config2: IConfigurationNode = {
			id: 'group1',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId2 }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const group1 = groups.find(g => g.extensionInfo?.id === extensionId1);
		const group2 = groups.find(g => g.extensionInfo?.id === extensionId2);

		assert.ok(group1);
		assert.ok(group2);
		assert.notStrictEqual(group1, group2);
	});

	test('groups settings correctly when extension id is same as group id', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: extensionId,
			title: 'Group 1',
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: extensionId,
			title: 'Group 2',
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 2, 'Should have 2 groups');
		assert.strictEqual(extensionGroups[0].title, 'Group 1');
		assert.strictEqual(extensionGroups[1].title, 'Group 2');
	});

	test('sorts groups by order', () => {
		const extensionId = 'test.extension';
		const config1: IConfigurationNode = {
			id: 'group1',
			title: 'Group 1',
			order: 2,
			type: 'object',
			properties: {
				'test.setting1': {
					type: 'string',
					default: 'value1',
					description: 'Setting 1'
				}
			},
			extensionInfo: { id: extensionId }
		};

		const config2: IConfigurationNode = {
			id: 'group2',
			title: 'Group 2',
			order: 1,
			type: 'object',
			properties: {
				'test.setting2': {
					type: 'string',
					default: 'value2',
					description: 'Setting 2'
				}
			},
			extensionInfo: { id: extensionId }
		};

		configurationRegistry.registerConfiguration(config1);
		configurationRegistry.registerConfiguration(config2);
		disposables.add(toDisposable(() => configurationRegistry.deregisterConfigurations([config1, config2])));

		const defaultSettings = disposables.add(new DefaultSettings([], ConfigurationTarget.USER, configurationService));
		const groups = defaultSettings.getRegisteredGroups();

		const extensionGroups = groups.filter(g => g.extensionInfo?.id === extensionId);

		assert.strictEqual(extensionGroups.length, 2);
		assert.strictEqual(extensionGroups[0].title, 'Group 2');
		assert.strictEqual(extensionGroups[1].title, 'Group 1');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/preferences/test/common/preferencesValidation.test.ts]---
Location: vscode-main/src/vs/workbench/services/preferences/test/common/preferencesValidation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { createValidator, getInvalidTypeError } from '../../common/preferencesValidation.js';


suite('Preferences Validation', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	class Tester {
		private validator: (value: any) => string | null;

		constructor(private settings: IConfigurationPropertySchema) {
			this.validator = createValidator(settings)!;
		}

		public accepts(input: any) {
			assert.strictEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to accept \`${JSON.stringify(input)}\`. Got ${this.validator(input)}.`);
		}

		public rejects(input: any) {
			assert.notStrictEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to reject \`${JSON.stringify(input)}\`.`);
			return {
				withMessage:
					(message: string) => {
						const actual = this.validator(input);
						assert.ok(actual);
						assert(actual.indexOf(message) > -1,
							`Expected error of ${JSON.stringify(this.settings)} on \`${input}\` to contain ${message}. Got ${this.validator(input)}.`);
					}
			};
		}

		public validatesNumeric() {
			this.accepts('3');
			this.accepts('3.');
			this.accepts('.0');
			this.accepts('3.0');
			this.accepts(' 3.0');
			this.accepts(' 3.0  ');
			this.rejects('3f');
			this.accepts(3);
			this.rejects('test');
		}

		public validatesNullableNumeric() {
			this.validatesNumeric();
			this.accepts(0);
			this.accepts('');
			this.accepts(null);
			this.accepts(undefined);
		}

		public validatesNonNullableNumeric() {
			this.validatesNumeric();
			this.accepts(0);
			this.rejects('');
			this.rejects(null);
			this.rejects(undefined);
		}

		public validatesString() {
			this.accepts('3');
			this.accepts('3.');
			this.accepts('.0');
			this.accepts('3.0');
			this.accepts(' 3.0');
			this.accepts(' 3.0  ');
			this.accepts('');
			this.accepts('3f');
			this.accepts('hello');
			this.rejects(6);
		}
	}


	test('exclusive max and max work together properly', () => {
		{
			const justMax = new Tester({ maximum: 5, type: 'number' });
			justMax.validatesNonNullableNumeric();
			justMax.rejects('5.1');
			justMax.accepts('5.0');
		}
		{
			const justEMax = new Tester({ exclusiveMaximum: 5, type: 'number' });
			justEMax.validatesNonNullableNumeric();
			justEMax.rejects('5.1');
			justEMax.rejects('5.0');
			justEMax.accepts('4.999');
		}
		{
			const bothNumeric = new Tester({ exclusiveMaximum: 5, maximum: 4, type: 'number' });
			bothNumeric.validatesNonNullableNumeric();
			bothNumeric.rejects('5.1');
			bothNumeric.rejects('5.0');
			bothNumeric.rejects('4.999');
			bothNumeric.accepts('4');
		}
		{
			const bothNumeric = new Tester({ exclusiveMaximum: 5, maximum: 6, type: 'number' });
			bothNumeric.validatesNonNullableNumeric();
			bothNumeric.rejects('5.1');
			bothNumeric.rejects('5.0');
			bothNumeric.accepts('4.999');
		}
	});

	test('exclusive min and min work together properly', () => {
		{
			const justMin = new Tester({ minimum: -5, type: 'number' });
			justMin.validatesNonNullableNumeric();
			justMin.rejects('-5.1');
			justMin.accepts('-5.0');
		}
		{
			const justEMin = new Tester({ exclusiveMinimum: -5, type: 'number' });
			justEMin.validatesNonNullableNumeric();
			justEMin.rejects('-5.1');
			justEMin.rejects('-5.0');
			justEMin.accepts('-4.999');
		}
		{
			const bothNumeric = new Tester({ exclusiveMinimum: -5, minimum: -4, type: 'number' });
			bothNumeric.validatesNonNullableNumeric();
			bothNumeric.rejects('-5.1');
			bothNumeric.rejects('-5.0');
			bothNumeric.rejects('-4.999');
			bothNumeric.accepts('-4');
		}
		{
			const bothNumeric = new Tester({ exclusiveMinimum: -5, minimum: -6, type: 'number' });
			bothNumeric.validatesNonNullableNumeric();
			bothNumeric.rejects('-5.1');
			bothNumeric.rejects('-5.0');
			bothNumeric.accepts('-4.999');
		}
	});

	test('multiple of works for both integers and fractions', () => {
		{
			const onlyEvens = new Tester({ multipleOf: 2, type: 'number' });
			onlyEvens.accepts('2.0');
			onlyEvens.accepts('2');
			onlyEvens.accepts('-4');
			onlyEvens.accepts('0');
			onlyEvens.accepts('100');
			onlyEvens.rejects('100.1');
			onlyEvens.rejects('');
			onlyEvens.rejects('we');
		}
		{
			const hackyIntegers = new Tester({ multipleOf: 1, type: 'number' });
			hackyIntegers.accepts('2.0');
			hackyIntegers.rejects('.5');
		}
		{
			const halfIntegers = new Tester({ multipleOf: 0.5, type: 'number' });
			halfIntegers.accepts('0.5');
			halfIntegers.accepts('1.5');
			halfIntegers.rejects('1.51');
		}
	});

	test('integer type correctly adds a validation', () => {
		{
			const integers = new Tester({ multipleOf: 1, type: 'integer' });
			integers.accepts('02');
			integers.accepts('2');
			integers.accepts('20');
			integers.rejects('.5');
			integers.rejects('2j');
			integers.rejects('');
		}
	});

	test('null is allowed only when expected', () => {
		{
			const nullableIntegers = new Tester({ type: ['integer', 'null'] });
			nullableIntegers.accepts('2');
			nullableIntegers.rejects('.5');
			nullableIntegers.accepts('2.0');
			nullableIntegers.rejects('2j');
			nullableIntegers.accepts('');
		}
		{
			const nonnullableIntegers = new Tester({ type: ['integer'] });
			nonnullableIntegers.accepts('2');
			nonnullableIntegers.rejects('.5');
			nonnullableIntegers.accepts('2.0');
			nonnullableIntegers.rejects('2j');
			nonnullableIntegers.rejects('');
		}
		{
			const nullableNumbers = new Tester({ type: ['number', 'null'] });
			nullableNumbers.accepts('2');
			nullableNumbers.accepts('.5');
			nullableNumbers.accepts('2.0');
			nullableNumbers.rejects('2j');
			nullableNumbers.accepts('');
		}
		{
			const nonnullableNumbers = new Tester({ type: ['number'] });
			nonnullableNumbers.accepts('2');
			nonnullableNumbers.accepts('.5');
			nonnullableNumbers.accepts('2.0');
			nonnullableNumbers.rejects('2j');
			nonnullableNumbers.rejects('');
		}
	});

	test('string max min length work', () => {
		{
			const min = new Tester({ minLength: 4, type: 'string' });
			min.rejects('123');
			min.accepts('1234');
			min.accepts('12345');
		}
		{
			const max = new Tester({ maxLength: 6, type: 'string' });
			max.accepts('12345');
			max.accepts('123456');
			max.rejects('1234567');
		}
		{
			const minMax = new Tester({ minLength: 4, maxLength: 6, type: 'string' });
			minMax.rejects('123');
			minMax.accepts('1234');
			minMax.accepts('12345');
			minMax.accepts('123456');
			minMax.rejects('1234567');
		}
	});

	test('objects work', () => {
		{
			const obj = new Tester({ type: 'object', properties: { 'a': { type: 'string', maxLength: 2 } }, additionalProperties: false });
			obj.rejects({ 'a': 'string' });
			obj.accepts({ 'a': 'st' });
			obj.rejects({ 'a': null });
			obj.rejects({ 'a': 7 });
			obj.accepts({});
			obj.rejects('test');
			obj.rejects(7);
			obj.rejects([1, 2, 3]);
		}
		{
			const pattern = new Tester({ type: 'object', patternProperties: { '^a[a-z]$': { type: 'string', minLength: 2 } }, additionalProperties: false });
			pattern.accepts({ 'ab': 'string' });
			pattern.accepts({ 'ab': 'string', 'ac': 'hmm' });
			pattern.rejects({ 'ab': 'string', 'ac': 'h' });
			pattern.rejects({ 'ab': 'string', 'ac': 99999 });
			pattern.rejects({ 'abc': 'string' });
			pattern.rejects({ 'a0': 'string' });
			pattern.rejects({ 'ab': 'string', 'bc': 'hmm' });
			pattern.rejects({ 'be': 'string' });
			pattern.rejects({ 'be': 'a' });
			pattern.accepts({});
		}
		{
			const pattern = new Tester({ type: 'object', patternProperties: { '^#': { type: 'string', minLength: 3 } }, additionalProperties: { type: 'string', maxLength: 3 } });
			pattern.accepts({ '#ab': 'string' });
			pattern.accepts({ 'ab': 'str' });
			pattern.rejects({ '#ab': 's' });
			pattern.rejects({ 'ab': 99999 });
			pattern.rejects({ '#ab': 99999 });
			pattern.accepts({});
		}
		{
			const pattern = new Tester({ type: 'object', properties: { 'hello': { type: 'string' } }, additionalProperties: { type: 'boolean' } });
			pattern.accepts({ 'hello': 'world' });
			pattern.accepts({ 'hello': 'world', 'bye': false });
			pattern.rejects({ 'hello': 'world', 'bye': 'false' });
			pattern.rejects({ 'hello': 'world', 'bye': 1 });
			pattern.rejects({ 'hello': 'world', 'bye': 'world' });
			pattern.accepts({ 'hello': 'test' });
			pattern.accepts({});
		}
	});

	test('numerical objects work', () => {
		{
			const obj = new Tester({ type: 'object', properties: { 'b': { type: 'number' } } });
			obj.accepts({ 'b': 2.5 });
			obj.accepts({ 'b': -2.5 });
			obj.accepts({ 'b': 0 });
			obj.accepts({ 'b': '0.12' });
			obj.rejects({ 'b': 'abc' });
			obj.rejects({ 'b': [] });
			obj.rejects({ 'b': false });
			obj.rejects({ 'b': null });
			obj.rejects({ 'b': undefined });
		}
		{
			const obj = new Tester({ type: 'object', properties: { 'b': { type: 'integer', minimum: 2, maximum: 5.5 } } });
			obj.accepts({ 'b': 2 });
			obj.accepts({ 'b': 3 });
			obj.accepts({ 'b': '3.0' });
			obj.accepts({ 'b': 5 });
			obj.rejects({ 'b': 1 });
			obj.rejects({ 'b': 6 });
			obj.rejects({ 'b': 5.5 });
		}
	});

	test('patterns work', () => {
		{
			const urls = new Tester({ pattern: '^(hello)*$', type: 'string' });
			urls.accepts('');
			urls.rejects('hel');
			urls.accepts('hello');
			urls.rejects('hellohel');
			urls.accepts('hellohello');
		}
		{
			const urls = new Tester({ pattern: '^(hello)*$', type: 'string', patternErrorMessage: 'err: must be friendly' });
			urls.accepts('');
			urls.rejects('hel').withMessage('err: must be friendly');
			urls.accepts('hello');
			urls.rejects('hellohel').withMessage('err: must be friendly');
			urls.accepts('hellohello');
		}
		{
			const unicodePattern = new Tester({ type: 'string', pattern: '^[\\p{L}\\d_. -]*$', minLength: 3 });
			unicodePattern.accepts('_autoload');
			unicodePattern.rejects('#hash');
			unicodePattern.rejects('');
		}
	});

	test('custom error messages are shown', () => {
		const withMessage = new Tester({ minLength: 1, maxLength: 0, type: 'string', errorMessage: 'always error!' });
		withMessage.rejects('').withMessage('always error!');
		withMessage.rejects(' ').withMessage('always error!');
		withMessage.rejects('1').withMessage('always error!');
	});

	class ArrayTester {
		private validator: (value: any) => string | null;

		constructor(private settings: IConfigurationPropertySchema) {
			this.validator = createValidator(settings)!;
		}

		public accepts(input: unknown[]) {
			assert.strictEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to accept \`${JSON.stringify(input)}\`. Got ${this.validator(input)}.`);
		}

		public rejects(input: any) {
			assert.notStrictEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to reject \`${JSON.stringify(input)}\`.`);
			return {
				withMessage:
					(message: string) => {
						const actual = this.validator(input);
						assert.ok(actual);
						assert(actual.indexOf(message) > -1,
							`Expected error of ${JSON.stringify(this.settings)} on \`${input}\` to contain ${message}. Got ${this.validator(input)}.`);
					}
			};
		}
	}

	test('simple array', () => {
		{
			const arr = new ArrayTester({ type: 'array', items: { type: 'string' } });
			arr.accepts([]);
			arr.accepts(['foo']);
			arr.accepts(['foo', 'bar']);
			arr.rejects(76);
			arr.rejects([6, '3', 7]);
		}
	});

	test('min-max items array', () => {
		{
			const arr = new ArrayTester({ type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 });
			arr.rejects([]).withMessage('Array must have at least 1 items');
			arr.accepts(['a']);
			arr.accepts(['a', 'a']);
			arr.rejects(['a', 'a', 'a']).withMessage('Array must have at most 2 items');
		}
	});

	test('array of enums', () => {
		{
			const arr = new ArrayTester({ type: 'array', items: { type: 'string', enum: ['a', 'b'] } });
			arr.accepts(['a']);
			arr.accepts(['a', 'b']);

			arr.rejects(['c']).withMessage(`Value 'c' is not one of`);
			arr.rejects(['a', 'c']).withMessage(`Value 'c' is not one of`);

			arr.rejects(['c', 'd']).withMessage(`Value 'c' is not one of`);
			arr.rejects(['c', 'd']).withMessage(`Value 'd' is not one of`);
		}
	});

	test('array of numbers', () => {
		// We accept parseable strings since the view handles strings
		{
			const arr = new ArrayTester({ type: 'array', items: { type: 'number' } });
			arr.accepts([]);
			arr.accepts([2]);
			arr.accepts([2, 3]);
			arr.accepts(['2', '3']);
			arr.accepts([6.6, '3', 7]);
			arr.rejects(76);
			arr.rejects(7.6);
			arr.rejects([6, 'a', 7]);
		}
		{
			const arr = new ArrayTester({ type: 'array', items: { type: 'integer', minimum: -2, maximum: 3 }, maxItems: 4 });
			arr.accepts([]);
			arr.accepts([-2, 3]);
			arr.accepts([2, 3]);
			arr.accepts(['2', '3']);
			arr.accepts(['-2', '0', '3']);
			arr.accepts(['-2', 0.0, '3']);
			arr.rejects(2);
			arr.rejects(76);
			arr.rejects([6, '3', 7]);
			arr.rejects([2, 'a', 3]);
			arr.rejects([-2, 4]);
			arr.rejects([-1.2, 2.1]);
			arr.rejects([-3, 3]);
			arr.rejects([-3, 4]);
			arr.rejects([2, 2, 2, 2, 2]);
		}
	});

	test('min-max and enum', () => {
		const arr = new ArrayTester({ type: 'array', items: { type: 'string', enum: ['a', 'b'] }, minItems: 1, maxItems: 2 });

		arr.rejects(['a', 'b', 'c']).withMessage('Array must have at most 2 items');
		arr.rejects(['a', 'b', 'c']).withMessage(`Value 'c' is not one of`);
	});

	test('pattern', () => {
		const arr = new ArrayTester({ type: 'array', items: { type: 'string', pattern: '^(hello)*$' } });

		arr.accepts(['hello']);
		arr.rejects(['a']).withMessage(`Value 'a' must match regex`);
	});

	test('Unicode pattern', () => {
		const arr = new ArrayTester({ type: 'array', items: { type: 'string', pattern: '^[\\p{L}\\d_. -]*$' } });

		arr.accepts(['hello', 'world']);
		arr.rejects(['hello', '#world']).withMessage(`Value '#world' must match regex`);
	});

	test('pattern with error message', () => {
		const arr = new ArrayTester({ type: 'array', items: { type: 'string', pattern: '^(hello)*$', patternErrorMessage: 'err: must be friendly' } });

		arr.rejects(['a']).withMessage(`err: must be friendly`);
	});

	test('uniqueItems', () => {
		const arr = new ArrayTester({ type: 'array', items: { type: 'string' }, uniqueItems: true });

		arr.rejects(['a', 'a']).withMessage(`Array has duplicate items`);
	});

	test('getInvalidTypeError', () => {
		function testInvalidTypeError(value: any, type: string | string[], shouldValidate: boolean) {
			const message = `value: ${value}, type: ${JSON.stringify(type)}, expected: ${shouldValidate ? 'valid' : 'invalid'}`;
			if (shouldValidate) {
				assert.ok(!getInvalidTypeError(value, type), message);
			} else {
				assert.ok(getInvalidTypeError(value, type), message);
			}
		}

		testInvalidTypeError(1, 'number', true);
		testInvalidTypeError(1.5, 'number', true);
		testInvalidTypeError([1], 'number', false);
		testInvalidTypeError('1', 'number', false);
		testInvalidTypeError({ a: 1 }, 'number', false);
		testInvalidTypeError(null, 'number', false);

		testInvalidTypeError('a', 'string', true);
		testInvalidTypeError('1', 'string', true);
		testInvalidTypeError([], 'string', false);
		testInvalidTypeError({}, 'string', false);

		testInvalidTypeError([1], 'array', true);
		testInvalidTypeError([], 'array', true);
		testInvalidTypeError([{}, [[]]], 'array', true);
		testInvalidTypeError({ a: ['a'] }, 'array', false);
		testInvalidTypeError('hello', 'array', false);

		testInvalidTypeError(true, 'boolean', true);
		testInvalidTypeError('hello', 'boolean', false);
		testInvalidTypeError(null, 'boolean', false);
		testInvalidTypeError([true], 'boolean', false);

		testInvalidTypeError(null, 'null', true);
		testInvalidTypeError(false, 'null', false);
		testInvalidTypeError([null], 'null', false);
		testInvalidTypeError('null', 'null', false);
	});

	test('uri checks work', () => {
		const tester = new Tester({ type: 'string', format: 'uri' });
		tester.rejects('example.com');
		tester.rejects('example.com/example');
		tester.rejects('example/example.html');
		tester.rejects('www.example.com');
		tester.rejects('');
		tester.rejects(' ');
		tester.rejects('example');

		tester.accepts('https:');
		tester.accepts('https://');
		tester.accepts('https://example.com');
		tester.accepts('https://www.example.com');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/process/electron-browser/processService.ts]---
Location: vscode-main/src/vs/workbench/services/process/electron-browser/processService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { IProcessService } from '../../../../platform/process/common/process.js';

registerMainProcessRemoteService(IProcessService, 'process');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/progress/browser/progressIndicator.ts]---
Location: vscode-main/src/vs/workbench/services/progress/browser/progressIndicator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { IProgressRunner, IProgressIndicator, emptyProgressRunner } from '../../../../platform/progress/common/progress.js';
import { IEditorGroupView } from '../../../browser/parts/editor/editor.js';
import { GroupModelChangeKind } from '../../../common/editor.js';

export class EditorProgressIndicator extends Disposable implements IProgressIndicator {

	constructor(
		private readonly progressBar: ProgressBar,
		private readonly group: IEditorGroupView
	) {
		super();

		this.registerListeners();
	}

	private registerListeners() {

		// Stop any running progress when the active editor changes or
		// the group becomes empty.
		// In contrast to the composite progress indicator, we do not
		// track active editor progress and replay it later (yet).
		this._register(this.group.onDidModelChange(e => {
			if (
				e.kind === GroupModelChangeKind.EDITOR_ACTIVE ||
				(e.kind === GroupModelChangeKind.EDITOR_CLOSE && this.group.isEmpty)
			) {
				this.progressBar.stop().hide();
			}
		}));
	}

	show(infinite: true, delay?: number): IProgressRunner;
	show(total: number, delay?: number): IProgressRunner;
	show(infiniteOrTotal: true | number, delay?: number): IProgressRunner {

		// No editor open: ignore any progress reporting
		if (this.group.isEmpty) {
			return emptyProgressRunner;
		}

		if (infiniteOrTotal === true) {
			return this.doShow(true, delay);
		}

		return this.doShow(infiniteOrTotal, delay);
	}

	private doShow(infinite: true, delay?: number): IProgressRunner;
	private doShow(total: number, delay?: number): IProgressRunner;
	private doShow(infiniteOrTotal: true | number, delay?: number): IProgressRunner {
		if (typeof infiniteOrTotal === 'boolean') {
			this.progressBar.infinite().show(delay);
		} else {
			this.progressBar.total(infiniteOrTotal).show(delay);
		}

		return {
			total: (total: number) => {
				this.progressBar.total(total);
			},

			worked: (worked: number) => {
				if (this.progressBar.hasTotal()) {
					this.progressBar.worked(worked);
				} else {
					this.progressBar.infinite().show();
				}
			},

			done: () => {
				this.progressBar.stop().hide();
			}
		};
	}

	async showWhile(promise: Promise<unknown>, delay?: number): Promise<void> {

		// No editor open: ignore any progress reporting
		if (this.group.isEmpty) {
			try {
				await promise;
			} catch (error) {
				// ignore
			}
		}

		return this.doShowWhile(promise, delay);
	}

	private async doShowWhile(promise: Promise<unknown>, delay?: number): Promise<void> {
		try {
			this.progressBar.infinite().show(delay);

			await promise;
		} catch (error) {
			// ignore
		} finally {
			this.progressBar.stop().hide();
		}
	}
}

namespace ProgressIndicatorState {

	export const enum Type {
		None,
		Done,
		Infinite,
		While,
		Work
	}

	export const None = { type: Type.None } as const;
	export const Done = { type: Type.Done } as const;
	export const Infinite = { type: Type.Infinite } as const;

	export class While {

		readonly type = Type.While;

		constructor(
			readonly whilePromise: Promise<unknown>,
			readonly whileStart: number,
			readonly whileDelay: number,
		) { }
	}

	export class Work {

		readonly type = Type.Work;

		constructor(
			readonly total: number | undefined,
			readonly worked: number | undefined
		) { }
	}

	export type State =
		typeof None
		| typeof Done
		| typeof Infinite
		| While
		| Work;
}

export interface IProgressScope {

	/**
	 * Fired whenever `isActive` value changed.
	 */
	readonly onDidChangeActive: Event<void>;

	/**
	 * Whether progress should be active or not.
	 */
	readonly isActive: boolean;
}

export class ScopedProgressIndicator extends Disposable implements IProgressIndicator {

	private progressState: ProgressIndicatorState.State = ProgressIndicatorState.None;

	constructor(
		private readonly progressBar: ProgressBar,
		private readonly scope: IProgressScope
	) {
		super();

		this.registerListeners();
	}

	registerListeners() {
		this._register(this.scope.onDidChangeActive(() => {
			if (this.scope.isActive) {
				this.onDidScopeActivate();
			} else {
				this.onDidScopeDeactivate();
			}
		}));
	}

	private onDidScopeActivate(): void {

		// Return early if progress state indicates that progress is done
		if (this.progressState.type === ProgressIndicatorState.Done.type) {
			return;
		}

		// Replay Infinite Progress from Promise
		if (this.progressState.type === ProgressIndicatorState.Type.While) {
			let delay: number | undefined;
			if (this.progressState.whileDelay > 0) {
				const remainingDelay = this.progressState.whileDelay - (Date.now() - this.progressState.whileStart);
				if (remainingDelay > 0) {
					delay = remainingDelay;
				}
			}

			this.doShowWhile(delay);
		}

		// Replay Infinite Progress
		else if (this.progressState.type === ProgressIndicatorState.Type.Infinite) {
			this.progressBar.infinite().show();
		}

		// Replay Finite Progress (Total & Worked)
		else if (this.progressState.type === ProgressIndicatorState.Type.Work) {
			if (this.progressState.total) {
				this.progressBar.total(this.progressState.total).show();
			}

			if (this.progressState.worked) {
				this.progressBar.worked(this.progressState.worked).show();
			}
		}
	}

	private onDidScopeDeactivate(): void {
		this.progressBar.stop().hide();
	}

	show(infinite: true, delay?: number): IProgressRunner;
	show(total: number, delay?: number): IProgressRunner;
	show(infiniteOrTotal: true | number, delay?: number): IProgressRunner {

		// Sort out Arguments
		if (typeof infiniteOrTotal === 'boolean') {
			this.progressState = ProgressIndicatorState.Infinite;
		} else {
			this.progressState = new ProgressIndicatorState.Work(infiniteOrTotal, undefined);
		}

		// Active: Show Progress
		if (this.scope.isActive) {

			// Infinite: Start Progressbar and Show after Delay
			if (this.progressState.type === ProgressIndicatorState.Type.Infinite) {
				this.progressBar.infinite().show(delay);
			}

			// Finite: Start Progressbar and Show after Delay
			else if (this.progressState.type === ProgressIndicatorState.Type.Work && typeof this.progressState.total === 'number') {
				this.progressBar.total(this.progressState.total).show(delay);
			}
		}

		return {
			total: (total: number) => {
				this.progressState = new ProgressIndicatorState.Work(
					total,
					this.progressState.type === ProgressIndicatorState.Type.Work ? this.progressState.worked : undefined);

				if (this.scope.isActive) {
					this.progressBar.total(total);
				}
			},

			worked: (worked: number) => {

				// Verify first that we are either not active or the progressbar has a total set
				if (!this.scope.isActive || this.progressBar.hasTotal()) {
					this.progressState = new ProgressIndicatorState.Work(
						this.progressState.type === ProgressIndicatorState.Type.Work ? this.progressState.total : undefined,
						this.progressState.type === ProgressIndicatorState.Type.Work && typeof this.progressState.worked === 'number' ? this.progressState.worked + worked : worked);

					if (this.scope.isActive) {
						this.progressBar.worked(worked);
					}
				}

				// Otherwise the progress bar does not support worked(), we fallback to infinite() progress
				else {
					this.progressState = ProgressIndicatorState.Infinite;
					this.progressBar.infinite().show();
				}
			},

			done: () => {
				this.progressState = ProgressIndicatorState.Done;

				if (this.scope.isActive) {
					this.progressBar.stop().hide();
				}
			}
		};
	}

	async showWhile(promise: Promise<unknown>, delay?: number): Promise<void> {

		// Join with existing running promise to ensure progress is accurate
		if (this.progressState.type === ProgressIndicatorState.Type.While) {
			promise = Promise.allSettled([promise, this.progressState.whilePromise]);
		}

		// Keep Promise in State
		this.progressState = new ProgressIndicatorState.While(promise, delay || 0, Date.now());

		try {
			this.doShowWhile(delay);

			await promise;
		} catch (error) {
			// ignore
		} finally {

			// If this is not the last promise in the list of joined promises, skip this
			if (this.progressState.type !== ProgressIndicatorState.Type.While || this.progressState.whilePromise === promise) {

				// The while promise is either null or equal the promise we last hooked on
				this.progressState = ProgressIndicatorState.None;

				if (this.scope.isActive) {
					this.progressBar.stop().hide();
				}
			}
		}
	}

	private doShowWhile(delay?: number): void {

		// Show Progress when active
		if (this.scope.isActive) {
			this.progressBar.infinite().show(delay);
		}
	}
}

export abstract class AbstractProgressScope extends Disposable implements IProgressScope {

	private readonly _onDidChangeActive = this._register(new Emitter<void>());
	readonly onDidChangeActive = this._onDidChangeActive.event;

	get isActive() { return this._isActive; }

	constructor(
		private scopeId: string,
		private _isActive: boolean
	) {
		super();
	}

	protected onScopeOpened(scopeId: string) {
		if (scopeId === this.scopeId) {
			if (!this._isActive) {
				this._isActive = true;

				this._onDidChangeActive.fire();
			}
		}
	}

	protected onScopeClosed(scopeId: string) {
		if (scopeId === this.scopeId) {
			if (this._isActive) {
				this._isActive = false;

				this._onDidChangeActive.fire();
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/progress/browser/progressService.ts]---
Location: vscode-main/src/vs/workbench/services/progress/browser/progressService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/progressService.css';
import { localize } from '../../../../nls.js';
import { IDisposable, dispose, DisposableStore, Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IProgressService, IProgressOptions, IProgressStep, ProgressLocation, IProgress, Progress, IProgressCompositeOptions, IProgressNotificationOptions, IProgressRunner, IProgressIndicator, IProgressWindowOptions, IProgressDialogOptions } from '../../../../platform/progress/common/progress.js';
import { StatusbarAlignment, IStatusbarService, IStatusbarEntryAccessor, IStatusbarEntry } from '../../statusbar/browser/statusbar.js';
import { DeferredPromise, RunOnceScheduler, timeout } from '../../../../base/common/async.js';
import { ProgressBadge, IActivityService } from '../../activity/common/activity.js';
import { INotificationService, Severity, INotificationHandle, NotificationPriority, isNotificationSource, NotificationsFilter } from '../../../../platform/notification/common/notification.js';
import { Action } from '../../../../base/common/actions.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { Dialog } from '../../../../base/browser/ui/dialog/dialog.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../views/common/viewsService.js';
import { IPaneCompositePartService } from '../../panecomposite/browser/panecomposite.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { IUserActivityService } from '../../userActivity/common/userActivityService.js';
import { createWorkbenchDialogOptions } from '../../../../platform/dialogs/browser/dialog.js';

export class ProgressService extends Disposable implements IProgressService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IViewsService private readonly viewsService: IViewsService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@ILayoutService private readonly layoutService: ILayoutService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IUserActivityService private readonly userActivityService: IUserActivityService,
	) {
		super();
	}

	async withProgress<R = unknown>(options: IProgressOptions, originalTask: (progress: IProgress<IProgressStep>) => Promise<R>, onDidCancel?: (choice?: number) => void): Promise<R> {
		const { location } = options;

		const task = async (progress: IProgress<IProgressStep>) => {
			const activeLock = this.userActivityService.markActive({ extendOnly: true, whenHeldFor: 15_000 });
			try {
				return await originalTask(progress);
			} finally {
				activeLock.dispose();
			}
		};

		const handleStringLocation = (location: string) => {
			const viewContainer = this.viewDescriptorService.getViewContainerById(location);
			if (viewContainer) {
				const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
				if (viewContainerLocation !== null) {
					return this.withPaneCompositeProgress(location, viewContainerLocation, task, { ...options, location });
				}
			}

			if (this.viewDescriptorService.getViewDescriptorById(location) !== null) {
				return this.withViewProgress(location, task, { ...options, location });
			}

			throw new Error(`Bad progress location: ${location}`);
		};

		if (typeof location === 'string') {
			return handleStringLocation(location);
		}

		switch (location) {
			case ProgressLocation.Notification: {
				let priority = (options as IProgressNotificationOptions).priority;
				if (priority !== NotificationPriority.URGENT) {
					if (this.notificationService.getFilter() === NotificationsFilter.ERROR) {
						priority = NotificationPriority.SILENT;
					} else if (isNotificationSource(options.source) && this.notificationService.getFilter(options.source) === NotificationsFilter.ERROR) {
						priority = NotificationPriority.SILENT;
					}
				}

				return this.withNotificationProgress({ ...options, location, priority }, task, onDidCancel);
			}
			case ProgressLocation.Window: {
				const type = (options as IProgressWindowOptions).type;
				if ((options as IProgressWindowOptions).command) {
					// Window progress with command get's shown in the status bar
					return this.withWindowProgress({ ...options, location, type }, task);
				}
				// Window progress without command can be shown as silent notification
				// which will first appear in the status bar and can then be brought to
				// the front when clicking.
				return this.withNotificationProgress({ delay: 150 /* default for ProgressLocation.Window */, ...options, priority: NotificationPriority.SILENT, location: ProgressLocation.Notification, type }, task, onDidCancel);
			}
			case ProgressLocation.Explorer:
				return this.withPaneCompositeProgress('workbench.view.explorer', ViewContainerLocation.Sidebar, task, { ...options, location });
			case ProgressLocation.Scm:
				return handleStringLocation('workbench.scm');
			case ProgressLocation.Extensions:
				return this.withPaneCompositeProgress('workbench.view.extensions', ViewContainerLocation.Sidebar, task, { ...options, location });
			case ProgressLocation.Dialog:
				return this.withDialogProgress(options, task, onDidCancel);
			default:
				throw new Error(`Bad progress location: ${location}`);
		}
	}

	private readonly windowProgressStack: [IProgressWindowOptions, Progress<IProgressStep>][] = [];
	private windowProgressStatusEntry: IStatusbarEntryAccessor | undefined = undefined;

	private withWindowProgress<R = unknown>(options: IProgressWindowOptions, callback: (progress: IProgress<{ message?: string }>) => Promise<R>): Promise<R> {
		const task: [IProgressWindowOptions, Progress<IProgressStep>] = [options, new Progress<IProgressStep>(() => this.updateWindowProgress())];

		const promise = callback(task[1]);

		let delayHandle: Timeout | undefined = setTimeout(() => {
			delayHandle = undefined;
			this.windowProgressStack.unshift(task);
			this.updateWindowProgress();

			// show progress for at least 150ms
			Promise.all([
				timeout(150),
				promise
			]).finally(() => {
				const idx = this.windowProgressStack.indexOf(task);
				this.windowProgressStack.splice(idx, 1);
				this.updateWindowProgress();
			});
		}, 150);

		// cancel delay if promise finishes below 150ms
		return promise.finally(() => clearTimeout(delayHandle));
	}

	private updateWindowProgress(idx = 0) {

		// We still have progress to show
		if (idx < this.windowProgressStack.length) {
			const [options, progress] = this.windowProgressStack[idx];

			const progressTitle = options.title;
			const progressMessage = progress.value?.message;
			const progressCommand = options.command;
			let text: string;
			let title: string;
			const source = options.source && typeof options.source !== 'string' ? options.source.label : options.source;

			if (progressTitle && progressMessage) {
				// <title>: <message>
				text = localize('progress.text2', "{0}: {1}", progressTitle, progressMessage);
				title = source ? localize('progress.title3', "[{0}] {1}: {2}", source, progressTitle, progressMessage) : text;

			} else if (progressTitle) {
				// <title>
				text = progressTitle;
				title = source ? localize('progress.title2', "[{0}]: {1}", source, progressTitle) : text;

			} else if (progressMessage) {
				// <message>
				text = progressMessage;
				title = source ? localize('progress.title2', "[{0}]: {1}", source, progressMessage) : text;

			} else {
				// no title, no message -> no progress. try with next on stack
				this.updateWindowProgress(idx + 1);
				return;
			}

			const statusEntryProperties: IStatusbarEntry = {
				name: localize('status.progress', "Progress Message"),
				text,
				showProgress: options.type || true,
				ariaLabel: text,
				tooltip: stripIcons(title).trim(),
				command: progressCommand
			};

			if (this.windowProgressStatusEntry) {
				this.windowProgressStatusEntry.update(statusEntryProperties);
			} else {
				this.windowProgressStatusEntry = this.statusbarService.addEntry(statusEntryProperties, 'status.progress', StatusbarAlignment.LEFT, -Number.MAX_VALUE /* almost last entry */);
			}
		}

		// Progress is done so we remove the status entry
		else {
			this.windowProgressStatusEntry?.dispose();
			this.windowProgressStatusEntry = undefined;
		}
	}

	private withNotificationProgress<P extends Promise<R>, R = unknown>(options: IProgressNotificationOptions, callback: (progress: IProgress<IProgressStep>) => P, onDidCancel?: (choice?: number) => void): P {

		const progressStateModel = new class extends Disposable {

			private readonly _onDidReport = this._register(new Emitter<IProgressStep>());
			readonly onDidReport = this._onDidReport.event;

			private readonly _onWillDispose = this._register(new Emitter<void>());
			readonly onWillDispose = this._onWillDispose.event;

			private _step: IProgressStep | undefined = undefined;
			get step() { return this._step; }

			private _done = false;
			get done() { return this._done; }

			readonly promise: P;

			constructor() {
				super();

				this.promise = callback(this);

				this.promise.finally(() => {
					this.dispose();
				});
			}

			report(step: IProgressStep): void {
				this._step = step;

				this._onDidReport.fire(step);
			}

			cancel(choice?: number): void {
				onDidCancel?.(choice);

				this.dispose();
			}

			override dispose(): void {
				this._done = true;
				this._onWillDispose.fire();

				super.dispose();
			}
		};

		const createWindowProgress = () => {

			// Create a promise that we can resolve as needed
			// when the outside calls dispose on us
			const promise = new DeferredPromise<void>();

			this.withWindowProgress({
				location: ProgressLocation.Window,
				title: options.title ? parseLinkedText(options.title).toString() : undefined, // convert markdown links => string
				command: 'notifications.showList',
				type: options.type
			}, progress => {

				function reportProgress(step: IProgressStep) {
					if (step.message) {
						progress.report({
							message: parseLinkedText(step.message).toString()  // convert markdown links => string
						});
					}
				}

				// Apply any progress that was made already
				if (progressStateModel.step) {
					reportProgress(progressStateModel.step);
				}

				// Continue to report progress as it happens
				const onDidReportListener = progressStateModel.onDidReport(step => reportProgress(step));
				promise.p.finally(() => onDidReportListener.dispose());

				// When the progress model gets disposed, we are done as well
				Event.once(progressStateModel.onWillDispose)(() => promise.complete());

				return promise.p;
			});

			// Dispose means completing our promise
			return toDisposable(() => promise.complete());
		};

		const createNotification = (message: string, priority?: NotificationPriority, increment?: number): INotificationHandle => {
			const notificationDisposables = new DisposableStore();

			const primaryActions = options.primaryActions ? Array.from(options.primaryActions) : [];
			const secondaryActions = options.secondaryActions ? Array.from(options.secondaryActions) : [];

			if (options.buttons) {
				options.buttons.forEach((button, index) => {
					const buttonAction = new class extends Action {
						constructor() {
							super(`progress.button.${button}`, button, undefined, true);
						}

						override async run(): Promise<void> {
							progressStateModel.cancel(index);
						}
					};
					notificationDisposables.add(buttonAction);

					primaryActions.push(buttonAction);
				});
			}

			if (options.cancellable) {
				const cancelAction = new class extends Action {
					constructor() {
						super('progress.cancel', typeof options.cancellable === 'string' ? options.cancellable : localize('cancel', "Cancel"), undefined, true);
					}

					override async run(): Promise<void> {
						progressStateModel.cancel();
					}
				};
				notificationDisposables.add(cancelAction);

				primaryActions.push(cancelAction);
			}

			const notification = this.notificationService.notify({
				severity: Severity.Info,
				message: stripIcons(message), // status entries support codicons, but notifications do not (https://github.com/microsoft/vscode/issues/145722)
				source: options.source,
				actions: { primary: primaryActions, secondary: secondaryActions },
				progress: typeof increment === 'number' && increment >= 0 ? { total: 100, worked: increment } : { infinite: true },
				priority
			});

			// Switch to window based progress once the notification
			// changes visibility to hidden and is still ongoing.
			// Remove that window based progress once the notification
			// shows again.
			let windowProgressDisposable: IDisposable | undefined = undefined;
			const onVisibilityChange = (visible: boolean) => {

				// Clear any previous running window progress
				dispose(windowProgressDisposable);

				// Create new window progress if notification got hidden
				if (!visible && !progressStateModel.done) {
					windowProgressDisposable = createWindowProgress();
				}
			};
			notificationDisposables.add(notification.onDidChangeVisibility(onVisibilityChange));
			if (priority === NotificationPriority.SILENT) {
				onVisibilityChange(false);
			}

			// Clear upon dispose
			Event.once(notification.onDidClose)(() => {
				notificationDisposables.dispose();
				dispose(windowProgressDisposable);
			});

			return notification;
		};

		const updateProgress = (notification: INotificationHandle, increment?: number): void => {
			if (typeof increment === 'number' && increment >= 0) {
				notification.progress.total(100); // always percentage based
				notification.progress.worked(increment);
			} else {
				notification.progress.infinite();
			}
		};

		let notificationHandle: INotificationHandle | undefined;
		let notificationTimeout: Timeout | undefined;
		let titleAndMessage: string | undefined; // hoisted to make sure a delayed notification shows the most recent message

		const updateNotification = (step?: IProgressStep): void => {

			// full message (inital or update)
			if (step?.message && options.title) {
				titleAndMessage = `${options.title}: ${step.message}`; // always prefix with overall title if we have it (https://github.com/microsoft/vscode/issues/50932)
			} else {
				titleAndMessage = options.title || step?.message;
			}

			if (!notificationHandle && titleAndMessage) {

				// create notification now or after a delay
				if (typeof options.delay === 'number' && options.delay > 0) {
					if (notificationTimeout === undefined) {
						notificationTimeout = setTimeout(() => notificationHandle = createNotification(titleAndMessage!, options.priority, step?.increment), options.delay);
					}
				} else {
					notificationHandle = createNotification(titleAndMessage, options.priority, step?.increment);
				}
			}

			if (notificationHandle) {
				if (titleAndMessage) {
					notificationHandle.updateMessage(titleAndMessage);
				}

				if (typeof step?.increment === 'number') {
					updateProgress(notificationHandle, step.increment);
				}
			}
		};

		// Show initially
		updateNotification(progressStateModel.step);
		const listener = progressStateModel.onDidReport(step => updateNotification(step));
		Event.once(progressStateModel.onWillDispose)(() => listener.dispose());

		// Clean up eventually
		(async () => {
			try {

				// with a delay we only wait for the finish of the promise
				if (typeof options.delay === 'number' && options.delay > 0) {
					await progressStateModel.promise;
				}

				// without a delay we show the notification for at least 800ms
				// to reduce the chance of the notification flashing up and hiding
				else {
					await Promise.all([timeout(800), progressStateModel.promise]);
				}
			} finally {
				clearTimeout(notificationTimeout);
				notificationHandle?.close();
			}
		})();

		return progressStateModel.promise;
	}

	private withPaneCompositeProgress<P extends Promise<R>, R = unknown>(paneCompositeId: string, viewContainerLocation: ViewContainerLocation, task: (progress: IProgress<IProgressStep>) => P, options: IProgressCompositeOptions): P {

		// show in viewlet
		const progressIndicator = this.paneCompositeService.getProgressIndicator(paneCompositeId, viewContainerLocation);
		const promise = progressIndicator ? this.withCompositeProgress(progressIndicator, task, options) : task({ report: () => { } });

		// show on activity bar
		if (viewContainerLocation === ViewContainerLocation.Sidebar) {
			this.showOnActivityBar<P, R>(paneCompositeId, options, promise);
		}

		return promise;
	}

	private withViewProgress<P extends Promise<R>, R = unknown>(viewId: string, task: (progress: IProgress<IProgressStep>) => P, options: IProgressCompositeOptions): P {

		// show in viewlet
		const progressIndicator = this.viewsService.getViewProgressIndicator(viewId);
		const promise = progressIndicator ? this.withCompositeProgress(progressIndicator, task, options) : task({ report: () => { } });

		const viewletId = this.viewDescriptorService.getViewContainerByViewId(viewId)?.id;
		if (viewletId === undefined) {
			return promise;
		}

		// show on activity bar
		this.showOnActivityBar(viewletId, options, promise);

		return promise;
	}

	private showOnActivityBar<P extends Promise<R>, R = unknown>(viewletId: string, options: IProgressCompositeOptions, promise: P): void {
		let activityProgress: IDisposable;
		let delayHandle: Timeout | undefined = setTimeout(() => {
			delayHandle = undefined;
			const handle = this.activityService.showViewContainerActivity(viewletId, { badge: new ProgressBadge(() => '') });
			const startTimeVisible = Date.now();
			const minTimeVisible = 300;
			activityProgress = {
				dispose() {
					const d = Date.now() - startTimeVisible;
					if (d < minTimeVisible) {
						// should at least show for Nms
						setTimeout(() => handle.dispose(), minTimeVisible - d);
					} else {
						// shown long enough
						handle.dispose();
					}
				}
			};
		}, options.delay || 300);
		promise.finally(() => {
			clearTimeout(delayHandle);
			dispose(activityProgress);
		});
	}

	private withCompositeProgress<P extends Promise<R>, R = unknown>(progressIndicator: IProgressIndicator, task: (progress: IProgress<IProgressStep>) => P, options: IProgressCompositeOptions): P {
		let discreteProgressRunner: IProgressRunner | undefined = undefined;

		function updateProgress(stepOrTotal: IProgressStep | number | undefined): IProgressRunner | undefined {

			// Figure out whether discrete progress applies
			// by figuring out the "total" progress to show
			// and the increment if any.
			let total: number | undefined = undefined;
			let increment: number | undefined = undefined;
			if (typeof stepOrTotal !== 'undefined') {
				if (typeof stepOrTotal === 'number') {
					total = stepOrTotal;
				} else if (typeof stepOrTotal.increment === 'number') {
					total = stepOrTotal.total ?? 100; // always percentage based
					increment = stepOrTotal.increment;
				}
			}

			// Discrete
			if (typeof total === 'number') {
				if (!discreteProgressRunner) {
					discreteProgressRunner = progressIndicator.show(total, options.delay);
					promise.catch(() => undefined /* ignore */).finally(() => discreteProgressRunner?.done());
				}

				if (typeof increment === 'number') {
					discreteProgressRunner.worked(increment);
				}
			}

			// Infinite
			else {
				discreteProgressRunner?.done();
				progressIndicator.showWhile(promise, options.delay);
			}

			return discreteProgressRunner;
		}

		const promise = task({
			report: progress => {
				updateProgress(progress);
			}
		});

		updateProgress(options.total);

		return promise;
	}

	private withDialogProgress<P extends Promise<R>, R = unknown>(options: IProgressDialogOptions, task: (progress: IProgress<IProgressStep>) => P, onDidCancel?: (choice?: number) => void): P {
		const disposables = new DisposableStore();

		let dialog: Dialog;
		let taskCompleted = false;

		const createDialog = (message: string) => {
			const buttons = options.buttons || [];
			if (!options.sticky) {
				buttons.push(options.cancellable
					? (typeof options.cancellable === 'boolean' ? localize('cancel', "Cancel") : options.cancellable)
					: localize('dismiss', "Dismiss")
				);
			}

			dialog = new Dialog(
				this.layoutService.activeContainer,
				message,
				buttons,
				createWorkbenchDialogOptions({
					type: 'pending',
					detail: options.detail,
					cancelId: buttons.length - 1,
					disableCloseAction: options.sticky,
					disableDefaultAction: options.sticky
				}, this.keybindingService, this.layoutService)
			);

			disposables.add(dialog);

			dialog.show().then(dialogResult => {
				// The dialog may close as a result of disposing it after the
				// task has completed. In that case, we do not want to trigger
				// the `onDidCancel` callback.
				// However, if the task is still running, this means that the
				// user has clicked the cancel button and we want to trigger
				// the `onDidCancel` callback.
				if (!taskCompleted) {
					onDidCancel?.(dialogResult.button);
				}
				dispose(dialog);
			});

			return dialog;
		};

		// In order to support the `delay` option, we use a scheduler
		// that will guard each access to the dialog behind a delay
		// that is either the original delay for one invocation and
		// otherwise runs without delay.
		let delay = options.delay ?? 0;
		let latestMessage: string | undefined = undefined;
		const scheduler = disposables.add(new RunOnceScheduler(() => {
			delay = 0; // since we have run once, we reset the delay

			if (latestMessage && !dialog) {
				dialog = createDialog(latestMessage);
			} else if (latestMessage) {
				dialog.updateMessage(latestMessage);
			}
		}, 0));

		const updateDialog = function (message?: string): void {
			latestMessage = message;

			// Make sure to only run one dialog update and not multiple
			if (!scheduler.isScheduled()) {
				scheduler.schedule(delay);
			}
		};

		const promise = task({
			report: progress => {
				updateDialog(progress.message);
			}
		});

		promise.finally(() => {
			taskCompleted = true;
			dispose(disposables);
		});

		if (options.title) {
			updateDialog(options.title);
		}

		return promise;
	}
}

registerSingleton(IProgressService, ProgressService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/progress/browser/media/progressService.css]---
Location: vscode-main/src/vs/workbench/services/progress/browser/media/progressService.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .progress-badge > .badge-content::before {
	mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNSA3QzQuNzc2IDcgNSA3LjIyNCA1IDcuNUM1IDcuNzc2IDQuNzc2IDggNC41IDhIMy45MDIzNEM0LjQzMTM2IDguOTEzOTEgNS40MTkwNiA5LjUgNi41IDkuNUM3LjQ4MSA5LjUgOC4zOTk5MSA5LjAxODg3IDguOTYxOTEgOC4yMTM4N0M5LjEyMDkyIDcuOTg1OTEgOS40MzMyMiA3LjkzMjg2IDkuNjU4MiA4LjA4OTg0QzkuODg1MTQgOC4yNDY4NSA5Ljk0MDE4IDguNTYwMTMgOS43ODIyMyA4Ljc4NzExQzkuMDM0MjMgOS44NTkxMSA3LjgwOCAxMC41IDYuNSAxMC41QzUuMDM0MTQgMTAuNSAzLjY5NzA2IDkuNjkzMjcgMyA4LjQzODQ4VjkuNUMzIDkuNzc2IDIuNzc2IDEwIDIuNSAxMEMyLjIyNCAxMCAyIDkuNzc2IDIgOS41VjcuNUMyIDcuMjI0IDIuMjI0IDcgMi41IDdINC41WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYuNSAyLjVDNy45NjU4NSAyLjUgOS4zMDI5NCAzLjMwNjc0IDEwIDQuNTYxNTJWMy41QzEwIDMuMjI0MDEgMTAuMjI0IDMuMDAwMDIgMTAuNSAzQzEwLjc3NiAzIDExIDMuMjIzMDIgMTEgMy40OTkwMlY1LjQ5OTAyQzExIDUuNzc1MDEgMTAuNzc2IDUuOTk5MDIgMTAuNSA1Ljk5OTAySDguNUM4LjIyNDAzIDUuOTk5IDguMDAwMDEgNS43NzUgOCA1LjQ5OTAyQzggNS4yMjMwNCA4LjIyNDAyIDQuOTk5MDUgOC41IDQuOTk5MDJIOS4wOTc2NkM4LjU2ODYzIDQuMDg1MTEgNy41ODA5NCAzLjQ5OTAyIDYuNSAzLjQ5OTAyQzUuNTE5MDIgMy40OTkwNCA0LjYwMDA4IDMuOTgwMTcgNC4wMzgwOSA0Ljc4NTE2QzMuODc5MDcgNS4wMTIwOCAzLjU2NTc3IDUuMDY1MTYgMy4zNDE4IDQuOTA5MThDMy4xMTQ4OCA0Ljc1MjE3IDMuMDU5ODQgNC40Mzk4NiAzLjIxNzc3IDQuMjEyODlDMy45NjU3NyAzLjE0MDkgNS4xOTIwMiAyLjUwMDAxIDYuNSAyLjVaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==") no-repeat;
	-webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNSA3QzQuNzc2IDcgNSA3LjIyNCA1IDcuNUM1IDcuNzc2IDQuNzc2IDggNC41IDhIMy45MDIzNEM0LjQzMTM2IDguOTEzOTEgNS40MTkwNiA5LjUgNi41IDkuNUM3LjQ4MSA5LjUgOC4zOTk5MSA5LjAxODg3IDguOTYxOTEgOC4yMTM4N0M5LjEyMDkyIDcuOTg1OTEgOS40MzMyMiA3LjkzMjg2IDkuNjU4MiA4LjA4OTg0QzkuODg1MTQgOC4yNDY4NSA5Ljk0MDE4IDguNTYwMTMgOS43ODIyMyA4Ljc4NzExQzkuMDM0MjMgOS44NTkxMSA3LjgwOCAxMC41IDYuNSAxMC41QzUuMDM0MTQgMTAuNSAzLjY5NzA2IDkuNjkzMjcgMyA4LjQzODQ4VjkuNUMzIDkuNzc2IDIuNzc2IDEwIDIuNSAxMEMyLjIyNCAxMCAyIDkuNzc2IDIgOS41VjcuNUMyIDcuMjI0IDIuMjI0IDcgMi41IDdINC41WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYuNSAyLjVDNy45NjU4NSAyLjUgOS4zMDI5NCAzLjMwNjc0IDEwIDQuNTYxNTJWMy41QzEwIDMuMjI0MDEgMTAuMjI0IDMuMDAwMDIgMTAuNSAzQzEwLjc3NiAzIDExIDMuMjIzMDIgMTEgMy40OTkwMlY1LjQ5OTAyQzExIDUuNzc1MDEgMTAuNzc2IDUuOTk5MDIgMTAuNSA1Ljk5OTAySDguNUM4LjIyNDAzIDUuOTk5IDguMDAwMDEgNS43NzUgOCA1LjQ5OTAyQzggNS4yMjMwNCA4LjIyNDAyIDQuOTk5MDUgOC41IDQuOTk5MDJIOS4wOTc2NkM4LjU2ODYzIDQuMDg1MTEgNy41ODA5NCAzLjQ5OTAyIDYuNSAzLjQ5OTAyQzUuNTE5MDIgMy40OTkwNCA0LjYwMDA4IDMuOTgwMTcgNC4wMzgwOSA0Ljc4NTE2QzMuODc5MDcgNS4wMTIwOCAzLjU2NTc3IDUuMDY1MTYgMy4zNDE4IDQuOTA5MThDMy4xMTQ4OCA0Ljc1MjE3IDMuMDU5ODQgNC40Mzk4NiAzLjIxNzc3IDQuMjEyODlDMy45NjU3NyAzLjE0MDkgNS4xOTIwMiAyLjUwMDAxIDYuNSAyLjVaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==") no-repeat;
	width: 13px;
	height: 13px;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	background-color: currentColor;
	content: '';
	background-repeat: no-repeat;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/progress/test/browser/progressIndicator.test.ts]---
Location: vscode-main/src/vs/workbench/services/progress/test/browser/progressIndicator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AbstractProgressScope, ScopedProgressIndicator } from '../../browser/progressIndicator.js';
import { ProgressBar } from '../../../../../base/browser/ui/progressbar/progressbar.js';

class TestProgressBar extends ProgressBar {
	fTotal: number = 0;
	fWorked: number = 0;
	fInfinite: boolean = false;
	fDone: boolean = false;

	override infinite() {
		this.fDone = null!;
		this.fInfinite = true;

		return this;
	}

	override total(total: number) {
		this.fDone = null!;
		this.fTotal = total;

		return this;
	}

	override hasTotal() {
		return !!this.fTotal;
	}

	override worked(worked: number) {
		this.fDone = null!;

		if (this.fWorked) {
			this.fWorked += worked;
		} else {
			this.fWorked = worked;
		}

		return this;
	}

	override done() {
		this.fDone = true;

		this.fInfinite = null!;
		this.fWorked = null!;
		this.fTotal = null!;

		return this;
	}

	override stop() {
		return this.done();
	}

	override show(): void { }

	override hide(): void { }
}

suite('Progress Indicator', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('ScopedProgressIndicator', async () => {
		const testProgressBar = disposables.add(new TestProgressBar(document.createElement('div')));
		const progressScope = disposables.add(new class extends AbstractProgressScope {
			constructor() { super('test.scopeId', true); }
			testOnScopeOpened(scopeId: string) { super.onScopeOpened(scopeId); }
			testOnScopeClosed(scopeId: string): void { super.onScopeClosed(scopeId); }
		}());
		const testObject = disposables.add(new ScopedProgressIndicator(testProgressBar, progressScope));

		// Active: Show (Infinite)
		let fn = testObject.show(true);
		assert.strictEqual(true, testProgressBar.fInfinite);
		fn.done();
		assert.strictEqual(true, testProgressBar.fDone);

		// Active: Show (Total / Worked)
		fn = testObject.show(100);
		assert.strictEqual(false, !!testProgressBar.fInfinite);
		assert.strictEqual(100, testProgressBar.fTotal);
		fn.worked(20);
		assert.strictEqual(20, testProgressBar.fWorked);
		fn.total(80);
		assert.strictEqual(80, testProgressBar.fTotal);
		fn.done();
		assert.strictEqual(true, testProgressBar.fDone);

		// Inactive: Show (Infinite)
		progressScope.testOnScopeClosed('test.scopeId');
		testObject.show(true);
		assert.strictEqual(false, !!testProgressBar.fInfinite);
		progressScope.testOnScopeOpened('test.scopeId');
		assert.strictEqual(true, testProgressBar.fInfinite);

		// Inactive: Show (Total / Worked)
		progressScope.testOnScopeClosed('test.scopeId');
		fn = testObject.show(100);
		fn.total(80);
		fn.worked(20);
		assert.strictEqual(false, !!testProgressBar.fTotal);
		progressScope.testOnScopeOpened('test.scopeId');
		assert.strictEqual(20, testProgressBar.fWorked);
		assert.strictEqual(80, testProgressBar.fTotal);

		// Acive: Show While
		let p = Promise.resolve(null);
		await testObject.showWhile(p);
		assert.strictEqual(true, testProgressBar.fDone);
		progressScope.testOnScopeClosed('test.scopeId');
		p = Promise.resolve(null);
		await testObject.showWhile(p);
		assert.strictEqual(true, testProgressBar.fDone);
		progressScope.testOnScopeOpened('test.scopeId');
		assert.strictEqual(true, testProgressBar.fDone);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/quickinput/browser/quickInputService.ts]---
Location: vscode-main/src/vs/workbench/services/quickinput/browser/quickInputService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { QuickInputController } from '../../../../platform/quickinput/browser/quickInputController.js';
import { QuickInputService as BaseQuickInputService } from '../../../../platform/quickinput/browser/quickInputService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { InQuickPickContextKey } from '../../../browser/quickaccess.js';

export class QuickInputService extends BaseQuickInputService {

	private readonly inQuickInputContext = InQuickPickContextKey.bindTo(this.contextKeyService);

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ILayoutService layoutService: ILayoutService,
	) {
		super(instantiationService, contextKeyService, themeService, layoutService, configurationService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.onShow(() => this.inQuickInputContext.set(true)));
		this._register(this.onHide(() => this.inQuickInputContext.set(false)));
	}

	protected override createController(): QuickInputController {
		return super.createController(this.layoutService, {
			ignoreFocusOut: () => !this.configurationService.getValue('workbench.quickOpen.closeOnFocusLost'),
			backKeybindingLabel: () => this.keybindingService.lookupKeybinding('workbench.action.quickInputBack')?.getLabel() || undefined,
		});
	}
}

registerSingleton(IQuickInputService, QuickInputService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/browser/browserRemoteResourceHandler.ts]---
Location: vscode-main/src/vs/workbench/services/remote/browser/browserRemoteResourceHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getMediaOrTextMime } from '../../../../base/common/mime.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IFileContent, IFileService } from '../../../../platform/files/common/files.js';
import { IRemoteResourceProvider, IResourceUriProvider } from '../../../browser/web.api.js';

export class BrowserRemoteResourceLoader extends Disposable {
	constructor(
		@IFileService fileService: IFileService,
		private readonly provider: IRemoteResourceProvider,
	) {
		super();

		this._register(provider.onDidReceiveRequest(async request => {
			let uri: UriComponents;
			try {
				uri = JSON.parse(decodeURIComponent(request.uri.query));
			} catch {
				return request.respondWith(404, new Uint8Array(), {});
			}

			let content: IFileContent;
			try {
				content = await fileService.readFile(URI.from(uri, true));
			} catch (e) {
				const str = VSBuffer.fromString(e.message).buffer;
				if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
					return request.respondWith(404, str, {});
				} else {
					return request.respondWith(500, str, {});
				}
			}

			const mime = uri.path && getMediaOrTextMime(uri.path);
			request.respondWith(200, content.value.buffer, mime ? { 'content-type': mime } : {});
		}));
	}

	public getResourceUriProvider(): IResourceUriProvider {
		const baseUri = URI.parse(document.location.href);
		return uri => baseUri.with({
			path: this.provider.path,
			query: JSON.stringify(uri),
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/browser/remoteAgentService.ts]---
Location: vscode-main/src/vs/workbench/services/remote/browser/remoteAgentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IRemoteAgentService } from '../common/remoteAgentService.js';
import { IRemoteAuthorityResolverService, RemoteAuthorityResolverError } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { AbstractRemoteAgentService } from '../common/abstractRemoteAgentService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ISignService } from '../../../../platform/sign/common/sign.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IHostService } from '../../host/browser/host.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IRemoteSocketFactoryService } from '../../../../platform/remote/common/remoteSocketFactoryService.js';

export class RemoteAgentService extends AbstractRemoteAgentService implements IRemoteAgentService {

	constructor(
		@IRemoteSocketFactoryService remoteSocketFactoryService: IRemoteSocketFactoryService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ISignService signService: ISignService,
		@ILogService logService: ILogService
	) {
		super(remoteSocketFactoryService, userDataProfileService, environmentService, productService, remoteAuthorityResolverService, signService, logService);
	}
}

class RemoteConnectionFailureNotificationContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.browserRemoteConnectionFailureNotification';

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IHostService private readonly _hostService: IHostService,
	) {
		// Let's cover the case where connecting to fetch the remote extension info fails
		remoteAgentService.getRawEnvironment()
			.then(undefined, (err) => {
				if (!RemoteAuthorityResolverError.isHandled(err)) {
					this._presentConnectionError(err);
				}
			});
	}

	private async _presentConnectionError(err: Error): Promise<void> {
		await this._dialogService.prompt({
			type: Severity.Error,
			message: nls.localize('connectionError', "An unexpected error occurred that requires a reload of this page."),
			detail: nls.localize('connectionErrorDetail', "The workbench failed to connect to the server (Error: {0})", err ? err.message : ''),
			buttons: [
				{
					label: nls.localize({ key: 'reload', comment: ['&& denotes a mnemonic'] }, "&&Reload"),
					run: () => this._hostService.reload()
				}
			]
		});
	}

}

registerWorkbenchContribution2(RemoteConnectionFailureNotificationContribution.ID, RemoteConnectionFailureNotificationContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/abstractRemoteAgentService.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/abstractRemoteAgentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IChannel, IServerChannel, getDelayedChannel, IPCLogger } from '../../../../base/parts/ipc/common/ipc.js';
import { Client } from '../../../../base/parts/ipc/common/ipc.net.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { connectRemoteAgentManagement, IConnectionOptions, ManagementPersistentConnection, PersistentConnectionEvent } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IExtensionHostExitInfo, IRemoteAgentConnection, IRemoteAgentService } from './remoteAgentService.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { RemoteAgentConnectionContext, IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { RemoteExtensionEnvironmentChannelClient } from './remoteAgentEnvironmentChannel.js';
import { IDiagnosticInfoOptions, IDiagnosticInfo } from '../../../../platform/diagnostics/common/diagnostics.js';
import { Emitter } from '../../../../base/common/event.js';
import { ISignService } from '../../../../platform/sign/common/sign.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITelemetryData, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IRemoteSocketFactoryService } from '../../../../platform/remote/common/remoteSocketFactoryService.js';

export abstract class AbstractRemoteAgentService extends Disposable implements IRemoteAgentService {

	declare readonly _serviceBrand: undefined;

	private readonly _connection: IRemoteAgentConnection | null;
	private _environment: Promise<IRemoteAgentEnvironment | null> | null;

	constructor(
		@IRemoteSocketFactoryService private readonly remoteSocketFactoryService: IRemoteSocketFactoryService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IWorkbenchEnvironmentService protected readonly _environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ISignService signService: ISignService,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		if (this._environmentService.remoteAuthority) {
			this._connection = this._register(new RemoteAgentConnection(this._environmentService.remoteAuthority, productService.commit, productService.quality, this.remoteSocketFactoryService, this._remoteAuthorityResolverService, signService, this._logService));
		} else {
			this._connection = null;
		}
		this._environment = null;
	}

	getConnection(): IRemoteAgentConnection | null {
		return this._connection;
	}

	getEnvironment(): Promise<IRemoteAgentEnvironment | null> {
		return this.getRawEnvironment().then(undefined, () => null);
	}

	getRawEnvironment(): Promise<IRemoteAgentEnvironment | null> {
		if (!this._environment) {
			this._environment = this._withChannel(
				async (channel, connection) => {
					const env = await RemoteExtensionEnvironmentChannelClient.getEnvironmentData(channel, connection.remoteAuthority, this.userDataProfileService.currentProfile.isDefault ? undefined : this.userDataProfileService.currentProfile.id);
					this._remoteAuthorityResolverService._setAuthorityConnectionToken(connection.remoteAuthority, env.connectionToken);
					if (typeof env.reconnectionGraceTime === 'number') {
						this._logService.info(`[reconnection-grace-time] Client received grace time from server: ${env.reconnectionGraceTime}ms (${Math.floor(env.reconnectionGraceTime / 1000)}s)`);
						connection.updateGraceTime(env.reconnectionGraceTime);
					} else {
						this._logService.info(`[reconnection-grace-time] Server did not provide grace time, using default`);
					}
					return env;
				},
				null
			);
		}
		return this._environment;
	}

	getExtensionHostExitInfo(reconnectionToken: string): Promise<IExtensionHostExitInfo | null> {
		return this._withChannel(
			(channel, connection) => RemoteExtensionEnvironmentChannelClient.getExtensionHostExitInfo(channel, connection.remoteAuthority, reconnectionToken),
			null
		);
	}

	getDiagnosticInfo(options: IDiagnosticInfoOptions): Promise<IDiagnosticInfo | undefined> {
		return this._withChannel(
			channel => RemoteExtensionEnvironmentChannelClient.getDiagnosticInfo(channel, options),
			undefined
		);
	}

	updateTelemetryLevel(telemetryLevel: TelemetryLevel): Promise<void> {
		return this._withTelemetryChannel(
			channel => RemoteExtensionEnvironmentChannelClient.updateTelemetryLevel(channel, telemetryLevel),
			undefined
		);
	}

	logTelemetry(eventName: string, data: ITelemetryData): Promise<void> {
		return this._withTelemetryChannel(
			channel => RemoteExtensionEnvironmentChannelClient.logTelemetry(channel, eventName, data),
			undefined
		);
	}

	flushTelemetry(): Promise<void> {
		return this._withTelemetryChannel(
			channel => RemoteExtensionEnvironmentChannelClient.flushTelemetry(channel),
			undefined
		);
	}

	getRoundTripTime(): Promise<number | undefined> {
		return this._withTelemetryChannel(
			async channel => {
				const start = Date.now();
				await RemoteExtensionEnvironmentChannelClient.ping(channel);
				return Date.now() - start;
			},
			undefined
		);
	}

	async endConnection(): Promise<void> {
		if (this._connection) {
			await this._connection.end();
			this._connection.dispose();
		}
	}

	private _withChannel<R>(callback: (channel: IChannel, connection: IRemoteAgentConnection) => Promise<R>, fallback: R): Promise<R> {
		const connection = this.getConnection();
		if (!connection) {
			return Promise.resolve(fallback);
		}
		return connection.withChannel('remoteextensionsenvironment', (channel) => callback(channel, connection));
	}

	private _withTelemetryChannel<R>(callback: (channel: IChannel, connection: IRemoteAgentConnection) => Promise<R>, fallback: R): Promise<R> {
		const connection = this.getConnection();
		if (!connection) {
			return Promise.resolve(fallback);
		}
		return connection.withChannel('telemetry', (channel) => callback(channel, connection));
	}

}

class RemoteAgentConnection extends Disposable implements IRemoteAgentConnection {

	private readonly _onReconnecting = this._register(new Emitter<void>());
	public readonly onReconnecting = this._onReconnecting.event;

	private readonly _onDidStateChange = this._register(new Emitter<PersistentConnectionEvent>());
	public readonly onDidStateChange = this._onDidStateChange.event;

	readonly remoteAuthority: string;
	private _connection: Promise<Client<RemoteAgentConnectionContext>> | null;
	private _managementConnection: ManagementPersistentConnection | null = null;

	private _initialConnectionMs: number | undefined;

	constructor(
		remoteAuthority: string,
		private readonly _commit: string | undefined,
		private readonly _quality: string | undefined,
		private readonly _remoteSocketFactoryService: IRemoteSocketFactoryService,
		private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		private readonly _signService: ISignService,
		private readonly _logService: ILogService
	) {
		super();
		this.remoteAuthority = remoteAuthority;
		this._connection = null;
	}

	end: () => Promise<void> = () => Promise.resolve();

	getChannel<T extends IChannel>(channelName: string): T {
		return <T>getDelayedChannel(this._getOrCreateConnection().then(c => c.getChannel(channelName)));
	}

	withChannel<T extends IChannel, R>(channelName: string, callback: (channel: T) => Promise<R>): Promise<R> {
		const channel = this.getChannel<T>(channelName);
		const result = callback(channel);
		return result;
	}

	registerChannel<T extends IServerChannel<RemoteAgentConnectionContext>>(channelName: string, channel: T): void {
		this._getOrCreateConnection().then(client => client.registerChannel(channelName, channel));
	}

	async getInitialConnectionTimeMs() {
		try {
			await this._getOrCreateConnection();
		} catch {
			// ignored -- time is measured even if connection fails
		}

		return this._initialConnectionMs!;
	}

	getManagementConnection(): ManagementPersistentConnection | null {
		return this._managementConnection;
	}

	updateGraceTime(graceTime: number): void {
		if (this._managementConnection) {
			this._managementConnection.updateGraceTime(graceTime);
		}
	}

	private _getOrCreateConnection(): Promise<Client<RemoteAgentConnectionContext>> {
		if (!this._connection) {
			this._connection = this._createConnection();
		}
		return this._connection;
	}

	private async _createConnection(): Promise<Client<RemoteAgentConnectionContext>> {
		let firstCall = true;
		const options: IConnectionOptions = {
			commit: this._commit,
			quality: this._quality,
			addressProvider: {
				getAddress: async () => {
					if (firstCall) {
						firstCall = false;
					} else {
						this._onReconnecting.fire(undefined);
					}
					const { authority } = await this._remoteAuthorityResolverService.resolveAuthority(this.remoteAuthority);
					return { connectTo: authority.connectTo, connectionToken: authority.connectionToken };
				}
			},
			remoteSocketFactoryService: this._remoteSocketFactoryService,
			signService: this._signService,
			logService: this._logService,
			ipcLogger: false ? new IPCLogger(`Local \u2192 Remote`, `Remote \u2192 Local`) : null
		};
		let connection: ManagementPersistentConnection;
		const start = Date.now();
		try {
			connection = this._register(await connectRemoteAgentManagement(options, this.remoteAuthority, `renderer`));
			this._managementConnection = connection;
		} finally {
			this._initialConnectionMs = Date.now() - start;
		}

		connection.protocol.onDidDispose(() => {
			connection.dispose();
		});
		this.end = () => {
			connection.protocol.sendDisconnect();
			return connection.protocol.drain();
		};
		this._register(connection.onDidStateChange(e => this._onDidStateChange.fire(e)));
		return connection.client;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/remoteAgentEnvironmentChannel.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/remoteAgentEnvironmentChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as platform from '../../../../base/common/platform.js';
import * as performance from '../../../../base/common/performance.js';
import { URI, UriComponents, UriDto } from '../../../../base/common/uri.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IDiagnosticInfoOptions, IDiagnosticInfo } from '../../../../platform/diagnostics/common/diagnostics.js';
import { ITelemetryData, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IExtensionHostExitInfo } from './remoteAgentService.js';
import { revive } from '../../../../base/common/marshalling.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { ProtocolConstants } from '../../../../base/parts/ipc/common/ipc.net.js';

export interface IGetEnvironmentDataArguments {
	remoteAuthority: string;
	profile?: string;
}

export interface IGetExtensionHostExitInfoArguments {
	remoteAuthority: string;
	reconnectionToken: string;
}

export interface IRemoteAgentEnvironmentDTO {
	pid: number;
	connectionToken: string;
	appRoot: UriComponents;
	settingsPath: UriComponents;
	mcpResource: UriComponents;
	logsPath: UriComponents;
	extensionHostLogsPath: UriComponents;
	globalStorageHome: UriComponents;
	workspaceStorageHome: UriComponents;
	localHistoryHome: UriComponents;
	userHome: UriComponents;
	os: platform.OperatingSystem;
	arch: string;
	marks: performance.PerformanceMark[];
	useHostProxy: boolean;
	profiles: {
		all: UriDto<IUserDataProfile[]>;
		home: UriComponents;
	};
	isUnsupportedGlibc: boolean;
	reconnectionGraceTime?: number;
}

export class RemoteExtensionEnvironmentChannelClient {

	static async getEnvironmentData(channel: IChannel, remoteAuthority: string, profile: string | undefined): Promise<IRemoteAgentEnvironment> {
		const args: IGetEnvironmentDataArguments = {
			remoteAuthority,
			profile
		};

		const data = await channel.call<IRemoteAgentEnvironmentDTO>('getEnvironmentData', args);
		const reconnectionGraceTime = (typeof data.reconnectionGraceTime === 'number' && data.reconnectionGraceTime >= 0)
			? data.reconnectionGraceTime
			: ProtocolConstants.ReconnectionGraceTime;

		return {
			pid: data.pid,
			connectionToken: data.connectionToken,
			appRoot: URI.revive(data.appRoot),
			settingsPath: URI.revive(data.settingsPath),
			mcpResource: URI.revive(data.mcpResource),
			logsPath: URI.revive(data.logsPath),
			extensionHostLogsPath: URI.revive(data.extensionHostLogsPath),
			globalStorageHome: URI.revive(data.globalStorageHome),
			workspaceStorageHome: URI.revive(data.workspaceStorageHome),
			localHistoryHome: URI.revive(data.localHistoryHome),
			userHome: URI.revive(data.userHome),
			os: data.os,
			arch: data.arch,
			marks: data.marks,
			useHostProxy: data.useHostProxy,
			profiles: revive(data.profiles),
			isUnsupportedGlibc: data.isUnsupportedGlibc,
			reconnectionGraceTime
		};
	}

	static async getExtensionHostExitInfo(channel: IChannel, remoteAuthority: string, reconnectionToken: string): Promise<IExtensionHostExitInfo | null> {
		const args: IGetExtensionHostExitInfoArguments = {
			remoteAuthority,
			reconnectionToken
		};
		return channel.call<IExtensionHostExitInfo | null>('getExtensionHostExitInfo', args);
	}

	static getDiagnosticInfo(channel: IChannel, options: IDiagnosticInfoOptions): Promise<IDiagnosticInfo> {
		return channel.call<IDiagnosticInfo>('getDiagnosticInfo', options);
	}

	static updateTelemetryLevel(channel: IChannel, telemetryLevel: TelemetryLevel): Promise<void> {
		return channel.call<void>('updateTelemetryLevel', { telemetryLevel });
	}

	static logTelemetry(channel: IChannel, eventName: string, data: ITelemetryData): Promise<void> {
		return channel.call<void>('logTelemetry', { eventName, data });
	}

	static flushTelemetry(channel: IChannel): Promise<void> {
		return channel.call<void>('flushTelemetry');
	}

	static async ping(channel: IChannel): Promise<void> {
		await channel.call<void>('ping');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/remoteAgentService.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/remoteAgentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { RemoteAgentConnectionContext, IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IChannel, IServerChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IDiagnosticInfoOptions, IDiagnosticInfo } from '../../../../platform/diagnostics/common/diagnostics.js';
import { Event } from '../../../../base/common/event.js';
import { PersistentConnectionEvent } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { ITelemetryData, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { timeout } from '../../../../base/common/async.js';

export const IRemoteAgentService = createDecorator<IRemoteAgentService>('remoteAgentService');

export interface IRemoteAgentService {
	readonly _serviceBrand: undefined;

	getConnection(): IRemoteAgentConnection | null;
	/**
	 * Get the remote environment. In case of an error, returns `null`.
	 */
	getEnvironment(): Promise<IRemoteAgentEnvironment | null>;
	/**
	 * Get the remote environment. Can return an error.
	 */
	getRawEnvironment(): Promise<IRemoteAgentEnvironment | null>;
	/**
	 * Get exit information for a remote extension host.
	 */
	getExtensionHostExitInfo(reconnectionToken: string): Promise<IExtensionHostExitInfo | null>;

	/**
	 * Gets the round trip time from the remote extension host. Note that this
	 * may be delayed if the extension host is busy.
	 */
	getRoundTripTime(): Promise<number | undefined>;

	/**
	 * Gracefully ends the current connection, if any.
	 */
	endConnection(): Promise<void>;

	getDiagnosticInfo(options: IDiagnosticInfoOptions): Promise<IDiagnosticInfo | undefined>;
	updateTelemetryLevel(telemetryLevel: TelemetryLevel): Promise<void>;
	logTelemetry(eventName: string, data?: ITelemetryData): Promise<void>;
	flushTelemetry(): Promise<void>;
}

export interface IExtensionHostExitInfo {
	code: number;
	signal: string;
}

export interface IRemoteAgentConnection {
	readonly remoteAuthority: string;

	readonly onReconnecting: Event<void>;
	readonly onDidStateChange: Event<PersistentConnectionEvent>;

	end(): Promise<void>;
	dispose(): void;
	getChannel<T extends IChannel>(channelName: string): T;
	withChannel<T extends IChannel, R>(channelName: string, callback: (channel: T) => Promise<R>): Promise<R>;
	registerChannel<T extends IServerChannel<RemoteAgentConnectionContext>>(channelName: string, channel: T): void;
	getInitialConnectionTimeMs(): Promise<number>;
	updateGraceTime(graceTime: number): void;
}

export interface IRemoteConnectionLatencyMeasurement {

	readonly initial: number | undefined;
	readonly current: number;
	readonly average: number;

	readonly high: boolean;
}

export const remoteConnectionLatencyMeasurer = new class {

	readonly maxSampleCount = 5;
	readonly sampleDelay = 2000;

	readonly initial: number[] = [];
	readonly maxInitialCount = 3;

	readonly average: number[] = [];
	readonly maxAverageCount = 100;

	readonly highLatencyMultiple = 2;
	readonly highLatencyMinThreshold = 500;
	readonly highLatencyMaxThreshold = 1500;

	lastMeasurement: IRemoteConnectionLatencyMeasurement | undefined = undefined;
	get latency() { return this.lastMeasurement; }

	async measure(remoteAgentService: IRemoteAgentService): Promise<IRemoteConnectionLatencyMeasurement | undefined> {
		let currentLatency = Infinity;

		// Measure up to samples count
		for (let i = 0; i < this.maxSampleCount; i++) {
			const rtt = await remoteAgentService.getRoundTripTime();
			if (rtt === undefined) {
				return undefined;
			}

			currentLatency = Math.min(currentLatency, rtt / 2 /* we want just one way, not round trip time */);
			await timeout(this.sampleDelay);
		}

		// Keep track of average latency
		this.average.push(currentLatency);
		if (this.average.length > this.maxAverageCount) {
			this.average.shift();
		}

		// Keep track of initial latency
		let initialLatency: number | undefined = undefined;
		if (this.initial.length < this.maxInitialCount) {
			this.initial.push(currentLatency);
		} else {
			initialLatency = this.initial.reduce((sum, value) => sum + value, 0) / this.initial.length;
		}

		// Remember as last measurement
		this.lastMeasurement = {
			initial: initialLatency,
			current: currentLatency,
			average: this.average.reduce((sum, value) => sum + value, 0) / this.average.length,
			high: (() => {

				// based on the initial, average and current latency, try to decide
				// if the connection has high latency
				// Some rules:
				// - we require the initial latency to be computed
				// - we only consider latency above highLatencyMinThreshold as potentially high
				// - we require the current latency to be above the average latency by a factor of highLatencyMultiple
				// - but not if the latency is actually above highLatencyMaxThreshold

				if (typeof initialLatency === 'undefined') {
					return false;
				}

				if (currentLatency > this.highLatencyMaxThreshold) {
					return true;
				}

				if (currentLatency > this.highLatencyMinThreshold && currentLatency > initialLatency * this.highLatencyMultiple) {
					return true;
				}

				return false;
			})()
		};

		return this.lastMeasurement;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/remoteExplorerService.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/remoteExplorerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITunnelService, RemoteTunnel, TunnelProtocol } from '../../../../platform/tunnel/common/tunnel.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IEditableData } from '../../../common/views.js';
import { TunnelInformation, TunnelPrivacy } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { URI } from '../../../../base/common/uri.js';
import { Attributes, CandidatePort, TunnelCloseReason, TunnelModel, TunnelProperties, TunnelSource } from './tunnelModel.js';
import { ExtensionsRegistry, IExtensionPointUser } from '../../extensions/common/extensionsRegistry.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

export const IRemoteExplorerService = createDecorator<IRemoteExplorerService>('remoteExplorerService');
export const REMOTE_EXPLORER_TYPE_KEY: string = 'remote.explorerType';
export const TUNNEL_VIEW_ID = '~remote.forwardedPorts';
export const TUNNEL_VIEW_CONTAINER_ID = '~remote.forwardedPortsContainer';
export const PORT_AUTO_FORWARD_SETTING = 'remote.autoForwardPorts';
export const PORT_AUTO_SOURCE_SETTING = 'remote.autoForwardPortsSource';
export const PORT_AUTO_FALLBACK_SETTING = 'remote.autoForwardPortsFallback';
export const PORT_AUTO_SOURCE_SETTING_PROCESS = 'process';
export const PORT_AUTO_SOURCE_SETTING_OUTPUT = 'output';
export const PORT_AUTO_SOURCE_SETTING_HYBRID = 'hybrid';

export enum TunnelType {
	Candidate = 'Candidate',
	Detected = 'Detected',
	Forwarded = 'Forwarded',
	Add = 'Add'
}

export interface ITunnelItem {
	tunnelType: TunnelType;
	remoteHost: string;
	remotePort: number;
	localAddress?: string;
	protocol: TunnelProtocol;
	localUri?: URI;
	localPort?: number;
	name?: string;
	closeable?: boolean;
	source: {
		source: TunnelSource;
		description: string;
	};
	privacy: TunnelPrivacy;
	processDescription?: string;
	readonly label: string;
}

export enum TunnelEditId {
	None = 0,
	New = 1,
	Label = 2,
	LocalPort = 3
}

export interface HelpInformation {
	extensionDescription: IExtensionDescription;
	getStarted?: string | { id: string };
	documentation?: string;
	issues?: string;
	reportIssue?: string;
	remoteName?: string[] | string;
	virtualWorkspace?: string;
}

const getStartedWalkthrough: IJSONSchema = {
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			description: nls.localize('getStartedWalkthrough.id', 'The ID of a Get Started walkthrough to open.'),
			type: 'string'
		},
	}
};

const remoteHelpExtPoint = ExtensionsRegistry.registerExtensionPoint<HelpInformation>({
	extensionPoint: 'remoteHelp',
	jsonSchema: {
		description: nls.localize('RemoteHelpInformationExtPoint', 'Contributes help information for Remote'),
		type: 'object',
		properties: {
			'getStarted': {
				description: nls.localize('RemoteHelpInformationExtPoint.getStarted', "The url, or a command that returns the url, to your project's Getting Started page, or a walkthrough ID contributed by your project's extension"),
				oneOf: [
					{ type: 'string' },
					getStartedWalkthrough
				]
			},
			'documentation': {
				description: nls.localize('RemoteHelpInformationExtPoint.documentation', "The url, or a command that returns the url, to your project's documentation page"),
				type: 'string'
			},
			'feedback': {
				description: nls.localize('RemoteHelpInformationExtPoint.feedback', "The url, or a command that returns the url, to your project's feedback reporter"),
				type: 'string',
				markdownDeprecationMessage: nls.localize('RemoteHelpInformationExtPoint.feedback.deprecated', "Use {0} instead", '`reportIssue`')
			},
			'reportIssue': {
				description: nls.localize('RemoteHelpInformationExtPoint.reportIssue', "The url, or a command that returns the url, to your project's issue reporter"),
				type: 'string'
			},
			'issues': {
				description: nls.localize('RemoteHelpInformationExtPoint.issues', "The url, or a command that returns the url, to your project's issues list"),
				type: 'string'
			}
		}
	}
});

export enum PortsEnablement {
	Disabled = 0,
	ViewOnly = 1,
	AdditionalFeatures = 2
}

export interface IRemoteExplorerService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeTargetType: Event<string[]>;
	targetType: string[];
	readonly onDidChangeHelpInformation: Event<readonly IExtensionPointUser<HelpInformation>[]>;
	helpInformation: IExtensionPointUser<HelpInformation>[];
	readonly tunnelModel: TunnelModel;
	readonly onDidChangeEditable: Event<{ tunnel: ITunnelItem; editId: TunnelEditId } | undefined>;
	setEditable(tunnelItem: ITunnelItem | undefined, editId: TunnelEditId, data: IEditableData | null): void;
	getEditableData(tunnelItem: ITunnelItem | undefined, editId?: TunnelEditId): IEditableData | undefined;
	forward(tunnelProperties: TunnelProperties, attributes?: Attributes | null): Promise<RemoteTunnel | string | undefined>;
	close(remote: { host: string; port: number }, reason: TunnelCloseReason): Promise<void>;
	setTunnelInformation(tunnelInformation: TunnelInformation | undefined): void;
	setCandidateFilter(filter: ((candidates: CandidatePort[]) => Promise<CandidatePort[]>) | undefined): IDisposable;
	onFoundNewCandidates(candidates: CandidatePort[]): void;
	restore(): Promise<void>;
	enablePortsFeatures(viewOnly: boolean): void;
	readonly onEnabledPortsFeatures: Event<void>;
	portsFeaturesEnabled: PortsEnablement;
	readonly namedProcesses: Map<number, string>;
}

class RemoteExplorerService implements IRemoteExplorerService {
	public _serviceBrand: undefined;
	private _targetType: string[] = [];
	private readonly _onDidChangeTargetType: Emitter<string[]> = new Emitter<string[]>();
	public readonly onDidChangeTargetType: Event<string[]> = this._onDidChangeTargetType.event;
	private readonly _onDidChangeHelpInformation: Emitter<readonly IExtensionPointUser<HelpInformation>[]> = new Emitter();
	public readonly onDidChangeHelpInformation: Event<readonly IExtensionPointUser<HelpInformation>[]> = this._onDidChangeHelpInformation.event;
	private _helpInformation: IExtensionPointUser<HelpInformation>[] = [];
	private _tunnelModel: TunnelModel;
	private _editable: { tunnelItem: ITunnelItem | undefined; editId: TunnelEditId; data: IEditableData } | undefined;
	private readonly _onDidChangeEditable: Emitter<{ tunnel: ITunnelItem; editId: TunnelEditId } | undefined> = new Emitter();
	public readonly onDidChangeEditable: Event<{ tunnel: ITunnelItem; editId: TunnelEditId } | undefined> = this._onDidChangeEditable.event;
	private readonly _onEnabledPortsFeatures: Emitter<void> = new Emitter();
	public readonly onEnabledPortsFeatures: Event<void> = this._onEnabledPortsFeatures.event;
	private _portsFeaturesEnabled: PortsEnablement = PortsEnablement.Disabled;
	public readonly namedProcesses = new Map<number, string>();

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		this._tunnelModel = instantiationService.createInstance(TunnelModel);

		remoteHelpExtPoint.setHandler((extensions) => {
			this._helpInformation.push(...extensions);
			this._onDidChangeHelpInformation.fire(extensions);
		});
	}

	get helpInformation(): IExtensionPointUser<HelpInformation>[] {
		return this._helpInformation;
	}

	set targetType(name: string[]) {
		// Can just compare the first element of the array since there are no target overlaps
		const current: string = this._targetType.length > 0 ? this._targetType[0] : '';
		const newName: string = name.length > 0 ? name[0] : '';
		if (current !== newName) {
			this._targetType = name;
			this.storageService.store(REMOTE_EXPLORER_TYPE_KEY, this._targetType.toString(), StorageScope.WORKSPACE, StorageTarget.MACHINE);
			this.storageService.store(REMOTE_EXPLORER_TYPE_KEY, this._targetType.toString(), StorageScope.PROFILE, StorageTarget.USER);
			this._onDidChangeTargetType.fire(this._targetType);
		}
	}
	get targetType(): string[] {
		return this._targetType;
	}

	get tunnelModel(): TunnelModel {
		return this._tunnelModel;
	}

	forward(tunnelProperties: TunnelProperties, attributes?: Attributes | null): Promise<RemoteTunnel | string | undefined> {
		return this.tunnelModel.forward(tunnelProperties, attributes);
	}

	close(remote: { host: string; port: number }, reason: TunnelCloseReason): Promise<void> {
		return this.tunnelModel.close(remote.host, remote.port, reason);
	}

	setTunnelInformation(tunnelInformation: TunnelInformation | undefined): void {
		if (tunnelInformation?.features) {
			this.tunnelService.setTunnelFeatures(tunnelInformation.features);
		}
		this.tunnelModel.addEnvironmentTunnels(tunnelInformation?.environmentTunnels);
	}

	setEditable(tunnelItem: ITunnelItem | undefined, editId: TunnelEditId, data: IEditableData | null): void {
		if (!data) {
			this._editable = undefined;
		} else {
			this._editable = { tunnelItem, data, editId };
		}
		this._onDidChangeEditable.fire(tunnelItem ? { tunnel: tunnelItem, editId } : undefined);
	}

	getEditableData(tunnelItem: ITunnelItem | undefined, editId: TunnelEditId): IEditableData | undefined {
		return (this._editable &&
			((!tunnelItem && (tunnelItem === this._editable.tunnelItem)) ||
				(tunnelItem && (this._editable.tunnelItem?.remotePort === tunnelItem.remotePort) && (this._editable.tunnelItem.remoteHost === tunnelItem.remoteHost)
					&& (this._editable.editId === editId)))) ?
			this._editable.data : undefined;
	}

	setCandidateFilter(filter: (candidates: CandidatePort[]) => Promise<CandidatePort[]>): IDisposable {
		if (!filter) {
			return {
				dispose: () => { }
			};
		}
		this.tunnelModel.setCandidateFilter(filter);
		return {
			dispose: () => {
				this.tunnelModel.setCandidateFilter(undefined);
			}
		};
	}

	onFoundNewCandidates(candidates: CandidatePort[]): void {
		this.tunnelModel.setCandidates(candidates);
	}

	restore(): Promise<void> {
		return this.tunnelModel.restoreForwarded();
	}

	enablePortsFeatures(viewOnly: boolean): void {
		this._portsFeaturesEnabled = viewOnly ? PortsEnablement.ViewOnly : PortsEnablement.AdditionalFeatures;
		this._onEnabledPortsFeatures.fire();
	}

	get portsFeaturesEnabled(): PortsEnablement {
		return this._portsFeaturesEnabled;
	}
}

registerSingleton(IRemoteExplorerService, RemoteExplorerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/remoteExtensionsScanner.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/remoteExtensionsScanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRemoteAgentService } from './remoteAgentService.js';
import { IRemoteExtensionsScannerService, RemoteExtensionsScannerChannelName } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import * as platform from '../../../../base/common/platform.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IActiveLanguagePackService } from '../../localization/common/locale.js';
import { IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { Mutable } from '../../../../base/common/types.js';
import { InstallExtensionSummary } from '../../../../platform/extensionManagement/common/extensionManagement.js';

class RemoteExtensionsScannerService implements IRemoteExtensionsScannerService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IRemoteUserDataProfilesService private readonly remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IActiveLanguagePackService private readonly activeLanguagePackService: IActiveLanguagePackService,
		@IWorkbenchExtensionManagementService private readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@ILogService private readonly logService: ILogService,
	) { }

	whenExtensionsReady(): Promise<InstallExtensionSummary> {
		return this.withChannel(
			channel => channel.call<InstallExtensionSummary>('whenExtensionsReady'),
			{ failed: [] }
		);
	}

	async scanExtensions(): Promise<IExtensionDescription[]> {
		try {
			const languagePack = await this.activeLanguagePackService.getExtensionIdProvidingCurrentLocale();
			return await this.withChannel(
				async (channel) => {
					const profileLocation = this.userDataProfileService.currentProfile.isDefault ? undefined : (await this.remoteUserDataProfilesService.getRemoteProfile(this.userDataProfileService.currentProfile)).extensionsResource;
					const scannedExtensions = await channel.call<Mutable<IExtensionDescription>[]>('scanExtensions', [
						platform.language,
						profileLocation,
						this.extensionManagementService.getInstalledWorkspaceExtensionLocations(),
						this.environmentService.extensionDevelopmentLocationURI,
						languagePack
					]);
					scannedExtensions.forEach((extension) => {
						extension.extensionLocation = URI.revive(extension.extensionLocation);
					});
					return scannedExtensions;
				},
				[]
			);
		} catch (error) {
			this.logService.error(error);
			return [];
		}
	}

	private withChannel<R>(callback: (channel: IChannel) => Promise<R>, fallback: R): Promise<R> {
		const connection = this.remoteAgentService.getConnection();
		if (!connection) {
			return Promise.resolve(fallback);
		}
		return connection.withChannel(RemoteExtensionsScannerChannelName, (channel) => callback(channel));
	}
}

registerSingleton(IRemoteExtensionsScannerService, RemoteExtensionsScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/remote/common/remoteFileSystemProviderClient.ts]---
Location: vscode-main/src/vs/workbench/services/remote/common/remoteFileSystemProviderClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getErrorMessage } from '../../../../base/common/errors.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { DiskFileSystemProviderClient } from '../../../../platform/files/common/diskFileSystemProviderClient.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IRemoteAgentConnection, IRemoteAgentService } from './remoteAgentService.js';

export const REMOTE_FILE_SYSTEM_CHANNEL_NAME = 'remoteFilesystem';

export class RemoteFileSystemProviderClient extends DiskFileSystemProviderClient {

	static register(remoteAgentService: IRemoteAgentService, fileService: IFileService, logService: ILogService): IDisposable {
		const connection = remoteAgentService.getConnection();
		if (!connection) {
			return Disposable.None;
		}

		const disposables = new DisposableStore();

		const environmentPromise = (async () => {
			try {
				const environment = await remoteAgentService.getRawEnvironment();
				if (environment) {
					// Register remote fsp even before it is asked to activate
					// because, some features (configuration) wait for its
					// registration before making fs calls.
					fileService.registerProvider(Schemas.vscodeRemote, disposables.add(new RemoteFileSystemProviderClient(environment, connection)));
				} else {
					logService.error('Cannot register remote filesystem provider. Remote environment doesnot exist.');
				}
			} catch (error) {
				logService.error('Cannot register remote filesystem provider. Error while fetching remote environment.', getErrorMessage(error));
			}
		})();

		disposables.add(fileService.onWillActivateFileSystemProvider(e => {
			if (e.scheme === Schemas.vscodeRemote) {
				e.join(environmentPromise);
			}
		}));

		return disposables;
	}

	private constructor(remoteAgentEnvironment: IRemoteAgentEnvironment, connection: IRemoteAgentConnection) {
		super(connection.getChannel(REMOTE_FILE_SYSTEM_CHANNEL_NAME), { pathCaseSensitive: remoteAgentEnvironment.os === OperatingSystem.Linux });
	}
}
```

--------------------------------------------------------------------------------

````

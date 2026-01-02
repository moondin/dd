---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 264
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 264 of 552)

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

---[FILE: src/vs/platform/configuration/test/common/configurationModels.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/configurationModels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ResourceMap } from '../../../../base/common/map.js';
import { join } from '../../../../base/common/path.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Configuration, ConfigurationChangeEvent, ConfigurationModel, ConfigurationModelParser, mergeChanges } from '../../common/configurationModels.js';
import { IConfigurationRegistry, Extensions, ConfigurationScope, IConfigurationNode } from '../../common/configurationRegistry.js';
import { NullLogService } from '../../../log/common/log.js';
import { Registry } from '../../../registry/common/platform.js';
import { WorkspaceFolder } from '../../../workspace/common/workspace.js';
import { Workspace } from '../../../workspace/test/common/testWorkspace.js';

suite('ConfigurationModelParser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(() => {
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
			'id': 'ConfigurationModelParserTest',
			'type': 'object',
			'properties': {
				'ConfigurationModelParserTest.windowSetting': {
					'type': 'string',
					'default': 'isSet',
				}
			}
		});
	});

	test('parse configuration model with single override identifier', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ '[x]': { 'a': 1 } }));

		assert.deepStrictEqual(JSON.stringify(testObject.configurationModel.overrides), JSON.stringify([{ identifiers: ['x'], keys: ['a'], contents: { 'a': 1 } }]));
	});

	test('parse configuration model with multiple override identifiers', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ '[x][y]': { 'a': 1 } }));

		assert.deepStrictEqual(JSON.stringify(testObject.configurationModel.overrides), JSON.stringify([{ identifiers: ['x', 'y'], keys: ['a'], contents: { 'a': 1 } }]));
	});

	test('parse configuration model with multiple duplicate override identifiers', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ '[x][y][x][z]': { 'a': 1 } }));

		assert.deepStrictEqual(JSON.stringify(testObject.configurationModel.overrides), JSON.stringify([{ identifiers: ['x', 'y', 'z'], keys: ['a'], contents: { 'a': 1 } }]));
	});

	test('parse configuration model with exclude option', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ 'a': 1, 'b': 2 }), { exclude: ['a'] });

		assert.strictEqual(testObject.configurationModel.getValue('a'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('b'), 2);
	});

	test('parse configuration model with exclude option even included', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ 'a': 1, 'b': 2 }), { exclude: ['a'], include: ['a'] });

		assert.strictEqual(testObject.configurationModel.getValue('a'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('b'), 2);
	});

	test('parse configuration model with scopes filter', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ 'ConfigurationModelParserTest.windowSetting': '1' }), { scopes: [ConfigurationScope.APPLICATION] });

		assert.strictEqual(testObject.configurationModel.getValue('ConfigurationModelParserTest.windowSetting'), undefined);
	});

	test('parse configuration model with include option', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ 'ConfigurationModelParserTest.windowSetting': '1' }), { include: ['ConfigurationModelParserTest.windowSetting'], scopes: [ConfigurationScope.APPLICATION] });

		assert.strictEqual(testObject.configurationModel.getValue('ConfigurationModelParserTest.windowSetting'), '1');
	});

	test('parse configuration model with invalid setting key', () => {
		const testObject = new ConfigurationModelParser('', new NullLogService());

		testObject.parse(JSON.stringify({ 'a': null, 'a.b.c': { c: 1 } }));

		assert.strictEqual(testObject.configurationModel.getValue('a'), null);
		assert.strictEqual(testObject.configurationModel.getValue('a.b'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('a.b.c'), undefined);
	});

});

suite('ConfigurationModelParser - Excluded Properties', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);

	let testConfigurationNodes: IConfigurationNode[] = [];

	setup(() => reset());
	teardown(() => reset());

	function reset() {
		if (testConfigurationNodes.length > 0) {
			configurationRegistry.deregisterConfigurations(testConfigurationNodes);
			testConfigurationNodes = [];
		}
	}

	function registerTestConfiguration() {
		const node = {
			'id': 'ExcludedPropertiesTest',
			'type': 'object',
			'properties': {
				'regularProperty': {
					'type': 'string' as const,
					'default': 'regular',
					'restricted': false
				},
				'restrictedProperty': {
					'type': 'string' as const,
					'default': 'restricted',
					'restricted': true
				},
				'excludedProperty': {
					'type': 'string' as const,
					'default': 'excluded',
					'restricted': true,
					'included': false
				},
				'excludedNonRestrictedProperty': {
					'type': 'string' as const,
					'default': 'excludedNonRestricted',
					'restricted': false,
					'included': false
				}
			}
		};

		configurationRegistry.registerConfiguration(node);
		testConfigurationNodes.push(node);
		return node;
	}

	test('should handle excluded restricted properties correctly', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'regularProperty': 'regularValue',
			'restrictedProperty': 'restrictedValue',
			'excludedProperty': 'excludedValue',
			'excludedNonRestrictedProperty': 'excludedNonRestrictedValue'
		};

		testObject.parse(JSON.stringify(testData), { skipRestricted: true });

		assert.strictEqual(testObject.configurationModel.getValue('regularProperty'), 'regularValue');
		assert.strictEqual(testObject.configurationModel.getValue('restrictedProperty'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), 'excludedValue');
		assert.strictEqual(testObject.configurationModel.getValue('excludedNonRestrictedProperty'), 'excludedNonRestrictedValue');
		assert.ok(testObject.restrictedConfigurations.includes('restrictedProperty'));
		assert.ok(!testObject.restrictedConfigurations.includes('excludedProperty'));
	});

	test('should find excluded properties when checking for restricted settings', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'excludedProperty': 'excludedValue'
		};

		testObject.parse(JSON.stringify(testData));

		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), 'excludedValue');
		assert.ok(!testObject.restrictedConfigurations.includes('excludedProperty'));
	});

	test('should handle override properties with excluded configurations', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'[typescript]': {
				'regularProperty': 'overrideRegular',
				'restrictedProperty': 'overrideRestricted',
				'excludedProperty': 'overrideExcluded'
			}
		};

		testObject.parse(JSON.stringify(testData), { skipRestricted: true });

		const overrideConfig = testObject.configurationModel.override('typescript');
		assert.strictEqual(overrideConfig.getValue('regularProperty'), 'overrideRegular');
		assert.strictEqual(overrideConfig.getValue('restrictedProperty'), undefined);
		assert.strictEqual(overrideConfig.getValue('excludedProperty'), 'overrideExcluded');
	});

	test('should handle scope filtering with excluded properties', () => {
		const node = {
			'id': 'ScopeExcludedTest',
			'type': 'object',
			'properties': {
				'windowProperty': {
					'type': 'string' as const,
					'default': 'window',
					'scope': ConfigurationScope.WINDOW
				},
				'applicationProperty': {
					'type': 'string' as const,
					'default': 'application',
					'scope': ConfigurationScope.APPLICATION
				},
				'excludedApplicationProperty': {
					'type': 'string' as const,
					'default': 'excludedApplication',
					'scope': ConfigurationScope.APPLICATION,
					'included': false
				}
			}
		};

		configurationRegistry.registerConfiguration(node);
		testConfigurationNodes.push(node);

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'windowProperty': 'windowValue',
			'applicationProperty': 'applicationValue',
			'excludedApplicationProperty': 'excludedApplicationValue'
		};

		testObject.parse(JSON.stringify(testData), { scopes: [ConfigurationScope.WINDOW] });

		assert.strictEqual(testObject.configurationModel.getValue('windowProperty'), 'windowValue');
		assert.strictEqual(testObject.configurationModel.getValue('applicationProperty'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('excludedApplicationProperty'), undefined);
	});

	test('filter should handle include/exclude options with excluded properties', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'regularProperty': 'regularValue',
			'excludedProperty': 'excludedValue'
		};

		testObject.parse(JSON.stringify(testData), { include: ['excludedProperty'] });

		assert.strictEqual(testObject.configurationModel.getValue('regularProperty'), 'regularValue');
		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), 'excludedValue');
	});

	test('should handle exclude options with excluded properties', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'regularProperty': 'regularValue',
			'excludedProperty': 'excludedValue'
		};

		testObject.parse(JSON.stringify(testData), { exclude: ['regularProperty'] });

		assert.strictEqual(testObject.configurationModel.getValue('regularProperty'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), 'excludedValue');
	});

	test('should report hasExcludedProperties correctly when excluded properties are filtered', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'regularProperty': 'regularValue',
			'restrictedProperty': 'restrictedValue',
			'excludedProperty': 'excludedValue'
		};

		testObject.parse(JSON.stringify(testData), { skipRestricted: true });

		const model = testObject.configurationModel;

		assert.notStrictEqual(model.raw, undefined, 'Raw should be set when properties are excluded');
	});

	test('skipUnregistered should exclude unregistered properties', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());

		testObject.parse(JSON.stringify({
			'unregisteredProperty': 'value3'
		}), { skipUnregistered: true });

		assert.strictEqual(testObject.configurationModel.getValue('unregisteredProperty'), undefined);
	});

	test('shouldInclude method works correctly with excluded properties for skipUnregistered', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());

		testObject.parse(JSON.stringify({
			'regularProperty': 'value1',
			'excludedProperty': 'value2',
			'unregisteredProperty': 'value3'
		}), { skipUnregistered: true });

		assert.strictEqual(testObject.configurationModel.getValue('regularProperty'), 'value1');
		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), undefined);
		assert.strictEqual(testObject.configurationModel.getValue('unregisteredProperty'), undefined);
	});

	test('excluded properties are found during property schema lookup', () => {
		registerTestConfiguration();

		const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);

		const excludedProperties = registry.getExcludedConfigurationProperties();
		assert.ok(excludedProperties['excludedProperty'], 'Excluded property should be in excluded properties map');
		assert.ok(excludedProperties['excludedNonRestrictedProperty'], 'Excluded non-restricted property should be in excluded properties map');

		const regularProperties = registry.getConfigurationProperties();
		assert.strictEqual(regularProperties['excludedProperty'], undefined, 'Excluded property should not be in regular properties map');
		assert.strictEqual(regularProperties['excludedNonRestrictedProperty'], undefined, 'Excluded non-restricted property should not be in regular properties map');

		assert.ok(regularProperties['regularProperty'], 'Regular property should be in regular properties map');
		assert.ok(regularProperties['restrictedProperty'], 'Restricted property should be in regular properties map');
	});

	test('should correctly use shouldInclude with excluded properties for scope and unregistered filtering', () => {
		registerTestConfiguration();

		const testObject = new ConfigurationModelParser('test', new NullLogService());
		const testData = {
			'regularProperty': 'regularValue',
			'restrictedProperty': 'restrictedValue',
			'excludedProperty': 'excludedValue',
			'excludedNonRestrictedProperty': 'excludedNonRestrictedValue',
			'unknownProperty': 'unknownValue'
		};

		testObject.parse(JSON.stringify(testData), { skipRestricted: true });

		assert.strictEqual(testObject.configurationModel.getValue('regularProperty'), 'regularValue');
		assert.strictEqual(testObject.configurationModel.getValue('restrictedProperty'), undefined);
		assert.ok(testObject.restrictedConfigurations.includes('restrictedProperty'));
		assert.strictEqual(testObject.configurationModel.getValue('excludedProperty'), 'excludedValue');
		assert.ok(!testObject.restrictedConfigurations.includes('excludedProperty'));
		assert.strictEqual(testObject.configurationModel.getValue('excludedNonRestrictedProperty'), 'excludedNonRestrictedValue');
		assert.strictEqual(testObject.configurationModel.getValue('unknownProperty'), 'unknownValue');
	});
});

suite('ConfigurationModel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('setValue for a key that has no sections and not defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 } }, ['a.b'], [], undefined, new NullLogService());

		testObject.setValue('f', 1);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 1 }, 'f': 1 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'f']);
	});

	test('setValue for a key that has no sections and defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 }, 'f': 1 }, ['a.b', 'f'], [], undefined, new NullLogService());

		testObject.setValue('f', 3);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 1 }, 'f': 3 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'f']);
	});

	test('setValue for a key that has sections and not defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 }, 'f': 1 }, ['a.b', 'f'], [], undefined, new NullLogService());

		testObject.setValue('b.c', 1);

		const expected: Record<string, unknown> = {};
		expected['a'] = { 'b': 1 };
		expected['f'] = 1;
		expected['b'] = Object.create(null);
		(expected['b'] as Record<string, unknown>)['c'] = 1;
		assert.deepStrictEqual(testObject.contents, expected);
		assert.deepStrictEqual(testObject.keys, ['a.b', 'f', 'b.c']);
	});

	test('setValue for a key that has sections and defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 }, 'b': { 'c': 1 }, 'f': 1 }, ['a.b', 'b.c', 'f'], [], undefined, new NullLogService());

		testObject.setValue('b.c', 3);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 1 }, 'b': { 'c': 3 }, 'f': 1 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'b.c', 'f']);
	});

	test('setValue for a key that has sections and sub section not defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 }, 'f': 1 }, ['a.b', 'f'], [], undefined, new NullLogService());

		testObject.setValue('a.c', 1);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 1, 'c': 1 }, 'f': 1 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'f', 'a.c']);
	});

	test('setValue for a key that has sections and sub section defined', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1, 'c': 1 }, 'f': 1 }, ['a.b', 'a.c', 'f'], [], undefined, new NullLogService());

		testObject.setValue('a.c', 3);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 1, 'c': 3 }, 'f': 1 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'a.c', 'f']);
	});

	test('setValue for a key that has sections and last section is added', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': {} }, 'f': 1 }, ['a.b', 'f'], [], undefined, new NullLogService());

		testObject.setValue('a.b.c', 1);

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': { 'c': 1 } }, 'f': 1 });
		assert.deepStrictEqual(testObject.keys, ['a.b', 'f', 'a.b.c']);
	});

	test('removeValue: remove a non existing key', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 2 } }, ['a.b'], [], undefined, new NullLogService());

		testObject.removeValue('a.b.c');

		assert.deepStrictEqual(testObject.contents, { 'a': { 'b': 2 } });
		assert.deepStrictEqual(testObject.keys, ['a.b']);
	});

	test('removeValue: remove a single segmented key', () => {
		const testObject = new ConfigurationModel({ 'a': 1 }, ['a'], [], undefined, new NullLogService());

		testObject.removeValue('a');

		assert.deepStrictEqual(testObject.contents, {});
		assert.deepStrictEqual(testObject.keys, []);
	});

	test('removeValue: remove a multi segmented key', () => {
		const testObject = new ConfigurationModel({ 'a': { 'b': 1 } }, ['a.b'], [], undefined, new NullLogService());

		testObject.removeValue('a.b');

		assert.deepStrictEqual(testObject.contents, {});
		assert.deepStrictEqual(testObject.keys, []);
	});

	test('get overriding configuration model for an existing identifier', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': 1 }, [],
			[{ identifiers: ['c'], contents: { 'a': { 'd': 1 } }, keys: ['a'] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1, 'd': 1 }, 'f': 1 });
	});

	test('get overriding configuration model for an identifier that does not exist', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': 1 }, [],
			[{ identifiers: ['c'], contents: { 'a': { 'd': 1 } }, keys: ['a'] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('xyz').contents, { 'a': { 'b': 1 }, 'f': 1 });
	});

	test('get overriding configuration when one of the keys does not exist in base', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': 1 }, [],
			[{ identifiers: ['c'], contents: { 'a': { 'd': 1 }, 'g': 1 }, keys: ['a', 'g'] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1, 'd': 1 }, 'f': 1, 'g': 1 });
	});

	test('get overriding configuration when one of the key in base is not of object type', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': 1 }, [],
			[{ identifiers: ['c'], contents: { 'a': { 'd': 1 }, 'f': { 'g': 1 } }, keys: ['a', 'f'] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1, 'd': 1 }, 'f': { 'g': 1 } });
	});

	test('get overriding configuration when one of the key in overriding contents is not of object type', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': { 'g': 1 } }, [],
			[{ identifiers: ['c'], contents: { 'a': { 'd': 1 }, 'f': 1 }, keys: ['a', 'f'] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1, 'd': 1 }, 'f': 1 });
	});

	test('get overriding configuration if the value of overriding identifier is not object', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': { 'g': 1 } }, [],
			[{ identifiers: ['c'], contents: 'abc' as unknown as Record<string, unknown>, keys: [] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1 }, 'f': { 'g': 1 } });
	});

	test('get overriding configuration if the value of overriding identifier is an empty object', () => {
		const testObject = new ConfigurationModel(
			{ 'a': { 'b': 1 }, 'f': { 'g': 1 } }, [],
			[{ identifiers: ['c'], contents: {}, keys: [] }], [], new NullLogService());

		assert.deepStrictEqual(testObject.override('c').contents, { 'a': { 'b': 1 }, 'f': { 'g': 1 } });
	});

	test('simple merge', () => {
		const base = new ConfigurationModel({ 'a': 1, 'b': 2 }, ['a', 'b'], [], undefined, new NullLogService());
		const add = new ConfigurationModel({ 'a': 3, 'c': 4 }, ['a', 'c'], [], undefined, new NullLogService());
		const result = base.merge(add);

		assert.deepStrictEqual(result.contents, { 'a': 3, 'b': 2, 'c': 4 });
		assert.deepStrictEqual(result.keys, ['a', 'b', 'c']);
	});

	test('recursive merge', () => {
		const base = new ConfigurationModel({ 'a': { 'b': 1 } }, ['a.b'], [], undefined, new NullLogService());
		const add = new ConfigurationModel({ 'a': { 'b': 2 } }, ['a.b'], [], undefined, new NullLogService());
		const result = base.merge(add);

		assert.deepStrictEqual(result.contents, { 'a': { 'b': 2 } });
		assert.deepStrictEqual(result.getValue('a'), { 'b': 2 });
		assert.deepStrictEqual(result.keys, ['a.b']);
	});

	test('simple merge overrides', () => {
		const base = new ConfigurationModel({ 'a': { 'b': 1 } }, ['a.b'], [{ identifiers: ['c'], contents: { 'a': 2 }, keys: ['a'] }], undefined, new NullLogService());
		const add = new ConfigurationModel({ 'a': { 'b': 2 } }, ['a.b'], [{ identifiers: ['c'], contents: { 'b': 2 }, keys: ['b'] }], undefined, new NullLogService());
		const result = base.merge(add);

		assert.deepStrictEqual(result.contents, { 'a': { 'b': 2 } });
		assert.deepStrictEqual(result.overrides, [{ identifiers: ['c'], contents: { 'a': 2, 'b': 2 }, keys: ['a', 'b'] }]);
		assert.deepStrictEqual(result.override('c').contents, { 'a': 2, 'b': 2 });
		assert.deepStrictEqual(result.keys, ['a.b']);
	});

	test('recursive merge overrides', () => {
		const base = new ConfigurationModel({ 'a': { 'b': 1 }, 'f': 1 }, ['a.b', 'f'], [{ identifiers: ['c'], contents: { 'a': { 'd': 1 } }, keys: ['a'] }], undefined, new NullLogService());
		const add = new ConfigurationModel({ 'a': { 'b': 2 } }, ['a.b'], [{ identifiers: ['c'], contents: { 'a': { 'e': 2 } }, keys: ['a'] }], undefined, new NullLogService());
		const result = base.merge(add);

		assert.deepStrictEqual(result.contents, { 'a': { 'b': 2 }, 'f': 1 });
		assert.deepStrictEqual(result.overrides, [{ identifiers: ['c'], contents: { 'a': { 'd': 1, 'e': 2 } }, keys: ['a'] }]);
		assert.deepStrictEqual(result.override('c').contents, { 'a': { 'b': 2, 'd': 1, 'e': 2 }, 'f': 1 });
		assert.deepStrictEqual(result.keys, ['a.b', 'f']);
	});

	test('Test contents while getting an existing property', () => {
		let testObject = new ConfigurationModel({ 'a': 1 }, [], [], undefined, new NullLogService());
		assert.deepStrictEqual(testObject.getValue('a'), 1);

		testObject = new ConfigurationModel({ 'a': { 'b': 1 } }, [], [], undefined, new NullLogService());
		assert.deepStrictEqual(testObject.getValue('a'), { 'b': 1 });
	});

	test('Test contents are undefined for non existing properties', () => {
		const testObject = new ConfigurationModel({ awesome: true }, [], [], undefined, new NullLogService());

		assert.deepStrictEqual(testObject.getValue('unknownproperty'), undefined);
	});

	test('Test override gives all content merged with overrides', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, [], [{ identifiers: ['b'], contents: { 'a': 2 }, keys: ['a'] }], undefined, new NullLogService());

		assert.deepStrictEqual(testObject.override('b').contents, { 'a': 2, 'c': 1 });
	});

	test('Test override when an override has multiple identifiers', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x', 'y'], contents: { 'a': 2 }, keys: ['a'] }], undefined, new NullLogService());

		let actual = testObject.override('x');
		assert.deepStrictEqual(actual.contents, { 'a': 2, 'c': 1 });
		assert.deepStrictEqual(actual.keys, ['a', 'c']);
		assert.deepStrictEqual(testObject.getKeysForOverrideIdentifier('x'), ['a']);

		actual = testObject.override('y');
		assert.deepStrictEqual(actual.contents, { 'a': 2, 'c': 1 });
		assert.deepStrictEqual(actual.keys, ['a', 'c']);
		assert.deepStrictEqual(testObject.getKeysForOverrideIdentifier('y'), ['a']);
	});

	test('Test override when an identifier is defined in multiple overrides', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x'], contents: { 'a': 3, 'b': 1 }, keys: ['a', 'b'] }, { identifiers: ['x', 'y'], contents: { 'a': 2 }, keys: ['a'] }], undefined, new NullLogService());

		const actual = testObject.override('x');
		assert.deepStrictEqual(actual.contents, { 'a': 3, 'c': 1, 'b': 1 });
		assert.deepStrictEqual(actual.keys, ['a', 'c']);

		assert.deepStrictEqual(testObject.getKeysForOverrideIdentifier('x'), ['a', 'b']);
	});

	test('Test merge when configuration models have multiple identifiers', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['y'], contents: { 'c': 1 }, keys: ['c'] }, { identifiers: ['x', 'y'], contents: { 'a': 2 }, keys: ['a'] }], undefined, new NullLogService());
		const target = new ConfigurationModel({ 'a': 2, 'b': 1 }, ['a', 'b'], [{ identifiers: ['x'], contents: { 'a': 3, 'b': 2 }, keys: ['a', 'b'] }, { identifiers: ['x', 'y'], contents: { 'b': 3 }, keys: ['b'] }], undefined, new NullLogService());

		const actual = testObject.merge(target);

		assert.deepStrictEqual(actual.contents, { 'a': 2, 'c': 1, 'b': 1 });
		assert.deepStrictEqual(actual.keys, ['a', 'c', 'b']);
		assert.deepStrictEqual(actual.overrides, [
			{ identifiers: ['y'], contents: { 'c': 1 }, keys: ['c'] },
			{ identifiers: ['x', 'y'], contents: { 'a': 2, 'b': 3 }, keys: ['a', 'b'] },
			{ identifiers: ['x'], contents: { 'a': 3, 'b': 2 }, keys: ['a', 'b'] },
		]);
	});

	test('inspect when raw is same', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, 'b': 1 }, keys: ['a'] }], undefined, new NullLogService());

		assert.deepStrictEqual(testObject.inspect('a'), { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('a', 'x'), { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('b', 'x'), { value: undefined, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(testObject.inspect('d'), { value: undefined, override: undefined, merged: undefined, overrides: undefined });
	});

	test('inspect when raw is not same', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
			'a': 1,
			'b': 2,
			'c': 1,
			'd': 3,
			'[x][y]': {
				'a': 2,
				'b': 1
			}
		}, new NullLogService());

		assert.deepStrictEqual(testObject.inspect('a'), { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('a', 'x'), { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('b', 'x'), { value: 2, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(testObject.inspect('d'), { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(testObject.inspect('e'), { value: undefined, override: undefined, merged: undefined, overrides: undefined });
	});

	test('inspect in merged configuration when raw is same', () => {
		const target1 = new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], undefined, new NullLogService());
		const target2 = new ConfigurationModel({ 'b': 3 }, ['b'], [], undefined, new NullLogService());
		const testObject = target1.merge(target2);

		assert.deepStrictEqual(testObject.inspect('a'), { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('a', 'x'), { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('b'), { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(testObject.inspect('b', 'y'), { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(testObject.inspect('c'), { value: undefined, override: undefined, merged: undefined, overrides: undefined });
	});

	test('inspect in merged configuration when raw is not same for one model', () => {
		const target1 = new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
			'a': 1,
			'b': 2,
			'c': 3,
			'[x][y]': {
				'a': 2,
				'b': 4,
			}
		}, new NullLogService());
		const target2 = new ConfigurationModel({ 'b': 3 }, ['b'], [], undefined, new NullLogService());
		const testObject = target1.merge(target2);

		assert.deepStrictEqual(testObject.inspect('a'), { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('a', 'x'), { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(testObject.inspect('b'), { value: 3, override: undefined, merged: 3, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(testObject.inspect('b', 'y'), { value: 3, override: 4, merged: 4, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(testObject.inspect('c'), { value: 3, override: undefined, merged: 3, overrides: undefined });
	});

	test('inspect: return all overrides', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [
			{ identifiers: ['x', 'y'], contents: { 'a': 2, 'b': 1 }, keys: ['a', 'b'] },
			{ identifiers: ['x'], contents: { 'a': 3 }, keys: ['a'] },
			{ identifiers: ['y'], contents: { 'b': 3 }, keys: ['b'] }
		], undefined, new NullLogService());

		assert.deepStrictEqual(testObject.inspect('a').overrides, [
			{ identifiers: ['x', 'y'], value: 2 },
			{ identifiers: ['x'], value: 3 }
		]);
	});

	test('inspect when no overrides', () => {
		const testObject = new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [], undefined, new NullLogService());

		assert.strictEqual(testObject.inspect('a').overrides, undefined);
	});

});

suite('CustomConfigurationModel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('simple merge using models', () => {
		const base = new ConfigurationModelParser('base', new NullLogService());
		base.parse(JSON.stringify({ 'a': 1, 'b': 2 }));

		const add = new ConfigurationModelParser('add', new NullLogService());
		add.parse(JSON.stringify({ 'a': 3, 'c': 4 }));

		const result = base.configurationModel.merge(add.configurationModel);
		assert.deepStrictEqual(result.contents, { 'a': 3, 'b': 2, 'c': 4 });
	});

	test('simple merge with an undefined contents', () => {
		let base = new ConfigurationModelParser('base', new NullLogService());
		base.parse(JSON.stringify({ 'a': 1, 'b': 2 }));
		let add = new ConfigurationModelParser('add', new NullLogService());
		let result = base.configurationModel.merge(add.configurationModel);
		assert.deepStrictEqual(result.contents, { 'a': 1, 'b': 2 });

		base = new ConfigurationModelParser('base', new NullLogService());
		add = new ConfigurationModelParser('add', new NullLogService());
		add.parse(JSON.stringify({ 'a': 1, 'b': 2 }));
		result = base.configurationModel.merge(add.configurationModel);
		assert.deepStrictEqual(result.contents, { 'a': 1, 'b': 2 });

		base = new ConfigurationModelParser('base', new NullLogService());
		add = new ConfigurationModelParser('add', new NullLogService());
		result = base.configurationModel.merge(add.configurationModel);
		assert.deepStrictEqual(result.contents, {});
	});

	test('Recursive merge using config models', () => {
		const base = new ConfigurationModelParser('base', new NullLogService());
		base.parse(JSON.stringify({ 'a': { 'b': 1 } }));
		const add = new ConfigurationModelParser('add', new NullLogService());
		add.parse(JSON.stringify({ 'a': { 'b': 2 } }));
		const result = base.configurationModel.merge(add.configurationModel);
		assert.deepStrictEqual(result.contents, { 'a': { 'b': 2 } });
	});

	test('Test contents while getting an existing property', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());
		testObject.parse(JSON.stringify({ 'a': 1 }));
		assert.deepStrictEqual(testObject.configurationModel.getValue('a'), 1);

		testObject.parse(JSON.stringify({ 'a': { 'b': 1 } }));
		assert.deepStrictEqual(testObject.configurationModel.getValue('a'), { 'b': 1 });
	});

	test('Test contents are undefined for non existing properties', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());
		testObject.parse(JSON.stringify({
			awesome: true
		}));

		assert.deepStrictEqual(testObject.configurationModel.getValue('unknownproperty'), undefined);
	});

	test('Test contents are undefined for undefined config', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());

		assert.deepStrictEqual(testObject.configurationModel.getValue('unknownproperty'), undefined);
	});

	test('Test configWithOverrides gives all content merged with overrides', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());
		testObject.parse(JSON.stringify({ 'a': 1, 'c': 1, '[b]': { 'a': 2 } }));

		assert.deepStrictEqual(testObject.configurationModel.override('b').contents, { 'a': 2, 'c': 1, '[b]': { 'a': 2 } });
	});

	test('Test configWithOverrides gives empty contents', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());

		assert.deepStrictEqual(testObject.configurationModel.override('b').contents, {});
	});

	test('Test update with empty data', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());
		testObject.parse('');

		assert.deepStrictEqual(testObject.configurationModel.contents, Object.create(null));
		assert.deepStrictEqual(testObject.configurationModel.keys, []);

		testObject.parse(null);

		assert.deepStrictEqual(testObject.configurationModel.contents, Object.create(null));
		assert.deepStrictEqual(testObject.configurationModel.keys, []);

		testObject.parse(undefined);

		assert.deepStrictEqual(testObject.configurationModel.contents, Object.create(null));
		assert.deepStrictEqual(testObject.configurationModel.keys, []);
	});

	test('Test empty property is not ignored', () => {
		const testObject = new ConfigurationModelParser('test', new NullLogService());
		testObject.parse(JSON.stringify({ '': 1 }));

		// deepStrictEqual seems to ignore empty properties, fall back
		// to comparing the output of JSON.stringify
		assert.strictEqual(JSON.stringify(testObject.configurationModel.contents), JSON.stringify({ '': 1 }));
		assert.deepStrictEqual(testObject.configurationModel.keys, ['']);
	});

});

export class TestConfiguration extends Configuration {

	constructor(
		defaultConfiguration: ConfigurationModel,
		policyConfiguration: ConfigurationModel,
		applicationConfiguration: ConfigurationModel,
		localUserConfiguration: ConfigurationModel,
		remoteUserConfiguration?: ConfigurationModel,
	) {
		super(
			defaultConfiguration,
			policyConfiguration,
			applicationConfiguration,
			localUserConfiguration,
			remoteUserConfiguration ?? ConfigurationModel.createEmptyModel(new NullLogService()),
			ConfigurationModel.createEmptyModel(new NullLogService()),
			new ResourceMap<ConfigurationModel>(),
			ConfigurationModel.createEmptyModel(new NullLogService()),
			new ResourceMap<ConfigurationModel>(),
			new NullLogService()
		);
	}

}

suite('Configuration', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Test inspect for overrideIdentifiers', () => {
		const defaultConfigurationModel = parseConfigurationModel({ '[l1]': { 'a': 1 }, '[l2]': { 'b': 1 } });
		const userConfigurationModel = parseConfigurationModel({ '[l3]': { 'a': 2 } });
		const workspaceConfigurationModel = parseConfigurationModel({ '[l1]': { 'a': 3 }, '[l4]': { 'a': 3 } });
		const testObject: Configuration = new TestConfiguration(defaultConfigurationModel, ConfigurationModel.createEmptyModel(new NullLogService()), userConfigurationModel, workspaceConfigurationModel);

		const { overrideIdentifiers } = testObject.inspect('a', {}, undefined);

		assert.deepStrictEqual(overrideIdentifiers, ['l1', 'l3', 'l4']);
	});

	test('Test update value', () => {
		const parser = new ConfigurationModelParser('test', new NullLogService());
		parser.parse(JSON.stringify({ 'a': 1 }));
		const testObject: Configuration = new TestConfiguration(parser.configurationModel, ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));

		testObject.updateValue('a', 2);

		assert.strictEqual(testObject.getValue('a', {}, undefined), 2);
	});

	test('Test update value after inspect', () => {
		const parser = new ConfigurationModelParser('test', new NullLogService());
		parser.parse(JSON.stringify({ 'a': 1 }));
		const testObject: Configuration = new TestConfiguration(parser.configurationModel, ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));

		testObject.inspect('a', {}, undefined);
		testObject.updateValue('a', 2);

		assert.strictEqual(testObject.getValue('a', {}, undefined), 2);
	});

	test('Test compare and update default configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateDefaultConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'on',
		}));

		const actual = testObject.compareAndUpdateDefaultConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'off',
			'[markdown]': {
				'editor.wordWrap': 'off'
			}
		}), ['editor.lineNumbers', '[markdown]']);

		assert.deepStrictEqual(actual, { keys: ['editor.lineNumbers', '[markdown]'], overrides: [['markdown', ['editor.wordWrap']]] });

	});

	test('Test compare and update application configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateApplicationConfiguration(toConfigurationModel({
			'update.mode': 'on',
		}));

		const actual = testObject.compareAndUpdateApplicationConfiguration(toConfigurationModel({
			'update.mode': 'none',
			'[typescript]': {
				'editor.wordWrap': 'off'
			}
		}));

		assert.deepStrictEqual(actual, { keys: ['[typescript]', 'update.mode',], overrides: [['typescript', ['editor.wordWrap']]] });

	});

	test('Test compare and update user configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateLocalUserConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'off',
			'editor.fontSize': 12,
			'[typescript]': {
				'editor.wordWrap': 'off'
			}
		}));

		const actual = testObject.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'on',
			'window.zoomLevel': 1,
			'[typescript]': {
				'editor.wordWrap': 'on',
				'editor.insertSpaces': false
			}
		}));

		assert.deepStrictEqual(actual, { keys: ['window.zoomLevel', 'editor.lineNumbers', '[typescript]', 'editor.fontSize'], overrides: [['typescript', ['editor.insertSpaces', 'editor.wordWrap']]] });

	});

	test('Test compare and update workspace configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateWorkspaceConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'off',
			'editor.fontSize': 12,
			'[typescript]': {
				'editor.wordWrap': 'off'
			}
		}));

		const actual = testObject.compareAndUpdateWorkspaceConfiguration(toConfigurationModel({
			'editor.lineNumbers': 'on',
			'window.zoomLevel': 1,
			'[typescript]': {
				'editor.wordWrap': 'on',
				'editor.insertSpaces': false
			}
		}));

		assert.deepStrictEqual(actual, { keys: ['window.zoomLevel', 'editor.lineNumbers', '[typescript]', 'editor.fontSize'], overrides: [['typescript', ['editor.insertSpaces', 'editor.wordWrap']]] });

	});

	test('Test compare and update workspace folder configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateFolderConfiguration(URI.file('file1'), toConfigurationModel({
			'editor.lineNumbers': 'off',
			'editor.fontSize': 12,
			'[typescript]': {
				'editor.wordWrap': 'off'
			}
		}));

		const actual = testObject.compareAndUpdateFolderConfiguration(URI.file('file1'), toConfigurationModel({
			'editor.lineNumbers': 'on',
			'window.zoomLevel': 1,
			'[typescript]': {
				'editor.wordWrap': 'on',
				'editor.insertSpaces': false
			}
		}));

		assert.deepStrictEqual(actual, { keys: ['window.zoomLevel', 'editor.lineNumbers', '[typescript]', 'editor.fontSize'], overrides: [['typescript', ['editor.insertSpaces', 'editor.wordWrap']]] });

	});

	test('Test compare and delete workspace folder configuration', () => {
		const testObject = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		testObject.updateFolderConfiguration(URI.file('file1'), toConfigurationModel({
			'editor.lineNumbers': 'off',
			'editor.fontSize': 12,
			'[typescript]': {
				'editor.wordWrap': 'off'
			}
		}));

		const actual = testObject.compareAndDeleteFolderConfiguration(URI.file('file1'));

		assert.deepStrictEqual(actual, { keys: ['editor.lineNumbers', 'editor.fontSize', '[typescript]'], overrides: [['typescript', ['editor.wordWrap']]] });

	});

	function parseConfigurationModel(content: Record<string, unknown>): ConfigurationModel {
		const parser = new ConfigurationModelParser('test', new NullLogService());
		parser.parse(JSON.stringify(content));
		return parser.configurationModel;
	}

});

suite('ConfigurationChangeEvent', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('changeEvent affecting keys with new configuration', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'window.zoomLevel': 1,
			'workbench.editor.enablePreview': false,
			'files.autoSave': 'off',
		}));
		const testObject = new ConfigurationChangeEvent(change, undefined, configuration, undefined, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['window.zoomLevel', 'workbench.editor.enablePreview', 'files.autoSave']);

		assert.ok(testObject.affectsConfiguration('window.zoomLevel'));
		assert.ok(testObject.affectsConfiguration('window'));

		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview'));
		assert.ok(testObject.affectsConfiguration('workbench.editor'));
		assert.ok(testObject.affectsConfiguration('workbench'));

		assert.ok(testObject.affectsConfiguration('files'));
		assert.ok(testObject.affectsConfiguration('files.autoSave'));
		assert.ok(!testObject.affectsConfiguration('files.exclude'));

		assert.ok(!testObject.affectsConfiguration('[markdown]'));
		assert.ok(!testObject.affectsConfiguration('editor'));
	});

	test('changeEvent affecting keys when configuration changed', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		configuration.updateLocalUserConfiguration(toConfigurationModel({
			'window.zoomLevel': 2,
			'workbench.editor.enablePreview': true,
			'files.autoSave': 'off',
		}));
		const data = configuration.toData();
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'window.zoomLevel': 1,
			'workbench.editor.enablePreview': false,
			'files.autoSave': 'off',
		}));
		const testObject = new ConfigurationChangeEvent(change, { data }, configuration, undefined, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['window.zoomLevel', 'workbench.editor.enablePreview']);

		assert.ok(testObject.affectsConfiguration('window.zoomLevel'));
		assert.ok(testObject.affectsConfiguration('window'));

		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview'));
		assert.ok(testObject.affectsConfiguration('workbench.editor'));
		assert.ok(testObject.affectsConfiguration('workbench'));

		assert.ok(!testObject.affectsConfiguration('files'));
		assert.ok(!testObject.affectsConfiguration('[markdown]'));
		assert.ok(!testObject.affectsConfiguration('editor'));
	});

	test('changeEvent affecting overrides with new configuration', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'files.autoSave': 'off',
			'[markdown]': {
				'editor.wordWrap': 'off'
			},
			'[typescript][jsonc]': {
				'editor.lineNumbers': 'off'
			}
		}));
		const testObject = new ConfigurationChangeEvent(change, undefined, configuration, undefined, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['files.autoSave', '[markdown]', '[typescript][jsonc]', 'editor.wordWrap', 'editor.lineNumbers']);

		assert.ok(testObject.affectsConfiguration('files'));
		assert.ok(testObject.affectsConfiguration('files.autoSave'));
		assert.ok(!testObject.affectsConfiguration('files.exclude'));

		assert.ok(testObject.affectsConfiguration('[markdown]'));
		assert.ok(!testObject.affectsConfiguration('[markdown].editor'));
		assert.ok(!testObject.affectsConfiguration('[markdown].workbench'));

		assert.ok(testObject.affectsConfiguration('editor'));
		assert.ok(testObject.affectsConfiguration('editor.wordWrap'));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers'));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'jsonc' }));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'typescript' }));
		assert.ok(testObject.affectsConfiguration('editor.wordWrap', { overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { overrideIdentifier: 'jsonc' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { overrideIdentifier: 'typescript' }));
		assert.ok(!testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'typescript' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'jsonc' }));
		assert.ok(!testObject.affectsConfiguration('editor', { overrideIdentifier: 'json' }));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { overrideIdentifier: 'markdown' }));

		assert.ok(!testObject.affectsConfiguration('editor.fontSize'));
		assert.ok(!testObject.affectsConfiguration('window'));
	});

	test('changeEvent affecting overrides when configuration changed', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		configuration.updateLocalUserConfiguration(toConfigurationModel({
			'workbench.editor.enablePreview': true,
			'[markdown]': {
				'editor.fontSize': 12,
				'editor.wordWrap': 'off'
			},
			'[css][scss]': {
				'editor.lineNumbers': 'off',
				'css.lint.emptyRules': 'error'
			},
			'files.autoSave': 'off',
		}));
		const data = configuration.toData();
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'files.autoSave': 'off',
			'[markdown]': {
				'editor.fontSize': 13,
				'editor.wordWrap': 'off'
			},
			'[css][scss]': {
				'editor.lineNumbers': 'relative',
				'css.lint.emptyRules': 'error'
			},
			'window.zoomLevel': 1,
		}));
		const testObject = new ConfigurationChangeEvent(change, { data }, configuration, undefined, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['window.zoomLevel', '[markdown]', '[css][scss]', 'workbench.editor.enablePreview', 'editor.fontSize', 'editor.lineNumbers']);

		assert.ok(!testObject.affectsConfiguration('files'));

		assert.ok(testObject.affectsConfiguration('[markdown]'));
		assert.ok(!testObject.affectsConfiguration('[markdown].editor'));
		assert.ok(!testObject.affectsConfiguration('[markdown].editor.fontSize'));
		assert.ok(!testObject.affectsConfiguration('[markdown].editor.wordWrap'));
		assert.ok(!testObject.affectsConfiguration('[markdown].workbench'));
		assert.ok(testObject.affectsConfiguration('[css][scss]'));

		assert.ok(testObject.affectsConfiguration('editor'));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'css' }));
		assert.ok(testObject.affectsConfiguration('editor', { overrideIdentifier: 'scss' }));
		assert.ok(testObject.affectsConfiguration('editor.fontSize', { overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { overrideIdentifier: 'css' }));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { overrideIdentifier: 'scss' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'scss' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'css' }));
		assert.ok(!testObject.affectsConfiguration('editor.lineNumbers', { overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap'));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor', { overrideIdentifier: 'json' }));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { overrideIdentifier: 'json' }));

		assert.ok(testObject.affectsConfiguration('window'));
		assert.ok(testObject.affectsConfiguration('window.zoomLevel'));
		assert.ok(testObject.affectsConfiguration('window', { overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('window.zoomLevel', { overrideIdentifier: 'markdown' }));

		assert.ok(testObject.affectsConfiguration('workbench'));
		assert.ok(testObject.affectsConfiguration('workbench.editor'));
		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview'));
		assert.ok(testObject.affectsConfiguration('workbench', { overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('workbench.editor', { overrideIdentifier: 'markdown' }));
	});

	test('changeEvent affecting workspace folders', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		configuration.updateWorkspaceConfiguration(toConfigurationModel({ 'window.title': 'custom' }));
		configuration.updateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'window.zoomLevel': 2, 'window.restoreFullscreen': true }));
		configuration.updateFolderConfiguration(URI.file('folder2'), toConfigurationModel({ 'workbench.editor.enablePreview': true, 'window.restoreWindows': true }));
		const data = configuration.toData();
		const workspace = new Workspace('a', [new WorkspaceFolder({ index: 0, name: 'a', uri: URI.file('folder1') }), new WorkspaceFolder({ index: 1, name: 'b', uri: URI.file('folder2') }), new WorkspaceFolder({ index: 2, name: 'c', uri: URI.file('folder3') })]);
		const change = mergeChanges(
			configuration.compareAndUpdateWorkspaceConfiguration(toConfigurationModel({ 'window.title': 'native' })),
			configuration.compareAndUpdateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'window.zoomLevel': 1, 'window.restoreFullscreen': false })),
			configuration.compareAndUpdateFolderConfiguration(URI.file('folder2'), toConfigurationModel({ 'workbench.editor.enablePreview': false, 'window.restoreWindows': false }))
		);
		const testObject = new ConfigurationChangeEvent(change, { data, workspace }, configuration, workspace, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['window.title', 'window.zoomLevel', 'window.restoreFullscreen', 'workbench.editor.enablePreview', 'window.restoreWindows']);

		assert.ok(testObject.affectsConfiguration('window.zoomLevel'));
		assert.ok(testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file('folder1') }));
		assert.ok(testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(!testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file(join('folder3', 'file3')) }));

		assert.ok(testObject.affectsConfiguration('window.restoreFullscreen'));
		assert.ok(testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file('folder1') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file(join('folder3', 'file3')) }));

		assert.ok(testObject.affectsConfiguration('window.restoreWindows'));
		assert.ok(testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(!testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file(join('folder3', 'file3')) }));

		assert.ok(testObject.affectsConfiguration('window.title'));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('folder1') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('folder3') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file(join('folder3', 'file3')) }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('file2') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('file3') }));

		assert.ok(testObject.affectsConfiguration('window'));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('folder1') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('folder3') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file(join('folder3', 'file3')) }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('file2') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('file3') }));

		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview'));
		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file('folder1') }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file('folder3') }));

		assert.ok(testObject.affectsConfiguration('workbench.editor'));
		assert.ok(testObject.affectsConfiguration('workbench.editor', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('workbench.editor', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor', { resource: URI.file('folder1') }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor', { resource: URI.file('folder3') }));

		assert.ok(testObject.affectsConfiguration('workbench'));
		assert.ok(testObject.affectsConfiguration('workbench', { resource: URI.file('folder2') }));
		assert.ok(testObject.affectsConfiguration('workbench', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('workbench', { resource: URI.file('folder1') }));
		assert.ok(!testObject.affectsConfiguration('workbench', { resource: URI.file('folder3') }));

		assert.ok(!testObject.affectsConfiguration('files'));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file('folder1') }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file(join('folder1', 'file1')) }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file('folder2') }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file(join('folder2', 'file2')) }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file('folder3') }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file(join('folder3', 'file3')) }));
	});

	test('changeEvent - all', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		configuration.updateFolderConfiguration(URI.file('file1'), toConfigurationModel({ 'window.zoomLevel': 2, 'window.restoreFullscreen': true }));
		const data = configuration.toData();
		const change = mergeChanges(
			configuration.compareAndUpdateDefaultConfiguration(toConfigurationModel({
				'editor.lineNumbers': 'off',
				'[markdown]': {
					'editor.wordWrap': 'off'
				}
			}), ['editor.lineNumbers', '[markdown]']),
			configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
				'[json]': {
					'editor.lineNumbers': 'relative'
				}
			})),
			configuration.compareAndUpdateWorkspaceConfiguration(toConfigurationModel({ 'window.title': 'custom' })),
			configuration.compareAndDeleteFolderConfiguration(URI.file('file1')),
			configuration.compareAndUpdateFolderConfiguration(URI.file('file2'), toConfigurationModel({ 'workbench.editor.enablePreview': true, 'window.restoreWindows': true })));
		const workspace = new Workspace('a', [new WorkspaceFolder({ index: 0, name: 'a', uri: URI.file('file1') }), new WorkspaceFolder({ index: 1, name: 'b', uri: URI.file('file2') }), new WorkspaceFolder({ index: 2, name: 'c', uri: URI.file('folder3') })]);
		const testObject = new ConfigurationChangeEvent(change, { data, workspace }, configuration, workspace, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['editor.lineNumbers', '[markdown]', '[json]', 'window.title', 'window.zoomLevel', 'window.restoreFullscreen', 'workbench.editor.enablePreview', 'window.restoreWindows', 'editor.wordWrap']);

		assert.ok(testObject.affectsConfiguration('window.title'));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('window.title', { resource: URI.file('file2') }));

		assert.ok(testObject.affectsConfiguration('window'));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('window', { resource: URI.file('file2') }));

		assert.ok(testObject.affectsConfiguration('window.zoomLevel'));
		assert.ok(testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('window.zoomLevel', { resource: URI.file('file2') }));

		assert.ok(testObject.affectsConfiguration('window.restoreFullscreen'));
		assert.ok(testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreFullscreen', { resource: URI.file('file2') }));

		assert.ok(testObject.affectsConfiguration('window.restoreWindows'));
		assert.ok(testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('window.restoreWindows', { resource: URI.file('file1') }));

		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview'));
		assert.ok(testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor.enablePreview', { resource: URI.file('file1') }));

		assert.ok(testObject.affectsConfiguration('workbench.editor'));
		assert.ok(testObject.affectsConfiguration('workbench.editor', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('workbench.editor', { resource: URI.file('file1') }));

		assert.ok(testObject.affectsConfiguration('workbench'));
		assert.ok(testObject.affectsConfiguration('workbench', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('workbench', { resource: URI.file('file1') }));

		assert.ok(!testObject.affectsConfiguration('files'));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('files', { resource: URI.file('file2') }));

		assert.ok(testObject.affectsConfiguration('editor'));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file2') }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file1'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file1'), overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file1'), overrideIdentifier: 'typescript' }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file2'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file2'), overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor', { resource: URI.file('file2'), overrideIdentifier: 'typescript' }));

		assert.ok(testObject.affectsConfiguration('editor.lineNumbers'));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file1') }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file2') }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file1'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file1'), overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file1'), overrideIdentifier: 'typescript' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file2'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file2'), overrideIdentifier: 'markdown' }));
		assert.ok(testObject.affectsConfiguration('editor.lineNumbers', { resource: URI.file('file2'), overrideIdentifier: 'typescript' }));

		assert.ok(testObject.affectsConfiguration('editor.wordWrap'));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file2') }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file1'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file1'), overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file1'), overrideIdentifier: 'typescript' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file2'), overrideIdentifier: 'json' }));
		assert.ok(testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file2'), overrideIdentifier: 'markdown' }));
		assert.ok(!testObject.affectsConfiguration('editor.wordWrap', { resource: URI.file('file2'), overrideIdentifier: 'typescript' }));

		assert.ok(!testObject.affectsConfiguration('editor.fontSize'));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { resource: URI.file('file1') }));
		assert.ok(!testObject.affectsConfiguration('editor.fontSize', { resource: URI.file('file2') }));
	});

	test('changeEvent affecting tasks and launches', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({
			'launch': {
				'configuraiton': {}
			},
			'launch.version': 1,
			'tasks': {
				'version': 2
			}
		}));
		const testObject = new ConfigurationChangeEvent(change, undefined, configuration, undefined, new NullLogService());

		assert.deepStrictEqual([...testObject.affectedKeys], ['launch', 'launch.version', 'tasks']);
		assert.ok(testObject.affectsConfiguration('launch'));
		assert.ok(testObject.affectsConfiguration('launch.version'));
		assert.ok(testObject.affectsConfiguration('tasks'));
	});

	test('affectsConfiguration returns false for empty string', () => {
		const configuration = new TestConfiguration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()));
		const change = configuration.compareAndUpdateLocalUserConfiguration(toConfigurationModel({ 'window.zoomLevel': 1 }));
		const testObject = new ConfigurationChangeEvent(change, undefined, configuration, undefined, new NullLogService());

		assert.strictEqual(false, testObject.affectsConfiguration(''));
	});

});

suite('Configuration.Parse', () => {

	const logService = new NullLogService();
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parsing configuration only with local user configuration and raw is same', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, 'b': 1 }, keys: ['a'] }], undefined, logService)
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).userLocal, { value: undefined, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).userLocal, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).userRemote, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).user, { value: undefined, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).user, undefined);
	});

	test('parsing configuration only with local user configuration and raw is not same', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'a': 1, 'c': 1 }, ['a', 'c'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
				'a': 1,
				'b': 2,
				'c': 1,
				'd': 3,
				'[x][y]': {
					'a': 2,
					'b': 1
				}
			}, logService)
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 2, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('e', {}, undefined).userLocal, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('e', {}, undefined).userRemote, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'x' }, undefined).user, { value: 2, override: 1, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 1 }] });
		assert.deepStrictEqual(actual.inspect('d', {}, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('e', {}, undefined).user, undefined);
	});

	test('parsing configuration with local and remote user configuration and raw is same for both', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], undefined, logService),
			new ConfigurationModel({ 'b': 3 }, ['b'], [], undefined, logService)
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userLocal, undefined);
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userLocal, undefined);
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userLocal, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userRemote, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).user, undefined);
	});

	test('parsing configuration with local and remote user configuration and raw is not same for local user', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
				'a': 1,
				'b': 2,
				'c': 3,
				'[x][y]': {
					'a': 2,
					'b': 4,
				}
			}, logService),
			new ConfigurationModel({ 'b': 3 }, ['b'], [], undefined, logService)
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userLocal, { value: 2, override: undefined, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userLocal, { value: 2, override: 4, merged: 4, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, undefined);
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userRemote, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).user, { value: 3, merged: 3, override: undefined, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).user, undefined);
	});

	test('parsing configuration with local and remote user configuration and raw is not same for remote user', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'b': 3 }, ['b'], [], undefined, logService),
			new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
				'a': 1,
				'b': 2,
				'c': 3,
				'[x][y]': {
					'a': 2,
					'b': 4,
				}
			}, logService),
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, undefined);
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, undefined);
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userLocal, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userRemote, { value: 2, override: undefined, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userRemote, { value: 2, override: 4, merged: 4, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).user, undefined);
	});

	test('parsing configuration with local and remote user configuration and raw is not same for both', () => {
		const configuration = new TestConfiguration(
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ConfigurationModel({ 'b': 3 }, ['b'], [], {
				'a': 4,
				'b': 3
			}, logService),
			new ConfigurationModel({ 'a': 1 }, ['a'], [{ identifiers: ['x', 'y'], contents: { 'a': 2, }, keys: ['a'] }], {
				'a': 1,
				'b': 2,
				'c': 3,
				'[x][y]': {
					'a': 2,
					'b': 4,
				}
			}, logService),
		);

		const actual = Configuration.parse(configuration.toData(), logService);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userLocal, { value: 4, override: undefined, merged: 4, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userLocal, { value: 4, override: undefined, merged: 4, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userLocal, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userLocal, undefined);

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).userRemote, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).userRemote, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).userRemote, { value: 2, override: undefined, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).userRemote, { value: 2, override: 4, merged: 4, overrides: [{ identifiers: ['x', 'y'], value: 4 }] });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).userRemote, { value: 3, override: undefined, merged: 3, overrides: undefined });

		assert.deepStrictEqual(actual.inspect('a', {}, undefined).user, { value: 1, override: undefined, merged: 1, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('a', { overrideIdentifier: 'x' }, undefined).user, { value: 1, override: 2, merged: 2, overrides: [{ identifiers: ['x', 'y'], value: 2 }] });
		assert.deepStrictEqual(actual.inspect('b', {}, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('b', { overrideIdentifier: 'y' }, undefined).user, { value: 3, override: undefined, merged: 3, overrides: undefined });
		assert.deepStrictEqual(actual.inspect('c', {}, undefined).user, undefined);
	});


});

function toConfigurationModel(obj: Record<string, unknown>): ConfigurationModel {
	const parser = new ConfigurationModelParser('test', new NullLogService());
	parser.parse(JSON.stringify(obj));
	return parser.configurationModel;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/configurationRegistry.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/configurationRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../common/configurationRegistry.js';
import { Registry } from '../../../registry/common/platform.js';
import { PolicyCategory } from '../../../../base/common/policy.js';

suite('ConfigurationRegistry', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

	setup(() => reset());
	teardown(() => reset());

	function reset() {
		configurationRegistry.deregisterConfigurations(configurationRegistry.getConfigurations());
		configurationRegistry.deregisterDefaultConfigurations(configurationRegistry.getRegisteredDefaultConfigurations());
	}

	test('configuration override', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config': {
					'type': 'object',
				}
			}
		});
		configurationRegistry.registerDefaultConfigurations([{ overrides: { 'config': { a: 1, b: 2 } } }]);
		configurationRegistry.registerDefaultConfigurations([{ overrides: { '[lang]': { a: 2, c: 3 } } }]);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 1, b: 2 });
		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['[lang]'].default, { a: 2, c: 3 });
	});

	test('configuration override defaults - prevent overriding default value', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config.preventDefaultValueOverride': {
					'type': 'object',
					default: { a: 0 },
					'disallowConfigurationDefault': true
				}
			}
		});

		configurationRegistry.registerDefaultConfigurations([{ overrides: { 'config.preventDefaultValueOverride': { a: 1, b: 2 } } }]);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config.preventDefaultValueOverride'].default, { a: 0 });
	});

	test('configuration override defaults - merges defaults', async () => {
		configurationRegistry.registerDefaultConfigurations([{ overrides: { '[lang]': { a: 1, b: 2 } } }]);
		configurationRegistry.registerDefaultConfigurations([{ overrides: { '[lang]': { a: 2, c: 3 } } }]);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['[lang]'].default, { a: 2, b: 2, c: 3 });
	});

	test('configuration defaults - merge object default overrides', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config': {
					'type': 'object',
				}
			}
		});
		configurationRegistry.registerDefaultConfigurations([{ overrides: { 'config': { a: 1, b: 2 } } }]);
		configurationRegistry.registerDefaultConfigurations([{ overrides: { 'config': { a: 2, c: 3 } } }]);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 2, b: 2, c: 3 });
	});

	test('registering multiple settings with same policy', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'policy1': {
					'type': 'object',
					policy: {
						name: 'policy',
						category: PolicyCategory.Extensions,
						minimumVersion: '1.0.0',
						localization: { description: { key: '', value: '' }, }
					}
				},
				'policy2': {
					'type': 'object',
					policy: {
						name: 'policy',
						category: PolicyCategory.Extensions,
						minimumVersion: '1.0.0',
						localization: { description: { key: '', value: '' }, }
					}
				}
			}
		});
		const actual = configurationRegistry.getConfigurationProperties();
		assert.ok(actual['policy1'] !== undefined);
		assert.ok(actual['policy2'] === undefined);
	});

	test('configuration defaults - deregister merged object default override', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config': {
					'type': 'object',
				}
			}
		});

		const overrides1 = [{ overrides: { 'config': { a: 1, b: 2 } }, source: { id: 'source1', displayName: 'source1' } }];
		const overrides2 = [{ overrides: { 'config': { a: 2, c: 3 } }, source: { id: 'source2', displayName: 'source2' } }];

		configurationRegistry.registerDefaultConfigurations(overrides1);
		configurationRegistry.registerDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 2, b: 2, c: 3 });

		configurationRegistry.deregisterDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 1, b: 2 });

		configurationRegistry.deregisterDefaultConfigurations(overrides1);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, {});
	});

	test('configuration defaults - deregister merged object default override without source', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config': {
					'type': 'object',
				}
			}
		});

		const overrides1 = [{ overrides: { 'config': { a: 1, b: 2 } } }];
		const overrides2 = [{ overrides: { 'config': { a: 2, c: 3 } } }];

		configurationRegistry.registerDefaultConfigurations(overrides1);
		configurationRegistry.registerDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 2, b: 2, c: 3 });

		configurationRegistry.deregisterDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, { a: 1, b: 2 });

		configurationRegistry.deregisterDefaultConfigurations(overrides1);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['config'].default, {});
	});

	test('configuration defaults - deregister merged object default language overrides', async () => {
		configurationRegistry.registerConfiguration({
			'id': '_test_default',
			'type': 'object',
			'properties': {
				'config': {
					'type': 'object',
				}
			}
		});

		const overrides1 = [{ overrides: { '[lang]': { 'config': { a: 1, b: 2 } } }, source: { id: 'source1', displayName: 'source1' } }];
		const overrides2 = [{ overrides: { '[lang]': { 'config': { a: 2, c: 3 } } }, source: { id: 'source2', displayName: 'source2' } }];

		configurationRegistry.registerDefaultConfigurations(overrides1);
		configurationRegistry.registerDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['[lang]'].default, { 'config': { a: 2, b: 2, c: 3 } });

		configurationRegistry.deregisterDefaultConfigurations(overrides2);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['[lang]'].default, { 'config': { a: 1, b: 2 } });

		configurationRegistry.deregisterDefaultConfigurations(overrides1);

		assert.deepStrictEqual(configurationRegistry.getConfigurationProperties()['[lang]'], undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/configurations.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/configurations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../base/common/event.js';
import { equals } from '../../../../base/common/objects.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Extensions, IConfigurationNode, IConfigurationRegistry } from '../../common/configurationRegistry.js';
import { DefaultConfiguration } from '../../common/configurations.js';
import { NullLogService } from '../../../log/common/log.js';
import { Registry } from '../../../registry/common/platform.js';

suite('DefaultConfiguration', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);

	setup(() => reset());
	teardown(() => reset());

	function reset() {
		configurationRegistry.deregisterConfigurations(configurationRegistry.getConfigurations());
		configurationRegistry.deregisterDefaultConfigurations(configurationRegistry.getRegisteredDefaultConfigurations());
	}

	test('Test registering a property before initialize', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a': {
					'description': 'a',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		const actual = await testObject.initialize();
		assert.strictEqual(actual.getValue('a'), false);
	});

	test('Test registering a property and do not initialize', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a': {
					'description': 'a',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		assert.strictEqual(testObject.configurationModel.getValue('a'), undefined);
	});

	test('Test registering a property after initialize', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		await testObject.initialize();
		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'defaultConfiguration.testSetting1': {
					'description': 'a',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		const { defaults: actual, properties } = await promise;
		assert.strictEqual(actual.getValue('defaultConfiguration.testSetting1'), false);
		assert.deepStrictEqual(properties, ['defaultConfiguration.testSetting1']);
	});

	test('Test registering nested properties', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a.b': {
					'description': '1',
					'type': 'object',
					'default': {},
				},
				'a.b.c': {
					'description': '2',
					'type': 'object',
					'default': '2',
				}
			}
		});

		const actual = await testObject.initialize();

		assert.ok(equals(actual.getValue('a'), { b: { c: '2' } }));
		assert.ok(equals(actual.contents, { 'a': { b: { c: '2' } } }));
		assert.deepStrictEqual(actual.keys.sort(), ['a.b', 'a.b.c']);
	});

	test('Test registering the same property again', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a': {
					'description': 'a',
					'type': 'boolean',
					'default': true,
				}
			}
		});
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a': {
					'description': 'a',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		const actual = await testObject.initialize();
		assert.strictEqual(true, actual.getValue('a'));
	});

	test('Test registering an override identifier', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerDefaultConfigurations([{
			overrides: {
				'[a]': {
					'b': true
				}
			}
		}]);
		const actual = await testObject.initialize();
		assert.ok(equals(actual.getValue('[a]'), { 'b': true }));
		assert.ok(equals(actual.contents, { '[a]': { 'b': true } }));
		assert.ok(equals(actual.overrides, [{ contents: { 'b': true }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(actual.keys.sort(), ['[a]']);
		assert.strictEqual(actual.getOverrideValue('b', 'a'), true);
	});

	test('Test registering a normal property and override identifier', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'boolean',
					'default': false,
				}
			}
		});

		configurationRegistry.registerDefaultConfigurations([{
			overrides: {
				'[a]': {
					'b': true
				}
			}
		}]);

		const actual = await testObject.initialize();
		assert.deepStrictEqual(actual.getValue('b'), false);
		assert.ok(equals(actual.getValue('[a]'), { 'b': true }));
		assert.ok(equals(actual.contents, { 'b': false, '[a]': { 'b': true } }));
		assert.ok(equals(actual.overrides, [{ contents: { 'b': true }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(actual.keys.sort(), ['[a]', 'b']);
		assert.strictEqual(actual.getOverrideValue('b', 'a'), true);
	});

	test('Test normal property is registered after override identifier', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		configurationRegistry.registerDefaultConfigurations([{
			overrides: {
				'[a]': {
					'b': true
				}
			}
		}]);

		await testObject.initialize();

		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'boolean',
					'default': false,
				}
			}
		});

		const { defaults: actual, properties } = await promise;
		assert.deepStrictEqual(actual.getValue('b'), false);
		assert.ok(equals(actual.getValue('[a]'), { 'b': true }));
		assert.ok(equals(actual.contents, { 'b': false, '[a]': { 'b': true } }));
		assert.ok(equals(actual.overrides, [{ contents: { 'b': true }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(actual.keys.sort(), ['[a]', 'b']);
		assert.strictEqual(actual.getOverrideValue('b', 'a'), true);
		assert.deepStrictEqual(properties, ['b']);
	});

	test('Test override identifier is registered after property', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		await testObject.initialize();

		configurationRegistry.registerDefaultConfigurations([{
			overrides: {
				'[a]': {
					'b': true
				}
			}
		}]);

		const { defaults: actual, properties } = await promise;
		assert.deepStrictEqual(actual.getValue('b'), false);
		assert.ok(equals(actual.getValue('[a]'), { 'b': true }));
		assert.ok(equals(actual.contents, { 'b': false, '[a]': { 'b': true } }));
		assert.ok(equals(actual.overrides, [{ contents: { 'b': true }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(actual.keys.sort(), ['[a]', 'b']);
		assert.strictEqual(actual.getOverrideValue('b', 'a'), true);
		assert.deepStrictEqual(properties, ['[a]']);
	});

	test('Test register override identifier and property after initialize', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));

		await testObject.initialize();

		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		configurationRegistry.registerDefaultConfigurations([{
			overrides: {
				'[a]': {
					'b': true
				}
			}
		}]);

		const actual = testObject.configurationModel;
		assert.deepStrictEqual(actual.getValue('b'), false);
		assert.ok(equals(actual.getValue('[a]'), { 'b': true }));
		assert.ok(equals(actual.contents, { 'b': false, '[a]': { 'b': true } }));
		assert.ok(equals(actual.overrides, [{ contents: { 'b': true }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(actual.keys.sort(), ['[a]', 'b']);
		assert.strictEqual(actual.getOverrideValue('b', 'a'), true);
	});

	test('Test deregistering a property', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		const node: IConfigurationNode = {
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'a': {
					'description': 'a',
					'type': 'boolean',
					'default': false,
				}
			}
		};
		configurationRegistry.registerConfiguration(node);
		await testObject.initialize();
		configurationRegistry.deregisterConfigurations([node]);

		const { defaults: actual, properties } = await promise;
		assert.strictEqual(actual.getValue('a'), undefined);
		assert.ok(equals(actual.contents, {}));
		assert.deepStrictEqual(actual.keys, []);
		assert.deepStrictEqual(properties, ['a']);
	});

	test('Test deregistering an override identifier', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'a',
			'order': 1,
			'title': 'a',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'boolean',
					'default': false,
				}
			}
		});
		const node = {
			overrides: {
				'[a]': {
					'b': true
				}
			}
		};
		configurationRegistry.registerDefaultConfigurations([node]);
		await testObject.initialize();
		configurationRegistry.deregisterDefaultConfigurations([node]);
		assert.deepStrictEqual(testObject.configurationModel.getValue('[a]'), undefined);
		assert.ok(equals(testObject.configurationModel.contents, { 'b': false }));
		assert.ok(equals(testObject.configurationModel.overrides, []));
		assert.deepStrictEqual(testObject.configurationModel.keys, ['b']);
		assert.strictEqual(testObject.configurationModel.getOverrideValue('b', 'a'), undefined);
	});

	test('Test deregistering a merged language object setting', async () => {
		const testObject = disposables.add(new DefaultConfiguration(new NullLogService()));
		configurationRegistry.registerConfiguration({
			'id': 'b',
			'order': 1,
			'title': 'b',
			'type': 'object',
			'properties': {
				'b': {
					'description': 'b',
					'type': 'object',
					'default': {},
				}
			}
		});
		const node1 = {
			overrides: {
				'[a]': {
					'b': {
						'aa': '1',
						'bb': '2'
					}
				}
			},
			source: { id: 'source1', displayName: 'source1' }
		};

		const node2 = {
			overrides: {
				'[a]': {
					'b': {
						'bb': '20',
						'cc': '30'
					}
				}
			},
			source: { id: 'source2', displayName: 'source2' }
		};
		configurationRegistry.registerDefaultConfigurations([node1]);
		configurationRegistry.registerDefaultConfigurations([node2]);
		await testObject.initialize();

		configurationRegistry.deregisterDefaultConfigurations([node1]);
		assert.ok(equals(testObject.configurationModel.getValue('[a]'), { 'b': { 'bb': '20', 'cc': '30' } }));
		assert.ok(equals(testObject.configurationModel.contents, { '[a]': { 'b': { 'bb': '20', 'cc': '30' } }, 'b': {} }));
		assert.ok(equals(testObject.configurationModel.overrides, [{ contents: { 'b': { 'bb': '20', 'cc': '30' } }, identifiers: ['a'], keys: ['b'] }]));
		assert.deepStrictEqual(testObject.configurationModel.keys.sort(), ['[a]', 'b']);
		assert.ok(equals(testObject.configurationModel.getOverrideValue('b', 'a'), { 'bb': '20', 'cc': '30' }));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/configurationService.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/configurationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Event } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ConfigurationTarget, isConfigured } from '../../common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../common/configurationRegistry.js';
import { ConfigurationService } from '../../common/configurationService.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';
import { FilePolicyService } from '../../../policy/common/filePolicyService.js';
import { NullPolicyService } from '../../../policy/common/policy.js';
import { Registry } from '../../../registry/common/platform.js';
import { PolicyCategory } from '../../../../base/common/policy.js';

suite('ConfigurationService.test.ts', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let fileService: IFileService;
	let settingsResource: URI;

	setup(async () => {
		fileService = disposables.add(new FileService(new NullLogService()));
		const diskFileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(Schemas.file, diskFileSystemProvider));
		settingsResource = URI.file('settings.json');
	});

	test('simple', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "bar" }'));
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		const config = testObject.getValue<{
			foo: string;
		}>();

		assert.ok(config);
		assert.strictEqual(config.foo, 'bar');
	}));

	test('config gets flattened', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "testworkbench.editor.tabs": true }'));

		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		const config = testObject.getValue<{
			testworkbench: {
				editor: {
					tabs: boolean;
				};
			};
		}>();

		assert.ok(config);
		assert.ok(config.testworkbench);
		assert.ok(config.testworkbench.editor);
		assert.strictEqual(config.testworkbench.editor.tabs, true);
	}));

	test('error case does not explode', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await fileService.writeFile(settingsResource, VSBuffer.fromString(',,,,'));

		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		const config = testObject.getValue<{
			foo: string;
		}>();

		assert.ok(config);
	}));

	test('missing file does not explode', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const testObject = disposables.add(new ConfigurationService(URI.file('__testFile'), fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		const config = testObject.getValue<{ foo: string }>();

		assert.ok(config);
	}));

	test('trigger configuration change event when file does not exist', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		return new Promise<void>((c, e) => {
			disposables.add(Event.filter(testObject.onDidChangeConfiguration, e => e.source === ConfigurationTarget.USER)(() => {
				assert.strictEqual(testObject.getValue('foo'), 'bar');
				c();
			}));
			fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "bar" }')).catch(e);
		});

	}));

	test('trigger configuration change event when file exists', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "bar" }'));
		await testObject.initialize();

		return new Promise<void>((c) => {
			disposables.add(Event.filter(testObject.onDidChangeConfiguration, e => e.source === ConfigurationTarget.USER)(async (e) => {
				assert.strictEqual(testObject.getValue('foo'), 'barz');
				c();
			}));
			fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "barz" }'));
		});
	}));

	test('reloadConfiguration', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "bar" }'));

		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		let config = testObject.getValue<{
			foo: string;
		}>();
		assert.ok(config);
		assert.strictEqual(config.foo, 'bar');
		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "foo": "changed" }'));

		// force a reload to get latest
		await testObject.reloadConfiguration();
		config = testObject.getValue<{
			foo: string;
		}>();
		assert.ok(config);
		assert.strictEqual(config.foo, 'changed');
	}));

	test('model defaults', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		interface ITestSetting {
			configuration: {
				service: {
					testSetting: string;
				};
			};
		}

		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configuration.service.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});

		let testObject = disposables.add(new ConfigurationService(URI.file('__testFile'), fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();
		let setting = testObject.getValue<ITestSetting>();

		assert.ok(setting);
		assert.strictEqual(setting.configuration.service.testSetting, 'isSet');

		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "testworkbench.editor.tabs": true }'));
		testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		setting = testObject.getValue<ITestSetting>();

		assert.ok(setting);
		assert.strictEqual(setting.configuration.service.testSetting, 'isSet');

		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "configuration.service.testSetting": "isChanged" }'));

		await testObject.reloadConfiguration();
		setting = testObject.getValue<ITestSetting>();
		assert.ok(setting);
		assert.strictEqual(setting.configuration.service.testSetting, 'isChanged');
	}));

	test('lookup', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'lookup.service.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});

		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		let res = testObject.inspect('something.missing');
		assert.strictEqual(res.value, undefined);
		assert.strictEqual(res.defaultValue, undefined);
		assert.strictEqual(res.userValue, undefined);
		assert.strictEqual(isConfigured(res), false);

		res = testObject.inspect('lookup.service.testSetting');
		assert.strictEqual(res.defaultValue, 'isSet');
		assert.strictEqual(res.value, 'isSet');
		assert.strictEqual(res.userValue, undefined);
		assert.strictEqual(isConfigured(res), false);

		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "lookup.service.testSetting": "bar" }'));

		await testObject.reloadConfiguration();
		res = testObject.inspect('lookup.service.testSetting');
		assert.strictEqual(res.defaultValue, 'isSet');
		assert.strictEqual(res.userValue, 'bar');
		assert.strictEqual(res.value, 'bar');
		assert.strictEqual(isConfigured(res), true);

	}));

	test('lookup with null', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_testNull',
			'type': 'object',
			'properties': {
				'lookup.service.testNullSetting': {
					'type': 'null',
				}
			}
		});

		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		let res = testObject.inspect('lookup.service.testNullSetting');
		assert.strictEqual(res.defaultValue, null);
		assert.strictEqual(res.value, null);
		assert.strictEqual(res.userValue, undefined);

		await fileService.writeFile(settingsResource, VSBuffer.fromString('{ "lookup.service.testNullSetting": null }'));

		await testObject.reloadConfiguration();

		res = testObject.inspect('lookup.service.testNullSetting');
		assert.strictEqual(res.defaultValue, null);
		assert.strictEqual(res.value, null);
		assert.strictEqual(res.userValue, null);
	}));

	test('update configuration', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		await testObject.updateValue('configurationService.testSetting', 'value');
		assert.strictEqual(testObject.getValue('configurationService.testSetting'), 'value');
	});

	test('update configuration when exist', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		await testObject.updateValue('configurationService.testSetting', 'value');
		await testObject.updateValue('configurationService.testSetting', 'updatedValue');
		assert.strictEqual(testObject.getValue('configurationService.testSetting'), 'updatedValue');
	});

	test('update configuration to default value should remove', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		await testObject.updateValue('configurationService.testSetting', 'value');
		await testObject.updateValue('configurationService.testSetting', 'isSet');
		const inspect = testObject.inspect('configurationService.testSetting');

		assert.strictEqual(inspect.userValue, undefined);
	});

	test('update configuration should remove when undefined is passed', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		await testObject.updateValue('configurationService.testSetting', 'value');
		await testObject.updateValue('configurationService.testSetting', undefined);
		const inspect = testObject.inspect('configurationService.testSetting');

		assert.strictEqual(inspect.userValue, undefined);
	});

	test('update unknown configuration', async () => {
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		await testObject.updateValue('configurationService.unknownSetting', 'value');
		assert.strictEqual(testObject.getValue('configurationService.unknownSetting'), 'value');
	});

	test('update configuration in non user target throws error', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.testSetting': {
					'type': 'string',
					'default': 'isSet'
				}
			}
		});
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, new NullPolicyService(), new NullLogService()));
		await testObject.initialize();

		try {
			await testObject.updateValue('configurationService.testSetting', 'value', ConfigurationTarget.WORKSPACE);
			assert.fail('Should fail with error');
		} catch (e) {
			// succeess
		}
	});

	test('update configuration throws error for policy setting', async () => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': '_test',
			'type': 'object',
			'properties': {
				'configurationService.policySetting': {
					'type': 'string',
					'default': 'isSet',
					policy: {
						name: 'configurationService.policySetting',
						category: PolicyCategory.Extensions,
						minimumVersion: '1.0.0',
						localization: { description: { key: '', value: '' }, }
					}
				}
			}
		});

		const logService = new NullLogService();
		const policyFile = URI.file('policies.json');
		await fileService.writeFile(policyFile, VSBuffer.fromString('{ "configurationService.policySetting": "policyValue" }'));
		const policyService = disposables.add(new FilePolicyService(policyFile, fileService, logService));
		const testObject = disposables.add(new ConfigurationService(settingsResource, fileService, policyService, logService));
		await testObject.initialize();

		try {
			await testObject.updateValue('configurationService.policySetting', 'value');
			assert.fail('Should throw error');
		} catch (error) {
			// succeess
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/policyConfiguration.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/policyConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { DefaultConfiguration, PolicyConfiguration } from '../../common/configurations.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';
import { Extensions, IConfigurationNode, IConfigurationRegistry } from '../../common/configurationRegistry.js';
import { Registry } from '../../../registry/common/platform.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { deepClone } from '../../../../base/common/objects.js';
import { IPolicyService } from '../../../policy/common/policy.js';
import { FilePolicyService } from '../../../policy/common/filePolicyService.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { PolicyCategory } from '../../../../base/common/policy.js';

suite('PolicyConfiguration', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let testObject: PolicyConfiguration;
	let fileService: IFileService;
	let policyService: IPolicyService;
	const policyFile = URI.file('policyFile').with({ scheme: 'vscode-tests' });
	const policyConfigurationNode: IConfigurationNode = {
		'id': 'policyConfiguration',
		'order': 1,
		'title': 'a',
		'type': 'object',
		'properties': {
			'policy.settingA': {
				'type': 'string',
				'default': 'defaultValueA',
				policy: {
					name: 'PolicySettingA',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'policy.settingB': {
				'type': 'string',
				'default': 'defaultValueB',
				policy: {
					name: 'PolicySettingB',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'policy.objectSetting': {
				'type': 'object',
				'default': {},
				policy: {
					name: 'PolicyObjectSetting',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'policy.arraySetting': {
				'type': 'object',
				'default': [],
				policy: {
					name: 'PolicyArraySetting',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'policy.booleanSetting': {
				'type': 'boolean',
				'default': true,
				policy: {
					name: 'PolicyBooleanSetting',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'policy.internalSetting': {
				'type': 'string',
				'default': 'defaultInternalValue',
				included: false,
				policy: {
					name: 'PolicyInternalSetting',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.0.0',
					localization: { description: { key: '', value: '' }, }
				}
			},
			'nonPolicy.setting': {
				'type': 'boolean',
				'default': true
			}
		}
	};

	suiteSetup(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(policyConfigurationNode));
	suiteTeardown(() => Registry.as<IConfigurationRegistry>(Extensions.Configuration).deregisterConfigurations([policyConfigurationNode]));

	setup(async () => {
		const defaultConfiguration = disposables.add(new DefaultConfiguration(new NullLogService()));
		await defaultConfiguration.initialize();
		fileService = disposables.add(new FileService(new NullLogService()));
		const diskFileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(policyFile.scheme, diskFileSystemProvider));
		policyService = disposables.add(new FilePolicyService(policyFile, fileService, new NullLogService()));
		testObject = disposables.add(new PolicyConfiguration(defaultConfiguration, policyService, new NullLogService()));
	});

	test('initialize: with policies', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA' })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.strictEqual(acutal.getValue('policy.settingA'), 'policyValueA');
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.settingA']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('initialize: no policies', async () => {
		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.keys, []);
		assert.deepStrictEqual(acutal.overrides, []);
		assert.strictEqual(acutal.getValue('policy.settingA'), undefined);
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
	});

	test('initialize: with policies but not registered', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA', 'PolicySettingB': 'policyValueB', 'PolicySettingC': 'policyValueC' })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.strictEqual(acutal.getValue('policy.settingA'), 'policyValueA');
		assert.strictEqual(acutal.getValue('policy.settingB'), 'policyValueB');
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.settingA', 'policy.settingB']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('initialize: with object type policy', async () => {
		const expected = {
			'microsoft': true,
			'github': 'stable',
			'other': 1,
			'complex': {
				'key': 'value'
			},
			'array': [1, 2, 3]
		};
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyObjectSetting': JSON.stringify(expected) })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.objectSetting'), expected);
	});

	test('initialize: with array type policy', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyArraySetting': JSON.stringify([1]) })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.arraySetting'), [1]);
	});

	test('initialize: with boolean type policy as false', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyBooleanSetting': false })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.booleanSetting'), false);
	});

	test('initialize: with boolean type policy as true', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyBooleanSetting': true })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.booleanSetting'), true);
	});

	test('initialize: with object type policy ignores policy if value is not valid', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyObjectSetting': '{"a": "b", "hello": }' })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.objectSetting'), undefined);
	});

	test('initialize: with object type policy ignores policy if there are duplicate keys', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyObjectSetting': '{"microsoft": true, "microsoft": false }' })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.deepStrictEqual(acutal.getValue('policy.objectSetting'), undefined);
	});

	test('change: when policy is added', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA' })));
		await testObject.initialize();

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			const promise = Event.toPromise(testObject.onDidChangeConfiguration);
			await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA', 'PolicySettingB': 'policyValueB', 'PolicySettingC': 'policyValueC' })));
			await promise;
		});

		const acutal = testObject.configurationModel;
		assert.strictEqual(acutal.getValue('policy.settingA'), 'policyValueA');
		assert.strictEqual(acutal.getValue('policy.settingB'), 'policyValueB');
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.settingA', 'policy.settingB']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('change: when policy is updated', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA' })));
		await testObject.initialize();

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			const promise = Event.toPromise(testObject.onDidChangeConfiguration);
			await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueAChanged' })));
			await promise;
		});

		const acutal = testObject.configurationModel;
		assert.strictEqual(acutal.getValue('policy.settingA'), 'policyValueAChanged');
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.settingA']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('change: when policy is removed', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA' })));
		await testObject.initialize();

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			const promise = Event.toPromise(testObject.onDidChangeConfiguration);
			await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({})));
			await promise;
		});

		const acutal = testObject.configurationModel;
		assert.strictEqual(acutal.getValue('policy.settingA'), undefined);
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, []);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('change: when policy setting is registered', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingC': 'policyValueC' })));
		await testObject.initialize();

		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		policyConfigurationNode.properties!['policy.settingC'] = {
			'type': 'string',
			'default': 'defaultValueC',
			policy: {
				name: 'PolicySettingC',
				category: PolicyCategory.Extensions,
				minimumVersion: '1.0.0',
				localization: { description: { key: '', value: '' }, },
			}
		};
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(deepClone(policyConfigurationNode));
		await promise;

		const acutal = testObject.configurationModel;
		assert.strictEqual(acutal.getValue('policy.settingC'), 'policyValueC');
		assert.strictEqual(acutal.getValue('policy.settingA'), undefined);
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.settingC']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('change: when policy setting is deregistered', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicySettingA': 'policyValueA' })));
		await testObject.initialize();

		const promise = Event.toPromise(testObject.onDidChangeConfiguration);
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).deregisterConfigurations([policyConfigurationNode]);
		await promise;

		const acutal = testObject.configurationModel;
		assert.strictEqual(acutal.getValue('policy.settingA'), undefined);
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, []);
		assert.deepStrictEqual(acutal.overrides, []);
	});

	test('initialize: with internal policies', async () => {
		await fileService.writeFile(policyFile, VSBuffer.fromString(JSON.stringify({ 'PolicyInternalSetting': 'internalValue' })));

		await testObject.initialize();
		const acutal = testObject.configurationModel;

		assert.strictEqual(acutal.getValue('policy.settingA'), undefined);
		assert.strictEqual(acutal.getValue('policy.settingB'), undefined);
		assert.strictEqual(acutal.getValue('policy.internalSetting'), 'internalValue');
		assert.strictEqual(acutal.getValue('nonPolicy.setting'), undefined);
		assert.deepStrictEqual(acutal.keys, ['policy.internalSetting']);
		assert.deepStrictEqual(acutal.overrides, []);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/testConfigurationService.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/testConfigurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { URI } from '../../../../base/common/uri.js';
import { getConfigurationValue, IConfigurationChangeEvent, IConfigurationOverrides, IConfigurationService, IConfigurationValue, isConfigurationOverrides } from '../../common/configuration.js';
import { Extensions, IConfigurationRegistry } from '../../common/configurationRegistry.js';
import { Registry } from '../../../registry/common/platform.js';

export class TestConfigurationService implements IConfigurationService {
	public _serviceBrand: undefined;

	private configuration: Record<string, unknown>;
	readonly onDidChangeConfigurationEmitter = new Emitter<IConfigurationChangeEvent>();
	readonly onDidChangeConfiguration = this.onDidChangeConfigurationEmitter.event;

	constructor(configuration?: Record<string, unknown>) {
		this.configuration = configuration || Object.create(null);
	}

	private configurationByRoot: TernarySearchTree<string, Record<string, unknown>> = TernarySearchTree.forPaths<Record<string, unknown>>();

	public reloadConfiguration<T>(): Promise<T> {
		return Promise.resolve(this.getValue() as T);
	}

	public getValue<T>(arg1?: string | IConfigurationOverrides, arg2?: IConfigurationOverrides): T | undefined {
		let configuration;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : undefined;
		if (overrides) {
			if (overrides.resource) {
				configuration = this.configurationByRoot.findSubstr(overrides.resource.fsPath);
			}
		}
		configuration = configuration ? configuration : this.configuration;
		if (arg1 && typeof arg1 === 'string') {
			return (configuration[arg1] ?? getConfigurationValue(configuration, arg1)) as T;
		}
		return configuration as T;
	}

	public updateValue(key: string, value: unknown): Promise<void> {
		return Promise.resolve(undefined);
	}

	public setUserConfiguration(key: string, value: unknown, root?: URI): Promise<void> {
		if (root) {
			const configForRoot = this.configurationByRoot.get(root.fsPath) || Object.create(null);
			configForRoot[key] = value;
			this.configurationByRoot.set(root.fsPath, configForRoot);
		} else {
			this.configuration[key] = value;
		}

		return Promise.resolve(undefined);
	}

	private overrideIdentifiers: Map<string, string[]> = new Map();
	public setOverrideIdentifiers(key: string, identifiers: string[]): void {
		this.overrideIdentifiers.set(key, identifiers);
	}

	public inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<T> {
		const value = this.getValue(key, overrides) as T;

		return {
			value,
			defaultValue: undefined,
			userValue: value,
			userLocalValue: value,
			overrideIdentifiers: this.overrideIdentifiers.get(key)
		};
	}

	public keys() {
		return {
			default: Object.keys(Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationProperties()),
			policy: [],
			user: Object.keys(this.configuration),
			workspace: [],
			workspaceFolder: []
		};
	}

	public getConfigurationData() {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/browser/contextKeyService.ts]---
Location: vscode-main/src/vs/platform/contextkey/browser/contextKeyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event, PauseableEmitter } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { MarshalledObject } from '../../../base/common/marshalling.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { cloneAndChange, distinct, equals } from '../../../base/common/objects.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { CommandsRegistry } from '../../commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../configuration/common/configuration.js';
import { ContextKeyExpression, ContextKeyInfo, ContextKeyValue, IContext, IContextKey, IContextKeyChangeEvent, IContextKeyService, IContextKeyServiceTarget, IReadableSet, IScopedContextKeyService, RawContextKey } from '../common/contextkey.js';
import { ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { InputFocusedContext } from '../common/contextkeys.js';
import { mainWindow } from '../../../base/browser/window.js';
import { addDisposableListener, EventType, getActiveWindow, isEditableElement, onDidRegisterWindow, trackFocus } from '../../../base/browser/dom.js';

const KEYBINDING_CONTEXT_ATTR = 'data-keybinding-context';

export class Context implements IContext {

	protected _parent: Context | null;
	protected _value: Record<string, any>;
	protected _id: number;

	constructor(id: number, parent: Context | null) {
		this._id = id;
		this._parent = parent;
		this._value = Object.create(null);
		this._value['_contextId'] = id;
	}

	public get value(): Record<string, any> {
		return { ...this._value };
	}

	public setValue(key: string, value: any): boolean {
		// console.log('SET ' + key + ' = ' + value + ' ON ' + this._id);
		if (!equals(this._value[key], value)) {
			this._value[key] = value;
			return true;
		}
		return false;
	}

	public removeValue(key: string): boolean {
		// console.log('REMOVE ' + key + ' FROM ' + this._id);
		if (key in this._value) {
			delete this._value[key];
			return true;
		}
		return false;
	}

	public getValue<T>(key: string): T | undefined {
		const ret = this._value[key];
		if (typeof ret === 'undefined' && this._parent) {
			return this._parent.getValue<T>(key);
		}
		return ret;
	}

	public updateParent(parent: Context): void {
		this._parent = parent;
	}

	public collectAllValues(): Record<string, any> {
		let result = this._parent ? this._parent.collectAllValues() : Object.create(null);
		result = { ...result, ...this._value };
		delete result['_contextId'];
		return result;
	}
}

class NullContext extends Context {

	static readonly INSTANCE = new NullContext();

	constructor() {
		super(-1, null);
	}

	public override setValue(key: string, value: any): boolean {
		return false;
	}

	public override removeValue(key: string): boolean {
		return false;
	}

	public override getValue<T>(key: string): T | undefined {
		return undefined;
	}

	override collectAllValues(): { [key: string]: any } {
		return Object.create(null);
	}
}

class ConfigAwareContextValuesContainer extends Context {
	private static readonly _keyPrefix = 'config.';

	private readonly _values = TernarySearchTree.forConfigKeys<any>();
	private readonly _listener: IDisposable;

	constructor(
		id: number,
		private readonly _configurationService: IConfigurationService,
		emitter: Emitter<IContextKeyChangeEvent>
	) {
		super(id, null);

		this._listener = this._configurationService.onDidChangeConfiguration(event => {
			if (event.source === ConfigurationTarget.DEFAULT) {
				// new setting, reset everything
				const allKeys = Array.from(this._values, ([k]) => k);
				this._values.clear();
				emitter.fire(new ArrayContextKeyChangeEvent(allKeys));
			} else {
				const changedKeys: string[] = [];
				for (const configKey of event.affectedKeys) {
					const contextKey = `config.${configKey}`;

					const cachedItems = this._values.findSuperstr(contextKey);
					if (cachedItems !== undefined) {
						changedKeys.push(...Iterable.map(cachedItems, ([key]) => key));
						this._values.deleteSuperstr(contextKey);
					}

					if (this._values.has(contextKey)) {
						changedKeys.push(contextKey);
						this._values.delete(contextKey);
					}
				}

				emitter.fire(new ArrayContextKeyChangeEvent(changedKeys));
			}
		});
	}

	dispose(): void {
		this._listener.dispose();
	}

	override getValue(key: string): any {

		if (key.indexOf(ConfigAwareContextValuesContainer._keyPrefix) !== 0) {
			return super.getValue(key);
		}

		if (this._values.has(key)) {
			return this._values.get(key);
		}

		const configKey = key.substr(ConfigAwareContextValuesContainer._keyPrefix.length);
		const configValue = this._configurationService.getValue(configKey);
		let value: any = undefined;
		switch (typeof configValue) {
			case 'number':
			case 'boolean':
			case 'string':
				value = configValue;
				break;
			default:
				if (Array.isArray(configValue)) {
					value = JSON.stringify(configValue);
				} else {
					value = configValue;
				}
		}

		this._values.set(key, value);
		return value;
	}

	override setValue(key: string, value: any): boolean {
		return super.setValue(key, value);
	}

	override removeValue(key: string): boolean {
		return super.removeValue(key);
	}

	override collectAllValues(): { [key: string]: any } {
		const result: { [key: string]: any } = Object.create(null);
		this._values.forEach((value, index) => result[index] = value);
		return { ...result, ...super.collectAllValues() };
	}
}

class ContextKey<T extends ContextKeyValue> implements IContextKey<T> {

	private _service: AbstractContextKeyService;
	private _key: string;
	private _defaultValue: T | undefined;

	constructor(service: AbstractContextKeyService, key: string, defaultValue: T | undefined) {
		this._service = service;
		this._key = key;
		this._defaultValue = defaultValue;
		this.reset();
	}

	public set(value: T): void {
		this._service.setContext(this._key, value);
	}

	public reset(): void {
		if (typeof this._defaultValue === 'undefined') {
			this._service.removeContext(this._key);
		} else {
			this._service.setContext(this._key, this._defaultValue);
		}
	}

	public get(): T | undefined {
		return this._service.getContextKeyValue<T>(this._key);
	}
}

class SimpleContextKeyChangeEvent implements IContextKeyChangeEvent {
	constructor(readonly key: string) { }
	affectsSome(keys: IReadableSet<string>): boolean {
		return keys.has(this.key);
	}
	allKeysContainedIn(keys: IReadableSet<string>): boolean {
		return this.affectsSome(keys);
	}
}

class ArrayContextKeyChangeEvent implements IContextKeyChangeEvent {
	constructor(readonly keys: string[]) { }
	affectsSome(keys: IReadableSet<string>): boolean {
		for (const key of this.keys) {
			if (keys.has(key)) {
				return true;
			}
		}
		return false;
	}
	allKeysContainedIn(keys: IReadableSet<string>): boolean {
		return this.keys.every(key => keys.has(key));
	}
}

class CompositeContextKeyChangeEvent implements IContextKeyChangeEvent {
	constructor(readonly events: IContextKeyChangeEvent[]) { }
	affectsSome(keys: IReadableSet<string>): boolean {
		for (const e of this.events) {
			if (e.affectsSome(keys)) {
				return true;
			}
		}
		return false;
	}
	allKeysContainedIn(keys: IReadableSet<string>): boolean {
		return this.events.every(evt => evt.allKeysContainedIn(keys));
	}
}

function allEventKeysInContext(event: IContextKeyChangeEvent, context: Record<string, any>): boolean {
	return event.allKeysContainedIn(new Set(Object.keys(context)));
}

export abstract class AbstractContextKeyService extends Disposable implements IContextKeyService {
	declare _serviceBrand: undefined;

	protected _isDisposed: boolean;
	protected _myContextId: number;

	protected _onDidChangeContext = this._register(new PauseableEmitter<IContextKeyChangeEvent>({ merge: input => new CompositeContextKeyChangeEvent(input) }));
	get onDidChangeContext() { return this._onDidChangeContext.event; }

	constructor(myContextId: number) {
		super();
		this._isDisposed = false;
		this._myContextId = myContextId;
	}

	public get contextId(): number {
		return this._myContextId;
	}

	public createKey<T extends ContextKeyValue>(key: string, defaultValue: T | undefined): IContextKey<T> {
		if (this._isDisposed) {
			throw new Error(`AbstractContextKeyService has been disposed`);
		}
		return new ContextKey(this, key, defaultValue);
	}


	bufferChangeEvents(callback: Function): void {
		this._onDidChangeContext.pause();
		try {
			callback();
		} finally {
			this._onDidChangeContext.resume();
		}
	}

	public createScoped(domNode: IContextKeyServiceTarget): IScopedContextKeyService {
		if (this._isDisposed) {
			throw new Error(`AbstractContextKeyService has been disposed`);
		}
		return new ScopedContextKeyService(this, domNode);
	}

	createOverlay(overlay: Iterable<[string, any]> = Iterable.empty()): IContextKeyService {
		if (this._isDisposed) {
			throw new Error(`AbstractContextKeyService has been disposed`);
		}
		return new OverlayContextKeyService(this, overlay);
	}

	public contextMatchesRules(rules: ContextKeyExpression | undefined): boolean {
		if (this._isDisposed) {
			throw new Error(`AbstractContextKeyService has been disposed`);
		}
		const context = this.getContextValuesContainer(this._myContextId);
		const result = (rules ? rules.evaluate(context) : true);
		// console.group(rules.serialize() + ' -> ' + result);
		// rules.keys().forEach(key => { console.log(key, ctx[key]); });
		// console.groupEnd();
		return result;
	}

	public getContextKeyValue<T>(key: string): T | undefined {
		if (this._isDisposed) {
			return undefined;
		}
		return this.getContextValuesContainer(this._myContextId).getValue<T>(key);
	}

	public setContext(key: string, value: any): void {
		if (this._isDisposed) {
			return;
		}
		const myContext = this.getContextValuesContainer(this._myContextId);
		if (!myContext) {
			return;
		}
		if (myContext.setValue(key, value)) {
			this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key));
		}
	}

	public removeContext(key: string): void {
		if (this._isDisposed) {
			return;
		}
		if (this.getContextValuesContainer(this._myContextId).removeValue(key)) {
			this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key));
		}
	}

	public getContext(target: IContextKeyServiceTarget | null): IContext {
		if (this._isDisposed) {
			return NullContext.INSTANCE;
		}
		return this.getContextValuesContainer(findContextAttr(target));
	}

	public abstract getContextValuesContainer(contextId: number): Context;
	public abstract createChildContext(parentContextId?: number): number;
	public abstract disposeContext(contextId: number): void;
	public abstract updateParent(parentContextKeyService?: IContextKeyService): void;

	public override dispose(): void {
		super.dispose();
		this._isDisposed = true;
	}
}

export class ContextKeyService extends AbstractContextKeyService implements IContextKeyService {

	private _lastContextId: number;
	private readonly _contexts = new Map<number, Context>();

	private inputFocusedContext: IContextKey<boolean>;

	constructor(@IConfigurationService configurationService: IConfigurationService) {
		super(0);
		this._lastContextId = 0;
		this.inputFocusedContext = InputFocusedContext.bindTo(this);

		const myContext = this._register(new ConfigAwareContextValuesContainer(this._myContextId, configurationService, this._onDidChangeContext));
		this._contexts.set(this._myContextId, myContext);

		// Uncomment this to see the contexts continuously logged
		// let lastLoggedValue: string | null = null;
		// setInterval(() => {
		// 	let values = Object.keys(this._contexts).map((key) => this._contexts[key]);
		// 	let logValue = values.map(v => JSON.stringify(v._value, null, '\t')).join('\n');
		// 	if (lastLoggedValue !== logValue) {
		// 		lastLoggedValue = logValue;
		// 		console.log(lastLoggedValue);
		// 	}
		// }, 2000);

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const onFocusDisposables = disposables.add(new MutableDisposable<DisposableStore>());
			disposables.add(addDisposableListener(window, EventType.FOCUS_IN, () => {
				onFocusDisposables.value = new DisposableStore();
				this.updateInputContextKeys(window.document, onFocusDisposables.value);
			}, true));
		}, { window: mainWindow, disposables: this._store }));
	}

	private updateInputContextKeys(ownerDocument: Document, disposables: DisposableStore): void {

		function activeElementIsInput(): boolean {
			return !!ownerDocument.activeElement && isEditableElement(ownerDocument.activeElement);
		}

		const isInputFocused = activeElementIsInput();
		this.inputFocusedContext.set(isInputFocused);

		if (isInputFocused) {
			const tracker = disposables.add(trackFocus(ownerDocument.activeElement as HTMLElement));
			Event.once(tracker.onDidBlur)(() => {

				// Ensure we are only updating the context key if we are
				// still in the same document that we are tracking. This
				// fixes a race condition in multi-window setups where
				// the blur event arrives in the inactive window overwriting
				// the context key of the active window. This is because
				// blur events from the focus tracker are emitted with a
				// timeout of 0.

				if (getActiveWindow().document === ownerDocument) {
					this.inputFocusedContext.set(activeElementIsInput());
				}

				tracker.dispose();
			}, undefined, disposables);
		}
	}

	public getContextValuesContainer(contextId: number): Context {
		if (this._isDisposed) {
			return NullContext.INSTANCE;
		}
		return this._contexts.get(contextId) || NullContext.INSTANCE;
	}

	public createChildContext(parentContextId: number = this._myContextId): number {
		if (this._isDisposed) {
			throw new Error(`ContextKeyService has been disposed`);
		}
		const id = (++this._lastContextId);
		this._contexts.set(id, new Context(id, this.getContextValuesContainer(parentContextId)));
		return id;
	}

	public disposeContext(contextId: number): void {
		if (!this._isDisposed) {
			this._contexts.delete(contextId);
		}
	}

	public updateParent(_parentContextKeyService: IContextKeyService): void {
		throw new Error('Cannot update parent of root ContextKeyService');
	}
}

class ScopedContextKeyService extends AbstractContextKeyService {

	private _parent: AbstractContextKeyService;
	private _domNode: IContextKeyServiceTarget;

	private readonly _parentChangeListener = this._register(new MutableDisposable());

	constructor(parent: AbstractContextKeyService, domNode: IContextKeyServiceTarget) {
		super(parent.createChildContext());
		this._parent = parent;
		this._updateParentChangeListener();

		this._domNode = domNode;
		if (this._domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
			let extraInfo = '';
			if ((this._domNode as HTMLElement).classList) {
				extraInfo = Array.from((this._domNode as HTMLElement).classList.values()).join(', ');
			}

			console.error(`Element already has context attribute${extraInfo ? ': ' + extraInfo : ''}`);
		}
		this._domNode.setAttribute(KEYBINDING_CONTEXT_ATTR, String(this._myContextId));
	}

	private _updateParentChangeListener(): void {
		// Forward parent events to this listener. Parent will change.
		this._parentChangeListener.value = this._parent.onDidChangeContext(e => {
			const thisContainer = this._parent.getContextValuesContainer(this._myContextId);
			const thisContextValues = thisContainer.value;

			if (!allEventKeysInContext(e, thisContextValues)) {
				this._onDidChangeContext.fire(e);
			}
		});
	}

	public override dispose(): void {
		if (this._isDisposed) {
			return;
		}

		this._parent.disposeContext(this._myContextId);
		this._domNode.removeAttribute(KEYBINDING_CONTEXT_ATTR);
		super.dispose();
	}

	public getContextValuesContainer(contextId: number): Context {
		if (this._isDisposed) {
			return NullContext.INSTANCE;
		}
		return this._parent.getContextValuesContainer(contextId);
	}

	public createChildContext(parentContextId: number = this._myContextId): number {
		if (this._isDisposed) {
			throw new Error(`ScopedContextKeyService has been disposed`);
		}
		return this._parent.createChildContext(parentContextId);
	}

	public disposeContext(contextId: number): void {
		if (this._isDisposed) {
			return;
		}
		this._parent.disposeContext(contextId);
	}

	public updateParent(parentContextKeyService: AbstractContextKeyService): void {
		if (this._parent === parentContextKeyService) {
			return;
		}

		const thisContainer = this._parent.getContextValuesContainer(this._myContextId);
		const oldAllValues = thisContainer.collectAllValues();
		this._parent = parentContextKeyService;
		this._updateParentChangeListener();
		const newParentContainer = this._parent.getContextValuesContainer(this._parent.contextId);
		thisContainer.updateParent(newParentContainer);

		const newAllValues = thisContainer.collectAllValues();
		const allValuesDiff = {
			...distinct(oldAllValues, newAllValues),
			...distinct(newAllValues, oldAllValues)
		};
		const changedKeys = Object.keys(allValuesDiff);

		this._onDidChangeContext.fire(new ArrayContextKeyChangeEvent(changedKeys));
	}
}

class OverlayContext implements IContext {

	constructor(private parent: IContext, private overlay: ReadonlyMap<string, any>) { }

	getValue<T extends ContextKeyValue>(key: string): T | undefined {
		return this.overlay.has(key) ? this.overlay.get(key) : this.parent.getValue<T>(key);
	}
}

class OverlayContextKeyService implements IContextKeyService {

	declare _serviceBrand: undefined;
	private overlay: Map<string, any>;

	get contextId(): number {
		return this.parent.contextId;
	}

	get onDidChangeContext(): Event<IContextKeyChangeEvent> {
		return this.parent.onDidChangeContext;
	}

	constructor(private parent: AbstractContextKeyService | OverlayContextKeyService, overlay: Iterable<[string, any]>) {
		this.overlay = new Map(overlay);
	}

	bufferChangeEvents(callback: Function): void {
		this.parent.bufferChangeEvents(callback);
	}

	createKey<T extends ContextKeyValue>(): IContextKey<T> {
		throw new Error('Not supported.');
	}

	getContext(target: IContextKeyServiceTarget | null): IContext {
		return new OverlayContext(this.parent.getContext(target), this.overlay);
	}

	getContextValuesContainer(contextId: number): IContext {
		const parentContext = this.parent.getContextValuesContainer(contextId);
		return new OverlayContext(parentContext, this.overlay);
	}

	contextMatchesRules(rules: ContextKeyExpression | undefined): boolean {
		const context = this.getContextValuesContainer(this.contextId);
		const result = (rules ? rules.evaluate(context) : true);
		return result;
	}

	getContextKeyValue<T>(key: string): T | undefined {
		return this.overlay.has(key) ? this.overlay.get(key) : this.parent.getContextKeyValue(key);
	}

	createScoped(): IScopedContextKeyService {
		throw new Error('Not supported.');
	}

	createOverlay(overlay: Iterable<[string, any]> = Iterable.empty()): IContextKeyService {
		return new OverlayContextKeyService(this, overlay);
	}

	updateParent(): void {
		throw new Error('Not supported.');
	}
}

function findContextAttr(domNode: IContextKeyServiceTarget | null): number {
	while (domNode) {
		if (domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
			const attr = domNode.getAttribute(KEYBINDING_CONTEXT_ATTR);
			if (attr) {
				return parseInt(attr, 10);
			}
			return NaN;
		}
		domNode = domNode.parentElement;
	}
	return 0;
}

export function setContext(accessor: ServicesAccessor, contextKey: any, contextValue: any) {
	const contextKeyService = accessor.get(IContextKeyService);
	contextKeyService.createKey(String(contextKey), stringifyURIs(contextValue));
}

function stringifyURIs(contextValue: any): any {
	return cloneAndChange(contextValue, (obj) => {
		if (typeof obj === 'object' && (<MarshalledObject>obj).$mid === MarshalledId.Uri) {
			return URI.revive(obj).toString();
		}
		if (obj instanceof URI) {
			return obj.toString();
		}
		return undefined;
	});
}

CommandsRegistry.registerCommand('_setContext', setContext);

CommandsRegistry.registerCommand({
	id: 'getContextKeyInfo',
	handler() {
		return [...RawContextKey.all()].sort((a, b) => a.key.localeCompare(b.key));
	},
	metadata: {
		description: localize('getContextKeyInfo', "A command that returns information about context keys"),
		args: []
	}
});

CommandsRegistry.registerCommand('_generateContextKeyInfo', function () {
	const result: ContextKeyInfo[] = [];
	const seen = new Set<string>();
	for (const info of RawContextKey.all()) {
		if (!seen.has(info.key)) {
			seen.add(info.key);
			result.push(info);
		}
	}
	result.sort((a, b) => a.key.localeCompare(b.key));
	console.log(JSON.stringify(result, undefined, 2));
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 192
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 192 of 552)

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

---[FILE: src/vs/base/test/common/troubleshooting.ts]---
Location: vscode-main/src/vs/base/test/common/troubleshooting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, IDisposableTracker, setDisposableTracker } from '../../common/lifecycle.js';

class DisposableTracker implements IDisposableTracker {
	allDisposables: [IDisposable, string][] = [];
	trackDisposable(x: IDisposable): void {
		this.allDisposables.push([x, new Error().stack!]);
	}
	setParent(child: IDisposable, parent: IDisposable): void {
		for (let idx = 0; idx < this.allDisposables.length; idx++) {
			if (this.allDisposables[idx][0] === child) {
				this.allDisposables.splice(idx, 1);
				return;
			}
		}
	}
	markAsDisposed(x: IDisposable): void {
		for (let idx = 0; idx < this.allDisposables.length; idx++) {
			if (this.allDisposables[idx][0] === x) {
				this.allDisposables.splice(idx, 1);
				return;
			}
		}
	}
	markAsSingleton(disposable: IDisposable): void {
		// noop
	}
}

let currentTracker: DisposableTracker | null = null;

export function beginTrackingDisposables(): void {
	currentTracker = new DisposableTracker();
	setDisposableTracker(currentTracker);
}

export function endTrackingDisposables(): void {
	if (currentTracker) {
		setDisposableTracker(null);
		console.log(currentTracker.allDisposables.map(e => `${e[0]}\n${e[1]}`).join('\n\n'));
		currentTracker = null;
	}
}

export function beginLoggingFS(withStacks: boolean = false): void {
	// eslint-disable-next-line local/code-no-any-casts
	(<any>self).beginLoggingFS?.(withStacks);
}

export function endLoggingFS(): void {
	// eslint-disable-next-line local/code-no-any-casts
	(<any>self).endLoggingFS?.();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/types.test.ts]---
Location: vscode-main/src/vs/base/test/common/types.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as types from '../../common/types.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { assertDefined, isOneOf, typeCheck } from '../../common/types.js';

suite('Types', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('isFunction', () => {
		assert(!types.isFunction(undefined));
		assert(!types.isFunction(null));
		assert(!types.isFunction('foo'));
		assert(!types.isFunction(5));
		assert(!types.isFunction(true));
		assert(!types.isFunction([]));
		assert(!types.isFunction([1, 2, '3']));
		assert(!types.isFunction({}));
		assert(!types.isFunction({ foo: 'bar' }));
		assert(!types.isFunction(/test/));
		assert(!types.isFunction(new RegExp('')));
		assert(!types.isFunction(new Date()));

		assert(types.isFunction(assert));
		assert(types.isFunction(function foo() { /**/ }));
	});

	test('areFunctions', () => {
		assert(!types.areFunctions());
		assert(!types.areFunctions(null));
		assert(!types.areFunctions('foo'));
		assert(!types.areFunctions(5));
		assert(!types.areFunctions(true));
		assert(!types.areFunctions([]));
		assert(!types.areFunctions([1, 2, '3']));
		assert(!types.areFunctions({}));
		assert(!types.areFunctions({ foo: 'bar' }));
		assert(!types.areFunctions(/test/));
		assert(!types.areFunctions(new RegExp('')));
		assert(!types.areFunctions(new Date()));
		assert(!types.areFunctions(assert, ''));

		assert(types.areFunctions(assert));
		assert(types.areFunctions(assert, assert));
		assert(types.areFunctions(function foo() { /**/ }));
	});

	test('isObject', () => {
		assert(!types.isObject(undefined));
		assert(!types.isObject(null));
		assert(!types.isObject('foo'));
		assert(!types.isObject(5));
		assert(!types.isObject(true));
		assert(!types.isObject([]));
		assert(!types.isObject([1, 2, '3']));
		assert(!types.isObject(/test/));
		assert(!types.isObject(new RegExp('')));
		assert(!types.isFunction(new Date()));
		assert.strictEqual(types.isObject(assert), false);
		assert(!types.isObject(function foo() { }));

		assert(types.isObject({}));
		assert(types.isObject({ foo: 'bar' }));
	});

	test('isEmptyObject', () => {
		assert(!types.isEmptyObject(undefined));
		assert(!types.isEmptyObject(null));
		assert(!types.isEmptyObject('foo'));
		assert(!types.isEmptyObject(5));
		assert(!types.isEmptyObject(true));
		assert(!types.isEmptyObject([]));
		assert(!types.isEmptyObject([1, 2, '3']));
		assert(!types.isEmptyObject(/test/));
		assert(!types.isEmptyObject(new RegExp('')));
		assert(!types.isEmptyObject(new Date()));
		assert.strictEqual(types.isEmptyObject(assert), false);
		assert(!types.isEmptyObject(function foo() { /**/ }));
		assert(!types.isEmptyObject({ foo: 'bar' }));

		assert(types.isEmptyObject({}));
	});

	test('isString', () => {
		assert(!types.isString(undefined));
		assert(!types.isString(null));
		assert(!types.isString(5));
		assert(!types.isString([]));
		assert(!types.isString([1, 2, '3']));
		assert(!types.isString(true));
		assert(!types.isString({}));
		assert(!types.isString(/test/));
		assert(!types.isString(new RegExp('')));
		assert(!types.isString(new Date()));
		assert(!types.isString(assert));
		assert(!types.isString(function foo() { /**/ }));
		assert(!types.isString({ foo: 'bar' }));

		assert(types.isString('foo'));
	});

	test('isStringArray', () => {
		assert(!types.isStringArray(undefined));
		assert(!types.isStringArray(null));
		assert(!types.isStringArray(5));
		assert(!types.isStringArray('foo'));
		assert(!types.isStringArray(true));
		assert(!types.isStringArray({}));
		assert(!types.isStringArray(/test/));
		assert(!types.isStringArray(new RegExp('')));
		assert(!types.isStringArray(new Date()));
		assert(!types.isStringArray(assert));
		assert(!types.isStringArray(function foo() { /**/ }));
		assert(!types.isStringArray({ foo: 'bar' }));
		assert(!types.isStringArray([1, 2, 3]));
		assert(!types.isStringArray([1, 2, '3']));
		assert(!types.isStringArray(['foo', 'bar', 5]));
		assert(!types.isStringArray(['foo', null, 'bar']));
		assert(!types.isStringArray(['foo', undefined, 'bar']));

		assert(types.isStringArray([]));
		assert(types.isStringArray(['foo']));
		assert(types.isStringArray(['foo', 'bar']));
		assert(types.isStringArray(['foo', 'bar', 'baz']));
	});

	test('isArrayOf', () => {
		// Basic non-array values
		assert(!types.isArrayOf(undefined, types.isString));
		assert(!types.isArrayOf(null, types.isString));
		assert(!types.isArrayOf(5, types.isString));
		assert(!types.isArrayOf('foo', types.isString));
		assert(!types.isArrayOf(true, types.isString));
		assert(!types.isArrayOf({}, types.isString));
		assert(!types.isArrayOf(/test/, types.isString));
		assert(!types.isArrayOf(new RegExp(''), types.isString));
		assert(!types.isArrayOf(new Date(), types.isString));
		assert(!types.isArrayOf(assert, types.isString));
		assert(!types.isArrayOf(function foo() { /**/ }, types.isString));
		assert(!types.isArrayOf({ foo: 'bar' }, types.isString));

		// Arrays with wrong types
		assert(!types.isArrayOf([1, 2, 3], types.isString));
		assert(!types.isArrayOf([1, 2, '3'], types.isString));
		assert(!types.isArrayOf(['foo', 'bar', 5], types.isString));
		assert(!types.isArrayOf(['foo', null, 'bar'], types.isString));
		assert(!types.isArrayOf(['foo', undefined, 'bar'], types.isString));

		// Valid string arrays
		assert(types.isArrayOf([], types.isString));
		assert(types.isArrayOf(['foo'], types.isString));
		assert(types.isArrayOf(['foo', 'bar'], types.isString));
		assert(types.isArrayOf(['foo', 'bar', 'baz'], types.isString));

		// Valid number arrays
		assert(types.isArrayOf([], types.isNumber));
		assert(types.isArrayOf([1], types.isNumber));
		assert(types.isArrayOf([1, 2, 3], types.isNumber));
		assert(!types.isArrayOf([1, 2, '3'], types.isNumber));

		// Valid boolean arrays
		assert(types.isArrayOf([], types.isBoolean));
		assert(types.isArrayOf([true], types.isBoolean));
		assert(types.isArrayOf([true, false, true], types.isBoolean));
		assert(!types.isArrayOf([true, 1, false], types.isBoolean));

		// Valid function arrays
		assert(types.isArrayOf([], types.isFunction));
		assert(types.isArrayOf([assert], types.isFunction));
		assert(types.isArrayOf([assert, function foo() { /**/ }], types.isFunction));
		assert(!types.isArrayOf([assert, 'foo'], types.isFunction));

		// Custom type guard
		const isEven = (n: unknown): n is number => types.isNumber(n) && n % 2 === 0;
		assert(types.isArrayOf([], isEven));
		assert(types.isArrayOf([2, 4, 6], isEven));
		assert(!types.isArrayOf([2, 3, 4], isEven));
		assert(!types.isArrayOf([1, 3, 5], isEven));
	});

	test('isNumber', () => {
		assert(!types.isNumber(undefined));
		assert(!types.isNumber(null));
		assert(!types.isNumber('foo'));
		assert(!types.isNumber([]));
		assert(!types.isNumber([1, 2, '3']));
		assert(!types.isNumber(true));
		assert(!types.isNumber({}));
		assert(!types.isNumber(/test/));
		assert(!types.isNumber(new RegExp('')));
		assert(!types.isNumber(new Date()));
		assert(!types.isNumber(assert));
		assert(!types.isNumber(function foo() { /**/ }));
		assert(!types.isNumber({ foo: 'bar' }));
		assert(!types.isNumber(parseInt('A', 10)));

		assert(types.isNumber(5));
	});

	test('isUndefined', () => {
		assert(!types.isUndefined(null));
		assert(!types.isUndefined('foo'));
		assert(!types.isUndefined([]));
		assert(!types.isUndefined([1, 2, '3']));
		assert(!types.isUndefined(true));
		assert(!types.isUndefined({}));
		assert(!types.isUndefined(/test/));
		assert(!types.isUndefined(new RegExp('')));
		assert(!types.isUndefined(new Date()));
		assert(!types.isUndefined(assert));
		assert(!types.isUndefined(function foo() { /**/ }));
		assert(!types.isUndefined({ foo: 'bar' }));

		assert(types.isUndefined(undefined));
	});

	test('isUndefinedOrNull', () => {
		assert(!types.isUndefinedOrNull('foo'));
		assert(!types.isUndefinedOrNull([]));
		assert(!types.isUndefinedOrNull([1, 2, '3']));
		assert(!types.isUndefinedOrNull(true));
		assert(!types.isUndefinedOrNull({}));
		assert(!types.isUndefinedOrNull(/test/));
		assert(!types.isUndefinedOrNull(new RegExp('')));
		assert(!types.isUndefinedOrNull(new Date()));
		assert(!types.isUndefinedOrNull(assert));
		assert(!types.isUndefinedOrNull(function foo() { /**/ }));
		assert(!types.isUndefinedOrNull({ foo: 'bar' }));

		assert(types.isUndefinedOrNull(undefined));
		assert(types.isUndefinedOrNull(null));
	});

	test('assertIsDefined / assertAreDefined', () => {
		assert.throws(() => types.assertReturnsDefined(undefined));
		assert.throws(() => types.assertReturnsDefined(null));
		assert.throws(() => types.assertReturnsAllDefined(null, undefined));
		assert.throws(() => types.assertReturnsAllDefined(true, undefined));
		assert.throws(() => types.assertReturnsAllDefined(undefined, false));

		assert.strictEqual(types.assertReturnsDefined(true), true);
		assert.strictEqual(types.assertReturnsDefined(false), false);
		assert.strictEqual(types.assertReturnsDefined('Hello'), 'Hello');
		assert.strictEqual(types.assertReturnsDefined(''), '');

		const res = types.assertReturnsAllDefined(1, true, 'Hello');
		assert.strictEqual(res[0], 1);
		assert.strictEqual(res[1], true);
		assert.strictEqual(res[2], 'Hello');
	});

	suite('assertDefined', () => {
		test('should not throw if `value` is defined (bool)', async () => {
			assert.doesNotThrow(function () {
				assertDefined(true, 'Oops something happened.');
			});
		});

		test('should not throw if `value` is defined (number)', async () => {
			assert.doesNotThrow(function () {
				assertDefined(5, 'Oops something happened.');
			});
		});

		test('should not throw if `value` is defined (zero)', async () => {
			assert.doesNotThrow(function () {
				assertDefined(0, 'Oops something happened.');
			});
		});

		test('should not throw if `value` is defined (string)', async () => {
			assert.doesNotThrow(function () {
				assertDefined('some string', 'Oops something happened.');
			});
		});

		test('should not throw if `value` is defined (empty string)', async () => {
			assert.doesNotThrow(function () {
				assertDefined('', 'Oops something happened.');
			});
		});

		/**
		 * Note! API of `assert.throws()` is different in the browser
		 * and in Node.js, and it is not possible to use the same code
		 * here. Therefore we had to resort to the manual try/catch.
		 */
		const assertThrows = (
			testFunction: () => void,
			errorMessage: string,
		) => {
			let thrownError: Error | undefined;

			try {
				testFunction();
			} catch (e) {
				thrownError = e as Error;
			}

			assertDefined(thrownError, 'Must throw an error.');
			assert(
				thrownError instanceof Error,
				'Error must be an instance of `Error`.',
			);

			assert.strictEqual(
				thrownError.message,
				errorMessage,
				'Error must have correct message.',
			);
		};

		test('should throw if `value` is `null`', async () => {
			const errorMessage = 'Uggh ohh!';
			assertThrows(() => {
				assertDefined(null, errorMessage);
			}, errorMessage);
		});

		test('should throw if `value` is `undefined`', async () => {
			const errorMessage = 'Oh no!';
			assertThrows(() => {
				assertDefined(undefined, new Error(errorMessage));
			}, errorMessage);
		});

		test('should throw assertion error by default', async () => {
			const errorMessage = 'Uggh ohh!';
			let thrownError: Error | undefined;
			try {
				assertDefined(null, errorMessage);
			} catch (e) {
				thrownError = e as Error;
			}

			assertDefined(thrownError, 'Must throw an error.');

			assert(
				thrownError instanceof Error,
				'Error must be an instance of `Error`.',
			);

			assert.strictEqual(
				thrownError.message,
				errorMessage,
				'Error must have correct message.',
			);
		});

		test('should throw provided error instance', async () => {
			class TestError extends Error {
				constructor(...args: ConstructorParameters<typeof Error>) {
					super(...args);

					this.name = 'TestError';
				}
			}

			const errorMessage = 'Oops something hapenned.';
			const error = new TestError(errorMessage);

			let thrownError;
			try {
				assertDefined(null, error);
			} catch (e) {
				thrownError = e;
			}

			assert(
				thrownError instanceof TestError,
				'Error must be an instance of `TestError`.',
			);
			assert.strictEqual(
				thrownError.message,
				errorMessage,
				'Error must have correct message.',
			);
		});
	});

	suite('isOneOf', () => {
		suite('success', () => {
			suite('string', () => {
				test('type', () => {
					assert.doesNotThrow(() => {
						assert(
							isOneOf('foo', ['foo', 'bar']),
							'Foo must be one of: foo, bar',
						);
					});
				});

				test('subtype', () => {
					assert.doesNotThrow(() => {
						const item: string = 'hi';
						const list: ('hi' | 'ciao' | 'hola')[] = ['hi', 'ciao'];

						assert(
							isOneOf(item, list),
							'Hi must be one of: hi, ciao',
						);

						typeCheck<'hi' | 'ciao' | 'hola'>(item);
					});
				});
			});

			suite('number', () => {
				test('type', () => {
					assert.doesNotThrow(() => {
						assert(
							isOneOf(10, [10, 100]),
							'10 must be one of: 10, 100'
						);
					});
				});

				test('subtype', () => {
					assert.doesNotThrow(() => {
						const item: number = 20;
						const list: (20 | 2000)[] = [20, 2000];

						assert(
							isOneOf(item, list),
							'20 must be one of: 20, 2000',
						);

						typeCheck<20 | 2000>(item);
					});
				});

			});

			suite('boolean', () => {
				test('type', () => {
					assert.doesNotThrow(() => {
						assert(
							isOneOf(true, [true, false]),
							'true must be one of: true, false'
						);
					});

					assert.doesNotThrow(() => {
						assert(
							isOneOf(false, [true, false]),
							'false must be one of: true, false'
						);
					});
				});

				test('subtype (true)', () => {
					assert.doesNotThrow(() => {
						const item: boolean = true;
						const list: (true)[] = [true, true];

						assert(
							isOneOf(item, list),
							'true must be one of: true, true',
						);

						typeCheck<true>(item);
					});
				});

				test('subtype (false)', () => {
					assert.doesNotThrow(() => {
						const item: boolean = false;
						const list: (false | true)[] = [false, true];

						assert(
							isOneOf(item, list),
							'false must be one of: false, true',
						);

						typeCheck<false>(item);
					});
				});
			});

			suite('undefined', () => {
				test('type', () => {
					assert.doesNotThrow(() => {
						assert(
							isOneOf(undefined, [undefined]),
							'undefined must be one of: undefined'
						);
					});

					assert.doesNotThrow(() => {
						assert(
							isOneOf(undefined, [void 0]),
							'undefined must be one of: void 0'
						);
					});
				});

				test('subtype', () => {
					assert.doesNotThrow(() => {
						let item: undefined | null;
						const list: (undefined)[] = [undefined];

						assert(
							isOneOf(item, list),
							'undefined | null must be one of: undefined',
						);

						typeCheck<undefined>(item);
					});
				});
			});

			suite('null', () => {
				test('type', () => {
					assert.doesNotThrow(() => {
						assert(
							isOneOf(null, [null]),
							'null must be one of: null'
						);
					});
				});

				test('subtype', () => {
					assert.doesNotThrow(() => {
						const item: undefined | null | string = null;
						const list: (null)[] = [null];

						assert(
							isOneOf(item, list),
							'null must be one of: null',
						);

						typeCheck<null>(item);
					});
				});
			});

			suite('any', () => {
				test('item', () => {
					assert.doesNotThrow(() => {
						const item: any = '1';
						const list: ('1' | '2')[] = ['2', '1'];

						assert(
							isOneOf(item, list),
							'1 must be one of: 2, 1',
						);

						typeCheck<'1' | '2'>(item);
					});
				});

				test('list', () => {
					assert.doesNotThrow(() => {
						const item: '5' = '5';
						const list: any[] = ['3', '5', '2.5'];

						assert(
							isOneOf(item, list),
							'5 must be one of: 3, 5, 2.5',
						);

						typeCheck<'5'>(item);
					});
				});

				test('both', () => {
					assert.doesNotThrow(() => {
						const item: any = '12';
						const list: any[] = ['14.25', '7', '12'];

						assert(
							isOneOf(item, list),
							'12 must be one of: 14.25, 7, 12',
						);

						typeCheck<any>(item);
					});
				});
			});

			suite('unknown', () => {
				test('item', () => {
					assert.doesNotThrow(() => {
						const item: unknown = '1';
						const list: ('1' | '2')[] = ['2', '1'];

						assert(
							isOneOf(item, list),
							'1 must be one of: 2, 1',
						);

						typeCheck<'1' | '2'>(item);
					});
				});

				test('both', () => {
					assert.doesNotThrow(() => {
						const item: unknown = '12';
						const list: unknown[] = ['14.25', '7', '12'];

						assert(
							isOneOf(item, list),
							'12 must be one of: 14.25, 7, 12',
						);

						typeCheck<unknown>(item);
					});
				});
			});
		});

		suite('failure', () => {
			suite('string', () => {
				test('type', () => {
					assert.throws(() => {
						const item: string = 'baz';
						assert(
							isOneOf(item, ['foo', 'bar']),
							'Baz must not be one of: foo, bar',
						);
					});
				});

				test('subtype', () => {
					assert.throws(() => {
						const item: string = 'vitannia';
						const list: ('hi' | 'ciao' | 'hola')[] = ['hi', 'ciao'];

						assert(
							isOneOf(item, list),
							'vitannia must be one of: hi, ciao',
						);
					});
				});

				test('empty', () => {
					assert.throws(() => {
						const item: string = 'vitannia';
						const list: ('hi' | 'ciao' | 'hola')[] = [];

						assert(
							isOneOf(item, list),
							'vitannia must be one of: empty',
						);
					});
				});
			});

			suite('number', () => {
				test('type', () => {
					assert.throws(() => {
						assert(
							isOneOf(19, [10, 100]),
							'19 must not be one of: 10, 100',
						);
					});
				});

				test('subtype', () => {
					assert.throws(() => {
						const item: number = 24;
						const list: (20 | 2000)[] = [20, 2000];

						assert(
							isOneOf(item, list),
							'24 must not be one of: 20, 2000',
						);
					});
				});

				test('empty', () => {
					assert.throws(() => {
						const item: number = 20;
						const list: (20 | 2000)[] = [];

						assert(
							isOneOf(item, list),
							'20 must not be one of: empty',
						);
					});
				});
			});

			suite('boolean', () => {
				test('type', () => {
					assert.throws(() => {
						assert(
							isOneOf(true, [false]),
							'true must not be one of: false',
						);
					});

					assert.throws(() => {
						assert(
							isOneOf(false, [true]),
							'false must not be one of: true',
						);
					});
				});

				test('subtype (true)', () => {
					assert.throws(() => {
						const item: boolean = true;
						const list: (true | false)[] = [false];

						assert(
							isOneOf(item, list),
							'true must not be one of: false',
						);
					});
				});

				test('subtype (false)', () => {
					assert.throws(() => {
						const item: boolean = false;
						const list: (false | true)[] = [true, true, true];

						assert(
							isOneOf(item, list),
							'false must be one of: true, true, true',
						);
					});
				});

				test('empty', () => {
					assert.throws(() => {
						const item: boolean = true;
						const list: (false | true)[] = [];

						assert(
							isOneOf(item, list),
							'true must be one of: empty',
						);
					});
				});
			});

			suite('undefined', () => {
				test('type', () => {
					assert.throws(() => {
						assert(
							isOneOf(undefined, []),
							'undefined must not be one of: empty',
						);
					});

					assert.throws(() => {
						assert(
							isOneOf(void 0, []),
							'void 0 must not be one of: empty',
						);
					});
				});

				test('subtype', () => {
					assert.throws(() => {
						let item: undefined | null;
						const list: (undefined | null)[] = [null];

						assert(
							isOneOf(item, list),
							'undefined must be one of: null',
						);
					});
				});

				test('empty', () => {
					assert.throws(() => {
						let item: undefined | null;
						const list: (undefined | null)[] = [];

						assert(
							isOneOf(item, list),
							'undefined must be one of: empty',
						);
					});
				});
			});

			suite('null', () => {
				test('type', () => {
					assert.throws(() => {
						assert(
							isOneOf(null, []),
							'null must be one of: empty',
						);
					});
				});

				test('subtype', () => {
					assert.throws(() => {
						const item: undefined | null | string = null;
						const list: null[] = [];

						assert(
							isOneOf(item, list),
							'null must be one of: empty',
						);
					});
				});
			});

			suite('any', () => {
				test('item', () => {
					assert.throws(() => {
						const item: any = '1';
						const list: ('1' | '2' | '3' | '4')[] = ['3', '4'];

						assert(
							isOneOf(item, list),
							'1 must not be one of: 3, 4',
						);
					});
				});

				test('list', () => {
					assert.throws(() => {
						const item: '5' = '5';
						const list: any[] = ['3', '6', '2.5'];

						assert(
							isOneOf(item, list),
							'5 must not be one of: 3, 6, 2.5',
						);
					});
				});

				test('both', () => {
					assert.throws(() => {
						const item: any = '12';
						const list: any[] = ['14.25', '7', '15'];

						assert(
							isOneOf(item, list),
							'12 must not be one of: 14.25, 7, 15',
						);
					});
				});

				test('empty', () => {
					assert.throws(() => {
						const item: any = '25';
						const list: any[] = [];

						assert(
							isOneOf(item, list),
							'25 must not be one of: empty',
						);
					});
				});
			});

			suite('unknown', () => {
				test('item', () => {
					assert.throws(() => {
						const item: unknown = '100';
						const list: ('11' | '12')[] = ['12', '11'];

						assert(
							isOneOf(item, list),
							'100 must not be one of: 12, 11',
						);

					});

					test('both', () => {
						assert.throws(() => {
							const item: unknown = '21';
							const list: unknown[] = ['14.25', '7', '12'];

							assert(
								isOneOf(item, list),
								'21 must not be one of: 14.25, 7, 12',
							);

						});
					});
				});
			});
		});
	});

	test('validateConstraints', () => {
		types.validateConstraints([1, 'test', true], [Number, String, Boolean]);
		types.validateConstraints([1, 'test', true], ['number', 'string', 'boolean']);
		types.validateConstraints([console.log], [Function]);
		types.validateConstraints([undefined], [types.isUndefined]);
		types.validateConstraints([1], [types.isNumber]);

		class Foo { }
		types.validateConstraints([new Foo()], [Foo]);

		function isFoo(f: any) { }
		assert.throws(() => types.validateConstraints([new Foo()], [isFoo]));

		function isFoo2(f: any) { return true; }
		types.validateConstraints([new Foo()], [isFoo2]);

		assert.throws(() => types.validateConstraints([1, true], [types.isNumber, types.isString]));
		assert.throws(() => types.validateConstraints(['2'], [types.isNumber]));
		assert.throws(() => types.validateConstraints([1, 'test', true], [Number, String, Number]));
	});

	suite('hasKey', () => {
		test('should return true when object has specified key', () => {
			type A = { a: string };
			type B = { b: number };
			const obj: A | B = { a: 'test' };

			assert(types.hasKey(obj, { a: true }));
			// After this check, TypeScript knows obj is type A
			assert.strictEqual(obj.a, 'test');
		});

		test('should return false when object does not have specified key', () => {
			type A = { a: string };
			type B = { b: number };
			const obj: A | B = { b: 42 };

			// @ts-expect-error
			assert(!types.hasKey(obj, { a: true }));
		});

		test('should work with multiple keys', () => {
			type A = { a: string; b: number };
			type B = { c: boolean };
			const obj: A | B = { a: 'test', b: 42 };

			assert(types.hasKey(obj, { a: true, b: true }));
			// After this check, TypeScript knows obj is type A
			assert.strictEqual(obj.a, 'test');
			assert.strictEqual(obj.b, 42);
		});

		test('should return false if any key is missing', () => {
			type A = { a: string; b: number };
			type B = { a: string };
			const obj: A | B = { a: 'test' };

			assert(!types.hasKey(obj, { a: true, b: true }));
		});

		test('should work with empty key object', () => {
			type A = { a: string };
			type B = { b: number };
			const obj: A | B = { a: 'test' };

			// Empty key object should return true (all zero keys exist)
			assert(types.hasKey(obj, {}));
		});

		test('should work with complex union types', () => {
			type TypeA = { kind: 'a'; value: string };
			type TypeB = { kind: 'b'; count: number };
			type TypeC = { kind: 'c'; items: string[] };

			const objA: TypeA | TypeB | TypeC = { kind: 'a', value: 'hello' };
			const objB: TypeA | TypeB | TypeC = { kind: 'b', count: 5 };

			assert(types.hasKey(objA, { value: true }));
			// @ts-expect-error
			assert(!types.hasKey(objA, { count: true }));
			// @ts-expect-error
			assert(!types.hasKey(objA, { items: true }));

			// @ts-expect-error
			assert(!types.hasKey(objB, { value: true }));
			// @ts-expect-error
			assert(types.hasKey(objB, { count: true }));
			// @ts-expect-error
			assert(!types.hasKey(objB, { items: true }));
		});

		test('should handle objects with optional properties', () => {
			type A = { a: string; b?: number };
			type B = { c: boolean };
			const obj1: A | B = { a: 'test', b: 42 };
			const obj2: A | B = { a: 'test' };

			assert(types.hasKey(obj1, { a: true }));
			assert(types.hasKey(obj1, { b: true }));

			assert(types.hasKey(obj2, { a: true }));
			assert(!types.hasKey(obj2, { b: true }));
		});

		test('should work with nested objects', () => {
			type A = { data: { nested: string } };
			type B = { value: number };
			const obj: A | B = { data: { nested: 'test' } };

			assert(types.hasKey(obj, { data: true }));
			// @ts-expect-error
			assert(!types.hasKey(obj, { value: true }));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/uri.test.ts]---
Location: vscode-main/src/vs/base/test/common/uri.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { isWindows } from '../../common/platform.js';
import { URI, UriComponents, isUriComponents } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';


suite('URI', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('file#toString', () => {
		assert.strictEqual(URI.file('c:/win/path').toString(), 'file:///c%3A/win/path');
		assert.strictEqual(URI.file('C:/win/path').toString(), 'file:///c%3A/win/path');
		assert.strictEqual(URI.file('c:/win/path/').toString(), 'file:///c%3A/win/path/');
		assert.strictEqual(URI.file('/c:/win/path').toString(), 'file:///c%3A/win/path');
	});

	test('URI.file (win-special)', () => {
		if (isWindows) {
			assert.strictEqual(URI.file('c:\\win\\path').toString(), 'file:///c%3A/win/path');
			assert.strictEqual(URI.file('c:\\win/path').toString(), 'file:///c%3A/win/path');
		} else {
			assert.strictEqual(URI.file('c:\\win\\path').toString(), 'file:///c%3A%5Cwin%5Cpath');
			assert.strictEqual(URI.file('c:\\win/path').toString(), 'file:///c%3A%5Cwin/path');

		}
	});

	test('file#fsPath (win-special)', () => {
		if (isWindows) {
			assert.strictEqual(URI.file('c:\\win\\path').fsPath, 'c:\\win\\path');
			assert.strictEqual(URI.file('c:\\win/path').fsPath, 'c:\\win\\path');

			assert.strictEqual(URI.file('c:/win/path').fsPath, 'c:\\win\\path');
			assert.strictEqual(URI.file('c:/win/path/').fsPath, 'c:\\win\\path\\');
			assert.strictEqual(URI.file('C:/win/path').fsPath, 'c:\\win\\path');
			assert.strictEqual(URI.file('/c:/win/path').fsPath, 'c:\\win\\path');
			assert.strictEqual(URI.file('./c/win/path').fsPath, '\\.\\c\\win\\path');
		} else {
			assert.strictEqual(URI.file('c:/win/path').fsPath, 'c:/win/path');
			assert.strictEqual(URI.file('c:/win/path/').fsPath, 'c:/win/path/');
			assert.strictEqual(URI.file('C:/win/path').fsPath, 'c:/win/path');
			assert.strictEqual(URI.file('/c:/win/path').fsPath, 'c:/win/path');
			assert.strictEqual(URI.file('./c/win/path').fsPath, '/./c/win/path');
		}
	});

	test('URI#fsPath - no `fsPath` when no `path`', () => {
		const value = URI.parse('file://%2Fhome%2Fticino%2Fdesktop%2Fcpluscplus%2Ftest.cpp');
		assert.strictEqual(value.authority, '/home/ticino/desktop/cpluscplus/test.cpp');
		assert.strictEqual(value.path, '/');
		if (isWindows) {
			assert.strictEqual(value.fsPath, '\\');
		} else {
			assert.strictEqual(value.fsPath, '/');
		}
	});

	test('http#toString', () => {
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'www.example.com', path: '/my/path' }).toString(), 'http://www.example.com/my/path');
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'www.example.com', path: '/my/path' }).toString(), 'http://www.example.com/my/path');
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'www.EXAMPLE.com', path: '/my/path' }).toString(), 'http://www.example.com/my/path');
		assert.strictEqual(URI.from({ scheme: 'http', authority: '', path: 'my/path' }).toString(), 'http:/my/path');
		assert.strictEqual(URI.from({ scheme: 'http', authority: '', path: '/my/path' }).toString(), 'http:/my/path');
		//http://example.com/#test=true
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'example.com', path: '/', query: 'test=true' }).toString(), 'http://example.com/?test%3Dtrue');
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'example.com', path: '/', query: '', fragment: 'test=true' }).toString(), 'http://example.com/#test%3Dtrue');
	});

	test('http#toString, encode=FALSE', () => {
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'example.com', path: '/', query: 'test=true' }).toString(true), 'http://example.com/?test=true');
		assert.strictEqual(URI.from({ scheme: 'http', authority: 'example.com', path: '/', query: '', fragment: 'test=true' }).toString(true), 'http://example.com/#test=true');
		assert.strictEqual(URI.from({ scheme: 'http', path: '/api/files/test.me', query: 't=1234' }).toString(true), 'http:/api/files/test.me?t=1234');

		const value = URI.parse('file://shares/pröjects/c%23/#l12');
		assert.strictEqual(value.authority, 'shares');
		assert.strictEqual(value.path, '/pröjects/c#/');
		assert.strictEqual(value.fragment, 'l12');
		assert.strictEqual(value.toString(), 'file://shares/pr%C3%B6jects/c%23/#l12');
		assert.strictEqual(value.toString(true), 'file://shares/pröjects/c%23/#l12');

		const uri2 = URI.parse(value.toString(true));
		const uri3 = URI.parse(value.toString());
		assert.strictEqual(uri2.authority, uri3.authority);
		assert.strictEqual(uri2.path, uri3.path);
		assert.strictEqual(uri2.query, uri3.query);
		assert.strictEqual(uri2.fragment, uri3.fragment);
	});

	test('with, identity', () => {
		const uri = URI.parse('foo:bar/path');

		let uri2 = uri.with(null!);
		assert.ok(uri === uri2);
		uri2 = uri.with(undefined!);
		assert.ok(uri === uri2);
		uri2 = uri.with({});
		assert.ok(uri === uri2);
		uri2 = uri.with({ scheme: 'foo', path: 'bar/path' });
		assert.ok(uri === uri2);
	});

	test('with, changes', () => {
		assert.strictEqual(URI.parse('before:some/file/path').with({ scheme: 'after' }).toString(), 'after:some/file/path');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'http', path: '/api/files/test.me', query: 't=1234' }).toString(), 'http:/api/files/test.me?t%3D1234');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'http', authority: '', path: '/api/files/test.me', query: 't=1234', fragment: '' }).toString(), 'http:/api/files/test.me?t%3D1234');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'https', authority: '', path: '/api/files/test.me', query: 't=1234', fragment: '' }).toString(), 'https:/api/files/test.me?t%3D1234');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'HTTP', authority: '', path: '/api/files/test.me', query: 't=1234', fragment: '' }).toString(), 'HTTP:/api/files/test.me?t%3D1234');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'HTTPS', authority: '', path: '/api/files/test.me', query: 't=1234', fragment: '' }).toString(), 'HTTPS:/api/files/test.me?t%3D1234');
		assert.strictEqual(URI.from({ scheme: 's' }).with({ scheme: 'boo', authority: '', path: '/api/files/test.me', query: 't=1234', fragment: '' }).toString(), 'boo:/api/files/test.me?t%3D1234');
	});

	test('with, remove components #8465', () => {
		assert.strictEqual(URI.parse('scheme://authority/path').with({ authority: '' }).toString(), 'scheme:/path');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: 'authority' }).with({ authority: '' }).toString(), 'scheme:/path');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: 'authority' }).with({ authority: null }).toString(), 'scheme:/path');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: 'authority' }).with({ path: '' }).toString(), 'scheme://authority');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: 'authority' }).with({ path: null }).toString(), 'scheme://authority');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: '' }).toString(), 'scheme:/path');
		assert.strictEqual(URI.parse('scheme:/path').with({ authority: null }).toString(), 'scheme:/path');
	});

	test('with, validation', () => {
		const uri = URI.parse('foo:bar/path');
		assert.throws(() => uri.with({ scheme: 'fai:l' }));
		assert.throws(() => uri.with({ scheme: 'fäil' }));
		assert.throws(() => uri.with({ authority: 'fail' }));
		assert.throws(() => uri.with({ path: '//fail' }));
	});

	test('parse', () => {
		let value = URI.parse('http:/api/files/test.me?t=1234');
		assert.strictEqual(value.scheme, 'http');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/api/files/test.me');
		assert.strictEqual(value.query, 't=1234');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('http://api/files/test.me?t=1234');
		assert.strictEqual(value.scheme, 'http');
		assert.strictEqual(value.authority, 'api');
		assert.strictEqual(value.path, '/files/test.me');
		assert.strictEqual(value.query, 't=1234');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('file:///c:/test/me');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/c:/test/me');
		assert.strictEqual(value.fragment, '');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fsPath, isWindows ? 'c:\\test\\me' : 'c:/test/me');

		value = URI.parse('file://shares/files/c%23/p.cs');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, 'shares');
		assert.strictEqual(value.path, '/files/c#/p.cs');
		assert.strictEqual(value.fragment, '');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fsPath, isWindows ? '\\\\shares\\files\\c#\\p.cs' : '//shares/files/c#/p.cs');

		value = URI.parse('file:///c:/Source/Z%C3%BCrich%20or%20Zurich%20(%CB%88zj%CA%8A%C9%99r%C9%AAk,/Code/resources/app/plugins/c%23/plugin.json');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/c:/Source/Zürich or Zurich (ˈzjʊərɪk,/Code/resources/app/plugins/c#/plugin.json');
		assert.strictEqual(value.fragment, '');
		assert.strictEqual(value.query, '');

		value = URI.parse('file:///c:/test %25/path');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/c:/test %/path');
		assert.strictEqual(value.fragment, '');
		assert.strictEqual(value.query, '');

		value = URI.parse('inmemory:');
		assert.strictEqual(value.scheme, 'inmemory');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('foo:api/files/test');
		assert.strictEqual(value.scheme, 'foo');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, 'api/files/test');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('file:?q');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/');
		assert.strictEqual(value.query, 'q');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('file:#d');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, 'd');

		value = URI.parse('f3ile:#d');
		assert.strictEqual(value.scheme, 'f3ile');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, 'd');

		value = URI.parse('foo+bar:path');
		assert.strictEqual(value.scheme, 'foo+bar');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, 'path');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('foo-bar:path');
		assert.strictEqual(value.scheme, 'foo-bar');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, 'path');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, '');

		value = URI.parse('foo.bar:path');
		assert.strictEqual(value.scheme, 'foo.bar');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, 'path');
		assert.strictEqual(value.query, '');
		assert.strictEqual(value.fragment, '');
	});

	test('parse, disallow //path when no authority', () => {
		assert.throws(() => URI.parse('file:////shares/files/p.cs'));
	});

	test('URI#file, win-speciale', () => {
		if (isWindows) {
			let value = URI.file('c:\\test\\drive');
			assert.strictEqual(value.path, '/c:/test/drive');
			assert.strictEqual(value.toString(), 'file:///c%3A/test/drive');

			value = URI.file('\\\\shäres\\path\\c#\\plugin.json');
			assert.strictEqual(value.scheme, 'file');
			assert.strictEqual(value.authority, 'shäres');
			assert.strictEqual(value.path, '/path/c#/plugin.json');
			assert.strictEqual(value.fragment, '');
			assert.strictEqual(value.query, '');
			assert.strictEqual(value.toString(), 'file://sh%C3%A4res/path/c%23/plugin.json');

			value = URI.file('\\\\localhost\\c$\\GitDevelopment\\express');
			assert.strictEqual(value.scheme, 'file');
			assert.strictEqual(value.path, '/c$/GitDevelopment/express');
			assert.strictEqual(value.fsPath, '\\\\localhost\\c$\\GitDevelopment\\express');
			assert.strictEqual(value.query, '');
			assert.strictEqual(value.fragment, '');
			assert.strictEqual(value.toString(), 'file://localhost/c%24/GitDevelopment/express');

			value = URI.file('c:\\test with %\\path');
			assert.strictEqual(value.path, '/c:/test with %/path');
			assert.strictEqual(value.toString(), 'file:///c%3A/test%20with%20%25/path');

			value = URI.file('c:\\test with %25\\path');
			assert.strictEqual(value.path, '/c:/test with %25/path');
			assert.strictEqual(value.toString(), 'file:///c%3A/test%20with%20%2525/path');

			value = URI.file('c:\\test with %25\\c#code');
			assert.strictEqual(value.path, '/c:/test with %25/c#code');
			assert.strictEqual(value.toString(), 'file:///c%3A/test%20with%20%2525/c%23code');

			value = URI.file('\\\\shares');
			assert.strictEqual(value.scheme, 'file');
			assert.strictEqual(value.authority, 'shares');
			assert.strictEqual(value.path, '/'); // slash is always there

			value = URI.file('\\\\shares\\');
			assert.strictEqual(value.scheme, 'file');
			assert.strictEqual(value.authority, 'shares');
			assert.strictEqual(value.path, '/');
		}
	});

	test('VSCode URI module\'s driveLetterPath regex is incorrect, #32961', function () {
		const uri = URI.parse('file:///_:/path');
		assert.strictEqual(uri.fsPath, isWindows ? '\\_:\\path' : '/_:/path');
	});

	test('URI#file, no path-is-uri check', () => {

		// we don't complain here
		const value = URI.file('file://path/to/file');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/file://path/to/file');
	});

	test('URI#file, always slash', () => {

		let value = URI.file('a.file');
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/a.file');
		assert.strictEqual(value.toString(), 'file:///a.file');

		value = URI.parse(value.toString());
		assert.strictEqual(value.scheme, 'file');
		assert.strictEqual(value.authority, '');
		assert.strictEqual(value.path, '/a.file');
		assert.strictEqual(value.toString(), 'file:///a.file');
	});

	test('URI.toString, only scheme and query', () => {
		const value = URI.parse('stuff:?qüery');
		assert.strictEqual(value.toString(), 'stuff:?q%C3%BCery');
	});

	test('URI#toString, upper-case percent espaces', () => {
		const value = URI.parse('file://sh%c3%a4res/path');
		assert.strictEqual(value.toString(), 'file://sh%C3%A4res/path');
	});

	test('URI#toString, lower-case windows drive letter', () => {
		assert.strictEqual(URI.parse('untitled:c:/Users/jrieken/Code/abc.txt').toString(), 'untitled:c%3A/Users/jrieken/Code/abc.txt');
		assert.strictEqual(URI.parse('untitled:C:/Users/jrieken/Code/abc.txt').toString(), 'untitled:c%3A/Users/jrieken/Code/abc.txt');
	});

	test('URI#toString, escape all the bits', () => {

		const value = URI.file('/Users/jrieken/Code/_samples/18500/Mödel + Other Thîngß/model.js');
		assert.strictEqual(value.toString(), 'file:///Users/jrieken/Code/_samples/18500/M%C3%B6del%20%2B%20Other%20Th%C3%AEng%C3%9F/model.js');
	});

	test('URI#toString, don\'t encode port', () => {
		let value = URI.parse('http://localhost:8080/far');
		assert.strictEqual(value.toString(), 'http://localhost:8080/far');

		value = URI.from({ scheme: 'http', authority: 'löcalhost:8080', path: '/far', query: undefined, fragment: undefined });
		assert.strictEqual(value.toString(), 'http://l%C3%B6calhost:8080/far');
	});

	test('URI#toString, user information in authority', () => {
		let value = URI.parse('http://foo:bar@localhost/far');
		assert.strictEqual(value.toString(), 'http://foo:bar@localhost/far');

		value = URI.parse('http://foo@localhost/far');
		assert.strictEqual(value.toString(), 'http://foo@localhost/far');

		value = URI.parse('http://foo:bAr@localhost:8080/far');
		assert.strictEqual(value.toString(), 'http://foo:bAr@localhost:8080/far');

		value = URI.parse('http://foo@localhost:8080/far');
		assert.strictEqual(value.toString(), 'http://foo@localhost:8080/far');

		value = URI.from({ scheme: 'http', authority: 'föö:bör@löcalhost:8080', path: '/far', query: undefined, fragment: undefined });
		assert.strictEqual(value.toString(), 'http://f%C3%B6%C3%B6:b%C3%B6r@l%C3%B6calhost:8080/far');
	});

	test('correctFileUriToFilePath2', () => {

		const test = (input: string, expected: string) => {
			const value = URI.parse(input);
			assert.strictEqual(value.fsPath, expected, 'Result for ' + input);
			const value2 = URI.file(value.fsPath);
			assert.strictEqual(value2.fsPath, expected, 'Result for ' + input);
			assert.strictEqual(value.toString(), value2.toString());
		};

		test('file:///c:/alex.txt', isWindows ? 'c:\\alex.txt' : 'c:/alex.txt');
		test('file:///c:/Source/Z%C3%BCrich%20or%20Zurich%20(%CB%88zj%CA%8A%C9%99r%C9%AAk,/Code/resources/app/plugins', isWindows ? 'c:\\Source\\Zürich or Zurich (ˈzjʊərɪk,\\Code\\resources\\app\\plugins' : 'c:/Source/Zürich or Zurich (ˈzjʊərɪk,/Code/resources/app/plugins');
		test('file://monacotools/folder/isi.txt', isWindows ? '\\\\monacotools\\folder\\isi.txt' : '//monacotools/folder/isi.txt');
		test('file://monacotools1/certificates/SSL/', isWindows ? '\\\\monacotools1\\certificates\\SSL\\' : '//monacotools1/certificates/SSL/');
	});

	test('URI - http, query & toString', function () {

		let uri = URI.parse('https://go.microsoft.com/fwlink/?LinkId=518008');
		assert.strictEqual(uri.query, 'LinkId=518008');
		assert.strictEqual(uri.toString(true), 'https://go.microsoft.com/fwlink/?LinkId=518008');
		assert.strictEqual(uri.toString(), 'https://go.microsoft.com/fwlink/?LinkId%3D518008');

		let uri2 = URI.parse(uri.toString());
		assert.strictEqual(uri2.query, 'LinkId=518008');
		assert.strictEqual(uri2.query, uri.query);

		uri = URI.parse('https://go.microsoft.com/fwlink/?LinkId=518008&foö&ké¥=üü');
		assert.strictEqual(uri.query, 'LinkId=518008&foö&ké¥=üü');
		assert.strictEqual(uri.toString(true), 'https://go.microsoft.com/fwlink/?LinkId=518008&foö&ké¥=üü');
		assert.strictEqual(uri.toString(), 'https://go.microsoft.com/fwlink/?LinkId%3D518008%26fo%C3%B6%26k%C3%A9%C2%A5%3D%C3%BC%C3%BC');

		uri2 = URI.parse(uri.toString());
		assert.strictEqual(uri2.query, 'LinkId=518008&foö&ké¥=üü');
		assert.strictEqual(uri2.query, uri.query);

		// #24849
		uri = URI.parse('https://twitter.com/search?src=typd&q=%23tag');
		assert.strictEqual(uri.toString(true), 'https://twitter.com/search?src=typd&q=%23tag');
	});


	test('class URI cannot represent relative file paths #34449', function () {

		let path = '/foo/bar';
		assert.strictEqual(URI.file(path).path, path);
		path = 'foo/bar';
		assert.strictEqual(URI.file(path).path, '/foo/bar');
		path = './foo/bar';
		assert.strictEqual(URI.file(path).path, '/./foo/bar'); // missing normalization

		const fileUri1 = URI.parse(`file:foo/bar`);
		assert.strictEqual(fileUri1.path, '/foo/bar');
		assert.strictEqual(fileUri1.authority, '');
		const uri = fileUri1.toString();
		assert.strictEqual(uri, 'file:///foo/bar');
		const fileUri2 = URI.parse(uri);
		assert.strictEqual(fileUri2.path, '/foo/bar');
		assert.strictEqual(fileUri2.authority, '');
	});

	test('Ctrl click to follow hash query param url gets urlencoded #49628', function () {
		let input = 'http://localhost:3000/#/foo?bar=baz';
		let uri = URI.parse(input);
		assert.strictEqual(uri.toString(true), input);

		input = 'http://localhost:3000/foo?bar=baz';
		uri = URI.parse(input);
		assert.strictEqual(uri.toString(true), input);
	});

	test('Unable to open \'%A0.txt\': URI malformed #76506', function () {

		let uri = URI.file('/foo/%A0.txt');
		let uri2 = URI.parse(uri.toString());
		assert.strictEqual(uri.scheme, uri2.scheme);
		assert.strictEqual(uri.path, uri2.path);

		uri = URI.file('/foo/%2e.txt');
		uri2 = URI.parse(uri.toString());
		assert.strictEqual(uri.scheme, uri2.scheme);
		assert.strictEqual(uri.path, uri2.path);
	});

	test('Bug in URI.isUri() that fails `thing` type comparison #114971', function () {
		const uri = URI.file('/foo/bazz.txt');
		assert.strictEqual(URI.isUri(uri), true);
		assert.strictEqual(URI.isUri(uri.toJSON()), false);

		// fsPath -> getter
		assert.strictEqual(URI.isUri({
			scheme: 'file',
			authority: '',
			path: '/foo/bazz.txt',
			get fsPath() { return '/foo/bazz.txt'; },
			query: '',
			fragment: '',
			with() { return this; },
			toString() { return ''; }
		}), true);

		// fsPath -> property
		assert.strictEqual(URI.isUri({
			scheme: 'file',
			authority: '',
			path: '/foo/bazz.txt',
			fsPath: '/foo/bazz.txt',
			query: '',
			fragment: '',
			with() { return this; },
			toString() { return ''; }
		}), true);

		assert.strictEqual(URI.isUri(1), false);
		assert.strictEqual(URI.isUri('1'), false);
		assert.strictEqual(URI.isUri('http://sample.com'), false);
		assert.strictEqual(URI.isUri(null), false);
		assert.strictEqual(URI.isUri(undefined), false);
	});

	test('isUriComponents', function () {

		assert.ok(isUriComponents(URI.file('a')));
		assert.ok(isUriComponents(URI.file('a').toJSON()));
		assert.ok(isUriComponents(URI.file('')));
		assert.ok(isUriComponents(URI.file('').toJSON()));

		assert.strictEqual(isUriComponents(1), false);
		assert.strictEqual(isUriComponents(true), false);
		assert.strictEqual(isUriComponents('true'), false);
		assert.strictEqual(isUriComponents({}), false);
		assert.strictEqual(isUriComponents({ scheme: '' }), true); // valid components but INVALID uri
		assert.strictEqual(isUriComponents({ scheme: 'fo' }), true);
		assert.strictEqual(isUriComponents({ scheme: 'fo', path: '/p' }), true);
		assert.strictEqual(isUriComponents({ path: '/p' }), false);
	});

	test('from, from(strict), revive', function () {

		assert.throws(() => URI.from({ scheme: '' }, true));
		assert.strictEqual(URI.from({ scheme: '' }).scheme, 'file');
		assert.strictEqual(URI.revive({ scheme: '' }).scheme, '');
	});

	test('Unable to open \'%A0.txt\': URI malformed #76506, part 2', function () {
		assert.strictEqual(URI.parse('file://some/%.txt').toString(), 'file://some/%25.txt');
		assert.strictEqual(URI.parse('file://some/%A0.txt').toString(), 'file://some/%25A0.txt');
	});

	test.skip('Links in markdown are broken if url contains encoded parameters #79474', function () {
		const strIn = 'https://myhost.com/Redirect?url=http%3A%2F%2Fwww.bing.com%3Fsearch%3Dtom';
		const uri1 = URI.parse(strIn);
		const strOut = uri1.toString();
		const uri2 = URI.parse(strOut);

		assert.strictEqual(uri1.scheme, uri2.scheme);
		assert.strictEqual(uri1.authority, uri2.authority);
		assert.strictEqual(uri1.path, uri2.path);
		assert.strictEqual(uri1.query, uri2.query);
		assert.strictEqual(uri1.fragment, uri2.fragment);
		assert.strictEqual(strIn, strOut); // fails here!!
	});

	test.skip('Uri#parse can break path-component #45515', function () {
		const strIn = 'https://firebasestorage.googleapis.com/v0/b/brewlangerie.appspot.com/o/products%2FzVNZkudXJyq8bPGTXUxx%2FBetterave-Sesame.jpg?alt=media&token=0b2310c4-3ea6-4207-bbde-9c3710ba0437';
		const uri1 = URI.parse(strIn);
		const strOut = uri1.toString();
		const uri2 = URI.parse(strOut);

		assert.strictEqual(uri1.scheme, uri2.scheme);
		assert.strictEqual(uri1.authority, uri2.authority);
		assert.strictEqual(uri1.path, uri2.path);
		assert.strictEqual(uri1.query, uri2.query);
		assert.strictEqual(uri1.fragment, uri2.fragment);
		assert.strictEqual(strIn, strOut); // fails here!!
	});

	test('URI - (de)serialize', function () {

		const values = [
			URI.parse('http://localhost:8080/far'),
			URI.file('c:\\test with %25\\c#code'),
			URI.file('\\\\shäres\\path\\c#\\plugin.json'),
			URI.parse('http://api/files/test.me?t=1234'),
			URI.parse('http://api/files/test.me?t=1234#fff'),
			URI.parse('http://api/files/test.me#fff'),
		];

		// console.profile();
		// let c = 100000;
		// while (c-- > 0) {
		for (const value of values) {
			const data = value.toJSON() as UriComponents;
			const clone = URI.revive(data);

			assert.strictEqual(clone.scheme, value.scheme);
			assert.strictEqual(clone.authority, value.authority);
			assert.strictEqual(clone.path, value.path);
			assert.strictEqual(clone.query, value.query);
			assert.strictEqual(clone.fragment, value.fragment);
			assert.strictEqual(clone.fsPath, value.fsPath);
			assert.strictEqual(clone.toString(), value.toString());
		}
		// }
		// console.profileEnd();
	});
	function assertJoined(base: string, fragment: string, expected: string, checkWithUrl: boolean = true) {
		const baseUri = URI.parse(base);
		const newUri = URI.joinPath(baseUri, fragment);
		const actual = newUri.toString(true);
		assert.strictEqual(actual, expected);

		if (checkWithUrl) {
			const actualUrl = new URL(fragment, base).href;
			assert.strictEqual(actualUrl, expected, 'DIFFERENT from URL');
		}
	}
	test('URI#joinPath', function () {

		assertJoined(('file:///foo/'), '../../bazz', 'file:///bazz');
		assertJoined(('file:///foo'), '../../bazz', 'file:///bazz');
		assertJoined(('file:///foo'), '../../bazz', 'file:///bazz');
		assertJoined(('file:///foo/bar/'), './bazz', 'file:///foo/bar/bazz');
		assertJoined(('file:///foo/bar'), './bazz', 'file:///foo/bar/bazz', false);
		assertJoined(('file:///foo/bar'), 'bazz', 'file:///foo/bar/bazz', false);

		// "auto-path" scheme
		assertJoined(('file:'), 'bazz', 'file:///bazz');
		assertJoined(('http://domain'), 'bazz', 'http://domain/bazz');
		assertJoined(('https://domain'), 'bazz', 'https://domain/bazz');
		assertJoined(('http:'), 'bazz', 'http:/bazz', false);
		assertJoined(('https:'), 'bazz', 'https:/bazz', false);

		// no "auto-path" scheme with and w/o paths
		assertJoined(('foo:/'), 'bazz', 'foo:/bazz');
		assertJoined(('foo://bar/'), 'bazz', 'foo://bar/bazz');

		// no "auto-path" + no path -> error
		assert.throws(() => assertJoined(('foo:'), 'bazz', ''));
		assert.throws(() => new URL('bazz', 'foo:'));
		assert.throws(() => assertJoined(('foo://bar'), 'bazz', ''));
		// assert.throws(() => new URL('bazz', 'foo://bar')); Edge, Chrome => THROW, Firefox, Safari => foo://bar/bazz
	});

	test('URI#joinPath (posix)', function () {
		if (isWindows) {
			this.skip();
		}
		assertJoined(('file:///c:/foo/'), '../../bazz', 'file:///bazz', false);
		assertJoined(('file://server/share/c:/'), '../../bazz', 'file://server/bazz', false);
		assertJoined(('file://server/share/c:'), '../../bazz', 'file://server/bazz', false);

		assertJoined(('file://ser/foo/'), '../../bazz', 'file://ser/bazz', false); // Firefox -> Different, Edge, Chrome, Safar -> OK
		assertJoined(('file://ser/foo'), '../../bazz', 'file://ser/bazz', false); // Firefox -> Different, Edge, Chrome, Safar -> OK
	});

	test('URI#joinPath (windows)', function () {
		if (!isWindows) {
			this.skip();
		}
		assertJoined(('file:///c:/foo/'), '../../bazz', 'file:///c:/bazz', false);
		assertJoined(('file://server/share/c:/'), '../../bazz', 'file://server/share/bazz', false);
		assertJoined(('file://server/share/c:'), '../../bazz', 'file://server/share/bazz', false);

		assertJoined(('file://ser/foo/'), '../../bazz', 'file://ser/foo/bazz', false);
		assertJoined(('file://ser/foo'), '../../bazz', 'file://ser/foo/bazz', false);

		//https://github.com/microsoft/vscode/issues/93831
		assertJoined('file:///c:/foo/bar', './other/foo.img', 'file:///c:/foo/bar/other/foo.img', false);
	});

	test('vscode-uri: URI.toString() wrongly encode IPv6 literals #154048', function () {
		assert.strictEqual(URI.parse('http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html').toString(), 'http://[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:80/index.html');

		assert.strictEqual(URI.parse('http://user@[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html').toString(), 'http://user@[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:80/index.html');
		assert.strictEqual(URI.parse('http://us[er@[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html').toString(), 'http://us%5Ber@[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:80/index.html');
	});

	test('File paths containing apostrophes break URI parsing and cannot be opened #276075', function () {
		if (isWindows) {
			const filePath = 'C:\\Users\\Abd-al-Haseeb\'s_Dell\\Studio\\w3mage\\wp-content\\database.ht.sqlite';
			const uri = URI.file(filePath);
			assert.strictEqual(uri.path, '/C:/Users/Abd-al-Haseeb\'s_Dell/Studio/w3mage/wp-content/database.ht.sqlite');
			assert.strictEqual(uri.fsPath, 'c:\\Users\\Abd-al-Haseeb\'s_Dell\\Studio\\w3mage\\wp-content\\database.ht.sqlite');
		}
	});


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/utils.ts]---
Location: vscode-main/src/vs/base/test/common/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, DisposableTracker, IDisposable, setDisposableTracker } from '../../common/lifecycle.js';
import { join } from '../../common/path.js';
import { isWindows } from '../../common/platform.js';
import { URI } from '../../common/uri.js';

export type ValueCallback<T = any> = (value: T | Promise<T>) => void;

export function toResource(this: any, path: string): URI {
	if (isWindows) {
		return URI.file(join('C:\\', btoa(this.test.fullTitle()), path));
	}

	return URI.file(join('/', btoa(this.test.fullTitle()), path));
}

export function suiteRepeat(n: number, description: string, callback: (this: any) => void): void {
	for (let i = 0; i < n; i++) {
		suite(`${description} (iteration ${i})`, callback);
	}
}

export function testRepeat(n: number, description: string, callback: (this: any) => any): void {
	for (let i = 0; i < n; i++) {
		test(`${description} (iteration ${i})`, callback);
	}
}

export async function assertThrowsAsync(block: () => any, message: string | Error = 'Missing expected exception'): Promise<void> {
	try {
		await block();
	} catch {
		return;
	}

	const err = message instanceof Error ? message : new Error(message);
	throw err;
}

/**
 * Use this function to ensure that all disposables are cleaned up at the end of each test in the current suite.
 *
 * Use `markAsSingleton` if disposable singletons are created lazily that are allowed to outlive the test.
 * Make sure that the singleton properly registers all child disposables so that they are excluded too.
 *
 * @returns A {@link DisposableStore} that can optionally be used to track disposables in the test.
 * This will be automatically disposed on test teardown.
*/
export function ensureNoDisposablesAreLeakedInTestSuite(): Pick<DisposableStore, 'add'> {
	let tracker: DisposableTracker | undefined;
	let store: DisposableStore;
	setup(() => {
		store = new DisposableStore();
		tracker = new DisposableTracker();
		setDisposableTracker(tracker);
	});

	teardown(function (this: import('mocha').Context) {
		store.dispose();
		setDisposableTracker(null);
		if (this.currentTest?.state !== 'failed') {
			const result = tracker!.computeLeakingDisposables();
			if (result) {
				console.error(result.details);
				throw new Error(`There are ${result.leaks.length} undisposed disposables!${result.details}`);
			}
		}
	});

	// Wrap store as the suite function is called before it's initialized
	const testContext = {
		add<T extends IDisposable>(o: T): T {
			return store.add(o);
		}
	};
	return testContext;
}

export function throwIfDisposablesAreLeaked(body: () => void, logToConsole = true): void {
	const tracker = new DisposableTracker();
	setDisposableTracker(tracker);
	body();
	setDisposableTracker(null);
	computeLeakingDisposables(tracker, logToConsole);
}

export async function throwIfDisposablesAreLeakedAsync(body: () => Promise<void>): Promise<void> {
	const tracker = new DisposableTracker();
	setDisposableTracker(tracker);
	await body();
	setDisposableTracker(null);
	computeLeakingDisposables(tracker);
}

function computeLeakingDisposables(tracker: DisposableTracker, logToConsole = true) {
	const result = tracker.computeLeakingDisposables();
	if (result) {
		if (logToConsole) {
			console.error(result.details);
		}
		throw new Error(`There are ${result.leaks.length} undisposed disposables!${result.details}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/uuid.test.ts]---
Location: vscode-main/src/vs/base/test/common/uuid.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as uuid from '../../common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('UUID', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('generation', () => {
		const asHex = uuid.generateUuid();
		assert.strictEqual(asHex.length, 36);
		assert.strictEqual(asHex[14], '4');
		assert.ok(asHex[19] === '8' || asHex[19] === '9' || asHex[19] === 'a' || asHex[19] === 'b');
	});

	test('self-check', function () {
		const t1 = Date.now();
		while (Date.now() - t1 < 50) {
			const value = uuid.generateUuid();
			assert.ok(uuid.isUUID(value));
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/yaml.test.ts]---
Location: vscode-main/src/vs/base/test/common/yaml.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { deepStrictEqual, strictEqual, ok } from 'assert';
import { parse, ParseOptions, YamlParseError, Position, YamlNode } from '../../common/yaml.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';


function assertValidParse(input: string[], expected: YamlNode, expectedErrors: YamlParseError[], options?: ParseOptions): void {
	const errors: YamlParseError[] = [];
	const text = input.join('\n');
	const actual1 = parse(text, errors, options);
	deepStrictEqual(actual1, expected);
	deepStrictEqual(errors, expectedErrors);
}

function pos(line: number, character: number): Position {
	return { line, character };
}

suite('YAML Parser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('scalars', () => {

		test('numbers', () => {
			assertValidParse(['1'], { type: 'number', start: pos(0, 0), end: pos(0, 1), value: 1 }, []);
			assertValidParse(['1.234'], { type: 'number', start: pos(0, 0), end: pos(0, 5), value: 1.234 }, []);
			assertValidParse(['-42'], { type: 'number', start: pos(0, 0), end: pos(0, 3), value: -42 }, []);
		});

		test('boolean', () => {
			assertValidParse(['true'], { type: 'boolean', start: pos(0, 0), end: pos(0, 4), value: true }, []);
			assertValidParse(['false'], { type: 'boolean', start: pos(0, 0), end: pos(0, 5), value: false }, []);
		});

		test('null', () => {
			assertValidParse(['null'], { type: 'null', start: pos(0, 0), end: pos(0, 4), value: null }, []);
			assertValidParse(['~'], { type: 'null', start: pos(0, 0), end: pos(0, 1), value: null }, []);
		});

		test('string', () => {
			assertValidParse(['A Developer'], { type: 'string', start: pos(0, 0), end: pos(0, 11), value: 'A Developer' }, []);
			assertValidParse(['\'A Developer\''], { type: 'string', start: pos(0, 0), end: pos(0, 13), value: 'A Developer' }, []);
			assertValidParse(['"A Developer"'], { type: 'string', start: pos(0, 0), end: pos(0, 13), value: 'A Developer' }, []);
			assertValidParse(['*.js,*.ts'], { type: 'string', start: pos(0, 0), end: pos(0, 9), value: '*.js,*.ts' }, []);
		});
	});

	suite('objects', () => {

		test('simple properties', () => {
			assertValidParse(['name: John Doe'], {
				type: 'object', start: pos(0, 0), end: pos(0, 14), properties: [
					{
						key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
						value: { type: 'string', start: pos(0, 6), end: pos(0, 14), value: 'John Doe' }
					}
				]
			}, []);
			assertValidParse(['age: 30'], {
				type: 'object', start: pos(0, 0), end: pos(0, 7), properties: [
					{
						key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'age' },
						value: { type: 'number', start: pos(0, 5), end: pos(0, 7), value: 30 }
					}
				]
			}, []);
			assertValidParse(['active: true'], {
				type: 'object', start: pos(0, 0), end: pos(0, 12), properties: [
					{
						key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'active' },
						value: { type: 'boolean', start: pos(0, 8), end: pos(0, 12), value: true }
					}
				]
			}, []);
			assertValidParse(['value: null'], {
				type: 'object', start: pos(0, 0), end: pos(0, 11), properties: [
					{
						key: { type: 'string', start: pos(0, 0), end: pos(0, 5), value: 'value' },
						value: { type: 'null', start: pos(0, 7), end: pos(0, 11), value: null }
					}
				]
			}, []);
		});

		test('value on next line', () => {
			assertValidParse(
				[
					'name:',
					'  John Doe',
					'colors:',
					'  [ Red, Green, Blue ]',
				],
				{
					type: 'object', start: pos(0, 0), end: pos(3, 22), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
							value: { type: 'string', start: pos(1, 2), end: pos(1, 10), value: 'John Doe' }
						},
						{
							key: { type: 'string', start: pos(2, 0), end: pos(2, 6), value: 'colors' },
							value: {
								type: 'array', start: pos(3, 2), end: pos(3, 22), items: [
									{ type: 'string', start: pos(3, 4), end: pos(3, 7), value: 'Red' },
									{ type: 'string', start: pos(3, 9), end: pos(3, 14), value: 'Green' },
									{ type: 'string', start: pos(3, 16), end: pos(3, 20), value: 'Blue' }
								]
							}
						}
					]
				},
				[]
			);
		});

		test('multiple properties', () => {
			assertValidParse(
				[
					'name: John Doe',
					'age: 30'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 7), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 14), value: 'John Doe' }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 3), value: 'age' },
							value: { type: 'number', start: pos(1, 5), end: pos(1, 7), value: 30 }
						}
					]
				},
				[]
			);
		});

		test('nested object', () => {
			assertValidParse(
				[
					'person:',
					'  name: John Doe',
					'  age: 30'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(2, 9), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'person' },
							value: {
								type: 'object', start: pos(1, 2), end: pos(2, 9), properties: [
									{
										key: { type: 'string', start: pos(1, 2), end: pos(1, 6), value: 'name' },
										value: { type: 'string', start: pos(1, 8), end: pos(1, 16), value: 'John Doe' }
									},
									{
										key: { type: 'string', start: pos(2, 2), end: pos(2, 5), value: 'age' },
										value: { type: 'number', start: pos(2, 7), end: pos(2, 9), value: 30 }
									}
								]
							}
						}
					]

				},
				[]
			);
		});


		test('nested objects with address', () => {
			assertValidParse(
				[
					'person:',
					'  name: John Doe',
					'  age: 30',
					'  address:',
					'    street: 123 Main St',
					'    city: Example City'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(5, 22), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'person' },
							value: {
								type: 'object', start: pos(1, 2), end: pos(5, 22),
								properties: [
									{
										key: { type: 'string', start: pos(1, 2), end: pos(1, 6), value: 'name' },
										value: { type: 'string', start: pos(1, 8), end: pos(1, 16), value: 'John Doe' }
									},
									{
										key: { type: 'string', start: pos(2, 2), end: pos(2, 5), value: 'age' },
										value: { type: 'number', start: pos(2, 7), end: pos(2, 9), value: 30 }
									},
									{
										key: { type: 'string', start: pos(3, 2), end: pos(3, 9), value: 'address' },
										value: {
											type: 'object', start: pos(4, 4), end: pos(5, 22), properties: [
												{
													key: { type: 'string', start: pos(4, 4), end: pos(4, 10), value: 'street' },
													value: { type: 'string', start: pos(4, 12), end: pos(4, 23), value: '123 Main St' }
												},
												{
													key: { type: 'string', start: pos(5, 4), end: pos(5, 8), value: 'city' },
													value: { type: 'string', start: pos(5, 10), end: pos(5, 22), value: 'Example City' }
												}
											]
										}
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('properties without space after colon', () => {
			assertValidParse(
				['name:John'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 9), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
							value: { type: 'string', start: pos(0, 5), end: pos(0, 9), value: 'John' }
						}
					]
				},
				[]
			);

			// Test mixed: some properties with space, some without
			assertValidParse(
				[
					'config:',
					'  database:',
					'    host:localhost',
					'    port: 5432',
					'    credentials:',
					'      username:admin',
					'      password: secret123'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(6, 25), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'config' },
							value: {
								type: 'object', start: pos(1, 2), end: pos(6, 25), properties: [
									{
										key: { type: 'string', start: pos(1, 2), end: pos(1, 10), value: 'database' },
										value: {
											type: 'object', start: pos(2, 4), end: pos(6, 25), properties: [
												{
													key: { type: 'string', start: pos(2, 4), end: pos(2, 8), value: 'host' },
													value: { type: 'string', start: pos(2, 9), end: pos(2, 18), value: 'localhost' }
												},
												{
													key: { type: 'string', start: pos(3, 4), end: pos(3, 8), value: 'port' },
													value: { type: 'number', start: pos(3, 10), end: pos(3, 14), value: 5432 }
												},
												{
													key: { type: 'string', start: pos(4, 4), end: pos(4, 15), value: 'credentials' },
													value: {
														type: 'object', start: pos(5, 6), end: pos(6, 25), properties: [
															{
																key: { type: 'string', start: pos(5, 6), end: pos(5, 14), value: 'username' },
																value: { type: 'string', start: pos(5, 15), end: pos(5, 20), value: 'admin' }
															},
															{
																key: { type: 'string', start: pos(6, 6), end: pos(6, 14), value: 'password' },
																value: { type: 'string', start: pos(6, 16), end: pos(6, 25), value: 'secret123' }
															}
														]
													}
												}
											]
										}
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('inline objects', () => {
			assertValidParse(
				['{name: John, age: 30}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 21), properties: [
						{
							key: { type: 'string', start: pos(0, 1), end: pos(0, 5), value: 'name' },
							value: { type: 'string', start: pos(0, 7), end: pos(0, 11), value: 'John' }
						},
						{
							key: { type: 'string', start: pos(0, 13), end: pos(0, 16), value: 'age' },
							value: { type: 'number', start: pos(0, 18), end: pos(0, 20), value: 30 }
						}
					]
				},
				[]
			);

			// Test with different data types
			assertValidParse(
				['{active: true, score: 85.5, role: null}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 39), properties: [
						{
							key: { type: 'string', start: pos(0, 1), end: pos(0, 7), value: 'active' },
							value: { type: 'boolean', start: pos(0, 9), end: pos(0, 13), value: true }
						},
						{
							key: { type: 'string', start: pos(0, 15), end: pos(0, 20), value: 'score' },
							value: { type: 'number', start: pos(0, 22), end: pos(0, 26), value: 85.5 }
						},
						{
							key: { type: 'string', start: pos(0, 28), end: pos(0, 32), value: 'role' },
							value: { type: 'null', start: pos(0, 34), end: pos(0, 38), value: null }
						}
					]
				},
				[]
			);

			// Test empty inline object
			assertValidParse(
				['{}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 2), properties: []
				},
				[]
			);

			// Test inline object with quoted keys and values
			assertValidParse(
				['{"name": "John Doe", "age": 30}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 31), properties: [
						{
							key: { type: 'string', start: pos(0, 1), end: pos(0, 7), value: 'name' },
							value: { type: 'string', start: pos(0, 9), end: pos(0, 19), value: 'John Doe' }
						},
						{
							key: { type: 'string', start: pos(0, 21), end: pos(0, 26), value: 'age' },
							value: { type: 'number', start: pos(0, 28), end: pos(0, 30), value: 30 }
						}
					]
				},
				[]
			);

			// Test inline object without spaces
			assertValidParse(
				['{name:John,age:30}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 18), properties: [
						{
							key: { type: 'string', start: pos(0, 1), end: pos(0, 5), value: 'name' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 10), value: 'John' }
						},
						{
							key: { type: 'string', start: pos(0, 11), end: pos(0, 14), value: 'age' },
							value: { type: 'number', start: pos(0, 15), end: pos(0, 17), value: 30 }
						}
					]
				},
				[]
			);

			// Test multi-line inline object with internal comment line between properties
			assertValidParse(
				['{a:1, # comment about b', ' b:2, c:3}'],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 10), properties: [
						{
							key: { type: 'string', start: pos(0, 1), end: pos(0, 2), value: 'a' },
							value: { type: 'number', start: pos(0, 3), end: pos(0, 4), value: 1 }
						},
						{
							key: { type: 'string', start: pos(1, 1), end: pos(1, 2), value: 'b' },
							value: { type: 'number', start: pos(1, 3), end: pos(1, 4), value: 2 }
						},
						{
							key: { type: 'string', start: pos(1, 6), end: pos(1, 7), value: 'c' },
							value: { type: 'number', start: pos(1, 8), end: pos(1, 9), value: 3 }
						}
					]
				},
				[]
			);
		});

		test('special characters in values', () => {
			// Test values with special characters
			assertValidParse(
				[`key: value with \t special chars`],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 31), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'string', start: pos(0, 5), end: pos(0, 31), value: `value with \t special chars` }
						}
					]
				},
				[]
			);
		});

		test('various whitespace types', () => {
			// Test different types of whitespace
			assertValidParse(
				[`key:\t \t \t value`],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 15), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'string', start: pos(0, 10), end: pos(0, 15), value: 'value' }
						}
					]
				},
				[]
			);
		});
	});

	suite('arrays', () => {


		test('arrays', () => {
			assertValidParse(
				[
					'- Boston Red Sox',
					'- Detroit Tigers',
					'- New York Yankees'
				],
				{
					type: 'array', start: pos(0, 0), end: pos(2, 18), items: [
						{ type: 'string', start: pos(0, 2), end: pos(0, 16), value: 'Boston Red Sox' },
						{ type: 'string', start: pos(1, 2), end: pos(1, 16), value: 'Detroit Tigers' },
						{ type: 'string', start: pos(2, 2), end: pos(2, 18), value: 'New York Yankees' }
					]

				},
				[]
			);
		});


		test('inline arrays', () => {
			assertValidParse(
				['[Apple, Banana, Cherry]'],
				{
					type: 'array', start: pos(0, 0), end: pos(0, 23), items: [
						{ type: 'string', start: pos(0, 1), end: pos(0, 6), value: 'Apple' },
						{ type: 'string', start: pos(0, 8), end: pos(0, 14), value: 'Banana' },
						{ type: 'string', start: pos(0, 16), end: pos(0, 22), value: 'Cherry' }
					]

				},
				[]
			);
		});

		test('inline array with internal comment line', () => {
			assertValidParse(
				['[one # comment about two', ',two, three]'],
				{
					type: 'array', start: pos(0, 0), end: pos(1, 12), items: [
						{ type: 'string', start: pos(0, 1), end: pos(0, 4), value: 'one' },
						{ type: 'string', start: pos(1, 1), end: pos(1, 4), value: 'two' },
						{ type: 'string', start: pos(1, 6), end: pos(1, 11), value: 'three' }
					]
				},
				[]
			);
		});

		test('multi-line inline arrays', () => {
			assertValidParse(
				[
					'[',
					'    geen, ',
					'    yello, red]'
				],
				{
					type: 'array', start: pos(0, 0), end: pos(2, 15), items: [
						{ type: 'string', start: pos(1, 4), end: pos(1, 8), value: 'geen' },
						{ type: 'string', start: pos(2, 4), end: pos(2, 9), value: 'yello' },
						{ type: 'string', start: pos(2, 11), end: pos(2, 14), value: 'red' }
					]
				},
				[]
			);
		});

		test('arrays of arrays', () => {
			assertValidParse(
				[
					'-',
					'  - Apple',
					'  - Banana',
					'  - Cherry'
				],
				{
					type: 'array', start: pos(0, 0), end: pos(3, 10), items: [
						{
							type: 'array', start: pos(1, 2), end: pos(3, 10), items: [
								{ type: 'string', start: pos(1, 4), end: pos(1, 9), value: 'Apple' },
								{ type: 'string', start: pos(2, 4), end: pos(2, 10), value: 'Banana' },
								{ type: 'string', start: pos(3, 4), end: pos(3, 10), value: 'Cherry' }
							]
						}
					]
				},
				[]
			);
		});

		test('inline arrays of inline arrays', () => {
			assertValidParse(
				[
					'[',
					'  [ee], [ff, gg]',
					']',
				],
				{
					type: 'array', start: pos(0, 0), end: pos(2, 1), items: [
						{
							type: 'array', start: pos(1, 2), end: pos(1, 6), items: [
								{ type: 'string', start: pos(1, 3), end: pos(1, 5), value: 'ee' },
							],
						},
						{
							type: 'array', start: pos(1, 8), end: pos(1, 16), items: [
								{ type: 'string', start: pos(1, 9), end: pos(1, 11), value: 'ff' },
								{ type: 'string', start: pos(1, 13), end: pos(1, 15), value: 'gg' },
							],
						}
					]
				},
				[]
			);
		});

		test('object with array containing single object', () => {
			assertValidParse(
				[
					'items:',
					'- name: John',
					'  age: 30'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(2, 9), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 5), value: 'items' },
							value: {
								type: 'array', start: pos(1, 0), end: pos(2, 9), items: [
									{
										type: 'object', start: pos(1, 2), end: pos(2, 9), properties: [
											{
												key: { type: 'string', start: pos(1, 2), end: pos(1, 6), value: 'name' },
												value: { type: 'string', start: pos(1, 8), end: pos(1, 12), value: 'John' }
											},
											{
												key: { type: 'string', start: pos(2, 2), end: pos(2, 5), value: 'age' },
												value: { type: 'number', start: pos(2, 7), end: pos(2, 9), value: 30 }
											}
										]
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('arrays of objects', () => {
			assertValidParse(
				[
					'-',
					'  name: one',
					'- name: two',
					'-',
					'  name: three'
				],
				{
					type: 'array', start: pos(0, 0), end: pos(4, 13), items: [
						{
							type: 'object', start: pos(1, 2), end: pos(1, 11), properties: [
								{
									key: { type: 'string', start: pos(1, 2), end: pos(1, 6), value: 'name' },
									value: { type: 'string', start: pos(1, 8), end: pos(1, 11), value: 'one' }
								}
							]
						},
						{
							type: 'object', start: pos(2, 2), end: pos(2, 11), properties: [
								{
									key: { type: 'string', start: pos(2, 2), end: pos(2, 6), value: 'name' },
									value: { type: 'string', start: pos(2, 8), end: pos(2, 11), value: 'two' }
								}
							]
						},
						{
							type: 'object', start: pos(4, 2), end: pos(4, 13), properties: [
								{
									key: { type: 'string', start: pos(4, 2), end: pos(4, 6), value: 'name' },
									value: { type: 'string', start: pos(4, 8), end: pos(4, 13), value: 'three' }
								}
							]
						}
					]
				},
				[]
			);
		});
	});

	suite('complex structures', () => {

		test('array of objects', () => {
			assertValidParse(
				[
					'products:',
					'  - name: Laptop',
					'    price: 999.99',
					'    in_stock: true',
					'  - name: Mouse',
					'    price: 25.50',
					'    in_stock: false'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(6, 19), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 8), value: 'products' },
							value: {
								type: 'array', start: pos(1, 2), end: pos(6, 19), items: [
									{
										type: 'object', start: pos(1, 4), end: pos(3, 18), properties: [
											{
												key: { type: 'string', start: pos(1, 4), end: pos(1, 8), value: 'name' },
												value: { type: 'string', start: pos(1, 10), end: pos(1, 16), value: 'Laptop' }
											},
											{
												key: { type: 'string', start: pos(2, 4), end: pos(2, 9), value: 'price' },
												value: { type: 'number', start: pos(2, 11), end: pos(2, 17), value: 999.99 }
											},
											{
												key: { type: 'string', start: pos(3, 4), end: pos(3, 12), value: 'in_stock' },
												value: { type: 'boolean', start: pos(3, 14), end: pos(3, 18), value: true }
											}
										]
									},
									{
										type: 'object', start: pos(4, 4), end: pos(6, 19), properties: [
											{
												key: { type: 'string', start: pos(4, 4), end: pos(4, 8), value: 'name' },
												value: { type: 'string', start: pos(4, 10), end: pos(4, 15), value: 'Mouse' }
											},
											{
												key: { type: 'string', start: pos(5, 4), end: pos(5, 9), value: 'price' },
												value: { type: 'number', start: pos(5, 11), end: pos(5, 16), value: 25.50 }
											},
											{
												key: { type: 'string', start: pos(6, 4), end: pos(6, 12), value: 'in_stock' },
												value: { type: 'boolean', start: pos(6, 14), end: pos(6, 19), value: false }
											}
										]
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('inline array mixed primitives', () => {
			assertValidParse(
				['vals: [1, true, null, "str"]'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 28), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'vals' },
							value: {
								type: 'array', start: pos(0, 6), end: pos(0, 28), items: [
									{ type: 'number', start: pos(0, 7), end: pos(0, 8), value: 1 },
									{ type: 'boolean', start: pos(0, 10), end: pos(0, 14), value: true },
									{ type: 'null', start: pos(0, 16), end: pos(0, 20), value: null },
									{ type: 'string', start: pos(0, 22), end: pos(0, 27), value: 'str' }
								]
							}
						}
					]
				},
				[]
			);
		});

		test('mixed inline structures', () => {
			assertValidParse(
				['config: {env: "prod", settings: [true, 42], debug: false}'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 57), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'config' },
							value: {
								type: 'object', start: pos(0, 8), end: pos(0, 57), properties: [
									{
										key: { type: 'string', start: pos(0, 9), end: pos(0, 12), value: 'env' },
										value: { type: 'string', start: pos(0, 14), end: pos(0, 20), value: 'prod' }
									},
									{
										key: { type: 'string', start: pos(0, 22), end: pos(0, 30), value: 'settings' },
										value: {
											type: 'array', start: pos(0, 32), end: pos(0, 42), items: [
												{ type: 'boolean', start: pos(0, 33), end: pos(0, 37), value: true },
												{ type: 'number', start: pos(0, 39), end: pos(0, 41), value: 42 }
											]
										}
									},
									{
										key: { type: 'string', start: pos(0, 44), end: pos(0, 49), value: 'debug' },
										value: { type: 'boolean', start: pos(0, 51), end: pos(0, 56), value: false }
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('with comments', () => {
			assertValidParse(
				[
					`# This is a comment`,
					'name: John Doe  # inline comment',
					'age: 30'
				],
				{
					type: 'object', start: pos(1, 0), end: pos(2, 7), properties: [
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 4), value: 'name' },
							value: { type: 'string', start: pos(1, 6), end: pos(1, 14), value: 'John Doe' }
						},
						{
							key: { type: 'string', start: pos(2, 0), end: pos(2, 3), value: 'age' },
							value: { type: 'number', start: pos(2, 5), end: pos(2, 7), value: 30 }
						}
					]
				},
				[]
			);
		});
	});

	suite('edge cases and error handling', () => {


		// Edge cases
		test('duplicate keys error', () => {
			assertValidParse(
				[
					'key: 1',
					'key: 2'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 6), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'number', start: pos(0, 5), end: pos(0, 6), value: 1 }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 3), value: 'key' },
							value: { type: 'number', start: pos(1, 5), end: pos(1, 6), value: 2 }
						}
					]
				},
				[
					{
						message: 'Duplicate key \'key\'',
						code: 'duplicateKey',
						start: pos(1, 0),
						end: pos(1, 3)
					}
				]
			);
		});

		test('duplicate keys allowed with option', () => {
			assertValidParse(
				[
					'key: 1',
					'key: 2'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 6), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'number', start: pos(0, 5), end: pos(0, 6), value: 1 }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 3), value: 'key' },
							value: { type: 'number', start: pos(1, 5), end: pos(1, 6), value: 2 }
						}
					]
				},
				[],
				{ allowDuplicateKeys: true }
			);
		});

		test('unexpected indentation error with recovery', () => {
			// Parser reports error but still captures the over-indented property.
			assertValidParse(
				[
					'key: 1',
					'    stray: value'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 16), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'number', start: pos(0, 5), end: pos(0, 6), value: 1 }
						},
						{
							key: { type: 'string', start: pos(1, 4), end: pos(1, 9), value: 'stray' },
							value: { type: 'string', start: pos(1, 11), end: pos(1, 16), value: 'value' }
						}
					]
				},
				[
					{
						message: 'Unexpected indentation',
						code: 'indentation',
						start: pos(1, 0),
						end: pos(1, 16)
					}
				]
			);
		});

		test('empty values and inline empty array', () => {
			assertValidParse(
				[
					'empty:',
					'array: []'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 9), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 5), value: 'empty' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 6), value: '' }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 5), value: 'array' },
							value: { type: 'array', start: pos(1, 7), end: pos(1, 9), items: [] }
						}
					]
				},
				[]
			);
		});



		test('nested empty objects', () => {
			// Parser should create nodes for both parent and child, with child having empty string value.
			assertValidParse(
				[
					'parent:',
					'  child:'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 8), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 6), value: 'parent' },
							value: {
								type: 'object', start: pos(1, 2), end: pos(1, 8), properties: [
									{
										key: { type: 'string', start: pos(1, 2), end: pos(1, 7), value: 'child' },
										value: { type: 'string', start: pos(1, 8), end: pos(1, 8), value: '' }
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('empty object with only colons', () => {
			// Test object with empty values
			assertValidParse(
				['key1:', 'key2:', 'key3:'],
				{
					type: 'object', start: pos(0, 0), end: pos(2, 5), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'key1' },
							value: { type: 'string', start: pos(0, 5), end: pos(0, 5), value: '' }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 4), value: 'key2' },
							value: { type: 'string', start: pos(1, 5), end: pos(1, 5), value: '' }
						},
						{
							key: { type: 'string', start: pos(2, 0), end: pos(2, 4), value: 'key3' },
							value: { type: 'string', start: pos(2, 5), end: pos(2, 5), value: '' }
						}
					]
				},
				[]
			);
		});

		test('large input performance', () => {
			// Test that large inputs are handled efficiently
			const input = Array.from({ length: 1000 }, (_, i) => `key${i}: value${i}`);
			const expectedProperties = Array.from({ length: 1000 }, (_, i) => ({
				key: { type: 'string' as const, start: pos(i, 0), end: pos(i, `key${i}`.length), value: `key${i}` },
				value: { type: 'string' as const, start: pos(i, `key${i}: `.length), end: pos(i, `key${i}: value${i}`.length), value: `value${i}` }
			}));

			const start = Date.now();
			assertValidParse(
				input,
				{
					type: 'object',
					start: pos(0, 0),
					end: pos(999, 'key999: value999'.length),
					properties: expectedProperties
				},
				[]
			);
			const duration = Date.now() - start;

			ok(duration < 100, `Parsing took ${duration}ms, expected < 100ms`);
		});

		test('deeply nested structure performance', () => {
			// Test that deeply nested structures are handled efficiently
			const lines = [];
			for (let i = 0; i < 50; i++) {
				const indent = '  '.repeat(i);
				lines.push(`${indent}level${i}:`);
			}
			lines.push('  '.repeat(50) + 'deepValue: reached');

			const start = Date.now();
			const errors: YamlParseError[] = [];
			const result = parse(lines.join('\n'), errors);
			const duration = Date.now() - start;

			ok(result);
			strictEqual(result.type, 'object');
			strictEqual(errors.length, 0);
			ok(duration < 100, `Parsing took ${duration}ms, expected < 100ms`);
		});

		test('malformed array with position issues', () => {
			// Test malformed arrays that might cause position advancement issues
			assertValidParse(
				[
					'key: [',
					'',
					'',
					'',
					''
				],
				{
					type: 'object', start: pos(0, 0), end: pos(5, 0), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'array', start: pos(0, 5), end: pos(5, 0), items: [] }
						}
					]
				},
				[]
			);
		});

		test('self-referential like structure', () => {
			// Test structures that might appear self-referential
			assertValidParse(
				[
					'a:',
					'  b:',
					'    a:',
					'      b:',
					'        value: test'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(4, 19), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 1), value: 'a' },
							value: {
								type: 'object', start: pos(1, 2), end: pos(4, 19), properties: [
									{
										key: { type: 'string', start: pos(1, 2), end: pos(1, 3), value: 'b' },
										value: {
											type: 'object', start: pos(2, 4), end: pos(4, 19), properties: [
												{
													key: { type: 'string', start: pos(2, 4), end: pos(2, 5), value: 'a' },
													value: {
														type: 'object', start: pos(3, 6), end: pos(4, 19), properties: [
															{
																key: { type: 'string', start: pos(3, 6), end: pos(3, 7), value: 'b' },
																value: {
																	type: 'object', start: pos(4, 8), end: pos(4, 19), properties: [
																		{
																			key: { type: 'string', start: pos(4, 8), end: pos(4, 13), value: 'value' },
																			value: { type: 'string', start: pos(4, 15), end: pos(4, 19), value: 'test' }
																		}
																	]
																}
															}
														]
													}
												}
											]
										}
									}
								]
							}
						}
					]
				},
				[]
			);
		});

		test('array with empty lines', () => {
			// Test arrays spanning multiple lines with empty lines
			assertValidParse(
				['arr: [', '', 'item1,', '', 'item2', '', ']'],
				{
					type: 'object', start: pos(0, 0), end: pos(6, 1), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'arr' },
							value: {
								type: 'array', start: pos(0, 5), end: pos(6, 1), items: [
									{ type: 'string', start: pos(2, 0), end: pos(2, 5), value: 'item1' },
									{ type: 'string', start: pos(4, 0), end: pos(4, 5), value: 'item2' }
								]
							}
						}
					]
				},
				[]
			);
		});

		test('whitespace advancement robustness', () => {
			// Test that whitespace advancement works correctly
			assertValidParse(
				[`key:      value`],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 15), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 3), value: 'key' },
							value: { type: 'string', start: pos(0, 10), end: pos(0, 15), value: 'value' }
						}
					]
				},
				[]
			);
		});


		test('missing end quote in string values', () => {
			// Test unclosed double quote - parser treats it as bare string with quote included
			assertValidParse(
				['name: "John'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 11), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 11), value: 'John' }
						}
					]
				},
				[]
			);

			// Test unclosed single quote - parser treats it as bare string with quote included
			assertValidParse(
				['description: \'Hello world'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 25), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 11), value: 'description' },
							value: { type: 'string', start: pos(0, 13), end: pos(0, 25), value: 'Hello world' }
						}
					]
				},
				[]
			);

			// Test unclosed quote in multi-line context
			assertValidParse(
				[
					'data: "incomplete',
					'next: value'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(1, 11), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'data' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 17), value: 'incomplete' }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 4), value: 'next' },
							value: { type: 'string', start: pos(1, 6), end: pos(1, 11), value: 'value' }
						}
					]
				},
				[]
			);

			// Test properly quoted strings for comparison
			assertValidParse(
				['name: "John"'],
				{
					type: 'object', start: pos(0, 0), end: pos(0, 12), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'name' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 12), value: 'John' }
						}
					]
				},
				[]
			);
		});

		test('comment in inline array #269078', () => {
			// Test malformed array with comment-like content - should not cause endless loop
			assertValidParse(
				[
					'mode: agent',
					'tools: [#r'
				],
				{
					type: 'object', start: pos(0, 0), end: pos(2, 0), properties: [
						{
							key: { type: 'string', start: pos(0, 0), end: pos(0, 4), value: 'mode' },
							value: { type: 'string', start: pos(0, 6), end: pos(0, 11), value: 'agent' }
						},
						{
							key: { type: 'string', start: pos(1, 0), end: pos(1, 5), value: 'tools' },
							value: { type: 'array', start: pos(1, 7), end: pos(2, 0), items: [] }
						}
					]
				},
				[]
			);
		});


	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/diff/diff.test.ts]---
Location: vscode-main/src/vs/base/test/common/diff/diff.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDiffChange, LcsDiff, StringDiffSequence } from '../../../common/diff/diff.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../utils.js';

function createArray<T>(length: number, value: T): T[] {
	const r: T[] = [];
	for (let i = 0; i < length; i++) {
		r[i] = value;
	}
	return r;
}

function maskBasedSubstring(str: string, mask: boolean[]): string {
	let r = '';
	for (let i = 0; i < str.length; i++) {
		if (mask[i]) {
			r += str.charAt(i);
		}
	}
	return r;
}

function assertAnswer(originalStr: string, modifiedStr: string, changes: IDiffChange[], answerStr: string, onlyLength: boolean = false): void {
	const originalMask = createArray(originalStr.length, true);
	const modifiedMask = createArray(modifiedStr.length, true);

	let i, j, change;
	for (i = 0; i < changes.length; i++) {
		change = changes[i];

		if (change.originalLength) {
			for (j = 0; j < change.originalLength; j++) {
				originalMask[change.originalStart + j] = false;
			}
		}

		if (change.modifiedLength) {
			for (j = 0; j < change.modifiedLength; j++) {
				modifiedMask[change.modifiedStart + j] = false;
			}
		}
	}

	const originalAnswer = maskBasedSubstring(originalStr, originalMask);
	const modifiedAnswer = maskBasedSubstring(modifiedStr, modifiedMask);

	if (onlyLength) {
		assert.strictEqual(originalAnswer.length, answerStr.length);
		assert.strictEqual(modifiedAnswer.length, answerStr.length);
	} else {
		assert.strictEqual(originalAnswer, answerStr);
		assert.strictEqual(modifiedAnswer, answerStr);
	}
}

function lcsInnerTest(originalStr: string, modifiedStr: string, answerStr: string, onlyLength: boolean = false): void {
	const diff = new LcsDiff(new StringDiffSequence(originalStr), new StringDiffSequence(modifiedStr));
	const changes = diff.ComputeDiff(false).changes;
	assertAnswer(originalStr, modifiedStr, changes, answerStr, onlyLength);
}

function stringPower(str: string, power: number): string {
	let r = str;
	for (let i = 0; i < power; i++) {
		r += r;
	}
	return r;
}

function lcsTest(originalStr: string, modifiedStr: string, answerStr: string) {
	lcsInnerTest(originalStr, modifiedStr, answerStr);
	for (let i = 2; i <= 5; i++) {
		lcsInnerTest(stringPower(originalStr, i), stringPower(modifiedStr, i), stringPower(answerStr, i), true);
	}
}

suite('Diff', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('LcsDiff - different strings tests', function () {
		this.timeout(10000);
		lcsTest('heLLo world', 'hello orlando', 'heo orld');
		lcsTest('abcde', 'acd', 'acd'); // simple
		lcsTest('abcdbce', 'bcede', 'bcde'); // skip
		lcsTest('abcdefgabcdefg', 'bcehafg', 'bceafg'); // long
		lcsTest('abcde', 'fgh', ''); // no match
		lcsTest('abcfabc', 'fabc', 'fabc');
		lcsTest('0azby0', '9axbzby9', 'azby');
		lcsTest('0abc00000', '9a1b2c399999', 'abc');

		lcsTest('fooBar', 'myfooBar', 'fooBar'); // all insertions
		lcsTest('fooBar', 'fooMyBar', 'fooBar'); // all insertions
		lcsTest('fooBar', 'fooBar', 'fooBar'); // identical sequences
	});
});

suite('Diff - Ported from VS', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('using continue processing predicate to quit early', function () {
		const left = 'abcdef';
		const right = 'abxxcyyydzzzzezzzzzzzzzzzzzzzzzzzzf';

		// We use a long non-matching portion at the end of the right-side string, so the backwards tracking logic
		// doesn't get there first.
		let predicateCallCount = 0;

		let diff = new LcsDiff(new StringDiffSequence(left), new StringDiffSequence(right), function (leftIndex, longestMatchSoFar) {
			assert.strictEqual(predicateCallCount, 0);

			predicateCallCount++;

			assert.strictEqual(leftIndex, 1);

			// cancel processing
			return false;
		});
		let changes = diff.ComputeDiff(true).changes;

		assert.strictEqual(predicateCallCount, 1);

		// Doesn't include 'c', 'd', or 'e', since we quit on the first request
		assertAnswer(left, right, changes, 'abf');



		// Cancel after the first match ('c')
		diff = new LcsDiff(new StringDiffSequence(left), new StringDiffSequence(right), function (leftIndex, longestMatchSoFar) {
			assert(longestMatchSoFar <= 1); // We never see a match of length > 1

			// Continue processing as long as there hasn't been a match made.
			return longestMatchSoFar < 1;
		});
		changes = diff.ComputeDiff(true).changes;

		assertAnswer(left, right, changes, 'abcf');



		// Cancel after the second match ('d')
		diff = new LcsDiff(new StringDiffSequence(left), new StringDiffSequence(right), function (leftIndex, longestMatchSoFar) {
			assert(longestMatchSoFar <= 2); // We never see a match of length > 2

			// Continue processing as long as there hasn't been a match made.
			return longestMatchSoFar < 2;
		});
		changes = diff.ComputeDiff(true).changes;

		assertAnswer(left, right, changes, 'abcdf');



		// Cancel *one iteration* after the second match ('d')
		let hitSecondMatch = false;
		diff = new LcsDiff(new StringDiffSequence(left), new StringDiffSequence(right), function (leftIndex, longestMatchSoFar) {
			assert(longestMatchSoFar <= 2); // We never see a match of length > 2

			const hitYet = hitSecondMatch;
			hitSecondMatch = longestMatchSoFar > 1;
			// Continue processing as long as there hasn't been a match made.
			return !hitYet;
		});
		changes = diff.ComputeDiff(true).changes;

		assertAnswer(left, right, changes, 'abcdf');



		// Cancel after the third and final match ('e')
		diff = new LcsDiff(new StringDiffSequence(left), new StringDiffSequence(right), function (leftIndex, longestMatchSoFar) {
			assert(longestMatchSoFar <= 3); // We never see a match of length > 3

			// Continue processing as long as there hasn't been a match made.
			return longestMatchSoFar < 3;
		});
		changes = diff.ComputeDiff(true).changes;

		assertAnswer(left, right, changes, 'abcdef');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/naturalLanguage/korean.test.ts]---
Location: vscode-main/src/vs/base/test/common/naturalLanguage/korean.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// allow-any-unicode-file

import { strictEqual } from 'assert';
import { getKoreanAltChars } from '../../../common/naturalLanguage/korean.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../utils.js';

function getKoreanAltCharsForString(text: string): string {
	let result = '';
	for (let i = 0; i < text.length; i++) {
		const chars = getKoreanAltChars(text.charCodeAt(i));
		if (chars) {
			result += String.fromCharCode(...Array.from(chars));
		} else {
			result += text.charAt(i);
		}
	}
	return result;
}

suite('Korean', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getKoreanAltChars', () => {
		test('Modern initial consonants', () => {
			const cases = new Map([
				['ᄀ', 'r'],
				['ᄁ', 'R'],
				['ᄂ', 's'],
				['ᄃ', 'e'],
				['ᄄ', 'E'],
				['ᄅ', 'f'],
				['ᄆ', 'a'],
				['ᄇ', 'q'],
				['ᄈ', 'Q'],
				['ᄉ', 't'],
				['ᄊ', 'T'],
				['ᄋ', 'd'],
				['ᄌ', 'w'],
				['ᄍ', 'W'],
				['ᄎ', 'c'],
				['ᄏ', 'z'],
				['ᄐ', 'x'],
				['ᄑ', 'v'],
				['ᄒ', 'g'],
			]);
			for (const [hangul, alt] of cases.entries()) {
				strictEqual(getKoreanAltCharsForString(hangul), alt, `"${hangul}" should result in "${alt}"`);
			}
		});

		test('Modern latter consonants', () => {
			const cases = new Map([
				['ᆨ', 'r'],
				['ᆩ', 'R'],
				['ᆪ', 'rt'],
				['ᆫ', 's'],
				['ᆬ', 'sw'],
				['ᆭ', 'sg'],
				['ᆮ', 'e'],
				['ᆯ', 'f'],
				['ᆰ', 'fr'],
				['ᆱ', 'fa'],
				['ᆲ', 'fq'],
				['ᆳ', 'ft'],
				['ᆴ', 'fx'],
				['ᆵ', 'fv'],
				['ᆶ', 'fg'],
				['ᆷ', 'a'],
				['ᆸ', 'q'],
				['ᆹ', 'qt'],
				['ᆺ', 't'],
				['ᆻ', 'T'],
				['ᆼ', 'd'],
				['ᆽ', 'w'],
				['ᆾ', 'c'],
				['ᆿ', 'z'],
				['ᇀ', 'x'],
				['ᇁ', 'v'],
				['ᇂ', 'g'],
			]);
			for (const [hangul, alt] of cases.entries()) {
				strictEqual(getKoreanAltCharsForString(hangul), alt, `"${hangul}" (0x${hangul.charCodeAt(0).toString(16)}) should result in "${alt}"`);
			}
		});

		test('Modern vowels', () => {
			const cases = new Map([
				['ᅡ', 'k'],
				['ᅢ', 'o'],
				['ᅣ', 'i'],
				['ᅤ', 'O'],
				['ᅥ', 'j'],
				['ᅦ', 'p'],
				['ᅧ', 'u'],
				['ᅨ', 'P'],
				['ᅩ', 'h'],
				['ᅪ', 'hk'],
				['ᅫ', 'ho'],
				['ᅬ', 'hl'],
				['ᅭ', 'y'],
				['ᅮ', 'n'],
				['ᅯ', 'nj'],
				['ᅰ', 'np'],
				['ᅱ', 'nl'],
				['ᅲ', 'b'],
				['ᅳ', 'm'],
				['ᅴ', 'ml'],
				['ᅵ', 'l'],
			]);
			for (const [hangul, alt] of cases.entries()) {
				strictEqual(getKoreanAltCharsForString(hangul), alt, `"${hangul}" (0x${hangul.charCodeAt(0).toString(16)}) should result in "${alt}"`);
			}
		});

		test('Compatibility Jamo', () => {
			const cases = new Map([
				['ㄱ', 'r'],
				['ㄲ', 'R'],
				['ㄳ', 'rt'],
				['ㄴ', 's'],
				['ㄵ', 'sw'],
				['ㄶ', 'sg'],
				['ㄷ', 'e'],
				['ㄸ', 'E'],
				['ㄹ', 'f'],
				['ㄺ', 'fr'],
				['ㄻ', 'fa'],
				['ㄼ', 'fq'],
				['ㄽ', 'ft'],
				['ㄾ', 'fx'],
				['ㄿ', 'fv'],
				['ㅀ', 'fg'],
				['ㅁ', 'a'],
				['ㅂ', 'q'],
				['ㅃ', 'Q'],
				['ㅄ', 'qt'],
				['ㅅ', 't'],
				['ㅆ', 'T'],
				['ㅇ', 'd'],
				['ㅈ', 'w'],
				['ㅉ', 'W'],
				['ㅊ', 'c'],
				['ㅋ', 'z'],
				['ㅌ', 'x'],
				['ㅍ', 'v'],
				['ㅎ', 'g'],
				['ㅏ', 'k'],
				['ㅐ', 'o'],
				['ㅑ', 'i'],
				['ㅒ', 'O'],
				['ㅓ', 'j'],
				['ㅔ', 'p'],
				['ㅕ', 'u'],
				['ㅖ', 'P'],
				['ㅗ', 'h'],
				['ㅘ', 'hk'],
				['ㅙ', 'ho'],
				['ㅚ', 'hl'],
				['ㅛ', 'y'],
				['ㅜ', 'n'],
				['ㅝ', 'nj'],
				['ㅞ', 'np'],
				['ㅟ', 'nl'],
				['ㅠ', 'b'],
				['ㅡ', 'm'],
				['ㅢ', 'ml'],
				['ㅣ', 'l'],
				// HF: Hangul Filler (everything after this is archaic)
			]);
			for (const [hangul, alt] of cases.entries()) {
				strictEqual(getKoreanAltCharsForString(hangul), alt, `"${hangul}" (0x${hangul.charCodeAt(0).toString(16)}) should result in "${alt}"`);
			}
		});

		// There are too many characters to test exhaustively, so select some
		// real world use cases from this code base (workbench contrib names)
		test('Composed samples', () => {
			const cases = new Map([
				['ㅁㅊㅊㄷㄴ냐ㅠㅑㅣㅑ쇼', 'accessibility'],
				['ㅁㅊ채ㅕㅜㅅ뚜샤시드둣ㄴ', 'accountEntitlements'],
				['며야ㅐ쳗ㄴ', 'audioCues'],
				['ㅠㄱㅁ찯셰먁채ㅣㅐ걐ㄷㄱ2ㅆ디듣ㅅ교', 'bracketPairColorizer2Telemetry'],
				['ㅠㅕㅣㅏㄸ얏', 'bulkEdit'],
				['ㅊ미ㅣㅗㅑㄷㄱㅁㄱ초ㅛ', 'callHierarchy'],
				['촘ㅅ', 'chat'],
				['챙ㄷㅁㅊ샤ㅐㅜㄴ', 'codeActions'],
				['챙ㄷㄸ야색', 'codeEditor'],
				['채ㅡㅡ뭉ㄴ', 'commands'],
				['채ㅡㅡ둣ㄴ', 'comments'],
				['채ㅜ럏ㄸ테ㅐㄳㄷㄱ', 'configExporter'],
				['채ㅜㅅㄷㅌ스두ㅕ', 'contextmenu'],
				['쳔새ㅡㄸ야색', 'customEditor'],
				['ㅇ듀ㅕㅎ', 'debug'],
				['ㅇ덱ㄷㅊㅁㅅㄷㅇㄸㅌㅅ두냐ㅐㅜㅡㅑㅎㄱㅁ색', 'deprecatedExtensionMigrator'],
				['ㄷ얏ㄴㄷㄴ냐ㅐㅜㄴ', 'editSessions'],
				['드ㅡㄷㅅ', 'emmet'],
				['ㄷㅌㅅ두냐ㅐㅜㄴ', 'extensions'],
				['ㄷㅌㅅㄷ구밌ㄷ그ㅑㅜ미', 'externalTerminal'],
				['ㄷㅌㅅㄷ구미ㅕ갸ㅒㅔ둗ㄱ', 'externalUriOpener'],
				['랴ㅣㄷㄴ', 'files'],
				['래ㅣ야ㅜㅎ', 'folding'],
				['래금ㅅ', 'format'],
				['ㅑㅟ묘ㅗㅑㅜㅅㄴ', 'inlayHints'],
				['ㅑㅟㅑㅜㄷ촘ㅅ', 'inlineChat'],
				['ㅑㅜㅅㄷㄱㅁㅊ샾ㄷ', 'interactive'],
				['ㅑㄴ녇', 'issue'],
				['ㅏ됴ㅠㅑㅜ야ㅜㅎㄴ', 'keybindings'],
				['ㅣ무혐ㅎㄷㅇㄷㅅㄷㅊ샤ㅐㅜ', 'languageDetection'],
				['ㅣ무혐ㅎㄷㄴㅅㅁ션', 'languageStatus'],
				['ㅣㅑㅡㅑ샤ㅜ얓ㅁ색', 'limitIndicator'],
				['ㅣㅑㄴㅅ', 'list'],
				['ㅣㅐㅊ미ㅗㅑㄴ새교', 'localHistory'],
				['ㅣㅐㅊ미ㅑㅋㅁ샤ㅐㅜ', 'localization'],
				['ㅣㅐㅎㄴ', 'logs'],
				['ㅡ메ㅔㄷㅇㄸ얏ㄴ', 'mappedEdits'],
				['ㅡㅁ가애주', 'markdown'],
				['ㅡㅁ갇ㄱㄴ', 'markers'],
				['ㅡㄷㄱㅎㄷㄸ야색', 'mergeEditor'],
				['ㅡㅕㅣ샤얄ㄹㄸ야색', 'multiDiffEditor'],
				['ㅜㅐㅅ듀ㅐㅐㅏ', 'notebook'],
				['ㅐㅕ시ㅑㅜㄷ', 'outline'],
				['ㅐㅕ세ㅕㅅ', 'output'],
				['ㅔㄷㄱ래그뭋ㄷ', 'performance'],
				['ㅔㄱㄷㄹㄷㄱ둧ㄷㄴ', 'preferences'],
				['벼ㅑ참ㅊㅊㄷㄴㄴ', 'quickaccess'],
				['ㄱ디며ㅜ촏ㄱ', 'relauncher'],
				['ㄱ드ㅐㅅㄷ', 'remote'],
				['ㄱ드ㅐㅅㄷ쎠ㅜㅜ디', 'remoteTunnel'],
				['ㄴㅁ노', 'sash'],
				['ㄴ츠', 'scm'],
				['ㄴㄷㅁㄱ초', 'search'],
				['ㄴㄷㅁㄱ초ㄸ야색', 'searchEditor'],
				['놈ㄱㄷ', 'share'],
				['누ㅑㅔㅔㄷㅅㄴ', 'snippets'],
				['넫ㄷ초', 'speech'],
				['네ㅣㅁ노', 'splash'],
				['녁ㅍ됸', 'surveys'],
				['ㅅㅁㅎㄴ', 'tags'],
				['ㅅㅁ난', 'tasks'],
				['ㅅ디듣ㅅ교', 'telemetry'],
				['ㅅㄷ그ㅑㅜ미', 'terminal'],
				['ㅅㄷ그ㅑㅜ미채ㅜㅅ갸ㅠ', 'terminalContrib'],
				['ㅅㄷㄴ샤ㅜㅎ', 'testing'],
				['소듣ㄴ', 'themes'],
				['샤ㅡ디ㅑㅜㄷ', 'timeline'],
				['쇼ㅔ도ㅑㄷㄱㅁㄱ초ㅛ', 'typeHierarchy'],
				['ㅕㅔㅇㅁㅅㄷ', 'update'],
				['ㅕ기', 'url'],
				['ㅕㄴㄷㄱㅇㅁㅅ몌개랴ㅣㄷ', 'userDataProfile'],
				['ㅕㄴㄷㄱㅇㅁㅅㅁ뇨ㅜㅊ', 'userDataSync'],
				['ㅈ듀퍋ㅈ', 'webview'],
				['ㅈ듀퍋졔무디', 'webviewPanel'],
				['ㅈ듀퍋ㅈ퍋ㅈ', 'webviewView'],
				['ㅈ디채ㅡ듀무ㅜㄷㄱ', 'welcomeBanner'],
				['ㅈ디채ㅡㄷ야미ㅐㅎ', 'welcomeDialog'],
				['ㅈ디채ㅡㄷㅎㄷㅅ샤ㅜㅎㄴㅅㅁㄳㄷㅇ', 'welcomeGettingStarted'],
				['ㅈ디채ㅡㄷ퍋ㅈㄴ', 'welcomeViews'],
				['ㅈ디채ㅡㄷㅉ미ㅏ소개ㅕ호', 'welcomeWalkthrough'],
				['재가넴ㅊㄷ', 'workspace'],
				['재가넴ㅊㄷㄴ', 'workspaces'],
			]);
			for (const [hangul, alt] of cases.entries()) {
				// Compare with lower case as some cases do not have
				// corresponding hangul inputs
				strictEqual(
					getKoreanAltCharsForString(hangul).toLowerCase(),
					alt.toLowerCase(),
					`"${hangul}" (0x${hangul.charCodeAt(0).toString(16)}) should result in "${alt}"`
				);
			}
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/observables/debug.test.ts]---
Location: vscode-main/src/vs/base/test/common/observables/debug.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { observableValue, derived, autorun } from '../../../common/observable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../utils.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { debugGetObservableGraph } from '../../../common/observableInternal/logging/debugGetDependencyGraph.js';

suite('debug', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('debugGetDependencyGraph', () => {
		const myObservable1 = observableValue('myObservable1', 0);
		const myObservable2 = observableValue('myObservable2', 0);

		const myComputed1 = derived(reader => {
			/** @description myComputed1 */
			const value1 = myObservable1.read(reader);
			const value2 = myObservable2.read(reader);
			const sum = value1 + value2;
			return sum;
		});

		const myComputed2 = derived(reader => {
			/** @description myComputed2 */
			const value1 = myComputed1.read(reader);
			const value2 = myObservable1.read(reader);
			const value3 = myObservable2.read(reader);
			const sum = value1 + value2 + value3;
			return sum;
		});

		const myComputed3 = derived(reader => {
			/** @description myComputed3 */
			const value1 = myComputed2.read(reader);
			const value2 = myObservable1.read(reader);
			const value3 = myObservable2.read(reader);
			const sum = value1 + value2 + value3;
			return sum;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			myComputed3.read(reader);
		}));


		let idx = 0;
		assert.deepStrictEqual(
			debugGetObservableGraph(myComputed3, { type: 'dependencies', debugNamePostProcessor: name => `name${++idx}` }),
			'* derived name1:\n  value: 0\n  state: upToDate\n  dependencies:\n\t\t* derived name2:\n\t\t  value: 0\n\t\t  state: upToDate\n\t\t  dependencies:\n\t\t\t\t* derived name3:\n\t\t\t\t  value: 0\n\t\t\t\t  state: upToDate\n\t\t\t\t  dependencies:\n\t\t\t\t\t\t* observableValue name4:\n\t\t\t\t\t\t  value: 0\n\t\t\t\t\t\t  state: upToDate\n\t\t\t\t\t\t* observableValue name5:\n\t\t\t\t\t\t  value: 0\n\t\t\t\t\t\t  state: upToDate\n\t\t\t\t* observableValue name6 (already listed)\n\t\t\t\t* observableValue name7 (already listed)\n\t\t* observableValue name8 (already listed)\n\t\t* observableValue name9 (already listed)',
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/observables/observable.test.ts]---
Location: vscode-main/src/vs/base/test/common/observables/observable.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { setUnexpectedErrorHandler } from '../../../common/errors.js';
import { Emitter, Event } from '../../../common/event.js';
import { DisposableStore, toDisposable } from '../../../common/lifecycle.js';
import { IDerivedReader, IObservableWithChange, autorun, autorunHandleChanges, autorunWithStoreHandleChanges, derived, derivedDisposable, IObservable, IObserver, ISettableObservable, ITransaction, keepObserved, observableFromEvent, observableSignal, observableValue, recordChanges, transaction, waitForState, derivedHandleChanges, runOnChange, DebugLocation } from '../../../common/observable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../utils.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { observableReducer } from '../../../common/observableInternal/experimental/reducer.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { BaseObservable } from '../../../common/observableInternal/observables/baseObservable.js';

suite('observables', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	/**
	 * Reads these tests to understand how to use observables.
	 */
	suite('tutorial', () => {
		test('observable + autorun', () => {
			const log = new Log();
			// This creates a variable that stores a value and whose value changes can be observed.
			// The name is only used for debugging purposes.
			// The second arg is the initial value.
			const myObservable = observableValue('myObservable', 0);

			// This creates an autorun: It runs immediately and then again whenever any of the
			// dependencies change. Dependencies are tracked by reading observables with the `reader` parameter.
			//
			// The @description is only used for debugging purposes.
			// The autorun has to be disposed! This is very important.
			ds.add(autorun(reader => {
				/** @description myAutorun */

				// This code is run immediately.

				// Use the `reader` to read observable values and track the dependency to them.
				// If you use `observable.get()` instead of `observable.read(reader)`, you will just
				// get the value and not subscribe to it.
				log.log(`myAutorun.run(myObservable: ${myObservable.read(reader)})`);

				// Now that all dependencies are tracked, the autorun is re-run whenever any of the
				// dependencies change.
			}));
			// The autorun runs immediately
			assert.deepStrictEqual(log.getAndClearEntries(), ['myAutorun.run(myObservable: 0)']);

			// We set the observable.
			myObservable.set(1, undefined);
			// -> The autorun runs again when any read observable changed
			assert.deepStrictEqual(log.getAndClearEntries(), ['myAutorun.run(myObservable: 1)']);

			// We set the observable again.
			myObservable.set(1, undefined);
			// -> The autorun does not run again, because the observable didn't change.
			assert.deepStrictEqual(log.getAndClearEntries(), []);

			// Transactions batch autorun runs
			transaction((tx) => {
				myObservable.set(2, tx);
				// No auto-run ran yet, even though the value changed!
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				myObservable.set(3, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			// Only at the end of the transaction the autorun re-runs
			assert.deepStrictEqual(log.getAndClearEntries(), ['myAutorun.run(myObservable: 3)']);

			// Note that the autorun did not see the intermediate value `2`!
		});

		test('derived + autorun', () => {
			const log = new Log();
			const observable1 = observableValue('myObservable1', 0);
			const observable2 = observableValue('myObservable2', 0);

			// A derived value is an observable that is derived from other observables.
			const myDerived = derived(reader => {
				/** @description myDerived */
				const value1 = observable1.read(reader); // Use the reader to track dependencies.
				const value2 = observable2.read(reader);
				const sum = value1 + value2;
				log.log(`myDerived.recompute: ${value1} + ${value2} = ${sum}`);
				return sum;
			});

			// We create an autorun that reacts on changes to our derived value.
			ds.add(autorun(reader => {
				/** @description myAutorun */
				// Autoruns work with observable values and deriveds - in short, they work with any observable.
				log.log(`myAutorun(myDerived: ${myDerived.read(reader)})`);
			}));
			// autorun runs immediately
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: 0 + 0 = 0',
				'myAutorun(myDerived: 0)',
			]);

			observable1.set(1, undefined);
			// and on changes...
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: 1 + 0 = 1',
				'myAutorun(myDerived: 1)',
			]);

			observable2.set(1, undefined);
			// ... of any dependency.
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: 1 + 1 = 2',
				'myAutorun(myDerived: 2)',
			]);

			// Now we change multiple observables in a transaction to batch process the effects.
			transaction((tx) => {
				observable1.set(5, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				observable2.set(5, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			// When changing multiple observables in a transaction,
			// deriveds are only recomputed on demand.
			// (Note that you cannot see the intermediate value when `obs1 == 5` and `obs2 == 1`)
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: 5 + 5 = 10',
				'myAutorun(myDerived: 10)',
			]);

			transaction((tx) => {
				observable1.set(6, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				observable2.set(4, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			// Now the autorun didn't run again, because its dependency changed from 10 to 10 (= no change).
			assert.deepStrictEqual(log.getAndClearEntries(), (['myDerived.recompute: 6 + 4 = 10']));
		});

		test('read during transaction', () => {
			const log = new Log();
			const observable1 = observableValue('myObservable1', 0);
			const observable2 = observableValue('myObservable2', 0);

			const myDerived = derived((reader) => {
				/** @description myDerived */
				const value1 = observable1.read(reader);
				const value2 = observable2.read(reader);
				const sum = value1 + value2;
				log.log(`myDerived.recompute: ${value1} + ${value2} = ${sum}`);
				return sum;
			});

			ds.add(autorun(reader => {
				/** @description myAutorun */
				log.log(`myAutorun(myDerived: ${myDerived.read(reader)})`);
			}));
			// autorun runs immediately
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: 0 + 0 = 0',
				'myAutorun(myDerived: 0)',
			]);

			transaction((tx) => {
				observable1.set(-10, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				myDerived.get(); // This forces a (sync) recomputation of the current value!
				assert.deepStrictEqual(log.getAndClearEntries(), (['myDerived.recompute: -10 + 0 = -10']));
				// This means, that even in transactions you can assume that all values you can read with `get` and `read` are up-to-date.
				// Read these values just might cause additional (potentially unneeded) recomputations.

				observable2.set(10, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			// This autorun runs again, because its dependency changed from 0 to -10 and then back to 0.
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.recompute: -10 + 10 = 0',
				'myAutorun(myDerived: 0)',
			]);
		});

		test('get without observers', () => {
			const log = new Log();
			const observable1 = observableValue('myObservableValue1', 0);

			// We set up some computeds.
			const computed1 = derived((reader) => {
				/** @description computed */
				const value1 = observable1.read(reader);
				const result = value1 % 3;
				log.log(`recompute1: ${value1} % 3 = ${result}`);
				return result;
			});
			const computed2 = derived((reader) => {
				/** @description computed */
				const value1 = computed1.read(reader);
				const result = value1 * 2;
				log.log(`recompute2: ${value1} * 2 = ${result}`);
				return result;
			});
			const computed3 = derived((reader) => {
				/** @description computed */
				const value1 = computed1.read(reader);
				const result = value1 * 3;
				log.log(`recompute3: ${value1} * 3 = ${result}`);
				return result;
			});
			const computedSum = derived((reader) => {
				/** @description computed */
				const value1 = computed2.read(reader);
				const value2 = computed3.read(reader);
				const result = value1 + value2;
				log.log(`recompute4: ${value1} + ${value2} = ${result}`);
				return result;
			});
			assert.deepStrictEqual(log.getAndClearEntries(), []);

			observable1.set(1, undefined);
			assert.deepStrictEqual(log.getAndClearEntries(), []);

			// And now read the computed that dependens on all the others.
			log.log(`value: ${computedSum.get()}`);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 1 % 3 = 1',
				'recompute2: 1 * 2 = 2',
				'recompute3: 1 * 3 = 3',
				'recompute4: 2 + 3 = 5',
				'value: 5',
			]);

			log.log(`value: ${computedSum.get()}`);
			// Because there are no observers, the derived values are not cached (!), but computed from scratch.
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 1 % 3 = 1',
				'recompute2: 1 * 2 = 2',
				'recompute3: 1 * 3 = 3',
				'recompute4: 2 + 3 = 5',
				'value: 5',
			]);

			const disposable = keepObserved(computedSum); // Use keepObserved to keep the cache.
			// You can also use `computedSum.keepObserved(store)` for an inline experience.
			log.log(`value: ${computedSum.get()}`);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 1 % 3 = 1',
				'recompute2: 1 * 2 = 2',
				'recompute3: 1 * 3 = 3',
				'recompute4: 2 + 3 = 5',
				'value: 5',
			]);

			log.log(`value: ${computedSum.get()}`);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'value: 5',
			]);
			// Tada, no recomputations!

			observable1.set(2, undefined);
			// The keepObserved does not force deriveds to be recomputed! They are still lazy.
			assert.deepStrictEqual(log.getAndClearEntries(), ([]));

			log.log(`value: ${computedSum.get()}`);
			// Those deriveds are recomputed on demand, i.e. when someone reads them.
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 2 % 3 = 2',
				'recompute2: 2 * 2 = 4',
				'recompute3: 2 * 3 = 6',
				'recompute4: 4 + 6 = 10',
				'value: 10',
			]);
			log.log(`value: ${computedSum.get()}`);
			// ... and then cached again
			assert.deepStrictEqual(log.getAndClearEntries(), (['value: 10']));

			disposable.dispose(); // Don't forget to dispose the keepAlive to prevent memory leaks!

			log.log(`value: ${computedSum.get()}`);
			// Which disables the cache again
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 2 % 3 = 2',
				'recompute2: 2 * 2 = 4',
				'recompute3: 2 * 3 = 6',
				'recompute4: 4 + 6 = 10',
				'value: 10',
			]);

			log.log(`value: ${computedSum.get()}`);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'recompute1: 2 % 3 = 2',
				'recompute2: 2 * 2 = 4',
				'recompute3: 2 * 3 = 6',
				'recompute4: 4 + 6 = 10',
				'value: 10',
			]);

			// Why don't we just always keep the cache alive?
			// This is because in order to keep the cache alive, we have to keep our subscriptions to our dependencies alive,
			// which could cause memory-leaks.
			// So instead, when the last observer of a derived is disposed, we dispose our subscriptions to our dependencies.
			// `keepObserved` just prevents this from happening.
		});

		test('autorun that receives deltas of signals', () => {
			const log = new Log();

			// A signal is an observable without a value.
			// However, it can ship change information when it is triggered.
			// Readers can process/aggregate this change information.
			const signal = observableSignal<{ msg: string }>('signal');

			const disposable = autorunHandleChanges({
				changeTracker: {
					// The change summary is used to collect the changes
					createChangeSummary: () => ({ msgs: [] as string[] }),
					handleChange(context, changeSummary) {
						if (context.didChange(signal)) {
							// We just push the changes into an array
							changeSummary.msgs.push(context.change.msg);
						}
						return true; // We want to handle the change
					},
				}
			}, (reader, changeSummary) => {
				// When handling the change, make sure to read the signal!
				signal.read(reader);
				log.log('msgs: ' + changeSummary.msgs.join(', '));
			});


			signal.trigger(undefined, { msg: 'foobar' });

			transaction(tx => {
				// You can batch triggering signals.
				// No delta information is lost!
				signal.trigger(tx, { msg: 'hello' });
				signal.trigger(tx, { msg: 'world' });
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'msgs: ',
				'msgs: foobar',
				'msgs: hello, world'
			]);

			disposable.dispose();
		});

		// That is the end of the tutorial.
		// There are lots of utilities you can explore now, like `observableFromEvent`, `Event.fromObservableLight`,
		// autorunWithStore, observableWithStore and so on.
	});

	test('topological order', () => {
		const log = new Log();
		const myObservable1 = observableValue('myObservable1', 0);
		const myObservable2 = observableValue('myObservable2', 0);

		const myComputed1 = derived(reader => {
			/** @description myComputed1 */
			const value1 = myObservable1.read(reader);
			const value2 = myObservable2.read(reader);
			const sum = value1 + value2;
			log.log(`myComputed1.recompute(myObservable1: ${value1} + myObservable2: ${value2} = ${sum})`);
			return sum;
		});

		const myComputed2 = derived(reader => {
			/** @description myComputed2 */
			const value1 = myComputed1.read(reader);
			const value2 = myObservable1.read(reader);
			const value3 = myObservable2.read(reader);
			const sum = value1 + value2 + value3;
			log.log(`myComputed2.recompute(myComputed1: ${value1} + myObservable1: ${value2} + myObservable2: ${value3} = ${sum})`);
			return sum;
		});

		const myComputed3 = derived(reader => {
			/** @description myComputed3 */
			const value1 = myComputed2.read(reader);
			const value2 = myObservable1.read(reader);
			const value3 = myObservable2.read(reader);
			const sum = value1 + value2 + value3;
			log.log(`myComputed3.recompute(myComputed2: ${value1} + myObservable1: ${value2} + myObservable2: ${value3} = ${sum})`);
			return sum;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			log.log(`myAutorun.run(myComputed3: ${myComputed3.read(reader)})`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myComputed1.recompute(myObservable1: 0 + myObservable2: 0 = 0)',
			'myComputed2.recompute(myComputed1: 0 + myObservable1: 0 + myObservable2: 0 = 0)',
			'myComputed3.recompute(myComputed2: 0 + myObservable1: 0 + myObservable2: 0 = 0)',
			'myAutorun.run(myComputed3: 0)',
		]);

		myObservable1.set(1, undefined);
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myComputed1.recompute(myObservable1: 1 + myObservable2: 0 = 1)',
			'myComputed2.recompute(myComputed1: 1 + myObservable1: 1 + myObservable2: 0 = 2)',
			'myComputed3.recompute(myComputed2: 2 + myObservable1: 1 + myObservable2: 0 = 3)',
			'myAutorun.run(myComputed3: 3)',
		]);

		transaction((tx) => {
			myObservable1.set(2, tx);
			myComputed2.get();
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myComputed1.recompute(myObservable1: 2 + myObservable2: 0 = 2)',
				'myComputed2.recompute(myComputed1: 2 + myObservable1: 2 + myObservable2: 0 = 4)',
			]);

			myObservable1.set(3, tx);
			myComputed2.get();
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myComputed1.recompute(myObservable1: 3 + myObservable2: 0 = 3)',
				'myComputed2.recompute(myComputed1: 3 + myObservable1: 3 + myObservable2: 0 = 6)',
			]);
		});
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myComputed3.recompute(myComputed2: 6 + myObservable1: 3 + myObservable2: 0 = 9)',
			'myAutorun.run(myComputed3: 9)',
		]);
	});

	suite('from event', () => {

		function init(): { log: Log; setValue: (value: number | undefined) => void; observable: IObservable<number | undefined> } {
			const log = new Log();

			let value: number | undefined = 0;
			const eventEmitter = new Emitter<void>();

			let id = 0;
			const observable = observableFromEvent(
				(handler) => {
					const curId = id++;
					log.log(`subscribed handler ${curId}`);
					const disposable = eventEmitter.event(handler);

					return {
						dispose: () => {
							log.log(`unsubscribed handler ${curId}`);
							disposable.dispose();
						},
					};
				},
				() => {
					log.log(`compute value ${value}`);
					return value;
				}
			);

			return {
				log,
				setValue: (newValue) => {
					value = newValue;
					eventEmitter.fire();
				},
				observable,
			};
		}

		test('Handle undefined', () => {
			const { log, setValue, observable } = init();

			setValue(undefined);

			const autorunDisposable = autorun(reader => {
				/** @description MyAutorun */
				observable.read(reader);
				log.log(
					`autorun, value: ${observable.read(reader)}`
				);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'subscribed handler 0',
				'compute value undefined',
				'autorun, value: undefined',
			]);

			setValue(1);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'compute value 1',
				'autorun, value: 1'
			]);

			autorunDisposable.dispose();

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'unsubscribed handler 0'
			]);
		});

		test('basic', () => {
			const { log, setValue, observable } = init();

			const shouldReadObservable = observableValue('shouldReadObservable', true);

			const autorunDisposable = autorun(reader => {
				/** @description MyAutorun */
				if (shouldReadObservable.read(reader)) {
					observable.read(reader);
					log.log(
						`autorun, should read: true, value: ${observable.read(reader)}`
					);
				} else {
					log.log(`autorun, should read: false`);
				}
			});
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'subscribed handler 0',
				'compute value 0',
				'autorun, should read: true, value: 0',
			]);

			// Cached get
			log.log(`get value: ${observable.get()}`);
			assert.deepStrictEqual(log.getAndClearEntries(), ['get value: 0']);

			setValue(1);
			// Trigger autorun, no unsub/sub
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'compute value 1',
				'autorun, should read: true, value: 1',
			]);

			// Unsubscribe when not read
			shouldReadObservable.set(false, undefined);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'autorun, should read: false',
				'unsubscribed handler 0',
			]);

			shouldReadObservable.set(true, undefined);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'subscribed handler 1',
				'compute value 1',
				'autorun, should read: true, value: 1',
			]);

			autorunDisposable.dispose();
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'unsubscribed handler 1',
			]);
		});

		test('get without observers', () => {
			const { log, observable } = init();
			assert.deepStrictEqual(log.getAndClearEntries(), []);

			log.log(`get value: ${observable.get()}`);
			// Not cached or subscribed
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'compute value 0',
				'get value: 0',
			]);

			log.log(`get value: ${observable.get()}`);
			// Still not cached or subscribed
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'compute value 0',
				'get value: 0',
			]);
		});
	});

	test('reading derived in transaction unsubscribes unnecessary observables', () => {
		const log = new Log();

		const shouldReadObservable = observableValue('shouldReadMyObs1', true);
		const myObs1 = new LoggingObservableValue('myObs1', 0, log);
		const myComputed = derived(reader => {
			/** @description myComputed */
			log.log('myComputed.recompute');
			if (shouldReadObservable.read(reader)) {
				return myObs1.read(reader);
			}
			return 1;
		});
		ds.add(autorun(reader => {
			/** @description myAutorun */
			const value = myComputed.read(reader);
			log.log(`myAutorun: ${value}`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myComputed.recompute',
			'myObs1.firstObserverAdded',
			'myObs1.get',
			'myAutorun: 0',
		]);

		transaction(tx => {
			myObs1.set(1, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), (['myObs1.set (value 1)']));

			shouldReadObservable.set(false, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), ([]));

			myComputed.get();
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myComputed.recompute',
				'myObs1.lastObserverRemoved',
			]);
		});
		assert.deepStrictEqual(log.getAndClearEntries(), (['myAutorun: 1']));
	});

	test('avoid recomputation of deriveds that are no longer read', () => {
		const log = new Log();

		const myObsShouldRead = new LoggingObservableValue('myObsShouldRead', true, log);
		const myObs1 = new LoggingObservableValue('myObs1', 0, log);

		const myComputed1 = derived(reader => {
			/** @description myComputed1 */
			const myObs1Val = myObs1.read(reader);
			const result = myObs1Val % 10;
			log.log(`myComputed1(myObs1: ${myObs1Val}): Computed ${result}`);
			return myObs1Val;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const shouldRead = myObsShouldRead.read(reader);
			if (shouldRead) {
				const v = myComputed1.read(reader);
				log.log(`myAutorun(shouldRead: true, myComputed1: ${v}): run`);
			} else {
				log.log(`myAutorun(shouldRead: false): run`);
			}
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObsShouldRead.firstObserverAdded',
			'myObsShouldRead.get',
			'myObs1.firstObserverAdded',
			'myObs1.get',
			'myComputed1(myObs1: 0): Computed 0',
			'myAutorun(shouldRead: true, myComputed1: 0): run',
		]);

		transaction(tx => {
			myObsShouldRead.set(false, tx);
			myObs1.set(1, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObsShouldRead.set (value false)',
				'myObs1.set (value 1)',
			]);
		});
		// myComputed1 should not be recomputed here, even though its dependency myObs1 changed!
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObsShouldRead.get',
			'myAutorun(shouldRead: false): run',
			'myObs1.lastObserverRemoved',
		]);

		transaction(tx => {
			myObsShouldRead.set(true, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObsShouldRead.set (value true)',
			]);
		});
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObsShouldRead.get',
			'myObs1.firstObserverAdded',
			'myObs1.get',
			'myComputed1(myObs1: 1): Computed 1',
			'myAutorun(shouldRead: true, myComputed1: 1): run',
		]);
	});

	suite('autorun rerun on neutral change', () => {
		test('autorun reruns on neutral observable double change', () => {
			const log = new Log();
			const myObservable = observableValue('myObservable', 0);

			ds.add(autorun(reader => {
				/** @description myAutorun */
				log.log(`myAutorun.run(myObservable: ${myObservable.read(reader)})`);
			}));
			assert.deepStrictEqual(log.getAndClearEntries(), ['myAutorun.run(myObservable: 0)']);


			transaction((tx) => {
				myObservable.set(2, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				myObservable.set(0, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			assert.deepStrictEqual(log.getAndClearEntries(), ['myAutorun.run(myObservable: 0)']);
		});

		test('autorun does not rerun on indirect neutral observable double change', () => {
			const log = new Log();
			const myObservable = observableValue('myObservable', 0);
			const myDerived = derived(reader => {
				/** @description myDerived */
				const val = myObservable.read(reader);
				log.log(`myDerived.read(myObservable: ${val})`);
				return val;
			});

			ds.add(autorun(reader => {
				/** @description myAutorun */
				log.log(`myAutorun.run(myDerived: ${myDerived.read(reader)})`);
			}));
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.read(myObservable: 0)',
				'myAutorun.run(myDerived: 0)'
			]);

			transaction((tx) => {
				myObservable.set(2, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				myObservable.set(0, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.read(myObservable: 0)'
			]);
		});

		test('autorun reruns on indirect neutral observable double change when changes propagate', () => {
			const log = new Log();
			const myObservable = observableValue('myObservable', 0);
			const myDerived = derived(reader => {
				/** @description myDerived */
				const val = myObservable.read(reader);
				log.log(`myDerived.read(myObservable: ${val})`);
				return val;
			});

			ds.add(autorun(reader => {
				/** @description myAutorun */
				log.log(`myAutorun.run(myDerived: ${myDerived.read(reader)})`);
			}));
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.read(myObservable: 0)',
				'myAutorun.run(myDerived: 0)'
			]);

			transaction((tx) => {
				myObservable.set(2, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);

				myDerived.get(); // This marks the auto-run as changed
				assert.deepStrictEqual(log.getAndClearEntries(), [
					'myDerived.read(myObservable: 2)'
				]);

				myObservable.set(0, tx);
				assert.deepStrictEqual(log.getAndClearEntries(), []);
			});
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myDerived.read(myObservable: 0)',
				'myAutorun.run(myDerived: 0)'
			]);
		});
	});

	test('self-disposing autorun', () => {
		const log = new Log();

		const observable1 = new LoggingObservableValue('myObservable1', 0, log);
		const myObservable2 = new LoggingObservableValue('myObservable2', 0, log);
		const myObservable3 = new LoggingObservableValue('myObservable3', 0, log);

		const d = autorun(reader => {
			/** @description autorun */
			if (observable1.read(reader) >= 2) {
				assert.deepStrictEqual(log.getAndClearEntries(), [
					'myObservable1.set (value 2)',
					'myObservable1.get',
				]);

				myObservable2.read(reader);
				// First time this observable is read
				assert.deepStrictEqual(log.getAndClearEntries(), [
					'myObservable2.firstObserverAdded',
					'myObservable2.get',
				]);

				d.dispose();
				// Disposing removes all observers
				assert.deepStrictEqual(log.getAndClearEntries(), [
					'myObservable1.lastObserverRemoved',
					'myObservable2.lastObserverRemoved',
				]);

				myObservable3.read(reader);
				// This does not subscribe the observable, because the autorun is disposed
				assert.deepStrictEqual(log.getAndClearEntries(), [
					'myObservable3.get',
				]);
			}
		});
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable1.firstObserverAdded',
			'myObservable1.get',
		]);

		observable1.set(1, undefined);
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable1.set (value 1)',
			'myObservable1.get',
		]);

		observable1.set(2, undefined);
		// See asserts in the autorun
		assert.deepStrictEqual(log.getAndClearEntries(), ([]));
	});

	test('changing observables in endUpdate', () => {
		const log = new Log();

		const myObservable1 = new LoggingObservableValue('myObservable1', 0, log);
		const myObservable2 = new LoggingObservableValue('myObservable2', 0, log);

		const myDerived1 = derived(reader => {
			/** @description myDerived1 */
			const val = myObservable1.read(reader);
			log.log(`myDerived1.read(myObservable: ${val})`);
			return val;
		});

		const myDerived2 = derived(reader => {
			/** @description myDerived2 */
			const val = myObservable2.read(reader);
			if (val === 1) {
				myDerived1.read(reader);
			}
			log.log(`myDerived2.read(myObservable: ${val})`);
			return val;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const myDerived1Val = myDerived1.read(reader);
			const myDerived2Val = myDerived2.read(reader);
			log.log(`myAutorun.run(myDerived1: ${myDerived1Val}, myDerived2: ${myDerived2Val})`);
		}));

		transaction(tx => {
			myObservable2.set(1, tx);
			// end update of this observable will trigger endUpdate of myDerived1 and
			// the autorun and the autorun will add myDerived2 as observer to myDerived1
			myObservable1.set(1, tx);
		});
	});

	test('set dependency in derived', () => {
		const log = new Log();

		const myObservable = new LoggingObservableValue('myObservable', 0, log);
		const myComputed = derived(reader => {
			/** @description myComputed */
			let value = myObservable.read(reader);
			const origValue = value;
			log.log(`myComputed(myObservable: ${origValue}): start computing`);
			if (value % 3 !== 0) {
				value++;
				myObservable.set(value, undefined);
			}
			log.log(`myComputed(myObservable: ${origValue}): finished computing`);
			return value;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const value = myComputed.read(reader);
			log.log(`myAutorun(myComputed: ${value})`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'myComputed(myObservable: 0): start computing',
			'myComputed(myObservable: 0): finished computing',
			'myAutorun(myComputed: 0)'
		]);

		myObservable.set(1, undefined);
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.set (value 1)',
			'myObservable.get',
			'myComputed(myObservable: 1): start computing',
			'myObservable.set (value 2)',
			'myComputed(myObservable: 1): finished computing',
			'myObservable.get',
			'myComputed(myObservable: 2): start computing',
			'myObservable.set (value 3)',
			'myComputed(myObservable: 2): finished computing',
			'myObservable.get',
			'myComputed(myObservable: 3): start computing',
			'myComputed(myObservable: 3): finished computing',
			'myAutorun(myComputed: 3)',
		]);
	});

	test('set dependency in autorun', () => {
		const log = new Log();
		const myObservable = new LoggingObservableValue('myObservable', 0, log);

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const value = myObservable.read(reader);
			log.log(`myAutorun(myObservable: ${value}): start`);
			if (value !== 0 && value < 4) {
				myObservable.set(value + 1, undefined);
			}
			log.log(`myAutorun(myObservable: ${value}): end`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'myAutorun(myObservable: 0): start',
			'myAutorun(myObservable: 0): end',
		]);

		myObservable.set(1, undefined);
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.set (value 1)',
			'myObservable.get',
			'myAutorun(myObservable: 1): start',
			'myObservable.set (value 2)',
			'myAutorun(myObservable: 1): end',
			'myObservable.get',
			'myAutorun(myObservable: 2): start',
			'myObservable.set (value 3)',
			'myAutorun(myObservable: 2): end',
			'myObservable.get',
			'myAutorun(myObservable: 3): start',
			'myObservable.set (value 4)',
			'myAutorun(myObservable: 3): end',
			'myObservable.get',
			'myAutorun(myObservable: 4): start',
			'myAutorun(myObservable: 4): end',
		]);
	});

	test('get in transaction between sets', () => {
		const log = new Log();
		const myObservable = new LoggingObservableValue('myObservable', 0, log);

		const myDerived1 = derived(reader => {
			/** @description myDerived1 */
			const value = myObservable.read(reader);
			log.log(`myDerived1(myObservable: ${value}): start computing`);
			return value;
		});

		const myDerived2 = derived(reader => {
			/** @description myDerived2 */
			const value = myDerived1.read(reader);
			log.log(`myDerived2(myDerived1: ${value}): start computing`);
			return value;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const value = myDerived2.read(reader);
			log.log(`myAutorun(myDerived2: ${value})`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'myDerived1(myObservable: 0): start computing',
			'myDerived2(myDerived1: 0): start computing',
			'myAutorun(myDerived2: 0)',
		]);

		transaction(tx => {
			myObservable.set(1, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value 1)',
			]);

			myDerived2.get();
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.get',
				'myDerived1(myObservable: 1): start computing',
				'myDerived2(myDerived1: 1): start computing',
			]);

			myObservable.set(2, tx);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value 2)',
			]);
		});
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.get',
			'myDerived1(myObservable: 2): start computing',
			'myDerived2(myDerived1: 2): start computing',
			'myAutorun(myDerived2: 2)',
		]);
	});

	test('bug: Dont reset states', () => {
		const log = new Log();
		const myObservable1 = new LoggingObservableValue('myObservable1', 0, log);

		const myObservable2 = new LoggingObservableValue('myObservable2', 0, log);
		const myDerived2 = derived(reader => {
			/** @description myDerived2 */
			const val = myObservable2.read(reader);
			log.log(`myDerived2.computed(myObservable2: ${val})`);
			return val % 10;
		});

		const myDerived3 = derived(reader => {
			/** @description myDerived3 */
			const val1 = myObservable1.read(reader);
			const val2 = myDerived2.read(reader);
			log.log(`myDerived3.computed(myDerived1: ${val1}, myDerived2: ${val2})`);
			return `${val1} + ${val2}`;
		});

		ds.add(autorun(reader => {
			/** @description myAutorun */
			const val = myDerived3.read(reader);
			log.log(`myAutorun(myDerived3: ${val})`);
		}));
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable1.firstObserverAdded',
			'myObservable1.get',
			'myObservable2.firstObserverAdded',
			'myObservable2.get',
			'myDerived2.computed(myObservable2: 0)',
			'myDerived3.computed(myDerived1: 0, myDerived2: 0)',
			'myAutorun(myDerived3: 0 + 0)',
		]);

		transaction(tx => {
			myObservable1.set(1, tx); // Mark myDerived 3 as stale
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable1.set (value 1)',
			]);

			myObservable2.set(10, tx); // This is a non-change. myDerived3 should not be marked as possibly-depedency-changed!
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable2.set (value 10)',
			]);
		});
		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable1.get',
			'myObservable2.get',
			'myDerived2.computed(myObservable2: 10)',
			'myDerived3.computed(myDerived1: 1, myDerived2: 0)',
			'myAutorun(myDerived3: 1 + 0)',
		]);
	});

	test('bug: Add observable in endUpdate', () => {
		const myObservable1 = observableValue('myObservable1', 0);
		const myObservable2 = observableValue('myObservable2', 0);

		const myDerived1 = derived(reader => {
			/** @description myDerived1 */
			return myObservable1.read(reader);
		});

		const myDerived2 = derived(reader => {
			/** @description myDerived2 */
			return myObservable2.read(reader);
		});

		const myDerivedA1 = derived(reader => /** @description myDerivedA1 */ {
			const d1 = myDerived1.read(reader);
			if (d1 === 1) {
				// This adds an observer while myDerived is still in update mode.
				// When myDerived exits update mode, the observer shouldn't receive
				// more endUpdate than beginUpdate calls.
				myDerived2.read(reader);
			}
		});

		ds.add(autorun(reader => {
			/** @description myAutorun1 */
			myDerivedA1.read(reader);
		}));

		ds.add(autorun(reader => {
			/** @description myAutorun2 */
			myDerived2.read(reader);
		}));

		transaction(tx => {
			myObservable1.set(1, tx);
			myObservable2.set(1, tx);
		});
	});

	test('bug: fromObservableLight doesnt subscribe', () => {
		const log = new Log();
		const myObservable = new LoggingObservableValue('myObservable', 0, log);

		const myDerived = derived(reader => /** @description myDerived */ {
			const val = myObservable.read(reader);
			log.log(`myDerived.computed(myObservable2: ${val})`);
			return val % 10;
		});

		const e = Event.fromObservableLight(myDerived);
		log.log('event created');
		e(() => {
			log.log('event fired');
		});

		myObservable.set(1, undefined);

		assert.deepStrictEqual(log.getAndClearEntries(), [
			'event created',
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'myDerived.computed(myObservable2: 0)',
			'myObservable.set (value 1)',
			'myObservable.get',
			'myDerived.computed(myObservable2: 1)',
			'event fired',
		]);
	});

	test('bug: Event.fromObservable always should get events', () => {
		const emitter = new Emitter();
		const log = new Log();
		let i = 0;
		const obs = observableFromEvent(emitter.event, () => i);

		i++;
		emitter.fire(1);

		const evt2 = Event.fromObservable(obs);
		const d = evt2(e => {
			log.log(`event fired ${e}`);
		});

		i++;
		emitter.fire(2);
		assert.deepStrictEqual(log.getAndClearEntries(), ['event fired 2']);

		i++;
		emitter.fire(3);
		assert.deepStrictEqual(log.getAndClearEntries(), ['event fired 3']);

		d.dispose();
	});

	test('dont run autorun after dispose', () => {
		const log = new Log();
		const myObservable = new LoggingObservableValue('myObservable', 0, log);

		const d = autorun(reader => {
			/** @description update */
			const v = myObservable.read(reader);
			log.log('autorun, myObservable:' + v);
		});

		transaction(tx => {
			myObservable.set(1, tx);
			d.dispose();
		});

		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'autorun, myObservable:0',
			'myObservable.set (value 1)',
			'myObservable.lastObserverRemoved',
		]);
	});

	suite('waitForState', () => {
		test('resolve', async () => {
			const log = new Log();
			const myObservable = new LoggingObservableValue('myObservable', { state: 'initializing' as 'initializing' | 'ready' | 'error' }, log);

			const p = waitForState(myObservable, p => p.state === 'ready', p => p.state === 'error').then(r => {
				log.log(`resolved ${JSON.stringify(r)}`);
			}, (err) => {
				log.log(`rejected ${JSON.stringify(err)}`);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.firstObserverAdded',
				'myObservable.get',
			]);

			myObservable.set({ state: 'ready' }, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value [object Object])',
				'myObservable.get',
				'myObservable.lastObserverRemoved',
			]);

			await p;

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'resolved {\"state\":\"ready\"}',
			]);
		});

		test('resolveImmediate', async () => {
			const log = new Log();
			const myObservable = new LoggingObservableValue('myObservable', { state: 'ready' as 'initializing' | 'ready' | 'error' }, log);

			const p = waitForState(myObservable, p => p.state === 'ready', p => p.state === 'error').then(r => {
				log.log(`resolved ${JSON.stringify(r)}`);
			}, (err) => {
				log.log(`rejected ${JSON.stringify(err)}`);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.firstObserverAdded',
				'myObservable.get',
				'myObservable.lastObserverRemoved',
			]);

			myObservable.set({ state: 'error' }, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value [object Object])',
			]);

			await p;

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'resolved {\"state\":\"ready\"}',
			]);
		});

		test('reject', async () => {
			const log = new Log();
			const myObservable = new LoggingObservableValue('myObservable', { state: 'initializing' as 'initializing' | 'ready' | 'error' }, log);

			const p = waitForState(myObservable, p => p.state === 'ready', p => p.state === 'error').then(r => {
				log.log(`resolved ${JSON.stringify(r)}`);
			}, (err) => {
				log.log(`rejected ${JSON.stringify(err)}`);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.firstObserverAdded',
				'myObservable.get',
			]);

			myObservable.set({ state: 'error' }, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value [object Object])',
				'myObservable.get',
				'myObservable.lastObserverRemoved',
			]);

			await p;

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'rejected {\"state\":\"error\"}'
			]);
		});

		test('derived as lazy', () => {
			const store = new DisposableStore();
			const log = new Log();
			let i = 0;
			const d = derivedDisposable(() => {
				const id = i++;
				log.log('myDerived ' + id);
				return {
					dispose: () => log.log(`disposed ${id}`)
				};
			});

			d.get();
			assert.deepStrictEqual(log.getAndClearEntries(), ['myDerived 0', 'disposed 0']);
			d.get();
			assert.deepStrictEqual(log.getAndClearEntries(), ['myDerived 1', 'disposed 1']);

			d.keepObserved(store);
			assert.deepStrictEqual(log.getAndClearEntries(), []);
			d.get();
			assert.deepStrictEqual(log.getAndClearEntries(), ['myDerived 2']);
			d.get();
			assert.deepStrictEqual(log.getAndClearEntries(), []);

			store.dispose();

			assert.deepStrictEqual(log.getAndClearEntries(), ['disposed 2']);
		});
	});

	test('observableValue', () => {
		const log = new Log();
		const myObservable1 = observableValue<number>('myObservable1', 0);
		const myObservable2 = observableValue<number, { message: string }>('myObservable2', 0);

		const d = autorun(reader => {
			/** @description update */
			const v1 = myObservable1.read(reader);
			const v2 = myObservable2.read(reader);
			log.log('autorun, myObservable1:' + v1 + ', myObservable2:' + v2);
		});

		assert.deepStrictEqual(log.getAndClearEntries(), [
			'autorun, myObservable1:0, myObservable2:0'
		]);

		// Doesn't trigger the autorun, because no delta was provided and the value did not change
		myObservable1.set(0, undefined);

		assert.deepStrictEqual(log.getAndClearEntries(), [
		]);

		// Triggers the autorun. The value did not change, but a delta value was provided
		myObservable2.set(0, undefined, { message: 'change1' });

		assert.deepStrictEqual(log.getAndClearEntries(), [
			'autorun, myObservable1:0, myObservable2:0'
		]);

		d.dispose();
	});

	suite('autorun error handling', () => {
		test('immediate throw', () => {
			const log = new Log();

			setUnexpectedErrorHandler(e => {
				log.log(`error: ${e.message}`);
			});

			const myObservable = new LoggingObservableValue('myObservable', 0, log);

			const d = autorun(reader => {
				myObservable.read(reader);
				throw new Error('foobar');
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.firstObserverAdded',
				'myObservable.get',
				'error: foobar'
			]);

			myObservable.set(1, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value 1)',
				'myObservable.get',
				'error: foobar',
			]);

			d.dispose();
		});

		test('late throw', () => {
			const log = new Log();

			setUnexpectedErrorHandler(e => {
				log.log(`error: ${e.message}`);
			});

			const myObservable = new LoggingObservableValue('myObservable', 0, log);

			const d = autorun(reader => {
				const value = myObservable.read(reader);
				if (value >= 1) {
					throw new Error('foobar');
				}
			});

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.firstObserverAdded',
				'myObservable.get',
			]);

			myObservable.set(1, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value 1)',
				'myObservable.get',
				'error: foobar',
			]);

			myObservable.set(2, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'myObservable.set (value 2)',
				'myObservable.get',
				'error: foobar',
			]);

			d.dispose();
		});
	});

	test('recomputeInitiallyAndOnChange should work when a dependency sets an observable', () => {
		const store = new DisposableStore();
		const log = new Log();

		const myObservable = new LoggingObservableValue('myObservable', 0, log);

		let shouldUpdate = true;

		const myDerived = derived(reader => {
			/** @description myDerived */

			log.log('myDerived.computed start');

			const val = myObservable.read(reader);

			if (shouldUpdate) {
				shouldUpdate = false;
				myObservable.set(1, undefined);
			}

			log.log('myDerived.computed end');

			return val;
		});

		assert.deepStrictEqual(log.getAndClearEntries(), ([]));

		myDerived.recomputeInitiallyAndOnChange(store, val => {
			log.log(`recomputeInitiallyAndOnChange, myDerived: ${val}`);
		});

		assert.deepStrictEqual(log.getAndClearEntries(), [
			'myDerived.computed start',
			'myObservable.firstObserverAdded',
			'myObservable.get',
			'myObservable.set (value 1)',
			'myDerived.computed end',
			'myDerived.computed start',
			'myObservable.get',
			'myDerived.computed end',
			'recomputeInitiallyAndOnChange, myDerived: 1',
		]);

		myDerived.get();
		assert.deepStrictEqual(log.getAndClearEntries(), ([]));

		store.dispose();
	});

	suite('prevent invalid usage', () => {
		suite('reading outside of compute function', () => {
			test('derived', () => {
				let fn: () => void = () => { };

				const obs = observableValue('obs', 0);
				const d = derived(reader => {
					fn = () => { obs.read(reader); };
					return obs.read(reader);
				});

				const disp = autorun(reader => {
					d.read(reader);
				});

				assert.throws(() => {
					fn();
				});

				disp.dispose();
			});

			test('autorun', () => {
				let fn: () => void = () => { };

				const obs = observableValue('obs', 0);
				const disp = autorun(reader => {
					fn = () => { obs.read(reader); };
					obs.read(reader);
				});

				assert.throws(() => {
					fn();
				});

				disp.dispose();
			});
		});

		test.skip('catches cyclic dependencies', () => {
			const log = new Log();

			setUnexpectedErrorHandler((e) => {
				log.log(e.toString());
			});

			const obs = observableValue('obs', 0);
			const d1 = derived(reader => {
				log.log('d1.computed start');
				const x = obs.read(reader) + d2.read(reader);
				log.log('d1.computed end');
				return x;
			});
			const d2 = derived(reader => {
				log.log('d2.computed start');
				d1.read(reader);
				log.log('d2.computed end');
				return 0;
			});

			const disp = autorun(reader => {
				log.log('autorun start');
				d1.read(reader);
				log.log('autorun end');
				return 0;
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'autorun start',
				'd1.computed start',
				'd2.computed start',
				'Error: Cyclic deriveds are not supported yet!',
				'd1.computed end',
				'autorun end'
			]));

			disp.dispose();
		});
	});

	suite('observableReducer', () => {
		test('main', () => {
			const store = new DisposableStore();
			const log = new Log();

			const myObservable1 = observableValue<number, number>('myObservable1', 5);
			const myObservable2 = observableValue<number, number>('myObservable2', 9);

			const sum = observableReducer(this, {
				initial: () => {
					log.log('createInitial');
					return myObservable1.get() + myObservable2.get();
				},
				disposeFinal: (values) => {
					log.log(`disposeFinal ${values}`);
				},
				changeTracker: recordChanges({ myObservable1, myObservable2 }),
				update: (reader: IDerivedReader<number>, previousValue, changes) => {
					log.log(`update ${JSON.stringify(changes)}`);
					let delta = 0;
					for (const change of changes.changes) {
						delta += change.change;
					}

					reader.reportChange(delta);
					const resultValue = previousValue + delta;
					log.log(`update -> ${resultValue}`);
					return resultValue;
				}
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([]));

			store.add(autorunWithStoreHandleChanges({
				changeTracker: recordChanges({ sum })
			}, (_reader, changes) => {
				log.log(`autorun ${JSON.stringify(changes)}`);
			}));

			assert.deepStrictEqual(log.getAndClearEntries(), [
				'createInitial',
				'update {"changes":[],"myObservable1":5,"myObservable2":9}',
				'update -> 14',
				'autorun {"changes":[],"sum":14}',
			]);

			transaction(tx => {
				myObservable1.set(myObservable1.get() + 1, tx, 1);
				myObservable2.set(myObservable2.get() + 3, tx, 3);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'update {"changes":[{"key":"myObservable1","change":1},{"key":"myObservable2","change":3}],"myObservable1":6,"myObservable2":12}',
				'update -> 18',
				'autorun {"changes":[{"key":"sum","change":4}],"sum":18}'
			]));

			transaction(tx => {
				myObservable1.set(myObservable1.get() + 1, tx, 1);
				const s = sum.get();
				log.log(`sum.get() ${s}`);
				myObservable2.set(myObservable2.get() + 3, tx, 3);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'update {"changes":[{"key":"myObservable1","change":1}],"myObservable1":7,"myObservable2":12}',
				'update -> 19',
				'sum.get() 19',
				'update {"changes":[{"key":"myObservable2","change":3}],"myObservable1":7,"myObservable2":15}',
				'update -> 22',
				'autorun {"changes":[{"key":"sum","change":1}],"sum":22}'
			]));

			store.dispose();

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'disposeFinal 22'
			]));
		});
	});

	suite('disposableStores', () => {
		test('derived with store', () => {
			const log = new Log();
			const observable1 = observableValue('myObservableValue1', 0);

			const computed1 = derived((reader) => {
				const value = observable1.read(reader);
				log.log(`computed ${value}`);
				reader.store.add(toDisposable(() => {
					log.log(`computed1: ${value} disposed`);
				}));
				return value;
			});

			const a = autorun(reader => {
				log.log(`a: ${computed1.read(reader)}`);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed 0',
				'a: 0'
			]));

			observable1.set(1, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed1: 0 disposed',
				'computed 1',
				'a: 1'
			]));

			a.dispose();

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed1: 1 disposed'
			]));
		});

		test('derived with delayedStore', () => {
			const log = new Log();
			const observable1 = observableValue('myObservableValue1', 0);

			const computed1 = derived((reader) => {
				const value = observable1.read(reader);
				log.log(`computed ${value}`);
				reader.delayedStore.add(toDisposable(() => {
					log.log(`computed1: ${value} disposed`);
				}));
				return value;
			});

			const a = autorun(reader => {
				log.log(`a: ${computed1.read(reader)}`);
			});

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed 0',
				'a: 0'
			]));

			observable1.set(1, undefined);

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed 1',
				'computed1: 0 disposed',
				'a: 1'
			]));

			a.dispose();

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'computed1: 1 disposed'
			]));
		});
	});

	test('derivedHandleChanges with reportChanges', () => {
		const log = new Log();

		const signal1 = observableSignal<{ message: string }>('signal1');
		const signal2 = observableSignal<{ message: string }>('signal2');

		const signal2Derived = derivedHandleChanges(
			{ changeTracker: recordChanges({ signal2 }) },
			(reader: IDerivedReader<{ message: string }>, changeSummary) => {
				for (const c of changeSummary.changes) {
					reader.reportChange({ message: c.change.message + ' (derived)' });
				}
			}
		);

		const d = derivedHandleChanges({
			changeTracker: recordChanges({ signal1, signal2Derived }),
		}, (r: IDerivedReader<string>, changes) => {
			const log = changes.changes.map(c => `${c.key}: ${c.change.message}`).join(', ');
			r.reportChange(log);
		});

		const disp = runOnChange(d, (_val, _prev, changes) => {
			log.log(`runOnChange ${JSON.stringify(changes)}`);
		});

		assert.deepStrictEqual(log.getAndClearEntries(), ([]));

		transaction(tx => {
			signal1.trigger(tx, { message: 'foo' });
			signal2.trigger(tx, { message: 'bar' });
		});

		assert.deepStrictEqual(log.getAndClearEntries(), ([
			'runOnChange ["signal1: foo, signal2Derived: bar (derived)"]'
		]));


		transaction(tx => {
			signal2.trigger(tx, { message: 'baz' });
		});

		assert.deepStrictEqual(log.getAndClearEntries(), ([
			'runOnChange ["signal2Derived: baz (derived)"]'
		]));

		disp.dispose();
	});
});

export class LoggingObserver implements IObserver {
	private count = 0;

	constructor(public readonly debugName: string, private readonly log: Log) {
	}

	beginUpdate<T>(observable: IObservable<T>): void {
		this.count++;
		this.log.log(`${this.debugName}.beginUpdate (count ${this.count})`);
	}
	endUpdate<T>(observable: IObservable<T>): void {
		this.log.log(`${this.debugName}.endUpdate (count ${this.count})`);
		this.count--;
	}
	handleChange<T, TChange>(observable: IObservableWithChange<T, TChange>, change: TChange): void {
		this.log.log(`${this.debugName}.handleChange (count ${this.count})`);
	}
	handlePossibleChange<T>(observable: IObservable<T>): void {
		this.log.log(`${this.debugName}.handlePossibleChange`);
	}
}

export class LoggingObservableValue<T, TChange = void>
	extends BaseObservable<T, TChange>
	implements ISettableObservable<T, TChange> {
	private value: T;

	constructor(
		public readonly debugName: string,
		initialValue: T,
		private readonly logger: Log
	) {
		super(DebugLocation.ofCaller());
		this.value = initialValue;
	}

	protected override onFirstObserverAdded(): void {
		this.logger.log(`${this.debugName}.firstObserverAdded`);
	}

	protected override onLastObserverRemoved(): void {
		this.logger.log(`${this.debugName}.lastObserverRemoved`);
	}

	public get(): T {
		this.logger.log(`${this.debugName}.get`);
		return this.value;
	}

	public set(value: T, tx: ITransaction | undefined, change: TChange): void {
		if (this.value === value) {
			return;
		}

		if (!tx) {
			transaction((tx) => {
				this.set(value, tx, change);
			}, () => `Setting ${this.debugName}`);
			return;
		}

		this.logger.log(`${this.debugName}.set (value ${value})`);

		this.value = value;

		for (const observer of this._observers) {
			tx.updateObserver(observer, this);
			observer.handleChange(this, change);
		}
	}

	override toString(): string {
		return `${this.debugName}: ${this.value}`;
	}
}

class Log {
	private readonly entries: string[] = [];
	public log(message: string): void {
		this.entries.push(message);
	}

	public getAndClearEntries(): string[] {
		const entries = [...this.entries];
		this.entries.length = 0;
		return entries;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/crypto.test.ts]---
Location: vscode-main/src/vs/base/test/node/crypto.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { tmpdir } from 'os';
import { join } from '../../common/path.js';
import { checksum } from '../../node/crypto.js';
import { Promises } from '../../node/pfs.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';
import { flakySuite, getRandomTestPath } from './testUtils.js';

flakySuite('Crypto', () => {

	let testDir: string;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {
		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'crypto');

		return fs.promises.mkdir(testDir, { recursive: true });
	});

	teardown(function () {
		return Promises.rm(testDir);
	});

	test('checksum', async () => {
		const testFile = join(testDir, 'checksum.txt');
		await Promises.writeFile(testFile, 'Hello World');

		await checksum(testFile, 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/id.test.ts]---
Location: vscode-main/src/vs/base/test/node/id.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { getMachineId, getSqmMachineId, getDevDeviceId } from '../../node/id.js';
import { getMac } from '../../node/macAddress.js';
import { flakySuite } from './testUtils.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

flakySuite('ID', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('getMachineId', async function () {
		const errors = [];
		const id = await getMachineId(err => errors.push(err));
		assert.ok(id);
		assert.strictEqual(errors.length, 0);
	});

	test('getSqmId', async function () {
		const errors = [];
		const id = await getSqmMachineId(err => errors.push(err));
		assert.ok(typeof id === 'string');
		assert.strictEqual(errors.length, 0);
	});

	test('getDevDeviceId', async function () {
		const errors = [];
		const id = await getDevDeviceId(err => errors.push(err));
		assert.ok(typeof id === 'string');
		assert.strictEqual(errors.length, 0);
	});

	test('getMac', async () => {
		const macAddress = getMac();
		assert.ok(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress), `Expected a MAC address, got: ${macAddress}`);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/nodeStreams.test.ts]---
Location: vscode-main/src/vs/base/test/node/nodeStreams.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Writable } from 'stream';
import assert from 'assert';
import { StreamSplitter } from '../../node/nodeStreams.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('StreamSplitter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should split a stream on a single character splitter', (done) => {
		const chunks: string[] = [];
		const splitter = new StreamSplitter('\n');
		const writable = new Writable({
			write(chunk, _encoding, callback) {
				chunks.push(chunk.toString());
				callback();
			},
		});

		splitter.pipe(writable);
		splitter.write('hello\nwor');
		splitter.write('ld\n');
		splitter.write('foo\nbar\nz');
		splitter.end(() => {
			assert.deepStrictEqual(chunks, ['hello\n', 'world\n', 'foo\n', 'bar\n', 'z']);
			done();
		});
	});

	test('should split a stream on a multi-character splitter', (done) => {
		const chunks: string[] = [];
		const splitter = new StreamSplitter('---');
		const writable = new Writable({
			write(chunk, _encoding, callback) {
				chunks.push(chunk.toString());
				callback();
			},
		});

		splitter.pipe(writable);
		splitter.write('hello---wor');
		splitter.write('ld---');
		splitter.write('foo---bar---z');
		splitter.end(() => {
			assert.deepStrictEqual(chunks, ['hello---', 'world---', 'foo---', 'bar---', 'z']);
			done();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/port.test.ts]---
Location: vscode-main/src/vs/base/test/node/port.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as net from 'net';
import * as ports from '../../node/ports.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';
import { flakySuite } from './testUtils.js';

flakySuite('Ports', () => {
	(process.env['VSCODE_PID'] ? test.skip /* this test fails when run from within VS Code */ : test)('Finds a free port (no timeout)', function (done) {

		// get an initial freeport >= 7000
		ports.findFreePort(7000, 100, 300000).then(initialPort => {
			assert.ok(initialPort >= 7000);

			// create a server to block this port
			const server = net.createServer();
			server.listen(initialPort, undefined, undefined, () => {

				// once listening, find another free port and assert that the port is different from the opened one
				ports.findFreePort(7000, 50, 300000).then(freePort => {
					assert.ok(freePort >= 7000 && freePort !== initialPort);
					server.close();

					done();
				}, err => done(err));
			});
		}, err => done(err));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/powershell.test.ts]---
Location: vscode-main/src/vs/base/test/node/powershell.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as fs from 'fs';
import * as platform from '../../common/platform.js';
import { enumeratePowerShellInstallations, getFirstAvailablePowerShellInstallation, IPowerShellExeDetails } from '../../node/powershell.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

function checkPath(exePath: string) {
	// Check to see if the path exists
	let pathCheckResult = false;
	try {
		const stat = fs.statSync(exePath);
		pathCheckResult = stat.isFile();
	} catch {
		// fs.exists throws on Windows with SymbolicLinks so we
		// also use lstat to try and see if the file exists.
		try {
			pathCheckResult = fs.statSync(fs.readlinkSync(exePath)).isFile();
		} catch {

		}
	}

	assert.strictEqual(pathCheckResult, true);
}

if (platform.isWindows) {
	suite('PowerShell finder', () => {
		ensureNoDisposablesAreLeakedInTestSuite();
		test('Can find first available PowerShell', async () => {
			const pwshExe = await getFirstAvailablePowerShellInstallation();
			const exePath = pwshExe?.exePath;
			assert.notStrictEqual(exePath, null);
			assert.notStrictEqual(pwshExe?.displayName, null);

			checkPath(exePath!);
		});

		test('Can enumerate PowerShells', async () => {
			const pwshs = new Array<IPowerShellExeDetails>();
			for await (const p of enumeratePowerShellInstallations()) {
				pwshs.push(p);
			}

			const powershellLog = 'Found these PowerShells:\n' + pwshs.map(p => `${p.displayName}: ${p.exePath}`).join('\n');
			assert.strictEqual(pwshs.length >= 1, true, powershellLog);

			for (const pwsh of pwshs) {
				checkPath(pwsh.exePath);
			}

			// The last one should always be Windows PowerShell.
			assert.strictEqual(pwshs[pwshs.length - 1].displayName, 'Windows PowerShell', powershellLog);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/ps.test.ts]---
Location: vscode-main/src/vs/base/test/node/ps.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';
import { JS_FILENAME_PATTERN } from '../../node/ps.js';

suite('Process Utils', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('JS file regex', () => {

		function findJsFiles(cmd: string): string[] {
			const matches: string[] = [];
			let match;
			while ((match = JS_FILENAME_PATTERN.exec(cmd)) !== null) {
				matches.push(match[0]);
			}
			return matches;
		}

		test('should match simple .js files', () => {
			deepStrictEqual(findJsFiles('node bootstrap.js'), ['bootstrap.js']);
		});

		test('should match multiple .js files', () => {
			deepStrictEqual(findJsFiles('node server.js --require helper.js'), ['server.js', 'helper.js']);
		});

		test('should match .js files with hyphens', () => {
			deepStrictEqual(findJsFiles('node my-script.js'), ['my-script.js']);
		});

		test('should not match .json files', () => {
			deepStrictEqual(findJsFiles('cat package.json'), []);
		});

		test('should not match .js prefix in .json extension (regression test for \\b fix)', () => {
			// Without the \b word boundary, the regex would incorrectly match "package.js" from "package.json"
			deepStrictEqual(findJsFiles('node --config tsconfig.json'), []);
			deepStrictEqual(findJsFiles('eslint.json'), []);
		});

		test('should not match .jsx files', () => {
			deepStrictEqual(findJsFiles('node component.jsx'), []);
		});

		test('should match .js but not .json in same command', () => {
			deepStrictEqual(findJsFiles('node app.js --config settings.json'), ['app.js']);
		});

		test('should not match partial matches inside other extensions', () => {
			deepStrictEqual(findJsFiles('file.jsmith'), []);
		});

		test('should match .js at end of command', () => {
			deepStrictEqual(findJsFiles('/path/to/script.js'), ['script.js']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/snapshot.test.ts]---
Location: vscode-main/src/vs/base/test/node/snapshot.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { tmpdir } from 'os';
import { getRandomTestPath } from './testUtils.js';
import { Promises } from '../../node/pfs.js';
import { SnapshotContext, assertSnapshot } from '../common/snapshot.js';
import { URI } from '../../common/uri.js';
import { join } from '../../common/path.js';
import { assertThrowsAsync, ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

// tests for snapshot are in Node so that we can use native FS operations to
// set up and validate things.
//
// Uses snapshots for testing snapshots. It's snapception!

suite('snapshot', () => {
	let testDir: string;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {
		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'snapshot');
		return fs.promises.mkdir(testDir, { recursive: true });
	});

	teardown(function () {
		return Promises.rm(testDir);
	});

	const makeContext = (test: Partial<Mocha.Test> | undefined) => {
		return new class extends SnapshotContext {
			constructor() {
				super(test as Mocha.Test);
				this.snapshotsDir = URI.file(testDir);
			}
		};
	};

	const snapshotFileTree = async () => {
		let str = '';

		const printDir = async (dir: string, indent: number) => {
			const children = await Promises.readdir(dir);
			for (const child of children) {
				const p = join(dir, child);
				if ((await fs.promises.stat(p)).isFile()) {
					const content = await fs.promises.readFile(p, 'utf-8');
					str += `${' '.repeat(indent)}${child}:\n`;
					for (const line of content.split('\n')) {
						str += `${' '.repeat(indent + 2)}${line}\n`;
					}
				} else {
					str += `${' '.repeat(indent)}${child}/\n`;
					await printDir(p, indent + 2);
				}
			}
		};

		await printDir(testDir, 0);
		await assertSnapshot(str);
	};

	test('creates a snapshot', async () => {
		const ctx = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		await ctx.assert({ cool: true });
		await snapshotFileTree();
	});

	test('validates a snapshot', async () => {
		const ctx1 = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		await ctx1.assert({ cool: true });

		const ctx2 = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		// should pass:
		await ctx2.assert({ cool: true });

		const ctx3 = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		// should fail:
		await assertThrowsAsync(() => ctx3.assert({ cool: false }));
	});

	test('cleans up old snapshots', async () => {
		const ctx1 = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		await ctx1.assert({ cool: true });
		await ctx1.assert({ nifty: true });
		await ctx1.assert({ customName: 1 }, { name: 'thirdTest', extension: 'txt' });
		await ctx1.assert({ customName: 2 }, { name: 'fourthTest' });

		await snapshotFileTree();

		const ctx2 = makeContext({
			file: 'foo/bar',
			fullTitle: () => 'hello world!'
		});

		await ctx2.assert({ cool: true });
		await ctx2.assert({ customName: 1 }, { name: 'thirdTest' });
		await ctx2.removeOldSnapshots();

		await snapshotFileTree();
	});

	test('formats object nicely', async () => {
		const circular: any = {};
		circular.a = circular;

		await assertSnapshot([
			1,
			true,
			undefined,
			null,
			123n,
			Symbol('heyo'),
			'hello',
			{ hello: 'world' },
			circular,
			new Map([['hello', 1], ['goodbye', 2]]),
			new Set([1, 2, 3]),
			function helloWorld() { },
			/hello/g,
			new Array(10).fill('long string'.repeat(10)),
			{ [Symbol.for('debug.description')]() { return `Range [1 -> 5]`; } },
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/testUtils.ts]---
Location: vscode-main/src/vs/base/test/node/testUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { randomPath } from '../../common/extpath.js';
import { join } from '../../common/path.js';
import * as testUtils from '../common/testUtils.js';

export function getRandomTestPath(tmpdir: string, ...segments: string[]): string {
	return randomPath(join(tmpdir, ...segments));
}

export import flakySuite = testUtils.flakySuite;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/unc.test.ts]---
Location: vscode-main/src/vs/base/test/node/unc.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { getUNCHost } from '../../node/unc.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('UNC', () => {

	test('getUNCHost', () => {

		strictEqual(getUNCHost(undefined), undefined);
		strictEqual(getUNCHost(null), undefined);

		strictEqual(getUNCHost('/'), undefined);
		strictEqual(getUNCHost('/foo'), undefined);

		strictEqual(getUNCHost('c:'), undefined);
		strictEqual(getUNCHost('c:\\'), undefined);
		strictEqual(getUNCHost('c:\\foo'), undefined);
		strictEqual(getUNCHost('c:\\foo\\\\server\\path'), undefined);

		strictEqual(getUNCHost('\\'), undefined);
		strictEqual(getUNCHost('\\\\'), undefined);
		strictEqual(getUNCHost('\\\\localhost'), undefined);

		strictEqual(getUNCHost('\\\\localhost\\'), 'localhost');
		strictEqual(getUNCHost('\\\\localhost\\a'), 'localhost');

		strictEqual(getUNCHost('\\\\.'), undefined);
		strictEqual(getUNCHost('\\\\?'), undefined);

		strictEqual(getUNCHost('\\\\.\\localhost'), '.');
		strictEqual(getUNCHost('\\\\?\\localhost'), '?');

		strictEqual(getUNCHost('\\\\.\\UNC\\localhost'), '.');
		strictEqual(getUNCHost('\\\\?\\UNC\\localhost'), '?');

		strictEqual(getUNCHost('\\\\.\\UNC\\localhost\\'), 'localhost');
		strictEqual(getUNCHost('\\\\?\\UNC\\localhost\\'), 'localhost');

		strictEqual(getUNCHost('\\\\.\\UNC\\localhost\\a'), 'localhost');
		strictEqual(getUNCHost('\\\\?\\UNC\\localhost\\a'), 'localhost');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/node/uri.perf.test.ts]---
Location: vscode-main/src/vs/base/test/node/uri.perf.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { readFileSync } from 'fs';
import { FileAccess } from '../../common/network.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('URI - perf', function () {

	// COMMENT THIS OUT TO RUN TEST
	if (1) {
		return;
	}

	ensureNoDisposablesAreLeakedInTestSuite();

	let manyFileUris: URI[];
	setup(function () {
		manyFileUris = [];
		const data = readFileSync(FileAccess.asFileUri('vs/base/test/node/uri.perf.data.txt').fsPath).toString();
		const lines = data.split('\n');
		for (const line of lines) {
			manyFileUris.push(URI.file(line));
		}
	});

	function perfTest(name: string, callback: Function) {
		test(name, _done => {
			const t1 = Date.now();
			callback();
			const d = Date.now() - t1;
			console.log(`${name} took ${d}ms (${(d / manyFileUris.length).toPrecision(3)} ms/uri) (${manyFileUris.length} uris)`);
			_done();
		});
	}

	perfTest('toString', function () {
		for (const uri of manyFileUris) {
			const data = uri.toString();
			assert.ok(data);
		}
	});

	perfTest('toString(skipEncoding)', function () {
		for (const uri of manyFileUris) {
			const data = uri.toString(true);
			assert.ok(data);
		}
	});

	perfTest('fsPath', function () {
		for (const uri of manyFileUris) {
			const data = uri.fsPath;
			assert.ok(data);
		}
	});

	perfTest('toJSON', function () {
		for (const uri of manyFileUris) {
			const data = uri.toJSON();
			assert.ok(data);
		}
	});

});
```

--------------------------------------------------------------------------------

````

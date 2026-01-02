---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 191
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 191 of 552)

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

---[FILE: src/vs/base/test/common/paging.test.ts]---
Location: vscode-main/src/vs/base/test/common/paging.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { disposableTimeout } from '../../common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../common/cancellation.js';
import { CancellationError, isCancellationError } from '../../common/errors.js';
import { IPager, PagedModel } from '../../common/paging.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

function getPage(pageIndex: number, cancellationToken: CancellationToken): Promise<number[]> {
	if (cancellationToken.isCancellationRequested) {
		return Promise.reject(new CancellationError());
	}

	return Promise.resolve([0, 1, 2, 3, 4].map(i => i + (pageIndex * 5)));
}

class TestPager implements IPager<number> {

	readonly firstPage = [0, 1, 2, 3, 4];
	readonly pageSize = 5;
	readonly total = 100;
	readonly getPage: (pageIndex: number, cancellationToken: CancellationToken) => Promise<number[]>;

	constructor(getPageFn?: (pageIndex: number, cancellationToken: CancellationToken) => Promise<number[]>) {
		this.getPage = getPageFn || getPage;
	}
}

suite('PagedModel', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('isResolved', () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		assert(model.isResolved(0));
		assert(model.isResolved(1));
		assert(model.isResolved(2));
		assert(model.isResolved(3));
		assert(model.isResolved(4));
		assert(!model.isResolved(5));
		assert(!model.isResolved(6));
		assert(!model.isResolved(7));
		assert(!model.isResolved(8));
		assert(!model.isResolved(9));
		assert(!model.isResolved(10));
		assert(!model.isResolved(99));
	});

	test('resolve single', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		assert(!model.isResolved(5));

		await model.resolve(5, CancellationToken.None);
		assert(model.isResolved(5));
	});

	test('resolve page', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		assert(!model.isResolved(5));
		assert(!model.isResolved(6));
		assert(!model.isResolved(7));
		assert(!model.isResolved(8));
		assert(!model.isResolved(9));
		assert(!model.isResolved(10));

		await model.resolve(5, CancellationToken.None);
		assert(model.isResolved(5));
		assert(model.isResolved(6));
		assert(model.isResolved(7));
		assert(model.isResolved(8));
		assert(model.isResolved(9));
		assert(!model.isResolved(10));
	});

	test('resolve page 2', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		assert(!model.isResolved(5));
		assert(!model.isResolved(6));
		assert(!model.isResolved(7));
		assert(!model.isResolved(8));
		assert(!model.isResolved(9));
		assert(!model.isResolved(10));

		await model.resolve(10, CancellationToken.None);
		assert(!model.isResolved(5));
		assert(!model.isResolved(6));
		assert(!model.isResolved(7));
		assert(!model.isResolved(8));
		assert(!model.isResolved(9));
		assert(model.isResolved(10));
	});

	test('preemptive cancellation works', async function () {
		const pager = new TestPager(() => {
			assert(false);
		});

		const model = new PagedModel(pager);

		try {
			await model.resolve(5, CancellationToken.Cancelled);
			return assert(false);
		}
		catch (err) {
			return assert(isCancellationError(err));
		}
	});

	test('cancellation works', function () {
		const pager = new TestPager((_, token) => new Promise((_, e) => {
			store.add(token.onCancellationRequested(() => e(new CancellationError())));
		}));

		const model = new PagedModel(pager);
		const tokenSource = store.add(new CancellationTokenSource());

		const promise = model.resolve(5, tokenSource.token).then(
			() => assert(false),
			err => assert(isCancellationError(err))
		);

		setTimeout(() => tokenSource.cancel(), 10);

		return promise;
	});

	test('same page cancellation works', function () {
		let state = 'idle';

		const pager = new TestPager((pageIndex, token) => {
			state = 'resolving';

			return new Promise((_, e) => {
				store.add(token.onCancellationRequested(() => {
					state = 'idle';
					e(new CancellationError());
				}));
			});
		});

		const model = new PagedModel(pager);

		assert.strictEqual(state, 'idle');

		const tokenSource1 = new CancellationTokenSource();
		const promise1 = model.resolve(5, tokenSource1.token).then(
			() => assert(false),
			err => assert(isCancellationError(err))
		);

		assert.strictEqual(state, 'resolving');

		const tokenSource2 = new CancellationTokenSource();
		const promise2 = model.resolve(6, tokenSource2.token).then(
			() => assert(false),
			err => assert(isCancellationError(err))
		);

		assert.strictEqual(state, 'resolving');

		store.add(disposableTimeout(() => {
			assert.strictEqual(state, 'resolving');
			tokenSource1.cancel();
			assert.strictEqual(state, 'resolving');

			store.add(disposableTimeout(() => {
				assert.strictEqual(state, 'resolving');
				tokenSource2.cancel();
				assert.strictEqual(state, 'idle');
			}, 10));
		}, 10));

		return Promise.all([promise1, promise2]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/path.test.ts]---
Location: vscode-main/src/vs/base/test/common/path.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// NOTE: VSCode's copy of nodejs path library to be usable in common (non-node) namespace
// Copied from: https://github.com/nodejs/node/tree/43dd49c9782848c25e5b03448c8a0f923f13c158

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

import assert from 'assert';
import * as path from '../../common/path.js';
import { isWeb, isWindows } from '../../common/platform.js';
import * as process from '../../common/process.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Paths (Node Implementation)', () => {
	const __filename = 'path.test.js';
	ensureNoDisposablesAreLeakedInTestSuite();
	test('join', () => {
		const failures = [] as string[];
		const backslashRE = /\\/g;

		const joinTests: any = [
			[[path.posix.join, path.win32.join],
			// arguments                     result
			[[['.', 'x/b', '..', '/b/c.js'], 'x/b/c.js'],
			[[], '.'],
			[['/.', 'x/b', '..', '/b/c.js'], '/x/b/c.js'],
			[['/foo', '../../../bar'], '/bar'],
			[['foo', '../../../bar'], '../../bar'],
			[['foo/', '../../../bar'], '../../bar'],
			[['foo/x', '../../../bar'], '../bar'],
			[['foo/x', './bar'], 'foo/x/bar'],
			[['foo/x/', './bar'], 'foo/x/bar'],
			[['foo/x/', '.', 'bar'], 'foo/x/bar'],
			[['./'], './'],
			[['.', './'], './'],
			[['.', '.', '.'], '.'],
			[['.', './', '.'], '.'],
			[['.', '/./', '.'], '.'],
			[['.', '/////./', '.'], '.'],
			[['.'], '.'],
			[['', '.'], '.'],
			[['', 'foo'], 'foo'],
			[['foo', '/bar'], 'foo/bar'],
			[['', '/foo'], '/foo'],
			[['', '', '/foo'], '/foo'],
			[['', '', 'foo'], 'foo'],
			[['foo', ''], 'foo'],
			[['foo/', ''], 'foo/'],
			[['foo', '', '/bar'], 'foo/bar'],
			[['./', '..', '/foo'], '../foo'],
			[['./', '..', '..', '/foo'], '../../foo'],
			[['.', '..', '..', '/foo'], '../../foo'],
			[['', '..', '..', '/foo'], '../../foo'],
			[['/'], '/'],
			[['/', '.'], '/'],
			[['/', '..'], '/'],
			[['/', '..', '..'], '/'],
			[[''], '.'],
			[['', ''], '.'],
			[[' /foo'], ' /foo'],
			[[' ', 'foo'], ' /foo'],
			[[' ', '.'], ' '],
			[[' ', '/'], ' /'],
			[[' ', ''], ' '],
			[['/', 'foo'], '/foo'],
			[['/', '/foo'], '/foo'],
			[['/', '//foo'], '/foo'],
			[['/', '', '/foo'], '/foo'],
			[['', '/', 'foo'], '/foo'],
			[['', '/', '/foo'], '/foo']
			]
			]
		];

		// Windows-specific join tests
		joinTests.push([
			path.win32.join,
			joinTests[0][1].slice(0).concat(
				[// arguments                     result
					// UNC path expected
					[['//foo/bar'], '\\\\foo\\bar\\'],
					[['\\/foo/bar'], '\\\\foo\\bar\\'],
					[['\\\\foo/bar'], '\\\\foo\\bar\\'],
					// UNC path expected - server and share separate
					[['//foo', 'bar'], '\\\\foo\\bar\\'],
					[['//foo/', 'bar'], '\\\\foo\\bar\\'],
					[['//foo', '/bar'], '\\\\foo\\bar\\'],
					// UNC path expected - questionable
					[['//foo', '', 'bar'], '\\\\foo\\bar\\'],
					[['//foo/', '', 'bar'], '\\\\foo\\bar\\'],
					[['//foo/', '', '/bar'], '\\\\foo\\bar\\'],
					// UNC path expected - even more questionable
					[['', '//foo', 'bar'], '\\\\foo\\bar\\'],
					[['', '//foo/', 'bar'], '\\\\foo\\bar\\'],
					[['', '//foo/', '/bar'], '\\\\foo\\bar\\'],
					// No UNC path expected (no double slash in first component)
					[['\\', 'foo/bar'], '\\foo\\bar'],
					[['\\', '/foo/bar'], '\\foo\\bar'],
					[['', '/', '/foo/bar'], '\\foo\\bar'],
					// No UNC path expected (no non-slashes in first component -
					// questionable)
					[['//', 'foo/bar'], '\\foo\\bar'],
					[['//', '/foo/bar'], '\\foo\\bar'],
					[['\\\\', '/', '/foo/bar'], '\\foo\\bar'],
					[['//'], '\\'],
					// No UNC path expected (share name missing - questionable).
					[['//foo'], '\\foo'],
					[['//foo/'], '\\foo\\'],
					[['//foo', '/'], '\\foo\\'],
					[['//foo', '', '/'], '\\foo\\'],
					// No UNC path expected (too many leading slashes - questionable)
					[['///foo/bar'], '\\foo\\bar'],
					[['////foo', 'bar'], '\\foo\\bar'],
					[['\\\\\\/foo/bar'], '\\foo\\bar'],
					// Drive-relative vs drive-absolute paths. This merely describes the
					// status quo, rather than being obviously right
					[['c:'], 'c:.'],
					[['c:.'], 'c:.'],
					[['c:', ''], 'c:.'],
					[['', 'c:'], 'c:.'],
					[['c:.', '/'], 'c:.\\'],
					[['c:.', 'file'], 'c:file'],
					[['c:', '/'], 'c:\\'],
					[['c:', 'file'], 'c:\\file']
				]
			)
		]);
		joinTests.forEach((test: any[]) => {
			if (!Array.isArray(test[0])) {
				test[0] = [test[0]];
			}
			test[0].forEach((join: any) => {
				test[1].forEach((test: any) => {
					const actual = join.apply(null, test[0]);
					const expected = test[1];
					// For non-Windows specific tests with the Windows join(), we need to try
					// replacing the slashes since the non-Windows specific tests' `expected`
					// use forward slashes
					let actualAlt;
					let os;
					if (join === path.win32.join) {
						actualAlt = actual.replace(backslashRE, '/');
						os = 'win32';
					} else {
						os = 'posix';
					}
					const message =
						`path.${os}.join(${test[0].map(JSON.stringify).join(',')})\n  expect=${JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
					if (actual !== expected && actualAlt !== expected) {
						failures.push(`\n${message}`);
					}
				});
			});
		});
		assert.strictEqual(failures.length, 0, failures.join(''));
	});

	test('dirname', () => {
		assert.strictEqual(path.posix.dirname('/a/b/'), '/a');
		assert.strictEqual(path.posix.dirname('/a/b'), '/a');
		assert.strictEqual(path.posix.dirname('/a'), '/');
		assert.strictEqual(path.posix.dirname(''), '.');
		assert.strictEqual(path.posix.dirname('/'), '/');
		assert.strictEqual(path.posix.dirname('////'), '/');
		assert.strictEqual(path.posix.dirname('//a'), '//');
		assert.strictEqual(path.posix.dirname('foo'), '.');

		assert.strictEqual(path.win32.dirname('c:\\'), 'c:\\');
		assert.strictEqual(path.win32.dirname('c:\\foo'), 'c:\\');
		assert.strictEqual(path.win32.dirname('c:\\foo\\'), 'c:\\');
		assert.strictEqual(path.win32.dirname('c:\\foo\\bar'), 'c:\\foo');
		assert.strictEqual(path.win32.dirname('c:\\foo\\bar\\'), 'c:\\foo');
		assert.strictEqual(path.win32.dirname('c:\\foo\\bar\\baz'), 'c:\\foo\\bar');
		assert.strictEqual(path.win32.dirname('\\'), '\\');
		assert.strictEqual(path.win32.dirname('\\foo'), '\\');
		assert.strictEqual(path.win32.dirname('\\foo\\'), '\\');
		assert.strictEqual(path.win32.dirname('\\foo\\bar'), '\\foo');
		assert.strictEqual(path.win32.dirname('\\foo\\bar\\'), '\\foo');
		assert.strictEqual(path.win32.dirname('\\foo\\bar\\baz'), '\\foo\\bar');
		assert.strictEqual(path.win32.dirname('c:'), 'c:');
		assert.strictEqual(path.win32.dirname('c:foo'), 'c:');
		assert.strictEqual(path.win32.dirname('c:foo\\'), 'c:');
		assert.strictEqual(path.win32.dirname('c:foo\\bar'), 'c:foo');
		assert.strictEqual(path.win32.dirname('c:foo\\bar\\'), 'c:foo');
		assert.strictEqual(path.win32.dirname('c:foo\\bar\\baz'), 'c:foo\\bar');
		assert.strictEqual(path.win32.dirname('file:stream'), '.');
		assert.strictEqual(path.win32.dirname('dir\\file:stream'), 'dir');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share'),
			'\\\\unc\\share');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo'),
			'\\\\unc\\share\\');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\'),
			'\\\\unc\\share\\');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar'),
			'\\\\unc\\share\\foo');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar\\'),
			'\\\\unc\\share\\foo');
		assert.strictEqual(path.win32.dirname('\\\\unc\\share\\foo\\bar\\baz'),
			'\\\\unc\\share\\foo\\bar');
		assert.strictEqual(path.win32.dirname('/a/b/'), '/a');
		assert.strictEqual(path.win32.dirname('/a/b'), '/a');
		assert.strictEqual(path.win32.dirname('/a'), '/');
		assert.strictEqual(path.win32.dirname(''), '.');
		assert.strictEqual(path.win32.dirname('/'), '/');
		assert.strictEqual(path.win32.dirname('////'), '/');
		assert.strictEqual(path.win32.dirname('foo'), '.');

		// Tests from VSCode

		function assertDirname(p: string, expected: string, win = false) {
			const actual = win ? path.win32.dirname(p) : path.posix.dirname(p);

			if (actual !== expected) {
				assert.fail(`${p}: expected: ${expected}, ours: ${actual}`);
			}
		}

		assertDirname('foo/bar', 'foo');
		assertDirname('foo\\bar', 'foo', true);
		assertDirname('/foo/bar', '/foo');
		assertDirname('\\foo\\bar', '\\foo', true);
		assertDirname('/foo', '/');
		assertDirname('\\foo', '\\', true);
		assertDirname('/', '/');
		assertDirname('\\', '\\', true);
		assertDirname('foo', '.');
		assertDirname('f', '.');
		assertDirname('f/', '.');
		assertDirname('/folder/', '/');
		assertDirname('c:\\some\\file.txt', 'c:\\some', true);
		assertDirname('c:\\some', 'c:\\', true);
		assertDirname('c:\\', 'c:\\', true);
		assertDirname('c:', 'c:', true);
		assertDirname('\\\\server\\share\\some\\path', '\\\\server\\share\\some', true);
		assertDirname('\\\\server\\share\\some', '\\\\server\\share\\', true);
		assertDirname('\\\\server\\share\\', '\\\\server\\share\\', true);
	});

	test('extname', () => {
		const failures = [] as string[];
		const slashRE = /\//g;

		[
			[__filename, '.js'],
			['', ''],
			['/path/to/file', ''],
			['/path/to/file.ext', '.ext'],
			['/path.to/file.ext', '.ext'],
			['/path.to/file', ''],
			['/path.to/.file', ''],
			['/path.to/.file.ext', '.ext'],
			['/path/to/f.ext', '.ext'],
			['/path/to/..ext', '.ext'],
			['/path/to/..', ''],
			['file', ''],
			['file.ext', '.ext'],
			['.file', ''],
			['.file.ext', '.ext'],
			['/file', ''],
			['/file.ext', '.ext'],
			['/.file', ''],
			['/.file.ext', '.ext'],
			['.path/file.ext', '.ext'],
			['file.ext.ext', '.ext'],
			['file.', '.'],
			['.', ''],
			['./', ''],
			['.file.ext', '.ext'],
			['.file', ''],
			['.file.', '.'],
			['.file..', '.'],
			['..', ''],
			['../', ''],
			['..file.ext', '.ext'],
			['..file', '.file'],
			['..file.', '.'],
			['..file..', '.'],
			['...', '.'],
			['...ext', '.ext'],
			['....', '.'],
			['file.ext/', '.ext'],
			['file.ext//', '.ext'],
			['file/', ''],
			['file//', ''],
			['file./', '.'],
			['file.//', '.'],
		].forEach((test) => {
			const expected = test[1];
			[path.posix.extname, path.win32.extname].forEach((extname) => {
				let input = test[0];
				let os;
				if (extname === path.win32.extname) {
					input = input.replace(slashRE, '\\');
					os = 'win32';
				} else {
					os = 'posix';
				}
				const actual = extname(input);
				const message = `path.${os}.extname(${JSON.stringify(input)})\n  expect=${JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
				if (actual !== expected) {
					failures.push(`\n${message}`);
				}
			});
			{
				const input = `C:${test[0].replace(slashRE, '\\')}`;
				const actual = path.win32.extname(input);
				const message = `path.win32.extname(${JSON.stringify(input)})\n  expect=${JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
				if (actual !== expected) {
					failures.push(`\n${message}`);
				}
			}
		});
		assert.strictEqual(failures.length, 0, failures.join(''));

		// On Windows, backslash is a path separator.
		assert.strictEqual(path.win32.extname('.\\'), '');
		assert.strictEqual(path.win32.extname('..\\'), '');
		assert.strictEqual(path.win32.extname('file.ext\\'), '.ext');
		assert.strictEqual(path.win32.extname('file.ext\\\\'), '.ext');
		assert.strictEqual(path.win32.extname('file\\'), '');
		assert.strictEqual(path.win32.extname('file\\\\'), '');
		assert.strictEqual(path.win32.extname('file.\\'), '.');
		assert.strictEqual(path.win32.extname('file.\\\\'), '.');

		// On *nix, backslash is a valid name component like any other character.
		assert.strictEqual(path.posix.extname('.\\'), '');
		assert.strictEqual(path.posix.extname('..\\'), '.\\');
		assert.strictEqual(path.posix.extname('file.ext\\'), '.ext\\');
		assert.strictEqual(path.posix.extname('file.ext\\\\'), '.ext\\\\');
		assert.strictEqual(path.posix.extname('file\\'), '');
		assert.strictEqual(path.posix.extname('file\\\\'), '');
		assert.strictEqual(path.posix.extname('file.\\'), '.\\');
		assert.strictEqual(path.posix.extname('file.\\\\'), '.\\\\');

		// Tests from VSCode
		assert.strictEqual(path.extname('far.boo'), '.boo');
		assert.strictEqual(path.extname('far.b'), '.b');
		assert.strictEqual(path.extname('far.'), '.');
		assert.strictEqual(path.extname('far.boo/boo.far'), '.far');
		assert.strictEqual(path.extname('far.boo/boo'), '');
	});

	test('resolve', () => {
		const failures = [] as string[];
		const slashRE = /\//g;
		const backslashRE = /\\/g;

		const resolveTests = [
			[path.win32.resolve,
			// arguments                               result
			[[['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'],
			[['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'],
			[['c:/ignore', 'c:/some/file'], 'c:\\some\\file'],
			[['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'],
			[['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'],
			[['c:/', '//'], 'c:\\'],
			[['c:/', '//dir'], 'c:\\dir'],
			[['c:/', '//server/share'], '\\\\server\\share\\'],
			[['c:/', '//server//share'], '\\\\server\\share\\'],
			[['c:/', '///some//dir'], 'c:\\some\\dir'],
			[['C:\\foo\\tmp.3\\', '..\\tmp.3\\cycles\\root.js'],
				'C:\\foo\\tmp.3\\cycles\\root.js']
			]
			],
			[path.posix.resolve,
			// arguments                    result
			[[['/var/lib', '../', 'file/'], '/var/file'],
			[['/var/lib', '/../', 'file/'], '/file'],
			[['/some/dir', '.', '/absolute/'], '/absolute'],
			[['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js']
			]
			],
			[(isWeb ? path.posix.resolve : path.resolve),
			// arguments						result
			[[['.'], process.cwd()],
			[['a/b/c', '../../..'], process.cwd()]
			]
			],
		];
		resolveTests.forEach((test) => {
			const resolve = test[0];
			//@ts-expect-error
			test[1].forEach((test) => {
				//@ts-expect-error
				const actual = resolve.apply(null, test[0]);
				let actualAlt;
				const os = resolve === path.win32.resolve ? 'win32' : 'posix';
				if (resolve === path.win32.resolve && !isWindows) {
					actualAlt = actual.replace(backslashRE, '/');
				}
				else if (resolve !== path.win32.resolve && isWindows) {
					actualAlt = actual.replace(slashRE, '\\');
				}

				const expected = test[1];
				const message =
					`path.${os}.resolve(${test[0].map(JSON.stringify).join(',')})\n  expect=${JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
				if (actual !== expected && actualAlt !== expected) {
					failures.push(`\n${message}`);
				}
			});
		});
		assert.strictEqual(failures.length, 0, failures.join(''));

		// if (isWindows) {
		// 	// Test resolving the current Windows drive letter from a spawned process.
		// 	// See https://github.com/nodejs/node/issues/7215
		// 	const currentDriveLetter = path.parse(process.cwd()).root.substring(0, 2);
		// 	const resolveFixture = fixtures.path('path-resolve.js');
		// 	const spawnResult = child.spawnSync(
		// 		process.argv[0], [resolveFixture, currentDriveLetter]);
		// 	const resolvedPath = spawnResult.stdout.toString().trim();
		// 	assert.strictEqual(resolvedPath.toLowerCase(), process.cwd().toLowerCase());
		// }
	});

	test('basename', () => {
		assert.strictEqual(path.basename(__filename), 'path.test.js');
		assert.strictEqual(path.basename(__filename, '.js'), 'path.test');
		assert.strictEqual(path.basename('.js', '.js'), '');
		assert.strictEqual(path.basename(''), '');
		assert.strictEqual(path.basename('/dir/basename.ext'), 'basename.ext');
		assert.strictEqual(path.basename('/basename.ext'), 'basename.ext');
		assert.strictEqual(path.basename('basename.ext'), 'basename.ext');
		assert.strictEqual(path.basename('basename.ext/'), 'basename.ext');
		assert.strictEqual(path.basename('basename.ext//'), 'basename.ext');
		assert.strictEqual(path.basename('aaa/bbb', '/bbb'), 'bbb');
		assert.strictEqual(path.basename('aaa/bbb', 'a/bbb'), 'bbb');
		assert.strictEqual(path.basename('aaa/bbb', 'bbb'), 'bbb');
		assert.strictEqual(path.basename('aaa/bbb//', 'bbb'), 'bbb');
		assert.strictEqual(path.basename('aaa/bbb', 'bb'), 'b');
		assert.strictEqual(path.basename('aaa/bbb', 'b'), 'bb');
		assert.strictEqual(path.basename('/aaa/bbb', '/bbb'), 'bbb');
		assert.strictEqual(path.basename('/aaa/bbb', 'a/bbb'), 'bbb');
		assert.strictEqual(path.basename('/aaa/bbb', 'bbb'), 'bbb');
		assert.strictEqual(path.basename('/aaa/bbb//', 'bbb'), 'bbb');
		assert.strictEqual(path.basename('/aaa/bbb', 'bb'), 'b');
		assert.strictEqual(path.basename('/aaa/bbb', 'b'), 'bb');
		assert.strictEqual(path.basename('/aaa/bbb'), 'bbb');
		assert.strictEqual(path.basename('/aaa/'), 'aaa');
		assert.strictEqual(path.basename('/aaa/b'), 'b');
		assert.strictEqual(path.basename('/a/b'), 'b');
		assert.strictEqual(path.basename('//a'), 'a');
		assert.strictEqual(path.basename('a', 'a'), '');

		// On Windows a backslash acts as a path separator.
		assert.strictEqual(path.win32.basename('\\dir\\basename.ext'), 'basename.ext');
		assert.strictEqual(path.win32.basename('\\basename.ext'), 'basename.ext');
		assert.strictEqual(path.win32.basename('basename.ext'), 'basename.ext');
		assert.strictEqual(path.win32.basename('basename.ext\\'), 'basename.ext');
		assert.strictEqual(path.win32.basename('basename.ext\\\\'), 'basename.ext');
		assert.strictEqual(path.win32.basename('foo'), 'foo');
		assert.strictEqual(path.win32.basename('aaa\\bbb', '\\bbb'), 'bbb');
		assert.strictEqual(path.win32.basename('aaa\\bbb', 'a\\bbb'), 'bbb');
		assert.strictEqual(path.win32.basename('aaa\\bbb', 'bbb'), 'bbb');
		assert.strictEqual(path.win32.basename('aaa\\bbb\\\\\\\\', 'bbb'), 'bbb');
		assert.strictEqual(path.win32.basename('aaa\\bbb', 'bb'), 'b');
		assert.strictEqual(path.win32.basename('aaa\\bbb', 'b'), 'bb');
		assert.strictEqual(path.win32.basename('C:'), '');
		assert.strictEqual(path.win32.basename('C:.'), '.');
		assert.strictEqual(path.win32.basename('C:\\'), '');
		assert.strictEqual(path.win32.basename('C:\\dir\\base.ext'), 'base.ext');
		assert.strictEqual(path.win32.basename('C:\\basename.ext'), 'basename.ext');
		assert.strictEqual(path.win32.basename('C:basename.ext'), 'basename.ext');
		assert.strictEqual(path.win32.basename('C:basename.ext\\'), 'basename.ext');
		assert.strictEqual(path.win32.basename('C:basename.ext\\\\'), 'basename.ext');
		assert.strictEqual(path.win32.basename('C:foo'), 'foo');
		assert.strictEqual(path.win32.basename('file:stream'), 'file:stream');
		assert.strictEqual(path.win32.basename('a', 'a'), '');

		// On unix a backslash is just treated as any other character.
		assert.strictEqual(path.posix.basename('\\dir\\basename.ext'),
			'\\dir\\basename.ext');
		assert.strictEqual(path.posix.basename('\\basename.ext'), '\\basename.ext');
		assert.strictEqual(path.posix.basename('basename.ext'), 'basename.ext');
		assert.strictEqual(path.posix.basename('basename.ext\\'), 'basename.ext\\');
		assert.strictEqual(path.posix.basename('basename.ext\\\\'), 'basename.ext\\\\');
		assert.strictEqual(path.posix.basename('foo'), 'foo');

		// POSIX filenames may include control characters
		// c.f. http://www.dwheeler.com/essays/fixing-unix-linux-filenames.html
		const controlCharFilename = `Icon${String.fromCharCode(13)}`;
		assert.strictEqual(path.posix.basename(`/a/b/${controlCharFilename}`),
			controlCharFilename);

		// Tests from VSCode
		assert.strictEqual(path.basename('foo/bar'), 'bar');
		assert.strictEqual(path.posix.basename('foo\\bar'), 'foo\\bar');
		assert.strictEqual(path.win32.basename('foo\\bar'), 'bar');
		assert.strictEqual(path.basename('/foo/bar'), 'bar');
		assert.strictEqual(path.posix.basename('\\foo\\bar'), '\\foo\\bar');
		assert.strictEqual(path.win32.basename('\\foo\\bar'), 'bar');
		assert.strictEqual(path.basename('./bar'), 'bar');
		assert.strictEqual(path.posix.basename('.\\bar'), '.\\bar');
		assert.strictEqual(path.win32.basename('.\\bar'), 'bar');
		assert.strictEqual(path.basename('/bar'), 'bar');
		assert.strictEqual(path.posix.basename('\\bar'), '\\bar');
		assert.strictEqual(path.win32.basename('\\bar'), 'bar');
		assert.strictEqual(path.basename('bar/'), 'bar');
		assert.strictEqual(path.posix.basename('bar\\'), 'bar\\');
		assert.strictEqual(path.win32.basename('bar\\'), 'bar');
		assert.strictEqual(path.basename('bar'), 'bar');
		assert.strictEqual(path.basename('////////'), '');
		assert.strictEqual(path.posix.basename('\\\\\\\\'), '\\\\\\\\');
		assert.strictEqual(path.win32.basename('\\\\\\\\'), '');
	});

	test('relative', () => {
		const failures = [] as string[];

		const relativeTests = [
			[path.win32.relative,
			// arguments                     result
			[['c:/blah\\blah', 'd:/games', 'd:\\games'],
			['c:/aaaa/bbbb', 'c:/aaaa', '..'],
			['c:/aaaa/bbbb', 'c:/cccc', '..\\..\\cccc'],
			['c:/aaaa/bbbb', 'c:/aaaa/bbbb', ''],
			['c:/aaaa/bbbb', 'c:/aaaa/cccc', '..\\cccc'],
			['c:/aaaa/', 'c:/aaaa/cccc', 'cccc'],
			['c:/', 'c:\\aaaa\\bbbb', 'aaaa\\bbbb'],
			['c:/aaaa/bbbb', 'd:\\', 'd:\\'],
			['c:/AaAa/bbbb', 'c:/aaaa/bbbb', ''],
			['c:/aaaaa/', 'c:/aaaa/cccc', '..\\aaaa\\cccc'],
			['C:\\foo\\bar\\baz\\quux', 'C:\\', '..\\..\\..\\..'],
			['C:\\foo\\test', 'C:\\foo\\test\\bar\\package.json', 'bar\\package.json'],
			['C:\\foo\\bar\\baz-quux', 'C:\\foo\\bar\\baz', '..\\baz'],
			['C:\\foo\\bar\\baz', 'C:\\foo\\bar\\baz-quux', '..\\baz-quux'],
			['\\\\foo\\bar', '\\\\foo\\bar\\baz', 'baz'],
			['\\\\foo\\bar\\baz', '\\\\foo\\bar', '..'],
			['\\\\foo\\bar\\baz-quux', '\\\\foo\\bar\\baz', '..\\baz'],
			['\\\\foo\\bar\\baz', '\\\\foo\\bar\\baz-quux', '..\\baz-quux'],
			['C:\\baz-quux', 'C:\\baz', '..\\baz'],
			['C:\\baz', 'C:\\baz-quux', '..\\baz-quux'],
			['\\\\foo\\baz-quux', '\\\\foo\\baz', '..\\baz'],
			['\\\\foo\\baz', '\\\\foo\\baz-quux', '..\\baz-quux'],
			['C:\\baz', '\\\\foo\\bar\\baz', '\\\\foo\\bar\\baz'],
			['\\\\foo\\bar\\baz', 'C:\\baz', 'C:\\baz']
			]
			],
			[path.posix.relative,
			// arguments          result
			[['/var/lib', '/var', '..'],
			['/var/lib', '/bin', '../../bin'],
			['/var/lib', '/var/lib', ''],
			['/var/lib', '/var/apache', '../apache'],
			['/var/', '/var/lib', 'lib'],
			['/', '/var/lib', 'var/lib'],
			['/foo/test', '/foo/test/bar/package.json', 'bar/package.json'],
			['/Users/a/web/b/test/mails', '/Users/a/web/b', '../..'],
			['/foo/bar/baz-quux', '/foo/bar/baz', '../baz'],
			['/foo/bar/baz', '/foo/bar/baz-quux', '../baz-quux'],
			['/baz-quux', '/baz', '../baz'],
			['/baz', '/baz-quux', '../baz-quux']
			]
			]
		];
		relativeTests.forEach((test) => {
			const relative = test[0];
			//@ts-expect-error
			test[1].forEach((test) => {
				//@ts-expect-error
				const actual = relative(test[0], test[1]);
				const expected = test[2];
				const os = relative === path.win32.relative ? 'win32' : 'posix';
				const message = `path.${os}.relative(${test.slice(0, 2).map(JSON.stringify).join(',')})\n  expect=${JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
				if (actual !== expected) {
					failures.push(`\n${message}`);
				}
			});
		});
		assert.strictEqual(failures.length, 0, failures.join(''));
	});

	test('normalize', () => {
		assert.strictEqual(path.win32.normalize('./fixtures///b/../b/c.js'),
			'fixtures\\b\\c.js');
		assert.strictEqual(path.win32.normalize('/foo/../../../bar'), '\\bar');
		assert.strictEqual(path.win32.normalize('a//b//../b'), 'a\\b');
		assert.strictEqual(path.win32.normalize('a//b//./c'), 'a\\b\\c');
		assert.strictEqual(path.win32.normalize('a//b//.'), 'a\\b');
		assert.strictEqual(path.win32.normalize('//server/share/dir/file.ext'),
			'\\\\server\\share\\dir\\file.ext');
		assert.strictEqual(path.win32.normalize('/a/b/c/../../../x/y/z'), '\\x\\y\\z');
		assert.strictEqual(path.win32.normalize('C:'), 'C:.');
		assert.strictEqual(path.win32.normalize('C:..\\abc'), 'C:..\\abc');
		assert.strictEqual(path.win32.normalize('C:..\\..\\abc\\..\\def'),
			'C:..\\..\\def');
		assert.strictEqual(path.win32.normalize('C:\\.'), 'C:\\');
		assert.strictEqual(path.win32.normalize('file:stream'), 'file:stream');
		assert.strictEqual(path.win32.normalize('bar\\foo..\\..\\'), 'bar\\');
		assert.strictEqual(path.win32.normalize('bar\\foo..\\..'), 'bar');
		assert.strictEqual(path.win32.normalize('bar\\foo..\\..\\baz'), 'bar\\baz');
		assert.strictEqual(path.win32.normalize('bar\\foo..\\'), 'bar\\foo..\\');
		assert.strictEqual(path.win32.normalize('bar\\foo..'), 'bar\\foo..');
		assert.strictEqual(path.win32.normalize('..\\foo..\\..\\..\\bar'),
			'..\\..\\bar');
		assert.strictEqual(path.win32.normalize('..\\...\\..\\.\\...\\..\\..\\bar'),
			'..\\..\\bar');
		assert.strictEqual(path.win32.normalize('../../../foo/../../../bar'),
			'..\\..\\..\\..\\..\\bar');
		assert.strictEqual(path.win32.normalize('../../../foo/../../../bar/../../'),
			'..\\..\\..\\..\\..\\..\\');
		assert.strictEqual(
			path.win32.normalize('../foobar/barfoo/foo/../../../bar/../../'),
			'..\\..\\'
		);
		assert.strictEqual(
			path.win32.normalize('../.../../foobar/../../../bar/../../baz'),
			'..\\..\\..\\..\\baz'
		);
		assert.strictEqual(path.win32.normalize('foo/bar\\baz'), 'foo\\bar\\baz');

		assert.strictEqual(path.posix.normalize('./fixtures///b/../b/c.js'),
			'fixtures/b/c.js');
		assert.strictEqual(path.posix.normalize('/foo/../../../bar'), '/bar');
		assert.strictEqual(path.posix.normalize('a//b//../b'), 'a/b');
		assert.strictEqual(path.posix.normalize('a//b//./c'), 'a/b/c');
		assert.strictEqual(path.posix.normalize('a//b//.'), 'a/b');
		assert.strictEqual(path.posix.normalize('/a/b/c/../../../x/y/z'), '/x/y/z');
		assert.strictEqual(path.posix.normalize('///..//./foo/.//bar'), '/foo/bar');
		assert.strictEqual(path.posix.normalize('bar/foo../../'), 'bar/');
		assert.strictEqual(path.posix.normalize('bar/foo../..'), 'bar');
		assert.strictEqual(path.posix.normalize('bar/foo../../baz'), 'bar/baz');
		assert.strictEqual(path.posix.normalize('bar/foo../'), 'bar/foo../');
		assert.strictEqual(path.posix.normalize('bar/foo..'), 'bar/foo..');
		assert.strictEqual(path.posix.normalize('../foo../../../bar'), '../../bar');
		assert.strictEqual(path.posix.normalize('../.../.././.../../../bar'),
			'../../bar');
		assert.strictEqual(path.posix.normalize('../../../foo/../../../bar'),
			'../../../../../bar');
		assert.strictEqual(path.posix.normalize('../../../foo/../../../bar/../../'),
			'../../../../../../');
		assert.strictEqual(
			path.posix.normalize('../foobar/barfoo/foo/../../../bar/../../'),
			'../../'
		);
		assert.strictEqual(
			path.posix.normalize('../.../../foobar/../../../bar/../../baz'),
			'../../../../baz'
		);
		assert.strictEqual(path.posix.normalize('foo/bar\\baz'), 'foo/bar\\baz');
	});

	test('isAbsolute', () => {
		assert.strictEqual(path.win32.isAbsolute('/'), true);
		assert.strictEqual(path.win32.isAbsolute('//'), true);
		assert.strictEqual(path.win32.isAbsolute('//server'), true);
		assert.strictEqual(path.win32.isAbsolute('//server/file'), true);
		assert.strictEqual(path.win32.isAbsolute('\\\\server\\file'), true);
		assert.strictEqual(path.win32.isAbsolute('\\\\server'), true);
		assert.strictEqual(path.win32.isAbsolute('\\\\'), true);
		assert.strictEqual(path.win32.isAbsolute('c'), false);
		assert.strictEqual(path.win32.isAbsolute('c:'), false);
		assert.strictEqual(path.win32.isAbsolute('c:\\'), true);
		assert.strictEqual(path.win32.isAbsolute('c:/'), true);
		assert.strictEqual(path.win32.isAbsolute('c://'), true);
		assert.strictEqual(path.win32.isAbsolute('C:/Users/'), true);
		assert.strictEqual(path.win32.isAbsolute('C:\\Users\\'), true);
		assert.strictEqual(path.win32.isAbsolute('C:cwd/another'), false);
		assert.strictEqual(path.win32.isAbsolute('C:cwd\\another'), false);
		assert.strictEqual(path.win32.isAbsolute('directory/directory'), false);
		assert.strictEqual(path.win32.isAbsolute('directory\\directory'), false);

		assert.strictEqual(path.posix.isAbsolute('/home/foo'), true);
		assert.strictEqual(path.posix.isAbsolute('/home/foo/..'), true);
		assert.strictEqual(path.posix.isAbsolute('bar/'), false);
		assert.strictEqual(path.posix.isAbsolute('./baz'), false);

		// Tests from VSCode:

		// Absolute Paths
		[
			'C:/',
			'C:\\',
			'C:/foo',
			'C:\\foo',
			'z:/foo/bar.txt',
			'z:\\foo\\bar.txt',

			'\\\\localhost\\c$\\foo',

			'/',
			'/foo'
		].forEach(absolutePath => {
			assert.ok(path.win32.isAbsolute(absolutePath), absolutePath);
		});

		[
			'/',
			'/foo',
			'/foo/bar.txt'
		].forEach(absolutePath => {
			assert.ok(path.posix.isAbsolute(absolutePath), absolutePath);
		});

		// Relative Paths
		[
			'',
			'foo',
			'foo/bar',
			'./foo',
			'http://foo.com/bar'
		].forEach(nonAbsolutePath => {
			assert.ok(!path.win32.isAbsolute(nonAbsolutePath), nonAbsolutePath);
		});

		[
			'',
			'foo',
			'foo/bar',
			'./foo',
			'http://foo.com/bar',
			'z:/foo/bar.txt',
		].forEach(nonAbsolutePath => {
			assert.ok(!path.posix.isAbsolute(nonAbsolutePath), nonAbsolutePath);
		});
	});

	test('path', () => {
		// path.sep tests
		// windows
		assert.strictEqual(path.win32.sep, '\\');
		// posix
		assert.strictEqual(path.posix.sep, '/');

		// path.delimiter tests
		// windows
		assert.strictEqual(path.win32.delimiter, ';');
		// posix
		assert.strictEqual(path.posix.delimiter, ':');

		// if (isWindows) {
		// 	assert.strictEqual(path, path.win32);
		// } else {
		// 	assert.strictEqual(path, path.posix);
		// }
	});

	// test('perf', () => {
	// 	const folderNames = [
	// 		'abc',
	// 		'Users',
	// 		'reallylongfoldername',
	// 		's',
	// 		'reallyreallyreallylongfoldername',
	// 		'home'
	// 	];

	// 	const basePaths = [
	// 		'C:',
	// 		'',
	// 	];

	// 	const separators = [
	// 		'\\',
	// 		'/'
	// 	];

	// 	function randomInt(ciel: number): number {
	// 		return Math.floor(Math.random() * ciel);
	// 	}

	// 	let pathsToNormalize = [];
	// 	let pathsToJoin = [];
	// 	let i;
	// 	for (i = 0; i < 1000000; i++) {
	// 		const basePath = basePaths[randomInt(basePaths.length)];
	// 		let lengthOfPath = randomInt(10) + 2;

	// 		let pathToNormalize = basePath + separators[randomInt(separators.length)];
	// 		while (lengthOfPath-- > 0) {
	// 			pathToNormalize = pathToNormalize + folderNames[randomInt(folderNames.length)] + separators[randomInt(separators.length)];
	// 		}

	// 		pathsToNormalize.push(pathToNormalize);

	// 		let pathToJoin = '';
	// 		lengthOfPath = randomInt(10) + 2;
	// 		while (lengthOfPath-- > 0) {
	// 			pathToJoin = pathToJoin + folderNames[randomInt(folderNames.length)] + separators[randomInt(separators.length)];
	// 		}

	// 		pathsToJoin.push(pathToJoin + '.ts');
	// 	}

	// 	let newTime = 0;

	// 	let j;
	// 	for(j = 0; j < pathsToJoin.length; j++) {
	// 		const path1 = pathsToNormalize[j];
	// 		const path2 = pathsToNormalize[j];

	// 		const newStart = performance.now();
	// 		path.join(path1, path2);
	// 		newTime += performance.now() - newStart;
	// 	}

	// 	assert.ok(false, `Time: ${newTime}ms.`);
	// });
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/prefixTree.test.ts]---
Location: vscode-main/src/vs/base/test/common/prefixTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WellDefinedPrefixTree } from '../../common/prefixTree.js';
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('WellDefinedPrefixTree', () => {
	let tree: WellDefinedPrefixTree<number>;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		tree = new WellDefinedPrefixTree<number>();
	});

	test('find', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		assert.strictEqual(tree.find(key1), 42);
		assert.strictEqual(tree.find(key2), 43);
		assert.strictEqual(tree.find(['foo', 'baz', 'bop']), undefined);
		assert.strictEqual(tree.find(['foo']), undefined);
	});

	test('hasParentOfKey', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKeyOrParent(['foo', 'bar', 'baz']), true);
		assert.strictEqual(tree.hasKeyOrParent(['foo', 'bar']), true);
		assert.strictEqual(tree.hasKeyOrParent(['foo']), false);
		assert.strictEqual(tree.hasKeyOrParent(['baz']), false);
	});


	test('hasKeyOrChildren', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKeyOrChildren([]), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo']), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo', 'bar']), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo', 'bar', 'baz']), false);
	});

	test('hasKey', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKey(key), true);
		assert.strictEqual(tree.hasKey(['foo']), false);
		assert.strictEqual(tree.hasKey(['baz']), false);
		assert.strictEqual(tree.hasKey(['foo', 'bar', 'baz']), false);
	});

	test('size', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		assert.strictEqual(tree.size, 0);
		tree.insert(key1, 42);
		assert.strictEqual(tree.size, 1);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);
		tree.insert(key2, 44);
		assert.strictEqual(tree.size, 2);
	});

	test('mutate', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		tree.mutate(key1, (value) => {
			assert.strictEqual(value, 42);
			return 44;
		});
		assert.strictEqual(tree.find(key1), 44);
		assert.strictEqual(tree.find(key2), 43);
	});

	test('delete', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);

		assert.strictEqual(tree.delete(key1), 42);
		assert.strictEqual(tree.size, 1);
		assert.strictEqual(tree.find(key1), undefined);
		assert.strictEqual(tree.find(key2), 43);

		assert.strictEqual(tree.delete(key2), 43);
		assert.strictEqual(tree.size, 0);
		assert.strictEqual(tree.find(key1), undefined);
		assert.strictEqual(tree.find(key2), undefined);

		tree.delete(key2);
		assert.strictEqual(tree.size, 0);
	});

	test('delete child', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);

		assert.strictEqual(tree.delete(key2), 43);
		assert.strictEqual(tree.size, 1);
		assert.strictEqual(tree.find(key1), 42);
		assert.strictEqual(tree.find(key2), undefined);
	});

	test('delete noops if deleting parent', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 1);

		assert.strictEqual(tree.delete(key1), undefined);
		assert.strictEqual(tree.size, 1);
		assert.strictEqual(tree.find(key2), 43);
		assert.strictEqual(tree.find(key1), undefined);
	});

	test('values', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);

		assert.deepStrictEqual([...tree.values()], [43, 42]);
	});


	test('delete recursive', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		const key3 = ['foo', 'bar', 'baz2', 'baz3'];
		const key4 = ['foo', 'bar2'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		tree.insert(key3, 44);
		tree.insert(key4, 45);
		assert.strictEqual(tree.size, 4);

		assert.deepStrictEqual([...tree.deleteRecursive(key1)], [42, 44, 43]);
		assert.strictEqual(tree.size, 1);

		assert.deepStrictEqual([...tree.deleteRecursive(key1)], []);
		assert.strictEqual(tree.size, 1);

		assert.deepStrictEqual([...tree.deleteRecursive(key4)], [45]);
		assert.strictEqual(tree.size, 0);
	});

	test('insert and delete root', () => {
		assert.strictEqual(tree.size, 0);
		tree.insert([], 1234);
		assert.strictEqual(tree.size, 1);
		assert.strictEqual(tree.find([]), 1234);
		assert.strictEqual(tree.delete([]), 1234);
		assert.strictEqual(tree.size, 0);

		assert.strictEqual(tree.find([]), undefined);
		assert.strictEqual(tree.delete([]), undefined);
		assert.strictEqual(tree.size, 0);
	});

	test('insert and deleteRecursive root', () => {
		assert.strictEqual(tree.size, 0);
		tree.insert([], 1234);
		tree.insert(['a'], 4567);
		assert.strictEqual(tree.size, 2);
		assert.strictEqual(tree.find([]), 1234);
		assert.deepStrictEqual([...tree.deleteRecursive([])], [1234, 4567]);
		assert.strictEqual(tree.size, 0);

		assert.strictEqual(tree.find([]), undefined);
		assert.deepStrictEqual([...tree.deleteRecursive([])], []);
		assert.strictEqual(tree.size, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/processes.test.ts]---
Location: vscode-main/src/vs/base/test/common/processes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as processes from '../../common/processes.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Processes', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('sanitizeProcessEnvironment', () => {
		const env = {
			FOO: 'bar',
			ELECTRON_ENABLE_STACK_DUMPING: 'x',
			ELECTRON_ENABLE_LOGGING: 'x',
			ELECTRON_NO_ASAR: 'x',
			ELECTRON_NO_ATTACH_CONSOLE: 'x',
			ELECTRON_RUN_AS_NODE: 'x',
			VSCODE_CLI: 'x',
			VSCODE_DEV: 'x',
			VSCODE_IPC_HOOK: 'x',
			VSCODE_NLS_CONFIG: 'x',
			VSCODE_PORTABLE: '3',
			VSCODE_PID: 'x',
			VSCODE_SHELL_LOGIN: '1',
			VSCODE_CODE_CACHE_PATH: 'x',
			VSCODE_NEW_VAR: 'x',
			GDK_PIXBUF_MODULE_FILE: 'x',
			GDK_PIXBUF_MODULEDIR: 'x',
			VSCODE_PYTHON_BASH_ACTIVATE: 'source /path/to/venv/bin/activate',
			VSCODE_PYTHON_ZSH_ACTIVATE: 'source /path/to/venv/bin/activate',
			VSCODE_PYTHON_PWSH_ACTIVATE: '. /path/to/venv/Scripts/Activate.ps1',
			VSCODE_PYTHON_FISH_ACTIVATE: 'source /path/to/venv/bin/activate.fish',
			VSCODE_PYTHON_AUTOACTIVATE_GUARD: '1'
		};
		processes.sanitizeProcessEnvironment(env);
		assert.strictEqual(env['FOO'], 'bar');
		assert.strictEqual(env['VSCODE_SHELL_LOGIN'], '1');
		assert.strictEqual(env['VSCODE_PORTABLE'], '3');
		assert.strictEqual(env['VSCODE_PYTHON_BASH_ACTIVATE'], undefined);
		assert.strictEqual(env['VSCODE_PYTHON_ZSH_ACTIVATE'], undefined);
		assert.strictEqual(env['VSCODE_PYTHON_PWSH_ACTIVATE'], undefined);
		assert.strictEqual(env['VSCODE_PYTHON_FISH_ACTIVATE'], undefined);
		assert.strictEqual(env['VSCODE_PYTHON_AUTOACTIVATE_GUARD'], undefined);
		assert.strictEqual(Object.keys(env).length, 3);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/resources.test.ts]---
Location: vscode-main/src/vs/base/test/common/resources.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { toSlashes } from '../../common/extpath.js';
import { posix, win32 } from '../../common/path.js';
import { isWindows } from '../../common/platform.js';
import { addTrailingPathSeparator, basename, dirname, distinctParents, extUri, extUriIgnorePathCase, hasTrailingPathSeparator, isAbsolutePath, joinPath, normalizePath, relativePath, removeTrailingPathSeparator, resolvePath } from '../../common/resources.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';


suite('Resources', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('distinctParents', () => {

		// Basic
		let resources = [
			URI.file('/some/folderA/file.txt'),
			URI.file('/some/folderB/file.txt'),
			URI.file('/some/folderC/file.txt')
		];

		let distinct = distinctParents(resources, r => r);
		assert.strictEqual(distinct.length, 3);
		assert.strictEqual(distinct[0].toString(), resources[0].toString());
		assert.strictEqual(distinct[1].toString(), resources[1].toString());
		assert.strictEqual(distinct[2].toString(), resources[2].toString());

		// Parent / Child
		resources = [
			URI.file('/some/folderA'),
			URI.file('/some/folderA/file.txt'),
			URI.file('/some/folderA/child/file.txt'),
			URI.file('/some/folderA2/file.txt'),
			URI.file('/some/file.txt')
		];

		distinct = distinctParents(resources, r => r);
		assert.strictEqual(distinct.length, 3);
		assert.strictEqual(distinct[0].toString(), resources[0].toString());
		assert.strictEqual(distinct[1].toString(), resources[3].toString());
		assert.strictEqual(distinct[2].toString(), resources[4].toString());
	});

	test('dirname', () => {
		if (isWindows) {
			assert.strictEqual(dirname(URI.file('c:\\some\\file\\test.txt')).toString(), 'file:///c%3A/some/file');
			assert.strictEqual(dirname(URI.file('c:\\some\\file')).toString(), 'file:///c%3A/some');
			assert.strictEqual(dirname(URI.file('c:\\some\\file\\')).toString(), 'file:///c%3A/some');
			assert.strictEqual(dirname(URI.file('c:\\some')).toString(), 'file:///c%3A/');
			assert.strictEqual(dirname(URI.file('C:\\some')).toString(), 'file:///c%3A/');
			assert.strictEqual(dirname(URI.file('c:\\')).toString(), 'file:///c%3A/');
		} else {
			assert.strictEqual(dirname(URI.file('/some/file/test.txt')).toString(), 'file:///some/file');
			assert.strictEqual(dirname(URI.file('/some/file/')).toString(), 'file:///some');
			assert.strictEqual(dirname(URI.file('/some/file')).toString(), 'file:///some');
		}
		assert.strictEqual(dirname(URI.parse('foo://a/some/file/test.txt')).toString(), 'foo://a/some/file');
		assert.strictEqual(dirname(URI.parse('foo://a/some/file/')).toString(), 'foo://a/some');
		assert.strictEqual(dirname(URI.parse('foo://a/some/file')).toString(), 'foo://a/some');
		assert.strictEqual(dirname(URI.parse('foo://a/some')).toString(), 'foo://a/');
		assert.strictEqual(dirname(URI.parse('foo://a/')).toString(), 'foo://a/');
		assert.strictEqual(dirname(URI.parse('foo://a')).toString(), 'foo://a');

		// does not explode (https://github.com/microsoft/vscode/issues/41987)
		dirname(URI.from({ scheme: 'file', authority: '/users/someone/portal.h' }));

		assert.strictEqual(dirname(URI.parse('foo://a/b/c?q')).toString(), 'foo://a/b?q');
	});

	test('basename', () => {
		if (isWindows) {
			assert.strictEqual(basename(URI.file('c:\\some\\file\\test.txt')), 'test.txt');
			assert.strictEqual(basename(URI.file('c:\\some\\file')), 'file');
			assert.strictEqual(basename(URI.file('c:\\some\\file\\')), 'file');
			assert.strictEqual(basename(URI.file('C:\\some\\file\\')), 'file');
		} else {
			assert.strictEqual(basename(URI.file('/some/file/test.txt')), 'test.txt');
			assert.strictEqual(basename(URI.file('/some/file/')), 'file');
			assert.strictEqual(basename(URI.file('/some/file')), 'file');
			assert.strictEqual(basename(URI.file('/some')), 'some');
		}
		assert.strictEqual(basename(URI.parse('foo://a/some/file/test.txt')), 'test.txt');
		assert.strictEqual(basename(URI.parse('foo://a/some/file/')), 'file');
		assert.strictEqual(basename(URI.parse('foo://a/some/file')), 'file');
		assert.strictEqual(basename(URI.parse('foo://a/some')), 'some');
		assert.strictEqual(basename(URI.parse('foo://a/')), '');
		assert.strictEqual(basename(URI.parse('foo://a')), '');
	});

	test('joinPath', () => {
		if (isWindows) {
			assert.strictEqual(joinPath(URI.file('c:\\foo\\bar'), '/file.js').toString(), 'file:///c%3A/foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\foo\\bar\\'), 'file.js').toString(), 'file:///c%3A/foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\foo\\bar\\'), '/file.js').toString(), 'file:///c%3A/foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\'), '/file.js').toString(), 'file:///c%3A/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\'), 'bar/file.js').toString(), 'file:///c%3A/bar/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\foo'), './file.js').toString(), 'file:///c%3A/foo/file.js');
			assert.strictEqual(joinPath(URI.file('c:\\foo'), '/./file.js').toString(), 'file:///c%3A/foo/file.js');
			assert.strictEqual(joinPath(URI.file('C:\\foo'), '../file.js').toString(), 'file:///c%3A/file.js');
			assert.strictEqual(joinPath(URI.file('C:\\foo\\.'), '../file.js').toString(), 'file:///c%3A/file.js');
		} else {
			assert.strictEqual(joinPath(URI.file('/foo/bar'), '/file.js').toString(), 'file:///foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('/foo/bar'), 'file.js').toString(), 'file:///foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('/foo/bar/'), '/file.js').toString(), 'file:///foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('/'), '/file.js').toString(), 'file:///file.js');
			assert.strictEqual(joinPath(URI.file('/foo/bar'), './file.js').toString(), 'file:///foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('/foo/bar'), '/./file.js').toString(), 'file:///foo/bar/file.js');
			assert.strictEqual(joinPath(URI.file('/foo/bar'), '../file.js').toString(), 'file:///foo/file.js');
		}
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar')).toString(), 'foo://a/foo/bar');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar'), '/file.js').toString(), 'foo://a/foo/bar/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar'), 'file.js').toString(), 'foo://a/foo/bar/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar/'), '/file.js').toString(), 'foo://a/foo/bar/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/'), '/file.js').toString(), 'foo://a/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar/'), './file.js').toString(), 'foo://a/foo/bar/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar/'), '/./file.js').toString(), 'foo://a/foo/bar/file.js');
		assert.strictEqual(joinPath(URI.parse('foo://a/foo/bar/'), '../file.js').toString(), 'foo://a/foo/file.js');

		assert.strictEqual(
			joinPath(URI.from({ scheme: 'myScheme', authority: 'authority', path: '/path', query: 'query', fragment: 'fragment' }), '/file.js').toString(),
			'myScheme://authority/path/file.js?query#fragment');
	});

	test('normalizePath', () => {
		if (isWindows) {
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\.\\bar')).toString(), 'file:///c%3A/foo/bar');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\.')).toString(), 'file:///c%3A/foo');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\.\\')).toString(), 'file:///c%3A/foo/');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\..')).toString(), 'file:///c%3A/');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\..\\bar')).toString(), 'file:///c%3A/bar');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\..\\..\\bar')).toString(), 'file:///c%3A/bar');
			assert.strictEqual(normalizePath(URI.file('c:\\foo\\foo\\..\\..\\bar')).toString(), 'file:///c%3A/bar');
			assert.strictEqual(normalizePath(URI.file('C:\\foo\\foo\\.\\..\\..\\bar')).toString(), 'file:///c%3A/bar');
			assert.strictEqual(normalizePath(URI.file('C:\\foo\\foo\\.\\..\\some\\..\\bar')).toString(), 'file:///c%3A/foo/bar');
		} else {
			assert.strictEqual(normalizePath(URI.file('/foo/./bar')).toString(), 'file:///foo/bar');
			assert.strictEqual(normalizePath(URI.file('/foo/.')).toString(), 'file:///foo');
			assert.strictEqual(normalizePath(URI.file('/foo/./')).toString(), 'file:///foo/');
			assert.strictEqual(normalizePath(URI.file('/foo/..')).toString(), 'file:///');
			assert.strictEqual(normalizePath(URI.file('/foo/../bar')).toString(), 'file:///bar');
			assert.strictEqual(normalizePath(URI.file('/foo/../../bar')).toString(), 'file:///bar');
			assert.strictEqual(normalizePath(URI.file('/foo/foo/../../bar')).toString(), 'file:///bar');
			assert.strictEqual(normalizePath(URI.file('/foo/foo/./../../bar')).toString(), 'file:///bar');
			assert.strictEqual(normalizePath(URI.file('/foo/foo/./../some/../bar')).toString(), 'file:///foo/bar');
			assert.strictEqual(normalizePath(URI.file('/f')).toString(), 'file:///f');
		}
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/./bar')).toString(), 'foo://a/foo/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/.')).toString(), 'foo://a/foo');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/./')).toString(), 'foo://a/foo/');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/..')).toString(), 'foo://a/');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/../bar')).toString(), 'foo://a/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/../../bar')).toString(), 'foo://a/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/foo/../../bar')).toString(), 'foo://a/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/foo/./../../bar')).toString(), 'foo://a/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/foo/./../some/../bar')).toString(), 'foo://a/foo/bar');
		assert.strictEqual(normalizePath(URI.parse('foo://a')).toString(), 'foo://a');
		assert.strictEqual(normalizePath(URI.parse('foo://a/')).toString(), 'foo://a/');
		assert.strictEqual(normalizePath(URI.parse('foo://a/foo/./bar?q=1')).toString(), URI.parse('foo://a/foo/bar?q%3D1').toString());
	});

	test('isAbsolute', () => {
		if (isWindows) {
			assert.strictEqual(isAbsolutePath(URI.file('c:\\foo\\')), true);
			assert.strictEqual(isAbsolutePath(URI.file('C:\\foo\\')), true);
			assert.strictEqual(isAbsolutePath(URI.file('bar')), true); // URI normalizes all file URIs to be absolute
		} else {
			assert.strictEqual(isAbsolutePath(URI.file('/foo/bar')), true);
			assert.strictEqual(isAbsolutePath(URI.file('bar')), true); // URI normalizes all file URIs to be absolute
		}
		assert.strictEqual(isAbsolutePath(URI.parse('foo:foo')), false);
		assert.strictEqual(isAbsolutePath(URI.parse('foo://a/foo/.')), true);
	});

	function assertTrailingSeparator(u1: URI, expected: boolean) {
		assert.strictEqual(hasTrailingPathSeparator(u1), expected, u1.toString());
	}

	function assertRemoveTrailingSeparator(u1: URI, expected: URI) {
		assertEqualURI(removeTrailingPathSeparator(u1), expected, u1.toString());
	}

	function assertAddTrailingSeparator(u1: URI, expected: URI) {
		assertEqualURI(addTrailingPathSeparator(u1), expected, u1.toString());
	}

	test('trailingPathSeparator', () => {
		assertTrailingSeparator(URI.parse('foo://a/foo'), false);
		assertTrailingSeparator(URI.parse('foo://a/foo/'), true);
		assertTrailingSeparator(URI.parse('foo://a/'), false);
		assertTrailingSeparator(URI.parse('foo://a'), false);

		assertRemoveTrailingSeparator(URI.parse('foo://a/foo'), URI.parse('foo://a/foo'));
		assertRemoveTrailingSeparator(URI.parse('foo://a/foo/'), URI.parse('foo://a/foo'));
		assertRemoveTrailingSeparator(URI.parse('foo://a/'), URI.parse('foo://a/'));
		assertRemoveTrailingSeparator(URI.parse('foo://a'), URI.parse('foo://a'));

		assertAddTrailingSeparator(URI.parse('foo://a/foo'), URI.parse('foo://a/foo/'));
		assertAddTrailingSeparator(URI.parse('foo://a/foo/'), URI.parse('foo://a/foo/'));
		assertAddTrailingSeparator(URI.parse('foo://a/'), URI.parse('foo://a/'));
		assertAddTrailingSeparator(URI.parse('foo://a'), URI.parse('foo://a/'));

		if (isWindows) {
			assertTrailingSeparator(URI.file('c:\\a\\foo'), false);
			assertTrailingSeparator(URI.file('c:\\a\\foo\\'), true);
			assertTrailingSeparator(URI.file('c:\\'), false);
			assertTrailingSeparator(URI.file('\\\\server\\share\\some\\'), true);
			assertTrailingSeparator(URI.file('\\\\server\\share\\'), false);

			assertRemoveTrailingSeparator(URI.file('c:\\a\\foo'), URI.file('c:\\a\\foo'));
			assertRemoveTrailingSeparator(URI.file('c:\\a\\foo\\'), URI.file('c:\\a\\foo'));
			assertRemoveTrailingSeparator(URI.file('c:\\'), URI.file('c:\\'));
			assertRemoveTrailingSeparator(URI.file('\\\\server\\share\\some\\'), URI.file('\\\\server\\share\\some'));
			assertRemoveTrailingSeparator(URI.file('\\\\server\\share\\'), URI.file('\\\\server\\share\\'));

			assertAddTrailingSeparator(URI.file('c:\\a\\foo'), URI.file('c:\\a\\foo\\'));
			assertAddTrailingSeparator(URI.file('c:\\a\\foo\\'), URI.file('c:\\a\\foo\\'));
			assertAddTrailingSeparator(URI.file('c:\\'), URI.file('c:\\'));
			assertAddTrailingSeparator(URI.file('\\\\server\\share\\some'), URI.file('\\\\server\\share\\some\\'));
			assertAddTrailingSeparator(URI.file('\\\\server\\share\\some\\'), URI.file('\\\\server\\share\\some\\'));
		} else {
			assertTrailingSeparator(URI.file('/foo/bar'), false);
			assertTrailingSeparator(URI.file('/foo/bar/'), true);
			assertTrailingSeparator(URI.file('/'), false);

			assertRemoveTrailingSeparator(URI.file('/foo/bar'), URI.file('/foo/bar'));
			assertRemoveTrailingSeparator(URI.file('/foo/bar/'), URI.file('/foo/bar'));
			assertRemoveTrailingSeparator(URI.file('/'), URI.file('/'));

			assertAddTrailingSeparator(URI.file('/foo/bar'), URI.file('/foo/bar/'));
			assertAddTrailingSeparator(URI.file('/foo/bar/'), URI.file('/foo/bar/'));
			assertAddTrailingSeparator(URI.file('/'), URI.file('/'));
		}
	});

	function assertEqualURI(actual: URI, expected: URI, message?: string, ignoreCase?: boolean) {
		const util = ignoreCase ? extUriIgnorePathCase : extUri;
		if (!util.isEqual(expected, actual)) {
			assert.strictEqual(actual.toString(), expected.toString(), message);
		}
	}

	function assertRelativePath(u1: URI, u2: URI, expectedPath: string | undefined, ignoreJoin?: boolean, ignoreCase?: boolean) {
		const util = ignoreCase ? extUriIgnorePathCase : extUri;

		assert.strictEqual(util.relativePath(u1, u2), expectedPath, `from ${u1.toString()} to ${u2.toString()}`);
		if (expectedPath !== undefined && !ignoreJoin) {
			assertEqualURI(removeTrailingPathSeparator(joinPath(u1, expectedPath)), removeTrailingPathSeparator(u2), 'joinPath on relativePath should be equal', ignoreCase);
		}
	}

	test('relativePath', () => {
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://a/foo/bar'), 'bar');
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://a/foo/bar/'), 'bar');
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://a/foo/bar/goo'), 'bar/goo');
		assertRelativePath(URI.parse('foo://a/'), URI.parse('foo://a/foo/bar/goo'), 'foo/bar/goo');
		assertRelativePath(URI.parse('foo://a/foo/xoo'), URI.parse('foo://a/foo/bar'), '../bar');
		assertRelativePath(URI.parse('foo://a/foo/xoo/yoo'), URI.parse('foo://a'), '../../..', true);
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://a/foo/'), '');
		assertRelativePath(URI.parse('foo://a/foo/'), URI.parse('foo://a/foo'), '');
		assertRelativePath(URI.parse('foo://a/foo/'), URI.parse('foo://a/foo/'), '');
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://a/foo'), '');
		assertRelativePath(URI.parse('foo://a'), URI.parse('foo://a'), '', true);
		assertRelativePath(URI.parse('foo://a/'), URI.parse('foo://a/'), '');
		assertRelativePath(URI.parse('foo://a/'), URI.parse('foo://a'), '', true);
		assertRelativePath(URI.parse('foo://a/foo?q'), URI.parse('foo://a/foo/bar#h'), 'bar', true);
		assertRelativePath(URI.parse('foo://'), URI.parse('foo://a/b'), undefined);
		assertRelativePath(URI.parse('foo://a2/b'), URI.parse('foo://a/b'), undefined);
		assertRelativePath(URI.parse('goo://a/b'), URI.parse('foo://a/b'), undefined);

		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://A/FOO/bar/goo'), 'bar/goo', false, true);
		assertRelativePath(URI.parse('foo://a/foo'), URI.parse('foo://A/FOO/BAR/GOO'), 'BAR/GOO', false, true);
		assertRelativePath(URI.parse('foo://a/foo/xoo'), URI.parse('foo://A/FOO/BAR/GOO'), '../BAR/GOO', false, true);
		assertRelativePath(URI.parse('foo:///c:/a/foo'), URI.parse('foo:///C:/a/foo/xoo/'), 'xoo', false, true);

		if (isWindows) {
			assertRelativePath(URI.file('c:\\foo\\bar'), URI.file('c:\\foo\\bar'), '');
			assertRelativePath(URI.file('c:\\foo\\bar\\huu'), URI.file('c:\\foo\\bar'), '..');
			assertRelativePath(URI.file('c:\\foo\\bar\\a1\\a2'), URI.file('c:\\foo\\bar'), '../..');
			assertRelativePath(URI.file('c:\\foo\\bar\\'), URI.file('c:\\foo\\bar\\a1\\a2'), 'a1/a2');
			assertRelativePath(URI.file('c:\\foo\\bar\\'), URI.file('c:\\foo\\bar\\a1\\a2\\'), 'a1/a2');
			assertRelativePath(URI.file('c:\\'), URI.file('c:\\foo\\bar'), 'foo/bar');
			assertRelativePath(URI.file('\\\\server\\share\\some\\'), URI.file('\\\\server\\share\\some\\path'), 'path');
			assertRelativePath(URI.file('\\\\server\\share\\some\\'), URI.file('\\\\server\\share2\\some\\path'), '../../share2/some/path', true); // ignore joinPath assert: path.join is not root aware
		} else {
			assertRelativePath(URI.file('/a/foo'), URI.file('/a/foo/bar'), 'bar');
			assertRelativePath(URI.file('/a/foo'), URI.file('/a/foo/bar/'), 'bar');
			assertRelativePath(URI.file('/a/foo'), URI.file('/a/foo/bar/goo'), 'bar/goo');
			assertRelativePath(URI.file('/a/'), URI.file('/a/foo/bar/goo'), 'foo/bar/goo');
			assertRelativePath(URI.file('/'), URI.file('/a/foo/bar/goo'), 'a/foo/bar/goo');
			assertRelativePath(URI.file('/a/foo/xoo'), URI.file('/a/foo/bar'), '../bar');
			assertRelativePath(URI.file('/a/foo/xoo/yoo'), URI.file('/a'), '../../..');
			assertRelativePath(URI.file('/a/foo'), URI.file('/a/foo/'), '');
			assertRelativePath(URI.file('/a/foo'), URI.file('/b/foo/'), '../../b/foo');
		}
	});

	function assertResolve(u1: URI, path: string, expected: URI) {
		const actual = resolvePath(u1, path);
		assertEqualURI(actual, expected, `from ${u1.toString()} and ${path}`);

		const p = path.indexOf('/') !== -1 ? posix : win32;
		if (!p.isAbsolute(path)) {
			let expectedPath = isWindows ? toSlashes(path) : path;
			expectedPath = expectedPath.startsWith('./') ? expectedPath.substr(2) : expectedPath;
			assert.strictEqual(relativePath(u1, actual), expectedPath, `relativePath (${u1.toString()}) on actual (${actual.toString()}) should be to path (${expectedPath})`);
		}
	}

	test('resolve', () => {
		if (isWindows) {
			assertResolve(URI.file('c:\\foo\\bar'), 'file.js', URI.file('c:\\foo\\bar\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), 't\\file.js', URI.file('c:\\foo\\bar\\t\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), '.\\t\\file.js', URI.file('c:\\foo\\bar\\t\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), 'a1/file.js', URI.file('c:\\foo\\bar\\a1\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), './a1/file.js', URI.file('c:\\foo\\bar\\a1\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), '\\b1\\file.js', URI.file('c:\\b1\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar'), '/b1/file.js', URI.file('c:\\b1\\file.js'));
			assertResolve(URI.file('c:\\foo\\bar\\'), 'file.js', URI.file('c:\\foo\\bar\\file.js'));

			assertResolve(URI.file('c:\\'), 'file.js', URI.file('c:\\file.js'));
			assertResolve(URI.file('c:\\'), '\\b1\\file.js', URI.file('c:\\b1\\file.js'));
			assertResolve(URI.file('c:\\'), '/b1/file.js', URI.file('c:\\b1\\file.js'));
			assertResolve(URI.file('c:\\'), 'd:\\foo\\bar.txt', URI.file('d:\\foo\\bar.txt'));

			assertResolve(URI.file('\\\\server\\share\\some\\'), 'b1\\file.js', URI.file('\\\\server\\share\\some\\b1\\file.js'));
			assertResolve(URI.file('\\\\server\\share\\some\\'), '\\file.js', URI.file('\\\\server\\share\\file.js'));

			assertResolve(URI.file('c:\\'), '\\\\server\\share\\some\\', URI.file('\\\\server\\share\\some'));
			assertResolve(URI.file('\\\\server\\share\\some\\'), 'c:\\', URI.file('c:\\'));
		} else {
			assertResolve(URI.file('/foo/bar'), 'file.js', URI.file('/foo/bar/file.js'));
			assertResolve(URI.file('/foo/bar'), './file.js', URI.file('/foo/bar/file.js'));
			assertResolve(URI.file('/foo/bar'), '/file.js', URI.file('/file.js'));
			assertResolve(URI.file('/foo/bar/'), 'file.js', URI.file('/foo/bar/file.js'));
			assertResolve(URI.file('/'), 'file.js', URI.file('/file.js'));
			assertResolve(URI.file(''), './file.js', URI.file('/file.js'));
			assertResolve(URI.file(''), '/file.js', URI.file('/file.js'));
		}

		assertResolve(URI.parse('foo://server/foo/bar'), 'file.js', URI.parse('foo://server/foo/bar/file.js'));
		assertResolve(URI.parse('foo://server/foo/bar'), './file.js', URI.parse('foo://server/foo/bar/file.js'));
		assertResolve(URI.parse('foo://server/foo/bar'), './file.js', URI.parse('foo://server/foo/bar/file.js'));
		assertResolve(URI.parse('foo://server/foo/bar'), 'c:\\a1\\b1', URI.parse('foo://server/c:/a1/b1'));
		assertResolve(URI.parse('foo://server/foo/bar'), 'c:\\', URI.parse('foo://server/c:'));


	});

	function assertIsEqual(u1: URI, u2: URI, ignoreCase: boolean | undefined, expected: boolean) {

		const util = ignoreCase ? extUriIgnorePathCase : extUri;

		assert.strictEqual(util.isEqual(u1, u2), expected, `${u1.toString()}${expected ? '===' : '!=='}${u2.toString()}`);
		assert.strictEqual(util.compare(u1, u2) === 0, expected);
		assert.strictEqual(util.getComparisonKey(u1) === util.getComparisonKey(u2), expected, `comparison keys ${u1.toString()}, ${u2.toString()}`);
		assert.strictEqual(util.isEqualOrParent(u1, u2), expected, `isEqualOrParent ${u1.toString()}, ${u2.toString()}`);
		if (!ignoreCase) {
			assert.strictEqual(u1.toString() === u2.toString(), expected);
		}
	}


	test('isEqual', () => {
		const fileURI = isWindows ? URI.file('c:\\foo\\bar') : URI.file('/foo/bar');
		const fileURI2 = isWindows ? URI.file('C:\\foo\\Bar') : URI.file('/foo/Bar');
		assertIsEqual(fileURI, fileURI, true, true);
		assertIsEqual(fileURI, fileURI, false, true);
		assertIsEqual(fileURI, fileURI, undefined, true);
		assertIsEqual(fileURI, fileURI2, true, true);
		assertIsEqual(fileURI, fileURI2, false, false);

		const fileURI3 = URI.parse('foo://server:453/foo/bar');
		const fileURI4 = URI.parse('foo://server:453/foo/Bar');
		assertIsEqual(fileURI3, fileURI3, true, true);
		assertIsEqual(fileURI3, fileURI3, false, true);
		assertIsEqual(fileURI3, fileURI3, undefined, true);
		assertIsEqual(fileURI3, fileURI4, true, true);
		assertIsEqual(fileURI3, fileURI4, false, false);

		assertIsEqual(fileURI, fileURI3, true, false);

		assertIsEqual(URI.parse('file://server'), URI.parse('file://server/'), true, true);
		assertIsEqual(URI.parse('http://server'), URI.parse('http://server/'), true, true);
		assertIsEqual(URI.parse('foo://server'), URI.parse('foo://server/'), true, false); // only selected scheme have / as the default path
		assertIsEqual(URI.parse('foo://server/foo'), URI.parse('foo://server/foo/'), true, false);
		assertIsEqual(URI.parse('foo://server/foo'), URI.parse('foo://server/foo?'), true, true);

		const fileURI5 = URI.parse('foo://server:453/foo/bar?q=1');
		const fileURI6 = URI.parse('foo://server:453/foo/bar#xy');

		assertIsEqual(fileURI5, fileURI5, true, true);
		assertIsEqual(fileURI5, fileURI3, true, false);
		assertIsEqual(fileURI6, fileURI6, true, true);
		assertIsEqual(fileURI6, fileURI5, true, false);
		assertIsEqual(fileURI6, fileURI3, true, false);
	});

	test('isEqualOrParent', () => {

		const fileURI = isWindows ? URI.file('c:\\foo\\bar') : URI.file('/foo/bar');
		const fileURI2 = isWindows ? URI.file('c:\\foo') : URI.file('/foo');
		const fileURI2b = isWindows ? URI.file('C:\\Foo\\') : URI.file('/Foo/');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI, fileURI), true, '1');
		assert.strictEqual(extUri.isEqualOrParent(fileURI, fileURI), true, '2');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI, fileURI2), true, '3');
		assert.strictEqual(extUri.isEqualOrParent(fileURI, fileURI2), true, '4');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI, fileURI2b), true, '5');
		assert.strictEqual(extUri.isEqualOrParent(fileURI, fileURI2b), false, '6');

		assert.strictEqual(extUri.isEqualOrParent(fileURI2, fileURI), false, '7');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI2b, fileURI2), true, '8');

		const fileURI3 = URI.parse('foo://server:453/foo/bar/goo');
		const fileURI4 = URI.parse('foo://server:453/foo/');
		const fileURI5 = URI.parse('foo://server:453/foo');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI3, fileURI3, true), true, '11');
		assert.strictEqual(extUri.isEqualOrParent(fileURI3, fileURI3), true, '12');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI3, fileURI4, true), true, '13');
		assert.strictEqual(extUri.isEqualOrParent(fileURI3, fileURI4), true, '14');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI3, fileURI, true), false, '15');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI5, fileURI5, true), true, '16');

		const fileURI6 = URI.parse('foo://server:453/foo?q=1');
		const fileURI7 = URI.parse('foo://server:453/foo/bar?q=1');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI6, fileURI5), false, '17');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI6, fileURI6), true, '18');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI7, fileURI6), true, '19');
		assert.strictEqual(extUriIgnorePathCase.isEqualOrParent(fileURI7, fileURI5), false, '20');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/resourceTree.test.ts]---
Location: vscode-main/src/vs/base/test/common/resourceTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ResourceTree } from '../../common/resourceTree.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('ResourceTree', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('ctor', function () {
		const tree = new ResourceTree<string, null>(null);
		assert.strictEqual(tree.root.childrenCount, 0);
	});

	test('simple', function () {
		const tree = new ResourceTree<string, null>(null);

		tree.add(URI.file('/foo/bar.txt'), 'bar contents');
		assert.strictEqual(tree.root.childrenCount, 1);

		const foo = tree.root.get('foo')!;
		assert(foo);
		assert.strictEqual(foo.childrenCount, 1);

		const bar = foo.get('bar.txt')!;
		assert(bar);
		assert.strictEqual(bar.element, 'bar contents');

		tree.add(URI.file('/hello.txt'), 'hello contents');
		assert.strictEqual(tree.root.childrenCount, 2);

		let hello = tree.root.get('hello.txt')!;
		assert(hello);
		assert.strictEqual(hello.element, 'hello contents');

		tree.delete(URI.file('/foo/bar.txt'));
		assert.strictEqual(tree.root.childrenCount, 1);
		hello = tree.root.get('hello.txt')!;
		assert(hello);
		assert.strictEqual(hello.element, 'hello contents');
	});

	test('folders with data', function () {
		const tree = new ResourceTree<string, null>(null);

		assert.strictEqual(tree.root.childrenCount, 0);

		tree.add(URI.file('/foo'), 'foo');
		assert.strictEqual(tree.root.childrenCount, 1);
		assert.strictEqual(tree.root.get('foo')!.element, 'foo');

		tree.add(URI.file('/bar'), 'bar');
		assert.strictEqual(tree.root.childrenCount, 2);
		assert.strictEqual(tree.root.get('bar')!.element, 'bar');

		tree.add(URI.file('/foo/file.txt'), 'file');
		assert.strictEqual(tree.root.childrenCount, 2);
		assert.strictEqual(tree.root.get('foo')!.element, 'foo');
		assert.strictEqual(tree.root.get('bar')!.element, 'bar');
		assert.strictEqual(tree.root.get('foo')!.get('file.txt')!.element, 'file');

		tree.delete(URI.file('/foo'));
		assert.strictEqual(tree.root.childrenCount, 1);
		assert(!tree.root.get('foo'));
		assert.strictEqual(tree.root.get('bar')!.element, 'bar');

		tree.delete(URI.file('/bar'));
		assert.strictEqual(tree.root.childrenCount, 0);
		assert(!tree.root.get('foo'));
		assert(!tree.root.get('bar'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/scrollable.test.ts]---
Location: vscode-main/src/vs/base/test/common/scrollable.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SmoothScrollingOperation, SmoothScrollingUpdate } from '../../common/scrollable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

class TestSmoothScrollingOperation extends SmoothScrollingOperation {

	constructor(from: number, to: number, viewportSize: number, startTime: number, duration: number) {
		duration = duration + 10;
		startTime = startTime - 10;

		super(
			{ scrollLeft: 0, scrollTop: from, width: 0, height: viewportSize },
			{ scrollLeft: 0, scrollTop: to, width: 0, height: viewportSize },
			startTime,
			duration
		);
	}

	public testTick(now: number): SmoothScrollingUpdate {
		return this._tick(now);
	}

}

suite('SmoothScrollingOperation', () => {

	const VIEWPORT_HEIGHT = 800;
	const ANIMATION_DURATION = 125;
	const LINE_HEIGHT = 20;

	ensureNoDisposablesAreLeakedInTestSuite();

	function extractLines(scrollable: TestSmoothScrollingOperation, now: number): [number, number] {
		const scrollTop = scrollable.testTick(now).scrollTop;
		const scrollBottom = scrollTop + VIEWPORT_HEIGHT;

		const startLineNumber = Math.floor(scrollTop / LINE_HEIGHT);
		const endLineNumber = Math.ceil(scrollBottom / LINE_HEIGHT);

		return [startLineNumber, endLineNumber];
	}

	function simulateSmoothScroll(from: number, to: number): [number, number][] {
		const scrollable = new TestSmoothScrollingOperation(from, to, VIEWPORT_HEIGHT, 0, ANIMATION_DURATION);

		const result: [number, number][] = [];
		let resultLen = 0;
		result[resultLen++] = extractLines(scrollable, 0);
		result[resultLen++] = extractLines(scrollable, 25);
		result[resultLen++] = extractLines(scrollable, 50);
		result[resultLen++] = extractLines(scrollable, 75);
		result[resultLen++] = extractLines(scrollable, 100);
		result[resultLen++] = extractLines(scrollable, 125);
		return result;
	}

	function assertSmoothScroll(from: number, to: number, expected: [number, number][]): void {
		const actual = simulateSmoothScroll(from, to);
		assert.deepStrictEqual(actual, expected);
	}

	test('scroll 25 lines (40 fit)', () => {
		assertSmoothScroll(0, 500, [
			[5, 46],
			[14, 55],
			[20, 61],
			[23, 64],
			[24, 65],
			[25, 65],
		]);
	});

	test('scroll 75 lines (40 fit)', () => {
		assertSmoothScroll(0, 1500, [
			[15, 56],
			[44, 85],
			[62, 103],
			[71, 112],
			[74, 115],
			[75, 115],
		]);
	});

	test('scroll 100 lines (40 fit)', () => {
		assertSmoothScroll(0, 2000, [
			[20, 61],
			[59, 100],
			[82, 123],
			[94, 135],
			[99, 140],
			[100, 140],
		]);
	});

	test('scroll 125 lines (40 fit)', () => {
		assertSmoothScroll(0, 2500, [
			[16, 57],
			[29, 70],
			[107, 148],
			[119, 160],
			[124, 165],
			[125, 165],
		]);
	});

	test('scroll 500 lines (40 fit)', () => {
		assertSmoothScroll(0, 10000, [
			[16, 57],
			[29, 70],
			[482, 523],
			[494, 535],
			[499, 540],
			[500, 540],
		]);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/snapshot.ts]---
Location: vscode-main/src/vs/base/test/common/snapshot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Lazy } from '../../common/lazy.js';
import { FileAccess } from '../../common/network.js';
import { URI } from '../../common/uri.js';

declare const __readFileInTests: (path: string) => Promise<string>;
declare const __writeFileInTests: (path: string, contents: string) => Promise<void>;
declare const __readDirInTests: (path: string) => Promise<string[]>;
declare const __unlinkInTests: (path: string) => Promise<void>;
declare const __mkdirPInTests: (path: string) => Promise<void>;

// setup on import so assertSnapshot has the current context without explicit passing
let context: Lazy<SnapshotContext> | undefined;
const sanitizeName = (name: string) => name.replace(/[^a-z0-9_-]/gi, '_');
const normalizeCrlf = (str: string) => str.replace(/\r\n/g, '\n');

export interface ISnapshotOptions {
	/** Name for snapshot file, rather than an incremented number */
	name?: string;
	/** Extension name of the snapshot file, defaults to `.snap` */
	extension?: string;
}

/**
 * This is exported only for tests against the snapshotting itself! Use
 * {@link assertSnapshot} as a consumer!
 */
export class SnapshotContext {
	private nextIndex = 0;
	protected snapshotsDir: URI;
	private readonly namePrefix: string;
	private readonly usedNames = new Set();

	constructor(private readonly test: Mocha.Test | undefined) {
		if (!test) {
			throw new Error('assertSnapshot can only be used in a test');
		}

		if (!test.file) {
			throw new Error('currentTest.file is not set, please open an issue with the test you\'re trying to run');
		}

		const src = URI.joinPath(FileAccess.asFileUri(''), '../src');
		const parts = test.file.split(/[/\\]/g);

		this.namePrefix = sanitizeName(test.fullTitle()) + '.';
		this.snapshotsDir = URI.joinPath(src, ...[...parts.slice(0, -1), '__snapshots__']);
	}

	public async assert(value: unknown, options?: ISnapshotOptions) {
		const originalStack = new Error().stack!; // save to make the stack nicer on failure
		const nameOrIndex = (options?.name ? sanitizeName(options.name) : this.nextIndex++);
		const fileName = this.namePrefix + nameOrIndex + '.' + (options?.extension || 'snap');
		this.usedNames.add(fileName);

		const fpath = URI.joinPath(this.snapshotsDir, fileName).fsPath;
		const actual = formatValue(value);
		let expected: string;
		try {
			expected = await __readFileInTests(fpath);
		} catch {
			console.info(`Creating new snapshot in: ${fpath}`);
			await __mkdirPInTests(this.snapshotsDir.fsPath);
			await __writeFileInTests(fpath, actual);
			return;
		}

		if (normalizeCrlf(expected) !== normalizeCrlf(actual)) {
			await __writeFileInTests(fpath + '.actual', actual);
			const err: any = new Error(`Snapshot #${nameOrIndex} does not match expected output`);
			err.expected = expected;
			err.actual = actual;
			err.snapshotPath = fpath;
			err.stack = (err.stack as string)
				.split('\n')
				// remove all frames from the async stack and keep the original caller's frame
				.slice(0, 1)
				.concat(originalStack.split('\n').slice(3))
				.join('\n');
			throw err;
		}
	}

	public async removeOldSnapshots() {
		const contents = await __readDirInTests(this.snapshotsDir.fsPath);
		const toDelete = contents.filter(f => f.startsWith(this.namePrefix) && !this.usedNames.has(f));
		if (toDelete.length) {
			console.info(`Deleting ${toDelete.length} old snapshots for ${this.test?.fullTitle()}`);
		}

		await Promise.all(toDelete.map(f => __unlinkInTests(URI.joinPath(this.snapshotsDir, f).fsPath)));
	}
}

const debugDescriptionSymbol = Symbol.for('debug.description');

function formatValue(value: unknown, level = 0, seen: unknown[] = []): string {
	switch (typeof value) {
		case 'bigint':
		case 'boolean':
		case 'number':
		case 'symbol':
		case 'undefined':
			return String(value);
		case 'string':
			return level === 0 ? value : JSON.stringify(value);
		case 'function':
			return `[Function ${value.name}]`;
		case 'object': {
			if (value === null) {
				return 'null';
			}
			if (value instanceof RegExp) {
				return String(value);
			}
			if (seen.includes(value)) {
				return '[Circular]';
			}
			// eslint-disable-next-line local/code-no-any-casts
			if (debugDescriptionSymbol in value && typeof (value as any)[debugDescriptionSymbol] === 'function') {
				// eslint-disable-next-line local/code-no-any-casts
				return (value as any)[debugDescriptionSymbol]();
			}
			const oi = '  '.repeat(level);
			const ci = '  '.repeat(level + 1);
			if (Array.isArray(value)) {
				const children = value.map(v => formatValue(v, level + 1, [...seen, value]));
				const multiline = children.some(c => c.includes('\n')) || children.join(', ').length > 80;
				return multiline ? `[\n${ci}${children.join(`,\n${ci}`)}\n${oi}]` : `[ ${children.join(', ')} ]`;
			}

			let entries;
			let prefix = '';
			if (value instanceof Map) {
				prefix = 'Map ';
				entries = [...value.entries()];
			} else if (value instanceof Set) {
				prefix = 'Set ';
				entries = [...value.entries()];
			} else {
				entries = Object.entries(value);
			}

			const lines = entries.map(([k, v]) => `${k}: ${formatValue(v, level + 1, [...seen, value])}`);
			return prefix + (lines.length > 1
				? `{\n${ci}${lines.join(`,\n${ci}`)}\n${oi}}`
				: `{ ${lines.join(',\n')} }`);
		}
		default:
			throw new Error(`Unknown type ${value}`);
	}
}

setup(function () {
	const currentTest = this.currentTest;
	context = new Lazy(() => new SnapshotContext(currentTest));
});
teardown(async function () {
	if (this.currentTest?.state === 'passed') {
		await context?.rawValue?.removeOldSnapshots();
	}
	context = undefined;
});

/**
 * Implements a snapshot testing utility. ⚠️ This is async! ⚠️
 *
 * The first time a snapshot test is run, it'll record the value it's called
 * with as the expected value. Subsequent runs will fail if the value differs,
 * but the snapshot can be regenerated by hand or using the Selfhost Test
 * Provider Extension which'll offer to update it.
 *
 * The snapshot will be associated with the currently running test and stored
 * in a `__snapshots__` directory next to the test file, which is expected to
 * be the first `.test.js` file in the callstack.
 */
export function assertSnapshot(value: unknown, options?: ISnapshotOptions): Promise<void> {
	if (!context) {
		throw new Error('assertSnapshot can only be used in a test');
	}

	return context.value.assert(value, options);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/sseParser.test.ts]---
Location: vscode-main/src/vs/base/test/common/sseParser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ISSEEvent, SSEParser } from '../../common/sseParser.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

// Helper function to convert string to Uint8Array for testing
function toUint8Array(str: string): Uint8Array {
	return new TextEncoder().encode(str);
}

suite('SSEParser', () => {
	let receivedEvents: ISSEEvent[];
	let parser: SSEParser;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		receivedEvents = [];
		parser = new SSEParser((event) => receivedEvents.push(event));
	});
	test('handles basic events', () => {
		parser.feed(toUint8Array('data: hello world\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].type, 'message');
		assert.strictEqual(receivedEvents[0].data, 'hello world');
	});
	test('handles events with multiple data fields', () => {
		parser.feed(toUint8Array('data: first line\ndata: second line\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'first line\nsecond line');
	});
	test('handles events with explicit event type', () => {
		parser.feed(toUint8Array('event: custom\ndata: hello world\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].type, 'custom');
		assert.strictEqual(receivedEvents[0].data, 'hello world');
	});
	test('handles events with explicit event type (CRLF)', () => {
		parser.feed(toUint8Array('event: custom\r\ndata: hello world\r\n\r\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].type, 'custom');
		assert.strictEqual(receivedEvents[0].data, 'hello world');
	});
	test('stream processing chunks', () => {
		for (const lf of ['\n', '\r\n', '\r']) {
			const message = toUint8Array(`event: custom${lf}data: hello world${lf}${lf}event: custom2${lf}data: hello world2${lf}${lf}`);
			for (let chunkSize = 1; chunkSize < 5; chunkSize++) {
				receivedEvents.length = 0;

				for (let i = 0; i < message.length; i += chunkSize) {
					const chunk = message.slice(i, i + chunkSize);
					parser.feed(chunk);
				}

				assert.deepStrictEqual(receivedEvents, [
					{ type: 'custom', data: 'hello world' },
					{ type: 'custom2', data: 'hello world2' }
				], `Failed for chunk size ${chunkSize} and line ending ${JSON.stringify(lf)}`);
			}
		}
	});
	test('handles events with ID', () => {
		parser.feed(toUint8Array('event: custom\ndata: hello\nid: 123\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].type, 'custom');
		assert.strictEqual(receivedEvents[0].data, 'hello');
		assert.strictEqual(receivedEvents[0].id, '123');
		assert.strictEqual(parser.getLastEventId(), '123');
	});

	test('ignores comments', () => {
		parser.feed(toUint8Array('event: custom\n:this is a comment\ndata: hello\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
	});

	test('handles retry field', () => {
		parser.feed(toUint8Array('retry: 5000\ndata: hello\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
		assert.strictEqual(receivedEvents[0].retry, 5000);
		assert.strictEqual(parser.getReconnectionTime(), 5000);
	});
	test('handles invalid retry field', () => {
		parser.feed(toUint8Array('retry: invalid\ndata: hello\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
		assert.strictEqual(receivedEvents[0].retry, undefined);
		assert.strictEqual(parser.getReconnectionTime(), undefined);
	});

	test('ignores fields with NULL character in ID', () => {
		parser.feed(toUint8Array('id: 12\0 3\ndata: hello\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].id, undefined);
		assert.strictEqual(parser.getLastEventId(), undefined);
	});

	test('handles fields with no value', () => {
		parser.feed(toUint8Array('data\nid\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, '');
		assert.strictEqual(receivedEvents[0].id, '');
	});
	test('handles fields with space after colon', () => {
		parser.feed(toUint8Array('data: hello\nevent: custom\nid: 123\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
		assert.strictEqual(receivedEvents[0].type, 'custom');
		assert.strictEqual(receivedEvents[0].id, '123');
	});

	test('handles different line endings (LF)', () => {
		parser.feed(toUint8Array('data: hello\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
	});

	test('handles different line endings (CR)', () => {
		parser.feed(toUint8Array('data: hello\r\r'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
	});

	test('handles different line endings (CRLF)', () => {
		parser.feed(toUint8Array('data: hello\r\n\r\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'hello');
	});
	test('handles empty data with blank line', () => {
		parser.feed(toUint8Array('data:\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, '');
	});

	test('ignores events with no data after blank line', () => {
		parser.feed(toUint8Array('event: custom\n\n'));

		assert.strictEqual(receivedEvents.length, 0);
	});

	test('supports chunked data', () => {
		parser.feed(toUint8Array('event: cus'));
		parser.feed(toUint8Array('tom\nda'));
		parser.feed(toUint8Array('ta: hello\n'));
		parser.feed(toUint8Array('\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].type, 'custom');
		assert.strictEqual(receivedEvents[0].data, 'hello');
	});

	test('supports spec example', () => {
		// Example from the spec
		parser.feed(toUint8Array(':This is a comment\ndata: first event\nid: 1\n\n'));
		parser.feed(toUint8Array('data:second event\nid\n\n'));
		parser.feed(toUint8Array('data:  third event\n\n'));

		assert.strictEqual(receivedEvents.length, 3);
		assert.strictEqual(receivedEvents[0].data, 'first event');
		assert.strictEqual(receivedEvents[0].id, '1');
		assert.strictEqual(receivedEvents[1].data, 'second event');
		assert.strictEqual(receivedEvents[1].id, '');
		assert.strictEqual(receivedEvents[2].data, ' third event');
	});

	test('resets correctly', () => {
		parser.feed(toUint8Array('data: hello\n'));
		parser.reset();
		parser.feed(toUint8Array('data: world\n\n'));

		assert.strictEqual(receivedEvents.length, 1);
		assert.strictEqual(receivedEvents[0].data, 'world');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/stream.test.ts]---
Location: vscode-main/src/vs/base/test/common/stream.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { bufferToReadable, VSBuffer } from '../../common/buffer.js';
import { CancellationTokenSource } from '../../common/cancellation.js';
import { consumeReadable, consumeStream, isReadable, isReadableBufferedStream, isReadableStream, listenStream, newWriteableStream, peekReadable, peekStream, prefixedReadable, prefixedStream, Readable, ReadableStream, toReadable, toStream, transform } from '../../common/stream.js';

suite('Stream', () => {

	test('isReadable', () => {
		assert.ok(!isReadable(undefined));
		assert.ok(!isReadable(Object.create(null)));
		assert.ok(isReadable(bufferToReadable(VSBuffer.fromString(''))));
	});

	test('isReadableStream', () => {
		assert.ok(!isReadableStream(undefined));
		assert.ok(!isReadableStream(Object.create(null)));
		assert.ok(isReadableStream(newWriteableStream(d => d)));
	});

	test('isReadableBufferedStream', async () => {
		assert.ok(!isReadableBufferedStream(Object.create(null)));

		const stream = newWriteableStream(d => d);
		stream.end();
		const bufferedStream = await peekStream(stream, 1);
		assert.ok(isReadableBufferedStream(bufferedStream));
	});

	test('WriteableStream - basics', () => {
		const stream = newWriteableStream<string>(strings => strings.join());

		let error = false;
		stream.on('error', e => {
			error = true;
		});

		let end = false;
		stream.on('end', () => {
			end = true;
		});

		stream.write('Hello');

		const chunks: string[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		assert.strictEqual(chunks[0], 'Hello');

		stream.write('World');
		assert.strictEqual(chunks[1], 'World');

		assert.strictEqual(error, false);
		assert.strictEqual(end, false);

		stream.pause();
		stream.write('1');
		stream.write('2');
		stream.write('3');

		assert.strictEqual(chunks.length, 2);

		stream.resume();

		assert.strictEqual(chunks.length, 3);
		assert.strictEqual(chunks[2], '1,2,3');

		stream.error(new Error());
		assert.strictEqual(error, true);

		error = false;
		stream.error(new Error());
		assert.strictEqual(error, true);

		stream.end('Final Bit');
		assert.strictEqual(chunks.length, 4);
		assert.strictEqual(chunks[3], 'Final Bit');
		assert.strictEqual(end, true);

		stream.destroy();

		stream.write('Unexpected');
		assert.strictEqual(chunks.length, 4);
	});

	test('stream with non-reducible messages', () => {
		/**
		 * A complex object that cannot be reduced to a single object.
		 */
		class TestMessage {
			constructor(public value: string) { }
		}

		const stream = newWriteableStream<TestMessage>(null);

		let error = false;
		stream.on('error', e => {
			error = true;
		});

		let end = false;
		stream.on('end', () => {
			end = true;
		});

		stream.write(new TestMessage('Hello'));

		const chunks: TestMessage[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		assert(
			chunks[0] instanceof TestMessage,
			'Message `0` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[0].value, 'Hello');

		stream.write(new TestMessage('World'));

		assert(
			chunks[1] instanceof TestMessage,
			'Message `1` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[1].value, 'World');

		assert.strictEqual(error, false);
		assert.strictEqual(end, false);

		stream.pause();
		stream.write(new TestMessage('1'));
		stream.write(new TestMessage('2'));
		stream.write(new TestMessage('3'));

		assert.strictEqual(chunks.length, 2);

		stream.resume();

		assert.strictEqual(chunks.length, 5);

		assert(
			chunks[2] instanceof TestMessage,
			'Message `2` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[2].value, '1');

		assert(
			chunks[3] instanceof TestMessage,
			'Message `3` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[3].value, '2');

		assert(
			chunks[4] instanceof TestMessage,
			'Message `4` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[4].value, '3');

		stream.error(new Error());
		assert.strictEqual(error, true);

		error = false;
		stream.error(new Error());
		assert.strictEqual(error, true);

		stream.end(new TestMessage('Final Bit'));
		assert.strictEqual(chunks.length, 6);

		assert(
			chunks[5] instanceof TestMessage,
			'Message `5` must be an instance of `TestMessage`.',
		);
		assert.strictEqual(chunks[5].value, 'Final Bit');


		assert.strictEqual(end, true);

		stream.destroy();

		stream.write(new TestMessage('Unexpected'));
		assert.strictEqual(chunks.length, 6);
	});

	test('WriteableStream - end with empty string works', async () => {
		const reducer = (strings: string[]) => strings.length > 0 ? strings.join() : 'error';
		const stream = newWriteableStream<string>(reducer);
		stream.end('');

		const result = await consumeStream(stream, reducer);
		assert.strictEqual(result, '');
	});

	test('WriteableStream - end with error works', async () => {
		const reducer = (errors: Error[]) => errors[0];
		const stream = newWriteableStream<Error>(reducer);
		stream.end(new Error('error'));

		const result = await consumeStream(stream, reducer);
		assert.ok(result instanceof Error);
	});

	test('WriteableStream - removeListener', () => {
		const stream = newWriteableStream<string>(strings => strings.join());

		let error = false;
		const errorListener = (e: Error) => {
			error = true;
		};
		stream.on('error', errorListener);

		let data = false;
		const dataListener = () => {
			data = true;
		};
		stream.on('data', dataListener);

		stream.write('Hello');
		assert.strictEqual(data, true);

		data = false;
		stream.removeListener('data', dataListener);

		stream.write('World');
		assert.strictEqual(data, false);

		stream.error(new Error());
		assert.strictEqual(error, true);

		error = false;
		stream.removeListener('error', errorListener);

		// always leave at least one error listener to streams to avoid unexpected errors during test running
		stream.on('error', () => { });
		stream.error(new Error());
		assert.strictEqual(error, false);
	});

	test('WriteableStream - highWaterMark', async () => {
		const stream = newWriteableStream<string>(strings => strings.join(), { highWaterMark: 3 });

		let res = stream.write('1');
		assert.ok(!res);

		res = stream.write('2');
		assert.ok(!res);

		res = stream.write('3');
		assert.ok(!res);

		const promise1 = stream.write('4');
		assert.ok(promise1 instanceof Promise);

		const promise2 = stream.write('5');
		assert.ok(promise2 instanceof Promise);

		let drained1 = false;
		(async () => {
			await promise1;
			drained1 = true;
		})();

		let drained2 = false;
		(async () => {
			await promise2;
			drained2 = true;
		})();

		let data: string | undefined = undefined;
		stream.on('data', chunk => {
			data = chunk;
		});
		assert.ok(data);

		await timeout(0);
		assert.strictEqual(drained1, true);
		assert.strictEqual(drained2, true);
	});

	test('consumeReadable', () => {
		const readable = arrayToReadable(['1', '2', '3', '4', '5']);
		const consumed = consumeReadable(readable, strings => strings.join());
		assert.strictEqual(consumed, '1,2,3,4,5');
	});

	test('peekReadable', () => {
		for (let i = 0; i < 5; i++) {
			const readable = arrayToReadable(['1', '2', '3', '4', '5']);

			const consumedOrReadable = peekReadable(readable, strings => strings.join(), i);
			if (typeof consumedOrReadable === 'string') {
				assert.fail('Unexpected result');
			} else {
				const consumed = consumeReadable(consumedOrReadable, strings => strings.join());
				assert.strictEqual(consumed, '1,2,3,4,5');
			}
		}

		let readable = arrayToReadable(['1', '2', '3', '4', '5']);
		let consumedOrReadable = peekReadable(readable, strings => strings.join(), 5);
		assert.strictEqual(consumedOrReadable, '1,2,3,4,5');

		readable = arrayToReadable(['1', '2', '3', '4', '5']);
		consumedOrReadable = peekReadable(readable, strings => strings.join(), 6);
		assert.strictEqual(consumedOrReadable, '1,2,3,4,5');
	});

	test('peekReadable - error handling', async () => {

		// 0 Chunks
		let stream = newWriteableStream(data => data);

		let error: Error | undefined = undefined;
		let promise = (async () => {
			try {
				await peekStream(stream, 1);
			} catch (err) {
				error = err;
			}
		})();

		stream.error(new Error());
		await promise;

		assert.ok(error);

		// 1 Chunk
		stream = newWriteableStream(data => data);

		error = undefined;
		promise = (async () => {
			try {
				await peekStream(stream, 1);
			} catch (err) {
				error = err;
			}
		})();

		stream.write('foo');
		stream.error(new Error());
		await promise;

		assert.ok(error);

		// 2 Chunks
		stream = newWriteableStream(data => data);

		error = undefined;
		promise = (async () => {
			try {
				await peekStream(stream, 1);
			} catch (err) {
				error = err;
			}
		})();

		stream.write('foo');
		stream.write('bar');
		stream.error(new Error());
		await promise;

		assert.ok(!error);

		stream.on('error', err => error = err);
		stream.on('data', chunk => { });
		assert.ok(error);
	});

	function arrayToReadable<T>(array: T[]): Readable<T> {
		return {
			read: () => array.shift() || null
		};
	}

	function readableToStream(readable: Readable<string>): ReadableStream<string> {
		const stream = newWriteableStream<string>(strings => strings.join());

		// Simulate async behavior
		setTimeout(() => {
			let chunk: string | null = null;
			while ((chunk = readable.read()) !== null) {
				stream.write(chunk);
			}

			stream.end();
		}, 0);

		return stream;
	}

	test('consumeStream', async () => {
		const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
		const consumed = await consumeStream(stream, strings => strings.join());
		assert.strictEqual(consumed, '1,2,3,4,5');
	});

	test('consumeStream - without reducer', async () => {
		const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
		const consumed = await consumeStream(stream);
		assert.strictEqual(consumed, undefined);
	});

	test('consumeStream - without reducer and error', async () => {
		const stream = newWriteableStream<string>(strings => strings.join());
		stream.error(new Error());

		const consumed = await consumeStream(stream);
		assert.strictEqual(consumed, undefined);
	});

	test('listenStream', () => {
		const stream = newWriteableStream<string>(strings => strings.join());

		let error = false;
		let end = false;
		let data = '';

		listenStream(stream, {
			onData: d => {
				data = d;
			},
			onError: e => {
				error = true;
			},
			onEnd: () => {
				end = true;
			}
		});

		stream.write('Hello');

		assert.strictEqual(data, 'Hello');

		stream.write('World');
		assert.strictEqual(data, 'World');

		assert.strictEqual(error, false);
		assert.strictEqual(end, false);

		stream.error(new Error());
		assert.strictEqual(error, true);

		stream.end('Final Bit');
		assert.strictEqual(end, true);
	});

	test('listenStream - cancellation', () => {
		const stream = newWriteableStream<string>(strings => strings.join());

		let error = false;
		let end = false;
		let data = '';

		const cts = new CancellationTokenSource();

		listenStream(stream, {
			onData: d => {
				data = d;
			},
			onError: e => {
				error = true;
			},
			onEnd: () => {
				end = true;
			}
		}, cts.token);

		cts.cancel();

		stream.write('Hello');
		assert.strictEqual(data, '');

		stream.write('World');
		assert.strictEqual(data, '');

		stream.error(new Error());
		assert.strictEqual(error, false);

		stream.end('Final Bit');
		assert.strictEqual(end, false);
	});

	test('peekStream', async () => {
		for (let i = 0; i < 5; i++) {
			const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));

			const result = await peekStream(stream, i);
			assert.strictEqual(stream, result.stream);
			if (result.ended) {
				assert.fail('Unexpected result, stream should not have ended yet');
			} else {
				assert.strictEqual(result.buffer.length, i + 1, `maxChunks: ${i}`);

				const additionalResult: string[] = [];
				await consumeStream(stream, strings => {
					additionalResult.push(...strings);

					return strings.join();
				});

				assert.strictEqual([...result.buffer, ...additionalResult].join(), '1,2,3,4,5');
			}
		}

		let stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
		let result = await peekStream(stream, 5);
		assert.strictEqual(stream, result.stream);
		assert.strictEqual(result.buffer.join(), '1,2,3,4,5');
		assert.strictEqual(result.ended, true);

		stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
		result = await peekStream(stream, 6);
		assert.strictEqual(stream, result.stream);
		assert.strictEqual(result.buffer.join(), '1,2,3,4,5');
		assert.strictEqual(result.ended, true);
	});

	test('toStream', async () => {
		const stream = toStream('1,2,3,4,5', strings => strings.join());
		const consumed = await consumeStream(stream, strings => strings.join());
		assert.strictEqual(consumed, '1,2,3,4,5');
	});

	test('toReadable', async () => {
		const readable = toReadable('1,2,3,4,5');
		const consumed = consumeReadable(readable, strings => strings.join());
		assert.strictEqual(consumed, '1,2,3,4,5');
	});

	test('transform', async () => {
		const source = newWriteableStream<string>(strings => strings.join());

		const result = transform(source, { data: string => string + string }, strings => strings.join());

		// Simulate async behavior
		setTimeout(() => {
			source.write('1');
			source.write('2');
			source.write('3');
			source.write('4');
			source.end('5');
		}, 0);

		const consumed = await consumeStream(result, strings => strings.join());
		assert.strictEqual(consumed, '11,22,33,44,55');
	});

	test('events are delivered even if a listener is removed during delivery', () => {
		const stream = newWriteableStream<string>(strings => strings.join());

		let listener1Called = false;
		let listener2Called = false;

		const listener1 = () => { stream.removeListener('end', listener1); listener1Called = true; };
		const listener2 = () => { listener2Called = true; };
		stream.on('end', listener1);
		stream.on('end', listener2);
		stream.on('data', () => { });
		stream.end('');

		assert.strictEqual(listener1Called, true);
		assert.strictEqual(listener2Called, true);
	});

	test('prefixedReadable', () => {

		// Basic
		let readable = prefixedReadable('1,2', arrayToReadable(['3', '4', '5']), val => val.join(','));
		assert.strictEqual(consumeReadable(readable, val => val.join(',')), '1,2,3,4,5');

		// Empty
		readable = prefixedReadable('empty', arrayToReadable<string>([]), val => val.join(','));
		assert.strictEqual(consumeReadable(readable, val => val.join(',')), 'empty');
	});

	test('prefixedStream', async () => {

		// Basic
		let stream = newWriteableStream<string>(strings => strings.join());
		stream.write('3');
		stream.write('4');
		stream.write('5');
		stream.end();

		let prefixStream = prefixedStream<string>('1,2', stream, val => val.join(','));
		assert.strictEqual(await consumeStream(prefixStream, val => val.join(',')), '1,2,3,4,5');

		// Empty
		stream = newWriteableStream<string>(strings => strings.join());
		stream.end();

		prefixStream = prefixedStream<string>('1,2', stream, val => val.join(','));
		assert.strictEqual(await consumeStream(prefixStream, val => val.join(',')), '1,2');

		// Error
		stream = newWriteableStream<string>(strings => strings.join());
		stream.error(new Error('fail'));

		prefixStream = prefixedStream<string>('error', stream, val => val.join(','));

		let error;
		try {
			await consumeStream(prefixStream, val => val.join(','));
		} catch (e) {
			error = e;
		}
		assert.ok(error);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/strings.test.ts]---
Location: vscode-main/src/vs/base/test/common/strings.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as strings from '../../common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Strings', () => {
	test('equalsIgnoreCase', () => {
		assert(strings.equalsIgnoreCase('', ''));
		assert(!strings.equalsIgnoreCase('', '1'));
		assert(!strings.equalsIgnoreCase('1', ''));

		assert(strings.equalsIgnoreCase('a', 'a'));
		assert(strings.equalsIgnoreCase('abc', 'Abc'));
		assert(strings.equalsIgnoreCase('abc', 'ABC'));
		assert(strings.equalsIgnoreCase('Höhenmeter', 'HÖhenmeter'));
		assert(strings.equalsIgnoreCase('ÖL', 'Öl'));
	});

	test('equals', () => {
		assert(!strings.equals(undefined, 'abc'));
		assert(!strings.equals('abc', undefined));
		assert(strings.equals(undefined, undefined));
		assert(strings.equals('', ''));
		assert(strings.equals('a', 'a'));
		assert(!strings.equals('abc', 'Abc'));
		assert(strings.equals('abc', 'ABC', true));
		assert(!strings.equals('Höhenmeter', 'HÖhenmeter'));
		assert(!strings.equals('ÖL', 'Öl'));
		assert(strings.equals('ÖL', 'Öl', true));
	});

	test('startsWithIgnoreCase', () => {
		assert(strings.startsWithIgnoreCase('', ''));
		assert(!strings.startsWithIgnoreCase('', '1'));
		assert(strings.startsWithIgnoreCase('1', ''));

		assert(strings.startsWithIgnoreCase('a', 'a'));
		assert(strings.startsWithIgnoreCase('abc', 'Abc'));
		assert(strings.startsWithIgnoreCase('abc', 'ABC'));
		assert(strings.startsWithIgnoreCase('Höhenmeter', 'HÖhenmeter'));
		assert(strings.startsWithIgnoreCase('ÖL', 'Öl'));

		assert(strings.startsWithIgnoreCase('alles klar', 'a'));
		assert(strings.startsWithIgnoreCase('alles klar', 'A'));
		assert(strings.startsWithIgnoreCase('alles klar', 'alles k'));
		assert(strings.startsWithIgnoreCase('alles klar', 'alles K'));
		assert(strings.startsWithIgnoreCase('alles klar', 'ALLES K'));
		assert(strings.startsWithIgnoreCase('alles klar', 'alles klar'));
		assert(strings.startsWithIgnoreCase('alles klar', 'ALLES KLAR'));

		assert(!strings.startsWithIgnoreCase('alles klar', ' ALLES K'));
		assert(!strings.startsWithIgnoreCase('alles klar', 'ALLES K '));
		assert(!strings.startsWithIgnoreCase('alles klar', 'öALLES K '));
		assert(!strings.startsWithIgnoreCase('alles klar', ' '));
		assert(!strings.startsWithIgnoreCase('alles klar', 'ö'));
	});

	test('endsWithIgnoreCase', () => {
		assert(strings.endsWithIgnoreCase('', ''));
		assert(!strings.endsWithIgnoreCase('', '1'));
		assert(strings.endsWithIgnoreCase('1', ''));

		assert(!strings.endsWithIgnoreCase('abcd', 'abcde'));

		assert(strings.endsWithIgnoreCase('a', 'a'));
		assert(strings.endsWithIgnoreCase('abc', 'Abc'));
		assert(strings.endsWithIgnoreCase('abc', 'ABC'));
		assert(strings.endsWithIgnoreCase('Höhenmeter', 'HÖhenmeter'));
		assert(strings.endsWithIgnoreCase('ÖL', 'Öl'));

		assert(strings.endsWithIgnoreCase('alles klar', 'r'));
		assert(strings.endsWithIgnoreCase('alles klar', 'R'));
		assert(strings.endsWithIgnoreCase('alles klar', 's klar'));
		assert(strings.endsWithIgnoreCase('alles klar', 'S klar'));
		assert(strings.endsWithIgnoreCase('alles klar', 'S KLAR'));
		assert(strings.endsWithIgnoreCase('alles klar', 'alles klar'));
		assert(strings.endsWithIgnoreCase('alles klar', 'ALLES KLAR'));

		assert(!strings.endsWithIgnoreCase('alles klar', 'S KLAR '));
		assert(!strings.endsWithIgnoreCase('alles klar', ' S KLAR'));
		assert(!strings.endsWithIgnoreCase('alles klar', 'S KLARö'));
		assert(!strings.endsWithIgnoreCase('alles klar', ' '));
		assert(!strings.endsWithIgnoreCase('alles klar', 'ö'));
	});

	test('compareIgnoreCase', () => {

		function assertCompareIgnoreCase(a: string, b: string, recurse = true): void {
			let actual = strings.compareIgnoreCase(a, b);
			actual = actual > 0 ? 1 : actual < 0 ? -1 : actual;

			let expected = strings.compare(a.toLowerCase(), b.toLowerCase());
			expected = expected > 0 ? 1 : expected < 0 ? -1 : expected;
			assert.strictEqual(actual, expected, `${a} <> ${b}`);

			if (recurse) {
				assertCompareIgnoreCase(b, a, false);
			}
		}

		assertCompareIgnoreCase('', '');
		assertCompareIgnoreCase('abc', 'ABC');
		assertCompareIgnoreCase('abc', 'ABc');
		assertCompareIgnoreCase('abc', 'ABcd');
		assertCompareIgnoreCase('abc', 'abcd');
		assertCompareIgnoreCase('foo', 'föo');
		assertCompareIgnoreCase('Code', 'code');
		assertCompareIgnoreCase('Code', 'cöde');

		assertCompareIgnoreCase('B', 'a');
		assertCompareIgnoreCase('a', 'B');
		assertCompareIgnoreCase('b', 'a');
		assertCompareIgnoreCase('a', 'b');

		assertCompareIgnoreCase('aa', 'ab');
		assertCompareIgnoreCase('aa', 'aB');
		assertCompareIgnoreCase('aa', 'aA');
		assertCompareIgnoreCase('a', 'aa');
		assertCompareIgnoreCase('ab', 'aA');
		assertCompareIgnoreCase('O', '/');
	});

	test('compareIgnoreCase (substring)', () => {

		function assertCompareIgnoreCase(a: string, b: string, aStart: number, aEnd: number, bStart: number, bEnd: number, recurse = true): void {
			let actual = strings.compareSubstringIgnoreCase(a, b, aStart, aEnd, bStart, bEnd);
			actual = actual > 0 ? 1 : actual < 0 ? -1 : actual;

			let expected = strings.compare(a.toLowerCase().substring(aStart, aEnd), b.toLowerCase().substring(bStart, bEnd));
			expected = expected > 0 ? 1 : expected < 0 ? -1 : expected;
			assert.strictEqual(actual, expected, `${a} <> ${b}`);

			if (recurse) {
				assertCompareIgnoreCase(b, a, bStart, bEnd, aStart, aEnd, false);
			}
		}

		assertCompareIgnoreCase('', '', 0, 0, 0, 0);
		assertCompareIgnoreCase('abc', 'ABC', 0, 1, 0, 1);
		assertCompareIgnoreCase('abc', 'Aabc', 0, 3, 1, 4);
		assertCompareIgnoreCase('abcABc', 'ABcd', 3, 6, 0, 4);
	});

	test('format', () => {
		assert.strictEqual(strings.format('Foo Bar'), 'Foo Bar');
		assert.strictEqual(strings.format('Foo {0} Bar'), 'Foo {0} Bar');
		assert.strictEqual(strings.format('Foo {0} Bar', 'yes'), 'Foo yes Bar');
		assert.strictEqual(strings.format('Foo {0} Bar {0}', 'yes'), 'Foo yes Bar yes');
		assert.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes'), 'Foo yes Bar {1}{2}');
		assert.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes', undefined), 'Foo yes Bar undefined{2}');
		assert.strictEqual(strings.format('Foo {0} Bar {1}{2}', 'yes', 5, false), 'Foo yes Bar 5false');
		assert.strictEqual(strings.format('Foo {0} Bar. {1}', '(foo)', '.test'), 'Foo (foo) Bar. .test');
	});

	test('format2', () => {
		assert.strictEqual(strings.format2('Foo Bar', {}), 'Foo Bar');
		assert.strictEqual(strings.format2('Foo {oops} Bar', {}), 'Foo {oops} Bar');
		assert.strictEqual(strings.format2('Foo {foo} Bar', { foo: 'bar' }), 'Foo bar Bar');
		assert.strictEqual(strings.format2('Foo {foo} Bar {foo}', { foo: 'bar' }), 'Foo bar Bar bar');
		assert.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar' }), 'Foo bar Bar {bar}{boo}');
		assert.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar', bar: 'undefined' }), 'Foo bar Bar undefined{boo}');
		assert.strictEqual(strings.format2('Foo {foo} Bar {bar}{boo}', { foo: 'bar', bar: '5', boo: false }), 'Foo bar Bar 5false');
		assert.strictEqual(strings.format2('Foo {foo} Bar. {bar}', { foo: '(foo)', bar: '.test' }), 'Foo (foo) Bar. .test');
	});

	test('lcut', () => {
		assert.strictEqual(strings.lcut('foo bar', 0), '');
		assert.strictEqual(strings.lcut('foo bar', 1), 'bar');
		assert.strictEqual(strings.lcut('foo bar', 3), 'bar');
		assert.strictEqual(strings.lcut('foo bar', 4), 'bar'); // Leading whitespace trimmed
		assert.strictEqual(strings.lcut('foo bar', 5), 'foo bar');
		assert.strictEqual(strings.lcut('test string 0.1.2.3', 3), '2.3');

		assert.strictEqual(strings.lcut('foo bar', 0, '…'), '…');
		assert.strictEqual(strings.lcut('foo bar', 1, '…'), '…bar');
		assert.strictEqual(strings.lcut('foo bar', 3, '…'), '…bar');
		assert.strictEqual(strings.lcut('foo bar', 4, '…'), '…bar'); // Leading whitespace trimmed
		assert.strictEqual(strings.lcut('foo bar', 5, '…'), 'foo bar');
		assert.strictEqual(strings.lcut('test string 0.1.2.3', 3, '…'), '…2.3');

		assert.strictEqual(strings.lcut('', 10), '');
		assert.strictEqual(strings.lcut('a', 10), 'a');
		assert.strictEqual(strings.lcut(' a', 10), 'a');
		assert.strictEqual(strings.lcut('            a', 10), 'a');
		assert.strictEqual(strings.lcut(' bbbb       a', 10), 'bbbb       a');
		assert.strictEqual(strings.lcut('............a', 10), '............a');

		assert.strictEqual(strings.lcut('', 10, '…'), '');
		assert.strictEqual(strings.lcut('a', 10, '…'), 'a');
		assert.strictEqual(strings.lcut(' a', 10, '…'), 'a');
		assert.strictEqual(strings.lcut('            a', 10, '…'), 'a');
		assert.strictEqual(strings.lcut(' bbbb       a', 10, '…'), 'bbbb       a');
		assert.strictEqual(strings.lcut('............a', 10, '…'), '............a');
	});

	test('escape', () => {
		assert.strictEqual(strings.escape(''), '');
		assert.strictEqual(strings.escape('foo'), 'foo');
		assert.strictEqual(strings.escape('foo bar'), 'foo bar');
		assert.strictEqual(strings.escape('<foo bar>'), '&lt;foo bar&gt;');
		assert.strictEqual(strings.escape('<foo>Hello</foo>'), '&lt;foo&gt;Hello&lt;/foo&gt;');
	});

	test('ltrim', () => {
		assert.strictEqual(strings.ltrim('foo', 'f'), 'oo');
		assert.strictEqual(strings.ltrim('foo', 'o'), 'foo');
		assert.strictEqual(strings.ltrim('http://www.test.de', 'http://'), 'www.test.de');
		assert.strictEqual(strings.ltrim('/foo/', '/'), 'foo/');
		assert.strictEqual(strings.ltrim('//foo/', '/'), 'foo/');
		assert.strictEqual(strings.ltrim('/', ''), '/');
		assert.strictEqual(strings.ltrim('/', '/'), '');
		assert.strictEqual(strings.ltrim('///', '/'), '');
		assert.strictEqual(strings.ltrim('', ''), '');
		assert.strictEqual(strings.ltrim('', '/'), '');
		// Multi-character needle with consecutive repetitions
		assert.strictEqual(strings.ltrim('---hello', '---'), 'hello');
		assert.strictEqual(strings.ltrim('------hello', '---'), 'hello');
		assert.strictEqual(strings.ltrim('---------hello', '---'), 'hello');
		assert.strictEqual(strings.ltrim('hello---', '---'), 'hello---');
	});

	test('rtrim', () => {
		assert.strictEqual(strings.rtrim('foo', 'o'), 'f');
		assert.strictEqual(strings.rtrim('foo', 'f'), 'foo');
		assert.strictEqual(strings.rtrim('http://www.test.de', '.de'), 'http://www.test');
		assert.strictEqual(strings.rtrim('/foo/', '/'), '/foo');
		assert.strictEqual(strings.rtrim('/foo//', '/'), '/foo');
		assert.strictEqual(strings.rtrim('/', ''), '/');
		assert.strictEqual(strings.rtrim('/', '/'), '');
		assert.strictEqual(strings.rtrim('///', '/'), '');
		assert.strictEqual(strings.rtrim('', ''), '');
		assert.strictEqual(strings.rtrim('', '/'), '');
		// Multi-character needle with consecutive repetitions (bug fix)
		assert.strictEqual(strings.rtrim('hello---', '---'), 'hello');
		assert.strictEqual(strings.rtrim('hello------', '---'), 'hello');
		assert.strictEqual(strings.rtrim('hello---------', '---'), 'hello');
		assert.strictEqual(strings.rtrim('---hello', '---'), '---hello');
		assert.strictEqual(strings.rtrim('hello world' + '---'.repeat(10), '---'), 'hello world');
		assert.strictEqual(strings.rtrim('path/to/file///', '//'), 'path/to/file/');
	});

	test('trim', () => {
		assert.strictEqual(strings.trim(' foo '), 'foo');
		assert.strictEqual(strings.trim('  foo'), 'foo');
		assert.strictEqual(strings.trim('bar  '), 'bar');
		assert.strictEqual(strings.trim('   '), '');
		assert.strictEqual(strings.trim('foo bar', 'bar'), 'foo ');
	});

	test('trimWhitespace', () => {
		assert.strictEqual(' foo '.trim(), 'foo');
		assert.strictEqual('	 foo	'.trim(), 'foo');
		assert.strictEqual('  foo'.trim(), 'foo');
		assert.strictEqual('bar  '.trim(), 'bar');
		assert.strictEqual('   '.trim(), '');
		assert.strictEqual(' 	  '.trim(), '');
	});

	test('lastNonWhitespaceIndex', () => {
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t '), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc'), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc\t'), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc '), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t '), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t abc \t \t '), 11);
		assert.strictEqual(strings.lastNonWhitespaceIndex('abc  \t \t abc \t \t ', 8), 2);
		assert.strictEqual(strings.lastNonWhitespaceIndex('  \t \t '), -1);
	});

	test('containsRTL', () => {
		assert.strictEqual(strings.containsRTL('a'), false);
		assert.strictEqual(strings.containsRTL(''), false);
		assert.strictEqual(strings.containsRTL(strings.UTF8_BOM_CHARACTER + 'a'), false);
		assert.strictEqual(strings.containsRTL('hello world!'), false);
		assert.strictEqual(strings.containsRTL('a📚📚b'), false);
		assert.strictEqual(strings.containsRTL('هناك حقيقة مثبتة منذ زمن طويل'), true);
		assert.strictEqual(strings.containsRTL('זוהי עובדה מבוססת שדעתו'), true);
	});

	test('issue #115221: isEmojiImprecise misses ⭐', () => {
		const codePoint = strings.getNextCodePoint('⭐', '⭐'.length, 0);
		assert.strictEqual(strings.isEmojiImprecise(codePoint), true);
	});

	test('isFullWidthCharacter', () => {
		// Fullwidth ASCII (FF01-FF5E)
		assert.strictEqual(strings.isFullWidthCharacter('Ａ'.charCodeAt(0)), true, 'Ａ U+FF21 fullwidth A');
		assert.strictEqual(strings.isFullWidthCharacter('？'.charCodeAt(0)), true, '？ U+FF1F fullwidth question mark');
		assert.strictEqual(strings.isFullWidthCharacter('＃'.charCodeAt(0)), true, '＃ U+FF03 fullwidth number sign');
		assert.strictEqual(strings.isFullWidthCharacter('＝'.charCodeAt(0)), true, '＝ U+FF1D fullwidth equals sign');

		// Hiragana (3040-309F)
		assert.strictEqual(strings.isFullWidthCharacter('あ'.charCodeAt(0)), true, 'あ U+3042 hiragana');

		// Fullwidth symbols (FFE0-FFE6)
		assert.strictEqual(strings.isFullWidthCharacter('￥'.charCodeAt(0)), true, '￥ U+FFE5 fullwidth yen sign');

		// Regular ASCII should not be full width
		assert.strictEqual(strings.isFullWidthCharacter('A'.charCodeAt(0)), false, 'A regular ASCII');
		assert.strictEqual(strings.isFullWidthCharacter('?'.charCodeAt(0)), false, '? regular ASCII');
	});

	test('isBasicASCII', () => {
		function assertIsBasicASCII(str: string, expected: boolean): void {
			assert.strictEqual(strings.isBasicASCII(str), expected, str + ` (${str.charCodeAt(0)})`);
		}
		assertIsBasicASCII('abcdefghijklmnopqrstuvwxyz', true);
		assertIsBasicASCII('ABCDEFGHIJKLMNOPQRSTUVWXYZ', true);
		assertIsBasicASCII('1234567890', true);
		assertIsBasicASCII('`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?', true);
		assertIsBasicASCII(' ', true);
		assertIsBasicASCII('\t', true);
		assertIsBasicASCII('\n', true);
		assertIsBasicASCII('\r', true);

		let ALL = '\r\t\n';
		for (let i = 32; i < 127; i++) {
			ALL += String.fromCharCode(i);
		}
		assertIsBasicASCII(ALL, true);

		assertIsBasicASCII(String.fromCharCode(31), false);
		assertIsBasicASCII(String.fromCharCode(127), false);
		assertIsBasicASCII('ü', false);
		assertIsBasicASCII('a📚📚b', false);
	});

	test('createRegExp', () => {
		// Empty
		assert.throws(() => strings.createRegExp('', false));

		// Escapes appropriately
		assert.strictEqual(strings.createRegExp('abc', false).source, 'abc');
		assert.strictEqual(strings.createRegExp('([^ ,.]*)', false).source, '\\(\\[\\^ ,\\.\\]\\*\\)');
		assert.strictEqual(strings.createRegExp('([^ ,.]*)', true).source, '([^ ,.]*)');

		// Whole word
		assert.strictEqual(strings.createRegExp('abc', false, { wholeWord: true }).source, '\\babc\\b');
		assert.strictEqual(strings.createRegExp('abc', true, { wholeWord: true }).source, '\\babc\\b');
		assert.strictEqual(strings.createRegExp(' abc', true, { wholeWord: true }).source, ' abc\\b');
		assert.strictEqual(strings.createRegExp('abc ', true, { wholeWord: true }).source, '\\babc ');
		assert.strictEqual(strings.createRegExp(' abc ', true, { wholeWord: true }).source, ' abc ');

		const regExpWithoutFlags = strings.createRegExp('abc', true);
		assert(!regExpWithoutFlags.global);
		assert(regExpWithoutFlags.ignoreCase);
		assert(!regExpWithoutFlags.multiline);

		const regExpWithFlags = strings.createRegExp('abc', true, { global: true, matchCase: true, multiline: true });
		assert(regExpWithFlags.global);
		assert(!regExpWithFlags.ignoreCase);
		assert(regExpWithFlags.multiline);
	});

	test('getLeadingWhitespace', () => {
		assert.strictEqual(strings.getLeadingWhitespace('  foo'), '  ');
		assert.strictEqual(strings.getLeadingWhitespace('  foo', 2), '');
		assert.strictEqual(strings.getLeadingWhitespace('  foo', 1, 1), '');
		assert.strictEqual(strings.getLeadingWhitespace('  foo', 0, 1), ' ');
		assert.strictEqual(strings.getLeadingWhitespace('  '), '  ');
		assert.strictEqual(strings.getLeadingWhitespace('  ', 1), ' ');
		assert.strictEqual(strings.getLeadingWhitespace('  ', 0, 1), ' ');
		assert.strictEqual(strings.getLeadingWhitespace('\t\tfunction foo(){', 0, 1), '\t');
		assert.strictEqual(strings.getLeadingWhitespace('\t\tfunction foo(){', 0, 2), '\t\t');
	});

	test('fuzzyContains', () => {
		assert.ok(!strings.fuzzyContains((undefined)!, null!));
		assert.ok(strings.fuzzyContains('hello world', 'h'));
		assert.ok(!strings.fuzzyContains('hello world', 'q'));
		assert.ok(strings.fuzzyContains('hello world', 'hw'));
		assert.ok(strings.fuzzyContains('hello world', 'horl'));
		assert.ok(strings.fuzzyContains('hello world', 'd'));
		assert.ok(!strings.fuzzyContains('hello world', 'wh'));
		assert.ok(!strings.fuzzyContains('d', 'dd'));
	});

	test('startsWithUTF8BOM', () => {
		assert(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER));
		assert(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER + 'a'));
		assert(strings.startsWithUTF8BOM(strings.UTF8_BOM_CHARACTER + 'aaaaaaaaaa'));
		assert(!strings.startsWithUTF8BOM(' ' + strings.UTF8_BOM_CHARACTER));
		assert(!strings.startsWithUTF8BOM('foo'));
		assert(!strings.startsWithUTF8BOM(''));
	});

	test('stripUTF8BOM', () => {
		assert.strictEqual(strings.stripUTF8BOM(strings.UTF8_BOM_CHARACTER), '');
		assert.strictEqual(strings.stripUTF8BOM(strings.UTF8_BOM_CHARACTER + 'foobar'), 'foobar');
		assert.strictEqual(strings.stripUTF8BOM('foobar' + strings.UTF8_BOM_CHARACTER), 'foobar' + strings.UTF8_BOM_CHARACTER);
		assert.strictEqual(strings.stripUTF8BOM('abc'), 'abc');
		assert.strictEqual(strings.stripUTF8BOM(''), '');
	});

	test('containsUppercaseCharacter', () => {
		[
			[null, false],
			['', false],
			['foo', false],
			['föö', false],
			['ناك', false],
			['מבוססת', false],
			['😀', false],
			['(#@()*&%()@*#&09827340982374}{:">?></\'\\~`', false],

			['Foo', true],
			['FOO', true],
			['FöÖ', true],
			['FöÖ', true],
			['\\Foo', true],
		].forEach(([str, result]) => {
			assert.strictEqual(strings.containsUppercaseCharacter(<string>str), result, `Wrong result for ${str}`);
		});
	});

	test('containsUppercaseCharacter (ignoreEscapedChars)', () => {
		[
			['\\Woo', false],
			['f\\S\\S', false],
			['foo', false],

			['Foo', true],
		].forEach(([str, result]) => {
			assert.strictEqual(strings.containsUppercaseCharacter(<string>str, true), result, `Wrong result for ${str}`);
		});
	});

	test('uppercaseFirstLetter', () => {
		[
			['', ''],
			['foo', 'Foo'],
			['f', 'F'],
			['123', '123'],
			['.a', '.a'],
		].forEach(([inStr, result]) => {
			assert.strictEqual(strings.uppercaseFirstLetter(inStr), result, `Wrong result for ${inStr}`);
		});
	});

	test('getNLines', () => {
		assert.strictEqual(strings.getNLines('', 5), '');
		assert.strictEqual(strings.getNLines('foo', 5), 'foo');
		assert.strictEqual(strings.getNLines('foo\nbar', 5), 'foo\nbar');
		assert.strictEqual(strings.getNLines('foo\nbar', 2), 'foo\nbar');

		assert.strictEqual(strings.getNLines('foo\nbar', 1), 'foo');
		assert.strictEqual(strings.getNLines('foo\nbar'), 'foo');
		assert.strictEqual(strings.getNLines('foo\nbar\nsomething', 2), 'foo\nbar');
		assert.strictEqual(strings.getNLines('foo', 0), '');
	});

	test('getGraphemeBreakType', () => {
		assert.strictEqual(strings.getGraphemeBreakType(0xBC1), strings.GraphemeBreakType.SpacingMark);
	});

	test('truncate', () => {
		assert.strictEqual('hello world', strings.truncate('hello world', 100));
		assert.strictEqual('hello…', strings.truncate('hello world', 5));
	});

	test('truncateMiddle', () => {
		assert.strictEqual('hello world', strings.truncateMiddle('hello world', 100));
		assert.strictEqual('he…ld', strings.truncateMiddle('hello world', 5));
	});

	test('replaceAsync', async () => {
		let i = 0;
		assert.strictEqual(await strings.replaceAsync('abcabcabcabc', /b(.)/g, async (match, after) => {
			assert.strictEqual(match, 'bc');
			assert.strictEqual(after, 'c');
			return `${i++}${after}`;
		}), 'a0ca1ca2ca3c');
	});

	suite('removeAnsiEscapeCodes', () => {
		function testSequence(sequence: string) {
			assert.strictEqual(strings.removeAnsiEscapeCodes(`hello${sequence}world`), 'helloworld', `expect to remove ${JSON.stringify(sequence)}`);
			assert.deepStrictEqual(
				[...strings.forAnsiStringParts(`hello${sequence}world`)],
				[{ isCode: false, str: 'hello' }, { isCode: true, str: sequence }, { isCode: false, str: 'world' }],
				`expect to forAnsiStringParts ${JSON.stringify(sequence)}`
			);
		}

		test('CSI sequences', () => {
			const CSI = '\x1b[';
			const sequences = [
				// Base cases from https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Functions-using-CSI-_-ordered-by-the-final-character_s_
				`${CSI}42@`,
				`${CSI}42 @`,
				`${CSI}42A`,
				`${CSI}42 A`,
				`${CSI}42B`,
				`${CSI}42C`,
				`${CSI}42D`,
				`${CSI}42E`,
				`${CSI}42F`,
				`${CSI}42G`,
				`${CSI}42;42H`,
				`${CSI}42I`,
				`${CSI}42J`,
				`${CSI}?42J`,
				`${CSI}42K`,
				`${CSI}?42K`,
				`${CSI}42L`,
				`${CSI}42M`,
				`${CSI}42P`,
				`${CSI}#P`,
				`${CSI}3#P`,
				`${CSI}#Q`,
				`${CSI}3#Q`,
				`${CSI}#R`,
				`${CSI}42S`,
				`${CSI}?1;2;3S`,
				`${CSI}42T`,
				`${CSI}42;42;42;42;42T`,
				`${CSI}>3T`,
				`${CSI}42X`,
				`${CSI}42Z`,
				`${CSI}42^`,
				`${CSI}42\``,
				`${CSI}42a`,
				`${CSI}42b`,
				`${CSI}42c`,
				`${CSI}=42c`,
				`${CSI}>42c`,
				`${CSI}42d`,
				`${CSI}42e`,
				`${CSI}42;42f`,
				`${CSI}42g`,
				`${CSI}3h`,
				`${CSI}?3h`,
				`${CSI}42i`,
				`${CSI}?42i`,
				`${CSI}3l`,
				`${CSI}?3l`,
				`${CSI}3m`,
				`${CSI}>0;0m`,
				`${CSI}>0m`,
				`${CSI}?0m`,
				`${CSI}42n`,
				`${CSI}>42n`,
				`${CSI}?42n`,
				`${CSI}>42p`,
				`${CSI}!p`,
				`${CSI}0;0"p`,
				`${CSI}42$p`,
				`${CSI}?42$p`,
				`${CSI}#p`,
				`${CSI}3#p`,
				`${CSI}>42q`,
				`${CSI}42q`,
				`${CSI}42 q`,
				`${CSI}42"q`,
				`${CSI}#q`,
				`${CSI}42;42r`,
				`${CSI}?3r`,
				`${CSI}0;0;0;0;3$r`,
				`${CSI}s`,
				`${CSI}0;0s`,
				`${CSI}>42s`,
				`${CSI}?3s`,
				`${CSI}42;42;42t`,
				`${CSI}>3t`,
				`${CSI}42 t`,
				`${CSI}0;0;0;0;3$t`,
				`${CSI}u`,
				`${CSI}42 u`,
				`${CSI}0;0;0;0;0;0;0;0$v`,
				`${CSI}42$w`,
				`${CSI}0;0;0;0'w`,
				`${CSI}42x`,
				`${CSI}42*x`,
				`${CSI}0;0;0;0;0$x`,
				`${CSI}42#y`,
				`${CSI}0;0;0;0;0;0*y`,
				`${CSI}42;0'z`,
				`${CSI}0;1;2;4$z`,
				`${CSI}3'{`,
				`${CSI}#{`,
				`${CSI}3#{`,
				`${CSI}0;0;0;0\${`,
				`${CSI}0;0;0;0#|`,
				`${CSI}42$|`,
				`${CSI}42'|`,
				`${CSI}42*|`,
				`${CSI}#}`,
				`${CSI}42'}`,
				`${CSI}42$}`,
				`${CSI}42'~`,
				`${CSI}42$~`,

				// Common SGR cases:
				`${CSI}1;31m`, // multiple attrs
				`${CSI}105m`, // bright background
				`${CSI}48:5:128m`, // 256 indexed color
				`${CSI}48;5;128m`, // 256 indexed color alt
				`${CSI}38:2:0:255:255:255m`, // truecolor
				`${CSI}38;2;255;255;255m`, // truecolor alt
			];

			for (const sequence of sequences) {
				testSequence(sequence);
			}
		});

		suite('OSC sequences', () => {
			function testOscSequence(prefix: string, suffix: string) {
				const sequenceContent = [
					`633;SetMark;`,
					`633;P;Cwd=/foo`,
					`7;file://local/Users/me/foo/bar`
				];

				const sequences = [];
				for (const content of sequenceContent) {
					sequences.push(`${prefix}${content}${suffix}`);
				}
				for (const sequence of sequences) {
					testSequence(sequence);
				}
			}
			test('ESC ] Ps ; Pt ESC \\', () => {
				testOscSequence('\x1b]', '\x1b\\');
			});
			test('ESC ] Ps ; Pt BEL', () => {
				testOscSequence('\x1b]', '\x07');
			});
			test('ESC ] Ps ; Pt ST', () => {
				testOscSequence('\x1b]', '\x9c');
			});
			test('OSC Ps ; Pt ESC \\', () => {
				testOscSequence('\x9d', '\x1b\\');
			});
			test('OSC Ps ; Pt BEL', () => {
				testOscSequence('\x9d', '\x07');
			});
			test('OSC Ps ; Pt ST', () => {
				testOscSequence('\x9d', '\x9c');
			});
		});

		test('ESC sequences', () => {
			const sequenceContent = [
				` F`,
				` G`,
				` L`,
				` M`,
				` N`,
				`#3`,
				`#4`,
				`#5`,
				`#6`,
				`#8`,
				`%@`,
				`%G`,
				`(C`,
				`)C`,
				`*C`,
				`+C`,
				`-C`,
				`.C`,
				`/C`
			];
			const sequences = [];
			for (const content of sequenceContent) {
				sequences.push(`\x1b${content}`);
			}
			for (const sequence of sequences) {
				testSequence(sequence);
			}
		});

		suite('regression tests', () => {
			test('#209937', () => {
				assert.strictEqual(
					strings.removeAnsiEscapeCodes(`localhost:\x1b[31m1234`),
					'localhost:1234'
				);
			});
		});
	});

	test('removeAnsiEscapeCodesFromPrompt', () => {
		assert.strictEqual(strings.removeAnsiEscapeCodesFromPrompt('\u001b[31m$ \u001b[0m'), '$ ');
		assert.strictEqual(strings.removeAnsiEscapeCodesFromPrompt('\n\\[\u001b[01;34m\\]\\w\\[\u001b[00m\\]\n\\[\u001b[1;32m\\]> \\[\u001b[0m\\]'), '\n\\w\n> ');
	});

	test('count', () => {
		assert.strictEqual(strings.count('hello world', 'o'), 2);
		assert.strictEqual(strings.count('hello world', 'l'), 3);
		assert.strictEqual(strings.count('hello world', 'z'), 0);
		assert.strictEqual(strings.count('hello world', 'hello'), 1);
		assert.strictEqual(strings.count('hello world', 'world'), 1);
		assert.strictEqual(strings.count('hello world', 'hello world'), 1);
		assert.strictEqual(strings.count('hello world', 'foo'), 0);
	});

	test('containsAmbiguousCharacter', () => {
		assert.strictEqual(strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter('abcd'), false);
		assert.strictEqual(strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter('üå'), false);
		assert.strictEqual(strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter('(*&^)'), false);

		assert.strictEqual(strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter('ο'), true);
		assert.strictEqual(strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter('abɡc'), true);
	});

	test('containsInvisibleCharacter', () => {
		assert.strictEqual(strings.InvisibleCharacters.containsInvisibleCharacter('abcd'), false);
		assert.strictEqual(strings.InvisibleCharacters.containsInvisibleCharacter(' '), true);
		assert.strictEqual(strings.InvisibleCharacters.containsInvisibleCharacter('a\u{e004e}b'), true);
		assert.strictEqual(strings.InvisibleCharacters.containsInvisibleCharacter('a\u{e015a}\u000bb'), true);
	});

	test('multibyteAwareBtoa', () => {
		assert.ok(strings.multibyteAwareBtoa('hello world').length > 0);
		assert.ok(strings.multibyteAwareBtoa('平仮名').length > 0);
		assert.ok(strings.multibyteAwareBtoa(new Array(100000).fill('vs').join('')).length > 0); // https://github.com/microsoft/vscode/issues/112013
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

test('htmlAttributeEncodeValue', () => {
	assert.strictEqual(strings.htmlAttributeEncodeValue(''), '');
	assert.strictEqual(strings.htmlAttributeEncodeValue('abc'), 'abc');
	assert.strictEqual(strings.htmlAttributeEncodeValue('<script>alert("Hello")</script>'), '&lt;script&gt;alert(&quot;Hello&quot;)&lt;/script&gt;');
	assert.strictEqual(strings.htmlAttributeEncodeValue('Hello & World'), 'Hello &amp; World');
	assert.strictEqual(strings.htmlAttributeEncodeValue('"Hello"'), '&quot;Hello&quot;');
	assert.strictEqual(strings.htmlAttributeEncodeValue('\'Hello\''), '&apos;Hello&apos;');
	assert.strictEqual(strings.htmlAttributeEncodeValue('<>&\'"'), '&lt;&gt;&amp;&apos;&quot;');
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/ternarySearchtree.test.ts]---
Location: vscode-main/src/vs/base/test/common/ternarySearchtree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { shuffle } from '../../common/arrays.js';
import { randomPath } from '../../common/extpath.js';
import { StopWatch } from '../../common/stopwatch.js';
import { ConfigKeysIterator, PathIterator, StringIterator, TernarySearchTree, UriIterator } from '../../common/ternarySearchTree.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Ternary Search Tree', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('PathIterator', () => {
		const iter = new PathIterator();
		iter.reset('file:///usr/bin/file.txt');

		assert.strictEqual(iter.value(), 'file:');
		assert.strictEqual(iter.hasNext(), true);
		assert.strictEqual(iter.cmp('file:'), 0);
		assert.ok(iter.cmp('a') < 0);
		assert.ok(iter.cmp('aile:') < 0);
		assert.ok(iter.cmp('z') > 0);
		assert.ok(iter.cmp('zile:') > 0);

		iter.next();
		assert.strictEqual(iter.value(), 'usr');
		assert.strictEqual(iter.hasNext(), true);

		iter.next();
		assert.strictEqual(iter.value(), 'bin');
		assert.strictEqual(iter.hasNext(), true);

		iter.next();
		assert.strictEqual(iter.value(), 'file.txt');
		assert.strictEqual(iter.hasNext(), false);

		iter.next();
		assert.strictEqual(iter.value(), '');
		assert.strictEqual(iter.hasNext(), false);
		iter.next();
		assert.strictEqual(iter.value(), '');
		assert.strictEqual(iter.hasNext(), false);

		//
		iter.reset('/foo/bar/');
		assert.strictEqual(iter.value(), 'foo');
		assert.strictEqual(iter.hasNext(), true);

		iter.next();
		assert.strictEqual(iter.value(), 'bar');
		assert.strictEqual(iter.hasNext(), false);
	});

	test('URIIterator', function () {
		const iter = new UriIterator(() => false, () => false);
		iter.reset(URI.parse('file:///usr/bin/file.txt'));

		assert.strictEqual(iter.value(), 'file');
		// assert.strictEqual(iter.cmp('FILE'), 0);
		assert.strictEqual(iter.cmp('file'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'usr');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'bin');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'file.txt');
		assert.strictEqual(iter.hasNext(), false);


		iter.reset(URI.parse('file://share/usr/bin/file.txt?foo'));

		// scheme
		assert.strictEqual(iter.value(), 'file');
		// assert.strictEqual(iter.cmp('FILE'), 0);
		assert.strictEqual(iter.cmp('file'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// authority
		assert.strictEqual(iter.value(), 'share');
		assert.strictEqual(iter.cmp('SHARe'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'usr');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'bin');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'file.txt');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// query
		assert.strictEqual(iter.value(), 'foo');
		assert.strictEqual(iter.cmp('z') > 0, true);
		assert.strictEqual(iter.cmp('a') < 0, true);
		assert.strictEqual(iter.hasNext(), false);
	});

	test('URIIterator - ignore query/fragment', function () {
		const iter = new UriIterator(() => false, () => true);
		iter.reset(URI.parse('file:///usr/bin/file.txt'));

		assert.strictEqual(iter.value(), 'file');
		// assert.strictEqual(iter.cmp('FILE'), 0);
		assert.strictEqual(iter.cmp('file'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'usr');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'bin');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		assert.strictEqual(iter.value(), 'file.txt');
		assert.strictEqual(iter.hasNext(), false);


		iter.reset(URI.parse('file://share/usr/bin/file.txt?foo'));

		// scheme
		assert.strictEqual(iter.value(), 'file');
		// assert.strictEqual(iter.cmp('FILE'), 0);
		assert.strictEqual(iter.cmp('file'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// authority
		assert.strictEqual(iter.value(), 'share');
		assert.strictEqual(iter.cmp('SHARe'), 0);
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'usr');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'bin');
		assert.strictEqual(iter.hasNext(), true);
		iter.next();

		// path
		assert.strictEqual(iter.value(), 'file.txt');
		assert.strictEqual(iter.hasNext(), false);
	});

	function assertTstDfs<E>(trie: TernarySearchTree<string, E>, ...elements: [string, E][]) {

		assert.ok(trie._isBalanced(), 'TST is not balanced');

		let i = 0;
		for (const [key, value] of trie) {
			const expected = elements[i++];
			assert.ok(expected);
			assert.strictEqual(key, expected[0]);
			assert.strictEqual(value, expected[1]);
		}

		assert.strictEqual(i, elements.length);

		const map = new Map<string, E>();
		for (const [key, value] of elements) {
			map.set(key, value);
		}
		map.forEach((value, key) => {
			assert.strictEqual(trie.get(key), value);
		});

		// forEach
		let forEachCount = 0;
		trie.forEach((element, key) => {
			assert.strictEqual(element, map.get(key));
			forEachCount++;
		});
		assert.strictEqual(map.size, forEachCount);

		// iterator
		let iterCount = 0;
		for (const [key, value] of trie) {
			assert.strictEqual(value, map.get(key));
			iterCount++;
		}
		assert.strictEqual(map.size, iterCount);

	}

	test('TernarySearchTree - set', function () {

		let trie = TernarySearchTree.forStrings<number>();
		trie.set('foobar', 1);
		trie.set('foobaz', 2);

		assertTstDfs(trie, ['foobar', 1], ['foobaz', 2]); // longer

		trie = TernarySearchTree.forStrings<number>();
		trie.set('foobar', 1);
		trie.set('fooba', 2);
		assertTstDfs(trie, ['fooba', 2], ['foobar', 1]); // shorter

		trie = TernarySearchTree.forStrings<number>();
		trie.set('foo', 1);
		trie.set('foo', 2);
		assertTstDfs(trie, ['foo', 2]);

		trie = TernarySearchTree.forStrings<number>();
		trie.set('foo', 1);
		trie.set('foobar', 2);
		trie.set('bar', 3);
		trie.set('foob', 4);
		trie.set('bazz', 5);

		assertTstDfs(trie,
			['bar', 3],
			['bazz', 5],
			['foo', 1],
			['foob', 4],
			['foobar', 2],
		);
	});

	test('TernarySearchTree - set w/ undefined', function () {

		const trie = TernarySearchTree.forStrings<any>();
		trie.set('foobar', undefined);
		trie.set('foobaz', 2);

		assert.strictEqual(trie.get('foobar'), undefined);
		assert.strictEqual(trie.get('foobaz'), 2);
		assert.strictEqual(trie.get('NOT HERE'), undefined);

		assert.ok(trie.has('foobaz'));
		assert.ok(trie.has('foobar'));
		assert.ok(!trie.has('NOT HERE'));

		assertTstDfs(trie, ['foobar', undefined], ['foobaz', 2]); // should check for undefined value

		const oldValue = trie.set('foobar', 3);
		assert.strictEqual(oldValue, undefined);
		assert.strictEqual(trie.get('foobar'), 3);
	});

	test('TernarySearchTree - findLongestMatch', function () {

		const trie = TernarySearchTree.forStrings<number>();
		trie.set('foo', 1);
		trie.set('foobar', 2);
		trie.set('foobaz', 3);
		assertTstDfs(trie, ['foo', 1], ['foobar', 2], ['foobaz', 3]);

		assert.strictEqual(trie.findSubstr('f'), undefined);
		assert.strictEqual(trie.findSubstr('z'), undefined);
		assert.strictEqual(trie.findSubstr('foo'), 1);
		assert.strictEqual(trie.findSubstr('fooö'), 1);
		assert.strictEqual(trie.findSubstr('fooba'), 1);
		assert.strictEqual(trie.findSubstr('foobarr'), 2);
		assert.strictEqual(trie.findSubstr('foobazrr'), 3);
	});

	test('TernarySearchTree - basics', function () {
		const trie = new TernarySearchTree<string, number>(new StringIterator());

		trie.set('foo', 1);
		trie.set('bar', 2);
		trie.set('foobar', 3);
		assertTstDfs(trie, ['bar', 2], ['foo', 1], ['foobar', 3]);

		assert.strictEqual(trie.get('foo'), 1);
		assert.strictEqual(trie.get('bar'), 2);
		assert.strictEqual(trie.get('foobar'), 3);
		assert.strictEqual(trie.get('foobaz'), undefined);
		assert.strictEqual(trie.get('foobarr'), undefined);

		assert.strictEqual(trie.findSubstr('fo'), undefined);
		assert.strictEqual(trie.findSubstr('foo'), 1);
		assert.strictEqual(trie.findSubstr('foooo'), 1);


		trie.delete('foobar');
		trie.delete('bar');
		assert.strictEqual(trie.get('foobar'), undefined);
		assert.strictEqual(trie.get('bar'), undefined);

		trie.set('foobar', 17);
		trie.set('barr', 18);
		assert.strictEqual(trie.get('foobar'), 17);
		assert.strictEqual(trie.get('barr'), 18);
		assert.strictEqual(trie.get('bar'), undefined);
	});

	test('TernarySearchTree - delete & cleanup', function () {
		// normal delete
		let trie = new TernarySearchTree<string, number>(new StringIterator());
		trie.set('foo', 1);
		trie.set('foobar', 2);
		trie.set('bar', 3);
		assertTstDfs(trie, ['bar', 3], ['foo', 1], ['foobar', 2]);
		trie.delete('foo');
		assertTstDfs(trie, ['bar', 3], ['foobar', 2]);
		trie.delete('foobar');
		assertTstDfs(trie, ['bar', 3]);

		// superstr-delete
		trie = new TernarySearchTree<string, number>(new StringIterator());
		trie.set('foo', 1);
		trie.set('foobar', 2);
		trie.set('bar', 3);
		trie.set('foobarbaz', 4);
		trie.deleteSuperstr('foo');
		assertTstDfs(trie, ['bar', 3], ['foo', 1]);

		trie = new TernarySearchTree<string, number>(new StringIterator());
		trie.set('foo', 1);
		trie.set('foobar', 2);
		trie.set('bar', 3);
		trie.set('foobarbaz', 4);
		trie.deleteSuperstr('fo');
		assertTstDfs(trie, ['bar', 3]);

		// trie = new TernarySearchTree<string, number>(new StringIterator());
		// trie.set('foo', 1);
		// trie.set('foobar', 2);
		// trie.set('bar', 3);
		// trie.deleteSuperStr('f');
		// assertTernarySearchTree(trie, ['bar', 3]);
	});

	test('TernarySearchTree (PathSegments) - basics', function () {
		const trie = new TernarySearchTree<string, number>(new PathIterator());

		trie.set('/user/foo/bar', 1);
		trie.set('/user/foo', 2);
		trie.set('/user/foo/flip/flop', 3);

		assert.strictEqual(trie.get('/user/foo/bar'), 1);
		assert.strictEqual(trie.get('/user/foo'), 2);
		assert.strictEqual(trie.get('/user//foo'), 2);
		assert.strictEqual(trie.get('/user\\foo'), 2);
		assert.strictEqual(trie.get('/user/foo/flip/flop'), 3);

		assert.strictEqual(trie.findSubstr('/user/bar'), undefined);
		assert.strictEqual(trie.findSubstr('/user/foo'), 2);
		assert.strictEqual(trie.findSubstr('\\user\\foo'), 2);
		assert.strictEqual(trie.findSubstr('/user//foo'), 2);
		assert.strictEqual(trie.findSubstr('/user/foo/ba'), 2);
		assert.strictEqual(trie.findSubstr('/user/foo/far/boo'), 2);
		assert.strictEqual(trie.findSubstr('/user/foo/bar'), 1);
		assert.strictEqual(trie.findSubstr('/user/foo/bar/far/boo'), 1);
	});

	test('TernarySearchTree - (AVL) set', function () {
		{
			// rotate left
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/fileA', 1);
			trie.set('/fileB', 2);
			trie.set('/fileC', 3);
			assertTstDfs(trie, ['/fileA', 1], ['/fileB', 2], ['/fileC', 3]);
		}

		{
			// rotate left (inside middle)
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/foo/fileA', 1);
			trie.set('/foo/fileB', 2);
			trie.set('/foo/fileC', 3);
			assertTstDfs(trie, ['/foo/fileA', 1], ['/foo/fileB', 2], ['/foo/fileC', 3]);
		}

		{
			// rotate right
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/fileC', 3);
			trie.set('/fileB', 2);
			trie.set('/fileA', 1);
			assertTstDfs(trie, ['/fileA', 1], ['/fileB', 2], ['/fileC', 3]);
		}

		{
			// rotate right (inside middle)
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/mid/fileC', 3);
			trie.set('/mid/fileB', 2);
			trie.set('/mid/fileA', 1);
			assertTstDfs(trie, ['/mid/fileA', 1], ['/mid/fileB', 2], ['/mid/fileC', 3]);
		}

		{
			// rotate right, left
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/fileD', 7);
			trie.set('/fileB', 2);
			trie.set('/fileG', 42);
			trie.set('/fileF', 24);
			trie.set('/fileZ', 73);
			trie.set('/fileE', 15);
			assertTstDfs(trie, ['/fileB', 2], ['/fileD', 7], ['/fileE', 15], ['/fileF', 24], ['/fileG', 42], ['/fileZ', 73]);
		}

		{
			// rotate left, right
			const trie = new TernarySearchTree<string, number>(new PathIterator());
			trie.set('/fileJ', 42);
			trie.set('/fileZ', 73);
			trie.set('/fileE', 15);
			trie.set('/fileB', 2);
			trie.set('/fileF', 7);
			trie.set('/fileG', 1);
			assertTstDfs(trie, ['/fileB', 2], ['/fileE', 15], ['/fileF', 7], ['/fileG', 1], ['/fileJ', 42], ['/fileZ', 73]);
		}
	});

	test('TernarySearchTree - (BST) delete', function () {

		const trie = new TernarySearchTree<string, number>(new StringIterator());

		// delete root
		trie.set('d', 1);
		assertTstDfs(trie, ['d', 1]);
		trie.delete('d');
		assertTstDfs(trie);

		// delete node with two element
		trie.clear();
		trie.set('d', 1);
		trie.set('b', 1);
		trie.set('f', 1);
		assertTstDfs(trie, ['b', 1], ['d', 1], ['f', 1]);
		trie.delete('d');
		assertTstDfs(trie, ['b', 1], ['f', 1]);

		// single child node
		trie.clear();
		trie.set('d', 1);
		trie.set('b', 1);
		trie.set('f', 1);
		trie.set('e', 1);
		assertTstDfs(trie, ['b', 1], ['d', 1], ['e', 1], ['f', 1]);
		trie.delete('f');
		assertTstDfs(trie, ['b', 1], ['d', 1], ['e', 1]);
	});

	test('TernarySearchTree - (AVL) delete', function () {

		const trie = new TernarySearchTree<string, number>(new StringIterator());

		trie.clear();
		trie.set('d', 1);
		trie.set('b', 1);
		trie.set('f', 1);
		trie.set('e', 1);
		trie.set('z', 1);
		assertTstDfs(trie, ['b', 1], ['d', 1], ['e', 1], ['f', 1], ['z', 1]);

		// right, right
		trie.delete('b');
		assertTstDfs(trie, ['d', 1], ['e', 1], ['f', 1], ['z', 1]);

		trie.clear();
		trie.set('d', 1);
		trie.set('c', 1);
		trie.set('f', 1);
		trie.set('a', 1);
		trie.set('b', 1);
		assertTstDfs(trie, ['a', 1], ['b', 1], ['c', 1], ['d', 1], ['f', 1]);

		// left, left
		trie.delete('f');
		assertTstDfs(trie, ['a', 1], ['b', 1], ['c', 1], ['d', 1]);

		// mid
		trie.clear();
		trie.set('a', 1);
		trie.set('ad', 1);
		trie.set('ab', 1);
		trie.set('af', 1);
		trie.set('ae', 1);
		trie.set('az', 1);
		assertTstDfs(trie, ['a', 1], ['ab', 1], ['ad', 1], ['ae', 1], ['af', 1], ['az', 1]);

		trie.delete('ab');
		assertTstDfs(trie, ['a', 1], ['ad', 1], ['ae', 1], ['af', 1], ['az', 1]);

		trie.delete('a');
		assertTstDfs(trie, ['ad', 1], ['ae', 1], ['af', 1], ['az', 1]);
	});

	test('TernarySearchTree: Cannot read property \'1\' of undefined #138284', function () {

		const keys = [
			URI.parse('fake-fs:/C'),
			URI.parse('fake-fs:/A'),
			URI.parse('fake-fs:/D'),
			URI.parse('fake-fs:/B'),
		];

		const tst = TernarySearchTree.forUris<boolean>();

		for (const item of keys) {
			tst.set(item, true);
		}

		assert.ok(tst._isBalanced());
		tst.delete(keys[0]);
		assert.ok(tst._isBalanced());
	});

	test('TernarySearchTree: Cannot read property \'1\' of undefined #138284 (simple)', function () {

		const keys = ['C', 'A', 'D', 'B',];
		const tst = TernarySearchTree.forStrings<boolean>();
		for (const item of keys) {
			tst.set(item, true);
		}
		assertTstDfs(tst, ['A', true], ['B', true], ['C', true], ['D', true]);

		tst.delete(keys[0]);
		assertTstDfs(tst, ['A', true], ['B', true], ['D', true]);

		{
			const tst = TernarySearchTree.forStrings<boolean>();
			tst.set('C', true);
			tst.set('A', true);
			tst.set('B', true);
			assertTstDfs(tst, ['A', true], ['B', true], ['C', true]);
		}

	});

	test('TernarySearchTree: Cannot read property \'1\' of undefined #138284 (random)', function () {
		for (let round = 10; round >= 0; round--) {
			const keys: URI[] = [];
			for (let i = 0; i < 100; i++) {
				keys.push(URI.from({ scheme: 'fake-fs', path: randomPath(undefined, undefined, 10) }));
			}
			const tst = TernarySearchTree.forUris<boolean>();

			try {
				for (const item of keys) {
					tst.set(item, true);
					assert.ok(tst._isBalanced(), `SET${item}|${keys.map(String).join()}`);
				}

				for (const item of keys) {
					tst.delete(item);
					assert.ok(tst._isBalanced(), `DEL${item}|${keys.map(String).join()}`);
				}
			} catch (err) {
				assert.ok(false, `FAILED with keys: ${keys.map(String).join()}`);
			}
		}
	});

	test('https://github.com/microsoft/vscode/issues/227147', function () {

		const raw = `fake-fs:CAOnRvUuxO,fake-fs:1qcbfq54rg,fake-fs:UtDstYUQ56,fake-fs:d5ktqDysll,fake-fs:w5NSAKA4Ch,fake-fs:QcIIIY6WHX,fake-fs:WCedQu9Ogd,fake-fs:cKUC5LunBr,fake-fs:XrIIYjI3HB,fake-fs:xgTkoneFzF,fake-fs:QYkCVx2nYC,fake-fs:ePrIDEKEpJ,fake-fs:nrOPYCW81a,fake-fs:MQbkFLcDsA,fake-fs:wXG8YiOrBI,fake-fs:4tHTWi240D,fake-fs:5uQWjgZGGJ,fake-fs:famP6pZXyx,fake-fs:aB9sUhwP1J,fake-fs:DlS0CssyhG,fake-fs:9vK2k3rL2V,fake-fs:iqWeu7zF6t,fake-fs:8vC6bQX2WH,fake-fs:nFILXMQTRg,fake-fs:miiV72aajE,fake-fs:9VRbqvaw0q,fake-fs:WnEHS1arfZ,fake-fs:Fco75PJ5pM,fake-fs:6CsEpoZ7VW,fake-fs:B2PrCtDpWu,fake-fs:y8Hi94Oekg,fake-fs:wyEjPNa5lo,fake-fs:zw1Ljv0erc,fake-fs:y4KWPUOMx0,fake-fs:1basrPTlTp,fake-fs:5iErr4YM34,fake-fs:Q2TQaujh8Q,fake-fs:QxcYzNNxZw,fake-fs:3QUDHjU55a,fake-fs:23ymf9ggMV,fake-fs:qQhuKFdy29,fake-fs:JuwmxA33oJ,fake-fs:NQeUyfMNUo,fake-fs:2Vo3eR1jxM,fake-fs:NzUXQidwel,fake-fs:aESYKGPxIx,fake-fs:mxLdeJartN,fake-fs:PhSd2xLwVe,fake-fs:9nmWjUUMRz,fake-fs:Wc6a4RsGhn,fake-fs:5a0AlFHALQ,fake-fs:Q93jnNZBxJ,fake-fs:4CuVkbfPSG,fake-fs:mdFlJ7WQva,fake-fs:fgVsaRm1KG,fake-fs:P7UXWiRJYj,fake-fs:q6nz5Q9BEW,fake-fs:1UZmGkvNTn,fake-fs:AKY8cnUQFl,fake-fs:RezYuPU7FD,fake-fs:5zaYc72Bit,fake-fs:yh8FTxFfQq,fake-fs:ayNPgEuc2q,fake-fs:EdOb27cRhF,fake-fs:h4c2uNyI4l,fake-fs:BhzOLNL4JO,fake-fs:HVPTdAMWpS,fake-fs:7K7IlacaZe,fake-fs:iUKJonC5eq,fake-fs:Y9E3NX3eJD,fake-fs:66h80uK32I,fake-fs:gFXpry1Y09,fake-fs:qOqvvXPcu4,fake-fs:UbbLn2NFSJ,fake-fs:TzJ07HsAGz,fake-fs:nQngmvgx4m,fake-fs:6bZQCR8epb,fake-fs:xb3SJKX1bi,fake-fs:GF3DPK4zDj,fake-fs:HmxgAqEegt,fake-fs:yT2OAMQYal,fake-fs:MiVX4VYXHk,fake-fs:QMbsUbjJTI,fake-fs:KzAbDNsmPc,fake-fs:m6CGOwOcdT,fake-fs:0cyHx9zsA3,fake-fs:SIwjWfFLSY,fake-fs:uZSDXCEqLY,fake-fs:HuoTL3nK7k,fake-fs:oyoejYE0CI,fake-fs:56WLhiCxbz,fake-fs:SqYOi0z5sM,fake-fs:LZq3ei28Ez,fake-fs:pTc4pCtwk8,fake-fs:AAJSFf0RHS,fake-fs:up6EHkEbO9,fake-fs:GB1Pesdnxd,fake-fs:Oyvq4Z96S4,fake-fs:rYXrhklgf6,fake-fs:g1HdUkQziH`;
		const keys: URI[] = raw.split(',').map(value => URI.parse(value, true));


		const tst = TernarySearchTree.forUris<boolean>();
		for (const item of keys) {
			tst.set(item, true);
			assert.ok(tst._isBalanced(), `SET${item}|${keys.map(String).join()}`);
		}

		const lengthNow = Array.from(tst).length;
		assert.strictEqual(lengthNow, keys.length);

		const keys2 = keys.slice(0);

		for (const [index, item] of keys.entries()) {
			tst.delete(item);
			assert.ok(tst._isBalanced(), `DEL${item}|${keys.map(String).join()}`);

			const idx = keys2.indexOf(item);
			assert.ok(idx >= 0);
			keys2.splice(idx, 1);

			const actualKeys = Array.from(tst).map(value => value[0]);

			assert.strictEqual(
				actualKeys.length,
				keys2.length,
				`FAILED with ${index} -> ${item.toString()}\nWANTED:${keys2.map(String).sort().join()}\nACTUAL:${actualKeys.map(String).sort().join()}`
			);
		}

		assert.strictEqual(Array.from(tst).length, 0);
	});

	test('TernarySearchTree: Cannot read properties of undefined (reading \'length\'): #161618 (simple)', function () {
		const raw = 'config.debug.toolBarLocation,floating,config.editor.renderControlCharacters,true,config.editor.renderWhitespace,selection,config.files.autoSave,off,config.git.enabled,true,config.notebook.globalToolbar,true,config.terminal.integrated.tabs.enabled,true,config.terminal.integrated.tabs.showActions,singleTerminalOrNarrow,config.terminal.integrated.tabs.showActiveTerminal,singleTerminalOrNarrow,config.workbench.activityBar.visible,true,config.workbench.experimental.settingsProfiles.enabled,true,config.workbench.layoutControl.type,both,config.workbench.sideBar.location,left,config.workbench.statusBar.visible,true';
		const array = raw.split(',');
		const tuples: [string, string][] = [];
		for (let i = 0; i < array.length; i += 2) {
			tuples.push([array[i], array[i + 1]]);
		}

		const map = TernarySearchTree.forConfigKeys<string>();
		map.fill(tuples);

		assert.strictEqual([...map].join(), raw);
		assert.ok(map.has('config.editor.renderWhitespace'));

		const len = [...map].length;
		map.delete('config.editor.renderWhitespace');
		assert.ok(map._isBalanced());
		assert.strictEqual([...map].length, len - 1);
	});

	test('TernarySearchTree: Cannot read properties of undefined (reading \'length\'): #161618 (random)', function () {
		const raw = 'config.debug.toolBarLocation,floating,config.editor.renderControlCharacters,true,config.editor.renderWhitespace,selection,config.files.autoSave,off,config.git.enabled,true,config.notebook.globalToolbar,true,config.terminal.integrated.tabs.enabled,true,config.terminal.integrated.tabs.showActions,singleTerminalOrNarrow,config.terminal.integrated.tabs.showActiveTerminal,singleTerminalOrNarrow,config.workbench.activityBar.visible,true,config.workbench.experimental.settingsProfiles.enabled,true,config.workbench.layoutControl.type,both,config.workbench.sideBar.location,left,config.workbench.statusBar.visible,true';
		const array = raw.split(',');
		const tuples: [string, string][] = [];
		for (let i = 0; i < array.length; i += 2) {
			tuples.push([array[i], array[i + 1]]);
		}

		for (let round = 100; round >= 0; round--) {
			shuffle(tuples);
			const map = TernarySearchTree.forConfigKeys<string>();
			map.fill(tuples);

			assert.strictEqual([...map].join(), raw);
			assert.ok(map.has('config.editor.renderWhitespace'));

			const len = [...map].length;
			map.delete('config.editor.renderWhitespace');
			assert.ok(map._isBalanced());
			assert.strictEqual([...map].length, len - 1);
		}
	});

	test('TernarySearchTree (PathSegments) - lookup', function () {

		const map = new TernarySearchTree<string, number>(new PathIterator());
		map.set('/user/foo/bar', 1);
		map.set('/user/foo', 2);
		map.set('/user/foo/flip/flop', 3);

		assert.strictEqual(map.get('/foo'), undefined);
		assert.strictEqual(map.get('/user'), undefined);
		assert.strictEqual(map.get('/user/foo'), 2);
		assert.strictEqual(map.get('/user/foo/bar'), 1);
		assert.strictEqual(map.get('/user/foo/bar/boo'), undefined);
	});

	test('TernarySearchTree (PathSegments) - superstr', function () {

		const map = new TernarySearchTree<string, number>(new PathIterator());
		map.set('/user/foo/bar', 1);
		map.set('/user/foo', 2);
		map.set('/user/foo/flip/flop', 3);
		map.set('/usr/foo', 4);

		let item: IteratorResult<[string, number]>;
		let iter = map.findSuperstr('/user');

		item = iter!.next();
		assert.strictEqual(item.value[1], 2);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value[1], 1);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value[1], 3);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		iter = map.findSuperstr('/usr');
		item = iter!.next();
		assert.strictEqual(item.value[1], 4);
		assert.strictEqual(item.done, false);

		item = iter!.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		assert.strictEqual(map.findSuperstr('/not'), undefined);
		assert.strictEqual(map.findSuperstr('/us'), undefined);
		assert.strictEqual(map.findSuperstr('/usrr'), undefined);
		assert.strictEqual(map.findSuperstr('/userr'), undefined);
	});


	test('TernarySearchTree (PathSegments) - delete_superstr', function () {

		const map = new TernarySearchTree<string, number>(new PathIterator());
		map.set('/user/foo/bar', 1);
		map.set('/user/foo', 2);
		map.set('/user/foo/flip/flop', 3);
		map.set('/usr/foo', 4);

		assertTstDfs(map,
			['/user/foo', 2],
			['/user/foo/bar', 1],
			['/user/foo/flip/flop', 3],
			['/usr/foo', 4],
		);

		// not a segment
		map.deleteSuperstr('/user/fo');
		assertTstDfs(map,
			['/user/foo', 2],
			['/user/foo/bar', 1],
			['/user/foo/flip/flop', 3],
			['/usr/foo', 4],
		);

		// delete a segment
		map.set('/user/foo/bar', 1);
		map.set('/user/foo', 2);
		map.set('/user/foo/flip/flop', 3);
		map.set('/usr/foo', 4);
		map.deleteSuperstr('/user/foo');
		assertTstDfs(map,
			['/user/foo', 2],
			['/usr/foo', 4],
		);
	});

	test('TernarySearchTree (URI) - basics', function () {
		const trie = new TernarySearchTree<URI, number>(new UriIterator(() => false, () => false));

		trie.set(URI.file('/user/foo/bar'), 1);
		trie.set(URI.file('/user/foo'), 2);
		trie.set(URI.file('/user/foo/flip/flop'), 3);

		assert.strictEqual(trie.get(URI.file('/user/foo/bar')), 1);
		assert.strictEqual(trie.get(URI.file('/user/foo')), 2);
		assert.strictEqual(trie.get(URI.file('/user/foo/flip/flop')), 3);

		assert.strictEqual(trie.findSubstr(URI.file('/user/bar')), undefined);
		assert.strictEqual(trie.findSubstr(URI.file('/user/foo')), 2);
		assert.strictEqual(trie.findSubstr(URI.file('/user/foo/ba')), 2);
		assert.strictEqual(trie.findSubstr(URI.file('/user/foo/far/boo')), 2);
		assert.strictEqual(trie.findSubstr(URI.file('/user/foo/bar')), 1);
		assert.strictEqual(trie.findSubstr(URI.file('/user/foo/bar/far/boo')), 1);
	});

	test('TernarySearchTree (URI) - query parameters', function () {
		const trie = new TernarySearchTree<URI, number>(new UriIterator(() => false, () => true));
		const root = URI.parse('memfs:/?param=1');
		trie.set(root, 1);

		assert.strictEqual(trie.get(URI.parse('memfs:/?param=1')), 1);

		assert.strictEqual(trie.findSubstr(URI.parse('memfs:/?param=1')), 1);
		assert.strictEqual(trie.findSubstr(URI.parse('memfs:/aaa?param=1')), 1);
	});

	test('TernarySearchTree (URI) - lookup', function () {

		const map = new TernarySearchTree<URI, number>(new UriIterator(() => false, () => false));
		map.set(URI.parse('http://foo.bar/user/foo/bar'), 1);
		map.set(URI.parse('http://foo.bar/user/foo?query'), 2);
		map.set(URI.parse('http://foo.bar/user/foo?QUERY'), 3);
		map.set(URI.parse('http://foo.bar/user/foo/flip/flop'), 3);

		assert.strictEqual(map.get(URI.parse('http://foo.bar/foo')), undefined);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user')), undefined);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user/foo/bar')), 1);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user/foo?query')), 2);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user/foo?Query')), undefined);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user/foo?QUERY')), 3);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/user/foo/bar/boo')), undefined);
	});

	test('TernarySearchTree (URI) - lookup, casing', function () {

		const map = new TernarySearchTree<URI, number>(new UriIterator(uri => /^https?$/.test(uri.scheme), () => false));
		map.set(URI.parse('http://foo.bar/user/foo/bar'), 1);
		assert.strictEqual(map.get(URI.parse('http://foo.bar/USER/foo/bar')), 1);

		map.set(URI.parse('foo://foo.bar/user/foo/bar'), 1);
		assert.strictEqual(map.get(URI.parse('foo://foo.bar/USER/foo/bar')), undefined);
	});

	test('TernarySearchTree (URI) - superstr', function () {

		const map = new TernarySearchTree<URI, number>(new UriIterator(() => false, () => false));
		map.set(URI.file('/user/foo/bar'), 1);
		map.set(URI.file('/user/foo'), 2);
		map.set(URI.file('/user/foo/flip/flop'), 3);
		map.set(URI.file('/usr/foo'), 4);

		let item: IteratorResult<[URI, number]>;
		let iter = map.findSuperstr(URI.file('/user'))!;

		item = iter.next();
		assert.strictEqual(item.value[1], 2);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value[1], 1);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value[1], 3);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		iter = map.findSuperstr(URI.file('/usr'))!;
		item = iter.next();
		assert.strictEqual(item.value[1], 4);
		assert.strictEqual(item.done, false);

		item = iter.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		iter = map.findSuperstr(URI.file('/'))!;
		item = iter.next();
		assert.strictEqual(item.value[1], 2);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value[1], 1);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value[1], 3);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value[1], 4);
		assert.strictEqual(item.done, false);
		item = iter.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		assert.strictEqual(map.findSuperstr(URI.file('/not')), undefined);
		assert.strictEqual(map.findSuperstr(URI.file('/us')), undefined);
		assert.strictEqual(map.findSuperstr(URI.file('/usrr')), undefined);
		assert.strictEqual(map.findSuperstr(URI.file('/userr')), undefined);
	});

	test('TernarySearchTree (ConfigKeySegments) - basics', function () {
		const trie = new TernarySearchTree<string, number>(new ConfigKeysIterator());

		trie.set('config.foo.bar', 1);
		trie.set('config.foo', 2);
		trie.set('config.foo.flip.flop', 3);

		assert.strictEqual(trie.get('config.foo.bar'), 1);
		assert.strictEqual(trie.get('config.foo'), 2);
		assert.strictEqual(trie.get('config.foo.flip.flop'), 3);

		assert.strictEqual(trie.findSubstr('config.bar'), undefined);
		assert.strictEqual(trie.findSubstr('config.foo'), 2);
		assert.strictEqual(trie.findSubstr('config.foo.ba'), 2);
		assert.strictEqual(trie.findSubstr('config.foo.far.boo'), 2);
		assert.strictEqual(trie.findSubstr('config.foo.bar'), 1);
		assert.strictEqual(trie.findSubstr('config.foo.bar.far.boo'), 1);
	});

	test('TernarySearchTree (ConfigKeySegments) - lookup', function () {

		const map = new TernarySearchTree<string, number>(new ConfigKeysIterator());
		map.set('config.foo.bar', 1);
		map.set('config.foo', 2);
		map.set('config.foo.flip.flop', 3);

		assert.strictEqual(map.get('foo'), undefined);
		assert.strictEqual(map.get('config'), undefined);
		assert.strictEqual(map.get('config.foo'), 2);
		assert.strictEqual(map.get('config.foo.bar'), 1);
		assert.strictEqual(map.get('config.foo.bar.boo'), undefined);
	});

	test('TernarySearchTree (ConfigKeySegments) - superstr', function () {

		const map = new TernarySearchTree<string, number>(new ConfigKeysIterator());
		map.set('config.foo.bar', 1);
		map.set('config.foo', 2);
		map.set('config.foo.flip.flop', 3);
		map.set('boo', 4);

		let item: IteratorResult<[string, number]>;
		const iter = map.findSuperstr('config');

		item = iter!.next();
		assert.strictEqual(item.value[1], 2);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value[1], 1);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value[1], 3);
		assert.strictEqual(item.done, false);
		item = iter!.next();
		assert.strictEqual(item.value, undefined);
		assert.strictEqual(item.done, true);

		assert.strictEqual(map.findSuperstr('foo'), undefined);
		assert.strictEqual(map.findSuperstr('config.foo.no'), undefined);
		assert.strictEqual(map.findSuperstr('config.foop'), undefined);
	});


	test('TernarySearchTree (ConfigKeySegments) - delete_superstr', function () {

		const map = new TernarySearchTree<string, number>(new ConfigKeysIterator());
		map.set('config.foo.bar', 1);
		map.set('config.foo', 2);
		map.set('config.foo.flip.flop', 3);
		map.set('boo', 4);

		assertTstDfs(map,
			['boo', 4],
			['config.foo', 2],
			['config.foo.bar', 1],
			['config.foo.flip.flop', 3],
		);

		// not a segment
		map.deleteSuperstr('config.fo');
		assertTstDfs(map,
			['boo', 4],
			['config.foo', 2],
			['config.foo.bar', 1],
			['config.foo.flip.flop', 3],
		);

		// delete a segment
		map.set('config.foo.bar', 1);
		map.set('config.foo', 2);
		map.set('config.foo.flip.flop', 3);
		map.set('config.boo', 4);
		map.deleteSuperstr('config.foo');
		assertTstDfs(map,
			['boo', 4],
			['config.foo', 2],
		);
	});

	test('TST, fill', function () {
		const tst = TernarySearchTree.forStrings();

		const keys = ['foo', 'bar', 'bang', 'bazz'];
		Object.freeze(keys);
		tst.fill(true, keys);

		for (const key of keys) {
			assert.ok(tst.get(key), key);
		}
	});
});


suite.skip('TST, perf', function () {

	function createRandomUris(n: number): URI[] {
		const uris: URI[] = [];
		function randomWord(): string {
			let result = '';
			const length = 4 + Math.floor(Math.random() * 4);
			for (let i = 0; i < length; i++) {
				result += (Math.random() * 26 + 65).toString(36);
			}
			return result;
		}

		// generate 10000 random words
		const words: string[] = [];
		for (let i = 0; i < 10000; i++) {
			words.push(randomWord());
		}

		for (let i = 0; i < n; i++) {

			let len = 4 + Math.floor(Math.random() * 4);

			const segments: string[] = [];
			for (; len >= 0; len--) {
				segments.push(words[Math.floor(Math.random() * words.length)]);
			}

			uris.push(URI.from({ scheme: 'file', path: segments.join('/') }));
		}

		return uris;
	}

	let tree: TernarySearchTree<URI, boolean>;
	let sampleUris: URI[] = [];
	let candidates: URI[] = [];

	suiteSetup(() => {
		const len = 50_000;
		sampleUris = createRandomUris(len);
		candidates = [...sampleUris.slice(0, len / 2), ...createRandomUris(len / 2)];
		shuffle(candidates);
	});

	setup(() => {
		tree = TernarySearchTree.forUris();
		for (const uri of sampleUris) {
			tree.set(uri, true);
		}
	});

	const _profile = false;

	function perfTest(name: string, callback: Function) {
		test(name, function () {
			if (_profile) { console.profile(name); }
			const sw = new StopWatch();
			callback();
			console.log(name, sw.elapsed());
			if (_profile) { console.profileEnd(); }
		});
	}

	perfTest('TST, clear', function () {
		tree.clear();
	});

	perfTest('TST, insert', function () {
		const insertTree = TernarySearchTree.forUris();
		for (const uri of sampleUris) {
			insertTree.set(uri, true);
		}
	});

	perfTest('TST, lookup', function () {
		let match = 0;
		for (const candidate of candidates) {
			if (tree.has(candidate)) {
				match += 1;
			}
		}
		assert.strictEqual(match, sampleUris.length / 2);
	});

	perfTest('TST, substr', function () {
		let match = 0;
		for (const candidate of candidates) {
			if (tree.findSubstr(candidate)) {
				match += 1;
			}
		}
		assert.strictEqual(match, sampleUris.length / 2);
	});

	perfTest('TST, superstr', function () {
		for (const candidate of candidates) {
			tree.findSuperstr(candidate);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/testUtils.ts]---
Location: vscode-main/src/vs/base/test/common/testUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export function flakySuite(title: string, fn: () => void) /* Suite */ {
	return suite(title, function () {

		// Flaky suites need retries and timeout to complete
		// e.g. because they access browser features which can
		// be unreliable depending on the environment.
		this.retries(3);
		this.timeout(1000 * 20);

		// Invoke suite ensuring that `this` is
		// properly wired in.
		fn.call(this);
	});
}

/**
 * (pseudo)Random boolean generator.
 *
 * ## Examples
 *
 * ```typescript
 * randomBoolean(); // generates either `true` or `false`
 * ```
 *
 */
export const randomBoolean = (): boolean => {
	return Math.random() > 0.5;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/tfIdf.test.ts]---
Location: vscode-main/src/vs/base/test/common/tfIdf.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../common/cancellation.js';
import { TfIdfCalculator, TfIdfDocument, TfIdfScore } from '../../common/tfIdf.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

/**
 * Generates all permutations of an array.
 *
 * This is useful for testing to make sure order does not effect the result.
 */
function permutate<T>(arr: T[]): T[][] {
	if (arr.length === 0) {
		return [[]];
	}

	const result: T[][] = [];

	for (let i = 0; i < arr.length; i++) {
		const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
		const permutationsRest = permutate(rest);
		for (let j = 0; j < permutationsRest.length; j++) {
			result.push([arr[i], ...permutationsRest[j]]);
		}
	}

	return result;
}

function assertScoreOrdersEqual(actualScores: TfIdfScore[], expectedScoreKeys: string[]): void {
	actualScores.sort((a, b) => (b.score - a.score) || a.key.localeCompare(b.key));
	assert.strictEqual(actualScores.length, expectedScoreKeys.length);
	for (let i = 0; i < expectedScoreKeys.length; i++) {
		assert.strictEqual(actualScores[i].key, expectedScoreKeys[i]);
	}
}

suite('TF-IDF Calculator', function () {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('Should return no scores when no documents are given', () => {
		const tfidf = new TfIdfCalculator();
		const scores = tfidf.calculateScores('something', CancellationToken.None);
		assertScoreOrdersEqual(scores, []);
	});

	test('Should return no scores for term not in document', () => {
		const tfidf = new TfIdfCalculator().updateDocuments([
			makeDocument('A', 'cat dog fish'),
		]);
		const scores = tfidf.calculateScores('elepant', CancellationToken.None);
		assertScoreOrdersEqual(scores, []);
	});

	test('Should return scores for document with exact match', () => {
		for (const docs of permutate([
			makeDocument('A', 'cat dog cat'),
			makeDocument('B', 'cat fish'),
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('dog', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['A']);
		}
	});

	test('Should return document with more matches first', () => {
		for (const docs of permutate([
			makeDocument('/A', 'cat dog cat'),
			makeDocument('/B', 'cat fish'),
			makeDocument('/C', 'frog'),
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('cat', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/B']);
		}
	});

	test('Should return document with more matches first when term appears in all documents', () => {
		for (const docs of permutate([
			makeDocument('/A', 'cat dog cat cat'),
			makeDocument('/B', 'cat fish'),
			makeDocument('/C', 'frog cat cat'),
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('cat', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/C', '/B']);
		}
	});

	test('Should weigh less common term higher', () => {
		for (const docs of permutate([
			makeDocument('/A', 'cat dog cat'),
			makeDocument('/B', 'fish'),
			makeDocument('/C', 'cat cat cat cat'),
			makeDocument('/D', 'cat fish')
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('cat the dog', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/C', '/D']);
		}
	});

	test('Should weigh chunks with less common terms higher', () => {
		for (const docs of permutate([
			makeDocument('/A', ['cat dog cat', 'fish']),
			makeDocument('/B', ['cat cat cat cat dog', 'dog'])
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('cat', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/B', '/A']);
		}

		for (const docs of permutate([
			makeDocument('/A', ['cat dog cat', 'fish']),
			makeDocument('/B', ['cat cat cat cat dog', 'dog'])
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('dog', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/B', '/B']);
		}

		for (const docs of permutate([
			makeDocument('/A', ['cat dog cat', 'fish']),
			makeDocument('/B', ['cat cat cat cat dog', 'dog'])
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('cat the dog', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/B', '/A', '/B']);
		}

		for (const docs of permutate([
			makeDocument('/A', ['cat dog cat', 'fish']),
			makeDocument('/B', ['cat cat cat cat dog', 'dog'])
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('lake fish', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A']);
		}
	});

	test('Should ignore case and punctuation', () => {
		for (const docs of permutate([
			makeDocument('/A', 'Cat doG.cat'),
			makeDocument('/B', 'cAt fiSH'),
			makeDocument('/C', 'frOg'),
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('. ,CaT!  ', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/B']);
		}
	});

	test('Should match on camelCase words', () => {
		for (const docs of permutate([
			makeDocument('/A', 'catDog cat'),
			makeDocument('/B', 'fishCatFish'),
			makeDocument('/C', 'frogcat'),
		])) {
			const tfidf = new TfIdfCalculator().updateDocuments(docs);
			const scores = tfidf.calculateScores('catDOG', CancellationToken.None);
			assertScoreOrdersEqual(scores, ['/A', '/B']);
		}
	});

	test('Should not match document after delete', () => {
		const docA = makeDocument('/A', 'cat dog cat');
		const docB = makeDocument('/B', 'cat fish');
		const docC = makeDocument('/C', 'frog');

		const tfidf = new TfIdfCalculator().updateDocuments([docA, docB, docC]);
		let scores = tfidf.calculateScores('cat', CancellationToken.None);
		assertScoreOrdersEqual(scores, ['/A', '/B']);

		tfidf.deleteDocument(docA.key);
		scores = tfidf.calculateScores('cat', CancellationToken.None);
		assertScoreOrdersEqual(scores, ['/B']);

		tfidf.deleteDocument(docC.key);
		scores = tfidf.calculateScores('cat', CancellationToken.None);
		assertScoreOrdersEqual(scores, ['/B']);

		tfidf.deleteDocument(docB.key);
		scores = tfidf.calculateScores('cat', CancellationToken.None);
		assertScoreOrdersEqual(scores, []);
	});
});

function makeDocument(key: string, content: string | string[]): TfIdfDocument {
	return {
		key,
		textChunks: Array.isArray(content) ? content : [content],
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/timeTravelScheduler.ts]---
Location: vscode-main/src/vs/base/test/common/timeTravelScheduler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, numberComparator, tieBreakComparators } from '../../common/arrays.js';
import { Emitter, Event } from '../../common/event.js';
import { Disposable, IDisposable } from '../../common/lifecycle.js';
import { setTimeout0, setTimeout0IsFaster } from '../../common/platform.js';

export type TimeOffset = number;

export interface Scheduler {
	schedule(task: ScheduledTask): IDisposable;
	get now(): TimeOffset;
}

export interface ScheduledTask {
	readonly time: TimeOffset;
	readonly source: ScheduledTaskSource;

	run(): void;
}

export interface ScheduledTaskSource {
	toString(): string;
	readonly stackTrace: string | undefined;
}

interface ExtendedScheduledTask extends ScheduledTask {
	id: number;
}

const scheduledTaskComparator = tieBreakComparators<ExtendedScheduledTask>(
	compareBy(i => i.time, numberComparator),
	compareBy(i => i.id, numberComparator),
);

export class TimeTravelScheduler implements Scheduler {
	private taskCounter = 0;
	private _nowMs: TimeOffset = 0;
	private readonly queue: PriorityQueue<ExtendedScheduledTask> = new SimplePriorityQueue<ExtendedScheduledTask>([], scheduledTaskComparator);

	private readonly taskScheduledEmitter = new Emitter<{ task: ScheduledTask }>();
	public readonly onTaskScheduled = this.taskScheduledEmitter.event;

	constructor(startTimeMs: number) {
		this._nowMs = startTimeMs;
	}

	schedule(task: ScheduledTask): IDisposable {
		if (task.time < this._nowMs) {
			throw new Error(`Scheduled time (${task.time}) must be equal to or greater than the current time (${this._nowMs}).`);
		}
		const extendedTask: ExtendedScheduledTask = { ...task, id: this.taskCounter++ };
		this.queue.add(extendedTask);
		this.taskScheduledEmitter.fire({ task });
		return { dispose: () => this.queue.remove(extendedTask) };
	}

	get now(): TimeOffset {
		return this._nowMs;
	}

	get hasScheduledTasks(): boolean {
		return this.queue.length > 0;
	}

	getScheduledTasks(): readonly ScheduledTask[] {
		return this.queue.toSortedArray();
	}

	runNext(): ScheduledTask | undefined {
		const task = this.queue.removeMin();
		if (task) {
			this._nowMs = task.time;
			task.run();
		}

		return task;
	}

	installGlobally(): IDisposable {
		return overwriteGlobals(this);
	}
}

export class AsyncSchedulerProcessor extends Disposable {
	private isProcessing = false;
	private readonly _history = new Array<ScheduledTask>();
	public get history(): readonly ScheduledTask[] { return this._history; }

	private readonly maxTaskCount: number;
	private readonly useSetImmediate: boolean;

	private readonly queueEmptyEmitter = new Emitter<void>();
	public readonly onTaskQueueEmpty = this.queueEmptyEmitter.event;

	private lastError: Error | undefined;

	constructor(private readonly scheduler: TimeTravelScheduler, options?: { useSetImmediate?: boolean; maxTaskCount?: number }) {
		super();

		this.maxTaskCount = options && options.maxTaskCount ? options.maxTaskCount : 100;
		this.useSetImmediate = options && options.useSetImmediate ? options.useSetImmediate : false;

		this._register(scheduler.onTaskScheduled(() => {
			if (this.isProcessing) {
				return;
			} else {
				this.isProcessing = true;
				this.schedule();
			}
		}));
	}

	private schedule() {
		// This allows promises created by a previous task to settle and schedule tasks before the next task is run.
		// Tasks scheduled in those promises might have to run before the current next task.
		Promise.resolve().then(() => {
			if (this.useSetImmediate) {
				originalGlobalValues.setImmediate(() => this.process());
			} else if (setTimeout0IsFaster) {
				setTimeout0(() => this.process());
			} else {
				originalGlobalValues.setTimeout(() => this.process());
			}
		});
	}

	private process() {
		const executedTask = this.scheduler.runNext();
		if (executedTask) {
			this._history.push(executedTask);

			if (this.history.length >= this.maxTaskCount && this.scheduler.hasScheduledTasks) {
				const lastTasks = this._history.slice(Math.max(0, this.history.length - 10)).map(h => `${h.source.toString()}: ${h.source.stackTrace}`);
				const e = new Error(`Queue did not get empty after processing ${this.history.length} items. These are the last ${lastTasks.length} scheduled tasks:\n${lastTasks.join('\n\n\n')}`);
				this.lastError = e;
				throw e;
			}
		}

		if (this.scheduler.hasScheduledTasks) {
			this.schedule();
		} else {
			this.isProcessing = false;
			this.queueEmptyEmitter.fire();
		}
	}

	waitForEmptyQueue(): Promise<void> {
		if (this.lastError) {
			const error = this.lastError;
			this.lastError = undefined;
			throw error;
		}
		if (!this.isProcessing) {
			return Promise.resolve();
		} else {
			return Event.toPromise(this.onTaskQueueEmpty).then(() => {
				if (this.lastError) {
					throw this.lastError;
				}
			});
		}
	}
}


export async function runWithFakedTimers<T>(options: { startTime?: number; useFakeTimers?: boolean; useSetImmediate?: boolean; maxTaskCount?: number }, fn: () => Promise<T>): Promise<T> {
	const useFakeTimers = options.useFakeTimers === undefined ? true : options.useFakeTimers;
	if (!useFakeTimers) {
		return fn();
	}

	const scheduler = new TimeTravelScheduler(options.startTime ?? 0);
	const schedulerProcessor = new AsyncSchedulerProcessor(scheduler, { useSetImmediate: options.useSetImmediate, maxTaskCount: options.maxTaskCount });
	const globalInstallDisposable = scheduler.installGlobally();

	let didThrow = true;
	let result: T;
	try {
		result = await fn();
		didThrow = false;
	} finally {
		globalInstallDisposable.dispose();

		try {
			if (!didThrow) {
				// We process the remaining scheduled tasks.
				// The global override is no longer active, so during this, no more tasks will be scheduled.
				await schedulerProcessor.waitForEmptyQueue();
			}
		} finally {
			schedulerProcessor.dispose();
		}
	}

	return result;
}

export const originalGlobalValues = {
	setTimeout: globalThis.setTimeout.bind(globalThis),
	clearTimeout: globalThis.clearTimeout.bind(globalThis),
	setInterval: globalThis.setInterval.bind(globalThis),
	clearInterval: globalThis.clearInterval.bind(globalThis),
	setImmediate: globalThis.setImmediate?.bind(globalThis),
	clearImmediate: globalThis.clearImmediate?.bind(globalThis),
	requestAnimationFrame: globalThis.requestAnimationFrame?.bind(globalThis),
	cancelAnimationFrame: globalThis.cancelAnimationFrame?.bind(globalThis),
	Date: globalThis.Date,
};

function setTimeout(scheduler: Scheduler, handler: TimerHandler, timeout: number = 0): IDisposable {
	if (typeof handler === 'string') {
		throw new Error('String handler args should not be used and are not supported');
	}

	return scheduler.schedule({
		time: scheduler.now + timeout,
		run: () => {
			handler();
		},
		source: {
			toString() { return 'setTimeout'; },
			stackTrace: new Error().stack,
		}
	});
}

function setInterval(scheduler: Scheduler, handler: TimerHandler, interval: number): IDisposable {
	if (typeof handler === 'string') {
		throw new Error('String handler args should not be used and are not supported');
	}
	const validatedHandler = handler;

	let iterCount = 0;
	const stackTrace = new Error().stack;

	let disposed = false;
	let lastDisposable: IDisposable;

	function schedule(): void {
		iterCount++;
		const curIter = iterCount;
		lastDisposable = scheduler.schedule({
			time: scheduler.now + interval,
			run() {
				if (!disposed) {
					schedule();
					validatedHandler();
				}
			},
			source: {
				toString() { return `setInterval (iteration ${curIter})`; },
				stackTrace,
			}
		});
	}

	schedule();

	return {
		dispose: () => {
			if (disposed) {
				return;
			}
			disposed = true;
			lastDisposable.dispose();
		}
	};
}

function overwriteGlobals(scheduler: Scheduler): IDisposable {
	// eslint-disable-next-line local/code-no-any-casts
	globalThis.setTimeout = ((handler: TimerHandler, timeout?: number) => setTimeout(scheduler, handler, timeout)) as any;
	globalThis.clearTimeout = (timeoutId: any) => {
		if (typeof timeoutId === 'object' && timeoutId && 'dispose' in timeoutId) {
			timeoutId.dispose();
		} else {
			originalGlobalValues.clearTimeout(timeoutId);
		}
	};

	// eslint-disable-next-line local/code-no-any-casts
	globalThis.setInterval = ((handler: TimerHandler, timeout: number) => setInterval(scheduler, handler, timeout)) as any;
	globalThis.clearInterval = (timeoutId: any) => {
		if (typeof timeoutId === 'object' && timeoutId && 'dispose' in timeoutId) {
			timeoutId.dispose();
		} else {
			originalGlobalValues.clearInterval(timeoutId);
		}
	};

	globalThis.Date = createDateClass(scheduler);

	return {
		dispose: () => {
			Object.assign(globalThis, originalGlobalValues);
		}
	};
}

function createDateClass(scheduler: Scheduler): DateConstructor {
	const OriginalDate = originalGlobalValues.Date;

	function SchedulerDate(this: any, ...args: any): any {
		// the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
		// This remains so in the 10th edition of 2019 as well.
		if (!(this instanceof SchedulerDate)) {
			return new OriginalDate(scheduler.now).toString();
		}

		// if Date is called as a constructor with 'new' keyword
		if (args.length === 0) {
			return new OriginalDate(scheduler.now);
		}
		// eslint-disable-next-line local/code-no-any-casts
		return new (OriginalDate as any)(...args);
	}

	for (const prop in OriginalDate) {
		if (OriginalDate.hasOwnProperty(prop)) {
			// eslint-disable-next-line local/code-no-any-casts
			(SchedulerDate as any)[prop] = (OriginalDate as any)[prop];
		}
	}

	SchedulerDate.now = function now() {
		return scheduler.now;
	};
	SchedulerDate.toString = function toString() {
		return OriginalDate.toString();
	};
	SchedulerDate.prototype = OriginalDate.prototype;
	SchedulerDate.parse = OriginalDate.parse;
	SchedulerDate.UTC = OriginalDate.UTC;
	SchedulerDate.prototype.toUTCString = OriginalDate.prototype.toUTCString;

	// eslint-disable-next-line local/code-no-any-casts
	return SchedulerDate as any;
}

interface PriorityQueue<T> {
	length: number;
	add(value: T): void;
	remove(value: T): void;

	removeMin(): T | undefined;
	toSortedArray(): T[];
}

class SimplePriorityQueue<T> implements PriorityQueue<T> {
	private isSorted = false;
	private items: T[];

	constructor(items: T[], private readonly compare: (a: T, b: T) => number) {
		this.items = items;
	}

	get length(): number {
		return this.items.length;
	}

	add(value: T): void {
		this.items.push(value);
		this.isSorted = false;
	}

	remove(value: T): void {
		const idx = this.items.indexOf(value);
		if (idx !== -1) {
			this.items.splice(idx, 1);
			this.isSorted = false;
		}
	}

	removeMin(): T | undefined {
		this.ensureSorted();
		return this.items.shift();
	}

	getMin(): T | undefined {
		this.ensureSorted();
		return this.items[0];
	}

	toSortedArray(): T[] {
		this.ensureSorted();
		return [...this.items];
	}

	private ensureSorted() {
		if (!this.isSorted) {
			this.items.sort(this.compare);
			this.isSorted = true;
		}
	}
}
```

--------------------------------------------------------------------------------

````

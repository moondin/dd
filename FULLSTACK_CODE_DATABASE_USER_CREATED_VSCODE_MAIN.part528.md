---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 528
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 528 of 552)

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

---[FILE: src/vs/workbench/services/search/test/common/ignoreFile.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/ignoreFile.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IgnoreFile } from '../../common/ignoreFile.js';

function runAssert(input: string, ignoreFile: string, ignoreFileLocation: string, shouldMatch: boolean, traverse: boolean, ignoreCase: boolean) {
	return (prefix: string) => {
		const isDir = input.endsWith('/');
		const rawInput = isDir ? input.slice(0, input.length - 1) : input;

		const matcher = new IgnoreFile(ignoreFile, prefix + ignoreFileLocation, undefined, ignoreCase);
		if (traverse) {
			const traverses = matcher.isPathIncludedInTraversal(prefix + rawInput, isDir);

			if (shouldMatch) {
				assert(traverses, `${ignoreFileLocation}: ${ignoreFile} should traverse ${isDir ? 'dir' : 'file'} ${prefix}${rawInput}`);
			} else {
				assert(!traverses, `${ignoreFileLocation}: ${ignoreFile} should not traverse ${isDir ? 'dir' : 'file'} ${prefix}${rawInput}`);
			}
		}
		else {
			const ignores = matcher.isArbitraryPathIgnored(prefix + rawInput, isDir);

			if (shouldMatch) {
				assert(ignores, `${ignoreFileLocation}: ${ignoreFile} should ignore ${isDir ? 'dir' : 'file'} ${prefix}${rawInput}`);
			} else {
				assert(!ignores, `${ignoreFileLocation}: ${ignoreFile} should not ignore ${isDir ? 'dir' : 'file'} ${prefix}${rawInput}`);
			}
		}
	};
}

function assertNoTraverses(ignoreFile: string, ignoreFileLocation: string, input: string, ignoreCase = false) {
	const runWithPrefix = runAssert(input, ignoreFile, ignoreFileLocation, false, true, ignoreCase);

	runWithPrefix('');
	runWithPrefix('/someFolder');
}

function assertTraverses(ignoreFile: string, ignoreFileLocation: string, input: string, ignoreCase = false) {
	const runWithPrefix = runAssert(input, ignoreFile, ignoreFileLocation, true, true, ignoreCase);

	runWithPrefix('');
	runWithPrefix('/someFolder');
}

function assertIgnoreMatch(ignoreFile: string, ignoreFileLocation: string, input: string, ignoreCase = false) {
	const runWithPrefix = runAssert(input, ignoreFile, ignoreFileLocation, true, false, ignoreCase);

	runWithPrefix('');
	runWithPrefix('/someFolder');
}

function assertNoIgnoreMatch(ignoreFile: string, ignoreFileLocation: string, input: string, ignoreCase = false) {
	const runWithPrefix = runAssert(input, ignoreFile, ignoreFileLocation, false, false, ignoreCase);

	runWithPrefix('');
	runWithPrefix('/someFolder');
}

suite('Parsing .gitignore files', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('paths with trailing slashes do not match files', () => {
		const i = 'node_modules/\n';

		assertNoIgnoreMatch(i, '/', '/node_modules');
		assertIgnoreMatch(i, '/', '/node_modules/');

		assertNoIgnoreMatch(i, '/', '/inner/node_modules');
		assertIgnoreMatch(i, '/', '/inner/node_modules/');
	});

	test('parsing simple gitignore files', () => {
		let i = 'node_modules\nout\n';

		assertIgnoreMatch(i, '/', '/node_modules');
		assertNoTraverses(i, '/', '/node_modules');
		assertIgnoreMatch(i, '/', '/node_modules/file');
		assertIgnoreMatch(i, '/', '/dir/node_modules');
		assertIgnoreMatch(i, '/', '/dir/node_modules/file');

		assertIgnoreMatch(i, '/', '/out');
		assertNoTraverses(i, '/', '/out');
		assertIgnoreMatch(i, '/', '/out/file');
		assertIgnoreMatch(i, '/', '/dir/out');
		assertIgnoreMatch(i, '/', '/dir/out/file');

		i = '/node_modules\n/out\n';

		assertIgnoreMatch(i, '/', '/node_modules');
		assertIgnoreMatch(i, '/', '/node_modules/file');
		assertNoIgnoreMatch(i, '/', '/dir/node_modules');
		assertNoIgnoreMatch(i, '/', '/dir/node_modules/file');

		assertIgnoreMatch(i, '/', '/out');
		assertIgnoreMatch(i, '/', '/out/file');
		assertNoIgnoreMatch(i, '/', '/dir/out');
		assertNoIgnoreMatch(i, '/', '/dir/out/file');

		i = 'node_modules/\nout/\n';

		assertNoIgnoreMatch(i, '/', '/node_modules');
		assertIgnoreMatch(i, '/', '/node_modules/');
		assertIgnoreMatch(i, '/', '/node_modules/file');
		assertIgnoreMatch(i, '/', '/dir/node_modules/');
		assertNoIgnoreMatch(i, '/', '/dir/node_modules');
		assertIgnoreMatch(i, '/', '/dir/node_modules/file');

		assertIgnoreMatch(i, '/', '/out/');
		assertNoIgnoreMatch(i, '/', '/out');
		assertIgnoreMatch(i, '/', '/out/file');
		assertNoIgnoreMatch(i, '/', '/dir/out');
		assertIgnoreMatch(i, '/', '/dir/out/');
		assertIgnoreMatch(i, '/', '/dir/out/file');
	});

	test('parsing files-in-folder exclude', () => {
		let i = 'node_modules/*\n';

		assertNoIgnoreMatch(i, '/', '/node_modules');
		assertNoIgnoreMatch(i, '/', '/node_modules/');
		assertTraverses(i, '/', '/node_modules');
		assertTraverses(i, '/', '/node_modules/');
		assertIgnoreMatch(i, '/', '/node_modules/something');
		assertNoTraverses(i, '/', '/node_modules/something');
		assertIgnoreMatch(i, '/', '/node_modules/something/else');
		assertIgnoreMatch(i, '/', '/node_modules/@types');
		assertNoTraverses(i, '/', '/node_modules/@types');

		i = 'node_modules/**/*\n';

		assertNoIgnoreMatch(i, '/', '/node_modules');
		assertNoIgnoreMatch(i, '/', '/node_modules/');
		assertIgnoreMatch(i, '/', '/node_modules/something');
		assertIgnoreMatch(i, '/', '/node_modules/something/else');
		assertIgnoreMatch(i, '/', '/node_modules/@types');
	});

	test('parsing simple negations', () => {
		let i = 'node_modules/*\n!node_modules/@types\n';

		assertNoIgnoreMatch(i, '/', '/node_modules');
		assertTraverses(i, '/', '/node_modules');

		assertIgnoreMatch(i, '/', '/node_modules/something');
		assertNoTraverses(i, '/', '/node_modules/something');
		assertIgnoreMatch(i, '/', '/node_modules/something/else');

		assertNoIgnoreMatch(i, '/', '/node_modules/@types');
		assertTraverses(i, '/', '/node_modules/@types');
		assertTraverses(i, '/', '/node_modules/@types/boop');

		i = '*.log\n!important.log\n';

		assertIgnoreMatch(i, '/', '/test.log');
		assertIgnoreMatch(i, '/', '/inner/test.log');

		assertNoIgnoreMatch(i, '/', '/important.log');
		assertNoIgnoreMatch(i, '/', '/inner/important.log');

		assertNoTraverses(i, '/', '/test.log');
		assertNoTraverses(i, '/', '/inner/test.log');
		assertTraverses(i, '/', '/important.log');
		assertTraverses(i, '/', '/inner/important.log');
	});

	test('nested .gitignores', () => {
		let i = 'node_modules\nout\n';

		assertIgnoreMatch(i, '/inner/', '/inner/node_modules');
		assertIgnoreMatch(i, '/inner/', '/inner/more/node_modules');


		i = '/node_modules\n/out\n';

		assertIgnoreMatch(i, '/inner/', '/inner/node_modules');
		assertNoIgnoreMatch(i, '/inner/', '/inner/more/node_modules');
		assertNoIgnoreMatch(i, '/inner/', '/node_modules');

		i = 'node_modules/\nout/\n';

		assertNoIgnoreMatch(i, '/inner/', '/inner/node_modules');
		assertIgnoreMatch(i, '/inner/', '/inner/node_modules/');
		assertNoIgnoreMatch(i, '/inner/', '/inner/more/node_modules');
		assertIgnoreMatch(i, '/inner/', '/inner/more/node_modules/');
		assertNoIgnoreMatch(i, '/inner/', '/node_modules');
	});

	test('file extension matches', () => {
		let i = '*.js\n';

		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');

		i = '/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.js');

		i = '**/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/more/myFile.js');

		i = 'inner/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.js');

		i = '/inner/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.js');

		i = '**/inner/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.js');

		i = '**/inner/**/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/more/myFile.js');

		i = '**/more/*.js';
		assertNoIgnoreMatch(i, '/', '/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.ts');
		assertNoIgnoreMatch(i, '/', '/inner/myFile.js');
		assertNoIgnoreMatch(i, '/', '/inner/more/myFile.ts');
		assertIgnoreMatch(i, '/', '/inner/more/myFile.js');
	});

	test('real world example: vscode-js-debug', () => {
		const i = `.cache/
			.profile/
			.cdp-profile/
			.headless-profile/
			.vscode-test/
			.DS_Store
			node_modules/
			out/
			dist
			/coverage
			/.nyc_output
			demos/web-worker/vscode-pwa-dap.log
			demos/web-worker/vscode-pwa-cdp.log
			.dynamic-testWorkspace
			**/test/**/*.actual
			/testWorkspace/web/tmp
			/testWorkspace/**/debug.log
			/testWorkspace/webview/win/true/
			*.cpuprofile`;

		const included = [
			'/distro',

			'/inner/coverage',
			'/inner/.nyc_output',

			'/inner/demos/web-worker/vscode-pwa-dap.log',
			'/inner/demos/web-worker/vscode-pwa-cdp.log',

			'/testWorkspace/webview/win/true',

			'/a/best/b/c.actual',
			'/best/b/c.actual',
		];

		const excluded = [
			'/.profile/',
			'/inner/.profile/',

			'/.DS_Store',
			'/inner/.DS_Store',

			'/coverage',
			'/.nyc_output',

			'/demos/web-worker/vscode-pwa-dap.log',
			'/demos/web-worker/vscode-pwa-cdp.log',

			'/.dynamic-testWorkspace',
			'/inner/.dynamic-testWorkspace',

			'/test/.actual',
			'/test/hello.actual',
			'/a/test/.actual',
			'/a/test/b.actual',
			'/a/test/b/.actual',
			'/a/test/b/c.actual',
			'/a/b/test/.actual',
			'/a/b/test/f/c.actual',

			'/testWorkspace/web/tmp',

			'/testWorkspace/debug.log',
			'/testWorkspace/a/debug.log',
			'/testWorkspace/a/b/debug.log',

			'/testWorkspace/webview/win/true/',

			'/.cpuprofile',
			'/a.cpuprofile',
			'/aa/a.cpuprofile',
			'/aaa/aa/a.cpuprofile',
		];

		for (const include of included) {
			assertNoIgnoreMatch(i, '/', include);
		}

		for (const exclude of excluded) {
			assertIgnoreMatch(i, '/', exclude);
		}
	});

	test('real world example: vscode', () => {
		const i = `.DS_Store
			.cache
			npm-debug.log
			Thumbs.db
			node_modules/
			.build/
			extensions/**/dist/
			/out*/
			/extensions/**/out/
			src/vs/server
			resources/server
			build/node_modules
			coverage/
			test_data/
			test-results/
			yarn-error.log
			vscode.lsif
			vscode.db
			/.profile-oss`;

		const included = [
			'/inner/extensions/dist',
			'/inner/extensions/boop/dist/test',
			'/inner/extensions/boop/doop/dist',
			'/inner/extensions/boop/doop/dist/test',
			'/inner/extensions/boop/doop/dist/test',

			'/inner/extensions/out/test',
			'/inner/extensions/boop/out',
			'/inner/extensions/boop/out/test',

			'/inner/out/',
			'/inner/out/test',
			'/inner/out1/',
			'/inner/out1/test',
			'/inner/out2/',
			'/inner/out2/test',

			'/inner/.profile-oss',

			// Files.
			'/extensions/dist',
			'/extensions/boop/doop/dist',
			'/extensions/boop/out',
		];

		const excluded = [
			'/extensions/dist/',
			'/extensions/boop/dist/test',
			'/extensions/boop/doop/dist/',
			'/extensions/boop/doop/dist/test',
			'/extensions/boop/doop/dist/test',

			'/extensions/out/test',
			'/extensions/boop/out/',
			'/extensions/boop/out/test',

			'/out/',
			'/out/test',
			'/out1/',
			'/out1/test',
			'/out2/',
			'/out2/test',

			'/.profile-oss',
		];

		for (const include of included) {
			assertNoIgnoreMatch(i, '/', include);
		}

		for (const exclude of excluded) {
			assertIgnoreMatch(i, '/', exclude);
		}

	});

	test('various advanced constructs found in popular repos', () => {
		const runTest = ({ pattern, included, excluded }: { pattern: string; included: string[]; excluded: string[] }) => {
			for (const include of included) {
				assertNoIgnoreMatch(pattern, '/', include);
			}

			for (const exclude of excluded) {
				assertIgnoreMatch(pattern, '/', exclude);
			}
		};

		runTest({
			pattern: `**/node_modules
			/packages/*/dist`,

			excluded: [
				'/node_modules',
				'/test/node_modules',
				'/node_modules/test',
				'/test/node_modules/test',

				'/packages/a/dist',
				'/packages/abc/dist',
				'/packages/abc/dist/test',
			],
			included: [
				'/inner/packages/a/dist',
				'/inner/packages/abc/dist',
				'/inner/packages/abc/dist/test',

				'/packages/dist',
				'/packages/dist/test',
				'/packages/a/b/dist',
				'/packages/a/b/dist/test',
			],
		});

		runTest({
			pattern: `.yarn/*
			# !.yarn/cache
			!.yarn/patches
			!.yarn/plugins
			!.yarn/releases
			!.yarn/sdks
			!.yarn/versions`,

			excluded: [
				'/.yarn/test',
				'/.yarn/cache',
			],
			included: [
				'/inner/.yarn/test',
				'/inner/.yarn/cache',

				'/.yarn/patches',
				'/.yarn/plugins',
				'/.yarn/releases',
				'/.yarn/sdks',
				'/.yarn/versions',
			],
		});

		runTest({
			pattern: `[._]*s[a-w][a-z]
			[._]s[a-w][a-z]
			*.un~
			*~`,

			excluded: [
				'/~',
				'/abc~',
				'/inner/~',
				'/inner/abc~',
				'/.un~',
				'/a.un~',
				'/test/.un~',
				'/test/a.un~',
				'/.saa',
				'/....saa',
				'/._._sby',
				'/inner/._._sby',
				'/_swz',
			],
			included: [
				'/.jaa',
			],
		});

		// TODO: the rest of these :)
		runTest({
			pattern: `*.pbxuser
			!default.pbxuser
			*.mode1v3
			!default.mode1v3
			*.mode2v3
			!default.mode2v3
			*.perspectivev3
			!default.perspectivev3`,
			excluded: [],
			included: [],
		});

		runTest({
			pattern: `[Dd]ebug/
			[Dd]ebugPublic/
			[Rr]elease/
			[Rr]eleases/
			*.[Mm]etrics.xml
			[Tt]est[Rr]esult*/
			[Bb]uild[Ll]og.*
			bld/
			[Bb]in/
			[Oo]bj/
			[Ll]og/`,
			excluded: [],
			included: [],
		});

		runTest({
			pattern: `Dockerfile*
			!/tests/bud/*/Dockerfile*
			!/tests/conformance/**/Dockerfile*`,
			excluded: [],
			included: [],
		});

		runTest({
			pattern: `*.pdf
			*.html
			!author_bio.html
			!colo.html
			!copyright.html
			!cover.html
			!ix.html
			!titlepage.html
			!toc.html`,
			excluded: [],
			included: [],
		});

		runTest({
			pattern: `/log/*
			/tmp/*
			!/log/.keep
			!/tmp/.keep`,
			excluded: [],
			included: [],
		});

	});

	test('case-insensitive ignore files', () => {
		const f1 = 'node_modules/\n';
		assertNoIgnoreMatch(f1, '/', '/Node_Modules/', false);
		assertIgnoreMatch(f1, '/', '/Node_Modules/', true);

		const f2 = 'NODE_MODULES/\n';
		assertNoIgnoreMatch(f2, '/', '/Node_Modules/', false);
		assertIgnoreMatch(f2, '/', '/Node_Modules/', true);

		const f3 = `
			temp/*
			!temp/keep
		`;
		assertNoIgnoreMatch(f3, '/', '/TEMP/other', false);
		assertIgnoreMatch(f3, '/', '/temp/KEEP', false);
		assertIgnoreMatch(f3, '/', '/TEMP/other', true);
		assertNoIgnoreMatch(f3, '/', '/TEMP/KEEP', true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/common/queryBuilder.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/queryBuilder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as glob from '../../../../../base/common/glob.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { testWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { escapeGlobPattern, resolveResourcesForSearchIncludes } from '../../common/queryBuilder.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';

suite('QueryBuilderCommon', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	let context: IWorkspaceContextService;

	setup(() => {
		const workspace = testWorkspace(URI.file(isWindows ? 'C:\\testWorkspace' : '/testWorkspace'));
		context = new TestContextService(workspace);
	});

	test('resolveResourcesForSearchIncludes passes through paths without special glob characters', () => {
		const actual = resolveResourcesForSearchIncludes([URI.file(isWindows ? 'C:\\testWorkspace\\pages\\blog' : '/testWorkspace/pages/blog')], context);
		assert.deepStrictEqual(actual, ['./pages/blog']);
	});

	test('resolveResourcesForSearchIncludes escapes paths with special characters', () => {
		const actual = resolveResourcesForSearchIncludes([URI.file(isWindows ? 'C:\\testWorkspace\\pages\\blog\\[postId]' : '/testWorkspace/pages/blog/[postId]')], context);
		assert.deepStrictEqual(actual, ['./pages/blog/[[]postId[]]']);
	});

	test('escapeGlobPattern properly escapes square brackets for literal matching', () => {
		// This test verifies the fix for issue #233049 where files with square brackets in names
		// were not found when using "Search Only in Open Editors"

		// Test file name with square brackets
		const fileName = 'file[test].txt';

		// Without escaping, the pattern treats [test] as a character class
		const unescapedResult = glob.match(fileName, fileName);
		assert.strictEqual(unescapedResult, false, 'Unescaped pattern should not match due to character class interpretation');

		// With escaping, the pattern matches literally
		const escapedPattern = escapeGlobPattern(fileName);
		const escapedResult = glob.match(escapedPattern, fileName);
		assert.strictEqual(escapedResult, true, 'Escaped pattern should match literally');
		assert.strictEqual(escapedPattern, 'file[[]test[]].txt', 'Pattern should have escaped brackets');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/common/replace.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/replace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ReplacePattern } from '../../common/replace.js';

suite('Replace Pattern test', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse replace string', () => {
		const testParse = (input: string, expected: string, expectedHasParameters: boolean) => {
			let actual = new ReplacePattern(input, { pattern: 'somepattern', isRegExp: true });
			assert.strictEqual(expected, actual.pattern);
			assert.strictEqual(expectedHasParameters, actual.hasParameters);

			actual = new ReplacePattern('hello' + input + 'hi', { pattern: 'sonepattern', isRegExp: true });
			assert.strictEqual('hello' + expected + 'hi', actual.pattern);
			assert.strictEqual(expectedHasParameters, actual.hasParameters);
		};

		// no backslash => no treatment
		testParse('hello', 'hello', false);

		// \t => TAB
		testParse('\\thello', '\thello', false);

		// \n => LF
		testParse('\\nhello', '\nhello', false);

		// \\t => \t
		testParse('\\\\thello', '\\thello', false);

		// \\\t => \TAB
		testParse('\\\\\\thello', '\\\thello', false);

		// \\\\t => \\t
		testParse('\\\\\\\\thello', '\\\\thello', false);

		// \ at the end => no treatment
		testParse('hello\\', 'hello\\', false);

		// \ with unknown char => no treatment
		testParse('hello\\x', 'hello\\x', false);

		// \ with back reference => no treatment
		testParse('hello\\0', 'hello\\0', false);



		// $1 => no treatment
		testParse('hello$1', 'hello$1', true);
		// $2 => no treatment
		testParse('hello$2', 'hello$2', true);
		// $12 => no treatment
		testParse('hello$12', 'hello$12', true);
		// $99 => no treatment
		testParse('hello$99', 'hello$99', true);
		// $99a => no treatment
		testParse('hello$99a', 'hello$99a', true);
		// $100 => no treatment
		testParse('hello$100', 'hello$100', false);
		// $100a => no treatment
		testParse('hello$100a', 'hello$100a', false);
		// $10a0 => no treatment
		testParse('hello$10a0', 'hello$10a0', true);
		// $$ => no treatment
		testParse('hello$$', 'hello$$', false);
		// $$0 => no treatment
		testParse('hello$$0', 'hello$$0', false);

		// $0 => $&
		testParse('hello$0', 'hello$&', true);
		testParse('hello$02', 'hello$&2', true);

		testParse('hello$`', 'hello$`', true);
		testParse('hello$\'', 'hello$\'', true);
	});

	test('create pattern by passing regExp', () => {
		let expected = /abc/;
		let actual = new ReplacePattern('hello', false, expected).regExp;
		assert.deepStrictEqual(actual, expected);

		expected = /abc/;
		actual = new ReplacePattern('hello', false, /abc/g).regExp;
		assert.deepStrictEqual(actual, expected);

		let testObject = new ReplacePattern('hello$0', false, /abc/g);
		assert.strictEqual(testObject.hasParameters, false);

		testObject = new ReplacePattern('hello$0', true, /abc/g);
		assert.strictEqual(testObject.hasParameters, true);
	});

	test('get replace string if given text is a complete match', () => {
		let testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: true });
		let actual = testObject.getReplaceString('bla');
		assert.strictEqual(actual, 'hello');

		testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: false });
		actual = testObject.getReplaceString('bla');
		assert.strictEqual(actual, 'hello');

		testObject = new ReplacePattern('hello', { pattern: '(bla)', isRegExp: true });
		actual = testObject.getReplaceString('bla');
		assert.strictEqual(actual, 'hello');

		testObject = new ReplacePattern('hello$0', { pattern: '(bla)', isRegExp: true });
		actual = testObject.getReplaceString('bla');
		assert.strictEqual(actual, 'hellobla');

		testObject = new ReplacePattern('import * as $1 from \'$2\';', { pattern: 'let\\s+(\\w+)\\s*=\\s*require\\s*\\(\\s*[\'\"]([\\w.\\-/]+)\\s*[\'\"]\\s*\\)\\s*', isRegExp: true });
		actual = testObject.getReplaceString('let fs = require(\'fs\')');
		assert.strictEqual(actual, 'import * as fs from \'fs\';');

		actual = testObject.getReplaceString('let something = require(\'fs\')');
		assert.strictEqual(actual, 'import * as something from \'fs\';');

		actual = testObject.getReplaceString('let require(\'fs\')');
		assert.strictEqual(actual, null);

		testObject = new ReplacePattern('import * as $1 from \'$1\';', { pattern: 'let\\s+(\\w+)\\s*=\\s*require\\s*\\(\\s*[\'\"]([\\w.\\-/]+)\\s*[\'\"]\\s*\\)\\s*', isRegExp: true });
		actual = testObject.getReplaceString('let something = require(\'fs\')');
		assert.strictEqual(actual, 'import * as something from \'something\';');

		testObject = new ReplacePattern('import * as $2 from \'$1\';', { pattern: 'let\\s+(\\w+)\\s*=\\s*require\\s*\\(\\s*[\'\"]([\\w.\\-/]+)\\s*[\'\"]\\s*\\)\\s*', isRegExp: true });
		actual = testObject.getReplaceString('let something = require(\'fs\')');
		assert.strictEqual(actual, 'import * as fs from \'something\';');

		testObject = new ReplacePattern('import * as $0 from \'$0\';', { pattern: 'let\\s+(\\w+)\\s*=\\s*require\\s*\\(\\s*[\'\"]([\\w.\\-/]+)\\s*[\'\"]\\s*\\)\\s*', isRegExp: true });
		actual = testObject.getReplaceString('let something = require(\'fs\');');
		assert.strictEqual(actual, 'import * as let something = require(\'fs\') from \'let something = require(\'fs\')\';');

		testObject = new ReplacePattern('import * as $1 from \'$2\';', { pattern: 'let\\s+(\\w+)\\s*=\\s*require\\s*\\(\\s*[\'\"]([\\w.\\-/]+)\\s*[\'\"]\\s*\\)\\s*', isRegExp: false });
		actual = testObject.getReplaceString('let fs = require(\'fs\');');
		assert.strictEqual(actual, null);

		testObject = new ReplacePattern('cat$1', { pattern: 'for(.*)', isRegExp: true });
		actual = testObject.getReplaceString('for ()');
		assert.strictEqual(actual, 'cat ()');
	});

	test('case operations', () => {
		const testObject = new ReplacePattern('a\\u$1l\\u\\l\\U$2M$3n', { pattern: 'a(l)l(good)m(e)n', isRegExp: true });
		const actual = testObject.getReplaceString('allgoodmen');
		assert.strictEqual(actual, 'aLlGoODMen');
	});

	test('case operations - no false positive', () => {
		let testObject = new ReplacePattern('\\left $1', { pattern: '(pattern)', isRegExp: true });
		let actual = testObject.getReplaceString('pattern');
		assert.strictEqual(actual, '\\left pattern');

		testObject = new ReplacePattern('\\hi \\left $1', { pattern: '(pattern)', isRegExp: true });
		actual = testObject.getReplaceString('pattern');
		assert.strictEqual(actual, '\\hi \\left pattern');

		testObject = new ReplacePattern('\\left \\L$1', { pattern: 'PATT(ERN)', isRegExp: true });
		actual = testObject.getReplaceString('PATTERN');
		assert.strictEqual(actual, '\\left ern');
	});

	test('case operations and newline', () => { // #140734
		const testObject = new ReplacePattern('$1\n\\U$2', { pattern: '(multi)(line)', isRegExp: true });
		const actual = testObject.getReplaceString('multiline');
		assert.strictEqual(actual, 'multi\nLINE');
	});

	test('get replace string for no matches', () => {
		let testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: true });
		let actual = testObject.getReplaceString('foo');
		assert.strictEqual(actual, null);

		testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: false });
		actual = testObject.getReplaceString('foo');
		assert.strictEqual(actual, null);
	});

	test('get replace string if match is sub-string of the text', () => {
		let testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: true });
		let actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'hello');

		testObject = new ReplacePattern('hello', { pattern: 'bla', isRegExp: false });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'hello');

		testObject = new ReplacePattern('that', { pattern: 'this(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'that');

		testObject = new ReplacePattern('$1at', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'that');

		testObject = new ReplacePattern('$1e', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'the');

		testObject = new ReplacePattern('$1ere', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'there');

		testObject = new ReplacePattern('$1', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'th');

		testObject = new ReplacePattern('ma$1', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'math');

		testObject = new ReplacePattern('ma$1s', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'maths');

		testObject = new ReplacePattern('ma$1s', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'maths');

		testObject = new ReplacePattern('$0', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'this');

		testObject = new ReplacePattern('$0$1', { pattern: '(th)is(?=.*bla)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'thisth');

		testObject = new ReplacePattern('foo', { pattern: 'bla(?=\\stext$)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'foo');

		testObject = new ReplacePattern('f$1', { pattern: 'b(la)(?=\\stext$)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'fla');

		testObject = new ReplacePattern('f$0', { pattern: 'b(la)(?=\\stext$)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'fbla');

		testObject = new ReplacePattern('$0ah', { pattern: 'b(la)(?=\\stext$)', isRegExp: true });
		actual = testObject.getReplaceString('this is a bla text');
		assert.strictEqual(actual, 'blaah');

		testObject = new ReplacePattern('newrege$1', true, /Testrege(\w*)/);
		actual = testObject.getReplaceString('Testregex', true);
		assert.strictEqual(actual, 'Newregex');

		testObject = new ReplacePattern('newrege$1', true, /TESTREGE(\w*)/);
		actual = testObject.getReplaceString('TESTREGEX', true);
		assert.strictEqual(actual, 'NEWREGEX');

		testObject = new ReplacePattern('new_rege$1', true, /Test_Rege(\w*)/);
		actual = testObject.getReplaceString('Test_Regex', true);
		assert.strictEqual(actual, 'New_Regex');

		testObject = new ReplacePattern('new-rege$1', true, /Test-Rege(\w*)/);
		actual = testObject.getReplaceString('Test-Regex', true);
		assert.strictEqual(actual, 'New-Regex');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/common/search.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/search.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ITextSearchPreviewOptions, OneLineRange, TextSearchMatch, SearchRange } from '../../common/search.js';

suite('TextSearchResult', () => {

	const previewOptions1: ITextSearchPreviewOptions = {
		matchLines: 1,
		charsPerLine: 100
	};

	function assertOneLinePreviewRangeText(text: string, result: TextSearchMatch): void {
		assert.strictEqual(result.rangeLocations.length, 1);
		assert.strictEqual(
			result.previewText.substring((result.rangeLocations[0].preview).startColumn, (result.rangeLocations[0].preview).endColumn),
			text);
	}

	function getFirstSourceFromResult(result: TextSearchMatch): OneLineRange {
		return result.rangeLocations.map(e => e.source)[0];
	}

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty without preview options', () => {
		const range = new OneLineRange(5, 0, 0);
		const result = new TextSearchMatch('', range);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('', result);
	});

	test('empty with preview options', () => {
		const range = new OneLineRange(5, 0, 0);
		const result = new TextSearchMatch('', range, previewOptions1);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('', result);
	});

	test('short without preview options', () => {
		const range = new OneLineRange(5, 4, 7);
		const result = new TextSearchMatch('foo bar', range);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('bar', result);
	});

	test('short with preview options', () => {
		const range = new OneLineRange(5, 4, 7);
		const result = new TextSearchMatch('foo bar', range, previewOptions1);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('bar', result);
	});

	test('leading', () => {
		const range = new OneLineRange(5, 25, 28);
		const result = new TextSearchMatch('long text very long text foo', range, previewOptions1);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('foo', result);
	});

	test('trailing', () => {
		const range = new OneLineRange(5, 0, 3);
		const result = new TextSearchMatch('foo long text very long text long text very long text long text very long text long text very long text long text very long text', range, previewOptions1);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('foo', result);
	});

	test('middle', () => {
		const range = new OneLineRange(5, 30, 33);
		const result = new TextSearchMatch('long text very long text long foo text very long text long text very long text long text very long text long text very long text', range, previewOptions1);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('foo', result);
	});

	test('truncating match', () => {
		const previewOptions: ITextSearchPreviewOptions = {
			matchLines: 1,
			charsPerLine: 1
		};

		const range = new OneLineRange(0, 4, 7);
		const result = new TextSearchMatch('foo bar', range, previewOptions);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assertOneLinePreviewRangeText('b', result);
	});

	test('one line of multiline match', () => {
		const previewOptions: ITextSearchPreviewOptions = {
			matchLines: 1,
			charsPerLine: 10000
		};

		const range = new SearchRange(5, 4, 6, 3);
		const result = new TextSearchMatch('foo bar\nfoo bar', range, previewOptions);
		assert.deepStrictEqual(getFirstSourceFromResult(result), range);
		assert.strictEqual(result.previewText, 'foo bar\nfoo bar');
		assert.strictEqual(result.rangeLocations.length, 1);
		assert.strictEqual(result.rangeLocations[0].preview.startLineNumber, 0);
		assert.strictEqual(result.rangeLocations[0].preview.startColumn, 4);
		assert.strictEqual(result.rangeLocations[0].preview.endLineNumber, 1);
		assert.strictEqual(result.rangeLocations[0].preview.endColumn, 3);
	});

	test('compacts multiple ranges on long lines', () => {
		const previewOptions: ITextSearchPreviewOptions = {
			matchLines: 1,
			charsPerLine: 10
		};

		const range1 = new SearchRange(5, 4, 5, 7);
		const range2 = new SearchRange(5, 133, 5, 136);
		const range3 = new SearchRange(5, 141, 5, 144);
		const result = new TextSearchMatch('foo bar 123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890 foo bar baz bar', [range1, range2, range3], previewOptions);
		assert.deepStrictEqual(result.rangeLocations.map(e => e.preview), [new OneLineRange(0, 4, 7), new OneLineRange(0, 42, 45), new OneLineRange(0, 50, 53)]);
		assert.strictEqual(result.previewText, 'foo bar 123456⟪ 117 characters skipped ⟫o bar baz bar');
	});

	test('trims lines endings', () => {
		const range = new SearchRange(5, 3, 5, 5);
		const previewOptions: ITextSearchPreviewOptions = {
			matchLines: 1,
			charsPerLine: 10000
		};

		assert.strictEqual(new TextSearchMatch('foo bar\n', range, previewOptions).previewText, 'foo bar');
		assert.strictEqual(new TextSearchMatch('foo bar\r\n', range, previewOptions).previewText, 'foo bar');
	});

	// test('all lines of multiline match', () => {
	// 	const previewOptions: ITextSearchPreviewOptions = {
	// 		matchLines: 5,
	// 		charsPerLine: 10000
	// 	};

	// 	const range = new SearchRange(5, 4, 6, 3);
	// 	const result = new TextSearchResult('foo bar\nfoo bar', range, previewOptions);
	// 	assert.deepStrictEqual(result.range, range);
	// 	assertPreviewRangeText('bar\nfoo', result);
	// });
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/common/searchHelpers.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/searchHelpers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { FindMatch, ITextModel } from '../../../../../editor/common/model.js';
import { ISearchRange, ITextQuery, ITextSearchContext, ITextSearchResult, QueryType } from '../../common/search.js';
import { getTextSearchMatchWithModelContext, editorMatchesToTextSearchResults } from '../../common/searchHelpers.js';

suite('SearchHelpers', () => {
	suite('editorMatchesToTextSearchResults', () => {
		ensureNoDisposablesAreLeakedInTestSuite();
		const mockTextModel = {
			getLineContent(lineNumber: number): string {
				return '' + lineNumber;
			}
		} as ITextModel;

		function assertRangesEqual(actual: ISearchRange | ISearchRange[], expected: ISearchRange[]) {
			if (!Array.isArray(actual)) {
				// All of these tests are for arrays...
				throw new Error('Expected array of ranges');
			}

			assert.strictEqual(actual.length, expected.length);

			// These are sometimes Range, sometimes SearchRange
			actual.forEach((r, i) => {
				const expectedRange = expected[i];
				assert.deepStrictEqual(
					{ startLineNumber: r.startLineNumber, startColumn: r.startColumn, endLineNumber: r.endLineNumber, endColumn: r.endColumn },
					{ startLineNumber: expectedRange.startLineNumber, startColumn: expectedRange.startColumn, endLineNumber: expectedRange.endLineNumber, endColumn: expectedRange.endColumn });
			});
		}

		test('simple', () => {
			const results = editorMatchesToTextSearchResults([new FindMatch(new Range(6, 1, 6, 2), null)], mockTextModel);
			assert.strictEqual(results.length, 1);
			assert.strictEqual(results[0].previewText, '6\n');
			assertRangesEqual(results[0].rangeLocations.map(e => e.preview), [new Range(0, 0, 0, 1)]);
			assertRangesEqual(results[0].rangeLocations.map(e => e.source), [new Range(5, 0, 5, 1)]);
		});

		test('multiple', () => {
			const results = editorMatchesToTextSearchResults(
				[
					new FindMatch(new Range(6, 1, 6, 2), null),
					new FindMatch(new Range(6, 4, 8, 2), null),
					new FindMatch(new Range(9, 1, 10, 3), null),
				],
				mockTextModel);
			assert.strictEqual(results.length, 2);
			assertRangesEqual(results[0].rangeLocations.map(e => e.preview), [
				new Range(0, 0, 0, 1),
				new Range(0, 3, 2, 1),
			]);
			assertRangesEqual(results[0].rangeLocations.map(e => e.source), [
				new Range(5, 0, 5, 1),
				new Range(5, 3, 7, 1),
			]);
			assert.strictEqual(results[0].previewText, '6\n7\n8\n');

			assertRangesEqual(results[1].rangeLocations.map(e => e.preview), [
				new Range(0, 0, 1, 2),
			]);
			assertRangesEqual(results[1].rangeLocations.map(e => e.source), [
				new Range(8, 0, 9, 2),
			]);
			assert.strictEqual(results[1].previewText, '9\n10\n');
		});
	});

	suite('addContextToEditorMatches', () => {
		ensureNoDisposablesAreLeakedInTestSuite();
		const MOCK_LINE_COUNT = 100;

		const mockTextModel = {
			getLineContent(lineNumber: number): string {
				if (lineNumber < 1 || lineNumber > MOCK_LINE_COUNT) {
					throw new Error(`invalid line count: ${lineNumber}`);
				}

				return '' + lineNumber;
			},

			getLineCount(): number {
				return MOCK_LINE_COUNT;
			}
		} as ITextModel;

		function getQuery(surroundingContext?: number): ITextQuery {
			return {
				folderQueries: [],
				type: QueryType.Text,
				contentPattern: { pattern: 'test' },
				surroundingContext,
			};
		}

		test('no context', () => {
			const matches = [{
				previewText: 'foo',
				rangeLocations: [
					{
						preview: new Range(0, 0, 0, 10),
						source: new Range(0, 0, 0, 10)
					}
				]
			}];

			assert.deepStrictEqual(getTextSearchMatchWithModelContext(matches, mockTextModel, getQuery()), matches);
		});

		test('simple', () => {
			const matches = [{
				previewText: 'foo',
				rangeLocations: [
					{
						preview: new Range(0, 0, 0, 10),
						source: new Range(1, 0, 1, 10)
					}
				]
			}
			];

			assert.deepStrictEqual(getTextSearchMatchWithModelContext(matches, mockTextModel, getQuery(1)), [
				{
					text: '1',
					lineNumber: 1
				},
				...matches,
				{
					text: '3',
					lineNumber: 3
				},
			] satisfies ITextSearchResult[]);
		});

		test('multiple matches next to each other', () => {
			const matches = [
				{
					previewText: 'foo',
					rangeLocations: [
						{
							preview: new Range(0, 0, 0, 10),
							source: new Range(1, 0, 1, 10)
						}
					]
				},
				{
					previewText: 'bar',
					rangeLocations: [
						{
							preview: new Range(0, 0, 0, 10),
							source: new Range(2, 0, 2, 10)
						}
					]
				}];

			assert.deepStrictEqual(getTextSearchMatchWithModelContext(matches, mockTextModel, getQuery(1)), [
				<ITextSearchContext>{
					text: '1',
					lineNumber: 1
				},
				...matches,
				<ITextSearchContext>{
					text: '4',
					lineNumber: 4
				},
			]);
		});

		test('boundaries', () => {
			const matches = [
				{
					previewText: 'foo',
					rangeLocations: [
						{
							preview: new Range(0, 0, 0, 10),
							source: new Range(0, 0, 0, 10)
						}
					]
				},
				{
					previewText: 'bar',
					rangeLocations: [
						{
							preview: new Range(0, 0, 0, 10),
							source: new Range(MOCK_LINE_COUNT - 1, 0, MOCK_LINE_COUNT - 1, 10)
						}
					]
				}];

			assert.deepStrictEqual(getTextSearchMatchWithModelContext(matches, mockTextModel, getQuery(1)), [
				matches[0],
				<ITextSearchContext>{
					text: '2',
					lineNumber: 2
				},
				<ITextSearchContext>{
					text: '' + (MOCK_LINE_COUNT - 1),
					lineNumber: MOCK_LINE_COUNT - 1
				},
				matches[1]
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fileSearch.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fileSearch.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FileAccess } from '../../../../../base/common/network.js';
import * as path from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { flakySuite } from '../../../../../base/test/node/testUtils.js';
import { IFileQuery, IFolderQuery, ISerializedSearchProgressItem, isProgressMessage, QueryType } from '../../common/search.js';
import { SearchService } from '../../node/rawSearchService.js';

const TEST_FIXTURES = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath);
const TEST_FIXTURES2 = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures2').fsPath);
const EXAMPLES_FIXTURES = path.join(TEST_FIXTURES, 'examples');
const MORE_FIXTURES = path.join(TEST_FIXTURES, 'more');
const TEST_ROOT_FOLDER: IFolderQuery = { folder: URI.file(TEST_FIXTURES) };
const ROOT_FOLDER_QUERY: IFolderQuery[] = [
	TEST_ROOT_FOLDER
];

const MULTIROOT_QUERIES: IFolderQuery[] = [
	{ folder: URI.file(EXAMPLES_FIXTURES), folderName: 'examples_folder' },
	{ folder: URI.file(MORE_FIXTURES) }
];

const numThreads = undefined;

async function doSearchTest(query: IFileQuery, expectedResultCount: number | Function): Promise<void> {
	const svc = new SearchService();

	const results: ISerializedSearchProgressItem[] = [];
	await svc.doFileSearch(query, numThreads, e => {
		if (!isProgressMessage(e)) {
			if (Array.isArray(e)) {
				results.push(...e);
			} else {
				results.push(e);
			}
		}
	});

	assert.strictEqual(results.length, expectedResultCount, `rg ${results.length} !== ${expectedResultCount}`);
}

flakySuite('FileSearch-integration', function () {

	test('File - simple', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY
		};

		return doSearchTest(config, 14);
	});

	test('File - filepattern', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'anotherfile'
		};

		return doSearchTest(config, 1);
	});

	test('File - exclude', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'file',
			excludePattern: { '**/anotherfolder/**': true }
		};

		return doSearchTest(config, 2);
	});

	test('File - multiroot', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			filePattern: 'file',
			excludePattern: { '**/anotherfolder/**': true }
		};

		return doSearchTest(config, 2);
	});

	test('File - multiroot with folder name', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			filePattern: 'examples_folder anotherfile'
		};

		return doSearchTest(config, 1);
	});

	test('File - multiroot with folder name and sibling exclude', () => {
		const config: IFileQuery = {
			type: QueryType.File,
			folderQueries: [
				{ folder: URI.file(TEST_FIXTURES), folderName: 'folder1' },
				{ folder: URI.file(TEST_FIXTURES2) }
			],
			filePattern: 'folder1 site',
			excludePattern: { '*.css': { when: '$(basename).less' } }
		};

		return doSearchTest(config, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/rawSearchService.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/rawSearchService.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancelablePromise, createCancelablePromise } from '../../../../../base/common/async.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { FileAccess } from '../../../../../base/common/network.js';
import * as path from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { flakySuite } from '../../../../../base/test/node/testUtils.js';
import { IFileQuery, IFileSearchStats, IFolderQuery, IProgressMessage, IRawFileMatch, ISearchEngine, ISearchEngineStats, ISearchEngineSuccess, ISerializedFileMatch, ISerializedSearchComplete, ISerializedSearchProgressItem, ISerializedSearchSuccess, isSerializedSearchComplete, isSerializedSearchSuccess, QueryType } from '../../common/search.js';
import { IProgressCallback, SearchService as RawSearchService } from '../../node/rawSearchService.js';

const TEST_FOLDER_QUERIES = [
	{ folder: URI.file(path.normalize('/some/where')) }
];

const TEST_FIXTURES = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath);
const MULTIROOT_QUERIES: IFolderQuery[] = [
	{ folder: URI.file(path.join(TEST_FIXTURES, 'examples')) },
	{ folder: URI.file(path.join(TEST_FIXTURES, 'more')) }
];

const stats: ISearchEngineStats = {
	fileWalkTime: 0,
	cmdTime: 1,
	directoriesWalked: 2,
	filesWalked: 3
};

class TestSearchEngine implements ISearchEngine<IRawFileMatch> {

	static last: TestSearchEngine;

	private isCanceled = false;

	constructor(private result: () => IRawFileMatch | null, public config?: IFileQuery) {
		TestSearchEngine.last = this;
	}

	search(onResult: (match: IRawFileMatch) => void, onProgress: (progress: IProgressMessage) => void, done: (error: Error, complete: ISearchEngineSuccess) => void): void {
		const self = this;
		(function next() {
			process.nextTick(() => {
				if (self.isCanceled) {
					done(null!, {
						limitHit: false,
						stats: stats,
						messages: [],
					});
					return;
				}
				const result = self.result();
				if (!result) {
					done(null!, {
						limitHit: false,
						stats: stats,
						messages: [],
					});
				} else {
					onResult(result);
					next();
				}
			});
		})();
	}

	cancel(): void {
		this.isCanceled = true;
	}
}

flakySuite('RawSearchService', () => {

	const rawSearch: IFileQuery = {
		type: QueryType.File,
		folderQueries: TEST_FOLDER_QUERIES,
		filePattern: 'a'
	};

	const rawMatch: IRawFileMatch = {
		base: path.normalize('/some'),
		relativePath: 'where',
		searchPath: undefined
	};

	const match: ISerializedFileMatch = {
		path: path.normalize('/some/where')
	};

	test('Individual results', async function () {
		let i = 5;
		const Engine = TestSearchEngine.bind(null, () => i-- ? rawMatch : null);
		const service = new RawSearchService();

		let results = 0;
		const cb: (p: ISerializedSearchProgressItem) => void = value => {
			if (!!(<IProgressMessage>value).message) {
				return;
			}
			if (!Array.isArray(value)) {
				assert.deepStrictEqual(value, match);
				results++;
			} else {
				assert.fail(JSON.stringify(value));
			}
		};

		await service.doFileSearchWithEngine(Engine, rawSearch, cb, null!, 0);
		return assert.strictEqual(results, 5);
	});

	test('Batch results', async function () {
		let i = 25;
		const Engine = TestSearchEngine.bind(null, () => i-- ? rawMatch : null);
		const service = new RawSearchService();

		const results: number[] = [];
		const cb: (p: ISerializedSearchProgressItem) => void = value => {
			if (!!(<IProgressMessage>value).message) {
				return;
			}
			if (Array.isArray(value)) {
				value.forEach(m => {
					assert.deepStrictEqual(m, match);
				});
				results.push(value.length);
			} else {
				assert.fail(JSON.stringify(value));
			}
		};

		await service.doFileSearchWithEngine(Engine, rawSearch, cb, undefined, 10);
		assert.deepStrictEqual(results, [10, 10, 5]);
	});

	test('Collect batched results', async function () {
		const uriPath = '/some/where';
		let i = 25;
		const Engine = TestSearchEngine.bind(null, () => i-- ? rawMatch : null);
		const service = new RawSearchService();

		function fileSearch(config: IFileQuery, batchSize: number): Event<ISerializedSearchProgressItem | ISerializedSearchComplete> {
			let promise: CancelablePromise<ISerializedSearchSuccess | void>;

			const emitter = new Emitter<ISerializedSearchProgressItem | ISerializedSearchComplete>({
				onWillAddFirstListener: () => {
					promise = createCancelablePromise(token => service.doFileSearchWithEngine(Engine, config, p => emitter.fire(p), token, batchSize)
						.then(c => emitter.fire(c), err => emitter.fire({ type: 'error', error: err })));
				},
				onDidRemoveLastListener: () => {
					promise.cancel();
				}
			});

			return emitter.event;
		}

		const result = await collectResultsFromEvent(fileSearch(rawSearch, 10));
		result.files.forEach(f => {
			assert.strictEqual(f.path.replace(/\\/g, '/'), uriPath);
		});
		assert.strictEqual(result.files.length, 25, 'Result');
	});

	test('Multi-root with include pattern and maxResults', async function () {
		const service = new RawSearchService();

		const query: IFileQuery = {
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			maxResults: 1,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		};

		const result = await collectResultsFromEvent(service.fileSearch(query));
		assert.strictEqual(result.files.length, 1, 'Result');
	});

	test('Handles maxResults=0 correctly', async function () {
		const service = new RawSearchService();

		const query: IFileQuery = {
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			maxResults: 0,
			sortByScore: true,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		};

		const result = await collectResultsFromEvent(service.fileSearch(query));
		assert.strictEqual(result.files.length, 0, 'Result');
	});

	test('Multi-root with include pattern and exists', async function () {
		const service = new RawSearchService();

		const query: IFileQuery = {
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			exists: true,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		};

		const result = await collectResultsFromEvent(service.fileSearch(query));
		assert.strictEqual(result.files.length, 0, 'Result');
		assert.ok(result.limitHit);
	});

	test('Sorted results', async function () {
		const paths = ['bab', 'bbc', 'abb'];
		const matches: IRawFileMatch[] = paths.map(relativePath => ({
			base: path.normalize('/some/where'),
			relativePath,
			basename: relativePath,
			size: 3,
			searchPath: undefined
		}));
		const Engine = TestSearchEngine.bind(null, () => matches.shift()!);
		const service = new RawSearchService();

		const results: any[] = [];
		const cb: IProgressCallback = value => {
			if (!!(<IProgressMessage>value).message) {
				return;
			}
			if (Array.isArray(value)) {
				results.push(...value.map(v => v.path));
			} else {
				assert.fail(JSON.stringify(value));
			}
		};

		await service.doFileSearchWithEngine(Engine, {
			type: QueryType.File,
			folderQueries: TEST_FOLDER_QUERIES,
			filePattern: 'bb',
			sortByScore: true,
			maxResults: 2
		}, cb, undefined, 1);
		assert.notStrictEqual(typeof TestSearchEngine.last.config!.maxResults, 'number');
		assert.deepStrictEqual(results, [path.normalize('/some/where/bbc'), path.normalize('/some/where/bab')]);
	});

	test('Sorted result batches', async function () {
		let i = 25;
		const Engine = TestSearchEngine.bind(null, () => i-- ? rawMatch : null);
		const service = new RawSearchService();

		const results: number[] = [];
		const cb: IProgressCallback = value => {
			if (!!(<IProgressMessage>value).message) {
				return;
			}
			if (Array.isArray(value)) {
				value.forEach(m => {
					assert.deepStrictEqual(m, match);
				});
				results.push(value.length);
			} else {
				assert.fail(JSON.stringify(value));
			}
		};
		await service.doFileSearchWithEngine(Engine, {
			type: QueryType.File,
			folderQueries: TEST_FOLDER_QUERIES,
			filePattern: 'a',
			sortByScore: true,
			maxResults: 23
		}, cb, undefined, 10);
		assert.deepStrictEqual(results, [10, 10, 3]);
	});

	test('Cached results', function () {
		const paths = ['bcb', 'bbc', 'aab'];
		const matches: IRawFileMatch[] = paths.map(relativePath => ({
			base: path.normalize('/some/where'),
			relativePath,
			basename: relativePath,
			size: 3,
			searchPath: undefined
		}));
		const Engine = TestSearchEngine.bind(null, () => matches.shift()!);
		const service = new RawSearchService();

		const results: any[] = [];
		const cb: IProgressCallback = value => {
			if (!!(<IProgressMessage>value).message) {
				return;
			}
			if (Array.isArray(value)) {
				results.push(...value.map(v => v.path));
			} else {
				assert.fail(JSON.stringify(value));
			}
		};
		return service.doFileSearchWithEngine(Engine, {
			type: QueryType.File,
			folderQueries: TEST_FOLDER_QUERIES,
			filePattern: 'b',
			sortByScore: true,
			cacheKey: 'x'
		}, cb, undefined, -1).then(complete => {
			assert.strictEqual((<IFileSearchStats>complete.stats).fromCache, false);
			assert.deepStrictEqual(results, [path.normalize('/some/where/bcb'), path.normalize('/some/where/bbc'), path.normalize('/some/where/aab')]);
		}).then(async () => {
			const results: any[] = [];
			const cb: IProgressCallback = value => {
				if (Array.isArray(value)) {
					results.push(...value.map(v => v.path));
				} else {
					assert.fail(JSON.stringify(value));
				}
			};
			try {
				const complete = await service.doFileSearchWithEngine(Engine, {
					type: QueryType.File,
					folderQueries: TEST_FOLDER_QUERIES,
					filePattern: 'bc',
					sortByScore: true,
					cacheKey: 'x'
				}, cb, undefined, -1);
				assert.ok((<IFileSearchStats>complete.stats).fromCache);
				assert.deepStrictEqual(results, [path.normalize('/some/where/bcb'), path.normalize('/some/where/bbc')]);
			}
			catch (e) { }
		}).then(() => {
			return service.clearCache('x');
		}).then(async () => {
			matches.push({
				base: path.normalize('/some/where'),
				relativePath: 'bc',
				searchPath: undefined
			});
			const results: any[] = [];
			const cb: IProgressCallback = value => {
				if (!!(<IProgressMessage>value).message) {
					return;
				}
				if (Array.isArray(value)) {
					results.push(...value.map(v => v.path));
				} else {
					assert.fail(JSON.stringify(value));
				}
			};
			const complete = await service.doFileSearchWithEngine(Engine, {
				type: QueryType.File,
				folderQueries: TEST_FOLDER_QUERIES,
				filePattern: 'bc',
				sortByScore: true,
				cacheKey: 'x'
			}, cb, undefined, -1);
			assert.strictEqual((<IFileSearchStats>complete.stats).fromCache, false);
			assert.deepStrictEqual(results, [path.normalize('/some/where/bc')]);
		});
	});
});

function collectResultsFromEvent(event: Event<ISerializedSearchProgressItem | ISerializedSearchComplete>): Promise<{ files: ISerializedFileMatch[]; limitHit: boolean }> {
	const files: ISerializedFileMatch[] = [];

	let listener: IDisposable;
	return new Promise((c, e) => {
		listener = event(ev => {
			if (isSerializedSearchComplete(ev)) {
				if (isSerializedSearchSuccess(ev)) {
					c({ files, limitHit: ev.limitHit });
				} else {
					e(ev.error);
				}

				listener.dispose();
			} else if (Array.isArray(ev)) {
				files.push(...ev);
			} else if ((<ISerializedFileMatch>ev).path) {
				files.push(ev as ISerializedFileMatch);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/ripgrepFileSearch.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/ripgrepFileSearch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as platform from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { fixDriveC, getAbsoluteGlob } from '../../node/ripgrepFileSearch.js';

suite('RipgrepFileSearch - etc', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	function testGetAbsGlob(params: string[]): void {
		const [folder, glob, expectedResult] = params;
		assert.strictEqual(fixDriveC(getAbsoluteGlob(folder, glob)), expectedResult, JSON.stringify(params));
	}

	(!platform.isWindows ? test.skip : test)('getAbsoluteGlob_win', () => {
		[
			['C:/foo/bar', 'glob/**', '/foo\\bar\\glob\\**'],
			['c:/', 'glob/**', '/glob\\**'],
			['C:\\foo\\bar', 'glob\\**', '/foo\\bar\\glob\\**'],
			['c:\\foo\\bar', 'glob\\**', '/foo\\bar\\glob\\**'],
			['c:\\', 'glob\\**', '/glob\\**'],
			['\\\\localhost\\c$\\foo\\bar', 'glob/**', '\\\\localhost\\c$\\foo\\bar\\glob\\**'],

			// absolute paths are not resolved further
			['c:/foo/bar', '/path/something', '/path/something'],
			['c:/foo/bar', 'c:\\project\\folder', '/project\\folder']
		].forEach(testGetAbsGlob);
	});

	(platform.isWindows ? test.skip : test)('getAbsoluteGlob_posix', () => {
		[
			['/foo/bar', 'glob/**', '/foo/bar/glob/**'],
			['/', 'glob/**', '/glob/**'],

			// absolute paths are not resolved further
			['/', '/project/folder', '/project/folder'],
		].forEach(testGetAbsGlob);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/ripgrepTextSearchEngineUtils.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/ripgrepTextSearchEngineUtils.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { fixRegexNewline, IRgMatch, IRgMessage, RipgrepParser, unicodeEscapesToPCRE2, fixNewline, getRgArgs, performBraceExpansionForRipgrep } from '../../node/ripgrepTextSearchEngine.js';
import { Range, TextSearchMatch2, TextSearchQuery2, TextSearchResult2 } from '../../common/searchExtTypes.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { RipgrepTextSearchOptions } from '../../common/searchExtTypesInternal.js';
import { DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS } from '../../common/search.js';

suite('RipgrepTextSearchEngine', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('unicodeEscapesToPCRE2', async () => {
		assert.strictEqual(unicodeEscapesToPCRE2('\\u1234'), '\\x{1234}');
		assert.strictEqual(unicodeEscapesToPCRE2('\\u1234\\u0001'), '\\x{1234}\\x{0001}');
		assert.strictEqual(unicodeEscapesToPCRE2('foo\\u1234bar'), 'foo\\x{1234}bar');
		assert.strictEqual(unicodeEscapesToPCRE2('\\\\\\u1234'), '\\\\\\x{1234}');
		assert.strictEqual(unicodeEscapesToPCRE2('foo\\\\\\u1234'), 'foo\\\\\\x{1234}');

		assert.strictEqual(unicodeEscapesToPCRE2('\\u{1234}'), '\\x{1234}');
		assert.strictEqual(unicodeEscapesToPCRE2('\\u{1234}\\u{0001}'), '\\x{1234}\\x{0001}');
		assert.strictEqual(unicodeEscapesToPCRE2('foo\\u{1234}bar'), 'foo\\x{1234}bar');
		assert.strictEqual(unicodeEscapesToPCRE2('[\\u00A0-\\u00FF]'), '[\\x{00A0}-\\x{00FF}]');

		assert.strictEqual(unicodeEscapesToPCRE2('foo\\u{123456}7bar'), 'foo\\u{123456}7bar');
		assert.strictEqual(unicodeEscapesToPCRE2('\\u123'), '\\u123');
		assert.strictEqual(unicodeEscapesToPCRE2('foo'), 'foo');
		assert.strictEqual(unicodeEscapesToPCRE2(''), '');
	});

	test('fixRegexNewline - src', () => {
		const ttable = [
			['foo', 'foo'],
			['invalid(', 'invalid('],
			['fo\\no', 'fo\\r?\\no'],
			['f\\no\\no', 'f\\r?\\no\\r?\\no'],
			['f[a-z\\n1]', 'f(?:[a-z1]|\\r?\\n)'],
			['f[\\n-a]', 'f[\\n-a]'],
			['(?<=\\n)\\w', '(?<=\\n)\\w'],
			['fo\\n+o', 'fo(?:\\r?\\n)+o'],
			['fo[^\\n]o', 'fo(?!\\r?\\n)o'],
			['fo[^\\na-z]o', 'fo(?!\\r?\\n|[a-z])o'],
			['foo[^\\n]+o', 'foo.+o'],
			['foo[^\\nzq]+o', 'foo[^zq]+o'],
			['foo[^\\nzq]+o', 'foo[^zq]+o'],
			// preserves quantifies, #137899
			['fo[^\\S\\n]*o', 'fo[^\\S]*o'],
			['fo[^\\S\\n]{3,}o', 'fo[^\\S]{3,}o'],
		];

		for (const [input, expected] of ttable) {
			assert.strictEqual(fixRegexNewline(input), expected, `${input} -> ${expected}`);
		}
	});

	test('fixRegexNewline - re', () => {
		function testFixRegexNewline([inputReg, testStr, shouldMatch]: readonly [string, string, boolean]): void {
			const fixed = fixRegexNewline(inputReg);
			const reg = new RegExp(fixed);
			assert.strictEqual(reg.test(testStr), shouldMatch, `${inputReg} => ${reg}, ${testStr}, ${shouldMatch}`);
		}

		([
			['foo', 'foo', true],

			['foo\\n', 'foo\r\n', true],
			['foo\\n\\n', 'foo\n\n', true],
			['foo\\n\\n', 'foo\r\n\r\n', true],
			['foo\\n', 'foo\n', true],
			['foo\\nabc', 'foo\r\nabc', true],
			['foo\\nabc', 'foo\nabc', true],
			['foo\\r\\n', 'foo\r\n', true],

			['foo\\n+abc', 'foo\r\nabc', true],
			['foo\\n+abc', 'foo\n\n\nabc', true],
			['foo\\n+abc', 'foo\r\n\r\n\r\nabc', true],
			['foo[\\n-9]+abc', 'foo1abc', true],
		] as const).forEach(testFixRegexNewline);
	});

	test('fixNewline - matching', () => {
		function testFixNewline([inputReg, testStr, shouldMatch = true]: readonly [string, string, boolean?]): void {
			const fixed = fixNewline(inputReg);
			const reg = new RegExp(fixed);
			assert.strictEqual(reg.test(testStr), shouldMatch, `${inputReg} => ${reg}, ${testStr}, ${shouldMatch}`);
		}

		([
			['foo', 'foo'],

			['foo\n', 'foo\r\n'],
			['foo\n', 'foo\n'],
			['foo\nabc', 'foo\r\nabc'],
			['foo\nabc', 'foo\nabc'],
			['foo\r\n', 'foo\r\n'],

			['foo\nbarc', 'foobar', false],
			['foobar', 'foo\nbar', false],
		] as const).forEach(testFixNewline);
	});

	suite('RipgrepParser', () => {
		const TEST_FOLDER = URI.file('/foo/bar');

		function testParser(inputData: string[], expectedResults: TextSearchResult2[]): void {
			const testParser = new RipgrepParser(1000, TEST_FOLDER, DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS);

			const actualResults: TextSearchResult2[] = [];
			testParser.on('result', r => {
				actualResults.push(r);
			});

			inputData.forEach(d => testParser.handleData(d));
			testParser.flush();

			assert.deepStrictEqual(actualResults, expectedResults);
		}

		function makeRgMatch(relativePath: string, text: string, lineNumber: number, matchRanges: { start: number; end: number }[]): string {
			return JSON.stringify(<IRgMessage>{
				type: 'match',
				data: <IRgMatch>{
					path: {
						text: relativePath
					},
					lines: {
						text
					},
					line_number: lineNumber,
					absolute_offset: 0, // unused
					submatches: matchRanges.map(mr => {
						return {
							...mr,
							match: { text: text.substring(mr.start, mr.end) }
						};
					})
				}
			}) + '\n';
		}

		test('single result', () => {
			testParser(
				[
					makeRgMatch('file1.js', 'foobar', 4, [{ start: 3, end: 6 }])
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					)
				]);
		});

		test('multiple results', () => {
			testParser(
				[
					makeRgMatch('file1.js', 'foobar', 4, [{ start: 3, end: 6 }]),
					makeRgMatch('app/file2.js', 'foobar', 4, [{ start: 3, end: 6 }]),
					makeRgMatch('app2/file3.js', 'foobar', 4, [{ start: 3, end: 6 }]),
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					),
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'app/file2.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					),
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'app2/file3.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					)
				]);
		});

		test('chopped-up input chunks', () => {
			const dataStrs = [
				makeRgMatch('file1.js', 'foo bar', 4, [{ start: 3, end: 7 }]),
				makeRgMatch('app/file2.js', 'foobar', 4, [{ start: 3, end: 6 }]),
				makeRgMatch('app2/file3.js', 'foobar', 4, [{ start: 3, end: 6 }]),
			];

			const dataStr0Space = dataStrs[0].indexOf(' ');
			testParser(
				[
					dataStrs[0].substring(0, dataStr0Space + 1),
					dataStrs[0].substring(dataStr0Space + 1),
					'\n',
					dataStrs[1].trim(),
					'\n' + dataStrs[2].substring(0, 25),
					dataStrs[2].substring(25)
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[{
							previewRange: new Range(0, 3, 0, 7),
							sourceRange: new Range(3, 3, 3, 7),
						}],
						'foo bar'
					),
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'app/file2.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					),
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'app2/file3.js'),
						[{
							previewRange: new Range(0, 3, 0, 6),
							sourceRange: new Range(3, 3, 3, 6),
						}],
						'foobar'
					)
				]);
		});


		test('empty result (#100569)', () => {
			testParser(
				[
					makeRgMatch('file1.js', 'foobar', 4, []),
					makeRgMatch('file1.js', '', 5, []),
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[
							{
								previewRange: new Range(0, 0, 0, 1),
								sourceRange: new Range(3, 0, 3, 1),
							}
						],
						'foobar'
					),
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[
							{
								previewRange: new Range(0, 0, 0, 0),
								sourceRange: new Range(4, 0, 4, 0),
							}
						],
						''
					)
				]);
		});

		test('multiple submatches without newline in between (#131507)', () => {
			testParser(
				[
					makeRgMatch('file1.js', 'foobarbazquux', 4, [{ start: 0, end: 4 }, { start: 6, end: 10 }]),
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[
							{
								previewRange: new Range(0, 0, 0, 4),
								sourceRange: new Range(3, 0, 3, 4),
							},
							{
								previewRange: new Range(0, 6, 0, 10),
								sourceRange: new Range(3, 6, 3, 10),
							}
						],
						'foobarbazquux'
					)
				]);
		});

		test('multiple submatches with newline in between (#131507)', () => {
			testParser(
				[
					makeRgMatch('file1.js', 'foo\nbar\nbaz\nquux', 4, [{ start: 0, end: 5 }, { start: 8, end: 13 }]),
				],
				[
					new TextSearchMatch2(
						joinPath(TEST_FOLDER, 'file1.js'),
						[
							{
								previewRange: new Range(0, 0, 1, 1),
								sourceRange: new Range(3, 0, 4, 1),
							},
							{
								previewRange: new Range(2, 0, 3, 1),
								sourceRange: new Range(5, 0, 6, 1),
							}
						],
						'foo\nbar\nbaz\nquux'
					)
				]);
		});
	});

	suite('getRgArgs', () => {
		test('simple includes', () => {
			// Only testing the args that come from includes.
			function testGetRgArgs(includes: string[], expectedFromIncludes: string[]): void {
				const query: TextSearchQuery2 = {
					pattern: 'test'
				};

				const options: RipgrepTextSearchOptions = {
					folderOptions: {
						includes: includes,
						excludes: [],
						useIgnoreFiles: {
							local: false,
							global: false,
							parent: false
						},
						followSymlinks: false,
						folder: URI.file('/some/folder'),
						encoding: 'utf8',
					},
					maxResults: 1000,
				};
				const expected = [
					'--hidden',
					'--no-require-git',
					'--ignore-case',
					...expectedFromIncludes,
					'--no-ignore',
					'--crlf',
					'--fixed-strings',
					'--no-config',
					'--no-ignore-global',
					'--json',
					'--',
					'test',
					'.'];
				const result = getRgArgs(query, options);
				assert.deepStrictEqual(result, expected);
			}

			([
				[['a/*', 'b/*'], ['-g', '!*', '-g', '/a', '-g', '/a/*', '-g', '/b', '-g', '/b/*']],
				[['**/a/*', 'b/*'], ['-g', '!*', '-g', '/b', '-g', '/b/*', '-g', '**/a/*']],
				[['**/a/*', '**/b/*'], ['-g', '**/a/*', '-g', '**/b/*']],
				[['foo/*bar/something/**'], ['-g', '!*', '-g', '/foo', '-g', '/foo/*bar', '-g', '/foo/*bar/something', '-g', '/foo/*bar/something/**']],
			].forEach(([includes, expectedFromIncludes]) => testGetRgArgs(<string[]>includes, <string[]>expectedFromIncludes)));
		});
	});

	test('brace expansion for ripgrep', () => {
		function testBraceExpansion(argGlob: string, expectedGlob: string[]): void {
			const result = performBraceExpansionForRipgrep(argGlob);
			assert.deepStrictEqual(result, expectedGlob);
		}

		[
			['eep/{a,b}/test', ['eep/a/test', 'eep/b/test']],
			['eep/{a,b}/{c,d,e}', ['eep/a/c', 'eep/a/d', 'eep/a/e', 'eep/b/c', 'eep/b/d', 'eep/b/e']],
			['eep/{a,b}/\\{c,d,e}', ['eep/a/{c,d,e}', 'eep/b/{c,d,e}']],
			['eep/{a,b\\}/test', ['eep/{a,b}/test']],
			['eep/{a,b\\\\}/test', ['eep/a/test', 'eep/b\\\\/test']],
			['eep/{a,b\\\\\\}/test', ['eep/{a,b\\\\}/test']],
			['e\\{ep/{a,b}/test', ['e{ep/a/test', 'e{ep/b/test']],
			['eep/{a,\\b}/test', ['eep/a/test', 'eep/\\b/test']],
			['{a/*.*,b/*.*}', ['a/*.*', 'b/*.*']],
			['{{}', ['{{}']],
			['aa{{}', ['aa{{}']],
			['{b{}', ['{b{}']],
			['{{}c', ['{{}c']],
			['{{}}', ['{{}}']],
			['\\{{}}', ['{}']],
			['{}foo', ['foo']],
			['bar{ }foo', ['bar foo']],
			['{}', ['']],
		].forEach(([includePattern, expectedPatterns]) => testBraceExpansion(<string>includePattern, <string[]>expectedPatterns));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/search.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/search.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as path from '../../../../../base/common/path.js';
import * as platform from '../../../../../base/common/platform.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFolderQuery, QueryType, IRawFileMatch } from '../../common/search.js';
import { Engine as FileSearchEngine, FileWalker } from '../../node/fileSearch.js';
import { flakySuite } from '../../../../../base/test/node/testUtils.js';
import { FileAccess } from '../../../../../base/common/network.js';

const TEST_FIXTURES = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath);
const EXAMPLES_FIXTURES = URI.file(path.join(TEST_FIXTURES, 'examples'));
const MORE_FIXTURES = URI.file(path.join(TEST_FIXTURES, 'more'));
const TEST_ROOT_FOLDER: IFolderQuery = { folder: URI.file(TEST_FIXTURES) };
const ROOT_FOLDER_QUERY: IFolderQuery[] = [
	TEST_ROOT_FOLDER
];

const ROOT_FOLDER_QUERY_36438: IFolderQuery[] = [
	{ folder: URI.file(path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures2/36438').fsPath)) }
];

const MULTIROOT_QUERIES: IFolderQuery[] = [
	{ folder: EXAMPLES_FIXTURES },
	{ folder: MORE_FIXTURES }
];

flakySuite('FileSearchEngine', () => {

	test('Files: *.js', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.js'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 4);
			done();
		});
	});

	test('Files: maxResults', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			maxResults: 1
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: maxResults without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			maxResults: 1,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/file.txt': true },
			exists: true
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: not exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/nofile.txt': true },
			exists: true
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(!complete.limitHit);
			done();
		});
	});

	test('Files: exists without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/file.txt': true },
			exists: true,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: not exists without Ripgrep', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: { '**/nofile.txt': true },
			exists: true,
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(!complete.limitHit);
			done();
		});
	});

	test('Files: examples/com*', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: path.join('examples', 'com*')
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: examples (fuzzy)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'xl'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 7);
			done();
		});
	});

	test('Files: multiroot', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			filePattern: 'file'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 3);
			done();
		});
	});

	test('Files: multiroot with includePattern and maxResults', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			maxResults: 1,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: multiroot with includePattern and exists', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: MULTIROOT_QUERIES,
			exists: true,
			includePattern: {
				'*.txt': true,
				'*.js': true
			},
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error, complete) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			assert.ok(complete.limitHit);
			done();
		});
	});

	test('Files: NPE (CamelCase)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'NullPE'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: *.*', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 14);
			done();
		});
	});

	test('Files: *.as', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.as'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			done();
		});
	});

	test('Files: *.* without derived', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'site.*',
			excludePattern: { '**/*.css': { 'when': '$(basename).less' } }
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'site.less');
			done();
		});
	});

	test('Files: *.* exclude folder without wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { 'examples': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: exclude folder without wildcard #36438', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY_36438,
			excludePattern: { 'modules': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: include folder without wildcard #36438', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY_36438,
			includePattern: { 'modules/**': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: *.* exclude folder with leading wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { '**/examples': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: *.* exclude folder with trailing wildcard', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { 'examples/**': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 8);
			done();
		});
	});

	test('Files: *.* exclude with unicode', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			excludePattern: { '**/üm laut汉语': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 13);
			done();
		});
	});

	test('Files: *.* include with unicode', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '*.*',
			includePattern: { '**/üm laut汉语/*': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});

	test('Files: multiroot with exclude', function (done: () => void) {
		const folderQueries: IFolderQuery[] = [
			{
				folder: EXAMPLES_FIXTURES,
				excludePattern: [{
					pattern: { '**/anotherfile.txt': true }
				}]
			},
			{
				folder: MORE_FIXTURES,
				excludePattern: [{
					pattern: {
						'**/file.txt': true
					}
				}]
			}
		];

		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries,
			filePattern: '*'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 5);
			done();
		});
	});

	test('Files: Unicode and Spaces', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: '汉语'
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), '汉语.txt');
			done();
		});
	});

	test('Files: no results', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: 'nofilematch'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 0);
			done();
		});
	});

	test('Files: relative path matched once', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			filePattern: path.normalize(path.join('examples', 'company.js'))
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'company.js');
			done();
		});
	});

	test('Files: Include pattern, single files', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			includePattern: {
				'site.css': true,
				'examples/company.js': true,
				'examples/subfolder/subfile.txt': true
			}
		});

		const res: IRawFileMatch[] = [];
		engine.search((result) => {
			res.push(result);
		}, () => { }, (error) => {
			assert.ok(!error);
			const basenames = res.map(r => path.basename(r.relativePath));
			assert.ok(basenames.indexOf('site.css') !== -1, `site.css missing in ${JSON.stringify(basenames)}`);
			assert.ok(basenames.indexOf('company.js') !== -1, `company.js missing in ${JSON.stringify(basenames)}`);
			assert.ok(basenames.indexOf('subfile.txt') !== -1, `subfile.txt missing in ${JSON.stringify(basenames)}`);
			done();
		});
	});

	test('Files: extraFiles only', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.js'
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'company.js');
			done();
		});
	});

	test('Files: extraFiles only (with include)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.*',
			includePattern: { '**/*.css': true }
		});

		let count = 0;
		let res: IRawFileMatch;
		engine.search((result) => {
			if (result) {
				count++;
			}
			res = result;
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			assert.strictEqual(path.basename(res.relativePath), 'site.css');
			done();
		});
	});

	test('Files: extraFiles only (with exclude)', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [],
			extraFileResources: [
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'site.css'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'examples', 'company.js'))),
				URI.file(path.normalize(path.join(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath, 'index.html')))
			],
			filePattern: '*.*',
			excludePattern: { '**/*.css': true }
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 2);
			done();
		});
	});

	test('Files: no dupes in nested folders', function (done: () => void) {
		const engine = new FileSearchEngine({
			type: QueryType.File,
			folderQueries: [
				{ folder: EXAMPLES_FIXTURES },
				{ folder: joinPath(EXAMPLES_FIXTURES, 'subfolder') }
			],
			filePattern: 'subfile.txt'
		});

		let count = 0;
		engine.search((result) => {
			if (result) {
				count++;
			}
		}, () => { }, (error) => {
			assert.ok(!error);
			assert.strictEqual(count, 1);
			done();
		});
	});
});

flakySuite('FileWalker', () => {

	(platform.isWindows ? test.skip : test)('Find: exclude subfolder', function (done: () => void) {
		const file0 = './more/file.txt';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			excludePattern: { '**/something': true }
		});
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({
				type: QueryType.File,
				folderQueries: ROOT_FOLDER_QUERY,
				excludePattern: { '**/subfolder': true }
			});
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: folder excludes', function (done: () => void) {
		const folderQueries: IFolderQuery[] = [
			{
				folder: URI.file(TEST_FIXTURES),
				excludePattern: [{
					pattern: { '**/subfolder': true }
				}]
			}
		];

		const file0 = './more/file.txt';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries });
		const cmd1 = walker.spawnFindCmd(folderQueries[0]);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert(outputContains(stdout1!, file0), stdout1);
			assert(!outputContains(stdout1!, file1), stdout1);
			done();
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude multiple folders', function (done: () => void) {
		const file0 = './index.html';
		const file1 = './examples/small.js';
		const file2 = './more/file.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file2), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '{**/examples,**/more}': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				assert.strictEqual(stdout2!.split('\n').indexOf(file2), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude folder path suffix', function (done: () => void) {
		const file0 = './examples/company.js';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/examples/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/examples/subfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude subfolder path suffix', function (done: () => void) {
		const file0 = './examples/subfolder/subfile.txt';
		const file1 = './examples/subfolder/anotherfolder/anotherfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/subfolder/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { '**/subfolder/anotherfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude folder path', function (done: () => void) {
		const file0 = './examples/company.js';
		const file1 = './examples/subfolder/subfile.txt';

		const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { 'examples/something': true } });
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
			assert.notStrictEqual(stdout1!.split('\n').indexOf(file1), -1, stdout1);

			const walker = new FileWalker({ type: QueryType.File, folderQueries: ROOT_FOLDER_QUERY, excludePattern: { 'examples/subfolder': true } });
			const cmd2 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
			walker.readStdout(cmd2, 'utf8', (err2, stdout2) => {
				assert.strictEqual(err2, null);
				assert.notStrictEqual(stdout1!.split('\n').indexOf(file0), -1, stdout1);
				assert.strictEqual(stdout2!.split('\n').indexOf(file1), -1, stdout2);
				done();
			});
		});
	});

	(platform.isWindows ? test.skip : test)('Find: exclude combination of paths', function (done: () => void) {
		const filesIn = [
			'./examples/subfolder/subfile.txt',
			'./examples/company.js',
			'./index.html'
		];
		const filesOut = [
			'./examples/subfolder/anotherfolder/anotherfile.txt',
			'./more/file.txt'
		];

		const walker = new FileWalker({
			type: QueryType.File,
			folderQueries: ROOT_FOLDER_QUERY,
			excludePattern: {
				'**/subfolder/anotherfolder': true,
				'**/something/else': true,
				'**/more': true,
				'**/andmore': true
			}
		});
		const cmd1 = walker.spawnFindCmd(TEST_ROOT_FOLDER);
		walker.readStdout(cmd1, 'utf8', (err1, stdout1) => {
			assert.strictEqual(err1, null);
			for (const fileIn of filesIn) {
				assert.notStrictEqual(stdout1!.split('\n').indexOf(fileIn), -1, stdout1);
			}
			for (const fileOut of filesOut) {
				assert.strictEqual(stdout1!.split('\n').indexOf(fileOut), -1, stdout1);
			}
			done();
		});
	});

	function outputContains(stdout: string, ...files: string[]): boolean {
		const lines = stdout.split('\n');
		return files.every(file => lines.indexOf(file) >= 0);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/textSearch.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/textSearch.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import * as glob from '../../../../../base/common/glob.js';
import { FileAccess } from '../../../../../base/common/network.js';
import * as path from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { flakySuite } from '../../../../../base/test/node/testUtils.js';
import { deserializeSearchError, IFolderQuery, ISearchRange, ISerializedFileMatch, ITextQuery, ITextSearchContext, ITextSearchMatch, QueryType, SearchErrorCode } from '../../common/search.js';
import { TextSearchEngineAdapter } from '../../node/textSearchAdapter.js';

const TEST_FIXTURES = path.normalize(FileAccess.asFileUri('vs/workbench/services/search/test/node/fixtures').fsPath);
const EXAMPLES_FIXTURES = path.join(TEST_FIXTURES, 'examples');
const MORE_FIXTURES = path.join(TEST_FIXTURES, 'more');
const TEST_ROOT_FOLDER: IFolderQuery = { folder: URI.file(TEST_FIXTURES) };
const ROOT_FOLDER_QUERY: IFolderQuery[] = [
	TEST_ROOT_FOLDER
];

const MULTIROOT_QUERIES: IFolderQuery[] = [
	{ folder: URI.file(EXAMPLES_FIXTURES) },
	{ folder: URI.file(MORE_FIXTURES) }
];

function doSearchTest(query: ITextQuery, expectedResultCount: number | Function): Promise<ISerializedFileMatch[]> {
	const engine = new TextSearchEngineAdapter(query);

	let c = 0;
	const results: ISerializedFileMatch[] = [];
	return engine.search(new CancellationTokenSource().token, _results => {
		if (_results) {
			c += _results.reduce((acc, cur) => acc + cur.numMatches!, 0);
			results.push(..._results);
		}
	}, () => { }).then(() => {
		if (typeof expectedResultCount === 'function') {
			assert(expectedResultCount(c));
		} else {
			assert.strictEqual(c, expectedResultCount, `rg ${c} !== ${expectedResultCount}`);
		}

		return results;
	});
}

flakySuite('TextSearch-integration', function () {

	test('Text: GameOfLife', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'GameOfLife' },
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (RegExp)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'Game.?fL\\w?fe', isRegExp: true }
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (unicode escape sequences)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'G\\u{0061}m\\u0065OfLife', isRegExp: true }
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (unicode escape sequences, force PCRE2)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: '(?<!a)G\\u{0061}m\\u0065OfLife', isRegExp: true }
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (PCRE2 RegExp)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			usePCRE2: true,
			contentPattern: { pattern: 'Life(?!P)', isRegExp: true }
		};

		return doSearchTest(config, 8);
	});

	test('Text: GameOfLife (RegExp to EOL)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'GameOfLife.*', isRegExp: true }
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (Word Match, Case Sensitive)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'GameOfLife', isWordMatch: true, isCaseSensitive: true }
		};

		return doSearchTest(config, 4);
	});

	test('Text: GameOfLife (Word Match, Spaces)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: ' GameOfLife ', isWordMatch: true }
		};

		return doSearchTest(config, 1);
	});

	test('Text: GameOfLife (Word Match, Punctuation and Spaces)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: ', as =', isWordMatch: true }
		};

		return doSearchTest(config, 1);
	});

	test('Text: Helvetica (UTF 16)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'Helvetica' }
		};

		return doSearchTest(config, 3);
	});

	test('Text: e', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'e' }
		};

		return doSearchTest(config, 785);
	});

	test('Text: e (with excludes)', () => {
		const config: any = {
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'e' },
			excludePattern: { '**/examples': true }
		};

		return doSearchTest(config, 391);
	});

	test('Text: e (with includes)', () => {
		const config: any = {
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'e' },
			includePattern: { '**/examples/**': true }
		};

		return doSearchTest(config, 394);
	});

	// TODO
	// test('Text: e (with absolute path excludes)', () => {
	// 	const config: any = {
	// 		folderQueries: ROOT_FOLDER_QUERY,
	// 		contentPattern: { pattern: 'e' },
	// 		excludePattern: makeExpression(path.join(TEST_FIXTURES, '**/examples'))
	// 	};

	// 	return doSearchTest(config, 394);
	// });

	// test('Text: e (with mixed absolute/relative path excludes)', () => {
	// 	const config: any = {
	// 		folderQueries: ROOT_FOLDER_QUERY,
	// 		contentPattern: { pattern: 'e' },
	// 		excludePattern: makeExpression(path.join(TEST_FIXTURES, '**/examples'), '*.css')
	// 	};

	// 	return doSearchTest(config, 310);
	// });

	test('Text: sibling exclude', () => {
		const config: any = {
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'm' },
			includePattern: makeExpression('**/site*'),
			excludePattern: { '*.css': { when: '$(basename).less' } }
		};

		return doSearchTest(config, 1);
	});

	test('Text: e (with includes and exclude)', () => {
		const config: any = {
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'e' },
			includePattern: { '**/examples/**': true },
			excludePattern: { '**/examples/small.js': true }
		};

		return doSearchTest(config, 371);
	});

	test('Text: a (capped)', () => {
		const maxResults = 520;
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'a' },
			maxResults
		};

		return doSearchTest(config, maxResults);
	});

	test('Text: a (no results)', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'ahsogehtdas' }
		};

		return doSearchTest(config, 0);
	});

	test('Text: -size', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: '-size' }
		};

		return doSearchTest(config, 9);
	});

	test('Multiroot: Conway', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: MULTIROOT_QUERIES,
			contentPattern: { pattern: 'conway' }
		};

		return doSearchTest(config, 8);
	});

	test('Multiroot: e with partial global exclude', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: MULTIROOT_QUERIES,
			contentPattern: { pattern: 'e' },
			excludePattern: makeExpression('**/*.txt')
		};

		return doSearchTest(config, 394);
	});

	test('Multiroot: e with global excludes', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: MULTIROOT_QUERIES,
			contentPattern: { pattern: 'e' },
			excludePattern: makeExpression('**/*.txt', '**/*.js')
		};

		return doSearchTest(config, 0);
	});

	test('Multiroot: e with folder exclude', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: [
				{
					folder: URI.file(EXAMPLES_FIXTURES), excludePattern: [{
						pattern: makeExpression('**/e*.js')
					}]
				},
				{ folder: URI.file(MORE_FIXTURES) }
			],
			contentPattern: { pattern: 'e' }
		};

		return doSearchTest(config, 298);
	});

	test('Text: 语', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: '语' }
		};

		return doSearchTest(config, 1).then(results => {
			const matchRange = (<ITextSearchMatch>results[0].results![0]).rangeLocations.map(e => e.source);
			assert.deepStrictEqual(matchRange, [{
				startLineNumber: 0,
				startColumn: 1,
				endLineNumber: 0,
				endColumn: 2
			}]);
		});
	});

	test('Multiple matches on line: h\\d,', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'h\\d,', isRegExp: true }
		};

		return doSearchTest(config, 15).then(results => {
			assert.strictEqual(results.length, 3);
			assert.strictEqual(results[0].results!.length, 1);
			const match = <ITextSearchMatch>results[0].results![0];
			assert.strictEqual((<ISearchRange[]>match.rangeLocations.map(e => e.source)).length, 5);
		});
	});

	test('Search with context matches', () => {
		const config: ITextQuery = {
			type: QueryType.Text,
			folderQueries: ROOT_FOLDER_QUERY,
			contentPattern: { pattern: 'compiler.typeCheck();' },
			surroundingContext: 1,
		};

		return doSearchTest(config, 3).then(results => {
			assert.strictEqual(results.length, 3);
			assert.strictEqual((<ITextSearchContext>results[0].results![0]).lineNumber, 24);
			assert.strictEqual((<ITextSearchContext>results[0].results![0]).text, '        compiler.addUnit(prog,"input.ts");');
			// assert.strictEqual((<ITextSearchMatch>results[1].results[0]).preview.text, '        compiler.typeCheck();\n'); // See https://github.com/BurntSushi/ripgrep/issues/1095
			assert.strictEqual((<ITextSearchContext>results[2].results![0]).lineNumber, 26);
			assert.strictEqual((<ITextSearchContext>results[2].results![0]).text, '        compiler.emit();');
		});
	});

	suite('error messages', () => {
		test('invalid encoding', () => {
			const config: ITextQuery = {
				type: QueryType.Text,
				folderQueries: [
					{
						...TEST_ROOT_FOLDER,
						fileEncoding: 'invalidEncoding'
					}
				],
				contentPattern: { pattern: 'test' },
			};

			return doSearchTest(config, 0).then(() => {
				throw new Error('expected fail');
			}, err => {
				const searchError = deserializeSearchError(err);
				assert.strictEqual(searchError.message, 'Unknown encoding: invalidEncoding');
				assert.strictEqual(searchError.code, SearchErrorCode.unknownEncoding);
			});
		});

		test('invalid regex case 1', () => {
			const config: ITextQuery = {
				type: QueryType.Text,
				folderQueries: ROOT_FOLDER_QUERY,
				contentPattern: { pattern: ')', isRegExp: true },
			};

			return doSearchTest(config, 0).then(() => {
				throw new Error('expected fail');
			}, err => {
				const searchError = deserializeSearchError(err);
				const regexParseErrorForUnclosedParenthesis = 'Regex parse error: unmatched closing parenthesis';
				assert.strictEqual(searchError.message, regexParseErrorForUnclosedParenthesis);
				assert.strictEqual(searchError.code, SearchErrorCode.regexParseError);
			});
		});

		test('invalid regex case 2', () => {
			const config: ITextQuery = {
				type: QueryType.Text,
				folderQueries: ROOT_FOLDER_QUERY,
				contentPattern: { pattern: '(?<!a.*)', isRegExp: true },
			};

			return doSearchTest(config, 0).then(() => {
				throw new Error('expected fail');
			}, err => {
				const searchError = deserializeSearchError(err);
				const regexParseErrorForLookAround = 'Regex parse error: length of lookbehind assertion is not limited';
				assert.strictEqual(searchError.message, regexParseErrorForLookAround);
				assert.strictEqual(searchError.code, SearchErrorCode.regexParseError);
			});
		});


		test('invalid glob', () => {
			const config: ITextQuery = {
				type: QueryType.Text,
				folderQueries: ROOT_FOLDER_QUERY,
				contentPattern: { pattern: 'foo' },
				includePattern: {
					'{{}': true
				}
			};

			return doSearchTest(config, 0).then(() => {
				throw new Error('expected fail');
			}, err => {
				const searchError = deserializeSearchError(err);
				assert.strictEqual(searchError.message, 'Error parsing glob \'/{{}\': nested alternate groups are not allowed');
				assert.strictEqual(searchError.code, SearchErrorCode.globParseError);
			});
		});
	});
});

function makeExpression(...patterns: string[]): glob.IExpression {
	return patterns.reduce((glob, pattern) => {
		// glob.ts needs forward slashes
		pattern = pattern.replace(/\\/g, '/');
		glob[pattern] = true;
		return glob;
	}, Object.create(null));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/textSearchManager.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/node/textSearchManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Progress } from '../../../../../platform/progress/common/progress.js';
import { ITextQuery, QueryType } from '../../common/search.js';
import { ProviderResult, TextSearchComplete2, TextSearchProviderOptions, TextSearchProvider2, TextSearchQuery2, TextSearchResult2 } from '../../common/searchExtTypes.js';
import { NativeTextSearchManager } from '../../node/textSearchManager.js';

suite('NativeTextSearchManager', () => {
	test('fixes encoding', async () => {
		let correctEncoding = false;
		const provider: TextSearchProvider2 = {
			provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: Progress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2> {
				correctEncoding = options.folderOptions[0].encoding === 'windows-1252';

				return null;
			}
		};

		const query: ITextQuery = {
			type: QueryType.Text,
			contentPattern: {
				pattern: 'a'
			},
			folderQueries: [{
				folder: URI.file('/some/folder'),
				fileEncoding: 'windows1252'
			}]
		};

		const m = new NativeTextSearchManager(query, provider);
		await m.search(() => { }, CancellationToken.None);

		assert.ok(correctEncoding);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/index.html]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/index.html

```html
<!DOCTYPE html>
<html>
<head id='headID'>
    <title>Strada </title>
    <link href="site.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.4.1.js"></script>
    <script src="../compiler/dtree.js" type="text/javascript"></script>
    <script src="../compiler/typescript.js" type="text/javascript"></script>
    <script type="text/javascript">

    // Compile strada source into resulting javascript
    function compile(prog, libText) {
        var outfile = {
          source: "",
          Write: function (s) { this.source += s; },
          WriteLine: function (s) { this.source += s + "\r"; },
        }

        var parseErrors = []

        var compiler=new Tools.TypeScriptCompiler(outfile,true);
        compiler.setErrorCallback(function(start,len, message) { parseErrors.push({start:start, len:len, message:message}); });
        compiler.addUnit(libText,"lib.ts");
        compiler.addUnit(prog,"input.ts");
        compiler.typeCheck();
        compiler.emit();

        if(parseErrors.length > 0 ) {
          //throw new Error(parseErrors);
        }

	while(outfile.source[0] == '/' && outfile.source[1] == '/' && outfile.source[2] == ' ') {
            outfile.source = outfile.source.slice(outfile.source.indexOf('\r')+1);
        }
        var errorPrefix = "";
	for(var i = 0;i<parseErrors.length;i++) {
          errorPrefix += "// Error: (" + parseErrors[i].start + "," + parseErrors[i].len + ") " + parseErrors[i].message + "\r";
        }

        return errorPrefix + outfile.source;
    }
    </script>
    <script type="text/javascript">

        var libText = "";
        $.get("../compiler/lib.ts", function(newLibText) {
            libText = newLibText;
        });


        // execute the javascript in the compiledOutput pane
        function execute() {
          $('#compilation').text("Running...");
          var txt = $('#compiledOutput').val();
          var res;
          try {
             var ret = eval(txt); // CodeQL [SM01632] This code is only used for tests
             res = "Ran successfully!";
          } catch(e) {
             res = "Exception thrown: " + e;
          }
          $('#compilation').text(String(res));
        }

        // recompile the stradaSrc and populate the compiledOutput pane
        function srcUpdated() {
            var newText = $('#stradaSrc').val();
            var compiledSource;
            try {
                compiledSource = compile(newText, libText);
            } catch (e) {
                compiledSource = "//Parse error"
                for(var i in e)
                  compiledSource += "\r// " + e[i];
            }
            $('#compiledOutput').val(compiledSource);
        }

        // Populate the stradaSrc pane with one of the built in samples
        function exampleSelectionChanged() {
            var examples = document.getElementById('examples');
            var selectedExample = examples.options[examples.selectedIndex].value;
            if (selectedExample != "") {
                $.get('examples/' + selectedExample, function (srcText) {
                    $('#stradaSrc').val(srcText);
                    setTimeout(srcUpdated,100);
                }, function (err) {
                    console.log(err);
                });
            }
        }

    </script>
</head>
<body>
    <h1>TypeScript</h1>
    <br />
    <select id="examples" onchange='exampleSelectionChanged()'>
        <option value="">Select...</option>
        <option value="small.ts">Small</option>
        <option value="employee.ts">Employees</option>
        <option value="conway.ts">Conway Game of Life</option>
        <option value="typescript.ts">TypeScript Compiler</option>
    </select>

    <div>
        <textarea id='stradaSrc' rows='40' cols='80' onchange='srcUpdated()' onkeyup='srcUpdated()' spellcheck="false">
//Type your TypeScript here...
      </textarea>
      <textarea id='compiledOutput' rows='40' cols='80' spellcheck="false">
//Compiled code will show up here...
      </textarea>
      <br />
      <button onclick='execute()'/>Run</button>
      <div id='compilation'>Press 'run' to execute code...</div>
      <div id='results'>...write your results into #results...</div>
    </div>
    <div id='bod' style='display:none'></div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/site.css]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/site.css

```css
/*----------------------------------------------------------
The base color for this template is #5c87b2. If you'd like
to use a different color start by replacing all instances of
#5c87b2 with your new color.
----------------------------------------------------------*/
body
{
    background-color: #5c87b2;
    font-size: .75em;
    font-family: Segoe UI, Verdana, Helvetica, Sans-Serif;
    margin: 8px;
    padding: 0;
    color: #696969;
}

h1, h2, h3, h4, h5, h6
{
    color: #000;
    font-size: 40px;
    margin: 0px;
}

textarea 
{
   font-family: Consolas
}

#results 
{
    margin-top: 2em;
    margin-left: 2em;
    color: black;
    font-size: medium;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/site.less]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/site.less

```less
// lss is mor
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/examples/company.js]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/examples/company.js

```javascript
'use strict';
/// <reference path="employee.ts" />
var Workforce;
(function (Workforce_1) {
    var Company = (function () {
        function Company() {
        }
        return Company;
    })();
    (function (property, Workforce, IEmployee) {
        if (property === undefined) { property = employees; }
        if (IEmployee === undefined) { IEmployee = []; }
        property;
        calculateMonthlyExpenses();
        {
            var result = 0;
            for (var i = 0; i < employees.length; i++) {
                result += employees[i].calculatePay();
            }
            return result;
        }
    });
})(Workforce || (Workforce = {}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/examples/employee.js]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/examples/employee.js

```javascript
'use strict';
var Workforce;
(function (Workforce) {
    var Employee = (function () {
        function Employee() {
        }
        return Employee;
    })();
    (property);
    name: string, property;
    basepay: number;
    implements;
    IEmployee;
    {
        name;
        basepay;
    }
    var SalesEmployee = (function () {
        function SalesEmployee() {
        }
        return SalesEmployee;
    })();
    ();
    Employee(name, basepay);
    {
        function calculatePay() {
            var multiplier = (document.getElementById("mult")), as = any, value;
            return _super.calculatePay.call(this) * multiplier + bonus;
        }
    }
    var employee = new Employee('Bob', 1000);
    var salesEmployee = new SalesEmployee('Jim', 800, 400);
    salesEmployee.calclatePay(); // error: No member 'calclatePay' on SalesEmployee
})(Workforce || (Workforce = {}));
extern;
var $;
var s = Workforce.salesEmployee.calculatePay();
$('#results').text(s);
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
a;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/examples/NullPoinderException.js]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/examples/NullPoinderException.js

```javascript
// CamelCase
'use strict';
var Conway;
(function (Conway) {
    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    })();
    (function (property, number, property, number, property, boolean) {
        if (property === undefined) { property = row; }
        if (property === undefined) { property = col; }
        if (property === undefined) { property = live; }
    });
    var GameOfLife = (function () {
        function GameOfLife() {
        }
        return GameOfLife;
    })();
    (function () {
        property;
        gridSize = 50;
        property;
        canvasSize = 600;
        property;
        lineColor = '#cdcdcd';
        property;
        liveColor = '#666';
        property;
        deadColor = '#eee';
        property;
        initialLifeProbability = 0.5;
        property;
        animationRate = 60;
        property;
        cellSize = 0;
        property;
        context: ICanvasRenderingContext2D;
        property;
        world = createWorld();
        circleOfLife();
        function createWorld() {
            return travelWorld(function (cell) {
                cell.live = Math.random() < initialLifeProbability;
                return cell;
            });
        }
        function circleOfLife() {
            world = travelWorld(function (cell) {
                cell = world[cell.row][cell.col];
                draw(cell);
                return resolveNextGeneration(cell);
            });
            setTimeout(function () { circleOfLife(); }, animationRate);
        }
        function resolveNextGeneration(cell) {
            var count = countNeighbors(cell);
            var newCell = new Cell(cell.row, cell.col, cell.live);
            if (count < 2 || count > 3)
                newCell.live = false;
            else if (count == 3)
                newCell.live = true;
            return newCell;
        }
        function countNeighbors(cell) {
            var neighbors = 0;
            for (var row = -1; row <= 1; row++) {
                for (var col = -1; col <= 1; col++) {
                    if (row == 0 && col == 0)
                        continue;
                    if (isAlive(cell.row + row, cell.col + col)) {
                        neighbors++;
                    }
                }
            }
            return neighbors;
        }
        function isAlive(row, col) {
            // todo - need to guard with worl[row] exists?
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize)
                return false;
            return world[row][col].live;
        }
        function travelWorld(callback) {
            var result = [];
            for (var row = 0; row < gridSize; row++) {
                var rowData = [];
                for (var col = 0; col < gridSize; col++) {
                    rowData.push(callback(new Cell(row, col, false)));
                }
                result.push(rowData);
            }
            return result;
        }
        function draw(cell) {
            if (context == null)
                context = createDrawingContext();
            if (cellSize == 0)
                cellSize = canvasSize / gridSize;
            context.strokeStyle = lineColor;
            context.strokeRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
            context.fillStyle = cell.live ? liveColor : deadColor;
            context.fillRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
        }
        function createDrawingContext() {
            var canvas = document.getElementById('conway-canvas');
            if (canvas == null) {
                canvas = document.createElement('canvas');
                canvas.id = "conway-canvas";
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                document.body.appendChild(canvas);
            }
            return canvas.getContext('2d');
        }
    });
})(Conway || (Conway = {}));
var game = new Conway.GameOfLife();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/examples/small.js]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/examples/small.js

```javascript
'use strict';
var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    (function (x, property, number) {
        if (property === undefined) { property = w; }
        var local = 1;
        // unresolved symbol because x is local
        //self.x++;
        self.w--; // ok because w is a property
        property;
        f = function (y) {
            return y + x + local + w + self.w;
        };
        function sum(z) {
            return z + f(z) + w + self.w;
        }
    });
})(M || (M = {}));
var c = new M.C(12, 5);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/examples/subfolder/subfile.txt]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/examples/subfolder/subfile.txt

```text
// sub
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/more/file.txt]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/more/file.txt

```text
Conway
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/node/fixtures/üm laut汉语/汉语.txt]---
Location: vscode-main/src/vs/workbench/services/search/test/node/fixtures/üm laut汉语/汉语.txt

```text
汉语
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/worker/localFileSearch.ts]---
Location: vscode-main/src/vs/workbench/services/search/worker/localFileSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as glob from '../../../../base/common/glob.js';
import { UriComponents, URI } from '../../../../base/common/uri.js';
import { IWebWorkerServerRequestHandler, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';
import { ILocalFileSearchWorker, LocalFileSearchWorkerHost, IWorkerFileSearchComplete, IWorkerFileSystemDirectoryHandle, IWorkerFileSystemHandle, IWorkerTextSearchComplete } from '../common/localFileSearchWorkerTypes.js';
import { ICommonQueryProps, IFileMatch, IFileQueryProps, IFolderQuery, IPatternInfo, ITextQueryProps, } from '../common/search.js';
import * as paths from '../../../../base/common/path.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { getFileResults } from '../common/getFileResults.js';
import { IgnoreFile } from '../common/ignoreFile.js';
import { createRegExp } from '../../../../base/common/strings.js';
import { Promises } from '../../../../base/common/async.js';
import { ExtUri } from '../../../../base/common/resources.js';
import { revive } from '../../../../base/common/marshalling.js';

const PERF = false;

type FileNode = {
	type: 'file';
	name: string;
	path: string;
	resolve: () => Promise<ArrayBuffer>;
};

type DirNode = {
	type: 'dir';
	name: string;
	entries: Promise<(DirNode | FileNode)[]>;
};

const globalStart = +new Date();
const itrcount: Record<string, number> = {};
const time = async <T>(name: string, task: () => Promise<T> | T) => {
	if (!PERF) { return task(); }

	const start = Date.now();
	const itr = (itrcount[name] ?? 0) + 1;
	console.info(name, itr, 'starting', Math.round((start - globalStart) * 10) / 10000);

	itrcount[name] = itr;
	const r = await task();
	const end = Date.now();
	console.info(name, itr, 'took', end - start);
	return r;
};

export function create(workerServer: IWebWorkerServer): IWebWorkerServerRequestHandler {
	return new LocalFileSearchWorker(workerServer);
}

export class LocalFileSearchWorker implements ILocalFileSearchWorker, IWebWorkerServerRequestHandler {
	_requestHandlerBrand: void = undefined;

	private readonly host: LocalFileSearchWorkerHost;
	cancellationTokens: Map<number, CancellationTokenSource> = new Map();

	constructor(workerServer: IWebWorkerServer) {
		this.host = LocalFileSearchWorkerHost.getChannel(workerServer);
	}

	$cancelQuery(queryId: number): void {
		this.cancellationTokens.get(queryId)?.cancel();
	}

	private registerCancellationToken(queryId: number): CancellationTokenSource {
		const source = new CancellationTokenSource();
		this.cancellationTokens.set(queryId, source);
		return source;
	}

	async $listDirectory(handle: IWorkerFileSystemDirectoryHandle, query: IFileQueryProps<UriComponents>, folderQuery: IFolderQuery<UriComponents>, ignorePathCasing: boolean, queryId: number): Promise<IWorkerFileSearchComplete> {
		const revivedFolderQuery = reviveFolderQuery(folderQuery);
		const extUri = new ExtUri(() => ignorePathCasing);

		const token = this.registerCancellationToken(queryId);
		const entries: string[] = [];
		let limitHit = false;
		let count = 0;

		const max = query.maxResults || 512;

		const filePatternMatcher = query.filePattern
			? (name: string) => query.filePattern!.split('').every(c => name.includes(c))
			: (name: string) => true;

		await time('listDirectory', () => this.walkFolderQuery(handle, reviveQueryProps(query), revivedFolderQuery, extUri, file => {
			if (!filePatternMatcher(file.name)) {
				return;
			}

			count++;

			if (max && count > max) {
				limitHit = true;
				token.cancel();
			}
			return entries.push(file.path);
		}, token.token));

		return {
			results: entries,
			limitHit
		};
	}

	async $searchDirectory(handle: IWorkerFileSystemDirectoryHandle, query: ITextQueryProps<UriComponents>, folderQuery: IFolderQuery<UriComponents>, ignorePathCasing: boolean, queryId: number): Promise<IWorkerTextSearchComplete> {
		const revivedQuery = reviveFolderQuery(folderQuery);
		const extUri = new ExtUri(() => ignorePathCasing);

		return time('searchInFiles', async () => {
			const token = this.registerCancellationToken(queryId);

			const results: IFileMatch[] = [];

			const pattern = createSearchRegExp(query.contentPattern);

			const onGoingProcesses: Promise<void>[] = [];

			let fileCount = 0;
			let resultCount = 0;
			const limitHit = false;

			const processFile = async (file: FileNode) => {
				if (token.token.isCancellationRequested) {
					return;
				}

				fileCount++;

				const contents = await file.resolve();
				if (token.token.isCancellationRequested) {
					return;
				}

				const bytes = new Uint8Array(contents);
				const fileResults = getFileResults(bytes, pattern, {
					surroundingContext: query.surroundingContext ?? 0,
					previewOptions: query.previewOptions,
					remainingResultQuota: query.maxResults ? (query.maxResults - resultCount) : 10000,
				});

				if (fileResults.length) {
					resultCount += fileResults.length;
					if (query.maxResults && resultCount > query.maxResults) {
						token.cancel();
					}
					const match = {
						resource: URI.joinPath(revivedQuery.folder, file.path),
						results: fileResults,
					};
					this.host.$sendTextSearchMatch(match, queryId);
					results.push(match);
				}
			};

			await time('walkFolderToResolve', () =>
				this.walkFolderQuery(handle, reviveQueryProps(query), revivedQuery, extUri, async file => onGoingProcesses.push(processFile(file)), token.token)
			);

			await time('resolveOngoingProcesses', () => Promise.all(onGoingProcesses));

			if (PERF) { console.log('Searched in', fileCount, 'files'); }

			return {
				results,
				limitHit,
			};
		});

	}

	private async walkFolderQuery(handle: IWorkerFileSystemDirectoryHandle, queryProps: ICommonQueryProps<URI>, folderQuery: IFolderQuery<URI>, extUri: ExtUri, onFile: (file: FileNode) => Promise<unknown> | unknown, token: CancellationToken): Promise<void> {

		const folderExcludes = folderQuery.excludePattern?.map(excludePattern => glob.parse(excludePattern.pattern ?? {}, { trimForExclusions: true }) as glob.ParsedExpression);

		const evalFolderExcludes = (path: string, basename: string, hasSibling: (query: string) => boolean) => {
			return folderExcludes?.some(folderExclude => {
				return folderExclude(path, basename, hasSibling);
			});

		};
		// For folders, only check if the folder is explicitly excluded so walking continues.
		const isFolderExcluded = (path: string, basename: string, hasSibling: (query: string) => boolean) => {
			path = path.slice(1);
			if (evalFolderExcludes(path, basename, hasSibling)) { return true; }
			if (pathExcludedInQuery(queryProps, path)) { return true; }
			return false;
		};

		// For files ensure the full check takes place.
		const isFileIncluded = (path: string, basename: string, hasSibling: (query: string) => boolean) => {
			path = path.slice(1);
			if (evalFolderExcludes(path, basename, hasSibling)) { return false; }
			if (!pathIncludedInQuery(queryProps, path, extUri)) { return false; }
			return true;
		};

		const processFile = (file: FileSystemFileHandle, prior: string): FileNode => {

			const resolved: FileNode = {
				type: 'file',
				name: file.name,
				path: prior,
				resolve: () => file.getFile().then(r => r.arrayBuffer())
			} as const;

			return resolved;
		};

		const isFileSystemDirectoryHandle = (handle: IWorkerFileSystemHandle): handle is FileSystemDirectoryHandle => {
			return handle.kind === 'directory';
		};

		const isFileSystemFileHandle = (handle: IWorkerFileSystemHandle): handle is FileSystemFileHandle => {
			return handle.kind === 'file';
		};

		const processDirectory = async (directory: IWorkerFileSystemDirectoryHandle, prior: string, ignoreFile?: IgnoreFile): Promise<DirNode> => {

			if (!folderQuery.disregardIgnoreFiles) {
				const ignoreFiles = await Promise.all([
					directory.getFileHandle('.gitignore').catch(e => undefined),
					directory.getFileHandle('.ignore').catch(e => undefined),
				]);

				await Promise.all(ignoreFiles.map(async file => {
					if (!file) { return; }

					const ignoreContents = new TextDecoder('utf8').decode(new Uint8Array(await (await file.getFile()).arrayBuffer()));
					ignoreFile = new IgnoreFile(ignoreContents, prior, ignoreFile);
				}));
			}

			const entries = Promises.withAsyncBody<(FileNode | DirNode)[]>(async c => {
				const files: FileNode[] = [];
				const dirs: Promise<DirNode>[] = [];

				const entries: [string, IWorkerFileSystemHandle][] = [];
				const sibilings = new Set<string>();

				for await (const entry of directory.entries()) {
					entries.push(entry);
					sibilings.add(entry[0]);
				}

				for (const [basename, handle] of entries) {
					if (token.isCancellationRequested) {
						break;
					}

					const path = prior + basename;

					if (ignoreFile && !ignoreFile.isPathIncludedInTraversal(path, handle.kind === 'directory')) {
						continue;
					}

					const hasSibling = (query: string) => sibilings.has(query);

					if (isFileSystemDirectoryHandle(handle) && !isFolderExcluded(path, basename, hasSibling)) {
						dirs.push(processDirectory(handle, path + '/', ignoreFile));
					} else if (isFileSystemFileHandle(handle) && isFileIncluded(path, basename, hasSibling)) {
						files.push(processFile(handle, path));
					}
				}
				c([...await Promise.all(dirs), ...files]);
			});

			return {
				type: 'dir',
				name: directory.name,
				entries
			};
		};

		const resolveDirectory = async (directory: DirNode, onFile: (f: FileNode) => Promise<unknown> | unknown) => {
			if (token.isCancellationRequested) { return; }

			await Promise.all(
				(await directory.entries)
					.sort((a, b) => -(a.type === 'dir' ? 0 : 1) + (b.type === 'dir' ? 0 : 1))
					.map(async entry => {
						if (entry.type === 'dir') {
							return resolveDirectory(entry, onFile);
						}
						else {
							return onFile(entry);
						}
					}));
		};

		const processed = await time('process', () => processDirectory(handle, '/'));
		await time('resolve', () => resolveDirectory(processed, onFile));
	}
}

function createSearchRegExp(options: IPatternInfo): RegExp {
	return createRegExp(options.pattern, !!options.isRegExp, {
		wholeWord: options.isWordMatch,
		global: true,
		matchCase: options.isCaseSensitive,
		multiline: true,
		unicode: true,
	});
}

function reviveFolderQuery(folderQuery: IFolderQuery<UriComponents>): IFolderQuery<URI> {
	// @todo: andrea - try to see why we can't just call 'revive' here
	return revive({
		...revive(folderQuery),
		excludePattern: folderQuery.excludePattern?.map(ep => ({ folder: URI.revive(ep.folder), pattern: ep.pattern })),
		folder: URI.revive(folderQuery.folder),
	});
}

function reviveQueryProps(queryProps: ICommonQueryProps<UriComponents>): ICommonQueryProps<URI> {
	return {
		...queryProps,
		extraFileResources: queryProps.extraFileResources?.map(r => URI.revive(r)),
		folderQueries: queryProps.folderQueries.map(fq => reviveFolderQuery(fq)),
	};
}


function pathExcludedInQuery(queryProps: ICommonQueryProps<URI>, fsPath: string): boolean {
	if (queryProps.excludePattern && glob.match(queryProps.excludePattern, fsPath)) {
		return true;
	}
	return false;
}

function pathIncludedInQuery(queryProps: ICommonQueryProps<URI>, path: string, extUri: ExtUri): boolean {
	if (queryProps.excludePattern && glob.match(queryProps.excludePattern, path)) {
		return false;
	}

	if (queryProps.includePattern || queryProps.usingSearchPaths) {
		if (queryProps.includePattern && glob.match(queryProps.includePattern, path)) {
			return true;
		}

		// If searchPaths are being used, the extra file must be in a subfolder and match the pattern, if present
		if (queryProps.usingSearchPaths) {

			return !!queryProps.folderQueries && queryProps.folderQueries.some(fq => {
				const searchPath = fq.folder;
				const uri = URI.file(path);
				if (extUri.isEqualOrParent(uri, searchPath)) {
					const relPath = paths.relative(searchPath.path, uri.path);
					return !fq.includePattern || !!glob.match(fq.includePattern, relPath);
				} else {
					return false;
				}
			});
		}

		return false;
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/worker/localFileSearchMain.ts]---
Location: vscode-main/src/vs/workbench/services/search/worker/localFileSearchMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bootstrapWebWorker } from '../../../../base/common/worker/webWorkerBootstrap.js';
import { create } from './localFileSearch.js';

bootstrapWebWorker(create);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/secrets/browser/secretStorageService.ts]---
Location: vscode-main/src/vs/workbench/services/secrets/browser/secretStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SequencerByKey } from '../../../../base/common/async.js';
import { IEncryptionService } from '../../../../platform/encryption/common/encryptionService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ISecretStorageProvider, ISecretStorageService, BaseSecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';

export class BrowserSecretStorageService extends BaseSecretStorageService {

	private readonly _secretStorageProvider: ISecretStorageProvider | undefined;
	private readonly _embedderSequencer: SequencerByKey<string> | undefined;

	constructor(
		@IStorageService storageService: IStorageService,
		@IEncryptionService encryptionService: IEncryptionService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@ILogService logService: ILogService
	) {
		// We don't have encryption in the browser so instead we use the
		// in-memory base class implementation instead.
		super(true, storageService, encryptionService, logService);

		if (environmentService.options?.secretStorageProvider) {
			this._secretStorageProvider = environmentService.options.secretStorageProvider;
			this._embedderSequencer = new SequencerByKey<string>();
		}
	}

	override get(key: string): Promise<string | undefined> {
		if (this._secretStorageProvider) {
			return this._embedderSequencer!.queue(key, () => this._secretStorageProvider!.get(key));
		}

		return super.get(key);
	}

	override set(key: string, value: string): Promise<void> {
		if (this._secretStorageProvider) {
			return this._embedderSequencer!.queue(key, async () => {
				await this._secretStorageProvider!.set(key, value);
				this.onDidChangeSecretEmitter.fire(key);
			});
		}

		return super.set(key, value);
	}

	override delete(key: string): Promise<void> {
		if (this._secretStorageProvider) {
			return this._embedderSequencer!.queue(key, async () => {
				await this._secretStorageProvider!.delete(key);
				this.onDidChangeSecretEmitter.fire(key);
			});
		}

		return super.delete(key);
	}

	override get type() {
		if (this._secretStorageProvider) {
			return this._secretStorageProvider.type;
		}

		return super.type;
	}

	override keys(): Promise<string[]> {
		if (this._secretStorageProvider) {
			if (!this._secretStorageProvider.keys) {
				throw new Error('Secret storage provider does not support keys() method');
			}
			return this._secretStorageProvider!.keys();
		}

		return super.keys();

	}
}

registerSingleton(ISecretStorageService, BrowserSecretStorageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
